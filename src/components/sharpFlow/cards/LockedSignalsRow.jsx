/**
 * Locked Picks — high-value confirmation checklist (Market Signals energy).
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
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";

export default function LockedSignalsRow({ signals, compact = false }) {
  if (!signals?.signals?.length) return null;
  const { signals: list, metCount, total, warnAgainst } = signals;
  const highMet = list.filter((s) => s.met && (s.tier === 'high' || s.tier === 'core')).length;

  return (
    <div
      style={{ marginTop: compact ? 6 : 10, marginBottom: compact ? 2 : 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 6, gap: 8,
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em',
          color: C.textMuted,
        }}>
          SIGNALS ALIGNED
        </span>
        <span style={{
          fontSize: compact ? 10 : 11, fontWeight: 800, fontFeatureSettings: "'tnum'",
          color: highMet >= 3 ? GREEN : metCount >= 2 ? GOLD : C.textMuted,
        }}>
          {metCount}/{total}
          {warnAgainst ? (
            <span style={{ color: VS, marginLeft: 8, fontWeight: 700 }}>· pressure vs us</span>
          ) : null}
        </span>
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: compact ? 5 : 6,
      }}>
        {list.map((s) => {
          const on = !!s.met;
          return (
            <span
              key={s.id}
              title={s.tip || s.label}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: compact ? 9 : 10,
                fontWeight: 750,
                letterSpacing: '0.02em',
                padding: compact ? '3px 7px' : '4px 8px',
                borderRadius: 6,
                color: on ? GREEN : C.textFaint,
                background: on ? 'rgba(16,185,129,0.10)' : 'rgba(148,163,184,0.05)',
                border: `1px solid ${on ? 'rgba(16,185,129,0.35)' : 'rgba(148,163,184,0.14)'}`,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontWeight: 900 }}>{on ? '✓' : '·'}</span>
              {compact ? s.short : s.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
