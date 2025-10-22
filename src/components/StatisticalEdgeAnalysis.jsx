/**
 * Statistical Edge Analysis - HERO COMPONENT
 * Showcases advanced analytics as the primary story, not the model prediction
 */

import { useState } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { VisualMetricsGenerator } from '../utils/visualMetricsGenerator';

const StatisticalEdgeAnalysis = ({ factors, awayTeam, homeTeam, story, totalImpact, isMobile }) => {
  const [expandedFactor, setExpandedFactor] = useState(null);

  if (!factors || factors.length === 0) {
    return null;
  }

  // Group factors by importance
  const criticalFactors = factors.filter(f => f.importance === 'CRITICAL');
  const highFactors = factors.filter(f => f.importance === 'HIGH');
  const moderateFactors = factors.filter(f => f.importance === 'MODERATE');

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%)',
      border: '1px solid rgba(212, 175, 55, 0.25)',
      borderRadius: '12px',
      padding: isMobile ? '1.25rem' : '1.75rem',
      marginBottom: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div>
          <h3 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            fontWeight: '800',
            color: 'var(--color-accent)',
            margin: 0,
            marginBottom: '0.375rem',
            letterSpacing: '-0.01em'
          }}>
            📊 WHY THIS BET HAS VALUE
          </h3>
          <p style={{
            fontSize: '0.813rem',
            color: 'var(--color-text-muted)',
            margin: 0,
            fontWeight: '500'
          }}>
            Statistical Advantages Driving Our Prediction
          </p>
        </div>
        
        {/* Total Impact Badge */}
        <TotalImpactBadge impact={totalImpact} isMobile={isMobile} />
      </div>

      {/* Critical Factors */}
      {criticalFactors.length > 0 && (
        <FactorGroup
          title="🔥 CRITICAL FACTORS"
          factors={criticalFactors}
          awayTeam={awayTeam}
          homeTeam={homeTeam}
          isMobile={isMobile}
          expandedFactor={expandedFactor}
          setExpandedFactor={setExpandedFactor}
        />
      )}

      {/* High Impact Factors */}
      {highFactors.length > 0 && (
        <FactorGroup
          title="🎯 HIGH IMPACT FACTORS"
          factors={highFactors}
          awayTeam={awayTeam}
          homeTeam={homeTeam}
          isMobile={isMobile}
          expandedFactor={expandedFactor}
          setExpandedFactor={setExpandedFactor}
        />
      )}

      {/* Moderate Factors */}
      {moderateFactors.length > 0 && (
        <FactorGroup
          title="⚡ MODERATE FACTORS"
          factors={moderateFactors}
          awayTeam={awayTeam}
          homeTeam={homeTeam}
          isMobile={isMobile}
          expandedFactor={expandedFactor}
          setExpandedFactor={setExpandedFactor}
        />
      )}

      {/* Total Statistical Edge */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem 1.25rem',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        border: '1px solid rgba(212, 175, 55, 0.3)'
      }}>
        <div style={{
          fontSize: '0.688rem',
          color: 'rgba(212, 175, 55, 0.7)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          TOTAL STATISTICAL EDGE
        </div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '900',
          color: VisualMetricsGenerator.getImpactColor(totalImpact, true),
          fontFeatureSettings: "'tnum'",
          letterSpacing: '-0.02em'
        }}>
          {VisualMetricsGenerator.formatGoalImpact(totalImpact)} goals vs market
        </div>
      </div>

      {/* The Story */}
      {story && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '0.688rem',
            color: 'rgba(59, 130, 246, 0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: '700',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            💡 THE STORY
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-primary)',
            lineHeight: '1.6',
            margin: 0,
            fontWeight: '500'
          }}>
            {story}
          </p>
        </div>
      )}
    </div>
  );
};

// Total Impact Badge Component
const TotalImpactBadge = ({ impact, isMobile }) => {
  const color = VisualMetricsGenerator.getImpactColor(impact, true);
  const magnitude = Math.abs(impact);
  let label = 'Neutral';
  
  if (magnitude > 0.5) label = 'Strong Edge';
  else if (magnitude > 0.2) label = 'Moderate Edge';
  else if (magnitude > 0) label = 'Mild Edge';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isMobile ? 'flex-end' : 'center',
      gap: '0.25rem'
    }}>
      <div style={{
        padding: '0.5rem 1rem',
        background: `${color}20`,
        border: `2px solid ${color}`,
        borderRadius: '8px',
        fontSize: isMobile ? '1.125rem' : '1.375rem',
        fontWeight: '900',
        color: color,
        fontFeatureSettings: "'tnum'",
        letterSpacing: '-0.02em',
        textAlign: 'center'
      }}>
        {VisualMetricsGenerator.formatGoalImpact(impact)}
      </div>
      <div style={{
        fontSize: '0.625rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--color-text-muted)'
      }}>
        {label}
      </div>
    </div>
  );
};

// Factor Group Component
const FactorGroup = ({ title, factors, awayTeam, homeTeam, isMobile, expandedFactor, setExpandedFactor }) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h4 style={{
        fontSize: '0.75rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--color-text-muted)',
        marginBottom: '1rem'
      }}>
        {title}
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {factors.map((factor, idx) => (
          <FactorCard
            key={idx}
            factor={factor}
            awayTeam={awayTeam}
            homeTeam={homeTeam}
            isMobile={isMobile}
            isExpanded={expandedFactor === `${factor.name}-${idx}`}
            onToggle={() => setExpandedFactor(
              expandedFactor === `${factor.name}-${idx}` ? null : `${factor.name}-${idx}`
            )}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Factor Card
const FactorCard = ({ factor, awayTeam, homeTeam, isMobile, isExpanded, onToggle }) => {
  const impactBadge = VisualMetricsGenerator.getImpactBadge(factor.importance);
  const impactColor = VisualMetricsGenerator.getImpactColor(factor.impact, true);

  return (
    <div style={{
      background: 'rgba(26, 31, 46, 0.6)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '8px',
      padding: isMobile ? '1rem' : '1.25rem',
      transition: 'all 0.2s ease'
    }}>
      {/* Factor Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem',
        gap: '0.75rem'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.375rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '1rem' }}>{impactBadge.emoji}</span>
            <span style={{
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em'
            }}>
              {factor.name}
            </span>
            
            {/* Star Rating */}
            <div style={{
              display: 'flex',
              gap: '2px',
              fontSize: '0.875rem'
            }}>
              {Array(factor.stars).fill('★').map((star, i) => (
                <span key={i} style={{ color: impactBadge.color }}>{star}</span>
              ))}
              {Array(3 - factor.stars).fill('☆').map((star, i) => (
                <span key={i} style={{ color: 'rgba(100, 116, 139, 0.4)' }}>{star}</span>
              ))}
            </div>
          </div>
          
          {/* Impact Badge */}
          <div style={{
            display: 'inline-flex',
            padding: '0.25rem 0.625rem',
            background: `${impactBadge.color}15`,
            border: `1px solid ${impactBadge.color}40`,
            borderRadius: '4px',
            fontSize: '0.625rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: impactBadge.color
          }}>
            {impactBadge.label}
          </div>
        </div>

        {/* Goal Impact */}
        <div style={{
          textAlign: 'right',
          minWidth: '80px'
        }}>
          <div style={{
            fontSize: '0.625rem',
            color: 'var(--color-text-muted)',
            marginBottom: '0.25rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Impact
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '900',
            color: impactColor,
            fontFeatureSettings: "'tnum'",
            letterSpacing: '-0.02em'
          }}>
            {VisualMetricsGenerator.formatGoalImpact(factor.impact)}
          </div>
        </div>
      </div>

      {/* Comparison Bars */}
      {factor.awayMetric && factor.homeMetric && (
        <ComparisonBars
          awayTeam={awayTeam}
          homeTeam={homeTeam}
          awayMetric={factor.awayMetric}
          homeMetric={factor.homeMetric}
          leagueAvg={factor.leagueAvg}
          isMobile={isMobile}
        />
      )}

      {/* Explanation */}
      {factor.explanation && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '6px',
          fontSize: '0.813rem',
          color: 'var(--color-text-secondary)',
          lineHeight: '1.5',
          fontStyle: 'italic'
        }}>
          {factor.explanation}
        </div>
      )}
    </div>
  );
};

// Comparison Bars Component
const ComparisonBars = ({ awayTeam, homeTeam, awayMetric, homeMetric, leagueAvg, isMobile }) => {
  // Calculate bar data
  const awayValue = awayMetric.value || 0;
  const homeValue = homeMetric.value || 0;
  
  // Normalize to percentage (league avg = 50%)
  const maxValue = Math.max(awayValue, homeValue, leagueAvg) * 1.2;
  const awayPct = (awayValue / maxValue) * 100;
  const homePct = (homeValue / maxValue) * 100;
  const leaguePct = (leagueAvg / maxValue) * 100;

  // Determine colors based on advantage
  const awayHasAdvantage = awayMetric.rank && homeMetric.rank && awayMetric.rank < homeMetric.rank;
  const awayColor = awayHasAdvantage ? '#10B981' : '#64748B';
  const homeColor = !awayHasAdvantage ? '#10B981' : '#64748B';

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Away Team Bar */}
      <MetricBar
        team={awayTeam}
        label={awayMetric.label}
        value={awayValue}
        detail={awayMetric.detail}
        rank={awayMetric.rank}
        barPct={awayPct}
        color={awayColor}
        isMobile={isMobile}
      />

      {/* League Average Line */}
      <div style={{
        position: 'relative',
        height: '20px',
        margin: '0.25rem 0'
      }}>
        <div style={{
          position: 'absolute',
          left: `${leaguePct}%`,
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'rgba(212, 175, 55, 0.5)'
        }} />
        <div style={{
          position: 'absolute',
          left: `${leaguePct}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '0.625rem',
          color: 'rgba(212, 175, 55, 0.8)',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          background: 'var(--color-background)',
          padding: '0 0.375rem'
        }}>
          League: {leagueAvg.toFixed(2)}
        </div>
      </div>

      {/* Home Team Bar */}
      <MetricBar
        team={homeTeam}
        label={homeMetric.label}
        value={homeValue}
        detail={homeMetric.detail}
        rank={homeMetric.rank}
        barPct={homePct}
        color={homeColor}
        isMobile={isMobile}
      />
    </div>
  );
};

// Individual Metric Bar
const MetricBar = ({ team, label, value, detail, rank, barPct, color, isMobile }) => {
  const tierBadge = VisualMetricsGenerator.getTierBadge(rank);
  
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.25rem'
      }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--color-text-secondary)'
        }}>
          {team}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {rank && (
            <span style={{
              fontSize: '0.625rem',
              fontWeight: '700',
              color: tierBadge.color,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              #{rank} {tierBadge.icon}
            </span>
          )}
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '700',
            color: color,
            fontFeatureSettings: "'tnum'"
          }}>
            {value.toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Bar */}
      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(100, 116, 139, 0.2)',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${barPct}%`,
          height: '100%',
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {detail && (
        <div style={{
          fontSize: '0.688rem',
          color: 'var(--color-text-muted)',
          marginTop: '0.25rem',
          fontStyle: 'italic'
        }}>
          {detail}
        </div>
      )}
    </div>
  );
};

export default StatisticalEdgeAnalysis;

