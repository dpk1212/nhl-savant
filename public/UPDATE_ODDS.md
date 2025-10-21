# Daily Update Process for NHL Savant Odds

## Overview
The NHL Savant application uses **TWO** OddsTrader files to get complete odds data:
- **Money file:** Contains moneyline odds (away ML and home ML)
- **Total file:** Contains over/under totals and odds

## Step-by-Step Daily Update Process

### 1. Download Both Odds Files from OddsTrader

1. Go to **www.oddstrader.com/nhl/**
2. Make sure you're viewing **"Today"** games
3. Click the **"Money"** tab at the top
4. Save the page as markdown (Command+S or File → Save Page As)
5. Click the **"Total"** tab at the top
6. Save the page as markdown (Command+S or File → Save Page As)

### 2. Rename Files

Rename the downloaded files to:
- Money file → `odds_money.md`
- Total file → `odds_total.md`

### 3. Replace Files in Project

Copy both files to the `nhl-savant/public/` folder, replacing the existing files.

```bash
# From your NHL Savant folder
cp ~/Downloads/odds_money.md "nhl-savant/public/odds_money.md"
cp ~/Downloads/odds_total.md "nhl-savant/public/odds_total.md"
```

### 4. Deploy Updated Odds

```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
git add public/odds_money.md public/odds_total.md
git commit -m "Update today's odds - $(date +%Y-%m-%d)"
git push origin main
```

**That's it!** The app will automatically load the new files within 1-2 minutes.

### 5. Verify

After pushing (takes 1-2 minutes):
1. Go to your GitHub Pages site
2. Navigate to "Today's Games"
3. Verify all games show:
   - Correct moneyline odds
   - Correct over/under totals
   - Calculated edges and recommendations

## File Format

The application expects:
- **odds_money.md:** OddsTrader Money tab (moneylines)
- **odds_total.md:** OddsTrader Total tab (totals)

Both files are parsed and merged automatically to provide complete odds data.

## Troubleshooting

**No games showing?**
- Check that both files are saved in `public/` folder
- Check file names are exactly `odds_money.md` and `odds_total.md`
- Check browser console for parsing errors

**Wrong odds displaying?**
- Make sure you downloaded the correct tab (Money vs Total)
- Check that you're viewing "Today" not "Yesterday" on OddsTrader
- Clear browser cache and refresh

**Parser errors?**
- Make sure files are saved as markdown (.md)
- Don't manually edit the downloaded files
- Re-download if format looks incorrect
