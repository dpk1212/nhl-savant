/**
 * MATCHUP INTELLIGENCE v4 — Mobile Readability + Visual Hierarchy
 * 
 * v4 changes:
 *  - Min font 9px on mobile (was 6-7px). Stat values 14px+, headers 12px+
 *  - Section context subtitles explaining WHY each section matters
 *  - Removed noise: AVG ticks on shot bars, percentile pills from stat chips,
 *    magnitude bars from edge chips, literal arrow characters
 *  - Bigger dominant numbers: FG% 18px, Four Factors 22px, key stat 28px
 *  - Shot Profile simplified: no defensive bar on mobile, just edge number
 *  - More spacing: 16px section padding, stronger dividers
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
const ANIM_ID = 'matchup-intel-v4-anims';
if (typeof document !== 'undefined' && !document.getElementById(ANIM_ID)) {
  const style = document.createElement('style');
  style.id = ANIM_ID;
  style.textContent = `
    @keyframes mi4-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
    @keyframes mi4-dotPulse { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.3); opacity: 1; } }
  `;
  document.head.appendChild(style);
}

// ─── Sub-components ───────────────────────────────────────

const Divider = ({ color = 'rgba(99,102,241,0.25)' }: { color?: string }) => (
  <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
);

/** Section header with title + explanatory subtitle */
const SectionHeader = ({ title, subtitle, color = '#FBBF24', isMobile }: { title: string; subtitle: string; color?: string; isMobile: boolean }) => (
  <div style={{ marginBottom: isMobile ? '12px' : '14px' }}>
    <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color, letterSpacing: '0.1em' }}>{title}</div>
    <div style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{subtitle}</div>
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

  // Edge calculations (gap<5 ranks, gap<1.5 stats for "even")
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
          SECTION 1: VERSUS BANNER — Compact hero with embedded stat chips
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
          {/* Away team card */}
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
              {/* Stat chips embedded inside team card */}
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

          {/* VS */}
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>VS</div>

          {/* Home team card */}
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

        {/* Power bar + badge */}
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
          SECTION 2: EDGE METER — Simplified chips, bigger verdict
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: pad }}>
        <SectionHeader title="WHO HAS THE EDGE?" subtitle="Category-by-category breakdown" color="rgba(255,255,255,0.5)" isMobile={isMobile} />

        {/* Tug-of-war bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: awayWins >= homeWins ? awayTier.color : 'rgba(255,255,255,0.3)', minWidth: isMobile ? '40px' : '50px', textAlign: 'right' }}>{awayA}</span>
          <div style={{ flex: 1, position: 'relative', height: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', overflow: 'visible' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: isVisible ? `${edgePct}%` : '50%', background: `linear-gradient(90deg, ${awayTier.color}40, ${awayTier.color})`, borderRadius: '8px 0 0 8px', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: awayWins > homeWins ? `0 0 12px ${awayTier.color}50` : 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: isVisible ? `${100 - edgePct}%` : '50%', background: `linear-gradient(270deg, ${homeTier.color}40, ${homeTier.color})`, borderRadius: '0 8px 8px 0', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: homeWins > awayWins ? `0 0 12px ${homeTier.color}50` : 'none' }} />
            <div style={{ position: 'absolute', left: '50%', top: '-1px', width: '2px', height: '18px', background: 'rgba(255,255,255,0.3)', transform: 'translateX(-50%)', borderRadius: '1px', zIndex: 2 }} />
            {/* Glowing dot */}
            <div style={{ position: 'absolute', top: '50%', left: `${edgePct}%`, width: '12px', height: '12px', borderRadius: '50%', background: winnerTier.color, border: '2px solid rgba(255,255,255,0.8)', transform: 'translate(-50%,-50%)', animation: 'mi4-dotPulse 2s infinite', boxShadow: `0 0 10px ${winnerTier.color}80`, zIndex: 3, transition: 'left 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
          <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: homeWins >= awayWins ? homeTier.color : 'rgba(255,255,255,0.3)', minWidth: isMobile ? '40px' : '50px' }}>{homeA}</span>
        </div>

        {/* Verdict Chips — SIMPLIFIED: no magnitude bars, readable font sizes */}
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

        {/* Verdict sentence — bigger, bolder */}
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
          SECTION 3: SHOT PROFILE — Simplified: no def bar on mobile
         ═══════════════════════════════════════════════════════════ */}
      {hasPBP && (
        <div style={{ padding: pad }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <SectionHeader title="SHOT PROFILE" subtitle="Where they score vs how the defense guards it" isMobile={isMobile} />
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

          <div style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', marginTop: '-6px' }}>
            {offA} offense vs {defA} defense
          </div>

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
                  const heatBg = edge > 5 ? 'rgba(16,185,129,0.06)' : edge > 2 ? 'rgba(34,211,238,0.04)' : edge > -2 ? 'rgba(0,0,0,0.25)' : 'rgba(239,68,68,0.05)';
                  const offColor = statColor(zone.offFg, zone.avg, true);

                  return (
                    <div key={zone.label} style={{
                      padding: isMobile ? '10px' : '14px', borderRadius: '10px',
                      background: heatBg, border: `1px solid ${edgeColor}15`,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      {Math.abs(edge) > 5 && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${edgeColor}80, transparent)` }} />
                      )}

                      {/* Zone header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>{zone.label}</span>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{zone.offShare.toFixed(0)}% share</span>
                      </div>

                      {/* Offense FG% — BIG number, color = vs D1 avg */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{offA}</span>
                        <span style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '900', color: offColor, fontFamily: mono }}>{zone.offFg.toFixed(1)}%</span>
                      </div>
                      {/* Single bar for offense */}
                      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden', marginBottom: '6px' }}>
                        <div style={{ height: '100%', width: isVisible ? `${Math.min(zone.offFg, 100)}%` : '0%', background: `linear-gradient(90deg, ${offColor}40, ${offColor})`, borderRadius: '3px', transition: 'width 1s ease 0.2s' }} />
                      </div>

                      {/* On mobile: just show "vs DEF: 53.2%" inline. On desktop: show the bar */}
                      {isMobile ? (
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                          vs {defA} DEF: <span style={{ fontWeight: '700', color: 'rgba(255,255,255,0.55)', fontFamily: mono }}>{zone.defFg.toFixed(1)}%</span>
                        </div>
                      ) : (
                        <div style={{ marginBottom: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{defA} DEF</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', fontFamily: mono }}>{zone.defFg.toFixed(1)}%</span>
                          </div>
                          <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(zone.defFg, 100)}%`, background: 'rgba(255,255,255,0.12)', borderRadius: '2px' }} />
                          </div>
                        </div>
                      )}

                      {/* Edge badge */}
                      <div style={{
                        textAlign: 'center', padding: '5px 6px', borderRadius: '6px',
                        background: `${edgeColor}10`, border: `1px solid ${edgeColor}18`,
                      }}>
                        <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '800', color: edgeColor, fontFamily: mono }}>
                          {edge > 0 ? '+' : ''}{edge.toFixed(1)}
                        </span>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginLeft: '4px' }}>
                          {edge > 5 ? 'BIG EDGE' : edge > 2 ? 'ADVANTAGE' : edge > -2 ? 'CONTESTED' : edge > -5 ? 'TOUGH' : 'LOCKDOWN'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Shot insight */}
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
              <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(251,191,36,0.06)', borderLeft: '3px solid rgba(251,191,36,0.3)' }}>
                <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '500', lineHeight: '1.5' }}>{shotInsight}</span>
              </div>
            );
          })()}
        </div>
      )}

      {hasPBP && <Divider />}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: KEY MATCHUPS (was Four Factors) — Bigger numbers
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: pad }}>
        <SectionHeader title="KEY MATCHUPS" subtitle="The stats that decide games" isMobile={isMobile} />
        <div style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', marginTop: '-6px' }}>{offA} offense vs {defA} defense</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {[
            { label: 'SHOOTING', stat: 'eFG%', offVal: eFG.off, defVal: eFG.def, avg: D1_AVG.eFG, higher: true, color: '#FBBF24' },
            { label: 'BALL CONTROL', stat: 'TO Rate', offVal: to.off, defVal: to.def, avg: D1_AVG.to, higher: false, color: '#F87171' },
            { label: 'BOARDS', stat: 'OReb%', offVal: oreb.off, defVal: oreb.def, avg: D1_AVG.oreb, higher: true, color: '#60A5FA' },
            { label: 'FREE THROWS', stat: 'FT Rate', offVal: ftRate.off, defVal: ftRate.def, avg: D1_AVG.ftRate, higher: true, color: '#34D399' },
          ].map((f) => {
            const diff = f.offVal - f.defVal;
            const edge = f.higher ? diff : -diff;
            const edgeColor = edge > 4 ? '#10B981' : edge > 1.5 ? '#22D3EE' : edge > -1.5 ? '#F59E0B' : '#EF4444';
            const edgeLabel = edge > 4 ? 'BIG EDGE' : edge > 1.5 ? 'EDGE' : edge > -1.5 ? 'NEUTRAL' : 'TOUGH';
            const offColor = statColor(f.offVal, f.avg, f.higher);
            const barPct = Math.min(Math.max((f.offVal / (f.offVal + f.defVal)) * 100, 15), 85);

            return (
              <div key={f.label} style={{
                padding: isMobile ? '12px' : '14px', borderRadius: '10px',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.15) 100%)',
                border: `1px solid ${edgeColor}18`, position: 'relative', overflow: 'hidden',
              }}>
                {edge > 3 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${edgeColor}90, transparent)` }} />}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: f.color, letterSpacing: '0.06em' }}>{f.label}</span>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: edgeColor, padding: '2px 7px', borderRadius: '4px', background: `${edgeColor}15`, border: `1px solid ${edgeColor}20` }}>{edgeLabel}</span>
                </div>

                {/* Big numbers — offense colored by vs-avg, defense muted */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                  <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '900', color: offColor, fontFamily: mono }}>{f.offVal.toFixed(1)}</span>
                  <span style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '700', color: 'rgba(255,255,255,0.45)', fontFamily: mono }}>{f.defVal.toFixed(1)}</span>
                </div>

                {/* Thick bar */}
                <div style={{ position: 'relative', height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', overflow: 'visible', marginBottom: '6px' }}>
                  <div style={{ height: '100%', width: isVisible ? `${barPct}%` : '50%', background: `linear-gradient(90deg, ${edgeColor}50, ${edgeColor})`, borderRadius: '4px', transition: 'width 1s ease 0.3s', boxShadow: edge > 3 ? `0 0 8px ${edgeColor}40` : 'none' }} />
                  <div style={{ position: 'absolute', left: '50%', top: '-2px', width: '2px', height: '12px', background: 'rgba(255,255,255,0.35)', borderRadius: '1px', transform: 'translateX(-50%)' }} />
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '800', color: edgeColor, fontFamily: mono }}>
                    {edge > 0 ? '+' : ''}{edge.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pace */}
        <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>EXPECTED PACE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '800', color: '#A78BFA', fontFamily: mono }}>{((tempo.away + tempo.home) / 2).toFixed(1)}</span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>poss/40</span>
          </div>
        </div>
      </div>

      <Divider color={`${winnerTier.color}20`} />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: SAVANT ANALYSIS — Big key stat, segmented bar
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: pad, background: 'linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(2,6,23,0.8) 100%)' }}>
        <div style={{ padding: isMobile ? '16px' : '20px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(16,185,129,0.03) 0%, rgba(99,102,241,0.03) 100%)', border: `1px solid ${winnerTier.color}12` }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: winnerTier.color, animation: 'mi4-pulse 2s infinite' }} />
            <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>SAVANT ANALYSIS</span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>Our data-driven take</span>
          </div>

          {/* Key Stat Callout — BIGGER */}
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

          {/* Segmented health-bar */}
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
