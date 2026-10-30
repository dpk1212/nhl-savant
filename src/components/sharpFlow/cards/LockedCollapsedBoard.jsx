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
import { isMySharpShort, normalizeWalletShort } from '../../../lib/mySharps.js';
import TeamCrest, { boardCrestName } from './TeamCrest.jsx';

const C = {
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
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

function nick(s) {
  const w = String(s || '').trim().split(/\s+/).filter(Boolean);
  return w.length ? w[w.length - 1] : '';
}

function ourSideLabel(f) {
  const pick = String(f?.pickLabel || '').trim();
  const total = pick.match(/^(Over|Under)\b/i);
  if (total) {
    const w = total[1];
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }
  if (f?.side === 'home') return f.homeShort || nick(f.home) || 'our side';
  if (f?.side === 'away') return f.awayShort || nick(f.away) || 'our side';
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
  // HC is a press, not a stamp. A proven / winner-pool wallet at ≥1.5× usual
  // is gold whether the sport book says CONFIRMED or FLAT — the sentence
  // above already names that press; the bar has to match.
  const winner = isWinnerPool(w) || !!w?.proven;
  if (winner && Number.isFinite(sr) && sr >= HC_RATIO) return 'hc';
  if (winner) return 'proven';
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
    loser: { background: '#145C38', opacity: 0.9 },
  },
  against: {
    hc: { background: VS, backgroundImage: STRIPES, opacity: 0.9 },
    proven: { background: VS, backgroundImage: STRIPES, opacity: 0.8 },
    loser: { background: '#96A2B8', backgroundImage: STRIPES, opacity: 0.35 },
  },
};

function blockTip(w, side, { saved = false, name = null } = {}) {
  const bits = [];
  if (name) bits.push(name);
  if (w.short) bits.push(`…${w.short}`);
  if (saved) bits.push('★ My Sharps');
  const cls = classify(w);
  bits.push(cls === 'hc' ? 'high-conviction winner' : cls === 'proven' ? 'proven winner' : 'tracked loser');
  bits.push(fmtUsd(w.invested));
  const sr = Number(w.displaySizeRatio ?? w.sizeRatio);
  if (Number.isFinite(sr) && sr > 0) bits.push(`${sr.toFixed(1)}× usual`);
  bits.push(side === 'ours' ? 'on our side' : 'against us');
  return bits.join(' · ');
}

export default function LockedCollapsedBoard({ f, mineShorts = null, names = null }) {
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
  const againstProven = Math.max(0, Number(f.against?.proven) || 0);
  const dimAgainst = theirsUsd > 0 && againstProven < 1
    && !theirs.some((w) => !w._agg && (isWinnerPool(w) || w.proven));

  // Strongest at the seam: ours sorted weakest→strongest left to right,
  // theirs strongest→weakest. Min visible width so a $50 wallet still exists.
  const sortOurs = [...ours].sort((a, b) => RANK[classify(b)] - RANK[classify(a)]
    || (a.invested || 0) - (b.invested || 0));
  const sortTheirs = [...theirs].sort((a, b) => RANK[classify(a)] - RANK[classify(b)]
    || (b.invested || 0) - (a.invested || 0));
  const widthOf = (w, sideUsd) => {
    const share = sideUsd > 0 ? ((Number(w.invested) || 0) / sideUsd) * 100 : 0;
    return Math.max(share, 8);
  };

  const block = (w, side, i, arr, sideUsd) => {
    const cls = classify(w);
    const st = BLOCK_STYLE[side][cls] || BLOCK_STYLE[side].proven;
    const first = i === 0;
    const last = i === arr.length - 1;
    const saved = !w._agg && isMySharpShort(mineShorts, w.short);
    const id = normalizeWalletShort(w.short);
    const name = saved ? (names?.[id] || null) : null;
    const radius = first && last ? 6 : first ? '6px 2px 2px 6px' : last ? '2px 6px 6px 2px' : 2;
    return (
      <div
        key={`${side}-${i}`}
        className="sf-board-block"
        title={w._agg
          ? (side === 'ours' ? `${fmtUsd(w.invested)} qualified on our side` : `${fmtUsd(w.invested)} qualified against`)
          : blockTip(w, side, { saved, name })}
        style={{
          width: `${widthOf(w, sideUsd).toFixed(2)}%`,
          height: '100%',
          borderRadius: radius,
          flexShrink: 1, minWidth: 4,
          position: 'relative',
          zIndex: saved ? 2 : 0,
          ...st,
          ...(saved ? {
            opacity: 1,
            boxShadow: 'inset 0 0 0 2px #F3E3AC, 0 0 8px rgba(212,175,55,0.85)',
          } : null),
        }}
      />
    );
  };

  const end = (which, usd, dim) => {
    const label = which === 'ours' ? ourSideLabel(f) : theirSideLabel(f);
    const crest = boardCrestName(f, which);
    const right = which === 'against';
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, minWidth: 0,
        flexDirection: right ? 'row-reverse' : 'row',
        opacity: dim ? 0.62 : 1,
      }}>
        {crest ? (
          <TeamCrest name={crest} sport={f.sport} size={right ? 26 : 30} dim={!!dim} />
        ) : null}
        <div style={{ textAlign: right ? 'right' : 'left', minWidth: 0 }}>
          <div style={{
            fontSize: right ? '1.02rem' : '1.22rem',
            fontWeight: 720,
            letterSpacing: '-0.03em',
            color: dim ? C.textMuted : (right ? C.textSec : C.text),
            fontFeatureSettings: "'tnum'",
            lineHeight: 1,
          }}
          >
            {fmtUsd(usd)}
          </div>
          <div style={{
            marginTop: 4,
            fontSize: 11,
            fontWeight: 600,
            color: C.textMuted,
            letterSpacing: '0.01em',
            lineHeight: 1,
          }}
          >
            {label}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div data-board="score" style={{ marginTop: 18, position: 'relative' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
      }}
      >
        {end('ours', oursUsd, false)}
        {theirsUsd > 0 ? end('against', theirsUsd, dimAgainst) : null}
      </div>
      <div style={{
        display: 'flex', alignItems: 'stretch', height: 12, marginTop: 10,
        gap: theirsUsd > 0 ? 8 : 0,
      }}
      >
        <div style={{ flex: `${oursUsd} 1 0px`, display: 'flex', gap: 1.5, minWidth: 12 }}>
          {sortOurs.map((w, i) => block(w, 'ours', i, sortOurs, oursUsd))}
        </div>
        {theirsUsd > 0 && (
          <div style={{
            flex: `${theirsUsd} 1 0px`, display: 'flex', gap: 1.5, minWidth: 12,
            opacity: dimAgainst ? 0.55 : 1,
          }}
          >
            {sortTheirs.map((w, i) => block(w, 'against', i, sortTheirs, theirsUsd))}
          </div>
        )}
      </div>
    </div>
  );
}
