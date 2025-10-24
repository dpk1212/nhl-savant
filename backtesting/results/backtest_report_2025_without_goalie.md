# NHL Prediction Model - 2025-26 Season Backtest Report
(WITHOUT Goalie Integration)

**Generated:** 10/24/2025, 10:43:33 AM

---

## Executive Summary

- **Total Games:** 121
- **Date Range:** 10/7/2025 to 10/23/2025
- **Model Version:** v2.1-consultant-fix (without goalie integration)
- **Errors:** 0 (0.00%)

## Overall Performance

### Win Probability Accuracy

- **Brier Score:** 0.2500 (Target: < 0.25)
  - 0.25 = baseline (random guessing)
  - 0.20 = good
  - 0.15 = excellent
- **Prediction Accuracy:** 50.41% (61/121)
- **Verdict:** ❌ FAIL

### Total Goals Prediction

- **RMSE:** 2.424 goals (Target: < 1.8)
- **MAE:** 1.898 goals
- **Avg Error:** -0.310 goals (under-predicting)
- **Verdict:** ❌ FAIL

## Calibration Curve

*Are X% predictions actually winning X% of the time?*

| Predicted Win % | Games | Actual Win % | Error | Status |
|----------------|-------|--------------|-------|--------|
| 50-55% | 121 | 49.6% | 0.41% | ✅ |

## Prediction Accuracy by Total Goals Range

| Goals Range | Games | Avg Actual | Avg Predicted | RMSE |
|-------------|-------|------------|---------------|------|
| 0-5 goals | 29 | 3.28 | 5.80 | 2.62 |
| 5-6 goals | 25 | 5.00 | 5.83 | 0.86 |
| 6-7 goals | 14 | 6.00 | 6.02 | 0.33 |
| 7+ goals | 53 | 8.38 | 5.89 | 3.05 |

## Accuracy by Team

### Best Predictions (Lowest RMSE)

| Team | Games | Avg Error | RMSE | Brier Score |
|------|-------|-----------|------|-------------|
| COL | 8 | -0.370 | 0.800 | 0.2500 |
| SEA | 8 | -0.006 | 0.883 | 0.2500 |
| TBL | 7 | 0.127 | 1.030 | 0.2500 |
| EDM | 8 | -0.012 | 1.163 | 0.2500 |
| PIT | 8 | -0.255 | 1.188 | 0.2500 |
| NSH | 8 | 0.360 | 1.197 | 0.2500 |
| BOS | 9 | -0.479 | 1.280 | 0.2500 |
| OTT | 8 | -0.271 | 1.363 | 0.2500 |
| WSH | 7 | 0.223 | 1.379 | 0.2500 |
| MIN | 8 | 0.214 | 1.389 | 0.2500 |

### Worst Predictions (Highest RMSE)

| Team | Games | Avg Error | RMSE | Brier Score |
|------|-------|-----------|------|-------------|
| BUF | 6 | 0.181 | 2.719 | 0.2500 |
| ANA | 7 | -0.495 | 2.555 | 0.2500 |
| NYR | 9 | 0.551 | 2.233 | 0.2500 |
| CBJ | 6 | -0.139 | 2.222 | 0.2500 |
| SJS | 7 | -0.202 | 2.124 | 0.2500 |
| UTA | 8 | -0.480 | 2.058 | 0.2500 |
| CHI | 8 | -0.208 | 1.973 | 0.2500 |
| VGK | 7 | -1.225 | 1.910 | 0.2500 |
| NYI | 7 | -0.675 | 1.827 | 0.2500 |
| DAL | 7 | -0.060 | 1.801 | 0.2500 |

## Performance by Month

| Month | Games | RMSE | Brier Score |
|-------|-------|------|-------------|
| 10/11/2 | 16 | 2.730 | 0.2500 |
| 10/12/2 | 1 | 4.609 | 0.2500 |
| 10/13/2 | 10 | 1.300 | 0.2500 |
| 10/14/2 | 8 | 2.576 | 0.2500 |
| 10/15/2 | 4 | 4.223 | 0.2500 |
| 10/16/2 | 11 | 2.129 | 0.2500 |
| 10/17/2 | 4 | 2.002 | 0.2500 |
| 10/18/2 | 12 | 1.932 | 0.2500 |
| 10/19/2 | 4 | 1.799 | 0.2500 |
| 10/20/2 | 5 | 1.705 | 0.2500 |
| 10/21/2 | 10 | 1.111 | 0.2500 |
| 10/22/2 | 3 | 1.660 | 0.2500 |
| 10/23/2 | 12 | 3.630 | 0.2500 |
| 10/7/20 | 3 | 1.826 | 0.2500 |
| 10/8/20 | 4 | 3.051 | 0.2500 |
| 10/9/20 | 14 | 2.149 | 0.2500 |

## Baseline Comparisons

### Total Goals Prediction

| Method | RMSE | Improvement |
|--------|------|-------------|
| Our Model | 2.424 | - |
| Always predict 6.0 | 2.426 | 0.1% |

### Win Probability Prediction

| Method | Brier Score | Improvement |
|--------|-------------|-------------|
| Our Model | 0.2500 | - |
| Always 50% | 0.2500 | 0.0% |

## Summary

**Overall Model Performance:** ❌ NEEDS IMPROVEMENT

❌ **Underperforming.** Model requires significant improvements before use.

### Key Insights:

- Win prediction accuracy: 50.41%
- Total goals RMSE: 2.424
- Average prediction error: 0.310 goals
- Brier score: 0.2500
