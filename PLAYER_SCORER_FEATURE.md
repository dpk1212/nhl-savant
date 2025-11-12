# Player Scorer Analysis Feature

## Overview
The **Top Scorers Tonight** feature shows which NHL players have the best goal-scoring opportunities based on sophisticated matchup analysis. It combines OddsTrader's baseline player prop data with your unique matchup context analysis.

## What Makes This Unique

**OddsTrader shows:**
- Expected Value (EV%)
- Cover Probability

**NHL Savant shows:**
- WHY the matchup is good (defense rank, goalie quality)
- CONTEXT they don't have (pace, PP opportunity, rebound control, shot blocking)
- YOUR adjusted EV based on deeper analysis
- Visual breakdown of all favorable/unfavorable factors

**Value Proposition:** "OddsTrader says +9.4% EV, but WE say +12.1% EV because [7 specific reasons]"

---

## How to Use

### 1. Scrape Player Props Data

Run this command daily to fetch the latest player props from OddsTrader:

```bash
npm run fetch-player-props
```

This will:
- Scrape https://www.oddstrader.com/nhl/player-props/?m=586
- Extract player names, teams, matchups, EV%, and cover probability
- Save to `public/player_props.json`
- Save raw markdown to `public/player_props_raw.md` (for debugging)

### 2. View in the App

Navigate to `/top-scorers` in the app or click "Top Scorers" in the navigation menu.

### 3. Filter and Sort

- **Game Filter**: View all games or filter to a specific matchup
- **Position Filter**: All / Forwards / Defense
- **Sort By**: Our Adjusted EV / Matchup Grade / OddsTrader EV

### 4. Click Any Player

Opens detailed modal showing:
- All 7 matchup factors (favorable/neutral indicators)
- Specific reasons why this is a good/bad matchup
- Player season stats
- Comparison of your analysis vs OddsTrader baseline

---

## Matchup Factors Analyzed

### 1. **Opponent Defense Rank** 
- Ranks all 32 teams by xGA/60
- Color-coded: Green (weak, #21-32) = easy, Red (#1-10) = hard
- Shows % above/below league average

### 2. **Goalie Quality**
- Uses GSAE (Goals Saved Above Expected)
- Struggling goalies (negative GSAE) = favorable
- Elite goalies (positive GSAE) = unfavorable

### 3. **Game Pace**
- Shot attempts per 60 vs league average
- Fast pace = more shots = more opportunities

### 4. **PP Opportunity**
- Opponent penalty minutes per game
- High PIM = more power play chances

### 5. **Shot Blocking**
- Opponent blocked shots per game
- Low blocks = shots get through to net

### 6. **Rebound Control**
- Goalie rebound suppression rate
- High rebounds = second chance opportunities

### 7. **Player Shot Volume**
- Player's shots on goal per game
- High danger shot rate
- High volume shooters = more likely to score

---

## Premium Features

### Free Users
- See top 10 players ranked
- View basic matchup info in table

### Premium Users
- See ALL players (unlimited)
- Click any player for detailed matchup modal
- Bookmark favorite players (future feature)
- Export rankings (future feature)

---

## Data Flow

```
1. OddsTrader Scrape (Firecrawl)
   ↓
2. player_props.json
   ↓
3. App.jsx loads data
   ↓
4. PlayerMatchupAnalyzer.js
   - Combines player props with:
     - teams.csv (defense metrics)
     - goalies.csv (GSAE, rebound control)
     - skaters.csv (player stats)
   ↓
5. Calculates:
   - 7 matchup factors
   - Adjusted EV
   - Overall grade (A+ to B)
   - Specific reasons
   ↓
6. TopScorersTonight.jsx displays
```

---

## File Structure

### New Files Created
1. **`scripts/fetchPlayerProps.js`** - Firecrawl scraper for OddsTrader
2. **`src/utils/playerMatchupAnalyzer.js`** - Core matchup analysis logic
3. **`src/pages/TopScorersTonight.jsx`** - Main page component
4. **`src/components/PlayerRankingsTable.jsx`** - Table component
5. **`src/components/PlayerDetailModal.jsx`** - Detail modal

### Modified Files
1. **`src/App.jsx`** - Added data loading and route
2. **`src/components/Navigation.jsx`** - Added "Top Scorers" link
3. **`package.json`** - Added `npm run fetch-player-props` script

### Data Files
1. **`public/player_props.json`** - Scraped player props (generated)
2. **`public/player_props_raw.md`** - Raw markdown (debugging)

---

## Automation

### GitHub Action (Optional)
Create `.github/workflows/fetch-player-props.yml`:

```yaml
name: Fetch Player Props

on:
  schedule:
    - cron: '0 14 * * *'  # 2 PM ET daily (when props are available)
  workflow_dispatch:

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run fetch-player-props
        env:
          FIRECRAWL_API_KEY: ${{ secrets.FIRECRAWL_API_KEY }}
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "Update player props"
```

### Manual Daily Workflow
```bash
# Morning (before games)
npm run fetch-player-props
git add public/player_props.json
git commit -m "Update player props for $(date +%Y-%m-%d)"
git push
npm run deploy
```

---

## Troubleshooting

### No players showing up?
- Check if `public/player_props.json` exists
- Run `npm run fetch-player-props`
- Check console for errors

### Players showing but no matchup data?
- Verify `teams.csv` and `goalies.csv` are present
- Check team name mapping in analyzer

### Scraper failing?
- Check FIRECRAWL_API_KEY in `.env`
- Verify OddsTrader URL is correct
- Check Firecrawl credits (500/month free)

### Grade calculation seems off?
- Adjust thresholds in `playerMatchupAnalyzer.js`
- Check `calculateAdjustedEV()` function
- Verify matchup factor calculations

---

## Future Enhancements

1. **Player Bookmarks** - Save favorite players for tracking
2. **Historical Tracking** - "Our picks vs actual results"
3. **Export Functionality** - Download rankings as CSV
4. **Prop Bet Tracker** - Log bets and track results
5. **AI Narratives** - Generate "why bet this player" stories
6. **Line Combinations** - Show which linemates boost scoring
7. **Multi-Game Props** - "Player to score 3+ games this week"
8. **Live Updates** - Update probabilities during games

---

## Technical Notes

### Performance
- Player props load asynchronously (won't block main app)
- Analyzer caches league averages for efficiency
- Table renders ~50-100 players smoothly

### Mobile
- Horizontal scroll table on desktop
- Compact card view on mobile
- All features work on mobile (filters, modal, etc.)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Credits
- **Data Source**: OddsTrader.com player props
- **Scraping**: Firecrawl API
- **Analysis**: Proprietary matchup algorithm
- **Design**: NHL Savant premium UI system

---

## Questions?
See the implementation plan: `player-scorer.plan.md`

