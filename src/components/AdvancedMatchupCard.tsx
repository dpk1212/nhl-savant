/**
 * Advanced Matchup Card - PREMIUM VERSION
 * White-labeled statistical analysis matching NHL Savant brand standards
 * Features: Switchable offense/defense views, visual metrics, smooth animations
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRightLeft } from 'lucide-react';

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
  adjDef: number;
  eFG_off: number;
  eFG_def: number;
  to_off: number;
  to_def: number;
  oreb_off: number;
  oreb_def: number;
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
  const [expanded, setExpanded] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!barttorvik) return null;

  const { away, home, matchup } = barttorvik;

  // Determine which teams to show based on view
  const isAwayOffView = view === 'awayOff_homeDef';
  const offTeam = isAwayOffView ? away : home;
  const defTeam = isAwayOffView ? home : away;
  const offTeamName = isAwayOffView ? awayTeam : homeTeam;
  const defTeamName = isAwayOffView ? homeTeam : awayTeam;
  const matchupDiff = isAwayOffView ? matchup.awayOffVsHomeDef : matchup.homeOffVsAwayDef;

  // Calculate efficiency differential
  const efficiencyDiff = (offTeam.adjOff - defTeam.adjDef).toFixed(1);
  const efficiencyAdvantage = parseFloat(efficiencyDiff) > 0;

  // Helper for percentage bars
  const getPercentageWidth = (value: number, max: number = 100) => {
    return Math.min((value / max) * 100, 100);
  };

  // Helper for ranking badge color - matching game card style
  const getRankColor = (rank: number) => {
    if (rank <= 25) return {
      bg: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.08) 100%)',
      border: 'rgba(251, 191, 36, 0.4)',
      text: '#FBB936',
      shadow: 'rgba(251, 191, 36, 0.25)'
    };
    if (rank <= 75) return {
      bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
      border: 'rgba(16, 185, 129, 0.4)',
      text: '#10B981',
      shadow: 'rgba(16, 185, 129, 0.25)'
    };
    if (rank <= 150) return {
      bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
      border: 'rgba(59, 130, 246, 0.4)',
      text: '#3B82F6',
      shadow: 'rgba(59, 130, 246, 0.25)'
    };
    return {
      bg: 'linear-gradient(135deg, rgba(148, 163, 184, 0.12) 0%, rgba(148, 163, 184, 0.06) 100%)',
      border: 'rgba(148, 163, 184, 0.3)',
      text: '#94A3B8',
      shadow: 'rgba(148, 163, 184, 0.2)'
    };
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)',
      borderRadius: isMobile ? '14px' : '16px',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      padding: 0,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      overflow: 'hidden'
    }}>
      {/* Premium Header with Gradient Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        padding: isMobile ? '1rem 1.125rem' : '1.125rem 1.375rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Left: Title with animated indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.625rem' : '0.75rem' }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            <h3 style={{
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              fontWeight: '800',
              color: 'white',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.85) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Advanced Statistical Analysis
            </h3>
          </div>
          
          {/* Right: Premium Switch Button */}
          <button
            onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.375rem' : '0.5rem',
              padding: isMobile ? '0.438rem 0.75rem' : '0.5rem 0.875rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
              border: '1.5px solid rgba(99, 102, 241, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.15)';
            }}
            title="Switch perspective"
          >
            <ArrowRightLeft style={{ 
              width: isMobile ? '13px' : '14px', 
              height: isMobile ? '13px' : '14px', 
              color: '#A5B4FC' 
            }} />
            <span style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              fontWeight: '700',
              color: '#C7D2FE',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}>
              Switch
            </span>
          </button>
        </div>
      </div>

      {/* Premium Matchup Header */}
      <div style={{ padding: isMobile ? '1.25rem 1.125rem 1rem' : '1.5rem 1.375rem 1.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          {/* Offensive Team */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: isMobile ? '0.5rem' : '0.625rem',
            marginBottom: isMobile ? '0.625rem' : '0.75rem'
          }}>
            {(() => {
              const rankStyle = getRankColor(offTeam.rank);
              return (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: isMobile ? '0.313rem 0.625rem' : '0.375rem 0.75rem',
                  borderRadius: '10px',
                  background: rankStyle.bg,
                  border: `1.5px solid ${rankStyle.border}`,
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  fontWeight: '800',
                  color: rankStyle.text,
                  letterSpacing: '0.02em',
                  boxShadow: `0 2px 8px ${rankStyle.shadow}`
                }}>
                  #{offTeam.rank}
                </span>
              );
            })()}
            <span style={{
              fontSize: isMobile ? '1.063rem' : '1.188rem',
              fontWeight: '900',
              color: '#3B82F6',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}>
              {offTeamName}
            </span>
            <span style={{
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(59, 130, 246, 0.7)',
              textTransform: 'uppercase',
              fontWeight: '800',
              letterSpacing: '0.05em'
            }}>
              OFFENSE
            </span>
          </div>
          
          {/* VS Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '0.5rem' : '0.625rem',
            margin: isMobile ? '0.5rem 0' : '0.625rem 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)' }} />
            <span style={{
              fontSize: isMobile ? '0.688rem' : '0.75rem',
              fontWeight: '800',
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.1em'
            }}>
              VS
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)' }} />
          </div>
          
          {/* Defensive Team */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: isMobile ? '0.5rem' : '0.625rem',
            marginTop: isMobile ? '0.625rem' : '0.75rem'
          }}>
            {(() => {
              const rankStyle = getRankColor(defTeam.rank);
              return (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: isMobile ? '0.313rem 0.625rem' : '0.375rem 0.75rem',
                  borderRadius: '10px',
                  background: rankStyle.bg,
                  border: `1.5px solid ${rankStyle.border}`,
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  fontWeight: '800',
                  color: rankStyle.text,
                  letterSpacing: '0.02em',
                  boxShadow: `0 2px 8px ${rankStyle.shadow}`
                }}>
                  #{defTeam.rank}
                </span>
              );
            })()}
            <span style={{
              fontSize: isMobile ? '1.063rem' : '1.188rem',
              fontWeight: '900',
              color: '#EF4444',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
            }}>
              {defTeamName}
            </span>
            <span style={{
              fontSize: isMobile ? '0.625rem' : '0.688rem',
              color: 'rgba(239, 68, 68, 0.7)',
              textTransform: 'uppercase',
              fontWeight: '800',
              letterSpacing: '0.05em'
            }}>
              DEFENSE
            </span>
          </div>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div style={{ 
        padding: isMobile ? '0 1.125rem 1.25rem' : '0 1.375rem 1.5rem',
        display: 'grid',
        gap: isMobile ? '0.75rem' : '0.875rem'
      }}>
        {/* Efficiency Matchup - Premium Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)',
          borderRadius: '12px',
          padding: isMobile ? '0.875rem 1rem' : '1rem 1.125rem',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 2px 12px rgba(16, 185, 129, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
        }}>
          <div style={{
            fontSize: isMobile ? '0.625rem' : '0.688rem',
            fontWeight: '800',
            color: 'rgba(16, 185, 129, 0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: isMobile ? '0.75rem' : '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <span style={{ fontSize: isMobile ? '0.875rem' : '0.938rem' }}>⚡</span>
            EFFICIENCY MATCHUP
          </div>
          
          <div style={{ display: 'grid', gap: isMobile ? '0.5rem' : '0.625rem' }}>
            {/* Offensive Efficiency */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: '600'
              }}>
                Adj. Offensive Eff.
              </span>
              <span style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: isMobile ? '1rem' : '1.125rem',
                fontWeight: '900',
                color: '#10B981',
                letterSpacing: '-0.02em'
              }}>
                {offTeam.adjOff.toFixed(1)}
              </span>
            </div>
            
            {/* Defensive Efficiency */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: '600'
              }}>
                Adj. Defensive Eff.
              </span>
              <span style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: isMobile ? '1rem' : '1.125rem',
                fontWeight: '900',
                color: 'white',
                letterSpacing: '-0.02em'
              }}>
                {defTeam.adjDef.toFixed(1)}
              </span>
            </div>
            
            {/* Differential - Highlighted */}
            <div style={{
              paddingTop: isMobile ? '0.5rem' : '0.625rem',
              marginTop: isMobile ? '0.5rem' : '0.625rem',
              borderTop: '1px solid rgba(16, 185, 129, 0.15)',
              background: efficiencyAdvantage 
                ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)'
                : 'linear-gradient(90deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.04) 100%)',
              borderRadius: '6px',
              padding: isMobile ? '0.438rem 0.625rem' : '0.5rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <span style={{ fontSize: isMobile ? '0.938rem' : '1rem' }}>
                {efficiencyAdvantage ? '✓' : '⚠'}
              </span>
              <span style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                fontWeight: '800',
                color: efficiencyAdvantage ? '#10B981' : '#EF4444',
                letterSpacing: '0.01em'
              }}>
                {efficiencyAdvantage ? '+' : ''}{efficiencyDiff} pts/100 possessions expected
              </span>
            </div>
          </div>
        </div>

        {/* Shooting Efficiency - Premium Card with Visual Bars */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.05) 100%)',
          borderRadius: '12px',
          padding: isMobile ? '0.875rem 1rem' : '1rem 1.125rem',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 2px 12px rgba(59, 130, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
        }}>
          <div style={{
            fontSize: isMobile ? '0.625rem' : '0.688rem',
            fontWeight: '800',
            color: 'rgba(59, 130, 246, 0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: isMobile ? '0.75rem' : '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <span style={{ fontSize: isMobile ? '0.875rem' : '0.938rem' }}>🎯</span>
            SHOOTING EFFICIENCY
          </div>
          
          <div style={{ display: 'grid', gap: isMobile ? '0.625rem' : '0.75rem' }}>
            {/* Offensive Team eFG% */}
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: isMobile ? '0.375rem' : '0.438rem'
              }}>
                <span style={{
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  color: 'rgba(59, 130, 246, 0.9)',
                  fontWeight: '700'
                }}>
                  {offTeamName} eFG%
                </span>
                <span style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: isMobile ? '0.813rem' : '0.875rem',
                  fontWeight: '900',
                  color: '#3B82F6',
                  letterSpacing: '-0.01em'
                }}>
                  {offTeam.eFG_off.toFixed(1)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: isMobile ? '6px' : '7px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid rgba(59, 130, 246, 0.15)'
              }}>
                <div style={{
                  height: '100%',
                  width: `${getPercentageWidth(offTeam.eFG_off, 70)}%`,
                  background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                  borderRadius: '10px',
                  boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)',
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>
            
            {/* Defensive Team Allows */}
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: isMobile ? '0.375rem' : '0.438rem'
              }}>
                <span style={{
                  fontSize: isMobile ? '0.688rem' : '0.75rem',
                  color: 'rgba(239, 68, 68, 0.9)',
                  fontWeight: '700'
                }}>
                  {defTeamName} allows
                </span>
                <span style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: isMobile ? '0.813rem' : '0.875rem',
                  fontWeight: '900',
                  color: '#EF4444',
                  letterSpacing: '-0.01em'
                }}>
                  {defTeam.eFG_def.toFixed(1)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: isMobile ? '6px' : '7px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid rgba(239, 68, 68, 0.15)'
              }}>
                <div style={{
                  height: '100%',
                  width: `${getPercentageWidth(defTeam.eFG_def, 70)}%`,
                  background: 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)',
                  borderRadius: '10px',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)',
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>
            
            {/* Shooting Advantage Summary */}
            <div style={{
              paddingTop: isMobile ? '0.5rem' : '0.625rem',
              marginTop: isMobile ? '0.438rem' : '0.5rem',
              borderTop: '1px solid rgba(59, 130, 246, 0.15)',
              background: parseFloat(matchupDiff) > 0
                ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)'
                : 'linear-gradient(90deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.04) 100%)',
              borderRadius: '6px',
              padding: isMobile ? '0.438rem 0.625rem' : '0.5rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <span style={{ fontSize: isMobile ? '0.938rem' : '1rem' }}>
                {parseFloat(matchupDiff) > 0 ? '✓' : '⚠'}
              </span>
              <span style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                fontWeight: '800',
                color: parseFloat(matchupDiff) > 0 ? '#10B981' : '#EF4444',
                letterSpacing: '0.01em'
              }}>
                {matchupDiff}% shooting advantage
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Matchup Factors - Premium Card */}
      <div style={{ padding: isMobile ? '0 1.125rem 1rem' : '0 1.375rem 1.125rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%)',
          borderRadius: '12px',
          padding: isMobile ? '0.875rem 1rem' : '1rem 1.125rem',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 2px 12px rgba(139, 92, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
        }}>
          <div style={{
            fontSize: isMobile ? '0.625rem' : '0.688rem',
            fontWeight: '800',
            color: 'rgba(139, 92, 246, 0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: isMobile ? '0.625rem' : '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <span style={{ fontSize: isMobile ? '0.875rem' : '0.938rem' }}>🔑</span>
            KEY MATCHUP FACTORS
          </div>
          
          <div style={{ display: 'grid', gap: isMobile ? '0.438rem' : '0.5rem' }}>
            {/* Factor 1: 2P Shooting */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: isMobile ? '0.438rem' : '0.5rem',
              padding: isMobile ? '0.375rem' : '0.438rem',
              background: offTeam.twoP_off > 50 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              borderRadius: '6px'
            }}>
              <span style={{ 
                marginTop: '0.125rem',
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                color: offTeam.twoP_off > 50 ? '#10B981' : 'rgba(255, 255, 255, 0.3)'
              }}>
                {offTeam.twoP_off > 50 ? '✓' : '•'}
              </span>
              <span style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.4,
                fontWeight: '600'
              }}>
                <span style={{ color: 'white', fontWeight: '800' }}>{offTeamName}</span> shoots 2P at {offTeam.twoP_off.toFixed(1)}%
              </span>
            </div>
            
            {/* Factor 2: 3P Shooting */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: isMobile ? '0.438rem' : '0.5rem',
              padding: isMobile ? '0.375rem' : '0.438rem',
              background: offTeam.threeP_off > 35 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              borderRadius: '6px'
            }}>
              <span style={{ 
                marginTop: '0.125rem',
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                color: offTeam.threeP_off > 35 ? '#10B981' : 'rgba(255, 255, 255, 0.3)'
              }}>
                {offTeam.threeP_off > 35 ? '✓' : '•'}
              </span>
              <span style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.4,
                fontWeight: '600'
              }}>
                <span style={{ color: 'white', fontWeight: '800' }}>{offTeamName}</span> shoots 3P at {offTeam.threeP_off.toFixed(1)}%
              </span>
            </div>
            
            {/* Factor 3: Defense Allows */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: isMobile ? '0.438rem' : '0.5rem',
              padding: isMobile ? '0.375rem' : '0.438rem',
              background: defTeam.eFG_def < 50 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(251, 191, 36, 0.05)',
              borderRadius: '6px'
            }}>
              <span style={{ 
                marginTop: '0.125rem',
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                color: defTeam.eFG_def < 50 ? '#10B981' : '#FBB936'
              }}>
                {defTeam.eFG_def < 50 ? '✓' : '⚠'}
              </span>
              <span style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.4,
                fontWeight: '600'
              }}>
                <span style={{ color: 'white', fontWeight: '800' }}>{defTeamName}</span> allows {defTeam.eFG_def.toFixed(1)}% eFG
              </span>
            </div>
            
            {/* Factor 4: Turnovers */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: isMobile ? '0.438rem' : '0.5rem',
              padding: isMobile ? '0.375rem' : '0.438rem',
              background: offTeam.to_off < 18 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(251, 191, 36, 0.05)',
              borderRadius: '6px'
            }}>
              <span style={{ 
                marginTop: '0.125rem',
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                color: offTeam.to_off < 18 ? '#10B981' : '#FBB936'
              }}>
                {offTeam.to_off < 18 ? '✓' : '⚠'}
              </span>
              <span style={{
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.4,
                fontWeight: '600'
              }}>
                <span style={{ color: 'white', fontWeight: '800' }}>{offTeamName}</span> turns ball over at {offTeam.to_off.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Expand/Collapse Button */}
      <div style={{ padding: isMobile ? '0 1.125rem 1rem' : '0 1.375rem 1.125rem' }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '0.438rem' : '0.5rem',
            padding: isMobile ? '0.625rem' : '0.688rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.15) 0%, rgba(51, 65, 85, 0.15) 100%)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(71, 85, 105, 0.25) 0%, rgba(51, 65, 85, 0.25) 100%)';
            e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.5)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(71, 85, 105, 0.15) 0%, rgba(51, 65, 85, 0.15) 100%)';
            e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
          }}
        >
          <span style={{
            fontSize: isMobile ? '0.688rem' : '0.75rem',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.75)',
            letterSpacing: '0.02em'
          }}>
            {expanded ? 'Show Less' : 'Show Full Statistics'}
          </span>
          {expanded ? (
            <ChevronUp style={{ width: '15px', height: '15px', color: 'rgba(255, 255, 255, 0.6)' }} />
          ) : (
            <ChevronDown style={{ width: '15px', height: '15px', color: 'rgba(255, 255, 255, 0.6)' }} />
          )}
        </button>
      </div>

      {/* Expanded Stats - Premium Design */}
      {expanded && (
        <div style={{ 
          padding: isMobile ? '0 1.125rem 1rem' : '0 1.375rem 1.125rem',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          
          <div style={{ display: 'grid', gap: isMobile ? '0.625rem' : '0.75rem' }}>
            {/* Advanced Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: isMobile ? '0.625rem' : '0.75rem'
            }}>
              {/* Turnover Rate */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                borderRadius: '10px',
                padding: isMobile ? '0.75rem' : '0.875rem',
                border: '1px solid rgba(71, 85, 105, 0.25)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)'
              }}>
                <div style={{
                  fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: isMobile ? '0.438rem' : '0.5rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Turnover Rate
                </div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: isMobile ? '0.75rem' : '0.813rem',
                  color: 'white',
                  fontWeight: '800',
                  marginBottom: '0.188rem'
                }}>
                  OFF: {offTeam.to_off.toFixed(1)}%
                </div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: isMobile ? '0.75rem' : '0.813rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: '700'
                }}>
                  DEF: {defTeam.to_def.toFixed(1)}%
                </div>
              </div>
              
              {/* Offensive Rebound % */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                borderRadius: '10px',
                padding: isMobile ? '0.75rem' : '0.875rem',
                border: '1px solid rgba(71, 85, 105, 0.25)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)'
              }}>
                <div style={{
                  fontSize: isMobile ? '0.625rem' : '0.688rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: isMobile ? '0.438rem' : '0.5rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Off. Rebound %
                </div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: isMobile ? '0.75rem' : '0.813rem',
                  color: 'white',
                  fontWeight: '800',
                  marginBottom: '0.188rem'
                }}>
                  OFF: {offTeam.oreb_off.toFixed(1)}%
                </div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: isMobile ? '0.75rem' : '0.813rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: '700'
                }}>
                  DEF: {defTeam.oreb_def.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* National Rankings - Premium Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
              borderRadius: '10px',
              padding: isMobile ? '0.875rem 1rem' : '1rem 1.125rem',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              boxShadow: '0 2px 12px rgba(99, 102, 241, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
            }}>
              <div style={{
                fontSize: isMobile ? '0.625rem' : '0.688rem',
                fontWeight: '800',
                color: 'rgba(167, 139, 250, 0.9)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: isMobile ? '0.625rem' : '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}>
                <span style={{ fontSize: isMobile ? '0.875rem' : '0.938rem' }}>🏆</span>
                NATIONAL RANKINGS
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: isMobile ? '0.75rem' : '1rem'
              }}>
                <div>
                  <div style={{
                    fontSize: isMobile ? '0.688rem' : '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: isMobile ? '0.313rem' : '0.375rem',
                    fontWeight: '600'
                  }}>
                    {offTeamName}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.813rem' : '0.875rem',
                    fontWeight: '900',
                    color: 'white',
                    letterSpacing: '-0.01em'
                  }}>
                    Overall: <span style={{ color: '#A78BFA' }}>#{offTeam.rank}</span> of 365
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: isMobile ? '0.688rem' : '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: isMobile ? '0.313rem' : '0.375rem',
                    fontWeight: '600'
                  }}>
                    {defTeamName}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.813rem' : '0.875rem',
                    fontWeight: '900',
                    color: 'white',
                    letterSpacing: '-0.01em'
                  }}>
                    Overall: <span style={{ color: '#A78BFA' }}>#{defTeam.rank}</span> of 365
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Branding Footer */}
      <div style={{
        padding: isMobile ? '0.75rem 1.125rem' : '0.875rem 1.375rem',
        borderTop: '1px solid rgba(71, 85, 105, 0.2)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)'
      }}>
        <div style={{
          fontSize: isMobile ? '0.625rem' : '0.688rem',
          color: 'rgba(255, 255, 255, 0.4)',
          textAlign: 'center',
          fontWeight: '600',
          letterSpacing: '0.02em'
        }}>
          Powered by NHL Savant Advanced Analytics
        </div>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;

