/**
 * 🏀 ADVANCED MATCHUP INTELLIGENCE v3
 * ROCK SOLID LOGIC
 * 
 * EFFICIENCY:
 * - 100 = D1 Average
 * - OFFENSE: Higher = Better (they score more)
 * - DEFENSE: LOWER = Better (they allow fewer points)
 *   → So if defense is 108, that's +8 WORSE than avg = WEAK defense = GOOD for offense
 * 
 * EDGE CALCULATION:
 * - Offense edge = how good offense is vs how weak defense is
 * - edge = (adjOff - 100) + (adjDef - 100)
 * - If both positive: offense is good AND defense is weak = big advantage
 * 
 * FOUR FACTORS:
 * - Shooting: Higher off eFG = good. LOWER def eFG allowed = good D
 * - Turnovers: LOWER off TO% = good. Higher def TO% forced = good D (bad for O)
 * - Rebounding: Higher off OREB% = good. LOWER def OREB% allowed = good D
 * - FT Rate: Higher off FTR = good. LOWER def FTR allowed = good D
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
  twoP_def?: number;
  threeP_def?: number;
}

interface MatchupAnalysis {
  rankAdvantage: 'away' | 'home';
  rankDiff: number;
}

type ViewMode = 'awayOff_homeDef' | 'homeOff_awayDef';

// Get percentile from rank
const getPercentile = (rank: number) => Math.round((1 - (rank - 1) / (TOTAL_TEAMS - 1)) * 100);

// Get tier from rank
const getTierFromRank = (rank: number) => {
  const pct = getPercentile(rank);
  if (pct >= 90) return { tier: 'ELITE', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
  if (pct >= 75) return { tier: 'EXCELLENT', color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.15)' };
  if (pct >= 55) return { tier: 'ABOVE AVG', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' };
  if (pct >= 40) return { tier: 'AVERAGE', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
  if (pct >= 20) return { tier: 'BELOW AVG', color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' };
  return { tier: 'POOR', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
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

  // Current view
  const isAwayOffView = view === 'awayOff_homeDef';
  const offTeam = isAwayOffView ? away : home;
  const defTeam = isAwayOffView ? home : away;
  const offTeamName = isAwayOffView ? awayTeam : homeTeam;
  const defTeamName = isAwayOffView ? homeTeam : awayTeam;

  // Tiers based on RANKS
  const offTier = getTierFromRank(offTeam.adjOff_rank || 182);
  const defTier = getTierFromRank(defTeam.adjDef_rank || 182);

  // Context vs average
  const offVsAvg = offTeam.adjOff - D1_AVERAGES.efficiency; // Positive = good offense
  const defVsAvg = defTeam.adjDef - D1_AVERAGES.efficiency; // Positive = WEAK defense (allows more)

  /**
   * CORRECT EDGE CALCULATION:
   * 
   * Offensive edge = how good offense is + how weak defense is
   * Both measured as deviation from 100
   * 
   * Example: Offense 102.3 (+2.3 good), Defense 108.6 (+8.6 weak)
   * Edge = 2.3 + 8.6 = 10.9 points advantage for offense!
   */
  const offenseEdge = offVsAvg + defVsAvg;

  // The raw difference (for display)
  const rawDiff = offTeam.adjOff - defTeam.adjDef;

  // Narrative based on actual matchup
  const isGoodOffense = offVsAvg > 0;
  const isWeakDefense = defVsAvg > 5; // Allows 5+ more than avg
  const isStrongDefense = defVsAvg < -5; // Allows 5+ fewer than avg

  const getMatchupNarrative = () => {
    if (isGoodOffense && isWeakDefense) {
      return { text: `Scoring opportunity — ${offTeamName} faces porous defense`, icon: '🔥' };
    }
    if (isGoodOffense && isStrongDefense) {
      return { text: `Elite clash — strong offense vs lockdown defense`, icon: '⚔️' };
    }
    if (isGoodOffense && !isWeakDefense && !isStrongDefense) {
      return { text: `Slight edge — ${offTeamName} should find openings`, icon: '⚡' };
    }
    if (!isGoodOffense && isWeakDefense) {
      return { text: `Weak defense helps — ${offTeamName} may overperform`, icon: '📈' };
    }
    if (!isGoodOffense && isStrongDefense) {
      return { text: `Tough matchup — struggling offense vs elite defense`, icon: '🛡️' };
    }
    return { text: `Even matchup — no significant advantages`, icon: '⚖️' };
  };

  const narrative = getMatchupNarrative();

  // Edge score (0-100 scale, 50 = even)
  // +10 edge ≈ 70 score, -10 edge ≈ 30 score
  const edgeScore = Math.max(15, Math.min(85, Math.round(50 + (offenseEdge * 2))));

  const getEdgeInfo = (score: number) => {
    if (score >= 65) return { color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', label: 'OFFENSE FAVORED', desc: 'Clear scoring advantages in this matchup' };
    if (score >= 55) return { color: '#22D3EE', glow: 'rgba(34, 211, 238, 0.4)', label: 'SLIGHT EDGE', desc: 'Offense should find opportunities' };
    if (score >= 45) return { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', label: 'EVEN MATCHUP', desc: 'No clear advantage — could go either way' };
    if (score >= 35) return { color: '#F97316', glow: 'rgba(249, 115, 22, 0.4)', label: 'DEFENSE EDGE', desc: 'Defense has slight advantages' };
    return { color: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)', label: 'DEFENSE FAVORED', desc: 'Strong defensive matchup — scoring will be tough' };
  };

  const edgeInfo = getEdgeInfo(edgeScore);

  /**
   * FOUR FACTORS - CORRECT INTERPRETATION:
   * 
   * SHOOTING (eFG%):
   * - Off value: what they shoot. Higher = better for offense.
   * - Def value: what they ALLOW opponents to shoot. LOWER = better defense.
   * - Edge for offense = Off% - Def% allowed
   * - Positive = offense shoots better than D typically allows
   * 
   * TURNOVERS (TO%):
   * - Off value: how often THEY turn it over. LOWER = better (protect ball).
   * - Def value: how often they FORCE turnovers. HIGHER = better defense.
   * - For offense perspective: defense forcing > offense committing = BAD for offense
   * - Edge = defense forced - offense commits (negative = offense protects ball better)
   * 
   * REBOUNDING (OREB%):
   * - Off value: their offensive rebound rate. Higher = better.
   * - Def value: what they allow opponents to offensive rebound. LOWER = better D.
   * - Edge = Off OREB% - Def OREB% allowed. Positive = more second chances.
   * 
   * FREE THROWS (FT Rate):
   * - Off value: how often they get to the line. Higher = better.
   * - Def value: how often they send opponents to line. LOWER = better D.
   * - Edge = Off FTR - Def FTR allowed. Positive = more FT attempts expected.
   */
  const fourFactors = [
    {
      key: 'shooting',
      label: 'Shooting (eFG%)',
      icon: '🎯',
      offValue: offTeam.eFG_off,
      defValue: defTeam.eFG_def,
      avg: D1_AVERAGES.eFG,
      // Offense: higher = better
      offIsGood: offTeam.eFG_off > D1_AVERAGES.eFG,
      // Defense: LOWER allowed = better defense
      defIsGoodD: defTeam.eFG_def < D1_AVERAGES.eFG,
      // Edge: Off shoots - Def allows (positive = O advantage)
      edge: offTeam.eFG_off - defTeam.eFG_def,
      offLabel: 'shoots',
      defLabel: 'allows',
      getInsight: (edge: number, offGood: boolean, defGoodD: boolean) => {
        if (edge > 3 && !defGoodD) return `Easy looks expected — weak perimeter D`;
        if (edge > 0) return `Shooting edge for ${offTeamName}`;
        if (edge > -3) return `Defense limits efficiency slightly`;
        return `Tough shooting matchup — elite D`;
      }
    },
    {
      key: 'turnovers',
      label: 'Ball Security (TO%)',
      icon: '🏀',
      offValue: offTeam.to_off,
      defValue: defTeam.to_def,
      avg: D1_AVERAGES.turnover,
      // Offense: LOWER TO% = better (fewer turnovers)
      offIsGood: offTeam.to_off < D1_AVERAGES.turnover,
      // Defense: HIGHER TO forced = better D (creates more TOs)
      defIsGoodD: defTeam.to_def > D1_AVERAGES.turnover,
      // Edge from offense POV: if D forces more than O commits, that's bad for O
      edge: defTeam.to_def - offTeam.to_off,
      offLabel: 'commits',
      defLabel: 'forces',
      getInsight: (edge: number, offGood: boolean, defGoodD: boolean) => {
        if (edge > 2 && defGoodD) return `Turnover risk — ${defTeamName} forces mistakes`;
        if (edge > 0) return `Slight turnover concern`;
        if (offGood) return `${offTeamName} protects the ball well`;
        return `Neither team excels here`;
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
      // Defense: LOWER OREB% allowed = better D
      defIsGoodD: defTeam.oreb_def < D1_AVERAGES.oreb,
      // Edge: Off OREB - Def allows (positive = O gets more boards)
      edge: offTeam.oreb_off - defTeam.oreb_def,
      offLabel: 'grabs',
      defLabel: 'allows',
      getInsight: (edge: number, offGood: boolean, defGoodD: boolean) => {
        if (edge > 5 && offGood) return `Glass advantage — extra possessions likely`;
        if (edge > 0) return `Should grab some offensive boards`;
        if (defGoodD) return `${defTeamName} locks down the glass`;
        return `Rebounding is even`;
      }
    },
    {
      key: 'freeThrows',
      label: 'Drawing Fouls (FT Rate)',
      icon: '🎪',
      offValue: offTeam.ftRate_off ?? D1_AVERAGES.ftRate,
      defValue: defTeam.ftRate_def ?? D1_AVERAGES.ftRate,
      avg: D1_AVERAGES.ftRate,
      // Offense: higher FT rate = better (gets to line more)
      offIsGood: (offTeam.ftRate_off ?? D1_AVERAGES.ftRate) > D1_AVERAGES.ftRate,
      // Defense: LOWER FT rate allowed = better D (doesn't foul)
      defIsGoodD: (defTeam.ftRate_def ?? D1_AVERAGES.ftRate) < D1_AVERAGES.ftRate,
      // Edge: Off FTR - Def allows (positive = more FTs expected)
      edge: (offTeam.ftRate_off ?? D1_AVERAGES.ftRate) - (defTeam.ftRate_def ?? D1_AVERAGES.ftRate),
      offLabel: 'draws',
      defLabel: 'allows',
      getInsight: (edge: number, offGood: boolean, defGoodD: boolean) => {
        if (edge > 5 && offGood) return `Free points expected — draws contact`;
        if (edge > 0) return `Should get to the line`;
        if (defGoodD) return `${defTeamName} plays clean — few fouls`;
        return `Free throw rate is neutral`;
      }
    }
  ];

  // Count advantages (positive edge = offense advantage, except turnovers where negative is better for O)
  const advantageCount = fourFactors.filter(f => {
    if (f.key === 'turnovers') return f.edge < 0; // Negative = offense commits fewer than D forces
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
      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(99, 102, 241, 0.06) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
        padding: isMobile ? '14px 18px' : '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={18} color="#A5B4FC" />
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(167, 139, 250, 0.7)', letterSpacing: '0.12em' }}>
              ADVANCED ANALYTICS
            </div>
            <div style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '800', color: 'white' }}>
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
            cursor: 'pointer'
          }}
        >
          <ArrowRightLeft size={13} color="#A5B4FC" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#C7D2FE' }}>FLIP</span>
        </button>
      </div>

      {/* RANKINGS COMPARISON */}
      <div style={{ padding: isMobile ? '20px 18px 0' : '24px 28px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)',
          borderRadius: '14px', padding: '16px 20px',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: '6px' }}>
              {offTeamName.toUpperCase()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>
                #{offTeam.adjOff_rank || '—'}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                <div>OFFENSE</div>
                <div style={{ color: offTier.color }}>{getPercentile(offTeam.adjOff_rank || 182)}th %ile</div>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            padding: '8px 12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>VS</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: '6px' }}>
              {defTeamName.toUpperCase()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>
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

      {/* EDGE SCORE */}
      <div style={{
        padding: isMobile ? '28px 20px' : '36px 32px',
        background: `radial-gradient(ellipse at center, ${edgeInfo.glow}10 0%, transparent 70%)`,
        textAlign: 'center'
      }}>
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
              fontSize: isMobile ? '36px' : '44px', fontWeight: '900', color: edgeInfo.color,
              fontFamily: 'ui-monospace, monospace', lineHeight: 1,
              textShadow: `0 0 25px ${edgeInfo.glow}`
            }}>
              {animated ? edgeScore : 50}
            </div>
            <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>
              EDGE SCORE
            </div>
          </div>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', borderRadius: '100px',
          background: `${edgeInfo.color}15`, border: `1.5px solid ${edgeInfo.color}40`,
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '14px' }}>{narrative.icon}</span>
          <span style={{ fontSize: '12px', fontWeight: '800', color: edgeInfo.color, letterSpacing: '0.06em' }}>
            {edgeInfo.label}
          </span>
        </div>

        <div style={{ fontSize: isMobile ? '12px' : '13px', color: 'rgba(255,255,255,0.6)', maxWidth: '320px', margin: '0 auto', lineHeight: 1.5 }}>
          {edgeInfo.desc}
        </div>
      </div>

      {/* EFFICIENCY BREAKDOWN */}
      <div style={{ padding: isMobile ? '0 18px 24px' : '0 28px 28px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
          borderRadius: '16px', border: '1px solid rgba(71, 85, 105, 0.2)', overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
            padding: isMobile ? '16px' : '20px',
            background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(71, 85, 105, 0.15)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#3B82F6', letterSpacing: '0.08em', marginBottom: '4px' }}>OFFENSE</div>
              <div style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>{offTeamName}</div>
              <div style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: '6px', background: offTier.bg, border: `1px solid ${offTier.color}30` }}>
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
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#EF4444', letterSpacing: '0.08em', marginBottom: '4px' }}>DEFENSE</div>
              <div style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>{defTeamName}</div>
              <div style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: '6px', background: defTier.bg, border: `1px solid ${defTier.color}30` }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: defTier.color }}>{defTier.tier}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: isMobile ? '20px 16px' : '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '30px' : '38px', fontWeight: '900', color: '#3B82F6', fontFamily: 'ui-monospace, monospace', lineHeight: 1 }}>
                  {offTeam.adjOff.toFixed(1)}
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>
                  PTS PER 100
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
                background: offenseEdge > 0 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.04) 100%)',
                border: `1px solid ${offenseEdge > 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
              }}>
                <div style={{
                  fontSize: isMobile ? '18px' : '20px', fontWeight: '900',
                  color: offenseEdge > 0 ? '#10B981' : '#EF4444',
                  fontFamily: 'ui-monospace, monospace'
                }}>
                  {offenseEdge > 0 ? '+' : ''}{offenseEdge.toFixed(1)}
                </div>
                <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
                  O EDGE
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '30px' : '38px', fontWeight: '900', color: '#EF4444', fontFamily: 'ui-monospace, monospace', lineHeight: 1 }}>
                  {defTeam.adjDef.toFixed(1)}
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>
                  ALLOWS/100
                </div>
                <div style={{
                  marginTop: '6px', padding: '3px 8px', borderRadius: '6px', display: 'inline-block',
                  // For defense: negative vs avg = good (allows fewer), positive = bad (allows more)
                  background: defVsAvg <= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: defVsAvg <= 0 ? '#10B981' : '#EF4444' }}>
                    {defVsAvg > 0 ? `+${defVsAvg.toFixed(1)} (weak)` : `${defVsAvg.toFixed(1)} (strong)`}
                  </span>
                </div>
              </div>
            </div>

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

      {/* FOUR FACTORS */}
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
            // Determine advantage
            const favorsOffense = factor.key === 'turnovers' ? factor.edge < 0 : factor.edge > 0;
            const displayEdge = factor.key === 'turnovers' ? -factor.edge : factor.edge;
            const insight = factor.getInsight(factor.edge, factor.offIsGood, factor.defIsGoodD);

            // Context badges
            const offVsAvgVal = factor.key === 'turnovers' 
              ? factor.avg - factor.offValue  // Lower is better for TO
              : factor.offValue - factor.avg;
            const defVsAvgVal = factor.key === 'turnovers'
              ? factor.defValue - factor.avg  // Higher forced is better D
              : factor.avg - factor.defValue; // Lower allowed is better D

            return (
              <div key={factor.key} style={{
                background: 'rgba(30, 41, 59, 0.4)', borderRadius: '14px', padding: '16px',
                border: `1px solid ${favorsOffense ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)'}`,
              }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                  {/* Offense */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(59, 130, 246, 0.8)' }}>
                          {offTeamName} {factor.offLabel}
                        </span>
                        {factor.offIsGood && (
                          <span style={{ fontSize: '8px', padding: '1px 4px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>✓</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>avg {factor.avg}%</span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>
                          {factor.offValue.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: `${Math.min((factor.avg / 60) * 100, 100)}%`,
                        top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.3)', zIndex: 1
                      }} />
                      <div style={{
                        height: '100%', width: `${Math.min((factor.offValue / 60) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #3B82F6, #2563EB)', borderRadius: '100px'
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
                        {factor.defIsGoodD && (
                          <span style={{ fontSize: '8px', padding: '1px 4px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>🛡️</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>avg {factor.avg}%</span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>
                          {factor.defValue.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: `${Math.min((factor.avg / 60) * 100, 100)}%`,
                        top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.3)', zIndex: 1
                      }} />
                      <div style={{
                        height: '100%', width: `${Math.min((factor.defValue / 60) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #EF4444, #DC2626)', borderRadius: '100px'
                      }} />
                    </div>
                  </div>
                </div>

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

      {/* SHOT PROFILE WITH AVG COMPARISON */}
      <div style={{ padding: isMobile ? '0 18px 24px' : '0 28px 28px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.04) 0%, rgba(245, 158, 11, 0.02) 100%)',
          borderRadius: '14px', padding: '18px', border: '1px solid rgba(251, 191, 36, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Target size={14} color="#FBB936" />
            <span style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(251, 191, 36, 0.8)', letterSpacing: '0.08em' }}>
              {offTeamName.toUpperCase()} SHOT PROFILE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* 2P */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>2-Point %</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: '700',
                    padding: '2px 6px', borderRadius: '4px',
                    background: offTeam.twoP_off > D1_AVERAGES.twoP ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: offTeam.twoP_off > D1_AVERAGES.twoP ? '#10B981' : '#EF4444'
                  }}>
                    {offTeam.twoP_off > D1_AVERAGES.twoP ? '+' : ''}{(offTeam.twoP_off - D1_AVERAGES.twoP).toFixed(1)}%
                  </span>
                  <span style={{
                    fontSize: '18px', fontWeight: '900',
                    color: offTeam.twoP_off > 52 ? '#10B981' : offTeam.twoP_off > 48 ? '#F59E0B' : '#EF4444',
                    fontFamily: 'ui-monospace, monospace'
                  }}>
                    {offTeam.twoP_off.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div style={{ position: 'relative', height: '8px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden' }}>
                {/* Avg marker */}
                <div style={{
                  position: 'absolute', left: `${(D1_AVERAGES.twoP / 70) * 100}%`,
                  top: 0, bottom: 0, width: '3px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px', zIndex: 2
                }} />
                <div style={{
                  height: '100%', width: `${(offTeam.twoP_off / 70) * 100}%`,
                  background: offTeam.twoP_off > 52 ? 'linear-gradient(90deg, #10B981, #059669)'
                    : offTeam.twoP_off > 48 ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                    : 'linear-gradient(90deg, #EF4444, #DC2626)',
                  borderRadius: '100px'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>0%</span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>D1 avg: {D1_AVERAGES.twoP}%</span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>70%</span>
              </div>
            </div>

            {/* 3P */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>3-Point %</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: '700',
                    padding: '2px 6px', borderRadius: '4px',
                    background: offTeam.threeP_off > D1_AVERAGES.threeP ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: offTeam.threeP_off > D1_AVERAGES.threeP ? '#10B981' : '#EF4444'
                  }}>
                    {offTeam.threeP_off > D1_AVERAGES.threeP ? '+' : ''}{(offTeam.threeP_off - D1_AVERAGES.threeP).toFixed(1)}%
                  </span>
                  <span style={{
                    fontSize: '18px', fontWeight: '900',
                    color: offTeam.threeP_off > 36 ? '#10B981' : offTeam.threeP_off > 33 ? '#F59E0B' : '#EF4444',
                    fontFamily: 'ui-monospace, monospace'
                  }}>
                    {offTeam.threeP_off.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div style={{ position: 'relative', height: '8px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', left: `${(D1_AVERAGES.threeP / 50) * 100}%`,
                  top: 0, bottom: 0, width: '3px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px', zIndex: 2
                }} />
                <div style={{
                  height: '100%', width: `${(offTeam.threeP_off / 50) * 100}%`,
                  background: offTeam.threeP_off > 36 ? 'linear-gradient(90deg, #10B981, #059669)'
                    : offTeam.threeP_off > 33 ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                    : 'linear-gradient(90deg, #EF4444, #DC2626)',
                  borderRadius: '100px'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>0%</span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>D1 avg: {D1_AVERAGES.threeP}%</span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>50%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: '14px 24px', borderTop: '1px solid rgba(71, 85, 105, 0.12)', background: 'rgba(0,0,0,0.2)',
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
