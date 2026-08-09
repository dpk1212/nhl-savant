/**
 * CONFIRMED Action desk — OKX/Fey-style strength list.
 * Data product only: no stake units, lock CTAs, or path stamps.
 */
import React, { useMemo, useState, useId, memo } from 'react';
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
  goldBorder: 'rgba(212, 175, 55, 0.28)',
  green: '#10B981',
  greenDim: 'rgba(16, 185, 129, 0.12)',
  red: '#EF4444',
  redDim: 'rgba(239, 68, 68, 0.12)',
  amber: '#F59E0B',
  amberDim: 'rgba(245, 158, 11, 0.12)',
  sky: '#0EA5E9',
  card: '#151923',
  cardAlt: '#1A1F2E',
  cardHover: '#1C2230',
  border: 'rgba(37, 43, 59, 0.85)',
  borderSubtle: 'rgba(26, 32, 48, 0.7)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textSubtle: '#475569',
};

const T = {
  hero: { fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.01em' },
  sub: { fontSize: '0.938rem', fontWeight: 700, lineHeight: 1.35 },
  label: { fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.35, letterSpacing: '0.01em' },
  body: { fontSize: '0.72rem', fontWeight: 600, lineHeight: 1.4 },
  micro: { fontSize: '0.65rem', fontWeight: 600, lineHeight: 1.35 },
  tiny: {
    fontSize: '0.58rem', fontWeight: 700, lineHeight: 1.3,
    letterSpacing: '0.06em', textTransform: 'uppercase',
  },
};

const GRID = 'minmax(220px, 1.9fr) 0.85fr 0.95fr 0.85fr 1.15fr 0.9fr 0.85fr 0.85fr';

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
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

/** Absolute entry clock in ET — e.g. "Aug 8, 3:12 PM ET". */
function entryClock(ts) {
  if (!ts) return null;
  try {
    return `${new Date(ts).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })} ET`;
  } catch {
    return null;
  }
}

function ticketPriceLine(row) {
  const parts = [];
  if (Number.isFinite(row.cents)) parts.push(`${row.cents}¢`);
  if (row.americanLabel) parts.push(row.americanLabel);
  return parts.length ? parts.join(' · ') : null;
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
  if (key === 'mid') return { color: B.green, bg: B.greenDim, border: 'rgba(16,185,129,0.28)' };
  if (key === 'low') return { color: B.textSec, bg: 'rgba(148,163,184,0.08)', border: B.border };
  return { color: B.textMuted, bg: 'rgba(100,116,139,0.08)', border: B.borderSubtle };
}

function skillHint(key) {
  if (key === 'high') return 'Among the best in this sport';
  if (key === 'mid') return 'Solid history in this sport';
  if (key === 'low') return 'Weaker history in this sport';
  return 'Not enough history yet';
}

function sizeHint(band, ratio) {
  if (!Number.isFinite(ratio)) return 'Compared to what they usually bet';
  if (band === 'press') return 'Bigger than they usually bet';
  if (band === 'full') return 'About their usual size';
  if (band === 'lean') return 'Smaller than usual';
  return 'Much smaller than usual';
}

function formHint(kind) {
  if (kind === 'l10') return 'Last 10 settled bets';
  if (kind === 'l5') return 'Last 5 settled bets';
  if (kind === 'book') return 'Overall record in sport';
  return 'No recent results yet';
}

const SORTS = [
  { id: 'strength', label: 'Best look' },
  { id: 'size', label: 'Bet size' },
  { id: 'skill', label: 'Track record' },
  { id: 'form', label: 'Form' },
  { id: 'trend', label: 'Trend' },
  { id: 'recency', label: 'Newest' },
  { id: 'dollars', label: '$' },
];

const COL_HEADERS = [
  { key: 'pick', title: 'Bet', sub: 'Who · matchup · entry' },
  { key: 'skill', title: 'Track record', sub: 'How they do here' },
  { key: 'size', title: 'Bet size', sub: 'vs what they usually risk' },
  { key: 'form', title: 'Recent form', sub: 'Last settled results' },
  { key: 'trend', title: 'Trend', sub: 'Running result' },
  { key: 'field', title: 'Competition', sub: 'Sharp money opposite?' },
  { key: 'pin', title: 'Line move', sub: 'Where sharp books went' },
  { key: 'money', title: 'Ticket', sub: '$ · price · odds' },
];

const FlatSpark = memo(function FlatSpark({ points, width = 96, height = 28 }) {
  const gid = useId().replace(/:/g, '');
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
  const gradId = `spark-${gid}`;
  const area = `${d} L${pts[pts.length - 1].x.toFixed(1)},${height - pad} L${pts[0].x.toFixed(1)},${height - pad} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});

function SizeMeter({ ratio }) {
  if (!Number.isFinite(ratio)) return null;
  const pct = Math.max(6, Math.min(100, (ratio / 2) * 100));
  const hot = ratio >= 1.5;
  return (
    <div style={{
      marginTop: '0.28rem', height: 3, borderRadius: 99, overflow: 'hidden',
      background: 'rgba(148,163,184,0.12)', maxWidth: 72,
    }}>
      <div style={{
        width: `${pct}%`, height: '100%', borderRadius: 99,
        background: hot
          ? `linear-gradient(90deg, ${B.gold}, #F5D76E)`
          : `linear-gradient(90deg, ${B.sky}, ${B.green})`,
      }} />
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '0.32rem 0.7rem',
        borderRadius: '7px',
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

function StatCard({ icon: Icon, label, value, accent, hint }) {
  return (
    <div style={{
      padding: '0.85rem 0.95rem',
      borderRadius: '12px',
      background: `linear-gradient(145deg, ${B.cardAlt} 0%, ${B.card} 100%)`,
      border: `1px solid ${accent ? B.goldBorder : B.borderSubtle}`,
      boxShadow: accent ? '0 0 0 1px rgba(212,175,55,0.04)' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
        <Icon size={13} color={accent || B.textMuted} />
        <span style={{ ...T.tiny, color: B.textMuted }}>{label}</span>
      </div>
      <div style={{ ...T.hero, color: accent || B.text, fontFeatureSettings: "'tnum'", fontSize: '1.35rem' }}>
        {value}
      </div>
      {hint && (
        <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.25rem' }}>{hint}</div>
      )}
    </div>
  );
}

function Badge({ children, tone }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.18rem 0.5rem',
      borderRadius: '6px',
      ...T.micro,
      fontWeight: 800,
      fontSize: '0.7rem',
      color: tone?.color || B.textSec,
      background: tone?.bg || 'rgba(148,163,184,0.08)',
      border: `1px solid ${tone?.border || B.borderSubtle}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

const ConfirmedActionMarquee = memo(function ConfirmedActionMarquee({ items }) {
  if (!items || items.length < 3) return null;
  const renderRun = (prefix) => items.map((it, i) => (
    <span key={`${prefix}-${i}`} style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
      padding: '0 1.25rem', whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: it.opposed === 'clear' ? B.green : B.gold,
        boxShadow: it.opposed === 'clear' ? '0 0 8px rgba(16,185,129,0.55)' : 'none',
      }} />
      <span style={{ ...T.micro, fontSize: '0.58rem', color: B.textSubtle, letterSpacing: '0.06em' }}>{it.sport}</span>
      <span style={{ ...T.body, fontWeight: 800, color: B.text }}>{String(it.team).toUpperCase()}</span>
      <span style={{ ...T.body, fontWeight: 800, color: B.gold, fontFeatureSettings: "'tnum'" }}>{fmtVol(it.invested)}</span>
      {(it.americanLabel || Number.isFinite(it.cents)) && (
        <span style={{ ...T.micro, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
          {Number.isFinite(it.cents) ? `${it.cents}¢` : ''}
          {Number.isFinite(it.cents) && it.americanLabel ? ' · ' : ''}
          {it.americanLabel || ''}
        </span>
      )}
      <span style={{ ...T.micro, color: B.textSubtle }}>{agoTxt(it.ts)}</span>
    </span>
  ));

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      marginBottom: '1.15rem', padding: '0.55rem 0.75rem',
      borderRadius: '12px',
      background: 'linear-gradient(160deg, rgba(26,31,46,0.7) 0%, rgba(17,21,31,0.85) 100%)',
      border: `1px solid ${B.borderSubtle}`,
      overflow: 'hidden',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0,
        padding: '0.28rem 0.6rem', borderRadius: '6px',
        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: B.green,
          boxShadow: '0 0 8px rgba(16,185,129,0.75)',
        }} />
        <span style={{ ...T.tiny, color: B.green, letterSpacing: '0.12em' }}>
          LIVE ACTION
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

function ActionRow({ row, isMobile, rank }) {
  const sk = skillTone(row.skillKey);
  const flatLabel = Number.isFinite(row.flatEnd)
    ? `${row.flatEnd >= 0 ? '+' : ''}${row.flatEnd.toFixed(1)} flat`
    : null;
  const pinColor = row.pinMove === 'with' ? B.green : row.pinMove === 'against' ? B.red : B.textMuted;
  const oppColor = row.opposed === 'clear' ? B.green : B.amber;
  const accent = row.skillKey === 'high' ? B.gold
    : row.skillKey === 'mid' ? B.green
      : row.skillKey === 'thin' ? B.textSubtle
        : B.textMuted;
  const matchup = row.away && row.home ? `${row.away} @ ${row.home}` : row.gameKey;
  const walletTag = row.walletShort ? `···${String(row.walletShort).slice(-4)}` : null;
  const priceLine = ticketPriceLine(row);
  const clock = entryClock(row.ts);

  const [hover, setHover] = useState(false);

  if (isMobile) {
    return (
      <div style={{
        padding: '0.95rem 1rem',
        borderRadius: '14px',
        border: `1px solid ${hover ? B.goldBorder : B.border}`,
        borderLeft: `3px solid ${accent}`,
        background: `linear-gradient(135deg, ${B.cardAlt} 0%, ${B.card} 100%)`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.65rem', marginBottom: '0.55rem' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span style={{
                ...T.tiny, color: sportColor(row.sport),
                padding: '0.12rem 0.35rem', borderRadius: '4px',
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${B.borderSubtle}`,
              }}>
                {row.sport}
              </span>
              <span style={{ ...T.tiny, color: B.textMuted }}>{row.marketType}</span>
            </div>
            <div style={{ ...T.hero, color: B.text, fontSize: '1.05rem' }}>{row.team}</div>
            <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.15rem' }}>{matchup}</div>
            {clock && (
              <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.25rem', fontFeatureSettings: "'tnum'" }}>
                In at {clock} · {agoTxt(row.ts)}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ ...T.hero, color: B.gold, fontSize: '1.15rem', fontFeatureSettings: "'tnum'" }}>
              {fmtVol(row.invested)}
            </div>
            {priceLine && (
              <div style={{ ...T.micro, color: B.textSec, marginTop: '0.15rem', fontFeatureSettings: "'tnum'" }}>
                @ {priceLine}
              </div>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem',
          paddingTop: '0.55rem', borderTop: `1px solid ${B.borderSubtle}`,
        }}>
          <MobileMetric label="Track record" value={<Badge tone={sk}>{row.skillLabel}</Badge>} hint={skillHint(row.skillKey)} />
          <MobileMetric
            label="Bet size"
            value={(
              <span style={{ ...T.label, color: B.text, fontFeatureSettings: "'tnum'" }}>
                {row.sizeRatio != null ? `${row.sizeRatio.toFixed(1)}×` : '—'}
                <span style={{ color: B.textMuted, fontWeight: 600, marginLeft: '0.3rem' }}>{row.sizeLabel !== '—' ? row.sizeLabel : ''}</span>
              </span>
            )}
            hint={sizeHint(row.sizeBand, row.sizeRatio)}
          />
          <MobileMetric label="Form" value={row.formText} hint={formHint(row.formKind)} />
          <MobileMetric
            label="Competition"
            value={<span style={{ color: oppColor, fontWeight: 800 }}>{row.opposed === 'clear' ? 'Unopposed' : 'Both sides'}</span>}
            hint={row.opposed === 'clear' ? 'No sharp money the other way' : 'Sharp money on both sides'}
          />
          <MobileMetric
            label="Line move"
            value={<span style={{ color: pinColor, fontWeight: 800 }}>{row.pinMove === 'with' ? 'With them' : row.pinMove === 'against' ? 'Against them' : 'Quiet'}</span>}
            hint="Where the sharp books moved"
          />
          {(row.flatCurve || flatLabel) && (
            <div>
              <div style={{ ...T.tiny, color: B.textMuted, marginBottom: '0.2rem' }}>Trend</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FlatSpark points={row.flatCurve} width={80} height={24} />
                {flatLabel && (
                  <span style={{
                    ...T.micro, fontWeight: 700, fontFeatureSettings: "'tnum'",
                    color: (row.flatEnd || 0) >= 0 ? B.green : B.red,
                  }}>
                    {flatLabel}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        {walletTag && (
          <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.55rem' }}>
            Bettor {walletTag}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: GRID,
        gap: '0.65rem',
        alignItems: 'center',
        padding: '1rem 1.05rem',
        borderRadius: '14px',
        border: `1px solid ${hover ? B.goldBorder : B.border}`,
        borderLeft: `3px solid ${accent}`,
        background: hover
          ? `linear-gradient(120deg, ${B.cardHover} 0%, ${B.card} 55%, rgba(212,175,55,0.04) 100%)`
          : `linear-gradient(145deg, ${B.cardAlt} 0%, ${B.card} 100%)`,
        boxShadow: hover ? '0 8px 28px rgba(0,0,0,0.28)' : '0 1px 0 rgba(255,255,255,0.02)',
        transition: 'border-color 160ms ease, box-shadow 160ms ease, background 160ms ease',
        cursor: 'default',
      }}
    >
      {/* Position */}
      <div style={{ minWidth: 0, display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '8px', flexShrink: 0,
          display: 'grid', placeItems: 'center',
          background: rank <= 3 ? B.goldDim : 'rgba(148,163,184,0.06)',
          border: `1px solid ${rank <= 3 ? B.goldBorder : B.borderSubtle}`,
          ...T.tiny, color: rank <= 3 ? B.gold : B.textMuted, fontFeatureSettings: "'tnum'",
        }}>
          {rank}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <span style={{
              ...T.tiny, color: sportColor(row.sport),
              padding: '0.14rem 0.4rem', borderRadius: '5px',
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${B.borderSubtle}`,
            }}>
              {row.sport}
            </span>
            <span style={{
              ...T.tiny, color: B.textSec,
              padding: '0.14rem 0.4rem', borderRadius: '5px',
              background: 'rgba(148,163,184,0.06)', border: `1px solid ${B.borderSubtle}`,
            }}>
              {row.marketType}
            </span>
            {walletTag && (
              <span style={{ ...T.micro, color: B.textSubtle }}>bettor {walletTag}</span>
            )}
          </div>
          <div style={{ ...T.hero, color: B.text }}>{row.team}</div>
          <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {matchup}
          </div>
          {(clock || priceLine) && (
            <div style={{
              ...T.micro, color: B.textSec, marginTop: '0.35rem',
              fontFeatureSettings: "'tnum'", display: 'flex', flexWrap: 'wrap', gap: '0.35rem 0.55rem',
            }}>
              {clock && <span>In {clock}</span>}
              {clock && <span style={{ color: B.textSubtle }}>·</span>}
              <span style={{ color: B.textSubtle }}>{agoTxt(row.ts)}</span>
              {priceLine && (
                <>
                  <span style={{ color: B.textSubtle }}>·</span>
                  <span>@ {priceLine}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Skill */}
      <div>
        <Badge tone={sk}>{row.skillLabel}</Badge>
        <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.35rem' }}>
          {skillHint(row.skillKey)}
        </div>
      </div>

      {/* Size */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
          <span style={{ ...T.sub, color: B.text, fontFeatureSettings: "'tnum'", fontSize: '1rem' }}>
            {row.sizeRatio != null ? `${row.sizeRatio.toFixed(1)}×` : '—'}
          </span>
          {row.sizeLabel !== '—' && (
            <span style={{ ...T.micro, color: B.textSec, textTransform: 'capitalize' }}>{row.sizeLabel}</span>
          )}
        </div>
        <SizeMeter ratio={row.sizeRatio} />
        <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.28rem' }}>
          {sizeHint(row.sizeBand, row.sizeRatio)}
        </div>
      </div>

      {/* Form */}
      <div>
        <div style={{ ...T.label, color: B.text, fontFeatureSettings: "'tnum'" }}>{row.formText}</div>
        <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.3rem' }}>
          {formHint(row.formKind)}
        </div>
      </div>

      {/* Trend */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <FlatSpark points={row.flatCurve} />
          <div>
            <div style={{
              ...T.label, fontWeight: 800, fontFeatureSettings: "'tnum'",
              color: Number.isFinite(row.flatEnd) ? ((row.flatEnd >= 0) ? B.green : B.red) : B.textMuted,
            }}>
              {flatLabel || '—'}
            </div>
            <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.15rem' }}>
              {flatLabel ? 'Even-money result lately' : 'Need more settled bets'}
            </div>
          </div>
        </div>
      </div>

      {/* Competition */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.22rem 0.55rem', borderRadius: '6px',
          background: row.opposed === 'clear' ? B.greenDim : B.amberDim,
          border: `1px solid ${row.opposed === 'clear' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: oppColor,
            boxShadow: row.opposed === 'clear' ? '0 0 6px rgba(16,185,129,0.6)' : 'none',
          }} />
          <span style={{ ...T.micro, fontWeight: 800, color: oppColor }}>
            {row.opposed === 'clear' ? 'Unopposed' : 'Both sides'}
          </span>
        </div>
        <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.35rem' }}>
          {row.opposed === 'clear' ? 'No sharp money the other way' : 'Sharp money on both sides'}
        </div>
      </div>

      {/* Line move */}
      <div>
        <div style={{ ...T.label, fontWeight: 800, color: pinColor }}>
          {row.pinMove === 'with' ? 'Books with them' : row.pinMove === 'against' ? 'Books against' : 'Line quiet'}
        </div>
        <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.3rem' }}>
          {row.pinMove === 'with' ? 'Sharp line moved their way'
            : row.pinMove === 'against' ? 'Sharp line moved the other way'
              : 'No clear book move yet'}
        </div>
      </div>

      {/* Ticket: $ · price · odds */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...T.hero, color: B.gold, fontSize: '1.15rem', fontFeatureSettings: "'tnum'" }}>
          {fmtVol(row.invested)}
        </div>
        {priceLine ? (
          <div style={{ ...T.label, color: B.text, marginTop: '0.25rem', fontFeatureSettings: "'tnum'", fontSize: '0.78rem' }}>
            @ {priceLine}
          </div>
        ) : (
          <div style={{ ...T.micro, color: B.textMuted, marginTop: '0.25rem' }}>Price n/a</div>
        )}
        <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.25rem', fontFeatureSettings: "'tnum'" }}>
          {agoTxt(row.ts)}
        </div>
      </div>
    </div>
  );
}

function MobileMetric({ label, value, hint }) {
  return (
    <div>
      <div style={{ ...T.tiny, color: B.textMuted, marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ ...T.label, color: B.text }}>{value}</div>
      {hint && <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.15rem' }}>{hint}</div>}
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
        Loading live action…
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '3.25rem 2rem', borderRadius: '14px',
        background: `linear-gradient(145deg, ${B.cardAlt} 0%, ${B.card} 100%)`,
        border: `1px solid ${B.border}`,
      }}>
        <Activity size={30} color={B.textMuted} style={{ marginBottom: '0.85rem' }} />
        <div style={{ ...T.sub, color: B.text, marginBottom: '0.4rem' }}>No live action right now</div>
        <div style={{ ...T.body, color: B.textSec, maxWidth: 420, margin: '0 auto' }}>
          When proven bettors put money down, their open bets show up here — who, how much, at what price, and when.
        </div>
      </div>
    );
  }

  return (
    <div>
      <ConfirmedActionMarquee items={marquee} />

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ ...T.hero, color: B.text, marginBottom: '0.3rem', fontSize: '1.2rem' }}>
          What winning bettors are on
        </div>
        <div style={{ ...T.body, color: B.textSec, maxWidth: 720 }}>
          Open bets from people who actually win in that sport. We rank them by how strong each ticket looks —
          their track record, how big they bet vs usual, recent form, whether sharp money is on the other side,
          and whether the books moved with them. Each row shows entry time, price, and American odds.
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '0.7rem',
        marginBottom: '1.15rem',
      }}>
        <StatCard icon={Activity} label="Open bets" value={stats.total} accent={B.gold} hint="Live tickets right now" />
        <StatCard icon={TrendingUp} label="Stronger hands" value={stats.highMid} hint="Better track records" />
        <StatCard icon={ShieldCheck} label="Unopposed" value={stats.clear} accent={stats.clear > 0 ? B.green : null} hint="No sharp money opposite" />
        <StatCard icon={Eye} label="Books agree" value={stats.pinWith} hint="Line moved their way" />
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center',
        marginBottom: '0.7rem',
      }}>
        <span style={{ ...T.tiny, color: B.textMuted, marginRight: '0.2rem' }}>Sort</span>
        {SORTS.map((s) => (
          <Pill key={s.id} active={sortMode === s.id} onClick={() => setSortMode(s.id)}>{s.label}</Pill>
        ))}
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <span style={{ ...T.tiny, color: B.textMuted, marginRight: '0.2rem' }}>Filter</span>
        <Pill active={highMidOnly} onClick={() => setHighMidOnly((v) => !v)}>Stronger hands</Pill>
        <Pill active={sizedOnly} onClick={() => setSizedOnly((v) => !v)}>Real size</Pill>
        <Pill active={clearOnly} onClick={() => setClearOnly((v) => !v)}>Unopposed</Pill>
        <Pill active={pinWithOnly} onClick={() => setPinWithOnly((v) => !v)}>Books agree</Pill>
        <span style={{ ...T.micro, color: B.textSubtle, marginLeft: 'auto' }}>
          {visible.length} of {rows.length}
          {sportFilter && sportFilter !== 'All' ? ` · ${sportFilter}` : ''}
        </span>
      </div>

      {!isMobile && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: GRID,
          gap: '0.65rem',
          padding: '0 1.05rem 0.55rem',
        }}>
          {COL_HEADERS.map((h) => (
            <div key={h.key}>
              <div style={{ ...T.tiny, color: B.textMuted }}>{h.title}</div>
              <div style={{ ...T.micro, color: B.textSubtle, marginTop: '0.12rem', textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>
                {h.sub}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {visible.map((r, i) => (
          <ActionRow key={r.id} row={r} isMobile={isMobile} rank={i + 1} />
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ ...T.label, color: B.textMuted, padding: '1.75rem', textAlign: 'center' }}>
          No rows match these filters.
        </div>
      )}
    </div>
  );
}
