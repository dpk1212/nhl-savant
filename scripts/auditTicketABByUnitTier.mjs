/**
 * Per-ticket Sharp A/B × unit tier (day-of labels, no leakage).
 *
 * Dale's question: day COLOR separates high-u more because A/B sharps
 * actually sit on those tickets — not on lean tickets. Measure:
 *   1) Coverage: % of tickets with hasA / hasAB / nAB by unit band
 *   2) Within-band lift: hasA vs noA (WR / PnL / ROI)
 *   3) Day-color × ticket-hasA interaction (proxy vs on-ticket signal)
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import {
  buildFlatDollarQBySport,
  shortWalletId,
} from '../src/lib/walletClvSkill.js';
import { tierLetterFromQ } from '../src/lib/sharpTierCellStats.js';

const BOOK = '/opt/cursor/artifacts/firestore_staked_book_jun1.json';
const OUT_MD = '/opt/cursor/artifacts/ticket_ab_by_unit_tier.md';
const OUT_JSON = '/opt/cursor/artifacts/ticket_ab_by_unit_tier.json';

const book = JSON.parse(readFileSync(BOOK, 'utf8'));
const rows = (book.rows || []).filter((r) => Number(r.units) > 0 && (r.outcome === 'WIN' || r.outcome === 'LOSS'));

console.log('Indexing git wallet-profiles.json commits…');
const log = execSync(
  "git log --pretty=format:'%H|%ad' --date=short -- data/wallet-profiles.json",
  { encoding: 'utf8', maxBuffer: 5e6 },
).trim().split('\n').filter(Boolean);

const commits = [];
for (const line of log) {
  const [hash, date] = line.split('|');
  if (!hash || !date || date < '2026-05-01') continue;
  commits.push({ hash, date });
}
commits.reverse();
console.log(`  ${commits.length} profile commits`);

const qCache = new Map();
function loadQForHash(hash) {
  if (qCache.has(hash)) return qCache.get(hash);
  const raw = execSync(`git show ${hash}:data/wallet-profiles.json`, {
    encoding: 'utf8',
    maxBuffer: 40e6,
  });
  const j = JSON.parse(raw);
  const map = new Map();
  for (const [k, v] of Object.entries(j.profiles || {})) {
    if (!v?.bySport) continue;
    const short = shortWalletId(v.walletShort || k);
    if (short) map.set(short, v);
  }
  const qBySport = buildFlatDollarQBySport(map, { tiers: ['CONFIRMED'] });
  const rosterBySport = new Map();
  for (const [sport, qMap] of qBySport) {
    const A = new Set();
    const AB = new Set();
    for (const [w, q] of qMap) {
      if (q === 1) A.add(w);
      if (q === 1 || q === 2) AB.add(w);
    }
    rosterBySport.set(sport, { A, AB, nA: A.size, nAB: AB.size, nQ: qMap.size });
  }
  const packed = { qBySport, rosterBySport };
  qCache.set(hash, packed);
  return packed;
}

function asOfCommit(ticketDate) {
  let best = null;
  for (const c of commits) {
    if (c.date < ticketDate) best = c;
    else break;
  }
  return best;
}

const ticketDates = [...new Set(rows.map((r) => r.date))].sort();
const asOfByDate = new Map();
for (const d of ticketDates) {
  const c = asOfCommit(d);
  if (c) asOfByDate.set(d, c);
}
const uniqueHashes = [...new Set([...asOfByDate.values()].map((c) => c.hash))];
console.log(`Loading ${uniqueHashes.length} as-of snapshots…`);
for (let i = 0; i < uniqueHashes.length; i++) {
  loadQForHash(uniqueHashes[i]);
  if ((i + 1) % 10 === 0 || i === uniqueHashes.length - 1) {
    console.log(`  loaded ${i + 1}/${uniqueHashes.length}`);
  }
}

function letterDayOf(sport, wallet, ticketDate) {
  const c = asOfByDate.get(ticketDate);
  if (!c) return null;
  const { qBySport } = loadQForHash(c.hash);
  const short = shortWalletId(wallet);
  const q = qBySport.get(sport)?.get(short);
  return tierLetterFromQ(q);
}

function ticketFeatures(r) {
  const side = r.sideKey;
  const sport = r.sport;
  const wd = Array.isArray(r.walletDetails) ? r.walletDetails : [];
  const seen = new Set();
  const forW = [];
  for (const w of wd) {
    if (!w || String(w.side) !== String(side)) continue;
    const short = shortWalletId(w.wallet);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    const letter = letterDayOf(sport, short, r.date);
    forW.push({
      short,
      letter,
      sizeRatio: Number(w.sizeRatio),
      contribution: Number(w.contribution),
    });
  }
  const aFor = forW.filter((x) => x.letter === 'A');
  const bFor = forW.filter((x) => x.letter === 'B');
  const abFor = forW.filter((x) => x.letter === 'A' || x.letter === 'B');
  const aSized = aFor.filter((x) => Number.isFinite(x.sizeRatio) && x.sizeRatio >= 0.5);
  const abContrib = abFor.reduce((s, x) => s + (Number.isFinite(x.contribution) ? x.contribution : 0), 0);
  return {
    nFor: forW.length,
    nA: aFor.length,
    nB: bFor.length,
    nAB: abFor.length,
    hasA: aFor.length >= 1,
    hasAB: abFor.length >= 1,
    hasASized: aSized.length >= 1,
    abContrib: Math.round(abContrib * 10) / 10,
  };
}

function band(u) {
  if (u < 2) return 'LEAN';
  if (u < 4) return 'MID';
  return 'HIGH';
}
function fine(u) {
  if (u < 0.75) return '0.x';
  if (u < 1.25) return '1u';
  if (u < 1.75) return '1.5u';
  if (u < 2.5) return '2u';
  if (u < 3.5) return '3u';
  if (u < 4.5) return '4u';
  if (u < 5.5) return '5u';
  return '6u+';
}
function month(d) {
  if (d < '2026-07-01') return 'June';
  if (d < '2026-08-01') return 'July';
  return 'August';
}

console.log('Scoring tickets…');
const enriched = [];
for (const r of rows) {
  if (!asOfByDate.has(r.date)) continue;
  const f = ticketFeatures(r);
  const u = Number(r.units) || 0;
  enriched.push({
    date: r.date,
    sport: r.sport,
    month: month(r.date),
    units: u,
    profit: Number(r.profit) || 0,
    won: r.outcome === 'WIN' ? 1 : 0,
    provenFor: Number.isFinite(Number(r.provenFor)) ? Number(r.provenFor) : null,
    band: band(u),
    fine: fine(u),
    ...f,
  });
}
console.log(`Enriched ${enriched.length}`);

// Day color from sport-day activeA / AB (same as turnout regime)
const bySportDay = new Map();
for (const r of enriched) {
  const k = `${r.sport}|${r.date}`;
  if (!bySportDay.has(k)) bySportDay.set(k, []);
  bySportDay.get(k).push(r);
}

const dayColor = new Map();
for (const [k, list] of bySportDay) {
  const sport = k.split('|')[0];
  const date = k.split('|')[1];
  const c = asOfByDate.get(date);
  const rost = c ? (loadQForHash(c.hash).rosterBySport.get(sport) || { nAB: 0, A: new Set(), AB: new Set() }) : { nAB: 0, A: new Set(), AB: new Set() };
  const activeA = new Set();
  const activeAB = new Set();
  for (const r of list) {
    // rebuild from nA presence is wrong — need wallet ids. Re-score lightly via has flags count.
    // Use ticket-level: any ticket with hasA contributes — but we need unique wallets.
    // Re-derive from book walletDetails again for day panel.
  }
  // Simpler: activeA = count of distinct A wallets on FORs across day's staked tickets
  // We didn't store aWallets. Approximate day color from pct tickets with hasA / mean nAB
  // Better: recompute quickly
  void rost;
}

// Recompute day color properly with wallet sets
function dayFeatures(list, sport, date) {
  const c = asOfByDate.get(date);
  const rost = c ? (loadQForHash(c.hash).rosterBySport.get(sport) || { nA: 0, nAB: 0, A: new Set(), AB: new Set() })
    : { nA: 0, nAB: 0, A: new Set(), AB: new Set() };
  const activeA = new Set();
  const activeAB = new Set();
  for (const r of list) {
    // pull from original book row
  }
  return { rost, activeA, activeAB };
}

// Attach wallets by re-walking book once into a map
const featByDoc = new Map();
for (const r of rows) {
  if (!asOfByDate.has(r.date)) continue;
  const side = r.sideKey;
  const wd = Array.isArray(r.walletDetails) ? r.walletDetails : [];
  const seen = new Set();
  const aW = [];
  const abW = [];
  for (const w of wd) {
    if (!w || String(w.side) !== String(side)) continue;
    const short = shortWalletId(w.wallet);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    const letter = letterDayOf(r.sport, short, r.date);
    if (letter === 'A') { aW.push(short); abW.push(short); }
    else if (letter === 'B') abW.push(short);
  }
  featByDoc.set(`${r.date}|${r.sport}|${r.sideKey}|${r.team}|${r.units}`, { aW, abW });
}

for (const [k, list] of bySportDay) {
  const [sport, date] = k.split('|');
  const c = asOfByDate.get(date);
  const rost = c ? (loadQForHash(c.hash).rosterBySport.get(sport) || { nA: 0, nAB: 0 })
    : { nA: 0, nAB: 0 };
  const activeA = new Set();
  const activeAB = new Set();
  for (const r of list) {
    // match enriched row back — use features already on r
  }
  // Rebuild from rows filtered to sport-day
  for (const r of rows) {
    if (r.sport !== sport || r.date !== date) continue;
    if (!(Number(r.units) > 0) || !(r.outcome === 'WIN' || r.outcome === 'LOSS')) continue;
    const side = r.sideKey;
    const wd = Array.isArray(r.walletDetails) ? r.walletDetails : [];
    const seen = new Set();
    for (const w of wd) {
      if (!w || String(w.side) !== String(side)) continue;
      const short = shortWalletId(w.wallet);
      if (!short || seen.has(short)) continue;
      seen.add(short);
      const letter = letterDayOf(sport, short, date);
      if (letter === 'A') { activeA.add(short); activeAB.add(short); }
      else if (letter === 'B') activeAB.add(short);
    }
  }
  const pctABRoster = rost.nAB > 0 ? (100 * activeAB.size) / rost.nAB : 0;
  let color = 'YELLOW';
  if (activeA.size === 0) color = 'RED';
  else if (activeAB.size >= 6 || pctABRoster >= 35) color = 'GREEN';
  dayColor.set(k, { color, activeA: activeA.size, activeAB: activeAB.size, pctABRoster: Math.round(pctABRoster * 10) / 10 });
}

for (const r of enriched) {
  const d = dayColor.get(`${r.sport}|${r.date}`);
  r.dayColor = d?.color || null;
  r.dayActiveA = d?.activeA ?? null;
  r.dayActiveAB = d?.activeAB ?? null;
}

function agg(list) {
  const n = list.length;
  if (!n) return null;
  const wins = list.reduce((s, r) => s + r.won, 0);
  const stake = list.reduce((s, r) => s + r.units, 0);
  const pnl = list.reduce((s, r) => s + r.profit, 0);
  return {
    n,
    w: wins,
    l: n - wins,
    wr: Math.round((1000 * wins) / n) / 10,
    stake: Math.round(stake * 10) / 10,
    pnl: Math.round(pnl * 10) / 10,
    roi: stake > 0 ? Math.round((1000 * pnl) / stake) / 10 : null,
    avgU: Math.round((100 * stake) / n) / 100,
    avgNA: Math.round((100 * list.reduce((s, r) => s + r.nA, 0)) / n) / 100,
    avgNAB: Math.round((100 * list.reduce((s, r) => s + r.nAB, 0)) / n) / 100,
    pctHasA: Math.round((1000 * list.filter((r) => r.hasA).length) / n) / 10,
    pctHasAB: Math.round((1000 * list.filter((r) => r.hasAB).length) / n) / 10,
  };
}

const BANDS = ['LEAN', 'MID', 'HIGH'];
const FINES = ['0.x', '1u', '1.5u', '2u', '3u', '4u', '5u', '6u+'];
const COLORS = ['GREEN', 'YELLOW', 'RED'];
const lines = [];
const out = (s = '') => lines.push(s);

out('# Per-ticket Sharp A/B × unit tier');
out('');
out('Day-of Q labels (commitDate < ticketDate). A/B = FOR-side wallets on **this ticket**.');
out(`N=${enriched.length} staked graded.`);
out('');
out('Hypothesis: day COLOR separates HIGH more because A/B sharps actually sit on high-u tickets, not lean ones.');
out('');

// ── 1. Coverage ──
out('## 1. Coverage — are A/B even ON the ticket by unit tier?');
out('');
out('| Band | N | % hasA | % hasAB | avg nA | avg nAB | avg u |');
out('|---|--:|--:|--:|--:|--:|--:|');
for (const b of BANDS) {
  const s = agg(enriched.filter((t) => t.band === b));
  out(`| **${b}** | ${s.n} | **${s.pctHasA}%** | **${s.pctHasAB}%** | ${s.avgNA} | ${s.avgNAB} | ${s.avgU} |`);
}
out('');
out('| Fine tier | N | % hasA | % hasAB | avg nAB |');
out('|---|--:|--:|--:|--:|');
for (const f of FINES) {
  const s = agg(enriched.filter((t) => t.fine === f));
  if (!s || s.n < 5) continue;
  out(`| ${f} | ${s.n} | ${s.pctHasA}% | ${s.pctHasAB}% | ${s.avgNAB} |`);
}
out('');

// ── 2. Within-band lift ──
out('## 2. Within unit band — ticket hasA / hasAB lift (WR / PnL / ROI)');
out('');
out('| Band × flag | N | W–L | WR | PnL | Stake | ROI |');
out('|---|--:|---|--:|--:|--:|--:|');
for (const b of BANDS) {
  const base = enriched.filter((t) => t.band === b);
  for (const [flag, pred] of [
    ['hasA YES', (t) => t.hasA],
    ['hasA NO', (t) => !t.hasA],
    ['hasAB YES', (t) => t.hasAB],
    ['hasAB NO', (t) => !t.hasAB],
    ['nAB≥2', (t) => t.nAB >= 2],
    ['nAB=0', (t) => t.nAB === 0],
  ]) {
    const s = agg(base.filter(pred));
    if (!s) continue;
    const ps = s.pnl >= 0 ? '+' : '';
    const rs = s.roi >= 0 ? '+' : '';
    out(`| **${b}** ${flag} | ${s.n} | ${s.w}–${s.l} | **${s.wr}%** | **${ps}${s.pnl}u** | ${s.stake}u | ${rs}${s.roi}% |`);
  }
  out('| | | | | | | |');
}

// Lift deltas
out('### Lift inside band (YES − NO)');
out('');
out('| Band | Flag | ΔWR pp | ΔPnL u | ΔROI pp |');
out('|---|---|--:|--:|--:|');
for (const b of BANDS) {
  const base = enriched.filter((t) => t.band === b);
  for (const [name, yesP, noP] of [
    ['hasA', (t) => t.hasA, (t) => !t.hasA],
    ['hasAB', (t) => t.hasAB, (t) => !t.hasAB],
  ]) {
    const y = agg(base.filter(yesP));
    const n = agg(base.filter(noP));
    if (!y || !n) continue;
    out(`| ${b} | ${name} | **${(y.wr - n.wr).toFixed(1)}** | **${(y.pnl - n.pnl).toFixed(1)}** | **${(y.roi - n.roi).toFixed(1)}** |`);
  }
}
out('');

// ── 3. Fine tier hasA ──
out('## 3. Fine tier × hasA (WR / PnL)');
out('');
out('| Tier | hasA N | WR | PnL | ROI | noA N | WR | PnL | ROI |');
out('|---|--:|--:|--:|--:|--:|--:|--:|--:|');
for (const f of FINES) {
  const y = agg(enriched.filter((t) => t.fine === f && t.hasA));
  const n = agg(enriched.filter((t) => t.fine === f && !t.hasA));
  if ((!y || y.n < 5) && (!n || n.n < 5)) continue;
  const cell = (s) => {
    if (!s) return '—|—|—|—';
    const ps = s.pnl >= 0 ? '+' : '';
    const rs = s.roi >= 0 ? '+' : '';
    return `${s.n}|${s.wr}%|${ps}${s.pnl}u|${rs}${s.roi}%`;
  };
  // manual
  const yps = y ? (y.pnl >= 0 ? '+' : '') : '';
  const yrs = y ? (y.roi >= 0 ? '+' : '') : '';
  const nps = n ? (n.pnl >= 0 ? '+' : '') : '';
  const nrs = n ? (n.roi >= 0 ? '+' : '') : '';
  out(`| ${f} | ${y ? y.n : '—'} | ${y ? y.wr + '%' : '—'} | ${y ? yps + y.pnl + 'u' : '—'} | ${y ? yrs + y.roi + '%' : '—'} | ${n ? n.n : '—'} | ${n ? n.wr + '%' : '—'} | ${n ? nps + n.pnl + 'u' : '—'} | ${n ? nrs + n.roi + '%' : '—'} |`);
}
out('');

// ── 4. Day color × ticket hasA ──
out('## 4. Day COLOR × ticket hasA — proxy vs on-ticket');
out('');
out('| Day color × ticket | N | % of color | W–L | WR | PnL | ROI | avg u |');
out('|---|--:|--:|---|--:|--:|--:|--:|');
for (const c of COLORS) {
  const base = enriched.filter((t) => t.dayColor === c);
  const tot = base.length || 1;
  for (const [lab, pred] of [
    ['hasA YES', (t) => t.hasA],
    ['hasA NO', (t) => !t.hasA],
  ]) {
    const s = agg(base.filter(pred));
    if (!s) continue;
    const ps = s.pnl >= 0 ? '+' : '';
    const rs = s.roi >= 0 ? '+' : '';
    out(`| **${c}** ${lab} | ${s.n} | ${Math.round((1000 * s.n) / tot) / 10}% | ${s.w}–${s.l} | **${s.wr}%** | **${ps}${s.pnl}u** | ${rs}${s.roi}% | ${s.avgU} |`);
  }
}
out('');

out('## 5. Day COLOR × unit band × ticket hasA (the money cut)');
out('');
out('| Color × band × hasA | N | WR | PnL | ROI |');
out('|---|--:|--:|--:|--:|');
for (const c of COLORS) {
  for (const b of BANDS) {
    for (const [lab, pred] of [['YES', (t) => t.hasA], ['NO', (t) => !t.hasA]]) {
      const s = agg(enriched.filter((t) => t.dayColor === c && t.band === b && pred(t)));
      if (!s || s.n < 5) continue;
      const ps = s.pnl >= 0 ? '+' : '';
      const rs = s.roi >= 0 ? '+' : '';
      out(`| ${c} × ${b} × A=${lab} | ${s.n} | **${s.wr}%** | **${ps}${s.pnl}u** | ${rs}${s.roi}% |`);
    }
  }
}
out('');

// ── 6. HIGH only depth ──
out('## 6. HIGH (≥4u) — nAB depth on the ticket');
out('');
out('| nAB on ticket | N | W–L | WR | PnL | ROI | % of HIGH |');
out('|---|--:|---|--:|--:|--:|--:|');
const high = enriched.filter((t) => t.band === 'HIGH');
for (const [lab, pred] of [
  ['0', (t) => t.nAB === 0],
  ['1', (t) => t.nAB === 1],
  ['2', (t) => t.nAB === 2],
  ['3+', (t) => t.nAB >= 3],
  ['hasA', (t) => t.hasA],
  ['hasAB no A (B only)', (t) => t.hasAB && !t.hasA],
]) {
  const s = agg(high.filter(pred));
  if (!s) continue;
  const ps = s.pnl >= 0 ? '+' : '';
  const rs = s.roi >= 0 ? '+' : '';
  out(`| ${lab} | ${s.n} | ${s.w}–${s.l} | **${s.wr}%** | **${ps}${s.pnl}u** | ${rs}${s.roi}% | ${Math.round((1000 * s.n) / high.length) / 10}% |`);
}
out('');

// ── 7. Month stability HIGH × hasA ──
out('## 7. HIGH × hasA by month');
out('');
out('| Month | hasA N | WR | PnL | ROI | noA N | WR | PnL | ROI |');
out('|---|--:|--:|--:|--:|--:|--:|--:|--:|');
for (const mo of ['June', 'July', 'August']) {
  const y = agg(high.filter((t) => t.month === mo && t.hasA));
  const n = agg(high.filter((t) => t.month === mo && !t.hasA));
  const fmt = (s) => {
    if (!s) return ['—', '—', '—', '—'];
    const ps = s.pnl >= 0 ? '+' : '';
    const rs = s.roi >= 0 ? '+' : '';
    return [String(s.n), `${s.wr}%`, `${ps}${s.pnl}u`, `${rs}${s.roi}%`];
  };
  const Y = fmt(y);
  const N = fmt(n);
  out(`| ${mo} | ${Y[0]} | ${Y[1]} | ${Y[2]} | ${Y[3]} | ${N[0]} | ${N[1]} | ${N[2]} | ${N[3]} |`);
}
out('');

// Verdict numbers
const lean = agg(enriched.filter((t) => t.band === 'LEAN'));
const mid = agg(enriched.filter((t) => t.band === 'MID'));
const hi = agg(enriched.filter((t) => t.band === 'HIGH'));
const hiA = agg(high.filter((t) => t.hasA));
const hiNo = agg(high.filter((t) => !t.hasA));
const leanA = agg(enriched.filter((t) => t.band === 'LEAN' && t.hasA));
const leanNo = agg(enriched.filter((t) => t.band === 'LEAN' && !t.hasA));

out('## 8. Verdict');
out('');
out(`- Coverage: LEAN hasA **${lean.pctHasA}%** · MID **${mid.pctHasA}%** · HIGH **${hi.pctHasA}%**`);
out(`- HIGH hasA: ${hiA.w}–${hiA.l} **${hiA.wr}% WR**, **+${hiA.pnl}u**, **+${hiA.roi}% ROI** vs noA ${hiNo.w}–${hiNo.l} **${hiNo.wr}%**, **${hiNo.pnl}u**, **${hiNo.roi}%**`);
out(`- LEAN hasA lift WR: ${leanA ? leanA.wr : '—'}% vs ${leanNo ? leanNo.wr : '—'}% (thin signal on small tickets)`);
out('- If coverage rises with units AND lift is concentrated in HIGH → Dale hypothesis holds: color works on high-u because that is where A/B are.');

writeFileSync(OUT_MD, lines.join('\n'));
writeFileSync(OUT_JSON, JSON.stringify({
  n: enriched.length,
  coverage: Object.fromEntries(BANDS.map((b) => [b, agg(enriched.filter((t) => t.band === b))])),
  highHasA: { yes: hiA, no: hiNo },
  tickets: enriched.map((t) => ({
    date: t.date, sport: t.sport, units: t.units, band: t.band, fine: t.fine,
    won: t.won, profit: t.profit, nA: t.nA, nAB: t.nAB, hasA: t.hasA, hasAB: t.hasAB,
    dayColor: t.dayColor,
  })),
}, null, 2));

console.log(lines.join('\n'));
console.log(`\nWrote ${OUT_MD}`);
