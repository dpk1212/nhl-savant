# Live Scores - Setup Complete! ✅

## 🎉 You're All Set!

The live score updater is **configured and ready to use** with Node.js (no Python needed).

---

## Quick Start (3 Commands)

### 1. Test It Works
```bash
npm run update-scores
```
**Result:** Creates `public/live_scores.json` with today's games

### 2. During Game Time (7 PM - 11 PM)
```bash
npm run update-scores-live
```
**Result:** Updates scores every 5 minutes automatically

### 3. Stop It
Press `Ctrl+C` in terminal

---

## Available Commands

```bash
# Update once
npm run update-scores

# Update continuously (every 5 min) - RECOMMENDED
npm run update-scores-live

# Update fast (every 3 min) - for playoffs
npm run update-scores-fast

# Or use the file directly with options
node updateLiveScores.js --help
```

---

## What It Does

✅ Fetches live scores from NHL Official API (free)  
✅ Updates `public/live_scores.json` every 5 minutes  
✅ Shows: 🔴 LIVE, ✅ FINAL, 📅 SCHEDULED  
✅ **Does NOT rescrape odds** (odds stay frozen)  
✅ Zero cost, no API key needed

---

## Typical Workflow

### Pre-Game (6 PM)
Scrape odds once:
```bash
npm run fetch-data
```

### Game Time (7 PM)
Start score updater:
```bash
npm run update-scores-live
```

### After Games
Stop with `Ctrl+C` or let it run overnight

---

## Output Example

**Terminal:**
```
🏒 NHL Live Score Updater
==================================================

📡 Fetching NHL games for 2025-10-23...
✅ Found 12 games

🔴 DET @ BUF: 3-2 (LIVE) P2 14:23
✅ MTL @ CGY: 4-3 (FINAL)
📅 CHI @ TBL: 0-0 (SCHEDULED)

✅ Saved 12 games to public/live_scores.json

⏰ Next update at 7:35:00 PM
   Waiting 5 minutes...
```

**JSON Output:** `public/live_scores.json`
```json
{
  "lastUpdate": "2025-10-23T23:30:00.000Z",
  "gamesCount": 12,
  "games": [
    {
      "awayTeam": "DET",
      "homeTeam": "BUF",
      "awayScore": 3,
      "homeScore": 2,
      "status": "LIVE",
      "period": 2,
      "clock": "14:23"
    }
  ]
}
```

---

## Features Already Working

### ✅ Yesterday's Games Until 6 AM
- Late games (10 PM starts) stay visible after midnight
- Automatic switch at 6 AM
- **No action needed** - works automatically in your app

### ✅ Live Score Updates
- Node.js script (no Python install needed)
- Updates every 5 minutes (configurable)
- Free NHL Official API
- Works with your existing setup

---

## Advanced Options

### Custom Date
```bash
node updateLiveScores.js --date 2025-10-24
```

### Custom Interval (10 minutes)
```bash
node updateLiveScores.js --continuous --interval 10
```

### Help
```bash
node updateLiveScores.js --help
```

---

## Integrating with Your App

The `LiveScoreDisplay` component is already created. To use it in your game cards:

```jsx
import LiveScoreDisplay from './LiveScoreDisplay';

// Inside your game card
<LiveScoreDisplay game={game} />
```

It will:
- Auto-fetch `/live_scores.json` every 30 seconds
- Show 🔴 LIVE badge with period/clock
- Show ✅ FINAL badge for completed games
- Only display if game has started

---

## Files

| File | Purpose |
|------|---------|
| `updateLiveScores.js` | Main score updater (Node.js) |
| `public/live_scores.json` | Output (updated every 5 min) |
| `src/components/LiveScoreDisplay.jsx` | React component to display scores |

---

## Troubleshooting

### "No games found"
**Normal** - no games scheduled for that date

### "Cannot find module"
Run from project root:
```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
npm run update-scores
```

### Scores not showing in app
1. Check `public/live_scores.json` exists
2. Verify games have started (status: LIVE or FINAL)
3. Add `<LiveScoreDisplay />` component to game cards

---

## Why This is Better

### Old Way: Rescrape odds all night ❌
- Odds change during game
- Predictions become inconsistent
- Heavy scraping load
- Risk of getting blocked

### New Way: Freeze odds, update scores ✅
- Odds frozen at game start
- Predictions stay consistent
- Free NHL API for scores
- Can compare model vs actual

---

## Summary

✅ **Configured:** Node.js script ready  
✅ **Tested:** Working with today's games  
✅ **Zero cost:** Free NHL API  
✅ **Easy to use:** Just run `npm run update-scores-live`

**You're ready to go! Just run it during game time! 🏒**

