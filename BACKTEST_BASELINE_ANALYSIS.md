# BACKTEST BASELINE ANALYSIS - 2024-2025 Season
## The Real State of Your Model (No BS)

**Generated:** October 22, 2025

---

## THE BRUTAL TRUTH

Your model is **FAILING on every metric**:

```
Metric                  Current    Target    Status
─────────────────────────────────────────────────
Brier Score (Win Prob)  0.2500     < 0.23    ❌ FAIL
RMSE (Total Goals)      2.409      < 1.8     ❌ FAIL  
vs "Always 6.0 Goals"   -3.8%      > +10%    ❌ WORSE
vs "Always 50% Prob"    0.0%       > +10%    ❌ NO EDGE
Win Accuracy            43.75%     50%+      ❌ BELOW BASELINE
```

### What This Means In English:

1. **Brier Score = 0.2500** = **SAME AS RANDOM GUESSING**
   - You're essentially flipping a coin
   - Your calibration is completely broken

2. **RMSE = 2.409** = **PREDICTING 2.4 GOALS OFF**
   - On a 6-goal game, you're off by 40%
   - Worse than just saying "always 6 goals"

3. **Win Accuracy = 43.75%** = **PREDICTS WORSE THAN RANDOM**
   - Baseline would be 50%
   - You're 6.25% BELOW baseline

---

## THE REAL PROBLEM: "FLAT PREDICTIONS"

### Your prediction spread:

```
All Predictions:       50-55% win probability
All Predictions:       ~5.37-5.41 total goals
```

**You're predicting the SAME thing for every game.**

### Why This Matters:

If you always predict:
- Total Goals = 5.4
- Home Win Prob = 52%

Then you have ZERO ability to differentiate between:
- A strong team vs a weak team
- A home team playing a second game in two nights
- An elite goalie vs an average goalie
- A team on a winning streak vs losing streak

**Result:** Your model is fundamentally broken.

---

## WHERE THE MODEL FAILS MOST

### By Total Goals Range:

```
Games with 0-5 goals (High Variance)
├─ Actual Avg:      3.24 goals
├─ Predicted:       5.37 goals
├─ Error:           +2.13 goals (they score less than you expect)
└─ RMSE:            2.28 ❌ LARGE ERROR

Games with 5-6 goals (Your "Magic Zone")
├─ Actual Avg:      5.00 goals
├─ Predicted:       5.39 goals
├─ Error:           +0.39 goals (close!)
└─ RMSE:            0.42 ✅ GOOD

Games with 7+ goals (High Variance)
├─ Actual Avg:      8.30 goals
├─ Predicted:       5.41 goals
├─ Error:           -2.89 goals (they score MORE than you expect)
└─ RMSE:            3.24 ❌ HUGE ERROR
```

**Insight:** Your model works ONLY when games fall into the 5-6 goal range. 
High-scoring and low-scoring games destroy your accuracy.

### By Team (Top Failures):

```
WORST PREDICTIONS:
CBJ  - RMSE 2.146, Avg Error -0.591 goals
TBL  - RMSE 2.095, Avg Error -0.797 goals (under-predicts by 0.8!)
WSH  - RMSE 2.052, Avg Error -0.765 goals (under-predicts by 0.8!)
LAK  - RMSE 1.986, Avg Error -0.344 goals
SEA  - RMSE 1.929, Avg Error -0.281 goals

BEST PREDICTIONS:
CGY  - RMSE 1.453, Avg Error -0.211 goals
ANA  - RMSE 1.479, Avg Error -0.119 goals
MTL  - RMSE 1.499, Avg Error -0.376 goals
```

**Insight:** Your model CONSISTENTLY under-predicts (negative errors).
This means your xG rates are TOO LOW or your calibration is broken.

### By Month:

```
October 2024  - RMSE 2.737 (early season, worst)
November 2024 - RMSE 2.331
December 2024 - RMSE 2.218
January 2025  - RMSE 2.221
February 2025 - RMSE 2.421
March 2025    - RMSE 2.437
April 2025    - RMSE 2.634 (end of season, bad again)
```

**Insight:** Worst in October and April. Could indicate:
- Season start data issues
- End of season data issues
- Sample size issues

---

## ROOT CAUSE ANALYSIS

### Hypothesis 1: "Flat Predictions" - CONFIRMED

**Evidence:**
- All predictions cluster at 50-55% win prob
- All predictions cluster at 5.37-5.41 total goals
- This is mathematically impossible for 1,312 diverse games

**Root Cause:** Your model is NOT differentiating teams enough.

### Hypothesis 2: "Underestimating Scoring" - CONFIRMED

**Evidence:**
- Average Error: -0.684 goals (you predict LOW)
- 74 games out of 100 you under-predict
- TBL/WSH: consistently -0.8 goals off

**Root Cause:** Your xG rates OR your calibration constant are wrong.

### Hypothesis 3: "Broken Calibration" - CONFIRMED

**Evidence:**
- Brier Score = 0.2500 (same as flipping coin)
- Win Accuracy = 43.75% (below 50% baseline)
- No spread in win probabilities

**Root Cause:** Your win probability formula is not calibrated to actual outcomes.

---

## WHAT THE IMPROVEMENTS CAN FIX

### Immediate.Plan Changes vs Current Issues:

| Change | Fixes What | Why It Matters |
|--------|-----------|---------------|
| Recency Weighting | "Flat Predictions" | Recent form differentiates teams |
| B2B/Rest Adjustments | "Flat Predictions" | Rest days create 3-4% scoring variance |
| Goalie Magnitude Scaling | "Under-predicting" | Elite goalies improve save %, weak hurt |
| League Calibration Constant | "Underestimating" | If constant is wrong, all predictions shift |
| EV Threshold | Doesn't fix, just filters | Only shows real edges (marginal gain) |

---

## THE WINNING SEQUENCE

If you implement from `immediate.plan.md` in this order:

### Phase 1: Fix Core (2-3 hours)
1. **Replace League Calibration Constant** (5 min)
   - Current: Dynamic 0.960
   - Should be: Fixed historical constant
   - Expected Impact: Shift ALL predictions up by ~1-3%

2. **Scale Goalie Impact by GSAE Magnitude** (30 min)
   - Current: Binary ±10 threshold (broken)
   - Should be: Linear scaling (0.1% per GSAE point)
   - Expected Impact: +0.1-0.3 goal spread on goalie-dependent games

### Phase 2: Add Differentiation (4-6 hours)
3. **Add Recency Weighting** (2-3 hours)
   - Use nhl-202526-asplayed.csv (dates + scores)
   - Blend recent form (60%) + season (40%)
   - Expected Impact: Spread predictions to 48-65% (not 50-55%)

4. **Add B2B/Rest Adjustments** (2-3 hours)
   - Calculate days rest from game history
   - B2B = -3% goals, Rest >= 2 = +4%
   - Expected Impact: Additional 1-2% spread, fix Oct/Apr variance

### Phase 3: Validate (1 hour)
5. **Rerun Backtest** (5 min)
   - Compare Brier before/after
   - Compare RMSE before/after
   - Check calibration curve

---

## REALISTIC EXPECTATIONS

### Conservative Estimate:
```
Current:   Brier 0.2500, RMSE 2.409
Target:    Brier 0.2300, RMSE 2.100
Expected:  Brier 0.2350, RMSE 2.250 (modest improvement)
```

### Optimistic (if all changes synergize):
```
Current:   Brier 0.2500, RMSE 2.409
Target:    Brier 0.2300, RMSE 2.100
Expected:  Brier 0.2250, RMSE 2.050 (meaningful improvement)
```

### The Reality:
- These changes are **necessary but not sufficient**
- Brier 0.2300 is still just "above average"
- You need REAL edge to beat Vegas (these just reduce variance)

---

## NEXT ACTION

**Option A: Implement Immediate.Plan changes**
- Effort: 5-7 hours
- Expected Gain: 3-5% improvement
- Data: Already in project

**Option B: Deeper diagnostics first**
- Check: Are your xG rates correct?
- Check: Is your regression-to-mean too aggressive?
- Check: Is your home-field adjustment right?

---

## THE HONEST ASSESSMENT

Your model is **currently worse than a baseline that always predicts "6 goals, 50% home win"**.

The improvements in `immediate.plan.md` are **real and necessary**, but they're:
- ✅ Feasible
- ✅ Data-backed
- ❌ NOT a silver bullet
- ❌ Only get you to "competent", not "professional"

**The question is:** Do you want to fix it or replace it?

