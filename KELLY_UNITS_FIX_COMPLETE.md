# ✅ KELLY UNITS FIX - COMPLETE

**Date:** December 17, 2025  
**Status:** ✅ FIXED - Ready for Testing  
**Issue:** Bets were using Dynamic units (3u) instead of Kelly units (5u)

---

## 🚨 **PROBLEM IDENTIFIED**

### **Before Fix:**
1. **Calculator** computed Kelly units (5u) → `prediction.unitSize`
2. **GitHub Actions** overwrote with Dynamic units (3u) → `unitSize: 3`
3. **UI** recalculated Kelly (5u) live → Showed 5u
4. **Cloud Function** used flat 1u → Profit calculation WRONG
5. **Client grader** recalculated units → Inconsistent

**Result:** 
- UI showed 5u
- Firebase stored 3u  
- Grading used 1u
- **COMPLETE CHAOS!**

---

## ✅ **FIXES APPLIED**

### **Fix #1: GitHub Actions Bet Writing**
**File:** `scripts/writeBasketballBets.js`

**Changed:**
```javascript
// ❌ BEFORE:
const dynamicUnits = dynamicResult.units;  // 3u
unitSize: dynamicUnits,

// ✅ AFTER:
const kellyUnits = prediction.unitSize;  // 5u (from calculator)
unitSize: kellyUnits,
```

**Lines Modified:** 68-80, 109, 149, 199

---

### **Fix #2: Cloud Function Grading**
**File:** `functions/src/basketballBetGrading.js`

**Changed:**
```javascript
// ❌ BEFORE:
const profit = calculateProfit(outcome, bet.bet.odds);  // Always 1u

function calculateProfit(outcome, odds) {
  if (outcome === "LOSS") return -1;  // Flat 1u
  return odds / 100;  // Flat 1u
}

// ✅ AFTER:
const units = bet.prediction?.unitSize || 1.0;
const profit = calculateProfit(outcome, bet.bet.odds, units);

function calculateProfit(outcome, odds, units = 1.0) {
  if (outcome === "LOSS") return -units;
  return units * (odds / 100);  // Scales by actual units!
}
```

**Lines Modified:** 238-244, 256, 362-385

---

### **Fix #3: Client-Side Grading**
**File:** `src/hooks/useBasketballResultsGrader.js`

**Changed:**
```javascript
// ❌ BEFORE:
const units = bet.prediction?.unitSize || getOptimizedUnitSize(grade, odds);
const profit = calculateUnitProfit(grade, odds, outcome === 'WIN');  // Didn't pass units!

// ✅ AFTER:
const units = bet.prediction?.unitSize || 1.0;
const profit = calculateUnitProfit(grade, odds, outcome === 'WIN', units);  // Passes units!
```

**Lines Modified:** 123-131

---

### **Fix #4: UI Display**
**File:** `src/pages/Basketball.jsx`

**Status:** ✅ Already correct!

```javascript
// Line 1872 - Already displays stored unitSize
{pred.unitSize > 0 ? `${pred.unitSize}u` : '0.5u'}
```

Since we're now writing Kelly units to `unitSize`, UI automatically shows correct value.

---

## 🎯 **EXAMPLE: CREIGHTON @ XAVIER BET**

### **Bet Details:**
- **Team:** Creighton (away)
- **Odds:** +148
- **Model Probability:** 53.3%
- **Expected Value:** +25.0%
- **Grade:** A

### **Kelly Calculation:**
```javascript
// Kelly fraction = (p × (b-1) - (1-p)) / (b-1)
// where p = 0.533, b = 2.48 (decimal odds)
kellyFraction = (0.533 × 1.48 - 0.467) / 1.48 = 0.2164

// Fractional Kelly (1/4 for safety)
fractionalKelly = 0.2164 / 4 = 0.0541

// Scale to 0.5-5.0 range
units = 0.0541 × 100 = 5.41 → capped at 5.0
```

**Result:** **5.0 units**

### **Profit Calculation:**

**If WIN:**
```javascript
units = 5.0
odds = +148
profitPerUnit = 148 / 100 = 1.48
totalProfit = 5.0 × 1.48 = +7.40u ✅
```

**If LOSS:**
```javascript
units = 5.0
totalProfit = -5.0u ✅
```

---

## 📋 **WHAT HAPPENS TOMORROW (Dec 18)**

### **11:30 AM ET - GitHub Actions Runs:**

1. **Fetch Data** (`fetch-basketball-data.yml`)
   - Scrapes OddsTrader, D-Ratings, Haslametrics
   - Saves to `public/*.md` files

2. **Write Bets** (`npm run write-basketball-bets`)
   - Loads scraped data
   - Matches games using CSV
   - Calculator computes Kelly units (e.g., 5u)
   - **Writes to Firebase:**
     ```javascript
     {
       prediction: {
         unitSize: 5.0,  // ✅ Kelly units!
         dynamicUnits: 3.0,  // For reference
         grade: "A",
         bestOdds: +148,
         bestEV: 25.0
       }
     }
     ```

3. **Deploy** - Site updates with new bets

---

## 🌙 **WHAT HAPPENS TONIGHT (Games Finish)**

### **Option A: Cloud Function (Every 4 hours)**

1. Fetches ungraded bets from `basketball_bets`
2. Calls NCAA API for final scores
3. Matches games (handles reversed home/away)
4. **Calculates profit:**
   ```javascript
   units = bet.prediction.unitSize  // 5.0u ✅
   profit = calculateProfit(outcome, odds, units)
   // WIN at +148: profit = 5.0 × 1.48 = +7.40u ✅
   ```
5. **Updates Firebase:**
   ```javascript
   {
     result: {
       outcome: "WIN",
       profit: 7.40,
       units: 5.0,  // ✅ Stored for stats
       awayScore: 75,
       homeScore: 74
     },
     status: "COMPLETED"
   }
   ```

### **Option B: Client-Side (Every 15 seconds when page open)**

1. Fetches ungraded bets
2. Loads results from OddsTrader CSV
3. **Calculates profit:**
   ```javascript
   units = bet.prediction.unitSize  // 5.0u ✅
   profit = calculateUnitProfit(grade, odds, isWin, units)
   // WIN at +148: profit = 5.0 × 1.48 = +7.40u ✅
   ```
4. Updates Firebase (same structure as Cloud Function)

---

## 📊 **STATS CALCULATION**

**File:** `src/hooks/useBasketballBetStats.js`

```javascript
// Units Won (sum of all profits)
const unitsWon = gradedBets.reduce((sum, bet) => {
  return sum + (bet.result.profit || 0);  // Uses stored profit ✅
}, 0);

// Total Risked (sum of all units bet)
const totalRisked = gradedBets.reduce((sum, bet) => {
  const units = bet.result?.units || bet.prediction?.unitSize || 1.0;
  return sum + units;  // Uses stored units ✅
}, 0);

// ROI
const roi = (unitsWon / totalRisked) × 100;
```

**Example with 10 bets:**
- 7 wins at 5u each: +7 × 7.40u = +51.8u
- 3 losses at 5u each: -3 × 5.0u = -15.0u
- **Total:** +36.8u on 50u risked = **73.6% ROI** ✅

---

## 🧪 **TESTING CHECKLIST**

### **Tomorrow Morning (After 11:30 AM):**
- [ ] Check Firebase Console → `basketball_bets` collection
- [ ] Verify new bets have `prediction.unitSize` = Kelly units (not 3u)
- [ ] Verify `prediction.dynamicUnits` exists for comparison
- [ ] Check UI displays correct unit sizes

### **Tomorrow Night (After Games):**
- [ ] Check graded bets in Firebase
- [ ] Verify `result.profit` matches: `units × (odds/100)` for wins
- [ ] Verify `result.units` field is stored
- [ ] Check performance dashboard shows correct ROI

### **Manual Test (Optional):**
```bash
# Test bet writing locally
npm run write-basketball-bets

# Check output for:
# "✅ Saved: [betId]"
# "🎯 Kelly Units: 5.0u (HIGH) | Dynamic: 3.0u | Score: 5.2"
```

---

## 🎉 **SUCCESS CRITERIA**

✅ **GitHub Actions writes Kelly units as primary `unitSize`**  
✅ **Cloud Function uses stored units for profit calculation**  
✅ **Client-side grading uses stored units**  
✅ **UI displays stored units (already working)**  
✅ **Stats calculation uses stored units**  
✅ **All three systems (write/grade/display) are synchronized**

---

## 📝 **FILES MODIFIED**

1. `scripts/writeBasketballBets.js` - Use Kelly units from calculator
2. `functions/src/basketballBetGrading.js` - Use stored units for profit
3. `src/hooks/useBasketballResultsGrader.js` - Pass stored units to profit calc

**Total Lines Changed:** ~25 lines across 3 files

---

## 🔍 **VERIFICATION QUERIES**

### **Check Today's Bets (Firebase Console):**
```javascript
// basketball_bets collection
// Filter: date == "2025-12-17"
// Look for: prediction.unitSize vs prediction.dynamicUnits
```

### **Check Graded Bets:**
```javascript
// basketball_bets collection  
// Filter: status == "COMPLETED"
// Verify: result.profit = result.units × (odds/100) for wins
```

---

## 🚀 **DEPLOYMENT**

**Status:** Ready to deploy  
**Risk Level:** 🟢 LOW - Only affects new bets and future grading  
**Rollback:** Revert 3 files if issues arise

**Next Steps:**
1. Commit changes
2. Push to GitHub
3. Wait for tomorrow's 11:30 AM run
4. Monitor Firebase for correct unit values
5. Verify grading tonight after games complete

---

**END OF DOCUMENT**

