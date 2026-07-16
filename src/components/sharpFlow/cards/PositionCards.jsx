/**
 * Sharp Flow position cards — Live + Locked presentation views.
 * Ported from LivePositionCardLab (v12 battle / locked slip).
 * Pure UI: expects a normalized fixture `f`. Adapters map production data.
 */
import { useState, useEffect } from 'react';
import { Check, Lock, ChevronDown } from 'lucide-react';

// Anchored to the Sharp Flow page palette (see B tokens in SharpFlow.jsx):
// page #0B0F1F, panels #151923, borders rgba(37,43,59,*), gold #D4AF37.
const C = {
  page: '#0B0F1F',
  card: '#151923',
  text: '#F4F7FB',
  textSec: '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
  hair: 'rgba(148,163,184,0.10)',
  hairSoft: 'rgba(148,163,184,0.06)',
  green: '#22c55e',
  red: '#ef4444',
  gold: '#d4af37',
  amber: '#facc15',
  border: 'rgba(255,255,255,0.08)',
};
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";

export const fmtOdds = (o) => (o == null || Number.isNaN(Number(o)) ? '—' : Number(o) > 0 ? `+${Number(o)}` : `${Number(o)}`);
export const fmtMoney = (v) => {
  if (v == null || Number.isNaN(Number(v))) return '—';
  const n = Math.abs(Number(v));
  const neg = Number(v) < 0;
  if (n >= 1e6) return `${neg ? '-' : ''}$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1000) return `${neg ? '-' : ''}$${(n / 1000).toFixed(1)}K`;
  return `${neg ? '-' : ''}$${Math.round(n)}`;
};

const CARD_CSS = `
  @keyframes posReveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes posBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes posPin { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  @keyframes posPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .pos-reveal { animation: posReveal .34s cubic-bezier(0.16,1,0.3,1) both; }
  .pos-bar { transform-origin: left center; animation: posBar .75s cubic-bezier(0.16,1,0.3,1) both; }
  .pos-pulse { animation: posPulse 1.6s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .pos-reveal, .pos-bar, .pos-pulse { animation: none !important; }
  }
`;
function CardStyles() {
  return <style>{CARD_CSS}</style>;
}

function useCountUp(target, run, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) { setV(0); return; }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setV(target); return;
    }
    let raf; let start;
    const tick = (t) => {
      if (start == null) start = t;
      const prog = Math.min(1, (t - start) / ms);
      setV(target * (1 - Math.pow(1 - prog, 3)));
      if (prog < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

function MiniSpark({ points, color, against, compact }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const w = compact ? 72 : 120; const h = compact ? 22 : 28;
  const d = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / span) * (h - 4) - 2;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <div>
      <svg width={w} height={h} style={{ display: 'block', marginLeft: compact ? 'auto' : 0 }}>
        <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
      {!compact && (
        <div style={{ fontSize: '0.58rem', fontWeight: 700, color, marginTop: 4 }}>
          {against ? '↓ Moving against play' : '↑ Moving with play'}
        </div>
      )}
    </div>
  );
}

function HeroChart({ points, color, h = 72, gid = 'posChart' }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const w = 280;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / span) * (h - 8) - 4;
    return [x, y];
  });
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="0" y1={h * t} x2={w} y2={h * t} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="3.5" fill={color} />
    </svg>
  );
}

/** Team monogram — Apple Sports crest stand-in */
function TeamMark({ code, active, accent }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.62rem', fontWeight: 900, letterSpacing: '-0.02em',
      background: active ? `${accent}22` : 'rgba(255,255,255,0.05)',
      border: `1px solid ${active ? `${accent}66` : C.hair}`,
      color: active ? accent : C.textMuted,
      boxShadow: active ? `0 0 20px -6px ${accent}` : 'none',
    }}>
      {code.slice(0, 3).toUpperCase()}
    </div>
  );
}








/** Fidelity / Public label–value row */
function DetailRow({ label, value, color = C.text, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12,
      padding: '10px 0',
      borderBottom: last ? 'none' : `1px solid ${C.hairSoft}`,
    }}>
      <span style={{ fontSize: '0.7rem', color: C.textMuted }}>{label}</span>
      <span style={{ fontSize: '0.76rem', fontWeight: 700, color, fontFeatureSettings: "'tnum'", textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function WalletListRow({ w, side, sport, accent, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const sizedUp = w.sizeRatio >= 1.5;
  const wlLabel = w.whitelist === 'CONFIRMED' ? 'Proven' : w.whitelist === 'FLAT' ? 'Solid' : 'Watch';
  const wlColor = w.whitelist === 'CONFIRMED' ? C.gold : w.whitelist === 'FLAT' ? C.amber : C.textMuted;
  const sizeLabel = w.qualify === 'VAULT' ? 'Above their avg' : 'Light size';

  return (
    <div style={{ borderBottom: `1px solid ${C.hairSoft}` }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 0', background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'inherit', textAlign: 'left',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '-0.01em' }}>…{w.short}</span>
            <span style={{ fontSize: '0.5rem', fontWeight: 800, color: wlColor }}>{wlLabel}</span>
            {sizedUp && <span style={{ fontSize: '0.5rem', fontWeight: 800, color: accent }}>High conviction</span>}
          </div>
          <div style={{ fontSize: '0.58rem', color: C.textMuted, marginTop: 2, fontFeatureSettings: "'tnum'" }}>
            {w.record}{Number.isFinite(w.wr) ? ` · ${w.wr}% win` : ''}
            {Number.isFinite(w.roi ?? w.dollarRoi) && (
              <>
                {' · '}
                <span style={{ color: (w.roi ?? w.dollarRoi) >= 0 ? C.green : C.red }}>
                  {(w.roi ?? w.dollarRoi) >= 0 ? '+' : ''}{w.roi ?? w.dollarRoi}% ROI
                </span>
              </>
            )}
          </div>
        </div>
        {Number.isFinite(w.sizeRatio) && (
          <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 56 }}>
            <div style={{
              fontSize: '0.62rem', fontWeight: 800, color: sizedUp ? accent : C.textSec,
              fontFeatureSettings: "'tnum'",
            }}>
              {fmtRatio(w.sizeRatio)}×
            </div>
            <div style={{ fontSize: '0.48rem', color: C.textFaint, marginTop: 1 }}>vs usual</div>
          </div>
        )}
        <div style={{
          flexShrink: 0, padding: '6px 10px', borderRadius: 8,
          background: sizedUp ? accent : 'rgba(255,255,255,0.08)',
          color: sizedUp ? '#0a0a0a' : C.text,
          fontSize: '0.78rem', fontWeight: 800, fontFeatureSettings: "'tnum'",
        }}>
          {fmtMoney(w.invested)}
        </div>
        <ChevronDown
          size={14}
          style={{
            flexShrink: 0, color: C.textMuted,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .15s ease',
          }}
        />
      </button>
      {open && (
        <div style={{ padding: '0 0 12px' }}>
          {Number.isFinite(w.sizeRatio) && (
            <DetailRow label="Size vs usual" value={`${fmtRatio(w.sizeRatio)}× · ${sizeLabel}`} color={sizedUp ? accent : C.text} />
          )}
          {w.avgSportBet != null && <DetailRow label={`Usual ${sport} bet`} value={fmtMoney(w.avgSportBet)} />}
          {w.cents != null && <DetailRow label="This ticket" value={`${side} @ ${w.cents}¢`} />}
          {Number.isFinite(w.priorClvPct) && <DetailRow label="Beats the close" value={`${w.priorClvPct}% of the time`} />}
          <DetailRow
            label="Ticket P&L"
            value={`${w.pnl >= 0 ? '+' : ''}${fmtMoney(w.pnl)}`}
            color={w.pnl >= 0 ? C.green : C.red}
            last
          />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CURRENT — dense mock of today's Live Position card
// ═══════════════════════════════════════════════════════════════════════════

function BattleStatRow({ label, awayVal, homeVal, awayShare, accent, homeWins }) {
  const awayW = Math.max(4, Math.min(96, awayShare));
  const homeW = 100 - awayW;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 5, fontFeatureSettings: "'tnum'",
      }}>
        <span style={{
          fontSize: '0.88rem', fontWeight: 800, minWidth: 72,
          color: !homeWins ? accent : C.text,
        }}>{awayVal}</span>
        <span style={{ fontSize: '0.58rem', fontWeight: 700, color: C.textMuted, letterSpacing: '0.04em' }}>
          {label}
        </span>
        <span style={{
          fontSize: '0.88rem', fontWeight: 800, minWidth: 72, textAlign: 'right',
          color: homeWins ? accent : C.text,
        }}>{homeVal}</span>
      </div>
      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 2 }}>
        <div className="pos-bar" style={{
          width: `${awayW}%`,
          background: !homeWins
            ? `linear-gradient(90deg, ${accent}, ${accent}cc)`
            : 'rgba(148,163,184,0.35)',
          borderRadius: 3,
        }} />
        <div style={{
          width: `${homeW}%`,
          background: homeWins
            ? `linear-gradient(90deg, ${accent}cc, ${accent})`
            : 'rgba(148,163,184,0.35)',
          borderRadius: 3,
        }} />
      </div>
    </div>
  );
}



export const CARD_BRAND = {
  gold: '#D4AF37',
  goldHi: '#E8D28A',
  profit: '#2fd57e',
  loss: '#f0524f',
  track: '#7fa8f0',
};
const B = CARD_BRAND;
export const PROPOSED_META = {
  PLAY: { pill: 'PLAY', color: B.gold, bg: 'rgba(212,175,55,0.10)', border: 'rgba(212,175,55,0.30)' },
  TRACKING: { pill: 'TRACKING', color: B.track, bg: 'rgba(127,168,240,0.10)', border: 'rgba(127,168,240,0.28)' },
  MUTED: { pill: 'MUTED', color: B.loss, bg: 'rgba(240,82,79,0.08)', border: 'rgba(240,82,79,0.26)' },
  MONITORING: { pill: 'MONITORING', color: '#8b96ab', bg: 'rgba(139,150,171,0.10)', border: 'rgba(139,150,171,0.26)' },
};

// ═══════════════════════════════════════════════════════════════════════════
// PROPOSED v12 BATTLE — the side-v-side is the centerpiece:
//   · THE BATTLE — facing team columns + Athletic-style mirrored stat rows
//   · EDGE + %+CLV visualized as side-v-side skill rows with delta chips
//   · TapeMeter — continuous skill spectrum (Pass / Standard / Sized up)
//     with the live tape needle: the sizing brain, finally visible
// ═══════════════════════════════════════════════════════════════════════════

function ZoneHead({ children, right, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 3, height: 11, borderRadius: 2, background: accent, boxShadow: `0 0 8px ${accent}88` }} />
        <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.14em', color: C.textSec }}>
          {children}
        </span>
      </span>
      {right}
    </div>
  );
}

function ZoneRule() {
  return (
    <div style={{
      height: 1, margin: '0 18px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09) 18%, rgba(255,255,255,0.09) 82%, transparent)',
    }} />
  );
}

/**
 * Athletic-style mirrored battle row: values at edges, label centered,
 * half-bars growing from center toward each side. Winner side lit.
 */
function BattleRowV12({ label, tag, awayVal, homeVal, awayNum, homeNum, accent, playIsHome, higherWins = true }) {
  const total = Math.max(Math.abs(awayNum) + Math.abs(homeNum), 0.0001);
  const awayPct = (Math.abs(awayNum) / total) * 100;
  const homePct = (Math.abs(homeNum) / total) * 100;
  const homeWins = higherWins ? homeNum >= awayNum : homeNum <= awayNum;
  // When OUR side wins the row, its value glows accent — the eye tracks our
  // column's dominance down the battle.
  const oursWins = homeWins === !!playIsHome;
  const winValColor = oursWins ? accent : C.text;
  const winColor = accent;
  const loseColor = 'rgba(148,163,184,0.35)';
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 7, fontFeatureSettings: "'tnum'",
      }}>
        <span style={{
          fontSize: '0.98rem', fontWeight: 800, letterSpacing: '-0.02em',
          color: !homeWins ? winValColor : C.textMuted,
        }}>{awayVal}</span>
        <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textMuted, textAlign: 'center' }}>
          {label}
          {tag && (
            <span style={{
              marginLeft: 7, padding: '2px 6px', borderRadius: 5, letterSpacing: '0.04em',
              background: `${tag.color}18`, color: tag.color, border: `1px solid ${tag.color}38`,
              fontSize: '0.52rem',
            }}>{tag.text}</span>
          )}
        </span>
        <span style={{
          fontSize: '0.98rem', fontWeight: 800, letterSpacing: '-0.02em',
          color: homeWins ? winValColor : C.textMuted,
        }}>{homeVal}</span>
      </div>
      <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', transform: 'scaleX(-1)' }}>
          <div className="pos-bar" style={{
            width: `${awayPct}%`, height: '100%', borderRadius: 2,
            background: !homeWins
              ? `linear-gradient(90deg, ${winColor}55, ${winColor})`
              : loseColor,
          }} />
        </div>
        <div style={{ width: 1, height: 8, background: 'rgba(255,255,255,0.18)' }} />
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div className="pos-bar" style={{
            width: `${homePct}%`, height: '100%', borderRadius: 2,
            background: homeWins
              ? `linear-gradient(90deg, ${winColor}55, ${winColor})`
              : loseColor,
          }} />
        </div>
      </div>
    </div>
  );
}

/** Facing team columns above the battle rows — money is the scoreboard */
function BattleHeader({ f, accent }) {
  const cols = [
    { key: 'away', code: f.awayShort, s: f.sides.away },
    { key: 'home', code: f.homeShort, s: f.sides.home },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, marginBottom: 6 }}>
      {cols.map((c, i) => {
        const ours = f.side === c.key;
        return (
          <div key={c.key} style={{
            flex: ours ? 1.15 : 1, textAlign: i === 0 ? 'left' : 'right',
            padding: ours ? '16px 15px 14px' : '14px 14px 12px',
            borderRadius: 16, position: 'relative', overflow: 'hidden',
            background: ours
              ? `linear-gradient(${i === 0 ? '135deg' : '225deg'}, ${accent}28 0%, rgba(0,0,0,0.25) 70%)`
              : 'rgba(255,255,255,0.015)',
            border: `1px solid ${ours ? `${accent}60` : C.hairSoft}`,
            boxShadow: ours
              ? `0 18px 44px -22px ${accent}aa, 0 0 0 1px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.1)`
              : 'inset 0 1px 0 rgba(255,255,255,0.03)',
            opacity: ours ? 1 : 0.82,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              flexDirection: i === 0 ? 'row' : 'row-reverse', marginBottom: 10,
            }}>
              <TeamMark code={c.code} active={ours} accent={accent} />
              {ours && (
                <span style={{
                  fontSize: '0.45rem', fontWeight: 900, letterSpacing: '0.1em',
                  padding: '3px 7px', borderRadius: 5, background: accent, color: '#06100a',
                }}>OUR SIDE</span>
              )}
            </div>
            <div style={{
              fontSize: ours ? '1.9rem' : '1.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
              fontFeatureSettings: "'tnum'", color: ours ? C.text : C.textMuted,
              textShadow: ours ? `0 0 34px ${accent}70` : 'none',
            }}>
              {fmtMoney(c.s.invested)}
            </div>
            <div style={{ fontSize: '0.64rem', color: ours ? C.textSec : C.textFaint, marginTop: 6 }}>
              {c.s.sharps} proven · +{fmtMoney(c.s.pnl)} life
            </div>
          </div>
        );
      })}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        alignSelf: 'center', width: 28, height: 28, borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 30%, #1a2030 0%, #05070c 75%)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 6px 18px -4px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.45rem', fontWeight: 900, color: C.textSec, letterSpacing: '0.05em',
      }}>VS</div>
    </div>
  );
}

/**
 * TapeMeter — the sizing brain visualized. Continuous spectrum from
 * Pass (<0) → Standard → Sized up (≥2.89) with the live tape needle.
 */
function TapeMeter({ tapeScore, action }) {
  const MIN = -2, MAX = 4.5, MUTE_AT = 0, BOOST_AT = 2.89;
  const clamp = Math.max(MIN, Math.min(MAX, tapeScore));
  const pctOf = (v) => ((v - MIN) / (MAX - MIN)) * 100;
  const needle = pctOf(clamp);
  const color = action === 'boost' ? B.profit : action === 'mute' ? B.loss : C.amber;
  const headline = action === 'boost' ? 'Sized up' : action === 'mute' ? 'Passing' : 'Standard';
  const blurb = action === 'boost'
    ? 'The skill gap favors our side, so the model raised the stake.'
    : action === 'mute'
      ? 'The skill gap runs against this ticket, so the model skipped it.'
      : 'The skill gap is fair, so the model kept the base stake.';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <span style={{ fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textMuted }}>
          SKILL METER
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color, letterSpacing: '-0.02em' }}>{headline}</span>
      </div>
      <div style={{ position: 'relative', paddingTop: 26 }}>
        <div style={{
          position: 'absolute', left: `${needle}%`, top: 0, transform: 'translateX(-50%)',
          background: color, color: '#0a0a0a', fontSize: '0.62rem', fontWeight: 900,
          padding: '4px 10px', borderRadius: 8, fontFeatureSettings: "'tnum'",
          boxShadow: `0 4px 16px -2px ${color}88`, whiteSpace: 'nowrap',
          animation: 'posPin .5s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          {tapeScore > 0 ? '+' : ''}{tapeScore.toFixed(1)}
          <div style={{
            position: 'absolute', left: '50%', bottom: -5, transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: `5px solid ${color}`,
          }} />
        </div>
        <div style={{ position: 'relative', height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${pctOf(MUTE_AT)}%`, background: `linear-gradient(90deg, ${B.loss}66, ${B.loss}22)` }} />
          <div style={{ width: `${pctOf(BOOST_AT) - pctOf(MUTE_AT)}%`, background: 'rgba(250,204,21,0.16)' }} />
          <div style={{ flex: 1, background: `linear-gradient(90deg, ${B.profit}22, ${B.profit}66)` }} />
          <div style={{
            position: 'absolute', left: `${needle}%`, top: 0, bottom: 0, width: 2.5,
            transform: 'translateX(-50%)', background: '#fff', borderRadius: 2,
            boxShadow: `0 0 10px ${color}`,
          }} />
        </div>
        <div style={{ position: 'relative', height: 16, marginTop: 6 }}>
          {[
            { at: pctOf(MUTE_AT), text: '0' },
            { at: pctOf(BOOST_AT), text: '+2.9' },
          ].map((m) => (
            <span key={m.text} style={{
              position: 'absolute', left: `${m.at}%`, transform: 'translateX(-50%)',
              fontSize: '0.48rem', color: C.textFaint, fontFeatureSettings: "'tnum'",
            }}>{m.text}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['Pass', 'Standard', 'Sized up'].map((l, i) => {
            const active = (i === 0 && action === 'mute') || (i === 1 && action === 'keep') || (i === 2 && action === 'boost');
            return (
              <span key={l} style={{
                fontSize: '0.58rem', fontWeight: active ? 800 : 500,
                color: active ? color : C.textFaint,
              }}>{l}</span>
            );
          })}
        </div>
      </div>
      <p style={{ fontSize: '0.68rem', color: C.textSec, lineHeight: 1.45, margin: '12px 0 0' }}>{blurb}</p>
    </div>
  );
}

const fmtRatio = (r) => (r < 0.1 ? '<0.1' : r.toFixed(1));

function ConvictionRow({ w, accent, maxRatio, last }) {
  const hasRatio = Number.isFinite(w.sizeRatio);
  const hasClv = Number.isFinite(w.priorClvPct);
  const roiDisp = Number.isFinite(w.roi) ? w.roi : w.dollarRoi;
  const ratioColor = w.sizeRatio >= 1.5 ? B.profit : w.sizeRatio >= 1 ? accent : C.textMuted;
  const barPct = hasRatio ? Math.min(100, Math.max(3, (w.sizeRatio / Math.max(maxRatio, 1.01)) * 100)) : 0;
  return (
    <div style={{ padding: '11px 0', borderBottom: last ? 'none' : `1px solid ${C.hairSoft}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
          background: `hsl(${(parseInt(w.short, 16) || 0) % 360} 46% 62%)`,
          boxShadow: `0 0 8px hsl(${(parseInt(w.short, 16) || 0) % 360} 46% 62% / 0.6)`,
        }} />
        <span style={{ fontFamily: MONO, fontSize: '0.72rem', fontWeight: 700, color: C.text }}>…{w.short}</span>
        <span style={{ fontSize: '0.54rem', fontWeight: 800, letterSpacing: '0.08em', color: B.profit }}>PROVEN</span>
        <span style={{ flex: 1 }} />
        {Number.isFinite(roiDisp) && (
          <span style={{
            fontSize: '0.66rem', fontWeight: 800, fontFeatureSettings: "'tnum'",
            color: roiDisp >= 0 ? B.profit : B.loss, marginRight: 10,
          }}>
            {roiDisp >= 0 ? '+' : ''}{roiDisp}% ROI
          </span>
        )}
        <span style={{ fontSize: '0.86rem', fontWeight: 800, fontFeatureSettings: "'tnum'" }}>{fmtMoney(w.invested)}</span>
      </div>
      {(hasRatio || hasClv) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {hasRatio && (
            <>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div className="pos-bar" style={{
                  width: `${barPct}%`, height: '100%', borderRadius: 2,
                  background: `linear-gradient(90deg, ${ratioColor}44, ${ratioColor})`,
                }} />
              </div>
              <span style={{
                fontSize: '0.7rem', fontWeight: 800, color: ratioColor,
                fontFeatureSettings: "'tnum'", minWidth: 64, textAlign: 'right',
              }}>{fmtRatio(w.sizeRatio)}× usual</span>
            </>
          )}
          {!hasRatio && <span style={{ flex: 1 }} />}
          {hasClv && (
            <span style={{
              fontSize: '0.62rem', color: w.priorClvPct >= 55 ? C.textSec : C.textMuted,
              fontFeatureSettings: "'tnum'", minWidth: 86, textAlign: 'right',
            }}>beats close {w.priorClvPct}%</span>
          )}
        </div>
      )}
    </div>
  );
}

// ── WALLET MAP — quadrant bubble map of every sharp on the game ──
// X = beats the close (causal %+CLV) · Y = ROI · r = × usual (conviction).
// Only wallets with BOTH a real clv and a real ROI are plotted — no defaults.
const MAP_QUAD = {
  elite: { title: 'ELITE', blurb: 'Beats the close and prints. The wallets we follow hard.' },
  lucky: { title: 'RESULTS ONLY', blurb: 'Winning without a price edge — results can be fragile.' },
  sharp: { title: 'PRICE EDGE', blurb: 'Beats the close but results are cold. Variance, or a filter.' },
  noise: { title: 'NOISE', blurb: 'Neither price skill nor results. We track, we don\u2019t follow.' },
};

function WalletMapPanel({ f, accent, pts }) {
  const oppColor = '#8ba7d6';
  const playSide = f.side === 'home' ? f.homeShort : f.awayShort;
  const oppSide = f.side === 'home' ? f.awayShort : f.homeShort;

  const defaultSel = (() => {
    const ours = pts.filter((p) => p.side === f.side);
    const pool = ours.length ? ours : pts;
    return [...pool].sort((a, b) => (b.sizeRatio || 0) - (a.sizeRatio || 0))[0]?.short || null;
  })();
  const [sel, setSel] = useState(defaultSel);
  const selected = pts.find((p) => p.short === sel) || pts[0];

  const W = 560;
  const H = 340;
  const pad = { t: 24, r: 20, b: 36, l: 44 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const roiOf = (p) => (Number.isFinite(p.roi) ? p.roi : p.dollarRoi);
  const clvs = pts.map((p) => p.priorClvPct);
  const rois = pts.map(roiOf);
  const xMin = Math.min(40, Math.floor(Math.min(...clvs) / 5) * 5 - 5);
  const xMax = Math.max(70, Math.ceil(Math.max(...clvs) / 5) * 5 + 5);
  const yMin = Math.min(-10, Math.floor(Math.min(...rois) / 10) * 10 - 5);
  const yMax = Math.max(15, Math.ceil(Math.max(...rois) / 10) * 10 + 5);
  const X_BREAK = 55;
  const Y_BREAK = 0;

  const clampV = (n, a, b) => Math.max(a, Math.min(b, n));
  const xS = (v) => pad.l + ((clampV(v, xMin, xMax) - xMin) / (xMax - xMin)) * iw;
  const yS = (v) => pad.t + (1 - (clampV(v, yMin, yMax) - yMin) / (yMax - yMin)) * ih;
  const xB = xS(X_BREAK);
  const yB = yS(Y_BREAK);

  const ratios = pts.map((p) => (Number.isFinite(p.sizeRatio) ? p.sizeRatio : 1));
  const rMin = Math.min(...ratios);
  const rMax = Math.max(...ratios);
  const rFor = (p) => {
    const raw = Number.isFinite(p.sizeRatio) ? p.sizeRatio : 1;
    const t = rMax === rMin ? 0.5 : (raw - rMin) / (rMax - rMin);
    return 7 + t * 15;
  };
  const jitter = (id, axis) => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    return ((((h >> (axis === 'x' ? 0 : 8)) & 255) / 255) - 0.5) * 9;
  };

  const quadOf = (p) => {
    const hiX = p.priorClvPct >= X_BREAK;
    const hiY = roiOf(p) >= Y_BREAK;
    if (hiX && hiY) return 'elite';
    if (!hiX && hiY) return 'lucky';
    if (hiX && !hiY) return 'sharp';
    return 'noise';
  };

  const gid = `wmap-${f.id}`.replace(/[^a-zA-Z0-9-]/g, '');
  const oursCount = pts.filter((p) => p.side === f.side).length;
  const oppCount = pts.length - oursCount;

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <defs>
          <radialGradient id={gid} cx="80%" cy="0%" r="90%">
            <stop offset="0%" stopColor={`${accent}1a`} />
            <stop offset="100%" stopColor={`${accent}05`} />
          </radialGradient>
        </defs>
        <rect x={xB} y={pad.t} width={Math.max(0, pad.l + iw - xB)} height={Math.max(0, yB - pad.t)} fill={`url(#${gid})`} />
        {[0.25, 0.5, 0.75].map((t) => (
          <g key={t}>
            <line x1={pad.l + iw * t} y1={pad.t} x2={pad.l + iw * t} y2={pad.t + ih} stroke={C.hairSoft} strokeWidth={1} />
            <line x1={pad.l} y1={pad.t + ih * t} x2={pad.l + iw} y2={pad.t + ih * t} stroke={C.hairSoft} strokeWidth={1} />
          </g>
        ))}
        <line x1={xB} y1={pad.t} x2={xB} y2={pad.t + ih} stroke="rgba(255,255,255,0.14)" strokeWidth={1} strokeDasharray="3 6" />
        <line x1={pad.l} y1={yB} x2={pad.l + iw} y2={yB} stroke="rgba(255,255,255,0.14)" strokeWidth={1} strokeDasharray="3 6" />
        <line x1={pad.l} y1={pad.t + ih} x2={pad.l + iw} y2={pad.t + ih} stroke={C.hair} strokeWidth={1} />
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + ih} stroke={C.hair} strokeWidth={1} />

        <text x={pad.l + iw / 2} y={H - 7} textAnchor="middle" fill={C.textMuted} fontSize={9.5} fontWeight={800} letterSpacing="0.14em">
          BEATS THE CLOSE →
        </text>
        <text
          x={11} y={pad.t + ih / 2} textAnchor="middle" fill={C.textMuted} fontSize={9.5} fontWeight={800}
          letterSpacing="0.14em" transform={`rotate(-90 11 ${pad.t + ih / 2})`}
        >
          ROI →
        </text>
        <text x={pad.l} y={pad.t + ih + 14} textAnchor="start" fill={C.textFaint} fontSize={9} fontFamily={MONO}>{xMin}%</text>
        <text x={xB} y={pad.t + ih + 14} textAnchor="middle" fill={C.textSec} fontSize={9} fontFamily={MONO}>{X_BREAK}%</text>
        <text x={pad.l + iw} y={pad.t + ih + 14} textAnchor="end" fill={C.textFaint} fontSize={9} fontFamily={MONO}>{xMax}%</text>
        <text x={pad.l - 7} y={pad.t + 4} textAnchor="end" fill={C.textFaint} fontSize={9} fontFamily={MONO}>+{yMax}%</text>
        <text x={pad.l - 7} y={yB + 3} textAnchor="end" fill={C.textSec} fontSize={9} fontFamily={MONO}>0%</text>
        <text x={pad.l - 7} y={pad.t + ih} textAnchor="end" fill={C.textFaint} fontSize={9} fontFamily={MONO}>{yMin}%</text>

        {[
          { key: 'elite', x: xB + (pad.l + iw - xB) / 2, y: pad.t + 13, gold: true },
          { key: 'lucky', x: pad.l + (xB - pad.l) / 2, y: pad.t + 13 },
          { key: 'sharp', x: xB + (pad.l + iw - xB) / 2, y: pad.t + ih - 7 },
          { key: 'noise', x: pad.l + (xB - pad.l) / 2, y: pad.t + ih - 7 },
        ].map((q) => (
          <text
            key={q.key} x={q.x} y={q.y} textAnchor="middle"
            fill={q.gold ? `${accent}61` : 'rgba(255,255,255,0.12)'}
            fontSize={8.5} fontWeight={800} letterSpacing="0.16em"
          >
            {MAP_QUAD[q.key].title}
          </text>
        ))}

        {[...pts].sort((a, b) => (a.side === f.side) - (b.side === f.side)).map((p) => {
          const cx = xS(p.priorClvPct) + jitter(p.short, 'x');
          const cy = yS(roiOf(p)) + jitter(p.short, 'y');
          const r = rFor(p);
          const ours = p.side === f.side;
          const isSel = p.short === sel;
          return (
            <g key={p.short} onClick={() => setSel(p.short)} style={{ cursor: 'pointer' }}>
              {isSel && <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={B.goldHi} strokeWidth={1} opacity={0.85} />}
              <circle
                cx={cx} cy={cy} r={r}
                fill={ours ? `${accent}4d` : 'rgba(139,167,214,0.16)'}
                stroke={ours ? accent : 'rgba(139,167,214,0.75)'}
                strokeWidth={p.proven ? 1.4 : 1}
                strokeDasharray={p.proven ? undefined : '3 2.5'}
                style={{ filter: ours ? `drop-shadow(0 0 8px ${accent}73)` : 'none' }}
              />
              <text
                x={cx} y={cy + 2.5} textAnchor="middle"
                fill={ours ? '#f7ecc9' : '#c6d4ea'}
                fontSize={r > 13 ? 8 : 6.5} fontWeight={800} fontFamily={MONO}
              >
                {p.short.slice(0, 4)}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
        padding: '6px 0 10px', fontSize: '0.58rem', color: C.textMuted,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}` }} />
          <span style={{ color: accent, fontWeight: 800 }}>{playSide}</span>
          <span style={{ fontFeatureSettings: "'tnum'" }}>{oursCount}</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: oppColor }} />
          <span style={{ color: oppColor, fontWeight: 800 }}>{oppSide}</span>
          <span style={{ fontFeatureSettings: "'tnum'" }}>{oppCount}</span>
        </span>
        <span>solid = proven · dashed = tracking · size = conviction</span>
      </div>

      {selected && (
        <div style={{ borderTop: `1px solid ${C.hairSoft}`, paddingTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: selected.side === f.side ? accent : oppColor,
            }} />
            <span style={{ fontFamily: MONO, fontSize: '0.8rem', fontWeight: 800 }}>…{selected.short}</span>
            <span style={{
              fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.08em',
              color: selected.proven ? B.profit : C.textMuted,
            }}>
              {selected.proven ? 'PROVEN' : 'TRACKING'}
            </span>
            <span style={{ flex: 1 }} />
            <span style={{
              fontSize: '0.52rem', fontWeight: 900, letterSpacing: '0.08em',
              padding: '2px 8px', borderRadius: 6,
              color: quadOf(selected) === 'elite' ? '#06100a' : C.textSec,
              background: quadOf(selected) === 'elite'
                ? `linear-gradient(180deg, ${B.goldHi} 0%, ${accent} 100%)`
                : 'rgba(255,255,255,0.06)',
            }}>
              {MAP_QUAD[quadOf(selected)].title}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontFeatureSettings: "'tnum'" }}>
            {[
              { label: 'BEATS CLOSE', val: `${selected.priorClvPct}%`, hot: selected.priorClvPct >= X_BREAK },
              { label: 'ROI', val: `${roiOf(selected) >= 0 ? '+' : ''}${roiOf(selected)}%`, hot: roiOf(selected) >= 0 },
              ...(Number.isFinite(selected.sizeRatio)
                ? [{ label: '× USUAL', val: `${fmtRatio(selected.sizeRatio)}×`, hot: selected.sizeRatio >= 1.5 }]
                : []),
              { label: 'THIS TICKET', val: fmtMoney(selected.invested) },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: '0.44rem', color: C.textFaint, letterSpacing: '0.1em', marginBottom: 3 }}>{s.label}</div>
                <div style={{
                  fontSize: '0.85rem', fontWeight: 800, letterSpacing: '-0.02em',
                  color: s.hot ? accent : C.text,
                  textShadow: s.hot ? `0 0 16px ${accent}55` : 'none',
                }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Market rail — one game, three markets. State dot + units per market. */
function MarketRail({ markets, activeId, onSelect }) {
  const NAMES = { ML: 'Moneyline', SPREAD: 'Run line', TOTAL: 'Total' };
  return (
    <div style={{
      display: 'flex', gap: 3, padding: 2, borderRadius: 9, marginBottom: 8,
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.hairSoft}`,
    }}>
      {markets.map((m) => {
        const active = m.id === activeId;
        const mMeta = PROPOSED_META[m.displayState] || PROPOSED_META.MONITORING;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            style={{
              flex: 1, padding: '4px 4px', borderRadius: 7, cursor: 'pointer',
              border: `1px solid ${active ? `${B.gold}55` : 'transparent'}`,
              background: active ? 'rgba(212,175,55,0.1)' : 'transparent',
              transition: 'background .18s ease, border-color .18s ease',
            }}
          >
            <div style={{
              fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.02em',
              color: active ? C.text : C.textMuted, marginBottom: 0,
            }}>
              {NAMES[m.marketType] || m.marketType}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.52rem', fontWeight: 700, fontFeatureSettings: "'tnum'",
              color: active ? C.textSec : C.textFaint,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%', background: mMeta.color,
                boxShadow: active ? `0 0 6px ${mMeta.color}` : 'none',
              }} />
              {m.units > 0 ? `${m.units.toFixed(1)}u` : 'watch'}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function LivePositionCardView({ f, markets, onMarket }) {
  const meta = PROPOSED_META[f.displayState] || PROPOSED_META.PLAY;
  const playSide = f.side === 'home' ? f.homeShort : f.awayShort;
  const playIsHome = f.side === 'home';
  const isMuted = f.displayState === 'MUTED';
  const isWatch = f.units <= 0 && !isMuted;
  // The battle is the product. Watch cards keep the champagne accent so the
  // side-v-side money stays lit; only the state pill goes gray.
  const accent = isWatch ? B.gold : meta.color;
  const hasEdge = Number.isFinite(f.edge);
  const hasClv = Number.isFinite(f.netClv);
  const hasTape = Number.isFinite(f.tapeScore);
  const riskAnim = useCountUp(f.units, true, 1000);
  // Quadrant map points: every sharp on the game (both sides when the
  // adapter provides them) that has a REAL beats-close % and ROI. No
  // invented coordinates — wallets missing either stat stay off the map.
  const mapPts = (Array.isArray(f.mapWallets) && f.mapWallets.length
    ? f.mapWallets
    : f.wallets.map((w) => ({ ...w, side: w.side || f.side })))
    .filter((w) => Number.isFinite(w.priorClvPct) && (Number.isFinite(w.roi) || Number.isFinite(w.dollarRoi)));
  const hasMap = mapPts.length >= 2;
  const [tab, setTab] = useState(hasMap ? 'map' : 'flow');
  // Real Pinnacle odds series only — no fabricated chart shapes.
  const pinSeries = Array.isArray(f.pinSeries) && f.pinSeries.length >= 2 ? f.pinSeries : null;
  const moveColor = f.pinnacleOpposes ? B.loss : B.profit;
  const sortedWallets = [...f.wallets].sort((a, b) => (b.sizeRatio || 0) - (a.sizeRatio || 0));
  const maxRatio = sortedWallets[0]?.sizeRatio || 1;
  const sizeColor = f.tapeAction === 'boost' ? B.profit : f.tapeAction === 'mute' ? B.loss : C.textSec;
  const sizeWord = f.tapeAction === 'boost' ? 'sized up' : f.tapeAction === 'mute' ? 'passed' : 'standard size';
  const isLive = f.isLive || f.gameTime === 'LIVE';
  const hasPrice = Number.isFinite(f.odds) || Number.isFinite(f.fairOdds);
  // Higher American odds always pay the bettor more, so "better than fair"
  // is odds > fairOdds. Crossing +100/-100 skips the dead 200-cent band.
  const centsEdge = (() => {
    if (!Number.isFinite(f.odds) || !Number.isFinite(f.fairOdds)) return null;
    let diff = f.odds - f.fairOdds;
    if ((f.odds > 0) !== (f.fairOdds > 0)) diff -= Math.sign(diff) * 200;
    return diff > 0 ? `${Math.round(diff)}¢ better than fair` : null;
  })();

  // Per-side skill: real graded win rates + causal %+CLV of proven wallets
  // on each side (from stored profiles / cron stamps). No invented defaults.
  const awayWr = f.sides.away?.wr;
  const homeWr = f.sides.home?.wr;
  const showWrRow = Number.isFinite(awayWr) && Number.isFinite(homeWr);
  const awayClv = f.sides.away?.clv;
  const homeClv = f.sides.home?.clv;
  // Show BEATS THE CLOSE when at least our side has a real %+CLV; opposing
  // side can fall back to the netCLV prior (62) for the lane display only
  // when the cron stamped netCLV with a missing AG mean.
  const showClvRow = Number.isFinite(awayClv) || Number.isFinite(homeClv);
  const clvLane = {
    away: Number.isFinite(awayClv) ? awayClv : (Number.isFinite(homeClv) && hasClv ? Math.round(homeClv - f.netClv) : null),
    home: Number.isFinite(homeClv) ? homeClv : (Number.isFinite(awayClv) && hasClv ? Math.round(awayClv - f.netClv) : null),
  };
  const showClvBattle = showClvRow
    && Number.isFinite(clvLane.away)
    && Number.isFinite(clvLane.home);

  // Split verdict into a bold lead (the receipts) and a quieter action line
  // so the eye lands on the proof first.
  const verdict = (() => {
    const vault = f.vaultOnSide > 0 ? `${f.vaultOnSide} betting well above their usual` : null;
    const winners = `${f.confirmedOnSide} proven ${f.sport} winner${f.confirmedOnSide === 1 ? '' : 's'} on ${playSide}`;
    const lead = `${winners}${vault ? `, ${vault}` : ''}.`;
    if (f.tapeAction === 'mute' && isMuted) {
      return { lead, rest: 'The skill read is weak, so we passed.' };
    }
    if (isWatch) {
      return { lead, rest: "The money hasn't crossed a stake path yet, so we watch." };
    }
    if (f.tapeAction === 'boost') return { lead, rest: `The skill read is strong, so we ${sizeWord}.` };
    if (f.displayState === 'TRACKING') return { lead, rest: 'Watching with a light stake.' };
    return { lead, rest: `We took ${sizeWord}.` };
  })();

  const zone = (i) => ({ className: 'pos-reveal', style: { animationDelay: `${i * 70}ms`, position: 'relative' } });

  return (
    <div className="sf-card" style={{
      borderRadius: 16, overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0) 42%), linear-gradient(180deg, #161B29 0%, #10141F 55%, #0D111C 100%)',
      border: `1px solid ${isWatch ? 'rgba(212,175,55,0.22)' : meta.border}`, position: 'relative',
      boxShadow: `0 30px 70px -32px rgba(0,0,0,0.9), 0 0 50px -22px ${accent}38, inset 0 1px 0 rgba(255,255,255,0.06)`,
    }}>
      <CardStyles />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(130% 60% at 50% -15%, ${accent}28 0%, transparent 52%),
          radial-gradient(60% 30% at 85% 8%, rgba(255,255,255,0.04) 0%, transparent 55%)
        `,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 1,
      }} />

      {/* ── ZONE 1 · THE CALL ── */}
      <div {...zone(0)}>
        <div style={{ padding: '12px 18px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textMuted }}>
              {f.sport}
              <span style={{ color: isLive ? B.loss : C.textFaint, marginLeft: 9 }}>
                {isLive && (
                  <span className="pos-pulse" style={{
                    display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                    background: B.loss, boxShadow: `0 0 8px ${B.loss}`, marginRight: 5, verticalAlign: 'middle',
                  }} />
                )}
                {isLive ? 'LIVE' : f.gameTime}
              </span>
              <span style={{ color: C.textFaint, marginLeft: 9 }}>{f.away} @ {f.home}</span>
            </span>
            {isWatch ? (
              <span style={{
                fontSize: '0.54rem', fontWeight: 900, letterSpacing: '0.08em',
                padding: '3px 9px', borderRadius: 7, color: '#aeb8cb',
                background: 'rgba(139,150,171,0.10)', border: '1px solid rgba(139,150,171,0.26)',
              }}>
                {meta.pill}
              </span>
            ) : (
              <span style={{
                fontSize: '0.54rem', fontWeight: 900, letterSpacing: '0.08em',
                padding: '3px 9px', borderRadius: 7, color: '#06100a',
                background: `linear-gradient(180deg, ${accent === B.gold ? B.goldHi : accent} 0%, ${accent} 55%, ${accent}bb 100%)`,
                boxShadow: `0 10px 28px -10px ${accent}, inset 0 1px 0 rgba(255,255,255,0.4)`,
              }}>
                {meta.pill}
              </span>
            )}
          </div>

          {markets && markets.length > 1 && (
            <MarketRail markets={markets} activeId={f.id} onSelect={onMarket} />
          )}

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <div>
              <div style={{
                fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4,
              }}>
                {f.pickLabel}
                <span style={{ fontSize: '0.85rem', color: C.textSec, fontWeight: 700, marginLeft: 9, fontFeatureSettings: "'tnum'" }}>
                  {fmtOdds(f.odds)}
                </span>
              </div>
              {isWatch ? (
                <div>
                  <div style={{
                    fontSize: '2.85rem', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.9,
                    fontFeatureSettings: "'tnum'",
                    filter: `drop-shadow(0 0 30px ${accent}50)`,
                  }}>
                    <span style={{
                      background: `linear-gradient(180deg, #ffffff 8%, ${B.goldHi} 96%)`,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      {fmtMoney(f.sideInvested)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: C.textMuted, marginTop: 4 }}>
                    sharp money on <span style={{ color: accent, fontWeight: 800 }}>{playSide}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{
                    fontSize: '2.85rem', fontWeight: 800, letterSpacing: '-0.065em', lineHeight: 0.88,
                    fontFeatureSettings: "'tnum'",
                    filter: f.units > 0 ? `drop-shadow(0 0 26px ${accent}45)` : 'none',
                  }}>
                    <span style={{
                      background: f.units > 0
                        ? 'linear-gradient(180deg, #ffffff 12%, #b9c6dc 100%)'
                        : `linear-gradient(180deg, ${B.loss} 12%, #7f1d1d 100%)`,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      {f.units > 0 ? riskAnim.toFixed(1) : '0.0'}
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: C.textMuted, marginLeft: 5 }}>u</span>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: C.textMuted, marginTop: 4 }}>
                    {f.units > 0 ? 'our ticket' : 'we passed'}
                  </div>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ textAlign: 'right', paddingBottom: 3 }}>
              {isWatch ? (
                <>
                  <div style={{
                    fontSize: '1.55rem', fontWeight: 800, color: C.text,
                    fontFeatureSettings: "'tnum'", letterSpacing: '-0.03em',
                  }}>
                    {f.confirmedOnSide}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: C.textMuted, marginTop: 4, marginBottom: 6 }}>
                    proven winner{f.confirmedOnSide === 1 ? '' : 's'}
                  </div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: C.textMuted }}>
                    no ticket yet
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    fontSize: '1.2rem', fontWeight: 800, color: f.units > 0 ? B.profit : C.textMuted,
                    fontFeatureSettings: "'tnum'", letterSpacing: '-0.03em',
                  }}>
                    {f.units > 0 ? `+${f.toWin.toFixed(2)}u` : '—'}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 4, marginBottom: 6 }}>to win</div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700 }}>
                    <span style={{ color: C.textMuted }}>{f.stakePath}</span>
                    <span style={{ color: C.textFaint }}> · </span>
                    <span style={{ color: sizeColor }}>
                      {f.tapeAction === 'boost' ? 'Sized up' : f.tapeAction === 'mute' ? 'Pass' : 'Standard'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <p style={{ margin: '10px 0 0', fontSize: '0.88rem', lineHeight: 1.5, maxWidth: 460 }}>
            <span style={{ color: C.text, fontWeight: 700 }}>{verdict.lead}</span>
            {' '}
            <span style={{ color: '#9fabc2' }}>{verdict.rest}</span>
          </p>
        </div>
      </div>

      <ZoneRule />

      {/* ── ZONE 2 · THE BATTLE ── */}
      <div {...zone(1)}>
        <div style={{ padding: '20px 20px 12px', position: 'relative' }}>
          <ZoneHead accent={accent} right={(
            <span style={{
              fontSize: '0.58rem', fontWeight: 900, fontFeatureSettings: "'tnum'",
              padding: '4px 10px', borderRadius: 7, color: '#06100a',
              background: `linear-gradient(180deg, ${accent === B.gold ? B.goldHi : accent} 0%, ${accent} 100%)`,
              boxShadow: `0 8px 20px -10px ${accent}`,
            }}>
              {f.flow.sharp[f.side]}% on {playSide}
            </span>
          )}>
            THE BATTLE
          </ZoneHead>

          <div style={{ position: 'relative' }}>
            <BattleHeader f={f} accent={accent} />
          </div>

          <div style={{ marginTop: 12, position: 'relative' }}>
            <BattleRowV12
              label="PROVEN WINNERS"
              awayVal={String(f.sides.away.sharps)}
              homeVal={String(f.sides.home.sharps)}
              awayNum={f.sides.away.sharps}
              homeNum={f.sides.home.sharps}
              accent={accent}
              playIsHome={playIsHome}
            />
            <BattleRowV12
              label="SHARP MONEY"
              awayVal={fmtMoney(f.sides.away.invested)}
              homeVal={fmtMoney(f.sides.home.invested)}
              awayNum={f.sides.away.invested}
              homeNum={f.sides.home.invested}
              accent={accent}
              playIsHome={playIsHome}
            />
            {(f.sides.away.avg > 0 || f.sides.home.avg > 0) && (
              <BattleRowV12
                label="AVG TICKET"
                awayVal={fmtMoney(f.sides.away.avg)}
                homeVal={fmtMoney(f.sides.home.avg)}
                awayNum={f.sides.away.avg || 0}
                homeNum={f.sides.home.avg || 0}
                accent={accent}
                playIsHome={playIsHome}
              />
            )}
            {showWrRow && (
              <BattleRowV12
                label="WIN RATE"
                tag={hasEdge ? { text: `EDGE ${f.edge > 0 ? '+' : ''}${f.edge.toFixed(1)}`, color: f.edge >= 0 ? B.profit : B.loss } : null}
                awayVal={`${awayWr}%`}
                homeVal={`${homeWr}%`}
                awayNum={awayWr}
                homeNum={homeWr}
                accent={accent}
                playIsHome={playIsHome}
              />
            )}
            {showClvBattle && (
              <BattleRowV12
                label="BEATS THE CLOSE"
                tag={hasClv ? {
                  text: `${f.netClv > 0 ? '+' : ''}${Number(f.netClv).toFixed(1)}`,
                  color: f.netClv >= 0 ? B.profit : B.loss,
                } : null}
                awayVal={`${clvLane.away}%`}
                homeVal={`${clvLane.home}%`}
                awayNum={clvLane.away}
                homeNum={clvLane.home}
                accent={accent}
                playIsHome={playIsHome}
              />
            )}
            <BattleRowV12
              label="LIFETIME P&L"
              awayVal={`+${fmtMoney(f.sides.away.pnl)}`}
              homeVal={`+${fmtMoney(f.sides.home.pnl)}`}
              awayNum={f.sides.away.pnl}
              homeNum={f.sides.home.pnl}
              accent={accent}
              playIsHome={playIsHome}
            />
          </div>

          <div style={{ marginTop: 8, borderTop: `1px solid ${C.hairSoft}` }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '12px 0 2px',
            }}>
              <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textFaint }}>
                CARRYING {playSide.toUpperCase()} · TOP {Math.min(3, sortedWallets.length)}
              </span>
              {sortedWallets.length > 3 && (
                <button
                  type="button"
                  onClick={() => setTab('wallets')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontSize: '0.55rem', fontWeight: 700, color: C.textMuted,
                  }}
                >
                  +{sortedWallets.length - 3} more ↓
                </button>
              )}
            </div>
            {sortedWallets.slice(0, 3).map((w, i, arr) => (
              <ConvictionRow key={w.short} w={w} accent={accent} maxRatio={maxRatio} last={i === arr.length - 1} />
            ))}
          </div>
        </div>
      </div>

      <ZoneRule />

      {/* ── ZONE 3 · WHY THIS SIZE ── */}
      <div {...zone(2)}>
        <div style={{ padding: '14px 18px 14px' }}>
          <ZoneHead accent={accent} right={Number.isFinite(f.setupHitRate) ? (
            <span style={{ fontSize: '0.6rem', color: C.textMuted, fontFeatureSettings: "'tnum'" }}>
              setups like this hit <span style={{ color: f.setupHitRate >= 55 ? B.profit : C.textSec, fontWeight: 800 }}>{f.setupHitRate}%</span>
            </span>
          ) : null}>
            {f.units > 0 ? `WHY ${f.units.toFixed(1)}u` : isWatch ? 'WHY NO TICKET' : 'WHY WE PASSED'}
          </ZoneHead>

          {isWatch ? (
            <p style={{ fontSize: '0.78rem', color: C.textSec, lineHeight: 1.5, margin: 0 }}>
              The money on this game hasn't crossed a stake path yet. We track it for context
              and only put units down when proven winners commit at real size.
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: hasTape ? 18 : 0, fontFeatureSettings: "'tnum'" }}>
                {[
                  { label: 'BASE', val: `${f.pathBaseUnits.toFixed(1)}u`, sub: f.stakePath },
                  {
                    label: 'SKILL DIAL',
                    val: f.tapeAction === 'boost' ? '×1.35' : f.tapeAction === 'mute' ? 'Pass' : 'Hold',
                    sub: f.tapeAction === 'boost' ? 'strong' : f.tapeAction === 'mute' ? 'weak' : 'fair',
                    color: sizeColor,
                  },
                  { label: 'TICKET', val: `${f.units.toFixed(1)}u`, sub: 'final', color: f.units > 0 ? '#fff' : B.loss, hot: true },
                ].map((s, i, arr) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: i === arr.length - 1 ? '0 0 auto' : 1 }}>
                    <div style={{ textAlign: i === 0 ? 'left' : 'center' }}>
                      <div style={{ fontSize: '0.46rem', color: C.textFaint, letterSpacing: '0.1em', marginBottom: 5 }}>{s.label}</div>
                      <div style={{
                        fontSize: s.hot ? '1.4rem' : '1rem', fontWeight: 800,
                        color: s.color || C.text, letterSpacing: '-0.03em',
                        textShadow: s.hot && f.units > 0 ? `0 0 24px ${accent}66` : 'none',
                      }}>{s.val}</div>
                      <div style={{ fontSize: '0.5rem', color: s.color || C.textMuted, fontWeight: 700, marginTop: 3 }}>{s.sub}</div>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{
                        flex: 1, height: 1, margin: '0 12px',
                        background: `linear-gradient(90deg, ${C.hair}, ${i === 1 ? accent : 'rgba(255,255,255,0.18)'})`,
                        position: 'relative',
                      }}>
                        <span style={{
                          position: 'absolute', right: -1, top: -2.5, width: 0, height: 0,
                          borderTop: '3px solid transparent', borderBottom: '3px solid transparent',
                          borderLeft: `5px solid ${i === 1 ? accent : 'rgba(255,255,255,0.3)'}`,
                        }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {hasTape && <TapeMeter tapeScore={f.tapeScore} action={f.tapeAction} />}
            </>
          )}
        </div>
      </div>

      {hasPrice && (
        <>
          <ZoneRule />

          {/* ── ZONE 4 · PRICE CHECK ── */}
          <div {...zone(3)}>
            <div style={{ padding: '20px 20px 18px' }}>
              <ZoneHead accent={accent} right={(
                <span style={{ fontSize: '0.58rem', fontWeight: 800, color: moveColor }}>
                  {f.pinnacleOpposes ? 'market moving against us' : 'market moving with us'}
                </span>
              )}>
                PRICE CHECK
              </ZoneHead>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFeatureSettings: "'tnum'" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.48rem', color: C.textFaint, letterSpacing: '0.08em', marginBottom: 4 }}>WE GOT</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{fmtOdds(f.odds)}</div>
                  <div style={{ fontSize: '0.52rem', color: C.textMuted, marginTop: 3 }}>{f.book}</div>
                </div>
                {pinSeries ? (
                  <MiniSpark points={pinSeries.slice(-7)} color={moveColor} against={f.pinnacleOpposes} compact />
                ) : (
                  <div style={{ flex: '0 0 72px' }} />
                )}
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: '0.48rem', color: C.textFaint, letterSpacing: '0.08em', marginBottom: 4 }}>FAIR LINE</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: moveColor, letterSpacing: '-0.02em' }}>{fmtOdds(f.fairOdds)}</div>
                  {f.fairProb != null && (
                    <div style={{ fontSize: '0.52rem', color: C.textMuted, marginTop: 3 }}>{f.fairProb}% implied</div>
                  )}
                </div>
              </div>
              {centsEdge && (
                <div style={{ marginTop: 12, fontSize: '0.64rem', color: B.profit, fontWeight: 700 }}>
                  ✓ {centsEdge}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <ZoneRule />

      {/* ── ZONE 5 · DEPTH ── */}
      <div {...zone(4)}>
        <div style={{ padding: '8px 18px 18px' }}>
          <div style={{ display: 'flex', marginBottom: 12 }}>
            {[
              ...(hasMap ? [{ id: 'map', label: 'Wallet map' }] : []),
              { id: 'flow', label: 'Money flow' },
              { id: 'history', label: 'Line history' },
              { id: 'wallets', label: 'Wallets' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '10px 0', cursor: 'pointer', border: 'none',
                  background: 'transparent', fontSize: '0.7rem', fontWeight: 800,
                  color: tab === t.id ? C.text : C.textMuted,
                  borderBottom: tab === t.id ? `2px solid ${accent}` : `1px solid ${C.hairSoft}`,
                  transition: 'color .18s ease, border-color .18s ease',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pos-reveal" key={tab}>
            {tab === 'map' && hasMap && (
              <WalletMapPanel f={f} accent={accent} pts={mapPts} />
            )}

            {tab === 'history' && (
              <div>
                {pinSeries ? (
                  <>
                    <HeroChart points={pinSeries} color={moveColor} h={68} gid={`v12-${f.id}`} />
                    <div style={{ marginTop: 10, marginBottom: 16, display: 'flex', justifyContent: 'space-between', fontSize: '0.56rem', color: C.textMuted, fontFeatureSettings: "'tnum'" }}>
                      <span>Open {fmtOdds(pinSeries[0])}</span>
                      <span>Now {fmtOdds(pinSeries[pinSeries.length - 1])}</span>
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: '0.64rem', color: C.textMuted, margin: '0 0 14px' }}>
                    Line movement will chart here once the sharp book posts more prices.
                  </p>
                )}
                <div style={{ display: 'flex', fontFeatureSettings: "'tnum'" }}>
                  {f.books.map((b, i) => (
                    <div key={b.name} style={{
                      flex: 1, padding: '10px 4px', textAlign: 'center',
                      borderLeft: i === 0 ? 'none' : `1px solid ${C.hairSoft}`,
                    }}>
                      <div style={{ fontSize: '0.46rem', color: b.sharp ? B.gold : C.textMuted, fontWeight: 700, letterSpacing: '0.04em' }}>
                        {b.name.toUpperCase()}
                      </div>
                      <div style={{
                        fontSize: '0.95rem', fontWeight: 800, marginTop: 4,
                        color: b.sharp ? B.gold : C.text,
                      }}>{fmtOdds(b.odds)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'flow' && (
              <div>
                <BattleStatRow
                  label="SHARP $"
                  awayVal={`${f.flow.sharp.away}%`}
                  homeVal={`${f.flow.sharp.home}%`}
                  awayShare={f.flow.sharp.away}
                  accent={accent}
                  homeWins={f.flow.sharp.home >= f.flow.sharp.away}
                />
                {f.flow.tickets && (
                  <BattleStatRow
                    label="PUBLIC TIX"
                    awayVal={`${f.flow.tickets.away}%`}
                    homeVal={`${f.flow.tickets.home}%`}
                    awayShare={f.flow.tickets.away}
                    accent={accent}
                    homeWins={f.flow.tickets.home >= f.flow.tickets.away}
                  />
                )}
                {f.flow.money && (
                  <BattleStatRow
                    label="PUBLIC $"
                    awayVal={`${f.flow.money.away}%`}
                    homeVal={`${f.flow.money.home}%`}
                    awayShare={f.flow.money.away}
                    accent={accent}
                    homeWins={f.flow.money.home >= f.flow.money.away}
                  />
                )}
                <p style={{ fontSize: '0.64rem', color: C.textMuted, lineHeight: 1.55, margin: '12px 0 0' }}>
                  {f.flow.tickets || f.flow.money
                    ? 'Sharp money vs public split. When the crowd is on one side and proven wallets are on the other, we follow the wallets.'
                    : 'Verified sharp money split for this game. Public ticket data will appear here when available.'}
                </p>
              </div>
            )}

            {tab === 'wallets' && (
              <div>
                {sortedWallets.map((w, i) => (
                  <WalletListRow
                    key={`t-${w.short}`}
                    w={w}
                    side={playSide}
                    sport={f.sport}
                    accent={accent}
                    defaultOpen={i === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ZoneRule />

      {/* ── BRANDMARK ── */}
      <div style={{
        position: 'relative', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '14px 20px 16px',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: B.gold, boxShadow: `0 0 8px ${B.gold}`,
          }} />
          <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.24em', color: C.textMuted }}>
            NHL SAVANT · SHARP FLOW
          </span>
        </span>
        <span style={{ fontSize: '0.52rem', color: C.textFaint, fontFeatureSettings: "'tnum'" }}>
          {isLive ? 'live now' : f.gameTime}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCKED PICK CARD — post-lock story: the ticket is frozen, the market keeps
// moving. Hierarchy: locked ticket → price journey + CLV → receipts.
// Same "champagne & profit" brand system as the live card.
// ═══════════════════════════════════════════════════════════════════════════
/** Betting-slip tear line — notches + perforation. Screenshot candy. */
function TicketPerf() {
  return (
    <div style={{ position: 'relative', height: 22, margin: '2px 0' }}>
      <div style={{
        position: 'absolute', left: 26, right: 26, top: '50%',
        borderTop: '1.5px dashed rgba(255,255,255,0.16)',
      }} />
      {['left', 'right'].map((side) => (
        <div key={side} style={{
          position: 'absolute', [side]: -11, top: '50%', transform: 'translateY(-50%)',
          width: 22, height: 22, borderRadius: '50%', background: '#0B0F1F',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
        }} />
      ))}
    </div>
  );
}

/** Faux barcode — deterministic from serial. Pure slip aesthetic. */
function TicketBarcode({ serial }) {
  const bars = [];
  let seed = 0;
  for (let i = 0; i < serial.length; i += 1) seed = (seed * 31 + serial.charCodeAt(i)) % 9973;
  for (let i = 0; i < 34; i += 1) {
    seed = (seed * 1103515245 + 12345) % 2147483647;
    bars.push(1 + (seed % 3));
  }
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 1.5, height: 22 }}>
      {bars.map((w, i) => (
        <span key={i} style={{ width: w, background: `rgba(255,255,255,${i % 4 === 0 ? 0.5 : 0.3})`, borderRadius: 0.5 }} />
      ))}
    </div>
  );
}

function JourneyStop({ label, time, odds, color, active }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 64 }}>
      <div style={{
        fontSize: '0.9rem', fontWeight: 800, fontFeatureSettings: "'tnum'",
        color: active ? color : C.text, letterSpacing: '-0.02em',
      }}>{fmtOdds(odds)}</div>
      <div style={{
        width: 9, height: 9, borderRadius: '50%', margin: '7px auto 6px',
        background: color, boxShadow: active ? `0 0 10px ${color}` : 'none',
        border: '2px solid #05070c',
      }} />
      <div style={{ fontSize: '0.52rem', fontWeight: 800, color: active ? color : C.textSec }}>{label}</div>
      <div style={{ fontSize: '0.48rem', color: C.textFaint, marginTop: 2, fontFeatureSettings: "'tnum'" }}>{time}</div>
    </div>
  );
}

export function LockedPositionCardView({ f, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const tracked = !(f.units > 0);
  // Champagne accents stay even on tracked picks; only the pill goes gray.
  const accent = B.gold;
  const playSide = f.side === 'home' ? f.homeShort : f.awayShort;
  const riskAnim = useCountUp(f.units, expanded, 1000);
  const clvGood = f.clvPct >= 0;
  const clvColor = clvGood ? B.profit : B.loss;
  // Journey chart through the three REAL price stops (lock → peak → now).
  const journeySeries = [f.lockOdds, f.peakOdds, f.nowOdds].filter(Number.isFinite);
  const hasJourney = journeySeries.length >= 2;

  if (!expanded) {
    return (
      <div
        className="sf-card"
        onClick={() => setExpanded(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(true); }}
        style={{
          borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0) 42%), linear-gradient(180deg, #161B29 0%, #10141F 100%)',
          border: `1px solid ${tracked ? 'rgba(139,150,171,0.22)' : 'rgba(212,175,55,0.28)'}`,
          position: 'relative', padding: '14px 18px',
        }}
      >
        <CardStyles />
        <div style={{
          position: 'absolute', top: 0, left: '12%', right: '12%', height: 1.5, pointerEvents: 'none',
          background: `linear-gradient(90deg, transparent, ${tracked ? '#8b96ab' : accent}, transparent)`, opacity: 0.7,
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.1em', color: C.textMuted }}>
            {f.sport}
            <span style={{ color: C.textFaint, marginLeft: 8 }}>{f.away} @ {f.home}</span>
            <span style={{ color: C.textFaint, marginLeft: 8 }}>{f.gameTime}</span>
          </span>
          {tracked ? (
            <span style={{
              fontSize: '0.52rem', fontWeight: 900, letterSpacing: '0.08em',
              padding: '4px 10px', borderRadius: 7, color: '#aeb8cb',
              background: 'rgba(139,150,171,0.10)', border: '1px solid rgba(139,150,171,0.26)',
            }}>
              TRACKED
            </span>
          ) : (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.52rem', fontWeight: 900, letterSpacing: '0.08em',
              padding: '4px 10px', borderRadius: 7, color: '#06100a',
              background: `linear-gradient(180deg, ${B.goldHi} 0%, ${accent} 55%, ${accent}bb 100%)`,
              boxShadow: `0 8px 22px -10px ${accent}`,
            }}>
              <Lock size={8} strokeWidth={3} />
              LOCKED
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {f.pickLabel}
            <span style={{ fontSize: '0.8rem', color: C.textSec, fontWeight: 700, marginLeft: 8, fontFeatureSettings: "'tnum'" }}>
              {fmtOdds(f.lockOdds)}
            </span>
          </span>
          {Number.isFinite(f.clvPct) && (
            <span style={{
              fontSize: '0.52rem', fontWeight: 800, padding: '3px 7px',
              borderRadius: 6, background: `${clvColor}18`, color: clvColor,
              border: `1px solid ${clvColor}40`, fontFeatureSettings: "'tnum'",
            }}>
              CLV {clvGood ? '+' : ''}{f.clvPct.toFixed(1)}%
            </span>
          )}
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 800, fontFeatureSettings: "'tnum'", color: tracked ? C.textMuted : C.text }}>
            {tracked ? 'No ticket' : `${f.units.toFixed(1)}u`}
          </span>
          {!tracked && (
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: B.profit, fontFeatureSettings: "'tnum'" }}>
              +{f.toWin.toFixed(2)}u
            </span>
          )}
          <ChevronDown size={15} style={{ color: C.textMuted, flexShrink: 0 }} />
        </div>
      </div>
    );
  }
  const sortedWallets = [...f.wallets].sort((a, b) => (b.sizeRatio || 0) - (a.sizeRatio || 0));
  const maxRatio = sortedWallets[0]?.sizeRatio || 1;

  const winners = `${f.confirmedOnSide} proven ${f.sport} winner${f.confirmedOnSide === 1 ? '' : 's'}`;
  const clvLine = clvGood
    ? `The market moved our way. This ticket beats the close by ${f.clvPct.toFixed(1)}%.`
    : `The market has drifted ${Math.abs(f.clvPct).toFixed(1)}% against the lock.`;
  const verdict = tracked
    ? `Tracked at ${fmtOdds(f.lockOdds)} with ${winners} behind it. No stake on this one. We follow the price for context. ${clvLine}`
    : `Locked at ${fmtOdds(f.lockOdds)} with ${winners} behind it. ${clvLine}`;

  const zone = (i) => ({ className: 'pos-reveal', style: { animationDelay: `${i * 70}ms`, position: 'relative' } });

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0) 42%), linear-gradient(180deg, #161B29 0%, #10141F 55%, #0D111C 100%)',
      border: `1px solid ${tracked ? 'rgba(139,150,171,0.24)' : 'rgba(212,175,55,0.30)'}`, position: 'relative',
      boxShadow: '0 24px 60px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05)',
    }}>
      <CardStyles />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(130% 60% at 50% -15%, ${accent}1e 0%, transparent 52%),
          radial-gradient(60% 30% at 85% 8%, rgba(255,255,255,0.04) 0%, transparent 55%)
        `,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: '12%', right: '12%', height: 1.5, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.85,
      }} />

      {/* ── THE TICKET (frozen) ── */}
      <div {...zone(0)}>
        <div style={{ padding: '22px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textMuted }}>
              {f.sport}
              <span style={{ color: C.textFaint, marginLeft: 9 }}>{f.away} @ {f.home}</span>
              <span style={{ color: C.textFaint, marginLeft: 9 }}>{f.gameTime}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {tracked ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.08em',
                  padding: '5px 12px', borderRadius: 8, color: '#aeb8cb',
                  background: 'rgba(139,150,171,0.10)', border: '1px solid rgba(139,150,171,0.26)',
                }}>
                  TRACKED
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.08em',
                  padding: '5px 12px', borderRadius: 8, color: '#06100a',
                  background: `linear-gradient(180deg, ${B.goldHi} 0%, ${accent} 55%, ${accent}bb 100%)`,
                  boxShadow: `0 10px 28px -10px ${accent}, inset 0 1px 0 rgba(255,255,255,0.4)`,
                }}>
                  <Lock size={9} strokeWidth={3} />
                  LOCKED
                </span>
              )}
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Collapse"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 24, height: 24, borderRadius: '50%', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.hair}`,
                  color: C.textMuted, padding: 0,
                }}
              >
                <ChevronDown size={13} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 10 }}>
                {f.pickLabel}
                <span style={{ fontSize: '0.88rem', color: C.textSec, fontWeight: 700, marginLeft: 9, fontFeatureSettings: "'tnum'" }}>
                  {fmtOdds(f.lockOdds)}
                </span>
                <span style={{
                  fontSize: '0.55rem', fontWeight: 800, marginLeft: 9, padding: '3px 8px',
                  borderRadius: 6, background: `${clvColor}18`, color: clvColor,
                  border: `1px solid ${clvColor}40`, fontFeatureSettings: "'tnum'",
                }}>
                  CLV {clvGood ? '+' : ''}{f.clvPct.toFixed(1)}%
                </span>
              </div>
              {tracked ? (
                <div>
                  <div style={{
                    fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1,
                    fontFeatureSettings: "'tnum'", color: C.textSec,
                  }}>
                    No ticket
                  </div>
                  <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 8 }}>
                    tracked {f.lockedAt} · {f.book}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{
                    fontSize: '3.7rem', fontWeight: 800, letterSpacing: '-0.065em', lineHeight: 0.88,
                    fontFeatureSettings: "'tnum'",
                    filter: `drop-shadow(0 0 26px ${accent}45)`,
                  }}>
                    <span style={{
                      background: 'linear-gradient(180deg, #ffffff 12%, #b9c6dc 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      {riskAnim.toFixed(1)}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: C.textMuted, marginLeft: 5 }}>u</span>
                  </div>
                  <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 8 }}>
                    locked {f.lockedAt} · {f.book}
                  </div>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ textAlign: 'right', paddingBottom: 5 }}>
              <div style={{
                fontSize: '1.2rem', fontWeight: 800, color: tracked ? C.textMuted : B.profit,
                fontFeatureSettings: "'tnum'", letterSpacing: '-0.03em',
              }}>
                {tracked ? '—' : `+${f.toWin.toFixed(2)}u`}
              </div>
              <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 5, marginBottom: 10 }}>to win</div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700 }}>
                {tracked ? (
                  <span style={{ color: C.textMuted }}>Watching the price</span>
                ) : (
                  <>
                    <span style={{ color: C.textMuted }}>{f.stakePath}</span>
                    <span style={{ color: C.textFaint }}> · </span>
                    <span style={{ color: C.textSec }}>frozen at T-15</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <p style={{ margin: '16px 0 0', fontSize: '0.92rem', color: '#c6d0e2', lineHeight: 1.55, maxWidth: 460 }}>
            {verdict}
          </p>

          {/* Size story + lock-time checks, one compact strip (staked picks only) */}
          {!tracked && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.hairSoft}`,
              fontFeatureSettings: "'tnum'",
            }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: C.textSec }}>
                {f.pathBaseUnits.toFixed(1)}u base
                <span style={{ color: C.textFaint }}> → </span>
                <span style={{ color: f.tapeAction === 'boost' ? B.profit : f.tapeAction === 'mute' ? B.loss : C.textSec }}>
                  {f.tapeAction === 'boost' ? '×1.35 skill' : f.tapeAction === 'mute' ? 'pass' : 'hold'}
                </span>
                <span style={{ color: C.textFaint }}> → </span>
                <span style={{ color: '#fff', fontWeight: 800 }}>{f.units.toFixed(1)}u</span>
              </span>
              {Number.isFinite(f.setupHitRate) && (
                <span style={{ fontSize: '0.6rem', color: C.textMuted }}>
                  setups like this hit <span style={{ color: f.setupHitRate >= 55 ? B.profit : C.textSec, fontWeight: 800 }}>{f.setupHitRate}%</span>
                </span>
              )}
            </div>
          )}
          {f.lockChecks && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {f.lockChecks.map((c) => (
                <span key={c} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: '0.55rem', fontWeight: 700, color: C.textSec,
                  padding: '4px 9px', borderRadius: 7,
                  background: 'rgba(47,213,126,0.07)', border: '1px solid rgba(47,213,126,0.22)',
                }}>
                  <Check size={9} strokeWidth={3.5} color={B.profit} />
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <TicketPerf />

      {/* ── PRICE JOURNEY ── */}
      <div {...zone(1)}>
        <div style={{ padding: '20px 20px 18px' }}>
          <ZoneHead accent={accent} right={(
            <span style={{ fontSize: '0.58rem', fontWeight: 800, color: clvColor }}>
              {clvGood ? 'beating the close' : 'behind the close'}
            </span>
          )}>
            PRICE JOURNEY
          </ZoneHead>

          {hasJourney && (
            <HeroChart points={journeySeries} color={clvColor} h={64} gid={`locked-${f.id}`} />
          )}

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginTop: 4, position: 'relative', padding: '0 6px',
          }}>
            <div style={{
              position: 'absolute', left: 36, right: 36, top: 46, height: 1,
              background: `linear-gradient(90deg, ${accent}66, ${clvColor}66)`,
            }} />
            <JourneyStop label={tracked ? 'Flagged' : 'Locked'} time={f.lockedAt} odds={f.lockOdds} color={accent} active />
            <JourneyStop label="Peak" time={f.peakAt} odds={f.peakOdds} color={C.textMuted} />
            <JourneyStop label="Now" time="live" odds={f.nowOdds} color={clvColor} active />
          </div>

          <p style={{ fontSize: '0.64rem', color: C.textMuted, lineHeight: 1.5, margin: '14px 0 0' }}>
            We {tracked ? 'flagged' : 'locked'} {fmtOdds(f.lockOdds)}. The sharp book now sits at {fmtOdds(f.nowOdds)}.
            {clvGood ? ' Anyone betting now gets a worse price.' : ' The price has moved since then.'}
          </p>
        </div>
      </div>

      <ZoneRule />

      {/* ── THE RECEIPTS ── */}
      <div {...zone(2)}>
        <div style={{ padding: '20px 20px 12px' }}>
          <ZoneHead accent={accent} right={(
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: B.profit, fontFeatureSettings: "'tnum'" }}>
              {fmtMoney(f.sideInvested)} at lock
            </span>
          )}>
            THE RECEIPTS
          </ZoneHead>
          {sortedWallets.slice(0, 3).map((w, i, arr) => (
            <ConvictionRow key={w.short} w={w} accent={accent} maxRatio={maxRatio} last={i === arr.length - 1} />
          ))}
        </div>
      </div>

      <TicketPerf />

      {/* ── SHARE STUB — serial, barcode, record, brand ── */}
      <div style={{ position: 'relative', padding: '6px 20px 20px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
        }}>
          <div>
            <div style={{ fontSize: '0.46rem', fontWeight: 800, letterSpacing: '0.14em', color: C.textFaint, marginBottom: 4 }}>
              PICK N°
            </div>
            <div style={{ fontFamily: MONO, fontSize: '0.68rem', fontWeight: 700, color: C.textSec, letterSpacing: '0.06em' }}>
              {f.serial}
            </div>
          </div>
          {f.record30d && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.46rem', fontWeight: 800, letterSpacing: '0.14em', color: C.textFaint, marginBottom: 4 }}>
                {f.record30d.scope.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, fontFeatureSettings: "'tnum'" }}>
                {f.record30d.record}
                <span style={{ color: B.profit, marginLeft: 7 }}>{f.record30d.units}</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <TicketBarcode serial={f.serial} />
          <span style={{ flex: 1 }} />
          {!tracked && (
            <button
              type="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                padding: '9px 16px', borderRadius: 10,
                fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.02em',
                color: '#06100a',
                background: `linear-gradient(180deg, ${B.goldHi} 0%, ${B.gold} 55%, ${B.gold}bb 100%)`,
                border: 'none',
                boxShadow: `0 12px 30px -12px ${B.gold}, inset 0 1px 0 rgba(255,255,255,0.4)`,
              }}
            >
              Share ticket ↗
            </button>
          )}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.hairSoft}`,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: B.gold, boxShadow: `0 0 8px ${B.gold}`,
            }} />
            <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.24em', color: C.textMuted }}>
              NHL SAVANT · SHARP FLOW
            </span>
          </span>
          <span style={{ fontSize: '0.52rem', color: C.textFaint, fontFeatureSettings: "'tnum'" }}>
            game time {f.gameTime}
          </span>
        </div>
      </div>
    </div>
  );
}
