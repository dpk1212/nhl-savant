import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, setDoc, getDoc, arrayUnion, runTransaction } from 'firebase/firestore';
import { db } from './config';
import { getETDate, getETGameDate } from '../utils/dateUtils';

export class BetTracker {
  
  // Generate deterministic bet ID that's stable across odds/line changes
  // CRITICAL: Do NOT use date in ID - odds can be scraped on different days for same game
  generateBetId(date, awayTeam, homeTeam, market, edge) {
    // ⚠️ TOTALS BETTING DISABLED - Not profitable with public data
    if (market === 'TOTAL' || market?.includes('TOTAL')) {
      console.warn('⚠️ TOTALS BETTING DISABLED - Focus on 64.7% moneyline win rate');
      return null;
    }
    
    if (market === 'MONEYLINE') {
      // ML bets: Use team being bet on (not odds, not date)
      const team = edge.team || awayTeam;
      return `${awayTeam}_${homeTeam}_MONEYLINE_${team}`;
    }
    // Fallback for other markets (puck line, etc)
    return `${awayTeam}_${homeTeam}_${market}_${edge.pick.replace(/\s+/g, '_')}`;
  }
  
  // Save a recommended bet with history tracking using Firebase transactions
  async saveBet(game, bestEdge, prediction) {
    // ⚠️ TOTALS BETTING DISABLED - Skip totals bets
    if (!bestEdge || bestEdge.market === 'TOTAL' || bestEdge.market?.includes('TOTAL')) {
      console.log('⏭️ Skipping totals bet (disabled) - Focus on moneyline edge');
      return;
    }
    
    // CRITICAL FIX: Get date using ET game date (treats 12am-6am as previous day)
    // This matches NHL's operational day boundaries for after-midnight scrapes
    const gameDate = game.date || getETGameDate();
    const betId = this.generateBetId(gameDate, game.awayTeam, game.homeTeam, bestEdge.market, bestEdge);
    
    // If generateBetId returns null (totals bet), skip
    if (!betId) {
      return;
    }
    
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
        marketProb: bestEdge.marketProb || this.calculateMarketProb(bestEdge.odds),
        evPercent: bestEdge.evPercent,
        ev: bestEdge.ev,
        kelly: bestEdge.kelly,
        
        // ENSEMBLE FIELDS: Track market-validated quality metrics
        ensembleProb: bestEdge.ensembleProb || null,           // Blended model+market probability
        agreement: bestEdge.agreement || null,                  // Model-market disagreement %
        confidence: bestEdge.confidence || 'MEDIUM',            // HIGH/MEDIUM/LOW based on agreement
        qualityGrade: bestEdge.qualityGrade || null,           // A/B/C/D from ensemble strategy
        recommendedUnit: bestEdge.recommendedUnit || null,     // Kelly-based bet sizing
        
        // Legacy EV-based rating (for comparison with ensemble grades)
        rating: bestEdge.rating || this.getRating(bestEdge.evPercent),  // A+/A/B+/B/C
        tier: bestEdge.tier || this.getTier(bestEdge.evPercent)         // ELITE/EXCELLENT/STRONG/GOOD
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
      modelVersion: "v2.2-ensemble",
      
      // Display tracking: When and how this bet was shown to users
      displayedAt: Date.now(),                           // Timestamp when first displayed
      displayedGrade: bestEdge.qualityGrade || null,    // Ensemble grade when first shown
      displayedEV: bestEdge.evPercent,                   // EV when first shown
      displayedOdds: bestEdge.odds,                      // Odds when first shown
      
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
          
          // Check if odds, line, EV, or grade changed significantly (avoid spam)
          const oddsChanged = Math.abs(currentData.bet.odds - bestEdge.odds) >= 5;
          const evChanged = Math.abs(currentData.prediction.evPercent - bestEdge.evPercent) >= 1;
          const lineChanged = bestEdge.line && currentData.bet.line && 
                             Math.abs(currentData.bet.line - bestEdge.line) >= 0.5;
          const gradeChanged = currentData.prediction.qualityGrade && 
                              bestEdge.qualityGrade &&
                              currentData.prediction.qualityGrade !== bestEdge.qualityGrade;
          
          if (oddsChanged || evChanged || lineChanged || gradeChanged) {
            // Build history entry with ensemble metrics
            const historyEntry = {
              timestamp: Date.now(),
              odds: bestEdge.odds,
              evPercent: bestEdge.evPercent,
              modelProb: bestEdge.modelProb,
              marketProb: bestEdge.marketProb || this.calculateMarketProb(bestEdge.odds),
              
              // ENSEMBLE TRACKING: Record quality metrics at each update
              qualityGrade: bestEdge.qualityGrade || null,
              agreement: bestEdge.agreement || null,
              ensembleProb: bestEdge.ensembleProb || null,
              confidence: bestEdge.confidence || null
            };
            
            // Add line to history for total bets
            if (bestEdge.line) {
              historyEntry.line = bestEdge.line;
            }
            
            // Update bet document with ensemble fields
            transaction.update(betRef, {
              // Add current state to history
              history: arrayUnion(historyEntry),
              // Update current values
              'bet.odds': bestEdge.odds,
              'bet.line': bestEdge.line || null,
              'prediction.evPercent': bestEdge.evPercent,
              'prediction.ev': bestEdge.ev,
              'prediction.modelProb': bestEdge.modelProb,
              'prediction.marketProb': bestEdge.marketProb || this.calculateMarketProb(bestEdge.odds),
              'prediction.kelly': bestEdge.kelly,
              'prediction.rating': bestEdge.rating || this.getRating(bestEdge.evPercent),
              
              // ENSEMBLE FIELDS: Update quality metrics
              'prediction.ensembleProb': bestEdge.ensembleProb || null,
              'prediction.agreement': bestEdge.agreement || null,
              'prediction.qualityGrade': bestEdge.qualityGrade || null,
              'prediction.confidence': bestEdge.confidence || null,
              'prediction.recommendedUnit': bestEdge.recommendedUnit || null,
              
              timestamp: Date.now()
            });
            
            const changes = [];
            if (oddsChanged) changes.push(`odds: ${currentData.bet.odds} → ${bestEdge.odds}`);
            if (lineChanged) changes.push(`line: ${currentData.bet.line} → ${bestEdge.line}`);
            if (evChanged) changes.push(`EV: ${currentData.prediction.evPercent.toFixed(1)}% → ${bestEdge.evPercent.toFixed(1)}%`);
            if (gradeChanged) {
              changes.push(`grade: ${currentData.prediction.qualityGrade} → ${bestEdge.qualityGrade}`);
              console.log(`🔄 Grade changed for ${betId}: ${currentData.prediction.qualityGrade} → ${bestEdge.qualityGrade}`);
            }
            console.log(`📊 Updated bet: ${betId} (${changes.join(', ')})`);
          } else {
            console.log(`⏭️ Skipped update (no significant change): ${betId}`);
          }
        } else {
          // New bet - create with initial history entry including ensemble metrics
          const historyEntry = {
            timestamp: Date.now(),
            odds: bestEdge.odds,
            evPercent: bestEdge.evPercent,
            modelProb: bestEdge.modelProb,
            marketProb: bestEdge.marketProb || this.calculateMarketProb(bestEdge.odds),
            
            // ENSEMBLE TRACKING: Initial quality metrics
            qualityGrade: bestEdge.qualityGrade || null,
            agreement: bestEdge.agreement || null,
            ensembleProb: bestEdge.ensembleProb || null,
            confidence: bestEdge.confidence || null
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
    // Use Kelly-sized units (quarter Kelly) from saved recommendation
    const units = betData.prediction?.recommendedUnit || 1;
    const profit = this.calculateProfit(outcome, betData.bet.odds, units);
    
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
  
  // Calculate profit in units (using Kelly sizing)
  calculateProfit(outcome, odds, units = 1) {
    if (outcome === 'PUSH') return 0;
    if (outcome === 'LOSS') return -units; // Use Kelly-sized units
    
    // WIN - multiply payout by Kelly units
    if (odds < 0) {
      return (100 / Math.abs(odds)) * units; // e.g., -110 → 0.909 units * Kelly
    } else {
      return (odds / 100) * units; // e.g., +150 → 1.5 units * Kelly
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
  
  // UNIFIED GRADING SYSTEM (calibrated for MoneyPuck ensemble)
  getRating(evPercent) {
    if (evPercent >= 8) return 'A+';   // ≥8% → ELITE
    if (evPercent >= 5) return 'A';    // ≥5% → EXCELLENT
    if (evPercent >= 3) return 'B+';   // ≥3% → STRONG
    if (evPercent >= 2) return 'B';    // ≥2% → GOOD
    return 'C';                         // <2% → VALUE
  }
  
  getTier(evPercent) {
    if (evPercent >= 8) return 'ELITE';       // ≥8%
    if (evPercent >= 5) return 'EXCELLENT';   // ≥5%
    if (evPercent >= 3) return 'STRONG';      // ≥3%
    if (evPercent >= 2) return 'GOOD';        // ≥2%
    return 'VALUE';                           // <2%
  }
}

