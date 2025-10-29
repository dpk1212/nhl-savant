/**
 * Matchup Tiles - Visual dominance display
 * Side-by-side comparisons with large percentile indicators
 * Replaces Battle Bars with clearer visual hierarchy
 */

import { Target, Shield, Zap, Activity } from 'lucide-react';
import { calculatePercentileRank } from '../../utils/matchupCalculations';

export default function MatchupTiles({ awayTeam, homeTeam, matchupData, dataProcessor }) {
  if (!matchupData || !dataProcessor) return null;

  const awayStats5v5 = matchupData.away.stats5v5;
  const homeStats5v5 = matchupData.home.stats5v5;
  
  // Calculate per-60 rates
  const awayIceTime60 = (awayStats5v5?.iceTime || 1) / 60;
  const homeIceTime60 = (homeStats5v5?.iceTime || 1) / 60;

  const tiles = [];

  // Calculate all stats
  const awayXGF = (awayStats5v5?.xGoalsFor || 0) / awayIceTime60;
  const homeXGF = (homeStats5v5?.xGoalsFor || 0) / homeIceTime60;
  const awayXGA = (awayStats5v5?.xGoalsAgainst || 0) / awayIceTime60;
  const homeXGA = (homeStats5v5?.xGoalsAgainst || 0) / homeIceTime60;

  const awayXGFRank = calculatePercentileRank(dataProcessor, awayTeam.code, 'xGoalsFor', '5on5', true);
  const homeXGFRank = calculatePercentileRank(dataProcessor, homeTeam.code, 'xGoalsFor', '5on5', true);
  const awayXGARank = calculatePercentileRank(dataProcessor, awayTeam.code, 'xGoalsAgainst', '5on5', false);
  const homeXGARank = calculatePercentileRank(dataProcessor, homeTeam.code, 'xGoalsAgainst', '5on5', false);

  // 1. OFFENSIVE FIREPOWER - Who scores more
  tiles.push({
    title: 'OFFENSIVE FIREPOWER',
    icon: Target,
    color: '#10B981',
    away: {
      label: `${awayTeam.code}`,
      value: awayXGF.toFixed(2),
      unit: 'xGF/60',
      percentile: awayXGFRank?.percentile || 50,
      tier: awayXGFRank?.tier || 'AVG'
    },
    home: {
      label: `${homeTeam.code}`,
      value: homeXGF.toFixed(2),
      unit: 'xGF/60',
      percentile: homeXGFRank?.percentile || 50,
      tier: homeXGFRank?.tier || 'AVG'
    },
    advantage: awayXGF > homeXGF * 1.1 ? 'away' : homeXGF > awayXGF * 1.1 ? 'home' : 'even',
    advantageText: awayXGF > homeXGF * 1.1 ? `${awayTeam.code} SCORING EDGE` : 
                   homeXGF > awayXGF * 1.1 ? `${homeTeam.code} SCORING EDGE` : 'EVEN MATCHUP'
  });

  // 2. DEFENSIVE STRENGTH - Who allows less (lower is better)
  tiles.push({
    title: 'DEFENSIVE STRENGTH',
    icon: Shield,
    color: '#3B82F6',
    away: {
      label: `${awayTeam.code}`,
      value: awayXGA.toFixed(2),
      unit: 'xGA/60',
      percentile: awayXGARank?.percentile || 50,
      tier: awayXGARank?.tier || 'AVG'
    },
    home: {
      label: `${homeTeam.code}`,
      value: homeXGA.toFixed(2),
      unit: 'xGA/60',
      percentile: homeXGARank?.percentile || 50,
      tier: homeXGARank?.tier || 'AVG'
    },
    advantage: awayXGA < homeXGA * 0.9 ? 'away' : homeXGA < awayXGA * 0.9 ? 'home' : 'even',
    advantageText: awayXGA < homeXGA * 0.9 ? `${awayTeam.code} DEFENSIVE EDGE` : 
                   homeXGA < awayXGA * 0.9 ? `${homeTeam.code} DEFENSIVE EDGE` : 'EVEN MATCHUP'
  });

  // 2. POWER PLAY vs PENALTY KILL
  if (matchupData.away.powerPlay && matchupData.home.penaltyKill) {
    const awayPP = matchupData.away.powerPlay.percentage || 0;
    const homePK = (1 - (matchupData.home.penaltyKill.percentage || 0)) * 100;
    const homePP = matchupData.home.powerPlay.percentage || 0;
    const awayPK = (1 - (matchupData.away.penaltyKill.percentage || 0)) * 100;

    tiles.push({
      title: 'SPECIAL TEAMS',
      icon: Zap,
      color: '#F59E0B',
      away: {
        label: `${awayTeam.code} PP`,
        value: (awayPP * 100).toFixed(1),
        unit: '%',
        percentile: awayPP * 300, // Rough conversion
        tier: awayPP > 0.25 ? 'ELITE' : awayPP > 0.20 ? 'STRONG' : 'AVG'
      },
      home: {
        label: `${homeTeam.code} PK`,
        value: ((matchupData.home.penaltyKill.percentage || 0) * 100).toFixed(1),
        unit: '%',
        percentile: (matchupData.home.penaltyKill.percentage || 0) * 120,
        tier: (matchupData.home.penaltyKill.percentage || 0) > 0.85 ? 'ELITE' : 
              (matchupData.home.penaltyKill.percentage || 0) > 0.80 ? 'STRONG' : 'AVG'
      },
      advantage: (awayPP * 100) > homePK + 5 ? 'away' : (awayPP * 100) < homePK - 5 ? 'home' : 'even',
      advantageText: (awayPP * 100) > homePK + 5 ? `${awayTeam.code} PP EDGE` : 
                     (awayPP * 100) < homePK - 5 ? `${homeTeam.code} PK EDGE` : 'EVEN MATCHUP'
    });
  }

  // 3. GOALTENDING
  if (matchupData.away.goalie && matchupData.home.goalie && 
      !matchupData.away.goalie.isDefault && !matchupData.home.goalie.isDefault) {
    const awaySV = (matchupData.away.goalie.savePct || 0.905) * 100;
    const homeSV = (matchupData.home.goalie.savePct || 0.905) * 100;
    const awayGSAX = matchupData.away.goalie.gsax || 0;
    const homeGSAX = matchupData.home.goalie.gsax || 0;

    tiles.push({
      title: 'GOALTENDING',
      icon: Shield,
      color: '#8B5CF6',
      away: {
        label: matchupData.away.goalie.name,
        value: awaySV.toFixed(1),
        unit: '% SV',
        percentile: (awaySV - 88) * 10, // Rough conversion
        tier: awaySV > 92 ? 'ELITE' : awaySV > 91 ? 'STRONG' : 'AVG',
        subtitle: `${awayGSAX > 0 ? '+' : ''}${awayGSAX.toFixed(1)} GSAX`
      },
      home: {
        label: matchupData.home.goalie.name,
        value: homeSV.toFixed(1),
        unit: '% SV',
        percentile: (homeSV - 88) * 10,
        tier: homeSV > 92 ? 'ELITE' : homeSV > 91 ? 'STRONG' : 'AVG',
        subtitle: `${homeGSAX > 0 ? '+' : ''}${homeGSAX.toFixed(1)} GSAX`
      },
      advantage: awaySV > homeSV + 1 ? 'away' : awaySV < homeSV - 1 ? 'home' : 'even',
      advantageText: awaySV > homeSV + 1 ? `${awayTeam.code} GOALIE EDGE` : 
                     awaySV < homeSV - 1 ? `${homeTeam.code} GOALIE EDGE` : 'EVEN MATCHUP'
    });
  }

  // 4. SHOT QUALITY
  const awayHD = (awayStats5v5?.highDangerShotsFor || 0) / awayIceTime60;
  const homeHD = (homeStats5v5?.highDangerShotsFor || 0) / homeIceTime60;
  
  const awayHDRank = calculatePercentileRank(dataProcessor, awayTeam.code, 'highDangerShotsFor', '5on5', true);
  const homeHDRank = calculatePercentileRank(dataProcessor, homeTeam.code, 'highDangerShotsFor', '5on5', true);

  tiles.push({
    title: 'SHOT QUALITY',
    icon: Activity,
    color: '#EC4899',
    away: {
      label: `${awayTeam.code} HD Shots`,
      value: awayHD.toFixed(2),
      unit: '/60',
      percentile: awayHDRank?.percentile || 50,
      tier: awayHDRank?.tier || 'AVG'
    },
    home: {
      label: `${homeTeam.code} HD Shots`,
      value: homeHD.toFixed(2),
      unit: '/60',
      percentile: homeHDRank?.percentile || 50,
      tier: homeHDRank?.tier || 'AVG'
    },
    advantage: awayHD > homeHD * 1.15 ? 'away' : homeHD > awayHD * 1.15 ? 'home' : 'even',
    advantageText: awayHD > homeHD * 1.15 ? `${awayTeam.code} QUALITY EDGE` : 
                   homeHD > awayHD * 1.15 ? `${homeTeam.code} QUALITY EDGE` : 'EVEN MATCHUP'
  });

  const getTierColor = (tier) => {
    switch (tier) {
      case 'ELITE': return '#10B981';
      case 'STRONG': return '#3B82F6';
      case 'ABOVE AVG': return '#8B5CF6';
      case 'AVG': case 'AVERAGE': return '#64748B';
      case 'BELOW AVG': return '#F59E0B';
      case 'WEAK': return '#EF4444';
      default: return '#64748B';
    }
  };

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{
        fontSize: '1.75rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1.5rem'
      }}>
        Key Matchup Advantages
      </h2>

      <div 
        className="matchup-tiles-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
      <style>{`
        @media (max-width: 768px) {
          .matchup-tiles-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            gap: 1rem !important;
          }
          
          .matchup-tile-mobile {
            padding: 1.25rem !important;
          }
          
          .matchup-tile-icon-mobile {
            width: 32px !important;
            height: 32px !important;
          }
          
          .matchup-tile-value-mobile {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
        {tiles.map((tile, index) => {
          const IconComponent = tile.icon;
          
          return (
            <div
              key={index}
              className="matchup-tile-mobile"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div 
                  className="matchup-tile-icon-mobile"
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${tile.color}20`,
                    borderRadius: '10px'
                  }}
                >
                  <IconComponent size={22} color={tile.color} strokeWidth={2.5} />
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {tile.title}
                </div>
              </div>

              {/* Comparison */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                gap: '1.5rem'
              }}>
                {/* Left Side */}
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748B',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                  }}>
                    {tile.away.label}
                  </div>
                  <div 
                    className="matchup-tile-value-mobile"
                    style={{
                      fontSize: '1.875rem',
                      fontWeight: '900',
                      color: '#F1F5F9',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {tile.away.value}
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#64748B',
                      marginLeft: '0.25rem'
                    }}>
                      {tile.away.unit}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: getTierColor(tile.away.tier),
                      background: `${getTierColor(tile.away.tier)}20`,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}>
                      {tile.away.percentile.toFixed(0)}%
                    </span>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: '600',
                      color: getTierColor(tile.away.tier)
                    }}>
                      {tile.away.tier}
                    </span>
                  </div>
                  {tile.away.subtitle && (
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#94A3B8',
                      marginTop: '0.25rem'
                    }}>
                      {tile.away.subtitle}
                    </div>
                  )}
                </div>

                {/* VS */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 0.5rem',
                  paddingTop: '1.5rem'
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#475569'
                  }}>
                    vs
                  </span>
                </div>

                {/* Right Side */}
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748B',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                  }}>
                    {tile.home.label}
                  </div>
                  <div 
                    className="matchup-tile-value-mobile"
                    style={{
                      fontSize: '1.875rem',
                      fontWeight: '900',
                      color: '#F1F5F9',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {tile.home.value}
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#64748B',
                      marginLeft: '0.25rem'
                    }}>
                      {tile.home.unit}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: '600',
                      color: getTierColor(tile.home.tier)
                    }}>
                      {tile.home.tier}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: getTierColor(tile.home.tier),
                      background: `${getTierColor(tile.home.tier)}20`,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}>
                      {tile.home.percentile.toFixed(0)}%
                    </span>
                  </div>
                  {tile.home.subtitle && (
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#94A3B8',
                      marginTop: '0.25rem'
                    }}>
                      {tile.home.subtitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Advantage Bar */}
              <div style={{
                padding: '0.75rem 1rem',
                background: tile.advantage === 'away' ? 'rgba(16, 185, 129, 0.1)' :
                           tile.advantage === 'home' ? 'rgba(59, 130, 246, 0.1)' :
                           'rgba(100, 116, 139, 0.1)',
                border: `1px solid ${
                  tile.advantage === 'away' ? 'rgba(16, 185, 129, 0.3)' :
                  tile.advantage === 'home' ? 'rgba(59, 130, 246, 0.3)' :
                  'rgba(100, 116, 139, 0.3)'
                }`,
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: tile.advantage === 'away' ? '#10B981' :
                         tile.advantage === 'home' ? '#3B82F6' :
                         '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {tile.advantageText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

