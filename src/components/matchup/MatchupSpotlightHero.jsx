/**
 * Matchup Spotlight Hero - Key Matchup Advantage
 * Highlights the SINGLE MOST IMPORTANT matchup advantage/mismatch
 * Designed for shareability and immediate impact
 */

import { Target, TrendingUp, TrendingDown, Shield, Zap } from 'lucide-react';
import { calculatePercentileRank } from '../../utils/matchupCalculations';

export default function MatchupSpotlightHero({ awayTeam, homeTeam, matchupData, dataProcessor }) {
  if (!matchupData || !dataProcessor) return null;

  // Identify the biggest mismatch by comparing all key metrics
  const mismatches = [];

  // 1. Offense vs Defense
  const awayOffenseRank = calculatePercentileRank(dataProcessor, awayTeam.code, 'xGoalsFor', '5on5', true);
  const homeDefenseRank = calculatePercentileRank(dataProcessor, homeTeam.code, 'xGoalsAgainst', '5on5', false);
  
  if (awayOffenseRank && homeDefenseRank) {
    const offenseVsDefenseGap = awayOffenseRank.percentile - homeDefenseRank.percentile;
    mismatches.push({
      type: 'offense-defense',
      attacker: awayTeam.code,
      defender: homeTeam.code,
      gap: offenseVsDefenseGap,
      attackerStat: matchupData.away.stats5v5.xGF_per60 || 0,
      defenderStat: matchupData.home.stats5v5.xGA_per60 || 0,
      attackerRank: awayOffenseRank,
      defenderRank: homeDefenseRank,
      label: `${awayTeam.code} Offense vs ${homeTeam.code} Defense`
    });
  }

  // 2. Home Offense vs Away Defense
  const homeOffenseRank = calculatePercentileRank(dataProcessor, homeTeam.code, 'xGoalsFor', '5on5', true);
  const awayDefenseRank = calculatePercentileRank(dataProcessor, awayTeam.code, 'xGoalsAgainst', '5on5', false);
  
  if (homeOffenseRank && awayDefenseRank) {
    const offenseVsDefenseGap = homeOffenseRank.percentile - awayDefenseRank.percentile;
    mismatches.push({
      type: 'offense-defense',
      attacker: homeTeam.code,
      defender: awayTeam.code,
      gap: offenseVsDefenseGap,
      attackerStat: matchupData.home.stats5v5.xGF_per60 || 0,
      defenderStat: matchupData.away.stats5v5.xGA_per60 || 0,
      attackerRank: homeOffenseRank,
      defenderRank: awayDefenseRank,
      label: `${homeTeam.code} Offense vs ${awayTeam.code} Defense`
    });
  }

  // 3. Power Play vs Penalty Kill (if available)
  if (matchupData.away.powerPlay && matchupData.home.penaltyKill) {
    const awayPPRank = calculatePercentileRank(dataProcessor, awayTeam.code, 'xGoalsPercentage', '5on4', true);
    const homePKRank = calculatePercentileRank(dataProcessor, homeTeam.code, 'xGoalsPercentage', '4on5', true);
    
    if (awayPPRank && homePKRank) {
      const ppVsPkGap = awayPPRank.percentile - (100 - homePKRank.percentile);
      mismatches.push({
        type: 'special-teams',
        attacker: awayTeam.code,
        defender: homeTeam.code,
        gap: ppVsPkGap,
        attackerStat: (matchupData.away.powerPlay.percentage * 100).toFixed(1),
        defenderStat: (matchupData.home.penaltyKill.percentage * 100).toFixed(1),
        attackerRank: awayPPRank,
        defenderRank: { ...homePKRank, percentile: 100 - homePKRank.percentile },
        label: `${awayTeam.code} Power Play vs ${homeTeam.code} Penalty Kill`,
        unit: '%'
      });
    }
  }

  // 4. Home Power Play vs Away Penalty Kill
  if (matchupData.home.powerPlay && matchupData.away.penaltyKill) {
    const homePPRank = calculatePercentileRank(dataProcessor, homeTeam.code, 'xGoalsPercentage', '5on4', true);
    const awayPKRank = calculatePercentileRank(dataProcessor, awayTeam.code, 'xGoalsPercentage', '4on5', true);
    
    if (homePPRank && awayPKRank) {
      const ppVsPkGap = homePPRank.percentile - (100 - awayPKRank.percentile);
      mismatches.push({
        type: 'special-teams',
        attacker: homeTeam.code,
        defender: awayTeam.code,
        gap: ppVsPkGap,
        attackerStat: (matchupData.home.powerPlay.percentage * 100).toFixed(1),
        defenderStat: (matchupData.away.penaltyKill.percentage * 100).toFixed(1),
        attackerRank: homePPRank,
        defenderRank: { ...awayPKRank, percentile: 100 - awayPKRank.percentile },
        label: `${homeTeam.code} Power Play vs ${awayTeam.code} Penalty Kill`,
        unit: '%'
      });
    }
  }

  // Find the biggest mismatch
  const biggestMismatch = mismatches.reduce((max, current) => 
    Math.abs(current.gap) > Math.abs(max.gap) ? current : max
  , mismatches[0]);

  if (!biggestMismatch) return null;

  const isPositiveGap = biggestMismatch.gap > 0;
  const gapMagnitude = Math.abs(biggestMismatch.gap);
  
  // Generate contextual insight based on mismatch
  let insight = '';
  if (biggestMismatch.type === 'offense-defense') {
    if (gapMagnitude > 30) {
      insight = `${biggestMismatch.attacker}'s elite offense faces ${biggestMismatch.defender}'s vulnerable defense - a major mismatch.`;
    } else if (gapMagnitude > 15) {
      insight = `${biggestMismatch.attacker} has a notable advantage attacking ${biggestMismatch.defender}'s weaker defensive zone.`;
    } else {
      insight = `${biggestMismatch.attacker}'s attack holds a slight edge against ${biggestMismatch.defender}'s defense.`;
    }
  } else if (biggestMismatch.type === 'special-teams') {
    if (gapMagnitude > 30) {
      insight = `${biggestMismatch.attacker}'s power play should dominate ${biggestMismatch.defender}'s penalty kill - exploit every man advantage.`;
    } else if (gapMagnitude > 15) {
      insight = `${biggestMismatch.attacker} has a solid special teams advantage to capitalize on.`;
    } else {
      insight = `${biggestMismatch.attacker} holds a slight special teams edge.`;
    }
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Section Header */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <Target size={24} color="#10B981" />
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          Key Matchup Spotlight
        </h2>
      </div>

      {/* Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '2px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(16, 185, 129, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glowing top accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #10B981, #059669)',
          boxShadow: '0 2px 20px rgba(16, 185, 129, 0.5)'
        }} />

        {/* Matchup Label */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: '800',
          color: '#10B981',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '2rem'
        }}>
          {biggestMismatch.label}
        </div>

        {/* Main Comparison */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '2rem',
          alignItems: 'center',
          marginBottom: '2.5rem'
        }}>
          {/* Attacker Side */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#64748B',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              {biggestMismatch.type === 'offense-defense' ? 'Offense' : 'Power Play'}
            </div>
            
            {/* Team Code */}
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#10B981',
              marginBottom: '0.5rem'
            }}>
              {biggestMismatch.attacker}
            </div>

            {/* Stat */}
            <div style={{
              fontSize: '3rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <TrendingUp size={32} color="#10B981" />
              {biggestMismatch.attackerStat}{biggestMismatch.unit || ''}
            </div>

            {/* Percentile Badge */}
            <div style={{
              display: 'inline-block',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#10B981'
            }}>
              {biggestMismatch.attackerRank.percentile.toFixed(0)}th Percentile
            </div>
            
            {/* Tier */}
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#10B981'
            }}>
              {biggestMismatch.attackerRank.tier}
            </div>
          </div>

          {/* VS Divider */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              color: '#94A3B8'
            }}>
              VS
            </div>
            <Zap size={32} color="#F59E0B" style={{ animation: 'pulse 2s infinite' }} />
          </div>

          {/* Defender Side */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#64748B',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              {biggestMismatch.type === 'offense-defense' ? 'Defense' : 'Penalty Kill'}
            </div>
            
            {/* Team Code */}
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#EF4444',
              marginBottom: '0.5rem'
            }}>
              {biggestMismatch.defender}
            </div>

            {/* Stat */}
            <div style={{
              fontSize: '3rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <TrendingDown size={32} color="#EF4444" />
              {biggestMismatch.defenderStat}{biggestMismatch.unit || ''}
            </div>

            {/* Percentile Badge */}
            <div style={{
              display: 'inline-block',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#EF4444'
            }}>
              {biggestMismatch.defenderRank.percentile.toFixed(0)}th Percentile
            </div>
            
            {/* Tier */}
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#EF4444'
            }}>
              {biggestMismatch.defenderRank.tier}
            </div>
          </div>
        </div>

        {/* Visual Gap Indicator */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#94A3B8'
            }}>
              Advantage Gap
            </span>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              color: '#10B981'
            }}>
              {gapMagnitude.toFixed(0)} Percentile Points
            </span>
          </div>
          
          {/* Visual Bar */}
          <div style={{
            height: '12px',
            background: 'rgba(71, 85, 105, 0.3)',
            borderRadius: '6px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${Math.min(gapMagnitude, 100)}%`,
              background: 'linear-gradient(90deg, #10B981, #059669)',
              borderRadius: '6px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
              transition: 'width 1s ease'
            }} />
          </div>
        </div>

        {/* The Edge */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            <Shield size={20} color="#10B981" />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '800',
              color: '#10B981',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              The Edge
            </span>
          </div>
          <div style={{
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: '#F1F5F9',
            fontWeight: '600'
          }}>
            {insight}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .matchup-spotlight-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

