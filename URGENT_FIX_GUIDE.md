# 🚨 URGENT: Fix Model Accuracy NOW

**Your model has 38% win accuracy - it's predicting the WRONG team 62% of the time!**

---

## ⚡ QUICK FIX (30 minutes)

### Step 1: Find Optimal Calibration (5 minutes)

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
node scripts/testCalibrations.js
```

This will output the best calibration settings. Look for the **TOP 1** result.

### Step 2: Update Calibration Constants (2 minutes)

Open `src/utils/dataProcessing.js` and update these values with what the test found:

```javascript
// CURRENT (line ~30):
const CALIBRATION_CONSTANT = 1.52;

// UPDATE TO (example - use YOUR test results):
const CALIBRATION_CONSTANT = 1.65;  // ← YOUR OPTIMAL VALUE HERE
```

Also check the win probability k parameter (line ~350):

```javascript
// CURRENT:
const k = 0.55;

// UPDATE TO (example - use YOUR test results):
const k = 0.60;  // ← YOUR OPTIMAL VALUE HERE
```

### Step 3: Verify the Fix (5 minutes)

```bash
node scripts/comprehensiveBacktest.js
```

**Target:** Win accuracy should jump from 38% → 50%+

If it doesn't, there's a BUG in the prediction logic (see next section).

---

## 🔍 IF ACCURACY IS STILL LOW (Debug Mode)

### Check if Home/Away Logic is Inverted

Add logging to `src/utils/dataProcessing.js` in the `predictTeamScore` function:

```javascript
predictTeamScore(team, opponent, isHome, goalievsTeam = null, gameDate = null) {
  console.log(`🏒 Predicting: ${team} (${isHome ? 'HOME' : 'AWAY'}) vs ${opponent}`);
  
  // ... existing code ...
  
  const finalScore = /* your calculation */;
  console.log(`   → Final predicted score: ${finalScore.toFixed(2)}`);
  
  return finalScore;
}
```

Run a single game prediction and verify:
1. Home team gets HOME ice advantage bonus
2. Away team does NOT get home ice advantage
3. Scores make sense (typically 2.5-4.0 goals)

---

## 🎯 WHAT THE NUMBERS MEAN

### Your Current Performance (CRITICAL):

| Metric | Current | What It Means |
|--------|---------|---------------|
| **38% Win Accuracy** | 🔴 | You're picking the WRONG team 62% of the time |
| **3.247 Goals RMSE** | 🔴 | Off by 3+ goals per game on average |
| **0.2711 Brier Score** | 🟡 | Poor probability calibration |

### After Quick Fix (Expected):

| Metric | Expected | What It Means |
|--------|----------|---------------|
| **50-55% Win Accuracy** | 🟡 | Better than coin flip, still needs work |
| **2.2-2.5 Goals RMSE** | 🟡 | Off by 2 goals per game (acceptable) |
| **0.23-0.25 Brier Score** | 🟡 | Decent probability calibration |

### After Full Implementation (Target):

| Metric | Target | What It Means |
|--------|--------|---------------|
| **58-62% Win Accuracy** | ✅ | Professional-grade prediction |
| **1.7-2.0 Goals RMSE** | ✅ | Industry standard accuracy |
| **0.18-0.22 Brier Score** | ✅ | Excellent calibration |

---

## 🔧 NEXT: Implement Recency Weighting (2 hours)

**Why:** Teams change over the season. Recent games matter more.

### Add to `src/utils/dataProcessing.js`:

```javascript
/**
 * Calculate team strength with recency weighting
 * 60% weight to last 10 games, 40% to full season
 */
getRecentAdjustedXGF(team) {
  const allGames = this.getTeamGames(team);
  const recentGames = allGames.slice(-10);  // Last 10 games
  
  if (recentGames.length < 5) {
    // Not enough recent games, use season average
    return this.getSeasonXGF(team);
  }
  
  const recentXGF = this.calculateAvgXGF(recentGames);
  const seasonXGF = this.calculateAvgXGF(allGames);
  
  // 60% recent, 40% season
  return (recentXGF * 0.6) + (seasonXGF * 0.4);
}
```

### Update `predictTeamScore` to use recent form:

```javascript
predictTeamScore(team, opponent, isHome, goalievsTeam = null, gameDate = null) {
  // OLD:
  const teamXGF = this.getTeamXGF(team);
  
  // NEW:
  const teamXGF = this.getRecentAdjustedXGF(team);  // ← Use recent form
  
  // ... rest of function ...
}
```

**Expected impact:**
- Win accuracy: +3-5 percentage points
- RMSE: -0.3 to -0.5 goals
- Better captures hot/cold streaks

---

## 📊 TESTING AFTER EACH FIX

Always run the backtest after making changes:

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
node scripts/comprehensiveBacktest.js
```

**Watch these metrics:**
1. **Win Accuracy** - Should increase with each fix
2. **Goals RMSE** - Should decrease toward 2.0
3. **Betting ROI** - This number is currently FAKE (simulated odds), ignore for now

---

## 🎓 UNDERSTANDING THE CALIBRATION

### What Does Calibration Constant Do?

```javascript
const CALIBRATION_CONSTANT = 1.52;  // Current

// Higher value (1.60) → Predicts MORE goals
// Lower value (1.45) → Predicts FEWER goals
```

**Your current issue:** RMSE is high (3.247), meaning predictions are ALL OVER THE PLACE
- Sometimes predicting way too high
- Sometimes predicting way too low
- Not a consistent bias (only +0.13 average)

**Fix:** Test different constants to find one that minimizes variance

### What Does k Parameter Do?

```javascript
const k = 0.55;  // Current (win probability sensitivity)

// Higher k (0.65) → More confident in favorites (bigger win prob gaps)
// Lower k (0.45) → Less confident in favorites (smaller win prob gaps)
```

**Your current issue:** 38% win accuracy suggests model is wrong about WHO is the favorite

**Fix:** k parameter won't help if you're picking wrong teams. Focus on calibration constant first.

---

## 🚨 CRITICAL BUGS TO CHECK

### 1. Is Home Ice Advantage Inverted?

```javascript
// CORRECT:
if (isHome) {
  score *= (1 + HOME_ICE_ADVANTAGE);  // Multiply by 1.035 (3.5% boost)
}

// WRONG:
if (!isHome) {
  score *= (1 + HOME_ICE_ADVANTAGE);  // This would boost AWAY team!
}
```

### 2. Are Poisson Parameters in Wrong Order?

```javascript
// CORRECT:
const homeWinProb = calculatePoissonWinProb(homeScore, awayScore);
// First param = team you're calculating prob for
// Second param = opponent score

// WRONG:
const homeWinProb = calculatePoissonWinProb(awayScore, homeScore);
// This would give you AWAY win probability, not HOME!
```

### 3. Is Goalie Adjustment Backwards?

```javascript
// CORRECT: Elite goalie → FEWER goals against
if (goalie.GSAE > 0) {
  oppScore *= (1 - adjustment);  // Reduce opponent's expected goals
}

// WRONG: Elite goalie → MORE goals against
if (goalie.GSAE > 0) {
  oppScore *= (1 + adjustment);  // This would INCREASE opponent goals!
}
```

---

## ✅ SUCCESS CHECKLIST

After fixes, you should see:

- [ ] Win accuracy > 50% (better than coin flip)
- [ ] Win accuracy > 55% (profitable territory)
- [ ] Goals RMSE < 2.5 (acceptable)
- [ ] Goals RMSE < 2.0 (target)
- [ ] Brier score < 0.25 (good)
- [ ] Brier score < 0.23 (professional)

---

## 🆘 IF YOU'RE STUCK

### Common Issues:

**"Calibration test is taking forever"**
- It tests 315 combinations, takes 5-10 minutes
- Let it finish, results will be worth it

**"Win accuracy didn't improve after calibration"**
- You likely have a LOGIC BUG (see section above)
- Check home/away parameters, Poisson parameters, goalie adjustments

**"RMSE improved but win accuracy didn't"**
- Your goals predictions are more accurate
- But win probability calculation is still broken
- Check the k parameter and Poisson logic

**"Both improved but still below target"**
- Good! You fixed the major bugs
- Now implement recency weighting for final +5-10 percentage points

---

## 📞 NEXT STEPS

1. **RIGHT NOW:** Run calibration test (5 min)
2. **TODAY:** Apply optimal calibration (2 min)
3. **TODAY:** Verify fix with backtest (5 min)
4. **THIS WEEK:** Add recency weighting (2 hours)
5. **THIS WEEK:** Add situational adjustments (2 hours)
6. **NEXT WEEK:** Fine-tune and validate (ongoing)

---

**Bottom line:** Your model is currently LOSING MONEY. These fixes will get you back to profitability within hours to days, not weeks.

Run that calibration test NOW:
```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
node scripts/testCalibrations.js
```

