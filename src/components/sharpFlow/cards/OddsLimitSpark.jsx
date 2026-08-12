/**
 * Dual-axis spark: Pinnacle odds over time + max-limit overlay.
 * Markers for FLAGGED / SHARP ENTRY / NOW — Sharp Action PRICE CHECK energy.
 */
const C = {
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
};
const GREEN = '#2fd57e';
const VS = '#F07167';
const GOLD = '#D4AF37';
const GOLD_HI = '#E8D28A';
const LIMIT = '#7DD3FC';
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

/** Build readable steam / EV / limit story for locked picks. */
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
  const label = sma?.label || null;
  const showEv = Number.isFinite(evPct);
  const fairRef = Number.isFinite(fair) ? fair : (Number.isFinite(now) ? now : null);

  let headline = label || 'MARKET WATCH';
  const bits = [];

  if (limitTested && maxLabel) {
    bits.push(`Pinnacle will take ${maxLabel} — limit-tested, real liquidity`);
  } else if (thin && maxLabel) {
    bits.push(`Thin book (${maxLabel}) — treat the fair with caution`);
  } else if (maxLabel) {
    bits.push(`Pinnacle max ${maxLabel}`);
  }

  if (Number.isFinite(movePp) && Math.abs(movePp) >= 0.25) {
    bits.push(movePp > 0
      ? `Fair steamed ${movePp.toFixed(1)}pp toward this side`
      : `Fair steamed ${Math.abs(movePp).toFixed(1)}pp against this side`);
  } else if (Number.isFinite(entry) && Number.isFinite(now) && entry !== now) {
    bits.push(`Open ${fmtOdds(entry)} → now ${fmtOdds(now)}`);
  } else {
    bits.push('Fair hasn’t steamed yet — watching the limit and price');
  }

  if (showEv && Number.isFinite(flagged) && Number.isFinite(fairRef)) {
    bits.push(evPct >= 0
      ? `Flagged ${fmtOdds(flagged)} beats fair ${fmtOdds(fairRef)} · EV +${evPct.toFixed(1)}%`
      : `Flagged ${fmtOdds(flagged)} vs fair ${fmtOdds(fairRef)} · EV ${evPct.toFixed(1)}% — price not in your favor yet`);
  }

  if (tone === 'confirm') {
    headline = label || 'SHARPS + PINN';
  } else if (tone === 'oppose') {
    headline = label || 'PINN OPPOSES';
  } else if (tone === 'with' && limitTested) {
    headline = label || 'LIMIT-TESTED';
  }

  return {
    headline,
    body: bits.join('. ') + '.',
    tone,
  };
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

/**
 * Prefer dense pinPath; if flat/short, synthesize ENTRY → FLAGGED → NOW
 * so the three decision prices still plot.
 */
export function resolveSparkPath({ pinPath, entry, flagged, now, maxNow } = {}) {
  const dense = normalizePath(pinPath);
  const uniqueOdds = new Set(dense.map((p) => p.odds));
  const hasMotion = uniqueOdds.size >= 2 || dense.some((p, i) => i > 0 && p.max != null && dense[i - 1].max != null && p.max !== dense[i - 1].max);

  if (dense.length >= 2 && hasMotion) return { points: dense, synthetic: false };

  const pts = [];
  const m = Number.isFinite(maxNow) ? maxNow : (dense.find((p) => p.max)?.max ?? null);
  if (Number.isFinite(entry)) pts.push({ odds: entry, max: m, mark: 'entry' });
  if (Number.isFinite(flagged) && flagged !== entry) pts.push({ odds: flagged, max: m, mark: 'flagged' });
  if (Number.isFinite(now) && now !== flagged && now !== entry) pts.push({ odds: now, max: m, mark: 'now' });
  if (pts.length < 2 && dense.length >= 2) return { points: dense, synthetic: false };
  if (pts.length < 2 && dense.length === 1) {
    const d = dense[0];
    pts.length = 0;
    pts.push({ ...d, mark: 'entry' }, { ...d, mark: 'now' });
  }
  if (pts.length < 2) {
    // Last resort: single odds duplicated so chart still mounts with markers
    const o = flagged ?? now ?? entry;
    if (!Number.isFinite(o)) return { points: [], synthetic: false };
    return {
      points: [
        { odds: o, max: m, mark: 'flagged' },
        { odds: o, max: m, mark: 'now' },
      ],
      synthetic: true,
    };
  }
  return { points: pts, synthetic: true };
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

  const w = compact ? 280 : 360;
  const h = compact ? 44 : 78;
  const padX = compact ? 6 : 12;
  const padTop = compact ? 6 : 14;
  const padBot = compact ? 12 : 18;
  const plotW = w - padX * 2;
  const plotH = h - padTop - padBot;

  // Better American price for the bettor = higher on chart (negate)
  const oddsVals = points.map((p) => -p.odds);
  const markerOdds = [flagged, entry, now, fair].filter((v) => Number.isFinite(v) && v !== 0);
  const allOdds = [...oddsVals, ...markerOdds.map((o) => -o)];
  let oMax = Math.max(...allOdds);
  let oMin = Math.min(...allOdds);
  if (oMax === oMin) {
    oMax += 8;
    oMin -= 8;
  } else {
    const pad = (oMax - oMin) * 0.12 || 4;
    oMax += pad;
    oMin -= pad;
  }
  const oSpan = oMax - oMin || 1;
  const yOdds = (v) => padTop + (1 - (v - oMin) / oSpan) * plotH;
  const xAt = (i) => padX + (i / (points.length - 1)) * plotW;

  const maxes = points.map((p) => p.max).filter((m) => Number.isFinite(m) && m > 0);
  const hasMax = maxes.length > 0;
  const mMax = hasMax ? Math.max(...maxes) * 1.08 : 1;
  const yMax = (m) => padTop + (1 - Math.max(0, m) / mMax) * plotH;

  const oddsCoords = points.map((p, i) => [xAt(i), yOdds(-p.odds)]);
  const oddsLine = oddsCoords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const oddsArea = `${oddsLine} L${oddsCoords[oddsCoords.length - 1][0]},${h - padBot} L${padX},${h - padBot} Z`;

  // Limit as step-area underlay
  let limitPath = null;
  if (hasMax) {
    const cmds = [];
    points.forEach((p, i) => {
      const x = xAt(i);
      const y = yMax(p.max ?? maxes[0]);
      const base = h - padBot;
      if (i === 0) {
        cmds.push(`M${x.toFixed(1)},${base} L${x.toFixed(1)},${y.toFixed(1)}`);
      } else {
        const prevX = xAt(i - 1);
        cmds.push(`L${prevX.toFixed(1)},${y.toFixed(1)} L${x.toFixed(1)},${y.toFixed(1)}`);
      }
      if (i === points.length - 1) cmds.push(`L${x.toFixed(1)},${base} Z`);
    });
    limitPath = cmds.join(' ');
  }

  const last = oddsCoords[oddsCoords.length - 1];
  const start = oddsCoords[0];
  const color = GREEN;
  const fairY = Number.isFinite(fair) ? yOdds(-fair) : null;
  const flaggedY = Number.isFinite(flagged) ? yOdds(-flagged) : null;
  const entryY = Number.isFinite(entry) ? yOdds(-entry) : null;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id={`${gid}-odds`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${gid}-max`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={LIMIT} stopOpacity="0.28" />
          <stop offset="100%" stopColor={LIMIT} stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {limitPath && (
        <path d={limitPath} fill={`url(#${gid}-max)`} stroke={LIMIT} strokeWidth={1} opacity={0.85} />
      )}

      {Number.isFinite(fairY) && (
        <line
          x1={padX} y1={fairY} x2={w - padX} y2={fairY}
          stroke={GOLD} strokeWidth={1} strokeDasharray="4 3" opacity={0.75}
        />
      )}
      {Number.isFinite(flaggedY) && Math.abs((flagged ?? 0) - (fair ?? 9999)) > 0.5 && (
        <line
          x1={padX} y1={flaggedY} x2={w - padX} y2={flaggedY}
          stroke={C.textSec} strokeWidth={0.9} strokeDasharray="2 3" opacity={0.45}
        />
      )}

      {!compact && <path d={oddsArea} fill={`url(#${gid}-odds)`} />}
      <path
        d={oddsLine}
        fill="none"
        stroke={GOLD_HI}
        strokeWidth={compact ? 1.6 : 2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx={start[0]} cy={start[1]} r={compact ? 2.2 : 3} fill={GOLD} />
      <circle cx={last[0]} cy={last[1]} r={compact ? 2.6 : 3.4} fill={color} stroke="#0B0F18" strokeWidth={1} />

      {/* Entry marker when distinct */}
      {Number.isFinite(entryY) && Number.isFinite(entry) && (
        <circle cx={padX + plotW * 0.08} cy={entryY} r={2} fill={GOLD} opacity={0.9} />
      )}

      <text x={padX} y={h - 2} textAnchor="start" fill={C.textFaint} fontSize={compact ? 8 : 9} fontFamily={MONO} fontWeight={600}>
        {fmtOdds(points[0].odds)}
      </text>
      <text x={w - padX} y={h - 2} textAnchor="end" fill={GOLD_HI} fontSize={compact ? 8 : 9} fontFamily={MONO} fontWeight={700}>
        {fmtOdds(points[points.length - 1].odds)}
      </text>
      {!compact && hasMax && (
        <text x={w - padX} y={padTop + 2} textAnchor="end" fill={LIMIT} fontSize={8} fontFamily={MONO} fontWeight={700}>
          MAX {fmtMax(maxes[maxes.length - 1])}
        </text>
      )}
      {!compact && Number.isFinite(fair) && (
        <text x={padX} y={Math.max(10, fairY - 4)} textAnchor="start" fill={GOLD} fontSize={8} fontFamily={MONO} fontWeight={700}>
          FAIR {fmtOdds(fair)}
        </text>
      )}
    </svg>
  );
}

/**
 * Full PRICE PATH block: chart + legend + story.
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
    <div
      style={{ fontFeatureSettings: "'tnum'" }}
      onClick={(e) => e.stopPropagation()}
    >
      {!compact && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 6, gap: 8,
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: C.textMuted,
          }}>
            ODDS × LIMIT{synthetic ? ' · KEY PRICES' : ''}
          </span>
          <span style={{ display: 'inline-flex', gap: 10, fontSize: 9, fontWeight: 600, color: C.textFaint }}>
            <span><span style={{ color: GOLD_HI }}>━</span> fair odds</span>
            {hasMax && <span><span style={{ color: LIMIT }}>▮</span> pinn max</span>}
          </span>
        </div>
      )}

      <OddsLimitChart
        points={points}
        flagged={flagged}
        entry={entry}
        now={Number.isFinite(now) ? now : fair}
        fair={fair}
        compact={compact}
        gid={gid}
      />

      {!compact && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '4px 12px',
          marginTop: 8, fontSize: 10, fontWeight: 650, color: C.textSec,
        }}>
          {Number.isFinite(flagged) && (
            <span>Flagged <span style={{ color: C.text }}>{fmtOdds(flagged)}</span></span>
          )}
          {Number.isFinite(entry) && (
            <span>Entry <span style={{ color: GOLD }}>{fmtOdds(entry)}</span></span>
          )}
          {Number.isFinite(now || fair) && (
            <span>Now <span style={{ color: GREEN }}>{fmtOdds(now ?? fair)}</span></span>
          )}
          {Number.isFinite(evPct) && Math.abs(evPct) >= 0.1 && (
            <span style={{ marginLeft: 'auto', color: evPct >= 0 ? GREEN : VS }}>
              EV {evPct >= 0 ? '+' : ''}{evPct.toFixed(1)}%
            </span>
          )}
        </div>
      )}

      {!compact && story.body && (
        <div style={{
          marginTop: 10,
          padding: '10px 11px',
          borderRadius: 9,
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(148,163,184,0.12)',
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
            color: toneColor, marginBottom: 4,
          }}>
            {story.headline}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 500, color: C.textSec, lineHeight: 1.45,
          }}>
            {story.body}
          </div>
        </div>
      )}
    </div>
  );
}
