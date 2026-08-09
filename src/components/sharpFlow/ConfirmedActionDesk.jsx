/**
 * Action desk — live tickets from winning wallets.
 * Sparse header. Dense, scannable rows. No product lectures.
 */
import React, { useEffect, useMemo, useState, memo } from 'react';
import { Activity } from 'lucide-react';
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
  const up = points[points.length - 1] >= points[0];
  const color = up ? B.green : B.red;
  return (
    <svg width={width} height={height} style={{ display: 'block' }} aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});

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

function ActionRow({ row, isMobile }) {
  const [hover, setHover] = useState(false);
  const matchup = row.away && row.home ? `${row.away} @ ${row.home}` : row.gameKey;
  const clock = entryClock(row.ts);
  const accent = row.skillKey === 'high' ? B.gold
    : row.skillKey === 'mid' ? B.green
      : B.border;
  const trust = row.trust;

  const shell = {
    borderRadius: '12px',
    border: `1px solid ${hover ? B.goldBorder : B.border}`,
    borderLeft: `3px solid ${accent}`,
    background: hover
      ? `linear-gradient(105deg, ${B.cardHover} 0%, ${B.card} 70%)`
      : B.card,
    boxShadow: hover ? '0 10px 32px rgba(0,0,0,0.35)' : 'none',
    transition: 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease',
    overflow: 'hidden',
  };

  if (isMobile) {
    return (
      <div style={shell}>
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
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={shell}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(240px, 1.4fr) minmax(280px, 1.6fr) auto',
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
      </div>
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

  useEffect(() => {
    let cancelled = false;
    fetch('/sharp-tier-cell-stats.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (!cancelled && j?.cells) setCellStatsTable(j); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

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
          <ActionRow key={r.id} row={r} isMobile={isMobile} />
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
