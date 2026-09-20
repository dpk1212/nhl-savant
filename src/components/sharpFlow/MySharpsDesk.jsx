/**
 * My Sharps — one number, the live book, then the people.
 * Fey / Monarch: no label farm, no twin KPIs, gold only on live $.
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
  line: 'rgba(255,255,255,0.06)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textFaint: '#475569',
};

const T = {
  display: {
    fontSize: '2.6rem',
    fontWeight: 700,
    lineHeight: 0.95,
    letterSpacing: '-0.05em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  pick: {
    fontSize: '1.02rem',
    fontWeight: 650,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  name: {
    fontSize: '0.92rem',
    fontWeight: 650,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    fontFeatureSettings: "'tnum'",
  },
  body: { fontSize: '0.86rem', fontWeight: 500, lineHeight: 1.45 },
  meta: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.4 },
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

function sportLine(sports) {
  return (sports || []).filter((s) => s.pct >= 8).map((s) => s.sport);
}

function LockedState({ signedIn }) {
  return (
    <div style={{ padding: '3.4rem 0 2.6rem' }}>
      <div style={{ ...T.display, fontSize: '1.45rem', color: B.text, marginBottom: 10 }}>
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
    <div style={{ padding: '3.4rem 0 2.6rem' }}>
      <div style={{ ...T.display, fontSize: '1.45rem', color: B.text, marginBottom: 10 }}>
        Nobody on the desk
      </div>
      <div style={{ ...T.body, color: B.textMuted }}>Switch to All Sharps and star a wallet.</div>
    </div>
  );
}

function Hero({ pulse, focused, window, onWindow, onClear, onFilter, filter, isMobile }) {
  const hero = pulse.hero || {};
  const pnl = hero.hasPnl ? hero.pnl : null;
  const num = hero.hasPnl
    ? fmtVol(pnl)
    : (hero.honest?.record && hero.honest.record !== '—' ? hero.honest.record : '—');
  const tone = hero.hasPnl
    ? (pnl > 0 ? B.green : pnl < 0 ? B.red : B.text)
    : B.text;
  const rec = hero.hasPnl && hero.honest?.text && hero.honest.text !== '—'
    ? hero.honest.text
    : null;
  const sports = sportLine(pulse.sports);
  const liveBits = [];
  if (pulse.open?.n) liveBits.push(`${pulse.open.n} live · ${fmtVol(pulse.open.invested, { signed: false })}`);
  else liveBits.push('Quiet slate');
  if (pulse.canOverlap && pulse.fightN > 0) liveBits.push(`${pulse.fightN} vs field`);
  else if (pulse.canOverlap && pulse.agreeN > 0) liveBits.push(`${pulse.agreeN} together`);
  if (sports.length > 1) liveBits.push(sports.join(' · '));

  return (
    <div style={{ padding: isMobile ? '0.15rem 0 1.8rem' : '0.2rem 0 2.1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 18, marginBottom: 18 }}>
        {focused ? (
          <button
            type="button"
            onClick={onClear}
            style={{
              border: 'none', background: 'transparent', padding: 0,
              color: B.textMuted, cursor: 'pointer', ...T.meta,
            }}
          >
            All
          </button>
        ) : null}
        {['recent', 'l30'].map((id) => {
          const on = window === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onWindow(id)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer',
                color: on ? B.text : B.textFaint,
                ...T.meta,
                fontWeight: on ? 650 : 500,
              }}
            >
              {id === 'l30' ? 'L30' : 'Recent'}
            </button>
          );
        })}
      </div>

      <div style={{ ...T.display, color: tone, fontSize: isMobile ? '2.1rem' : '2.7rem' }}>
        {focused ? <span style={{ ...T.name, color: B.textSec, display: 'block', marginBottom: 10 }}>{focused.tag}</span> : null}
        {num}
      </div>
      <div style={{ ...T.body, color: B.textMuted, marginTop: 10, fontFeatureSettings: "'tnum'" }}>
        {rec || (window === 'recent' ? 'Recent book' : 'Last 30')}
      </div>
      <div style={{ ...T.body, color: B.textSec, marginTop: 8, fontFeatureSettings: "'tnum'" }}>
        <button
          type="button"
          onClick={() => onFilter(null)}
          style={{
            border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
            color: !filter ? B.goldSoft : B.textSec, font: 'inherit', fontFeatureSettings: "'tnum'",
          }}
        >
          {liveBits[0]}
        </button>
        {liveBits.slice(1).map((bit, i) => {
          const fight = bit.includes('vs field');
          const together = bit.includes('together');
          return (
            <span key={bit}>
              <span style={{ color: B.textFaint }}>  ·  </span>
              <button
                type="button"
                onClick={() => {
                  if (fight) onFilter(filter === 'fight' ? null : 'fight');
                  else if (together) onFilter(filter === 'agree' ? null : 'agree');
                }}
                style={{
                  border: 'none', background: 'transparent', padding: 0,
                  cursor: (fight || together) ? 'pointer' : 'default',
                  color: (fight && filter === 'fight') || (together && filter === 'agree')
                    ? B.goldSoft
                    : B.textSec,
                  font: 'inherit',
                  fontFeatureSettings: "'tnum'",
                }}
              >
                {bit}
              </button>
            </span>
          );
        })}
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
      gap: isMobile ? 10 : 20,
      alignItems: 'baseline',
      padding: '0.95rem 0',
      borderBottom: `1px solid ${B.line}`,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ ...T.pick, color: B.text }}>{ticketPickLabel(t)}</div>
        <div style={{ ...T.meta, color: B.textFaint, marginTop: 5 }}>
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
        <div style={{ ...T.meta, color: note?.tone || B.textFaint, marginTop: 5 }}>
          {isMobile ? t.tags.join('  ') : null}
          {isMobile && note ? '  ·  ' : ''}
          {note?.text || ''}
        </div>
      </div>
    </div>
  );
}

function Person({ r, on, onFocus, onRemove }) {
  const rec = recentText(r);
  const [hover, setHover] = useState(false);
  const meta = [
    r.focusSport || r.sports?.[0],
    r.lean?.label,
    rec,
    r.openN ? `${r.openN} live` : null,
  ].filter(Boolean).join('  ·  ');

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 16,
        padding: '0.9rem 1.6rem 0.9rem 0',
        borderBottom: `1px solid ${B.line}`,
        background: on ? 'rgba(212,175,55,0.05)' : 'transparent',
      }}
    >
      <button
        type="button"
        onClick={() => onFocus(r.walletShort)}
        style={{
          border: 'none', background: 'transparent', padding: 0,
          textAlign: 'left', cursor: 'pointer', minWidth: 0, flex: 1,
        }}
      >
        <div style={{ ...T.name, color: B.text }}>{r.tag}</div>
        <div style={{ ...T.meta, color: B.textFaint, marginTop: 5, fontFeatureSettings: "'tnum'" }}>{meta}</div>
      </button>
      <button
        type="button"
        onClick={() => onFocus(r.walletShort)}
        style={{
          border: 'none', background: 'transparent', padding: 0,
          textAlign: 'right', cursor: 'pointer',
        }}
      >
        <div style={{
          ...T.name,
          color: Number.isFinite(r.l30?.pnl)
            ? (r.l30.pnl >= 0 ? B.green : B.red)
            : B.textFaint,
        }}
        >
          {Number.isFinite(r.l30?.pnl) ? fmtVol(r.l30.pnl) : (r.l30Honest?.text || '—')}
        </div>
      </button>
      <button
        type="button"
        aria-label={`Remove ${r.tag}`}
        onClick={(e) => { e.stopPropagation(); onRemove(r.walletShort); }}
        style={{
          position: 'absolute',
          top: 12,
          right: -4,
          border: 'none',
          background: 'transparent',
          color: hover || on ? B.textMuted : 'transparent',
          cursor: 'pointer',
          width: 24,
          height: 24,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <X size={13} />
      </button>
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
  const setFocus = (short) => {
    if (!short) {
      onFocus?.(null);
      return;
    }
    onFocus?.(focusShort === short ? null : short);
  };

  return (
    <div style={{ margin: '0.15rem 0 2.8rem' }}>
      <Hero
        pulse={pulse}
        focused={focused}
        window={pulseWindow}
        onWindow={setPulseWindow}
        onClear={() => onFocus?.(null)}
        onFilter={setFilter}
        filter={filter}
        isMobile={isMobile}
      />

      <div>
        {tickets.length ? tickets.map((t) => (
          <Ticket key={t.id} t={t} onFocus={setFocus} isMobile={isMobile} />
        )) : (
          <div style={{ ...T.body, color: B.textMuted, padding: '0.4rem 0 0.2rem' }}>
            None of yours are on this slate.
          </div>
        )}
      </div>

      <div style={{ marginTop: tickets.length ? 36 : 28 }}>
        {people.map((r) => (
          <Person
            key={r.walletShort}
            r={r}
            on={focusShort === r.walletShort}
            onFocus={setFocus}
            onRemove={(short) => {
              if (focusShort === short) onFocus?.(null);
              onRemove?.(short);
            }}
          />
        ))}
      </div>
    </div>
  );
}
