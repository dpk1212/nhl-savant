/**
 * TotalsDecisionEngine - Makes betting decisions based on Bayesian analysis
 * 
 * Only recommends bets when we have strong edge (>60% confidence or <40% for UNDER).
 * Uses Kelly Criterion for optimal stake sizing.
 */
export class TotalsDecisionEngine {
  
  constructor(options = {}) {
    // Betting thresholds - need strong conviction to bet
    this.OVER_THRESHOLD = options.overThreshold || 0.60;  // 60%+ → BET OVER
    this.UNDER_THRESHOLD = options.underThreshold || 0.40; // 40%- → BET UNDER (60%+ UNDER)
    
    // Default odds (most totals are -110/-110)
    this.DEFAULT_DECIMAL_ODDS = 1.91; // -110 in American odds
    
    // Kelly fraction (conservative for safety)
    this.KELLY_FRACTION = 0.25; // Quarter Kelly
    this.MAX_KELLY = 0.10;      // Never bet more than 10% of bankroll
  }
  
  /**
   * Decide if we should bet, and if so, what and how much
   * 
   * @param {Object} analysis - Bayesian analysis result
   * @returns {Object} Betting recommendation
   */
  decideBet(analysis) {
    const { overProbability, underProbability, vegasLine, signals } = analysis;
    
    // Check if we meet OVER threshold
    if (overProbability >= this.OVER_THRESHOLD) {
      const edge = overProbability - 0.50;
      
      return {
        recommendation: 'OVER',
        line: vegasLine,
        probability: overProbability,
        impliedWinRate: overProbability,
        edge: edge,
        edgePercent: edge * 100,
        confidence: this.getConfidenceLevel(edge),
        kelly: this.calculateKelly(overProbability, this.DEFAULT_DECIMAL_ODDS),
        reasoning: this.generateReasoning(signals, 'OVER'),
        signals: signals
      };
    }
    
    // Check if we meet UNDER threshold
    if (overProbability <= this.UNDER_THRESHOLD) {
      const edge = underProbability - 0.50;
      
      return {
        recommendation: 'UNDER',
        line: vegasLine,
        probability: underProbability,
        impliedWinRate: underProbability,
        edge: edge,
        edgePercent: edge * 100,
        confidence: this.getConfidenceLevel(edge),
        kelly: this.calculateKelly(underProbability, this.DEFAULT_DECIMAL_ODDS),
        reasoning: this.generateReasoning(signals, 'UNDER'),
        signals: signals
      };
    }
    
    // No bet - insufficient edge
    return {
      recommendation: 'NO BET',
      line: vegasLine,
      probability: overProbability,
      edge: Math.abs(overProbability - 0.50),
      edgePercent: Math.abs(overProbability - 0.50) * 100,
      confidence: 'INSUFFICIENT',
      reason: `Probability ${(overProbability * 100).toFixed(1)}% is within no-bet zone (${(this.UNDER_THRESHOLD * 100).toFixed(0)}%-${(this.OVER_THRESHOLD * 100).toFixed(0)}%)`,
      signals: signals
    };
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
    
    const fullKelly = (p * b - q) / b;
    
    // Use fractional Kelly for safety
    const kelly = fullKelly * this.KELLY_FRACTION;
    
    // Cap at max
    return Math.max(0, Math.min(this.MAX_KELLY, kelly));
  }
  
  /**
   * Get confidence level based on edge size
   */
  getConfidenceLevel(edge) {
    if (edge >= 0.15) return 'VERY HIGH'; // 15%+ edge
    if (edge >= 0.12) return 'HIGH';      // 12-15% edge
    if (edge >= 0.10) return 'GOOD';      // 10-12% edge
    return 'MODERATE';                     // 10% or less
  }
  
  /**
   * Generate human-readable reasoning for the bet
   */
  generateReasoning(signals, direction) {
    const supporting = [];
    const opposing = [];
    
    for (const signal of signals) {
      const signalDirection = signal.signalProb > 0.50 ? 'OVER' : 'UNDER';
      const impact = Math.abs(signal.impact);
      
      if (signalDirection === direction && impact > 0.01) {
        supporting.push(`${signal.signal} (+${(impact * 100).toFixed(1)}%): ${signal.detail}`);
      } else if (signalDirection !== direction && impact > 0.01) {
        opposing.push(`${signal.signal} (-${(impact * 100).toFixed(1)}%): ${signal.detail}`);
      }
    }
    
    let reasoning = `\n${direction} signals:\n`;
    if (supporting.length > 0) {
      reasoning += supporting.map(s => `  ✓ ${s}`).join('\n');
    } else {
      reasoning += '  (No strong supporting signals)';
    }
    
    if (opposing.length > 0) {
      reasoning += `\n\nOpposing signals:\n`;
      reasoning += opposing.map(s => `  ✗ ${s}`).join('\n');
    }
    
    return reasoning;
  }
  
  /**
   * Generate formatted bet recommendation for display
   */
  formatRecommendation(decision) {
    if (decision.recommendation === 'NO BET') {
      return `\n❌ NO BET - ${decision.reason}\n`;
    }
    
    const lines = [];
    lines.push(`\n${'='.repeat(60)}`);
    lines.push(`🎯 BET RECOMMENDATION: ${decision.recommendation} ${decision.line}`);
    lines.push(`${'='.repeat(60)}\n`);
    
    lines.push(`Win Probability: ${(decision.probability * 100).toFixed(1)}%`);
    lines.push(`Edge: ${(decision.edge * 100).toFixed(1)}%`);
    lines.push(`Confidence: ${decision.confidence}`);
    lines.push(`Kelly Stake: ${(decision.kelly * 100).toFixed(1)}% of bankroll\n`);
    
    lines.push(decision.reasoning);
    
    return lines.join('\n');
  }
  
  /**
   * Batch decision making for multiple games
   * Returns only games with bet recommendations
   */
  filterGamesWithEdge(games) {
    const recommendations = [];
    
    for (const game of games) {
      const decision = this.decideBet(game.analysis);
      
      if (decision.recommendation !== 'NO BET') {
        recommendations.push({
          game: game,
          decision: decision
        });
      }
    }
    
    // Sort by edge (highest first)
    recommendations.sort((a, b) => b.decision.edge - a.decision.edge);
    
    return recommendations;
  }
}

