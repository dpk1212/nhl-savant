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
 *   5. only then move the pointer;
 *   6. drop generations older than the previous one.
 * Anything that goes wrong before 5 leaves the last good generation live.
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
  const [stampSnap, pointerSnap] = await Promise.all([
    db.collection(WALLET_PROFILES_META_COLLECTION).doc(WALLET_PROFILES_META_DOC_ID).get(),
    pointerRef.get(),
  ]);
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
  const removeParts = () => Promise.allSettled(refs.map((r) => r.delete()));
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
    // The pointer never moved, so no reader can reach these parts. Remove them.
    await removeParts();
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
    await removeParts();
    warn('FAILED: pointer not moved; the last good generation stays live.');
    return { outcome: 'failed', code: 1 };
  }

  // ── 5. Move the pointer ────────────────────────────────────────
  const previousGeneration = liveOk ? live.generation : null;
  try {
    await pointerRef.set({ ...pointer, previousGeneration, publishedAt: serverTimestamp() });
  } catch (err) {
    await removeParts();
    warn(`FAILED: moving the pointer: ${err.message}. The last good generation stays live.`);
    return { outcome: 'failed', code: 1 };
  }
  log(`✓ Published generation ${pointer.generation} (read-back matched). Pointer moved.`);

  // ── 6. Drop generations older than the previous one ────────────
  // The previous one stays so a reader that fetched the old pointer a moment
  // ago can still fetch its parts.
  try {
    const keep = new Set([pointer.generation, previousGeneration].filter(Boolean));
    const all = await packCol.select('generation').get();
    const stale = all.docs.filter((d) => d.id !== WALLET_PROFILES_PACK_POINTER_ID && !keep.has(d.get('generation')));
    for (const d of stale) await d.ref.delete();
    log(`Removed ${stale.length} parts from older generations.`);
  } catch (err) {
    warn(`Cleanup of older generations failed (harmless, retried next run): ${err.message}`);
  }
  return { outcome: 'published', code: 0, pointer };
}
