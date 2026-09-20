/**
 * My Sharps desk — portfolio control room.
 * Pulse first. Roster ranks the book. Board is what they have open.
 */
import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import {
  buildDeskPulse,
  filterBoardTickets,
  sortMySharpsRoster,
} from '../../lib/mySharpsDesk.js';

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
    fontSize: '2.35rem',
    fontWeight: 700,
    lineHeight: 0.95,
    letterSpacing: '-0.045em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  name: {
    fontSize: '0.92rem',
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

function fmtVol(v, { signed = true } = {}) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const sign = !signed ? '' : (n < 0 ? '−' : (n > 0 ? '+' : ''));
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function recentText(r) {
  const l10 = r.form?.actionL10 || r.form?.l10;
  const l5 = r.form?.actionL5 || r.form?.l5;
  if (l10 && Number(l10.w) + Number(l10.l) > 0) return `${l10.w}–${l10.l}`;
  if (l5 && Number(l5.w) + Number(l5.l) > 0) return `${l5.w}–${l5.l}`;
  return '—';
}

function matchup(t) {
  if (t.away && t.home) return `${t.away} @ ${t.home}`;
  return t.team || t.gameKey || '—';
}

function ticketTitle(t) {
  const pick = t.marketLabel || t.team || t.side;
  return pick || '—';
}

function kindTone(kind) {
  if (kind === 'shared') return B.goldSoft;
  if (kind === 'split' || kind === 'opposed') return B.red;
  if (kind === 'standout') return B.green;
  return B.textMuted;
}

function kindLabel(t) {
  if (t.shared) return 'Shared';
  if (t.split) return 'Split';
  if (t.opposed) return 'Opposed';
  if (t.standout) return 'Standout';
  return null;
}

function Spark({ points, width = 220, height = 52, up }) {
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
  const last = pts[pts.length - 1];
  const fill = `${d} L${last.x.toFixed(1)},${height} L${pts[0].x.toFixed(1)},${height} Z`;
  const stroke = up ? B.green : B.red;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden style={{ display: 'block' }}>
      <path d={fill} fill={stroke} opacity="0.12" />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockedState({ signedIn }) {
  return (
    <div style={{ padding: '3.2rem 0 2.4rem' }}>
      <div style={{ ...T.kicker, color: B.gold, marginBottom: 12 }}>My Sharps</div>
      <div style={{ ...T.display, color: B.text, fontSize: '1.35rem', marginBottom: 10 }}>
        {signedIn ? 'Star the wallets you trust.' : 'Sign in to keep a desk.'}
      </div>
      <div style={{ ...T.body, color: B.textMuted, maxWidth: 380 }}>
        {signedIn
          ? 'Then watch their book like a portfolio.'
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

function WindowCut({ window, onChange }) {
  return (
    <div role="tablist" aria-label="Desk window" style={{ display: 'flex', gap: 18 }}>
      {['recent', 'l30'].map((id) => {
        const on = window === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(id)}
            style={{
              ...T.kicker,
              border: 'none',
              background: 'transparent',
              padding: '0 0 0.55rem',
              cursor: 'pointer',
              color: on ? B.goldSoft : B.textFaint,
              position: 'relative',
            }}
          >
            {id === 'l30' ? 'L30' : 'Recent'}
            {on ? (
              <span style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: B.gold,
              }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function Word({ active, onClick, children, tone }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: 'none',
        background: 'transparent',
        padding: 0,
        cursor: onClick ? 'pointer' : 'default',
        color: tone || (active ? B.goldSoft : B.textSec),
        font: 'inherit',
        fontFeatureSettings: "'tnum'",
      }}
    >
      {children}
    </button>
  );
}

function AllocBar({ sports, filter, onFilter }) {
  if (!sports?.length) return null;
  return (
    <div>
      <div style={{ display: 'flex', height: 3, gap: 2, width: 140, marginBottom: 8 }}>
        {sports.map((s) => (
          <div
            key={s.sport}
            style={{
              flex: Math.max(s.pct, 2),
              background: sportColor(s.sport),
              opacity: filter === s.sport ? 1 : 0.8,
            }}
          />
        ))}
      </div>
      <div style={{ ...T.meta, fontFeatureSettings: "'tnum'" }}>
        {sports.slice(0, 3).map((s, i) => (
          <Word
            key={s.sport}
            active={filter === s.sport}
            tone={filter === s.sport ? B.goldSoft : sportColor(s.sport)}
            onClick={() => onFilter(filter === s.sport ? null : s.sport)}
          >
            {i ? '   ' : ''}{s.sport} {s.pct}%
          </Word>
        ))}
      </div>
    </div>
  );
}

function moverDetail(m) {
  if (m.role === 'hot') {
    if (m.heat?.record) return `${m.heat.label} ${m.heat.window || ''} ${m.heat.record}`.replace(/\s+/g, ' ').trim();
    return m.heat?.label || null;
  }
  if (m.role === 'book') {
    if (Number.isFinite(m.pnl)) return fmtVol(m.pnl);
    return m.honest?.text && m.honest.text !== '—' ? m.honest.text : null;
  }
  if (m.ticket) {
    return `${ticketTitle(m.ticket)}  ${fmtVol(m.ticket.invested, { signed: false })}${m.ticket.shared ? '  ·  Shared' : ''}`;
  }
  if (m.openN) return `${m.openN} live  ${fmtVol(m.openInvested, { signed: false })}`;
  return null;
}

function moverLabel(role) {
  if (role === 'hot') return 'Hot';
  if (role === 'book') return 'Book';
  return 'Live';
}

function DeskPulse({
  pulse,
  focused,
  window,
  onWindow,
  filter,
  onFilter,
  onClearFocus,
  onFocus,
  onHeat,
  isMobile,
}) {
  const hero = pulse.hero || {};
  const pnl = hero.hasPnl ? hero.pnl : null;
  const heroNum = hero.hasPnl
    ? fmtVol(pnl)
    : (hero.honest?.record && hero.honest.record !== '—' ? hero.honest.record : '—');
  const heroTone = hero.hasPnl
    ? (pnl > 0 ? B.green : pnl < 0 ? B.red : B.text)
    : B.text;
  const spark = focused?.spark || focused?.form?.spark;
  const sparkUp = Number.isFinite(focused?.l30?.pnl)
    ? focused.l30.pnl >= 0
    : (spark ? spark[spark.length - 1] >= 0 : true);
  const movers = pulse.movers?.list || [];
  const heatBits = [
    pulse.lean?.tail ? `${pulse.lean.tail} tail` : null,
    pulse.lean?.sit ? `${pulse.lean.sit} sit` : null,
    pulse.lean?.watch ? `${pulse.lean.watch} watch` : null,
  ].filter(Boolean).join('  ·  ');

  return (
    <div style={{ padding: isMobile ? '0.4rem 0 1.7rem' : '0.55rem 0 2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: isMobile ? 22 : 28,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ ...T.kicker, color: B.gold, marginBottom: 10 }}>
            {focused ? focused.tag : 'Desk'}
          </div>
          <div style={{ ...T.meta, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
            {pulse.walletN} {pulse.walletN === 1 ? 'wallet' : 'wallets'}
            {focused?.lean?.label ? `  ·  ${focused.lean.label}` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {focused ? (
            <button
              type="button"
              onClick={onClearFocus}
              style={{
                ...T.kicker, border: 'none', background: 'transparent',
                color: B.textMuted, cursor: 'pointer', padding: 0,
              }}
            >
              Desk
            </button>
          ) : null}
          <WindowCut window={window} onChange={onWindow} />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: (focused && spark && !isMobile) ? 'minmax(0, 1fr) auto' : '1fr',
        gap: isMobile ? 16 : 36,
        alignItems: 'end',
        marginBottom: isMobile ? 26 : 32,
      }}>
        <div>
          <div style={{ ...T.display, color: heroTone, fontSize: isMobile ? '2rem' : '2.55rem' }}>
            {heroNum}
          </div>
          <div style={{ ...T.meta, color: B.textMuted, marginTop: 10, fontFeatureSettings: "'tnum'" }}>
            {hero.hasPnl && hero.honest?.text && hero.honest.text !== '—'
              ? hero.honest.text
              : (window === 'recent' ? 'Recent book' : 'Last 30')}
          </div>
        </div>
        {focused && spark ? (
          <Spark points={spark} width={isMobile ? 180 : 260} height={isMobile ? 40 : 56} up={sparkUp} />
        ) : null}
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: isMobile ? '1.15rem 1.6rem' : '1.25rem 2.4rem',
        paddingBottom: isMobile ? 20 : 24,
        borderBottom: `1px solid ${B.line}`,
      }}>
        <div>
          <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 7 }}>Open</div>
          <Word
            active={!filter}
            tone={pulse.open?.n ? B.goldSoft : B.textFaint}
            onClick={() => onFilter(null)}
          >
            <span style={{ ...T.name, color: pulse.open?.n ? B.goldSoft : B.textFaint }}>
              {pulse.open?.n
                ? `${pulse.open.n}  ·  ${fmtVol(pulse.open.invested, { signed: false })}`
                : 'Quiet'}
            </span>
          </Word>
        </div>
        {heatBits ? (
          <div>
            <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 7 }}>Heat</div>
            <Word onClick={onHeat}>
              <span style={{ ...T.body, color: B.textSec }}>{heatBits}</span>
            </Word>
          </div>
        ) : null}
        {pulse.sports?.length ? (
          <div>
            <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 7 }}>Sports</div>
            <AllocBar sports={pulse.sports} filter={filter} onFilter={onFilter} />
          </div>
        ) : null}
        {pulse.canOverlap ? (
          <div>
            <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 7 }}>Overlap</div>
            {pulse.overlapEmpty ? (
              <div style={{ ...T.body, color: B.textFaint }}>None on this slate</div>
            ) : (
              <div style={{ ...T.body }}>
                <Word
                  active={filter === 'agree'}
                  onClick={() => onFilter(filter === 'agree' ? null : 'agree')}
                >
                  {pulse.agreeN} agree
                </Word>
                <span style={{ color: B.textFaint }}>  ·  </span>
                <Word
                  active={filter === 'fight'}
                  tone={filter === 'fight' ? B.goldSoft : (pulse.fightN ? B.red : B.textSec)}
                  onClick={() => onFilter(filter === 'fight' ? null : 'fight')}
                >
                  {pulse.fightN} fight
                </Word>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {movers.length ? (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: isMobile ? 18 : 36,
          paddingTop: isMobile ? 20 : 24,
        }}>
          {movers.map((m) => (
            <button
              key={`${m.role}-${m.walletShort}`}
              type="button"
              onClick={() => onFocus(m.walletShort)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                textAlign: 'left',
                cursor: 'pointer',
                minWidth: 0,
              }}
            >
              <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 7 }}>{moverLabel(m.role)}</div>
              <div style={{ ...T.name, color: B.text }}>{m.tag}</div>
              {moverDetail(m) ? (
                <div style={{ ...T.meta, color: B.textMuted, marginTop: 5, fontFeatureSettings: "'tnum'" }}>
                  {moverDetail(m)}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SortTh({ id, label, sortKey, dir, onSort, right }) {
  const on = sortKey === id;
  return (
    <button
      type="button"
      onClick={() => onSort(id)}
      style={{
        ...T.kicker,
        border: 'none',
        background: 'transparent',
        padding: 0,
        cursor: 'pointer',
        color: on ? B.goldSoft : B.textFaint,
        textAlign: right ? 'right' : 'left',
        width: '100%',
      }}
    >
      {label}{on ? (dir === 'desc' ? ' ↓' : ' ↑') : ''}
    </button>
  );
}

function RosterTable({
  roster,
  focusShort,
  sortKey,
  dir,
  onSort,
  onFocus,
  onRemove,
  isMobile,
}) {
  if (!roster.length) {
    return <div style={{ ...T.body, color: B.textMuted, padding: '1.2rem 0' }}>Nobody in this cut.</div>;
  }

  if (isMobile) {
    return (
      <div>
        {roster.map((r) => {
          const on = focusShort === r.walletShort;
          return (
            <div
              key={r.walletShort}
              style={{
                position: 'relative',
                padding: '0.95rem 1.8rem 0.95rem 0',
                borderBottom: `1px solid ${B.line}`,
                background: on ? 'rgba(212,175,55,0.05)' : 'transparent',
              }}
            >
              <button
                type="button"
                onClick={() => onFocus(r.walletShort)}
                style={{
                  border: 'none', background: 'transparent', padding: 0,
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ ...T.name, color: B.text }}>
                    {r.tag}
                    {r.focusSport || r.sports[0] ? (
                      <span style={{ ...T.kicker, color: sportColor(r.focusSport || r.sports[0]), marginLeft: 8 }}>
                        {r.focusSport || r.sports[0]}
                      </span>
                    ) : null}
                  </span>
                  <span style={{ ...T.name, color: Number.isFinite(r.l30?.pnl) ? (r.l30.pnl >= 0 ? B.green : B.red) : B.textFaint }}>
                    {Number.isFinite(r.l30?.pnl) ? fmtVol(r.l30.pnl) : (r.l30Honest?.text || '—')}
                  </span>
                </div>
                <div style={{ ...T.meta, color: B.textMuted, marginTop: 6, fontFeatureSettings: "'tnum'" }}>
                  <span style={{ color: leanColor(r.lean?.key) }}>{r.lean?.label}</span>
                  {'  ·  '}{recentText(r)}
                  {r.openN ? `  ·  ${r.openN} open` : ''}
                </div>
              </button>
              <button
                type="button"
                aria-label={`Remove ${r.tag}`}
                onClick={(e) => { e.stopPropagation(); onRemove(r.walletShort); }}
                style={{
                  position: 'absolute', top: 12, right: 0, border: 'none',
                  background: 'transparent', color: B.textFaint, cursor: 'pointer',
                  width: 24, height: 24, display: 'grid', placeItems: 'center',
                }}
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.3fr 0.7fr 0.7fr 1.4fr 1fr 1.1fr 28px',
        gap: 12,
        padding: '0 0 0.7rem',
        borderBottom: `1px solid ${B.line}`,
      }}>
        <SortTh id="wallet" label="Wallet" sortKey={sortKey} dir={dir} onSort={onSort} />
        <SortTh id="lean" label="Lean" sortKey={sortKey} dir={dir} onSort={onSort} />
        <SortTh id="recent" label="Recent" sortKey={sortKey} dir={dir} onSort={onSort} />
        <SortTh id="l30" label="L30" sortKey={sortKey} dir={dir} onSort={onSort} />
        <SortTh id="open" label="Open" sortKey={sortKey} dir={dir} onSort={onSort} />
        <SortTh id="market" label="Market" sortKey={sortKey} dir={dir} onSort={onSort} />
        <span />
      </div>
      {roster.map((r) => {
        const on = focusShort === r.walletShort;
        const book = r.books?.[0];
        return (
          <div
            key={r.walletShort}
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
              display: 'grid',
              gridTemplateColumns: '1.3fr 0.7fr 0.7fr 1.4fr 1fr 1.1fr 28px',
              gap: 12,
              alignItems: 'center',
              padding: '0.85rem 0',
              borderBottom: `1px solid ${B.line}`,
              background: on ? 'rgba(212,175,55,0.05)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ ...T.name, color: B.text }}>{r.tag}</div>
              {r.focusSport || r.sports[0] ? (
                <div style={{ ...T.kicker, color: sportColor(r.focusSport || r.sports[0]), marginTop: 4 }}>
                  {r.focusSport || r.sports[0]}
                </div>
              ) : null}
            </div>
            <div style={{ ...T.kicker, color: leanColor(r.lean?.key), letterSpacing: '0.12em' }}>
              {r.lean?.label || 'Watch'}
            </div>
            <div style={{ ...T.meta, color: B.textSec, fontFeatureSettings: "'tnum'" }}>{recentText(r)}</div>
            <div style={{ ...T.meta, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
              {r.l30Honest?.text && r.l30Honest.text !== '—' ? r.l30Honest.text : '—'}
              {Number.isFinite(r.l30?.pnl) ? (
                <span style={{ color: r.l30.pnl >= 0 ? B.green : B.red }}>
                  {'  '}{fmtVol(r.l30.pnl)}
                </span>
              ) : null}
            </div>
            <div style={{ ...T.meta, color: r.openN ? B.goldSoft : B.textFaint, fontFeatureSettings: "'tnum'" }}>
              {r.openN ? `${r.openN}  ·  ${fmtVol(r.openInvested, { signed: false })}` : '—'}
            </div>
            <div style={{ ...T.meta, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
              {book ? `${book.label}  ${book.honest?.text || `${book.wins}–${book.losses}`}` : '—'}
            </div>
            <button
              type="button"
              aria-label={`Remove ${r.tag}`}
              onClick={(e) => { e.stopPropagation(); onRemove(r.walletShort); }}
              style={{
                border: 'none', background: 'transparent', color: B.textFaint,
                cursor: 'pointer', width: 28, height: 28, display: 'grid', placeItems: 'center',
              }}
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function OpenBoard({ tickets, onFocus, isMobile }) {
  if (!tickets.length) {
    return (
      <div style={{ ...T.body, color: B.textMuted, padding: '1.15rem 0 0.4rem' }}>
        None of yours are on this slate.
      </div>
    );
  }
  return (
    <div>
      {tickets.map((t) => (
        <div
          key={t.id}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'minmax(0, 1fr) auto'
              : 'minmax(0, 1.4fr) auto minmax(0, 1fr) auto',
            gap: isMobile ? 10 : 14,
            alignItems: 'baseline',
            padding: '0.9rem 0',
            borderBottom: `1px solid ${B.line}`,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ ...T.name, color: B.text }}>{ticketTitle(t)}</div>
            <div style={{ ...T.meta, color: B.textFaint, marginTop: 4 }}>
              <span style={{ color: sportColor(t.sport) }}>{t.sport}</span>
              {'  ·  '}{matchup(t)}
            </div>
          </div>
          <div style={{ ...T.name, color: B.goldSoft, fontFeatureSettings: "'tnum'" }}>
            {fmtVol(t.invested, { signed: false })}
          </div>
          <div style={{
            ...T.meta,
            color: B.textSec,
            fontFeatureSettings: "'tnum'",
            gridColumn: isMobile ? '1 / -1' : 'auto',
          }}>
            {t.tags.map((tag, i) => (
              <button
                key={t.shorts[i] || tag}
                type="button"
                onClick={() => onFocus(t.shorts[i])}
                style={{
                  border: 'none', background: 'transparent', padding: 0,
                  color: B.textSec, cursor: 'pointer', marginRight: 10,
                }}
              >
                {tag}
              </button>
            ))}
            {isMobile && kindLabel(t) ? (
              <span style={{ ...T.kicker, color: kindTone(t.kind) }}>
                {kindLabel(t)}
              </span>
            ) : null}
          </div>
          {isMobile ? null : (
            <div style={{ ...T.kicker, color: kindTone(t.kind) }}>
              {kindLabel(t) || ''}
            </div>
          )}
        </div>
      ))}
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
  const [sortKey, setSortKey] = useState('lean');
  const [sortDir, setSortDir] = useState('asc');

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

  const sorted = useMemo(
    () => sortMySharpsRoster(roster, sortKey, sortDir),
    [roster, sortKey, sortDir],
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

  const onSort = (id) => {
    if (sortKey === id) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(id);
      setSortDir(id === 'wallet' || id === 'sport' || id === 'lean' ? 'asc' : 'desc');
    }
  };

  return (
    <div style={{ margin: '0.2rem 0 2.6rem' }}>
      <DeskPulse
        pulse={pulse}
        focused={focused}
        window={pulseWindow}
        onWindow={setPulseWindow}
        filter={filter}
        onFilter={setFilter}
        onClearFocus={() => onFocus?.(null)}
        onFocus={setFocus}
        onHeat={() => {
          setSortKey('lean');
          setSortDir('asc');
        }}
        isMobile={isMobile}
      />

      <div style={{ marginTop: isMobile ? 8 : 10, paddingTop: 8 }}>
        <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 14 }}>Roster</div>
        <RosterTable
          roster={sorted}
          focusShort={focusShort}
          sortKey={sortKey}
          dir={sortDir}
          onSort={onSort}
          onFocus={setFocus}
          onRemove={(short) => {
            if (focusShort === short) onFocus?.(null);
            onRemove?.(short);
          }}
          isMobile={isMobile}
        />
      </div>

      <div style={{ marginTop: isMobile ? 28 : 36 }}>
        <div style={{ ...T.kicker, color: B.textFaint, marginBottom: 14 }}>Open</div>
        <OpenBoard tickets={tickets} onFocus={setFocus} isMobile={isMobile} />
      </div>
    </div>
  );
}
