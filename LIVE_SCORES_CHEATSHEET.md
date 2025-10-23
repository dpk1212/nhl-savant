# Live Scores - Cheat Sheet 🚀

## ✅ CONFIGURED & READY!

Everything is set up. Just run the commands below.

---

## Game Day Commands

### Before Games (6 PM)
```bash
npm run fetch-data
```
*Scrapes odds once*

### During Games (7 PM - 11 PM)
```bash
npm run update-scores-live
```
*Updates scores every 5 minutes*

### Stop Updates
Press `Ctrl+C`

---

## That's It! 🎉

**What happens:**
- ✅ Scores update automatically
- ✅ Shows 🔴 LIVE or ✅ FINAL
- ✅ Odds stay frozen (no rescraping)
- ✅ Free NHL API
- ✅ Zero cost

**Output:** `public/live_scores.json`

---

## Other Commands

```bash
# Update once (test)
npm run update-scores

# Fast updates (3 min)
npm run update-scores-fast

# Specific date
node updateLiveScores.js --date 2025-10-24
```

---

## Verify It's Working

```bash
# Check the JSON file
cat public/live_scores.json | head -30

# Or in browser
http://localhost:5176/live_scores.json
```

---

## Full Documentation

- **Quick Start:** `LIVE_SCORES_SETUP.md`
- **Detailed Guide:** `LIVE_SCORES_GUIDE.md`
- **Python Version:** `update_live_scores.py` (if you prefer Python)

---

**You're an expert now! 🏒**

