/**
 * MATCHUP INTELLIGENCE v3 — Premium Video-Game Redesign
 * Mobile-first advanced analytics dashboard
 * 
 * v3 improvements over v2:
 *  - Fixed ~EVEN threshold (gap<5 ranks, gap<1.5 stats)
 *  - D1 average references + percentile badges everywhere
 *  - Shot Profile heat-map zone coloring + D1 avg tick marks
 *  - Edge Meter chips show actual ranks/stats + magnitude bars
 *  - Four Factors: rank pills, thicker gradient bars, D1 avg markers
 *  - Hero: gradient split background, mismatch badges
 *  - Analyst Verdict: segmented health-bar, key stat callout
 *  - Overall: section dividers, selective glow, animations
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const TOTAL_TEAMS = 365;

// D1 averages for context
const D1_AVG = {
  eFG: 50.0, to: 17.0, oreb: 28.0, ftRate: 32.0, tempo: 67.5,
  close2: 52.0, far2: 36.0, dunks: 70.0, threeP: 34.0,
};

// ─── Interfaces ───────────────────────────────────────────
interface TeamStats {
  rank: number; adjOff: number; adjOff_rank: number; adjDef: number; adjDef_rank: number;
  eFG_off: number; eFG_def: number; to_off: number; to_def: number;
  oreb_off: number; oreb_def: number; twoP_off: number; twoP_def?: number;
  threeP_off: number; threeP_def?: number; bartholomew?: number; bartholomew_rank?: number;
  adjTempo?: number; ftRate_off?: number; ftRate_def?: number;
  threeP_rate_off?: number; threeP_rate_def?: number;
  wab?: number; wab_rank?: number;
}

interface PBPTeamData {
  dunks_off_fg: number; dunks_off_share: number; dunks_def_fg: number; dunks_def_share: number;
  close2_off_fg: number; close2_off_share: number; close2_def_fg: number; close2_def_share: number;
  far2_off_fg: number; far2_off_share: number; far2_def_fg: number; far2_def_share: number;
  three_off_fg: number; three_off_share: number; three_def_fg: number; three_def_share: number;
}

interface AdvancedMatchupCardProps {
  barttorvik: {
    awayBartName?: string;
    homeBartName?: string;
    away: TeamStats;
    home: TeamStats;
    matchup: { rankAdvantage: 'away' | 'home'; rankDiff: number; };
  };
  awayTeam: string;
  homeTeam: string;
  pbpData?: Record<string, PBPTeamData>;
}

type ViewMode = 'awayOff_homeDef' | 'homeOff_awayDef';

// ─── Helpers ──────────────────────────────────────────────

const getTier = (rank: number) => {
  if (rank <= 25) return { label: 'ELITE', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', glow: 'rgba(16,185,129,0.15)' };
  if (rank <= 50) return { label: 'EXCELLENT', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.10)', glow: 'rgba(6,182,212,0.12)' };
  if (rank <= 100) return { label: 'STRONG', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.10)', glow: 'rgba(59,130,246,0.10)' };
  if (rank <= 175) return { label: 'AVERAGE', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.10)', glow: 'rgba(245,158,11,0.08)' };
  if (rank <= 275) return { label: 'BELOW AVG', color: '#F97316', bg: 'rgba(249, 115, 22, 0.10)', glow: 'rgba(249,115,22,0.08)' };
  return { label: 'WEAK', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.10)', glow: 'rgba(239,68,68,0.08)' };
};

const getTeamAbbrev = (name: string, maxLen: number = 12): string => {
  if (name.length <= maxLen) return name;
  const known: Record<string, string> = {
    'North Carolina': 'UNC', 'South Carolina': 'S Carolina', 'Massachusetts': 'UMass',
    'Connecticut': 'UConn', 'Mississippi State': 'Miss St', 'Mississippi': 'Ole Miss',
    'Michigan State': 'Mich St', 'Ohio State': 'Ohio St', 'Penn State': 'Penn St',
    'Florida State': 'FSU', 'Arizona State': 'ASU', 'San Diego State': 'SDSU',
    'Kansas State': 'K-State', 'Oklahoma State': 'Okla St', 'Iowa State': 'Iowa St',
    'Virginia Tech': 'Va Tech', 'Georgia Tech': 'Ga Tech', 'Boston College': 'BC',
    'Wake Forest': 'Wake', 'Notre Dame': 'ND', 'Saint Louis': 'SLU',
    "Saint Mary's": "St Mary's", 'Northern Iowa': 'UNI', 'Middle Tennessee': 'MTSU',
    'Louisiana Tech': 'LA Tech', 'Western Kentucky': 'WKU', 'Bowling Green': 'BGSU',
    'Texas A&M': 'Texas A&M', 'Texas Tech': 'Texas Tech',
  };
  for (const [full, abbr] of Object.entries(known)) {
    if (name.toLowerCase().includes(full.toLowerCase()) && abbr.length <= maxLen) return abbr;
  }
  if (name.includes(' State') && name.replace(' State', ' St').length <= maxLen) return name.replace(' State', ' St');
  const dirMap: Record<string, string> = { 'North ': 'N ', 'South ': 'S ', 'East ': 'E ', 'West ': 'W ', 'Northern ': 'N ', 'Southern ': 'S ', 'Eastern ': 'E ', 'Western ': 'W ' };
  let s = name;
  for (const [full, abbr] of Object.entries(dirMap)) { if (s.startsWith(full)) { s = abbr + s.slice(full.length); break; } }
  if (s.length <= maxLen) return s;
  const w = name.split(' ');
  if (w[0].length >= 4 && w[0].length <= maxLen) return w[0];
  return name.slice(0, maxLen - 2) + '..';
};

/** Percentile from rank (1=best → 100th pctile, 365=worst → ~0th) */
const rankToPercentile = (rank: number): number => Math.max(0, Math.round(((TOTAL_TEAMS - rank) / TOTAL_TEAMS) * 100));

/** Percentile pill text */
const pctileLabel = (rank: number): string => {
  const p = rankToPercentile(rank);
  if (p >= 95) return 'Top 5%';
  if (p >= 90) return 'Top 10%';
  if (p >= 80) return 'Top 20%';
  if (p >= 70) return 'Top 30%';
  if (p >= 50) return 'Top Half';
  if (p >= 30) return 'Bot Half';
  return 'Bot 30%';
};

const pctileColor = (rank: number): string => {
  if (rank <= 25) return '#10B981';
  if (rank <= 75) return '#22D3EE';
  if (rank <= 150) return '#3B82F6';
  if (rank <= 250) return '#F59E0B';
  return '#EF4444';
};

/** Stat vs D1 avg: returns arrow + color */
const vsAvg = (value: number, avg: number, higherBetter: boolean) => {
  const diff = higherBetter ? value - avg : avg - value;
  if (diff > 4) return { arrow: '▲', color: '#10B981', label: 'Well Above Avg' };
  if (diff > 1.5) return { arrow: '▲', color: '#22D3EE', label: 'Above Avg' };
  if (diff > -1.5) return { arrow: '–', color: '#94A3B8', label: 'Average' };
  if (diff > -4) return { arrow: '▼', color: '#F59E0B', label: 'Below Avg' };
  return { arrow: '▼', color: '#EF4444', label: 'Well Below Avg' };
};

// ─── Keyframe injection (once) ────────────────────────────
const ANIM_ID = 'matchup-intel-v3-anims';
if (typeof document !== 'undefined' && !document.getElementById(ANIM_ID)) {
  const style = document.createElement('style');
  style.id = ANIM_ID;
  style.textContent = `
    @keyframes mi3-barFill { from { width: 0%; } }
    @keyframes mi3-fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes mi3-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
    @keyframes mi3-glowPulse { 0%,100% { box-shadow: 0 0 6px var(--glow-color, rgba(16,185,129,0.2)); } 50% { box-shadow: 0 0 18px var(--glow-color, rgba(16,185,129,0.5)); } }
    @keyframes mi3-dotPulse { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.4); opacity: 1; } }
  `;
  document.head.appendChild(style);
}

// ─── Sub-components ───────────────────────────────────────

/** Gradient section divider */
const Divider = ({ color = 'rgba(99,102,241,0.15)' }: { color?: string }) => (
  <div style={{ height: '1px', margin: '0', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
);

/** Percentile pill badge */
const PctilePill = ({ rank, size = 'sm' }: { rank: number; size?: 'sm' | 'xs' }) => {
  const c = pctileColor(rank);
  const label = pctileLabel(rank);
  return (
    <span style={{
      display: 'inline-block', padding: size === 'sm' ? '2px 6px' : '1px 5px',
      borderRadius: '4px', background: `${c}15`, border: `1px solid ${c}30`,
      fontSize: size === 'sm' ? '8px' : '7px', fontWeight: '700', color: c,
      fontFamily: 'ui-monospace, monospace', letterSpacing: '0.02em',
    }}>{label}</span>
  );
};

/** D1 average tick mark on a bar */
const AvgTick = ({ pct, isMobile }: { pct: number; isMobile: boolean }) => (
  <div style={{
    position: 'absolute', left: `${Math.min(Math.max(pct, 3), 97)}%`, top: '-2px',
    width: '2px', height: isMobile ? '10px' : '12px',
    background: 'rgba(255,255,255,0.5)', borderRadius: '1px',
    transform: 'translateX(-50%)',
  }}>
    <div style={{
      position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
      fontSize: '6px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', fontWeight: '600',
    }}>AVG</div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export function AdvancedMatchupCard({ barttorvik, awayTeam, homeTeam, pbpData = {} }: AdvancedMatchupCardProps) {
  const [view, setView] = useState<ViewMode>('awayOff_homeDef');
  const [isMobile, setIsMobile] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Intersection observer for animate-on-scroll
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!barttorvik) return null;

  const { away, home } = barttorvik;
  const isAwayView = view === 'awayOff_homeDef';
  const offTeam = isAwayView ? away : home;
  const defTeam = isAwayView ? home : away;
  const offName = isAwayView ? awayTeam : homeTeam;
  const defName = isAwayView ? homeTeam : awayTeam;

  // Ranks (safe defaults)
  const awayRank = away.bartholomew_rank || away.rank || 182;
  const homeRank = home.bartholomew_rank || home.rank || 182;
  const aOffR = away.adjOff_rank || 182;
  const hOffR = home.adjOff_rank || 182;
  const aDefR = away.adjDef_rank || 182;
  const hDefR = home.adjDef_rank || 182;
  const awayTier = getTier(awayRank);
  const homeTier = getTier(homeRank);
  const powerWinner: 'away' | 'home' = awayRank < homeRank ? 'away' : 'home';
  const powerGap = Math.abs(awayRank - homeRank);

  // Abbreviated names
  const ml = isMobile ? 10 : 14;
  const awayA = getTeamAbbrev(awayTeam, ml);
  const homeA = getTeamAbbrev(homeTeam, ml);
  const offA = getTeamAbbrev(offName, ml);
  const defA = getTeamAbbrev(defName, ml);

  // PBP data lookup
  const awayPBP = pbpData[barttorvik.awayBartName || ''] || null;
  const homePBP = pbpData[barttorvik.homeBartName || ''] || null;
  const hasPBP = !!(awayPBP && homePBP);

  // ─── Edge calculations (FIXED thresholds) ───────────────
  // Rank-based: gap<5 = even. Stat-based: gap<1.5 = even.
  const edges = {
    power:     { winner: powerWinner, gap: powerGap, isRank: true, awayVal: awayRank, homeVal: homeRank, lowerBetter: true },
    offense:   { winner: (aOffR < hOffR ? 'away' : 'home') as 'away'|'home', gap: Math.abs(aOffR - hOffR), isRank: true, awayVal: aOffR, homeVal: hOffR, lowerBetter: true },
    defense:   { winner: (aDefR < hDefR ? 'away' : 'home') as 'away'|'home', gap: Math.abs(aDefR - hDefR), isRank: true, awayVal: aDefR, homeVal: hDefR, lowerBetter: true },
    shooting:  { winner: (away.eFG_off > home.eFG_off ? 'away' : 'home') as 'away'|'home', gap: Math.abs(away.eFG_off - home.eFG_off), isRank: false, awayVal: away.eFG_off, homeVal: home.eFG_off, lowerBetter: false },
    turnovers: { winner: (away.to_off < home.to_off ? 'away' : 'home') as 'away'|'home', gap: Math.abs(away.to_off - home.to_off), isRank: false, awayVal: away.to_off, homeVal: home.to_off, lowerBetter: true },
    rebounding:{ winner: (away.oreb_off > home.oreb_off ? 'away' : 'home') as 'away'|'home', gap: Math.abs(away.oreb_off - home.oreb_off), isRank: false, awayVal: away.oreb_off, homeVal: home.oreb_off, lowerBetter: false },
  };

  const isEven = (e: typeof edges.power) => e.isRank ? e.gap < 5 : e.gap < 1.5;

  const awayWins = Object.values(edges).filter(e => e.winner === 'away' && !isEven(e)).length;
  const homeWins = Object.values(edges).filter(e => e.winner === 'home' && !isEven(e)).length;
  const evenCount = Object.values(edges).filter(e => isEven(e)).length;
  const totalDecided = awayWins + homeWins || 1;
  const edgePct = Math.round((awayWins / totalDecided) * 100);
  const overallWinner: 'away' | 'home' = awayWins >= homeWins ? 'away' : 'home';
  const winnerName = overallWinner === 'away' ? awayA : homeA;
  const winCount = Math.max(awayWins, homeWins);

  // Stats for four factors
  const eFG = { off: offTeam.eFG_off || 50, def: defTeam.eFG_def || 50 };
  const to = { off: offTeam.to_off || 17, def: defTeam.to_def || 17 };
  const oreb = { off: offTeam.oreb_off || 28, def: defTeam.oreb_def || 28 };
  const ftRate = { off: offTeam.ftRate_off || 32, def: defTeam.ftRate_def || 32 };
  const tempo = { away: away.adjTempo || 67.5, home: home.adjTempo || 67.5 };

  // Key stat for verdict callout
  const biggestEdge = (() => {
    const eFGEdge = Math.abs(eFG.off - eFG.def);
    const toEdge = Math.abs(to.off - to.def);
    const orebEdge = Math.abs(oreb.off - oreb.def);
    if (eFGEdge >= toEdge && eFGEdge >= orebEdge) return { label: 'eFG% Edge', value: `${eFG.off > eFG.def ? '+' : ''}${(eFG.off - eFG.def).toFixed(1)}`, color: '#FBBF24' };
    if (toEdge >= orebEdge) return { label: 'TO Rate Gap', value: `${to.off < to.def ? '+' : ''}${(to.def - to.off).toFixed(1)}`, color: '#F87171' };
    return { label: 'OReb Edge', value: `${oreb.off > oreb.def ? '+' : ''}${(oreb.off - oreb.def).toFixed(1)}`, color: '#60A5FA' };
  })();

  // Insight generation
  const generateInsight = () => {
    const oW = overallWinner === 'away' ? awayA : homeA;
    const oL = overallWinner === 'away' ? homeA : awayA;
    const oWR = overallWinner === 'away' ? awayRank : homeRank;
    const allSame = edges.offense.winner === edges.defense.winner && edges.defense.winner === edges.power.winner;
    
    if (allSame && powerGap > 100) return { headline: `${oW} should dominate this one.`, body: `Ranked #${oWR} overall with clear advantages on both ends of the floor, ${oW} outclasses ${oL} in every phase. This is a significant mismatch.`, confidence: 95 };
    if (allSame && powerGap > 50) return { headline: `${oW} holds meaningful advantages.`, body: `With a #${oWR} power rating and edges in both offense and defense, ${oW} should dictate pace. ${oL} will need to overperform to stay competitive.`, confidence: 80 };
    if (allSame && powerGap > 25) return { headline: `Lean ${oW}, but it's competitive.`, body: `The metrics favor ${oW} across the board, though margins are tight. A strong shooting night from ${oL} could flip the script.`, confidence: 65 };
    if (winCount >= 4) return { headline: `${oW} wins the analytics battle.`, body: `${oW} owns ${winCount} of ${6 - evenCount} decided categories. The cumulative advantage should show up on the scoreboard.`, confidence: 65 };
    if (winCount >= 3) return { headline: `${oW} has the edge, but watch out.`, body: `Leading in ${winCount} categories with ${evenCount} too close to call, ${oW} has the statistical edge. But ${oL}'s strengths could make this closer than expected.`, confidence: 55 };
    if (powerGap < 10) return { headline: `This is a coin flip.`, body: `Nearly identical by the numbers — expect a tight game where execution and shooting variance decide it.`, confidence: 45 };
    return { headline: `Split edges make this interesting.`, body: `Each team has clear strengths — ${oW} owns ${winCount} categories but ${oL} has counter-punches. Watch which style wins out.`, confidence: 50 };
  };

  const insight = generateInsight();
  const pad = isMobile ? '12px' : '20px';
  const winnerTier = overallWinner === 'away' ? awayTier : homeTier;

  return (
    <div ref={cardRef} style={{
      background: 'linear-gradient(180deg, #020617 0%, #0B1120 50%, #0F172A 100%)',
      borderRadius: isMobile ? '14px' : '18px',
      border: `1px solid rgba(99, 102, 241, 0.12)`,
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    }}>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: VERSUS BANNER (Hero) — Gradient split bg
         ═══════════════════════════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(135deg, ${awayTier.glow} 0%, rgba(15,23,42,0.4) 50%, ${homeTier.glow} 100%)`,
        borderBottom: '1px solid rgba(99, 102, 241, 0.08)',
        padding: `${isMobile ? '16px' : '24px'} ${pad}`,
        position: 'relative',
      }}>
        {/* Eyebrow */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '12px' : '16px' }}>
          <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(167, 139, 250, 0.6)', letterSpacing: '0.25em' }}>MATCHUP INTELLIGENCE</span>
        </div>

        {/* Team vs Team */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          {/* Away */}
          <div style={{
            flex: 1, textAlign: 'center',
            padding: isMobile ? '10px 4px' : '14px 8px', borderRadius: '12px',
            background: powerWinner === 'away' ? `${awayTier.color}08` : 'rgba(255,255,255,0.02)',
            border: powerWinner === 'away' ? `1px solid ${awayTier.color}20` : '1px solid rgba(255,255,255,0.04)',
            boxShadow: powerWinner === 'away' ? `inset 0 0 30px ${awayTier.color}08, 0 0 15px ${awayTier.color}10` : 'none',
            transition: 'all 0.5s ease',
          }}>
            <div style={{
              fontSize: isMobile ? '30px' : '40px', fontWeight: '900', color: awayTier.color,
              fontFamily: 'ui-monospace, SFMono-Regular, monospace', lineHeight: 1,
              textShadow: `0 0 ${powerWinner === 'away' ? '25px' : '10px'} ${awayTier.color}${powerWinner === 'away' ? '60' : '20'}`,
            }}>#{awayRank}</div>
            <div style={{
              fontSize: isMobile ? '13px' : '16px', fontWeight: '700', color: 'white', marginTop: '4px',
              opacity: powerWinner === 'away' ? 1 : 0.55,
            }}>{awayA}</div>
            <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{
                display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                background: awayTier.bg, border: `1px solid ${awayTier.color}30`,
                fontSize: '9px', fontWeight: '700', color: awayTier.color, letterSpacing: '0.08em',
              }}>{awayTier.label}</span>
              <PctilePill rank={awayRank} size="xs" />
            </div>
          </div>

          {/* VS divider */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '8px', fontWeight: '800', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em',
            }}>VS</div>
          </div>

          {/* Home */}
          <div style={{
            flex: 1, textAlign: 'center',
            padding: isMobile ? '10px 4px' : '14px 8px', borderRadius: '12px',
            background: powerWinner === 'home' ? `${homeTier.color}08` : 'rgba(255,255,255,0.02)',
            border: powerWinner === 'home' ? `1px solid ${homeTier.color}20` : '1px solid rgba(255,255,255,0.04)',
            boxShadow: powerWinner === 'home' ? `inset 0 0 30px ${homeTier.color}08, 0 0 15px ${homeTier.color}10` : 'none',
            transition: 'all 0.5s ease',
          }}>
            <div style={{
              fontSize: isMobile ? '30px' : '40px', fontWeight: '900', color: homeTier.color,
              fontFamily: 'ui-monospace, SFMono-Regular, monospace', lineHeight: 1,
              textShadow: `0 0 ${powerWinner === 'home' ? '25px' : '10px'} ${homeTier.color}${powerWinner === 'home' ? '60' : '20'}`,
            }}>#{homeRank}</div>
            <div style={{
              fontSize: isMobile ? '13px' : '16px', fontWeight: '700', color: 'white', marginTop: '4px',
              opacity: powerWinner === 'home' ? 1 : 0.55,
            }}>{homeA}</div>
            <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{
                display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                background: homeTier.bg, border: `1px solid ${homeTier.color}30`,
                fontSize: '9px', fontWeight: '700', color: homeTier.color, letterSpacing: '0.08em',
              }}>{homeTier.label}</span>
              <PctilePill rank={homeRank} size="xs" />
            </div>
          </div>
        </div>

        {/* Power Bar */}
        <div style={{ marginTop: isMobile ? '14px' : '18px' }}>
          <div style={{
            position: 'relative', height: '10px', borderRadius: '5px',
            background: 'rgba(0,0,0,0.5)', overflow: 'visible',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: isVisible ? `${Math.round((homeRank / (awayRank + homeRank)) * 100)}%` : '0%',
              background: `linear-gradient(90deg, ${awayTier.color}30, ${awayTier.color})`,
              borderRadius: '5px 0 0 5px',
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: powerWinner === 'away' ? `0 0 10px ${awayTier.color}40` : 'none',
            }} />
            <div style={{
              position: 'absolute', right: 0, top: 0, height: '100%',
              width: isVisible ? `${Math.round((awayRank / (awayRank + homeRank)) * 100)}%` : '0%',
              background: `linear-gradient(270deg, ${homeTier.color}30, ${homeTier.color})`,
              borderRadius: '0 5px 5px 0',
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: powerWinner === 'home' ? `0 0 10px ${homeTier.color}40` : 'none',
            }} />
            {/* Center line */}
            <div style={{ position: 'absolute', left: '50%', top: '-1px', width: '2px', height: '12px', background: 'rgba(255,255,255,0.2)', transform: 'translateX(-50%)', borderRadius: '1px' }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: '12px',
              background: powerGap > 75 ? 'rgba(239,68,68,0.12)' : powerGap > 30 ? 'rgba(16,185,129,0.10)' : powerGap > 10 ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${powerGap > 75 ? 'rgba(239,68,68,0.25)' : powerGap > 30 ? 'rgba(16,185,129,0.2)' : powerGap > 10 ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)'}`,
              fontSize: '10px', fontWeight: '800',
              color: powerGap > 75 ? '#F87171' : powerGap > 30 ? '#34D399' : powerGap > 10 ? '#60A5FA' : 'rgba(255,255,255,0.45)',
              fontFamily: 'ui-monospace, monospace',
            }}>
              {powerGap > 75 ? 'MISMATCH · ' : ''}{powerWinner === 'away' ? awayA : homeA} +{powerGap} ranks
            </span>
          </div>
        </div>

        {/* Stat Chips */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: isMobile ? '10px' : '14px', gap: '4px' }}>
          {[
            { side: 'away', chips: [
              { label: 'OFF', rank: aOffR },
              { label: 'DEF', rank: aDefR },
            ]},
            { side: 'home', chips: [
              { label: 'OFF', rank: hOffR },
              { label: 'DEF', rank: hDefR },
            ]},
          ].map(({ side, chips }) => (
            <div key={side} style={{ display: 'flex', gap: '3px', flex: 1, justifyContent: 'center' }}>
              {chips.map(chip => {
                const c = pctileColor(chip.rank);
                return (
                  <div key={`${side}-${chip.label}`} style={{
                    padding: isMobile ? '4px 5px' : '5px 8px', borderRadius: '6px',
                    background: `${c}08`, border: `1px solid ${c}15`,
                    textAlign: 'center', minWidth: isMobile ? '42px' : '50px',
                  }}>
                    <div style={{ fontSize: '6px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>{chip.label}</div>
                    <div style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '800', color: c, fontFamily: 'ui-monospace, monospace' }}>#{chip.rank}</div>
                    <div style={{ fontSize: '6px', color: `${c}90`, marginTop: '1px' }}>{pctileLabel(chip.rank)}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: EDGE METER — With actual stats in chips
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: pad }}>
        <div style={{
          padding: isMobile ? '14px' : '20px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.2) 100%)',
          borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>WHO HAS THE EDGE?</span>
          </div>

          {/* Tug-of-war bar with glowing dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: awayWins >= homeWins ? awayTier.color : 'rgba(255,255,255,0.3)', minWidth: isMobile ? '38px' : '48px', textAlign: 'right' }}>{awayA}</span>
            <div style={{ flex: 1, position: 'relative', height: '12px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', overflow: 'visible' }}>
              {/* Away fill */}
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: isVisible ? `${edgePct}%` : '50%',
                background: `linear-gradient(90deg, ${awayTier.color}40, ${awayTier.color})`,
                borderRadius: '6px 0 0 6px',
                transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: awayWins > homeWins ? `0 0 12px ${awayTier.color}50` : 'none',
              }} />
              {/* Home fill */}
              <div style={{
                position: 'absolute', right: 0, top: 0, height: '100%',
                width: isVisible ? `${100 - edgePct}%` : '50%',
                background: `linear-gradient(270deg, ${homeTier.color}40, ${homeTier.color})`,
                borderRadius: '0 6px 6px 0',
                transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: homeWins > awayWins ? `0 0 12px ${homeTier.color}50` : 'none',
              }} />
              {/* Center marker */}
              <div style={{ position: 'absolute', left: '50%', top: '-1px', width: '2px', height: '14px', background: 'rgba(255,255,255,0.3)', transform: 'translateX(-50%)', borderRadius: '1px', zIndex: 2 }} />
              {/* Glowing position dot */}
              <div style={{
                position: 'absolute', top: '50%', left: `${edgePct}%`,
                width: '10px', height: '10px', borderRadius: '50%',
                background: winnerTier.color,
                border: '2px solid rgba(255,255,255,0.8)',
                transform: 'translate(-50%, -50%)',
                animation: 'mi3-dotPulse 2s infinite',
                boxShadow: `0 0 10px ${winnerTier.color}80`,
                zIndex: 3, transition: 'left 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>
            <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: homeWins >= awayWins ? homeTier.color : 'rgba(255,255,255,0.3)', minWidth: isMobile ? '38px' : '48px' }}>{homeA}</span>
          </div>

          {/* Verdict Chips — now with actual stats + mini magnitude bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
            {([
              { label: 'POWER', ...edges.power },
              { label: 'OFFENSE', ...edges.offense },
              { label: 'DEFENSE', ...edges.defense },
              { label: 'SHOOTING', ...edges.shooting },
              { label: 'TURNOVERS', ...edges.turnovers },
              { label: 'BOARDS', ...edges.rebounding },
            ] as const).map(chip => {
              const even = isEven(chip);
              const chipColor = chip.winner === 'away' ? awayTier.color : homeTier.color;
              const chipWinner = chip.winner === 'away' ? awayA : homeA;
              // Magnitude bar: normalize gap to 0-100% (rank: 0-50 → 0-100, stat: 0-8 → 0-100)
              const maxGap = chip.isRank ? 50 : 8;
              const magPct = Math.min((chip.gap / maxGap) * 100, 100);

              return (
                <div key={chip.label} style={{
                  padding: isMobile ? '6px 4px' : '8px 6px', borderRadius: '8px',
                  background: even ? 'rgba(255,255,255,0.02)' : `${chipColor}08`,
                  border: `1px solid ${even ? 'rgba(255,255,255,0.05)' : `${chipColor}20`}`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '6px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginBottom: '3px' }}>{chip.label}</div>
                  {/* Stat values */}
                  <div style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '800', color: even ? 'rgba(255,255,255,0.35)' : chipColor, marginBottom: '3px' }}>
                    {even ? '~EVEN' : chipWinner}
                  </div>
                  <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', fontFamily: 'ui-monospace, monospace', marginBottom: '4px' }}>
                    {chip.isRank ? `#${chip.awayVal} vs #${chip.homeVal}` : `${chip.awayVal.toFixed(1)} vs ${chip.homeVal.toFixed(1)}`}
                  </div>
                  {/* Mini magnitude bar */}
                  {!even && (
                    <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: isVisible ? `${magPct}%` : '0%',
                        background: `linear-gradient(90deg, ${chipColor}60, ${chipColor})`,
                        borderRadius: '2px', transition: 'width 1s ease 0.3s',
                      }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Verdict sentence */}
          <div style={{
            textAlign: 'center', padding: '8px 12px', borderRadius: '8px',
            background: `${winnerTier.color}08`, borderLeft: `3px solid ${winnerTier.color}40`,
          }}>
            <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.65)', fontWeight: '500' }}>
              {winnerName} wins <strong style={{ color: winnerTier.color }}>{winCount} of {6 - evenCount}</strong> decided categories{evenCount > 0 ? ` (${evenCount} too close to call)` : ''}
            </span>
          </div>
        </div>
      </div>

      <Divider color={`${winnerTier.color}20`} />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: SHOT PROFILE — Heat-map coloring + D1 avg ticks
         ═══════════════════════════════════════════════════════════ */}
      {hasPBP && (
        <div style={{ padding: `${pad}` }}>
          <div style={{
            padding: isMobile ? '14px' : '20px',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.2) 100%)',
            borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)',
          }}>
            {/* Header with FLIP */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#FBBF24', letterSpacing: '0.12em' }}>SHOT PROFILE</div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{offA} offense vs {defA} defense</div>
              </div>
              <button
                onClick={() => setView(v => v === 'awayOff_homeDef' ? 'homeOff_awayDef' : 'awayOff_homeDef')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: isMobile ? '8px 12px' : '6px 12px', borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)',
                  color: '#A78BFA', fontSize: '9px', fontWeight: '700', cursor: 'pointer',
                  transition: 'all 0.2s', minHeight: '36px',
                }}
              >
                <ArrowRightLeft size={12} />
                FLIP
              </button>
            </div>

            {/* Shot Zone Cards */}
            {(() => {
              const offPBP = isAwayView ? awayPBP : homePBP;
              const defPBP = isAwayView ? homePBP : awayPBP;
              if (!offPBP || !defPBP) return null;

              const zones = [
                { label: 'DUNKS', offFg: offPBP.dunks_off_fg, offShare: offPBP.dunks_off_share, defFg: defPBP.dunks_def_fg, avg: D1_AVG.dunks },
                { label: 'CLOSE 2', offFg: offPBP.close2_off_fg, offShare: offPBP.close2_off_share, defFg: defPBP.close2_def_fg, avg: D1_AVG.close2 },
                { label: 'MID-RANGE', offFg: offPBP.far2_off_fg, offShare: offPBP.far2_off_share, defFg: defPBP.far2_def_fg, avg: D1_AVG.far2 },
                { label: '3-POINT', offFg: offPBP.three_off_fg, offShare: offPBP.three_off_share, defFg: defPBP.three_def_fg, avg: D1_AVG.threeP },
              ];

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {zones.map((zone) => {
                    const edge = zone.offFg - zone.defFg;
                    const edgeColor = edge > 5 ? '#10B981' : edge > 2 ? '#22D3EE' : edge > -2 ? '#F59E0B' : '#EF4444';
                    // Heat-map background: green tint for big advantage, red for disadvantage
                    const heatBg = edge > 5 ? 'rgba(16,185,129,0.06)' : edge > 2 ? 'rgba(34,211,238,0.04)' : edge > -2 ? 'rgba(0,0,0,0.25)' : 'rgba(239,68,68,0.05)';
                    const offAvgInfo = vsAvg(zone.offFg, zone.avg, true);
                    const defAvgInfo = vsAvg(zone.defFg, zone.avg, false); // for defense, lower allowed = better

                    return (
                      <div key={zone.label} style={{
                        padding: isMobile ? '10px' : '14px', borderRadius: '10px',
                        background: heatBg,
                        border: `1px solid ${edgeColor}15`,
                        position: 'relative', overflow: 'hidden',
                      }}>
                        {/* Top glow for strong edges */}
                        {Math.abs(edge) > 5 && (
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${edgeColor}80, transparent)` }} />
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>{zone.label}</span>
                          <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.25)' }}>{zone.offShare.toFixed(0)}% share</span>
                        </div>

                        {/* Offense FG% with D1 avg reference */}
                        <div style={{ marginBottom: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)' }}>{offA}</span>
                              <span style={{ fontSize: '7px', fontWeight: '700', color: offAvgInfo.color }}>{offAvgInfo.arrow}</span>
                            </div>
                            <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '900', color: offAvgInfo.color, fontFamily: 'ui-monospace, monospace' }}>{zone.offFg.toFixed(1)}%</span>
                          </div>
                          <div style={{ position: 'relative', height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,0.4)', overflow: 'visible' }}>
                            <div style={{ height: '100%', width: isVisible ? `${Math.min(zone.offFg, 100)}%` : '0%', background: `linear-gradient(90deg, ${offAvgInfo.color}40, ${offAvgInfo.color})`, borderRadius: '3px', transition: 'width 1s ease 0.2s' }} />
                            <AvgTick pct={zone.avg} isMobile={isMobile} />
                          </div>
                        </div>

                        {/* Defense FG% Allowed with D1 avg reference */}
                        <div style={{ marginBottom: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)' }}>{defA} DEF</span>
                              <span style={{ fontSize: '7px', fontWeight: '700', color: defAvgInfo.color }}>{defAvgInfo.arrow}</span>
                            </div>
                            <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', fontFamily: 'ui-monospace, monospace' }}>{zone.defFg.toFixed(1)}%</span>
                          </div>
                          <div style={{ position: 'relative', height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.4)', overflow: 'visible' }}>
                            <div style={{ height: '100%', width: `${Math.min(zone.defFg, 100)}%`, background: 'rgba(255,255,255,0.12)', borderRadius: '2px' }} />
                            <AvgTick pct={zone.avg} isMobile={isMobile} />
                          </div>
                        </div>

                        {/* Edge indicator */}
                        <div style={{
                          textAlign: 'center', padding: '4px 6px', borderRadius: '6px',
                          background: `${edgeColor}10`, border: `1px solid ${edgeColor}18`,
                        }}>
                          <span style={{ fontSize: '10px', fontWeight: '800', color: edgeColor, fontFamily: 'ui-monospace, monospace' }}>
                            {edge > 0 ? '+' : ''}{edge.toFixed(1)}
                          </span>
                          <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', marginLeft: '3px' }}>
                            {edge > 5 ? 'BIG EDGE' : edge > 2 ? 'ADVANTAGE' : edge > -2 ? 'CONTESTED' : edge > -5 ? 'TOUGH' : 'LOCKDOWN'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Shot Profile Insight */}
            {(() => {
              const offPBP = isAwayView ? awayPBP : homePBP;
              const defPBP = isAwayView ? homePBP : awayPBP;
              if (!offPBP || !defPBP) return null;
              const close2Edge = offPBP.close2_off_fg - defPBP.close2_def_fg;
              const threeEdge = offPBP.three_off_fg - defPBP.three_def_fg;
              const bestZone = offPBP.close2_off_share > offPBP.three_off_share ? 'inside' : 'perimeter';
              let shotInsight = '';
              if (bestZone === 'inside' && close2Edge > 3) shotInsight = `${offA} attacks inside (${offPBP.close2_off_share.toFixed(0)}% close 2s at ${offPBP.close2_off_fg.toFixed(0)}%) and ${defA} allows ${defPBP.close2_def_fg.toFixed(0)}% there — clear path to score`;
              else if (bestZone === 'perimeter' && threeEdge > 2) shotInsight = `${offA} relies on 3PT shooting (${offPBP.three_off_share.toFixed(0)}% of shots) and ${defA} allows ${defPBP.three_def_fg.toFixed(0)}% from deep — favorable matchup`;
              else if (close2Edge < -5) shotInsight = `${defA} locks down close range (${defPBP.close2_def_fg.toFixed(0)}% allowed) — ${offA} may struggle inside`;
              else shotInsight = `${offA} shoots ${offPBP.close2_off_fg.toFixed(0)}% close / ${offPBP.three_off_fg.toFixed(0)}% from 3 vs ${defA}'s ${defPBP.close2_def_fg.toFixed(0)}% / ${defPBP.three_def_fg.toFixed(0)}% allowed`;
              return (
                <div style={{ marginTop: '10px', padding: '8px 10px', borderRadius: '8px', background: 'rgba(251,191,36,0.06)', borderLeft: '3px solid rgba(251,191,36,0.3)' }}>
                  <span style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.55)', fontWeight: '500', lineHeight: '1.4' }}>{shotInsight}</span>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {hasPBP && <Divider />}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: FOUR FACTORS — Thick bars, rank pills, D1 avg markers
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: pad }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: '#FBBF24', letterSpacing: '0.12em' }}>FOUR FACTORS</span>
          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>{offA} OFF vs {defA} DEF</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {[
            { label: 'SHOOTING', stat: 'eFG%', offVal: eFG.off, defVal: eFG.def, avg: D1_AVG.eFG, higher: true, color: '#FBBF24', icon: '🎯' },
            { label: 'BALL CONTROL', stat: 'TO Rate', offVal: to.off, defVal: to.def, avg: D1_AVG.to, higher: false, color: '#F87171', icon: '🏀' },
            { label: 'BOARDS', stat: 'OReb%', offVal: oreb.off, defVal: oreb.def, avg: D1_AVG.oreb, higher: true, color: '#60A5FA', icon: '💪' },
            { label: 'FREE THROWS', stat: 'FT Rate', offVal: ftRate.off, defVal: ftRate.def, avg: D1_AVG.ftRate, higher: true, color: '#34D399', icon: '🎟' },
          ].map((factor) => {
            const diff = factor.offVal - factor.defVal;
            const edge = factor.higher ? diff : -diff;
            const edgeColor = edge > 4 ? '#10B981' : edge > 1.5 ? '#22D3EE' : edge > -1.5 ? '#F59E0B' : '#EF4444';
            const edgeLabel = edge > 4 ? 'BIG EDGE' : edge > 1.5 ? 'EDGE' : edge > -1.5 ? 'NEUTRAL' : 'TOUGH';
            const offAvg = vsAvg(factor.offVal, factor.avg, factor.higher);
            const defAvg = vsAvg(factor.defVal, factor.avg, !factor.higher); // For defense stat, invert
            const barPct = Math.min(Math.max((factor.offVal / (factor.offVal + factor.defVal)) * 100, 15), 85);
            const avgBarPct = (factor.avg / (factor.avg * 2)) * 100; // 50% always for avg tick

            return (
              <div key={factor.label} style={{
                padding: isMobile ? '10px' : '14px', borderRadius: '10px',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.15) 100%)',
                border: `1px solid ${edgeColor}18`,
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Top glow for edge cards */}
                {edge > 3 && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${edgeColor}90, transparent)` }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '8px', fontWeight: '700', color: factor.color, letterSpacing: '0.08em' }}>{factor.label}</span>
                  <span style={{
                    fontSize: '7px', fontWeight: '800', color: edgeColor,
                    padding: '2px 6px', borderRadius: '4px', background: `${edgeColor}15`, border: `1px solid ${edgeColor}20`,
                  }}>{edgeLabel}</span>
                </div>

                {/* Values with vs-avg arrows */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '900', color: offAvg.color, fontFamily: 'ui-monospace, monospace' }}>
                      {factor.offVal.toFixed(1)}
                    </span>
                    <span style={{ fontSize: '8px', fontWeight: '700', color: offAvg.color, marginLeft: '2px' }}>{offAvg.arrow}</span>
                  </div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.15)', fontWeight: '700' }}>vs</div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', fontFamily: 'ui-monospace, monospace' }}>
                      {factor.defVal.toFixed(1)}
                    </span>
                    <span style={{ fontSize: '8px', fontWeight: '700', color: defAvg.color, marginLeft: '2px' }}>{defAvg.arrow}</span>
                  </div>
                </div>

                {/* Thick comparison bar with D1 avg tick */}
                <div style={{ position: 'relative', height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', overflow: 'visible', marginBottom: '4px' }}>
                  <div style={{
                    height: '100%',
                    width: isVisible ? `${barPct}%` : '50%',
                    background: `linear-gradient(90deg, ${edgeColor}50, ${edgeColor})`,
                    borderRadius: '4px',
                    transition: 'width 1s ease 0.3s',
                    boxShadow: edge > 3 ? `0 0 8px ${edgeColor}40` : 'none',
                  }} />
                  {/* D1 Avg marker at 50% */}
                  <div style={{
                    position: 'absolute', left: '50%', top: '-2px', width: '2px', height: '12px',
                    background: 'rgba(255,255,255,0.4)', borderRadius: '1px', transform: 'translateX(-50%)',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.25)' }}>D1 avg: {factor.avg.toFixed(1)}</span>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: edgeColor, fontFamily: 'ui-monospace, monospace' }}>
                    {edge > 0 ? '+' : ''}{edge.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pace badge */}
        <div style={{
          marginTop: '8px', padding: '8px 12px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>EXPECTED PACE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#A78BFA', fontFamily: 'ui-monospace, monospace' }}>
              {((tempo.away + tempo.home) / 2).toFixed(1)}
            </span>
            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>
              poss/40 ({tempo.away > tempo.home ? awayA : homeA} pushes)
            </span>
          </div>
        </div>
      </div>

      <Divider color={`${winnerTier.color}15`} />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: ANALYST VERDICT — Segmented health bar + key stat
         ═══════════════════════════════════════════════════════════ */}
      <div style={{
        padding: pad,
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(2, 6, 23, 0.8) 100%)',
      }}>
        <div style={{
          padding: isMobile ? '14px' : '20px', borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(99, 102, 241, 0.03) 100%)',
          border: `1px solid ${winnerTier.color}12`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: winnerTier.color, animation: 'mi3-pulse 2s infinite' }} />
            <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>SAVANT ANALYSIS</span>
          </div>

          {/* Key Stat Callout */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
            padding: '8px 10px', borderRadius: '8px',
            background: `${biggestEdge.color}08`, border: `1px solid ${biggestEdge.color}15`,
          }}>
            <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '900', color: biggestEdge.color, fontFamily: 'ui-monospace, monospace', lineHeight: 1 }}>
              {biggestEdge.value}
            </span>
            <div>
              <div style={{ fontSize: '8px', fontWeight: '700', color: biggestEdge.color, letterSpacing: '0.05em' }}>{biggestEdge.label}</div>
              <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)' }}>Biggest statistical advantage</div>
            </div>
          </div>

          <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: 'white', marginBottom: '6px', lineHeight: '1.3' }}>
            {insight.headline}
          </div>

          <div style={{ fontSize: isMobile ? '11px' : '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5', marginBottom: '14px' }}>
            {insight.body}
          </div>

          {/* Segmented health-bar confidence meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '7px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', flexShrink: 0 }}>CONFIDENCE</span>
            <div style={{ flex: 1, display: 'flex', gap: '2px' }}>
              {Array.from({ length: 10 }).map((_, i) => {
                const filled = (i + 1) * 10 <= insight.confidence;
                const partial = !filled && i * 10 < insight.confidence;
                const segColor = insight.confidence > 75 ? '#10B981' : insight.confidence > 55 ? '#3B82F6' : '#F59E0B';
                return (
                  <div key={i} style={{
                    flex: 1, height: '10px', borderRadius: '2px',
                    background: filled ? segColor : partial ? `${segColor}50` : 'rgba(255,255,255,0.06)',
                    boxShadow: filled && i === Math.floor(insight.confidence / 10) - 1 ? `0 0 6px ${segColor}50` : 'none',
                    transition: `background 0.3s ease ${i * 0.05}s`,
                  }} />
                );
              })}
            </div>
            <span style={{
              fontSize: '10px', fontWeight: '800', fontFamily: 'ui-monospace, monospace',
              color: insight.confidence > 75 ? '#10B981' : insight.confidence > 55 ? '#3B82F6' : '#F59E0B',
              minWidth: '44px', textAlign: 'right',
            }}>
              {insight.confidence > 75 ? 'HIGH' : insight.confidence > 55 ? 'MEDIUM' : 'LOW'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ fontSize: '7px', fontWeight: '600', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.2em' }}>SAVANT ANALYTICS · TEMPO-FREE DATA</span>
        </div>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
