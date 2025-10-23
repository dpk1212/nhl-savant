import { useEffect, useRef } from 'react';
import { BetTracker } from '../firebase/betTracker';

export function useBetTracking(allEdges, dataProcessor) {
  const tracker = useRef(new BetTracker());
  const savedBets = useRef(new Set()); // Tracks which games we've CREATED bets for (not updated)
  
  useEffect(() => {
    if (!allEdges || allEdges.length === 0) return;
    
    // Track all games with at least one positive EV bet
    const opportunities = allEdges.filter(game => {
      const bestBet = getBestBet(game);
      return bestBet && bestBet.evPercent > 0;
    });
    
    console.log(`📊 Found ${opportunities.length} betting opportunities to track`);
    
    opportunities.forEach(async (game) => {
      const bestBet = getBestBet(game);
      const alternateBet = getAlternateBet(game, bestBet);
      
      // Create a game-level ID to track if we've processed this game
      const gameId = `${game.date}_${game.awayTeam}_${game.homeTeam}`;
      
      // Only CREATE new bets if we haven't processed this game yet
      // But always UPDATE existing bets with new odds
      const isFirstTime = !savedBets.current.has(gameId);
      
      // Save/update best bet
      const bestBetId = `${game.date}_${game.awayTeam}_${game.homeTeam}_${bestBet.market}_${bestBet.pick.replace(/\s+/g, '_')}`;
      try {
        await tracker.current.saveBet(game, bestBet, {
          awayScore: game.edges.total?.awayScore || 0,
          homeScore: game.edges.total?.homeScore || 0,
          totalScore: game.edges.total?.predictedTotal || 0,
          awayWinProb: game.edges.moneyline?.away?.modelProb || 0.5,
          homeWinProb: game.edges.moneyline?.home?.modelProb || 0.5
        });
        
        if (isFirstTime) {
          console.log(`✅ Created main bet: ${bestBet.market} ${bestBet.pick} (+${bestBet.evPercent.toFixed(1)}% EV)`);
        }
      } catch (error) {
        console.error(`Failed to save main bet for ${bestBetId}:`, error);
      }
      
      // Save/update alternate bet if it's also positive EV
      if (alternateBet && alternateBet.evPercent > 0) {
        const altBetId = `${game.date}_${game.awayTeam}_${game.homeTeam}_${alternateBet.market}_${alternateBet.pick.replace(/\s+/g, '_')}`;
        try {
          await tracker.current.saveBet(game, alternateBet, {
            awayScore: game.edges.total?.awayScore || 0,
            homeScore: game.edges.total?.homeScore || 0,
            totalScore: game.edges.total?.predictedTotal || 0,
            awayWinProb: game.edges.moneyline?.away?.modelProb || 0.5,
            homeWinProb: game.edges.moneyline?.home?.modelProb || 0.5
          });
          
          if (isFirstTime) {
            console.log(`✅ Created alternate bet: ${alternateBet.market} ${alternateBet.pick} (+${alternateBet.evPercent.toFixed(1)}% EV)`);
          }
        } catch (error) {
          console.error(`Failed to save alternate bet for ${altBetId}:`, error);
        }
      }
      
      // Mark this game as processed (only matters for first time)
      if (isFirstTime) {
        savedBets.current.add(gameId);
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
  
  // Get alternate bet (opposite market from best bet)
  function getAlternateBet(game, bestBet) {
    if (!bestBet) return null;
    
    const isValueBetTotal = bestBet.market === 'TOTAL';
    
    if (isValueBetTotal) {
      // Best bet is TOTAL, find best ML alternative
      const awayML = game.edges?.moneyline?.away;
      const homeML = game.edges?.moneyline?.home;
      
      if (!awayML && !homeML) return null;
      
      const bestML = (awayML?.evPercent || -Infinity) > (homeML?.evPercent || -Infinity) ? awayML : homeML;
      const bestMLTeam = (awayML?.evPercent || -Infinity) > (homeML?.evPercent || -Infinity) ? game.awayTeam : game.homeTeam;
      
      if (!bestML || bestML.evPercent <= 0) return null;
      
      return {
        ...bestML,
        market: 'MONEYLINE',
        pick: `${bestMLTeam} ML`,
        team: bestMLTeam
      };
    } else {
      // Best bet is ML (or other), find best TOTAL alternative
      const over = game.edges?.total?.over;
      const under = game.edges?.total?.under;
      
      if (!over && !under) return null;
      
      const bestTotal = (over?.evPercent || -Infinity) > (under?.evPercent || -Infinity) ? over : under;
      const line = game.rawOdds?.total?.line || over?.line || under?.line;
      const isOver = (over?.evPercent || -Infinity) > (under?.evPercent || -Infinity);
      
      if (!bestTotal || bestTotal.evPercent <= 0) return null;
      
      return {
        ...bestTotal,
        market: 'TOTAL',
        pick: isOver ? `OVER ${line}` : `UNDER ${line}`,
        line: line
      };
    }
  }
  
  return tracker.current;
}
