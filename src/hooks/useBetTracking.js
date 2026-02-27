import { useEffect, useRef } from 'react';
import { BetTracker } from '../firebase/betTracker';
import { getETDate } from '../utils/dateUtils';

export function useBetTracking(topEdges, allEdges, dataProcessor) {
  const tracker = useRef(new BetTracker());
  const processingLock = useRef(new Map());
  const processedToday = useRef(new Set());
  const retryCount = useRef(new Map());
  const hasRun = useRef(false);
  
  useEffect(() => {
    if (!topEdges || topEdges.length === 0 || !allEdges || allEdges.length === 0) {
      console.log(`📊 BetTracking: waiting for data (topEdges=${topEdges?.length || 0}, allEdges=${allEdges?.length || 0})`);
      return;
    }
    
    const today = getETDate();
    
    console.log(`📊 BetTracking: Processing ${topEdges.length} confirmed edges for ${today}`);
    topEdges.forEach(e => {
      console.log(`  → ${e.game} | ${e.pick} | Grade: ${e.qualityGrade} | EV: ${e.evPercent?.toFixed(1)}% | MP: ${e.moneyPuckProb} | Cal: ${e.calibratedProb} | Prelim: ${e.isPreliminary}`);
    });
    
    const processBets = async () => {
      for (const edge of topEdges) {
        const game = allEdges.find(g => g.game === edge.game);
        
        if (!game) {
          console.warn(`⚠️ BetTracking: No game data for ${edge.game}`);
          continue;
        }
        
        const [awayTeam, homeTeam] = edge.game.split(' @ ');
        const gameId = `${awayTeam}_${homeTeam}`;
        const betId = `${gameId}_${edge.market}_${edge.pick.replace(/\s+/g, '_')}`;
        
        if (processedToday.current.has(betId)) {
          continue;
        }
        
        if (processingLock.current.has(betId)) {
          continue;
        }
        
        processingLock.current.set(betId, true);
        
        try {
          const predictionData = {
            awayScore: game.edges.moneyline?.away?.predictedScore || 0,
            homeScore: game.edges.moneyline?.home?.predictedScore || 0,
            totalScore: 0,
            awayWinProb: game.edges.moneyline?.away?.modelProb || 0.5,
            homeWinProb: game.edges.moneyline?.home?.modelProb || 0.5
          };
          
          console.log(`🔄 BetTracking: Saving ${betId}...`);
          console.log(`   game keys: ${Object.keys(game).join(', ')}`);
          console.log(`   edge keys: ${Object.keys(edge).join(', ')}`);
          console.log(`   game.awayTeam=${game.awayTeam}, game.homeTeam=${game.homeTeam}, game.date=${game.date}`);
          
          const savedBet = await tracker.current.saveBet(game, edge, predictionData);
          
          if (savedBet) {
            console.log(`✅ BetTracking: SAVED ${betId} → Firebase ID: ${savedBet}`);
            processedToday.current.add(betId);
          } else {
            console.warn(`⚠️ BetTracking: saveBet returned ${savedBet} for ${betId} - bet was SKIPPED`);
            const count = (retryCount.current.get(betId) || 0) + 1;
            retryCount.current.set(betId, count);
            if (count >= 3) {
              console.error(`❌ BetTracking: ${betId} failed ${count} times, marking as processed to stop retries`);
              processedToday.current.add(betId);
            }
          }
          
        } catch (error) {
          console.error(`❌ BetTracking: FIREBASE ERROR saving ${betId}:`, error);
          console.error(`   Error code: ${error.code}, message: ${error.message}`);
        } finally {
          processingLock.current.delete(betId);
        }
      }
    };
    
    processBets();
    
    // Retry after 10 seconds for any bets that failed
    const retryTimer = setTimeout(() => {
      const unprocessed = topEdges.filter(edge => {
        const [a, h] = edge.game.split(' @ ');
        const bid = `${a}_${h}_${edge.market}_${edge.pick.replace(/\s+/g, '_')}`;
        return !processedToday.current.has(bid);
      });
      if (unprocessed.length > 0) {
        console.log(`🔄 BetTracking: Retrying ${unprocessed.length} unprocessed bets...`);
        processBets();
      }
    }, 10000);
    
    return () => clearTimeout(retryTimer);
    
  }, [topEdges, allEdges]);
  
  return tracker.current;
}



