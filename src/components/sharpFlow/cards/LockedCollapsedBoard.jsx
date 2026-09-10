/**
 * THE BOARD — the card's cornerstone figure.
 *
 * Every tracked wallet on this market rendered as a block of real dollars
 * standing on its side of the battle line. Block width = dollars. The seam
 * sits exactly at the money split; strongest conviction fights at the front.
 *
 *   gold  = high-conviction confirmed winner (≥1.5× usual size)
 *   green = proven / confirmed winner
 *   slate = qualified money
 *   red   = tracked loser (honest: shown on OUR side too when they're here)
 *
 * This is the product itself — "we follow winning bettors' money" — drawn,
 * not described. Tooltips carry each wallet's receipt.
 */
import { HC_RATIO } from '../../../lib/ags.js';

const C = {
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
};
const GREEN = '#2fd57e';
const VS = '#F07167';
const GOLD = '#E8D28A';

function fmtUsd(v) {
  const n = Number(v) || 0;
  if (n >= 1000) {
    const k = n / 1000;
    return `$${k >= 10 ? Math.round(k) : (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1))}K`;
  }
  return `$${Math.round(n)}`;
}

function ourSideLabel(f) {
  const pick = String(f?.pickLabel || '').trim();
  const total = pick.match(/^(Over|Under)\b/i);
  if (total) {
    const w = total[1];
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }
  if (f?.side === 'home' && f.homeShort) return f.homeShort;
  if (f?.side === 'away' && f.awayShort) return f.awayShort;
  return 'our side';
}

function theirSideLabel(f) {
  if (f?.against?.abbr) return f.against.abbr;
  const pick = String(f?.pickLabel || '').trim();
  if (/^over\b/i.test(pick)) return 'Under';
  if (/^under\b/i.test(pick)) return 'Over';
  if (f?.side === 'home' && f.awayShort) return f.awayShort;
  if (f?.side === 'away' && f.homeShort) return f.homeShort;
  return 'other side';
}

function boardPool(f) {
  if (Array.isArray(f?.mapWallets) && f.mapWallets.length) return f.mapWallets;
  if (Array.isArray(f?.wallets) && f.wallets.length) {
    return f.wallets.map((w) => ({ ...w, side: w.side === 'against' ? 'against' : 'ours' }));
  }
  return [];
}

function isWinnerPool(w) {
  if (!w) return false;
  if (w.whitelisted === true) return true;
  const t = String(w.whitelist || '').toUpperCase();
  return t === 'CONFIRMED' || t === 'FLAT';
}

function classify(w) {
  const sr = Number(w?.displaySizeRatio ?? w?.sizeRatio);
  const confirmed = String(w?.whitelist || '').toUpperCase() === 'CONFIRMED';
  if (confirmed && Number.isFinite(sr) && sr >= HC_RATIO) return 'hc';
  if (isWinnerPool(w) || w?.proven) return 'proven';
  return 'loser';
}

// Front line order: strongest fights at the seam.
const RANK = { hc: 0, proven: 1, loser: 2 };

// Against blocks wear stripes — the universal "opposition" texture, so the
// two sides of the seam can never be confused, color aside.
const STRIPES = 'repeating-linear-gradient(135deg, rgba(7,9,18,0.5) 0px, rgba(7,9,18,0.5) 2.5px, transparent 2.5px, transparent 5.5px)';

const BLOCK_STYLE = {
  ours: {
    hc: { background: GOLD, opacity: 0.95 },
    proven: { background: GREEN, opacity: 0.8 },
    loser: { background: '#A05A54', opacity: 0.55 },
  },
  against: {
    hc: { background: VS, backgroundImage: STRIPES, opacity: 0.9 },
    proven: { background: VS, backgroundImage: STRIPES, opacity: 0.8 },
    loser: { background: '#96A2B8', backgroundImage: STRIPES, opacity: 0.35 },
  },
};

const LEGEND = [
  { cls: 'hc', label: 'HC', tip: 'High-conviction confirmed winner — bet ≥1.5× their usual size', color: GOLD, opacity: 0.95 },
  { cls: 'proven', label: 'proven', tip: 'Confirmed winning wallet', color: GREEN, opacity: 0.8 },
  { cls: 'loser', label: 'losers', tip: 'Tracked losing wallets — shown honestly on either side', color: '#A05A54', opacity: 0.8 },
];

function blockTip(w, side) {
  const bits = [];
  if (w.short) bits.push(`…${w.short}`);
  const cls = classify(w);
  bits.push(cls === 'hc' ? 'high-conviction winner' : cls === 'proven' ? 'proven winner' : 'tracked loser');
  bits.push(fmtUsd(w.invested));
  const sr = Number(w.displaySizeRatio ?? w.sizeRatio);
  if (Number.isFinite(sr) && sr > 0) bits.push(`${sr.toFixed(1)}× usual`);
  bits.push(side === 'ours' ? 'on our side' : 'against us');
  return bits.join(' · ');
}

export default function LockedCollapsedBoard({ f }) {
  if (!f) return null;

  const pool = boardPool(f).filter((w) => (Number(w?.invested) || 0) > 0);
  let ours = pool.filter((w) => w.side !== 'against');
  let theirs = pool.filter((w) => w.side === 'against');

  // Aggregate fallback — no per-wallet detail, still draw the balance.
  const stampedOurs = Number(f.sharpUsd ?? f.sideInvested) || 0;
  const stampedTheirs = Number(f.against?.invested) || 0;
  const aggregate = !pool.length && (stampedOurs > 0 || stampedTheirs > 0);
  if (aggregate) {
    ours = stampedOurs > 0 ? [{ invested: stampedOurs, proven: true, _agg: true }] : [];
    theirs = stampedTheirs > 0 ? [{ invested: stampedTheirs, side: 'against', _agg: true }] : [];
  }
  if (!ours.length && !theirs.length) return null;

  const sum = (rows) => rows.reduce((s, w) => s + (Number(w.invested) || 0), 0);
  const oursUsd = sum(ours);
  const theirsUsd = sum(theirs);
  const total = oursUsd + theirsUsd;
  if (total <= 0) return null;
  const oursPct = (oursUsd / total) * 100;

  // Strongest at the seam: ours sorted weakest→strongest left to right,
  // theirs strongest→weakest. Min visible width so a $50 wallet still exists.
  const sortOurs = [...ours].sort((a, b) => RANK[classify(b)] - RANK[classify(a)]
    || (a.invested || 0) - (b.invested || 0));
  const sortTheirs = [...theirs].sort((a, b) => RANK[classify(a)] - RANK[classify(b)]
    || (b.invested || 0) - (a.invested || 0));
  const MIN_W = 1.4;
  const widthOf = (w) => Math.max(MIN_W, ((Number(w.invested) || 0) / total) * 100);

  const block = (w, side, i, arr) => {
    const cls = classify(w);
    const st = BLOCK_STYLE[side][cls] || BLOCK_STYLE[side].proven;
    const first = side === 'ours' && i === 0;
    const last = side === 'against' && i === arr.length - 1;
    return (
      <div
        key={`${side}-${i}`}
        className="sf-board-block"
        title={w._agg
          ? (side === 'ours' ? `${fmtUsd(w.invested)} qualified on our side` : `${fmtUsd(w.invested)} qualified against`)
          : blockTip(w, side)}
        style={{
          width: `${widthOf(w).toFixed(2)}%`,
          height: '100%',
          borderRadius: first ? '5px 1px 1px 5px' : last ? '1px 5px 5px 1px' : 1,
          flexShrink: 1, minWidth: 3,
          ...st,
        }}
      />
    );
  };

  // Dynamic legend — only name the colors that actually stand on our side.
  const oursClasses = new Set(ours.map((w) => (w._agg ? 'proven' : classify(w))));
  const legendItems = LEGEND.filter((l) => oursClasses.has(l.cls));

  return (
    <div style={{ marginTop: 16, position: 'relative' }}>
      {/* Seam marker — the split, stated once, exactly where it happens.
          The label takes the tone of the number: strong lean gold, split
          slate, board-against-us red. 21% in celebration gold was a lie. */}
      <div style={{
        position: 'relative', height: 15, marginBottom: 3,
        fontFeatureSettings: "'tnum'",
      }}>
        <span style={{
          position: 'absolute',
          left: `${Math.max(7, Math.min(93, oursPct)).toFixed(1)}%`,
          transform: 'translateX(-50%)',
          fontSize: 10.5, fontWeight: 750, letterSpacing: '0.01em',
          color: oursPct >= 60 ? GOLD : oursPct >= 40 ? C.textSec : VS,
          whiteSpace: 'nowrap', lineHeight: 1,
        }}>
          {Math.round(oursPct)}% here
        </span>
      </div>

      {/* The board — every wallet, real dollars, one battle line */}
      <div style={{
        display: 'flex', alignItems: 'stretch', height: 22, gap: 1.5,
        position: 'relative',
      }}>
        {sortOurs.map((w, i) => block(w, 'ours', i, sortOurs))}
        {theirsUsd > 0 && (
          <div style={{
            width: 2, flexShrink: 0, borderRadius: 1,
            background: 'rgba(244,247,251,0.55)',
          }} />
        )}
        {sortTheirs.map((w, i) => block(w, 'against', i, sortTheirs))}
      </div>

      {/* Dollars at the ends — the caption the eye wants next */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginTop: 7, fontFeatureSettings: "'tnum'",
      }}>
        <span
          title="All tracked money on this side — winners and losers; blocks show who"
          style={{ fontSize: 12.5, fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}
        >
          {fmtUsd(oursUsd)}
          <span style={{ fontSize: 10.5, fontWeight: 450, color: C.textFaint, marginLeft: 5 }}>
            on
          </span>
          <span style={{ fontSize: 10.5, fontWeight: 650, color: C.textSec, marginLeft: 4 }}>
            {ourSideLabel(f)}
          </span>
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 550, color: theirsUsd > 0 ? C.textMuted : C.textFaint, letterSpacing: '-0.02em' }}>
          {theirsUsd > 0 ? (
            <>
              <span style={{ fontSize: 10.5, fontWeight: 650, color: C.textMuted, marginRight: 4 }}>
                {theirSideLabel(f)}
              </span>
              {fmtUsd(theirsUsd)}
            </>
          ) : 'nothing against'}
        </span>
      </div>

      {/* Legend — the code key, only for colors actually on the board */}
      {legendItems.length > 0 && !aggregate && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 6,
          fontSize: 9.5, fontWeight: 500, color: C.textFaint, letterSpacing: '0.015em',
          whiteSpace: 'nowrap',
        }}>
          {legendItems.map((l) => (
            <span key={l.cls} title={l.tip} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                width: 6, height: 6, borderRadius: 2,
                background: l.color, opacity: l.opacity,
              }} />
              {l.label}
            </span>
          ))}
          {theirsUsd > 0 && (
            <span title="Striped blocks are money against us" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                width: 6, height: 6, borderRadius: 2,
                background: '#96A2B8', backgroundImage: STRIPES, opacity: 0.75,
              }} />
              against
            </span>
          )}
          <span style={{ marginLeft: 'auto' }}>hover a block</span>
        </div>
      )}
    </div>
  );
}
