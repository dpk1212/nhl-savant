/**
 * Grade finished ATP moneylines that are still sitting live.
 *
 * ESPN ATP scoreboard + Polymarket resolved 0/1 prices. Writes COMPLETED
 * onto ungraded LOCKED/LEAN sides in sharpFlowPicks and GRADED onto
 * matching sharp_action_positions.
 *
 * Usage: node scripts/_grade_finished_atp.mjs [--dry]
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import admin from 'firebase-admin';
import { calculateOutcome } from './gradeSharpActions.js';
import {
  atpCodesMatch,
  isGradableATPMainML,
  isMainATPMatchSlug,
  namesLooselyMatch,
  resolveATPPlayer,
} from './lib/atpPlayers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');
const ESPN_ATP = 'https://site.api.espn.com/apis/site/v2/sports/tennis/atp/scoreboard';
const GAMMA = 'https://gamma-api.polymarket.com/events';
const ESPN_HEADERS = { 'User-Agent': 'curl/8.7.1', Accept: 'application/json' };
const DATES = etDatesBack(2);

function etDatesBack(n) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const d = new Date(Date.now() - i * 86400000);
    out.push(d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }));
  }
  return out;
}

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

function lockedOdds(sideData) {
  for (const v of [
    sideData?.lock?.odds, sideData?.peak?.odds,
    sideData?.lock?.pinnacleOdds, sideData?.peak?.pinnacleOdds,
  ]) {
    const n = Number(v);
    if (Number.isFinite(n) && n !== 0) return n;
  }
  return 0;
}

function espnDateET(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

export function parseJsonField(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try { return JSON.parse(v); } catch { return null; }
  }
  return null;
}

export function matchFromPolyMarket(main, extra = {}) {
  if (!main) return null;
  const names = parseJsonField(main.outcomes) || [];
  const prices = (parseJsonField(main.outcomePrices) || []).map((p) => Number(p));
  if (names.length < 2 || prices.length < 2) return null;
  const resolved = main.closed === true || main.umaResolutionStatus === 'resolved'
    || ((prices[0] === 0 || prices[0] === 1) && (prices[1] === 0 || prices[1] === 1)
      && prices[0] !== prices[1]);
  if (!resolved) return null;
  const aWin = prices[0] > prices[1];
  const hWin = prices[1] > prices[0];
  if (aWin === hWin) return null;
  const aName = String(names[0]);
  const hName = String(names[1]);
  const aCode = resolveATPPlayer(aName);
  const hCode = resolveATPPlayer(hName);
  if (!aCode || !hCode) return null;
  return {
    source: extra.source || 'POLYMARKET',
    dateET: extra.dateET || null,
    awayCode: aCode,
    homeCode: hCode,
    awayTeam: aName,
    homeTeam: hName,
    awayScore: aWin ? 1 : 0,
    homeScore: hWin ? 1 : 0,
    statusName: extra.statusName || 'POLY_RESOLVED',
    slug: extra.slug || '',
  };
}

async function fetchEspnFinals() {
  const res = await fetch(ESPN_ATP, { headers: ESPN_HEADERS });
  if (!res.ok) throw new Error(`ESPN ATP ${res.status}`);
  const data = await res.json();
  const matches = [];
  for (const ev of data.events || []) {
    const groups = ev.groupings?.length ? ev.groupings : [{ competitions: ev.competitions || [] }];
    for (const group of groups) {
      const groupSlug = group.grouping?.slug || '';
      if (groupSlug && groupSlug !== 'mens-singles') continue;
      for (const comp of group.competitions || []) {
        const typeSlug = comp.type?.slug || '';
        if (typeSlug && typeSlug !== 'mens-singles') continue;
        const st = comp.status?.type;
        const name = st?.name || '';
        if (name.startsWith('STATUS_POSTPONED') || name.startsWith('STATUS_CANCELED')
          || name.startsWith('STATUS_CANCELLED') || name.startsWith('STATUS_SUSPENDED')) {
          continue;
        }
        if (st?.state !== 'post' && !st?.completed && !name.startsWith('STATUS_FINAL')) continue;
        const comps = comp.competitors || [];
        if (comps.length < 2) continue;
        const nameOf = (c) => c.athlete?.displayName || c.athlete?.fullName || '';
        const a = comps.find((c) => c.homeAway === 'away') || comps[0];
        const h = comps.find((c) => c.homeAway === 'home') || comps[1];
        const aName = nameOf(a);
        const hName = nameOf(h);
        const aCode = resolveATPPlayer(aName);
        const hCode = resolveATPPlayer(hName);
        if (!aCode || !hCode) continue;
        if (a.winner !== true && h.winner !== true) continue;
        matches.push({
          source: 'ESPN_ATP_API',
          dateET: espnDateET(comp.date) || espnDateET(ev.date),
          awayCode: aCode,
          homeCode: hCode,
          awayTeam: aName,
          homeTeam: hName,
          awayScore: a.winner === true ? 1 : 0,
          homeScore: h.winner === true ? 1 : 0,
          statusName: name,
        });
      }
    }
  }
  return matches;
}

export function orientMatch(pos, pool, { requireDate = true } = {}) {
  const rawKey = String(pos.gameKey || '').replace(/^ATP:/, '');
  const parts = rawKey.split('_').filter(Boolean);
  const dated = requireDate
    ? pool.filter((g) => !pos.date || g.dateET == null || g.dateET === pos.date)
    : pool;
  const tryPool = dated.length ? dated : pool;
  for (const g of tryPool) {
    if (parts.length >= 2 && atpCodesMatch(g.awayCode, parts[0]) && atpCodesMatch(g.homeCode, parts[1])) return g;
    if (parts.length >= 2 && atpCodesMatch(g.awayCode, parts[1]) && atpCodesMatch(g.homeCode, parts[0])) {
      return { ...g, awayScore: g.homeScore, homeScore: g.awayScore };
    }
  }
  for (const g of tryPool) {
    if (namesLooselyMatch(pos.away, g.awayTeam) && namesLooselyMatch(pos.home, g.homeTeam)) return g;
    if (namesLooselyMatch(pos.away, g.homeTeam) && namesLooselyMatch(pos.home, g.awayTeam)) {
      return { ...g, awayScore: g.homeScore, homeScore: g.awayScore };
    }
  }
  return null;
}

async function fetchPolyFinal(slug) {
  if (!isMainATPMatchSlug(slug)) return null;
  const res = await fetch(`${GAMMA}?slug=${encodeURIComponent(slug)}`, { headers: ESPN_HEADERS });
  if (!res.ok) return null;
  const data = await res.json();
  const ev = Array.isArray(data) ? data[0] : data;
  if (!ev) return null;
  const mkts = ev.markets || [];
  const main = mkts.find((m) => {
    const q = String(m.question || m.groupItemTitle || '');
    return isGradableATPMainML({ title: q, marketType: 'ML' })
      && !/completed match|set\s*\d|first set/i.test(q);
  }) || mkts[0];
  if (!main) return null;
  return matchFromPolyMarket(main, {
    source: 'POLYMARKET',
    dateET: espnDateET(ev.endDate || ev.startTime || main.endDate) || null,
    statusName: 'POLY_RESOLVED',
    slug,
  });
}

function slugOf(doc) {
  return doc.slug || doc.eventSlug || doc.peak?.eventSlug || doc.lock?.eventSlug
    || doc.sides?.home?.peak?.eventSlug || doc.sides?.away?.peak?.eventSlug
    || doc.sides?.home?.lock?.eventSlug || doc.sides?.away?.lock?.eventSlug
    || '';
}

function sideNeedsGrade(sd) {
  if (!sd) return false;
  if (sd.status === 'COMPLETED' && sd.result?.outcome) return false;
  const stage = sd.lockStage || '';
  const units = sd.finalUnits ?? sd.peak?.units ?? sd.lock?.units ?? 0;
  return stage === 'LOCKED' || stage === 'LEAN' || Number(units) > 0;
}

function alreadyWon(sd, profit) {
  return sd?.status === 'COMPLETED'
    && sd?.result?.outcome
    && Number(sd.result.profit) === Number(profit);
}

function isAtpSport(s) {
  const v = String(s || '').toUpperCase();
  return v === 'ATP' || v === 'TENNIS';
}

async function main() {
const db = initFirebase();
const espn = await fetchEspnFinals();
console.log(`ESPN ATP finals: ${espn.length}`);

const pickById = new Map();
for (const date of DATES) {
  const snap = await db.collection('sharpFlowPicks').where('date', '==', date).get();
  for (const doc of snap.docs) {
    const d = doc.data() || {};
    if (!isAtpSport(d.sport)) continue;
    pickById.set(doc.id, { snap: doc, d });
  }
}
try {
  const pendingSnap = await db.collection('sharpFlowPicks').where('status', '==', 'PENDING').get();
  for (const doc of pendingSnap.docs) {
    const d = doc.data() || {};
    if (!isAtpSport(d.sport) || pickById.has(doc.id)) continue;
    pickById.set(doc.id, { snap: doc, d });
  }
} catch (e) {
  console.warn(`PENDING query skipped: ${e.message}`);
}

const ungraded = [];
for (const { snap, d } of pickById.values()) {
  const sides = d.sides || {};
  const pending = Object.entries(sides).filter(([, sd]) => sideNeedsGrade(sd));
  if (!pending.length && d.status === 'COMPLETED') continue;
  if (!pending.length && d.status !== 'PENDING') continue;
  ungraded.push({ snap, d, pending: pending.length ? pending : Object.entries(sides) });
}

console.log(`ATP pick docs ${pickById.size} · ungraded ${ungraded.length} · dates ${DATES.join(',')}`);
if (!ungraded.length) {
  console.log('No ungraded ATP picks.');
}

let wrote = 0;
const polyCache = new Map();
for (const row of ungraded) {
  const { snap, d } = row;
  const pos = {
    sport: 'ATP',
    gameKey: d.gameKey,
    date: d.date,
    away: d.away,
    home: d.home,
    marketType: 'ML',
    title: d.title,
  };
  let match = orientMatch(pos, espn, { requireDate: true })
    || orientMatch(pos, espn, { requireDate: false });
  if (!match) {
    const slug = slugOf(d);
    if (slug && !polyCache.has(slug)) polyCache.set(slug, await fetchPolyFinal(slug));
    const poly = slug ? polyCache.get(slug) : null;
    if (poly) match = orientMatch(pos, [poly], { requireDate: false });
  }
  const sides = d.sides || {};
  const stageDump = Object.entries(sides).map(([k, sd]) =>
    `${k}:${sd?.lockStage || sd?.status || '?'}@${sd?.finalUnits ?? sd?.peak?.units ?? 0}u`).join(' ');
  console.log(`${snap.id} status=${d.status} ${d.away} @ ${d.home} ${stageDump} match=${match ? `${match.awayTeam} ${match.awayScore}-${match.homeScore} ${match.homeTeam} (${match.source})` : 'NONE'}`);
  if (!match) continue;
  if (!isGradableATPMainML({ ...d, marketType: 'ML' })) {
    console.log('  skip — not a main ML');
    continue;
  }

  const updates = {
    'result.awayScore': match.awayScore,
    'result.homeScore': match.homeScore,
    'result.winner': match.awayScore > match.homeScore ? 'away' : 'home',
    'result.source': match.source,
  };
  let allSidesGraded = true;
  let gradedSide = false;
  for (const [side, sideData] of Object.entries(sides)) {
    const outcome = calculateOutcome(match, 'ML', String(side).toLowerCase(), null, 'ATP');
    if (!outcome) {
      allSidesGraded = false;
      continue;
    }
    const units = sideData.finalUnits
      ?? sideData.v8_agsUnitsApplied
      ?? sideData.peak?.units
      ?? sideData.lock?.units
      ?? 0;
    const odds = lockedOdds(sideData);
    const isTracked = !units;
    const profit = parseFloat((isTracked ? 0 : calculateProfit(outcome, odds, units)).toFixed(2));
    const stage = sideData.lockStage || '';
    console.log(`  ${side} ${sideData.team || ''} ${units}u @ ${odds} stage=${stage} → ${outcome} ${profit >= 0 ? '+' : ''}${profit}u`);
    if (alreadyWon(sideData, profit)
      && d.result?.awayScore === match.awayScore
      && d.result?.homeScore === match.homeScore) {
      continue;
    }
    updates[`sides.${side}.status`] = 'COMPLETED';
    updates[`sides.${side}.result.outcome`] = outcome;
    updates[`sides.${side}.result.profit`] = profit;
    updates[`sides.${side}.result.tracked`] = isTracked;
    updates[`sides.${side}.result.gradedAt`] = admin.firestore.FieldValue.serverTimestamp();
    gradedSide = true;
  }
  for (const [side, sideData] of Object.entries(sides)) {
    if (sideData?.status !== 'COMPLETED' && !updates[`sides.${side}.status`]) allSidesGraded = false;
  }
  if (allSidesGraded) updates.status = 'COMPLETED';
  if (!gradedSide) continue;
  if (DRY) {
    console.log('  DRY — would write', Object.keys(updates));
    continue;
  }
  await snap.ref.update(updates);
  wrote++;
}

let posN = 0;
for (const date of DATES) {
  const posSnap = await db.collection('sharp_action_positions').where('date', '==', date).get();
  for (const doc of posSnap.docs) {
    const p = doc.data() || {};
    if (!isAtpSport(p.sport)) continue;
    if (String(p.marketType || 'ML').toUpperCase() !== 'ML') continue;
    if (p.status === 'GRADED' && (p.result === 'WIN' || p.result === 'LOSS' || p.result === 'PUSH')) continue;
    const pos = {
      sport: 'ATP',
      gameKey: p.gameKey,
      date: p.date,
      away: p.away,
      home: p.home,
      marketType: 'ML',
      title: p.title,
    };
    let match = orientMatch(pos, espn, { requireDate: true })
      || orientMatch(pos, espn, { requireDate: false });
    if (!match) {
      const slug = p.slug || p.eventSlug || '';
      if (slug && !polyCache.has(slug)) polyCache.set(slug, await fetchPolyFinal(slug));
      const poly = slug ? polyCache.get(slug) : null;
      if (poly) match = orientMatch(pos, [poly], { requireDate: false });
    }
    if (!match) continue;
    const outcome = calculateOutcome(match, 'ML', String(p.side || '').toLowerCase(), null, 'ATP');
    if (!outcome) continue;
    const entryPrice = Number(p.avgPrice) || 0;
    const settledPrice = outcome === 'WIN' ? 1 : outcome === 'LOSS' ? 0 : entryPrice;
    const settledPnl = Math.round((settledPrice - entryPrice) * (Number(p.size) || 0));
    console.log(`  position ${doc.id} ${p.side} ${p.teamName || ''} → ${outcome}`);
    if (DRY) continue;
    await doc.ref.update({
      status: 'GRADED',
      result: outcome,
      'score.away': match.awayScore,
      'score.home': match.homeScore,
      settledPnl,
      settledPrice,
      gradedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    posN++;
  }
}

console.log(DRY
  ? 'DRY done.'
  : `Wrote ${wrote} ATP pick doc(s), ${posN} position(s).`);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
