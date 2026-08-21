/**
 * Locked clarity expanded body (V27 lab → production).
 * Collapsed chrome stays in LockedPositionCardView — this is expand-only.
 * Self-contained (no PositionCards imports) to avoid circular deps.
 */
import { useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { matchSizeRatioBand } from '../../../lib/sizeRatioBands.js';
import {
  ELITE_ZONE_CLV,
  ELITE_ZONE_ROI,
  isEliteZoneWallet,
  isTopQWallet,
  walletRoiForPlot,
} from './mapPositionCard.js';
import OddsLimitSpark from './OddsLimitSpark';
import LockedSignalsRow from './LockedSignalsRow';
import SteamTag from './SteamTag';

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

const fmtOdds = (o) => {
  const n = Number(o);
  // 0 is “missing stamp”, not even money — never render as “0”.
  if (o == null || !Number.isFinite(n) || n === 0) return '—';
  return n > 0 ? `+${n}` : `${n}`;
};
const fmtMoney = (v) => {
  if (v == null || Number.isNaN(Number(v))) return '—';
  const n = Math.abs(Number(v));
  const neg = Number(v) < 0;
  if (n >= 1e6) return `${neg ? '-' : ''}$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1000) return `${neg ? '-' : ''}$${(n / 1000).toFixed(1)}K`;
  return `${neg ? '-' : ''}$${Math.round(n)}`;
};

const EDGE_AURA_BORDER = 'rgba(232,210,138,0.78)';
const EDGE_AURA_SHADOW_IDLE =
  '0 0 0 1px rgba(232,210,138,0.42), 0 0 18px -2px rgba(212,175,55,0.55), 0 0 40px -8px rgba(212,175,55,0.32), 0 24px 60px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05)';

const CLARITY_CSS = `
  @keyframes lcIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes lcDraw { from { stroke-dashoffset: 400; } to { stroke-dashoffset: 0; } }
  @keyframes lcRing { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
  @keyframes lcGoldAura {
    0%, 100% {
      box-shadow: 0 0 0 1px rgba(232,210,138,0.40), 0 0 16px -2px rgba(212,175,55,0.48), 0 0 36px -8px rgba(212,175,55,0.26), 0 24px 60px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05);
    }
    50% {
      box-shadow: 0 0 0 1px rgba(232,210,138,0.72), 0 0 24px -1px rgba(212,175,55,0.72), 0 0 52px -6px rgba(212,175,55,0.42), 0 24px 60px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05);
    }
  }
  .lc-in { animation: lcIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
  .lc-in-2 { animation: lcIn 0.35s cubic-bezier(0.16,1,0.3,1) 0.06s both; }
  .lc-draw { stroke-dasharray: 400; stroke-dashoffset: 400; animation: lcDraw 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
  .lc-ring { animation: lcRing 2.6s ease-in-out infinite; }
  .sf-edge-aura { animation: lcGoldAura 2.8s ease-in-out infinite; }
  .lc-tape-size { display: grid; grid-template-columns: 1.15fr 1fr; gap: 8px; align-items: stretch; }
  @media (max-width: 420px) {
    .lc-tape-size { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    .lc-in, .lc-in-2, .lc-draw, .lc-ring, .sf-edge-aura { animation: none; }
    .sf-edge-aura { box-shadow: ${EDGE_AURA_SHADOW_IDLE} !important; }
    .lc-draw { stroke-dashoffset: 0; }
  }
`;

function ClarityStyles() {
  return <style>{CLARITY_CSS}</style>;
}

function bubbleStyle(p) {
  if (p.plotIncomplete) {
    return { fill: 'rgba(100,112,137,0.22)', stroke: C.textMuted, dash: '2.5 2', text: '#c5cddb' };
  }
  if (p.side === 'against') return { fill: VS, stroke: '#F5A39C', text: '#1a0808' };
  if (p.qualify === 'VAULT') return { fill: GOLD, stroke: GOLD_HI, text: '#0c0a06' };
  if (p.proven) return { fill: GREEN, stroke: '#6EE7B7', text: '#042f1e' };
  return { fill: 'rgba(139,164,200,0.32)', stroke: BLUE, dash: '2.5 2', text: '#d5e0f0' };
}

const MAP_XB = ELITE_ZONE_CLV;
const MAP_YB = ELITE_ZONE_ROI;

/**
 * Keep board dots stable while the expanded card is open.
 * Live cron / countdown re-renders used to drop wallets (missing CLV for a
 * tick) or flip ours/against (Sox nick collision), which remounted SVG nodes
 * and looked like dots blinking in and out.
 */
function useStableBoardWallets(incoming) {
  const ref = useRef(null);
  const rowKey = (w) => {
    const ln = Number.isFinite(Number(w?.entryLine)) ? Number(w.entryLine) : '';
    return `${w?.short || ''}|${w?.side || ''}|${ln}`;
  };
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return ref.current || [];
  }
  if (!ref.current) {
    ref.current = incoming.map((w) => ({ ...w }));
    return ref.current;
  }
  const byKey = new Map(ref.current.map((w) => [rowKey(w), w]));
  for (const w of incoming) {
    if (!w?.short) continue;
    const k = rowKey(w);
    const prev = byKey.get(k);
    if (prev) {
      const nextInv = Number(w.invested) || 0;
      const prevInv = Number(prev.invested) || 0;
      const keep = nextInv >= prevInv ? { ...prev, ...w } : { ...w, ...prev };
      byKey.set(k, {
        ...keep,
        side: prev.side,
        marketSide: prev.marketSide ?? w.marketSide,
      });
    } else {
      byKey.set(k, { ...w });
    }
  }
  ref.current = [...byKey.values()];
  return ref.current;
}

function WalletMap({ wallets, selected, onSelect, gid }) {
  // Plot every wallet with a stake. Missing CLV/ROI used to exclude the dot
  // entirely — profiles loading mid-expand made them blink off then on.
  const plottable = wallets
    .filter((p) => p && (p.invested || 0) > 0 && p.short)
    .map((p) => {
      const hasClv = Number.isFinite(p.priorClvPct);
      const roi = walletRoiForPlot(p);
      const hasRoi = Number.isFinite(roi);
      const plotIncomplete = !hasClv || !hasRoi;
      const eliteZone = !plotIncomplete && (p.eliteZone === true || isEliteZoneWallet(p));
      return {
        ...p,
        plotIncomplete,
        eliteZone,
        plotClv: hasClv ? p.priorClvPct : MAP_XB,
        plotRoi: hasRoi ? roi : MAP_YB,
      };
    });
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
  const roiOf = (p) => p.plotRoi;

  // Expand-only axis domain — never shrink when a wallet briefly drops out,
  // or every remaining dot jumps and looks like a glitch.
  const domainRef = useRef(null);
  const ready = plottable.filter((p) => !p.plotIncomplete);
  const sample = ready.length ? ready : plottable;
  const clvs = sample.map((p) => p.plotClv);
  const rois = sample.map(roiOf);
  let xMin = Math.min(40, Math.floor(Math.min(...clvs) / 5) * 5 - 2);
  let xMax = Math.max(64, Math.ceil(Math.max(...clvs) / 5) * 5 + 2);
  let yMin = Math.min(-14, Math.floor(Math.min(...rois) / 5) * 5 - 2);
  let yMax = Math.max(26, Math.ceil(Math.max(...rois) / 5) * 5 + 2);
  if (domainRef.current) {
    xMin = Math.min(domainRef.current.xMin, xMin);
    xMax = Math.max(domainRef.current.xMax, xMax);
    yMin = Math.min(domainRef.current.yMin, yMin);
    yMax = Math.max(domainRef.current.yMax, yMax);
  }
  domainRef.current = { xMin, xMax, yMin, yMax };

  const XB = MAP_XB;
  const YB = MAP_YB;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const xS = (v) => pad.l + ((clamp(v, xMin, xMax) - xMin) / (xMax - xMin)) * iw;
  const yS = (v) => pad.t + (1 - (clamp(v, yMin, yMax) - yMin) / (yMax - yMin)) * ih;
  // Freeze max $ for radius so live ticket bumps don't resize every dot.
  const invMaxRef = useRef(1);
  const invMaxLive = Math.max(...plottable.map((p) => p.invested || 0), 1);
  invMaxRef.current = Math.max(invMaxRef.current, invMaxLive);
  const invMax = invMaxRef.current;
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
    const r = (p) => (
      p.short === selected ? 6
        : (p.side === 'ours' && p.topQ) ? 5
          : p.qualify === 'VAULT' ? 4
            : p.proven ? 3
              : p.side === 'ours' ? 2 : 1
    );
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
        {/* Soft quadrant wash only — no ELITE/NOISE stamp text. */}
        <radialGradient id={`${gid}-elite`} cx="84%" cy="14%" r="52%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.07" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gid}-noise`} cx="14%" cy="90%" r="48%">
          <stop offset="0%" stopColor={VS} stopOpacity="0.05" />
          <stop offset="100%" stopColor={VS} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${gid}-well`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.035)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.42)" />
        </linearGradient>
      </defs>

      <rect x={pad.l} y={pad.t} width={iw} height={ih} rx={4} fill={`url(#${gid}-well)`} />
      <rect x={xB} y={pad.t} width={Math.max(0, pad.l + iw - xB)} height={Math.max(0, yB - pad.t)} fill={`url(#${gid}-elite)`} />
      <rect x={pad.l} y={yB} width={Math.max(0, xB - pad.l)} height={Math.max(0, pad.t + ih - yB)} fill={`url(#${gid}-noise)`} />

      {xTicks.map((v) => (
        <line key={`xg${v}`} x1={xS(v)} y1={pad.t} x2={xS(v)} y2={pad.t + ih} stroke="rgba(148,163,184,0.06)" />
      ))}
      {yTicks.map((v) => (
        <line key={`yg${v}`} x1={pad.l} y1={yS(v)} x2={pad.l + iw} y2={yS(v)} stroke="rgba(148,163,184,0.06)" />
      ))}

      <line x1={xB} y1={pad.t} x2={xB} y2={pad.t + ih} stroke="rgba(255,255,255,0.14)" strokeDasharray="2.5 5" strokeWidth={1} />
      <line x1={pad.l} y1={yB} x2={pad.l + iw} y2={yB} stroke="rgba(255,255,255,0.14)" strokeDasharray="2.5 5" strokeWidth={1} />
      <line x1={pad.l} y1={pad.t + ih} x2={pad.l + iw} y2={pad.t + ih} stroke="rgba(168,176,191,0.38)" strokeWidth={1.2} />
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + ih} stroke="rgba(168,176,191,0.38)" strokeWidth={1.2} />

      {/* Axis titles — clear of the plot */}
      <text x={pad.l + iw / 2} y={H - 10} textAnchor="middle"
        fill={C.textSec} fontSize={11} fontWeight={600} letterSpacing="0.03em">
        Beat the closing line →
      </text>
      <text
        x={13}
        y={pad.t + ih / 2}
        textAnchor="middle"
        fill={C.textSec}
        fontSize={11}
        fontWeight={600}
        letterSpacing="0.03em"
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

      {selPt && !selPt.plotIncomplete && (
        <g opacity={0.12}>
          <line x1={pad.l} y1={yS(roiOf(selPt))} x2={pad.l + iw} y2={yS(roiOf(selPt))} stroke={GOLD} strokeWidth={1} />
          <line x1={xS(selPt.plotClv)} y1={pad.t} x2={xS(selPt.plotClv)} y2={pad.t + ih} stroke={GOLD} strokeWidth={1} />
        </g>
      )}

      {sorted.map((p) => {
        const cx = xS(p.plotClv);
        const cy = yS(roiOf(p));
        const r = rFor(p);
        const st = bubbleStyle(p);
        const sel = selected === p.short;
        const sizedUp = Number.isFinite(p.sizeRatio) && p.sizeRatio >= 1.5;
        const isBestSharp = p.side === 'ours' && !!p.topQ;
        // Quiet mark: champagne hairline = best on price; ↑ = sized up. No floating shout labels.
        // Key by wallet id only — side tags must not remount the node.
        return (
          <g key={p.short} onClick={() => onSelect(p.short)} style={{ cursor: 'pointer' }} opacity={sel ? 1 : 0.42}>
            <circle cx={cx} cy={cy} r={Math.max(r + 8, 16)} fill="transparent" />
            {sel && (
              <circle cx={cx} cy={cy} r={r + 5.5} fill="none" stroke={GOLD_HI} strokeWidth={1.15} opacity={0.85} />
            )}
            {isBestSharp && (
              <circle
                cx={cx} cy={cy} r={r + (sel ? 3.5 : 3)}
                fill="none"
                stroke={GOLD_HI}
                strokeWidth={1}
                opacity={sel ? 0.95 : 0.72}
              />
            )}
            <circle
              cx={cx} cy={cy} r={r}
              fill={st.fill}
              stroke={sel ? GOLD_HI : isBestSharp ? GOLD : st.stroke}
              strokeWidth={sel || isBestSharp ? 1.35 : 1.15}
              strokeDasharray={sel || isBestSharp ? undefined : st.dash}
            />
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill={st.text}
              fontSize={r >= 12 ? 9 : 7.5} fontFamily={MONO} fontWeight={800}
              style={{ pointerEvents: 'none' }}>
              {p.short.slice(0, 2)}
            </text>
            {isBestSharp && sizedUp && (
              <text
                x={cx + r * 0.55}
                y={cy - r * 0.55}
                textAnchor="middle"
                fill={GOLD_HI}
                fontSize={10}
                fontFamily={MONO}
                fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                ↑
              </text>
            )}
            {sel && (
              <text x={cx} y={cy - r - 8} textAnchor="middle" fill={GOLD_HI}
                fontSize={11} fontFamily={MONO} fontWeight={650} style={{ pointerEvents: 'none' }}>
                {fmtMoney(p.invested)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Fair-book overtime spark. variant="market" = quiet instrument (no neon fill). */
function OddsPath({ journey, fair, clvPct, gid, variant = 'default' }) {
  const pts = (Array.isArray(journey) ? journey : []).filter(Number.isFinite);
  if (pts.length < 2) return null;
  const quiet = variant === 'market';
  const vals = pts.map((p) => -p);
  const fairV = Number.isFinite(fair) ? -fair : vals[0];
  const allV = quiet ? vals : [...vals, fairV];
  const vMax = Math.max(...allV) + 2;
  const vMin = Math.min(...allV) - 2;
  const span = vMax - vMin || 1;
  const w = 360;
  const h = quiet ? 52 : 64;
  const padX = quiet ? 2 : 10;
  const padTop = quiet ? 8 : 16;
  const padBot = quiet ? 14 : 18;
  const plotW = w - padX * 2;
  const plotH = h - padTop - padBot;
  const yS = (v) => padTop + (1 - (v - vMin) / span) * plotH;
  const xS = (i) => padX + (i / (vals.length - 1)) * plotW;
  const coords = vals.map((v, i) => [xS(i), yS(v)]);
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${coords[coords.length - 1][0]},${h - padBot} L${padX},${h - padBot} Z`;
  const last = coords[coords.length - 1];
  const fairY = yS(fairV);
  const color = quiet ? GOLD_HI : (clvPct >= 0 ? GREEN : VS);
  const startOdds = pts[0];
  const endOdds = pts[pts.length - 1];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto' }}>
      {!quiet && (
        <defs>
          <linearGradient id={`${gid}-odds`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {Number.isFinite(fair) && (
        <line
          x1={padX} y1={fairY} x2={w - padX} y2={fairY}
          stroke={GOLD}
          strokeWidth={quiet ? 0.75 : 1.15}
          strokeDasharray={quiet ? '3 4' : '4 3'}
          opacity={quiet ? 0.35 : 0.8}
        />
      )}
      {!quiet && Number.isFinite(fair) && (
        <text x={w - padX} y={Math.max(11, fairY - 5)} textAnchor="end" fill={GOLD} fontSize={10} fontFamily={MONO} fontWeight={700}>
          FAIR {fmtOdds(fair)}
        </text>
      )}
      {!quiet && <path d={area} fill={`url(#${gid}-odds)`} />}
      <path
        className={quiet ? undefined : 'lc-draw'}
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={quiet ? 1.5 : 2.1}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={quiet ? 0.92 : 1}
      />
      <circle cx={coords[0][0]} cy={coords[0][1]} r={quiet ? 2 : 2.6} fill={quiet ? C.textMuted : GOLD} />
      <circle cx={last[0]} cy={last[1]} r={quiet ? 2.4 : 3.2} fill={color} stroke="#0B0F18" strokeWidth={1} />
      <text x={padX} y={h - 2} textAnchor="start" fill={C.textFaint} fontSize={9} fontFamily={MONO} fontWeight={600}>
        {fmtOdds(startOdds)}
      </text>
      <text x={w - padX} y={h - 2} textAnchor="end" fill={quiet ? C.textSec : color} fontSize={9} fontFamily={MONO} fontWeight={700}>
        {fmtOdds(endOdds)}
      </text>
    </svg>
  );
}

/** Normalize overlay stamps (EDGE band / EDGE-net / tape) → size-path step. */
function normSizeStep(action) {
  const a = String(action || '').toLowerCase();
  if (a === 'mute' || a === 'cancel') return 'mute';
  if (a === 'boost') return 'boost';
  if (a === 'half' || a === 'soft') return 'half';
  return null; // hold / keep / pass / exempt / missing — not decisive alone
}

/**
 * Size Path = net Base → Ticket outcome across ALL size overlays
 * (EDGE band, EDGE/net soft size, tape) — not tape alone.
 * Units delta is source of truth; stamps break ties when flat.
 */
function resolveSizePathStep({
  baseU, finalU, edgeBandAction, edgeNetAction, tapeAction, tracked,
} = {}) {
  if (tracked) return 'mute';
  const base = Number(baseU);
  const fin = Number(finalU);
  if (Number.isFinite(fin) && fin <= 0 && Number.isFinite(base) && base > 0) return 'mute';
  if (Number.isFinite(base) && base > 0 && Number.isFinite(fin)) {
    if (fin >= base * 1.08) return 'boost';
    if (fin > 0 && fin <= base * 0.85) return 'half';
  }
  // Flat ticket vs base — honor a decisive overlay stamp (band → net → tape).
  const stamped = [edgeBandAction, edgeNetAction, tapeAction]
    .map(normSizeStep)
    .find(Boolean);
  return stamped || 'hold';
}

function SizePath({
  baseU, finalU, tapeAction, edgeBandAction, edgeNetAction, tracked,
}) {
  const activeId = resolveSizePathStep({
    baseU, finalU, edgeBandAction, edgeNetAction, tapeAction, tracked,
  });
  const steps = [
    { id: 'mute', label: 'Mute' },
    { id: 'half', label: 'Half' },
    { id: 'hold', label: 'Hold' },
    { id: 'boost', label: 'Boost' },
  ];
  const activeIdx = Math.max(0, steps.findIndex((s) => s.id === activeId));
  const activeLabel = steps[activeIdx]?.label || 'Hold';

  return (
    <div style={{
      height: '100%',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '10px 12px 11px',
      borderRadius: 8,
      background: 'rgba(255,255,255,0.015)',
      border: `1px solid ${LINE}`,
      fontFeatureSettings: "'tnum'",
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: C.textMuted }}>
          SIZE PATH
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, color: C.textSec, letterSpacing: '0.02em' }}>
          {tracked ? 'No ticket' : activeLabel}
        </span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 12,
      }}>
        <div>
          <div style={{ fontSize: 9, color: C.textFaint, marginBottom: 2 }}>Base</div>
          <div style={{ fontSize: 15, fontWeight: 650, color: C.textSec }}>
            {Number.isFinite(baseU) ? `${baseU.toFixed(1)}u` : '—'}
          </div>
        </div>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)', alignSelf: 'center', marginTop: 12 }} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: C.textFaint, marginBottom: 2 }}>Ticket</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: tracked ? C.textMuted : C.text }}>
            {tracked ? '0u' : (Number.isFinite(finalU) ? `${finalU.toFixed(1)}u` : '—')}
          </div>
        </div>
      </div>

      {/* Segmented track — active step is a hairline fill, not a neon pill */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0,
        borderRadius: 5, overflow: 'hidden',
        border: `1px solid ${LINE}`,
        background: 'rgba(0,0,0,0.25)',
      }}>
        {steps.map((s, i) => {
          const on = s.id === activeId;
          return (
            <div
              key={s.id}
              style={{
                textAlign: 'center',
                padding: '7px 2px',
                fontSize: 9,
                fontWeight: on ? 700 : 500,
                letterSpacing: '0.04em',
                color: on ? C.text : C.textFaint,
                background: on ? 'rgba(212,175,55,0.12)' : 'transparent',
                borderLeft: i === 0 ? 'none' : `1px solid ${LINE}`,
                boxShadow: on ? 'inset 0 -1.5px 0 #D4AF37' : 'none',
              }}
            >
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompactTape({ tapeScore, tapeAction, edge, fill = false }) {
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
  const edgeColor = !Number.isFinite(edge) ? C.textMuted : edge >= 0 ? GREEN : VS;

  return (
    <div style={{
      marginTop: fill ? 0 : 8,
      height: fill ? '100%' : undefined,
      padding: '10px 11px 11px',
      borderRadius: 9,
      background: 'rgba(0,0,0,0.28)',
      border: `1px solid ${LINE}`,
      fontFeatureSettings: "'tnum'",
      display: fill ? 'flex' : 'block',
      flexDirection: 'column',
      justifyContent: fill ? 'center' : undefined,
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
              fontSize: 11, fontWeight: 700, color: edgeColor,
            }}>
              EDGE {edge >= 0 ? '+' : ''}{edge.toFixed(1)}
            </span>
          )}
          {hasTape && (
            <span style={{ fontSize: 11, fontWeight: 650, color: C.textSec }}>{headline}</span>
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

/** Short book label for the strip (FanDuel → FD). */
function shortBook(name) {
  const n = String(name || '').trim();
  if (!n) return '—';
  const map = {
    pinnacle: 'PIN', draftkings: 'DK', fanduel: 'FD', betmgm: 'MGM',
    caesars: 'CZR', fanatics: 'FAN', betonlineag: 'BOL', betonline: 'BOL',
    lowvig: 'LV', bookmaker: 'BM', circa: 'CIR',
  };
  const key = n.toLowerCase().replace(/\s+/g, '');
  if (map[key]) return map[key];
  if (n.length <= 4) return n.toUpperCase();
  return n.slice(0, 3).toUpperCase();
}

/**
 * Full-width market instrument — lock price hero, quiet overtime, book strip.
 * No nested cards / neon fills / competing gold boxes.
 */
function MarketPriceBoard({
  journey, fair, clvPct, gid, gotOdds,
  sharpEntry = null,
  hideTicketHero = false,
  hideJourney = false,
  bestOdds, bestBook, books, ourLabel, oppLabel, oppBestOdds,
  updatedAgoSec, fairIsNoVig = false, evFlagged = null,
  liveLabel = null, liveBestOdds = null, liveBestBook = null,
  liveFair = null, liveFairIsNoVig = false,
}) {
  const hasJourney = !hideJourney && Array.isArray(journey) && journey.filter(Number.isFinite).length >= 2;
  const hasBest = Number.isFinite(bestOdds);
  const hasBooks = Array.isArray(books) && books.some((b) => Number.isFinite(b?.odds));
  const hasLive = !!(liveLabel && (
    Number.isFinite(liveBestOdds) || Number.isFinite(liveFair)
    || (Number.isFinite(oppBestOdds) && oppLabel)
  ));
  if (!hasJourney && !hasBest && !hasBooks && !Number.isFinite(gotOdds) && !hasLive) {
    return (
      <div style={{
        marginTop: 8, padding: '11px 12px',
        borderTop: `1px solid ${LINE}`,
        fontSize: 11, color: C.textMuted, fontWeight: 550,
      }}>
        Market prices fill when the fair book posts.
      </div>
    );
  }

  const ago = Number.isFinite(updatedAgoSec)
    ? (updatedAgoSec < 60 ? `${updatedAgoSec}s` : updatedAgoSec < 3600
      ? `${Math.round(updatedAgoSec / 60)}m` : `${Math.round(updatedAgoSec / 3600)}h`)
    : null;

  const bookRows = hasBooks
    ? [...books].filter((b) => Number.isFinite(b.odds)).slice(0, 8)
    : [];

  const Dot = () => (
    <span style={{ color: C.textFaint, margin: '0 7px', fontWeight: 400 }}>·</span>
  );

  const showEv = Number.isFinite(evFlagged) && evFlagged > 0;

  return (
    <div style={{
      marginTop: 10,
      paddingTop: 12,
      borderTop: `1px solid ${LINE}`,
      fontFeatureSettings: "'tnum'",
    }}>
      {/* Header — always the staked instrument */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 10, gap: 8,
      }}>
        <div style={{ minWidth: 0 }}>
          <span style={{
            fontFamily: MONO, fontSize: 8, fontWeight: 700,
            letterSpacing: '0.12em', color: C.textMuted,
          }}>
            {hideTicketHero ? 'BOOKS' : '④ MARKET'}
          </span>
          {ourLabel && (
            <span style={{
              marginLeft: 8, fontSize: 12, fontWeight: 600, color: C.textSec,
            }}>
              {ourLabel}
            </span>
          )}
        </div>
        {ago && (
          <span style={{ fontSize: 9, fontWeight: 500, color: C.textFaint, flexShrink: 0 }}>
            {ago}
          </span>
        )}
      </div>

      {/* Ticket + book context — omit when PRICE CHECK rails already showed the three lines */}
      {!hideTicketHero && (
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'baseline',
        gap: '2px 0', marginBottom: hasLive ? 8 : (hasJourney ? 10 : 12),
        lineHeight: 1.15,
      }}>
        <span style={{
          fontSize: 12, fontWeight: 550, color: C.textMuted, marginRight: 8,
        }}>
          flagged at
        </span>
        <span style={{
          fontSize: 22, fontWeight: 750, letterSpacing: '-0.03em', color: C.text,
        }}>
          {fmtOdds(gotOdds)}
        </span>
        {Number.isFinite(sharpEntry) && (
          <span style={{
            marginLeft: 12, fontSize: 12, fontWeight: 550, color: C.textSec,
          }}>
            <span style={{ color: C.textFaint }}>entry </span>
            <span style={{ fontWeight: 700, color: GOLD }}>{fmtOdds(sharpEntry)}</span>
          </span>
        )}
        {showEv && (
          <span style={{
            marginLeft: 10, fontSize: 12, fontWeight: 750, color: GREEN,
            letterSpacing: '-0.01em',
          }}>
            EV +{evFlagged.toFixed(1)}%
          </span>
        )}
        {(hasBest || Number.isFinite(fair) || (Number.isFinite(oppBestOdds) && oppLabel && !hasLive)) && (
          <span style={{
            width: '100%', marginTop: 6,
            fontSize: 12, fontWeight: 550, color: C.textSec,
          }}>
            {hasBest && (
              <>
                <span style={{ color: C.textFaint }}>best </span>
                <span style={{ fontWeight: 700, color: C.text }}>{fmtOdds(bestOdds)}</span>
                {bestBook && (
                  <span style={{ color: C.textFaint }}> {shortBook(bestBook)}</span>
                )}
              </>
            )}
            {hasBest && Number.isFinite(fair) && <Dot />}
            {Number.isFinite(fair) && (
              <>
                <span style={{ color: C.textFaint }}>{fairIsNoVig ? 'fair' : 'now'} </span>
                <span style={{ fontWeight: 650, color: GOLD }}>{fmtOdds(fair)}</span>
              </>
            )}
            {Number.isFinite(oppBestOdds) && oppLabel && !hasLive && (
              <>
                <Dot />
                <span style={{ color: C.textFaint }}>{oppLabel} </span>
                <span style={{ fontWeight: 600 }}>{fmtOdds(oppBestOdds)}</span>
              </>
            )}
          </span>
        )}
      </div>
      )}
      {hideTicketHero && (hasBest || Number.isFinite(fair) || (Number.isFinite(oppBestOdds) && oppLabel && !hasLive)) && bookRows.length === 0 && (
        <div style={{
          marginBottom: hasLive ? 8 : 12,
          fontSize: 12, fontWeight: 550, color: C.textSec,
        }}>
          {hasBest && (
            <>
              <span style={{ color: C.textFaint }}>best </span>
              <span style={{ fontWeight: 700, color: C.text }}>{fmtOdds(bestOdds)}</span>
              {bestBook && (
                <span style={{ color: C.textFaint }}> {shortBook(bestBook)}</span>
              )}
            </>
          )}
          {hasBest && Number.isFinite(fair) && <Dot />}
          {Number.isFinite(fair) && (
            <>
              <span style={{ color: C.textFaint }}>{fairIsNoVig ? 'fair' : 'now'} </span>
              <span style={{ fontWeight: 650, color: GOLD }}>{fmtOdds(fair)}</span>
            </>
          )}
        </div>
      )}

      {/* Consensus moved — live prices on their own line, never mixed into ticket */}
      {hasLive && (
        <div style={{
          marginBottom: bookRows.length ? 10 : 4,
          fontSize: 12, fontWeight: 550, color: C.textSec, lineHeight: 1.45,
        }}>
          <span style={{ color: C.textFaint }}>{liveLabel}</span>
          {Number.isFinite(liveBestOdds) && (
            <>
              <Dot />
              <span style={{ color: C.textFaint }}>best </span>
              <span style={{ fontWeight: 700, color: C.text }}>{fmtOdds(liveBestOdds)}</span>
              {liveBestBook && (
                <span style={{ color: C.textFaint }}> {shortBook(liveBestBook)}</span>
              )}
            </>
          )}
          {Number.isFinite(liveFair) && (
            <>
              <Dot />
              <span style={{ color: C.textFaint }}>{liveFairIsNoVig ? 'fair' : 'sharp'} </span>
              <span style={{ fontWeight: 650, color: GOLD }}>{fmtOdds(liveFair)}</span>
            </>
          )}
          {Number.isFinite(oppBestOdds) && oppLabel && (
            <>
              <Dot />
              <span style={{ color: C.textFaint }}>{oppLabel} </span>
              <span style={{ fontWeight: 600 }}>{fmtOdds(oppBestOdds)}</span>
            </>
          )}
        </div>
      )}

      {hasJourney && (
        <div style={{ marginBottom: bookRows.length ? 10 : 0 }}>
          <OddsPath
            journey={journey}
            fair={fair}
            clvPct={clvPct ?? 0}
            gid={`${gid}-mkt`}
            variant="market"
          />
        </div>
      )}

      {bookRows.length > 0 ? (
        <div>
          <div style={{
            fontSize: 10, fontWeight: 550, color: C.textMuted, marginBottom: 8,
          }}>
            Same line across books
            {Number.isFinite(fair) && (
              <span style={{ color: C.textFaint }}>
                {' '}· fair {fmtOdds(fair)}{fairIsNoVig ? ' (no-vig)' : ''}
              </span>
            )}
          </div>
          <div style={{
            display: 'flex',
            gap: 0,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: 9,
            border: '1px solid rgba(148,163,184,0.12)',
            background: 'rgba(0,0,0,0.22)',
          }}>
            {bookRows.map((b, i) => {
              const isBest = !!b.best || (hasBest && bestBook
                && String(b.name).toLowerCase() === String(bestBook).toLowerCase());
              const isSharp = !!b.sharp;
              return (
                <div
                  key={`${b.name}-${i}`}
                  style={{
                    flex: '1 0 auto',
                    minWidth: 56,
                    padding: '10px 10px 9px',
                    textAlign: 'center',
                    borderLeft: i === 0 ? 'none' : '1px solid rgba(148,163,184,0.10)',
                  }}
                >
                  <div style={{
                    fontFamily: MONO, fontSize: 8, fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: isBest ? GOLD : isSharp ? GOLD_HI : C.textFaint,
                    marginBottom: 4,
                  }}>
                    {shortBook(b.name)}
                  </div>
                  <div style={{
                    fontSize: 15, fontWeight: isBest || isSharp ? 800 : 650,
                    color: isBest ? GOLD_HI : isSharp ? GOLD : C.text,
                    letterSpacing: '-0.02em',
                    fontFeatureSettings: "'tnum'",
                  }}>
                    {fmtOdds(b.odds)}
                  </div>
                  {(isBest || isSharp) && (
                    <div style={{
                      marginTop: 3, fontSize: 8, fontWeight: 700, letterSpacing: '0.06em',
                      color: isBest ? GOLD : C.textMuted,
                    }}>
                      {isBest ? 'BEST' : 'SHARP'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>
          Retail books on this exact line fill on the next odds pull.
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

function Pill({ children, c, solid, title }) {
  return (
    <span
      title={title}
      style={{
        fontSize: 8, fontWeight: 700, letterSpacing: '0.04em',
        padding: '1.5px 5px', borderRadius: 3,
        background: solid ? c : `${c}16`,
        color: solid ? '#042f1e' : c,
        border: solid ? 'none' : `1px solid ${c}40`,
      }}
    >
      {children}
    </span>
  );
}

function fmtGap(v, suffix = '%') {
  if (!Number.isFinite(v)) return '—';
  return `${v}${suffix}`;
}

/**
 * Best proven FOR wallet for expand default.
 * Rank: VAULT (sized) → CONFIRMED over FLAT → roi → invested → wr.
 */
function bestProvenForDefault(wallets) {
  const list = Array.isArray(wallets) ? wallets : [];
  const oursProven = list.filter((w) => w && w.side === 'ours' && w.proven);
  const pool = oursProven.length
    ? oursProven
    : list.filter((w) => w && w.side === 'ours');
  if (!pool.length) return list[0]?.short || null;
  const tierScore = (w) => {
    const t = String(w.whitelist || '').toUpperCase();
    if (t === 'CONFIRMED') return 2;
    if (t === 'FLAT') return 1;
    return w.proven ? 1 : 0;
  };
  const score = (w) => {
    const vault = w.qualify === 'VAULT' ? 1e9 : 0;
    const roi = Number.isFinite(w.roi) ? w.roi : -999;
    const inv = Number(w.invested) || 0;
    const wr = Number.isFinite(w.wr) ? w.wr : 0;
    return vault + tierScore(w) * 1e6 + (roi + 500) * 1e3 + inv + wr;
  };
  return [...pool].sort((a, b) => score(b) - score(a))[0]?.short || null;
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
  edgeAura = false,
}) {
  const incoming = (Array.isArray(f.mapWallets) && f.mapWallets.length
    ? f.mapWallets
    : (f.wallets || []).map((w) => ({ ...w, side: 'ours' })));
  // Freeze membership + ours/against while expanded so live sync can't blink dots.
  const all = useStableBoardWallets(incoming);

  // Expand remounts this tree — default once to best proven FOR (VAULT / CONFIRMED).
  const defaultSel = useMemo(() => bestProvenForDefault(all), [
    all.map((w) => `${w.short}:${w.side}:${w.qualify}:${w.whitelist}`).join('|'),
  ]);
  const [sel, setSel] = useState(null);
  const activeSel = sel || defaultSel;
  const selected = all.find((w) => w.short === activeSel)
    || all.find((w) => w.short === defaultSel)
    || all.find((w) => w.side === 'ours')
    || all[0]
    || null;
  const clvGood = Number.isFinite(f.clvPct) ? f.clvPct >= 0 : true;
  const gid = `lc-${String(f.id || 'x').replace(/[^a-zA-Z0-9-_]/g, '')}`;
  const heroPx = Number.isFinite(f.heroOdds)
    ? f.heroOdds
    : (f.ticketOffMain ? null : f.lockOdds);

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
  const q1Thr = Number.isFinite(f.confirmedClvQ1) ? f.confirmedClvQ1 : null;
  const selectedTopQ = !!(selected && !againstSel && (
    selected.topQ === true || isTopQWallet(selected, q1Thr)
  ));
  // Size vs usual: sport-local usual (displaySizeRatio / avgSportBet from enrich).
  // Model sizeRatio (cross-sport) is for Proven/VAULT only — not this meter.
  const sizeRatio = Number.isFinite(selected?.displaySizeRatio) && selected.displaySizeRatio > 0
    ? selected.displaySizeRatio
    : (Number.isFinite(selected?.sizeRatio) && selected.sizeRatio > 0
      ? selected.sizeRatio
      : (Number.isFinite(selected?.avgSportBet) && selected.avgSportBet > 0 && selected.invested > 0
        ? selected.invested / selected.avgSportBet
        : null));
  const sizeUsual = Number.isFinite(selected?.avgSportBet) && selected.avgSportBet > 0
    ? selected.avgSportBet
    : (Number.isFinite(sizeRatio) && sizeRatio > 0 && selected?.invested > 0
      ? selected.invested / sizeRatio
      : null);
  const sizeHot = Number.isFinite(sizeRatio) && sizeRatio >= 1.5;
  // Prefer enriched sizeBand; re-match from bands on the wallet if first paint raced profiles.
  const sizeBand = (selected?.sizeBand && Number.isFinite(selected.sizeBand.wr))
    ? selected.sizeBand
    : matchSizeRatioBand(sizeRatio, selected?.sizeRatioBands);
  const beatHot = Number.isFinite(selected?.priorClvPct) && selected.priorClvPct >= 55;
  const leadAccent = againstSel ? VS
    : selectedTopQ || vault ? GOLD
      : selected?.proven ? GREEN : BLUE;

  const ours = all.filter((w) => w.side === 'ours');
  const isBiggest = selected && [...ours].sort((a, b) => (b.invested || 0) - (a.invested || 0))[0]?.short === selected.short;

  const headline = !selected
    ? 'No wallets on the board'
    : againstSel
      ? 'On the other side — weak track record'
      : selectedTopQ && sizeHot
        ? 'One of our best on price — and betting above their usual'
        : selectedTopQ
          ? 'One of our best on price'
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
      : edgeAura
        ? EDGE_AURA_BORDER
        : 'rgba(212,175,55,0.30)';

  return (
    <div
      className={edgeAura ? 'sf-edge-aura' : undefined}
      title={edgeAura && Number.isFinite(f.edge) ? `EDGE ${Number(f.edge).toFixed(1)} · high-conviction lock` : undefined}
      style={{
      borderRadius: 16, overflow: 'hidden',
      background: edgeAura
        ? 'linear-gradient(180deg, rgba(212,175,55,0.10) 0%, rgba(255,255,255,0) 48%), linear-gradient(180deg, #161B29 0%, #10141F 55%, #0D111C 100%)'
        : 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0) 42%), linear-gradient(180deg, #161B29 0%, #10141F 55%, #0D111C 100%)',
      border: `1px solid ${cardBorder}`,
      position: 'relative',
      boxShadow: edgeAura
        ? EDGE_AURA_SHADOW_IDLE
        : '0 24px 60px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05)',
      color: C.text,
    }}>
      <ClarityStyles />
      <div style={{
        position: 'absolute', top: 0, left: '12%', right: '12%', height: 1.5, pointerEvents: 'none', zIndex: 2,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.85,
      }} />

      {/* 1. THE PLAY — quiet premium ticket strip */}
      <div className="lc-in" style={{
        padding: '14px 14px 12px',
        background: 'linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 72%)',
        borderBottom: `1px solid ${LINE}`,
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
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.hair}`,
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
            fontSize: 21, fontWeight: 750, letterSpacing: '-0.028em', lineHeight: 1.05,
          }}>
            {f.pickLabel}
          </span>
          {Number.isFinite(heroPx) && (
            <span style={{ fontSize: 15, fontWeight: 600, color: C.textSec }}>
              {fmtOdds(heroPx)}
            </span>
          )}
          <SteamTag steam={f.steam} compact />
          {f.mainNowLabel && (
            <span
              title="Vault flagged ticket — T-15 locks the main line above"
              style={{
                width: '100%', fontSize: 11, fontWeight: 600, color: C.textMuted, marginTop: 2,
              }}
            >
              {f.mainNowLabel}
            </span>
          )}
          {!tracked && f.units > 0 && (
            <span style={{
              fontSize: 13, fontWeight: 700, color: GOLD,
              letterSpacing: '-0.01em',
            }}>
              {f.units.toFixed(1)}u
            </span>
          )}
          {tracked && (
            <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted }}>No ticket</span>
          )}
          {ticketFrozen && !tracked && !f.graded && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 8, fontWeight: 700, letterSpacing: '0.1em',
              padding: '2px 7px', borderRadius: 4, color: GREEN,
              background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.28)',
            }}>
              <Check size={8} strokeWidth={3} />
              SET
            </span>
          )}
        </div>

        <div style={{
          marginTop: 12,
          display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
          fontFeatureSettings: "'tnum'",
        }}>
          <span style={{ fontSize: 24, fontWeight: 750, letterSpacing: '-0.03em' }}>{fmtMoney(sharpUsd)}</span>
          {oursUsd > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              color: unopposed ? GREEN : C.textSec,
            }}>
              {unopposed ? 'UNOPPOSED' : `${boardSharePct}% OF BOARD`}
            </span>
          )}
          {f.lockedAt && (
            <span style={{ fontSize: 10, color: C.textFaint, marginLeft: 'auto' }}>{f.lockedAt}</span>
          )}
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ height: 2, borderRadius: 1, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.04)' }}>
            {provenPct > 0 && <div style={{ width: `${provenPct}%`, background: GREEN }} />}
            {secondaryPct > 0 && <div style={{ width: `${secondaryPct}%`, background: BLUE }} />}
            {againstPct > 0 && <div style={{ width: `${againstPct}%`, background: VS }} />}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 5, gap: 8,
            fontSize: 9, fontWeight: 600, letterSpacing: '0.04em', fontFeatureSettings: "'tnum'",
          }}>
            {provenPct > 0 && <span style={{ color: C.textSec }}>Proven {provenPct}%</span>}
            {secondaryPct > 0 && <span style={{ color: C.textMuted }}>Secondary {secondaryPct}%</span>}
            {againstPct > 0
              ? <span style={{ color: C.textMuted }}>Against {againstPct}%</span>
              : <span style={{ color: C.textSec, marginLeft: 'auto' }}>Unopposed</span>}
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
              <span style={{ color: C.textFaint, marginLeft: 'auto' }}>
                champagne ring = best on price · ↑ sized up
              </span>
            </div>
          </div>

          <div style={{ padding: '2px 4px 6px' }}>
            <WalletMap wallets={all} selected={activeSel} onSelect={setSel} gid={gid} />
          </div>

          {selected && (
            <div style={{
              borderTop: `1px solid ${LINE}`,
              padding: '10px 12px 11px',
              borderLeft: `3px solid ${leadAccent}`,
              background: againstSel
                ? 'rgba(240,113,103,0.06)'
                : selectedTopQ || vault ? 'rgba(212,175,55,0.07)' : 'rgba(52,211,153,0.04)',
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
                    marginTop: 5, fontSize: 13, fontWeight: 600,
                    color: selectedTopQ && !againstSel ? GOLD_HI : C.text,
                    lineHeight: 1.35, letterSpacing: '-0.01em',
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
                    background: selectedTopQ ? 'rgba(212,175,55,0.08)'
                      : beatHot ? 'rgba(52,211,153,0.06)' : 'rgba(0,0,0,0.32)',
                    border: `1px solid ${selectedTopQ ? 'rgba(212,175,55,0.28)'
                      : beatHot ? 'rgba(52,211,153,0.22)' : LINE}`,
                  }}>
                    <div style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: C.textMuted, marginBottom: 6,
                      textTransform: 'uppercase',
                    }}>
                      Price skill
                    </div>
                    <div style={{
                      fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
                      fontFeatureSettings: "'tnum'",
                      color: selectedTopQ ? GOLD_HI : beatHot ? GREEN : C.text,
                      marginBottom: 2,
                    }}>
                      {Number.isFinite(selected.priorClvPct) ? `${selected.priorClvPct}%` : '—'}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: C.textSec, lineHeight: 1.3 }}>
                      {selectedTopQ
                        ? (sizeHot
                          ? 'Best on price · above usual size'
                          : 'Best on price among our confirmed')
                        : 'Beat the closing line'}
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
                  {(() => {
                    // Fill length = multiplier (bigger × → longer bar).
                    // Tick = 1.0× usual on the same scale — not usual/this.
                    const scaleMax = Math.max(3, sizeRatio);
                    const fillPct = Math.min(100, (sizeRatio / scaleMax) * 100);
                    const usualPct = Math.min(96, (1 / scaleMax) * 100);
                    return (
                      <>
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
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: `${fillPct}%`, borderRadius: 2,
                            background: sizeHot
                              ? `linear-gradient(90deg, rgba(52,211,153,0.25), ${GREEN})`
                              : `linear-gradient(90deg, rgba(212,175,55,0.2), ${GOLD})`,
                          }} />
                          <div
                            title="1.0× usual"
                            style={{
                              position: 'absolute',
                              left: `${usualPct}%`,
                              top: -3, bottom: -3, width: 2, borderRadius: 1,
                              background: C.text, transform: 'translateX(-50%)',
                              opacity: 0.85,
                            }}
                          />
                        </div>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', marginTop: 4,
                          fontSize: 10, fontWeight: 550, color: C.textMuted, fontFeatureSettings: "'tnum'",
                        }}>
                          <span>usual {fmtMoney(sizeUsual)}</span>
                          <span style={{ color: sizeHot ? GREEN : C.textSec }}>this {fmtMoney(selected.invested)}</span>
                        </div>
                        {sizeBand && Number.isFinite(sizeBand.wr) && (
                          <div style={{
                            marginTop: 7,
                            fontSize: 11, fontWeight: 550, color: C.textSec,
                            fontFeatureSettings: "'tnum'", lineHeight: 1.35,
                          }}>
                            <span style={{ color: C.text }}>
                              {sizeBand.wr}% W
                            </span>
                            <span style={{ color: C.textMuted }}> at this size</span>
                            {Number.isFinite(sizeBand.pct) && (
                              <span style={{ color: C.textFaint }}>
                                {' · '}{sizeBand.pct}% of bets
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
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

      {/* 5. TAPE + SIZE · then full-width market price board */}
      <div className="lc-in-2" style={{ padding: '12px 14px 6px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 8, fontFeatureSettings: "'tnum'",
        }}>
          <div>
            <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: C.textMuted }}>
              ③ TAPE & SIZE
            </span>
            <span style={{ marginLeft: 8, fontSize: 15, fontWeight: 650 }}>{fmtOdds(f.gotOdds ?? f.lockOdds)}</span>
            {/* Wallet quality ladder next to price:
                HC = CONFIRMED ∧ sized ≥1.5× (FOR−AG)
                C  = CONFIRMED any size above token floor (FOR−AG)
                P  = proven CONFIRMED+FLAT (FOR−AG) — only when it differs from C */}
            {(Number.isFinite(f.hcMargin) || Number.isFinite(f.confMargin) || Number.isFinite(f.provenMargin)) && (
              <span style={{
                marginLeft: 10, fontSize: 11, fontWeight: 650, color: C.textMuted,
                display: 'inline-flex', alignItems: 'baseline', gap: 7,
              }}>
                {Number.isFinite(f.hcMargin) && (
                  <span title="HC margin: CONFIRMED winners sized ≥1.5× usual (FOR − AG)">
                    HC <span style={{
                      color: f.hcMargin > 0 ? GREEN : f.hcMargin < 0 ? VS : C.textMuted,
                      fontWeight: 800,
                    }}>{f.hcMargin >= 0 ? '+' : ''}{f.hcMargin}</span>
                  </span>
                )}
                {Number.isFinite(f.confMargin) && (
                  <span title="C margin: CONFIRMED-tier winners on the board (FOR − AG). Same wallets as HC, without the 1.5× size gate.">
                    C <span style={{
                      color: f.confMargin > 0 ? GREEN : f.confMargin < 0 ? VS : C.textMuted,
                      fontWeight: 800,
                    }}>{f.confMargin >= 0 ? '+' : ''}{f.confMargin}</span>
                  </span>
                )}
                {Number.isFinite(f.provenMargin)
                  && (!Number.isFinite(f.confMargin) || f.provenMargin !== f.confMargin) && (
                  <span title="P margin: proven sport winners (CONFIRMED + FLAT) FOR − AG">
                    P <span style={{
                      color: f.provenMargin > 0 ? GREEN : f.provenMargin < 0 ? VS : C.textMuted,
                      fontWeight: 800,
                    }}>{f.provenMargin >= 0 ? '+' : ''}{f.provenMargin}</span>
                  </span>
                )}
              </span>
            )}
          </div>
          {Number.isFinite(f.clvPct) && (
            <span style={{ fontSize: 12, fontWeight: 700, color: clvGood ? GREEN : VS }}>
              {clvGood ? '+' : ''}{f.clvPct.toFixed(1)}% vs close
            </span>
          )}
        </div>

        <div className="lc-tape-size">
          <CompactTape
            tapeScore={f.tapeScore}
            tapeAction={f.tapeAction}
            edge={f.edge}
            fill
          />
          <SizePath
            baseU={f.pathBaseUnits}
            finalU={f.units}
            tapeAction={f.tapeAction}
            edgeBandAction={f.edgeBandAction}
            edgeNetAction={f.edgeNetAction}
            tracked={tracked}
          />
        </div>

        {(Number.isFinite(f.gotOdds ?? f.lockOdds)
          || Number.isFinite(f.sharpEntryOdds)
          || Number.isFinite(f.currentFairOdds ?? f.fairLine)
          || (f.marketAgreement && f.marketAgreement.state !== 'NO_SHARPS')
          || (Array.isArray(f.pinPath) && f.pinPath.length >= 2)) && (
          <div className="lc-in-2" style={{ margin: '0 0 12px' }}>
            <LockedSignalsRow signals={f.marketSignals} />
            <div style={{ marginTop: 10 }}>
              <OddsLimitSpark
                pinPath={f.pinPath}
                flagged={f.gotOdds ?? f.lockOdds}
                entry={f.sharpEntryOdds}
                now={f.currentFairOdds ?? f.nowOdds}
                fair={f.fairLine ?? fairOdds}
                evPct={f.evFlagged}
                sma={f.marketAgreement}
                maxNow={f.pinnMax ?? f.marketAgreement?.maxNow}
                movePp={f.pinnMovePp}
                polyEntry={f.polyEntryOdds}
                gid={`ols-${gid}`}
                showStory
                chartLineLabel={f.chartLineLabel}
                ticketOffMain={f.instrumentVariant === 'ALT' || !!f.lineMoved}
              />
            </div>
          </div>
        )}

        <MarketPriceBoard
          journey={journey}
          fair={fairOdds}
          clvPct={f.clvPct ?? 0}
          gid={gid}
          gotOdds={f.gotOdds ?? f.lockOdds}
          sharpEntry={f.sharpEntryOdds}
          hideTicketHero
          hideJourney
          bestOdds={f.bestOdds}
          bestBook={f.bestBook}
          books={f.books}
          ourLabel={f.ourMarketLabel || f.pickLabel}
          oppLabel={f.oppMarketLabel}
          oppBestOdds={f.oppBestOdds}
          updatedAgoSec={f.oddsUpdatedAgoSec}
          fairIsNoVig={!!f.fairIsNoVig}
          evFlagged={f.evFlagged}
          liveLabel={f.liveMarketLabel}
          liveBestOdds={f.liveBestOdds}
          liveBestBook={f.liveBestBook}
          liveFair={f.liveFair}
          liveFairIsNoVig={!!f.liveFairIsNoVig}
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
