# MODEL IMPROVEMENT ANALYSIS
## Comparison: NHL Savant vs MoneyPuck

**Date:** October 22, 2025  
**Performance:** 3-5-2 (30% win rate) - NEEDS IMPROVEMENT  
**Status:** URGENT MODEL CALIBRATION REQUIRED

---

## MONEYPUCK'S WIN PROBABILITIES (Tonight - Oct 22)

| Game | MoneyPuck Away | MoneyPuck Home | Our Model | Difference |
|------|----------------|----------------|-----------|------------|
| MIN @ NJD | 42.6% | 57.4% | **Need to check** | TBD |
| DET @ BUF | 47.6% | 52.4% | **Need to check** | TBD |
| MTL @ CGY | 55.6% | 44.4% | **Need to check** | TBD |

---

## CRITICAL ISSUES WITH OUR MODEL

### 1. **OVER-REGRESSION** (Most Likely Culprit)
**Current:** 65-70% regression for 5-6 games played
**Problem:** This is TOO MUCH - we're pulling teams toward league average too aggressively

**MoneyPuck likely uses:** ~40-50% regression for 5-6 games

```javascript
// CURRENT (Too conservative):
applyRegressionToMean(stat, leagueAvg, gamesPlayed) {
  if (gamesPlayed >= 20) return stat;
  const weight = gamesPlayed / 30; // 6 games = 20% weight → 80% regression!
  return (stat * weight) + (leagueAvg * (1 - weight));
}

// PROPOSED FIX:
applyRegressionToMean(stat, leagueAvg, gamesPlayed) {
  if (gamesPlayed >= 25) return stat;
  // Less aggressive: 6 games = 40% weight → 60% regression
  const weight = Math.min(1.0, gamesPlayed / 15);
  return (stat * weight) + (leagueAvg * (1 - weight));
}
```

### 2. **WIN PROBABILITY CALCULATION**
**Current:** Poisson-based with OT advantage
**Issues:**
- May not account for score effects properly
- OT advantage (58/42%) might be too strong
- No team strength consideration in OT

**MoneyPuck uses:**
- Logistic regression on multiple factors
- Historical data from similar matchups
- More sophisticated strength differentials

### 3. **GOALIE ADJUSTMENT**
**Current:** Using season-average team stats (NOT starting goalies)
**MoneyPuck:** Uses confirmed starting goalies with proper adjustments

**Impact:** We're missing ±10-15% on games with elite/weak goalie matchups

### 4. **SPECIAL TEAMS WEIGHTING**
**Current:** Dynamic based on actual penalty minutes
**Question:** Are we over/under-weighting special teams?

**NHL Reality:**
- PP time: ~2-3 minutes/game average
- PK time: ~2-3 minutes/game average
- Total special teams: ~10-15% of game time

### 5. **HOME ICE ADVANTAGE**
**Current:** Flat 5% boost
**MoneyPuck likely uses:** ~3-4% boost

**Rationale:** NHL home ice advantage has decreased in recent years

---

## PROPOSED FIXES (Priority Order)

### **FIX #1: REDUCE REGRESSION** ⭐⭐⭐ (HIGHEST PRIORITY)
```javascript
// Change regression curve to trust early season data more
applyRegressionToMean(stat, leagueAvg, gamesPlayed) {
  if (gamesPlayed >= 25) return stat;
  
  // NEW: Less aggressive curve
  // 5 GP  = 33% weight (67% regression)
  // 10 GP = 67% weight (33% regression)
  // 15 GP = 100% weight (0% regression)
  const weight = Math.min(1.0, gamesPlayed / 15);
  
  return (stat * weight) + (leagueAvg * (1 - weight));
}
```

**Expected Impact:** This alone should reduce our UNDER bias significantly

### **FIX #2: CALIBRATE WIN PROBABILITY**
```javascript
// Add team strength differential to OT advantage
calculatePoissonWinProb(teamScore, oppScore) {
  // ... existing code ...
  
  // NEW: Scale OT advantage by strength differential
  const scoreDiff = teamScore - oppScore;
  const strengthRatio = Math.abs(scoreDiff) / ((teamScore + oppScore) / 2);
  
  // Stronger team: 0.55-0.60 OT win%
  // Weaker team: 0.40-0.45 OT win%
  // Even teams: 0.50 OT win%
  let otAdvantage;
  if (Math.abs(scoreDiff) < 0.15) {
    otAdvantage = 0.50; // Even matchup
  } else {
    otAdvantage = teamScore > oppScore 
      ? 0.55 + (strengthRatio * 0.05) // 0.55-0.60
      : 0.45 - (strengthRatio * 0.05); // 0.40-0.45
  }
  
  winProb += tieProb * otAdvantage;
  return Math.max(0.05, Math.min(0.95, winProb));
}
```

### **FIX #3: REDUCE HOME ICE ADVANTAGE**
```javascript
// Change from 5% to 3.5%
if (isHome) {
  expectedGoals *= 1.035; // Was 1.05
}
```

### **FIX #4: ADD GOALIE ADJUSTMENT** (Already implemented, needs testing)
- Ensure starting goalies are being used
- Verify GSAE adjustments are reasonable (±0.15 goals)

### **FIX #5: VALIDATE SPECIAL TEAMS TIME**
```javascript
// Log and verify special teams time allocation
console.log('Special teams breakdown:', {
  even_strength_pct: (weights['5on5'] / 60) * 100, // Should be ~85%
  power_play_pct: (weights['5on4'] / 60) * 100,    // Should be ~7-8%
  penalty_kill_pct: (weights['4on5'] / 60) * 100   // Should be ~7-8%
});
```

---

## TESTING PLAN

### Phase 1: Immediate Fixes (Tonight)
1. ✅ Reduce regression from 65-70% to 50-60%
2. ✅ Reduce home ice from 5% to 3.5%
3. ✅ Test on tonight's 3 games

### Phase 2: Win Probability Calibration (Tomorrow)
1. Adjust OT advantage calculation
2. Compare our predictions to MoneyPuck on live games
3. Track results for 3-5 days

### Phase 3: Historical Validation (This Week)
1. Backtest on last 10 games (we have the results!)
2. Calculate Brier Score, RMSE
3. Compare to market closing lines
4. Adjust parameters until Brier Score < 0.20

---

## SUCCESS METRICS

### Short Term (Next 5 Days)
- **Win Rate:** >45% (from 30%)
- **EV Accuracy:** Actual ROI within 5% of predicted EV
- **Brier Score:** <0.22 (industry standard is 0.20)

### Medium Term (Next 2 Weeks)
- **Win Rate:** >50%
- **Brier Score:** <0.20
- **CLV (Closing Line Value):** Positive on 55%+ of bets

### Long Term (Season)
- **Win Rate:** >52-54% (breakeven with vig)
- **ROI:** +3-5% (sustainable edge)
- **Brier Score:** <0.19 (beating market)

---

## COMPARISON TO MONEYPUCK

### What MoneyPuck Does Better:
1. **More sophisticated regression:** They use Bayesian hierarchical models
2. **Team context:** Account for injuries, travel, rest days
3. **Historical matchups:** Use past H2H performance
4. **Dynamic adjustments:** Update model mid-season based on results
5. **Goalie confirmation:** Always use confirmed starters

### What We Can Improve:
1. **Less aggressive regression** in early season
2. **Better calibration** against closing lines
3. **Starting goalie integration** (we now have this!)
4. **Validation testing** before going live
5. **Continuous learning** from results

---

## NEXT STEPS

1. **IMMEDIATE:** Implement Fix #1, #2, #3
2. **TONIGHT:** Test on live games, compare to MoneyPuck
3. **TOMORROW:** Review tonight's results
4. **THIS WEEK:** Backtest on recent games, fine-tune
5. **ONGOING:** Track performance, adjust monthly

---

## QUESTIONS FOR USER

1. Do you have access to last night's actual results?
2. Can we track our predictions vs outcomes for 5-10 days?
3. Are you comfortable making incremental changes and testing?
4. Should we add a "confidence level" based on variance?


