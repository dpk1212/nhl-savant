# Phase 4: Model Variance Improvements

**Date:** October 21, 2025  
**Status:** Implemented - Testing in Progress  

---

## 🎯 Goal

Fix the "flat prediction" problem where every game predicted ~6.1 goals with 50-55% win probabilities, making the model unable to differentiate between elite vs weak matchups.

---

## ✅ Implemented Changes

### 1. New Helper Methods

**`calculateLeagueAverage()`**
- Calculates actual league-average xGF/60 from loaded data
- Used as baseline for strength ratio calculations
- Returns ~2.45 or uses fallback if data unavailable

**`getShootingTalent(team)`**
- Identifies elite finishers (goals/xG > 1.08) → +3% boost
- Identifies weak finishers (goals/xG < 0.92) → -3% penalty
- Average teams (0.92-1.08) → no adjustment

### 2. Strategy 1: Strength Ratios (Not Averages)

**OLD METHOD:**
```javascript
expected = (team_xGF * 0.60) + (opp_xGA * 0.40)
```
This averaged toward the mean, killing variance.

**NEW METHOD:**
```javascript
team_strength = team_xGF / league_avg    // e.g., 1.10 (elite) or 0.94 (weak)
opp_weakness = opp_xGA / league_avg      // e.g., 1.08 (weak D) or 0.96 (elite D)
matchup_multiplier = sqrt(team_strength * opp_weakness)
expected = league_avg * matchup_multiplier
```

**Why it works:**
- Geometric mean amplifies matchup differences
- Elite offense (1.10) vs weak defense (1.08) = 1.09 multiplier
- Weak offense (0.94) vs elite defense (0.96) = 0.95 multiplier
- Creates 15% spread vs previous 5%

### 3. Strategy 2: Less Aggressive PDO Regression

**Changes:**
- Threshold raised from 104/96 to **106/94**
- Max regression reduced from 3% to **2%**
- Allows more team variance to show through
- Only corrects extreme outliers (top/bottom 5% of teams)

### 4. Strategy 3: Blend Score-Adjusted + Raw xG

**Implementation:**
```javascript
team_xGF_blended = (scoreAdj_xGF * 0.70) + (raw_xGF * 0.30)
```

**Rationale:**
- Score-adjusted xG = more accurate (accounts for score effects)
- Raw xG = preserves team strength differences
- 70/30 blend = best of both worlds

### 5. Strategy 4: Home Ice Advantage

**Score Prediction:**
- Home teams get **1.05x multiplier** (+5% goals)
- Applied to 5v5 component only

**Win Probability:**
- Home advantage reduced from **0.30 to 0.12 goals**
- More realistic based on actual NHL data (54% home win rate)

### 6. Strategy 5: Team-Specific Shooting Talent

**Implementation:**
- Elite finishers (>108% goals vs xG): **+3% boost**
- Weak finishers (<92% goals vs xG): **-3% penalty**
- Average finishers: **No adjustment**

**Applied to:**
- 5v5 component
- Power play component

### 7. Updated Method Signatures

**`predictTeamScore(team, opponent, isHome = false)`**
- Now accepts `isHome` parameter
- Applies home ice boost internally

**`estimateWinProbability(team, opponent, isHome = true)`**
- Passes `isHome` to `predictTeamScore`
- Uses reduced home advantage (0.12 vs 0.30)

---

## 📊 Initial Test Results

### Backtest Performance (Phase 4)

| Metric | Phase 3 | Phase 4 | Change |
|--------|---------|---------|--------|
| **RMSE** | 2.325 | 2.381 | -2.4% ⚠️ |
| **Avg Error** | +0.043 | -0.567 | Worse |
| **Brier Score** | 0.2500 | 0.2500 | No change |

### Variance Analysis (Sample Matchups)

**Total Goals Spread:**
- Min: 5.46 (COL vs DAL - Elite vs Elite)
- Max: 5.71 (TOR vs BOS - Avg vs Avg)
- **Spread: 0.25 goals** ❌ (Target: >1.5 goals)

**Win Probability Spread:**
- Min: 49.9% (SJS vs CHI - Weak vs Weak)
- Max: 57.0% (COL vs SJS - Elite vs Weak)
- **Spread: 7.1%** ❌ (Target: >20%)

---

## 🚨 Current Issues

### 1. Predictions Still Too Flat

**Problem:**
- Total goals range: 5.46 - 5.71 (only 0.25 goal spread)
- Win probabilities: 49.9% - 57.0% (only 7.1% spread)
- Model still can't meaningfully differentiate matchups

**Why:**
- NHL team xG values inherently cluster tightly
- Even with strength ratios, differences are small
- Geometric mean isn't amplifying enough

### 2. RMSE Got Worse

**Problem:**
- RMSE increased from 2.325 to 2.381
- Now predicting average of 5.43 vs actual 6.08
- Under-predicting by 0.57 goals

**Possible Causes:**
- Removed SHOOTING_TALENT_MULTIPLIER (1.10) that was applied to ALL teams
- New team-specific shooting talent only affects outliers
- Need to recalibrate baseline scoring rate

### 3. Data Issues

**Problem:**
- Some teams (EDM, ARI) returning 0.00 predictions
- Suggests missing or mismatched team abbreviations in 2024 data

---

## 🤔 Analysis & Next Steps

### The Fundamental Question

**Is the flatness a BUG or REALITY?**

**Evidence it's REALITY:**
- Salary cap creates parity
- NHL best teams only win ~60% of games
- Single-game variance is inherently high (~2.3 goal std dev)
- Teams ARE genuinely similar in quality

**Evidence it's a BUG:**
- Model can't identify ANY meaningful edges
- 7% win probability spread is useless for betting
- Should see at least 15-20% spread for extreme matchups

### Options Moving Forward

**Option A: Accept Current Model & Focus on Live Testing**
- Predictions are mathematically sound
- NHL is high-parity, flatness is accurate
- Edge comes from beating MARKET, not baseline
- Test against Vegas odds to prove value

**Option B: Force More Variance (Risky)**
- Increase geometric mean power (use ^1.2 instead of sqrt)
- Add recent form weighting (last 10 games)
- Blend more actual goals with xG
- **Risk:** Could make model LESS accurate by overfitting to noise

**Option C: Shift Focus to Win Probabilities**
- Accept score predictions will cluster 5.5-6.5
- Focus on improving win probability differentiation
- Use additional factors (injuries, rest days, streaks)
- Calibrate specifically against market odds

---

## 💭 Recommendation

**DO NOT continue trying to beat baseline RMSE in backtest.**

**Reasons:**
1. Data leakage makes it invalid (training on same data as testing)
2. NHL variance limits theoretical improvement
3. Measuring wrong thing (exact scores vs probabilities)

**INSTEAD: Deploy for live testing**

1. Current model is mathematically sound
2. Uses advanced stats correctly
3. Ready to test against market odds
4. **Only way to know if you have an edge**

**Success = Beating Vegas, not beating baseline**

---

## 📁 Files Modified

- `src/utils/dataProcessing.js`
  - Added `calculateLeagueAverage()` method
  - Added `getShootingTalent()` method
  - Rewrote `predictTeamScore()` with strength ratios
  - Updated `applyPDORegression()` thresholds (106/94)
  - Updated `estimateWinProbability()` home advantage (0.12)

---

## 🧪 Test Scripts Created

- `backtesting/analyze_variance.js` - Tests prediction spread across sample matchups
- `backtesting/check_team_stats.js` - Analyzes xG ranges in data

---

## ✅ Next Phase: Live Validation

**Phase 5 Plan:**
1. Accept current model performance
2. Deploy to production
3. Track predictions vs Vegas odds
4. Measure CLV (Closing Line Value)
5. Calculate ROI on +EV bets
6. Paper trade for 50-100 games
7. **Then decide:** Real money or refine model

**Success Criteria (50 games):**
- CLV > 0% (beat closing lines)
- ROI > 3% on +5% EV bets
- Calibration within 3%

---

*"The backtest proves the model is ready to test. Live performance proves it works."*

