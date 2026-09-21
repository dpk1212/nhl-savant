/**
 * My Sharps — the list is the portfolio.
 * One line for the book. People in a table. Tonight's tickets under them.
 * A row opens that sharp. The book number stays the list.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  buildConsiderRows,
  buildDeskHoldings,
  buildDeskLedger,
  buildDeskReport,
  gainsSplit,
} from '../../lib/mySharpsDesk.js';

const B = {
  goldSoft: '#E8D28A',
  green: '#10B981',
  red: '#EF4444',
  panelHover: '#1A1F2E',
  line: '#252B3B',
  hair: 'rgba(255,255,255,0.06)',
  text: '#F8FAFC',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  textFaint: '#475569',
};

const T = {
  display: {
    fontSize: '2.85rem',
    fontWeight: 650,
    lineHeight: 0.95,
    letterSpacing: '-0.048em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  figure: {
    fontSize: '0.92rem',
    fontWeight: 650,
    letterSpacing: '-0.02em',
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: 'tabular-nums',
  },
  name: {
    fontSize: '0.92rem',
    fontWeight: 650,
    letterSpacing: '-0.02em',
  },
  head: {
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#475569',
  },
  meta: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.35 },
  body: { fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.4 },
};

const HOLD_GRID = 'minmax(150px, 1.7fr) 112px 88px minmax(96px, 1fr) 92px';
const TAPE_GRID = '72px minmax(120px, 1.3fr) minmax(108px, 1.1fr) minmax(96px, 0.95fr) 80px 62px 52px';

function fmtVol(v, { signed = true } = {}) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const sign = !signed ? '' : (n < 0 ? '−' : (n > 0 ? '+' : ''));
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs)}`;
}

function pnlColor(n, fallback = B.textMuted) {
  if (!Number.isFinite(n) || n === 0) return fallback;
  return n > 0 ? B.green : B.red;
}

function heatColor(heat) {
  if (!heat || heat.n < 5) return B.textFaint;
  if (heat.key === 'hot') return B.green;
  if (heat.key === 'cold') return B.red;
  return B.textMuted;
}

function bookSentence(report, openN) {
  const rec = report.l30?.honest;
  const bits = [];
  if (rec?.record) bits.push(rec.showPct ? `${rec.record} · ${rec.wr}%` : rec.record);
  if (report.l30) bits.push('30d');
  if (openN) bits.push(`${openN} open`);
  const lead = report.openLead;
  if (lead?.sport) {
    bits.push(lead.pct >= 85
      ? `${lead.sport} is the money up`
      : `${lead.sport} is ${lead.pct}% of the money up`);
  }
  return bits.join('   ·   ');
}

function LockedState({ signedIn }) {
  return (
    <div style={{ padding: '2.8rem 0 2rem' }}>
      <div style={{ ...T.display, fontSize: '1.7rem', color: B.text }}>
        {signedIn ? 'Star the wallets you trust.' : 'Sign in to keep a list.'}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: '2.8rem 0 2rem' }}>
      <div style={{ ...T.display, fontSize: '1.7rem', color: B.text }}>Nobody on the list</div>
      <div style={{ ...T.body, color: B.textMuted, marginTop: 8 }}>Star a wallet on All Sharps.</div>
    </div>
  );
}

function Head({ children, align = 'left' }) {
  return (
    <div style={{ ...T.head, textAlign: align }}>{children}</div>
  );
}

function NameField({ name, tag, selected, onRename, onOpen }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name || '');
  useEffect(() => { setDraft(name || ''); }, [name]);
  const commit = () => {
    setEditing(false);
    if ((draft || '') !== (name || '')) onRename?.(draft);
  };
  const tone = selected ? B.goldSoft : B.text;
  if (!editing) {
    return (
      <div
        style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => { setEditing(true); onOpen?.(); }}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'text',
            color: tone,
            ...T.name,
            fontFamily: 'inherit',
            textAlign: 'left',
          }}
        >
          {name || tag}
        </button>
        {name ? (
          <span style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'", flexShrink: 0 }}>
            {tag}
          </span>
        ) : null}
      </div>
    );
  }
  const width = `${Math.min(18, Math.max((draft || tag || '').length, 4))}ch`;
  return (
    <div
      style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
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
          if (e.key === 'Escape') {
            setDraft(name || '');
            setEditing(false);
          }
        }}
        style={{
          width,
          maxWidth: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          padding: 0,
          margin: 0,
          color: tone,
          caretColor: B.goldSoft,
          ...T.name,
          fontFamily: 'inherit',
        }}
      />
      <span style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'", flexShrink: 0 }}>
        {tag}
      </span>
    </div>
  );
}

function SplitBar({ gains, losses }) {
  const g = Number(gains) || 0;
  const l = Number(losses) || 0;
  const total = g + l;
  if (!total) return null;
  return (
    <div style={{ margin: '14px 0 6px', maxWidth: 420 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...T.meta, fontFeatureSettings: "'tnum'" }}>
        {g ? <span style={{ color: B.green }}>{fmtVol(g)}</span> : <span />}
        {l ? <span style={{ color: B.red }}>{fmtVol(-l)}</span> : null}
      </div>
      <div style={{ display: 'flex', height: 3, borderRadius: 99, overflow: 'hidden', marginTop: 7, background: B.hair }}>
        <div style={{ width: `${(g / total) * 100}%`, background: B.green }} />
        <div style={{ width: `${(l / total) * 100}%`, background: B.red }} />
      </div>
    </div>
  );
}

function HoldingRow({ row, selected, isMobile, onToggle, onOpen, onRename }) {
  const form = row.heat?.record && row.heat?.window
    ? `${row.heat.window} ${row.heat.record}`
    : null;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'minmax(0, 1fr) auto auto' : HOLD_GRID,
        gap: isMobile ? '2px 12px' : '0 16px',
        alignItems: 'center',
        padding: '0.82rem 0.2rem',
        borderBottom: `1px solid ${B.hair}`,
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      <NameField
        name={row.name}
        tag={row.tag}
        selected={selected}
        onRename={onRename}
        onOpen={onOpen}
      />
      <div style={{ display: isMobile ? 'none' : 'block' }}>
        <div style={{ ...T.figure, color: B.textSec }}>
          {row.honest?.record || '—'}
          {row.honest?.showPct ? <span style={{ color: B.textFaint }}> · {row.honest.wr}%</span> : null}
        </div>
        {form ? (
          <div style={{ ...T.meta, color: heatColor(row.heat), marginTop: 3, fontFeatureSettings: "'tnum'" }}>
            {form}
          </div>
        ) : null}
      </div>
      <div style={{ ...T.figure, color: pnlColor(row.l30Pnl), textAlign: 'right' }}>
        {Number.isFinite(row.l30Pnl) ? fmtVol(row.l30Pnl) : '—'}
      </div>
      {!isMobile ? (
        <div style={{ ...T.body, color: B.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.where || '—'}
        </div>
      ) : null}
      <div style={{ ...T.figure, color: row.openInvested ? B.goldSoft : B.textFaint, textAlign: 'right' }}>
        {row.openInvested ? fmtVol(row.openInvested, { signed: false }) : '—'}
        {row.openN > 1 ? (
          <span style={{ ...T.meta, color: B.textFaint, marginLeft: 6 }}>{row.openN}</span>
        ) : null}
      </div>
      {isMobile ? (
        <div style={{ ...T.meta, color: B.textMuted, gridColumn: '1 / -1', fontFeatureSettings: "'tnum'" }}>
          {[row.honest?.text, form, row.where].filter((x) => x && x !== '—').join('   ·   ') || '—'}
        </div>
      ) : null}
    </div>
  );
}

function TapeRow({ item, isMobile }) {
  const closed = item.bucket === 'closed';
  const money = closed
    ? (Number.isFinite(item.pnl) ? fmtVol(item.pnl) : '—')
    : fmtVol(item.invested, { signed: false });
  const moneyTone = closed ? pnlColor(item.pnl, B.textMuted) : B.goldSoft;
  const betGold = item.shared && !item.split && !closed;
  const result = closed
    ? (item.won ? 'W' : 'L')
    : (item.live ? 'Live' : '');
  const resultTone = closed ? (item.won ? B.green : B.red) : B.goldSoft;
  const when = item.clock || item.when || '';
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'minmax(0, 1fr) auto auto' : TAPE_GRID,
        gap: isMobile ? '3px 14px' : '0 14px',
        alignItems: 'center',
        padding: '0.72rem 0.2rem',
        borderBottom: `1px solid ${B.hair}`,
      }}
    >
      {!isMobile ? (
        <div style={{ ...T.meta, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>{when}</div>
      ) : null}
      {!isMobile ? (
        <div style={{ ...T.meta, color: B.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.matchup || '—'}
        </div>
      ) : null}
      <div style={{ minWidth: 0 }}>
        <div style={{
          ...T.name,
          color: betGold ? B.goldSoft : B.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        >
          {item.pick}
        </div>
        {isMobile ? (
          <div style={{ ...T.meta, color: B.textFaint, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {[item.matchup, item.who, item.american, when].filter(Boolean).join('   ·   ')}
          </div>
        ) : null}
      </div>
      {!isMobile ? (
        <div style={{
          ...T.meta,
          color: item.whoOpposed ? B.red : B.textSec,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        >
          {item.who}
        </div>
      ) : null}
      <div style={{ ...T.figure, color: moneyTone, textAlign: 'right' }}>{money}</div>
      {!isMobile ? (
        <div style={{ ...T.figure, color: B.textSec, textAlign: 'right', fontWeight: 550 }}>
          {item.american || '—'}
        </div>
      ) : null}
      <div style={{
        ...T.meta,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: result ? resultTone : 'transparent',
        textAlign: 'right',
      }}
      >
        {result || '·'}
      </div>
    </div>
  );
}

function Dossier({ holding, gains, onRemove }) {
  const label = holding.name || holding.tag;
  return (
    <div style={{ padding: '1.15rem 0.2rem 0.4rem', borderBottom: `1px solid ${B.line}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ ...T.body, color: B.textSec, fontFeatureSettings: "'tnum'" }}>
          {holding.honest?.record ? (
            <>
              {holding.honest.record}
              {holding.honest.showPct ? ` · ${holding.honest.wr}%` : ''}
              {holding.where ? ` · ${holding.where}` : ''}
            </>
          ) : (holding.where || 'Thin sample')}
        </div>
        <button
          type="button"
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            ...T.meta,
            color: B.textFaint,
            fontFamily: 'inherit',
          }}
        >
          Remove {label}
        </button>
      </div>
      <SplitBar gains={gains.gains} losses={gains.losses} />
      {holding.lines?.length ? (
        <div style={{ marginTop: 8 }}>
          {holding.lines.map((line) => (
            <div
              key={line.sport}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px minmax(0, 1fr) 88px 72px',
                gap: '0 14px',
                alignItems: 'baseline',
                padding: '0.55rem 0',
                borderTop: `1px solid ${B.hair}`,
              }}
            >
              <div style={{ ...T.name, color: B.text }}>{line.sport}</div>
              <div style={{ ...T.meta, color: B.textMuted, fontFeatureSettings: "'tnum'" }}>
                {line.honest?.text && line.honest.text !== '—' ? line.honest.text : '—'}
              </div>
              <div style={{ ...T.figure, color: pnlColor(line.pnl), textAlign: 'right' }}>
                {Number.isFinite(line.pnl) ? fmtVol(line.pnl) : '—'}
              </div>
              <div style={{ ...T.meta, color: B.textSec, textAlign: 'right' }}>{line.market || ''}</div>
            </div>
          ))}
        </div>
      ) : null}
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
  dateKey = null,
  todayKey = null,
  isMobile = false,
  onRename = null,
  onRemove = null,
}) {
  const [selected, setSelected] = useState(null);
  const [bookOpen, setBookOpen] = useState(false);

  const report = useMemo(
    () => buildDeskReport({
      roster,
      walletProfiles,
      shorts,
      actionRows,
      weekRows,
      recentLegs,
      dateKey,
      todayKey,
    }),
    [roster, walletProfiles, shorts, actionRows, weekRows, recentLegs, dateKey, todayKey],
  );

  const ledger = useMemo(
    () => buildDeskLedger({
      actionRows: weekRows?.length ? weekRows : actionRows,
      recentLegs,
      todayKey,
    }),
    [weekRows, actionRows, recentLegs, todayKey],
  );

  const holdings = useMemo(
    () => buildDeskHoldings({ roster, walletProfiles }),
    [roster, walletProfiles],
  );

  const names = useMemo(() => {
    const map = {};
    for (const h of holdings) if (h.name) map[h.walletShort] = h.name;
    return map;
  }, [holdings]);

  const focus = holdings.some((h) => h.walletShort === selected) ? selected : null;
  const tape = useMemo(
    () => buildConsiderRows(ledger, { names, focusShort: focus }),
    [ledger, names, focus],
  );
  const holding = holdings.find((h) => h.walletShort === focus) || null;
  const gains = useMemo(
    () => (focus ? gainsSplit(recentLegs, focus) : { gains: null, losses: null }),
    [recentLegs, focus],
  );

  if (!ready) return <LockedState signedIn={signedIn} />;
  if (!roster.length) return <EmptyState />;

  const pnl = report.l30?.pnl;
  const heroTone = Number.isFinite(pnl) ? (pnl > 0 ? B.green : pnl < 0 ? B.red : B.text) : B.text;
  const sentence = bookSentence(report, ledger.openN);
  const restN = tape.later.length + tape.closed.length;
  const tapeTitle = holding ? (holding.name || holding.tag) : 'Tonight';

  return (
    <div style={{ margin: '0.35rem 0 2.8rem' }}>
      <style>{`.ms-name::placeholder{color:${B.textFaint};}`}</style>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, flexWrap: 'wrap' }}>
        <span style={{ ...T.display, color: heroTone, fontSize: isMobile ? '2.25rem' : T.display.fontSize }}>
          {Number.isFinite(pnl) ? fmtVol(pnl) : '—'}
        </span>
        {sentence ? (
          <span style={{ ...T.body, color: B.textSec, fontFeatureSettings: "'tnum'", fontSize: '0.98rem' }}>
            {sentence}
          </span>
        ) : null}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'minmax(0, 1fr) auto auto' : HOLD_GRID,
        gap: '0 16px',
        padding: '1.35rem 0.2rem 0.45rem',
        borderBottom: `1px solid ${B.line}`,
        marginTop: 18,
      }}
      >
        <Head>Sharp</Head>
        {isMobile ? null : <Head>Record</Head>}
        <Head align="right">30d</Head>
        {isMobile ? null : <Head>Where</Head>}
        <Head align="right">Open</Head>
      </div>

      {holdings.map((row) => (
        <HoldingRow
          key={row.walletShort}
          row={row}
          selected={focus === row.walletShort}
          isMobile={isMobile}
          onToggle={() => setSelected((cur) => (cur === row.walletShort ? null : row.walletShort))}
          onOpen={() => setSelected(row.walletShort)}
          onRename={(name) => onRename?.(row.walletShort, name)}
        />
      ))}

      {holding ? (
        <Dossier
          holding={holding}
          gains={gains}
          onRemove={() => {
            const id = holding.walletShort;
            setSelected(null);
            onRemove?.(id);
          }}
        />
      ) : null}

      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 28,
        padding: '0 0.2rem 0.45rem',
        borderBottom: `1px solid ${B.line}`,
      }}
      >
        <div style={{ ...T.head, color: B.textMuted }}>{tapeTitle}</div>
        <div style={{ ...T.meta, color: B.textFaint, fontFeatureSettings: "'tnum'" }}>
          {tape.slate.length ? `${tape.slate.length} open` : 'Quiet'}
        </div>
      </div>

      {!isMobile ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: TAPE_GRID,
          gap: '0 14px',
          padding: '0.55rem 0.2rem 0.15rem',
        }}
        >
          <Head>When</Head>
          <Head>Game</Head>
          <Head>Bet</Head>
          <Head>Who</Head>
          <Head align="right">$</Head>
          <Head align="right">Price</Head>
          <Head align="right">W/L</Head>
        </div>
      ) : null}

      {tape.slate.length ? tape.slate.map((item) => (
        <TapeRow key={item.id} item={item} isMobile={isMobile} />
      )) : (
        <div style={{ ...T.body, color: B.textFaint, padding: '1rem 0.2rem' }}>Nothing up tonight.</div>
      )}

      {restN ? (
        <button
          type="button"
          onClick={() => setBookOpen((v) => !v)}
          style={{
            marginTop: 14,
            background: 'none',
            border: 'none',
            padding: '0.35rem 0.2rem',
            cursor: 'pointer',
            ...T.meta,
            color: B.textMuted,
            fontFamily: 'inherit',
            fontFeatureSettings: "'tnum'",
          }}
        >
          {bookOpen ? 'Tonight only' : `Full book · ${restN}`}
        </button>
      ) : null}

      {bookOpen ? (
        <div style={{ marginTop: 4 }}>
          {tape.later.map((item) => (
            <TapeRow key={`later:${item.id}`} item={item} isMobile={isMobile} />
          ))}
          {tape.closed.map((item) => (
            <TapeRow key={`closed:${item.id}`} item={item} isMobile={isMobile} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
