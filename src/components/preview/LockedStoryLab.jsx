/**
 * LockedStoryLab V27 — FIRST-LOOK CLARITY
 * Open at #/locked-story-lab
 *
 * Cold Twitter user: where to look, what's important, what's noise.
 * Map gets real detail. Wallet ranks signal — not a 5-column mush.
 */
import { useState } from 'react';
import { LockedPositionCardView } from '../sharpFlow/cards/PositionCards';

const PAGE = '#03050A';
const GOLD = '#D4AF37';
const GOLD_HI = '#F0D78C';
const GREEN = '#34D399';
const VS = '#F07167';
const BLUE = '#8BA4C8';
const INK = '#F7F8FA';
const INK_2 = '#A8B0BF';
const INK_3 = '#6B7690';
const INK_4 = '#4A5568';
const LINE = 'rgba(148,163,184,0.11)';
const SANS = 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
const MONO = "'SF Mono', ui-monospace, Menlo, monospace";

const fmtOdds = (o) => (Number(o) > 0 ? `+${o}` : `${o}`);
const fmtK = (n) => {
  if (n == null || Number.isNaN(Number(n))) return '—';
  const v = Math.abs(Number(n));
  const neg = Number(n) < 0;
  if (v >= 1000) return `${neg ? '-' : ''}$${(v / 1000).toFixed(1)}K`;
  return `${neg ? '-' : ''}$${Math.round(v)}`;
};

const MAP_WALLETS = [
  { short: '0cd77e', side: 'ours', proven: true, skillEligible: true, qualify: 'VAULT', invested: 9800, sizeRatio: 2.8, record: '62-42', wr: 60, roi: 22, avgSportBet: 3500, priorClvPct: 58 },
  { short: 'a91f2c', side: 'ours', proven: true, skillEligible: true, qualify: 'SHADOW', invested: 2600, sizeRatio: 1.4, record: '41-29', wr: 59, roi: 14, avgSportBet: 1850, priorClvPct: 54 },
  { short: 'b3e811', side: 'ours', proven: false, skillEligible: true, qualify: 'SKILL', invested: 900, sizeRatio: 1.1, record: '28-22', wr: 56, roi: 6, avgSportBet: 820, priorClvPct: 57 },
  { short: 'e7c440', side: 'ours', proven: false, skillEligible: true, qualify: 'SKILL', invested: 650, sizeRatio: 0.95, record: '31-27', wr: 53, roi: 3, avgSportBet: 680, priorClvPct: 56 },
  { short: 'c4f902', side: 'against', proven: false, skillEligible: false, qualify: 'TRACK', invested: 700, sizeRatio: 0.9, record: '19-24', wr: 44, roi: -4, avgSportBet: 780, priorClvPct: 48 },
  { short: 'd5a013', side: 'against', proven: false, skillEligible: false, qualify: 'TRACK', invested: 400, sizeRatio: 0.7, record: '12-18', wr: 40, roi: -8, avgSportBet: 570, priorClvPct: 46 },
  { short: 'f1b228', side: 'against', proven: false, skillEligible: false, qualify: 'TRACK', invested: 280, sizeRatio: 0.6, record: '8-14', wr: 36, roi: -11, avgSportBet: 460, priorClvPct: 43 },
];

const F = {
  sport: 'MLB', away: 'Twins', home: 'Guardians',
  pickLabel: 'Guardians ML', lockOdds: -145, peakOdds: -152, nowOdds: -148,
  fairOdds: -145, gotOdds: -145, book: 'LowVig', fairBook: 'LowVig',
  units: 2.0, sharpUsd: 12400, moneyPct: 92, edge: 8.3, hc: 1, clvPct: 1.2,
  journey: [-138, -142, -145, -148, -151, -152, -150, -148], lockedAt: '7:41 AM',
  wallets: MAP_WALLETS.filter((w) => w.side === 'ours' && w.proven),
  mapWallets: MAP_WALLETS,
  against: { abbr: 'MIN', label: 'Twins', proven: 0, invested: 1380, avgRoi: -7.7, avgClv: 45.7, avgWr: 40 },
  tier: { label: 'TOP', window: 'L30', record: '43-33', wr: 57, roi: 4.2, n: 76 },
};

const PROD = {
  sport: 'MLB', away: 'Minnesota Twins', home: 'Cleveland Guardians', gameTime: '6:41 PM',
  pickLabel: 'Guardians ML', lockOdds: -145, peakOdds: -152, nowOdds: -148,
  fairOdds: -145, fairLine: -145, gotOdds: -145, book: 'LowVig', fairBook: 'LowVig',
  clvPct: 1.2, units: 2.0, toWin: 1.38, pathBaseUnits: 2.0, stakePath: 'TOP',
  lockedAt: '7:41 AM', peakAt: '8:12 AM', commenceMs: Date.now() + 10 * 36e5,
  edge: 8.3, hcMargin: 1, sideInvested: 12400, sharpUsd: 12400, confirmedOnSide: 2, moneyPct: 92,
  tapeAction: 'hold', serial: 'SF-MLB-0721-ML',
  wallets: F.wallets.map((w) => ({ ...w, proven: true, decided: 100 })),
  mapWallets: MAP_WALLETS,
  against: F.against,
  journey: F.journey,
  tierPerf: { label: 'TOP', window: 'L30', record: '43-33', wr: 57, roi: 4.2, n: 76, profitU: 3.1, color: GOLD },
};

function Styles() {
  return (
    <style>{`
      @keyframes cIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes cDraw {
        from { stroke-dashoffset: 400; }
        to { stroke-dashoffset: 0; }
      }
      @keyframes cRing {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      .c-in { animation: cIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
      .c-in-2 { animation: cIn 0.35s cubic-bezier(0.16,1,0.3,1) 0.06s both; }
      .c-draw {
        stroke-dasharray: 400; stroke-dashoffset: 400;
        animation: cDraw 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s both;
      }
      .c-ring { animation: cRing 2.6s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .c-in, .c-in-2, .c-draw, .c-ring { animation: none; }
        .c-draw { stroke-dashoffset: 0; }
      }
    `}</style>
  );
}

function bubbleStyle(p) {
  if (p.side === 'against') return { fill: VS, stroke: '#F5A39C', text: '#1a0808' };
  if (p.qualify === 'VAULT') return { fill: GOLD, stroke: GOLD_HI, text: '#0c0a06' };
  if (p.proven) return { fill: GREEN, stroke: '#6EE7B7', text: '#042f1e' };
  return { fill: 'rgba(139,164,200,0.32)', stroke: BLUE, dash: '2.5 2', text: '#d5e0f0' };
}

/**
 * Usable map: readable axes, word legend, size key, selected readout baked in.
 */
function WalletMap({ wallets, selected, onSelect }) {
  const W = 360;
  const H = 248;
  const pad = { t: 22, r: 16, b: 36, l: 40 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const clvs = wallets.map((p) => p.priorClvPct);
  const rois = wallets.map((p) => p.roi);
  const xMin = Math.min(40, Math.floor(Math.min(...clvs) / 5) * 5 - 2);
  const xMax = Math.max(64, Math.ceil(Math.max(...clvs) / 5) * 5 + 2);
  const yMin = Math.min(-14, Math.floor(Math.min(...rois) / 5) * 5 - 2);
  const yMax = Math.max(26, Math.ceil(Math.max(...rois) / 5) * 5 + 2);
  const XB = 55;
  const YB = 0;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const xS = (v) => pad.l + ((clamp(v, xMin, xMax) - xMin) / (xMax - xMin)) * iw;
  const yS = (v) => pad.t + (1 - (clamp(v, yMin, yMax) - yMin) / (yMax - yMin)) * ih;
  const invMax = Math.max(...wallets.map((p) => p.invested), 1);
  const rFor = (p) => 7 + Math.sqrt(p.invested / invMax) * 14;
  const xB = xS(XB);
  const yB = yS(YB);
  const selPt = wallets.find((p) => p.short === selected);

  const sorted = [...wallets].sort((a, b) => {
    const r = (p) => (p.short === selected ? 5 : p.qualify === 'VAULT' ? 4 : p.proven ? 3 : p.side === 'ours' ? 2 : 1);
    return r(a) - r(b);
  });

  // Tick every 5 with labels on key ones
  const xTicks = [];
  for (let v = Math.ceil(xMin / 5) * 5; v <= xMax; v += 5) xTicks.push(v);
  const yTicks = [];
  for (let v = Math.ceil(yMin / 5) * 5; v <= yMax; v += 5) yTicks.push(v);

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="cElite" cx="84%" cy="14%" r="48%">
          <stop offset="0%" stopColor={GREEN} stopOpacity="0.18" />
          <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cNoise" cx="14%" cy="90%" r="44%">
          <stop offset="0%" stopColor={VS} stopOpacity="0.12" />
          <stop offset="100%" stopColor={VS} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cWell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
        </linearGradient>
        <filter id="cGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x={pad.l} y={pad.t} width={iw} height={ih} rx={4} fill="url(#cWell)" />
      <rect x={xB} y={pad.t} width={Math.max(0, pad.l + iw - xB)} height={Math.max(0, yB - pad.t)} fill="url(#cElite)" />
      <rect x={pad.l} y={yB} width={Math.max(0, xB - pad.l)} height={Math.max(0, pad.t + ih - yB)} fill="url(#cNoise)" />

      {xTicks.map((v) => (
        <line key={`xg${v}`} x1={xS(v)} y1={pad.t} x2={xS(v)} y2={pad.t + ih} stroke="rgba(148,163,184,0.06)" />
      ))}
      {yTicks.map((v) => (
        <line key={`yg${v}`} x1={pad.l} y1={yS(v)} x2={pad.l + iw} y2={yS(v)} stroke="rgba(148,163,184,0.06)" />
      ))}

      <line x1={xB} y1={pad.t} x2={xB} y2={pad.t + ih} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 4" strokeWidth={1.2} />
      <line x1={pad.l} y1={yB} x2={pad.l + iw} y2={yB} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 4" strokeWidth={1.2} />
      <line x1={pad.l} y1={pad.t + ih} x2={pad.l + iw} y2={pad.t + ih} stroke="rgba(168,176,191,0.4)" strokeWidth={1.3} />
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + ih} stroke="rgba(168,176,191,0.4)" strokeWidth={1.3} />

      {/* Quadrant meaning — first-user readable */}
      <text x={xB + (pad.l + iw - xB) / 2} y={pad.t + 14} textAnchor="middle"
        fill={GREEN} fillOpacity={0.7} fontSize={9} fontFamily={MONO} fontWeight={800} letterSpacing="0.12em">
        ELITE
      </text>
      <text x={xB + (pad.l + iw - xB) / 2} y={pad.t + 24} textAnchor="middle"
        fill={INK_3} fontSize={7.5} fontFamily={SANS} fontWeight={500}>
        beats close + profitable
      </text>
      <text x={pad.l + (xB - pad.l) / 2} y={pad.t + ih - 8} textAnchor="middle"
        fill={VS} fillOpacity={0.65} fontSize={9} fontFamily={MONO} fontWeight={800} letterSpacing="0.1em">
        NOISE
      </text>

      <text x={pad.l + iw / 2} y={H - 7} textAnchor="middle"
        fill={INK_2} fontSize={10} fontFamily={SANS} fontWeight={650} letterSpacing="0.06em">
        HOW OFTEN THEY BEAT THE CLOSING LINE →
      </text>
      <text x={12} y={pad.t + ih / 2} textAnchor="middle" fill={INK_2} fontSize={10} fontFamily={SANS}
        fontWeight={650} letterSpacing="0.06em" transform={`rotate(-90 12 ${pad.t + ih / 2})`}>
        LIFETIME ROI →
      </text>

      {/* All tick labels — usable */}
      {xTicks.map((v) => (
        <text key={`xt${v}`} x={xS(v)} y={pad.t + ih + 14} textAnchor="middle"
          fill={v === XB ? INK : INK_3} fontSize={9} fontFamily={MONO} fontWeight={v === XB ? 700 : 500}>
          {v}%
        </text>
      ))}
      {yTicks.filter((_, i) => i % 2 === 0).map((v) => (
        <text key={`yt${v}`} x={pad.l - 5} y={yS(v) + 3} textAnchor="end"
          fill={v === 0 ? INK : INK_3} fontSize={9} fontFamily={MONO} fontWeight={v === 0 ? 700 : 500}>
          {v > 0 ? `+${v}` : v}
        </text>
      ))}

      {selPt && (
        <g opacity={0.15}>
          <line x1={pad.l} y1={yS(selPt.roi)} x2={pad.l + iw} y2={yS(selPt.roi)} stroke={GOLD} strokeWidth={1} />
          <line x1={xS(selPt.priorClvPct)} y1={pad.t} x2={xS(selPt.priorClvPct)} y2={pad.t + ih} stroke={GOLD} strokeWidth={1} />
        </g>
      )}

      {sorted.map((p) => {
        const cx = xS(p.priorClvPct);
        const cy = yS(p.roi);
        const r = rFor(p);
        const st = bubbleStyle(p);
        const sel = selected === p.short;
        return (
          <g key={p.short} onClick={() => onSelect(p.short)} style={{ cursor: 'pointer' }} opacity={sel ? 1 : 0.45}>
            <circle cx={cx} cy={cy} r={Math.max(r + 8, 16)} fill="transparent" />
            {sel && (
              <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={GOLD_HI} strokeWidth={1.3} className="c-ring" />
            )}
            <circle
              cx={cx} cy={cy} r={r}
              fill={st.fill} stroke={sel ? GOLD_HI : st.stroke}
              strokeWidth={sel ? 1.7 : 1.25}
              strokeDasharray={sel ? undefined : st.dash}
              filter={sel ? 'url(#cGlow)' : undefined}
            />
            <text x={cx} y={cy + 3} textAnchor="middle" fill={st.text}
              fontSize={r >= 12 ? 8 : 6.5} fontFamily={MONO} fontWeight={800}
              style={{ pointerEvents: 'none' }}>
              {p.short.slice(0, 2)}
            </text>
            {sel && (
              <text x={cx} y={cy - r - 6} textAnchor="middle" fill={GOLD_HI}
                fontSize={10} fontFamily={MONO} fontWeight={700} style={{ pointerEvents: 'none' }}>
                {fmtK(p.invested)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function OddsPath({ journey, fair, clvPct }) {
  const vals = journey.map((p) => -p);
  const fairV = -fair;
  const allV = [...vals, fairV];
  const vMax = Math.max(...allV) + 1;
  const vMin = Math.min(...allV) - 1;
  const span = vMax - vMin || 1;
  const w = 340;
  const h = 34;
  const padY = 5;
  const yS = (v) => h - padY - ((v - vMin) / span) * (h - padY * 2);
  const coords = vals.map((v, i) => [(i / (vals.length - 1)) * w, yS(v)]);
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const last = coords[coords.length - 1];
  const fairY = yS(fairV);
  const color = clvPct >= 0 ? GREEN : VS;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="cOdds" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={0} y1={fairY} x2={w} y2={fairY} stroke={GOLD} strokeWidth={1} strokeDasharray="3.5 2.5" opacity={0.75} />
      <text x={w} y={fairY - 3} textAnchor="end" fill={GOLD} fontSize={6.5} fontFamily={MONO}>FAIR {fmtOdds(fair)}</text>
      <path d={area} fill="url(#cOdds)" />
      <path className="c-draw" d={line} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={0} cy={coords[0][1]} r={1.8} fill={GOLD} />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  );
}

function ClarityCard({ f }) {
  const all = f.mapWallets;
  const [sel, setSel] = useState(all.find((w) => w.qualify === 'VAULT')?.short || all[0].short);
  const selected = all.find((w) => w.short === sel) || all[0];
  const clvGood = f.clvPct >= 0;

  const provenUsd = all.filter((w) => w.side === 'ours' && w.proven).reduce((s, w) => s + w.invested, 0);
  const secondaryUsd = all.filter((w) => w.side === 'ours' && !w.proven && w.skillEligible).reduce((s, w) => s + w.invested, 0);
  const againstUsd = all.filter((w) => w.side === 'against').reduce((s, w) => s + w.invested, 0);
  const board = provenUsd + secondaryUsd + againstUsd || 1;
  const provenPct = Math.round((provenUsd / board) * 100);
  const secondaryPct = Math.round((secondaryUsd / board) * 100);
  const againstPct = Math.max(0, 100 - provenPct - secondaryPct);

  const vault = selected.qualify === 'VAULT';
  const against = selected.side === 'against';
  const provenN = all.filter((w) => w.side === 'ours' && w.proven).length;
  const secondaryN = all.filter((w) => w.side === 'ours' && !w.proven && w.skillEligible).length;
  const againstN = all.filter((w) => w.side === 'against').length;
  const againstProvenN = all.filter((w) => w.side === 'against' && w.proven).length;
  const againstSecondaryN = all.filter((w) => w.side === 'against' && !w.proven).length;
  const sizeHot = selected.sizeRatio >= 1.5;
  const beatHot = selected.priorClvPct >= 55;
  const accent = against ? VS : vault ? GOLD : selected.proven ? GREEN : BLUE;

  const ours = all.filter((w) => w.side === 'ours');
  const isBiggest = [...ours].sort((a, b) => b.invested - a.invested)[0]?.short === selected.short;

  const headline = against
    ? `On the other side — weak track record`
    : isBiggest && selected.proven
      ? `This is the lead wallet on this play`
      : selected.proven
        ? `A proven winner on this side`
        : `Secondary wallet — on the board, not the stake path`;

  return (
    <div style={{
      width: '100%', maxWidth: 384,
      borderRadius: 16,
      fontFamily: SANS,
      WebkitFontSmoothing: 'antialiased',
      background: `
        radial-gradient(80% 36% at 50% -4%, rgba(212,175,55,0.11) 0%, transparent 50%),
        linear-gradient(170deg, #141B2A 0%, #0B0F18 100%)
      `,
      border: '1px solid rgba(212,175,55,0.34)',
      boxShadow: '0 28px 64px -28px rgba(0,0,0,0.94), inset 0 1px 0 rgba(255,255,255,0.05)',
      position: 'relative',
      color: INK,
      overflow: 'hidden',
    }}>
      <Styles />
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1.5, zIndex: 2,
        background: `linear-gradient(90deg, transparent, ${GOLD_HI}, transparent)`,
      }} />

      {/* ════ 1. THE PLAY — look here first ════ */}
      <div className="c-in" style={{ padding: '13px 14px 10px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
        }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: INK_3 }}>
            {f.sport}<span style={{ color: INK_4 }}> · {f.away} @ {f.home}</span>
          </span>
          <span style={{
            fontSize: 7.5, fontWeight: 800, letterSpacing: '0.14em',
            padding: '3px 8px', borderRadius: 4, color: '#0A0E14',
            background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD})`,
          }}>
            TOP
          </span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap',
          fontFeatureSettings: "'tnum'",
        }}>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.025em' }}>{f.pickLabel}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: INK_2 }}>{fmtOdds(f.lockOdds)}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: GOLD_HI }}>{f.units.toFixed(1)}u</span>
        </div>

        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8, fontFeatureSettings: "'tnum'",
        }}>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>{fmtK(f.sharpUsd)}</span>
          <span style={{ fontSize: 12, fontWeight: 650, color: GREEN }}>{Math.round(f.moneyPct)}% of board</span>
          <span style={{ fontSize: 10, color: INK_4, marginLeft: 'auto' }}>{f.lockedAt}</span>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ height: 2.5, borderRadius: 1.5, overflow: 'hidden', display: 'flex', background: 'rgba(0,0,0,0.4)' }}>
            <div style={{ width: `${provenPct}%`, background: GREEN }} />
            <div style={{ width: `${secondaryPct}%`, background: BLUE }} />
            <div style={{ width: `${againstPct}%`, background: VS }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 4,
            fontSize: 8, fontWeight: 700, letterSpacing: '0.05em', fontFeatureSettings: "'tnum'",
          }}>
            <span style={{ color: GREEN }}>Proven money {provenPct}%</span>
            <span style={{ color: BLUE }}>Secondary {secondaryPct}%</span>
            <span style={{ color: VS }}>Against {againstPct}%</span>
          </div>
        </div>
      </div>

      {/* ════ 2. THE MAP — where the money sits ════ */}
      <div className="c-in-2" style={{ padding: '0 10px' }}>
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

            {/* Word legend — not mystery dots */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginBottom: 4,
              fontSize: 10, fontWeight: 550, color: INK_2,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <i style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN, display: 'inline-block' }} />
                Proven ({provenN})
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <i style={{
                  width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
                  border: `1.5px dashed ${BLUE}`, boxSizing: 'border-box',
                }} />
                Secondary ({secondaryN})
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <i style={{ width: 7, height: 7, borderRadius: '50%', background: VS, display: 'inline-block' }} />
                Against ({againstN})
              </span>
              <span style={{ color: INK_4 }}>· size = $</span>
            </div>
          </div>

          <div style={{ padding: '0 2px 2px' }}>
            <WalletMap wallets={all} selected={sel} onSelect={setSel} />
          </div>

          {/* ════ 3. THE LEAD — ranked signal, not mush ════ */}
          <div style={{
            borderTop: `1px solid ${LINE}`,
            padding: '10px 12px 11px',
            borderLeft: `3px solid ${accent}`,
            background: against
              ? 'rgba(240,113,103,0.06)'
              : vault ? 'rgba(212,175,55,0.07)' : 'rgba(52,211,153,0.04)',
          }}>
            {/* Step label — orientation */}
            <div style={{
              fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em',
              color: accent, marginBottom: 6,
            }}>
              {against ? 'SELECTED · OTHER SIDE' : '① LEAD WALLET'}
            </div>

            {/* Who + how much — primary */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700 }}>…{selected.short}</span>
                  {against ? <Pill c={VS}>Against</Pill>
                    : selected.proven ? <Pill c={GREEN} solid>Proven</Pill>
                      : <Pill c={BLUE}>Secondary</Pill>}
                  {vault && <Pill c={GOLD}>Vault</Pill>}
                </div>
                <div style={{
                  marginTop: 5, fontSize: 13, fontWeight: 600, color: INK, lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                }}>
                  {headline}
                </div>
              </div>
              <div style={{
                textAlign: 'right', flexShrink: 0, fontFeatureSettings: "'tnum'",
              }}>
                <div style={{
                  fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em',
                  color: against ? VS : vault ? GOLD_HI : INK,
                }}>
                  {fmtK(selected.invested)}
                </div>
                <div style={{ fontSize: 9, fontWeight: 500, color: INK_3, marginTop: 2 }}>
                  on this play
                </div>
              </div>
            </div>

            {/* WHY TRUST — two clear buckets, not five equal cells */}
            {!against && (
              <div style={{
                marginTop: 10,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}>
                {/* Bucket A: Track record — the proof */}
                <div style={{
                  padding: '9px 10px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.32)',
                  border: `1px solid ${LINE}`,
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: INK_3, marginBottom: 6,
                    textTransform: 'uppercase',
                  }}>
                    Why we trust them
                  </div>
                  <div style={{
                    fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
                    fontFeatureSettings: "'tnum'", marginBottom: 2,
                  }}>
                    {selected.record}
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: GREEN, fontFeatureSettings: "'tnum'",
                  }}>
                    +{selected.roi}% ROI · {selected.wr}% wins
                  </div>
                </div>

                {/* Bucket B: Price skill — plain English */}
                <div style={{
                  padding: '9px 10px',
                  borderRadius: 8,
                  background: beatHot ? 'rgba(52,211,153,0.08)' : 'rgba(0,0,0,0.32)',
                  border: `1px solid ${beatHot ? 'rgba(52,211,153,0.25)' : LINE}`,
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: INK_3, marginBottom: 6,
                    textTransform: 'uppercase',
                  }}>
                    Price skill
                  </div>
                  <div style={{
                    fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
                    fontFeatureSettings: "'tnum'", color: beatHot ? GREEN : INK,
                    marginBottom: 2,
                  }}>
                    {selected.priorClvPct}%
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: INK_2, lineHeight: 1.3 }}>
                    Beat the closing line
                  </div>
                </div>
              </div>
            )}

            {/* Against selected — simpler */}
            {against && (
              <div style={{
                marginTop: 10, padding: '9px 10px', borderRadius: 8,
                background: 'rgba(0,0,0,0.28)', border: `1px solid rgba(240,113,103,0.2)`,
                fontFeatureSettings: "'tnum'",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{selected.record}</div>
                <div style={{ marginTop: 3, fontSize: 12, color: VS, fontWeight: 600 }}>
                  {selected.wr}% wins · {selected.roi}% ROI · beat close {selected.priorClvPct}%
                </div>
              </div>
            )}

            {/* Size vs usual — slider */}
            {!against && (
              <div style={{ marginTop: 9 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  marginBottom: 5, fontFeatureSettings: "'tnum'",
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: INK_3,
                    textTransform: 'uppercase',
                  }}>
                    Size vs usual
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: sizeHot ? GREEN : GOLD_HI,
                  }}>
                    {selected.sizeRatio.toFixed(1)}×
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
                  <div style={{
                    position: 'absolute',
                    left: `${Math.min(92, (selected.avgSportBet / selected.invested) * 100)}%`,
                    top: -2, bottom: -2, width: 2, borderRadius: 1,
                    background: INK, transform: 'translateX(-50%)',
                    boxShadow: '0 0 8px rgba(255,255,255,0.35)',
                  }} />
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginTop: 4,
                  fontSize: 10, fontWeight: 550, color: INK_3, fontFeatureSettings: "'tnum'",
                }}>
                  <span>usual {fmtK(selected.avgSportBet)}</span>
                  <span style={{ color: sizeHot ? GREEN : INK_2 }}>this {fmtK(selected.invested)}</span>
                </div>
              </div>
            )}
          </div>

          {/* ════ 4. OTHER SIDE — skill gap only (WR / beat close / ROI) ════ */}
          <div style={{
            borderTop: '1px solid rgba(240,113,103,0.22)',
            background: 'rgba(240,113,103,0.05)',
            padding: '8px 12px 9px',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              marginBottom: 7,
            }}>
              <span style={{
                fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: VS,
              }}>
                ② OTHER SIDE · {f.against.abbr}
              </span>
              <span style={{
                fontSize: 14, fontWeight: 700, color: VS, fontFeatureSettings: "'tnum'",
              }}>
                {fmtK(f.against.invested)}
              </span>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: 0,
              borderRadius: 7,
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.28)',
              border: '1px solid rgba(240,113,103,0.18)',
            }}>
              <GapCell label="Win rate" value={`${f.against.avgWr}%`} first />
              <GapCell label="Beat close" value={`${f.against.avgClv}%`} />
              <GapCell label="ROI" value={`${f.against.avgRoi}%`} />
            </div>
            <div style={{
              marginTop: 5, fontSize: 10, fontWeight: 550, color: VS,
              fontFeatureSettings: "'tnum'",
            }}>
              {againstProvenN} proven · {againstSecondaryN} secondary
            </div>
          </div>
        </div>
      </div>

      {/* ════ 5. PRICE — supporting, quieter ════ */}
      <div className="c-in-2" style={{ padding: '10px 14px 4px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 5, fontFeatureSettings: "'tnum'",
        }}>
          <div>
            <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: INK_3 }}>
              ③ OUR PRICE
            </span>
            <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 650 }}>{fmtOdds(f.gotOdds)}</span>
            <span style={{ marginLeft: 5, fontSize: 10, color: INK_3 }}>{f.book}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: clvGood ? GREEN : VS }}>
            {clvGood ? '+' : ''}{f.clvPct.toFixed(1)}% vs close
          </span>
        </div>
        <div style={{
          borderRadius: 8, padding: '4px 6px 1px',
          background: 'rgba(0,0,0,0.25)', border: `1px solid ${LINE}`,
        }}>
          <OddsPath journey={f.journey} fair={f.fairOdds} clvPct={f.clvPct} />
        </div>
        <div style={{
          marginTop: 5, display: 'flex', gap: 12,
          fontSize: 10, fontWeight: 550, color: INK_3, fontFeatureSettings: "'tnum'",
        }}>
          <span>HC <span style={{ color: GREEN, fontWeight: 700 }}>+{f.hc}</span></span>
          <span>EDGE <span style={{ color: GREEN, fontWeight: 700 }}>+{f.edge}</span></span>
          <span style={{ color: INK_4, marginLeft: 'auto' }}>fair via {f.fairBook}</span>
        </div>
      </div>

      <div style={{
        margin: '8px 10px 11px',
        padding: '8px 11px',
        borderRadius: 9,
        display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 10px',
        background: 'rgba(212,175,55,0.07)',
        border: '1px solid rgba(212,175,55,0.2)',
        fontFeatureSettings: "'tnum'",
      }}>
        <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: GOLD }}>
          {f.tier.label} · {f.tier.window}
        </span>
        <span style={{ fontSize: 12, fontWeight: 650 }}>{f.tier.record}</span>
        <span style={{ fontSize: 11, color: INK_2 }}>{f.tier.wr}% W</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>+{f.tier.roi}%</span>
        <span style={{ fontSize: 10, color: INK_4, marginLeft: 'auto' }}>n={f.tier.n}</span>
      </div>
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
      <div style={{ fontSize: 8, fontWeight: 600, color: INK_3, marginBottom: 3 }}>{label}</div>
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

export default function LockedStoryLab() {
  const [showProd, setShowProd] = useState(false);
  return (
    <div style={{ minHeight: '100vh', background: PAGE, padding: '28px 16px 80px', fontFamily: SANS }}>
      <Styles />
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: GOLD }}>
            V27 · FIRST-LOOK CLARITY
          </div>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: INK_2, lineHeight: 1.4 }}>
            Numbered story · usable map · wallet ranks what matters.
          </p>
        </div>
        <ClarityCard f={F} />
        <button
          type="button"
          onClick={() => setShowProd((v) => !v)}
          style={{
            marginTop: 16, cursor: 'pointer', width: '100%',
            fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
            padding: '10px', borderRadius: 8,
            border: `1px solid ${LINE}`, background: 'transparent', color: INK_3,
          }}
        >
          {showProd ? 'HIDE PRODUCTION' : 'COMPARE PRODUCTION'}
        </button>
        {showProd && (
          <div style={{ marginTop: 12 }}>
            <LockedPositionCardView f={PROD} defaultExpanded />
          </div>
        )}
      </div>
    </div>
  );
}
