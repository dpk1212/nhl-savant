/**
 * Collapsed Locked card — premium strength block.
 * One plain-English verdict (novice) + one quiet detail line (advanced).
 * No pill walls, no BOARD/MARKET labels.
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
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";

function fmtUsd(v) {
  if (v == null || !Number.isFinite(Number(v)) || Number(v) <= 0) return null;
  const n = Number(v);
  if (n >= 1000) {
    const k = n / 1000;
    return `$${k >= 10 ? Math.round(k) : (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1))}K`;
  }
  return `$${Math.round(n)}`;
}

function fmtOdds(o) {
  const n = Number(o);
  if (!Number.isFinite(n) || n === 0) return null;
  return n > 0 ? `+${n}` : `${n}`;
}

function leadSizeRatio(f) {
  const wallets = Array.isArray(f?.wallets) ? f.wallets : [];
  const lead = wallets.find((w) => w?.proven && Number.isFinite(w.sizeRatio) && w.sizeRatio > 0)
    || wallets.find((w) => Number.isFinite(w?.sizeRatio) && w.sizeRatio > 0);
  const sr = Number(lead?.sizeRatio);
  return Number.isFinite(sr) && sr > 0 ? sr : null;
}

function isBoosted(f) {
  const units = Number(f?.units) || 0;
  const base = Number(f?.pathBaseUnits);
  const preTape = Number(f?.unitsPreTape);
  const tape = String(f?.tapeAction || '').toLowerCase();
  return tape === 'boost'
    || (Number.isFinite(base) && units > 0 && units >= base * 1.2)
    || (Number.isFinite(preTape) && units > 0 && units > preTape + 0.05);
}

function buildVerdict(f) {
  const proven = Math.max(0, Number(f.confirmedOnSide) || 0);
  const sideUsd = Number(f.sharpUsd ?? f.sideInvested) || 0;
  const againstUsd = Number(f.against?.invested) || 0;
  const againstProven = Math.max(0, Number(f.against?.proven) || 0);
  const unopposed = againstUsd < 50 && againstProven === 0;
  const contested = againstProven >= 1 || againstUsd >= 500;
  const muted = String(f.tapeAction || '').toLowerCase() === 'mute' || !!(f.mutedBy);
  const units = Number(f.units) || 0;

  const steam = f.steam;
  const warnAgainst = !!(f.marketSignals?.warnAgainst || f.marketSignals?.steamedAgainst);
  const move = Number.isFinite(f.pinnMovePp) ? f.pinnMovePp : null;
  const clv = Number.isFinite(f.clvPct) ? f.clvPct : null;

  // Headline keyword + tone (one emotional beat)
  let tone = 'neutral';
  let headline = 'Locked';
  let tip = 'Locked ticket';

  if (muted && !(units > 0)) {
    tone = 'warn';
    headline = 'Muted';
    tip = 'System stood down — no ticket';
  } else if (contested) {
    tone = 'warn';
    headline = 'Contested';
    tip = 'Sharp money is also on the other side';
  } else if (unopposed) {
    tone = 'trust';
    headline = 'Unopposed';
    tip = 'No sharp money on the other side of this board';
  } else if (proven >= 1) {
    tone = 'system';
    headline = proven === 1 ? '1 proven' : `${proven} proven`;
    tip = 'Proven wallets on this side';
  }

  // Body — readable clause after the headline
  const bodyParts = [];
  if (muted && !(units > 0)) {
    bodyParts.push('system passed on this number');
  } else if (contested) {
    if (againstUsd > 0) bodyParts.push(`${fmtUsd(againstUsd)} sharp against`);
    else if (againstProven > 0) bodyParts.push(`${againstProven} proven against`);
    if (sideUsd > 0) bodyParts.push(`${fmtUsd(sideUsd)} with us`);
  } else if (unopposed) {
    if (sideUsd > 0) bodyParts.push(`${fmtUsd(sideUsd)} proven on this side`);
    else if (proven >= 1) bodyParts.push(`${proven} proven wallet${proven === 1 ? '' : 's'} on this side`);
    else bodyParts.push('clear side of the board');
  } else if (sideUsd > 0) {
    bodyParts.push(`${fmtUsd(sideUsd)} on this side`);
  }

  // Market confirmation clause (traditional)
  if (steam?.show && (steam.tagShort || steam.tag)) {
    const st = steam.tagShort || steam.tag;
    bodyParts.push(String(st).toLowerCase().includes('steam')
      ? `${st} after entry`
      : `steam ${st} after entry`);
  } else if (warnAgainst) {
    bodyParts.push('tape pressure against');
  } else if (Number.isFinite(move) && Math.abs(move) >= 0.25) {
    bodyParts.push(move > 0
      ? `fair +${move.toFixed(1)}pp toward us`
      : `fair ${move.toFixed(1)}pp against`);
  } else if (Number.isFinite(clv) && Math.abs(clv) >= 0.3) {
    bodyParts.push(clv > 0
      ? `beating the number · CLV +${clv.toFixed(1)}%`
      : `behind the number · CLV ${clv.toFixed(1)}%`);
  }

  const body = bodyParts.filter(Boolean).join(' · ');

  // Advanced quiet line — size story + liquidity + PIN reference
  const detail = [];
  const sr = leadSizeRatio(f);
  if (Number.isFinite(sr)) {
    detail.push(sr >= 1.5
      ? `Lead ${sr.toFixed(1)}× usual`
      : sr < 0.75
        ? `Lead ${sr.toFixed(1)}× usual`
        : `${sr.toFixed(1)}× usual size`);
  }
  if (isBoosted(f) && units > 0) {
    const from = Number.isFinite(f.unitsPreTape) && f.unitsPreTape > 0
      ? f.unitsPreTape
      : (Number.isFinite(f.pathBaseUnits) && f.pathBaseUnits > 0 ? f.pathBaseUnits : null);
    detail.push(from != null
      ? `Sized ${Number(from).toFixed(1)}→${units.toFixed(1)}u`
      : 'Sized up');
  }
  const pin = Number.isFinite(f.sharpEntryOdds) ? f.sharpEntryOdds
    : (Number.isFinite(f.fairLine) ? f.fairLine : null);
  const ticket = Number.isFinite(f.lockOdds) ? f.lockOdds
    : (Number.isFinite(f.gotOdds) ? f.gotOdds : null);
  if (Number.isFinite(pin) && Number.isFinite(ticket) && Math.abs(pin - ticket) > 1) {
    detail.push(`PIN ${fmtOdds(pin)}`);
  }
  const max = Number(f.pinnMax);
  if (Number.isFinite(max) && max >= 1000) {
    const k = max / 1000;
    detail.push(`Max $${k >= 10 ? Math.round(k) : (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1))}K`);
  }

  return {
    tone,
    headline,
    tip,
    body,
    detail: detail.slice(0, 3).join('  ·  '),
  };
}

const TONE = {
  trust: { bar: GREEN, word: GREEN },
  warn: { bar: VS, word: VS },
  system: { bar: GOLD, word: GOLD_HI },
  neutral: { bar: 'rgba(148,163,184,0.45)', word: C.textSec },
};

export default function LockedCollapsedStrength({ f }) {
  if (!f) return null;
  const v = buildVerdict(f);
  if (!v.headline && !v.body) return null;
  const t = TONE[v.tone] || TONE.neutral;

  return (
    <div
      style={{ marginTop: 14, marginBottom: 14 }}
      onClick={(e) => e.stopPropagation()}
      title={v.tip}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
        <div style={{
          width: 2, flexShrink: 0, borderRadius: 2,
          background: `linear-gradient(180deg, ${t.bar} 0%, ${t.bar}55 100%)`,
          opacity: 0.95,
        }} />
        <div style={{ minWidth: 0, flex: 1, paddingTop: 1 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, lineHeight: 1.45,
            letterSpacing: '-0.01em', color: C.textSec,
          }}>
            <span style={{ color: t.word, fontWeight: 750 }}>{v.headline}</span>
            {v.body ? (
              <span style={{ color: C.textMuted }}> — {v.body}</span>
            ) : null}
          </div>
          {v.detail ? (
            <div style={{
              marginTop: 6,
              fontFamily: MONO, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.02em', color: C.textFaint,
              fontFeatureSettings: "'tnum'",
              lineHeight: 1.35,
            }}>
              {v.detail}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
