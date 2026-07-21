/**
 * Locked clarity expanded body (V27 lab → production).
 * Collapsed chrome stays in LockedPositionCardView — this is expand-only.
 * Self-contained (no PositionCards imports) to avoid circular deps.
 */
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const B = {
  gold: '#D4AF37',
  goldHi: '#E8D28A',
  profit: '#2fd57e',
  loss: '#f0524f',
};
const C = {
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
  hair: 'rgba(148,163,184,0.10)',
};
const GREEN = B.profit;
const VS = '#F07167';
const BLUE = '#8BA4C8';
const GOLD = B.gold;
const GOLD_HI = B.goldHi;
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";
const LINE = 'rgba(148,163,184,0.11)';

const fmtOdds = (o) => (o == null || Number.isNaN(Number(o)) ? '—' : Number(o) > 0 ? `+${Number(o)}` : `${Number(o)}`);
const fmtMoney = (v) => {
  if (v == null || Number.isNaN(Number(v))) return '—';
  const n = Math.abs(Number(v));
  const neg = Number(v) < 0;
  if (n >= 1e6) return `${neg ? '-' : ''}$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1000) return `${neg ? '-' : ''}$${(n / 1000).toFixed(1)}K`;
  return `${neg ? '-' : ''}$${Math.round(n)}`;
};

const CLARITY_CSS = `
  @keyframes lcIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes lcDraw { from { stroke-dashoffset: 400; } to { stroke-dashoffset: 0; } }
  @keyframes lcRing { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
  .lc-in { animation: lcIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
  .lc-in-2 { animation: lcIn 0.35s cubic-bezier(0.16,1,0.3,1) 0.06s both; }
  .lc-draw { stroke-dasharray: 400; stroke-dashoffset: 400; animation: lcDraw 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
  .lc-ring { animation: lcRing 2.6s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .lc-in, .lc-in-2, .lc-draw, .lc-ring { animation: none; }
    .lc-draw { stroke-dashoffset: 0; }
  }
`;

function ClarityStyles() {
  return <style>{CLARITY_CSS}</style>;
}

function bubbleStyle(p) {
  if (p.side === 'against') return { fill: VS, stroke: '#F5A39C', text: '#1a0808' };
  if (p.qualify === 'VAULT') return { fill: GOLD, stroke: GOLD_HI, text: '#0c0a06' };
  if (p.proven) return { fill: GREEN, stroke: '#6EE7B7', text: '#042f1e' };
  return { fill: 'rgba(139,164,200,0.32)', stroke: BLUE, dash: '2.5 2', text: '#d5e0f0' };
}

function WalletMap({ wallets, selected, onSelect, gid }) {
  const plottable = wallets.filter((p) =>
    Number.isFinite(p.priorClvPct) && (Number.isFinite(p.roi) || Number.isFinite(p.dollarRoi)));
  if (plottable.length < 1) {
    return (
      <div style={{
        padding: '28px 16px', textAlign: 'center',
        fontSize: 11, color: C.textMuted, lineHeight: 1.4,
      }}>
        Not enough wallet skill data to plot this board yet.
      </div>
    );
  }

  // Room for axis titles + tick labels; plot still fills the well.
  const W = 420;
  const H = 292;
  const pad = { t: 22, r: 14, b: 44, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const roiOf = (p) => (Number.isFinite(p.roi) ? p.roi : p.dollarRoi);

  const clvs = plottable.map((p) => p.priorClvPct);
  const rois = plottable.map(roiOf);
  const xMin = Math.min(40, Math.floor(Math.min(...clvs) / 5) * 5 - 2);
  const xMax = Math.max(64, Math.ceil(Math.max(...clvs) / 5) * 5 + 2);
  const yMin = Math.min(-14, Math.floor(Math.min(...rois) / 5) * 5 - 2);
  const yMax = Math.max(26, Math.ceil(Math.max(...rois) / 5) * 5 + 2);
  const XB = 55;
  const YB = 0;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const xS = (v) => pad.l + ((clamp(v, xMin, xMax) - xMin) / (xMax - xMin)) * iw;
  const yS = (v) => pad.t + (1 - (clamp(v, yMin, yMax) - yMin) / (yMax - yMin)) * ih;
  const invMax = Math.max(...plottable.map((p) => p.invested), 1);
  const rFor = (p) => 8 + Math.sqrt((p.invested || 0) / invMax) * 16;
  const xB = xS(XB);
  const yB = yS(YB);
  const selPt = plottable.find((p) => p.short === selected);

  const xTicks = [];
  for (let v = Math.ceil(xMin / 5) * 5; v <= xMax; v += 5) xTicks.push(v);
  const yTicks = [];
  for (let v = Math.ceil(yMin / 5) * 5; v <= yMax; v += 5) yTicks.push(v);
  // Fewer tick labels when dense — keep every 10 on X if many ticks.
  const xLabelEvery = xTicks.length > 7 ? 2 : 1;
  const yLabelEvery = yTicks.length > 8 ? 2 : 1;

  const sorted = [...plottable].sort((a, b) => {
    const r = (p) => (p.short === selected ? 5 : p.qualify === 'VAULT' ? 4 : p.proven ? 3 : p.side === 'ours' ? 2 : 1);
    return r(a) - r(b);
  });

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      <defs>
        <radialGradient id={`${gid}-elite`} cx="84%" cy="14%" r="48%">
          <stop offset="0%" stopColor={GREEN} stopOpacity="0.18" />
          <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gid}-noise`} cx="14%" cy="90%" r="44%">
          <stop offset="0%" stopColor={VS} stopOpacity="0.12" />
          <stop offset="100%" stopColor={VS} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${gid}-well`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
        </linearGradient>
        <filter id={`${gid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x={pad.l} y={pad.t} width={iw} height={ih} rx={4} fill={`url(#${gid}-well)`} />
      <rect x={xB} y={pad.t} width={Math.max(0, pad.l + iw - xB)} height={Math.max(0, yB - pad.t)} fill={`url(#${gid}-elite)`} />
      <rect x={pad.l} y={yB} width={Math.max(0, xB - pad.l)} height={Math.max(0, pad.t + ih - yB)} fill={`url(#${gid}-noise)`} />

      {xTicks.map((v) => (
        <line key={`xg${v}`} x1={xS(v)} y1={pad.t} x2={xS(v)} y2={pad.t + ih} stroke="rgba(148,163,184,0.07)" />
      ))}
      {yTicks.map((v) => (
        <line key={`yg${v}`} x1={pad.l} y1={yS(v)} x2={pad.l + iw} y2={yS(v)} stroke="rgba(148,163,184,0.07)" />
      ))}

      <line x1={xB} y1={pad.t} x2={xB} y2={pad.t + ih} stroke="rgba(255,255,255,0.22)" strokeDasharray="3 4" strokeWidth={1.2} />
      <line x1={pad.l} y1={yB} x2={pad.l + iw} y2={yB} stroke="rgba(255,255,255,0.22)" strokeDasharray="3 4" strokeWidth={1.2} />
      <line x1={pad.l} y1={pad.t + ih} x2={pad.l + iw} y2={pad.t + ih} stroke="rgba(168,176,191,0.45)" strokeWidth={1.4} />
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + ih} stroke="rgba(168,176,191,0.45)" strokeWidth={1.4} />

      <text x={xB + (pad.l + iw - xB) / 2} y={pad.t + 16} textAnchor="middle"
        fill={GREEN} fillOpacity={0.75} fontSize={11} fontFamily={MONO} fontWeight={800} letterSpacing="0.14em">
        ELITE
      </text>
      <text x={pad.l + (xB - pad.l) / 2} y={pad.t + ih - 10} textAnchor="middle"
        fill={VS} fillOpacity={0.7} fontSize={11} fontFamily={MONO} fontWeight={800} letterSpacing="0.12em">
        NOISE
      </text>

      {/* Axis titles — clear of the plot */}
      <text x={pad.l + iw / 2} y={H - 10} textAnchor="middle"
        fill={C.textSec} fontSize={11} fontWeight={700} letterSpacing="0.04em">
        Beat the closing line →
      </text>
      <text
        x={13}
        y={pad.t + ih / 2}
        textAnchor="middle"
        fill={C.textSec}
        fontSize={11}
        fontWeight={700}
        letterSpacing="0.04em"
        transform={`rotate(-90 13 ${pad.t + ih / 2})`}
      >
        Lifetime ROI →
      </text>

      {xTicks.map((v, i) => {
        if (i % xLabelEvery !== 0 && v !== XB && v !== xMin && v !== xMax) return null;
        return (
          <text key={`xt${v}`} x={xS(v)} y={pad.t + ih + 18} textAnchor="middle"
            fill={v === XB ? C.text : C.textMuted} fontSize={11} fontFamily={MONO} fontWeight={v === XB ? 700 : 550}>
            {v}%
          </text>
        );
      })}
      {yTicks.map((v, i) => {
        if (i % yLabelEvery !== 0 && v !== 0 && v !== yMin && v !== yMax) return null;
        return (
          <text key={`yt${v}`} x={pad.l - 8} y={yS(v) + 4} textAnchor="end"
            fill={v === 0 ? C.text : C.textMuted} fontSize={11} fontFamily={MONO} fontWeight={v === 0 ? 700 : 550}>
            {v > 0 ? `+${v}` : v}
          </text>
        );
      })}

      {selPt && (
        <g opacity={0.15}>
          <line x1={pad.l} y1={yS(roiOf(selPt))} x2={pad.l + iw} y2={yS(roiOf(selPt))} stroke={GOLD} strokeWidth={1} />
          <line x1={xS(selPt.priorClvPct)} y1={pad.t} x2={xS(selPt.priorClvPct)} y2={pad.t + ih} stroke={GOLD} strokeWidth={1} />
        </g>
      )}

      {sorted.map((p) => {
        const cx = xS(p.priorClvPct);
        const cy = yS(roiOf(p));
        const r = rFor(p);
        const st = bubbleStyle(p);
        const sel = selected === p.short;
        return (
          <g key={`${p.side}-${p.short}`} onClick={() => onSelect(p.short)} style={{ cursor: 'pointer' }} opacity={sel ? 1 : 0.45}>
            <circle cx={cx} cy={cy} r={Math.max(r + 8, 16)} fill="transparent" />
            {sel && (
              <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={GOLD_HI} strokeWidth={1.3} className="lc-ring" />
            )}
            <circle
              cx={cx} cy={cy} r={r}
              fill={st.fill} stroke={sel ? GOLD_HI : st.stroke}
              strokeWidth={sel ? 1.7 : 1.25}
              strokeDasharray={sel ? undefined : st.dash}
              filter={sel ? `url(#${gid}-glow)` : undefined}
            />
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill={st.text}
              fontSize={r >= 12 ? 9 : 7.5} fontFamily={MONO} fontWeight={800}
              style={{ pointerEvents: 'none' }}>
              {p.short.slice(0, 2)}
            </text>
            {sel && (
              <text x={cx} y={cy - r - 7} textAnchor="middle" fill={GOLD_HI}
                fontSize={11} fontFamily={MONO} fontWeight={700} style={{ pointerEvents: 'none' }}>
                {fmtMoney(p.invested)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function OddsPath({ journey, fair, clvPct, gid }) {
  const pts = (Array.isArray(journey) ? journey : []).filter(Number.isFinite);
  if (pts.length < 2) return null;
  const vals = pts.map((p) => -p);
  const fairV = Number.isFinite(fair) ? -fair : vals[0];
  const allV = [...vals, fairV];
  const vMax = Math.max(...allV) + 2;
  const vMin = Math.min(...allV) - 2;
  const span = vMax - vMin || 1;
  const w = 360;
  const h = 64;
  const padX = 10;
  const padTop = 16;
  const padBot = 18;
  const plotW = w - padX * 2;
  const plotH = h - padTop - padBot;
  const yS = (v) => padTop + (1 - (v - vMin) / span) * plotH;
  const xS = (i) => padX + (i / (vals.length - 1)) * plotW;
  const coords = vals.map((v, i) => [xS(i), yS(v)]);
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${coords[coords.length - 1][0]},${h - padBot} L${padX},${h - padBot} Z`;
  const last = coords[coords.length - 1];
  const fairY = yS(fairV);
  const color = clvPct >= 0 ? GREEN : VS;
  const startOdds = pts[0];
  const endOdds = pts[pts.length - 1];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id={`${gid}-odds`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={padX} y1={fairY} x2={w - padX} y2={fairY} stroke={GOLD} strokeWidth={1.15} strokeDasharray="4 3" opacity={0.8} />
      <text x={w - padX} y={Math.max(11, fairY - 5)} textAnchor="end" fill={GOLD} fontSize={10} fontFamily={MONO} fontWeight={700}>
        FAIR {fmtOdds(fair)}
      </text>
      <path d={area} fill={`url(#${gid}-odds)`} />
      <path className="lc-draw" d={line} fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[0][0]} cy={coords[0][1]} r={2.6} fill={GOLD} />
      <circle cx={last[0]} cy={last[1]} r={3.2} fill={color} stroke="#0B0F18" strokeWidth={1} />
      <text x={padX} y={h - 4} textAnchor="start" fill={C.textMuted} fontSize={10} fontFamily={MONO} fontWeight={600}>
        {fmtOdds(startOdds)}
      </text>
      <text x={w - padX} y={h - 4} textAnchor="end" fill={color} fontSize={10} fontFamily={MONO} fontWeight={700}>
        {fmtOdds(endOdds)}
      </text>
    </svg>
  );
}

function SizePath({ baseU, finalU, tapeAction, tracked }) {
  const action = tapeAction === 'boost' ? 'boost'
    : tapeAction === 'mute' ? 'mute'
    : 'hold';
  // Half = held but ticket is meaningfully under base (tape soft-cut / half-stake).
  const isHalf = action === 'hold'
    && Number.isFinite(baseU) && Number.isFinite(finalU)
    && baseU > 0 && finalU > 0 && finalU < baseU * 0.85;
  const steps = [
    { id: 'mute', label: 'Mute', on: action === 'mute', color: VS },
    { id: 'half', label: 'Half', on: isHalf, color: '#F0D78C' },
    { id: 'hold', label: 'Hold', on: action === 'hold' && !isHalf, color: GOLD },
    { id: 'boost', label: 'Boost', on: action === 'boost', color: GREEN },
  ];
  const active = steps.find((s) => s.on) || steps[2];

  return (
    <div style={{
      height: '100%',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '8px 10px',
      borderRadius: 9,
      background: 'rgba(0,0,0,0.28)',
      border: `1px solid ${LINE}`,
      fontFeatureSettings: "'tnum'",
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: C.textMuted }}>
          SIZE PATH
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: active.color }}>
          {tracked ? 'No ticket' : active.label}
        </span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginBottom: 8,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.textSec }}>
          {Number.isFinite(baseU) ? `${baseU.toFixed(1)}u` : '—'}
        </span>
        <span style={{ fontSize: 9, color: C.textFaint }}>base</span>
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontSize: 9, color: C.textFaint }}>ticket</span>
        <span style={{
          fontSize: 14, fontWeight: 800, color: tracked ? C.textMuted : GOLD_HI,
        }}>
          {tracked ? '0u' : (Number.isFinite(finalU) ? `${finalU.toFixed(1)}u` : '—')}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4 }}>
        {steps.map((s) => (
          <div
            key={s.id}
            style={{
              textAlign: 'center',
              padding: '6px 2px',
              borderRadius: 6,
              fontSize: 9,
              fontWeight: s.on ? 800 : 550,
              color: s.on ? (s.id === 'mute' ? '#1a0808' : '#0A0E14') : C.textFaint,
              background: s.on ? s.color : 'rgba(255,255,255,0.03)',
              border: s.on ? 'none' : `1px solid ${LINE}`,
              boxShadow: s.on ? `0 0 12px -4px ${s.color}` : 'none',
            }}
          >
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactTape({ tapeScore, tapeAction, edge }) {
  const hasTape = Number.isFinite(tapeScore);
  const action = tapeAction === 'boost' ? 'boost'
    : tapeAction === 'mute' ? 'mute'
    : 'keep';
  const MIN = -2, MAX = 4.5, MUTE_AT = 0, BOOST_AT = 2.89;
  const clamp = hasTape ? Math.max(MIN, Math.min(MAX, tapeScore)) : 0;
  const pctOf = (v) => ((v - MIN) / (MAX - MIN)) * 100;
  const needle = hasTape ? pctOf(clamp) : pctOf(1);
  const color = action === 'boost' ? GREEN : action === 'mute' ? VS : GOLD_HI;
  const headline = action === 'boost' ? 'Sized up' : action === 'mute' ? 'Passing' : 'Standard';
  const edgeHot = Number.isFinite(edge) && edge >= 2;
  const edgeColor = !Number.isFinite(edge) ? C.textMuted : edge >= 0 ? GREEN : VS;

  return (
    <div style={{
      marginTop: 8,
      padding: '10px 11px 11px',
      borderRadius: 9,
      background: 'rgba(0,0,0,0.28)',
      border: `1px solid ${LINE}`,
      fontFeatureSettings: "'tnum'",
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: C.textMuted }}>
          TAPE · STRENGTH
        </span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {Number.isFinite(edge) && (
            <span style={{
              fontSize: 11, fontWeight: 800, color: edgeColor,
              padding: edgeHot ? '3px 8px' : 0,
              borderRadius: 5,
              background: edgeHot ? 'rgba(52,211,153,0.12)' : 'transparent',
              border: edgeHot ? '1px solid rgba(52,211,153,0.28)' : 'none',
            }}>
              EDGE {edge >= 0 ? '+' : ''}{edge.toFixed(1)}
            </span>
          )}
          {hasTape && (
            <span style={{ fontSize: 12, fontWeight: 800, color }}>{headline}</span>
          )}
        </div>
      </div>

      {hasTape ? (
        <>
          <div style={{ position: 'relative', height: 7, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${pctOf(MUTE_AT)}%`, background: `linear-gradient(90deg, ${VS}55, ${VS}18)` }} />
            <div style={{ width: `${pctOf(BOOST_AT) - pctOf(MUTE_AT)}%`, background: 'rgba(240,215,140,0.18)' }} />
            <div style={{ flex: 1, background: `linear-gradient(90deg, ${GREEN}18, ${GREEN}55)` }} />
            <div style={{
              position: 'absolute', left: `${needle}%`, top: -2, bottom: -2, width: 2.5,
              transform: 'translateX(-50%)', background: '#fff', borderRadius: 2,
              boxShadow: `0 0 10px ${color}`,
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 6,
            fontSize: 9, fontWeight: 600, color: C.textFaint,
          }}>
            <span style={{ color: action === 'mute' ? VS : C.textFaint }}>Pass</span>
            <span style={{
              fontFamily: MONO, fontWeight: 700, color,
            }}>
              {tapeScore > 0 ? '+' : ''}{tapeScore.toFixed(1)}
            </span>
            <span style={{ color: action === 'boost' ? GREEN : C.textFaint }}>Sized up</span>
          </div>
        </>
      ) : (
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 550 }}>
          {Number.isFinite(edge)
            ? `EDGE ${edge >= 0 ? '+' : ''}${edge.toFixed(1)} · tape score not stamped on this ticket`
            : 'Tape / EDGE not available on this ticket'}
        </div>
      )}
    </div>
  );
}

function GapCell({ label, value, first }) {
  return (
    <div style={{
      padding: '7px 4px 8px',
      textAlign: 'center',
      borderLeft: first ? 'none' : '1px solid rgba(240,113,103,0.14)',
    }}>
      <div style={{ fontSize: 8, fontWeight: 600, color: C.textMuted, marginBottom: 3 }}>{label}</div>
      <div style={{
        fontSize: 13, fontWeight: 700, color: VS, fontFeatureSettings: "'tnum'",
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
    </div>
  );
}

function Pill({ children, c, solid }) {
  return (
    <span style={{
      fontSize: 8, fontWeight: 700, letterSpacing: '0.04em',
      padding: '1.5px 5px', borderRadius: 3,
      background: solid ? c : `${c}16`,
      color: solid ? '#042f1e' : c,
      border: solid ? 'none' : `1px solid ${c}40`,
    }}>
      {children}
    </span>
  );
}

function fmtGap(v, suffix = '%') {
  if (!Number.isFinite(v)) return '—';
  return `${v}${suffix}`;
}

/**
 * @param {object} props
 * @param {object} props.f — locked card fixture
 * @param {() => void} props.onCollapse
 * @param {boolean} props.tracked
 * @param {React.ReactNode} props.statusSlot — TRACKED / graded / tier + freeze pills
 * @param {boolean} props.ticketFrozen
 * @param {string} props.accent
 */
export default function LockedClarityExpanded({
  f,
  onCollapse,
  tracked,
  statusSlot,
  ticketFrozen,
  accent,
}) {
  const all = (Array.isArray(f.mapWallets) && f.mapWallets.length
    ? f.mapWallets
    : (f.wallets || []).map((w) => ({ ...w, side: 'ours' })));

  const defaultSel = all.find((w) => w.qualify === 'VAULT' && w.side === 'ours')?.short
    || all.find((w) => w.proven && w.side === 'ours')?.short
    || all.find((w) => w.side === 'ours')?.short
    || all[0]?.short
    || null;

  const [sel, setSel] = useState(defaultSel);
  const selected = all.find((w) => w.short === sel) || all[0] || null;
  const clvGood = Number.isFinite(f.clvPct) ? f.clvPct >= 0 : true;
  const gid = `lc-${String(f.id || 'x').replace(/[^a-zA-Z0-9-_]/g, '')}`;

  const provenUsd = all.filter((w) => w.side === 'ours' && w.proven).reduce((s, w) => s + (w.invested || 0), 0);
  const secondaryUsd = all.filter((w) => w.side === 'ours' && !w.proven && w.skillEligible).reduce((s, w) => s + (w.invested || 0), 0);
  const againstUsd = all.filter((w) => w.side === 'against').reduce((s, w) => s + (w.invested || 0), 0);
  const oursUsd = provenUsd + secondaryUsd;
  const board = oursUsd + againstUsd || 1;
  const provenPct = Math.round((provenUsd / board) * 100);
  const secondaryPct = Math.round((secondaryUsd / board) * 100);
  const againstPct = Math.max(0, 100 - provenPct - secondaryPct);
  // Board share from wallet $ on this card — never a stamp that can disagree.
  const boardSharePct = Math.round((oursUsd / board) * 100);
  const unopposed = againstUsd <= 0;

  const against = f.against || {
    abbr: '—', invested: againstUsd, avgWr: null, avgClv: null, avgRoi: null,
  };
  const againstProvenN = all.filter((w) => w.side === 'against' && w.proven).length;
  const againstSecondaryN = all.filter((w) => w.side === 'against' && !w.proven).length;
  const provenN = all.filter((w) => w.side === 'ours' && w.proven).length;
  const secondaryN = all.filter((w) => w.side === 'ours' && !w.proven && w.skillEligible).length;
  const againstN = all.filter((w) => w.side === 'against').length;

  const vault = selected?.qualify === 'VAULT';
  const againstSel = selected?.side === 'against';
  // Size vs usual: ratio and usual $ from the same identity (invested / ratio).
  const sizeRatio = Number.isFinite(selected?.sizeRatio) && selected.sizeRatio > 0
    ? selected.sizeRatio
    : (Number.isFinite(selected?.avgSportBet) && selected.avgSportBet > 0 && selected.invested > 0
      ? selected.invested / selected.avgSportBet
      : null);
  const sizeUsual = Number.isFinite(sizeRatio) && sizeRatio > 0 && selected?.invested > 0
    ? selected.invested / sizeRatio
    : (Number.isFinite(selected?.avgSportBet) ? selected.avgSportBet : null);
  const sizeHot = Number.isFinite(sizeRatio) && sizeRatio >= 1.5;
  const beatHot = Number.isFinite(selected?.priorClvPct) && selected.priorClvPct >= 55;
  const leadAccent = againstSel ? VS : vault ? GOLD : selected?.proven ? GREEN : BLUE;

  const ours = all.filter((w) => w.side === 'ours');
  const isBiggest = selected && [...ours].sort((a, b) => (b.invested || 0) - (a.invested || 0))[0]?.short === selected.short;

  const headline = !selected
    ? 'No wallets on the board'
    : againstSel
      ? 'On the other side — weak track record'
      : isBiggest && selected.proven
        ? 'This is the lead wallet on this play'
        : selected.proven
          ? 'A proven winner on this side'
          : 'Secondary wallet — on the board, not the stake path';

  const sharpUsd = f.sharpUsd || f.sideInvested || oursUsd || 0;
  const journey = Array.isArray(f.journey) && f.journey.length >= 2
    ? f.journey
    : [f.lockOdds, f.peakOdds, f.nowOdds].filter(Number.isFinite);
  const fairOdds = f.fairLine ?? f.fairOdds;
  const tier = f.tierPerf;

  const cardBorder = tracked
    ? 'rgba(139,150,171,0.24)'
    : f.graded
      ? `${accent}55`
      : 'rgba(212,175,55,0.30)';

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0) 42%), linear-gradient(180deg, #161B29 0%, #10141F 55%, #0D111C 100%)',
      border: `1px solid ${cardBorder}`,
      position: 'relative',
      boxShadow: '0 24px 60px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05)',
      color: C.text,
    }}>
      <ClarityStyles />
      <div style={{
        position: 'absolute', top: 0, left: '12%', right: '12%', height: 1.5, pointerEvents: 'none', zIndex: 2,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.85,
      }} />

      {/* 1. THE PLAY — hero ticket strip */}
      <div className="lc-in" style={{
        padding: '14px 14px 12px',
        background: `
          radial-gradient(90% 80% at 12% 0%, rgba(212,175,55,0.16) 0%, transparent 55%),
          linear-gradient(180deg, rgba(255,255,255,0.035) 0%, transparent 70%)
        `,
        borderBottom: '1px solid rgba(212,175,55,0.16)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8,
        }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: C.textMuted, minWidth: 0 }}>
            {f.sport}
            <span style={{ color: C.textFaint }}> · {f.away} @ {f.home}</span>
            {f.gameTime && <span style={{ color: C.textFaint }}> · {f.gameTime}</span>}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {statusSlot}
            <button
              type="button"
              onClick={onCollapse}
              aria-label="Collapse"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: '50%', cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.hair}`,
                color: C.textMuted, padding: 0,
              }}
            >
              <ChevronDown size={13} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
          fontFeatureSettings: "'tnum'",
        }}>
          <span style={{
            fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05,
          }}>
            {f.pickLabel}
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.textSec }}>{fmtOdds(f.lockOdds)}</span>
          {!tracked && f.units > 0 && (
            <span style={{
              fontSize: 15, fontWeight: 800, color: '#0A0E14',
              padding: '3px 9px', borderRadius: 6,
              background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD})`,
              boxShadow: '0 6px 18px -8px rgba(212,175,55,0.85)',
            }}>
              {f.units.toFixed(1)}u
            </span>
          )}
          {tracked && (
            <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted }}>No ticket</span>
          )}
          {ticketFrozen && !tracked && !f.graded && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 8, fontWeight: 800, letterSpacing: '0.08em',
              padding: '3px 8px', borderRadius: 999, color: '#06140c',
              background: 'linear-gradient(180deg, #6EE7B7 0%, #34D399 100%)',
            }}>
              <Check size={8} strokeWidth={3.2} />
              SET
            </span>
          )}
        </div>

        <div style={{
          marginTop: 12,
          padding: '10px 12px',
          borderRadius: 10,
          background: unopposed
            ? 'linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(0,0,0,0.25) 70%)'
            : 'rgba(0,0,0,0.28)',
          border: unopposed
            ? '1px solid rgba(52,211,153,0.28)'
            : `1px solid ${LINE}`,
          display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
          fontFeatureSettings: "'tnum'",
        }}>
          <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.035em' }}>{fmtMoney(sharpUsd)}</span>
          {oursUsd > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 800, letterSpacing: '0.04em',
              color: unopposed ? '#042f1e' : GREEN,
              padding: '3px 8px', borderRadius: 5,
              background: unopposed ? GREEN : 'rgba(52,211,153,0.12)',
              border: unopposed ? 'none' : '1px solid rgba(52,211,153,0.28)',
            }}>
              {unopposed ? 'UNOPPOSED' : `${boardSharePct}% OF BOARD`}
            </span>
          )}
          {f.lockedAt && (
            <span style={{ fontSize: 10, color: C.textFaint, marginLeft: 'auto' }}>{f.lockedAt}</span>
          )}
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ height: 3, borderRadius: 2, overflow: 'hidden', display: 'flex', background: 'rgba(0,0,0,0.45)' }}>
            {provenPct > 0 && <div style={{ width: `${provenPct}%`, background: GREEN }} />}
            {secondaryPct > 0 && <div style={{ width: `${secondaryPct}%`, background: BLUE }} />}
            {againstPct > 0 && <div style={{ width: `${againstPct}%`, background: VS }} />}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 5, gap: 8,
            fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', fontFeatureSettings: "'tnum'",
          }}>
            {provenPct > 0 && <span style={{ color: GREEN }}>Proven money {provenPct}%</span>}
            {secondaryPct > 0 && <span style={{ color: BLUE }}>Secondary {secondaryPct}%</span>}
            {againstPct > 0
              ? <span style={{ color: VS }}>Against {againstPct}%</span>
              : <span style={{ color: GREEN, marginLeft: 'auto' }}>Unopposed</span>}
          </div>
        </div>
      </div>

      {/* 2–4. MAP + LEAD + OTHER SIDE */}
      <div className="lc-in-2" style={{ padding: '0 10px' }}>
        <div style={{
          borderRadius: 12,
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.48)',
          border: '1px solid rgba(212,175,55,0.18)',
        }}>
          <div style={{ padding: '10px 12px 4px' }}>
            <div style={{
              fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: GOLD,
              marginBottom: 6,
            }}>
              WHERE THE MONEY SITS
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginBottom: 4,
              fontSize: 10, fontWeight: 550, color: C.textSec,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <i style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN, display: 'inline-block' }} />
                Proven ({provenN})
              </span>
              {secondaryN > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <i style={{
                    width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
                    border: `1.5px dashed ${BLUE}`, boxSizing: 'border-box',
                  }} />
                  Secondary ({secondaryN})
                </span>
              )}
              {againstN > 0 ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <i style={{ width: 7, height: 7, borderRadius: '50%', background: VS, display: 'inline-block' }} />
                  Against ({againstN})
                </span>
              ) : (
                <span style={{ color: GREEN, fontWeight: 700 }}>Unopposed</span>
              )}
              <span style={{ color: C.textFaint }}>· size = $</span>
            </div>
          </div>

          <div style={{ padding: '2px 4px 6px' }}>
            <WalletMap wallets={all} selected={sel} onSelect={setSel} gid={gid} />
          </div>

          {selected && (
            <div style={{
              borderTop: `1px solid ${LINE}`,
              padding: '10px 12px 11px',
              borderLeft: `3px solid ${leadAccent}`,
              background: againstSel
                ? 'rgba(240,113,103,0.06)'
                : vault ? 'rgba(212,175,55,0.07)' : 'rgba(52,211,153,0.04)',
            }}>
              <div style={{
                fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em',
                color: leadAccent, marginBottom: 6,
              }}>
                {againstSel ? 'SELECTED · OTHER SIDE' : '① LEAD WALLET'}
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700 }}>…{selected.short}</span>
                    {againstSel ? <Pill c={VS}>Against</Pill>
                      : selected.proven ? <Pill c={GREEN} solid>Proven</Pill>
                        : <Pill c={BLUE}>Secondary</Pill>}
                    {vault && !againstSel && <Pill c={GOLD}>Vault</Pill>}
                  </div>
                  <div style={{
                    marginTop: 5, fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}>
                    {headline}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, fontFeatureSettings: "'tnum'" }}>
                  <div style={{
                    fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em',
                    color: againstSel ? VS : vault ? GOLD_HI : C.text,
                  }}>
                    {fmtMoney(selected.invested)}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 500, color: C.textMuted, marginTop: 2 }}>
                    on this play
                  </div>
                </div>
              </div>

              {!againstSel && (
                <div style={{
                  marginTop: 10,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                }}>
                  <div style={{
                    padding: '9px 10px', borderRadius: 8,
                    background: 'rgba(0,0,0,0.32)', border: `1px solid ${LINE}`,
                  }}>
                    <div style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: C.textMuted, marginBottom: 6,
                      textTransform: 'uppercase',
                    }}>
                      Why we trust them
                    </div>
                    <div style={{
                      fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
                      fontFeatureSettings: "'tnum'", marginBottom: 2,
                    }}>
                      {selected.record || '—'}
                    </div>
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: GREEN, fontFeatureSettings: "'tnum'",
                    }}>
                      {Number.isFinite(selected.roi) ? `${selected.roi >= 0 ? '+' : ''}${selected.roi}% ROI` : '—'}
                      {Number.isFinite(selected.wr) ? ` · ${selected.wr}% wins` : ''}
                    </div>
                  </div>
                  <div style={{
                    padding: '9px 10px', borderRadius: 8,
                    background: beatHot ? 'rgba(52,211,153,0.08)' : 'rgba(0,0,0,0.32)',
                    border: `1px solid ${beatHot ? 'rgba(52,211,153,0.25)' : LINE}`,
                  }}>
                    <div style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: C.textMuted, marginBottom: 6,
                      textTransform: 'uppercase',
                    }}>
                      Price skill
                    </div>
                    <div style={{
                      fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
                      fontFeatureSettings: "'tnum'", color: beatHot ? GREEN : C.text,
                      marginBottom: 2,
                    }}>
                      {Number.isFinite(selected.priorClvPct) ? `${selected.priorClvPct}%` : '—'}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: C.textSec, lineHeight: 1.3 }}>
                      Beat the closing line
                    </div>
                  </div>
                </div>
              )}

              {againstSel && (
                <div style={{
                  marginTop: 10, padding: '9px 10px', borderRadius: 8,
                  background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(240,113,103,0.2)',
                  fontFeatureSettings: "'tnum'",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{selected.record || '—'}</div>
                  <div style={{ marginTop: 3, fontSize: 12, color: VS, fontWeight: 600 }}>
                    {Number.isFinite(selected.wr) ? `${selected.wr}% wins` : '—'}
                    {Number.isFinite(selected.roi) ? ` · ${selected.roi}% ROI` : ''}
                    {Number.isFinite(selected.priorClvPct) ? ` · beat close ${selected.priorClvPct}%` : ''}
                  </div>
                </div>
              )}

              {!againstSel && Number.isFinite(sizeRatio) && Number.isFinite(selected.invested) && selected.invested > 0 && (
                <div style={{ marginTop: 9 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    marginBottom: 5, fontFeatureSettings: "'tnum'",
                  }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: C.textMuted,
                      textTransform: 'uppercase',
                    }}>
                      Size vs usual
                    </span>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: sizeHot ? GREEN : GOLD_HI,
                    }}>
                      {sizeRatio.toFixed(1)}×
                    </span>
                  </div>
                  <div style={{
                    height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)',
                    position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 2, overflow: 'hidden',
                      background: `linear-gradient(90deg, rgba(255,255,255,0.04), ${sizeHot ? GREEN : GOLD})`,
                    }} />
                    {Number.isFinite(sizeUsual) && sizeUsual > 0 && (
                      <div style={{
                        position: 'absolute',
                        left: `${Math.min(92, (sizeUsual / selected.invested) * 100)}%`,
                        top: -2, bottom: -2, width: 2, borderRadius: 1,
                        background: C.text, transform: 'translateX(-50%)',
                        boxShadow: '0 0 8px rgba(255,255,255,0.35)',
                      }} />
                    )}
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', marginTop: 4,
                    fontSize: 10, fontWeight: 550, color: C.textMuted, fontFeatureSettings: "'tnum'",
                  }}>
                    <span>usual {fmtMoney(sizeUsual)}</span>
                    <span style={{ color: sizeHot ? GREEN : C.textSec }}>this {fmtMoney(selected.invested)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OTHER SIDE */}
          <div style={{
            borderTop: unopposed
              ? '1px solid rgba(52,211,153,0.22)'
              : '1px solid rgba(240,113,103,0.22)',
            background: unopposed
              ? 'rgba(52,211,153,0.06)'
              : 'rgba(240,113,103,0.05)',
            padding: '8px 12px 9px',
          }}>
            {unopposed ? (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              }}>
                <div>
                  <div style={{
                    fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: GREEN,
                    marginBottom: 4,
                  }}>
                    ② OTHER SIDE · {against.abbr || '—'}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: GREEN, letterSpacing: '-0.01em' }}>
                    Unopposed
                  </div>
                  <div style={{ marginTop: 2, fontSize: 11, fontWeight: 500, color: C.textSec, lineHeight: 1.35 }}>
                    No sharp money on the other side of this board.
                  </div>
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 700, color: GREEN, fontFeatureSettings: "'tnum'", flexShrink: 0,
                }}>
                  $0
                </span>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                  marginBottom: 7,
                }}>
                  <span style={{
                    fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: VS,
                  }}>
                    ② OTHER SIDE · {against.abbr || '—'}
                  </span>
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: VS, fontFeatureSettings: "'tnum'",
                  }}>
                    {fmtMoney(against.invested ?? againstUsd)}
                  </span>
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 0, borderRadius: 7, overflow: 'hidden',
                  background: 'rgba(0,0,0,0.28)',
                  border: '1px solid rgba(240,113,103,0.18)',
                }}>
                  <GapCell label="Win rate" value={fmtGap(against.avgWr)} first />
                  <GapCell label="Beat close" value={fmtGap(against.avgClv)} />
                  <GapCell label="ROI" value={fmtGap(against.avgRoi)} />
                </div>
                <div style={{
                  marginTop: 5, fontSize: 10, fontWeight: 550, color: VS,
                  fontFeatureSettings: "'tnum'",
                }}>
                  {againstProvenN} proven · {againstSecondaryN} secondary
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 5. PRICE + SIZE PATH + TAPE */}
      <div className="lc-in-2" style={{ padding: '12px 14px 6px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 8, fontFeatureSettings: "'tnum'",
        }}>
          <div>
            <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: C.textMuted }}>
              ③ PRICE & SIZE
            </span>
            <span style={{ marginLeft: 8, fontSize: 15, fontWeight: 650 }}>{fmtOdds(f.gotOdds ?? f.lockOdds)}</span>
            {Number.isFinite(f.hcMargin) && (
              <span style={{ marginLeft: 10, fontSize: 11, fontWeight: 650, color: C.textMuted }}>
                HC <span style={{ color: GREEN, fontWeight: 800 }}>{f.hcMargin >= 0 ? '+' : ''}{f.hcMargin}</span>
              </span>
            )}
          </div>
          {Number.isFinite(f.clvPct) && (
            <span style={{ fontSize: 12, fontWeight: 700, color: clvGood ? GREEN : VS }}>
              {clvGood ? '+' : ''}{f.clvPct.toFixed(1)}% vs close
            </span>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: journey.length >= 2 ? '1.15fr 1fr' : '1fr',
          gap: 8,
          alignItems: 'stretch',
        }}>
          {journey.length >= 2 && (
            <div style={{
              borderRadius: 9, padding: '10px 10px 8px',
              background: 'rgba(0,0,0,0.28)', border: `1px solid ${LINE}`,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.1em',
                color: C.textMuted, marginBottom: 6,
              }}>
                PRICE JOURNEY
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <OddsPath journey={journey} fair={fairOdds} clvPct={f.clvPct ?? 0} gid={gid} />
              </div>
            </div>
          )}
          <SizePath
            baseU={f.pathBaseUnits}
            finalU={f.units}
            tapeAction={f.tapeAction}
            tracked={tracked}
          />
        </div>

        <CompactTape
          tapeScore={f.tapeScore}
          tapeAction={f.tapeAction}
          edge={f.edge}
        />
      </div>

      {tier && tier.n > 0 && tier.wr != null && (
        <div style={{
          margin: '8px 10px 14px',
          padding: '8px 11px',
          borderRadius: 9,
          display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 10px',
          background: 'rgba(212,175,55,0.07)',
          border: '1px solid rgba(212,175,55,0.2)',
          fontFeatureSettings: "'tnum'",
        }}>
          <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: GOLD }}>
            {tier.label} · {tier.window}
          </span>
          <span style={{ fontSize: 12, fontWeight: 650 }}>{tier.record}</span>
          <span style={{ fontSize: 11, color: C.textSec }}>{tier.wr}% W</span>
          {Number.isFinite(tier.roi) && (
            <span style={{ fontSize: 12, fontWeight: 700, color: tier.roi >= 0 ? GREEN : VS }}>
              {tier.roi >= 0 ? '+' : ''}{tier.roi}%
            </span>
          )}
          <span style={{ fontSize: 10, color: C.textFaint, marginLeft: 'auto' }}>n={tier.n}</span>
        </div>
      )}
    </div>
  );
}
