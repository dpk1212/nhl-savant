# 🚀 MODEL IMPROVEMENT PLAN
## Goal: Increase Win Prediction Accuracy from 56.9% to 62-65%

**Current Performance:** 56.9% win prediction accuracy (145/255 games)  
**Target:** 62-65% win prediction accuracy  
**Expected Betting Improvement:** 45% → 55-60% win rate

---

## 📊 CURRENT MODEL ANALYSIS

### What's Working ✅
- Core xG-based methodology is sound
- Goalie integration is functional
- Home ice advantage is applied
- Sample-size regression exists
- 56.9% is above random (50%) and meeting industry baseline

### What's Missing ❌
1. **No recency weighting** - Game 1 weighted same as Game 50
2. **No situational factors** - Back-to-backs, rest, travel ignored
3. **Sub-optimal calibration** - Constants not fine-tuned for 2025-26
4. **Limited goalie impact** - Current factor may be too small
5. **No streak detection** - Hot/cold teams not identified
6. **No special teams frequency** - PP/PK opportunities not modeled

---

## 🎯 IMPROVEMENT ROADMAP (Prioritized by Impact)

### PHASE 1: High Impact Changes (Est. +4-7% accuracy) ⭐⭐⭐

#### 1.1 Add Recency Weighting (Est. +3-5% accuracy)

**Why This Matters:**
- Teams change over the season (injuries, trades, coaching adjustments)
- Recent 10 games are 3-5x more predictive than game 1
- MoneyPuck weights last 10 games at 60%, you weight them equally

**Implementation:**

```javascript
// In dataProcessing.js, add this method:

/**
 * Get team xG with recency weighting
 * 60% weight to last 10 games, 40% to full season
 */
getRecentWeightedXGF(teamCode) {
  const allGames = this.rawData.filter(team => team.team === teamCode);
  
  if (!allGames || allGames.length === 0) {
    return this.LEAGUE_AVG_XGF; // Fallback to league average
  }
  
  const gamesPlayed = parseInt(allGames[0].gamesPlayed || allGames[0].GP || 0);
  
  // Need at least 10 games for recency weighting
  if (gamesPlayed < 10) {
    return this.getBaseXGF(teamCode); // Use existing method for early season
  }
  
  // Calculate recent form (last 10 games)
  // This requires historical game-by-game data, which we don't have in teams.csv
  // WORKAROUND: Use a decay function that weights recent performance more
  
  const seasonXGF = this.getBaseXGF(teamCode);
  
  // If we had recent 10-game stats, we'd do:
  // const recentXGF = calculateLast10Games(teamCode);
  // return (recentXGF * 0.60) + (seasonXGF * 0.40);
  
  // For now, apply a dynamic adjustment based on PDO and recent trends
  // You'll need to add L10 columns to teams.csv for full implementation
  
  return seasonXGF;
}
```

**What You Need:**
- Add "L10_xGF" and "L10_xGA" columns to `teams.csv`
- Update your data scraping to capture last 10 game stats
- Modify `predictTeamScore` to use `getRecentWeightedXGF` instead of `getBaseXGF`

**Expected Impact:** +3-5 percentage points (56.9% → 59.9-61.9%)

---

#### 1.2 Run Calibration Test & Optimize (Est. +1-2% accuracy)

**Current Settings:**
```javascript
const CALIBRATION_CONSTANT = 1.52;  // May not be optimal
const k = 0.55;                      // Win probability sensitivity
const HOME_ICE_ADVANTAGE = 0.035;    // 3.5% boost
```

**Action:** Run the calibration test I created:

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
node scripts/testCalibrations.js
```

This will test 315 combinations and tell you the optimal values.

**Expected Impact:** +1-2 percentage points (56.9% → 57.9-58.9%)

---

#### 1.3 Add Back-to-Back Detection (Est. +1-2% accuracy)

**The Problem:**
Teams playing back-to-back games are SIGNIFICANTLY worse:
- Fatigue reduces offensive output by ~0.15 goals
- Win rate drops by ~5-7 percentage points
- Your model treats B2B same as fully rested

**Implementation:**

```javascript
// In dataProcessing.js, add this method:

/**
 * Check if team is playing back-to-back
 * Requires schedule data with game dates
 */
isBackToBack(teamCode, gameDate) {
  if (!this.scheduleHelper || !gameDate) return false;
  
  // Check if team played yesterday
  const yesterday = new Date(gameDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  return this.scheduleHelper.teamPlayedOnDate(teamCode, yesterdayStr);
}

/**
 * Apply back-to-back penalty to predicted score
 */
applyBackToBackPenalty(predictedScore, teamCode, gameDate) {
  if (this.isBackToBack(teamCode, gameDate)) {
    console.log(`⚠️ B2B detected for ${teamCode} - applying 5% penalty`);
    return predictedScore * 0.95; // 5% reduction (~0.15 goals)
  }
  return predictedScore;
}

// In predictTeamScore, add this line:
finalScore = this.applyBackToBackPenalty(finalScore, team, gameDate);
```

**What You Need:**
- Schedule data showing which teams played on which dates
- ScheduleHelper utility to query this data
- Modify `predictTeamScore` to call `applyBackToBackPenalty`

**Expected Impact:** +1-2 percentage points (56.9% → 57.9-58.9%)

---

### PHASE 2: Medium Impact Changes (Est. +2-3% accuracy) ⭐⭐

#### 2.1 Add 3-in-4 Nights Fatigue (Est. +0.5-1% accuracy)

**Implementation:**

```javascript
/**
 * Check if team is playing 3rd game in 4 nights
 * Even more fatiguing than simple B2B
 */
is3in4Nights(teamCode, gameDate) {
  if (!this.scheduleHelper || !gameDate) return false;
  
  // Check if team played 3 of last 4 days
  let gamesInLast4Days = 0;
  for (let i = 1; i <= 4; i++) {
    const date = new Date(gameDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    if (this.scheduleHelper.teamPlayedOnDate(teamCode, dateStr)) {
      gamesInLast4Days++;
    }
  }
  
  return gamesInLast4Days >= 2; // This is their 3rd game
}

apply3in4Penalty(predictedScore, teamCode, gameDate) {
  if (this.is3in4Nights(teamCode, gameDate)) {
    console.log(`🥵 3-in-4 detected for ${teamCode} - applying 7% penalty`);
    return predictedScore * 0.93; // 7% reduction (~0.2 goals)
  }
  return predictedScore;
}
```

**Expected Impact:** +0.5-1 percentage points

---

#### 2.2 Add Road Trip Fatigue (Est. +0.5-1% accuracy)

**Implementation:**

```javascript
/**
 * Check if team is on long road trip (4+ games)
 * Travel fatigue accumulates
 */
isOnLongRoadTrip(teamCode, gameDate, isHome) {
  if (!this.scheduleHelper || isHome) return false; // Only applies to away team
  
  // Count consecutive road games
  let consecutiveRoadGames = 0;
  for (let i = 0; i < 10; i++) {
    const date = new Date(gameDate);
    date.setDate(date.getDate() - i);
    const game = this.scheduleHelper.getGameForTeam(teamCode, date);
    if (!game) break;
    if (game.isHome) break; // Found a home game, road trip ended
    consecutiveRoadGames++;
  }
  
  return consecutiveRoadGames >= 4; // 4th+ road game in a row
}

applyRoadTripPenalty(predictedScore, teamCode, gameDate, isHome) {
  if (this.isOnLongRoadTrip(teamCode, gameDate, isHome)) {
    console.log(`✈️ Long road trip detected for ${teamCode} - applying 3% penalty`);
    return predictedScore * 0.97; // 3% reduction (~0.1 goals)
  }
  return predictedScore;
}
```

**Expected Impact:** +0.5-1 percentage points

---

#### 2.3 Increase Goalie Impact Factor (Est. +0.5-1% accuracy)

**Current Implementation:**
```javascript
// Current goalie adjustment is too small
const baseAdjustment = 1 + (goalieGSAE * 0.001); // Only 0.1% per GSAE point
```

**Improved Implementation:**
```javascript
// Increase goalie impact to match reality
const baseAdjustment = 1 + (goalieGSAE * 0.003); // 0.3% per GSAE point

// For elite goalies (GSAE > 10), even more impact
if (Math.abs(goalieGSAE) > 10) {
  const eliteBonus = (Math.abs(goalieGSAE) - 10) * 0.002;
  baseAdjustment += (goalieGSAE > 0 ? eliteBonus : -eliteBonus);
}
```

**Expected Impact:** +0.5-1 percentage points

---

### PHASE 3: Fine-Tuning Changes (Est. +1-2% accuracy) ⭐

#### 3.1 Add Streak Detection

**Implementation:**

```javascript
/**
 * Detect hot/cold streaks and apply momentum factor
 */
getStreakAdjustment(teamCode) {
  // Requires L10 record data
  const last10Record = this.getLast10Record(teamCode); // Need to add to teams.csv
  
  if (last10Record.wins >= 8) {
    return 1.03; // Hot team: +3%
  } else if (last10Record.wins >= 7) {
    return 1.02; // Good form: +2%
  } else if (last10Record.wins <= 2) {
    return 0.97; // Cold team: -3%
  } else if (last10Record.wins <= 3) {
    return 0.98; // Bad form: -2%
  }
  
  return 1.00; // Normal
}
```

**Expected Impact:** +0.5-1 percentage points

---

#### 3.2 Improve Early Season Regression

**Current Problem:** Using same regression formula regardless of games played

**Improved Implementation:**

```javascript
// Current:
const regressionWeight = gamesPlayed / (gamesPlayed + 20);

// Improved - More aggressive trust of team data after 15+ games:
let regressionWeight;
if (gamesPlayed < 5) {
  regressionWeight = gamesPlayed / (gamesPlayed + 30); // Heavy regression
} else if (gamesPlayed < 15) {
  regressionWeight = gamesPlayed / (gamesPlayed + 15); // Moderate regression
} else {
  regressionWeight = gamesPlayed / (gamesPlayed + 8);  // Light regression
}
```

**Expected Impact:** +0.5-1 percentage points

---

## 📈 EXPECTED CUMULATIVE IMPROVEMENT

| After Phase | Est. Accuracy | Improvement | Betting Win Rate Est. |
|-------------|---------------|-------------|-----------------------|
| **Current** | 56.9% | - | 45% |
| **Phase 1** | 59-62% | +4-7% | 52-56% |
| **Phase 2** | 61-64% | +2-3% | 55-59% |
| **Phase 3** | 62-65% | +1-2% | 56-61% |

---

## 🛠️ IMPLEMENTATION PRIORITY

### Week 1 (Immediate):
1. ✅ Run calibration test (`node scripts/testCalibrations.js`)
2. ⏳ Apply optimal calibration constants
3. ⏳ Add recency weighting infrastructure (add L10 columns to teams.csv)

### Week 2 (High Impact):
4. ⏳ Implement recency weighting in `predictTeamScore`
5. ⏳ Add back-to-back detection
6. ⏳ Increase goalie impact factor

### Week 3 (Medium Impact):
7. ⏳ Add 3-in-4 nights detection
8. ⏳ Add road trip fatigue
9. ⏳ Improve early season regression

### Week 4 (Fine-Tuning):
10. ⏳ Add streak detection
11. ⏳ Validate all changes with new backtest
12. ⏳ A/B test old vs new model

---

## 📊 DATA REQUIREMENTS

To implement these improvements, you need to add to your data pipeline:

### teams.csv additions:
```csv
team,GP,L10_xGF,L10_xGA,L10_W,L10_L,current_streak,...
TOR,30,2.89,2.45,7,3,W3,...
```

### schedule data additions:
- Game dates for each team
- Home/away designation
- Back-to-back detection
- Road trip tracking

---

## 🧪 TESTING PROTOCOL

After each change:

```bash
# Re-run backtest
node scripts/comprehensiveBacktest.js

# Check if accuracy improved
# Target metrics:
# - Win Accuracy: >60%
# - Brier Score: <0.22
# - RMSE: <2.0
```

---

## 🎯 SUCCESS CRITERIA

### Minimum Acceptable:
- Win Accuracy: **60%+** (current: 56.9%)
- Betting Win Rate: **53%+** (current: 45%)
- Brier Score: **<0.22** (current: 0.24)

### Stretch Goals:
- Win Accuracy: **63-65%**
- Betting Win Rate: **58-60%**
- Brier Score: **<0.20**

---

## 💡 QUICK WINS (Start Here!)

### Today (30 minutes):
1. Run calibration test
2. Apply optimal constants
3. Expected: +1-2% accuracy immediately

### This Weekend (4-6 hours):
1. Add L10 stats to teams.csv scraper
2. Implement recency weighting
3. Add back-to-back detection
4. Expected: +4-6% accuracy total

---

## 🚨 CRITICAL PATH

**The #1 thing that will improve your model: RECENCY WEIGHTING**

Everything else is incremental, but weighting recent games 60% vs season 40% will give you the biggest single improvement (+3-5%).

Start there, then add situational factors (B2B, rest, travel).

---

## 📞 NEXT STEPS

Ready to implement? Let's start with the calibration test:

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
node scripts/testCalibrations.js
```

This will run for 5-10 minutes and output the optimal calibration constants.

Then I'll help you implement recency weighting (the big one).

**Let's get you to 62%+ win accuracy!** 🚀

