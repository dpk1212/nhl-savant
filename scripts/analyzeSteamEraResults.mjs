#!/usr/bin/env node
/**
 * Steam-era RESULTS dump — last 2 days + last 7 vs the rest of T.
 *
 * Reads /opt/cursor/artifacts/steam_mute_revisit_rows.json
 * (refresh with `node scripts/analyzeSteamMuteRevisit.mjs` first).
 *
 *   node scripts/analyzeSteamEraResults.mjs
 *
 * No policy. Numbers only.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const ROWS = '/opt/cursor/artifacts/steam_mute_revisit_rows.json';
if (!existsSync(ROWS)) {
  console.error('missing', ROWS, '— run node scripts/analyzeSteamMuteRevisit.mjs first');
  process.exit(1);
}

const T_FROM = '2026-08-31';
const SHIP_FROM = '2026-09-09';
const PAPER_HI = '2026-09-08';

function wilson(w, n, z = 1.96) {
  if (!(n > 0)) return null;
  const p = w / n;
  const z2 = z * z;
  const den = 1 + z2 / n;
  const mid = p + z2 / (2 * n);
  const half = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
  return { lo: Math.max(0, (mid - half) / den), hi: Math.min(1, (mid + half) / den) };
}
function agg(rows, uKey = 'u', pKey = 'pnl') {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  const days = new Set();
  for (const r of rows) {
    if (r.won == null) continue;
    n++;
    stake += Number(r[uKey]) || 0;
    pnl += Number.isFinite(Number(r[pKey])) ? Number(r[pKey]) : 0;
    if (r.won === 1) w++;
    else l++;
    if (r.date) days.add(r.date);
  }
  const ci = wilson(w, n);
  const dayN = days.size || 0;
  return {
    n, w, l,
    stake: +stake.toFixed(2),
    pnl: +pnl.toFixed(2),
    wr: n ? +((w / n) * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    wrHi: ci ? +(ci.hi * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
    days: dayN,
    perDay: dayN ? +(n / dayN).toFixed(2) : null,
    meanU: n ? +(stake / n).toFixed(2) : null,
  };
}
function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  const wr = a.wr == null ? '—' : `${a.wr}%`;
  const band = a.wrLo != null ? ` (${a.wrLo}–${a.wrHi})` : '';
  return `${a.n} · ${a.w}–${a.l} · ${wr}${band} · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u · ${roi}`;
}
function mdTable(headers, rows) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
}
function signed(n, d = 2) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return `${x >= 0 ? '+' : ''}${x.toFixed(d)}`;
}
function liveOf(rs) { return rs.filter((r) => r.live); }
function muteOf(rs) { return rs.filter((r) => !r.live && r.won != null); }
function win(rs, lo, hi) { return rs.filter((r) => r.date >= lo && r.date <= hi); }
function group(rs, keyFn) {
  const m = new Map();
  for (const r of rs) {
    const k = keyFn(r);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(r);
  }
  return [...m.entries()];
}
function ticketLine(r, { mute = false } = {}) {
  const res = r.won ? 'W' : 'L';
  const pnl = mute ? signed(r.pnlPre) : signed(r.pnl);
  const pre = Number.isFinite(r.uPre) ? String(r.uPre) : '—';
  const why = mute
    ? `${r.mutedBy || '—'} ${r.steamReason || ''}`.trim()
    : `${r.steamAction || r.steamReason || r.path || '—'}`.trim();
  const left = r.leftoverReason ? ` leftover=${r.leftoverReason}` : '';
  return `${r.date}  ${(r.sport || '').padEnd(4)} ${(r.mkt || '').padEnd(6)} ${(r.team || '').slice(0, 32).padEnd(32)}  ${(r.path || '—').padEnd(16)}  ${mute ? 'pre' : 'live'} ${String(mute ? r.uPre : r.u).padStart(4)}u  pre ${pre.padStart(4)}u  ${String(r.odds).padStart(5)}  ${res} ${pnl.padStart(7)}  ${why}${left}`;
}

const all = JSON.parse(readFileSync(ROWS, 'utf8'));
const dates = [...new Set(all.map((r) => r.date))].sort();
const lastDate = dates[dates.length - 1];
const tEra = all.filter((r) => r.date >= T_FROM && r.won != null);

// Last two *graded* calendar dates that have live tickets (skip empty days).
const liveDates = [...new Set(liveOf(tEra).map((r) => r.date))].sort();
const d2 = liveDates.slice(-2);
const last2Lo = d2[0];
const last2Hi = d2[d2.length - 1];
// Last 7 calendar days from the newest graded date (inclusive).
function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const weekLo = addDays(lastDate, -6);
const weekHi = lastDate;

const last2 = win(tEra, last2Lo, last2Hi);
const week = win(tEra, weekLo, weekHi);
const tPre = win(tEra, T_FROM, PAPER_HI);
const extra = win(tEra, SHIP_FROM, lastDate);
const beforeWeek = tEra.filter((r) => r.date < weekLo);
const restOfT = tEra.filter((r) => r.date < last2Lo);

const out = [];
const p = (s = '') => out.push(s);

p('# Steam-era RESULTS — last 2 days and this week');
p('');
p(`_Pulled rows through **${lastDate}**. T from ${T_FROM}. Last 2 live dates: **${last2Lo}–${last2Hi}**. Last 7 calendar days: **${weekLo}–${weekHi}**. Graded AGS-U only._`);
p('_Mute CF: **positive = we cut winners. Negative = the mute saved us.**_');
p('_**No policy in this file.**_');
p('');

p('## Direct numbers');
p('');
p(mdTable(
  ['Window', 'Live', 'Mute CF'],
  [
    [`T start → day before last 2 (${T_FROM}–${addDays(last2Lo, -1)})`, fmt(agg(liveOf(restOfT))), fmt(agg(muteOf(restOfT), 'uPre', 'pnlPre'))],
    [`Last 2 days (${last2Lo}–${last2Hi})`, fmt(agg(liveOf(last2))), fmt(agg(muteOf(last2), 'uPre', 'pnlPre'))],
    [`Last 7 days (${weekLo}–${weekHi})`, fmt(agg(liveOf(week))), fmt(agg(muteOf(week), 'uPre', 'pnlPre'))],
    [`T pre-HOLD (${T_FROM}–${PAPER_HI})`, fmt(agg(liveOf(tPre))), fmt(agg(muteOf(tPre), 'uPre', 'pnlPre'))],
    [`HOLD+bump live (${SHIP_FROM}–${lastDate})`, fmt(agg(liveOf(extra))), fmt(agg(muteOf(extra), 'uPre', 'pnlPre'))],
    [`Full T (${T_FROM}–${lastDate})`, fmt(agg(liveOf(tEra))), fmt(agg(muteOf(tEra), 'uPre', 'pnlPre'))],
  ],
));
p('');

p('## 1. Daily live board (T era)');
p('');
p('| Date | N | W–L | WR | Stake | PnL | ROI | Muted | Mute CF | steam-tail | leftover |');
p('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
{
  const ds = [...new Set(tEra.map((r) => r.date))].sort();
  for (const d of ds) {
    const day = tEra.filter((r) => r.date === d);
    const live = liveOf(day);
    const a = agg(live);
    const mutes = muteOf(day);
    const mc = agg(mutes, 'uPre', 'pnlPre');
    const st = mutes.filter((r) => r.mutedBy === 'steam-tail').length;
    const lo = mutes.filter((r) => r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4').length;
    const mark = (d >= last2Lo && d <= last2Hi) ? ' ← 2d' : (d >= weekLo ? ' ← wk' : '');
    p(`| ${d}${mark} | ${a.n} | ${a.n ? `${a.w}–${a.l}` : '—'} | ${a.wr ?? '—'}% | ${a.n ? a.stake.toFixed(1) : '—'} | ${a.n ? signed(a.pnl) : '—'} | ${a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`} | ${mutes.length} | ${mc.n ? signed(mc.pnl) : '—'} | ${st} | ${lo} |`);
  }
}
p('');

p('## 2. Last 2 days — live tickets (worst first)');
p('');
{
  const live = liveOf(last2).slice().sort((a, b) => (a.pnl || 0) - (b.pnl || 0));
  p(`**${fmt(agg(live))}**`);
  p('');
  p('```');
  for (const r of live) p(ticketLine(r));
  p('```');
  p('');
}
p('### Last 2 days — by sport / market / unit / arriving');
p('');
function sliceTable(rs, title) {
  p(`**${title}**`);
  p('');
  const live = liveOf(rs);
  const rows = [];
  for (const [k, v] of group(live, (r) => r.sport || '?').sort((a, b) => agg(b[1]).pnl - agg(a[1]).pnl)) {
    rows.push([`sport ${k}`, ...cells(agg(v))]);
  }
  for (const [k, v] of group(live, (r) => r.mkt || '?').sort((a, b) => b[1].length - a[1].length)) {
    rows.push([`mkt ${k}`, ...cells(agg(v))]);
  }
  for (const [k, v] of group(live, (r) => r.band || '?').sort((a, b) => a[0].localeCompare(b[0]))) {
    rows.push([`live ${k}`, ...cells(agg(v))]);
  }
  rows.push(['arriving', ...cells(agg(live.filter((r) => r.arriving)))]);
  rows.push(['already-on / rest', ...cells(agg(live.filter((r) => !r.arriving)))]);
  p(mdTable(['Slice', 'N', 'W–L', 'WR', 'Stake', 'PnL', 'ROI'], rows));
  p('');
}
function cells(a) {
  if (!a.n) return ['0', '—', '—', '—', '—', '—'];
  return [
    String(a.n),
    `${a.w}–${a.l}`,
    `${a.wr}%`,
    a.stake.toFixed(1),
    signed(a.pnl),
    a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`,
  ];
}
sliceTable(last2, 'Last 2 days');

p('## 3. Last 7 days — live tickets by day, then worst 15');
p('');
{
  const live = liveOf(week);
  p(`**${fmt(agg(live))}**`);
  p('');
  p(mdTable(
    ['Date', 'N', 'W–L', 'WR', 'Stake', 'PnL', 'ROI'],
    [...new Set(week.map((r) => r.date))].sort().map((d) => {
      const a = agg(liveOf(week.filter((r) => r.date === d)));
      return [d, ...cells(a)];
    }),
  ));
  p('');
  p('Worst 15 live tickets this week:');
  p('');
  p('```');
  for (const r of live.slice().sort((a, b) => (a.pnl || 0) - (b.pnl || 0)).slice(0, 15)) {
    p(ticketLine(r));
  }
  p('```');
  p('');
  p('Best 10 live tickets this week:');
  p('');
  p('```');
  for (const r of live.slice().sort((a, b) => (b.pnl || 0) - (a.pnl || 0)).slice(0, 10)) {
    p(ticketLine(r));
  }
  p('```');
  p('');
}
sliceTable(week, 'Last 7 days');

p('## 4. Last 7 vs the rest of T — is the mix broken or just cold?');
p('');
{
  const slices = [
    ['HOLD as-sized 2–3u', (r) => r.live && r.band === '2–3u' && r.steamAction !== 'FLOOR' && r.steamAction !== 'BOOST' && !(Number(r.u) + 0.05 < Number(r.uPre))],
    ['BOOST mid→4 arriving', (r) => r.live && r.steamAction === 'BOOST'],
    ['FLOOR 1→2 arriving', (r) => r.live && r.steamAction === 'FLOOR'],
    ['live 4u', (r) => r.live && r.band === '4u'],
    ['live 5u+', (r) => r.live && Number(r.u) >= 4.75],
    ['arriving live', (r) => r.live && r.arriving],
    ['MLB live', (r) => r.live && r.sport === 'MLB'],
    ['NFL live', (r) => r.live && r.sport === 'NFL'],
    ['CFB live', (r) => r.live && (r.sport === 'NCAAF' || r.sport === 'CFB')],
    ['ML live', (r) => r.live && r.mkt === 'ML'],
    ['SPREAD live', (r) => r.live && r.mkt === 'SPREAD'],
    ['TOTAL live', (r) => r.live && r.mkt === 'TOTAL'],
  ];
  const rows = [];
  for (const [name, fn] of slices) {
    const a = agg(tPre.filter(fn));
    const b = agg(week.filter(fn));
    const c = agg(last2.filter(fn));
    rows.push([
      name,
      a.n ? fmt(a) : '—',
      b.n ? fmt(b) : '—',
      c.n ? fmt(c) : '—',
    ]);
  }
  p(mdTable(['Cell', `T pre-HOLD ${T_FROM}–${PAPER_HI}`, `Last 7 ${weekLo}–${weekHi}`, `Last 2 ${last2Lo}–${last2Hi}`], rows));
  p('');
}

p('## 5. Mute stack on the alarming windows — did the cut save us?');
p('');
function muteBlock(rs, label) {
  const mutes = muteOf(rs);
  p(`### ${label} — mute CF ${fmt(agg(mutes, 'uPre', 'pnlPre'))}`);
  p('');
  const rows = group(mutes, (r) => r.mutedBy || '(none)')
    .map(([k, v]) => [k, ...cells(agg(v, 'uPre', 'pnlPre'))])
    .sort((a, b) => Number(b[1]) - Number(a[1]));
  p(mdTable(['mutedBy', 'N', 'W–L', 'WR', 'Stake(pre)', 'CF', 'ROI'], rows));
  p('');
  const steam = mutes.filter((r) => r.mutedBy === 'steam-tail');
  if (steam.length) {
    const reasons = group(steam, (r) => r.steamReason || '(none)')
      .map(([k, v]) => [k, ...cells(agg(v, 'uPre', 'pnlPre'))])
      .sort((a, b) => Number(b[1]) - Number(a[1]));
    p('steam-tail reasons:');
    p('');
    p(mdTable(['reason', 'N', 'W–L', 'WR', 'Stake(pre)', 'CF', 'ROI'], reasons));
    p('');
  }
  const leftover = mutes.filter((r) => r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4');
  if (leftover.length) {
    p('leftover tickets (believed-cut / fail-open-sub4):');
    p('');
    p('```');
    for (const r of leftover.slice().sort((a, b) => a.date.localeCompare(b.date) || (b.pnlPre || 0) - (a.pnlPre || 0))) {
      p(ticketLine(r, { mute: true }));
    }
    p('```');
    p('');
  }
}
muteBlock(last2, `Last 2 days ${last2Lo}–${last2Hi}`);
muteBlock(week, `Last 7 days ${weekLo}–${weekHi}`);

p('## 6. Steam-tail / leftover watches on these windows');
p('');
{
  const watches = [
    ['steam-tail lean_no_arriving', (r) => !r.live && r.mutedBy === 'steam-tail' && (r.steamReason === 'lean_no_arriving' || r.bandPre === '≤1u')],
    ['steam-tail unconfirmed 4u', (r) => !r.live && r.mutedBy === 'steam-tail' && r.steamReason === 'unconfirmed_4u'],
    ['steam-tail unconfirmed fat', (r) => !r.live && r.mutedBy === 'steam-tail' && r.steamReason === 'unconfirmed_fat'],
    ['fail-open-sub4 mute', (r) => !r.live && r.mutedBy === 'fail-open-sub4'],
    ['believed-cut mute', (r) => !r.live && r.mutedBy === 'believed-cut'],
    ['leftover×arriving mute', (r) => !r.live && (r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4') && r.arriving],
  ];
  p(mdTable(
    ['Watch', `Last 2 CF`, `Last 7 CF`, `Full T CF`],
    watches.map(([name, fn]) => [
      name,
      fmt(agg(last2.filter(fn), 'uPre', 'pnlPre')),
      fmt(agg(week.filter(fn), 'uPre', 'pnlPre')),
      fmt(agg(tEra.filter(fn), 'uPre', 'pnlPre')),
    ]),
  ));
  p('');
}

p('## 7. Cumulative live PnL (T era)');
p('');
p('| Through | N | W–L | PnL | ROI |');
p('| --- | --- | --- | --- | --- |');
{
  let run = [];
  for (const d of [...new Set(tEra.map((r) => r.date))].sort()) {
    run = run.concat(liveOf(tEra.filter((r) => r.date === d)));
    const a = agg(run);
    p(`| ${d} | ${a.n} | ${a.w}–${a.l} | ${signed(a.pnl)} | ${a.roi >= 0 ? '+' : ''}${a.roi}% |`);
  }
}
p('');

const payload = {
  generatedAt: new Date().toISOString(),
  lastDate,
  last2: { lo: last2Lo, hi: last2Hi, live: agg(liveOf(last2)), mute: agg(muteOf(last2), 'uPre', 'pnlPre') },
  week: { lo: weekLo, hi: weekHi, live: agg(liveOf(week)), mute: agg(muteOf(week), 'uPre', 'pnlPre') },
  tEra: { live: agg(liveOf(tEra)), mute: agg(muteOf(tEra), 'uPre', 'pnlPre') },
  tPre: { live: agg(liveOf(tPre)) },
  extra: { live: agg(liveOf(extra)) },
};

mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/STEAM_ERA_RESULTS.md', `${out.join('\n')}\n`);
writeFileSync('/opt/cursor/artifacts/steam_era_results.json', JSON.stringify(payload, null, 2));
console.log(out.join('\n'));
console.error(`wrote artifacts · last2 ${last2Lo}–${last2Hi} week ${weekLo}–${weekHi} through ${lastDate}`);
