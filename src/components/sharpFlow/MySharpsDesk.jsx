/**
 * My Sharps — who to tail.
 * Same instrument as the date rail + Action rows. Verdict first, books as type.
 */
import React, { useState } from 'react';
import { ChevronDown, Star, Trash2 } from 'lucide-react';
import { fmtWalletTag } from '../../lib/mySharps.js';
import { rosterMatchesSection } from '../../lib/mySharpsDesk.js';

const B = {
  gold: '#D4AF37',
  goldDim: 'rgba(212, 175, 55, 0.12)',
  goldBorder: 'rgba(212, 175, 55, 0.32)',
  green: '#10B981',
  greenDim: 'rgba(16, 185, 129, 0.14)',
  red: '#EF4444',
  redDim: 'rgba(239, 68, 68, 0.12)',
  amber: '#F59E0B',
  amberDim: 'rgba(245, 158, 11, 0.12)',
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
  money: { fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', fontFeatureSettings: "'tnum'" },
  body: { fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.35 },
  micro: { fontSize: '0.68rem', fontWeight: 600, lineHeight: 1.3 },
  tiny: {
    fontSize: '0.58rem', fontWeight: 700, lineHeight: 1.25,
    letterSpacing: '0.16em', textTransform: 'uppercase',
  },
};

function sportColor(sport) {
  if (sport === 'MLB') return '#E31837';
  if (sport === 'NBA') return '#FF8C00';
  if (sport === 'WNBA') return '#F472B6';
  if (sport === 'NFL') return '#4CAF50';
  if (sport === 'SOC') return '#2ECC71';
  if (sport === 'UFC') return '#C0392B';
  if (sport === 'CBB') return '#FF6B35';
  if (sport === 'CFB') return '#BF5700';
  return B.gold;
}

function leanPaint(key) {
  if (key === 'tail') return { fg: B.green, bar: B.green, dim: B.greenDim };
  if (key === 'sit') return { fg: B.red, bar: B.red, dim: B.redDim };
  return { fg: B.gold, bar: B.gold, dim: B.goldDim };
}

function fmtVol(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n === 0) return null;
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function LockedState({ signedIn }) {
  return (
    <div style={{
      textAlign: 'center', padding: '2.4rem 1.5rem', borderRadius: 12,
      border: `1px solid ${B.border}`, background: B.card,
      marginBottom: '0.85rem',
    }}>
      <Star size={16} color={B.gold} style={{ marginBottom: 10 }} />
      <div style={{ ...T.name, color: B.text, fontSize: '1.05rem', marginBottom: 6 }}>My Sharps</div>
      <div style={{ ...T.body, color: B.textSec, maxWidth: 340, margin: '0 auto' }}>
        {signedIn
          ? 'Star a wallet on All Sharps. We keep their book, and whether to tail.'
          : 'Sign in to star wallets and keep a list of who to tail.'}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '2.2rem 1.4rem', borderRadius: 12,
      border: `1px solid ${B.border}`, background: B.card,
      marginBottom: '0.85rem',
    }}>
      <div style={{ ...T.name, color: B.text, fontSize: '1.05rem', marginBottom: 6 }}>Nobody on the desk</div>
      <div style={{ ...T.body, color: B.textSec }}>
        Star a wallet on All Sharps. They stay here across days.
      </div>
    </div>
  );
}

function VerdictRail({ dash, section, onSection, isMobile }) {
  const cells = [
    { id: 'tail', kicker: 'Tail', n: dash.lean?.tail || 0, live: dash.liveByLean?.tail?.n || 0, tone: B.green },
    { id: 'sit', kicker: 'Sit', n: dash.lean?.sit || 0, live: dash.liveByLean?.sit?.n || 0, tone: B.red },
    { id: 'hot', kicker: 'Hot', n: dash.heat?.hot || 0, live: 0, tone: B.green },
    { id: 'cold', kicker: 'Cold', n: dash.heat?.cold || 0, live: 0, tone: B.red },
  ];
  return (
    <div
      role="tablist"
      aria-label="Desk cut"
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
      {cells.map((c) => {
        const active = section === c.id;
        const lit = c.n > 0;
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSection(active ? 'action' : c.id)}
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
              fontWeight: 800,
              color: active ? B.gold : B.textSubtle,
            }}>
              {c.kicker}
            </span>
            <span style={{
              fontSize: isMobile ? '0.98rem' : '1.12rem',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontFeatureSettings: "'tnum'",
              fontVariantNumeric: 'tabular-nums',
              color: active ? '#E8D28A' : (lit ? c.tone : B.textSec),
            }}>
              {c.n}
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

function BookCol({ label, text }) {
  if (!text || text === '—') return null;
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ ...T.tiny, color: B.textSubtle, marginBottom: 5 }}>{label}</div>
      <div style={{
        ...T.body, fontWeight: 800, color: B.textSec,
        fontFeatureSettings: "'tnum'", letterSpacing: '-0.01em',
      }}>
        {text}
      </div>
    </div>
  );
}

function formBits(r) {
  const bits = [];
  if (r.heat?.key === 'hot' || r.heat?.key === 'cold') bits.push(r.heat.label);
  const l10 = r.form?.actionL10 || r.form?.l10;
  const l5 = r.form?.actionL5 || r.form?.l5;
  if (l10 && Number(l10.w) + Number(l10.l) > 0) bits.push(`L10 ${l10.w}–${l10.l}`);
  else if (l5 && Number(l5.w) + Number(l5.l) > 0) bits.push(`L5 ${l5.w}–${l5.l}`);
  if (r.clv?.priorClvPct != null) bits.push(`Beat close ${r.clv.priorClvPct}%`);
  return bits;
}

function SkillCard({ r, on, isMobile, onSelect, onRemove }) {
  const [hover, setHover] = useState(false);
  const paint = leanPaint(r.lean?.key);
  const live = fmtVol(r.openInvested);
  const bits = formBits(r);
  const books = (r.books || []).slice(0, 3);
  const sport = r.focusSport || r.sports[0] || '';

  const shell = {
    borderRadius: 12,
    border: `1px solid ${on || hover ? B.goldBorder : B.border}`,
    borderLeft: `3px solid ${on ? B.gold : paint.bar}`,
    background: on || hover
      ? `linear-gradient(105deg, ${B.cardHover} 0%, ${B.card} 70%)`
      : B.card,
    boxShadow: on || hover ? '0 10px 32px rgba(0,0,0,0.35)' : 'none',
    transition: 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease',
    overflow: 'hidden',
  };

  const identity = (
    <div style={{ minWidth: 0 }}>
      <div style={{
        ...T.name,
        color: paint.fg,
        fontSize: isMobile ? '1.15rem' : '1.2rem',
        letterSpacing: '0.02em',
      }}>
        {r.lean?.label || 'Watch'}
      </div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 5, flexWrap: 'wrap',
      }}>
        <span style={{
          ...T.body, fontWeight: 800, color: on ? B.gold : B.text,
          fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em',
        }}>
          {r.tag}
        </span>
        {sport ? (
          <span style={{ ...T.tiny, color: sportColor(sport), letterSpacing: '0.12em' }}>
            {sport}
          </span>
        ) : null}
        {r.sports.length > 1 ? (
          <span style={{ ...T.micro, color: B.textSubtle }}>
            {r.sports.filter((s) => s !== sport).join(' · ')}
          </span>
        ) : null}
      </div>
      {bits.length ? (
        <div style={{
          marginTop: 8,
          display: 'flex', flexWrap: 'wrap', alignItems: 'baseline',
          gap: '0.28rem 0.4rem',
          ...T.micro, color: B.textMuted, fontFeatureSettings: "'tnum'",
        }}>
          {bits.map((bit, i) => (
            <React.Fragment key={bit}>
              {i > 0 ? <span style={{ color: B.textSubtle, opacity: 0.55 }}>·</span> : null}
              <span style={{
                color: bit === 'Hot' ? B.green : bit === 'Cold' ? B.red : B.textMuted,
                fontWeight: bit === 'Hot' || bit === 'Cold' ? 800 : 600,
              }}>
                {bit}
              </span>
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );

  const bookRow = books.length ? (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(books.length, 3)}, minmax(0, 1fr))`,
      gap: isMobile ? 12 : 18,
      minWidth: 0,
    }}>
      {books.map((b) => (
        <BookCol
          key={`${b.sport}-${b.market}`}
          label={r.sports.length > 1 ? `${b.sport} ${b.label}` : b.label}
          text={b.honest?.text || `${b.wins}–${b.losses}`}
        />
      ))}
    </div>
  ) : (
    r.bookHonest?.text && r.bookHonest.text !== '—' ? (
      <BookCol label="Book" text={r.bookHonest.text} />
    ) : (
      <BookCol label="Book" text={r.l30Honest?.text && r.l30Honest.text !== '—' ? r.l30Honest.text : '—'} />
    )
  );

  const money = (
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <div style={{ ...T.money, color: live ? B.gold : B.textSubtle, fontSize: isMobile ? '1.25rem' : '1.35rem' }}>
        {live || '—'}
      </div>
      <div style={{ ...T.micro, color: B.textSubtle, marginTop: 4, fontFeatureSettings: "'tnum'" }}>
        {r.openN ? `${r.openN} live` : 'Quiet'}
      </div>
    </div>
  );

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={shell}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'stretch' }}>
        <button
          type="button"
          onClick={onSelect}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr auto' : 'minmax(168px, 0.9fr) minmax(210px, 1.4fr) auto',
            gap: isMobile ? 12 : '1.25rem',
            alignItems: 'center',
            padding: isMobile ? '1rem 0.85rem 0.95rem 1rem' : '1.1rem 1.1rem 1.1rem 1.25rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'inherit',
            minWidth: 0,
          }}
        >
          {identity}
          {isMobile ? money : bookRow}
          {isMobile ? null : money}
        </button>
        <button
          type="button"
          title="Remove from My Sharps"
          onClick={onRemove}
          style={{
            border: 'none',
            background: 'transparent',
            color: hover || on ? B.textMuted : B.textSubtle,
            padding: isMobile ? '0.9rem 0.75rem 0' : '0 1rem',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
      {isMobile && (books.length || (r.bookHonest?.text && r.bookHonest.text !== '—')) ? (
        <button
          type="button"
          onClick={onSelect}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            border: 'none', background: 'transparent', cursor: 'pointer',
            padding: '0 1rem 1rem', color: 'inherit',
          }}
        >
          {bookRow}
        </button>
      ) : null}
    </div>
  );
}

export default function MySharpsDesk({
  ready = false,
  signedIn = false,
  collapsed = false,
  onToggleCollapse,
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
  const summary = [
    d.lean?.tail ? `${d.lean.tail} tail` : null,
    d.lean?.sit ? `${d.lean.sit} sit` : null,
    d.lean?.watch ? `${d.lean.watch} watch` : null,
    d.actionN ? `${d.actionN} live` : null,
  ].filter(Boolean).join('  ·  ') || 'Quiet today';

  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <button
        type="button"
        onClick={onToggleCollapse}
        style={{
          display: 'flex', width: '100%', alignItems: 'baseline', gap: 12,
          padding: '0.15rem 0 0.7rem', border: 'none', background: 'transparent',
          cursor: 'pointer', color: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{
          ...T.tiny, color: B.gold, letterSpacing: '0.16em', flexShrink: 0,
        }}>
          My Sharps
        </span>
        <span style={{
          ...T.micro, color: B.textMuted, flex: 1, minWidth: 0,
          fontFeatureSettings: "'tnum'",
        }}>
          {scope === 'single' && focusShort
            ? fmtWalletTag(focusShort)
            : summary}
        </span>
        <ChevronDown
          size={15}
          color={B.textMuted}
          style={{
            transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 180ms ease',
            flexShrink: 0,
          }}
        />
      </button>

      {!collapsed && (
        <>
          <VerdictRail dash={d} section={section} onSection={onSection} isMobile={isMobile} />
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
          }}>
            {shown.length === 0 ? (
              <div style={{ ...T.body, color: B.textMuted, padding: '1.2rem 0', textAlign: 'center' }}>
                Nobody in this cut.
              </div>
            ) : shown.map((r) => (
              <SkillCard
                key={r.walletShort}
                r={r}
                on={scope === 'single' && focusShort === r.walletShort}
                isMobile={isMobile}
                onSelect={() => {
                  const same = focusShort === r.walletShort && scope === 'single';
                  onScope(same ? 'agg' : 'single');
                  onFocus(same ? null : r.walletShort);
                }}
                onRemove={() => onRemove(r.walletShort)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
