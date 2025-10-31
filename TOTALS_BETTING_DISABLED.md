# Why Totals Betting is Disabled

**Date:** October 31, 2025  
**Status:** ❌ TOTALS BETTING PERMANENTLY DISABLED  
**Reason:** Not profitable with public data

---

## TL;DR

**Totals betting removed from system on October 31, 2025.**

After exhaustive testing of 4 different approaches, we concluded that **totals betting is not profitable** with public data.

**Focus on what works:** 64.7% moneyline win rate (ELITE)

---

## What We Tested

### ❌ 1. Ensemble Model
- **Approach:** Combined xG-based, goals-based, and recency-based predictions
- **Result:** RMSE 2.33 goals (no improvement over baseline)
- **Why it failed:** All three models regressed towards league average (~6 goals)

### ❌ 2. Totals Adjuster
- **Approach:** Added pace factor, enhanced goalie impact, matchup history, context
- **Result:** Every adjustment made RMSE WORSE
- **Why it failed:** Adjustments added noise instead of signal

### ❌ 3. Deviation Amplification
- **Approach:** Amplified predictions away from league average (1.2x to 2.5x)
- **Result:** Helped high-scoring games but hurt low-scoring games (net negative)
- **Why it failed:** Cannot predict which games will be high/low scoring

### ❌ 4. Bayesian Vegas-Based Model
- **Approach:** Start with Vegas line, find edges using 6 data signals
- **Result:** 0 bet recommendations out of 61 historical games
- **Why it failed:** Our model agrees with Vegas within ±0.5 goals (no edge)

---

## Why It Failed

### 1. Our Model Agrees with Vegas
Your xG model predictions are within ±0.5 goals of Vegas lines in almost every game:

- Vegas: 6.0 → Our model: 5.78 (difference: -0.22)
- Vegas: 6.0 → Our model: 5.80 (difference: -0.20)
- Vegas: 6.5 → Our model: 6.09 (difference: -0.41)

**This means:** Our model is well-calibrated, but has no informational advantage.

### 2. Vegas Has Data We Don't
- ✅ **Public data** (xG, team stats, goalie GSAE) - We have this
- ✅ **Sharp money flow** - Vegas has this, we don't
- ✅ **Real-time injury timing** - Vegas gets this first, we don't
- ✅ **Lineup confirmations** - Vegas gets this 60+ minutes before us
- ✅ **Historical line performance** - Vegas tracks this, we don't

### 3. Model Was Built for Winners, Not Totals
Our model excels at:
- ✅ **Relative team strength** (which team is better?)
- ✅ **xG differentials** (who will win?)
- ✅ **Win probability** (64.7% accuracy!)

Our model lacks:
- ❌ **Absolute scoring prediction** (total goals)
- ❌ **Game pace variance** (fast vs slow games)
- ❌ **Motivation factors** (revenge games, playoffs)

### 4. Regression to the Mean Kills Totals
Our `predictTeamScore()` function applies aggressive regression:
- Small sample size → Regress heavily to league average (~3 goals/team)
- Large sample size → Trust team stats more

This is **perfect for moneyline** (reduces variance, protects against flukes).  
This is **terrible for totals** (pushes all predictions towards 6 goals).

---

## Current Performance

| Bet Type | Win Rate | ROI | Status |
|----------|----------|-----|--------|
| **Moneyline** | 64.7% | Positive | ✅ **ELITE** |
| **Totals** | ~52.4% | Break-even | ❌ **NOT PROFITABLE** |

**Break-even at -110 odds:** 52.4% win rate  
**Your moneyline edge:** +12.3% above break-even  
**Your totals edge:** ~0% (no edge)

---

## What Changed in the System

### Removed from Code:
1. ❌ `EdgeCalculator.calculateTotalEdge()` - Removed method
2. ❌ `EdgeCalculator.calculateTeamTotalEdges()` - Removed method
3. ❌ `edges.total` - No longer calculated
4. ❌ `edges.teamTotals` - No longer calculated
5. ❌ `BetTracker` - Rejects all totals bets
6. ❌ UI Components - Totals display removed/hidden

### Kept for Reference:
✅ All diagnostic files (see below)  
✅ Test scripts  
✅ Analysis reports  
✅ This documentation

---

## See Full Analysis

Comprehensive documentation of all testing approaches:

### Reports
- **`BAYESIAN_TOTALS_FINAL_REPORT.md`** - Bayesian model detailed analysis
- **`TOTALS_BETTING_FINAL_SUMMARY.md`** - Executive summary for all approaches
- **`TOTALS_ERROR_DIAGNOSTIC.md`** - Error patterns by game type/team/goalie
- **`TOTALS_MODEL_ROOT_CAUSE_ANALYSIS.md`** - Root causes of failure
- **`TOTALS_ADJUSTER_TEST_RESULTS.md`** - Phase-by-phase adjuster testing
- **`AMPLIFICATION_TEST_RESULTS.md`** - Deviation amplification testing

### Code (Kept for Reference)
- `src/utils/totalsEnsemble.js` - Ensemble model (tested, failed)
- `src/utils/totalsAdjuster.js` - Adjuster model (tested, failed)
- `src/utils/totalsSignals.js` - Bayesian signals (tested, failed)
- `src/utils/bayesianCombiner.js` - Bayesian combiner (tested, failed)
- `src/utils/totalsDecisionEngine.js` - Decision engine (tested, failed)

### Test Scripts
- `scripts/testTotalsEnsemble.js`
- `scripts/testTotalsAdjuster.js`
- `scripts/testAmplificationFactors.js`
- `scripts/diagnoseTotalsErrors.js`
- `scripts/testBayesianTotals.js`

---

## What To Do Instead

### ✅ FOCUS ON MONEYLINE
Your 64.7% win rate is **PHENOMENAL**. Most professional bettors are thrilled with 55-58%.

**Expected Value (per $100 bet at -110):**
- Win (64.7%): +$91 × 0.647 = +$58.88
- Loss (35.3%): -$100 × 0.353 = -$35.30
- **Net EV: +$23.58 per bet** (23.58% ROI)

Over 100 bets: **+$2,358 profit**

### 🤔 CONSIDER PUCK LINE
Your model predicts score differential, which is perfect for puck line (±1.5 goals).

**Test this:**
- Start with small stakes
- Track performance over 50+ bets
- Compare to moneyline ROI
- Only adopt if it outperforms

### ❌ STOP CHASING TOTALS
No matter how tempting:
- Don't bet totals "for fun" (negative EV is negative EV)
- Don't try new models (we've exhausted options)
- Don't lower thresholds (you'll bet everything and lose to juice)

---

## If You Still Want to Try Totals...

**Read these first:**
1. `BAYESIAN_TOTALS_FINAL_REPORT.md` (30 pages of analysis)
2. `TOTALS_BETTING_FINAL_SUMMARY.md` (executive summary)
3. All test results showing why it doesn't work

**Then ask yourself:**
- Do I have data Vegas doesn't have? (No)
- Can I beat a 52.4% break-even rate? (History says no)
- Am I willing to risk my 64.7% ML edge? (Don't)

**The honest answer:** With public data, totals aren't beatable. Accept it and move on.

---

## Technical Details

### Signal Weights (Bayesian Model - Best Attempt)

| Signal | Weight | Confidence | Result |
|--------|--------|------------|--------|
| xG Model | 40% | 90% | Too close to Vegas (±0.5 goals) |
| Pace Factor | 23% | 75% | Weak signal |
| Goalie Quality | 27% | 80% | Good signal, but not enough |
| Recent Form | 5% | 50% | Often insufficient data |
| Matchup History | 3% | 40% | Rarely available |
| Context | 2% | 30% | Weak signal |

**Final probabilities:** 46-52% (all inside no-bet zone)  
**Bet recommendations:** 0 out of 61 games

### Model Comparison

| Model | RMSE | Bias | Win Rate | Status |
|-------|------|------|----------|--------|
| Current xG | 2.33 | -0.08 | ~52% | Baseline |
| Ensemble | 2.33 | -0.29 → 0.00 (calibrated) | ~52% | No improvement |
| Adjuster (all phases) | 2.45+ | Varies | N/A | Made worse |
| Amplification (2.0x) | 2.51 | +0.12 | N/A | Made worse |
| Bayesian | N/A | N/A | N/A | 0 bets recommended |

**Conclusion:** All approaches converge to same result - not profitable.

---

## Conclusion

Your model is **ELITE at moneyline** but **NOT SUITABLE for totals**.

This is not a failure - it's specialization. A Formula 1 car doesn't win drag races.

**Your path forward:**
1. ✅ Keep crushing moneyline (64.7% win rate)
2. ✅ Consider testing puck line (plays to your strengths)
3. ❌ Stop betting totals (proven unprofitable)
4. ❌ Don't waste time on new totals models (exhausted all options)

**Trust the data. Protect your edge. Focus on your strengths.**

---

**END OF DOCUMENT**

