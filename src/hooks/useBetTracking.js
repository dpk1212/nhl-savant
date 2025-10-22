import { useEffect, useRef } from 'react';
import { BetTracker } from '../firebase/betTracker';

export function useBetTracking(allEdges, dataProcessor) {
  const tracker = useRef(new BetTracker());
  const savedBets = useRef(new Set());
  
  useEffect(() => {
    if (!allEdges || allEdges.length === 0) return;
    
    // Only track bets with positive EV
    const opportunities = allEdges.filter(game => {
      const bestBet = getBestBet(game);
      return bestBet && bestBet.evPercent > 0;
    });
    
    console.log(`📊 Found ${opportunities.length} betting opportunities to track`);
    
    opportunities.forEach(async (game) => {
      const bestBet = getBestBet(game);
      const betId = `${game.date}_${game.awayTeam}_${game.homeTeam}`;
      
      // Only save once per session
      if (savedBets.current.has(betId)) return;
      
      try {
        await tracker.current.saveBet(game, bestBet, {
          awayScore: game.edges.total?.awayScore || 0,
          homeScore: game.edges.total?.homeScore || 0,
          totalScore: game.edges.total?.predictedTotal || 0,
          awayWinProb: game.edges.moneyline?.away?.modelProb || 0.5,
          homeWinProb: game.edges.moneyline?.home?.modelProb || 0.5
        });
        
        savedBets.current.add(betId);
      } catch (error) {
        console.error(`Failed to save bet for ${betId}:`, error);
      }
    });
    
  }, [allEdges]);
  
  function getBestBet(game) {
    let bestBet = null;
    let bestEV = 0;
    
    // Check all markets for highest EV
    const markets = [
      { key: 'moneyline', name: 'MONEYLINE' },
      { key: 'total', name: 'TOTAL' },
      { key: 'puckLine', name: 'PUCK_LINE' },
      { key: 'teamTotals', name: 'TEAM_TOTAL' }
    ];
    
    markets.forEach(({ key, name }) => {
      if (!game.edges[key]) return;
      
      const edgeData = game.edges[key];
      
      // Handle different edge structures
      if (Array.isArray(edgeData)) {
        // Team totals are an array
        edgeData.forEach(bet => {
          if (bet && bet.evPercent > bestEV) {
            bestEV = bet.evPercent;
            bestBet = { ...bet, market: name };
          }
        });
      } else {
        // Other markets are objects with away/home or over/under
        Object.values(edgeData).forEach(bet => {
          if (bet && typeof bet === 'object' && bet.evPercent > bestEV) {
            bestEV = bet.evPercent;
            bestBet = { ...bet, market: name };
          }
        });
      }
    });
    
    return bestBet;
  }
  
  return tracker.current;
}

