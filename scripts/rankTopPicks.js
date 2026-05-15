/**
 * rankTopPicks.js — AGS-Unified v9 top-picks ranker.
 *
 * Replaces the legacy v7.3 HC × Σ × Δw ranker. Single sort key now:
 *
 *   primary  : AGS-U value (descending)
 *   tiebreak : AGS-U quintile (descending)
 *   final    : commenceTime (ascending — earliest game first)
 *
 * The AGS-U value is read directly from the v8_ags stamp written by
 * scripts/syncPickStateAuthoritative.js, so what the user sees on the
 * card and what this report shows are guaranteed to agree.
 *
 * Outputs:
 *   - Console table ranked top → bottom by AGS-U
 *   - public/top_picks_ranked.json (machine-readable, one row per pick)
 *   - top-picks-ranked.txt captured by .github/workflows/rank-today-locks.yml
 *
 * Usage:  node scripts/rankTopPicks.js
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  AGS_FALLBACK_CALIBRATION,
  agsTierFromValue,
  agsQuintileFromValue,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
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

const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const fmtAgs = (v) => (v == null || !Number.isFinite(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(2));
const fmtOdds = (o) => (o == null ? '—' : (o > 0 ? '+' + o : String(o)));
const pad = (s, n) => String(s).padEnd(n);
const padR = (s, n) => String(s).padStart(n);

const TIER_RANK = { ELITE: 6, PREMIUM: 5, LOCK: 4, LEAN: 3, WEAK: 2, FADE: 1, UNKNOWN: 0 };
const VALID_TIERS = new Set(['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK', 'FADE']);

async function loadCalibration() {
  try {
    const snap = await db.collection('agsCalibration').doc('current').get();
    if (snap.exists) {
      const data = snap.data();
      return {
        normalizers: data.normalizers || AGS_FALLBACK_CALIBRATION.normalizers,
        quintiles:   data.quintiles   || AGS_FALLBACK_CALIBRATION.quintiles,
        thresholds:  data.thresholds  || AGS_FALLBACK_CALIBRATION.thresholds,
        source: 'firestore',
        sampleSize: data.sampleSize || null,
        computedAt: data.computedAt  || null,
      };
    }
  } catch (e) {
    console.error('[rank-top-picks] calibration load failed:', e.message);
  }
  return AGS_FALLBACK_CALIBRATION;
}

async function loadTodayLockedPicks(cal) {
  const out = [];
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '==', today).get();
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const sides = data.sides || {};
      for (const [sideKey, sd] of Object.entries(sides)) {
        if (sd.lockStage !== 'LOCKED') continue;
        if (sd.status === 'COMPLETED') continue;
        const ags = Number.isFinite(sd.v8_ags) ? sd.v8_ags : null;

        // Tier / quintile — prefer the stamped values, but if the stamp
        // is from the pre-v9 tier schema (STRONG / NEUTRAL / etc.) or
        // missing, derive fresh from `ags` against live calibration.
        const stampedTier = sd.v8_agsTier;
        const agsTier = VALID_TIERS.has(stampedTier)
          ? stampedTier
          : (ags != null ? agsTierFromValue(ags, cal) : 'UNKNOWN');
        const agsQuintile = VALID_TIERS.has(stampedTier) && Number.isFinite(sd.v8_agsQuintile)
          ? sd.v8_agsQuintile
          : (ags != null ? agsQuintileFromValue(ags, cal) : null);

        out.push({
          docId: docSnap.id,
          col,
          market,
          sport: data.sport,
          gameKey: data.gameKey,
          side: sideKey,
          team: sd.team || sd.peak?.team || (sideKey === 'home' ? data.home : data.away),
          commenceTime: data.commenceTime || null,
          stars: sd.peak?.stars ?? sd.stars ?? null,
          units: sd.finalUnits ?? sd.peak?.units ?? 0,
          odds: sd.peak?.odds ?? sd.odds ?? null,
          promotedBy: sd.promotedBy || null,
          ags,
          agsTier,
          agsQuintile,
          dw: sd.v8_walletConsensusDelta ?? sd.v8Scoring?.deltaWinner ?? 0,
          hcMargin: sd.v8_hcMargin ?? 0,
          provenForCount: sd.v8_agsProvenForCount ?? 0,
          provenAgCount:  sd.v8_agsProvenAgCount  ?? 0,
        });
      }
    }
  }
  return out;
}

function rankPicks(picks) {
  return picks.slice().sort((a, b) => {
    const aAgs = Number.isFinite(a.ags) ? a.ags : -Infinity;
    const bAgs = Number.isFinite(b.ags) ? b.ags : -Infinity;
    if (bAgs !== aAgs) return bAgs - aAgs;
    const aTier = TIER_RANK[a.agsTier] || 0;
    const bTier = TIER_RANK[b.agsTier] || 0;
    if (bTier !== aTier) return bTier - aTier;
    const aTime = a.commenceTime || 0;
    const bTime = b.commenceTime || 0;
    return aTime - bTime;
  });
}

function quintileBar(q) {
  if (q == null) return '·····';
  const filled = '█'.repeat(q);
  const empty  = '·'.repeat(5 - q);
  return filled + empty;
}

function renderTable(ranked, cal) {
  console.log('');
  console.log('═'.repeat(120));
  console.log(`  AGS-UNIFIED v9 — TOP PICKS · ${today}`);
  console.log('═'.repeat(120));
  if (cal.source === 'firestore') {
    console.log(`  calibration: ${cal.source} · N=${cal.sampleSize} · q60=${cal.quintiles?.q60?.toFixed(2)} (LOCK) · q80=${cal.quintiles?.q80?.toFixed(2)} (PREMIUM) · q90=${cal.quintiles?.q90?.toFixed(2)} (ELITE)`);
  } else {
    console.log(`  calibration: fallback (firestore unavailable)`);
  }
  console.log('═'.repeat(120));
  console.log('');
  console.log(`  ${pad('#', 3)} ${pad('SPORT', 5)} ${pad('PICK', 30)} ${padR('AGS-U', 7)} ${pad('TIER', 8)} ${pad('Q', 7)} ${padR('u', 5)} ${padR('odds', 6)} ${pad('promotedBy', 20)}`);
  console.log('  ' + '─'.repeat(116));

  ranked.forEach((p, i) => {
    const team = (p.team || '').toString().slice(0, 28);
    const oddsStr = fmtOdds(p.odds);
    console.log(`  ${pad(String(i + 1), 3)} ${pad(p.sport || '—', 5)} ${pad(team, 30)} ${padR(fmtAgs(p.ags), 7)} ${pad(p.agsTier || '—', 8)} ${pad(quintileBar(p.agsQuintile), 7)} ${padR(Number(p.units || 0).toFixed(2), 5)} ${padR(oddsStr, 6)} ${pad(p.promotedBy || '—', 20)}`);
  });

  console.log('');
  console.log(`  ${ranked.length} locked picks for ${today}`);
  console.log('');

  const tierCounts = {};
  for (const p of ranked) tierCounts[p.agsTier] = (tierCounts[p.agsTier] || 0) + 1;
  const tierOrder = ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK', 'FADE', 'UNKNOWN'];
  const dist = tierOrder
    .filter(t => tierCounts[t])
    .map(t => `${t}=${tierCounts[t]}`)
    .join(' · ');
  if (dist) {
    console.log(`  tier distribution: ${dist}`);
    console.log('');
  }
}

async function main() {
  const cal = await loadCalibration();
  const picks = await loadTodayLockedPicks(cal);
  const ranked = rankPicks(picks);

  renderTable(ranked, cal);

  const publicDir = join(REPO_ROOT, 'public');
  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });
  const outPath = join(publicDir, 'top_picks_ranked.json');
  const outJson = {
    schemaVersion: 'ags-unified-v9',
    generatedAt: new Date().toISOString(),
    date: today,
    calibration: cal.source === 'firestore'
      ? { source: 'firestore', sampleSize: cal.sampleSize, quintiles: cal.quintiles, thresholds: cal.thresholds }
      : { source: 'fallback' },
    picks: ranked.map((p, i) => ({
      rank: i + 1,
      docId: p.docId,
      collection: p.col,
      market: p.market,
      sport: p.sport,
      gameKey: p.gameKey,
      side: p.side,
      team: p.team,
      commenceTime: p.commenceTime,
      stars: p.stars,
      units: p.units,
      odds: p.odds,
      promotedBy: p.promotedBy,
      ags: p.ags,
      agsTier: p.agsTier,
      agsQuintile: p.agsQuintile,
      dw: p.dw,
      hcMargin: p.hcMargin,
      provenForCount: p.provenForCount,
      provenAgCount: p.provenAgCount,
    })),
  };
  writeFileSync(outPath, JSON.stringify(outJson, null, 2));
  console.log(`  wrote ${outPath}`);
}

main().catch((e) => {
  console.error('[rank-top-picks] fatal:', e);
  process.exit(1);
});
