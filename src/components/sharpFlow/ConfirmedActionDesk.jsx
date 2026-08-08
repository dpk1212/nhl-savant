/**
 * CONFIRMED Action desk — OKX-style strength list.
 * Data product only: no stake units, lock CTAs, or path stamps.
 */
import React, { useMemo, useState, memo } from 'react';
import { Activity, Eye, ShieldCheck, TrendingUp } from 'lucide-react';
import {
  buildConfirmedActionRows,
  buildConfirmedActionMarquee,
  filterActionRows,
  sortActionRows,
} from '../../lib/confirmedActionDesk.js';

const B = {
  gold: '#D4AF37',
  goldDim: 'rgba(212, 175, 55, 0.10)',
  goldBorder: 'rgba(212, 175, 55, 0.25)',
  green: '#10B981',
  greenDim: 'rgba(16, 185, 129, 0.12)',
  red: '#EF4444',
  redDim: 'rgba(239, 68, 68, 0.12)',
  sky: '#0EA5E9',
  card: '#151923',
  cardAlt: '#1A1F2E',
  border: 'rgba(37, 43, 59, 0.8)',
  borderSubtle: 'rgba(26, 32, 48, 0.6)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textSubtle: '#475569',
};

const T = {
  sub: { fontSize: '0.938rem', fontWeight: 700, lineHeight: 1.4 },
  label: { fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.03em' },
  micro: { fontSize: '0.625rem', fontWeight: 600, lineHeight: 1.4 },
  tiny: {
    fontSize: '0.563rem', fontWeight: 700, lineHeight: 1.4,
    letterSpacing: '0.05em', textTransform: 'uppercase',
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
  if (key === 'mid') return { color: B.green, bg: B.greenDim, border: 'rgba(16,185,129,0.25)' };
  if (key === 'low') return { color: B.textSec, bg: 'rgba(148,163,184,0.08)', border: B.border };
  return { color: B.textMuted, bg: 'rgba(100,116,139,0.08)', border: B.borderSubtle };
}

const SORTS = [
  { id: 'strength', label: 'Strength' },
  { id: 'size', label: 'Size' },
  { id: 'skill', label: 'Skill' },
  { id: 'form', label: 'Form' },
  { id: 'trend', label: 'Trend' },
  { id: 'recency', label: 'Recency' },
  { id: 'dollars', label: '$' },
];

const FlatSpark = memo(function FlatSpark({ points, width = 72, height = 22 }) {
  if (!points || points.length < 5) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 2;
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
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '0.28rem 0.65rem',
        borderRadius: '6px',
        cursor: 'pointer',
        border: active ? `1px solid ${B.goldBorder}` : `1px solid ${B.border}`,
        background: active
          ? `linear-gradient(135deg, ${B.goldDim} 0%, rgba(212,175,55,0.03) 100%)`
          : 'transparent',
        color: active ? B.gold : B.textMuted,
        ...T.micro,
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div style={{
      padding: '0.75rem 0.85rem',
      borderRadius: '10px',
      background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
      border: `1px solid ${accent ? B.goldBorder : B.borderSubtle}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
        <Icon size={12} color={accent || B.textMuted} />
        <span style={{ ...T.tiny, color: B.textMuted }}>{label}</span>
      </div>
      <div style={{ ...T.sub, color: accent || B.text, margin: 0, fontFeatureSettings: "'tnum'" }}>
        {value}
      </div>
    </div>
  );
}

const ConfirmedActionMarquee = memo(function ConfirmedActionMarquee({ items }) {
  if (!items || items.length < 3) return null;
  const renderRun = (prefix) => items.map((it, i) => (
    <span key={`${prefix}-${i}`} style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0 1.1rem', whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
        background: it.opposed === 'clear' ? B.green : B.gold,
      }} />
      <span style={{ ...T.micro, fontSize: '0.55rem', color: B.textSubtle, letterSpacing: '0.05em' }}>{it.sport}</span>
      <span style={{ ...T.micro, fontSize: '0.62rem', fontWeight: 800, color: B.text }}>{String(it.team).toUpperCase()}</span>
      <span style={{ ...T.micro, fontSize: '0.62rem', fontWeight: 800, color: B.gold, fontFeatureSettings: "'tnum'" }}>{fmtVol(it.invested)}</span>
      <span style={{ ...T.micro, fontSize: '0.55rem', color: B.textSec }}>{it.skillLabel}</span>
      <span style={{ ...T.micro, fontSize: '0.55rem', color: B.textSubtle }}>{agoTxt(it.ts)}</span>
    </span>
  ));

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.65rem',
      marginBottom: '1rem', padding: '0.45rem 0.65rem',
      borderRadius: '10px',
      background: 'linear-gradient(160deg, rgba(26,31,46,0.55) 0%, rgba(17,21,31,0.65) 100%)',
      border: `1px solid ${B.borderSubtle}`,
      overflow: 'hidden',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0,
        padding: '0.18rem 0.5rem', borderRadius: '5px',
        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%', background: B.green,
          boxShadow: '0 0 6px rgba(16,185,129,0.7)',
        }} />
        <span style={{ ...T.micro, fontSize: '0.55rem', fontWeight: 900, color: B.green, letterSpacing: '0.1em' }}>
          CONFIRMED ACTION
        </span>
      </span>
      <div className="sf-tape" style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <div className="sf-tape-track" style={{ animationDuration: `${Math.max(40, items.length * 5)}s` }}>
          {renderRun('a')}
          {renderRun('b')}
        </div>
      </div>
    </div>
  );
});

function ActionRow({ row, isMobile }) {
  const sk = skillTone(row.skillKey);
  const flatLabel = Number.isFinite(row.flatEnd)
    ? `${row.flatEnd >= 0 ? '+' : ''}${row.flatEnd.toFixed(1)} flat`
    : null;
  const pinColor = row.pinMove === 'with' ? B.green : row.pinMove === 'against' ? B.red : B.textMuted;
  const oppColor = row.opposed === 'clear' ? B.green : '#F59E0B';
  const accent = row.skillKey === 'high' ? B.goldBorder
    : row.skillKey === 'thin' ? B.borderSubtle
      : B.border;

  if (isMobile) {
    return (
      <div style={{
        padding: '0.7rem 0.75rem',
        borderRadius: '10px',
        border: `1px solid ${accent}`,
        borderLeft: `3px solid ${sk.color}`,
        background: B.card,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <div>
            <span style={{ ...T.tiny, color: sportColor(row.sport), marginRight: '0.4rem' }}>{row.sport}</span>
            <span style={{ ...T.sub, color: B.text, fontSize: '0.85rem' }}>{row.team}</span>
            <span style={{ ...T.micro, color: B.textMuted, marginLeft: '0.35rem' }}>{row.marketType}</span>
          </div>
          <span style={{ ...T.sub, color: B.gold, fontSize: '0.85rem', fontFeatureSettings: "'tnum'" }}>{fmtVol(row.invested)}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
          <Badge tone={sk}>{row.skillLabel}</Badge>
          <Badge>{row.sizeRatio != null ? `${row.sizeRatio.toFixed(1)}×` : '—'} {row.sizeLabel !== '—' ? row.sizeLabel : ''}</Badge>
          <Badge>{row.formText}</Badge>
          <Badge tone={{ color: oppColor }}>{row.opposed === 'clear' ? 'Clear' : 'Contested'}</Badge>
          <Badge tone={{ color: pinColor }}>{row.pinMove === 'with' ? 'Pin with' : row.pinMove === 'against' ? 'Pin against' : 'Pin —'}</Badge>
          <span style={{ ...T.micro, color: B.textSubtle, marginLeft: 'auto' }}>{agoTxt(row.ts)}</span>
        </div>
        {(row.flatCurve || flatLabel) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.45rem' }}>
            <FlatSpark points={row.flatCurve} />
            {flatLabel && <span style={{ ...T.micro, color: (row.flatEnd || 0) >= 0 ? B.green : B.red, fontFeatureSettings: "'tnum'" }}>{flatLabel}</span>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.6fr 0.7fr 0.7fr 0.75fr 1fr 0.75fr 0.7fr 0.7fr 0.55fr',
      gap: '0.4rem',
      alignItems: 'center',
      padding: '0.55rem 0.65rem',
      borderRadius: '8px',
      border: `1px solid ${accent}`,
      borderLeft: `3px solid ${sk.color}`,
      background: B.card,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <span style={{ ...T.tiny, color: sportColor(row.sport) }}>{row.sport}</span>
          <span style={{ ...T.label, color: B.text, fontWeight: 800 }}>{row.team}</span>
          <span style={{ ...T.micro, color: B.textMuted }}>{row.marketType}</span>
        </div>
        <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.1rem' }}>
          {row.away && row.home ? `${row.away} @ ${row.home}` : row.gameKey}
        </div>
      </div>
      <div><Badge tone={sk}>{row.skillLabel}</Badge></div>
      <div style={{ ...T.micro, color: B.text, fontFeatureSettings: "'tnum'" }}>
        <span style={{ fontWeight: 800 }}>{row.sizeRatio != null ? `${row.sizeRatio.toFixed(1)}×` : '—'}</span>
        <span style={{ color: B.textMuted, marginLeft: '0.25rem' }}>{row.sizeLabel}</span>
      </div>
      <div style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>{row.formText}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <FlatSpark points={row.flatCurve} />
        <span style={{
          ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
          color: Number.isFinite(row.flatEnd) ? ((row.flatEnd >= 0) ? B.green : B.red) : B.textMuted,
        }}>
          {flatLabel || '—'}
        </span>
      </div>
      <div style={{ ...T.micro, fontWeight: 700, color: oppColor }}>
        {row.opposed === 'clear' ? 'Clear' : 'Contested'}
      </div>
      <div style={{ ...T.micro, fontWeight: 700, color: pinColor }}>
        {row.pinMove === 'with' ? 'With' : row.pinMove === 'against' ? 'Against' : '—'}
      </div>
      <div style={{ ...T.label, color: B.gold, fontWeight: 800, fontFeatureSettings: "'tnum'" }}>{fmtVol(row.invested)}</div>
      <div style={{ ...T.micro, color: B.textSubtle, fontFeatureSettings: "'tnum'", textAlign: 'right' }}>{agoTxt(row.ts)}</div>
    </div>
  );
}

function Badge({ children, tone }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.12rem 0.4rem',
      borderRadius: '5px',
      ...T.micro,
      fontWeight: 800,
      color: tone?.color || B.textSec,
      background: tone?.bg || 'rgba(148,163,184,0.08)',
      border: `1px solid ${tone?.border || B.borderSubtle}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
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

  const { rows, stats } = useMemo(
    () => buildConfirmedActionRows({
      sharpPositions,
      spreadPositions,
      totalPositions,
      walletProfiles,
      pinnacleHistory,
    }),
    [sharpPositions, spreadPositions, totalPositions, walletProfiles, pinnacleHistory],
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
      <div style={{ ...T.label, color: B.textMuted, padding: '2rem', textAlign: 'center' }}>
        Loading wallet strength…
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '3rem', borderRadius: '12px',
        background: `linear-gradient(135deg, ${B.card} 0%, ${B.cardAlt} 100%)`,
        border: `1px solid ${B.border}`,
      }}>
        <Activity size={28} color={B.textMuted} style={{ marginBottom: '0.75rem' }} />
        <div style={{ ...T.sub, color: B.text, marginBottom: '0.35rem' }}>No CONFIRMED action right now</div>
        <div style={{ ...T.label, color: B.textSec }}>
          When CONFIRMED-in-sport wallets open positions, they rank here by strength.
        </div>
      </div>
    );
  }

  return (
    <div>
      <ConfirmedActionMarquee items={marquee} />

      <div style={{ marginBottom: '0.85rem' }}>
        <div style={{ ...T.sub, color: B.text, marginBottom: '0.2rem' }}>CONFIRMED wallet action</div>
        <div style={{ ...T.micro, color: B.textSec }}>
          Ranked by strength — skill, relative size, form, opposition, and Pinnacle move. Observational data only.
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '0.625rem',
        marginBottom: '1rem',
      }}>
        <StatCard icon={Activity} label="Live positions" value={stats.total} accent={B.gold} />
        <StatCard icon={TrendingUp} label="High / Mid skill" value={stats.highMid} />
        <StatCard icon={ShieldCheck} label="Clear (unopposed)" value={stats.clear} accent={stats.clear > 0 ? B.green : null} />
        <StatCard icon={Eye} label="Pin moving with" value={stats.pinWith} />
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center',
        marginBottom: '0.65rem',
      }}>
        <span style={{ ...T.tiny, color: B.textMuted, marginRight: '0.25rem' }}>Sort</span>
        {SORTS.map((s) => (
          <Pill key={s.id} active={sortMode === s.id} onClick={() => setSortMode(s.id)}>{s.label}</Pill>
        ))}
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center',
        marginBottom: '0.85rem',
      }}>
        <span style={{ ...T.tiny, color: B.textMuted, marginRight: '0.25rem' }}>Filter</span>
        <Pill active={highMidOnly} onClick={() => setHighMidOnly((v) => !v)}>High / Mid</Pill>
        <Pill active={sizedOnly} onClick={() => setSizedOnly((v) => !v)}>Sized ≥0.5×</Pill>
        <Pill active={clearOnly} onClick={() => setClearOnly((v) => !v)}>Clear only</Pill>
        <Pill active={pinWithOnly} onClick={() => setPinWithOnly((v) => !v)}>Pin with</Pill>
        <span style={{ ...T.micro, color: B.textSubtle, marginLeft: 'auto' }}>
          {visible.length} of {rows.length}
          {sportFilter && sportFilter !== 'All' ? ` · ${sportFilter}` : ''}
        </span>
      </div>

      {!isMobile && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 0.7fr 0.7fr 0.75fr 1fr 0.75fr 0.7fr 0.7fr 0.55fr',
          gap: '0.4rem',
          padding: '0 0.65rem 0.4rem',
        }}>
          {['Pick', 'Skill', 'Size', 'Form', 'Trend', 'Opposed', 'Pin', '$', 'Ago'].map((h) => (
            <div key={h} style={{ ...T.tiny, color: B.textMuted }}>{h}</div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {visible.map((r) => (
          <ActionRow key={r.id} row={r} isMobile={isMobile} />
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ ...T.label, color: B.textMuted, padding: '1.5rem', textAlign: 'center' }}>
          No rows match these filters.
        </div>
      )}
    </div>
  );
}
