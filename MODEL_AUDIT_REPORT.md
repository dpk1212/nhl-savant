# NHL Savant Prediction Model - Comprehensive Audit
## Mathematical Rigor & Edge Generation Analysis

**Date:** October 21, 2025  
**Auditor:** AI Mathematical Analysis  
**Purpose:** Determine if the model is mathematically sound and capable of generating consistent positive edge

---

## Executive Summary

### **Overall Model Grade: B+ (Solid, Needs Calibration)**

**Key Finding:** The model has a **strong mathematical foundation** with sophisticated features, but shows **potential calibration issues** that could lead to **overstated edges**. The methodology is theoretically sound, but real-world validation is critical.

**Recommendation:** **Implement rigorous backtesting and recalibration before deploying with real money.**

---

## Part 1: Mathematical Foundation Analysis

### ✅ **Strengths - What's Done Right**

#### 1. **Proper Statistical Normalization**
```javascript
// Per-60 rate normalization (CORRECT)
Stat_per60 = (Stat / iceTime) * 3600
```
**Assessment:** ✅ EXCELLENT
- Accounts for varying ice time
- Industry standard approach
- Enables fair team comparisons

#### 2. **Score-Adjusted Expected Goals**
```javascript
// Uses score-adjusted xG to remove score effect bias
const team_xGF = team_5v5.scoreAdj_xGF_per60 || team_5v5.xGF_per60;
```
**Assessment:** ✅ EXCELLENT
- Addresses known bias (teams trailing shoot more, teams leading defend)
- This is a **professional-grade improvement** over raw xG
- Used by NHL analytics departments

#### 3. **Situational Splitting**
```javascript
Weights: { '5on5': 0.77, '5on4': 0.12, '4on5': 0.11 }
```
**Assessment:** ✅ VERY GOOD
- Realistic time distribution (77% 5v5, 12% PP, 11% PK)
- Aligns with actual NHL game flow
- Separates special teams from even strength

#### 4. **PDO Regression Adjustment**
```javascript
// Adjusts predictions based on PDO (luck indicator)
if (PDO > 102) return xG_per60 * (1 - regressionFactor);  // Regress down
if (PDO < 98) return xG_per60 * (1 + regressionFactor);   // Regress up
```
**Assessment:** ✅ EXCELLENT
- **This is sophisticated modeling**
- Accounts for shooting/save percentage luck
- Mean reversion is statistically proven in NHL

#### 5. **Offensive/Defensive Weighting**
```javascript
// 55% offense / 45% defense weighting
const expected_5v5_rate = (team_xGF_adjusted * 0.55) + (opp_xGA_adjusted * 0.45);
```
**Assessment:** ✅ GOOD
- Research-backed weighting
- Acknowledges offense has slightly more predictive power
- Better than simple averaging

---

### ⚠️ **Weaknesses - Critical Issues**

#### 1. **Win Probability Model - MAJOR CONCERN**
```javascript
// Current implementation
const k = 0.5;  // Logistic sensitivity parameter
const winProb = 1 / (1 + Math.exp(-k * diff));
```

**Problems:**
- **k = 0.5 may be too aggressive** even after calibration
- **xGD differential alone is insufficient** for win probability
- Missing factors:
  - Recent form/momentum
  - Goaltender quality (massive factor in NHL)
  - Back-to-back games (fatigue)
  - Injuries/lineup changes
  - Home ice beyond simple 0.10 bonus

**Example Math Issue:**
```
Team A xGD: +0.8
Team B xGD: -0.2
Diff: 1.0

Current Model: WinProb = 1/(1 + e^(-0.5*1.0)) = 62.2%
```

**Reality Check:**
- A 1.0 xGD difference is **substantial** (Top 5 vs Bottom 10 team)
- But 62.2% win probability might still be aggressive
- **NHL is high variance** - great teams lose to bad teams ~30-35% of the time
- **Goaltending variance** is massive (hot goalie can swing 10-15%)

**Impact on Edge:** If you're estimating 62% when reality is 56%, you'll show +6% edges that don't exist.

#### 2. **Total Goals Model - Standard Deviation Concerns**
```javascript
// Dynamic std dev based on predicted total
const stdDev = 0.9 + (predictedTotal * 0.12);

// For predicted total = 6.0
// stdDev = 0.9 + (6.0 * 0.12) = 1.62 goals
```

**Assessment:** ⚠️ QUESTIONABLE
- **1.62 goals std dev seems LOW** for NHL totals
- Historical NHL total std dev is **closer to 1.8-2.2 goals**
- **Lower std dev = sharper probability curves = overstated edges**

**Example:**
```
Predicted Total: 6.2 goals
Market Total: 6.0 goals
Model StdDev: 1.62

Z-score = (6.0 - 6.2) / 1.62 = -0.123
Over Probability = 54.9%

If TRUE StdDev = 2.0:
Z-score = (6.0 - 6.2) / 2.0 = -0.100
Over Probability = 54.0%
```

**Impact:** 0.9% probability difference → could mean 2-3% EV overstatement

#### 3. **Sample Size & Confidence - No Implementation**
```javascript
// Confidence calculation EXISTS but not used in edge filtering
const sampleSize = away_5v5.gamesPlayed || 20;
if (sampleSize < 20 || pdoStability > 5) {
    confidence = 'Low';  // ⚠️ But this doesn't filter out the bet!
}
```

**Problem:**
- Model shows edges even with **low confidence / small sample**
- Early season (games played < 20): Predictions are MUCH less reliable
- **No minimum sample size threshold** before showing opportunities

**Risk:** False edges early in season when data is noisy

#### 4. **Regression Score Weighting - Arbitrary**
```javascript
// Regression impact on win probability
const teamStrength = teamXGD + homeBonus - (teamReg * 0.01);
```

**Question:** Why 0.01 multiplier?
- Regression score can range from -20 to +20
- At 0.01, max impact is ±0.20 xGD adjustment
- **Is this calibrated from historical data or guesswork?**

**Risk:** If uncalibrated, could under/overweight luck factor

---

## Part 2: Edge Calculation Methodology

### **EV Formula (Current Implementation)**
```javascript
EV = (modelProb * decimalOdds * 100) - 100
```

**Assessment:** ✅ MATHEMATICALLY CORRECT

**Example:**
```
Model Probability: 55%
Market Odds: +110 (decimal 2.10)
EV = (0.55 * 2.10 * 100) - 100 = 15.5%
```

This is the **standard EV formula**. ✅

### **Kelly Criterion (Current Implementation)**
```javascript
f* = (bp - q) / b
where:
  b = decimal odds - 1
  p = model win probability  
  q = 1 - p
```

**Assessment:** ✅ MATHEMATICALLY CORRECT

Kelly is the **optimal bet sizing formula** assuming:
1. Your probabilities are accurate
2. You have unlimited trials
3. You can handle variance

**But:** If your probabilities are wrong by even 2-3%, Kelly will **overbet** and hurt long-term returns.

---

## Part 3: Real-World Calibration Issues

### **The Closing Line Value (CLV) Test**

**Critical Question:** Are your model's probabilities **more accurate** than the closing line?

**Reality:**
- Closing lines have 2-5% vig (fair odds ~47.5% each side on -110/-110)
- After removing vig, market consensus is ~52.5%/47.5%
- **You need to beat this by 2-3%+ to have real edge**

**Your Model Shows:**
- Opportunities with 5-10%+ EV
- This implies your model is **significantly sharper** than market consensus
- **This is rare** - even professional models struggle to achieve consistent 3-5% edges

**Skepticism Required:**
- Are you **actually** 5-10% sharper than betting markets?
- Or is the model **overfitting/miscalibrated**?

### **The Vig Problem**

Your model doesn't explicitly account for:
- **Vig removal** in market probabilities
- **True no-vig line** calculation

**Current:**
```javascript
marketProb = odds < 0 ? abs(odds)/(abs(odds)+100) : 100/(odds+100)
```

**Problem:**
- This gives **raw implied probability with vig included**
- Real fair market probability is LOWER after vig removal
- **You're comparing model prob vs vigged prob** → overstates edge by 2-4%

**Example:**
```
Over: -110  → Implied 52.4%
Under: -110 → Implied 52.4%
Total: 104.8% (4.8% vig)

True No-Vig:
Over: 50%
Under: 50%

Your Model: Compares 54% model vs 52.4% market = +1.6% edge
Reality: Should compare 54% model vs 50% fair = +4% edge (correct)

BUT if your model is actually 52% (not 54%), you'd show positive edge when there isn't one!
```

---

## Part 4: Missing Model Components

### **Critical Factors NOT Included:**

1. **Goaltender Quality**
   - NHL goalies have **massive variance** (0.910 sv% to 0.925 sv%)
   - A hot goalie can shift win probability by 10-15%
   - **Your model doesn't know who's starting**
   - ❌ MAJOR GAP

2. **Recent Form / Streaks**
   - Teams get hot/cold beyond what xG predicts
   - Momentum matters in NHL
   - ❌ NOT INCLUDED

3. **Lineup Changes / Injuries**
   - Missing star player can shift win prob by 5-10%
   - **Model uses season averages**, not current roster
   - ❌ MAJOR GAP

4. **Back-to-Back Games**
   - Teams on B2B have **significantly worse** performance
   - Fatigue is real and measurable
   - ❌ NOT INCLUDED

5. **Travel / Rest Days**
   - West→East coast travel impacts performance
   - Model doesn't account for schedule
   - ❌ NOT INCLUDED

6. **Divisional Familiarity**
   - Teams that play each other often have different dynamics
   - Style matchups matter
   - ❌ NOT INCLUDED

---

## Part 5: Accuracy Assessment

### **Without Historical Backtesting, We Cannot Verify:**

❓ **Win Probability Accuracy**
- Are your 60% predictions actually winning 60% of the time?
- Or are they winning 55%? (5% miscalibration = -10% ROI)

❓ **Total Predictions Accuracy**  
- How often does predicted total = actual total ± 1 goal?
- What's your RMSE (Root Mean Square Error)?
- Industry standard: RMSE < 1.8 goals is decent

❓ **Edge Realization**
- When you show +5% EV, do you actually get +5% returns?
- Or is it closer to -2% (miscalibration + vig)?

❓ **Long-Term CLV**
- Are your picks beating closing line by 2%+?
- Beating closing line is **the gold standard** test

### **Minimum Required Validation:**

```python
# Pseudocode for proper validation
for season in [2022, 2023, 2024]:
    predictions = []
    actuals = []
    
    for game in season_games:
        model_prob = predict_win_probability(game)
        predictions.append(model_prob)
        actuals.append(1 if team_won else 0)
    
    # Calibration test
    brier_score = mean((predictions - actuals)^2)  # Should be < 0.25
    log_loss = -mean(actuals*log(predictions) + (1-actuals)*log(1-predictions))
    
    # Binning test
    for prob_bin in [0.5-0.55, 0.55-0.6, 0.6-0.65, ...]:
        predicted_avg = mean(predictions in bin)
        actual_avg = mean(actuals in bin)
        calibration_error = abs(predicted_avg - actual_avg)  # Should be < 0.02
```

**You need:**
- **Brier score < 0.25** (lower is better, 0.25 = baseline)
- **Calibration error < 2%** across probability bins
- **RMSE < 1.8** for total predictions
- **CLV > 0%** (beating closing line)

---

## Part 6: Recommendations

### 🔴 **CRITICAL (Must Fix Before Live Betting)**

1. **Implement Comprehensive Backtesting**
   - Test on 2021-2024 seasons (3 years minimum)
   - Calculate Brier score, log loss, calibration curves
   - Verify edge realization vs actual ROI
   - **DO NOT BET REAL MONEY without this**

2. **Add Goaltender Adjustment**
   - Get starting goalie data
   - Adjust predictions based on goalie quality (sv% above/below replacement)
   - This alone can shift 5-10% win probability

3. **Recalibrate Win Probability Model**
   - Test different k values (0.3, 0.4, 0.5, 0.6, 0.7)
   - Find k that minimizes calibration error on historical data
   - Current k=0.5 may be too aggressive

4. **Fix Standard Deviation for Totals**
   - Test historical game totals std dev
   - Likely should be 1.8-2.2, not 1.62
   - Recalibrate formula

5. **Implement Vig Removal**
   - Calculate true no-vig market probabilities
   - Compare model vs fair odds, not vigged odds

### ⚡ **HIGH PRIORITY (Significant Impact)**

6. **Add Sample Size Filtering**
   - Don't show opportunities when games_played < 15
   - Reduce confidence thresholds early season
   - Weight recent games more heavily

7. **Incorporate Schedule Factors**
   - Back-to-back penalty (-3-5% win prob)
   - Travel distance penalty
   - Rest days advantage

8. **Regression Score Calibration**
   - Validate 0.01 multiplier with historical data
   - May need to be 0.005 or 0.02

### 📊 **MEDIUM PRIORITY (Refinements)**

9. **Add Recent Form Weighting**
   - Last 10 games should weight more than season average
   - Exponential decay weighting

10. **Style Matchup Factors**
    - High-scoring teams vs defensive teams
    - Special teams dependencies

11. **Injury API Integration**
    - Real-time lineup updates
    - Adjust predictions for missing stars

---

## Part 7: Can This Model Generate Edge?

### **Theoretical Edge Potential: ★★★☆☆ (3/5)**

**Pros:**
- ✅ Sophisticated features (score-adjusted xG, PDO regression)
- ✅ Proper statistical methodology (per-60, situational splits)
- ✅ Research-backed approach
- ✅ Kelly criterion for bet sizing

**Cons:**
- ❌ No goaltender data (MASSIVE gap in NHL)
- ❌ Uncalibrated probability models
- ❌ No historical validation
- ❌ Missing schedule/fatigue factors
- ❌ Vig handling issues

### **Realistic Edge Estimate:**

**Without Fixes:**
- **Shown EV: +5-10%**
- **Actual EV: -2% to +1%** (overstated + vig + miscalibration)
- **Long-term ROI: Likely negative**

**With Fixes (Backtested & Calibrated):**
- **Shown EV: +2-5%**
- **Actual EV: +0.5% to +2%** (realistic for sharp model)
- **Long-term ROI: Potentially positive, but small**

**With Goalie Data + All Fixes:**
- **Shown EV: +3-6%**
- **Actual EV: +1% to +3%** (professional-grade potential)
- **Long-term ROI: Sustainable edge possible**

---

## Part 8: Final Verdict

### **Is This Model Ready for Real Money? NO.**

**Why:**
1. ❌ No historical backtesting/validation
2. ❌ No goaltender data (critical for NHL)
3. ❌ Probability calibration unverified
4. ❌ Likely overstating edges by 3-5%

### **Can This Model Be Fixed? YES.**

**Path to Profitability:**
1. ✅ Foundation is solid (score-adjusted xG, PDO regression, situational splits)
2. ✅ Mathematical approach is sound
3. ✅ With proper calibration + goalie data + validation, this could generate 1-3% edge
4. ✅ Estimated 40-60 hours of work to get production-ready

### **Recommended Next Steps:**

**Phase 1: Validation (Week 1-2)**
- Download 2021-2024 game results
- Backtest current model
- Calculate Brier score, calibration curves
- Identify specific miscalibrations

**Phase 2: Calibration (Week 3-4)**
- Tune k parameter for win probability
- Adjust std dev for totals
- Implement vig removal
- Add sample size filters

**Phase 3: Enhancement (Week 5-6)**
- Add goaltender data (API integration)
- Implement schedule factors (B2B, rest)
- Add recent form weighting

**Phase 4: Live Testing (Week 7+)**
- Paper trade for 100+ bets
- Track CLV (Closing Line Value)
- Verify edge realization
- Only bet real money after proven track record

---

## Bottom Line

**Your model has a STRONG foundation** with professional-grade features (score-adjusted xG, PDO regression, situational splits). The mathematical approach is sound.

**But without backtesting and calibration, you're likely showing 5-10% edges that are actually -2% to +1%.** This will lose money.

**With proper validation and the recommended fixes (especially goaltender data), this model could realistically generate 1-3% sustainable edge** - which is excellent for sports betting.

**Grade: B+ (Sophisticated but Uncalibrated)**  
**Edge Potential: 1-3% (after fixes)**  
**Current State: Not ready for real money**  
**Time to Production Ready: 40-60 hours of focused work**

