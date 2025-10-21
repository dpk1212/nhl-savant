# Backtest Analysis - Critical Findings

**Date:** October 21, 2025  
**Games Tested:** 1,312 (full 2024 NHL season)  
**Model Version:** Phase 1-3 (with goalie integration)

---

## 🚨 CRITICAL FINDINGS

### The model is **NOT READY** for real money betting

**Key Metrics:**
- ⚠️ **Brier Score:** 0.2486 (Target: < 0.23) - **MARGINAL**
- ❌ **RMSE:** 2.465 goals (Target: < 1.8) - **FAIL**
- ❌ **Baseline Comparison:** Model is actually **6.2% WORSE** than just predicting 6.0 goals every game

---

## 📊 What Went Wrong

### 1. **Severe Under-Prediction (-0.82 goals per game)**

The model is systematically predicting **0.82 goals fewer** than actually scored.

**Analysis by Goals Range:**
| Actual Total | Avg Actual | Avg Predicted | Error |
|--------------|------------|---------------|-------|
| 0-5 goals    | 3.24       | 5.21          | +1.97 (OVER) |
| 5-6 goals    | 5.00       | 5.28          | +0.28 (slight over) |
| 6-7 goals    | 6.00       | 5.25          | -0.75 (UNDER) |
| 7+ goals     | 8.30       | 5.28          | **-3.02 (SEVERE UNDER)** |

**Problem:** The model is:
- Over-predicting low-scoring games
- Severely under-predicting high-scoring games
- Essentially regressing everything toward ~5.25 goals

### 2. **Poor Calibration**

Only 1 calibration bin (50-55%) had data, suggesting:
- Model is giving very narrow probability ranges
- Not enough confidence variation
- Win probabilities are clustering around 50-55%

### 3. **Baseline Comparison - WORSE Than Random**

| Metric | Simple "6.0 goals" | Our Model | Difference |
|--------|-------------------|-----------|------------|
| RMSE   | 2.322             | 2.465     | **-6.2% worse** |

**Translation:** You would be MORE accurate by literally predicting 6.0 total goals for every game than using this model.

### 4. **Win Probability - Barely Better Than Coin Flip**

- Brier Score: 0.2486 vs. 0.250 baseline = only 0.6% improvement
- Win accuracy: 56.25% (barely better than 50/50)

---

## 🔍 Root Cause Analysis

### Problem 1: Fixed Predictions (~5.25 goals)

**Evidence:**
- All predicted ranges cluster around 5.21-5.28 goals
- No meaningful variation between teams
- Model is not capturing team strength differences

**Likely Causes:**
1. **Regression to mean is too strong**
   - The model might be over-dampening team differences
   - PDO regression or adjustment factors too aggressive
   
2. **Score adjustment is over-correcting**
   - `scoreAdj_xGF_per60` might be flattening all teams
   
3. **Constants are wrong**
   - Base scoring rates too low
   - Home ice advantage under-valued
   - Special teams impact under-weighted

### Problem 2: Goalie Integration Has ZERO Impact

**Shocking Result:**
- **With Goalie:** Brier 0.2486, RMSE 2.465
- **Without Goalie:** Brier 0.2486, RMSE 2.377
- **Difference:** Goalie makes model **3.69% WORSE**

**This means:**
- Either the goalie implementation is broken
- Or the goalie data/weighting is incorrect
- Or team-average goalie stats are useless

---

## 🎯 Required Fixes (Priority Order)

### **FIX #1: Increase Base Scoring Rates (+0.82 goals)**

**Current Issue:** Predicting 5.25, actual is 6.07

**Actions:**
1. Check `predictTeamScore()` output for typical matchup
2. Likely need to increase by ~15-20%
3. Possible adjustments:
   - Increase `minutesPerPeriod` constants
   - Reduce defensive impact weight
   - Increase home ice advantage

**Test:** Re-run backtest, target average prediction of 6.0-6.1 goals

---

### **FIX #2: Fix Win Probability Clustering**

**Current Issue:** All probabilities clustered 50-55%

**Actions:**
1. Review `estimateWinProbability()` function
2. Check if `k` parameter is too large (over-smoothing)
3. Verify home ice advantage is being applied correctly
4. Consider using actual predicted score differential for win probability

**Test:** Calibration curve should have bins from 40% to 70%+

---

### **FIX #3: Increase Team Differentiation**

**Current Issue:** All teams predicting ~5.25 regardless of strength

**Actions:**
1. Reduce regression to mean
2. Verify team data is loading correctly
3. Check that offensive/defensive ratings have meaningful variance
4. Possibly reduce score adjustment impact

**Example:** 
- BOS vs. ANA should be very different from MTL vs. CHI
- Currently they're all ~5.25 goals

**Test:** Top teams should predict 6.5+, bottom teams 5.0-5.5

---

### **FIX #4: Debug or Remove Goalie Integration**

**Current Issue:** Goalie makes model worse

**Actions:**
1. Verify `GoalieProcessor.getTeamAverageGoalieStats()` returns valid data
2. Check GSAE adjustment magnitude (might be too small or reversed)
3. Confirm high-danger save % is being applied correctly
4. If broken, disable goalie until fixed

**Test:** With goalie should be measurably better (2-5% improvement)

---

### **FIX #5: Add Prediction Variance**

**Current Issue:** Model too conservative, needs wider ranges

**Actions:**
1. Review how standard deviation is calculated
2. Ensure team strength differences create meaningful variance
3. Consider adding randomness/uncertainty appropriately

**Test:** High-confidence games should be 60-65%+ win probability

---

## 📈 Success Metrics for Next Backtest

After fixes, we should see:

### Minimum Acceptable:
- ✅ RMSE < 2.0 (currently 2.465)
- ✅ Brier < 0.24 (currently 0.2486)
- ✅ Beat baseline by +5% (currently -6.2%)
- ✅ Avg error within ±0.2 goals (currently -0.82)

### Target (Model Ready):
- 🎯 RMSE < 1.8
- 🎯 Brier < 0.23
- 🎯 Beat baseline by +10%
- 🎯 Calibration error < 2% per bin
- 🎯 Win accuracy > 58%

---

## 🔬 Specific Code Areas to Investigate

### 1. **dataProcessing.js - `predictTeamScore()`**
```javascript
// Check these values for a typical game:
const offensiveScore = // What is this?
const defensiveScore = // What is this?
const finalScore = // What is this?

// Likely too low by ~0.4-0.5 goals per team
```

### 2. **dataProcessing.js - `estimateWinProbability()`**
```javascript
// Check if this is clustering around 50-55%
// May need to:
// - Reduce k parameter (less smoothing)
// - Increase home ice advantage
// - Use actual predicted scores instead of team ratings
```

### 3. **goalieProcessor.js - `getTeamAverageGoalieStats()`**
```javascript
// Verify this returns reasonable values:
// - gsaePerGame: should be -0.5 to +0.5
// - hdSavePct: should be 0.80 to 0.90
// - Impact should be ~0.1-0.3 goals per game

// Currently having ZERO or NEGATIVE impact
```

### 4. **dataProcessing.js - Constants**
```javascript
// Check these values:
const HOME_ICE_ADVANTAGE = ? // Might be too small
const SCORING_RATE_MULTIPLIER = ? // Might be too low
const REGRESSION_FACTOR = ? // Might be too high
```

---

## 💡 Model Architecture Issues

### The model is too "flat"

**Observation:** 
- All predictions cluster around 5.25 goals
- All win probabilities cluster around 50-55%
- Little variation between teams

**This suggests:**
1. **Over-regression** - dampening team differences too much
2. **Wrong base rates** - starting from wrong average
3. **Missing factors** - not capturing what makes teams different

### Potential Solutions:

**Option A: Reduce Dampening**
- Use raw xG rates instead of score-adjusted
- Reduce PDO regression
- Increase team strength coefficient

**Option B: Recalibrate Constants**
- Use 2024 actual average (6.07 goals) as base
- Recalculate all adjustment factors from 2024 data
- Ensure home ice = +0.3 goals based on 2024 splits

**Option C: Simplify Model**
- Remove score adjustment (might be hurting more than helping)
- Use simpler offense vs. defense calculation
- Add back complexity only after base model works

---

## 🚀 Recommended Action Plan

### Phase 1: Quick Fixes (Today)
1. ✅ Analyze why predictions are flat at 5.25
2. ✅ Increase base scoring rate by 15%
3. ✅ Verify goalie integration isn't broken
4. ✅ Re-run backtest

### Phase 2: Calibration (This Week)
1. Tune constants to match 2024 actual averages
2. Ensure home ice advantage is correct
3. Verify team strength variance is reasonable
4. Re-run backtest, target RMSE < 2.0

### Phase 3: Advanced Tuning (Next Week)
1. Implement confidence intervals
2. Add situational adjustments
3. Consider recent form / injuries
4. Re-run backtest, target RMSE < 1.8

### Phase 4: Validation (Before Betting)
1. Paper trade for 2 weeks on current season
2. Compare predictions to closing lines
3. Track actual vs. predicted on new data
4. Only bet if maintaining metrics

---

## ⚠️ DO NOT BET UNTIL:

1. ✅ RMSE < 1.8 on backtest
2. ✅ Brier < 0.23 on backtest
3. ✅ Beat baseline by 10%+
4. ✅ Calibration curve shows proper spread
5. ✅ Paper trading validates on current season
6. ✅ Edge persists vs. closing lines

**Current Status:** 0/6 criteria met

---

## 📝 Positive Takeaways

Despite the model failing validation, we learned:

1. ✅ **Infrastructure works** - Backtest ran perfectly on 1,312 games
2. ✅ **We have the data** - Complete 2024 season for validation
3. ✅ **We can measure** - Comprehensive metrics identify exact problems
4. ✅ **Clear path forward** - Specific fixes identified
5. ✅ **Fast iteration** - Can test fixes in < 2 minutes

**This is exactly why we backtest before betting real money.**

---

## Next Steps

1. **Review Code:** Examine `predictTeamScore()` and `estimateWinProbability()`
2. **Debug Output:** Add logging to see what's causing flat predictions
3. **Quick Fix:** Increase base scoring rate
4. **Re-test:** Run backtest again with fixes
5. **Iterate:** Repeat until metrics hit targets

**Do not proceed to real money betting until model passes validation.**


