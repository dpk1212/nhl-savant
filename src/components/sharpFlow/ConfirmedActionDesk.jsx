/**
 * Action desk — live tickets from winning wallets.
 * Sparse header. Dense, scannable rows. No product lectures.
 */
import React, { useEffect, useMemo, useState, memo } from 'react';
import { Activity, ChevronDown } from 'lucide-react';
import {
  buildConfirmedActionRows,
  mergePortfolioActionRows,
  buildConfirmedActionMarquee,
  filterActionRows,
  rowMatchesActionSport,
  sortActionRows,
  sparkPointsForTab,
  actionDateKeys,
  etDateKey,
  formatActionDateChip,
  actionDateParts,
  formatActionKickoff,
  isActionTopPlay,
  actionCardReasons,
} from '../../lib/confirmedActionDesk.js';
import { relocalizeSizeVsUsual } from '../../lib/sizeRatioBands.js';
import { getTeamIdentity, shortTeamNick, teamLogoUrl } from '../../utils/teamIdentity.js';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { useMySharps } from '../../hooks/useMySharps';
import MySharpsDesk from './MySharpsDesk.jsx';
import {
  buildMySharpsRoster,
  collectRecentLegs,
  filterRowsToMySharps,
} from '../../lib/mySharpsDesk.js';

const B = {
  gold: '#D4AF37',
  goldDim: 'rgba(212, 175, 55, 0.12)',
  goldBorder: 'rgba(212, 175, 55, 0.32)',
  green: '#10B981',
  greenDim: 'rgba(16, 185, 129, 0.14)',
  red: '#EF4444',
  amber: '#F59E0B',
  amberDim: 'rgba(245, 158, 11, 0.14)',
  card: '#141821',
  cardAlt: '#1A1F2E',
  cardHover: '#1E2433',
  border: 'rgba(37, 43, 59, 0.9)',
  borderSubtle: 'rgba(26, 32, 48, 0.75)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textSubtle: '#475569',
};

const T = {
  name: { fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' },
  money: { fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
  odds: { fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.2 },
  body: { fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.35 },
  micro: { fontSize: '0.68rem', fontWeight: 600, lineHeight: 1.3 },
  tiny: {
    fontSize: '0.58rem', fontWeight: 700, lineHeight: 1.25,
    letterSpacing: '0.07em', textTransform: 'uppercase',
  },
};

function fmtVol(v) {
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function agoTxt(ts) {
  if (!ts) return '—';
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

function entryClock(ts) {
  if (!ts) return null;
  try {
    return new Date(ts).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return null;
  }
}

function sportColor(sport) {
  if (sport === 'MLB') return '#E31837';
  if (sport === 'NBA') return '#FF8C00';
  if (sport === 'WNBA') return '#F472B6';
  if (sport === 'NFL') return '#4CAF50';
  if (sport === 'SOC') return '#2ECC71';
  if (sport === 'UFC') return '#C0392B';
  if (sport === 'ATP') return '#C8F542';
  if (sport === 'CS2') return '#FF6B1A';
  if (sport === 'LOL') return '#C8AA6E';
  if (sport === 'CBB') return '#FF6B35';
  if (sport === 'CFB') return '#BF5700';
  return B.gold;
}

const SORTS = [
  { id: 'strength', label: 'Best' },
  { id: 'dollars', label: '$' },
  { id: 'size', label: 'Size' },
  { id: 'recency', label: 'Newest' },
  { id: 'skill', label: 'Record' },
  { id: 'form', label: 'Form' },
];

/** Survive desk remounts (wallet-profile refresh / empty-state flicker). */
const deskUi = {
  sortMode: 'strength',
  highMidOnly: false,
  sizedOnly: false,
  clearOnly: false,
  pinWithOnly: false,
  topPlayOnly: false,
  dateKey: null,
  deskMode: 'all',
};

/** Land on My Sharps the next time the Action desk mounts. */
export function focusMySharpsDesk() {
  deskUi.deskMode = 'mine';
}

const FlatSpark = memo(function FlatSpark({ points, width = 64, height = 20 }) {
  if (!points || points.length < 5) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 1;
  const xStep = (width - pad * 2) / (points.length - 1);
  const yH = height - pad * 2;
  const pts = points.map((v, i) => ({
    x: pad + i * xStep,
    y: pad + yH - ((v - min) / range) * yH,
  }));
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) d += ` L${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  // Color by PnL sign (end of cumulative series), not end-vs-start slope.
  // First leg can be a big win so last < first while end is still green (+$).
  const up = points[points.length - 1] >= 0;
  const color = up ? B.green : B.red;
  return (
    <svg width={width} height={height} style={{ display: 'block' }} aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});

/** Larger equity / W-L strip sparkline for the expand panel. */
const PremiumSpark = memo(function PremiumSpark({
  points,
  width = 320,
  height = 64,
  endLabel = null,
}) {
  if (!points || points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const padX = 4;
  const padY = 6;
  const xStep = (width - padX * 2) / Math.max(1, points.length - 1);
  const yH = height - padY * 2;
  const pts = points.map((v, i) => ({
    x: padX + i * xStep,
    y: padY + yH - ((v - min) / range) * yH,
  }));
  let line = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) line += ` L${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  const last = pts[pts.length - 1];
  const fill = `${line} L${last.x.toFixed(1)},${(height - 2).toFixed(1)} L${pts[0].x.toFixed(1)},${(height - 2).toFixed(1)} Z`;
  // Color by final cumulative PnL sign — matches +$ / −$ end label.
  // Do not use last>=first: a large early win then drawdown stays profitable
  // but would paint red (e.g. +7.4k → +5.8k).
  const up = points[points.length - 1] >= 0;
  const stroke = up ? B.green : B.red;
  const fillTint = up ? 'rgba(16,185,129,0.16)' : 'rgba(239,68,68,0.14)';
  const gid = `ps-${up ? 'up' : 'dn'}-${width}-${points.length}`;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.65rem', width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ display: 'block', flex: 1, minWidth: 0 }}
        aria-hidden
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fill} fill={`url(#${gid})`} />
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={last.x} cy={last.y} r={3.2} fill={stroke} />
        <circle cx={last.x} cy={last.y} r={6} fill={fillTint} />
      </svg>
      {endLabel != null && (
        <span style={{
          ...T.body, fontWeight: 800, fontFeatureSettings: "'tnum'",
          color: up ? B.green : B.red, flexShrink: 0, paddingBottom: 2,
        }}>
          {endLabel}
        </span>
      )}
    </div>
  );
});

/** Per-leg dollar PnL: stamped dollarPnl / settledPnl, else invested × flat. */
function legDollarPnl(leg) {
  if (Number.isFinite(leg?.dollarPnl)) return Number(leg.dollarPnl);
  if (Number.isFinite(leg?.settledPnl)) return Number(leg.settledPnl);
  if (Number.isFinite(leg?.flat) && Number.isFinite(leg?.invested) && leg.invested > 0) {
    return leg.invested * leg.flat;
  }
  return null;
}

function fmtSparkEnd(value, mode) {
  if (!Number.isFinite(value)) return null;
  if (mode === 'actual') {
    const abs = Math.abs(value);
    const body = abs >= 1000 ? `$${(abs / 1000).toFixed(1)}K` : `$${Math.round(abs)}`;
    return value >= 0 ? `+${body}` : `-${body}`;
  }
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}u`;
}

function fmtLegDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const [y, m, d] = String(dateStr).split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function sizeWord(band, ratio) {
  if (band === 'press' || ratio >= 1.5) return 'press';
  if (band === 'light' || (Number.isFinite(ratio) && ratio < 0.5)) return 'light';
  if (band === 'lean' || (Number.isFinite(ratio) && ratio < 1)) return 'lean';
  return 'usual';
}

/** "TOTAL 7.5" / "SPREAD -1.5" / "ML" — totals never get a + prefix. */
function formatLegMarket(marketType, line) {
  const m = String(marketType || '').toUpperCase();
  if (!m) return '';
  if (!Number.isFinite(line)) return m;
  if (m === 'TOTAL' || m === 'TOTALS') return `${m === 'TOTALS' ? 'TOTAL' : m} ${line}`;
  if (m === 'SPREAD') {
    const sign = line > 0 ? '+' : '';
    return `${m} ${sign}${line}`;
  }
  return m;
}

function formatAmerican(odds) {
  if (!Number.isFinite(odds) || odds === 0) return null;
  return odds > 0 ? `+${Math.round(odds)}` : `${Math.round(odds)}`;
}

/** Matchup abbrev: stamped matchup, or parse gameKey (kcr_lad → KCR @ LAD). */
function legMatchup(leg) {
  if (leg?.matchup) return leg.matchup;
  const gk = String(leg?.gameKey || '');
  // Letters-only team codes at end (avoids matching date fragments).
  const m = gk.match(/([a-z]{2,5})_([a-z]{2,5})(?:__2)?(?:_(?:total|spread|ml))?$/i);
  if (m) return `${m[1].toUpperCase()} @ ${m[2].toUpperCase()}`;
  return null;
}

/** Matchup with the pick side bright so Chelsea FC @ Fulham FC is never a coin flip. */
function MatchupLine({ away, home, side, fallback }) {
  if (!away || !home) {
    return fallback ? <span>{fallback}</span> : null;
  }
  const pickAway = side === 'away';
  const pickHome = side === 'home';
  const highlight = pickAway || pickHome;
  const awayStyle = {
    color: !highlight ? B.textMuted : (pickAway ? B.text : B.textMuted),
    fontWeight: pickAway ? 800 : 500,
  };
  const homeStyle = {
    color: !highlight ? B.textMuted : (pickHome ? B.text : B.textMuted),
    fontWeight: pickHome ? 800 : 500,
  };
  return (
    <span>
      <span style={awayStyle}>{away}</span>
      <span style={{ color: B.textSubtle }}> @ </span>
      <span style={homeStyle}>{home}</span>
    </span>
  );
}

function legPickName(leg) {
  const side = String(leg?.side || '').toLowerCase();
  if (side === 'over') return 'Over';
  if (side === 'under') return 'Under';
  if (side === 'draw') return 'Draw';
  const away = leg?.away || null;
  const home = leg?.home || null;
  const fromSide = side === 'away' ? away : side === 'home' ? home : null;
  const raw = fromSide
    || (leg?.label && !/^(away|home)$/i.test(String(leg.label)) ? leg.label : null)
    || leg?.label
    || side
    || '—';
  return shortTeamNick(raw, side === 'away' ? home : away);
}

function legCrestName(leg) {
  const side = String(leg?.side || '').toLowerCase();
  if (side === 'over' || side === 'under' || side === 'draw') {
    return side.charAt(0).toUpperCase() + side.slice(1);
  }
  if (side === 'away' && leg?.away) return leg.away;
  if (side === 'home' && leg?.home) return leg.home;
  if (leg?.label && !/^(away|home)$/i.test(String(leg.label))) return leg.label;
  return legPickName(leg);
}

function TicketLegRow({ leg, showSize, pnlMode = 'flat', isMobile = false, sport }) {
  const win = leg.won === 1;
  const ratio = Number(leg.sizeRatio);
  const band = leg.sizeBand;
  const pickName = legPickName(leg);
  const crestName = legCrestName(leg);
  const mktLine = formatLegMarket(leg.marketType, Number(leg.line));
  const matchup = legMatchup(leg);
  const oddsTxt = formatAmerican(Number(leg.odds));
  const dollar = legDollarPnl(leg);
  const sizeHot = Number.isFinite(ratio) && ratio >= 1.5;
  const midText = showSize
    ? (Number.isFinite(ratio) ? `${ratio.toFixed(1)}× ${sizeWord(band, ratio)}` : '—')
    : pnlMode === 'actual'
      ? (Number.isFinite(dollar) ? fmtSparkEnd(dollar, 'actual') : '—')
      : (Number.isFinite(leg.flat)
        ? `${leg.flat >= 0 ? '+' : ''}${leg.flat.toFixed(2)}u`
        : (Number.isFinite(leg.invested) && leg.invested > 0 ? fmtVol(leg.invested) : '—'));
  const midColor = showSize
    ? (sizeHot ? '#E8D28A' : B.textSec)
    : pnlMode === 'actual'
      ? (Number.isFinite(dollar) ? (dollar >= 0 ? '#34D399' : '#F07178') : B.textSubtle)
      : B.textSec;
  const stakeNote = showSize && Number.isFinite(leg.invested) && leg.invested > 0
    ? fmtVol(leg.invested)
    : null;
  const detail = [mktLine, matchup].filter(Boolean).join('  ·  ');
  const result = (
    <span style={{
      ...T.tiny,
      justifySelf: 'end',
      padding: '0.18rem 0.42rem',
      borderRadius: 999,
      color: win ? '#34D399' : '#F07178',
      background: win ? 'rgba(52,211,153,0.12)' : 'rgba(240,113,120,0.12)',
      letterSpacing: '0.08em',
      lineHeight: 1.1,
    }}
    >
      {win ? 'W' : 'L'}
    </span>
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile
        ? '2.7rem 28px minmax(0, 1fr) auto'
        : '3.6rem 32px minmax(0, 1fr) 3.4rem minmax(5.2rem, auto) auto',
      gap: isMobile ? '0.28rem 0.5rem' : '0.35rem 0.75rem',
      alignItems: 'center',
      padding: isMobile ? '0.62rem 0.05rem' : '0.72rem 0.1rem',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      fontFeatureSettings: "'tnum'",
    }}
    >
      <span style={{ fontSize: '0.68rem', fontWeight: 650, color: B.textMuted, letterSpacing: '0.01em' }}>
        {fmtLegDate(leg.date)}
      </span>
      <TeamCrest name={crestName} sport={leg.sport || sport} size={isMobile ? 26 : 30} />
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: isMobile ? '0.88rem' : '0.96rem',
          fontWeight: 680,
          letterSpacing: '-0.03em',
          color: B.text,
          lineHeight: 1.1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        >
          {pickName || '—'}
        </div>
        {detail ? (
          <div style={{
            marginTop: '0.16rem',
            fontSize: '0.68rem',
            fontWeight: 600,
            color: B.textMuted,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          >
            {detail}
          </div>
        ) : null}
      </div>
      {isMobile ? (
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.22rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: oddsTxt ? B.textSec : B.textSubtle }}>
            {oddsTxt || '—'}
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 720, color: midColor }}>
            {midText}
            {stakeNote ? <span style={{ color: B.textSubtle, fontWeight: 600 }}> · {stakeNote}</span> : null}
          </span>
          {result}
        </div>
      ) : (
        <>
          <span style={{
            fontSize: '0.78rem', fontWeight: 700, color: oddsTxt ? B.text : B.textSubtle,
            textAlign: 'right',
          }}
          >
            {oddsTxt || '—'}
          </span>
          <span style={{ textAlign: 'right', minWidth: 0 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 720, color: midColor }}>{midText}</span>
            {stakeNote ? (
              <span style={{ display: 'block', marginTop: '0.1rem', fontSize: '0.64rem', fontWeight: 650, color: B.textSubtle }}>
                {stakeNote}
              </span>
            ) : null}
          </span>
          {result}
        </>
      )}
    </div>
  );
}

/** 30d W-L / ROI from recent legs when profile market×sport stamp is missing. */
function rollupFromRecentLegs(legs, { mode = 'actual', windowDays = 30 } = {}) {
  if (!Array.isArray(legs) || legs.length === 0) return null;
  let wins = 0;
  let invested = 0;
  let dollarPnl = 0;
  let flatSum = 0;
  let flatN = 0;
  for (const leg of legs) {
    if (leg.won === 1) wins += 1;
    const d = legDollarPnl(leg);
    if (Number.isFinite(d) && Number.isFinite(leg?.invested) && leg.invested > 0) {
      invested += leg.invested;
      dollarPnl += d;
    }
    if (Number.isFinite(leg?.flat)) {
      flatSum += leg.flat;
      flatN += 1;
    }
  }
  const n = legs.length;
  const losses = n - wins;
  const roi = mode === 'actual'
    ? (invested > 0 ? Math.round((dollarPnl / invested) * 100) : null)
    : (flatN > 0 ? Math.round((flatSum / flatN) * 100) : null);
  return {
    n,
    wins,
    losses,
    record: `${wins}-${losses}`,
    wr: Math.round((wins / n) * 100),
    roi,
    source: mode === 'actual' ? 'action' : 'featured',
    window: `${windowDays}d`,
    settledPnl: mode === 'actual' ? Math.round(dollarPnl) : null,
  };
}

function fmtBookPnl(pnl) {
  if (!Number.isFinite(pnl)) return null;
  const abs = Math.abs(pnl);
  const body = abs >= 1000
    ? `$${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1)}K`
    : `$${Math.round(abs)}`;
  return pnl >= 0 ? `+${body}` : `-${body}`;
}

function bookRecord(book) {
  if (!book) return null;
  if (book.record) return book.record;
  if (Number.isFinite(book.n)) return `${book.n} bets`;
  return null;
}

function bookRoiText(book) {
  if (!book || !Number.isFinite(book.roi)) return null;
  const kind = book.source === 'action' ? 'ROI' : 'flat';
  return `${book.roi >= 0 ? '+' : ''}${book.roi}% ${kind}`;
}

function bookBits(book) {
  if (!book) return [];
  const pnl = Number.isFinite(book.settledPnl) ? book.settledPnl : null;
  return [
    bookRecord(book),
    fmtBookPnl(pnl),
    bookRoiText(book),
    Number.isFinite(book.wr) ? `${book.wr}% wins` : null,
  ].filter(Boolean);
}

function ScopeHero({ book, empty }) {
  if (!book) {
    return (
      <div style={{ ...T.micro, color: B.textSubtle, padding: '0.45rem 0 0.15rem' }}>{empty}</div>
    );
  }
  const pnl = Number.isFinite(book.settledPnl) ? book.settledPnl : null;
  const pnlLabel = fmtBookPnl(pnl);
  const record = bookRecord(book) || '—';
  const sub = [bookRoiText(book), Number.isFinite(book.wr) ? `${book.wr}% wins` : null]
    .filter(Boolean)
    .join('  ·  ');
  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '0.65rem',
        marginTop: '0.42rem',
      }}
      >
        <span style={{
          fontSize: '1.48rem',
          fontWeight: 680,
          letterSpacing: '-0.045em',
          lineHeight: 1,
          color: B.text,
          fontFeatureSettings: "'tnum'",
        }}
        >
          {record}
        </span>
        {pnlLabel ? (
          <span style={{
            fontSize: '1.48rem',
            fontWeight: 680,
            letterSpacing: '-0.045em',
            lineHeight: 1,
            color: pnl >= 0 ? '#34D399' : '#F07178',
            fontFeatureSettings: "'tnum'",
          }}
          >
            {pnlLabel}
          </span>
        ) : null}
      </div>
      {sub ? (
        <div style={{
          marginTop: '0.38rem',
          fontSize: '0.78rem',
          fontWeight: 650,
          color: B.textSec,
          fontFeatureSettings: "'tnum'",
        }}
        >
          {sub}
        </div>
      ) : null}
    </>
  );
}

function windowEyebrow(book, fallback) {
  if (!book?.window) return fallback;
  if (book.window === 'all') return 'All time';
  return `Last ${book.window}`;
}

/**
 * Action tab: L30 is the loud book, all-time sits under it.
 * Featured tab: one book per scope.
 */
function BetTypeRollupStrip({
  sport,
  marketType,
  sportRollup,
  marketRollup,
  sportAllTime = null,
  marketAllTime = null,
  showDualWindows = false,
  isMobile = false,
}) {
  const mkt = String(marketType || '').toUpperCase();
  const mktLabel = mkt === 'ML' ? 'ML' : mkt;
  const rows = [
    sportRollup || sportAllTime
      ? {
        key: 'sport',
        label: String(sport || '').toUpperCase(),
        l30: sportRollup?.window !== 'all' ? sportRollup : null,
        all: showDualWindows
          ? (sportAllTime || (sportRollup?.window === 'all' ? sportRollup : null))
          : (sportRollup?.window === 'all' ? sportRollup : null),
        single: !showDualWindows ? sportRollup : null,
      }
      : null,
    marketRollup || marketAllTime
      ? {
        key: 'market',
        label: `${String(sport || '').toUpperCase()} ${mktLabel}`.trim(),
        l30: marketRollup?.window !== 'all' ? marketRollup : null,
        all: showDualWindows
          ? (marketAllTime || (marketRollup?.window === 'all' ? marketRollup : null))
          : (marketRollup?.window === 'all' ? marketRollup : null),
        single: !showDualWindows ? marketRollup : null,
      }
      : null,
  ].filter(Boolean);
  if (!rows.length) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile || rows.length < 2 ? '1fr' : '1fr 1fr',
      gap: '0.65rem',
      marginBottom: '0.85rem',
    }}
    >
      {rows.map(({ key, label, l30, all, single }) => {
        const quiet = bookBits(all).join('  ·  ');
        return (
          <div
            key={key}
            data-scope={key}
            style={{
              minWidth: 0,
              padding: isMobile ? '0.78rem 0.82rem 0.72rem' : '0.88rem 0.95rem 0.78rem',
              borderRadius: 14,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div style={{
              ...T.tiny,
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: '#E8D28A',
            }}
            >
              {label}
            </div>
            {showDualWindows ? (
              <>
                <div style={{
                  ...T.tiny,
                  marginTop: '0.55rem',
                  letterSpacing: '0.12em',
                  color: B.textMuted,
                }}
                >
                  Last 30 days
                </div>
                <ScopeHero book={l30} empty="No 30-day sample" />
                <div style={{
                  marginTop: '0.72rem',
                  paddingTop: '0.55rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  gap: '0.55rem',
                  alignItems: 'baseline',
                  minWidth: 0,
                }}
                >
                  <span style={{
                    ...T.tiny,
                    flexShrink: 0,
                    letterSpacing: '0.12em',
                    color: B.textSubtle,
                  }}
                  >
                    All time
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 650,
                    color: B.textMuted,
                    fontFeatureSettings: "'tnum'",
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  >
                    {quiet || '—'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  ...T.tiny,
                  marginTop: '0.55rem',
                  letterSpacing: '0.12em',
                  color: B.textMuted,
                }}
                >
                  {windowEyebrow(single, 'Book')}
                </div>
                <ScopeHero book={single} empty="No book yet" />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        padding: 3,
        borderRadius: 11,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        maxWidth: '100%',
      }}
    >
      {options.map((opt) => {
        const on = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(opt.id)}
            style={{
              border: 'none',
              cursor: 'pointer',
              borderRadius: 8,
              padding: '0.42rem 0.78rem',
              background: on ? 'rgba(212,175,55,0.16)' : 'transparent',
              color: on ? '#E8D28A' : B.textMuted,
              fontSize: '0.72rem',
              fontWeight: 740,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ActionExpandPanel({ row, isMobile }) {
  // form = this sharp's featured history; recent = this sharp's Action tickets
  // Default Action — that's the desk context; featured is one click away.
  const [tab, setTab] = useState('recent');
  const [showMore, setShowMore] = useState(false);
  // Actual $ first — locked picks & Action tickets are sized, not 1u flat.
  const [sparkMode, setSparkMode] = useState('actual');
  const featured = useMemo(
    () => (row.recentFeatured || []).map((leg) => relocalizeSizeVsUsual(leg, row.sportUsualBet)),
    [row.recentFeatured, row.sportUsualBet],
  );
  const action = useMemo(
    () => (row.recentAction || []).map((leg) => relocalizeSizeVsUsual(leg, row.sportUsualBet)),
    [row.recentAction, row.sportUsualBet],
  );
  const spark = sparkPointsForTab(tab, row, sparkMode);
  const curveDays = Number.isFinite(row.flatCurveDays) ? row.flatCurveDays : 30;
  // Featured shipped locks are merged onto Their Action so a card loss
  // cannot hide from the Action book. Fall back to Action only when featured is empty.
  const formLegs = featured.length ? featured : action;
  const legs = tab === 'form' ? formLegs : action;
  const formListIsActionFallback = tab === 'form' && !featured.length && action.length > 0;
  const actionTotalN = Number(row.recentActionTotalN) || action.length;
  const previewN = 5;
  const visibleLegs = showMore ? legs : legs.slice(-previewN);
  const l5 = tab === 'recent' ? (row.form?.actionL5 || row.form?.l5) : row.form?.l5;
  const l10 = tab === 'recent' ? (row.form?.actionL10 || row.form?.l10) : row.form?.l10;
  const formRecord = (window) => {
    const r = window === 5 ? l5 : l10;
    if (!r || (r.w + r.l) <= 0) return null;
    return `${r.w}–${r.l}`;
  };

  // Sport + this bet type (e.g. MLB TOTAL). Featured → flat book; Action → $ book.
  // Action tab always shows L30 + all-time side by side.
  const useActionBooks = tab === 'recent' || formListIsActionFallback;
  const sportRollup = useActionBooks
    ? (row.sportAction || null)
    : (row.sportFeatured || null);
  const marketRollup = (() => {
    if (!useActionBooks) {
      if (row.marketFeatured) return row.marketFeatured;
      const mkt = String(row.marketType || '').toUpperCase();
      const scoped = formLegs.filter((leg) => String(leg.marketType || '').toUpperCase() === mkt);
      return rollupFromRecentLegs(scoped, { mode: 'flat', windowDays: curveDays });
    }
    if (row.marketAction) return row.marketAction;
    // Pre-export profiles lack byMarket L30 — derive from Action ticket list.
    const mkt = String(row.marketType || '').toUpperCase();
    const scoped = action.filter((leg) => String(leg.marketType || '').toUpperCase() === mkt);
    return rollupFromRecentLegs(scoped, {
      mode: 'actual',
      windowDays: curveDays,
    });
  })();
  const sportAllTime = useActionBooks ? (row.sportActionAll || null) : null;
  const marketAllTime = useActionBooks ? (row.marketActionAll || null) : null;

  const sizeHead = tab === 'recent' || formListIsActionFallback
    ? 'Size'
    : (sparkMode === 'actual' ? 'Actual' : 'Flat');
  const curveKind = spark?.kind === 'wl'
    ? 'Win / loss'
    : (sparkMode === 'actual' ? 'Actual dollars' : 'Flat 1 unit');

  return (
    <div
      className="sf-action-expand"
      data-expand="book"
      style={{
        borderTop: '1px solid rgba(232,210,138,0.16)',
        background: 'linear-gradient(180deg, rgba(18,22,32,0.98) 0%, rgba(12,15,22,1) 100%)',
        padding: isMobile ? '0.95rem 0.9rem 1.05rem' : '1.15rem 1.35rem 1.2rem',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.55rem 0.85rem',
        marginBottom: '0.85rem',
      }}
      >
        <Segmented
          value={tab}
          onChange={(id) => { setTab(id); setShowMore(false); }}
          options={[
            { id: 'recent', label: 'Their Action' },
            { id: 'form', label: 'Their featured' },
          ]}
        />
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 620,
          color: B.textMuted,
          lineHeight: 1.35,
          fontFeatureSettings: "'tnum'",
        }}
        >
          {tab === 'form' ? (
            formListIsActionFallback
              ? 'No featured locks yet. Showing Action tickets.'
              : (
                <>
                  Featured picks
                  {formRecord(10) ? ` · L10 ${formRecord(10)}` : ''}
                  {formRecord(5) ? ` · L5 ${formRecord(5)}` : ''}
                </>
              )
          ) : (
            <>
              Graded Action tickets
              {actionTotalN ? ` · last ${curveDays}d` : ''}
              {actionTotalN > action.length ? ` · ${action.length} of ${actionTotalN}` : ''}
            </>
          )}
        </div>
      </div>
      {openCardAside(row) ? (
        <div style={{
          margin: '-0.15rem 0 0.9rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          lineHeight: 1.45,
          color: B.textMuted,
          fontFeatureSettings: "'tnum'",
        }}
        >
          {openCardAside(row)}
        </div>
      ) : null}

      <BetTypeRollupStrip
        sport={row.sport}
        marketType={row.marketType}
        sportRollup={sportRollup}
        marketRollup={marketRollup}
        sportAllTime={sportAllTime}
        marketAllTime={marketAllTime}
        showDualWindows={useActionBooks}
        isMobile={isMobile}
      />

      <div style={{
        marginBottom: '0.9rem',
        padding: isMobile ? '0.7rem 0.72rem 0.55rem' : '0.8rem 0.9rem 0.62rem',
        borderRadius: 14,
        background: 'rgba(0,0,0,0.28)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      >
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.45rem',
          marginBottom: '0.45rem',
        }}
        >
          <span style={{ ...T.tiny, letterSpacing: '0.12em', color: B.textMuted }}>
            Last {curveDays} days
          </span>
          <span style={{ fontSize: '0.68rem', fontWeight: 650, color: B.textSubtle }}>
            {curveKind}
          </span>
          <span style={{ marginLeft: 'auto' }}>
            <Segmented
              value={sparkMode}
              onChange={setSparkMode}
              options={[
                { id: 'actual', label: 'Actual' },
                { id: 'flat', label: 'Flat' },
              ]}
            />
          </span>
        </div>
        {spark ? (
          <PremiumSpark
            points={spark.points}
            width={isMobile ? 280 : 520}
            height={isMobile ? 64 : 78}
            endLabel={spark.endLabel}
          />
        ) : (
          <div style={{ ...T.micro, color: B.textSubtle, padding: '0.7rem 0.15rem' }}>
            Not enough graded tickets in the last {curveDays} days for a curve.
          </div>
        )}
      </div>

      {tab === 'form' && row.trust && (
        <div style={{ marginBottom: '0.7rem' }}>
          <TrustLine trust={row.trust} />
        </div>
      )}

      {visibleLegs.length === 0 ? (
        <div style={{ ...T.micro, color: B.textMuted, padding: '0.35rem 0.1rem 0.15rem' }}>
          {tab === 'form'
            ? 'No featured picks for this sharp in this sport yet.'
            : 'No graded Action tickets for this sharp in this sport yet.'}
        </div>
      ) : (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '0.6rem',
            padding: '0 0.1rem 0.35rem',
          }}
          >
            <span style={{ ...T.tiny, letterSpacing: '0.14em', color: '#E8D28A' }}>Tickets</span>
            <span style={{ ...T.tiny, letterSpacing: '0.1em', color: B.textSubtle }}>
              {isMobile ? sizeHead : `Odds  ·  ${sizeHead}  ·  Result`}
            </span>
          </div>
          {[...visibleLegs].reverse().map((leg, i) => (
            <TicketLegRow
              key={`${leg.date}-${leg.side}-${leg.gameKey || i}`}
              leg={leg}
              showSize={tab === 'recent' || formListIsActionFallback}
              pnlMode={sparkMode}
              isMobile={isMobile}
              sport={row.sport}
            />
          ))}
          {legs.length > previewN && (
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              style={{
                marginTop: '0.7rem',
                width: '100%',
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.22)',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 740,
                letterSpacing: '0.04em',
                color: '#E8D28A',
                padding: '0.55rem 0.7rem',
              }}
            >
              {showMore
                ? 'Show less'
                : (actionTotalN > legs.length && tab === 'recent'
                  ? `Show all ${legs.length} of ${actionTotalN}`
                  : `Show all ${legs.length}`)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const REASON_TONE = {
  gold: '#E8D28A',
  green: '#34D399',
  amber: '#F5B942',
  red: '#F07178',
  muted: '#94A3B8',
  text: '#F8FAFC',
};

function TeamCrest({ name, sport, size = 42 }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? null : teamLogoUrl(name, sport);
  const id = getTeamIdentity(name, sport);
  const abbr = /^(over|under)$/i.test(String(name || ''))
    ? String(name).slice(0, 1).toUpperCase()
    : (id.abbr && id.abbr !== '?' ? id.abbr : String(sport || '').slice(0, 3));
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: Math.max(7, Math.round(size * 0.26)),
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: src
        ? 'radial-gradient(circle at 50% 42%, #ffffff 0%, #eceae4 72%)'
        : `linear-gradient(145deg, ${id.c1}, ${id.c2})`,
      border: src ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.08)',
      boxShadow: src
        ? (size < 36
          ? '0 2px 6px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.65)'
          : '0 6px 16px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.65)')
        : 'inset 0 1px 0 rgba(255,255,255,0.06)',
    }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={size - 8}
          height={size - 8}
          onError={() => setFailed(true)}
          style={{ width: size - 10, height: size - 10, objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <span style={{
          color: '#fff',
          fontWeight: 800,
          fontSize: Math.max(11, size * 0.28),
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
        >
          {abbr}
        </span>
      )}
    </div>
  );
}

/**
 * The only three facts on the face. The number is the point.
 * The sentence under it explains. Nothing else competes.
 */
function DecisionRow({ heroes, spark, isMobile }) {
  if (!heroes.length) return null;
  const figure = isMobile ? '1.42rem' : '1.7rem';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(heroes.length, 3)}, minmax(0, 1fr))`,
      columnGap: isMobile ? '0.8rem' : '2.5rem',
      marginTop: isMobile ? '1.05rem' : '1.2rem',
      paddingTop: isMobile ? '0.95rem' : '1.1rem',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}
    >
      {heroes.map((h) => {
        const tone = REASON_TONE[h.tone] || REASON_TONE.text;
        const spot = h.key === 'spot';
        const [head] = String(h.title || '').split(' · ');
        const value = h.key === 'size' ? (h.figure || h.title) : (spot ? head : h.title);
        const caption = h.sub || '';
        return (
          <div key={h.key} data-reason={h.key} style={{ minWidth: 0 }}>
            <div style={{
              fontSize: spot ? (isMobile ? '1.08rem' : '1.22rem') : figure,
              fontWeight: 650,
              letterSpacing: '-0.045em',
              lineHeight: 1,
              color: tone,
              fontFeatureSettings: "'tnum'",
            }}
            >
              {value}
            </div>
            {caption || (h.key === 'book' && spark) ? (
              <div style={{
                marginTop: '0.48rem',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '0.28rem' : '0.55rem',
                minWidth: 0,
              }}
              >
                {caption ? (
                  <span style={{
                    minWidth: 0,
                    fontSize: isMobile ? '0.75rem' : '0.84rem',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: h.subTone ? (REASON_TONE[h.subTone] || B.textMuted) : B.textMuted,
                    fontFeatureSettings: "'tnum'",
                  }}
                  >
                    {caption}
                  </span>
                ) : null}
                {h.key === 'book' && spark ? (
                  <FlatSpark points={spark} width={isMobile ? 42 : 56} height={16} />
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Facts that belong inside the open card, not on the poster. */
function openCardAside(row) {
  const bits = [];
  if (row?.pinMove === 'with') {
    const tag = row?.steam?.show && row.steam.tag
      ? String(row.steam.tag).replace(/^steam\s+/i, '')
      : null;
    bits.push(tag ? `With the line, steam ${tag}` : 'With the line');
  } else if (row?.pinMove === 'against') {
    bits.push('Against the line');
  }
  const l10 = row?.form?.l10;
  const w = Number(l10?.w);
  const l = Number(l10?.l);
  if (Number.isFinite(w) && Number.isFinite(l) && (w + l) > 0) bits.push(`Last 10 is ${w}-${l}`);
  if (Number.isFinite(row?.trust?.priorClvPct)) bits.push(`Beat close ${row.trust.priorClvPct}%`);
  if (row?.cellHistText) {
    const rest = String(row.cellHistText).replace(/^plays like this\s*·\s*/i, '').replace(/\s*·\s*/g, ', ').trim();
    if (rest) bits.push(`Plays like this ${rest}`);
  }
  return bits.join('    ·    ');
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '0.3rem 0.65rem',
        borderRadius: '6px',
        cursor: 'pointer',
        border: active ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
        background: active ? B.goldDim : 'transparent',
        color: active ? B.gold : B.textMuted,
        ...T.micro,
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}

/** ET date rail — same instrument as sport tabs, stacked weekday + day. */
function DateRail({ keys, selected, todayKey, onChange, isMobile }) {
  return (
    <div
      role="tablist"
      aria-label="Ticket date"
      className="sf-date-rail"
      style={{
        display: 'flex',
        width: '100%',
        gap: 2,
        padding: 3,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${B.border}`,
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.025)',
        marginBottom: '0.85rem',
      }}
    >
      {keys.map((k) => {
        const active = selected === k;
        const { kicker, day } = actionDateParts(k, todayKey);
        return (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={formatActionDateChip(k, todayKey)}
            onClick={() => onChange(k)}
            style={{
              position: 'relative',
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? 1 : 2,
              padding: isMobile ? '0.46rem 0.18rem 0.62rem' : '0.55rem 0.4rem 0.7rem',
              border: 'none',
              borderRadius: 9,
              cursor: 'pointer',
              background: active
                ? `linear-gradient(180deg, ${B.gold}33 0%, ${B.gold}0f 100%)`
                : 'transparent',
              boxShadow: active
                ? `inset 0 0 0 1px ${B.gold}4d, 0 2px 10px rgba(0,0,0,0.28)`
                : 'none',
              transition: 'background 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <span style={{
              ...T.tiny,
              letterSpacing: '0.16em',
              fontWeight: 800,
              color: active ? B.gold : B.textSubtle,
            }}>
              {kicker}
            </span>
            <span style={{
              fontSize: isMobile ? '0.98rem' : '1.12rem',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontFeatureSettings: "'tnum'",
              fontVariantNumeric: 'tabular-nums',
              color: active ? '#E8D28A' : B.textSec,
            }}>
              {day}
            </span>
            {active ? (
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: '28%',
                  right: '28%',
                  bottom: 5,
                  height: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, transparent, ${B.gold}, transparent)`,
                }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function DeskModeBar({ mode, onChange, mineCount = 0 }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', margin: '0.15rem 0 0.75rem',
    }}>
      <div style={{
        display: 'inline-flex', padding: 3, borderRadius: 999,
        border: `1px solid ${B.goldBorder}`, background: 'rgba(8,10,16,0.5)',
      }}>
        {[
          { id: 'all', label: 'All Sharps' },
          { id: 'mine', label: mineCount ? `My Sharps · ${mineCount}` : 'My Sharps' },
        ].map((o) => {
          const on = mode === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              style={{
                ...T.tiny,
                border: 'none',
                background: on ? B.goldDim : 'transparent',
                color: on ? B.gold : B.textMuted,
                padding: '0.42rem 1.05rem',
                borderRadius: 999,
                cursor: 'pointer',
                letterSpacing: '0.12em',
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const ActionTape = memo(function ActionTape({ items }) {
  if (!items?.length) return null;
  const renderRun = (prefix) => items.map((it, i) => (
    <span key={`${prefix}-${i}`} style={{
      display: 'inline-flex', alignItems: 'baseline', gap: '0.45rem',
      padding: '0 1.4rem', whiteSpace: 'nowrap',
    }}>
      <span style={{ ...T.tiny, color: sportColor(it.sport) }}>{it.sport}</span>
      <span style={{ ...T.body, fontWeight: 800, color: B.text, fontSize: '0.82rem' }}>
        {String(it.team).toUpperCase()}
      </span>
      <span style={{ ...T.body, fontWeight: 800, color: B.gold, fontFeatureSettings: "'tnum'" }}>
        {fmtVol(it.invested)}
      </span>
      {it.americanLabel && (
        <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
          {it.americanLabel}
        </span>
      )}
      <span style={{ ...T.micro, color: B.textSubtle }}>{agoTxt(it.ts)}</span>
    </span>
  ));

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      marginBottom: '0.85rem',
      borderBottom: `1px solid ${B.borderSubtle}`,
      borderTop: `1px solid ${B.borderSubtle}`,
      padding: '0.4rem 0',
      overflow: 'hidden',
    }}>
      <div className="sf-tape" style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <div className="sf-tape-track" style={{ animationDuration: `${Math.max(36, items.length * 4.5)}s` }}>
          {renderRun('a')}
          {renderRun('b')}
        </div>
      </div>
    </div>
  );
});

/**
 * Quiet proof line under the ticket — not a second card deck.
 * Record anchors; ROI / wins / beat-close trail as secondary type.
 */
function TrustLine({ trust }) {
  if (!trust) return null;
  const hasBook = trust.record || Number.isFinite(trust.roi) || Number.isFinite(trust.wr);
  const hasClv = Number.isFinite(trust.priorClvPct);
  if (!hasBook && !hasClv) return null;

  const roiHot = Number.isFinite(trust.roi) && trust.roi > 0;
  const beatHot = hasClv && trust.priorClvPct >= 55;
  const sep = (
    <span style={{ color: B.textSubtle, opacity: 0.55, fontWeight: 500, userSelect: 'none' }}>·</span>
  );

  return (
    <div style={{
      marginTop: '0.42rem',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: '0.28rem 0.4rem',
      fontFeatureSettings: "'tnum'",
      maxWidth: '100%',
    }}>
      {trust.record && (
        <span style={{
          fontSize: '0.78rem', fontWeight: 700, color: B.textSec,
          letterSpacing: '-0.01em', lineHeight: 1.2,
        }}>
          {trust.record}
        </span>
      )}
      {(Number.isFinite(trust.roi) || Number.isFinite(trust.wr)) && (
        <>
          {trust.record ? sep : null}
          <span style={{
            ...T.micro,
            fontWeight: 600,
            color: roiHot ? B.green : B.textMuted,
          }}>
            {Number.isFinite(trust.roi)
              ? `Book ${trust.roi >= 0 ? '+' : ''}${trust.roi}% ROI`
              : null}
            {Number.isFinite(trust.roi) && Number.isFinite(trust.wr) ? ' · ' : ''}
            {Number.isFinite(trust.wr) ? `${trust.wr}% wins` : ''}
          </span>
        </>
      )}
      {hasClv && (
        <>
          {sep}
          <span style={{
            ...T.micro,
            fontWeight: 600,
            color: beatHot ? B.gold : B.textMuted,
          }}>
            Beat close {trust.priorClvPct}%
          </span>
        </>
      )}
    </div>
  );
}

/** Historic cell WR/ROI from as-of Sharp tier × size × opposition. */
function PortfolioAdd({ saved, onToggle, disabled }) {
  const label = saved ? 'In your portfolio' : 'Add to portfolio';
  return (
    <button
      type="button"
      data-portfolio={saved ? 'saved' : 'add'}
      title={saved ? 'Remove this sharp from your portfolio' : 'Add this sharp to your portfolio'}
      aria-pressed={saved}
      aria-label={saved ? 'Remove this sharp from your portfolio' : 'Add this sharp to your portfolio'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) onToggle?.();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        margin: 0,
        padding: '0.72rem 1rem',
        border: 'none',
        borderTop: `1px solid ${saved ? 'rgba(212,175,55,0.28)' : 'rgba(232,210,138,0.18)'}`,
        background: saved
          ? 'linear-gradient(180deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.06) 100%)'
          : 'linear-gradient(180deg, rgba(232,210,138,0.09) 0%, rgba(232,210,138,0.025) 100%)',
        color: '#E8D28A',
        fontFamily: 'inherit',
        fontSize: '0.8rem',
        fontWeight: 680,
        letterSpacing: '0.01em',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 18,
          height: 18,
          borderRadius: 99,
          border: '1px solid rgba(232,210,138,0.55)',
          background: saved ? 'rgba(232,210,138,0.18)' : 'transparent',
          fontSize: '0.78rem',
          lineHeight: 1,
          fontWeight: 700,
        }}
      >
        {saved ? '✓' : '+'}
      </span>
      {label}
    </button>
  );
}

function LeanMark({ lean }) {
  if (!lean?.key || lean.key === 'watch') return null;
  const fg = lean.key === 'tail' ? B.green : B.red;
  return (
    <span style={{
      ...T.tiny, color: fg, letterSpacing: '0.1em',
    }}>
      {lean.label}
    </span>
  );
}

function ActionRow({
  row, sportFilter = 'All', isMobile, expanded, onToggle,
  saved = false, onToggleSave, canSave = false, lean = null,
}) {
  const [hover, setHover] = useState(false);
  if (!rowMatchesActionSport(row, sportFilter)) return null;
  const topPlay = row.topPlay === true || isActionTopPlay(row);
  const reduceMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const shell = {
    position: 'relative',
    borderRadius: 18,
    border: `1px solid ${expanded || hover ? 'rgba(212,175,55,0.42)' : 'rgba(255,255,255,0.07)'}`,
    background: hover || expanded
      ? 'linear-gradient(165deg, rgba(212,175,55,0.07) 0%, #141820 38%, #10141c 100%)'
      : 'linear-gradient(165deg, rgba(255,255,255,0.035) 0%, #12161e 38%, #0e1218 100%)',
    boxShadow: hover || expanded
      ? '0 22px 48px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.07)'
      : '0 10px 28px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.05)',
    transition: reduceMotion
      ? 'none'
      : 'border-color 180ms ease, box-shadow 180ms ease, background 180ms ease',
    overflow: 'hidden',
  };

  const chevron = (
    <ChevronDown
      size={16}
      color={expanded ? B.gold : B.textMuted}
      style={{
        flexShrink: 0,
        transition: reduceMotion ? 'none' : 'transform 200ms ease',
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
      aria-hidden
    />
  );

  const headerBtnProps = {
    type: 'button',
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle();
    },
    'aria-expanded': expanded,
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      color: 'inherit',
      font: 'inherit',
    },
  };
  const tierMark = row.skillLabel && String(row.skillLabel).length <= 2
    ? `Tier ${row.skillLabel}`
    : (row.skillLabel === 'Thin sample' ? 'Thin' : null);
  const matchup = row.away && row.home ? `${row.away} @ ${row.home}` : row.gameKey;
  const crestName = row.side === 'away' && row.away
    ? row.away
    : (row.side === 'home' && row.home ? row.home : row.team);
  const kick = formatActionKickoff(row.commenceMs);
  const play = (
    <div style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: isMobile ? '0.7rem' : '0.85rem' }}>
      <TeamCrest name={crestName} sport={row.sport} size={isMobile ? 44 : 52} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.42rem', marginBottom: '0.28rem', flexWrap: 'wrap' }}>
          <span aria-hidden style={{ width: 6, height: 6, borderRadius: 99, background: sportColor(row.sport), boxShadow: `0 0 8px ${sportColor(row.sport)}` }} />
          <span style={{ ...T.tiny, color: sportColor(row.sport), letterSpacing: '0.14em' }}>{row.sport}</span>
          <span style={{ ...T.tiny, color: B.textMuted, letterSpacing: '0.12em' }}>{row.marketLabel || row.marketType}</span>
          {tierMark ? (
            <span style={{
              ...T.tiny,
              fontSize: row.skillKey === 'high' ? '0.68rem' : T.tiny.fontSize,
              fontWeight: row.skillKey === 'high' ? 800 : 700,
              color: row.skillKey === 'high' ? '#E8D28A' : B.textMuted,
              letterSpacing: '0.12em',
            }}
            >
              {tierMark}
            </span>
          ) : null}
          <LeanMark lean={lean} />
        </div>
        <div style={{
          ...T.name,
          color: B.text,
          fontSize: isMobile ? '1.28rem' : '1.55rem',
          fontWeight: 640,
          letterSpacing: '-0.038em',
          lineHeight: 1.05,
        }}
        >
          {row.team}
        </div>
        <div style={{
          ...T.body, color: B.textMuted, marginTop: '0.22rem',
          whiteSpace: isMobile ? 'normal' : 'nowrap',
          overflow: 'hidden',
          textOverflow: isMobile ? 'clip' : 'ellipsis',
        }}
        >
          <MatchupLine away={row.away} home={row.home} side={row.side} fallback={matchup} />
        </div>
      </div>
    </div>
  );
  const price = (
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        <div style={{
          ...T.money,
          color: '#E8D28A',
          fontSize: isMobile ? '1.32rem' : '1.55rem',
          fontWeight: 640,
          letterSpacing: '-0.04em',
          fontFeatureSettings: "'tnum'",
        }}
        >
          {fmtVol(row.invested)}
        </div>
        {chevron}
      </div>
      {row.americanLabel ? (
        <div style={{
          marginTop: '0.36rem',
          fontSize: isMobile ? '0.95rem' : '1.05rem',
          fontWeight: 680,
          letterSpacing: '-0.03em',
          color: B.text,
          fontFeatureSettings: "'tnum'",
          lineHeight: 1,
        }}
        >
          {row.americanLabel}
        </div>
      ) : null}
      <div data-kickoff={kick?.tone || 'posted'} style={{ marginTop: '0.42rem' }}>
        {kick ? (
          <>
            <div style={{
              fontSize: isMobile ? '0.92rem' : '1rem',
              fontWeight: 650,
              letterSpacing: '-0.03em',
              color: B.text,
              fontFeatureSettings: "'tnum'",
              lineHeight: 1,
            }}
            >
              {kick.time}
            </div>
            <div style={{
              marginTop: '0.28rem',
              fontSize: '0.68rem',
              fontWeight: 720,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: kick.tone === 'live' ? '#34D399' : '#E8D28A',
            }}
            >
              {kick.kicker}
            </div>
          </>
        ) : (
          <div style={{ ...T.micro, color: B.textSubtle }}>Kickoff —</div>
        )}
      </div>
    </div>
  );
  const hair = topPlay ? (
    <div aria-hidden style={{ height: 2, background: 'linear-gradient(90deg, transparent, #E8D28A 18%, #D4AF37 50%, transparent)' }} />
  ) : null;

  const facePad = isMobile ? '1.05rem 1rem 1rem' : '1.25rem 1.4rem 1.15rem';
  const reasons = actionCardReasons(row);
  const spark = row.l30ChipCurve?.length >= 5
    ? row.l30ChipCurve
    : (row.flatCurve?.length >= 5 ? row.flatCurve : null);

  return (
    <div
      data-action-sport={row.sport}
      data-top-play={topPlay ? 'true' : undefined}
      onMouseEnter={() => { if (!isMobile) setHover(true); }}
      onMouseLeave={() => { if (!isMobile) setHover(false); }}
      style={shell}
    >
      {hair}
      <button {...headerBtnProps}>
        <div style={{ padding: facePad }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: isMobile ? '0.85rem' : '2rem',
          }}
          >
            {play}
            {price}
          </div>
          <DecisionRow heroes={reasons.heroes} spark={spark} isMobile={isMobile} />
        </div>
      </button>
      <PortfolioAdd saved={saved} onToggle={onToggleSave} disabled={!canSave && !saved} />
      {expanded && <ActionExpandPanel row={row} isMobile={isMobile} />}
    </div>
  );
}

export default function ConfirmedActionDesk({
  sharpPositions,
  spreadPositions,
  totalPositions,
  rawSharpPositions = null,
  rawSpreadPositions = null,
  rawTotalPositions = null,
  walletProfiles,
  pinnacleHistory,
  polyData = null,
  sportFilter = 'All',
  isMobile = false,
  user: userProp = null,
  isPremium: premiumProp = null,
}) {
  const [sortMode, setSortModeState] = useState(deskUi.sortMode);
  const [highMidOnly, setHighMidOnlyState] = useState(deskUi.highMidOnly);
  const [sizedOnly, setSizedOnlyState] = useState(deskUi.sizedOnly);
  const [clearOnly, setClearOnlyState] = useState(deskUi.clearOnly);
  const [pinWithOnly, setPinWithOnlyState] = useState(deskUi.pinWithOnly);
  const [topPlayOnly, setTopPlayOnlyState] = useState(deskUi.topPlayOnly);
  const [dateKey, setDateKeyState] = useState(deskUi.dateKey);
  const [deskMode, setDeskModeState] = useState(deskUi.deskMode);
  const [cellStatsTable, setCellStatsTable] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [focusShort, setFocusShort] = useState(null);
  const [mineRoom, setMineRoom] = useState('book');
  const auth = useAuth();
  const user = userProp ?? auth.user;
  const sub = useSubscription(premiumProp == null ? user : null);
  const isPremium = premiumProp == null ? sub.isPremium : premiumProp;
  const mySharps = useMySharps({ user, isPremium });

  const setSortMode = (next) => {
    const value = typeof next === 'function' ? next(deskUi.sortMode) : next;
    deskUi.sortMode = value;
    setSortModeState(value);
  };
  const setHighMidOnly = (next) => {
    const value = typeof next === 'function' ? next(deskUi.highMidOnly) : next;
    deskUi.highMidOnly = value;
    setHighMidOnlyState(value);
  };
  const setSizedOnly = (next) => {
    const value = typeof next === 'function' ? next(deskUi.sizedOnly) : next;
    deskUi.sizedOnly = value;
    setSizedOnlyState(value);
  };
  const setClearOnly = (next) => {
    const value = typeof next === 'function' ? next(deskUi.clearOnly) : next;
    deskUi.clearOnly = value;
    setClearOnlyState(value);
  };
  const setPinWithOnly = (next) => {
    const value = typeof next === 'function' ? next(deskUi.pinWithOnly) : next;
    deskUi.pinWithOnly = value;
    setPinWithOnlyState(value);
  };
  const setTopPlayOnly = (next) => {
    const value = typeof next === 'function' ? next(deskUi.topPlayOnly) : next;
    deskUi.topPlayOnly = value;
    setTopPlayOnlyState(value);
  };
  const setDateKey = (next) => {
    const value = typeof next === 'function' ? next(deskUi.dateKey) : next;
    deskUi.dateKey = value;
    setDateKeyState(value);
  };
  const setDeskMode = (next) => {
    const value = typeof next === 'function' ? next(deskUi.deskMode) : next;
    deskUi.deskMode = value;
    setDeskModeState(value);
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/sharp-tier-cell-stats.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (!cancelled && j?.cells) setCellStatsTable(j); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setExpandedId(null);
  }, [sortMode, highMidOnly, sizedOnly, clearOnly, pinWithOnly, topPlayOnly, dateKey]);

  useEffect(() => {
    if (!focusShort) return;
    if (!mySharps.shorts.has(focusShort)) {
      setFocusShort(null);
    }
  }, [focusShort, mySharps.shorts]);

  const { rows: qualifiedRows } = useMemo(
    () => buildConfirmedActionRows({
      sharpPositions,
      spreadPositions,
      totalPositions,
      walletProfiles,
      pinnacleHistory,
      cellStatsTable,
      polyData,
      sportFilter,
      portfolioShorts: mySharps.shorts,
    }),
    [sharpPositions, spreadPositions, totalPositions, walletProfiles, pinnacleHistory, cellStatsTable, polyData, sportFilter, mySharps.shorts],
  );

  const { rows: savedRows } = useMemo(() => {
    if (!mySharps.shorts?.size) return { rows: [] };
    if (!rawSharpPositions && !rawSpreadPositions && !rawTotalPositions) return { rows: [] };
    return buildConfirmedActionRows({
      sharpPositions: rawSharpPositions,
      spreadPositions: rawSpreadPositions,
      totalPositions: rawTotalPositions,
      walletProfiles,
      pinnacleHistory,
      cellStatsTable,
      polyData,
      sportFilter: 'All',
      portfolioShorts: mySharps.shorts,
    });
  }, [rawSharpPositions, rawSpreadPositions, rawTotalPositions, walletProfiles, pinnacleHistory, cellStatsTable, polyData, mySharps.shorts]);

  const rows = useMemo(
    () => mergePortfolioActionRows(qualifiedRows, savedRows),
    [qualifiedRows, savedRows],
  );

  const boardRows = useMemo(
    () => (deskMode === 'mine' ? rows : (rows || []).filter((r) => !r.portfolioOnly)),
    [rows, deskMode],
  );

  const nowMs = Date.now();
  const todayKey = etDateKey(nowMs);
  const dateKeys = actionDateKeys(nowMs);
  const selectedDate = dateKeys.includes(dateKey) ? dateKey : todayKey;

  const dated = useMemo(() => {
    const filtered = filterActionRows(boardRows, {
      sport: deskMode === 'mine' ? 'All' : sportFilter,
      highMidOnly: deskMode === 'mine' ? false : highMidOnly,
      sizedOnly: deskMode === 'mine' ? false : sizedOnly,
      clearOnly: deskMode === 'mine' ? false : clearOnly,
      pinWithOnly: deskMode === 'mine' ? false : pinWithOnly,
      topPlayOnly: deskMode === 'mine' ? false : topPlayOnly,
      dateKey: selectedDate,
      nowMs: Date.now(),
      // The public board hides small tickets. A followed wallet's bet still counts.
      minInvested: deskMode === 'mine' ? 0 : undefined,
    }).filter((r) => deskMode === 'mine' || rowMatchesActionSport(r, sportFilter));
    return filtered;
  }, [boardRows, sportFilter, highMidOnly, sizedOnly, clearOnly, pinWithOnly, topPlayOnly, selectedDate, deskMode]);

  const allMine = useMemo(
    () => filterRowsToMySharps(dated, mySharps.shorts),
    [dated, mySharps.shorts],
  );

  const allMineAnyDay = useMemo(
    () => filterRowsToMySharps(
      (boardRows || []).filter((r) => deskMode === 'mine' || rowMatchesActionSport(r, sportFilter)),
      mySharps.shorts,
    ),
    [boardRows, sportFilter, mySharps.shorts, deskMode],
  );

  const roster = useMemo(
    () => buildMySharpsRoster({ members: Object.fromEntries(mySharps.members.map((m) => [m.walletShort, m])) }, {
      walletProfiles,
      actionRows: dated,
      sportFilter,
    }),
    [mySharps.members, walletProfiles, dated, sportFilter],
  );

  const visible = useMemo(
    () => (deskMode === 'mine' ? [] : sortActionRows(dated, sortMode)),
    [deskMode, dated, sortMode],
  );

  const recentLegs = useMemo(
    () => collectRecentLegs(walletProfiles, [...mySharps.shorts], { sportFilter, limit: 400 }),
    [walletProfiles, mySharps.shorts, sportFilter],
  );

  const marquee = useMemo(
    () => (deskMode === 'mine' ? [] : buildConfirmedActionMarquee(visible)),
    [deskMode, visible],
  );

  if (!walletProfiles) {
    return (
      <div style={{ ...T.body, color: B.textMuted, padding: '2rem', textAlign: 'center' }}>
        Loading…
      </div>
    );
  }

  const browsingAll = !sportFilter || sportFilter === 'All' || sportFilter === 'ALL';
  if (rows.length === 0 && browsingAll && deskMode !== 'mine') {
    return (
      <div style={{
        textAlign: 'center', padding: '3rem 1.5rem', borderRadius: '12px',
        border: `1px solid ${B.border}`, background: B.card,
      }}>
        <Activity size={22} color={B.textMuted} style={{ marginBottom: '0.65rem' }} />
        <div style={{ ...T.name, color: B.text, fontSize: '1.05rem', marginBottom: '0.3rem' }}>
          No open tickets
        </div>
        <div style={{ ...T.body, color: B.textSec }}>
          When winning wallets bet, they show up here.
        </div>
      </div>
    );
  }

  return (
    <div>
      {dateKeys.length > 1 && (deskMode !== 'mine' || mineRoom === 'bets') && (
        <DateRail
          keys={dateKeys}
          selected={selectedDate}
          todayKey={todayKey}
          onChange={setDateKey}
          isMobile={isMobile}
        />
      )}
      <DeskModeBar
        mode={deskMode}
        onChange={setDeskMode}
        mineCount={mySharps.count}
      />
      {deskMode === 'mine' ? null : <ActionTape items={marquee} />}

      {deskMode === 'mine' ? (
        <MySharpsDesk
          ready={mySharps.ready}
          signedIn={!!user}
          roster={roster}
          walletProfiles={walletProfiles}
          shorts={[...mySharps.shorts]}
          actionRows={allMine}
          weekRows={allMineAnyDay}
          recentLegs={recentLegs}
          dateKey={selectedDate}
          todayKey={todayKey}
          isMobile={isMobile}
          tails={mySharps.tails}
          cap={mySharps.cap}
          onRoomChange={setMineRoom}
          onRename={(short, name) => mySharps.rename(short, name)}
          onToggleBets={(short, sport, market) => mySharps.setBetsFeed(short, sport, market)}
          onRemove={(short) => mySharps.remove(short)}
          onAdd={(row) => mySharps.addFromRow(row)}
          onTail={(ticket, patch) => mySharps.markTail(ticket, patch)}
          onUntail={(id) => mySharps.clearTail(id)}
          pinnacleHistory={pinnacleHistory}
        />
      ) : (
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center',
        marginBottom: '0.85rem',
      }}>
        {SORTS.map((s) => (
          <Pill key={s.id} active={sortMode === s.id} onClick={() => setSortMode(s.id)}>{s.label}</Pill>
        ))}
        <span style={{ width: 1, height: 16, background: B.border, margin: '0 0.15rem' }} />
        <Pill active={topPlayOnly} onClick={() => setTopPlayOnly((v) => !v)}>Top play</Pill>
        <Pill active={highMidOnly} onClick={() => setHighMidOnly((v) => !v)}>Top half</Pill>
        <Pill active={sizedOnly} onClick={() => setSizedOnly((v) => !v)}>Sized</Pill>
        <Pill active={clearOnly} onClick={() => setClearOnly((v) => !v)}>Unopposed</Pill>
        <Pill active={pinWithOnly} onClick={() => setPinWithOnly((v) => !v)}>Line with</Pill>
        <span
          data-action-count={visible.length}
          data-action-sport={sportFilter || 'All'}
          data-action-date={selectedDate}
          style={{ ...T.micro, color: B.textSubtle, marginLeft: 'auto', fontFeatureSettings: "'tnum'" }}
        >
          {visible.length}
          {sportFilter && sportFilter !== 'All' && sportFilter !== 'ALL' ? ` · ${sportFilter}` : ''}
        </span>
      </div>
      )}

      {deskMode === 'mine' ? null : visible.length === 0 ? (
        <div style={{ ...T.body, color: B.textMuted, padding: '1.5rem', textAlign: 'center' }}>
          {selectedDate !== todayKey
            ? `No tickets ${formatActionDateChip(selectedDate, todayKey)}.`
            : (sportFilter && sportFilter !== 'All' && sportFilter !== 'ALL'
              ? `No ${sportFilter} tickets match these filters.`
              : 'Nothing matches these filters.')}
        </div>
      ) : (
        <div
          key={`${sportFilter || 'All'}:${selectedDate}:${deskMode}`}
          data-action-list={sportFilter || 'All'}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
          {visible.map((r) => (
            <ActionRow
              key={`${sportFilter}:${r.id}`}
              row={r}
              sportFilter={sportFilter}
              isMobile={isMobile}
              expanded={expandedId === r.id}
              onToggle={() => setExpandedId((cur) => (cur === r.id ? null : r.id))}
              saved={mySharps.isSaved(r.walletShort)}
              canSave={mySharps.ready}
              onToggleSave={() => mySharps.toggleRow(r)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
