# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "nhl-savant"
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Get Firebase Credentials

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app with nickname "NHL Savant Web"
5. Copy the config values

## Step 3: Create .env File

Create a file called `.env` in the `nhl-savant/` directory with:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=nhl-savant.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nhl-savant
VITE_FIREBASE_STORAGE_BUCKET=nhl-savant.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase config.

## Step 4: Enable Firestore

1. In Firebase Console, click **Firestore Database** in the left menu
2. Click "Create database"
3. Select "Start in **production mode**"
4. Choose a location (closest to you, e.g., `us-central`)
5. Click "Enable"

## Step 5: Set Up Security Rules

In Firestore, go to the "Rules" tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read bets and performance data
    match /bets/{betId} {
      allow read: if true;
      allow write: if true; // TODO: Add auth later
    }
    
    match /daily_summaries/{summaryId} {
      allow read: if true;
      allow write: if true; // TODO: Add auth later
    }
    
    match /performance_metrics/{metricId} {
      allow read: if true;
      allow write: if true; // TODO: Add auth later
    }
  }
}
```

Click "Publish".

## Step 6: Create Indexes

In Firestore, go to the "Indexes" tab and create these composite indexes:

1. **Collection:** `bets`
   - **Fields:**
     - `status` (Ascending)
     - `timestamp` (Descending)
   - **Query scope:** Collection
   
2. **Collection:** `bets`
   - **Fields:**
     - `date` (Ascending)
     - `timestamp` (Descending)
   - **Query scope:** Collection

Or wait for Firebase to auto-suggest indexes when you run the app (errors will appear in console with a link to create the index).

## Step 7: Test Locally

```bash
npm run dev
```

Navigate to http://localhost:5173/ and check the browser console. You should see:

```
📊 Found X betting opportunities to track
✅ Saved bet: 2024-10-22_NYI_SJS_TOTAL_UNDER_6.0
```

Go to Firebase Console > Firestore Database and verify bets are being saved.

## Step 8: Deploy Cloud Functions (Optional - for auto-fetching results)

This is optional but recommended for automatically fetching game results.

### Install Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

### Initialize Functions:

```bash
cd /Users/dalekolnitys/NHL\ Savant/nhl-savant
firebase init
```

Select:
- ✅ Functions
- Use existing project: `nhl-savant`
- Language: JavaScript
- ESLint: No
- Install dependencies: Yes

### Create the Function:

Create `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// Run every hour to check for game results
exports.fetchGameResults = functions.pubsub.schedule('0 * * * *').onRun(async (context) => {
  const db = admin.firestore();
  
  // Get all pending bets
  const pendingBets = await db.collection('bets')
    .where('status', '==', 'PENDING')
    .get();
  
  console.log(`📊 Checking ${pendingBets.size} pending bets`);
  
  for (const doc of pendingBets.docs) {
    const bet = doc.data();
    
    // Check if game time has passed (allow 3 hours for game to complete)
    const gameTime = bet.game.actualStartTime || Date.parse(bet.date + ' ' + bet.game.gameTime);
    const now = Date.now();
    const threeHoursAgo = now - (3 * 60 * 60 * 1000);
    
    if (gameTime > threeHoursAgo) continue; // Too early
    
    try {
      // Fetch result from NHL API
      const result = await fetchNHLGameResult(bet.game.awayTeam, bet.game.homeTeam, bet.date);
      
      if (result) {
        // Calculate outcome
        const outcome = calculateOutcome(result, bet.bet);
        const profit = calculateProfit(outcome, bet.bet.odds);
        
        // Update bet
        await doc.ref.update({
          'result.awayScore': result.awayScore,
          'result.homeScore': result.homeScore,
          'result.totalScore': result.awayScore + result.homeScore,
          'result.winner': result.awayScore > result.homeScore ? 'AWAY' : 'HOME',
          'result.outcome': outcome,
          'result.profit': profit,
          'result.fetched': true,
          'result.fetchedAt': Date.now(),
          'result.source': 'NHL_API',
          'status': 'COMPLETED'
        });
        
        console.log(`✅ Updated ${doc.id}: ${outcome} (${profit} units)`);
      }
    } catch (error) {
      console.error(`❌ Error fetching result for ${doc.id}:`, error);
    }
  }
  
  return null;
});

async function fetchNHLGameResult(awayTeam, homeTeam, date) {
  // NHL API endpoint
  const url = `https://api-web.nhle.com/v1/schedule/${date}`;
  
  try {
    const response = await axios.get(url);
    const games = response.data.gameWeek?.[0]?.games || [];
    
    const game = games.find(g => 
      g.awayTeam.abbrev === awayTeam && g.homeTeam.abbrev === homeTeam
    );
    
    if (!game || game.gameState !== 'OFF') return null; // Not finished
    
    return {
      awayScore: game.awayTeam.score,
      homeScore: game.homeTeam.score
    };
  } catch (error) {
    console.error('NHL API error:', error);
    return null;
  }
}

function calculateOutcome(result, bet) {
  switch (bet.market) {
    case 'TOTAL':
      if (bet.side === 'OVER') {
        if (result.totalScore > bet.line) return 'WIN';
        if (result.totalScore < bet.line) return 'LOSS';
        return 'PUSH';
      } else {
        if (result.totalScore < bet.line) return 'WIN';
        if (result.totalScore > bet.line) return 'LOSS';
        return 'PUSH';
      }
    
    case 'MONEYLINE':
      if (bet.side === 'HOME') {
        return result.winner === 'HOME' ? 'WIN' : 'LOSS';
      } else {
        return result.winner === 'AWAY' ? 'WIN' : 'LOSS';
      }
    
    default:
      return null;
  }
}

function calculateProfit(outcome, odds) {
  if (outcome === 'PUSH') return 0;
  if (outcome === 'LOSS') return -1;
  
  // WIN
  if (odds < 0) {
    return 100 / Math.abs(odds);
  } else {
    return odds / 100;
  }
}
```

### Install axios:

```bash
cd functions
npm install axios
cd ..
```

### Deploy:

```bash
firebase deploy --only functions
```

## Step 9: Monitor Performance

1. Navigate to http://localhost:5173/#/performance
2. You should see "No bet data yet" initially
3. As bets are tracked, they'll appear here
4. After games complete and Cloud Function runs, you'll see Win/Loss/ROI stats

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules
- Make sure `.env` file exists and has correct values

### Bets not saving
- Check browser console for errors
- Verify Firebase config in `.env`
- Make sure Firestore is enabled

### Performance page is empty
- Bets need to have `status: 'COMPLETED'` to show on performance page
- Cloud Function will auto-update results, or manually update in Firestore Console

### Indexes not created
- Click the link in the console error to auto-create
- Or manually create in Firebase Console > Firestore > Indexes

## Manual Result Entry (for testing)

To manually mark a bet as complete in Firestore:

1. Go to Firebase Console > Firestore Database
2. Find a bet document
3. Edit the document:
   - `status`: "COMPLETED"
   - `result.awayScore`: e.g., 3
   - `result.homeScore`: e.g., 2
   - `result.totalScore`: 5
   - `result.winner`: "AWAY" or "HOME"
   - `result.outcome`: "WIN", "LOSS", or "PUSH"
   - `result.profit`: calculated value (e.g., 0.909 for winning -110 bet)
   - `result.fetched`: true
   - `result.source`: "MANUAL"

## Next Steps

1. ✅ Test bet tracking locally
2. ✅ Verify bets appear in Firestore
3. ✅ Manually complete a bet to test Performance page
4. ⏳ Deploy Cloud Function (optional)
5. ⏳ Deploy to production with `npm run deploy`
6. ⏳ Track for 1-2 weeks to validate model performance

