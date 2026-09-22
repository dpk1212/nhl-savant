/**
 * Load sharpWalletProfiles for cron backbone scripts (writeSharpActions,
 * syncPickStateAuthoritative).
 *
 * WHY: A full Firestore collection scan (~387 reads) ran on every market-data
 * cycle. Profiles only change when exportWalletProfiles runs after grading,
 * and that job already commits data/wallet-profiles.json — so the checkout
 * is the same source of truth for whitelist / clvSkill / bySport.
 *
 * SAFETY (ops backbone — never run blind):
 *   1. WALLET_PROFILES_SOURCE=firestore  → force Firestore (emergency)
 *   2. Prefer local JSON when shape/age/count validate
 *   3. Compare against walletProfilesMeta/current (1 read). If Firestore
 *      meta is newer than the checkout file (failed git push, mid-deploy
 *      lag), fall back to the full Firestore collection.
 *   4. Any parse/validation/meta error → Firestore full get (legacy path)
 *
 * Returns Map<walletShortLower, profileObject> — same keying syncPickState
 * already uses (toLowerCase doc ids).
 */

import { readFileSync, existsSync, writeFileSync, renameSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_JSON_PATH = join(__dirname, '../../data/wallet-profiles.json');

export const WALLET_PROFILES_META_COLLECTION = 'walletProfilesMeta';
export const WALLET_PROFILES_META_DOC_ID = 'current';

/** Missed overnight grade still OK; older than this → re-read Firestore. */
const MAX_LOCAL_AGE_MS = 72 * 60 * 60 * 1000;
/** Guard against truncated / empty artefact. */
const MIN_PROFILE_COUNT = 100;
/** Meta newer than local by this much → trust Firestore (push lag / failed commit). */
const META_NEWER_SLACK_MS = 60 * 1000;
/**
 * A long ledger job checks out once. If meta is newer than that checkout,
 * every cycle would re-read the whole sharpWalletProfiles collection.
 * Reuse one Firestore read for half an hour inside the job (shared /tmp).
 * Grade runs a few times a day, so this does not freeze a whitelist change.
 */
const DEFAULT_CACHE_PATH = join(tmpdir(), 'nhl-savant-wallet-profiles-cache.json');
const DEFAULT_CACHE_MS = 30 * 60 * 1000;

function parseGeneratedAt(raw) {
  if (!raw) return null;
  if (typeof raw.toDate === 'function') {
    const d = raw.toDate();
    return Number.isFinite(d?.getTime?.()) ? d.getTime() : null;
  }
  const t = Date.parse(raw);
  return Number.isFinite(t) ? t : null;
}

/**
 * @returns {{ ok: true, map: Map, generatedAtMs: number|null, path: string }
 *         | { ok: false, reason: string }}
 */
export function tryLoadWalletProfilesFromJson(jsonPath = DEFAULT_JSON_PATH) {
  if (!existsSync(jsonPath)) {
    return { ok: false, reason: `missing file ${jsonPath}` };
  }
  let raw;
  try {
    raw = JSON.parse(readFileSync(jsonPath, 'utf8'));
  } catch (err) {
    return { ok: false, reason: `parse failed: ${err.message}` };
  }
  const profiles = raw?.profiles;
  if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) {
    return { ok: false, reason: 'missing profiles object' };
  }
  const keys = Object.keys(profiles);
  if (keys.length < MIN_PROFILE_COUNT) {
    return { ok: false, reason: `only ${keys.length} profiles (min ${MIN_PROFILE_COUNT})` };
  }
  // Spot-check shape used by AGS / whitelist / TAPE predicates.
  const sample = profiles[keys[0]];
  if (!sample || typeof sample !== 'object' || sample.bySport == null) {
    return { ok: false, reason: 'sample profile missing bySport' };
  }
  const generatedAtMs = parseGeneratedAt(raw.generatedAt);
  if (generatedAtMs != null) {
    const age = Date.now() - generatedAtMs;
    if (age > MAX_LOCAL_AGE_MS) {
      return {
        ok: false,
        reason: `stale generatedAt age=${Math.round(age / 3600000)}h (max ${MAX_LOCAL_AGE_MS / 3600000}h)`,
      };
    }
    if (age < -MAX_LOCAL_AGE_MS) {
      return { ok: false, reason: 'generatedAt far in the future' };
    }
  }

  const map = new Map();
  for (const [id, data] of Object.entries(profiles)) {
    if (!id || !data || typeof data !== 'object') continue;
    map.set(String(id).toLowerCase(), data);
  }
  if (map.size < MIN_PROFILE_COUNT) {
    return { ok: false, reason: `map size ${map.size} after normalize` };
  }
  return { ok: true, map, generatedAtMs, path: jsonPath, walletCount: map.size };
}

/**
 * @returns {{ map: Map, ageMs: number } | null}
 */
export function readProfileCache(cachePath = DEFAULT_CACHE_PATH, maxAgeMs = DEFAULT_CACHE_MS, now = Date.now()) {
  if (!cachePath || !(maxAgeMs > 0) || !existsSync(cachePath)) return null;
  let raw;
  try {
    raw = JSON.parse(readFileSync(cachePath, 'utf8'));
  } catch {
    return null;
  }
  const fetchedAtMs = parseGeneratedAt(raw?.fetchedAt);
  if (fetchedAtMs == null) return null;
  const ageMs = now - fetchedAtMs;
  if (ageMs > maxAgeMs || ageMs < -META_NEWER_SLACK_MS) return null;
  const profiles = raw?.profiles;
  if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) return null;
  const map = new Map();
  for (const [id, data] of Object.entries(profiles)) {
    if (!id || !data || typeof data !== 'object') continue;
    map.set(String(id).toLowerCase(), data);
  }
  if (map.size < MIN_PROFILE_COUNT) return null;
  const sample = map.values().next().value;
  if (!sample || sample.bySport == null) return null;
  return { map, ageMs };
}

export function writeProfileCache(cachePath, map, now = Date.now()) {
  const profiles = {};
  for (const [id, data] of map) profiles[id] = data;
  const body = JSON.stringify({
    fetchedAt: new Date(now).toISOString(),
    profiles,
  });
  const tmp = `${cachePath}.tmp`;
  writeFileSync(tmp, body);
  renameSync(tmp, cachePath);
}

async function loadWalletProfilesFromFirestore(db) {
  const map = new Map();
  const snap = await db.collection('sharpWalletProfiles').get();
  snap.forEach((d) => map.set(String(d.id).toLowerCase(), d.data()));
  return map;
}

async function readProfilesMeta(db) {
  try {
    const doc = await db.collection(WALLET_PROFILES_META_COLLECTION).doc(WALLET_PROFILES_META_DOC_ID).get();
    if (!doc.exists) return null;
    return doc.data() || null;
  } catch (err) {
    console.warn(`[walletProfiles] meta read failed (ignoring): ${err.message}`);
    return null;
  }
}

/**
 * @param {FirebaseFirestore.Firestore} db
 * @param {{ jsonPath?: string }} [opts]
 * @returns {Promise<{ map: Map, source: 'local-json'|'firestore'|'cache', detail: string }>}
 */
async function firestoreOrCache(db, reason, opts) {
  const cachePath = opts.cachePath || DEFAULT_CACHE_PATH;
  const maxAgeMs = opts.cacheMaxMs != null ? opts.cacheMaxMs : DEFAULT_CACHE_MS;
  const now = opts.now || Date.now();
  const cached = readProfileCache(cachePath, maxAgeMs, now);
  if (cached) {
    const ageMin = Math.max(0, Math.round(cached.ageMs / 60000));
    console.log(
      `[walletProfiles] source=cache · ${cached.map.size} profiles · age=${ageMin}m · ${reason}`,
    );
    return { map: cached.map, source: 'cache', detail: `${reason}; cache age=${ageMin}m` };
  }
  const map = await loadWalletProfilesFromFirestore(db);
  if (maxAgeMs > 0) {
    try {
      writeProfileCache(cachePath, map, now);
    } catch (err) {
      console.warn(`[walletProfiles] cache write failed: ${err.message}`);
    }
  }
  console.warn(`[walletProfiles] source=firestore · ${reason} · ${map.size} profiles`);
  return { map, source: 'firestore', detail: reason };
}

export async function loadWalletProfilesMap(db, opts = {}) {
  const jsonPath = opts.jsonPath || DEFAULT_JSON_PATH;
  const forceFs = String(process.env.WALLET_PROFILES_SOURCE || '').toLowerCase() === 'firestore';

  if (forceFs) {
    const map = await loadWalletProfilesFromFirestore(db);
    const cachePath = opts.cachePath || DEFAULT_CACHE_PATH;
    const maxAgeMs = opts.cacheMaxMs != null ? opts.cacheMaxMs : DEFAULT_CACHE_MS;
    if (maxAgeMs > 0) {
      try { writeProfileCache(cachePath, map, opts.now || Date.now()); } catch { /* non-fatal */ }
    }
    console.log(`[walletProfiles] source=firestore (WALLET_PROFILES_SOURCE=firestore) · ${map.size} profiles`);
    return { map, source: 'firestore', detail: 'env override' };
  }

  const local = tryLoadWalletProfilesFromJson(jsonPath);
  if (!local.ok) {
    return firestoreOrCache(db, `local rejected: ${local.reason}`, opts);
  }

  const meta = await readProfilesMeta(db);
  const metaAt = parseGeneratedAt(meta?.generatedAt);
  if (metaAt != null && local.generatedAtMs != null && metaAt > local.generatedAtMs + META_NEWER_SLACK_MS) {
    const lagMin = Math.round((metaAt - local.generatedAtMs) / 60000);
    return firestoreOrCache(
      db,
      `meta newer than checkout by ~${lagMin}m (git lag / failed profile commit)`,
      opts,
    );
  }

  const ageH = local.generatedAtMs != null
    ? (Math.round((Date.now() - local.generatedAtMs) / 360000) / 10)
    : '?';
  console.log(
    `[walletProfiles] source=local-json · ${local.walletCount} profiles`
    + ` · age=${ageH}h · ${local.path}`,
  );
  return { map: local.map, source: 'local-json', detail: `age=${ageH}h` };
}
