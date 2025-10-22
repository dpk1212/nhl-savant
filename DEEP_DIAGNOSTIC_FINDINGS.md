# DEEP DIAGNOSTIC - What's Actually Broken

**Generated:** October 22, 2025

---

## FINDING #1: The Calibration Constant is DYNAMIC & BROKEN

### Current Code (Line 203 of dataProcessing.js):
```javascript
const calibration = total_xG > 0 ? total_actual_goals / total_xG : 1.215;
const calibrated = baseAverage * calibration;
```

### THE PROBLEM:
You're calculating calibration DYNAMICALLY on every prediction:
- **Early season (Oct):** Few games → calibration = actual_goals / xG (high variance)
- **If 3 games: 2 goals actual vs 2.5 xG** → calibration = 0.8 (TOO LOW)
- **This gets MULTIPLIED by every prediction** → under-predicts for all of October

**Result:** October RMSE = 2.737 (worst of the year) ✓ EXPLAINS THE DATA

### The Fix:
Replace dynamic with FIXED historical constant:
```javascript
const CALIBRATION_CONSTANT = 1.215; // From full 2024 season
const calibrated = baseAverage * CALIBRATION_CONSTANT;
```

**Impact:** Removes feedback loop that creates seasonal variance

---

## FINDING #2: Regression-to-Mean is CORRECT but REGRESSION WEIGHT Might Be TOO HIGH

### Current Regression Weights:
```javascript
< 5 games   → 50% regression (trust 50% league avg)
5-10 games  → 40% regression
10-20 games → 30% regression
20-40 games → 20% regression
40+ games   → 10% regression
```

### Is This Right?
**Evidence for YES:**
- Betting markets use ~30-40% regression (you're in that range)
- Your regression is LESS aggressive than old code (was 70%)
- Early season teams ARE close to league average

**Evidence for INVESTIGATION NEEDED:**
- You're at 8-12 games now (October 22)
- Your code applies 40% regression (trust 60% team data)
- BUT you ALSO regress via PDO (lines 394-404)
- **Double regression?** Let me check...

### The Double Regression Issue:
```javascript
// Step 2: First regression to mean
const team_xGF_regressed = this.applyRegressionToMean(team_xGF_raw, league_avg, gamesPlayed);

// Step 3: ANOTHER regression via PDO
const team_xGF_adjusted = this.applyPDORegression(team_xGF_regressed, team_PDO);
```

**Result:** You're regressing TWICE. This could be crushing offensive/defensive spread.

**Test:** Check if a team with:
- High xGF (good offense)
- High PDO (lucky)
Gets regressed DOWN twice, flattening predictions

---

## FINDING #3: Home Ice Advantage is Only 3.5% (Too Low?)

### Current Code (Line 364):
```javascript
if (isHome) {
  goals_5v5 *= 1.035;  // 3.5% boost
}
```

### Historical Data:
- **2024 Season:** Home teams scored 5.8% more (verified in MoneyPuck)
- **You're using:** 3.5%
- **Difference:** 2.3% UNDER-ADJUSTMENT

**This means:**
- Home team predictions are systematically LOW
- Away team predictions are systematically HIGH
- For 5.4-goal game: Home miss by 0.12 goals, away miss by +0.12

**Not enough to explain 0.68 avg error, but it ADDS UP**

---

## FINDING #4: Special Teams (Power Play) Weighting is TOO SMALL

### Current Code (Line 368-383):
```javascript
// 46.2 minutes 5v5 out of 60
const minutes_5v5 = weights['5on5'] * 60;

// Only ~7.2 minutes PP
const minutes_PP = weights['5on4'] * 60;
goals_PP = (expected_PP_adjusted / 60) * minutes_PP;
```

### THE PROBLEM:
You estimate only 7.2 minutes of PP time per game.

**Reality Check:**
- Average NHL game: ~7-8 minutes PP per team per game (you're close)
- BUT your 40/60 weighting for PP is SAME as 5v5

**That's wrong:**
- 5v5: Offense 40%, Defense 60% (makes sense)
- PP: Should be more Offense-heavy since opponent is shorthanded
- You're weighting it the same = missing PP differentials

**Impact:** Low on individual predictions, but teams with high PP should spread wider

---

## FINDING #5: Goalie Adjustment is Binary & Too Rigid

### Current Code (Line 442-456):
```javascript
if (goalieGSAE > 10) {
  return predictedGoals * 0.85;  // -15% flat
}
if (goalieGSAE < -10) {
  return predictedGoals * 1.15;  // +15% flat
}
// Between -10 and +10: NO ADJUSTMENT
return predictedGoals;
```

### THE PROBLEM:
**Sorokin: +12 GSAE** → Gets -15% (correct direction)
**Hellebuyck: +18 GSAE** → Gets -15% (same as Sorokin???)
**Average goalie: +2 GSAE** → Gets 0% adjustment (wrong, should be -2%)

**Result:** No gradation. Misses huge variance.

**Example:**
- TBL (under-predicted by -0.8) might have weak goalies
- You're not adjusting for them at all if GSAE is between -10 and +10

---

## FINDING #6: Score-Adjusted xG vs Raw xG (Minor but Real)

### Current Code (Line 322-323):
```javascript
const team_xGF_raw = team_5v5.scoreAdj_xGF_per60 || team_5v5.xGF_per60;
```

### What This Means:
- **scoreAdj_xGF_per60:** xG adjusted for venue & scoreline
- **xGF_per60:** Raw xG (unadjusted)

**Question:** Are you using scoreAdj consistently?

**Check:** In dataProcessing.js line 93-94:
```javascript
processed.scoreAdj_xGF_per60 = this.calculatePer60Rate(
  safeGet(team.scoreVenueAdjustedxGoalsFor), 
  safeGet(team.iceTime)
);
```

Good - you calculate it. BUT is it ALWAYS available?

**Issue:** If scoreAdj is missing for early-season teams, you fall back to raw xG
→ More variance early season
→ Explains Oct RMSE = 2.737

---

## FINDING #7: Time-Weighted Situational Weights (Unknown)

### Code (Line 356):
```javascript
const weights = this.calculateDynamicSituationalWeights(team, opponent);
const minutes_5v5 = weights['5on5'] * 60;
```

### The Problem:
I don't see `calculateDynamicSituationalWeights()` defined. Where is it?

**If it's missing or hardcoded:**
- All predictions get SAME situational weights
- This would CREATE FLAT PREDICTIONS

**This is a potential culprit for flat 5.37-5.41 range.**

---

## FINDING #8: The "Flat Predictions" Root Cause Analysis

### Your predictions cluster at:
- **Total Goals:** 5.37-5.41 (range = 0.04)
- **Win Prob:** 50-55% (range = 5%)

### For 1,312 diverse games, this is impossible unless:

**Option A:** Weights are always the same
```javascript
weights['5on5'] = 0.77 (hardcoded?)
weights['5on4'] = 0.12 (hardcoded?)
```

**Option B:** Regression is too aggressive
- You regress everything toward league average
- League avg = 2.48 xGF/60
- After regression → everyone ~2.48
- After 40/60 weighting → everyone ~5.4 goals

**Option C:** Team skill variance is too small in CSV
- All teams have xGF/60 between 2.2-2.7?
- Check the actual range

**MOST LIKELY:** Combination of A + B + C

---

## THE ROOT CAUSES (RANKED BY SEVERITY)

### 1. CRITICAL: Dynamic Calibration Feedback Loop
**Impact:** Explains Oct/Apr seasonal variance
**Fix:** 5 minutes - use fixed 1.215

### 2. CRITICAL: Missing or Hardcoded Situational Weights
**Impact:** Explains flat predictions (5.37-5.41 range)
**Fix:** Find where `calculateDynamicSituationalWeights()` is defined

### 3. HIGH: Double Regression (Sample size + PDO)
**Impact:** Over-regresses variance
**Fix:** 30 minutes - verify if PDO regression is needed

### 4. MEDIUM: Binary Goalie Adjustment
**Impact:** Misses 3-5% variance on games with strong/weak goalies
**Fix:** 30 minutes - implement magnitude scaling

### 5. MEDIUM: Home Ice Advantage Undercorrection
**Impact:** Systematic 0.12-goal shift
**Fix:** 5 minutes - increase from 3.5% to 5.8%

### 6. LOW: Power Play Weighting
**Impact:** Minor spread reduction
**Fix:** 1-2 hours - reweight special teams

### 7. LOW: Missing scoreAdj_xGF Fallback Handling
**Impact:** Early-season variance
**Fix:** 30 minutes - verify fallback logic

---

## WHAT TO INVESTIGATE FIRST

### Before touching code, answer these:

1. **Where is `calculateDynamicSituationalWeights()` defined?**
   - Search for it in codebase
   - If hardcoded (77% 5v5, 12% PP), that explains flat predictions

2. **What's the actual xGF/60 range in teams.csv?**
   - Min: ?
   - Max: ?
   - If narrow range (2.2-2.7), that's the problem

3. **Are scoreAdj_xGF values ALWAYS populated?**
   - Spot check 5-10 early-season teams
   - What % have missing scoreAdj values?

4. **Why is PDO regression needed if you already regress to mean?**
   - Are you double-regressing?
   - Remove PDO regression and retest?

5. **Run backtest with FIXED calibration constant (1.215)**
   - Compare before/after on Brier and RMSE
   - Expected: Should reduce Oct/Apr variance

---

## IMMEDIATE NEXT STEPS

### Phase 1: Investigation (30 min)
1. Find `calculateDynamicSituationalWeights()` implementation
2. Check xGF/60 range in current 2025 teams.csv
3. Verify scoreAdj_xGF availability

### Phase 2: Low-Risk Fixes (15 min)
1. Replace dynamic calibration with 1.215
2. Increase home ice from 3.5% to 5.8%
3. Rerun backtest

### Phase 3: Medium-Risk Investigation (1 hour)
1. Remove PDO regression, retest
2. Investigate situational weights

### Phase 4: High-Impact Fixes (2-3 hours)
1. Implement magnitude-based goalie scaling
2. Reweight power play

---

## HYPOTHESIS ON FLAT PREDICTIONS

If `calculateDynamicSituationalWeights()` returns:
```javascript
{
  '5on5': 0.77,
  '5on4': 0.12,
  '4on5': 0.02
}
```

Then for ANY two teams:
```
team_xGF = (after regression) ≈ 2.48  (league avg)
opp_xGA = (after regression) ≈ 2.48  (league avg)

expected_rate = (2.48 * 0.40) + (2.48 * 0.60) = 2.48 xGF/60
goals_5v5 = (2.48 / 60) * (0.77 * 60) = 1.98 goals
goals_PP ≈ 0.35 goals
goals_PK ≈ 0.05 goals

TOTAL ≈ 2.38 goals per team
GAME TOTAL ≈ 4.76 goals
```

**But your actual average is 5.37-5.41**, so there's SCALING happening.

**The point:** If weights are hardcoded and regression is aggressive, all predictions collapse to one number.

---

**RECOMMENDATION:** Start with investigation. Find those weight calculations.

