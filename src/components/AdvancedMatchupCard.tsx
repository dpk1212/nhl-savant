/**
 * 🏀 MATCHUP INTELLIGENCE v10 - MOBILE OPTIMIZED
 * Better abbreviations + FLIP moved to matchup section
 */

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const TOTAL_TEAMS = 364;

// D1 AVERAGES
const D1_AVG = {
  twoP: 50.0, threeP: 34.0, threePRate: 40.0, eFG: 50.0,
  oreb: 28.0, to: 18.0, ftRate: 32.0, tempo: 67.5
};

interface AdvancedMatchupCardProps {
  barttorvik: { away: TeamStats; home: TeamStats; matchup: MatchupAnalysis; };
  awayTeam: string;
  homeTeam: string;
}

interface TeamStats {
  rank: number; adjOff: number; adjOff_rank: number; adjDef: number; adjDef_rank: number;
  eFG_off: number; eFG_def: number; to_off: number; to_def: number;
  oreb_off: number; oreb_def: number; twoP_off: number; twoP_def?: number;
  threeP_off: number; threeP_def?: number; bartholomew?: number; bartholomew_rank?: number;
  adjTempo?: number; ftRate_off?: number; ftRate_def?: number;
  threeP_rate_off?: number; threeP_rate_def?: number;
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

const getStatColor = (value: number, avg: number, isDefense: boolean) => {
  const diff = isDefense ? avg - value : value - avg;
  if (diff > 3) return '#10B981';
  if (diff > 0) return '#22D3EE';
  if (diff > -3) return '#F59E0B';
  return '#EF4444';
};

// IMPROVED: Smart team abbreviation for mobile
const getTeamAbbrev = (name: string, maxLen: number = 12): string => {
  // Already short enough
  if (name.length <= maxLen) return name;
  
  // Known abbreviations (prioritize these)
  const knownAbbrevs: Record<string, string> = {
    'North Carolina': 'UNC',
    'NC-Wilmington': 'UNCW',
    'UNC Wilmington': 'UNCW',
    'South Carolina': 'S Carolina',
    'Massachusetts': 'UMass',
    'Connecticut': 'UConn',
    'Mississippi State': 'Miss St',
    'Mississippi': 'Ole Miss',
    'Michigan State': 'Mich St',
    'Ohio State': 'Ohio St',
    'Penn State': 'Penn St',
    'Florida State': 'FSU',
    'Arizona State': 'ASU',
    'Oregon State': 'Oregon St',
    'Washington State': 'Wash St',
    'San Diego State': 'SDSU',
    'Fresno State': 'Fresno St',
    'Boise State': 'Boise St',
    'Colorado State': 'Colorado St',
    'Utah State': 'Utah St',
    'Iowa State': 'Iowa St',
    'Kansas State': 'K-State',
    'Oklahoma State': 'Okla St',
    'Texas Tech': 'Texas Tech',
    'Texas A&M': 'Texas A&M',
    'William & Mary': 'W&M',
    'William and Mary': 'W&M',
    'Boston College': 'BC',
    'Virginia Tech': 'Va Tech',
    'Georgia Tech': 'Ga Tech',
    'Wake Forest': 'Wake',
    'Notre Dame': 'ND',
    'Saint Louis': 'SLU',
    "Saint Mary's": "St Mary's",
    'San Francisco': 'USF',
    'Southern California': 'USC',
    'Central Florida': 'UCF',
    'South Florida': 'USF',
    'Northern Iowa': 'UNI',
    'Southern Illinois': 'SIU',
    'Northern Illinois': 'NIU',
    'Western Kentucky': 'WKU',
    'Eastern Kentucky': 'EKU',
    'Middle Tennessee': 'MTSU',
    'Louisiana Tech': 'LA Tech',
    'Louisiana-Lafayette': 'UL Lafayette',
    'Louisiana-Monroe': 'UL Monroe',
    'Bowling Green': 'BGSU',
    'Ball State': 'Ball St',
    'Kent State': 'Kent St',
    'Wright State': 'Wright St',
    'Cleveland State': 'Cleveland St',
    'Youngstown State': 'Youngstown',
    'Milwaukee': 'Milwaukee',
    'Green Bay': 'Green Bay',
  };
  
  // Check for known abbreviations
  for (const [full, abbr] of Object.entries(knownAbbrevs)) {
    if (name.toLowerCase().includes(full.toLowerCase())) {
      if (abbr.length <= maxLen) return abbr;
    }
  }
  
  // Handle "State" suffix
  if (name.includes(' State') && name.length > maxLen) {
    const shortened = name.replace(' State', ' St');
    if (shortened.length <= maxLen) return shortened;
  }
  
  // Handle directional schools (North/South/East/West)
  const directionalMap: Record<string, string> = {
    'North ': 'N ',
    'South ': 'S ',
    'East ': 'E ',
    'West ': 'W ',
    'Northern ': 'N ',
    'Southern ': 'S ',
    'Eastern ': 'E ',
    'Western ': 'W ',
    'Central ': 'C ',
  };
  
  let shortened = name;
  for (const [full, abbr] of Object.entries(directionalMap)) {
    if (shortened.startsWith(full)) {
      shortened = abbr + shortened.slice(full.length);
      break;
    }
  }
  if (shortened.length <= maxLen) return shortened;
  
  // Take first word if it's reasonable
  const words = name.split(' ');
  if (words[0].length >= 4 && words[0].length <= maxLen) {
    return words[0];
  }
  
  // Last resort: truncate with ...
  return name.slice(0, maxLen - 2) + '..';
};

// Metric Row Component
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
  
  const minVal = Math.min(offValue, defValue, avg) - 5;
  const maxVal = Math.max(offValue, defValue, avg) + 5;
  const range = maxVal - minVal;
  const offBarWidth = ((offValue - minVal) / range) * 100;
  const defBarWidth = ((defValue - minVal) / range) * 100;
  const avgMarkerPos = ((avg - minVal) / range) * 100;
  
  return (
    <div style={{ 
      padding: isMobile ? '12px' : '16px',
      background: 'rgba(15, 23, 42, 0.3)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.03)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '10px' : '12px' }}>
        <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>D1 AVG: {avg}%</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: isMobile ? '8px' : '12px', alignItems: 'center' }}>
        {/* Offense */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.5)' }}>{offTeam}</span>
            <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: offColor, fontFamily: 'ui-monospace, monospace' }}>
              {offValue.toFixed(1)}%
            </span>
          </div>
          <div style={{ position: 'relative', height: '6px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '3px', overflow: 'visible' }}>
            <div style={{ width: `${Math.min(offBarWidth, 100)}%`, height: '100%', background: `linear-gradient(90deg, ${offColor}60, ${offColor})`, borderRadius: '3px', transition: 'width 0.6s ease' }} />
            <div style={{ position: 'absolute', left: `${avgMarkerPos}%`, top: '-2px', width: '2px', height: '10px', background: 'white', borderRadius: '1px', opacity: 0.6 }} />
          </div>
          <div style={{ fontSize: '8px', color: offColor, marginTop: '4px', fontWeight: '600' }}>
            {offDiff >= 0 ? '+' : ''}{offDiff.toFixed(1)} vs avg
          </div>
        </div>
        
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', fontWeight: '600' }}>→</div>
        
        {/* Defense */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.5)' }}>{defTeam}</span>
            <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: defColor, fontFamily: 'ui-monospace, monospace' }}>
              {defValue.toFixed(1)}%
            </span>
          </div>
          <div style={{ position: 'relative', height: '6px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '3px', overflow: 'visible' }}>
            <div style={{ width: `${Math.min(defBarWidth, 100)}%`, height: '100%', background: `linear-gradient(90deg, ${defColor}60, ${defColor})`, borderRadius: '3px', transition: 'width 0.6s ease' }} />
            <div style={{ position: 'absolute', left: `${avgMarkerPos}%`, top: '-2px', width: '2px', height: '10px', background: 'white', borderRadius: '1px', opacity: 0.6 }} />
          </div>
          <div style={{ fontSize: '8px', marginTop: '4px' }}>
            <span style={{ color: defColor, fontWeight: '600' }}>{defDiff >= 0 ? '+' : ''}{defDiff.toFixed(1)} vs avg</span>
            {isDefenseLowerBetter && defDiff < 0 && <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>✓</span>}
          </div>
        </div>
      </div>
      
      {insight && (
        <div style={{ marginTop: '10px', padding: isMobile ? '8px 10px' : '10px 12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', borderLeft: '3px solid #10B981', fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.7)' }}>{insight}</div>
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

  // Edge calculations
  const powerEdge = awayRank < homeRank ? 'away' : awayRank > homeRank ? 'home' : 'even';
  const offenseEdge = away.adjOff_rank < home.adjOff_rank ? 'away' : away.adjOff_rank > home.adjOff_rank ? 'home' : 'even';
  const defenseEdge = away.adjDef_rank < home.adjDef_rank ? 'away' : away.adjDef_rank > home.adjDef_rank ? 'home' : 'even';

  const totalRanks = awayRank + homeRank;
  const awayPowerPct = Math.round(((totalRanks - awayRank) / totalRanks) * 100);

  // Abbreviated names for display
  const awayAbbrev = getTeamAbbrev(awayTeam, isMobile ? 10 : 14);
  const homeAbbrev = getTeamAbbrev(homeTeam, isMobile ? 10 : 14);
  const offAbbrev = getTeamAbbrev(offTeamName, isMobile ? 10 : 14);
  const defAbbrev = getTeamAbbrev(defTeamName, isMobile ? 10 : 14);

  const padding = isMobile ? '16px' : '24px';

  return (
    <div style={{
      background: 'linear-gradient(180deg, #020617 0%, #0F172A 100%)',
      borderRadius: isMobile ? '16px' : '20px',
      border: '1px solid rgba(99, 102, 241, 0.12)',
      overflow: 'hidden'
    }}>
      
      {/* ═══════════════════ HEADER (no flip button here) ═══════════════════ */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.06) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(99, 102, 241, 0.06) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        padding: isMobile ? '14px 16px' : '18px 24px'
      }}>
        <div style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(167, 139, 250, 0.7)', letterSpacing: '0.2em' }}>ADVANCED ANALYTICS</div>
        <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: 'white' }}>Matchup Intelligence</div>
      </div>

{/* ═══════════════════ VISUAL TEAM COMPARISON ═══════════════════ */}
      <div style={{ padding }}>
        {/* 3 Category Cards - Like OUR MODEL / MARKET / GRADE */}
        <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: isMobile ? '8px' : '12px',
          marginBottom: isMobile ? '12px' : '16px'
        }}>
          {[
            { label: 'OVERALL', icon: '⚡', awayRank: awayRank, homeRank: homeRank },
            { label: 'OFFENSE', icon: '🎯', awayRank: away.adjOff_rank, homeRank: home.adjOff_rank },
            { label: 'DEFENSE', icon: '🛡️', awayRank: away.adjDef_rank, homeRank: home.adjDef_rank }
          ].map(({ label, icon, awayRank: aRank, homeRank: hRank }) => {
            const gap = hRank - aRank;
            const awayBetter = aRank < hRank;
            const isKeyEdge = Math.abs(gap) > 50;
            const winnerName = awayBetter ? awayAbbrev : homeAbbrev;
            const winnerRank = awayBetter ? aRank : hRank;
            const loserRank = awayBetter ? hRank : aRank;
            const winnerColor = getTier(winnerRank).color;
            
            // Visual strength (0-100 scale, higher = bigger edge)
            const edgeStrength = Math.min(Math.abs(gap) / 2, 100);
            
            return (
              <div key={label} style={{
                padding: isMobile ? '12px 10px' : '16px 14px',
                background: isKeyEdge 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)'
                  : 'rgba(15, 23, 42, 0.5)',
                borderRadius: '12px',
                border: isKeyEdge ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
                position: 'relative'
              }}>
                {/* Key Edge Badge */}
                {isKeyEdge && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#10B981',
                    color: 'white',
                    fontSize: '7px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    letterSpacing: '0.05em'
                  }}>KEY</div>
                )}
                
                {/* Category Label */}
                <div style={{ 
                  fontSize: isMobile ? '8px' : '9px', 
                  color: 'rgba(255,255,255,0.5)', 
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
                
                {/* Winner Name */}
                <div style={{ 
                  fontSize: isMobile ? '11px' : '12px', 
                  fontWeight: '700', 
                  color: 'white',
                  marginBottom: '4px'
                }}>{winnerName}</div>
                
                {/* Visual Strength Bar */}
                <div style={{ 
                  height: '6px', 
                  background: 'rgba(0,0,0,0.3)', 
                  borderRadius: '3px', 
                  overflow: 'hidden',
                  margin: '8px 0'
                }}>
                  <div style={{
                    width: `${edgeStrength}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${winnerColor}60, ${winnerColor})`,
                    borderRadius: '3px',
                    transition: 'width 0.6s ease'
                  }} />
      </div>

                {/* Gap Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  background: Math.abs(gap) > 50 ? 'rgba(16, 185, 129, 0.2)' : Math.abs(gap) > 20 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.1)',
                  borderRadius: '6px'
                }}>
                  <span style={{ 
                    fontSize: isMobile ? '10px' : '11px', 
                    fontWeight: '800', 
                    color: Math.abs(gap) > 50 ? '#10B981' : Math.abs(gap) > 20 ? '#3B82F6' : 'rgba(255,255,255,0.6)',
                    fontFamily: 'ui-monospace, monospace'
                  }}>+{Math.abs(gap)}</span>
                </div>

                {/* Rank Comparison */}
                <div style={{ 
                  marginTop: '8px',
                  fontSize: isMobile ? '9px' : '10px',
                  color: 'rgba(255,255,255,0.4)'
                }}>
                  <span style={{ color: winnerColor, fontWeight: '600' }}>#{winnerRank}</span>
                  <span style={{ margin: '0 4px' }}>vs</span>
                  <span>#{loserRank}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Team Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '16px' : '24px',
          padding: isMobile ? '10px' : '12px',
          background: 'rgba(15, 23, 42, 0.3)',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getTier(awayRank).color }} />
            <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>{awayAbbrev}</span>
            <span style={{ fontSize: isMobile ? '10px' : '11px', color: getTier(awayRank).color, fontWeight: '700', fontFamily: 'ui-monospace, monospace' }}>#{awayRank}</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getTier(homeRank).color }} />
            <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>{homeAbbrev}</span>
            <span style={{ fontSize: isMobile ? '10px' : '11px', color: getTier(homeRank).color, fontWeight: '700', fontFamily: 'ui-monospace, monospace' }}>#{homeRank}</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════ DIVIDER ═══════════════════ */}
      <div style={{ padding: `0 ${padding}`, margin: isMobile ? '8px 0' : '12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', fontWeight: '600' }}>MATCHUP DETAILS</div>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
        </div>
      </div>

      {/* ═══════════════════ DETAIL: MATCHUP BREAKDOWN ═══════════════════ */}
      <div style={{ padding: `0 ${padding} ${padding}` }}>
        <div style={{
          padding: isMobile ? '14px' : '20px',
          background: 'rgba(15, 23, 42, 0.25)',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.03)'
        }}>
{/* Compact Header with FLIP */}
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: isMobile ? '12px' : '16px',
            paddingBottom: '10px',
            borderBottom: '1px solid rgba(255,255,255,0.04)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>
                ⚡ {offAbbrev} <span style={{ color: 'rgba(255,255,255,0.4)' }}>#{offRank}</span>
          </div>
              <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: '#34D399', fontFamily: 'ui-monospace, monospace', marginTop: '2px' }}>
                {offTeam.adjOff?.toFixed(1) || '—'} <span style={{ fontSize: '8px', fontWeight: '500', color: 'rgba(255,255,255,0.3)' }}>pts/100</span>
              </div>
            </div>

            <button
              onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: isMobile ? '6px 10px' : '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer'
              }}
            >
              <ArrowRightLeft size={isMobile ? 10 : 12} color="rgba(255,255,255,0.5)" />
              <span style={{ fontSize: isMobile ? '8px' : '9px', fontWeight: '600', color: 'rgba(255,255,255,0.5)' }}>FLIP</span>
            </button>
            
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>#{defRank}</span> {defAbbrev} 🛡️
              </div>
              <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: '#F87171', fontFamily: 'ui-monospace, monospace', marginTop: '2px' }}>
                {defTeam.adjDef?.toFixed(1) || '—'} <span style={{ fontSize: '8px', fontWeight: '500', color: 'rgba(255,255,255,0.3)' }}>pts/100</span>
                </div>
              </div>
            </div>

          {/* Mismatch Score - Compact */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '8px' : '12px',
            padding: isMobile ? '10px' : '12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            marginBottom: isMobile ? '12px' : '16px'
          }}>
            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>MISMATCH</span>
            <span style={{ 
              fontSize: isMobile ? '18px' : '20px', fontWeight: '800',
              color: mismatch > 50 ? '#10B981' : mismatch > 0 ? '#3B82F6' : '#EF4444',
              fontFamily: 'ui-monospace, monospace'
            }}>{mismatch > 0 ? '+' : ''}{mismatch}</span>
            <span style={{ 
              fontSize: '8px', 
              fontWeight: '600',
              color: mismatch > 50 ? '#10B981' : mismatch > 0 ? '#3B82F6' : '#EF4444',
              padding: '2px 6px',
              background: mismatch > 50 ? 'rgba(16, 185, 129, 0.15)' : mismatch > 0 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              borderRadius: '4px'
            }}>
              {mismatch > 100 ? 'MASSIVE' : mismatch > 50 ? 'STRONG' : mismatch > 0 ? 'EDGE' : mismatch > -50 ? 'EVEN' : 'TOUGH'}
            </span>
          </div>

          {/* ALL METRICS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px' }}>
            
            <div style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginTop: '4px' }}>SHOOTING</div>
            
            <MetricRow label="2-POINT %" offValue={twoP.off} defValue={twoP.def} avg={D1_AVG.twoP}
              offTeam="shoots" defTeam="allows"
              insight={twoP.off > 54 && twoP.def > 52 ? `🔥 Elite finishers vs weak interior D` : undefined}
              isMobile={isMobile} />
            
            <MetricRow label="3-POINT %" offValue={threeP.off} defValue={threeP.def} avg={D1_AVG.threeP}
              offTeam="shoots" defTeam="allows"
              insight={threeP.off > 36 && threeP.def > 36 ? `🏹 Good shooters vs poor perimeter D` : undefined}
              isMobile={isMobile} />
            
            <MetricRow label="3PT RATE" offValue={threePRate.off} defValue={threePRate.def} avg={D1_AVG.threePRate}
              offTeam="takes" defTeam="allows"
              insight={threePRate.off > 48 ? `⚠️ High 3PT volume = variance risk` : undefined}
              isMobile={isMobile} isDefenseLowerBetter={false} />
            
            <MetricRow label="eFG% (EFFICIENCY)" offValue={eFG.off} defValue={eFG.def} avg={D1_AVG.eFG}
              offTeam="shoots" defTeam="allows" isMobile={isMobile} />

            <div style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginTop: '8px' }}>BALL CONTROL</div>
            
            <MetricRow label="TURNOVER RATE" offValue={to.off} defValue={to.def} avg={D1_AVG.to}
              offTeam="commits" defTeam="forces"
              insight={to.def > to.off + 3 ? `⚠️ Watch for turnovers` : to.off < 15 ? `✓ Takes care of the ball` : undefined}
              isMobile={isMobile} isDefenseLowerBetter={false} />

            <div style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginTop: '8px' }}>REBOUNDING</div>
            
            <MetricRow label="OFFENSIVE REBOUND %" offValue={oreb.off} defValue={oreb.def} avg={D1_AVG.oreb}
              offTeam="grabs" defTeam="allows"
              insight={oreb.off > 30 && oreb.def > 29 ? `♻️ Second chance points likely` : undefined}
              isMobile={isMobile} />

            <div style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginTop: '8px' }}>FREE THROWS & PACE</div>
            
            <MetricRow label="FREE THROW RATE" offValue={ftRate.off} defValue={ftRate.def || 32} avg={D1_AVG.ftRate}
              offTeam="draws" defTeam="sends"
              insight={ftRate.off > 38 ? `🎟️ Attacks & gets to the line` : undefined}
              isMobile={isMobile} isDefenseLowerBetter={false} />

            {/* Tempo */}
            <div style={{ padding: isMobile ? '12px' : '16px', background: 'rgba(15, 23, 42, 0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>TEMPO</span>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>D1 AVG: {D1_AVG.tempo}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{offAbbrev}</div>
                  <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: tempo.off > 70 ? '#10B981' : tempo.off > 65 ? '#F59E0B' : '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>{tempo.off.toFixed(1)}</div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{tempo.off > 70 ? 'FAST' : tempo.off > 65 ? 'AVG' : 'SLOW'}</div>
            </div>
                <div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{defAbbrev}</div>
                  <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: tempo.def > 70 ? '#10B981' : tempo.def > 65 ? '#F59E0B' : '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>{tempo.def.toFixed(1)}</div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{tempo.def > 70 ? 'FAST' : tempo.def > 65 ? 'AVG' : 'SLOW'}</div>
                </div>
                <div style={{ background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', padding: '8px' }}>
                  <div style={{ fontSize: '8px', color: '#FBBF24', marginBottom: '4px' }}>EXPECTED</div>
                  <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: '#FBBF24', fontFamily: 'ui-monospace, monospace' }}>{((tempo.off + tempo.def) / 2).toFixed(0)}</div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>PACE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <div style={{ padding: isMobile ? '10px 16px' : '12px 24px', borderTop: '1px solid rgba(99, 102, 241, 0.06)', background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6366F1' }} />
        <span style={{ fontSize: '7px', fontWeight: '600', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>SAVANT ANALYTICS</span>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
