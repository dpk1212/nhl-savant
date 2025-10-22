# 🎯 NHL Savant - Quick Reference Card

## Daily Workflow (Once or Twice Daily)

### 1. Fetch Fresh Data
```bash
cd "/Users/dalekolnitys/NHL Savant/nhl-savant"
npm run fetch-data
```

### 2. Review the Output
✅ Check that games are found  
✅ Check goalie count (might be 0 until ~2-4 hours before games)

### 3. Deploy to Production
```bash
git add public/*.md public/*.json
git commit -m "Update odds and goalies for $(date +%Y-%m-%d)"
git push
npm run deploy
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "0 goalies found" | Normal if < 3 hours before game time. Run again later or use `/admin/goalies` |
| "Network error" | Check internet connection and Firecrawl API key in `.env` |
| "Rate limit" | Wait 10 minutes, then try again |
| Odds look wrong | Check OddsTrader.com manually to verify |

---

## File Locations

- **Automation Script**: `/scripts/fetchData.js`
- **Docs**: `/AUTOMATION_GUIDE.md` (detailed guide)
- **API Key**: `/.env` → `FIRECRAWL_API_KEY`
- **Output Files**: `/public/odds_money.md`, `/public/odds_total.md`, `/public/starting_goalies.json`

---

## NPM Commands

| Command | What it does |
|---------|--------------|
| `npm run fetch-data` | Scrape odds + goalies |
| `npm run update-all` | Scrape + stage files for git |
| `npm run deploy` | Build + deploy to GitHub Pages |
| `npm run dev` | Run local dev server |

---

## Firecrawl Info

- **Dashboard**: https://firecrawl.dev/account
- **API Key**: `fc-a1a19d33dc894462889b67bb555834c9`
- **Monthly Credits**: 500 (free tier)
- **Daily Usage**: ~68 credits (if run 2x/day)

---

## Manual Backup (If Automation Fails)

1. Visit https://www.rotowire.com/hockey/nhl-lineups.php
2. Go to your app → `/admin/goalies`
3. Select goalies manually
4. Export to `starting_goalies.json`
5. Commit and push

---

**Need Help?** See `/AUTOMATION_GUIDE.md` for full documentation.

