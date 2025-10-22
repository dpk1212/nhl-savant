// Edge Calculator - Calculate betting edges across all markets
import { parseBothFiles } from './oddsTraderParser';

export class EdgeCalculator {
  constructor(dataProcessor, oddsFiles, startingGoalies = null) {
    this.dataProcessor = dataProcessor;
    this.startingGoalies = startingGoalies;
    
    // Use parseBothFiles if we have both money and total files
    if (oddsFiles && oddsFiles.moneyText && oddsFiles.totalText) {
      this.games = parseBothFiles(oddsFiles.moneyText, oddsFiles.totalText);
    } else {
      this.games = [];
    }
  }

  // Helper: Get starting goalie for a team in a specific game
  getStartingGoalie(team, game) {
    if (!this.startingGoalies || !this.startingGoalies.games) return null;
    
    // Find the game in starting goalies
    const matchup = `${game.awayTeam} @ ${game.homeTeam}`;
    const goalieGame = this.startingGoalies.games.find(g => g.matchup === matchup);
    
    if (!goalieGame) return null;
    
    // Return the goalie for the specified team
    if (goalieGame.away.team === team) {
      return goalieGame.away.goalie;
    } else if (goalieGame.home.team === team) {
      return goalieGame.home.goalie;
    }
    
    return null;
  }

  // Calculate all edges for today's games
  calculateAllEdges() {
    return this.games.map(game => {
      try {
        // CRITICAL FIX: Calculate predicted scores ONCE with starting goalies
        // Then reuse them for all edge calculations
        const awayGoalie = this.getStartingGoalie(game.awayTeam, game);
        const homeGoalie = this.getStartingGoalie(game.homeTeam, game);
        
        const awayScore = this.dataProcessor.predictTeamScore(
          game.awayTeam, 
          game.homeTeam, 
          false,  // Away
          awayGoalie
        );
        const homeScore = this.dataProcessor.predictTeamScore(
          game.homeTeam, 
          game.awayTeam, 
          true,   // Home
          homeGoalie
        );
        
        return {
          game: `${game.awayTeam} @ ${game.homeTeam}`,
          gameTime: game.gameTime,
          awayTeam: game.awayTeam,
          homeTeam: game.homeTeam,
          date: game.date || new Date().toISOString().split('T')[0], // Add date for Firebase tracking
          startTimestamp: game.startTimestamp || null,
          goalies: {
            away: awayGoalie,
            home: homeGoalie
          },
          edges: {
            moneyline: this.calculateMoneylineEdge(game, awayScore, homeScore),
            puckLine: this.calculatePuckLineEdge(game, awayScore, homeScore),
            total: this.calculateTotalEdge(game, awayScore, homeScore),
            teamTotals: this.calculateTeamTotalEdges(game, awayScore, homeScore)
          },
          rawOdds: {
            moneyline: game.moneyline,
            puckLine: game.puckLine,
            total: game.total
          }
        };
      } catch (error) {
        console.error(`Error calculating edges for ${game.awayTeam} @ ${game.homeTeam}:`, error);
        return null;
      }
    }).filter(game => game !== null);
  }

  // Calculate moneyline edge
  // CRITICAL FIX: Use pre-calculated scores instead of recalculating
  calculateMoneylineEdge(game, awayScore, homeScore) {
    if (!game.moneyline.away || !game.moneyline.home) {
      return { away: null, home: null };
    }
    
    // Use Poisson distribution to calculate exact win probabilities
    // This is the SAME calculation used for total, ensures consistency
    const homeWinProb = this.dataProcessor.calculatePoissonWinProb(homeScore, awayScore);
    const awayWinProb = this.dataProcessor.calculatePoissonWinProb(awayScore, homeScore);
    
    // Calculate EV for each side using the model probabilities
    const awayEV = this.dataProcessor.calculateEV(awayWinProb, game.moneyline.away);
    const homeEV = this.dataProcessor.calculateEV(homeWinProb, game.moneyline.home);
    
    // Calculate Kelly stakes using model probabilities
    const awayKelly = this.dataProcessor.calculateKellyStake(awayWinProb, game.moneyline.away);
    const homeKelly = this.dataProcessor.calculateKellyStake(homeWinProb, game.moneyline.home);
    
    return {
      away: {
        ev: awayEV,
        evPercent: awayEV,  // EV is already in dollars ($13.7 = 13.7% on $100 bet)
        modelProb: awayWinProb,
        marketProb: this.dataProcessor.oddsToProbability(game.moneyline.away),
        kelly: awayKelly,
        odds: game.moneyline.away
      },
      home: {
        ev: homeEV,
        evPercent: homeEV,  // EV is already in dollars ($13.7 = 13.7% on $100 bet)
        modelProb: homeWinProb,
        marketProb: this.dataProcessor.oddsToProbability(game.moneyline.home),
        kelly: homeKelly,
        odds: game.moneyline.home
      }
    };
  }

  // Calculate puck line edge
  calculatePuckLineEdge(game, awayScore, homeScore) {
    if (!game.puckLine.away.odds || !game.puckLine.home.odds) {
      return { away: null, home: null };
    }
    
    // Use pre-calculated scores
    const predictedDiff = homeScore - awayScore; // Positive if home wins by more
    
    // Estimate probability of covering spread
    // If spread is -1.5 for favorite, need to win by 2+
    const homeSpread = game.puckLine.home.spread || -1.5;
    const awaySpread = game.puckLine.away.spread || 1.5;
    
    // Simple model: if predicted diff > spread, higher probability of covering
    const homeCoverProb = predictedDiff > homeSpread ? 0.55 : 0.45;
    const awayCoverProb = 1 - homeCoverProb;
    
    // Calculate EV
    const awayEV = this.dataProcessor.calculateEV(awayCoverProb, game.puckLine.away.odds);
    const homeEV = this.dataProcessor.calculateEV(homeCoverProb, game.puckLine.home.odds);
    
    return {
      away: {
        ev: awayEV,
        evPercent: awayEV,  // EV is already in dollars ($13.7 = 13.7% on $100 bet)
        modelProb: awayCoverProb,
        spread: awaySpread,
        odds: game.puckLine.away.odds
      },
      home: {
        ev: homeEV,
        evPercent: homeEV,  // EV is already in dollars ($13.7 = 13.7% on $100 bet)
        modelProb: homeCoverProb,
        spread: homeSpread,
        odds: game.puckLine.home.odds
      }
    };
  }

  // Calculate total (over/under) edge
  calculateTotalEdge(game, awayScore, homeScore) {
    if (!game.total.line || !game.total.over || !game.total.under) {
      return null;
    }
    
    // Use pre-calculated scores (already includes starting goalies and home ice)
    const predictedTotal = awayScore + homeScore;
    
    const marketTotal = game.total.line;
    
    // Calculate edge (how much our model differs from market)
    const edge = predictedTotal - marketTotal;
    
    // FIX: Use POISSON distribution (industry standard for hockey)
    // Hockey goals are discrete, rare events - Poisson is more accurate than Normal
    // P(Over) = P(Total > marketTotal) = 1 - P(Total <= marketTotal)
    const overProb = 1 - this.dataProcessor.poissonCDF(Math.floor(marketTotal), predictedTotal);
    const underProb = 1 - overProb;
    
    // Calculate EV
    const overEV = this.dataProcessor.calculateEV(overProb, game.total.over);
    const underEV = this.dataProcessor.calculateEV(underProb, game.total.under);
    
    // Determine recommendation
    let recommendation = 'NO BET';
    if (edge > 0.3 && overEV > 0) recommendation = 'OVER';
    else if (edge < -0.3 && underEV > 0) recommendation = 'UNDER';
    
    // Calculate Kelly stakes
    const overKelly = this.dataProcessor.calculateKellyStake(overProb, game.total.over);
    const underKelly = this.dataProcessor.calculateKellyStake(underProb, game.total.under);
    
    return {
      predictedTotal: predictedTotal,
      awayScore: awayScore,  // FIX: Add individual scores for display
      homeScore: homeScore,  // FIX: Add individual scores for display
      marketTotal: marketTotal,
      edge: edge,
      recommendation: recommendation,
      over: {
        ev: overEV,
        evPercent: overEV,  // EV is already in dollars ($13.7 = 13.7% on $100 bet)
        modelProb: overProb,
        odds: game.total.over,
        kelly: overKelly
      },
      under: {
        ev: underEV,
        evPercent: underEV,  // EV is already in dollars ($13.7 = 13.7% on $100 bet)
        modelProb: underProb,
        odds: game.total.under,
        kelly: underKelly
      }
    };
  }

  // Calculate team total edges (individual team over/under)
  calculateTeamTotalEdges(game, awayScore, homeScore) {
    // Use pre-calculated scores (already includes starting goalies and home ice)
    return {
      away: {
        predicted: awayScore,
        team: game.awayTeam
      },
      home: {
        predicted: homeScore,
        team: game.homeTeam
      }
    };
  }

  // Get top edges across all markets
  getTopEdges(minEV = 0) {
    const allEdges = this.calculateAllEdges();
    const opportunities = [];
    
    allEdges.forEach(gameEdges => {
      // Moneyline edges
      if (gameEdges.edges.moneyline.away && gameEdges.edges.moneyline.away.ev > minEV) {
        opportunities.push({
          game: gameEdges.game,
          gameTime: gameEdges.gameTime,
          market: 'MONEYLINE',
          pick: `${gameEdges.awayTeam} (AWAY)`,
          team: gameEdges.awayTeam,
          odds: gameEdges.edges.moneyline.away.odds,
          ev: gameEdges.edges.moneyline.away.ev,
          evPercent: gameEdges.edges.moneyline.away.evPercent,
          modelProb: gameEdges.edges.moneyline.away.modelProb,
          kelly: gameEdges.edges.moneyline.away.kelly
        });
      }
      
      if (gameEdges.edges.moneyline.home && gameEdges.edges.moneyline.home.ev > minEV) {
        opportunities.push({
          game: gameEdges.game,
          gameTime: gameEdges.gameTime,
          market: 'MONEYLINE',
          pick: `${gameEdges.homeTeam} (HOME)`,
          team: gameEdges.homeTeam,
          odds: gameEdges.edges.moneyline.home.odds,
          ev: gameEdges.edges.moneyline.home.ev,
          evPercent: gameEdges.edges.moneyline.home.evPercent,
          modelProb: gameEdges.edges.moneyline.home.modelProb,
          kelly: gameEdges.edges.moneyline.home.kelly
        });
      }
      
      // Puck line edges
      if (gameEdges.edges.puckLine.away && gameEdges.edges.puckLine.away.ev > minEV) {
        opportunities.push({
          game: gameEdges.game,
          gameTime: gameEdges.gameTime,
          market: 'PUCK LINE',
          pick: `${gameEdges.awayTeam} ${gameEdges.edges.puckLine.away.spread > 0 ? '+' : ''}${gameEdges.edges.puckLine.away.spread}`,
          team: gameEdges.awayTeam,
          odds: gameEdges.edges.puckLine.away.odds,
          ev: gameEdges.edges.puckLine.away.ev,
          evPercent: gameEdges.edges.puckLine.away.evPercent,
          modelProb: gameEdges.edges.puckLine.away.modelProb,
          kelly: null
        });
      }
      
      if (gameEdges.edges.puckLine.home && gameEdges.edges.puckLine.home.ev > minEV) {
        opportunities.push({
          game: gameEdges.game,
          gameTime: gameEdges.gameTime,
          market: 'PUCK LINE',
          pick: `${gameEdges.homeTeam} ${gameEdges.edges.puckLine.home.spread > 0 ? '+' : ''}${gameEdges.edges.puckLine.home.spread}`,
          team: gameEdges.homeTeam,
          odds: gameEdges.edges.puckLine.home.odds,
          ev: gameEdges.edges.puckLine.home.ev,
          evPercent: gameEdges.edges.puckLine.home.evPercent,
          modelProb: gameEdges.edges.puckLine.home.modelProb,
          kelly: null
        });
      }
      
      // Total edges
      if (gameEdges.edges.total) {
        if (gameEdges.edges.total.over.ev > minEV) {
          opportunities.push({
            game: gameEdges.game,
            gameTime: gameEdges.gameTime,
            market: 'TOTAL',
            pick: `OVER ${gameEdges.edges.total.marketTotal}`,
            team: null,
            odds: gameEdges.edges.total.over.odds,
            ev: gameEdges.edges.total.over.ev,
            evPercent: gameEdges.edges.total.over.evPercent,
            modelProb: gameEdges.edges.total.over.modelProb,
            kelly: gameEdges.edges.total.over.kelly,
            predictedTotal: gameEdges.edges.total.predictedTotal
          });
        }
        
        if (gameEdges.edges.total.under.ev > minEV) {
          opportunities.push({
            game: gameEdges.game,
            gameTime: gameEdges.gameTime,
            market: 'TOTAL',
            pick: `UNDER ${gameEdges.edges.total.marketTotal}`,
            team: null,
            odds: gameEdges.edges.total.under.odds,
            ev: gameEdges.edges.total.under.ev,
            evPercent: gameEdges.edges.total.under.evPercent,
            modelProb: gameEdges.edges.total.under.modelProb,
            kelly: gameEdges.edges.total.under.kelly,
            predictedTotal: gameEdges.edges.total.predictedTotal
          });
        }
      }
    });
    
    // Sort by EV percentage (highest first)
    return opportunities.sort((a, b) => b.evPercent - a.evPercent);
  }
}

