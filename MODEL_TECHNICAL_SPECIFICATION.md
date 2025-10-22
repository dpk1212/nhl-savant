# NHL Savant Model Technical Specification
## Complete Documentation for Independent Review

**Version:** 1.0  
**Date:** October 21, 2024  
**Status:** Early Season (5-6 Games Played per Team)

---

## Executive Summary

This document provides a complete technical specification of the NHL Savant prediction model for independent consultant review. The model is currently showing **systematic bias toward UNDER bets** (9 out of 10 recommendations) with **unrealistically high EVs** (+15-43% range, all rated "Elite").

### Critical Issues Requiring Review

1. **UNDER Bias:** 90% of recommended bets are UNDER totals
2. **High EVs:** All games showing +15-43% EV (should be +4-12%)
3. **Suspect:** Despite 65-70% regression, predictions still diverge from market

---

## Part 1: Data Sources

### Input Files

**1. Team Statistics (`public/teams.csv`)**
- Source: NHL official stats
- Columns: 100+ advanced metrics per team
- Key fields used:
  - `scoreVenueAdjustedxGoalsFor` (score-adjusted expected goals for)
  - `scoreVenueAdjustedxGoalsAgainst` (score-adjusted expected goals against)
  - `iceTime` (total ice time in minutes)
  - `games_played` (number of games played)
  - `goalsFor`, `goalsAgainst` (actual goals)
  - `penalityMinutesFor` (penalty minutes)
  - `pp_efficiency`, `pk_efficiency` (power play/penalty kill percentages)

**2. Goalie Statistics (`public/goalies.csv`)**
- GSAE (Goals Saved Above Expected)
- High Danger Save %
- Currently using **team-average goalie stats** (not starting goalies)

**3. Odds Data (`public/odds_money.md`, `public/odds_total.md`)**
- Manually updated daily from OddsTrader
- American odds format
- Moneyline and total (over/under) lines

---

## Part 2: Score Prediction Model

### 2.1 Core Formula

**Location:** `src/utils/dataProcessing.js` - `predictTeamScore()` function (lines 283-400)

```javascript
predictTeamScore(team, opponent, isHome = true, startingGoalie = null) {
  // STEP 1: Get team data
  const team_5v5 = this.getTeamData(team, '5on5');
  const opponent_5v5 = this.getTeamData(opponent, '5on5');
  const team_PP = this.getTeamData(team, '5on4');
  const opponent_PK = this.getTeamData(opponent, '4on5');
  
  // STEP 2: Get league average and games played
  const league_avg = this.calculateLeagueAverage(); // ~2.47 xGF/60
  const gamesPlayed = team_5v5.gamesPlayed || 82;
  const opp_gamesPlayed = opponent_5v5.gamesPlayed || 82;
  
  // STEP 3: Apply regression to mean (CRITICAL - currently 65-70% for 5-6 GP)
  const team_xGF_raw = team_5v5.scoreAdj_xGF_per60 || team_5v5.xGF_per60;
  const opp_xGA_raw = opponent_5v5.scoreAdj_xGA_per60 || opponent_5v5.xGA_per60;
  
  const team_xGF_adjusted = this.applyRegressionToMean(team_xGF_raw, league_avg, gamesPlayed);
  const opp_xGA_adjusted = this.applyRegressionToMean(opp_xGA_raw, league_avg, opp_gamesPlayed);
  
  // STEP 4: Calculate 5v5 rate (40% offense, 60% defense weighting)
  const base_5v5_rate = (team_xGF_adjusted * 0.40) + (opp_xGA_adjusted * 0.60);
  
  // STEP 5: Calculate special teams time (using actual penalty minutes)
  const weights = this.calculateDynamicSituationalWeights(team, opponent);
  
  // STEP 6: Add power play component
  let expectedGoals = base_5v5_rate * (weights['5on5'] / 60);
  
  if (team_PP && opponent_PK) {
    const pp_rate = team_PP.xGF_per60 || 0;
    const pk_rate = opponent_PK.xGA_per60 || 0;
    const pp_component = ((pp_rate * 0.40) + (pk_rate * 0.60)) * (weights['5on4'] / 60);
    expectedGoals += pp_component;
  }
  
  // STEP 7: Apply home ice advantage (5% boost)
  if (isHome) {
    expectedGoals *= 1.05;
  }
  
  // STEP 8: Goalie adjustment (currently disabled - using team averages)
  // const goalieAdj = this.adjustForGoalie(expectedGoals, opponent, startingGoalie);
  
  return expectedGoals;
}
```

### 2.2 Regression to Mean

**Function:** `applyRegressionToMean()` (lines 228-236)

```javascript
applyRegressionToMean(teamStat, leagueAvg, gamesPlayed) {
  if (!teamStat || teamStat === 0) return leagueAvg;
  
  const regressionWeight = this.calculateRegressionWeight(gamesPlayed);
  
  // Weighted average: (team_stat × (1 - weight)) + (league_avg × weight)
  return (teamStat * (1 - regressionWeight)) + (leagueAvg * regressionWeight);
}
```

**Current Regression Schedule:**
- 0-5 games: **70%** regression to league average
- 5-10 games: **65%** regression to league average
- 10-20 games: 45% regression
- 20-40 games: 25% regression
- 40+ games: 15% regression

**Example Calculation (5 games played):**
- Team actual xGF/60: 2.8
- League average: 2.47
- Regression: `(2.8 × 0.35) + (2.47 × 0.65) = 0.98 + 1.61 = 2.59`

### 2.3 League Average Calculation

**Function:** `calculateLeagueAverage()` (lines 185-199)

```javascript
calculateLeagueAverage() {
  const all_teams = this.getTeamsBySituation('5on5');
  if (!all_teams || all_teams.length === 0) return 2.45;
  
  const total_xGF = all_teams.reduce((sum, t) => {
    const xgf = t.scoreAdj_xGF_per60 || t.xGF_per60 || 0;
    return sum + xgf;
  }, 0);
  
  const baseAverage = total_xGF / all_teams.length;
  
  // CRITICAL: 3% boost added to correct for xG underestimation
  return baseAverage * 1.03;
}
```

**Current Output:** ~2.47 xGF/60

---

## Part 3: Win Probability Calculation

### 3.1 Poisson Distribution

**Function:** `calculatePoissonWinProb()` (lines 568-602)

```javascript
calculatePoissonWinProb(teamScore, oppScore) {
  let winProb = 0;
  let tieProb = 0;
  
  // Calculate probability for all score combinations (0-10 goals each)
  for (let teamGoals = 0; teamGoals <= 10; teamGoals++) {
    const pTeam = this.poissonPMF(teamGoals, teamScore);
    
    for (let oppGoals = 0; oppGoals <= 10; oppGoals++) {
      const pOpp = this.poissonPMF(oppGoals, oppScore);
      const pCombo = pTeam * pOpp;
      
      if (teamGoals > oppGoals) {
        winProb += pCombo;  // Team wins in regulation
      } else if (teamGoals === oppGoals) {
        tieProb += pCombo;  // Goes to OT/SO
      }
    }
  }
  
  // CRITICAL: OT/SO split (58% to better team, 42% to weaker team)
  const otAdvantage = teamScore > oppScore ? 0.58 : 0.42;
  winProb += tieProb * otAdvantage;
  
  return Math.max(0.05, Math.min(0.95, winProb));
}
```

**Poisson PMF Function:**
```javascript
poissonPMF(k, lambda) {
  if (lambda <= 0) return 0;
  if (k < 0) return 0;
  
  // For large values, use log factorial to avoid overflow
  if (k > 20 || lambda > 20) {
    const logPMF = k * Math.log(lambda) - lambda - logFactorial(k);
    return Math.exp(logPMF);
  }
  
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}
```

### 3.2 Over/Under Probability

**Function:** `calculateTotalEdge()` in `src/utils/edgeCalculator.js` (lines 163-218)

```javascript
calculateTotalEdge(game, awayScore, homeScore) {
  const predictedTotal = awayScore + homeScore;
  const marketTotal = game.total.line;
  const edge = predictedTotal - marketTotal;
  
  // CRITICAL: Use Poisson CDF for discrete probability
  // P(Over) = P(Total > marketTotal) = 1 - P(Total <= marketTotal)
  const overProb = 1 - this.dataProcessor.poissonCDF(Math.floor(marketTotal), predictedTotal);
  const underProb = 1 - overProb;
  
  // Calculate EV
  const overEV = this.dataProcessor.calculateEV(overProb, game.total.over);
  const underEV = this.dataProcessor.calculateEV(underProb, game.total.under);
  
  return {
    predictedTotal,
    awayScore,
    homeScore,
    marketTotal,
    edge,
    over: { ev: overEV, evPercent: overEV, modelProb: overProb, odds: game.total.over },
    under: { ev: underEV, evPercent: underEV, modelProb: underProb, odds: game.total.under }
  };
}
```

**Poisson CDF Function:**
```javascript
poissonCDF(k, lambda) {
  if (lambda <= 0) return 1;
  if (k < 0) return 0;
  
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += this.poissonPMF(i, lambda);
  }
  
  return Math.min(1, sum);
}
```

---

## Part 4: Expected Value Calculation

### 4.1 EV Formula

**Function:** `calculateEV()` (lines 454-476)

```javascript
calculateEV(modelProbability, marketOdds, stake = 100) {
  // Convert American odds to decimal odds
  let decimalOdds;
  if (marketOdds > 0) {
    // Positive odds: +125 → 2.25
    decimalOdds = 1 + (marketOdds / 100);
  } else {
    // Negative odds: -110 → 1.909
    decimalOdds = 1 + (100 / Math.abs(marketOdds));
  }
  
  // Total return if bet wins (includes original stake)
  const totalReturn = stake * decimalOdds;
  
  // EV = (P_win × total_return) - stake
  const ev = (modelProbability * totalReturn) - stake;
  
  return ev;
}
```

### 4.2 Implied Probability from Odds

**Function:** `oddsToProbability()` (lines 446-452)

```javascript
oddsToProbability(americanOdds) {
  if (americanOdds > 0) {
    return 100 / (americanOdds + 100);
  } else {
    return Math.abs(americanOdds) / (Math.abs(americanOdds) + 100);
  }
}
```

---

## Part 5: Current Issues & Observations

### 5.1 UNDER Bias (9 out of 10 games)

**Observed Pattern:**
- Predicted totals are consistently **0.4-1.1 goals BELOW** market lines
- This creates higher EV for UNDER bets

**Possible Causes:**
1. **League average too low:** Currently ~2.47 xGF/60, but actual NHL average might be ~2.55
2. **Regression too aggressive:** 65-70% pulls all teams toward low average
3. **Score-adjusted xG bias:** Score-adjusted metrics might underestimate offense
4. **3% boost insufficient:** Added 1.03 multiplier may not be enough

### 5.2 High EVs Despite Heavy Regression

**Observed Pattern:**
- Even with 65-70% regression, EVs range from +15-43%
- All 10 games rated "Elite"

**Possible Causes:**
1. **Poisson CDF calculation error:** Over/under probabilities may be incorrect
2. **Market odds conversion error:** Implied probability calculation may be wrong
3. **Model systematically underpricing totals:** Predictions consistently too low
4. **OT/SO split incorrect:** 58/42 split might be creating bias

### 5.3 Example Calculation Trace

**Game: SJS @ NYI (UNDER 6 at -130 odds)**

**Step 1: Predict Scores**
- SJS (away, 5 GP): Actual xGF/60 = 2.15, League avg = 2.47
  - Regressed (65%): `(2.15 × 0.35) + (2.47 × 0.65) = 2.36`
- NYI (home, 5 GP): Actual xGF/60 = 2.41, League avg = 2.47
  - Regressed (65%): `(2.41 × 0.35) + (2.47 × 0.65) = 2.45`
  - With home ice (5%): `2.45 × 1.05 = 2.57`
- **Predicted Total: 2.36 + 2.57 = 4.93 goals**

**Step 2: Calculate Probabilities**
- Market line: 6 goals
- Poisson CDF(6, 4.93) = P(Total ≤ 6) = ?
- P(Under) = CDF(5, 4.93) [floor of 6]
- P(Over) = 1 - P(Under)

**Step 3: Calculate EV**
- Market UNDER odds: -130 → Implied prob = 130/230 = 56.5%
- Model UNDER prob: ~70-75% (since predicted is 4.93 vs market 6)
- EV = (0.70 × 1.769 × 100) - 100 = +23.8%

**QUESTION FOR CONSULTANT:** Why is predicted total (4.93) so far below market (6.0)?

---

## Part 6: Questions for Independent Review

### Critical Questions

1. **League Average:**
   - Is 2.47 xGF/60 correct for current NHL?
   - Should we be using actual goals/game instead of xG?
   - Is the 3% boost (×1.03) the right amount?

2. **Regression Amount:**
   - Is 65-70% too aggressive for 5-6 games?
   - Should we use different regression for offense vs defense?
   - Are we regressing the right metrics?

3. **Poisson Distribution:**
   - Is Poisson the right distribution for NHL totals?
   - Should we use a different model (e.g., Negative Binomial)?
   - Is the CDF calculation correct?

4. **Systematic Bias:**
   - Why are we predicting 0.5-1.0 goals below market on every game?
   - Is there an error in how we're calculating per-60 rates?
   - Should we be using time-weighted averages differently?

5. **OT/SO Split:**
   - Is 58/42 correct for better/weaker team in OT?
   - Should this vary based on goal differential?

### Data Validation Requests

1. **Verify league average calculation** against actual NHL data
2. **Check Poisson PMF/CDF** against known statistical tables
3. **Validate score-adjusted xG** interpretation
4. **Review EV formula** for American odds conversion
5. **Test with historical data** to see if model would have been profitable

---

## Part 7: Code File References

**Key Files:**
1. `src/utils/dataProcessing.js` - Core prediction model (lines 1-783)
2. `src/utils/edgeCalculator.js` - EV calculations (lines 1-348)
3. `src/utils/oddsTraderParser.js` - Odds parsing (lines 1-200)
4. `src/utils/goalieProcessor.js` - Goalie stats (lines 1-200)

**Data Files:**
1. `public/teams.csv` - Team statistics
2. `public/goalies.csv` - Goalie statistics
3. `public/odds_money.md` - Moneyline odds
4. `public/odds_total.md` - Total odds
5. `public/starting_goalies.json` - Starting goalies (not yet used)

---

## Appendix: Test Cases for Validation

### Test Case 1: Manual Calculation

**Given:**
- Team A: 2.5 xGF/60 (actual), 5 games played
- Team B: 2.4 xGF/60 (actual), 5 games played
- League avg: 2.47 xGF/60
- Market total: 6.0 goals
- Odds: OVER -110, UNDER -110

**Calculate:**
1. Regressed scores (65% regression)
2. Predicted totalx
3. Poisson probabilities for OVER/UNDER
4. Expected values
5. Compare to model output

### Test Case 2: Extreme Regression

**Test:** Set regression to 100% (all teams = league average)
- Expected: All predictions should be ~2.47 × 2 = 4.94 goals
- Expected EVs: Should be near 0% (no edge)

### Test Case 3: No Regression

**Test:** Set regression to 0% (use actual stats)
- Expected: Large spread in predictions
- Expected EVs: Likely very high (>50%)

---

## Contact for Questions

For clarification on any part of this specification, please reference:
- Code comments in `src/utils/dataProcessing.js`
- Backtesting framework in `backtesting/` folder
- Model documentation in `MODEL_*.md` files

**End of Technical Specification**

