/**
 * Collapsed Locked card — dual-rail strength strip.
 * System DNA (why we push) + traditional market proof (why a sharp cares).
 * Replaces the SIGNALS 2/5 chip checklist on the 80% surface.
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

const PILL_TONES = {
  system: {
    color: GOLD_HI,
    background: 'linear-gradient(180deg, rgba(232,210,138,0.14) 0%, rgba(212,175,55,0.06) 100%)',
    border: '1px solid rgba(212,175,55,0.34)',
  },
  trust: {
    color: GREEN,
    background: 'rgba(47,213,126,0.10)',
    border: '1px solid rgba(47,213,126,0.32)',
  },
  market: {
    color: C.textSec,
    background: 'rgba(148,163,184,0.07)',
    border: '1px solid rgba(148,163,184,0.20)',
  },
  confirm: {
    color: GREEN,
    background: 'rgba(47,213,126,0.10)',
    border: '1px solid rgba(47,213,126,0.28)',
  },
  warn: {
    color: VS,
    background: 'rgba(240,113,103,0.10)',
    border: '1px solid rgba(240,113,103,0.30)',
  },
  neutral: {
    color: C.textSec,
    background: 'rgba(148,163,184,0.06)',
    border: '1px solid rgba(148,163,184,0.16)',
  },
};

function Pill({ children, title, tone = 'neutral' }) {
  const toneStyle = PILL_TONES[tone] || PILL_TONES.neutral;
  return (
    <span
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 9,
        fontWeight: 750,
        letterSpacing: '0.03em',
        padding: '4px 8px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        fontFeatureSettings: "'tnum'",
        lineHeight: 1.15,
        ...toneStyle,
      }}
    >
      {children}
    </span>
  );
}

function buildSystemPills(f) {
  const pills = [];
  const proven = Math.max(0, Number(f.confirmedOnSide) || 0);
  const sideUsd = Number(f.sharpUsd ?? f.sideInvested) || 0;
  const againstUsd = Number(f.against?.invested) || 0;
  const againstProven = Math.max(0, Number(f.against?.proven) || 0);
  const unopposed = againstUsd < 50 && againstProven === 0;
  const contested = againstProven >= 1 || againstUsd >= 500;

  if (unopposed) {
    pills.push({
      key: 'board',
      tone: 'trust',
      title: 'No sharp money on the other side',
      label: sideUsd > 0 ? `Unopposed · ${fmtUsd(sideUsd)}` : 'Unopposed',
    });
  } else if (contested) {
    pills.push({
      key: 'board',
      tone: 'warn',
      title: 'Sharp money on the other side of this board',
      label: againstUsd > 0
        ? `Contested · ${fmtUsd(againstUsd)} other`
        : `Contested · ${againstProven} other`,
    });
  } else if (proven >= 1) {
    pills.push({
      key: 'board',
      tone: 'system',
      title: 'Proven wallets on this side',
      label: sideUsd > 0
        ? `${proven} proven · ${fmtUsd(sideUsd)}`
        : `${proven} proven`,
    });
  } else if (sideUsd > 0) {
    pills.push({
      key: 'board',
      tone: 'system',
      title: 'Sharp dollars on this side',
      label: fmtUsd(sideUsd),
    });
  }

  if (proven >= 1 && unopposed && !pills.some((p) => p.key === 'board' && String(p.label).includes('proven'))) {
    pills.push({
      key: 'proven',
      tone: 'system',
      title: 'Proven wallets on this side',
      label: `${proven} proven`,
    });
  }

  const lead = (Array.isArray(f.wallets) ? f.wallets : [])
    .find((w) => w?.proven && Number.isFinite(w.sizeRatio) && w.sizeRatio > 0)
    || (Array.isArray(f.wallets) ? f.wallets : [])
      .find((w) => Number.isFinite(w?.sizeRatio) && w.sizeRatio > 0);
  const sr = Number(lead?.sizeRatio);
  if (Number.isFinite(sr) && sr > 0) {
    const hot = sr >= 1.5;
    const lean = sr < 0.75;
    pills.push({
      key: 'size',
      tone: hot ? 'trust' : lean ? 'neutral' : 'system',
      title: hot
        ? 'Lead wallet sized up vs their usual'
        : lean
          ? 'Lead wallet below their usual size'
          : 'Lead wallet size vs usual',
      label: `${sr.toFixed(1)}× usual`,
    });
  }

  const units = Number(f.units) || 0;
  const base = Number(f.pathBaseUnits);
  const preTape = Number(f.unitsPreTape);
  const tape = String(f.tapeAction || '').toLowerCase();
  const boosted = tape === 'boost'
    || (Number.isFinite(base) && units > 0 && units >= base * 1.2)
    || (Number.isFinite(preTape) && units > 0 && units > preTape + 0.05);
  const muted = tape === 'mute' || !!(f.mutedBy);

  if (muted && !(units > 0)) {
    pills.push({
      key: 'tape',
      tone: 'warn',
      title: 'System muted this ticket',
      label: 'Muted',
    });
  } else if (boosted && units > 0) {
    const from = Number.isFinite(preTape) && preTape > 0
      ? preTape
      : (Number.isFinite(base) && base > 0 ? base : null);
    pills.push({
      key: 'tape',
      tone: 'trust',
      title: from != null
        ? `Sized up from ${from.toFixed(1)}u → ${units.toFixed(1)}u`
        : 'Tape sized this ticket up',
      label: from != null
        ? `Boost ${from.toFixed(1)}→${units.toFixed(1)}u`
        : 'Boost',
    });
  }

  // Cap system rail — keep scanable
  return pills.slice(0, 3);
}

function buildMarketPills(f) {
  const pills = [];
  const steam = f.steam;
  const warnAgainst = !!(f.marketSignals?.warnAgainst || f.marketSignals?.steamedAgainst);

  if (steam?.show && steam.tag) {
    pills.push({
      key: 'steam',
      tone: steam.tier === 'gold' ? 'system' : 'confirm',
      title: steam.tip || 'Pinnacle steam with entry',
      label: steam.tagShort ? `Steam ${steam.tagShort}` : (steam.tag || 'Steam'),
    });
  } else if (warnAgainst) {
    pills.push({
      key: 'steam',
      tone: 'warn',
      title: 'Tape pressure against this side',
      label: 'Steam vs',
    });
  }

  const pin = Number.isFinite(f.sharpEntryOdds) ? f.sharpEntryOdds
    : (Number.isFinite(f.fairLine) ? f.fairLine : null);
  const ticket = Number.isFinite(f.lockOdds) ? f.lockOdds
    : (Number.isFinite(f.gotOdds) ? f.gotOdds : null);
  if (Number.isFinite(pin) && Number.isFinite(ticket) && Math.abs(pin - ticket) > 1) {
    pills.push({
      key: 'pin',
      tone: 'market',
      title: `Ticket ${fmtOdds(ticket)} vs sharp open/PIN ${fmtOdds(pin)}`,
      label: `PIN ${fmtOdds(pin)}`,
    });
  } else if (Number.isFinite(pin)) {
    pills.push({
      key: 'pin',
      tone: 'market',
      title: 'Sharp book reference',
      label: `PIN ${fmtOdds(pin)}`,
    });
  }

  const move = Number.isFinite(f.pinnMovePp) ? f.pinnMovePp : null;
  const clv = Number.isFinite(f.clvPct) ? f.clvPct : null;
  if (Number.isFinite(move) && Math.abs(move) >= 0.25) {
    pills.push({
      key: 'move',
      tone: move > 0 ? 'confirm' : 'warn',
      title: move > 0
        ? `Fair moved ${move.toFixed(1)}pp toward this side`
        : `Fair moved ${Math.abs(move).toFixed(1)}pp against this side`,
      label: `${move > 0 ? '+' : ''}${move.toFixed(1)}pp`,
    });
  } else if (Number.isFinite(clv) && Math.abs(clv) >= 0.3) {
    pills.push({
      key: 'clv',
      tone: clv > 0 ? 'confirm' : 'warn',
      title: 'Ticket vs same-line NOW (running CLV)',
      label: `CLV ${clv > 0 ? '+' : ''}${clv.toFixed(1)}%`,
    });
  }

  const max = Number(f.pinnMax);
  if (Number.isFinite(max) && max >= 1000 && pills.length < 3) {
    const k = max / 1000;
    const label = `Max $${k >= 10 ? Math.round(k) : (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1))}K`;
    pills.push({
      key: 'max',
      tone: 'market',
      title: 'Pinnacle max stake — liquidity of the number',
      label,
    });
  }

  return pills.slice(0, 3);
}

export default function LockedCollapsedStrength({ f }) {
  if (!f) return null;
  const system = buildSystemPills(f);
  const market = buildMarketPills(f);
  if (!system.length && !market.length) return null;

  return (
    <div
      style={{ marginTop: 10, marginBottom: 10 }}
      onClick={(e) => e.stopPropagation()}
    >
      {system.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
          marginBottom: market.length ? 6 : 0,
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 7.5, fontWeight: 800,
            letterSpacing: '0.14em', color: GOLD,
            flexShrink: 0, opacity: 0.85,
          }}>
            BOARD
          </span>
          {system.map((p) => (
            <Pill key={p.key} title={p.title} tone={p.tone}>{p.label}</Pill>
          ))}
        </div>
      )}
      {market.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 7.5, fontWeight: 800,
            letterSpacing: '0.14em', color: C.textMuted,
            flexShrink: 0,
          }}>
            MARKET
          </span>
          {market.map((p) => (
            <Pill key={p.key} title={p.title} tone={p.tone}>{p.label}</Pill>
          ))}
        </div>
      )}
    </div>
  );
}
