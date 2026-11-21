/**
 * One compressed copy of every wallet profile, stored in a few Firestore
 * documents.
 *
 * WHY: the Sharp Flow page downloads sharpWalletProfiles one document at a
 * time: 1,494 documents and about 29 MB of data on 2026-11-21, on every open.
 * Data download was 61% of the Firestore bill for the 30 days to that date.
 * The same data, gzipped, is about 4 MB and fits in five documents.
 *
 * SHAPE
 *   walletProfilesPacked/current            the pointer: which generation is
 *                                           live, how many parts, their hash
 *   walletProfilesPacked/<generation>_p000  the gzip bytes, in order
 *   walletProfilesPacked/<generation>_p001  …
 *
 * A generation is one run of the profile export. Parts are written under
 * the generation's own ids and the pointer moves last, so a reader never
 * sees half of one generation and half of another.
 *
 * This file holds the parts of the format that the writer (Node) and a
 * reader (browser) must agree on. It imports nothing, so both can load it.
 * Compression and hashing live with whoever does them.
 */

export const WALLET_PROFILES_PACK_COLLECTION = 'walletProfilesPacked';
export const WALLET_PROFILES_PACK_POINTER_ID = 'current';
export const WALLET_PROFILES_PACK_FORMAT = 1;

/** A Firestore document holds at most 1,048,576 bytes. Leave room for the other fields. */
export const PACK_PART_BYTES = 900_000;
/** Same floor the server's file loader uses: fewer than this is a cut-off file. */
export const PACK_MIN_PROFILE_COUNT = 100;

/** Document-id-safe name for one export run, from its generatedAt stamp. */
export function packGenerationId(generatedAt) {
  const t = Date.parse(generatedAt);
  if (!Number.isFinite(t)) throw new Error(`generatedAt is not a date: ${generatedAt}`);
  return new Date(t).toISOString().replace(/[:.]/g, '-');
}

export function packPartId(generation, index) {
  if (!generation || !Number.isInteger(index) || index < 0 || index > 999) {
    throw new Error(`bad part id (${generation}, ${index})`);
  }
  return `${generation}_p${String(index).padStart(3, '0')}`;
}

/** Cut the gzip bytes into parts of at most partBytes each. Never returns an empty list. */
export function splitPackBytes(bytes, partBytes = PACK_PART_BYTES) {
  if (!(bytes instanceof Uint8Array) || bytes.length === 0) throw new Error('nothing to split');
  if (!Number.isInteger(partBytes) || partBytes <= 0) throw new Error(`bad part size ${partBytes}`);
  const parts = [];
  for (let at = 0; at < bytes.length; at += partBytes) {
    parts.push(bytes.subarray(at, Math.min(bytes.length, at + partBytes)));
  }
  return parts;
}

/**
 * Check a pointer document. Returns { ok: true } or { ok: false, reason }.
 * A reader must fall back to the full collection on any false.
 */
export function checkPackPointer(pointer) {
  if (!pointer || typeof pointer !== 'object') return { ok: false, reason: 'no pointer' };
  if (pointer.formatVersion !== WALLET_PROFILES_PACK_FORMAT) {
    return { ok: false, reason: `format ${pointer.formatVersion}, this code reads ${WALLET_PROFILES_PACK_FORMAT}` };
  }
  if (!pointer.generation || typeof pointer.generation !== 'string') return { ok: false, reason: 'no generation' };
  if (!Number.isFinite(Date.parse(pointer.generatedAt))) return { ok: false, reason: 'no generatedAt' };
  if (!Number.isInteger(pointer.partCount) || pointer.partCount < 1 || pointer.partCount > 999) {
    return { ok: false, reason: `part count ${pointer.partCount}` };
  }
  if (!Number.isInteger(pointer.gzipBytes) || pointer.gzipBytes < 1) return { ok: false, reason: 'no gzip size' };
  if (!Number.isInteger(pointer.walletCount) || pointer.walletCount < PACK_MIN_PROFILE_COUNT) {
    return { ok: false, reason: `only ${pointer.walletCount} profiles` };
  }
  if (typeof pointer.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(pointer.sha256)) {
    return { ok: false, reason: 'no hash' };
  }
  return { ok: true };
}

/**
 * Put the parts back together. Every part must belong to the pointer's
 * generation, each index must appear exactly once, and the total must be the
 * size the pointer promised. Throws with the reason otherwise.
 *
 * parts: [{ generation, index, data: Uint8Array }]
 */
export function joinPackParts(pointer, parts) {
  const checked = checkPackPointer(pointer);
  if (!checked.ok) throw new Error(`pointer rejected: ${checked.reason}`);
  if (!Array.isArray(parts) || parts.length !== pointer.partCount) {
    throw new Error(`${Array.isArray(parts) ? parts.length : 0} parts, pointer says ${pointer.partCount}`);
  }
  const byIndex = new Array(pointer.partCount).fill(null);
  for (const part of parts) {
    if (!part || part.generation !== pointer.generation) {
      throw new Error(`part from generation ${part?.generation}, pointer is ${pointer.generation}`);
    }
    if (!Number.isInteger(part.index) || part.index < 0 || part.index >= pointer.partCount) {
      throw new Error(`part index ${part.index} outside 0..${pointer.partCount - 1}`);
    }
    if (byIndex[part.index]) throw new Error(`part ${part.index} twice`);
    if (!(part.data instanceof Uint8Array) || part.data.length === 0) {
      throw new Error(`part ${part.index} has no bytes`);
    }
    byIndex[part.index] = part.data;
  }
  const total = byIndex.reduce((sum, data) => sum + data.length, 0);
  if (total !== pointer.gzipBytes) throw new Error(`${total} bytes, pointer says ${pointer.gzipBytes}`);
  const out = new Uint8Array(total);
  let at = 0;
  for (const data of byIndex) { out.set(data, at); at += data.length; }
  return out;
}

/**
 * Check what came out of the gzip against the pointer. Returns the profiles
 * object, keyed by the same ids as the sharpWalletProfiles documents. Throws
 * with the reason otherwise.
 */
export function profilesFromPackPayload(pointer, payload) {
  const profiles = payload?.profiles;
  if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) {
    throw new Error('payload has no profiles object');
  }
  if (payload.generatedAt !== pointer.generatedAt) {
    throw new Error(`payload generatedAt ${payload.generatedAt}, pointer says ${pointer.generatedAt}`);
  }
  const ids = Object.keys(profiles);
  if (ids.length !== pointer.walletCount) {
    throw new Error(`${ids.length} profiles, pointer says ${pointer.walletCount}`);
  }
  if (ids.length < PACK_MIN_PROFILE_COUNT) throw new Error(`only ${ids.length} profiles`);
  for (const id of ids) {
    const p = profiles[id];
    if (!id || !p || typeof p !== 'object' || Array.isArray(p)) throw new Error(`profile ${id} is not an object`);
  }
  // Same spot-check the server's file loader makes.
  if (profiles[ids[0]].bySport == null) throw new Error('first profile has no bySport');
  return profiles;
}
