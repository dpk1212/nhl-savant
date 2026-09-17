#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const rows = JSON.parse(readFileSync('/opt/cursor/artifacts/steam_separator_rows.json', 'utf8'));
const T_FROM = '2026-08-31';
const PAPER_HI = '2026-09-08';

function americanProfit(won, units, odds) {
  if (won == null || !(units > 0)) return 0;
  if (won) return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
  return -units;
}
function wilson(w, n, z = 1.96) {
  if (!(n > 0)) return null;
  const p = w / n;
  const z2 = z * z;
  const den = 1 + z2 / n;
  const mid = p + z2 / (2 * n);
  const half = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
  return { lo: Math.max(0, (mid - half) / den), hi: Math.min(1, (mid + half) / den) };
}
function agg(rs, uKey = 'u', pKey = 'pnl') {
  let n = 0, w = 0, l = 0, stake = 0, pnl = 0;
  for (const r of rs) {
    if (r.won == null) continue;
    n++;
    stake += Number(r[uKey]) || 0;
    pnl += Number.isFinite(Number(r[pKey])) ? Number(r[pKey]) : 0;
    if (r.won === 1) w++; else l++;
  }
  const ci = wilson(w, n);
  return {
    n, w, l,
    stake: +stake.toFixed(2),
    pnl: +pnl.toFixed(2),
    wr: n ? +((w / n) * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    wrHi: ci ? +(ci.hi * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
  };
}
function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  const wr = a.wr == null ? '—' : `${a.wr}%`;
  const band = a.wrLo != null ? ` (${a.wrLo}–${a.wrHi})` : '';
  return `${a.n} · ${a.w}–${a.l} · ${wr}${band} · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u · ${roi}`;
}
function shortFmt(a) {
  if (!a || !a.n) return '—';
  return `${a.w}–${a.l} ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(0)}u / ${a.roi >= 0 ? '+' : ''}${a.roi}%`;
}
function mdTable(headers, rows) {
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}`;
}
function signed(n, d = 1) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return `${x >= 0 ? '+' : ''}${x.toFixed(d)}`;
}
function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const liveOf = (rs) => rs.filter((r) => r.live);
const muteOf = (rs) => rs.filter((r) => !r.live);
const win = (rs, lo, hi) => rs.filter((r) => r.date >= lo && r.date <= hi);

const dates = [...new Set(rows.map((r) => r.date))].sort();
const lastDate = dates[dates.length - 1];
const liveDates = [...new Set(liveOf(rows).map((r) => r.date))].sort();
const last2Lo = liveDates.slice(-2)[0];
const last2Hi = liveDates[liveDates.length - 1];
const weekLo = addDays(lastDate, -6);

const steam = rows;
const tEra = win(rows, T_FROM, lastDate);
const tPre = win(rows, T_FROM, PAPER_HI);
const last2 = win(rows, last2Lo, last2Hi);
const week = win(rows, weekLo, lastDate);

const windows = [
  ['Last 2', last2],
  ['Last 7', week],
  ['T pre-HOLD', tPre],
  ['Full T', tEra],
  ['Steam era', steam],
];

function shareFine(p) {
  if (!Number.isFinite(p)) return 'no $ split';
  const x = p * 100;
  if (x < 20) return '0–20%';
  if (x < 25) return '20–25%';
  if (x < 30) return '25–30%';
  if (x < 35) return '30–35%';
  if (x < 40) return '35–40%';
  if (x < 50) return '40–50%';
  if (x < 60) return '50–60%';
  if (x < 80) return '60–80%';
  return '80–100%';
}
function edgeFine(e) {
  if (!Number.isFinite(e)) return 'no edge';
  if (e < 0) return '<0';
  if (e < 2) return '0–2';
  if (e < 4) return '2–4';
  if (e < 5) return '4–5';
  if (e < 6) return '5–6';
  if (e < 8) return '6–8';
  if (e < 10) return '8–10';
  if (e < 12) return '10–12';
  if (e < 15) return '12–15';
  if (e < 20) return '15–20';
  return '20+';
}
function uBand(u) {
  if (!(u > 0)) return '0u';
  if (u <= 1) return '≤1u';
  if (u < 2.5) return '2u';
  if (u < 3.5) return '3u';
  if (u < 4.5) return '4u';
  return '5u+';
}
function life(r) {
  if (r.arriving) return 'arriving';
  if (r.steamOn) return 'already-on';
  return 'no steam';
}
function mlbTot(r) {
  if (r.sport === 'MLB' && r.mkt === 'TOTAL') return 'MLB TOTAL';
  if (r.sport === 'MLB') return 'MLB not TOTAL';
  return 'not MLB';
}

function sliceTable(title, keyFn, order, book = liveOf) {
  const keys = new Set();
  for (const [, rs] of windows) for (const r of book(rs)) keys.add(keyFn(r));
  let list = [...keys];
  if (order) {
    const rank = new Map(order.map((k, i) => [k, i]));
    list.sort((a, b) => (rank.has(a) ? rank.get(a) : 99) - (rank.has(b) ? rank.get(b) : 99) || String(a).localeCompare(String(b)));
  } else list.sort();
  const header = ['Slice', ...windows.map(([n]) => n)];
  const body = list.map((k) => [
    k,
    ...windows.map(([, rs]) => fmt(agg(book(rs).filter((r) => keyFn(r) === k)))),
  ]);
  return `### ${title}\n\n${mdTable(header, body)}\n`;
}

function cfMute(rs) {
  // If we had muted live tickets (set u=0), saved = -pnl of those tickets.
  // Report as: actual live vs if muted (0u) vs if shrunk to floor.
  return agg(rs);
}
function shrinkPnl(r, floor = 2) {
  const u2 = Math.min(r.u, floor);
  if (!(u2 > 0)) return 0;
  return americanProfit(r.won, u2, r.odds);
}
function muteSaved(rs) {
  // mute all: pnl becomes 0. Saved = -actual pnl (positive = we avoid losses)
  const a = agg(rs);
  return { n: a.n, w: a.w, l: a.l, actual: a.pnl, ifMuted: 0, delta: +(-a.pnl).toFixed(2) };
}
function shrinkSaved(rs, floor = 2) {
  let actual = 0, shrunk = 0, n = 0, w = 0, l = 0, stakeA = 0, stakeS = 0;
  for (const r of rs) {
    if (r.won == null) continue;
    n++; if (r.won) w++; else l++;
    actual += r.pnl || 0;
    stakeA += r.u || 0;
    const u2 = Math.min(r.u, floor);
    const p2 = americanProfit(r.won, u2, r.odds);
    shrunk += p2;
    stakeS += u2;
  }
  return {
    n, w, l,
    actual: +actual.toFixed(2),
    shrunk: +shrunk.toFixed(2),
    delta: +(shrunk - actual).toFixed(2),
    stakeA: +stakeA.toFixed(1),
    stakeS: +stakeS.toFixed(1),
  };
}
function capPnl(r, cap = 3) {
  const u2 = Math.min(r.u, cap);
  return americanProfit(r.won, u2, r.odds);
}

function ticketLine(r) {
  const e = Number.isFinite(r.edge) ? `e${r.edge.toFixed(1)}` : 'e—';
  const sh = Number.isFinite(r.share) ? `${Math.round(r.share * 100)}%` : '$—';
  const sr = Number.isFinite(r.leadSr) ? `${r.leadSr.toFixed(2)}×` : 'sr—';
  const ts = Number.isFinite(r.tapeScore) ? `t${r.tapeScore.toFixed(2)}` : 't—';
  return `${r.date} ${(r.sport || '').padEnd(4)} ${(r.mkt || '').padEnd(6)} ${(r.team || '').slice(0, 26).padEnd(26)} ${String(r.u).padStart(4)}u ${r.won ? 'W' : 'L'} ${signed(r.pnl, 2).padStart(7)}  ${e.padStart(7)} ${sh.padStart(4)} ${sr.padStart(6)} ${ts.padStart(6)} ${(r.tapeAction || '—').padEnd(8)} ${(r.combo || '').padEnd(16)} P${r.provenFor || 0}/A${r.provenAg || 0} ${life(r)} ${r.mutedBy || ''}`;
}

const out = [];
const p = (s = '') => out.push(s);

p('# $ share + EDGE policy options — ticket-level');
p('');
p(`_Read ${rows.length} graded steam-era rows through ${lastDate}. Last 2 = ${last2Lo}–${last2Hi}. **No policy shipped.** Mute CF on already-muted tickets: positive = we cut winners. Counterfactual on live tickets: **positive delta = a mute/shrink would have saved money.**_`);
p('');
p('Share = all `walletDetails.invested` on our side / (ours+against). Not proven-only. Matches the card “% of board.”');
p('EDGE = mean FOR sport WR − mean AG sport WR (n≥8 both sides for strict). Stake ladder frozen 2026-07-15 — EDGE does **not** size live tickets. Leftover still floors BOTH E10+BOOST to 4u/5u and mutes leftover sub-4 when E10 and/or tape BOOST.');
p('');

p('## 1. $ share — finer bands');
p('');
p(sliceTable('Live by $ share (fine)', (r) => shareFine(r.share), [
  '0–20%', '20–25%', '25–30%', '30–35%', '35–40%', '40–50%', '50–60%', '60–80%', '80–100%', 'no $ split',
]));

p('Headline two-way recap (live):');
p('');
{
  const tests = [
    ['<25%', (r) => Number.isFinite(r.share) && r.share < 0.25],
    ['25–40%', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
    ['40–60%', (r) => Number.isFinite(r.share) && r.share >= 0.40 && r.share < 0.60],
    ['≥60%', (r) => Number.isFinite(r.share) && r.share >= 0.60],
  ];
  p(mdTable(
    ['Band', ...windows.map(([n]) => n)],
    tests.map(([name, fn]) => [name, ...windows.map(([, rs]) => shortFmt(agg(liveOf(rs).filter(fn))))]),
  ));
  p('');
}

p('### Already-muted $ share (pre units) — are we already cutting this?');
p('');
{
  const tests = [
    ['muted <25%', (r) => Number.isFinite(r.share) && r.share < 0.25],
    ['muted 25–40%', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
    ['muted 40–60%', (r) => Number.isFinite(r.share) && r.share >= 0.40 && r.share < 0.60],
    ['muted ≥60%', (r) => Number.isFinite(r.share) && r.share >= 0.60],
  ];
  p(mdTable(
    ['Muted cell', 'Last 2 CF', 'Last 7 CF', 'Full T CF'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(muteOf(last2).filter(fn), 'uPre', 'pnlPre')),
      fmt(agg(muteOf(week).filter(fn), 'uPre', 'pnlPre')),
      fmt(agg(muteOf(tEra).filter(fn), 'uPre', 'pnlPre')),
    ]),
  ));
  p('');
}

p('### 25–40% live × other features (Full T)');
p('');
{
  const cell = liveOf(tEra).filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40);
  const tests = [
    ['all 25–40%', () => true],
    ['arriving', (r) => r.arriving],
    ['already-on', (r) => r.steamOn && !r.arriving],
    ['no steam', (r) => !r.steamOn],
    ['MLB TOTAL', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL'],
    ['MLB not TOTAL', (r) => r.sport === 'MLB' && r.mkt !== 'TOTAL'],
    ['not MLB', (r) => r.sport !== 'MLB'],
    ['≤1u', (r) => r.u <= 1],
    ['2–3u', (r) => r.u > 1 && r.u < 3.5],
    ['4u+', (r) => r.u >= 3.5],
    ['edge 0–5', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5],
    ['edge 5–10', (r) => Number.isFinite(r.edge) && r.edge >= 5 && r.edge < 10],
    ['edge 10+', (r) => Number.isFinite(r.edge) && r.edge >= 10],
    ['edge <0', (r) => Number.isFinite(r.edge) && r.edge < 0],
    ['tape HOLD', (r) => r.tapeAction === 'HOLD'],
    ['tape BOOST', (r) => r.tapeAction === 'BOOST' || (Number.isFinite(r.tapeScore) && r.tapeScore >= 2.89)],
    ['lead ≥1.25×', (r) => Number.isFinite(r.leadSr) && r.leadSr >= 1.25],
    ['lead <0.75×', (r) => Number.isFinite(r.leadSr) && r.leadSr < 0.75],
    ['proven against ≥1', (r) => (r.provenAg || 0) >= 1],
    ['0 proven against', (r) => (r.provenAg || 0) === 0],
  ];
  p(mdTable(
    ['Inside 25–40%', 'Full T', 'Last 7', 'Last 2'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(cell.filter(fn))),
      fmt(agg(liveOf(week).filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && fn(r)))),
      fmt(agg(liveOf(last2).filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && fn(r)))),
    ]),
  ));
  p('');
}

p('### ≥60% live × other features (Full T) — the printer, did last 2 break it?');
p('');
{
  const cell = liveOf(tEra).filter((r) => Number.isFinite(r.share) && r.share >= 0.60);
  const tests = [
    ['all ≥60%', () => true],
    ['arriving', (r) => r.arriving],
    ['MLB TOTAL', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL'],
    ['MLB not TOTAL', (r) => r.sport === 'MLB' && r.mkt !== 'TOTAL'],
    ['4u+', (r) => r.u >= 3.5],
    ['2–3u', (r) => r.u > 1 && r.u < 3.5],
    ['edge 0–5', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5],
    ['edge 5–10', (r) => Number.isFinite(r.edge) && r.edge >= 5 && r.edge < 10],
    ['edge 10+', (r) => Number.isFinite(r.edge) && r.edge >= 10],
    ['lead ≥1.25×', (r) => Number.isFinite(r.leadSr) && r.leadSr >= 1.25],
  ];
  p(mdTable(
    ['Inside ≥60%', 'Full T', 'Last 7', 'Last 2'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(cell.filter(fn))),
      fmt(agg(liveOf(week).filter((r) => Number.isFinite(r.share) && r.share >= 0.60 && fn(r)))),
      fmt(agg(liveOf(last2).filter((r) => Number.isFinite(r.share) && r.share >= 0.60 && fn(r)))),
    ]),
  ));
  p('');
}

p('### Counterfactual: mute or shrink 25–40% (live tickets only)');
p('');
p('If we had applied this **on top of current policy** to tickets that actually shipped.');
p('');
{
  const bands = [
    ['mute 25–40% to 0u', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
    ['mute 25–35%', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.35],
    ['mute 30–40%', (r) => Number.isFinite(r.share) && r.share >= 0.30 && r.share < 0.40],
    ['mute <40% (incl <25%)', (r) => Number.isFinite(r.share) && r.share < 0.40],
    ['mute 25–40% AND 4u+', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && r.u >= 3.5],
    ['mute 25–40% AND arriving', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && r.arriving],
    ['mute 25–40% AND MLB TOTAL', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && r.sport === 'MLB' && r.mkt === 'TOTAL'],
  ];
  const body = bands.map(([name, fn]) => {
    const cells = windows.map(([, rs]) => {
      const hit = liveOf(rs).filter(fn);
      const m = muteSaved(hit);
      return `${m.n ? `${m.w}–${m.l}` : '—'} actual ${m.n ? signed(m.actual, 1) : '—'} → mute 0 · save ${m.n ? signed(m.delta, 1) : '—'}`;
    });
    return [name, ...cells];
  });
  p(mdTable(['Rule', ...windows.map(([n]) => n)], body));
  p('');
}
{
  p('Shrink (not mute) — cap 25–40% at 2u:');
  p('');
  const hitT = liveOf(tEra).filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40);
  const hit7 = liveOf(week).filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40);
  const hit2 = liveOf(last2).filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40);
  const hitS = liveOf(steam).filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40);
  const rows2 = [
    ['25–40% actual', fmt(agg(hit2)), fmt(agg(hit7)), fmt(agg(hitT)), fmt(agg(hitS))],
    ['if cap 2u', fmt({ ...(() => { const s = shrinkSaved(hit2, 2); return { n: s.n, w: s.w, l: s.l, stake: s.stakeS, pnl: s.shrunk, wr: s.n ? +((s.w / s.n) * 100).toFixed(1) : null, wrLo: null, wrHi: null, roi: s.stakeS ? +((s.shrunk / s.stakeS) * 100).toFixed(1) : null }; })() }),
      fmt({ ...(() => { const s = shrinkSaved(hit7, 2); return { n: s.n, w: s.w, l: s.l, stake: s.stakeS, pnl: s.shrunk, wr: s.n ? +((s.w / s.n) * 100).toFixed(1) : null, wrLo: null, wrHi: null, roi: s.stakeS ? +((s.shrunk / s.stakeS) * 100).toFixed(1) : null }; })() }),
      fmt({ ...(() => { const s = shrinkSaved(hitT, 2); return { n: s.n, w: s.w, l: s.l, stake: s.stakeS, pnl: s.shrunk, wr: s.n ? +((s.w / s.n) * 100).toFixed(1) : null, wrLo: null, wrHi: null, roi: s.stakeS ? +((s.shrunk / s.stakeS) * 100).toFixed(1) : null }; })() }),
      fmt({ ...(() => { const s = shrinkSaved(hitS, 2); return { n: s.n, w: s.w, l: s.l, stake: s.stakeS, pnl: s.shrunk, wr: s.n ? +((s.w / s.n) * 100).toFixed(1) : null, wrLo: null, wrHi: null, roi: s.stakeS ? +((s.shrunk / s.stakeS) * 100).toFixed(1) : null }; })() })],
    ['delta vs actual (cap 2u)',
      signed(shrinkSaved(hit2, 2).delta, 1) + 'u',
      signed(shrinkSaved(hit7, 2).delta, 1) + 'u',
      signed(shrinkSaved(hitT, 2).delta, 1) + 'u',
      signed(shrinkSaved(hitS, 2).delta, 1) + 'u'],
    ['if mute 0u, save',
      signed(muteSaved(hit2).delta, 1) + 'u',
      signed(muteSaved(hit7).delta, 1) + 'u',
      signed(muteSaved(hitT).delta, 1) + 'u',
      signed(muteSaved(hitS).delta, 1) + 'u'],
  ];
  p(mdTable(['', 'Last 2', 'Last 7', 'Full T', 'Steam era'], rows2));
  p('');
  p(`Cap 2u on 25–40% Full T: actual ${signed(agg(hitT).pnl, 1)}u → ${signed(shrinkSaved(hitT, 2).shrunk, 1)}u (save ${signed(shrinkSaved(hitT, 2).delta, 1)}u). Mute would save ${signed(muteSaved(hitT).delta, 1)}u and kill the 6 winners.`);
  p('');
}

p('### Live 25–40% tickets (Full T), worst first');
p('');
p('```');
liveOf(tEra)
  .filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40)
  .sort((a, b) => (a.pnl || 0) - (b.pnl || 0))
  .forEach((r) => p(ticketLine(r)));
p('```');
p('');

p('## 2. EDGE — finer bands');
p('');
p(sliceTable('Live by EDGE (fine)', (r) => edgeFine(r.edge), [
  'no edge', '<0', '0–2', '2–4', '4–5', '5–6', '6–8', '8–10', '10–12', '12–15', '15–20', '20+',
]));

p('### Edge 0–5 live × other features');
p('');
{
  const inBand = (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5;
  const tests = [
    ['all 0–5', () => true],
    ['arriving', (r) => r.arriving],
    ['already-on', (r) => r.steamOn && !r.arriving],
    ['no steam', (r) => !r.steamOn],
    ['MLB TOTAL', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL'],
    ['MLB not TOTAL', (r) => r.sport === 'MLB' && r.mkt !== 'TOTAL'],
    ['not MLB', (r) => r.sport !== 'MLB'],
    ['≤1u', (r) => r.u <= 1],
    ['2–3u', (r) => r.u > 1 && r.u < 3.5],
    ['4u+', (r) => r.u >= 3.5],
    ['$ 25–40%', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
    ['$ ≥60%', (r) => Number.isFinite(r.share) && r.share >= 0.60],
    ['$ <25%', (r) => Number.isFinite(r.share) && r.share < 0.25],
    ['tape HOLD', (r) => r.tapeAction === 'HOLD'],
    ['tape BOOST', (r) => r.tapeAction === 'BOOST'],
    ['lead ≥1.25×', (r) => Number.isFinite(r.leadSr) && r.leadSr >= 1.25],
    ['edge both sides', (r) => r.edgeBoth === true],
    ['edge one-sided / fill', (r) => r.edgeBoth !== true],
  ];
  p(mdTable(
    ['Inside 0–5', 'Full T', 'Last 7', 'Last 2'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(liveOf(tEra).filter((r) => inBand(r) && fn(r)))),
      fmt(agg(liveOf(week).filter((r) => inBand(r) && fn(r)))),
      fmt(agg(liveOf(last2).filter((r) => inBand(r) && fn(r)))),
    ]),
  ));
  p('');
}

p('### Edge 5–10 live × other features');
p('');
{
  const inBand = (r) => Number.isFinite(r.edge) && r.edge >= 5 && r.edge < 10;
  const tests = [
    ['all 5–10', () => true],
    ['arriving', (r) => r.arriving],
    ['MLB TOTAL', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL'],
    ['MLB not TOTAL', (r) => r.sport === 'MLB' && r.mkt !== 'TOTAL'],
    ['4u+', (r) => r.u >= 3.5],
    ['2–3u', (r) => r.u > 1 && r.u < 3.5],
    ['$ 25–40%', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
    ['$ ≥60%', (r) => Number.isFinite(r.share) && r.share >= 0.60],
    ['lead ≥1.25×', (r) => Number.isFinite(r.leadSr) && r.leadSr >= 1.25],
  ];
  p(mdTable(
    ['Inside 5–10', 'Full T', 'Last 7', 'Last 2'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(liveOf(tEra).filter((r) => inBand(r) && fn(r)))),
      fmt(agg(liveOf(week).filter((r) => inBand(r) && fn(r)))),
      fmt(agg(liveOf(last2).filter((r) => inBand(r) && fn(r)))),
    ]),
  ));
  p('');
}

p('### Edge 15+ live × leftover combo (why it is not a printer)');
p('');
{
  const inBand = (r) => Number.isFinite(r.edge) && r.edge >= 15;
  const tests = [
    ['all 15+', () => true],
    ['BOTH E10+BOOST', (r) => r.combo === 'BOTH E10+BOOST'],
    ['E10 only (no BOOST)', (r) => r.combo === 'E10 only'],
    ['4u+', (r) => r.u >= 3.5],
    ['5u+', (r) => r.u >= 4.5],
    ['arriving', (r) => r.arriving],
    ['MLB TOTAL', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL'],
    ['$ ≥60%', (r) => Number.isFinite(r.share) && r.share >= 0.60],
    ['$ 25–40%', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
  ];
  p(mdTable(
    ['Inside 15+', 'Full T', 'Last 7', 'Steam era'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(liveOf(tEra).filter((r) => inBand(r) && fn(r)))),
      fmt(agg(liveOf(week).filter((r) => inBand(r) && fn(r)))),
      fmt(agg(liveOf(steam).filter((r) => inBand(r) && fn(r)))),
    ]),
  ));
  p('');
}

p('### Already-muted EDGE (pre units)');
p('');
{
  const tests = [
    ['muted 0–5', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5],
    ['muted 5–10', (r) => Number.isFinite(r.edge) && r.edge >= 5 && r.edge < 10],
    ['muted 10–15', (r) => Number.isFinite(r.edge) && r.edge >= 10 && r.edge < 15],
    ['muted 15+', (r) => Number.isFinite(r.edge) && r.edge >= 15],
  ];
  p(mdTable(
    ['Muted cell', 'Last 2 CF', 'Last 7 CF', 'Full T CF'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(muteOf(last2).filter(fn), 'uPre', 'pnlPre')),
      fmt(agg(muteOf(week).filter(fn), 'uPre', 'pnlPre')),
      fmt(agg(muteOf(tEra).filter(fn), 'uPre', 'pnlPre')),
    ]),
  ));
  p('');
}

p('### Counterfactual: mute or shrink EDGE 0–5 (live tickets)');
p('');
{
  const bands = [
    ['mute 0–5', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5],
    ['mute 0–4', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 4],
    ['mute 0–2', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 2],
    ['mute 0–5 AND 4u+', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5 && r.u >= 3.5],
    ['mute 0–5 AND arriving', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5 && r.arriving],
    ['mute 0–5 AND MLB TOTAL', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5 && r.sport === 'MLB' && r.mkt === 'TOTAL'],
    ['mute 0–5 AND $ 25–40%', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5 && Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
    ['mute 0–5 AND $ ≥60%', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5 && Number.isFinite(r.share) && r.share >= 0.60],
    ['cap 15+ BOTH at 3u (not mute)', (r) => Number.isFinite(r.edge) && r.edge >= 15 && r.combo === 'BOTH E10+BOOST'],
  ];
  const body = bands.map(([name, fn]) => {
    const cells = [
      ['Last 2', last2],
      ['Last 7', week],
      ['Full T', tEra],
    ].map(([, rs]) => {
      const hit = liveOf(rs).filter(fn);
      if (name.startsWith('cap')) {
        const s = shrinkSaved(hit, 3);
        return `${s.n ? `${s.w}–${s.l}` : '—'} actual ${s.n ? signed(s.actual, 1) : '—'} → cap3 ${s.n ? signed(s.shrunk, 1) : '—'} · Δ ${s.n ? signed(s.delta, 1) : '—'}`;
      }
      const m = muteSaved(hit);
      return `${m.n ? `${m.w}–${m.l}` : '—'} actual ${m.n ? signed(m.actual, 1) : '—'} → mute 0 · save ${m.n ? signed(m.delta, 1) : '—'}`;
    });
    return [name, ...cells];
  });
  p(mdTable(['Rule', 'Last 2', 'Last 7', 'Full T'], body));
  p('');
}
{
  const hitT = liveOf(tEra).filter((r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5);
  const hit7 = liveOf(week).filter((r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5);
  const hit2 = liveOf(last2).filter((r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5);
  p('Shrink EDGE 0–5 to 2u vs mute:');
  p('');
  p(mdTable(
    ['', 'Last 2', 'Last 7', 'Full T'],
    [
      ['0–5 actual', fmt(agg(hit2)), fmt(agg(hit7)), fmt(agg(hitT))],
      ['if cap 2u',
        `${signed(shrinkSaved(hit2, 2).shrunk, 1)}u  Δ${signed(shrinkSaved(hit2, 2).delta, 1)}`,
        `${signed(shrinkSaved(hit7, 2).shrunk, 1)}u  Δ${signed(shrinkSaved(hit7, 2).delta, 1)}`,
        `${signed(shrinkSaved(hitT, 2).shrunk, 1)}u  Δ${signed(shrinkSaved(hitT, 2).delta, 1)}`],
      ['if mute 0u, save',
        signed(muteSaved(hit2).delta, 1) + 'u',
        signed(muteSaved(hit7).delta, 1) + 'u',
        signed(muteSaved(hitT).delta, 1) + 'u'],
    ],
  ));
  p('');
}

p('### Last 2 live tickets in EDGE 0–5');
p('');
p('```');
liveOf(last2)
  .filter((r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5)
  .sort((a, b) => (a.pnl || 0) - (b.pnl || 0))
  .forEach((r) => p(ticketLine(r)));
p('```');
p('');

p('### Full T live EDGE 15+ tickets');
p('');
p('```');
liveOf(tEra)
  .filter((r) => Number.isFinite(r.edge) && r.edge >= 15)
  .sort((a, b) => (a.pnl || 0) - (b.pnl || 0))
  .forEach((r) => p(ticketLine(r)));
p('```');
p('');

p('## 3. Overlap: 25–40% share × EDGE 0–5');
p('');
{
  const tests = [
    ['25–40% AND 0–5', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5],
    ['25–40% AND 5–10', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && Number.isFinite(r.edge) && r.edge >= 5 && r.edge < 10],
    ['25–40% AND 10+', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && Number.isFinite(r.edge) && r.edge >= 10],
    ['≥60% AND 0–5', (r) => Number.isFinite(r.share) && r.share >= 0.60 && Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5],
    ['≥60% AND 5–10', (r) => Number.isFinite(r.share) && r.share >= 0.60 && Number.isFinite(r.edge) && r.edge >= 5 && r.edge < 10],
    ['≥60% AND 10+', (r) => Number.isFinite(r.share) && r.share >= 0.60 && Number.isFinite(r.edge) && r.edge >= 10],
    ['0–5 AND arriving AND 4u+', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5 && r.arriving && r.u >= 3.5],
    ['25–40% AND arriving AND 4u+', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && r.arriving && r.u >= 3.5],
  ];
  p(mdTable(
    ['Combo', 'Last 2', 'Last 7', 'Full T', 'Steam era'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(liveOf(last2).filter(fn))),
      fmt(agg(liveOf(week).filter(fn))),
      fmt(agg(liveOf(tEra).filter(fn))),
      fmt(agg(liveOf(steam).filter(fn))),
    ]),
  ));
  p('');
}

p('## 4. What a policy would actually hook');
p('');
p('- **$ share is not a live dial.** Nothing in leftover / T / tape / fadeTop60 reads `% of board`. 25–40% tickets ship at path size. Mute stack is NOT already cutting this cell (T muted 25–40% CF is in the table above).');
p('- **EDGE stake ladder is frozen** (TAPE_SIZING_LIVE_FROM 2026-07-15). 0–5 still ships at path units. fadeTop60 still mutes opposed-elite WR only. Leftover uses EDGE≥10 + tape BOOST to floor 4u/5u, or mutes leftover sub-4.');
p('- **15+ looks dead because leftover BOTH floors the losers to 5u.** E10-only (no BOOST) is the live printer we already mute when leftover still sub-4.');
p('');

p('## 5. Policy options ranked by Full T save vs last-2 save (live CF)');
p('');
{
  const opts = [
    ['A. MUTE $ 25–40%', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
    ['B. CAP $ 25–40% at 2u', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40, 2],
    ['C. MUTE EDGE 0–5', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5],
    ['D. CAP EDGE 0–5 at 2u', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5, 2],
    ['E. MUTE 0–5 AND arriving', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5 && r.arriving],
    ['F. MUTE 0–5 AND 4u+', (r) => Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5 && r.u >= 3.5],
    ['G. MUTE 25–40% AND 0–5', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && Number.isFinite(r.edge) && r.edge >= 0 && r.edge < 5],
    ['H. MUTE 25–40% AND arriving', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40 && r.arriving],
    ['I. CAP 15+ BOTH at 3u', (r) => Number.isFinite(r.edge) && r.edge >= 15 && r.combo === 'BOTH E10+BOOST', 3],
    ['J. MUTE EDGE <5 (incl negative)', (r) => Number.isFinite(r.edge) && r.edge < 5],
    ['K. MUTE $ <40%', (r) => Number.isFinite(r.share) && r.share < 0.40],
  ];
  const body = opts.map(([name, fn, cap]) => {
    const cell = (rs) => liveOf(rs).filter(fn);
    const line = (rs) => {
      const hit = cell(rs);
      if (cap) {
        const s = shrinkSaved(hit, cap);
        return `${s.n ? `${s.w}–${s.l}` : '—'} Δ${s.n ? signed(s.delta, 1) : '—'}`;
      }
      const m = muteSaved(hit);
      return `${m.n ? `${m.w}–${m.l}` : '—'} save ${m.n ? signed(m.delta, 1) : '—'}`;
    };
    return [name, line(last2), line(week), line(tEra), line(steam)];
  });
  p(mdTable(['Option (on live tickets)', 'Last 2', 'Last 7', 'Full T', 'Steam era'], body));
  p('');
}

const text = out.join('\n');
mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/SHARE_EDGE_POLICY.md', text);
writeFileSync('/workspace/docs/SHARE_EDGE_POLICY_2026-09-17.md', text);
console.log(text);
console.error(`wrote share/edge policy dive through ${lastDate}`);
