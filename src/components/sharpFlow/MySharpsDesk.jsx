/**
 * My Sharps control dashboard.
 * WSJ quote + Apple Fitness metric panel + MacroFactor person cards + the live book.
 */
import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import {
  buildDeskPulse,
  filterBoardTickets,
  sortMySharpsRoster,
  ticketPickLabel,
} from '../../lib/mySharpsDesk.js';

const B = {
  gold: '#D4AF37',
  goldSoft: '#E8D28A',
  green: '#10B981',
  red: '#EF4444',
  panel: '#151923',
  line: '#252B3B',
  hair: 'rgba(255,255,255,0.06)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textFaint: '#475569',
};

const T = {
  display: {
    fontSize: '2.55rem',
    fontWeight: 700,
    lineHeight: 0.95,
    letterSpacing: '-0.05em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  metric: {
    fontSize: '1.45rem',
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  pick: {
    fontSize: '1rem',
    fontWeight: 650,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  name: {
    fontSize: '0.92rem',
    fontWeight: 650,
    lineHeight: 1.2,
    letterSpacing: '-0.015em',
    fontFeatureSettings: "'tnum'",
  },
  label: {
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: B.textMuted,
  },
  body: { fontSize: '0.84rem', fontWeight: 500, lineHeight: 1.4 },
  meta: { fontSize: '0.74rem', fontWeight: 500, lineHeight: 1.35 },
};

function fmtVol(v, { signed = true } = {}) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const sign = !signed ? '' : (n < 0 ? '−' : (n > 0 ? '+' : ''));
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function matchup(t) {
  if (t.away && t.home) return `${t.away} @ ${t.home}`;
  return t.gameKey || '';
}

function ticketNote(t) {
  if (t.shared) return { text: 'together', tone: B.goldSoft };
  if (t.split) return { text: 'split', tone: B.red };
  if (t.opposed) return { text: 'vs field', tone: B.textMuted };
  if (t.sized) return { text: 'sized', tone: B.textMuted };
  return null;
}

function recentText(r) {
  const l10 = r.form?.actionL10 || r.form?.l10;
  const l5 = r.form?.actionL5 || r.form?.l5;
  if (l10 && Number(l10.w) + Number(l10.l) > 0) return `${l10.w}–${l10.l}`;
  if (l5 && Number(l5.w) + Number(l5.l) > 0) return `${l5.w}–${l5.l}`;
  return null;
}

function Spark({ points, width = 220, height = 48, up, color }) {
  if (!points || points.length < 3) return null;
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
  const stroke = color || (up ? B.green : B.red);
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden style={{ display: 'block' }}>
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AllocBar({ sports }) {
  const list = (sports || []).filter((s) => s.pct >= 4);
  if (!list.length) return null;
  return (
    <div>
      <div style={{ display: 'flex', height: 4, gap: 3, marginBottom: 8 }}>
        {list.map((s) => (
          <div key={s.sport} style={{ flex: Math.max(s.pct, 6), background: B.gold, opacity: 0.35 + (s.pct / 150) }} />
        ))}
      </div>
      <div style={{ ...T.meta, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
        {list.map((s) => `${s.sport} ${s.pct}%`).join('   ')}
      </div>
    </div>
  );
}

function LockedState({ signedIn }) {
  return (
    <div style={{ padding: '3rem 0 2.4rem' }}>
      <div style={{ ...T.display, fontSize: '1.4rem', color: B.text, marginBottom: 10 }}>
        {signedIn ? 'Star the wallets you trust.' : 'Sign in to keep a desk.'}
      </div>
      <div style={{ ...T.body, color: B.textMuted }}>
        {signedIn ? 'Then watch their book like a portfolio.' : 'Then star wallets on All Sharps.'}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: '3rem 0 2.4rem' }}>
      <div style={{ ...T.display, fontSize: '1.4rem', color: B.text, marginBottom: 10 }}>Nobody on the desk</div>
      <div style={{ ...T.body, color: B.textMuted }}>Switch to All Sharps and star a wallet.</div>
    </div>
  );
}

function Cell({ label, value, tone, sub, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      style={{
        border: 'none',
        background: 'transparent',
        padding: '0.85rem 0.2rem',
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        minWidth: 0,
        opacity: active === false ? 0.55 : 1,
      }}
    >
      <div style={T.label}>{label}</div>
      <div style={{ ...T.metric, color: tone || B.text, marginTop: 8 }}>{value}</div>
      {sub ? (
        <div style={{ ...T.meta, color: B.textMuted, marginTop: 6, fontFeatureSettings: "'tnum'" }}>{sub}</div>
      ) : null}
    </button>
  );
}

function DeskPanel({ pulse, filter, onFilter, isMobile }) {
  const l30 = pulse.l30;
  const recent = pulse.recent;
  const open = pulse.open || {};
  const l30Tone = Number.isFinite(l30?.pnl) ? (l30.pnl >= 0 ? B.green : B.red) : B.text;
  return (
    <div style={{
      background: B.panel,
      border: `1px solid ${B.line}`,
      borderRadius: 16,
      padding: isMobile ? '0.85rem 1rem 0.55rem' : '0.95rem 1.25rem 0.65rem',
    }}>
      <div style={{ ...T.label, marginBottom: 4 }}>Desk</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: isMobile ? 12 : 28,
      }}>
        <Cell
          label="L30"
          value={Number.isFinite(l30?.pnl) ? fmtVol(l30.pnl) : (l30?.honest?.record || '—')}
          tone={l30Tone}
          sub={l30?.honest?.text && Number.isFinite(l30?.pnl) ? l30.honest.text : null}
        />
        <Cell
          label="Open"
          value={open.n ? fmtVol(open.invested, { signed: false }) : 'Quiet'}
          tone={open.n ? B.goldSoft : B.textFaint}
          sub={open.n ? `${open.n} tickets` : null}
          onClick={() => onFilter(null)}
          active={!filter}
        />
        <Cell
          label="Recent"
          value={recent?.honest?.record && recent.honest.record !== '—' ? recent.honest.record : '—'}
          sub={Number.isFinite(recent?.pnl) ? fmtVol(recent.pnl) : null}
        />
        <Cell
          label="Field"
          value={pulse.canOverlap ? `${pulse.fightN || 0} vs` : '—'}
          tone={pulse.fightN ? B.red : B.textSec}
          sub={pulse.canOverlap ? `${pulse.agreeN || 0} together` : 'Need 2+ wallets'}
          onClick={pulse.canOverlap ? () => onFilter(filter === 'fight' ? null : 'fight') : null}
          active={filter === 'fight'}
        />
      </div>
      {pulse.sports?.length ? (
        <div style={{ padding: '0.35rem 0.2rem 0.85rem', borderTop: `1px solid ${B.hair}` }}>
          <div style={{ ...T.label, marginBottom: 10 }}>Sports</div>
          <AllocBar sports={pulse.sports} />
        </div>
      ) : null}
    </div>
  );
}

function PersonCard({ r, on, onFocus, onRemove, isMobile }) {
  const spark = r.spark || r.form?.spark;
  const up = Number.isFinite(r.l30?.pnl) ? r.l30.pnl >= 0 : (spark ? spark[spark.length - 1] >= 0 : true);
  const rec = recentText(r);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onFocus(r.walletShort)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFocus(r.walletShort);
        }
      }}
      style={{
        position: 'relative',
        background: B.panel,
        border: `1px solid ${on ? 'rgba(212,175,55,0.45)' : B.line}`,
        borderRadius: 16,
        padding: isMobile ? '1rem 1.05rem 1rem' : '1.1rem 1.2rem 1.05rem',
        cursor: 'pointer',
      }}
    >
      <button
        type="button"
        aria-label={`Remove ${r.tag}`}
        onClick={(e) => { e.stopPropagation(); onRemove(r.walletShort); }}
        style={{
          position: 'absolute', top: 10, right: 10,
          border: 'none', background: 'transparent', color: B.textFaint,
          cursor: 'pointer', width: 26, height: 26, display: 'grid', placeItems: 'center',
        }}
      >
        <X size={13} />
      </button>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, paddingRight: 22 }}>
        <div style={{ ...T.name, color: B.text }}>{r.tag}</div>
        <div style={{ ...T.meta, color: B.textMuted }}>{r.lean?.label || 'Watch'}</div>
        <div style={{ ...T.meta, color: B.textFaint }}>{r.focusSport || r.sports?.[0] || ''}</div>
      </div>
      {spark ? (
        <div style={{ margin: '14px 0 12px' }}>
          <Spark points={spark} width={260} height={44} up={up} />
        </div>
      ) : (
        <div style={{ height: 20 }} />
      )}
      <div style={{
        ...T.metric,
        fontSize: '1.35rem',
        color: Number.isFinite(r.l30?.pnl) ? (r.l30.pnl >= 0 ? B.green : B.red) : B.textFaint,
      }}
      >
        {Number.isFinite(r.l30?.pnl) ? fmtVol(r.l30.pnl) : (r.l30Honest?.text || '—')}
      </div>
      <div style={{ ...T.meta, color: B.textMuted, marginTop: 7, fontFeatureSettings: "'tnum'" }}>
        {r.l30Honest?.text && r.l30Honest.text !== '—' ? r.l30Honest.text : 'Thin book'}
        {rec ? `  ·  ${rec} recent` : ''}
        {r.openN ? `  ·  ${r.openN} live` : ''}
      </div>
    </div>
  );
}

function Ticket({ t, onFocus, isMobile }) {
  const note = ticketNote(t);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? 'minmax(0, 1fr) auto' : 'minmax(0, 1.5fr) minmax(0, 1fr) auto',
      gap: 14,
      alignItems: 'baseline',
      padding: '0.85rem 0.15rem',
      borderBottom: `1px solid ${B.hair}`,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ ...T.pick, color: B.text }}>{ticketPickLabel(t)}</div>
        <div style={{ ...T.meta, color: B.textFaint, marginTop: 4 }}>
          {t.sport ? `${t.sport} · ` : ''}{matchup(t)}
        </div>
      </div>
      {isMobile ? null : (
        <div style={{ ...T.meta, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
          {t.tags.map((tag, i) => (
            <button
              key={t.shorts[i] || tag}
              type="button"
              onClick={() => onFocus(t.shorts[i])}
              style={{
                border: 'none', background: 'transparent', padding: 0,
                color: B.textMuted, cursor: 'pointer', marginRight: 12, font: 'inherit',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...T.name, color: B.goldSoft }}>{fmtVol(t.invested, { signed: false })}</div>
        <div style={{ ...T.meta, color: note?.tone || B.textFaint, marginTop: 4 }}>
          {note?.text || ''}
        </div>
      </div>
    </div>
  );
}

export default function MySharpsDesk({
  ready = false,
  signedIn = false,
  focusShort = null,
  onFocus,
  roster = [],
  board = null,
  actionRows = [],
  recentLegs = [],
  onRemove,
  isMobile = false,
}) {
  const [pulseWindow, setPulseWindow] = useState('l30');
  const [filter, setFilter] = useState(null);

  const pulse = useMemo(
    () => buildDeskPulse({
      roster,
      board: board || { tickets: [] },
      actionRows,
      recentLegs,
      focusShort,
      window: pulseWindow,
    }),
    [roster, board, actionRows, recentLegs, focusShort, pulseWindow],
  );

  const people = useMemo(
    () => sortMySharpsRoster(roster, 'open', 'asc'),
    [roster],
  );

  const tickets = useMemo(
    () => filterBoardTickets(board || { tickets: [] }, { focusShort, filter }),
    [board, focusShort, filter],
  );

  if (!ready) return <LockedState signedIn={signedIn} />;
  if (!roster.length) return <EmptyState />;

  const focused = focusShort ? roster.find((r) => r.walletShort === focusShort) : null;
  const hero = pulse.hero || {};
  const pnl = hero.hasPnl ? hero.pnl : null;
  const heroNum = hero.hasPnl
    ? fmtVol(pnl)
    : (hero.honest?.record && hero.honest.record !== '—' ? hero.honest.record : '—');
  const heroTone = hero.hasPnl ? (pnl > 0 ? B.green : pnl < 0 ? B.red : B.text) : B.text;
  const heroSpark = focused?.spark || focused?.form?.spark;
  const sparkUp = Number.isFinite(focused?.l30?.pnl)
    ? focused.l30.pnl >= 0
    : (heroSpark ? heroSpark[heroSpark.length - 1] >= 0 : true);

  const setFocus = (short) => {
    if (!short) {
      onFocus?.(null);
      return;
    }
    onFocus?.(focusShort === short ? null : short);
  };

  return (
    <div style={{ margin: '0.2rem 0 2.8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginBottom: 14 }}>
        {focused ? (
          <button
            type="button"
            onClick={() => onFocus?.(null)}
            style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', ...T.meta, color: B.textMuted }}
          >
            Desk
          </button>
        ) : null}
        {['recent', 'l30'].map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setPulseWindow(id)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              ...T.meta,
              color: pulseWindow === id ? B.text : B.textFaint,
              fontWeight: pulseWindow === id ? 650 : 500,
            }}
          >
            {id === 'l30' ? 'L30' : 'Recent'}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: (heroSpark && !isMobile) ? 'minmax(0, 1fr) minmax(160px, 280px)' : '1fr',
        gap: 20,
        alignItems: 'end',
        marginBottom: 22,
      }}>
        <div>
          {focused ? (
            <div style={{ ...T.meta, color: B.textMuted, marginBottom: 8 }}>{focused.tag}</div>
          ) : null}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ ...T.display, color: heroTone, fontSize: isMobile ? '2.1rem' : '2.55rem' }}>{heroNum}</span>
            {hero.hasPnl && hero.honest?.text && hero.honest.text !== '—' ? (
              <span style={{ ...T.body, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>{hero.honest.text}</span>
            ) : null}
          </div>
        </div>
        {heroSpark ? <Spark points={heroSpark} width={280} height={56} up={sparkUp} /> : null}
      </div>

      <DeskPanel pulse={pulse} filter={filter} onFilter={setFilter} isMobile={isMobile} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile || people.length === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))',
        gap: 10,
        marginTop: 10,
      }}>
        {people.map((r) => (
          <PersonCard
            key={r.walletShort}
            r={r}
            on={focusShort === r.walletShort}
            onFocus={setFocus}
            onRemove={(short) => {
              if (focusShort === short) onFocus?.(null);
              onRemove?.(short);
            }}
            isMobile={isMobile}
          />
        ))}
      </div>

      <div style={{
        background: B.panel,
        border: `1px solid ${B.line}`,
        borderRadius: 16,
        padding: isMobile ? '0.95rem 1rem 0.55rem' : '1.05rem 1.25rem 0.7rem',
        marginTop: 10,
      }}>
        <div style={{ ...T.label, marginBottom: 6 }}>Now</div>
        {tickets.length ? tickets.map((t) => (
          <Ticket key={t.id} t={t} onFocus={setFocus} isMobile={isMobile} />
        )) : (
          <div style={{ ...T.body, color: B.textMuted, padding: '0.7rem 0 0.5rem' }}>
            None of yours are on this slate.
          </div>
        )}
      </div>
    </div>
  );
}
