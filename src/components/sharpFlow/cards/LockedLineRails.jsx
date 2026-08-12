/**
 * Compact 3-rail price strip for collapsed Locked Picks.
 * Flagged (ticket) · Entry (pinn open) · Now (live pinn).
 */
const C = {
  text: '#F4F7FB',
  textMuted: '#647089',
  textFaint: '#4a5568',
};
const GREEN = '#2fd57e';
const VS = '#F07167';
const GOLD = '#D4AF37';

export const fmtOdds = (o) => {
  const n = Number(o);
  if (o == null || Number.isNaN(n) || n === 0) return '—';
  return n > 0 ? `+${n}` : `${n}`;
};

function toneColor(tone) {
  if (tone === 'confirm' || tone === 'with') return GREEN;
  if (tone === 'oppose' || tone === 'against') return VS;
  if (tone === 'thin') return GOLD;
  return C.textMuted;
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

function Rail({ label, value, hint, emphasize, align = 'left' }) {
  const has = Number.isFinite(Number(value)) && Number(value) !== 0;
  return (
    <div style={{ flex: 1, minWidth: 0, textAlign: align }}>
      <div style={{
        fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.1em',
        color: C.textFaint, marginBottom: 3,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: emphasize ? '1.05rem' : '1rem',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: emphasize ? GOLD : C.text,
        fontFeatureSettings: "'tnum'",
        lineHeight: 1.1,
      }}>
        {has ? fmtOdds(value) : '—'}
      </div>
      {hint && (
        <div style={{
          fontSize: '0.48rem', fontWeight: 600, color: C.textMuted, marginTop: 2,
        }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export default function LockedLineRails({
  flagged,
  entry,
  now,
  smaLabel = null,
  smaTone = null,
  smaTitle = null,
  maxNow = null,
  limitTested = false,
  evPct = null,
  movePp = null,
}) {
  const hasAny = [flagged, entry, now].some((v) => Number.isFinite(Number(v)) && Number(v) !== 0);
  if (!hasAny) return null;

  const maxLabel = fmtMax(maxNow);
  const showEv = Number.isFinite(evPct) && Math.abs(evPct) >= 0.15;
  const statusColor = toneColor(smaTone);

  return (
    <div title={smaTitle || undefined} style={{ padding: '8px 0 0' }} onClick={(e) => e.stopPropagation()}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '8px 10px',
        borderRadius: 9,
        background: 'rgba(0,0,0,0.22)',
        border: '1px solid rgba(148,163,184,0.12)',
      }}>
        <Rail label="FLAGGED" value={flagged} hint="ticket" align="left" />
        <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(148,163,184,0.12)' }} />
        <Rail label="ENTRY" value={entry} hint="pinn open" emphasize align="center" />
        <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(148,163,184,0.12)' }} />
        <Rail label="NOW" value={now} hint="live pinn" align="right" />
      </div>

      {(smaLabel || maxLabel || showEv || limitTested) && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 10px',
          marginTop: 7, padding: '0 2px',
        }}>
          {smaLabel && smaLabel !== 'LIMIT-TESTED' && (
            <span style={{ fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.06em', color: statusColor }}>
              {smaLabel}
            </span>
          )}
          {(limitTested || smaLabel === 'LIMIT-TESTED') && (
            <span style={{
              fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.05em',
              padding: '2px 6px', borderRadius: 5, color: GREEN,
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.32)',
            }}>
              LIMIT-TESTED{maxLabel ? ` · ${maxLabel}` : ''}
            </span>
          )}
          {maxLabel && !limitTested && smaLabel !== 'LIMIT-TESTED' && (
            <span style={{ fontSize: '0.48rem', fontWeight: 700, color: C.textMuted }}>
              Max {maxLabel}
            </span>
          )}
          {Number.isFinite(movePp) && Math.abs(movePp) >= 0.25 && (
            <span style={{ fontSize: '0.48rem', fontWeight: 700, color: C.textMuted }}>
              {movePp > 0 ? '+' : ''}{movePp.toFixed(1)}pp
            </span>
          )}
          {showEv && (
            <span style={{
              marginLeft: 'auto', fontSize: '0.52rem', fontWeight: 800,
              color: evPct >= 0 ? GREEN : VS, fontFeatureSettings: "'tnum'",
            }}>
              {evPct >= 0 ? '+' : ''}{evPct.toFixed(1)}% EV
            </span>
          )}
        </div>
      )}
    </div>
  );
}
