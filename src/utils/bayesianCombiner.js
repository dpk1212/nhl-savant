/**
 * BayesianCombiner - Combines multiple betting signals probabilistically
 * 
 * Uses Bayesian updating to combine weak signals into strong conviction.
 * Starts with market prior (50/50) and updates with each signal.
 */
export class BayesianCombiner {
  
  /**
   * Combine multiple signals to produce final OVER/UNDER probability
   * 
   * @param {number} vegasLine - The Vegas totals line
   * @param {Array} signals - Array of signal objects with probability, weight, confidence
   * @returns {Object} Analysis with overProbability, underProbability, breakdown
   */
  combineSignals(vegasLine, signals) {
    // Start with market prior (50/50 - Vegas is efficient)
    let overProbability = 0.50;
    
    // Track individual signal contributions
    const breakdown = [];
    
    // Update with each signal using Bayesian formula
    for (const signal of signals) {
      const priorProb = overProbability;
      
      overProbability = this.bayesianUpdate(
        overProbability,
        signal.probability,
        signal.weight,
        signal.confidence
      );
      
      breakdown.push({
        signal: signal.name,
        prior: priorProb,
        signalProb: signal.probability,
        posterior: overProbability,
        weight: signal.weight,
        confidence: signal.confidence,
        impact: overProbability - priorProb,
        detail: signal.detail
      });
    }
    
    return {
      overProbability,
      underProbability: 1 - overProbability,
      vegasLine,
      signals: breakdown,
      finalEdge: Math.abs(overProbability - 0.50),
      direction: overProbability > 0.50 ? 'OVER' : 'UNDER'
    };
  }
  
  /**
   * Bayesian update formula
   * 
   * Weighted average between prior and signal, adjusted by confidence.
   * Higher confidence = signal has more impact on posterior.
   * 
   * @param {number} prior - Current probability estimate
   * @param {number} signalProb - Signal's probability estimate
   * @param {number} weight - Signal's base weight (importance)
   * @param {number} confidence - Signal's confidence (reliability)
   * @returns {number} Updated probability
   */
  bayesianUpdate(prior, signalProb, weight, confidence) {
    // Adjust weight by confidence
    // Low confidence → signal has less impact
    // High confidence → signal has more impact
    const adjustedWeight = weight * confidence;
    
    // Weighted average
    // newProb = (prior * remainingWeight) + (signal * adjustedWeight)
    const newProb = (prior * (1 - adjustedWeight)) + (signalProb * adjustedWeight);
    
    // Clamp to reasonable bounds (30% - 70%)
    // We don't want to be overconfident - Vegas is usually right
    return Math.max(0.30, Math.min(0.70, newProb));
  }
  
  /**
   * Calculate Kelly Criterion stake size
   * 
   * @param {number} winProb - Probability of winning
   * @param {number} decimalOdds - Decimal odds (e.g., 1.91 for -110)
   * @returns {number} Kelly fraction (0.0 - 1.0)
   */
  calculateKelly(winProb, decimalOdds) {
    // Kelly formula: (p * b - q) / b
    // where p = win prob, q = loss prob, b = net odds
    const p = winProb;
    const q = 1 - winProb;
    const b = decimalOdds - 1;
    
    const kelly = (p * b - q) / b;
    
    // Use quarter Kelly for safety, cap at 10%
    const fractionKelly = kelly * 0.25;
    
    return Math.max(0, Math.min(0.10, fractionKelly));
  }
  
  /**
   * Generate human-readable summary of analysis
   */
  generateSummary(analysis) {
    const { overProbability, underProbability, vegasLine, signals, direction } = analysis;
    
    const lines = [];
    lines.push(`\n${'='.repeat(60)}`);
    lines.push(`BAYESIAN TOTALS ANALYSIS - Vegas Line: ${vegasLine}`);
    lines.push(`${'='.repeat(60)}\n`);
    
    lines.push(`Final Probability: ${(overProbability * 100).toFixed(1)}% OVER / ${(underProbability * 100).toFixed(1)}% UNDER`);
    lines.push(`Edge: ${(Math.abs(overProbability - 0.50) * 100).toFixed(1)}% towards ${direction}\n`);
    
    lines.push(`Signal Breakdown:`);
    lines.push(`${'─'.repeat(60)}`);
    
    for (const signal of signals) {
      const arrow = signal.impact > 0 ? '↑ OVER' : signal.impact < 0 ? '↓ UNDER' : '→ NEUTRAL';
      const impactPct = (Math.abs(signal.impact) * 100).toFixed(1);
      
      lines.push(`${signal.signal.padEnd(20)} ${arrow.padEnd(10)} Impact: ${impactPct.padStart(5)}%`);
      lines.push(`  ${signal.detail}`);
      lines.push(`  Signal: ${(signal.signalProb * 100).toFixed(1)}% | Weight: ${(signal.weight * 100).toFixed(0)}% | Confidence: ${(signal.confidence * 100).toFixed(0)}%`);
      lines.push('');
    }
    
    return lines.join('\n');
  }
}

