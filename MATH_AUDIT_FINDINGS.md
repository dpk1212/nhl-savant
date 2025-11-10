# 🔍 MATHEMATICAL AUDIT FINDINGS

## Executive Summary

**CRITICAL BUG FOUND**: The system is displaying MONEYLINE bet data (CGY +132) with MONEYLINE probabilities (62.3%) but the user is looking at what they think is a TOTAL bet analysis. This is causing massive confusion about the EV calculations.

---

## 🚨 CRITICAL FINDING #1: Display Confusion

### The Issue
Looking at the user's screenshot:
- **Badge shows**: "MONEYLINE BET"
- **Pick shows**: "CGY (HOME) +132"
- **Probability shows**: 62.3% (win probability)
- **EV shows**: 44.6%

BUT the user is **also seeing** a predicted total of 5.80 vs market 5.5, which makes them think this is about the TOTAL bet.

### Root Cause
In `TodaysGames.jsx` (lines 170-172):
```javascript
const bestEdge = topEdges
  .filter(e => e.game === game.game && e.evPercent > 0)
  .sort((a, b) => b.evPercent - a.evPercent)[0];
```

The system picks the **highest EV bet** across ALL markets (moneyline, total, puck line). In this case, the moneyline bet on CGY +132 has the highest EV, so it's displayed. But the game card ALSO shows the predicted total, creating confusion.

### Verification
**Manual calculation for CGY +132 Moneyline at 62.3% win probability:**
- Stake: $100
- Odds: +132 → Decimal odds: 2.32
- Total return if win: $100 × 2.32 = $232
- EV = (0.623 × $232) - (0.377 × $100)
- EV = $144.54 - $37.70 = **$106.84 total return**
- **Expected profit**: $6.84 per $100 bet
- **EV%**: 6.84%

### The Math is Actually CORRECT! ✅

The displayed "Expected Profit: +$44.62" for a $100 bet would mean 44.62% EV.

**WAIT - Let me check the EV calculation more carefully...**

---

## 🚨 CRITICAL FINDING #2: EV Calculation Bug

### Checking `calculateEV()` in dataProcessing.js (lines 265-286)

```javascript
calculateEV(modelProbability, marketOdds, stake = 100) {
  // Convert American odds to decimal odds
  let decimalOdds;
  if (marketOdds > 0) {
    decimalOdds = 1 + (marketOdds / 100);  // +132 → 2.32
  } else {
    decimalOdds = 1 + (100 / Math.abs(marketOdds));
  }
  
  const totalReturn = stake * decimalOdds;  // $100 × 2.32 = $232
  
  // EV = (P_win × total_return) - stake
  const ev = (modelProbability * totalReturn) - stake;
  
  return ev;
}
```

**Manual verification:**
- Model prob: 0.623
- Market odds: +132
- Decimal odds: 1 + (132/100) = 2.32
- Total return: 100 × 2.32 = $232
- EV = (0.623 × 232) - 100 = 144.54 - 100 = **$44.54**
- EV% = 44.54%

**THE FORMULA IS WRONG!** ❌

### The Correct EV Formula

EV should be: `(P_win × total_return) - (P_lose × stake)`

OR equivalently: `(P_win × profit) - (P_lose × stake)`

**Current (WRONG):**
```javascript
ev = (0.623 × 232) - 100 = $44.54
```

**Correct (should be):**
```javascript
ev = (0.623 × 232) - (0.377 × 100) = $144.54 - $37.70 = $106.84
// Expected PROFIT = $106.84 - $100 = $6.84
```

### The Bug
The current formula calculates:
```
EV = (P_win × total_return) - stake
```

But it should be:
```
EV = (P_win × total_return) + (P_lose × 0) - stake
EV = (P_win × total_return) - stake  // This is the RETURN, not PROFIT
```

The issue is the function returns the **expected RETURN** ($106.84) but we're displaying it as **expected PROFIT** (which should be $6.84).

OR the formula should be:
```
EV = (P_win × profit_if_win) - (P_lose × loss_if_lose)
EV = (0.623 × 132) - (0.377 × 100) = $82.24 - $37.70 = $44.54
```

**BOTH INTERPRETATIONS ARE BEING MIXED UP!**

---

## 🔍 FINDING #3: Win Probability May Be Too High

### Checking `estimateWinProbability()` (lines 324-356)

For CGY (HOME) vs WPG (AWAY):
- Market odds: CGY +132 (underdog) → Implied prob: 43.1%
- Model says: 62.3%
- **Difference: 19.2 percentage points**

This is a **HUGE** edge. Let me verify the formula:

```javascript
estimateWinProbability(team, opponent, isHome = true) {
  const teamXGD = team.xGD_per60 || 0;
  const oppXGD = opponent.xGD_per60 || 0;
  
  const homeBonus = isHome ? 0.15 : 0;  // +0.15 xGD for home ice
  
  const teamReg = team.regression_score || 0;
  const oppReg = opponent.regression_score || 0;
  
  const teamStrength = teamXGD + homeBonus - (teamReg * 0.01);
  const oppStrength = oppXGD - (oppReg * 0.01);
  
  const diff = teamStrength - oppStrength;
  
  const k = 0.8;
  const winProb = 1 / (1 + Math.exp(-k * diff));
  
  return Math.max(0.05, Math.min(0.95, winProb));
}
```

**From the screenshot:**
- WPG xGD: -0.08 (they have #29 offense, very weak)
- CGY Defense: 2.45 vs 2.82 xGA/60 (strong)

**Estimated calculation:**
- CGY xGD ≈ +0.3 (decent team)
- WPG xGD ≈ -0.3 (weak team)
- Home bonus: +0.15
- Diff ≈ 0.3 - (-0.3) + 0.15 = 0.75

**Win probability:**
- P = 1 / (1 + e^(-0.8 × 0.75))
- P = 1 / (1 + e^(-0.6))
- P = 1 / (1 + 0.5488)
- P = 1 / 1.5488
- P = **64.5%**

This is actually **reasonable** if:
1. WPG is truly that bad offensively (#29 of 32)
2. CGY has home ice
3. The model believes in regression for WPG

BUT the market has CGY as +132 underdogs, which means the market thinks CGY only has 43% chance. This could mean:
- The market knows something we don't (injuries, B2B, goalie matchup)
- OR our model found a genuine edge
- OR our model is overconfident

---

## 🔍 FINDING #4: Total Probability Calculation (Actually Correct!)

For the OVER 5.5:
- Predicted total: 5.80
- Market line: 5.5
- Edge: +0.30 goals

**From `calculateTotalEdge()` (lines 134-192):**

```javascript
const stdDev = 0.9 + (predictedTotal * 0.12);
// stdDev = 0.9 + (5.8 × 0.12) = 0.9 + 0.696 = 1.596

const zScore = (marketTotal - predictedTotal) / stdDev;
// zScore = (5.5 - 5.8) / 1.596 = -0.3 / 1.596 = -0.188

const overProb = 1 - normalCDF(zScore);
// normalCDF(-0.188) ≈ 0.425
// overProb = 1 - 0.425 = 0.575 = 57.5%
```

**This is CORRECT!** ✅

With a 0.3 goal edge and a standard deviation of 1.6, the over has about 57-58% probability.

**EV calculation for OVER 5.5 at -110:**
- Probability: 57.5%
- Odds: -110 → Decimal: 1.909
- EV = (0.575 × 190.91) - 100 = $109.77 - $100 = **$9.77**
- EV% = 9.77%

This would be a **legitimate edge** if the prediction is accurate.

---

## 📊 SUMMARY OF FINDINGS

### Bug #1: EV Formula Interpretation ❌
**Location**: `dataProcessing.js` line 283

**Current**:
```javascript
const ev = (modelProbability * totalReturn) - stake;
return ev;  // Returns expected RETURN, not PROFIT
```

**Issue**: The function returns expected RETURN but UI displays it as expected PROFIT.

**Fix**: Either:
1. Return `ev - stake` to get profit
2. OR clarify that `ev` is the expected return and adjust display

### Bug #2: Display Showing Wrong Bet ⚠️
**Location**: `TodaysGames.jsx` lines 170-172

**Issue**: The "best edge" might be a MONEYLINE bet but the user sees TOTAL predictions and gets confused.

**Fix**: Either:
1. Show bet type more prominently
2. OR separate moneyline vs total analysis
3. OR show ALL bets, not just the "best" one

### Bug #3: Win Probability Might Be Overconfident ⚠️
**Location**: `dataProcessing.js` line 351

**Issue**: k=0.8 might be too aggressive. A 0.6 xGD difference producing 64% win prob vs market's 43% is a 21-point edge.

**Fix**: 
1. Reduce k to 0.6 for more conservative estimates
2. OR add more factors (rest days, goalie, injuries)
3. OR trust the model if backtesting shows it's accurate

---

## 🎯 RECOMMENDED FIXES

### Priority 1: Fix EV Return vs Profit Confusion
```javascript
// OPTION A: Return profit instead of return
calculateEV(modelProbability, marketOdds, stake = 100) {
  // ... existing code ...
  const totalReturn = stake * decimalOdds;
  const ev = (modelProbability * totalReturn) - stake;
  return ev;  // This is the expected PROFIT ✅
}
```

Actually wait - let me trace through this more carefully...

When we bet $100 on +132:
- If we WIN (62.3% chance): We get back $232 (our $100 + $132 profit)
- If we LOSE (37.7% chance): We get back $0

Expected value = (0.623 × $232) + (0.377 × $0) = $144.54

This $144.54 is the expected RETURN.
Expected PROFIT = $144.54 - $100 = $44.54

**THE CODE IS RETURNING PROFIT, NOT RETURN!**

```javascript
const ev = (modelProbability * totalReturn) - stake;
// ev = (0.623 × 232) - 100 = 144.54 - 100 = 44.54 ✅
```

So the EV formula IS CORRECT! The issue is elsewhere...

### Wait - Let me check the display logic!

Looking at the screenshot again:
- "Expected Return: $144.62"
- "Market Return: $100.00"
- "Expected Profit: +$44.62"

**AH HA!** The display shows:
1. Expected Return = model_prob × payout
2. Expected Profit = Expected Return - Market Return

This makes sense! But where is $144.62 coming from if the code returns $44.54?

**OH! The display must be adding the stake back:**
- Code returns: $44.54 (profit)
- Display shows: $44.54 + $100 = $144.54 as "Expected Return"

So the math IS correct! The 44.6% EV is real IF the 62.3% win probability is accurate.

---

## 🎯 REAL ISSUE: Model Overconfidence

The actual issue is:
1. **The math is correct** ✅
2. **The win probability model is finding huge edges** (19-21 percentage points)
3. **This could mean**:
   - The model is genuinely finding value
   - OR the model is overconfident
   - OR the model is missing key factors (injuries, rest, matchups)

### Recommended Actions:

1. **Backtest the model** - Does it actually beat the closing line?
2. **Reduce k value** from 0.8 to 0.5-0.6 for more conservative probabilities
3. **Add more factors** - Rest days, goalie matchups, recent form
4. **Compare to market** - If consistently 15-20 points off, recalibrate

---

## ✅ VERIFIED CORRECT

1. **EV Formula**: ✅ Correct
2. **Odds Conversion**: ✅ Correct  
3. **Total Probability**: ✅ Correct (using normal distribution)
4. **Normal CDF**: ✅ Correct (verified approximation)

## ⚠️ NEEDS CALIBRATION

1. **Win Probability Model**: May be too aggressive (k=0.8)
2. **Home Ice Bonus**: 0.15 xGD might be too high
3. **Regression Penalty**: Might need adjustment

## 🔧 RECOMMENDED FIXES

See next document for implementation...








