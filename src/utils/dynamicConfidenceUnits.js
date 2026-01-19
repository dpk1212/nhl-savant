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
 * 📊 CALIBRATION MULTIPLIER
 * Converts calibration error to a multiplier
 * 
 * calibError = actualWinRate - avgModelProb
 *   Positive = model underconfident (betting more is OK)
 *   Negative = model overconfident (REDUCE betting)
 * 
 * UPDATED: More aggressive on overconfident patterns
 */
function getCalibrationMultiplier(calibError, sampleSize, minSample = 25) {
  if (sampleSize < minSample) return 1.0; // Not enough data
  
  // More aggressive scaling for overconfident patterns
  // +10% calibError → 1.3 multiplier (model underconfident, bet more)
  // -5% calibError → 0.8 multiplier  
  // -10% calibError → 0.5 multiplier (model overconfident, bet less)
  // -15% calibError → 0.25 multiplier (severely overconfident)
  let multiplier;
  if (calibError >= 0) {
    // Underconfident: gentle boost (1.0 to 1.5)
    multiplier = 1 + (calibError * 3);
  } else {
    // Overconfident: AGGRESSIVE reduction (exponential)
    // -5% → 0.75, -10% → 0.5, -15% → 0.25
    multiplier = Math.pow(0.5, Math.abs(calibError) / 0.10);
  }
  
  // Clamp to reasonable range
  return Math.max(0.15, Math.min(1.5, multiplier));
}

/**
 * 📈 ROI MULTIPLIER
 * Converts ROI to a multiplier
 * 
 * UPDATED: MUCH more aggressive on negative ROI patterns
 * Based on Dec 14+ data:
 *   SLIGHT_FAV: +11.1% ROI → boost
 *   PICKEM: -11.8% ROI → crush
 *   HEAVY_FAV: -4.2% ROI → reduce
 */
function getROIMultiplier(roi, sampleSize, minSample = 25) {
  if (sampleSize < minSample) return 1.0; // Not enough data
  
  let multiplier;
  if (roi >= 0) {
    // Profitable patterns: boost proportionally
    // +5% ROI → 1.25 multiplier
    // +10% ROI → 1.5 multiplier
    // +15% ROI → 1.75 multiplier (capped at 2.0)
    multiplier = 1 + (roi / 20);
  } else {
    // LOSING patterns: EXPONENTIAL penalty
    // -3% ROI → 0.7 multiplier
    // -6% ROI → 0.5 multiplier
    // -10% ROI → 0.3 multiplier
    // -15% ROI → 0.15 multiplier
    multiplier = Math.pow(0.5, Math.abs(roi) / 6);
  }
  
  return Math.max(0.1, Math.min(2.0, multiplier));
}

/**
 * Calculate dynamic unit size based on live weights + CALIBRATION
 * 
 * NEW SYSTEM: No hard caps. Uses continuous multipliers based on:
 * 1. ROI (is the pattern profitable?)
 * 2. Calibration (is the model accurate for this pattern?)
 * 
 * @param {Object} bet - The bet object with prediction, game, bet properties
 * @param {Object} confidenceData - From loadConfidenceWeights()
 * @returns {Object} { units, score, tier, factors, classification }
 */
export function calculateDynamicUnits(bet, confidenceData) {
  const { weights, config, performance } = confidenceData || { weights: DEFAULT_WEIGHTS, config: DEFAULT_CONFIG, performance: {} };
  const classification = classifyBet(bet);
  const factors = [];
  
  const MIN_SAMPLE_SIZE = 25;
  
  // ═══════════════════════════════════════════════════════════════
  // STEP 1: GATHER PERFORMANCE DATA FOR ALL FACTORS
  // ═══════════════════════════════════════════════════════════════
  const gradePerf = performance?.grade?.[classification.grade] || {};
  const oddsPerf = performance?.odds?.[classification.oddsRange] || {};
  const probPerf = performance?.probability?.[classification.probRange] || {};
  const evPerf = performance?.ev?.[classification.evRange] || {};
  const sidePerf = performance?.side?.[classification.side] || {};
  
  // ═══════════════════════════════════════════════════════════════
  // STEP 2: CALCULATE COMBINED MULTIPLIER FROM ALL PATTERNS
  // This replaces hard caps with continuous scaling
  // ═══════════════════════════════════════════════════════════════
  const multiplierFactors = [];
  let combinedMultiplier = 1.0;
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR WEIGHTS (updated based on Dec 14+ ROI variance analysis)
  // ODDS has biggest ROI spread (+11% to -12%), so it gets most weight
  // ═══════════════════════════════════════════════════════════════
  const FACTOR_WEIGHTS = {
    odds: 0.50,    // 50% - Biggest ROI variance (22.9% spread)
    grade: 0.25,   // 25% - Quality grade
    prob: 0.15,    // 15% - Model probability range
    ev: 0.10      // 10% - Expected value range
  };

  // Grade calibration + ROI
  const gradeCalibMult = getCalibrationMultiplier(gradePerf.calibError || 0, gradePerf.total || 0, MIN_SAMPLE_SIZE);
  const gradeROIMult = getROIMultiplier(gradePerf.roi || 0, gradePerf.total || 0, MIN_SAMPLE_SIZE);
  const gradeMultiplier = (gradeCalibMult + gradeROIMult) / 2;
  if (gradePerf.total >= MIN_SAMPLE_SIZE) {
    multiplierFactors.push({
      factor: 'Grade',
      value: classification.grade,
      calibError: gradePerf.calibError,
      roi: gradePerf.roi,
      multiplier: gradeMultiplier
    });
    combinedMultiplier *= Math.pow(gradeMultiplier, FACTOR_WEIGHTS.grade);
  }
  
  // Odds calibration + ROI - MOST IMPORTANT FACTOR
  const oddsCalibMult = getCalibrationMultiplier(oddsPerf.calibError || 0, oddsPerf.total || 0, MIN_SAMPLE_SIZE);
  const oddsROIMult = getROIMultiplier(oddsPerf.roi || 0, oddsPerf.total || 0, MIN_SAMPLE_SIZE);
  const oddsMultiplier = (oddsCalibMult + oddsROIMult) / 2;
  if (oddsPerf.total >= MIN_SAMPLE_SIZE) {
    multiplierFactors.push({
      factor: 'Odds',
      value: classification.oddsRange,
      calibError: oddsPerf.calibError,
      roi: oddsPerf.roi,
      multiplier: oddsMultiplier
    });
    combinedMultiplier *= Math.pow(oddsMultiplier, FACTOR_WEIGHTS.odds);
  }
  
  // Probability calibration + ROI
  const probCalibMult = getCalibrationMultiplier(probPerf.calibError || 0, probPerf.total || 0, MIN_SAMPLE_SIZE);
  const probROIMult = getROIMultiplier(probPerf.roi || 0, probPerf.total || 0, MIN_SAMPLE_SIZE);
  const probMultiplier = (probCalibMult + probROIMult) / 2;
  if (probPerf.total >= MIN_SAMPLE_SIZE) {
    multiplierFactors.push({
      factor: 'Prob',
      value: classification.probRange,
      calibError: probPerf.calibError,
      roi: probPerf.roi,
      multiplier: probMultiplier
    });
    combinedMultiplier *= Math.pow(probMultiplier, FACTOR_WEIGHTS.prob);
  }
  
  // EV calibration + ROI (important for catching overconfident high EV bets)
  const evCalibMult = getCalibrationMultiplier(evPerf.calibError || 0, evPerf.total || 0, MIN_SAMPLE_SIZE);
  const evROIMult = getROIMultiplier(evPerf.roi || 0, evPerf.total || 0, MIN_SAMPLE_SIZE);
  const evMultiplier = (evCalibMult + evROIMult) / 2;
  if (evPerf.total >= MIN_SAMPLE_SIZE) {
    multiplierFactors.push({
      factor: 'EV',
      value: classification.evRange,
      calibError: evPerf.calibError,
      roi: evPerf.roi,
      multiplier: evMultiplier
    });
    combinedMultiplier *= Math.pow(evMultiplier, FACTOR_WEIGHTS.ev);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // STEP 3: BUILD BASE SCORE FROM WEIGHTS
  // (Legacy additive system, but multiplier modifies the final units)
  // ═══════════════════════════════════════════════════════════════
  let score = 0;
  
  // FACTOR 1: GRADE
  const gradeWeight = weights.grade?.[classification.grade] || 1.0;
  const gradeContribution = Math.min(gradeWeight, config.maxWeightContribution?.grade || 2.0);
  const gradeEmoji = gradeMultiplier >= 1.0 ? '✅' : gradeMultiplier >= 0.7 ? '🟡' : '📉';
  if (gradePerf.total >= MIN_SAMPLE_SIZE) {
    factors.push(`${gradeEmoji} Grade ${classification.grade}: +${gradeContribution.toFixed(2)} (${(gradePerf.calibError * 100).toFixed(0)}% calib, ${gradePerf.roi.toFixed(0)}% ROI → ${gradeMultiplier.toFixed(2)}x)`);
  } else {
    factors.push(`🔵 Grade ${classification.grade}: +${gradeContribution.toFixed(2)} (wt: ${gradeWeight.toFixed(2)})`);
  }
  score += gradeContribution;
  
  // FACTOR 2: ODDS
  const oddsWeight = weights.odds?.[classification.oddsRange] || 1.0;
  const oddsContribution = Math.min(oddsWeight, config.maxWeightContribution?.odds || 2.0);
  const oddsEmoji = oddsMultiplier >= 1.0 ? '✅' : oddsMultiplier >= 0.7 ? '🟡' : '📉';
  if (oddsPerf.total >= MIN_SAMPLE_SIZE) {
    factors.push(`${oddsEmoji} Odds ${classification.oddsRange}: +${oddsContribution.toFixed(2)} (${(oddsPerf.calibError * 100).toFixed(0)}% calib, ${oddsPerf.roi.toFixed(0)}% ROI → ${oddsMultiplier.toFixed(2)}x)`);
  } else {
    factors.push(`🔵 Odds ${classification.oddsRange}: +${oddsContribution.toFixed(2)} (wt: ${oddsWeight.toFixed(2)})`);
  }
  score += oddsContribution;
  
  // FACTOR 3: PROBABILITY
  const probWeight = weights.probability?.[classification.probRange] || 1.0;
  const probContribution = Math.min(probWeight, config.maxWeightContribution?.probability || 1.5);
  const probEmoji = probMultiplier >= 1.0 ? '✅' : probMultiplier >= 0.7 ? '🟡' : '📉';
  if (probPerf.total >= MIN_SAMPLE_SIZE) {
    factors.push(`${probEmoji} Prob ${classification.probRange}: +${probContribution.toFixed(2)} (${(probPerf.calibError * 100).toFixed(0)}% calib, ${probPerf.roi.toFixed(0)}% ROI → ${probMultiplier.toFixed(2)}x)`);
  } else {
    factors.push(`🔵 Prob ${classification.probRange}: +${probContribution.toFixed(2)} (wt: ${probWeight.toFixed(2)})`);
  }
  score += probContribution;
  
  // FACTOR 4: EV
  const evWeight = weights.ev?.[classification.evRange] || 1.0;
  const evContribution = Math.min(evWeight, config.maxWeightContribution?.ev || 1.0);
  const evEmoji = evMultiplier >= 1.0 ? '✅' : evMultiplier >= 0.7 ? '🟡' : '📉';
  if (evPerf.total >= MIN_SAMPLE_SIZE) {
    factors.push(`${evEmoji} EV ${classification.evRange}: +${evContribution.toFixed(2)} (${(evPerf.calibError * 100).toFixed(0)}% calib, ${evPerf.roi.toFixed(0)}% ROI → ${evMultiplier.toFixed(2)}x)`);
  } else {
    factors.push(`🔵 EV ${classification.evRange}: +${evContribution.toFixed(2)} (wt: ${evWeight.toFixed(2)})`);
  }
  score += evContribution;
  
  // ═══════════════════════════════════════════════════════════════
  // FACTOR 5: SIDE (smaller contribution)
  // ═══════════════════════════════════════════════════════════════
  const sideWeight = weights.side?.[classification.side] || 1.0;
  const sideContribution = Math.min(sideWeight * 0.5, config.maxWeightContribution?.side || 0.5);
  factors.push(`🔵 ${classification.side}: +${sideContribution.toFixed(2)}`);
  score += sideContribution;
  
  // ═══════════════════════════════════════════════════════════════
  // STEP 4: CALCULATE BASE UNITS FROM SCORE
  // ═══════════════════════════════════════════════════════════════
  const thresholds = config.unitThresholds || DEFAULT_CONFIG.unitThresholds;
  
  let baseUnits;
  if (score >= thresholds.elite) baseUnits = 5;
  else if (score >= thresholds.high) baseUnits = 4;
  else if (score >= thresholds.good) baseUnits = 3;
  else if (score >= thresholds.moderate) baseUnits = 2;
  else baseUnits = 1;
  
  // ═══════════════════════════════════════════════════════════════
  // STEP 5: APPLY CALIBRATION MULTIPLIER TO BASE UNITS
  // This is the KEY change - continuous scaling instead of hard caps
  // ═══════════════════════════════════════════════════════════════
  const adjustedUnits = baseUnits * combinedMultiplier;
  
  // Round to 0.5 increments (0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
  const finalUnits = Math.max(0.5, Math.min(5, Math.round(adjustedUnits * 2) / 2));
  
  // Add multiplier summary to factors
  factors.push(`📊 Combined multiplier: ${combinedMultiplier.toFixed(2)}x → ${baseUnits}u → ${finalUnits}u`);
  
  // ═══════════════════════════════════════════════════════════════
  // STEP 6: DETERMINE TIER FROM FINAL UNITS
  // ═══════════════════════════════════════════════════════════════
  let tier, tierLabel;
  
  if (finalUnits >= 4.5) {
    tier = 'ELITE';
    tierLabel = `🔥 ELITE (${finalUnits}u)`;
  } else if (finalUnits >= 3.5) {
    tier = 'HIGH';
    tierLabel = `💪 HIGH (${finalUnits}u)`;
  } else if (finalUnits >= 2.5) {
    tier = 'GOOD';
    tierLabel = `✅ GOOD (${finalUnits}u)`;
  } else if (finalUnits >= 1.5) {
    tier = 'MODERATE';
    tierLabel = `🟡 MODERATE (${finalUnits}u)`;
  } else if (finalUnits >= 1) {
    tier = 'LOW';
    tierLabel = `⚠️ LOW (${finalUnits}u)`;
  } else {
    tier = 'MINIMAL';
    tierLabel = `📉 MINIMAL (${finalUnits}u)`;
  }
  
  // Calculate pattern ROI from LIVE performance data (for display)
  const displayGradeROI = getGradeROI(classification.grade, confidenceData);
  const displayOddsROI = getOddsROI(classification.oddsRange, confidenceData);
  const patternROI = (displayGradeROI * 0.6) + (displayOddsROI * 0.4);
  
  return {
    units: finalUnits,
    score: parseFloat(score.toFixed(2)),
    tier,
    tierLabel,
    factors,
    classification,
    patternROI: parseFloat(patternROI.toFixed(1)),
    // NEW: Include multiplier info for transparency
    multiplierDetails: {
      combined: parseFloat(combinedMultiplier.toFixed(3)),
      factors: multiplierFactors,
      baseUnits,
      adjustedUnits: parseFloat(adjustedUnits.toFixed(2))
    }
  };
}

/**
 * Get historical ROI for a grade from performance data
 * 🆕 Now uses LIVE data instead of hard-coded values
 */
function getGradeROI(grade, confidenceData) {
  // Try to get from live performance data first
  const perf = confidenceData?.performance?.grade?.[grade];
  if (perf?.roi !== undefined) {
    return perf.roi;
  }
  
  // Fallback to static values (will be updated by daily ROI script)
  const gradeROIs = {
    'A': 4.2,
    'A+': -9.1,
    'B': 0.0,
    'B+': 32.9,
    'C': -2.0,
    'D': 1.8,
    'F': -5.3
  };
  return gradeROIs[grade] || 0;
}

/**
 * Get historical ROI for an odds range from performance data
 * 🆕 Now uses LIVE data instead of hard-coded values
 */
function getOddsROI(oddsRange, confidenceData) {
  // Try to get from live performance data first
  const perf = confidenceData?.performance?.odds?.[oddsRange];
  if (perf?.roi !== undefined) {
    return perf.roi;
  }
  
  // Fallback to static values (will be updated by daily ROI script)
  const oddsROIs = {
    'HEAVY_FAV': 0.4,
    'BIG_FAV': -2.5,
    'MOD_FAV': -1.0,
    'SLIGHT_FAV': 8.2,
    'PICKEM': -6.2,
    'SLIGHT_DOG': 1.4,
    'BIG_DOG': -8.9
  };
  return oddsROIs[oddsRange] || 0;
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

/**
 * Get tier info for frontend display - uses stored tier data when available
 * Falls back to calculating from units if tier data not present (backward compat)
 * 
 * This should be used by the frontend instead of getBetTier from abcUnits.js
 * 
 * @param {Object} prediction - The prediction object from Firebase or calculated
 * @returns {Object} Tier info with name, color, emoji, bgGradient, etc.
 */
export function getDynamicTierInfo(prediction) {
  // Get stored tier data if available (from new dynamic system)
  const storedTier = prediction?.confidenceTier;
  const units = prediction?.unitSize || 0;
  const score = prediction?.confidenceScore || 0;
  
  // Tier mapping with all display properties
  const tierConfigs = {
    'ELITE': {
      tier: 1,
      name: 'ELITE',
      shortName: 'Elite',
      emoji: '🔥',
      color: '#10B981',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.12) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.40)',
      description: 'Maximum conviction - multiple green flags aligned'
    },
    'HIGH': {
      tier: 2,
      name: 'HIGH CONFIDENCE',
      shortName: 'High',
      emoji: '💪',
      color: '#14B8A6',
      bgGradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(13, 148, 136, 0.10) 100%)',
      borderColor: 'rgba(20, 184, 166, 0.35)',
      description: 'Strong opportunity with solid backing'
    },
    'GOOD': {
      tier: 3,
      name: 'GOOD',
      shortName: 'Good',
      emoji: '✅',
      color: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.10) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.35)',
      description: 'Positive expectation with measured risk'
    },
    'MODERATE': {
      tier: 4,
      name: 'MODERATE',
      shortName: 'Moderate',
      emoji: '🟡',
      color: '#8B5CF6',
      bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.10) 100%)',
      borderColor: 'rgba(139, 92, 246, 0.35)',
      description: 'Conservative sizing for mixed signals'
    },
    'LOW': {
      tier: 5,
      name: 'LOW CONFIDENCE',
      shortName: 'Low',
      emoji: '⚠️',
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.08) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.30)',
      description: 'Minimal allocation - tracking position'
    },
    'F-CAP': {
      tier: 6,
      name: 'CAPPED',
      shortName: 'Capped',
      emoji: '⚡',
      color: '#94A3B8',
      bgGradient: 'linear-gradient(135deg, rgba(148, 163, 184, 0.10) 0%, rgba(100, 116, 139, 0.06) 100%)',
      borderColor: 'rgba(148, 163, 184, 0.25)',
      description: 'F grade - reduced allocation'
    },
    // 🩸 BLEEDING patterns - loss patterns detected, soft cap applied
    'BLEEDING': {
      tier: 7,
      name: 'REDUCED',
      shortName: 'Reduced',
      emoji: '📉',
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.20)',
      description: 'Pattern underperforming - reduced allocation'
    },
    // ⚠️ CAUTION patterns - multiple warning signs
    'CAUTION': {
      tier: 6,
      name: 'CAUTION',
      shortName: 'Caution',
      emoji: '⚠️',
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.10) 0%, rgba(217, 119, 6, 0.06) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      description: 'Multiple loss patterns - conservative allocation'
    },
    // 📉 MINIMAL - calibration-reduced allocation (< 1u)
    'MINIMAL': {
      tier: 8,
      name: 'MINIMAL',
      shortName: 'Min',
      emoji: '📉',
      color: '#94A3B8',
      bgGradient: 'linear-gradient(135deg, rgba(148, 163, 184, 0.08) 0%, rgba(100, 116, 139, 0.04) 100%)',
      borderColor: 'rgba(148, 163, 184, 0.20)',
      description: 'Calibration-adjusted minimal allocation'
    }
  };
  
  // If stored tier exists, use it
  if (storedTier && tierConfigs[storedTier]) {
    const config = tierConfigs[storedTier];
    return {
      ...config,
      unitRange: `${units}u`,
      confidenceScore: score
    };
  }
  
  // Fallback: derive tier from unit size (backward compatibility)
  let derivedTier;
  if (units >= 4.5) derivedTier = 'ELITE';
  else if (units >= 3.5) derivedTier = 'HIGH';
  else if (units >= 2.5) derivedTier = 'GOOD';
  else if (units >= 1.5) derivedTier = 'MODERATE';
  else if (units >= 1) derivedTier = 'LOW';
  else derivedTier = 'MINIMAL';
  
  const config = tierConfigs[derivedTier];
  return {
    ...config,
    unitRange: `${units}u`,
    confidenceScore: score
  };
}

/**
 * Get confidence rating for frontend - compatible with old getConfidenceRating API
 * Uses stored tier when available
 */
export function getDynamicConfidenceRating(prediction) {
  const tierInfo = getDynamicTierInfo(prediction);
  
  return {
    level: tierInfo.name,
    color: tierInfo.color,
    label: tierInfo.shortName
  };
}

