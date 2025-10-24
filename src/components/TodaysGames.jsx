import { useState, useEffect, useCallback } from 'react';
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
import CollapsibleGameCard from './CollapsibleGameCard';
import StepSection from './StepSection';
import QuickStatsBar from './QuickStatsBar';

// ========================================
// INLINE HELPER COMPONENTS
// ========================================

// Compact Header - REDESIGNED for density and scannability
const CompactHeader = ({ awayTeam, homeTeam, gameTime, rating, awayWinProb, homeWinProb, isMobile, bestEdge, isCollapsed, game, dataProcessor }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    padding: isMobile ? '0.75rem' : '0.875rem', // REDUCED from 1.25rem
    borderBottom: isCollapsed ? 'none' : ELEVATION.flat.border,
    background: 'rgba(26, 31, 46, 0.3)'
  }}>
    {/* Top row: Teams with inline badges */}
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem', // Tighter
      gap: '0.75rem'
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '0.625rem', flexWrap: 'wrap' }}>
          <span style={{ 
            fontSize: isMobile ? '1.125rem' : '1.25rem', 
            fontWeight: '800', 
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.01em'
          }}>
            {awayTeam} <span style={{ color: 'var(--color-text-muted)', fontWeight: '400' }}>@</span> {homeTeam}
          </span>
          {rating > 0 && <RatingBadge evPercent={rating} size="small" />}
        </div>
        
        {/* Win Probabilities as BADGES - promoted */}
        {awayWinProb && homeWinProb && (
          <div style={{ 
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.375rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              padding: '0.25rem 0.5rem',
              background: awayWinProb > homeWinProb ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: awayWinProb > homeWinProb ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: awayWinProb > homeWinProb ? '#10B981' : 'var(--color-text-secondary)'
            }}>
              {awayTeam} {(awayWinProb * 100).toFixed(0)}%
            </div>
            <div style={{
              padding: '0.25rem 0.5rem',
              background: homeWinProb > awayWinProb ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: homeWinProb > awayWinProb ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: homeWinProb > awayWinProb ? '#10B981' : 'var(--color-text-secondary)'
            }}>
              {homeTeam} {(homeWinProb * 100).toFixed(0)}%
            </div>
          </div>
        )}
      </div>
      
      {/* Game time - compact */}
      <div style={{ 
        fontSize: '0.75rem', 
        color: 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        fontWeight: '600',
        whiteSpace: 'nowrap'
      }}>
        <Calendar size={12} />
        {gameTime}
      </div>
    </div>
    
    {/* Best bet preview - SINGLE LINE when collapsed */}
    {isCollapsed && bestEdge && (
      <div style={{
        padding: isMobile ? '0.5rem 0.625rem' : '0.5rem 0.75rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
        borderRadius: '6px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          flex: 1,
          minWidth: 0,
          fontSize: isMobile ? '0.75rem' : '0.813rem',
          fontWeight: '700'
        }}>
          <span style={{ fontSize: '1rem' }}>💰</span>
          <span style={{ 
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {bestEdge.pick}
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontWeight: '600', fontSize: '0.688rem' }}>
            {bestEdge.odds > 0 ? '+' : ''}{bestEdge.odds}
          </span>
        </div>
        <div style={{
          padding: '0.25rem 0.5rem',
          background: getEVColorScale(bestEdge.evPercent).background,
          border: `1px solid ${getEVColorScale(bestEdge.evPercent).border}`,
          borderRadius: '6px',
          fontSize: '0.813rem',
          fontWeight: '800',
          color: getEVColorScale(bestEdge.evPercent).color,
          whiteSpace: 'nowrap'
        }}>
          +{bestEdge.evPercent.toFixed(1)}%
        </div>
      </div>
    )}
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
      borderRadius: '10px',
      padding: isMobile ? '0.75rem' : '0.875rem', // REDUCED from 1.5rem
      margin: 0, // Removed margin since StepSection handles it
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
        borderRadius: '10px',
        padding: isMobile ? '0.75rem' : '0.875rem', // REDUCED from 1.5rem
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
        padding: isMobile ? '0.625rem' : '0.75rem', // REDUCED for compactness
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
      <div style={{ padding: isMobile ? '0.625rem' : '0.75rem' }}> {/* REDUCED */}
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
            // TOTAL-specific: REWRITTEN to be specific and helpful
            const direction = factor.impact > 0 ? 'OVER' : 'UNDER';
            const impactAmount = Math.abs(factor.impact).toFixed(2);
            
            // Build context-specific explanation
            if (factor.name.includes('Expected Goals')) {
              // Show which team has offense/defense advantage
              const awayXGF = factor.awayMetric?.value || 0;
              const homeXGF = factor.homeMetric?.value || 0;
              const betterOffense = awayXGF > homeXGF ? game.awayTeam : game.homeTeam;
              const offenseRank = Math.max(awayXGF, homeXGF) > 2.7 ? 'elite' : Math.max(awayXGF, homeXGF) > 2.5 ? 'strong' : 'solid';
              
              return `${betterOffense}'s ${offenseRank} offense (${Math.max(awayXGF, homeXGF).toFixed(2)} xGF/60) creates ${impactAmount}-goal ${direction} edge.`;
            } else if (factor.name.includes('Against') || factor.name.includes('Defense')) {
              // Show defensive advantage
              const awayXGA = factor.awayMetric?.value || 0;
              const homeXGA = factor.homeMetric?.value || 0;
              const betterDefense = awayXGA < homeXGA ? game.awayTeam : game.homeTeam;
              const defenseRank = Math.min(awayXGA, homeXGA) < 2.3 ? 'elite' : Math.min(awayXGA, homeXGA) < 2.5 ? 'strong' : 'solid';
              
              return `${betterDefense}'s ${defenseRank} defense (${Math.min(awayXGA, homeXGA).toFixed(2)} xGA/60) limits scoring, ${impactAmount}-goal ${direction} edge.`;
            } else if (factor.name.includes('Power Play')) {
              return `Special teams advantage creates ${impactAmount}-goal ${direction} edge.`;
            } else if (factor.name.includes('PDO') || factor.name.includes('Regression')) {
              const team = factor.impact < 0 ? 
                (factor.awayMetric?.value > factor.homeMetric?.value ? game.awayTeam : game.homeTeam) :
                (factor.awayMetric?.value < factor.homeMetric?.value ? game.awayTeam : game.homeTeam);
              return `${team}'s regression indicators point toward ${impactAmount}-goal ${direction} edge.`;
            }
            
            // Fallback with some context
            return `${factor.name} matchup creates ${impactAmount}-goal ${direction} edge.`;
          }
          
          return factor.explanation; // fallback
        };
        
        const explanation = getBetSpecificExplanation();
        
        return (
          <div key={idx} style={{ 
            marginBottom: idx < topFactors.length - 1 ? '0.625rem' : '0', // REDUCED
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px', // Tighter
            padding: '0.75rem', // REDUCED from 1rem
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
      borderRadius: '10px',
      padding: isMobile ? '0.75rem' : '0.875rem', // REDUCED from 1.25rem
      margin: 0, // Removed since StepSection handles spacing
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
  // CRITICAL: Wrapped in useCallback to ensure re-renders when goalieProcessor initializes
  const getGoalieForTeam = useCallback((teamCode) => {
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
    console.log(`🥅 TodaysGames getGoalieForTeam: ${goalieData.goalie} (${teamCode})`, { found: !!stats, hasProcessor: !!goalieProcessor });
    
    // Return goalie with or without stats
    const result = {
      name: goalieData.goalie,
      team: teamCode,
      confirmed: true,
      ...(stats || {}) // Spread stats if available
    };
    console.log(`   📊 Returning goalie object:`, { name: result.name, hasGSAE: result.gsae !== undefined, gsae: result.gsae });
    return result;
  }, [goalieProcessor, startingGoalies]); // Re-create when goalieProcessor or startingGoalies change
  
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
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: isMobile ? '0.75rem' : '1.5rem 1rem' }} className="animate-fade-in">
      {/* ✨ ULTRA-COMPACT PREMIUM HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: isMobile ? '12px' : '14px',
        padding: isMobile ? '0.75rem 1rem' : '0.875rem 1.25rem',
        marginBottom: isMobile ? '1rem' : '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(212, 175, 55, 0.15) inset',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Animated gold shimmer gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.08), rgba(255, 215, 0, 0.12), rgba(212, 175, 55, 0.08), transparent)',
          animation: 'shimmer 4s infinite',
          pointerEvents: 'none'
        }} />
        
        {/* Ambient glow effect */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '20%',
          width: '60%',
          height: '200%',
          background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          opacity: 0.6
        }} />
        
        {/* Premium header content with sophisticated layout */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          gap: isMobile ? '1rem' : '1.5rem',
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          {/* Left: ULTRA-COMPACT Title & Badges - Everything inline */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '0.625rem', flexWrap: 'wrap' }}>
              {/* Compact calendar icon */}
              <Calendar size={isMobile ? 16 : 18} color="#D4AF37" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.5))' }} />
              
              <h1 style={{ 
                fontSize: isMobile ? '1rem' : '1.125rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                letterSpacing: '-0.01em',
                lineHeight: '1',
                whiteSpace: 'nowrap'
              }}>
                Today's Games
              </h1>
              
              {/* Inline date & time */}
              <span style={{ 
                fontSize: isMobile ? '0.688rem' : '0.75rem',
                color: 'rgba(212, 175, 55, 0.7)',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              
              <LiveClock />
              
              {/* Compact LIVE indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 6px #10B981',
                  animation: 'pulse 2s infinite'
                }} />
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: '700',
                  color: '#10B981',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  LIVE
                </span>
              </div>
              
              {/* Compact goalie status */}
              {startingGoalies && startingGoalies.games && (
                <span style={{
                  fontSize: '0.625rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#10B981',
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}>
                  🥅 {(() => {
                    let confirmed = 0;
                    let total = 0;
                    
                    if (startingGoalies && startingGoalies.games && Array.isArray(startingGoalies.games)) {
                      startingGoalies.games.forEach(game => {
                        total += 2;
                        if (game.away?.goalie) {
                          if (game.away.confirmed === undefined || game.away.confirmed === true) {
                            confirmed++;
                          }
                        }
                        if (game.home?.goalie) {
                          if (game.home.confirmed === undefined || game.home.confirmed === true) {
                            confirmed++;
                          }
                        }
                      });
                    }
                    return `${confirmed}/${total}`;
                  })()}
                </span>
              )}
            </div>
          </div>
          
          {/* Right: PREMIUM ELITE STAT BADGES - Redesigned for sophistication */}
          <div style={{ 
            display: 'flex',
            gap: isMobile ? '0.625rem' : '0.875rem',
            alignItems: 'center',
            flexShrink: 0,
            flexWrap: 'wrap'
          }}>
            {/* COMPACT Games Badge */}
            <div style={{
              textAlign: 'center',
              padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.75rem',
              background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.18) 0%, rgba(148, 163, 184, 0.08) 100%)',
              backdropFilter: 'blur(12px)',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.25)';
            }}>
              <div style={{
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1',
                marginBottom: '0.125rem'
              }}>
                {allEdges.length}
              </div>
              <div style={{
                fontSize: isMobile ? '0.563rem' : '0.625rem',
                color: 'rgba(203, 213, 225, 0.9)',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                GAMES
              </div>
            </div>
            
            {/* COMPACT +EV Badge */}
            <div style={{
              textAlign: 'center',
              padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.75rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.12) 100%)',
              backdropFilter: 'blur(12px)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
            }}>
              <div style={{
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1',
                marginBottom: '0.125rem'
              }}>
                {opportunityCounts.total}
              </div>
              <div style={{
                fontSize: isMobile ? '0.563rem' : '0.625rem',
                color: 'rgba(96, 165, 250, 1)',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                +EV
              </div>
            </div>
            
            {/* COMPACT Elite Badge - Still premium but smaller */}
            <div style={{
              textAlign: 'center',
              padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 0.75rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(255, 215, 0, 0.15) 100%)',
              backdropFilter: 'blur(12px)',
              borderRadius: '8px',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              boxShadow: '0 2px 10px rgba(212, 175, 55, 0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 175, 55, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(212, 175, 55, 0.35)';
            }}>
              <div style={{
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #FFD700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1',
                marginBottom: '0.125rem',
                filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.5))'
              }}>
                {opportunityCounts.highValue}
              </div>
              <div style={{
                fontSize: isMobile ? '0.563rem' : '0.625rem',
                background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.4))'
              }}>
                ELITE
              </div>
            </div>
          </div>
        </div>
        
        {/* Countdown to first game - compact version */}
        {allEdges.length > 0 && allEdges[0].gameTime && (
          <div style={{ 
            marginTop: isMobile ? '0.625rem' : '0.75rem',
            paddingTop: isMobile ? '0.625rem' : '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            zIndex: 1
          }}>
          <GameCountdown firstGameTime={allEdges[0].gameTime} />
          </div>
        )}
      </div>

      {/* Quick Summary Table - REMOVED for cleaner mobile experience */}

      {/* Deep Analytics Cards for Each Game - Grouped by Time */}
      <div>
        {(() => {
          // Group games by time slot
          const gamesByTime = {};
          allEdges.forEach((game) => {
            const time = game.gameTime;
            if (!gamesByTime[time]) {
              gamesByTime[time] = [];
            }
            gamesByTime[time].push(game);
          });
          
          const timeSlotsOrdered = Object.keys(gamesByTime).sort((a, b) => {
            // Parse time strings (e.g., "6:45 PM") for sorting
            const parseTime = (timeStr) => {
              const [time, period] = timeStr.split(' ');
              const [hours, minutes] = time.split(':').map(Number);
              let hour24 = hours;
              if (period === 'PM' && hours !== 12) hour24 += 12;
              if (period === 'AM' && hours === 12) hour24 = 0;
              return hour24 * 60 + minutes;
            };
            return parseTime(a) - parseTime(b);
          });
          
          return timeSlotsOrdered.map((timeSlot, slotIndex) => {
            const gamesInSlot = gamesByTime[timeSlot];
            const now = new Date();
            const gameTimeDate = new Date();
            const [time, period] = timeSlot.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            let hour24 = hours;
            if (period === 'PM' && hours !== 12) hour24 += 12;
            if (period === 'AM' && hours === 12) hour24 = 0;
            gameTimeDate.setHours(hour24, minutes, 0, 0);
            const minutesUntilGame = Math.floor((gameTimeDate - now) / (1000 * 60));
            const isStartingSoon = minutesUntilGame > 0 && minutesUntilGame < 60;
            
            return (
              <div key={timeSlot} style={{ marginBottom: slotIndex < timeSlotsOrdered.length - 1 ? (isMobile ? '1.5rem' : '1.75rem') : 0 }}>
                {/* Time Slot Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: isMobile ? '1rem' : '1.25rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '2px solid rgba(16, 185, 129, 0.15)'
                }}>
                  <div style={{
                    fontSize: isMobile ? '1rem' : '1.125rem',
                    fontWeight: '800',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.01em'
                  }}>
                    {timeSlot}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.75rem' : '0.813rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: '600',
                    padding: '0.25rem 0.625rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {gamesInSlot.length} game{gamesInSlot.length > 1 ? 's' : ''}
                  </div>
                  {isStartingSoon && (
                    <div style={{
                      fontSize: isMobile ? '0.688rem' : '0.75rem',
                      color: '#EF4444',
                      fontWeight: '700',
                      padding: '0.25rem 0.625rem',
                      background: 'rgba(239, 68, 68, 0.15)',
                      borderRadius: '12px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      animation: 'pulse 2s infinite'
                    }}>
                      🔥 Starting Soon
                    </div>
                  )}
                </div>
                
                {/* Games in this time slot */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: isMobile ? '0.625rem' : '0.75rem' }}>
                  {gamesInSlot.map((game, gameIndex) => {
                    const index = allEdges.indexOf(game);
          // Find the best edge for this game to show in narrative
          const bestEdge = topEdges
            .filter(e => e.game === game.game && e.evPercent > 0)
            .sort((a, b) => b.evPercent - a.evPercent)[0];

          const headerContent = (
            <>
              <CompactHeader
                awayTeam={game.awayTeam}
                homeTeam={game.homeTeam}
                gameTime={game.gameTime}
                rating={bestEdge?.evPercent || 0}
                awayWinProb={game.edges.moneyline?.away?.modelProb}
                homeWinProb={game.edges.moneyline?.home?.modelProb}
                isMobile={isMobile}
                bestEdge={bestEdge}
                game={game}
                dataProcessor={dataProcessor}
              />
              {/* Quick Stats Bar - only show when collapsed */}
              <QuickStatsBar 
                game={game}
                awayTeam={game.awayTeam}
                homeTeam={game.homeTeam}
                dataProcessor={dataProcessor}
                isMobile={isMobile}
              />
            </>
          );

          return (
            <CollapsibleGameCard
              key={index}
              header={headerContent}
              defaultExpanded={false}
              index={index}
              isMobile={isMobile}
            >
              
              {/* STEP 1: THE BET */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                return (
                  <StepSection
                    stepNumber={1}
                    title="THE BET"
                    emoji="🎯"
                    accentColor="#D4AF37"
                    isMobile={isMobile}
                  >
                    <HeroBetCard
                      bestEdge={bestEdge}
                      game={game}
                      isMobile={isMobile}
                      factors={analyticsData?.factors || []}
                    />
                  </StepSection>
                );
              })()}
              
              {/* STEP 2: THE STORY */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                if (bestEdge && analyticsData && analyticsData.factors) {
                  return (
                    <StepSection
                      stepNumber={2}
                      title="WHY THIS BET WORKS"
                      emoji="📖"
                      accentColor="#3B82F6"
                      isMobile={isMobile}
                    >
                      <QuickStory
                        game={game}
                        bestEdge={bestEdge}
                        factors={analyticsData.factors}
                        isMobile={isMobile}
                        dataProcessor={dataProcessor}
                      />
                    </StepSection>
                  );
                }
                return null;
              })()}
              
              {/* STEP 3: THE EVIDENCE */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                if (analyticsData && analyticsData.factors && analyticsData.factors.length > 0) {
                  return (
                    <StepSection
                      stepNumber={3}
                      title="KEY STATISTICAL DRIVERS"
                      emoji="📊"
                      accentColor="#8B5CF6"
                      isMobile={isMobile}
                    >
                      <CompactFactors
                        factors={analyticsData.factors}
                        totalImpact={analyticsData.totalImpact}
                        awayTeam={game.awayTeam}
                        homeTeam={game.homeTeam}
                        isMobile={isMobile}
                        bestEdge={bestEdge}
                      />
                    </StepSection>
                  );
                }
                return null;
              })()}
              
              {/* STEP 4: MORE OPTIONS */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                return (
                  <StepSection
                    stepNumber={4}
                    title="ALTERNATIVE BETS"
                    emoji="💡"
                    accentColor="#F59E0B"
                    isMobile={isMobile}
                  >
                    <AlternativeBetCard 
                      game={game}
                      bestEdge={bestEdge}
                      awayTeam={game.awayTeam}
                      homeTeam={game.homeTeam}
                      isMobile={isMobile}
                      factors={analyticsData?.factors || []}
                    />
                  </StepSection>
                );
              })()}
              
              {/* STEP 5: ALL MARKETS */}
              <StepSection
                stepNumber={5}
                title="COMPLETE ODDS BOARD"
                emoji="📈"
                accentColor="#64748B"
                isMobile={isMobile}
              >
                <MarketsGrid game={game} isMobile={isMobile} />
              </StepSection>
              
              {/* STEP 6: DEEP ANALYTICS */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                if (analyticsData) {
                  return (
                    <StepSection
                      stepNumber={6}
                      title="ADVANCED MATCHUP ANALYSIS"
                      emoji="🔬"
                      accentColor="#10B981"
                      isMobile={isMobile}
                    >
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
                        defaultExpanded={false}
                      />
                    </StepSection>
                  );
                }
                return null;
              })()}
            </CollapsibleGameCard>
          );
        })}
                </div>
              </div>
            );
          });
        })()}
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
                
                // Calculate bet outcomes with PUSH support
                const calculateBetOutcome = (edge) => {
                  if (game.status !== 'FINAL') return { status: 'pending', pnl: 0 };
                  
                  const totalScore = game.awayScore + game.homeScore;
                  let won = false;
                  let push = false;
                  
                  if (edge.market === 'MONEYLINE') {
                    const betTeam = edge.team;
                    const awayWon = game.awayScore > game.homeScore;
                    const homeWon = game.homeScore > game.awayScore;
                    won = (betTeam === game.awayTeam && awayWon) || (betTeam === game.homeTeam && homeWon);
                  } else if (edge.market === 'TOTAL') {
                    const isOver = edge.pick.includes('OVER');
                    const line = parseFloat(edge.pick.match(/[\d.]+/)[0]);
                    
                    if (totalScore === line) {
                      push = true; // Exact line = PUSH
                    } else {
                      won = isOver ? (totalScore > line) : (totalScore < line);
                    }
                  }
                  
                  // Calculate P&L (assuming $100 bet)
                  if (push) return { status: 'push', pnl: 0 };
                  
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
                    
                    {/* Premium Game Status Info */}
                    {(game.clock || game.venue || game.winningGoalie || game.winningGoalScorer) && (
                      <div style={{ 
                        padding: isMobile ? '0.875rem 1rem' : '1rem 1.5rem',
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.25) 100%)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        {/* Clock/Period */}
                        {game.clock && (
                          <div style={{ 
                            color: game.status === 'LIVE' ? '#EF4444' : '#10B981',
                            fontSize: isMobile ? '0.875rem' : '0.938rem',
                            fontWeight: '700',
                            letterSpacing: '0.05em',
                            textAlign: 'center'
                          }}>
                            {game.periodType === 'OT' ? '🚨 OVERTIME' : game.periodType === 'SO' ? '🎯 SHOOTOUT' : ''}
                            {game.periodType === 'REG' && game.period && `Period ${game.period}`} {game.clock && `• ${game.clock}`}
                          </div>
                        )}
                        
                        {/* Premium Details for FINAL games */}
                        {game.status === 'FINAL' && (
                          <div style={{ 
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? '0.5rem' : '1.5rem',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)'
                          }}>
                            {game.venue && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <span>📍</span>
                                <span style={{ fontWeight: '600' }}>{game.venue}</span>
                              </div>
                            )}
                            {game.winningGoalie && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <span>🥅</span>
                                <span style={{ fontWeight: '600' }}>W: {game.winningGoalie}</span>
                              </div>
                            )}
                            {game.winningGoalScorer && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <span>🚨</span>
                                <span style={{ fontWeight: '600' }}>GWG: {game.winningGoalScorer}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Premium Bet Tracker Section */}
                    {gameBets.length > 0 && (
                      <div style={{ 
                        padding: isMobile ? '1rem' : '1.5rem',
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.15) 100%)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <div style={{ 
                          fontSize: '0.75rem',
                          marginBottom: '1.25rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <span style={{ fontSize: '1.125rem', filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' }}>🎯</span>
                            <span style={{
                              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              fontWeight: '800'
                            }}>NHL Savant Model Bets</span>
                          </div>
                          <div style={{ 
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.15) 100%)',
                            color: '#10B981',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '14px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                          }}>
                            {gameBets.length}
                          </div>
                        </div>
                        
                        {gameBets.slice(0, 3).map((bet, betIdx) => {
                          const outcome = calculateBetOutcome(bet);
                          const isWinning = outcome.status === 'won';
                          const isLosing = outcome.status === 'lost';
                          const isPush = outcome.status === 'push';
                          
                          return (
                            <div 
                              key={betIdx}
                              style={{ 
                                marginBottom: betIdx < Math.min(gameBets.length, 3) - 1 ? '0.5rem' : 0,
                                padding: isMobile ? '0.875rem' : '1rem',
                                background: isWinning 
                                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                                  : isLosing
                                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)'
                                  : isPush
                                  ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)'
                                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                                borderRadius: '8px',
                                border: `1.5px solid ${
                                  isWinning ? 'rgba(16, 185, 129, 0.35)' : 
                                  isLosing ? 'rgba(239, 68, 68, 0.35)' : 
                                  isPush ? 'rgba(251, 191, 36, 0.35)' :
                                  'rgba(255, 255, 255, 0.08)'
                                }`,
                                position: 'relative',
                                boxShadow: isWinning 
                                  ? '0 4px 12px rgba(16, 185, 129, 0.15)'
                                  : isLosing
                                  ? '0 4px 12px rgba(239, 68, 68, 0.15)'
                                  : isPush
                                  ? '0 4px 12px rgba(251, 191, 36, 0.15)'
                                  : '0 2px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.2s ease',
                                cursor: 'default'
                              }}
                            >
                              {/* Premium outcome badge - positioned top-left to avoid overlap */}
                              {outcome.status !== 'pending' && (
                                <div style={{ 
                                  position: 'absolute',
                                  top: '0.625rem',
                                  left: '0.625rem',
                                  background: isWinning 
                                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                                    : isPush 
                                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
                                    : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                  color: 'white',
                                  padding: '0.3rem 0.625rem',
                                  borderRadius: '12px',
                                  fontSize: '0.688rem',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  boxShadow: isWinning 
                                    ? '0 2px 8px rgba(16, 185, 129, 0.4)' 
                                    : isPush 
                                    ? '0 2px 8px rgba(251, 191, 36, 0.4)' 
                                    : '0 2px 8px rgba(239, 68, 68, 0.4)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  zIndex: 10
                                }}>
                                  {isWinning ? 'W' : isPush ? 'P' : 'L'}
                                </div>
                              )}
                              
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                gap: '0.75rem',
                                paddingLeft: outcome.status !== 'pending' ? '2.5rem' : '0' // Space for badge
                              }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ 
                                    fontWeight: '700', 
                                    fontSize: isMobile ? '0.875rem' : '0.938rem',
                                    marginBottom: '0.375rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    letterSpacing: '0.01em'
                                  }}>
                                    {bet.pick}
                                  </div>
                                  <div style={{ 
                                    fontSize: '0.75rem', 
                                    color: 'var(--color-text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                  }}>
                                    <span style={{ 
                                      background: 'rgba(255, 255, 255, 0.08)',
                                      padding: '0.125rem 0.5rem',
                                      borderRadius: '8px',
                                      textTransform: 'uppercase',
                                      fontSize: '0.625rem',
                                      fontWeight: '700',
                                      letterSpacing: '0.08em'
                                    }}>
                                      {bet.market === 'MONEYLINE' ? 'ML' : bet.market === 'TOTAL' ? 'TOT' : bet.market}
                                    </span>
                                    <span style={{ fontWeight: '700', color: bet.odds > 0 ? '#10B981' : 'var(--color-text-primary)' }}>
                                      {bet.odds > 0 ? '+' : ''}{bet.odds}
                                    </span>
                                  </div>
                                </div>
                                
                                {outcome.status !== 'pending' && (
                                  <div style={{ 
                                    fontSize: isMobile ? '1rem' : '1.125rem', 
                                    fontWeight: '800',
                                    color: isWinning ? '#10B981' : isPush ? '#F59E0B' : '#EF4444',
                                    minWidth: 'fit-content',
                                    textAlign: 'right',
                                    textShadow: isWinning 
                                      ? '0 0 8px rgba(16, 185, 129, 0.3)' 
                                      : isPush 
                                      ? '0 0 8px rgba(251, 191, 36, 0.3)' 
                                      : '0 0 8px rgba(239, 68, 68, 0.3)',
                                    letterSpacing: '0.02em'
                                  }}>
                                    {outcome.pnl > 0 ? '+$' : outcome.pnl < 0 ? '-$' : '$'}{Math.abs(outcome.pnl).toFixed(0)}
                                  </div>
                                )}
                                
                                {outcome.status === 'pending' && game.status === 'LIVE' && (
                                  <div style={{ 
                                    fontSize: '0.75rem', 
                                    color: '#EF4444',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    whiteSpace: 'nowrap',
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '8px'
                                  }}>
                                    <Activity size={12} />
                                    <span>LIVE</span>
                                  </div>
                                )}
                              </div>
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
                        
                        {/* Premium Total P&L Summary */}
                        {game.status === 'FINAL' && (
                          <div style={{ 
                            marginTop: '1rem',
                            padding: isMobile ? '1rem' : '1.125rem',
                            background: (() => {
                              const totalPnl = gameBets.reduce((sum, bet) => sum + calculateBetOutcome(bet).pnl, 0);
                              if (totalPnl > 0) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.08) 100%)';
                              if (totalPnl < 0) return 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.08) 100%)';
                              return 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.08) 100%)';
                            })(),
                            borderRadius: '10px',
                            border: (() => {
                              const totalPnl = gameBets.reduce((sum, bet) => sum + calculateBetOutcome(bet).pnl, 0);
                              if (totalPnl > 0) return '2px solid rgba(16, 185, 129, 0.4)';
                              if (totalPnl < 0) return '2px solid rgba(239, 68, 68, 0.4)';
                              return '2px solid rgba(251, 191, 36, 0.4)';
                            })(),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: (() => {
                              const totalPnl = gameBets.reduce((sum, bet) => sum + calculateBetOutcome(bet).pnl, 0);
                              if (totalPnl > 0) return '0 4px 16px rgba(16, 185, 129, 0.25)';
                              if (totalPnl < 0) return '0 4px 16px rgba(239, 68, 68, 0.25)';
                              return '0 4px 16px rgba(251, 191, 36, 0.25)';
                            })()
                          }}>
                            <div style={{ 
                              fontSize: '0.813rem',
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              color: (() => {
                                const totalPnl = gameBets.reduce((sum, bet) => sum + calculateBetOutcome(bet).pnl, 0);
                                return totalPnl > 0 ? '#10B981' : totalPnl < 0 ? '#EF4444' : '#F59E0B';
                              })()
                            }}>
                              Total P&L
                            </div>
                            <div style={{ 
                              fontSize: isMobile ? '1.5rem' : '1.75rem', 
                              fontWeight: '900',
                              color: (() => {
                                const totalPnl = gameBets.reduce((sum, bet) => sum + calculateBetOutcome(bet).pnl, 0);
                                return totalPnl > 0 ? '#10B981' : totalPnl < 0 ? '#EF4444' : '#F59E0B';
                              })(),
                              textShadow: (() => {
                                const totalPnl = gameBets.reduce((sum, bet) => sum + calculateBetOutcome(bet).pnl, 0);
                                if (totalPnl > 0) return '0 0 12px rgba(16, 185, 129, 0.4)';
                                if (totalPnl < 0) return '0 0 12px rgba(239, 68, 68, 0.4)';
                                return '0 0 12px rgba(251, 191, 36, 0.4)';
                              })(),
                              letterSpacing: '0.02em'
                            }}>
                              {(() => {
                                const totalPnl = gameBets.reduce((sum, bet) => sum + calculateBetOutcome(bet).pnl, 0);
                                return (totalPnl > 0 ? '+$' : totalPnl < 0 ? '-$' : '$') + Math.abs(totalPnl).toFixed(0);
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
