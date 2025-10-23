# NHL Live Scores Update Guide 🏒

## Overview

This guide explains how to update live NHL scores **WITHOUT rescraping odds**. The system:

1. ✅ Shows yesterday's games until 6 AM (so late games stay visible after midnight)
2. ✅ Updates scores 2-3 times during game time from NHL API
3. ✅ **Does NOT** rescrape odds (odds stay frozen from initial scrape)
4. ✅ Optionally updates Firebase results
5. ✅ Works with Python (free NHL API)

---

## Part 1: Yesterday's Games Until Morning ✅ IMPLEMENTED

**What Changed:**
- `src/utils/oddsTraderParser.js` now includes yesterday's games if before 6 AM
- After midnight, games from the previous day remain visible until 6 AM

**How it Works:**
```javascript
const includeYesterday = currentHour < 6; // Before 6 AM
const isMatchingDate = line.includes(todayPattern) || 
                       (includeYesterday && line.includes(yesterdayPattern));
```

**User Experience:**
- 11:00 PM: Shows today's games (e.g., Oct 22)
- 12:05 AM: Still shows Oct 22 games (now "yesterday")
- 6:00 AM: Switches to only showing Oct 23 games

---

## Part 2: Live Score Updates (Python Script)

### Setup

#### 1. Install Python Requirements

```bash
cd nhl-savant
pip install requests python-dotenv firebase-admin
```

#### 2. Configure (Optional: Firebase)

If you want scores to also update in Firebase:

1. Download Firebase service account JSON from Firebase Console
2. Add to `.env`:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
```

### Usage

#### Basic: Update Scores Once

```bash
# Update today's games
python update_live_scores.py

# Update specific date
python update_live_scores.py --date 2025-10-23
```

**Output:**
```
📡 Fetching NHL games for 2025-10-23...
✅ Found 12 games

🔴 DET @ BUF: 3-2 (LIVE)
📅 CHI @ TBL: 0-0 (SCHEDULED)
✅ MTL @ CGY: 4-3 (FINAL)

✅ Saved 12 games to public/live_scores.json
```

#### Continuous: Update Every 5 Minutes

```bash
# Run continuously during game time
python update_live_scores.py --continuous

# Custom interval (every 10 minutes)
python update_live_scores.py --continuous --interval 10
```

**When to Use:**
- Start 15 minutes before first game
- Runs every 5 minutes (default)
- Updates `public/live_scores.json`
- Press `Ctrl+C` to stop

#### With Firebase Updates

```bash
# Update JSON + Firebase
python update_live_scores.py --continuous --firebase
```

This will:
1. Update `live_scores.json` (for display)
2. Update Firebase bets with results (for tracking)

---

## Part 3: Display Live Scores in Your App

### Option A: Automatic Integration (TODO)

Add the `LiveScoreDisplay` component to your game cards:

```jsx
import LiveScoreDisplay from './LiveScoreDisplay';

// In TodaysGames.jsx or GameCard.jsx
<LiveScoreDisplay game={game} />
```

The component:
- Fetches `/live_scores.json` every 30 seconds
- Shows live score badge for LIVE games
- Shows final score badge for completed games
- Only displays if game has started

### Option B: Manual Check

View the live scores file directly:
```bash
cat public/live_scores.json
```

---

## Recommended Workflow

### Pre-Game (Before 6 PM ET)

1. **Scrape Today's Odds** (ONE TIME):
   ```bash
   # Your existing odds scraping script
   node scripts/fetchData.js
   ```
   
   This fetches:
   - Moneyline odds
   - Total odds
   - Puck line odds
   - Starting goalies

2. **Load in Browser:**
   - Visit your app
   - Odds are displayed
   - Predictions are made

### During Games (7 PM - 11 PM ET)

3. **Start Score Updater** (runs continuously):
   ```bash
   python update_live_scores.py --continuous
   ```
   
   **Every 5 minutes:**
   - Fetches scores from NHL API
   - Updates `public/live_scores.json`
   - Your app refreshes automatically (30s interval)
   
   **What happens:**
   - Live games show: `🔴 LIVE P2 14:23`
   - Live scores: `DET 3 - BUF 2`
   - Final games: `✅ FINAL MTL 4 - CGY 3`

4. **Odds Stay Frozen:**
   - Odds do NOT refresh
   - Only scores update
   - Your predictions stay consistent

### After Midnight (12 AM - 6 AM)

5. **Games Still Visible:**
   - Yesterday's games remain on screen
   - Shows final scores
   - Users can see results

6. **Stop Updater:**
   - Press `Ctrl+C` in terminal
   - Or let it run until 6 AM

### Morning (6 AM+)

7. **Clean Slate:**
   - App automatically switches to "today"
   - Yesterday's games disappear
   - Ready for next day's odds

---

## File Structure

```
nhl-savant/
├── update_live_scores.py          # NEW: Python score updater
├── src/
│   ├── utils/
│   │   └── oddsTraderParser.js    # UPDATED: Shows yesterday until 6 AM
│   └── components/
│       └── LiveScoreDisplay.jsx   # NEW: Display live scores
├── public/
│   ├── odds_money.md              # Static (scraped once)
│   ├── odds_total.md              # Static (scraped once)
│   ├── starting_goalies.json      # Static (scraped once)
│   └── live_scores.json           # DYNAMIC (updated every 5 min)
└── .env                           # Firebase config (optional)
```

---

## API Source: NHL Official API (Free)

**Endpoint:**
```
https://api-web.nhle.com/v1/schedule/YYYY-MM-DD
```

**Data Returned:**
```json
{
  "gameWeek": [{
    "games": [{
      "id": 2025020001,
      "awayTeam": {
        "abbrev": "DET",
        "score": 3
      },
      "homeTeam": {
        "abbrev": "BUF",
        "score": 2
      },
      "gameState": "LIVE",
      "period": 2,
      "clock": {
        "timeRemaining": "14:23"
      }
    }]
  }]
}
```

**Rate Limits:**
- Free
- No API key required
- Reasonable rate limits (1 request/5min is fine)

---

## Troubleshooting

### "No games found for this date"

**Problem:** NHL API returned no data
**Solutions:**
- Check date format: `YYYY-MM-DD`
- Verify games actually exist for that date
- Try: `https://api-web.nhle.com/v1/schedule/2025-10-23` in browser

### "Could not fetch live scores: 404"

**Problem:** `live_scores.json` doesn't exist yet
**Solution:** Run `python update_live_scores.py` to create it

### Firebase Updates Not Working

**Problem:** Scores update in JSON but not Firebase
**Solutions:**
1. Check `.env` has Firebase credentials
2. Run with `--firebase` flag
3. Verify `pip install firebase-admin` succeeded

### Scores Not Showing in App

**Problem:** `LiveScoreDisplay` component not showing
**Solutions:**
1. Check `/live_scores.json` exists in browser
2. Verify game status is LIVE or FINAL (not SCHEDULED)
3. Check browser console for errors
4. Ensure component is imported in game card

---

## Performance

### Resource Usage

- **Python Script**: ~20MB RAM, negligible CPU
- **Network**: ~50KB per API call (every 5 minutes)
- **JSON File**: ~5-10KB (12 games)
- **Cost**: $0.00 (free NHL API)

### Update Frequency

**Recommended:**
- **Before game start**: Update once to get initial status
- **During games**: Update every 5 minutes
- **After 11 PM**: Update every 10-15 minutes (fewer live games)

**Why not every 30 seconds?**
- NHL API updates ~60 seconds (no benefit)
- Reduces load on free API
- Your app checks JSON every 30s anyway

---

## Benefits

1. ✅ **No odds rescraping** - Odds frozen, only scores update
2. ✅ **Free** - NHL API is free, no API key needed
3. ✅ **Fast** - Python script lightweight, updates in seconds
4. ✅ **Flexible** - Can update JSON only or JSON + Firebase
5. ✅ **User-friendly** - Yesterday's games stay until morning
6. ✅ **Reliable** - Official NHL data source

---

## Advanced: Schedule with Cron (Linux/Mac)

To run automatically during game nights:

```bash
# Edit crontab
crontab -e

# Add line to run 6:45 PM - 11:45 PM every 5 minutes
*/5 18-23 * * * cd /path/to/nhl-savant && python update_live_scores.py >> scores.log 2>&1
```

Or use a scheduler on Windows (Task Scheduler).

---

## Questions?

- **"Do I need Firebase?"** No, JSON updates are enough for display.
- **"Can I use JavaScript?"** Yes, but Python is simpler for this task.
- **"Will this slow down my site?"** No, 5-10KB JSON file loads instantly.
- **"What if NHL API is down?"** Script logs error, previous scores remain.

---

## Summary

**Before:** Had to rescrape odds all night to get scores
**After:** Scrape odds once, update scores via free NHL API

**Key Changes:**
1. ✅ Yesterday's games visible until 6 AM
2. ✅ Python script updates scores only
3. ✅ Odds stay frozen (consistent predictions)
4. ✅ Free, fast, reliable

**Next Steps:**
1. Run `pip install requests`
2. Test: `python update_live_scores.py`
3. During games: `python update_live_scores.py --continuous`
4. Add `<LiveScoreDisplay />` to game cards (optional)

