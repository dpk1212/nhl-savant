#!/usr/bin/env node
/**
 * Full Policy-T era ledger — live book by unit tier + tweak impact,
 * then a separate policy-mute W/L book.
 *
 * Reads /opt/cursor/artifacts/steam_mute_revisit_rows.json (from
 * analyzeSteamMuteRevisit.mjs). Re-run that first if the pull is stale.
 *
 *   node scripts/analyzeTEraUnitTiers.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROWS = '/opt/cursor/artifacts/steam_mute_revisit_rows.json';
if (!existsSync(ROWS)) {
  console.error('missing', ROWS, '— run node scripts/analyzeSteamMuteRevisit.mjs first');
  process.exit(1);
}

const T_FROM = '2026-08-31';
const SHIP_FROM = '2026-09-09';
const BANDS = ['≤1u', '2–3u', '4u', '5u', '5.4u', '6u'];
const MUTE_ORDER = [
  'steam-tail', 'believed-cut', 'fail-open-sub4', 'maxsr-sub4', 'tape-weak',
  'qconv-q1', 'fools-gold-flat', 'winner_align_fade', 'ags-quality-veto',
  'top-crowded', 'ev-drift-edge', 'ev-lt2-no-steam', 'fav-juice', '(none)',
];

function wilson(w, n, z = 1.96) {
  if (!(n > 0)) return null;
  const p = w / n;
  const z2 = z * z;
  const den = 1 + z2 / n;
  const mid = p + z2 / (2 * n);
  const half = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
  return { lo: Math.max(0, (mid - half) / den), hi: Math.min(1, (mid + half) / den) };
}
function americanProfit(won, units, odds) {
  if (won == null || !(units > 0)) return 0;
  if (won) return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
  return -units;
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
function rowCells(a) {
  if (!a || !a.n) return ['0', '—', '—', '—', '—', '—', '—'];
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  const wr = a.wr == null ? '—' : `${a.wr}%`;
  const ci = a.wrLo != null ? `${a.wrLo}–${a.wrHi}` : '—';
  return [
    String(a.n),
    `${a.w}–${a.l}`,
    wr,
    ci,
    a.stake.toFixed(1),
    `${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}`,
    roi,
  ];
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
function ticketLine(r) {
  const res = r.won ? 'W' : 'L';
  const pnl = signed(r.pnl);
  const pre = Number.isFinite(r.uPre) ? String(r.uPre) : '—';
  const reason = r.steamReason || r.steamAction || r.mutedBy || '—';
  const left = r.leftoverReason ? ` leftover=${r.leftoverReason}` : '';
  return `${r.date}  ${(r.sport || '').padEnd(4)} ${(r.mkt || '').padEnd(6)} ${(r.team || '').slice(0, 28).padEnd(28)}  ${(r.path || '—').padEnd(16)}  live ${String(r.u).padStart(4)}u  pre ${pre.padStart(4)}u  ${String(r.odds).padStart(5)}  ${res} ${pnl.padStart(7)}  ${reason}${left}`;
}
function muteLine(r) {
  const res = r.won ? 'W' : 'L';
  const cf = signed(r.pnlPre);
  return `${r.date}  ${(r.sport || '').padEnd(4)} ${(r.mkt || '').padEnd(6)} ${(r.team || '').slice(0, 28).padEnd(28)}  ${(r.path || '—').padEnd(16)}  pre ${String(r.uPre).padStart(4)}u  ${String(r.odds).padStart(5)}  ${res} CF ${cf.padStart(7)}  ${r.mutedBy || '—'}${r.steamReason ? ` ${r.steamReason}` : ''}  ${r.steamCell || ''}${r.leftoverReason ? `  ${r.leftoverReason}` : ''}`;
}
function tweakOf(r) {
  if (r.steamAction === 'FLOOR') return 'FLOOR 1→2 arriving';
  if (r.steamAction === 'BOOST') return 'BOOST mid→4 arriving';
  if (Number(r.u) + 0.05 < Number(r.uPre)) return 'SHRINK climate/unlock';
  if (Number(r.u) > Number(r.uPre) + 0.05) return 'SIZE-UP other';
  if (r.band === '4u') return 'HOLD confirmed 4u';
  if (r.band === '5u') return 'HOLD 5u always';
  if (r.band === '5.4u' || r.band === '6u') return 'HOLD confirmed fat';
  return 'HOLD as-sized mid';
}

const all = JSON.parse(readFileSync(ROWS, 'utf8'));
const tEra = all.filter((r) => r.date >= T_FROM && r.won != null);
const live = tEra.filter((r) => r.live);
const mutes = tEra.filter((r) => !r.live);
const tPre = tEra.filter((r) => r.date < SHIP_FROM);
const post = tEra.filter((r) => r.date >= SHIP_FROM);
for (const r of live) r.tweak = tweakOf(r);

const out = [];
const p = (s = '') => out.push(s);

p('# Policy T era — live unit tiers, tweak impacts, and policy mutes');
p('');
p(`_T live **${T_FROM}–2026-09-15** (16 nights). Leftover A/B arriving HOLD + native 2–3u arriving → 4u from **${SHIP_FROM}**. Graded AGS-U only._`);
p('_Sign on mute CF / “left on table”: **positive = we cut winners. Negative = the mute saved us.**_');
p('');

p('## A. Live book — headline');
p('');
p(mdTable(
  ['Window', 'N', 'W–L', 'WR', 'Wilson', 'Stake', 'PnL', 'ROI', '/day', 'u/tix'],
  [
    ['Full T (Aug 31–Sep 15)', ...rowCells(agg(live)), String(agg(live).perDay), String(agg(live).meanU)],
    ['T only, pre-HOLD/bump (Aug 31–Sep 8)', ...rowCells(agg(tPre.filter((r) => r.live))), String(agg(tPre.filter((r) => r.live)).perDay), String(agg(tPre.filter((r) => r.live)).meanU)],
    ['HOLD+bump live (Sep 9–15)', ...rowCells(agg(post.filter((r) => r.live))), String(agg(post.filter((r) => r.live)).perDay), String(agg(post.filter((r) => r.live)).meanU)],
  ],
));
p('');

p('## A1. Live W/L by **published** unit tier');
p('');
p('What actually sat on the lock list. 1u is gone — T floors arriving leans to 2u and mutes the rest.');
p('');
function bandRows(rs, key = 'band') {
  return BANDS.map((b) => {
    const hit = rs.filter((r) => r[key] === b);
    const a = agg(hit);
    return [b, ...rowCells(a), a.n ? String(a.meanU) : '—'];
  });
}
p(mdTable(
  ['Live tier', 'N', 'W–L', 'WR', 'Wilson', 'Stake', 'PnL', 'ROI', 'u/tix'],
  bandRows(live, 'band'),
));
p('');
p(`**All live:** ${fmt(agg(live))}`);
p('');

p('## A2. Same tickets by **pre-tweak** unit tier (what the sizer wanted)');
p('');
p('Before T floor/boost and before climate/unlock shrink. This is the native size mix T saw.');
p('');
p(mdTable(
  ['Pre tier', 'N', 'W–L', 'WR', 'Wilson', 'Stake (live $)', 'PnL (live $)', 'ROI', 'mean live u'],
  bandRows(live, 'bandPre'),
));
p('');

p('## A3. Pre tier → live tier (where the tweaks moved tickets)');
p('');
{
  const rows = [];
  for (const pre of BANDS) {
    for (const liveB of BANDS) {
      const hit = live.filter((r) => r.bandPre === pre && r.band === liveB);
      if (!hit.length) continue;
      const moved = pre === liveB ? `${pre} (unchanged)` : `${pre} → ${liveB}`;
      const a = agg(hit);
      const extra = hit.reduce((s, r) => s + (r.u - r.uPre), 0);
      rows.push([moved, ...rowCells(a), extra === 0 ? '0' : signed(extra, 1)]);
    }
  }
  p(mdTable(
    ['Move', 'N', 'W–L', 'WR', 'Wilson', 'Stake', 'PnL', 'ROI', 'Δu vs pre'],
    rows,
  ));
}
p('');

p('## A4. Live W/L by tweak (the actual Policy T / Sep 9 overlays)');
p('');
p('Classified from `v8_steamTailAction` + live vs pre units. Stale `steamReason` stamps on HOLD tickets are ignored.');
p('');
{
  const order = [
    'FLOOR 1→2 arriving',
    'BOOST mid→4 arriving',
    'HOLD as-sized mid',
    'HOLD confirmed 4u',
    'HOLD 5u always',
    'HOLD confirmed fat',
    'SHRINK climate/unlock',
    'SIZE-UP other',
  ];
  const rows = [];
  for (const k of order) {
    const hit = live.filter((r) => r.tweak === k);
    if (!hit.length) continue;
    rows.push([k, ...rowCells(agg(hit))]);
  }
  p(mdTable(['Tweak', 'N', 'W–L', 'WR', 'Wilson', 'Stake', 'PnL', 'ROI'], rows));
}
p('');

p('### Impact — what the tweak changed vs doing nothing');
p('');
{
  const floors = live.filter((r) => r.steamAction === 'FLOOR');
  const boosts = live.filter((r) => r.steamAction === 'BOOST');
  const shrinks = live.filter((r) => r.tweak === 'SHRINK climate/unlock');
  const otherUp = live.filter((r) => r.tweak === 'SIZE-UP other');

  const floorAt1 = floors.map((r) => ({
    ...r, u1: 1, p1: americanProfit(r.won, 1, r.odds),
  }));
  const boostAtPre = boosts.map((r) => ({
    ...r, uN: r.uPre, pN: americanProfit(r.won, r.uPre, r.odds),
  }));
  const shrinkAtPre = shrinks.map((r) => ({
    ...r, uN: r.uPre, pN: americanProfit(r.won, r.uPre, r.odds),
  }));

  p(mdTable(
    ['Tweak', 'N', 'W–L', 'Live PnL', 'CF if no tweak', 'Extra $ from tweak', 'Extra stake'],
    [
      [
        'FLOOR 1→2 (vs muted at 0u)',
        String(floors.length),
        `${agg(floors).w}–${agg(floors).l}`,
        signed(agg(floors).pnl),
        '+0 (would not ship)',
        signed(agg(floors).pnl),
        signed(agg(floors).stake, 1),
      ],
      [
        'FLOOR 1→2 (vs shipping 1u)',
        String(floors.length),
        `${agg(floors).w}–${agg(floors).l}`,
        signed(agg(floors).pnl),
        signed(agg(floorAt1, 'u1', 'p1').pnl),
        signed(agg(floors).pnl - agg(floorAt1, 'u1', 'p1').pnl),
        signed(agg(floors).stake - agg(floorAt1, 'u1', 'p1').stake, 1),
      ],
      [
        'BOOST mid→4 (vs native 2–3u)',
        String(boosts.length),
        `${agg(boosts).w}–${agg(boosts).l}`,
        signed(agg(boosts).pnl),
        signed(agg(boostAtPre, 'uN', 'pN').pnl),
        signed(agg(boosts).pnl - agg(boostAtPre, 'uN', 'pN').pnl),
        signed(agg(boosts).stake - agg(boostAtPre, 'uN', 'pN').stake, 1),
      ],
      [
        'SHRINK climate/unlock (vs pre size)',
        String(shrinks.length),
        `${agg(shrinks).w}–${agg(shrinks).l}`,
        signed(agg(shrinks).pnl),
        signed(agg(shrinkAtPre, 'uN', 'pN').pnl),
        signed(agg(shrinks).pnl - agg(shrinkAtPre, 'uN', 'pN').pnl),
        signed(agg(shrinks).stake - agg(shrinkAtPre, 'uN', 'pN').stake, 1),
      ],
      [
        'SIZE-UP other (2u→4u HOLD, not T BOOST)',
        String(otherUp.length),
        otherUp.length ? `${agg(otherUp).w}–${agg(otherUp).l}` : '—',
        otherUp.length ? signed(agg(otherUp).pnl) : '—',
        otherUp.length ? signed(otherUp.reduce((s, r) => s + americanProfit(r.won, r.uPre, r.odds), 0)) : '—',
        otherUp.length ? signed(agg(otherUp).pnl - otherUp.reduce((s, r) => s + americanProfit(r.won, r.uPre, r.odds), 0)) : '—',
        otherUp.length ? signed(agg(otherUp).stake - otherUp.reduce((s, r) => s + r.uPre, 0), 1) : '—',
      ],
    ],
  ));
}
p('');

p('Leftover HOLD (Sep 9+) is not a size overlay — it *unmutes* arriving stubs so T can floor/boost them. Tickets leftover would have killed (`leftoverReason` set, `uPre < 4`, arriving, live):');
{
  const saved = live.filter((r) => r.date >= SHIP_FROM && r.abArr && r.leftoverReason && r.uPre < 4);
  p('');
  p(`**${fmt(agg(saved))}**`);
  p('');
  if (saved.length) {
    p('```');
    for (const r of saved.slice().sort((a, b) => a.date.localeCompare(b.date) || a.team.localeCompare(b.team))) {
      p(ticketLine(r));
    }
    p('```');
  }
}
p('');

p('## A5. Live unit tier × window');
p('');
p('### Aug 31–Sep 8 (T live, leftover still killing arriving)');
p(mdTable(
  ['Live tier', 'N', 'W–L', 'WR', 'Wilson', 'Stake', 'PnL', 'ROI', 'u/tix'],
  bandRows(tPre.filter((r) => r.live), 'band'),
));
p('');
p('### Sep 9–15 (HOLD + bump live)');
p(mdTable(
  ['Live tier', 'N', 'W–L', 'WR', 'Wilson', 'Stake', 'PnL', 'ROI', 'u/tix'],
  bandRows(post.filter((r) => r.live), 'band'),
));
p('');

p('## A6. Live unit tier × arriving');
p('');
{
  const rows = [];
  for (const b of BANDS) {
    const band = live.filter((r) => r.band === b);
    if (!band.length) continue;
    const arr = band.filter((r) => r.abArr);
    const rest = band.filter((r) => !r.abArr);
    rows.push([`${b} arriving`, ...rowCells(agg(arr))]);
    rows.push([`${b} not arriving`, ...rowCells(agg(rest))]);
  }
  p(mdTable(['Cell', 'N', 'W–L', 'WR', 'Wilson', 'Stake', 'PnL', 'ROI'], rows));
}
p('');

p('## A7. Every live T-era ticket, by published tier');
p('');
for (const b of BANDS) {
  const hit = live.filter((r) => r.band === b)
    .sort((a, c) => a.date.localeCompare(c.date) || String(a.team).localeCompare(String(c.team)));
  if (!hit.length) continue;
  p(`### ${b}  —  ${fmt(agg(hit))}`);
  p('');
  p('```');
  for (const r of hit) p(`${ticketLine(r)}  [${r.tweak}]`);
  p('```');
  p('');
}

p('---');
p('');
p('# B. Policy mutes — separate book (counterfactual at pre-policy units)');
p('');
p('These tickets graded 0u. CF sizes them at `v8_unitsPre*` so T cannot hide what it cut. Positive CF = left on the table.');
p('');
p(`Muted T-era: **${fmt(agg(mutes, 'uPre', 'pnlPre'))}** · ${agg(mutes).perDay}/day vs live ${agg(live).perDay}/day.`);
p('');

p('## B1. Every policy mute, T-era');
p('');
{
  const rows = [];
  const seen = new Set();
  for (const k of MUTE_ORDER) {
    const hit = mutes.filter((r) => (r.mutedBy || '(none)') === k);
    if (!hit.length) continue;
    seen.add(k);
    const a = agg(hit, 'uPre', 'pnlPre');
    const note = k === 'steam-tail' ? 'Policy T'
      : (k === 'believed-cut' || k === 'fail-open-sub4') ? 'Leftover'
        : k === '(none)' ? 'Unlabeled 0u (mostly MONITORING)'
          : 'Other overlay';
    rows.push([k, note, ...rowCells(a)]);
  }
  for (const k of [...new Set(mutes.map((r) => r.mutedBy || '(none)'))]) {
    if (seen.has(k)) continue;
    const hit = mutes.filter((r) => (r.mutedBy || '(none)') === k);
    rows.push([k, 'Other overlay', ...rowCells(agg(hit, 'uPre', 'pnlPre'))]);
  }
  p(mdTable(
    ['mutedBy', 'Family', 'N', 'W–L', 'WR', 'Wilson', 'Stake CF', 'PnL CF', 'ROI'],
    rows,
  ));
}
p('');
p(`**All mutes:** ${fmt(agg(mutes, 'uPre', 'pnlPre'))}`);
p('');

p('## B2. Policy T steam-tail mutes by reason');
p('');
{
  const sm = mutes.filter((r) => r.mutedBy === 'steam-tail');
  const reasons = ['lean_no_arriving', 'unconfirmed_4u', 'unconfirmed_fat'];
  const rows = reasons.map((k) => {
    const hit = sm.filter((r) => r.steamReason === k);
    return [k, ...rowCells(agg(hit, 'uPre', 'pnlPre'))];
  });
  rows.push(['**all steam-tail**', ...rowCells(agg(sm, 'uPre', 'pnlPre'))]);
  p(mdTable(['Reason', 'N', 'W–L', 'WR', 'Wilson', 'Stake CF', 'PnL CF', 'ROI'], rows));
}
p('');
p('### Split by window');
p('');
{
  const rows = [];
  for (const [label, rs] of [['Aug 31–Sep 8', tPre], ['Sep 9–15', post]]) {
    const sm = rs.filter((r) => !r.live && r.mutedBy === 'steam-tail');
    for (const k of ['lean_no_arriving', 'unconfirmed_4u', 'unconfirmed_fat']) {
      const hit = sm.filter((r) => r.steamReason === k);
      rows.push([`${label} · ${k}`, ...rowCells(agg(hit, 'uPre', 'pnlPre'))]);
    }
  }
  p(mdTable(['Cell', 'N', 'W–L', 'WR', 'Wilson', 'Stake CF', 'PnL CF', 'ROI'], rows));
}
p('');

p('### `lean_no_arriving` — every muted 1u');
{
  const hit = mutes.filter((r) => r.mutedBy === 'steam-tail' && r.steamReason === 'lean_no_arriving')
    .sort((a, b) => a.date.localeCompare(b.date));
  p('');
  p(`**${fmt(agg(hit, 'uPre', 'pnlPre'))}**`);
  p('');
  p('```');
  for (const r of hit) p(muteLine(r));
  p('```');
  p('');
}
p('### `unconfirmed_4u` — every muted 4u');
{
  const hit = mutes.filter((r) => r.mutedBy === 'steam-tail' && r.steamReason === 'unconfirmed_4u')
    .sort((a, b) => a.date.localeCompare(b.date));
  p('');
  p(`**${fmt(agg(hit, 'uPre', 'pnlPre'))}**`);
  p('');
  p('```');
  for (const r of hit) p(muteLine(r));
  p('```');
  p('');
}
p('### `unconfirmed_fat` — every muted 5.4u+');
{
  const hit = mutes.filter((r) => r.mutedBy === 'steam-tail' && r.steamReason === 'unconfirmed_fat')
    .sort((a, b) => a.date.localeCompare(b.date));
  p('');
  p(`**${fmt(agg(hit, 'uPre', 'pnlPre'))}**`);
  p('');
  p('```');
  for (const r of hit) p(muteLine(r));
  p('```');
  p('');
}

p('## B3. Leftover mutes (`believed-cut` / `fail-open-sub4`)');
p('');
{
  const lo = mutes.filter((r) => r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4');
  const rows = [
    ['believed-cut all', ...rowCells(agg(lo.filter((r) => r.mutedBy === 'believed-cut'), 'uPre', 'pnlPre'))],
    ['  · no steam', ...rowCells(agg(lo.filter((r) => r.mutedBy === 'believed-cut' && !r.steamOn), 'uPre', 'pnlPre'))],
    ['  · A/B already-on', ...rowCells(agg(lo.filter((r) => r.mutedBy === 'believed-cut' && r.steamCell === 'ab_already_on'), 'uPre', 'pnlPre'))],
    ['  · A/B arriving before HOLD (Sep 9)', ...rowCells(agg(lo.filter((r) => r.mutedBy === 'believed-cut' && r.abArr && r.date < SHIP_FROM), 'tAtPaper', 'pnlTPaper'))],
    ['  · A/B arriving after HOLD (leak)', ...rowCells(agg(lo.filter((r) => r.mutedBy === 'believed-cut' && r.abArr && r.date >= SHIP_FROM), 'tAtPaper', 'pnlTPaper'))],
    ['fail-open-sub4 all', ...rowCells(agg(lo.filter((r) => r.mutedBy === 'fail-open-sub4'), 'uPre', 'pnlPre'))],
    ['  · T would still mute (1u lean)', ...rowCells(agg(lo.filter((r) => r.mutedBy === 'fail-open-sub4' && !(r.tAtPaper > 0)), 'uPre', 'pnlPre'))],
    ['  · T would ship (2–3u / floor)', ...rowCells(agg(lo.filter((r) => r.mutedBy === 'fail-open-sub4' && r.tAtPaper > 0), 'tAtPaper', 'pnlTPaper'))],
    ['**leftover all**', ...rowCells(agg(lo, 'uPre', 'pnlPre'))],
  ];
  p(mdTable(['Cell', 'N', 'W–L', 'WR', 'Wilson', 'Stake CF', 'PnL CF', 'ROI'], rows));
}
p('');
p('### Every leftover mute');
{
  const hit = mutes.filter((r) => r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4')
    .sort((a, b) => a.date.localeCompare(b.date) || String(a.mutedBy).localeCompare(String(b.mutedBy)));
  p('');
  p('```');
  for (const r of hit) p(muteLine(r));
  p('```');
  p('');
}

p('## B4. Other overlays (not steam / leftover) — T-era CF');
p('');
{
  const skip = new Set(['steam-tail', 'believed-cut', 'fail-open-sub4']);
  const keys = [...new Set(mutes.map((r) => r.mutedBy || '(none)'))]
    .filter((k) => !skip.has(k))
    .sort((a, b) => mutes.filter((r) => (r.mutedBy || '(none)') === b).length
      - mutes.filter((r) => (r.mutedBy || '(none)') === a).length);
  const rows = keys.map((k) => {
    const hit = mutes.filter((r) => (r.mutedBy || '(none)') === k);
    return [k, ...rowCells(agg(hit, 'uPre', 'pnlPre'))];
  });
  p(mdTable(['mutedBy', 'N', 'W–L', 'WR', 'Wilson', 'Stake CF', 'PnL CF', 'ROI'], rows));
}
p('');
p('`(none)` is almost all path MONITORING at ≤1u with tape PASS — never published, no mutedBy stamp. Not a steam gate.');
p('');

p('## B5. If we had shipped the mute (T-era live + that CF)');
p('');
{
  const liveP = agg(live);
  const add = (label, extra, uKey = 'uPre', pKey = 'pnlPre') => {
    const a = agg(extra, uKey, pKey);
    const n = liveP.n + a.n;
    const pnl = liveP.pnl + a.pnl;
    return [label, String(a.n), `${a.w}–${a.l}`, signed(a.pnl), String(n), signed(pnl)];
  };
  p(mdTable(
    ['Add back', 'N', 'W–L', 'CF PnL', 'Combined N', 'Combined PnL'],
    [
      ['(actual live book)', String(liveP.n), `${liveP.w}–${liveP.l}`, signed(liveP.pnl), String(liveP.n), signed(liveP.pnl)],
      add('lean_no_arriving 1u', mutes.filter((r) => r.steamReason === 'lean_no_arriving' && r.mutedBy === 'steam-tail')),
      add('unconfirmed 4u', mutes.filter((r) => r.steamReason === 'unconfirmed_4u' && r.mutedBy === 'steam-tail')),
      add('unconfirmed fat', mutes.filter((r) => r.steamReason === 'unconfirmed_fat' && r.mutedBy === 'steam-tail')),
      add('all steam-tail', mutes.filter((r) => r.mutedBy === 'steam-tail')),
      add('believed-cut no-steam', mutes.filter((r) => r.mutedBy === 'believed-cut' && !r.steamOn)),
      add('fail-open that T would ship', mutes.filter((r) => r.mutedBy === 'fail-open-sub4' && r.tAtPaper > 0), 'tAtPaper', 'pnlTPaper'),
      add('all leftover', mutes.filter((r) => r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4')),
      add('maxsr-sub4', mutes.filter((r) => r.mutedBy === 'maxsr-sub4')),
      add('tape-weak', mutes.filter((r) => r.mutedBy === 'tape-weak')),
    ],
  ));
}
p('');

p('## B6. Daily board — live vs mutes');
p('');
{
  const dates = [...new Set(tEra.map((r) => r.date))].sort();
  const rows = dates.map((d) => {
    const day = tEra.filter((r) => r.date === d);
    const L = agg(day.filter((r) => r.live));
    const M = agg(day.filter((r) => !r.live), 'uPre', 'pnlPre');
    const st = day.filter((r) => !r.live && r.mutedBy === 'steam-tail').length;
    const lo = day.filter((r) => !r.live && (r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4')).length;
    return [
      d,
      String(L.n || 0),
      L.n ? `${L.w}–${L.l}` : '—',
      L.n ? signed(L.pnl) : '—',
      String(M.n || 0),
      M.n ? `${M.w}–${M.l}` : '—',
      M.n ? signed(M.pnl) : '—',
      String(st),
      String(lo),
    ];
  });
  p(mdTable(
    ['Date', 'Live N', 'Live W–L', 'Live PnL', 'Muted N', 'Muted W–L', 'Muted CF', 'steam-tail', 'leftover'],
    rows,
  ));
}
p('');

const text = `${out.join('\n')}\n`;
mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/steam_t_era_unit_tiers.md', text);
writeFileSync(join(ROOT, 'docs/STEAM_T_ERA_UNIT_TIERS_2026-09-16.md'), text);
console.log(text);
console.error(`wrote docs/STEAM_T_ERA_UNIT_TIERS_2026-09-16.md · live ${live.length} muted ${mutes.length}`);
