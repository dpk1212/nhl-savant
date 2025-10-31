# Model Testing Framework

Comprehensive testing suite for NHL Savant prediction model accuracy and betting performance validation.

---

## Quick Start

### Run All Tests
```bash
npm run test:full
```

### Run Individual Tests
```bash
# Prediction accuracy only
npm run test:accuracy

# Betting validation only
npm run test:betting
```

---

## What Gets Tested

### 1. Prediction Accuracy (`test:accuracy`)

Tests model predictions against actual game results:

- **Win Probability**
  - Brier Score (calibration quality)
  - Win accuracy % (correct winner predictions)
  - Calibration curve (predicted % vs actual %)

- **Total Goals**
  - RMSE (Root Mean Square Error)
  - Average prediction bias (over/under-predicting)
  - Error distribution

**Output:** `EARLY_SEASON_2025_ACCURACY.md`

### 2. Betting Performance (`test:betting`)

Queries Firebase for completed bets and calculates actual ROI:

- Overall win rate and profit
- Performance by market type (moneyline, total, puck line)
- Performance by confidence tier
- Individual bet outcomes

**Output:** `BETTING_RESULTS_VALIDATION.md`

### 3. Full Audit (`test:full`)

Combines both tests above plus:

- Generates comprehensive audit report
- Compares to previous audits (trend analysis)
- Provides specific recommendations
- Archives results with timestamps

**Outputs:**
- `MODEL_ACCURACY_AUDIT_[DATE].md` - Master report
- `testing/results/audit_[DATE].json` - JSON data
- `testing/results/accuracy_[DATE].md` - Archived accuracy report
- `testing/results/betting_[DATE].md` - Archived betting report

---

## Targets & Grading

### Professional Model Benchmarks

| Metric | Target | Good | Excellent |
|--------|--------|------|-----------|
| **Win Accuracy** | > 55% | > 60% | > 65% |
| **Brier Score** | < 0.23 | < 0.20 | < 0.18 |
| **RMSE** | < 2.0 | < 1.8 | < 1.5 |
| **Bias** | ± 0.1 | ± 0.05 | ± 0.02 |
| **ROI** | > 5% | > 10% | > 15% |

### Grade Scale

- **A (Elite):** All metrics in "Excellent" range
- **B (Professional):** All metrics in "Good" range
- **C (Acceptable):** Meeting minimum targets
- **D (Needs Work):** Below targets

---

## Results Archive

All test results are saved to `testing/results/`:

```
testing/results/
├── audit_2025-10-31.json          # JSON data for programmatic access
├── accuracy_2025-10-31.md         # Detailed prediction analysis
├── betting_2025-10-31.md          # Betting performance breakdown
├── audit_2025-11-07.json          # Weekly audits
├── accuracy_2025-11-07.md
└── ...
```

### Trend Tracking

Run `npm run test:full` weekly to:
- Track performance improvements over time
- Compare current vs previous results
- Identify regression or improvement patterns

---

## Recommended Testing Schedule

### Daily (During Active Betting)
```bash
npm run test:betting  # Check if recent bets completed
```

### Weekly
```bash
npm run test:full     # Comprehensive audit
```

### After Model Changes
```bash
npm run test:accuracy # Verify improvements
```

---

## How to Interpret Results

### If RMSE > 2.0
Adjust calibration constant:
```javascript
// src/utils/dataProcessing.js
const CALIBRATION_CONSTANT = 1.545; // Increase if under-predicting
```

### If Win Accuracy < 55%
Check data quality and model inputs

### If Brier Score > 0.23
Adjust logistic function sensitivity:
```javascript
// src/utils/dataProcessing.js
const k = 0.55; // Increase for more confident predictions
```

### If ROI < 0%
- Review bet selection criteria
- Check if predictions match actual bets
- Consider increasing EV threshold

---

## Troubleshooting

### No Betting Results Found

If `test:betting` returns 0 bets:
1. Check Firebase connection (`.env` file)
2. Verify bets have been tracked
3. Ensure bets are marked as COMPLETED

### Accuracy Test Fails

If `test:accuracy` errors:
1. Verify data files exist in `public/`
2. Check CSV format hasn't changed
3. Ensure enough games have completed

---

## Files

### Scripts
- `scripts/test2025Accuracy.js` - Prediction accuracy tester
- `scripts/validateBettingResults.js` - Betting validator
- `scripts/runFullModelAudit.js` - Combined audit runner

### Reports
- `MODEL_ACCURACY_AUDIT_[DATE].md` - Master audit report
- `EARLY_SEASON_2025_ACCURACY.md` - Latest accuracy test
- `BETTING_RESULTS_VALIDATION.md` - Latest betting results

---

## Integration with Development

### Before Deploying Model Changes
```bash
# 1. Make changes to dataProcessing.js
# 2. Test impact
npm run test:accuracy

# 3. If improved, commit and deploy
git add .
git commit -m "Improved calibration"
npm run deploy
```

### Weekly Performance Review
```bash
# Run full audit
npm run test:full

# Review master report
# File: MODEL_ACCURACY_AUDIT_[DATE].md

# Implement recommendations
# Re-test to verify
```

---

## Advanced Usage

### Custom Date Range

Edit `scripts/test2025Accuracy.js` to filter games:

```javascript
const startDate = '10/1/2025';
const endDate = '10/31/2025';
const filtered = gamesRaw.filter(g => 
  g[0] >= startDate && g[0] <= endDate
);
```

### Export Results to CSV

Modify `runFullModelAudit.js` to add CSV export functionality.

---

## Questions?

Check the main audit report for specific recommendations tailored to your current model performance.

