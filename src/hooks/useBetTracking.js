import { useEffect, useRef } from 'react';
import { BetTracker } from '../firebase/betTracker';

export function useBetTracking(allEdges, dataProcessor) {
  const tracker = useRef(new BetTracker());
  const processingLock = useRef(new Map()); // Prevent concurrent processing of same game
  const processedToday = useRef(new Set()); // Prevent re-processing in same session
  
  useEffect(() => {
    if (!allEdges || allEdges.length === 0) return;
    
    // Get today's date for deduplication
    const today = new Date().toISOString().split('T')[0];
    
    // Track all games with at least one B-rated or higher bet (>= 3% EV)
    const opportunities = allEdges.filter(game => {
      const bestML = getBestMoneyline(game);
      const bestTotal = getBestTotal(game);
      return (bestML && bestML.evPercent >= 3) || (bestTotal && bestTotal.evPercent >= 3);
    });
    
    console.log(`📊 Found ${opportunities.length} games to track (ML + Total only)`);
    
    // FIXED: Process games sequentially with proper locking
    (async () => {
      for (const game of opportunities) {
        const bestML = getBestMoneyline(game);
        const bestTotal = getBestTotal(game);
        
        // Create unique game identifier (no date to match bet ID generation)
        const gameId = `${game.awayTeam}_${game.homeTeam}`;
        
        // Skip if already processed in this session (prevents duplicate triggers)
        if (processedToday.current.has(gameId)) {
          continue;
        }
        
        // Skip if currently being processed (prevents race conditions)
        if (processingLock.current.has(gameId)) {
          console.log(`⏳ Already processing ${gameId}, skipping...`);
          continue;
        }
        
        // Lock this game for processing
        processingLock.current.set(gameId, true);
        
        try {
          // Prediction data (same for both bets)
          const predictionData = {
            awayScore: game.edges.total?.awayScore || 0,
            homeScore: game.edges.total?.homeScore || 0,
            totalScore: game.edges.total?.predictedTotal || 0,
            awayWinProb: game.edges.moneyline?.away?.modelProb || 0.5,
            homeWinProb: game.edges.moneyline?.home?.modelProb || 0.5
          };
          
          let savedAny = false;
          
          // Save/update MONEYLINE bet (if exists and >= 3% EV)
          if (bestML && bestML.evPercent >= 3) {
            await tracker.current.saveBet(game, bestML, predictionData);
            console.log(`✅ Tracked ML: ${game.awayTeam} @ ${game.homeTeam} - ${bestML.pick} (+${bestML.evPercent.toFixed(1)}% EV)`);
            savedAny = true;
          }
          
          // Save/update TOTAL bet (if exists and >= 3% EV)
          if (bestTotal && bestTotal.evPercent >= 3) {
            await tracker.current.saveBet(game, bestTotal, predictionData);
            console.log(`✅ Tracked Total: ${game.awayTeam} @ ${game.homeTeam} - ${bestTotal.pick} (+${bestTotal.evPercent.toFixed(1)}% EV)`);
            savedAny = true;
          }
          
          // Mark as processed for this session (only if we saved something)
          if (savedAny) {
            processedToday.current.add(gameId);
          }
          
        } catch (error) {
          console.error(`❌ Failed to save bets for ${gameId}:`, error);
        } finally {
          // Release lock
          processingLock.current.delete(gameId);
        }
      }
    })();
    
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
        pick: `${game.awayTeam} ML (AWAY)`,
        team: game.awayTeam
      };
    } else if (homeML) {
      return {
        ...homeML,
        market: 'MONEYLINE',
        pick: `${game.homeTeam} ML (HOME)`,
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



