/**
 * 🏀 ADVANCED MATCHUP INTELLIGENCE v5
 * VISUAL FLOW DESIGN - Premium Analytics Experience
 */

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Trophy, Target, Zap, BarChart3, Activity } from 'lucide-react';

const D1_AVERAGES = {
  efficiency: 100,
  eFG: 50.0,
  turnover: 18.0,
  oreb: 28.0,
  twoP: 50.0,
  threeP: 34.0,
  threeP_rate: 40.0,
  ftRate: 32.0
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
  adjTempo_rank?: number;
  ftRate_off?: number;
  ftRate_def?: number;
  threeP_rate_off?: number;
  threeP_rate_def?: number;
  wab?: number;
  wab_rank?: number;
}

interface MatchupAnalysis {
  rankAdvantage: 'away' | 'home';
  rankDiff: number;
  expectedTempo?: number;
  powerRankDiff?: number;
  ftRateEdge?: number;
  avgThreeRate?: number;
}

type ViewMode = 'awayOff_homeDef' | 'homeOff_awayDef';

const getPercentile = (rank: number) => Math.round((1 - (rank - 1) / (TOTAL_TEAMS - 1)) * 100);

const getTierLabel = (rank: number) => {
  if (rank <= 25) return { label: 'ELITE', color: '#10B981' };
  if (rank <= 50) return { label: 'EXCELLENT', color: '#22D3EE' };
  if (rank <= 100) return { label: 'STRONG', color: '#3B82F6' };
  if (rank <= 175) return { label: 'AVERAGE', color: '#F59E0B' };
  if (rank <= 275) return { label: 'BELOW AVG', color: '#F97316' };
  return { label: 'WEAK', color: '#EF4444' };
};

const getStatTier = (value: number, avg: number, higherIsBetter: boolean = true) => {
  const diff = higherIsBetter ? value - avg : avg - value;
  if (diff > 5) return { label: 'ELITE', color: '#10B981' };
  if (diff > 2) return { label: 'ABOVE AVG', color: '#22D3EE' };
  if (diff > -2) return { label: 'AVERAGE', color: '#F59E0B' };
  if (diff > -5) return { label: 'BELOW AVG', color: '#F97316' };
  return { label: 'POOR', color: '#EF4444' };
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

  const isAwayOffView = view === 'awayOff_homeDef';
  const offTeam = isAwayOffView ? away : home;
  const defTeam = isAwayOffView ? home : away;
  const offTeamName = isAwayOffView ? awayTeam : homeTeam;
  const defTeamName = isAwayOffView ? homeTeam : awayTeam;

  // Power ratings
  const awayPowerRank = away.bartholomew_rank || away.rank || 182;
  const homePowerRank = home.bartholomew_rank || home.rank || 182;
  const awayBarthag = away.bartholomew || 0.5;
  const homeBarthag = home.bartholomew || 0.5;

  // Mismatch calculation
  const offRank = offTeam.adjOff_rank || 182;
  const defRank = defTeam.adjDef_rank || 182;
  const mismatchScore = defRank - offRank;
  const mismatchLabel = mismatchScore > 150 ? 'MASSIVE EDGE' : mismatchScore > 75 ? 'STRONG EDGE' : mismatchScore > 25 ? 'SLIGHT EDGE' : mismatchScore > -25 ? 'EVEN' : 'TOUGH MATCHUP';

  // Shooting data
  const twoP = {
    off: offTeam.twoP_off || 50,
    def: defTeam.twoP_def || 50,
    edge: (offTeam.twoP_off || 50) - (defTeam.twoP_def || 50)
  };
  
  const threeP = {
    off: offTeam.threeP_off || 34,
    def: defTeam.threeP_def || 34,
    edge: (offTeam.threeP_off || 34) - (defTeam.threeP_def || 34)
  };
  
  const threePRate = {
    off: offTeam.threeP_rate_off || 40,
    def: defTeam.threeP_rate_def || 40
  };
  
  const eFG = {
    off: offTeam.eFG_off || 50,
    def: defTeam.eFG_def || 50,
    edge: (offTeam.eFG_off || 50) - (defTeam.eFG_def || 50)
  };

  // Rebounding
  const oreb = {
    off: offTeam.oreb_off || 28,
    def: defTeam.oreb_def || 28,
    edge: (offTeam.oreb_off || 28) - (defTeam.oreb_def || 28)
  };

  // Game dynamics
  const tempo = {
    off: offTeam.adjTempo || 67,
    def: defTeam.adjTempo || 67
  };
  
  const ftRate = {
    off: offTeam.ftRate_off || 32,
    def: defTeam.ftRate_off || 32
  };
  
  const turnover = {
    off: offTeam.to_off || 18,
    def: defTeam.to_def || 18
  };
  
  const variance3P = Math.max(offTeam.threeP_rate_off || 40, defTeam.threeP_rate_off || 40);

  // Edge summary
  const edges = [
    { key: 'PWR', win: awayPowerRank < homePowerRank ? 'away' : 'home', label: 'Power' },
    { key: 'SHOOT', win: eFG.edge > 0 ? 'offense' : 'defense', label: 'Shooting' },
    { key: 'BOARD', win: oreb.edge > 0 ? 'offense' : 'defense', label: 'Boards' },
    { key: 'TEMPO', win: tempo.off > tempo.def ? 'offense' : 'defense', label: 'Tempo' },
    { key: 'FT', win: ftRate.off > ftRate.def ? 'offense' : 'defense', label: 'FT Rate' },
    { key: 'TO', win: turnover.off < turnover.def ? 'offense' : 'defense', label: 'Ball Sec', isRisk: turnover.def > turnover.off },
    { key: 'VAR', win: variance3P < 45 ? 'low' : 'high', label: 'Variance', isRisk: variance3P >= 45 }
  ];

  const offenseEdges = edges.filter(e => (e.win === 'offense' || (e.key === 'PWR' && isAwayOffView && e.win === 'away') || (e.key === 'PWR' && !isAwayOffView && e.win === 'home')) && !e.isRisk).length;
  const risks = edges.filter(e => e.isRisk).length;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 50%, #0F172A 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }}>
      
      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(99, 102, 241, 0.1) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        padding: isMobile ? '14px 18px' : '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={18} color="#A5B4FC" />
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(167, 139, 250, 0.8)', letterSpacing: '0.12em' }}>ADVANCED ANALYTICS</div>
            <div style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '800', color: 'white' }}>Matchup Intelligence</div>
          </div>
        </div>
        <button
          onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', cursor: 'pointer'
          }}
        >
          <ArrowRightLeft size={13} color="#A5B4FC" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#C7D2FE' }}>FLIP</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* POWER RATINGS SECTION */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '20px 16px' : '24px' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '16px',
          fontSize: '11px', 
          fontWeight: '800', 
          color: '#FCD34D', 
          letterSpacing: '0.15em'
        }}>
          ◈ POWER RATINGS ◈
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px',
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(251, 191, 36, 0.2)'
        }}>
          {/* Away Team */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>{awayTeam.toUpperCase()}</div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#FCD34D', fontFamily: 'ui-monospace, monospace' }}>
                {(awayBarthag * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginTop: '4px' }}>POWER RATING</div>
              
              {/* Power bar */}
              <div style={{ height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${animated ? awayBarthag * 100 : 0}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                  borderRadius: '3px',
                  transition: 'width 1s ease-out'
                }} />
              </div>
              
              <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: '800', color: '#3B82F6' }}>#{awayPowerRank} OVERALL</div>
              <div style={{ fontSize: '9px', color: getTierLabel(awayPowerRank).color, fontWeight: '700', marginTop: '2px' }}>
                {getTierLabel(awayPowerRank).label}
              </div>
              
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>OFF</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#10B981' }}>#{away.adjOff_rank || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>DEF</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#EF4444' }}>#{away.adjDef_rank || '—'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Home Team */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>{homeTeam.toUpperCase()}</div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#FCD34D', fontFamily: 'ui-monospace, monospace' }}>
                {(homeBarthag * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginTop: '4px' }}>POWER RATING</div>
              
              <div style={{ height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${animated ? homeBarthag * 100 : 0}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #EF4444, #F87171)',
                  borderRadius: '3px',
                  transition: 'width 1s ease-out'
                }} />
              </div>
              
              <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: '800', color: '#EF4444' }}>#{homePowerRank} OVERALL</div>
              <div style={{ fontSize: '9px', color: getTierLabel(homePowerRank).color, fontWeight: '700', marginTop: '2px' }}>
                {getTierLabel(homePowerRank).label}
              </div>
              
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>OFF</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#10B981' }}>#{home.adjOff_rank || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>DEF</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#EF4444' }}>#{home.adjDef_rank || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* MATCHUP MISMATCH INDEX */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '0 16px 20px' : '0 24px 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#A78BFA', letterSpacing: '0.1em' }}>⚡ MATCHUP MISMATCH INDEX ⚡</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{offTeamName.toUpperCase()} OFFENSE</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>#{offRank}</div>
              <div style={{ fontSize: '10px', color: getTierLabel(offRank).color }}>{getPercentile(offRank)}th %ile</div>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>vs</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{defTeamName.toUpperCase()} DEFENSE</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>#{defRank}</div>
              <div style={{ fontSize: '10px', color: getTierLabel(defRank).color }}>{getPercentile(defRank)}th %ile</div>
            </div>
          </div>
          
          {/* Mismatch bar */}
          <div style={{ position: 'relative', height: '12px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '6px', marginBottom: '16px', overflow: 'hidden' }}>
            <div style={{ 
              position: 'absolute', 
              left: 0, 
              top: 0, 
              bottom: 0, 
              width: `${Math.min(100, Math.max(0, 50 + mismatchScore / 4))}%`,
              background: mismatchScore > 0 
                ? 'linear-gradient(90deg, #3B82F6, #10B981)' 
                : 'linear-gradient(90deg, #EF4444, #F97316)',
              borderRadius: '6px',
              transition: 'width 0.8s ease-out'
            }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.3)' }} />
          </div>
          
          {/* Mismatch badge */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 20px',
              borderRadius: '10px',
              background: mismatchScore > 50 ? 'rgba(16, 185, 129, 0.2)' : mismatchScore > 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${mismatchScore > 50 ? 'rgba(16, 185, 129, 0.4)' : mismatchScore > 0 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
            }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: mismatchScore > 50 ? '#10B981' : mismatchScore > 0 ? '#3B82F6' : '#EF4444', fontFamily: 'ui-monospace, monospace' }}>
                MISMATCH: {mismatchScore > 0 ? '+' : ''}{mismatchScore}
              </div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{mismatchLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* SHOOTING ANALYSIS */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '0 16px 20px' : '0 24px 24px' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(251, 191, 36, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Target size={16} color="#FCD34D" />
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#FCD34D', letterSpacing: '0.08em' }}>SHOOTING ANALYSIS</span>
          </div>

          {/* 2-Point */}
          <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'white', marginBottom: '12px' }}>◉ 2-POINT EFFICIENCY</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{offTeamName} SHOOTS</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: getStatTier(twoP.off, D1_AVERAGES.twoP).color, fontFamily: 'ui-monospace, monospace' }}>{twoP.off.toFixed(1)}%</div>
                <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginTop: '6px' }}>
                  <div style={{ width: `${Math.min(100, (twoP.off / 65) * 100)}%`, height: '100%', background: getStatTier(twoP.off, D1_AVERAGES.twoP).color, borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '9px', color: getStatTier(twoP.off, D1_AVERAGES.twoP).color, marginTop: '4px' }}>{getStatTier(twoP.off, D1_AVERAGES.twoP).label}</div>
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{defTeamName} ALLOWS</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: getStatTier(twoP.def, D1_AVERAGES.twoP, false).color, fontFamily: 'ui-monospace, monospace' }}>{twoP.def.toFixed(1)}%</div>
                <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginTop: '6px' }}>
                  <div style={{ width: `${Math.min(100, (twoP.def / 65) * 100)}%`, height: '100%', background: getStatTier(twoP.def, D1_AVERAGES.twoP, false).color, borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '9px', color: getStatTier(twoP.def, D1_AVERAGES.twoP, false).color, marginTop: '4px' }}>{twoP.def > D1_AVERAGES.twoP + 2 ? 'WEAK D' : twoP.def < D1_AVERAGES.twoP - 2 ? 'STRONG D' : 'AVERAGE D'}</div>
              </div>
            </div>
            
            {twoP.edge > 2 && (
              <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#10B981' }}>🔥 PAINT FEAST — Elite finishers meet weak interior D</span>
              </div>
            )}
          </div>

          {/* 3-Point */}
          <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'white' }}>◉ 3-POINT EFFICIENCY</div>
              {threeP.edge > 0 && <div style={{ fontSize: '10px', fontWeight: '700', color: '#10B981', padding: '2px 8px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '4px' }}>EDGE +{threeP.edge.toFixed(1)}%</div>}
            </div>
            
            {/* Accuracy */}
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', letterSpacing: '0.05em' }}>ACCURACY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{offTeamName} SHOOTS</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: getStatTier(threeP.off, D1_AVERAGES.threeP).color, fontFamily: 'ui-monospace, monospace' }}>{threeP.off.toFixed(1)}%</div>
                <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginTop: '6px' }}>
                  <div style={{ width: `${Math.min(100, (threeP.off / 45) * 100)}%`, height: '100%', background: getStatTier(threeP.off, D1_AVERAGES.threeP).color, borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '9px', color: getStatTier(threeP.off, D1_AVERAGES.threeP).color, marginTop: '4px' }}>{getStatTier(threeP.off, D1_AVERAGES.threeP).label}</div>
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{defTeamName} ALLOWS</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: getStatTier(threeP.def, D1_AVERAGES.threeP, false).color, fontFamily: 'ui-monospace, monospace' }}>{threeP.def.toFixed(1)}%</div>
                <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginTop: '6px' }}>
                  <div style={{ width: `${Math.min(100, (threeP.def / 45) * 100)}%`, height: '100%', background: getStatTier(threeP.def, D1_AVERAGES.threeP, false).color, borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '9px', color: getStatTier(threeP.def, D1_AVERAGES.threeP, false).color, marginTop: '4px' }}>{threeP.def > D1_AVERAGES.threeP + 2 ? 'POOR D' : threeP.def < D1_AVERAGES.threeP - 2 ? 'LOCKS DOWN' : 'AVERAGE D'}</div>
              </div>
            </div>
            
            {/* Volume */}
            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '12px' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', letterSpacing: '0.05em' }}>VOLUME (3PT Rate)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{offTeamName} TAKES</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: threePRate.off > 45 ? '#EF4444' : threePRate.off > 38 ? '#F59E0B' : '#10B981', fontFamily: 'ui-monospace, monospace' }}>{threePRate.off.toFixed(0)}%</div>
                  <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginTop: '6px' }}>
                    <div style={{ width: `${Math.min(100, (threePRate.off / 60) * 100)}%`, height: '100%', background: threePRate.off > 45 ? '#EF4444' : '#F59E0B', borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{threePRate.off > 45 ? 'HIGH VOL' : 'BALANCED'}</div>
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>→</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{defTeamName} ALLOWS</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: threePRate.def > 45 ? '#EF4444' : '#F59E0B', fontFamily: 'ui-monospace, monospace' }}>{threePRate.def.toFixed(0)}%</div>
                  <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginTop: '6px' }}>
                    <div style={{ width: `${Math.min(100, (threePRate.def / 60) * 100)}%`, height: '100%', background: '#F59E0B', borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>ALLOWS 3s</div>
                </div>
              </div>
            </div>
            
            {threeP.edge > 2 && threePRate.off > 40 && (
              <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#10B981' }}>🏹 3PT BARRAGE — High volume + accuracy boost = damage</span>
              </div>
            )}
          </div>

          {/* eFG Overall */}
          <div style={{ padding: '16px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'white', marginBottom: '12px' }}>◉ OVERALL EFFICIENCY (eFG%)</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{offTeamName} SHOOTS</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: getStatTier(eFG.off, D1_AVERAGES.eFG).color, fontFamily: 'ui-monospace, monospace' }}>{eFG.off.toFixed(1)}%</div>
                <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginTop: '6px' }}>
                  <div style={{ width: `${Math.min(100, (eFG.off / 60) * 100)}%`, height: '100%', background: getStatTier(eFG.off, D1_AVERAGES.eFG).color, borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '9px', color: getStatTier(eFG.off, D1_AVERAGES.eFG).color, marginTop: '4px' }}>{getStatTier(eFG.off, D1_AVERAGES.eFG).label}</div>
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{defTeamName} ALLOWS</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: getStatTier(eFG.def, D1_AVERAGES.eFG, false).color, fontFamily: 'ui-monospace, monospace' }}>{eFG.def.toFixed(1)}%</div>
                <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginTop: '6px' }}>
                  <div style={{ width: `${Math.min(100, (eFG.def / 60) * 100)}%`, height: '100%', background: getStatTier(eFG.def, D1_AVERAGES.eFG, false).color, borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '9px', color: getStatTier(eFG.def, D1_AVERAGES.eFG, false).color, marginTop: '4px' }}>{eFG.def > D1_AVERAGES.eFG + 3 ? 'ALLOWS A LOT' : eFG.def < D1_AVERAGES.eFG - 3 ? 'STINGY' : 'AVERAGE'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* REBOUNDING ANALYSIS */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '0 16px 20px' : '0 24px 24px' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(16, 185, 129, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '16px' }}>💪</span>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#10B981', letterSpacing: '0.08em' }}>REBOUNDING ANALYSIS</span>
          </div>

          <div style={{ padding: '16px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'white', marginBottom: '12px' }}>◉ OFFENSIVE REBOUNDS (2nd Chance Points)</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{offTeamName} GRABS</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: getStatTier(oreb.off, D1_AVERAGES.oreb).color, fontFamily: 'ui-monospace, monospace' }}>{oreb.off.toFixed(1)}%</div>
                <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginTop: '6px' }}>
                  <div style={{ width: `${Math.min(100, (oreb.off / 40) * 100)}%`, height: '100%', background: getStatTier(oreb.off, D1_AVERAGES.oreb).color, borderRadius: '2px' }} />
                </div>
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{defTeamName} ALLOWS</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: getStatTier(oreb.def, D1_AVERAGES.oreb, false).color, fontFamily: 'ui-monospace, monospace' }}>{oreb.def.toFixed(1)}%</div>
                <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginTop: '6px' }}>
                  <div style={{ width: `${Math.min(100, (oreb.def / 40) * 100)}%`, height: '100%', background: getStatTier(oreb.def, D1_AVERAGES.oreb, false).color, borderRadius: '2px' }} />
                </div>
              </div>
            </div>
            
            {oreb.edge > 3 && (
              <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#10B981' }}>♻️ EXTRA POSSESSIONS — {offTeamName} crashes for 2nd chances</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* GAME DYNAMICS */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '0 16px 20px' : '0 24px 24px' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(99, 102, 241, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Zap size={16} color="#A5B4FC" />
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#A5B4FC', letterSpacing: '0.08em' }}>GAME DYNAMICS</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
            {/* Tempo */}
            <div style={{ padding: '14px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>🏃 TEMPO</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{offTeamName}</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>{tempo.off.toFixed(1)}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginBottom: '8px' }}>
                <div style={{ width: `${Math.min(100, ((tempo.off - 60) / 20) * 100)}%`, height: '100%', background: '#3B82F6', borderRadius: '2px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{defTeamName}</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>{tempo.def.toFixed(1)}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px' }}>
                <div style={{ width: `${Math.min(100, ((tempo.def - 60) / 20) * 100)}%`, height: '100%', background: '#EF4444', borderRadius: '2px' }} />
              </div>
              <div style={{ fontSize: '9px', color: tempo.off > tempo.def ? '#10B981' : '#F59E0B', marginTop: '8px' }}>
                {tempo.off > tempo.def ? `✓ ${offTeamName} PUSHES PACE` : `✓ ${defTeamName} CONTROLS PACE`}
              </div>
            </div>

            {/* FT Rate */}
            <div style={{ padding: '14px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>🎟️ FREE THROW RATE</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{offTeamName}</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>{ftRate.off.toFixed(1)}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginBottom: '8px' }}>
                <div style={{ width: `${Math.min(100, (ftRate.off / 50) * 100)}%`, height: '100%', background: '#3B82F6', borderRadius: '2px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{defTeamName}</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>{ftRate.def.toFixed(1)}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px' }}>
                <div style={{ width: `${Math.min(100, (ftRate.def / 50) * 100)}%`, height: '100%', background: '#EF4444', borderRadius: '2px' }} />
              </div>
              <div style={{ fontSize: '9px', color: ftRate.off > ftRate.def ? '#10B981' : '#F59E0B', marginTop: '8px' }}>
                {ftRate.off > ftRate.def ? `✓ ${offTeamName} GETS TO THE LINE` : `✓ ${defTeamName} ATTACKS MORE`}
              </div>
            </div>

            {/* Ball Security */}
            <div style={{ padding: '14px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>🏀 BALL SECURITY</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{offTeamName} COMMITS</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: turnover.off < D1_AVERAGES.turnover ? '#10B981' : '#F59E0B', fontFamily: 'ui-monospace, monospace' }}>{turnover.off.toFixed(1)}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px', marginBottom: '8px' }}>
                <div style={{ width: `${Math.min(100, (turnover.off / 25) * 100)}%`, height: '100%', background: turnover.off < D1_AVERAGES.turnover ? '#10B981' : '#F59E0B', borderRadius: '2px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{defTeamName} FORCES</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: turnover.def > D1_AVERAGES.turnover ? '#EF4444' : '#F59E0B', fontFamily: 'ui-monospace, monospace' }}>{turnover.def.toFixed(1)}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '2px' }}>
                <div style={{ width: `${Math.min(100, (turnover.def / 25) * 100)}%`, height: '100%', background: turnover.def > D1_AVERAGES.turnover ? '#EF4444' : '#F59E0B', borderRadius: '2px' }} />
              </div>
              <div style={{ fontSize: '9px', color: turnover.def > turnover.off ? '#EF4444' : '#10B981', marginTop: '8px' }}>
                {turnover.def > turnover.off + 2 ? `⚠️ ${defTeamName} FORCES TURNOVERS` : `✓ ${offTeamName} PROTECTS BALL`}
              </div>
            </div>

            {/* Variance */}
            <div style={{ padding: '14px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>🎲 VARIANCE FACTOR</div>
              <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{offTeamName} 3PT RELIANCE</div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: variance3P >= 45 ? 'rgba(239, 68, 68, 0.2)' : variance3P >= 38 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  border: `1px solid ${variance3P >= 45 ? 'rgba(239, 68, 68, 0.4)' : variance3P >= 38 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                }}>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: variance3P >= 45 ? '#EF4444' : variance3P >= 38 ? '#F59E0B' : '#10B981', fontFamily: 'ui-monospace, monospace' }}>{variance3P.toFixed(0)}%</div>
                  <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                    {variance3P >= 45 ? '⚠️ HIGH' : variance3P >= 38 ? 'MODERATE' : '✓ LOW'}
                  </div>
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
                  {variance3P >= 45 ? 'VOLATILE OUTCOME POSSIBLE' : 'PREDICTABLE GAME FLOW'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* EDGE SUMMARY */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: isMobile ? '0 16px 20px' : '0 24px 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#10B981', letterSpacing: '0.15em' }}>◈ EDGE SUMMARY ◈</div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {edges.map((edge) => (
              <div key={edge.key} style={{
                width: '48px',
                padding: '8px 4px',
                borderRadius: '8px',
                background: edge.isRisk ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                border: `1px solid ${edge.isRisk ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>{edge.key}</div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>{edge.isRisk ? '⚠️' : '✅'}</div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: '900', color: offenseEdges >= 4 ? '#10B981' : offenseEdges >= 2 ? '#F59E0B' : '#EF4444' }}>
              🏆 {offTeamName.toUpperCase()} {offenseEdges >= 4 ? 'STRONGLY FAVORED' : offenseEdges >= 2 ? 'SLIGHT EDGE' : 'UPHILL BATTLE'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>
              {offenseEdges} EDGES • {risks} RISKS • {offenseEdges >= 4 ? 'HIGH' : offenseEdges >= 2 ? 'MODERATE' : 'LOW'} CONFIDENCE
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(71, 85, 105, 0.15)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6366F1' }} />
        <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>SAVANT ANALYTICS ENGINE</span>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
