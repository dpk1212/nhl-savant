import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from './config';
import { getETDate, getETGameDate } from '../utils/dateUtils';
import { calculateNHLDynamicUnits, loadNHLConfidenceWeights } from '../utils/nhlDynamicConfidence';

export class BetTracker {
  constructor() {
    // Pre-load confidence weights on initialization
    this.weightsPromise = loadNHLConfidenceWeights();
  }
  
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
  
  // Sanitize an object for Firestore: replace undefined with null, NaN with 0
  sanitize(obj) {
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== 'object') {
      if (typeof obj === 'number' && isNaN(obj)) return 0;
      return obj;
    }
    if (Array.isArray(obj)) return obj.map(item => this.sanitize(item));
    const clean = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        clean[key] = null;
      } else if (typeof value === 'number' && isNaN(value)) {
        clean[key] = 0;
      } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        clean[key] = this.sanitize(value);
      } else {
        clean[key] = value;
      }
    }
    return clean;
  }
  
  // Save a recommended bet with history tracking
  async saveBet(game, bestEdge, prediction) {
    if (!bestEdge || bestEdge.market === 'TOTAL' || bestEdge.market?.includes('TOTAL')) {
      return;
    }
    
    if (bestEdge.market === 'MONEYLINE' && !bestEdge.calibratedProb && !bestEdge.moneyPuckProb && !bestEdge.ensembleProb) {
      console.warn(`⚠️ Skipping ${bestEdge.pick}: no model probability available`);
      return null;
    }
    
    const gameDate = game.date || getETGameDate();
    const betId = this.generateBetId(gameDate, game.awayTeam, game.homeTeam, bestEdge.market, bestEdge);
    
    if (!betId) {
      return;
    }
    
    console.log(`🔄 saveBet called for ${betId} (${bestEdge.pick}, ${bestEdge.odds}, +${bestEdge.evPercent?.toFixed(1)}% EV)`);
    
    const betData = this.sanitize({
      id: betId,
      date: gameDate,
      timestamp: Date.now(),
      game: {
        awayTeam: game.awayTeam,
        homeTeam: game.homeTeam,
        gameTime: game.gameTime || null,
        actualStartTime: game.startTimestamp || null
      },
      bet: {
        market: bestEdge.market,
        pick: bestEdge.pick,
        line: bestEdge.line || null,
        odds: bestEdge.odds,
        team: bestEdge.team || null,
        side: this.extractSide(bestEdge)
      },
      prediction: {
        awayScore: prediction.awayScore || 0,
        homeScore: prediction.homeScore || 0,
        totalScore: prediction.totalScore || 0,
        awayWinProb: prediction.awayWinProb || 0.5,
        homeWinProb: prediction.homeWinProb || 0.5,
        modelProb: bestEdge.modelProb || 0,
        marketProb: bestEdge.marketProb || this.calculateMarketProb(bestEdge.odds),
        evPercent: bestEdge.evPercent || 0,
        ev: bestEdge.ev || 0,
        kelly: bestEdge.kelly || null,
        ensembleProb: bestEdge.ensembleProb || null,
        agreement: bestEdge.agreement || null,
        confidence: bestEdge.confidence || 'MEDIUM',
        qualityGrade: bestEdge.qualityGrade || null,
        recommendedUnit: bestEdge.recommendedUnit || null,
        rating: bestEdge.rating || this.getRating(bestEdge.evPercent || 0),
        tier: bestEdge.tier || this.getTier(bestEdge.evPercent || 0),
        dynamicUnits: null,
        dynamicTier: null,
        dynamicScore: null
      },
      goalies: {
        away: game.goalies?.away || null,
        home: game.goalies?.home || null
      },
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
      status: "PENDING",
      recommended: true,
      tracked: true,
      modelVersion: "v2.2-ensemble",
      displayedAt: Date.now(),
      displayedGrade: bestEdge.qualityGrade || null,
      displayedEV: bestEdge.evPercent || 0,
      displayedOdds: bestEdge.odds,
      notes: ""
    });
    
    try {
      const weights = await this.weightsPromise;
      const dynamicResult = calculateNHLDynamicUnits(betData, weights);
      betData.prediction.dynamicUnits = dynamicResult.units;
      betData.prediction.dynamicTier = dynamicResult.tier;
      betData.prediction.dynamicScore = dynamicResult.score;
    } catch (err) {
      console.warn('⚠️ Could not calculate dynamic units:', err.message);
      betData.prediction.dynamicUnits = 1.0;
      betData.prediction.dynamicTier = '✅ STANDARD';
      betData.prediction.dynamicScore = 0;
    }
    
    try {
      const betRef = doc(db, 'bets', betId);
      const existingBet = await getDoc(betRef);
      
      if (existingBet.exists()) {
        const currentData = existingBet.data();
        
        const oddsChanged = Math.abs((currentData.bet?.odds || 0) - bestEdge.odds) >= 5;
        const evChanged = Math.abs((currentData.prediction?.evPercent || 0) - (bestEdge.evPercent || 0)) >= 1;
        const lineChanged = bestEdge.line && currentData.bet?.line && 
                           Math.abs(currentData.bet.line - bestEdge.line) >= 0.5;
        const gradeChanged = currentData.prediction?.qualityGrade && 
                            bestEdge.qualityGrade &&
                            currentData.prediction.qualityGrade !== bestEdge.qualityGrade;
        
        if (oddsChanged || evChanged || lineChanged || gradeChanged) {
          const historyEntry = this.sanitize({
            timestamp: Date.now(),
            odds: bestEdge.odds,
            evPercent: bestEdge.evPercent || 0,
            modelProb: bestEdge.modelProb || 0,
            marketProb: bestEdge.marketProb || this.calculateMarketProb(bestEdge.odds),
            qualityGrade: bestEdge.qualityGrade || null,
            agreement: bestEdge.agreement || null,
            ensembleProb: bestEdge.ensembleProb || null,
            confidence: bestEdge.confidence || null
          });
          
          if (bestEdge.line) historyEntry.line = bestEdge.line;
          
          await updateDoc(betRef, this.sanitize({
            history: arrayUnion(historyEntry),
            'bet.odds': bestEdge.odds,
            'bet.line': bestEdge.line || null,
            'prediction.evPercent': bestEdge.evPercent || 0,
            'prediction.ev': bestEdge.ev || 0,
            'prediction.modelProb': bestEdge.modelProb || 0,
            'prediction.marketProb': bestEdge.marketProb || this.calculateMarketProb(bestEdge.odds),
            'prediction.kelly': bestEdge.kelly || null,
            'prediction.rating': bestEdge.rating || this.getRating(bestEdge.evPercent || 0),
            'prediction.ensembleProb': bestEdge.ensembleProb || null,
            'prediction.agreement': bestEdge.agreement || null,
            'prediction.qualityGrade': bestEdge.qualityGrade || null,
            'prediction.confidence': bestEdge.confidence || null,
            'prediction.recommendedUnit': bestEdge.recommendedUnit || null,
            timestamp: Date.now()
          }));
          
          console.log(`📊 Updated bet: ${betId}`);
        } else {
          console.log(`⏭️ No significant change: ${betId}`);
        }
      } else {
        const historyEntry = this.sanitize({
          timestamp: Date.now(),
          odds: bestEdge.odds,
          evPercent: bestEdge.evPercent || 0,
          modelProb: bestEdge.modelProb || 0,
          marketProb: bestEdge.marketProb || this.calculateMarketProb(bestEdge.odds),
          qualityGrade: bestEdge.qualityGrade || null,
          agreement: bestEdge.agreement || null,
          ensembleProb: bestEdge.ensembleProb || null,
          confidence: bestEdge.confidence || null
        });
        
        if (bestEdge.line) historyEntry.line = bestEdge.line;
        
        await setDoc(betRef, this.sanitize({
          ...betData,
          history: [historyEntry],
          firstRecommendedAt: Date.now(),
          initialOdds: bestEdge.odds,
          initialLine: bestEdge.line || null,
          initialEV: bestEdge.evPercent || 0
        }));
        console.log(`✅ SAVED NEW BET: ${betId} (${bestEdge.odds}, +${(bestEdge.evPercent || 0).toFixed(1)}% EV)`);
      }
      
      return betId;
    } catch (error) {
      console.error(`❌ FIREBASE WRITE FAILED for ${betId}:`, error.code, error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
      throw error;
    }
  }
  
  // Update bet with result
  async updateBetResult(betId, result, betData) {
    const betRef = doc(db, 'bets', betId);
    
    const outcome = this.calculateOutcome(result, betData.bet);
    // Use dynamic units (priority) or Kelly-sized units or fallback to 1
    const units = betData.prediction?.dynamicUnits || betData.prediction?.recommendedUnit || 1;
    const profit = this.calculateProfit(outcome, betData.bet.odds, units);
    
    await updateDoc(betRef, {
      'result.awayScore': result.awayScore,
      'result.homeScore': result.homeScore,
      'result.totalScore': result.awayScore + result.homeScore,
      'result.winner': result.awayScore > result.homeScore ? 'AWAY' : 'HOME',
      'result.outcome': outcome,
      'result.profit': profit,
      'result.units': units,  // Store actual units used for grading
      'result.fetched': true,
      'result.fetchedAt': Date.now(),
      'result.source': result.source || 'API',
      'status': 'COMPLETED'
    });
    
    console.log(`✅ Updated bet result: ${betId} → ${outcome} (${profit.toFixed(2)}u @ ${units}u stake)`);
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

