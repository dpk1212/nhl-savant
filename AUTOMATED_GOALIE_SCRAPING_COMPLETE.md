# ✅ Automated Goalie Scraping - COMPLETE!

## All Parts Implemented Successfully

**6 files modified** - Automated goalie scraping from MoneyPuck is now live!

---

## What Changed

### Part 1: MoneyPuck Scraping ✅

**File: `scripts/fetchData.js`**

**Before:** Scraped `moneypuck.com/goalies.htm` for season stats
**After:** Scrapes `moneypuck.com/index.html` for today's starting goalies

**New Function:**
```javascript
parseMoneyPuckStartingGoalies(markdown)
// Extracts: Team matchups (MTL @ CGY)
// Parses: Goalie names from scraped content
// Marks: confirmed=true if goalie found, false otherwise
// Always adds games even if goalies TBD
```

**Output Format:**
```json
{
  "date": "2025-10-22",
  "lastUpdated": "2025-10-22T14:00:00Z",
  "oddsLastUpdated": "2025-10-22T14:00:00Z",
  "games": [
    {
      "matchup": "MTL @ CGY",
      "away": {
        "team": "MTL",
        "goalie": "Samuel Montembeault",
        "confirmed": true
      },
      "home": {
        "team": "CGY",
        "goalie": null,
        "confirmed": false
      }
    }
  ]
}
```

---

### Part 2: Conditional Goalie Section Display ✅

**File: `src/components/GoalieMatchupSection.jsx`**

**3 Display States:**

**State 1: Neither Goalie Confirmed**
```
┌────────────────────────────────────┐
│ 🛡️ Goaltender Matchup      [HIGH] │
├────────────────────────────────────┤
│              ⏳                     │
│ Waiting for Goalie Confirmation    │
│                                    │
│ Starting goalies typically         │
│ confirmed 1-2 hours before game.   │
└────────────────────────────────────┘
```

**State 2: One Goalie Confirmed**
```
┌────────────────────────────────────┐
│ 🛡️ Goaltender Matchup      [HIGH] │
├────────────────────────────────────┤
│              ⏳                     │
│ ✅ MTL goalie confirmed •          │
│ ⏳ CGY goalie TBD                  │
│                                    │
│ Samuel Montembeault (MTL)          │
└────────────────────────────────────┘
```

**State 3: Both Confirmed**
```
┌────────────────────────────────────┐
│ 🛡️ Goaltender Matchup      [HIGH] │
├────────────────────────────────────┤
│ 🛡️ MTL HAS GOALIE ADVANTAGE       │
│ 8.5 GSAE difference • ~0.85 goals  │
├────────────────────────────────────┤
│ [Full analytics section with       │
│  head-to-head cards, stats,        │
│  danger zone comparisons, etc.]    │
└────────────────────────────────────┘
```

---

### Part 3: Updated Goalie Loading ✅

**File: `src/components/TodaysGames.jsx`**

**Updated `getGoalieForTeam()` function:**

```javascript
// Returns null if goalie not confirmed
if (!goalieData || !goalieData.goalie || !goalieData.confirmed) {
  return null; // Triggers waiting state
}

// Loads advanced stats from goalies.csv (manually updated)
const stats = goalieProcessor ? 
  goalieProcessor.getGoalieStats(goalieData.goalie, teamCode) : null;

// Returns goalie with stats if available
return {
  name: goalieData.goalie,
  team: teamCode,
  confirmed: true,
  ...stats // GSAE, HD Sv%, etc. from goalies.csv
};
```

**Flow:**
1. Check `starting_goalies.json` for goalie confirmation
2. If confirmed, load advanced stats from `goalies.csv`
3. Combine and display full analytics
4. If not confirmed, show waiting state

---

### Part 4: Removed Manual Admin Page ✅

**Files Modified:**
- `src/App.jsx` - Removed `AdminGoalies` import and route
- `src/components/Navigation.jsx` - Removed "Admin: Goalies" nav link

**Before:**
```javascript
<Route path="/admin/goalies" element={<AdminGoalies />} />
{ path: '/admin/goalies', label: 'Admin: Goalies', icon: '🥅' }
```

**After:**
- Route deleted
- Nav link deleted
- No more manual goalie selection

---

### Part 5: Automated Scraping Schedule ✅

**File: `.github/workflows/fetch-data.yml` (NEW)**

**Schedule:**
- **Morning Scrape:** 10:00 AM ET (2:00 PM UTC)
- **Afternoon Scrape:** 4:00 PM ET (8:00 PM UTC)

**Process:**
1. Checkout repo
2. Setup Node.js 18
3. Install dependencies
4. Run `npm run fetch-data`
5. Commit changes (if any)
6. Push to GitHub

**Manual Trigger:**
- Can also run manually via GitHub Actions UI
- Useful for testing or off-schedule updates

---

## Data Flow

### Automated Flow (Twice Daily)

```
10 AM / 4 PM ET
    ↓
GitHub Actions triggers
    ↓
Scrape MoneyPuck homepage
    ↓
Parse starting goalies
    ↓
Save to starting_goalies.json
    ↓
Commit & Push to GitHub
    ↓
GitHub Pages redeploys
    ↓
Users see updated data
```

### User Views Site

```
Load starting_goalies.json
    ↓
Check goalie confirmed status
    ↓
┌─────────────────┐
│ NOT CONFIRMED?  │───→ Show "⏳ Waiting"
└─────────────────┘
         │
         │ CONFIRMED
         ↓
Load goalies.csv (manual update)
    ↓
Match goalie name to stats
    ↓
Display full analytics
```

---

## Manual Updates Required

### You Only Need to Update:

**`public/goalies.csv`** - Advanced stats (GSAE, HD Sv%, etc.)
- Update once per day/week with latest season stats
- Used for all confirmed goalies
- No manual starting goalie selection needed anymore!

**Everything Else is Automated:**
- ✅ Odds scraping (2x daily)
- ✅ Starting goalie confirmations (2x daily)
- ✅ Commits and deploys (automatic)

---

## Testing

### Manual Test Scraper

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
npm run fetch-data
```

**Expected Output:**
```
🔥 FIRECRAWL - Automated NHL Data Fetch
========================================

📊 Fetching moneyline odds from OddsTrader...
✅ Moneyline odds saved

📊 Fetching total odds from OddsTrader...
✅ Total odds saved

🥅 Fetching starting goalies from MoneyPuck...
   - Scraped MoneyPuck homepage
   - Parsed 3 games from MoneyPuck
✅ Starting goalies saved
   - Goalies confirmed: 4/6 goalies confirmed

✅ ALL DATA FETCHED SUCCESSFULLY!

Goalie Status: 4/6 goalies confirmed
Odds Updated: 10/22/2025, 10:00:18 AM
```

### Check Output File

```bash
cat public/starting_goalies.json
```

**Should See:**
```json
{
  "date": "2025-10-22",
  "lastUpdated": "2025-10-22T14:00:00.000Z",
  "oddsLastUpdated": "2025-10-22T14:00:00.000Z",
  "games": [
    {
      "matchup": "MTL @ CGY",
      "away": {
        "team": "MTL",
        "goalie": "Samuel Montembeault",
        "confirmed": true
      },
      "home": {
        "team": "CGY",
        "goalie": "Dustin Wolf",
        "confirmed": true
      }
    }
  ]
}
```

### Test UI States

**Test Waiting State:**
1. Edit `starting_goalies.json`
2. Set `goalie: null` and `confirmed: false`
3. Reload page
4. Should see: "⏳ Waiting for Goalie Confirmation"

**Test Partial State:**
1. Set only one goalie to null
2. Should see: "✅ MTL goalie confirmed • ⏳ CGY goalie TBD"

**Test Full State:**
1. Ensure both goalies confirmed
2. Should see: Full analytics section with GSAE, cards, etc.

---

## GitHub Actions Setup

### Required: Add Firecrawl API Key

1. Go to: `https://github.com/YOUR_USERNAME/nhl-savant/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `FIRECRAWL_API_KEY`
4. Value: Your Firecrawl API key
5. Click "Add secret"

### Verify Workflow

1. Go to: `https://github.com/YOUR_USERNAME/nhl-savant/actions`
2. Click on "Fetch NHL Data" workflow
3. Click "Run workflow" (manual test)
4. Wait for completion
5. Check if `starting_goalies.json` was updated

---

## Benefits

### Before (Manual):
- ❌ Had to visit Admin page
- ❌ Manually select each goalie
- ❌ Export and commit JSON
- ❌ Push to GitHub
- ❌ Wait for deployment
- ⏱️ 5-10 minutes per update
- 😰 Easy to forget or miss updates

### After (Automated):
- ✅ Scrapes automatically 2x daily
- ✅ No manual goalie selection
- ✅ Auto-commits and pushes
- ✅ Auto-deploys to GitHub Pages
- ⏱️ 0 minutes of your time
- 😌 Reliable and consistent

---

## What You Still Control

1. **`goalies.csv`** - Update advanced stats manually (weekly is fine)
2. **GitHub Actions** - Can disable/enable schedule if needed
3. **Manual Trigger** - Run scraper anytime via GitHub Actions
4. **Scraper Parsing** - Can adjust regex if MoneyPuck format changes

---

## Troubleshooting

### Issue: Goalies not parsing correctly
**Fix:** Check MoneyPuck homepage HTML structure, adjust regex in `parseMoneyPuckStartingGoalies()`

### Issue: GitHub Actions not running
**Check:**
1. Workflow file is in `.github/workflows/`
2. `FIRECRAWL_API_KEY` secret is set
3. Workflow is enabled (Actions tab)

### Issue: Goalies show as unconfirmed when they should be confirmed
**Possible causes:**
1. MoneyPuck hasn't updated yet (check their site)
2. Parser regex doesn't match current format
3. Team abbreviations don't match (check `TEAM_NAME_MAP`)

---

## Next Steps

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Add Firecrawl API Key** to GitHub Secrets

3. **Test Workflow:**
   - Go to Actions tab
   - Run "Fetch NHL Data" manually
   - Verify `starting_goalies.json` updates

4. **Monitor First Automated Run:**
   - Check at 10 AM ET (morning scrape)
   - Verify data updates correctly
   - Check UI shows correct states

5. **Update `goalies.csv`** with latest season stats when available

---

## 🎉 Complete!

**All 6 parts implemented:**
- ✅ MoneyPuck starting goalie scraping
- ✅ Conditional display (3 states)
- ✅ Updated goalie loading logic
- ✅ Removed manual admin page
- ✅ GitHub Actions workflow
- ✅ Twice-daily automated scraping

**Push when ready!**

