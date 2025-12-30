# 🏀 Basketball Display Issue - Root Cause & Solution

**Date:** December 22, 2025  
**Issue:** 4 bets exist in Firebase but may not all be displaying in UI

---

## ✅ FIREBASE VERIFICATION

Ran diagnostic script - **ALL 4 BETS ARE IN FIREBASE:**

1. **Abilene Christian** @ Texas Southern - 17.8% EV, A grade, 5.0u
2. **Seattle** @ UTSA - 5.5% EV, A grade, 5.0u
3. **Texas-Arlington** @ Oral Roberts - 4.9% EV, B grade, 2.0u
4. **SIU-Edwardsville** @ Western Illinois - 4.1% EV, B grade, 2.0u

**All bets have 4%+ EV** - they pass the 3% threshold.

---

## 🔍 ROOT CAUSE ANALYSIS

### The Double-Filter Problem

**Location 1: GitHub Workflow (DEPRECATED)**
- File: `.github/workflows/fetch-basketball-data.yml` (line 43-44)
- Calls: `npm run write-basketball-bets`
- Script: `scripts/writeBasketballBets.js`
- Filter: `processGames()` → `shouldBet()` → **3% minimum EV**

**Location 2: UI Display (ACTIVE)**
- File: `src/pages/Basketball.jsx` (line 262-263)
- Calls: `calculator.processGames(todaysGames)`
- Filter: `processGames()` → `shouldBet()` → **3% minimum EV**

**Location 3: shouldBet() Filter**
- File: `src/utils/basketballEdgeCalculator.js` (line 388-423)
- Filters:
  - ❌ EV < 3%
  - ❌ D or F grades
  - ❌ Probability < threshold
  - ❌ Extreme odds

---

## 🎯 WHY USERS SEE FEWER GAMES

### Scenario 1: Missing Lower-EV Games (1-3%)
- Games with 1-3% EV are **never saved to Firebase**
- Users miss profitable opportunities
- **This is the main complaint**

### Scenario 2: UI Display Issues
Possible reasons users might not see all 4 bets:

1. **Browser Cache**
   - Old JavaScript cached
   - Solution: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

2. **Game Status Filter**
   - UI has filter buttons: All | Scheduled | Live | Final
   - If "Final" or "Live" selected, scheduled games won't show
   - Default is "All" but user may have changed it

3. **Data Loading Race Condition**
   - UI loads recommendations BEFORE Firebase bets load
   - `betsSaved` flag prevents re-saving
   - If timing is off, games might not display

4. **JavaScript Error**
   - Error in console prevents rendering
   - Check browser console for errors

5. **Sort Order Issue**
   - Games sorted by confidence/time/edge
   - All should still display, just in different order

---

## 🔧 IMMEDIATE SOLUTIONS

### Solution 1: Check User's Browser (FASTEST)

**Ask user to:**
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Check filter buttons - ensure "All Games" is selected
3. Open browser console (F12) - look for errors
4. Clear cache and reload

### Solution 2: Lower EV Threshold (RECOMMENDED)

**Change minimum EV from 3% → 1%**

File: `src/utils/basketballEdgeCalculator.js` (line 36)

```javascript
// BEFORE:
this.minEV = 3;  // 3% minimum EV

// AFTER:
this.minEV = 1;  // 1% minimum EV
```

**Benefits:**
- Show ALL profitable opportunities
- More picks for users (5-15 games vs 2-5)
- Still filtered for quality (no extreme odds, no D/F grades)

### Solution 3: Remove Deprecated Script

File: `.github/workflows/fetch-basketball-data.yml` (lines 43-44)

```yaml
# REMOVE THESE LINES:
- name: Write basketball bets to Firebase
  run: npm run write-basketball-bets
```

**Benefits:**
- Single source of truth (UI handles all saving)
- No double-filtering
- Cleaner architecture

---

## 🐛 DEBUGGING STEPS

### Step 1: Check What UI Receives

Add console.log in `Basketball.jsx` (line 264):

```javascript
const qualityGames = calculator.processGames(todaysGames);
console.log('🏀 Quality games after filter:', qualityGames.length);
console.log('🏀 Games:', qualityGames.map(g => `${g.awayTeam} @ ${g.homeTeam}`));
```

### Step 2: Check Firebase Loading

Add console.log in `Basketball.jsx` (line 82):

```javascript
setBetsMap(betsData);
console.log('🔥 Firebase bets loaded:', betsData.size);
console.log('🔥 Today\'s bets:', Array.from(betsData.values()).filter(b => b.date === '2025-12-22').length);
```

### Step 3: Check Recommendations State

Add console.log in `Basketball.jsx` (line 327):

```javascript
setRecommendations(sortedGames);
console.log('📊 Recommendations set:', sortedGames.length);
```

---

## ✅ VERIFICATION CHECKLIST

After implementing fixes:

- [ ] Run `node scripts/checkTodaysBetsClient.js` - verify Firebase has bets
- [ ] Open basketball page in browser
- [ ] Check browser console for logs
- [ ] Verify all 4 games display
- [ ] Test filter buttons (All/Scheduled/Live/Final)
- [ ] Test sort options (Confidence/Time/Edge)
- [ ] Hard refresh and verify again

---

## 📝 NEXT STEPS

1. **Ask user to check browser:**
   - Hard refresh
   - Check filter selection
   - Check console for errors

2. **If still not showing:**
   - Implement Solution 2 (lower EV threshold)
   - Deploy and test

3. **Long-term:**
   - Remove deprecated script (Solution 3)
   - Add better error handling in UI
   - Add loading states for Firebase data

---

## 🚨 CRITICAL FINDING

**All 4 bets ARE in Firebase with 4%+ EV.**

If user still doesn't see them, it's likely:
1. Browser cache issue
2. Filter button selected wrong
3. JavaScript error in console

**ACTION:** Ask user to hard refresh and check filter buttons first!


