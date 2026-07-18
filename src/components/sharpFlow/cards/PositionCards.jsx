/**
 * Sharp Flow position cards — Live + Locked presentation views.
 * Ported from LivePositionCardLab (v12 battle / locked slip).
 * Pure UI: expects a normalized fixture `f`. Adapters map production data.
 */
import { useState, useEffect } from 'react';
import { Check, Lock, ChevronDown, Clock, X } from 'lucide-react';
import { AGS_V12_DISPLAY_TIERS, AGS_V12_PATH_TO_DISPLAY } from '../../../lib/ags.js';

/** Ticket freezes 15 min before first pitch/kick — same gate as the cron. */
const LOCK_LEAD_MS = 15 * 60 * 1000;

function formatLockCountdown(ms) {
  if (ms <= 0) return null;
  const h = Math.floor(ms / 36e5);
  const m = Math.floor((ms % 36e5) / 6e4);
  const s = Math.floor((ms % 6e4) / 1e3);
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (ms >= 10 * 60 * 1000) return `${m}m`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Same 5-band labels as the Tier Performance scoreboard (MAX / TOP / SHARP / STRONG / LEAN). */
function displayTierFromPath(stakePath) {
  const key = AGS_V12_PATH_TO_DISPLAY[stakePath];
  if (!key) return null;
  return AGS_V12_DISPLAY_TIERS.find((d) => d.key === key) || null;
}

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

// Locked-ticket header stub — when we actually hold a position, the card
// leads with a real betslip instead of a lone number: dashed perforation +
// punched notches read "ticket" instantly, and RISK / TO WIN / PRICE are the
// three numbers a bettor checks first. NOTE: the clipped-gradient number uses
// backgroundImage (NOT the `background` shorthand) — updating the shorthand
// resets background-clip to border-box while React leaves the unchanged
// WebkitBackgroundClip prop alone, which painted the gradient as a solid
// block when the market rail swapped fixtures in place.
function TicketStub({ units, toWin, odds, stakePath, tapeAction, centsEdge, commenceMs, outcome, profit }) {
  const risk = useCountUp(units, true, 900);
  // Product tier (LEAN / STRONG / …) — same labels as the scoreboard. Internal
  // path names (DISSENT, RANK, MINI-) and tape sizing ("Standard") stay out of
  // this header so users aren't taught two vocabularies for one ticket.
  const tier = displayTierFromPath(stakePath);
  const tierLabel = tier?.label || stakePath || 'PLAY';
  const tierColor = tier?.color || B.gold;
  const tapeNote = tapeAction === 'boost' ? ' · Sized up' : tapeAction === 'mute' ? ' · Pass' : '';
  const cellLabel = { fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.13em', color: C.textMuted, marginBottom: 4 };
  const graded = outcome === 'WIN' || outcome === 'LOSS' || outcome === 'PUSH';
  const isWin = outcome === 'WIN';
  const isPush = outcome === 'PUSH';
  const resultColor = isPush ? C.textSec : isWin ? B.profit : B.loss;
  const resultProfit = Number.isFinite(profit) ? profit : (isWin ? toWin : isPush ? 0 : -units);

  // Ticket is provisional until T-15; cron freezes units/path/side then.
  const lockEpoch = Number.isFinite(commenceMs) ? commenceMs - LOCK_LEAD_MS : null;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (graded || lockEpoch == null || Date.now() >= lockEpoch) return undefined;
    const fast = lockEpoch - Date.now() < 10 * 60 * 1000;
    const id = setInterval(() => setNow(Date.now()), fast ? 1000 : 30000);
    return () => clearInterval(id);
  }, [lockEpoch, graded]);
  const isFrozen = graded || (lockEpoch != null && now >= lockEpoch);
  const remLabel = !graded && !isFrozen && lockEpoch != null ? formatLockCountdown(lockEpoch - now) : null;
  const accentBorder = graded
    ? (isPush ? 'rgba(148,163,184,0.35)' : isWin ? 'rgba(47,213,126,0.45)' : 'rgba(239,68,68,0.45)')
    : 'rgba(212,175,55,0.32)';
  const accentWash = graded
    ? (isPush
      ? 'linear-gradient(160deg, rgba(148,163,184,0.10) 0%, rgba(148,163,184,0.03) 42%, rgba(255,255,255,0.015) 100%)'
      : isWin
        ? 'linear-gradient(160deg, rgba(47,213,126,0.12) 0%, rgba(47,213,126,0.04) 42%, rgba(255,255,255,0.015) 100%)'
        : 'linear-gradient(160deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.04) 42%, rgba(255,255,255,0.015) 100%)')
    : 'linear-gradient(160deg, rgba(212,175,55,0.11) 0%, rgba(212,175,55,0.04) 42%, rgba(255,255,255,0.015) 100%)';

  return (
    <div style={{
      marginTop: 8, borderRadius: 12, position: 'relative',
      background: accentWash,
      border: `1px solid ${accentBorder}`,
      boxShadow: graded
        ? `inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 40px -22px ${resultColor}66`
        : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 40px -22px rgba(212,175,55,0.5)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1.5,
        background: `linear-gradient(90deg, transparent, ${graded ? resultColor : B.gold}88, transparent)`, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        padding: '7px 14px', borderBottom: `1px dashed ${graded ? `${resultColor}44` : 'rgba(212,175,55,0.28)'}`,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.56rem', fontWeight: 900, letterSpacing: '0.14em', color: graded ? resultColor : isFrozen ? B.profit : B.goldHi, flexShrink: 0 }}>
          {graded
            ? (isWin ? <Check size={11} strokeWidth={3} /> : isPush ? <Lock size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />)
            : (isFrozen ? <Lock size={11} strokeWidth={3} /> : <Clock size={11} strokeWidth={2.8} />)}
          {graded ? (isWin ? 'WIN' : isPush ? 'PUSH' : 'LOSS') : isFrozen ? 'LOCKED' : 'OPEN TICKET'}
        </span>
        {/* countdown lives in the header row — one row, not two */}
        {graded ? (
          <span style={{ fontSize: '0.56rem', fontWeight: 700, color: resultColor, minWidth: 0 }}>
            graded
          </span>
        ) : lockEpoch != null && (
          isFrozen ? (
            <span style={{ fontSize: '0.56rem', fontWeight: 700, color: B.profit, minWidth: 0 }}>
              frozen at T-15
            </span>
          ) : (
            <span
              title="Stake, path, and side can still change until T-15"
              style={{ display: 'inline-flex', alignItems: 'baseline', gap: 5, minWidth: 0, fontFeatureSettings: "'tnum'" }}
            >
              <span style={{ fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.12em', color: B.goldHi }}>
                LOCKS
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, letterSpacing: '-0.02em', color: C.text }}>
                {remLabel || '—'}
              </span>
            </span>
          )
        )}
        <span style={{
          fontSize: '0.56rem', fontWeight: 900, letterSpacing: '0.12em',
          color: tierColor, flexShrink: 0,
          padding: '3px 8px', borderRadius: 6,
          background: `${tierColor}18`, border: `1px solid ${tierColor}44`,
        }}>
          {tierLabel}{tapeNote}
        </span>
        {/* punched notches on the perforation line */}
        <span style={{ position: 'absolute', left: -6, bottom: -6, width: 11, height: 11, borderRadius: '50%', background: '#12172a', border: `1px solid ${graded ? `${resultColor}55` : 'rgba(212,175,55,0.30)'}` }} />
        <span style={{ position: 'absolute', right: -6, bottom: -6, width: 11, height: 11, borderRadius: '50%', background: '#12172a', border: `1px solid ${graded ? `${resultColor}55` : 'rgba(212,175,55,0.30)'}` }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flex: 1.15, padding: '8px 14px 10px' }}>
          <div style={cellLabel}>RISK</div>
          <div style={{
            fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95,
            fontFeatureSettings: "'tnum'",
          }}>
            <span style={{
              backgroundImage: `linear-gradient(180deg, #ffffff 10%, ${B.goldHi} 95%)`,
              backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {risk.toFixed(1)}
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.textMuted, marginLeft: 3 }}>u</span>
          </div>
        </div>
        <div style={{ width: 1, background: graded ? `${resultColor}33` : 'rgba(212,175,55,0.16)', margin: '8px 0' }} />
        <div style={{ flex: 1, padding: '8px 14px 10px' }}>
          <div style={cellLabel}>{graded ? 'RESULT' : 'TO WIN'}</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: graded ? resultColor : B.profit, fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {graded
              ? `${resultProfit >= 0 ? '+' : ''}${Number(resultProfit).toFixed(2)}u`
              : (Number.isFinite(toWin) ? `+${toWin.toFixed(2)}u` : '—')}
          </div>
        </div>
        <div style={{ width: 1, background: graded ? `${resultColor}33` : 'rgba(212,175,55,0.16)', margin: '8px 0' }} />
        <div style={{ flex: 1, padding: '8px 14px 10px' }}>
          <div style={cellLabel}>PRICE</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: C.text, fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {fmtOdds(odds)}
          </div>
          {centsEdge && (
            <div style={{ fontSize: '0.55rem', fontWeight: 700, color: B.profit, marginTop: 2 }}>{centsEdge}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Compact WIN / LOSS / PUSH pill for graded locked cards. */
function GradedResultPill({ outcome, profit, units, toWin, compact }) {
  const isWin = outcome === 'WIN';
  const isPush = outcome === 'PUSH';
  const color = isPush ? C.textSec : isWin ? B.profit : B.loss;
  const pnl = Number.isFinite(profit) ? profit : (isWin ? toWin : isPush ? 0 : -(units || 0));
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: compact ? '0.52rem' : '0.58rem', fontWeight: 900, letterSpacing: '0.06em',
      padding: compact ? '4px 9px' : '5px 11px', borderRadius: 7, color,
      background: `${color}18`, border: `1px solid ${color}50`,
      fontFeatureSettings: "'tnum'",
    }}>
      {isWin ? <Check size={compact ? 10 : 11} strokeWidth={3} /> : isPush ? null : <X size={compact ? 10 : 11} strokeWidth={3} />}
      {isWin ? 'WIN' : isPush ? 'PUSH' : 'LOSS'}
      <span style={{ fontWeight: 800, opacity: 0.95 }}>
        {`${pnl >= 0 ? '+' : ''}${Number(pnl).toFixed(2)}u`}
      </span>
    </span>
  );
}

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
  // playIsHome null/undefined = draw (or no 2-way play side): light the
  // numeric winner neutrally — never claim away/home is "ours".
  const hasPlaySide = playIsHome === true || playIsHome === false;
  const oursWins = hasPlaySide && (homeWins === playIsHome);
  const winValColor = oursWins ? accent : C.text;
  const winColor = hasPlaySide ? accent : 'rgba(212,175,55,0.75)';
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

/** Facing team columns above the battle rows — money is the scoreboard.
 *  SOC draw boards get a 3-column layout (away · DRAW · home). */
function BattleHeader({ f, accent }) {
  const empty = { invested: 0, sharps: 0, pnl: 0 };
  const hasDraw = !!(f.sides?.draw) || f.side === 'draw';
  const cols = hasDraw
    ? [
      { key: 'away', code: f.awayShort, s: f.sides.away || empty, align: 'left' },
      { key: 'draw', code: 'DRAW', s: f.sides.draw || empty, align: 'center' },
      { key: 'home', code: f.homeShort, s: f.sides.home || empty, align: 'right' },
    ]
    : [
      { key: 'away', code: f.awayShort, s: f.sides.away || empty, align: 'left' },
      { key: 'home', code: f.homeShort, s: f.sides.home || empty, align: 'right' },
    ];
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: hasDraw ? 6 : 10, marginBottom: 6, position: 'relative' }}>
      {cols.map((c) => {
        const ours = f.side === c.key;
        const align = c.align;
        return (
          <div key={c.key} style={{
            flex: ours ? 1.2 : 1, textAlign: align,
            padding: ours ? '14px 12px 12px' : '12px 10px 10px',
            borderRadius: 16, position: 'relative', overflow: 'hidden',
            background: ours
              ? `linear-gradient(${align === 'left' ? '135deg' : align === 'right' ? '225deg' : '180deg'}, ${accent}28 0%, rgba(0,0,0,0.25) 70%)`
              : 'rgba(255,255,255,0.015)',
            border: `1px solid ${ours ? `${accent}60` : C.hairSoft}`,
            boxShadow: ours
              ? `0 18px 44px -22px ${accent}aa, 0 0 0 1px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.1)`
              : 'inset 0 1px 0 rgba(255,255,255,0.03)',
            opacity: ours ? 1 : 0.82,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
              justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
              flexDirection: align === 'right' ? 'row-reverse' : 'row',
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
              fontSize: ours ? (hasDraw ? '1.55rem' : '1.9rem') : (hasDraw ? '1.25rem' : '1.5rem'),
              fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
              fontFeatureSettings: "'tnum'", color: ours ? C.text : C.textMuted,
              textShadow: ours ? `0 0 34px ${accent}70` : 'none',
            }}>
              {fmtMoney(c.s.invested)}
            </div>
            <div style={{ fontSize: hasDraw ? '0.56rem' : '0.64rem', color: ours ? C.textSec : C.textFaint, marginTop: 5 }}>
              {c.s.sharps} proven · +{fmtMoney(c.s.pnl)} life
            </div>
          </div>
        );
      })}
      {!hasDraw && (
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          alignSelf: 'center', width: 28, height: 28, borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 30%, #1a2030 0%, #05070c 75%)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 6px 18px -4px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.45rem', fontWeight: 900, color: C.textSec, letterSpacing: '0.05em',
        }}>VS</div>
      )}
    </div>
  );
}

/** Human label for the card's play side (team short, Over/Under, or Draw). */
function playSideLabel(f) {
  if (f.side === 'draw') return 'Draw';
  if (f.side === 'home') return f.homeShort;
  return f.awayShort;
}

/** true/false for home/away; null when play side is draw (no 2-way winner). */
function playIsHomeFlag(f) {
  if (f.side === 'home') return true;
  if (f.side === 'away') return false;
  return null;
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

function ConvictionRow({ w, accent, maxRatio, last, sport }) {
  const hasRatio = Number.isFinite(w.sizeRatio);
  const hasClv = Number.isFinite(w.priorClvPct);
  const roiDisp = Number.isFinite(w.roi) ? w.roi : w.dollarRoi;
  const ratioColor = w.sizeRatio >= 1.5 ? B.profit : w.sizeRatio >= 1 ? accent : C.textMuted;
  const barPct = hasRatio ? Math.min(100, Math.max(3, (w.sizeRatio / Math.max(maxRatio, 1.01)) * 100)) : 0;
  const hasRecord = !!w.record && w.record !== '—' && (w.decided == null || w.decided > 0);
  return (
    <div style={{
      padding: '12px 0',
      borderBottom: last ? 'none' : `1px solid ${C.hairSoft}`,
      borderLeft: w.proven ? `2px solid ${B.profit}` : '2px solid transparent',
      paddingLeft: 10, marginLeft: -2,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
          background: `hsl(${(parseInt(w.short, 16) || 0) % 360} 46% 62%)`,
          boxShadow: `0 0 8px hsl(${(parseInt(w.short, 16) || 0) % 360} 46% 62% / 0.6)`,
        }} />
        <span style={{ fontFamily: MONO, fontSize: '0.72rem', fontWeight: 700, color: C.text }}>…{w.short}</span>
        {w.proven ? (
          <span style={{
            fontSize: '0.54rem', fontWeight: 800, letterSpacing: '0.08em', color: B.profit,
            padding: '2px 6px', borderRadius: 4,
            background: 'rgba(47,213,126,0.12)', border: '1px solid rgba(47,213,126,0.28)',
          }}>PROVEN</span>
        ) : w.whitelisted ? (
          <span
            title="Whitelisted winner, but this ticket is under 0.10× their usual — not counted as proven for staking"
            style={{
              fontSize: '0.54rem', fontWeight: 800, letterSpacing: '0.08em', color: C.amber || '#d4a574',
              padding: '2px 6px', borderRadius: 4,
              background: 'rgba(212,175,55,0.10)', border: '1px solid rgba(212,175,55,0.28)',
            }}
          >LIGHT</span>
        ) : (
          <span style={{
            fontSize: '0.54rem', fontWeight: 700, letterSpacing: '0.08em', color: C.textMuted,
            padding: '2px 6px', borderRadius: 4,
            background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.18)',
          }}>TRACKING</span>
        )}
        <span style={{ flex: 1 }} />
        <span style={{
          fontSize: '0.92rem', fontWeight: 800, fontFeatureSettings: "'tnum'",
          color: w.proven ? accent : C.text,
        }}>
          {fmtMoney(w.invested)}
        </span>
      </div>
      {/* Record is the product: W-L first for proven sharps */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 10px',
        marginBottom: (hasRatio || hasClv) ? 8 : 0, fontFeatureSettings: "'tnum'",
      }}>
        {hasRecord ? (
          <>
            <span style={{ fontSize: '0.88rem', fontWeight: 900, color: C.text }}>{w.record}</span>
            {Number.isFinite(w.wr) && (
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: C.textSec }}>{w.wr}% W</span>
            )}
            {Number.isFinite(roiDisp) && (
              <span style={{
                fontSize: '0.68rem', fontWeight: 800,
                color: roiDisp >= 0 ? B.profit : B.loss,
              }}>
                {roiDisp >= 0 ? '+' : ''}{roiDisp}% ROI
              </span>
            )}
            {sport && (
              <span style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.06em', color: C.textFaint }}>
                {String(sport).toUpperCase()} record
              </span>
            )}
          </>
        ) : (
          Number.isFinite(roiDisp) && (
            <span style={{
              fontSize: '0.72rem', fontWeight: 800,
              color: roiDisp >= 0 ? B.profit : B.loss,
            }}>
              {roiDisp >= 0 ? '+' : ''}{roiDisp}% ROI
            </span>
          )
        )}
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
              }} title={Number.isFinite(w.avgSportBet) ? `usual ${fmtMoney(w.avgSportBet)}` : undefined}>
                {fmtRatio(w.sizeRatio)}× usual
              </span>
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
  const playSide = playSideLabel(f);
  const oppSide = f.side === 'draw' ? `${f.awayShort}/${f.homeShort}`
    : f.side === 'home' ? f.awayShort : f.homeShort;

  const keyOf = (p) => `${p.side}-${p.short}`;
  const defaultSel = (() => {
    const ours = pts.filter((p) => p.side === f.side);
    const pool = ours.length ? ours : pts;
    const top = [...pool].sort((a, b) => (b.sizeRatio || 0) - (a.sizeRatio || 0))[0];
    return top ? keyOf(top) : null;
  })();
  const [sel, setSel] = useState(defaultSel);
  const selected = pts.find((p) => keyOf(p) === sel) || pts[0];

  // 440-wide viewBox keeps SVG text readable when the card scales down to
  // a ~340px phone column (0.77x) instead of the 0.6x a 560 box would get.
  const W = 440;
  const H = 350;
  const pad = { t: 24, r: 18, b: 36, l: 42 };
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
    return 8 + t * 14;
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
          const k = keyOf(p);
          const isSel = k === sel;
          return (
            <g key={k} onClick={() => setSel(k)} style={{ cursor: 'pointer' }}>
              {/* invisible expanded hit area — finger-sized taps on mobile */}
              <circle cx={cx} cy={cy} r={Math.max(r + 8, 18)} fill="transparent" />
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
        display: 'flex', flexWrap: 'wrap', gap: '4px 12px', alignItems: 'center',
        padding: '6px 0 10px', fontSize: '0.6rem', color: C.textMuted, lineHeight: 1.5,
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
          {/* auto-fit grid: 4-up on desktop, wraps to 2×2 on narrow phones */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(76px, 1fr))',
            gap: '10px 8px', fontFeatureSettings: "'tnum'",
          }}>
            {[
              { label: 'BEATS CLOSE', val: `${selected.priorClvPct}%`, hot: selected.priorClvPct >= X_BREAK },
              { label: 'ROI', val: `${roiOf(selected) >= 0 ? '+' : ''}${roiOf(selected)}%`, hot: roiOf(selected) >= 0 },
              ...(Number.isFinite(selected.sizeRatio)
                ? [{
                  label: '× USUAL',
                  val: `${fmtRatio(selected.sizeRatio)}×`,
                  hot: selected.sizeRatio >= 1.5,
                  sub: Number.isFinite(selected.avgSportBet) ? `of ${fmtMoney(selected.avgSportBet)}` : null,
                }]
                : []),
              { label: 'THIS TICKET', val: fmtMoney(selected.invested) },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: '0.44rem', color: C.textFaint, letterSpacing: '0.1em', marginBottom: 3, whiteSpace: 'nowrap' }}>{s.label}</div>
                <div style={{
                  fontSize: '0.85rem', fontWeight: 800, letterSpacing: '-0.02em',
                  color: s.hot ? accent : C.text,
                  textShadow: s.hot ? `0 0 16px ${accent}55` : 'none',
                }}>
                  {s.val}
                </div>
                {s.sub && (
                  <div style={{ fontSize: '0.48rem', color: C.textFaint, marginTop: 2, fontFeatureSettings: "'tnum'" }}>{s.sub}</div>
                )}
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
  const playSide = playSideLabel(f);
  const playIsHome = playIsHomeFlag(f);
  const isMuted = f.displayState === 'MUTED';
  const isWatch = f.units <= 0 && !isMuted;
  // The battle is the product. Watch cards keep the champagne accent so the
  // side-v-side money stays lit; only the state pill goes gray.
  const accent = isWatch ? B.gold : meta.color;
  const hasEdge = Number.isFinite(f.edge);
  const hasClv = Number.isFinite(f.netClv);
  const hasTape = Number.isFinite(f.tapeScore);
  // Quadrant map points: every sharp on the game (both sides when the
  // adapter provides them) that has a REAL beats-close % and ROI. No
  // invented coordinates — wallets missing either stat stay off the map.
  // gd.positions can carry multiple positions per wallet per side, so
  // dedupe by side+wallet keeping the largest ticket.
  const mapPts = (() => {
    const src = Array.isArray(f.mapWallets) && f.mapWallets.length
      ? f.mapWallets
      : f.wallets.map((w) => ({ ...w, side: w.side || f.side }));
    const best = new Map();
    for (const w of src) {
      if (!Number.isFinite(w.priorClvPct)) continue;
      if (!Number.isFinite(w.roi) && !Number.isFinite(w.dollarRoi)) continue;
      const k = `${w.side}-${w.short}`;
      const cur = best.get(k);
      if (!cur || (w.invested || 0) > (cur.invested || 0)) best.set(k, w);
    }
    return [...best.values()];
  })();
  // Show the map tab whenever we have plottable points (even one wallet).
  // Hide-only when there is truly nothing to plot — never disappear just
  // because the card flipped into a ticketed/LEAN state.
  const hasMapPts = mapPts.length >= 1;
  const [tab, setTab] = useState(hasMapPts ? 'map' : 'flow');
  // Market rail swaps `f` without remounting — if the new market has no
  // map data, fall back to Money flow instead of an empty panel.
  const activeTab = tab === 'map' && !hasMapPts ? 'flow' : tab;
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
  // Both sides must have proven wallets ON THE BOARD and a real %+CLV.
  // A cron-stamped AG mean alone is not enough — that painted phantom
  // "65%" on Mets with $0 / 0 proven.
  const showClvBattle = Number.isFinite(awayClv) && Number.isFinite(homeClv)
    && (f.sides.away?.sharps || 0) > 0 && (f.sides.home?.sharps || 0) > 0;
  const showClvTag = showClvBattle && hasClv;

  // Split verdict into a bold lead (the receipts) and a quieter action line
  // so the eye lands on the proof first. Staked tickets name the product tier
  // (LEAN / STRONG / …) — same words as the scoreboard — not path jargon.
  const productTier = displayTierFromPath(f.stakePath);
  const productTierLabel = productTier?.label || null;
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
    if (f.displayState === 'TRACKING') return { lead, rest: 'Watching with a light stake.' };
    if (productTierLabel) {
      if (f.tapeAction === 'boost') return { lead, rest: `We took a ${productTierLabel} and sized up.` };
      if (f.tapeAction === 'mute') return { lead, rest: `We took a ${productTierLabel}, then the skill read passed.` };
      return { lead, rest: `We took a ${productTierLabel}.` };
    }
    if (f.tapeAction === 'boost') return { lead, rest: `The skill read is strong, so we ${sizeWord}.` };
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

          {/* Hero call: pick + price + units + book share one baseline row —
              two stacked rows here cost ~30px per card for no extra info. */}
          <div style={{
            marginTop: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline',
            gap: '4px 12px', fontFeatureSettings: "'tnum'",
          }}>
            <span style={{
              fontSize: isWatch ? '1.4rem' : '1.5rem',
              fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1,
              color: C.text,
            }}>
              {f.pickLabel}
            </span>
            {Number.isFinite(f.odds) && (
              <span style={{
                fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: C.text,
              }}>
                {fmtOdds(f.odds)}
              </span>
            )}
            {!isWatch && f.units > 0 && (
              <span style={{
                fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.02em',
                color: B.goldHi,
              }}>
                {f.units.toFixed(1)}u
              </span>
            )}
            {f.book && (
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, color: C.textSec,
                padding: '2px 8px', borderRadius: 6, alignSelf: 'center',
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.hair}`,
              }}>
                {f.book}
              </span>
            )}
            {centsEdge && !isWatch && (
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: B.profit }}>
                {centsEdge}
              </span>
            )}
          </div>

          {(isWatch || f.units <= 0) && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 8 }}>
              {isWatch ? (
                <>
                  <div>
                    <div style={{
                      fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.95,
                      fontFeatureSettings: "'tnum'",
                      filter: `drop-shadow(0 0 22px ${accent}40)`,
                    }}>
                      {/* backgroundImage (not the `background` shorthand): updating the
                          shorthand resets background-clip to border-box while React
                          skips the unchanged WebkitBackgroundClip prop — that painted
                          this number as a solid block when the market rail swapped
                          fixtures without remounting. */}
                      <span style={{
                        backgroundImage: `linear-gradient(180deg, #ffffff 8%, ${B.goldHi} 96%)`,
                        backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      }}>
                        {fmtMoney(f.sideInvested)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 3 }}>
                      sharp money on <span style={{ color: accent, fontWeight: 800 }}>{playSide}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ textAlign: 'right', paddingBottom: 2, fontFeatureSettings: "'tnum'" }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: C.text }}>
                      <span style={{ fontSize: '1.05rem', letterSpacing: '-0.03em' }}>{f.confirmedOnSide}</span>
                      <span style={{ fontSize: '0.6rem', fontWeight: 600, color: C.textMuted, marginLeft: 5 }}>
                        proven winner{f.confirmedOnSide === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.58rem', fontWeight: 700, color: C.textMuted, marginTop: 2 }}>
                      no ticket yet
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div style={{
                    fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.95,
                    fontFeatureSettings: "'tnum'",
                  }}>
                    <span style={{
                      backgroundImage: `linear-gradient(180deg, ${B.loss} 12%, #7f1d1d 100%)`,
                      backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      0.0
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: C.textMuted, marginLeft: 5 }}>u</span>
                  </div>
                  <div style={{ fontSize: '0.6rem', color: C.textMuted, marginTop: 3 }}>
                    we passed
                  </div>
                </div>
              )}
            </div>
          )}

          {!isWatch && f.units > 0 && (
            <TicketStub
              units={f.units}
              toWin={f.toWin}
              odds={f.odds}
              stakePath={f.stakePath}
              tapeAction={f.tapeAction}
              centsEdge={centsEdge}
              commenceMs={f.commenceMs}
            />
          )}

          {!isWatch && f.units > 0 && <TierPerfStrip tierPerf={f.tierPerf} compact />}

          <p style={{ margin: '8px 0 0', fontSize: '0.85rem', lineHeight: 1.45, maxWidth: 460 }}>
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
              {Number.isFinite(f.flow.sharp?.[f.side]) ? f.flow.sharp[f.side] : f.sharpMoneyPct}% on {playSide}
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
                tag={showClvTag ? {
                  text: `${f.netClv > 0 ? '+' : ''}${Number(f.netClv).toFixed(1)}`,
                  color: f.netClv >= 0 ? B.profit : B.loss,
                } : null}
                awayVal={`${awayClv}%`}
                homeVal={`${homeClv}%`}
                awayNum={awayClv}
                homeNum={homeClv}
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
              <ConvictionRow key={w.short} w={w} accent={accent} maxRatio={maxRatio} last={i === arr.length - 1} sport={f.sport} />
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
              { id: 'map', label: 'Wallet map' },
              { id: 'flow', label: 'Money flow' },
              { id: 'history', label: 'Line history' },
              { id: 'wallets', label: 'Wallets' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '10px 2px', cursor: 'pointer', border: 'none',
                  background: 'transparent', fontSize: '0.64rem', fontWeight: 800,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  color: activeTab === t.id ? C.text : C.textMuted,
                  borderBottom: activeTab === t.id ? `2px solid ${accent}` : `1px solid ${C.hairSoft}`,
                  transition: 'color .18s ease, border-color .18s ease',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pos-reveal" key={activeTab}>
            {activeTab === 'map' && (
              hasMapPts ? (
                <WalletMapPanel f={f} accent={accent} pts={mapPts} />
              ) : (
                <p style={{ fontSize: '0.64rem', color: C.textMuted, lineHeight: 1.55, margin: '4px 0 8px' }}>
                  Wallet map needs proven wallets with a beats-close % and ROI on this board. None are plottable yet — check back as money comes in.
                </p>
              )
            )}

            {activeTab === 'history' && (
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

            {activeTab === 'flow' && (
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

            {activeTab === 'wallets' && (
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

/** Compact T-15 status for locked-list cards (open until freeze, then sealed). */
function LockFreezeStatus({ commenceMs, compact }) {
  const lockEpoch = Number.isFinite(commenceMs) ? commenceMs - LOCK_LEAD_MS : null;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (lockEpoch == null || Date.now() >= lockEpoch) return undefined;
    const fast = lockEpoch - Date.now() < 10 * 60 * 1000;
    const id = setInterval(() => setNow(Date.now()), fast ? 1000 : 30000);
    return () => clearInterval(id);
  }, [lockEpoch]);
  if (lockEpoch == null) return null;
  const frozen = now >= lockEpoch;
  const rem = formatLockCountdown(lockEpoch - now);
  if (compact) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.04em',
        padding: '4px 8px', borderRadius: 7,
        color: frozen ? B.profit : '#1a1408',
        background: frozen
          ? 'rgba(47,213,126,0.14)'
          : `linear-gradient(180deg, ${B.goldHi} 0%, ${B.gold} 100%)`,
        border: `1px solid ${frozen ? 'rgba(47,213,126,0.40)' : 'rgba(212,175,55,0.65)'}`,
        boxShadow: frozen ? 'none' : `0 6px 16px -8px ${B.gold}`,
        fontFeatureSettings: "'tnum'",
      }}>
        <Clock size={11} strokeWidth={2.8} />
        {frozen ? 'LOCKED' : `LOCKS ${rem}`}
      </span>
    );
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginTop: 12,
      padding: '10px 12px', borderRadius: 10,
      background: frozen
        ? 'rgba(47,213,126,0.10)'
        : 'linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.07) 100%)',
      border: `1px solid ${frozen ? 'rgba(47,213,126,0.35)' : 'rgba(212,175,55,0.50)'}`,
      fontFeatureSettings: "'tnum'",
    }}>
      <Clock size={16} strokeWidth={2.4} style={{ flexShrink: 0, color: frozen ? B.profit : B.goldHi }} />
      {frozen ? (
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 900, color: B.profit }}>FINAL TICKET</div>
          <div style={{ fontSize: '0.56rem', fontWeight: 600, color: C.textSec, marginTop: 2 }}>
            Frozen at T-15 — set for grading
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.14em', color: B.goldHi }}>LOCKS IN</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: C.text, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {rem || '—'}
          </div>
          <div style={{ fontSize: '0.56rem', fontWeight: 600, color: C.textSec, marginTop: 2 }}>
            Stake, path, and side can still change
          </div>
        </div>
      )}
    </div>
  );
}

function KeyReadCell({ label, value, color = C.text, sub }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textMuted, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        fontSize: '0.92rem', fontWeight: 800, color, letterSpacing: '-0.02em',
        fontFeatureSettings: "'tnum'", lineHeight: 1.15,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '0.52rem', color: C.textFaint, marginTop: 3, fontFeatureSettings: "'tnum'" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/** Display-tier L7/L30 strip — same buckets as the Tier Performance scoreboard. */
function TierPerfStrip({ tierPerf, compact }) {
  if (!tierPerf || !(tierPerf.n > 0) || tierPerf.wr == null) return null;
  const roi = tierPerf.roi;
  const roiColor = Number.isFinite(roi) ? (roi >= 0 ? B.profit : B.loss) : C.textMuted;
  const accent = tierPerf.color || B.gold;
  return (
    <div style={{
      marginTop: compact ? 8 : 12,
      padding: compact ? '8px 10px' : '10px 12px',
      borderRadius: 10,
      background: `linear-gradient(135deg, ${accent}14 0%, rgba(255,255,255,0.02) 100%)`,
      border: `1px solid ${accent}44`,
      fontFeatureSettings: "'tnum'",
    }}>
      {/* single row: label · record · WR · ROI · units, graded count at right */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 10px',
      }}>
        <span style={{
          fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.12em', color: accent,
          alignSelf: 'center',
        }}>
          {tierPerf.label} · {tierPerf.window}
        </span>
        <span style={{ fontSize: compact ? '0.9rem' : '1rem', fontWeight: 900, color: C.text }}>
          {tierPerf.record}
        </span>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: C.textSec }}>
          {tierPerf.wr}% W
        </span>
        {Number.isFinite(roi) && (
          <span style={{ fontSize: '0.74rem', fontWeight: 900, color: roiColor }}>
            {roi >= 0 ? '+' : ''}{roi}% ROI
          </span>
        )}
        {Number.isFinite(tierPerf.profitU) && (
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: C.textMuted }}>
            {tierPerf.profitU >= 0 ? '+' : ''}{tierPerf.profitU.toFixed(1)}u
          </span>
        )}
        <span style={{ fontSize: '0.5rem', fontWeight: 700, color: C.textFaint, marginLeft: 'auto', alignSelf: 'center' }}>
          {tierPerf.n} graded
        </span>
      </div>
    </div>
  );
}

export function LockedPositionCardView({ f, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const tracked = !(f.units > 0);
  const graded = !!(f.graded || f.outcome === 'WIN' || f.outcome === 'LOSS' || f.outcome === 'PUSH');
  const isWin = f.outcome === 'WIN';
  const isPush = f.outcome === 'PUSH';
  const resultColor = !graded ? null : isPush ? C.textSec : isWin ? B.profit : B.loss;
  const resultPnl = graded
    ? (Number.isFinite(f.profit) ? f.profit : (isWin ? f.toWin : isPush ? 0 : -(f.units || 0)))
    : null;
  // Champagne accents stay even on tracked picks; only the pill goes gray.
  // Graded tickets tint the accent to the result so the list reads at a glance.
  const accent = graded && resultColor ? resultColor : B.gold;
  const playSide = playSideLabel(f);
  const clvGood = f.clvPct >= 0;
  const clvColor = clvGood ? B.profit : B.loss;
  const productTier = displayTierFromPath(f.stakePath);
  const tierLabel = productTier?.label || null;
  const tierColor = productTier?.color || C.textMuted;
  // Journey chart through the three REAL price stops (lock → peak → now).
  const journeySeries = [f.lockOdds, f.peakOdds, f.nowOdds].filter(Number.isFinite);
  const hasJourney = journeySeries.length >= 2;
  const centsEdge = (() => {
    const got = f.gotOdds ?? f.lockOdds;
    const fair = f.fairLine ?? f.fairOdds;
    if (!Number.isFinite(got) || !Number.isFinite(fair)) return null;
    let diff = got - fair;
    if ((got > 0) !== (fair > 0)) diff -= Math.sign(diff) * 200;
    return diff;
  })();
  const cardBorder = tracked
    ? 'rgba(139,150,171,0.22)'
    : graded
      ? `${resultColor}55`
      : 'rgba(212,175,55,0.28)';

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
          border: `1px solid ${cardBorder}`,
          position: 'relative', padding: '14px 18px',
        }}
      >
        <CardStyles />
        <div style={{
          position: 'absolute', top: 0, left: '12%', right: '12%', height: 1.5, pointerEvents: 'none',
          background: `linear-gradient(90deg, transparent, ${tracked ? '#8b96ab' : accent}, transparent)`, opacity: 0.7,
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }}>
          <span style={{ fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.1em', color: C.textMuted, minWidth: 0 }}>
            {f.sport}
            <span style={{ color: C.textFaint, marginLeft: 8 }}>{f.away} @ {f.home}</span>
            <span style={{ color: C.textFaint, marginLeft: 8 }}>{f.gameTime}</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {!tracked && !graded && tierLabel && (
              <span style={{
                fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.1em',
                padding: '3px 7px', borderRadius: 6, color: tierColor,
                background: `${tierColor}18`, border: `1px solid ${tierColor}40`,
              }}>
                {tierLabel}
              </span>
            )}
            {tracked ? (
              <span style={{
                fontSize: '0.52rem', fontWeight: 900, letterSpacing: '0.08em',
                padding: '4px 10px', borderRadius: 7, color: '#aeb8cb',
                background: 'rgba(139,150,171,0.10)', border: '1px solid rgba(139,150,171,0.26)',
              }}>
                TRACKED
              </span>
            ) : graded ? (
              <GradedResultPill
                outcome={f.outcome}
                profit={f.profit}
                units={f.units}
                toWin={f.toWin}
                compact
              />
            ) : (
              <>
                <LockFreezeStatus commenceMs={f.commenceMs} compact />
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: '0.52rem', fontWeight: 900, letterSpacing: '0.08em',
                  padding: '4px 10px', borderRadius: 7, color: '#06100a',
                  background: `linear-gradient(180deg, ${B.goldHi} 0%, ${accent} 55%, ${accent}bb 100%)`,
                  boxShadow: `0 8px 22px -10px ${accent}`,
                }}>
                  <Lock size={8} strokeWidth={3} />
                  IN
                </span>
              </>
            )}
          </span>
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
            <span style={{
              fontSize: '0.72rem', fontWeight: 800, fontFeatureSettings: "'tnum'",
              color: graded ? resultColor : B.profit,
            }}>
              {graded
                ? `${resultPnl >= 0 ? '+' : ''}${Number(resultPnl).toFixed(2)}u`
                : `+${f.toWin.toFixed(2)}u`}
            </span>
          )}
          <ChevronDown size={15} style={{ color: C.textMuted, flexShrink: 0 }} />
        </div>
      </div>
    );
  }
  // Proven first (matches the count / badges), then conviction size.
  const sortedWallets = [...f.wallets].sort((a, b) =>
    (Number(!!b.proven) - Number(!!a.proven))
    || ((b.decided || 0) - (a.decided || 0))
    || ((b.sizeRatio || 0) - (a.sizeRatio || 0))
    || ((b.invested || 0) - (a.invested || 0))
  );
  const maxRatio = Math.max(...sortedWallets.map((w) => w.sizeRatio || 0), 1);
  const provenWallets = sortedWallets.filter((w) => w.proven);
  const provenCount = provenWallets.length > 0 ? provenWallets.length : (f.confirmedOnSide || 0);
  const provenWithRecord = provenWallets.filter((w) => w.record && w.record !== '—');
  const provenRecSummary = provenWithRecord
    .slice(0, 2)
    .map((w) => `${w.record}${Number.isFinite(w.wr) ? ` (${w.wr}% W)` : ''}`)
    .join(' · ');
  const provenRoiAvg = (() => {
    const rois = provenWallets.map((w) => w.roi).filter(Number.isFinite);
    if (!rois.length) return null;
    return Math.round(rois.reduce((s, v) => s + v, 0) / rois.length);
  })();

  const winners = `${provenCount} proven ${f.sport} winner${provenCount === 1 ? '' : 's'}`;
  const clvLine = Number.isFinite(f.clvPct)
    ? (clvGood
      ? `Market already moved our way (+${f.clvPct.toFixed(1)}% CLV).`
      : `Price has drifted ${Math.abs(f.clvPct).toFixed(1)}% against since flag.`)
    : '';
  const verdictLead = tracked
    ? `Watching ${playSide} at ${fmtOdds(f.lockOdds)} — ${winners} on the board.`
    : `${winners} on ${playSide}${provenRecSummary ? ` — ${provenRecSummary}` : ''}.`;
  const verdictRest = tracked
    ? `No stake — price only. ${clvLine}`
    : `We took a ${tierLabel || 'ticket'} at ${fmtOdds(f.lockOdds)}${Number.isFinite(provenRoiAvg) ? ` behind wallets averaging ${provenRoiAvg >= 0 ? '+' : ''}${provenRoiAvg}% ROI` : ''}. ${clvLine}`;

  // Why-this-play proof chips — only real signals that sell the ticket.
  const whyChips = [
    provenCount > 0 ? `${provenCount} proven ${f.sport} winner${provenCount === 1 ? '' : 's'}` : null,
    (f.sideInvested || 0) > 0
      ? `${fmtMoney(f.sideInvested)} sharp${Number.isFinite(f.moneyPct) && f.moneyPct >= 70 ? ` · ${Math.round(f.moneyPct)}% of board` : ''}`
      : null,
    Number.isFinite(f.clvPct) && clvGood ? `+${f.clvPct.toFixed(1)}% CLV` : null,
    Number.isFinite(centsEdge) && centsEdge > 0 ? `${Math.round(centsEdge)}¢ better than fair` : null,
    Number.isFinite(f.hcMargin) && f.hcMargin >= 1 ? `HC +${f.hcMargin}` : null,
    Number.isFinite(f.edge) && f.edge > 0 ? `EDGE +${f.edge.toFixed(1)}` : null,
    f.tierPerf?.wr != null
      ? `${f.tierPerf.label} ${f.tierPerf.window} ${f.tierPerf.wr}% W`
      : null,
  ].filter(Boolean);

  const keyReads = [
    Number.isFinite(f.gotOdds) || Number.isFinite(f.lockOdds)
      ? { label: 'WE GOT', value: fmtOdds(f.gotOdds ?? f.lockOdds), sub: f.book || null }
      : null,
    Number.isFinite(f.fairLine) || Number.isFinite(f.fairOdds)
      ? { label: 'FAIR LINE', value: fmtOdds(f.fairLine ?? f.fairOdds), sub: Number.isFinite(centsEdge) ? `${centsEdge > 0 ? '+' : ''}${Math.round(centsEdge)}¢ vs fair` : 'Pinnacle' }
      : null,
    Number.isFinite(f.clvPct)
      ? { label: 'CLV', value: `${clvGood ? '+' : ''}${f.clvPct.toFixed(1)}%`, color: clvColor, sub: clvGood ? 'beating close' : 'behind close' }
      : null,
    Number.isFinite(f.edge) && Math.abs(f.edge) >= 1
      ? { label: 'EDGE', value: `${f.edge >= 0 ? '+' : ''}${f.edge.toFixed(1)}`, color: f.edge >= 0 ? B.profit : B.loss, sub: 'winner align' }
      : null,
    Number.isFinite(f.hcMargin) && f.hcMargin !== 0
      ? { label: 'HC', value: `${f.hcMargin >= 0 ? '+' : ''}${f.hcMargin}`, sub: 'conviction margin' }
      : null,
    provenCount > 0
      ? { label: 'PROVEN', value: String(provenCount), sub: playSide }
      : null,
    (f.sideInvested || 0) > 0
      ? { label: 'SHARP $', value: fmtMoney(f.sideInvested), sub: Number.isFinite(f.moneyPct) ? `${Math.round(f.moneyPct)}% of board` : 'on our side' }
      : null,
  ].filter(Boolean);

  const zone = (i) => ({ className: 'pos-reveal', style: { animationDelay: `${i * 70}ms`, position: 'relative' } });

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0) 42%), linear-gradient(180deg, #161B29 0%, #10141F 55%, #0D111C 100%)',
      border: `1px solid ${tracked ? 'rgba(139,150,171,0.24)' : graded ? `${resultColor}55` : 'rgba(212,175,55,0.30)'}`, position: 'relative',
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

      {/* ── THE TICKET ── */}
      <div {...zone(0)}>
        <div style={{ padding: '14px 18px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em', color: C.textMuted, minWidth: 0 }}>
              {f.sport}
              <span style={{ color: C.textFaint, marginLeft: 9 }}>{f.away} @ {f.home}</span>
              <span style={{ color: C.textFaint, marginLeft: 9 }}>{f.gameTime}</span>
              {f.lockedAt && (
                <span style={{ color: C.textFaint, marginLeft: 9, letterSpacing: 0, fontWeight: 600 }}>
                  {tracked ? 'tracked' : 'flagged'} {f.lockedAt}
                </span>
              )}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {tracked ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.08em',
                  padding: '5px 12px', borderRadius: 8, color: '#aeb8cb',
                  background: 'rgba(139,150,171,0.10)', border: '1px solid rgba(139,150,171,0.26)',
                }}>
                  TRACKED
                </span>
              ) : graded ? (
                <GradedResultPill
                  outcome={f.outcome}
                  profit={f.profit}
                  units={f.units}
                  toWin={f.toWin}
                />
              ) : tierLabel ? (
                <span style={{
                  fontSize: '0.56rem', fontWeight: 900, letterSpacing: '0.12em',
                  padding: '5px 10px', borderRadius: 7, color: tierColor,
                  background: `${tierColor}18`, border: `1px solid ${tierColor}44`,
                }}>
                  {tierLabel}
                </span>
              ) : null}
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

          {/* Pick + price + units + book + CLV share one baseline row — the
              stacked layout cost ~40px of hero space per card. */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'baseline',
            gap: '4px 12px', marginBottom: 2, fontFeatureSettings: "'tnum'",
          }}>
            <span style={{
              fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1,
            }}>
              {f.pickLabel}
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>{fmtOdds(f.lockOdds)}</span>
            {!tracked && f.units > 0 && (
              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: B.goldHi }}>
                {f.units.toFixed(1)}u
              </span>
            )}
            {f.book && (
              <span style={{
                fontSize: '0.66rem', fontWeight: 700, color: C.textSec,
                padding: '2px 8px', borderRadius: 6, alignSelf: 'center',
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.hair}`,
              }}>
                {f.book}
              </span>
            )}
            {Number.isFinite(f.clvPct) && (
              <span style={{
                fontSize: '0.58rem', fontWeight: 800, padding: '2px 8px',
                borderRadius: 6, alignSelf: 'center',
                background: `${clvColor}18`, color: clvColor,
                border: `1px solid ${clvColor}40`,
              }}>
                CLV {clvGood ? '+' : ''}{f.clvPct.toFixed(1)}%
              </span>
            )}
          </div>

          {!tracked ? (
            <TicketStub
              units={f.units}
              toWin={f.toWin}
              odds={f.lockOdds}
              stakePath={f.stakePath}
              tapeAction={f.tapeAction}
              centsEdge={Number.isFinite(centsEdge) && centsEdge > 0 ? `${Math.round(centsEdge)}¢ better than fair` : null}
              commenceMs={f.commenceMs}
              outcome={f.outcome}
              profit={f.profit}
            />
          ) : (
            <div style={{
              marginTop: 8, padding: '10px 14px', borderRadius: 12,
              display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
              background: 'rgba(139,150,171,0.06)', border: '1px solid rgba(139,150,171,0.22)',
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: C.textSec }}>No ticket</span>
              <span style={{ fontSize: '0.6rem', color: C.textMuted }}>Watching for context — 0u staked</span>
              <span style={{ marginLeft: 'auto', alignSelf: 'center' }}>
                <LockFreezeStatus commenceMs={f.commenceMs} compact />
              </span>
            </div>
          )}

          {/* WHY THIS PLAY — the premium thesis */}
          <div style={{ marginTop: 12 }}>
            <div style={{
              fontSize: '0.52rem', fontWeight: 900, letterSpacing: '0.16em',
              color: B.goldHi, marginBottom: 6,
            }}>
              WHY THIS PLAY
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: C.text, lineHeight: 1.45, fontWeight: 700 }}>
              {verdictLead}
            </p>
            <p style={{ margin: '5px 0 0', fontSize: '0.78rem', color: '#9fabc2', lineHeight: 1.45 }}>
              {verdictRest}
            </p>
            {whyChips.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {whyChips.map((c) => (
                  <span key={c} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: '0.58rem', fontWeight: 700, color: C.text,
                    padding: '5px 10px', borderRadius: 7,
                    background: 'rgba(47,213,126,0.08)', border: '1px solid rgba(47,213,126,0.28)',
                  }}>
                    <Check size={10} strokeWidth={3.5} color={B.profit} />
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          {keyReads.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(88px, 1fr))',
              gap: '10px 12px',
              marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.hairSoft}`,
            }}>
              {keyReads.map((r) => (
                <KeyReadCell key={r.label} label={r.label} value={r.value} color={r.color} sub={r.sub} />
              ))}
            </div>
          )}

          {!tracked && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 10, fontFeatureSettings: "'tnum'",
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

          {!tracked && <TierPerfStrip tierPerf={f.tierPerf} compact />}
        </div>
      </div>

      <TicketPerf />

      {/* ── THE RECEIPTS — proof before price ── */}
      <div {...zone(1)}>
        <div style={{ padding: '20px 20px 12px' }}>
          <ZoneHead accent={accent} right={(
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: B.profit, fontFeatureSettings: "'tnum'" }}>
              {provenCount > 0
                ? <><span style={{ color: B.profit }}>{provenCount} proven</span>
                  <span style={{ color: C.textFaint }}> · </span></>
                : null}
              {fmtMoney(f.sideInvested)} at lock
            </span>
          )}>
            THE RECEIPTS
          </ZoneHead>
          <p style={{
            margin: '0 0 10px', fontSize: '0.68rem', color: C.textSec, lineHeight: 1.45,
          }}>
            {provenCount > 0
              ? `These are the ${f.sport} winners behind the ticket — real records, real size.`
              : 'Wallets on this side at lock. Proven winners earn the badge.'}
          </p>
          {sortedWallets.slice(0, Math.max(provenWallets.length, 4)).map((w, i, arr) => (
            <ConvictionRow
              key={w.short}
              w={w}
              accent={accent}
              maxRatio={maxRatio}
              last={i === arr.length - 1}
              sport={f.sport}
            />
          ))}
        </div>
      </div>

      <ZoneRule />

      {/* ── PRICE JOURNEY ── */}
      <div {...zone(2)}>
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

      <TicketPerf />

      {/* ── FOOTER — serial + brand (no share) ── */}
      <div style={{ position: 'relative', padding: '6px 20px 18px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12,
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
        <TicketBarcode serial={f.serial} />
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.hairSoft}`,
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
