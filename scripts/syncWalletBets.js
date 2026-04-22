/**
 * syncWalletBets.js — append/upsert every observed wallet bet into a
 * Firestore collection for long-term tracking and analytics.
 *
 * Data sources (merged into a single doc per real-world bet):
 *   A. sharp_action_positions  (each doc = one wallet's bet, with real
 *      invested $, odds, settledPnl, outcome — Source of Truth for $).
 *   B. v8Scoring.walletDetails on sharpFlow{Picks,Spreads,Totals}
 *      (quality snapshot at pick-generation time — roiNorm, walletBase,
 *      rank, contribution, sizeRatio, convictionMult).
 *
 * Doc id: `${date}_${gameKey}_${market}_${side}_${walletShort}`
 * Collection: walletBets (override with --collection=xxx).
 *
 * Both sources upsert with `merge: true`, so running this repeatedly
 * layers new info (e.g. a pending pick becomes graded on a later run).
 *
 * Usage:
 *   node scripts/syncWalletBets.js                 # dry run (prints counts)
 *   node scripts/syncWalletBets.js --write         # commit to Firestore
 *   node scripts/syncWalletBets.js --write --since=2026-04-17
 *   node scripts/syncWalletBets.js --write --collection=walletBetsDev
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── CLI args ───────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const sinceArg = argv.find(a => a.startsWith('--since='));
const SINCE = sinceArg ? sinceArg.split('=')[1] : '2026-04-17';
const collectionArg = argv.find(a => a.startsWith('--collection='));
const TARGET = collectionArg ? collectionArg.split('=')[1] : 'walletBets';

// ── Firestore init ─────────────────────────────────────────────────
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

const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };
const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const flatProfit = (odds, outcome) => {
  if (outcome === 'WIN') return +(americanToDecimal(odds) - 1).toFixed(3);
  if (outcome === 'LOSS') return -1;
  return null;
};

// Doc id for a wallet-bet — stable across both sources so they merge.
function betDocId({ date, gameKey, market, side, walletShort }) {
  return `${date}_${gameKey}_${market}_${side}_${walletShort}`;
}

// ── Source B: sharp_action_positions ───────────────────────────────
// Each doc is ONE wallet's ONE real bet. This is authoritative for
// dollar invested, odds, and settled PnL.
async function pullFromPositions() {
  const snap = await db.collection('sharp_action_positions')
    .where('date', '>=', SINCE)
    .get();
  const rows = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet || !d.date || !d.marketType || !d.side) return;
    const walletShort = d.walletShort || String(d.wallet).slice(0, 6);
    // Derive gameKey from doc id if not present — format is e.g.
    // `2026-04-17_MLB_atl_phi_<hash>_ML_home`. We stash only the
    // game-identifying segment: `${date}_${sport}_${away}_${home}`.
    const gameKey = [d.date, d.sport, d.away, d.home].filter(Boolean).join('_').toLowerCase();
    const outcome = d.status === 'GRADED'
      ? (d.result === 'WIN' ? 'WIN' : d.result === 'LOSS' ? 'LOSS' : d.result || 'PENDING')
      : 'PENDING';
    const invested = Number(d.invested ?? d.size ?? 0);
    const settledPnl = d.status === 'GRADED' ? Number(d.settledPnl ?? 0) : null;
    const oddsAmerican = d.pinnacleOdds ?? null; // American odds if stored
    const flatPnl = oddsAmerican ? flatProfit(oddsAmerican, outcome) : null;

    rows.push({
      id: betDocId({ date: d.date, gameKey, market: d.marketType, side: d.side, walletShort }),
      data: {
        walletShort,
        walletAddress: d.wallet,
        date: d.date,
        sport: d.sport || null,
        market: d.marketType,
        side: d.side,
        teamName: d.teamName || null,
        gameKey,
        homeTeam: d.home || null,
        awayTeam: d.away || null,
        outcome,
        invested,
        avgPrice: d.avgPrice ?? null,       // Polymarket entry price
        pinnacleOdds: d.pinnacleOdds ?? null,
        pinnacleImplied: d.pinnacleImplied ?? null,
        closingPinnacleOdds: d.closingPinnacleOdds ?? null,
        clv: d.clv ?? null,
        settledPnl,
        settledPrice: d.settledPrice ?? null,
        flatPnl,
        // Position-specific context
        position: {
          size: d.size ?? null,
          leaderboardRank: d.leaderboardRank ?? null,
          tier: d.tier ?? null,
          sportROI: d.sportROI ?? null,
          sportPnlTotal: d.sportPnlTotal ?? null,
          sportVol: d.sportVol ?? null,
          sportsLbPercentileTop: d.sportsLbPercentileTop ?? null,
          betMultiplier: d.betMultiplier ?? null,
          label: d.label ?? null,
          firstSeen: d.firstSeen ?? null,
          // Vault/Shadow classification — treat missing (pre-shadow docs)
          // as VAULT so historical walletBets stay consistent.
          qualificationTier: d.qualificationTier || (d.vaultQualified === false ? 'SHADOW' : 'VAULT'),
          vaultQualified: d.vaultQualified !== false,
        },
        sources: admin.firestore.FieldValue.arrayUnion('positions'),
        sourceDocs: {
          positionsDocId: doc.id,
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    });
  });
  return rows;
}

// ── Source A: walletDetails on sharpFlow picks ─────────────────────
// Each sharpFlow pick side stores an array of sharp wallets that were
// influential when the pick was generated. We grade per-wallet by
// comparing the wallet's side to the winning side (derived via
// home↔away / over↔under since only one side is tracked).
async function pullFromWalletDetails() {
  const rows = [];
  for (const [col, market] of [
    ['sharpFlowPicks', 'ML'],
    ['sharpFlowSpreads', 'SPREAD'],
    ['sharpFlowTotals', 'TOTAL'],
  ]) {
    const snap = await db.collection(col).where('date', '>=', SINCE).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      // Winning side (if graded). For PENDING we still want to emit
      // wallet rows so the bet is tracked.
      let winningSide = null;
      let graded = false;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk].result?.outcome;
        if (oc === 'WIN') { winningSide = sk; graded = true; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; graded = true; break; }
      }

      // Derive a stable gameKey. Doc IDs look like
      // `2026-04-18_MLB_bal_cle` / `..._spread` / `..._total`.
      const gameKey = (doc.id || '').replace(/_(spread|total)$/, '').toLowerCase();
      const seen = new Set();
      for (const [sideKey, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock;
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        const oddsForThisSide = peak.odds ?? null;
        const consensusSide = peak.v8Scoring?.consensusSide ?? sideKey;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          const key = `${doc.id}_${w.wallet}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const betOdds = sides[w.side]?.peak?.odds ?? sides[w.side]?.lock?.odds ?? oddsForThisSide;
          const outcome = !graded
            ? 'PENDING'
            : (w.side === winningSide ? 'WIN' : 'LOSS');
          const flatPnl = betOdds != null ? flatProfit(betOdds, outcome) : null;

          rows.push({
            id: betDocId({ date: d.date, gameKey, market, side: w.side, walletShort: w.wallet }),
            data: {
              walletShort: w.wallet,
              date: d.date,
              sport: d.sport || null,
              market,
              side: w.side,
              gameKey,
              outcome,
              pinnacleOdds: betOdds,
              flatPnl,
              pickSnapshot: {
                walletBase: w.walletBase ?? null,
                roiNorm: w.roiNorm ?? null,
                rankNorm: w.rankNorm ?? null,
                pnlNorm: w.pnlNorm ?? null,
                rank: w.rank ?? null,
                lifetimeRoi: w.roi ?? null,
                lifetimePnl: w.pnl ?? null,
                source: w.source ?? null,
                invested: w.invested ?? null,
                contribution: w.contribution ?? null,
                sizeRatio: w.sizeRatio ?? null,
                convictionMult: w.convictionMult ?? null,
                isConsensusSide: w.side === consensusSide,
                capturedAt: d.date,
              },
              sources: admin.firestore.FieldValue.arrayUnion('walletDetails'),
              sourceDocs: {
                [`walletDetailsDocId_${col}`]: doc.id,
              },
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
          });
        }
      }
    }
  }
  return rows;
}

// ── Upsert with merge, chunked in batches of 400 ───────────────────
async function upsertAll(rows) {
  let count = 0;
  let batch = db.batch();
  let batchSize = 0;
  for (const { id, data } of rows) {
    const ref = db.collection(TARGET).doc(id);
    batch.set(ref, data, { merge: true });
    batchSize++;
    count++;
    if (batchSize >= 400) {
      await batch.commit();
      console.log(`  committed ${count} docs…`);
      batch = db.batch();
      batchSize = 0;
    }
  }
  if (batchSize > 0) await batch.commit();
  return count;
}

(async () => {
  console.log(`syncWalletBets → collection=${TARGET}  since=${SINCE}  write=${WRITE}`);
  console.log('');
  console.log('Pulling sharp_action_positions…');
  const positionsRows = await pullFromPositions();
  console.log(`  → ${positionsRows.length} position records`);
  console.log('Pulling walletDetails from sharpFlow picks/spreads/totals…');
  const wdRows = await pullFromWalletDetails();
  console.log(`  → ${wdRows.length} walletDetails records`);

  // De-duplicate by doc id (positions first — they carry $ info; then
  // walletDetails adds pickSnapshot on top via merge).
  const byId = new Map();
  for (const r of positionsRows) byId.set(r.id, r);
  for (const r of wdRows) {
    if (byId.has(r.id)) {
      // Merge shallowly — same doc, different source. Keep both upserts
      // so a single batch.set call covers each. Actually Firestore
      // merge: true handles nested merging, so we can just run both.
      byId.set(r.id + '__wd', r);
    } else {
      byId.set(r.id, r);
    }
  }

  // Re-expand (we deliberately queued both source writes per doc).
  const allRows = [...positionsRows, ...wdRows];
  const uniqueDocs = new Set(allRows.map(r => r.id));
  console.log('');
  console.log('Summary');
  console.log(`  total upsert ops: ${allRows.length}`);
  console.log(`  unique doc ids:   ${uniqueDocs.size}`);
  // Outcome breakdown
  const pending = allRows.filter(r => r.data.outcome === 'PENDING').length;
  const wins = allRows.filter(r => r.data.outcome === 'WIN').length;
  const losses = allRows.filter(r => r.data.outcome === 'LOSS').length;
  console.log(`  outcome breakdown: WIN=${wins}  LOSS=${losses}  PENDING=${pending}`);
  const withSettled = allRows.filter(r => r.data.settledPnl != null).length;
  const totalSettled = allRows.filter(r => r.data.settledPnl != null)
    .reduce((s, r) => s + (r.data.settledPnl || 0), 0);
  console.log(`  settled dollar PnL: $${totalSettled.toLocaleString(undefined, { maximumFractionDigits: 0 })} across ${withSettled} positions`);

  if (!WRITE) {
    console.log('\n(Dry run — pass --write to upsert into Firestore.)');
    process.exit(0);
  }

  console.log(`\nUpserting into \`${TARGET}\`…`);
  const n = await upsertAll(allRows);
  console.log(`✓ Upserted ${n} docs into \`${TARGET}\` (unique: ${uniqueDocs.size}).`);
  process.exit(0);
})();
