/**
 * backfillVaultQuant.js — populate Vault Quant Score v1 on every
 * `sharp_action_positions` doc (pending + graded).
 *
 * Writes side-aware two-axis score fields (hidden from UI, shadow-mode):
 *   vault_quantScore, vault_quantLabel, vault_quantVersion
 *   vault_winnerForW, vault_winnerAgW, vault_winnerMargin
 *   vault_qualityForT30, vault_qualityAgT30, vault_qualityMargin
 *
 * Reconstructs each (date, sport, gameKey, market) group directly from the
 * collection itself — no JSON snapshot needed. Each position already stores
 * `v8_walletContribution` (its own quality-weighted contribution), so the
 * T=30 margin is computed from the full position set.
 *
 * Winners margin uses the current `sharpWalletProfiles` whitelist
 * (CONFIRMED|FLAT → sport winner). This means graded historical picks are
 * scored against *today's* known-winners list — which is exactly what we
 * want for validating "did plays we now know to be winners-stacked actually
 * win?".
 *
 * Usage:
 *   node scripts/backfillVaultQuant.js                   # dry run (counts + distribution)
 *   node scripts/backfillVaultQuant.js --write           # commit to Firestore
 *   node scripts/backfillVaultQuant.js --write --since=2026-04-17
 *   node scripts/backfillVaultQuant.js --write --only=PENDING
 *   node scripts/backfillVaultQuant.js --write --only=GRADED
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COLLECTION = 'sharp_action_positions';
const VAULT_QUANT_VERSION = 1;

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

// Mirrors the helpers in scripts/writeSharpActions.js — keep these two in
// sync. Any change to the ladder here must be mirrored there.
function computeVaultQuantSignals(posGroup, mySide, sport, walletProfiles) {
  if (!posGroup || !mySide) return null;

  // T=30 quality margin from the per-position contribution stored at write
  // time. Dedupe by wallet per side (same wallet can appear on only one side
  // of a single game-market, but defensive dedupe keeps the math honest).
  const seenFor = new Set(), seenAg = new Set();
  let qualityForT30 = 0, qualityAgT30 = 0;
  for (const p of posGroup) {
    const c = p.v8_walletContribution;
    if (c == null || c < 30) continue;
    const w = (p.wallet || '').toLowerCase();
    if (p.side === mySide) {
      if (seenFor.has(w)) continue;
      seenFor.add(w);
      qualityForT30++;
    } else if (p.side) {
      if (seenAg.has(w)) continue;
      seenAg.add(w);
      qualityAgT30++;
    }
  }
  const qualityMargin = qualityForT30 - qualityAgT30;

  // Winners margin — unique CONFIRMED/FLAT sport winners per side.
  const winnersFor = new Set(), winnersAg = new Set();
  for (const p of posGroup) {
    const short = (p.walletShort || String(p.wallet || '').slice(-6)).toLowerCase();
    const prof = walletProfiles.get(short) || walletProfiles.get(short.toUpperCase());
    const tier = prof?.bySport?.[sport]?.whitelistTier || null;
    if (tier !== 'CONFIRMED' && tier !== 'FLAT') continue;
    if (p.side === mySide) winnersFor.add(short);
    else if (p.side) winnersAg.add(short);
  }
  const winnerForW = winnersFor.size;
  const winnerAgW = winnersAg.size;
  const winnerMargin = winnerForW - winnerAgW;

  return { qualityForT30, qualityAgT30, qualityMargin, winnerForW, winnerAgW, winnerMargin };
}

function computeVaultQuantScore(sig) {
  if (!sig) return null;
  const { winnerMargin, qualityMargin } = sig;

  let base;
  if (winnerMargin >= 2) base = 4.5;
  else if (winnerMargin === 1) base = 3.5;
  else if (winnerMargin === 0) base = 2.5;
  else if (winnerMargin === -1) base = 1.5;
  else base = 1.0;

  let adj;
  if (qualityMargin >= 3) adj = 0.5;
  else if (qualityMargin >= 1) adj = 0.0;
  else if (qualityMargin === 0) adj = -0.5;
  else adj = -1.0;

  let score = Math.max(1.0, Math.min(5.0, base + adj));
  score = Math.round(score * 2) / 2;

  if (winnerMargin <= -2) score = 1.0;
  if (winnerMargin >= 2 && qualityMargin >= 1) score = 5.0;

  const label = score >= 5.0 ? 'ELITE'
    : score >= 4.0 ? 'STRONG'
    : score >= 3.0 ? 'SOLID'
    : score >= 2.0 ? 'DEVELOPING'
    : 'MUTED';

  return { score, label };
}

async function main() {
  const db = initFirebase();
  console.log(`\n=== backfillVaultQuant — ${WRITE ? 'WRITE' : 'DRY RUN'} ===`);
  if (SINCE) console.log(`Filter: date >= ${SINCE}`);
  if (ONLY) console.log(`Filter: status === ${ONLY}`);

  // Load whitelist
  const walletProfiles = new Map();
  const profilesSnap = await db.collection('sharpWalletProfiles').get();
  profilesSnap.forEach(d => walletProfiles.set(d.id.toLowerCase(), d.data()));
  console.log(`\nLoaded ${walletProfiles.size} sharpWalletProfiles`);

  // Load positions
  let q = db.collection(COLLECTION);
  if (SINCE) q = q.where('date', '>=', SINCE);
  if (ONLY) q = q.where('status', '==', ONLY);
  const snap = await q.get();
  console.log(`Loaded ${snap.size} positions`);

  // Group by (date, sport, gameKey, marketType)
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

  // Score every position
  const results = [];
  for (const [, group] of groups) {
    const sport = group[0].sport;
    for (const pos of group) {
      const sig = computeVaultQuantSignals(group, pos.side, sport, walletProfiles);
      const sc = computeVaultQuantScore(sig);
      if (!sig || !sc) continue;
      results.push({ pos, sig, sc });
    }
  }
  console.log(`Scored ${results.length} positions\n`);

  // Distribution summary
  const scoreDist = {};
  const labelDist = {};
  const winnerDist = {};
  const qualityDist = {};
  let graded = 0, pending = 0, gradedWins = 0, gradedLosses = 0, gradedPushes = 0;
  const byScore = new Map();
  for (const { pos, sig, sc } of results) {
    scoreDist[sc.score] = (scoreDist[sc.score] || 0) + 1;
    labelDist[sc.label] = (labelDist[sc.label] || 0) + 1;
    winnerDist[sig.winnerMargin] = (winnerDist[sig.winnerMargin] || 0) + 1;
    qualityDist[sig.qualityMargin] = (qualityDist[sig.qualityMargin] || 0) + 1;
    if (pos.status === 'GRADED') {
      graded++;
      if (!byScore.has(sc.score)) byScore.set(sc.score, { n: 0, w: 0, l: 0, p: 0 });
      const b = byScore.get(sc.score);
      b.n++;
      if (pos.result === 'WIN') { b.w++; gradedWins++; }
      else if (pos.result === 'LOSS') { b.l++; gradedLosses++; }
      else if (pos.result === 'PUSH') { b.p++; gradedPushes++; }
    } else if (pos.status === 'PENDING') pending++;
  }

  console.log(`Status breakdown:   PENDING=${pending}   GRADED=${graded} (W:${gradedWins} L:${gradedLosses} P:${gradedPushes})`);
  console.log(`\nScore distribution:`);
  Object.keys(scoreDist).sort((a, b) => +b - +a).forEach(s => {
    const pct = ((scoreDist[s] / results.length) * 100).toFixed(1);
    console.log(`  ${s} stars: ${scoreDist[s].toString().padStart(5)}  (${pct}%)`);
  });
  console.log(`\nLabel distribution:`);
  ['ELITE', 'STRONG', 'SOLID', 'DEVELOPING', 'MUTED'].forEach(l => {
    const n = labelDist[l] || 0;
    const pct = ((n / results.length) * 100).toFixed(1);
    console.log(`  ${l.padEnd(11)} ${n.toString().padStart(5)}  (${pct}%)`);
  });
  console.log(`\nWinners-margin distribution:`);
  Object.keys(winnerDist).sort((a, b) => +b - +a).forEach(k => {
    console.log(`  Δ_winner=${k.padStart(3)}: ${winnerDist[k]}`);
  });
  console.log(`\nQuality-margin (T=30) distribution:`);
  Object.keys(qualityDist).sort((a, b) => +b - +a).forEach(k => {
    console.log(`  Δ_quality=${k.padStart(3)}: ${qualityDist[k]}`);
  });

  if (graded > 0) {
    console.log(`\n── Retro-validation on ${graded} graded positions ──`);
    console.log(`${'score'.padEnd(7)} ${'N'.padStart(5)} ${'W'.padStart(4)} ${'L'.padStart(4)} ${'P'.padStart(4)} ${'WR%'.padStart(6)}`);
    Array.from(byScore.entries()).sort((a, b) => b[0] - a[0]).forEach(([s, b]) => {
      const wr = b.n > 0 ? ((b.w / (b.w + b.l)) * 100).toFixed(1) : 'n/a';
      console.log(`${String(s).padEnd(7)} ${String(b.n).padStart(5)} ${String(b.w).padStart(4)} ${String(b.l).padStart(4)} ${String(b.p).padStart(4)} ${wr.padStart(6)}`);
    });
  }

  if (!WRITE) {
    console.log(`\n[DRY RUN] Pass --write to commit to Firestore.\n`);
    return;
  }

  // Commit
  let written = 0;
  const BATCH_SIZE = 400;
  for (let i = 0; i < results.length; i += BATCH_SIZE) {
    const chunk = results.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    for (const { pos, sig, sc } of chunk) {
      batch.update(pos._ref, {
        vault_quantScore: sc.score,
        vault_quantLabel: sc.label,
        vault_quantVersion: VAULT_QUANT_VERSION,
        vault_winnerForW: sig.winnerForW,
        vault_winnerAgW: sig.winnerAgW,
        vault_winnerMargin: sig.winnerMargin,
        vault_qualityForT30: sig.qualityForT30,
        vault_qualityAgT30: sig.qualityAgT30,
        vault_qualityMargin: sig.qualityMargin,
        vault_quantScoredAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      written++;
    }
    await batch.commit();
  }

  console.log(`\nWrote vault_* fields to ${written} positions.\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
