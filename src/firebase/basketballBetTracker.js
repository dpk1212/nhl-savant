/**
 * Basketball Bet Tracker
 * Handles saving basketball bets to Firebase (basketball_bets collection)
 * Uses Firebase transactions for atomic operations
 * 
 * NOW: Called directly from UI when predictions are calculated
 * This ensures Firebase data always matches what's displayed
 */

import { db } from './config';
import { doc, runTransaction, getDoc, setDoc } from 'firebase/firestore';

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
   * NOW INCLUDES: Dynamic confidence-based unit sizing (matches UI exactly)
   * 
   * @param {object} game - Matched game object with all data
   * @param {object} prediction - Ensemble prediction with EV, grade, dynamic units, etc.
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
        simplifiedGrade: prediction.simplifiedGrade,
        confidence: prediction.confidence,
        
        // === DYNAMIC CONFIDENCE-BASED UNIT SIZING ===
        // These come directly from the UI calculation (single source of truth)
        unitSize: prediction.unitSize,
        confidenceTier: prediction.confidenceTier,
        confidenceScore: prediction.confidenceScore,
        confidenceFactors: prediction.confidenceFactors || null,
        
        // Pattern ROI from 325-bet dynamic analysis
        historicalROI: prediction.historicalROI,
        oddsRange: prediction.oddsRange,
        oddsRangeName: prediction.oddsRangeName,
        qualityEmoji: prediction.qualityEmoji,
        
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
          // Bet exists - update prediction data to latest calculation
          // (In case odds changed, or weights updated)
          const existing = existingBet.data();
          
          // Only update if bet is still PENDING (don't overwrite graded bets)
          if (existing.status === 'PENDING') {
            transaction.update(betRef, {
              prediction: betData.prediction,
              'bet.odds': prediction.bestOdds,
              lastUpdated: Date.now()
            });
            console.log(`🔄 Updated pending bet: ${betId} (${prediction.unitSize}u - ${prediction.confidenceTier})`);
          } else {
            console.log(`⏭️ Bet already graded, skipping: ${betId}`);
          }
        } else {
          // New bet - create it
          transaction.set(betRef, {
            ...betData,
            firstRecommendedAt: Date.now(),
            initialOdds: prediction.bestOdds,
            initialEV: prediction.bestEV
          });
          console.log(`✅ Saved basketball bet: ${betId}`);
          console.log(`   ${prediction.bestOdds} | +${prediction.bestEV.toFixed(1)}% EV | Grade: ${prediction.grade}`);
          console.log(`   🎯 ${prediction.unitSize}u (${prediction.confidenceTier}) | Score: ${prediction.confidenceScore}`);
        }
      });
      
      return betId;
    } catch (error) {
      console.error('❌ Error saving basketball bet:', error);
      throw error;
    }
  }
  
  /**
   * Batch save multiple bets (called from UI after predictions load)
   * Saves all quality picks in parallel
   */
  async saveBets(games) {
    console.log(`\n💾 Saving ${games.length} bets to Firebase...`);
    
    const results = await Promise.allSettled(
      games.map(game => this.saveBet(game, game.prediction))
    );
    
    const saved = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Saved: ${saved} | ❌ Failed: ${failed}`);
    
    return { saved, failed };
  }
}

// Singleton instance for easy imports
export const basketballBetTracker = new BasketballBetTracker();
