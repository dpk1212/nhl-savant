import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, TrendingUp, BarChart3, Activity, Sparkles, ArrowRight, Target, Bookmark, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { EdgeCalculator } from '../utils/edgeCalculator';
import { getTeamName } from '../utils/oddsTraderParser';
import { VisualMetricsGenerator } from '../utils/visualMetricsGenerator';
import { GoalieProcessor } from '../utils/goalieProcessor';
import { trackBetView, trackBetExpand, trackBetsLoaded, trackSectionView } from '../utils/analytics';
import { getETDate } from '../utils/dateUtils';
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
import AIBetNarrative from './AIBetNarrative';
import AIFullStory from './AIFullStory';
import CollapsibleGameCard from './CollapsibleGameCard';
import StepSection from './StepSection';
import QuickStatsBar from './QuickStatsBar';
import DisclaimerModal from './DisclaimerModal';
import CompactPicksBar from './CompactPicksBar';
import { getRating } from './RatingBadge';
import ShareButton from './ShareButton';
import BookmarkButton from './BookmarkButton';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { trackGameCardView, getUsageForToday } from '../utils/usageTracker';
import UpgradeModal from './UpgradeModal';
import ConversionButtons from './ConversionButtons';
import WelcomePopupModal from './modals/WelcomePopupModal';
import { analytics, logEvent as firebaseLogEvent } from '../firebase/config';

// Wrapper for analytics logging
const logEvent = (eventName, params) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

// ========================================
// INLINE HELPER COMPONENTS
// ========================================

// Compact Header - REDESIGNED for density and scannability
const CompactHeader = ({ awayTeam, homeTeam, gameTime, rating, awayWinProb, homeWinProb, isMobile, bestEdge, isCollapsed, game, dataProcessor, liveScores, firebaseBets }) => {
  // Check if there's a live score for this game
  const liveScore = liveScores?.find(score => 
    (score.awayTeam === awayTeam && score.homeTeam === homeTeam) ||
    (score.away === awayTeam && score.home === homeTeam)
  );
  
  const isLive = liveScore && (liveScore.status === 'LIVE' || liveScore.status === 'In Progress');
  const isFinal = liveScore && (liveScore.status === 'FINAL' || liveScore.status === 'Final');
  
  // If game is live or final, show sleek compact score + prediction layout
  if (isLive || isFinal) {
    const awayLeading = liveScore.awayScore > liveScore.homeScore;
    const homeLeading = liveScore.homeScore > liveScore.awayScore;
    const tied = liveScore.awayScore === liveScore.homeScore;
    const scoreDiff = Math.abs(liveScore.awayScore - liveScore.homeScore);
    
    // CRITICAL: Check Firebase for our ACTUAL bet (not current odds calculation)
    // This shows the bet we made at favorable odds, even if odds have changed
    const firebaseBet = firebaseBets?.find(bet => 
      bet.game?.awayTeam === awayTeam && 
      bet.game?.homeTeam === homeTeam &&
      bet.bet?.market === 'MONEYLINE'
    );
    
    // Check if we had a bet on this game (prefer Firebase bet over current edge calculation)
    const hasBet = firebaseBet || (bestEdge && bestEdge.market === 'MONEYLINE' && bestEdge.evPercent > 0);
    
    // Determine what team we're tracking (BET if exists, otherwise MODEL PREDICTION)
    let ourTeam, ourTeamIsAway, ourPreGameProb;
    
    if (hasBet) {
      // We have a bet - use Firebase bet data if available, otherwise use bestEdge
      const betData = firebaseBet || bestEdge;
      ourTeam = firebaseBet ? firebaseBet.bet.pick.split(' ')[0] : bestEdge.team; // Extract team from pick like "PIT ML (AWAY)"
      ourTeamIsAway = ourTeam === awayTeam;
      ourPreGameProb = ourTeamIsAway ? awayWinProb : homeWinProb;
    } else {
      // No bet - track MODEL'S PREDICTION (favorite)
      const predictedAway = awayWinProb > homeWinProb;
      ourTeam = predictedAway ? awayTeam : homeTeam;
      ourTeamIsAway = predictedAway;
      ourPreGameProb = Math.max(awayWinProb, homeWinProb);
    }
    
    const ourTeamLeading = ourTeamIsAway ? awayLeading : homeLeading;
    const predictedCorrectly = isFinal && ourTeamLeading;
    
    // Calculate SOPHISTICATED LIVE probability FOR OUR BET/PICK
    let liveProbability = 50;
    
    if (isFinal) {
      // Final: 100% if our team won, 0% if they lost
      liveProbability = ourTeamLeading ? 100 : 0;
    } else if (isLive) {
      // Sophisticated live model based on score + time
      const period = liveScore.period || 1;
      const periodString = liveScore.periodDescriptor || '';
      const isOT = periodString.includes('OT') || period > 3;
      
      if (tied) {
        // Tied game - use OUR TEAM's pre-game probability with SLIGHT boost toward 50%
        // If we bet on underdog at 41%, at 0-0 they're slightly better (~44%)
        // If we bet on favorite at 59%, at 0-0 they're slightly worse (~56%)
        liveProbability = ourPreGameProb;
        // Slight regression toward 50% in regulation (game is still open)
        if (!isOT) {
          liveProbability = 50 + ((liveProbability - 50) * 0.8);
        }
      } else {
        // Leading team probability based on score differential and period
        const leadProb = (() => {
          if (isOT) {
            // OT: next goal wins - heavily favor leader
            return scoreDiff === 1 ? 85 : 95;
          } else if (period === 3) {
            // 3rd period: harder to come back
            if (scoreDiff === 1) return 72;
            if (scoreDiff === 2) return 88;
            return 95;
          } else if (period === 2) {
            // 2nd period: moderate difficulty
            if (scoreDiff === 1) return 65;
            if (scoreDiff === 2) return 80;
            return 92;
          } else {
            // 1st period: easiest to come back
            if (scoreDiff === 1) return 58;
            if (scoreDiff === 2) return 72;
            return 85;
          }
        })();
        
        // Apply to OUR team (bet or prediction)
        liveProbability = ourTeamLeading ? leadProb : (100 - leadProb);
      }
    }
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        padding: isMobile ? '1rem' : '1.25rem',
        borderBottom: isCollapsed ? 'none' : ELEVATION.flat.border,
        background: isLive 
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(11, 15, 31, 1) 100%)'
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(11, 15, 31, 1) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Bar: Status + Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isLive ? (
              <>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '16px',
                  fontSize: '0.688rem',
                  fontWeight: '800',
                  color: '#EF4444',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    background: '#EF4444', 
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }} />
                  {(() => {
                    const period = liveScore.period || 0;
                    const periodDesc = liveScore.periodDescriptor || '';
                    if (periodDesc.includes('OT')) return 'OT';
                    if (periodDesc.includes('SO')) return 'SO';
                    if (period === 0) return 'LIVE';
                    return `P${period}`;
                  })()}
                </div>
                {liveScore.clock && (
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--color-text-secondary)',
                    fontFeatureSettings: '"tnum"'
                  }}>
                    {liveScore.clock}
                  </div>
                )}
              </>
            ) : (
              <div style={{
                display: 'inline-flex',
                padding: '0.375rem 0.75rem',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '16px',
                fontSize: '0.688rem',
                fontWeight: '800',
                color: '#10B981',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                FINAL
              </div>
            )}
          </div>
          
          {rating > 0 && (
            <RatingBadge evPercent={rating} size="small" />
          )}
        </div>
        
        {/* Compact Score Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '0.75rem' : '1rem',
          marginBottom: '0.75rem'
        }}>
          {/* Away Team */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            flex: 1
          }}>
            <div style={{
              fontSize: isMobile ? '0.938rem' : '1rem',
              fontWeight: '700',
              color: awayLeading ? '#10B981' : 'var(--color-text-secondary)',
              letterSpacing: '0.02em'
            }}>
              {awayTeam}
            </div>
            <div style={{
              fontSize: isMobile ? '1.75rem' : '2rem',
              fontWeight: '900',
              color: awayLeading ? '#10B981' : 'var(--color-text-primary)',
              fontFeatureSettings: '"tnum"',
              minWidth: isMobile ? '30px' : '36px',
              textAlign: 'center'
            }}>
              {liveScore.awayScore ?? 0}
            </div>
          </div>
          
          {/* Divider */}
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'var(--color-text-muted)',
            padding: '0 0.25rem'
          }}>
            @
          </div>
          
          {/* Home Team */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            flex: 1,
            justifyContent: 'flex-end'
          }}>
            <div style={{
              fontSize: isMobile ? '1.75rem' : '2rem',
              fontWeight: '900',
              color: homeLeading ? '#10B981' : 'var(--color-text-primary)',
              fontFeatureSettings: '"tnum"',
              minWidth: isMobile ? '30px' : '36px',
              textAlign: 'center'
            }}>
              {liveScore.homeScore ?? 0}
            </div>
            <div style={{
              fontSize: isMobile ? '0.938rem' : '1rem',
              fontWeight: '700',
              color: homeLeading ? '#10B981' : 'var(--color-text-secondary)',
              letterSpacing: '0.02em'
            }}>
              {homeTeam}
            </div>
          </div>
        </div>
        
        {/* Prediction Bar with LIVE Probability Sparkline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.625rem 0.875rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* YOUR PICK Label + Sparkline */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '0.625rem',
              fontWeight: '700',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.375rem'
            }}>
              {hasBet ? 'NHL SAVANT BET' : 'NHL SAVANT PICK'}
            </div>
            
            {/* LIVE Probability Bar */}
            <div style={{
              height: '28px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '6px',
              padding: '3px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Probability fill */}
              <div style={{
                width: `${liveProbability}%`,
                height: '100%',
                background: liveProbability >= 50
                  ? 'linear-gradient(90deg, #10B981, #059669)'
                  : 'linear-gradient(90deg, #EF4444, #DC2626)',
                borderRadius: '4px',
                transition: 'all 0.5s ease',
                boxShadow: liveProbability >= 50 
                  ? '0 0 12px rgba(16, 185, 129, 0.4)'
                  : '0 0 12px rgba(239, 68, 68, 0.4)'
              }} />
              
              {/* Percentage text overlay */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '0.75rem',
                fontWeight: '900',
                color: 'white',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                letterSpacing: '0.02em'
              }}>
                {Math.round(liveProbability)}%
              </div>
            </div>
          </div>
          
          {/* What You Picked/Bet */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            minWidth: isMobile ? '90px' : '110px'
          }}>
            {hasBet ? (
              <>
                <div style={{
                  fontSize: '0.813rem',
                  fontWeight: '800',
                  color: '#3B82F6',
                  letterSpacing: '0.02em',
                  marginBottom: '2px'
                }}>
                  {ourTeam}
                </div>
                <div style={{
                  fontSize: '0.688rem',
                  fontWeight: '700',
                  color: 'var(--color-text-secondary)'
                }}>
                  {(() => {
                    const odds = firebaseBet ? firebaseBet.bet.odds : bestEdge.odds;
                    return odds > 0 ? `+${odds}` : odds;
                  })()}
                </div>
              </>
            ) : (
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '800',
                color: '#3B82F6',
                letterSpacing: '0.02em'
              }}>
                {ourTeam} to win
              </div>
            )}
            {isFinal && (
              <div style={{
                fontSize: '0.688rem',
                fontWeight: '700',
                color: predictedCorrectly ? '#10B981' : '#EF4444',
                marginTop: '4px',
                padding: '2px 6px',
                background: predictedCorrectly 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : 'rgba(239, 68, 68, 0.15)',
                borderRadius: '4px'
              }}>
                {predictedCorrectly ? '✓ WIN' : '✗ LOSS'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Otherwise, show normal pre-game prediction layout
  return (
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
              {awayTeam} {(awayWinProb > 1 ? awayWinProb : awayWinProb * 100).toFixed(0)}%
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
              {homeTeam} {(homeWinProb > 1 ? homeWinProb : homeWinProb * 100).toFixed(0)}%
            </div>
        </div>
      )}
    </div>
      
      {/* Right side: Share button + Game time */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        {/* Share Button - Compact variant */}
        {bestEdge && !isCollapsed && (
          <ShareButton
            game={game}
            bestEdge={bestEdge}
            variant="compact"
            isMobile={isMobile}
          />
        )}
        
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
};

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
  const { toggleBookmark, isBookmarked } = useBookmarks();
  
  if (!bestEdge) {
    // Premium CTA when no bet recommendation
    return (
      <Link 
        to="/matchup-insights" 
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '12px',
          padding: isMobile ? '1.5rem 1rem' : '2rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.25)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        >
          {/* Subtle gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), transparent)'
          }} />
          
          {/* Icon */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <Sparkles size={24} color="#A78BFA" strokeWidth={2} />
            </div>
          </div>
          
          {/* Title */}
          <div style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            fontWeight: '700',
            color: '#E9D5FF',
            marginBottom: '0.5rem',
            letterSpacing: '-0.01em'
          }}>
            No Predicted Edge
          </div>
          
          {/* Description */}
          <div style={{
            fontSize: isMobile ? '0.8125rem' : '0.875rem',
            color: '#C4B5FD',
            lineHeight: '1.5',
            marginBottom: '1.25rem',
            maxWidth: '400px',
            margin: '0 auto 1.25rem'
          }}>
            Odds aren't favorable for this game. Explore our Hot Takes for deeper insights and alternative angles.
          </div>
          
          {/* CTA Button */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '700',
            color: '#FFFFFF',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}>
            View Hot Takes
            <ArrowRight size={16} strokeWidth={2.5} />
          </div>
        </div>
      </Link>
    );
  }
  
  const marketProb = calculateImpliedProb(bestEdge.odds);
  const modelTotal = game.edges.total?.predictedTotal || 0;
  const marketTotal = game.edges.total?.marketTotal || 0;
  const edge = modelTotal - marketTotal;
  // Calculate probability edge (model vs market) - both in decimal form (0.402 - 0.388 = 0.014 = 1.4%)
  const probEdge = (bestEdge.modelProb - marketProb) * 100;
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
  
  // Generate bet ID for bookmarking
  const betId = `${game.date || new Date().toISOString().split('T')[0]}_${game.awayTeam}_${game.homeTeam}_${bestEdge.market}_${bestEdge.pick.replace(/\s+/g, '_')}`;
  const bookmarked = isBookmarked(betId);
  
  const handleToggleBookmark = () => {
    // Generate rating from evPercent if not present
    const rating = bestEdge.rating || getRating(bestEdge.evPercent).grade;
    
    toggleBookmark({
      betId,
      game: {
        awayTeam: game.awayTeam,
        homeTeam: game.homeTeam,
        gameTime: game.gameTime,
        gameDate: game.date || new Date().toISOString().split('T')[0]
      },
      bet: {
        market: bestEdge.market,
        pick: bestEdge.pick,
        odds: bestEdge.odds,
        evPercent: bestEdge.evPercent,
        rating: rating,
        team: bestEdge.team || null
      }
    });
  };
  
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
      
      {/* Bookmark button in top-right corner */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '0.75rem' : '0.875rem',
        right: isMobile ? '0.75rem' : '0.875rem',
        zIndex: 2
      }}>
        <BookmarkButton
          isBookmarked={bookmarked}
          onClick={handleToggleBookmark}
          size={isMobile ? 'small' : 'medium'}
        />
      </div>
      
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
            Win Prob
          </div>
          <div style={{ 
            fontSize: isMobile ? '1.125rem' : TYPOGRAPHY.hero.size, 
            fontWeight: TYPOGRAPHY.hero.weight, 
            color: '#10B981', 
            fontFeatureSettings: "'tnum'",
            lineHeight: TYPOGRAPHY.hero.lineHeight
          }}>
            {(bestEdge.modelProb * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: TYPOGRAPHY.caption.size, color: 'var(--color-text-muted)' }}>model</div>
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
      
      {/* Premium Share Button */}
      <div style={{
        marginTop: '1rem',
        marginBottom: '0.75rem',
        position: 'relative',
        zIndex: 1
      }}>
        <ShareButton
          game={game}
          bestEdge={bestEdge}
          advantages={insights}
          variant="full"
          isMobile={isMobile}
        />
      </div>
      
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
        <span>Model: {(bestEdge.modelProb * 100).toFixed(1)}%</span>
        <span>Market: {(marketProb * 100).toFixed(1)}%</span>
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
              const betterOffense = awayXGF > homeXGF ? awayTeam : homeTeam;
              const offenseRank = Math.max(awayXGF, homeXGF) > 2.7 ? 'elite' : Math.max(awayXGF, homeXGF) > 2.5 ? 'strong' : 'solid';
              
              return `${betterOffense}'s ${offenseRank} offense (${Math.max(awayXGF, homeXGF).toFixed(2)} xGF/60) creates ${impactAmount}-goal ${direction} edge.`;
            } else if (factor.name.includes('Against') || factor.name.includes('Defense')) {
              // Show defensive advantage
              const awayXGA = factor.awayMetric?.value || 0;
              const homeXGA = factor.homeMetric?.value || 0;
              const betterDefense = awayXGA < homeXGA ? awayTeam : homeTeam;
              const defenseRank = Math.min(awayXGA, homeXGA) < 2.3 ? 'elite' : Math.min(awayXGA, homeXGA) < 2.5 ? 'strong' : 'solid';
              
              return `${betterDefense}'s ${defenseRank} defense (${Math.min(awayXGA, homeXGA).toFixed(2)} xGA/60) limits scoring, ${impactAmount}-goal ${direction} edge.`;
            } else if (factor.name.includes('Power Play')) {
              return `Special teams advantage creates ${impactAmount}-goal ${direction} edge.`;
            } else if (factor.name.includes('PDO') || factor.name.includes('Regression')) {
              const team = factor.impact < 0 ? 
                (factor.awayMetric?.value > factor.homeMetric?.value ? awayTeam : homeTeam) :
                (factor.awayMetric?.value < factor.homeMetric?.value ? awayTeam : homeTeam);
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
  const navigate = useNavigate();
  const [edgeCalculator, setEdgeCalculator] = useState(null);
  const [allEdges, setAllEdges] = useState([]);
  const [topEdges, setTopEdges] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedGame, setExpandedGame] = useState(null);
  const { scores: liveScores } = useLiveScores(); // Real-time live scores from Firestore
  const { bets: firebaseBets } = useFirebaseBets(); // Fetch today's bets from Firebase
  const { bookmarks } = useBookmarks(); // Fetch user bookmarks
  const [goalieProcessor, setGoalieProcessor] = useState(null);
  
  // PREMIUM: Authentication and subscription state
  const { user } = useAuth();
  const { isPremium, isFree } = useSubscription(user);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [gameCardViewCount, setGameCardViewCount] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [forceCollapseCards, setForceCollapseCards] = useState(false);
  
  // DISCLAIMER: State for first-time user acknowledgment
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [pendingGameExpand, setPendingGameExpand] = useState(null);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  
  // WELCOME POPUP: State for first-time visitor conversion modal
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  
  // Check if user has previously acknowledged disclaimer
  useEffect(() => {
    const acknowledged = localStorage.getItem('nhl_savant_disclaimer_acknowledged');
    setHasAcknowledged(!!acknowledged);
  }, []);
  
  // Auto-show welcome popup for new visitors (3 seconds after page load)
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('nhlsavant_welcome_popup_seen');
    
    // Only show for non-premium users who haven't seen it
    if (!hasSeenPopup && !isPremium && user === null) {
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
        logEvent('welcome_popup_shown', {
          user_type: 'new_visitor'
        });
      }, 3000); // 3 seconds delay
      
      return () => clearTimeout(timer);
    }
  }, [isPremium, user]);
  
  // Handle welcome popup close
  const handleWelcomePopupClose = () => {
    setShowWelcomePopup(false);
    localStorage.setItem('nhlsavant_welcome_popup_seen', 'true');
    logEvent('welcome_popup_closed', {
      action: 'dismissed'
    });
  };
  
  // PREMIUM: Load user's usage for today
  useEffect(() => {
    const loadUsage = async () => {
      if (isFree) {
        const usage = await getUsageForToday(user?.uid);
        const viewCount = usage.gameCardsViewed?.length || 0;
        setGameCardViewCount(viewCount);
        setHasReachedLimit(viewCount >= 1);
      } else {
        // Premium users have no limits
        setGameCardViewCount(0);
        setHasReachedLimit(false);
      }
    };
    loadUsage();
  }, [user, isFree, isPremium]);
  
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
      
      // ANALYTICS: Track bets loaded (only B-rated or higher)
      const betsWithEV = edges.filter(game => {
        return game.bestEdge && game.bestEdge.evPercent >= 3;
      }).length;
      trackBetsLoaded(edges.length, betsWithEV);
      
      // Get all opportunities (games with B-rated or higher bets)
      const topOpportunities = calculator.getTopEdges(3); // 3% = B-rated minimum
      setTopEdges(topOpportunities);
    }
  }, [dataProcessor, oddsData, startingGoalies]);
  
  // CRITICAL FIX: Merge live/final games that may not have odds into allEdges
  // This ensures games don't disappear when they go live
  const allGamesToDisplay = useMemo(() => {
    if (!liveScores || liveScores.length === 0) {
      return allEdges;
    }
    
    console.log('🔄 Merging games: ', {
      gamesWithOdds: allEdges.length,
      liveScores: liveScores.length
    });
    
    // Start with all games that have odds
    const merged = [...allEdges];
    
    // Add live/final games that DON'T have odds
    liveScores.forEach(liveScore => {
      // Check if this game already has odds
      const hasOdds = allEdges.some(g => 
        g.awayTeam === liveScore.awayTeam && g.homeTeam === liveScore.homeTeam
      );
      
      // Only add if it's a live/final game AND doesn't have odds
      const isLive = liveScore.status === 'LIVE' || liveScore.status === 'In Progress';
      const isFinal = liveScore.status === 'FINAL' || liveScore.status === 'Final' || liveScore.status === 'CRIT';
      
      if ((isLive || isFinal) && !hasOdds) {
        console.log(`  ➕ Adding live game without odds: ${liveScore.awayTeam} @ ${liveScore.homeTeam}`);
        
        // Create a minimal game object for display
        // Calculate predictions if we have dataProcessor
        let awayWinProb = 50;
        let homeWinProb = 50;
        
        if (dataProcessor) {
          try {
            const awayScore = dataProcessor.predictTeamScore(
              liveScore.awayTeam, 
              liveScore.homeTeam, 
              false
            );
            const homeScore = dataProcessor.predictTeamScore(
              liveScore.homeTeam, 
              liveScore.awayTeam, 
              true
            );
            
            // Convert to win probabilities
            if (awayScore > homeScore) {
              awayWinProb = 55;
              homeWinProb = 45;
            } else if (homeScore > awayScore) {
              awayWinProb = 45;
              homeWinProb = 55;
            }
          } catch (error) {
            console.warn('Could not calculate predictions for live game:', error);
          }
        }
        
        // Extract and format game time from live score data
        // ALWAYS parse timestamps - never use raw ISO strings
        let formattedGameTime = 'Unknown';
        const timeSource = liveScore.startTimeUTC || liveScore.gameTime;
        
        if (timeSource) {
          try {
            // Parse timestamp (handles both ISO format and formatted strings)
            const gameDate = new Date(timeSource);
            
            // Check if date is valid
            if (!isNaN(gameDate.getTime())) {
              const hours = gameDate.getHours();
              const minutes = gameDate.getMinutes();
              const ampm = hours >= 12 ? 'PM' : 'AM';
              const displayHours = hours % 12 || 12;
              formattedGameTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
              
              console.log(`  ⏰ Formatted game time for ${liveScore.awayTeam} @ ${liveScore.homeTeam}: ${timeSource} → ${formattedGameTime}`);
            } else {
              console.warn(`Invalid date for ${liveScore.awayTeam} @ ${liveScore.homeTeam}:`, timeSource);
            }
          } catch (error) {
            console.warn(`Could not parse game time for ${liveScore.awayTeam} @ ${liveScore.homeTeam}:`, error);
          }
        }
        
        merged.push({
          game: `${liveScore.awayTeam} @ ${liveScore.homeTeam}`,
          gameTime: formattedGameTime,
          awayTeam: liveScore.awayTeam,
          homeTeam: liveScore.homeTeam,
          date: getETDate(), // CRITICAL FIX: Use ET date
          edges: {
            moneyline: {
              away: { modelProb: awayWinProb / 100 },
              home: { modelProb: homeWinProb / 100 }
            }
          },
          rawOdds: {},
          isLiveOnly: true // Flag to indicate this game has no pre-game odds
        });
      }
    });
    
    console.log(`  ✅ Total games to display: ${merged.length}`);
    return merged;
  }, [allEdges, liveScores, dataProcessor]);
  
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
  // STANDARD DEFINITIONS (matches rating system in RatingBadge.jsx):
  // - +EV = Games with at least one B-rated or higher bet (EV >= 3%)
  // - ELITE = Games where BEST bet is A-rated or higher (EV >= 7%)
  // Rating system: A+ = 10%+, A = 7-10%, B+ = 5-7%, B = 3-5%
  const getOpportunityCounts = () => {
    // Filter to only games that have at least one B-rated or higher bet (>= 3% EV)
    const opportunities = allEdges.filter(game => {
      let hasQualityBet = false;
      
      // Check moneyline (only count B-rated or higher)
      if (game.edges.moneyline?.away?.evPercent >= 3 || game.edges.moneyline?.home?.evPercent >= 3) {
        hasQualityBet = true;
      }
      
      // Check totals (only count B-rated or higher)
      if (game.edges.total?.over?.evPercent >= 3 || game.edges.total?.under?.evPercent >= 3) {
        hasQualityBet = true;
      }
      
      return hasQualityBet;
    });
    
    // ELITE = GAMES where BEST bet is A-rated or higher (EV >= 7%)
    // Rating system: A+ = 10%+, A = 7-10%, B+ = 5-7%, B = 3-5%
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
      
      // ELITE = A-rated or higher (7%+ EV)
      return bestEV >= 7;
    }).length;
    
    return {
      total: opportunities.length,
      highValue: highValue
    };
  };
  
  const opportunityCounts = getOpportunityCounts();

  // Calculate bet tracking statistics (MUST match Performance page logic)
  // NOTE: This queries ALL completed bets, not just today's bets
  const [betStats, setBetStats] = useState({ totalBets: 0, totalProfit: 0 });
  
  useEffect(() => {
    // Query ALL completed bets (same as Performance page)
    const q = query(
      collection(db, 'bets'),
      where('status', '==', 'COMPLETED')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // FILTER: Only include B-rated or higher bets AND exclude TOTAL market
      // This matches the Performance page filtering logic EXACTLY
      const qualityBets = allBets.filter(bet => 
        bet.prediction?.rating !== 'C' && 
        bet.bet?.market !== 'TOTAL' && 
        !bet.bet?.market?.includes('TOTAL')
      );
      
      const totalBets = qualityBets.length;
      const totalProfit = qualityBets.reduce((sum, bet) => sum + (bet.result?.profit || 0), 0);
      
      setBetStats({ totalBets, totalProfit });
    });
    
    return () => unsubscribe();
  }, []);
  
  // Calculate bookmark statistics for top bar
  const bookmarkStats = useMemo(() => {
    if (!bookmarks || bookmarks.length === 0 || !firebaseBets) {
      return { count: 0, profit: 0 };
    }
    
    let totalProfit = 0;
    
    // Match bookmarks with completed bets to calculate profit
    bookmarks.forEach(bookmark => {
      const matchedBet = firebaseBets.find(bet => bet.id === bookmark.betId && bet.status === 'COMPLETED');
      if (matchedBet?.result) {
        totalProfit += matchedBet.result.profit || 0;
      }
    });
    
    return { count: bookmarks.length, profit: totalProfit };
  }, [bookmarks, firebaseBets]);

  // Smooth scroll handler for QuickSummary navigation
  const handleGameClick = (gameName) => {
    const gameId = `game-${gameName.replace(/\s/g, '-')}`;
    const element = document.getElementById(gameId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  // PREMIUM: Handle game card expansion with gating for free users
  const handleGameExpand = async (gameId, isExpanding) => {
    // If collapsing, always allow
    if (!isExpanding) {
      return true;
    }
    
    // Premium users can always expand
    if (isPremium) {
      return true;
    }
    
    // Free users: check if they've reached their daily limit
    if (isFree && hasReachedLimit && gameCardViewCount >= 1) {
      // Show upgrade modal
      logEvent('free_limit_reached', {
        type: 'game_card',
        viewCount: gameCardViewCount
      });
      setUpgradeModalOpen(true);
      return false; // Prevent expansion
    }
    
    // Free user hasn't reached limit - track this view
    try {
      await trackGameCardView(user?.uid, gameId);
      setGameCardViewCount(prev => prev + 1);
      setHasReachedLimit(true); // They've now used their 1 free view
      
      logEvent('game_card_view', {
        tier: 'free',
        viewCount: gameCardViewCount + 1
      });
      
      return true; // Allow expansion
    } catch (error) {
      console.error('Error tracking game card view:', error);
      return true; // Allow expansion even if tracking fails
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
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: isMobile ? '1rem' : '1.5rem 1rem' }} className="animate-fade-in">
      {/* ✨ MINIMAL PREMIUM HEADER - Apple/Linear level simplicity */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
        padding: isMobile ? '0.875rem 1rem' : '0.75rem 1.25rem',
        marginBottom: isMobile ? '1.25rem' : '1.5rem',
          display: 'flex', 
          alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        flexWrap: 'wrap'
      }}>
        {/* Left: Date/Time info - clean & minimal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ 
            fontSize: isMobile ? '0.813rem' : '0.875rem',
            color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '600',
            letterSpacing: '-0.01em'
                  }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
          
          <span style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)'
          }} />
          
                  <LiveClock />
                  
              {startingGoalies && startingGoalies.games && (
            <>
                <span style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)'
              }} />
              <span style={{
                fontSize: isMobile ? '0.75rem' : '0.813rem',
                      color: '#10B981',
                fontWeight: '600'
                    }}>
                      🥅 {(() => {
                        let confirmed = 0;
                        let total = 0;
                        
                        if (startingGoalies && startingGoalies.games && Array.isArray(startingGoalies.games)) {
                          // Only count goalies for games actually displayed on page
                          allGamesToDisplay.forEach(edge => {
                            const matchingGame = startingGoalies.games.find(g => {
                              // Try exact team code match first
                              const teamMatch = g.away?.team === edge.awayTeam && g.home?.team === edge.homeTeam;
                              // Try matchup string (e.g., "COL @ VGK" matches game "COL @ VGK")
                              const matchupMatch = g.matchup === `${edge.awayTeam} @ ${edge.homeTeam}`;
                              return teamMatch || matchupMatch;
                            });
                            
                            if (matchingGame) {
                              total += 2;
                              if (matchingGame.away?.goalie) confirmed++;
                              if (matchingGame.home?.goalie) confirmed++;
                            }
                          });
                        }
                        
                        return `${confirmed}/${total}`;
                      })()}
                    </span>
            </>
                  )}
          </div>
          </div>
          
      {/* Model Performance - Ultra Slim Bar */}
          <div style={{ 
                      display: 'flex',
          alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '0.875rem' : '1rem',
        padding: isMobile ? '1rem 0' : '0.875rem 0',
        marginBottom: isMobile ? '1.5rem' : '1.25rem',
        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
          flexWrap: 'wrap'
          }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={14} color="#8B5CF6" strokeWidth={2.5} style={{ opacity: 0.7 }} />
            <span style={{
              fontSize: isMobile ? '0.75rem' : '0.813rem',
              fontWeight: '600',
              color: 'rgba(148, 163, 184, 0.9)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
              }}>
              Model
            </span>
            </div>
            
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: isMobile ? '1rem' : '1.125rem', fontWeight: '700', color: '#A78BFA' }}>
                {betStats.totalBets}
            </span>
              <span style={{ fontSize: '0.625rem', color: 'rgba(167, 139, 250, 0.7)', fontWeight: '500' }}>
                bets
            </span>
            </div>
            
            <div style={{ width: '2px', height: '12px', background: 'rgba(148, 163, 184, 0.15)' }} />
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: isMobile ? '1rem' : '1.125rem', fontWeight: '700', color: betStats.totalProfit >= 0 ? '#10B981' : '#EF4444' }}>
                {betStats.totalProfit >= 0 ? '+' : ''}{betStats.totalProfit.toFixed(1)}u
            </span>
              <span style={{ fontSize: '0.625rem', color: betStats.totalProfit >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)', fontWeight: '500' }}>
                profit
            </span>
            </div>

            {bookmarkStats.count > 0 && (
              <>
                <div style={{ width: '2px', height: '12px', background: 'rgba(148, 163, 184, 0.15)' }} />
                
            <div 
                  onClick={() => navigate('/my-picks')}
              style={{
                display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  <span style={{ fontSize: isMobile ? '1rem' : '1.125rem', fontWeight: '700', color: '#D4AF37' }}>
                    {bookmarkStats.count}
              </span>
                  <span style={{ fontSize: '0.625rem', color: 'rgba(212, 175, 55, 0.7)', fontWeight: '500' }}>
                    saved
              </span>
                </div>
              </>
            )}
          </div>
            </div>

        <button
              onClick={() => navigate('/performance')}
              style={{
            padding: '0.375rem 0.75rem',
            background: 'transparent',
            border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '6px',
            color: '#A78BFA',
            fontSize: '0.688rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
            gap: '0.25rem',
            letterSpacing: '0.02em'
              }}
              onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.25)';
          }}
        >
          Details
          <ChevronRight size={12} />
        </button>
        </div>

      {/* Quick Summary Table - REMOVED for cleaner mobile experience */}

      {/* Compact Picks Bar - Show positive EV opportunities */}
      {allEdges && allEdges.length > 0 && (() => {
        // Generate picks bar from allEdges (real-time calculations)
        // This ensures the bar always shows when there are opportunities
        const gameGroups = [];
        
        allEdges.forEach(game => {
          const bets = [];
          
          // Check moneyline
          if (game.edges?.moneyline) {
            if (game.edges.moneyline.away?.evPercent >= 3) {
              bets.push({
                pick: `${game.awayTeam} ML`,
                market: 'MONEYLINE',
                grade: getRating(game.edges.moneyline.away.evPercent).grade,
                odds: game.edges.moneyline.away.odds,
                edge: `+${game.edges.moneyline.away.evPercent.toFixed(1)}%`
              });
            }
            if (game.edges.moneyline.home?.evPercent >= 3) {
              bets.push({
                pick: `${game.homeTeam} ML`,
                market: 'MONEYLINE',
                grade: getRating(game.edges.moneyline.home.evPercent).grade,
                odds: game.edges.moneyline.home.odds,
                edge: `+${game.edges.moneyline.home.evPercent.toFixed(1)}%`
              });
            }
          }
          
          if (bets.length > 0) {
            gameGroups.push({
              game: `${game.awayTeam} @ ${game.homeTeam}`,
              gameTime: game.gameTime,
              bets
            });
          }
        });
        
        return gameGroups.length > 0 ? (
          <div style={{ marginBottom: '1.5rem' }}>
            <CompactPicksBar 
              gameGroups={gameGroups}
              opportunityStats={{
                total: opportunityCounts.total,
                elite: opportunityCounts.highValue
              }}
              isFree={isFree}
              hasReachedLimit={hasReachedLimit}
              isPremium={isPremium}
              onUpgradeClick={() => setUpgradeModalOpen(true)}
              onViewAll={() => {
                document.querySelector('[class*="elevated-card"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              onGameClick={(gameMatchup) => {
                // Scroll to specific game card
                const gameId = `game-${gameMatchup.replace(/\s+/g, '-').replace(/@/g, 'at')}`;
                const gameElement = document.getElementById(gameId);
                if (gameElement) {
                  gameElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  // Add a brief highlight effect
                  gameElement.style.transition = 'all 0.3s ease';
                  gameElement.style.transform = 'scale(1.01)';
                  setTimeout(() => {
                    gameElement.style.transform = 'scale(1)';
                  }, 300);
                }
              }}
            />
          </div>
        ) : null;
      })()}
      
      {/* LEGACY: Firebase-based picks bar (keeping for reference, can be removed) */}
      {false && firebaseBets && firebaseBets.length > 0 && (() => {
        // CRITICAL FIX: Only show bets from TODAY (ET timezone)
        // useFirebaseBets already filters to today + yesterday, so we just need today
        const todayET = getETDate();
        
        console.log('📅 Today (ET):', todayET);
        console.log('📊 All Firebase bets:', firebaseBets.map(b => `${b.date}: ${b.game.awayTeam}@${b.game.homeTeam} (${b.status})`));
        
        const qualityBets = firebaseBets.filter(bet => {
          return (
            bet.date === todayET &&  // ONLY TODAY'S BETS (ET timezone)
            bet.status === 'PENDING' && 
            bet.prediction?.rating && 
            bet.prediction.rating !== 'C'
          );
        });
        
        console.log('✅ Filtered to today:', qualityBets.map(b => `${b.game.awayTeam}@${b.game.homeTeam}`));

        // Group bets by game
        const betsByGame = {};
        qualityBets.forEach(bet => {
          const gameKey = `${bet.game.awayTeam}_${bet.game.homeTeam}`;
          if (!betsByGame[gameKey]) {
            betsByGame[gameKey] = {
              game: `${bet.game.awayTeam} @ ${bet.game.homeTeam}`,
              gameTime: bet.game.gameTime,
              bets: []
            };
          }
          betsByGame[gameKey].bets.push({
            pick: bet.bet.pick,
            market: bet.bet.market,
            grade: bet.prediction.rating,
            odds: bet.bet.odds,
            edge: `${bet.prediction.evPercent.toFixed(1)}%`
          });
        });

        return Object.keys(betsByGame).length > 0 ? (
          <div style={{ marginBottom: '1.5rem' }}>
            <CompactPicksBar 
              gameGroups={Object.values(betsByGame)}
              isFree={isFree}
              hasReachedLimit={hasReachedLimit}
              isPremium={isPremium}
              onUpgradeClick={() => setUpgradeModalOpen(true)}
              onViewAll={() => {
                document.querySelector('[class*="elevated-card"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              onGameClick={(gameMatchup) => {
                // Scroll to specific game card
                const gameId = `game-${gameMatchup.replace(/\s+/g, '-').replace(/@/g, 'at')}`;
                const gameElement = document.getElementById(gameId);
                if (gameElement) {
                  gameElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  // Add a brief highlight effect
                  gameElement.style.transition = 'all 0.3s ease';
                  gameElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
                  setTimeout(() => {
                    gameElement.style.boxShadow = '';
                  }, 1500);
                }
              }}
            />
          </div>
        ) : null;
      })()}

      {/* Conversion Buttons - "How This Works" & "Try Free" */}
      <ConversionButtons 
        user={user}
        isPremium={isPremium}
        isMobile={isMobile}
      />

      {/* Deep Analytics Cards for Each Game - Grouped by Time */}
      <div>
        {(() => {
          // Group games by time slot
          const gamesByTime = {};
          allGamesToDisplay.forEach((game) => {
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
                    const index = allGamesToDisplay.indexOf(game);
          // Find the best edge for this game to show in narrative
          const bestEdge = topEdges
            .filter(e => e.game === game.game && e.evPercent > 0)
            .sort((a, b) => b.evPercent - a.evPercent)[0];

          // Check if game is live or final
          const liveScore = liveScores?.find(score => 
            (score.awayTeam === game.awayTeam && score.homeTeam === game.homeTeam) ||
            (score.away === game.awayTeam && score.home === game.homeTeam)
          );
          const isLiveOrFinal = liveScore && (
            liveScore.status === 'LIVE' || 
            liveScore.status === 'In Progress' || 
            liveScore.status === 'FINAL' || 
            liveScore.status === 'Final'
          );

          const headerContent = (
                      <>
              <CompactHeader
                awayTeam={game.awayTeam}
                homeTeam={game.homeTeam}
                gameTime={game.gameTime}
                rating={bestEdge?.evPercent || 0}
                awayWinProb={(() => {
                  const prob = game.edges.moneyline?.away?.modelProb || 0;
                  // Check if already percentage (>1) or decimal (<=1)
                  return prob > 1 ? prob : prob * 100;
                })()}
                homeWinProb={(() => {
                  const prob = game.edges.moneyline?.home?.modelProb || 0;
                  // Check if already percentage (>1) or decimal (<=1)
                  return prob > 1 ? prob : prob * 100;
                })()}
                isMobile={isMobile}
              bestEdge={bestEdge}
                          game={game}
                          dataProcessor={dataProcessor}
                          liveScores={liveScores}
                          firebaseBets={firebaseBets}
                        />
                        {/* Quick Stats Bar - only show when collapsed AND pre-game (hide during live/final) */}
                        {(() => {
                          // Check if game is live or final
                          const liveScore = liveScores?.find(score => 
                            (score.awayTeam === game.awayTeam && score.homeTeam === game.homeTeam) ||
                            (score.away === game.awayTeam && score.home === game.homeTeam)
                          );
                          const isLiveOrFinal = liveScore && (
                            liveScore.status === 'LIVE' || 
                            liveScore.status === 'In Progress' || 
                            liveScore.status === 'FINAL' || 
                            liveScore.status === 'Final'
                          );
                          
                          // Only show pre-game stats if not live/final
                          if (!isLiveOrFinal) {
                            return (
                        <QuickStatsBar 
                          game={game}
                          awayTeam={game.awayTeam}
                          homeTeam={game.homeTeam}
                          dataProcessor={dataProcessor}
                          isMobile={isMobile}
                        />
                            );
                          }
                          return null;
                        })()}
                      </>
          );

          // Generate unique ID for the game card
          const gameId = `game-${game.awayTeam}-at-${game.homeTeam}`.replace(/\s+/g, '-');

          // If game is live or final, just show the compact header without expansion
          if (isLiveOrFinal) {
            return (
              <div 
                key={index}
                id={gameId}
                className="elevated-card"
                style={{
                  marginBottom: gameIndex < gamesInSlot.length - 1 ? (isMobile ? '0.625rem' : '0.75rem') : 0,
                  padding: 0,
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  scrollMarginTop: '80px' // Offset for fixed headers
                }}
              >
                {headerContent}
              </div>
            );
          }

          // For pre-game, show the full collapsible card
          return (
            <CollapsibleGameCard
              key={index}
              id={gameId}
              header={headerContent}
              defaultExpanded={false}
              index={index}
              isMobile={isMobile}
              forceCollapse={forceCollapseCards}
                        onToggle={async (isExpanded) => {
                          if (isExpanded) {
                            // Check if user has acknowledged disclaimer
                            if (!hasAcknowledged) {
                              // Show disclaimer modal first
                              setPendingGameExpand(game);
                              setShowDisclaimer(true);
                              return false; // Prevent expansion
                            }
                            
                            // PREMIUM: Check if free user has reached limit
                            const canExpand = await handleGameExpand(gameId, true);
                            if (!canExpand) {
                              return false; // Prevent expansion and show upgrade modal
                            }
                            
                            trackBetExpand(game);
                          }
                        }}
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
              
              {/* STEP 2: WHY THIS BET WORKS */}
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
                    <AIBetNarrative
                      game={game}
                      bestEdge={bestEdge}
                      isMobile={isMobile}
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
              
              {/* STEP 4: THE FULL STORY */}
              {(() => {
                const analyticsData = generateAnalyticsData(game, bestEdge);
                return (
                  <StepSection
                    stepNumber={4}
                    title="THE FULL STORY"
                    emoji="📚"
                    accentColor="#F59E0B"
                    isMobile={isMobile}
                  >
                  <AIFullStory 
                    game={game}
                    bestEdge={bestEdge}
                    isMobile={isMobile}
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
                        dataProcessor={dataProcessor}
                        game={game}
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
      
      {/* REMOVED: Separate "Live & Final Games" section - all games now shown chronologically in their time slots above */}
      
      {/* No games message - only show if NO games at all */}
      {allGamesToDisplay.length === 0 && (!liveScores || liveScores.length === 0) && (
        <div className="elevated-card" style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '3rem' }}>
          <Calendar size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Games Today</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Check back later for today's matchups and analysis.
          </p>
        </div>
      )}
      
      {/* Disclaimer Modal - shown when user clicks first game card */}
      <DisclaimerModal 
        isVisible={showDisclaimer}
        onAccept={() => {
          setHasAcknowledged(true);
          setShowDisclaimer(false);
          // Now allow the pending game to expand
          if (pendingGameExpand) {
            trackBetExpand(pendingGameExpand);
            setPendingGameExpand(null);
          }
        }}
        onDecline={() => {
          setShowDisclaimer(false);
          setPendingGameExpand(null);
        }}
      />
      
      {/* Upgrade Modal - shown when free user hits daily limit */}
      <UpgradeModal 
        isOpen={upgradeModalOpen}
        onClose={() => {
          setUpgradeModalOpen(false);
          // Collapse all cards when modal closes without upgrade
          if (!isPremium) {
            setForceCollapseCards(true);
            setTimeout(() => setForceCollapseCards(false), 100);
          }
        }}
        user={user}
      />
      
      {/* Welcome Popup Modal - auto-shown to new visitors after 3 seconds */}
      <WelcomePopupModal 
        isOpen={showWelcomePopup}
        onClose={handleWelcomePopupClose}
        todaysGames={allGamesToDisplay}
        isMobile={isMobile}
      />
    </div>
  );
};

export default TodaysGames;
