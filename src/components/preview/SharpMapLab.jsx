/**
 * SharpMapLab — sandbox for a sharp-wallet visual map (quadrant / bubble).
 * Open at  #/sharp-map-lab
 *
 * ISOLATION: fixture wallets only. No Firebase, no SharpFlow imports.
 * Port only after explicit visual + axis approval.
 *
 * v2 — brand pass. Rendered as a Sharp Flow "card": same palette, zone
 * chrome, gold chips, hairline rules and share-stub footer as the live /
 * locked position cards. Mobbin refs: Fey (matte dark analytics), TheyDo
 * matrix, Kakao Pay bubbles.
 *
 * Encoding:
 *   X = beats the close (causal %+CLV)   — pricing skill
 *   Y = ROI or win rate                  — results
 *   r = × usual (sizeRatio) or $ size    — conviction
 *   color = side (our play = champagne, opponent = cool slate)
 */
import { useMemo, useState } from 'react';

// Anchored to the Sharp Flow page palette — mirrors PositionCards.jsx.
const C = {
  page: '#0B0F1F',
  card: '#151923',
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
  hair: 'rgba(148,163,184,0.10)',
  hairSoft: 'rgba(148,163,184,0.06)',
  green: '#22c55e',
  red: '#ef4444',
  gold: '#d4af37',
  goldHi: '#f0d78c',
  border: 'rgba(255,255,255,0.08)',
};
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";

/** Our play glows champagne like the battle column; the other side stays cool slate. */
const SIDE = {
  home: {
    key: 'home',
    short: 'PHI',
    name: 'Phillies',
    fill: 'rgba(212,175,55,0.30)',
    stroke: '#d4af37',
    glow: 'rgba(212,175,55,0.45)',
    text: '#f7ecc9',
    solid: '#d4af37',
  },
  away: {
    key: 'away',
    short: 'NYM',
    name: 'Mets',
    fill: 'rgba(110,144,196,0.16)',
    stroke: 'rgba(139,167,214,0.75)',
    glow: 'rgba(110,144,196,0.25)',
    text: '#c6d4ea',
    solid: '#8ba7d6',
  },
};

/** All sharps on Mets @ Phillies ML — fixture only, mirrors live card fields. */
const FIXTURES = [
  // —— Phillies (home) ——
  { id: 'a1', short: 'a1f3', side: 'home', clv: 68, wr: 61, roi: 14.2, sizeRatio: 2.4, invested: 4200, n: 42, proven: true },
  { id: 'b2', short: 'b29c', side: 'home', clv: 64, wr: 58, roi: 9.1, sizeRatio: 1.8, invested: 2800, n: 38, proven: true },
  { id: 'c3', short: 'c8e1', side: 'home', clv: 71, wr: 55, roi: 6.4, sizeRatio: 3.1, invested: 6100, n: 29, proven: true },
  { id: 'e5', short: 'e7bb', side: 'home', clv: 57, wr: 52, roi: 1.8, sizeRatio: 1.4, invested: 1500, n: 74, proven: true },
  { id: 'g7', short: 'g9aa', side: 'home', clv: 44, wr: 59, roi: 11.0, sizeRatio: 0.9, invested: 700, n: 88, proven: true },
  { id: 'i9', short: 'i6c0', side: 'home', clv: 59, wr: 63, roi: 18.5, sizeRatio: 1.6, invested: 2100, n: 27, proven: true },
  { id: 'k1', short: 'k81b', side: 'home', clv: 66, wr: 49, roi: -2.4, sizeRatio: 2.7, invested: 4800, n: 31, proven: true },
  { id: 'm2', short: 'm0de', side: 'home', clv: 53, wr: 56, roi: 7.7, sizeRatio: 1.0, invested: 1100, n: 92, proven: true },
  { id: 'p1', short: 'p4c2', side: 'home', clv: 61, wr: 54, roi: 4.2, sizeRatio: 1.2, invested: 1600, n: 51, proven: true },
  { id: 'p2', short: 'p91a', side: 'home', clv: 48, wr: 51, roi: 0.4, sizeRatio: 0.8, invested: 650, n: 40, proven: false },
  { id: 'p3', short: 'pa07', side: 'home', clv: 72, wr: 57, roi: 8.8, sizeRatio: 2.2, invested: 3900, n: 22, proven: true },
  { id: 'p4', short: 'pb33', side: 'home', clv: 55, wr: 47, roi: -5.1, sizeRatio: 1.5, invested: 2400, n: 36, proven: false },
  { id: 'p5', short: 'pc18', side: 'home', clv: 63, wr: 60, roi: 12.6, sizeRatio: 1.9, invested: 3100, n: 48, proven: true },
  { id: 'p6', short: 'pd6e', side: 'home', clv: 50, wr: 53, roi: 2.1, sizeRatio: 0.6, invested: 420, n: 19, proven: false },
  { id: 'p7', short: 'pe22', side: 'home', clv: 58, wr: 55, roi: 5.5, sizeRatio: 1.3, invested: 1800, n: 67, proven: true },
  // —— Mets (away) ——
  { id: 'd4', short: 'd04a', side: 'away', clv: 49, wr: 54, roi: 3.2, sizeRatio: 1.1, invested: 900, n: 61, proven: true },
  { id: 'f6', short: 'f12d', side: 'away', clv: 62, wr: 48, roi: -4.6, sizeRatio: 2.0, invested: 3300, n: 33, proven: true },
  { id: 'h8', short: 'h33e', side: 'away', clv: 41, wr: 46, roi: -8.2, sizeRatio: 0.7, invested: 500, n: 55, proven: false },
  { id: 'j0', short: 'j4f2', side: 'away', clv: 55, wr: 50, roi: -1.1, sizeRatio: 1.3, invested: 1200, n: 46, proven: true },
  { id: 'n1', short: 'n8c4', side: 'away', clv: 67, wr: 59, roi: 10.4, sizeRatio: 2.5, invested: 4500, n: 35, proven: true },
  { id: 'n2', short: 'n21f', side: 'away', clv: 52, wr: 57, roi: 6.9, sizeRatio: 1.7, invested: 2600, n: 44, proven: true },
  { id: 'n3', short: 'n77b', side: 'away', clv: 45, wr: 51, roi: 0.8, sizeRatio: 0.9, invested: 800, n: 70, proven: false },
  { id: 'n4', short: 'n0aa', side: 'away', clv: 70, wr: 52, roi: 2.6, sizeRatio: 2.8, invested: 5200, n: 28, proven: true },
  { id: 'n5', short: 'n5d1', side: 'away', clv: 38, wr: 44, roi: -11.0, sizeRatio: 0.5, invested: 350, n: 24, proven: false },
  { id: 'n6', short: 'n9e8', side: 'away', clv: 60, wr: 56, roi: 7.1, sizeRatio: 1.4, invested: 1900, n: 53, proven: true },
  { id: 'n7', short: 'na4c', side: 'away', clv: 54, wr: 49, roi: -3.3, sizeRatio: 1.6, invested: 2200, n: 41, proven: true },
  { id: 'n8', short: 'nb12', side: 'away', clv: 47, wr: 58, roi: 9.8, sizeRatio: 1.1, invested: 1400, n: 62, proven: true },
  { id: 'n9', short: 'nc90', side: 'away', clv: 65, wr: 53, roi: 3.9, sizeRatio: 2.1, invested: 3700, n: 30, proven: false },
  { id: 'na', short: 'nd3f', side: 'away', clv: 56, wr: 55, roi: 5.0, sizeRatio: 1.0, invested: 1050, n: 79, proven: true },
];

const Y_OPTS = [
  { id: 'roi', label: 'ROI', min: -15, max: 25, breakAt: 0, fmt: (v) => `${v >= 0 ? '+' : ''}${Number(v).toFixed(1)}%` },
  { id: 'wr', label: 'Win rate', min: 40, max: 70, breakAt: 52.4, fmt: (v) => `${v}%` },
];
const SIZE_OPTS = [
  { id: 'ratio', label: '× usual', hint: 'size vs their average — conviction' },
  { id: 'dollars', label: '$ size', hint: 'absolute dollars on this play' },
];
const FILTER_OPTS = [
  { id: 'all', label: 'All sharps' },
  { id: 'proven', label: 'Proven only' },
];

const QUAD_COPY = {
  elite: { title: 'ELITE', blurb: 'Beats the close and prints. The wallets we follow hard.' },
  lucky: { title: 'RESULTS ONLY', blurb: 'Winning without a price edge — results can be fragile.' },
  sharp: { title: 'PRICE EDGE', blurb: 'Beats the close but results are cold. Variance, or a filter.' },
  noise: { title: 'NOISE', blurb: 'Neither price skill nor results. We track, we don’t follow.' },
};

const fmtMoney = (v) => {
  const n = Math.abs(v);
  if (n >= 1e6) return `${v < 0 ? '-' : ''}$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1000) return `${v < 0 ? '-' : ''}$${(n / 1000).toFixed(1)}K`;
  return `${v < 0 ? '-' : ''}$${Math.round(n)}`;
};
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

const MAP_CSS = `
  @keyframes smapReveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes smapDot { from { opacity: 0; } to { opacity: 1; } }
  .smap-reveal { animation: smapReveal .34s cubic-bezier(0.16,1,0.3,1) both; }
  .smap-dot { animation: smapDot .5s ease both; transition: filter .18s ease; }
  .smap-dot:hover { filter: brightness(1.35); }
  @media (prefers-reduced-motion: reduce) {
    .smap-reveal, .smap-dot { animation: none !important; }
  }
`;

/** Zone header — same tick + letterspaced label chrome as the cards. */
function ZoneHead({ children, right, accent = C.gold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 3, height: 11, borderRadius: 2, background: accent, boxShadow: `0 0 8px ${accent}88` }} />
        <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.14em', color: C.textSec }}>
          {children}
        </span>
      </span>
      {right}
    </div>
  );
}

function ZoneRule() {
  return (
    <div style={{
      height: 1, margin: '0 18px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09) 18%, rgba(255,255,255,0.09) 82%, transparent)',
    }} />
  );
}

/** Gold chip — same treatment as the “% on Team” pill on live cards. */
function GoldChip({ children }) {
  return (
    <span style={{
      fontSize: '0.58rem', fontWeight: 900, fontFeatureSettings: "'tnum'",
      padding: '4px 10px', borderRadius: 7, color: '#06100a',
      background: `linear-gradient(180deg, ${C.goldHi} 0%, ${C.gold} 100%)`,
      boxShadow: `0 8px 20px -10px ${C.gold}`,
    }}>
      {children}
    </span>
  );
}

/** Underline tabs — mirrors the depth tabs (Money flow / Line history / Wallets). */
function Tabs({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex' }}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              flex: 1, padding: '9px 12px', cursor: 'pointer', border: 'none',
              background: 'transparent', fontSize: '0.68rem', fontWeight: 800,
              whiteSpace: 'nowrap',
              color: active ? C.text : C.textMuted,
              borderBottom: active ? `2px solid ${C.gold}` : `1px solid ${C.hairSoft}`,
              transition: 'color .18s ease, border-color .18s ease',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function QuadrantMap({ points, yOpt, sizeMode, selectedId, onSelect }) {
  const W = 640;
  const H = 460;
  const pad = { t: 30, r: 26, b: 44, l: 52 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const xMin = 35;
  const xMax = 75;
  const xBreak = 55;

  const xScale = (v) => pad.l + ((clamp(v, xMin, xMax) - xMin) / (xMax - xMin)) * iw;
  const yScale = (v) => pad.t + (1 - (clamp(v, yOpt.min, yOpt.max) - yOpt.min) / (yOpt.max - yOpt.min)) * ih;

  const xBreakPx = xScale(xBreak);
  const yBreakPx = yScale(yOpt.breakAt);

  const sizeVals = points.map((p) => (sizeMode === 'ratio' ? p.sizeRatio : p.invested));
  const sMin = Math.min(...sizeVals, 1);
  const sMax = Math.max(...sizeVals, 1);
  const rFor = (p) => {
    const raw = sizeMode === 'ratio' ? p.sizeRatio : p.invested;
    const t = sMax === sMin ? 0.5 : (raw - sMin) / (sMax - sMin);
    return 8 + t * 19;
  };

  // Deterministic jitter so stacked wallets separate without dancing on re-render.
  const jitter = (id, axis) => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    const n = ((h >> (axis === 'x' ? 0 : 8)) & 255) / 255;
    return (n - 0.5) * 10;
  };

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="smap-elite" cx="80%" cy="0%" r="90%">
          <stop offset="0%" stopColor="rgba(212,175,55,0.10)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0.015)" />
        </radialGradient>
      </defs>

      {/* elite quadrant — ambient champagne wash, not a hard fill */}
      <rect
        x={xBreakPx} y={pad.t}
        width={pad.l + iw - xBreakPx} height={Math.max(0, yBreakPx - pad.t)}
        fill="url(#smap-elite)"
      />

      {/* whisper grid */}
      {[0.25, 0.5, 0.75].map((t) => (
        <g key={t}>
          <line x1={pad.l + iw * t} y1={pad.t} x2={pad.l + iw * t} y2={pad.t + ih} stroke={C.hairSoft} strokeWidth={1} />
          <line x1={pad.l} y1={pad.t + ih * t} x2={pad.l + iw} y2={pad.t + ih * t} stroke={C.hairSoft} strokeWidth={1} />
        </g>
      ))}

      {/* break lines — soft dashes, echoes the cards' hairline language */}
      <line x1={xBreakPx} y1={pad.t} x2={xBreakPx} y2={pad.t + ih} stroke="rgba(255,255,255,0.14)" strokeWidth={1} strokeDasharray="3 6" />
      <line x1={pad.l} y1={yBreakPx} x2={pad.l + iw} y2={yBreakPx} stroke="rgba(255,255,255,0.14)" strokeWidth={1} strokeDasharray="3 6" />

      {/* axes */}
      <line x1={pad.l} y1={pad.t + ih} x2={pad.l + iw} y2={pad.t + ih} stroke={C.hair} strokeWidth={1} />
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + ih} stroke={C.hair} strokeWidth={1} />

      <text x={pad.l + iw / 2} y={H - 9} textAnchor="middle" fill={C.textMuted} fontSize={10} fontWeight={800} letterSpacing="0.14em">
        BEATS THE CLOSE →
      </text>
      <text
        x={13} y={pad.t + ih / 2} textAnchor="middle" fill={C.textMuted} fontSize={10} fontWeight={800}
        letterSpacing="0.14em" transform={`rotate(-90 13 ${pad.t + ih / 2})`}
      >
        {yOpt.label.toUpperCase()} →
      </text>

      <text x={pad.l} y={pad.t + ih + 15} textAnchor="start" fill={C.textFaint} fontSize={9.5} fontFamily={MONO}>{xMin}%</text>
      <text x={xBreakPx} y={pad.t + ih + 15} textAnchor="middle" fill={C.textSec} fontSize={9.5} fontFamily={MONO}>{xBreak}%</text>
      <text x={pad.l + iw} y={pad.t + ih + 15} textAnchor="end" fill={C.textFaint} fontSize={9.5} fontFamily={MONO}>{xMax}%</text>
      <text x={pad.l - 8} y={pad.t + 4} textAnchor="end" fill={C.textFaint} fontSize={9.5} fontFamily={MONO}>{yOpt.fmt(yOpt.max)}</text>
      <text x={pad.l - 8} y={yBreakPx + 3} textAnchor="end" fill={C.textSec} fontSize={9.5} fontFamily={MONO}>{yOpt.fmt(yOpt.breakAt)}</text>
      <text x={pad.l - 8} y={pad.t + ih} textAnchor="end" fill={C.textFaint} fontSize={9.5} fontFamily={MONO}>{yOpt.fmt(yOpt.min)}</text>

      {/* quadrant ghost labels */}
      {[
        { key: 'elite', x: xBreakPx + (pad.l + iw - xBreakPx) / 2, y: pad.t + 16, gold: true },
        { key: 'lucky', x: pad.l + (xBreakPx - pad.l) / 2, y: pad.t + 16 },
        { key: 'sharp', x: xBreakPx + (pad.l + iw - xBreakPx) / 2, y: pad.t + ih - 9 },
        { key: 'noise', x: pad.l + (xBreakPx - pad.l) / 2, y: pad.t + ih - 9 },
      ].map((q) => (
        <text
          key={q.key}
          x={q.x} y={q.y} textAnchor="middle"
          fill={q.gold ? 'rgba(212,175,55,0.38)' : 'rgba(255,255,255,0.12)'}
          fontSize={9.5} fontWeight={800} letterSpacing="0.16em"
        >
          {QUAD_COPY[q.key].title}
        </text>
      ))}

      {/* away under home so our champagne dots sit on top when overlapping */}
      {[...points].sort((a, b) => (a.side === 'home') - (b.side === 'home')).map((p, i) => {
        const yVal = yOpt.id === 'roi' ? p.roi : p.wr;
        const cx = xScale(p.clv) + jitter(p.id, 'x');
        const cy = yScale(yVal) + jitter(p.id, 'y');
        const r = rFor(p);
        const side = SIDE[p.side];
        const sel = p.id === selectedId;
        return (
          <g
            key={p.id}
            className="smap-dot"
            style={{ animationDelay: `${Math.min(i * 22, 500)}ms`, cursor: 'pointer' }}
            onClick={() => onSelect(p.id)}
          >
            {sel && (
              <circle cx={cx} cy={cy} r={r + 4.5} fill="none" stroke={C.goldHi} strokeWidth={1} opacity={0.85} />
            )}
            <circle
              cx={cx} cy={cy} r={r}
              fill={side.fill}
              stroke={side.stroke}
              strokeWidth={p.proven ? 1.4 : 1}
              strokeDasharray={p.proven ? undefined : '3 2.5'}
              style={{ filter: p.side === 'home' ? `drop-shadow(0 0 9px ${side.glow})` : 'none' }}
            />
            <text
              x={cx} y={cy + 3} textAnchor="middle"
              fill={side.text}
              fontSize={r > 15 ? 8.5 : 7} fontWeight={800} fontFamily={MONO}
            >
              {p.short.slice(0, 4)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function SharpMapLab() {
  const [yId, setYId] = useState('roi');
  const [sizeMode, setSizeMode] = useState('ratio');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('c3');

  const yOpt = Y_OPTS.find((o) => o.id === yId) || Y_OPTS[0];
  const sizeOpt = SIZE_OPTS.find((o) => o.id === sizeMode) || SIZE_OPTS[0];

  const points = useMemo(() => (
    filter === 'proven' ? FIXTURES.filter((p) => p.proven) : FIXTURES
  ), [filter]);

  const selected = useMemo(
    () => FIXTURES.find((p) => p.id === selectedId) || FIXTURES[0],
    [selectedId],
  );
  const selectedSide = SIDE[selected.side];

  const agg = useMemo(() => {
    const homeInv = FIXTURES.filter((p) => p.side === 'home').reduce((s, p) => s + p.invested, 0);
    const awayInv = FIXTURES.filter((p) => p.side === 'away').reduce((s, p) => s + p.invested, 0);
    const homeProven = FIXTURES.filter((p) => p.side === 'home' && p.proven).length;
    const awayProven = FIXTURES.filter((p) => p.side === 'away' && p.proven).length;
    const homeElite = FIXTURES.filter((p) => p.side === 'home' && p.clv >= 55 && p.roi >= 0).length;
    const awayElite = FIXTURES.filter((p) => p.side === 'away' && p.clv >= 55 && p.roi >= 0).length;
    return {
      homeInv,
      awayInv,
      homePct: Math.round((homeInv / (homeInv + awayInv)) * 100),
      homeProven,
      awayProven,
      homeElite,
      awayElite,
    };
  }, []);

  const quadOf = (p) => {
    const yVal = yId === 'roi' ? p.roi : p.wr;
    const hiX = p.clv >= 55;
    const hiY = yVal >= yOpt.breakAt;
    if (hiX && hiY) return 'elite';
    if (!hiX && hiY) return 'lucky';
    if (hiX && !hiY) return 'sharp';
    return 'noise';
  };
  const q = QUAD_COPY[quadOf(selected)];

  return (
    <div style={{
      minHeight: '100vh', background: C.page, color: C.text,
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
      padding: '36px 20px 90px',
    }}>
      <style>{MAP_CSS}</style>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.16em', color: C.gold }}>
            SANDBOX · SHARP MAP LAB
          </span>
          <span style={{ fontSize: '0.58rem', color: C.textFaint }}>fixture data — not live</span>
        </div>

        {/* ══ THE CARD ══ */}
        <div
          className="smap-reveal"
          style={{
            position: 'relative', borderRadius: 18, overflow: 'hidden',
            background: C.card, border: `1px solid ${C.border}`,
            boxShadow: '0 30px 80px -30px rgba(0,0,0,0.8)',
          }}
        >
          {/* ambient glow + top filament — same chrome as live cards */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `
              radial-gradient(130% 60% at 50% -15%, ${C.gold}28 0%, transparent 52%),
              radial-gradient(60% 30% at 85% 8%, rgba(255,255,255,0.04) 0%, transparent 55%)
            `,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, pointerEvents: 'none',
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          }} />

          {/* ── ZONE 1 · THE READ ── */}
          <div style={{ padding: '14px 18px 14px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textMuted }}>
                MLB
                <span style={{ color: C.textFaint, marginLeft: 9 }}>7:11 PM ET</span>
                <span style={{ color: C.textFaint, marginLeft: 9 }}>New York Mets @ Philadelphia Phillies</span>
              </span>
              <GoldChip>{agg.homePct}% of sharp $ on PHI</GoldChip>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 2 }}>
                  The wallet map
                </div>
                <div style={{ fontSize: '0.62rem', color: C.textMuted }}>
                  every sharp on this game · position = skill × results · size = conviction
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: C.text, letterSpacing: '-0.03em' }}>
                  {agg.homeElite}<span style={{ color: C.textMuted, fontWeight: 600 }}> v {agg.awayElite}</span>
                </div>
                <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 3 }}>elite-quadrant wallets</div>
              </div>
            </div>

            <p style={{ margin: '10px 0 0', fontSize: '0.88rem', lineHeight: 1.5, maxWidth: 520 }}>
              <span style={{ color: C.text, fontWeight: 700 }}>
                {agg.homeProven} proven winners lean Phillies, {agg.homeElite} of them from the elite quadrant.
              </span>{' '}
              <span style={{ color: '#9fabc2' }}>
                The gold cluster up-right is why this side gets our attention.
              </span>
            </p>
          </div>

          <ZoneRule />

          {/* ── ZONE 2 · THE MAP ── */}
          <div style={{ padding: '14px 18px 10px', position: 'relative' }}>
            <ZoneHead right={(
              <span style={{ fontSize: '0.58rem', color: C.textMuted, fontFeatureSettings: "'tnum'" }}>
                break {yOpt.fmt(yOpt.breakAt)} · 55% CLV
              </span>
            )}>
              THE MAP
            </ZoneHead>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, marginBottom: 10 }}>
              <Tabs options={Y_OPTS} value={yId} onChange={setYId} />
              <Tabs options={SIZE_OPTS} value={sizeMode} onChange={setSizeMode} />
              <Tabs options={FILTER_OPTS} value={filter} onChange={setFilter} />
            </div>

            <QuadrantMap
              points={points}
              yOpt={yOpt}
              sizeMode={sizeMode}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center',
              padding: '8px 2px 6px', fontSize: '0.6rem', color: C.textMuted,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: SIDE.home.solid, boxShadow: `0 0 7px ${SIDE.home.glow}` }} />
                <span style={{ color: SIDE.home.solid, fontWeight: 800 }}>Phillies</span>
                <span style={{ fontFeatureSettings: "'tnum'" }}>{fmtMoney(agg.homeInv)}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: SIDE.away.solid }} />
                <span style={{ color: SIDE.away.solid, fontWeight: 800 }}>Mets</span>
                <span style={{ fontFeatureSettings: "'tnum'" }}>{fmtMoney(agg.awayInv)}</span>
              </span>
              <span>solid ring = proven · dashed = tracking</span>
              <span style={{ marginLeft: 'auto' }}>size = {sizeOpt.hint}</span>
            </div>
          </div>

          <ZoneRule />

          {/* ── ZONE 3 · SELECTED WALLET ── */}
          <div style={{ padding: '14px 18px 16px', position: 'relative' }}>
            <ZoneHead right={(
              <span style={{
                fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.08em',
                padding: '3px 9px', borderRadius: 7,
                color: quadOf(selected) === 'elite' ? '#06100a' : C.textSec,
                background: quadOf(selected) === 'elite'
                  ? `linear-gradient(180deg, ${C.goldHi} 0%, ${C.gold} 100%)`
                  : 'rgba(255,255,255,0.06)',
                boxShadow: quadOf(selected) === 'elite' ? `0 8px 20px -10px ${C.gold}` : 'none',
              }}>
                {q.title}
              </span>
            )}>
              SELECTED WALLET
            </ZoneHead>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{
                width: 9, height: 9, borderRadius: '50%',
                background: selectedSide.solid,
                boxShadow: selected.side === 'home' ? `0 0 8px ${selectedSide.glow}` : 'none',
              }} />
              <span style={{ fontFamily: MONO, fontSize: '1.05rem', fontWeight: 800 }}>…{selected.short}</span>
              {selected.proven ? (
                <span style={{ fontSize: '0.54rem', fontWeight: 800, letterSpacing: '0.08em', color: C.green }}>PROVEN</span>
              ) : (
                <span style={{ fontSize: '0.54rem', fontWeight: 800, letterSpacing: '0.08em', color: C.textMuted }}>TRACKING</span>
              )}
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: '0.62rem', color: C.textMuted }}>
                on <span style={{ color: selectedSide.solid, fontWeight: 800 }}>{selectedSide.name}</span>
              </span>
            </div>

            <p style={{ margin: '0 0 12px', fontSize: '0.74rem', color: C.textSec, lineHeight: 1.5 }}>
              {q.blurb}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, fontFeatureSettings: "'tnum'" }}>
              {[
                { label: 'BEATS CLOSE', val: `${selected.clv}%`, hot: selected.clv >= 55 },
                { label: yId === 'roi' ? 'ROI' : 'WIN RATE', val: yId === 'roi' ? `${selected.roi >= 0 ? '+' : ''}${selected.roi}%` : `${selected.wr}%`, hot: (yId === 'roi' ? selected.roi >= 0 : selected.wr >= 52.4) },
                { label: '× USUAL', val: `${selected.sizeRatio.toFixed(1)}×`, hot: selected.sizeRatio >= 1.5 },
                { label: 'THIS TICKET', val: fmtMoney(selected.invested) },
                { label: 'SAMPLE', val: `${selected.n}` },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: '0.46rem', color: C.textFaint, letterSpacing: '0.1em', marginBottom: 4 }}>{s.label}</div>
                  <div style={{
                    fontSize: '0.95rem', fontWeight: 800, letterSpacing: '-0.02em',
                    color: s.hot ? C.gold : C.text,
                    textShadow: s.hot ? `0 0 18px ${C.gold}55` : 'none',
                  }}>
                    {s.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── FOOTER STUB — brand line, mirrors the cards ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 18px 12px', borderTop: `1px solid ${C.hairSoft}`,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.gold, boxShadow: `0 0 7px ${C.gold}` }} />
              <span style={{ fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.18em', color: C.textMuted }}>
                NHL SAVANT · SHARP MAP
              </span>
            </span>
            <span style={{ fontSize: '0.56rem', color: C.textFaint, fontFeatureSettings: "'tnum'" }}>7:06 PM ET</span>
          </div>
        </div>

        {/* design notes — outside the card, sandbox only */}
        <div style={{ marginTop: 18, padding: '0 4px', fontSize: '0.68rem', color: C.textFaint, lineHeight: 1.6 }}>
          Brand pass v2 — card chrome (ambient glow, gold filament, zone rules), champagne = our side / slate = opponent,
          underline tabs from the depth section, elite quadrant lit with a radial wash instead of a flat fill.
        </div>
      </div>
    </div>
  );
}
