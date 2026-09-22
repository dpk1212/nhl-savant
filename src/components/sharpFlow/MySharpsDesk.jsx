/**
 * My Sharps — a book the customer runs.
 * Portfolio is the fund. Bets are the decisions. Find is how the list gets built.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import {
  buildDeskHoldings,
  buildFindCandidates,
  buildMySharpsBoard,
  buildPortfolioSnapshot,
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
const FIND_SPORTS = ['All', 'MLB', 'NFL', 'NBA', 'NHL', 'CFB', 'CBB', 'SOC', 'UFC', 'WNBA'];
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

function BetCard({ item, isMobile, draft, onDraft, onTail, onUntail, suggestedStake }) {
  const tailed = item.tail;
  const edge = item.split ? B.red : item.shared ? B.gold : (item.sizeText ? '#F59E0B' : B.line);
  const open = draft?.id === item.id;
  const clock = fmtClock(item.commenceMs);
  return (
    <div style={{
      borderRadius: 12,
      borderTop: `1px solid ${open ? B.goldBorder : B.line}`,
      borderRight: `1px solid ${open ? B.goldBorder : B.line}`,
      borderBottom: `1px solid ${open ? B.goldBorder : B.line}`,
      borderLeft: `3px solid ${edge}`,
      background: B.card,
      padding: isMobile ? '0.85rem 0.85rem' : '0.9rem 1rem',
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ ...T.name, color: item.shared && !item.split ? B.goldSoft : B.text, fontSize: '1.02rem' }}>
            {item.pick}
          </div>
          <div style={{ ...T.meta, color: B.textMuted, marginTop: 4 }}>
            {[item.matchup, clock, item.sport].filter(Boolean).join('   ·   ')}
          </div>
          <div style={{ ...T.meta, color: item.whoOpposed ? B.red : B.textSec, marginTop: 4, fontFeatureSettings: "'tnum'" }}>
            {item.who}
            {item.sizeText ? `   ·   ${item.sizeText}` : ''}
            {item.pinMove === 'with' ? '   ·   With the line' : ''}
            {item.pinMove === 'against' ? '   ·   Against the line' : ''}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ ...T.figure, color: B.goldSoft }}>{fmtVol(item.invested, { signed: false })}</div>
          <div style={{ ...T.figure, color: B.text, marginTop: 2, fontSize: '0.88rem' }}>{item.americanLabel || fmtPrice(item.americanOdds)}</div>
        </div>
      </div>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        {tailed && !open ? (
          <div style={{ ...T.meta, color: B.goldSoft, fontFeatureSettings: "'tnum'" }}>
            Tailed {fmtPrice(tailed.myAmerican)}
            {tailed.stake ? ` · ${fmtVol(tailed.stake, { signed: false })}` : ''}
          </div>
        ) : <span />}
        {tailed && !open ? (
          <button type="button" onClick={() => onUntail(item.id)} style={quietBtn}>Untail</button>
        ) : (
          <button type="button" onClick={() => onDraft(item, suggestedStake)} style={goldBtn}>
            {open ? 'Close' : 'Tail'}
          </button>
        )}
      </div>
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

function BetGroup({ title, tone, items, money, isMobile, draft, onDraft, onTail, onUntail, walletProfiles }) {
  if (!items.length) return null;
  return (
    <section style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div style={{ ...T.kicker, color: tone }}>{title}</div>
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
          />
        ))}
      </div>
    </section>
  );
}

function TailStrip({ cards, onUntail }) {
  if (!cards.length) return null;
  return (
    <section style={{ marginTop: 4 }}>
      <div style={{ ...T.kicker, color: B.goldSoft, marginBottom: 8 }}>My tails</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {cards.map((card) => {
          const result = card.status === 'won' ? 'W' : card.status === 'lost' ? 'L' : 'Open';
          const tone = card.status === 'won' ? B.green : card.status === 'lost' ? B.red : B.goldSoft;
          return (
            <div
              key={card.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto auto auto',
                gap: '0 14px',
                alignItems: 'center',
                padding: '0.55rem 0.2rem',
                borderBottom: `1px solid ${B.hair}`,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ ...T.name, color: B.text, fontSize: '0.9rem' }}>{card.pick || 'Tailed'}</div>
                <div style={{ ...T.meta, color: B.textFaint, marginTop: 2 }}>{card.matchup || ''}</div>
              </div>
              <div style={{ ...T.meta, color: B.textSec, fontFeatureSettings: "'tnum'" }}>{fmtPrice(card.myAmerican)}</div>
              <div style={{ ...T.figure, color: pnlColor(card.pnl, B.textMuted), fontSize: '0.88rem' }}>
                {Number.isFinite(card.pnl) && card.status !== 'open' ? fmtVol(card.pnl) : (card.stake ? fmtVol(card.stake, { signed: false }) : '—')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...T.kicker, color: tone, letterSpacing: '0.08em' }}>{result}</span>
                <button type="button" onClick={() => onUntail(card.id)} style={{ ...quietBtn, padding: '0.2rem 0.45rem' }}>×</button>
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

function FindRoom({
  rows, total, savedCount, cap, filters, setFilters, onAdd, notice,
}) {
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
        <FilterBtn on={filters.minBets === 100} onClick={() => setFilters((f) => ({ ...f, minBets: f.minBets === 100 ? 0 : 100 }))}>100+ bets</FilterBtn>
        <FilterBtn on={filters.minRoi === 20} onClick={() => setFilters((f) => ({ ...f, minRoi: f.minRoi === 20 ? null : 20 }))}>20%+ ROI</FilterBtn>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...T.meta, color: B.textFaint, marginBottom: 6, fontFeatureSettings: "'tnum'" }}>
        <span>{total} match{total === 1 ? '' : 'es'} · {filters.window === 'l30' ? '30d' : 'book'}</span>
        <span>{savedCount}/{cap}</span>
      </div>
      {notice ? <div style={{ ...T.meta, color: B.goldSoft, marginBottom: 8 }}>{notice}</div> : null}
      {!rows.length ? (
        <div style={{ ...T.body, color: B.textFaint, padding: '1.2rem 0' }}>No wallets clear these filters.</div>
      ) : rows.map((row) => (
        <div
          key={row.walletShort}
          style={{
            display: 'grid',
            gridTemplateColumns: '28px minmax(0, 1.3fr) auto auto',
            gap: '4px 12px',
            alignItems: 'center',
            padding: '0.78rem 0.15rem',
            borderBottom: `1px solid ${B.hair}`,
          }}
        >
          <button
            type="button"
            aria-label={`Add ${row.tag}`}
            onClick={() => onAdd(row)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: B.textFaint }}
          >
            <Star size={15} />
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ ...T.name, color: B.text }}>{row.tag}</div>
            <div style={{ ...T.meta, color: B.textMuted, marginTop: 3, fontFeatureSettings: "'tnum'" }}>
              {[row.sport, row.marketLabel, row.honest?.text, row.n ? `${row.n} bets` : null].filter(Boolean).join('   ·   ')}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...T.figure, color: pnlColor(row.roi, B.textFaint) }}>
              {Number.isFinite(row.roi) ? `${row.roi}%` : '—'}
            </div>
            <div style={{ ...T.meta, color: B.textFaint, marginTop: 2 }}>
              {Number.isFinite(row.clv?.pctPos) ? `close ${row.clv.pctPos}%` : row.window}
            </div>
          </div>
          <div style={{ ...T.figure, color: B.textSec, textAlign: 'right', fontSize: '0.82rem' }}>
            {row.usual ? fmtVol(row.usual, { signed: false }) : '—'}
            <div style={{ ...T.meta, color: B.textFaint, fontWeight: 500, marginTop: 2 }}>avg</div>
          </div>
        </div>
      ))}
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
  const [filters, setFilters] = useState({
    sport: 'All', market: 'All', window: 'book', minBets: 0, minRoi: null,
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
      <style>{`.ms-name::placeholder{color:${B.textFaint};}`}</style>
      <RoomBar room={room} onChange={setRoom} betCount={betCount} />

      {room === 'book' ? (
        <>
          <Hero snapshot={snapshot} isMobile={isMobile} onOpenBets={() => setRoom('bets')} />
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
          <TailStrip cards={tailCards} onUntail={(id) => onUntail?.(id)} />
          <BetGroup title="Together" tone={B.goldSoft} items={groups.together} money={groups.together.reduce((s, t) => s + (t.invested || 0), 0)} isMobile={isMobile} draft={draft} onDraft={openDraft} onTail={commitTail} onUntail={(id) => onUntail?.(id)} walletProfiles={walletProfiles} />
          <BetGroup title="Pressing" tone="#F59E0B" items={groups.pressing} money={groups.pressing.reduce((s, t) => s + (t.invested || 0), 0)} isMobile={isMobile} draft={draft} onDraft={openDraft} onTail={commitTail} onUntail={(id) => onUntail?.(id)} walletProfiles={walletProfiles} />
          <BetGroup title="Split" tone={B.red} items={groups.split} money={groups.split.reduce((s, t) => s + (t.invested || 0), 0)} isMobile={isMobile} draft={draft} onDraft={openDraft} onTail={commitTail} onUntail={(id) => onUntail?.(id)} walletProfiles={walletProfiles} />
          <BetGroup title="The rest" tone={B.textMuted} items={groups.rest} money={groups.rest.reduce((s, t) => s + (t.invested || 0), 0)} isMobile={isMobile} draft={draft} onDraft={openDraft} onTail={commitTail} onUntail={(id) => onUntail?.(id)} walletProfiles={walletProfiles} />
          {!betCount && !tailCards.length ? (
            <div style={{ ...T.body, color: B.textFaint, padding: '1.2rem 0' }}>Nothing up on this slate.</div>
          ) : null}
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
        />
      ) : null}
    </div>
  );
}
