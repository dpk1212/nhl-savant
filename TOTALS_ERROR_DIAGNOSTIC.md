# TOTALS PREDICTION ERROR DIAGNOSTIC REPORT

**Date:** 2025-10-31
**Games Analyzed:** 129

## Overall Statistics

| Metric | Value |
|--------|-------|
| **RMSE** | 2.396 goals |
| **Average Error (Bias)** | -0.168 goals |
| **Average Absolute Error** | 1.898 goals |
| **Over-Predictions** | 64 games (49.6%) |
| **Under-Predictions** | 65 games (50.4%) |

## Error by Game Type

### High-Scoring Games (>7 goals)

- **Count:** 34
- **RMSE:** 3.574 goals
- **Bias:** -3.274 goals

### Low-Scoring Games (<5 goals)

- **Count:** 27
- **RMSE:** 3.035 goals
- **Bias:** 2.867 goals

## Error by Team

| Team | Games | Avg Error | RMSE | Pattern |
|------|-------|-----------|------|----------|
| OTT | 9 | -2.25 | 3.36 | Under-predicts |
| STL | 9 | -1.71 | 3.09 | Under-predicts |
| NYR | 9 | 2.07 | 2.99 | Over-predicts |
| WSH | 9 | 1.47 | 2.81 | Over-predicts |
| COL | 7 | 0.26 | 2.80 | Balanced |
| CHI | 8 | -0.57 | 2.79 | Under-predicts |
| BUF | 8 | 0.08 | 2.77 | Balanced |
| EDM | 8 | -0.42 | 2.76 | Balanced |
| BOS | 11 | -0.88 | 2.73 | Under-predicts |
| UTA | 9 | -0.35 | 2.70 | Balanced |

## Error by Goalie (Top 10 Worst)

| Goalie | Games | Avg Error | RMSE |
|--------|-------|-----------|------|
| Jacob Markstrom | 3 | -3.91 | 4.27 |
| Jonathan Quick | 3 | 2.81 | 3.93 |
| Joel Hofer | 4 | -3.29 | 3.85 |
| Akira Schmid | 3 | -1.41 | 3.58 |
| Calvin Pickard | 3 | -1.68 | 3.46 |
| Charlie Lindgren | 3 | 0.88 | 3.21 |
| Karel Vejmelka | 6 | -1.30 | 3.11 |
| Joonas Korpisalo | 4 | -1.66 | 3.08 |
| Alex Lyon | 7 | 0.13 | 2.96 |
| Jake Oettinger | 6 | 1.50 | 2.84 |

## Top 20 Worst Predictions

| Date | Game | Actual | Predicted | Error |
|------|------|--------|-----------|-------|
| 10/28/2025 | NJD @ COL | 12 | 5.65 | -6.35 |
| 10/15/2025 | OTT @ BUF | 12 | 5.86 | -6.14 |
| 10/23/2025 | ANA @ BOS | 12 | 6.08 | -5.92 |
| 10/28/2025 | WSH @ DAL | 1 | 6.73 | 5.73 |
| 10/15/2025 | CHI @ STL | 11 | 5.84 | -5.16 |
| 10/12/2025 | WSH @ NYR | 1 | 6.14 | 5.14 |
| 10/23/2025 | MTL @ EDM | 11 | 5.93 | -5.07 |
| 10/23/2025 | UTA @ STL | 11 | 5.95 | -5.05 |
| 10/14/2025 | NSH @ TOR | 11 | 6.01 | -4.99 |
| 10/16/2025 | BOS @ VGK | 11 | 6.20 | -4.80 |
| 10/11/2025 | CBJ @ MIN | 11 | 6.35 | -4.65 |
| 10/28/2025 | NYR @ VAN | 2 | 6.33 | 4.33 |
| 10/28/2025 | OTT @ CHI | 10 | 5.83 | -4.17 |
| 10/25/2025 | STL @ DET | 10 | 5.87 | -4.13 |
| 10/14/2025 | EDM @ NYR | 2 | 5.88 | 3.88 |
| 10/18/2025 | PIT @ SJS | 3 | 6.50 | 3.50 |
| 10/9/2025 | CBJ @ NSH | 3 | 6.43 | 3.43 |
| 10/23/2025 | VAN @ NSH | 3 | 6.41 | 3.41 |
| 10/7/2025 | PIT @ NYR | 3 | 6.28 | 3.28 |
| 10/9/2025 | OTT @ TBL | 9 | 5.73 | -3.27 |

## Key Findings

## Recommended Actions

1. **Calibration Issue:** Overall bias indicates need for recalibration
2. **Team-Specific Patterns:** Some teams consistently mis-predicted
3. **Goalie Impact:** High RMSE for certain goalies suggests adjustment issues
4. **Score Range:** Different accuracy for high vs low-scoring games
