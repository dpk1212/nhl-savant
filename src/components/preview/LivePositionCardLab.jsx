/**
 * LivePositionCardLab — sandbox for Live Positions PAGE + card redesign.
 * Open at  #/position-lab
 *
 * ISOLATION: self-contained fixtures only. No Firebase, no SharpFlow imports,
 * no shared component rewrites. Live users / ops are untouched.
 *
 * Card mode (default): Current vs Proposed v10 premium overhaul.
 * Page mode: holdings list → expand. Sandbox — no live Sharp Flow edits.
 * Port only after explicit visual approval.
 */
import { useState, useEffect } from 'react';
import { Check, Lock, ChevronDown } from 'lucide-react';

const C = {
  page: '#070912',
  card: '#0f1420',
  cardOpen: '#141925',
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
  hair: 'rgba(148,163,184,0.10)',
  hairSoft: 'rgba(148,163,184,0.06)',
  green: '#22c55e',
  red: '#ef4444',
  gold: '#d4af37',
  amber: '#facc15',
  border: 'rgba(255,255,255,0.08)',
};
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";

const fmtOdds = (o) => (o > 0 ? `+${o}` : `${o}`);
const fmtMoney = (v) => {
  const n = Math.abs(v);
  if (n >= 1e6) return `${v < 0 ? '-' : ''}$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1000) return `${v < 0 ? '-' : ''}$${(n / 1000).toFixed(1)}K`;
  return `${v < 0 ? '-' : ''}$${Math.round(n)}`;
};

/** Primary Mets ML fixture — mirrors the live screenshot density */
const METS = {
  id: 'mets-play',
  sport: 'MLB',
  away: 'Chicago White Sox',
  home: 'New York Mets',
  awayShort: 'Sox',
  homeShort: 'Mets',
  pickLabel: 'Mets ML',
  side: 'home',
  displayState: 'PLAY',
  stakePath: 'TOP',
  units: 4.0,
  toWin: 2.78,
  odds: -144,
  book: 'DraftKings',
  fairOdds: -137,
  fairProb: 58,
  sharpMoneyPct: 73,
  sharpGrade: 'strong',
  winnerCount: 3,
  winnerPnl: 208600,
  sideInvested: 21600,
  pinnacleOpposes: true,
  tapeAction: 'boost',
  tapeScore: 3.12,
  pathBaseUnits: 3.0,
  // Proprietary spine (DATA_ASSET_MAP Tier S) — client-facing extras
  hcMargin: 1,
  edge: 7.4,
  netClv: 4.1,
  confirmedOnSide: 3,
  vaultOnSide: 2,
  setupHitRate: 58, // historical: similar TOP + sized-up setups
  checklist: [
    { label: 'Proven MLB winners backing', ok: true },
    { label: 'High-conviction sharps confirming', ok: true },
    { label: 'Money concentrated on this side', ok: true },
  ],
  moneyOnSide: 61,
  sides: {
    away: { invested: 4600, sharps: 2, avg: 2300, pnl: 1300000 },
    home: { invested: 21600, sharps: 3, avg: 7200, pnl: 208600 },
  },
  qualified: {
    away: { invested: 4600, n: 2, pct: 39 },
    home: { invested: 7200, n: 3, pct: 61 },
  },
  flow: {
    sharp: { away: 18, home: 82 },
    tickets: { away: 66, home: 34 },
    money: { away: 66, home: 34 },
  },
  pinOpen: { away: 133, home: -148 },
  pinNow: { away: 126, home: -137 },
  books: [
    { name: 'Pinnacle', odds: -137, sharp: true },
    { name: 'DraftKings', odds: -144 },
    { name: 'BetMGM', odds: -145 },
    { name: 'FanDuel', odds: -146 },
  ],
  wallets: [
    {
      short: 'd77e',
      badges: ['SHARP', 'MLB WINNER'],
      whitelist: 'CONFIRMED',
      qualify: 'SHADOW',
      sizeRatio: 0.82,
      record: '31-16',
      wr: 66,
      roi: 35,
      dollarRoi: 28,
      invested: 593,
      avgSportBet: 720,
      cents: 58,
      pnl: -5,
      priorClvPct: 61,
    },
    {
      short: 'a91c',
      badges: ['SHARP', 'MLB WINNER'],
      whitelist: 'CONFIRMED',
      qualify: 'VAULT',
      sizeRatio: 1.68,
      record: '48-31',
      wr: 61,
      roi: 22,
      dollarRoi: 19,
      invested: 8400,
      avgSportBet: 5000,
      cents: 57,
      pnl: 120,
      priorClvPct: 58,
    },
    {
      short: '3f02',
      badges: ['SHARP', 'MLB WINNER'],
      whitelist: 'CONFIRMED',
      qualify: 'VAULT',
      sizeRatio: 2.14,
      record: '22-14',
      wr: 61,
      roi: 18,
      dollarRoi: 24,
      invested: 12600,
      avgSportBet: 5900,
      cents: 59,
      pnl: -40,
      priorClvPct: 64,
    },
  ],
  combinedWalletPnl: 1500000,
  gameTime: '7:10 PM ET',
};

const MUTED = {
  ...METS,
  id: 'mets-muted',
  displayState: 'MUTED',
  stakePath: 'FADE',
  units: 0,
  toWin: 0,
  tapeAction: 'mute',
  tapeScore: -0.4,
  pickLabel: 'Mets ML',
  pinnacleOpposes: false,
  winnerCount: 1,
  sideInvested: 4200,
  hcMargin: 0,
  edge: -1.2,
  netClv: -2.8,
  confirmedOnSide: 1,
  vaultOnSide: 0,
  setupHitRate: 41,
  checklist: [
    { label: 'Proven MLB winners backing', ok: true },
    { label: 'High-conviction sharps confirming', ok: false },
    { label: 'Money concentrated on this side', ok: false },
  ],
};

const TRACKING = {
  ...METS,
  id: 'avs-track',
  sport: 'NHL',
  away: 'Edmonton Oilers',
  home: 'Colorado Avalanche',
  awayShort: 'EDM',
  homeShort: 'COL',
  pickLabel: 'Avalanche ML',
  displayState: 'TRACKING',
  stakePath: 'LEAN',
  units: 0.5,
  toWin: 0.37,
  odds: -135,
  fairOdds: -128,
  fairProb: 56,
  book: 'FanDuel',
  tapeAction: 'keep',
  tapeScore: 1.2,
  pinnacleOpposes: false,
  winnerCount: 2,
  winnerPnl: 94000,
  sideInvested: 9800,
  sharpMoneyPct: 58,
  sharpGrade: 'moderate',
  hcMargin: 0,
  edge: 3.1,
  netClv: 1.4,
  confirmedOnSide: 2,
  vaultOnSide: 1,
  setupHitRate: 52,
  checklist: [
    { label: 'Proven NHL winners backing', ok: true },
    { label: 'High-conviction sharps confirming', ok: false },
    { label: 'Money concentrated on this side', ok: true },
  ],
  moneyOnSide: 58,
  sides: {
    away: { invested: 7100, sharps: 2, avg: 3550, pnl: 410000 },
    home: { invested: 9800, sharps: 2, avg: 4900, pnl: 94000 },
  },
  wallets: [
    {
      short: 'b2e1',
      badges: ['SHARP', 'NHL WINNER'],
      whitelist: 'CONFIRMED',
      qualify: 'VAULT',
      sizeRatio: 1.42,
      record: '41-28',
      wr: 59,
      roi: 14,
      dollarRoi: 11,
      invested: 5200,
      avgSportBet: 3660,
      cents: 55,
      pnl: 80,
      priorClvPct: 55,
    },
    {
      short: 'c88a',
      badges: ['SHARP', 'NHL WINNER'],
      whitelist: 'FLAT',
      qualify: 'SHADOW',
      sizeRatio: 0.95,
      record: '29-22',
      wr: 57,
      roi: 9,
      dollarRoi: 6,
      invested: 4600,
      avgSportBet: 4840,
      cents: 54,
      pnl: 40,
      priorClvPct: 52,
    },
  ],
  combinedWalletPnl: 504000,
  gameTime: '9:00 PM ET',
};

/** Extra list-density fixtures (page mode) */
const DODGERS = {
  ...METS,
  id: 'lad-play',
  away: 'San Francisco Giants',
  home: 'Los Angeles Dodgers',
  awayShort: 'SF',
  homeShort: 'LAD',
  pickLabel: 'Dodgers ML',
  displayState: 'PLAY',
  stakePath: 'CORE',
  units: 2.5,
  toWin: 2.05,
  odds: -122,
  fairOdds: -118,
  fairProb: 54,
  book: 'FanDuel',
  tapeAction: 'keep',
  tapeScore: 1.4,
  pathBaseUnits: 2.5,
  pinnacleOpposes: false,
  winnerCount: 2,
  winnerPnl: 88000,
  sideInvested: 14200,
  sharpMoneyPct: 64,
  sharpGrade: 'moderate',
  hcMargin: 0,
  edge: 4.2,
  netClv: 2.1,
  confirmedOnSide: 2,
  vaultOnSide: 1,
  setupHitRate: 54,
  checklist: [
    { label: 'Proven MLB winners backing', ok: true },
    { label: 'High-conviction sharps confirming', ok: false },
    { label: 'Money concentrated on this side', ok: true },
  ],
  moneyOnSide: 64,
  sides: {
    away: { invested: 8000, sharps: 2, avg: 4000, pnl: 620000 },
    home: { invested: 14200, sharps: 2, avg: 7100, pnl: 88000 },
  },
  wallets: [
    {
      short: 'e4a1',
      badges: ['SHARP', 'MLB WINNER'],
      whitelist: 'CONFIRMED',
      qualify: 'VAULT',
      sizeRatio: 1.55,
      record: '36-24',
      wr: 60,
      roi: 16,
      dollarRoi: 13,
      invested: 7800,
      avgSportBet: 5030,
      cents: 56,
      pnl: 45,
      priorClvPct: 57,
    },
    {
      short: '91bb',
      badges: ['SHARP', 'MLB WINNER'],
      whitelist: 'CONFIRMED',
      qualify: 'SHADOW',
      sizeRatio: 1.12,
      record: '28-19',
      wr: 60,
      roi: 12,
      dollarRoi: 9,
      invested: 6400,
      avgSportBet: 5710,
      cents: 55,
      pnl: 22,
      priorClvPct: 54,
    },
  ],
  combinedWalletPnl: 708000,
  gameTime: '10:10 PM ET',
};

const CELTICS = {
  ...METS,
  id: 'bos-live',
  sport: 'NBA',
  away: 'Miami Heat',
  home: 'Boston Celtics',
  awayShort: 'MIA',
  homeShort: 'BOS',
  pickLabel: 'Celtics ML',
  displayState: 'PLAY',
  stakePath: 'TOP',
  units: 3.0,
  toWin: 2.14,
  odds: -140,
  fairOdds: -132,
  fairProb: 57,
  book: 'DraftKings',
  tapeAction: 'boost',
  tapeScore: 2.6,
  pathBaseUnits: 2.5,
  pinnacleOpposes: false,
  winnerCount: 3,
  winnerPnl: 312000,
  sideInvested: 28400,
  sharpMoneyPct: 71,
  sharpGrade: 'strong',
  hcMargin: 1,
  edge: 6.1,
  netClv: 3.4,
  confirmedOnSide: 3,
  vaultOnSide: 2,
  setupHitRate: 56,
  isLive: true,
  checklist: [
    { label: 'Proven NBA winners backing', ok: true },
    { label: 'High-conviction sharps confirming', ok: true },
    { label: 'Money concentrated on this side', ok: true },
  ],
  moneyOnSide: 71,
  sides: {
    away: { invested: 11600, sharps: 2, avg: 5800, pnl: 890000 },
    home: { invested: 28400, sharps: 3, avg: 9460, pnl: 312000 },
  },
  wallets: [
    {
      short: '7c90',
      badges: ['SHARP', 'NBA WINNER'],
      whitelist: 'CONFIRMED',
      qualify: 'VAULT',
      sizeRatio: 1.92,
      record: '44-29',
      wr: 60,
      roi: 19,
      dollarRoi: 15,
      invested: 11200,
      avgSportBet: 5830,
      cents: 58,
      pnl: 90,
      priorClvPct: 60,
    },
    {
      short: '2d55',
      badges: ['SHARP', 'NBA WINNER'],
      whitelist: 'CONFIRMED',
      qualify: 'VAULT',
      sizeRatio: 1.48,
      record: '39-26',
      wr: 60,
      roi: 17,
      dollarRoi: 14,
      invested: 9800,
      avgSportBet: 6620,
      cents: 57,
      pnl: 70,
      priorClvPct: 56,
    },
    {
      short: 'aa11',
      badges: ['SHARP', 'NBA WINNER'],
      whitelist: 'CONFIRMED',
      qualify: 'SHADOW',
      sizeRatio: 1.21,
      record: '33-22',
      wr: 60,
      roi: 11,
      dollarRoi: 8,
      invested: 7400,
      avgSportBet: 6110,
      cents: 55,
      pnl: 30,
      priorClvPct: 53,
    },
  ],
  combinedWalletPnl: 1202000,
  gameTime: 'LIVE',
};

const FIXTURES = [METS, MUTED, TRACKING, DODGERS, CELTICS];
const PAGE_FIXTURES = FIXTURES;

/** ── Market siblings — same game, three markets (ML / Spread / Total) ── */
const METS_SPREAD = {
  ...METS,
  id: 'mets-spread',
  marketType: 'SPREAD',
  pickLabel: 'Mets -1.5',
  odds: 134,
  book: 'FanDuel',
  fairOdds: 142,
  fairProb: 41,
  displayState: 'TRACKING',
  stakePath: 'LEAN',
  units: 1.0,
  toWin: 1.34,
  pathBaseUnits: 1.0,
  tapeAction: 'keep',
  tapeScore: 1.4,
  confirmedOnSide: 2,
  vaultOnSide: 1,
  hcMargin: 0,
  edge: 3.2,
  netClv: 2.1,
  setupHitRate: 52,
  sideInvested: 9800,
  pinnacleOpposes: false,
  sharpMoneyPct: 64,
  sides: {
    away: { invested: 5500, sharps: 1, avg: 5500, pnl: 640000 },
    home: { invested: 9800, sharps: 2, avg: 4900, pnl: 208600 },
  },
  flow: {
    sharp: { away: 36, home: 64 },
    tickets: { away: 58, home: 42 },
    money: { away: 55, home: 45 },
  },
  pinOpen: { away: -156, home: 142 },
  pinNow: { away: -162, home: 148 },
  books: [
    { name: 'Pinnacle', odds: 142, sharp: true },
    { name: 'FanDuel', odds: 134 },
    { name: 'DraftKings', odds: 130 },
    { name: 'BetMGM', odds: 128 },
  ],
  wallets: METS.wallets.slice(1),
};

const METS_TOTAL = {
  ...METS,
  id: 'mets-total',
  marketType: 'TOTAL',
  pickLabel: 'Over 8.5',
  awayShort: 'Under',
  homeShort: 'Over',
  side: 'home',
  odds: -105,
  book: 'BetMGM',
  fairOdds: -102,
  fairProb: 50,
  displayState: 'MONITORING',
  stakePath: 'MONITORING',
  units: 0,
  toWin: 0,
  pathBaseUnits: 0,
  tapeAction: 'keep',
  tapeScore: 0.6,
  confirmedOnSide: 1,
  vaultOnSide: 0,
  hcMargin: 0,
  edge: 1.1,
  netClv: 0.4,
  setupHitRate: 47,
  sideInvested: 2100,
  pinnacleOpposes: false,
  sharpMoneyPct: 55,
  sides: {
    away: { invested: 1700, sharps: 1, avg: 1700, pnl: 410000 },
    home: { invested: 2100, sharps: 1, avg: 2100, pnl: 208600 },
  },
  flow: {
    sharp: { away: 45, home: 55 },
    tickets: { away: 48, home: 52 },
    money: { away: 49, home: 51 },
  },
  pinOpen: { away: -108, home: -112 },
  pinNow: { away: -115, home: -105 },
  books: [
    { name: 'Pinnacle', odds: -102, sharp: true },
    { name: 'BetMGM', odds: -105 },
    { name: 'FanDuel', odds: -108 },
    { name: 'DraftKings', odds: -110 },
  ],
  wallets: [METS.wallets[1]],
};

METS.marketType = 'ML';
const MARKET_GROUPS = { 'cws-nym': [METS, METS_SPREAD, METS_TOTAL] };
METS.groupId = 'cws-nym';
METS_SPREAD.groupId = 'cws-nym';
METS_TOTAL.groupId = 'cws-nym';
const ALL_FIXTURES = [...FIXTURES, METS_SPREAD, METS_TOTAL];

/** ── Locked pick fixture — post-lock story: price journey + CLV ── */
const LOCKED_METS = {
  ...METS,
  id: 'mets-locked',
  displayState: 'LOCKED',
  lockedAt: '7:44 AM',
  lockOdds: -144,
  peakOdds: -137,
  peakAt: '9:07 AM',
  nowOdds: -137,
  clvPct: 2.3,
  serial: 'SF-MLB-0716-04',
  record30d: { record: '34-21', units: '+18.2u', scope: 'MLB · last 30 days' },
  lockChecks: ['Proven winners backing', 'High conviction', 'Money concentrated'],
};

const STATE_META = {
  PLAY: { pill: 'PLAY', color: C.green, bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.28)' },
  TRACKING: { pill: 'TRACKING', color: C.amber, bg: 'rgba(250,204,21,0.10)', border: 'rgba(250,204,21,0.28)' },
  MUTED: { pill: 'MUTED', color: C.red, bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.28)' },
  MONITORING: { pill: 'MONITORING', color: C.textMuted, bg: 'rgba(107,114,128,0.10)', border: 'rgba(107,114,128,0.28)' },
};

function useCountUp(target, run, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) { setV(0); return; }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setV(target); return;
    }
    let raf; let start;
    const tick = (t) => {
      if (start == null) start = t;
      const prog = Math.min(1, (t - start) / ms);
      setV(target * (1 - Math.pow(1 - prog, 3)));
      if (prog < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

function MiniSpark({ points, color, against, compact }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const w = compact ? 72 : 120; const h = compact ? 22 : 28;
  const d = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / span) * (h - 4) - 2;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <div>
      <svg width={w} height={h} style={{ display: 'block', marginLeft: compact ? 'auto' : 0 }}>
        <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
      {!compact && (
        <div style={{ fontSize: '0.58rem', fontWeight: 700, color, marginTop: 4 }}>
          {against ? '↓ Moving against play' : '↑ Moving with play'}
        </div>
      )}
    </div>
  );
}

function FlowBar({ label, away, home, awayShort, homeShort, accent }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', color: C.textMuted, marginBottom: 4, fontFeatureSettings: "'tnum'" }}>
        <span>{awayShort} {away}%</span>
        <span style={{ letterSpacing: '0.08em', fontFamily: MONO }}>{label}</span>
        <span>{home}% {homeShort}</span>
      </div>
      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
        <div style={{ width: `${away}%`, background: 'rgba(148,163,184,0.35)' }} />
        <div style={{ width: `${home}%`, background: accent }} />
      </div>
    </div>
  );
}

function HeroChart({ points, color, h = 72, gid = 'posChart' }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const w = 280;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / span) * (h - 8) - 4;
    return [x, y];
  });
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="0" y1={h * t} x2={w} y2={h * t} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="3.5" fill={color} />
    </svg>
  );
}

function RangeRail({ lowLabel, highLabel, pct, color }) {
  const p = Math.max(4, Math.min(96, pct));
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 4, borderRadius: 999, background: 'rgba(148,163,184,0.18)', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: `${p}%`, top: '50%', transform: 'translate(-50%, -50%)',
          width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 0 3px ${color}33`,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: '0.55rem', color: C.textMuted, fontFeatureSettings: "'tnum'" }}>
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

/** Team monogram — Apple Sports crest stand-in */
function TeamMark({ code, active, accent }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.62rem', fontWeight: 900, letterSpacing: '-0.02em',
      background: active ? `${accent}22` : 'rgba(255,255,255,0.05)',
      border: `1px solid ${active ? `${accent}66` : C.hair}`,
      color: active ? accent : C.textMuted,
      boxShadow: active ? `0 0 20px -6px ${accent}` : 'none',
    }}>
      {code.slice(0, 3).toUpperCase()}
    </div>
  );
}








/** Fidelity / Public label–value row */
function DetailRow({ label, value, color = C.text, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12,
      padding: '10px 0',
      borderBottom: last ? 'none' : `1px solid ${C.hairSoft}`,
    }}>
      <span style={{ fontSize: '0.7rem', color: C.textMuted }}>{label}</span>
      <span style={{ fontSize: '0.76rem', fontWeight: 700, color, fontFeatureSettings: "'tnum'", textAlign: 'right' }}>{value}</span>
    </div>
  );
}

/**
 * Fidelity Positions–style wallet row: identity | ×usual | value pill.
 * Tap expands Public-style detail rows (not a nested mini-card).
 */
function WalletListRow({ w, side, sport, accent, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const sizedUp = w.sizeRatio >= 1.5;
  const wlLabel = w.whitelist === 'CONFIRMED' ? 'Proven' : w.whitelist === 'FLAT' ? 'Solid' : 'Watch';
  const wlColor = w.whitelist === 'CONFIRMED' ? C.gold : w.whitelist === 'FLAT' ? C.amber : C.textMuted;
  const sizeLabel = w.qualify === 'VAULT' ? 'Above their avg' : 'Light size';

  return (
    <div style={{ borderBottom: `1px solid ${C.hairSoft}` }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 0', background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'inherit', textAlign: 'left',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '-0.01em' }}>…{w.short}</span>
            <span style={{ fontSize: '0.5rem', fontWeight: 800, color: wlColor }}>{wlLabel}</span>
            {sizedUp && <span style={{ fontSize: '0.5rem', fontWeight: 800, color: accent }}>High conviction</span>}
          </div>
          <div style={{ fontSize: '0.58rem', color: C.textMuted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>
            {w.record} · {w.wr}% win · <span style={{ color: C.green }}>+{w.dollarRoi ?? w.roi}% ROI</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 56 }}>
          <div style={{
            fontSize: '0.62rem', fontWeight: 800, color: sizedUp ? accent : C.textSec,
            fontFeatureSettings: "'tnum'",
          }}>
            {w.sizeRatio.toFixed(1)}×
          </div>
          <div style={{ fontSize: '0.48rem', color: C.textFaint, marginTop: 1 }}>vs usual</div>
        </div>
        <div style={{
          flexShrink: 0, padding: '6px 10px', borderRadius: 8,
          background: sizedUp ? accent : 'rgba(255,255,255,0.08)',
          color: sizedUp ? '#0a0a0a' : C.text,
          fontSize: '0.78rem', fontWeight: 800, fontFeatureSettings: "'tnum'",
        }}>
          {fmtMoney(w.invested)}
        </div>
        <ChevronDown
          size={14}
          style={{
            flexShrink: 0, color: C.textMuted,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .15s ease',
          }}
        />
      </button>
      {open && (
        <div style={{ padding: '0 0 12px' }}>
          <DetailRow label="Size vs usual" value={`${w.sizeRatio.toFixed(1)}× · ${sizeLabel}`} color={sizedUp ? accent : C.text} />
          <DetailRow label={`Usual ${sport} bet`} value={fmtMoney(w.avgSportBet)} />
          <DetailRow label="This ticket" value={`${side} @ ${w.cents}¢`} />
          <DetailRow label="Beats the close" value={`${w.priorClvPct}% of the time`} />
          <DetailRow
            label="Ticket P&L"
            value={`${w.pnl >= 0 ? '+' : ''}${fmtMoney(w.pnl)}`}
            color={w.pnl >= 0 ? C.green : C.red}
            last
          />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CURRENT — dense mock of today's Live Position card
// ═══════════════════════════════════════════════════════════════════════════
function CurrentCard({ f }) {
  const accent = STATE_META[f.displayState]?.color || C.green;
  const playSide = f.side === 'home' ? f.homeShort : f.awayShort;
  const [walletsOpen, setWalletsOpen] = useState(true);

  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden', background: C.card,
      border: `1px solid ${C.border}`, position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: accent }} />

      {/* Hero — everything loud */}
      <div style={{ padding: '12px 14px 10px 16px' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, color: accent, marginBottom: 6 }}>
          {f.winnerCount} proven {f.sport} winners · +{fmtMoney(f.winnerPnl)} P&L
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>{f.pickLabel}</div>
            <div style={{ fontSize: '0.68rem', color: C.textMuted, marginTop: 3, fontFeatureSettings: "'tnum'" }}>
              fair {fmtOdds(f.fairOdds)} · {f.fairProb}% implied
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'", lineHeight: 1 }}>{fmtOdds(f.odds)}</div>
            <div style={{ fontSize: '0.58rem', color: C.textMuted, marginTop: 3 }}>{f.book}</div>
          </div>
        </div>

        {(f.displayState === 'PLAY' || f.displayState === 'TRACKING') && f.units > 0 && (
          <div style={{
            marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 12px', borderRadius: 10, background: 'rgba(0,0,0,0.35)', border: `1px solid ${C.hair}`,
          }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: '0.5rem', letterSpacing: '0.14em', color: C.textFaint }}>RISK</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFeatureSettings: "'tnum'" }}>{f.units.toFixed(1)}u</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: MONO, fontSize: '0.5rem', letterSpacing: '0.14em', color: C.textFaint }}>TO WIN</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: C.green, fontFeatureSettings: "'tnum'" }}>+{f.toWin.toFixed(2)}u</div>
            </div>
          </div>
        )}
        {f.displayState === 'MUTED' && (
          <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: C.red, fontWeight: 700, fontSize: '0.78rem' }}>
            SHARP CONSENSUS — not playable
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          <Pill color={accent}>{f.winnerCount} {f.sport} WINNERS</Pill>
          <Pill>{fmtMoney(f.sideInvested)} invested</Pill>
          {f.pinnacleOpposes && <Pill color={C.red}>✕ Pinnacle opposes</Pill>}
        </div>
        <div style={{ fontSize: '0.58rem', color: C.textMuted, marginTop: 8 }}>
          sharp money {f.sharpMoneyPct}% ({f.sharpGrade})
        </div>
      </div>

      {/* Sharp consensus + gauge */}
      <div style={{ padding: '12px 14px', borderTop: `1px solid ${C.hair}`, display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: MONO, fontSize: '0.5rem', letterSpacing: '0.12em', color: C.textFaint, marginBottom: 8 }}>SHARP CONSENSUS</div>
          {f.checklist.map((c) => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: '0.68rem', color: c.ok ? C.text : C.textMuted }}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                border: `1.5px solid ${c.ok ? C.green : C.textFaint}`,
                background: c.ok ? C.green : 'transparent',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {c.ok && <Check size={9} color="#0a0a0a" strokeWidth={3} />}
              </span>
              {c.label}
            </div>
          ))}
        </div>
        <div style={{ width: 88, flexShrink: 0, textAlign: 'center' }}>
          <svg width="88" height="52" viewBox="0 0 88 52">
            <path d="M8 48 A36 36 0 0 1 80 48" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="7" strokeLinecap="round" />
            <path d="M8 48 A36 36 0 0 1 80 48" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={`${(f.moneyOnSide / 100) * 113} 113`} />
          </svg>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: -8, fontFeatureSettings: "'tnum'" }}>{f.moneyOnSide}%</div>
          <div style={{ fontFamily: MONO, fontSize: '0.45rem', letterSpacing: '0.08em', color: C.textFaint }}>MONEY ON SIDE</div>
        </div>
      </div>

      {/* ML / Spread / Total */}
      <div style={{ display: 'flex', gap: 6, padding: '0 14px 12px' }}>
        {['ML', 'Spread', 'Total'].map((t) => (
          <span key={t} style={{
            flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 8, fontSize: '0.62rem', fontWeight: 800,
            background: t === 'ML' ? `${C.gold}22` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${t === 'ML' ? `${C.gold}55` : C.hair}`,
            color: t === 'ML' ? C.gold : C.textMuted,
            opacity: t === 'Total' ? 0.5 : 1,
          }}>
            {t === 'Total' ? <><Lock size={10} style={{ display: 'inline', verticalAlign: -1, marginRight: 3 }} />{t}</> : t}
          </span>
        ))}
      </div>

      {/* Money panels */}
      <div style={{ padding: '0 14px 12px' }}>
        <div style={{ fontFamily: MONO, fontSize: '0.5rem', letterSpacing: '0.1em', color: C.textFaint, marginBottom: 8 }}>ALL TRACKED MONEY</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SidePanel team={f.awayShort} s={f.sides.away} active={false} />
          <SidePanel team={f.homeShort} s={f.sides.home} active accent={accent} />
        </div>
        <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.hair}` }}>
          <div style={{ fontSize: '0.58rem', color: C.textMuted, marginBottom: 6 }}>QUALIFIED SHARP MONEY · proven winners we follow</div>
          <div style={{ fontSize: '0.72rem', color: C.textSec, fontFeatureSettings: "'tnum'" }}>
            {f.awayShort} {fmtMoney(f.qualified.away.invested)} ({f.qualified.away.pct}%) · <span style={{ color: accent, fontWeight: 700 }}>{f.homeShort} {fmtMoney(f.qualified.home.invested)} ({f.qualified.home.pct}%)</span>
          </div>
        </div>
      </div>

      {/* Market flow */}
      <div style={{ padding: '12px 14px', borderTop: `1px solid ${C.hair}` }}>
        <div style={{ fontFamily: MONO, fontSize: '0.5rem', letterSpacing: '0.1em', color: C.textFaint, marginBottom: 10 }}>MARKET FLOW</div>
        <FlowBar label="SHARP MONEY" away={f.flow.sharp.away} home={f.flow.sharp.home} awayShort={f.awayShort} homeShort={f.homeShort} accent={accent} />
        <FlowBar label="PUBLIC TICKETS" away={f.flow.tickets.away} home={f.flow.tickets.home} awayShort={f.awayShort} homeShort={f.homeShort} accent={accent} />
        <FlowBar label="PUBLIC MONEY" away={f.flow.money.away} home={f.flow.money.home} awayShort={f.awayShort} homeShort={f.homeShort} accent={accent} />
      </div>

      {/* Price movement */}
      <div style={{ padding: '12px 14px', borderTop: `1px solid ${C.hair}` }}>
        <div style={{ fontFamily: MONO, fontSize: '0.5rem', letterSpacing: '0.1em', color: C.textFaint, marginBottom: 10 }}>PRICE MOVEMENT</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.58rem', color: C.textMuted, marginBottom: 4 }}>Pinnacle — {playSide} ML</div>
            <MiniSpark points={[148, 146, 145, 142, 140, 137]} color={f.pinnacleOpposes ? C.red : C.green} against={f.pinnacleOpposes} />
          </div>
          <div>
            <div style={{ fontSize: '0.58rem', color: C.textMuted, marginBottom: 4 }}>Prediction Market — {f.awayShort}</div>
            <MiniSpark points={[42, 40, 38, 36, 37, 38]} color={C.green} against={false} />
          </div>
        </div>
        <div style={{ fontSize: '0.58rem', color: C.textMuted, marginTop: 10, fontFeatureSettings: "'tnum'" }}>
          Pinnacle Open: {fmtOdds(f.pinOpen.away)} / {fmtOdds(f.pinOpen.home)} · Now: {fmtOdds(f.pinNow.away)} / {fmtOdds(f.pinNow.home)}
          {f.pinnacleOpposes && <span style={{ color: C.red, fontWeight: 700 }}> · Opposes</span>}
        </div>
      </div>

      {/* Books */}
      <div style={{ padding: '12px 14px', borderTop: `1px solid ${C.hair}` }}>
        <div style={{ fontFamily: MONO, fontSize: '0.5rem', letterSpacing: '0.1em', color: C.textFaint, marginBottom: 8 }}>BOOK PRICES — {playSide} ML</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {f.books.map((b) => (
            <div key={b.name} style={{
              flex: '1 1 70px', padding: '8px 6px', borderRadius: 8, textAlign: 'center',
              background: b.sharp ? `${C.gold}18` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${b.sharp ? `${C.gold}55` : C.hair}`,
            }}>
              <div style={{ fontSize: '0.52rem', color: C.textMuted }}>{b.name}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: b.sharp ? C.gold : C.text, fontFeatureSettings: "'tnum'", marginTop: 2 }}>{fmtOdds(b.odds)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallets */}
      <div style={{ borderTop: `1px solid ${C.hair}` }}>
        <button
          type="button"
          onClick={() => setWalletsOpen((o) => !o)}
          style={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 14px', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer',
          }}
        >
          <span style={{ fontFamily: MONO, fontSize: '0.55rem', letterSpacing: '0.1em', color: C.textMuted }}>
            {walletsOpen ? 'HIDE' : 'VIEW'} {f.wallets.length} SHARP WALLETS
          </span>
          <span style={{ fontSize: '0.62rem', color: C.green, fontWeight: 700, fontFeatureSettings: "'tnum'" }}>
            Combined P&L: +{fmtMoney(f.combinedWalletPnl)}
          </span>
        </button>
        {walletsOpen && (
          <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {f.wallets.map((w) => <WalletDense key={w.short} w={w} side={playSide} sport={f.sport} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ children, color }) {
  return (
    <span style={{
      fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.04em',
      padding: '4px 8px', borderRadius: 999,
      color: color || C.textSec,
      background: color ? `${color}18` : 'rgba(255,255,255,0.05)',
      border: `1px solid ${color ? `${color}44` : C.hair}`,
    }}>
      {children}
    </span>
  );
}

function SidePanel({ team, s, active, accent }) {
  return (
    <div style={{
      flex: active ? 1.4 : 1, padding: '10px 10px', borderRadius: 10,
      background: active ? `${accent}12` : 'rgba(255,255,255,0.02)',
      border: `1px solid ${active ? `${accent}44` : C.hair}`,
      opacity: active ? 1 : 0.75,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {active && <span style={{ fontSize: '0.45rem', fontWeight: 900, padding: '2px 5px', borderRadius: 3, background: accent, color: '#0a0a0a' }}>MOST $</span>}
        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: active ? C.text : C.textMuted }}>{team}</span>
      </div>
      <div style={{ fontSize: active ? '1.15rem' : '0.9rem', fontWeight: 900, color: active ? accent : C.textSec, fontFeatureSettings: "'tnum'" }}>{fmtMoney(s.invested)}</div>
      <div style={{ fontSize: '0.55rem', color: C.textMuted, marginTop: 4, fontFeatureSettings: "'tnum'" }}>
        {s.sharps} sharps · avg {fmtMoney(s.avg)}
      </div>
      <div style={{ fontSize: '0.58rem', color: C.green, fontWeight: 700, marginTop: 2, fontFeatureSettings: "'tnum'" }}>+{fmtMoney(s.pnl)} P&L</div>
    </div>
  );
}

/**
 * Side battle — elevated Apple Sports “Team Stats” scoreboard.
 * Away vs home fight for tracked $, sharps, proven $. Client voice.
 */
function BattleStatRow({ label, awayVal, homeVal, awayShare, accent, homeWins }) {
  const awayW = Math.max(4, Math.min(96, awayShare));
  const homeW = 100 - awayW;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 5, fontFeatureSettings: "'tnum'",
      }}>
        <span style={{
          fontSize: '0.88rem', fontWeight: 800, minWidth: 72,
          color: !homeWins ? accent : C.text,
        }}>{awayVal}</span>
        <span style={{ fontSize: '0.58rem', fontWeight: 700, color: C.textMuted, letterSpacing: '0.04em' }}>
          {label}
        </span>
        <span style={{
          fontSize: '0.88rem', fontWeight: 800, minWidth: 72, textAlign: 'right',
          color: homeWins ? accent : C.text,
        }}>{homeVal}</span>
      </div>
      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 2 }}>
        <div className="pos-bar" style={{
          width: `${awayW}%`,
          background: !homeWins
            ? `linear-gradient(90deg, ${accent}, ${accent}cc)`
            : 'rgba(148,163,184,0.35)',
          borderRadius: 3,
        }} />
        <div style={{
          width: `${homeW}%`,
          background: homeWins
            ? `linear-gradient(90deg, ${accent}cc, ${accent})`
            : 'rgba(148,163,184,0.35)',
          borderRadius: 3,
        }} />
      </div>
    </div>
  );
}


function WalletDense({ w, side, sport }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.hair}` }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 6 }}>
        {w.badges.map((b) => (
          <Pill key={b} color={b.includes('WINNER') ? C.gold : C.green}>{b}</Pill>
        ))}
        <span style={{ fontSize: '0.58rem', color: C.textMuted, fontFeatureSettings: "'tnum'" }}>…{w.short}</span>
      </div>
      <div style={{ fontSize: '0.72rem', fontFeatureSettings: "'tnum'" }}>
        <span style={{ color: C.textMuted, fontSize: '0.55rem', marginRight: 6 }}>{sport} RECORD</span>
        <span style={{ fontWeight: 800 }}>{w.record}</span>
        <span style={{ color: C.textSec, marginLeft: 6 }}>{w.wr}% W</span>
        <span style={{ color: C.green, fontWeight: 800, marginLeft: 8 }}>+{w.roi}% ROI</span>
      </div>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.hairSoft}`, fontSize: '0.68rem', fontFeatureSettings: "'tnum'" }}>
        <span style={{ color: C.textMuted, fontSize: '0.52rem', marginRight: 6 }}>THIS GAME</span>
        <span style={{ color: C.gold, fontWeight: 700 }}>{side}</span>
        <span style={{ color: C.textSec, marginLeft: 6 }}>{fmtMoney(w.invested)} @ {w.cents}¢</span>
        <span style={{ color: w.pnl >= 0 ? C.green : C.red, fontWeight: 700, marginLeft: 6 }}>{w.pnl >= 0 ? '+' : ''}{fmtMoney(w.pnl)}</span>
      </div>
    </div>
  );
}

// ── v12.2 BRAND SYSTEM · "champagne & profit" ─────────────────────────────
// Gold = Savant brand + action (our side, PLAY, needle chrome)
// Profit green = money & positive numbers ONLY · Loss red = against/negative
// Steel blue = TRACKING (watching, cool) · Gray = MONITORING
const B = {
  gold: '#d9b95c',
  goldHi: '#f3e2a2',
  profit: '#2fd57e',
  loss: '#f0524f',
  track: '#7fa8f0',
};
const PROPOSED_META = {
  PLAY: { pill: 'PLAY', color: B.gold, bg: 'rgba(217,185,92,0.10)', border: 'rgba(217,185,92,0.30)' },
  TRACKING: { pill: 'TRACKING', color: B.track, bg: 'rgba(127,168,240,0.10)', border: 'rgba(127,168,240,0.28)' },
  MUTED: { pill: 'MUTED', color: B.loss, bg: 'rgba(240,82,79,0.08)', border: 'rgba(240,82,79,0.26)' },
  MONITORING: { pill: 'MONITORING', color: '#8b96ab', bg: 'rgba(139,150,171,0.10)', border: 'rgba(139,150,171,0.26)' },
};

// ═══════════════════════════════════════════════════════════════════════════
// PROPOSED v12 BATTLE — the side-v-side is the centerpiece:
//   · THE BATTLE — facing team columns + Athletic-style mirrored stat rows
//   · EDGE + %+CLV visualized as side-v-side skill rows with delta chips
//   · TapeMeter — continuous skill spectrum (Pass / Standard / Sized up)
//     with the live tape needle: the sizing brain, finally visible
// ═══════════════════════════════════════════════════════════════════════════

function ZoneHead({ children, right, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 3, height: 10, borderRadius: 2, background: accent, boxShadow: `0 0 8px ${accent}88` }} />
        <span style={{ fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.14em', color: C.textMuted }}>
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

/**
 * Athletic-style mirrored battle row: values at edges, label centered,
 * half-bars growing from center toward each side. Winner side lit.
 */
function BattleRowV12({ label, tag, awayVal, homeVal, awayNum, homeNum, accent, playIsHome, higherWins = true }) {
  const total = Math.max(Math.abs(awayNum) + Math.abs(homeNum), 0.0001);
  const awayPct = (Math.abs(awayNum) / total) * 100;
  const homePct = (Math.abs(homeNum) / total) * 100;
  const homeWins = higherWins ? homeNum >= awayNum : homeNum <= awayNum;
  const winColor = accent;
  const loseColor = 'rgba(148,163,184,0.35)';
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 7, fontFeatureSettings: "'tnum'",
      }}>
        <span style={{
          fontSize: '0.82rem', fontWeight: 800, letterSpacing: '-0.02em',
          color: !homeWins ? C.text : C.textMuted,
        }}>{awayVal}</span>
        <span style={{ fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textFaint, textAlign: 'center' }}>
          {label}
          {tag && (
            <span style={{
              marginLeft: 7, padding: '2px 6px', borderRadius: 5, letterSpacing: '0.04em',
              background: `${tag.color}18`, color: tag.color, border: `1px solid ${tag.color}38`,
              fontSize: '0.48rem',
            }}>{tag.text}</span>
          )}
        </span>
        <span style={{
          fontSize: '0.82rem', fontWeight: 800, letterSpacing: '-0.02em',
          color: homeWins ? C.text : C.textMuted,
        }}>{homeVal}</span>
      </div>
      <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', transform: 'scaleX(-1)' }}>
          <div className="pos-bar" style={{
            width: `${awayPct}%`, height: '100%', borderRadius: 2,
            background: !homeWins
              ? `linear-gradient(90deg, ${winColor}55, ${winColor})`
              : loseColor,
          }} />
        </div>
        <div style={{ width: 1, height: 8, background: 'rgba(255,255,255,0.18)' }} />
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div className="pos-bar" style={{
            width: `${homePct}%`, height: '100%', borderRadius: 2,
            background: homeWins
              ? `linear-gradient(90deg, ${winColor}55, ${winColor})`
              : loseColor,
          }} />
        </div>
      </div>
    </div>
  );
}

/** Facing team columns above the battle rows — money is the scoreboard */
function BattleHeader({ f, accent }) {
  const cols = [
    { key: 'away', code: f.awayShort, s: f.sides.away },
    { key: 'home', code: f.homeShort, s: f.sides.home },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, marginBottom: 6 }}>
      {cols.map((c, i) => {
        const ours = f.side === c.key;
        return (
          <div key={c.key} style={{
            flex: 1, textAlign: i === 0 ? 'left' : 'right',
            padding: '14px 14px 12px', borderRadius: 16, position: 'relative', overflow: 'hidden',
            background: ours
              ? `linear-gradient(${i === 0 ? '135deg' : '225deg'}, ${accent}1e 0%, rgba(0,0,0,0.2) 70%)`
              : 'rgba(255,255,255,0.02)',
            border: `1px solid ${ours ? `${accent}45` : C.hairSoft}`,
            boxShadow: ours
              ? `0 16px 40px -24px ${accent}88, inset 0 1px 0 rgba(255,255,255,0.08)`
              : 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              flexDirection: i === 0 ? 'row' : 'row-reverse', marginBottom: 10,
            }}>
              <TeamMark code={c.code} active={ours} accent={accent} />
              {ours && (
                <span style={{
                  fontSize: '0.45rem', fontWeight: 900, letterSpacing: '0.1em',
                  padding: '3px 7px', borderRadius: 5, background: accent, color: '#06100a',
                }}>OUR SIDE</span>
              )}
            </div>
            <div style={{
              fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
              fontFeatureSettings: "'tnum'", color: ours ? C.text : C.textMuted,
              textShadow: ours ? `0 0 30px ${accent}55` : 'none',
            }}>
              {fmtMoney(c.s.invested)}
            </div>
            <div style={{ fontSize: '0.55rem', color: ours ? C.textSec : C.textFaint, marginTop: 5 }}>
              {c.s.sharps} proven · +{fmtMoney(c.s.pnl)} life
            </div>
          </div>
        );
      })}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        alignSelf: 'center', width: 28, height: 28, borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 30%, #1a2030 0%, #05070c 75%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 6px 18px -4px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.45rem', fontWeight: 900, color: C.textSec, letterSpacing: '0.05em',
      }}>VS</div>
    </div>
  );
}

/**
 * TapeMeter — the sizing brain visualized. Continuous spectrum from
 * Pass (<0) → Standard → Sized up (≥2.89) with the live tape needle.
 */
function TapeMeter({ tapeScore, action }) {
  const MIN = -2, MAX = 4.5, MUTE_AT = 0, BOOST_AT = 2.89;
  const clamp = Math.max(MIN, Math.min(MAX, tapeScore));
  const pctOf = (v) => ((v - MIN) / (MAX - MIN)) * 100;
  const needle = pctOf(clamp);
  const color = action === 'boost' ? B.profit : action === 'mute' ? B.loss : C.amber;
  const headline = action === 'boost' ? 'Sized up' : action === 'mute' ? 'Passing' : 'Standard';
  const blurb = action === 'boost'
    ? 'The skill gap favors our side, so the model raised the stake.'
    : action === 'mute'
      ? 'The skill gap runs against this ticket, so the model skipped it.'
      : 'The skill gap is fair, so the model kept the base stake.';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <span style={{ fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textMuted }}>
          SKILL METER
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color, letterSpacing: '-0.02em' }}>{headline}</span>
      </div>
      <div style={{ position: 'relative', paddingTop: 26 }}>
        <div style={{
          position: 'absolute', left: `${needle}%`, top: 0, transform: 'translateX(-50%)',
          background: color, color: '#0a0a0a', fontSize: '0.62rem', fontWeight: 900,
          padding: '4px 10px', borderRadius: 8, fontFeatureSettings: "'tnum'",
          boxShadow: `0 4px 16px -2px ${color}88`, whiteSpace: 'nowrap',
          animation: 'posPin .5s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          {tapeScore > 0 ? '+' : ''}{tapeScore.toFixed(1)}
          <div style={{
            position: 'absolute', left: '50%', bottom: -5, transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: `5px solid ${color}`,
          }} />
        </div>
        <div style={{ position: 'relative', height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${pctOf(MUTE_AT)}%`, background: `linear-gradient(90deg, ${B.loss}66, ${B.loss}22)` }} />
          <div style={{ width: `${pctOf(BOOST_AT) - pctOf(MUTE_AT)}%`, background: 'rgba(250,204,21,0.16)' }} />
          <div style={{ flex: 1, background: `linear-gradient(90deg, ${B.profit}22, ${B.profit}66)` }} />
          <div style={{
            position: 'absolute', left: `${needle}%`, top: 0, bottom: 0, width: 2.5,
            transform: 'translateX(-50%)', background: '#fff', borderRadius: 2,
            boxShadow: `0 0 10px ${color}`,
          }} />
        </div>
        <div style={{ position: 'relative', height: 16, marginTop: 6 }}>
          {[
            { at: pctOf(MUTE_AT), text: '0' },
            { at: pctOf(BOOST_AT), text: '+2.9' },
          ].map((m) => (
            <span key={m.text} style={{
              position: 'absolute', left: `${m.at}%`, transform: 'translateX(-50%)',
              fontSize: '0.48rem', color: C.textFaint, fontFeatureSettings: "'tnum'",
            }}>{m.text}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['Pass', 'Standard', 'Sized up'].map((l, i) => {
            const active = (i === 0 && action === 'mute') || (i === 1 && action === 'keep') || (i === 2 && action === 'boost');
            return (
              <span key={l} style={{
                fontSize: '0.58rem', fontWeight: active ? 800 : 500,
                color: active ? color : C.textFaint,
              }}>{l}</span>
            );
          })}
        </div>
      </div>
      <p style={{ fontSize: '0.68rem', color: C.textSec, lineHeight: 1.45, margin: '12px 0 0' }}>{blurb}</p>
    </div>
  );
}

function ConvictionRow({ w, accent, maxRatio, last }) {
  const ratioColor = w.sizeRatio >= 1.5 ? B.profit : w.sizeRatio >= 1 ? accent : C.textMuted;
  const barPct = Math.min(100, (w.sizeRatio / Math.max(maxRatio, 1.01)) * 100);
  return (
    <div style={{ padding: '11px 0', borderBottom: last ? 'none' : `1px solid ${C.hairSoft}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
          background: `hsl(${(parseInt(w.short, 16) || 0) % 360} 46% 62%)`,
          boxShadow: `0 0 8px hsl(${(parseInt(w.short, 16) || 0) % 360} 46% 62% / 0.6)`,
        }} />
        <span style={{ fontFamily: MONO, fontSize: '0.64rem', fontWeight: 700, color: C.text }}>…{w.short}</span>
        <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.08em', color: B.profit }}>PROVEN</span>
        <span style={{ flex: 1 }} />
        <span style={{
          fontSize: '0.6rem', fontWeight: 800, fontFeatureSettings: "'tnum'",
          color: w.dollarRoi >= 0 ? B.profit : B.loss, marginRight: 10,
        }}>
          {w.dollarRoi >= 0 ? '+' : ''}{w.dollarRoi}% ROI
        </span>
        <span style={{ fontSize: '0.76rem', fontWeight: 800, fontFeatureSettings: "'tnum'" }}>{fmtMoney(w.invested)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div className="pos-bar" style={{
            width: `${barPct}%`, height: '100%', borderRadius: 2,
            background: `linear-gradient(90deg, ${ratioColor}44, ${ratioColor})`,
          }} />
        </div>
        <span style={{
          fontSize: '0.66rem', fontWeight: 800, color: ratioColor,
          fontFeatureSettings: "'tnum'", minWidth: 64, textAlign: 'right',
        }}>{w.sizeRatio.toFixed(1)}× usual</span>
        <span style={{
          fontSize: '0.58rem', color: w.priorClvPct >= 55 ? C.textSec : C.textMuted,
          fontFeatureSettings: "'tnum'", minWidth: 86, textAlign: 'right',
        }}>beats close {w.priorClvPct}%</span>
      </div>
    </div>
  );
}

/** Market rail — one game, three markets. State dot + units per market. */
function MarketRail({ markets, activeId, onSelect }) {
  const NAMES = { ML: 'Moneyline', SPREAD: 'Run line', TOTAL: 'Total' };
  return (
    <div style={{
      display: 'flex', gap: 4, padding: 3, borderRadius: 12, marginBottom: 16,
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.hairSoft}`,
    }}>
      {markets.map((m) => {
        const active = m.id === activeId;
        const mMeta = PROPOSED_META[m.displayState] || PROPOSED_META.MONITORING;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            style={{
              flex: 1, padding: '8px 4px', borderRadius: 9, cursor: 'pointer',
              border: `1px solid ${active ? `${B.gold}55` : 'transparent'}`,
              background: active ? 'rgba(217,185,92,0.1)' : 'transparent',
              transition: 'background .18s ease, border-color .18s ease',
            }}
          >
            <div style={{
              fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.02em',
              color: active ? C.text : C.textMuted, marginBottom: 3,
            }}>
              {NAMES[m.marketType] || m.marketType}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.52rem', fontWeight: 700, fontFeatureSettings: "'tnum'",
              color: active ? C.textSec : C.textFaint,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%', background: mMeta.color,
                boxShadow: active ? `0 0 6px ${mMeta.color}` : 'none',
              }} />
              {m.units > 0 ? `${m.units.toFixed(1)}u` : 'watch'}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ProposedCard({ f, markets, onMarket }) {
  const meta = PROPOSED_META[f.displayState] || PROPOSED_META.PLAY;
  const accent = meta.color;
  const playSide = f.side === 'home' ? f.homeShort : f.awayShort;
  const playIsHome = f.side === 'home';
  const riskAnim = useCountUp(f.units, true, 1000);
  const [tab, setTab] = useState('history');
  const pinSeries = [148, 147, 146, 145, 144, 142, 140, 139, 138, 137];
  const moveColor = f.pinnacleOpposes ? B.loss : B.profit;
  const sortedWallets = [...f.wallets].sort((a, b) => (b.sizeRatio || 0) - (a.sizeRatio || 0));
  const maxRatio = sortedWallets[0]?.sizeRatio || 1;
  const sizeColor = f.tapeAction === 'boost' ? B.profit : f.tapeAction === 'mute' ? B.loss : C.textSec;
  const sizeWord = f.tapeAction === 'boost' ? 'sized up' : f.tapeAction === 'mute' ? 'passed' : 'standard size';
  const isLive = f.isLive || f.gameTime === 'LIVE';
  const centsEdge = Math.abs(f.odds) < Math.abs(f.fairOdds)
    ? `${Math.abs(Math.abs(f.fairOdds) - Math.abs(f.odds))}¢ better than fair`
    : null;

  // Proprietary skill splits — FOR vs AGAINST, mapped onto away/home lanes
  const forWr = Math.round(f.wallets.reduce((s, w) => s + w.wr, 0) / Math.max(1, f.wallets.length));
  const agWr = Math.round(forWr - f.edge);
  const forClv = Math.round(f.wallets.reduce((s, w) => s + w.priorClvPct, 0) / Math.max(1, f.wallets.length));
  const agClv = Math.round(forClv - f.netClv);
  const lane = (forV, agV) => (playIsHome ? { away: agV, home: forV } : { away: forV, home: agV });
  const wrLane = lane(forWr, agWr);
  const clvLane = lane(forClv, agClv);

  const verdict = (() => {
    const vault = f.vaultOnSide > 0 ? `${f.vaultOnSide} betting well above their usual` : null;
    if (f.tapeAction === 'mute') {
      return `${f.confirmedOnSide} proven winner${f.confirmedOnSide === 1 ? '' : 's'} on ${playSide}, but the skill read is weak, so we passed.`;
    }
    const base = `${f.confirmedOnSide} proven ${f.sport} winners on ${playSide}${vault ? `, ${vault}` : ''}.`;
    if (f.tapeAction === 'boost') return `${base} The skill read is strong, so we ${sizeWord}.`;
    if (f.displayState === 'TRACKING') return `${base} Watching with a light stake.`;
    return `${base} We took ${sizeWord}.`;
  })();

  const zone = (i) => ({ className: 'pos-reveal', style: { animationDelay: `${i * 70}ms`, position: 'relative' } });

  return (
    <div style={{
      borderRadius: 28, overflow: 'hidden', background: '#000',
      border: `1px solid ${meta.border}`, position: 'relative',
      boxShadow: '0 40px 80px -36px rgba(0,0,0,0.98), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(130% 60% at 50% -15%, ${accent}30 0%, transparent 52%),
          radial-gradient(60% 30% at 85% 8%, rgba(255,255,255,0.05) 0%, transparent 55%),
          radial-gradient(90% 40% at 50% 108%, rgba(255,255,255,0.03) 0%, transparent 60%)
        `,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: '12%', right: '12%', height: 1.5, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.85,
      }} />

      {/* ── ZONE 1 · THE CALL ── */}
      <div {...zone(0)}>
        <div style={{ padding: '22px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '0.54rem', fontWeight: 800, letterSpacing: '0.14em', color: C.textMuted }}>
              {f.sport}
              <span style={{ color: isLive ? B.loss : C.textFaint, marginLeft: 9 }}>
                {isLive && (
                  <span className="pos-pulse" style={{
                    display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                    background: B.loss, boxShadow: `0 0 8px ${B.loss}`, marginRight: 5, verticalAlign: 'middle',
                  }} />
                )}
                {isLive ? 'LIVE' : f.gameTime}
              </span>
              <span style={{ color: C.textFaint, marginLeft: 9 }}>{f.away} @ {f.home}</span>
            </span>
            <span style={{
              fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.08em',
              padding: '5px 12px', borderRadius: 8, color: '#06100a',
              background: `linear-gradient(180deg, ${accent === B.gold ? B.goldHi : accent} 0%, ${accent} 55%, ${accent}bb 100%)`,
              boxShadow: `0 10px 28px -10px ${accent}, inset 0 1px 0 rgba(255,255,255,0.4)`,
            }}>
              {meta.pill}
            </span>
          </div>

          {markets && markets.length > 1 && (
            <MarketRail markets={markets} activeId={f.id} onSelect={onMarket} />
          )}

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
            <div>
              <div style={{
                fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 10,
              }}>
                {f.pickLabel}
                <span style={{ fontSize: '0.88rem', color: C.textSec, fontWeight: 700, marginLeft: 9, fontFeatureSettings: "'tnum'" }}>
                  {fmtOdds(f.odds)}
                </span>
              </div>
              <div style={{
                fontSize: '3.7rem', fontWeight: 800, letterSpacing: '-0.065em', lineHeight: 0.88,
                fontFeatureSettings: "'tnum'",
                filter: f.units > 0 ? `drop-shadow(0 0 26px ${accent}45)` : 'none',
              }}>
                <span style={{
                  background: f.units > 0
                    ? 'linear-gradient(180deg, #ffffff 12%, #b9c6dc 100%)'
                    : `linear-gradient(180deg, ${B.loss} 12%, #7f1d1d 100%)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {f.units > 0 ? riskAnim.toFixed(1) : '0.0'}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMuted, marginLeft: 5 }}>u</span>
              </div>
              <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 8 }}>our ticket</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ textAlign: 'right', paddingBottom: 5 }}>
              <div style={{
                fontSize: '1.2rem', fontWeight: 800, color: f.units > 0 ? B.profit : C.textMuted,
                fontFeatureSettings: "'tnum'", letterSpacing: '-0.03em',
              }}>
                {f.units > 0 ? `+${f.toWin.toFixed(2)}u` : '—'}
              </div>
              <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 5, marginBottom: 10 }}>to win</div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700 }}>
                <span style={{ color: C.textMuted }}>{f.stakePath}</span>
                <span style={{ color: C.textFaint }}> · </span>
                <span style={{ color: sizeColor }}>
                  {f.tapeAction === 'boost' ? 'Sized up' : f.tapeAction === 'mute' ? 'Pass' : 'Standard'}
                </span>
              </div>
            </div>
          </div>

          <p style={{ margin: '16px 0 0', fontSize: '0.84rem', color: '#c6d0e2', lineHeight: 1.55, maxWidth: 420 }}>
            {verdict}
          </p>
        </div>
      </div>

      <ZoneRule />

      {/* ── ZONE 2 · THE BATTLE ── */}
      <div {...zone(1)}>
        <div style={{ padding: '20px 20px 12px', position: 'relative' }}>
          <ZoneHead accent={accent} right={(
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: accent, fontFeatureSettings: "'tnum'" }}>
              {f.flow.sharp[f.side]}% of sharp $ on {playSide}
            </span>
          )}>
            THE BATTLE
          </ZoneHead>

          <div style={{ position: 'relative' }}>
            <BattleHeader f={f} accent={accent} />
          </div>

          <div style={{ marginTop: 12, position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '50%', top: 8, bottom: 8, width: 1,
              transform: 'translateX(-50%)', pointerEvents: 'none',
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.16) 20%, rgba(255,255,255,0.16) 80%, transparent)',
            }} />
            <BattleRowV12
              label="PROVEN WINNERS"
              awayVal={String(f.sides.away.sharps)}
              homeVal={String(f.sides.home.sharps)}
              awayNum={f.sides.away.sharps}
              homeNum={f.sides.home.sharps}
              accent={accent}
              playIsHome={playIsHome}
            />
            <BattleRowV12
              label="SHARP MONEY"
              awayVal={fmtMoney(f.sides.away.invested)}
              homeVal={fmtMoney(f.sides.home.invested)}
              awayNum={f.sides.away.invested}
              homeNum={f.sides.home.invested}
              accent={accent}
              playIsHome={playIsHome}
            />
            <BattleRowV12
              label="WIN RATE"
              tag={{ text: `EDGE ${f.edge > 0 ? '+' : ''}${f.edge.toFixed(1)}`, color: f.edge >= 0 ? B.profit : B.loss }}
              awayVal={`${wrLane.away}%`}
              homeVal={`${wrLane.home}%`}
              awayNum={wrLane.away}
              homeNum={wrLane.home}
              accent={accent}
              playIsHome={playIsHome}
            />
            <BattleRowV12
              label="BEATS THE CLOSE"
              tag={{ text: `${f.netClv > 0 ? '+' : ''}${f.netClv.toFixed(1)}`, color: f.netClv >= 0 ? B.profit : B.loss }}
              awayVal={`${clvLane.away}%`}
              homeVal={`${clvLane.home}%`}
              awayNum={clvLane.away}
              homeNum={clvLane.home}
              accent={accent}
              playIsHome={playIsHome}
            />
            <BattleRowV12
              label="LIFETIME P&L"
              awayVal={`+${fmtMoney(f.sides.away.pnl)}`}
              homeVal={`+${fmtMoney(f.sides.home.pnl)}`}
              awayNum={f.sides.away.pnl}
              homeNum={f.sides.home.pnl}
              accent={accent}
              playIsHome={playIsHome}
            />
          </div>

          <div style={{ marginTop: 8, borderTop: `1px solid ${C.hairSoft}` }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '12px 0 2px',
            }}>
              <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textFaint }}>
                CARRYING {playSide.toUpperCase()} · TOP {Math.min(3, sortedWallets.length)}
              </span>
              {sortedWallets.length > 3 && (
                <button
                  type="button"
                  onClick={() => setTab('wallets')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontSize: '0.55rem', fontWeight: 700, color: C.textMuted,
                  }}
                >
                  +{sortedWallets.length - 3} more ↓
                </button>
              )}
            </div>
            {sortedWallets.slice(0, 3).map((w, i, arr) => (
              <ConvictionRow key={w.short} w={w} accent={accent} maxRatio={maxRatio} last={i === arr.length - 1} />
            ))}
          </div>
        </div>
      </div>

      <ZoneRule />

      {/* ── ZONE 3 · WHY THIS SIZE ── */}
      <div {...zone(2)}>
        <div style={{ padding: '20px 20px 18px' }}>
          <ZoneHead accent={accent} right={(
            <span style={{ fontSize: '0.6rem', color: C.textMuted, fontFeatureSettings: "'tnum'" }}>
              setups like this hit <span style={{ color: f.setupHitRate >= 55 ? B.profit : C.textSec, fontWeight: 800 }}>{f.setupHitRate}%</span>
            </span>
          )}>
            {f.units > 0 ? `WHY ${f.units.toFixed(1)}u` : 'WHY WE PASSED'}
          </ZoneHead>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, fontFeatureSettings: "'tnum'" }}>
            {[
              { label: 'BASE', val: `${f.pathBaseUnits.toFixed(1)}u`, sub: f.stakePath },
              {
                label: 'SKILL DIAL',
                val: f.tapeAction === 'boost' ? '×1.35' : f.tapeAction === 'mute' ? 'Pass' : 'Hold',
                sub: f.tapeAction === 'boost' ? 'strong' : f.tapeAction === 'mute' ? 'weak' : 'fair',
                color: sizeColor,
              },
              { label: 'TICKET', val: `${f.units.toFixed(1)}u`, sub: 'final', color: f.units > 0 ? '#fff' : B.loss, hot: true },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: i === arr.length - 1 ? '0 0 auto' : 1 }}>
                <div style={{ textAlign: i === 0 ? 'left' : 'center' }}>
                  <div style={{ fontSize: '0.46rem', color: C.textFaint, letterSpacing: '0.1em', marginBottom: 5 }}>{s.label}</div>
                  <div style={{
                    fontSize: s.hot ? '1.4rem' : '1rem', fontWeight: 800,
                    color: s.color || C.text, letterSpacing: '-0.03em',
                    textShadow: s.hot && f.units > 0 ? `0 0 24px ${accent}66` : 'none',
                  }}>{s.val}</div>
                  <div style={{ fontSize: '0.5rem', color: s.color || C.textMuted, fontWeight: 700, marginTop: 3 }}>{s.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{
                    flex: 1, height: 1, margin: '0 12px',
                    background: `linear-gradient(90deg, ${C.hair}, ${i === 1 ? accent : 'rgba(255,255,255,0.18)'})`,
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute', right: -1, top: -2.5, width: 0, height: 0,
                      borderTop: '3px solid transparent', borderBottom: '3px solid transparent',
                      borderLeft: `5px solid ${i === 1 ? accent : 'rgba(255,255,255,0.3)'}`,
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <TapeMeter tapeScore={f.tapeScore} action={f.tapeAction} />
        </div>
      </div>

      <ZoneRule />

      {/* ── ZONE 4 · PRICE CHECK ── */}
      <div {...zone(3)}>
        <div style={{ padding: '20px 20px 18px' }}>
          <ZoneHead accent={accent} right={(
            <span style={{ fontSize: '0.58rem', fontWeight: 800, color: moveColor }}>
              {f.pinnacleOpposes ? 'market moving against us' : 'market moving with us'}
            </span>
          )}>
            PRICE CHECK
          </ZoneHead>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFeatureSettings: "'tnum'" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.48rem', color: C.textFaint, letterSpacing: '0.08em', marginBottom: 4 }}>WE GOT</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{fmtOdds(f.odds)}</div>
              <div style={{ fontSize: '0.52rem', color: C.textMuted, marginTop: 3 }}>{f.book}</div>
            </div>
            <MiniSpark points={pinSeries.slice(0, 7)} color={moveColor} against={f.pinnacleOpposes} compact />
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: '0.48rem', color: C.textFaint, letterSpacing: '0.08em', marginBottom: 4 }}>FAIR LINE</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: moveColor, letterSpacing: '-0.02em' }}>{fmtOdds(f.fairOdds)}</div>
              <div style={{ fontSize: '0.52rem', color: C.textMuted, marginTop: 3 }}>{f.fairProb}% implied</div>
            </div>
          </div>
          {centsEdge && (
            <div style={{ marginTop: 12, fontSize: '0.64rem', color: B.profit, fontWeight: 700 }}>
              ✓ {centsEdge}
            </div>
          )}
        </div>
      </div>

      <ZoneRule />

      {/* ── ZONE 5 · DEPTH ── */}
      <div {...zone(4)}>
        <div style={{ padding: '10px 20px 22px' }}>
          <div style={{ display: 'flex', marginBottom: 16 }}>
            {[
              { id: 'history', label: 'Line history' },
              { id: 'flow', label: 'Money flow' },
              { id: 'wallets', label: 'Wallets' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '12px 0', cursor: 'pointer', border: 'none',
                  background: 'transparent', fontSize: '0.72rem', fontWeight: 800,
                  color: tab === t.id ? C.text : C.textMuted,
                  borderBottom: tab === t.id ? `2px solid ${accent}` : `1px solid ${C.hairSoft}`,
                  transition: 'color .18s ease, border-color .18s ease',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pos-reveal" key={tab}>
            {tab === 'history' && (
              <div>
                <HeroChart points={pinSeries} color={moveColor} h={68} gid={`v12-${f.id}`} />
                <div style={{ marginTop: 10, marginBottom: 16 }}>
                  <RangeRail
                    lowLabel={`Open ${fmtOdds(f.pinOpen.home)}`}
                    highLabel={`Now ${fmtOdds(f.pinNow.home)}`}
                    pct={72}
                    color={moveColor}
                  />
                </div>
                <div style={{ display: 'flex', fontFeatureSettings: "'tnum'" }}>
                  {f.books.map((b, i) => (
                    <div key={b.name} style={{
                      flex: 1, padding: '10px 4px', textAlign: 'center',
                      borderLeft: i === 0 ? 'none' : `1px solid ${C.hairSoft}`,
                    }}>
                      <div style={{ fontSize: '0.46rem', color: b.sharp ? B.gold : C.textMuted, fontWeight: 700, letterSpacing: '0.04em' }}>
                        {b.name.toUpperCase()}
                      </div>
                      <div style={{
                        fontSize: '0.95rem', fontWeight: 800, marginTop: 4,
                        color: b.sharp ? B.gold : C.text,
                      }}>{fmtOdds(b.odds)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'flow' && (
              <div>
                <BattleStatRow
                  label="SHARP $"
                  awayVal={`${f.flow.sharp.away}%`}
                  homeVal={`${f.flow.sharp.home}%`}
                  awayShare={f.flow.sharp.away}
                  accent={accent}
                  homeWins={f.flow.sharp.home >= f.flow.sharp.away}
                />
                <BattleStatRow
                  label="PUBLIC TIX"
                  awayVal={`${f.flow.tickets.away}%`}
                  homeVal={`${f.flow.tickets.home}%`}
                  awayShare={f.flow.tickets.away}
                  accent={accent}
                  homeWins={f.flow.tickets.home >= f.flow.tickets.away}
                />
                <BattleStatRow
                  label="PUBLIC $"
                  awayVal={`${f.flow.money.away}%`}
                  homeVal={`${f.flow.money.home}%`}
                  awayShare={f.flow.money.away}
                  accent={accent}
                  homeWins={f.flow.money.home >= f.flow.money.away}
                />
                <p style={{ fontSize: '0.64rem', color: C.textMuted, lineHeight: 1.55, margin: '12px 0 0' }}>
                  Sharp money vs public split. When the crowd is on one side and proven wallets are on
                  the other, we follow the wallets.
                </p>
              </div>
            )}

            {tab === 'wallets' && (
              <div>
                {sortedWallets.map((w, i) => (
                  <WalletListRow
                    key={`t-${w.short}`}
                    w={w}
                    side={playSide}
                    sport={f.sport}
                    accent={accent}
                    defaultOpen={i === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ZoneRule />

      {/* ── BRANDMARK ── */}
      <div style={{
        position: 'relative', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '14px 20px 16px',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: B.gold, boxShadow: `0 0 8px ${B.gold}`,
          }} />
          <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.24em', color: C.textMuted }}>
            NHL SAVANT · SHARP FLOW
          </span>
        </span>
        <span style={{ fontSize: '0.52rem', color: C.textFaint, fontFeatureSettings: "'tnum'" }}>
          updated 4m ago
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCKED PICK CARD — post-lock story: the ticket is frozen, the market keeps
// moving. Hierarchy: locked ticket → price journey + CLV → receipts.
// Same "champagne & profit" brand system as the live card.
// ═══════════════════════════════════════════════════════════════════════════
/** Betting-slip tear line — notches + perforation. Screenshot candy. */
function TicketPerf() {
  return (
    <div style={{ position: 'relative', height: 22, margin: '2px 0' }}>
      <div style={{
        position: 'absolute', left: 26, right: 26, top: '50%',
        borderTop: '1.5px dashed rgba(255,255,255,0.16)',
      }} />
      {['left', 'right'].map((side) => (
        <div key={side} style={{
          position: 'absolute', [side]: -11, top: '50%', transform: 'translateY(-50%)',
          width: 22, height: 22, borderRadius: '50%', background: C.page,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
        }} />
      ))}
    </div>
  );
}

/** Faux barcode — deterministic from serial. Pure slip aesthetic. */
function TicketBarcode({ serial }) {
  const bars = [];
  let seed = 0;
  for (let i = 0; i < serial.length; i += 1) seed = (seed * 31 + serial.charCodeAt(i)) % 9973;
  for (let i = 0; i < 34; i += 1) {
    seed = (seed * 1103515245 + 12345) % 2147483647;
    bars.push(1 + (seed % 3));
  }
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 1.5, height: 22 }}>
      {bars.map((w, i) => (
        <span key={i} style={{ width: w, background: `rgba(255,255,255,${i % 4 === 0 ? 0.5 : 0.3})`, borderRadius: 0.5 }} />
      ))}
    </div>
  );
}

function JourneyStop({ label, time, odds, color, active }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 64 }}>
      <div style={{
        fontSize: '0.9rem', fontWeight: 800, fontFeatureSettings: "'tnum'",
        color: active ? color : C.text, letterSpacing: '-0.02em',
      }}>{fmtOdds(odds)}</div>
      <div style={{
        width: 9, height: 9, borderRadius: '50%', margin: '7px auto 6px',
        background: color, boxShadow: active ? `0 0 10px ${color}` : 'none',
        border: '2px solid #05070c',
      }} />
      <div style={{ fontSize: '0.52rem', fontWeight: 800, color: active ? color : C.textSec }}>{label}</div>
      <div style={{ fontSize: '0.48rem', color: C.textFaint, marginTop: 2, fontFeatureSettings: "'tnum'" }}>{time}</div>
    </div>
  );
}

function LockedCard({ f }) {
  const accent = B.gold;
  const playSide = f.side === 'home' ? f.homeShort : f.awayShort;
  const riskAnim = useCountUp(f.units, true, 1000);
  const clvGood = f.clvPct >= 0;
  const clvColor = clvGood ? B.profit : B.loss;
  const pinSeries = [144, 143, 143, 141, 139, 137, 138, 137, 137, 137];
  const sortedWallets = [...f.wallets].sort((a, b) => (b.sizeRatio || 0) - (a.sizeRatio || 0));
  const maxRatio = sortedWallets[0]?.sizeRatio || 1;

  const verdict = `Locked at ${fmtOdds(f.lockOdds)} with ${f.confirmedOnSide} proven ${f.sport} winners behind it. `
    + (clvGood
      ? `The market moved our way. This ticket beats the close by ${f.clvPct.toFixed(1)}%.`
      : `The market has drifted ${Math.abs(f.clvPct).toFixed(1)}% against the lock.`);

  const zone = (i) => ({ className: 'pos-reveal', style: { animationDelay: `${i * 70}ms`, position: 'relative' } });

  return (
    <div style={{
      borderRadius: 28, overflow: 'hidden', background: '#000',
      border: `1px solid rgba(217,185,92,0.3)`, position: 'relative',
      boxShadow: '0 40px 80px -36px rgba(0,0,0,0.98), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(130% 60% at 50% -15%, ${accent}2a 0%, transparent 52%),
          radial-gradient(60% 30% at 85% 8%, rgba(255,255,255,0.05) 0%, transparent 55%)
        `,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: '12%', right: '12%', height: 1.5, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.85,
      }} />

      {/* ── THE TICKET (frozen) ── */}
      <div {...zone(0)}>
        <div style={{ padding: '22px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '0.54rem', fontWeight: 800, letterSpacing: '0.14em', color: C.textMuted }}>
              {f.sport}
              <span style={{ color: C.textFaint, marginLeft: 9 }}>{f.away} @ {f.home}</span>
              <span style={{ color: C.textFaint, marginLeft: 9 }}>{f.gameTime}</span>
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.08em',
              padding: '5px 12px', borderRadius: 8, color: '#06100a',
              background: `linear-gradient(180deg, ${B.goldHi} 0%, ${accent} 55%, ${accent}bb 100%)`,
              boxShadow: `0 10px 28px -10px ${accent}, inset 0 1px 0 rgba(255,255,255,0.4)`,
            }}>
              <Lock size={9} strokeWidth={3} />
              LOCKED
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 10 }}>
                {f.pickLabel}
                <span style={{ fontSize: '0.88rem', color: C.textSec, fontWeight: 700, marginLeft: 9, fontFeatureSettings: "'tnum'" }}>
                  {fmtOdds(f.lockOdds)}
                </span>
                <span style={{
                  fontSize: '0.55rem', fontWeight: 800, marginLeft: 9, padding: '3px 8px',
                  borderRadius: 6, background: `${clvColor}18`, color: clvColor,
                  border: `1px solid ${clvColor}40`, fontFeatureSettings: "'tnum'",
                }}>
                  CLV {clvGood ? '+' : ''}{f.clvPct.toFixed(1)}%
                </span>
              </div>
              <div style={{
                fontSize: '3.7rem', fontWeight: 800, letterSpacing: '-0.065em', lineHeight: 0.88,
                fontFeatureSettings: "'tnum'",
                filter: `drop-shadow(0 0 26px ${accent}45)`,
              }}>
                <span style={{
                  background: 'linear-gradient(180deg, #ffffff 12%, #b9c6dc 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {riskAnim.toFixed(1)}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMuted, marginLeft: 5 }}>u</span>
              </div>
              <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 8 }}>
                locked {f.lockedAt} · {f.book}
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ textAlign: 'right', paddingBottom: 5 }}>
              <div style={{
                fontSize: '1.2rem', fontWeight: 800, color: B.profit,
                fontFeatureSettings: "'tnum'", letterSpacing: '-0.03em',
              }}>
                +{f.toWin.toFixed(2)}u
              </div>
              <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 5, marginBottom: 10 }}>to win</div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700 }}>
                <span style={{ color: C.textMuted }}>{f.stakePath}</span>
                <span style={{ color: C.textFaint }}> · </span>
                <span style={{ color: C.textSec }}>frozen at T-15</span>
              </div>
            </div>
          </div>

          <p style={{ margin: '16px 0 0', fontSize: '0.84rem', color: '#c6d0e2', lineHeight: 1.55, maxWidth: 420 }}>
            {verdict}
          </p>

          {/* Size story + lock-time checks, one compact strip */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.hairSoft}`,
            fontFeatureSettings: "'tnum'",
          }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: C.textSec }}>
              {f.pathBaseUnits.toFixed(1)}u base
              <span style={{ color: C.textFaint }}> → </span>
              <span style={{ color: f.tapeAction === 'boost' ? B.profit : f.tapeAction === 'mute' ? B.loss : C.textSec }}>
                {f.tapeAction === 'boost' ? '×1.35 skill' : f.tapeAction === 'mute' ? 'pass' : 'hold'}
              </span>
              <span style={{ color: C.textFaint }}> → </span>
              <span style={{ color: '#fff', fontWeight: 800 }}>{f.units.toFixed(1)}u</span>
            </span>
            <span style={{ fontSize: '0.6rem', color: C.textMuted }}>
              setups like this hit <span style={{ color: f.setupHitRate >= 55 ? B.profit : C.textSec, fontWeight: 800 }}>{f.setupHitRate}%</span>
            </span>
          </div>
          {f.lockChecks && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {f.lockChecks.map((c) => (
                <span key={c} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: '0.55rem', fontWeight: 700, color: C.textSec,
                  padding: '4px 9px', borderRadius: 7,
                  background: 'rgba(47,213,126,0.07)', border: '1px solid rgba(47,213,126,0.22)',
                }}>
                  <Check size={9} strokeWidth={3.5} color={B.profit} />
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <TicketPerf />

      {/* ── PRICE JOURNEY ── */}
      <div {...zone(1)}>
        <div style={{ padding: '20px 20px 18px' }}>
          <ZoneHead accent={accent} right={(
            <span style={{ fontSize: '0.58rem', fontWeight: 800, color: clvColor }}>
              {clvGood ? 'beating the close' : 'behind the close'}
            </span>
          )}>
            PRICE JOURNEY
          </ZoneHead>

          <HeroChart points={pinSeries} color={clvColor} h={64} gid={`locked-${f.id}`} />

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginTop: 4, position: 'relative', padding: '0 6px',
          }}>
            <div style={{
              position: 'absolute', left: 36, right: 36, top: 46, height: 1,
              background: `linear-gradient(90deg, ${accent}66, ${clvColor}66)`,
            }} />
            <JourneyStop label="Locked" time={f.lockedAt} odds={f.lockOdds} color={accent} active />
            <JourneyStop label="Peak" time={f.peakAt} odds={f.peakOdds} color={C.textMuted} />
            <JourneyStop label="Now" time="live" odds={f.nowOdds} color={clvColor} active />
          </div>

          <p style={{ fontSize: '0.64rem', color: C.textMuted, lineHeight: 1.5, margin: '14px 0 0' }}>
            We locked {fmtOdds(f.lockOdds)}. The sharp book now sits at {fmtOdds(f.nowOdds)}.
            {clvGood ? ' Anyone betting now gets a worse price than we did.' : ' The price has improved since our lock.'}
          </p>
        </div>
      </div>

      <ZoneRule />

      {/* ── THE RECEIPTS ── */}
      <div {...zone(2)}>
        <div style={{ padding: '20px 20px 12px' }}>
          <ZoneHead accent={accent} right={(
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: B.profit, fontFeatureSettings: "'tnum'" }}>
              {fmtMoney(f.sideInvested)} at lock
            </span>
          )}>
            THE RECEIPTS
          </ZoneHead>
          {sortedWallets.slice(0, 3).map((w, i, arr) => (
            <ConvictionRow key={w.short} w={w} accent={accent} maxRatio={maxRatio} last={i === arr.length - 1} />
          ))}
        </div>
      </div>

      <TicketPerf />

      {/* ── SHARE STUB — serial, barcode, record, brand ── */}
      <div style={{ position: 'relative', padding: '6px 20px 20px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
        }}>
          <div>
            <div style={{ fontSize: '0.46rem', fontWeight: 800, letterSpacing: '0.14em', color: C.textFaint, marginBottom: 4 }}>
              PICK N°
            </div>
            <div style={{ fontFamily: MONO, fontSize: '0.68rem', fontWeight: 700, color: C.textSec, letterSpacing: '0.06em' }}>
              {f.serial}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.46rem', fontWeight: 800, letterSpacing: '0.14em', color: C.textFaint, marginBottom: 4 }}>
              {f.record30d.scope.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, fontFeatureSettings: "'tnum'" }}>
              {f.record30d.record}
              <span style={{ color: B.profit, marginLeft: 7 }}>{f.record30d.units}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <TicketBarcode serial={f.serial} />
          <span style={{ flex: 1 }} />
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              padding: '9px 16px', borderRadius: 10,
              fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.02em',
              color: '#06100a',
              background: `linear-gradient(180deg, ${B.goldHi} 0%, ${B.gold} 55%, ${B.gold}bb 100%)`,
              border: 'none',
              boxShadow: `0 12px 30px -12px ${B.gold}, inset 0 1px 0 rgba(255,255,255,0.4)`,
            }}
          >
            Share ticket ↗
          </button>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.hairSoft}`,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: B.gold, boxShadow: `0 0 8px ${B.gold}`,
            }} />
            <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.24em', color: C.textMuted }}>
              NHL SAVANT · SHARP FLOW
            </span>
          </span>
          <span style={{ fontSize: '0.52rem', color: C.textFaint, fontFeatureSettings: "'tnum'" }}>
            first pitch {f.gameTime}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE MODE — Live Positions holdings list → expand into ProposedCard
// ═══════════════════════════════════════════════════════════════════════════

function sizeMeta(action) {
  if (action === 'boost') return { label: 'Sized up', color: C.green };
  if (action === 'mute') return { label: 'Pass', color: C.red };
  return { label: 'Standard', color: C.amber };
}

function maxSizeRatio(wallets) {
  if (!wallets?.length) return null;
  return Math.max(...wallets.map((w) => w.sizeRatio || 0));
}

function HoldingsRow({ f, open, onToggle }) {
  const meta = STATE_META[f.displayState] || STATE_META.PLAY;
  const size = sizeMeta(f.tapeAction);
  const ratio = maxSizeRatio(f.wallets);
  const isLive = f.isLive || f.gameTime === 'LIVE';
  const matchup = `${f.awayShort} @ ${f.homeShort}`;

  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 14px',
        background: open ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: 'none',
        borderBottom: `1px solid ${C.hairSoft}`,
        color: C.text,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.08em',
            color: C.textFaint, padding: '2px 6px', borderRadius: 4,
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.hair}`,
          }}>
            {f.sport}
          </span>
          <span style={{
            fontSize: '0.82rem', fontWeight: 800, letterSpacing: '-0.02em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {matchup}
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          fontSize: '0.68rem', color: C.textSec,
        }}>
          <span style={{ fontWeight: 700, color: C.text }}>{f.pickLabel}</span>
          <span style={{ color: C.textFaint }}>{fmtOdds(f.odds)}</span>
          <span style={{
            fontFeatureSettings: "'tnum'",
            color: isLive ? C.red : C.textMuted,
            fontWeight: isLive ? 800 : 500,
          }}>
            {isLive ? '● LIVE' : f.gameTime}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5,
        flexShrink: 0, fontFeatureSettings: "'tnum'",
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.06em',
            padding: '3px 7px', borderRadius: 5,
            background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
          }}>
            {meta.pill}
          </span>
          <span style={{
            fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.03em',
            color: f.units > 0 ? C.text : C.textMuted,
          }}>
            {f.units > 0 ? `${f.units.toFixed(1)}u` : '0u'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {ratio != null && ratio > 0 && (
            <span style={{
              fontSize: '0.62rem', fontWeight: 800,
              color: ratio >= 1.4 ? C.green : C.textSec,
            }}>
              {ratio.toFixed(1)}× usual
            </span>
          )}
          <span style={{
            fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.04em',
            color: size.color,
          }}>
            {size.label}
          </span>
          <ChevronDown
            size={14}
            style={{
              color: C.textFaint,
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform .2s ease',
            }}
          />
        </div>
      </div>
    </button>
  );
}

function LiveTape({ fixtures }) {
  const items = fixtures.flatMap((f) => {
    const side = f.side === 'home' ? f.homeShort : f.awayShort;
    return (f.wallets || []).slice(0, 2).map((w) => ({
      key: `${f.id}-${w.short}`,
      text: `${w.short} · ${side} · ${fmtMoney(w.invested)}`,
      hot: (w.sizeRatio || 0) >= 1.5,
    }));
  });
  if (items.length < 4) return null;
  const loop = [...items, ...items];
  return (
    <div style={{
      overflow: 'hidden', marginBottom: 14, borderRadius: 10,
      border: `1px solid ${C.hair}`, background: 'rgba(0,0,0,0.28)',
      maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
    }}>
      <div className="pos-tape" style={{
        display: 'flex', gap: 28, padding: '9px 0', width: 'max-content',
        fontFamily: MONO, fontSize: '0.58rem', letterSpacing: '0.04em',
      }}>
        {loop.map((it, i) => (
          <span key={`${it.key}-${i}`} style={{ color: it.hot ? C.green : C.textMuted, whiteSpace: 'nowrap' }}>
            {it.hot ? '▲ ' : ''}{it.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function LivePositionsPage({ fixtures, expandedId, onExpand, section = 'live' }) {
  const [sortChip, setSortChip] = useState('rating');
  const playCount = fixtures.filter((f) => f.displayState === 'PLAY').length;
  const total$ = fixtures.reduce((s, f) => s + (f.sideInvested || 0), 0);
  const liveCount = fixtures.filter((f) => f.isLive || f.gameTime === 'LIVE').length;

  const sorted = [...fixtures].sort((a, b) => {
    if (sortChip === 'time') {
      if ((a.isLive || a.gameTime === 'LIVE') !== (b.isLive || b.gameTime === 'LIVE')) {
        return (b.isLive || b.gameTime === 'LIVE') ? 1 : -1;
      }
      return String(a.gameTime).localeCompare(String(b.gameTime));
    }
    if (sortChip === 'invested') return (b.sideInvested || 0) - (a.sideInvested || 0);
    if (sortChip === 'live') {
      const al = a.isLive || a.gameTime === 'LIVE' ? 1 : 0;
      const bl = b.isLive || b.gameTime === 'LIVE' ? 1 : 0;
      return bl - al || (b.units || 0) - (a.units || 0);
    }
    // rating: PLAY first, then units
    const rank = { PLAY: 0, TRACKING: 1, MUTED: 2, MONITORING: 3 };
    return (rank[a.displayState] ?? 9) - (rank[b.displayState] ?? 9) || (b.units || 0) - (a.units || 0);
  });

  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      background: 'linear-gradient(180deg, #0c1018 0%, #080a12 100%)',
      border: `1px solid ${C.border}`,
      boxShadow: '0 24px 64px -32px rgba(0,0,0,0.9)',
    }}>
      {/* Page chrome */}
      <div style={{ padding: '18px 16px 0' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14,
        }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Live Positions
            </div>
            <div style={{ fontSize: '0.62rem', color: C.textMuted, marginTop: 3 }}>
              {fixtures.length} games · {playCount} plays
            </div>
          </div>
          <div style={{ textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: C.green }}>
              {fmtMoney(total$)}
            </div>
            <div style={{ fontSize: '0.48rem', color: C.textFaint, letterSpacing: '0.06em' }}>
              SHARP $ ON PICKS
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14,
        }}>
          {[
            { label: 'GAMES', val: String(fixtures.length) },
            { label: 'PLAYS', val: String(playCount), color: C.green },
            { label: 'LIVE', val: String(liveCount), color: liveCount ? C.red : C.text },
          ].map((k) => (
            <div key={k.label} style={{
              padding: '10px 10px', borderRadius: 12, textAlign: 'center',
              background: 'rgba(0,0,0,0.28)', border: `1px solid ${C.hair}`,
            }}>
              <div style={{
                fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.03em',
                color: k.color || C.text, fontFeatureSettings: "'tnum'",
              }}>
                {k.val}
              </div>
              <div style={{ fontSize: '0.48rem', color: C.textMuted, letterSpacing: '0.08em', marginTop: 2 }}>
                {k.label}
              </div>
            </div>
          ))}
        </div>

        {/* Section segment — Locked / Watchlist placeholders */}
        <div style={{
          display: 'flex', gap: 0, marginBottom: 14,
          borderBottom: `1px solid ${C.hairSoft}`,
        }}>
          {[
            { id: 'live', label: 'Live Positions' },
            { id: 'locked', label: 'Locked' },
            { id: 'watch', label: 'Watchlist' },
          ].map((t) => (
            <div
              key={t.id}
              style={{
                flex: 1, padding: '10px 0 12px', textAlign: 'center',
                fontSize: '0.68rem', fontWeight: 800,
                color: section === t.id ? C.text : C.textMuted,
                borderBottom: section === t.id ? `2px solid ${C.gold}` : '2px solid transparent',
                marginBottom: -1,
                opacity: t.id === 'live' ? 1 : 0.45,
              }}
            >
              {t.label}
            </div>
          ))}
        </div>

        {/* Sort chips (visual + light client sort) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {[
            { id: 'rating', label: '★ Rating' },
            { id: 'time', label: 'Game Time' },
            { id: 'invested', label: '$ Invested' },
            { id: 'live', label: '● Live Now' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortChip(s.id)}
              style={{
                padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                fontSize: '0.58rem', fontWeight: 700,
                background: sortChip === s.id ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.03)',
                color: sortChip === s.id ? C.gold : C.textMuted,
                border: `1px solid ${sortChip === s.id ? `${C.gold}55` : C.hair}`,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <LiveTape fixtures={fixtures} />
      </div>

      {/* Holdings list */}
      <div style={{
        margin: '0 10px 14px', borderRadius: 16, overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.hair}`,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px', borderBottom: `1px solid ${C.hairSoft}`,
        }}>
          <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.08em', color: C.textMuted }}>
            HOLDINGS
          </span>
          <span style={{ fontSize: '0.55rem', color: C.textFaint, fontFeatureSettings: "'tnum'" }}>
            Tap a row to expand
          </span>
        </div>

        {sorted.map((f) => {
          const open = expandedId === f.id;
          return (
            <div key={f.id}>
              <HoldingsRow
                f={f}
                open={open}
                onToggle={() => onExpand(open ? null : f.id)}
              />
              {open && (
                <div className="pos-reveal" style={{
                  padding: '0 8px 12px',
                  background: 'rgba(0,0,0,0.22)',
                  borderBottom: `1px solid ${C.hairSoft}`,
                }}>
                  <ProposedCard f={f} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(section === 'locked' || section === 'watch') && (
        <div style={{
          padding: '28px 20px', textAlign: 'center', color: C.textMuted, fontSize: '0.75rem',
        }}>
          Placeholder in lab — Locked / Watchlist stay on live Sharp Flow for now.
        </div>
      )}
    </div>
  );
}

function CurrentPositionsStack({ fixtures }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {fixtures.map((f) => (
        <CurrentCard key={`cur-${f.id}`} f={f} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LAB SHELL
// ═══════════════════════════════════════════════════════════════════════════
export default function LivePositionCardLab() {
  const [view, setView] = useState('card'); // card | page — card-first overhaul
  const [deck, setDeck] = useState('live'); // live | locked — which card family
  const [mode, setMode] = useState('compare'); // compare | proposed | current
  const [fixtureId, setFixtureId] = useState(METS.id);
  const [expandedId, setExpandedId] = useState(METS.id);
  const f = ALL_FIXTURES.find((x) => x.id === fixtureId) || METS;
  const marketSiblings = f.groupId ? MARKET_GROUPS[f.groupId] : null;

  const wide = view === 'page'
    ? (mode === 'compare' ? 1180 : 520)
    : deck === 'locked'
      ? 430
      : (mode === 'compare' ? 1100 : 460);

  return (
    <div style={{
      minHeight: '100vh', background: C.page, color: C.text,
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      padding: '28px 16px 100px',
    }}>
      <style>{`
        @keyframes posReveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes posBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes posPin { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes posTape { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes posPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .pos-reveal { animation: posReveal .34s cubic-bezier(0.16,1,0.3,1) both; }
        .pos-bar { transform-origin: left center; animation: posBar .75s cubic-bezier(0.16,1,0.3,1) both; }
        .pos-tape { animation: posTape 28s linear infinite; }
        .pos-pulse { animation: posPulse 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pos-reveal, .pos-bar, .pos-tape, .pos-pulse { animation: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: wide, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 8, marginBottom: 14,
          background: 'rgba(212,175,55,0.08)', border: `1px solid ${C.gold}44`,
          fontFamily: MONO, fontSize: '0.58rem', letterSpacing: '0.1em', color: C.gold,
        }}>
          POSITION LAB · v10 PREMIUM · SANDBOX — live Sharp Flow unchanged
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 8px' }}>
          Live Position card
        </h1>
        <p style={{ fontSize: '0.88rem', color: C.textSec, lineHeight: 1.55, margin: '0 0 20px', maxWidth: 640 }}>
          Card overhaul — OLED ticket hero (Revolut) + matchup atmosphere (Apple Sports). Compare Current → Proposed.
          Fixture only — no ops impact.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {[
            { id: 'live', label: 'Live card' },
            { id: 'locked', label: 'Locked card' },
          ].map((m) => (
            <button
              key={`deck-${m.id}`}
              type="button"
              onClick={() => { setDeck(m.id); setView('card'); }}
              style={{
                padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                fontSize: '0.72rem', fontWeight: 700,
                background: deck === m.id && view === 'card' ? 'rgba(217,185,92,0.14)' : 'rgba(255,255,255,0.04)',
                color: deck === m.id && view === 'card' ? C.gold : C.textSec,
                border: `1px solid ${deck === m.id && view === 'card' ? `${C.gold}55` : C.hair}`,
              }}
            >
              {m.label}
            </button>
          ))}
          {[
            { id: 'page', label: 'Page' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setView(m.id)}
              style={{
                padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                fontSize: '0.72rem', fontWeight: 700,
                background: view === m.id ? C.gold : 'rgba(255,255,255,0.04)',
                color: view === m.id ? '#0a0a0a' : C.textSec,
                border: `1px solid ${view === m.id ? C.gold : C.hair}`,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div style={{
          display: view === 'card' && deck === 'locked' ? 'none' : 'flex',
          flexWrap: 'wrap', gap: 8, marginBottom: view === 'card' ? 10 : 24,
        }}>
          {[
            { id: 'proposed', label: 'Proposed' },
            { id: 'compare', label: 'Compare' },
            { id: 'current', label: 'Current only' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              style={{
                padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                fontSize: '0.72rem', fontWeight: 700,
                background: mode === m.id ? 'rgba(34,197,94,0.14)' : 'rgba(255,255,255,0.04)',
                color: mode === m.id ? C.green : C.textSec,
                border: `1px solid ${mode === m.id ? 'rgba(34,197,94,0.45)' : C.hair}`,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {view === 'card' && deck === 'live' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {FIXTURES.map((fx) => (
              <button
                key={fx.id}
                type="button"
                onClick={() => setFixtureId(fx.id)}
                style={{
                  padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
                  fontSize: '0.65rem', fontWeight: 700,
                  background: (fixtureId === fx.id || (fx.groupId && fx.groupId === f.groupId)) ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
                  color: (fixtureId === fx.id || (fx.groupId && fx.groupId === f.groupId)) ? C.green : C.textMuted,
                  border: `1px solid ${(fixtureId === fx.id || (fx.groupId && fx.groupId === f.groupId)) ? 'rgba(34,197,94,0.4)' : C.hair}`,
                }}
              >
                {fx.displayState} · {fx.pickLabel}
              </button>
            ))}
          </div>
        )}

        {view === 'page' ? (
          mode === 'compare' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
              alignItems: 'start',
            }}>
              <Col label="CURRENT" hint="Always-open dense cards">
                <CurrentPositionsStack fixtures={PAGE_FIXTURES} />
              </Col>
              <Col label="PROPOSED PAGE" hint="Holdings list → expand" highlight>
                <LivePositionsPage
                  fixtures={PAGE_FIXTURES}
                  expandedId={expandedId}
                  onExpand={setExpandedId}
                />
              </Col>
            </div>
          ) : mode === 'current' ? (
            <Col label="CURRENT" hint="Always-open dense cards">
              <CurrentPositionsStack fixtures={PAGE_FIXTURES} />
            </Col>
          ) : (
            <Col label="PROPOSED PAGE" hint="Holdings list → expand" highlight>
              <LivePositionsPage
                fixtures={PAGE_FIXTURES}
                expandedId={expandedId}
                onExpand={setExpandedId}
              />
            </Col>
          )
        ) : deck === 'locked' ? (
          <Col label="LOCKED PICK · PROPOSED" hint="Frozen ticket · price journey · receipts" highlight>
            <LockedCard f={LOCKED_METS} />
          </Col>
        ) : mode === 'compare' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
            alignItems: 'start',
          }}>
            <Col label="CURRENT" hint="Today’s density">
              <CurrentCard f={f} />
            </Col>
            <Col label="PROPOSED v12" hint="Battle centerpiece · EDGE + CLV" highlight>
              <ProposedCard f={f} markets={marketSiblings} onMarket={setFixtureId} />
            </Col>
          </div>
        ) : mode === 'current' ? (
          <Col label="CURRENT" hint="Today’s density">
            <CurrentCard f={f} />
          </Col>
        ) : (
          <Col label="PROPOSED v12" hint="Battle centerpiece · EDGE + CLV" highlight>
            <ProposedCard f={f} markets={marketSiblings} onMarket={setFixtureId} />
          </Col>
        )}
      </div>
    </div>
  );
}

function Col({ label, hint, highlight, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{
          fontFamily: MONO, fontSize: '0.62rem', letterSpacing: '0.14em',
          color: highlight ? C.gold : C.textMuted,
        }}>
          {label}
        </span>
        <span style={{ fontSize: '0.62rem', color: C.textFaint }}>{hint}</span>
      </div>
      {children}
    </div>
  );
}
