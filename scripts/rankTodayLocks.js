/**
 * rankTodayLocks.js — Order today's LOCKED picks by V8.1 contribution signal.
 *
 * Pulls every pick side from sharpFlowPicks / Spreads / Totals for today
 * where lockStage === 'LOCKED', tags each with contribTier + qFor/qAg/margin,
 * and prints a ranked table from most to least confident.
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  const sakPath = join(__dirname, '../serviceAccountKey.json');
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
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

// Score ~ compact ranking key that merges every edge signal we have.
// Higher = more confident.
function confidenceScore(s) {
  const tierPts = { STRONG: 1000, STANDARD: 500, LEAN: 0, MUTE: -500 }[s.contribTier] ?? 0;
  const regimePts = s.regime === 'CLEAR_MOVE' ? 200 : s.regime === 'NEAR_START' ? 100 : 0;
  const marginPts = 50 * (s.contribMargin ?? 0);
  const qForPts = 30 * (s.qFor50 ?? 0);
  const concPenalty = s.topShare ? -40 * s.topShare : 0;    // penalize 1-wallet concentration
  const starPts = 10 * (s.stars ?? 0);
  return tierPts + regimePts + marginPts + qForPts + concPenalty + starPts;
}

async function loadToday() {
  const rows = [];
  for (const [col, mkt] of COLS) {
    const snap = await db.collection(col).where('date', '==', today).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      for (const [sideKey, side] of Object.entries(sides)) {
        if (side.lockStage && side.lockStage !== 'LOCKED') continue;
        const peak = side.peak || side.lock;
        if (!peak) continue;
        const v8 = peak.v8Scoring || {};
        rows.push({
          market: mkt,
          sport: d.sport,
          gameKey: d.gameKey,
          away: d.away,
          home: d.home,
          team: side.team,
          side: sideKey,
          stars: peak.stars ?? 0,
          units: peak.units ?? 0,
          odds: peak.odds ?? 0,
          book: peak.book ?? '',
          regime: peak.regime ?? side.promotedRegime ?? 'UNKNOWN',
          lockStage: side.lockStage ?? 'LOCKED',
          contribTier: side.contribTier ?? null,
          promotedBy: side.promotedBy ?? null,
          qFor50: null,
          qAg50: null,
          contribMargin: null,
          topShare: v8.topShare ?? null,
          wps: v8.walletPlayScore ?? null,
          walletCountFor: v8.walletCountFor ?? null,
          walletCountAgainst: v8.walletCountAgainst ?? null,
        });
        // Re-derive qFor/qAg/margin from walletDetails if present (robust even for pre-V8.1 picks)
        const wd = v8.walletDetails || [];
        const consensusSide = v8.consensusSide || sideKey;
        const forW = wd.filter(w => w.side === consensusSide);
        const agW = wd.filter(w => w.side && w.side !== consensusSide);
        const last = rows[rows.length - 1];
        last.qFor50 = forW.filter(w => (w.contribution ?? 0) >= 50).length;
        last.qAg50 = agW.filter(w => (w.contribution ?? 0) >= 50).length;
        last.contribMargin = last.qFor50 - last.qAg50;
        last.maxContribFor = forW.reduce((m, w) => Math.max(m, w.contribution ?? 0), 0);
        last.sumContribFor = forW.reduce((s, w) => s + (w.contribution ?? 0), 0);
        last.sumContribAg = agW.reduce((s, w) => s + (w.contribution ?? 0), 0);
        // Derive tier client-side if backend didn't
        if (!last.contribTier && wd.length) {
          if (last.contribMargin < 0) last.contribTier = 'MUTE';
          else if ((last.qFor50 >= 3 && last.qAg50 === 0) || (last.qFor50 >= 2 && last.contribMargin >= 1)) last.contribTier = 'STRONG';
          else if (last.qFor50 >= 1 && last.contribMargin >= 1 && last.maxContribFor >= 50) last.contribTier = 'STANDARD';
          else last.contribTier = 'LEAN';
        }
        last.score = confidenceScore(last);
      }
    }
  }
  return rows.sort((a, b) => b.score - a.score);
}

(async () => {
  const rows = await loadToday();
  console.log(`\n=== Today's Locked Picks ranked by V8.1 confidence (${today}) ===\n`);
  if (!rows.length) {
    console.log('No locked picks found for today.');
    process.exit(0);
  }
  console.log(
    'RK | Tier     | Pick                                          | ★   | u    | Odds   | qFor|qAg|mgn | Δctrb | Top% | WPS  | Regime      | PromotedBy'
  );
  console.log('-'.repeat(165));
  rows.forEach((r, i) => {
    const pick = `${r.sport} ${r.market} — ${r.team}`.padEnd(44);
    const tier = (r.contribTier ?? '—').padEnd(8);
    const qStr = `${r.qFor50}|${r.qAg50}|${r.contribMargin >= 0 ? '+' : ''}${r.contribMargin}`.padEnd(11);
    const delta = (r.sumContribFor - r.sumContribAg).toFixed(0).padEnd(5);
    const top = r.topShare != null ? (r.topShare * 100).toFixed(0) + '%' : '—';
    const wps = r.wps != null ? r.wps.toFixed(2) : '—';
    const regime = (r.regime || '—').padEnd(11);
    const prom = r.promotedBy ?? '—';
    console.log(
      `${String(i + 1).padStart(2)} | ${tier} | ${pick} | ${String(r.stars).padEnd(3)} | ${String(r.units).padEnd(4)} | ${(r.odds >= 0 ? '+' : '') + r.odds}`.padEnd(100) +
        `| ${qStr}| ${delta} | ${top.padEnd(4)} | ${String(wps).padEnd(4)} | ${regime} | ${prom}`
    );
  });

  console.log('\nLegend:');
  console.log('  Tier    = V8.1 contribution tier (STRONG > STANDARD > LEAN > MUTE)');
  console.log('  qFor    = # for-side wallets with contribution ≥ 50');
  console.log('  qAg     = # against-side wallets with contribution ≥ 50');
  console.log('  mgn     = qFor − qAg  (want ≥ +1)');
  console.log('  Δctrb   = Σcontribution_for − Σcontribution_against  (> 100 preferred)');
  console.log('  Top%    = share of for-side contribution from the single biggest wallet (lower = better)');
  console.log('  WPS     = raw WalletPlayScore');
  console.log('  Regime  = CLEAR_MOVE / NEAR_START / SMALL_MOVE / NO_MOVE');
  process.exit(0);
})();
