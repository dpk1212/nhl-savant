import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, setDoc, getDoc, arrayUnion, runTransaction } from 'firebase/firestore';
import { db } from './config';

export class BetTracker {
  
  // Generate deterministic bet ID that's stable across odds/line changes
  generateBetId(date, awayTeam, homeTeam, market, edge) {
    if (market === 'MONEYLINE') {
      // ML bets: Use team being bet on (not odds)
      const team = edge.team || awayTeam;
      return `${date}_${awayTeam}_${homeTeam}_MONEYLINE_${team}`;
    } else if (market === 'TOTAL') {
      // Total bets: Use side (OVER/UNDER) but NOT line number
      // This ensures same bet ID when line moves from 6.5 to 6.0
      const side = edge.pick.toUpperCase().includes('OVER') ? 'OVER' : 'UNDER';
      return `${date}_${awayTeam}_${homeTeam}_TOTAL_${side}`;
    }
    // Fallback for other markets
    return `${date}_${awayTeam}_${homeTeam}_${market}_${edge.pick.replace(/\s+/g, '_')}`;
  }
  
  // Save a recommended bet with history tracking using Firebase transactions
  async saveBet(game, bestEdge, prediction) {
    // Get date first (game.date might be undefined)
    const gameDate = game.date || new Date().toISOString().split('T')[0];
    const betId = this.generateBetId(gameDate, game.awayTeam, game.homeTeam, bestEdge.market, bestEdge);
    
    const betData = {
      id: betId,
      date: gameDate,
      timestamp: Date.now(),
      
      // Game Info
      game: {
        awayTeam: game.awayTeam,
        homeTeam: game.homeTeam,
        gameTime: game.gameTime,
        actualStartTime: game.startTimestamp || null
      },
      
      // Bet Details
      bet: {
        market: bestEdge.market,
        pick: bestEdge.pick,
        line: bestEdge.line || null,
        odds: bestEdge.odds,
        team: bestEdge.team || null,
        side: this.extractSide(bestEdge)
      },
      
      // Model Prediction
      prediction: {
        awayScore: prediction.awayScore,
        homeScore: prediction.homeScore,
        totalScore: prediction.totalScore,
        awayWinProb: prediction.awayWinProb,
        homeWinProb: prediction.homeWinProb,
        modelProb: bestEdge.modelProb,
        marketProb: this.calculateMarketProb(bestEdge.odds),
        evPercent: bestEdge.evPercent,
        ev: bestEdge.ev,
        kelly: bestEdge.kelly,
        rating: bestEdge.rating || this.getRating(bestEdge.evPercent),
        confidence: bestEdge.tier || this.getTier(bestEdge.evPercent)
      },
      
      // Starting Goalies (if available)
      goalies: {
        away: game.goalies?.away || null,
        home: game.goalies?.home || null
      },
      
      // Result (populated after game)
      result: {
        awayScore: null,
        homeScore: null,
        totalScore: null,
        winner: null,
        outcome: null,
        profit: null,
        actualProfit: null,
        fetched: false,
        fetchedAt: null,
        source: null
      },
      
      // Metadata
      status: "PENDING",
      recommended: true,
      tracked: true,
      modelVersion: "v2.1-consultant-fix",
      notes: ""
    };
    
    try {
      const betRef = doc(db, 'bets', betId);
      
      // Use Firebase transaction for atomic read-check-write
      await runTransaction(db, async (transaction) => {
        const existingBet = await transaction.get(betRef);
        
        if (existingBet.exists()) {
          // Bet already exists - add to history and update current values
          const currentData = existingBet.data();
          
          // Check if odds, line, or EV changed significantly (avoid spam)
          const oddsChanged = Math.abs(currentData.bet.odds - bestEdge.odds) >= 5;
          const evChanged = Math.abs(currentData.prediction.evPercent - bestEdge.evPercent) >= 1;
          const lineChanged = bestEdge.line && currentData.bet.line && 
                             Math.abs(currentData.bet.line - bestEdge.line) >= 0.5;
          
          if (oddsChanged || evChanged || lineChanged) {
            // Build history entry
            const historyEntry = {
              timestamp: Date.now(),
              odds: bestEdge.odds,
              evPercent: bestEdge.evPercent,
              modelProb: bestEdge.modelProb,
              marketProb: this.calculateMarketProb(bestEdge.odds)
            };
            
            // Add line to history for total bets
            if (bestEdge.line) {
              historyEntry.line = bestEdge.line;
            }
            
            // Update bet document
            transaction.update(betRef, {
              // Add current state to history
              history: arrayUnion(historyEntry),
              // Update current values
              'bet.odds': bestEdge.odds,
              'bet.line': bestEdge.line || null,
              'prediction.evPercent': bestEdge.evPercent,
              'prediction.ev': bestEdge.ev,
              'prediction.modelProb': bestEdge.modelProb,
              'prediction.marketProb': this.calculateMarketProb(bestEdge.odds),
              'prediction.kelly': bestEdge.kelly,
              'prediction.rating': bestEdge.rating || this.getRating(bestEdge.evPercent),
              timestamp: Date.now()
            });
            
            const changes = [];
            if (oddsChanged) changes.push(`odds: ${currentData.bet.odds} → ${bestEdge.odds}`);
            if (lineChanged) changes.push(`line: ${currentData.bet.line} → ${bestEdge.line}`);
            if (evChanged) changes.push(`EV: ${currentData.prediction.evPercent.toFixed(1)}% → ${bestEdge.evPercent.toFixed(1)}%`);
            console.log(`📊 Updated bet: ${betId} (${changes.join(', ')})`);
          } else {
            console.log(`⏭️ Skipped update (no significant change): ${betId}`);
          }
        } else {
          // New bet - create with initial history entry
          const historyEntry = {
            timestamp: Date.now(),
            odds: bestEdge.odds,
            evPercent: bestEdge.evPercent,
            modelProb: bestEdge.modelProb,
            marketProb: this.calculateMarketProb(bestEdge.odds)
          };
          
          // Add line to history for total bets
          if (bestEdge.line) {
            historyEntry.line = bestEdge.line;
          }
          
          transaction.set(betRef, {
            ...betData,
            history: [historyEntry],
            firstRecommendedAt: Date.now(), // Track when first recommended
            initialOdds: bestEdge.odds,
            initialLine: bestEdge.line || null, // Track initial line for totals
            initialEV: bestEdge.evPercent
          });
          console.log(`✅ Saved new bet: ${betId} (${bestEdge.odds}, +${bestEdge.evPercent.toFixed(1)}% EV)`);
        }
      });
      
      return betId;
    } catch (error) {
      console.error('❌ Error saving bet:', error);
      throw error;
    }
  }
  
  // Update bet with result
  async updateBetResult(betId, result, betData) {
    const betRef = doc(db, 'bets', betId);
    
    const outcome = this.calculateOutcome(result, betData.bet);
    const profit = this.calculateProfit(outcome, betData.bet.odds);
    
    await updateDoc(betRef, {
      'result.awayScore': result.awayScore,
      'result.homeScore': result.homeScore,
      'result.totalScore': result.awayScore + result.homeScore,
      'result.winner': result.awayScore > result.homeScore ? 'AWAY' : 'HOME',
      'result.outcome': outcome,
      'result.profit': profit,
      'result.fetched': true,
      'result.fetchedAt': Date.now(),
      'result.source': result.source || 'API',
      'status': 'COMPLETED'
    });
    
    console.log(`✅ Updated bet result: ${betId} → ${outcome} (${profit} units)`);
  }
  
  // Get all pending bets
  async getPendingBets() {
    const q = query(
      collection(db, 'bets'),
      where('status', '==', 'PENDING'),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  // Get bets for a specific date
  async getBetsByDate(date) {
    const q = query(
      collection(db, 'bets'),
      where('date', '==', date),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  // Get all completed bets
  async getCompletedBets() {
    const q = query(
      collection(db, 'bets'),
      where('status', '==', 'COMPLETED'),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  // Calculate outcome
  calculateOutcome(result, bet) {
    switch (bet.market) {
      case 'TOTAL':
        if (bet.side === 'OVER') {
          if (result.totalScore > bet.line) return 'WIN';
          if (result.totalScore < bet.line) return 'LOSS';
          return 'PUSH';
        } else {
          if (result.totalScore < bet.line) return 'WIN';
          if (result.totalScore > bet.line) return 'LOSS';
          return 'PUSH';
        }
      
      case 'MONEYLINE':
        if (bet.side === 'HOME') {
          return result.winner === 'HOME' ? 'WIN' : 'LOSS';
        } else {
          return result.winner === 'AWAY' ? 'WIN' : 'LOSS';
        }
      
      case 'PUCK_LINE':
      case 'PUCKLINE':
        const spread = bet.line || 1.5;
        if (bet.side === 'HOME') {
          const homeSpread = result.homeScore - result.awayScore;
          if (homeSpread > spread) return 'WIN';
          if (homeSpread < spread) return 'LOSS';
          return 'PUSH';
        } else {
          const awaySpread = result.awayScore - result.homeScore;
          if (awaySpread > spread) return 'WIN';
          if (awaySpread < spread) return 'LOSS';
          return 'PUSH';
        }
      
      case 'TEAM_TOTAL':
        const teamScore = bet.team === bet.game?.homeTeam ? result.homeScore : result.awayScore;
        if (bet.side === 'OVER') {
          if (teamScore > bet.line) return 'WIN';
          if (teamScore < bet.line) return 'LOSS';
          return 'PUSH';
        } else {
          if (teamScore < bet.line) return 'WIN';
          if (teamScore > bet.line) return 'LOSS';
          return 'PUSH';
        }
      
      default:
        return null;
    }
  }
  
  // Calculate profit in units
  calculateProfit(outcome, odds) {
    if (outcome === 'PUSH') return 0;
    if (outcome === 'LOSS') return -1;
    
    // WIN
    if (odds < 0) {
      return 100 / Math.abs(odds); // e.g., -110 → 0.909 units
    } else {
      return odds / 100; // e.g., +150 → 1.5 units
    }
  }
  
  extractSide(edge) {
    const pick = edge.pick.toUpperCase();
    
    if (edge.market === 'TOTAL') {
      return pick.includes('OVER') ? 'OVER' : 'UNDER';
    }
    if (edge.market === 'MONEYLINE') {
      return pick.includes('(HOME)') ? 'HOME' : 'AWAY';
    }
    if (edge.market === 'PUCK_LINE' || edge.market === 'PUCKLINE') {
      return pick.includes('(HOME)') ? 'HOME' : 'AWAY';
    }
    if (edge.market === 'TEAM_TOTAL') {
      return pick.includes('OVER') ? 'OVER' : 'UNDER';
    }
    
    return null;
  }
  
  calculateMarketProb(odds) {
    return odds < 0
      ? Math.abs(odds) / (Math.abs(odds) + 100)
      : 100 / (odds + 100);
  }
  
  getRating(evPercent) {
    if (evPercent >= 10) return 'A+';
    if (evPercent >= 7) return 'A';
    if (evPercent >= 5) return 'B+';
    if (evPercent >= 3) return 'B';
    return 'C';
  }
  
  getTier(evPercent) {
    if (evPercent >= 10) return 'ELITE';
    if (evPercent >= 7) return 'EXCELLENT';
    if (evPercent >= 5) return 'STRONG';
    if (evPercent >= 3) return 'GOOD';
    return 'VALUE';
  }
}

