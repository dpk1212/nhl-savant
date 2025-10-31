# TOTALS MODEL ROOT CAUSE ANALYSIS

**Date:** 2025-10-31  
**Status:** 🔴 **MODEL ARCHITECTURE FUNDAMENTALLY FLAWED**

---

## The Brutal Truth

Your totals model has **RMSE of 2.40 goals** on a ~6 goal average game. That's a **40% error rate**. It's completely unusable for profitable betting.

## Root Cause: Over-Regression to Mean

The model is **regressing everything towards 6 goals total**:

### The Problem in Action

| Game Type | What Happens | Actual | Predicted | Error |
|-----------|--------------|---------|-----------|-------|
| **High-Scoring** (>7 goals) | Model pulls DOWN to 6 | 9-12 goals | ~6 goals | **-3.27 goals** |
| **Low-Scoring** (<5 goals) | Model pulls UP to 6 | 1-4 goals | ~6 goals | **+2.87 goals** |
| **Average** (5-7 goals) | Model gets it right | 5-7 goals | ~6 goals | Small error |

**Result:** The model can't predict extreme games. It's blind to game pace and style.

---

## Diagnostic Results

### Overall Performance
- **RMSE:** 2.396 goals
- **Average Bias:** -0.168 goals (slight under-prediction)
- **Average Absolute Error:** 1.898 goals

### Breakdown by Game Type

| Type | Count | RMSE | Bias | Problem |
|------|-------|------|------|---------|
| **High-Scoring (>7)** | 34 games | **3.574** | **-3.274** | Massive under-prediction |
| **Low-Scoring (<5)** | 27 games | **3.035** | **+2.867** | Massive over-prediction |
| **Average (5-7)** | 68 games | **1.2-1.5** (est) | ~0 | Accurate |

### Team-Specific Issues

| Team | Games | Bias | RMSE | Pattern |
|------|-------|------|------|---------|
| OTT | 9 | -2.25 | 3.36 | Always under-predicts |
| STL | 9 | -1.71 | 3.09 | Always under-predicts |
| NYR | 9 | +2.07 | 2.99 | Always over-predicts |
| WSH | 9 | +1.47 | 2.81 | Always over-predicts |

### Worst Predictions

| Game | Actual | Predicted | Error | Why? |
|------|--------|-----------|-------|------|
| NJD @ COL | **12** | 5.65 | -6.35 | High-scoring pulled down to average |
| OTT @ BUF | **12** | 5.86 | -6.14 | High-scoring pulled down to average |
| WSH @ DAL | **1** | 6.73 | +5.73 | Low-scoring pulled up to average |
| WSH @ NYR | **1** | 6.14 | +5.14 | Low-scoring pulled up to average |

---

## Why This Happens: The Model Architecture

### Current Formula (Simplified)

```
1. Get xGF_per60 and xGA_per60 (score-adjusted) ✅ GOOD
2. Regress heavily towards league average (~3 goals/team) ❌ TOO AGGRESSIVE
3. Apply 40/60 weighting (offense/defense) ✅ GOOD
4. Add home ice advantage (+5.8%) ✅ GOOD
5. Add goalie adjustment ⚠️ WEAK
6. Add situational adjustments (B2B, rest) ⚠️ INCOMPLETE

RESULT: Everything regresses to ~6 total goals
```

### The Specific Problems

#### Problem 1: Over-Aggressive Regression
```javascript
// dataProcessing.js line 332-336
const team_xGF_regressed = this.applyRegressionToMean(
  team_xGF_raw, 
  league_avg, 
  gamesPlayed
);
```

**Issue:** Early in the season, this pulls EVERY team towards league average. But some teams (COL, NYR, etc.) are genuinely high-scoring. Others (BOS, STL) are genuinely defensive.

**Result:** Can't predict extreme games because it doesn't trust team identity.

#### Problem 2: No Game Pace Factor
The model doesn't account for:
- **Fast-paced teams** (COL, EDM) that create more chances
- **Defensive traps** (BOS, STL) that slow games down
- **Matchup effects** (Fast vs Fast = high-scoring, Trap vs Trap = low-scoring)

#### Problem 3: Weak Goalie Adjustments
```javascript
// dataProcessing.js line 495
const baseAdjustment = 1 + (goalieGSAE * 0.003);
// Elite goalie (+12 GSAE) = only 3.6% reduction
```

**Issue:** A Vezina-caliber goalie should reduce scoring by 10-15%, not 3.6%.

#### Problem 4: Missing Critical Factors
- ❌ No injury data
- ❌ No recent form (beyond regression)
- ❌ No head-to-head history
- ❌ No game importance/motivation
- ❌ No Vegas line as reality check

---

## Concrete Action Plan

### Priority 1: Fix Regression Logic (CRITICAL)
**Current:** Regresses to league average based on games played  
**Problem:** Doesn't account for team style/identity  
**Fix:** Use "true talent" estimate instead of raw league average

```javascript
// NEW APPROACH
function getTrueTalent(team, stat, gamesPlayed) {
  const leagueAvg = 3.0; // goals per game
  const teamAvg = team[stat];
  
  // Regress based on sample size AND variance
  // High-variance teams (COL, EDM) regress less
  // Low-variance teams (defensive) regress less
  const sampleWeight = Math.min(gamesPlayed / 25, 1.0);
  const styleWeight = getTeamStyleFactor(team); // 0.8-1.2
  
  return (teamAvg * sampleWeight * styleWeight) + 
         (leagueAvg * (1 - sampleWeight));
}
```

### Priority 2: Add Game Pace Factor
**Why:** Fast teams vs Fast teams = 8+ goals, Defensive vs Defensive = 4 goals

```javascript
function getGamePaceFactor(teamA, teamB) {
  const teamA_pace = teamA.shotsFor_per60 + teamA.shotsAgainst_per60;
  const teamB_pace = teamB.shotsFor_per60 + teamB.shotsAgainst_per60;
  
  const combinedPace = (teamA_pace + teamB_pace) / 2;
  const leagueAvg_pace = 60; // shots per game
  
  // High pace (70+) = 1.15x multiplier
  // Low pace (50-) = 0.85x multiplier
  return combinedPace / leagueAvg_pace;
}
```

### Priority 3: Strengthen Goalie Impact
**Current:** Elite goalie = 3.6% reduction  
**Industry Standard:** Elite goalie = 10-15% reduction

```javascript
function getGoalieAdjustment(gsae) {
  // GSAE ranges from -15 to +15
  // +15 (elite) should reduce by 12%
  // -15 (AHL-level) should increase by 12%
  
  return 1 + (gsae * 0.008); // 0.8% per GSAE point
}
```

### Priority 4: Add Matchup-Specific Adjustments
- **Head-to-head history:** Some teams match up differently
- **Division familiarity:** Teams know each other better
- **Recent meetings:** Revenge/rivalry factor

---

## Testing Plan

### Step 1: Baseline Current Performance
✅ **DONE:** RMSE 2.396 goals

### Step 2: Test Each Improvement
- Test regression fix: Target RMSE < 2.0
- Test pace factor: Target RMSE < 1.8
- Test goalie fix: Target RMSE < 1.6
- Test matchup adjustments: Target RMSE < 1.5

### Step 3: Validate on Hold-Out Data
- Test on 2024-25 full season (if available)
- Ensure no overfitting

### Step 4: Compare to Vegas
- Get historical Vegas totals lines
- Calculate if your predictions beat Vegas
- **If not:** Use Vegas as baseline, only bet when you have edge

---

## Success Criteria

### Minimum Acceptable
- **RMSE < 1.8 goals**
- **Bias within ±0.1 goals**
- **Better than Vegas on 55%+ of games**

### Professional Grade
- **RMSE < 1.5 goals**
- **Bias within ±0.05 goals**
- **Better than Vegas on 60%+ of games**
- **Positive ROI on theoretical bets**

---

## Recommendation

### SHORT TERM (This Week)
1. **STOP BETTING TOTALS** with current model
2. Implement Priority 1 (regression fix)
3. Implement Priority 2 (pace factor)
4. Test on 129 completed games
5. If RMSE drops below 1.8, cautiously resume totals betting

### MEDIUM TERM (Next 2 Weeks)
1. Get historical Vegas lines
2. Compare your predictions to Vegas
3. Only bet when edge > 0.5 goals
4. Track ROI separately

### LONG TERM (Rest of Season)
1. Collect more data on what works
2. Iterate on model improvements
3. Consider machine learning approach
4. **Focus on moneyline** (your 64.7% win rate is elite)

---

## The Bottom Line

Your current totals model is **not competitive for betting**. The 2.40 RMSE means you're essentially guessing. 

**However:** The diagnosis is clear. The fixes are concrete. With focused improvements, you can get RMSE down to 1.5-1.8 goals, which is betting-viable.

**Alternative:** Stick to moneyline betting where you're actually good. A 64.7% win rate is elite. Don't force totals betting if the model can't be fixed.

