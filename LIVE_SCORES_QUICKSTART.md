# Live Scores - Quick Start 🚀

## Setup (One Time)

```bash
pip install requests python-dotenv firebase-admin
chmod +x update_live_scores.py
```

## Usage

### During Game Time (7 PM - 11 PM)

```bash
# Start continuous updates (every 5 min)
python update_live_scores.py --continuous
```

**What happens:**
- ✅ Fetches scores from NHL API
- ✅ Updates `public/live_scores.json`
- ✅ Your app shows live scores
- ✅ **Odds stay frozen** (no rescraping)

### Single Update

```bash
# Update once
python update_live_scores.py

# Specific date
python update_live_scores.py --date 2025-10-23
```

### With Firebase

```bash
# Also update Firebase bet results
python update_live_scores.py --continuous --firebase
```

## Features Implemented

### ✅ Yesterday's Games Until 6 AM
- Late games (10 PM starts) stay visible after midnight
- Automatically switches to "today" at 6 AM
- No code needed - works automatically

### ✅ Live Score Updates
- Python script fetches from free NHL API
- Updates every 5 minutes (configurable)
- Shows: 🔴 LIVE or ✅ FINAL status
- Score display: `DET 3 - BUF 2`

### ✅ No Odds Rescraping
- Odds frozen at initial scrape
- Only scores update
- Predictions stay consistent

## File Outputs

```
public/
├── live_scores.json           ← Updated every 5 min
├── odds_money.md              ← Static (scraped once)
├── odds_total.md              ← Static (scraped once)
└── starting_goalies.json      ← Static (scraped once)
```

## Typical Workflow

**6 PM:** Scrape odds once
```bash
node scripts/fetchData.js
```

**7 PM:** Start score updater
```bash
python update_live_scores.py --continuous
```

**11 PM:** Stop updater (Ctrl+C) or let it run

**6 AM:** App auto-switches to today

## Troubleshooting

**No games found?**
- Normal if no games scheduled
- Check: `https://api-web.nhle.com/v1/schedule/2025-10-23`

**File not found?**
- Run once: `python update_live_scores.py`
- Check: `ls -la public/live_scores.json`

**Scores not showing in app?**
- Verify `public/live_scores.json` exists
- Check browser: `/live_scores.json`
- Add `<LiveScoreDisplay />` component

## Testing

```bash
# Quick test
python test_live_scores.py

# Check output
cat public/live_scores.json | head -20
```

## Full Guide

See `LIVE_SCORES_GUIDE.md` for:
- Firebase configuration
- Cron scheduling
- Component integration
- Advanced options

---

**Cost:** $0.00 (free NHL API)  
**Updates:** Every 5 minutes  
**Resource:** ~20MB RAM

