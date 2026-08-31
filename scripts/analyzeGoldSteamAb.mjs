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
      if (!(units > 0) || res.tracked === true) continue;
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
      const steamArriving = !tape.ticketTape?.steamOnFirst && !!tape.ticketTape?.steamOnLock;
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
        steamArriving,
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
      });
    }
  }
}

const withLog = rows.filter((r) => r.hasLog);
const goldish = (r) => r.gold || r.goldConfirmed;
const out = [];
const push = (s = '') => { out.push(s); console.log(s); };

push(`Gold steam × Source A/B  ·  ${new Date().toISOString()}`);
push(`Graded staked AGSU sides: ${rows.length}  ·  with tape log: ${withLog.length}`);
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
push('=== Sample ALL gold tickets ===');
for (const r of withLog.filter((r) => r.gold)) {
  push(`  ${r.date} ${r.sport} ${r.mkt} ${r.team}  ${r.won ? 'W' : 'L'}  ${r.units}u  ${r.goldLabel}  path${r.path}  A${r.forA}/B${r.forB}  ev=${r.ev ?? '—'}`);
}

mkdirSync('/opt/cursor/artifacts', { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  nRows: rows.length,
  nWithLog: withLog.length,
  cells: {
    withLog: agg(withLog),
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
  goldABSample: goldAB.map((r) => ({
    date: r.date, sport: r.sport, mkt: r.mkt, team: r.team,
    won: r.won, units: r.units, goldLabel: r.goldLabel, path: r.path,
    forA: r.forA, forB: r.forB, ev: r.ev,
  })),
};
writeFileSync('/opt/cursor/artifacts/gold_steam_ab_analysis.json', JSON.stringify(payload, null, 2));
writeFileSync('/opt/cursor/artifacts/gold_steam_ab_analysis.log', `${out.join('\n')}\n`);
console.log('\nWrote /opt/cursor/artifacts/gold_steam_ab_analysis.{json,log}');
