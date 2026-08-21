/**
 * Collapsed Locked — compact battle money bars under the chart.
 *
 * 1. FULL — CONFIRMED+FLAT sharp money (same pool as signal-page SHARP MONEY)
 * 2. LOSERS — WR50 + non-winner tracked wallets we still see on the board
 * 3. CONFIRMED — CONFIRMED-tier only, dual color, % = HC share of our confirmed $
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
    return f.wallets.map((w) => ({ ...w, side: w.side || 'ours' }));
  }
  return [];
}

/** Signal-page money pool: CONFIRMED + FLAT winners. */
function isFullSharp(w) {
  if (!w) return false;
  if (w.whitelisted === true) return true;
  const t = String(w.whitelist || '').toUpperCase();
  return t === 'CONFIRMED' || t === 'FLAT';
}

/** Losing / LODO pool we still track — WR50 or non-winner on the board. */
function isLoserTracked(w) {
  if (!w || (w.invested || 0) <= 0) return false;
  if (isFullSharp(w)) return false;
  const t = String(w.whitelist || '').toUpperCase();
  return t === 'WR50' || t === '' || t === 'NULL' || !w.whitelisted;
}

function isConfirmed(w) {
  if (!w) return false;
  return String(w.whitelist || '').toUpperCase() === 'CONFIRMED';
}

function isHc(w) {
  const sr = Number(w?.displaySizeRatio ?? w?.sizeRatio);
  return isConfirmed(w) && Number.isFinite(sr) && sr >= HC_RATIO;
}

function sumSide(rows, side) {
  return rows.filter((w) => w.side === side).reduce((s, w) => s + (Number(w.invested) || 0), 0);
}

function splitFromRows(rows) {
  const ours = sumSide(rows, 'ours');
  const theirs = sumSide(rows, 'against');
  const total = ours + theirs;
  return {
    ours,
    theirs,
    total,
    oursPct: total > 0 ? Math.round((ours / total) * 100) : null,
  };
}

/**
 * Prefer mapWallets census. Fall back to stamped sharpUsd / against / moneyPct
 * for FULL when the board snapshot is thin (legacy picks).
 */
export function computeCollapsedBattleSplits(f) {
  const pool = boardPool(f);

  let full = splitFromRows(pool.filter(isFullSharp));
  if (full.total <= 0) {
    const ours = Number(f?.sharpUsd ?? f?.sideInvested) || 0;
    const stampedPct = Number(f?.moneyPct);
    let theirs = Number(f?.against?.invested) || 0;
    if (ours > 0 && Number.isFinite(stampedPct) && stampedPct > 0 && stampedPct < 100 && theirs <= 0) {
      theirs = Math.round(ours * ((100 - stampedPct) / stampedPct));
    }
    const total = ours + theirs;
    full = {
      ours,
      theirs,
      total,
      oursPct: total > 0
        ? (Number.isFinite(stampedPct) ? Math.round(stampedPct) : Math.round((ours / total) * 100))
        : null,
    };
  }

  const losers = splitFromRows(pool.filter(isLoserTracked));
  const confirmedRows = pool.filter(isConfirmed);
  const confirmed = splitFromRows(confirmedRows);
  const hcOurs = confirmedRows
    .filter((w) => w.side === 'ours' && isHc(w))
    .reduce((s, w) => s + (Number(w.invested) || 0), 0);
  const hcPct = confirmed.ours > 0 ? Math.round((hcOurs / confirmed.ours) * 100) : null;

  return { full, losers, confirmed, hcPct, hcOurs };
}

function CompactSplitRow({
  label,
  ours,
  theirs,
  accentOurs = GREEN,
  accentTheirs = VS,
  tag = null,
  tip = null,
}) {
  const total = ours + theirs;
  if (total <= 0) return null;
  const oursPct = Math.max(2, Math.round((ours / total) * 100));
  const theirsPct = Math.max(0, 100 - oursPct);

  return (
    <div title={tip || undefined} style={{ marginBottom: 7 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: 8, marginBottom: 3, fontFeatureSettings: "'tnum'",
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 8, fontWeight: 750,
          letterSpacing: '0.12em', color: C.textFaint, textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          {label}
        </span>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0,
          fontSize: 11, fontWeight: 650,
        }}>
          <span style={{ color: accentOurs }}>{fmtUsd(ours)}</span>
          <span style={{ color: C.textFaint, fontWeight: 500 }}>·</span>
          <span style={{ color: C.textMuted }}>{fmtUsd(theirs)}</span>
          {tag && (
            <span style={{
              marginLeft: 2, fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
              color: tag.color || GOLD,
            }}>
              {tag.text}
            </span>
          )}
        </div>
      </div>
      <div style={{
        display: 'flex', height: 5, borderRadius: 2.5, overflow: 'hidden',
        background: 'rgba(255,255,255,0.04)', gap: 1,
      }}>
        <div style={{
          width: `${oursPct}%`,
          background: `linear-gradient(90deg, ${accentOurs}88, ${accentOurs})`,
          borderRadius: 2,
        }} />
        <div style={{
          width: `${theirsPct}%`,
          background: theirs > 0
            ? `linear-gradient(90deg, ${accentTheirs}55, ${accentTheirs}99)`
            : 'transparent',
          borderRadius: 2,
        }} />
      </div>
    </div>
  );
}

export default function LockedCollapsedBattleBars({ f }) {
  if (!f) return null;
  const { full, losers, confirmed, hcPct } = computeCollapsedBattleSplits(f);

  const hasFull = full.total > 0;
  const hasLosers = losers.total > 0;
  const hasConfirmed = confirmed.total > 0;
  if (!hasFull && !hasLosers && !hasConfirmed) return null;

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
          label="Full"
          ours={full.ours}
          theirs={full.theirs}
          accentOurs={GREEN}
          accentTheirs={VS}
          tag={full.oursPct != null ? { text: `${full.oursPct}%`, color: C.textSec } : null}
          tip="CONFIRMED + FLAT sharp money — same pool as signal-page SHARP MONEY"
        />
      )}
      {hasLosers && (
        <CompactSplitRow
          label="Losers"
          ours={losers.ours}
          theirs={losers.theirs}
          accentOurs="rgba(148,163,184,0.75)"
          accentTheirs="rgba(240,113,103,0.55)"
          tag={losers.oursPct != null ? { text: `${losers.oursPct}%`, color: C.textFaint } : null}
          tip="WR50 + non-winner tracked wallets — where loser money sits on this board"
        />
      )}
      {hasConfirmed && (
        <CompactSplitRow
          label="Confirmed"
          ours={confirmed.ours}
          theirs={confirmed.theirs}
          accentOurs={GOLD}
          accentTheirs={VS}
          tag={hcPct != null
            ? { text: `HC ${hcPct}%`, color: GOLD }
            : (confirmed.oursPct != null ? { text: `${confirmed.oursPct}%`, color: GOLD } : null)}
          tip="CONFIRMED-tier winners only. HC% = share of our confirmed $ at ≥1.5× usual"
        />
      )}
    </div>
  );
}
