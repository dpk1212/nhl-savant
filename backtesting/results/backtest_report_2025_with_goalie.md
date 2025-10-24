# NHL Prediction Model - 2025-26 Season Backtest Report
(WITH Goalie Integration)

**Generated:** 10/24/2025, 10:43:33 AM

---

## Executive Summary

- **Total Games:** 121
- **Date Range:** 10/7/2025 to 10/23/2025
- **Model Version:** v2.1-consultant-fix (with goalie integration)
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

- **RMSE:** 2.428 goals (Target: < 1.8)
- **MAE:** 1.903 goals
- **Avg Error:** -0.304 goals (under-predicting)
- **Verdict:** ❌ FAIL

## Calibration Curve

*Are X% predictions actually winning X% of the time?*

| Predicted Win % | Games | Actual Win % | Error | Status |
|----------------|-------|--------------|-------|--------|
| 50-55% | 121 | 49.6% | 0.41% | ✅ |

## Prediction Accuracy by Total Goals Range

| Goals Range | Games | Avg Actual | Avg Predicted | RMSE |
|-------------|-------|------------|---------------|------|
| 0-5 goals | 29 | 3.28 | 5.81 | 2.63 |
| 5-6 goals | 25 | 5.00 | 5.84 | 0.87 |
| 6-7 goals | 14 | 6.00 | 6.02 | 0.34 |
| 7+ goals | 53 | 8.38 | 5.89 | 3.05 |

## Accuracy by Team

### Best Predictions (Lowest RMSE)

| Team | Games | Avg Error | RMSE | Brier Score |
|------|-------|-----------|------|-------------|
| COL | 8 | -0.365 | 0.799 | 0.2500 |
| SEA | 8 | -0.006 | 0.887 | 0.2500 |
| TBL | 7 | 0.129 | 1.036 | 0.2500 |
| EDM | 8 | -0.012 | 1.171 | 0.2500 |
| PIT | 8 | -0.251 | 1.189 | 0.2500 |
| NSH | 8 | 0.367 | 1.206 | 0.2500 |
| BOS | 9 | -0.476 | 1.281 | 0.2500 |
| OTT | 8 | -0.268 | 1.364 | 0.2500 |
| WSH | 7 | 0.227 | 1.380 | 0.2500 |
| MIN | 8 | 0.220 | 1.390 | 0.2500 |

### Worst Predictions (Highest RMSE)

| Team | Games | Avg Error | RMSE | Brier Score |
|------|-------|-----------|------|-------------|
| BUF | 6 | 0.186 | 2.723 | 0.2500 |
| ANA | 7 | -0.491 | 2.561 | 0.2500 |
| NYR | 9 | 0.553 | 2.237 | 0.2500 |
| CBJ | 6 | -0.135 | 2.224 | 0.2500 |
| SJS | 7 | -0.197 | 2.125 | 0.2500 |
| UTA | 8 | -0.478 | 2.065 | 0.2500 |
| CHI | 8 | -0.211 | 1.977 | 0.2500 |
| VGK | 7 | -1.230 | 1.916 | 0.2500 |
| NYI | 7 | -0.674 | 1.832 | 0.2500 |
| DAL | 7 | -0.051 | 1.801 | 0.2500 |

## Performance by Month

| Month | Games | RMSE | Brier Score |
|-------|-------|------|-------------|
| 10/11/2 | 16 | 2.732 | 0.2500 |
| 10/12/2 | 1 | 4.615 | 0.2500 |
| 10/13/2 | 10 | 1.306 | 0.2500 |
| 10/14/2 | 8 | 2.584 | 0.2500 |
| 10/15/2 | 4 | 4.228 | 0.2500 |
| 10/16/2 | 11 | 2.132 | 0.2500 |
| 10/17/2 | 4 | 2.003 | 0.2500 |
| 10/18/2 | 12 | 1.936 | 0.2500 |
| 10/19/2 | 4 | 1.808 | 0.2500 |
| 10/20/2 | 5 | 1.704 | 0.2500 |
| 10/21/2 | 10 | 1.112 | 0.2500 |
| 10/22/2 | 3 | 1.662 | 0.2500 |
| 10/23/2 | 12 | 3.636 | 0.2500 |
| 10/7/20 | 3 | 1.845 | 0.2500 |
| 10/8/20 | 4 | 3.053 | 0.2500 |
| 10/9/20 | 14 | 2.155 | 0.2500 |

## Baseline Comparisons

### Total Goals Prediction

| Method | RMSE | Improvement |
|--------|------|-------------|
| Our Model | 2.428 | - |
| Always predict 6.0 | 2.426 | -0.1% |

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
- Total goals RMSE: 2.428
- Average prediction error: 0.304 goals
- Brier score: 0.2500
