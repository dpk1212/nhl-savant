/**
 * My Sharps — a book the customer runs.
 * Portfolio is the fund. Bets are the decisions. Find is how the list gets built.
 */
import React, { useEffect, useId, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import {
  HONEST_PCT_N,
  buildDeskHoldings,
  buildFindCandidates,
  buildMySharpsBoard,
  buildPortfolioSnapshot,
  buildPortfolioStage,
  buildSharpDossier,
  portfolioWindowBook,
  summarizeTape,
  blendRoi,
  groupPortfolioBets,
  marketTape,
  openPlayFace,
  rowsForBetsFeed,
  sizeTiersForWallet,
  suggestTailStake,
  summarizeTails,
} from '../../lib/mySharpsDesk.js';
import { betsFeedKey, betsFeedOn } from '../../lib/mySharps.js';
import { getTeamIdentity, shortTeamNick, teamLogoUrl } from '../../utils/teamIdentity.js';

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

const SHARP_GRID = 'minmax(0, 1.15fr) minmax(72px, 1.2fr) 92px 52px 56px 76px';
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

function heatLine(heat) {
  if (heat?.key === 'hot' || heat?.key === 'cold') return `${heat.label} ${heat.window} ${heat.record}`;
  if (heat?.record && heat.window) return `${heat.window} ${heat.record}`;
  return null;
}

function openOnSport(holding, sport, actionRows) {
  if (!sport) return { n: holding.openN || 0, invested: holding.openInvested || 0 };
  const mine = (actionRows || []).filter((r) =>
    sameSharp(r.walletShort, holding.walletShort)
    && String(r.sport || '').toUpperCase() === sport
  );
  return {
    n: mine.length,
    invested: mine.reduce((s, r) => s + (Number(r.invested) || 0), 0),
  };
}

function PortfolioSharp({
  row, face, maxAbs, selected, isMobile, onToggle, onOpen, onRename, startEditing,
}) {
  const form = heatLine(face.heat);
  const close = Number.isFinite(row.clv?.pctPos) ? `${row.clv.pctPos}%` : '—';
  const closeTone = Number.isFinite(row.clv?.pctPos) && row.clv.pctPos >= 55 ? B.goldSoft : B.textFaint;
  const record = face.honest?.record
    ? `${face.honest.record}${face.honest.showPct ? ` · ${face.honest.wr}%` : ''}`
    : null;
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
        gridTemplateColumns: isMobile ? 'minmax(0, 1fr) auto' : SHARP_GRID,
        gap: isMobile ? '6px 12px' : '0 14px',
        alignItems: 'center',
        padding: '0.72rem 0.15rem 0.72rem 0.35rem',
        boxShadow: selected ? `inset 3px 0 0 ${B.gold}` : 'none',
        background: selected ? 'rgba(212,175,55,0.05)' : 'transparent',
        cursor: 'pointer',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <NameField
          name={row.name}
          tag={row.tag}
          selected={selected}
          startEditing={startEditing}
          onRename={onRename}
          onOpen={onOpen}
        />
        <div style={{ ...T.meta, color: B.textMuted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>
          {isMobile ? (
            <>
              {face.honest?.text && face.honest.text !== '—' ? face.honest.text : '—'}
              {form ? <span style={{ color: heatColor(face.heat) }}>{` · ${form}`}</span> : null}
              {Number.isFinite(face.roi) ? ` · ${face.roi}% ROI` : ''}
              {Number.isFinite(row.clv?.pctPos) ? ` · close ${row.clv.pctPos}%` : ''}
              {face.openInvested ? ` · ${fmtVol(face.openInvested, { signed: false })} open` : ''}
            </>
          ) : (
            <>
              {record || '—'}
              {form ? <span style={{ color: heatColor(face.heat) }}>{record ? ` · ${form}` : form}</span> : null}
            </>
          )}
        </div>
      </div>
      {isMobile ? null : <WeightBar value={face.pnl} maxAbs={maxAbs} />}
      <div style={{ ...T.figure, color: pnlColor(face.pnl), textAlign: 'right', fontSize: '1.02rem' }}>
        {Number.isFinite(face.pnl) ? fmtVol(face.pnl) : '—'}
      </div>
      {isMobile ? null : (
        <div style={{ ...T.figure, color: pnlColor(face.roi, B.textFaint), textAlign: 'right', fontSize: '0.82rem' }}>
          {Number.isFinite(face.roi) ? `${face.roi}%` : '—'}
        </div>
      )}
      {isMobile ? null : (
        <div style={{ ...T.figure, color: closeTone, textAlign: 'right', fontSize: '0.82rem' }}>{close}</div>
      )}
      {isMobile ? null : (
        <div style={{ ...T.figure, color: face.openInvested ? B.goldSoft : B.textFaint, textAlign: 'right', fontSize: '0.82rem' }}>
          {face.openInvested ? fmtVol(face.openInvested, { signed: false }) : '—'}
          {face.openN > 1 ? <span style={{ ...T.meta, color: B.textFaint, marginLeft: 4 }}>{face.openN}</span> : null}
        </div>
      )}
      {isMobile ? <div style={{ gridColumn: '1 / -1' }}><WeightBar value={face.pnl} maxAbs={maxAbs} /></div> : null}
    </div>
  );
}

function sameSharp(rowShort, holdingShort) {
  const a = String(rowShort || '').toLowerCase();
  const b = String(holdingShort || '').toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  return a.slice(-6) === b || b.slice(-6) === a || a.slice(-6) === b.slice(-6);
}

function betsFollowLine(groups, betsOff) {
  const off = new Set(betsOff || []);
  const on = [];
  let all = 0;
  for (const g of groups) {
    for (const m of g.markets) {
      all += 1;
      const key = betsFeedKey(g.sport, m.market);
      if (key && !off.has(key)) on.push(`${g.sport} ${m.label}`);
    }
  }
  if (!all || on.length === all) return 'Bets follows every market.';
  if (!on.length) return 'Bets is off for every market.';
  return `Bets follows ${on.join(', ')}.`;
}

function sizeMark(ratio) {
  const n = Number(ratio);
  if (!Number.isFinite(n) || n < 1.15) return null;
  return `${n.toFixed(1)}×`;
}

function relativeMultiple(invested, ratio, usual) {
  const stored = Number(ratio);
  if (Number.isFinite(stored) && stored > 0) return stored;
  const u = Number(usual);
  const inv = Number(invested);
  if (u > 0 && inv > 0) return inv / u;
  return null;
}

function relativeLabel(multiple) {
  const n = Number(multiple);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n >= 0.95 && n < 1.05) return '1×';
  return `${n >= 10 ? n.toFixed(0) : n.toFixed(1)}×`;
}

function tierWrColor(tier) {
  if (tier?.wr == null) return B.textMuted;
  if (tier.wr >= 55) return B.green;
  if (tier.wr <= 45) return B.red;
  return B.text;
}

function BetsSwitch({ on, onClick, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      style={{
        width: 46,
        height: 26,
        borderRadius: 999,
        border: `1px solid ${on ? B.goldBorder : B.line}`,
        background: on ? 'rgba(212,175,55,0.42)' : 'rgba(255,255,255,0.06)',
        padding: 3,
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: on ? 'flex-end' : 'flex-start',
      }}
    >
      <span style={{
        width: 18,
        height: 18,
        borderRadius: 999,
        background: on ? '#F3E3AC' : '#64748B',
        boxShadow: on ? '0 0 8px rgba(212,175,55,0.7)' : 'none',
      }}
      />
    </button>
  );
}

function SizeTierStrip({ tiers }) {
  if (!tiers?.tiers?.length) return null;
  const rated = tiers.tiers.filter((t) => t.wr != null);
  const bestWr = rated.reduce((m, t) => Math.max(m, t.wr), 0);
  return (
    <div style={{
      marginTop: 14,
      padding: '0.9rem 0.8rem 0.8rem',
      borderRadius: 14,
      border: `1px solid ${B.goldBorder}`,
      background: 'linear-gradient(180deg, rgba(212,175,55,0.14) 0%, rgba(255,255,255,0.03) 46%, rgba(0,0,0,0.15) 100%)',
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div style={{ ...T.kicker, color: B.gold, letterSpacing: '0.14em' }}>Win rate by size</div>
        {tiers.usual ? (
          <div style={{ ...T.meta, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
            Usual {fmtVol(tiers.usual, { signed: false })}
          </div>
        ) : null}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 8,
        marginTop: 12,
      }}
      >
        {tiers.tiers.map((tier) => {
          const lead = tier.wr != null && tier.wr === bestWr && tier.wr >= 55;
          const color = tierWrColor(tier);
          return (
            <div
              key={tier.id}
              style={{
                borderRadius: 12,
                padding: '0.62rem 0.45rem 0.7rem',
                background: lead ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.28)',
                border: `1px solid ${lead ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: lead ? '0 0 18px rgba(16,185,129,0.16)' : 'none',
              }}
            >
              <div style={{ ...T.kicker, color: lead ? B.green : B.goldSoft, letterSpacing: '0.08em' }}>{tier.kicker}</div>
              <div style={{ ...T.hero, color, marginTop: 8, fontSize: '1.72rem' }}>
                {tier.wr != null ? `${tier.wr}%` : (tier.record || '—')}
              </div>
              <div style={{ marginTop: 10, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                {tier.wr != null ? (
                  <div style={{ width: `${Math.max(tier.wr, 8)}%`, height: '100%', borderRadius: 99, background: color }} />
                ) : null}
              </div>
              <div style={{ ...T.meta, color: tier.wr != null ? B.textSec : B.textFaint, marginTop: 8, fontFeatureSettings: "'tnum'" }}>
                {tier.wr != null && tier.record ? tier.record : (tier.n ? `${tier.n} bets` : '—')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarketBook({ holding, walletProfiles, actionRows = [], onRemove, onToggleBets, sportFilter = null }) {
  const [openKey, setOpenKey] = useState(null);
  const sizeTiers = sizeTiersForWallet(walletProfiles, holding.walletShort);
  const label = holding.name || holding.tag;
  const groups = [];
  const bySport = new Map();
  for (const m of holding.markets || []) {
    if (sportFilter && m.sport !== sportFilter) continue;
    if (!bySport.has(m.sport)) bySport.set(m.sport, []);
    bySport.get(m.sport).push(m);
  }
  for (const [sport, markets] of bySport) groups.push({ sport, markets });
  const openRows = (actionRows || []).filter((r) => sameSharp(r.walletShort, holding.walletShort));

  return (
    <div
      style={{
        margin: '0 0 0.35rem',
        padding: '0.85rem 0.85rem 0.45rem',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${B.line}`,
      }}
      onClick={(e) => e.stopPropagation()}
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
      {groups.length ? (
        <div style={{ ...T.meta, color: B.textMuted, marginTop: 4 }}>
          {betsFollowLine(groups, holding.betsOff)}
        </div>
      ) : null}
      <SizeTierStrip tiers={sizeTiers} />
      {groups.length ? groups.map((g) => (
        <div key={g.sport} style={{ marginTop: 10 }}>
          <div style={{ ...T.kicker, color: B.textSec, letterSpacing: '0.08em', marginBottom: 4 }}>{g.sport}</div>
          {g.markets.map((m) => {
            const key = `${g.sport}:${m.market}`;
            const open = openKey === key;
            const feedOn = betsFeedOn(holding, g.sport, m.market);
            const mineOpen = openRows.filter((r) => {
              if (String(r.sport || '').toUpperCase() !== g.sport) return false;
              return String(r.marketType || '').toUpperCase() === m.market;
            });
            const hot = mineOpen.reduce((best, r) => {
              const ratio = Number(r.displaySizeRatio ?? r.sizeRatio);
              return Number.isFinite(ratio) && ratio > best ? ratio : best;
            }, 0);
            const mark = sizeMark(hot);
            const record = m.honest?.record
              ? `All time ${m.honest.record}${m.n ? ` · ${m.n} bets` : ''}`
              : (m.n ? `All time · ${m.n} bets` : '—');
            const tape = open ? marketTape(walletProfiles, holding.walletShort, g.sport, m.market) : null;
            return (
              <div key={key} style={{ borderTop: `1px solid ${B.hair}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenKey(open ? null : key)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '6px 14px',
                    padding: '0.48rem 0',
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ ...T.name, color: B.text, fontSize: '0.84rem', minWidth: 64 }}>{m.label}</span>
                  <span style={{ ...T.meta, color: B.textMuted, fontFeatureSettings: "'tnum'", flex: '1 1 120px' }}>{record}</span>
                  <span style={{ ...T.figure, color: pnlColor(m.roi, B.textFaint), fontSize: '0.82rem' }}>
                    Book {Number.isFinite(m.roi) ? `${m.roi}%` : '—'}
                  </span>
                  <span style={{ ...T.figure, color: pnlColor(m.l30?.pnl, B.textFaint), fontSize: '0.82rem' }}>
                    30d {Number.isFinite(m.l30?.pnl) ? fmtVol(m.l30.pnl) : '—'}
                  </span>
                  <span style={{ ...T.meta, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
                    {m.usual ? `avg ${fmtVol(m.usual, { signed: false })}` : 'avg —'}
                    {mark ? <span style={{ color: B.goldSoft }}> · {mark}</span> : null}
                  </span>
                </button>
                  <BetsSwitch
                    on={feedOn}
                    label={feedOn ? `Bets includes ${g.sport} ${m.label}` : `Bets skips ${g.sport} ${m.label}`}
                    onClick={() => {
                      if (onToggleBets) onToggleBets(holding.walletShort, g.sport, m.market);
                    }}
                  />
                </div>
                {open ? (
                  <MarketPlays openRows={mineOpen} tape={tape} usual={m.usual} />
                ) : null}
              </div>
            );
          })}
        </div>
      )) : (
        <div style={{ ...T.meta, color: B.textFaint, padding: '0.7rem 0' }}>
          {holding.honest?.record ? `${holding.honest.text} across the book.` : 'Thin sample.'}
        </div>
      )}
    </div>
  );
}

function SizeRail({ invested, maxInv, multiple }) {
  const pct = maxInv > 0 && invested > 0 ? Math.min(100, (invested / maxInv) * 100) : 0;
  const hot = Number(multiple) >= 1.15;
  const color = hot ? B.goldSoft : B.textMuted;
  if (!pct) return null;
  return (
    <div style={{ marginTop: 5, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      <div style={{ width: `${Math.max(pct, 4)}%`, height: '100%', borderRadius: 99, background: color }} />
    </div>
  );
}

function MarketPlays({ openRows, tape, usual }) {
  const graded = tape?.plays || [];
  const maxInv = Math.max(
    1,
    ...graded.map((g) => Number(g.invested) || 0),
    ...openRows.map((r) => Number(r.invested) || 0),
  );
  return (
    <div style={{ padding: '0 0 0.45rem 0.15rem' }}>
      <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em', margin: '2px 0 4px' }}>
        Open
      </div>
      {openRows.length ? openRows.map((r, i) => {
        const ratio = Number(r.displaySizeRatio ?? r.sizeRatio);
        const multiple = relativeMultiple(r.invested, ratio, usual);
        const label = relativeLabel(multiple);
        const face = openPlayFace(r);
        const matchup = r.away && r.home ? `${r.away} @ ${r.home}` : null;
        return (
          <div key={`${r.gameKey}-${r.side}-${i}`} style={{ padding: '0.32rem 0', borderTop: `1px solid ${B.hair}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ ...T.name, color: B.text, fontSize: '0.84rem' }}>
                  {face.name}
                  {face.price ? (
                    <span style={{ color: B.textSec, fontWeight: 550 }}> {face.price}</span>
                  ) : null}
                </div>
                <div style={{ ...T.meta, color: B.textMuted }}>{matchup || 'Open ticket'}</div>
              </div>
              <div style={{ ...T.figure, color: B.goldSoft, fontSize: '0.82rem', textAlign: 'right' }}>
                {fmtVol(r.invested, { signed: false })}
                {label ? (
                  <span style={{ color: multiple >= 1.15 ? B.goldSoft : B.textFaint }}> · {label}</span>
                ) : null}
              </div>
            </div>
            <SizeRail invested={r.invested} maxInv={maxInv} multiple={multiple} />
          </div>
        );
      }) : (
        <div style={{ ...T.meta, color: B.textFaint, padding: '0.25rem 0 0.35rem' }}>Nothing open in this market.</div>
      )}
      <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em', margin: '8px 0 4px' }}>
        {tape?.scope === 'recent' ? 'Older graded' : 'Graded'}
        {tape?.total > graded.length ? ` · ${graded.length} of ${tape.total}` : ''}
      </div>
      {graded.length ? graded.map((leg) => {
        const multiple = relativeMultiple(leg.invested, leg.ratio, usual);
        const label = relativeLabel(multiple);
        return (
          <div key={leg.id} style={{ padding: '0.32rem 0', borderTop: `1px solid ${B.hair}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '52px minmax(0, 1fr) auto', gap: '0 12px', alignItems: 'baseline' }}>
              <div style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'" }}>{leg.date ? leg.date.slice(5) : '—'}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ ...T.name, color: B.text, fontSize: '0.84rem' }}>{leg.pick}</div>
                <div style={{ ...T.meta, color: B.textMuted }}>
                  {[
                    leg.matchup,
                    leg.invested ? fmtVol(leg.invested, { signed: false }) : null,
                  ].filter(Boolean).join(' · ') || '—'}
                  {label ? (
                    <span style={{ color: multiple >= 1.15 ? B.goldSoft : B.textFaint }}> · {label}</span>
                  ) : null}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...T.kicker, letterSpacing: '0.08em', color: leg.won ? B.green : B.red }}>{leg.won ? 'W' : 'L'}</div>
                <div style={{ ...T.figure, color: pnlColor(leg.pnl, B.textFaint), fontSize: '0.82rem' }}>
                  {Number.isFinite(leg.pnl) ? fmtVol(leg.pnl) : ''}
                </div>
              </div>
            </div>
            <div style={{ marginLeft: 64 }}>
              <SizeRail invested={leg.invested} maxInv={maxInv} multiple={multiple} />
            </div>
          </div>
        );
      }) : (
        <div style={{ ...T.meta, color: B.textFaint, padding: '0.25rem 0' }}>No graded plays in this market yet.</div>
      )}
    </div>
  );
}

function sumInvested(items) {
  return (items || []).reduce((s, t) => s + (Number(t.invested) || 0), 0);
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

function heatWord(heat) {
  if (!heat?.record || heat.key === 'quiet') return null;
  if (heat.key === 'hot') return 'Hot';
  if (heat.key === 'cold') return 'Cold';
  return 'Even';
}

function SteamBit({ steam }) {
  if (!steam?.show || !steam.tag) return null;
  const gold = steam.goldConfirmed || steam.tier === 'gold';
  const label = steam.goldConfirmed ? steam.tag : `Steam ${steam.tag}`;
  return (
    <span style={{
      ...T.kicker,
      letterSpacing: '0.08em',
      color: gold ? '#1a1404' : '#6EE7B7',
      background: gold
        ? 'linear-gradient(180deg, #F3E3AC 0%, #E8D28A 42%, #D4AF37 100%)'
        : 'rgba(16,185,129,0.12)',
      border: gold ? 'none' : '1px solid rgba(16,185,129,0.35)',
      borderRadius: 999,
      padding: '0.22rem 0.55rem',
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
    }}
    >
      {label}
    </span>
  );
}

function readRecord(record) {
  const m = String(record || '').match(/(\d+)\s*[–-]\s*(\d+)/);
  if (!m) return null;
  return { w: Number(m[1]), l: Number(m[2]) };
}

function sideRollup(lines) {
  let hw = 0;
  let hl = 0;
  let heatN = 0;
  let bw = 0;
  let bl = 0;
  let bookLabel = null;
  let pnl = 0;
  let havePnl = false;
  const roiParts = [];
  for (const line of lines || []) {
    const heat = readRecord(line.heat?.record);
    if (heat) {
      hw += heat.w;
      hl += heat.l;
      heatN += 1;
    }
    if (Number.isFinite(line.book?.wins) && Number.isFinite(line.book?.losses)) {
      bw += line.book.wins;
      bl += line.book.losses;
      bookLabel = line.book.label || bookLabel;
    }
    const mp = Number(line.market?.pnl);
    if (Number.isFinite(mp)) {
      havePnl = true;
      pnl += mp;
      if (Number.isFinite(line.market?.roi)) roiParts.push({ pnl: mp, roi: line.market.roi });
    }
  }
  return {
    l10: heatN ? `${hw}–${hl}` : null,
    book: (bw + bl) > 0 ? `${bw}–${bl}` : null,
    bookLabel: bookLabel || 'Book',
    pnl: havePnl ? pnl : null,
    roi: blendRoi(roiParts),
  };
}

function TeamMark({ name, sport, size = 44 }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? null : teamLogoUrl(name, sport);
  const id = getTeamIdentity(name, sport);
  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        onError={() => setFailed(true)}
        style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0, display: 'block' }}
      />
    );
  }
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 12,
      flexShrink: 0,
      background: `linear-gradient(145deg, ${id.c1}, ${id.c2})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 800,
      fontSize: Math.max(11, size * 0.28),
      letterSpacing: '-0.04em',
    }}
    >
      {id.abbr}
    </div>
  );
}

function crestName(team, item) {
  const t = String(team || '').trim();
  if (!t) return t;
  const nick = t.toLowerCase();
  const pool = [item?.away, item?.home].filter(Boolean);
  const hit = pool.find((name) => {
    const full = String(name).trim();
    const low = full.toLowerCase();
    return low === nick || shortTeamNick(full).toLowerCase() === nick || low.endsWith(` ${nick}`);
  });
  return hit || t;
}

function sideNames(item) {
  const team = String(item?.team || '').trim();
  if (team && !/^(over|under)$/i.test(team)) return [crestName(team, item)];
  return [item?.away, item?.home].filter(Boolean);
}

function MatchMarks({ item, size = 44 }) {
  const names = sideNames(item);
  if (!names.length) return null;
  if (names.length === 1) return <TeamMark name={names[0]} sport={item.sport} size={size} />;
  const mark = Math.round(size * 0.78);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
      {names.slice(0, 2).map((name) => (
        <TeamMark key={name} name={name} sport={item.sport} size={mark} />
      ))}
    </div>
  );
}

function shortMatchup(item) {
  if (item?.away && item?.home) {
    return `${shortTeamNick(item.away, item.home)} @ ${shortTeamNick(item.home, item.away)}`;
  }
  return item?.matchup || null;
}

function WhoChip({ line }) {
  const pressing = (line.ratio || 0) >= 1.5;
  const heat = line.heat?.key;
  const color = pressing ? '#F59E0B' : heat === 'hot' ? B.green : heat === 'cold' ? B.red : B.goldSoft;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 5,
      fontFeatureSettings: "'tnum'",
    }}
    >
      <span style={{ ...T.name, color: B.textSec, fontSize: '0.78rem' }}>{line.tag}</span>
      {line.ratio ? (
        <span style={{ ...T.figure, color, fontSize: '0.78rem' }}>{line.ratio.toFixed(1)}×</span>
      ) : null}
    </span>
  );
}

function SharpPlate({ lines, hideChips }) {
  const roll = sideRollup(lines);
  const steam = (lines || []).find((line) => line.steam?.show)?.steam || null;
  const support = [
    roll.book ? `${roll.book} book` : null,
    Number.isFinite(roll.roi) ? `${roll.roi}% ROI` : null,
    roll.l10 ? `L10 ${roll.l10}` : null,
  ].filter(Boolean).join('  ·  ');
  const hero = Number.isFinite(roll.pnl)
    ? { value: fmtVol(roll.pnl), kicker: `${roll.bookLabel} · 30 days`, color: pnlColor(roll.pnl, B.text) }
    : (roll.book
      ? { value: roll.book, kicker: `${roll.bookLabel} book`, color: B.text }
      : null);
  if (!hero && !lines.length) return null;
  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${B.hair}` }}>
      {hero ? (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ ...T.figure, color: hero.color, fontSize: '1.72rem', letterSpacing: '-0.045em', lineHeight: 0.9 }}>{hero.value}</div>
            <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em', marginTop: 6 }}>{hero.kicker}</div>
          </div>
          {steam ? <SteamBit steam={steam} /> : null}
        </div>
      ) : null}
      {support ? (
        <div style={{ ...T.meta, color: B.textSec, marginTop: 6, fontFeatureSettings: "'tnum'" }}>{support}</div>
      ) : null}
      {!hideChips && lines.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: 10 }}>
          {lines.map((line) => (
            <WhoChip key={line.walletShort || line.tag} line={line} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const RECEIPT_COLS = 'minmax(72px, 1.15fr) 58px 88px 64px 72px minmax(64px, 0.8fr) 92px';

function ReceiptHead({ children }) {
  return (
    <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em', textAlign: 'right' }}>{children}</div>
  );
}

function SizeWr({ tier, align = 'left' }) {
  const color = tierWrColor(tier);
  const figure = tier?.wr != null ? `${tier.wr}%` : (tier?.record || '—');
  const sub = tier?.wr != null ? tier.kicker : (tier?.n ? `${tier.n} bets` : null);
  return (
    <div style={{ textAlign: align }}>
      <div style={{ ...T.figure, color, fontSize: '1rem', lineHeight: 1 }}>{figure}</div>
      {sub ? <div style={{ ...T.kicker, color, marginTop: 4, letterSpacing: '0.06em' }}>{sub}</div> : null}
    </div>
  );
}

function SharpReceipt({ line, sport, isMobile }) {
  const pressing = (line.ratio || 0) >= 1.5;
  const heat = heatWord(line.heat);
  const heatColor = line.heat?.key === 'hot' ? B.green : line.heat?.key === 'cold' ? B.red : B.text;
  const bookRoi = Number.isFinite(line.book?.roi) ? line.book.roi : null;
  const size = line.ratio ? `${line.ratio.toFixed(1)}×` : '—';
  const stake = fmtVol(line.invested, { signed: false });
  const l10 = line.heat?.record || '—';
  const book = line.book?.record || '—';
  const month = Number.isFinite(line.marketL30) ? fmtVol(line.marketL30) : '—';
  const sportBit = Number.isFinite(line.sportL30) ? `${sport || 'Sport'} ${fmtVol(line.sportL30)}` : null;

  if (isMobile) {
    return (
      <div style={{ padding: '0.55rem 0', borderTop: `1px solid ${B.hair}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ ...T.name, color: B.text, fontSize: '0.92rem' }}>{line.tag}</span>
          <span style={{ ...T.figure, color: pressing ? '#F59E0B' : B.goldSoft, fontSize: '1rem' }}>{size}</span>
          <span style={{ textAlign: 'right' }}>
            <span style={{ ...T.figure, color: B.goldSoft, fontSize: '1rem' }}>{stake}</span>
            {line.price ? <span style={{ ...T.meta, color: B.text, marginLeft: 6 }}>{line.price}</span> : null}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8, marginTop: 8 }}>
          <div>
            <div style={{ ...T.figure, color: heatColor, fontSize: '0.95rem' }}>{l10}</div>
            <div style={{ ...T.kicker, color: heatColor, marginTop: 3 }}>{heat || 'L10'}</div>
          </div>
          <SizeWr tier={line.sizeTier} />
          <div>
            <div style={{ ...T.figure, color: B.text, fontSize: '0.95rem' }}>{book}</div>
            <div style={{ ...T.kicker, color: bookRoi == null ? B.textFaint : pnlColor(bookRoi, B.textMuted), marginTop: 3 }}>{bookRoi == null ? 'Book' : `${bookRoi}% book`}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...T.figure, color: pnlColor(line.marketL30, B.textMuted), fontSize: '0.95rem' }}>{month}</div>
            <div style={{ ...T.kicker, color: B.textFaint, marginTop: 3 }}>30 days</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: RECEIPT_COLS,
      gap: '0 12px',
      alignItems: 'center',
      padding: '0.62rem 0',
      borderTop: `1px solid ${B.hair}`,
    }}
    >
      <div style={{ ...T.name, color: B.text, fontSize: '0.92rem' }}>{line.tag}</div>
      <div style={{ ...T.figure, color: pressing ? '#F59E0B' : B.goldSoft, fontSize: '1.12rem', textAlign: 'right' }}>{size}</div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...T.figure, color: B.goldSoft, fontSize: '1.08rem', lineHeight: 1 }}>{stake}</div>
        {line.price ? <div style={{ ...T.meta, color: B.text, marginTop: 3 }}>{line.price}</div> : null}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...T.figure, color: heatColor, fontSize: '1rem', lineHeight: 1 }}>{l10}</div>
        {heat ? <div style={{ ...T.kicker, color: heatColor, marginTop: 4, letterSpacing: '0.08em' }}>{heat}</div> : null}
      </div>
      <SizeWr tier={line.sizeTier} align="right" />
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...T.figure, color: B.text, fontSize: '1rem', lineHeight: 1 }}>{book}</div>
        {bookRoi != null ? (
          <div style={{ ...T.meta, color: pnlColor(bookRoi, B.textMuted), marginTop: 3, fontWeight: 700 }}>{bookRoi}%</div>
        ) : null}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...T.figure, color: pnlColor(line.marketL30, B.textMuted), fontSize: '1.08rem', lineHeight: 1 }}>{month}</div>
        {sportBit ? <div style={{ ...T.meta, color: B.textMuted, marginTop: 3 }}>{sportBit}</div> : null}
      </div>
    </div>
  );
}

function BetCard({ item, isMobile, draft, onDraft, onTail, onUntail, suggestedStake, expanded, onToggle }) {
  const tailed = item.tail;
  const edge = item.split ? B.red : item.shared ? B.gold : (item.sizeText ? '#F59E0B' : B.line);
  const open = draft?.id === item.id;
  const clock = fmtClock(item.commenceMs);
  const price = item.americanLabel || fmtPrice(item.americanOdds);
  const lines = item.walletLines || [];
  const lineNote = item.pinMove === 'with' ? 'with the line' : item.pinMove === 'against' ? 'against the line' : null;
  const nSharps = lines.length;
  const rail = item.split
    ? 'linear-gradient(90deg, transparent, #EF4444 30%, #FCA5A5, transparent)'
    : item.shared
      ? 'linear-gradient(90deg, transparent, #D4AF37 35%, #F3E3AC, transparent)'
      : (item.sizeText
        ? 'linear-gradient(90deg, transparent, #F59E0B 35%, #FDE68A, transparent)'
        : `linear-gradient(90deg, transparent, ${edge}, transparent)`);
  return (
    <div style={{
      position: 'relative',
      borderRadius: 14,
      border: `1px solid ${open || tailed || expanded ? B.goldBorder : B.line}`,
      background: betWash(item),
      overflow: 'hidden',
      cursor: 'pointer',
    }}
    onClick={(e) => {
      if (e.target.closest('button, input, label')) return;
      onToggle?.();
    }}
    >
      <div style={{ height: 2, background: rail }} />
      <div style={{ padding: isMobile ? '0.7rem 0.75rem 0.68rem' : '0.78rem 0.95rem 0.72rem' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <MatchMarks item={item} size={isMobile ? 40 : 48} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ ...T.name, color: item.shared && !item.split ? B.goldSoft : B.text, fontSize: isMobile ? '1.15rem' : '1.32rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {item.pick}
            </div>
            <div style={{ ...T.figure, color: B.goldSoft, fontSize: '1.02rem', letterSpacing: '-0.03em' }}>
              {price}
            </div>
          </div>
          <div style={{ ...T.meta, color: B.textMuted, marginTop: 5 }}>
            {[shortMatchup(item), clock, item.sport, nSharps > 1 ? `${nSharps} sharps` : null].filter(Boolean).join('  ·  ')}
            {lineNote ? (
              <span style={{ color: item.pinMove === 'against' ? B.red : B.goldSoft }}>{`  ·  ${lineNote}`}</span>
            ) : null}
            {tailed ? <span style={{ color: B.gold }}>{`  ·  Tailed ${fmtPrice(tailed.myAmerican)}`}</span> : null}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ ...T.figure, color: B.text, fontSize: isMobile ? '1.15rem' : '1.32rem', letterSpacing: '-0.04em', lineHeight: 1 }}>{fmtVol(item.invested, { signed: false })}</div>
          <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em', marginTop: 5 }}>On this side</div>
          <div style={{ marginTop: 6 }}>
            {tailed && !open ? (
              <button type="button" onClick={() => onUntail(item.id)} style={quietBtn}>Untail</button>
            ) : (
              <button type="button" onClick={() => onDraft(item, suggestedStake)} style={goldBtn}>
                {open ? 'Close' : 'Tail'}
              </button>
            )}
          </div>
        </div>
      </div>
      {lines.length ? <SharpPlate lines={lines} hideChips={expanded} /> : null}
      {expanded ? <TicketContext item={item} isMobile={isMobile} /> : null}
      {open ? (
        <TailForm
          item={item}
          draft={draft}
          onDraft={onDraft}
          onTail={onTail}
        />
      ) : null}
      </div>
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
          const result = card.status === 'won' ? 'Won' : card.status === 'lost' ? 'Lost' : card.status === 'push' ? 'Push' : 'Open';
          const tone = card.status === 'won' ? B.green : card.status === 'lost' ? B.red : card.status === 'push' ? B.textSec : B.goldSoft;
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

function fmtSince(key) {
  if (!key) return null;
  const parts = String(key).split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [y, m, d] = parts;
  return new Date(Date.UTC(y, m - 1, d, 17)).toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
  });
}

function AreaChart({ points, height = 210 }) {
  const uid = useId().replace(/:/g, '');
  const pts = (points || []).map((n) => Number(n)).filter((n) => Number.isFinite(n));
  if (pts.length < 2) return null;
  const w = 720;
  const h = height;
  const min = Math.min(0, ...pts);
  const max = Math.max(0, ...pts);
  const span = (max - min) || 1;
  const x = (i) => (i / (pts.length - 1)) * (w - 28) + 14;
  const y = (v) => 16 + (1 - (v - min) / span) * (h - 32);
  const d = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const end = pts[pts.length - 1];
  const color = end >= 0 ? B.green : B.red;
  const zero = y(0);
  const area = `${d} L${x(pts.length - 1).toFixed(1)},${zero.toFixed(1)} L${x(0).toFixed(1)},${zero.toFixed(1)} Z`;
  const grids = [0.25, 0.5, 0.75].map((t) => y(min + span * t));
  const ex = x(pts.length - 1);
  const ey = y(end);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height} role="img" aria-label="Dollar path">
      <defs>
        <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.38" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {grids.map((gy) => (
        <line key={gy} x1="14" x2={w - 14} y1={gy} y2={gy} stroke="rgba(255,255,255,0.04)" />
      ))}
      <line x1="14" x2={w - 14} y1={zero} y2={zero} stroke="rgba(212,175,55,0.35)" strokeDasharray="3 6" />
      <path d={area} fill={`url(#fill-${uid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" filter={`url(#glow-${uid})`} />
      <circle cx={ex} cy={ey} r="7" fill={color} opacity="0.22" />
      <circle cx={ex} cy={ey} r="3.4" fill={color} />
    </svg>
  );
}

function WeightBar({ value, maxAbs, height = 10 }) {
  const n = Number(value) || 0;
  const pct = maxAbs > 0 ? Math.min(100, (Math.abs(n) / maxAbs) * 100) : 0;
  const pos = n >= 0;
  const color = pos ? B.green : B.red;
  return (
    <div style={{ height, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      <div style={{
        width: `${Math.max(pct, n === 0 ? 0 : 3)}%`,
        height: '100%',
        borderRadius: 99,
        background: `linear-gradient(90deg, ${color}99, ${color})`,
        boxShadow: `0 0 12px ${color}55`,
      }}
      />
    </div>
  );
}

function PortfolioStage({
  holdings, isMobile, selected, nameFocus, onToggle, onOpen, onRename, onRemove,
  walletProfiles, actionRows, onToggleBets,
}) {
  const [sport, setSport] = useState(null);
  const [span, setSpan] = useState('30d');
  const stage = useMemo(() => buildPortfolioStage(holdings), [holdings]);
  const alt = useMemo(
    () => (span === '30d' ? null : portfolioWindowBook(holdings, span)),
    [holdings, span],
  );
  const markets = useMemo(() => {
    if (alt) {
      if (!sport) return alt.markets;
      if (alt.marketsBySport) return alt.marketsBySport[sport] || [];
      const legs = alt.wallets.flatMap((w) => (w.legs || []).filter((l) => l.sport === sport));
      const by = new Map();
      for (const leg of legs) {
        const label = leg.market === 'SPREAD' ? 'Spread' : leg.market === 'TOTAL' ? 'Total' : (leg.market || 'Market');
        const cur = by.get(label) || [];
        cur.push(leg);
        by.set(label, cur);
      }
      return [...by.entries()].map(([label, legsFor]) => {
        const a = summarizeTape(legsFor);
        return { label, ...a, n: a.wins + a.losses };
      }).sort((a, b) => (Number(b.pnl) || 0) - (Number(a.pnl) || 0));
    }
    return sport ? buildPortfolioStage(holdings, sport).markets : stage.markets;
  }, [alt, holdings, sport, stage]);
  const people = useMemo(() => {
    const rows = [];
    const altBy = alt ? new Map(alt.wallets.map((w) => [w.walletShort, w])) : null;
    for (const h of holdings || []) {
      const open = openOnSport(h, sport, actionRows);
      let pnl = h.l30Pnl;
      let roi = h.roi;
      let honest = h.honest;
      let heat = h.heat;
      if (altBy) {
        const entry = altBy.get(h.walletShort);
        if (!entry) continue;
        if (sport) {
          const line = (entry.lines || []).find((l) => l.sport === sport);
          if (!line) continue;
          pnl = line.pnl;
          roi = line.roi;
          honest = line.honest;
        } else {
          pnl = entry.pnl;
          roi = entry.roi;
          honest = entry.honest;
        }
        heat = sport ? ((h.lines || []).find((l) => l.sport === sport)?.heat || h.heat) : h.heat;
      } else if (sport) {
        const line = (h.lines || []).find((l) => l.sport === sport);
        if (!line) continue;
        pnl = line.pnl;
        roi = line.roi;
        honest = line.honest;
        heat = line.heat;
      }
      rows.push({
        holding: h,
        pnl,
        roi,
        honest,
        heat,
        openN: open.n,
        openInvested: open.invested,
      });
    }
    rows.sort((a, b) => {
      const ap = Number.isFinite(a.pnl) ? a.pnl : -Infinity;
      const bp = Number.isFinite(b.pnl) ? b.pnl : -Infinity;
      if (bp !== ap) return bp - ap;
      return (b.openInvested || 0) - (a.openInvested || 0);
    });
    return rows;
  }, [holdings, sport, actionRows, alt]);
  const viewSports = alt ? alt.sports : stage.sports;
  const viewPath = alt ? alt.path : stage.path;
  const viewEnd = alt ? alt.pathEnd : (stage.pathEnd ?? stage.bookPnl);
  const viewRoi = alt ? alt.roi : stage.roi;
  const rec = alt ? alt.honest : stage.honest;
  if (!viewPath.length && !people.length && !viewSports.length && span === '30d') return null;
  const tone = pnlColor(viewEnd, B.text);
  const maxSharp = Math.max(1, ...people.map((h) => Math.abs(h.pnl) || 0));
  const maxSport = Math.max(1, ...viewSports.map((s) => Math.abs(s.pnl) || 0));
  const spanLabel = span === 'yesterday' ? 'Yesterday' : span === 'l90' ? 'Last 90 days' : '30-day path';
  const spanNote = span === 'l90' && alt && alt.ready === false
    ? ''
    : (span === 'l90' && alt?.partial && alt.from
      ? ` · tape from ${Number(alt.from.slice(5, 7))}/${Number(alt.from.slice(8))}`
      : '');
  const colLabel = span === 'yesterday' ? 'Yest' : span === 'l90' ? 'L90' : '30d';
  return (
    <section style={{
      position: 'relative',
      margin: '12px 0 18px',
      borderRadius: 18,
      border: `1px solid ${B.goldBorder}`,
      background: `radial-gradient(120% 80% at 80% 0%, ${(viewEnd ?? 0) >= 0 ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.12)'}, transparent 46%), #10141c`,
      overflow: 'hidden',
    }}
    >
      <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #D4AF37 35%, #E8D28A 60%, transparent)' }} />
      <div style={{ padding: isMobile ? '1rem 0.85rem 1.05rem' : '1.15rem 1.25rem 1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {[
                { id: 'yesterday', label: 'Yesterday' },
                { id: '30d', label: '30D' },
                { id: 'l90', label: 'L90' },
              ].map((chip) => (
                <FilterBtn key={chip.id} on={span === chip.id} onClick={() => setSpan(chip.id)}>{chip.label}</FilterBtn>
              ))}
            </div>
            <div style={{ ...T.body, color: B.textSec, marginTop: 8, fontFeatureSettings: "'tnum'" }}>
              {spanLabel}{spanNote}
              {rec?.record && rec.record !== '—' ? ` · ${rec.record}` : ''}
              {rec?.showPct ? ` · ${rec.wr}%` : ''}
              {Number.isFinite(viewRoi) ? ` · ${viewRoi}% ROI` : ''}
            </div>
          </div>
          {viewPath.length ? (
            <div style={{ ...T.hero, color: tone, fontSize: isMobile ? '1.85rem' : '2.35rem', textAlign: 'right' }}>
              {fmtVol(viewEnd)}
            </div>
          ) : (
            <div style={{ ...T.hero, color: B.textFaint, fontSize: isMobile ? '1.4rem' : '1.7rem', textAlign: 'right' }}>—</div>
          )}
        </div>
        {viewPath.length ? (
          <div style={{ marginTop: 4 }}>
            <AreaChart points={viewPath} height={isMobile ? 168 : 214} />
          </div>
        ) : null}
        {viewSports.length ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : `repeat(${Math.min(viewSports.length, 4)}, minmax(0, 1fr))`,
            gap: 10,
            marginTop: 16,
          }}
          >
            {viewSports.slice(0, 4).map((row) => {
              const on = sport === row.sport;
              return (
                <button
                  key={row.sport}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSport(on ? null : row.sport)}
                  style={{
                    borderRadius: 12,
                    border: `1px solid ${on ? B.goldBorder : B.hair}`,
                    background: on ? B.goldDim : 'rgba(255,255,255,0.025)',
                    padding: '0.7rem 0.75rem 0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    color: 'inherit',
                  }}
                >
                  <div style={{ ...T.kicker, color: on ? B.gold : B.textFaint }}>{row.sport}</div>
                  <div style={{ ...T.figure, color: pnlColor(row.pnl), fontSize: '1.15rem', marginTop: 6 }}>{fmtVol(row.pnl)}</div>
                  <div style={{ marginTop: 8 }}><WeightBar value={row.pnl} maxAbs={maxSport} height={6} /></div>
                  <div style={{ ...T.meta, color: B.textMuted, marginTop: 6, fontFeatureSettings: "'tnum'" }}>
                    {row.honest?.text && row.honest.text !== '—' ? row.honest.text : ''}
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}
        <div style={{ marginTop: 18 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'minmax(0, 1fr) auto' : SHARP_GRID,
            gap: '0 14px',
            alignItems: 'end',
            padding: '0 0.15rem 0.35rem 0.35rem',
          }}
          >
            <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.1em' }}>
              Who made it{sport ? ` · ${sport}` : ''}
            </div>
            {isMobile ? <div /> : <div />}
            {isMobile ? null : <Head align="right">{colLabel}</Head>}
            {isMobile ? null : <Head align="right">ROI</Head>}
            {isMobile ? null : <Head align="right">Close</Head>}
            {isMobile ? null : <Head align="right">Open</Head>}
          </div>
          {people.length ? people.map((face) => {
            const id = face.holding.walletShort;
            const open = selected === id;
            return (
              <div key={id} style={{ borderTop: `1px solid ${B.hair}` }}>
                <PortfolioSharp
                  row={face.holding}
                  face={face}
                  maxAbs={maxSharp}
                  selected={open}
                  isMobile={isMobile}
                  startEditing={nameFocus === id}
                  onToggle={() => onToggle?.(id)}
                  onOpen={() => onOpen?.(id)}
                  onRename={(name) => onRename?.(id, name)}
                />
                {open ? (
                  <MarketBook
                    holding={face.holding}
                    walletProfiles={walletProfiles}
                    actionRows={actionRows}
                    sportFilter={sport}
                    onToggleBets={onToggleBets}
                    onRemove={() => onRemove?.(id)}
                  />
                ) : null}
              </div>
            );
          }) : (
            <div style={{ ...T.body, color: B.textFaint, padding: '0.9rem 0.35rem' }}>
              {span === 'l90' && alt && alt.ready === false
                ? '90-day records rebuild with the wallet profiles. 30D is the full month.'
                : (sport
                  ? `No one on this list has a ${sport} book${span === 'yesterday' ? ' yesterday' : ''}.`
                  : (span === 'yesterday' ? 'Nothing graded yesterday.' : 'Nobody on the list.'))}
            </div>
          )}
        </div>
        {markets.length ? (
          <div style={{ marginTop: 16 }}>
            <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.1em', marginBottom: 8 }}>
              Where{sport ? ` · ${sport}` : ''}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(markets.length, 3)}, minmax(0, 1fr))`,
              gap: 10,
            }}
            >
              {markets.slice(0, 3).map((m) => (
                <div key={m.label} style={{
                  borderRadius: 12,
                  borderTop: `1px solid ${B.line}`,
                  borderRight: `1px solid ${B.line}`,
                  borderBottom: `1px solid ${B.line}`,
                  borderLeft: `3px solid ${pnlColor(m.pnl ?? m.roi, B.gold)}`,
                  padding: '0.7rem 0.8rem',
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                    <div style={{ ...T.kicker, color: B.goldSoft }}>{m.label}</div>
                    <div style={{ ...T.figure, color: pnlColor(m.pnl, B.textSec), fontSize: '0.95rem' }}>
                      {Number.isFinite(m.pnl) ? fmtVol(m.pnl) : (Number.isFinite(m.roi) ? `${m.roi}%` : '—')}
                    </div>
                  </div>
                  <div style={{ ...T.meta, color: B.textSec, marginTop: 6, fontFeatureSettings: "'tnum'" }}>
                    {m.honest?.text && m.honest.text !== '—' ? m.honest.text : '—'}
                    {m.n ? ` · ${m.n} bets` : ''}
                  </div>
                  <div style={{ ...T.meta, color: B.textMuted, marginTop: 2 }}>
                    {Number.isFinite(m.roi) ? `${m.roi}% book` : ''}
                    {Number.isFinite(m.pnl) ? ` · ${colLabel === '30d' ? '30 days' : colLabel}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
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
  const showingPath = !haveL30 && Number.isFinite(dossier.pathPnl);
  const since = fmtSince(dossier.sparkFromDate);
  const thinBook = (lead?.n || 0) < HONEST_PCT_N;
  const heroText = haveL30
    ? fmtVol(dossier.l30Pnl)
    : (showingPath ? fmtVol(dossier.pathPnl) : (Number.isFinite(lead?.roi) ? `${lead.roi}%` : '—'));
  const heroColor = haveL30
    ? pnlColor(dossier.l30Pnl, B.text)
    : (showingPath ? pnlColor(dossier.pathPnl, B.text) : (thinBook ? B.goldSoft : pnlColor(lead?.roi, B.text)));
  const side = haveL30
    ? [dossier.honest?.text, Number.isFinite(dossier.roi) ? `${dossier.roi}% ROI` : null, close].filter(Boolean).join(' · ')
    : showingPath
      ? [since ? `Since ${since}` : 'Last results', close].filter(Boolean).join(' · ')
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
            {dossier.sparkScope === 'recent'
              ? `Last results${fmtSince(dossier.sparkFromDate) ? ` · since ${fmtSince(dossier.sparkFromDate)}` : ''}`
              : (dossier.sparkFrom === 'book' ? '30-day path' : 'These results')}
          </div>
          <AreaChart points={dossier.spark} height={isMobile ? 112 : 136} />
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
        {dossier.results.length
          ? `Last ${dossier.results.length} graded${dossier.resultN > dossier.results.length ? ` of ${dossier.resultN}` : ''}`
          : (dossier.quietMonth ? 'Quiet month' : 'Last 0 graded')}
      </div>
      {dossier.tapeScope === 'recent' && dossier.results.length ? (
        <div style={{ ...T.meta, color: B.textMuted, marginBottom: 4 }}>
          Older than 30 days{since ? ` · since ${since}` : ''}. Nothing graded this month.
        </div>
      ) : null}
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
        <div style={{ ...T.meta, color: B.textFaint, padding: '0.4rem 0 0.2rem' }}>
          {dossier.quietMonth || dossier.tapeScope === 'recent'
            ? `No bets in the last 30 days. The path is the last stretch of this book${since ? `, from ${since}` : ''}.`
            : 'No graded tickets in this window.'}
        </div>
      )}
    </div>
  );
}

function TicketContext({ item, isMobile }) {
  const lines = item.walletLines || [];
  const bookLabel = lines.find((line) => line.book?.label)?.book?.label || 'Market';
  return (
    <div style={{ marginTop: 10 }}>
      {(item.otherSide || []).map((side, i) => (
        <div
          key={`${side.pick || 'side'}-${i}`}
          style={{
            marginBottom: 6,
            borderRadius: 8,
            background: 'rgba(239,68,68,0.10)',
            border: '1px solid rgba(239,68,68,0.28)',
            padding: '0.35rem 0.6rem',
            ...T.meta,
            color: '#FCA5A5',
            fontWeight: 650,
          }}
        >
          Other side · {[side.pick, ...(side.tags || [])].filter(Boolean).join(' · ')}
        </div>
      ))}
      {isMobile || !lines.length ? null : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: RECEIPT_COLS,
          gap: '0 12px',
          alignItems: 'end',
          padding: '0.15rem 0 0.2rem',
        }}
        >
          <div style={{ ...T.kicker, color: B.textFaint, letterSpacing: '0.08em' }}>Sharp</div>
          <ReceiptHead>Vs usual</ReceiptHead>
          <ReceiptHead>This bet</ReceiptHead>
          <ReceiptHead>L10</ReceiptHead>
          <ReceiptHead>At size</ReceiptHead>
          <ReceiptHead>{bookLabel} book</ReceiptHead>
          <ReceiptHead>{bookLabel} 30d</ReceiptHead>
        </div>
      )}
      <div>
        {lines.map((line) => (
          <SharpReceipt key={line.walletShort || line.tag} line={line} sport={item.sport} isMobile={isMobile} />
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
  onToggleBets = null,
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
  const betRows = useMemo(() => rowsForBetsFeed(actionRows, roster), [actionRows, roster]);
  const betBoard = useMemo(() => buildMySharpsBoard(betRows), [betRows]);
  const snapshot = useMemo(
    () => buildPortfolioSnapshot({ holdings, tickets: bookBoard.tickets, tails, legs: recentLegs }),
    [holdings, bookBoard, tails, recentLegs],
  );
  const groups = useMemo(
    () => groupPortfolioBets(betBoard.tickets, { names, tails, walletProfiles }),
    [betBoard, names, tails, walletProfiles],
  );
  const tailCards = useMemo(() => summarizeTails(tails, recentLegs).cards, [tails, recentLegs]);
  const found = useMemo(
    () => buildFindCandidates(walletProfiles, { exclude: shorts, ...filters }),
    [walletProfiles, shorts, filters],
  );

  const focus = holdings.some((h) => h.walletShort === selected) ? selected : null;
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
          {holdings.length ? (
            <PortfolioStage
              holdings={holdings}
              isMobile={isMobile}
              selected={focus}
              nameFocus={nameFocus}
              walletProfiles={walletProfiles}
              actionRows={actionRows}
              onToggleBets={onToggleBets}
              onToggle={(id) => setSelected((cur) => (cur === id ? null : id))}
              onOpen={(id) => setSelected(id)}
              onRename={(id, name) => {
                setNameFocus(null);
                onRename?.(id, name);
              }}
              onRemove={(id) => {
                setSelected(null);
                onRemove?.(id);
              }}
            />
          ) : (
            <div style={{ padding: '1.6rem 0 0.4rem' }}>
              <div style={{ ...T.hero, fontSize: '1.45rem', color: B.text }}>Nobody on the list</div>
              <button type="button" onClick={() => setRoom('find')} style={{ ...goldBtn, marginTop: 14 }}>Find sharps</button>
            </div>
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
