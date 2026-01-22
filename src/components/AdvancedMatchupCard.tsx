/**
 * 🏀 ADVANCED MATCHUP INTELLIGENCE v4
 * ROCK SOLID LOGIC + Smart Shot Profile Narrative
 */

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, TrendingUp, TrendingDown, Shield, Target, Zap, BarChart3, Activity, Info, ChevronDown, ChevronUp, Clock, Trophy, Ticket, Dices } from 'lucide-react';

// D1 Averages
const D1_AVERAGES = {
  efficiency: 100,
  eFG: 50.0,
  turnover: 18.0,
  oreb: 28.0,
  twoP: 50.0,
  threeP: 34.0,
  threeP_def: 34.0 // What defenses allow on average
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
  // Betting Edge data
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

const getTierFromRank = (rank: number) => {
  const pct = getPercentile(rank);
  if (pct >= 90) return { tier: 'ELITE', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
  if (pct >= 75) return { tier: 'EXCELLENT', color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.15)' };
  if (pct >= 55) return { tier: 'ABOVE AVG', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' };
  if (pct >= 40) return { tier: 'AVERAGE', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
  if (pct >= 20) return { tier: 'BELOW AVG', color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' };
  return { tier: 'POOR', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
};

export function AdvancedMatchupCard({ barttorvik, awayTeam, homeTeam }: AdvancedMatchupCardProps) {
  const [view, setView] = useState<ViewMode>('awayOff_homeDef');
  const [animated, setAnimated] = useState(false);
  const [bettingEdgeExpanded, setBettingEdgeExpanded] = useState(true);
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

  const offTier = getTierFromRank(offTeam.adjOff_rank || 182);
  const defTier = getTierFromRank(defTeam.adjDef_rank || 182);

  const offVsAvg = offTeam.adjOff - D1_AVERAGES.efficiency;
  const defVsAvg = defTeam.adjDef - D1_AVERAGES.efficiency;
  const offenseEdge = offVsAvg + defVsAvg;

  const isGoodOffense = offVsAvg > 0;
  const isWeakDefense = defVsAvg > 5;
  const isStrongDefense = defVsAvg < -5;

  const getMatchupNarrative = () => {
    if (isGoodOffense && isWeakDefense) return { text: `Scoring opportunity — ${offTeamName} faces porous defense`, icon: '🔥' };
    if (isGoodOffense && isStrongDefense) return { text: `Elite clash — strong offense vs lockdown defense`, icon: '⚔️' };
    if (isGoodOffense) return { text: `Slight edge — ${offTeamName} should find openings`, icon: '⚡' };
    if (!isGoodOffense && isWeakDefense) return { text: `Weak defense helps — ${offTeamName} may overperform`, icon: '📈' };
    if (!isGoodOffense && isStrongDefense) return { text: `Tough matchup — struggling offense vs elite defense`, icon: '🛡️' };
    return { text: `Even matchup — no significant advantages`, icon: '⚖️' };
  };

  const narrative = getMatchupNarrative();
  const edgeScore = Math.max(15, Math.min(85, Math.round(50 + (offenseEdge * 2))));

  const getEdgeInfo = (score: number) => {
    if (score >= 65) return { color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', label: 'OFFENSE FAVORED', desc: 'Clear scoring advantages in this matchup' };
    if (score >= 55) return { color: '#22D3EE', glow: 'rgba(34, 211, 238, 0.4)', label: 'SLIGHT EDGE', desc: 'Offense should find opportunities' };
    if (score >= 45) return { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', label: 'EVEN MATCHUP', desc: 'No clear advantage — could go either way' };
    if (score >= 35) return { color: '#F97316', glow: 'rgba(249, 115, 22, 0.4)', label: 'DEFENSE EDGE', desc: 'Defense has slight advantages' };
    return { color: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)', label: 'DEFENSE FAVORED', desc: 'Strong defensive matchup — scoring will be tough' };
  };

  const edgeInfo = getEdgeInfo(edgeScore);

  // Four Factors (replaced FT Rate with 3P Defense)
  const fourFactors = [
    {
      key: 'shooting',
      label: 'Shooting (eFG%)',
      icon: '🎯',
      offValue: offTeam.eFG_off,
      defValue: defTeam.eFG_def,
      avg: D1_AVERAGES.eFG,
      offIsGood: offTeam.eFG_off > D1_AVERAGES.eFG,
      defIsGoodD: defTeam.eFG_def < D1_AVERAGES.eFG,
      edge: offTeam.eFG_off - defTeam.eFG_def,
      offLabel: 'shoots',
      defLabel: 'allows',
      getInsight: (edge: number, offGood: boolean, defGoodD: boolean) => {
        if (edge > 3 && !defGoodD) return `Easy looks expected — weak perimeter D`;
        if (edge > 0) return `Shooting edge for ${offTeamName}`;
        if (edge > -3) return `Defense limits efficiency slightly`;
        return `Tough shooting matchup — elite D`;
      }
    },
    {
      key: 'turnovers',
      label: 'Ball Security (TO%)',
      icon: '🏀',
      offValue: offTeam.to_off,
      defValue: defTeam.to_def,
      avg: D1_AVERAGES.turnover,
      offIsGood: offTeam.to_off < D1_AVERAGES.turnover,
      defIsGoodD: defTeam.to_def > D1_AVERAGES.turnover,
      edge: defTeam.to_def - offTeam.to_off,
      offLabel: 'commits',
      defLabel: 'forces',
      getInsight: (edge: number, offGood: boolean, defGoodD: boolean) => {
        if (edge > 2 && defGoodD) return `Turnover risk — ${defTeamName} forces mistakes`;
        if (edge > 0) return `Slight turnover concern`;
        if (offGood) return `${offTeamName} protects the ball well`;
        return `Neither team excels here`;
      }
    },
    {
      key: 'rebounding',
      label: 'Second Chances (OREB%)',
      icon: '💪',
      offValue: offTeam.oreb_off,
      defValue: defTeam.oreb_def,
      avg: D1_AVERAGES.oreb,
      offIsGood: offTeam.oreb_off > D1_AVERAGES.oreb,
      defIsGoodD: defTeam.oreb_def < D1_AVERAGES.oreb,
      edge: offTeam.oreb_off - defTeam.oreb_def,
      offLabel: 'grabs',
      defLabel: 'allows',
      getInsight: (edge: number, offGood: boolean, defGoodD: boolean) => {
        if (edge > 5 && offGood) return `Glass advantage — extra possessions likely`;
        if (edge > 0) return `Should grab some offensive boards`;
        if (defGoodD) return `${defTeamName} locks down the glass`;
        return `Rebounding is even`;
      }
    },
    {
      key: 'threePoint',
      label: '3-Point Battle',
      icon: '🎯',
      offValue: offTeam.threeP_off,
      defValue: defTeam.threeP_def ?? D1_AVERAGES.threeP_def,
      avg: D1_AVERAGES.threeP,
      offIsGood: offTeam.threeP_off > D1_AVERAGES.threeP,
      defIsGoodD: (defTeam.threeP_def ?? D1_AVERAGES.threeP_def) < D1_AVERAGES.threeP_def,
      edge: offTeam.threeP_off - (defTeam.threeP_def ?? D1_AVERAGES.threeP_def),
      offLabel: 'shoots',
      defLabel: 'allows',
      getInsight: (edge: number, offGood: boolean, defGoodD: boolean) => {
        if (edge > 3 && offGood) return `3-point advantage — shooters should thrive`;
        if (edge > 0) return `Open looks from deep expected`;
        if (defGoodD) return `${defTeamName} locks down the arc`;
        return `Three-point battle is even`;
      }
    }
  ];

  const advantageCount = fourFactors.filter(f => {
    if (f.key === 'turnovers') return f.edge < 0;
    return f.edge > 0;
  }).length;

  // Shot profile analysis data
  const twoPt = {
    off: offTeam.twoP_off,
    def: defTeam.twoP_def ?? D1_AVERAGES.twoP,
    offVsAvg: offTeam.twoP_off - D1_AVERAGES.twoP,
    defVsAvg: (defTeam.twoP_def ?? D1_AVERAGES.twoP) - D1_AVERAGES.twoP,
    edge: offTeam.twoP_off - (defTeam.twoP_def ?? D1_AVERAGES.twoP)
  };

  const threePt = {
    off: offTeam.threeP_off,
    def: defTeam.threeP_def ?? D1_AVERAGES.threeP,
    offVsAvg: offTeam.threeP_off - D1_AVERAGES.threeP,
    defVsAvg: (defTeam.threeP_def ?? D1_AVERAGES.threeP) - D1_AVERAGES.threeP,
    edge: offTeam.threeP_off - (defTeam.threeP_def ?? D1_AVERAGES.threeP)
  };

  // Smart shot profile narratives
  const getTwoPtNarrative = () => {
    const offGood = twoPt.offVsAvg > 2;
    const offBad = twoPt.offVsAvg < -2;
    const defWeak = twoPt.defVsAvg > 2;
    const defStrong = twoPt.defVsAvg < -2;

    if (offGood && defWeak) return { text: `Paint points expected — strong finishers vs porous interior D`, color: '#10B981' };
    if (offGood && defStrong) return { text: `Strength vs strength — elite 2P shooters face stiff resistance`, color: '#F59E0B' };
    if (offBad && defWeak) return { text: `Weak D could help — struggles inside but facing poor defense`, color: '#22D3EE' };
    if (offBad && defStrong) return { text: `Tough inside — poor interior offense meets elite D`, color: '#EF4444' };
    if (offGood) return { text: `Good finishers — should find success inside`, color: '#10B981' };
    if (defWeak) return { text: `Interior opportunities — defense allows easy 2s`, color: '#22D3EE' };
    return { text: `Interior game is neutral`, color: '#F59E0B' };
  };

  const getThreePtNarrative = () => {
    const offGood = threePt.offVsAvg > 2;
    const offBad = threePt.offVsAvg < -2;
    const defWeak = threePt.defVsAvg > 2;
    const defStrong = threePt.defVsAvg < -2;

    if (offGood && defWeak) return { text: `Shooters paradise — elite 3PT team vs poor perimeter D`, color: '#10B981' };
    if (offGood && defStrong) return { text: `Battle on the arc — good shooters face tight coverage`, color: '#F59E0B' };
    if (offBad && defWeak) return { text: `Open looks available — struggles from 3 but D allows shots`, color: '#22D3EE' };
    if (offBad && defStrong) return { text: `3-point drought likely — poor shooters, elite defense`, color: '#EF4444' };
    if (offGood) return { text: `Good shooting team — should knock down threes`, color: '#10B981' };
    if (defWeak) return { text: `Perimeter opportunities — defense allows open 3s`, color: '#22D3EE' };
    return { text: `Three-point matchup is neutral`, color: '#F59E0B' };
  };

  const twoPtNarrative = getTwoPtNarrative();
  const threePtNarrative = getThreePtNarrative();

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 50%, #0F172A 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      overflow: 'hidden',
      boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px -20px ${edgeInfo.glow}`
    }}>
      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(99, 102, 241, 0.06) 100%)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
        padding: isMobile ? '14px 18px' : '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={18} color="#A5B4FC" />
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(167, 139, 250, 0.7)', letterSpacing: '0.12em' }}>ADVANCED ANALYTICS</div>
            <div style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '800', color: 'white' }}>Matchup Intelligence</div>
          </div>
        </div>
        <button
          onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', cursor: 'pointer'
          }}
        >
          <ArrowRightLeft size={13} color="#A5B4FC" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#C7D2FE' }}>FLIP</span>
        </button>
      </div>

      {/* RANKINGS */}
      <div style={{ padding: isMobile ? '20px 18px 0' : '24px 28px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)',
          borderRadius: '14px', padding: '16px 20px', border: '1px solid rgba(139, 92, 246, 0.15)',
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: '6px' }}>{offTeamName.toUpperCase()}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>#{offTeam.adjOff_rank || '—'}</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                <div>OFFENSE</div>
                <div style={{ color: offTier.color }}>{getPercentile(offTeam.adjOff_rank || 182)}th %ile</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)' }}>
            <span style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>VS</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: '6px' }}>{defTeamName.toUpperCase()}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>#{defTeam.adjDef_rank || '—'}</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                <div>DEFENSE</div>
                <div style={{ color: defTier.color }}>{getPercentile(defTeam.adjDef_rank || 182)}th %ile</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDGE SCORE */}
      <div style={{ padding: isMobile ? '28px 20px' : '36px 32px', background: `radial-gradient(ellipse at center, ${edgeInfo.glow}10 0%, transparent 70%)`, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: isMobile ? '150px' : '170px', height: isMobile ? '150px' : '170px', margin: '0 auto 20px' }}>
          <svg width="100%" height="100%" viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="85" cy="85" r="72" fill="none" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="10" />
            <circle cx="85" cy="85" r="72" fill="none" stroke={edgeInfo.color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${animated ? edgeScore * 4.52 : 0} 452`}
              style={{ filter: `drop-shadow(0 0 8px ${edgeInfo.glow})`, transition: 'stroke-dasharray 1.2s ease-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: isMobile ? '36px' : '44px', fontWeight: '900', color: edgeInfo.color, fontFamily: 'ui-monospace, monospace', lineHeight: 1, textShadow: `0 0 25px ${edgeInfo.glow}` }}>
              {animated ? edgeScore : 50}
            </div>
            <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>EDGE SCORE</div>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '100px', background: `${edgeInfo.color}15`, border: `1.5px solid ${edgeInfo.color}40`, marginBottom: '12px' }}>
          <span style={{ fontSize: '14px' }}>{narrative.icon}</span>
          <span style={{ fontSize: '12px', fontWeight: '800', color: edgeInfo.color, letterSpacing: '0.06em' }}>{edgeInfo.label}</span>
        </div>
        <div style={{ fontSize: isMobile ? '12px' : '13px', color: 'rgba(255,255,255,0.6)', maxWidth: '320px', margin: '0 auto', lineHeight: 1.5 }}>{edgeInfo.desc}</div>
      </div>

      {/* EFFICIENCY BREAKDOWN */}
      <div style={{ padding: isMobile ? '0 18px 24px' : '0 28px 28px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', borderRadius: '16px', border: '1px solid rgba(71, 85, 105, 0.2)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: isMobile ? '16px' : '20px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(71, 85, 105, 0.15)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#3B82F6', letterSpacing: '0.08em', marginBottom: '4px' }}>OFFENSE</div>
              <div style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>{offTeamName}</div>
              <div style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: '6px', background: offTier.bg, border: `1px solid ${offTier.color}30` }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: offTier.color }}>{offTier.tier}</span>
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="#A5B4FC" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#EF4444', letterSpacing: '0.08em', marginBottom: '4px' }}>DEFENSE</div>
              <div style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>{defTeamName}</div>
              <div style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: '6px', background: defTier.bg, border: `1px solid ${defTier.color}30` }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: defTier.color }}>{defTier.tier}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: isMobile ? '20px 16px' : '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '30px' : '38px', fontWeight: '900', color: '#3B82F6', fontFamily: 'ui-monospace, monospace', lineHeight: 1 }}>{offTeam.adjOff.toFixed(1)}</div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>PTS PER 100</div>
                <div style={{ marginTop: '6px', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', background: offVsAvg >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: offVsAvg >= 0 ? '#10B981' : '#EF4444' }}>{offVsAvg >= 0 ? '+' : ''}{offVsAvg.toFixed(1)} vs avg</span>
                </div>
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: offenseEdge > 0 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.04) 100%)', border: `1px solid ${offenseEdge > 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}` }}>
                <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '900', color: offenseEdge > 0 ? '#10B981' : '#EF4444', fontFamily: 'ui-monospace, monospace' }}>{offenseEdge > 0 ? '+' : ''}{offenseEdge.toFixed(1)}</div>
                <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>O EDGE</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '30px' : '38px', fontWeight: '900', color: '#EF4444', fontFamily: 'ui-monospace, monospace', lineHeight: 1 }}>{defTeam.adjDef.toFixed(1)}</div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: '4px' }}>ALLOWS/100</div>
                <div style={{ marginTop: '6px', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', background: defVsAvg <= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: defVsAvg <= 0 ? '#10B981' : '#EF4444' }}>{defVsAvg > 0 ? `+${defVsAvg.toFixed(1)} (weak)` : `${defVsAvg.toFixed(1)} (strong)`}</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={13} color="#A5B4FC" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{narrative.text}</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOUR FACTORS */}
      <div style={{ padding: isMobile ? '0 18px 24px' : '0 28px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <BarChart3 size={16} color="#A5B4FC" />
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(167, 139, 250, 0.8)', letterSpacing: '0.1em' }}>THE FOUR FACTORS</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(167, 139, 250, 0.2)' }} />
          <span style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>{advantageCount}/4 favor offense</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
          {fourFactors.map((factor) => {
            const favorsOffense = factor.key === 'turnovers' ? factor.edge < 0 : factor.edge > 0;
            const displayEdge = factor.key === 'turnovers' ? -factor.edge : factor.edge;
            const insight = factor.getInsight(factor.edge, factor.offIsGood, factor.defIsGoodD);

            return (
              <div key={factor.key} style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '14px', padding: '16px', border: `1px solid ${favorsOffense ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{factor.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>{factor.label}</span>
                  </div>
                  <div style={{ padding: '3px 8px', borderRadius: '6px', background: favorsOffense ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: favorsOffense ? '#10B981' : '#EF4444' }}>{displayEdge > 0 ? '+' : ''}{displayEdge.toFixed(1)}%</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(59, 130, 246, 0.8)' }}>{offTeamName} {factor.offLabel}</span>
                        {factor.offIsGood && <span style={{ fontSize: '8px', padding: '1px 4px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>✓</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>avg {factor.avg}%</span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>{factor.offValue.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: `${Math.min((factor.avg / 60) * 100, 100)}%`, top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.3)', zIndex: 1 }} />
                      <div style={{ height: '100%', width: `${Math.min((factor.offValue / 60) * 100, 100)}%`, background: 'linear-gradient(90deg, #3B82F6, #2563EB)', borderRadius: '100px' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(239, 68, 68, 0.8)' }}>{defTeamName} {factor.defLabel}</span>
                        {factor.defIsGoodD && <span style={{ fontSize: '8px', padding: '1px 4px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>🛡️</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>avg {factor.avg}%</span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>{factor.defValue.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: `${Math.min((factor.avg / 60) * 100, 100)}%`, top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.3)', zIndex: 1 }} />
                      <div style={{ height: '100%', width: `${Math.min((factor.defValue / 60) * 100, 100)}%`, background: 'linear-gradient(90deg, #EF4444, #DC2626)', borderRadius: '100px' }} />
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', lineHeight: 1.4, paddingTop: '10px', borderTop: '1px solid rgba(71, 85, 105, 0.15)' }}>{insight}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SHOT PROFILE - Enhanced with Defense & Narrative */}
      <div style={{ padding: isMobile ? '0 18px 24px' : '0 28px 28px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.04) 0%, rgba(245, 158, 11, 0.02) 100%)',
          borderRadius: '14px', padding: '18px', border: '1px solid rgba(251, 191, 36, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Target size={14} color="#FBB936" />
            <span style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(251, 191, 36, 0.8)', letterSpacing: '0.08em' }}>SHOT PROFILE MATCHUP</span>
          </div>

          {/* 2-Point Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>2-Point Shooting</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: twoPt.edge > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: twoPt.edge > 0 ? '#10B981' : '#EF4444' }}>
                  {twoPt.edge > 0 ? '+' : ''}{twoPt.edge.toFixed(1)}% edge
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
              {/* Offense */}
              <div style={{ background: 'rgba(59, 130, 246, 0.08)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(59, 130, 246, 0.8)', marginBottom: '6px' }}>{offTeamName} SHOOTS</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: twoPt.offVsAvg > 0 ? '#10B981' : twoPt.offVsAvg > -2 ? '#F59E0B' : '#EF4444', fontFamily: 'ui-monospace, monospace' }}>{twoPt.off.toFixed(1)}%</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: twoPt.offVsAvg > 0 ? '#10B981' : '#EF4444' }}>({twoPt.offVsAvg > 0 ? '+' : ''}{twoPt.offVsAvg.toFixed(1)})</span>
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>D1 avg: {D1_AVERAGES.twoP}%</div>
              </div>
              {/* Defense */}
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(239, 68, 68, 0.8)', marginBottom: '6px' }}>{defTeamName} ALLOWS</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: twoPt.defVsAvg > 0 ? '#EF4444' : twoPt.defVsAvg > -2 ? '#F59E0B' : '#10B981', fontFamily: 'ui-monospace, monospace' }}>{twoPt.def.toFixed(1)}%</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: twoPt.defVsAvg > 0 ? '#EF4444' : '#10B981' }}>({twoPt.defVsAvg > 0 ? '+' : ''}{twoPt.defVsAvg.toFixed(1)})</span>
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>D1 avg: {D1_AVERAGES.twoP}%</div>
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: `${twoPtNarrative.color}10`, border: `1px solid ${twoPtNarrative.color}25` }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: twoPtNarrative.color }}>{twoPtNarrative.text}</span>
            </div>
          </div>

          {/* 3-Point Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>3-Point Shooting</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: threePt.edge > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: threePt.edge > 0 ? '#10B981' : '#EF4444' }}>
                  {threePt.edge > 0 ? '+' : ''}{threePt.edge.toFixed(1)}% edge
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
              {/* Offense */}
              <div style={{ background: 'rgba(59, 130, 246, 0.08)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(59, 130, 246, 0.8)', marginBottom: '6px' }}>{offTeamName} SHOOTS</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: threePt.offVsAvg > 0 ? '#10B981' : threePt.offVsAvg > -2 ? '#F59E0B' : '#EF4444', fontFamily: 'ui-monospace, monospace' }}>{threePt.off.toFixed(1)}%</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: threePt.offVsAvg > 0 ? '#10B981' : '#EF4444' }}>({threePt.offVsAvg > 0 ? '+' : ''}{threePt.offVsAvg.toFixed(1)})</span>
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>D1 avg: {D1_AVERAGES.threeP}%</div>
              </div>
              {/* Defense */}
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(239, 68, 68, 0.8)', marginBottom: '6px' }}>{defTeamName} ALLOWS</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: threePt.defVsAvg > 0 ? '#EF4444' : threePt.defVsAvg > -2 ? '#F59E0B' : '#10B981', fontFamily: 'ui-monospace, monospace' }}>{threePt.def.toFixed(1)}%</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: threePt.defVsAvg > 0 ? '#EF4444' : '#10B981' }}>({threePt.defVsAvg > 0 ? '+' : ''}{threePt.defVsAvg.toFixed(1)})</span>
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>D1 avg: {D1_AVERAGES.threeP}%</div>
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: `${threePtNarrative.color}10`, border: `1px solid ${threePtNarrative.color}25` }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: threePtNarrative.color }}>{threePtNarrative.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BETTING EDGE MATCHUP - BATTLE BARS */}
      {(away.bartholomew_rank || away.adjTempo || barttorvik.matchup?.expectedTempo) && (
        <div style={{ padding: isMobile ? '0 18px 20px' : '0 28px 24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.04) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            overflow: 'hidden'
          }}>
            {/* Header - Collapsible */}
            <button
              onClick={() => setBettingEdgeExpanded(!bettingEdgeExpanded)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)',
                border: 'none',
                borderBottom: bettingEdgeExpanded ? '1px solid rgba(99, 102, 241, 0.1)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '20px' }}>⚔️</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'white', letterSpacing: '0.02em' }}>MATCHUP BREAKDOWN</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Head-to-head betting edges</div>
                </div>
              </div>
              {bettingEdgeExpanded ? <ChevronUp size={18} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={18} color="rgba(255,255,255,0.4)" />}
            </button>

            {/* Content - Battle Bars */}
            {bettingEdgeExpanded && (
              <div style={{ padding: isMobile ? '16px' : '20px' }}>
                
                {/* Team Headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', marginBottom: '16px', padding: '0 4px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#3B82F6', textAlign: 'left' }}>{awayTeam.toUpperCase()}</div>
                  <div style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.3)' }}>VS</div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#EF4444', textAlign: 'right' }}>{homeTeam.toUpperCase()}</div>
                </div>

                {/* Battle Bar Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* TEMPO ROW */}
                  {(() => {
                    const awayTempo = away.adjTempo || 67;
                    const homeTempo = home.adjTempo || 67;
                    const expectedTempo = (awayTempo + homeTempo) / 2;
                    const tempoWinner = awayTempo > homeTempo ? 'away' : awayTempo < homeTempo ? 'home' : 'even';
                    const paceLabel = expectedTempo >= 70 ? 'Fast-paced game' : expectedTempo >= 66 ? 'Moderate tempo expected' : 'Slow grind expected';
                    const awayPct = Math.min((awayTempo - 60) / 20 * 100, 100);
                    const homePct = Math.min((homeTempo - 60) / 20 * 100, 100);
                    
                    return (
                      <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>🏃</span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'white' }}>TEMPO</span>
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>(Pace Control)</span>
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: '700', color: tempoWinner === 'away' ? '#3B82F6' : tempoWinner === 'home' ? '#EF4444' : '#94A3B8' }}>
                            {tempoWinner === 'even' ? 'EVEN' : tempoWinner === 'away' ? `${awayTeam} ✓` : `${homeTeam} ✓`}
                          </div>
                        </div>
                        
                        {/* Battle Bars */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 8px 1fr', gap: '4px', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#3B82F6', fontFamily: 'ui-monospace, monospace', minWidth: '36px' }}>{awayTempo.toFixed(1)}</span>
                            <div style={{ flex: 1, height: '8px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
                              <div style={{ width: `${awayPct}%`, height: '100%', background: 'linear-gradient(90deg, #1E40AF, #3B82F6)', borderRadius: '4px' }} />
                            </div>
                          </div>
                          <div style={{ width: '8px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '8px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${homePct}%`, height: '100%', background: 'linear-gradient(90deg, #EF4444, #B91C1C)', borderRadius: '4px' }} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#EF4444', fontFamily: 'ui-monospace, monospace', minWidth: '36px', textAlign: 'right' }}>{homeTempo.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                          → {paceLabel} (~{expectedTempo.toFixed(0)} possessions)
                        </div>
                      </div>
                    );
                  })()}

                  {/* POWER RATING ROW */}
                  {(() => {
                    // Use ranks for power rating (lower is better)
                    const awayRank = away.bartholomew_rank || away.rank || 182;
                    const homeRank = home.bartholomew_rank || home.rank || 182;
                    const rankDiff = homeRank - awayRank; // Positive = away is better
                    const powerWinner = Math.abs(rankDiff) < 15 ? 'even' : rankDiff > 0 ? 'away' : 'home';
                    // Convert rank to percentile for bar display (lower rank = higher percentile)
                    const awayPct = Math.max(5, (1 - (awayRank - 1) / (TOTAL_TEAMS - 1)) * 100);
                    const homePct = Math.max(5, (1 - (homeRank - 1) / (TOTAL_TEAMS - 1)) * 100);
                    
                    const getTierLabel = (rank: number) => {
                      if (rank <= 25) return 'ELITE';
                      if (rank <= 50) return 'EXCELLENT';
                      if (rank <= 100) return 'STRONG';
                      if (rank <= 175) return 'AVERAGE';
                      if (rank <= 275) return 'BELOW AVG';
                      return 'WEAK';
                    };
                    
                    const insight = Math.abs(rankDiff) > 75 
                      ? `${powerWinner === 'away' ? awayTeam : homeTeam} is a clear class above (${Math.abs(rankDiff)} spots)`
                      : Math.abs(rankDiff) > 40 
                        ? `${powerWinner === 'away' ? awayTeam : homeTeam} has quality advantage`
                        : 'Evenly matched in overall quality';
                    
                    return (
                      <div style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(245, 158, 11, 0.04) 100%)', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(251, 191, 36, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>🏆</span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'white' }}>POWER RATING</span>
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>(National Rank)</span>
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: '700', color: powerWinner === 'away' ? '#3B82F6' : powerWinner === 'home' ? '#EF4444' : '#94A3B8' }}>
                            {powerWinner === 'even' ? 'EVEN' : powerWinner === 'away' ? `${awayTeam} ✓` : `${homeTeam} ✓`}
                          </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 8px 1fr', gap: '4px', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ minWidth: '48px', textAlign: 'left' }}>
                              <span style={{ fontSize: '16px', fontWeight: '900', color: '#3B82F6', fontFamily: 'ui-monospace, monospace' }}>#{awayRank}</span>
                              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{getTierLabel(awayRank)}</div>
                            </div>
                            <div style={{ flex: 1, height: '8px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
                              <div style={{ width: `${awayPct}%`, height: '100%', background: 'linear-gradient(90deg, #1E40AF, #3B82F6)', borderRadius: '4px' }} />
                            </div>
                          </div>
                          <div style={{ width: '8px', height: '24px', background: 'rgba(251, 191, 36, 0.2)', borderRadius: '2px' }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '8px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${homePct}%`, height: '100%', background: 'linear-gradient(90deg, #EF4444, #B91C1C)', borderRadius: '4px' }} />
                            </div>
                            <div style={{ minWidth: '48px', textAlign: 'right' }}>
                              <span style={{ fontSize: '16px', fontWeight: '900', color: '#EF4444', fontFamily: 'ui-monospace, monospace' }}>#{homeRank}</span>
                              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{getTierLabel(homeRank)}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                          → {insight}
                        </div>
                      </div>
                    );
                  })()}

                  {/* FREE THROW RATE ROW */}
                  {(() => {
                    const awayFT = away.ftRate_off || 35;
                    const homeFT = home.ftRate_off || 35;
                    const ftWinner = Math.abs(awayFT - homeFT) < 2 ? 'even' : awayFT > homeFT ? 'away' : 'home';
                    const awayPct = Math.min((awayFT / 50) * 100, 100);
                    const homePct = Math.min((homeFT / 50) * 100, 100);
                    const winner = ftWinner === 'away' ? awayTeam : homeTeam;
                    const insight = ftWinner === 'even' 
                      ? 'Similar free throw rates — no edge'
                      : `${winner} attacks paint more → advantage in close games`;
                    
                    return (
                      <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>🎟️</span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'white' }}>FREE THROW RATE</span>
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>(Paint Attack)</span>
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: '700', color: ftWinner === 'away' ? '#3B82F6' : ftWinner === 'home' ? '#EF4444' : '#94A3B8' }}>
                            {ftWinner === 'even' ? 'EVEN' : ftWinner === 'away' ? `${awayTeam} ✓` : `${homeTeam} ✓`}
                          </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 8px 1fr', gap: '4px', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#3B82F6', fontFamily: 'ui-monospace, monospace', minWidth: '36px' }}>{awayFT.toFixed(1)}</span>
                            <div style={{ flex: 1, height: '8px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
                              <div style={{ width: `${awayPct}%`, height: '100%', background: 'linear-gradient(90deg, #1E40AF, #3B82F6)', borderRadius: '4px' }} />
                            </div>
                          </div>
                          <div style={{ width: '8px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '8px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${homePct}%`, height: '100%', background: 'linear-gradient(90deg, #EF4444, #B91C1C)', borderRadius: '4px' }} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#EF4444', fontFamily: 'ui-monospace, monospace', minWidth: '36px', textAlign: 'right' }}>{homeFT.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                          → {insight}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3PT RELIANCE ROW */}
                  {(() => {
                    const away3PR = away.threeP_rate_off || 40;
                    const home3PR = home.threeP_rate_off || 40;
                    const higher3PR = away3PR > home3PR ? 'away' : 'home';
                    const higherTeam = higher3PR === 'away' ? awayTeam : homeTeam;
                    const max3PR = Math.max(away3PR, home3PR);
                    const awayPct = Math.min((away3PR / 55) * 100, 100);
                    const homePct = Math.min((home3PR / 55) * 100, 100);
                    
                    const volatilityLevel = max3PR >= 45 ? 'HIGH' : max3PR >= 38 ? 'MODERATE' : 'LOW';
                    const volColor = max3PR >= 45 ? '#EF4444' : max3PR >= 38 ? '#F59E0B' : '#10B981';
                    const insight = max3PR >= 45 
                      ? `${higherTeam} lives by the 3 = HIGH VARIANCE`
                      : max3PR >= 38 
                        ? 'Balanced approach — moderate variance'
                        : 'Interior-focused teams — more predictable';
                    
                    return (
                      <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>🎲</span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'white' }}>3PT RELIANCE</span>
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>(Variance Factor)</span>
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: `${volColor}20`, color: volColor }}>
                            {volatilityLevel} VAR
                          </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 8px 1fr', gap: '4px', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#3B82F6', fontFamily: 'ui-monospace, monospace', minWidth: '36px' }}>{away3PR.toFixed(0)}%</span>
                            <div style={{ flex: 1, height: '8px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
                              <div style={{ width: `${awayPct}%`, height: '100%', background: 'linear-gradient(90deg, #1E40AF, #3B82F6)', borderRadius: '4px' }} />
                            </div>
                          </div>
                          <div style={{ width: '8px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '8px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${homePct}%`, height: '100%', background: 'linear-gradient(90deg, #EF4444, #B91C1C)', borderRadius: '4px' }} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#EF4444', fontFamily: 'ui-monospace, monospace', minWidth: '36px', textAlign: 'right' }}>{home3PR.toFixed(0)}%</span>
                          </div>
                        </div>
                        
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                          → {insight}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Betting Takeaway */}
                {(() => {
                  // Use ranks for power comparison (lower rank = better team)
                  const awayRank = away.bartholomew_rank || away.rank || 182;
                  const homeRank = home.bartholomew_rank || home.rank || 182;
                  const rankDiff = homeRank - awayRank; // Positive = away is better
                  const awayFT = away.ftRate_off || 35;
                  const homeFT = home.ftRate_off || 35;
                  const max3PR = Math.max(away.threeP_rate_off || 40, home.threeP_rate_off || 40);
                  
                  // Power winner determined by significant rank difference
                  const powerWinner = Math.abs(rankDiff) > 40 ? (rankDiff > 0 ? awayTeam : homeTeam) : null;
                  const ftWinner = Math.abs(awayFT - homeFT) > 3 ? (awayFT > homeFT ? awayTeam : homeTeam) : null;
                  const highVariance = max3PR >= 45;
                  
                  let takeaway = '';
                  if (powerWinner && ftWinner && powerWinner === ftWinner) {
                    takeaway = `${powerWinner} is ranked significantly higher AND gets to the line more.${highVariance ? ' However, high 3PT reliance creates variance—spread carries risk.' : ' Strong dual-edge.'}`;
                  } else if (powerWinner) {
                    const betterRank = rankDiff > 0 ? awayRank : homeRank;
                    const worseRank = rankDiff > 0 ? homeRank : awayRank;
                    takeaway = `${powerWinner} (#${betterRank}) has a ${Math.abs(rankDiff)}-spot edge over #${worseRank}.${highVariance ? ' 3PT reliance adds variance—factor into sizing.' : ''}`;
                  } else if (highVariance) {
                    takeaway = 'Evenly ranked teams with high 3PT reliance = volatile outcome. Spread carries significant risk.';
                  } else {
                    takeaway = 'Similar power ratings with predictable styles. Look for line value.';
                  }
                  
                  return (
                    <div style={{
                      marginTop: '16px',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ fontSize: '18px', lineHeight: 1 }}>🎯</div>
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: '800', color: '#10B981', letterSpacing: '0.06em', marginBottom: '6px' }}>BETTING TAKEAWAY</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                            {takeaway}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(71, 85, 105, 0.12)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6366F1' }} />
        <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>SAVANT ANALYTICS ENGINE</span>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;
