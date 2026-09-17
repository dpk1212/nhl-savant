#!/usr/bin/env node
/**
 * All-wallet $ share × proven $ share — does proven $ flip the board?
 *
 *   node scripts/analyzeProvenShareFlip.mjs
 *
 * Reads /opt/cursor/artifacts/share_mute_threshold_rows.json
 * (share = all invested, shareP = proven-only invested).
 * No policy.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const rows = JSON.parse(readFileSync('/opt/cursor/artifacts/share_mute_threshold_rows.json', 'utf8'));

function wilson(w, n, z = 1.96) {
  if (!(n > 0)) return null;
  const p = w / n;
  const z2 = z * z;
  const den = 1 + z2 / n;
  const mid = p + z2 / (2 * n);
  const half = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
  return { lo: Math.max(0, (mid - half) / den), hi: Math.min(1, (mid + half) / den) };
}
function agg(rs) {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  for (const r of rs) {
    if (!r.live || r.won == null) continue;
    n++;
    stake += Number(r.u) || 0;
    pnl += Number.isFinite(Number(r.pnl)) ? Number(r.pnl) : 0;
    if (r.won) w++; else l++;
  }
  const ci = wilson(w, n);
  return {
    n, w, l,
    stake: +stake.toFixed(1),
    pnl: +pnl.toFixed(1),
    wr: n ? +((w / n) * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
  };
}
function fmt(a) {
  if (!a || !a.n) return '—';
  return `${a.n} · ${a.w}–${a.l} · ${a.wr}% · ${a.stake}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl}u · ${a.roi >= 0 ? '+' : ''}${a.roi}%`;
}
function short(a) {
  if (!a || !a.n) return '—';
  return `${a.w}–${a.l} ${a.pnl >= 0 ? '+' : ''}${Math.round(a.pnl)}u / ${a.roi >= 0 ? '+' : ''}${a.roi}%`;
}
function mdTable(headers, body) {
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${body.map((r) => `| ${r.join(' | ')} |`).join('\n')}`;
}
function med(xs) {
  const a = xs.filter(Number.isFinite).sort((x, y) => x - y);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
function nfix(n, d = 0) {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(d);
}
function live(rs) { return rs.filter((r) => r.live); }
function win(lo, hi) { return live(rows.filter((r) => r.date >= lo && r.date <= hi)); }

function allFine(p) {
  if (!Number.isFinite(p)) return 'no $';
  const x = p * 100;
  if (x < 15) return '0–15%';
  if (x < 20) return '15–20%';
  if (x < 25) return '20–25%';
  if (x < 30) return '25–30%';
  if (x < 35) return '30–35%';
  if (x < 40) return '35–40%';
  if (x < 45) return '40–45%';
  if (x < 50) return '45–50%';
  if (x < 60) return '50–60%';
  if (x < 80) return '60–80%';
  return '80–100%';
}
function provenCoarse(p) {
  if (!Number.isFinite(p)) return 'no proven $';
  if (p < 0.25) return 'prov <25%';
  if (p < 0.50) return 'prov 25–50%';
  if (p < 0.60) return 'prov 50–60%';
  return 'prov ≥60%';
}
function allCoarse(p) {
  if (!Number.isFinite(p)) return 'no $';
  if (p < 0.15) return 'all 0–15%';
  if (p < 0.25) return 'all 15–25%';
  if (p < 0.45) return 'all 25–45%';
  if (p < 0.50) return 'all 45–50%';
  if (p < 0.60) return 'all 50–60%';
  return 'all ≥60%';
}

const FINE = ['0–15%', '15–20%', '20–25%', '25–30%', '30–35%', '35–40%', '40–45%', '45–50%', '50–60%', '60–80%', '80–100%'];
const ALLC = ['all 0–15%', 'all 15–25%', 'all 25–45%', 'all 45–50%', 'all 50–60%', 'all ≥60%'];
const PROVC = ['prov <25%', 'prov 25–50%', 'prov 50–60%', 'prov ≥60%', 'no proven $'];

const eras = [
  ['Last 7', '2026-09-10', '2026-09-16'],
  ['T', '2026-08-31', '2026-09-16'],
  ['Steam', '2026-08-19', '2026-09-16'],
  ['Aug 24+', '2026-08-24', '2026-09-16'],
  ['v12', '2026-06-01', '2026-09-16'],
];

const out = [];
const p = (s = '') => out.push(s);

p('# All-wallet $ share × proven $ share');
p('');
p('_share = all `walletDetails.invested`. shareP = proven (confirmed/flat) invested only. Flip = we look out-dollar’d on the card and still have the proven money._');
p('_Live book. **No policy.**_');
p('');

p('## Direct answer');
p('');
p('Two axes, not one mute line.');
p('');
p('**Junk-against (all-share low, proven-share high) prints.** The 15–25% pocket is this cell. Mute it and you cut winners.');
p('**True contested (all-share 25–45% *and* proven-share still mid/low) is the dog.** Proven majority does **not** save 25–45% all-$.');
p('**Proven-share alone is not a mute.** ≥60% proven is +EV on v12 because it is mostly ≥60% all-$. Inside 25–45% all-$, proven ≥60% still loses.');
p('');

p('## 1. Fine all-wallet tiers, split by proven $ flip');
p('');
p('Each all-$ band: whole cell, then proven-share ≥50% vs `<50%`. Median proven-share in the band.');
p('');

{
  const focus = [
    ['Aug 24+', '2026-08-24', '2026-09-16'],
    ['T', '2026-08-31', '2026-09-16'],
    ['Steam', '2026-08-19', '2026-09-16'],
    ['v12', '2026-06-01', '2026-09-16'],
  ];
  const header = ['All-$ band', ...focus.map(([n]) => n)];
  const body = [];
  for (const b of FINE) {
    body.push([
      `**${b}** all`,
      ...focus.map(([, lo, hi]) => {
        const hit = win(lo, hi).filter((r) => allFine(r.share) === b);
        const a = agg(hit);
        if (!a.n) return '—';
        const mp = med(hit.map((r) => r.shareP));
        return `${short(a)} · med prov ${nfix((mp || 0) * 100)}%`;
      }),
    ]);
    body.push([
      `${b} · prov ≥50%`,
      ...focus.map(([, lo, hi]) => short(agg(win(lo, hi).filter((r) => allFine(r.share) === b && r.shareP >= 0.50)))),
    ]);
    body.push([
      `${b} · prov <50%`,
      ...focus.map(([, lo, hi]) => short(agg(win(lo, hi).filter((r) => allFine(r.share) === b && Number.isFinite(r.shareP) && r.shareP < 0.50)))),
    ]);
  }
  p(mdTable(header, body));
  p('');
}

p('## 2. Cross: all-$ coarse × proven-$ coarse (Aug 24+ is the current book)');
p('');
{
  const rs = win('2026-08-24', '2026-09-16');
  p(mdTable(
    ['All-$ \\ proven-$', ...PROVC, 'row total'],
    ALLC.map((a) => [
      a,
      ...PROVC.map((pv) => short(agg(rs.filter((r) => allCoarse(r.share) === a && provenCoarse(r.shareP) === pv)))),
      short(agg(rs.filter((r) => allCoarse(r.share) === a))),
    ]),
  ));
  p('');
  p('Same cross, T:');
  p('');
  const t = win('2026-08-31', '2026-09-16');
  p(mdTable(
    ['All-$ \\ proven-$', ...PROVC, 'row total'],
    ALLC.map((a) => [
      a,
      ...PROVC.map((pv) => short(agg(t.filter((r) => allCoarse(r.share) === a && provenCoarse(r.shareP) === pv)))),
      short(agg(t.filter((r) => allCoarse(r.share) === a))),
    ]),
  ));
  p('');
  p('Same cross, full v12:');
  p('');
  const v = win('2026-06-01', '2026-09-16');
  p(mdTable(
    ['All-$ \\ proven-$', ...PROVC, 'row total'],
    ALLC.map((a) => [
      a,
      ...PROVC.map((pv) => short(agg(v.filter((r) => allCoarse(r.share) === a && provenCoarse(r.shareP) === pv)))),
      short(agg(v.filter((r) => allCoarse(r.share) === a))),
    ]),
  ));
  p('');
}

p('## 3. Directional cells (the actual mute language)');
p('');
{
  const cells = [
    ['Junk-against: all <25% AND prov ≥50%', (r) => r.share < 0.25 && r.shareP >= 0.50],
    ['Junk-against: all 15–25% AND prov ≥50%', (r) => r.share >= 0.15 && r.share < 0.25 && r.shareP >= 0.50],
    ['Junk-against: all <45% AND prov ≥50%', (r) => r.share < 0.45 && r.shareP >= 0.50],
    ['True buried: all <25% AND prov <50%', (r) => r.share < 0.25 && Number.isFinite(r.shareP) && r.shareP < 0.50],
    ['True buried: all 0–15% AND prov <50%', (r) => r.share < 0.15 && Number.isFinite(r.shareP) && r.shareP < 0.50],
    ['True contested: all 25–45% AND prov <50%', (r) => r.share >= 0.25 && r.share < 0.45 && Number.isFinite(r.shareP) && r.shareP < 0.50],
    ['Fake save: all 25–45% AND prov ≥50%', (r) => r.share >= 0.25 && r.share < 0.45 && r.shareP >= 0.50],
    ['Fake save: all 25–45% AND prov ≥60%', (r) => r.share >= 0.25 && r.share < 0.45 && r.shareP >= 0.60],
    ['Split board: all 40–50% AND prov <50%', (r) => r.share >= 0.40 && r.share < 0.50 && Number.isFinite(r.shareP) && r.shareP < 0.50],
    ['Majority both: all ≥60% AND prov ≥60%', (r) => r.share >= 0.60 && r.shareP >= 0.60],
    ['Pile with unproven us: all ≥60% AND prov <50%', (r) => r.share >= 0.60 && Number.isFinite(r.shareP) && r.shareP < 0.50],
    ['Keep 15–25% regardless of proven', (r) => r.share >= 0.15 && r.share < 0.25],
    ['Mute 0–15 + 25–45 (except 15–25)', (r) => r.share < 0.45 && !(r.share >= 0.15 && r.share < 0.25)],
    ['Mute 0–45 except junk-against (all<45 & prov≥50)', (r) => r.share < 0.45 && !(r.shareP >= 0.50)],
    ['Mute true contested 25–45 & prov<50 only', (r) => r.share >= 0.25 && r.share < 0.45 && Number.isFinite(r.shareP) && r.shareP < 0.50],
  ];
  p(mdTable(
    ['Cell', ...eras.map(([n]) => n)],
    cells.map(([name, fn]) => [
      name,
      ...eras.map(([, lo, hi]) => {
        const hit = win(lo, hi).filter((r) => Number.isFinite(r.share) && fn(r));
        const a = agg(hit);
        if (!a.n) return '—';
        const save = -a.pnl;
        const muteish = name.startsWith('Mute');
        return muteish
          ? `${short(a)} · save ${save >= 0 ? '+' : ''}${Math.round(save)}u`
          : short(a);
      }),
    ]),
  ));
  p('');
}

p('## 4. Proven-share tiers alone (no all-$ axis)');
p('');
{
  const pbands = [
    ['prov 0–25%', (r) => Number.isFinite(r.shareP) && r.shareP < 0.25],
    ['prov 25–40%', (r) => r.shareP >= 0.25 && r.shareP < 0.40],
    ['prov 40–50%', (r) => r.shareP >= 0.40 && r.shareP < 0.50],
    ['prov 50–60%', (r) => r.shareP >= 0.50 && r.shareP < 0.60],
    ['prov ≥60%', (r) => r.shareP >= 0.60],
  ];
  p(mdTable(
    ['Proven-$ band', ...eras.map(([n]) => n)],
    pbands.map(([name, fn]) => [
      name,
      ...eras.map(([, lo, hi]) => {
        const rs = win(lo, hi);
        const hit = rs.filter(fn);
        const a = agg(hit);
        if (!a.n) return '—';
        return `${((hit.length / rs.length) * 100).toFixed(0)}% of book · ${short(a)}`;
      }),
    ]),
  ));
  p('');
}

p('## 5. Mute options under this lens (current books)');
p('');
{
  const opts = [
    ['A. Mute all ≤45%', (r) => r.share < 0.45],
    ['B. Mute ≤45% except 15–25%', (r) => r.share < 0.45 && !(r.share >= 0.15 && r.share < 0.25)],
    ['C. Mute ≤45% except junk-against (prov≥50%)', (r) => r.share < 0.45 && !(r.shareP >= 0.50)],
    ['D. Mute ≤45% except (15–25% OR prov≥50%)', (r) => r.share < 0.45 && !(r.share >= 0.15 && r.share < 0.25) && !(r.shareP >= 0.50)],
    ['E. Mute 25–45% only (keep <25%)', (r) => r.share >= 0.25 && r.share < 0.45],
    ['F. Mute 25–45% AND prov<50% only', (r) => r.share >= 0.25 && r.share < 0.45 && Number.isFinite(r.shareP) && r.shareP < 0.50],
    ['G. Mute all-share 25–50%', (r) => r.share >= 0.25 && r.share < 0.50],
  ];
  const focus = eras.filter((e) => ['Last 7', 'T', 'Steam', 'Aug 24+', 'v12'].includes(e[0]));
  p(mdTable(
    ['If we mute…', ...focus.map(([n]) => n)],
    opts.map(([name, fn]) => [
      name,
      ...focus.map(([, lo, hi]) => {
        const hit = win(lo, hi).filter((r) => Number.isFinite(r.share) && fn(r));
        const a = agg(hit);
        if (!a.n) return '—';
        return `${a.w}–${a.l} actual ${a.pnl >= 0 ? '+' : ''}${Math.round(a.pnl)}u · save ${(-a.pnl) >= 0 ? '+' : ''}${Math.round(-a.pnl)}u · n=${a.n}`;
      }),
    ]),
  ));
  p('');
}

const text = `${out.join('\n')}\n`;
mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/PROVEN_SHARE_FLIP.md', text);
writeFileSync(join(ROOT, 'docs/PROVEN_SHARE_FLIP_2026-09-17.md'), text);
console.log(text);
console.error('wrote proven share flip');
