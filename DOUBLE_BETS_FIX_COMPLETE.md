# Double Bets Issue - Fix Complete ✅

**Date**: October 28, 2025  
**Status**: IMPLEMENTED - READY FOR TESTING

---

## 🎯 Problem Summary

The system was creating duplicate bets in Firebase for the same game/market combination due to:

1. **Race conditions** in async bet saving operations
2. **No atomic Firebase operations** (check-then-set pattern)
3. **React re-renders** triggering duplicate save attempts
4. **Inconsistent bet IDs** when odds/lines changed
5. **Manual scripts** could create duplicates

---

## ✅ Solution Implemented

### 1. Deterministic Bet ID Generation (`betTracker.js`)

**New Method**: `generateBetId(date, awayTeam, homeTeam, market, edge)`

**MONEYLINE Bets**:
```javascript
`${date}_${awayTeam}_${homeTeam}_MONEYLINE_${team}`
// Example: 2025-10-28_CHI_TBL_MONEYLINE_CHI
// Same ID whether odds are +150 or +140
```

**TOTAL Bets** (NO LINE NUMBER):
```javascript
`${date}_${awayTeam}_${homeTeam}_TOTAL_${side}`
// Example: 2025-10-28_CHI_TBL_TOTAL_OVER
// Same ID whether line is 6.5 or 6.0
```

**Benefits**:
- ✅ Odds changes → Updates same bet
- ✅ Line movements → Updates same bet
- ✅ Full history tracking in `history` array
- ✅ Enables Closing Line Value (CLV) analysis

---

### 2. Firebase Transactions for Atomic Operations (`betTracker.js`)

**Before** (Vulnerable to race conditions):
```javascript
const existingBet = await getDoc(betRef);
if (existingBet.exists()) {
  await updateDoc(betRef, updates);
} else {
  await setDoc(betRef, newBet);
}
```

**After** (Atomic with transactions):
```javascript
await runTransaction(db, async (transaction) => {
  const existingBet = await transaction.get(betRef);
  if (existingBet.exists()) {
    transaction.update(betRef, updates);
  } else {
    transaction.set(betRef, newBet);
  }
});
```

**Benefits**:
- ✅ Atomic read-check-write operation
- ✅ No race conditions between multiple processes
- ✅ Guaranteed consistency

---

### 3. Sequential Processing with Locks (`useBetTracking.js`)

**Before** (Parallel processing with race conditions):
```javascript
opportunities.forEach(async (game) => {
  await saveBet(game, bestML);
  await saveBet(game, bestTotal);
});
```

**After** (Sequential with locks):
```javascript
(async () => {
  for (const game of opportunities) {
    const gameId = `${date}_${away}_${home}`;
    
    // Skip if already processing
    if (processingLock.has(gameId)) continue;
    if (processedToday.has(gameId)) continue;
    
    // Lock this game
    processingLock.set(gameId, true);
    
    try {
      await saveBet(game, bestML);
      await saveBet(game, bestTotal);
      processedToday.add(gameId);
    } finally {
      processingLock.delete(gameId);
    }
  }
})();
```

**Benefits**:
- ✅ Sequential processing prevents concurrent saves
- ✅ Processing locks prevent same-game duplicates
- ✅ Session tracking prevents re-processing
- ✅ Proper error handling with try/finally

---

### 4. Memoized Dependencies (`TodaysGames.jsx`)

**Added**:
```javascript
const memoizedAllEdges = useMemo(() => allEdges, [
  allEdges.length,
  allEdges.map(g => `${g.awayTeam}_${g.homeTeam}_${g.bestEdge?.evPercent || 0}`).join('|')
]);

useBetTracking(memoizedAllEdges, dataProcessor);
```

**Benefits**:
- ✅ Prevents unnecessary re-renders
- ✅ useBetTracking only runs when data actually changes
- ✅ Reduces duplicate save attempts

---

### 5. Diagnostic Script (`scripts/findDuplicateBets.js`)

**Purpose**: Detect and report duplicate bets in Firebase

**Features**:
- Groups bets by date + game + market
- Identifies duplicates (>1 bet per game/market)
- Shows detailed comparison of duplicates
- Provides recommendations for cleanup

**Run with**:
```bash
node scripts/findDuplicateBets.js
```

---

## 📊 Expected Behavior After Fix

### Scenario 1: First Discovery (9 AM)
```
Game: CHI @ TBL
- CHI ML +150 (+5.2% EV) ✅ Creates bet
- OVER 6.5 +110 (+7.1% EV) ✅ Creates bet

Result: 2 bets created
```

### Scenario 2: Odds Change (12 PM)
```
Game: CHI @ TBL
- CHI ML +140 (+4.8% EV) ✅ Updates existing bet
- OVER 6.5 +115 (+8.3% EV) ✅ Updates existing bet

Bet IDs remain the same
History array updated with new odds
initialOdds preserved for CLV analysis

Result: 0 new bets, 2 bets updated
```

### Scenario 3: Line Movement (3 PM)
```
Game: CHI @ TBL
- CHI ML +140 (+4.8% EV) ⏭️ No change
- OVER 6.0 +110 (+6.5% EV) ✅ Updates existing bet

Bet ID still: 2025-10-28_CHI_TBL_TOTAL_OVER
Line updated from 6.5 to 6.0
History tracks line change

Result: 0 new bets, 1 bet updated
```

### Scenario 4: Page Reload
```
User refreshes page

processingLock resets
processedToday resets
BUT Firebase transaction checks existing bets

Result: 0 new bets, existing bets may update if odds changed
```

---

## 🧪 Testing Checklist

### Manual Testing Needed:

- [ ] **Test odds changes**: Verify same bet ID, history updated
- [ ] **Test line movements**: Verify same bet ID, line tracked
- [ ] **Test page reloads**: Verify no duplicates created
- [ ] **Test side switches**: Verify new bet created (OVER → UNDER)
- [ ] **Run diagnostic script**: Check for existing duplicates
- [ ] **Clean up duplicates**: Remove any existing duplicates
- [ ] **Monitor console logs**: Verify proper locking behavior

---

## 🔍 How to Verify Fix is Working

### 1. Check Console Logs

**Good logs (no duplicates)**:
```
📊 Found 5 games to track (ML + Total only)
✅ Tracked ML: CHI @ TBL - CHI ML (+5.2% EV)
✅ Tracked Total: CHI @ TBL - OVER 6.5 (+7.1% EV)
⏭️ Skipped update (no significant change): 2025-10-28_CHI_TBL_MONEYLINE_CHI
```

**Bad logs (duplicates being created)**:
```
✅ Saved new bet: 2025-10-28_CHI_TBL_MONEYLINE_CHI
✅ Saved new bet: 2025-10-28_CHI_TBL_MONEYLINE_CHI  ❌ DUPLICATE!
```

### 2. Run Diagnostic Script

```bash
node scripts/findDuplicateBets.js
```

**Expected output (no duplicates)**:
```
✅ NO DUPLICATES FOUND!
All games have exactly 1 bet per market. System is working correctly.
```

### 3. Check Firebase Console

Navigate to: `https://console.firebase.google.com/project/nhl-savant/firestore/data/~2Fbets`

**Verify**:
- Each game has max 1 MONEYLINE bet
- Each game has max 1 TOTAL bet
- Bet IDs are stable (no line numbers for totals)
- History arrays show odds/line changes

---

## 📝 Files Modified

1. **`src/firebase/betTracker.js`**
   - Added `generateBetId()` method (line-agnostic)
   - Implemented Firebase transactions for atomic operations
   - Enhanced history tracking with line changes

2. **`src/hooks/useBetTracking.js`**
   - Replaced `forEach` with sequential `for...of` loop
   - Added `processingLock` Map for concurrent protection
   - Added `processedToday` Set for session deduplication

3. **`src/components/TodaysGames.jsx`**
   - Added `useMemo` import
   - Memoized `allEdges` to prevent unnecessary re-renders
   - Updated `useBetTracking` to use memoized edges

4. **`scripts/findDuplicateBets.js`** (NEW)
   - Diagnostic tool to detect and report duplicates
   - Groups bets by game + market
   - Provides cleanup recommendations

---

## 🎯 Success Criteria

✅ Exactly 1 ML bet per game per day  
✅ Exactly 1 Total bet per game per day  
✅ Odds changes update existing bet  
✅ Line movements update existing bet  
✅ No duplicates on page refresh  
✅ No race conditions  
✅ Full history tracking for CLV analysis  
✅ Diagnostic tool confirms no duplicates  

---

## 🚀 Next Steps

1. **Deploy to production**
2. **Monitor console logs** for next 24 hours
3. **Run diagnostic script daily** for first week
4. **Clean up any existing duplicates** using Firebase Console
5. **Verify CLV analysis** works with history data

---

## 💡 Technical Notes

### Why No Line Numbers in Total Bet IDs?

**Problem**: If line moves from 6.5 to 6.0:
- Old approach: `2025-10-28_CHI_TBL_TOTAL_OVER_6.5` → `2025-10-28_CHI_TBL_TOTAL_OVER_6.0`
- Creates 2 different bets ❌

**Solution**: Exclude line from ID:
- New approach: `2025-10-28_CHI_TBL_TOTAL_OVER` (stable)
- Line changes tracked in `bet.line` field and `history` array ✅

### Why Firebase Transactions?

Without transactions:
1. Process A: Check bet doesn't exist
2. Process B: Check bet doesn't exist (simultaneously)
3. Process A: Create bet
4. Process B: Create bet (duplicate!)

With transactions:
1. Process A: Start transaction, check, create
2. Process B: Wait for transaction to complete
3. Process B: Start transaction, check (bet exists), update
4. No duplicates! ✅

---

**Implementation Complete** ✅  
Ready for testing and deployment.

