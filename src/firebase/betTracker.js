import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, setDoc } from 'firebase/firestore';
import { db } from './config';

export class BetTracker {
  
  // Save a recommended bet
  async saveBet(game, bestEdge, prediction) {
    const betId = `${game.date}_${game.awayTeam}_${game.homeTeam}_${bestEdge.market}_${bestEdge.pick.replace(/\s+/g, '_')}`;
    
    const betData = {
      id: betId,
      date: game.date || new Date().toISOString().split('T')[0],
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
      // Use setDoc with custom ID instead of addDoc
      await setDoc(doc(db, 'bets', betId), betData);
      console.log(`✅ Saved bet: ${betId}`);
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

