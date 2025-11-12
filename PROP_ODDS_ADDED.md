# Prop/Odds Column Added + Scraper Limitation Note

## Changes Made

### 1. Added "Prop / Odds" Column ✅

**Files Modified**: 
- `src/components/PlayerRankingsTable.jsx`
- `src/pages/TopScorersTonight.jsx`

**What Was Added**:
- New column showing the actual betting line and odds from OddsTrader
- Example: `u½(-360)` means "Under 0.5 goals at -360 odds"
- Column placed right after "Matchup" for visibility
- Displayed in monospace font for readability

**Desktop Table**:
```
# | ⭐ | Player | Matchup | Prop/Odds | Opp xGA/60 | Goalie GSAE | ...
1 | ⭐ | Jack Roslovic | EDM @ PHI | u½(-360) | 2.78 | +6.1 | ...
```

**Mobile View**:
- Added odds below matchup info
- Displayed in smaller, monospace font

---

### 2. Scraper Limitation Clarified

**Scraping Status**: ❌ Limited to ~20 players

**Why We Can't Get 50+ Players**:
- Attempted to use Firecrawl actions API to click "Load More" button
- Error received: `ActionError: Error in action 1: Element not found`
- Firecrawl doesn't support reliable button clicking for dynamically loaded content
- OddsTrader uses lazy loading with "Load More" button after initial 20 players

**What We're Showing**:
- Added note under header: "Limited to 20 players (OddsTrader initial page load - "Load More" button requires manual scraping)"
- Only appears when exactly 20 players are loaded

**Scraper Code Attempted** (in `scripts/fetchPlayerProps.js`):
```javascript
actions: [
  { type: 'wait', milliseconds: 3000 },
  { type: 'click', selector: 'button:has-text("LOAD MORE")' },
  { type: 'wait', milliseconds: 3000 },
  { type: 'click', selector: 'button:has-text("LOAD MORE")' },
  { type: 'wait', milliseconds: 2000 }
]
```
Result: **Failed** - Element not found

---

## Alternative Solutions for 50+ Players

### Option 1: Puppeteer/Playwright (Recommended)
**Pros**:
- Full browser control
- Can click buttons reliably
- Can wait for dynamic content
- Can scroll to trigger lazy loading

**Cons**:
- More complex setup
- Requires Chrome/Chromium installation
- Slower than Firecrawl

**Implementation**: Replace Firecrawl with Puppeteer in `scripts/fetchPlayerProps.js`

### Option 2: Multiple Scrapes Per Day
**Pros**:
- OddsTrader rotates which 20 players show first based on odds changes
- Scraping 3-4 times per day could get 40-60 unique players

**Cons**:
- Still limited to ~20 per scrape
- Need deduplication logic
- Manual process

### Option 3: OddsTrader API (If Available)
**Pros**:
- Official data source
- All players at once
- More reliable

**Cons**:
- Likely requires paid subscription
- Unknown if they offer API access

---

## Current Data Fields Available

From `player_props.json`:
```json
{
  "name": "Jack Roslovic",
  "team": "EDM",
  "opponent": "PHI",
  "matchup": "EDM @ PHI",
  "gameTime": "Wed 11/12 7:30 PM",
  "market": "Player Total Goals",
  "evPercent": 14.9,
  "coverProbability": 93,
  "otEV": "+14.9%",
  "otCoverProb": 93,
  "odds": "u½(-360)"  // ← NOW DISPLAYED
}
```

---

## User Impact

**Before**:
- Missing the actual betting line
- Users had to guess what prop was being bet
- Missing odds information for context

**After**:
- ✅ Clear prop line shown (e.g., "u½")
- ✅ Odds displayed (e.g., "-360")
- ✅ Users can see exact betting information
- ✅ Transparency about 20-player limitation

---

## Next Steps (Optional)

1. **Implement Puppeteer scraper** to get 50+ players
2. **Add prop line parsing** to show "Over/Under 0.5 goals" in plain English
3. **Add odds calculator** to show implied probability from odds
4. **Add historical tracking** to see which props hit

---

## Files Modified

1. **`src/components/PlayerRankingsTable.jsx`**:
   - Added "Prop / Odds" column header
   - Added odds cell to desktop table
   - Added odds to mobile card view

2. **`src/pages/TopScorersTonight.jsx`**:
   - Added disclaimer note when 20 players detected
   - Changed player count to show total available

---

## Summary

✅ **Prop/Odds column added** - Users can now see the actual betting line
⚠️ **Limited to 20 players** - Firecrawl can't click "Load More" button
📝 **Transparency added** - Note explains limitation to users
🔧 **Future enhancement** - Would need Puppeteer for 50+ players

