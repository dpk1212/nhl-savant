/**
 * 🏀 MATCHUP INTELLIGENCE v8 - STORYTELLING + CONTEXT
 * Every metric tells a story with D1 averages for reference
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

// Get color based on whether stat is good (green) or bad (red)
// For offense: higher is better. For defense: lower is better (they allow less)
const getStatColor = (value: number, avg: number, isDefense: boolean) => {
  const diff = isDefense ? avg - value : value - avg; // Flip for defense
  if (diff > 3) return '#10B981'; // Great
  if (diff > 0) return '#22D3EE'; // Good
  if (diff > -3) return '#F59E0B'; // Average
  return '#EF4444'; // Poor
};

const getStatLabel = (value: number, avg: number, isDefense: boolean) => {
  const diff = isDefense ? avg - value : value - avg;
  if (diff > 5) return isDefense ? 'ELITE D' : 'ELITE';
  if (diff > 2) return isDefense ? 'STRONG D' : 'ABOVE AVG';
  if (diff > -2) return 'AVERAGE';
  if (diff > -5) return isDefense ? 'WEAK D' : 'BELOW AVG';
  return isDefense ? 'POOR D' : 'POOR';
};

// Stat Display Component
const StatDisplay = ({ 
  label, value, avg, isDefense, isMobile, showDiff = true 
}: { 
  label: string; value: number; avg: number; isDefense: boolean; isMobile: boolean; showDiff?: boolean;
}) => {
  const color = getStatColor(value, avg, isDefense);
  const diff = value - avg;
  const diffStr = diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
  
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: isMobile ? '8px' : '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ 
        fontSize: isMobile ? '18px' : '22px', 
        fontWeight: '800', 
        color,
        fontFamily: 'ui-monospace, monospace'
      }}>{value.toFixed(1)}%</div>
      {showDiff && (
        <div style={{ 
          fontSize: isMobile ? '9px' : '10px', 
          color: 'rgba(255,255,255,0.4)',
          marginTop: '2px'
        }}>
          <span style={{ color, fontWeight: '600' }}>{diffStr}</span>
          <span style={{ marginLeft: '3px' }}>vs avg</span>
        </div>
      )}
    </div>
  );
};

// Metric Row Component - Shows offense value → defense value with context
const MetricRow = ({
  label, offValue, defValue, avg, offLabel, defLabel, insight, isMobile
}: {
  label: string; offValue: number; defValue: number; avg: number;
  offLabel: string; defLabel: string; insight?: string; isMobile: boolean;
}) => {
  const offColor = getStatColor(offValue, avg, false);
  const defColor = getStatColor(defValue, avg, true); // Defense: lower is better
  const offDiff = offValue - avg;
  const defDiff = defValue - avg;
  
  return (
    <div style={{ 
      padding: isMobile ? '12px' : '16px',
      background: 'rgba(15, 23, 42, 0.3)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.03)'
    }}>
      <div style={{ 
        fontSize: isMobile ? '9px' : '10px', 
        fontWeight: '700', 
        color: 'rgba(255,255,255,0.5)', 
        letterSpacing: '0.1em',
        marginBottom: isMobile ? '10px' : '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{label}</span>
        <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>D1 AVG: {avg}%</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: isMobile ? '8px' : '12px', alignItems: 'center' }}>
        {/* Offense */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
            <span style={{ fontSize: isMobile ? '8px' : '9px', color: 'rgba(255,255,255,0.4)' }}>{offLabel}</span>
            <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: offColor, fontFamily: 'ui-monospace, monospace' }}>
              {offValue.toFixed(1)}%
            </span>
          </div>
          <div style={{ height: '4px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min((offValue / (avg * 1.3)) * 100, 100)}%`, height: '100%', background: offColor, borderRadius: '2px', transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ fontSize: '8px', color: offColor, marginTop: '3px', fontWeight: '600' }}>
            {offDiff >= 0 ? '+' : ''}{offDiff.toFixed(1)} vs avg
          </div>
        </div>
        
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>→</div>
        
        {/* Defense */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
            <span style={{ fontSize: isMobile ? '8px' : '9px', color: 'rgba(255,255,255,0.4)' }}>{defLabel}</span>
            <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: defColor, fontFamily: 'ui-monospace, monospace' }}>
              {defValue.toFixed(1)}%
            </span>
          </div>
          <div style={{ height: '4px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min((defValue / (avg * 1.3)) * 100, 100)}%`, height: '100%', background: defColor, borderRadius: '2px', transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ fontSize: '8px', color: defColor, marginTop: '3px', fontWeight: '600' }}>
            {defDiff >= 0 ? '+' : ''}{defDiff.toFixed(1)} vs avg
            <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>
              ({defDiff < 0 ? '✓ good D' : 'allows a lot'})
            </span>
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
  const betterTeam = awayRank < homeRank ? awayTeam : homeTeam;
  const rankGap = Math.abs(awayRank - homeRank);

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

  // Generate narrative headline
  const getHeadline = () => {
    if (rankGap > 75) return `${betterTeam} is significantly stronger — expect them to control this game`;
    if (rankGap > 40) return `${betterTeam} holds a clear quality advantage in this matchup`;
    if (mismatch > 100) return `Major mismatch: ${offTeamName}'s offense faces weak defense`;
    if (mismatch > 50) return `Favorable matchup for ${offTeamName} on the offensive end`;
    return `Competitive matchup — margins will matter here`;
  };

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

      {/* ═══════════════════ HEADLINE NARRATIVE ═══════════════════ */}
      <div style={{ padding }}>
        <div style={{
          padding: isMobile ? '14px' : '18px',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(251, 191, 36, 0.03) 100%)',
          borderRadius: '14px',
          border: '1px solid rgba(251, 191, 36, 0.15)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: isMobile ? '12px' : '14px', color: 'white', fontWeight: '600', lineHeight: 1.5 }}>
            {getHeadline()}
          </div>
        </div>
      </div>

      {/* ═══════════════════ POWER RATINGS ═══════════════════ */}
      <div style={{ padding: `0 ${padding} ${padding}` }}>
        <div style={{ 
          fontSize: isMobile ? '9px' : '10px', 
          fontWeight: '700', 
          color: '#FBBF24', 
          letterSpacing: '0.15em',
          textAlign: 'center',
          marginBottom: isMobile ? '12px' : '16px'
        }}>◈ OVERALL POWER RATINGS ◈</div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: isMobile ? '10px' : '16px'
        }}>
          {/* Away Team */}
          <div style={{ 
            padding: isMobile ? '14px' : '20px',
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '14px',
            border: `1px solid ${awayTier.color}20`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{awayTeam}</div>
            <div style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '800', color: awayTier.color, fontFamily: 'ui-monospace, monospace' }}>#{awayRank}</div>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: '6px',
              background: `${awayTier.color}15`, border: `1px solid ${awayTier.color}30`,
              marginTop: '6px'
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: awayTier.color }} />
              <span style={{ fontSize: '9px', fontWeight: '700', color: awayTier.color }}>{awayTier.label}</span>
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Top {getPercentile(awayRank)}% of D1</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px', fontSize: isMobile ? '11px' : '12px' }}>
              <span><span style={{ color: 'rgba(255,255,255,0.4)' }}>OFF</span> <span style={{ color: '#34D399', fontWeight: '700' }}>#{away.adjOff_rank}</span></span>
              <span><span style={{ color: 'rgba(255,255,255,0.4)' }}>DEF</span> <span style={{ color: '#F87171', fontWeight: '700' }}>#{away.adjDef_rank}</span></span>
            </div>
          </div>

          {/* Home Team */}
          <div style={{ 
            padding: isMobile ? '14px' : '20px',
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '14px',
            border: `1px solid ${homeTier.color}20`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{homeTeam}</div>
            <div style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '800', color: homeTier.color, fontFamily: 'ui-monospace, monospace' }}>#{homeRank}</div>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: '6px',
              background: `${homeTier.color}15`, border: `1px solid ${homeTier.color}30`,
              marginTop: '6px'
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: homeTier.color }} />
              <span style={{ fontSize: '9px', fontWeight: '700', color: homeTier.color }}>{homeTier.label}</span>
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Top {getPercentile(homeRank)}% of D1</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px', fontSize: isMobile ? '11px' : '12px' }}>
              <span><span style={{ color: 'rgba(255,255,255,0.4)' }}>OFF</span> <span style={{ color: '#34D399', fontWeight: '700' }}>#{home.adjOff_rank}</span></span>
              <span><span style={{ color: 'rgba(255,255,255,0.4)' }}>DEF</span> <span style={{ color: '#F87171', fontWeight: '700' }}>#{home.adjDef_rank}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ OFFENSE vs DEFENSE BREAKDOWN ═══════════════════ */}
      <div style={{ padding: `0 ${padding} ${padding}` }}>
        <div style={{
          padding: isMobile ? '14px' : '20px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(99, 102, 241, 0.03) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.12)'
        }}>
          {/* Section Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: isMobile ? '14px' : '18px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div>
              <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#A78BFA', letterSpacing: '0.1em' }}>
                ⚡ {offTeamName.toUpperCase()} OFFENSE
          </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Ranked #{offRank} • {getPercentile(offRank)}th percentile
              </div>
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>vs</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: '700', color: '#F87171', letterSpacing: '0.1em' }}>
                {defTeamName.toUpperCase()} DEFENSE 🛡️
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Ranked #{defRank} • {getPercentile(defRank)}th percentile
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
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '4px' }}>MISMATCH INDEX</div>
            <div style={{ 
              fontSize: isMobile ? '24px' : '28px', 
              fontWeight: '800',
              color: mismatch > 50 ? '#10B981' : mismatch > 0 ? '#3B82F6' : '#EF4444',
              fontFamily: 'ui-monospace, monospace'
            }}>{mismatch > 0 ? '+' : ''}{mismatch}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
              {mismatch > 100 ? 'MASSIVE ADVANTAGE' : mismatch > 50 ? 'STRONG EDGE' : mismatch > 0 ? 'SLIGHT EDGE' : mismatch > -50 ? 'EVEN' : 'TOUGH MATCHUP'}
            </div>
          </div>

          {/* ALL METRICS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px' }}>
            
            {/* SHOOTING */}
            <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginTop: '8px' }}>SHOOTING</div>
            
            <MetricRow
              label="2-POINT %"
              offValue={twoP.off} defValue={twoP.def} avg={D1_AVG.twoP}
              offLabel={`${offTeamName.slice(0,6)} shoots`}
              defLabel={`${defTeamName.slice(0,6)} allows`}
              insight={twoP.off > 54 && twoP.def > 52 ? `🔥 Elite paint scorers vs weak interior D` : undefined}
              isMobile={isMobile}
            />
            
            <MetricRow
              label="3-POINT %"
              offValue={threeP.off} defValue={threeP.def} avg={D1_AVG.threeP}
              offLabel={`${offTeamName.slice(0,6)} shoots`}
              defLabel={`${defTeamName.slice(0,6)} allows`}
              insight={threeP.off > 36 && threeP.def > 36 ? `🏹 Good shooters face poor perimeter D` : undefined}
              isMobile={isMobile}
            />
            
            <MetricRow
              label="3PT RATE (how often they shoot 3s)"
              offValue={threePRate.off} defValue={threePRate.def} avg={D1_AVG.threePRate}
              offLabel={`${offTeamName.slice(0,6)} takes`}
              defLabel={`${defTeamName.slice(0,6)} allows`}
              insight={threePRate.off > 48 ? `⚠️ High 3PT volume = variance risk` : undefined}
              isMobile={isMobile}
            />
            
            <MetricRow
              label="eFG% (overall shooting efficiency)"
              offValue={eFG.off} defValue={eFG.def} avg={D1_AVG.eFG}
              offLabel={`${offTeamName.slice(0,6)} shoots`}
              defLabel={`${defTeamName.slice(0,6)} allows`}
              isMobile={isMobile}
            />

            {/* BALL CONTROL */}
            <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginTop: '12px' }}>BALL CONTROL</div>
            
            <MetricRow
              label="TURNOVER RATE"
              offValue={to.off} defValue={to.def} avg={D1_AVG.to}
              offLabel={`${offTeamName.slice(0,6)} commits`}
              defLabel={`${defTeamName.slice(0,6)} forces`}
              insight={to.def > to.off + 3 ? `⚠️ ${defTeamName} forces turnovers — protect the ball` : to.off < 15 ? `✓ ${offTeamName} takes care of the ball` : undefined}
              isMobile={isMobile}
            />

            {/* REBOUNDING */}
            <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginTop: '12px' }}>REBOUNDING</div>
            
            <MetricRow
              label="OFFENSIVE REBOUND %"
              offValue={oreb.off} defValue={oreb.def} avg={D1_AVG.oreb}
              offLabel={`${offTeamName.slice(0,6)} grabs`}
              defLabel={`${defTeamName.slice(0,6)} allows`}
              insight={oreb.off > 30 && oreb.def > 29 ? `♻️ Second chance points likely` : undefined}
              isMobile={isMobile}
            />

            {/* FREE THROWS */}
            <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginTop: '12px' }}>FREE THROWS & PACE</div>
            
            <MetricRow
              label="FREE THROW RATE"
              offValue={ftRate.off} defValue={ftRate.def || 32} avg={D1_AVG.ftRate}
              offLabel={`${offTeamName.slice(0,6)} draws`}
              defLabel={`${defTeamName.slice(0,6)} sends`}
              insight={ftRate.off > 38 ? `🎟️ ${offTeamName} attacks & gets to the line` : undefined}
              isMobile={isMobile}
            />

            {/* TEMPO */}
            <div style={{ 
              padding: isMobile ? '12px' : '16px',
              background: 'rgba(15, 23, 42, 0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>TEMPO (possessions/game)</span>
                <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>D1 AVG: {D1_AVG.tempo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{offTeamName.slice(0,8)}</div>
                  <div style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: tempo.off > 70 ? '#10B981' : tempo.off > 65 ? '#F59E0B' : '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>{tempo.off.toFixed(1)}</div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{tempo.off > 70 ? 'FAST' : tempo.off > 65 ? 'MODERATE' : 'SLOW'}</div>
            </div>
                <div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{defTeamName.slice(0,8)}</div>
                  <div style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: tempo.def > 70 ? '#10B981' : tempo.def > 65 ? '#F59E0B' : '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>{tempo.def.toFixed(1)}</div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{tempo.def > 70 ? 'FAST' : tempo.def > 65 ? 'MODERATE' : 'SLOW'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>EXPECTED</div>
                  <div style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: '#FBBF24', fontFamily: 'ui-monospace, monospace' }}>{((tempo.off + tempo.def) / 2).toFixed(0)}</div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>GAME PACE</div>
                </div>
              </div>
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
