/**
 * Basketball Bet Tracker
 * Handles saving basketball bets to Firebase (basketball_bets collection)
 * 
 * OPTIMIZED: Only writes NEW bets that don't exist yet
 * Uses existing betsMap to avoid redundant Firebase calls
 */

import { db } from './config';
import { doc, setDoc } from 'firebase/firestore';

export class BasketballBetTracker {
  
  /**
   * Generate deterministic bet ID for basketball
   * Format: 2025-11-24_TOLEDO_TROY_MONEYLINE_TROY_(HOME)
   */
  generateBetId(date, awayTeam, homeTeam, market, prediction) {
    const pickTeam = prediction.bestTeam;
    const side = pickTeam === awayTeam ? 'AWAY' : 'HOME';
    
    const awayNorm = awayTeam.replace(/\s+/g, '_').toUpperCase();
    const homeNorm = homeTeam.replace(/\s+/g, '_').toUpperCase();
    const teamNorm = pickTeam.replace(/\s+/g, '_').toUpperCase();
    
    return `${date}_${awayNorm}_${homeNorm}_${market}_${teamNorm}_(${side})`;
  }
  
  /**
   * Generate the normalized key used in betsMap
   */
  generateBetKey(awayTeam, homeTeam) {
    const normalizeTeam = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${normalizeTeam(awayTeam)}_${normalizeTeam(homeTeam)}`;
  }
  
  /**
   * Calculate conviction score for the picked team
   * Sum of margins from both models favoring the pick
   */
  calculateConvictionScore(game, prediction) {
    const dr = game.dratings;
    const hs = game.haslametrics;
    if (!dr?.awayScore || !dr?.homeScore || !hs?.awayScore || !hs?.homeScore) return null;
    
    const pickIsAway = prediction.bestBet === 'away';
    
    // Margin from picked team's perspective
    const drMargin = pickIsAway ? (dr.awayScore - dr.homeScore) : (dr.homeScore - dr.awayScore);
    const hsMargin = pickIsAway ? (hs.awayScore - hs.homeScore) : (hs.homeScore - hs.awayScore);
    
    const modelsAgree = drMargin > 0 && hsMargin > 0;
    const convictionScore = Math.round((drMargin + hsMargin) * 10) / 10;
    
    return { convictionScore, modelsAgree, drMargin: Math.round(drMargin * 10) / 10, hsMargin: Math.round(hsMargin * 10) / 10 };
  }
  
  /**
   * Save a single NEW bet to Firebase
   * Only called for bets that don't exist yet
   */
  async saveBet(game, prediction) {
    const date = new Date().toISOString().split('T')[0];
    const betId = this.generateBetId(date, game.awayTeam, game.homeTeam, 'MONEYLINE', prediction);
    
    const betRef = doc(db, 'basketball_bets', betId);
    
    // Calculate conviction metrics
    const conviction = this.calculateConvictionScore(game, prediction);
    
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
        
        // Dynamic confidence-based unit sizing
        unitSize: prediction.unitSize,
        confidenceTier: prediction.confidenceTier,
        confidenceScore: prediction.confidenceScore,
        confidenceFactors: prediction.confidenceFactors || null,
        
        // Pattern ROI from dynamic analysis
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
        
        // Model breakdown
        dratingsAwayProb: prediction.dratingsAwayProb || null,
        dratingsHomeProb: prediction.dratingsHomeProb || null,
        dratingsAwayScore: prediction.dratingsAwayScore || null,
        dratingsHomeScore: prediction.dratingsHomeScore || null,
        
        haslametricsAwayProb: prediction.haslametricsAwayProb || null,
        haslametricsHomeProb: prediction.haslametricsHomeProb || null,
        haslametricsAwayScore: prediction.haslametricsAwayScore || null,
        haslametricsHomeScore: prediction.haslametricsHomeScore || null,
        
        // Conviction Score (model agreement metric)
        convictionScore: conviction?.convictionScore || null,
        modelsAgree: conviction?.modelsAgree || null,
        dratingMargin: conviction?.drMargin || null,
        haslametricsMargin: conviction?.hsMargin || null
      },
      
      result: {
        awayScore: null,
        homeScore: null,
        totalScore: null,
        winner: null,
        outcome: null,
        profit: null,
        fetched: false,
        fetchedAt: null,
        source: null
      },
      
      status: 'PENDING',
      firstRecommendedAt: Date.now(),
      initialOdds: prediction.bestOdds,
      initialEV: prediction.bestEV,
      
      // ⭐ Savant Pick - set to true in Firebase to mark as analyst-enhanced
      savantPick: false,
      
      // 🏀 Barttorvik data for Matchup Intelligence (persists even if game drops off)
      barttorvik: game.barttorvik || null
    };
    
    try {
      await setDoc(betRef, betData);
      console.log(`✅ NEW bet saved: ${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`   ${prediction.bestOdds} | +${prediction.bestEV.toFixed(1)}% EV | Grade: ${prediction.grade} | ${prediction.unitSize}u`);
      return betId;
    } catch (error) {
      console.error('❌ Error saving bet:', error);
      throw error;
    }
  }
  
  /**
   * SMART SAVE: Only writes NEW bets that don't exist in betsMap
   * 
   * @param {Array} games - Games with predictions
   * @param {Map} existingBetsMap - Already loaded from Firebase (avoids extra reads!)
   * @returns {Object} { saved, skipped }
   */
  async saveNewBetsOnly(games, existingBetsMap) {
    // Filter to only NEW games (not in betsMap)
    const newGames = games.filter(game => {
      const key = this.generateBetKey(game.awayTeam, game.homeTeam);
      return !existingBetsMap.has(key);
    });
    
    if (newGames.length === 0) {
      console.log('📋 All bets already exist in Firebase - no writes needed');
      return { saved: 0, skipped: games.length };
    }
    
    console.log(`\n💾 Saving ${newGames.length} NEW bets (${games.length - newGames.length} already exist)...`);
    
    const results = await Promise.allSettled(
      newGames.map(game => this.saveBet(game, game.prediction))
    );
    
    const saved = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    if (failed > 0) {
      console.log(`⚠️ ${failed} bets failed to save`);
    }
    
    return { saved, skipped: games.length - newGames.length, failed };
  }
}

// Singleton instance
export const basketballBetTracker = new BasketballBetTracker();
