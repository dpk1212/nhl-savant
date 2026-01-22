/**
 * 🏀 MATCHUP INTELLIGENCE v9 - REFINED
 * Visual edge comparison + D1 average markers on bars
 */

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const TOTAL_TEAMS = 364;

// D1 AVERAGES - Reference points for context
const D1_AVG = {
  twoP: 50.0,
  threeP: 34.0,
  threePRate: 40.0,
  eFG: 50.0,
  oreb: 28.0,
  to: 18.0,
  ftRate: 32.0,
  tempo: 67.5
};

interface AdvancedMatchupCardProps {
  barttorvik: { away: TeamStats; home: TeamStats; matchup: MatchupAnalysis; };
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

interface MatchupAnalysis { rankAdvantage: 'away' | 'home'; rankDiff: number; }

type ViewMode = 'awayOff_homeDef' | 'homeOff_awayDef';

const getPercentile = (rank: number) => Math.round((1 - (rank - 1) / (TOTAL_TEAMS - 1)) * 100);

const getTier = (rank: number) => {
  if (rank <= 25) return { label: 'ELITE', color: '#10B981' };
  if (rank <= 50) return { label: 'EXCELLENT', color: '#06B6D4' };
  if (rank <= 100) return { label: 'STRONG', color: '#3B82F6' };
  if (rank <= 175) return { label: 'AVERAGE', color: '#F59E0B' };
  if (rank <= 275) return { label: 'BELOW AVG', color: '#F97316' };
  return { label: 'WEAK', color: '#EF4444' };
};

// Get color based on whether stat is good or bad
const getStatColor = (value: number, avg: number, isDefense: boolean) => {
  const diff = isDefense ? avg - value : value - avg;
  if (diff > 3) return '#10B981';
  if (diff > 0) return '#22D3EE';
  if (diff > -3) return '#F59E0B';
  return '#EF4444';
};

// Smart team name - full name if short, otherwise smart abbreviation
const getTeamDisplay = (name: string, maxLen: number = 10) => {
  if (name.length <= maxLen) return name;
  
  // Common abbreviation patterns
  const abbrevMap: Record<string, string> = {
    'North Carolina': 'UNC',
    'South Carolina': 'S. Carolina',
    'Massachusetts': 'UMass',
    'Connecticut': 'UConn',
    'Mississippi': 'Ole Miss',
    'Louisiana': 'LA',
    'California': 'Cal',
    'Washington': 'Wash',
    'Virginia': 'Virginia',
    'Michigan': 'Michigan',
    'State': 'St.',
    'University': 'U',
  };
  
  for (const [full, abbr] of Object.entries(abbrevMap)) {
    if (name.includes(full)) {
      name = name.replace(full, abbr);
    }
  }
  
  // If still too long, take first word or truncate smartly
  if (name.length > maxLen) {
    const words = name.split(' ');
    if (words.length > 1) {
      // Try first word
      if (words[0].length <= maxLen) return words[0];
      // Try abbreviating to first letters
      return words.map(w => w[0]).join('').toUpperCase();
    }
    return name.slice(0, maxLen);
  }
  return name;
};

// Metric Row with D1 Average marker on bars
const MetricRow = ({
  label, offValue, defValue, avg, offTeam, defTeam, insight, isMobile, isDefenseLowerBetter = true
}: {
  label: string; offValue: number; defValue: number; avg: number;
  offTeam: string; defTeam: string; insight?: string; isMobile: boolean;
  isDefenseLowerBetter?: boolean;
}) => {
  const offColor = getStatColor(offValue, avg, false);
  const defColor = getStatColor(defValue, avg, isDefenseLowerBetter);
  const offDiff = offValue - avg;
  const defDiff = defValue - avg;
  
  // Calculate bar widths and D1 marker position (scale: 0-70% range mapped to bar width)
  const minVal = Math.min(offValue, defValue, avg) - 5;
  const maxVal = Math.max(offValue, defValue, avg) + 5;
  const range = maxVal - minVal;
  const offBarWidth = ((offValue - minVal) / range) * 100;
  const defBarWidth = ((defValue - minVal) / range) * 100;
  const avgMarkerPos = ((avg - minVal) / range) * 100;
  
  const offTeamDisplay = getTeamDisplay(offTeam, isMobile ? 8 : 12);
  const defTeamDisplay = getTeamDisplay(defTeam, isMobile ? 8 : 12);
  
  return (
    <div style={{ 
      padding: isMobile ? '12px' : '16px',
      background: 'rgba(15, 23, 42, 0.3)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.03)'
    }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: isMobile ? '10px' : '12px'
      }}>
        <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>D1 AVG: {avg}%</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: isMobile ? '8px' : '12px', alignItems: 'center' }}>
        {/* Offense */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.5)' }}>{offTeamDisplay}</span>
            <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: offColor, fontFamily: 'ui-monospace, monospace' }}>
              {offValue.toFixed(1)}%
            </span>
          </div>
          {/* Bar with D1 marker */}
          <div style={{ position: 'relative', height: '6px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '3px', overflow: 'visible' }}>
            <div style={{ 
              width: `${Math.min(offBarWidth, 100)}%`, 
              height: '100%', 
              background: `linear-gradient(90deg, ${offColor}60, ${offColor})`, 
              borderRadius: '3px', 
              transition: 'width 0.6s ease' 
            }} />
            {/* D1 Average marker */}
            <div style={{
              position: 'absolute',
              left: `${avgMarkerPos}%`,
              top: '-2px',
              width: '2px',
              height: '10px',
              background: 'white',
              borderRadius: '1px',
              opacity: 0.6
            }} />
          </div>
          <div style={{ fontSize: '8px', color: offColor, marginTop: '4px', fontWeight: '600' }}>
            {offDiff >= 0 ? '+' : ''}{offDiff.toFixed(1)} vs avg
          </div>
        </div>
        
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', fontWeight: '600' }}>→</div>
        
        {/* Defense */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.5)' }}>{defTeamDisplay}</span>
            <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: defColor, fontFamily: 'ui-monospace, monospace' }}>
              {defValue.toFixed(1)}%
            </span>
          </div>
          {/* Bar with D1 marker */}
          <div style={{ position: 'relative', height: '6px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '3px', overflow: 'visible' }}>
            <div style={{ 
              width: `${Math.min(defBarWidth, 100)}%`, 
              height: '100%', 
              background: `linear-gradient(90deg, ${defColor}60, ${defColor})`, 
              borderRadius: '3px', 
              transition: 'width 0.6s ease' 
            }} />
            {/* D1 Average marker */}
            <div style={{
              position: 'absolute',
              left: `${avgMarkerPos}%`,
              top: '-2px',
              width: '2px',
              height: '10px',
              background: 'white',
              borderRadius: '1px',
              opacity: 0.6
            }} />
          </div>
          <div style={{ fontSize: '8px', marginTop: '4px' }}>
            <span style={{ color: defColor, fontWeight: '600' }}>{defDiff >= 0 ? '+' : ''}{defDiff.toFixed(1)} vs avg</span>
            {isDefenseLowerBetter && (
              <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>
                {defDiff < 0 ? '✓' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {insight && (
        <div style={{ 
          marginTop: '10px', 
          padding: isMobile ? '8px 10px' : '10px 12px',
          background: 'rgba(16, 185, 129, 0.08)',
          borderRadius: '8px',
          borderLeft: '3px solid #10B981',
          fontSize: isMobile ? '10px' : '11px',
          color: 'rgba(255,255,255,0.7)'
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

  // All stats
  const twoP = { off: offTeam.twoP_off || 50, def: defTeam.twoP_def || 50 };
  const threeP = { off: offTeam.threeP_off || 34, def: defTeam.threeP_def || 34 };
  const threePRate = { off: offTeam.threeP_rate_off || 40, def: defTeam.threeP_rate_def || 40 };
  const eFG = { off: offTeam.eFG_off || 50, def: defTeam.eFG_def || 50 };
  const oreb = { off: offTeam.oreb_off || 28, def: defTeam.oreb_def || 28 };
  const to = { off: offTeam.to_off || 18, def: defTeam.to_def || 18 };
  const ftRate = { off: offTeam.ftRate_off || 32, def: defTeam.ftRate_def || 32 };
  const tempo = { off: offTeam.adjTempo || 67, def: defTeam.adjTempo || 67 };

  // Calculate edge categories
  const powerEdge = awayRank < homeRank ? 'away' : awayRank > homeRank ? 'home' : 'even';
  const offenseEdge = away.adjOff_rank < home.adjOff_rank ? 'away' : away.adjOff_rank > home.adjOff_rank ? 'home' : 'even';
  const defenseEdge = away.adjDef_rank < home.adjDef_rank ? 'away' : away.adjDef_rank > home.adjDef_rank ? 'home' : 'even';
  const shootingEdge = eFG.off > eFG.def ? 'off' : 'def';

  // Power balance for visual bar (0-100, 50 = even)
  const totalRanks = awayRank + homeRank;
  const awayPowerPct = Math.round(((totalRanks - awayRank) / totalRanks) * 100);

  const padding = isMobile ? '16px' : '24px';

  return (
    <div style={{
      background: 'linear-gradient(180deg, #020617 0%, #0F172A 100%)',
      borderRadius: isMobile ? '16px' : '20px',
      border: '1px solid rgba(99, 102, 241, 0.12)',
      overflow: 'hidden'
    }}>
      
      {/* ═══════════════════ HEADER ═══════════════════ */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.06) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(99, 102, 241, 0.06) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        padding: isMobile ? '14px 16px' : '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(167, 139, 250, 0.7)', letterSpacing: '0.2em' }}>ADVANCED ANALYTICS</div>
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
          <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#E0E7FF' }}>FLIP</span>
        </button>
      </div>

      {/* ═══════════════════ VISUAL POWER COMPARISON ═══════════════════ */}
      <div style={{ padding }}>
        
        {/* IDEA 1: Power Balance Bar */}
        <div style={{
          padding: isMobile ? '14px' : '18px',
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: isMobile ? '12px' : '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: 'white' }}>{awayTeam}</span>
              <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '800', color: awayTier.color, fontFamily: 'ui-monospace, monospace' }}>#{awayRank}</span>
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>POWER</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '800', color: homeTier.color, fontFamily: 'ui-monospace, monospace' }}>#{homeRank}</span>
              <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: 'white' }}>{homeTeam}</span>
            </div>
          </div>
          
          {/* Visual balance bar */}
          <div style={{ position: 'relative', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: `${awayPowerPct}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${awayTier.color}40, ${awayTier.color})`,
              transition: 'width 0.6s ease'
            }} />
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: `${100 - awayPowerPct}%`,
              height: '100%',
              background: `linear-gradient(270deg, ${homeTier.color}40, ${homeTier.color})`,
              transition: 'width 0.6s ease'
            }} />
            {/* Center marker */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '-2px',
              width: '2px',
              height: '12px',
              background: 'white',
              opacity: 0.4,
              transform: 'translateX(-50%)'
            }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                padding: '2px 6px', 
                borderRadius: '4px', 
                background: `${awayTier.color}20`, 
                fontSize: '8px', 
                fontWeight: '700', 
                color: awayTier.color 
              }}>{awayTier.label}</div>
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>Top {getPercentile(awayRank)}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>Top {getPercentile(homeRank)}%</span>
              <div style={{ 
                padding: '2px 6px', 
                borderRadius: '4px', 
                background: `${homeTier.color}20`, 
                fontSize: '8px', 
                fontWeight: '700', 
                color: homeTier.color 
              }}>{homeTier.label}</div>
            </div>
          </div>
        </div>

        {/* IDEA 2: Quick Edge Badges */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: isMobile ? '6px' : '10px', 
          flexWrap: 'wrap',
          marginBottom: isMobile ? '8px' : '12px'
        }}>
          {[
            { label: 'POWER', winner: powerEdge === 'away' ? awayTeam : homeTeam, icon: '⚡', edge: powerEdge },
            { label: 'OFFENSE', winner: offenseEdge === 'away' ? awayTeam : homeTeam, icon: '🎯', edge: offenseEdge },
            { label: 'DEFENSE', winner: defenseEdge === 'away' ? awayTeam : homeTeam, icon: '🛡️', edge: defenseEdge },
          ].map(({ label, winner, icon, edge }) => (
            <div key={label} style={{
              padding: isMobile ? '6px 10px' : '8px 14px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '12px' }}>{icon}</span>
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>{label}</span>
              <span style={{ 
                fontSize: isMobile ? '9px' : '10px', 
                fontWeight: '700', 
                color: edge === 'even' ? '#F59E0B' : '#10B981'
              }}>{edge === 'even' ? 'EVEN' : getTeamDisplay(winner, 8)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════ OFF/DEF RANKS ═══════════════════ */}
      <div style={{ padding: `0 ${padding}`, marginBottom: padding }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '8px' : '12px' }}>
          {/* Away */}
          <div style={{ 
            padding: isMobile ? '12px' : '16px',
            background: 'rgba(15, 23, 42, 0.3)',
            borderRadius: '12px',
            border: `1px solid ${awayTier.color}15`
          }}>
            <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{awayTeam}</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>OFFENSE</div>
                <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: '#34D399', fontFamily: 'ui-monospace, monospace' }}>#{away.adjOff_rank}</div>
              </div>
              <div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>DEFENSE</div>
                <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: '#F87171', fontFamily: 'ui-monospace, monospace' }}>#{away.adjDef_rank}</div>
              </div>
            </div>
          </div>
          {/* Home */}
          <div style={{ 
            padding: isMobile ? '12px' : '16px',
            background: 'rgba(15, 23, 42, 0.3)',
            borderRadius: '12px',
            border: `1px solid ${homeTier.color}15`
          }}>
            <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>{homeTeam}</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>OFFENSE</div>
                <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: '#34D399', fontFamily: 'ui-monospace, monospace' }}>#{home.adjOff_rank}</div>
              </div>
              <div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>DEFENSE</div>
                <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: '#F87171', fontFamily: 'ui-monospace, monospace' }}>#{home.adjDef_rank}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ MATCHUP BREAKDOWN ═══════════════════ */}
      <div style={{ padding: `0 ${padding} ${padding}` }}>
        <div style={{
          padding: isMobile ? '14px' : '20px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(99, 102, 241, 0.03) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.12)'
        }}>
          {/* Section Header */}
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: isMobile ? '14px' : '18px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div>
              <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#A78BFA', letterSpacing: '0.08em' }}>
                ⚡ {offTeamName.toUpperCase()} OFFENSE
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                #{offRank} overall
              </div>
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>vs</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#F87171', letterSpacing: '0.08em' }}>
                {defTeamName.toUpperCase()} DEFENSE 🛡️
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                #{defRank} overall
              </div>
            </div>
          </div>

          {/* Mismatch Score */}
          <div style={{ 
            textAlign: 'center', 
            padding: isMobile ? '12px' : '16px',
            background: mismatch > 50 ? 'rgba(16, 185, 129, 0.1)' : mismatch > 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            marginBottom: isMobile ? '14px' : '18px'
          }}>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '4px' }}>MISMATCH INDEX</div>
            <div style={{ 
              fontSize: isMobile ? '24px' : '28px', fontWeight: '800',
              color: mismatch > 50 ? '#10B981' : mismatch > 0 ? '#3B82F6' : '#EF4444',
              fontFamily: 'ui-monospace, monospace'
            }}>{mismatch > 0 ? '+' : ''}{mismatch}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
              {mismatch > 100 ? 'MASSIVE ADVANTAGE' : mismatch > 50 ? 'STRONG EDGE' : mismatch > 0 ? 'SLIGHT EDGE' : mismatch > -50 ? 'EVEN MATCHUP' : 'TOUGH MATCHUP'}
            </div>
          </div>

          {/* ALL METRICS with D1 markers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px' }}>
            
            <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginTop: '4px' }}>SHOOTING</div>
            
            <MetricRow label="2-POINT %" offValue={twoP.off} defValue={twoP.def} avg={D1_AVG.twoP}
              offTeam={`${offTeamName} shoots`} defTeam={`${defTeamName} allows`}
              insight={twoP.off > 54 && twoP.def > 52 ? `🔥 Elite paint scorers vs weak interior D` : undefined}
              isMobile={isMobile} />
            
            <MetricRow label="3-POINT %" offValue={threeP.off} defValue={threeP.def} avg={D1_AVG.threeP}
              offTeam={`${offTeamName} shoots`} defTeam={`${defTeamName} allows`}
              insight={threeP.off > 36 && threeP.def > 36 ? `🏹 Good shooters face poor perimeter D` : undefined}
              isMobile={isMobile} />
            
            <MetricRow label="3PT RATE" offValue={threePRate.off} defValue={threePRate.def} avg={D1_AVG.threePRate}
              offTeam={`${offTeamName} takes`} defTeam={`${defTeamName} allows`}
              insight={threePRate.off > 48 ? `⚠️ High 3PT volume = variance risk` : undefined}
              isMobile={isMobile} isDefenseLowerBetter={false} />
            
            <MetricRow label="eFG% (EFFICIENCY)" offValue={eFG.off} defValue={eFG.def} avg={D1_AVG.eFG}
              offTeam={`${offTeamName} shoots`} defTeam={`${defTeamName} allows`}
              isMobile={isMobile} />

            <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginTop: '8px' }}>BALL CONTROL</div>
            
            <MetricRow label="TURNOVER RATE" offValue={to.off} defValue={to.def} avg={D1_AVG.to}
              offTeam={`${offTeamName} commits`} defTeam={`${defTeamName} forces`}
              insight={to.def > to.off + 3 ? `⚠️ Watch for turnovers` : to.off < 15 ? `✓ Takes care of the ball` : undefined}
              isMobile={isMobile} isDefenseLowerBetter={false} />

            <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginTop: '8px' }}>REBOUNDING</div>
            
            <MetricRow label="OFFENSIVE REBOUND %" offValue={oreb.off} defValue={oreb.def} avg={D1_AVG.oreb}
              offTeam={`${offTeamName} grabs`} defTeam={`${defTeamName} allows`}
              insight={oreb.off > 30 && oreb.def > 29 ? `♻️ Second chance points likely` : undefined}
              isMobile={isMobile} />

            <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginTop: '8px' }}>FREE THROWS & PACE</div>
            
            <MetricRow label="FREE THROW RATE" offValue={ftRate.off} defValue={ftRate.def || 32} avg={D1_AVG.ftRate}
              offTeam={`${offTeamName} draws`} defTeam={`${defTeamName} sends`}
              insight={ftRate.off > 38 ? `🎟️ Attacks & gets to the line` : undefined}
              isMobile={isMobile} isDefenseLowerBetter={false} />

            {/* Tempo */}
            <div style={{ 
              padding: isMobile ? '12px' : '16px',
              background: 'rgba(15, 23, 42, 0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>TEMPO</span>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>D1 AVG: {D1_AVG.tempo}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{getTeamDisplay(offTeamName, 10)}</div>
                  <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: tempo.off > 70 ? '#10B981' : tempo.off > 65 ? '#F59E0B' : '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>{tempo.off.toFixed(1)}</div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{tempo.off > 70 ? 'FAST' : tempo.off > 65 ? 'MODERATE' : 'SLOW'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{getTeamDisplay(defTeamName, 10)}</div>
                  <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: tempo.def > 70 ? '#10B981' : tempo.def > 65 ? '#F59E0B' : '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>{tempo.def.toFixed(1)}</div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{tempo.def > 70 ? 'FAST' : tempo.def > 65 ? 'MODERATE' : 'SLOW'}</div>
                </div>
                <div style={{ background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', padding: '8px' }}>
                  <div style={{ fontSize: '9px', color: '#FBBF24', marginBottom: '4px' }}>EXPECTED</div>
                  <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: '#FBBF24', fontFamily: 'ui-monospace, monospace' }}>{((tempo.off + tempo.def) / 2).toFixed(0)}</div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>GAME PACE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <div style={{ 
        padding: isMobile ? '10px 16px' : '12px 24px',
        borderTop: '1px solid rgba(99, 102, 241, 0.06)',
        background: 'rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
      }}>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6366F1' }} />
        <span style={{ fontSize: '7px', fontWeight: '600', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>SAVANT ANALYTICS</span>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
