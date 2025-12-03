/**
 * 🏀 ADVANCED MATCHUP INTELLIGENCE
 * Premium analytics with proper context and interpretation
 * 
 * Key Context:
 * - Efficiency ratings: 100 = D1 Average
 * - Offense: Higher = Better
 * - Defense: LOWER = Better (they allow fewer points)
 */

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, TrendingUp, TrendingDown, Shield, Target, Zap, BarChart3, Activity, Info } from 'lucide-react';

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
  eFG_def: number;
  to_off: number;
  to_def: number;
  oreb_off: number;
  oreb_def: number;
  ftRate_off?: number;
  ftRate_def?: number;
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

// Helper: Get tier label and color based on efficiency vs average
const getEfficiencyContext = (value: number, isDefense: boolean) => {
  const diff = isDefense ? D1_AVERAGES.efficiency - value : value - D1_AVERAGES.efficiency;
  
  if (diff >= 15) return { tier: 'ELITE', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
  if (diff >= 8) return { tier: 'EXCELLENT', color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.15)' };
  if (diff >= 3) return { tier: 'ABOVE AVG', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' };
  if (diff >= -3) return { tier: 'AVERAGE', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
  if (diff >= -8) return { tier: 'BELOW AVG', color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' };
  return { tier: 'POOR', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
};

// Helper: Get percentile from rank (out of 365 teams)
const getPercentile = (rank: number) => Math.round((1 - (rank - 1) / 364) * 100);

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

  // Get context for both teams
  const offContext = getEfficiencyContext(offTeam.adjOff, false);
  const defContext = getEfficiencyContext(defTeam.adjDef, true);

  // Calculate the TRUE matchup story
  // Higher offense = good, Lower defense = good (for the defense)
  // So: offense vs defense = offTeam.adjOff - defTeam.adjDef
  // Positive = offense should score well, Negative = defense should limit scoring
  const efficiencyEdge = offTeam.adjOff - defTeam.adjDef;
  
  // Compare offense to average + compare defense to average
  const offVsAvg = offTeam.adjOff - D1_AVERAGES.efficiency;
  const defVsAvg = D1_AVERAGES.efficiency - defTeam.adjDef; // Flip so positive = good defense
  
  // Is this defense actually good or bad?
  const isGoodDefense = defTeam.adjDef < D1_AVERAGES.efficiency;
  const isGoodOffense = offTeam.adjOff > D1_AVERAGES.efficiency;

  // Smart narrative based on actual matchup
  const getMatchupNarrative = () => {
    if (isGoodOffense && !isGoodDefense) {
      return { text: `${offTeamName} should feast against this porous defense`, sentiment: 'positive' };
    }
    if (isGoodOffense && isGoodDefense) {
      return { text: `Strength vs strength - elite offense meets stout defense`, sentiment: 'neutral' };
    }
    if (!isGoodOffense && isGoodDefense) {
      return { text: `${offTeamName} faces an uphill battle against this elite defense`, sentiment: 'negative' };
    }
    return { text: `Two below-average units clash in this matchup`, sentiment: 'neutral' };
  };

  const narrative = getMatchupNarrative();

  // Edge score calculation (more nuanced)
  const calculateEdgeScore = () => {
    let score = 50;
    
    // Efficiency edge matters most
    score += efficiencyEdge * 2.5;
    
    // Shooting matchup
    const shootingEdge = offTeam.eFG_off - defTeam.eFG_def;
    score += shootingEdge * 1.5;
    
    return Math.max(15, Math.min(85, score));
  };

  const edgeScore = calculateEdgeScore();

  // Four Factors with proper interpretation
  const fourFactors = [
    {
      key: 'shooting',
      label: 'Shooting Efficiency',
      icon: '🎯',
      offValue: offTeam.eFG_off,
      defValue: defTeam.eFG_def,
      avg: D1_AVERAGES.eFG,
      // For shooting: higher off is good, higher def allowed is bad (good for offense)
      offContext: offTeam.eFG_off > D1_AVERAGES.eFG ? 'good' : 'bad',
      defContext: defTeam.eFG_def > D1_AVERAGES.eFG ? 'good_for_off' : 'bad_for_off',
      edge: offTeam.eFG_off - defTeam.eFG_def,
      insight: offTeam.eFG_off > defTeam.eFG_def 
        ? `${offTeamName} shoots better than ${defTeamName} typically allows`
        : `${defTeamName} defense should limit ${offTeamName}'s shooting`
    },
    {
      key: 'turnovers',
      label: 'Ball Security',
      icon: '🏀',
      offValue: offTeam.to_off,
      defValue: defTeam.to_def,
      avg: D1_AVERAGES.turnover,
      // For TO: lower off is good, higher def forced is good (bad for offense)
      offContext: offTeam.to_off < D1_AVERAGES.turnover ? 'good' : 'bad',
      defContext: defTeam.to_def > D1_AVERAGES.turnover ? 'bad_for_off' : 'good_for_off',
      edge: defTeam.to_def - offTeam.to_off,
      insight: offTeam.to_off < defTeam.to_def
        ? `${offTeamName} protects the ball well vs this defense`
        : `${defTeamName} forces turnovers - ${offTeamName} must be careful`
    },
    {
      key: 'rebounding',
      label: 'Second Chances',
      icon: '💪',
      offValue: offTeam.oreb_off,
      defValue: defTeam.oreb_def,
      avg: D1_AVERAGES.oreb,
      offContext: offTeam.oreb_off > D1_AVERAGES.oreb ? 'good' : 'bad',
      defContext: defTeam.oreb_def > D1_AVERAGES.oreb ? 'good_for_off' : 'bad_for_off',
      edge: offTeam.oreb_off - defTeam.oreb_def,
      insight: offTeam.oreb_off > defTeam.oreb_def
        ? `${offTeamName} should grab extra possessions on the glass`
        : `${defTeamName} limits second chance opportunities`
    },
    {
      key: 'freeThrows',
      label: 'Free Throw Rate',
      icon: '🎪',
      offValue: offTeam.ftRate_off || 30,
      defValue: defTeam.ftRate_def || 30,
      avg: D1_AVERAGES.ftRate,
      offContext: (offTeam.ftRate_off || 30) > D1_AVERAGES.ftRate ? 'good' : 'bad',
      defContext: (defTeam.ftRate_def || 30) > D1_AVERAGES.ftRate ? 'good_for_off' : 'bad_for_off',
      edge: (offTeam.ftRate_off || 30) - (defTeam.ftRate_def || 30),
      insight: (offTeam.ftRate_off || 30) > (defTeam.ftRate_def || 30)
        ? `${offTeamName} gets to the line and should draw fouls`
        : `${defTeamName} keeps opponents off the free throw line`
    }
  ];

  const factorAdvantages = fourFactors.filter(f => f.edge > 0).length;

  // Edge color based on score
  const getEdgeColor = (score: number) => {
    if (score >= 65) return { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', label: 'STRONG EDGE' };
    if (score >= 55) return { primary: '#22D3EE', glow: 'rgba(34, 211, 238, 0.4)', label: 'FAVORABLE' };
    if (score >= 45) return { primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', label: 'EVEN' };
    if (score >= 35) return { primary: '#F97316', glow: 'rgba(249, 115, 22, 0.4)', label: 'TOUGH' };
    return { primary: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)', label: 'MISMATCH' };
  };

  const edgeColors = getEdgeColor(edgeScore);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 50%, #0F172A 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      overflow: 'hidden',
      boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px -20px ${edgeColors.glow}`
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
            <div style={{
              fontSize: '10px',
              fontWeight: '700',
              color: 'rgba(167, 139, 250, 0.7)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}>
              Advanced Analytics
            </div>
            <div style={{
              fontSize: isMobile ? '14px' : '15px',
              fontWeight: '800',
              color: 'white',
              letterSpacing: '-0.01em'
            }}>
              Matchup Intelligence
            </div>
          </div>
        </div>

        <button
          onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowRightLeft size={13} color="#A5B4FC" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#C7D2FE' }}>
            FLIP
          </span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO - Edge Score with Context
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: isMobile ? '28px 20px' : '36px 32px',
        background: `radial-gradient(ellipse at center, ${edgeColors.glow}10 0%, transparent 70%)`,
        textAlign: 'center'
      }}>
        {/* Edge Score Ring */}
        <div style={{ position: 'relative', width: isMobile ? '150px' : '180px', height: isMobile ? '150px' : '180px', margin: '0 auto 20px' }}>
          <svg width="100%" height="100%" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="90" cy="90" r="78" fill="none" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="10" />
            <circle
              cx="90" cy="90" r="78" fill="none"
              stroke={edgeColors.primary}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${animated ? edgeScore * 4.9 : 0} 490`}
              style={{ filter: `drop-shadow(0 0 8px ${edgeColors.glow})`, transition: 'stroke-dasharray 1.2s ease-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              fontSize: isMobile ? '38px' : '48px',
              fontWeight: '900',
              color: edgeColors.primary,
              fontFamily: 'ui-monospace, monospace',
              lineHeight: 1,
              textShadow: `0 0 30px ${edgeColors.glow}`
            }}>
              {animated ? Math.round(edgeScore) : 50}
            </div>
            <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginTop: '4px' }}>
              EDGE SCORE
            </div>
          </div>
        </div>

        {/* Verdict Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '100px',
          background: `${edgeColors.primary}15`,
          border: `1.5px solid ${edgeColors.primary}40`,
          marginBottom: '16px'
        }}>
          {edgeScore >= 50 ? <TrendingUp size={16} color={edgeColors.primary} /> : <TrendingDown size={16} color={edgeColors.primary} />}
          <span style={{ fontSize: '12px', fontWeight: '800', color: edgeColors.primary, letterSpacing: '0.08em' }}>
            {edgeColors.label}
          </span>
        </div>

        {/* Smart Narrative */}
        <div style={{
          fontSize: isMobile ? '13px' : '14px',
          color: 'rgba(255,255,255,0.7)',
          maxWidth: '340px',
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          {narrative.text}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          EFFICIENCY BREAKDOWN - With Context vs Average
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
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: isMobile ? '16px' : '20px',
            background: 'rgba(0,0,0,0.2)',
            borderBottom: '1px solid rgba(71, 85, 105, 0.15)'
          }}>
            {/* Offense Side */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#3B82F6', letterSpacing: '0.08em', marginBottom: '4px' }}>
                OFFENSE
              </div>
              <div style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '900', color: 'white', marginBottom: '6px' }}>
                {offTeamName}
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: offContext.bg,
                border: `1px solid ${offContext.color}30`
              }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: offContext.color }}>
                  {offContext.tier}
                </span>
              </div>
            </div>

            {/* VS */}
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={18} color="#A5B4FC" />
            </div>

            {/* Defense Side */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#EF4444', letterSpacing: '0.08em', marginBottom: '4px' }}>
                DEFENSE
              </div>
              <div style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '900', color: 'white', marginBottom: '6px' }}>
                {defTeamName}
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: defContext.bg,
                border: `1px solid ${defContext.color}30`
              }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: defContext.color }}>
                  {defContext.tier}
                </span>
              </div>
            </div>
          </div>

          {/* Efficiency Numbers with Context */}
          <div style={{ padding: isMobile ? '20px 16px' : '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '12px' }}>
              {/* Offense Rating */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: isMobile ? '32px' : '40px',
                  fontWeight: '900',
                  color: '#3B82F6',
                  fontFamily: 'ui-monospace, monospace',
                  lineHeight: 1
                }}>
                  {offTeam.adjOff.toFixed(1)}
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>
                  ADJ. OFFENSE
                </div>
                {/* Context: vs average */}
                <div style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: offVsAvg >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  display: 'inline-block'
                }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: offVsAvg >= 0 ? '#10B981' : '#EF4444'
                  }}>
                    {offVsAvg >= 0 ? '+' : ''}{offVsAvg.toFixed(1)} vs avg
                  </span>
                </div>
              </div>

              {/* Differential */}
              <div style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: efficiencyEdge > 0 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.04) 100%)',
                border: `1px solid ${efficiencyEdge > 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
              }}>
                <div style={{
                  fontSize: isMobile ? '18px' : '22px',
                  fontWeight: '900',
                  color: efficiencyEdge > 0 ? '#10B981' : '#EF4444',
                  fontFamily: 'ui-monospace, monospace'
                }}>
                  {efficiencyEdge > 0 ? '+' : ''}{efficiencyEdge.toFixed(1)}
                </div>
                <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
                  PTS/100
                </div>
              </div>

              {/* Defense Rating */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: isMobile ? '32px' : '40px',
                  fontWeight: '900',
                  color: '#EF4444',
                  fontFamily: 'ui-monospace, monospace',
                  lineHeight: 1
                }}>
                  {defTeam.adjDef.toFixed(1)}
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>
                  ADJ. DEFENSE
                </div>
                {/* Context: vs average (remember: lower is better for defense) */}
                <div style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: defVsAvg >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  display: 'inline-block'
                }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: defVsAvg >= 0 ? '#10B981' : '#EF4444'
                  }}>
                    {defVsAvg >= 0 ? `${defVsAvg.toFixed(1)} better` : `${Math.abs(defVsAvg).toFixed(1)} worse`} than avg
                  </span>
                </div>
              </div>
            </div>

            {/* Interpretation Note */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.06)',
              border: '1px solid rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <Info size={14} color="#A5B4FC" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Reading the numbers:</strong> D1 average is 100. 
                For offense, higher = better. For defense, <em>lower</em> = better (fewer points allowed).
                {!isGoodDefense && (
                  <span style={{ color: '#10B981' }}> This defense allows {(defTeam.adjDef - 100).toFixed(1)} more points than average — expect scoring opportunities.</span>
                )}
                {isGoodDefense && defTeam.adjDef < 95 && (
                  <span style={{ color: '#EF4444' }}> This is an elite defense — scoring will be tough.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          THE FOUR FACTORS - With Insights
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '0 18px 24px' : '0 28px 28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '14px'
        }}>
          <BarChart3 size={16} color="#A5B4FC" />
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(167, 139, 250, 0.8)', letterSpacing: '0.1em' }}>
            THE FOUR FACTORS
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(167, 139, 250, 0.2)' }} />
          <span style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>
            {factorAdvantages}/4 favor offense
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
          {fourFactors.map((factor) => {
            const isAdvantage = factor.edge > 0;
            
            return (
              <div
                key={factor.key}
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  borderRadius: '14px',
                  padding: '16px',
                  border: `1px solid ${isAdvantage ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)'}`,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{factor.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>{factor.label}</span>
                  </div>
                  <div style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: isAdvantage ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: isAdvantage ? '#10B981' : '#EF4444' }}>
                      {isAdvantage ? '+' : ''}{factor.edge.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                  {/* Offense */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(59, 130, 246, 0.8)' }}>{offTeamName}</span>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>
                        {factor.offValue.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                      {/* Average marker */}
                      <div style={{
                        position: 'absolute',
                        left: `${(factor.avg / 70) * 100}%`,
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        background: 'rgba(255,255,255,0.3)'
                      }} />
                      <div style={{
                        height: '100%',
                        width: `${Math.min((factor.offValue / 70) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #3B82F6, #2563EB)',
                        borderRadius: '100px',
                        transition: 'width 0.8s ease'
                      }} />
                    </div>
                  </div>
                  {/* Defense */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(239, 68, 68, 0.8)' }}>{defTeamName} allows</span>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>
                        {factor.defValue.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: `${(factor.avg / 70) * 100}%`,
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        background: 'rgba(255,255,255,0.3)'
                      }} />
                      <div style={{
                        height: '100%',
                        width: `${Math.min((factor.defValue / 70) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #EF4444, #DC2626)',
                        borderRadius: '100px',
                        transition: 'width 0.8s ease'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Insight */}
                <div style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.55)',
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(71, 85, 105, 0.15)'
                }}>
                  {factor.insight}
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
          borderRadius: '14px',
          padding: '18px',
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
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    color: offTeam.twoP_off > 52 ? '#10B981' : offTeam.twoP_off > 48 ? '#F59E0B' : '#EF4444',
                    fontFamily: 'ui-monospace, monospace'
                  }}>
                    {offTeam.twoP_off.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(offTeam.twoP_off / 65) * 100}%`,
                  background: offTeam.twoP_off > 52 
                    ? 'linear-gradient(90deg, #10B981, #059669)' 
                    : offTeam.twoP_off > 48 
                      ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                      : 'linear-gradient(90deg, #EF4444, #DC2626)',
                  borderRadius: '100px'
                }} />
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                Avg: {D1_AVERAGES.twoP}%
              </div>
            </div>

            {/* 3P */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>3-Point</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    color: offTeam.threeP_off > 36 ? '#10B981' : offTeam.threeP_off > 33 ? '#F59E0B' : '#EF4444',
                    fontFamily: 'ui-monospace, monospace'
                  }}>
                    {offTeam.threeP_off.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(offTeam.threeP_off / 45) * 100}%`,
                  background: offTeam.threeP_off > 36 
                    ? 'linear-gradient(90deg, #10B981, #059669)'
                    : offTeam.threeP_off > 33
                      ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                      : 'linear-gradient(90deg, #EF4444, #DC2626)',
                  borderRadius: '100px'
                }} />
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                Avg: {D1_AVERAGES.threeP}%
              </div>
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6366F1' }} />
        <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
          NHL SAVANT ANALYTICS ENGINE
        </span>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
