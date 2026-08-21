/**
 * Collapsed Locked — Zone A trust band.
 * Novice headline: sport-specific Source B sharp + sensational number + board context.
 * Contested always includes our $ vs their $ so big tickets still make sense.
 */
const C = {
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
};
const GREEN = '#2fd57e';
const VS = '#F07167';
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

function pickLeadWallet(f) {
  const pool = (Array.isArray(f?.wallets) && f.wallets.length
    ? f.wallets
    : (Array.isArray(f?.mapWallets) ? f.mapWallets.filter((w) => w.side === 'ours' || !w.side) : []))
    .filter((w) => w && (w.invested || 0) > 0);

  if (!pool.length) return null;
  const proven = pool.filter((w) => w.proven);
  const list = (proven.length ? proven : pool).slice();
  list.sort((a, b) => {
    const ts = (Number(b.trustScore) || 0) - (Number(a.trustScore) || 0);
    if (ts) return ts;
    return (b.invested || 0) - (a.invested || 0);
  });
  return list[0];
}

function boardContext(f) {
  // Prefer wide Full split (Vault + whales + exchange) so Zone A matches bars.
  const wide = f?.boardMoneyFull || f?.boardMoney?.full;
  const sideUsd = (wide && (wide.ours > 0 || wide.theirs > 0))
    ? (Number(wide.ours) || 0)
    : (Number(f.sharpUsd ?? f.sideInvested) || 0);
  const againstUsd = (wide && (wide.ours > 0 || wide.theirs > 0))
    ? (Number(wide.theirs) || 0)
    : (Number(f.against?.invested) || 0);
  const againstProven = Math.max(0, Number(f.against?.proven) || 0);
  const proven = Math.max(0, Number(f.confirmedOnSide) || 0);
  const muted = String(f.tapeAction || '').toLowerCase() === 'mute' || !!(f.mutedBy);
  const units = Number(f.units) || 0;
  const unopposed = againstUsd < 50 && againstProven === 0;
  const contested = againstProven >= 1 || againstUsd >= 500;

  if (muted && !(units > 0)) {
    return { tone: 'warn', label: 'Muted', detail: 'No ticket', tip: 'System stood down' };
  }
  if (contested) {
    const ours = sideUsd > 0 ? fmtUsd(sideUsd) : null;
    const theirs = againstUsd > 0 ? fmtUsd(againstUsd) : `${againstProven} vs`;
    return {
      tone: 'warn',
      label: 'Contested',
      detail: ours ? `${ours} vs ${theirs}` : `vs ${theirs}`,
      tip: 'Sharp money on both sides — size vs quality context',
    };
  }
  if (unopposed) {
    return {
      tone: 'trust',
      label: 'Unopposed',
      detail: sideUsd > 0 ? fmtUsd(sideUsd) : (proven >= 1 ? `${proven} proven` : null),
      tip: 'No sharp money on the other side',
    };
  }
  if (proven >= 1 || sideUsd > 0) {
    return {
      tone: 'system',
      label: proven >= 1 ? `${proven} proven` : 'On side',
      detail: sideUsd > 0 ? fmtUsd(sideUsd) : null,
      tip: 'Sharp dollars on this side',
    };
  }
  return null;
}

const TONE = {
  trust: GREEN,
  warn: VS,
  system: GOLD_HI,
  hot: GREEN,
  good: GOLD_HI,
  neutral: C.textSec,
};

export default function LockedCollapsedStrength({ f }) {
  if (!f) return null;

  const lead = pickLeadWallet(f);
  const trust = lead?.trust || null;
  const board = boardContext(f);
  const provenExtra = Math.max(0, (Number(f.confirmedOnSide) || 0) - (lead?.proven ? 1 : 0));
  const sr = Number(lead?.displaySizeRatio ?? lead?.sizeRatio);
  const sizeBit = Number.isFinite(sr) && sr > 0
    ? (sr >= 1.5 ? `${sr.toFixed(1)}× usual` : sr < 0.75 ? `${sr.toFixed(1)}× usual` : null)
    : null;
  const onPlay = lead?.invested > 0 ? fmtUsd(lead.invested) : null;

  if (!lead && !board) return null;

  const bar = board
    ? (TONE[board.tone] || C.textSec)
    : (trust?.banger ? (TONE[trust.banger.tone] || GREEN) : GOLD_HI);

  const sport = f.sport || lead?.sport || '';

  return (
    <div
      style={{ marginTop: 16, marginBottom: 14 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
        <div style={{
          width: 3, flexShrink: 0, borderRadius: 2,
          background: bar, minHeight: 44,
        }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Lead sharp — sport-specific Source B trust */}
          {lead && (
            <div style={{ marginBottom: board ? 8 : 0 }}>
              <div style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                gap: 10, flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
                  <span style={{
                    fontFamily: MONO, fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.12em', color: C.textFaint, textTransform: 'uppercase',
                  }}>
                    {sport ? `${sport} lead` : 'Lead'}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: C.textSec,
                    fontFeatureSettings: "'tnum'", letterSpacing: '0.02em',
                  }}>
                    …{lead.short || '————'}
                  </span>
                  {lead.proven && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
                      color: GREEN, textTransform: 'uppercase',
                    }}>
                      Proven
                    </span>
                  )}
                  {provenExtra > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.textFaint }}>
                      +{provenExtra} proven
                    </span>
                  )}
                </div>
                {trust?.banger && (
                  <span style={{
                    fontSize: 15, fontWeight: 750, letterSpacing: '-0.02em',
                    color: TONE[trust.banger.tone] || GREEN,
                    fontFeatureSettings: "'tnum'",
                  }}>
                    {trust.banger.label}
                  </span>
                )}
              </div>

              <div style={{
                marginTop: 4,
                display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                fontSize: 12, fontWeight: 600, color: C.textMuted,
                fontFeatureSettings: "'tnum'",
              }}>
                {(trust?.secondary || []).map((s) => (
                  <span key={s} style={{ color: C.textSec }}>{s}</span>
                ))}
                {(trust?.secondary || []).length > 0 && (onPlay || sizeBit) && (
                  <span style={{ color: C.textFaint }}>·</span>
                )}
                {onPlay && (
                  <span>{onPlay} on this</span>
                )}
                {onPlay && sizeBit && <span style={{ color: C.textFaint }}>·</span>}
                {sizeBit && <span>{sizeBit}</span>}
              </div>
            </div>
          )}

          {/* Board context — never a naked label */}
          {board && (
            <div
              title={board.tip}
              style={{
                display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap',
                paddingTop: lead ? 8 : 0,
                borderTop: lead ? '1px solid rgba(148,163,184,0.10)' : 'none',
              }}
            >
              <span style={{
                fontSize: 13, fontWeight: 750, letterSpacing: '-0.015em',
                color: TONE[board.tone] || C.text,
              }}>
                {board.label}
              </span>
              {board.detail && (
                <span style={{
                  fontSize: 13, fontWeight: 600, color: C.textSec,
                  fontFeatureSettings: "'tnum'",
                }}>
                  {board.detail}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
