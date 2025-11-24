/**
 * Basketball Bet Tracker
 * Handles saving basketball bets to Firebase (basketball_bets collection)
 * Uses Firebase transactions for atomic operations
 */

import { db } from './config';
import { doc, runTransaction } from 'firebase/firestore';

export class BasketballBetTracker {
  
  /**
   * Generate deterministic bet ID for basketball
   * Format: 2025-11-24_TOLEDO_TROY_MONEYLINE_TROY_(HOME)
   */
  generateBetId(date, awayTeam, homeTeam, market, prediction) {
    // Determine which team we're betting on
    const pickTeam = prediction.bestTeam;
    const side = pickTeam === awayTeam ? 'AWAY' : 'HOME';
    
    // Normalize team names (remove spaces, uppercase)
    const awayNorm = awayTeam.replace(/\s+/g, '_').toUpperCase();
    const homeNorm = homeTeam.replace(/\s+/g, '_').toUpperCase();
    const teamNorm = pickTeam.replace(/\s+/g, '_').toUpperCase();
    
    return `${date}_${awayNorm}_${homeNorm}_${market}_${teamNorm}_(${side})`;
  }
  
  /**
   * Save basketball bet with Firebase transaction
   * @param {object} game - Matched game object with all data
   * @param {object} prediction - Ensemble prediction with EV, grade, etc.
   */
  async saveBet(game, prediction) {
    // Get current date in YYYY-MM-DD format
    const date = new Date().toISOString().split('T')[0];
    const betId = this.generateBetId(date, game.awayTeam, game.homeTeam, 'MONEYLINE', prediction);
    
    const betRef = doc(db, 'basketball_bets', betId);
    
    const betData = {
      id: betId,
      date: date,
      timestamp: Date.now(),
      sport: 'BASKETBALL',
      
      game: {
        awayTeam: game.awayTeam,
        homeTeam: game.homeTeam,
        gameTime: game.odds?.gameTime || 'TBD'
      },
      
      bet: {
        market: 'MONEYLINE',
        pick: prediction.bestTeam,
        odds: prediction.bestOdds,
        team: prediction.bestTeam
      },
      
      prediction: {
        evPercent: prediction.bestEV,
        grade: prediction.grade,
        confidence: prediction.confidence,
        
        // Ensemble probabilities
        ensembleAwayProb: prediction.ensembleAwayProb,
        ensembleHomeProb: prediction.ensembleHomeProb,
        marketAwayProb: prediction.marketAwayProb,
        marketHomeProb: prediction.marketHomeProb,
        
        // Score predictions
        ensembleAwayScore: prediction.ensembleAwayScore || null,
        ensembleHomeScore: prediction.ensembleHomeScore || null,
        ensembleTotal: prediction.ensembleTotal || null,
        
        // Model breakdown (80% D-Ratings, 20% Haslametrics)
        dratingsAwayProb: prediction.dratingsAwayProb || null,
        dratingsHomeProb: prediction.dratingsHomeProb || null,
        dratingsAwayScore: prediction.dratingsAwayScore || null,
        dratingsHomeScore: prediction.dratingsHomeScore || null,
        
        haslametricsAwayProb: prediction.haslametricsAwayProb || null,
        haslametricsHomeProb: prediction.haslametricsHomeProb || null,
        haslametricsAwayScore: prediction.haslametricsAwayScore || null,
        haslametricsHomeScore: prediction.haslametricsHomeScore || null
      },
      
      result: {
        awayScore: null,
        homeScore: null,
        totalScore: null,
        winner: null,
        outcome: null, // WIN/LOSS/PUSH
        profit: null,
        fetched: false,
        fetchedAt: null,
        source: null
      },
      
      status: 'PENDING'
    };
    
    try {
      await runTransaction(db, async (transaction) => {
        const existingBet = await transaction.get(betRef);
        
        if (existingBet.exists()) {
          console.log(`⏭️ Bet already exists: ${betId}`);
        } else {
          transaction.set(betRef, {
            ...betData,
            firstRecommendedAt: Date.now(),
            initialOdds: prediction.bestOdds,
            initialEV: prediction.bestEV
          });
          console.log(`✅ Saved basketball bet: ${betId} (${prediction.bestOdds}, +${prediction.bestEV.toFixed(1)}% EV, Grade: ${prediction.grade})`);
        }
      });
      
      return betId;
    } catch (error) {
      console.error('❌ Error saving basketball bet:', error);
      throw error;
    }
  }
}

