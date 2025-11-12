import { useEffect, useRef } from 'react';
import { BetTracker } from '../firebase/betTracker';
import { getETDate } from '../utils/dateUtils';

// ENSEMBLE STRATEGY: Track only bets that pass quality filters and are shown to users
export function useBetTracking(topEdges, allEdges, dataProcessor) {
  const tracker = useRef(new BetTracker());
  const processingLock = useRef(new Map()); // Prevent concurrent processing of same game
  const processedToday = useRef(new Set()); // Prevent re-processing in same session
  
  useEffect(() => {
    if (!topEdges || topEdges.length === 0 || !allEdges || allEdges.length === 0) return;
    
    // CRITICAL FIX: Get today's date using ET timezone for deduplication
    const today = getETDate();
    
    // topEdges is already ensemble-filtered (Grade A/B only)
    // This ensures we ONLY track bets that users actually see
    console.log(`📊 Tracking ${topEdges.length} ensemble-filtered bets (shown to users)`);
    
    // ENSEMBLE STRATEGY: Process each ensemble-filtered bet
    // topEdges is an array of edge objects (already has all metadata)
    // allEdges is needed to get prediction data (scores, win probs)
    (async () => {
      for (const edge of topEdges) {
        // Find the corresponding game from allEdges for prediction data
        const game = allEdges.find(g => g.game === edge.game);
        
        if (!game) {
          console.warn(`⚠️ Could not find game data for ${edge.game}`);
          continue;
        }
        
        // Extract team names from game string (e.g., "NYR @ TBL")
        const [awayTeam, homeTeam] = edge.game.split(' @ ');
        const gameId = `${awayTeam}_${homeTeam}`;
        
        // Create unique bet identifier including market and pick
        const betId = `${gameId}_${edge.market}_${edge.pick.replace(/\s+/g, '_')}`;
        
        // Skip if already processed in this session (prevents duplicate triggers)
        if (processedToday.current.has(betId)) {
          continue;
        }
        
        // Skip if currently being processed (prevents race conditions)
        if (processingLock.current.has(betId)) {
          console.log(`⏳ Already processing ${betId}, skipping...`);
          continue;
        }
        
        // Lock this bet for processing
        processingLock.current.set(betId, true);
        
        try {
          // Build prediction data from game edges
          const predictionData = {
            awayScore: game.edges.moneyline?.away?.predictedScore || 
                      game.edges.total?.awayScore || 0,
            homeScore: game.edges.moneyline?.home?.predictedScore || 
                      game.edges.total?.homeScore || 0,
            totalScore: (game.edges.total?.predictedTotal || 0),
            awayWinProb: game.edges.moneyline?.away?.modelProb || 0.5,
            homeWinProb: game.edges.moneyline?.home?.modelProb || 0.5
          };
          
          // Save/update this ensemble-filtered bet
          await tracker.current.saveBet(game, edge, predictionData);
          console.log(`✅ Tracked ${edge.qualityGrade || 'B'}: ${edge.game} - ${edge.pick} (+${edge.evPercent.toFixed(1)}% EV, ${edge.agreement ? (edge.agreement * 100).toFixed(1) + '% agreement' : 'no agreement data'})`);
          
          // Mark as processed for this session
          processedToday.current.add(betId);
          
        } catch (error) {
          console.error(`❌ Failed to save bet ${betId}:`, error);
        } finally {
          // Release lock
          processingLock.current.delete(betId);
        }
      }
    })();
    
  }, [topEdges, allEdges]); // Re-run when ensemble-filtered bets change
  
  return tracker.current;
}



