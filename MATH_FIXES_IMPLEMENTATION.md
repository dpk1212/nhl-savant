# 🔧 MATHEMATICAL FIXES IMPLEMENTATION

## Summary of Audit Results

After comprehensive audit:
- ✅ **EV Formula**: Mathematically correct
- ✅ **Odds Conversion**: Correct
- ✅ **Total Probability**: Correct (normal distribution approach)
- ⚠️ **Win Probability**: Too aggressive, needs calibration

## The Core Issue

**The 44.6% EV is mathematically correct IF the 62.3% win probability is accurate.**

The issue is that our model finds a 19.2 percentage point edge (62.3% vs 43.1% market implied), which produces the high EV. This could mean:

1. **We found genuine value** (the model is right, market is wrong)
2. **Model is overconfident** (k value too aggressive)
3. **Missing factors** (injuries, rest, goalie matchups, etc.)

## Recommended Calibration Changes

### Change #1: Reduce Logistic Function Sensitivity

**File**: `src/utils/dataProcessing.js` line 351

**Current**:
```javascript
const k = 0.8;  // Too aggressive
```

**Recommended**:
```javascript
const k = 0.5;  // More conservative
// This will reduce probability swings
// 0.6 xGD difference: 64% → 57% win probability
```

**Impact**:
- Smaller edges (more realistic)
- Better alignment with market
- More conservative betting recommendations

### Change #2: Reduce Home Ice Advantage

**File**: `src/utils/dataProcessing.js` line 333

**Current**:
```javascript
const homeBonus = isHome ? 0.15 : 0;  // Too high
```

**Recommended**:
```javascript
const homeBonus = isHome ? 0.10 : 0;  // More realistic
// Research shows ~54% home win rate = ~0.10-0.12 xGD equivalent
```

**Impact**:
- Home teams will have smaller advantage
- More balanced probabilities
- Reduces overconfidence in home favorites

### Change #3: Add Confidence Disclaimer

**File**: `src/components/BetNarrative.jsx` or display logic

**Add Warning** when model probability differs from market by >15 percentage points:

```javascript
if (Math.abs(modelProb - marketProb) > 0.15) {
  // Display: "⚠️ Large discrepancy with market - verify injury reports, lineup changes"
}
```

### Change #4: Optional - Add Maximum EV Cap

**File**: `src/utils/edgeCalculator.js`

**Add safety check**:
```javascript
// Cap EV at reasonable maximum (e.g., 15% for NHL)
const cappedEV = Math.min(ev, stake * 0.15);
```

This prevents displaying absurdly high EVs that are likely model errors.

---

## Implementation Plan

### Step 1: Calibrate Win Probability (RECOMMENDED)
- Change k from 0.8 → 0.5
- Change homeBonus from 0.15 → 0.10
- Test on current games to see new probabilities

### Step 2: Verify Results
- Check that underdogs have probabilities <50%
- Check that favorites have probabilities >50%
- Check that EVs are in 1-10% range (not 40%+)

### Step 3: Add Warnings (OPTIONAL)
- Flag large market discrepancies
- Add confidence levels based on sample size
- Show when model might be overconfident

### Step 4: Backtest (FUTURE)
- Collect historical predictions
- Compare to actual results
- Adjust k value based on real-world performance

---

## Test Cases After Calibration

**Before (k=0.8, homeBonus=0.15):**
- CGY home vs WPG: 62.3% → 44.6% EV at +132

**After (k=0.5, homeBonus=0.10):**
- Expected: CGY home vs WPG: ~55-57% → ~10-15% EV at +132

**This is much more realistic!**

---

## Why This Matters

### Current State:
- Model finds 44.6% EV on a moneyline bet
- This implies we should bet ~40% of bankroll (Kelly)
- **This is dangerous if the model is wrong**

### After Calibration:
- Model finds ~10-12% EV
- This implies betting ~8-10% of bankroll (Kelly)
- **Much safer, still profitable if accurate**

---

## Final Recommendation

**IMPLEMENT STEP 1 IMMEDIATELY:**

Change these two lines:
1. `const k = 0.8;` → `const k = 0.5;`
2. `const homeBonus = isHome ? 0.15 : 0;` → `const homeBonus = isHome ? 0.10 : 0;`

This will:
- ✅ Reduce EVs to realistic levels (5-15% instead of 40%+)
- ✅ Better align with market probabilities
- ✅ Maintain edges when they exist
- ✅ Reduce risk of overconfident bets

**The mathematical formulas are correct. The calibration was too aggressive.**





