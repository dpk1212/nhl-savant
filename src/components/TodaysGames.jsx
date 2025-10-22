import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { EdgeCalculator } from '../utils/edgeCalculator';
import { getTeamName } from '../utils/oddsTraderParser';
import { VisualMetricsGenerator } from '../utils/visualMetricsGenerator';
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
const HeroBetCard = ({ bestEdge, game, isMobile }) => {
  if (!bestEdge) return null;
  
  const marketProb = calculateImpliedProb(bestEdge.odds);
  const modelTotal = game.edges.total?.predictedTotal || 0;
  const marketTotal = game.edges.total?.marketTotal || 0;
  const edge = modelTotal - marketTotal;
  const confidence = getConfidenceLevel(bestEdge.evPercent, bestEdge.modelProb);
  
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

// Compact Comparison Bar
const CompactComparisonBar = ({ awayValue, homeValue, leagueAvg, awayTeam, homeTeam }) => {
  const maxValue = Math.max(awayValue, homeValue, leagueAvg) * 1.2;
  const awayPct = (awayValue / maxValue) * 100;
  const homePct = (homeValue / maxValue) * 100;
  const leaguePct = (leagueAvg / maxValue) * 100;
  
  const awayAdvantage = awayValue > homeValue;
  const awayColor = getBarColor(awayValue, homeValue, leagueAvg);
  const homeColor = getBarColor(homeValue, awayValue, leagueAvg);
  
  return (
    <div style={{ fontSize: TYPOGRAPHY.caption.size }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ 
          fontWeight: awayAdvantage ? TYPOGRAPHY.body.weight : TYPOGRAPHY.caption.weight, 
          color: awayAdvantage ? awayColor : 'var(--color-text-secondary)'
        }}>
          {awayTeam}: {awayValue.toFixed(2)}
        </span>
        <span style={{ color: 'rgba(212, 175, 55, 0.7)', fontSize: TYPOGRAPHY.caption.size }}>
          Avg: {leagueAvg.toFixed(2)}
        </span>
      </div>
      <div style={{ position: 'relative', height: '8px', background: 'rgba(100, 116, 139, 0.15)', borderRadius: '4px', marginBottom: '0.375rem' }}>
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
        <div style={{ 
          width: `${awayPct}%`, 
          height: '100%', 
          background: awayColor,
          borderRadius: '4px',
          transition: TRANSITIONS.normal,
          boxShadow: awayAdvantage ? `0 0 8px ${awayColor}40` : 'none'
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ 
          fontWeight: !awayAdvantage ? TYPOGRAPHY.body.weight : TYPOGRAPHY.caption.weight, 
          color: !awayAdvantage ? homeColor : 'var(--color-text-secondary)'
        }}>
          {homeTeam}: {homeValue.toFixed(2)}
        </span>
      </div>
      <div style={{ position: 'relative', height: '8px', background: 'rgba(100, 116, 139, 0.15)', borderRadius: '4px' }}>
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
        <div style={{ 
          width: `${homePct}%`, 
          height: '100%', 
          background: homeColor,
          borderRadius: '4px',
          transition: TRANSITIONS.normal,
          boxShadow: !awayAdvantage ? `0 0 8px ${homeColor}40` : 'none'
        }} />
      </div>
    </div>
  );
};

// Compact Factors - Top 3 critical factors
const CompactFactors = ({ factors, totalImpact, awayTeam, homeTeam, isMobile }) => {
  if (!factors || factors.length === 0) return null;
  
  const topFactors = factors
    .filter(f => f.importance === 'CRITICAL')
    .slice(0, 3);
  
  if (topFactors.length === 0) return null;
  
  const criticalCount = factors.filter(f => f.importance === 'CRITICAL').length;
  
  return (
    <div style={{ 
      background: GRADIENTS.factors, 
      border: ELEVATION.raised.border,
      boxShadow: ELEVATION.raised.shadow,
      borderRadius: MOBILE_SPACING.borderRadius,
      overflow: 'hidden'
    }}>
      {/* Header with factor count */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem',
        background: 'rgba(0, 0, 0, 0.15)',
        borderBottom: ELEVATION.flat.border
      }}>
        <h3 style={{ 
          fontSize: TYPOGRAPHY.subheading.size, 
          fontWeight: TYPOGRAPHY.heading.weight, 
          margin: 0, 
          color: 'var(--color-accent)', 
          letterSpacing: TYPOGRAPHY.heading.letterSpacing 
        }}>
          📊 KEY ADVANTAGES
        </h3>
        <div style={{ 
          fontSize: TYPOGRAPHY.caption.size, 
          color: 'var(--color-text-muted)',
          fontWeight: TYPOGRAPHY.caption.weight
        }}>
          <span>Showing top 3 of {factors.length}</span>
          <span style={{ marginLeft: '0.5rem', color: 'var(--color-accent)' }}>
            • {criticalCount} critical
          </span>
        </div>
      </div>
      
      {/* Factors list */}
      <div style={{ padding: isMobile ? MOBILE_SPACING.innerPadding : '1rem' }}>
      {topFactors.map((factor, idx) => {
        const evColor = getEVColorScale(factor.impact * 10); // Scale impact to ~EV range for colors
        
        return (
          <div key={idx} style={{ 
            marginBottom: idx < topFactors.length - 1 ? '1rem' : '0', 
            paddingBottom: idx < topFactors.length - 1 ? '1rem' : '0', 
            borderBottom: idx < topFactors.length - 1 ? ELEVATION.flat.border : 'none' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'baseline' }}>
              <span style={{ 
                fontSize: TYPOGRAPHY.body.size, 
                fontWeight: TYPOGRAPHY.body.weight, 
                color: 'var(--color-text-primary)' 
              }}>
                {factor.stars === 3 ? '🔥' : factor.stars === 2 ? '🎯' : '⚡'} {factor.name}
              </span>
              <span style={{ 
                fontSize: TYPOGRAPHY.body.size, 
                fontWeight: TYPOGRAPHY.heading.weight, 
                color: evColor.color,
                fontFeatureSettings: "'tnum'"
              }}>
                {VisualMetricsGenerator.formatGoalImpact(factor.impact)} goals
              </span>
            </div>
            
            {factor.awayMetric && factor.homeMetric && (
              <>
                <div style={{ 
                  fontSize: TYPOGRAPHY.caption.size, 
                  color: 'var(--color-text-muted)', 
                  marginBottom: '0.5rem',
                  fontWeight: TYPOGRAPHY.caption.weight
                }}>
                  {factor.awayMetric.rank && factor.homeMetric.rank ? (
                    <span>Ranked #{factor.awayMetric.rank} vs #{factor.homeMetric.rank}</span>
                  ) : (
                    <span>{factor.explanation?.split('.')[0]}</span>
                  )}
                </div>
                
                <CompactComparisonBar 
                  awayValue={factor.awayMetric.value}
                  homeValue={factor.homeMetric.value}
                  leagueAvg={factor.leagueAvg}
                  awayTeam={awayTeam}
                  homeTeam={homeTeam}
                />
              </>
            )}
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

// Market Row Component
const MarketRow = ({ team, odds, ev, isPositive, isBestBet }) => {
  const [isHovered, setIsHovered] = useState(false);
  const evColor = getEVColorScale(ev);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
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
      <span style={{ 
        fontSize: TYPOGRAPHY.body.size, 
        fontWeight: TYPOGRAPHY.body.weight, 
        color: 'var(--color-text-primary)' 
      }}>
        {team}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
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
          minWidth: '60px'
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
            />
            
            <MarketRow 
              team={game.homeTeam}
              odds={game.edges.moneyline.home.odds}
              ev={game.edges.moneyline.home.evPercent}
              isPositive={game.edges.moneyline.home.evPercent > 0}
              isBestBet={game.edges.moneyline.home.evPercent === bestEvValue && game.edges.moneyline.home.evPercent > 5}
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
            />
            
            <MarketRow 
              team={`U ${game.rawOdds.total.line}`}
              odds={game.edges.total.under.odds}
              ev={game.edges.total.under.evPercent}
              isPositive={game.edges.total.under.evPercent > 0}
              isBestBet={game.edges.total.under.evPercent === bestEvValue && game.edges.total.under.evPercent > 5}
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
          />
          
          <MarketRow 
            team={game.homeTeam}
            odds={game.edges.moneyline.home.odds}
            ev={game.edges.moneyline.home.evPercent}
            isPositive={game.edges.moneyline.home.evPercent > 0}
            isBestBet={game.edges.moneyline.home.evPercent === bestEvValue && game.edges.moneyline.home.evPercent > 5}
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
          />
          
          <MarketRow 
            team={`U ${game.rawOdds.total.line}`}
            odds={game.edges.total.under.odds}
            ev={game.edges.total.under.evPercent}
            isPositive={game.edges.total.under.evPercent > 0}
            isBestBet={game.edges.total.under.evPercent === bestEvValue && game.edges.total.under.evPercent > 5}
          />
        </div>
      )}
    </div>
  );
};

// ========================================
// MAIN COMPONENT
// ========================================

const TodaysGames = ({ dataProcessor, oddsData, startingGoalies, statsAnalyzer, edgeFactorCalc }) => {
  const [edgeCalculator, setEdgeCalculator] = useState(null);
  const [allEdges, setAllEdges] = useState([]);
  const [topEdges, setTopEdges] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedGame, setExpandedGame] = useState(null);
  
  // FIREBASE: Auto-track all recommended bets
  useBetTracking(allEdges, dataProcessor);

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
              <HeroBetCard
                bestEdge={bestEdge}
                game={game}
                isMobile={isMobile}
              />
              
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
                    />
                  );
                }
                return null;
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
                      isMobile={isMobile}
                    />
                  );
                }
                return null;
              })()}
            </div>
          );
        })}
      </div>

      {/* No games message */}
      {allEdges.length === 0 && (
        <div className="elevated-card" style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '3rem' }}>
          <Calendar size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Games Today</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Check back later for today's matchups and analysis.
          </p>
        </div>
      )}
    </div>
  );
};

export default TodaysGames;
