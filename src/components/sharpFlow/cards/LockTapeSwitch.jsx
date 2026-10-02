/**
 * Limit / Book switch on a locked card.
 * Limit is the Pinnacle odds + max tape. Book is the exchange ladder.
 */
import { useEffect, useState } from 'react';
import {
  fmtAmerican,
  fmtUsd,
  liquidityCaption,
  pickCardBook,
} from '../../../lib/orderBookLiquidity.js';

const GOLD = '#D4AF37';
const TEXT = '#F4F7FB';
const MUTED = '#9aa6bd';
const FAINT = '#647089';
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";
const GREEN = '#2fd57e';

let cached = null;
let cachedAt = 0;
let inflight = null;

function loadBook() {
  if (cached && Date.now() - cachedAt < 8 * 60 * 1000) return Promise.resolve(cached);
  if (inflight) return inflight;
  inflight = fetch(`/orderbook_liquidity.json?t=${Math.floor(Date.now() / 60000)}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((doc) => {
      cached = doc;
      cachedAt = Date.now();
      return doc;
    })
    .catch(() => null)
    .finally(() => { inflight = null; });
  return inflight;
}

function venueLabel(name) {
  if (name === 'kalshi') return 'Kalshi';
  if (name === 'poly') return 'Polymarket';
  if (name === 'novig') return 'Novig';
  if (name === 'prophetx') return 'ProphetX';
  return name;
}

function Bars({ levels }) {
  const rows = Array.isArray(levels) ? levels.slice(0, 5) : [];
  const max = Math.max(1, ...rows.map((l) => l.sizeUsd || 0));
  if (!rows.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
      {rows.map((lvl, i) => (
        <div key={`${lvl.american}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 42, fontFamily: MONO, fontSize: 10, color: MUTED }}>{fmtAmerican(lvl.american)}</span>
          <div style={{ flex: 1, height: 7, background: 'rgba(148,163,184,0.12)', borderRadius: 2 }}>
            <div style={{
              width: `${Math.max(4, Math.round((lvl.sizeUsd / max) * 100))}%`,
              height: '100%',
              background: i === 0 ? GREEN : 'rgba(232,238,247,0.55)',
              borderRadius: 2,
            }} />
          </div>
          <span style={{ width: 42, textAlign: 'right', fontFamily: MONO, fontSize: 10, color: TEXT }}>{fmtUsd(lvl.sizeUsd)}</span>
        </div>
      ))}
    </div>
  );
}

function SideColumn({ title, node }) {
  const venues = node?.venues ? Object.entries(node.venues) : [];
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{title}</div>
      {venues.length === 0 && (
        <div style={{ fontSize: 11, color: FAINT }}>No book</div>
      )}
      {venues.map(([name, book]) => (
        <div key={name} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 10, color: MUTED }}>
            <span>{venueLabel(name)}</span>
            <span>{fmtAmerican(book.insideAmerican)} · {fmtUsd(book.sizeUsd) || '—'}</span>
          </div>
          <Bars levels={book.levels} />
        </div>
      ))}
    </div>
  );
}

function BookView({ slice, oursLabel, oppLabel }) {
  if (!slice) {
    return (
      <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.45, padding: '8px 2px 4px' }}>
        No exchange book on this number yet.
      </div>
    );
  }
  const oursVenues = slice.ours?.venues || {};
  const leadName = Object.entries(oursVenues).sort((a, b) => (b[1]?.sizeUsd || 0) - (a[1]?.sizeUsd || 0))[0];
  const caption = leadName ? liquidityCaption(leadName[1]) : null;
  return (
    <div style={{ padding: '4px 2px 2px' }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <SideColumn title={oursLabel || 'This side'} node={slice.ours} />
        {slice.other ? <SideColumn title={oppLabel || 'Other side'} node={slice.other} /> : null}
      </div>
      {caption && (
        <div style={{ marginTop: 8, fontSize: 11, color: MUTED, lineHeight: 1.4 }}>{caption}</div>
      )}
    </div>
  );
}

export default function LockTapeSwitch({ f, children }) {
  const [tab, setTab] = useState('limit');
  const [doc, setDoc] = useState(cached);
  useEffect(() => {
    let live = true;
    loadBook().then((next) => { if (live) setDoc(next); });
    return () => { live = false; };
  }, []);
  const slice = pickCardBook(doc, {
    sport: f?.sport,
    gameKey: f?.gameKey,
    marketType: f?.marketType,
    side: f?.side,
    line: f?.ticketLine ?? f?.playableLine,
  });
  const btn = (id, label) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setTab(id);
      }}
      style={{
        border: 0,
        background: 'transparent',
        padding: '2px 0',
        fontFamily: MONO,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: tab === id ? GOLD : FAINT,
        borderBottom: tab === id ? `1px solid ${GOLD}` : '1px solid transparent',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
        {btn('limit', 'LIMIT')}
        {btn('book', 'BOOK')}
      </div>
      {tab === 'book' ? (
        <div onClick={(e) => e.stopPropagation()}>
          <BookView slice={slice} oursLabel={f?.pickLabel} oppLabel={f?.oppMarketLabel} />
        </div>
      ) : children}
    </div>
  );
}
