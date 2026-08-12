/**
 * Action desk — live tickets from winning wallets.
 * Sparse header. Dense, scannable rows. No product lectures.
 */
import React, { useEffect, useMemo, useState, memo } from 'react';
import { Activity, ChevronDown } from 'lucide-react';
import {
  buildConfirmedActionRows,
  buildConfirmedActionMarquee,
  filterActionRows,
  sortActionRows,
} from '../../lib/confirmedActionDesk.js';

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
  if (sport === 'CBB') return '#FF6B35';
  return B.gold;
}

function skillTone(key) {
  if (key === 'high') return { color: B.gold, bg: B.goldDim, border: B.goldBorder };
  if (key === 'mid') return { color: B.green, bg: B.greenDim, border: 'rgba(16,185,129,0.3)' };
  if (key === 'low') return { color: B.textSec, bg: 'rgba(148,163,184,0.08)', border: B.border };
  return { color: B.textMuted, bg: 'rgba(100,116,139,0.08)', border: B.borderSubtle };
}

const SORTS = [
  { id: 'strength', label: 'Best' },
  { id: 'dollars', label: '$' },
  { id: 'size', label: 'Size' },
  { id: 'recency', label: 'Newest' },
  { id: 'skill', label: 'Record' },
  { id: 'form', label: 'Form' },
];

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

/** Cumulative +1/−1 curve from recent W/L legs when equity is thin. */
function wlStripPoints(legs) {
  if (!Array.isArray(legs) || legs.length < 2) return null;
  let cum = 0;
  return legs.map((leg) => {
    cum += leg.won === 1 ? 1 : -1;
    return cum;
  });
}

/** Per-leg dollar PnL: stamped dollarPnl / settledPnl, else invested × flat. */
function legDollarPnl(leg) {
  if (Number.isFinite(leg?.dollarPnl)) return Number(leg.dollarPnl);
  if (Number.isFinite(leg?.settledPnl)) return Number(leg.settledPnl);
  if (Number.isFinite(leg?.flat) && Number.isFinite(leg?.invested) && leg.invested > 0) {
    return leg.invested * leg.flat;
  }
  return null;
}

function cumCurveFromLegs(legs, mode) {
  if (!Array.isArray(legs) || legs.length < 2) return null;
  let cum = 0;
  const points = [];
  for (const leg of legs) {
    let d = null;
    if (mode === 'actual') d = legDollarPnl(leg);
    else if (Number.isFinite(leg?.flat)) d = Number(leg.flat);
    if (d == null) continue;
    cum += d;
    points.push(mode === 'actual' ? Math.round(cum) : +(cum.toFixed(2)));
  }
  if (points.length < 2) return null;
  return points;
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

/**
 * Spark for expand panel.
 * mode: 'actual' (dollar) | 'flat' (1u) — default actual (real stake sizing).
 */
function sparkPointsForTab(tab, row, mode = 'actual') {
  const featured = row.recentFeatured || [];
  const action = row.recentAction || [];
  const tabLegs = tab === 'form'
    ? (featured.length ? featured : action)
    : action;

  const fromLegs = cumCurveFromLegs(tabLegs, mode);
  if (fromLegs) {
    return {
      points: fromLegs,
      endLabel: fmtSparkEnd(fromLegs[fromLegs.length - 1], mode),
      kind: mode,
    };
  }

  if (mode === 'actual' && row.dollarCurve?.length >= 5) {
    return {
      points: row.dollarCurve,
      endLabel: fmtSparkEnd(row.dollarEnd, 'actual'),
      kind: 'actual',
    };
  }
  if (mode === 'flat' && row.flatCurve?.length >= 5) {
    return {
      points: row.flatCurve,
      endLabel: fmtSparkEnd(row.flatEnd, 'flat'),
      kind: 'flat',
    };
  }

  const strip = wlStripPoints(tabLegs.length ? tabLegs : (featured.length ? featured : action));
  if (!strip) return null;
  return {
    points: strip,
    endLabel: `${strip[strip.length - 1] >= 0 ? '+' : ''}${strip[strip.length - 1]}`,
    kind: 'wl',
  };
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
  const m = gk.match(/([a-z]{2,5})_([a-z]{2,5})(?:_(?:total|spread|ml))?$/i);
  if (m) return `${m[1].toUpperCase()} @ ${m[2].toUpperCase()}`;
  return null;
}

function TicketLegRow({ leg, showSize, pnlMode = 'flat' }) {
  const win = leg.won === 1;
  const ratio = Number(leg.sizeRatio);
  const band = leg.sizeBand;
  const label = leg.label
    || (leg.side === 'over' ? 'Over' : leg.side === 'under' ? 'Under' : leg.side)
    || '—';
  const mktLine = formatLegMarket(leg.marketType, Number(leg.line));
  const matchup = legMatchup(leg);
  const oddsTxt = formatAmerican(Number(leg.odds));
  const dollar = legDollarPnl(leg);
  const mid = showSize
    ? (
      <span style={{ ...T.micro, color: Number.isFinite(ratio) && ratio >= 1.5 ? B.gold : B.textSec, minWidth: 0 }}>
        {Number.isFinite(ratio) ? `${ratio.toFixed(1)}× ${sizeWord(band, ratio)}` : '—'}
        {Number.isFinite(leg.invested) && leg.invested > 0 ? (
          <span style={{ color: B.textSubtle }}> · {fmtVol(leg.invested)}</span>
        ) : null}
      </span>
    )
    : pnlMode === 'actual'
      ? (
        <span style={{
          ...T.micro,
          color: Number.isFinite(dollar) ? (dollar >= 0 ? B.green : B.red) : B.textSubtle,
        }}>
          {Number.isFinite(dollar) ? fmtSparkEnd(dollar, 'actual') : '—'}
        </span>
      )
      : (
        <span style={{ ...T.micro, color: B.textSec }}>
          {Number.isFinite(leg.flat)
            ? `${leg.flat >= 0 ? '+' : ''}${leg.flat.toFixed(2)}u`
            : (Number.isFinite(leg.invested) && leg.invested > 0 ? fmtVol(leg.invested) : '—')}
        </span>
      );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: LEG_ROW_GRID,
      gap: '0.35rem 0.45rem',
      alignItems: 'center',
      padding: '0.45rem 0.1rem',
      borderBottom: `1px solid ${B.borderSubtle}`,
      fontFeatureSettings: "'tnum'",
    }}>
      <span style={{ ...T.micro, color: B.textMuted }}>{fmtLegDate(leg.date)}</span>
      <span style={{
        ...T.micro, color: B.textSec, minWidth: 0,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {matchup ? (
          <span style={{ color: B.text, fontWeight: 700 }}>{matchup}</span>
        ) : null}
        {matchup && (mktLine || label) ? (
          <span style={{ color: B.textSubtle }}> · </span>
        ) : null}
        {mktLine ? (
          <span style={{ color: B.textSubtle }}>{mktLine}</span>
        ) : null}
        {mktLine ? ' · ' : ''}
        <span style={{ color: B.text, fontWeight: 700 }}>{String(label).toUpperCase()}</span>
      </span>
      <span style={{
        ...T.micro, color: oddsTxt ? B.textSec : B.textSubtle,
        textAlign: 'right', fontFeatureSettings: "'tnum'",
      }}>
        {oddsTxt || '—'}
      </span>
      {mid}
      <span style={{
        ...T.tiny,
        justifySelf: 'end',
        padding: '0.16rem 0.4rem',
        borderRadius: 5,
        color: win ? B.green : B.red,
        background: win ? B.greenDim : 'rgba(239,68,68,0.12)',
        border: `1px solid ${win ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        textAlign: 'center',
      }}>
        {win ? 'W' : 'L'}
      </span>
    </div>
  );
}

const LEG_ROW_GRID = '3.6rem minmax(0, 1.5fr) 2.8rem minmax(4rem, 0.9fr) 2.4rem';

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
  };
}

function BetTypeRollupStrip({ sport, marketType, sportRollup, marketRollup }) {
  const mkt = String(marketType || '').toUpperCase();
  const mktLabel = mkt === 'ML' ? 'ML' : mkt;
  const rows = [
    sportRollup ? { key: 'sport', label: String(sport || '').toUpperCase(), book: sportRollup } : null,
    marketRollup ? {
      key: 'market',
      label: `${String(sport || '').toUpperCase()} ${mktLabel}`.trim(),
      book: marketRollup,
    } : null,
  ].filter(Boolean);
  if (!rows.length) return null;

  const sep = (
    <span style={{ color: B.textSubtle, opacity: 0.55, fontWeight: 500, userSelect: 'none' }}>·</span>
  );

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '0.28rem',
      marginBottom: '0.7rem', fontFeatureSettings: "'tnum'",
    }}>
      {rows.map(({ key, label, book }) => {
        const roiHot = Number.isFinite(book.roi) && book.roi > 0;
        const roiCold = Number.isFinite(book.roi) && book.roi < 0;
        const scope = book.window === 'all' ? 'all-time' : `last ${book.window}`;
        const roiKind = book.source === 'action' ? '$ ROI' : 'flat ROI';
        return (
          <div
            key={key}
            style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'baseline',
              gap: '0.28rem 0.4rem',
            }}
          >
            <span style={{
              ...T.tiny, fontWeight: 800, letterSpacing: '0.06em',
              color: B.gold, textTransform: 'uppercase',
            }}>
              {label}
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: B.textSec }}>
              {book.record}
            </span>
            {Number.isFinite(book.roi) && (
              <>
                {sep}
                <span style={{
                  ...T.micro, fontWeight: 700,
                  color: roiHot ? B.green : roiCold ? B.red : B.textMuted,
                }}>
                  {book.roi >= 0 ? '+' : ''}{book.roi}% {roiKind}
                </span>
              </>
            )}
            {Number.isFinite(book.wr) && (
              <>
                {sep}
                <span style={{ ...T.micro, color: B.textMuted }}>{book.wr}% WR</span>
              </>
            )}
            <span style={{ ...T.tiny, color: B.textSubtle, marginLeft: '0.1rem' }}>
              ({scope})
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ActionExpandPanel({ row, isMobile }) {
  // form = this sharp's featured history; recent = this sharp's Action tickets
  const [tab, setTab] = useState('form');
  const [showMore, setShowMore] = useState(false);
  // Actual $ first — locked picks & Action tickets are sized, not 1u flat.
  const [sparkMode, setSparkMode] = useState('actual');
  const featured = row.recentFeatured || [];
  const action = row.recentAction || [];
  const spark = sparkPointsForTab(tab, row, sparkMode);
  const curveDays = Number.isFinite(row.flatCurveDays) ? row.flatCurveDays : 30;
  // Featured list prefers Source A; fall back to Action only when featured is empty.
  const formLegs = featured.length ? featured : action;
  const legs = tab === 'form' ? formLegs : action;
  const formListIsActionFallback = tab === 'form' && !featured.length && action.length > 0;
  const previewN = 5;
  const visibleLegs = showMore ? legs : legs.slice(-previewN);
  const l5 = row.form?.l5;
  const l10 = row.form?.l10;
  const formRecord = (window) => {
    const r = window === 5 ? l5 : l10;
    if (!r || (r.w + r.l) <= 0) return null;
    return `${r.w}–${r.l}`;
  };

  // Sport + this bet type (e.g. MLB TOTAL). Featured → flat book; Action → $ book.
  const useActionBooks = tab === 'recent' || formListIsActionFallback;
  const sportRollup = useActionBooks
    ? (row.sportAction || null)
    : (row.sportFeatured || null);
  const marketRollup = (() => {
    const stamped = useActionBooks ? row.marketAction : row.marketFeatured;
    if (stamped) return stamped;
    const mkt = String(row.marketType || '').toUpperCase();
    const scoped = (useActionBooks ? action : formLegs)
      .filter((leg) => String(leg.marketType || '').toUpperCase() === mkt);
    return rollupFromRecentLegs(scoped, {
      mode: useActionBooks ? 'actual' : 'flat',
      windowDays: curveDays,
    });
  })();

  return (
    <div
      className="sf-action-expand"
      style={{
        borderTop: `1px solid ${B.borderSubtle}`,
        background: 'linear-gradient(180deg, rgba(26,31,46,0.95) 0%, rgba(20,24,33,0.98) 100%)',
        padding: isMobile ? '0.85rem 1rem 1rem' : '0.95rem 1.25rem 1.1rem',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', marginBottom: '0.35rem' }}>
        <Pill active={tab === 'form'} onClick={() => { setTab('form'); setShowMore(false); }}>
          Their featured
        </Pill>
        <Pill active={tab === 'recent'} onClick={() => { setTab('recent'); setShowMore(false); }}>
          Their Action
        </Pill>
      </div>
      <div style={{ ...T.micro, color: B.textMuted, marginBottom: '0.55rem', lineHeight: 1.4 }}>
        {tab === 'form' ? (
          formListIsActionFallback
            ? 'No featured locks yet — showing this sharp’s Action tickets instead.'
            : (
              <>
                This sharp’s prior <span style={{ color: B.textSec, fontWeight: 700 }}>featured</span> picks
                {formRecord(10) ? (
                  <span style={{ color: B.textSec, fontWeight: 700 }}>
                    {' · '}L10 {formRecord(10)}
                    {formRecord(5) ? ` · L5 ${formRecord(5)}` : ''}
                  </span>
                ) : null}
              </>
            )
        ) : (
          <>
            This sharp’s other graded <span style={{ color: B.textSec, fontWeight: 700 }}>Action</span> tickets
            {action.length ? ` · last ${curveDays}d` : ''}
          </>
        )}
      </div>

      <BetTypeRollupStrip
        sport={row.sport}
        marketType={row.marketType}
        sportRollup={sportRollup}
        marketRollup={marketRollup}
      />

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem',
          marginBottom: '0.4rem',
        }}>
          <span style={{ ...T.tiny, color: B.textSubtle }}>
            Last {curveDays} days
            {spark?.kind === 'wl' ? ' · win / loss' : sparkMode === 'actual' ? ' · actual $' : ' · flat 1u'}
          </span>
          <span style={{ display: 'inline-flex', gap: '0.25rem', marginLeft: 'auto' }}>
            <Pill active={sparkMode === 'actual'} onClick={() => setSparkMode('actual')}>Actual</Pill>
            <Pill active={sparkMode === 'flat'} onClick={() => setSparkMode('flat')}>Flat</Pill>
          </span>
        </div>
        {spark ? (
          <PremiumSpark
            points={spark.points}
            width={isMobile ? 280 : 420}
            height={isMobile ? 56 : 68}
            endLabel={spark.endLabel}
          />
        ) : (
          <div style={{
            ...T.micro, color: B.textSubtle,
            padding: '0.65rem 0.2rem',
          }}>
            Not enough graded tickets in the last {curveDays} days for a curve.
          </div>
        )}
      </div>

      {tab === 'form' && row.trust && (
        <div style={{ marginBottom: '0.55rem' }}>
          <TrustLine trust={row.trust} />
        </div>
      )}

      {visibleLegs.length === 0 ? (
        <div style={{ ...T.micro, color: B.textMuted, padding: '0.5rem 0.1rem 0.15rem' }}>
          {tab === 'form'
            ? 'No featured picks for this sharp in this sport yet.'
            : 'No graded Action tickets for this sharp in this sport yet.'}
        </div>
      ) : (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: LEG_ROW_GRID,
            gap: '0.35rem 0.45rem',
            padding: '0 0.1rem 0.3rem',
            ...T.tiny,
            color: B.textSubtle,
          }}>
            <span>Date</span>
            <span>Pick</span>
            <span style={{ textAlign: 'right' }}>Odds</span>
            <span>
              {tab === 'recent' || formListIsActionFallback
                ? 'Size'
                : (sparkMode === 'actual' ? 'Actual' : 'Flat')}
            </span>
            <span style={{ textAlign: 'right' }}>W/L</span>
          </div>
          {[...visibleLegs].reverse().map((leg, i) => (
            <TicketLegRow
              key={`${leg.date}-${leg.side}-${leg.gameKey || i}`}
              leg={leg}
              showSize={tab === 'recent' || formListIsActionFallback}
              pnlMode={sparkMode}
            />
          ))}
          {legs.length > previewN && (
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              style={{
                marginTop: '0.55rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                ...T.micro,
                fontWeight: 700,
                color: B.gold,
                padding: '0.2rem 0',
              }}
            >
              {showMore ? 'Show less' : `Show all ${legs.length} (last ${curveDays}d)`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ children, tone }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.28rem',
      padding: '0.22rem 0.5rem',
      borderRadius: '6px',
      ...T.micro,
      fontWeight: 700,
      color: tone?.color || B.textSec,
      background: tone?.bg || 'rgba(148,163,184,0.07)',
      border: `1px solid ${tone?.border || B.borderSubtle}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/** Relative size vs this wallet's usual — visual punch, not just "1.6× press". */
function SizeBar({ ratio, band, label }) {
  if (!Number.isFinite(ratio)) return null;
  const cap = 2.5;
  const pct = Math.max(8, Math.min(100, (ratio / cap) * 100));
  const usualPct = (1 / cap) * 100;
  const hot = band === 'press' || ratio >= 1.5;
  const cool = band === 'light' || ratio < 0.5;
  const fill = hot
    ? `linear-gradient(90deg, #B8860B 0%, ${B.gold} 55%, #F5D76E 100%)`
    : cool
      ? `linear-gradient(90deg, ${B.textSubtle} 0%, ${B.textMuted} 100%)`
      : `linear-gradient(90deg, #0EA5E9 0%, ${B.green} 100%)`;
  const word = label && label !== '—' ? label : (hot ? 'press' : cool ? 'light' : 'usual');

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.45rem',
      padding: '0.28rem 0.55rem 0.28rem 0.5rem',
      borderRadius: '7px',
      background: hot ? B.goldDim : 'rgba(148,163,184,0.06)',
      border: `1px solid ${hot ? B.goldBorder : B.borderSubtle}`,
      minWidth: 118,
    }}>
      <span style={{ position: 'relative', width: 52, height: 7, flexShrink: 0 }}>
        <span style={{
          position: 'absolute', inset: 0, borderRadius: 99,
          background: 'rgba(148,163,184,0.14)',
        }} />
        {/* usual marker */}
        <span style={{
          position: 'absolute', top: -2, bottom: -2, left: `${usualPct}%`,
          width: 1.5, borderRadius: 1,
          background: 'rgba(248,250,252,0.35)',
          transform: 'translateX(-50%)',
        }} />
        <span style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct}%`, borderRadius: 99,
          background: fill,
          boxShadow: hot ? '0 0 10px rgba(212,175,55,0.45)' : 'none',
        }} />
      </span>
      <span style={{
        ...T.micro, fontWeight: 800, fontFeatureSettings: "'tnum'",
        color: hot ? B.gold : B.text,
        lineHeight: 1,
      }}>
        {ratio.toFixed(1)}×
      </span>
      <span style={{
        ...T.tiny, color: hot ? B.gold : B.textMuted,
        letterSpacing: '0.04em', textTransform: 'capitalize',
      }}>
        {word}
      </span>
    </span>
  );
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

function signalChips(row) {
  const sk = skillTone(row.skillKey);
  const oppN = Number(row.opposedBy) || 0;
  const opp = row.opposed === 'clear'
    ? { label: 'Unopposed', tone: { color: B.green, bg: B.greenDim, border: 'rgba(16,185,129,0.3)' } }
    : {
      label: oppN > 1 ? `Sharp contested · ${oppN}` : 'Sharp contested',
      tone: { color: B.amber, bg: B.amberDim, border: 'rgba(245,158,11,0.3)' },
    };
  const pin = row.pinMove === 'with'
    ? { label: 'Line with', tone: { color: B.green, bg: B.greenDim, border: 'rgba(16,185,129,0.3)' } }
    : row.pinMove === 'against'
      ? { label: 'Line against', tone: { color: B.red, bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' } }
      : null;

  return (
    <>
      <Chip tone={sk}>
        <span style={{ opacity: 0.65, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.55rem' }}>
          Sharp tier
        </span>
        {row.skillLabel}
      </Chip>
      <SizeBar
        ratio={Number.isFinite(row.displaySizeRatio) ? row.displaySizeRatio : row.sizeRatio}
        band={row.displaySizeBand || row.sizeBand}
        label={row.displaySizeLabel || row.sizeLabel}
      />
      {row.formText !== '—' && <Chip>{row.formText}</Chip>}
      <Chip tone={opp.tone}>{opp.label}</Chip>
      {pin && <Chip tone={pin.tone}>{pin.label}</Chip>}
      {row.flatCurve?.length >= 5 && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <FlatSpark points={row.flatCurve} />
          {Number.isFinite(row.flatEnd) && (
            <span style={{
              ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
              color: row.flatEnd >= 0 ? B.green : B.red,
            }}>
              {row.flatEnd >= 0 ? '+' : ''}{row.flatEnd.toFixed(1)}
            </span>
          )}
        </span>
      )}
    </>
  );
}

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
              ? `${trust.roi >= 0 ? '+' : ''}${trust.roi}% ROI`
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
function CellHistLine({ text }) {
  if (!text) return null;
  return (
    <div style={{
      marginTop: '0.28rem',
      ...T.micro,
      fontWeight: 600,
      color: B.textSubtle,
      fontFeatureSettings: "'tnum'",
      letterSpacing: '0.01em',
    }}>
      {text}
    </div>
  );
}

function ActionRow({ row, isMobile, expanded, onToggle }) {
  const [hover, setHover] = useState(false);
  const matchup = row.away && row.home ? `${row.away} @ ${row.home}` : row.gameKey;
  const clock = entryClock(row.ts);
  const accent = row.skillKey === 'high' ? B.gold
    : row.skillKey === 'mid' ? B.green
      : B.border;
  const trust = row.trust;
  const reduceMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const shell = {
    borderRadius: '12px',
    border: `1px solid ${expanded || hover ? B.goldBorder : B.border}`,
    borderLeft: `3px solid ${accent}`,
    background: hover || expanded
      ? `linear-gradient(105deg, ${B.cardHover} 0%, ${B.card} 70%)`
      : B.card,
    boxShadow: hover || expanded ? '0 10px 32px rgba(0,0,0,0.35)' : 'none',
    transition: reduceMotion
      ? 'none'
      : 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease',
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
    onClick: onToggle,
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
    },
  };

  if (isMobile) {
    return (
      <div style={shell}>
        <button {...headerBtnProps}>
          <div style={{ padding: '1rem 1rem 0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ ...T.tiny, color: sportColor(row.sport) }}>{row.sport}</span>
                  <span style={{ ...T.tiny, color: B.textMuted }}>{row.marketLabel || row.marketType}</span>
                </div>
                <div style={{ ...T.name, color: B.text, fontSize: '1.15rem' }}>{row.team}</div>
                <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.2rem' }}>{matchup}</div>
                <TrustLine trust={trust} />
                <CellHistLine text={row.cellHistText} />
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.2rem' }}>
                  {chevron}
                </div>
                <div style={{ ...T.money, color: B.gold, fontSize: '1.25rem', fontFeatureSettings: "'tnum'" }}>
                  {fmtVol(row.invested)}
                </div>
                {(row.americanLabel || Number.isFinite(row.cents)) && (
                  <div style={{ ...T.odds, color: B.text, marginTop: '0.15rem', fontFeatureSettings: "'tnum'", fontSize: '0.9rem' }}>
                    {Number.isFinite(row.cents) ? `${row.cents}¢` : ''}
                    {Number.isFinite(row.cents) && row.americanLabel ? ' · ' : ''}
                    {row.americanLabel || ''}
                  </div>
                )}
                <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.2rem', fontFeatureSettings: "'tnum'" }}>
                  {clock ? `${clock} ET` : ''}{clock ? ' · ' : ''}{agoTxt(row.ts)}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.35rem',
              marginTop: '0.75rem', paddingTop: '0.7rem',
              borderTop: `1px solid ${B.borderSubtle}`,
            }}>
              {signalChips(row)}
            </div>
          </div>
        </button>
        {expanded && <ActionExpandPanel row={row} isMobile />}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={shell}
    >
      <button {...headerBtnProps}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 1.4fr) minmax(280px, 1.6fr) auto auto',
          gap: '1.25rem',
          alignItems: 'center',
          padding: '1.1rem 1.25rem',
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{
                ...T.tiny, color: sportColor(row.sport),
                padding: '0.12rem 0.38rem', borderRadius: '4px',
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${B.borderSubtle}`,
              }}>
                {row.sport}
              </span>
              <span style={{ ...T.tiny, color: B.textMuted }}>{row.marketLabel || row.marketType}</span>
            </div>
            <div style={{ ...T.name, color: B.text }}>{row.team}</div>
            <div style={{
              ...T.body, color: B.textMuted, marginTop: '0.28rem',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {matchup}
            </div>
            <TrustLine trust={trust} />
            <CellHistLine text={row.cellHistText} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            {signalChips(row)}
          </div>

          <div style={{ textAlign: 'right', minWidth: 132 }}>
            <div style={{ ...T.money, color: B.gold, fontFeatureSettings: "'tnum'" }}>
              {fmtVol(row.invested)}
            </div>
            {(row.americanLabel || Number.isFinite(row.cents)) ? (
              <div style={{
                ...T.odds, color: B.text, marginTop: '0.2rem',
                fontFeatureSettings: "'tnum'",
              }}>
                {Number.isFinite(row.cents) ? `${row.cents}¢` : ''}
                {Number.isFinite(row.cents) && row.americanLabel ? ' · ' : ''}
                {row.americanLabel || ''}
              </div>
            ) : null}
            <div style={{
              ...T.micro, color: B.textSubtle, marginTop: '0.35rem',
              fontFeatureSettings: "'tnum'",
            }}>
              {clock ? `${clock} ET` : '—'}
              <span style={{ margin: '0 0.3rem', opacity: 0.5 }}>·</span>
              {agoTxt(row.ts)}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.15rem' }}>
            {chevron}
          </div>
        </div>
      </button>
      {expanded && <ActionExpandPanel row={row} isMobile={false} />}
    </div>
  );
}

export default function ConfirmedActionDesk({
  sharpPositions,
  spreadPositions,
  totalPositions,
  walletProfiles,
  pinnacleHistory,
  sportFilter = 'All',
  isMobile = false,
}) {
  const [sortMode, setSortMode] = useState('strength');
  const [highMidOnly, setHighMidOnly] = useState(false);
  const [sizedOnly, setSizedOnly] = useState(false);
  const [clearOnly, setClearOnly] = useState(false);
  const [pinWithOnly, setPinWithOnly] = useState(false);
  const [cellStatsTable, setCellStatsTable] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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
  }, [sportFilter, sortMode, highMidOnly, sizedOnly, clearOnly, pinWithOnly]);

  const { rows } = useMemo(
    () => buildConfirmedActionRows({
      sharpPositions,
      spreadPositions,
      totalPositions,
      walletProfiles,
      pinnacleHistory,
      cellStatsTable,
    }),
    [sharpPositions, spreadPositions, totalPositions, walletProfiles, pinnacleHistory, cellStatsTable],
  );

  const visible = useMemo(() => {
    const filtered = filterActionRows(rows, {
      sport: sportFilter,
      highMidOnly,
      sizedOnly,
      clearOnly,
      pinWithOnly,
    });
    return sortActionRows(filtered, sortMode);
  }, [rows, sportFilter, highMidOnly, sizedOnly, clearOnly, pinWithOnly, sortMode]);

  const marquee = useMemo(() => buildConfirmedActionMarquee(visible), [visible]);

  if (!walletProfiles) {
    return (
      <div style={{ ...T.body, color: B.textMuted, padding: '2rem', textAlign: 'center' }}>
        Loading…
      </div>
    );
  }

  if (rows.length === 0) {
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
      <ActionTape items={marquee} />

      {/* Compact toolbar only — no manifesto, no filler stats */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center',
        marginBottom: '0.85rem',
      }}>
        {SORTS.map((s) => (
          <Pill key={s.id} active={sortMode === s.id} onClick={() => setSortMode(s.id)}>{s.label}</Pill>
        ))}
        <span style={{ width: 1, height: 16, background: B.border, margin: '0 0.15rem' }} />
        <Pill active={highMidOnly} onClick={() => setHighMidOnly((v) => !v)}>Top half</Pill>
        <Pill active={sizedOnly} onClick={() => setSizedOnly((v) => !v)}>Sized</Pill>
        <Pill active={clearOnly} onClick={() => setClearOnly((v) => !v)}>Unopposed</Pill>
        <Pill active={pinWithOnly} onClick={() => setPinWithOnly((v) => !v)}>Line with</Pill>
        <span style={{ ...T.micro, color: B.textSubtle, marginLeft: 'auto', fontFeatureSettings: "'tnum'" }}>
          {visible.length}
          {sportFilter && sportFilter !== 'All' ? ` · ${sportFilter}` : ''}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {visible.map((r) => (
          <ActionRow
            key={r.id}
            row={r}
            isMobile={isMobile}
            expanded={expandedId === r.id}
            onToggle={() => setExpandedId((cur) => (cur === r.id ? null : r.id))}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ ...T.body, color: B.textMuted, padding: '1.5rem', textAlign: 'center' }}>
          Nothing matches these filters.
        </div>
      )}
    </div>
  );
}
