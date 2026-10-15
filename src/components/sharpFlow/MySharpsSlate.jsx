/**
 * Sharp Intel · My Sharps.
 * The bets slate, set beside Locked Picks and HC Positions.
 * One number, four words, then the same tickets the book already uses.
 */
import React, { useMemo, useState } from 'react';
import {
  actionDateKeys,
  etDateKey,
  formatActionDateChip,
} from '../../lib/confirmedActionDesk.js';
import { buildSavedSharpGroups } from '../../lib/savedSharpSlate.js';
import { buildGradedPlays, collectRecentLegs } from '../../lib/mySharpsDesk.js';
import { BetGroup } from './MySharpsDesk.jsx';

const B = {
  gold: '#D4AF37',
  goldSoft: '#E8D28A',
  goldDim: 'rgba(212, 175, 55, 0.10)',
  green: '#10B981',
  red: '#EF4444',
  amber: '#F59E0B',
  line: '#252B3B',
  hair: 'rgba(255,255,255,0.06)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textFaint: '#64748B',
};

const TYPE = {
  kicker: { fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' },
  figure: { fontWeight: 650, letterSpacing: '-0.03em', fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums' },
  name: { fontWeight: 650, letterSpacing: '-0.02em' },
  meta: { fontSize: '0.82rem', lineHeight: 1.4 },
};

const GROUPS = [
  { id: 'together', label: 'Together', tone: B.goldSoft },
  { id: 'pressing', label: 'Pressing', tone: B.amber },
  { id: 'split', label: 'Split', tone: B.red },
  { id: 'rest', label: 'Rest', tone: B.textSec },
];

function fmtVol(v, { signed = false } = {}) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const sign = signed ? (n < 0 ? '−' : n > 0 ? '+' : '') : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function GradedList({ plays, isMobile }) {
  if (!plays?.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
      {plays.map((play) => {
        const tone = play.won === true ? B.green : play.won === false ? B.red : B.textSec;
        const result = play.won === true ? 'Won' : play.won === false ? 'Lost' : 'Push';
        return (
          <div
            key={play.id}
            style={{
              borderRadius: 14,
              border: `1px solid ${B.line}`,
              borderLeft: `3px solid ${tone}`,
              padding: isMobile ? '0.8rem 0.75rem' : '0.9rem 1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ ...TYPE.name, color: B.text, fontSize: isMobile ? '1.15rem' : '1.28rem' }}>{play.pick}</div>
                <div style={{ ...TYPE.meta, color: B.textFaint, marginTop: 4, fontSize: '0.75rem' }}>
                  {[play.matchup, play.date ? String(play.date).slice(5) : null, play.sport, play.market, result, play.n > 1 ? `${play.n} sharps` : null].filter(Boolean).join('  ·  ')}
                </div>
              </div>
              <div style={{ ...TYPE.figure, color: Number.isFinite(play.pnl) ? (play.pnl < 0 ? B.red : B.green) : B.textFaint, fontSize: isMobile ? '1.15rem' : '1.35rem', flexShrink: 0 }}>
                {Number.isFinite(play.pnl) ? fmtVol(play.pnl, { signed: true }) : '—'}
              </div>
            </div>
            {play.lines?.length ? (
              <div style={{ marginTop: 10 }}>
                {play.lines.map((line) => (
                  <div
                    key={line.walletShort || line.tag}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 10,
                      padding: '0.28rem 0',
                      borderTop: `1px solid ${B.hair}`,
                      ...TYPE.meta,
                      fontSize: '0.75rem',
                    }}
                  >
                    <span style={{ color: B.textSec, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{line.tag}</span>
                    <span style={{ color: B.textFaint, whiteSpace: 'nowrap' }}>
                      {[line.price, line.ratio ? `${line.ratio.toFixed(1)}×` : null].filter(Boolean).join('  ')}
                    </span>
                    <span style={{ color: Number.isFinite(line.pnl) ? (line.pnl < 0 ? B.red : B.green) : B.textFaint, whiteSpace: 'nowrap' }}>
                      {Number.isFinite(line.pnl) ? fmtVol(line.pnl, { signed: true }) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

const textBtn = {
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: B.textFaint,
};

function EmptySlate({ title, body, action, href }) {
  const control = href ? (
    <a href={href} style={{ ...textBtn, color: B.goldSoft, display: 'inline-block', marginTop: 18 }}>{action}</a>
  ) : (
    <button type="button" onClick={action?.onClick} style={{ ...textBtn, color: B.goldSoft, marginTop: 18 }}>{action?.label}</button>
  );
  return (
    <div style={{ padding: '1.6rem 0.1rem 2rem', maxWidth: 460 }}>
      <div style={{ ...TYPE.name, color: B.text, fontSize: '1.35rem' }}>{title}</div>
      <div style={{ ...TYPE.meta, color: B.textSec, marginTop: 8 }}>{body}</div>
      {action ? control : null}
    </div>
  );
}

export default function MySharpsSlate({
  isMobile = false,
  signedIn = false,
  isPremium = false,
  mySharps = null,
  sharpPositions = null,
  spreadPositions = null,
  totalPositions = null,
  rawSharpPositions = null,
  rawSpreadPositions = null,
  rawTotalPositions = null,
  walletProfiles = null,
  pinnacleHistory = null,
  polyData = null,
  sportFilter = 'All',
  onOpenList = null,
}) {
  const nowMs = useMemo(() => Date.now(), []);
  const todayKey = etDateKey(nowMs);
  const dateKeys = actionDateKeys(nowMs);
  const [dateKey, setDateKey] = useState(todayKey);
  const [gradedOn, setGradedOn] = useState(false);
  const [lens, setLens] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [draft, setDraft] = useState(null);
  const selected = dateKeys.includes(dateKey) ? dateKey : todayKey;

  const names = useMemo(() => {
    const map = {};
    for (const m of mySharps?.members || []) {
      if (m?.name && m.walletShort) map[m.walletShort] = m.name;
    }
    return map;
  }, [mySharps?.members]);

  const groups = useMemo(() => buildSavedSharpGroups({
    sharpPositions,
    spreadPositions,
    totalPositions,
    rawSharpPositions,
    rawSpreadPositions,
    rawTotalPositions,
    walletProfiles,
    pinnacleHistory,
    polyData,
    portfolioShorts: mySharps?.shorts,
    roster: mySharps?.members || [],
    names,
    tails: mySharps?.tails || {},
    sportFilter,
    dateKey: selected,
    nowMs,
  }), [
    sharpPositions, spreadPositions, totalPositions,
    rawSharpPositions, rawSpreadPositions, rawTotalPositions,
    walletProfiles, pinnacleHistory, polyData,
    mySharps?.shorts, mySharps?.members, mySharps?.tails,
    names, sportFilter, selected, nowMs,
  ]);

  const graded = useMemo(() => buildGradedPlays(
    collectRecentLegs(walletProfiles, mySharps?.shorts || [], { sportFilter, limit: 800 }),
    { names, roster: mySharps?.members || [], limit: 40 },
  ), [walletProfiles, mySharps?.shorts, mySharps?.members, names, sportFilter]);

  const tracked = (mySharps?.count || 0) > 0;
  const cells = GROUPS.map((g) => ({
    ...g,
    n: (groups[g.id] || []).length,
    money: (groups[g.id] || []).reduce((s, t) => s + (Number(t.invested) || 0), 0),
  }));
  const shown = lens ? cells.filter((c) => c.id === lens) : cells;
  const n = cells.reduce((s, c) => s + c.n, 0);
  const money = cells.reduce((s, c) => s + c.money, 0);
  const gradedTone = Number.isFinite(graded.pnl)
    ? (graded.pnl < 0 ? B.red : B.green)
    : (graded.losses > graded.wins ? B.red : B.green);

  const openDraft = (item, suggested, patch) => {
    setDraft((cur) => {
      if (cur?.id === item.id && !patch) return null;
      const price = item.americanOdds != null ? String(item.americanOdds) : (item.americanLabel || '');
      const base = { id: item.id, price: String(price).replace('−', '-'), stake: suggested ? String(suggested) : '' };
      return patch ? { ...(cur?.id === item.id ? cur : base), ...patch } : base;
    });
  };

  const commitTail = async (item, form) => {
    const res = await mySharps?.markTail?.(item, { myAmerican: form.price, stake: form.stake });
    if (res?.ok) setDraft(null);
  };

  if (!signedIn || !isPremium) {
    return (
      <EmptySlate
        title="My Sharps"
        body="Follow the wallets you trust. Their bets land here, next to locked picks and HC positions."
        action="Unlock My Sharps"
        href="#/pricing?promo=NHL40"
      />
    );
  }

  if (!tracked) {
    if (mySharps?.loading) return <div style={{ minHeight: 120 }} />;
    return (
      <EmptySlate
        title="No sharps on your list"
        body="Add a wallet. Every market you leave on shows up on this slate, including sports that are not Proven yet."
        action={{ label: 'Open My Sharps', onClick: onOpenList }}
      />
    );
  }

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {dateKeys.map((key) => {
            const on = key === selected;
            return (
              <button
                key={key}
                type="button"
                onClick={() => { setGradedOn(false); setDateKey(key); setLens(null); setOpenId(null); setDraft(null); }}
                style={{
                  ...textBtn,
                  color: !gradedOn && on ? B.goldSoft : B.textFaint,
                  borderBottom: !gradedOn && on ? `1px solid ${B.gold}` : '1px solid transparent',
                  paddingBottom: 4,
                  letterSpacing: '0.06em',
                }}
              >
                {formatActionDateChip(key, todayKey)}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => { setGradedOn(true); setLens(null); setOpenId(null); setDraft(null); }}
            style={{
              ...textBtn,
              color: gradedOn ? gradedTone : B.textFaint,
              borderBottom: gradedOn ? `1px solid ${gradedTone}` : '1px solid transparent',
              paddingBottom: 4,
              letterSpacing: '0.06em',
            }}
          >
            {graded.n ? `Graded ${graded.wins}–${graded.losses}` : 'Graded'}
          </button>
        </div>
        <button type="button" onClick={onOpenList} style={textBtn}>Portfolio</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.35rem 0.9rem', marginTop: 16 }}>
        <div style={{
          ...TYPE.figure,
          color: gradedOn
            ? (Number.isFinite(graded.pnl) ? (graded.pnl < 0 ? B.red : B.green) : B.textFaint)
            : (n ? B.text : B.textFaint),
          fontSize: isMobile ? '1.85rem' : '2.2rem',
        }}
        >
          {gradedOn ? (Number.isFinite(graded.pnl) ? fmtVol(graded.pnl, { signed: true }) : '—') : (n ? fmtVol(money) : '—')}
        </div>
        <div style={{ ...TYPE.meta, color: B.textSec }}>
          {gradedOn
            ? (graded.n ? `${graded.wins}–${graded.losses} · ${graded.n} finished` : 'No finished plays in this window')
            : (n ? `${n} bet${n === 1 ? '' : 's'} from your list` : 'Nothing on this slate')}
        </div>
      </div>

      {gradedOn ? <GradedList plays={graded.plays} isMobile={isMobile} /> : null}

      {gradedOn ? null : <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        marginTop: 14,
        borderTop: `1px solid ${B.line}`,
        borderBottom: `1px solid ${B.line}`,
      }}
      >
        {cells.map((cell) => {
          const on = lens === cell.id;
          return (
            <button
              key={cell.id}
              type="button"
              onClick={() => { if (cell.n) { setLens(on ? null : cell.id); setOpenId(null); } }}
              style={{
                background: on ? B.goldDim : 'transparent',
                border: 'none',
                borderRight: cell.id === 'rest' ? 'none' : `1px solid ${B.hair}`,
                textAlign: 'left',
                padding: isMobile ? '0.7rem 0.45rem' : '0.8rem 0.85rem',
                cursor: cell.n ? 'pointer' : 'default',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ ...TYPE.kicker, color: on ? cell.tone : B.textFaint }}>{cell.label}</div>
              <div style={{ ...TYPE.figure, color: cell.n ? cell.tone : B.textFaint, marginTop: 4, fontSize: isMobile ? '0.95rem' : '1.05rem' }}>
                {cell.n}
                {cell.n ? (
                  <span style={{ color: B.textFaint, fontWeight: 550, marginLeft: 8 }}>{fmtVol(cell.money)}</span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>}

      {gradedOn ? null : shown.map((cell) => (
        <BetGroup
          key={cell.id}
          id={`intel-${cell.id}`}
          title={cell.label}
          tone={cell.tone}
          items={groups[cell.id] || []}
          isMobile={isMobile}
          draft={draft}
          onDraft={openDraft}
          onTail={commitTail}
          onUntail={(id) => mySharps?.clearTail?.(id)}
          walletProfiles={walletProfiles}
          expandedId={openId}
          onToggle={(id) => setOpenId((cur) => (cur === id ? null : id))}
          pinnacleHistory={pinnacleHistory}
        />
      ))}
    </div>
  );
}
