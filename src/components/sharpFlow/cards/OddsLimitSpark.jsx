/**
 * Locked Picks market tape — Pinnacle odds + max limit over time.
 * Terminal-style: left odds axis, right $ max, bottom clock, clear markers.
 */
const C = {
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
  grid: 'rgba(148,163,184,0.10)',
};
const GREEN = '#2fd57e';
const VS = '#F07167';
const GOLD = '#D4AF37';
const GOLD_HI = '#E8D28A';
const LIMIT = '#5B8FB9';
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

/**
 * Short desk copy — what matters, why it matters. No filler.
 */
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

export function resolveSparkPath({ pinPath, entry, flagged, now, maxNow } = {}) {
  const dense = normalizePath(pinPath);
  const uniqueOdds = new Set(dense.map((p) => p.odds));
  const maxMoved = dense.some((p, i) => (
    i > 0 && p.max != null && dense[i - 1].max != null && p.max !== dense[i - 1].max
  ));
  const hasMotion = uniqueOdds.size >= 2 || maxMoved;

  if (dense.length >= 2 && (hasMotion || dense.every((p) => p.t != null))) {
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

function OddsLimitChart({
  points,
  flagged,
  entry,
  now,
  fair,
  compact = false,
  gid = 'ols',
}) {
  if (!points || points.length < 2) return null;

  const w = compact ? 320 : 400;
  const h = compact ? 56 : 112;
  const padL = compact ? 28 : 36;
  const padR = compact ? 28 : 40;
  const padTop = compact ? 8 : 16;
  const padBot = compact ? 16 : 22;
  const plotW = w - padL - padR;
  const plotH = h - padTop - padBot;
  const volH = compact ? 10 : 18;

  const oddsVals = points.map((p) => -p.odds);
  const refs = [flagged, entry, now, fair].filter((v) => Number.isFinite(v) && v !== 0);
  const allOdds = [...oddsVals, ...refs.map((o) => -o)];
  let oMax = Math.max(...allOdds);
  let oMin = Math.min(...allOdds);
  if (oMax === oMin) {
    oMax += 10;
    oMin -= 10;
  } else {
    const pad = Math.max(4, (oMax - oMin) * 0.15);
    oMax += pad;
    oMin -= pad;
  }
  const oSpan = oMax - oMin || 1;

  const maxes = points.map((p) => p.max).filter((m) => Number.isFinite(m) && m > 0);
  const hasMax = maxes.length > 0;
  const mHi = hasMax ? Math.max(...maxes, 1) * 1.05 : 1;

  const yOdds = (negOdds) => padTop + (1 - (negOdds - oMin) / oSpan) * (plotH - volH);
  const yMaxBar = (m) => {
    const avail = volH - 1;
    const hh = (Math.max(0, m) / mHi) * avail;
    return (h - padBot) - hh;
  };
  const xAt = (i) => padL + (i / (points.length - 1)) * plotW;

  const oddsCoords = points.map((p, i) => [xAt(i), yOdds(-p.odds)]);
  const oddsLine = oddsCoords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaBottom = h - padBot - volH;
  const oddsArea = `${oddsLine} L${oddsCoords[oddsCoords.length - 1][0]},${areaBottom} L${padL},${areaBottom} Z`;

  const last = oddsCoords[oddsCoords.length - 1];
  const start = oddsCoords[0];
  const fairY = Number.isFinite(fair) ? yOdds(-fair) : null;
  const flaggedY = Number.isFinite(flagged) ? yOdds(-flagged) : null;

  // Y-axis ticks (3)
  const yTicks = [oMin, (oMin + oMax) / 2, oMax].map((v) => ({
    y: yOdds(v),
    label: fmtOdds(-v),
  }));

  // X-axis time labels
  const t0 = fmtClock(points[0].t);
  const tMid = points.length >= 3 ? fmtClock(points[Math.floor(points.length / 2)].t) : null;
  const t1 = fmtClock(points[points.length - 1].t);
  const xLabels = [
    { x: padL, text: t0 || 'Open', anchor: 'start' },
    ...(tMid ? [{ x: padL + plotW / 2, text: tMid, anchor: 'middle' }] : []),
    { x: padL + plotW, text: t1 || 'Now', anchor: 'end' },
  ];

  const maxLabel = hasMax ? fmtMax(maxes[maxes.length - 1]) : null;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id={`${gid}-odds`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD_HI} stopOpacity="0.18" />
          <stop offset="100%" stopColor={GOLD_HI} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal grid */}
      {yTicks.map((tk, i) => (
        <line
          key={`g-${i}`}
          x1={padL}
          y1={tk.y}
          x2={padL + plotW}
          y2={tk.y}
          stroke={C.grid}
          strokeWidth={1}
        />
      ))}

      {/* Limit volume bars (bottom band) */}
      {hasMax && points.map((p, i) => {
        const max = p.max ?? maxes[0];
        if (!Number.isFinite(max)) return null;
        const x = xAt(i);
        const gap = plotW / (points.length - 1);
        const bw = Math.max(2, Math.min(10, gap * 0.55));
        const y = yMaxBar(max);
        const bh = (h - padBot) - y;
        return (
          <rect
            key={`v-${i}`}
            x={x - bw / 2}
            y={y}
            width={bw}
            height={Math.max(1, bh)}
            fill={LIMIT}
            opacity={0.45}
            rx={1}
          />
        );
      })}

      {/* Fair / flagged guides */}
      {Number.isFinite(fairY) && (
        <line
          x1={padL} y1={fairY} x2={padL + plotW} y2={fairY}
          stroke={GOLD} strokeWidth={1} strokeDasharray="4 3" opacity={0.85}
        />
      )}
      {Number.isFinite(flaggedY) && Number.isFinite(flagged)
        && (!Number.isFinite(fair) || Math.abs(flagged - fair) > 1) && (
        <line
          x1={padL} y1={flaggedY} x2={padL + plotW} y2={flaggedY}
          stroke="rgba(244,247,251,0.35)" strokeWidth={1} strokeDasharray="2 3"
        />
      )}

      {!compact && <path d={oddsArea} fill={`url(#${gid}-odds)`} />}
      <path
        d={oddsLine}
        fill="none"
        stroke={GOLD_HI}
        strokeWidth={compact ? 1.7 : 2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx={start[0]} cy={start[1]} r={compact ? 2.2 : 2.8} fill={GOLD} />
      <circle cx={last[0]} cy={last[1]} r={compact ? 2.6 : 3.2} fill={GREEN} stroke="#0B0F18" strokeWidth={1.2} />

      {/* Left odds axis */}
      {!compact && yTicks.map((tk, i) => (
        <text
          key={`yl-${i}`}
          x={padL - 4}
          y={tk.y + 3}
          textAnchor="end"
          fill={C.textFaint}
          fontSize={8}
          fontFamily={MONO}
          fontWeight={600}
        >
          {tk.label}
        </text>
      ))}

      {/* Right max axis */}
      {!compact && hasMax && (
        <>
          <text x={padL + plotW + 4} y={padTop + 8} textAnchor="start" fill={LIMIT} fontSize={8} fontFamily={MONO} fontWeight={700}>
            MAX
          </text>
          <text x={padL + plotW + 4} y={h - padBot - 2} textAnchor="start" fill={LIMIT} fontSize={8} fontFamily={MONO} fontWeight={700}>
            {maxLabel}
          </text>
        </>
      )}

      {/* Bottom time axis */}
      {xLabels.map((lb, i) => (
        <text
          key={`x-${i}`}
          x={lb.x}
          y={h - 3}
          textAnchor={lb.anchor}
          fill={C.textFaint}
          fontSize={compact ? 7.5 : 8}
          fontFamily={MONO}
          fontWeight={600}
        >
          {lb.text}
        </text>
      ))}

      {!compact && Number.isFinite(fair) && (
        <text
          x={padL + 2}
          y={Math.max(padTop + 9, fairY - 4)}
          textAnchor="start"
          fill={GOLD}
          fontSize={8}
          fontFamily={MONO}
          fontWeight={700}
        >
          FAIR {fmtOdds(fair)}
        </text>
      )}
    </svg>
  );
}

/**
 * Full market tape block for locked / tracked cards.
 */
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
  compact = false,
  gid = 'ols',
  showStory = true,
}) {
  const { points, synthetic } = resolveSparkPath({
    pinPath,
    entry,
    flagged,
    now: Number.isFinite(now) ? now : fair,
    maxNow: maxNow ?? sma?.maxNow,
  });
  if (points.length < 2) return null;

  const story = buildMarketStory({
    sma,
    evPct,
    flagged,
    entry,
    now: Number.isFinite(now) ? now : fair,
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
      {!compact && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 8, gap: 8,
        }}>
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: C.textMuted,
            }}>
              PINNACLE TAPE
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: C.textSec, marginTop: 3 }}>
              Gold = fair odds · bars = max bet{synthetic ? ' · flat until steam' : ''}
            </div>
          </div>
          <div style={{ display: 'inline-flex', gap: 10, fontSize: 9, fontWeight: 650, color: C.textFaint, flexShrink: 0 }}>
            <span><span style={{ color: GOLD_HI }}>━</span> odds</span>
            {hasMax && <span><span style={{ color: LIMIT }}>▮</span> max</span>}
          </div>
        </div>
      )}

      <div style={{
        borderRadius: compact ? 8 : 10,
        border: '1px solid rgba(148,163,184,0.12)',
        background: 'rgba(0,0,0,0.28)',
        padding: compact ? '6px 6px 2px' : '10px 8px 4px',
      }}>
        <OddsLimitChart
          points={points}
          flagged={flagged}
          entry={entry}
          now={Number.isFinite(now) ? now : fair}
          fair={fair}
          compact={compact}
          gid={gid}
        />
      </div>

      {!compact && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          marginTop: 10,
          padding: '0 2px',
        }}>
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: C.textFaint }}>FLAGGED</div>
            <div style={{ fontSize: 15, fontWeight: 750, color: C.text, marginTop: 2 }}>{fmtOdds(flagged)}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>your ticket</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: C.textFaint }}>ENTRY</div>
            <div style={{ fontSize: 15, fontWeight: 750, color: GOLD, marginTop: 2 }}>{fmtOdds(entry)}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>pinn open</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: C.textFaint }}>NOW</div>
            <div style={{ fontSize: 15, fontWeight: 750, color: GREEN, marginTop: 2 }}>{fmtOdds(now ?? fair)}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>
              {Number.isFinite(evPct) ? (
                <span style={{ color: evPct >= 0 ? GREEN : VS, fontWeight: 700 }}>
                  EV {evPct >= 0 ? '+' : ''}{evPct.toFixed(1)}%
                </span>
              ) : 'live pinn'}
            </div>
          </div>
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
          <div style={{
            fontSize: 12, fontWeight: 500, color: C.textSec, lineHeight: 1.45,
          }}>
            {story.body}
          </div>
        </div>
      )}
    </div>
  );
}
