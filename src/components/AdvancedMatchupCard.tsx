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

{/* ═══════════════════ PREMIUM COMPARISON BARS ═══════════════════ */}
      <div style={{ padding }}>
        <div style={{
          padding: isMobile ? '16px' : '24px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.04)'
        }}>
          {/* Comparison Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px' }}>
            {[
              { label: 'OVERALL', awayRank: awayRank, homeRank: homeRank },
              { label: 'OFFENSE', awayRank: away.adjOff_rank, homeRank: home.adjOff_rank },
              { label: 'DEFENSE', awayRank: away.adjDef_rank, homeRank: home.adjDef_rank }
            ].map(({ label, awayRank: aRank, homeRank: hRank }, idx) => {
              const awayBetter = aRank < hRank;
              const gap = Math.abs(hRank - aRank);
              
              // Calculate bar fill (toward winner)
              const total = aRank + hRank;
              const awayPct = ((total - aRank) / total) * 100;
              
              const awayColor = getTier(aRank).color;
              const homeColor = getTier(hRank).color;
              
              return (
                <div key={label}>
                  {/* Row Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: isMobile ? '10px' : '12px'
                  }}>
                    {/* Away Team */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
                      <span style={{ 
                        fontSize: isMobile ? '13px' : '15px', 
                        fontWeight: '700', 
                        color: awayColor,
                        fontFamily: 'ui-monospace, monospace'
                      }}>#{aRank}</span>
                      <span style={{ 
                        fontSize: isMobile ? '11px' : '12px', 
                        fontWeight: '600', 
                        color: awayBetter ? 'white' : 'rgba(255,255,255,0.4)'
                      }}>{awayAbbrev}</span>
                      {awayBetter && (
                        <span style={{ 
                          fontSize: isMobile ? '9px' : '10px',
                          color: '#10B981',
                          fontWeight: '600'
                        }}>✓</span>
                      )}
                    </div>
                    
                    {/* Category Label */}
                    <div style={{ 
                      fontSize: isMobile ? '9px' : '10px', 
                      color: 'rgba(255,255,255,0.35)', 
                      letterSpacing: '0.12em',
                      fontWeight: '600'
                    }}>{label}</div>
                    
                    {/* Home Team */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
                      {!awayBetter && (
                        <span style={{ 
                          fontSize: isMobile ? '9px' : '10px',
                          color: '#10B981',
                          fontWeight: '600'
                        }}>✓</span>
                      )}
                      <span style={{ 
                        fontSize: isMobile ? '11px' : '12px', 
                        fontWeight: '600', 
                        color: !awayBetter ? 'white' : 'rgba(255,255,255,0.4)'
                      }}>{homeAbbrev}</span>
                      <span style={{ 
                        fontSize: isMobile ? '13px' : '15px', 
                        fontWeight: '700', 
                        color: homeColor,
                        fontFamily: 'ui-monospace, monospace'
                      }}>#{hRank}</span>
                    </div>
                  </div>
                  
                  {/* Comparison Bar */}
                  <div style={{ 
                    position: 'relative', 
                    height: isMobile ? '6px' : '8px', 
                    borderRadius: '4px', 
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.4)'
                  }}>
                    {/* Away side fill */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${awayPct}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${awayColor}30, ${awayColor})`,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                    {/* Home side fill */}
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      width: `${100 - awayPct}%`,
                      height: '100%',
                      background: `linear-gradient(270deg, ${homeColor}30, ${homeColor})`,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                    {/* Center marker */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      width: '1px',
                      height: '100%',
                      background: 'rgba(255,255,255,0.15)',
                      transform: 'translateX(-50%)'
                    }} />
                  </div>
                  
                  {/* Gap indicator */}
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: isMobile ? '8px' : '10px'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: isMobile ? '3px 10px' : '4px 12px',
                      borderRadius: '6px',
                      background: gap > 50 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.04)',
                      border: gap > 50 ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.06)',
                      fontSize: isMobile ? '10px' : '11px',
                      fontWeight: '700',
                      color: gap > 50 ? '#10B981' : 'rgba(255,255,255,0.5)',
                      fontFamily: 'ui-monospace, monospace'
                    }}>
                      {gap > 50 ? `+${gap} edge` : gap > 20 ? `+${gap}` : `+${gap} close`}
                    </span>
                  </div>
                </div>
              );
            })}
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

{/* ═══════════════════ PREMIUM MATCHUP DETAILS ═══════════════════ */}
      <div style={{ padding: `0 ${padding} ${padding}` }}>
        
        {/* Header with FLIP */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: isMobile ? '16px' : '20px',
          padding: isMobile ? '12px 14px' : '14px 18px',
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.04)'
        }}>
          <div>
            <div style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: 'white' }}>⚡ {offAbbrev}</div>
            <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '800', color: '#34D399', fontFamily: 'ui-monospace, monospace' }}>
              {offTeam.adjOff?.toFixed(1) || '—'} <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>pts/100</span>
            </div>
          </div>
          
          <button onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
            style={{ padding: isMobile ? '8px 14px' : '10px 18px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowRightLeft size={isMobile ? 12 : 14} color="#A78BFA" />
            <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: '#C7D2FE' }}>FLIP</span>
          </button>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: '700', color: 'white' }}>{defAbbrev} 🛡️</div>
            <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '800', color: '#F87171', fontFamily: 'ui-monospace, monospace' }}>
              {defTeam.adjDef?.toFixed(1) || '—'} <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>pts/100</span>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
          
          {/* SHOOTING CARD */}
          <div style={{ background: 'rgba(15, 23, 42, 0.3)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: isMobile ? '10px 14px' : '12px 18px', background: 'rgba(251, 191, 36, 0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#FBBF24', letterSpacing: '0.1em' }}>🎯 SHOOTING</span>
            </div>
            <div style={{ padding: isMobile ? '14px' : '18px', display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
              {[
                { label: '2PT%', offVal: twoP.off, defVal: twoP.def, avg: D1_AVG.twoP, type: '2pt' },
                { label: '3PT%', offVal: threeP.off, defVal: threeP.def, avg: D1_AVG.threeP, type: '3pt' },
                { label: '3PT RATE', offVal: threePRate.off, defVal: threePRate.def, avg: D1_AVG.threePRate, type: '3ptRate' },
                { label: 'eFG%', offVal: eFG.off, defVal: eFG.def, avg: D1_AVG.eFG, type: 'efg' }
              ].map(({ label, offVal, defVal, avg, type }) => {
                const offDiff = offVal - avg;
                const defDiff = defVal - avg;
                const offGood = offDiff > 0;
                const defGood = defDiff < 0; // Lower = good defense (allows less)
                const matchupEdge = offVal - defVal; // Positive = offense advantage
                
                // Generate matchup-specific insight
                const getMatchupInsight = () => {
                  if (type === '2pt') {
                    if (offGood && !defGood) return `🔥 ${offAbbrev} finishes well (${offVal.toFixed(0)}%) vs weak interior D → paint points`;
                    if (offGood && defGood) return `⚔️ Good finishers vs stingy D → execution battle inside`;
                    if (!offGood && !defGood) return `📊 Poor shooters vs leaky D → could go either way`;
                    if (!offGood && defGood) return `🛡️ Struggling offense vs tough D → expect low 2PT%`;
                  }
                  if (type === '3pt') {
                    if (offGood && !defGood) return `🏹 ${offAbbrev} shoots ${offVal.toFixed(0)}% vs poor perimeter D → 3s will fall`;
                    if (offGood && defGood) return `⚔️ Good shooters vs tight coverage → shot selection matters`;
                    if (!offGood && !defGood) return `📊 Cold shooters vs porous D → variance game`;
                    if (!offGood && defGood) return `🧱 Poor shooters vs elite D → stay out of 3PT contests`;
                  }
                  if (type === '3ptRate') {
                    if (offVal > 42 && defVal > 42) return `⚠️ Heavy 3PT game both ways → high variance expected`;
                    if (offVal > 42) return `🎯 ${offAbbrev} lives beyond the arc (${offVal.toFixed(0)}% of shots)`;
                    if (offVal < 35) return `🎨 ${offAbbrev} attacks inside — low 3PT volume (${offVal.toFixed(0)}%)`;
                    return `📊 Balanced shot selection`;
                  }
                  if (type === 'efg') {
                    if (matchupEdge > 3) return `✅ ${offAbbrev} efficient (${offVal.toFixed(0)}%) vs ${defAbbrev} allowing ${defVal.toFixed(0)}% → scoring edge`;
                    if (matchupEdge < -3) return `⚠️ ${defAbbrev} holds teams to ${defVal.toFixed(0)}% → tough to score`;
                    return `📊 Efficiency roughly even — execution decides`;
                  }
                  return '';
                };
                
                return (
                  <div key={label}>
                    <div style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{label}</span>
                      <span>D1: {avg}%</span>
                    </div>
                    {/* Offense row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.5)', width: isMobile ? '45px' : '50px' }}>{offAbbrev}</span>
                      <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '800', color: offGood ? '#10B981' : 'rgba(255,255,255,0.5)', fontFamily: 'ui-monospace, monospace', width: isMobile ? '50px' : '55px' }}>{offVal.toFixed(1)}%</span>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: `${Math.min((offVal / 60) * 100, 100)}%`, height: '100%', background: offGood ? 'linear-gradient(90deg, #10B98150, #10B981)' : 'linear-gradient(90deg, #64748B50, #64748B)', borderRadius: '2px' }} />
                        <div style={{ position: 'absolute', left: `${(avg / 60) * 100}%`, top: '-2px', width: '2px', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
                      </div>
                    </div>
                    {/* Arrow */}
                    <div style={{ textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.15)', margin: '2px 0', marginLeft: isMobile ? '45px' : '50px' }}>↓</div>
                    {/* Defense row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.5)', width: isMobile ? '45px' : '50px' }}>{defAbbrev}</span>
                      <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '800', color: defGood ? '#10B981' : '#F87171', fontFamily: 'ui-monospace, monospace', width: isMobile ? '50px' : '55px' }}>{defVal.toFixed(1)}%</span>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: `${Math.min((defVal / 60) * 100, 100)}%`, height: '100%', background: defGood ? 'linear-gradient(90deg, #10B98150, #10B981)' : 'linear-gradient(90deg, #F8717150, #F87171)', borderRadius: '2px' }} />
                        <div style={{ position: 'absolute', left: `${(avg / 60) * 100}%`, top: '-2px', width: '2px', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
                      </div>
                    </div>
                    {/* Matchup Insight */}
                    <div style={{ 
                      fontSize: isMobile ? '10px' : '11px', 
                      color: 'rgba(255,255,255,0.6)',
                      padding: '6px 10px',
                      background: 'rgba(0,0,0,0.15)',
                      borderRadius: '6px',
                      borderLeft: `2px solid ${matchupEdge > 2 ? '#10B981' : matchupEdge < -2 ? '#F87171' : '#64748B'}`
                    }}>
                      {getMatchupInsight()}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Smart Takeaway */}
            <div style={{ padding: isMobile ? '10px 14px' : '12px 18px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.7)' }}>
                {twoP.off > D1_AVG.twoP + 2 && twoP.def > D1_AVG.twoP + 2 
                  ? `🔥 ${offAbbrev} elite inside (${twoP.off.toFixed(0)}%) vs leaky interior D — paint points likely` 
                  : threeP.off > D1_AVG.threeP + 2 && threeP.def > D1_AVG.threeP + 2
                  ? `🏹 ${offAbbrev} shoots well (${threeP.off.toFixed(0)}%) & ${defAbbrev} allows ${threeP.def.toFixed(0)}% — perimeter edge`
                  : twoP.off < D1_AVG.twoP - 2 && twoP.def < D1_AVG.twoP - 2
                  ? `🛡️ Tough interior matchup — ${defAbbrev} holds teams to ${twoP.def.toFixed(0)}%`
                  : eFG.off > D1_AVG.eFG + 2
                  ? `📊 ${offAbbrev} efficient offense (${eFG.off.toFixed(0)}% eFG) — should score`
                  : eFG.def < D1_AVG.eFG - 2
                  ? `🛡️ ${defAbbrev} elite D (${eFG.def.toFixed(0)}% eFG allowed) — tough to score on`
                  : '📊 Balanced shooting matchup — execution will decide'}
              </span>
            </div>
          </div>

          {/* BALL CONTROL CARD */}
          <div style={{ background: 'rgba(15, 23, 42, 0.3)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: isMobile ? '10px 14px' : '12px 18px', background: 'rgba(239, 68, 68, 0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#F87171', letterSpacing: '0.1em' }}>🏀 BALL CONTROL</span>
            </div>
            <div style={{ padding: isMobile ? '14px' : '18px' }}>
              <div style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>TURNOVER RATE</span>
                <span>D1: {D1_AVG.to}%</span>
              </div>
              {/* Offense commits - lower is better */}
              {(() => {
                const offGood = to.off < D1_AVG.to;
                const defDangerous = to.def > D1_AVG.to;
                const offContext = Math.abs(to.off - D1_AVG.to) > 1.5 ? (offGood ? '✓ PROTECTS' : '⚠️ CARELESS') : '~ AVG';
                const defContext = Math.abs(to.def - D1_AVG.to) > 1.5 ? (defDangerous ? '⚠️ FORCES TOs' : '✓ DOESN\'T PRESS') : '~ AVG D';
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '800', color: offGood ? '#10B981' : '#F59E0B', fontFamily: 'ui-monospace, monospace', width: isMobile ? '50px' : '55px' }}>{to.off.toFixed(1)}%</span>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: `${Math.min((to.off / 25) * 100, 100)}%`, height: '100%', background: offGood ? 'linear-gradient(90deg, #10B98150, #10B981)' : 'linear-gradient(90deg, #F5980B50, #F59E0B)', borderRadius: '2px' }} />
                        <div style={{ position: 'absolute', left: `${(D1_AVG.to / 25) * 100}%`, top: '-2px', width: '2px', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
                      </div>
                      <span style={{ fontSize: isMobile ? '8px' : '9px', color: offGood ? '#10B981' : '#F59E0B', width: isMobile ? '70px' : '80px', textAlign: 'right' }}>{offContext}</span>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.15)', margin: '2px 0' }}>↓</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '800', color: defDangerous ? '#F87171' : 'rgba(255,255,255,0.5)', fontFamily: 'ui-monospace, monospace', width: isMobile ? '50px' : '55px' }}>{to.def.toFixed(1)}%</span>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: `${Math.min((to.def / 25) * 100, 100)}%`, height: '100%', background: defDangerous ? 'linear-gradient(90deg, #F8717150, #F87171)' : 'linear-gradient(90deg, #64748B50, #64748B)', borderRadius: '2px' }} />
                        <div style={{ position: 'absolute', left: `${(D1_AVG.to / 25) * 100}%`, top: '-2px', width: '2px', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
                      </div>
                      <span style={{ fontSize: isMobile ? '8px' : '9px', color: defDangerous ? '#F87171' : 'rgba(255,255,255,0.4)', width: isMobile ? '70px' : '80px', textAlign: 'right' }}>{defContext}</span>
                    </div>
                  </>
                );
              })()}
            </div>
            <div style={{ padding: isMobile ? '10px 14px' : '12px 18px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.7)' }}>
                {to.def > D1_AVG.to + 1.5 && to.off > D1_AVG.to
                  ? `⚠️ Danger! ${defAbbrev} forces ${to.def.toFixed(0)}% TOs & ${offAbbrev} is careless (${to.off.toFixed(0)}%)`
                  : to.off < D1_AVG.to - 1.5 && to.def > D1_AVG.to
                  ? `✓ ${offAbbrev} protects the ball well (${to.off.toFixed(0)}%) — should handle pressure`
                  : to.off < D1_AVG.to - 1.5
                  ? `✓ ${offAbbrev} takes care of the ball (${to.off.toFixed(0)}% TO rate)`
                  : to.def > D1_AVG.to + 1.5
                  ? `⚠️ ${defAbbrev} forces turnovers (${to.def.toFixed(0)}%) — ball security matters`
                  : '📊 Ball control should be neutral in this matchup'}
              </span>
            </div>
          </div>

          {/* REBOUNDING CARD */}
          <div style={{ background: 'rgba(15, 23, 42, 0.3)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: isMobile ? '10px 14px' : '12px 18px', background: 'rgba(59, 130, 246, 0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#60A5FA', letterSpacing: '0.1em' }}>♻️ REBOUNDING</span>
            </div>
            <div style={{ padding: isMobile ? '14px' : '18px' }}>
              <div style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>OFFENSIVE REBOUND %</span>
                <span>D1: {D1_AVG.oreb}%</span>
              </div>
              {(() => {
                const offGood = oreb.off > D1_AVG.oreb;
                const defBad = oreb.def > D1_AVG.oreb; // Defense allowing high OREB% is bad
                const offContext = Math.abs(oreb.off - D1_AVG.oreb) > 2 ? (offGood ? '▲ CRASHES GLASS' : '▼ DOESN\'T CRASH') : '~ AVG';
                const defContext = Math.abs(oreb.def - D1_AVG.oreb) > 2 ? (defBad ? '⚠️ GIVES UP' : '✓ LOCKS OUT') : '~ AVG D';
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '800', color: offGood ? '#10B981' : 'rgba(255,255,255,0.5)', fontFamily: 'ui-monospace, monospace', width: isMobile ? '50px' : '55px' }}>{oreb.off.toFixed(1)}%</span>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: `${Math.min((oreb.off / 40) * 100, 100)}%`, height: '100%', background: offGood ? 'linear-gradient(90deg, #10B98150, #10B981)' : 'linear-gradient(90deg, #64748B50, #64748B)', borderRadius: '2px' }} />
                        <div style={{ position: 'absolute', left: `${(D1_AVG.oreb / 40) * 100}%`, top: '-2px', width: '2px', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
                      </div>
                      <span style={{ fontSize: isMobile ? '8px' : '9px', color: offGood ? '#10B981' : 'rgba(255,255,255,0.4)', width: isMobile ? '70px' : '85px', textAlign: 'right' }}>{offContext}</span>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.15)', margin: '2px 0' }}>↓</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '800', color: defBad ? '#F87171' : '#10B981', fontFamily: 'ui-monospace, monospace', width: isMobile ? '50px' : '55px' }}>{oreb.def.toFixed(1)}%</span>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: `${Math.min((oreb.def / 40) * 100, 100)}%`, height: '100%', background: defBad ? 'linear-gradient(90deg, #F8717150, #F87171)' : 'linear-gradient(90deg, #10B98150, #10B981)', borderRadius: '2px' }} />
                        <div style={{ position: 'absolute', left: `${(D1_AVG.oreb / 40) * 100}%`, top: '-2px', width: '2px', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
                      </div>
                      <span style={{ fontSize: isMobile ? '8px' : '9px', color: defBad ? '#F87171' : '#10B981', width: isMobile ? '70px' : '85px', textAlign: 'right' }}>{defContext}</span>
                    </div>
                  </>
                );
              })()}
            </div>
            <div style={{ padding: isMobile ? '10px 14px' : '12px 18px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.7)' }}>
                {oreb.off > D1_AVG.oreb + 2 && oreb.def > D1_AVG.oreb + 2
                  ? `🔥 Big edge! ${offAbbrev} crashes glass (${oreb.off.toFixed(0)}%) & ${defAbbrev} allows ${oreb.def.toFixed(0)}% — second chance pts`
                  : oreb.off > D1_AVG.oreb + 2 && oreb.def < D1_AVG.oreb
                  ? `⚔️ Battle: ${offAbbrev} crashes (${oreb.off.toFixed(0)}%) vs ${defAbbrev}'s lockout D (${oreb.def.toFixed(0)}%)`
                  : oreb.off > D1_AVG.oreb + 2
                  ? `♻️ ${offAbbrev} crashes the offensive glass (${oreb.off.toFixed(0)}%)`
                  : oreb.def > D1_AVG.oreb + 2
                  ? `⚠️ ${defAbbrev} gives up offensive boards (${oreb.def.toFixed(0)}%) — second chances`
                  : '📊 Rebounding should be neutral'}
              </span>
            </div>
          </div>

          {/* PACE CARD */}
          <div style={{ background: 'rgba(15, 23, 42, 0.3)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: isMobile ? '10px 14px' : '12px 18px', background: 'rgba(16, 185, 129, 0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#34D399', letterSpacing: '0.1em' }}>🏃 PACE & FREE THROWS</span>
            </div>
            <div style={{ padding: isMobile ? '14px' : '18px' }}>
              {/* FT Rate */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>FREE THROW RATE</span>
                  <span>D1: {D1_AVG.ftRate}%</span>
                </div>
                {(() => {
                  const offGood = ftRate.off > D1_AVG.ftRate;
                  const defFouls = (ftRate.def || 32) > D1_AVG.ftRate;
                  const offContext = Math.abs(ftRate.off - D1_AVG.ftRate) > 3 ? (offGood ? '▲ ATTACKS' : '▼ PERIMETER') : '~ AVG';
                  const defContext = Math.abs((ftRate.def || 32) - D1_AVG.ftRate) > 3 ? (defFouls ? '⚠️ FOULS A LOT' : '✓ DISCIPLINED') : '~ AVG D';
                  return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '800', color: offGood ? '#10B981' : 'rgba(255,255,255,0.5)', fontFamily: 'ui-monospace, monospace', width: isMobile ? '50px' : '55px' }}>{ftRate.off.toFixed(1)}%</span>
                        <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                          <div style={{ width: `${Math.min((ftRate.off / 45) * 100, 100)}%`, height: '100%', background: offGood ? 'linear-gradient(90deg, #10B98150, #10B981)' : 'linear-gradient(90deg, #64748B50, #64748B)', borderRadius: '2px' }} />
                          <div style={{ position: 'absolute', left: `${(D1_AVG.ftRate / 45) * 100}%`, top: '-2px', width: '2px', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
                        </div>
                        <span style={{ fontSize: isMobile ? '8px' : '9px', color: offGood ? '#10B981' : 'rgba(255,255,255,0.4)', width: isMobile ? '70px' : '80px', textAlign: 'right' }}>{offContext}</span>
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.15)', margin: '2px 0' }}>↓</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '800', color: defFouls ? '#F87171' : 'rgba(255,255,255,0.5)', fontFamily: 'ui-monospace, monospace', width: isMobile ? '50px' : '55px' }}>{(ftRate.def || 32).toFixed(1)}%</span>
                        <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                          <div style={{ width: `${Math.min(((ftRate.def || 32) / 45) * 100, 100)}%`, height: '100%', background: defFouls ? 'linear-gradient(90deg, #F8717150, #F87171)' : 'linear-gradient(90deg, #64748B50, #64748B)', borderRadius: '2px' }} />
                          <div style={{ position: 'absolute', left: `${(D1_AVG.ftRate / 45) * 100}%`, top: '-2px', width: '2px', height: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
                        </div>
                        <span style={{ fontSize: isMobile ? '8px' : '9px', color: defFouls ? '#F87171' : 'rgba(255,255,255,0.4)', width: isMobile ? '70px' : '80px', textAlign: 'right' }}>{defContext}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
              {/* Tempo */}
              <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: isMobile ? '9px' : '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>TEMPO (poss/40 min)</span>
                  <span>D1: {D1_AVG.tempo}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{offAbbrev}</div>
                    <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: tempo.off > 70 ? '#10B981' : tempo.off < 65 ? '#3B82F6' : '#F59E0B', fontFamily: 'ui-monospace, monospace' }}>{tempo.off.toFixed(1)}</div>
                    <div style={{ fontSize: '8px', color: tempo.off > 70 ? '#10B981' : tempo.off < 65 ? '#3B82F6' : '#F59E0B' }}>{tempo.off > 70 ? '▲ FAST' : tempo.off < 65 ? '▼ SLOW' : '~ AVG'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{defAbbrev}</div>
                    <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: tempo.def > 70 ? '#10B981' : tempo.def < 65 ? '#3B82F6' : '#F59E0B', fontFamily: 'ui-monospace, monospace' }}>{tempo.def.toFixed(1)}</div>
                    <div style={{ fontSize: '8px', color: tempo.def > 70 ? '#10B981' : tempo.def < 65 ? '#3B82F6' : '#F59E0B' }}>{tempo.def > 70 ? '▲ FAST' : tempo.def < 65 ? '▼ SLOW' : '~ AVG'}</div>
                  </div>
                  <div style={{ background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', padding: '8px 4px' }}>
                    <div style={{ fontSize: '7px', color: '#FBBF24', marginBottom: '4px' }}>EXPECTED</div>
                    <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: '#FBBF24', fontFamily: 'ui-monospace, monospace' }}>{((tempo.off + tempo.def) / 2).toFixed(0)}</div>
                    <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)' }}>POSS</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: isMobile ? '10px 14px' : '12px 18px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.7)' }}>
                {ftRate.off > D1_AVG.ftRate + 3 && (ftRate.def || 32) > D1_AVG.ftRate + 3
                  ? `🎟️ FT parade! ${offAbbrev} attacks (${ftRate.off.toFixed(0)}%) vs fouling D (${(ftRate.def || 32).toFixed(0)}%)`
                  : tempo.off > 70 && tempo.def > 70 
                  ? `🏃 Fast pace from both (~${((tempo.off + tempo.def) / 2).toFixed(0)} poss) — high-scoring potential`
                  : tempo.off < 65 && tempo.def < 65 
                  ? `🐢 Grind it out game (~${((tempo.off + tempo.def) / 2).toFixed(0)} poss) — low-scoring`
                  : ftRate.off > D1_AVG.ftRate + 3
                  ? `🎟️ ${offAbbrev} gets to the line (${ftRate.off.toFixed(0)}% FT rate)`
                  : `🏃 Expect ~${((tempo.off + tempo.def) / 2).toFixed(0)} possessions — ${tempo.off + tempo.def > 140 ? 'faster' : tempo.off + tempo.def < 130 ? 'slower' : 'average'} pace`}
              </span>
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
