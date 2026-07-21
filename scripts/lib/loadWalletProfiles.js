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

import { readFileSync, existsSync } from 'fs';
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
 * @returns {Promise<{ map: Map, source: 'local-json'|'firestore', detail: string }>}
 */
export async function loadWalletProfilesMap(db, opts = {}) {
  const jsonPath = opts.jsonPath || DEFAULT_JSON_PATH;
  const forceFs = String(process.env.WALLET_PROFILES_SOURCE || '').toLowerCase() === 'firestore';

  if (forceFs) {
    const map = await loadWalletProfilesFromFirestore(db);
    console.log(`[walletProfiles] source=firestore (WALLET_PROFILES_SOURCE=firestore) · ${map.size} profiles`);
    return { map, source: 'firestore', detail: 'env override' };
  }

  const local = tryLoadWalletProfilesFromJson(jsonPath);
  if (!local.ok) {
    const map = await loadWalletProfilesFromFirestore(db);
    console.warn(`[walletProfiles] source=firestore · local rejected: ${local.reason} · ${map.size} profiles`);
    return { map, source: 'firestore', detail: local.reason };
  }

  const meta = await readProfilesMeta(db);
  const metaAt = parseGeneratedAt(meta?.generatedAt);
  if (metaAt != null && local.generatedAtMs != null && metaAt > local.generatedAtMs + META_NEWER_SLACK_MS) {
    const map = await loadWalletProfilesFromFirestore(db);
    const lagMin = Math.round((metaAt - local.generatedAtMs) / 60000);
    console.warn(
      `[walletProfiles] source=firestore · meta newer than checkout by ~${lagMin}m`
      + ` (git lag / failed profile commit) · ${map.size} profiles`,
    );
    return { map, source: 'firestore', detail: `meta newer by ${lagMin}m` };
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
