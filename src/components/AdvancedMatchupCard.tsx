/**
 * 🏀 MATCHUP INTELLIGENCE v6 - PREMIUM ANALYTICS
 * Bloomberg-tier sports analytics with premium visual design
 */

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Activity } from 'lucide-react';

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

// Premium tier system
const getTier = (rank: number) => {
  if (rank <= 25) return { label: 'ELITE', color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' };
  if (rank <= 50) return { label: 'EXCELLENT', color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.4)' };
  if (rank <= 100) return { label: 'STRONG', color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)' };
  if (rank <= 175) return { label: 'AVERAGE', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)' };
  if (rank <= 275) return { label: 'BELOW AVG', color: '#F97316', glow: 'rgba(249, 115, 22, 0.3)' };
  return { label: 'WEAK', color: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)' };
};

// Radial Progress Component
const RadialGauge = ({ value, max, size, color, glow, label, sublabel }: { 
  value: number; max: number; size: number; color: string; glow: string; label: string; sublabel?: string 
}) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 200); }, []);
  
  const strokeWidth = size / 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min(value / max, 1);
  const offset = circumference - (animated ? percent : 0) * circumference;
  
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(30, 41, 59, 0.8)" strokeWidth={strokeWidth} />
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gauge-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        {/* Progress arc */}
        <circle 
          cx={size/2} cy={size/2} r={radius} fill="none" 
          stroke={`url(#gauge-${label})`}
          strokeWidth={strokeWidth} 
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ 
            filter: `drop-shadow(0 0 ${size/10}px ${glow})`,
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </svg>
      <div style={{ 
        position: 'absolute', inset: 0, 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ 
          fontSize: size / 3.5, fontWeight: '900', color: 'white', 
          fontFamily: 'ui-monospace, monospace',
          textShadow: `0 0 20px ${glow}`
        }}>{label}</div>
        {sublabel && <div style={{ fontSize: size / 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, letterSpacing: '0.05em' }}>{sublabel}</div>}
      </div>
    </div>
  );
};

// Premium Stat Bar Component
const StatBar = ({ leftValue, rightValue, leftLabel, rightLabel, leftColor, rightColor, maxValue = 65 }: {
  leftValue: number; rightValue: number; leftLabel: string; rightLabel: string;
  leftColor: string; rightColor: string; maxValue?: number;
}) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 300); }, []);
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '12px', alignItems: 'center' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{leftLabel}</span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: leftColor, fontFamily: 'ui-monospace, monospace' }}>{leftValue.toFixed(1)}%</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${animated ? Math.min((leftValue / maxValue) * 100, 100) : 0}%`, 
            height: '100%', 
            background: `linear-gradient(90deg, ${leftColor}60, ${leftColor})`,
            borderRadius: '2px',
            boxShadow: `0 0 10px ${leftColor}40`,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>
      <div style={{ 
        textAlign: 'center', 
        fontSize: '11px', 
        color: 'rgba(255,255,255,0.3)',
        fontWeight: '600'
      }}>→</div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{rightLabel}</span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: rightColor, fontFamily: 'ui-monospace, monospace' }}>{rightValue.toFixed(1)}%</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${animated ? Math.min((rightValue / maxValue) * 100, 100) : 0}%`, 
            height: '100%', 
            background: `linear-gradient(90deg, ${rightColor}60, ${rightColor})`,
            borderRadius: '2px',
            boxShadow: `0 0 10px ${rightColor}40`,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>
    </div>
  );
};

export function AdvancedMatchupCard({ barttorvik, awayTeam, homeTeam }: AdvancedMatchupCardProps) {
  const [view, setView] = useState<ViewMode>('awayOff_homeDef');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!barttorvik) return null;

  const { away, home } = barttorvik;

  const isAwayOffView = view === 'awayOff_homeDef';
  const offTeam = isAwayOffView ? away : home;
  const defTeam = isAwayOffView ? home : away;
  const offTeamName = isAwayOffView ? awayTeam : homeTeam;
  const defTeamName = isAwayOffView ? homeTeam : awayTeam;

  // Power ratings
  const awayPowerRank = away.bartholomew_rank || away.rank || 182;
  const homePowerRank = home.bartholomew_rank || home.rank || 182;
  const awayBarthag = (away.bartholomew || 0.5) * 100;
  const homeBarthag = (home.bartholomew || 0.5) * 100;
  const awayTier = getTier(awayPowerRank);
  const homeTier = getTier(homePowerRank);

  // Mismatch
  const offRank = offTeam.adjOff_rank || 182;
  const defRank = defTeam.adjDef_rank || 182;
  const mismatchScore = defRank - offRank;

  // Stats
  const twoP = { off: offTeam.twoP_off || 50, def: defTeam.twoP_def || 50 };
  const threeP = { off: offTeam.threeP_off || 34, def: defTeam.threeP_def || 34 };
  const threePRate = { off: offTeam.threeP_rate_off || 40, def: defTeam.threeP_rate_def || 40 };
  const eFG = { off: offTeam.eFG_off || 50, def: defTeam.eFG_def || 50 };
  const oreb = { off: offTeam.oreb_off || 28, def: defTeam.oreb_def || 28 };
  const tempo = { off: offTeam.adjTempo || 67, def: defTeam.adjTempo || 67 };
  const ftRate = { off: offTeam.ftRate_off || 32, def: defTeam.ftRate_off || 32 };
  const turnover = { off: offTeam.to_off || 18, def: defTeam.to_def || 18 };

  // Edge calculation
  const edges = {
    power: awayPowerRank < homePowerRank,
    shooting: eFG.off > eFG.def,
    boards: oreb.off > oreb.def,
    tempo: tempo.off > tempo.def,
    ft: ftRate.off > ftRate.def,
  };
  const edgeCount = Object.values(edges).filter(Boolean).length;
  const riskFactors = [
    turnover.def > turnover.off + 2,
    Math.max(offTeam.threeP_rate_off || 40, defTeam.threeP_rate_off || 40) >= 45
  ].filter(Boolean).length;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #030712 0%, #0F172A 100%)',
      borderRadius: '24px',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      overflow: 'hidden',
      boxShadow: '0 25px 80px -20px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05)'
    }}>
      
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* PREMIUM HEADER */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.12) 50%, rgba(99, 102, 241, 0.08) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Activity size={18} color="#A5B4FC" />
          </div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(167, 139, 250, 0.8)', letterSpacing: '0.2em', marginBottom: '2px' }}>ADVANCED ANALYTICS</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'white', letterSpacing: '-0.01em' }}>Matchup Intelligence</div>
          </div>
        </div>
        <button
          onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowRightLeft size={14} color="#C7D2FE" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#E0E7FF', letterSpacing: '0.05em' }}>FLIP VIEW</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* POWER RATINGS - PREMIUM GAUGES */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '32px 28px' }}>
        <div style={{ 
          textAlign: 'center', marginBottom: '28px',
          background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent)',
          padding: '8px 0'
        }}>
          <span style={{ 
            fontSize: '11px', fontWeight: '700', 
            background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '0.2em'
          }}>◆ POWER RATINGS ◆</span>
        </div>

        <div style={{ 
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%)',
          borderRadius: '20px', padding: '28px',
          border: '1px solid rgba(251, 191, 36, 0.1)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)'
        }}>
          {/* Away Team */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: '20px', letterSpacing: '0.02em' }}>{awayTeam}</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <RadialGauge value={awayBarthag} max={100} size={isMobile ? 110 : 130} color={awayTier.color} glow={awayTier.glow} label={`${Math.round(awayBarthag)}%`} />
            </div>
            <div style={{ 
              fontSize: '22px', fontWeight: '900', 
              background: `linear-gradient(135deg, ${awayTier.color}, ${awayTier.color}CC)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: '4px'
            }}>#{awayPowerRank}</div>
            <div style={{ 
              display: 'inline-block', padding: '4px 12px', borderRadius: '6px',
              background: `${awayTier.color}15`, border: `1px solid ${awayTier.color}30`,
              fontSize: '9px', fontWeight: '700', color: awayTier.color, letterSpacing: '0.1em'
            }}>{awayTier.label}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>OFFENSE</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#10B981' }}>#{away.adjOff_rank}</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>DEFENSE</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#EF4444' }}>#{away.adjDef_rank}</div>
              </div>
            </div>
          </div>

          {/* Home Team */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: '20px', letterSpacing: '0.02em' }}>{homeTeam}</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <RadialGauge value={homeBarthag} max={100} size={isMobile ? 110 : 130} color={homeTier.color} glow={homeTier.glow} label={`${Math.round(homeBarthag)}%`} />
            </div>
            <div style={{ 
              fontSize: '22px', fontWeight: '900', 
              background: `linear-gradient(135deg, ${homeTier.color}, ${homeTier.color}CC)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: '4px'
            }}>#{homePowerRank}</div>
            <div style={{ 
              display: 'inline-block', padding: '4px 12px', borderRadius: '6px',
              background: `${homeTier.color}15`, border: `1px solid ${homeTier.color}30`,
              fontSize: '9px', fontWeight: '700', color: homeTier.color, letterSpacing: '0.1em'
            }}>{homeTier.label}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>OFFENSE</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#10B981' }}>#{home.adjOff_rank}</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>DEFENSE</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#EF4444' }}>#{home.adjDef_rank}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* MISMATCH INDEX */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 28px 32px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)',
          borderRadius: '20px', padding: '24px',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative glow */}
          <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#A78BFA', letterSpacing: '0.15em' }}>⚡ MATCHUP MISMATCH INDEX ⚡</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '6px' }}>{offTeamName.toUpperCase()} OFF</div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#3B82F6', fontFamily: 'ui-monospace, monospace', textShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}>#{offRank}</div>
              <div style={{ fontSize: '10px', color: getTier(offRank).color, fontWeight: '600' }}>{getPercentile(offRank)}th %ile</div>
            </div>
            <div style={{ 
              width: '50px', height: '50px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '700'
            }}>VS</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '6px' }}>{defTeamName.toUpperCase()} DEF</div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#EF4444', fontFamily: 'ui-monospace, monospace', textShadow: '0 0 30px rgba(239, 68, 68, 0.5)' }}>#{defRank}</div>
              <div style={{ fontSize: '10px', color: getTier(defRank).color, fontWeight: '600' }}>{getPercentile(defRank)}th %ile</div>
            </div>
          </div>

          {/* Mismatch Result */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-block', padding: '16px 32px', borderRadius: '16px',
              background: mismatchScore > 50 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)'
                : mismatchScore > 0 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
              border: `1px solid ${mismatchScore > 50 ? 'rgba(16, 185, 129, 0.3)' : mismatchScore > 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              boxShadow: `0 0 40px ${mismatchScore > 50 ? 'rgba(16, 185, 129, 0.2)' : mismatchScore > 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
            }}>
              <div style={{ 
                fontSize: '28px', fontWeight: '900', 
                color: mismatchScore > 50 ? '#10B981' : mismatchScore > 0 ? '#3B82F6' : '#EF4444',
                fontFamily: 'ui-monospace, monospace',
                textShadow: `0 0 20px ${mismatchScore > 50 ? 'rgba(16, 185, 129, 0.5)' : mismatchScore > 0 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
              }}>
                {mismatchScore > 0 ? '+' : ''}{mismatchScore}
              </div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', marginTop: '4px' }}>
                {mismatchScore > 150 ? 'MASSIVE EDGE' : mismatchScore > 75 ? 'STRONG EDGE' : mismatchScore > 25 ? 'SLIGHT EDGE' : mismatchScore > -25 ? 'EVEN MATCHUP' : 'TOUGH MATCHUP'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* SHOOTING ANALYSIS */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 28px 32px' }}>
        <div style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.3) 100%)',
          borderRadius: '20px', padding: '24px',
          border: '1px solid rgba(251, 191, 36, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FBBF24', boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#FBBF24', letterSpacing: '0.12em' }}>SHOOTING BREAKDOWN</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 2PT */}
            <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', letterSpacing: '0.08em' }}>2-POINT EFFICIENCY</div>
              <StatBar 
                leftValue={twoP.off} rightValue={twoP.def}
                leftLabel={`${offTeamName} shoots`} rightLabel={`${defTeamName} allows`}
                leftColor={twoP.off > 52 ? '#10B981' : twoP.off > 48 ? '#F59E0B' : '#EF4444'}
                rightColor={twoP.def > 52 ? '#EF4444' : twoP.def > 48 ? '#F59E0B' : '#10B981'}
              />
            </div>

            {/* 3PT */}
            <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em' }}>3-POINT ACCURACY</div>
                {threeP.off - threeP.def > 2 && (
                  <div style={{ fontSize: '9px', fontWeight: '700', color: '#10B981', padding: '3px 8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '4px' }}>
                    +{(threeP.off - threeP.def).toFixed(1)}% EDGE
                  </div>
                )}
              </div>
              <StatBar 
                leftValue={threeP.off} rightValue={threeP.def}
                leftLabel={`${offTeamName} shoots`} rightLabel={`${defTeamName} allows`}
                leftColor={threeP.off > 36 ? '#10B981' : threeP.off > 32 ? '#F59E0B' : '#EF4444'}
                rightColor={threeP.def > 36 ? '#EF4444' : threeP.def > 32 ? '#F59E0B' : '#10B981'}
                maxValue={45}
              />
              
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', letterSpacing: '0.08em' }}>3PT VOLUME (RATE)</div>
                <StatBar 
                  leftValue={threePRate.off} rightValue={threePRate.def}
                  leftLabel={`${offTeamName} takes`} rightLabel={`${defTeamName} allows`}
                  leftColor={threePRate.off > 45 ? '#EF4444' : '#F59E0B'}
                  rightColor='#94A3B8'
                  maxValue={60}
                />
              </div>
            </div>

            {/* eFG */}
            <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', letterSpacing: '0.08em' }}>OVERALL EFFICIENCY (eFG%)</div>
              <StatBar 
                leftValue={eFG.off} rightValue={eFG.def}
                leftLabel={`${offTeamName} shoots`} rightLabel={`${defTeamName} allows`}
                leftColor={eFG.off > 52 ? '#10B981' : eFG.off > 48 ? '#F59E0B' : '#EF4444'}
                rightColor={eFG.def > 52 ? '#EF4444' : eFG.def > 48 ? '#F59E0B' : '#10B981'}
                maxValue={60}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* GAME FACTORS - COMPACT GRID */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 28px 32px' }}>
        <div style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.3) 100%)',
          borderRadius: '20px', padding: '24px',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818CF8', boxShadow: '0 0 10px rgba(129, 140, 248, 0.5)' }} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#A5B4FC', letterSpacing: '0.12em' }}>GAME FACTORS</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: '12px' }}>
            {/* Tempo */}
            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '8px' }}>TEMPO</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: tempo.off > tempo.def ? '#10B981' : '#F59E0B', fontFamily: 'ui-monospace, monospace' }}>
                {((tempo.off + tempo.def) / 2).toFixed(0)}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                {tempo.off > 70 ? 'FAST' : tempo.off > 65 ? 'MODERATE' : 'SLOW'}
              </div>
            </div>

            {/* Rebounding */}
            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '8px' }}>BOARDS</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: oreb.off > oreb.def ? '#10B981' : '#EF4444', fontFamily: 'ui-monospace, monospace' }}>
                {oreb.off > oreb.def ? '+' : ''}{(oreb.off - oreb.def).toFixed(1)}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>EDGE</div>
            </div>

            {/* FT Rate */}
            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '8px' }}>FT RATE</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: ftRate.off > 35 ? '#10B981' : '#F59E0B', fontFamily: 'ui-monospace, monospace' }}>
                {ftRate.off.toFixed(0)}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                {ftRate.off > 35 ? 'ATTACKS' : 'MODERATE'}
              </div>
            </div>

            {/* Variance */}
            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '8px' }}>VARIANCE</div>
              <div style={{ 
                fontSize: '20px', fontWeight: '900', 
                color: threePRate.off >= 45 ? '#EF4444' : threePRate.off >= 38 ? '#F59E0B' : '#10B981', 
                fontFamily: 'ui-monospace, monospace' 
              }}>
                {threePRate.off >= 45 ? '⚠️' : threePRate.off >= 38 ? '~' : '✓'}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                {threePRate.off >= 45 ? 'HIGH' : threePRate.off >= 38 ? 'MODERATE' : 'LOW'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* EDGE SUMMARY */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 28px 28px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)',
          borderRadius: '20px', padding: '24px',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '0', right: '0', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ 
              fontSize: '10px', fontWeight: '700',
              background: 'linear-gradient(90deg, #10B981, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '0.15em'
            }}>◆ EDGE SUMMARY ◆</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {[
              { key: 'PWR', win: edges.power },
              { key: 'SHOOT', win: edges.shooting },
              { key: 'BOARD', win: edges.boards },
              { key: 'TEMPO', win: edges.tempo },
              { key: 'FT', win: edges.ft },
              { key: 'TO', win: turnover.off < turnover.def, risk: turnover.def > turnover.off + 2 },
              { key: 'VAR', win: threePRate.off < 45, risk: threePRate.off >= 45 }
            ].map(edge => (
              <div key={edge.key} style={{
                width: '52px', padding: '10px 6px', borderRadius: '10px', textAlign: 'center',
                background: edge.risk ? 'rgba(239, 68, 68, 0.15)' : edge.win ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                border: `1px solid ${edge.risk ? 'rgba(239, 68, 68, 0.3)' : edge.win ? 'rgba(16, 185, 129, 0.3)' : 'rgba(100, 116, 139, 0.2)'}`
              }}>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>{edge.key}</div>
                <div style={{ fontSize: '16px' }}>{edge.risk ? '⚠️' : edge.win ? '✅' : '➖'}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ 
              fontSize: '18px', fontWeight: '900',
              color: edgeCount >= 4 ? '#10B981' : edgeCount >= 2 ? '#F59E0B' : '#EF4444',
              textShadow: edgeCount >= 4 ? '0 0 20px rgba(16, 185, 129, 0.5)' : 'none'
            }}>
              🏆 {offTeamName.toUpperCase()} {edgeCount >= 4 ? 'STRONGLY FAVORED' : edgeCount >= 2 ? 'SLIGHT EDGE' : 'FACES CHALLENGES'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '8px', letterSpacing: '0.03em' }}>
              {edgeCount} Edges • {riskFactors} Risks • {edgeCount >= 4 ? 'High' : edgeCount >= 2 ? 'Moderate' : 'Low'} Confidence
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ 
        padding: '16px 28px', 
        borderTop: '1px solid rgba(99, 102, 241, 0.08)',
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
      }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #A855F7)', boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' }} />
        <span style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>SAVANT ANALYTICS ENGINE</span>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
