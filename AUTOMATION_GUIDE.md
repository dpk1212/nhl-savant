# 🤖 NHL Savant - Automated Data Fetching Guide

## Overview

This system uses **Firecrawl** to automatically scrape and update NHL odds and goalie data from external sources.

## Quick Start

### Daily Update Workflow

Run this command once or twice daily:

```bash
npm run fetch-data
```

This will:
1. ✅ Scrape moneyline odds from OddsTrader → `public/odds_money.md`
2. ✅ Scrape total odds from OddsTrader → `public/odds_total.md`
3. ✅ Attempt to extract starting goalies from RotoWire → `public/starting_goalies.json`

### Deploy Updates

After fetching data:

```bash
npm run update-all       # Fetch data + stage files for commit
git commit -m "Auto-update: Odds and goalies for [DATE]"
git push
npm run deploy           # Build and deploy to GitHub Pages
```

## Data Sources

| Data Type | Source | URL | Method |
|-----------|--------|-----|--------|
| **Moneyline Odds** | OddsTrader | https://www.oddstrader.com/nhl/?eid&g=game&m=money | Firecrawl scrape |
| **Total Odds** | OddsTrader | https://www.oddstrader.com/nhl/?eid=0&g=game&m=total | Firecrawl scrape |
| **Starting Goalies** | RotoWire | https://www.rotowire.com/hockey/nhl-lineups.php | Firecrawl AI extract |

## Goalie Data Notes

### When Goalies Are Available
- **Best time to fetch**: 2-4 hours before game time
- **RotoWire updates**: Usually confirmed 1-3 hours before puck drop
- **If extraction finds 0 games**: Either no games today, or goalies not confirmed yet

### Manual Fallback
If automated extraction fails or finds 0 games, you can:
1. Visit https://www.rotowire.com/hockey/nhl-lineups.php
2. Manually update `/admin/goalies` page in the app
3. Export to `public/starting_goalies.json`
4. Commit and push

## Troubleshooting

### No Games Found
**Symptom**: "Converted 0 complete games"

**Possible causes**:
- No NHL games scheduled today
- Goalies not yet announced (check closer to game time)
- RotoWire page structure changed

**Solution**:
- Wait until 2-4 hours before games
- Check RotoWire manually
- Use the `/admin/goalies` page for manual entry

### Odds Files Look Wrong
**Symptom**: Odds files contain navigation/ads instead of game data

**Possible causes**:
- OddsTrader changed their page structure
- Scraping blocked by anti-bot measures

**Solution**:
- Check the URLs manually in a browser
- Contact Firecrawl support if persistent

### API Rate Limits
**Symptom**: "Rate limit exceeded" errors

**Solution**:
- Wait 5-10 minutes between fetch attempts
- Upgrade Firecrawl plan if needed
- Check your API key at https://firecrawl.dev/account

## Configuration

### Environment Variables
Located in `.env`:

```bash
FIRECRAWL_API_KEY=fc-a1a19d33dc894462889b67bb555834c9
```

### Scripts (package.json)
```json
{
  "fetch-data": "node scripts/fetchData.js",
  "update-all": "npm run fetch-data && git add public/odds_money.md public/odds_total.md public/starting_goalies.json"
}
```

## Advanced Usage

### Customize Scraping
Edit `/scripts/fetchData.js`:

```javascript
// Adjust wait time for JavaScript loading
await firecrawl.scrape(url, {
  waitFor: 3000  // milliseconds
});

// Modify AI extraction prompt
await firecrawl.extract({
  prompt: 'Your custom extraction instructions...',
  schema: { /* your schema */ }
});
```

### Add New Data Sources
1. Add a new scrape/extract call in `fetchData.js`
2. Add output file writing
3. Update the parser in `src/utils/` if needed

## Support

- **Firecrawl Docs**: https://docs.firecrawl.dev
- **Firecrawl Dashboard**: https://firecrawl.dev/account
- **NHL Savant Issues**: Contact your development team

## Status

✅ **Odds Scraping**: Working reliably  
⚠️ **Goalie Extraction**: Dependent on RotoWire data availability  
✅ **Automated Deployment**: Manual push required (GitHub Actions possible)

---

**Last Updated**: October 22, 2025

