# Goalie Export System - User Guide

**Date:** October 21, 2025  
**Status:** ✅ COMPLETE & READY TO USE

---

## 🎯 WHAT WAS IMPLEMENTED

You now have a complete system to share starting goalie selections with all users through GitHub, just like your current odds/teams workflow!

### Features Added:

1. **✅ Admin Goalie Selection Page** (`/admin/goalies`)
   - Select starting goalies from dropdown menus
   - Goalies sorted by games played (starter appears first)
   - Shows GSAE tier with color coding
   - Three action buttons:
     - **Save Locally**: Saves to your browser localStorage
     - **Export for GitHub**: Downloads `starting_goalies.json` file
     - **Copy JSON**: Copies JSON to clipboard
     - **Clear All**: Removes all selections

2. **✅ Export to JSON**
   - Generates `starting_goalies.json` file
   - Only includes games where you selected at least one goalie
   - Includes date, timestamp, and matchup details

3. **✅ Auto-Load System**
   - App checks for `starting_goalies.json` on load
   - Tries GitHub first, falls back to local
   - Automatically applies goalie adjustments (±15%)

4. **✅ Games List Fixed**
   - Admin page now shows today's games from odds files
   - Properly extracts matchups from your markdown odds data

---

## 📋 YOUR DAILY WORKFLOW

### Morning Routine (Same as before, with ONE addition):

```bash
# 1. Update your data files (as you already do)
#    - Update teams.csv
#    - Update odds_money.md
#    - Update odds_total.md

# 2. NEW: Select starting goalies
#    a) Go to https://dpk1212.github.io/nhl-savant/#/admin/goalies
#    b) For each game, select starting goalies from dropdowns
#       (Find starters at DailyFaceOff.com or NHL.com)
#    c) Click "Export for GitHub" button
#    d) Save the downloaded file as starting_goalies.json

# 3. Move the exported file to your repo
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
mv ~/Downloads/starting_goalies.json public/

# 4. Commit everything together (same as before)
git add public/teams.csv public/odds_*.md public/starting_goalies.json
git commit -m "Daily update - $(date +%Y-%m-%d)"
git push

# 5. Deploy (same as before)
npm run build
npm run deploy

# Done! All users now have:
# - Updated team stats
# - Today's odds
# - Starting goalies with ±15% adjustments
```

---

## 📄 EXAMPLE OUTPUT

When you click "Export for GitHub", it creates this file:

```json
{
  "date": "2024-10-21",
  "lastUpdated": "2024-10-21T14:30:00.000Z",
  "games": [
    {
      "gameId": "game_0",
      "matchup": "WPG @ CGY",
      "time": "7:00 PM ET",
      "away": {
        "team": "WPG",
        "goalie": "Connor Hellebuyck"
      },
      "home": {
        "team": "CGY",
        "goalie": "Dustin Wolf"
      }
    },
    {
      "gameId": "game_1",
      "matchup": "TOR @ BOS",
      "time": "7:00 PM ET",
      "away": {
        "team": "TOR",
        "goalie": "Joseph Woll"
      },
      "home": {
        "team": "BOS",
        "goalie": "Jeremy Swayman"
      }
    }
  ]
}
```

---

## 🔍 WHERE TO FIND STARTING GOALIES

**Best Sources (in order):**

1. **DailyFaceOff.com** (most reliable, updates morning of games)
2. **NHL.com** - Official injury report
3. **Team Twitter accounts** - Official announcements
4. **RotowWire.com** - Real-time lineup updates

**When to check:**
- First check: ~10 AM ET on game day
- Second check: ~2 PM ET (for any late changes)

---

## 💡 HOW IT WORKS

### For You (Admin):
1. Select goalies in UI
2. Click "Export for GitHub"
3. Save file to `/public` folder
4. Push to GitHub

### For All Users (Automatic):
1. App loads `starting_goalies.json` from GitHub
2. Applies ±15% goalie adjustment automatically
3. **Elite goalie (GSAE > 10):** Opponent's goals reduced by 15%
4. **Poor goalie (GSAE < -10):** Opponent's goals increased by 15%
5. **Average goalie:** No adjustment

### Impact Example:
```
WPG @ CGY without goalie data:
- WPG: 2.8 goals
- CGY: 2.6 goals
- Total: 5.4 goals

WPG @ CGY with Hellebuyck (Elite, GSAE +15):
- WPG: 2.8 goals
- CGY: 2.2 goals (-15% due to Hellebuyck)
- Total: 5.0 goals

Difference: 0.4 goals (HUGE for betting!)
```

---

## 🚨 IMPORTANT NOTES

### What if you don't select goalies?
- Model uses team-average goalie stats
- Still works, but less accurate
- Misses the ±15% impact from specific starters

### What if starters change last minute?
- Update the file and push again
- Users will get fresh data on next page load
- Takes 1-2 minutes for GitHub to update

### Can users override your selections?
- Yes, they can use "Save Locally" for personal overrides
- But by default, everyone uses your GitHub file
- Your file is the "official" source of truth

---

## 🎯 TESTING CHECKLIST

Before going live, verify:

- [ ] Dev server running (`npm run dev`)
- [ ] Go to `/admin/goalies` - games showing?
- [ ] Select a few goalies
- [ ] Click "Export for GitHub" - file downloads?
- [ ] Open the JSON file - looks correct?
- [ ] Save to `/public` folder
- [ ] Deploy and test live site

---

## 📊 WHAT USERS SEE

**Without `starting_goalies.json`:**
```
Console: "ℹ️ No starting goalies file found, using team averages"
Predictions: Use team-average goalie GSAE
```

**With `starting_goalies.json`:**
```
Console: "✅ Loaded starting goalies: 12 games"
Predictions: Use specific starter's GSAE (±15% adjustment)
```

---

## 🚀 NEXT STEPS

1. **Test locally** - Verify admin page works
2. **Do a test export** - Make sure JSON looks good
3. **Create first real file** - Tomorrow morning with actual starters
4. **Push to GitHub** - Add to your daily workflow
5. **Monitor impact** - Track how goalie adjustments affect predictions

---

## ❓ TROUBLESHOOTING

**"No games available for today"**
- Check that odds files have been loaded
- Verify odds files contain today's games
- Console should show: "📋 Extracted X games for admin"

**Export button not working**
- Check browser console for errors
- Make sure you've selected at least one goalie
- Try "Copy JSON" button instead

**Downloaded file won't save**
- Check Downloads folder
- Browser may block download - click "Allow"
- Use "Copy JSON" and paste into text editor

**Users not seeing updated goalies**
- Check file is in `/public` folder
- Verify it's pushed to GitHub
- Check GitHub raw URL works:
  `https://raw.githubusercontent.com/dpk1212/nhl-savant/main/public/starting_goalies.json`

---

## 🎉 BENEFITS

**Compared to manual input:**
- ✅ One-time setup (you select, everyone gets)
- ✅ Works exactly like your current workflow
- ✅ No backend required
- ✅ Version controlled (can see history)
- ✅ Free and reliable

**Compared to localStorage only:**
- ✅ Centralized (one source of truth)
- ✅ All users get same predictions
- ✅ Professional and consistent
- ✅ Easy to update

---

**You're all set! The system is ready to use.** 🏒🥅

Just add one step to your morning routine: select goalies and export! 🎯

