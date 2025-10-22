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
    
    // Check moneyline
    if (game.edges.moneyline?.away && game.edges.moneyline.away.evPercent > bestEV) {
      bestEV = game.edges.moneyline.away.evPercent;
      bestBet = {
        ...game.edges.moneyline.away,
        market: 'MONEYLINE',
        pick: `${game.awayTeam} (AWAY)`,
        team: game.awayTeam
      };
    }
    if (game.edges.moneyline?.home && game.edges.moneyline.home.evPercent > bestEV) {
      bestEV = game.edges.moneyline.home.evPercent;
      bestBet = {
        ...game.edges.moneyline.home,
        market: 'MONEYLINE',
        pick: `${game.homeTeam} (HOME)`,
        team: game.homeTeam
      };
    }
    
    // Check totals
    if (game.edges.total?.over && game.edges.total.over.evPercent > bestEV) {
      bestEV = game.edges.total.over.evPercent;
      bestBet = {
        ...game.edges.total.over,
        market: 'TOTAL',
        pick: `OVER ${game.rawOdds.total?.line || game.edges.total.over.line}`,
        line: game.rawOdds.total?.line || game.edges.total.over.line
      };
    }
    if (game.edges.total?.under && game.edges.total.under.evPercent > bestEV) {
      bestEV = game.edges.total.under.evPercent;
      bestBet = {
        ...game.edges.total.under,
        market: 'TOTAL',
        pick: `UNDER ${game.rawOdds.total?.line || game.edges.total.under.line}`,
        line: game.rawOdds.total?.line || game.edges.total.under.line
      };
    }
    
    // Check puck line
    if (game.edges.puckLine?.away && game.edges.puckLine.away.evPercent > bestEV) {
      bestEV = game.edges.puckLine.away.evPercent;
      bestBet = {
        ...game.edges.puckLine.away,
        market: 'PUCK_LINE',
        pick: `${game.awayTeam} ${game.edges.puckLine.away.line > 0 ? '+' : ''}${game.edges.puckLine.away.line}`,
        team: game.awayTeam
      };
    }
    if (game.edges.puckLine?.home && game.edges.puckLine.home.evPercent > bestEV) {
      bestEV = game.edges.puckLine.home.evPercent;
      bestBet = {
        ...game.edges.puckLine.home,
        market: 'PUCK_LINE',
        pick: `${game.homeTeam} ${game.edges.puckLine.home.line > 0 ? '+' : ''}${game.edges.puckLine.home.line}`,
        team: game.homeTeam
      };
    }
    
    // Check team totals
    if (Array.isArray(game.edges.teamTotals)) {
      game.edges.teamTotals.forEach(bet => {
        if (bet && bet.evPercent > bestEV) {
          bestEV = bet.evPercent;
          bestBet = {
            ...bet,
            market: 'TEAM_TOTAL',
            pick: bet.pick || `${bet.team} ${bet.side} ${bet.line}`
          };
        }
      });
    }
    
    return bestBet;
  }
  
  return tracker.current;
}

