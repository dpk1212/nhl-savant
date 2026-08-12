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
const GOLD_HI = '#E8D28A';
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";

export default function LockedSignalsRow({ signals, compact = false }) {
  if (!signals?.signals?.length) return null;
  const { signals: list, metCount, total, warnAgainst } = signals;
  const highMet = list.filter((s) => s.met && (s.tier === 'high' || s.tier === 'core')).length;

  if (compact) {
    const met = list.filter((s) => s.met);
    const unmet = list.filter((s) => !s.met);
    return (
      <div
        style={{ marginTop: 8, marginBottom: 8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 10, marginBottom: 7,
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 8, fontWeight: 700,
            letterSpacing: '0.14em', color: C.textMuted,
          }}>
            SIGNALS
          </span>
          <span style={{
            fontFamily: MONO, fontSize: 10, fontWeight: 700,
            fontFeatureSettings: "'tnum'", letterSpacing: '0.02em',
            color: highMet >= 3 ? GREEN : metCount >= 2 ? GOLD_HI : C.textMuted,
          }}>
            {metCount}
            <span style={{ color: C.textFaint, fontWeight: 600 }}>/{total}</span>
            {warnAgainst ? (
              <span style={{ color: VS, marginLeft: 8, fontWeight: 700 }}>vs</span>
            ) : null}
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 5,
        }}>
          {met.map((s) => (
            <span
              key={s.id}
              title={s.tip || s.label}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
                padding: '4px 8px', borderRadius: 999,
                color: GOLD_HI,
                background: 'linear-gradient(180deg, rgba(232,210,138,0.14) 0%, rgba(212,175,55,0.06) 100%)',
                border: '1px solid rgba(212,175,55,0.32)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: GREEN, fontSize: 8, fontWeight: 900 }}>✓</span>
              {s.short}
            </span>
          ))}
          {unmet.map((s) => (
            <span
              key={s.id}
              title={s.tip || s.label}
              style={{
                fontSize: 9, fontWeight: 600, letterSpacing: '0.03em',
                padding: '3px 6px', color: C.textFaint, whiteSpace: 'nowrap',
              }}
            >
              {s.short}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ marginTop: 10, marginBottom: 0 }}
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
          fontSize: 11, fontWeight: 800, fontFeatureSettings: "'tnum'",
          color: highMet >= 3 ? GREEN : metCount >= 2 ? GOLD : C.textMuted,
        }}>
          {metCount}/{total}
          {warnAgainst ? (
            <span style={{ color: VS, marginLeft: 8, fontWeight: 700 }}>· pressure vs us</span>
          ) : null}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {list.map((s) => {
          const on = !!s.met;
          return (
            <span
              key={s.id}
              title={s.tip || s.label}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 10,
                fontWeight: 750,
                letterSpacing: '0.02em',
                padding: '4px 8px',
                borderRadius: 6,
                color: on ? GREEN : C.textFaint,
                background: on ? 'rgba(16,185,129,0.10)' : 'rgba(148,163,184,0.05)',
                border: `1px solid ${on ? 'rgba(16,185,129,0.35)' : 'rgba(148,163,184,0.14)'}`,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontWeight: 900 }}>{on ? '✓' : '·'}</span>
              {s.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
