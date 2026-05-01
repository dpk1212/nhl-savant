/**
 * backfillVaultHc.js — Retro-stamp Vault HC Margin fields on every
 * `sharp_action_positions` doc (pending + graded).
 *
 * Writes premium-tier badging signals used by the Sharp Vault UI:
 *   vault_hcConfFor, vault_hcConfAg, vault_hcMargin
 *   vault_hcTier      ('HC_DOMINANT' | 'HC_STANDARD' | 'HC_FADE' | null)
 *   vault_isHcWallet  (true if THIS wallet is itself CONFIRMED + sizeRatio ≥ 1.5)
 *
 * Reconstructs each (date, sport, gameKey, marketType) group from the
 * collection itself — no JSON snapshot needed. Each historical position
 * already stores `v8_sizeRatio` and `walletShort`, which is everything
 * we need to recompute HC margin.
 *
 * Winners-tier (CONFIRMED) is resolved against the CURRENT
 * `sharpWalletProfiles` whitelist — exactly the same lookup that
 * writeSharpActions.js + SharpFlow.jsx use live, so retro and live
 * stamps stay coherent.
 *
 * Usage:
 *   node scripts/backfillVaultHc.js                   # dry run (counts + distribution)
 *   node scripts/backfillVaultHc.js --write           # commit to Firestore
 *   node scripts/backfillVaultHc.js --write --since=2026-04-17
 *   node scripts/backfillVaultHc.js --write --only=PENDING
 *   node scripts/backfillVaultHc.js --write --only=GRADED
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COLLECTION = 'sharp_action_positions';
const HC_RATIO = 1.5;

// ── CLI args ───────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const sinceArg = argv.find(a => a.startsWith('--since='));
const SINCE = sinceArg ? sinceArg.split('=')[1] : null;
const onlyArg = argv.find(a => a.startsWith('--only='));
const ONLY = onlyArg ? onlyArg.split('=')[1].toUpperCase() : null; // PENDING | GRADED | null

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
    if (existsSync(sakPath)) {
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          project_id: process.env.VITE_FIREBASE_PROJECT_ID,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

// Mirror of scripts/writeSharpActions.js → computeVaultHcSignals(), but reads
// sizeRatio off each historical position's stamped `v8_sizeRatio` field.
// Keep this in sync with the live helper.
function computeVaultHcFromGroup(posGroup, mySide, sport, walletProfiles, myWalletShort) {
  const out = { hcConfFor: 0, hcConfAg: 0, hcMargin: 0, hcTier: null, isHcWallet: false };
  if (!Array.isArray(posGroup) || !mySide || !sport) return out;

  // Dedupe by wallet+side, keep max invested (mirrors live dedupe).
  const seen = new Map();
  for (const p of posGroup) {
    if (!p.wallet || !p.side) continue;
    const k = `${String(p.wallet).toLowerCase()}|${p.side}`;
    const cur = seen.get(k);
    if (!cur || (p.invested || 0) > (cur.invested || 0)) seen.set(k, p);
  }

  let hcConfFor = 0, hcConfAg = 0, isHcWallet = false;
  for (const p of seen.values()) {
    const short = String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
    const profile = walletProfiles.get(short) || walletProfiles.get(short.toUpperCase());
    const tier = profile?.bySport?.[sport]?.whitelistTier || null;
    if (tier !== 'CONFIRMED') continue;

    // Prefer the stamped v8_sizeRatio; fall back to invested/avgSportBet.
    const sr = p.v8_sizeRatio != null
      ? p.v8_sizeRatio
      : (p.avgSportBet > 0 ? (p.invested || 0) / p.avgSportBet : 0);
    if (sr < HC_RATIO) continue;

    if (p.side === mySide) {
      hcConfFor++;
      if (myWalletShort && short === String(myWalletShort).toLowerCase()) isHcWallet = true;
    } else if (p.side) {
      hcConfAg++;
    }
  }
  const hcMargin = hcConfFor - hcConfAg;
  let hcTier = null;
  if (hcMargin >= 2) hcTier = 'HC_DOMINANT';
  else if (hcMargin === 1) hcTier = 'HC_STANDARD';
  else if (hcMargin <= -1) hcTier = 'HC_FADE';
  return { hcConfFor, hcConfAg, hcMargin, hcTier, isHcWallet };
}

async function main() {
  const db = initFirebase();
  console.log(`\n=== backfillVaultHc — ${WRITE ? 'WRITE' : 'DRY RUN'} ===`);
  if (SINCE) console.log(`Filter: date >= ${SINCE}`);
  if (ONLY) console.log(`Filter: status === ${ONLY}`);

  // Load whitelist (same lookup used live).
  const walletProfiles = new Map();
  const profilesSnap = await db.collection('sharpWalletProfiles').get();
  profilesSnap.forEach(d => walletProfiles.set(d.id.toLowerCase(), d.data()));
  console.log(`\nLoaded ${walletProfiles.size} sharpWalletProfiles`);

  // Load positions.
  let q = db.collection(COLLECTION);
  if (SINCE) q = q.where('date', '>=', SINCE);
  if (ONLY) q = q.where('status', '==', ONLY);
  const snap = await q.get();
  console.log(`Loaded ${snap.size} positions`);

  // Group by (date, sport, gameKey, marketType).
  const groups = new Map();
  const allPositions = [];
  snap.forEach(d => {
    const data = { _ref: d.ref, _id: d.id, ...d.data() };
    allPositions.push(data);
    const k = `${data.date}|${data.sport}|${data.gameKey}|${data.marketType}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(data);
  });
  console.log(`Grouped into ${groups.size} game-market clusters`);

  // Score every position.
  const results = [];
  for (const [, group] of groups) {
    const sport = group[0].sport;
    for (const pos of group) {
      const myShort = String(pos.walletShort || pos.wallet || '').slice(-6);
      const sig = computeVaultHcFromGroup(group, pos.side, sport, walletProfiles, myShort);
      if (!sig) continue;
      results.push({ pos, sig });
    }
  }
  console.log(`Scored ${results.length} positions\n`);

  // Distribution summary.
  const tierDist = { HC_DOMINANT: 0, HC_STANDARD: 0, HC_FADE: 0, NONE: 0 };
  const marginDist = {};
  const byTier = new Map(); // tier → { n, w, l, p }
  let graded = 0, pending = 0;
  for (const { pos, sig } of results) {
    const tier = sig.hcTier || 'NONE';
    tierDist[tier] = (tierDist[tier] || 0) + 1;
    marginDist[sig.hcMargin] = (marginDist[sig.hcMargin] || 0) + 1;
    if (pos.status === 'GRADED') {
      graded++;
      if (!byTier.has(tier)) byTier.set(tier, { n: 0, w: 0, l: 0, p: 0 });
      const b = byTier.get(tier);
      b.n++;
      if (pos.result === 'WIN') b.w++;
      else if (pos.result === 'LOSS') b.l++;
      else if (pos.result === 'PUSH') b.p++;
    } else if (pos.status === 'PENDING') pending++;
  }

  console.log(`Status breakdown:   PENDING=${pending}   GRADED=${graded}\n`);
  console.log(`HC tier distribution:`);
  ['HC_DOMINANT', 'HC_STANDARD', 'HC_FADE', 'NONE'].forEach(t => {
    const n = tierDist[t] || 0;
    const pct = results.length > 0 ? ((n / results.length) * 100).toFixed(1) : '0.0';
    console.log(`  ${t.padEnd(13)} ${String(n).padStart(5)}  (${pct}%)`);
  });
  console.log(`\nHC margin distribution:`);
  Object.keys(marginDist).sort((a, b) => +b - +a).forEach(k => {
    console.log(`  margin=${k.padStart(3)}: ${marginDist[k]}`);
  });

  if (graded > 0) {
    console.log(`\n── Retro-validation on ${graded} graded positions ──`);
    console.log(`${'tier'.padEnd(13)} ${'N'.padStart(5)} ${'W'.padStart(4)} ${'L'.padStart(4)} ${'P'.padStart(4)} ${'WR%'.padStart(6)}`);
    ['HC_DOMINANT', 'HC_STANDARD', 'NONE', 'HC_FADE'].forEach(t => {
      const b = byTier.get(t);
      if (!b) return;
      const wr = (b.w + b.l) > 0 ? ((b.w / (b.w + b.l)) * 100).toFixed(1) : 'n/a';
      console.log(`${t.padEnd(13)} ${String(b.n).padStart(5)} ${String(b.w).padStart(4)} ${String(b.l).padStart(4)} ${String(b.p).padStart(4)} ${wr.padStart(6)}`);
    });
  }

  if (!WRITE) {
    console.log(`\n[DRY RUN] Pass --write to commit to Firestore.\n`);
    return;
  }

  // Commit.
  let written = 0;
  const BATCH_SIZE = 400;
  for (let i = 0; i < results.length; i += BATCH_SIZE) {
    const chunk = results.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    for (const { pos, sig } of chunk) {
      batch.update(pos._ref, {
        vault_hcConfFor: sig.hcConfFor,
        vault_hcConfAg: sig.hcConfAg,
        vault_hcMargin: sig.hcMargin,
        vault_hcTier: sig.hcTier,
        vault_isHcWallet: sig.isHcWallet,
        vault_hcStampedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      written++;
    }
    await batch.commit();
  }

  console.log(`\nWrote vault_hc* fields to ${written} positions.\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
