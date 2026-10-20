/**
 * Grade the 2026-10-20 UCL Napoli ML lock as WIN.
 *
 * Board key is nap_bod (Napoli @ Bodø/Glimt). ESPN lists the same match
 * flipped (Bodo/Glimt at Napoli) — 4-3 FT, STATUS_FULL_TIME, not AET/PEN.
 * Away Napoli ML is a 90-minute WIN; profit follows locked units/odds.
 *
 * Usage: node scripts/_grade_napoli_bod_ml.mjs [--dry]
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { resolveSOCTeam } from './lib/soccerTeams.js';
import { calculateOutcome, findMatchingGame } from './gradeSharpActions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');
const DATE = '2026-10-20';
const CANDIDATE_IDS = ['2026-10-20_SOC_nap_bod', '2026-10-20_SOC_bod_nap'];
const ESPN_UCL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard?dates=20261020';
const ESPN_HEADERS = { 'User-Agent': 'curl/8.7.1', Accept: 'application/json' };

function initFirebase() {
  if (admin.apps.length) return admin.firestore();
  const sakPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  if (fs.existsSync(sakPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(fs.readFileSync(sakPath, 'utf8'))),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

function calculateProfit(outcome, odds, units = 0) {
  if (!units || outcome === 'PUSH' || !outcome) return 0;
  if (outcome === 'WIN') {
    return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
  }
  return -units;
}

function pickLine(sideData) {
  for (const v of [sideData?.lock?.line, sideData?.peak?.line, sideData?.line]) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function napoliSide(gameKey, side, team) {
  const raw = String(gameKey || '').replace(/^SOC:/, '');
  const [away, home] = raw.split('_');
  if (String(side).toLowerCase() === 'away' && away === 'nap') return true;
  if (String(side).toLowerCase() === 'home' && home === 'nap') return true;
  return /napoli/i.test(String(team || ''));
}

function isNapBodKey(gameKey) {
  const raw = String(gameKey || '').replace(/^(SOC|NHL|NBA|MLB):/, '');
  return raw === 'nap_bod' || raw === 'bod_nap';
}

async function fetchEspnFinal() {
  const res = await fetch(ESPN_UCL, { headers: ESPN_HEADERS });
  if (!res.ok) throw new Error(`ESPN UCL ${res.status}`);
  const data = await res.json();
  for (const e of data.events || []) {
    const comp = e.competitions?.[0];
    const comps = comp?.competitors || [];
    const away = comps.find((c) => c.homeAway === 'away') || {};
    const home = comps.find((c) => c.homeAway === 'home') || {};
    const awayName = away.team?.displayName || away.team?.name || '';
    const homeName = home.team?.displayName || home.team?.name || '';
    const codes = [resolveSOCTeam(awayName), resolveSOCTeam(homeName)].map((c) => (c || '').toLowerCase());
    if (!(codes.includes('nap') && codes.includes('bod'))) continue;
    const stName = comp.status?.type?.name || '';
    const wentBeyond90 = stName === 'STATUS_FINAL_AET' || stName === 'STATUS_FINAL_PEN';
    return {
      awayCode: (resolveSOCTeam(awayName) || '').toLowerCase(),
      homeCode: (resolveSOCTeam(homeName) || '').toLowerCase(),
      awayTeam: awayName,
      homeTeam: homeName,
      awayScore: parseInt(away.score, 10) || 0,
      homeScore: parseInt(home.score, 10) || 0,
      wentBeyond90,
      statusName: stName,
      completed: !!(comp.status?.type?.completed || comp.status?.type?.state === 'post'),
    };
  }
  return null;
}

function boardGame(espn) {
  return findMatchingGame(
    { sport: 'SOC', gameKey: 'nap_bod', date: DATE },
    [], [], [], [], [espn],
  );
}

async function findPickDocs(db) {
  const found = [];
  const seen = new Set();
  for (const id of CANDIDATE_IDS) {
    const snap = await db.collection('sharpFlowPicks').doc(id).get();
    if (snap.exists) {
      found.push(snap);
      seen.add(snap.id);
    }
  }
  const q = await db.collection('sharpFlowPicks').where('date', '==', DATE).where('sport', '==', 'SOC').get();
  for (const doc of q.docs) {
    if (seen.has(doc.id)) continue;
    const d = doc.data() || {};
    if (isNapBodKey(d.gameKey) || /napoli/i.test(`${d.away || ''} ${d.home || ''}`)) {
      found.push(doc);
      seen.add(doc.id);
    }
  }
  return found;
}

function sideAlreadyWon(sideData, profit) {
  return sideData?.status === 'COMPLETED'
    && sideData?.result?.outcome === 'WIN'
    && Number(sideData?.result?.profit) === profit;
}

const espn = await fetchEspnFinal();
if (!espn) {
  console.error('REFUSING — ESPN UCL has no Napoli/Bodø final for 2026-10-20');
  process.exit(1);
}
console.log(`ESPN ${espn.awayTeam} ${espn.awayScore}-${espn.homeScore} ${espn.homeTeam} ${espn.statusName} wentBeyond90=${espn.wentBeyond90}`);
if (!espn.completed || espn.wentBeyond90) {
  console.error('REFUSING — not a 90-minute full-time final');
  process.exit(1);
}

const board = boardGame(espn);
if (!board) {
  console.error('REFUSING — could not map ESPN final onto nap_bod');
  process.exit(1);
}
const napoliOutcome = calculateOutcome(board, 'ML', 'away', null, 'SOC');
if (napoliOutcome !== 'WIN' || board.awayScore !== 4 || board.homeScore !== 3) {
  console.error(`REFUSING — expected Napoli away WIN 4-3, got ${napoliOutcome} ${board.awayScore}-${board.homeScore}`);
  process.exit(1);
}

const db = initFirebase();
const picks = await findPickDocs(db);
if (!picks.length) {
  console.error('REFUSING — no sharpFlowPicks doc for Napoli/Bodø 2026-10-20');
  process.exit(1);
}

let wrote = 0;
for (const snap of picks) {
  const d = snap.data() || {};
  const sides = d.sides && typeof d.sides === 'object' ? d.sides : null;
  if (!sides) {
    console.error(`REFUSING — ${snap.id} has no sides`);
    process.exit(1);
  }
  const rawKey = String(d.gameKey || '').replace(/^SOC:/, '');
  const oriented = findMatchingGame(
    { sport: 'SOC', gameKey: rawKey || 'nap_bod', date: DATE },
    [], [], [], [], [espn],
  ) || board;
  const winner = oriented.wentBeyond90 ? 'draw'
    : oriented.awayScore > oriented.homeScore ? 'away'
      : oriented.homeScore > oriented.awayScore ? 'home' : 'draw';

  console.log(`${snap.id} status=${d.status} key=${d.gameKey} ${d.away} @ ${d.home}`);

  const updates = {
    'result.awayScore': oriented.awayScore,
    'result.homeScore': oriented.homeScore,
    'result.winner': winner,
    'result.source': 'ESPN_SOC_API',
  };
  let allSidesGraded = true;
  let napoliHit = false;

  for (const [side, sideData] of Object.entries(sides)) {
    const outcome = calculateOutcome(oriented, 'ML', String(side).toLowerCase(), pickLine(sideData), 'SOC');
    if (!outcome) {
      allSidesGraded = false;
      continue;
    }
    const units = sideData.finalUnits
      ?? sideData.v8_agsUnitsApplied
      ?? sideData.peak?.units
      ?? sideData.lock?.units
      ?? 0;
    const odds = sideData.lock?.odds || sideData.peak?.odds || 0;
    const isTracked = !units;
    const profit = parseFloat((isTracked ? 0 : calculateProfit(outcome, odds, units)).toFixed(2));
    const isNapoli = napoliSide(rawKey || d.gameKey, side, sideData.team || d.away || d.home);
    if (isNapoli) {
      napoliHit = true;
      if (outcome !== 'WIN') {
        console.error(`REFUSING — Napoli side ${side} calculated ${outcome}`);
        process.exit(1);
      }
      console.log(`  Napoli ${side}: ${units}u @ ${odds} → WIN ${profit >= 0 ? '+' : ''}${profit}u`);
      if (sideAlreadyWon(sideData, profit) && d.status === 'COMPLETED'
        && d.result?.awayScore === oriented.awayScore && d.result?.homeScore === oriented.homeScore) {
        console.log(`  already graded WIN — skip ${snap.id} ${side}`);
        continue;
      }
    }
    updates[`sides.${side}.status`] = 'COMPLETED';
    updates[`sides.${side}.result.outcome`] = outcome;
    updates[`sides.${side}.result.profit`] = profit;
    updates[`sides.${side}.result.tracked`] = isTracked;
    updates[`sides.${side}.result.gradedAt`] = admin.firestore.FieldValue.serverTimestamp();
  }
  for (const [side, sideData] of Object.entries(sides)) {
    if (sideData?.status !== 'COMPLETED' && !updates[`sides.${side}.status`]) allSidesGraded = false;
  }
  if (allSidesGraded) updates.status = 'COMPLETED';
  if (!napoliHit) {
    console.error(`REFUSING — ${snap.id} has no Napoli side`);
    process.exit(1);
  }
  if (DRY) {
    console.log('DRY — would write', updates);
    continue;
  }
  await snap.ref.update(updates);
  wrote++;
}

const posSnap = await db.collection('sharp_action_positions')
  .where('date', '==', DATE)
  .where('sport', '==', 'SOC')
  .get();
let posN = 0;
for (const doc of posSnap.docs) {
  const p = doc.data() || {};
  if (!isNapBodKey(p.gameKey)) continue;
  if (String(p.marketType || 'ML').toUpperCase() !== 'ML') continue;
  const rawKey = String(p.gameKey || '').replace(/^SOC:/, '');
  const oriented = findMatchingGame(
    { sport: 'SOC', gameKey: rawKey, date: DATE, away: p.away, home: p.home, marketType: 'ML' },
    [], [], [], [], [espn],
  );
  if (!oriented) continue;
  const outcome = calculateOutcome(oriented, 'ML', String(p.side || '').toLowerCase(), null, 'SOC');
  if (!outcome) continue;
  const entryPrice = p.avgPrice || 0;
  const settledPrice = outcome === 'WIN' ? 1.0 : outcome === 'LOSS' ? 0.0 : entryPrice;
  const settledPnl = Math.round((settledPrice - entryPrice) * (p.size || 0));
  if (p.status === 'GRADED' && p.result === outcome && p.score?.away === oriented.awayScore && p.score?.home === oriented.homeScore) {
    continue;
  }
  console.log(`  position ${doc.id} ${p.side} ${p.teamName || ''} → ${outcome}`);
  if (DRY) continue;
  await doc.ref.update({
    status: 'GRADED',
    result: outcome,
    'score.away': oriented.awayScore,
    'score.home': oriented.homeScore,
    settledPnl,
    settledPrice,
    gradedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  posN++;
}

console.log(DRY ? 'DRY done.' : `Wrote ${wrote} pick doc(s), ${posN} position(s). Refresh Sharp Flow — Napoli ML is WIN.`);
process.exit(0);
