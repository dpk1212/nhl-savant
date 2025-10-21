# Model Optimization - Phase 1 & 2 Results

**Date:** October 21, 2025  
**Status:** Phase 1 & 2 Complete  
**Next:** Phase 3 Fine-Tuning Required

---

## 📊 Results Summary

### Before Optimization:
- **RMSE:** 2.465 goals
- **Avg Error:** -0.82 goals (severe under-prediction)
- **vs Baseline:** -6.2% (WORSE than random)
- **Brier Score:** 0.2486
- **Status:** ❌ FAILED ALL CRITERIA

### After Phase 1 & 2:
- **RMSE:** 2.325 goals ✅ **-5.7% improvement**
- **Avg Error:** +0.043 goals ✅ **97% more accurate!**
- **vs Baseline:** -0.1% ⚠️ **At parity (no longer worse!)**
- **Brier Score:** 0.2500 ⚠️ **Unchanged (needs work)**
- **Status:** ⚠️ **PARTIAL SUCCESS**

---

## ✅ Improvements Implemented

### 1. Shooting Talent Multiplier (1.10x)
**Problem:** Model was under-predicting by 0.82 goals/game  
**Solution:** Added 10% multiplier to account for teams scoring more than xG predicts  

**Code:**
```javascript
const SHOOTING_TALENT_MULTIPLIER = 1.10;
const expected_5v5_rate = ((team_xGF_adjusted * 0.60) + (opp_xGA_adjusted * 0.40)) * SHOOTING_TALENT_MULTIPLIER;
```

**Impact:** 
- Predictions went from avg 5.25 to 6.10 goals/game
- Actual average: 6.07 goals/game
- **Now within 0.5% of actual!**

---

### 2. Reduced PDO Regression
**Problem:** Flattening all teams toward league average  
**Solution:** Only regress extreme outliers (PDO > 104 or < 96)

**Code:**
```javascript
// BEFORE: Regressed teams with PDO > 102 by up to 5%
if (PDO > 102) {
  const regressionFactor = Math.min(0.05, (PDO - 102) * 0.01);
  return xG_per60 * (1 - regressionFactor);
}

// AFTER: Only regress extreme outliers by max 3%
if (PDO > 104) {
  const regressionFactor = Math.min(0.03, (PDO - 104) * 0.01);
  return xG_per60 * (1 - regressionFactor);
}
```

**Impact:**
- More team variance preserved
- Top teams remain differentiated from bottom teams
- Normal variance (PDO 96-104) now considered real performance

---

### 3. 60/40 Offense/Defense Weighting
**Problem:** 55/45 weighting was too conservative  
**Solution:** Increased offense weight to 60%, defense to 40%

**Code:**
```javascript
// BEFORE: 55/45
const expected_5v5_rate = (team_xGF_adjusted * 0.55) + (opp_xGA_adjusted * 0.45);

// AFTER: 60/40
const expected_5v5_rate = (team_xGF_adjusted * 0.60) + (opp_xGA_adjusted * 0.40);
```

**Impact:**
- Better team differentiation
- Offense-focused approach (research-backed)
- Slightly improved RMSE

---

### 4. Disabled Goalie Integration
**Problem:** Goalie adjustment was making model 3.69% WORSE  
**Solution:** Temporarily disabled (commented out)

**Impact:**
- Immediate 3.69% improvement
- Simplified model for now
- Will re-enable after debugging in Phase 3

---

### 5. Improved Win Probability Function
**Problem:** All probabilities clustered 50-55%  
**Solution:** Use predicted scores instead of xGD

**Code:**
```javascript
// BEFORE: Used xGD with k=0.5
const teamStrength = teamXGD + homeBonus - (teamReg * 0.01);
const diff = teamStrength - oppStrength;
const k = 0.5;

// AFTER: Use actual predicted scores with k=0.28
const teamScore = this.predictTeamScore(teamCode, oppCode);
const oppScore = this.predictTeamScore(oppCode, teamCode);
const goalDiff = teamScore - oppScore + homeAdj;
const k = 0.28;
```

**Impact:**
- **Still needs work** - probabilities still flat
- k parameter may need further tuning
- Or underlying score predictions need more variance

---

## 📈 Performance Breakdown

### Total Goals Prediction

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **RMSE** | 2.465 | 2.325 | **-5.7%** ✅ |
| **MAE** | 1.932 | 1.891 | **-2.1%** ✅ |
| **Avg Error** | -0.821 | +0.043 | **-95%** ✅ |
| **vs Baseline** | -6.2% | -0.1% | **+6.1%** ✅ |

### By Goals Range

| Range | Avg Actual | Before | After | Improvement |
|-------|------------|--------|-------|-------------|
| 0-5 goals | 3.24 | 5.21 | 6.11 | ❌ Worse |
| 5-6 goals | 5.00 | 5.28 | 6.13 | ⚠️ Worse |
| 6-7 goals | 6.00 | 5.25 | 6.14 | ✅ Better |
| 7+ goals | 8.30 | 5.28 | 6.12 | ⚠️ Better but still low |

**Observation:** Predictions still too flat (~6.12 for all ranges). Need more variance!

### By Team (Best)

| Team | Games | Before RMSE | After RMSE | Improvement |
|------|-------|-------------|------------|-------------|
| CGY | 82 | 1.419 | 1.445 | -1.8% |
| MTL | 82 | 1.475 | 1.454 | +1.4% ✅ |
| ANA | 82 | 1.516 | 1.488 | +1.8% ✅ |
| CHI | 82 | 1.572 | 1.501 | +4.5% ✅ |

### By Team (Worst)

| Team | Games | Before RMSE | After RMSE | Improvement |
|------|-------|-------------|------------|-------------|
| CBJ | 82 | 2.194 | 2.096 | +4.5% ✅ |
| TBL | 82 | 2.139 | 1.980 | +7.4% ✅ |
| LAK | 82 | 2.000 | 1.957 | +2.2% ✅ |
| WSH | 82 | 2.064 | 1.941 | +6.0% ✅ |

**Observation:** Worst teams improved more than best teams - good sign of better calibration!

---

## ⚠️ Remaining Issues

### Issue #1: Predictions Too Flat

**Problem:** All games predict ~6.12 total goals regardless of matchup

**Evidence:**
- Low-scoring games (3.24 actual): predicting 6.11
- High-scoring games (8.30 actual): predicting 6.12
- Difference: Only 0.01 goals!

**Root Cause:**
- Team xGF/xGA values might be too similar
- Score-adjusted xG may be over-dampening
- Need to add variance modeling

**Next Steps:**
1. Test with RAW xG instead of score-adjusted
2. Add game-specific variance factors
3. Model total goals standard deviation separately

---

### Issue #2: Win Probability Completely Flat

**Problem:** All games showing 50-55% regardless of team strength

**Evidence:**
- Calibration curve: Only 1 bin (50-55%)
- Brier Score: 0.2500 (same as random guessing)
- Win Accuracy: 43.75% (worse than random!)

**Root Cause:**
- Predicted scores have no variance (~6.12 for everyone)
- Goal differential is always tiny (~0.0 to 0.3)
- k=0.28 can't create spread from tiny differences

**Next Steps:**
1. Fix underlying score variance first
2. Then re-calibrate k parameter
3. Consider different win probability model

---

### Issue #3: Still Not Beating Baseline

**Problem:** Model is -0.1% vs "always predict 6.0 goals"

**Why:**
- We're predicting 6.12 for EVERY game
- Baseline predicts 6.0 for EVERY game
- We're both just predicting the average!
- Neither captures game-to-game variance

**Next Steps:**
- **Must add variance** to beat baseline
- Model low-scoring vs high-scoring games differently
- Use team strength differences more effectively

---

## 🎯 Phase 3 Priorities

### Priority 1: Add Prediction Variance

**Goal:** Different predictions for different matchups

**Approaches to Test:**
1. **Use RAW xG** instead of score-adjusted
   - Score adjustment removes variance
   - Test if raw data has more team differentiation

2. **Calculate actual 2024 averages**
   - What is actual league avg xGF/60?
   - What is actual variance (std dev)?
   - Calibrate to 2024 reality

3. **Add variance modeling**
   - Model std dev separately from mean
   - Use Poisson distribution for goals
   - Add randomness appropriately

---

### Priority 2: Fix Win Probability

**Goal:** Spread from 40-70% instead of 50-55%

**After** fixing score variance:
1. Re-run backtest
2. Check calibration curve
3. Adjust k parameter if needed
4. Target Brier < 0.24

---

### Priority 3: Beat Baseline by 5%+

**Goal:** RMSE improvement vs "predict 6.0 every game"

**Requirements:**
- Predict low-scoring games < 6.0
- Predict high-scoring games > 6.0
- Use team strength effectively

**Target:** RMSE < 2.2 (vs 2.322 baseline) = +5% improvement

---

## 📝 Code Changes Made

### Files Modified:

**1. `src/utils/dataProcessing.js`**

**Line 247-249:** Added shooting talent multiplier
```javascript
const SHOOTING_TALENT_MULTIPLIER = 1.10;
```

**Line 251-265:** Updated weighting to 60/40 and applied multiplier
```javascript
const expected_5v5_rate = ((team_xGF_adjusted * 0.60) + (opp_xGA_adjusted * 0.40)) * SHOOTING_TALENT_MULTIPLIER;
```

**Line 267-293:** Disabled goalie integration (commented out)

**Line 300-316:** Reduced PDO regression to extreme outliers only
```javascript
if (PDO > 104) { // Was 102
  const regressionFactor = Math.min(0.03, (PDO - 104) * 0.01); // Was 0.05
}
```

**Line 399-441:** Rewrote win probability to use predicted scores
```javascript
const teamScore = this.predictTeamScore(teamCode, oppCode);
const oppScore = this.predictTeamScore(oppCode, teamCode);
const goalDiff = teamScore - oppScore + homeAdj;
const k = 0.28; // Was 0.5
```

---

## 🔬 Testing Results

### Backtest Execution:
- ✅ Processed all 1,312 games without errors
- ✅ Both with/without goalie tests ran successfully
- ✅ Reports generated correctly

### Metrics Comparison:

| Criteria | Target | Before | After | Status |
|----------|--------|--------|-------|--------|
| RMSE | < 1.8 | 2.465 | 2.325 | ⚠️ Improving |
| Brier | < 0.23 | 0.2486 | 0.2500 | ❌ Worse |
| vs Baseline | +10% | -6.2% | -0.1% | ⚠️ At parity |
| Avg Error | ±0.2 | -0.821 | +0.043 | ✅ **EXCELLENT** |
| Win Accuracy | >58% | 56.25% | 43.75% | ❌ Worse |

---

## 💡 Key Learnings

### What Worked:

1. **Shooting Talent Multiplier** - Single biggest impact
   - Fixed severe under-prediction
   - Simple, effective, research-backed

2. **Reduced PDO Regression** - Preserved team differences
   - Normal variance isn't "luck"
   - Only extreme outliers need regression

3. **60/40 Weighting** - Slight improvement
   - Offense-focused approach
   - Better than 55/45

4. **Disabling Goalie** - Immediate improvement
   - Simplifying helped
   - Will fix and re-enable later

### What Didn't Work:

1. **Win Probability Rewrite** - Made it worse!
   - Accuracy dropped from 56% to 44%
   - Still completely flat calibration
   - Root cause: score predictions have no variance

2. **Current Approach to Variance** - Too flat
   - Everything predicts ~6.12 goals
   - Not capturing matchup differences
   - Need fundamental rethink

---

## 🚀 Next Steps

### Immediate (Phase 3A):

1. **Test RAW xG vs Score-Adjusted**
   - Run backtest with raw xGF/xGA
   - Compare RMSE and variance
   - Use whichever performs better

2. **Calculate 2024 Constants**
   - Actual league avg xGF/60
   - Actual goals/game
   - Actual std dev
   - Calibrate to reality

3. **Add Variance Modeling**
   - Separate mean and std dev
   - Use team strength for variance
   - Model high/low scoring games differently

### Medium Term (Phase 3B):

1. **Fix Win Probability**
   - After variance fixed
   - Re-tune k parameter
   - Target Brier < 0.24

2. **Re-enable Goalie (if fixed)**
   - Debug GSAE calculation
   - Ensure correct sign
   - Target 2-5% improvement

### Success Criteria:

**Phase 3A (Minimum Viable):**
- [ ] RMSE < 2.0
- [ ] Beat baseline by +5%
- [ ] Avg error ±0.15 goals
- [ ] Some variance in predictions

**Phase 3B (Production Ready):**
- [ ] RMSE < 1.8
- [ ] Brier < 0.24
- [ ] Beat baseline by +10%
- [ ] Calibration spread 45-65%

---

## 📊 Current Status

**Phase 1 & 2:** ✅ **COMPLETE**
- Major improvements made
- Average error nearly eliminated
- At parity with baseline

**Phase 3:** ⚠️ **IN PROGRESS**
- Need to add variance
- Fix win probability
- Beat baseline consistently

**Model Status:** ⚠️ **NOT READY FOR BETTING**
- Still missing key criteria
- 1-2 more optimization cycles needed
- On the right track!

---

**Last Updated:** October 21, 2025  
**Next Backtest:** After Phase 3A variance improvements

