# Tuesday 10/21 Tracking Instructions

## What We Just Did

Modified the system to capture Tuesday's predictions before updating to Wednesday's games.

---

## Step-by-Step Process

### ✅ Step 1: Date Parser Modified (DONE)

The `oddsTraderParser.js` now looks for **Tuesday 10/21** games instead of today (Wednesday).

### Step 2: Load Tuesday's Games and Track Predictions

1. **Refresh your browser** at: http://localhost:5176/nhl-savant/
2. Navigate to **"Today's Games"** (it will show Tuesday's games)
3. **Open browser console** (F12)
4. Look for these messages:
   ```
   🏒 TEMPORARY: Using YESTERDAY's date to capture Tuesday predictions
   🏒 Starting OddsTrader parser... Looking for: TUE 10/21
   📊 Found X betting opportunities to track
   ✅ Saved bet: 2024-10-21_SJS_NYI_...
   ✅ Saved bet: 2024-10-21_NJD_PHI_...
   (etc.)
   ```

### Step 3: Verify Bets in Firebase

1. Go to Firebase Console: https://console.firebase.google.com/project/nhl-savant/firestore
2. Click **"bets"** collection
3. You should see documents for Tuesday's games with `status: "PENDING"`

### Step 4: Fetch Tuesday's Results and Update Bets

Run this command:

```bash
npm run update-results
```

This script will:
- ✅ Fetch Tuesday's game scores from NHL API
- ✅ Match each bet to its game result
- ✅ Calculate WIN/LOSS/PUSH outcome
- ✅ Calculate profit for each bet
- ✅ Update all Tuesday bets in Firebase to `status: "COMPLETED"`

Example output:
```
🏒 NHL Result Fetcher - Tuesday 10/21/2024
==========================================

📡 Fetching results from NHL API...
✅ Found 4 games

📊 Fetching pending bets from Firebase...
✅ Found 8 pending Tuesday bets

✅ SJS @ NYI (2-4)
   Bet: UNDER 6.0 → WIN (+0.91u)

✅ NJD @ PHI (3-5)
   Bet: OVER 6.5 → WIN (+0.91u)

(etc...)

==========================================
✅ Updated: 8 bets
==========================================

🎯 Check the Performance Dashboard to see your results!
```

### Step 5: View Performance Dashboard

1. Wait for Firestore index to finish building (check Firebase Console > Indexes)
2. Navigate to: http://localhost:5176/nhl-savant/#/performance
3. You should see:
   - ✅ Win Rate, ROI, Total Profit
   - ✅ Recent Bets table with Tuesday's results
   - ✅ Performance by Market breakdown
   - ✅ Performance by Rating breakdown

### Step 6: Revert Date Parser to Normal

After you've captured Tuesday's data, we need to revert the parser to use today's date:

**File:** `src/utils/oddsTraderParser.js` (lines 49-62)

**Change FROM:**
```javascript
// TEMPORARY FIX: Use YESTERDAY's date to capture Tuesday 10/21 predictions
const actualToday = new Date();
const today = new Date(actualToday);
today.setDate(today.getDate() - 1); // Go back one day to Tuesday

const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const dayOfWeek = dayNames[today.getDay()];
const month = today.getMonth() + 1;
const day = today.getDate();
const todayPattern = `${dayOfWeek} ${month}/${day}`;

console.log(`🏒 TEMPORARY: Using YESTERDAY's date to capture Tuesday predictions`);
console.log(`🏒 Starting OddsTrader parser... Looking for: ${todayPattern}`);
```

**Change TO:**
```javascript
// Generate today's date pattern dynamically (e.g., "WED 10/22")
const today = new Date();
const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const dayOfWeek = dayNames[today.getDay()];
const month = today.getMonth() + 1;
const day = today.getDate();
const todayPattern = `${dayOfWeek} ${month}/${day}`;

console.log(`🏒 Starting OddsTrader parser... Looking for: ${todayPattern}`);
```

### Step 7: Update to Wednesday's Games

1. Update `public/odds_money.md` with Wednesday's odds
2. Update `public/odds_total.md` with Wednesday's odds
3. Update `public/teams.csv` with latest team stats (if available)
4. Push to GitHub
5. System will now track Wednesday's games normally

---

## Troubleshooting

### "No bets found to update"
→ Make sure you loaded Today's Games page first to track predictions

### "Index still building"
→ Wait 1-2 minutes for Firestore index to complete
→ Check: Firebase Console > Firestore > Indexes tab

### "Permission denied" errors
→ Verify Firestore security rules are set correctly (see FIREBASE_SETUP.md)

### Script fails with "Missing credentials"
→ Make sure `.env` file exists with Firebase credentials

---

## What This Proves

By tracking Tuesday's predictions and comparing to actual results, you can:

✅ Validate model accuracy  
✅ Calculate actual ROI  
✅ See which market types perform best  
✅ See which rating levels (A+, A, B+) are most profitable  
✅ Identify systematic bias (UNDER/OVER)  
✅ Build confidence in the model  

---

## Going Forward

For future days, the workflow is:

1. Morning: Update odds files with today's games
2. System automatically tracks predictions to Firebase
3. Next day: Run `npm run update-results` to fetch yesterday's scores
4. View Performance Dashboard to see cumulative ROI

Or deploy the Cloud Function (see FIREBASE_SETUP.md) to auto-fetch results every hour!

