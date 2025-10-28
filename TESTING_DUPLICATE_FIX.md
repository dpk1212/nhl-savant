# Testing the Double Bets Fix

## Quick Test Guide

### 1. Run the Diagnostic Script (Check Current State)

```bash
cd /Users/dalekolnitys/NHL\ Savant/nhl-savant
node scripts/findDuplicateBets.js
```

**Expected Output (if duplicates exist)**:
```
❌ FOUND X DUPLICATE GROUPS:
[Details of duplicates]
```

**Expected Output (after fix is working)**:
```
✅ NO DUPLICATES FOUND!
All games have exactly 1 bet per market.
```

---

### 2. Test Basic Functionality

**Start the dev server**:
```bash
npm run dev
```

**Open browser**: `http://localhost:5173`

**Watch console logs** for:
```
📊 Found X games to track (ML + Total only)
✅ Tracked ML: CHI @ TBL - CHI ML (+5.2% EV)
✅ Tracked Total: CHI @ TBL - OVER 6.5 (+7.1% EV)
```

---

### 3. Test Page Reload (No Duplicates)

1. **Note the bets saved** (check console)
2. **Refresh the page** (Cmd+R / Ctrl+R)
3. **Watch console logs**

**Expected**: Should see "⏭️ Skipped update" or "📊 Updated bet" messages  
**NOT**: "✅ Saved new bet" for same games (that means duplicates!)

---

### 4. Test Odds Changes (Updates Same Bet)

This requires actual odds to change (hard to test manually). But you can verify by:

1. **Check Firebase Console**: [Bets Collection](https://console.firebase.google.com/project/nhl-savant/firestore/data/~2Fbets)
2. **Find a bet** with a `history` array
3. **Verify**:
   - Multiple entries in `history` array
   - `initialOdds` is preserved
   - `bet.odds` is current odds
   - Same bet ID across all history entries

**Example of good history tracking**:
```javascript
{
  id: "2025-10-28_CHI_TBL_TOTAL_OVER",
  initialOdds: +110,
  bet: {
    odds: +115  // Current odds
  },
  history: [
    { timestamp: 1698500000, odds: +110, evPercent: 5.2 },
    { timestamp: 1698510000, odds: +115, evPercent: 7.8 }
  ]
}
```

---

### 5. Verify Bet ID Format

**Check Firebase Console** and verify bet IDs follow the pattern:

**MONEYLINE bets**:
```
2025-10-28_CHI_TBL_MONEYLINE_CHI
2025-10-28_DAL_NSH_MONEYLINE_NSH
```

**TOTAL bets** (NO line number):
```
2025-10-28_CHI_TBL_TOTAL_OVER  ✅ Good
2025-10-28_DAL_NSH_TOTAL_UNDER ✅ Good

NOT:
2025-10-28_CHI_TBL_TOTAL_OVER_6.5  ❌ Bad (has line number)
```

---

### 6. Verify Exactly 1 Bet Per Market

For each game with odds, verify in Firebase:
- **Max 1** MONEYLINE bet per game
- **Max 1** TOTAL bet per game
- No duplicates with same date + game + market

---

## Troubleshooting

### If you see duplicates being created:

1. **Check console logs** for error messages
2. **Look for** "✅ Saved new bet" appearing multiple times for same game
3. **Run diagnostic script** to confirm duplicates
4. **Check** that all code changes were applied correctly

### If odds updates aren't working:

1. **Check** that Firebase transactions are being used
2. **Verify** console shows "📊 Updated bet" messages
3. **Look at** Firebase Console to see if `history` array is growing

### If page reloads create duplicates:

1. **Check** that `processingLock` and `processedToday` are working
2. **Verify** sequential processing is happening (not parallel)
3. **Look for** "⏳ Already processing" messages in console

---

## Success Indicators

✅ **Diagnostic script shows**: "NO DUPLICATES FOUND"  
✅ **Console logs show**: "⏭️ Skipped update" on page reload  
✅ **Firebase shows**: History arrays growing, not duplicate bets  
✅ **Bet IDs are**: Stable format without line numbers for totals  
✅ **Each game has**: Max 1 ML + 1 Total bet  

---

## Clean Up Existing Duplicates

If the diagnostic script finds duplicates:

1. **Run**: `node scripts/findDuplicateBets.js`
2. **For each duplicate group**, note the Document IDs
3. **Go to**: [Firebase Console](https://console.firebase.google.com/project/nhl-savant/firestore/data/~2Fbets)
4. **Keep**: The bet with earliest timestamp or most complete data
5. **Delete**: The other bet(s) by clicking the document and selecting "Delete"
6. **Re-run diagnostic**: Verify duplicates are gone

---

## After Testing

Once you've verified everything works:

1. ✅ Mark remaining test todos as completed
2. ✅ Deploy to production
3. ✅ Monitor logs for 24 hours
4. ✅ Run diagnostic script daily for first week
5. ✅ Clean up any legacy duplicates

