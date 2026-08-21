/**
 * Collapsed Locked — compact dollar-split bars under the chart.
 *
 * 1. FULL DOLLARS — all tracked $ on this board (ours vs against)
 * 2. LOSING WALLETS — WR50 / non-winner tracked $ only
 * 3. CONFIRMED WINNERS — CONFIRMED-tier $; dual color; HC% of our confirmed $
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
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";

function fmtUsd(v) {
  if (v == null || !Number.isFinite(Number(v)) || Number(v) <= 0) return '$0';
  const n = Number(v);
  if (n >= 1000) {
    const k = n / 1000;
    return `$${k >= 10 ? Math.round(k) : (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1))}K`;
  }
  return `$${Math.round(n)}`;
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

/** Losing track-record / LODO wallets we still track on the board. */
function isLosingWallet(w) {
  if (!w || (w.invested || 0) <= 0) return false;
  if (isWinnerPool(w)) return false;
  const t = String(w.whitelist || '').toUpperCase();
  return t === 'WR50' || !w.whitelisted || t === '' || t === 'NULL';
}

function isConfirmed(w) {
  return !!w && String(w.whitelist || '').toUpperCase() === 'CONFIRMED';
}

function isHc(w) {
  const sr = Number(w?.displaySizeRatio ?? w?.sizeRatio);
  return isConfirmed(w) && Number.isFinite(sr) && sr >= HC_RATIO;
}

function sumSide(rows, side) {
  return rows.filter((w) => w.side === side).reduce((s, w) => s + (Number(w.invested) || 0), 0);
}

function splitOf(ours, theirs) {
  const o = Math.max(0, Number(ours) || 0);
  const t = Math.max(0, Number(theirs) || 0);
  const total = o + t;
  return {
    ours: o,
    theirs: t,
    total,
    oursPct: total > 0 ? Math.round((o / total) * 100) : null,
  };
}

/**
 * Full dollars = board totals (same numbers Contested / Unopposed use).
 * Losers / Confirmed = mapWallets tier filters when present.
 */
export function computeCollapsedBattleSplits(f) {
  const pool = boardPool(f);

  const stampedOurs = Number(f?.sharpUsd ?? f?.sideInvested) || 0;
  const stampedTheirs = Number(f?.against?.invested) || 0;
  const poolOurs = sumSide(pool, 'ours');
  const poolTheirs = sumSide(pool, 'against');

  // Prefer stamped board totals (authoritative contested/unopposed $).
  // Fall back to full mapWallets census when stamps are empty.
  const full = (stampedOurs > 0 || stampedTheirs > 0)
    ? splitOf(stampedOurs, stampedTheirs)
    : splitOf(poolOurs, poolTheirs);

  const losers = splitOf(sumSide(pool.filter(isLosingWallet), 'ours'), sumSide(pool.filter(isLosingWallet), 'against'));

  const confirmedRows = pool.filter(isConfirmed);
  const confirmed = splitOf(sumSide(confirmedRows, 'ours'), sumSide(confirmedRows, 'against'));
  // If mapWallets missing confirmed tags but wallets[] has them, try wallets.
  let confirmedFinal = confirmed;
  if (confirmed.total <= 0 && Array.isArray(f?.wallets)) {
    const rows = f.wallets
      .filter((w) => w && (w.invested || 0) > 0 && isConfirmed({ ...w, whitelist: w.whitelist || (w.whitelisted ? 'CONFIRMED' : null) }))
      .map((w) => ({ ...w, side: w.side === 'against' ? 'against' : 'ours' }));
    confirmedFinal = splitOf(sumSide(rows, 'ours'), sumSide(rows, 'against'));
  }

  // Proven-but-untagged fallback: treat proven ours as confirmed when tier missing.
  if (confirmedFinal.total <= 0 && pool.length) {
    const provenRows = pool.filter((w) => w.proven);
    if (provenRows.length) {
      confirmedFinal = splitOf(sumSide(provenRows, 'ours'), sumSide(provenRows, 'against'));
    }
  }

  const hcSource = confirmedRows.length
    ? confirmedRows
    : pool.filter((w) => w.proven || isConfirmed(w));
  const hcOurs = hcSource
    .filter((w) => w.side === 'ours' && (isHc(w) || (
      w.proven && Number(w.displaySizeRatio ?? w.sizeRatio) >= HC_RATIO
    )))
    .reduce((s, w) => s + (Number(w.invested) || 0), 0);
  const confirmedOurs = confirmedFinal.ours;
  const hcPct = confirmedOurs > 0 ? Math.round((hcOurs / confirmedOurs) * 100) : null;
  const nonHcOurs = Math.max(0, confirmedOurs - hcOurs);

  return {
    full,
    losers,
    confirmed: confirmedFinal,
    hcPct,
    hcOurs,
    nonHcOurs,
  };
}

function SplitBar({
  oursPct,
  theirsPct,
  accentOurs,
  accentTheirs,
  /** Optional: split the ours segment into HC (gold) + rest */
  hcOursPct = null,
}) {
  const showHcSplit = Number.isFinite(hcOursPct) && hcOursPct > 0 && hcOursPct < 100;
  const hcW = showHcSplit ? Math.round((oursPct * hcOursPct) / 100) : 0;
  const restW = showHcSplit ? Math.max(0, oursPct - hcW) : oursPct;

  return (
    <div style={{
      display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden',
      background: 'rgba(255,255,255,0.04)', gap: 1,
    }}>
      {showHcSplit ? (
        <>
          {hcW > 0 && (
            <div style={{
              width: `${hcW}%`,
              background: `linear-gradient(90deg, ${GOLD}aa, ${GOLD})`,
              borderRadius: 2,
            }} />
          )}
          {restW > 0 && (
            <div style={{
              width: `${restW}%`,
              background: `linear-gradient(90deg, ${accentOurs}66, ${accentOurs})`,
              borderRadius: 2,
            }} />
          )}
        </>
      ) : (
        <div style={{
          width: `${Math.max(oursPct, theirsPct <= 0 ? 100 : oursPct)}%`,
          background: `linear-gradient(90deg, ${accentOurs}88, ${accentOurs})`,
          borderRadius: 2,
        }} />
      )}
      {theirsPct > 0 && (
        <div style={{
          width: `${theirsPct}%`,
          background: `linear-gradient(90deg, ${accentTheirs}55, ${accentTheirs})`,
          borderRadius: 2,
        }} />
      )}
    </div>
  );
}

function CompactSplitRow({
  label,
  sub,
  ours,
  theirs,
  oursLabel = 'Us',
  theirsLabel = 'Them',
  accentOurs = GREEN,
  accentTheirs = VS,
  tag = null,
  tip = null,
  hcOursPct = null,
}) {
  const total = ours + theirs;
  if (total <= 0) return null;
  const oursPct = Math.round((ours / total) * 100);
  const theirsPct = Math.max(0, 100 - oursPct);

  return (
    <div title={tip || undefined} style={{ marginBottom: 9 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: 8, marginBottom: 2,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: MONO, fontSize: 8, fontWeight: 750,
            letterSpacing: '0.10em', color: C.textMuted, textTransform: 'uppercase',
          }}>
            {label}
          </div>
          {sub && (
            <div style={{ fontSize: 9, fontWeight: 550, color: C.textFaint, marginTop: 1 }}>
              {sub}
            </div>
          )}
        </div>
        {tag && (
          <span style={{
            flexShrink: 0, fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
            color: tag.color || GOLD, fontFeatureSettings: "'tnum'",
          }}>
            {tag.text}
          </span>
        )}
      </div>

      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: 8, marginBottom: 3, fontFeatureSettings: "'tnum'",
        fontSize: 12, fontWeight: 700,
      }}>
        <span style={{ color: accentOurs }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.textFaint, marginRight: 4 }}>{oursLabel}</span>
          {fmtUsd(ours)}
        </span>
        <span style={{ color: C.textFaint, fontWeight: 500, fontSize: 10 }}>
          {oursPct != null ? `${oursPct}% / ${theirsPct}%` : ''}
        </span>
        <span style={{ color: theirs > 0 ? accentTheirs : C.textFaint, textAlign: 'right' }}>
          {fmtUsd(theirs)}
          <span style={{ fontSize: 9, fontWeight: 600, color: C.textFaint, marginLeft: 4 }}>{theirsLabel}</span>
        </span>
      </div>

      <SplitBar
        oursPct={Math.max(oursPct, 0)}
        theirsPct={theirsPct}
        accentOurs={accentOurs}
        accentTheirs={accentTheirs}
        hcOursPct={hcOursPct}
      />
    </div>
  );
}

export default function LockedCollapsedBattleBars({ f }) {
  if (!f) return null;
  const { full, losers, confirmed, hcPct, hcOurs, nonHcOurs } = computeCollapsedBattleSplits(f);

  const hasFull = full.total > 0;
  const hasLosers = losers.total > 0;
  const hasConfirmed = confirmed.total > 0;
  if (!hasFull && !hasLosers && !hasConfirmed) return null;

  const oursLabel = 'Us';
  const theirsLabel = f?.against?.abbr || 'Them';
  const hcShareOfOurs = confirmed.ours > 0 && hcOurs > 0
    ? Math.round((hcOurs / confirmed.ours) * 100)
    : (hcPct === 0 ? 0 : null);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px solid rgba(148,163,184,0.10)',
      }}
    >
      {hasFull && (
        <CompactSplitRow
          label="Full dollar split"
          sub="All tracked money on this board"
          ours={full.ours}
          theirs={full.theirs}
          oursLabel={oursLabel}
          theirsLabel={theirsLabel}
          accentOurs={GREEN}
          accentTheirs={VS}
          tip="Total dollars on our side vs the other side (same board $ as Contested / Unopposed)"
        />
      )}
      {hasLosers && (
        <CompactSplitRow
          label="Losing wallets"
          sub="WR50 / non-winner money only"
          ours={losers.ours}
          theirs={losers.theirs}
          oursLabel={oursLabel}
          theirsLabel={theirsLabel}
          accentOurs="rgba(148,163,184,0.85)"
          accentTheirs="rgba(240,113,103,0.70)"
          tip="Where losing-track-record wallets we track have their money on this game"
        />
      )}
      {hasConfirmed && (
        <CompactSplitRow
          label="Confirmed winners"
          sub={hcOurs > 0
            ? `HC ${fmtUsd(hcOurs)} · rest ${fmtUsd(nonHcOurs)}`
            : 'CONFIRMED-tier only · gold = HC (≥1.5×)'}
          ours={confirmed.ours}
          theirs={confirmed.theirs}
          oursLabel={oursLabel}
          theirsLabel={theirsLabel}
          accentOurs={GREEN}
          accentTheirs={VS}
          hcOursPct={hcShareOfOurs}
          tag={hcPct != null ? { text: `HC ${hcPct}%`, color: GOLD } : null}
          tip="CONFIRMED winners only. Bar: HC (gold) + other confirmed (green) vs against (red). Tag = HC share of our confirmed $"
        />
      )}
    </div>
  );
}
