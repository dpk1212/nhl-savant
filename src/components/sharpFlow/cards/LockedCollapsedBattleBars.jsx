/**
 * Collapsed Locked — compact dollar-split bars under the chart.
 *
 * Prefers wide Vault-parity stamps (boardMoney*) when present:
 *   Full split / Losing wallets / Confirmed winners
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

function isLosingWallet(w) {
  if (!w || (w.invested || 0) <= 0) return false;
  if (isWinnerPool(w)) return false;
  return true;
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

function asSplit(obj) {
  if (!obj) return null;
  const ours = Number(obj.ours) || 0;
  const theirs = Number(obj.theirs) || 0;
  if (ours <= 0 && theirs <= 0) return null;
  return splitOf(ours, theirs);
}

/**
 * Prefer wide boardMoney* stamps (raw Vault pool + exchange). Fall back to
 * mapWallets / sharpUsd for labs and legacy fixtures.
 */
export function computeCollapsedBattleSplits(f) {
  const stampedFull = asSplit(f?.boardMoneyFull || f?.boardMoney?.full);
  const stampedLosers = asSplit(f?.boardMoneyLosers || f?.boardMoney?.losers);
  const stampedConfirmed = asSplit(f?.boardMoneyConfirmed || f?.boardMoney?.confirmed);

  if (stampedFull || stampedLosers || stampedConfirmed) {
    const confirmed = stampedConfirmed || splitOf(0, 0);
    const hcOurs = Number(f?.boardMoneyHcOurs ?? f?.boardMoney?.hcOurs) || 0;
    const hcPct = Number.isFinite(f?.boardMoneyHcPct)
      ? f.boardMoneyHcPct
      : (Number.isFinite(f?.boardMoney?.hcPct) ? f.boardMoney.hcPct : (
        confirmed.ours > 0 && hcOurs > 0 ? Math.round((hcOurs / confirmed.ours) * 100) : null
      ));
    const nonHcOurs = Number.isFinite(f?.boardMoneyNonHcOurs)
      ? f.boardMoneyNonHcOurs
      : Math.max(0, confirmed.ours - hcOurs);
    return {
      full: stampedFull || splitOf(0, 0),
      losers: stampedLosers || splitOf(0, 0),
      confirmed,
      hcPct,
      hcOurs,
      nonHcOurs,
    };
  }

  const pool = boardPool(f);
  const stampedOurs = Number(f?.sharpUsd ?? f?.sideInvested) || 0;
  const stampedTheirs = Number(f?.against?.invested) || 0;
  const poolOurs = sumSide(pool, 'ours');
  const poolTheirs = sumSide(pool, 'against');
  const full = (stampedOurs > 0 || stampedTheirs > 0)
    ? splitOf(stampedOurs, stampedTheirs)
    : splitOf(poolOurs, poolTheirs);
  const losers = splitOf(sumSide(pool.filter(isLosingWallet), 'ours'), sumSide(pool.filter(isLosingWallet), 'against'));
  const confirmedRows = pool.filter(isConfirmed);
  let confirmed = splitOf(sumSide(confirmedRows, 'ours'), sumSide(confirmedRows, 'against'));
  if (confirmed.total <= 0 && pool.length) {
    const provenRows = pool.filter((w) => w.proven);
    if (provenRows.length) {
      confirmed = splitOf(sumSide(provenRows, 'ours'), sumSide(provenRows, 'against'));
    }
  }
  const hcSource = confirmedRows.length ? confirmedRows : pool.filter((w) => w.proven || isConfirmed(w));
  const hcOurs = hcSource
    .filter((w) => w.side === 'ours' && (isHc(w) || (
      w.proven && Number(w.displaySizeRatio ?? w.sizeRatio) >= HC_RATIO
    )))
    .reduce((s, w) => s + (Number(w.invested) || 0), 0);
  const hcPct = confirmed.ours > 0 ? Math.round((hcOurs / confirmed.ours) * 100) : null;

  return {
    full,
    losers,
    confirmed,
    hcPct,
    hcOurs,
    nonHcOurs: Math.max(0, confirmed.ours - hcOurs),
  };
}

/**
 * Soft fill for a bar segment. NEVER append hex alpha onto rgba()/rgb() —
 * that produced invalid CSS (`rgba(...)88`) and the Losing bar painted empty.
 * Solid backgroundColor is always set so a bad gradient cannot blank the bar.
 */
function barFill(color, softHex = '88') {
  const c = String(color || '').trim();
  if (!c) return { backgroundColor: GREEN };
  if (c[0] === '#') {
    const hex = c.length >= 7 ? c.slice(0, 7) : c;
    return {
      backgroundColor: hex,
      backgroundImage: `linear-gradient(90deg, ${hex}${softHex}, ${hex})`,
    };
  }
  // rgba / rgb / named — use as-is (already has alpha if rgba)
  return { backgroundColor: c };
}

function SplitBar({
  oursPct,
  theirsPct,
  accentOurs,
  accentTheirs,
  hcOursPct = null,
  premium = false,
}) {
  const o = Math.max(0, Math.min(100, Number(oursPct) || 0));
  const t = Math.max(0, Math.min(100, Number(theirsPct) || 0));
  const showHcSplit = Number.isFinite(hcOursPct) && hcOursPct > 0 && hcOursPct < 100 && o > 0;
  const hcW = showHcSplit ? Math.max(1, Math.round((o * hcOursPct) / 100)) : 0;
  const restW = showHcSplit ? Math.max(0, o - hcW) : o;
  const oursFill = o > 0 && Number.isFinite(hcOursPct) && hcOursPct >= 100
    ? barFill(GOLD, 'aa')
    : barFill(accentOurs, premium ? 'cc' : '88');
  const hcFill = barFill(GOLD, 'aa');
  const restFill = barFill(accentOurs, premium ? '99' : '66');
  const theirsFill = barFill(accentTheirs, premium ? '77' : '55');

  // Premium: hairline bar with a seam between the sides (Kraken trading
  // activity / Stake overview). Ops keeps the solid 6px block.
  const barH = premium ? 4 : 6;
  return (
    <div style={{
      display: 'flex', height: barH, borderRadius: 999, overflow: 'hidden',
      background: premium ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.06)',
      gap: premium ? 2 : 0,
      minHeight: barH,
    }}>
      {showHcSplit ? (
        <>
          {hcW > 0 && (
            <div style={{
              flex: hcW, minWidth: hcW > 0 ? 2 : 0,
              ...hcFill,
            }} />
          )}
          {restW > 0 && (
            <div style={{
              flex: restW, minWidth: restW > 0 ? 2 : 0,
              ...restFill,
            }} />
          )}
        </>
      ) : (
        o > 0 && (
          <div style={{
            flex: o, minWidth: 2,
            ...oursFill,
          }} />
        )
      )}
      {t > 0 && (
        <div style={{
          flex: t, minWidth: 2,
          ...theirsFill,
        }} />
      )}
    </div>
  );
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
  return 'Us';
}

function CompactSplitRow({
  label,
  ours,
  theirs,
  oursLabel = 'Us',
  theirsLabel = 'Them',
  accentOurs = GREEN,
  accentTheirs = VS,
  tag = null,
  tip = null,
  hcOursPct = null,
  premium = false,
  scale = 1,
}) {
  const total = ours + theirs;
  if (total <= 0) return null;
  const oursPct = Math.round((ours / total) * 100);
  const theirsPct = Math.max(0, 100 - oursPct);

  if (premium) {
    // One line per split on a SHARED dollar scale: bar length = row total
    // relative to the biggest pool on the card, so you SEE where the big
    // money is — row-normalized bars hide magnitude. Label · bar · dollars.
    const pctW = Math.max(4, Math.round(scale * 100));
    return (
      <div
        title={tip || undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 11,
        }}
      >
        <span style={{
          width: 84, flexShrink: 0,
          fontSize: 11, fontWeight: 500, color: C.textMuted,
          letterSpacing: '0.01em', whiteSpace: 'nowrap',
        }}>
          {label}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ width: `${pctW}%` }}>
            <SplitBar
              oursPct={Math.max(oursPct, 0)}
              theirsPct={theirsPct}
              accentOurs={accentOurs}
              accentTheirs={accentTheirs}
              hcOursPct={hcOursPct}
              premium
            />
          </div>
        </div>
        <span style={{
          flexShrink: 0, display: 'inline-flex', alignItems: 'baseline', gap: 6,
          fontFeatureSettings: "'tnum'", fontSize: 13.5, fontWeight: 700,
          letterSpacing: '-0.02em', whiteSpace: 'nowrap',
        }}>
          <span style={{ color: accentOurs }}>{fmtUsd(ours)}</span>
          <span style={{ fontSize: 10, fontWeight: 450, color: C.textFaint }}>·</span>
          <span style={{ color: theirs > 0 ? accentTheirs : C.textFaint, fontWeight: 550 }}>{fmtUsd(theirs)}</span>
          {tag && (
            <span style={{
              fontSize: 9.5, fontWeight: 600, letterSpacing: '0.01em',
              color: tag.color || GOLD, marginLeft: 2,
            }}>
              {tag.text}
            </span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div title={tip || undefined} style={{ marginBottom: 9 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: 8, marginBottom: 3,
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 8, fontWeight: 750,
          letterSpacing: '0.10em', color: C.textMuted, textTransform: 'uppercase',
        }}>
          {label}
        </span>
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
          {`${oursPct}% / ${theirsPct}%`}
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

export default function LockedCollapsedBattleBars({ f, face = 'original', flush = false }) {
  if (!f) return null;
  const { full, losers, confirmed, hcPct, hcOurs } = computeCollapsedBattleSplits(f);

  const hasFull = full.total > 0;
  const hasLosers = losers.total > 0;
  const hasConfirmed = confirmed.total > 0;
  if (!hasFull && !hasLosers && !hasConfirmed) return null;

  const subscriber = face === 'subscriber';
  const oursLabel = subscriber ? ourSideLabel(f) : 'Us';
  const theirsLabel = f?.against?.abbr || 'Them';
  const hcShareOfOurs = confirmed.ours > 0 && hcOurs > 0
    ? Math.round((hcOurs / confirmed.ours) * 100)
    : (subscriber ? null : (hcPct === 0 ? 0 : null));
  const hcTag = subscriber
    ? (Number(hcPct) > 0 ? { text: `HC ${hcPct}%`, color: GOLD } : null)
    : (hcPct != null ? { text: `HC ${hcPct}%`, color: GOLD } : null);

  // Premium palette discipline: ONE green moment (confirmed winners with us).
  // The other side is neutral slate, never alarm-red — and losing money on
  // the other side is good news, so it must not paint the card red. Red is
  // reserved for the only real threat: tracked losers on OUR side.
  const SLATE = '#D7DEE9';
  const SLATE_DIM = '#5C6678';
  const losersMostlyOurs = losers.oursPct != null && losers.oursPct >= 60;
  const loserOursAccent = subscriber
    ? (losersMostlyOurs ? VS : SLATE_DIM)
    : GREEN;

  const src = f?.boardMoneySources;
  const tipBits = [];
  if (src?.wallets > 0) tipBits.push(`wallets $${Math.round(src.wallets).toLocaleString()}`);
  if (src?.whales > 0) tipBits.push(`whales $${Math.round(src.whales).toLocaleString()}`);
  if (src?.exchange > 0) tipBits.push(`flow residual $${Math.round(src.exchange).toLocaleString()}`);
  const fullTip = tipBits.length
    ? `${tipBits.join(' + ')} · this market only · no double-count`
    : 'This market only (wallets + unmatched whales + flow residual)';

  // Subscriber face: strongest evidence first. The center pct already carries
  // the number, so tags only add *meaning* — HC share, or the caution that
  // tracked losers landed on our side too.
  const losersTag = subscriber
    ? (losersMostlyOurs
      ? { text: 'on our side', color: VS }
      : (losers.ours <= 0 && losers.theirs > 0
        ? { text: 'all theirs', color: GREEN }
        : null))
    : null;

  // Shared dollar scale across the three pools — bar length says magnitude.
  const maxTotal = Math.max(confirmed.total, full.total, losers.total, 1);

  const confirmedRow = hasConfirmed && (
    <CompactSplitRow
      key="confirmed"
      label={subscriber ? 'Confirmed' : 'Confirmed winners'}
      ours={confirmed.ours}
      theirs={confirmed.theirs}
      oursLabel={oursLabel}
      theirsLabel={theirsLabel}
      accentOurs={GREEN}
      accentTheirs={subscriber ? SLATE_DIM : VS}
      hcOursPct={hcShareOfOurs}
      tag={hcTag}
      tip="CONFIRMED open positions on this market (bleeders excluded). Gold = HC (≥1.5×)"
      premium={subscriber}
      scale={confirmed.total / maxTotal}
    />
  );
  const fullRow = hasFull && (
    <CompactSplitRow
      key="full"
      label={subscriber ? 'All money' : 'Full split'}
      ours={full.ours}
      theirs={full.theirs}
      oursLabel={oursLabel}
      theirsLabel={theirsLabel}
      accentOurs={subscriber ? SLATE : GREEN}
      accentTheirs={subscriber ? SLATE_DIM : VS}
      tip={fullTip}
      premium={subscriber}
      scale={full.total / maxTotal}
    />
  );
  const losersRow = hasLosers && (
    <CompactSplitRow
      key="losers"
      label={subscriber ? 'Losing' : 'Losing wallets'}
      ours={losers.ours}
      theirs={losers.theirs}
      oursLabel={oursLabel}
      theirsLabel={theirsLabel}
      accentOurs={loserOursAccent}
      accentTheirs={subscriber ? SLATE_DIM : VS}
      tag={losersTag}
      tip="Tracked losers on this market: WR50, unranked, bleeders, positions-negative. No anon exchange prints."
      premium={subscriber}
      scale={losers.total / maxTotal}
    />
  );

  return (
    <div
      style={flush ? {} : {
        marginTop: subscriber ? 14 : 10,
        paddingTop: subscriber ? 14 : 10,
        borderTop: '1px solid rgba(148,163,184,0.10)',
      }}
    >
      {subscriber && (
        // Legend once — sides named a single time, not six.
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          gap: 10, marginBottom: 10,
        }}>
          <span style={{
            fontSize: 10.5, fontWeight: 500, color: C.textFaint, letterSpacing: '0.01em',
          }}>
            Qualified money
          </span>
          <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.01em' }}>
            <span style={{ color: SLATE }}>{oursLabel}</span>
            <span style={{ color: C.textFaint }}>{' · '}</span>
            <span style={{ color: C.textFaint }}>{theirsLabel}</span>
          </span>
        </div>
      )}
      {subscriber
        ? [confirmedRow, fullRow, losersRow]
        : [fullRow, losersRow, confirmedRow]}
    </div>
  );
}
