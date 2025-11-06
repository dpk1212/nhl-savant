# Bookmark Results Automation

## Overview

The "My Picks" feature allows users to bookmark recommended bets and track their performance. Results are automatically updated every morning after overnight games finish.

## How It Works

### 1. **User Bookmarks a Pick**
- User clicks the bookmark button on a recommended bet
- Bookmark stored in Firestore `user_bookmarks` collection with:
  - Game info (teams, date, time)
  - Bet info (pick, odds, market, rating, EV%)
  - User ID (anonymous, stored in localStorage)
  - Timestamp

### 2. **Games Are Played**
- NHL games finish overnight
- Our existing bet tracking system (`updateLiveScores.js`) fetches final scores
- Results are written to `bets` collection with outcomes (WIN/LOSS/PUSH) and profit

### 3. **Automated Morning Update (8 AM ET)**
- GitHub Action runs `scripts/updateBookmarkResults.js`
- Script:
  1. Fetches all pending bookmarks from yesterday and today
  2. Fetches all bet results from Firebase
  3. Matches bookmarks to results using:
     - Bet ID (primary)
     - Game + Pick + Market (fallback)
  4. Updates bookmark documents with:
     - `result.outcome` ('WIN', 'LOSS', 'PUSH')
     - `result.profit` (profit in units, e.g., +0.83u or -1.00u)
     - `result.updatedAt` (timestamp)

### 4. **Users See Updated Results**
- When users visit "My Picks" page, bookmarks load with results
- Stats automatically calculated: Win Rate, Total Profit, Pending count
- No client-side matching needed - data is ready to display

## Files

### Script
- **`scripts/updateBookmarkResults.js`** - Main automation script
  - Fetches pending bookmarks
  - Matches with bet results
  - Updates Firestore documents

### Workflow
- **`.github/workflows/update-bookmark-results.yml`** - GitHub Action
  - Runs daily at 8 AM ET (1 PM UTC)
  - Uses Firebase Admin SDK with service account
  - Logs summary of updates

### Data Structure

#### Bookmark Document (`user_bookmarks` collection)
```javascript
{
  id: "anon_123_2024-11-06_TOR_BOS",
  userId: "anon_123...",
  betId: "2024-11-06_TOR_BOS_MONEYLINE_TOR",
  bookmarkedAt: 1730923456789,
  
  game: {
    awayTeam: "TOR",
    homeTeam: "BOS",
    gameTime: "7:00 PM",
    gameDate: "2024-11-06"
  },
  
  bet: {
    market: "MONEYLINE",
    pick: "TOR ML",
    odds: 125,
    evPercent: 4.4,
    rating: "B",
    team: "TOR"
  },
  
  // ADDED BY AUTOMATION:
  result: {
    outcome: "WIN",      // 'WIN', 'LOSS', or 'PUSH'
    profit: 0.83,        // profit in units (can be negative)
    updatedAt: 1730987654321
  },
  lastUpdated: 1730987654321
}
```

## Matching Strategy

The script uses a robust two-stage matching process:

### Stage 1: Bet ID Match (Primary)
```javascript
bookmark.betId === bet.betId
```
- Most reliable if betId is consistent
- Direct 1:1 match

### Stage 2: Game + Pick + Market Match (Fallback)
```javascript
bookmark.game.awayTeam === bet.awayTeam &&
bookmark.game.homeTeam === bet.homeTeam &&
bookmark.bet.market === bet.market &&
(bookmark.bet.pick === bet.pick || bookmark.bet.team === bet.team)
```
- Used if betId match fails
- Accounts for betId format changes
- Robust against data inconsistencies

## Schedule

| Time (ET) | Event |
|-----------|-------|
| **7:00-11:00 PM** | NHL games played |
| **11:00 PM-2:00 AM** | Final scores updated by live score tracker |
| **8:00 AM** | Bookmark results automation runs |
| **8:00 AM+** | Users see updated results in "My Picks" |

## Manual Execution

### Run Locally (for testing):
```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
npm run update-bookmarks
```

### Trigger GitHub Action Manually:
1. Go to GitHub → Actions
2. Select "Update Bookmark Results" workflow
3. Click "Run workflow"

## Monitoring

### Script Output:
```
🚀 Starting Bookmark Results Update
📅 Date: 2024-11-06T13:00:00.000Z

📆 Processing bookmarks from: 2024-11-05 and 2024-11-06

📚 Fetching pending bookmarks...
   Found 3 pending bookmarks

🎲 Fetching bet results from Firebase...
   Found 87 bet results

🔄 Matching and updating bookmarks...
==================================================
📝 Updating: TOR @ BOS - TOR ML → WIN (+0.83u)
📝 Updating: STL @ WSH - STL ML → LOSS (-1.00u)
⏳ No result yet: COL @ DAL - COL ML

==================================================
📊 Update Summary:
   ✅ Updated: 2
   ⏳ Pending: 1
   ❌ Errors: 0

✨ Bookmark Results Update Complete
==================================================
```

### Success Indicators:
- ✅ Updated count matches finished games
- ⏳ Pending count shows future/live games
- ❌ Error count is zero

### Failure Scenarios:
1. **No bet results found**: Games haven't finished yet
2. **No matches**: betId format changed or data inconsistency
3. **Firebase errors**: Permissions or quota issues

## Firestore Security Rules

Bookmark documents need to be writable by the server (Firebase Admin SDK):

```javascript
// From firestore.rules
match /user_bookmarks/{bookmarkId} {
  allow read: if true; // Anyone can read their own bookmarks
  allow write: if true; // Allow client-side bookmarking
  // Note: Server-side updates bypass security rules
}
```

## Benefits

1. **Automatic Updates**: No manual work required
2. **Server-Side Processing**: Reliable, consistent
3. **All Users Updated**: Everyone sees results simultaneously
4. **Efficient**: Runs once per day, updates in batch
5. **Robust Matching**: Multiple fallback strategies
6. **Real-Time Display**: Client just reads pre-computed data

## Future Enhancements

- **Push Notifications**: Alert users when picks win/lose
- **Email Digest**: Send morning summary of overnight results
- **Historical Analysis**: Track long-term bookmark performance
- **Social Sharing**: Allow users to share their "My Picks" performance

## Troubleshooting

### Bookmarks not updating?
1. Check GitHub Actions log for errors
2. Verify Firebase credentials are set
3. Ensure `bets` collection has results
4. Check betId format consistency

### Wrong results showing?
1. Verify matching logic in script
2. Check for duplicate bookmarks
3. Ensure game dates are correct
4. Review betId formatting

### Performance issues?
1. Add indexes to Firestore queries
2. Batch updates more efficiently
3. Limit date range for bookmarks
4. Cache bet results in memory

## Testing

### Test with sample data:
```bash
# 1. Bookmark a bet from today's games
# 2. Wait for game to finish and bet result to be written
# 3. Run script manually:
npm run update-bookmarks

# 4. Check bookmark in Firestore Console:
# - Should have `result` field with outcome and profit
# - `lastUpdated` timestamp should be recent
```

### Verify in UI:
1. Open "My Picks" page
2. Check that pending picks show "PENDING"
3. Check that finished picks show WIN/LOSS
4. Verify profit calculations are correct

---

**Status:** ✅ Implemented and deployed
**Last Updated:** November 6, 2024

