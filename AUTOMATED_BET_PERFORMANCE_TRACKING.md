# 🤖 Automated Bet Performance Tracking

## Current System Overview

### What's Already Built ✅

1. **Bet Tracking System** (`src/firebase/betTracker.js`)
   - Saves recommended bets to Firebase
   - Stores: game info, bet details, predictions, EV%, rating
   - Status: `PENDING` → `COMPLETED`

2. **Performance Dashboard** (`src/components/PerformanceDashboard.jsx`)
   - Displays win rate, ROI, profit/loss
   - Breaks down by market (ML, TOTAL, etc.)
   - Breaks down by rating (A+, A, B+, etc.)
   - Shows recent bets table

3. **Live Score Fetching** (Firebase Function `updateLiveScores`)
   - Runs every 5 minutes
   - Fetches scores from NHL API
   - Saves to Firestore `live_scores/current`

### What's Missing ❌

**The gap:** Bets are saved as `PENDING`, but there's no automation to update them to `COMPLETED` with results!

---

## 🎯 Solution: Automated Bet Result Updater

### Option A: Firebase Function (RECOMMENDED) 🏆

**Pros:**
- Runs automatically every 5-10 minutes
- No local script needed
- Already have Firebase Functions set up
- Can run 24/7 without your computer

**Implementation:**

#### 1. Create New Firebase Function

**File:** `functions/index.js` (add this new function)

```javascript
exports.updateBetResults = onSchedule({
  schedule: "every 10 minutes",
  timeZone: "America/New_York",
  memory: "256MiB",
  timeoutSeconds: 120,
}, async () => {
  logger.info("Starting bet result update...");
  
  try {
    // Get today's and yesterday's PENDING bets
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    logger.info(`Checking bets for ${yesterdayStr} and ${today}`);
    
    // Get all PENDING bets
    const betsSnapshot = await admin.firestore()
        .collection("bets")
        .where("status", "==", "PENDING")
        .get();
    
    if (betsSnapshot.empty) {
      logger.info("No pending bets to update");
      return null;
    }
    
    logger.info(`Found ${betsSnapshot.size} pending bets`);
    
    // Get current live scores
    const liveScoresDoc = await admin.firestore()
        .collection("live_scores")
        .doc("current")
        .get();
    
    const liveGames = liveScoresDoc.data()?.games || [];
    
    // Only process FINAL games
    const finalGames = liveGames.filter((g) => g.status === "FINAL");
    logger.info(`Found ${finalGames.length} FINAL games`);
    
    let updatedCount = 0;
    
    // Process each pending bet
    for (const betDoc of betsSnapshot.docs) {
      const bet = betDoc.data();
      const betId = betDoc.id;
      
      // Find matching final game
      const matchingGame = finalGames.find((g) =>
        g.awayTeam === bet.game.awayTeam && g.homeTeam === bet.game.homeTeam
      );
      
      if (!matchingGame) {
        continue; // Game not final yet
      }
      
      logger.info(`Updating bet ${betId} with scores ${matchingGame.awayScore}-${matchingGame.homeScore}`);
      
      // Calculate outcome
      const outcome = calculateOutcome(matchingGame, bet.bet);
      const profit = calculateProfit(outcome, bet.bet.odds);
      
      // Update bet in Firestore
      await admin.firestore()
          .collection("bets")
          .doc(betId)
          .update({
            "result.awayScore": matchingGame.awayScore,
            "result.homeScore": matchingGame.homeScore,
            "result.totalScore": matchingGame.totalScore,
            "result.winner": matchingGame.awayScore > matchingGame.homeScore ? "AWAY" : "HOME",
            "result.outcome": outcome,
            "result.profit": profit,
            "result.fetched": true,
            "result.fetchedAt": admin.firestore.FieldValue.serverTimestamp(),
            "result.source": "NHL_API",
            "result.periodType": matchingGame.periodType || "REG",
            "status": "COMPLETED",
          });
      
      updatedCount++;
      logger.info(`✅ Updated ${betId}: ${outcome} → ${profit > 0 ? "+" : ""}${profit.toFixed(2)}u`);
    }
    
    logger.info(`Updated ${updatedCount} bets`);
    return null;
  } catch (error) {
    logger.error("Error updating bet results:", error);
    return null;
  }
});

// Helper: Calculate outcome (WIN/LOSS/PUSH)
function calculateOutcome(game, bet) {
  const totalScore = game.awayScore + game.homeScore;
  const awayWin = game.awayScore > game.homeScore;
  const homeWin = game.homeScore > game.awayScore;
  
  switch (bet.market) {
    case "TOTAL":
      if (bet.side === "OVER") {
        if (totalScore > bet.line) return "WIN";
        if (totalScore < bet.line) return "LOSS";
        return "PUSH";
      } else {
        if (totalScore < bet.line) return "WIN";
        if (totalScore > bet.line) return "LOSS";
        return "PUSH";
      }
    
    case "MONEYLINE":
      if (bet.side === "HOME") {
        return homeWin ? "WIN" : "LOSS";
      } else {
        return awayWin ? "WIN" : "LOSS";
      }
    
    case "PUCK_LINE":
    case "PUCKLINE":
      const spread = bet.line || 1.5;
      if (bet.side === "HOME") {
        const homeSpread = game.homeScore - game.awayScore;
        if (homeSpread > spread) return "WIN";
        if (homeSpread < spread) return "LOSS";
        return "PUSH";
      } else {
        const awaySpread = game.awayScore - game.homeScore;
        if (awaySpread > spread) return "WIN";
        if (awaySpread < spread) return "LOSS";
        return "PUSH";
      }
    
    default:
      return null;
  }
}

// Helper: Calculate profit in units
function calculateProfit(outcome, odds) {
  if (outcome === "PUSH") return 0;
  if (outcome === "LOSS") return -1;
  
  // WIN
  if (odds < 0) {
    return 100 / Math.abs(odds); // e.g., -110 → 0.909 units
  } else {
    return odds / 100; // e.g., +150 → 1.5 units
  }
}
```

#### 2. Deploy Firebase Function

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
firebase deploy --only functions:updateBetResults
```

#### 3. How It Works

```
Every 10 minutes:
┌─────────────────────────────────────────────────────┐
│ 1. Fetch all PENDING bets from Firestore           │
│ 2. Fetch all FINAL games from live_scores          │
│ 3. Match bets to games (awayTeam + homeTeam)       │
│ 4. Calculate WIN/LOSS/PUSH outcome                 │
│ 5. Calculate profit (+0.91u, -1.00u, etc.)         │
│ 6. Update bet status to COMPLETED                  │
│ 7. Log results                                      │
└─────────────────────────────────────────────────────┘
```

---

### Option B: Local Node.js Script

**Pros:**
- More control, easier debugging
- Can run on-demand

**Cons:**
- Requires your computer to be on
- Manual execution or cron job setup

**File:** `updateBetResults.js`

```javascript
const admin = require("firebase-admin");
const serviceAccount = require("./service Account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updateBetResults() {
  console.log("🔄 Checking for pending bets...");
  
  // Get PENDING bets
  const betsSnapshot = await db
      .collection("bets")
      .where("status", "==", "PENDING")
      .get();
  
  if (betsSnapshot.empty) {
    console.log("✅ No pending bets");
    return;
  }
  
  console.log(`📊 Found ${betsSnapshot.size} pending bets`);
  
  // Get live scores
  const liveScoresDoc = await db.collection("live_scores").doc("current").get();
  const liveGames = liveScoresDoc.data()?.games || [];
  const finalGames = liveGames.filter((g) => g.status === "FINAL");
  
  console.log(`🏁 Found ${finalGames.length} FINAL games`);
  
  let updated = 0;
  
  for (const betDoc of betsSnapshot.docs) {
    const bet = betDoc.data();
    const betId = betDoc.id;
    
    // Find matching game
    const game = finalGames.find(
        (g) => g.awayTeam === bet.game.awayTeam && g.homeTeam === bet.game.homeTeam
    );
    
    if (!game) continue;
    
    // Calculate outcome
    const outcome = calculateOutcome(game, bet.bet);
    const profit = calculateProfit(outcome, bet.bet.odds);
    
    // Update
    await db.collection("bets").doc(betId).update({
      "result.awayScore": game.awayScore,
      "result.homeScore": game.homeScore,
      "result.totalScore": game.totalScore,
      "result.winner": game.awayScore > game.homeScore ? "AWAY" : "HOME",
      "result.outcome": outcome,
      "result.profit": profit,
      "result.fetched": true,
      "result.fetchedAt": Date.now(),
      "result.source": "NHL_API",
      "status": "COMPLETED",
    });
    
    console.log(`✅ ${betId}: ${outcome} → ${profit > 0 ? "+" : ""}${profit.toFixed(2)}u`);
    updated++;
  }
  
  console.log(`\n✅ Updated ${updated} bets`);
}

// (Add calculateOutcome and calculateProfit functions here - same as above)

updateBetResults().then(() => process.exit(0));
```

**Run manually:**
```bash
node updateBetResults.js
```

**Run automatically (macOS cron):**
```bash
# Edit crontab
crontab -e

# Add this line (runs every 10 minutes)
*/10 * * * * cd /Users/dalekolnitys/NHL\ Savant/nhl-savant && node updateBetResults.js >> bet_updates.log 2>&1
```

---

## 📊 Performance Dashboard Access

### Current Status
The Performance Dashboard (`/performance` route) already exists and displays:
- Win Rate (target: 52-58%)
- ROI (target: 3-8%)
- Total Profit (in units)
- Bets Tracked count
- Win/Loss/Push breakdown
- Performance by Market (ML, TOTAL, etc.)
- Performance by Rating (A+, A, B+, etc.)
- Recent Bets table

### How to Access
Navigate to: `http://localhost:5173/performance` (local) or `https://dpk1212.github.io/nhl-savant/#/performance` (live)

---

## 🚀 Implementation Plan

### Step 1: Add Firebase Function (15 min)
1. Add `updateBetResults` function to `functions/index.js`
2. Add helper functions (`calculateOutcome`, `calculateProfit`)
3. Deploy: `firebase deploy --only functions:updateBetResults`
4. Verify in Firebase Console (Functions tab)

### Step 2: Test with Real Data (5 min)
1. Wait for a game to finish
2. Check Firebase Console → Firestore → `bets` collection
3. Verify status changed from `PENDING` to `COMPLETED`
4. Check `result` fields are populated

### Step 3: Verify Performance Dashboard (5 min)
1. Navigate to `/performance` route
2. Confirm stats are calculating correctly
3. Check Recent Bets table shows completed bets

### Step 4: Monitor & Iterate
- Check Firebase Function logs for any errors
- Adjust schedule if needed (every 10 min is good default)
- Consider adding email notifications for daily summaries

---

## 🎨 Premium Enhancements (Future)

### 1. Real-time Performance Widget
Add a live performance widget to the home page:
- Today's W-L record
- Today's P&L
- Win rate trend (last 7 days)

### 2. Notifications
- Email daily summary (win rate, profit)
- Push notification when bets are graded
- Slack/Discord integration

### 3. Advanced Analytics
- Closing Line Value (CLV) tracking
- Model calibration metrics
- Bet sizing recommendations (Kelly Criterion)
- Streak tracking (winning/losing)

### 4. Export & Reports
- CSV export of all bets
- Monthly performance reports
- PDF summary reports

---

## 💡 Key Decisions

### Recommended Approach
**Use Firebase Function (Option A)** because:
1. Already have Functions deployed
2. No local machine needed
3. Runs 24/7 automatically
4. Same infrastructure as live scores
5. Easy to monitor via Firebase Console

### Frequency
**Every 10 minutes** is optimal because:
- Games end at known times (usually 10 PM, 11 PM, 12 AM ET)
- Not too aggressive (cost-efficient)
- Fast enough to grade bets within 10-30 min of game ending
- Can be adjusted to every 5 or 15 minutes if needed

### Data Source
**Use live_scores from Firestore** (not direct NHL API) because:
- Already fetched and cached
- Consistent format
- No additional API calls
- Same data used for live game display

---

## 📁 Files to Modify

### Option A (Firebase Function)
- `functions/index.js` - Add `updateBetResults` function

### Option B (Local Script)
- `updateBetResults.js` (NEW) - Standalone script
- `package.json` - Add script entry: `"grade-bets": "node updateBetResults.js"`

---

## 🧪 Testing Checklist

- [ ] Function deploys successfully
- [ ] Function runs every 10 minutes (check logs)
- [ ] PENDING bets are found
- [ ] FINAL games are matched correctly
- [ ] WIN outcome calculated correctly
- [ ] LOSS outcome calculated correctly
- [ ] PUSH outcome calculated correctly
- [ ] Profit calculated correctly (WIN: +0.91u, LOSS: -1u, PUSH: 0u)
- [ ] Bet status updated to COMPLETED
- [ ] Performance Dashboard displays updated stats
- [ ] Recent Bets table shows completed bets
- [ ] Win rate calculates correctly
- [ ] ROI calculates correctly
- [ ] Profit total is accurate

---

## 📈 Expected Results

### After 1 Week
- 20-30 bets graded automatically
- Win rate visible (hopefully 52-58%!)
- ROI tracking (hopefully 3-8%!)
- Performance by market breakdown
- Confidence in model accuracy

### After 1 Month
- 80-120 bets graded
- Statistical significance achieved
- Model calibration insights
- Rating system validation (A+ bets should win more)
- Data-driven model improvements

---

## 🎯 Next Steps

1. **Review this plan** - Confirm approach makes sense
2. **Implement Firebase Function** - Add code to `functions/index.js`
3. **Deploy and test** - Verify with real game data
4. **Monitor Performance Dashboard** - Watch your model's accuracy!
5. **Iterate and improve** - Use data to refine predictions

**Ready to implement?** Let me know and I'll add the Firebase Function code! 🚀

