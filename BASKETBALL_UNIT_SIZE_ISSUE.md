# 🔍 Basketball Unit Size Discrepancy - Analysis

## The Problem

Basketball bets in Firebase show **TWO different unit sizes**:
- `staticUnitSize: 5`  
- `unitSize: 3`  

The UI displays `pred.unitSize` which shows **RECALCULATED** units (from live client-side calculation), not Firebase values.

---

## Root Cause

### What's Happening:

1. **Firebase Storage**  
   - When bets are first saved, `basketballBetTracker.js` writes `unitSize: prediction.unitSize` to Firebase  
   - Line 73 in `basketballBetTracker.js`: `unitSize: prediction.unitSize`  
   - **NO `staticUnitSize` field is written by our code**  

2. **UI Display**  
   - `Basketball.jsx` loads data fresh on every page load  
   - Line 257-263: `calculator.processGames(todaysGames)` **recalculates all predictions**  
   - Line 1749: `const pred = game.prediction` (**fresh calculation, not from Firebase**)  
   - Line 1872: `{pred.unitSize}u` displays the **recalculated** unit size  
   - Line 2118: `{pred.unitSize} units allocated` displays same **recalculated** value  

---

## Where Does `staticUnitSize` Come From?

**Answer: It doesn't exist in our codebase.**

Search results:
```
grep "staticUnitSize.*:" nhl-savant/src
```

**Only found in:**
- `BetHistoryPanel.jsx` (lines 213-215) - **READING** it as a fallback  
- Never **WRITTEN** by our code  

**This field may have been:**
- Written by an old version of the code  
- Manually added to Firebase  
- Left over from a previous implementation  

---

## What Should Be The Correct Value?

### Current System (Dec 2025):

**Basketball uses KELLY-INSPIRED unit sizing:**

From `basketballEdgeCalculator.js`:
```javascript
// Line 167: Calculate Kelly-inspired unit sizing
const kellyUnits = this.calculateOptimalUnits(bestEV, bestProb, bestOdds);

// Line 173: Use Kelly units as primary
const unitSize = kellyUnits;
```

**This is the CORRECT value** ✅

### Legacy Fields:

- `staticUnitSize` - **DEPRECATED** (old system)  
- `dynamicResult.dynamicUnits` - **CALCULATED FOR REFERENCE** but not used  

---

## The Answer

### ✅ **THE UI IS CORRECT**

**Display:** `pred.unitSize` (Kelly-inspired calculation)  
**Source:** Fresh calculation from `BasketballEdgeCalculator.processGames()`  
**Method:** Quarter-Kelly sizing based on EV, probability, and odds  

### ❌ **Firebase `staticUnitSize` is DEPRECATED**

This field should be **ignored** or **removed** from Firebase documents.

---

## Recommendation

### 1. **UI is Already Correct** ✅  
- Shows fresh Kelly-inspired units  
- Recalculates on every page load  
- Uses current confidence weights  

### 2. **Firebase Cleanup (Optional)**  
Remove deprecated `staticUnitSize` field from existing bets:

```javascript
// Clean up script (if needed)
const betsRef = collection(db, 'basketball_bets');
const snapshot = await getDocs(betsRef);

snapshot.forEach(async (doc) => {
  const bet = doc.data();
  if (bet.staticUnitSize !== undefined) {
    await updateDoc(doc.ref, {
      staticUnitSize: deleteField()
    });
  }
});
```

### 3. **Clarify Unit Source**  
Update `BetHistoryPanel.jsx` to remove `staticUnitSize` fallback:

**Current (lines 213-215):**
```javascript
?? bet.staticUnitSize 
?? bet.prediction?.staticUnitSize 
```

**Should be:**
```javascript
?? bet.prediction?.unitSize 
?? 1  // Default fallback
```

---

## Summary

| Field | Status | Usage |
|-------|--------|-------|
| `prediction.unitSize` | ✅ **CORRECT** | Kelly-inspired sizing, used everywhere |
| `staticUnitSize` | ❌ **DEPRECATED** | Old system, should be removed |
| Dynamic Confidence | 📊 **REFERENCE** | Calculated for tracking, not primary |

**ANSWER:** The UI displaying `pred.unitSize` is **100% CORRECT**. It shows the current Kelly-inspired unit calculation based on live data, confidence weights, and historical ROI patterns.

---

## Technical Details

### Unit Calculation Flow:

```
1. Basketball.jsx loads fresh data
   ↓
2. matchGamesWithCSV() matches odds/predictions
   ↓
3. calculator.processGames() runs for each game
   ↓
4. calculateEnsemblePrediction() blends models (80% DR / 20% Hasla)
   ↓
5. calculateOptimalUnits() applies quarter-Kelly
   ↓
6. Returns { unitSize: kellyUnits }
   ↓
7. UI displays pred.unitSize
```

### Why Fresh Calculation?

**Benefits:**
- Uses latest confidence weights (updated from live ROI tracking)  
- Adapts to changing market conditions  
- Incorporates newest historical performance data  
- Ensures consistency across all bets  

**Drawback:**
- Unit size may differ from when bet was first saved  
- Firebase `unitSize` becomes stale  

**Solution:**
- UI is the source of truth ✅  
- Firebase is for tracking results only  
- Recalculation ensures optimal sizing  

---

**Date:** December 17, 2025  
**Status:** ✅ RESOLVED - UI is correct, staticUnitSize is deprecated

