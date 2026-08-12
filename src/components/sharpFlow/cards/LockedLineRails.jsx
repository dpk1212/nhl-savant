/**
 * Premium 3-rail price strip for Locked Picks.
 * Flagged (ticket) · Sharp entry (Pinn open/fair) · Now (live Pinn) —
 * three different numbers for three different decisions.
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

export const fmtOdds = (o) => {
  const n = Number(o);
  if (o == null || Number.isNaN(n) || n === 0) return '—';
  return n > 0 ? `+${n}` : `${n}`;
};

function toneColor(tone) {
  if (tone === 'confirm' || tone === 'with') return GREEN;
  if (tone === 'oppose' || tone === 'against') return VS;
  if (tone === 'thin') return GOLD;
  return C.textSec;
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
        color: C.textFaint, marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: emphasize ? '1.12rem' : '1.05rem',
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
          fontSize: '0.5rem', fontWeight: 600, color: C.textMuted,
          marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {hint}
        </div>
      )}
    </div>
  );
}

/**
 * @param {object} props
 * @param {number|null} props.flagged — ticket / lock odds
 * @param {number|null} props.entry — Pinnacle at open / sharp entry
 * @param {number|null} props.now — live Pinnacle fair
 * @param {string|null} [props.smaLabel]
 * @param {string|null} [props.smaTone]
 * @param {string|null} [props.smaTitle]
 * @param {number|null} [props.maxNow]
 * @param {boolean} [props.limitTested]
 * @param {number|null} [props.evPct]
 * @param {number|null} [props.movePp]
 * @param {'compact'|'expanded'} [props.density]
 */
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
  density = 'compact',
}) {
  const hasAny = [flagged, entry, now].some((v) => Number.isFinite(Number(v)) && Number(v) !== 0);
  if (!hasAny) return null;

  const pad = density === 'expanded' ? '12px 14px' : '10px 0 2px';
  const maxLabel = fmtMax(maxNow);
  const showEv = Number.isFinite(evPct) && Math.abs(evPct) >= 0.15;
  const showMove = Number.isFinite(movePp) && Math.abs(movePp) >= 0.15;
  const statusColor = toneColor(smaTone);

  return (
    <div
      title={smaTitle || undefined}
      style={{ padding: pad, fontFeatureSettings: "'tnum'" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: density === 'expanded' ? '10px 12px' : '8px 10px',
        borderRadius: 10,
        background: 'rgba(0,0,0,0.22)',
        border: '1px solid rgba(148,163,184,0.12)',
      }}>
        <Rail
          label="FLAGGED"
          value={flagged}
          hint="ticket"
          emphasize={false}
          align="left"
        />
        <div style={{
          width: 1, alignSelf: 'stretch',
          background: 'rgba(148,163,184,0.12)', flexShrink: 0,
        }} />
        <Rail
          label="SHARP ENTRY"
          value={entry}
          hint="open fair"
          emphasize
          align="center"
        />
        <div style={{
          width: 1, alignSelf: 'stretch',
          background: 'rgba(148,163,184,0.12)', flexShrink: 0,
        }} />
        <Rail
          label="NOW"
          value={now}
          hint="live pinn"
          emphasize={false}
          align="right"
        />
      </div>

      {(smaLabel || maxLabel || showEv || showMove) && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 10px',
          marginTop: density === 'expanded' ? 10 : 8,
        }}>
          {smaLabel && (
            <span style={{
              fontSize: density === 'expanded' ? '0.58rem' : '0.5rem',
              fontWeight: 900, letterSpacing: '0.06em',
              color: statusColor,
            }}>
              {smaLabel}
            </span>
          )}
          {limitTested && smaLabel !== 'LIMIT-TESTED' && (
            <span style={{
              fontSize: density === 'expanded' ? '0.52rem' : '0.48rem',
              fontWeight: 800, letterSpacing: '0.05em',
              padding: '2px 7px', borderRadius: 5,
              color: GREEN,
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.35)',
            }}>
              LIMIT-TESTED
            </span>
          )}
          {maxLabel && !limitTested && (
            <span style={{
              fontSize: '0.48rem', fontWeight: 700, color: C.textMuted,
              fontFeatureSettings: "'tnum'",
            }}>
              Max {maxLabel}
            </span>
          )}
          {showMove && (
            <span style={{
              fontSize: '0.48rem', fontWeight: 700, color: C.textSec,
              fontFeatureSettings: "'tnum'",
            }}>
              Fair {movePp > 0 ? '+' : ''}{movePp.toFixed(1)}pp
            </span>
          )}
          {showEv && (
            <span style={{
              marginLeft: 'auto',
              fontSize: density === 'expanded' ? '0.62rem' : '0.52rem',
              fontWeight: 800,
              color: evPct >= 0 ? GREEN : VS,
              fontFeatureSettings: "'tnum'",
            }}>
              {evPct >= 0 ? '+' : ''}{evPct.toFixed(1)}% EV
            </span>
          )}
        </div>
      )}
    </div>
  );
}
