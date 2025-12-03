/**
 * 🏀 ADVANCED MATCHUP ANALYSIS - THE WAR ROOM
 * A magnificent, industry-leading statistical analysis component
 * 
 * Design Philosophy:
 * - Instant visual storytelling (the verdict in 1 second)
 * - Magazine-quality aesthetics
 * - Four Factors basketball analytics at its core
 * - Animated, engaging interactions
 */

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, TrendingUp, TrendingDown, Shield, Target, Zap, BarChart3 } from 'lucide-react';

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

export function AdvancedMatchupCard({ barttorvik, awayTeam, homeTeam }: AdvancedMatchupCardProps) {
  const [view, setView] = useState<ViewMode>('awayOff_homeDef');
  const [animated, setAnimated] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!barttorvik) return null;

  const { away, home, matchup } = barttorvik;

  // Current view configuration
  const isAwayOffView = view === 'awayOff_homeDef';
  const offTeam = isAwayOffView ? away : home;
  const defTeam = isAwayOffView ? home : away;
  const offTeamName = isAwayOffView ? awayTeam : homeTeam;
  const defTeamName = isAwayOffView ? homeTeam : awayTeam;

  // Calculate THE EDGE (core metric)
  const efficiencyEdge = offTeam.adjOff - defTeam.adjDef;
  const shootingEdge = offTeam.eFG_off - defTeam.eFG_def;
  
  // Four Factors Analysis (Dean Oliver's basketball analytics foundation)
  const fourFactors = {
    shooting: {
      off: offTeam.eFG_off,
      def: defTeam.eFG_def,
      edge: offTeam.eFG_off - defTeam.eFG_def,
      weight: 0.4, // Most important
      label: 'Shooting',
      icon: '🎯'
    },
    turnovers: {
      off: offTeam.to_off,
      def: defTeam.to_def,
      edge: defTeam.to_def - offTeam.to_off, // Lower TO is better for offense
      weight: 0.25,
      label: 'Ball Security',
      icon: '🏀'
    },
    rebounding: {
      off: offTeam.oreb_off,
      def: defTeam.oreb_def,
      edge: offTeam.oreb_off - defTeam.oreb_def,
      weight: 0.2,
      label: 'Rebounding',
      icon: '💪'
    },
    freeThrows: {
      off: offTeam.ftRate_off || 30,
      def: defTeam.ftRate_def || 30,
      edge: (offTeam.ftRate_off || 30) - (defTeam.ftRate_def || 30),
      weight: 0.15,
      label: 'Free Throws',
      icon: '🎪'
    }
  };

  // Calculate weighted edge score (0-100 scale)
  const calculateEdgeScore = () => {
    let score = 50; // Baseline
    
    // Efficiency edge: each point = ~3 points on scale
    score += efficiencyEdge * 3;
    
    // Shooting edge: each 1% = 2 points
    score += shootingEdge * 2;
    
    // Clamp between 15 and 85
    return Math.max(15, Math.min(85, score));
  };

  const edgeScore = calculateEdgeScore();
  const hasEdge = edgeScore > 50;

  // Count factor advantages
  const factorAdvantages = Object.values(fourFactors).filter(f => f.edge > 0).length;

  // Get edge color based on score
  const getEdgeColor = (score: number) => {
    if (score >= 65) return { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', label: 'STRONG' };
    if (score >= 55) return { primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)', label: 'FAVORABLE' };
    if (score >= 45) return { primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', label: 'EVEN' };
    if (score >= 35) return { primary: '#F97316', glow: 'rgba(249, 115, 22, 0.4)', label: 'TOUGH' };
    return { primary: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)', label: 'MISMATCH' };
  };

  const edgeColors = getEdgeColor(edgeScore);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 50%, #0F172A 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      overflow: 'hidden',
      boxShadow: `
        0 0 0 1px rgba(255, 255, 255, 0.03),
        0 25px 50px -12px rgba(0, 0, 0, 0.6),
        0 0 100px -20px ${edgeColors.glow}
      `
    }}>
      {/* ═══════════════════════════════════════════════════════════════════════
          HEADER - The War Room Title
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.12) 50%, rgba(99, 102, 241, 0.08) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
        padding: isMobile ? '16px 20px' : '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${edgeColors.primary} 0%, ${edgeColors.primary}88 100%)`,
            boxShadow: `0 0 20px ${edgeColors.glow}`,
            animation: 'pulse 2s infinite'
          }} />
          <div>
            <div style={{
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: '700',
              color: 'rgba(167, 139, 250, 0.8)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '2px'
            }}>
              Advanced Analytics
            </div>
            <div style={{
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              Matchup Intelligence
            </div>
          </div>
        </div>

        {/* Perspective Toggle */}
        <button
          onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <ArrowRightLeft size={14} color="#A5B4FC" />
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#C7D2FE',
            letterSpacing: '0.03em'
          }}>
            FLIP VIEW
          </span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION - The Edge Meter (The Verdict in 1 Second)
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: isMobile ? '28px 20px' : '36px 32px',
        background: `radial-gradient(ellipse at center, ${edgeColors.glow}15 0%, transparent 70%)`,
        position: 'relative'
      }}>
        {/* Decorative grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.5
        }} />

        {/* Edge Score Ring */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Circular Gauge */}
          <div style={{
            position: 'relative',
            width: isMobile ? '160px' : '200px',
            height: isMobile ? '160px' : '200px',
            marginBottom: '20px'
          }}>
            {/* Background ring */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 200"
              style={{ transform: 'rotate(-90deg)' }}
            >
              {/* Track */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="rgba(71, 85, 105, 0.3)"
                strokeWidth="12"
              />
              {/* Progress */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke={edgeColors.primary}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${animated ? edgeScore * 5.34 : 0} 534`}
                style={{
                  filter: `drop-shadow(0 0 10px ${edgeColors.glow})`,
                  transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </svg>

            {/* Center content */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: isMobile ? '42px' : '56px',
                fontWeight: '900',
                color: edgeColors.primary,
                lineHeight: 1,
                fontFamily: 'ui-monospace, monospace',
                textShadow: `0 0 40px ${edgeColors.glow}`,
                transition: 'all 0.5s ease'
              }}>
                {animated ? Math.round(edgeScore) : 50}
              </div>
              <div style={{
                fontSize: isMobile ? '10px' : '11px',
                fontWeight: '800',
                color: 'rgba(255, 255, 255, 0.5)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: '4px'
              }}>
                EDGE SCORE
              </div>
            </div>
          </div>

          {/* Verdict Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 24px',
            borderRadius: '100px',
            background: `linear-gradient(135deg, ${edgeColors.primary}20 0%, ${edgeColors.primary}10 100%)`,
            border: `2px solid ${edgeColors.primary}40`,
            boxShadow: `0 0 30px ${edgeColors.glow}`,
            marginBottom: '16px'
          }}>
            {hasEdge ? (
              <TrendingUp size={20} color={edgeColors.primary} />
            ) : (
              <TrendingDown size={20} color={edgeColors.primary} />
            )}
            <span style={{
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '900',
              color: edgeColors.primary,
              letterSpacing: '0.1em'
            }}>
              {edgeColors.label} MATCHUP
            </span>
          </div>

          {/* Quick Summary */}
          <div style={{
            fontSize: isMobile ? '13px' : '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            maxWidth: '300px',
            lineHeight: 1.5
          }}>
            <span style={{ color: '#3B82F6', fontWeight: '800' }}>{offTeamName}</span> offense
            {efficiencyEdge > 0 ? ' projects to score ' : ' may struggle against '}
            <span style={{ color: '#EF4444', fontWeight: '800' }}>{defTeamName}</span> defense
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          HEAD-TO-HEAD DUEL - Team vs Team
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: isMobile ? '0 20px 24px' : '0 32px 32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(71, 85, 105, 0.2)',
          overflow: 'hidden'
        }}>
          {/* Duel Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: isMobile ? '16px' : '20px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, transparent 30%, transparent 70%, rgba(239, 68, 68, 0.08) 100%)',
            borderBottom: '1px solid rgba(71, 85, 105, 0.15)'
          }}>
            {/* Offense Team */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: isMobile ? '10px' : '11px',
                fontWeight: '700',
                color: '#3B82F6',
                letterSpacing: '0.1em',
                marginBottom: '6px'
              }}>
                OFFENSE
              </div>
              <div style={{
                fontSize: isMobile ? '15px' : '17px',
                fontWeight: '900',
                color: 'white',
                marginBottom: '4px'
              }}>
                {offTeamName}
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '100px',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <Target size={12} color="#3B82F6" />
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#3B82F6'
                }}>
                  #{offTeam.adjOff_rank || offTeam.rank} OFF
                </span>
              </div>
            </div>

            {/* VS Divider */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0 16px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(51, 65, 85, 0.3) 100%)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)'
              }}>
                <Zap size={20} color="#A5B4FC" />
              </div>
            </div>

            {/* Defense Team */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: isMobile ? '10px' : '11px',
                fontWeight: '700',
                color: '#EF4444',
                letterSpacing: '0.1em',
                marginBottom: '6px'
              }}>
                DEFENSE
              </div>
              <div style={{
                fontSize: isMobile ? '15px' : '17px',
                fontWeight: '900',
                color: 'white',
                marginBottom: '4px'
              }}>
                {defTeamName}
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '100px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <Shield size={12} color="#EF4444" />
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#EF4444'
                }}>
                  #{defTeam.adjDef_rank || defTeam.rank} DEF
                </span>
              </div>
            </div>
          </div>

          {/* Efficiency Duel */}
          <div style={{ padding: isMobile ? '16px' : '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {/* Offense Rating */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: isMobile ? '32px' : '40px',
                  fontWeight: '900',
                  color: '#3B82F6',
                  fontFamily: 'ui-monospace, monospace',
                  textShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
                }}>
                  {offTeam.adjOff.toFixed(1)}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.1em'
                }}>
                  ADJ. OFF
                </div>
              </div>

              {/* Differential */}
              <div style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: efficiencyEdge > 0 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
                border: `1px solid ${efficiencyEdge > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                <div style={{
                  fontSize: isMobile ? '18px' : '22px',
                  fontWeight: '900',
                  color: efficiencyEdge > 0 ? '#10B981' : '#EF4444',
                  fontFamily: 'ui-monospace, monospace'
                }}>
                  {efficiencyEdge > 0 ? '+' : ''}{efficiencyEdge.toFixed(1)}
                </div>
                <div style={{
                  fontSize: '9px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.1em'
                }}>
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
                  textShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
                }}>
                  {defTeam.adjDef.toFixed(1)}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.1em'
                }}>
                  ADJ. DEF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          THE FOUR FACTORS - Dean Oliver's Basketball Analytics
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: isMobile ? '0 20px 24px' : '0 32px 32px'
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px'
        }}>
          <BarChart3 size={18} color="#A5B4FC" />
          <div style={{
            fontSize: '11px',
            fontWeight: '800',
            color: 'rgba(167, 139, 250, 0.9)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}>
            The Four Factors
          </div>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(167, 139, 250, 0.3), transparent)'
          }} />
          <div style={{
            fontSize: '10px',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.4)'
          }}>
            {factorAdvantages}/4 advantages
          </div>
        </div>

        {/* Factors Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '12px'
        }}>
          {Object.entries(fourFactors).map(([key, factor]) => {
            const isAdvantage = factor.edge > 0;
            const absEdge = Math.abs(factor.edge);
            
            return (
              <div
                key={key}
                style={{
                  background: isAdvantage 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(239, 68, 68, 0.02) 100%)',
                  borderRadius: '14px',
                  padding: '16px',
                  border: `1px solid ${isAdvantage ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)'}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Factor Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{factor.icon}</span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      color: 'white',
                      letterSpacing: '0.02em'
                    }}>
                      {factor.label}
                    </span>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '100px',
                    background: isAdvantage ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${isAdvantage ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                  }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: isAdvantage ? '#10B981' : '#EF4444'
                    }}>
                      {isAdvantage ? '+' : ''}{factor.edge.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Visual Bar Comparison */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Offense Bar */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: 'rgba(59, 130, 246, 0.8)'
                      }}>
                        {offTeamName}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#3B82F6',
                        fontFamily: 'ui-monospace, monospace'
                      }}>
                        {factor.off.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '100px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min((factor.off / 70) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #3B82F6, #2563EB)',
                        borderRadius: '100px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
                      }} />
                    </div>
                  </div>

                  {/* Defense Bar */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: 'rgba(239, 68, 68, 0.8)'
                      }}>
                        {defTeamName} allows
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#EF4444',
                        fontFamily: 'ui-monospace, monospace'
                      }}>
                        {factor.def.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '100px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min((factor.def / 70) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #EF4444, #DC2626)',
                        borderRadius: '100px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SHOT PROFILE - Scoring Breakdown
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: isMobile ? '0 20px 24px' : '0 32px 32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.06) 0%, rgba(245, 158, 11, 0.03) 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(251, 191, 36, 0.15)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}>
            <Target size={16} color="#FBB936" />
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: 'rgba(251, 191, 36, 0.9)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              {offTeamName} Shot Profile
            </span>
          </div>

          {/* Shot Type Bars */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {/* 2P% */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '8px'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  2-Point
                </span>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '900',
                  color: offTeam.twoP_off > 52 ? '#10B981' : offTeam.twoP_off > 48 ? '#F59E0B' : '#EF4444',
                  fontFamily: 'ui-monospace, monospace'
                }}>
                  {offTeam.twoP_off.toFixed(1)}%
                </span>
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '100px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(offTeam.twoP_off / 70) * 100}%`,
                  background: offTeam.twoP_off > 52 
                    ? 'linear-gradient(90deg, #10B981, #059669)'
                    : offTeam.twoP_off > 48 
                      ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                      : 'linear-gradient(90deg, #EF4444, #DC2626)',
                  borderRadius: '100px',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>

            {/* 3P% */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '8px'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  3-Point
                </span>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '900',
                  color: offTeam.threeP_off > 36 ? '#10B981' : offTeam.threeP_off > 33 ? '#F59E0B' : '#EF4444',
                  fontFamily: 'ui-monospace, monospace'
                }}>
                  {offTeam.threeP_off.toFixed(1)}%
                </span>
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '100px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(offTeam.threeP_off / 50) * 100}%`,
                  background: offTeam.threeP_off > 36 
                    ? 'linear-gradient(90deg, #10B981, #059669)'
                    : offTeam.threeP_off > 33 
                      ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                      : 'linear-gradient(90deg, #EF4444, #DC2626)',
                  borderRadius: '100px',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER - Branding
         ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid rgba(71, 85, 105, 0.15)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.3) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)'
        }} />
        <span style={{
          fontSize: '10px',
          fontWeight: '700',
          color: 'rgba(255, 255, 255, 0.35)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}>
          NHL Savant Analytics Engine
        </span>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default AdvancedMatchupCard;
