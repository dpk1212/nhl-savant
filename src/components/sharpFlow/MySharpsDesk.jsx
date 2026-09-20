/**
 * My Sharps desk — who to tail.
 * Copy-trader grid (Binance / Fey): person first, one number, quiet book.
 * Plays stay off this page.
 */
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { fmtWalletTag } from '../../lib/mySharps.js';
import { rosterMatchesSection } from '../../lib/mySharpsDesk.js';

const B = {
  gold: '#D4AF37',
  goldSoft: '#E8D28A',
  goldDim: 'rgba(212, 175, 55, 0.12)',
  goldLine: 'rgba(212, 175, 55, 0.38)',
  green: '#3DDC97',
  red: '#F07167',
  ink: '#0B0D12',
  panel: '#10141C',
  line: 'rgba(255,255,255,0.06)',
  text: '#F3F1EA',
  textSec: '#B7B3A7',
  textMuted: '#7A776E',
  textFaint: '#534F47',
};

const T = {
  display: {
    fontSize: '1.65rem',
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '-0.04em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  name: {
    fontSize: '0.95rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    fontFeatureSettings: "'tnum'",
  },
  body: { fontSize: '0.8rem', fontWeight: 500, lineHeight: 1.4 },
  meta: { fontSize: '0.72rem', fontWeight: 500, lineHeight: 1.35 },
  kicker: {
    fontSize: '0.62rem',
    fontWeight: 650,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
};

function sportColor(sport) {
  if (sport === 'MLB') return '#E31837';
  if (sport === 'NBA') return '#FF8C00';
  if (sport === 'WNBA') return '#F472B6';
  if (sport === 'NFL') return '#6FBF73';
  if (sport === 'SOC') return '#2ECC71';
  if (sport === 'UFC') return '#C0392B';
  if (sport === 'CBB') return '#FF6B35';
  if (sport === 'CFB') return '#BF5700';
  return B.gold;
}

function leanColor(key) {
  if (key === 'tail') return B.green;
  if (key === 'sit') return B.red;
  return B.goldSoft;
}

function fmtVol(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const abs = Math.abs(n);
  const sign = n < 0 ? '−' : '+';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function heroFor(r) {
  if (Number.isFinite(r.l30?.pnl)) {
    return { value: fmtVol(r.l30.pnl), tone: r.l30.pnl >= 0 ? B.green : B.red, label: 'L30' };
  }
  if (r.bookHonest?.text && r.bookHonest.text !== '—') {
    return { value: r.bookHonest.text, tone: B.text, label: 'Book' };
  }
  if (r.l30Honest?.text && r.l30Honest.text !== '—') {
    return { value: r.l30Honest.text, tone: B.text, label: 'L30' };
  }
  return { value: '—', tone: B.textFaint, label: '' };
}

function formBits(r) {
  const bits = [];
  if (r.heat?.key === 'hot' || r.heat?.key === 'cold') bits.push(r.heat.label);
  const l10 = r.form?.actionL10 || r.form?.l10;
  const l5 = r.form?.actionL5 || r.form?.l5;
  if (l10 && Number(l10.w) + Number(l10.l) > 0) bits.push(`L10 ${l10.w}–${l10.l}`);
  else if (l5 && Number(l5.w) + Number(l5.l) > 0) bits.push(`L5 ${l5.w}–${l5.l}`);
  if (r.clv?.priorClvPct != null) bits.push(`Close ${r.clv.priorClvPct}%`);
  return bits;
}

function Spark({ points, width = 88, height = 28, up }) {
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
  const last = pts[pts.length - 1];
  const fill = `${d} L${last.x.toFixed(1)},${height} L${pts[0].x.toFixed(1)},${height} Z`;
  const stroke = up ? B.green : B.red;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden style={{ display: 'block' }}>
      <path d={fill} fill={stroke} opacity="0.12" />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockedState({ signedIn }) {
  return (
    <div style={{ padding: '3.2rem 0 2.4rem', textAlign: 'left' }}>
      <div style={{ ...T.kicker, color: B.gold, marginBottom: 12 }}>My Sharps</div>
      <div style={{ ...T.display, color: B.text, fontSize: '1.35rem', marginBottom: 10 }}>
        {signedIn ? 'Star the wallets you trust.' : 'Sign in to keep a desk.'}
      </div>
      <div style={{ ...T.body, color: B.textMuted, maxWidth: 360 }}>
        {signedIn
          ? 'Their book, heat, and whether to tail. Premium keeps the list across days.'
          : 'Then star wallets on All Sharps.'}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: '3.2rem 0 2.4rem' }}>
      <div style={{ ...T.kicker, color: B.gold, marginBottom: 12 }}>My Sharps</div>
      <div style={{ ...T.display, color: B.text, fontSize: '1.35rem', marginBottom: 10 }}>
        Nobody on the desk
      </div>
      <div style={{ ...T.body, color: B.textMuted }}>
        Switch to All Sharps and star a wallet.
      </div>
    </div>
  );
}

function CutTabs({ section, onSection, counts }) {
  const tabs = [
    { id: 'action', label: 'All', n: counts.all },
    { id: 'tail', label: 'Tail', n: counts.tail },
    { id: 'sit', label: 'Sit', n: counts.sit },
    { id: 'hot', label: 'Hot', n: counts.hot },
  ];
  return (
    <div role="tablist" aria-label="Desk cut" style={{ display: 'flex', gap: 22, borderBottom: `1px solid ${B.line}` }}>
      {tabs.map((t) => {
        const on = section === t.id || (t.id === 'action' && (section === 'action' || !section));
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onSection(t.id)}
            style={{
              ...T.kicker,
              border: 'none',
              background: 'transparent',
              padding: '0 0 0.85rem',
              cursor: 'pointer',
              color: on ? B.goldSoft : B.textFaint,
              position: 'relative',
            }}
          >
            {t.label}
            <span style={{ marginLeft: 8, fontFeatureSettings: "'tnum'", letterSpacing: 0, textTransform: 'none', fontWeight: 600 }}>
              {t.n}
            </span>
            {on ? (
              <span style={{
                position: 'absolute', left: 0, right: 0, bottom: -1, height: 1,
                background: B.gold,
              }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function Stat({ label, children }) {
  return (
    <div>
      <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 8 }}>{label}</div>
      <div style={{ ...T.body, color: B.textSec, fontFeatureSettings: "'tnum'" }}>{children}</div>
    </div>
  );
}

function TraderCard({ r, on, isMobile, onSelect, onRemove }) {
  const [hover, setHover] = useState(false);
  const hero = heroFor(r);
  const bits = formBits(r);
  const sport = r.focusSport || r.sports[0] || '';
  const spark = r.spark || r.form?.spark;
  const up = Number.isFinite(r.l30?.pnl) ? r.l30.pnl >= 0 : (spark ? spark[spark.length - 1] >= spark[0] : true);
  const kill = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: on ? 'rgba(212,175,55,0.06)' : B.panel,
        outline: on ? `1px solid ${B.goldLine}` : `1px solid ${B.line}`,
        padding: isMobile ? '1.15rem 1.1rem 1.05rem' : '1.25rem 1.2rem 1.1rem',
        minHeight: 196,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'outline-color 160ms ease, background 160ms ease',
      }}
    >
      <button
        type="button"
        data-my-sharps-remove={r.walletShort}
        aria-label={`Remove ${r.tag}`}
        title="Remove"
        onMouseDown={kill}
        onPointerDown={kill}
        onClick={(e) => { kill(e); onRemove(); }}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 4,
          width: 28,
          height: 28,
          border: 'none',
          background: 'transparent',
          color: hover || on ? B.textMuted : B.textFaint,
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <X size={14} />
      </button>

      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, paddingRight: 18 }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
          <span style={{ ...T.name, color: B.text }}>{r.tag}</span>
          {sport ? (
            <span style={{ ...T.kicker, color: sportColor(sport), letterSpacing: '0.12em' }}>{sport}</span>
          ) : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 6 }}>{hero.label}</div>
            <div style={{ ...T.display, color: hero.tone, fontSize: isMobile ? '1.45rem' : '1.7rem' }}>
              {hero.value}
            </div>
          </div>
          <Spark points={spark} up={up} />
        </div>

        <div style={{ ...T.meta, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
          {bits.length ? bits.join('   ') : 'Thin book'}
        </div>

        {r.books?.length ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(r.books.length, 3)}, minmax(0, 1fr))`,
            gap: 12,
          }}>
            {r.books.slice(0, 3).map((b) => (
              <div key={`${b.sport}-${b.market}`}>
                <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 4 }}>{b.label}</div>
                <div style={{ ...T.meta, color: B.textSec, fontFeatureSettings: "'tnum'", fontWeight: 650 }}>
                  {b.honest?.text || `${b.wins}–${b.losses}`}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 4 }}>
          <span style={{
            ...T.kicker,
            color: leanColor(r.lean?.key),
            letterSpacing: '0.16em',
          }}>
            {r.lean?.label || 'Watch'}
          </span>
          <span style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'" }}>
            {r.openN ? `${r.openN} live` : 'Quiet'}
          </span>
        </div>
      </div>
    </div>
  );
}

function Focused({ r, isMobile, onClear }) {
  const hero = heroFor(r);
  const spark = r.spark || r.form?.spark;
  const up = Number.isFinite(r.l30?.pnl) ? r.l30.pnl >= 0 : true;
  const sport = r.focusSport || r.sports[0] || '';
  const l10 = r.form?.actionL10 || r.form?.l10;
  const l5 = r.form?.actionL5 || r.form?.l5;
  return (
    <div style={{
      padding: isMobile ? '1.4rem 0 1.6rem' : '1.7rem 0 1.9rem',
      borderBottom: `1px solid ${B.line}`,
      marginBottom: 22,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ ...T.display, fontSize: isMobile ? '1.35rem' : '1.55rem', color: B.text }}>{r.tag}</span>
            {sport ? <span style={{ ...T.kicker, color: sportColor(sport) }}>{sport}</span> : null}
            <span style={{ ...T.kicker, color: leanColor(r.lean?.key) }}>{r.lean?.label}</span>
          </div>
          {r.sports.length > 1 ? (
            <div style={{ ...T.meta, color: B.textFaint, marginTop: 8 }}>{r.sports.join('  ·  ')}</div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClear}
          style={{
            ...T.kicker, border: 'none', background: 'transparent',
            color: B.textMuted, cursor: 'pointer', padding: 0,
          }}
        >
          All
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
        gap: isMobile ? 22 : 48,
        alignItems: 'end',
        marginBottom: 28,
      }}>
        <div>
          <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 8 }}>{hero.label}</div>
          <div style={{ ...T.display, color: hero.tone, fontSize: isMobile ? '2rem' : '2.4rem' }}>{hero.value}</div>
        </div>
        <Spark points={spark} width={isMobile ? 220 : 320} height={56} up={up} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, minmax(0, 1fr))',
        gap: isMobile ? 22 : 36,
      }}>
        <Stat label="Book">
          {r.bookHonest?.text && r.bookHonest.text !== '—' ? r.bookHonest.text : '—'}
          {r.book?.roi != null && r.bookHonest?.showPct ? (
            <div style={{ color: r.book.roi >= 0 ? B.green : B.red, marginTop: 6 }}>
              {r.book.roi >= 0 ? '+' : ''}{r.book.roi}% ROI
            </div>
          ) : null}
        </Stat>
        <Stat label="Form">
          {l10 && Number(l10.w) + Number(l10.l) > 0 ? `L10  ${l10.w}–${l10.l}` : '—'}
          {l5 && Number(l5.w) + Number(l5.l) > 0 ? (
            <div style={{ marginTop: 6, color: B.textMuted }}>L5  {l5.w}–{l5.l}</div>
          ) : null}
          {r.heat?.key === 'hot' || r.heat?.key === 'cold' ? (
            <div style={{ marginTop: 6, color: r.heat.key === 'hot' ? B.green : B.red }}>{r.heat.label}</div>
          ) : null}
        </Stat>
        <Stat label="Markets">
          {r.books?.length
            ? r.books.map((b) => (
              <div key={`${b.sport}-${b.market}`} style={{ marginBottom: 6 }}>
                {b.label}  {b.honest?.text || `${b.wins}–${b.losses}`}
              </div>
            ))
            : '—'}
          {r.clv?.priorClvPct != null ? (
            <div style={{ marginTop: 6, color: B.goldSoft }}>Beat close {r.clv.priorClvPct}%</div>
          ) : null}
        </Stat>
      </div>
    </div>
  );
}

export default function MySharpsDesk({
  ready = false,
  signedIn = false,
  scope = 'agg',
  onScope,
  focusShort = null,
  onFocus,
  section = 'action',
  onSection,
  roster = [],
  dash = null,
  onRemove,
  isMobile = false,
}) {
  if (!ready) return <LockedState signedIn={signedIn} />;
  if (!roster.length) return <EmptyState />;

  const d = dash || {};
  const shown = roster.filter((r) => rosterMatchesSection(r, section));
  const focused = focusShort ? roster.find((r) => r.walletShort === focusShort) : null;
  const grid = focused ? shown.filter((r) => r.walletShort !== focused.walletShort) : shown;

  return (
    <div style={{ margin: '0.35rem 0 2.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
        <div>
          <div style={{ ...T.kicker, color: B.gold, marginBottom: 8 }}>My Sharps</div>
          <div style={{ ...T.body, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
            {d.walletN} {d.walletN === 1 ? 'wallet' : 'wallets'}
            {d.lean?.tail ? `  ·  ${d.lean.tail} to tail` : ''}
            {d.lean?.sit ? `  ·  ${d.lean.sit} to sit` : ''}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <CutTabs
          section={section}
          onSection={onSection}
          counts={{
            all: roster.length,
            tail: d.lean?.tail || 0,
            sit: d.lean?.sit || 0,
            hot: d.heat?.hot || 0,
          }}
        />
      </div>

      {focused ? (
        <Focused
          r={focused}
          isMobile={isMobile}
          onClear={() => {
            onScope('agg');
            onFocus(null);
          }}
        />
      ) : null}

      {shown.length === 0 ? (
        <div style={{ ...T.body, color: B.textMuted, padding: '1.6rem 0' }}>Nobody in this cut.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 1,
          background: B.line,
          outline: `1px solid ${B.line}`,
        }}>
          {(focused ? grid : shown).map((r) => (
            <TraderCard
              key={r.walletShort}
              r={r}
              on={scope === 'single' && focusShort === r.walletShort}
              isMobile={isMobile}
              onSelect={() => {
                const same = focusShort === r.walletShort && scope === 'single';
                onScope(same ? 'agg' : 'single');
                onFocus(same ? null : r.walletShort);
              }}
              onRemove={() => {
                if (focusShort === r.walletShort) {
                  onScope('agg');
                  onFocus(null);
                }
                onRemove?.(r.walletShort);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
