/**
 * The publish flow for the packed wallet profiles, with Firestore passed in
 * so the test can run the same steps against an in-memory store.
 *
 * Order matters and is the whole safety argument:
 *   1. refuse unless the file is sound;
 *   2. refuse unless the file and the profile documents are from the same
 *      export run (walletProfilesMeta/current);
 *   3. write the parts under this generation's own ids;
 *   4. read them back and open them; they must equal the JSON built in 1;
 *   5. only then move the pointer, in a transaction that re-reads the stamp
 *      and the pointer: it moves only if this is still the newest export;
 *   6. drop generations older than the previous one.
 * Anything that goes wrong before 5 leaves the last good generation live.
 * Parts the live pointer names are never deleted, and once step 5 has been
 * attempted this run does not delete its own parts at all.
 */

import {
  PACK_PART_BYTES,
  WALLET_PROFILES_PACK_COLLECTION,
  WALLET_PROFILES_PACK_POINTER_ID,
  checkPackPointer,
} from '../../src/lib/walletProfilesPack.js';
import { buildPack, openPack } from './walletProfilesPackNode.js';
import {
  WALLET_PROFILES_META_COLLECTION,
  WALLET_PROFILES_META_DOC_ID,
} from './loadWalletProfiles.js';

const mb = (n) => `${(n / 1048576).toFixed(2)} MB`;
const stampMs = (raw) => {
  if (!raw) return null;
  if (typeof raw.toDate === 'function') return raw.toDate().getTime();
  const t = Date.parse(raw);
  return Number.isFinite(t) ? t : null;
};

/**
 * mode: 'offline' (no Firestore), 'check' (reads only), 'write'.
 * Returns { outcome, code, pointer? } where outcome is one of
 *   offline | checked | published | already-published | refused | failed
 * and code is the process exit code (1 only for failed).
 */
export async function publishWalletProfilesPack({
  file,
  mode = 'offline',
  db = null,
  serverTimestamp = () => new Date(),
  partBytes = PACK_PART_BYTES,
  log = console.log,
  warn = console.warn,
}) {
  // ── 1. Build, then open what was built ─────────────────────────
  let built;
  try {
    built = buildPack(file, { partBytes });
  } catch (err) {
    log(`REFUSED: ${err.message}. Nothing published.`);
    return { outcome: 'refused', code: 0 };
  }
  const { pointer, parts, json } = built;
  if (openPack(pointer, parts).json !== json) {
    warn('FAILED: self-check: the pack does not open back to its own JSON.');
    return { outcome: 'failed', code: 1 };
  }
  log(
    `Built generation ${pointer.generation}: ${pointer.walletCount} profiles, `
    + `${mb(pointer.jsonBytes)} of JSON, ${mb(pointer.gzipBytes)} gzipped, ${pointer.partCount} parts `
    + `(largest ${mb(Math.max(...parts.map((p) => p.data.length)))}). Self-check passed.`,
  );
  if (mode === 'offline') {
    log('Offline run. Pass --check to compare against Firestore (read-only) or --write to publish.');
    return { outcome: 'offline', code: 0, pointer };
  }

  // ── 2. Is the file from the same run as the profile documents? ──
  const packCol = db.collection(WALLET_PROFILES_PACK_COLLECTION);
  const pointerRef = packCol.doc(WALLET_PROFILES_PACK_POINTER_ID);
  const stampRef = db.collection(WALLET_PROFILES_META_COLLECTION).doc(WALLET_PROFILES_META_DOC_ID);
  const [stampSnap, pointerSnap] = await Promise.all([stampRef.get(), pointerRef.get()]);
  const stamp = stampSnap.exists ? stampSnap.data() : null;
  const stampAt = stampMs(stamp?.generatedAt);
  if (stampAt == null || stampAt !== Date.parse(file.generatedAt) || stamp?.walletCount !== pointer.walletCount) {
    log(
      'REFUSED: the file and the profile documents are not from the same export run '
      + `(file ${file.generatedAt} / ${pointer.walletCount} profiles, Firestore stamp `
      + `${stampAt == null ? 'missing' : new Date(stampAt).toISOString()} / ${stamp?.walletCount ?? '?'} profiles). `
      + 'Nothing published; the last good generation stays live.',
    );
    return { outcome: 'refused', code: 0 };
  }
  log(`Same export run as the profile documents (${file.generatedAt}, ${pointer.walletCount} profiles).`);

  const live = pointerSnap.exists ? pointerSnap.data() : null;
  const liveOk = live ? checkPackPointer(live).ok : false;
  if (liveOk && live.generation === pointer.generation) {
    if (live.sha256 === pointer.sha256) {
      log(`Already published: generation ${pointer.generation} is live with the same bytes. Nothing to do.`);
      return { outcome: 'already-published', code: 0, pointer };
    }
    // Rewriting a live generation in place could hand a reader mixed parts.
    log(
      `REFUSED: generation ${pointer.generation} is already live with different bytes. `
      + 'Not rewriting a live generation; the next export publishes a new one.',
    );
    return { outcome: 'refused', code: 0 };
  }
  log(live
    ? `Live generation is ${live.generation ?? '(unreadable)'}; this run would replace it.`
    : 'No generation is live yet; this run would publish the first.');
  if (mode !== 'write') {
    log('Read-only check passed. Pass --write to publish.');
    return { outcome: 'checked', code: 0, pointer };
  }

  // ── 3. Write the parts ─────────────────────────────────────────
  const refs = parts.map((p) => packCol.doc(p.id));
  // Used only before this run has tried to move the pointer. Even then it
  // looks first: parts the live pointer names are never deleted.
  const removeUnreachableParts = async () => {
    try {
      const now = await pointerRef.get();
      if (now.exists && now.get('generation') === pointer.generation) {
        warn(`The live pointer names generation ${pointer.generation}; leaving its parts in place.`);
        return;
      }
    } catch (err) {
      warn(`Could not read the pointer (${err.message}); leaving the new parts for a later run to remove.`);
      return;
    }
    await Promise.allSettled(refs.map((r) => r.delete()));
  };
  try {
    for (let i = 0; i < parts.length; i += 1) {
      const p = parts[i];
      await refs[i].set({
        formatVersion: pointer.formatVersion,
        generation: p.generation,
        index: p.index,
        partCount: p.partCount,
        data: p.data,
        writtenAt: serverTimestamp(),
      });
    }
  } catch (err) {
    await removeUnreachableParts();
    warn(`FAILED: writing parts: ${err.message}. Pointer not moved; the last good generation stays live.`);
    return { outcome: 'failed', code: 1 };
  }
  log(`Wrote ${parts.length} parts.`);

  // ── 4. Read them back ──────────────────────────────────────────
  let verified = false;
  try {
    const snaps = await db.getAll(...refs);
    const readBack = snaps.map((s) => ({
      generation: s.get('generation'),
      index: s.get('index'),
      data: s.get('data'),
    }));
    verified = openPack(pointer, readBack).json === json;
    if (!verified) warn('Read-back does not match the JSON this run built.');
  } catch (err) {
    warn(`Read-back failed: ${err.message}`);
  }
  if (!verified) {
    await removeUnreachableParts();
    warn('FAILED: pointer not moved; the last good generation stays live.');
    return { outcome: 'failed', code: 1 };
  }

  // ── 5. Move the pointer ────────────────────────────────────────
  // One transaction re-reads the stamp and the pointer and moves the pointer
  // only if this is still the newest export. Two grade runs that overlap can
  // therefore never leave the older one's copy live.
  let move;
  try {
    move = await db.runTransaction(async (tx) => {
      const stampNowSnap = await tx.get(stampRef);
      const liveNowSnap = await tx.get(pointerRef);
      const stampNow = stampNowSnap.exists ? stampNowSnap.data() : null;
      if (stampMs(stampNow?.generatedAt) !== Date.parse(file.generatedAt) || stampNow?.walletCount !== pointer.walletCount) {
        return { moved: false, why: 'a newer export rebuilt the profile documents while this run was publishing' };
      }
      const liveNow = liveNowSnap.exists ? liveNowSnap.data() : null;
      const liveNowOk = liveNow ? checkPackPointer(liveNow).ok : false;
      if (liveNowOk && liveNow.generation === pointer.generation) {
        return { moved: false, why: 'another run published this generation while this run was publishing' };
      }
      if (liveNowOk && Date.parse(liveNow.generatedAt) > Date.parse(pointer.generatedAt)) {
        return { moved: false, why: `a newer generation (${liveNow.generation}) is already live` };
      }
      const prev = liveNowOk ? liveNow.generation : null;
      tx.set(pointerRef, { ...pointer, previousGeneration: prev, publishedAt: serverTimestamp() });
      return { moved: true, previousGeneration: prev };
    });
  } catch (err) {
    // A write can report an error and still have landed. From here on this
    // run never deletes its own parts: if the pointer did move they are the
    // live copy, and if it did not a later run removes them.
    let landed = null;
    try {
      const now = await pointerRef.get();
      if (now.exists && now.get('generation') === pointer.generation && now.get('sha256') === pointer.sha256) landed = now.data();
    } catch { /* cannot tell; treated as not landed, parts stay */ }
    if (!landed) {
      warn(
        `FAILED: moving the pointer: ${err.message}. The pointer does not name this generation; `
        + 'its parts are left in place and a later run removes them.',
      );
      return { outcome: 'failed', code: 1 };
    }
    warn(`The pointer write reported an error (${err.message}) but the pointer did move.`);
    move = { moved: true, previousGeneration: landed.previousGeneration ?? null };
  }
  if (!move.moved) {
    await removeUnreachableParts();
    log(`REFUSED: ${move.why}. Pointer not moved by this run.`);
    return { outcome: 'refused', code: 0 };
  }
  const { previousGeneration } = move;
  log(`✓ Published generation ${pointer.generation} (read-back matched). Pointer moved.`);

  // ── 6. Drop generations older than the previous one ────────────
  // The previous one stays so a reader that fetched the old pointer a moment
  // ago can still fetch its parts. Only OLDER generations go: parts newer
  // than the live one may belong to a run that is publishing right now.
  try {
    const oldestKept = previousGeneration && previousGeneration < pointer.generation
      ? previousGeneration
      : pointer.generation;
    const all = await packCol.select('generation').get();
    const stale = all.docs.filter((d) => {
      if (d.id === WALLET_PROFILES_PACK_POINTER_ID) return false;
      const g = d.get('generation');
      return typeof g === 'string' && g < oldestKept;
    });
    for (const d of stale) await d.ref.delete();
    log(`Removed ${stale.length} parts from older generations.`);
  } catch (err) {
    warn(`Cleanup of older generations failed (harmless, retried next run): ${err.message}`);
  }
  return { outcome: 'published', code: 0, pointer };
}
