/**
 * Dual-axis Pinnacle tape — odds (left) + max limit line (right).
 * Industry pattern: shared plot, stepped odds, limit as a full series with nodes.
 */
const C = {
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
  grid: 'rgba(148,163,184,0.11)',
};
const GREEN = '#2fd57e';
const VS = '#F07167';
const GOLD = '#D4AF37';
const GOLD_HI = '#E8D28A';
const LIMIT = '#E8EEF7'; // bright series on dark — reads as “max line”
const LIMIT_DIM = '#8BA4C8';
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";

export function fmtOdds(o) {
  const n = Number(o);
  if (o == null || Number.isNaN(n) || n === 0) return '—';
  return n > 0 ? `+${n}` : `${n}`;
}

function fmtMax(n) {
  if (n == null || !Number.isFinite(Number(n)) || Number(n) <= 0) return null;
  const v = Number(n);
  if (v >= 1000) {
    const k = v / 1000;
    return `$${k >= 10 ? Math.round(k) : (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1))}K`;
  }
  return `$${Math.round(v)}`;
}

function toMs(t) {
  if (!Number.isFinite(t)) return null;
  return t > 1e12 ? t : t * 1000;
}

function fmtClock(t) {
  const ms = toMs(t);
  if (ms == null) return null;
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(ms));
  } catch {
    return null;
  }
}

/** Desk copy — short, specific. */
export function buildMarketStory({
  sma = null,
  evPct = null,
  flagged = null,
  entry = null,
  now = null,
  fair = null,
  maxNow = null,
  movePp = null,
} = {}) {
  const limitTested = !!(sma?.limitTested || (Number.isFinite(maxNow) && maxNow >= 3000));
  const thin = !!(sma?.thin || (Number.isFinite(maxNow) && maxNow > 0 && maxNow < 1000));
  const maxLabel = fmtMax(maxNow ?? sma?.maxNow);
  const tone = sma?.tone || 'neutral';
  const fairRef = Number.isFinite(fair) ? fair : (Number.isFinite(now) ? now : null);
  const steamed = Number.isFinite(movePp) && Math.abs(movePp) >= 0.25;
  const priceMoved = Number.isFinite(entry) && Number.isFinite(now) && entry !== now;

  let headline = 'WATCHING';
  if (tone === 'confirm') headline = 'CONFIRMED';
  else if (tone === 'oppose') headline = 'OPPOSED';
  else if (tone === 'against') headline = 'LEANING AGAINST';
  else if (tone === 'with' || limitTested) headline = limitTested ? 'LIQUID' : 'WITH MARKET';
  else if (tone === 'thin') headline = 'THIN';

  const parts = [];
  if (limitTested && maxLabel) {
    parts.push(`Pinnacle’s max is ${maxLabel} — enough size that this fair is real.`);
  } else if (thin && maxLabel) {
    parts.push(`Max only ${maxLabel}. Thin book — don’t overweight the fair.`);
  } else if (maxLabel) {
    parts.push(`Pinnacle max ${maxLabel}.`);
  }

  if (steamed) {
    parts.push(movePp > 0
      ? `Fair moved ${movePp.toFixed(1)}pp toward this side.`
      : `Fair moved ${Math.abs(movePp).toFixed(1)}pp against this side.`);
  } else if (priceMoved) {
    parts.push(`Open ${fmtOdds(entry)} → now ${fmtOdds(now)}.`);
  } else {
    parts.push('No steam yet on this number.');
  }

  if (Number.isFinite(evPct) && Number.isFinite(flagged) && Number.isFinite(fairRef)) {
    if (evPct >= 0.3) {
      parts.push(`Ticket ${fmtOdds(flagged)} clears fair ${fmtOdds(fairRef)} (+${evPct.toFixed(1)}% EV).`);
    } else if (evPct <= -0.3) {
      parts.push(`Ticket ${fmtOdds(flagged)} is short of fair ${fmtOdds(fairRef)} (${evPct.toFixed(1)}% EV).`);
    } else {
      parts.push(`Ticket and fair are close (${fmtOdds(flagged)} vs ${fmtOdds(fairRef)}).`);
    }
  }

  return { headline, body: parts.join(' '), tone };
}

function normalizePath(path) {
  if (!Array.isArray(path) || !path.length) return [];
  let lastMax = null;
  return path
    .map((p) => {
      const odds = Number(p?.odds);
      if (!Number.isFinite(odds) || odds === 0) return null;
      const rawMax = Number(p?.max);
      const max = Number.isFinite(rawMax) && rawMax > 0 ? rawMax : lastMax;
      if (Number.isFinite(max)) lastMax = max;
      return {
        t: Number.isFinite(p?.t) ? p.t : null,
        odds,
        max: Number.isFinite(max) ? max : null,
      };
    })
    .filter(Boolean);
}

/** Keep chart readable — prefer endpoints + change points. */
function downsample(points, maxPts = 28) {
  if (points.length <= maxPts) return points;
  const out = [points[0]];
  const step = (points.length - 1) / (maxPts - 1);
  for (let i = 1; i < maxPts - 1; i++) {
    out.push(points[Math.round(i * step)]);
  }
  out.push(points[points.length - 1]);
  return out;
}

/** PIN/NOW boxes follow the chart series, not a second odds source. */
export function sparkStripOdds({ pinPath, entry, now, fair, maxNow } = {}) {
  const liveNow = Number.isFinite(now) ? now : fair;
  const { points } = resolveSparkPath({
    pinPath,
    entry,
    flagged: null,
    now: liveNow,
    maxNow,
  });
  return {
    entry: Number.isFinite(points[0]?.odds) ? points[0].odds : (Number.isFinite(entry) ? entry : null),
    now: Number.isFinite(points[points.length - 1]?.odds)
      ? points[points.length - 1].odds
      : (Number.isFinite(liveNow) ? liveNow : null),
  };
}

export function resolveSparkPath({ pinPath, entry, flagged, now, maxNow } = {}) {
  const dense = downsample(normalizePath(pinPath));
  const uniqueOdds = new Set(dense.map((p) => p.odds));
  const maxMoved = dense.some((p, i) => (
    i > 0 && p.max != null && dense[i - 1].max != null && p.max !== dense[i - 1].max
  ));
  const hasMotion = uniqueOdds.size >= 2 || maxMoved;

  if (dense.length >= 2 && (hasMotion || dense.some((p) => p.t != null))) {
    // History carried no limit prints but Pinnacle posts one now — draw it as
    // a held level so the limit line never vanishes from the tape.
    const anyMax = dense.some((p) => Number.isFinite(p.max) && p.max > 0);
    const filled = !anyMax && Number.isFinite(maxNow) && maxNow > 0
      ? dense.map((p) => ({ ...p, max: maxNow }))
      : dense;
    return { points: filled, synthetic: !hasMotion && uniqueOdds.size < 2 };
  }

  const m = Number.isFinite(maxNow) ? maxNow : (dense.find((p) => p.max)?.max ?? null);
  const pts = [];
  if (Number.isFinite(entry)) pts.push({ odds: entry, max: m, mark: 'entry', t: null });
  if (Number.isFinite(flagged) && flagged !== entry) {
    pts.push({ odds: flagged, max: m, mark: 'flagged', t: null });
  }
  const live = Number.isFinite(now) ? now : null;
  if (live != null && live !== flagged && live !== entry) {
    pts.push({ odds: live, max: m, mark: 'now', t: null });
  }
  if (pts.length >= 2) return { points: pts, synthetic: true };
  if (dense.length >= 2) return { points: dense, synthetic: false };

  const o = flagged ?? now ?? entry;
  if (!Number.isFinite(o)) return { points: [], synthetic: false };
  return {
    points: [
      { odds: o, max: m, mark: 'open', t: null },
      { odds: o, max: m, mark: 'now', t: null },
    ],
    synthetic: true,
  };
}

/** Stepped polyline (holds price until next print). */
function stepPath(coords) {
  if (!coords.length) return '';
  let d = `M${coords[0][0].toFixed(1)},${coords[0][1].toFixed(1)}`;
  for (let i = 1; i < coords.length; i++) {
    const [x, y] = coords[i];
    const [, py] = coords[i - 1];
    d += ` L${x.toFixed(1)},${py.toFixed(1)} L${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

function MetricStrip({
  evPct, fair, entry, now, flagged, maxNow, movePp, compact,
  polyEntry = null,
  ticketOffMain = false,
  clvPct = null,
  curated = false,
  premium = false,
  bestNow = null,
}) {
  // Collapsed Locked card price desk — what sharps need:
  // TICKET · BEST · EV · FAIR · PIN · NOW (drop empties; cap at 5–6).
  if (curated && compact) {
    const cells = [];
    const liveNow = Number.isFinite(now) ? now : fair;
    const best = Number.isFinite(bestNow) ? bestNow : null;

    if (Number.isFinite(flagged)) {
      cells.push({
        key: 'got',
        label: 'TICKET',
        value: fmtOdds(flagged),
        color: C.text,
      });
    }
    if (Number.isFinite(best)
        && (!Number.isFinite(flagged) || Math.abs(best - flagged) > 1)
        && (!Number.isFinite(liveNow) || Math.abs(best - liveNow) > 1)) {
      cells.push({
        key: 'best',
        label: 'BEST',
        value: fmtOdds(best),
        color: GOLD_HI,
      });
    }
    if (Number.isFinite(evPct)) {
      cells.push({
        key: 'ev',
        label: 'EV',
        value: `${evPct >= 0 ? '+' : ''}${evPct.toFixed(1)}%`,
        color: evPct >= 0.3 ? GREEN : evPct <= -0.3 ? VS : C.textSec,
      });
    }
    if (Number.isFinite(fair)
        && (!Number.isFinite(entry) || Math.abs(fair - entry) > 1)) {
      cells.push({
        key: 'fair',
        label: 'FAIR',
        value: fmtOdds(fair),
        color: C.textSec,
      });
    }
    // Premium: never print the same price twice (PIN +125 next to NOW +125
    // was the tell of a machine-made card). NOW wins; PIN shows only when it
    // actually differs.
    if (Number.isFinite(entry)
        && !(premium && Number.isFinite(liveNow) && Math.abs(entry - liveNow) <= 1)) {
      cells.push({
        key: 'pin',
        label: 'PIN',
        value: fmtOdds(entry),
        color: C.text,
      });
    }
    cells.push({
      key: 'now',
      label: 'NOW',
      value: fmtOdds(liveNow),
      // Green is for good news only — a neutral market quote painted green
      // was decoration lying about meaning. Premium keeps it white.
      color: premium ? C.text : GREEN,
    });
    // Prefer MOVE as last cell when we don't already have 6.
    if (cells.length < 6 && Number.isFinite(movePp) && Math.abs(movePp) >= 0.25) {
      cells.push({
        key: 'move',
        label: 'MOVE',
        value: `${movePp > 0 ? '+' : ''}${movePp.toFixed(1)}pp`,
        color: movePp >= 0.25 ? GREEN : movePp <= -0.25 ? VS : C.textSec,
      });
    }

    const shown = cells.slice(0, 6);
    if (premium) {
      // Open stats — label over value, no box, no cell borders. Sentence-case
      // labels: editorial, not shouting (Linear/Lightyear), with EV kept as
      // the initialism it is.
      const caseLabel = (s) => (s === 'EV' ? 'EV' : s.charAt(0) + s.slice(1).toLowerCase());
      return (
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
          padding: '2px 2px 0',
          marginBottom: 4,
        }}>
          {shown.map((c) => (
            <div key={c.key} style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 10.5, fontWeight: 500,
                letterSpacing: '0.01em', color: C.textMuted, marginBottom: 5,
              }}>
                {caseLabel(c.label)}
              </div>
              <div style={{
                fontSize: 15, fontWeight: 650, letterSpacing: '-0.025em',
                color: c.color, fontFeatureSettings: "'tnum'",
              }}>
                {c.value}
              </div>
            </div>
          ))}
        </div>
      );
    }
    const fs = 12;
    const labFs = 7.5;
    return (
      <div style={{
        display: 'flex',
        borderRadius: 10,
        border: '1px solid rgba(212,175,55,0.14)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(0,0,0,0.22) 100%)',
        overflow: 'hidden',
        marginBottom: 8,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}>
        {shown.map((c, i) => (
          <div
            key={c.key}
            style={{
              flex: 1,
              minWidth: 0,
              padding: '8px 5px 7px',
              textAlign: 'center',
              borderLeft: i === 0
                ? 'none'
                : '1px solid rgba(212,175,55,0.10)',
            }}
          >
            <div style={{
              fontFamily: MONO, fontSize: labFs, fontWeight: 700,
              letterSpacing: '0.12em',
              color: C.textFaint, marginBottom: 4,
            }}>
              {c.label}
            </div>
            <div style={{
              fontSize: fs, fontWeight: 800, letterSpacing: '-0.03em',
              color: c.color, fontFeatureSettings: "'tnum'",
            }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cells = [
    {
      key: 'ev',
      label: 'EV',
      value: Number.isFinite(evPct) ? `${evPct >= 0 ? '+' : ''}${evPct.toFixed(1)}%` : '—',
      color: Number.isFinite(evPct) ? (evPct >= 0 ? GREEN : VS) : C.textSec,
    },
    {
      key: 'fair',
      label: 'FAIR',
      value: fmtOdds(fair ?? now),
      color: GOLD_HI,
    },
  ];
  // PM = poly receipt. Skip when it duplicates TICKET (same juice) on off-main cards.
  if (Number.isFinite(polyEntry)
      && (!Number.isFinite(entry) || Math.abs(polyEntry - entry) > 1)
      && !(ticketOffMain && Number.isFinite(flagged) && Math.abs(polyEntry - flagged) <= 1)) {
    cells.push({
      key: 'pm',
      label: 'PM',
      value: fmtOdds(polyEntry),
      color: C.text,
    });
  }
  cells.push(
    {
      key: 'open',
      label: (Number.isFinite(polyEntry) && (!Number.isFinite(entry) || Math.abs(polyEntry - entry) > 1))
        ? 'PIN' : 'OPEN',
      value: fmtOdds(entry),
      color: C.text,
    },
    {
      key: 'now',
      label: 'NOW',
      value: fmtOdds(now ?? fair),
      color: GREEN,
    },
  );
  // Ticket receipt juice — only when it differs from main-tape OPEN/PIN.
  // Label TICKET (not FLAGGED) so it isn't read as "odds on the chart line".
  if (Number.isFinite(flagged) && Number.isFinite(entry) && flagged !== entry) {
    const hasPm = Number.isFinite(polyEntry)
      && (!Number.isFinite(entry) || Math.abs(polyEntry - entry) > 1);
    const insertAt = hasPm ? 3 : 2;
    cells.splice(insertAt, 0, {
      key: 'got',
      label: ticketOffMain ? 'TICKET' : 'FLAGGED',
      value: fmtOdds(flagged),
      color: C.text,
    });
  } else if (ticketOffMain && Number.isFinite(flagged)
      && (!Number.isFinite(entry) || flagged === entry)) {
    // Off-main ticket whose juice equals pin open — still surface as TICKET.
    const hasPm = Number.isFinite(polyEntry)
      && (!Number.isFinite(entry) || Math.abs(polyEntry - entry) > 1);
    const insertAt = hasPm ? 3 : 2;
    cells.splice(insertAt, 0, {
      key: 'got',
      label: 'TICKET',
      value: fmtOdds(flagged),
      color: C.text,
    });
  }
  const maxLabel = fmtMax(maxNow);
  const fs = compact ? 12 : 15;
  const labFs = compact ? 7.5 : 9;

  return (
    <div style={{
      display: 'flex',
      borderRadius: compact ? 10 : 10,
      border: compact
        ? '1px solid rgba(212,175,55,0.14)'
        : '1px solid rgba(148,163,184,0.14)',
      background: compact
        ? 'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(0,0,0,0.22) 100%)'
        : 'rgba(0,0,0,0.28)',
      overflow: 'hidden',
      marginBottom: compact ? 8 : 10,
      boxShadow: compact ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : undefined,
    }}>
      {cells.map((c, i) => (
        <div
          key={c.key}
          style={{
            flex: 1,
            minWidth: 0,
            padding: compact ? '8px 5px 7px' : '9px 8px',
            textAlign: 'center',
            borderLeft: i === 0
              ? 'none'
              : compact
                ? '1px solid rgba(212,175,55,0.10)'
                : '1px solid rgba(148,163,184,0.12)',
          }}
        >
          <div style={{
            fontFamily: MONO, fontSize: labFs, fontWeight: 700,
            letterSpacing: '0.12em', color: C.textFaint, marginBottom: compact ? 4 : 3,
          }}>
            {c.label}
          </div>
          <div style={{
            fontSize: fs, fontWeight: 800, letterSpacing: '-0.03em',
            color: c.color, fontFeatureSettings: "'tnum'",
          }}>
            {c.value}
          </div>
        </div>
      ))}
      {(maxLabel || Number.isFinite(movePp)) && (
        <div style={{
          flex: compact ? '0 0 54px' : '0 0 68px',
          padding: compact ? '8px 5px 7px' : '9px 8px',
          textAlign: 'center',
          borderLeft: compact
            ? '1px solid rgba(212,175,55,0.10)'
            : '1px solid rgba(148,163,184,0.12)',
        }}>
          <div style={{
            fontFamily: MONO, fontSize: labFs, fontWeight: 700,
            letterSpacing: '0.12em', color: C.textFaint, marginBottom: compact ? 4 : 3,
          }}>
            {maxLabel ? 'MAX' : 'MOVE'}
          </div>
          <div style={{
            fontSize: compact ? 11 : 12, fontWeight: 800,
            color: LIMIT_DIM, fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em',
          }}>
            {maxLabel || (Number.isFinite(movePp) ? `${movePp > 0 ? '+' : ''}${movePp.toFixed(1)}pp` : '—')}
          </div>
        </div>
      )}
    </div>
  );
}

function americanToDecimal(am) {
  const n = Number(am);
  if (!Number.isFinite(n) || n === 0) return null;
  return n > 0 ? 1 + n / 100 : 1 + 100 / Math.abs(n);
}

function DualAxisChart({
  points,
  flagged,
  fair,
  compact = false,
  premium = false,
  narrow = false,
  gid = 'ols',
}) {
  if (!points || points.length < 2) return null;

  // Plot in decimal odds space so near-even ML (-103 vs fair +101) does not
  // cross zero on a negated-American axis (that produced a bogus "-1.5" tick).
  const toPlot = (am) => americanToDecimal(am);
  const oddsVals = points.map((p) => toPlot(p.odds)).filter((v) => v != null);

  const maxesEarly = points.map((p) => p.max).filter((m) => Number.isFinite(m) && m > 0);
  const hasMax = maxesEarly.length > 0;

  // A tape that never moved is a fact, not a landscape. Premium renders it as
  // a short held-line strip — UNLESS Pinnacle limits exist: moving limits are
  // real information, so the full chart stays and draws them.
  const flatTape = premium
    && !hasMax
    && oddsVals.length > 1
    && (Math.max(...oddsVals) - Math.min(...oddsVals)) < 0.015;

  // Premium keeps a real axis gutter — two lines with no scale is a shape,
  // not a chart. Only the flat held-line strip drops the gutters.
  const w = narrow ? 232 : (compact ? 340 : 420);
  const h = premium ? (flatTape ? 34 : 96) : (compact ? 78 : 148);
  const padL = premium ? (flatTape ? 18 : 32) : (compact ? 30 : 38);
  const padR = premium
    ? (hasMax ? 40 : 18)
    : (compact ? 34 : 44);
  const padTop = premium ? 12 : (compact ? 10 : 14);
  const padBot = premium ? (flatTape ? 15 : 17) : (compact ? 16 : 22);
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;

  const refs = (premium ? [flatTape ? null : flagged] : [flagged, fair])
    .map(toPlot)
    .filter((v) => v != null);
  const allOdds = [...oddsVals, ...refs];
  let oMax = Math.max(...allOdds);
  let oMin = Math.min(...allOdds);
  if (!(oMax > oMin)) {
    oMax += 0.08;
    oMin = Math.max(1.01, oMin - 0.08);
  } else {
    const pad = Math.max(0.03, (oMax - oMin) * 0.12);
    oMax += pad;
    oMin = Math.max(1.01, oMin - pad);
  }
  const oSpan = oMax - oMin || 1;

  const maxes = maxesEarly;
  const mLo = 0;
  const mHi = hasMax ? Math.max(...maxes) * 1.12 : 1000;
  const mSpan = mHi - mLo || 1;

  const yOdds = (dec) => padTop + (1 - (dec - oMin) / oSpan) * plotH;
  const yMax = (m) => padTop + (1 - (Math.max(0, m) - mLo) / mSpan) * plotH;
  const xAt = (i) => padL + (i / (points.length - 1)) * plotW;

  const oddsCoords = points.map((p, i) => {
    const d = toPlot(p.odds);
    return [xAt(i), yOdds(d != null ? d : oMin)];
  });
  const maxCoords = hasMax
    ? points.map((p, i) => [xAt(i), yMax(p.max ?? maxes[0])])
    : [];

  const oddsD = stepPath(oddsCoords);
  const maxD = maxCoords.length
    ? maxCoords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
    : null;

  // Tick labels from real American odds in the series (not midpoint of mixed ±).
  const amSamples = points.map((p) => p.odds).filter((o) => Number.isFinite(o) && o !== 0);
  if (Number.isFinite(fair) && fair !== 0) amSamples.push(fair);
  if (Number.isFinite(flagged) && flagged !== 0) amSamples.push(flagged);
  const amHi = amSamples.length ? Math.max(...amSamples.map((a) => toPlot(a))) : oMax;
  const amLo = amSamples.length ? Math.min(...amSamples.map((a) => toPlot(a))) : oMin;
  const midDec = (amHi + amLo) / 2;
  const decToAm = (dec) => {
    if (!(dec > 1)) return null;
    return dec >= 2 ? Math.round((dec - 1) * 100) : Math.round(-100 / (dec - 1));
  };
  const oTicks = [
    { y: yOdds(oMax), label: fmtOdds(decToAm(oMax)) },
    { y: yOdds(midDec), label: fmtOdds(decToAm(midDec)) },
    { y: yOdds(oMin), label: fmtOdds(decToAm(oMin)) },
  ];
  const mTicks = hasMax
    ? [mHi, mHi * 0.5, mLo || mHi * 0.05].map((v) => ({
      y: yMax(v),
      label: fmtMax(v) || '$0',
    }))
    : [];

  const t0 = fmtClock(points[0].t);
  const tMid = points.length >= 3 ? fmtClock(points[Math.floor(points.length / 2)].t) : null;
  const t1 = fmtClock(points[points.length - 1].t);
  const fairDec = toPlot(fair);
  const fairY = fairDec != null ? yOdds(fairDec) : null;
  const flaggedDec = toPlot(flagged);
  const flaggedY = flaggedDec != null ? yOdds(flaggedDec) : null;
  const lastOdds = oddsCoords[oddsCoords.length - 1];

  // Premium (collapsed locked): no box, area wash under the line, one dotted
  // baseline, halo endpoint — the pattern every top dark-fintech chart uses
  // (Stake, Lightyear, Revolut). Guides whisper; a flat tape collapses to a
  // held-line strip with the one label that matters.
  const baselineY = padTop + plotH;
  const areaD = `${oddsD} L${oddsCoords[oddsCoords.length - 1][0].toFixed(1)},${baselineY} L${oddsCoords[0][0].toFixed(1)},${baselineY} Z`;
  // Axes: without a scale, two lines are indistinguishable shapes. Premium
  // keeps the left American-odds ticks and the right $ scale; only the flat
  // held-line strip (one number, in the ledger) goes bare.
  const shownOTicks = premium ? (flatTape ? [] : oTicks) : oTicks;
  // Premium right axis: top-of-scale tick + the live limit at its endpoint.
  // Skip the top tick when the endpoint sits on it (session high = now).
  const shownMTicks = premium
    ? (hasMax && maxCoords.length && !flatTape
      ? (() => {
        const endY = maxCoords[maxCoords.length - 1][1];
        const end = {
          y: endY,
          label: fmtMax(points[points.length - 1].max ?? maxesEarly[maxesEarly.length - 1]) || '',
        };
        const top = mTicks[0];
        return top && Math.abs(top.y - endY) > 10 ? [top, end] : [end];
      })()
      : [])
    : mTicks;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      {premium && (
        <defs>
          <linearGradient id={`${gid}-wash`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD_HI} stopOpacity="0.22" />
            <stop offset="55%" stopColor={GOLD_HI} stopOpacity="0.06" />
            <stop offset="100%" stopColor={GOLD_HI} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}

      {/* Grid: premium keeps a single dotted baseline (none on a flat strip —
          a second horizontal line under a flat line reads as a glitch) */}
      {premium ? (flatTape ? null : (
        <line
          x1={padL}
          y1={baselineY}
          x2={padL + plotW}
          y2={baselineY}
          stroke={C.grid}
          strokeWidth={1}
          strokeDasharray="1 4"
          strokeLinecap="round"
        />
      )) : (
        oTicks.map((tk, i) => (
          <line
            key={`g-${i}`}
            x1={padL}
            y1={tk.y}
            x2={padL + plotW}
            y2={tk.y}
            stroke={C.grid}
            strokeWidth={1}
            strokeDasharray={i === 1 ? '0' : '3 4'}
          />
        ))
      )}

      {/* Ticket guide — where we got on. Premium: one dotted reference (the
          Robinhood cost-basis pattern) with a lit entry marker and label,
          never on a flat tape. */}
      {Number.isFinite(flaggedY) && !(premium && flatTape) && (
        <>
          <line
            x1={padL}
            y1={flaggedY}
            x2={padL + plotW}
            y2={flaggedY}
            stroke={GOLD_HI}
            strokeWidth={1}
            strokeDasharray={premium ? '1 4' : '5 4'}
            strokeLinecap="round"
            opacity={premium ? 0.4 : 0.55}
          />
          {premium && (
            <>
              <circle cx={padL} cy={flaggedY} r={2.4} fill={GOLD_HI} opacity={0.95} />
              <text
                x={padL + 6}
                y={flaggedY - 4}
                textAnchor="start"
                fill={GOLD_HI}
                fontSize={6.5}
                fontWeight={700}
                letterSpacing="0.08em"
                opacity={0.85}
              >
                TICKET
              </text>
            </>
          )}
        </>
      )}

      {/* Fair guide (odds scale) — ops only; premium keeps FAIR in the cells */}
      {!premium && Number.isFinite(fairY) && !(Number.isFinite(flagged) && Number.isFinite(fair) && Math.abs(flagged - fair) <= 1) && (
        <line
          x1={padL}
          y1={fairY}
          x2={padL + plotW}
          y2={fairY}
          stroke={GOLD}
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.7}
        />
      )}

      {/* Area wash under the odds line — premium, only when the tape moved */}
      {premium && !flatTape && (
        <path d={areaD} fill={`url(#${gid}-wash)`} stroke="none" />
      )}

      {/* Max limit line — right axis, full height */}
      {maxD && (
        <>
          <path
            d={maxD}
            fill="none"
            stroke={LIMIT}
            strokeWidth={premium ? 1.3 : (compact ? 1.6 : 2)}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={premium ? 0.45 : 0.95}
          />
          {!premium && maxCoords.map(([x, y], i) => {
            // Node on change or ends
            const prev = i > 0 ? points[i - 1].max : null;
            const cur = points[i].max;
            const show = i === 0 || i === maxCoords.length - 1
              || (Number.isFinite(prev) && Number.isFinite(cur) && prev !== cur);
            if (!show && maxCoords.length > 12 && i % 3 !== 0) return null;
            return (
              <circle
                key={`m-${i}`}
                cx={x}
                cy={y}
                r={compact ? 2 : 2.6}
                fill={LIMIT}
                stroke="#0B0F18"
                strokeWidth={1}
              />
            );
          })}
          {premium && (
            <circle
              cx={maxCoords[maxCoords.length - 1][0]}
              cy={maxCoords[maxCoords.length - 1][1]}
              r={2}
              fill={LIMIT}
              opacity={0.7}
            />
          )}
        </>
      )}

      {/* Odds stepped line — left axis. Premium draws with conviction. */}
      <path
        d={oddsD}
        fill="none"
        stroke={GOLD_HI}
        strokeWidth={premium ? 2.4 : (compact ? 1.8 : 2.25)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {!premium && (
        <circle cx={oddsCoords[0][0]} cy={oddsCoords[0][1]} r={compact ? 2.2 : 2.8} fill={GOLD} />
      )}
      {premium && (
        <>
          {/* The one living element on the card: the endpoint breathes. */}
          <circle
            className="sf-tape-pulse"
            cx={lastOdds[0]}
            cy={lastOdds[1]}
            r={10}
            fill={GREEN}
          />
          <circle
            cx={lastOdds[0]}
            cy={lastOdds[1]}
            r={6}
            fill={GREEN}
            opacity={0.18}
          />
        </>
      )}
      <circle
        cx={lastOdds[0]}
        cy={lastOdds[1]}
        r={compact ? 2.8 : 3.4}
        fill={GREEN}
        stroke="#0B0F18"
        strokeWidth={1.2}
      />

      {/* Left odds labels */}
      {shownOTicks.map((tk, i) => (
        <text
          key={`ol-${i}`}
          x={padL - 5}
          y={tk.y + 3}
          textAnchor="end"
          fill={C.textFaint}
          fontSize={premium ? 7 : (compact ? 7.5 : 8)}
          fontFamily={MONO}
          fontWeight={600}
          opacity={premium ? 0.8 : 1}
        >
          {tk.label}
        </text>
      ))}

      {/* Right max labels */}
      {shownMTicks.map((tk, i) => (
        <text
          key={`ml-${i}`}
          x={padL + plotW + 5}
          y={tk.y + 3}
          textAnchor="start"
          fill={LIMIT_DIM}
          fontSize={premium ? 7 : (compact ? 7.5 : 8)}
          fontFamily={MONO}
          fontWeight={700}
          opacity={premium ? 0.8 : 1}
        >
          {tk.label}
        </text>
      ))}

      {/* Time axis */}
      <text x={padL} y={h - 3} textAnchor="start" fill={C.textFaint} fontSize={premium ? 7 : (compact ? 7.5 : 8)} fontFamily={MONO} fontWeight={600} opacity={premium ? 0.75 : 1}>
        {t0 || 'Open'}
      </text>
      {tMid && !premium && (
        <text x={padL + plotW / 2} y={h - 3} textAnchor="middle" fill={C.textFaint} fontSize={compact ? 7.5 : 8} fontFamily={MONO} fontWeight={600}>
          {tMid}
        </text>
      )}
      <text x={padL + plotW} y={h - 3} textAnchor="end" fill={C.textFaint} fontSize={premium ? 7 : (compact ? 7.5 : 8)} fontFamily={MONO} fontWeight={600} opacity={premium ? 0.75 : 1}>
        {t1 || 'Now'}
      </text>

      {/* Line identity — say which line is which, always (except the bare
          flat strip, which has only one line and one number). */}
      {(!compact || (premium && !flatTape)) && (
        <>
          {/* Dodge the TICKET marker: when the ticket guide hugs the top of
              scale, the ODDS identity label drops to the bottom-left. */}
          <text
            x={padL + 2}
            y={premium && flaggedY != null && flaggedY < padTop + 16 ? baselineY - 5 : padTop + 2}
            textAnchor="start"
            fill={GOLD}
            fontSize={premium ? 7 : 8}
            fontFamily={MONO}
            fontWeight={700}
            opacity={premium ? 0.9 : 1}
          >
            ODDS
          </text>
          {hasMax && (
            <text x={padL + plotW - 2} y={padTop + 2} textAnchor="end" fill={LIMIT_DIM} fontSize={premium ? 7 : 8} fontFamily={MONO} fontWeight={700} opacity={premium ? 0.9 : 1}>
              MAX $
            </text>
          )}
        </>
      )}
    </svg>
  );
}

export default function OddsLimitSpark({
  pinPath = null,
  flagged = null,
  entry = null,
  now = null,
  fair = null,
  evPct = null,
  sma = null,
  maxNow = null,
  movePp = null,
  polyEntry = null,
  clvPct = null,
  compact = false,
  gid = 'ols',
  showStory = true,
  showMetrics = true,
  curatedMetrics = false,
  premiumCompact = false,
  bleed = false,
  bestNow = null,
  chartLineLabel = null,
  /** When ticket is an alt, label TICKET (not FLAGGED) in the metric strip. */
  ticketOffMain = false,
  /** Brokerage order: tape directly under the hero, price cells below it. */
  chartFirst = false,
}) {
  const liveNow = Number.isFinite(now) ? now : fair;
  // Chart is book tape on this line. Ticket juice stays in the FLAGGED cell —
  // never inflate the axis with a Poly receipt (STL@CHC +270 vs −135 tape).
  // Collapsed: still paint ticket as a fair-style guide so the graph proves entry.
  const pathFlagged = compact && Number.isFinite(flagged) ? flagged : null;
  const { points, synthetic } = resolveSparkPath({
    pinPath,
    entry,
    flagged: null,
    now: liveNow,
    maxNow: maxNow ?? sma?.maxNow,
  });
  if (points.length < 2) return null;
  const strip = {
    entry: Number.isFinite(points[0]?.odds) ? points[0].odds : (Number.isFinite(entry) ? entry : null),
    now: Number.isFinite(points[points.length - 1]?.odds)
      ? points[points.length - 1].odds
      : (Number.isFinite(liveNow) ? liveNow : null),
  };

  const story = buildMarketStory({
    sma,
    evPct,
    flagged: pathFlagged,
    entry: strip.entry,
    now: strip.now,
    fair,
    maxNow: maxNow ?? sma?.maxNow,
    movePp,
  });
  const toneColor = story.tone === 'confirm' || story.tone === 'with' ? GREEN
    : story.tone === 'oppose' || story.tone === 'against' ? VS
      : story.tone === 'thin' ? GOLD
        : C.textSec;
  const hasMax = points.some((p) => Number.isFinite(p.max));

  // Compact caption — one proof line under the chart (not the full desk story).
  const compactCaption = (() => {
    if (!compact || !showStory) return null;
    if (Number.isFinite(movePp) && Math.abs(movePp) >= 0.25) {
      return movePp > 0
        ? `Fair moved ${movePp.toFixed(1)}pp toward this side`
        : `Fair moved ${Math.abs(movePp).toFixed(1)}pp against this side`;
    }
    if (Number.isFinite(clvPct) && Math.abs(clvPct) >= 0.3) {
      return clvPct > 0
        ? `Beating the number · CLV ${clvPct >= 0 ? '+' : ''}${clvPct.toFixed(1)}%`
        : `Behind the number · CLV ${clvPct.toFixed(1)}%`;
    }
    if (Number.isFinite(strip.entry) && Number.isFinite(strip.now) && strip.entry !== strip.now) {
      return `Open ${fmtOdds(strip.entry)} → now ${fmtOdds(strip.now)}`;
    }
    return null;
  })();

  const metricsNode = showMetrics && (
    <MetricStrip
      evPct={evPct}
      fair={fair}
      entry={strip.entry}
      now={strip.now}
      flagged={flagged}
      maxNow={maxNow ?? sma?.maxNow}
      movePp={movePp}
      polyEntry={polyEntry}
      clvPct={clvPct}
      compact={compact}
      curated={curatedMetrics}
      premium={premiumCompact}
      bestNow={bestNow}
      ticketOffMain={ticketOffMain}
    />
  );

  const chartNode = (
    <div style={premiumCompact
      // Premium: the tape floats on the card surface. No box — separation
      // comes from air and the baseline inside the SVG.
      ? { padding: 0 }
      : {
        borderRadius: compact ? 8 : 10,
        border: '1px solid rgba(148,163,184,0.12)',
        background: 'rgba(0,0,0,0.28)',
        padding: compact ? '4px 4px 0' : '8px 6px 2px',
      }}>
      <DualAxisChart
        points={points}
        flagged={pathFlagged}
        fair={fair}
        compact={compact}
        premium={premiumCompact}
        gid={gid}
      />
    </div>
  );

  // Premium: the tape leads (full-bleed), the price ledger reads underneath —
  // the brokerage order every elite position card uses. `bleed` restores the
  // card's side padding for the text row only.
  if (premiumCompact) {
    return (
      <div style={{ fontFeatureSettings: "'tnum'" }}>
        {chartNode}
        <div style={{ padding: bleed ? '13px 22px 0' : '13px 0 0' }}>
          {metricsNode}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFeatureSettings: "'tnum'" }} onClick={(e) => e.stopPropagation()}>
      {!chartFirst && metricsNode}

      {!compact && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 6, gap: 8,
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: C.textMuted,
          }}>
            {chartLineLabel
              ? `${String(chartLineLabel).toUpperCase()} TAPE`
              : 'SHARP BOOK LINE MOVEMENT'}
          </div>
          <div style={{ display: 'inline-flex', gap: 12, fontSize: 9, fontWeight: 650, color: C.textFaint }}>
            <span><span style={{ color: GOLD_HI }}>━</span> pinn odds</span>
            {hasMax && <span><span style={{ color: LIMIT }}>━</span> max</span>}
            {synthetic && <span>flat</span>}
          </div>
        </div>
      )}

      {chartNode}

      {chartFirst && (
        <div style={{ marginTop: 12 }}>
          {metricsNode}
        </div>
      )}

      {compact && compactCaption && (
        <div style={{
          marginTop: premiumCompact ? 9 : 7,
          fontSize: premiumCompact ? 11 : 10,
          fontWeight: 550,
          color: premiumCompact ? C.textMuted : toneColor,
          letterSpacing: '0.01em',
          lineHeight: 1.4,
        }}>
          {compactCaption}
        </div>
      )}

      {!compact && showStory && story.body && (
        <div style={{ marginTop: 12 }}>
          <div style={{
            fontFamily: MONO, fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
            color: toneColor, marginBottom: 4,
          }}>
            {story.headline}
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: C.textSec, lineHeight: 1.45 }}>
            {story.body}
          </div>
        </div>
      )}
    </div>
  );
}
