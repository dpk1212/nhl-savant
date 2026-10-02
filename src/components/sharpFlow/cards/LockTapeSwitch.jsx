/**
 * Limit / Book switch on a locked card.
 * Limit is the Pinnacle odds + max tape. Book is the exchange ladder.
 */
import { useEffect, useState } from 'react';
import { BookLogo } from './bookLogo.jsx';
import {
  bookRead,
  fmtAmerican,
  fmtUsd,
  pickCardBook,
  SHORTEN_PP,
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

const VENUE_NAME = {
  kalshi: 'Kalshi',
  poly: 'Polymarket',
  novig: 'Novig',
  prophetx: 'ProphetX',
};

// One ladder. Same American price across venues is one row, dollars added.
function mergedLadder(node) {
  const buckets = new Map();
  for (const [venue, book] of Object.entries(node?.venues || {})) {
    for (const lvl of book?.levels || []) {
      if (!Number.isFinite(lvl?.american) || !(lvl.sizeUsd > 0)) continue;
      const key = Math.round(lvl.american);
      const cur = buckets.get(key) || { american: key, prob: lvl.prob, sizeUsd: 0, venues: [] };
      cur.sizeUsd += lvl.sizeUsd;
      if (lvl.prob > 0 && !(cur.prob > 0 && cur.prob < lvl.prob)) cur.prob = lvl.prob;
      if (!cur.venues.includes(venue)) cur.venues.push(venue);
      buckets.set(key, cur);
    }
  }
  const rows = [...buckets.values()]
    .sort((a, b) => (a.prob ?? 1) - (b.prob ?? 1))
    .slice(0, 5);
  return { rows, inside: rows[0] || null };
}

function leadShorten(node) {
  const books = Object.values(node?.venues || {});
  const lead = books.sort((a, b) => (b.insideSizeUsd || 0) - (a.insideSizeUsd || 0))[0];
  return lead?.shortenedPp;
}

function statusOf(read, gap) {
  if (read === 'with') return { label: 'On the number', color: GREEN };
  if (read === 'off') return { label: gap != null ? `${Math.abs(gap).toFixed(1)}pp soft` : 'Soft', color: '#e8b4b0' };
  if (read === 'near') return { label: gap != null ? `${Math.abs(gap).toFixed(1)}pp off` : 'Off', color: GOLD };
  return { label: 'Thin', color: FAINT };
}

function SideLadder({ title, node, featured }) {
  const { rows, inside } = mergedLadder(node);
  const max = Math.max(1, ...rows.map((r) => r.sizeUsd || 0));
  const pin = node?.pinAmerican;
  const story = inside
    ? bookRead({ pinAmerican: pin, insideProb: inside.prob, sizeUsd: inside.sizeUsd })
    : null;
  const status = featured && story ? statusOf(story.read, story.gapPp) : null;
  const shortened = leadShorten(node);
  const dollarColor = !story ? TEXT
    : story.read === 'with' ? GREEN
      : story.read === 'near' ? GOLD
        : story.read === 'off' ? '#e8b4b0'
          : FAINT;
  const insideFill = !story || story.read === 'thin'
    ? 'rgba(232,238,247,0.55)'
    : story.read === 'off'
      ? 'linear-gradient(90deg, rgba(180,90,84,0.35), rgba(232,180,176,0.85))'
      : story.read === 'near'
        ? 'linear-gradient(90deg, rgba(138,112,48,0.45), #D4AF37)'
        : 'linear-gradient(90deg, #178a4c, #3dE58A)';

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 750, color: TEXT, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        {status && (
          <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', color: status.color, whiteSpace: 'nowrap' }}>
            {status.label}
          </span>
        )}
      </div>
      {inside ? (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 22, fontWeight: 750, letterSpacing: '-0.04em', color: TEXT, fontVariantNumeric: 'tabular-nums' }}>
            {fmtAmerican(inside.american)}
          </span>
          <span style={{ fontSize: 15, fontWeight: 750, color: dollarColor, fontVariantNumeric: 'tabular-nums' }}>
            {fmtUsd(inside.sizeUsd)}
          </span>
        </div>
      ) : (
        <div style={{ fontSize: 12, color: FAINT, padding: '8px 0' }}>No book</div>
      )}
      {Number.isFinite(pin) && (
        <div style={{ fontFamily: MONO, fontSize: 10, color: FAINT, marginBottom: 8 }}>
          Pinnacle {fmtAmerican(pin)}
          {Number.isFinite(shortened) && shortened >= SHORTEN_PP ? ` · shortened ${shortened.toFixed(1)}` : ''}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map((row, i) => (
          <div key={`${row.american}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'flex', gap: 2, width: 30, flexShrink: 0 }}>
              {row.venues.slice(0, 2).map((v) => (
                <BookLogo key={v} name={VENUE_NAME[v] || v} size={14} />
              ))}
            </span>
            <span style={{ width: 36, fontFamily: MONO, fontSize: 10, color: i === 0 ? TEXT : MUTED, flexShrink: 0 }}>
              {fmtAmerican(row.american)}
            </span>
            <div style={{ flex: 1, height: 11, background: 'rgba(148,163,184,0.10)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.max(6, Math.round((row.sizeUsd / max) * 100))}%`,
                height: '100%',
                background: i === 0 ? insideFill : 'rgba(232,238,247,0.42)',
                borderRadius: 3,
              }} />
            </div>
            <span style={{ width: 44, textAlign: 'right', fontFamily: MONO, fontSize: 10, color: i === 0 ? dollarColor : MUTED, flexShrink: 0 }}>
              {fmtUsd(row.sizeUsd)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookView({ slice, oursLabel, oppLabel }) {
  if (!slice) {
    return (
      <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.45, padding: '10px 0 4px' }}>
        No exchange book on this number yet.
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 18, padding: '8px 0 2px' }}>
      <SideLadder title={oursLabel || 'This side'} node={slice.ours} featured />
      {slice.other ? <SideLadder title={oppLabel || 'Other side'} node={slice.other} /> : null}
    </div>
  );
}

export default function LockTapeSwitch({ f, children, onTab }) {
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
        onTab?.(id === 'book');
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
      <div style={{ display: 'flex', gap: 12, marginBottom: 6, padding: '0 22px' }}>
        {btn('limit', 'LIMIT')}
        {btn('book', 'BOOK')}
      </div>
      {tab === 'book' ? (
        <div onClick={(e) => e.stopPropagation()} style={{ padding: '0 22px' }}>
          <BookView slice={slice} oursLabel={f?.pickLabel} oppLabel={f?.oppMarketLabel} />
        </div>
      ) : children}
    </div>
  );
}
