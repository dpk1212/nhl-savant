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

export function resolveSparkPath({ pinPath, entry, flagged, now, maxNow } = {}) {
  const dense = downsample(normalizePath(pinPath));
  const uniqueOdds = new Set(dense.map((p) => p.odds));
  const maxMoved = dense.some((p, i) => (
    i > 0 && p.max != null && dense[i - 1].max != null && p.max !== dense[i - 1].max
  ));
  const hasMotion = uniqueOdds.size >= 2 || maxMoved;

  if (dense.length >= 2 && (hasMotion || dense.some((p) => p.t != null))) {
    return { points: dense, synthetic: !hasMotion && uniqueOdds.size < 2 };
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

function MetricStrip({ evPct, fair, entry, now, flagged, maxNow, movePp, compact, polyEntry = null }) {
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
  if (Number.isFinite(polyEntry)
      && (!Number.isFinite(entry) || Math.abs(polyEntry - entry) > 1)) {
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
  if (Number.isFinite(flagged) && Number.isFinite(entry) && flagged !== entry) {
    const hasPm = Number.isFinite(polyEntry)
      && (!Number.isFinite(entry) || Math.abs(polyEntry - entry) > 1);
    const insertAt = hasPm ? 3 : 2;
    cells.splice(insertAt, 0, {
      key: 'got',
      label: 'FLAGGED',
      value: fmtOdds(flagged),
      color: C.text,
    });
  }
  const maxLabel = fmtMax(maxNow);
  const fs = compact ? 13 : 15;
  const labFs = compact ? 8 : 9;

  return (
    <div style={{
      display: 'flex',
      borderRadius: compact ? 8 : 10,
      border: '1px solid rgba(148,163,184,0.14)',
      background: 'rgba(0,0,0,0.28)',
      overflow: 'hidden',
      marginBottom: compact ? 6 : 10,
    }}>
      {cells.map((c, i) => (
        <div
          key={c.key}
          style={{
            flex: 1,
            minWidth: 0,
            padding: compact ? '7px 6px' : '9px 8px',
            textAlign: 'center',
            borderLeft: i === 0 ? 'none' : '1px solid rgba(148,163,184,0.12)',
          }}
        >
          <div style={{
            fontFamily: MONO, fontSize: labFs, fontWeight: 700,
            letterSpacing: '0.1em', color: C.textFaint, marginBottom: 3,
          }}>
            {c.label}
          </div>
          <div style={{
            fontSize: fs, fontWeight: 800, letterSpacing: '-0.02em',
            color: c.color, fontFeatureSettings: "'tnum'",
          }}>
            {c.value}
          </div>
        </div>
      ))}
      {(maxLabel || Number.isFinite(movePp)) && (
        <div style={{
          flex: compact ? '0 0 56px' : '0 0 68px',
          padding: compact ? '7px 6px' : '9px 8px',
          textAlign: 'center',
          borderLeft: '1px solid rgba(148,163,184,0.12)',
        }}>
          <div style={{
            fontFamily: MONO, fontSize: labFs, fontWeight: 700,
            letterSpacing: '0.1em', color: C.textFaint, marginBottom: 3,
          }}>
            {maxLabel ? 'MAX' : 'MOVE'}
          </div>
          <div style={{
            fontSize: compact ? 11 : 12, fontWeight: 800,
            color: LIMIT_DIM, fontFeatureSettings: "'tnum'",
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
  gid = 'ols',
}) {
  if (!points || points.length < 2) return null;

  const w = compact ? 340 : 420;
  const h = compact ? 78 : 148;
  const padL = compact ? 30 : 38;
  const padR = compact ? 34 : 44;
  const padTop = compact ? 10 : 14;
  const padBot = compact ? 16 : 22;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;

  // Plot in decimal odds space so near-even ML (-103 vs fair +101) does not
  // cross zero on a negated-American axis (that produced a bogus "-1.5" tick).
  const toPlot = (am) => americanToDecimal(am);
  const oddsVals = points.map((p) => toPlot(p.odds)).filter((v) => v != null);
  const refs = [flagged, fair].map(toPlot).filter((v) => v != null);
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

  const maxes = points.map((p) => p.max).filter((m) => Number.isFinite(m) && m > 0);
  const hasMax = maxes.length > 0;
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
  if (Number.isFinite(flagged) && flagged !== 0) amSamples.push(flagged);
  if (Number.isFinite(fair) && fair !== 0) amSamples.push(fair);
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
  const lastOdds = oddsCoords[oddsCoords.length - 1];

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      {/* Grid from odds axis */}
      {oTicks.map((tk, i) => (
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
      ))}

      {/* Fair guide (odds scale) */}
      {Number.isFinite(fairY) && (
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

      {/* Max limit line — right axis, full height */}
      {maxD && (
        <>
          <path
            d={maxD}
            fill="none"
            stroke={LIMIT}
            strokeWidth={compact ? 1.6 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.95}
          />
          {maxCoords.map(([x, y], i) => {
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
        </>
      )}

      {/* Odds stepped line — left axis */}
      <path
        d={oddsD}
        fill="none"
        stroke={GOLD_HI}
        strokeWidth={compact ? 1.8 : 2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={oddsCoords[0][0]} cy={oddsCoords[0][1]} r={compact ? 2.2 : 2.8} fill={GOLD} />
      <circle
        cx={lastOdds[0]}
        cy={lastOdds[1]}
        r={compact ? 2.8 : 3.4}
        fill={GREEN}
        stroke="#0B0F18"
        strokeWidth={1.2}
      />

      {/* Left odds labels */}
      {oTicks.map((tk, i) => (
        <text
          key={`ol-${i}`}
          x={padL - 5}
          y={tk.y + 3}
          textAnchor="end"
          fill={C.textFaint}
          fontSize={compact ? 7.5 : 8}
          fontFamily={MONO}
          fontWeight={600}
        >
          {tk.label}
        </text>
      ))}

      {/* Right max labels */}
      {mTicks.map((tk, i) => (
        <text
          key={`ml-${i}`}
          x={padL + plotW + 5}
          y={tk.y + 3}
          textAnchor="start"
          fill={LIMIT_DIM}
          fontSize={compact ? 7.5 : 8}
          fontFamily={MONO}
          fontWeight={700}
        >
          {tk.label}
        </text>
      ))}

      {/* Time axis */}
      <text x={padL} y={h - 3} textAnchor="start" fill={C.textFaint} fontSize={compact ? 7.5 : 8} fontFamily={MONO} fontWeight={600}>
        {t0 || 'Open'}
      </text>
      {tMid && (
        <text x={padL + plotW / 2} y={h - 3} textAnchor="middle" fill={C.textFaint} fontSize={compact ? 7.5 : 8} fontFamily={MONO} fontWeight={600}>
          {tMid}
        </text>
      )}
      <text x={padL + plotW} y={h - 3} textAnchor="end" fill={C.textFaint} fontSize={compact ? 7.5 : 8} fontFamily={MONO} fontWeight={600}>
        {t1 || 'Now'}
      </text>

      {!compact && (
        <>
          <text x={padL + 2} y={padTop + 2} textAnchor="start" fill={GOLD} fontSize={8} fontFamily={MONO} fontWeight={700}>
            ODDS
          </text>
          {hasMax && (
            <text x={padL + plotW - 2} y={padTop + 2} textAnchor="end" fill={LIMIT_DIM} fontSize={8} fontFamily={MONO} fontWeight={700}>
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
  compact = false,
  gid = 'ols',
  showStory = true,
  showMetrics = true,
}) {
  const liveNow = Number.isFinite(now) ? now : fair;
  const { points, synthetic } = resolveSparkPath({
    pinPath,
    entry,
    flagged,
    now: liveNow,
    maxNow: maxNow ?? sma?.maxNow,
  });
  if (points.length < 2) return null;

  const story = buildMarketStory({
    sma,
    evPct,
    flagged,
    entry,
    now: liveNow,
    fair,
    maxNow: maxNow ?? sma?.maxNow,
    movePp,
  });
  const toneColor = story.tone === 'confirm' || story.tone === 'with' ? GREEN
    : story.tone === 'oppose' || story.tone === 'against' ? VS
      : story.tone === 'thin' ? GOLD
        : C.textSec;
  const hasMax = points.some((p) => Number.isFinite(p.max));

  return (
    <div style={{ fontFeatureSettings: "'tnum'" }} onClick={(e) => e.stopPropagation()}>
      {showMetrics && (
        <MetricStrip
          evPct={evPct}
          fair={fair}
          entry={entry}
          now={liveNow}
          flagged={flagged}
          maxNow={maxNow ?? sma?.maxNow}
          movePp={movePp}
          polyEntry={polyEntry}
          compact={compact}
        />
      )}

      {!compact && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 6, gap: 8,
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: C.textMuted,
          }}>
            SHARP BOOK LINE MOVEMENT
          </div>
          <div style={{ display: 'inline-flex', gap: 12, fontSize: 9, fontWeight: 650, color: C.textFaint }}>
            <span><span style={{ color: GOLD_HI }}>━</span> pinn odds</span>
            {hasMax && <span><span style={{ color: LIMIT }}>━</span> max</span>}
            {synthetic && <span>flat</span>}
          </div>
        </div>
      )}

      <div style={{
        borderRadius: compact ? 8 : 10,
        border: '1px solid rgba(148,163,184,0.12)',
        background: 'rgba(0,0,0,0.28)',
        padding: compact ? '4px 4px 0' : '8px 6px 2px',
      }}>
        <DualAxisChart
          points={points}
          flagged={flagged}
          fair={fair}
          compact={compact}
          gid={gid}
        />
      </div>

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
