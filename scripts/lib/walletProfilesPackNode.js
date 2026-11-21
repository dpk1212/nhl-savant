/**
 * Node side of the packed wallet profiles: gzip, hash, and the round trip.
 * The format itself is in src/lib/walletProfilesPack.js.
 */

import { createHash } from 'crypto';
import { Buffer } from 'buffer';
import { gunzipSync, gzipSync } from 'zlib';
import {
  PACK_MIN_PROFILE_COUNT,
  PACK_PART_BYTES,
  WALLET_PROFILES_PACK_FORMAT,
  joinPackParts,
  packGenerationId,
  packPartId,
  profilesFromPackPayload,
  splitPackBytes,
} from '../../src/lib/walletProfilesPack.js';

const sha256Hex = (bytes) => createHash('sha256').update(bytes).digest('hex');

/**
 * Check the committed profiles file the same way the server's loader does
 * (scripts/lib/loadWalletProfiles.js), minus the age limit: this runs right
 * after the export wrote the file. Returns { ok, reason } or { ok, file }.
 */
export function checkProfilesFile(file) {
  const profiles = file?.profiles;
  if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) {
    return { ok: false, reason: 'missing profiles object' };
  }
  if (!Number.isFinite(Date.parse(file.generatedAt))) return { ok: false, reason: 'missing generatedAt' };
  const ids = Object.keys(profiles);
  if (ids.length < PACK_MIN_PROFILE_COUNT) {
    return { ok: false, reason: `only ${ids.length} profiles (min ${PACK_MIN_PROFILE_COUNT})` };
  }
  for (const id of ids) {
    const p = profiles[id];
    if (!id || !p || typeof p !== 'object' || Array.isArray(p)) {
      return { ok: false, reason: `profile ${id} is not an object` };
    }
  }
  if (profiles[ids[0]].bySport == null) return { ok: false, reason: 'first profile has no bySport' };
  return { ok: true, walletCount: ids.length };
}

/**
 * Build one generation from the profiles file.
 * Returns { pointer, parts: [{ id, generation, index, data: Buffer }], json }.
 * The pointer carries no timestamp; the caller adds one when it writes.
 */
export function buildPack(file, { partBytes = PACK_PART_BYTES } = {}) {
  const checked = checkProfilesFile(file);
  if (!checked.ok) throw new Error(`profiles file rejected: ${checked.reason}`);
  const payload = {
    generatedAt: file.generatedAt,
    whitelistVersion: file.whitelistVersion ?? null,
    profiles: file.profiles,
  };
  const json = JSON.stringify(payload);
  const gzip = gzipSync(Buffer.from(json, 'utf8'), { level: 9 });
  const generation = packGenerationId(file.generatedAt);
  const chunks = splitPackBytes(gzip, partBytes);
  const pointer = {
    formatVersion: WALLET_PROFILES_PACK_FORMAT,
    generation,
    generatedAt: file.generatedAt,
    whitelistVersion: file.whitelistVersion ?? null,
    walletCount: checked.walletCount,
    partCount: chunks.length,
    gzipBytes: gzip.length,
    jsonBytes: Buffer.byteLength(json, 'utf8'),
    sha256: sha256Hex(gzip),
  };
  const parts = chunks.map((data, index) => ({
    id: packPartId(generation, index),
    generation,
    index,
    partCount: chunks.length,
    data: Buffer.from(data),
  }));
  return { pointer, parts, json };
}

/**
 * Open one generation: join, check the hash, gunzip, parse, check the
 * payload. Returns { profiles, json }. Throws with the reason otherwise.
 */
export function openPack(pointer, parts) {
  const gzip = joinPackParts(pointer, parts.map((p) => ({
    generation: p.generation,
    index: p.index,
    data: p.data instanceof Uint8Array ? p.data : null,
  })));
  const hash = sha256Hex(gzip);
  if (hash !== pointer.sha256) throw new Error(`hash ${hash.slice(0, 12)}…, pointer says ${pointer.sha256.slice(0, 12)}…`);
  const json = gunzipSync(gzip).toString('utf8');
  if (Buffer.byteLength(json, 'utf8') !== pointer.jsonBytes) {
    throw new Error(`${Buffer.byteLength(json, 'utf8')} bytes after gunzip, pointer says ${pointer.jsonBytes}`);
  }
  const payload = JSON.parse(json);
  return { profiles: profilesFromPackPayload(pointer, payload), json };
}
