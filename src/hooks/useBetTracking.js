import { useEffect, useRef } from 'react';
import { BetTracker } from '../firebase/betTracker';

export function useBetTracking(allEdges, dataProcessor) {
  const tracker = useRef(new BetTracker());
  const savedBets = useRef(new Set()); // Tracks which games we've CREATED bets for (not updated)
  
  useEffect(() => {
    if (!allEdges || allEdges.length === 0) return;
    
    // Track all games with at least one B-rated or higher bet (>= 3% EV)
    const opportunities = allEdges.filter(game => {
      const bestML = getBestMoneyline(game);
      const bestTotal = getBestTotal(game);
      return (bestML && bestML.evPercent >= 3) || (bestTotal && bestTotal.evPercent >= 3);
    });
    
    console.log(`📊 Found ${opportunities.length} games to track (ML + Total only)`);
    
    opportunities.forEach(async (game) => {
      const bestML = getBestMoneyline(game);
      const bestTotal = getBestTotal(game);
      
      // Create a game-level ID to track if we've processed this game
      const gameId = `${game.date}_${game.awayTeam}_${game.homeTeam}`;
      const isFirstTime = !savedBets.current.has(gameId);
      
      // Prediction data (same for both bets)
      const predictionData = {
        awayScore: game.edges.total?.awayScore || 0,
        homeScore: game.edges.total?.homeScore || 0,
        totalScore: game.edges.total?.predictedTotal || 0,
        awayWinProb: game.edges.moneyline?.away?.modelProb || 0.5,
        homeWinProb: game.edges.moneyline?.home?.modelProb || 0.5
      };
      
      // Save/update MONEYLINE bet (if exists and >= 3% EV)
      if (bestML && bestML.evPercent >= 3) {
        try {
          await tracker.current.saveBet(game, bestML, predictionData);
          if (isFirstTime) {
            console.log(`✅ Tracked ML: ${bestML.pick} (+${bestML.evPercent.toFixed(1)}% EV)`);
          }
        } catch (error) {
          console.error(`Failed to save ML bet:`, error);
        }
      }
      
      // Save/update TOTAL bet (if exists and >= 3% EV)
      if (bestTotal && bestTotal.evPercent >= 3) {
        try {
          await tracker.current.saveBet(game, bestTotal, predictionData);
          if (isFirstTime) {
            console.log(`✅ Tracked Total: ${bestTotal.pick} (+${bestTotal.evPercent.toFixed(1)}% EV)`);
          }
        } catch (error) {
          console.error(`Failed to save Total bet:`, error);
        }
      }
      
      // Mark this game as processed (only matters for first time)
      if (isFirstTime) {
        savedBets.current.add(gameId);
      }
    });
    
  }, [allEdges]);
  
  // Get best MONEYLINE bet (home OR away, whichever has higher EV)
  function getBestMoneyline(game) {
    const awayML = game.edges.moneyline?.away;
    const homeML = game.edges.moneyline?.home;
    
    if (!awayML && !homeML) return null;
    
    // Pick the side with higher EV
    const awayEV = awayML?.evPercent || -Infinity;
    const homeEV = homeML?.evPercent || -Infinity;
    
    if (awayEV > homeEV && awayML) {
      return {
        ...awayML,
        market: 'MONEYLINE',
        pick: `${game.awayTeam} ML`,
        team: game.awayTeam
      };
    } else if (homeML) {
      return {
        ...homeML,
        market: 'MONEYLINE',
        pick: `${game.homeTeam} ML`,
        team: game.homeTeam
      };
    }
    
    return null;
  }
  
  // Get best TOTAL bet (over OR under, whichever has higher EV)
  function getBestTotal(game) {
    const over = game.edges.total?.over;
    const under = game.edges.total?.under;
    
    if (!over && !under) return null;
    
    // Pick the side with higher EV
    const overEV = over?.evPercent || -Infinity;
    const underEV = under?.evPercent || -Infinity;
    
    const line = game.rawOdds?.total?.line || over?.line || under?.line;
    
    if (overEV > underEV && over) {
      return {
        ...over,
        market: 'TOTAL',
        pick: `OVER ${line}`,
        line: line
      };
    } else if (under) {
      return {
        ...under,
        market: 'TOTAL',
        pick: `UNDER ${line}`,
        line: line
      };
    }
    
    return null;
  }
  
  return tracker.current;
}
