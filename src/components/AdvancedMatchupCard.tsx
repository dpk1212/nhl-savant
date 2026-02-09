/**
 * MATCHUP INTELLIGENCE v5 — Shot Profile + Key Matchups Redesign
 *
 * v5 changes:
 *  - Shot Profile: full-width zone rows with OFF FG%, DEF FG% allowed,
 *    percentile badges, share volume, and net edge verdict per zone
 *  - Key Matchups: 3 head-to-head battle cards (Turnover, Rebounding,
 *    Free Throw) with ranks, percentile context, and contextual verdicts
 *  - TeamStats interface expanded with individual stat ranks
 *  - All stat values colored by D1 percentile for instant context
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const TOTAL_TEAMS = 365;

const D1_AVG = {
  eFG: 50.0, to: 17.0, oreb: 28.0, ftRate: 32.0, tempo: 67.5,
  close2: 52.0, far2: 36.0, dunks: 70.0, threeP: 34.0,
};

// ─── Interfaces ───────────────────────────────────────────
interface TeamStats {
  rank: number; adjOff: number; adjOff_rank: number; adjDef: number; adjDef_rank: number;
  eFG_off: number; eFG_def: number; eFG_off_rank?: number; eFG_def_rank?: number;
  to_off: number; to_def: number; to_off_rank?: number; to_def_rank?: number;
  oreb_off: number; oreb_def: number; oreb_off_rank?: number; oreb_def_rank?: number;
  twoP_off: number; twoP_def?: number; twoP_off_rank?: number; twoP_def_rank?: number;
  threeP_off: number; threeP_def?: number; threeP_off_rank?: number; threeP_def_rank?: number;
  bartholomew?: number; bartholomew_rank?: number;
  adjTempo?: number; ftRate_off?: number; ftRate_def?: number;
  ftRate_off_rank?: number; ftRate_def_rank?: number;
  threeP_rate_off?: number; threeP_rate_def?: number;
  threeP_rate_off_rank?: number; threeP_rate_def_rank?: number;
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
    awayBartName?: string; homeBartName?: string;
    away: TeamStats; home: TeamStats;
    matchup: { rankAdvantage: 'away' | 'home'; rankDiff: number; };
  };
  awayTeam: string;
  homeTeam: string;
  pbpData?: Record<string, PBPTeamData>;
}

type ViewMode = 'awayOff_homeDef' | 'homeOff_awayDef';

// ─── Helpers ──────────────────────────────────────────────

const getTier = (rank: number) => {
  if (rank <= 25) return { label: 'ELITE', color: '#10B981', bg: 'rgba(16,185,129,0.12)', glow: 'rgba(16,185,129,0.15)' };
  if (rank <= 50) return { label: 'EXCELLENT', color: '#06B6D4', bg: 'rgba(6,182,212,0.10)', glow: 'rgba(6,182,212,0.12)' };
  if (rank <= 100) return { label: 'STRONG', color: '#3B82F6', bg: 'rgba(59,130,246,0.10)', glow: 'rgba(59,130,246,0.10)' };
  if (rank <= 175) return { label: 'AVERAGE', color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', glow: 'rgba(245,158,11,0.08)' };
  if (rank <= 275) return { label: 'BELOW AVG', color: '#F97316', bg: 'rgba(249,115,22,0.10)', glow: 'rgba(249,115,22,0.08)' };
  return { label: 'WEAK', color: '#EF4444', bg: 'rgba(239,68,68,0.10)', glow: 'rgba(239,68,68,0.08)' };
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

const pctileColor = (rank: number): string => {
  if (rank <= 25) return '#10B981';
  if (rank <= 75) return '#22D3EE';
  if (rank <= 150) return '#3B82F6';
  if (rank <= 250) return '#F59E0B';
  return '#EF4444';
};

/** Rank → readable percentile label */
const rankLabel = (rank: number): string => {
  const p = Math.max(0, Math.round(((TOTAL_TEAMS - rank) / TOTAL_TEAMS) * 100));
  if (p >= 95) return 'Top 5%';
  if (p >= 90) return 'Top 10%';
  if (p >= 80) return 'Top 20%';
  if (p >= 70) return 'Top 30%';
  if (p >= 50) return 'Top Half';
  if (p >= 30) return 'Bot Half';
  return 'Bot 30%';
};

/** Color a stat value based on how it compares to D1 average */
const statColor = (value: number, avg: number, higherBetter: boolean): string => {
  const diff = higherBetter ? value - avg : avg - value;
  if (diff > 4) return '#10B981';
  if (diff > 1.5) return '#22D3EE';
  if (diff > -1.5) return '#94A3B8';
  if (diff > -4) return '#F59E0B';
  return '#EF4444';
};

// ─── Keyframes ────────────────────────────────────────────
const ANIM_ID = 'matchup-intel-v5-anims';
if (typeof document !== 'undefined' && !document.getElementById(ANIM_ID)) {
  const style = document.createElement('style');
  style.id = ANIM_ID;
  style.textContent = `
    @keyframes mi5-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
    @keyframes mi5-dotPulse { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.3); opacity: 1; } }
  `;
  document.head.appendChild(style);
}

// ─── Sub-components ───────────────────────────────────────

const Divider = ({ color = 'rgba(99,102,241,0.25)' }: { color?: string }) => (
  <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
);

const SectionHeader = ({ title, subtitle, color = '#FBBF24', isMobile }: { title: string; subtitle: string; color?: string; isMobile: boolean }) => (
  <div style={{ marginBottom: isMobile ? '12px' : '14px' }}>
    <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color, letterSpacing: '0.1em' }}>{title}</div>
    <div style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{subtitle}</div>
  </div>
);

/** Small inline rank + percentile badge */
const RankBadge = ({ rank, isMobile }: { rank: number; isMobile: boolean }) => {
  const c = pctileColor(rank);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 7px', borderRadius: '4px',
      background: `${c}12`, border: `1px solid ${c}20`,
      fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: c,
      fontFamily: 'ui-monospace, monospace', whiteSpace: 'nowrap',
    }}>
      #{rank} <span style={{ opacity: 0.75 }}>{rankLabel(rank)}</span>
    </span>
  );
};

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

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
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

  const ml = isMobile ? 10 : 14;
  const awayA = getTeamAbbrev(awayTeam, ml);
  const homeA = getTeamAbbrev(homeTeam, ml);
  const offA = getTeamAbbrev(offName, ml);
  const defA = getTeamAbbrev(defName, ml);

  const awayPBP = pbpData[barttorvik.awayBartName || ''] || null;
  const homePBP = pbpData[barttorvik.homeBartName || ''] || null;
  const hasPBP = !!(awayPBP && homePBP);

  // Edge calculations
  const edges = {
    power:     { winner: powerWinner, gap: powerGap, isRank: true, awayVal: awayRank, homeVal: homeRank },
    offense:   { winner: (aOffR < hOffR ? 'away' : 'home') as 'away'|'home', gap: Math.abs(aOffR - hOffR), isRank: true, awayVal: aOffR, homeVal: hOffR },
    defense:   { winner: (aDefR < hDefR ? 'away' : 'home') as 'away'|'home', gap: Math.abs(aDefR - hDefR), isRank: true, awayVal: aDefR, homeVal: hDefR },
    shooting:  { winner: (away.eFG_off > home.eFG_off ? 'away' : 'home') as 'away'|'home', gap: Math.abs(away.eFG_off - home.eFG_off), isRank: false, awayVal: away.eFG_off, homeVal: home.eFG_off },
    turnovers: { winner: (away.to_off < home.to_off ? 'away' : 'home') as 'away'|'home', gap: Math.abs(away.to_off - home.to_off), isRank: false, awayVal: away.to_off, homeVal: home.to_off },
    rebounding:{ winner: (away.oreb_off > home.oreb_off ? 'away' : 'home') as 'away'|'home', gap: Math.abs(away.oreb_off - home.oreb_off), isRank: false, awayVal: away.oreb_off, homeVal: home.oreb_off },
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
  const winnerTier = overallWinner === 'away' ? awayTier : homeTier;

  const eFG = { off: offTeam.eFG_off || 50, def: defTeam.eFG_def || 50 };
  const to = { off: offTeam.to_off || 17, def: defTeam.to_def || 17 };
  const oreb = { off: offTeam.oreb_off || 28, def: defTeam.oreb_def || 28 };
  const ftRate = { off: offTeam.ftRate_off || 32, def: defTeam.ftRate_def || 32 };
  const tempo = { away: away.adjTempo || 67.5, home: home.adjTempo || 67.5 };

  const biggestEdge = (() => {
    const eFGEdge = Math.abs(eFG.off - eFG.def);
    const toEdge = Math.abs(to.off - to.def);
    const orebEdge = Math.abs(oreb.off - oreb.def);
    if (eFGEdge >= toEdge && eFGEdge >= orebEdge) return { label: 'eFG% EDGE', value: `${eFG.off > eFG.def ? '+' : ''}${(eFG.off - eFG.def).toFixed(1)}`, color: '#FBBF24' };
    if (toEdge >= orebEdge) return { label: 'TURNOVER EDGE', value: `${to.off < to.def ? '+' : ''}${(to.def - to.off).toFixed(1)}`, color: '#F87171' };
    return { label: 'REBOUND EDGE', value: `${oreb.off > oreb.def ? '+' : ''}${(oreb.off - oreb.def).toFixed(1)}`, color: '#60A5FA' };
  })();

  const generateInsight = () => {
    const oW = overallWinner === 'away' ? awayA : homeA;
    const oL = overallWinner === 'away' ? homeA : awayA;
    const oWR = overallWinner === 'away' ? awayRank : homeRank;
    const allSame = edges.offense.winner === edges.defense.winner && edges.defense.winner === edges.power.winner;
    if (allSame && powerGap > 100) return { headline: `${oW} should dominate this one.`, body: `Ranked #${oWR} with clear edges on both ends. This is a significant mismatch.`, confidence: 95 };
    if (allSame && powerGap > 50) return { headline: `${oW} holds meaningful advantages.`, body: `With a #${oWR} power rating and edges in offense and defense, ${oW} should dictate this game.`, confidence: 80 };
    if (allSame && powerGap > 25) return { headline: `Lean ${oW}, but it's competitive.`, body: `Metrics favor ${oW} across the board, though margins are tight. A hot shooting night from ${oL} could flip it.`, confidence: 65 };
    if (winCount >= 4) return { headline: `${oW} wins the analytics battle.`, body: `${oW} owns ${winCount} of ${6 - evenCount} decided categories. The cumulative advantage matters.`, confidence: 65 };
    if (winCount >= 3) return { headline: `${oW} has the edge, but watch out.`, body: `Leading in ${winCount} categories, ${oW} has the statistical edge. But ${oL}'s strengths could keep this close.`, confidence: 55 };
    if (powerGap < 10) return { headline: `This is a coin flip.`, body: `Nearly identical by the numbers. Expect a tight game decided by execution and variance.`, confidence: 45 };
    return { headline: `Split edges make this interesting.`, body: `Each team has clear strengths. Watch which style wins out.`, confidence: 50 };
  };

  const insight = generateInsight();
  const pad = isMobile ? '16px' : '20px';
  const mono = 'ui-monospace, SFMono-Regular, monospace';

  return (
    <div ref={cardRef} style={{
      background: 'linear-gradient(180deg, #020617 0%, #0B1120 50%, #0F172A 100%)',
      borderRadius: isMobile ? '14px' : '18px',
      border: '1px solid rgba(99,102,241,0.12)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    }}>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: VERSUS BANNER
         ═══════════════════════════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(135deg, ${awayTier.glow} 0%, rgba(15,23,42,0.4) 50%, ${homeTier.glow} 100%)`,
        borderBottom: '1px solid rgba(99,102,241,0.08)',
        padding: `${isMobile ? '18px' : '24px'} ${pad}`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '14px' : '18px' }}>
          <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: 'rgba(167,139,250,0.6)', letterSpacing: '0.25em' }}>MATCHUP INTELLIGENCE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          {/* Away */}
          {[{ rank: awayRank, tier: awayTier, name: awayA, isWinner: powerWinner === 'away', offR: aOffR, defR: aDefR }].map(t => (
            <div key="away" style={{
              flex: 1, textAlign: 'center',
              padding: isMobile ? '12px 6px' : '16px 10px', borderRadius: '12px',
              background: t.isWinner ? `${t.tier.color}08` : 'rgba(255,255,255,0.02)',
              border: t.isWinner ? `1px solid ${t.tier.color}20` : '1px solid rgba(255,255,255,0.04)',
              boxShadow: t.isWinner ? `inset 0 0 30px ${t.tier.color}08, 0 0 15px ${t.tier.color}10` : 'none',
            }}>
              <div style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: '900', color: t.tier.color, fontFamily: mono, lineHeight: 1, textShadow: `0 0 ${t.isWinner ? '25px' : '10px'} ${t.tier.color}${t.isWinner ? '60' : '20'}` }}>#{t.rank}</div>
              <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: 'white', marginTop: '4px', opacity: t.isWinner ? 1 : 0.55 }}>{t.name}</div>
              <div style={{ display: 'inline-block', marginTop: '6px', padding: '3px 10px', borderRadius: '20px', background: t.tier.bg, border: `1px solid ${t.tier.color}30`, fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: t.tier.color, letterSpacing: '0.08em' }}>{t.tier.label}</div>
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '8px' }}>
                {[{ label: 'OFF', rank: t.offR }, { label: 'DEF', rank: t.defR }].map(chip => {
                  const c = pctileColor(chip.rank);
                  return (
                    <div key={chip.label} style={{ padding: '3px 6px', borderRadius: '5px', background: `${c}10`, border: `1px solid ${c}18`, textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.45)' }}>{chip.label}</div>
                      <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color: c, fontFamily: mono }}>#{chip.rank}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>VS</div>

          {/* Home */}
          {[{ rank: homeRank, tier: homeTier, name: homeA, isWinner: powerWinner === 'home', offR: hOffR, defR: hDefR }].map(t => (
            <div key="home" style={{
              flex: 1, textAlign: 'center',
              padding: isMobile ? '12px 6px' : '16px 10px', borderRadius: '12px',
              background: t.isWinner ? `${t.tier.color}08` : 'rgba(255,255,255,0.02)',
              border: t.isWinner ? `1px solid ${t.tier.color}20` : '1px solid rgba(255,255,255,0.04)',
              boxShadow: t.isWinner ? `inset 0 0 30px ${t.tier.color}08, 0 0 15px ${t.tier.color}10` : 'none',
            }}>
              <div style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: '900', color: t.tier.color, fontFamily: mono, lineHeight: 1, textShadow: `0 0 ${t.isWinner ? '25px' : '10px'} ${t.tier.color}${t.isWinner ? '60' : '20'}` }}>#{t.rank}</div>
              <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: 'white', marginTop: '4px', opacity: t.isWinner ? 1 : 0.55 }}>{t.name}</div>
              <div style={{ display: 'inline-block', marginTop: '6px', padding: '3px 10px', borderRadius: '20px', background: t.tier.bg, border: `1px solid ${t.tier.color}30`, fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: t.tier.color, letterSpacing: '0.08em' }}>{t.tier.label}</div>
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '8px' }}>
                {[{ label: 'OFF', rank: t.offR }, { label: 'DEF', rank: t.defR }].map(chip => {
                  const c = pctileColor(chip.rank);
                  return (
                    <div key={chip.label} style={{ padding: '3px 6px', borderRadius: '5px', background: `${c}10`, border: `1px solid ${c}18`, textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.45)' }}>{chip.label}</div>
                      <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color: c, fontFamily: mono }}>#{chip.rank}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Power bar */}
        <div style={{ marginTop: isMobile ? '14px' : '18px' }}>
          <div style={{ position: 'relative', height: '10px', borderRadius: '5px', background: 'rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: isVisible ? `${Math.round((homeRank / (awayRank + homeRank)) * 100)}%` : '0%', background: `linear-gradient(90deg, ${awayTier.color}30, ${awayTier.color})`, borderRadius: '5px 0 0 5px', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: powerWinner === 'away' ? `0 0 10px ${awayTier.color}40` : 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: isVisible ? `${Math.round((awayRank / (awayRank + homeRank)) * 100)}%` : '0%', background: `linear-gradient(270deg, ${homeTier.color}30, ${homeTier.color})`, borderRadius: '0 5px 5px 0', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: powerWinner === 'home' ? `0 0 10px ${homeTier.color}40` : 'none' }} />
            <div style={{ position: 'absolute', left: '50%', top: '-1px', width: '2px', height: '12px', background: 'rgba(255,255,255,0.2)', transform: 'translateX(-50%)', borderRadius: '1px' }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: '12px',
              background: powerGap > 75 ? 'rgba(239,68,68,0.12)' : powerGap > 30 ? 'rgba(16,185,129,0.10)' : powerGap > 10 ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${powerGap > 75 ? 'rgba(239,68,68,0.25)' : powerGap > 30 ? 'rgba(16,185,129,0.2)' : powerGap > 10 ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)'}`,
              fontSize: isMobile ? '10px' : '11px', fontWeight: '800',
              color: powerGap > 75 ? '#F87171' : powerGap > 30 ? '#34D399' : powerGap > 10 ? '#60A5FA' : 'rgba(255,255,255,0.45)',
              fontFamily: mono,
            }}>
              {powerGap > 75 ? 'MISMATCH ' : ''}{powerWinner === 'away' ? awayA : homeA} +{powerGap} ranks
            </span>
          </div>
        </div>
      </div>

      <Divider />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: EDGE METER
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: pad }}>
        <SectionHeader title="WHO HAS THE EDGE?" subtitle="Category-by-category breakdown" color="rgba(255,255,255,0.5)" isMobile={isMobile} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: awayWins >= homeWins ? awayTier.color : 'rgba(255,255,255,0.3)', minWidth: isMobile ? '40px' : '50px', textAlign: 'right' }}>{awayA}</span>
          <div style={{ flex: 1, position: 'relative', height: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', overflow: 'visible' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: isVisible ? `${edgePct}%` : '50%', background: `linear-gradient(90deg, ${awayTier.color}40, ${awayTier.color})`, borderRadius: '8px 0 0 8px', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: awayWins > homeWins ? `0 0 12px ${awayTier.color}50` : 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: isVisible ? `${100 - edgePct}%` : '50%', background: `linear-gradient(270deg, ${homeTier.color}40, ${homeTier.color})`, borderRadius: '0 8px 8px 0', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: homeWins > awayWins ? `0 0 12px ${homeTier.color}50` : 'none' }} />
            <div style={{ position: 'absolute', left: '50%', top: '-1px', width: '2px', height: '18px', background: 'rgba(255,255,255,0.3)', transform: 'translateX(-50%)', borderRadius: '1px', zIndex: 2 }} />
            <div style={{ position: 'absolute', top: '50%', left: `${edgePct}%`, width: '12px', height: '12px', borderRadius: '50%', background: winnerTier.color, border: '2px solid rgba(255,255,255,0.8)', transform: 'translate(-50%,-50%)', animation: 'mi5-dotPulse 2s infinite', boxShadow: `0 0 10px ${winnerTier.color}80`, zIndex: 3, transition: 'left 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
          <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: homeWins >= awayWins ? homeTier.color : 'rgba(255,255,255,0.3)', minWidth: isMobile ? '40px' : '50px' }}>{homeA}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '14px' }}>
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
            return (
              <div key={chip.label} style={{
                padding: isMobile ? '8px 4px' : '10px 6px', borderRadius: '8px',
                background: even ? 'rgba(255,255,255,0.02)' : `${chipColor}08`,
                border: `1px solid ${even ? 'rgba(255,255,255,0.05)' : `${chipColor}20`}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: '3px' }}>{chip.label}</div>
                <div style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '800', color: even ? 'rgba(255,255,255,0.35)' : chipColor }}>
                  {even ? '~EVEN' : chipWinner}
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: mono, marginTop: '2px' }}>
                  {chip.isRank ? `#${chip.awayVal} vs #${chip.homeVal}` : `${chip.awayVal.toFixed(1)} vs ${chip.homeVal.toFixed(1)}`}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          textAlign: 'center', padding: '10px 14px', borderRadius: '10px',
          background: `${winnerTier.color}08`, borderLeft: `3px solid ${winnerTier.color}40`,
        }}>
          <span style={{ fontSize: isMobile ? '12px' : '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
            {winnerName} wins <strong style={{ color: winnerTier.color }}>{winCount} of {6 - evenCount}</strong> decided categories{evenCount > 0 ? ` (${evenCount} too close)` : ''}
          </span>
        </div>
      </div>

      <Divider color={`${winnerTier.color}25`} />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: SCORING ZONES — Identity cards + zone breakdowns
         ═══════════════════════════════════════════════════════════ */}
      {hasPBP && (
        <div style={{ padding: pad }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <SectionHeader title="SCORING ZONES" subtitle="Where they score and what the defense allows" isMobile={isMobile} />
            <button
              onClick={() => setView(v => v === 'awayOff_homeDef' ? 'homeOff_awayDef' : 'awayOff_homeDef')}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0,
                padding: isMobile ? '8px 12px' : '6px 12px', borderRadius: '8px',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                color: '#A78BFA', fontSize: '10px', fontWeight: '700', cursor: 'pointer',
                minHeight: '36px',
              }}
            >
              <ArrowRightLeft size={13} />
              FLIP
            </button>
          </div>

          {(() => {
            const offPBP = isAwayView ? awayPBP : homePBP;
            const defPBP = isAwayView ? homePBP : awayPBP;
            if (!offPBP || !defPBP) return null;

            // Build zone data with labels for sorting
            const zoneData = [
              { key: 'rim', label: 'AT THE RIM', shortLabel: 'Rim', offFg: offPBP.dunks_off_fg, offShare: offPBP.dunks_off_share, defFg: defPBP.dunks_def_fg, defShare: defPBP.dunks_def_share, avg: D1_AVG.dunks },
              { key: 'close2', label: 'CLOSE 2', shortLabel: 'Close 2', offFg: offPBP.close2_off_fg, offShare: offPBP.close2_off_share, defFg: defPBP.close2_def_fg, defShare: defPBP.close2_def_share, avg: D1_AVG.close2 },
              { key: 'mid', label: 'MID-RANGE', shortLabel: 'Mid', offFg: offPBP.far2_off_fg, offShare: offPBP.far2_off_share, defFg: defPBP.far2_def_fg, defShare: defPBP.far2_def_share, avg: D1_AVG.far2 },
              { key: 'three', label: '3-POINT', shortLabel: '3PT', offFg: offPBP.three_off_fg, offShare: offPBP.three_off_share, defFg: defPBP.three_def_fg, defShare: defPBP.three_def_share, avg: D1_AVG.threeP },
            ];

            // Sort by share to find preferences
            const offSorted = [...zoneData].sort((a, b) => b.offShare - a.offShare);
            const defSorted = [...zoneData].sort((a, b) => b.defShare - a.defShare);
            // Defense: sort by FG% allowed (highest = weakest)
            const defWeakest = [...zoneData].sort((a, b) => b.defFg - a.defFg);

            // Combined edge = offense above avg + defense weakness (allows above avg)
            // Positive = good for offense, negative = tough for offense
            const zoneEdge = (z: typeof zoneData[0]) => (z.offFg - z.avg) + (z.defFg - z.avg);
            const maxEdgeIdx = zoneData.reduce((best, z, i) => zoneEdge(z) > zoneEdge(zoneData[best]) ? i : best, 0);

            // Bar color for share distribution
            const shareBarColors = ['#A78BFA', '#818CF8', '#6366F1', '#4F46E5'];

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* ── OFFENSIVE IDENTITY CARD ── */}
                <div style={{
                  padding: isMobile ? '14px' : '16px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(15,23,42,0.3) 100%)',
                  border: '1px solid rgba(167,139,250,0.15)',
                }}>
                  <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#A78BFA', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    {offA} OFFENSIVE IDENTITY
                  </div>
                  {/* Shot distribution bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                    {offSorted.map((z, i) => (
                      <div key={z.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: i === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)', minWidth: isMobile ? '48px' : '56px' }}>{z.shortLabel}</span>
                        <div style={{ flex: 1, height: '14px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', overflow: 'hidden', position: 'relative' }}>
                          <div style={{
                            height: '100%', width: isVisible ? `${Math.min(z.offShare * 2, 100)}%` : '0%',
                            background: `linear-gradient(90deg, ${shareBarColors[i]}60, ${shareBarColors[i]})`,
                            borderRadius: '4px', transition: 'width 0.8s ease 0.1s',
                          }} />
                        </div>
                        <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color: i === 0 ? 'white' : 'rgba(255,255,255,0.55)', fontFamily: mono, minWidth: '34px', textAlign: 'right' }}>{z.offShare.toFixed(0)}%</span>
                        {i === 0 && <span style={{ fontSize: '9px', fontWeight: '700', color: '#A78BFA', padding: '2px 6px', borderRadius: '4px', background: 'rgba(167,139,250,0.15)', whiteSpace: 'nowrap' }}>GO-TO</span>}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.4' }}>
                    {offA} gets <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{offSorted[0].offShare.toFixed(0)}%</strong> of shots from <strong style={{ color: '#A78BFA' }}>{offSorted[0].shortLabel}</strong>
                    {offSorted[0].offShare + offSorted[1].offShare > 65 && <> and <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{offSorted[1].offShare.toFixed(0)}%</strong> from <strong style={{ color: '#818CF8' }}>{offSorted[1].shortLabel}</strong> — heavily concentrated</>}
                    {offSorted[0].offFg > offSorted[0].avg + 3 && <> at an elite <strong style={{ color: '#10B981' }}>{offSorted[0].offFg.toFixed(1)}%</strong></>}
                  </div>
                </div>

                {/* ── DEFENSIVE IDENTITY CARD ── */}
                <div style={{
                  padding: isMobile ? '14px' : '16px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.04) 0%, rgba(15,23,42,0.3) 100%)',
                  border: '1px solid rgba(239,68,68,0.12)',
                }}>
                  <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#F87171', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    {defA} DEFENSIVE IDENTITY
                  </div>
                  <div style={{ display: 'flex', gap: isMobile ? '6px' : '8px', marginBottom: '10px' }}>
                    {/* Weakness callout */}
                    <div style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '3px' }}>WEAKEST AREA</div>
                      <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '800', color: '#F87171', fontFamily: mono }}>{defWeakest[0].shortLabel}</div>
                      <div style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: 'rgba(255,255,255,0.55)', fontFamily: mono }}>{defWeakest[0].defFg.toFixed(1)}% allowed</div>
                    </div>
                    {/* Strength callout */}
                    <div style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '3px' }}>STRONGEST AREA</div>
                      <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '800', color: '#10B981', fontFamily: mono }}>{defWeakest[defWeakest.length - 1].shortLabel}</div>
                      <div style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: 'rgba(255,255,255,0.55)', fontFamily: mono }}>{defWeakest[defWeakest.length - 1].defFg.toFixed(1)}% allowed</div>
                    </div>
                  </div>
                  <div style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.4' }}>
                    {defA} is most vulnerable at <strong style={{ color: '#F87171' }}>{defWeakest[0].shortLabel}</strong> ({defWeakest[0].defFg.toFixed(1)}% allowed)
                    {defWeakest[0].defFg > defWeakest[0].avg + 3 && <> — <strong style={{ color: '#EF4444' }}>{(defWeakest[0].defFg - defWeakest[0].avg).toFixed(1)} above D1 avg</strong></>}
                    {' '}and locks down <strong style={{ color: '#10B981' }}>{defWeakest[defWeakest.length - 1].shortLabel}</strong> ({defWeakest[defWeakest.length - 1].defFg.toFixed(1)}%)
                  </div>
                </div>

                {/* ── MATCHUP INSIGHT CARD ── */}
                {(() => {
                  // Check if offense go-to zone aligns with defense weakness
                  const offGoTo = offSorted[0];
                  const defWeak = defWeakest[0];
                  const defStrong = defWeakest[defWeakest.length - 1];
                  const goToMatchesWeak = offGoTo.key === defWeak.key;
                  const goToMatchesStrong = offGoTo.key === defStrong.key;

                  let matchupInsight = '';
                  let matchupColor = '#F59E0B';
                  if (goToMatchesWeak) {
                    matchupInsight = `${offA}'s go-to zone (${offGoTo.shortLabel}) aligns perfectly with ${defA}'s biggest weakness. Expect heavy volume here with a favorable FG% edge.`;
                    matchupColor = '#10B981';
                  } else if (goToMatchesStrong) {
                    matchupInsight = `${offA} prefers to score from ${offGoTo.shortLabel}, but that's exactly where ${defA} is strongest. ${offA} may need to adjust or face a tough shooting night.`;
                    matchupColor = '#EF4444';
                  } else {
                    matchupInsight = `${offA} prefers ${offGoTo.shortLabel} (${offGoTo.offShare.toFixed(0)}% of shots) while ${defA} is weakest at ${defWeak.shortLabel} (${defWeak.defFg.toFixed(1)}% allowed). The question is whether ${offA} can exploit the mismatch.`;
                    matchupColor = '#F59E0B';
                  }

                  return (
                    <div style={{
                      padding: '10px 12px', borderRadius: '10px',
                      background: `${matchupColor}06`, borderLeft: `3px solid ${matchupColor}30`,
                    }}>
                      <div style={{ fontSize: '9px', fontWeight: '700', color: matchupColor, letterSpacing: '0.06em', marginBottom: '4px' }}>
                        {goToMatchesWeak ? 'FAVORABLE MATCHUP' : goToMatchesStrong ? 'TOUGH MATCHUP' : 'MIXED MATCHUP'}
                      </div>
                      <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>{matchupInsight}</span>
                    </div>
                  );
                })()}

                {/* ── ZONE-BY-ZONE BREAKDOWN ── */}
                <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', marginTop: '4px' }}>ZONE-BY-ZONE BREAKDOWN</div>

                {zoneData.map((zone, idx) => {
                  // Combined edge: how much offense is above avg + how much defense allows above avg
                  const edge = (zone.offFg - zone.avg) + (zone.defFg - zone.avg);
                  const edgeColor = edge > 10 ? '#10B981' : edge > 4 ? '#22D3EE' : edge > -4 ? '#F59E0B' : edge > -10 ? '#F97316' : '#EF4444';
                  const edgeLabel = edge > 10 ? 'BIG EDGE' : edge > 4 ? 'ADVANTAGE' : edge > -4 ? 'CONTESTED' : edge > -10 ? 'TOUGH' : 'LOCKDOWN';
                  const offColor = statColor(zone.offFg, zone.avg, true);
                  const defColor = statColor(zone.defFg, zone.avg, false);
                  const isBiggest = idx === maxEdgeIdx && edge > 4;
                  const isGoTo = zone.key === offSorted[0].key;
                  const isDefWeak = zone.key === defWeakest[0].key;
                  const isDefStrong = zone.key === defWeakest[defWeakest.length - 1].key;

                  return (
                    <div key={zone.label} style={{
                      padding: isMobile ? '14px' : '18px', borderRadius: '12px',
                      background: isBiggest
                        ? `linear-gradient(135deg, ${edgeColor}08 0%, rgba(15,23,42,0.4) 100%)`
                        : 'linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.15) 100%)',
                      border: `1px solid ${isBiggest ? `${edgeColor}25` : 'rgba(255,255,255,0.04)'}`,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      {isBiggest && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${edgeColor}80, transparent)` }} />
                      )}

                      {/* Zone header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}>{zone.label}</span>
                          {/* Context tags */}
                          {isGoTo && <span style={{ fontSize: '9px', fontWeight: '700', color: '#A78BFA', padding: '2px 6px', borderRadius: '4px', background: 'rgba(167,139,250,0.15)' }}>{offA} GO-TO</span>}
                          {isDefWeak && <span style={{ fontSize: '9px', fontWeight: '700', color: '#F87171', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.12)' }}>{defA} WEAK</span>}
                          {isDefStrong && <span style={{ fontSize: '9px', fontWeight: '700', color: '#10B981', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.12)' }}>{defA} STRONG</span>}
                        </div>
                        <span style={{ fontSize: isMobile ? '11px' : '12px', color: 'rgba(255,255,255,0.4)', fontFamily: mono }}>{zone.offShare.toFixed(0)}% of shots</span>
                      </div>

                      {/* Offense */}
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)' }}>{offA} shoots</span>
                          <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '900', color: offColor, fontFamily: mono }}>{zone.offFg.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: isVisible ? `${Math.min(zone.offFg, 100)}%` : '0%', background: `linear-gradient(90deg, ${offColor}40, ${offColor})`, borderRadius: '4px', transition: 'width 1s ease 0.2s' }} />
                        </div>
                        <div style={{ marginTop: '3px', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>
                          D1 avg: <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: mono }}>{zone.avg.toFixed(1)}%</span>
                          <span style={{ marginLeft: '6px', fontWeight: '700', color: offColor }}>
                            {zone.offFg > zone.avg ? `+${(zone.offFg - zone.avg).toFixed(1)} above` : `${(zone.offFg - zone.avg).toFixed(1)} below`}
                          </span>
                        </div>
                      </div>

                      {/* Defense */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)' }}>{defA} allows</span>
                          <span style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: defColor, fontFamily: mono }}>{zone.defFg.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: isVisible ? `${Math.min(zone.defFg, 100)}%` : '0%', background: `linear-gradient(90deg, ${defColor}40, ${defColor})`, borderRadius: '3px', transition: 'width 1s ease 0.4s' }} />
                        </div>
                        <div style={{ marginTop: '3px', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>
                          D1 avg: <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: mono }}>{zone.avg.toFixed(1)}%</span>
                          <span style={{ marginLeft: '6px', fontWeight: '700', color: defColor }}>
                            {zone.defFg < zone.avg ? `${(zone.avg - zone.defFg).toFixed(1)} below (good D)` : `+${(zone.defFg - zone.avg).toFixed(1)} above (weak D)`}
                          </span>
                        </div>
                      </div>

                      {/* Net edge */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 10px', borderRadius: '8px',
                        background: `${edgeColor}08`, border: `1px solid ${edgeColor}15`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.4)' }}>VS AVG</span>
                          <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '900', color: edgeColor, fontFamily: mono }}>
                            {edge > 0 ? '+' : ''}{edge.toFixed(1)}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '9px', fontWeight: '700', color: edgeColor,
                          padding: '3px 8px', borderRadius: '4px', background: `${edgeColor}15`,
                        }}>{edgeLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {hasPBP && <Divider />}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: KEY MATCHUPS — Head-to-Head Battles
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: pad }}>
        <SectionHeader title="HEAD-TO-HEAD BATTLES" subtitle="Direct matchup confrontations that decide games" isMobile={isMobile} />
        <div style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '14px', marginTop: '-6px' }}>{offA} offense vs {defA} defense</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* eFG% Battle */}
          {(() => {
            const offRank = offTeam.eFG_off_rank || 182;
            const defRank = defTeam.eFG_def_rank || 182;
            // Combined edge: offense above avg + defense weakness above avg
            const edge = (eFG.off - D1_AVG.eFG) + (eFG.def - D1_AVG.eFG);
            const edgeColor = edge > 8 ? '#10B981' : edge > 3 ? '#22D3EE' : edge > -3 ? '#F59E0B' : '#EF4444';
            // Use ranks: lower rank = better at their job
            const offWins = offRank < defRank;
            const verdict = offRank <= 50 && defRank > 200
              ? `${offA}'s elite shooting (#${offRank} in D1) against ${defA}'s weak defense (#${defRank}) is a major scoring advantage.`
              : offRank <= 100 && edge > 3
              ? `${offA}'s efficient offense (#${offRank}) should exploit ${defA}'s defensive gaps (#${defRank}). Expect above-average shooting.`
              : offRank > 250 && defRank > 250
              ? `Neither team excels — ${offA} is a poor shooting team (#${offRank}) and ${defA}'s defense is also weak (#${defRank}). Sloppy shooting likely.`
              : defRank <= 50 && offRank > 200
              ? `${defA}'s elite defense (#${defRank} in D1) should contain ${offA}'s weak offense (#${offRank}). Tough shooting night expected.`
              : defRank <= 100 && edge < -3
              ? `${defA}'s strong defense (#${defRank}) should limit ${offA}'s shooting (#${offRank}). Low-scoring battle.`
              : Math.abs(offRank - defRank) < 50
              ? `Evenly matched — ${offA} (#${offRank}) and ${defA}'s defense (#${defRank}) are at similar levels. Execution will decide this.`
              : offWins
              ? `${offA}'s shooting (#${offRank}) has the edge over ${defA}'s defense (#${defRank}). Slight offensive advantage.`
              : `${defA}'s defense (#${defRank}) is stronger than ${offA}'s shooting (#${offRank}). Defense has the edge.`;

            return (
              <div style={{
                padding: isMobile ? '14px' : '18px', borderRadius: '12px',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.15) 100%)',
                border: `1px solid ${edgeColor}15`, position: 'relative', overflow: 'hidden',
              }}>
                {edge > 3 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${edgeColor}90, transparent)` }} />}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color: '#FBBF24', letterSpacing: '0.04em' }}>SHOOTING BATTLE</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Effective FG% — the best measure of shooting quality</div>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: edgeColor, padding: '3px 8px', borderRadius: '4px', background: `${edgeColor}15`, border: `1px solid ${edgeColor}20` }}>
                    {edge > 8 ? 'BIG EDGE' : edge > 3 ? 'EDGE' : edge > -3 ? 'NEUTRAL' : 'TOUGH'}
                  </span>
                </div>

                {/* Offense stat */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: offWins ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)' }}>{offA} shoots</span>
                      <RankBadge rank={offRank} isMobile={isMobile} />
                    </div>
                    <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '900', color: statColor(eFG.off, D1_AVG.eFG, true), fontFamily: mono }}>{eFG.off.toFixed(1)}</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: isVisible ? `${Math.min(eFG.off, 100)}%` : '0%', background: `linear-gradient(90deg, ${statColor(eFG.off, D1_AVG.eFG, true)}40, ${statColor(eFG.off, D1_AVG.eFG, true)})`, borderRadius: '4px', transition: 'width 1s ease 0.2s' }} />
                  </div>
                </div>

                {/* Defense stat */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: !offWins ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)' }}>{defA} allows</span>
                      <RankBadge rank={defRank} isMobile={isMobile} />
                    </div>
                    <span style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: statColor(eFG.def, D1_AVG.eFG, false), fontFamily: mono }}>{eFG.def.toFixed(1)}</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: isVisible ? `${Math.min(eFG.def, 100)}%` : '0%', background: `linear-gradient(90deg, ${statColor(eFG.def, D1_AVG.eFG, false)}40, ${statColor(eFG.def, D1_AVG.eFG, false)})`, borderRadius: '3px', transition: 'width 1s ease 0.4s' }} />
                  </div>
                </div>

                <div style={{ padding: '8px 10px', borderRadius: '8px', background: `${edgeColor}06`, borderLeft: `3px solid ${edgeColor}30` }}>
                  <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5' }}>{verdict}</span>
                </div>
              </div>
            );
          })()}

          {/* TURNOVER BATTLE */}
          {(() => {
            const offRank = offTeam.to_off_rank || 182;  // Rank 1 = fewest TOs committed (best ball security)
            const defRank = defTeam.to_def_rank || 182;  // Rank 1 = most TOs forced (best pressure defense)
            // Use ranks to determine winner: lower rank = better at their job
            const offWins = offRank < defRank;
            const rankGap = Math.abs(offRank - defRank);
            const edgeColor = offWins
              ? (rankGap > 80 ? '#10B981' : rankGap > 30 ? '#22D3EE' : '#F59E0B')
              : (rankGap > 80 ? '#EF4444' : rankGap > 30 ? '#F59E0B' : '#F59E0B');
            const verdict = to.off < 14 && to.def < 15
              ? `${offA} protects the ball well (${to.off.toFixed(1)} TO rate, #${offRank} in D1) and ${defA} doesn't generate many steals (#${defRank}). Clean game expected.`
              : to.off > 19 && to.def > 19
              ? `${offA} is turnover-prone (${to.off.toFixed(1)} per 100) and ${defA} forces a lot (${to.def.toFixed(1)}). Expect a chaotic, turnover-heavy game.`
              : to.off > 19
              ? `${offA} is turnover-prone (${to.off.toFixed(1)} per 100, #${offRank}). Even though ${defA} isn't elite at forcing TOs (#${defRank}), careless play could still lead to transition points.`
              : to.def > 20
              ? `${defA}'s pressure defense forces ${to.def.toFixed(1)} turnovers per 100 (#${defRank} in D1). ${offA} must handle the ball or risk getting sped up.`
              : offWins
              ? `${offA} protects the ball (#${offRank} in D1) better than ${defA} can disrupt it (#${defRank}). Ball security shouldn't be an issue.`
              : `${defA}'s defensive pressure (#${defRank} in D1) is stronger than ${offA}'s ball security (#${offRank}). Turnovers could be a factor.`;

            return (
              <div style={{
                padding: isMobile ? '14px' : '18px', borderRadius: '12px',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.15) 100%)',
                border: `1px solid ${edgeColor}15`, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color: '#F87171', letterSpacing: '0.04em' }}>TURNOVER BATTLE</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Ball security vs defensive pressure</div>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: edgeColor, padding: '3px 8px', borderRadius: '4px', background: `${edgeColor}15`, border: `1px solid ${edgeColor}20` }}>
                    {offWins ? `${offA}` : `${defA}`}
                  </span>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: offWins ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)' }}>{offA} commits</span>
                      <RankBadge rank={offRank} isMobile={isMobile} />
                    </div>
                    <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '900', color: statColor(to.off, D1_AVG.to, false), fontFamily: mono }}>{to.off.toFixed(1)}</span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>turnovers per 100 poss — lower is better</div>
                  <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: isVisible ? `${Math.min(((30 - to.off) / 20) * 100, 100)}%` : '0%', background: `linear-gradient(90deg, ${statColor(to.off, D1_AVG.to, false)}40, ${statColor(to.off, D1_AVG.to, false)})`, borderRadius: '4px', transition: 'width 1s ease 0.2s' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: !offWins ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)' }}>{defA} forces</span>
                      <RankBadge rank={defRank} isMobile={isMobile} />
                    </div>
                    <span style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: statColor(to.def, D1_AVG.to, true), fontFamily: mono }}>{to.def.toFixed(1)}</span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>turnovers forced per 100 poss — higher is better</div>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: isVisible ? `${Math.min((to.def / 30) * 100, 100)}%` : '0%', background: `linear-gradient(90deg, ${statColor(to.def, D1_AVG.to, true)}40, ${statColor(to.def, D1_AVG.to, true)})`, borderRadius: '3px', transition: 'width 1s ease 0.4s' }} />
                  </div>
                </div>

                <div style={{ padding: '8px 10px', borderRadius: '8px', background: `${edgeColor}06`, borderLeft: `3px solid ${edgeColor}30` }}>
                  <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5' }}>{verdict}</span>
                </div>
              </div>
            );
          })()}

          {/* REBOUNDING BATTLE */}
          {(() => {
            const offRank = offTeam.oreb_off_rank || 182;
            const defRank = defTeam.oreb_def_rank || 182;
            // Combined edge: offense above avg at crashing + defense allows above avg (weak)
            const edge = (oreb.off - D1_AVG.oreb) + (oreb.def - D1_AVG.oreb);
            const edgeColor = edge > 8 ? '#10B981' : edge > 3 ? '#22D3EE' : edge > -3 ? '#F59E0B' : '#EF4444';
            // Use ranks: lower = better at their job
            const offWins = offRank < defRank;
            const verdict = offRank <= 50 && defRank > 200
              ? `${offA}'s elite crashing ability (#${offRank}) against ${defA}'s weak glass control (#${defRank}) means tons of second chances.`
              : offRank <= 100 && edge > 3
              ? `${offA} (#${offRank}) hits the offensive glass hard and ${defA}'s defense (#${defRank}) struggles to box out. Extra possessions expected.`
              : offRank > 250 && defRank > 250
              ? `Neither team excels — ${offA} rarely crashes (#${offRank}) and ${defA} also allows boards (#${defRank}). Sporadic second chances.`
              : defRank <= 50 && offRank > 200
              ? `${defA}'s elite rebounding defense (#${defRank}) should shut down ${offA}'s weak crashing (#${offRank}). One-shot possessions expected.`
              : defRank <= 100 && edge < -3
              ? `${defA} controls the glass (#${defRank}), limiting ${offA} (#${offRank}). Few second-chance points.`
              : Math.abs(offRank - defRank) < 50
              ? `Evenly matched on the glass — ${offA} (#${offRank}) and ${defA}'s defense (#${defRank}) are similar. Effort decides second chances.`
              : offWins
              ? `${offA}'s rebounding (#${offRank}) outclasses ${defA}'s glass control (#${defRank}). Extra possessions likely.`
              : `${defA}'s glass defense (#${defRank}) is stronger than ${offA}'s crashing (#${offRank}). Limited second chances.`;

            return (
              <div style={{
                padding: isMobile ? '14px' : '18px', borderRadius: '12px',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.15) 100%)',
                border: `1px solid ${edgeColor}15`, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color: '#60A5FA', letterSpacing: '0.04em' }}>REBOUNDING BATTLE</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Second chances vs defensive glass control</div>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: edgeColor, padding: '3px 8px', borderRadius: '4px', background: `${edgeColor}15`, border: `1px solid ${edgeColor}20` }}>
                    {offWins ? `${offA}` : `${defA}`}
                  </span>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: offWins ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)' }}>{offA} grabs</span>
                      <RankBadge rank={offRank} isMobile={isMobile} />
                    </div>
                    <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '900', color: statColor(oreb.off, D1_AVG.oreb, true), fontFamily: mono }}>{oreb.off.toFixed(1)}%</span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>offensive rebound rate</div>
                  <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: isVisible ? `${Math.min((oreb.off / 45) * 100, 100)}%` : '0%', background: `linear-gradient(90deg, ${statColor(oreb.off, D1_AVG.oreb, true)}40, ${statColor(oreb.off, D1_AVG.oreb, true)})`, borderRadius: '4px', transition: 'width 1s ease 0.2s' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: !offWins ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)' }}>{defA} allows</span>
                      <RankBadge rank={defRank} isMobile={isMobile} />
                    </div>
                    <span style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: statColor(oreb.def, D1_AVG.oreb, false), fontFamily: mono }}>{oreb.def.toFixed(1)}%</span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>offensive rebounds allowed</div>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: isVisible ? `${Math.min((oreb.def / 45) * 100, 100)}%` : '0%', background: `linear-gradient(90deg, ${statColor(oreb.def, D1_AVG.oreb, false)}40, ${statColor(oreb.def, D1_AVG.oreb, false)})`, borderRadius: '3px', transition: 'width 1s ease 0.4s' }} />
                  </div>
                </div>

                <div style={{ padding: '8px 10px', borderRadius: '8px', background: `${edgeColor}06`, borderLeft: `3px solid ${edgeColor}30` }}>
                  <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5' }}>{verdict}</span>
                </div>
              </div>
            );
          })()}

          {/* FREE THROW BATTLE */}
          {(() => {
            const offRank = offTeam.ftRate_off_rank || 182;
            const defRank = defTeam.ftRate_def_rank || 182;
            // Combined edge: offense draws fouls above avg + defense allows fouls above avg (weak)
            const edge = (ftRate.off - D1_AVG.ftRate) + (ftRate.def - D1_AVG.ftRate);
            const edgeColor = edge > 8 ? '#10B981' : edge > 3 ? '#22D3EE' : edge > -3 ? '#F59E0B' : '#EF4444';
            // Use ranks: lower = better at their job
            const offWins = offRank < defRank;
            const verdict = offRank <= 50 && defRank > 200
              ? `${offA} elite at drawing fouls (#${offRank}) and ${defA} is foul-prone (#${defRank}). Expect a parade to the line.`
              : offRank <= 100 && edge > 3
              ? `${offA} (#${offRank}) attacks the basket and draws contact. ${defA}'s defense (#${defRank}) tends to foul — free points likely.`
              : offRank > 250 && defRank > 250
              ? `Neither team excels — ${offA} rarely draws fouls (#${offRank}) and ${defA} also sends opponents to the line (#${defRank}). Few free throws either way.`
              : defRank <= 50 && offRank > 200
              ? `${defA}'s disciplined defense (#${defRank}) keeps ${offA} (#${offRank}) off the line. Very few free throw opportunities.`
              : defRank <= 100 && edge < -3
              ? `${defA} keeps opponents off the line (#${defRank}). ${offA} (#${offRank}) may not get the whistles they need.`
              : Math.abs(offRank - defRank) < 50
              ? `Evenly matched — ${offA} (#${offRank}) and ${defA}'s foul discipline (#${defRank}) are similar. Free throws won't swing this.`
              : offWins
              ? `${offA} draws fouls (#${offRank}) at a higher rate than ${defA} prevents them (#${defRank}). Free throw edge to ${offA}.`
              : `${defA}'s foul discipline (#${defRank}) is stronger than ${offA}'s ability to draw contact (#${offRank}). Limited free throws.`;

            return (
              <div style={{
                padding: isMobile ? '14px' : '18px', borderRadius: '12px',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.15) 100%)',
                border: `1px solid ${edgeColor}15`, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color: '#34D399', letterSpacing: '0.04em' }}>FREE THROW BATTLE</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Getting to the line vs keeping them off it</div>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: edgeColor, padding: '3px 8px', borderRadius: '4px', background: `${edgeColor}15`, border: `1px solid ${edgeColor}20` }}>
                    {offWins ? `${offA}` : `${defA}`}
                  </span>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: offWins ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)' }}>{offA} draws</span>
                      <RankBadge rank={offRank} isMobile={isMobile} />
                    </div>
                    <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '900', color: statColor(ftRate.off, D1_AVG.ftRate, true), fontFamily: mono }}>{ftRate.off.toFixed(1)}</span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>free throw attempts per field goal attempt</div>
                  <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: isVisible ? `${Math.min((ftRate.off / 50) * 100, 100)}%` : '0%', background: `linear-gradient(90deg, ${statColor(ftRate.off, D1_AVG.ftRate, true)}40, ${statColor(ftRate.off, D1_AVG.ftRate, true)})`, borderRadius: '4px', transition: 'width 1s ease 0.2s' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: !offWins ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)' }}>{defA} allows</span>
                      <RankBadge rank={defRank} isMobile={isMobile} />
                    </div>
                    <span style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: statColor(ftRate.def, D1_AVG.ftRate, false), fontFamily: mono }}>{ftRate.def.toFixed(1)}</span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>free throw attempts allowed per FGA</div>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: isVisible ? `${Math.min((ftRate.def / 50) * 100, 100)}%` : '0%', background: `linear-gradient(90deg, ${statColor(ftRate.def, D1_AVG.ftRate, false)}40, ${statColor(ftRate.def, D1_AVG.ftRate, false)})`, borderRadius: '3px', transition: 'width 1s ease 0.4s' }} />
                  </div>
                </div>

                <div style={{ padding: '8px 10px', borderRadius: '8px', background: `${edgeColor}06`, borderLeft: `3px solid ${edgeColor}30` }}>
                  <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5' }}>{verdict}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Pace */}
        <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>EXPECTED PACE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '800', color: '#A78BFA', fontFamily: mono }}>{((tempo.away + tempo.home) / 2).toFixed(1)}</span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>poss/40</span>
          </div>
        </div>
      </div>

      <Divider color={`${winnerTier.color}20`} />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: SAVANT ANALYSIS
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: pad, background: 'linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(2,6,23,0.8) 100%)' }}>
        <div style={{ padding: isMobile ? '16px' : '20px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(16,185,129,0.03) 0%, rgba(99,102,241,0.03) 100%)', border: `1px solid ${winnerTier.color}12` }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: winnerTier.color, animation: 'mi5-pulse 2s infinite' }} />
            <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>SAVANT ANALYSIS</span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>Our data-driven take</span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px',
            padding: '10px 12px', borderRadius: '10px',
            background: `${biggestEdge.color}08`, border: `1px solid ${biggestEdge.color}15`,
          }}>
            <span style={{ fontSize: isMobile ? '28px' : '32px', fontWeight: '900', color: biggestEdge.color, fontFamily: mono, lineHeight: 1 }}>
              {biggestEdge.value}
            </span>
            <div>
              <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: biggestEdge.color }}>{biggestEdge.label}</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>Biggest statistical advantage</div>
            </div>
          </div>

          <div style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '700', color: 'white', marginBottom: '8px', lineHeight: '1.3' }}>
            {insight.headline}
          </div>
          <div style={{ fontSize: isMobile ? '12px' : '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', marginBottom: '16px' }}>
            {insight.body}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', flexShrink: 0 }}>CONFIDENCE</span>
            <div style={{ flex: 1, display: 'flex', gap: '2px' }}>
              {Array.from({ length: 10 }).map((_, i) => {
                const filled = (i + 1) * 10 <= insight.confidence;
                const partial = !filled && i * 10 < insight.confidence;
                const segColor = insight.confidence > 75 ? '#10B981' : insight.confidence > 55 ? '#3B82F6' : '#F59E0B';
                return (
                  <div key={i} style={{
                    flex: 1, height: '12px', borderRadius: '2px',
                    background: filled ? segColor : partial ? `${segColor}50` : 'rgba(255,255,255,0.06)',
                    boxShadow: filled && i === Math.floor(insight.confidence / 10) - 1 ? `0 0 6px ${segColor}50` : 'none',
                    transition: `background 0.3s ease ${i * 0.05}s`,
                  }} />
                );
              })}
            </div>
            <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '800', fontFamily: mono, color: insight.confidence > 75 ? '#10B981' : insight.confidence > 55 ? '#3B82F6' : '#F59E0B', minWidth: '48px', textAlign: 'right' }}>
              {insight.confidence > 75 ? 'HIGH' : insight.confidence > 55 ? 'MEDIUM' : 'LOW'}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <span style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.2em' }}>SAVANT ANALYTICS</span>
        </div>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
