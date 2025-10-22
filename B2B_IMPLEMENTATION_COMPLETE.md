# B2B/Rest Adjustments - IMPLEMENTED

**Date:** October 22, 2025
**Status:** ✅ CODE COMPLETE & LINTER PASSES

---

## WHAT WAS IMPLEMENTED

### New File: `src/utils/scheduleHelper.js`
Complete utility for schedule tracking and rest calculations:
- `indexSchedule()` - Parse CSV and index games by team + date
- `getDaysRest()` - Calculate days since last game
- `isBackToBack()` - Check if team is on B2B
- `getRestAdjustment()` - Return adjustment multiplier
- `getRestInfo()` - Debug/display rest details

**Logic:**
- B2B (1 day rest): -3% goals
- Normal rest (2 days): 0%
- Extra rest (3+ days): +4% goals
- Season start: 0%

### Modified: `src/utils/dataProcessing.js`

**1. Constructor (Line 5):**
```javascript
constructor(rawData, goalieProcessor = null, scheduleHelper = null)
// Now stores scheduleHelper as instance variable
```

**2. Function Signature (Line 312):**
```javascript
predictTeamScore(team, opponent, isHome = false, startingGoalie = null, gameDate = null)
// Added gameDate parameter for B2B lookups
```

**3. B2B Adjustment Logic (Line 390-401):**
```javascript
let totalGoals = goals_5v5 + goals_PP;

// NEW: Apply B2B/rest adjustment if schedule data available
if (this.scheduleHelper) {
  const restAdj = this.scheduleHelper.getRestAdjustment(team, gameDate);
  if (restAdj !== 0) {
    totalGoals *= (1 + restAdj);
  }
}

const goalieAdjusted = this.adjustForGoalie(totalGoals, opponent, startingGoalie);
```

---

## HOW TO USE

### Step 1: Load Schedule in App.jsx

```javascript
import Papa from 'papaparse';
import { ScheduleHelper } from './utils/scheduleHelper';

// In App.jsx loadData():
const scheduleText = await fetch('/nhl-202526-asplayed.csv').then(r => r.text());
Papa.parse(scheduleText, {
  header: true,
  complete: (results) => {
    const scheduleHelper = new ScheduleHelper(results.data);
    // Pass to EdgeCalculator and/or store in dataProcessor
  }
});
```

### Step 2: Pass to Prediction Functions

When calling predictTeamScore():
```javascript
// Before (still works - no B2B if gameDate omitted):
const score = dataProcessor.predictTeamScore(team, opponent, isHome);

// With B2B (preferred):
const score = dataProcessor.predictTeamScore(team, opponent, isHome, startingGoalie, gameDate);
```

### Step 3: Pass to DataProcessor Constructor

```javascript
const dataProcessor = new NHLDataProcessor(teamData, goalieProcessor, scheduleHelper);
```

---

## VALIDATION CHECKLIST

- [x] ScheduleHelper created with all methods
- [x] Schedule indexing by team + date
- [x] Days rest calculation (date math)
- [x] Rest adjustment logic (-3%, 0%, +4%)
- [x] NHLDataProcessor accepts scheduleHelper
- [x] predictTeamScore() accepts gameDate
- [x] B2B adjustment wired into prediction
- [x] Linter passes (no errors)
- [x] Fallback graceful (works without scheduleHelper)

---

## EXPECTED IMPACT

**Before:** All B2B games treated same as rested teams
**After:** B2B teams see -3% adjustment, extra rest +4%

**Example:**
```
Game: BOS (played yesterday) @ NYR (2 days rest)

Before:
  BOS prediction: 2.85 goals
  NYR prediction: 2.95 goals
  Total: 5.80

After:
  BOS: 2.85 * 0.97 = 2.76 goals (fatigued)
  NYR: 2.95 * 1.00 = 2.95 goals (normal)
  Total: 5.71 (lower, more realistic)
```

**Backtest Impact (expected):**
- October RMSE: 2.696 → 2.65-2.68 (better)
- April RMSE: 2.599 → 2.55-2.57 (better)
- Overall RMSE: 2.380 → 2.36-2.37

---

## NEXT STEPS

1. Load schedule in App.jsx
2. Test with a few B2B games to verify -3% shift
3. Rerun backtest to measure impact
4. If impact positive, this is validated

---

## FILES MODIFIED

- ✅ `src/utils/scheduleHelper.js` (NEW, 137 lines)
- ✅ `src/utils/dataProcessing.js` (3 edits, ~25 lines added)
- ✅ No breaking changes (all optional parameters)
- ✅ Linter passes

---

## LOW RISK CHANGES

✅ Optional parameters (gameDate defaults to null)
✅ Graceful fallback (works without schedule helper)
✅ No refactoring of existing logic
✅ No changes to existing function signatures (only added optional param)
✅ Schedule loading is optional

Status: **READY FOR INTEGRATION**

