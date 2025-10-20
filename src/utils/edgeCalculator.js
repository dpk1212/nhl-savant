// Edge Calculator - Calculate betting edges across all markets
import { parseBothFiles } from './oddsTraderParser';

export class EdgeCalculator {
  constructor(dataProcessor, oddsFiles) {
    this.dataProcessor = dataProcessor;
    
    // Use parseBothFiles if we have both money and total files
    if (oddsFiles && oddsFiles.moneyText && oddsFiles.totalText) {
      this.games = parseBothFiles(oddsFiles.moneyText, oddsFiles.totalText);
    } else {
      this.games = [];
    }
  }

  // Calculate all edges for today's games
  calculateAllEdges() {
    return this.games.map(game => {
      try {
        return {
          game: `${game.awayTeam} @ ${game.homeTeam}`,
          gameTime: game.gameTime,
          awayTeam: game.awayTeam,
          homeTeam: game.homeTeam,
          edges: {
            moneyline: this.calculateMoneylineEdge(game),
            puckLine: this.calculatePuckLineEdge(game),
            total: this.calculateTotalEdge(game),
            teamTotals: this.calculateTeamTotalEdges(game)
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
  calculateMoneylineEdge(game) {
    const awayTeam = this.dataProcessor.getTeamData(game.awayTeam, 'all');
    const homeTeam = this.dataProcessor.getTeamData(game.homeTeam, 'all');
    
    if (!awayTeam || !homeTeam || !game.moneyline.away || !game.moneyline.home) {
      return { away: null, home: null };
    }
    
    // Estimate win probability using improved logistic model with home ice built-in
    // Home team perspective (isHome = true) 
    const homeWinProb = this.dataProcessor.estimateWinProbability(homeTeam, awayTeam, true);
    // Away team win prob is complement
    const awayWinProb = 1 - homeWinProb;
    
    // Calculate EV for each side using the model probabilities
    const awayEV = this.dataProcessor.calculateEV(awayWinProb, game.moneyline.away);
    const homeEV = this.dataProcessor.calculateEV(homeWinProb, game.moneyline.home);
    
    // Calculate Kelly stakes using model probabilities
    const awayKelly = this.dataProcessor.calculateKellyStake(awayWinProb, game.moneyline.away);
    const homeKelly = this.dataProcessor.calculateKellyStake(homeWinProb, game.moneyline.home);
    
    return {
      away: {
        ev: awayEV,
        evPercent: (awayEV / 100) * 100,
        modelProb: awayWinProb,
        marketProb: this.dataProcessor.oddsToProbability(game.moneyline.away),
        kelly: awayKelly,
        odds: game.moneyline.away
      },
      home: {
        ev: homeEV,
        evPercent: (homeEV / 100) * 100,
        modelProb: homeWinProb,
        marketProb: this.dataProcessor.oddsToProbability(game.moneyline.home),
        kelly: homeKelly,
        odds: game.moneyline.home
      }
    };
  }

  // Calculate puck line edge
  calculatePuckLineEdge(game) {
    const awayTeam = this.dataProcessor.getTeamData(game.awayTeam, 'all');
    const homeTeam = this.dataProcessor.getTeamData(game.homeTeam, 'all');
    
    if (!awayTeam || !homeTeam || 
        !game.puckLine.away.odds || !game.puckLine.home.odds) {
      return { away: null, home: null };
    }
    
    // Predict goal differential
    const awayScore = this.dataProcessor.predictTeamScore(game.awayTeam, game.homeTeam);
    const homeScore = this.dataProcessor.predictTeamScore(game.homeTeam, game.awayTeam);
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
        evPercent: (awayEV / 100) * 100,
        modelProb: awayCoverProb,
        spread: awaySpread,
        odds: game.puckLine.away.odds
      },
      home: {
        ev: homeEV,
        evPercent: (homeEV / 100) * 100,
        modelProb: homeCoverProb,
        spread: homeSpread,
        odds: game.puckLine.home.odds
      }
    };
  }

  // Calculate total (over/under) edge
  calculateTotalEdge(game) {
    if (!game.total.line || !game.total.over || !game.total.under) {
      return null;
    }
    
    const predictedTotal = this.dataProcessor.predictGameTotal(game.awayTeam, game.homeTeam);
    const marketTotal = game.total.line;
    
    // Calculate edge (how much our model differs from market)
    const edge = predictedTotal - marketTotal;
    
    // AUDIT IMPROVEMENT 1C: Dynamic standard deviation based on expected total
    // Low-scoring games (4 goals): stdDev ~1.3
    // High-scoring games (7 goals): stdDev ~1.8
    // Formula: 0.9 + (predictedTotal * 0.12)
    const stdDev = 0.9 + (predictedTotal * 0.12);
    
    // Calculate Z-score: how many standard deviations is market line from prediction?
    const zScore = (marketTotal - predictedTotal) / stdDev;
    
    // Probability of going OVER using cumulative distribution function
    // P(actual > market) = P(Z > z-score) = 1 - CDF(z-score)
    const overProb = 1 - this.dataProcessor.normalCDF(zScore);
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
      marketTotal: marketTotal,
      edge: edge,
      recommendation: recommendation,
      over: {
        ev: overEV,
        evPercent: (overEV / 100) * 100,
        modelProb: overProb,
        odds: game.total.over,
        kelly: overKelly
      },
      under: {
        ev: underEV,
        evPercent: (underEV / 100) * 100,
        modelProb: underProb,
        odds: game.total.under,
        kelly: underKelly
      }
    };
  }

  // Calculate team total edges (individual team over/under)
  calculateTeamTotalEdges(game) {
    const awayScore = this.dataProcessor.predictTeamScore(game.awayTeam, game.homeTeam);
    const homeScore = this.dataProcessor.predictTeamScore(game.homeTeam, game.awayTeam);
    
    // For now, return predicted team totals
    // Real implementation would need actual team total lines from sportsbook
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

