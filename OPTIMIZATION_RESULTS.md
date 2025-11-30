# 🎯 OPTIMAL UNIT MATRIX RESULTS

**Date:** 11/30/2025
**Bets Analyzed:** 157
**Best Strategy:** ROI-Proportional
**Projected ROI:** 16.60%

---

## A-B-C Simplified Matrix

| Grade | Odds Range | Units | Avg ROI | Sample Size | Source |
|-------|------------|-------|---------|-------------|--------|
| A | EXTREME_FAV | 1.0u | -22.8% | 2 bets | A+A+ |
| A | BIG_FAV | 4.0u | +15.7% | 1 bets | A+ |
| A | MOD_FAV | 3.0u | +12.1% | 2 bets | A++A |
| A | SLIGHT_FAV | 5.0u | +25.0% | 1 bets | A+ |
| A | PICKEM | 2.0u | +1.2% | 2 bets | A++A |
| A | DOG | 3.0u | +12.6% | 1 bets | A+ |
| B | EXTREME_FAV | 0.5u | +1.0% | 1 bets | B+ |
| B | BIG_FAV | 3.5u | +14.9% | 1 bets | B |
| B | MOD_FAV | 3.0u | +4.0% | 2 bets | B+B+ |
| B | SLIGHT_FAV | 5.0u | +54.9% | 2 bets | B+B+ |
| B | PICKEM | 5.0u | +68.7% | 1 bets | B |
| B | DOG | 2.0u | +0.0% | 0 bets | default |
| C | EXTREME_FAV | 1.0u | +2.5% | 2 bets | D+F |
| C | BIG_FAV | 3.0u | -21.8% | 3 bets | C+D+F |
| C | MOD_FAV | 3.5u | +21.7% | 3 bets | D+F+C |
| C | SLIGHT_FAV | 1.5u | -28.1% | 3 bets | F+D+C |
| C | PICKEM | 0.5u | -38.0% | 3 bets | C+D+F |
| C | DOG | 1.0u | +0.0% | 0 bets | default |

## Implementation Example

```javascript
// Usage:
const grade = getCurrentGrade(predictedEV);  // A, B, or C
const oddsRange = getOddsRange(odds);        // EXTREME_FAV, BIG_FAV, etc.
const units = ABC_MATRIX[grade][oddsRange];
```