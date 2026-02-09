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
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
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

  // ── Compute per-zone ranks from ALL teams in pbpData ──
  // For offense: higher FG% = better (rank 1 = best shooter)
  // For defense: lower FG% allowed = better (rank 1 = best defender)
  const allTeams = Object.values(pbpData || {}) as PBPTeamData[];
  const zoneRankFields = [
    { offKey: 'dunks_off_fg', defKey: 'dunks_def_fg' },
    { offKey: 'close2_off_fg', defKey: 'close2_def_fg' },
    { offKey: 'far2_off_fg', defKey: 'far2_def_fg' },
    { offKey: 'three_off_fg', defKey: 'three_def_fg' },
  ] as const;

  // Build sorted arrays for ranking (once, not per-render in hot path)
  const zoneRanks = zoneRankFields.map(({ offKey, defKey }) => {
    const offSortedAll = [...allTeams].sort((a, b) => (b[offKey] || 0) - (a[offKey] || 0)); // highest FG% = rank 1
    const defSortedAll = [...allTeams].sort((a, b) => (a[defKey] || 0) - (b[defKey] || 0)); // lowest FG% allowed = rank 1
    return { offKey, defKey, offSortedAll, defSortedAll };
  });

  const getZoneRank = (teamPBP: PBPTeamData | null, field: string, isDefense: boolean): number => {
    if (!teamPBP || allTeams.length === 0) return Math.ceil(allTeams.length / 2) || 182;
    const entry = zoneRanks.find(z => isDefense ? z.defKey === field : z.offKey === field);
    if (!entry) return Math.ceil(allTeams.length / 2) || 182;
    const sorted = isDefense ? entry.defSortedAll : entry.offSortedAll;
    const idx = sorted.indexOf(teamPBP);
    return idx >= 0 ? idx + 1 : Math.ceil(allTeams.length / 2);
  };

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

            // Build zone data with labels, FG%, and computed ranks
            const zoneData = [
              { key: 'rim', label: 'AT THE RIM', shortLabel: 'Rim', offFg: offPBP.dunks_off_fg, offShare: offPBP.dunks_off_share, defFg: defPBP.dunks_def_fg, defShare: defPBP.dunks_def_share, avg: D1_AVG.dunks, offRank: getZoneRank(offPBP, 'dunks_off_fg', false), defRank: getZoneRank(defPBP, 'dunks_def_fg', true) },
              { key: 'close2', label: 'CLOSE 2', shortLabel: 'Close 2', offFg: offPBP.close2_off_fg, offShare: offPBP.close2_off_share, defFg: defPBP.close2_def_fg, defShare: defPBP.close2_def_share, avg: D1_AVG.close2, offRank: getZoneRank(offPBP, 'close2_off_fg', false), defRank: getZoneRank(defPBP, 'close2_def_fg', true) },
              { key: 'mid', label: 'MID-RANGE', shortLabel: 'Mid', offFg: offPBP.far2_off_fg, offShare: offPBP.far2_off_share, defFg: defPBP.far2_def_fg, defShare: defPBP.far2_def_share, avg: D1_AVG.far2, offRank: getZoneRank(offPBP, 'far2_off_fg', false), defRank: getZoneRank(defPBP, 'far2_def_fg', true) },
              { key: 'three', label: '3-POINT', shortLabel: '3PT', offFg: offPBP.three_off_fg, offShare: offPBP.three_off_share, defFg: defPBP.three_def_fg, defShare: defPBP.three_def_share, avg: D1_AVG.threeP, offRank: getZoneRank(offPBP, 'three_off_fg', false), defRank: getZoneRank(defPBP, 'three_def_fg', true) },
            ];

            // Sort by share to find preferences
            const offSorted = [...zoneData].sort((a, b) => b.offShare - a.offShare);
            const defSorted = [...zoneData].sort((a, b) => b.defShare - a.defShare);
            // Defense: sort by rank (highest rank number = weakest defender)
            const defWeakest = [...zoneData].sort((a, b) => b.defRank - a.defRank);

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* ── HALF-COURT ZONE MAP (Premium) ── */}
                {(() => {
                  // Compute edge using RANKS (not raw FG%)
                  // offRank: rank 1 = best shooter in zone, defRank: rank 1 = best defender
                  // rankEdge = defRank - offRank: positive = offense ranked better = offense advantage
                  const totalT = allTeams.length || 365;
                  const zoneMap = Object.fromEntries(zoneData.map(z => {
                    const rankEdge = z.defRank - z.offRank; // positive = offense better ranked
                    const color = rankEdge > 100 ? '#10B981' : rankEdge > 40 ? '#22D3EE' : rankEdge > -40 ? '#F59E0B' : rankEdge > -100 ? '#F97316' : '#EF4444';
                    const edgeLabel = rankEdge > 100 ? 'BIG EDGE' : rankEdge > 40 ? 'ADVANTAGE' : rankEdge > -40 ? 'CONTESTED' : rankEdge > -100 ? 'TOUGH' : 'LOCKDOWN';
                    const opacity = Math.min(0.65, Math.max(0.2, z.offShare / 65));
                    return [z.key, { ...z, rankEdge, color, edgeLabel, opacity }];
                  }));

                  const goToKey = offSorted[0].key;
                  const defWeakKey = defWeakest[0].key;
                  const defStrongKey = defWeakest[defWeakest.length - 1].key;
                  const activeKey = selectedZone || goToKey;
                  const active = zoneMap[activeKey];

                  const handleZoneTap = (key: string) => setSelectedZone(prev => prev === key ? null : key);

                  // Zone style: selected zones get brighter, unselected dim slightly
                  const zFill = (key: string) => isVisible ? (activeKey === key ? Math.min(zoneMap[key].opacity + 0.15, 0.75) : zoneMap[key].opacity * 0.7) : 0;

                  // Label sizes
                  const ns = isMobile ? 9 : 11;
                  const fs = isMobile ? 15 : 19;
                  const es = isMobile ? 10 : 12;
                  const ss = isMobile ? 7.5 : 8.5;

                  // Unique filter IDs per zone to avoid collisions
                  const glowId = (key: string) => `courtGlow_${key}`;

                  return (
                    <div style={{
                      padding: isMobile ? '12px' : '16px', borderRadius: '14px',
                      background: 'linear-gradient(180deg, rgba(8,12,28,0.85) 0%, rgba(15,23,42,0.5) 100%)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      position: 'relative', overflow: 'hidden',
                    }}>
                      {/* Subtle top glow */}
                      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)' }} />

                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? '8px' : '12px' }}>
                        <div>
                          <div style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '800', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em' }}>
                            {offA} <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: '600' }}>vs</span> {defA}
                          </div>
                          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Tap a zone for the full matchup breakdown</div>
                        </div>
                        {/* Mini legend */}
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10B981' }} />
                          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>Edge</span>
                          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#F59E0B' }} />
                          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>Even</span>
                          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#EF4444' }} />
                          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>Tough</span>
                        </div>
                      </div>

                      {/* ── SVG HALF-COURT ── */}
                      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: `0 0 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)` }}>
                        {/* Ambient glow behind court */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '70%', height: '70%', transform: 'translate(-50%, -50%)', background: `radial-gradient(ellipse, ${zoneMap[goToKey]?.color || '#22D3EE'}10 0%, transparent 70%)`, pointerEvents: 'none' }} />
                        <svg
                          viewBox="0 0 300 310"
                          style={{ width: '100%', display: 'block' }}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            {/* Radial glow gradients per zone */}
                            {Object.entries(zoneMap).map(([key, z]) => (
                              <React.Fragment key={`defs_${key}`}>
                                <radialGradient id={`zoneGrad_${key}`} cx="50%" cy="60%" r="75%">
                                  <stop offset="0%" stopColor={z.color} stopOpacity="0.85" />
                                  <stop offset="50%" stopColor={z.color} stopOpacity="0.45" />
                                  <stop offset="100%" stopColor={z.color} stopOpacity="0.08" />
                                </radialGradient>
                                <filter id={glowId(key)} x="-20%" y="-20%" width="140%" height="140%">
                                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                                  <feColorMatrix in="blur" type="matrix" values={`0 0 0 0 ${parseInt(z.color.slice(1,3),16)/255} 0 0 0 0 ${parseInt(z.color.slice(3,5),16)/255} 0 0 0 0 ${parseInt(z.color.slice(5,7),16)/255} 0 0 0 0.4 0`} />
                                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                              </React.Fragment>
                            ))}
                            {/* Court floor */}
                            <linearGradient id="courtFloorGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgba(12,18,36,1)" />
                              <stop offset="100%" stopColor="rgba(8,12,24,1)" />
                            </linearGradient>
                            {/* Vignette */}
                            <radialGradient id="courtVignette" cx="50%" cy="80%" r="60%">
                              <stop offset="0%" stopColor="transparent" />
                              <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
                            </radialGradient>
                            {/* Text shadow filter */}
                            <filter id="textGlow" x="-10%" y="-10%" width="120%" height="120%">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
                            </filter>
                          </defs>

                          {/* Court floor */}
                          <rect x="0" y="0" width="300" height="310" fill="url(#courtFloorGrad)" />

                          {/* ── ZONE FILLS (back to front) ── */}

                          {/* 3-Point zone */}
                          <path
                            d={`M 0,0 L 300,0 L 300,310 L 0,310 Z M 44,310 L 44,120 A 106,106 0 0,1 256,120 L 256,310 Z`}
                            fill={`url(#zoneGrad_three)`}
                            fillRule="evenodd"
                            opacity={zFill('three')}
                            style={{ cursor: 'pointer', transition: 'opacity 0.5s ease' }}
                            onClick={() => handleZoneTap('three')}
                            filter={activeKey === 'three' ? `url(#${glowId('three')})` : undefined}
                          />

                          {/* Mid-range zone */}
                          <path
                            d={`M 44,310 L 44,120 A 106,106 0 0,1 256,120 L 256,310 Z M 104,310 L 104,100 L 196,100 L 196,310 Z`}
                            fill={`url(#zoneGrad_mid)`}
                            fillRule="evenodd"
                            opacity={zFill('mid')}
                            style={{ cursor: 'pointer', transition: 'opacity 0.5s ease' }}
                            onClick={() => handleZoneTap('mid')}
                            filter={activeKey === 'mid' ? `url(#${glowId('mid')})` : undefined}
                          />

                          {/* Paint / Close 2 */}
                          <rect
                            x="104" y="100" width="92" height="210" rx="2"
                            fill={`url(#zoneGrad_close2)`}
                            opacity={zFill('close2')}
                            style={{ cursor: 'pointer', transition: 'opacity 0.5s ease' }}
                            onClick={() => handleZoneTap('close2')}
                            filter={activeKey === 'close2' ? `url(#${glowId('close2')})` : undefined}
                          />

                          {/* Rim zone */}
                          <circle
                            cx="150" cy="272" r="28"
                            fill={`url(#zoneGrad_rim)`}
                            opacity={zFill('rim')}
                            style={{ cursor: 'pointer', transition: 'opacity 0.5s ease' }}
                            onClick={() => handleZoneTap('rim')}
                            filter={activeKey === 'rim' ? `url(#${glowId('rim')})` : undefined}
                          />

                          {/* Vignette overlay */}
                          <rect x="0" y="0" width="300" height="310" fill="url(#courtVignette)" pointerEvents="none" />

                          {/* ── COURT LINES ── */}
                          <rect x="0.5" y="0.5" width="299" height="309" rx="2" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                          <path d="M 44,310 L 44,120 A 106,106 0 0,1 256,120 L 256,310" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                          <rect x="104" y="100" width="92" height="210" rx="1" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                          {/* FT circle */}
                          <path d="M 122,100 A 28,28 0 0,1 178,100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                          <path d="M 122,100 A 28,28 0 0,0 178,100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeDasharray="3 3" />
                          {/* Restricted area */}
                          <circle cx="150" cy="272" r="28" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                          {/* Hash marks */}
                          {[118, 134, 150, 168].map(y => (
                            <React.Fragment key={`hash_${y}`}>
                              <line x1="98" y1={y} x2="104" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                              <line x1="196" y1={y} x2="202" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                            </React.Fragment>
                          ))}
                          {/* Basket + backboard */}
                          <line x1="140" y1="302" x2="160" y2="302" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="150" cy="293" r="4" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
                          <line x1="147" y1="297" x2="148.5" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
                          <line x1="150" y1="297" x2="150" y2="301" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
                          <line x1="153" y1="297" x2="151.5" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />

                          {/* ── SELECTED ZONE HIGHLIGHT ── */}
                          {activeKey === 'rim' && <circle cx="150" cy="272" r="32" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"><animate attributeName="opacity" values="0.15;0.4;0.15" dur="2.5s" repeatCount="indefinite" /></circle>}
                          {activeKey === 'close2' && <rect x="101" y="97" width="98" height="216" rx="3" fill="none" stroke="white" strokeWidth="1.5" opacity="0.25"><animate attributeName="opacity" values="0.12;0.35;0.12" dur="2.5s" repeatCount="indefinite" /></rect>}
                          {activeKey === 'mid' && <path d="M 44,310 L 44,120 A 106,106 0 0,1 256,120 L 256,310" fill="none" stroke="white" strokeWidth="1.5" opacity="0.2"><animate attributeName="opacity" values="0.1;0.3;0.1" dur="2.5s" repeatCount="indefinite" /></path>}
                          {activeKey === 'three' && <rect x="1" y="1" width="298" height="308" rx="2" fill="none" stroke="white" strokeWidth="1.5" opacity="0.15"><animate attributeName="opacity" values="0.08;0.25;0.08" dur="2.5s" repeatCount="indefinite" /></rect>}

                          {/* ── ZONE LABELS (carefully positioned to avoid ALL overlap) ── */}

                          {/* 3-POINT — top center, well above the arc */}
                          <g onClick={() => handleZoneTap('three')} style={{ cursor: 'pointer' }}>
                            <rect x="108" y="10" width="84" height={isMobile ? 66 : 72} rx="8" fill="rgba(0,0,0,0.5)" stroke={activeKey === 'three' ? `${zoneMap.three.color}40` : 'rgba(255,255,255,0.04)'} strokeWidth="1" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.1s' }} />
                            <text x="150" y="27" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={ns} fontWeight="700" letterSpacing="0.1em" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.15s' }}>3-POINT</text>
                            <text x="150" y={isMobile ? 48 : 52} textAnchor="middle" fill="white" fontFamily={mono} fontSize={fs + 1} fontWeight="900" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.2s' }}>{zoneMap.three.offFg.toFixed(1)}%</text>
                            <text x="150" y={isMobile ? 62 : 67} textAnchor="middle" fill={zoneMap.three.color} fontFamily={mono} fontSize={isMobile ? 8 : 9} fontWeight="700" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.3s' }}>#{zoneMap.three.offRank} OFF  ·  #{zoneMap.three.defRank} DEF</text>
                            <text x="150" y={isMobile ? 73 : 79} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={ss} fontWeight="600" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.35s' }}>{zoneMap.three.offShare.toFixed(0)}% of shots</text>
                          </g>

                          {/* MID-RANGE — left wing, vertically centered in the mid zone */}
                          <g onClick={() => handleZoneTap('mid')} style={{ cursor: 'pointer' }}>
                            <rect x="8" y="170" width="78" height={isMobile ? 60 : 66} rx="8" fill="rgba(0,0,0,0.55)" stroke={activeKey === 'mid' ? `${zoneMap.mid.color}40` : 'rgba(255,255,255,0.04)'} strokeWidth="1" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.1s' }} />
                            <text x="47" y="186" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={ns} fontWeight="700" letterSpacing="0.1em" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.15s' }}>MID-RANGE</text>
                            <text x="47" y={isMobile ? 204 : 207} textAnchor="middle" fill="white" fontFamily={mono} fontSize={fs} fontWeight="900" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.2s' }}>{zoneMap.mid.offFg.toFixed(1)}%</text>
                            <text x="47" y={isMobile ? 216 : 220} textAnchor="middle" fill={zoneMap.mid.color} fontFamily={mono} fontSize={isMobile ? 7.5 : 8.5} fontWeight="700" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.3s' }}>#{zoneMap.mid.offRank} · #{zoneMap.mid.defRank}</text>
                            <text x="47" y={isMobile ? 228 : 233} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={ss} fontWeight="600" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.35s' }}>{zoneMap.mid.offShare.toFixed(0)}% of shots</text>
                          </g>

                          {/* PAINT — center of key, well above the rim zone */}
                          <g onClick={() => handleZoneTap('close2')} style={{ cursor: 'pointer' }}>
                            <rect x="113" y="120" width="74" height={isMobile ? 70 : 76} rx="8" fill="rgba(0,0,0,0.5)" stroke={activeKey === 'close2' ? `${zoneMap.close2.color}40` : 'rgba(255,255,255,0.04)'} strokeWidth="1" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.1s' }} />
                            <text x="150" y="137" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={ns} fontWeight="700" letterSpacing="0.1em" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.15s' }}>PAINT</text>
                            <text x="150" y={isMobile ? 160 : 163} textAnchor="middle" fill="white" fontFamily={mono} fontSize={fs + 4} fontWeight="900" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.2s' }}>{zoneMap.close2.offFg.toFixed(1)}%</text>
                            <text x="150" y={isMobile ? 175 : 179} textAnchor="middle" fill={zoneMap.close2.color} fontFamily={mono} fontSize={isMobile ? 8.5 : 9.5} fontWeight="700" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.3s' }}>#{zoneMap.close2.offRank} OFF  ·  #{zoneMap.close2.defRank} DEF</text>
                            <text x="150" y={isMobile ? 186 : 192} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={ss} fontWeight="600" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.35s' }}>{zoneMap.close2.offShare.toFixed(0)}% of shots</text>
                          </g>

                          {/* RIM — compact, right wing to avoid basket overlap */}
                          <g onClick={() => handleZoneTap('rim')} style={{ cursor: 'pointer' }}>
                            <rect x="214" y="248" width="78" height={isMobile ? 48 : 52} rx="8" fill="rgba(0,0,0,0.6)" stroke={activeKey === 'rim' ? `${zoneMap.rim.color}40` : 'rgba(255,255,255,0.04)'} strokeWidth="1" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.1s' }} />
                            <text x="253" y="262" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={ns} fontWeight="700" letterSpacing="0.1em" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.15s' }}>RIM</text>
                            <text x="253" y={isMobile ? 278 : 280} textAnchor="middle" fill="white" fontFamily={mono} fontSize={fs} fontWeight="900" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.2s' }}>{zoneMap.rim.offFg.toFixed(1)}%</text>
                            <text x="253" y={isMobile ? 288 : 291} textAnchor="middle" fill={zoneMap.rim.color} fontFamily={mono} fontSize={isMobile ? 7 : 8} fontWeight="700" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.3s' }}>#{zoneMap.rim.offRank} · #{zoneMap.rim.defRank}</text>
                            <text x="253" y={isMobile ? 298 : 301} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={ss} fontWeight="600" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.35s' }}>{zoneMap.rim.offShare.toFixed(0)}% of shots</text>
                          </g>

                          {/* ── Edge label badges ON the court ── */}
                          {Object.entries(zoneMap).map(([key, z]) => {
                            const pos = key === 'three' ? { x: 260, y: 55 } : key === 'mid' ? { x: 47, y: 235 } : key === 'close2' ? { x: 150, y: 210 } : { x: 253, y: 300 };
                            const w = z.edgeLabel.length * 5.5 + 12;
                            return (
                              <g key={`badge_${key}`} onClick={() => handleZoneTap(key)} style={{ cursor: 'pointer' }}>
                                <rect x={pos.x - w/2} y={pos.y - 8} width={w} height="16" rx="8" fill={z.color} fillOpacity={isVisible ? 0.2 : 0} stroke={z.color} strokeOpacity={isVisible ? 0.3 : 0} strokeWidth="0.8" style={{ transition: 'fill-opacity 0.5s ease 0.4s, stroke-opacity 0.5s ease 0.4s' }} />
                                <text x={pos.x} y={pos.y + 3.5} textAnchor="middle" fill={z.color} fontSize="7.5" fontWeight="800" letterSpacing="0.06em" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s ease 0.45s' }}>{z.edgeLabel}</text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      {/* ── SHOT DISTRIBUTION BAR ── */}
                      <div style={{ marginTop: '10px', padding: '0 2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>SHOT DISTRIBUTION</span>
                          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>{offA}'s shot attempts by zone</span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px', height: '28px', borderRadius: '6px', overflow: 'hidden' }}>
                          {offSorted.map((z, i) => {
                            const zm = zoneMap[z.key];
                            const isActive = activeKey === z.key;
                            return (
                              <div
                                key={`distBar_${z.key}`}
                                onClick={() => handleZoneTap(z.key)}
                                style={{
                                  flex: z.offShare,
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                  background: isActive ? `${zm.color}25` : `${zm.color}12`,
                                  border: isActive ? `1px solid ${zm.color}40` : '1px solid transparent',
                                  borderRadius: i === 0 ? '6px 0 0 6px' : i === offSorted.length - 1 ? '0 6px 6px 0' : '0',
                                  cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative',
                                  minWidth: isMobile ? '40px' : '50px',
                                }}
                              >
                                <span style={{ fontSize: isMobile ? '11px' : '13px', fontWeight: '900', color: zm.color, fontFamily: mono, lineHeight: 1 }}>
                                  {z.offShare.toFixed(0)}%
                                </span>
                                <span style={{ fontSize: isMobile ? '7px' : '8px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', marginTop: '1px' }}>
                                  {z.shortLabel}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* ── DETAIL PANEL (below court) ── */}
                      {active && (() => {
                        const offFgColor = statColor(active.offFg, active.avg, true);
                        const defFgColor = statColor(active.defFg, active.avg, false);
                        const isGoTo = active.key === goToKey;
                        const isWeak = active.key === defWeakKey;
                        const isStrong = active.key === defStrongKey;
                        const offDiff = active.offFg - active.avg;
                        const defDiff = active.defFg - active.avg;

                        return (
                          <div style={{
                            marginTop: '10px', padding: isMobile ? '12px 14px' : '14px 16px', borderRadius: '10px',
                            background: `linear-gradient(135deg, ${active.color}08 0%, rgba(15,23,42,0.4) 100%)`,
                            border: `1px solid ${active.color}15`,
                            position: 'relative', overflow: 'hidden',
                          }}>
                            {/* Top accent */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${active.color}50, transparent)` }} />

                            {/* Zone header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '800', color: 'rgba(255,255,255,0.9)' }}>{active.label}</span>
                              <span style={{ fontSize: '9px', fontWeight: '800', color: active.color, padding: '2px 8px', borderRadius: '4px', background: `${active.color}18`, border: `1px solid ${active.color}20`, letterSpacing: '0.05em' }}>{active.edgeLabel}</span>
                              {isGoTo && <span style={{ fontSize: '8px', fontWeight: '800', color: '#A78BFA', padding: '2px 6px', borderRadius: '4px', background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.15)' }}>GO-TO ZONE</span>}
                              {isWeak && <span style={{ fontSize: '8px', fontWeight: '800', color: '#F87171', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.1)' }}>WEAK DEFENSE</span>}
                              {isStrong && <span style={{ fontSize: '8px', fontWeight: '800', color: '#10B981', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.1)' }}>STRONG DEFENSE</span>}
                            </div>

                            {/* Side-by-side stat cards */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                              {/* Offense */}
                              <div style={{ flex: 1, padding: isMobile ? '8px' : '10px', borderRadius: '8px', background: `${offFgColor}08`, border: `1px solid ${offFgColor}15`, textAlign: 'center' }}>
                                <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginBottom: '3px' }}>{offA} SHOOTS</div>
                                <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', color: offFgColor, fontFamily: mono, lineHeight: '1.1' }}>{active.offFg.toFixed(1)}%</div>
                                <div style={{ fontSize: '9px', fontWeight: '700', color: offFgColor, marginTop: '3px' }}>#{active.offRank} in D1</div>
                              </div>
                              {/* Defense */}
                              <div style={{ flex: 1, padding: isMobile ? '8px' : '10px', borderRadius: '8px', background: `${defFgColor}08`, border: `1px solid ${defFgColor}15`, textAlign: 'center' }}>
                                <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginBottom: '3px' }}>{defA} ALLOWS</div>
                                <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', color: defFgColor, fontFamily: mono, lineHeight: '1.1' }}>{active.defFg.toFixed(1)}%</div>
                                <div style={{ fontSize: '9px', fontWeight: '700', color: defFgColor, marginTop: '3px' }}>#{active.defRank} in D1</div>
                              </div>
                              {/* Verdict */}
                              <div style={{ width: isMobile ? '70px' : '80px', padding: isMobile ? '8px 4px' : '10px 6px', borderRadius: '8px', background: `${active.color}10`, border: `1px solid ${active.color}18`, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '800', color: active.color, letterSpacing: '0.04em', lineHeight: '1.3' }}>{active.edgeLabel}</div>
                              </div>
                            </div>

                            {/* Volume + D1 context */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>D1 avg: {active.avg.toFixed(0)}% FG · {active.offShare.toFixed(0)}% of {offA}'s shots</span>
                              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{active.offRank < active.defRank ? `${offA} has the edge` : active.defRank < active.offRank ? `${defA} has the edge` : 'Even matchup'}</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Matchup insight verdict */}
                      {(() => {
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
                            marginTop: '8px', padding: '10px 12px', borderRadius: '10px',
                            background: `${matchupColor}06`, borderLeft: `3px solid ${matchupColor}30`,
                          }}>
                            <div style={{ fontSize: '9px', fontWeight: '700', color: matchupColor, letterSpacing: '0.06em', marginBottom: '4px' }}>
                              {goToMatchesWeak ? 'FAVORABLE MATCHUP' : goToMatchesStrong ? 'TOUGH MATCHUP' : 'MIXED MATCHUP'}
                            </div>
                            <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>{matchupInsight}</span>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}

                {/* Zone-by-zone data is now integrated into the effectiveness map above */}
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
          SECTION 5: PATH TO VICTORY
         ═══════════════════════════════════════════════════════════ */}
      <div style={{ padding: pad, background: 'linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(2,6,23,0.8) 100%)' }}>
        {(() => {
          // Build 5 checkpoints for the offense's path to victory
          const offEfgRank = offTeam.eFG_off_rank || 182;
          const defEfgRank = defTeam.eFG_def_rank || 182;
          const offToRank = offTeam.to_off_rank || 182;
          const defToRank = defTeam.to_def_rank || 182;
          const offOrebRank = offTeam.oreb_off_rank || 182;
          const defOrebRank = defTeam.oreb_def_rank || 182;
          const offFtRank = offTeam.ftRate_off_rank || 182;
          const defFtRank = defTeam.ftRate_def_rank || 182;

          // Scoring zone advantage (from PBP data if available)
          const goToZone = hasPBP ? (() => {
            const offPBP2 = isAwayView ? awayPBP : homePBP;
            const defPBP2 = isAwayView ? homePBP : awayPBP;
            if (!offPBP2 || !defPBP2) return null;
            const zones = [
              { name: 'Rim', offFg: offPBP2.dunks_off_fg, share: offPBP2.dunks_off_share, defFg: defPBP2.dunks_def_fg, offField: 'dunks_off_fg', defField: 'dunks_def_fg' },
              { name: 'Paint', offFg: offPBP2.close2_off_fg, share: offPBP2.close2_off_share, defFg: defPBP2.close2_def_fg, offField: 'close2_off_fg', defField: 'close2_def_fg' },
              { name: 'Mid', offFg: offPBP2.far2_off_fg, share: offPBP2.far2_off_share, defFg: defPBP2.far2_def_fg, offField: 'far2_off_fg', defField: 'far2_def_fg' },
              { name: '3PT', offFg: offPBP2.three_off_fg, share: offPBP2.three_off_share, defFg: defPBP2.three_def_fg, offField: 'three_off_fg', defField: 'three_def_fg' },
            ].sort((a, b) => b.share - a.share);
            const goTo = zones[0];
            const goToOffRank = getZoneRank(offPBP2, goTo.offField, false);
            const goToDefRank = getZoneRank(defPBP2, goTo.defField, true);
            return { ...goTo, offRank: goToOffRank, defRank: goToDefRank, win: goToOffRank < goToDefRank };
          })() : null;

          const checkpoints = [
            {
              id: 'scoring',
              label: 'SCORING ZONE',
              question: goToZone ? `${offA} prefers ${goToZone.name} (${goToZone.share.toFixed(0)}%) — can they exploit it?` : `Does ${offA} have a go-to scoring zone advantage?`,
              win: goToZone ? goToZone.win : offEfgRank < defEfgRank,
              offLabel: goToZone ? `#${goToZone.offRank} ${goToZone.name} OFF` : `#${offEfgRank} OFF`,
              defLabel: goToZone ? `#${goToZone.defRank} ${goToZone.name} DEF` : `#${defEfgRank} DEF`,
              icon: '🎯',
            },
            {
              id: 'shooting',
              label: 'SHOOTING',
              question: `Can ${offA} shoot over ${defA}'s defense?`,
              win: offEfgRank < defEfgRank,
              offLabel: `#${offEfgRank} eFG% OFF`,
              defLabel: `#${defEfgRank} eFG% DEF`,
              icon: '🏀',
            },
            {
              id: 'rebounding',
              label: 'GLASS CONTROL',
              question: `Can ${offA} get second chances on the boards?`,
              win: offOrebRank < defOrebRank,
              offLabel: `#${offOrebRank} OREB`,
              defLabel: `#${defOrebRank} DREB`,
              icon: '💪',
            },
            {
              id: 'freeThrows',
              label: 'FREE THROWS',
              question: `Does ${offA} get to the line against ${defA}?`,
              win: offFtRank < defFtRank,
              offLabel: `#${offFtRank} FT Rate`,
              defLabel: `#${defFtRank} FT Allowed`,
              icon: '🔥',
            },
            {
              id: 'turnovers',
              label: 'BALL SECURITY',
              question: `Can ${offA} protect the ball vs ${defA}'s pressure?`,
              win: offToRank < defToRank,
              offLabel: `#${offToRank} Ball Sec`,
              defLabel: `#${defToRank} Pressure`,
              icon: '🛡️',
            },
          ];

          const totalWins = checkpoints.filter(c => c.win).length;
          const pathColor = totalWins >= 4 ? '#10B981' : totalWins >= 3 ? '#22D3EE' : totalWins >= 2 ? '#F59E0B' : '#EF4444';
          const pathLabel = totalWins >= 4 ? 'CLEAR PATH' : totalWins >= 3 ? 'PROBABLE PATH' : totalWins >= 2 ? 'NARROW PATH' : 'UPHILL BATTLE';

          return (
            <div style={{ padding: isMobile ? '16px' : '20px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(15,23,42,0.5) 0%, rgba(8,12,28,0.8) 100%)', border: `1px solid ${pathColor}12`, position: 'relative', overflow: 'hidden' }}>
              {/* Top accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${pathColor}40, transparent)` }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: pathColor, animation: 'mi5-pulse 2s infinite' }} />
                  <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>PATH TO VICTORY</span>
                </div>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>{offA}'s offensive checklist</span>
              </div>

              {/* Score banner */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: isMobile ? '10px 12px' : '12px 16px', borderRadius: '10px', marginBottom: '14px',
                background: `${pathColor}08`, border: `1px solid ${pathColor}15`,
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: isMobile ? '28px' : '34px', fontWeight: '900', color: pathColor, fontFamily: mono, lineHeight: 1 }}>
                    {totalWins}/5
                  </span>
                  <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)' }}>checkpoints cleared</span>
                </div>
                <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '800', color: pathColor, padding: '4px 10px', borderRadius: '6px', background: `${pathColor}15`, border: `1px solid ${pathColor}20`, letterSpacing: '0.06em' }}>
                  {pathLabel}
                </span>
              </div>

              {/* Checkpoint rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                {checkpoints.map((cp, idx) => {
                  const color = cp.win ? '#10B981' : '#EF4444';
                  return (
                    <div key={cp.id} style={{
                      display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '10px',
                      padding: isMobile ? '10px 12px' : '12px 14px', borderRadius: '10px',
                      background: cp.win ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.03)',
                      border: `1px solid ${color}10`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                      transition: `opacity 0.4s ease ${idx * 0.08}s, transform 0.4s ease ${idx * 0.08}s`,
                    }}>
                      {/* Win/Loss indicator */}
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${color}15`, border: `1px solid ${color}25`,
                        fontSize: '11px',
                      }}>
                        {cp.win ? '✓' : '✗'}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}>{cp.label}</span>
                        </div>
                        <div style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.3' }}>{cp.question}</div>
                      </div>

                      {/* Rank comparison */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                        <span style={{ fontSize: isMobile ? '8px' : '9px', fontWeight: '700', color: cp.win ? '#10B981' : 'rgba(255,255,255,0.4)', fontFamily: mono }}>{cp.offLabel}</span>
                        <span style={{ fontSize: isMobile ? '8px' : '9px', fontWeight: '700', color: !cp.win ? '#EF4444' : 'rgba(255,255,255,0.4)', fontFamily: mono }}>{cp.defLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {checkpoints.map((cp, i) => (
                    <div key={`bar_${i}`} style={{
                      flex: 1, height: '6px', borderRadius: '3px',
                      background: cp.win ? pathColor : 'rgba(255,255,255,0.06)',
                      boxShadow: cp.win ? `0 0 8px ${pathColor}30` : 'none',
                      transition: `background 0.4s ease ${i * 0.1}s`,
                    }} />
                  ))}
                </div>
              </div>

              {/* Verdict */}
              <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: 'white', marginBottom: '4px', lineHeight: '1.3' }}>
                {totalWins >= 4
                  ? `${offA} has a clear path to victory.`
                  : totalWins >= 3
                  ? `${offA} has a probable path, but ${defA} can disrupt it.`
                  : totalWins >= 2
                  ? `${offA} has a narrow path — needs execution in key areas.`
                  : `${offA} faces an uphill battle. ${defA} controls most checkpoints.`
                }
              </div>
              <div style={{ fontSize: isMobile ? '11px' : '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                {totalWins >= 4
                  ? `${offA} clears ${totalWins} of 5 offensive checkpoints. When teams check this many boxes, scoring comes easy.`
                  : totalWins >= 3
                  ? `${totalWins} of 5 checkpoints cleared. The ${checkpoints.filter(c => !c.win).map(c => c.label.toLowerCase()).join(' and ')} ${checkpoints.filter(c => !c.win).length > 1 ? 'are' : 'is'} where ${defA} can make a stand.`
                  : totalWins >= 2
                  ? `Only ${totalWins} checkpoints cleared. ${defA} has the defensive edge in ${checkpoints.filter(c => !c.win).map(c => c.label.toLowerCase()).join(', ')}. ${offA} will need to overperform.`
                  : `${defA} owns ${5 - totalWins} of 5 defensive checkpoints. ${offA} needs a special performance to overcome this.`
                }
              </div>
            </div>
          );
        })()}

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <span style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.2em' }}>SAVANT ANALYTICS</span>
        </div>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
