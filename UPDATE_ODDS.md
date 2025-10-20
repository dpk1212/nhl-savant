# How to Update Daily Odds Data

This guide explains how to update the odds data for today's NHL games.

## Quick Steps

1. **Get Today's Odds File**
   - Go to **www.oddstrader.com/nhl/**
   - Save the page as Markdown (`.md` file)
   - The file will be named something like: `www.oddstrader.com_nhl_.2025-10-20T18_09_44.451Z.md`

2. **Rename the File**
   - Rename the downloaded file to exactly: `todays_odds.md`

3. **Replace the Existing File**
   - Navigate to the `public/` folder in this project
   - Replace the old `todays_odds.md` with your new file

4. **Deploy the Changes**
   ```bash
   # From the project root directory
   cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
   git add public/todays_odds.md
   git commit -m "Update today's odds"
   git push origin main
   npm run deploy
   ```

5. **Done!**
   - Visit: https://dpk1212.github.io/nhl-savant/#/games
   - You'll see today's games with betting edges

## What Gets Parsed

The parser extracts:
- Game time
- Away team
- Home team  
- Moneyline odds for both teams

## Format Details

OddsTrader uses a simple table format:
```
MON 10/207:00 PM
Minnesota
+125Bet365
N.Y. Rangers
-145Caesars
```

The parser automatically:
- Identifies today's games (MON date vs TUE date)
- Extracts team names
- Extracts moneyline odds (ignoring sportsbook names)
- Stops when tomorrow's games start

