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
import { writeFileSync, mkdirSync } from 'fs';

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
  let n = 0, w = 0, l = 0, stake = 0, pnl = 0;
  const clvs = [];
  const evs = [];
  const lockEvs = [];
  const implieds = [];
  for (const r of rows) {
    if (r.won == null) continue;
    n++;
    stake += r.units || 0;
    pnl += Number.isFinite(r.profit) ? r.profit : 0;
    if (r.won === 1) w++;
    else if (r.won === 0) l++;
    if (Number.isFinite(r.clvPct)) clvs.push(r.clvPct);
    if (Number.isFinite(r.evFirst)) evs.push(r.evFirst);
    if (Number.isFinite(r.evLock)) lockEvs.push(r.evLock);
    const ip = impliedProb(r.odds);
    if (ip != null) implieds.push(ip * 100);
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
      rows.push({
        id: data.id,
        date: data.date,
        sport: data.sport || 'NHL',
        mkt,
        sideKey,
        team: sd.team || sideKey,
        units,
        won,
        profit,
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
  byClvBucket: Object.fromEntries(CLV_ORDER.map((b) => [b, agg(live.filter((r) => r.clvBucket === b))])),
  byEvBucket: Object.fromEntries(EV_ORDER.map((b) => [b, agg(live.filter((r) => r.evBucket === b))])),
  report: out.join('\n'),
};
writeFileSync('/opt/cursor/artifacts/clv_vs_ev.json', JSON.stringify(payload, null, 2));
writeFileSync('/opt/cursor/artifacts/clv_vs_ev.txt', out.join('\n') + '\n');
console.log('\nWrote /opt/cursor/artifacts/clv_vs_ev.json and clv_vs_ev.txt');
