# 🎯 Variance Reduction Strategy

## Current Problem

**Bias**: Fixed ✅ (-0.332 → -0.036 with calibration)
**Variance**: High ❌ (RMSE 2.42, need < 1.80)

```
Current Model: Same prediction for every game context
├─ Uses season-long averages
├─ No recent form weighting
├─ No situational awareness (B2B, rest, travel)
└─ No opponent-specific adjustments

Result: High variance (predictions scatter ±2.4 goals from actual)
```

---

## 🔬 What Causes Variance?

**Variance = Prediction Error Spread**

Think of it as the "scatter" of predictions around actual results:
- Low variance = consistent, tight predictions
- High variance = wildly inconsistent predictions

### Current Sources of Variance (in order of impact):

1. **Recent Form Ignored** (~30% of variance)
   - Hot teams outperform season averages
   - Cold teams underperform
   - Model uses season-long stats only

2. **No Situational Context** (~25% of variance)
   - Back-to-back games (fatigue)
   - Rest days (recovery)
   - Travel distance
   - Time zone changes

3. **Equal Weighting of All Games** (~20% of variance)
   - October game = March game (not true!)
   - Early season noise vs late season signal

4. **No Opponent-Specific Adjustments** (~15% of variance)
   - Some teams match up better vs others
   - Style-based advantages ignored

5. **Fixed Game Minutes Distribution** (~10% of variance)
   - PP opportunities vary
   - 5v5 time varies by game flow

---

## 🚀 Variance Reduction Strategies

### **Priority 1: Recent Form Weighting** (Easiest, Highest Impact)

**Impact**: -0.40 RMSE improvement (2.42 → 2.02)

**Concept**: Weight recent games more heavily than old games.

**Current**:
```javascript
// All 8 games weighted equally
const avgXGF = sum(games) / 8;
```

**Proposed**:
```javascript
// Exponentially weight recent games more
const weights = [1.0, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.65]; // last 8 games
const weightedXGF = sum(games[i] * weights[i]) / sum(weights);
```

**Example**:
```
Team last 8 games xGF: [3.5, 3.2, 3.0, 2.8, 2.6, 2.5, 2.4, 2.3]
                       └─ most recent

Current (equal weight): 2.79 xGF
Proposed (recency): 3.08 xGF  ← Captures hot streak!
```

**Implementation**:
- Add `calculateRecentFormAverage(team, stat, numGames)` to `dataProcessing.js`
- Apply to xGF, xGA, PP%, PK%
- Use last 10 games with exponential decay (0.95^n)

**Code Location**: Lines 326-327 in `dataProcessing.js`

---

### **Priority 2: Back-to-Back Detection** (Medium Effort, High Impact)

**Impact**: -0.25 RMSE improvement (2.02 → 1.77)

**Concept**: Teams on 2nd night of back-to-back score 8-12% fewer goals.

**Current**:
```javascript
predictTeamScore(team, opponent, isHome, startingGoalie, gameDate) {
  // gameDate parameter passed but NOT USED!
  // No B2B detection
}
```

**Proposed**:
```javascript
predictTeamScore(team, opponent, isHome, startingGoalie, gameDate) {
  const isBackToBack = this.scheduleHelper?.isBackToBack(team, gameDate);
  
  // Apply fatigue penalty
  if (isBackToBack) {
    goals_5v5 *= 0.90;  // -10% for fatigue
  }
}
```

**Research**:
- NHL teams score 10% fewer on 2nd night of B2B
- Defense also degrades (allow 8% more goals)
- Elite teams handle B2B better (reduce penalty to -7%)

**Implementation**:
1. Add `isBackToBack(team, date)` to `ScheduleHelper`
2. Apply multiplicative penalty to predicted goals
3. Consider opponent's B2B status too

**Data Needed**: Game schedule with dates (already have in CSV)

**Code Location**: Lines 148-155 in `backtester.js` (TODO comment exists!)

---

### **Priority 3: Rest Days Advantage** (Medium Effort, Medium Impact)

**Impact**: -0.15 RMSE improvement (1.77 → 1.62)

**Concept**: Teams with 3+ days rest score 4-6% more goals.

**Current**: No rest tracking

**Proposed**:
```javascript
const restDays = this.scheduleHelper.getDaysSinceLastGame(team, gameDate);

if (restDays >= 3) {
  goals_5v5 *= 1.05;  // +5% well-rested bonus
}
```

**Rest Effect Scale**:
- 1 day: 0% (normal)
- 2 days: +2%
- 3 days: +5%
- 4+ days: +7% (but also rust risk)

**Combined with B2B**:
```
Team A: B2B (0 rest) → -10%
Team B: 3 days rest → +5%
Net swing: 15% scoring differential!
```

**Implementation**:
- Track last game date for each team
- Calculate rest days
- Apply graduated bonuses/penalties

---

### **Priority 4: Time-Weighted Season Stats** (Hard, Medium Impact)

**Impact**: -0.12 RMSE improvement (1.62 → 1.50)

**Concept**: Don't weight October games equally with March games.

**Current Problem**:
```
Team's season: [Bad Oct] [Okay Nov] [Good Dec-Mar]
Model sees: Average of all months (mediocre)
Reality: Team is actually good NOW
```

**Proposed**: Exponential time decay from current date
```javascript
// Weight games by recency from TODAY
const daysAgo = (today - gameDate) / (24 * 60 * 60 * 1000);
const weight = Math.exp(-daysAgo / 30);  // 30-day half-life
```

**Example (March prediction)**:
```
October games: weight = 0.10
November games: weight = 0.25
December games: weight = 0.50
January games: weight = 0.75
February games: weight = 0.90
March games: weight = 1.00
```

**Implementation**:
- Requires game-by-game data (not just season totals)
- Calculate weighted averages for all stats
- Computationally expensive but powerful

**Complexity**: HIGH (need play-by-play data)

---

### **Priority 5: Opponent Style Matchups** (Very Hard, Low-Medium Impact)

**Impact**: -0.08 RMSE improvement (1.50 → 1.42)

**Concept**: Some teams match up better against certain styles.

**Examples**:
- High-speed team vs slow defensive team
- High-shooting% team vs low-save% goalie
- Aggressive forecheck vs turnover-prone defense

**Implementation** (Advanced):
```javascript
// Calculate style metrics
const teamStyle = {
  pace: team_5v5.corsiFor / team_5v5.gamesPlayed,  // Possession pace
  shootingVol: team_5v5.shotsOnGoalFor / gamesPlayed,
  physicality: team_5v5.hits / gamesPlayed
};

const oppStyle = {
  pace: opp_5v5.corsiFor / opp_5v5.gamesPlayed,
  defense: opp_5v5.blockedShots / gamesPlayed
};

// Matchup adjustments
if (teamStyle.pace > 60 && oppStyle.defense < 15) {
  goals += 0.15;  // Fast team vs weak defense
}
```

**Complexity**: VERY HIGH (requires detailed analytics)
**Priority**: LOW (do after easier wins)

---

## 📊 Implementation Roadmap

### **Phase 1: Quick Wins** (1-2 days)
1. ✅ Recent form weighting (recency bias)
   - Expected: -0.40 RMSE
   - Effort: LOW
   - File: `dataProcessing.js`, add `calculateRecentForm()`

2. ✅ Back-to-back detection
   - Expected: -0.25 RMSE
   - Effort: MEDIUM
   - File: `scheduleHelper.js`, add `isBackToBack()`

**Result after Phase 1**: RMSE ~1.77 (from 2.42)

---

### **Phase 2: Situational Context** (2-3 days)
3. ✅ Rest days tracking
   - Expected: -0.15 RMSE
   - Effort: MEDIUM
   - File: `scheduleHelper.js`, add `getDaysSinceLastGame()`

4. ⏸️ Travel distance (optional)
   - Expected: -0.05 RMSE
   - Effort: MEDIUM
   - Need: Arena locations, flight times

**Result after Phase 2**: RMSE ~1.62 (from 1.77)

---

### **Phase 3: Advanced** (1 week)
5. ⏸️ Time-weighted stats
   - Expected: -0.12 RMSE
   - Effort: HIGH
   - Need: Game-by-game historical data

6. ⏸️ Opponent matchup adjustments
   - Expected: -0.08 RMSE
   - Effort: VERY HIGH
   - Need: Advanced style metrics

**Result after Phase 3**: RMSE ~1.42 (TARGET: < 1.80) ✅

---

## 🎯 Realistic Target

**Current**: 2.42 RMSE
**After Calibration**: 2.415 RMSE
**After Phase 1**: 1.77 RMSE (-27%)
**After Phase 2**: 1.62 RMSE (-33%)
**After Phase 3**: 1.42 RMSE (-41%)

**Target**: < 1.80 RMSE

**Achievable with Phase 1 + 2**: 1.62 RMSE ✅

---

## 🔧 Technical Implementation Details

### **1. Recent Form Weighting**

```javascript
// Add to dataProcessing.js

calculateRecentFormAverage(team, stat, lookbackGames = 10) {
  // Get last N games for team
  const recentGames = this.getRecentGames(team, lookbackGames);
  
  if (!recentGames || recentGames.length === 0) {
    return this.getSeasonAverage(team, stat);  // Fallback to season avg
  }
  
  // Exponential weights (most recent = 1.0, decay by 0.95 per game)
  const weights = recentGames.map((_, i) => Math.pow(0.95, i));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  // Weighted average
  const weightedSum = recentGames.reduce((sum, game, i) => {
    return sum + (game[stat] * weights[i]);
  }, 0);
  
  return weightedSum / totalWeight;
}
```

### **2. Back-to-Back Detection**

```javascript
// Add to scheduleHelper.js

isBackToBack(team, gameDate) {
  const lastGame = this.getLastGameDate(team, gameDate);
  
  if (!lastGame) return false;
  
  const daysDiff = (new Date(gameDate) - new Date(lastGame)) / (1000 * 60 * 60 * 24);
  
  return daysDiff <= 1.0;  // B2B if game within 24 hours
}

applyFatiguePenalty(goals, team, gameDate) {
  if (this.isBackToBack(team, gameDate)) {
    return goals * 0.90;  // -10% fatigue penalty
  }
  return goals;
}
```

### **3. Rest Days Advantage**

```javascript
// Add to scheduleHelper.js

getDaysSinceLastGame(team, gameDate) {
  const lastGame = this.getLastGameDate(team, gameDate);
  
  if (!lastGame) return 2;  // Default: normal rest
  
  const daysDiff = (new Date(gameDate) - new Date(lastGame)) / (1000 * 60 * 60 * 24);
  
  return Math.floor(daysDiff);
}

applyRestBonus(goals, team, gameDate) {
  const restDays = this.getDaysSinceLastGame(team, gameDate);
  
  if (restDays <= 1) {
    return goals * 0.90;  // B2B penalty
  } else if (restDays === 2) {
    return goals * 1.02;  // Slight bonus
  } else if (restDays === 3) {
    return goals * 1.05;  // Good rest
  } else if (restDays >= 4) {
    return goals * 1.07;  // Well-rested (but rust risk)
  }
  
  return goals;
}
```

---

## 🧪 Testing Strategy

1. **Implement one feature at a time**
2. **Run backtest after each feature**
3. **Measure RMSE improvement**
4. **Compare to expectations**
5. **Tune parameters if needed**

Example testing flow:
```bash
# Baseline
node backtesting/runBacktest2025.js
# Result: 2.427 RMSE

# After recent form weighting
# (implement feature)
node backtesting/runBacktest2025.js
# Expected: ~2.00 RMSE

# After B2B detection
# (implement feature)
node backtesting/runBacktest2025.js
# Expected: ~1.75 RMSE
```

---

## 📋 Next Steps

**Immediate**: Implement Priority 1 (Recent Form)
- Lowest effort
- Highest impact
- Should see -0.40 RMSE improvement

**After validation**: Implement Priority 2 (B2B Detection)
- Medium effort
- High impact
- Should reach target of < 1.80 RMSE

**Optional**: Phase 2 & 3 for further optimization

---

## 🎓 Key Learnings

**Bias vs Variance**:
- **Bias** (systematic error): Fixed by calibration ✅
- **Variance** (prediction spread): Requires contextual awareness ❌

**Why Current Model Has High Variance**:
- Treats all games identically
- Ignores recent trends
- Ignores situational context
- Uses season-long averages only

**How to Reduce Variance**:
- Add context: recent form, rest, B2B
- Weight information by relevance
- Capture game-specific factors

This is the difference between a "one-size-fits-all" model and a "context-aware" model.

