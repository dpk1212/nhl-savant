/**
 * Gold steam vs booked plays, crossed with Source A/B sharps on the same side.
 *
 *   node scripts/analyzeGoldSteamAb.mjs
 *
 * Reads public Firestore (sharpFlowPicks / Spreads / Totals) + data/wallet-profiles.json.
 * Writes /opt/cursor/artifacts/gold_steam_ab_analysis.json and a stdout report.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  enrichTicketTapeFromSide,
  steamGoldLockLabel,
} from '../src/lib/ticketTapeCapture.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const PATH_AB = new Set(['A', 'B']);
const SKILL_PATH = {
  SUPER: 'A', TOP: 'A', 'TOP+': 'A', MINI: 'A', 'MINI-': 'A', CONFIRMED: 'A',
  RANK: 'B',
  SHARP: 'C', 'SHARP-LEAN': 'C', 'SHARP-PRIME': 'C',
  DISSENT: 'D', WINNER: 'E',
};

function decodeValue(v) {
  if (v == null || typeof v !== 'object') return v;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue' in v) return decodeMap(v.mapValue?.fields || {});
  if ('arrayValue' in v) return (v.arrayValue?.values || []).map(decodeValue);
  return v;
}
function decodeMap(fields) {
  const out = {};
  for (const [k, v] of Object.entries(fields || {})) out[k] = decodeValue(v);
  return out;
}

async function listCollection(col) {
  const docs = [];
  let pageToken = '';
  for (;;) {
    const u = new URL(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${col}`);
    u.searchParams.set('pageSize', '100');
    if (pageToken) u.searchParams.set('pageToken', pageToken);
    const res = await fetch(u);
    if (!res.ok) throw new Error(`${col} ${res.status} ${await res.text()}`);
    const body = await res.json();
    for (const d of body.documents || []) {
      docs.push({
        id: String(d.name || '').split('/').pop(),
        ...decodeMap(d.fields || {}),
      });
    }
    pageToken = body.nextPageToken || '';
    if (!pageToken) break;
  }
  return docs;
}

function isAgsu(tag) {
  return typeof tag === 'string' && tag.startsWith('ags-unified-v');
}

function wilson(w, n, z = 1.96) {
  if (!(n > 0)) return null;
  const p = w / n;
  const z2 = z * z;
  const den = 1 + z2 / n;
  const mid = p + z2 / (2 * n);
  const half = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
  return {
    lo: Math.max(0, (mid - half) / den),
    hi: Math.min(1, (mid + half) / den),
  };
}

function agg(rows) {
  let n = 0, w = 0, l = 0, stake = 0, pnl = 0;
  for (const r of rows) {
    if (r.won == null) continue;
    n++;
    stake += r.units || 0;
    pnl += Number.isFinite(r.profit) ? r.profit : 0;
    if (r.won === 1) w++;
    else if (r.won === 0) l++;
  }
  const wr = n ? w / n : null;
  const ci = wilson(w, n);
  return {
    n, w, l, stake, pnl,
    wr,
    wrPct: wr != null ? +(wr * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    wrHi: ci ? +(ci.hi * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
  };
}

function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  const wr = a.wrPct == null ? '—' : `${a.wrPct}%`;
  const band = a.wrLo != null ? ` (${a.wrLo}–${a.wrHi})` : '';
  return `${a.n}  ${a.w}-${a.l}  ${wr}${band}  ${a.stake.toFixed(1)}u  ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u  ${roi}`;
}

function sourceFlags(rec) {
  if (!rec) return { a: false, b: false, confirmed: false, flat: false, source: null };
  const tier = String(rec.whitelistTier || '').toUpperCase();
  const src = String(rec.whitelistSource || '').toUpperCase();
  const picksN = Number(rec.picks?.n) || 0;
  const posN = Number(rec.positions?.n) || 0;
  const a = src.includes('A') || (picksN >= 2 && (src === '' && tier === 'CONFIRMED'));
  const b = src.includes('B') || (posN >= 4 && src === '' && tier === 'CONFIRMED');
  return {
    a: tier === 'CONFIRMED' && a,
    b: tier === 'CONFIRMED' && b,
    confirmed: tier === 'CONFIRMED',
    flat: tier === 'FLAT',
    source: rec.whitelistSource || null,
  };
}

function line(label, rows) {
  return `${label.padEnd(42)} ${fmt(agg(rows))}`;
}

function unitBand(u) {
  const x = Number(u) || 0;
  if (x < 1.25) return '≤1u';
  if (x < 3.5) return '2–3u';
  if (x < 4.75) return '4u';
  if (x < 5.35) return '5u';
  if (x < 5.9) return '5.4u';
  return '6u';
}

const UNIT_BANDS = ['≤1u', '2–3u', '4u', '5u', '5.4u', '6u'];

const profilesJson = JSON.parse(readFileSync(join(ROOT, 'data/wallet-profiles.json'), 'utf8'));
const profiles = profilesJson.profiles || profilesJson;

function profileOf(short, sport) {
  const p = profiles[short] || profiles[String(short || '').toLowerCase()];
  if (!p) return null;
  return p.bySport?.[sport] || null;
}

console.log('Fetching Firestore pick collections…');
const packs = await Promise.all(COLS.map(async ([col, mkt]) => ({ col, mkt, docs: await listCollection(col) })));
for (const p of packs) console.log(`  ${p.col}: ${p.docs.length} docs`);

const rows = [];
for (const { mkt, docs } of packs) {
  for (const data of docs) {
    if (!data.sides || typeof data.sides !== 'object') continue;
    for (const [sideKey, sd] of Object.entries(data.sides)) {
      if (!sd || sd.superseded) continue;
      if ((sd.status || data.status) !== 'COMPLETED') continue;
      if (!isAgsu(sd.promotedBy)) continue;
      const res = sd.result || data.result || {};
      if (!res.outcome) continue;
      const won = res.outcome === 'WIN' ? 1 : res.outcome === 'LOSS' ? 0 : null;
      if (won == null) continue;
      const lock = sd.lock || {};
      const peak = sd.peak || lock;
      const units = sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0;
      if (res.tracked === true) continue;
      const odds = peak.odds || lock.odds || 0;
      const computedProfit = won
        ? (odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100))
        : -units;
      const profit = Number.isFinite(res.profit) ? res.profit : computedProfit;
      const tape = enrichTicketTapeFromSide(sd);
      const goldLabel = steamGoldLockLabel(tape.ticketTape, tape.steam);
      const path = SKILL_PATH[sd.v8_hcStakeTier] || '?';
      const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
        .filter((w) => w && w.wallet && w.side);
      const sport = data.sport || 'NHL';
      let forA = 0, forB = 0, forConf = 0, forFlat = 0, forAny = 0;
      const seen = new Set();
      for (const w of wd) {
        if (w.side !== sideKey) continue;
        const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
        if (!short || seen.has(short)) continue;
        seen.add(short);
        forAny++;
        const flags = sourceFlags(profileOf(short, sport));
        if (flags.confirmed) forConf++;
        if (flags.flat) forFlat++;
        if (flags.a) forA++;
        if (flags.b) forB++;
      }
      const ev = tape.ticketTape?.evLock;
      let evBucket = 'missing';
      if (Number.isFinite(Number(ev))) {
        const v = Number(ev);
        evBucket = v < 0 ? '<0' : v < 2 ? '0-2' : v < 4 ? '2-4' : '4+';
      }
      const steamOn = !!tape.ticketTape?.steamOnLock;
      const gold = goldLabel === 'gold+limits' || goldLabel === 'gold-flat';
      const goldConfirmed = goldLabel === 'gold+limits';
      const steamOnFirst = !!tape.ticketTape?.steamOnFirst;
      const steamArriving = !steamOnFirst && steamOn;
      const steamDying = steamOnFirst && !steamOn;
      const dEv = tape.ticketTape?.dEvFirstToLock;
      rows.push({
        id: data.id,
        date: data.date,
        sport,
        mkt,
        sideKey,
        team: sd.team || sideKey,
        units,
        won,
        profit,
        odds,
        path,
        tier: sd.v8_hcStakeTier || null,
        goldLabel,
        gold,
        goldConfirmed,
        steamOn,
        steamOnFirst,
        steamArriving,
        steamDying,
        dEv,
        lastHourLock: Number.isFinite(tape.ticketTape?.lastHourLock)
          ? tape.ticketTape.lastHourLock
          : null,
        evBucket,
        ev,
        hasLog: (tape.ticketTape?.n || 0) > 0,
        forA,
        forB,
        forConf,
        forFlat,
        forAny,
        sharpAB: forA + forB > 0,
        pathAB: PATH_AB.has(path),
        edge: Number.isFinite(sd.v8_winnerAlignEdge) ? sd.v8_winnerAlignEdge : null,
        tapeScore: Number.isFinite(sd.v8_tapeScore) ? sd.v8_tapeScore : null,
        tapeAction: sd.v8_tapeAction || null,
        unitsPreTape: Number.isFinite(sd.v8_unitsPreTape) ? sd.v8_unitsPreTape : null,
        net: Number.isFinite(sd.v8_netMeanPrior) ? sd.v8_netMeanPrior : null,
        hcConfFor: Number(sd.v8_hcConfFor) || 0,
        provenFor: Number(sd.v8_agsProvenForCount) || 0,
        mutedBy: sd.mutedBy || null,
        staked: units > 0,
      });
    }
  }
}

const muted = rows.filter((r) => !r.staked);
{
  const stakedOnly = rows.filter((r) => r.staked);
  rows.length = 0;
  rows.push(...stakedOnly);
}

const withLog = rows.filter((r) => r.hasLog);
const goldish = (r) => r.gold || r.goldConfirmed;
const out = [];
const push = (s = '') => { out.push(s); console.log(s); };

push(`Gold steam × Source A/B  ·  ${new Date().toISOString()}`);
push(`Graded staked AGSU sides: ${rows.length}  ·  with tape log: ${withLog.length}  ·  muted 0u graded: ${muted.length}`);
push('');
push('Format: N  W-L  WR (95% Wilson)  stake  PnL  ROI');
push('');
push('=== 1. Closing Dime gold on OUR tickets (tape-log subset) ===');
push(line('all with log', withLog));
push(line('gold+limits (true gold card)', withLog.filter((r) => r.goldConfirmed)));
push(line('gold, limits flat', withLog.filter((r) => r.goldLabel === 'gold-flat')));
push(line('any gold (4.5%+ steam)', withLog.filter((r) => r.gold)));
push(line('steam at lock (not gold)', withLog.filter((r) => r.steamOn && !r.gold)));
push(line('steam arriving off→on', withLog.filter((r) => r.steamArriving)));
push(line('no steam at lock', withLog.filter((r) => !r.steamOn)));
push(line('EV 0–2% at lock', withLog.filter((r) => r.evBucket === '0-2')));
push(line('EV <0 at lock', withLog.filter((r) => r.evBucket === '<0')));
push('');
push('=== 2. Gold × Path A or B (the pick itself is A/B) ===');
push(line('gold AND Path A/B', withLog.filter((r) => r.gold && r.pathAB)));
push(line('gold AND Path C/D/other', withLog.filter((r) => r.gold && !r.pathAB)));
push(line('no gold AND Path A/B', withLog.filter((r) => !r.gold && r.pathAB)));
push('');
push('=== 3. Gold × Source A/B CONFIRMED on the SAME SIDE ===');
push(line('gold + Source A FOR', withLog.filter((r) => r.gold && r.forA > 0)));
push(line('gold + Source B FOR', withLog.filter((r) => r.gold && r.forB > 0)));
push(line('gold + A or B FOR', withLog.filter((r) => r.gold && r.sharpAB)));
push(line('gold + no A/B FOR', withLog.filter((r) => r.gold && !r.sharpAB)));
push(line('gold+limits + A or B FOR', withLog.filter((r) => r.goldConfirmed && r.sharpAB)));
push(line('gold+limits + no A/B', withLog.filter((r) => r.goldConfirmed && !r.sharpAB)));
push(line('steam arriving + A or B', withLog.filter((r) => r.steamArriving && r.sharpAB)));
push(line('steam arriving + no A/B', withLog.filter((r) => r.steamArriving && !r.sharpAB)));
push(line('EV 0–2 + A or B FOR', withLog.filter((r) => r.evBucket === '0-2' && r.sharpAB)));
push(line('EV 0–2 + no A/B FOR', withLog.filter((r) => r.evBucket === '0-2' && !r.sharpAB)));
push(line('no gold + A or B FOR', withLog.filter((r) => !r.gold && r.sharpAB)));
push('');
push('=== 3b. A/B baseline vs A/B with steam (the testable combo) ===');
push(line('A or B FOR (any steam)', withLog.filter((r) => r.sharpAB)));
push(line('A or B + steam at lock', withLog.filter((r) => r.sharpAB && r.steamOn)));
push(line('A or B + no steam', withLog.filter((r) => r.sharpAB && !r.steamOn)));
push(line('A or B + gold', withLog.filter((r) => r.sharpAB && r.gold)));
push(line('A or B + steam arriving', withLog.filter((r) => r.sharpAB && r.steamArriving)));
push(line('Source A FOR + steam arriving', withLog.filter((r) => r.forA > 0 && r.steamArriving)));
push(line('Source B FOR + steam arriving', withLog.filter((r) => r.forB > 0 && r.steamArriving)));
push(line('no A/B + steam at lock', withLog.filter((r) => !r.sharpAB && r.steamOn)));
push('');
push('=== 4. Same cells on the FULL graded book (no tape-log required) ===');
push(line('all staked graded', rows));
push(line('gold (log or freeze steam)', rows.filter((r) => r.gold)));
push(line('gold + A or B FOR', rows.filter((r) => r.gold && r.sharpAB)));
push(line('gold + no A/B FOR', rows.filter((r) => r.gold && !r.sharpAB)));
push(line('gold+limits + A or B', rows.filter((r) => r.goldConfirmed && r.sharpAB)));
push(line('Path A/B all', rows.filter((r) => r.pathAB)));
push('');
push('=== 5. Path mix inside gold + A/B ===');
for (const p of ['A', 'B', 'C', 'D', 'E', '?']) {
  const sub = withLog.filter((r) => r.gold && r.sharpAB && r.path === p);
  if (sub.length) push(line(`gold + A/B · Path ${p}`, sub));
}

const goldAB = withLog.filter((r) => r.gold && r.sharpAB);
push('');
push('=== 6. Underused tape — ranked exploration cells ===');
push(line('steam on→on', withLog.filter((r) => r.steamOnFirst && r.steamOn)));
push(line('steam on→off (dying)', withLog.filter((r) => r.steamDying)));
push(line('A/B + steam dying', withLog.filter((r) => r.sharpAB && r.steamDying)));
push(line('limits-only (no steam)', withLog.filter((r) => r.goldLabel === 'limits-only')));
push(line('EV 0–4%', withLog.filter((r) => r.evBucket === '0-2' || r.evBucket === '2-4')));
push(line('EV 4+%', withLog.filter((r) => r.evBucket === '4+')));
push(line('A/B + EV <0', withLog.filter((r) => r.sharpAB && r.evBucket === '<0')));
push(line('A/B + EV 0–4%', withLog.filter((r) => r.sharpAB && (r.evBucket === '0-2' || r.evBucket === '2-4'))));
push(line('A/B + arriving + EV 0–4%', withLog.filter((r) => r.sharpAB && r.steamArriving && (r.evBucket === '0-2' || r.evBucket === '2-4'))));
push(line('EV faded dEv≤−1.5', withLog.filter((r) => Number.isFinite(r.dEv) && r.dEv <= -1.5)));
push(line('A/B + EV faded dEv≤−1.5', withLog.filter((r) => r.sharpAB && Number.isFinite(r.dEv) && r.dEv <= -1.5)));
push('');
push('=== 7. Directional filter — mute losers vs keep winners (tape-log staked book) ===');
push('CUT = would have been 0u. KEEP = remaining staked book. ΔPnL = −(cut PnL) = units saved if muted.');
const allA = agg(withLog);
push(`baseline KEEP-all                         ${fmt(allA)}`);

function cf(name, pred) {
  const cut = withLog.filter(pred);
  const keep = withLog.filter((r) => !pred(r));
  const c = agg(cut);
  const k = agg(keep);
  const loserPct = c.n ? ((100 * c.l / c.n).toFixed(0) + '%') : '—';
  const saved = c.n ? (-c.pnl) : 0;
  const wrLift = (k.wrPct != null && allA.wrPct != null) ? (k.wrPct - allA.wrPct) : null;
  push(`${name}`);
  push(`  CUT  ${fmt(c)}  | ${loserPct} of cuts lost | saved ${saved >= 0 ? '+' : ''}${saved.toFixed(1)}u`);
  push(`  KEEP ${fmt(k)}  | WR ${wrLift == null ? '—' : (wrLift >= 0 ? '+' : '') + wrLift.toFixed(1) + 'pp vs book'}`);
}

cf('MUTE dEv≤−1.5 (EV faded vs Pin)', (r) => Number.isFinite(r.dEv) && r.dEv <= -1.5);
cf('MUTE dEv≤−1.5 AND EV<0', (r) => Number.isFinite(r.dEv) && r.dEv <= -1.5 && r.evBucket === '<0');
cf('MUTE dEv≤−1.5 AND EV<−1', (r) => Number.isFinite(r.dEv) && r.dEv <= -1.5 && Number(r.ev) < -1);
cf('MUTE live Ev-drift (EDGE≥15 & dEv≤−1.5 & EV<−1)', (r) => Number(r.edge) >= 15 && Number.isFinite(r.dEv) && r.dEv <= -1.5 && Number(r.ev) < -1);
cf('MUTE steam dying on→off', (r) => r.steamDying);
cf('MUTE EV 4+%', (r) => r.evBucket === '4+');
cf('MUTE EV fade OR steam dying', (r) => (Number.isFinite(r.dEv) && r.dEv <= -1.5) || r.steamDying);
cf('MUTE no steam at lock', (r) => !r.steamOn);

push('');
push('Winner pole (not a mute — KEEP only these vs rest):');
const winKeep = withLog.filter((r) => r.sharpAB && r.steamArriving);
const winRest = withLog.filter((r) => !(r.sharpAB && r.steamArriving));
push(`A/B + steam arriving                    ${fmt(agg(winKeep))}`);
push(`everything else                         ${fmt(agg(winRest))}`);

const liveMutePred = (r) => Number(r.edge) >= 15 && Number.isFinite(r.dEv) && r.dEv <= -1.5 && Number(r.ev) < -1;
const widerPred = (r) => Number.isFinite(r.dEv) && r.dEv <= -1.5 && Number(r.ev) < -1;
push('');
push('Live Ev-drift mute tickets still on the staked book (should be 0u if mute fired):');
for (const r of withLog.filter(liveMutePred)) {
  push(`  ${r.date} ${r.sport} ${r.mkt} ${r.team}  ${r.won ? 'W' : 'L'}  ${r.units}u  dEv=${r.dEv} ev=${r.ev} EDGE=${r.edge}`);
}
push('Wider fade (EV<−1) minus live mute — EDGE was <15:');
for (const r of withLog.filter((r) => widerPred(r) && !liveMutePred(r))) {
  push(`  ${r.date} ${r.sport} ${r.mkt} ${r.team}  ${r.won ? 'W' : 'L'}  ${r.units}u  dEv=${r.dEv} ev=${r.ev} EDGE=${r.edge}`);
}

push('');
push('=== Sample ALL gold tickets ===');
for (const r of withLog.filter((r) => r.gold)) {
  push(`  ${r.date} ${r.sport} ${r.mkt} ${r.team}  ${r.won ? 'W' : 'L'}  ${r.units}u  ${r.goldLabel}  path${r.path}  A${r.forA}/B${r.forB}  ev=${r.ev ?? '—'}`);
}

push('');
push('=== 8. Steam since go-live (schema v15/16, 2026-08-19) ===');
push('July cannot confirm steam: ticket tape log did not exist. Hold-up is early steam days vs late steam days, no retune.');
push('');

const STEAM_LIVE = '2026-08-19';
const jul = rows.filter((r) => r.date >= '2026-07-01' && r.date <= '2026-07-31');
const since = withLog.filter((r) => r.date >= STEAM_LIVE);
const early = since.filter((r) => r.date >= STEAM_LIVE && r.date <= '2026-08-24');
const late = since.filter((r) => r.date >= '2026-08-25');

push(`July staked graded: ${jul.length}  ·  tape log: ${jul.filter((r) => r.hasLog).length}  ← cannot confirm steam`);
push(`Steam-live tape-log book (${STEAM_LIVE}+): ${fmt(agg(since))}`);
push(`  early ${STEAM_LIVE}–08-24  ${fmt(agg(early))}`);
push(`  late  08-25–end           ${fmt(agg(late))}`);
push('');

push('-- Steam 2×2 (first → lock) since go-live --');
push(line('off → off', since.filter((r) => !r.steamOnFirst && !r.steamOn)));
push(line('off → on  (arriving)', since.filter((r) => r.steamArriving)));
push(line('on  → on  (already on)', since.filter((r) => r.steamOnFirst && r.steamOn)));
push(line('on  → off (dying)', since.filter((r) => r.steamDying)));
push('');
push('-- A/B CONFIRMED × steam (the testable combo) --');
push(line('A/B + arriving', since.filter((r) => r.sharpAB && r.steamArriving)));
push(line('A/B + steam at lock', since.filter((r) => r.sharpAB && r.steamOn)));
push(line('A/B + no steam', since.filter((r) => r.sharpAB && !r.steamOn)));
push(line('no A/B + steam at lock', since.filter((r) => !r.sharpAB && r.steamOn)));
push(line('HC-FOR≥1 + arriving', since.filter((r) => r.hcConfFor >= 1 && r.steamArriving)));
push(line('gold+limits', since.filter((r) => r.goldConfirmed)));
push(line('any gold 4.5%+', since.filter((r) => r.gold)));
push(line('steam 3–4.5% (not gold)', since.filter((r) => r.steamOn && !r.gold)));
push('');

function steamScore(keep, rest) {
  if (!keep.n) return 'none';
  if (keep.n < 12) return 'thin — not an edge yet';
  const lo = keep.wrLo;
  const lift = (keep.roi == null || rest.roi == null) ? null : keep.roi - rest.roi;
  if (!(keep.wrPct > rest.wrPct) || !(keep.roi > rest.roi)) return 'no split';
  if (keep.n >= 20 && lo >= 50 && lift >= 15) return 'best shot (still tracking)';
  if (keep.n >= 15 && keep.wrPct >= 58 && lift >= 8) return 'explore (not size)';
  return 'weak / watch';
}

const steamCells = [
  { name: 'A/B + steam arriving', pred: (r) => r.sharpAB && r.steamArriving },
  { name: 'steam arriving (any)', pred: (r) => r.steamArriving },
  { name: 'HC-FOR≥1 + arriving', pred: (r) => r.hcConfFor >= 1 && r.steamArriving },
  { name: 'A/B + steam at lock', pred: (r) => r.sharpAB && r.steamOn },
  { name: 'steam on at lock', pred: (r) => r.steamOn },
  { name: 'any gold 4.5%+', pred: (r) => r.gold },
  { name: 'gold+limits', pred: (r) => r.goldConfirmed },
];

function runSteamSplit(label, pool) {
  push(`-- ${label} n=${pool.length} --`);
  const outRows = [];
  for (const cell of steamCells) {
    const hit = pool.filter(cell.pred);
    const rest = pool.filter((r) => !cell.pred(r));
    const h = agg(hit);
    const o = agg(rest);
    const score = steamScore(h, o);
    push(`${cell.name}`);
    push(`  HIT  ${fmt(h)} | ${score}`);
    push(`  REST ${fmt(o)}`);
    outRows.push({ name: cell.name, score, hit: h, rest: o });
  }
  return outRows;
}

push('STEP 1 — Discover on EARLY steam days (08-19–08-24). Do not peek at late yet.');
const earlySteam = runSteamSplit('early steam', early);
push('');
push('STEP 2 — Freeze those cells, apply to LATE steam days (08-25+). No retune.');
const lateSteam = runSteamSplit('late steam', late);
push('');
push('Full steam-live book (since implementation):');
const sinceSteam = runSteamSplit('since 08-19', since);

push('');
push('Hold-up scorecard (early discover → late confirm). July = cannot (no tape).');
const holdRows = [];
for (const a of earlySteam) {
  const b = lateSteam.find((x) => x.name === a.name);
  const full = sinceSteam.find((x) => x.name === a.name);
  const earlyOk = a.score.startsWith('best') || a.score.startsWith('explore') || a.score.startsWith('weak');
  const lateOk = b && (b.score.startsWith('best') || b.score.startsWith('explore') || b.score.startsWith('weak'));
  const lateNo = b && (b.score === 'no split' || b.score === 'none');
  const earlyThin = a.score.startsWith('thin');
  const lateDir = !!(b?.hit?.n >= 8 && b.hit.wrPct > b.rest.wrPct && b.hit.roi > b.rest.roi);
  let hold = `${a.score} → ${b?.score || '—'}`;
  if (earlyThin && b?.score.startsWith('thin') && !lateDir) hold = 'thin both — keep tracking';
  else if ((earlyOk || (earlyThin && a.hit?.n >= 8 && a.hit.wrPct > a.rest.wrPct && a.hit.roi > a.rest.roi)) && lateDir) {
    hold = b.hit.n < 12 ? 'HOLDS direction (late thin)' : 'HOLDS direction';
  } else if (earlyOk && lateOk) hold = 'HOLDS direction';
  else if (earlyOk && lateNo) hold = 'FAILS late window';
  else if (earlyThin && lateOk) hold = 'late only (not a discover)';
  else if (a.score === 'no split' && lateOk) hold = 'late only';
  push(`${a.name.padEnd(28)} early=${String(a.score).padEnd(26)} late=${String(b?.score || '—').padEnd(26)} ${hold}`);
  holdRows.push({
    name: a.name,
    early: a.score,
    late: b?.score,
    since: full?.score,
    hold,
    earlyN: a.hit?.n,
    lateN: b?.hit?.n,
    sinceN: full?.hit?.n,
    earlyHit: a.hit,
    lateHit: b?.hit,
    sinceHit: full?.hit,
  });
}

push('');
push('-- Day-by-day steam arriving (cluster check) --');
const byDate = new Map();
for (const r of since) {
  if (!byDate.has(r.date)) byDate.set(r.date, []);
  byDate.get(r.date).push(r);
}
for (const d of [...byDate.keys()].sort()) {
  const day = byDate.get(d);
  const arr = day.filter((r) => r.steamArriving);
  const abArr = day.filter((r) => r.sharpAB && r.steamArriving);
  push(`${d}  book ${fmt(agg(day))}`);
  if (arr.length) push(`         arriving     ${fmt(agg(arr))}`);
  if (abArr.length) push(`         A/B arriving ${fmt(agg(abArr))}`);
}

push('');
push('-- Sport mix on A/B + arriving (is this one sport?) --');
const abArrAll = since.filter((r) => r.sharpAB && r.steamArriving);
const sports = [...new Set(abArrAll.map((r) => r.sport))].sort();
for (const s of sports) {
  push(line(`A/B arriving · ${s}`, abArrAll.filter((r) => r.sport === s)));
}
push('');
push('A/B + arriving tickets:');
for (const r of abArrAll.sort((a, b) => String(a.date).localeCompare(b.date))) {
  push(`  ${r.date} ${r.sport} ${r.mkt} ${r.team}  ${r.won ? 'W' : 'L'}  ${r.units}u  ${unitBand(r.units)}  path${r.path}  ev=${r.ev ?? '—'}  dEv=${r.dEv ?? '—'}  lh=${r.lastHourLock ?? '—'}`);
}

push('');
push('=== 9. Top 3 steam cells on the AUGUST book + unit tiers ===');
push('These tickets already shipped. Question is how much of August they carried, and whether that split is a 1u trick or holds at 4u / 5.4u / 6u.');
push('');

const augAll = rows.filter((r) => r.date >= '2026-08-01' && r.date <= '2026-08-31');
const augPre = augAll.filter((r) => r.date < STEAM_LIVE);
const augSteam = augAll.filter((r) => r.date >= STEAM_LIVE);
const augLog = augSteam.filter((r) => r.hasLog);

push(line('August staked (all)', augAll));
push(line('Aug 1–18 (no steam stamps)', augPre));
push(line('Aug 19–31 staked', augSteam));
push(line('Aug 19–31 tape-log', augLog));
push('');

const top3 = [
  { name: 'A/B + arriving', pred: (r) => r.sharpAB && r.steamArriving },
  { name: 'steam arriving (any)', pred: (r) => r.steamArriving },
  { name: 'A/B + steam at lock', pred: (r) => r.sharpAB && r.steamOn },
];

function shareLine(label, hit, book) {
  const h = agg(hit);
  const b = agg(book);
  const rest = agg(book.filter((r) => !hit.includes(r)));
  const nPct = b.n ? (100 * h.n / b.n).toFixed(0) : '—';
  const uPct = b.stake ? (100 * h.stake / b.stake).toFixed(0) : '—';
  const pnlPct = (b.pnl && Math.abs(b.pnl) > 0.01) ? (100 * h.pnl / b.pnl).toFixed(0) : '—';
  push(`${label}`);
  push(`  HIT  ${fmt(h)}  · ${nPct}% of tickets · ${uPct}% of units · ${pnlPct}% of book PnL`);
  push(`  REST ${fmt(rest)}`);
  return { hit: h, rest, book: b };
}

push('-- Contribution to August (already on the book) --');
push('Tape-log window is the only place these cells exist. Full August includes 08-01–18 with no steam tag.');
for (const cell of top3) {
  const hitLog = augLog.filter(cell.pred);
  shareLine(`${cell.name} vs Aug 19–31 tape-log`, hitLog, augLog);
}
push('');
push('Same cells vs FULL August staked book (pre-steam days sit in REST):');
for (const cell of top3) {
  const hit = augAll.filter((r) => r.hasLog && cell.pred(r));
  shareLine(`${cell.name} vs full August`, hit, augAll);
}

push('');
push('-- Unit-tier hold-up (Aug 19–31 tape-log). HIT vs other tickets in the SAME size band --');
function unitHold(name, pred, pool) {
  push(`${name}`);
  const rowsOut = [];
  for (const band of UNIT_BANDS) {
    const inBand = pool.filter((r) => unitBand(r.units) === band);
    if (!inBand.length) continue;
    const hit = inBand.filter(pred);
    const rest = inBand.filter((r) => !pred(r));
    const h = agg(hit);
    const o = agg(rest);
    const b = agg(inBand);
    let note = '—';
    if (!h.n) note = 'none in band';
    else if (h.n < 5) note = 'thin';
    else if (h.wrPct > o.wrPct && h.roi > o.roi) note = 'HOLDS vs same-size rest';
    else if (h.wrPct > o.wrPct) note = 'WR up, ROI not';
    else note = 'does not beat same-size rest';
    push(`  ${band.padEnd(8)} book ${fmt(b)}`);
    push(`           HIT  ${fmt(h)} | ${note}`);
    if (o.n) push(`           REST ${fmt(o)}`);
    rowsOut.push({ band, hit: h, rest: o, book: b, note });
  }
  return rowsOut;
}
const unitHoldRows = {};
for (const cell of top3) {
  unitHoldRows[cell.name] = unitHold(cell.name, cell.pred, augLog);
  push('');
}

push('-- Fat vs lean inside A/B + arriving --');
const abArr = augLog.filter((r) => r.sharpAB && r.steamArriving);
const lean = abArr.filter((r) => r.units < 4);
const fat = abArr.filter((r) => r.units >= 4);
push(line('A/B arriving <4u (lean)', lean));
push(line('A/B arriving 4u+ (believed)', fat));
push(line('A/B arriving 5.4u+', abArr.filter((r) => r.units >= 5.4)));
push('');
push('Path mix on A/B arriving:');
for (const p of ['A', 'B', 'C', 'D', 'E', '?']) {
  const sub = abArr.filter((r) => r.path === p);
  if (sub.length) push(line(`path ${p}`, sub));
}

push('');
push('-- Counterfactuals (do not ship). Linear rescale of actual profit. --');
function rescale(r, newU) {
  const old = Number(r.units) || 0;
  if (!(old > 0)) return 0;
  return (Number(r.profit) || 0) * (newU / old);
}
function cfBook(label, pool, mapper) {
  const cloned = pool.map(mapper);
  push(`${label.padEnd(52)} ${fmt(agg(cloned))}`);
}
const augLogPnl = agg(augLog);
push(`actual Aug 19–31 tape-log                         ${fmt(augLogPnl)}`);
cfBook('if A/B arriving never shipped (0u those 24)', augLog, (r) => (
  (r.sharpAB && r.steamArriving) ? { ...r, units: 0, profit: 0, won: null } : r
));
cfBook('if A/B arriving floored at 4u (lean only)', augLog, (r) => {
  if (!(r.sharpAB && r.steamArriving) || r.units >= 4) return r;
  const u = 4;
  return { ...r, units: u, profit: rescale(r, u) };
});
cfBook('if A/B arriving ×1.25 (all 24)', augLog, (r) => {
  if (!(r.sharpAB && r.steamArriving)) return r;
  const u = +(r.units * 1.25).toFixed(2);
  return { ...r, units: u, profit: rescale(r, u) };
});
cfBook('if A/B steam-at-lock ×1.25 (the 45)', augLog, (r) => {
  if (!(r.sharpAB && r.steamOn)) return r;
  const u = +(r.units * 1.25).toFixed(2);
  return { ...r, units: u, profit: rescale(r, u) };
});

push('');
push('-- 0u mutes that WOULD have been these cells (don’t-cut evidence) --');
const mutedLog = muted.filter((r) => r.date >= STEAM_LIVE && r.hasLog);
push(`muted 0u graded with tape log since 08-19: ${mutedLog.length}`);
for (const cell of top3) {
  const hit = mutedLog.filter(cell.pred);
  const a = agg(hit.map((r) => {
    const u = 1;
    const odds = r.odds || 0;
    const profit = r.won === 1
      ? (odds < 0 ? u * (100 / Math.abs(odds)) : u * (odds / 100))
      : -u;
    return { ...r, units: u, profit };
  }));
  const by = {};
  for (const r of hit) {
    const k = r.mutedBy || r.tapeAction || 'unknown';
    by[k] = (by[k] || 0) + 1;
  }
  push(`${cell.name} muted  ${hit.length}  cf-1u ${fmt(a)}  mutedBy=${JSON.stringify(by)}`);
}

push('');
push('-- Card already paints steam-ON, not arriving. Overlap --');
push(line('A/B arriving AND steamOn (card Steam With Entry analog)', abArr.filter((r) => r.steamOn)));
push(line('A/B steam-at-lock minus arriving (already-on)', augLog.filter((r) => r.sharpAB && r.steamOn && !r.steamArriving)));
push(line('A/B arriving that is gold', abArr.filter((r) => r.gold)));
push('Steam With Entry on the Locked card fires when steam is ON at lock (3%+). That covers A/B + steam at lock.');
push('Arriving (off→on) is a lifecycle flag the card does not currently name. Gold Steam is n=2.');

push('');
push('=== 10. Only-ship gates on the STEAM WINDOW (same units, rest 0u) ===');
push('Universe = Aug 19–31 tape-log staked book. Sizer unchanged. Gate = ship iff pred, else 0u.');
push('');

const window = augLog;
const baseW = agg(window);
push(`KEEP-ALL (today)                              ${fmt(baseW)}`);

const fadeMute = (r) => Number.isFinite(r.dEv) && r.dEv <= -1.5 && Number(r.ev) < -1;
const liveMute = (r) => Number(r.edge) >= 15 && fadeMute(r);

const gates = [
  { name: 'A/B + arriving', pred: (r) => r.sharpAB && r.steamArriving },
  { name: 'steam arriving (drop A/B)', pred: (r) => r.steamArriving },
  { name: 'A/B + steam at lock', pred: (r) => r.sharpAB && r.steamOn },
  { name: 'any steam at lock', pred: (r) => r.steamOn },
  { name: 'A/B + arriving, skip live Ev-drift', pred: (r) => r.sharpAB && r.steamArriving && !liveMute(r) },
  { name: 'A/B + arriving, skip fade+EV<−1', pred: (r) => r.sharpAB && r.steamArriving && !fadeMute(r) },
  { name: 'A/B + steam lock, skip fade+EV<−1', pred: (r) => r.sharpAB && r.steamOn && !fadeMute(r) },
  { name: 'A/B + arriving OR gold', pred: (r) => (r.sharpAB && r.steamArriving) || r.gold },
  { name: 'gold 4.5%+', pred: (r) => r.gold },
  { name: 'A/B only (no steam required)', pred: (r) => r.sharpAB },
];

function daysCovered(hit) {
  const ds = new Set(hit.map((r) => r.date));
  const all = [...new Set(window.map((r) => r.date))].sort();
  const empty = all.filter((d) => !ds.has(d));
  return { nDays: ds.size, nAll: all.length, empty };
}

function gateScore(h, cut) {
  if (!h.n) return 'none';
  if (h.n < 12) return 'thin — not a book';
  const lo = h.wrLo;
  if (h.n >= 20 && lo >= 50 && h.roi >= 15 && h.pnl >= 20) return 'viable gate';
  if (h.n >= 15 && h.wrPct >= 65 && h.roi >= 30) return 'tight / high-quality';
  if (h.wrPct > baseW.wrPct && h.roi > baseW.roi) return 'better than book, watch n';
  return 'not better';
}

const gateRows = [];
push('');
push('SHIP = tickets that pass. CUT = rest of steam window zeroed. Wins cut = real wins users would not see.');
for (const g of gates) {
  const ship = window.filter(g.pred);
  const cut = window.filter((r) => !g.pred(r));
  const h = agg(ship);
  const c = agg(cut);
  const days = daysCovered(ship);
  const score = gateScore(h, c);
  const earlyHit = agg(early.filter(g.pred));
  const lateHit = agg(late.filter(g.pred));
  push(`${g.name}`);
  push(`  SHIP ${fmt(h)} | ${score}`);
  push(`  CUT  ${fmt(c)} | wins cut ${c.w}  losses cut ${c.l}`);
  push(`  days ${days.nDays}/${days.nAll} with ≥1 lock${days.empty.length ? `  empty ${days.empty.join(',')}` : ''}`);
  push(`  early ${fmt(earlyHit)}  late ${fmt(lateHit)}`);
  gateRows.push({ name: g.name, ship: h, cut: c, score, days, early: earlyHit, late: lateHit });
}

push('');
push('-- Incremental build (this is the optimality cut) --');
const core = window.filter((r) => r.sharpAB && r.steamArriving);
const already = window.filter((r) => r.sharpAB && r.steamOn && !r.steamArriving);
const steamNoAB = window.filter((r) => r.steamOn && !r.sharpAB);
const arrivingNoAB = window.filter((r) => r.steamArriving && !r.sharpAB);
push(line('1. CORE  A/B + arriving', core));
push(line('2. add A/B already-on steam', already));
push(line('   CORE + already-on  (= A/B steam at lock)', window.filter((r) => r.sharpAB && r.steamOn)));
push(line('3. add steam, no A/B', steamNoAB));
push(line('   arriving with no A/B (inside 3)', arrivingNoAB));
push(line('4. add gold not already in core', window.filter((r) => r.gold && !(r.sharpAB && r.steamArriving))));

push('');
push('Read: step 2 adds volume and almost no PnL. Step 3 adds losers. Core is the gate. Expanding to steam-at-lock is a slate choice, not an edge choice.');

const emptyCore = daysCovered(core).empty;
push(`Core empty days: ${emptyCore.length ? emptyCore.join(', ') : 'none'}`);
push('Core tickets/day:');
const byD = new Map();
for (const r of core) {
  if (!byD.has(r.date)) byD.set(r.date, []);
  byD.get(r.date).push(r);
}
for (const d of [...new Set(window.map((r) => r.date))].sort()) {
  const day = byD.get(d) || [];
  push(`  ${d}  ${day.length ? fmt(agg(day)) : '—  (no lock)'}`);
}

push('');
push('=== 11. Size overlays on the steam-window book (same tickets, different u) ===');
push('Not a gate. Every ticket still ships. Steam only changes size. Early vs late, no retune.');
push('');

function sized(r, newU) {
  const old = Number(r.units) || 0;
  const u = Math.max(0, Number(newU) || 0);
  if (!(old > 0)) return { ...r, units: u, profit: 0 };
  return { ...r, units: u, profit: (Number(r.profit) || 0) * (u / old) };
}

function applySize(label, pool, mapper) {
  const outRows = pool.map(mapper);
  const a = agg(outRows);
  const b = agg(pool);
  const dPnl = a.pnl - b.pnl;
  const dU = a.stake - b.stake;
  push(`${label}`);
  push(`  ${fmt(a)}  ΔPnL ${dPnl >= 0 ? '+' : ''}${dPnl.toFixed(1)}u  Δstake ${dU >= 0 ? '+' : ''}${dU.toFixed(1)}u`);
  return { label, agg: a, dPnl, dU };
}

function splitEL(name, mapper) {
  const e = agg(early.map(mapper));
  const l = agg(late.map(mapper));
  const eb = agg(early);
  const lb = agg(late);
  const eOk = e.pnl > eb.pnl;
  const lOk = l.pnl > lb.pnl;
  const hold = eOk && lOk ? 'HOLDS both halves' : eOk && !lOk ? 'early only' : !eOk && lOk ? 'late only' : 'neither';
  push(`  early Δ ${(e.pnl - eb.pnl) >= 0 ? '+' : ''}${(e.pnl - eb.pnl).toFixed(1)}u  late Δ ${(l.pnl - lb.pnl) >= 0 ? '+' : ''}${(l.pnl - lb.pnl).toFixed(1)}u  ${hold}`);
  return hold;
}

push(line('actual steam-window book', window));
push('A/B arriving tapeAction / preTape:');
for (const r of core.sort((a, b) => String(a.date).localeCompare(b.date))) {
  push(`  ${r.date} ${r.team}  ${r.won ? 'W' : 'L'}  ${r.units}u  tape=${r.tapeAction || '—'}  preTape=${r.unitsPreTape ?? '—'}  path${r.path}`);
}

push('');
push('-- Size UP A/B arriving (rest of book unchanged) --');
const upFloor2 = (r) => (r.sharpAB && r.steamArriving && r.units < 2) ? sized(r, 2) : r;
const upFloor3 = (r) => (r.sharpAB && r.steamArriving && r.units < 3) ? sized(r, 3) : r;
const upFloor4 = (r) => (r.sharpAB && r.steamArriving && r.units < 4) ? sized(r, 4) : r;
const up125 = (r) => (r.sharpAB && r.steamArriving) ? sized(r, +(r.units * 1.25).toFixed(2)) : r;
const upPlus1 = (r) => (r.sharpAB && r.steamArriving && r.units < 4) ? sized(r, r.units + 1) : r;
applySize('floor arriving <2u → 2u', window, upFloor2);
splitEL('floor2', upFloor2);
applySize('floor arriving <3u → 3u', window, upFloor3);
splitEL('floor3', upFloor3);
applySize('floor arriving <4u → 4u (the aggressive one)', window, upFloor4);
splitEL('floor4', upFloor4);
applySize('arriving ×1.25 (tape-like bump)', window, up125);
splitEL('x125', up125);
applySize('arriving lean +1u', window, upPlus1);
splitEL('plus1', upPlus1);

push('');
push('-- Size DOWN fat tickets that do NOT have steam confirmation --');
const TAPE_BOOST_MULT = 1.35;
function unboost(r) {
  if (r.tapeAction !== 'BOOST') return r;
  const pre = Number.isFinite(r.unitsPreTape) && r.unitsPreTape > 0
    ? r.unitsPreTape
    : r.units / TAPE_BOOST_MULT;
  return sized(r, +pre.toFixed(2));
}
const noArr = (r) => !(r.sharpAB && r.steamArriving);
const noSteamAB = (r) => !(r.sharpAB && r.steamOn);
applySize('unboost tape BOOST unless A/B arriving', window, (r) => (r.tapeAction === 'BOOST' && noArr(r) ? unboost(r) : r));
splitEL('unboost unless arriving', (r) => (r.tapeAction === 'BOOST' && noArr(r) ? unboost(r) : r));
applySize('unboost tape BOOST unless A/B steam at lock', window, (r) => (r.tapeAction === 'BOOST' && noSteamAB(r) ? unboost(r) : r));
splitEL('unboost unless steamAB', (r) => (r.tapeAction === 'BOOST' && noSteamAB(r) ? unboost(r) : r));
applySize('cap 5.4u+ at 4u unless A/B arriving', window, (r) => (r.units >= 5.4 && noArr(r) ? sized(r, 4) : r));
splitEL('cap54 unless arriving', (r) => (r.units >= 5.4 && noArr(r) ? sized(r, 4) : r));
applySize('cap 5.4u+ at 4u unless A/B steam at lock', window, (r) => (r.units >= 5.4 && noSteamAB(r) ? sized(r, 4) : r));
splitEL('cap54 unless steamAB', (r) => (r.units >= 5.4 && noSteamAB(r) ? sized(r, 4) : r));

push('');
push('-- Combo: bump lean arriving AND haircut BOOST without A/B steam-at-lock --');
const combo = (r) => {
  let x = r;
  if (x.sharpAB && x.steamArriving && x.units < 2) x = sized(x, 2);
  if (x.tapeAction === 'BOOST' && !(x.sharpAB && x.steamOn)) x = unboost(x);
  return x;
};
applySize('floor arriving 2u + unboost BOOST without A/B steam', window, combo);
splitEL('combo', combo);

push('');
push('-- What the 5.4u+ pile actually did --');
push(line('all 5.4u+', window.filter((r) => r.units >= 5.4)));
push(line('5.4u+ A/B arriving', window.filter((r) => r.units >= 5.4 && r.sharpAB && r.steamArriving)));
push(line('5.4u+ A/B steam at lock', window.filter((r) => r.units >= 5.4 && r.sharpAB && r.steamOn)));
push(line('5.4u+ no A/B steam', window.filter((r) => r.units >= 5.4 && !(r.sharpAB && r.steamOn))));
push(line('tape BOOST', window.filter((r) => r.tapeAction === 'BOOST')));
push(line('tape BOOST + A/B arriving', window.filter((r) => r.tapeAction === 'BOOST' && r.sharpAB && r.steamArriving)));
push(line('tape BOOST, no A/B steam', window.filter((r) => r.tapeAction === 'BOOST' && !(r.sharpAB && r.steamOn))));
push(line('≤1u A/B arriving (the bump candidates)', window.filter((r) => r.sharpAB && r.steamArriving && r.units < 1.25)));
push(line('≤1u rest of book', window.filter((r) => !(r.sharpAB && r.steamArriving) && r.units < 1.25)));

push('');
push('=== 12. Practical recipes on the ACTUAL August staked book ===');
push('Goal: max PnL + elite WR, 5–6 locks/day, cut 1u junk, steam confirms/mutes fat tickets.');
push('Steam stamps only exist 08-19+. Pre-steam days fail-open on steam rules (keep 2u+).');
push('');

function zero(r) {
  return { ...r, units: 0, profit: 0, won: null };
}
function gateKeep(pool, pred) {
  return pool.map((r) => (pred(r) ? r : zero(r)));
}
function isLean(r) { return r.units < 1.25; }
function isFat(r) { return r.units >= 5.4; }
function isArr(r) { return !!(r.sharpAB && r.steamArriving); }
function isSteamAB(r) { return !!(r.sharpAB && r.steamOn); }
function hasSteam(r) { return !!r.hasLog; }

push(line('August staked (today)', augAll));
push('August by unit band:');
for (const band of UNIT_BANDS) {
  push(line(band, augAll.filter((r) => unitBand(r.units) === band)));
}
push('');
push(line('August ≤1u', augAll.filter(isLean)));
push(line('August ≤1u except arriving', augAll.filter((r) => isLean(r) && !isArr(r))));
push(line('August 2–4.99u (spine)', augAll.filter((r) => r.units >= 1.25 && r.units < 5.4)));
push(line('August 5.4u+', augAll.filter(isFat)));
push(line('Aug 1–18 ≤1u (no steam)', augPre.filter(isLean)));
push(line('Aug 19–31 ≤1u', augSteam.filter(isLean)));
push(line('Aug 19–31 5.4u+ no A/B steam', augSteam.filter((r) => isFat(r) && !isSteamAB(r))));

const recipes = [
  {
    name: 'A. Cut all ≤1u',
    pred: (r) => !isLean(r),
  },
  {
    name: 'B. Cut ≤1u except A/B arriving',
    pred: (r) => !isLean(r) || isArr(r),
  },
  {
    name: 'C. B + MUTE 5.4u+ unless A/B steam (fail-open pre-steam)',
    pred: (r) => {
      if (isLean(r) && !isArr(r)) return false;
      if (isFat(r) && hasSteam(r) && !isSteamAB(r)) return false;
      return true;
    },
  },
  {
    name: 'D. Cut ALL ≤1u (even arriving) + MUTE 5.4u+ unless A/B steam',
    pred: (r) => {
      if (isLean(r)) return false;
      if (isFat(r) && hasSteam(r) && !isSteamAB(r)) return false;
      return true;
    },
  },
  {
    name: 'E. B + MUTE 5.4u+ unless A/B arriving (stricter fat)',
    pred: (r) => {
      if (isLean(r) && !isArr(r)) return false;
      if (isFat(r) && hasSteam(r) && !isArr(r)) return false;
      return true;
    },
  },
  {
    name: 'F. B + MUTE tape BOOST unless A/B steam (fail-open pre-steam)',
    pred: (r) => {
      if (isLean(r) && !isArr(r)) return false;
      if (r.tapeAction === 'BOOST' && hasSteam(r) && !isSteamAB(r)) return false;
      return true;
    },
  },
  {
    name: 'G. Spine only: arriving OR 2–4.99u (cut 1u and all 5.4u+)',
    pred: (r) => isArr(r) || (r.units >= 1.25 && r.units < 5.4),
  },
  {
    name: 'H. Cut ≤1u except arriving + MUTE 4u+ unless A/B steam (fail-open pre-steam)',
    pred: (r) => {
      if (isLean(r) && !isArr(r)) return false;
      if (r.units >= 4 && hasSteam(r) && !isSteamAB(r)) return false;
      return true;
    },
  },
  {
    name: 'I. Cut ALL ≤1u + MUTE 4u+ unless A/B steam',
    pred: (r) => {
      if (isLean(r)) return false;
      if (r.units >= 4 && hasSteam(r) && !isSteamAB(r)) return false;
      return true;
    },
  },
  {
    name: 'J. Cut ≤1u except arriving + MUTE 4u+ unless A/B arriving',
    pred: (r) => {
      if (isLean(r) && !isArr(r)) return false;
      if (r.units >= 4 && hasSteam(r) && !isArr(r)) return false;
      return true;
    },
  },
];

function dayStats(shipped) {
  const live = shipped.filter((r) => r.won != null && r.units > 0);
  const by = new Map();
  for (const r of live) {
    if (!by.has(r.date)) by.set(r.date, []);
    by.get(r.date).push(r);
  }
  const dates = [...new Set(augAll.map((r) => r.date))].sort();
  const counts = dates.map((d) => (by.get(d) || []).length);
  const nonzero = counts.filter((n) => n > 0);
  const avgAll = counts.length ? counts.reduce((a, b) => a + b, 0) / counts.length : 0;
  const avgLive = nonzero.length ? nonzero.reduce((a, b) => a + b, 0) / nonzero.length : 0;
  const inBand = nonzero.filter((n) => n >= 5 && n <= 6).length;
  const steamDates = dates.filter((d) => d >= STEAM_LIVE);
  const steamCounts = steamDates.map((d) => (by.get(d) || []).length);
  const steamAvg = steamDates.length ? steamCounts.reduce((a, b) => a + b, 0) / steamDates.length : 0;
  return { dates, counts, avgAll, avgLive, inBand, nLiveDays: nonzero.length, steamAvg, by };
}

push('');
push('KEEP-ALL August                                 ' + fmt(agg(augAll)));
for (const rec of recipes) {
  const shipped = gateKeep(augAll, rec.pred);
  const a = agg(shipped);
  const d = dayStats(shipped);
  const wrLift = (a.wrPct != null && agg(augAll).wrPct != null) ? (a.wrPct - agg(augAll).wrPct) : 0;
  const dPnl = a.pnl - agg(augAll).pnl;
  push(`${rec.name}`);
  push(`  SHIP ${fmt(a)}  ΔPnL ${dPnl >= 0 ? '+' : ''}${dPnl.toFixed(1)}u  WR ${wrLift >= 0 ? '+' : ''}${wrLift.toFixed(1)}pp`);
  push(`  daily  Aug avg ${d.avgAll.toFixed(1)}  (days-with-lock ${d.avgLive.toFixed(1)})  steam-window avg ${d.steamAvg.toFixed(1)}  · ${d.nLiveDays} days with a lock  · ${d.inBand} days in 5–6 band`);
}

push('');
push('-- Recipe C day-by-day (cut junk 1u, keep arriving 1u, mute fat unless A/B steam) --');
{
  const rec = recipes.find((x) => x.name.startsWith('C.'));
  const shipped = gateKeep(augAll, rec.pred);
  const d = dayStats(shipped);
  for (const date of d.dates) {
    const dayAll = augAll.filter((r) => r.date === date);
    const dayShip = (d.by.get(date) || []);
    const mark = date >= STEAM_LIVE ? 'steam' : 'pre  ';
    push(`${date} ${mark}  actual ${String(dayAll.length).padStart(2)} / ${agg(dayAll).stake.toFixed(1)}u   gated ${String(dayShip.length).padStart(2)} / ${agg(dayShip).stake.toFixed(1)}u  ${dayShip.length ? fmt(agg(dayShip)) : '—'}`);
  }
}

push('');
push('-- Recipe C vs D vs A on steam-window only (where steam can actually fire) --');
for (const rec of recipes.filter((x) => /^(A|B|C|D|F|H|I|J)\./.test(x.name))) {
  const shipped = gateKeep(augLog, rec.pred);
  push(`${rec.name.padEnd(72)} ${fmt(agg(shipped))}`);
}

push('');
push('=== 13. Steam on the 2u–5.39u spine (the band we would leave alone) ===');
push('Mid = 1.25u ≤ units < 5.4u. Steam can only fire 08-19+. Aug 1–18 mid has no steam tag.');
push('');

function isMid(r) { return r.units >= 1.25 && r.units < 5.4; }
const augMid = augAll.filter(isMid);
const preMid = augPre.filter(isMid);
const steamMid = augLog.filter(isMid);

push(line('August mid 2u–5.39u', augMid));
push(line('Aug 1–18 mid (no steam)', preMid));
push(line('Aug 19–31 mid (tape-log)', steamMid));
push('');
push('Steam-window mid × steam:');
push(line('mid A/B arriving', steamMid.filter(isArr)));
push(line('mid A/B steam at lock', steamMid.filter(isSteamAB)));
push(line('mid steam on, no A/B', steamMid.filter((r) => r.steamOn && !r.sharpAB)));
push(line('mid A/B, no steam', steamMid.filter((r) => r.sharpAB && !r.steamOn)));
push(line('mid no steam at lock', steamMid.filter((r) => !r.steamOn)));
push('');
push('Same split by sub-band (steam-window only):');
for (const band of ['2–3u', '4u', '5u']) {
  const inBand = steamMid.filter((r) => unitBand(r.units) === band);
  push(line(`${band} all`, inBand));
  push(line(`${band} A/B arriving`, inBand.filter(isArr)));
  push(line(`${band} A/B steam at lock`, inBand.filter(isSteamAB)));
  push(line(`${band} no steam at lock`, inBand.filter((r) => !r.steamOn)));
}

push('');
push('-- If we DID require steam on mid (would we want that?) --');
const midKeepArr = steamMid.filter(isArr);
const midKeepSteamAB = steamMid.filter(isSteamAB);
const midRestNoSteamAB = steamMid.filter((r) => !isSteamAB(r));
push(line('KEEP mid only if A/B arriving', midKeepArr));
push(line('CUT  (mid without arriving)', steamMid.filter((r) => !isArr(r))));
push(line('KEEP mid only if A/B steam at lock', midKeepSteamAB));
push(line('CUT  (mid without A/B steam)', midRestNoSteamAB));

push('');
push('Recipe C as shipped, then ALSO mute mid without A/B steam (steam-window only):');
{
  const recC = recipes.find((x) => x.name.startsWith('C.'));
  const cOnly = gateKeep(augAll, recC.pred);
  const cPlus = gateKeep(augAll, (r) => {
    if (!recC.pred(r)) return false;
    if (isMid(r) && hasSteam(r) && !isSteamAB(r)) return false;
    return true;
  });
  const cPlusArr = gateKeep(augAll, (r) => {
    if (!recC.pred(r)) return false;
    if (isMid(r) && hasSteam(r) && !isArr(r)) return false;
    return true;
  });
  push(`C (mid untouched)     ${fmt(agg(cOnly))}  daily steam ${dayStats(cOnly).steamAvg.toFixed(1)}`);
  push(`C + mute mid w/o A/B steam  ${fmt(agg(cPlus))}  daily steam ${dayStats(cPlus).steamAvg.toFixed(1)}`);
  push(`C + mute mid w/o arriving   ${fmt(agg(cPlusArr))}  daily steam ${dayStats(cPlusArr).steamAvg.toFixed(1)}`);
}

push('');
push('=== 14. Policy: 1u + 4u+ steam, leave 2–3u alone ===');
push('4u+ = units ≥ 4 (4u, 5u, 5.4u, 6u). 2–3u untouched. Fail-open pre-steam on 4u+.');
push('');

function is4up(r) { return r.units >= 4; }
function is23(r) { return r.units >= 1.25 && r.units < 4; }
const aug4 = augAll.filter(is4up);
const steam4 = augLog.filter(is4up);
const pre4 = augPre.filter(is4up);
const steam23 = augLog.filter(is23);

push(line('August 4u+', aug4));
push(line('Aug 1–18 4u+ (fail-open)', pre4));
push(line('Aug 19–31 4u+', steam4));
push(line('August 2–3u (leave alone)', augAll.filter(is23)));
push(line('Aug 19–31 2–3u', steam23));
push('');
push('Steam-window 4u+ × steam:');
push(line('4u+ A/B arriving', steam4.filter(isArr)));
push(line('4u+ A/B steam at lock', steam4.filter(isSteamAB)));
push(line('4u+ no A/B steam  (would mute)', steam4.filter((r) => !isSteamAB(r))));
push(line('  of which 4.00–5.39u no A/B steam', steam4.filter((r) => !isSteamAB(r) && r.units < 5.4)));
push(line('  of which 5.4u+ no A/B steam (already in C)', steam4.filter((r) => !isSteamAB(r) && r.units >= 5.4)));
push('');
push('4.00–5.39u steam-window (the EXTRA mute vs recipe C):');
const extra = steam4.filter((r) => r.units < 5.4);
push(line('4.00–5.39u all', extra));
push(line('4.00–5.39u A/B steam', extra.filter(isSteamAB)));
push(line('4.00–5.39u no A/B steam', extra.filter((r) => !isSteamAB(r))));

push('');
push('-- Recipe H day-by-day --');
{
  const rec = recipes.find((x) => x.name.startsWith('H.'));
  const shipped = gateKeep(augAll, rec.pred);
  const d = dayStats(shipped);
  push(`H SHIP ${fmt(agg(shipped))}  Aug avg ${d.avgAll.toFixed(1)}  steam avg ${d.steamAvg.toFixed(1)}`);
  for (const date of d.dates) {
    const dayAll = augAll.filter((r) => r.date === date);
    const dayShip = d.by.get(date) || [];
    const mark = date >= STEAM_LIVE ? 'steam' : 'pre  ';
    push(`${date} ${mark}  actual ${String(dayAll.length).padStart(2)} / ${agg(dayAll).stake.toFixed(1)}u   gated ${String(dayShip.length).padStart(2)} / ${agg(dayShip).stake.toFixed(1)}u  ${dayShip.length ? fmt(agg(dayShip)) : '—'}`);
  }
}

mkdirSync('/opt/cursor/artifacts', { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  nRows: rows.length,
  nWithLog: withLog.length,
  nJuly: jul.length,
  nMutedLog: muted.filter((r) => r.hasLog).length,
  steamLiveFrom: STEAM_LIVE,
  cells: {
    withLog: agg(withLog),
    sinceSteam: agg(since),
    earlySteam: agg(early),
    lateSteam: agg(late),
    goldConfirmed: agg(withLog.filter((r) => r.goldConfirmed)),
    gold: agg(withLog.filter((r) => r.gold)),
    steamArriving: agg(withLog.filter((r) => r.steamArriving)),
    ev02: agg(withLog.filter((r) => r.evBucket === '0-2')),
    goldAndAB: agg(withLog.filter((r) => r.gold && r.sharpAB)),
    goldNoAB: agg(withLog.filter((r) => r.gold && !r.sharpAB)),
    goldConfirmedAndAB: agg(withLog.filter((r) => r.goldConfirmed && r.sharpAB)),
    steamArrivingAndAB: agg(withLog.filter((r) => r.steamArriving && r.sharpAB)),
    ev02AndAB: agg(withLog.filter((r) => r.evBucket === '0-2' && r.sharpAB)),
    ev02NoAB: agg(withLog.filter((r) => r.evBucket === '0-2' && !r.sharpAB)),
  },
  holdRows,
  goldABSample: goldAB.map((r) => ({
    date: r.date, sport: r.sport, mkt: r.mkt, team: r.team,
    won: r.won, units: r.units, goldLabel: r.goldLabel, path: r.path,
    forA: r.forA, forB: r.forB, ev: r.ev,
  })),
  abArrivingSample: abArrAll.map((r) => ({
    date: r.date, sport: r.sport, mkt: r.mkt, team: r.team,
    won: r.won, units: r.units, ev: r.ev, dEv: r.dEv, lastHourLock: r.lastHourLock,
  })),
};
writeFileSync('/opt/cursor/artifacts/gold_steam_ab_analysis.json', JSON.stringify(payload, null, 2));
writeFileSync('/opt/cursor/artifacts/gold_steam_ab_analysis.log', `${out.join('\n')}\n`);
console.log('\nWrote /opt/cursor/artifacts/gold_steam_ab_analysis.{json,log}');
