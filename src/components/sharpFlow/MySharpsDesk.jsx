/**
 * My Sharps — a book the customer runs.
 * Portfolio is the fund. Bets are the decisions. Find is how the list gets built.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import {
  HONEST_PCT_N,
  buildDeskHoldings,
  buildFindCandidates,
  buildMySharpsBoard,
  buildPortfolioSnapshot,
  buildSharpDossier,
  groupPortfolioBets,
  suggestTailStake,
  summarizeTails,
} from '../../lib/mySharpsDesk.js';

const B = {
  gold: '#D4AF37',
  goldSoft: '#E8D28A',
  goldDim: 'rgba(212, 175, 55, 0.12)',
  goldBorder: 'rgba(212, 175, 55, 0.38)',
  green: '#10B981',
  red: '#EF4444',
  card: '#141821',
  line: '#252B3B',
  hair: 'rgba(255,255,255,0.06)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textFaint: '#475569',
};

const T = {
  hero: {
    fontSize: '2.7rem',
    fontWeight: 650,
    lineHeight: 0.92,
    letterSpacing: '-0.048em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  figure: {
    fontSize: '0.95rem',
    fontWeight: 650,
    letterSpacing: '-0.02em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  name: { fontSize: '0.95rem', fontWeight: 650, letterSpacing: '-0.02em' },
  kicker: {
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
  meta: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.35 },
  body: { fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.4 },
};

const HOLD_GRID = 'minmax(148px, 1.6fr) minmax(108px, 1fr) 96px 72px 78px 92px';
const MARKET_LABEL = { ML: 'ML', SPREAD: 'Spread', TOTAL: 'Total' };
const FIND_SPORTS = ['All', 'MLB', 'NFL', 'NBA', 'NHL', 'CFB', 'CBB', 'SOC', 'UFC', 'WNBA'];
const FIND_SORTS = [
  { id: 'roi', kicker: 'Return' },
  { id: 'close', kicker: 'Close' },
  { id: 'bets', kicker: 'Sample' },
  { id: 'size', kicker: 'Size' },
];
const FIND_MARKETS = [
  { id: 'All', label: 'All markets' },
  { id: 'ML', label: 'ML' },
  { id: 'SPREAD', label: 'Spread' },
  { id: 'TOTAL', label: 'Total' },
];

let roomMemory = 'book';

function fmtVol(v, { signed = true } = {}) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const sign = !signed ? '' : (n < 0 ? '−' : (n > 0 ? '+' : ''));
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function pnlColor(n, fallback = B.text) {
  if (!Number.isFinite(n) || n === 0) return fallback;
  return n > 0 ? B.green : B.red;
}

function heatColor(heat) {
  if (!heat || heat.n < 5) return B.textFaint;
  if (heat.key === 'hot') return B.green;
  if (heat.key === 'cold') return B.red;
  return B.textMuted;
}

function fmtPrice(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v === 0) return '—';
  return v > 0 ? `+${v}` : `${v}`;
}

function fmtClock(ms) {
  if (!Number.isFinite(Number(ms))) return '';
  return new Date(Number(ms)).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function RoomBar({ room, onChange, betCount }) {
  const items = [
    { id: 'book', label: 'Portfolio' },
    { id: 'bets', label: betCount ? `Bets · ${betCount}` : 'Bets' },
    { id: 'find', label: 'Find' },
  ];
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '0.15rem 0 1rem' }}>
      <div style={{
        display: 'inline-flex',
        padding: 3,
        borderRadius: 999,
        border: `1px solid ${B.goldBorder}`,
        background: 'rgba(8,10,16,0.55)',
      }}
      >
        {items.map((item) => {
          const on = room === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              style={{
                ...T.kicker,
                border: 'none',
                background: on ? B.goldDim : 'transparent',
                color: on ? B.goldSoft : B.textMuted,
                padding: '0.48rem 0.95rem',
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Hero({ snapshot, isMobile, onOpenBets }) {
  const pnl = snapshot.l30?.pnl;
  const roi = snapshot.l30?.roi;
  const rec = snapshot.l30?.honest;
  const tails = snapshot.tails;
  const tailLine = (tails.wins + tails.losses) > 0
    ? `${tails.honest.record}${tails.honest.showPct ? ` · ${tails.honest.wr}%` : ''}${tails.openN ? ` · ${tails.openN} open` : ''}`
    : (tails.openN ? `${tails.openN} open` : 'Mark a bet');
  const cells = [
    { id: 'together', kicker: 'Together', n: snapshot.together.n, money: snapshot.together.invested, color: B.goldSoft },
    { id: 'split', kicker: 'Split', n: snapshot.split.n, money: snapshot.split.invested, color: snapshot.split.n ? B.red : B.textFaint },
    { id: 'open', kicker: 'Open', n: snapshot.open.n, money: snapshot.open.invested, color: B.goldSoft },
  ];
  return (
    <div style={{
      borderRadius: 16,
      border: `1px solid ${B.goldBorder}`,
      background: 'linear-gradient(180deg, rgba(212,175,55,0.10) 0%, rgba(20,24,33,0.2) 38%, #10141c 100%)',
      overflow: 'hidden',
      marginBottom: 8,
    }}
    >
      <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #E8D28A, transparent)' }} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.35fr 1fr',
        gap: isMobile ? 16 : 24,
        padding: isMobile ? '1.05rem 1rem 0.85rem' : '1.2rem 1.25rem 0.95rem',
      }}
      >
        <div>
          <div style={{ ...T.kicker, color: B.gold }}>Their 30 days</div>
          <div data-hero="book" style={{ ...T.hero, color: pnlColor(pnl), fontSize: isMobile ? '2.2rem' : T.hero.fontSize, marginTop: 8 }}>
            {Number.isFinite(pnl) ? fmtVol(pnl) : '—'}
          </div>
          <div style={{ ...T.body, color: B.textSec, marginTop: 8, fontFeatureSettings: "'tnum'" }}>
            {rec?.record ? rec.record : '—'}
            {rec?.showPct ? ` · ${rec.wr}%` : ''}
            {Number.isFinite(roi) ? ` · ${roi}% ROI` : ''}
          </div>
        </div>
        <div>
          <div style={{ ...T.kicker, color: B.textMuted }}>My tails</div>
          <div data-hero="tails" style={{ ...T.hero, color: pnlColor(tails.pnl, B.text), fontSize: isMobile ? '2.2rem' : T.hero.fontSize, marginTop: 8 }}>
            {Number.isFinite(tails.pnl) ? fmtVol(tails.pnl) : '—'}
          </div>
          <div style={{ ...T.body, color: B.textSec, marginTop: 8, fontFeatureSettings: "'tnum'" }}>
            {tailLine}
          </div>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderTop: `1px solid ${B.line}`,
      }}
      >
        {cells.map((cell) => (
          <button
            key={cell.id}
            type="button"
            onClick={onOpenBets}
            style={{
              background: 'transparent',
              border: 'none',
              borderRight: cell.id === 'open' ? 'none' : `1px solid ${B.hair}`,
              textAlign: 'left',
              padding: isMobile ? '0.75rem 0.7rem 0.85rem' : '0.85rem 1rem 0.95rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ ...T.kicker, color: B.textFaint }}>{cell.kicker}</div>
            <div style={{ ...T.figure, color: cell.color, marginTop: 4, fontSize: isMobile ? '0.95rem' : '1.05rem' }}>
              {cell.n || 0}
              <span style={{ color: B.textMuted, fontWeight: 550, marginLeft: 8 }}>
                {cell.money ? fmtVol(cell.money, { signed: false }) : ''}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Head({ children, align = 'left' }) {
  return <div style={{ ...T.kicker, color: B.textFaint, textAlign: align, letterSpacing: '0.08em' }}>{children}</div>;
}

function NameField({ name, tag, selected, startEditing, onRename, onOpen }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name || '');
  useEffect(() => { setDraft(name || ''); }, [name]);
  useEffect(() => { if (startEditing) setEditing(true); }, [startEditing]);
  const commit = () => {
    setEditing(false);
    if ((draft || '') !== (name || '')) onRename?.(draft);
  };
  const tone = selected ? B.goldSoft : B.text;
  if (!editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => { setEditing(true); onOpen?.(); }}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'text', color: tone,
            ...T.name, fontFamily: 'inherit', textAlign: 'left',
          }}
        >
          {name || tag}
        </button>
        {name ? (
          <span style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'", flexShrink: 0 }}>{tag}</span>
        ) : null}
      </div>
    );
  }
  const width = `${Math.min(18, Math.max((draft || tag || '').length, 4))}ch`;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
      <input
        className="ms-name"
        autoFocus
        value={draft}
        placeholder={tag}
        aria-label={`Name ${tag}`}
        onChange={(e) => setDraft(e.target.value.slice(0, 22))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
          if (e.key === 'Escape') { setDraft(name || ''); setEditing(false); }
        }}
        style={{
          width, maxWidth: '100%', background: 'transparent', border: 'none', outline: 'none',
          padding: 0, margin: 0, color: tone, caretColor: B.goldSoft, ...T.name, fontFamily: 'inherit',
        }}
      />
      <span style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'", flexShrink: 0 }}>{tag}</span>
    </div>
  );
}

function HoldingRow({ row, selected, isMobile, onToggle, onOpen, onRename, startEditing }) {
  const form = row.heat?.key === 'hot' || row.heat?.key === 'cold'
    ? `${row.heat.label} ${row.heat.window} ${row.heat.record}`
    : (row.heat?.record && row.heat.window ? `${row.heat.window} ${row.heat.record}` : null);
  const close = Number.isFinite(row.clv?.pctPos) ? `${row.clv.pctPos}%` : '—';
  const closeTone = Number.isFinite(row.clv?.pctPos) && row.clv.pctPos >= 55 ? B.goldSoft : B.textFaint;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'minmax(0, 1fr) auto' : HOLD_GRID,
        gap: isMobile ? '2px 12px' : '0 14px',
        alignItems: 'center',
        padding: '0.92rem 0.35rem 0.92rem 0.7rem',
        borderBottom: `1px solid ${B.hair}`,
        boxShadow: selected ? `inset 3px 0 0 ${B.gold}` : 'none',
        background: selected ? 'rgba(212,175,55,0.05)' : 'transparent',
        cursor: 'pointer',
      }}
    >
      <NameField
        name={row.name}
        tag={row.tag}
        selected={selected}
        startEditing={startEditing}
        onRename={onRename}
        onOpen={onOpen}
      />
      <div style={{ display: isMobile ? 'none' : 'block' }}>
        <div style={{ ...T.figure, color: B.textSec, fontSize: '0.88rem' }}>
          {row.honest?.record || '—'}
          {row.honest?.showPct ? <span style={{ color: B.textFaint }}> · {row.honest.wr}%</span> : null}
        </div>
        {form ? (
          <div style={{ ...T.meta, color: heatColor(row.heat), marginTop: 3 }}>{form}</div>
        ) : null}
      </div>
      <div style={{ ...T.figure, color: pnlColor(row.l30Pnl, B.textMuted), textAlign: isMobile ? 'right' : 'right' }}>
        {Number.isFinite(row.l30Pnl) ? fmtVol(row.l30Pnl) : '—'}
      </div>
      {!isMobile ? (
        <div style={{ ...T.figure, color: pnlColor(row.roi, B.textFaint), textAlign: 'right', fontSize: '0.88rem' }}>
          {Number.isFinite(row.roi) ? `${row.roi}%` : '—'}
        </div>
      ) : null}
      {!isMobile ? (
        <div style={{ ...T.figure, color: closeTone, textAlign: 'right', fontSize: '0.88rem' }}>{close}</div>
      ) : null}
      {!isMobile ? (
        <div style={{ ...T.figure, color: row.openInvested ? B.goldSoft : B.textFaint, textAlign: 'right' }}>
          {row.openInvested ? fmtVol(row.openInvested, { signed: false }) : '—'}
          {row.openN > 1 ? <span style={{ ...T.meta, color: B.textFaint, marginLeft: 6 }}>{row.openN}</span> : null}
        </div>
      ) : null}
      {isMobile ? (
        <div style={{ ...T.meta, color: B.textMuted, gridColumn: '1 / -1', fontFeatureSettings: "'tnum'" }}>
          {[
            row.honest?.text,
            form,
            Number.isFinite(row.roi) ? `${row.roi}% ROI` : null,
            Number.isFinite(row.clv?.pctPos) ? `close ${row.clv.pctPos}%` : null,
            row.openInvested ? `${fmtVol(row.openInvested, { signed: false })} open` : null,
          ].filter(Boolean).join('   ·   ') || '—'}
        </div>
      ) : null}
    </div>
  );
}

function MarketBook({ holding, onRemove }) {
  const label = holding.name || holding.tag;
  const groups = [];
  const bySport = new Map();
  for (const m of holding.markets || []) {
    if (!bySport.has(m.sport)) bySport.set(m.sport, []);
    bySport.get(m.sport).push(m);
  }
  for (const [sport, markets] of bySport) groups.push({ sport, markets });
  return (
    <div style={{
      margin: '0 0 0.35rem',
      padding: '0.85rem 0.85rem 0.45rem',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${B.line}`,
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div style={{ ...T.kicker, color: B.gold }}>Market book</div>
        <button
          type="button"
          onClick={onRemove}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...T.meta, color: B.textFaint, fontFamily: 'inherit' }}
        >
          Remove {label}
        </button>
      </div>
      {groups.length ? groups.map((g) => (
        <div key={g.sport} style={{ marginTop: 10 }}>
          <div style={{ ...T.kicker, color: B.textSec, letterSpacing: '0.08em', marginBottom: 4 }}>{g.sport}</div>
          {g.markets.map((m) => (
            <div
              key={`${g.sport}:${m.market}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px minmax(0, 1.2fr) 72px 84px',
                gap: '0 12px',
                alignItems: 'baseline',
                padding: '0.42rem 0',
                borderTop: `1px solid ${B.hair}`,
              }}
            >
              <div style={{ ...T.name, color: B.text, fontSize: '0.84rem' }}>{m.label}</div>
              <div style={{ ...T.meta, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                {m.honest?.text && m.honest.text !== '—' ? m.honest.text : '—'}
                {m.n ? <span style={{ color: B.textFaint }}> · {m.n} bets</span> : null}
              </div>
              <div style={{ ...T.figure, color: pnlColor(m.roi, B.textFaint), textAlign: 'right', fontSize: '0.84rem' }}>
                {Number.isFinite(m.roi) ? `${m.roi}%` : '—'}
              </div>
              <div style={{ ...T.figure, color: pnlColor(m.l30?.pnl, B.textFaint), textAlign: 'right', fontSize: '0.84rem' }}>
                {Number.isFinite(m.l30?.pnl) ? fmtVol(m.l30.pnl) : ''}
              </div>
            </div>
          ))}
        </div>
      )) : (
        <div style={{ ...T.meta, color: B.textFaint, padding: '0.7rem 0' }}>
          {holding.honest?.record ? `${holding.honest.text} across the book.` : 'Thin sample.'}
        </div>
      )}
    </div>
  );
}

function sumInvested(items) {
  return (items || []).reduce((s, t) => s + (Number(t.invested) || 0), 0);
}

function Pill({ children, color }) {
  if (!children) return null;
  return (
    <span style={{
      ...T.kicker,
      letterSpacing: '0.08em',
      color,
      border: `1px solid ${color}55`,
      borderRadius: 999,
      padding: '0.16rem 0.48rem',
      lineHeight: 1.3,
      whiteSpace: 'nowrap',
    }}
    >
      {children}
    </span>
  );
}

function BetsHero({ groups, tails, isMobile, lens, onLens }) {
  const order = ['together', 'pressing', 'split', 'rest'];
  const n = order.reduce((s, key) => s + groups[key].length, 0);
  const money = order.reduce((s, key) => s + sumInvested(groups[key]), 0);
  const tailLine = (tails.wins + tails.losses) > 0
    ? `${tails.honest.record}${tails.honest.showPct ? ` · ${tails.honest.wr}%` : ''}${tails.openN ? ` · ${tails.openN} open` : ''}`
    : (tails.openN ? `${tails.openN} open` : 'Mark a bet');
  const cells = [
    { id: 'together', kicker: 'Together', n: groups.together.length, money: sumInvested(groups.together), color: B.goldSoft },
    { id: 'pressing', kicker: 'Pressing', n: groups.pressing.length, money: sumInvested(groups.pressing), color: groups.pressing.length ? '#F59E0B' : B.textFaint },
    { id: 'split', kicker: 'Split', n: groups.split.length, money: sumInvested(groups.split), color: groups.split.length ? B.red : B.textFaint },
    { id: 'rest', kicker: 'Rest', n: groups.rest.length, money: sumInvested(groups.rest), color: B.textSec },
  ];
  const lensLabel = cells.find((c) => c.id === lens)?.kicker;
  const mix = [
    groups.together.length ? `${groups.together.length} together` : null,
    groups.pressing.length ? `${groups.pressing.length} pressing` : null,
    groups.split.length ? `${groups.split.length} split` : null,
  ].filter(Boolean).join(' · ');
  return (
    <div style={{
      borderRadius: 16,
      border: `1px solid ${B.goldBorder}`,
      background: 'linear-gradient(180deg, rgba(212,175,55,0.10) 0%, rgba(20,24,33,0.2) 38%, #10141c 100%)',
      overflow: 'hidden',
      marginBottom: 8,
    }}
    >
      <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #E8D28A, transparent)' }} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.35fr 1fr',
        gap: isMobile ? 16 : 24,
        padding: isMobile ? '1.05rem 1rem 0.85rem' : '1.2rem 1.25rem 0.95rem',
      }}
      >
        <div>
          <div style={{ ...T.kicker, color: B.gold }}>{lensLabel ? `Showing ${lensLabel}` : 'On this slate'}</div>
          <div data-hero="slate" style={{ ...T.hero, color: n ? B.goldSoft : B.text, fontSize: isMobile ? '2.2rem' : T.hero.fontSize, marginTop: 8 }}>
            {n ? fmtVol(money, { signed: false }) : '—'}
          </div>
          <div style={{ ...T.body, color: B.textSec, marginTop: 8, fontFeatureSettings: "'tnum'" }}>
            {n ? `${n} bet${n === 1 ? '' : 's'}${mix ? ` · ${mix}` : ''}` : 'Nothing up on this slate'}
          </div>
        </div>
        <div>
          <div style={{ ...T.kicker, color: B.textMuted }}>My tails</div>
          <div data-hero="tails" style={{ ...T.hero, color: pnlColor(tails.pnl, B.text), fontSize: isMobile ? '2.2rem' : T.hero.fontSize, marginTop: 8 }}>
            {Number.isFinite(tails.pnl) ? fmtVol(tails.pnl) : '—'}
          </div>
          <div style={{ ...T.body, color: B.textSec, marginTop: 8, fontFeatureSettings: "'tnum'" }}>
            {tailLine}
          </div>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: `1px solid ${B.line}`,
      }}
      >
        {cells.map((cell) => {
          const on = lens === cell.id;
          return (
            <button
              key={cell.id}
              type="button"
              onClick={() => { if (cell.n) onLens(on ? null : cell.id); }}
              style={{
                background: on ? B.goldDim : 'transparent',
                border: 'none',
                borderRight: cell.id === 'rest' ? 'none' : `1px solid ${B.hair}`,
                textAlign: 'left',
                padding: isMobile ? '0.7rem 0.55rem 0.8rem' : '0.85rem 1rem 0.95rem',
                cursor: cell.n ? 'pointer' : 'default',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ ...T.kicker, letterSpacing: '0.08em', color: on ? B.gold : B.textFaint }}>{cell.kicker}</div>
              <div style={{ ...T.figure, color: cell.color, marginTop: 4, fontSize: isMobile ? '0.92rem' : '1.05rem' }}>
                {cell.n || 0}
                <span style={{ color: B.textMuted, fontWeight: 550, marginLeft: 8 }}>
                  {cell.money ? fmtVol(cell.money, { signed: false }) : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function betWash(item) {
  if (item.split) return 'linear-gradient(180deg, rgba(239,68,68,0.10), #141821 46%)';
  if (item.shared) return 'linear-gradient(180deg, rgba(212,175,55,0.12), #141821 46%)';
  if (item.sizeText) return 'linear-gradient(180deg, rgba(245,158,11,0.10), #141821 46%)';
  return B.card;
}

function BetCard({ item, isMobile, draft, onDraft, onTail, onUntail, suggestedStake, expanded, onToggle }) {
  const tailed = item.tail;
  const edge = item.split ? B.red : item.shared ? B.gold : (item.sizeText ? '#F59E0B' : B.line);
  const open = draft?.id === item.id;
  const clock = fmtClock(item.commenceMs);
  const market = MARKET_LABEL[String(item.marketType || '').toUpperCase()] || null;
  const price = item.americanLabel || fmtPrice(item.americanOdds);
  return (
    <div style={{
      borderRadius: 14,
      borderTop: `1px solid ${open || tailed ? B.goldBorder : B.line}`,
      borderRight: `1px solid ${open || tailed ? B.goldBorder : B.line}`,
      borderBottom: `1px solid ${open || tailed ? B.goldBorder : B.line}`,
      borderLeft: `3px solid ${edge}`,
      background: betWash(item),
      padding: isMobile ? '0.9rem 0.85rem' : '1rem 1.05rem 0.95rem',
      cursor: 'pointer',
    }}
    onClick={(e) => {
      if (e.target.closest('button, input, label')) return;
      onToggle?.();
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ ...T.name, color: item.shared && !item.split ? B.goldSoft : B.text, fontSize: isMobile ? '1.05rem' : '1.2rem' }}>
            {item.pick}
          </div>
          <div style={{ ...T.meta, color: B.textMuted, marginTop: 5 }}>
            {[item.matchup, clock, item.sport].filter(Boolean).join('   ·   ')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {item.sizeText ? <Pill color="#F59E0B">{item.sizeText}</Pill> : null}
            {item.shared && !item.split ? <Pill color={B.goldSoft}>{(item.shorts || []).length > 1 ? `${item.shorts.length} on it` : 'Together'}</Pill> : null}
            {item.split ? <Pill color={B.red}>Opposed</Pill> : null}
            {item.pinMove === 'with' ? <Pill color={B.goldSoft}>With the line</Pill> : null}
            {item.pinMove === 'against' ? <Pill color={B.red}>Against the line</Pill> : null}
            {market ? <Pill color={B.textSec}>{market}</Pill> : null}
            {item.who && !item.split && !item.shared ? <Pill color={B.textMuted}>{item.who}</Pill> : null}
            {tailed ? <Pill color={B.gold}>Tailed {fmtPrice(tailed.myAmerican)}</Pill> : null}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ ...T.figure, color: B.goldSoft, fontSize: '1.05rem' }}>{fmtVol(item.invested, { signed: false })}</div>
          <div style={{ ...T.figure, color: B.text, fontSize: '0.92rem' }}>{price}</div>
          {tailed && !open ? (
            <button type="button" onClick={() => onUntail(item.id)} style={quietBtn}>Untail</button>
          ) : (
            <button type="button" onClick={() => onDraft(item, suggestedStake)} style={goldBtn}>
              {open ? 'Close' : 'Tail'}
            </button>
          )}
        </div>
      </div>
      {expanded ? <TicketContext item={item} /> : null}
      {open ? (
        <TailForm
          item={item}
          draft={draft}
          onDraft={onDraft}
          onTail={onTail}
        />
      ) : null}
    </div>
  );
}

const quietBtn = {
  background: 'transparent',
  border: `1px solid ${B.line}`,
  color: B.textMuted,
  borderRadius: 999,
  padding: '0.28rem 0.7rem',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.72rem',
  fontWeight: 650,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

const goldBtn = {
  ...quietBtn,
  border: `1px solid ${B.goldBorder}`,
  color: B.goldSoft,
  background: B.goldDim,
};

function TailForm({ item, draft, onDraft, onTail }) {
  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-end', marginTop: 10 }}
      onClick={(e) => e.stopPropagation()}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em' }}>My price</span>
        <input
          value={draft.price}
          aria-label={`Price for ${item.pick}`}
          onChange={(e) => onDraft(item, null, { price: e.target.value })}
          style={fieldStyle}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em' }}>Stake</span>
        <input
          value={draft.stake}
          inputMode="numeric"
          aria-label={`Stake for ${item.pick}`}
          onChange={(e) => onDraft(item, null, { stake: e.target.value.replace(/[^\d]/g, '') })}
          style={fieldStyle}
        />
      </label>
      <button
        type="button"
        onClick={() => onTail(item, draft)}
        style={{ ...goldBtn, padding: '0.45rem 0.9rem' }}
      >
        Mark tailed
      </button>
    </div>
  );
}

const fieldStyle = {
  width: 96,
  background: 'transparent',
  border: `1px solid ${B.line}`,
  borderRadius: 8,
  color: B.text,
  padding: '0.4rem 0.5rem',
  fontFamily: 'inherit',
  fontSize: '0.88rem',
  fontFeatureSettings: "'tnum'",
};

function BetGroup({ id, title, tone, items, isMobile, draft, onDraft, onTail, onUntail, walletProfiles, expandedId, onToggle }) {
  if (!items.length) return null;
  const money = sumInvested(items);
  return (
    <section id={id} style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 18, height: 2, borderRadius: 2, background: tone, flexShrink: 0 }} />
        <div style={{ ...T.kicker, color: tone }}>{title}</div>
        <div style={{ flex: 1 }} />
        <div style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'" }}>
          {items.length}{money ? ` · ${fmtVol(money, { signed: false })}` : ''}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => (
          <BetCard
            key={item.id}
            item={item}
            isMobile={isMobile}
            draft={draft}
            suggestedStake={suggestTailStake(item, walletProfiles)}
            onDraft={onDraft}
            onTail={onTail}
            onUntail={onUntail}
            expanded={expandedId === item.id}
            onToggle={() => onToggle?.(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

function TailStrip({ cards, onUntail }) {
  if (!cards.length) return null;
  return (
    <section style={{ marginTop: 12 }}>
      <div style={{ ...T.kicker, color: B.gold, marginBottom: 8 }}>Marked</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {cards.map((card) => {
          const result = card.status === 'won' ? 'Won' : card.status === 'lost' ? 'Lost' : 'Open';
          const tone = card.status === 'won' ? B.green : card.status === 'lost' ? B.red : B.goldSoft;
          const figure = Number.isFinite(card.pnl) && card.status !== 'open'
            ? fmtVol(card.pnl)
            : (card.stake ? fmtVol(card.stake, { signed: false }) : '—');
          return (
            <div
              key={card.id}
              style={{
                flex: '1 1 210px',
                maxWidth: 340,
                borderRadius: 12,
                border: `1px solid ${B.goldBorder}`,
                background: 'rgba(212,175,55,0.05)',
                padding: '0.75rem 0.85rem 0.7rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div style={{ ...T.kicker, color: tone, letterSpacing: '0.1em' }}>{result}</div>
                <button type="button" aria-label={`Untail ${card.pick || 'bet'}`} onClick={() => onUntail(card.id)} style={{ ...quietBtn, padding: '0.12rem 0.4rem' }}>×</button>
              </div>
              <div style={{ ...T.name, color: B.text, marginTop: 6 }}>{card.pick || 'Tailed'}</div>
              {card.matchup ? <div style={{ ...T.meta, color: B.textFaint, marginTop: 3 }}>{card.matchup}</div> : null}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, gap: 8 }}>
                <div style={{ ...T.meta, color: B.goldSoft, fontFeatureSettings: "'tnum'" }}>{fmtPrice(card.myAmerican)}</div>
                <div style={{ ...T.figure, color: card.status === 'open' ? B.textSec : pnlColor(card.pnl, B.textMuted), fontSize: '0.95rem' }}>{figure}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FilterBtn({ on, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...T.kicker,
        letterSpacing: '0.06em',
        borderRadius: 999,
        border: `1px solid ${on ? B.goldBorder : B.line}`,
        background: on ? B.goldDim : 'transparent',
        color: on ? B.goldSoft : B.textMuted,
        padding: '0.32rem 0.65rem',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

function findHeroNumber(row, sort) {
  if (!row) return { text: '—', color: B.text };
  const thin = (row.n || 0) < HONEST_PCT_N;
  if (sort === 'close') {
    return Number.isFinite(row.clv?.pctPos)
      ? { text: `${row.clv.pctPos}%`, color: row.clv.pctPos >= 55 ? B.goldSoft : B.textSec }
      : { text: '—', color: B.text };
  }
  if (sort === 'bets') return { text: String(row.n || 0), color: B.goldSoft };
  if (sort === 'size') {
    return row.usual
      ? { text: fmtVol(row.usual, { signed: false }), color: B.goldSoft }
      : { text: '—', color: B.text };
  }
  return {
    text: Number.isFinite(row.roi) ? `${row.roi}%` : '—',
    color: thin ? B.goldSoft : pnlColor(row.roi, B.textFaint),
  };
}

function findKicker(row, sort) {
  if (sort === 'roi' && row && (row.n || 0) < HONEST_PCT_N) return 'Thin sample';
  if (sort === 'close') return 'Best close';
  if (sort === 'bets') return 'Deepest book';
  if (sort === 'size') return 'Biggest bets';
  return 'Best return';
}

const FIND_GRID = 'minmax(0, 1.7fr) minmax(108px, 1fr) 72px 68px 84px 76px';

function LineChart({ points, height = 108 }) {
  const pts = (points || []).map((n) => Number(n)).filter((n) => Number.isFinite(n));
  if (pts.length < 2) return null;
  const w = 640;
  const h = height;
  const min = Math.min(0, ...pts);
  const max = Math.max(0, ...pts);
  const span = (max - min) || 1;
  const x = (i) => (i / (pts.length - 1)) * (w - 12) + 6;
  const y = (v) => 10 + (1 - (v - min) / span) * (h - 20);
  const d = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const end = pts[pts.length - 1];
  const color = end >= 0 ? B.green : B.red;
  const zero = y(0);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height} role="img" aria-label="Dollar path">
      <line x1="6" x2={w - 6} y1={zero} y2={zero} stroke="rgba(255,255,255,0.08)" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function DivergingBar({ value, maxAbs }) {
  const n = Number(value) || 0;
  const pct = maxAbs > 0 ? Math.min(50, (Math.abs(n) / maxAbs) * 50) : 0;
  const pos = n >= 0;
  return (
    <div style={{ position: 'relative', height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.16)' }} />
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: pos ? '50%' : `${50 - pct}%`,
        width: `${pct}%`,
        background: pos ? B.green : B.red,
      }}
      />
    </div>
  );
}

function BookVisual({ holdings, isMobile }) {
  const curves = (holdings || []).map((h) => h.spark).filter((c) => Array.isArray(c) && c.length >= 2);
  const path = [];
  if (curves.length) {
    const n = curves[0].length;
    for (let i = 0; i < n; i += 1) {
      path.push(curves.reduce((s, c) => s + (Number(c[i]) || 0), 0));
    }
  }
  const sharps = (holdings || []).filter((h) => Number.isFinite(h.l30Pnl) && h.l30Pnl !== 0);
  const sports = new Map();
  for (const h of holdings || []) {
    for (const line of h.lines || []) {
      if (!Number.isFinite(line.pnl) || !line.sport) continue;
      sports.set(line.sport, (sports.get(line.sport) || 0) + line.pnl);
    }
  }
  const sportRows = [...sports.entries()].map(([sport, pnl]) => ({ sport, pnl })).sort((a, b) => b.pnl - a.pnl);
  const maxAbs = Math.max(
    1,
    ...sharps.map((h) => Math.abs(h.l30Pnl)),
    ...sportRows.map((r) => Math.abs(r.pnl)),
  );
  if (!path.length && !sharps.length) return null;
  return (
    <div style={{
      margin: '10px 0 14px',
      borderRadius: 16,
      border: `1px solid ${B.line}`,
      background: '#10141c',
      padding: isMobile ? '0.9rem 0.85rem 1rem' : '1rem 1.1rem 1.05rem',
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div style={{ ...T.kicker, color: B.gold }}>30-day path</div>
        {path.length ? (
          <div style={{ ...T.figure, color: pnlColor(path[path.length - 1]), fontSize: '0.95rem' }}>
            {fmtVol(path[path.length - 1])}
          </div>
        ) : null}
      </div>
      {path.length ? <div style={{ marginTop: 6 }}><LineChart points={path} /></div> : null}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr',
        gap: isMobile ? 16 : 28,
        marginTop: 8,
      }}
      >
        <div>
          <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em', marginBottom: 8 }}>By sharp</div>
          {sharps.map((h) => (
            <div key={h.walletShort} style={{ display: 'grid', gridTemplateColumns: 'minmax(72px, 0.7fr) 1fr 72px', gap: 10, alignItems: 'center', marginBottom: 7 }}>
              <div style={{ ...T.meta, color: B.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name || h.tag}</div>
              <DivergingBar value={h.l30Pnl} maxAbs={maxAbs} />
              <div style={{ ...T.figure, color: pnlColor(h.l30Pnl), textAlign: 'right', fontSize: '0.82rem' }}>{fmtVol(h.l30Pnl)}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em', marginBottom: 8 }}>By sport</div>
          {sportRows.length ? sportRows.map((row) => (
            <div key={row.sport} style={{ display: 'grid', gridTemplateColumns: '42px 1fr 72px', gap: 10, alignItems: 'center', marginBottom: 7 }}>
              <div style={{ ...T.meta, color: B.textSec }}>{row.sport}</div>
              <DivergingBar value={row.pnl} maxAbs={maxAbs} />
              <div style={{ ...T.figure, color: pnlColor(row.pnl), textAlign: 'right', fontSize: '0.82rem' }}>{fmtVol(row.pnl)}</div>
            </div>
          )) : (
            <div style={{ ...T.meta, color: B.textFaint }}>No sport split yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Scale({ label, min, max, step, value, text, onChange }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 240 }}>
      <span style={{ ...T.kicker, color: B.textMuted, letterSpacing: '0.08em' }}>{label}</span>
      <input
        className="ms-scale"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span style={{ ...T.figure, color: value ? B.goldSoft : B.textFaint, fontSize: '0.82rem', minWidth: 52 }}>{text}</span>
    </label>
  );
}

function SharpProfile({ dossier, isMobile }) {
  if (!dossier) return null;
  const heat = dossier.heat?.key === 'hot' || dossier.heat?.key === 'cold'
    ? `${dossier.heat.label} ${dossier.heat.window} ${dossier.heat.record}`
    : null;
  const close = Number.isFinite(dossier.clv?.pctPos) ? `${dossier.clv.pctPos}% close` : null;
  const lead = [...(dossier.markets || [])].sort((a, b) => (b.n || 0) - (a.n || 0))[0];
  const haveL30 = Number.isFinite(dossier.l30Pnl);
  const thinBook = (lead?.n || 0) < HONEST_PCT_N;
  const heroText = haveL30 ? fmtVol(dossier.l30Pnl) : (Number.isFinite(lead?.roi) ? `${lead.roi}%` : '—');
  const heroColor = haveL30
    ? pnlColor(dossier.l30Pnl, B.text)
    : (thinBook ? B.goldSoft : pnlColor(lead?.roi, B.text));
  const side = haveL30
    ? [dossier.honest?.text, Number.isFinite(dossier.roi) ? `${dossier.roi}% ROI` : null, close].filter(Boolean).join(' · ')
    : [lead?.honest?.text, Number.isFinite(lead?.roi) ? `${lead.roi}% book` : null, lead?.n ? `${lead.n} bets` : null].filter(Boolean).join(' · ');
  return (
    <div style={{
      margin: '0 0 8px',
      borderRadius: 14,
      border: `1px solid ${B.goldBorder}`,
      background: 'linear-gradient(180deg, rgba(212,175,55,0.08), #10141c 28%)',
      padding: isMobile ? '0.9rem 0.8rem 0.7rem' : '1rem 1.05rem 0.75rem',
    }}
    >
      <div style={{ ...T.kicker, color: B.gold }}>
        {dossier.sport ? `${dossier.sport} profile` : 'Full profile'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-end', marginTop: 6 }}>
        <div style={{ ...T.hero, fontSize: isMobile ? '1.8rem' : '2.15rem', color: heroColor }}>
          {heroText}
        </div>
        <div style={{ ...T.body, color: B.textSec, textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
          {side || '—'}
          {heat ? <div style={{ ...T.meta, color: heatColor(dossier.heat), marginTop: 3 }}>{heat}</div> : null}
        </div>
      </div>
      {dossier.spark?.length >= 2 ? (
        <div style={{ marginTop: 8 }}>
          <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em' }}>
            {dossier.sparkFrom === 'book' ? '30-day path' : 'These results'}
          </div>
          <LineChart points={dossier.spark} height={88} />
        </div>
      ) : null}
      {dossier.markets?.length ? (
        <div style={{ marginTop: 8 }}>
          <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em', marginBottom: 4 }}>Market book</div>
          {dossier.markets.slice(0, 8).map((m) => (
            <div
              key={`${m.sport}:${m.market}`}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr auto' : '72px 64px minmax(0, 1fr) 64px 76px',
                gap: '0 12px',
                alignItems: 'baseline',
                padding: '0.38rem 0',
                borderTop: `1px solid ${B.hair}`,
              }}
            >
              {isMobile ? null : <div style={{ ...T.meta, color: B.textMuted }}>{m.sport}</div>}
              <div style={{ ...T.name, color: B.text, fontSize: '0.84rem' }}>{m.label}</div>
              {isMobile ? null : (
                <div style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'" }}>
                  {m.honest?.text && m.honest.text !== '—' ? m.honest.text : '—'}
                  {m.n ? ` · ${m.n} bets` : ''}
                </div>
              )}
              <div style={{ ...T.figure, color: pnlColor(m.roi, B.textFaint), textAlign: 'right', fontSize: '0.82rem' }}>
                {Number.isFinite(m.roi) ? `${m.roi}%` : '—'}
              </div>
              <div style={{ ...T.figure, color: pnlColor(m.l30?.pnl, B.textFaint), textAlign: 'right', fontSize: '0.82rem' }}>
                {Number.isFinite(m.l30?.pnl) ? fmtVol(m.l30.pnl) : ''}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em', margin: '12px 0 4px' }}>
        Last {dossier.results.length || 0} graded
        {dossier.resultN > dossier.results.length ? ` of ${dossier.resultN}` : ''}
      </div>
      {dossier.results.length ? dossier.results.map((leg) => (
        <div
          key={leg.id}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '64px minmax(0, 1fr) auto' : '78px minmax(0, 1.3fr) 52px 72px',
            gap: '0 12px',
            alignItems: 'baseline',
            padding: '0.42rem 0',
            borderTop: `1px solid ${B.hair}`,
          }}
        >
          <div style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'" }}>{leg.date ? leg.date.slice(5) : '—'}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ ...T.name, color: B.text, fontSize: '0.86rem' }}>{leg.pick}</div>
            <div style={{ ...T.meta, color: B.textMuted }}>{[leg.matchup, leg.sport, leg.market].filter(Boolean).join(' · ')}</div>
          </div>
          {isMobile ? null : (
            <div style={{ ...T.kicker, letterSpacing: '0.08em', color: leg.won ? B.green : B.red }}>{leg.won ? 'W' : 'L'}</div>
          )}
          <div style={{ ...T.figure, color: pnlColor(leg.pnl, B.textFaint), textAlign: 'right', fontSize: '0.84rem' }}>
            {Number.isFinite(leg.pnl) ? fmtVol(leg.pnl) : (leg.won ? 'W' : 'L')}
          </div>
        </div>
      )) : (
        <div style={{ ...T.meta, color: B.textFaint, padding: '0.4rem 0 0.2rem' }}>No graded tickets in this window.</div>
      )}
    </div>
  );
}

function TicketContext({ item }) {
  const lines = item.walletLines || [];
  const note = item.split
    ? 'Someone on your list is on the other side of this number.'
    : item.shared
      ? 'More than one sharp on your list took this side.'
      : item.sizeText
        ? 'Sized up against their usual bet in this sport.'
        : 'One sharp, around their usual size.';
  const maxRatio = Math.max(1.5, ...lines.map((l) => l.ratio || 0));
  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${B.hair}` }} onClick={(e) => e.stopPropagation()}>
      <div style={{ ...T.body, color: B.textSec }}>{note}</div>
      {Number.isFinite(Number(item.entryLine)) ? (
        <div style={{ ...T.meta, color: B.textMuted, marginTop: 4 }}>Entered {item.entryLine}</div>
      ) : null}
      <div style={{ marginTop: 8 }}>
        {lines.map((line) => (
          <div key={line.walletShort || line.tag} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 88px 72px', gap: 10, alignItems: 'center', padding: '0.4rem 0', borderTop: `1px solid ${B.hair}` }}>
            <div>
              <div style={{ ...T.name, color: B.text, fontSize: '0.88rem' }}>{line.tag}</div>
              {line.ratio ? (
                <div style={{ marginTop: 5, height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, (line.ratio / maxRatio) * 100)}%`,
                    height: '100%',
                    background: line.ratio >= 1.5 ? '#F59E0B' : B.gold,
                  }}
                  />
                </div>
              ) : null}
            </div>
            <div style={{ ...T.figure, color: B.goldSoft, textAlign: 'right', fontSize: '0.84rem' }}>{fmtVol(line.invested, { signed: false })}</div>
            <div style={{ ...T.meta, color: B.textMuted, textAlign: 'right', fontFeatureSettings: "'tnum'" }}>
              {line.ratio ? `${line.ratio.toFixed(1)}×` : ''}
              {line.price ? `${line.ratio ? ' · ' : ''}${line.price}` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FindRoom({
  rows, total, savedCount, cap, filters, setFilters, onAdd, notice, isMobile, walletProfiles,
}) {
  const lead = rows[0] || null;
  const hero = findHeroNumber(lead, filters.sort || 'roi');
  const thinN = rows.filter((r) => (r.n || 0) < HONEST_PCT_N).length;
  const full = savedCount >= cap;
  const [openId, setOpenId] = useState(null);
  const dossier = openId
    ? buildSharpDossier(walletProfiles, openId, { sport: filters.sport })
    : null;
  const heat = lead?.heat?.key === 'hot' || lead?.heat?.key === 'cold'
    ? `${lead.heat.label} ${lead.heat.window} ${lead.heat.record}`
    : null;
  const identity = lead
    ? [
      lead.tag,
      lead.sport,
      lead.marketLabel,
      lead.honest?.text,
      lead.n ? `${lead.n} bets` : null,
    ].filter(Boolean).join(' · ')
    : 'No wallets clear these filters.';
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {FIND_SPORTS.map((sp) => (
          <FilterBtn key={sp} on={filters.sport === sp} onClick={() => setFilters((f) => ({ ...f, sport: sp }))}>{sp}</FilterBtn>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 12 }}>
        {FIND_MARKETS.map((m) => (
          <FilterBtn key={m.id} on={filters.market === m.id} onClick={() => setFilters((f) => ({ ...f, market: m.id }))}>{m.label}</FilterBtn>
        ))}
        <FilterBtn on={filters.window === 'l30'} onClick={() => setFilters((f) => ({ ...f, window: 'l30' }))}>30d</FilterBtn>
        <FilterBtn on={filters.window === 'book'} onClick={() => setFilters((f) => ({ ...f, window: 'book' }))}>Book</FilterBtn>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        <Scale
          label="Min bets"
          min={0}
          max={200}
          step={10}
          value={Number(filters.minBets) || 0}
          text={(Number(filters.minBets) || 0) ? `${filters.minBets}+` : 'Any'}
          onChange={(n) => setFilters((f) => ({ ...f, minBets: n }))}
        />
        <Scale
          label="Min ROI"
          min={0}
          max={100}
          step={5}
          value={Number(filters.minRoi) || 0}
          text={Number(filters.minRoi) ? `${filters.minRoi}%+` : 'Any'}
          onChange={(n) => setFilters((f) => ({ ...f, minRoi: n || null }))}
        />
      </div>
      <div style={{
        borderRadius: 16,
        border: `1px solid ${B.goldBorder}`,
        background: 'linear-gradient(180deg, rgba(212,175,55,0.10) 0%, rgba(20,24,33,0.2) 38%, #10141c 100%)',
        overflow: 'hidden',
        marginBottom: 8,
      }}
      >
        <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #E8D28A, transparent)' }} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.35fr 1fr',
          gap: isMobile ? 16 : 24,
          padding: isMobile ? '1.05rem 1rem 0.85rem' : '1.2rem 1.25rem 0.95rem',
        }}
        >
          <div>
            <div style={{ ...T.kicker, color: B.gold }}>{findKicker(lead, filters.sort || 'roi')}</div>
            <div data-hero="find" style={{ ...T.hero, color: hero.color, fontSize: isMobile ? '2.2rem' : T.hero.fontSize, marginTop: 8 }}>
              {hero.text}
            </div>
            <div style={{ ...T.body, color: B.textSec, marginTop: 8, fontFeatureSettings: "'tnum'" }}>{identity}</div>
            {heat ? <div style={{ ...T.meta, color: heatColor(lead.heat), marginTop: 4 }}>{heat}</div> : null}
            {lead ? (
              <button
                type="button"
                onClick={() => onAdd(lead)}
                style={{ ...goldBtn, marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Star size={13} fill={full ? 'transparent' : B.goldSoft} color={B.goldSoft} />
                {full ? 'List full' : `Add ${lead.tag}`}
              </button>
            ) : null}
          </div>
          <div>
            <div style={{ ...T.kicker, color: B.textMuted }}>Your list</div>
            <div style={{ ...T.hero, color: full ? B.gold : B.text, fontSize: isMobile ? '2.2rem' : T.hero.fontSize, marginTop: 8 }}>
              {savedCount}
            </div>
            <div style={{ ...T.body, color: B.textSec, marginTop: 8, fontFeatureSettings: "'tnum'" }}>
              of {cap}{full ? ' · full' : ''}
            </div>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: `1px solid ${B.line}`,
        }}
        >
          {FIND_SORTS.map((cell) => {
            const on = (filters.sort || 'roi') === cell.id;
            return (
              <button
                key={cell.id}
                type="button"
                onClick={() => setFilters((f) => ({ ...f, sort: cell.id }))}
                style={{
                  background: on ? B.goldDim : 'transparent',
                  border: 'none',
                  borderRight: cell.id === 'size' ? 'none' : `1px solid ${B.hair}`,
                  textAlign: 'left',
                  padding: isMobile ? '0.7rem 0.55rem 0.8rem' : '0.85rem 1rem 0.95rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ ...T.kicker, letterSpacing: '0.08em', color: on ? B.gold : B.textFaint }}>{cell.kicker}</div>
                <div style={{ ...T.figure, color: on ? B.goldSoft : B.textSec, marginTop: 4, fontSize: isMobile ? '0.82rem' : '0.92rem' }}>
                  {cell.id === 'roi' ? 'ROI' : cell.id === 'close' ? 'CLV' : cell.id === 'bets' ? 'Bets' : 'Avg'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {notice ? <div style={{ ...T.meta, color: B.goldSoft, margin: '8px 0' }}>{notice}</div> : null}
      <div style={{ display: 'flex', justifyContent: 'space-between', ...T.meta, color: B.textFaint, margin: '12px 0 4px', fontFeatureSettings: "'tnum'" }}>
        <span>{total} match{total === 1 ? '' : 'es'} · {filters.window === 'l30' ? '30d' : 'book'}</span>
        <span>{thinN ? `${thinN} thin` : ''}</span>
      </div>
      {rows.length ? (
        <div style={{
          display: isMobile ? 'none' : 'grid',
          gridTemplateColumns: FIND_GRID,
          gap: '0 12px',
          padding: '0.85rem 0.15rem 0.35rem',
          borderBottom: `1px solid ${B.line}`,
        }}
        >
          <Head>Sharp</Head>
          <Head>Record</Head>
          <Head align="right">ROI</Head>
          <Head align="right">Close</Head>
          <Head align="right">Avg</Head>
          <Head align="right"> </Head>
        </div>
      ) : (
        <div style={{ ...T.body, color: B.textFaint, padding: '1.2rem 0' }}>Widen the cut, or drop the 100-bet floor.</div>
      )}
      {rows.map((row) => {
        const thin = (row.n || 0) < HONEST_PCT_N;
        const form = row.heat?.key === 'hot' || row.heat?.key === 'cold'
          ? `${row.heat.label} ${row.heat.window} ${row.heat.record}`
          : null;
        const close = Number.isFinite(row.clv?.pctPos) ? `${row.clv.pctPos}%` : '—';
        const closeTone = Number.isFinite(row.clv?.pctPos) && row.clv.pctPos >= 55 ? B.goldSoft : B.textFaint;
        const open = openId === row.walletShort;
        return (
          <div key={row.walletShort}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setOpenId(open ? null : row.walletShort)}
            onKeyDown={(e) => {
              if (e.target !== e.currentTarget) return;
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(open ? null : row.walletShort); }
            }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'minmax(0, 1fr) auto auto' : FIND_GRID,
              gap: isMobile ? '2px 12px' : '0 12px',
              alignItems: 'center',
              padding: '0.85rem 0.15rem 0.85rem 0.55rem',
              borderBottom: open ? 'none' : `1px solid ${B.hair}`,
              cursor: 'pointer',
              boxShadow: open ? `inset 3px 0 0 ${B.gold}` : 'none',
              background: open ? 'rgba(212,175,55,0.05)' : 'transparent',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ ...T.name, color: B.text }}>{row.tag}</div>
              <div style={{ ...T.meta, color: B.textMuted, marginTop: 3, fontFeatureSettings: "'tnum'" }}>
                {[row.sport, row.marketLabel, thin ? 'Thin' : null].filter(Boolean).join('   ·   ')}
              </div>
              {isMobile && form ? <div style={{ ...T.meta, color: heatColor(row.heat), marginTop: 2 }}>{form}</div> : null}
            </div>
            {isMobile ? null : (
              <div>
                <div style={{ ...T.figure, color: B.textSec, fontSize: '0.88rem' }}>
                  {row.honest?.record || '—'}
                  {row.honest?.showPct ? <span style={{ color: B.textFaint }}> · {row.honest.wr}%</span> : null}
                </div>
                {form ? <div style={{ ...T.meta, color: heatColor(row.heat), marginTop: 3 }}>{form}</div> : (
                  <div style={{ ...T.meta, color: B.textFaint, marginTop: 3 }}>{row.n ? `${row.n} bets` : ''}</div>
                )}
              </div>
            )}
            <div style={{ ...T.figure, color: thin ? B.goldSoft : pnlColor(row.roi, B.textFaint), textAlign: 'right' }}>
              {Number.isFinite(row.roi) ? `${row.roi}%` : '—'}
              {isMobile ? <div style={{ ...T.meta, color: B.textFaint, fontWeight: 500, marginTop: 2 }}>{row.n ? `${row.n} bets` : ''}</div> : null}
            </div>
            {isMobile ? null : (
              <div style={{ ...T.figure, color: closeTone, textAlign: 'right', fontSize: '0.88rem' }}>{close}</div>
            )}
            {isMobile ? null : (
              <div style={{ ...T.figure, color: B.textSec, textAlign: 'right', fontSize: '0.88rem' }}>
                {row.usual ? fmtVol(row.usual, { signed: false }) : '—'}
              </div>
            )}
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                aria-label={`Add ${row.tag}`}
                onClick={(e) => { e.stopPropagation(); onAdd(row); }}
                style={{ ...goldBtn, padding: '0.28rem 0.62rem' }}
              >
                Add
              </button>
            </div>
          </div>
          {open && dossier ? <SharpProfile dossier={dossier} isMobile={isMobile} /> : null}
          </div>
        );
      })}
    </div>
  );
}

export default function MySharpsDesk({
  ready = false,
  signedIn = false,
  roster = [],
  walletProfiles = null,
  shorts = [],
  actionRows = [],
  weekRows = [],
  recentLegs = [],
  isMobile = false,
  onRename = null,
  onRemove = null,
  onAdd = null,
  onTail = null,
  onUntail = null,
  onRoomChange = null,
  tails = {},
  cap = 40,
}) {
  const [room, setRoomState] = useState(roomMemory);
  const [selected, setSelected] = useState(null);
  const [nameFocus, setNameFocus] = useState(null);
  const [draft, setDraft] = useState(null);
  const [notice, setNotice] = useState('');
  const [betLens, setBetLens] = useState(null);
  const [openBet, setOpenBet] = useState(null);
  const [filters, setFilters] = useState({
    sport: 'All', market: 'All', window: 'book', minBets: 0, minRoi: null, sort: 'roi',
  });

  const setRoom = (next) => {
    roomMemory = next;
    setRoomState(next);
  };

  useEffect(() => { onRoomChange?.(room); }, [room, onRoomChange]);

  const holdings = useMemo(
    () => buildDeskHoldings({ roster, walletProfiles }),
    [roster, walletProfiles],
  );
  const names = useMemo(() => {
    const map = {};
    for (const h of holdings) if (h.name) map[h.walletShort] = h.name;
    return map;
  }, [holdings]);

  const bookSource = weekRows?.length ? weekRows : actionRows;
  const bookBoard = useMemo(() => buildMySharpsBoard(bookSource), [bookSource]);
  const betBoard = useMemo(() => buildMySharpsBoard(actionRows), [actionRows]);
  const snapshot = useMemo(
    () => buildPortfolioSnapshot({ holdings, tickets: bookBoard.tickets, tails, legs: recentLegs }),
    [holdings, bookBoard, tails, recentLegs],
  );
  const groups = useMemo(
    () => groupPortfolioBets(betBoard.tickets, { names, tails }),
    [betBoard, names, tails],
  );
  const tailCards = useMemo(() => summarizeTails(tails, recentLegs).cards, [tails, recentLegs]);
  const found = useMemo(
    () => buildFindCandidates(walletProfiles, { exclude: shorts, ...filters }),
    [walletProfiles, shorts, filters],
  );

  const focus = holdings.some((h) => h.walletShort === selected) ? selected : null;
  const holding = holdings.find((h) => h.walletShort === focus) || null;
  const betCount = betBoard.tickets.length;

  const openDraft = (item, suggested, patch) => {
    setDraft((cur) => {
      if (patch && cur?.id === item.id) return { ...cur, ...patch };
      if (cur?.id === item.id && !patch) return null;
      const price = item.americanOdds != null ? String(item.americanOdds) : (item.americanLabel || '');
      return { id: item.id, price: String(price).replace('−', '-'), stake: suggested ? String(suggested) : '' };
    });
  };

  const commitTail = async (item, form) => {
    const res = await onTail?.(item, { myAmerican: form.price, stake: form.stake });
    if (res?.ok) setDraft(null);
  };

  const addWallet = async (row) => {
    const res = await onAdd?.({
      walletShort: row.walletShort,
      sport: row.sport,
      marketType: row.market,
    });
    if (res?.reason === 'cap') {
      setNotice(`List is full · ${cap}`);
      return;
    }
    if (res?.ok) {
      setNotice('');
      setRoom('book');
      setSelected(row.walletShort);
      setNameFocus(row.walletShort);
    }
  };

  if (!ready) {
    return (
      <div style={{ padding: '2.4rem 0 1rem' }}>
        <div style={{ ...T.hero, fontSize: '1.7rem', color: B.text }}>
          {signedIn ? 'Star the wallets you trust.' : 'Sign in to keep a list.'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: '0.2rem 0 2.6rem' }} data-room={room}>
      <style>{`.ms-name::placeholder{color:${B.textFaint};}.ms-scale{accent-color:#D4AF37;width:148px;}`}</style>
      <RoomBar room={room} onChange={setRoom} betCount={betCount} />

      {room === 'book' ? (
        <>
          <Hero snapshot={snapshot} isMobile={isMobile} onOpenBets={() => setRoom('bets')} />
          {holdings.length ? <BookVisual holdings={holdings} isMobile={isMobile} /> : null}
          {!holdings.length ? (
            <div style={{ padding: '1.6rem 0 0.4rem' }}>
              <div style={{ ...T.hero, fontSize: '1.45rem', color: B.text }}>Nobody on the list</div>
              <button type="button" onClick={() => setRoom('find')} style={{ ...goldBtn, marginTop: 14 }}>Find sharps</button>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'minmax(0, 1fr) auto' : HOLD_GRID,
                gap: '0 14px',
                padding: '1.15rem 0.35rem 0.4rem 0.7rem',
                borderBottom: `1px solid ${B.line}`,
              }}
              >
                <Head>Sharp</Head>
                {isMobile ? null : <Head>Record</Head>}
                <Head align="right">30d</Head>
                {isMobile ? null : <Head align="right">ROI</Head>}
                {isMobile ? null : <Head align="right">Close</Head>}
                {isMobile ? null : <Head align="right">Open</Head>}
              </div>
              {holdings.map((row) => (
                <React.Fragment key={row.walletShort}>
                  <HoldingRow
                    row={row}
                    selected={focus === row.walletShort}
                    isMobile={isMobile}
                    startEditing={nameFocus === row.walletShort}
                    onToggle={() => setSelected((cur) => (cur === row.walletShort ? null : row.walletShort))}
                    onOpen={() => setSelected(row.walletShort)}
                    onRename={(name) => {
                      setNameFocus(null);
                      onRename?.(row.walletShort, name);
                    }}
                  />
                  {focus === row.walletShort && holding ? (
                    <MarketBook
                      holding={holding}
                      onRemove={() => {
                        const id = holding.walletShort;
                        setSelected(null);
                        onRemove?.(id);
                      }}
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </>
          )}
        </>
      ) : null}

      {room === 'bets' ? (
        <>
          <BetsHero groups={groups} tails={snapshot.tails} isMobile={isMobile} lens={betLens} onLens={setBetLens} />
          <TailStrip cards={tailCards} onUntail={(id) => onUntail?.(id)} />
          {(!betLens || betLens === 'together') ? <BetGroup id="bets-together" title="Together" tone={B.goldSoft} items={groups.together} isMobile={isMobile} draft={draft} onDraft={openDraft} onTail={commitTail} onUntail={(id) => onUntail?.(id)} walletProfiles={walletProfiles} expandedId={openBet} onToggle={(id) => setOpenBet((cur) => (cur === id ? null : id))} /> : null}
          {(!betLens || betLens === 'pressing') ? <BetGroup id="bets-pressing" title="Pressing" tone="#F59E0B" items={groups.pressing} isMobile={isMobile} draft={draft} onDraft={openDraft} onTail={commitTail} onUntail={(id) => onUntail?.(id)} walletProfiles={walletProfiles} expandedId={openBet} onToggle={(id) => setOpenBet((cur) => (cur === id ? null : id))} /> : null}
          {(!betLens || betLens === 'split') ? <BetGroup id="bets-split" title="Split" tone={B.red} items={groups.split} isMobile={isMobile} draft={draft} onDraft={openDraft} onTail={commitTail} onUntail={(id) => onUntail?.(id)} walletProfiles={walletProfiles} expandedId={openBet} onToggle={(id) => setOpenBet((cur) => (cur === id ? null : id))} /> : null}
          {(!betLens || betLens === 'rest') ? <BetGroup id="bets-rest" title="The rest" tone={B.textSec} items={groups.rest} isMobile={isMobile} draft={draft} onDraft={openDraft} onTail={commitTail} onUntail={(id) => onUntail?.(id)} walletProfiles={walletProfiles} expandedId={openBet} onToggle={(id) => setOpenBet((cur) => (cur === id ? null : id))} /> : null}
        </>
      ) : null}

      {room === 'find' ? (
        <FindRoom
          rows={found.rows}
          total={found.total}
          savedCount={shorts.length}
          cap={cap}
          filters={filters}
          setFilters={setFilters}
          onAdd={addWallet}
          notice={notice}
          isMobile={isMobile}
          walletProfiles={walletProfiles}
        />
      ) : null}
    </div>
  );
}
