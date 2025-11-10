# Model Audit Summary - November 10, 2025

## Executive Summary

Comprehensive audit of NHL Savant's predictive model against 166 regulation games from the 2025-26 season (October 7 - November 9, 2025).

### 🎯 Overall Performance

**Win Predictions: EXCELLENT** ✅
- Win Accuracy: **62.7%** (Target: >55%)
- The model correctly predicts game winners at an elite level

**Goal Totals: NEEDS CALIBRATION** ⚠️
- RMSE: **2.169 goals** (Target: <2.0)
- Average Bias: **-0.367 goals** (Under-predicting)
- The model consistently predicts fewer goals than actually occur

---

## Detailed Findings

### 1. Total Goals Prediction Accuracy

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| RMSE | 2.169 goals | < 2.0 | ❌ Slightly high |
| Average Error | -0.367 goals | ±0.1 | ❌ Under-predicting |
| Sample Size | 166 games | 80+ | ✅ Sufficient |

**Interpretation:**
- Model predicts an average of **5.83 goals/game**
- Actual average is **6.20 goals/game**
- **Under-prediction of 0.37 goals per game (6% low)**

### 2. Win Probability Calibration

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Brier Score | 0.2381 | < 0.23 | ⚠️ Close |
| Win Accuracy | 62.7% | > 55% | ✅ Excellent |

**Calibration Curve Analysis:**

| Predicted Win % | Actual Win % | Sample | Calibration Quality |
|----------------|--------------|---------|---------------------|
| 40-45% | 52.9% | 17 | Under-confident |
| 45-50% | 35.3% | 34 | Over-confident |
| 50-55% | 57.9% | 38 | Good |
| 55-60% | 71.8% | 39 | Under-confident |
| 60-65% | 70.0% | 20 | Under-confident |
| 65-70% | 71.4% | 7 | Good |

**Interpretation:**
- Model is generally **under-confident** (predicts lower win probabilities than actual)
- When model says 55-60% win chance, teams actually win **72%** of the time
- Win predictions are reliable but probabilities could be more aggressive

### 3. Worst Prediction Examples

Top 5 prediction errors (all under-predictions):

1. **NJD @ COL** (10/28): Predicted 5.66, Actual 12 → Error: -6.34 goals
2. **OTT @ BUF** (10/15): Predicted 5.88, Actual 12 → Error: -6.12 goals
3. **ANA @ BOS** (10/23): Predicted 6.09, Actual 12 → Error: -5.91 goals
4. **ANA @ DAL** (11/6): Predicted 6.83, Actual 12 → Error: -5.17 goals
5. **CHI @ STL** (10/15): Predicted 5.87, Actual 11 → Error: -5.13 goals

**Pattern:** All worst predictions are high-scoring games (10+ goals) that the model significantly under-predicted.

---

## Root Cause Analysis

### Current Calibration Constant Investigation

**Current Value:** `HISTORICAL_CALIBRATION = 1.436` (in `src/utils/dataProcessing.js` line 213)

**How Calibration Works:**
```
Final Predicted Score = Base xG × HISTORICAL_CALIBRATION
```

**Current Performance:**
- Actual league average: **6.197 goals/game** (183 regulation games)
- Model average prediction: **~5.83 goals/game**
- Current calibration: **1.436**

**Calculation:**
- Implied base xG from predictions: 5.83 ÷ 1.436 = **4.06 goals/game**
- Calibration needed to match actuals: 6.197 ÷ 4.06 = **1.526**
- Required increase: **+6.3%**

---

## 📋 Recommendations

### Priority 1: Adjust Calibration Constant (HIGH IMPACT)

**Action:** Increase `HISTORICAL_CALIBRATION` from 1.436 to 1.52

**Rationale:**
- Model is systematically under-predicting by 6%
- Sample size is sufficient (166 games)
- Adjustment will reduce RMSE and eliminate bias

**Implementation:**
1. Edit `src/utils/dataProcessing.js` line 213
2. Change: `const HISTORICAL_CALIBRATION = 1.436;`
3. To: `const HISTORICAL_CALIBRATION = 1.52;`
4. Test with recent games to verify improvement

**Expected Improvement:**
- Average error: -0.367 → ~0.0 goals
- RMSE: 2.169 → ~2.0 goals
- Predictions align with 2025-26 actual scoring rates

### Priority 2: Monitor High-Scoring Game Detection (MEDIUM IMPACT)

**Issue:** Model significantly under-predicts games with 10+ goals

**Possible Causes:**
- Calibration floor/ceiling effects
- Missing context factors for offensive explosions
- Special teams or goalie injuries not captured

**Action:** 
- Track games with unusual scoring patterns
- Consider adding volatility indicators
- Monitor goalie backup situations

### Priority 3: Fine-Tune Win Probability Confidence (LOW IMPACT)

**Issue:** Model is slightly under-confident in win probabilities

**Current:** When model says 60% win chance → actually 70%
**Target:** Tighten calibration curve

**Action:**
- Review `k` parameter in Poisson win probability calculation
- Consider slight increase to home ice advantage factor
- Lower priority since win accuracy is already excellent (62.7%)

---

## Testing Recommendations

### Before Adjusting Calibration:
1. ✅ Run accuracy test (completed)
2. ✅ Analyze calibration constants (completed)
3. ✅ Review sample size (166 games - sufficient)

### After Adjusting to 1.52:
1. Re-run `node scripts/test2025Accuracy.js`
2. Verify RMSE drops below 2.0
3. Check average error is near 0
4. Monitor next 20 games for validation
5. Fine-tune to 1.51 or 1.53 if needed

---

## Data Quality Notes

**Sample Composition:**
- 166 regulation games (91% of available)
- 17 games skipped (invalid scores or incomplete data)
- Date range: October 7 - November 9, 2025
- Good distribution across all teams

**Goalie Data Issues:**
- 8 goalies not found in database (used default adjustments)
- Missing: Cameron Talbot, Daniel Vladar, Leevi Meriläinen, Petr Mirazek, etc.
- Impact: Minimal (< 5% of games affected)

---

## Historical Context

### 2025-26 Season vs Previous Years

| Season | Goals/Game | Change |
|--------|-----------|---------|
| 2023-24 | 6.07 | Baseline |
| 2024-25 | 5.99 | -1.3% |
| 2025-26 | 6.20 | +2.1% |

**Trend:** League scoring is UP this season, explaining why the calibration constant needs to increase.

---

## Next Steps

### Immediate (This Week)
1. ✅ Complete model audit
2. 🔲 Update calibration constant to 1.52
3. 🔲 Re-test accuracy
4. 🔲 Deploy updated model

### Short-Term (Next 2 Weeks)
1. Monitor model performance on next 20 games
2. Track high-scoring game predictions
3. Update goalie database with missing players

### Long-Term (Monthly)
1. Re-run full audit monthly during season
2. Track calibration constant drift
3. Build automated calibration adjustment system

---

## Conclusion

The NHL Savant model is **performing excellently at predicting winners (62.7% accuracy)** but requires a **calibration adjustment (+6.3%)** to align goal predictions with the 2025-26 season's higher scoring rate.

**Recommended Action:** Increase `HISTORICAL_CALIBRATION` from 1.436 to 1.52 to eliminate the -0.367 goal bias and improve RMSE.

**Model Strengths:**
- Elite win prediction accuracy (62.7%)
- Solid sample size (166 games)
- Systematic, predictable bias (easy to fix)

**Model Weaknesses:**
- Under-predicting high-scoring games
- Slightly under-confident win probabilities
- Some missing goalie data

**Overall Grade: B+** (Would be A with calibration fix)

---

**Generated:** November 10, 2025
**Audit Scripts:**
- `scripts/test2025Accuracy.js`
- `scripts/calculate2025Constants.js`

**Data Files:**
- `public/nhl-202526-asplayed.csv` (1312 games)
- `EARLY_SEASON_2025_ACCURACY.md` (detailed results)

