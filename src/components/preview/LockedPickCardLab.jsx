/**
 * LockedPickCardLab — premium collapsed list-row + expanded one-stop sheet
 * for the AGSU V12 locked-pick card.  Open at  #/card-lab .
 *
 * Self-contained (no Firebase / SharpFlow imports). Renders a real slate of
 * locked picks: each row is scannable, and tapping it opens a premium detail
 * sheet with every critical number in one place. Once approved, this markup
 * ports into LockedPickCard in src/pages/SharpFlow.jsx (same data shape).
 */
import { useState, useEffect } from 'react';
import { Lock, TrendingUp, Check, X, ShieldCheck, ChevronDown, Sparkles, Flame } from 'lucide-react';
import { agsV12Conviction } from '../../lib/ags';

const C = {
  page:      '#070912',
  text:      '#F4F7FB',
  textSec:   '#9aa6bd',
  textMuted: '#647089',
  textFaint: '#4a5568',
  hair:      'rgba(148,163,184,0.10)',
  hairSoft:  'rgba(148,163,184,0.06)',
  green:     '#22c55e',
  red:       '#ef4444',
};
const MONO = "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace";

const TIER = {
  ELITE:   { label: 'ELITE',   color: '#16a34a', icon: Sparkles },
  PREMIUM: { label: 'PREMIUM', color: '#22c55e', icon: ShieldCheck },
  LOCK:    { label: 'LOCK',    color: '#84cc16', icon: Lock },
  LEAN:    { label: 'LEAN',    color: '#facc15', icon: Lock },
};

const fmtOdds = (o) => (o > 0 ? `+${o}` : `${o}`);
const fmtMoney = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`);

// ── Slate of locked picks (mix of tiers + graded results) ──────────────────
const PICKS = [
  {
    id: 1, league: 'MLB', market: 'ML', away: 'Chicago Cubs', home: 'San Francisco Giants',
    side: 'San Francisco Giants', sideShort: 'Giants', oppShort: 'Cubs',
    abbr: 'SF', tc1: '#FD5A1E', tc2: '#27251F',
    pickLabel: 'Giants ML', odds: -124, book: 'Pinnacle', tier: 'PREMIUM', units: 3.0, scoreV12: 0.979,
    fairOdds: -124, fairProb: 55.4, evEdge: 2.4, clv: 0.0, moneyPct: 100, totalInvested: 10700,
    toWin: 2.42, lockedAt: '11:52 AM', peakAt: '12:00 PM', gameTime: '3:11 PM', serial: '4827',
    closeOdds: -124,
    backers: [{ rec: '172-167', wr: 51, roi: 5 }, { rec: '102-86', wr: 54, roi: 18 }, { rec: '36-30', wr: 55, roi: 1 }],
  },
  {
    id: 2, league: 'NHL', market: 'ML', away: 'Edmonton Oilers', home: 'Colorado Avalanche',
    side: 'Colorado Avalanche', sideShort: 'Avalanche', oppShort: 'Oilers',
    abbr: 'COL', tc1: '#6F263D', tc2: '#236192',
    pickLabel: 'Avalanche ML', odds: -135, book: 'DraftKings', tier: 'ELITE', units: 5.0, scoreV12: 0.998,
    fairOdds: -158, fairProb: 61.2, evEdge: 4.2, clv: 1.8, moneyPct: 74, totalInvested: 48200,
    toWin: 3.70, lockedAt: '2:14 PM', peakAt: '2:48 PM', gameTime: '9:00 PM', serial: '4831',
    closeOdds: -147,
    backers: [{ rec: '210-150', wr: 58, roi: 22 }, { rec: '188-160', wr: 54, roi: 12 }, { rec: '95-70', wr: 58, roi: 16 }],
  },
  {
    id: 3, league: 'NBA', market: 'SPREAD', away: 'Miami Heat', home: 'Boston Celtics',
    side: 'Boston Celtics -4.5', sideShort: 'Celtics', oppShort: 'Heat',
    abbr: 'BOS', tc1: '#007A33', tc2: '#BA9653',
    pickLabel: 'Celtics -4.5', odds: -110, book: 'FanDuel', tier: 'LEAN', units: 0.5, scoreV12: 0.869,
    fairOdds: -120, fairProb: 54.5, evEdge: 1.4, clv: 0.4, moneyPct: 57, totalInvested: 9200,
    toWin: 0.45, lockedAt: '11:40 AM', peakAt: '11:40 AM', gameTime: '7:30 PM', serial: '4835',
    closeOdds: -112,
    backers: [{ rec: '120-110', wr: 52, roi: 6 }, { rec: '88-80', wr: 52, roi: 3 }],
  },
  {
    id: 4, league: 'NHL', market: 'ML', away: 'New York Rangers', home: 'Carolina Hurricanes',
    side: 'Carolina Hurricanes', sideShort: 'Hurricanes', oppShort: 'Rangers',
    abbr: 'CAR', tc1: '#CC0000', tc2: '#111111',
    pickLabel: 'Hurricanes ML', odds: -150, book: 'DraftKings', tier: 'PREMIUM', units: 3.0, scoreV12: 0.973,
    fairOdds: -172, fairProb: 63.2, evEdge: 3.6, clv: 2.1, moneyPct: 71, totalInvested: 27400,
    toWin: 2.0, lockedAt: 'Yesterday', peakAt: 'Yesterday', gameTime: 'Final', serial: '4810',
    closeOdds: -168, graded: true, outcome: 'WIN', profit: 2.0,
    backers: [{ rec: '205-160', wr: 56, roi: 19 }, { rec: '140-120', wr: 54, roi: 9 }],
  },
  {
    id: 5, league: 'NBA', market: 'SPREAD', away: 'Phoenix Suns', home: 'Denver Nuggets',
    side: 'Denver Nuggets -2.5', sideShort: 'Nuggets', oppShort: 'Suns',
    abbr: 'DEN', tc1: '#0E2240', tc2: '#FEC524',
    pickLabel: 'Nuggets -2.5', odds: -110, book: 'FanDuel', tier: 'LOCK', units: 1.0, scoreV12: 0.940,
    fairOdds: -120, fairProb: 53.0, evEdge: 1.9, clv: -1.2, moneyPct: 63, totalInvested: 12100,
    toWin: 0.91, lockedAt: 'Yesterday', peakAt: 'Yesterday', gameTime: 'Final', serial: '4805',
    closeOdds: -102, graded: true, outcome: 'LOSS', profit: -1.0,
    backers: [{ rec: '130-120', wr: 52, roi: 4 }],
  },
];

// Eased count-up — runs 0→target whenever `run` flips true. The number
// climbing is the small thing that makes the open feel alive.
function useCountUp(target, run, ms = 1000) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) { setV(0); return; }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(target); return;
    }
    let raf, start;
    const tick = (t) => {
      if (start == null) start = t;
      const prog = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - prog, 3);
      setV(target * eased);
      if (prog < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

// The WOW centerpiece — an animated radial conviction gauge.
function ConvictionRing({ value, color, tier, run, size = 112 }) {
  const stroke = 9;
  const r = (size - stroke) / 2 - 2;
  const circ = 2 * Math.PI * r;
  const animated = useCountUp(value, run, 1100);
  const offset = circ * (1 - animated / 100);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,163,184,0.14)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: C.text, lineHeight: 1, fontFeatureSettings: "'tnum'", letterSpacing: '-0.03em' }}>{Math.round(animated)}</span>
        <span style={{ fontFamily: MONO, fontSize: '0.5rem', color: C.textMuted, letterSpacing: '0.14em', marginTop: 4 }}>CONVICTION</span>
        <span style={{ fontSize: '0.56rem', fontWeight: 800, color, letterSpacing: '0.08em', marginTop: 3 }}>{tier}</span>
      </div>
    </div>
  );
}

function Crest({ p, size = 42 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: `linear-gradient(150deg, ${p.tc1} 0%, ${p.tc2} 135%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 4px 12px -3px ${p.tc1}66, inset 0 1px 0 rgba(255,255,255,0.22)`,
    }}>
      <span style={{ fontSize: size * 0.3, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>{p.abbr}</span>
    </div>
  );
}

function TierPill({ tier, units, compact }) {
  const t = TIER[tier];
  const Icon = t.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: compact ? '4px 9px' : '6px 12px 6px 9px',
      borderRadius: 999, border: `1px solid ${t.color}55`, background: `${t.color}12`,
    }}>
      <Icon size={compact ? 11 : 14} color={t.color} strokeWidth={2.5} />
      <span style={{ fontSize: compact ? '0.62rem' : '0.7rem', fontWeight: 800, color: t.color, letterSpacing: '0.05em' }}>{t.label}</span>
      {!compact && <span style={{ fontSize: '0.62rem', fontWeight: 600, color: C.textMuted, fontFeatureSettings: "'tnum'" }}>· {units.toFixed(1)}u</span>}
    </span>
  );
}

function ResultPill({ outcome, profit, compact }) {
  const win = outcome === 'WIN';
  const color = win ? C.green : C.red;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: compact ? '4px 9px' : '6px 11px', borderRadius: 999,
      border: `1px solid ${color}44`, background: `${color}14`,
      fontSize: compact ? '0.62rem' : '0.7rem', fontWeight: 800, color, letterSpacing: '0.04em', fontFeatureSettings: "'tnum'",
    }}>
      {win ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
      {win ? '+' : ''}{profit.toFixed(2)}u
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// One pick — collapsed row that expands into the one-stop detail sheet
// ═══════════════════════════════════════════════════════════════════════════
function LockRow({ p, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [hover, setHover] = useState(false);
  const a = p.graded ? (p.outcome === 'WIN' ? C.green : C.red) : TIER[p.tier].color;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden',
        background: open ? '#141925' : (hover ? '#121724' : '#0f1420'),
        border: `1px solid ${open ? a + '33' : hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: open
          ? `0 30px 64px -24px rgba(0,0,0,0.8), 0 0 0 1px ${a}1a`
          : hover ? '0 14px 30px -16px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'background .2s ease, border-color .2s ease, box-shadow .3s ease, transform .25s ease',
        transform: hover && !open ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* team ambient wash only when open */}
      {open && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(90% 55% at 0% 0%, ${p.tc1}1c 0%, transparent 50%)` }} />}
      {/* accent spine */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: a, opacity: open ? 1 : 0.7 }} />

      {/* ───────── Collapsed row (always visible, clickable) ───────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'relative', width: '100%', cursor: 'pointer', background: 'transparent',
          border: 'none', textAlign: 'left', color: 'inherit',
          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px 14px 18px',
        }}
      >
        <Crest p={p} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '1.02rem', fontWeight: 700, color: C.text, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{p.pickLabel}</div>
          <div style={{ fontSize: '0.66rem', color: C.textMuted, marginTop: 4, fontFamily: MONO, letterSpacing: '0.02em' }}>
            {p.league} · vs {p.oppShort} · {p.gameTime}{p.graded ? '' : ' ET'}
          </div>
        </div>

        {/* odds + edge */}
        <div style={{ textAlign: 'right', marginRight: 4 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: p.graded ? C.textSec : C.green, fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em', lineHeight: 1 }}>{fmtOdds(p.odds)}</div>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: p.evEdge > 0 ? C.green : C.textMuted, marginTop: 5, fontFeatureSettings: "'tnum'" }}>+{p.evEdge}% EV</div>
        </div>

        {/* tier / result */}
        <div style={{ flexShrink: 0 }}>
          {p.graded ? <ResultPill outcome={p.outcome} profit={p.profit} compact /> : <TierPill tier={p.tier} units={p.units} compact />}
        </div>

        <ChevronDown size={16} color={C.textMuted} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s ease' }} />
      </button>

      {/* ───────── Expanded detail sheet ───────── */}
      {open && (
        <div className="lab-reveal" style={{ position: 'relative' }}>
          {/* ── Cinematic verdict band — team color floods in, gauge counts up ── */}
          <div style={{
            position: 'relative', overflow: 'hidden', borderTop: `1px solid ${C.hair}`,
            padding: '22px 24px', background: `linear-gradient(125deg, ${p.tc1}38 0%, ${p.tc1}12 44%, transparent 80%)`,
          }}>
            <div className="lab-sheen" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(115deg, transparent 34%, rgba(255,255,255,0.07) 49%, transparent 62%)' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 22 }}>
              <ConvictionRing value={agsV12Conviction(p.scoreV12)} color={a} tier={p.graded ? p.outcome : p.tier} run={open} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: MONO, fontSize: '0.56rem', color: C.textMuted, letterSpacing: '0.16em' }}>AGSU V12 VERDICT</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: '2.1rem', fontWeight: 800, color: C.green, letterSpacing: '-0.03em', lineHeight: 0.9, fontFeatureSettings: "'tnum'" }}>+{p.evEdge}%</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: C.textSec, letterSpacing: '0.04em' }}>EDGE</span>
                </div>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <PayRow label="Locked" value={`${fmtOdds(p.odds)}`} sub={`${p.book} · fair ${fmtOdds(p.fairOdds)}`} />
                  <PayRow
                    label={p.graded ? 'Result' : 'Payout'}
                    value={p.graded ? `${p.profit > 0 ? '+' : ''}${p.profit.toFixed(2)}u` : `+${p.toWin.toFixed(2)}u`}
                    sub={p.graded ? `${p.outcome} · ${p.units.toFixed(p.units < 1 ? 1 : 0)}u risk` : `on ${p.units.toFixed(p.units < 1 ? 1 : 0)}u risk`}
                    color={p.graded ? (p.profit > 0 ? C.green : C.red) : C.green}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Why it's locked */}
          <div style={{ padding: '18px 24px 0' }}>
            <Label>WHY IT'S LOCKED</Label>
            <p style={{ fontSize: '0.95rem', color: C.text, lineHeight: 1.5, margin: '10px 0 0', fontWeight: 500 }}>
              {p.backers.length} proven {p.league} winners put <b>{fmtMoney(p.totalInvested)}</b> behind the {p.sideShort} —
              <span style={{ color: a, fontWeight: 700 }}> {p.moneyPct}% of sharp money</span>{p.moneyPct >= 100 ? ', zero dissent.' : '.'}
            </p>
          </div>

          {/* Backers */}
          <div style={{ display: 'flex', gap: 8, padding: '14px 24px 0', flexWrap: 'wrap' }}>
            {p.backers.map((b, i) => (
              <div key={i} className="lab-chip" style={{ animationDelay: `${0.12 + i * 0.07}s`, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 11px 7px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: `${a}1f`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={11} color={a} strokeWidth={2.5} />
                </span>
                <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: C.text, fontFeatureSettings: "'tnum'" }}>{b.rec}</span>
                  <span style={{ fontSize: '0.56rem', color: C.textMuted, fontFeatureSettings: "'tnum'" }}>{b.wr}% W · +{b.roi}% ROI</span>
                </span>
              </div>
            ))}
          </div>

          {/* Sharp money — animated fill + count-up */}
          <MoneyBlock p={p} a={a} run={open} />

          {/* Line history + CLV */}
          <div style={{ padding: '18px 24px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Label>{p.pickLabel} — LINE HISTORY</Label>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: p.clv > 0 ? C.green : p.clv < 0 ? C.red : C.textMuted, fontFeatureSettings: "'tnum'" }}>CLV {p.clv > 0 ? '+' : ''}{p.clv}%</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 10 }}>
              <LineCol label={p.book} value={fmtOdds(p.odds)} color={C.text} first />
              <LineCol label="Pinnacle" value={fmtOdds(p.fairOdds)} color={C.textSec} />
              <LineCol label="Now" value={fmtOdds(p.closeOdds)} color={p.clv > 0 ? C.green : p.clv < 0 ? C.red : C.textSec} />
            </div>
          </div>

          {/* Lifecycle */}
          <div style={{ padding: '18px 24px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Milestone label="Locked" time={p.lockedAt} color={C.green} />
              <Rail />
              <Milestone label="Peak" time={p.peakAt} color="#D4AF37" />
              <Rail />
              <Milestone label="Game" time={p.gameTime} color={p.graded ? C.textMuted : a} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PayRow({ label, value, sub, color = C.text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: '0.7rem', color: C.textMuted, fontWeight: 600 }}>{label}</span>
      <span style={{ textAlign: 'right' }}>
        <span style={{ fontSize: '0.92rem', fontWeight: 800, color, fontFeatureSettings: "'tnum'", letterSpacing: '-0.01em' }}>{value}</span>
        {sub && <span style={{ fontSize: '0.62rem', color: C.textFaint, marginLeft: 8 }}>{sub}</span>}
      </span>
    </div>
  );
}

function MoneyBlock({ p, a, run }) {
  const amt = useCountUp(p.totalInvested, run, 1100);
  const pct = useCountUp(p.moneyPct, run, 1100);
  return (
    <div style={{ padding: '20px 24px 0' }}>
      <Label>SHARP MONEY AT LOCK</Label>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10 }}>
        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: a, fontFeatureSettings: "'tnum'", letterSpacing: '-0.02em' }}>{fmtMoney(Math.round(amt))}</span>
        <span style={{ fontSize: '0.62rem', color: C.textMuted, fontFeatureSettings: "'tnum'" }}>{Math.round(pct)}% {p.sideShort} · {100 - p.moneyPct}% {p.oppShort}</span>
      </div>
      <div style={{ marginTop: 9, height: 7, borderRadius: 4, background: 'rgba(148,163,184,0.12)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${a}aa, ${a})`, borderRadius: 4 }} />
      </div>
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontFamily: MONO, fontSize: '0.55rem', color: C.textFaint, letterSpacing: '0.12em' }}>{children}</div>;
}

function LineCol({ label, value, color, first }) {
  return (
    <div style={{ textAlign: first ? 'left' : 'center', borderLeft: first ? 'none' : `1px solid ${C.hairSoft}`, paddingLeft: first ? 0 : 8 }}>
      <div style={{ fontSize: '0.55rem', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: '1.05rem', fontWeight: 800, color, fontFeatureSettings: "'tnum'", letterSpacing: '-0.01em' }}>{value}</div>
    </div>
  );
}

function Milestone({ label, time, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}99` }} />
      <span style={{ fontSize: '0.6rem', fontWeight: 700, color, letterSpacing: '0.03em' }}>{label}</span>
      <span style={{ fontSize: '0.6rem', color: C.textMuted, fontFeatureSettings: "'tnum'" }}>{time}</span>
    </div>
  );
}

function Rail() {
  return <div style={{ flex: 1, height: 1, background: C.hair, marginTop: 4 }} />;
}

export default function LockedPickCardLab() {
  return (
    <div style={{ minHeight: '100vh', background: C.page, color: C.text, fontFamily: 'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', padding: '36px 16px 120px' }}>
      <style>{`
        @keyframes labReveal { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .lab-reveal { animation: labReveal .3s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes labSheen { from { transform: translateX(-120%); } to { transform: translateX(120%); } }
        .lab-sheen { animation: labSheen 1.1s cubic-bezier(0.22,1,0.36,1) .05s both; }
        @keyframes labChip { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .lab-chip { animation: labChip .4s cubic-bezier(0.16,1,0.3,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .lab-reveal, .lab-sheen, .lab-chip { animation: none; }
        }
      `}</style>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ marginBottom: 30 }}>
          <div style={{ fontFamily: MONO, fontSize: '0.66rem', color: C.textMuted, letterSpacing: '0.16em' }}>AGSU V12 · LOCKED PICKS</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.025em', margin: '8px 0 8px' }}>Today's slate</h1>
          <p style={{ fontSize: '0.88rem', color: C.textSec, lineHeight: 1.55, margin: 0 }}>
            Scannable rows — crest, pick, price, edge, conviction at a glance. Tap any row to open the one-stop detail sheet. The top pick is open by default.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PICKS.map((p, i) => <LockRow key={p.id} p={p} defaultOpen={i === 0} />)}
        </div>
      </div>
    </div>
  );
}
