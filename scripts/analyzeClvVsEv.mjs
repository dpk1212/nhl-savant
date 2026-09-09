/**
 * CLV vs entry-EV vs actual win rate — live SharpFlow book.
 *
 * Thesis to test (Dale): EV shops chase +3–5% EV at volume. We can
 * lock −1 to −3% CLV (worse than Pin close) and still win more / outperform.
 *
 *   node scripts/analyzeClvVsEv.mjs
 *
 * Reads public Firestore (sharpFlowPicks / Spreads / Totals).
 * Writes /opt/cursor/artifacts/clv_vs_ev.json + stdout report.
 */
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const V12_FROM = '2026-06-01';
const STEAM_FROM = '2026-08-19';
const T_FROM = '2026-08-31';

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

function impliedProb(odds) {
  const o = Number(odds);
  if (!Number.isFinite(o) || o === 0) return null;
  if (o < 0) return Math.abs(o) / (Math.abs(o) + 100);
  return 100 / (o + 100);
}

/** CLV as percentage points of implied probability (close − lock). + = beat close. */
function clvPctFrom(res, lockOdds, closingOdds) {
  const raw = Number(res?.clv);
  if (Number.isFinite(raw)) return Math.abs(raw) <= 1 ? raw * 100 : raw;
  const lockP = impliedProb(lockOdds);
  const closeP = impliedProb(closingOdds);
  if (lockP == null || closeP == null) return null;
  return (closeP - lockP) * 100;
}

function cleanTapeEv(row) {
  if (!row || typeof row !== 'object') return null;
  if (Number(row.fair) === 0 || Number(row.fairOdds) === 0) return null;
  const ev = Number(row.evPct);
  return Number.isFinite(ev) ? ev : null;
}

function tapeEv(sd) {
  const log = Array.isArray(sd?.v8_ticketTapeLog)
    ? sd.v8_ticketTapeLog
    : (Array.isArray(sd?.ticketTapeLog) ? sd.ticketTapeLog : []);
  const first = log.find((e) => e && e.gate === 'first') || log[0] || null;
  const t15 = log.find((e) => e && e.gate === 't15');
  const last = log.length ? log[log.length - 1] : null;
  const lock = t15 || last;
  const stamped = Number.isFinite(Number(sd?.v8_ticketEvPct))
    ? Number(sd.v8_ticketEvPct)
    : (Number.isFinite(Number(sd?.ticketEvPct)) ? Number(sd.ticketEvPct) : null);
  const firstStamped = Number.isFinite(Number(sd?.v8_ticketEvFirst))
    ? Number(sd.v8_ticketEvFirst)
    : null;
  return {
    n: log.length,
    evFirst: cleanTapeEv(first) ?? firstStamped,
    evLock: cleanTapeEv(lock) ?? stamped,
    evStamped: stamped,
  };
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

function mean(arr) {
  const xs = arr.filter((x) => Number.isFinite(x));
  if (!xs.length) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function median(arr) {
  const xs = arr.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!xs.length) return null;
  const m = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[m] : (xs[m - 1] + xs[m]) / 2;
}

function sourceFlags(rec) {
  if (!rec) return { a: false, b: false, confirmed: false };
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
  };
}

let profiles = {};
try {
  const profilesJson = JSON.parse(readFileSync(join(ROOT, 'data/wallet-profiles.json'), 'utf8'));
  profiles = profilesJson.profiles || profilesJson;
} catch {
  profiles = {};
}
function profileOf(short, sport) {
  const p = profiles[short] || profiles[String(short || '').toLowerCase()];
  if (!p) return null;
  return p.bySport?.[sport] || null;
}

function countAB(sd, sideKey, sport) {
  const lock = sd.lock || {};
  const peak = sd.peak || lock;
  const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
    .filter((w) => w && w.wallet && w.side);
  const seen = new Set();
  let forA = 0, forB = 0, forConf = 0, forAny = 0;
  for (const w of wd) {
    if (w.side !== sideKey) continue;
    const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
    if (!short || seen.has(short)) continue;
    seen.add(short);
    forAny++;
    const flags = sourceFlags(profileOf(short, sport));
    if (flags.confirmed) forConf++;
    if (flags.a) forA++;
    if (flags.b) forB++;
  }
  return { forA, forB, forConf, forAny, sharpAB: forA + forB > 0 };
}

function flatProfit(won, odds) {
  if (won === 1) return odds < 0 ? 100 / Math.abs(odds) : odds / 100;
  if (won === 0) return -1;
  return 0;
}

function juiceBand(odds) {
  const o = Number(odds);
  if (!Number.isFinite(o) || o === 0) return 'missing';
  if (o > 0) return 'plus';
  if (o >= -120) return '−100 to −120';
  if (o >= -150) return '−121 to −150';
  if (o >= -200) return '−151 to −200';
  return '< −200';
}

function agg(rows) {
  let n = 0, w = 0, l = 0, stake = 0, pnl = 0, flat = 0;
  const clvs = [];
  const evs = [];
  const lockEvs = [];
  const implieds = [];
  let nNegClv = 0, nNegEv = 0, nAb = 0, nEvStamp = 0;
  for (const r of rows) {
    if (r.won == null) continue;
    n++;
    stake += r.units || 0;
    pnl += Number.isFinite(r.profit) ? r.profit : 0;
    flat += Number.isFinite(r.flatPnl) ? r.flatPnl : 0;
    if (r.won === 1) w++;
    else if (r.won === 0) l++;
    if (Number.isFinite(r.clvPct)) clvs.push(r.clvPct);
    if (Number.isFinite(r.evFirst)) evs.push(r.evFirst);
    if (Number.isFinite(r.evLock)) lockEvs.push(r.evLock);
    const ip = impliedProb(r.odds);
    if (ip != null) implieds.push(ip * 100);
    if (Number.isFinite(r.clvPct) && r.clvPct < 0) nNegClv++;
    const e = r.evFirst ?? r.evStamped;
    if (Number.isFinite(e)) {
      nEvStamp++;
      if (e < 0) nNegEv++;
    }
    if (r.sharpAB) nAb++;
  }
  const wr = n ? w / n : null;
  const ci = wilson(w, n);
  const meanImp = implieds.length ? mean(implieds) : null;
  const excess = (wr != null && meanImp != null) ? (wr * 100 - meanImp) : null;
  return {
    n, w, l, stake, pnl,
    wr,
    wrPct: wr != null ? +(wr * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    wrHi: ci ? +(ci.hi * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
    pnlR: +pnl.toFixed(2),
    meanClv: clvs.length ? +mean(clvs).toFixed(2) : null,
    medClv: clvs.length ? +median(clvs).toFixed(2) : null,
    nClv: clvs.length,
    meanEvFirst: evs.length ? +mean(evs).toFixed(2) : null,
    meanEvLock: lockEvs.length ? +mean(lockEvs).toFixed(2) : null,
    nEv: evs.length,
    meanImplied: meanImp != null ? +meanImp.toFixed(1) : null,
    excessWr: excess != null ? +excess.toFixed(1) : null,
    flatRoi: n > 0 ? +((flat / n) * 100).toFixed(1) : null,
    flatPnl: +flat.toFixed(2),
    nNegClv,
    nNegEv,
    nAb,
    nEvStamp,
  };
}

function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  const wr = a.wrPct == null ? '—' : `${a.wrPct}%`;
  const band = a.wrLo != null ? ` (${a.wrLo}–${a.wrHi})` : '';
  const clv = a.meanClv == null ? 'CLV —' : `CLV ${a.meanClv >= 0 ? '+' : ''}${a.meanClv}% n=${a.nClv}`;
  const ev = a.meanEvFirst == null ? 'EV —' : `entryEV ${a.meanEvFirst >= 0 ? '+' : ''}${a.meanEvFirst}% n=${a.nEv}`;
  const vs = (a.meanImplied == null)
    ? ''
    : `  · imp ${a.meanImplied}%  excess ${a.excessWr >= 0 ? '+' : ''}${a.excessWr}pp`;
  return `${a.n}  ${a.w}-${a.l}  ${wr}${band}  ${a.stake.toFixed(1)}u  ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u  ${roi}  · ${clv}  · ${ev}${vs}`;
}

function clvBucket(x) {
  if (!Number.isFinite(x)) return 'missing';
  if (x < -3) return '<−3%';
  if (x < -1) return '−3 to −1%';
  if (x < 0) return '−1 to 0%';
  if (x < 1) return '0 to +1%';
  if (x < 3) return '+1 to +3%';
  return '>+3%';
}

function evBucket(x) {
  if (!Number.isFinite(x)) return 'missing';
  if (x < 0) return '<0%';
  if (x < 2) return '0–2%';
  if (x < 3) return '2–3%';
  if (x < 5) return '3–5%';
  return '5%+';
}

function windowOf(date) {
  if (!date) return 'other';
  if (date >= T_FROM) return 'T live';
  if (date >= STEAM_FROM) return 'steam, T off';
  if (date >= V12_FROM) return 'V12 pre-steam';
  return 'pre-V12';
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
      if (res.tracked === true) continue;
      const lock = sd.lock || {};
      const peak = sd.peak || lock;
      const units = sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0;
      if (!(units > 0)) continue;
      const odds = peak.odds || lock.odds || 0;
      const computedProfit = won
        ? (odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100))
        : -units;
      const profit = Number.isFinite(res.profit) ? res.profit : computedProfit;
      const closingOdds = Number.isFinite(Number(sd.closingOdds)) ? Number(sd.closingOdds) : null;
      const lockOdds = Number.isFinite(Number(odds)) ? Number(odds) : null;
      const ev = tapeEv(sd);
      const clvPct = clvPctFrom(res, lockOdds, closingOdds);
      const sport = data.sport || 'NHL';
      const ab = countAB(sd, sideKey, sport);
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
        flatPnl: flatProfit(won, lockOdds),
        odds: lockOdds,
        closingOdds,
        clvPct: clvPct != null ? +clvPct.toFixed(3) : null,
        clvBucket: clvBucket(clvPct),
        evFirst: ev.evFirst,
        evLock: ev.evLock,
        evStamped: ev.evStamped,
        evBucket: evBucket(ev.evFirst ?? ev.evStamped),
        hasTape: ev.n > 0,
        window: windowOf(data.date),
        ...ab,
      });
    }
  }
}

const live = rows.filter((r) => r.date >= V12_FROM);
const withClv = live.filter((r) => Number.isFinite(r.clvPct));
const withEv = live.filter((r) => Number.isFinite(r.evFirst) || Number.isFinite(r.evStamped));
const withBoth = live.filter((r) => Number.isFinite(r.clvPct) && (Number.isFinite(r.evFirst) || Number.isFinite(r.evStamped)));

const out = [];
const push = (s = '') => { out.push(s); console.log(s); };

push(`CLV vs entry-EV vs results  ·  ${new Date().toISOString()}`);
push('Live book = AGS-U promoted, COMPLETED, WIN/LOSS, units>0, tracked≠true, date≥2026-06-01');
push(`Graded live: ${live.length}  ·  with CLV: ${withClv.length}  ·  with entry EV: ${withEv.length}  ·  both: ${withBoth.length}`);
push('');
push('Format: N  W-L  WR (95% Wilson)  stake  PnL  ROI  · mean CLV  · mean entry EV');
push('');
push('=== 0. Book baselines ===');
push(`all V12+                              ${fmt(agg(live))}`);
push(`has CLV                               ${fmt(agg(withClv))}`);
push(`has entry EV                          ${fmt(agg(withEv))}`);
push(`has CLV and EV                        ${fmt(agg(withBoth))}`);
push(`CLV missing                           ${fmt(agg(live.filter((r) => !Number.isFinite(r.clvPct))))}`);
push('');

const CLV_ORDER = ['<−3%', '−3 to −1%', '−1 to 0%', '0 to +1%', '+1 to +3%', '>+3%', 'missing'];
push('=== 1. Results by CLV bucket (closeProb − lockProb, + = beat Pin close) ===');
for (const b of CLV_ORDER) {
  push(`${b.padEnd(16)} ${fmt(agg(live.filter((r) => r.clvBucket === b)))}`);
}
push('');
push('=== 1b. Dale showcase cell vs rest (has-CLV book) ===');
const dale = withClv.filter((r) => r.clvPct >= -3 && r.clvPct < -1);
const beatClose = withClv.filter((r) => r.clvPct > 0);
const beatOrFlat = withClv.filter((r) => r.clvPct >= 0);
const loseClose = withClv.filter((r) => r.clvPct < 0);
const loseClose13 = withClv.filter((r) => r.clvPct >= -3 && r.clvPct < 0);
const flatClose = withClv.filter((r) => r.clvPct === 0);
push(`CLV −3 to −1%                     ${fmt(agg(dale))}`);
push(`any negative CLV                  ${fmt(agg(loseClose))}`);
push(`CLV −3 to 0%                      ${fmt(agg(loseClose13))}`);
push(`beat close (CLV > 0)              ${fmt(agg(beatClose))}`);
push(`CLV ≥ 0 (includes exact 0)        ${fmt(agg(beatOrFlat))}`);
push(`CLV exactly 0                     ${fmt(agg(flatClose))}`);
push(`CLV < −3%                         ${fmt(agg(withClv.filter((r) => r.clvPct < -3)))}`);
push(`CLV > +3%                         ${fmt(agg(withClv.filter((r) => r.clvPct > 3)))}`);
push('');

const EV_ORDER = ['<0%', '0–2%', '2–3%', '3–5%', '5%+', 'missing'];
push('=== 2. Results by entry-EV bucket (flag vs Pin fair) ===');
for (const b of EV_ORDER) {
  const sub = live.filter((r) => r.evBucket === b);
  push(`${b.padEnd(16)} ${fmt(agg(sub))}`);
}
push('');
push('=== 2b. EV-shop analog (3–5% entry EV) vs Dale CLV cell ===');
const ev35 = live.filter((r) => {
  const e = r.evFirst ?? r.evStamped;
  return Number.isFinite(e) && e >= 3 && e < 5;
});
const ev35clv = ev35.filter((r) => Number.isFinite(r.clvPct));
push(`entry EV 3–5%                     ${fmt(agg(ev35))}`);
push(`entry EV 3–5% with CLV            ${fmt(agg(ev35clv))}`);
push(`CLV −3 to −1% (Dale)              ${fmt(agg(dale))}`);
push(`entry EV 3–5% AND CLV −3..−1      ${fmt(agg(ev35.filter((r) => r.clvPct >= -3 && r.clvPct < -1)))}`);
push(`entry EV 3–5% AND +CLV            ${fmt(agg(ev35.filter((r) => r.clvPct >= 0)))}`);
push('');

push('=== 3. Cross: entry EV × CLV sign ===');
function cross(evPred, clvPred, label) {
  push(`${label.padEnd(42)} ${fmt(agg(live.filter((r) => evPred(r) && clvPred(r))))}`);
}
const hasEv = (r) => Number.isFinite(r.evFirst) || Number.isFinite(r.evStamped);
const evVal = (r) => r.evFirst ?? r.evStamped;
cross((r) => hasEv(r) && evVal(r) >= 3, (r) => Number.isFinite(r.clvPct) && r.clvPct < 0, 'EV≥3%  ×  −CLV');
cross((r) => hasEv(r) && evVal(r) >= 3, (r) => Number.isFinite(r.clvPct) && r.clvPct >= 0, 'EV≥3%  ×  +CLV');
cross((r) => hasEv(r) && evVal(r) < 3 && evVal(r) >= 0, (r) => Number.isFinite(r.clvPct) && r.clvPct < 0, 'EV 0–3% ×  −CLV');
cross((r) => hasEv(r) && evVal(r) < 3 && evVal(r) >= 0, (r) => Number.isFinite(r.clvPct) && r.clvPct >= 0, 'EV 0–3% ×  +CLV');
cross((r) => hasEv(r) && evVal(r) < 0, (r) => Number.isFinite(r.clvPct) && r.clvPct < 0, 'EV<0    ×  −CLV');
cross((r) => hasEv(r) && evVal(r) < 0, (r) => Number.isFinite(r.clvPct) && r.clvPct >= 0, 'EV<0    ×  +CLV');
push('');

push('=== 4. Winners vs losers — mean CLV / entry EV ===');
push(`winners                               ${fmt(agg(withClv.filter((r) => r.won === 1)))}`);
push(`losers                                ${fmt(agg(withClv.filter((r) => r.won === 0)))}`);
push('');

push('=== 5. By window (has-CLV) ===');
for (const w of ['V12 pre-steam', 'steam, T off', 'T live']) {
  push(`${w.padEnd(22)} all  ${fmt(agg(live.filter((r) => r.window === w)))}`);
  push(`${''.padEnd(22)} CLV  ${fmt(agg(withClv.filter((r) => r.window === w)))}`);
  push(`${''.padEnd(22)} −3..−1 ${fmt(agg(withClv.filter((r) => r.window === w && r.clvPct >= -3 && r.clvPct < -1)))}`);
  push(`${''.padEnd(22)} EV3–5 ${fmt(agg(live.filter((r) => r.window === w && (() => { const e = r.evFirst ?? r.evStamped; return Number.isFinite(e) && e >= 3 && e < 5; })())))}`);
}
push('');

push('=== 6. By sport (has-CLV, Dale cell vs +CLV vs EV 3–5%) ===');
const sports = [...new Set(live.map((r) => r.sport))].sort();
for (const s of sports) {
  const sub = withClv.filter((r) => r.sport === s);
  if (sub.length < 8) continue;
  push(`-- ${s} --`);
  push(`  all CLV     ${fmt(agg(sub))}`);
  push(`  −3 to −1    ${fmt(agg(sub.filter((r) => r.clvPct >= -3 && r.clvPct < -1)))}`);
  push(`  +CLV        ${fmt(agg(sub.filter((r) => r.clvPct >= 0)))}`);
  push(`  EV 3–5%     ${fmt(agg(live.filter((r) => r.sport === s && (() => { const e = r.evFirst ?? r.evStamped; return Number.isFinite(e) && e >= 3 && e < 5; })())))}`);
}
push('');

push('=== 7. By market ===');
for (const m of ['ML', 'SPREAD', 'TOTAL']) {
  push(`${m.padEnd(8)} all   ${fmt(agg(live.filter((r) => r.mkt === m)))}`);
  push(`${''.padEnd(8)} CLV   ${fmt(agg(withClv.filter((r) => r.mkt === m)))}`);
  push(`${''.padEnd(8)} −3..−1 ${fmt(agg(withClv.filter((r) => r.mkt === m && r.clvPct >= -3 && r.clvPct < -1)))}`);
  push(`${''.padEnd(8)} EV3–5 ${fmt(agg(live.filter((r) => r.mkt === m && (() => { const e = r.evFirst ?? r.evStamped; return Number.isFinite(e) && e >= 3 && e < 5; })())))}`);
}
push('');

push('=== 8. Hypothetical: only-ship those cells (rest 0u) ===');
function onlyShip(pred, label) {
  const ship = live.filter(pred);
  push(`${label.padEnd(42)} ${fmt(agg(ship))}`);
}
onlyShip((r) => r.clvPct >= -3 && r.clvPct < -1, 'only CLV −3 to −1%');
onlyShip((r) => Number.isFinite(r.clvPct) && r.clvPct < 0, 'only any −CLV');
onlyShip((r) => Number.isFinite(r.clvPct) && r.clvPct > 0, 'only beat close (CLV > 0)');
onlyShip((r) => Number.isFinite(r.clvPct) && r.clvPct >= 0, 'only CLV ≥ 0');
onlyShip((r) => {
  const e = r.evFirst ?? r.evStamped;
  return Number.isFinite(e) && e >= 3 && e < 5;
}, 'only entry EV 3–5%');
onlyShip((r) => {
  const e = r.evFirst ?? r.evStamped;
  return Number.isFinite(e) && e >= 3;
}, 'only entry EV ≥3%');
onlyShip((r) => true, 'ship all (book)');
push('');

push('=== 8b. Juice mix inside CLV buckets (has-CLV) ===');
const JUICE = ['plus', '−100 to −120', '−121 to −150', '−151 to −200', '< −200'];
for (const b of ['−3 to −1%', '−1 to 0%', '0 to +1%', '+1 to +3%', 'any −CLV', 'any +CLV']) {
  const sub = b === 'any −CLV' ? loseClose
    : b === 'any +CLV' ? beatOrFlat
    : withClv.filter((r) => r.clvBucket === b);
  push(`-- ${b} --`);
  for (const j of JUICE) {
    const rowsJ = sub.filter((r) => juiceBand(r.odds) === j);
    if (rowsJ.length) push(`  ${j.padEnd(16)} ${fmt(agg(rowsJ))}`);
  }
}
push('');
push('=== 8c. Excess WR (actual − lock implied) is the "win more" test ===');
push('If excess is positive, we won more often than the price we paid required.');
for (const b of CLV_ORDER.filter((x) => x !== 'missing')) {
  push(`${b.padEnd(16)} ${fmt(agg(withClv.filter((r) => r.clvBucket === b)))}`);
}
push(`book             ${fmt(agg(withClv))}`);
push(`any −CLV         ${fmt(agg(loseClose))}`);
push(`any +CLV         ${fmt(agg(beatClose))}`);
push(`EV <0%           ${fmt(agg(live.filter((r) => r.evBucket === '<0%')))}`);
push(`EV 0–2%          ${fmt(agg(live.filter((r) => r.evBucket === '0–2%')))}`);
push(`EV ≥3%           ${fmt(agg(live.filter((r) => { const e = r.evFirst ?? r.evStamped; return Number.isFinite(e) && e >= 3; })))}`);
push('');

push('=== 9. CLV distribution (has-CLV) ===');
const clvs = withClv.map((r) => r.clvPct).sort((a, b) => a - b);
const pct = (p) => clvs.length ? clvs[Math.min(clvs.length - 1, Math.floor(p * (clvs.length - 1)))] : null;
push(`n=${clvs.length}  mean=${mean(clvs)?.toFixed(2)}  median=${median(clvs)?.toFixed(2)}  p10=${pct(0.1)?.toFixed(2)}  p25=${pct(0.25)?.toFixed(2)}  p75=${pct(0.75)?.toFixed(2)}  p90=${pct(0.9)?.toFixed(2)}`);
const beatN = withClv.filter((r) => r.clvPct > 0).length;
const flatN = withClv.filter((r) => r.clvPct === 0).length;
push(`beat close: ${beatN}/${withClv.length} (${((100 * beatN) / withClv.length).toFixed(1)}%)  ·  exactly 0: ${flatN}`);
push('');

push('=== 10. Sample tickets — CLV −3 to −1% (first 25 by date desc) ===');
const daleSorted = [...dale].sort((a, b) => String(b.date).localeCompare(String(a.date)));
for (const r of daleSorted.slice(0, 25)) {
  const evs = r.evFirst ?? r.evStamped;
  push(`  ${r.date} ${r.sport} ${r.mkt} ${String(r.team).slice(0, 28).padEnd(28)} ${r.won ? 'W' : 'L'} ${r.units}u  odds ${r.odds}  CLV ${r.clvPct >= 0 ? '+' : ''}${r.clvPct.toFixed(2)}%  EV ${evs == null ? '—' : (evs >= 0 ? '+' : '') + Number(evs).toFixed(1)}`);
}

push('=== 11. 500 vs 500 — sharp-backed actual vs 3–5% EV expected ===');
push('EV shop side is theoretical: if 3–5% EV is REAL, 500 tickets return 3–5% of the SAME stake.');
push('Our side is actual graded tickets. Worse-price pool = lost Pin close OR entry EV < 0 vs Pin fair.');
push('');

function byDate(a, b) {
  const d = String(a.date).localeCompare(String(b.date));
  if (d) return d;
  return String(a.id).localeCompare(String(b.id));
}
function vsEv(a, label) {
  if (!a || !a.n) {
    push(`${label.padEnd(42)} —`);
    return a;
  }
  const e3 = a.stake * 0.03;
  const e4 = a.stake * 0.04;
  const e5 = a.stake * 0.05;
  const d3 = a.pnl - e3;
  const d5 = a.pnl - e5;
  const mix = `−CLV ${a.nNegClv}/${a.n}  −EV ${a.nNegEv}/${a.nEvStamp || 0}  A/B ${a.nAb}/${a.n}  flat1u ${a.flatRoi >= 0 ? '+' : ''}${a.flatRoi}%`;
  push(`${label}`);
  push(`  ACTUAL ${fmt(a)}`);
  push(`  vs 3% EV  exp ${e3 >= 0 ? '+' : ''}${e3.toFixed(1)}u  Δ ${d3 >= 0 ? '+' : ''}${d3.toFixed(1)}u`);
  push(`  vs 4% EV  exp ${e4 >= 0 ? '+' : ''}${e4.toFixed(1)}u  Δ ${(a.pnl - e4) >= 0 ? '+' : ''}${(a.pnl - e4).toFixed(1)}u`);
  push(`  vs 5% EV  exp ${e5 >= 0 ? '+' : ''}${e5.toFixed(1)}u  Δ ${d5 >= 0 ? '+' : ''}${d5.toFixed(1)}u  · ${mix}`);
  return a;
}

const sorted = [...live].sort(byDate);
const worse = live.filter((r) => {
  const e = r.evFirst ?? r.evStamped;
  return (Number.isFinite(r.clvPct) && r.clvPct < 0) || (Number.isFinite(e) && e < 0);
}).sort(byDate);
const abRows = live.filter((r) => r.sharpAB).sort(byDate);
const negEv = live.filter((r) => {
  const e = r.evFirst ?? r.evStamped;
  return Number.isFinite(e) && e < 0;
}).sort(byDate);

function show500(rows, label) {
  if (!rows.length) {
    push(`${label.padEnd(42)} —`);
    return null;
  }
  const from = rows[0].date;
  const to = rows[rows.length - 1].date;
  return vsEv(agg(rows), `${label}  (${from} → ${to})`);
}
function take500(arr, which) {
  if (arr.length < 500) return { rows: arr, which: `all ${arr.length}` };
  if (which === 'first') return { rows: arr.slice(0, 500), which: 'first 500' };
  if (which === 'last') return { rows: arr.slice(-500), which: 'last 500' };
  return { rows: arr.slice(0, 500), which: 'first 500' };
}

push('-- A. 500 sharp-backed tickets (the live book — who is on it, any price) --');
show500(take500(sorted, 'first').rows, 'first 500 of V12 book');
show500(take500(sorted, 'last').rows, 'last 500 of V12 book');
vsEv(agg(sorted), `full book n=${sorted.length}`);
push('');
push('-- B. 500 that an EV screen could reject (worse price or −EV vs Pin) --');
push(`pool n=${worse.length}  (−CLV or entry EV<0)`);
show500(take500(worse, 'first').rows, `${take500(worse, 'first').which} worse-price/−EV`);
show500(take500(worse, 'last').rows, `${take500(worse, 'last').which} worse-price/−EV`);
vsEv(agg(worse), `all worse-price/−EV n=${worse.length}`);
push('');
push('-- C. Tickets the EV shop would skip (entry EV < 0 vs Pin fair) --');
vsEv(agg(negEv), `all −EV n=${negEv.length} (not 500 — rate only)`);
if (negEv.length) {
  const a = agg(negEv);
  const scaleStake = (500 / a.n) * a.stake;
  const scalePnl = (500 / a.n) * a.pnl;
  push(`  scaled to 500 at same ROI: stake ${scaleStake.toFixed(1)}u  PnL ${scalePnl >= 0 ? '+' : ''}${scalePnl.toFixed(1)}u  vs 5% EV ${(scaleStake * 0.05).toFixed(1)}u`);
}
push('');
push('-- D. Source A/B CONFIRMED on our side (sharps we track, public: sharp-backed) --');
push(`pool n=${abRows.length}`);
show500(take500(abRows, 'first').rows, `${take500(abRows, 'first').which} A/B`);
show500(take500(abRows, 'last').rows, `${take500(abRows, 'last').which} A/B`);
vsEv(agg(abRows), `all A/B n=${abRows.length}`);
push('');

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function sampleN(arr, n, rng) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}
function bootstrap500(arr, label, draws = 4000, seed = 20260909) {
  if (arr.length < 500) {
    push(`${label}: n=${arr.length} < 500 — skip bootstrap`);
    return null;
  }
  const rng = mulberry32(seed);
  const rois = [];
  const pnls = [];
  let beat3 = 0, beat5 = 0;
  for (let i = 0; i < draws; i++) {
    const a = agg(sampleN(arr, 500, rng));
    rois.push(a.roi);
    pnls.push(a.pnl);
    if (a.roi > 3) beat3++;
    if (a.roi > 5) beat5++;
  }
  rois.sort((x, y) => x - y);
  pnls.sort((x, y) => x - y);
  const q = (xs, p) => xs[Math.min(xs.length - 1, Math.floor(p * (xs.length - 1)))];
  push(`${label}  bootstrap ${draws} draws of 500`);
  push(`  ROI  mean ${mean(rois).toFixed(1)}%  p10 ${q(rois, 0.1).toFixed(1)}%  p50 ${q(rois, 0.5).toFixed(1)}%  p90 ${q(rois, 0.9).toFixed(1)}%`);
  push(`  PnL  mean ${mean(pnls).toFixed(1)}u  p10 ${q(pnls, 0.1).toFixed(1)}u  p50 ${q(pnls, 0.5).toFixed(1)}u  p90 ${q(pnls, 0.9).toFixed(1)}u`);
  push(`  share of 500-ticket books beating 3% EV: ${((100 * beat3) / draws).toFixed(0)}%   beating 5% EV: ${((100 * beat5) / draws).toFixed(0)}%`);
  return { meanRoi: mean(rois), p10: q(rois, 0.1), p50: q(rois, 0.5), beat3: beat3 / draws, beat5: beat5 / draws };
}

push('-- E. Rolling 500 (chronological, step 20) — how often the book clears 3% / 5% --');
function rolling500(arr, label) {
  if (arr.length < 500) {
    push(`${label}: n=${arr.length} < 500`);
    return;
  }
  const rois = [];
  let beat3 = 0, beat5 = 0;
  for (let i = 0; i + 500 <= arr.length; i += 20) {
    const a = agg(arr.slice(i, i + 500));
    rois.push(a.roi);
    if (a.roi > 3) beat3++;
    if (a.roi > 5) beat5++;
  }
  const nW = rois.length;
  push(`${label}  ${nW} windows`);
  push(`  ROI  mean ${mean(rois).toFixed(1)}%  median ${median(rois).toFixed(1)}%  min ${Math.min(...rois).toFixed(1)}%  max ${Math.max(...rois).toFixed(1)}%`);
  push(`  windows >3% EV: ${beat3}/${nW} (${((100 * beat3) / nW).toFixed(0)}%)   >5% EV: ${beat5}/${nW} (${((100 * beat5) / nW).toFixed(0)}%)`);
}
rolling500(sorted, 'live book');
rolling500(worse, 'worse-price/−EV pool');
rolling500(abRows, 'A/B pool');
push('');
push('-- F. Random 500-ticket books (with replacement shuffle) --');
const bootBook = bootstrap500(sorted, 'live book');
const bootWorse = bootstrap500(worse, 'worse-price/−EV');
const bootAb = bootstrap500(abRows, 'A/B sharp-backed');
push('');

mkdirSync('/opt/cursor/artifacts', { recursive: true });
const payload = {
  pulledAt: new Date().toISOString(),
  counts: { live: live.length, withClv: withClv.length, withEv: withEv.length, withBoth: withBoth.length },
  book: agg(live),
  withClv: agg(withClv),
  daleCell: agg(dale),
  beatClose: agg(beatClose),
  loseClose: agg(loseClose),
  ev35: agg(ev35),
  vs500: {
    first500: agg(take500(sorted, 'first').rows),
    last500: agg(take500(sorted, 'last').rows),
    worseN: worse.length,
    worseFirst500: agg(take500(worse, 'first').rows),
    worseLast500: agg(take500(worse, 'last').rows),
    negEv: agg(negEv),
    abN: abRows.length,
    abFirst500: agg(take500(abRows, 'first').rows),
    abLast500: agg(take500(abRows, 'last').rows),
    bootBook,
    bootWorse,
    bootAb,
  },
  byClvBucket: Object.fromEntries(CLV_ORDER.map((b) => [b, agg(live.filter((r) => r.clvBucket === b))])),
  byEvBucket: Object.fromEntries(EV_ORDER.map((b) => [b, agg(live.filter((r) => r.evBucket === b))])),
  report: out.join('\n'),
};
writeFileSync('/opt/cursor/artifacts/clv_vs_ev.json', JSON.stringify(payload, null, 2));
writeFileSync('/opt/cursor/artifacts/clv_vs_ev.txt', out.join('\n') + '\n');
console.log('\nWrote /opt/cursor/artifacts/clv_vs_ev.json and clv_vs_ev.txt');
