# Top Scorers Tonight - Usage Guide

## ✅ PARSER IS NOW WORKING!

The OddsTrader player props scraper is now fully functional and successfully extracts player goal props data.

## Quick Start

### 1. Scrape Player Props (Run Once Per Day)

```bash
npm run fetch-player-props
```

This will:
- ✅ Scrape NHL Player Total Goals props from OddsTrader
- ✅ Extract player names, EV%, cover probability, and odds
- ✅ Save to `public/player_props.json`
- ✅ Save raw markdown to `public/player_props_raw.md` (for debugging)

**Output Example:**
```
🏒 Fetching NHL Player Props from OddsTrader...
📍 URL: https://www.oddstrader.com/nhl/player-props/?m=1694

⏳ Scraping page (this may take 30-60 seconds)...
✅ Page scraped successfully
📄 Processing player props data...

   Parsed 20 players from markdown

✅ Found 20 player props

💾 Saved to: .../public/player_props.json
📝 Raw markdown saved to: .../public/player_props_raw.md

📊 Sample Players:
1. Jack Roslovic (EDM) vs PHI: EV +14.9%, Cover 93%
2. Alex Tuch (BUF) vs UTA: EV +10.9%, Cover 85%
3. Mika Zibanejad (NYR) vs TB: EV +10.4%, Cover 87%
...
```

### 2. Start the App

```bash
npm run dev
```

### 3. Navigate to Top Scorers

Go to: **http://localhost:5173/top-scorers**

Or click **"Top Scorers"** in the navigation menu (🔥 icon)

## What The Feature Does

### OddsTrader Baseline + YOUR Advanced Analysis

**OddsTrader provides:**
- Player prop EV%
- Cover probability
- Market odds

**YOU add sophisticated matchup context:**

1. **Opponent Defense Rank** - How weak/strong is the opposing defense? (#1-32)
2. **Goalie Quality** - Is the goalie struggling or elite? (GSAE metric)
3. **Game Pace** - Fast pace = more shots = more goal opportunities
4. **PP Opportunity** - High penalties = more power play chances
5. **Shot Blocking Rate** - Low blocks = better shooting lanes
6. **Rebound Control** - Poor rebound control = second chances
7. **Player Shot Volume** - How many shots does this player take?

### Adjusted EV Calculation

The app takes OddsTrader's baseline EV and **adjusts it** based on your matchup factors:

```
OddsTrader says: +9.4% EV
YOU say: +12.1% EV

Why? 
✅ Facing #28 defense (bottom 5)
✅ Goalie -5.2 GSAE (struggling)
✅ High PP opportunity (3.2 PIM/gm)
✅ Fast pace (+8% shots)
```

## Page Features

### Filters
- **Game Filter:** Focus on specific matchups
- **Position Filter:** All / Forwards / Defensemen
- **Sort Options:** EV%, Grade, Shots, OddsTrader Baseline

### Premium Gates
- **Free Users:** Top 10 players
- **Premium Users:** Full list + detailed modal analysis

### Player Rankings Table

| # | Player | Team | Opp | Def Rank | Goalie | PP Opp | OT EV | Our Grade | Matchup |
|---|--------|------|-----|----------|--------|--------|-------|-----------|---------|
| 1 | Jack Roslovic | EDM | PHI | #28 🟢 | Ersson -3.2 | 3.1 | +14.9% | A+ | 🔥 |

**Click any row** to see detailed matchup breakdown with all 7 factors.

## Data Pipeline

```
OddsTrader (Firecrawl)
  ↓
player_props.json
  ↓
PlayerMatchupAnalyzer
  ↓
  • Load skaters.csv (player stats)
  • Load teams.csv (defense metrics)
  • Load goalies.csv (goalie GSAE)
  ↓
Calculate 7 Matchup Factors
  ↓
Generate Adjusted EV & Grade
  ↓
TopScorersTonight Page
```

## Files Created

### New Files (6)
1. `scripts/fetchPlayerProps.js` - Firecrawl scraper
2. `src/utils/playerMatchupAnalyzer.js` - Matchup analysis engine
3. `src/pages/TopScorersTonight.jsx` - Main page
4. `src/components/PlayerRankingsTable.jsx` - Rankings table
5. `src/components/PlayerDetailModal.jsx` - Detailed modal
6. `public/player_props.json` - Generated data (20 players)

### Modified Files (3)
1. `src/App.jsx` - Added route + data loading
2. `src/components/Navigation.jsx` - Added "Top Scorers" link
3. `package.json` - Added `fetch-player-props` script

## Troubleshooting

### Parser Returns 0 Players
✅ **FIXED!** The parser now correctly handles:
- Line-by-line markdown parsing
- Player names attached to "Player Total Goals" with no space
- Trailing backslashes (`\\`) on every line
- Multiple game matchups

### Re-scrape If Needed
If OddsTrader's HTML structure changes, you can debug by:

1. Check the raw markdown:
```bash
cat public/player_props_raw.md | grep "Player Total Goals" | head -5
```

2. Re-run the scraper with updated parsing logic in `parsePlayerProps()`

### No Player Matchup Data
Make sure you have:
- `skaters.csv` with current season stats
- `teams.csv` with defense metrics
- `goalies.csv` with GSAE data
- `starting_goalies.json` with tonight's confirmed starters

## Next Steps

1. ✅ Parser works perfectly (20 players extracted)
2. 🔄 Test the full app with real data
3. 🔄 Validate matchup calculations are accurate
4. 📝 Add cross-links from game cards ("View Player Matchups" button)
5. 🎨 Polish UI/UX based on user feedback

## Value Proposition

**Why This Is Unique:**

Most sites show:
- ❌ Just the prop odds
- ❌ Generic EV% without context

**You show:**
- ✅ OddsTrader baseline EV as reference
- ✅ YOUR adjusted EV based on deep analysis
- ✅ Visual breakdown of all matchup factors
- ✅ Specific reasons WHY it's a good/bad matchup

**Users see:** "OddsTrader says +9.4%, but WE say +12.1% because [detailed reasons]"

This is **value-added analysis** layered on top of market data. 🔥

