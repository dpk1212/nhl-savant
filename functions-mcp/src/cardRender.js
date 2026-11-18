/**
 * Portrait cards. Dark base, gold for the call, green and red for results.
 */

const fs = require('fs');
const path = require('path');

const BG = '#0B0F1F';
const INK = '#F8FAFC';
const MUTED = '#94A3B8';
const GOLD = '#D4AF37';
const GREEN = '#3DDC97';
const RED = '#F07178';
const LINE = '#1E293B';

const FONT_DIR = path.join(__dirname, '..', 'node_modules', '@fontsource', 'inter', 'files');

function font(weight) {
  return fs.readFileSync(path.join(FONT_DIR, `inter-latin-${weight}-normal.woff`));
}

let fonts;
function fontList() {
  if (!fonts) {
    fonts = [400, 600, 700].map((weight) => ({
      name: 'Inter',
      data: font(weight),
      weight,
      style: 'normal',
    }));
  }
  return fonts;
}

function el(type, style, children, extra) {
  return { type, props: { ...(extra || {}), style, children } };
}

function text(value, style) {
  return el('div', { display: 'flex', ...style }, String(value ?? ''));
}

function linePath(values, width, height) {
  if (!values.length) return '';
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;
  return values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
    const y = (1 - (value - min) / span) * height;
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

function chart(values, width, height, color) {
  const d = linePath(values, width, height);
  return el('svg', { display: 'flex' }, [
    el('path', {}, null, { d, fill: 'none', stroke: color, strokeWidth: 6, strokeLinejoin: 'round', strokeLinecap: 'round' }),
  ], { width, height, viewBox: `0 0 ${width} ${height}` });
}

function frame(height, children) {
  return el('div', {
    width: '1080px',
    height: `${height}px`,
    background: BG,
    color: INK,
    fontFamily: 'Inter',
    display: 'flex',
    flexDirection: 'column',
    padding: '72px',
  }, [
    text('SharpFlow', { color: GOLD, fontSize: 28, fontWeight: 700, letterSpacing: 1.5 }),
    text('NHL SAVANT', { color: MUTED, fontSize: 18, fontWeight: 600, letterSpacing: 3, marginTop: 8 }),
    ...children,
    el('div', { marginTop: 'auto', display: 'flex', paddingTop: 36 }, [
      text('nhlsavant.com', { color: MUTED, fontSize: 28, fontWeight: 600 }),
    ]),
  ]);
}

function pct(n) {
  if (!Number.isFinite(n)) return '';
  const rounded = Math.round(n * 10) / 10;
  const body = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `${rounded > 0 ? '+' : ''}${body}%`;
}

function money(n) {
  const abs = Math.abs(Math.round(Number(n) || 0));
  if (abs >= 1000) {
    const k = abs / 1000;
    const body = k >= 100 || Math.abs(k - Math.round(k)) < 0.05
      ? String(Math.round(k))
      : k.toFixed(1).replace(/\.0$/, '');
    return `$${body}K`;
  }
  return `$${abs}`;
}

function profitView(data, height) {
  return frame(height, [
    text('Running return', { fontSize: 64, fontWeight: 700, marginTop: 48 }),
    text(`..${data.id}`, { color: GOLD, fontSize: 36, fontWeight: 600, marginTop: 12 }),
    text(`${data.record}   ${pct(data.roiPct)} ROI`, { fontSize: 54, fontWeight: 700, marginTop: 28 }),
    text(`${data.window === 'all' ? 'All time' : data.window === '90d' ? '90 days' : '30 days'}${data.sport ? ` · ${data.sport}` : ''}${data.market ? ` · ${data.market}` : ''}`, {
      color: MUTED, fontSize: 28, marginTop: 8,
    }),
    el('div', { display: 'flex', marginTop: 48, background: '#111627', borderRadius: 28, padding: 36 }, [
      chart(data.points || [], 860, height > 1500 ? 620 : 420, GOLD),
    ]),
    text(`Peak ${pct(data.peakPct)}`, { color: GOLD, fontSize: 32, fontWeight: 700, marginTop: 28 }),
    text(`Drop ${pct(-Math.abs(data.drawdownPct || 0))}`, { color: RED, fontSize: 32, fontWeight: 700, marginTop: 8 }),
  ]);
}

function splitBar(sides) {
  const total = (sides || []).reduce((sum, side) => sum + (Number(side.dollars) || 0), 0) || 1;
  return el('div', { display: 'flex', width: '100%', height: 12, marginTop: 12, borderRadius: 6 }, (sides || []).map((side, index) => (
    el('div', {
      width: `${Math.max(6, Math.round(((Number(side.dollars) || 0) / total) * 100))}%`,
      height: 12,
      background: index === 0 ? GOLD : '#334155',
    }, [])
  )));
}

function walletCount(n) {
  return `${n} ${n === 1 ? 'wallet' : 'wallets'}`;
}

function boardView(data, height) {
  const games = (data.games || []).slice(0, 6);
  return frame(height, [
    text("Tonight's money", { fontSize: 64, fontWeight: 700, marginTop: 48 }),
    text(data.sport || 'All sports', { color: MUTED, fontSize: 28, fontWeight: 600, marginTop: 12 }),
    el('div', { display: 'flex', flexDirection: 'column', marginTop: 28 }, games.map((game) => (
      el('div', {
        display: 'flex', flexDirection: 'column', padding: '16px 0', borderTop: `1px solid ${LINE}`,
      }, [
        text(`${game.matchup} · ${game.market}`, { color: MUTED, fontSize: 22, fontWeight: 600 }),
        splitBar(game.sides),
        el('div', { display: 'flex', marginTop: 8 }, (game.sides || []).map((side) => (
          el('div', { display: 'flex', flexDirection: 'column', width: '50%' }, [
            text(side.pick, { fontSize: 28, fontWeight: 700 }),
            text(`${money(side.dollars)} · ${walletCount(side.wallets)}${side.hot ? ' · hot' : ''}`, {
              color: side.hot ? GOLD : MUTED, fontSize: 22, marginTop: 2,
            }),
          ])
        ))),
      ])
    ))),
  ]);
}

function pairColumn(cell, color, label) {
  return el('div', { display: 'flex', flexDirection: 'column', width: '48%' }, [
    text(label, { color, fontSize: 28, fontWeight: 700, letterSpacing: 1 }),
    text(`${cell.sport} ${cell.market}`, { fontSize: 36, fontWeight: 700, marginTop: 12 }),
    text(`${cell.record}`, { fontSize: 42, fontWeight: 700, marginTop: 8 }),
    text(`${pct(cell.roiPct)} ROI`, { color, fontSize: 28, fontWeight: 600, marginTop: 4 }),
    el('div', { display: 'flex', marginTop: 24 }, [chart(cell.points || [], 400, 220, color)]),
  ]);
}

function pairView(data, height) {
  return frame(height, [
    text('Hot and slipping', { fontSize: 64, fontWeight: 700, marginTop: 48 }),
    text(`..${data.id}`, { color: GOLD, fontSize: 36, fontWeight: 600, marginTop: 12 }),
    text('Last 30 days', { color: MUTED, fontSize: 28, marginTop: 8 }),
    el('div', { display: 'flex', justifyContent: 'space-between', marginTop: 56 }, [
      pairColumn(data.hot, GOLD, 'HOT'),
      pairColumn(data.slipping, RED, 'SLIPPING'),
    ]),
  ]);
}

function streakView(data, height) {
  const results = data.results || [];
  const highlight = Math.max(0, results.length - 5);
  return frame(height, [
    text('Recent results', { fontSize: 64, fontWeight: 700, marginTop: 48 }),
    text(`..${data.id}`, { color: GOLD, fontSize: 36, fontWeight: 600, marginTop: 12 }),
    text(`${data.record}   ${pct(data.roiPct)} ROI`, { fontSize: 48, fontWeight: 700, marginTop: 28 }),
    text(`Last 5: ${data.last5}`, { color: MUTED, fontSize: 28, marginTop: 8 }),
    el('div', { display: 'flex', flexWrap: 'wrap', marginTop: 56, width: 936 }, results.map((result, index) => (
      el('div', {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 16,
        marginBottom: 16,
        background: result === 'W' ? GREEN : RED,
        border: index >= highlight ? `4px solid ${GOLD}` : '4px solid transparent',
        display: 'flex',
      }, [])
    ))),
    text('Newest on the right. Gold ring is the last five.', { color: MUTED, fontSize: 24, marginTop: 12 }),
  ]);
}

function recapView(data, height) {
  return frame(height, [
    text('Last night', { fontSize: 64, fontWeight: 700, marginTop: 48 }),
    text(data.date || '', { color: GOLD, fontSize: 32, fontWeight: 600, marginTop: 12 }),
    text(money(data.totalDollars), { fontSize: 72, fontWeight: 700, marginTop: 28 }),
    text('Confirmed money', { color: MUTED, fontSize: 24, marginTop: 4 }),
    el('div', { display: 'flex', flexDirection: 'column', marginTop: 40 }, (data.bySize || []).map((row) => (
      text(`${row.size}   ${row.record}   ${pct(row.roiPct)}`, { fontSize: 36, fontWeight: 600, marginTop: 16 })
    ))),
    data.best ? text(`Best ..${data.best.id}   ${data.best.record}   ${pct(data.best.roiPct)}`, {
      color: GREEN, fontSize: 32, fontWeight: 700, marginTop: 40,
    }) : null,
    data.worst ? text(`Worst ..${data.worst.id}   ${data.worst.record}   ${pct(data.worst.roiPct)}`, {
      color: RED, fontSize: 32, fontWeight: 700, marginTop: 12,
    }) : null,
  ].filter(Boolean));
}

const VIEWS = {
  profit_curve: profitView,
  money_board: boardView,
  hot_vs_slipping: pairView,
  streak_strip: streakView,
  morning_recap: recapView,
};

async function renderCard(kind, data, { width = 1080, height = 1350 } = {}) {
  const view = VIEWS[kind];
  if (!view) throw new Error(`Unknown card ${kind}`);
  const satoriMod = await import('satori');
  const satori = satoriMod.default || satoriMod;
  const { Resvg } = require('@resvg/resvg-js');
  const svg = await satori(view(data, height), {
    width,
    height,
    fonts: fontList(),
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
  return png;
}

module.exports = { renderCard };
