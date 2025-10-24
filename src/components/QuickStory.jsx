/**
 * QuickStory Component
 * Provides a plain-language explanation of why this is the best bet
 * NOW WITH SITUATIONAL CONTEXT (road trip, B2B, homecoming, goalies)
 */

import { TYPOGRAPHY, ELEVATION } from '../utils/designSystem';
import { getTeamName } from '../utils/oddsTraderParser';

const QuickStory = ({ game, bestEdge, factors, isMobile, dataProcessor }) => {
  if (!bestEdge || !factors || factors.length === 0) return null;
  
  // Generate story from top factors, bet type, AND situational context
  const generateStory = () => {
    const topFactors = factors.slice(0, 3);
    const { awayTeam, homeTeam } = game;
    const betType = bestEdge.type || bestEdge.market;
    const pick = bestEdge.pick || bestEdge.displayPick;
    
    // Get situational context from scheduleHelper (if available)
    const scheduleHelper = dataProcessor?.scheduleHelper;
    let awayContext = null;
    let homeContext = null;
    
    if (scheduleHelper && game.date) {
      // Away team situational factors
      const awayRest = scheduleHelper.getDaysRest(awayTeam, game.date);
      const awayAwayStreak = scheduleHelper.getConsecutiveAwayGames(awayTeam, game.date);
      const awayRoadTripAdj = scheduleHelper.getRoadTripAdjustment(awayTeam, game.date);
      
      awayContext = {
        daysRest: awayRest,
        isB2B: awayRest === 1,
        awayStreak: awayAwayStreak,
        roadTripPenalty: awayRoadTripAdj
      };
      
      // Home team situational factors
      const homeRest = scheduleHelper.getDaysRest(homeTeam, game.date);
      const { isHomecoming, tripLength } = scheduleHelper.isHomecomingGame(homeTeam, game.date);
      const homecomingBoost = scheduleHelper.getHomecomingAdjustment(homeTeam, game.date);
      
      homeContext = {
        daysRest: homeRest,
        isB2B: homeRest === 1,
        isHomecoming,
        tripLength,
        homecomingBoost
      };
    }
    
    // Get goalie context (if available)
    const awayGoalie = game.goalies?.away;
    const homeGoalie = game.goalies?.home;
    
    // Determine which team has the statistical advantage
    const teamAdvantages = {
      away: 0,
      home: 0
    };
    
    topFactors.forEach(factor => {
      if (factor.awayMetric && factor.homeMetric) {
        if (factor.awayMetric.value > factor.homeMetric.value) {
          teamAdvantages.away++;
        } else {
          teamAdvantages.home++;
        }
      }
    });
    
    const favoredTeam = teamAdvantages.away > teamAdvantages.home ? awayTeam : homeTeam;
    const otherTeam = favoredTeam === awayTeam ? homeTeam : awayTeam;
    const favoredContext = favoredTeam === awayTeam ? awayContext : homeContext;
    const otherContext = favoredTeam === awayTeam ? homeContext : awayContext;
    
    // Build narrative based on bet type WITH SITUATIONAL CONTEXT
    let narrative = '';
    let setupContext = '';
    
    // Build situational setup (if applicable)
    const situationalFactors = [];
    
    if (awayContext) {
      if (awayContext.isB2B) {
        situationalFactors.push(`${awayTeam} on back-to-back`);
      } else if (awayContext.roadTripPenalty < -0.05) {
        situationalFactors.push(`${awayTeam} fatigued (game ${awayContext.awayStreak + 1} of road trip)`);
      } else if (awayContext.daysRest >= 3) {
        situationalFactors.push(`${awayTeam} well-rested (${awayContext.daysRest} days off)`);
      }
    }
    
    if (homeContext) {
      if (homeContext.isB2B) {
        situationalFactors.push(`${homeTeam} on back-to-back`);
      } else if (homeContext.isHomecoming) {
        situationalFactors.push(`${homeTeam} returning home after ${homeContext.tripLength}-game trip`);
      } else if (homeContext.daysRest >= 3) {
        situationalFactors.push(`${homeTeam} well-rested (${homeContext.daysRest} days off)`);
      }
    }
    
    if (situationalFactors.length > 0) {
      setupContext = `${situationalFactors.join(', ')}. `;
    }
    
    if (betType === 'TOTAL' || betType === 'total') {
      const isUnder = pick.includes('UNDER') || pick.includes('U ');
      const modelTotal = game.edges.total?.predictedTotal || 0;
      const marketTotal = game.edges.total?.marketTotal || 0;
      const edge = Math.abs(modelTotal - marketTotal);
      
      if (isUnder) {
        // Under narrative - situational context + defensive matchup
        narrative += setupContext;
        
        // Get best defensive factor
        const defensiveFactor = topFactors.find(f => 
          f.name.includes('Against') || f.name.includes('Defense') || f.name.includes('GA')
        );
        
        if (defensiveFactor) {
          const { awayMetric, homeMetric } = defensiveFactor;
          const betterDefense = awayMetric.value < homeMetric.value ? awayTeam : homeTeam;
          const betterValue = Math.min(awayMetric.value, homeMetric.value).toFixed(2);
          
          narrative += `${betterDefense}'s elite defense (${betterValue} ${defensiveFactor.name}) limits scoring opportunities. `;
        } else {
          narrative += `Both teams showing defensive strengths in recent games. `;
        }
        
        // Mention goalie if elite
        if (awayGoalie && awayGoalie.includes('Shesterkin|Hellebuyck|Sorokin|Oettinger')) {
          narrative += `${awayGoalie} expected in net adds defensive stability. `;
        } else if (homeGoalie && homeGoalie.includes('Shesterkin|Hellebuyck|Sorokin|Oettinger')) {
          narrative += `${homeGoalie} expected in net adds defensive stability. `;
        }
        
        narrative += `Model projects ${modelTotal.toFixed(1)} goals vs market's ${marketTotal.toFixed(1)} — defensive matchup favors UNDER.`;
        
      } else {
        // Over narrative - situational context + offensive matchup
        narrative += setupContext;
        
        // Get best offensive or weak defensive factor
        const offensiveFactor = topFactors.find(f => 
          f.name.includes('For') || f.name.includes('Offense') || f.name.includes('GF')
        );
        
        if (offensiveFactor) {
          const { awayMetric, homeMetric } = offensiveFactor;
          const betterOffense = awayMetric.value > homeMetric.value ? awayTeam : homeTeam;
          const betterValue = Math.max(awayMetric.value, homeMetric.value).toFixed(2);
          
          narrative += `${betterOffense} generating elite chances (${betterValue} ${offensiveFactor.name}). `;
        }
        
        // Look for defensive weakness
        const defensiveWeakness = topFactors.find(f => 
          f.name.includes('Against') && (f.awayMetric.value > 2.7 || f.homeMetric.value > 2.7)
        );
        
        if (defensiveWeakness) {
          const weakDefense = defensiveWeakness.awayMetric.value > defensiveWeakness.homeMetric.value ? awayTeam : homeTeam;
          narrative += `${weakDefense} allows quality scoring chances. `;
        }
        
        narrative += `Model projects ${modelTotal.toFixed(1)} goals vs market's ${marketTotal.toFixed(1)} — offensive matchup favors OVER.`;
      }
      
    } else {
      // Moneyline narrative - situational context + team advantage
      const teamPick = pick.includes(awayTeam) ? awayTeam : homeTeam;
      const opponent = teamPick === awayTeam ? homeTeam : awayTeam;
      const pickContext = teamPick === awayTeam ? awayContext : homeContext;
      const modelProb = (teamPick === awayTeam ? game.edges.moneyline?.away?.modelProb : game.edges.moneyline?.home?.modelProb) || 0;
      
      // Lead with situational edge if strong
      if (pickContext?.homecomingBoost > 0) {
        narrative = `${teamPick} returning home after ${pickContext.tripLength}-game road trip with fresh legs and home crowd energy. `;
      } else if (pickContext?.isB2B) {
        narrative = `${teamPick} on back-to-back, but `;
      } else {
        narrative = setupContext;
      }
      
      // Add matchup advantages
      if (topFactors.length > 0) {
        const topFactor = topFactors[0];
        const pickAdvantage = teamPick === awayTeam ? topFactor.awayMetric.value : topFactor.homeMetric.value;
        const oppValue = teamPick === awayTeam ? topFactor.homeMetric.value : topFactor.awayMetric.value;
        
        if (topFactor.name.includes('For') || topFactor.name.includes('GF')) {
          narrative += `their offense (${pickAdvantage.toFixed(2)} ${topFactor.name}) significantly outpaces ${opponent}'s (${oppValue.toFixed(2)}). `;
        } else {
          narrative += `they hold a clear edge in ${topFactor.name.toLowerCase()}. `;
        }
      }
      
      narrative += `Model gives ${teamPick} ${(modelProb * 100).toFixed(0)}% win probability — value at current odds.`;
    }
    
    return narrative;
  };
  
  const story = generateStory();
  
  return (
    <div style={{ 
      padding: isMobile ? '1rem' : '1.25rem',
      background: 'rgba(212, 175, 55, 0.08)',
      border: ELEVATION.flat.border,
      borderRadius: '10px',
      margin: isMobile ? '0.75rem' : '1.25rem'
    }}>
      <div style={{ 
        fontSize: TYPOGRAPHY.label.size, 
        fontWeight: TYPOGRAPHY.heading.weight, 
        color: 'var(--color-accent)', 
        marginBottom: '0.625rem',
        textTransform: TYPOGRAPHY.label.textTransform,
        letterSpacing: TYPOGRAPHY.label.letterSpacing,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        📖 THE QUICK STORY
      </div>
      <div style={{ 
        fontSize: TYPOGRAPHY.body.size, 
        lineHeight: '1.6', 
        color: 'var(--color-text-primary)',
        fontWeight: TYPOGRAPHY.caption.weight
      }}>
        {story}
      </div>
    </div>
  );
};

export default QuickStory;

