/**
 * 🏀 ADVANCED MATCHUP INTELLIGENCE v2
 * Premium analytics with CORRECT interpretation
 * 
 * KEY LOGIC:
 * - Efficiency: 100 = D1 Average. Higher Off = Good. LOWER Def = Good.
 * - For Defense: Lower eFG% allowed, lower OREB% allowed, lower FTR allowed = GOOD
 * - Turnovers: Lower off TO% = good. Higher def TO% forced = good (bad for offense)
 */

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, TrendingUp, TrendingDown, Shield, Target, Zap, BarChart3, Activity, Info, Award, Crown } from 'lucide-react';

// D1 Averages for context
const D1_AVERAGES = {
  efficiency: 100,
  eFG: 50.0,
  turnover: 18.0,
  oreb: 28.0,
  ftRate: 30.0,
  twoP: 50.0,
  threeP: 34.0
};

// Total D1 teams for percentile calc
const TOTAL_TEAMS = 364;

interface AdvancedMatchupCardProps {
  barttorvik: {
    away: TeamStats;
    home: TeamStats;
    matchup: MatchupAnalysis;
  };
  awayTeam: string;
  homeTeam: string;
}

interface TeamStats {
  rank: number;
  adjOff: number;
  adjOff_rank: number;
  adjDef: number;
  adjDef_rank: number;
  eFG_off: number;
  eFG_off_rank?: number;
  eFG_def: number;
  eFG_def_rank?: number;
  to_off: number;
  to_off_rank?: number;
  to_def: number;
  to_def_rank?: number;
  oreb_off: number;
  oreb_off_rank?: number;
  oreb_def: number;
  oreb_def_rank?: number;
  ftRate_off?: number;
  ftRate_off_rank?: number;
  ftRate_def?: number;
  ftRate_def_rank?: number;
  twoP_off: number;
  threeP_off: number;
}

interface MatchupAnalysis {
  rankAdvantage: 'away' | 'home';
  rankDiff: number;
  offAdvantage: 'away' | 'home';
  offDiff: string;
  defAdvantage: 'away' | 'home';
  awayOffVsHomeDef: string;
  homeOffVsAwayDef: string;
}

type ViewMode = 'awayOff_homeDef' | 'homeOff_awayDef';

// Get percentile from rank (1 = 100th percentile, 364 = 0th)
const getPercentile = (rank: number) => Math.round((1 - (rank - 1) / (TOTAL_TEAMS - 1)) * 100);

// Get tier label and color based on rank percentile
const getTierFromRank = (rank: number) => {
  const pct = getPercentile(rank);
  if (pct >= 90) return { tier: 'ELITE', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
  if (pct >= 75) return { tier: 'EXCELLENT', color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.15)' };
  if (pct >= 55) return { tier: 'ABOVE AVG', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' };
  if (pct >= 40) return { tier: 'AVERAGE', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
  if (pct >= 20) return { tier: 'BELOW AVG', color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' };
  return { tier: 'POOR', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
};

// Helper for efficiency context
const getEfficiencyContext = (value: number, isDefense: boolean) => {
  const diff = isDefense ? D1_AVERAGES.efficiency - value : value - D1_AVERAGES.efficiency;
  
  if (diff >= 15) return { tier: 'ELITE', color: '#10B981' };
  if (diff >= 8) return { tier: 'EXCELLENT', color: '#22D3EE' };
  if (diff >= 3) return { tier: 'ABOVE AVG', color: '#3B82F6' };
  if (diff >= -3) return { tier: 'AVERAGE', color: '#F59E0B' };
  if (diff >= -8) return { tier: 'BELOW AVG', color: '#F97316' };
  return { tier: 'POOR', color: '#EF4444' };
};

export function AdvancedMatchupCard({ barttorvik, awayTeam, homeTeam }: AdvancedMatchupCardProps) {
  const [view, setView] = useState<ViewMode>('awayOff_homeDef');
  const [animated, setAnimated] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!barttorvik) return null;

  const { away, home } = barttorvik;

  // Current view configuration
  const isAwayOffView = view === 'awayOff_homeDef';
  const offTeam = isAwayOffView ? away : home;
  const defTeam = isAwayOffView ? home : away;
  const offTeamName = isAwayOffView ? awayTeam : homeTeam;
  const defTeamName = isAwayOffView ? homeTeam : awayTeam;

  // Get tiers based on RANKS (more accurate than raw values)
  const offTier = getTierFromRank(offTeam.adjOff_rank || 182);
  const defTier = getTierFromRank(defTeam.adjDef_rank || 182);

  // Edge calculation: offense efficiency vs defense efficiency
  // Positive = offense projects to score well
  const efficiencyEdge = offTeam.adjOff - defTeam.adjDef;

  // Context vs average
  const offVsAvg = offTeam.adjOff - D1_AVERAGES.efficiency;
  const defVsAvg = defTeam.adjDef - D1_AVERAGES.efficiency; // Positive = BAD defense

  // Is defense good or bad? (Lower = Better for defense)
  const isGoodDefense = defTeam.adjDef < D1_AVERAGES.efficiency;
  const isEliteDefense = defTeam.adjDef < 95;
  const isPoorDefense = defTeam.adjDef > 105;
  
  const isGoodOffense = offTeam.adjOff > D1_AVERAGES.efficiency;
  const isEliteOffense = offTeam.adjOff > 110;

  // Smart narrative
  const getMatchupNarrative = () => {
    if (isEliteOffense && isPoorDefense) {
      return { text: `High-scoring opportunity — elite offense vs weak defense`, icon: '🔥' };
    }
    if (isGoodOffense && isPoorDefense) {
      return { text: `Offensive advantage — should find scoring opportunities`, icon: '⚡' };
    }
    if (isEliteOffense && isEliteDefense) {
      return { text: `Clash of titans — top offense meets lockdown defense`, icon: '⚔️' };
    }
    if (isGoodOffense && isGoodDefense) {
      return { text: `Competitive matchup — both units above average`, icon: '⚖️' };
    }
    if (!isGoodOffense && isEliteDefense) {
      return { text: `Scoring will be difficult against this elite defense`, icon: '🛡️' };
    }
    if (!isGoodOffense && isGoodDefense) {
      return { text: `Offensive struggle expected — facing better defense`, icon: '📉' };
    }
    if (!isGoodOffense && !isGoodDefense) {
      return { text: `Both units below average — unpredictable outcome`, icon: '❓' };
    }
    return { text: `Moderate matchup advantage`, icon: '📊' };
  };

  const narrative = getMatchupNarrative();

  // Calculate edge score (0-100)
  // Based on: efficiency edge + Four Factors edges
  const calculateEdgeScore = () => {
    let score = 50;
    
    // Efficiency edge: big impact
    score += efficiencyEdge * 2;
    
    // Shooting edge (off eFG vs def eFG allowed)
    // Higher off eFG = good, LOWER def eFG allowed = good defense (bad for this offense)
    const shootingEdge = offTeam.eFG_off - defTeam.eFG_def;
    score += shootingEdge * 1.2;
    
    // Turnover edge (lower off TO = good, higher def TO forced = bad for offense)
    const toEdge = defTeam.to_def - offTeam.to_off; // Positive = defense forces more TOs
    score -= toEdge * 0.8;
    
    // Rebounding edge (higher off OREB = good, LOWER def OREB allowed = good D)
    const rebEdge = offTeam.oreb_off - defTeam.oreb_def;
    score += rebEdge * 0.5;
    
    return Math.max(10, Math.min(90, Math.round(score)));
  };

  const edgeScore = calculateEdgeScore();

  // Edge color and label
  const getEdgeInfo = (score: number) => {
    if (score >= 70) return { color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', label: 'STRONG EDGE', desc: 'Offense has clear advantages in this matchup' };
    if (score >= 60) return { color: '#22D3EE', glow: 'rgba(34, 211, 238, 0.4)', label: 'FAVORABLE', desc: 'Offense should find success against this defense' };
    if (score >= 50) return { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', label: 'EVEN', desc: 'No significant advantage — could go either way' };
    if (score >= 40) return { color: '#F97316', glow: 'rgba(249, 115, 22, 0.4)', label: 'CHALLENGING', desc: 'Defense has the edge — scoring may be difficult' };
    return { color: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)', label: 'MISMATCH', desc: 'Defense holds significant advantages' };
  };

  const edgeInfo = getEdgeInfo(edgeScore);

  /**
   * FOUR FACTORS - CORRECT LOGIC:
   * 
   * 1. SHOOTING (eFG%)
   *    - Offense: Higher eFG% = Good
   *    - Defense: LOWER eFG% allowed = Good (harder to score against)
   *    - Edge for offense = Off eFG% - Def eFG% allowed
   *    - If positive: Offense shoots better than D typically allows
   * 
   * 2. TURNOVERS (TO%)
   *    - Offense: LOWER TO% = Good (protects the ball)
   *    - Defense: Higher TO% forced = Good (creates turnovers)
   *    - Edge for offense = Def TO forced - Off TO rate (flipped!)
   *    - If negative: Offense takes care of ball vs D's pressure
   * 
   * 3. REBOUNDING (OREB%)
   *    - Offense: Higher OREB% = Good (more second chances)
   *    - Defense: LOWER OREB% allowed = Good (limits second chances)
   *    - Edge for offense = Off OREB% - Def OREB% allowed
   *    - If positive: Offense should grab extra boards
   * 
   * 4. FREE THROWS (FT Rate)
   *    - Offense: Higher FT Rate = Good (gets to line)
   *    - Defense: LOWER FT Rate allowed = Good (keeps off line)
   *    - Edge for offense = Off FT Rate - Def FT Rate allowed
   *    - If positive: Offense should draw fouls
   */
  const fourFactors = [
    {
      key: 'shooting',
      label: 'Shooting (eFG%)',
      icon: '🎯',
      offValue: offTeam.eFG_off,
      defValue: defTeam.eFG_def,
      avg: D1_AVERAGES.eFG,
      // Offense: higher is better
      offIsGood: offTeam.eFG_off > D1_AVERAGES.eFG,
      // Defense: LOWER allowed is better (means D is good = bad for offense)
      defIsGood: defTeam.eFG_def < D1_AVERAGES.eFG,
      // Edge: Off - Def (positive = offense advantage)
      edge: offTeam.eFG_off - defTeam.eFG_def,
      offLabel: 'shoots',
      defLabel: 'allows',
      getInsight: (edge: number, offGood: boolean, defGood: boolean) => {
        if (edge > 3) return `${offTeamName} shoots well and ${defTeamName} struggles to defend`;
        if (edge > 0) return `Slight shooting edge — ${offTeamName} should find looks`;
        if (edge > -3) return `${defTeamName}'s defense limits efficiency`;
        return `${defTeamName} is elite at limiting shooting — expect tough looks`;
      }
    },
    {
      key: 'turnovers',
      label: 'Ball Security (TO%)',
      icon: '🏀',
      offValue: offTeam.to_off,
      defValue: defTeam.to_def,
      avg: D1_AVERAGES.turnover,
      // Offense: LOWER is better (fewer TOs)
      offIsGood: offTeam.to_off < D1_AVERAGES.turnover,
      // Defense: HIGHER forced is good for D (bad for O facing them)
      defIsGood: defTeam.to_def > D1_AVERAGES.turnover,
      // Edge: Negative = offense advantage (they don't turn it over vs D that forces them)
      edge: offTeam.to_off - defTeam.to_def,
      offLabel: 'commits',
      defLabel: 'forces',
      getInsight: (edge: number, offGood: boolean, defGood: boolean) => {
        if (edge < -3) return `${offTeamName} protects the ball well vs turnover-prone D`;
        if (edge < 0) return `Ball security favors ${offTeamName}`;
        if (edge < 3) return `${defTeamName} forces turnovers — must be careful`;
        return `${defTeamName} creates havoc — high turnover risk`;
      }
    },
    {
      key: 'rebounding',
      label: 'Second Chances (OREB%)',
      icon: '💪',
      offValue: offTeam.oreb_off,
      defValue: defTeam.oreb_def,
      avg: D1_AVERAGES.oreb,
      // Offense: higher OREB% = better
      offIsGood: offTeam.oreb_off > D1_AVERAGES.oreb,
      // Defense: LOWER OREB% allowed = better D (bad for O)
      defIsGood: defTeam.oreb_def < D1_AVERAGES.oreb,
      // Edge: Off - Def (positive = offense should get more second chances)
      edge: offTeam.oreb_off - defTeam.oreb_def,
      offLabel: 'grabs',
      defLabel: 'allows',
      getInsight: (edge: number, offGood: boolean, defGood: boolean) => {
        if (edge > 5) return `${offTeamName} dominates the glass — expect second chances`;
        if (edge > 0) return `${offTeamName} should grab extra possessions`;
        if (edge > -5) return `${defTeamName} limits second chances`;
        return `${defTeamName} locks down the defensive boards`;
      }
    },
    {
      key: 'freeThrows',
      label: 'Drawing Fouls (FT Rate)',
      icon: '🎪',
      offValue: offTeam.ftRate_off || 30,
      defValue: defTeam.ftRate_def || 30,
      avg: D1_AVERAGES.ftRate,
      // Offense: higher FT rate = better
      offIsGood: (offTeam.ftRate_off || 30) > D1_AVERAGES.ftRate,
      // Defense: LOWER FT rate allowed = better D
      defIsGood: (defTeam.ftRate_def || 30) < D1_AVERAGES.ftRate,
      // Edge: Off - Def
      edge: (offTeam.ftRate_off || 30) - (defTeam.ftRate_def || 30),
      offLabel: 'draws',
      defLabel: 'allows',
      getInsight: (edge: number, offGood: boolean, defGood: boolean) => {
        if (edge > 5) return `${offTeamName} gets to the line and should draw fouls`;
        if (edge > 0) return `Slight edge in drawing contact`;
        if (edge > -5) return `${defTeamName} keeps opponents off the line`;
        return `${defTeamName} rarely fouls — don't expect free points`;
      }
    }
  ];

  // Count advantages (where edge favors offense)
  const advantageCount = fourFactors.filter(f => {
    if (f.key === 'turnovers') return f.edge < 0; // Turnovers: negative = offense advantage
    return f.edge > 0;
  }).length;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 50%, #0F172A 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      overflow: 'hidden',
      boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px -20px ${edgeInfo.glow}`
    }}>
      {/* ═══════════════════════════════════════════════════════════════════════
          HEADER
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(99, 102, 241, 0.06) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
        padding: isMobile ? '14px 18px' : '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={18} color="#A5B4FC" />
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(167, 139, 250, 0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Advanced Analytics
            </div>
            <div style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '800', color: 'white', letterSpacing: '-0.01em' }}>
              Matchup Intelligence
            </div>
          </div>
        </div>

        <button
          onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            cursor: 'pointer', transition: 'all 0.2s ease'
          }}
        >
          <ArrowRightLeft size={13} color="#A5B4FC" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#C7D2FE' }}>FLIP</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          OVERALL RANKINGS COMPARISON
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '20px 18px 0' : '24px 28px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)',
          borderRadius: '14px',
          padding: '16px 20px',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Offense Team Rank */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: '6px' }}>
              {offTeamName.toUpperCase()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '900',
                color: '#3B82F6',
                fontFamily: 'ui-monospace, monospace'
              }}>
                #{offTeam.adjOff_rank || '—'}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                <div>OFFENSE</div>
                <div style={{ color: offTier.color }}>{getPercentile(offTeam.adjOff_rank || 182)}th %ile</div>
              </div>
            </div>
          </div>

          {/* VS */}
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            padding: '8px 12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>VS</span>
            <div style={{ fontSize: '10px', fontWeight: '700', color: edgeInfo.color }}>
              {Math.abs(((offTeam.adjOff_rank || 182) - (defTeam.adjDef_rank || 182)))} spot diff
            </div>
          </div>

          {/* Defense Team Rank */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: '6px' }}>
              {defTeamName.toUpperCase()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '900',
                color: '#EF4444',
                fontFamily: 'ui-monospace, monospace'
              }}>
                #{defTeam.adjDef_rank || '—'}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                <div>DEFENSE</div>
                <div style={{ color: defTier.color }}>{getPercentile(defTeam.adjDef_rank || 182)}th %ile</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          EDGE SCORE METER
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: isMobile ? '28px 20px' : '36px 32px',
        background: `radial-gradient(ellipse at center, ${edgeInfo.glow}10 0%, transparent 70%)`,
        textAlign: 'center'
      }}>
        {/* Edge Score Ring */}
        <div style={{ position: 'relative', width: isMobile ? '150px' : '170px', height: isMobile ? '150px' : '170px', margin: '0 auto 20px' }}>
          <svg width="100%" height="100%" viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="85" cy="85" r="72" fill="none" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="10" />
            <circle
              cx="85" cy="85" r="72" fill="none"
              stroke={edgeInfo.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${animated ? edgeScore * 4.52 : 0} 452`}
              style={{ filter: `drop-shadow(0 0 8px ${edgeInfo.glow})`, transition: 'stroke-dasharray 1.2s ease-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              fontSize: isMobile ? '36px' : '44px',
              fontWeight: '900',
              color: edgeInfo.color,
              fontFamily: 'ui-monospace, monospace',
              lineHeight: 1,
              textShadow: `0 0 25px ${edgeInfo.glow}`
            }}>
              {animated ? edgeScore : 50}
            </div>
            <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>
              EDGE SCORE
            </div>
          </div>
        </div>

        {/* Verdict Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', borderRadius: '100px',
          background: `${edgeInfo.color}15`,
          border: `1.5px solid ${edgeInfo.color}40`,
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '14px' }}>{narrative.icon}</span>
          <span style={{ fontSize: '12px', fontWeight: '800', color: edgeInfo.color, letterSpacing: '0.06em' }}>
            {edgeInfo.label}
          </span>
        </div>

        {/* Context Description */}
        <div style={{
          fontSize: isMobile ? '12px' : '13px',
          color: 'rgba(255,255,255,0.6)',
          maxWidth: '320px',
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          {edgeInfo.desc}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          EFFICIENCY COMPARISON
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '0 18px 24px' : '0 28px 28px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(71, 85, 105, 0.2)',
          overflow: 'hidden'
        }}>
          {/* Teams Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
            padding: isMobile ? '16px' : '20px',
            background: 'rgba(0,0,0,0.2)',
            borderBottom: '1px solid rgba(71, 85, 105, 0.15)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#3B82F6', letterSpacing: '0.08em', marginBottom: '4px' }}>
                OFFENSE
              </div>
              <div style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>
                {offTeamName}
              </div>
              <div style={{
                display: 'inline-flex', padding: '3px 8px', borderRadius: '6px',
                background: offTier.bg, border: `1px solid ${offTier.color}30`
              }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: offTier.color }}>{offTier.tier}</span>
              </div>
            </div>

            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={16} color="#A5B4FC" />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#EF4444', letterSpacing: '0.08em', marginBottom: '4px' }}>
                DEFENSE
              </div>
              <div style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>
                {defTeamName}
              </div>
              <div style={{
                display: 'inline-flex', padding: '3px 8px', borderRadius: '6px',
                background: defTier.bg, border: `1px solid ${defTier.color}30`
              }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: defTier.color }}>{defTier.tier}</span>
              </div>
            </div>
          </div>

          {/* Efficiency Numbers */}
          <div style={{ padding: isMobile ? '20px 16px' : '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: isMobile ? '30px' : '38px', fontWeight: '900', color: '#3B82F6',
                  fontFamily: 'ui-monospace, monospace', lineHeight: 1
                }}>
                  {offTeam.adjOff.toFixed(1)}
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>
                  ADJ. OFFENSE
                </div>
                <div style={{
                  marginTop: '6px', padding: '3px 8px', borderRadius: '6px', display: 'inline-block',
                  background: offVsAvg >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: offVsAvg >= 0 ? '#10B981' : '#EF4444' }}>
                    {offVsAvg >= 0 ? '+' : ''}{offVsAvg.toFixed(1)} vs avg
                  </span>
                </div>
              </div>

              <div style={{
                padding: '12px 16px', borderRadius: '12px',
                background: efficiencyEdge > 0 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.04) 100%)',
                border: `1px solid ${efficiencyEdge > 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
              }}>
                <div style={{
                  fontSize: isMobile ? '18px' : '20px', fontWeight: '900',
                  color: efficiencyEdge > 0 ? '#10B981' : '#EF4444',
                  fontFamily: 'ui-monospace, monospace'
                }}>
                  {efficiencyEdge > 0 ? '+' : ''}{efficiencyEdge.toFixed(1)}
                </div>
                <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
                  PTS/100
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: isMobile ? '30px' : '38px', fontWeight: '900', color: '#EF4444',
                  fontFamily: 'ui-monospace, monospace', lineHeight: 1
                }}>
                  {defTeam.adjDef.toFixed(1)}
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>
                  ADJ. DEFENSE
                </div>
                <div style={{
                  marginTop: '6px', padding: '3px 8px', borderRadius: '6px', display: 'inline-block',
                  background: defVsAvg <= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: defVsAvg <= 0 ? '#10B981' : '#EF4444' }}>
                    {defVsAvg > 0 ? `+${defVsAvg.toFixed(1)} (weak)` : `${defVsAvg.toFixed(1)} (solid)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick insight */}
            <div style={{
              marginTop: '14px', padding: '10px 14px', borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.12)',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <Info size={13} color="#A5B4FC" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                {narrative.text}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          THE FOUR FACTORS
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '0 18px 24px' : '0 28px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <BarChart3 size={16} color="#A5B4FC" />
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(167, 139, 250, 0.8)', letterSpacing: '0.1em' }}>
            THE FOUR FACTORS
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(167, 139, 250, 0.2)' }} />
          <span style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>
            {advantageCount}/4 favor offense
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
          {fourFactors.map((factor) => {
            // Determine if this factor favors offense
            const favorsOffense = factor.key === 'turnovers' 
              ? factor.edge < 0 // For turnovers, negative = offense protects ball better
              : factor.edge > 0;
            
            const insight = factor.getInsight(factor.edge, factor.offIsGood, factor.defIsGood);
            
            // Display edge (absolute for turnovers since interpretation is flipped)
            const displayEdge = factor.key === 'turnovers' 
              ? -factor.edge  // Show as positive when offense has advantage
              : factor.edge;

            return (
              <div
                key={factor.key}
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  borderRadius: '14px',
                  padding: '16px',
                  border: `1px solid ${favorsOffense ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)'}`,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{factor.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>{factor.label}</span>
                  </div>
                  <div style={{
                    padding: '3px 8px', borderRadius: '6px',
                    background: favorsOffense ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: favorsOffense ? '#10B981' : '#EF4444' }}>
                      {displayEdge > 0 ? '+' : ''}{displayEdge.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Bars with context */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                  {/* Offense */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(59, 130, 246, 0.8)' }}>
                          {offTeamName} {factor.offLabel}
                        </span>
                        {factor.offIsGood && (
                          <span style={{ fontSize: '8px', padding: '1px 4px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
                            ✓ good
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>
                        {factor.offValue.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: `${Math.min((factor.avg / 60) * 100, 100)}%`,
                        top: 0, bottom: 0, width: '2px',
                        background: 'rgba(255,255,255,0.25)',
                        zIndex: 1
                      }} />
                      <div style={{
                        height: '100%',
                        width: `${Math.min((factor.offValue / 60) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #3B82F6, #2563EB)',
                        borderRadius: '100px'
                      }} />
                    </div>
                  </div>
                  {/* Defense */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(239, 68, 68, 0.8)' }}>
                          {defTeamName} {factor.defLabel}
                        </span>
                        {factor.defIsGood && (
                          <span style={{ fontSize: '8px', padding: '1px 4px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
                            ✓ tough
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>
                        {factor.defValue.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: `${Math.min((factor.avg / 60) * 100, 100)}%`,
                        top: 0, bottom: 0, width: '2px',
                        background: 'rgba(255,255,255,0.25)',
                        zIndex: 1
                      }} />
                      <div style={{
                        height: '100%',
                        width: `${Math.min((factor.defValue / 60) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #EF4444, #DC2626)',
                        borderRadius: '100px'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Insight */}
                <div style={{
                  fontSize: '10px', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', lineHeight: 1.4,
                  paddingTop: '10px', borderTop: '1px solid rgba(71, 85, 105, 0.15)'
                }}>
                  {insight}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SHOT PROFILE
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '0 18px 24px' : '0 28px 28px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.04) 0%, rgba(245, 158, 11, 0.02) 100%)',
          borderRadius: '14px', padding: '18px',
          border: '1px solid rgba(251, 191, 36, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Target size={14} color="#FBB936" />
            <span style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(251, 191, 36, 0.8)', letterSpacing: '0.08em' }}>
              {offTeamName.toUpperCase()} SHOT PROFILE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* 2P */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>2-Point</span>
                <span style={{
                  fontSize: '20px', fontWeight: '900',
                  color: offTeam.twoP_off > 52 ? '#10B981' : offTeam.twoP_off > 48 ? '#F59E0B' : '#EF4444',
                  fontFamily: 'ui-monospace, monospace'
                }}>
                  {offTeam.twoP_off.toFixed(1)}%
                </span>
              </div>
              <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(offTeam.twoP_off / 65) * 100}%`,
                  background: offTeam.twoP_off > 52 ? 'linear-gradient(90deg, #10B981, #059669)' 
                    : offTeam.twoP_off > 48 ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                    : 'linear-gradient(90deg, #EF4444, #DC2626)',
                  borderRadius: '100px'
                }} />
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>D1 avg: {D1_AVERAGES.twoP}%</div>
            </div>

            {/* 3P */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>3-Point</span>
                <span style={{
                  fontSize: '20px', fontWeight: '900',
                  color: offTeam.threeP_off > 36 ? '#10B981' : offTeam.threeP_off > 33 ? '#F59E0B' : '#EF4444',
                  fontFamily: 'ui-monospace, monospace'
                }}>
                  {offTeam.threeP_off.toFixed(1)}%
                </span>
              </div>
              <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(offTeam.threeP_off / 45) * 100}%`,
                  background: offTeam.threeP_off > 36 ? 'linear-gradient(90deg, #10B981, #059669)'
                    : offTeam.threeP_off > 33 ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                    : 'linear-gradient(90deg, #EF4444, #DC2626)',
                  borderRadius: '100px'
                }} />
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>D1 avg: {D1_AVERAGES.threeP}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: '14px 24px',
        borderTop: '1px solid rgba(71, 85, 105, 0.12)',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
      }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6366F1' }} />
        <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
          SAVANT ANALYTICS ENGINE
        </span>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
