/**
 * 🎯 DYNAMIC CONFIDENCE-BASED UNIT SIZING
 * 
 * Calculates unit size using LIVE weights from JSON file
 * Weights update daily based on actual ROI performance
 * 
 * Usage:
 *   import { calculateDynamicUnits, loadConfidenceWeights } from './dynamicConfidenceUnits';
 *   
 *   // Load weights once at startup
 *   const weights = await loadConfidenceWeights();
 *   
 *   // Calculate units for each bet
 *   const { units, score, tier, factors } = calculateDynamicUnits(bet, weights);
 */

// Default weights (used before first ROI update or if Firebase fails)
const DEFAULT_WEIGHTS = {
  grade: {
    'A+': 0.8,
    'A': 1.6,
    'B+': 1.8,
    'B': 0.9,
    'C': 1.0,
    'D': 0.8,
    'F': 0.5
  },
  odds: {
    'HEAVY_FAV': 0.5,
    'BIG_FAV': 1.0,
    'MOD_FAV': 1.5,
    'SLIGHT_FAV': 1.6,
    'PICKEM': 0.8,
    'SLIGHT_DOG': 0.7,
    'BIG_DOG': 0.4
  },
  probability: {
    'HIGH_PROB': 1.5,
    'GOOD_PROB': 1.2,
    'MOD_PROB': 1.0,
    'LOW_PROB': 0.7
  },
  ev: {
    'VERY_HIGH_EV': 0.5,
    'HIGH_EV': 0.8,
    'GOOD_EV': 1.4,
    'MOD_EV': 1.2,
    'LOW_EV': 1.0,
    'NEG_EV': 0.9
  },
  side: {
    'AWAY': 1.2,
    'HOME': 0.9
  }
};

const DEFAULT_CONFIG = {
  fGradeCap: 0.5,
  minSampleSize: 30,
  unitThresholds: {
    elite: 5.5,
    high: 4.5,
    good: 3.5,
    moderate: 2.5,
    low: 0
  },
  maxWeightContribution: {
    grade: 2.0,
    odds: 2.0,
    probability: 1.5,
    ev: 1.0,
    side: 0.5
  }
};

/**
 * Load confidence weights from JSON file
 * Call this once at startup or before batch processing
 * 
 * For Node.js scripts, pass the file path
 * For browser/frontend, it will fetch from public folder
 */
export async function loadConfidenceWeights(filePathOrDb) {
  try {
    // Node.js environment - load from file path
    if (typeof window === 'undefined') {
      // Dynamic import for Node.js
      const fs = await import('fs/promises');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      // Default path if not provided
      let filePath = filePathOrDb;
      if (!filePath || typeof filePath !== 'string') {
        // Find the public folder relative to this module
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        filePath = path.join(__dirname, '../../public/basketball_confidence_weights.json');
      }
      
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      console.log(`✅ Loaded dynamic weights from JSON (${data.totalBets} bets analyzed)`);
      return {
        weights: data.weights || DEFAULT_WEIGHTS,
        config: data.config || DEFAULT_CONFIG,
        performance: data.performance || {},
        totalBets: data.totalBets || 0,
        lastUpdated: data.lastUpdated
      };
    }
    
    // Browser environment - fetch from public folder
    const response = await fetch('/basketball_confidence_weights.json');
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Loaded dynamic weights (${data.totalBets} bets analyzed)`);
      return {
        weights: data.weights || DEFAULT_WEIGHTS,
        config: data.config || DEFAULT_CONFIG,
        performance: data.performance || {},
        totalBets: data.totalBets || 0,
        lastUpdated: data.lastUpdated
      };
    }
  } catch (error) {
    console.warn('⚠️ Could not load dynamic weights, using defaults:', error.message);
  }
  
  return {
    weights: DEFAULT_WEIGHTS,
    config: DEFAULT_CONFIG,
    performance: {},
    totalBets: 0,
    lastUpdated: null
  };
}

/**
 * Classify bet into factor categories
 */
function classifyBet(bet) {
  const grade = bet.prediction?.grade || 'C';
  const odds = bet.bet?.odds || bet.odds || -110;
  const pickTeam = bet.bet?.team || bet.bet?.pick || bet.team;
  const isAway = pickTeam === (bet.game?.awayTeam || bet.awayTeam);
  
  const ensembleProb = isAway 
    ? (bet.prediction?.ensembleAwayProb || bet.ensembleAwayProb || 0.5)
    : (bet.prediction?.ensembleHomeProb || bet.ensembleHomeProb || 0.5);
  
  const ev = bet.prediction?.evPercent || bet.prediction?.bestEV || bet.evPercent || 0;

  // Classify odds range
  let oddsRange;
  if (odds <= -300) oddsRange = 'HEAVY_FAV';
  else if (odds > -300 && odds <= -200) oddsRange = 'BIG_FAV';
  else if (odds > -200 && odds <= -150) oddsRange = 'MOD_FAV';
  else if (odds > -150 && odds < -110) oddsRange = 'SLIGHT_FAV';
  else if (odds >= -110 && odds <= 110) oddsRange = 'PICKEM';
  else if (odds > 110 && odds < 200) oddsRange = 'SLIGHT_DOG';
  else oddsRange = 'BIG_DOG';

  // Classify model probability
  let probRange;
  if (ensembleProb >= 0.70) probRange = 'HIGH_PROB';
  else if (ensembleProb >= 0.60) probRange = 'GOOD_PROB';
  else if (ensembleProb >= 0.55) probRange = 'MOD_PROB';
  else probRange = 'LOW_PROB';

  // Classify EV
  let evRange;
  if (ev >= 20) evRange = 'VERY_HIGH_EV';
  else if (ev >= 15) evRange = 'HIGH_EV';
  else if (ev >= 10) evRange = 'GOOD_EV';
  else if (ev >= 5) evRange = 'MOD_EV';
  else if (ev >= 0) evRange = 'LOW_EV';
  else evRange = 'NEG_EV';

  return {
    grade,
    oddsRange,
    probRange,
    evRange,
    side: isAway ? 'AWAY' : 'HOME',
    rawValues: { odds, ensembleProb, ev, isAway }
  };
}

/**
 * Calculate dynamic unit size based on live weights
 * 
 * @param {Object} bet - The bet object with prediction, game, bet properties
 * @param {Object} confidenceData - From loadConfidenceWeights()
 * @returns {Object} { units, score, tier, factors, classification }
 */
export function calculateDynamicUnits(bet, confidenceData) {
  const { weights, config } = confidenceData || { weights: DEFAULT_WEIGHTS, config: DEFAULT_CONFIG };
  const classification = classifyBet(bet);
  const factors = [];
  
  let score = 0;
  
  // ═══════════════════════════════════════════════════════════════
  // F GRADE HARD CAP - Check first
  // ═══════════════════════════════════════════════════════════════
  if (classification.grade === 'F') {
    return {
      units: config.fGradeCap || 0.5,
      score: 0,
      tier: 'F-CAP',
      tierLabel: '🔴 F-CAP (0.5u)',
      factors: ['🔴 Grade F → HARD CAP at 0.5u'],
      classification
    };
  }
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 1: GRADE (max 2.0 contribution)
  // ═══════════════════════════════════════════════════════════════
  const gradeWeight = weights.grade?.[classification.grade] || 1.0;
  const gradeContribution = Math.min(gradeWeight, config.maxWeightContribution?.grade || 2.0);
  score += gradeContribution;
  
  const gradeEmoji = gradeWeight >= 1.5 ? '✅' : gradeWeight >= 1.0 ? '🟡' : '⚠️';
  factors.push(`${gradeEmoji} Grade ${classification.grade}: +${gradeContribution.toFixed(2)} (weight: ${gradeWeight.toFixed(2)})`);
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 2: ODDS (max 2.0 contribution)
  // ═══════════════════════════════════════════════════════════════
  const oddsWeight = weights.odds?.[classification.oddsRange] || 1.0;
  const oddsContribution = Math.min(oddsWeight, config.maxWeightContribution?.odds || 2.0);
  score += oddsContribution;
  
  const oddsEmoji = oddsWeight >= 1.5 ? '✅' : oddsWeight >= 1.0 ? '🟡' : '⚠️';
  factors.push(`${oddsEmoji} Odds ${classification.oddsRange}: +${oddsContribution.toFixed(2)} (weight: ${oddsWeight.toFixed(2)})`);
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 3: MODEL PROBABILITY (max 1.5 contribution)
  // ═══════════════════════════════════════════════════════════════
  const probWeight = weights.probability?.[classification.probRange] || 1.0;
  const probContribution = Math.min(probWeight, config.maxWeightContribution?.probability || 1.5);
  score += probContribution;
  
  const probEmoji = probWeight >= 1.3 ? '✅' : probWeight >= 1.0 ? '🟡' : '⚠️';
  factors.push(`${probEmoji} Model Prob ${classification.probRange}: +${probContribution.toFixed(2)} (weight: ${probWeight.toFixed(2)})`);
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 4: EV (max 1.0 contribution)
  // ═══════════════════════════════════════════════════════════════
  const evWeight = weights.ev?.[classification.evRange] || 1.0;
  const evContribution = Math.min(evWeight, config.maxWeightContribution?.ev || 1.0);
  score += evContribution;
  
  const evEmoji = evWeight >= 1.2 ? '✅' : evWeight >= 0.9 ? '🟡' : '⚠️';
  factors.push(`${evEmoji} EV ${classification.evRange}: +${evContribution.toFixed(2)} (weight: ${evWeight.toFixed(2)})`);
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 5: SIDE (max 0.5 contribution)
  // ═══════════════════════════════════════════════════════════════
  const sideWeight = weights.side?.[classification.side] || 1.0;
  const sideContribution = Math.min(sideWeight * 0.5, config.maxWeightContribution?.side || 0.5);
  score += sideContribution;
  
  const sideEmoji = sideWeight >= 1.1 ? '✅' : '🟡';
  factors.push(`${sideEmoji} ${classification.side}: +${sideContribution.toFixed(2)} (weight: ${sideWeight.toFixed(2)})`);
  
  // ═══════════════════════════════════════════════════════════════
  // CALCULATE FINAL UNITS FROM SCORE
  // ═══════════════════════════════════════════════════════════════
  const thresholds = config.unitThresholds || DEFAULT_CONFIG.unitThresholds;
  
  let units, tier, tierLabel;
  
  if (score >= thresholds.elite) {
    units = 5;
    tier = 'ELITE';
    tierLabel = '🔥 ELITE (5u)';
  } else if (score >= thresholds.high) {
    units = 4;
    tier = 'HIGH';
    tierLabel = '💪 HIGH (4u)';
  } else if (score >= thresholds.good) {
    units = 3;
    tier = 'GOOD';
    tierLabel = '✅ GOOD (3u)';
  } else if (score >= thresholds.moderate) {
    units = 2;
    tier = 'MODERATE';
    tierLabel = '🟡 MODERATE (2u)';
  } else {
    units = 1;
    tier = 'LOW';
    tierLabel = '⚠️ LOW (1u)';
  }
  
  return {
    units,
    score: parseFloat(score.toFixed(2)),
    tier,
    tierLabel,
    factors,
    classification
  };
}

/**
 * Get a summary of what the confidence system recommends
 */
export function getConfidenceSummary(bet, confidenceData) {
  const result = calculateDynamicUnits(bet, confidenceData);
  
  return {
    recommendedUnits: result.units,
    confidenceScore: result.score,
    tier: result.tier,
    tierLabel: result.tierLabel,
    reasoning: result.factors,
    
    // For display
    display: {
      units: result.tier === 'F-CAP' ? '0.5u' : `${result.units}u`,
      color: getTierColor(result.tier),
      label: result.tier
    }
  };
}

/**
 * Get color for tier
 */
function getTierColor(tier) {
  const colors = {
    'ELITE': '#10B981',
    'HIGH': '#14B8A6',
    'GOOD': '#3B82F6',
    'MODERATE': '#8B5CF6',
    'LOW': '#F59E0B',
    'F-CAP': '#EF4444'
  };
  return colors[tier] || '#6B7280';
}

/**
 * Export utility for getting confidence data for display
 */
export function getConfidenceDisplay(units, tier) {
  return {
    units: tier === 'F-CAP' ? '0.5u' : `${units}u`,
    color: getTierColor(tier),
    label: tier,
    emoji: {
      'ELITE': '🔥',
      'HIGH': '💪',
      'GOOD': '✅',
      'MODERATE': '🟡',
      'LOW': '⚠️',
      'F-CAP': '🔴'
    }[tier] || '⚪'
  };
}

