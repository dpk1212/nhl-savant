import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { EdgeCalculator } from '../utils/edgeCalculator';
import { getTeamName } from '../utils/oddsTraderParser';
import { VisualMetricsGenerator } from '../utils/visualMetricsGenerator';
import { GoalieProcessor } from '../utils/goalieProcessor';
import MathBreakdown from './MathBreakdown';
import BetNarrative from './BetNarrative';
import QuickSummary from './QuickSummary';
import QuickGlance from './QuickGlance';
import RatingBadge from './RatingBadge';
import CollapsibleSection from './CollapsibleSection';
import StatisticalEdgeAnalysis from './StatisticalEdgeAnalysis';
import AdvancedMatchupDetails from './AdvancedMatchupDetails';
import { SkeletonHero, SkeletonCard } from './LoadingStates';
import { LiveClock, AnimatedStatPill, GameCountdown, FlipNumbers } from './PremiumComponents';
import { validatePredictions } from '../utils/modelValidator';
import { useBetTracking } from '../hooks/useBetTracking';
import { useLiveScores } from '../hooks/useLiveScores';
import { useFirebaseBets } from '../hooks/useFirebaseBets';
import { 
  ELEVATION, 
  TYPOGRAPHY, 
  MOBILE_SPACING, 
  GRADIENTS, 
  getEVColorScale, 
  getBarColor,
  getConfidenceLevel,
  getStaggerDelay,
  TRANSITIONS
} from '../utils/designSystem';
import { getStatDisplayName, getStatTooltip, getStatColorCode } from '../utils/statDisplayNames';
import QuickStory from './QuickStory';

// ========================================
// INLINE HELPER COMPONENTS
// ========================================

// Compact Header - Team names, time, rating badge, win probabilities
const CompactHeader = ({ awayTeam, homeTeam, gameTime, rating, awayWinProb, homeWinProb, isMobile }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? MOBILE_SPACING.cardPadding : '1.25rem',
    borderBottom: ELEVATION.flat.border,
    background: 'rgba(26, 31, 46, 0.3)'
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
        <span style={{ 
          fontSize: isMobile ? TYPOGRAPHY.heading.size : '1.25rem', 
          fontWeight: TYPOGRAPHY.heading.weight, 
          color: 'var(--color-text-primary)',
          letterSpacing: TYPOGRAPHY.heading.letterSpacing
        }}>
          {awayTeam} <span style={{ color: 'var(--color-text-muted)' }}>@</span> {homeTeam}
        </span>
        <span style={{ 
          fontSize: TYPOGRAPHY.label.size, 
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontWeight: TYPOGRAPHY.label.weight
        }}>
          <Calendar size={14} />
          {gameTime}
        </span>
      </div>
      {awayWinProb && homeWinProb && (
        <div style={{ 
          fontSize: TYPOGRAPHY.caption.size, 
          color: 'var(--color-text-muted)',
          fontWeight: TYPOGRAPHY.caption.weight,
          display: 'flex',
          gap: '0.5rem'
        }}>
          <span style={{ color: awayWinProb > homeWinProb ? '#10B981' : 'var(--color-text-muted)' }}>
            {awayTeam}: {(awayWinProb * 100).toFixed(0)}%
          </span>
          <span>|</span>
          <span style={{ color: homeWinProb > awayWinProb ? '#10B981' : 'var(--color-text-muted)' }}>
            {homeTeam}: {(homeWinProb * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </div>
    {rating > 0 && <RatingBadge evPercent={rating} size="small" />}
  </div>
);

// Calculate implied probability from odds
const calculateImpliedProb = (odds) => {
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
};

// Calculate implied probability from American odds (returns decimal 0-1)
const getImpliedProbability = (odds) => {
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
};

// Probability Bars Component
const ProbabilityBars = ({ modelProb, marketProb }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Model</span>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10B981' }}>
          {(modelProb * 100).toFixed(1)}%
        </span>
      </div>
      <div style={{ 
        width: '100%', 
        height: '8px', 
        background: 'rgba(100, 116, 139, 0.2)', 
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${modelProb * 100}%`, 
          height: '100%', 
          background: '#10B981',
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
    
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Market</span>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
          {(marketProb * 100).toFixed(1)}%
        </span>
      </div>
      <div style={{ 
        width: '100%', 
        height: '8px', 
        background: 'rgba(100, 116, 139, 0.2)', 
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${marketProb * 100}%`, 
          height: '100%', 
          background: '#64748B',
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  </div>
);

// Hero Bet Card - Main value proposition
const HeroBetCard = ({ bestEdge, game, isMobile, factors }) => {
  if (!bestEdge) return null;
  
  const marketProb = calculateImpliedProb(bestEdge.odds);
  const modelTotal = game.edges.total?.predictedTotal || 0;
  const marketTotal = game.edges.total?.marketTotal || 0;
  const edge = modelTotal - marketTotal;
  const confidence = getConfidenceLevel(bestEdge.evPercent, bestEdge.modelProb);
  
  // Generate supporting insights for primary bet
  const getSupportingInsights = () => {
    if (!factors || factors.length === 0) return [];
    
    const insights = [];
    const isTotal = bestEdge.market === 'TOTAL';
    
    if (isTotal) {
      // For TOTAL bets - show factors that align with OVER/UNDER
      const isOver = bestEdge.pick.includes('OVER');
      factors.forEach(f => {
        const alignsWithBet = (isOver && f.impact > 0.05) || (!isOver && f.impact < -0.05);
        if (alignsWithBet && Math.abs(f.impact) > 0.05) {
          insights.push(`${f.name}: ${Math.abs(f.impact).toFixed(2)} goal impact`);
        }
      });
    } else {
      // For MONEYLINE bets - show factors that favor the team
      const betTeam = bestEdge.team;
      factors.forEach(f => {
        const awayVal = f.awayMetric?.value || 0;
        const homeVal = f.homeMetric?.value || 0;
        const hasAdvantage = awayVal > homeVal ? game.awayTeam : game.homeTeam;
        const percentDiff = Math.abs(awayVal - homeVal) / ((awayVal + homeVal) / 2);
        
        if (hasAdvantage === betTeam && percentDiff > 0.10) {
          const percentDiffFormatted = (percentDiff * 100).toFixed(0);
          insights.push(`${f.name}: ${betTeam} has ${percentDiffFormatted}% edge`);
        }
      });
    }
    
    return insights.slice(0, 3); // Max 3 insights for primary bet
  };
  
  const insights = getSupportingInsights();
  
  return (
    <div style={{ 
      background: GRADIENTS.hero,
      border: ELEVATION.elevated.border,
      boxShadow: ELEVATION.elevated.shadow,
      borderRadius: '12px',
      padding: isMobile ? MOBILE_SPACING.cardPadding : '1.5rem',
      margin: isMobile ? MOBILE_SPACING.sectionGap : '1.25rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Shimmer effect for high value bets */}
      {bestEdge.evPercent > 10 && (
        <div className="shimmer-overlay" />
      )}
      
      {/* Best bet recommendation */}
      <div style={{ 
        fontSize: isMobile ? TYPOGRAPHY.heading.size : '1.25rem', 
        fontWeight: TYPOGRAPHY.heading.weight, 
        marginBottom: '1rem',
        color: 'var(--color-text-primary)',
        position: 'relative',
        zIndex: 1,
        letterSpacing: TYPOGRAPHY.heading.letterSpacing
      }}>
        💰 BEST VALUE: {bestEdge.pick}
      </div>
      
      {/* Edge display */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '0.875rem', 
        marginBottom: '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div>
          <div style={{ 
            fontSize: TYPOGRAPHY.label.size, 
            color: 'var(--color-text-muted)', 
            textTransform: TYPOGRAPHY.label.textTransform, 
            letterSpacing: TYPOGRAPHY.label.letterSpacing, 
            fontWeight: TYPOGRAPHY.label.weight,
            marginBottom: '0.25rem'
          }}>
            Our Edge
          </div>
          <div style={{ 
            fontSize: isMobile ? '1.125rem' : TYPOGRAPHY.hero.size, 
            fontWeight: TYPOGRAPHY.hero.weight, 
            color: '#10B981', 
            fontFeatureSettings: "'tnum'",
            lineHeight: TYPOGRAPHY.hero.lineHeight
          }}>
            {edge > 0 ? '+' : ''}{Math.abs(edge).toFixed(1)}
          </div>
          <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)' }}>goals</div>
        </div>
        <div>
          <div style={{ 
            fontSize: TYPOGRAPHY.label.size, 
            color: 'var(--color-text-muted)', 
            textTransform: TYPOGRAPHY.label.textTransform, 
            letterSpacing: TYPOGRAPHY.label.letterSpacing, 
            fontWeight: TYPOGRAPHY.label.weight,
            marginBottom: '0.25rem'
          }}>
            Value
          </div>
          <div style={{ 
            fontSize: isMobile ? '1.125rem' : TYPOGRAPHY.hero.size, 
            fontWeight: TYPOGRAPHY.hero.weight, 
            color: '#10B981', 
            fontFeatureSettings: "'tnum'",
            lineHeight: TYPOGRAPHY.hero.lineHeight
          }}>
            +{bestEdge.evPercent.toFixed(1)}%
          </div>
          <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)' }}>EV</div>
        </div>
        {!isMobile && (
          <>
            <div>
              <div style={{ 
                fontSize: TYPOGRAPHY.label.size, 
                color: 'var(--color-text-muted)', 
                textTransform: TYPOGRAPHY.label.textTransform, 
                letterSpacing: TYPOGRAPHY.label.letterSpacing, 
                fontWeight: TYPOGRAPHY.label.weight,
                marginBottom: '0.25rem'
              }}>
                Confidence
              </div>
              <div style={{ 
                fontSize: TYPOGRAPHY.subheading.size, 
                fontWeight: TYPOGRAPHY.subheading.weight, 
                color: confidence.color, 
                lineHeight: TYPOGRAPHY.hero.lineHeight
              }}>
                {confidence.level}
              </div>
              <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)' }}>level</div>
            </div>
            <div>
              <div style={{ 
                fontSize: TYPOGRAPHY.label.size, 
                color: 'var(--color-text-muted)', 
                textTransform: TYPOGRAPHY.label.textTransform, 
                letterSpacing: TYPOGRAPHY.label.letterSpacing, 
                fontWeight: TYPOGRAPHY.label.weight,
                marginBottom: '0.25rem'
              }}>
                Odds
              </div>
              <div style={{ 
                fontSize: TYPOGRAPHY.subheading.size, 
                fontWeight: TYPOGRAPHY.heading.weight, 
                color: 'var(--color-text-primary)', 
                fontFeatureSettings: "'tnum'",
                lineHeight: TYPOGRAPHY.hero.lineHeight
              }}>
                {bestEdge.odds > 0 ? '+' : ''}{bestEdge.odds}
              </div>
              <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)' }}>line</div>
            </div>
          </>
        )}
      </div>
      
      {/* Probability bars */}
      <ProbabilityBars 
        modelProb={bestEdge.modelProb} 
        marketProb={marketProb} 
      />
      
      {/* Premium Supporting Insights - Why this is the best value */}
      {insights.length > 0 && (
        <div style={{
          marginTop: '1rem',
          marginBottom: '0.75rem',
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)',
          borderRadius: '8px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            fontSize: TYPOGRAPHY.label.size,
            color: '#10B981',
            fontWeight: TYPOGRAPHY.heading.weight,
            marginBottom: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1rem' }}>✓</span>
            Why this is the best value:
          </div>
          {insights.map((insight, idx) => (
            <div key={idx} style={{
              fontSize: TYPOGRAPHY.body.size,
              color: 'var(--color-text-primary)',
              marginBottom: idx < insights.length - 1 ? '0.5rem' : 0,
              paddingLeft: '1.25rem',
              position: 'relative',
              lineHeight: '1.5'
            }}>
              <span style={{
                position: 'absolute',
                left: 0,
                color: '#10B981',
                fontSize: '1.25rem',
                fontWeight: 'bold'
              }}>•</span>
              {insight}
            </div>
          ))}
        </div>
      )}
      
      {/* Bottom stats row */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: TYPOGRAPHY.body.size,
        color: 'var(--color-text-muted)',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(16, 185, 129, 0.2)',
        position: 'relative',
        zIndex: 1,
        fontWeight: TYPOGRAPHY.caption.weight
      }}>
        {isMobile && <span>Odds: {bestEdge.odds > 0 ? '+' : ''}{bestEdge.odds}</span>}
        <span>Model: {modelTotal.toFixed(1)}</span>
        <span>Market: {marketTotal.toFixed(1)}</span>
      </div>
    </div>
  );
};

// Compact Comparison Bar with value labels and color coding
const CompactComparisonBar = ({ awayValue, homeValue, leagueAvg, awayTeam, homeTeam }) => {
  const maxValue = Math.max(awayValue, homeValue, leagueAvg) * 1.2;
  const awayPct = (awayValue / maxValue) * 100;
  const homePct = (homeValue / maxValue) * 100;
  const leaguePct = (leagueAvg / maxValue) * 100;
  
  const awayAdvantage = awayValue > homeValue;
  const awayColor = getBarColor(awayValue, homeValue, leagueAvg);
  const homeColor = getBarColor(homeValue, awayValue, leagueAvg);
  
  // Get color coding
  const awayColorCode = getStatColorCode(awayValue, leagueAvg, true);
  const homeColorCode = getStatColorCode(homeValue, leagueAvg, true);
  
  return (
    <div style={{ fontSize: TYPOGRAPHY.caption.size }}>
      {/* Legend - show once */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem',
        marginBottom: '0.5rem',
        fontSize: '0.625rem',
        color: 'var(--color-text-muted)',
        fontWeight: TYPOGRAPHY.caption.weight
      }}>
        <span>Green = Advantage</span>
        <span>│ = League Avg</span>
      </div>
      
      {/* Away Team Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
        <span style={{ 
          minWidth: '35px',
          fontWeight: awayAdvantage ? TYPOGRAPHY.body.weight : TYPOGRAPHY.caption.weight, 
          color: 'var(--color-text-primary)'
        }}>
          {awayTeam}
        </span>
        <div style={{ flex: 1, position: 'relative', height: '20px', background: 'rgba(100, 116, 139, 0.15)', borderRadius: '4px' }}>
          {/* League average marker */}
          <div style={{ 
            position: 'absolute',
            left: `${leaguePct}%`,
            top: '-2px',
            bottom: '-2px',
            width: '2px',
            background: 'rgba(212, 175, 55, 0.6)',
            zIndex: 2,
            boxShadow: '0 0 4px rgba(212, 175, 55, 0.4)'
          }} />
          {/* Bar */}
          <div style={{ 
            width: `${awayPct}%`, 
            height: '100%', 
            background: awayColor,
            borderRadius: '4px',
            transition: TRANSITIONS.normal,
            boxShadow: awayAdvantage ? `0 0 8px ${awayColor}40` : 'none',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '0.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <span style={{ 
              fontSize: '0.688rem', 
              fontWeight: '700', 
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              {awayValue.toFixed(2)}
            </span>
          </div>
        </div>
        <span style={{ 
          fontSize: '0.625rem', 
          fontWeight: TYPOGRAPHY.body.weight,
          color: awayColorCode.color,
          minWidth: '45px',
          textAlign: 'right'
        }}>
          {awayColorCode.icon} {awayColorCode.label}
        </span>
      </div>
      
      {/* Home Team Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ 
          minWidth: '35px',
          fontWeight: !awayAdvantage ? TYPOGRAPHY.body.weight : TYPOGRAPHY.caption.weight, 
          color: 'var(--color-text-primary)'
        }}>
          {homeTeam}
        </span>
        <div style={{ flex: 1, position: 'relative', height: '20px', background: 'rgba(100, 116, 139, 0.15)', borderRadius: '4px' }}>
          {/* League average marker */}
          <div style={{ 
            position: 'absolute',
            left: `${leaguePct}%`,
            top: '-2px',
            bottom: '-2px',
            width: '2px',
            background: 'rgba(212, 175, 55, 0.6)',
            zIndex: 2,
            boxShadow: '0 0 4px rgba(212, 175, 55, 0.4)'
          }} />
          {/* Bar */}
          <div style={{ 
            width: `${homePct}%`, 
            height: '100%', 
            background: homeColor,
            borderRadius: '4px',
            transition: TRANSITIONS.normal,
            boxShadow: !awayAdvantage ? `0 0 8px ${homeColor}40` : 'none',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '0.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <span style={{ 
              fontSize: '0.688rem', 
              fontWeight: '700', 
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              {homeValue.toFixed(2)}
            </span>
          </div>
        </div>
        <span style={{ 
          fontSize: '0.625rem', 
          fontWeight: TYPOGRAPHY.body.weight,
          color: homeColorCode.color,
          minWidth: '45px',
          textAlign: 'right'
        }}>
          {homeColorCode.icon} {homeColorCode.label}
        </span>
      </div>
      
      {/* League Average Reference */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '0.375rem',
        fontSize: '0.625rem',
        color: 'rgba(212, 175, 55, 0.8)',
        fontWeight: TYPOGRAPHY.caption.weight
      }}>
        League Avg: {leagueAvg.toFixed(2)}
      </div>
    </div>
  );
};

// Compact Factors - Top 3 critical factors
const CompactFactors = ({ factors, totalImpact, awayTeam, homeTeam, isMobile, bestEdge }) => {
  if (!factors || factors.length === 0) return null;
  
  // STRICT filtering: Only show factors that SUPPORT the bet
  const significantFactors = factors
    .filter(f => {
      const hasImpact = Math.abs(f.impact) > 0.05; // >0.05 goals
      const awayVal = f.awayMetric?.value || 0;
      const homeVal = f.homeMetric?.value || 0;
      const hasDifference = awayVal && homeVal && 
        Math.abs(awayVal - homeVal) / ((awayVal + homeVal) / 2) > 0.10; // >10% difference
      
      if (!hasImpact || !hasDifference) return false;
      
      // STRICT alignment check - only show factors that SUPPORT the bet
      if (bestEdge?.market === 'MONEYLINE') {
        const hasAdvantage = awayVal > homeVal ? awayTeam : homeTeam;
        // ONLY show if bet team has the advantage
        return hasAdvantage === bestEdge.team;
      }
      
      if (bestEdge?.market === 'TOTAL') {
        const isOver = bestEdge.pick?.includes('OVER');
        // ONLY show if factor aligns with OVER/UNDER direction
        return (isOver && f.impact > 0.05) || (!isOver && f.impact < -0.05);
      }
      
      return true; // fallback for other bet types
    })
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 3);
  
  // If no significant factors, show even matchup message
  if (significantFactors.length === 0) {
    return (
      <div style={{ 
        background: GRADIENTS.factors, 
        border: ELEVATION.raised.border,
        boxShadow: ELEVATION.raised.shadow,
        borderRadius: MOBILE_SPACING.borderRadius,
        padding: isMobile ? MOBILE_SPACING.cardPadding : '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: TYPOGRAPHY.body.size, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
          📊 KEY ADVANTAGES
        </div>
        <div style={{ fontSize: TYPOGRAPHY.subheading.size, color: 'var(--color-text-primary)', fontWeight: TYPOGRAPHY.heading.weight }}>
          Even Matchup
        </div>
        <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          No dominant statistical advantages detected. Both teams are closely matched in key metrics.
        </div>
      </div>
    );
  }
  
  // Determine bet context for header
  const isMoneyline = bestEdge?.market === 'MONEYLINE';
  const isTotal = bestEdge?.market === 'TOTAL';
  
  const betContext = isTotal
    ? `💰 Why ${bestEdge.pick} is the smart bet:`
    : isMoneyline
    ? `💰 Why ${bestEdge.team} ML is the smart bet:`
    : bestEdge?.market === 'PUCK_LINE'
    ? `💰 Why ${bestEdge.pick} is the smart bet:`
    : '📊 KEY ADVANTAGES';
  
  const subheader = isTotal
    ? `${significantFactors.length} factor${significantFactors.length !== 1 ? 's' : ''} combining for ${totalImpact >= 0 ? '+' : ''}${totalImpact.toFixed(2)} goal edge`
    : isMoneyline
    ? `${significantFactors.length} decisive advantage${significantFactors.length !== 1 ? 's' : ''} supporting ${bestEdge.team} to WIN`
    : `${significantFactors.length} key factor${significantFactors.length !== 1 ? 's' : ''} with significant impact`;
  
  const topFactors = significantFactors;
  const criticalCount = significantFactors.length;
  
  return (
    <div style={{ 
      background: GRADIENTS.factors, 
      border: ELEVATION.raised.border,
      boxShadow: ELEVATION.raised.shadow,
      borderRadius: MOBILE_SPACING.borderRadius,
      overflow: 'hidden'
    }}>
      {/* Header with bet context */}
      <div style={{
        padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
        background: 'rgba(0, 0, 0, 0.15)',
        borderBottom: ELEVATION.flat.border
      }}>
        <h3 style={{ 
          fontSize: TYPOGRAPHY.subheading.size, 
          fontWeight: TYPOGRAPHY.heading.weight, 
          margin: 0, 
          marginBottom: '0.25rem',
          color: 'var(--color-accent)', 
          letterSpacing: TYPOGRAPHY.heading.letterSpacing 
        }}>
          {betContext}
        </h3>
        <div style={{ 
          fontSize: TYPOGRAPHY.caption.size, 
          color: 'var(--color-text-muted)',
          fontWeight: TYPOGRAPHY.caption.weight
        }}>
          {subheader}
        </div>
      </div>
      
      {/* Factors list */}
      <div style={{ padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem' }}>
      {topFactors.map((factor, idx) => {
        // Determine who has the advantage
        const awayVal = factor.awayMetric?.value || 0;
        const homeVal = factor.homeMetric?.value || 0;
        const diff = Math.abs(awayVal - homeVal);
        const percentDiff = ((diff / ((awayVal + homeVal) / 2)) * 100).toFixed(0);
        
        const hasAdvantage = awayVal > homeVal ? awayTeam : homeTeam;
        const advantageColor = awayVal > homeVal ? '#0EA5E9' : '#10B981';
        
        // Generate bet-specific explanation
        const getBetSpecificExplanation = () => {
          if (isMoneyline) {
            // ML-specific: Focus on winning
            if (factor.name === 'Expected Goals') {
              return `${hasAdvantage} projects to score ${Math.abs(factor.impact).toFixed(2)} more goals, giving them a decisive edge to WIN this game.`;
            }
            if (factor.name === 'Offensive Rating') {
              return `${hasAdvantage} generates ${percentDiff}% more high-danger chances, creating better scoring opportunities to WIN.`;
            }
            if (factor.name === 'Defensive Rating') {
              return `${hasAdvantage} allows ${percentDiff}% fewer dangerous chances, making it harder for opponents to score and WIN.`;
            }
            if (factor.name === 'Special Teams') {
              return `${hasAdvantage} has superior power play execution, creating more scoring chances to WIN.`;
            }
            if (factor.name === 'Possession & Control') {
              return `${hasAdvantage} controls ${percentDiff}% more of the play, dictating the pace to WIN.`;
            }
            // Generic ML explanation
            return `${hasAdvantage} has a ${percentDiff}% advantage in ${factor.name.toLowerCase()}, improving their chances to WIN this game.`;
          }
          
          if (isTotal) {
            // TOTAL-specific: Focus on goal impact
            const direction = factor.impact > 0 ? 'OVER' : 'UNDER';
            return `${factor.explanation} This pushes the total ${direction} by ~${Math.abs(factor.impact).toFixed(2)} goals.`;
          }
          
          return factor.explanation; // fallback
        };
        
        const explanation = getBetSpecificExplanation();
        
        return (
          <div key={idx} style={{ 
            marginBottom: idx < topFactors.length - 1 ? '0.875rem' : '0',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '10px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header: Factor name */}
            <div style={{ 
              fontSize: TYPOGRAPHY.label.size, 
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: TYPOGRAPHY.label.weight,
              marginBottom: '0.625rem'
            }}>
              {factor.stars === 3 ? '🔥' : factor.stars === 2 ? '🎯' : '⚡'} {factor.name}
            </div>
            
            {/* Main insight */}
            <div style={{ 
              fontSize: TYPOGRAPHY.subheading.size,
              fontWeight: TYPOGRAPHY.heading.weight,
              color: '#10B981',
              marginBottom: '0.625rem',
              lineHeight: 1.3
            }}>
              {isMoneyline 
                ? `${hasAdvantage} has ${percentDiff}% edge`
                : isTotal && factor.impact > 0
                ? `Combined teams favor OVER`
                : isTotal && factor.impact < 0
                ? `Combined teams favor UNDER`
                : `${hasAdvantage} has ${percentDiff}% edge`
              }
            </div>
            
            {/* Impact for TOTAL bets */}
            {isTotal && (
              <div style={{
                fontSize: TYPOGRAPHY.body.size,
                fontWeight: TYPOGRAPHY.heading.weight,
                color: factor.impact > 0 ? '#F59E0B' : '#8B5CF6',
                marginBottom: '0.625rem'
              }}>
                {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(2)} goal impact → {factor.impact > 0 ? 'OVER' : 'UNDER'}
              </div>
            )}
            
            {/* Explanation */}
            <div style={{ 
              fontSize: TYPOGRAPHY.body.size,
              color: 'var(--color-text-primary)',
              marginBottom: '0.75rem',
              lineHeight: 1.5
            }}>
              {explanation}
            </div>
            
            {/* Bottom row: Stats */}
            <div style={{ 
              fontSize: TYPOGRAPHY.caption.size,
              color: 'var(--color-text-muted)',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {awayTeam}: {awayVal.toFixed(2)} | {homeTeam}: {homeVal.toFixed(2)}
            </div>
          </div>
        );
      })}
      </div>
      
      {/* Total edge summary */}
      <div style={{ 
        textAlign: 'center', 
        fontSize: TYPOGRAPHY.subheading.size, 
        fontWeight: TYPOGRAPHY.heading.weight,
        padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '2px solid rgba(16, 185, 129, 0.3)',
        borderRadius: MOBILE_SPACING.borderRadius,
        color: '#10B981',
        fontFeatureSettings: "'tnum'",
        margin: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
        marginTop: '1rem'
      }}>
        <div style={{ fontSize: TYPOGRAPHY.caption.size, fontWeight: TYPOGRAPHY.caption.weight, color: 'rgba(16, 185, 129, 0.8)', marginBottom: '0.25rem' }}>
          TOTAL EDGE
        </div>
        {VisualMetricsGenerator.formatGoalImpact(totalImpact)} goals vs market
      </div>
    </div>
  );
};

// Alternative Bet Card - Show secondary opportunities with supporting insights
const AlternativeBetCard = ({ game, bestEdge, awayTeam, homeTeam, isMobile, factors }) => {
  if (!game || !bestEdge) return null;
  
  // Determine alternative market
  const isValueBetTotal = bestEdge.market === 'TOTAL';
  const alternativeMarket = isValueBetTotal ? 'MONEYLINE' : 'TOTAL';
  
  // Get alternative bet data
  let altBet = null;
  let altPick = '';
  let altTeam = null;
  
  if (isValueBetTotal) {
    // Value bet is TOTAL, show best ML alternative
    const awayML = game.edges?.moneyline?.away;
    const homeML = game.edges?.moneyline?.home;
    if (awayML && homeML) {
      altBet = awayML.evPercent > homeML.evPercent ? awayML : homeML;
      altPick = awayML.evPercent > homeML.evPercent ? `${awayTeam} ML` : `${homeTeam} ML`;
      altTeam = awayML.evPercent > homeML.evPercent ? awayTeam : homeTeam;
    }
  } else {
    // Value bet is ML, show best TOTAL alternative
    const over = game.edges?.total?.over;
    const under = game.edges?.total?.under;
    if (over && under) {
      altBet = over.evPercent > under.evPercent ? over : under;
      const line = game.rawOdds?.total?.line || over.line || under.line;
      altPick = over.evPercent > under.evPercent ? `OVER ${line}` : `UNDER ${line}`;
    }
  }
  
  // Only show if alternative has positive EV
  if (!altBet || altBet.evPercent <= 0) return null;
  
  // Generate bet-specific explanations for insights
  const getSupportingInsights = () => {
    if (!factors || factors.length === 0) return [];
    
    const insights = [];
    
    if (isValueBetTotal) {
      // Alternative is ML - show factors that favor the team with detailed explanations
      factors.forEach(f => {
        const awayVal = f.awayMetric?.value || 0;
        const homeVal = f.homeMetric?.value || 0;
        const hasAdvantage = awayVal > homeVal ? awayTeam : homeTeam;
        const percentDiff = ((Math.abs(awayVal - homeVal) / ((awayVal + homeVal) / 2)) * 100).toFixed(0);
        
        if (hasAdvantage === altTeam && Math.abs(awayVal - homeVal) / ((awayVal + homeVal) / 2) > 0.10) {
          // Generate ML-specific explanation
          let explanation = '';
          if (f.name === 'Expected Goals') {
            explanation = `${altTeam} projects to score ${Math.abs(f.impact).toFixed(2)} more goals, making them a strong WIN candidate.`;
          } else if (f.name === 'Offensive Rating') {
            explanation = `${altTeam} generates ${percentDiff}% more high-danger chances, giving them a scoring edge to WIN.`;
          } else if (f.name === 'Defensive Rating') {
            explanation = `${altTeam} allows ${percentDiff}% fewer dangerous chances, making it harder for opponents to WIN.`;
          } else if (f.name === 'Special Teams') {
            explanation = `${altTeam} has superior power play execution, creating more scoring chances to WIN.`;
          } else if (f.name === 'Possession & Control') {
            explanation = `${altTeam} controls ${percentDiff}% more of the play, dictating the pace to WIN.`;
          } else {
            explanation = `${altTeam} has a ${percentDiff}% advantage in ${f.name.toLowerCase()}, improving their chances to WIN.`;
          }
          
          insights.push({
            icon: f.stars === 3 ? '🔥' : f.stars === 2 ? '🎯' : '⚡',
            name: f.name,
            edge: `${altTeam} has ${percentDiff}% edge`,
            explanation
          });
        }
      });
    } else {
      // Alternative is TOTAL - show factors that align with OVER/UNDER
      const isAltOver = altPick.includes('OVER');
      factors.forEach(f => {
        const alignsWithAlt = (isAltOver && f.impact > 0.05) || (!isAltOver && f.impact < -0.05);
        if (alignsWithAlt && Math.abs(f.impact) > 0.05) {
          const direction = isAltOver ? 'OVER' : 'UNDER';
          const explanation = `${f.name} pushes the total ${direction} by ~${Math.abs(f.impact).toFixed(2)} goals, creating value.`;
          
          insights.push({
            icon: f.stars === 3 ? '🔥' : f.stars === 2 ? '🎯' : '⚡',
            name: f.name,
            edge: `${Math.abs(f.impact).toFixed(2)} goal impact`,
            explanation
          });
        }
      });
    }
    
    return insights.slice(0, 3); // Max 3 insights
  };
  
  const insights = getSupportingInsights();
  const evColor = getEVColorScale(altBet.evPercent);
  
  // Generate context message
  const getAlternativeContext = () => {
    if (isValueBetTotal) {
      return `While ${bestEdge.pick} is our top pick, ${altTeam} ML offers strong value if you prefer betting on the winner.`;
    } else {
      return `While ${bestEdge.team} ML is our top pick, ${altPick} offers strong value if you prefer betting on the total.`;
    }
  };
  
  const contextMessage = getAlternativeContext();
  const impliedProb = calculateImpliedProb(altBet.odds);
  const edgePts = ((altBet.modelProb - impliedProb) * 100).toFixed(1);
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.05) 100%)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '12px',
      padding: isMobile ? MOBILE_SPACING.cardPadding : '1.25rem',
      margin: isMobile ? `${MOBILE_SPACING.sectionGap} ${MOBILE_SPACING.cardPadding}` : '1.25rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Gold accent bar at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.8) 0%, rgba(212, 175, 55, 0.3) 100%)'
      }} />
      
      {/* Header */}
      <div style={{
        marginBottom: '1rem',
        paddingTop: '0.5rem'
      }}>
        <div style={{
          fontSize: TYPOGRAPHY.label.size,
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: TYPOGRAPHY.heading.weight,
          marginBottom: '0.75rem'
        }}>
          ⭐ ALSO CONSIDER THIS VALUE BET
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.625rem'
        }}>
          <div style={{
            fontSize: TYPOGRAPHY.subheading.size,
            fontWeight: TYPOGRAPHY.heading.weight,
            color: 'var(--color-text-primary)'
          }}>
            {isValueBetTotal ? `${altPick} to WIN` : altPick}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.25rem'
          }}>
            <div style={{
              fontSize: TYPOGRAPHY.subheading.size,
              fontWeight: TYPOGRAPHY.heading.weight,
              color: evColor.color
            }}>
              +{altBet.evPercent.toFixed(1)}% EV
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.caption.size,
              fontWeight: TYPOGRAPHY.label.weight,
              color: evColor.color,
              padding: '0.125rem 0.5rem',
              background: `${evColor.color}22`,
              borderRadius: '4px',
              border: `1px solid ${evColor.color}`
            }}>
              {evColor.label}
            </div>
          </div>
        </div>
        
        {/* Context message */}
        <div style={{
          fontSize: TYPOGRAPHY.body.size,
          color: 'var(--color-text-muted)',
          lineHeight: 1.5
        }}>
          {contextMessage}
        </div>
      </div>
      
      {/* Premium insights section */}
      {insights.length > 0 && (
        <div style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '8px',
          marginBottom: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            fontSize: TYPOGRAPHY.label.size,
            color: 'var(--color-accent)',
            fontWeight: TYPOGRAPHY.heading.weight,
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1rem' }}>✓</span>
            WHY THIS BET HAS VALUE:
          </div>
          
          {insights.map((insight, idx) => (
            <div key={idx} style={{
              marginBottom: idx < insights.length - 1 ? '0.875rem' : 0,
              paddingBottom: idx < insights.length - 1 ? '0.875rem' : 0,
              borderBottom: idx < insights.length - 1 ? '1px solid rgba(212, 175, 55, 0.2)' : 'none'
            }}>
              {/* Factor name */}
              <div style={{
                fontSize: TYPOGRAPHY.caption.size,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: TYPOGRAPHY.label.weight,
                marginBottom: '0.375rem'
              }}>
                {insight.icon} {insight.name}
              </div>
              
              {/* Edge */}
              <div style={{
                fontSize: TYPOGRAPHY.body.size,
                fontWeight: TYPOGRAPHY.heading.weight,
                color: '#D4AF37',
                marginBottom: '0.375rem'
              }}>
                {insight.edge}
              </div>
              
              {/* Explanation */}
              <div style={{
                fontSize: TYPOGRAPHY.body.size,
                color: 'var(--color-text-primary)',
                lineHeight: 1.5
              }}>
                {insight.explanation}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Footer with odds and probabilities */}
      <div style={{
        fontSize: TYPOGRAPHY.caption.size,
        color: 'var(--color-text-muted)',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <span>Odds: {altBet.odds > 0 ? '+' : ''}{altBet.odds}</span>
        <span>Model: {(altBet.modelProb * 100).toFixed(1)}% vs {(impliedProb * 100).toFixed(1)}%</span>
        <span style={{ color: '#D4AF37', fontWeight: TYPOGRAPHY.label.weight }}>
          Edge: +{edgePts}pts
        </span>
      </div>
    </div>
  );
};

// Market Row Component with implied odds and edge in points
const MarketRow = ({ team, odds, ev, isPositive, isBestBet, modelProb, impliedProb }) => {
  const [isHovered, setIsHovered] = useState(false);
  const evColor = getEVColorScale(ev);
  
  // Calculate edge in probability points
  const edgePts = modelProb && impliedProb ? (modelProb - impliedProb) * 100 : null;
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        padding: '0.75rem',
        marginBottom: '0.5rem',
        background: isBestBet 
          ? evColor.bg
          : isHovered 
            ? 'rgba(100, 116, 139, 0.08)'
            : 'transparent',
        border: isBestBet ? `2px solid ${evColor.color}40` : ELEVATION.flat.border,
        borderRadius: '8px',
        transition: TRANSITIONS.normal,
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
        cursor: 'pointer',
        boxShadow: isBestBet && isHovered ? `0 4px 12px ${evColor.color}30` : 'none'
      }}
      role="button"
      tabIndex={0}
      aria-label={`${team} ${odds > 0 ? '+' : ''}${odds}, EV ${ev.toFixed(1)}%`}
      onKeyPress={(e) => e.key === 'Enter' && console.log('Market selected:', team)}
    >
      {/* Team name and odds */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <span style={{ 
          fontSize: TYPOGRAPHY.body.size, 
          fontWeight: TYPOGRAPHY.body.weight, 
          color: 'var(--color-text-primary)' 
        }}>
          {team}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ 
            fontSize: TYPOGRAPHY.body.size, 
            fontWeight: TYPOGRAPHY.body.weight, 
            color: 'var(--color-text-primary)', 
            fontFeatureSettings: "'tnum'" 
          }}>
            {odds > 0 ? '+' : ''}{odds}
          </span>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            minWidth: '70px'
          }}>
            <span style={{ 
              fontSize: TYPOGRAPHY.label.size, 
              fontWeight: TYPOGRAPHY.heading.weight,
              color: evColor.color,
              fontFeatureSettings: "'tnum'"
            }}>
              {isPositive ? '+' : ''}{ev.toFixed(1)}%
            </span>
            {isBestBet && (
              <span style={{ 
                fontSize: TYPOGRAPHY.caption.size, 
                color: evColor.color,
                fontWeight: TYPOGRAPHY.body.weight
              }}>
                {evColor.label}
              </span>
            )}
          </div>
          {isBestBet && <span style={{ fontSize: '1.125rem', color: evColor.color }}>✓</span>}
        </div>
      </div>
      
      {/* Probability comparison (shown on hover or for best bet) */}
      {(isHovered || isBestBet) && modelProb && impliedProb && (
        <div style={{ 
          fontSize: TYPOGRAPHY.caption.size, 
          color: 'var(--color-text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '0.375rem',
          borderTop: '1px solid rgba(100, 116, 139, 0.15)'
        }}>
          <span>Book: {(impliedProb * 100).toFixed(0)}%</span>
          <span>Model: {(modelProb * 100).toFixed(0)}%</span>
          {edgePts !== null && (
            <span style={{ color: edgePts > 0 ? evColor.color : 'var(--color-text-muted)' }}>
              ({edgePts > 0 ? '+' : ''}{edgePts.toFixed(1)}pts)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Markets Grid Component
const MarketsGrid = ({ game, isMobile }) => {
  if (!game.edges) return null;
  
  const bestEvValue = Math.max(
    game.edges.moneyline?.away?.evPercent || 0,
    game.edges.moneyline?.home?.evPercent || 0,
    game.edges.total?.over?.evPercent || 0,
    game.edges.total?.under?.evPercent || 0
  );
  
  // Mobile: Swipeable carousel
  if (isMobile) {
    return (
      <div style={{
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        display: 'flex',
        gap: MOBILE_SPACING.sectionGap,
        padding: MOBILE_SPACING.cardPadding,
        borderTop: ELEVATION.flat.border,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
      className="hide-scrollbar"
      >
        {/* Moneyline */}
        {game.edges.moneyline && (
          <div style={{ 
            background: GRADIENTS.moneyline,
            border: ELEVATION.raised.border,
            boxShadow: ELEVATION.raised.shadow,
            borderRadius: MOBILE_SPACING.borderRadius,
            padding: MOBILE_SPACING.innerPadding,
            minWidth: '85%',
            scrollSnapAlign: 'center',
            flex: '0 0 auto'
          }}>
            <div style={{ 
              fontSize: TYPOGRAPHY.label.size, 
              fontWeight: TYPOGRAPHY.heading.weight, 
              marginBottom: '0.75rem', 
              color: 'rgba(59, 130, 246, 0.95)',
              textTransform: TYPOGRAPHY.label.textTransform,
              letterSpacing: TYPOGRAPHY.label.letterSpacing
            }}>
              ⚡ MONEYLINE
            </div>
            
            <MarketRow 
              team={game.awayTeam}
              odds={game.edges.moneyline.away.odds}
              ev={game.edges.moneyline.away.evPercent}
              isPositive={game.edges.moneyline.away.evPercent > 0}
              isBestBet={game.edges.moneyline.away.evPercent === bestEvValue && game.edges.moneyline.away.evPercent > 5}
              modelProb={game.edges.moneyline.away.modelProb}
              impliedProb={getImpliedProbability(game.edges.moneyline.away.odds)}
            />
            
            <MarketRow 
              team={game.homeTeam}
              odds={game.edges.moneyline.home.odds}
              ev={game.edges.moneyline.home.evPercent}
              isPositive={game.edges.moneyline.home.evPercent > 0}
              isBestBet={game.edges.moneyline.home.evPercent === bestEvValue && game.edges.moneyline.home.evPercent > 5}
              modelProb={game.edges.moneyline.home.modelProb}
              impliedProb={getImpliedProbability(game.edges.moneyline.home.odds)}
            />
          </div>
        )}
        
        {/* Total */}
        {game.edges.total && game.rawOdds?.total?.line && (
          <div style={{ 
            background: GRADIENTS.total,
            border: ELEVATION.raised.border,
            boxShadow: ELEVATION.raised.shadow,
            borderRadius: MOBILE_SPACING.borderRadius,
            padding: MOBILE_SPACING.innerPadding,
            minWidth: '85%',
            scrollSnapAlign: 'center',
            flex: '0 0 auto'
          }}>
            <div style={{ 
              fontSize: TYPOGRAPHY.label.size, 
              fontWeight: TYPOGRAPHY.heading.weight, 
              marginBottom: '0.75rem', 
              color: 'rgba(168, 85, 247, 0.95)',
              textTransform: TYPOGRAPHY.label.textTransform,
              letterSpacing: TYPOGRAPHY.label.letterSpacing
            }}>
              🎯 TOTAL
            </div>
            
            <MarketRow 
              team={`O ${game.rawOdds.total.line}`}
              odds={game.edges.total.over.odds}
              ev={game.edges.total.over.evPercent}
              isPositive={game.edges.total.over.evPercent > 0}
              isBestBet={game.edges.total.over.evPercent === bestEvValue && game.edges.total.over.evPercent > 5}
              modelProb={game.edges.total.over.modelProb}
              impliedProb={getImpliedProbability(game.edges.total.over.odds)}
            />
            
            <MarketRow 
              team={`U ${game.rawOdds.total.line}`}
              odds={game.edges.total.under.odds}
              ev={game.edges.total.under.evPercent}
              isPositive={game.edges.total.under.evPercent > 0}
              isBestBet={game.edges.total.under.evPercent === bestEvValue && game.edges.total.under.evPercent > 5}
              modelProb={game.edges.total.under.modelProb}
              impliedProb={getImpliedProbability(game.edges.total.under.odds)}
            />
          </div>
        )}
      </div>
    );
  }
  
  // Desktop: Grid layout
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr',
      gap: '1.25rem',
      padding: '1.25rem',
      borderTop: ELEVATION.flat.border
    }}>
      {/* Moneyline */}
      {game.edges.moneyline && (
        <div style={{ 
          background: GRADIENTS.moneyline,
          border: ELEVATION.raised.border,
          boxShadow: ELEVATION.raised.shadow,
          borderRadius: '10px',
          padding: '1.25rem'
        }}>
          <div style={{ 
            fontSize: TYPOGRAPHY.label.size, 
            fontWeight: TYPOGRAPHY.heading.weight, 
            marginBottom: '0.875rem', 
            color: 'rgba(59, 130, 246, 0.95)',
            textTransform: TYPOGRAPHY.label.textTransform,
            letterSpacing: TYPOGRAPHY.label.letterSpacing
          }}>
            ⚡ MONEYLINE
          </div>
          
          <MarketRow 
            team={game.awayTeam}
            odds={game.edges.moneyline.away.odds}
            ev={game.edges.moneyline.away.evPercent}
            isPositive={game.edges.moneyline.away.evPercent > 0}
            isBestBet={game.edges.moneyline.away.evPercent === bestEvValue && game.edges.moneyline.away.evPercent > 5}
            modelProb={game.edges.moneyline.away.modelProb}
            impliedProb={getImpliedProbability(game.edges.moneyline.away.odds)}
          />
          
          <MarketRow 
            team={game.homeTeam}
            odds={game.edges.moneyline.home.odds}
            ev={game.edges.moneyline.home.evPercent}
            isPositive={game.edges.moneyline.home.evPercent > 0}
            isBestBet={game.edges.moneyline.home.evPercent === bestEvValue && game.edges.moneyline.home.evPercent > 5}
            modelProb={game.edges.moneyline.home.modelProb}
            impliedProb={getImpliedProbability(game.edges.moneyline.home.odds)}
          />
        </div>
      )}
      
      {/* Total */}
      {game.edges.total && game.rawOdds?.total?.line && (
        <div style={{ 
          background: GRADIENTS.total,
          border: ELEVATION.raised.border,
          boxShadow: ELEVATION.raised.shadow,
          borderRadius: '10px',
          padding: '1.25rem'
        }}>
          <div style={{ 
            fontSize: TYPOGRAPHY.label.size, 
            fontWeight: TYPOGRAPHY.heading.weight, 
            marginBottom: '0.875rem', 
            color: 'rgba(168, 85, 247, 0.95)',
            textTransform: TYPOGRAPHY.label.textTransform,
            letterSpacing: TYPOGRAPHY.label.letterSpacing
          }}>
            🎯 TOTAL
          </div>
          
          <MarketRow 
            team={`O ${game.rawOdds.total.line}`}
            odds={game.edges.total.over.odds}
            ev={game.edges.total.over.evPercent}
            isPositive={game.edges.total.over.evPercent > 0}
            isBestBet={game.edges.total.over.evPercent === bestEvValue && game.edges.total.over.evPercent > 5}
            modelProb={game.edges.total.over.modelProb}
            impliedProb={getImpliedProbability(game.edges.total.over.odds)}
          />
          
          <MarketRow 
            team={`U ${game.rawOdds.total.line}`}
            odds={game.edges.total.under.odds}
            ev={game.edges.total.under.evPercent}
            isPositive={game.edges.total.under.evPercent > 0}
            isBestBet={game.edges.total.under.evPercent === bestEvValue && game.edges.total.under.evPercent > 5}
            modelProb={game.edges.total.under.modelProb}
            impliedProb={getImpliedProbability(game.edges.total.under.odds)}
          />
        </div>
      )}
    </div>
  );
};

// ========================================
// MAIN COMPONENT
// ========================================

const TodaysGames = ({ dataProcessor, oddsData, startingGoalies, goalieData, statsAnalyzer, edgeFactorCalc }) => {
  const [edgeCalculator, setEdgeCalculator] = useState(null);
  const [allEdges, setAllEdges] = useState([]);
  const [topEdges, setTopEdges] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedGame, setExpandedGame] = useState(null);
  const { scores: liveScores } = useLiveScores(); // Real-time live scores from Firestore
  const { bets: firebaseBets } = useFirebaseBets(); // Fetch today's bets from Firebase
  const [goalieProcessor, setGoalieProcessor] = useState(null);
  
  // FIREBASE: Auto-track all recommended bets
  useBetTracking(allEdges, dataProcessor);
  
  // Initialize GoalieProcessor when goalies.csv data is available
  useEffect(() => {
    if (goalieData && Array.isArray(goalieData) && goalieData.length > 0) {
      console.log(`🥅 Initializing GoalieProcessor with ${goalieData.length} goalie records`);
      const processor = new GoalieProcessor(goalieData);
      setGoalieProcessor(processor);
    }
  }, [goalieData]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize edge calculator
  useEffect(() => {
    if (dataProcessor && oddsData) {
      // FIX: Pass starting goalies to EdgeCalculator
      const calculator = new EdgeCalculator(dataProcessor, oddsData, startingGoalies);
      setEdgeCalculator(calculator);
      
      const edges = calculator.calculateAllEdges();
      setAllEdges(edges);
      
      // CONSULTANT FIX: Run model validation to detect systematic bias
      validatePredictions(edges);
      
      // Get all opportunities (games with positive EV)
      const topOpportunities = calculator.getTopEdges(0); // 0 = all with positive EV
      setTopEdges(topOpportunities);
    }
  }, [dataProcessor, oddsData, startingGoalies]);
  
  // Helper function to get goalie stats for a team
  const getGoalieForTeam = (teamCode) => {
    if (!startingGoalies || !startingGoalies.games) {
      return null;
    }
    
    // Find the game for this team
    const game = startingGoalies.games.find(g =>
      g.away?.team === teamCode || g.home?.team === teamCode
    );
    
    if (!game) return null;
    
    const isAway = game.away?.team === teamCode;
    const goalieData = isAway ? game.away : game.home;
    
    // If goalie not confirmed, return null (will show waiting state)
    if (!goalieData || !goalieData.goalie || !goalieData.confirmed) {
      return null;
    }
    
    // Try to get advanced stats from goalies.csv
    const stats = goalieProcessor ? goalieProcessor.getGoalieStats(goalieData.goalie, teamCode) : null;
    
    // Return goalie with or without stats
    return {
      name: goalieData.goalie,
      team: teamCode,
      confirmed: true,
      ...(stats || {}) // Spread stats if available
    };
  };
  
  // Calculate opportunities with consistent logic
  // STANDARD DEFINITIONS:
  // - Opportunity = Any game with at least one bet having EV > 0%
  // - High Value = Any opportunity with best bet EV > 5%
  const getOpportunityCounts = () => {
    // Filter to only games that have at least one positive EV bet
    const opportunities = allEdges.filter(game => {
      let hasPositiveEV = false;
      
      // Check moneyline
      if (game.edges.moneyline?.away?.evPercent > 0 || game.edges.moneyline?.home?.evPercent > 0) {
        hasPositiveEV = true;
      }
      
      // Check totals
      if (game.edges.total?.over?.evPercent > 0 || game.edges.total?.under?.evPercent > 0) {
        hasPositiveEV = true;
      }
      
      return hasPositiveEV;
    });
    
    // High value = GAMES (not individual bets) where BEST bet has EV > 5%
    // This matches QuickSummary's logic exactly
    const highValue = opportunities.filter(game => {
      let bestEV = 0;
      
      // Check moneyline
      if (game.edges.moneyline) {
        if (game.edges.moneyline.away?.evPercent > bestEV) bestEV = game.edges.moneyline.away.evPercent;
        if (game.edges.moneyline.home?.evPercent > bestEV) bestEV = game.edges.moneyline.home.evPercent;
      }
      
      // Check totals
      if (game.edges.total) {
        if (game.edges.total.over?.evPercent > bestEV) bestEV = game.edges.total.over.evPercent;
        if (game.edges.total.under?.evPercent > bestEV) bestEV = game.edges.total.under.evPercent;
      }
      
      return bestEV > 5;
    }).length;
    
    return {
      total: opportunities.length,
      highValue: highValue
    };
  };
  
  const opportunityCounts = getOpportunityCounts();

  // Smooth scroll handler for QuickSummary navigation
  const handleGameClick = (gameName) => {
    const gameId = `game-${gameName.replace(/\s/g, '-')}`;
    const element = document.getElementById(gameId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Generate analytics data for a game
  const generateAnalyticsData = (game, bestEdge) => {
    if (!statsAnalyzer || !edgeFactorCalc) return null;

    try {
      // Determine bet type from bestEdge
      const betType = bestEdge?.market || 'TOTAL';
      
      // Get key factors for this bet type
      const factors = edgeFactorCalc.getKeyFactors(game.awayTeam, game.homeTeam, betType);
      
      // Generate "The Story" narrative
      const story = edgeFactorCalc.generateStory(factors, game.awayTeam, game.homeTeam);
      
      // Calculate total impact
      const totalImpact = edgeFactorCalc.calculateTotalImpact(factors);
      
      // Get danger zone data
      const awayDangerZone = statsAnalyzer.getDangerZoneBreakdown(game.awayTeam);
      const homeDangerZone = statsAnalyzer.getDangerZoneBreakdown(game.homeTeam);
      const dangerZoneData = awayDangerZone && homeDangerZone 
        ? VisualMetricsGenerator.generateDangerZoneHeatmap(awayDangerZone, homeDangerZone)
        : null;
      
      // Get rebound data
      const awayRebound = statsAnalyzer.getReboundMetrics(game.awayTeam);
      const homeRebound = statsAnalyzer.getReboundMetrics(game.homeTeam);
      const reboundData = awayRebound && homeRebound
        ? VisualMetricsGenerator.generateReboundTable(awayRebound, homeRebound)
        : null;
      
      // Get physical data
      const awayPhysical = statsAnalyzer.getPhysicalMetrics(game.awayTeam);
      const homePhysical = statsAnalyzer.getPhysicalMetrics(game.homeTeam);
      const physicalData = awayPhysical && homePhysical
        ? VisualMetricsGenerator.generatePhysicalMetrics(awayPhysical, homePhysical)
        : null;
      
      // Get possession data
      const awayPossession = statsAnalyzer.getPossessionMetrics(game.awayTeam);
      const homePossession = statsAnalyzer.getPossessionMetrics(game.homeTeam);
      const possessionData = awayPossession && homePossession
        ? { away: awayPossession, home: homePossession }
        : null;
      
      // Get regression data
      const awayRegression = statsAnalyzer.getRegressionIndicators(game.awayTeam);
      const homeRegression = statsAnalyzer.getRegressionIndicators(game.homeTeam);
      const regressionData = awayRegression && homeRegression
        ? { away: awayRegression, home: homeRegression }
        : null;
      
      return {
        factors,
        story,
        totalImpact,
        dangerZoneData,
        reboundData,
        physicalData,
        possessionData,
        regressionData
      };
    } catch (error) {
      console.error('Error generating analytics data:', error);
      return null;
    }
  };

  if (!oddsData) {
    return (
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: isMobile ? '1rem' : '2rem 1rem' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          paddingBottom: isMobile ? '1rem' : '2rem', 
          borderBottom: '1px solid var(--color-border)', 
          marginBottom: isMobile ? '1rem' : '2rem' 
        }}>
          <Calendar size={isMobile ? 24 : 32} color="var(--color-accent)" />
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>Today's Games</h1>
            <p style={{ 
              color: 'var(--color-text-secondary)', 
              fontSize: isMobile ? '0.875rem' : '0.938rem',
              margin: 0
            }}>
              In-depth analysis of today's matchups with advanced metrics
            </p>
          </div>
        </div>

        <div className="elevated-card" style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '3rem' }}>
          <Calendar size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Games Available</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Add today's odds files to see game analysis and betting opportunities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: isMobile ? '1rem' : '2rem 1rem' }} className="animate-fade-in">
      {/* PREMIUM HERO SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '16px',
        padding: isMobile ? '1.5rem' : '2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background shine */}
        <div className="shine-overlay" />
        
        {/* Header content with live time */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'flex-start',
          gap: isMobile ? '1.5rem' : '2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <Calendar size={32} color="var(--color-accent)" />
              <div>
                <h1 className="text-gradient" style={{ 
                  fontSize: isMobile ? '1.75rem' : '2.5rem',
                  fontWeight: '800',
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.1'
                }}>
                  Today's Games
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--color-text-muted)',
                    fontWeight: '500'
                  }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                  <LiveClock />
                  
                  {/* Goalie Confirmation Status */}
                  {startingGoalies && startingGoalies.games && (
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#10B981',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      🥅 {(() => {
                        let confirmed = 0;
                        let total = 0;
                        startingGoalies.games.forEach(game => {
                          // Handle both old format (goalie exists = confirmed) and new format (confirmed property)
                          if (game.away?.goalie && (game.away?.confirmed !== false)) confirmed++;
                          if (game.home?.goalie && (game.home?.confirmed !== false)) confirmed++;
                          total += 2;
                        });
                        return `${confirmed}/${total} Goalies`;
                      })()}
                    </span>
                  )}
                  
                  {/* Odds Last Updated */}
                  {startingGoalies?.oddsLastUpdated && (
                    <span style={{
                      fontSize: '0.8rem',
                      padding: '0.375rem 0.625rem',
                      borderRadius: '6px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      color: '#60A5FA',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      📊 Odds: {(() => {
                        const lastUpdated = new Date(startingGoalies.oddsLastUpdated);
                        const now = new Date();
                        const diffMinutes = Math.floor((now - lastUpdated) / (1000 * 60));
                        
                        if (diffMinutes < 1) return 'Just updated';
                        if (diffMinutes < 60) return `Updated ${diffMinutes}m ago`;
                        const diffHours = Math.floor(diffMinutes / 60);
                        if (diffHours < 24) return `Updated ${diffHours}h ago`;
                        return `Updated ${lastUpdated.toLocaleTimeString()}`;
                      })()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!isMobile && (
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                fontSize: '0.875rem',
                lineHeight: '1.6',
                maxWidth: '45rem',
                marginTop: '0.75rem'
              }}>
                Institutional-grade analysis using advanced metrics to identify betting edges. 
                Full mathematical transparency with score-adjusted xG, PDO regression, and probabilistic modeling.
              </p>
            )}
          </div>
          
          {/* Animated stats pills */}
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem',
            flexDirection: isMobile ? 'row' : 'column',
            alignItems: isMobile ? 'flex-start' : 'flex-end'
          }}>
            <AnimatedStatPill 
              icon={<BarChart3 size={16} />}
            value={opportunityCounts.total}
            label="Opportunities"
              color="info"
            />
            <AnimatedStatPill 
              icon={<TrendingUp size={16} />}
            value={opportunityCounts.highValue}
              label="High Value"
              color="success"
              sparkle
            />
          </div>
        </div>
        
        {/* Countdown to first game */}
        {allEdges.length > 0 && allEdges[0].gameTime && (
          <GameCountdown firstGameTime={allEdges[0].gameTime} />
        )}
      </div>

      {/* Quick Summary Table */}
      <QuickSummary 
        allEdges={allEdges}
        dataProcessor={dataProcessor}
        onGameClick={handleGameClick}
      />

      {/* Deep Analytics Cards for Each Game */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: isMobile ? '1.5rem' : '2rem' }}>
        {allEdges.map((game, index) => {
          // Find the best edge for this game to show in narrative
          const bestEdge = topEdges
            .filter(e => e.game === game.game && e.evPercent > 0)
            .sort((a, b) => b.evPercent - a.evPercent)[0];

          return (
            <div 
              key={index}
              id={`game-${game.game.replace(/\s/g, '-')}`}
              className="elevated-card game-card hover-lift"
              style={{
                animationDelay: `${index * 0.1}s`,
                position: 'relative'
              }}
            >
              {/* ===================================== */}
              {/* NEW COHESIVE GAME CARD STRUCTURE     */}
              {/* ===================================== */}
              
              {/* 1. Compact Header - Game context first */}
              <CompactHeader
                awayTeam={game.awayTeam}
                homeTeam={game.homeTeam}
                gameTime={game.gameTime}
                rating={bestEdge?.evPercent || 0}
                awayWinProb={game.edges.moneyline?.away?.modelProb}
                homeWinProb={game.edges.moneyline?.home?.modelProb}
                isMobile={isMobile}
              />
              
              {/* 2. Hero Bet Card - Best value proposition */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                return (
                  <HeroBetCard
                    bestEdge={bestEdge}
                    game={game}
                    isMobile={isMobile}
                    factors={analyticsData?.factors || []}
                  />
                );
              })()}
              
              {/* 2.5. Quick Story - Plain language explanation */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                if (bestEdge && analyticsData && analyticsData.factors) {
                  return (
                    <QuickStory
                      game={game}
                      bestEdge={bestEdge}
                      factors={analyticsData.factors}
                      isMobile={isMobile}
                    />
                  );
                }
                return null;
                })()}
              
              {/* 3. Compact Factors - Top 3 critical factors */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                if (analyticsData && analyticsData.factors && analyticsData.factors.length > 0) {
                  return (
                    <CompactFactors
                      factors={analyticsData.factors}
                      totalImpact={analyticsData.totalImpact}
                      awayTeam={game.awayTeam}
                      homeTeam={game.homeTeam}
                      isMobile={isMobile}
                      bestEdge={bestEdge}
                    />
                  );
                }
                return null;
              })()}
              
              {/* 3b. Alternative Bet Card - Secondary opportunities */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                return (
                  <AlternativeBetCard 
                    game={game}
                    bestEdge={bestEdge}
                    awayTeam={game.awayTeam}
                    homeTeam={game.homeTeam}
                    isMobile={isMobile}
                    factors={analyticsData?.factors || []}
                  />
                );
              })()}
              
              {/* 4. Markets Grid - Moneyline + Total */}
              <MarketsGrid game={game} isMobile={isMobile} />
              
              {/* 5. Expandable Deep Analytics */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                if (analyticsData) {
                  return (
                    <AdvancedMatchupDetails
                    awayTeam={game.awayTeam}
                    homeTeam={game.homeTeam}
                      dangerZoneData={analyticsData.dangerZoneData}
                      reboundData={analyticsData.reboundData}
                      physicalData={analyticsData.physicalData}
                      possessionData={analyticsData.possessionData}
                      regressionData={analyticsData.regressionData}
                      awayGoalie={getGoalieForTeam(game.awayTeam)}
                      homeGoalie={getGoalieForTeam(game.homeTeam)}
                      isMobile={isMobile}
                      bestEdge={bestEdge}
                      statsAnalyzer={statsAnalyzer}
                    />
                  );
                }
                return null;
              })()}
            </div>
          );
        })}
      </div>

      {/* No games message or show live scores */}
      {allEdges.length === 0 && (
        <>
          {/* Show live games from Firestore if available */}
          {liveScores && liveScores.length > 0 ? (
            <div>
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem 1rem 1rem',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <Activity size={32} color="#EF4444" style={{ margin: '0 auto 0.75rem auto', animation: 'pulse 1.5s infinite' }} />
                <h3 style={{ marginBottom: '0.5rem', color: '#EF4444' }}>Live Games</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  Showing {liveScores.length} game{liveScores.length > 1 ? 's' : ''} in progress
                </p>
              </div>
              
              {liveScores.map((game, idx) => {
                // Find bets from Firebase that match this game
                const gameMatchup = `${game.awayTeam} @ ${game.homeTeam}`;
                const gameBets = firebaseBets
                  .filter(bet => {
                    // Match by team names
                    const betMatchup = `${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`;
                    return betMatchup === gameMatchup;
                  })
                  .map(bet => ({
                    // Convert Firebase bet format to edge format for compatibility
                    market: bet.bet?.market,
                    pick: bet.bet?.pick,
                    team: bet.bet?.team,
                    odds: bet.bet?.odds,
                    line: bet.bet?.line,
                    evPercent: bet.prediction?.evPercent || 0,
                    modelProb: bet.prediction?.modelProb || 0
                  }));
                
                // Calculate bet outcomes
                const calculateBetOutcome = (edge) => {
                  if (game.status !== 'FINAL') return { status: 'pending', pnl: 0 };
                  
                  const totalScore = game.awayScore + game.homeScore;
                  let won = false;
                  
                  if (edge.market === 'MONEYLINE') {
                    const betTeam = edge.team;
                    const awayWon = game.awayScore > game.homeScore;
                    const homeWon = game.homeScore > game.awayScore;
                    won = (betTeam === game.awayTeam && awayWon) || (betTeam === game.homeTeam && homeWon);
                  } else if (edge.market === 'TOTAL') {
                    const isOver = edge.pick.includes('OVER');
                    const line = parseFloat(edge.pick.match(/[\d.]+/)[0]);
                    won = isOver ? (totalScore > line) : (totalScore < line);
                  }
                  
                  // Calculate P&L (assuming $100 bet)
                  const odds = edge.odds;
                  const pnl = won ? (odds > 0 ? odds : (100 / Math.abs(odds)) * 100) : -100;
                  
                  return { status: won ? 'won' : 'lost', pnl };
                };
                
                return (
                  <div 
                    key={game.gameId || idx} 
                    className="elevated-card" 
                    style={{ 
                      marginBottom: '1.5rem',
                      padding: 0,
                      background: game.status === 'LIVE' 
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(26, 31, 46, 1) 100%)' 
                        : game.status === 'FINAL'
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(26, 31, 46, 1) 100%)'
                        : 'var(--color-bg-secondary)',
                      border: game.status === 'LIVE' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--color-border)',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Header with status */}
                    <div style={{ 
                      padding: isMobile ? '1rem' : '1.5rem',
                      borderBottom: '1px solid var(--color-border)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: isMobile ? '1.1rem' : '1.4rem', fontWeight: 'bold', letterSpacing: '0.02em' }}>
                          {game.awayTeam} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9em' }}>@</span> {game.homeTeam}
                        </div>
                        {game.status === 'LIVE' && (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            background: 'rgba(239, 68, 68, 0.2)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            color: '#EF4444',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            animation: 'pulse 1.5s infinite'
                          }}>
                            <Activity size={14} />
                            LIVE
                          </div>
                        )}
                        {game.status === 'FINAL' && (
                          <div style={{ 
                            background: 'rgba(16, 185, 129, 0.2)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            color: '#10B981',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                          }}>
                            FINAL
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Score Display */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: isMobile ? '2rem' : '4rem',
                      padding: isMobile ? '2rem 1rem' : '3rem 1.5rem',
                      background: 'rgba(0, 0, 0, 0.2)'
                    }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ 
                          fontSize: isMobile ? '0.75rem' : '0.875rem', 
                          color: 'var(--color-text-muted)', 
                          marginBottom: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em'
                        }}>
                          {game.awayTeam}
                        </div>
                        <div style={{ 
                          fontSize: isMobile ? '3rem' : '4rem', 
                          fontWeight: 'bold',
                          color: game.status === 'LIVE' ? '#EF4444' : '#10B981',
                          textShadow: game.status === 'LIVE' ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none'
                        }}>
                          {game.awayScore}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: isMobile ? '1.5rem' : '2rem', 
                        color: 'var(--color-text-muted)',
                        fontWeight: '300'
                      }}>—</div>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ 
                          fontSize: isMobile ? '0.75rem' : '0.875rem', 
                          color: 'var(--color-text-muted)', 
                          marginBottom: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em'
                        }}>
                          {game.homeTeam}
                        </div>
                        <div style={{ 
                          fontSize: isMobile ? '3rem' : '4rem', 
                          fontWeight: 'bold',
                          color: game.status === 'LIVE' ? '#EF4444' : '#10B981',
                          textShadow: game.status === 'LIVE' ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none'
                        }}>
                          {game.homeScore}
                        </div>
                      </div>
                    </div>
                    
                    {/* Game Status Info */}
                    {game.clock && (
                      <div style={{ 
                        textAlign: 'center',
                        padding: '1rem',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderTop: '1px solid var(--color-border)',
                        borderBottom: '1px solid var(--color-border)'
                      }}>
                        <div style={{ 
                          color: game.status === 'LIVE' ? '#EF4444' : 'var(--color-text-muted)',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          letterSpacing: '0.05em'
                        }}>
                          {game.period && `Period ${game.period} • `}{game.clock}
                        </div>
                      </div>
                    )}
                    
                    {/* Bet Tracker Section */}
                    {gameBets.length > 0 && (
                      <div style={{ 
                        padding: isMobile ? '1rem' : '1.5rem',
                        background: 'rgba(0, 0, 0, 0.2)'
                      }}>
                        <div style={{ 
                          fontSize: '0.875rem',
                          color: 'var(--color-text-muted)',
                          marginBottom: '1rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span>📊</span> YOUR BETS ({gameBets.length})
                        </div>
                        
                        {gameBets.slice(0, 3).map((bet, betIdx) => {
                          const outcome = calculateBetOutcome(bet);
                          const isWinning = outcome.status === 'won';
                          const isLosing = outcome.status === 'lost';
                          
                          return (
                            <div 
                              key={betIdx}
                              style={{ 
                                marginBottom: betIdx < Math.min(gameBets.length, 3) - 1 ? '0.75rem' : 0,
                                padding: '1rem',
                                background: isWinning 
                                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                                  : isLosing
                                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)'
                                  : 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '8px',
                                border: `1px solid ${isWinning ? 'rgba(16, 185, 129, 0.3)' : isLosing ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-border)'}`,
                                position: 'relative'
                              }}
                            >
                              {/* Bet outcome badge */}
                              {outcome.status !== 'pending' && (
                                <div style={{ 
                                  position: 'absolute',
                                  top: '0.5rem',
                                  right: '0.5rem',
                                  background: isWinning ? '#10B981' : '#EF4444',
                                  color: 'white',
                                  padding: '0.25rem 0.625rem',
                                  borderRadius: '12px',
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em'
                                }}>
                                  {isWinning ? 'WON' : 'LOST'}
                                </div>
                              )}
                              
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                marginBottom: '0.5rem'
                              }}>
                                <div>
                                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                                    {bet.pick}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                    {bet.market} • {bet.odds > 0 ? '+' : ''}{bet.odds}
                                  </div>
                                </div>
                                {outcome.status !== 'pending' && (
                                  <div style={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: 'bold',
                                    color: isWinning ? '#10B981' : '#EF4444'
                                  }}>
                                    {outcome.pnl > 0 ? '+' : ''}{outcome.pnl.toFixed(0)}
                                  </div>
                                )}
                              </div>
                              
                              {outcome.status === 'pending' && game.status === 'LIVE' && (
                                <div style={{ 
                                  fontSize: '0.75rem', 
                                  color: '#EF4444',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.375rem',
                                  marginTop: '0.5rem'
                                }}>
                                  <Activity size={12} />
                                  Tracking live...
                                </div>
                              )}
                            </div>
                          );
                        })}
                        
                        {gameBets.length > 3 && (
                          <div style={{ 
                            marginTop: '0.75rem',
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            textAlign: 'center'
                          }}>
                            +{gameBets.length - 3} more bet{gameBets.length - 3 > 1 ? 's' : ''}
                          </div>
                        )}
                        
                        {/* Total P&L Summary */}
                        {game.status === 'FINAL' && (
                          <div style={{ 
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{ 
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              Total P&L
                            </div>
                            <div style={{ 
                              fontSize: '1.25rem', 
                              fontWeight: 'bold',
                              color: (() => {
                                const totalPnl = gameBets.reduce((sum, bet) => sum + calculateBetOutcome(bet).pnl, 0);
                                return totalPnl > 0 ? '#10B981' : totalPnl < 0 ? '#EF4444' : 'var(--color-text-muted)';
                              })()
                            }}>
                              {(() => {
                                const totalPnl = gameBets.reduce((sum, bet) => sum + calculateBetOutcome(bet).pnl, 0);
                                return (totalPnl > 0 ? '+' : '') + totalPnl.toFixed(0);
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                marginTop: '1rem'
              }}>
                <p>
                  ⚠️ Betting analysis not available for live games.
                </p>
                <p style={{ marginTop: '0.5rem' }}>
                  Check back tomorrow for tomorrow's betting opportunities!
                </p>
              </div>
            </div>
          ) : (
            <div className="elevated-card" style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '3rem' }}>
              <Calendar size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No Games Today</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Check back later for today's matchups and analysis.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TodaysGames;
