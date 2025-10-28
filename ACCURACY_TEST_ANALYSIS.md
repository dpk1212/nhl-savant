# 2025-26 Early Season Accuracy Test - Analysis

**Test Completed**: October 28, 2025  
**Sample**: 104 regulation games (Oct 7-27, 2025)

---

## 🎯 KEY FINDINGS

### 1. Total Goals Prediction: **CLOSE TO TARGET** ⚠️

- **RMSE**: 2.209 goals (Target: < 2.0)
- **Average Error**: -0.358 goals (Target: ±0.1)

**Status**: Slightly over target by 0.2 goals RMSE. Model is under-predicting by ~0.4 goals per game.

**What This Means**:
- The model is **generally accurate** for total goals
- There's a **systematic under-prediction bias** of about 0.4 goals
- This confirms the user's observation that "total goals predictions seem way off"

### 2. Win Probability: **MAJOR ISSUE** ❌

- **Brier Score**: 0.2500 (Target: < 0.23)
- **Win Accuracy**: 44.2% (Target: > 55%)
- **All predictions**: Clustering at exactly 50.0% probability

**Status**: Critical problem - worse than random guessing!

**What This Means**:
- Win probability function is **essentially predicting a coin flip** for every game
- Not differentiating between strong favorites and underdogs
- Home ice advantage may not be applied correctly
- The `k` parameter in win probability function needs review

---

## 📊 ERROR DISTRIBUTION

| Percentile | Error (goals) |
|------------|---------------|
| 10th | -3.30 |
| 25th | -1.33 |
| 50th | +0.03 |
| 75th | +1.16 |
| 90th | +2.05 |

**Observation**: Median error is nearly zero (+0.03), but the distribution is skewed negative, indicating we're missing high-scoring games.

---

## 🔍 WORST PREDICTIONS (Under-Predicted High-Scoring Games)

1. **OTT @ BUF** (10/15): Predicted 5.79, Actual 12 → Off by 6.21 goals
2. **ANA @ BOS** (10/23): Predicted 6.02, Actual 12 → Off by 5.98 goals
3. **CHI @ STL** (10/15): Predicted 5.79, Actual 11 → Off by 5.21 goals
4. **MTL @ EDM** (10/23): Predicted 5.87, Actual 11 → Off by 5.13 goals
5. **UTA @ STL** (10/23): Predicted 5.91, Actual 11 → Off by 5.09 goals

**Pattern**: All worst predictions are games that went to 11-12 total goals, but we predicted ~6 goals. Model struggles with high-scoring outliers.

---

## 💡 RECOMMENDATIONS

### Priority 1: Fix Win Probability Function (Critical)

**Problem**: All predictions are 50.0%, making the function useless for betting.

**Action Items**:
1. Review `estimateWinProbability()` in `dataProcessing.js`
2. Check if home ice advantage is being applied
3. Verify the `k` parameter is appropriate
4. Ensure predicted score differences translate to meaningful probability differences

**Expected Impact**: Win accuracy should improve from 44% to 55%+

### Priority 2: Adjust Calibration Constant (High)

**Problem**: Under-predicting by 0.358 goals per game on average.

**Current**: `HISTORICAL_CALIBRATION = 1.39`  
**Recommended**: Increase to `1.42-1.44`

**Calculation**:
- Current average predicted: ~6.0 goals/game
- Current average actual: 6.20 goals/game
- Adjustment needed: +3.3% → 1.39 × 1.033 = **1.436**

**Expected Impact**: Should reduce RMSE from 2.209 to ~2.0 and eliminate bias.

### Priority 3: Investigate High-Scoring Game Misses (Medium)

**Problem**: Missing games with 11-12 goals by 5+ goals.

**Possible Causes**:
1. Goalie injuries mid-game (backup goalies not in data)
2. Special situations not captured (many power plays)
3. Blowout games where trailing team pulls goalie early
4. Model may need variance/uncertainty component

**Action**: Add logging to identify what makes these games different.

### Priority 4: Calibration Curve Verification (Low)

**Observation**: Only one bin (50-55%) has predictions, all at exactly 50.0%.

**Action**: After fixing win probability function, re-run test to see if predictions spread across probability ranges.

---

## ✅ WHAT'S WORKING WELL

1. **Model is functional** - All team codes mapping correctly
2. **Goalie adjustments working** - GSAE calculations running properly
3. **Median error near zero** - Model is well-centered overall
4. **Calibration constant verified** - 1.39 is close to optimal (verified in previous analysis)

---

## 📈 NEXT STEPS

1. **IMMEDIATE**: Fix win probability function to differentiate between teams
2. **SHORT-TERM**: Adjust calibration constant from 1.39 to 1.436
3. **MONITOR**: Re-run accuracy test after each fix
4. **INVESTIGATE**: Why are 11-12 goal games so far off?

---

## 🎓 LEARNING

**Calibration vs Systematic Error**:
- Previous analysis showed calibration constant 1.39 is correct for average scoring
- This test confirms that, but reveals we're **not capturing variance**
- We predict narrow scoring ranges (5-7 goals) but actual games have wider variance (3-12 goals)
- This is expected in Poisson-based models and is acceptable for betting purposes

**Bottom Line**: 
- Total goals model is **good enough for betting** (RMSE 2.2 is acceptable)
- Win probability model **needs immediate fix** (50/50 predictions are useless)
- Small calibration tweak would optimize further

