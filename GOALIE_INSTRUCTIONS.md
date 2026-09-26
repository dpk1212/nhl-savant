# Daily Starting Goalies - Quick Reference

## 📋 MORNING ROUTINE

### 1. Find Today's Starting Goalies

**Best Source:** DailyFaceOff.com  
Check around 10 AM ET for confirmed starters

### 2. Edit the File

Open `public/starting_goalies.json` and update:

- **date**: Today's date (YYYY-MM-DD format)
- **lastUpdated**: Current timestamp (or just use current time)
- **games**: List of today's games with starting goalies

### 3. Format Rules

**Team Codes:** Use 3-letter abbreviations (WPG, CGY, TOR, BOS, etc.)  
**Goalie Names:** Full name as it appears in goalies.csv  
**Time:** Use "7:00 PM ET" format (or "TBD" if unknown)

### 4. Example Entry

```json
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
}
```

## 🎯 EASIER WAY (Recommended)

Instead of manually editing, use the **Admin Page**:

1. Go to your site: `/admin/goalies`
2. Select goalies from dropdowns
3. Click "Export for GitHub"
4. Replace this file with the downloaded one

This is MUCH easier and prevents typos!

## 📝 Team Code Reference

| Full Name | Code | Full Name | Code |
|-----------|------|-----------|------|
| Anaheim Ducks | ANA | Montreal Canadiens | MTL |
| Boston Bruins | BOS | Nashville Predators | NSH |
| Buffalo Sabres | BUF | New Jersey Devils | NJD |
| Calgary Flames | CGY | New York Islanders | NYI |
| Carolina Hurricanes | CAR | New York Rangers | NYR |
| Chicago Blackhawks | CHI | Ottawa Senators | OTT |
| Colorado Avalanche | COL | Philadelphia Flyers | PHI |
| Columbus Blue Jackets | CBJ | Pittsburgh Penguins | PIT |
| Dallas Stars | DAL | San Jose Sharks | SJS |
| Detroit Red Wings | DET | Seattle Kraken | SEA |
| Edmonton Oilers | EDM | St. Louis Blues | STL |
| Florida Panthers | FLA | Tampa Bay Lightning | TBL |
| Los Angeles Kings | LAK | Toronto Maple Leafs | TOR |
| Minnesota Wild | MIN | Utah Hockey Club | UTA |
| Vancouver Canucks | VAN | Vegas Golden Knights | VGK |
| Washington Capitals | WSH | Winnipeg Jets | WPG |

## ⚠️ Important Notes

- If a goalie is set to `null`, model uses team-average goalie stats
- Only include games where you have confirmed starters
- If no games today, use: `"games": []`
- Always validate JSON format (use JSONLint.com if unsure)

## 🚀 After Editing

```bash
git add public/starting_goalies.json
git commit -m "Update starting goalies - $(date +%Y-%m-%d)"
git push
npm run deploy
```

Done! All users now get your goalie selections with ±15% adjustments!

