/**
 * 🏀 MATCHUP INTELLIGENCE v7 - PREMIUM MOBILE-FIRST
 * Elite analytics experience optimized for mobile
 */

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

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
  eFG_def: number;
  to_off: number;
  to_def: number;
  oreb_off: number;
  oreb_def: number;
  twoP_off: number;
  twoP_def?: number;
  threeP_off: number;
  threeP_def?: number;
  bartholomew?: number;
  bartholomew_rank?: number;
  adjTempo?: number;
  ftRate_off?: number;
  ftRate_def?: number;
  threeP_rate_off?: number;
  threeP_rate_def?: number;
}

interface MatchupAnalysis {
  rankAdvantage: 'away' | 'home';
  rankDiff: number;
}

type ViewMode = 'awayOff_homeDef' | 'homeOff_awayDef';

const getPercentile = (rank: number) => Math.round((1 - (rank - 1) / (TOTAL_TEAMS - 1)) * 100);

const getTier = (rank: number) => {
  if (rank <= 25) return { label: 'ELITE', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' };
  if (rank <= 50) return { label: 'EXCELLENT', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)' };
  if (rank <= 100) return { label: 'STRONG', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' };
  if (rank <= 175) return { label: 'AVERAGE', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' };
  if (rank <= 275) return { label: 'BELOW AVG', color: '#F97316', bg: 'rgba(249, 115, 22, 0.12)' };
  return { label: 'WEAK', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' };
};

// Premium Power Ring Component
const PowerRing = ({ rank, size, color, teamName, offRank, defRank, isMobile }: {
  rank: number; size: number; color: string; teamName: string; offRank: number; defRank: number; isMobile: boolean;
}) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => { setTimeout(() => setProgress((TOTAL_TEAMS - rank) / TOTAL_TEAMS), 100); }, [rank]);
  
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const tier = getTier(rank);
  
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        fontSize: isMobile ? '13px' : '14px', 
        fontWeight: '700', 
        color: 'white', 
        marginBottom: isMobile ? '12px' : '16px',
        letterSpacing: '0.01em'
      }}>{teamName}</div>
      
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
        {/* Outer glow ring */}
        <div style={{
          position: 'absolute', inset: -4,
          borderRadius: '50%',
          background: `conic-gradient(from 0deg, ${color}00, ${color}30, ${color}00)`,
          filter: 'blur(8px)',
          opacity: progress
        }} />
        
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(30, 41, 59, 0.6)" strokeWidth={strokeWidth} />
          {/* Progress */}
          <circle 
            cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={`url(#ring-${teamName.replace(/\s/g, '')})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress * circumference}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          <defs>
            <linearGradient id={`ring-${teamName.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ 
            fontSize: size * 0.28, 
            fontWeight: '800', 
            color: 'white',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: '-0.03em',
            lineHeight: 1
          }}>#{rank}</div>
          <div style={{ 
            fontSize: size * 0.08, 
            fontWeight: '600', 
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.15em',
            marginTop: 4
          }}>OVERALL</div>
        </div>
      </div>
      
      {/* Tier badge */}
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center',
        gap: '6px',
        marginTop: isMobile ? '10px' : '14px',
        padding: isMobile ? '5px 12px' : '6px 14px',
        borderRadius: '8px',
        background: tier.bg,
        border: `1px solid ${tier.color}30`
      }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: tier.color, boxShadow: `0 0 8px ${tier.color}` }} />
        <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: tier.color, letterSpacing: '0.1em' }}>{tier.label}</span>
      </div>
      
      <div style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
        Top {getPercentile(rank)}% of D1
      </div>
      
      {/* Off/Def ranks */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: isMobile ? '16px' : '20px', 
        marginTop: isMobile ? '12px' : '16px',
        padding: isMobile ? '10px 12px' : '12px 16px',
        background: 'rgba(0,0,0,0.25)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: '3px' }}>OFF</div>
          <div style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '800', color: '#34D399', fontFamily: 'ui-monospace, monospace' }}>#{offRank}</div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
        <div>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: '3px' }}>DEF</div>
          <div style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '800', color: '#F87171', fontFamily: 'ui-monospace, monospace' }}>#{defRank}</div>
        </div>
      </div>
    </div>
  );
};

// Premium Stat Row Component
const StatRow = ({ label, leftTeam, rightTeam, leftVal, rightVal, leftColor, rightColor, insight, isMobile }: {
  label: string; leftTeam: string; rightTeam: string; 
  leftVal: number; rightVal: number; leftColor: string; rightColor: string;
  insight?: string; isMobile: boolean;
}) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 200); }, []);
  
  return (
    <div style={{ 
      padding: isMobile ? '14px' : '18px', 
      background: 'rgba(15, 23, 42, 0.4)', 
      borderRadius: '14px',
      border: '1px solid rgba(255,255,255,0.03)'
    }}>
      <div style={{ 
        fontSize: isMobile ? '9px' : '10px', 
        fontWeight: '700', 
        color: 'rgba(255,255,255,0.5)', 
        letterSpacing: '0.1em',
        marginBottom: isMobile ? '12px' : '14px'
      }}>{label}</div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
        {/* Left side */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.4)' }}>{leftTeam}</span>
            <span style={{ 
              fontSize: isMobile ? '16px' : '18px', 
              fontWeight: '800', 
              color: leftColor,
              fontFamily: 'ui-monospace, monospace'
            }}>{leftVal.toFixed(1)}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${animated ? Math.min((leftVal / 65) * 100, 100) : 0}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${leftColor}50, ${leftColor})`,
              borderRadius: '3px',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>
        
        {/* Divider */}
        <div style={{ 
          width: isMobile ? '24px' : '32px', 
          textAlign: 'center',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.2)',
          fontWeight: '600'
        }}>→</div>
        
        {/* Right side */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.4)' }}>{rightTeam}</span>
            <span style={{ 
              fontSize: isMobile ? '16px' : '18px', 
              fontWeight: '800', 
              color: rightColor,
              fontFamily: 'ui-monospace, monospace'
            }}>{rightVal.toFixed(1)}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${animated ? Math.min((rightVal / 65) * 100, 100) : 0}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${rightColor}50, ${rightColor})`,
              borderRadius: '3px',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>
      </div>
      
      {insight && (
        <div style={{ 
          marginTop: '12px', 
          padding: isMobile ? '8px 10px' : '10px 12px',
          background: 'rgba(16, 185, 129, 0.08)',
          borderRadius: '8px',
          borderLeft: '3px solid #10B981',
          fontSize: isMobile ? '10px' : '11px',
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.5
        }}>{insight}</div>
      )}
    </div>
  );
};

export function AdvancedMatchupCard({ barttorvik, awayTeam, homeTeam }: AdvancedMatchupCardProps) {
  const [view, setView] = useState<ViewMode>('awayOff_homeDef');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!barttorvik) return null;

  const { away, home } = barttorvik;
  const isAwayOffView = view === 'awayOff_homeDef';
  const offTeam = isAwayOffView ? away : home;
  const defTeam = isAwayOffView ? home : away;
  const offTeamName = isAwayOffView ? awayTeam : homeTeam;
  const defTeamName = isAwayOffView ? homeTeam : awayTeam;

  const awayRank = away.bartholomew_rank || away.rank || 182;
  const homeRank = home.bartholomew_rank || home.rank || 182;
  const awayTier = getTier(awayRank);
  const homeTier = getTier(homeRank);

  const offRank = offTeam.adjOff_rank || 182;
  const defRank = defTeam.adjDef_rank || 182;
  const mismatch = defRank - offRank;

  const twoP = { off: offTeam.twoP_off || 50, def: defTeam.twoP_def || 50 };
  const threeP = { off: offTeam.threeP_off || 34, def: defTeam.threeP_def || 34 };
  const threePRate = { off: offTeam.threeP_rate_off || 40, def: defTeam.threeP_rate_def || 40 };
  const eFG = { off: offTeam.eFG_off || 50, def: defTeam.eFG_def || 50 };
  const tempo = { off: offTeam.adjTempo || 67, def: defTeam.adjTempo || 67 };

  const edges = [
    { key: 'PWR', label: 'Power', good: awayRank < homeRank },
    { key: 'SHOOT', label: 'Shooting', good: eFG.off > eFG.def },
    { key: 'TEMPO', label: 'Tempo', good: tempo.off > tempo.def },
    { key: 'TO', label: 'Turnovers', good: offTeam.to_off < defTeam.to_def, risk: defTeam.to_def > offTeam.to_off + 2 },
    { key: 'VAR', label: 'Variance', good: threePRate.off < 45, risk: threePRate.off >= 45 }
  ];

  const edgeCount = edges.filter(e => e.good && !e.risk).length;

  const ringSize = isMobile ? 100 : 120;
  const padding = isMobile ? '16px' : '24px';

  return (
    <div style={{
      background: 'linear-gradient(180deg, #020617 0%, #0F172A 100%)',
      borderRadius: isMobile ? '16px' : '20px',
      border: '1px solid rgba(99, 102, 241, 0.12)',
      overflow: 'hidden',
      boxShadow: '0 20px 60px -20px rgba(0, 0, 0, 0.7)'
    }}>
      
      {/* ═══════════════════ HEADER ═══════════════════ */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.06) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(99, 102, 241, 0.06) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        padding: isMobile ? '14px 16px' : '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
          <div>
          <div style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(167, 139, 250, 0.7)', letterSpacing: '0.2em', marginBottom: '3px' }}>ADVANCED ANALYTICS</div>
          <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: 'white' }}>Matchup Intelligence</div>
        </div>
        <button
          onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: isMobile ? '8px 12px' : '10px 16px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            cursor: 'pointer'
          }}
        >
          <ArrowRightLeft size={isMobile ? 12 : 14} color="#C7D2FE" />
          <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#E0E7FF', letterSpacing: '0.05em' }}>FLIP</span>
        </button>
      </div>

      {/* ═══════════════════ POWER RATINGS ═══════════════════ */}
      <div style={{ padding }}>
        <div style={{
          textAlign: 'center', 
          marginBottom: isMobile ? '16px' : '24px',
          padding: '10px 0',
          background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.06), transparent)'
        }}>
          <span style={{ 
            fontSize: isMobile ? '10px' : '11px', 
            fontWeight: '700',
            color: '#FBBF24',
            letterSpacing: '0.2em'
          }}>◈ POWER RATINGS ◈</span>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: isMobile ? '12px' : '20px',
          padding: isMobile ? '16px' : '24px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.3) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(251, 191, 36, 0.08)'
        }}>
          <PowerRing 
            rank={awayRank} 
            size={ringSize} 
            color={awayTier.color} 
            teamName={awayTeam}
            offRank={away.adjOff_rank}
            defRank={away.adjDef_rank}
            isMobile={isMobile}
          />
          <PowerRing 
            rank={homeRank} 
            size={ringSize} 
            color={homeTier.color} 
            teamName={homeTeam}
            offRank={home.adjOff_rank}
            defRank={home.adjDef_rank}
            isMobile={isMobile}
          />
      </div>

        {/* Power Gap */}
        {Math.abs(awayRank - homeRank) > 25 && (
          <div style={{
            marginTop: isMobile ? '12px' : '16px',
            padding: isMobile ? '10px 14px' : '12px 18px',
            background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.06), rgba(251, 191, 36, 0.03))',
            borderRadius: '10px',
            borderLeft: '3px solid #FBBF24',
            fontSize: isMobile ? '11px' : '12px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5
          }}>
            <span style={{ color: '#FBBF24', fontWeight: '700' }}>{awayRank < homeRank ? awayTeam : homeTeam}</span>
            {' '}ranked{' '}
            <span style={{ color: '#FBBF24', fontWeight: '700' }}>{Math.abs(awayRank - homeRank)} spots higher</span>
            {' '}— {Math.abs(awayRank - homeRank) > 75 ? 'significant quality advantage' : 'notable edge in overall strength'}
          </div>
        )}
      </div>

      {/* ═══════════════════ MISMATCH INDEX ═══════════════════ */}
      <div style={{ padding: `0 ${padding} ${padding}` }}>
        <div style={{
          padding: isMobile ? '18px' : '24px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(99, 102, 241, 0.03) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.12)'
        }}>
          <div style={{ 
            textAlign: 'center', 
            fontSize: isMobile ? '9px' : '10px', 
            fontWeight: '700', 
            color: '#A78BFA', 
            letterSpacing: '0.15em',
            marginBottom: isMobile ? '14px' : '18px'
          }}>⚡ MATCHUP MISMATCH ⚡</div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr auto 1fr', 
            gap: isMobile ? '8px' : '16px', 
            alignItems: 'center',
            marginBottom: isMobile ? '14px' : '18px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '4px' }}>{offTeamName.toUpperCase().slice(0, isMobile ? 8 : 12)} OFF</div>
              <div style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '800', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>#{offRank}</div>
              <div style={{ fontSize: '9px', color: getTier(offRank).color }}>{getPercentile(offRank)}th %ile</div>
            </div>
            <div style={{ 
              width: isMobile ? '32px' : '40px', 
              height: isMobile ? '32px' : '40px',
              borderRadius: '50%',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '700'
            }}>VS</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '4px' }}>{defTeamName.toUpperCase().slice(0, isMobile ? 8 : 12)} DEF</div>
              <div style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '800', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>#{defRank}</div>
              <div style={{ fontSize: '9px', color: getTier(defRank).color }}>{getPercentile(defRank)}th %ile</div>
            </div>
          </div>

          {/* Mismatch score */}
              <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              padding: isMobile ? '12px 20px' : '14px 28px',
              borderRadius: '12px',
              background: mismatch > 50 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08))'
                : mismatch > 0 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08))'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))',
              border: `1px solid ${mismatch > 50 ? 'rgba(16, 185, 129, 0.25)' : mismatch > 0 ? 'rgba(59, 130, 246, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
            }}>
              <div style={{ 
                fontSize: isMobile ? '22px' : '26px', 
                fontWeight: '800',
                color: mismatch > 50 ? '#10B981' : mismatch > 0 ? '#3B82F6' : '#EF4444',
                fontFamily: 'ui-monospace, monospace'
              }}>{mismatch > 0 ? '+' : ''}{mismatch}</div>
              <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginTop: '2px' }}>
                {mismatch > 150 ? 'MASSIVE EDGE' : mismatch > 75 ? 'STRONG EDGE' : mismatch > 25 ? 'SLIGHT EDGE' : mismatch > -25 ? 'EVEN' : 'TOUGH MATCHUP'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ SHOOTING ═══════════════════ */}
      <div style={{ padding: `0 ${padding} ${padding}` }}>
        <div style={{
          padding: isMobile ? '14px' : '20px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.2) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(251, 191, 36, 0.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: isMobile ? '14px' : '18px' 
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FBBF24' }} />
            <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#FBBF24', letterSpacing: '0.12em' }}>SHOOTING BREAKDOWN</span>
        </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '14px' }}>
            <StatRow
              label="2-POINT EFFICIENCY"
              leftTeam={`${offTeamName.slice(0, 6)} shoots`}
              rightTeam={`${defTeamName.slice(0, 6)} allows`}
              leftVal={twoP.off}
              rightVal={twoP.def}
              leftColor={twoP.off > 52 ? '#10B981' : twoP.off > 48 ? '#F59E0B' : '#EF4444'}
              rightColor={twoP.def > 52 ? '#EF4444' : twoP.def > 48 ? '#F59E0B' : '#10B981'}
              insight={twoP.off > 54 && twoP.def > 52 ? "Elite finishers vs weak interior D — paint points expected" : undefined}
              isMobile={isMobile}
            />

            <StatRow
              label="3-POINT ACCURACY"
              leftTeam={`${offTeamName.slice(0, 6)} shoots`}
              rightTeam={`${defTeamName.slice(0, 6)} allows`}
              leftVal={threeP.off}
              rightVal={threeP.def}
              leftColor={threeP.off > 36 ? '#10B981' : threeP.off > 32 ? '#F59E0B' : '#EF4444'}
              rightColor={threeP.def > 36 ? '#EF4444' : threeP.def > 32 ? '#F59E0B' : '#10B981'}
              insight={threePRate.off > 45 && threeP.off > 34 ? "High-volume 3PT team with solid accuracy — can score in bunches" : 
                       threePRate.off > 48 && threeP.off < 33 ? "⚠️ Heavy 3PT reliance with low accuracy — volatile outcomes likely" : undefined}
              isMobile={isMobile}
            />

            <StatRow
              label="OVERALL EFFICIENCY (eFG%)"
              leftTeam={`${offTeamName.slice(0, 6)} shoots`}
              rightTeam={`${defTeamName.slice(0, 6)} allows`}
              leftVal={eFG.off}
              rightVal={eFG.def}
              leftColor={eFG.off > 52 ? '#10B981' : eFG.off > 48 ? '#F59E0B' : '#EF4444'}
              rightColor={eFG.def > 52 ? '#EF4444' : eFG.def > 48 ? '#F59E0B' : '#10B981'}
              isMobile={isMobile}
            />
              </div>
        </div>
      </div>

      {/* ═══════════════════ EDGE SUMMARY ═══════════════════ */}
      <div style={{ padding: `0 ${padding} ${padding}` }}>
        <div style={{
          padding: isMobile ? '16px' : '22px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(6, 182, 212, 0.03) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(16, 185, 129, 0.1)'
        }}>
          <div style={{ 
            textAlign: 'center', 
            fontSize: isMobile ? '9px' : '10px', 
            fontWeight: '700',
            color: '#10B981',
            letterSpacing: '0.15em',
            marginBottom: isMobile ? '14px' : '18px'
          }}>◈ EDGE SUMMARY ◈</div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: isMobile ? '6px' : '8px', 
            flexWrap: 'wrap',
            marginBottom: isMobile ? '14px' : '18px'
          }}>
            {edges.map(edge => (
              <div key={edge.key} style={{
                width: isMobile ? '44px' : '52px',
                padding: isMobile ? '8px 4px' : '10px 6px',
                borderRadius: '10px',
                textAlign: 'center',
                background: edge.risk ? 'rgba(239, 68, 68, 0.1)' : edge.good ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                border: `1px solid ${edge.risk ? 'rgba(239, 68, 68, 0.2)' : edge.good ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.15)'}`
              }}>
                <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginBottom: '3px' }}>{edge.key}</div>
                <div style={{ fontSize: isMobile ? '14px' : '16px' }}>{edge.risk ? '⚠️' : edge.good ? '✅' : '➖'}</div>
              </div>
            ))}
          </div>

          <div style={{ 
            textAlign: 'center', 
            paddingTop: isMobile ? '12px' : '16px', 
            borderTop: '1px solid rgba(255,255,255,0.05)' 
          }}>
            <div style={{ 
              fontSize: isMobile ? '14px' : '16px', 
              fontWeight: '800',
              color: edgeCount >= 3 ? '#10B981' : edgeCount >= 2 ? '#F59E0B' : '#EF4444'
            }}>
              🏆 {offTeamName.toUpperCase()} {edgeCount >= 3 ? 'FAVORED' : edgeCount >= 2 ? 'SLIGHT EDGE' : 'FACES CHALLENGES'}
            </div>
            <div style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
              {edgeCount} Edges • {edges.filter(e => e.risk).length} Risks
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <div style={{ 
        padding: isMobile ? '12px 16px' : '14px 24px',
        borderTop: '1px solid rgba(99, 102, 241, 0.06)',
        background: 'rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
      }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6366F1' }} />
        <span style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>SAVANT ANALYTICS ENGINE</span>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
