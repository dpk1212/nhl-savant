# NHL Model Backtesting

This folder contains the backtesting framework for validating the NHL prediction model on historical data.

## Purpose

Validate the model's accuracy on the complete 2024 NHL season to determine:
- **Win probability calibration** (Brier score)
- **Total goals prediction accuracy** (RMSE)
- **Goalie integration impact**
- **Performance by team/month**
- **Readiness for real-money betting**

## Folder Structure

```
backtesting/
├── data/                           # Historical data files
│   ├── teams_2024.csv             # 2024 team statistics
│   ├── goalies_2024.csv           # 2024 goalie statistics
│   └── games_2024.csv             # 2024 game results
├── results/                        # Generated reports
│   ├── backtest_report_with_goalie.md
│   └── backtest_report_without_goalie.md
├── runBacktest.js                 # Execution script
└── README.md                       # This file
```

## Running the Backtest

### Prerequisites

1. Node.js installed
2. Dependencies installed (`npm install`)
3. Data files in `backtesting/data/`

### Execute

```bash
# From the nhl-savant directory
node backtesting/runBacktest.js
```

### What It Does

1. Loads 2024 team, goalie, and game data
2. Runs model predictions for ALL 1,300+ games
3. Compares predictions to actual results
4. Calculates comprehensive metrics:
   - Brier Score (win probability calibration)
   - RMSE (total goals prediction error)
   - Calibration curves
   - Accuracy by team
   - Accuracy by month
5. Tests model WITH and WITHOUT goalie adjustment
6. Generates detailed markdown reports

### Output

Two comprehensive reports are generated:

1. **`backtest_report_with_goalie.md`**
   - Model performance with goalie integration
   - Our current production model

2. **`backtest_report_without_goalie.md`**
   - Model performance without goalie adjustment
   - Proves value of goalie integration

Each report includes:
- Executive summary
- Win probability metrics (Brier score, calibration curve)
- Total goals metrics (RMSE, MAE, error distribution)
- Performance by team and month
- Comparison to baseline models
- Final verdict: Ready for real money? YES/NO
- Specific recommendations for improvement

## Success Criteria

**Model is READY for real money if:**
- ✅ Brier Score < 0.23
- ✅ RMSE < 1.8 goals
- ✅ Calibration error < 2% per bin
- ✅ Beats baseline by >10%
- ✅ Goalie integration shows measurable improvement

**Model NEEDS WORK if:**
- ❌ Brier Score > 0.25
- ❌ RMSE > 2.0 goals
- ❌ Calibration is systematically off
- ❌ Doesn't beat simple baseline

## Understanding the Metrics

### Brier Score
- Measures win probability calibration
- **Range:** 0.0 (perfect) to 1.0 (worst)
- **Baseline:** 0.25 (random guessing)
- **Good:** < 0.20
- **Excellent:** < 0.15

### RMSE (Root Mean Square Error)
- Measures total goals prediction accuracy
- **Unit:** Goals per game
- **NHL average total:** ~6.0 goals
- **Target:** < 1.8 goals
- **Baseline (always predict 6.0):** ~2.5 goals

### Calibration Curve
- Checks if 60% predictions actually win 60% of the time
- **Good:** All bins within ±2% of predicted
- **Problematic:** Systematic over/under confidence

## Limitations

### What We CAN Test:
✅ Prediction accuracy  
✅ Calibration quality  
✅ Model performance trends  
✅ Goalie impact  

### What We CANNOT Test (missing data):
❌ Betting profitability (no market odds)  
❌ EV realization (no closing lines)  
❌ ROI calculation  
❌ Starting goalie impact (using team averages)  

To test profitability, we would need:
- Historical moneyline odds
- Historical total lines + over/under odds
- Starting goalie data for each game

## Next Steps After Backtesting

### If Model PASSES:
1. Monitor performance on current season
2. Collect market odds for profitability testing
3. Paper trade to validate in real-world
4. Implement confidence filters
5. Consider deploying with real money (small stakes)

### If Model FAILS:
1. Analyze calibration issues
2. Tune parameters (k value, std dev, etc.)
3. Investigate worst-performing teams
4. Add missing factors (injuries, recent form, etc.)
5. Re-backtest after improvements

## Files

### Data Files

**teams_2024.csv**
- 2024 NHL team statistics
- Same format as current `teams.csv`
- All advanced metrics (score-adjusted xG, etc.)

**goalies_2024.csv**
- 2024 NHL goalie statistics
- Same format as current `goalies.csv`
- Includes GSAE, save%, high-danger stats

**games_2024.csv**
- 1,314 NHL games from 2024 season
- Columns: Date, Visitor, Score, Home, Score, Status
- Complete regular season results

### Code Files

**runBacktest.js**
- Main execution script
- Loads data, runs backtest, generates reports
- ~400 lines of orchestration code

**../src/utils/backtester.js**
- Core backtesting engine
- Prediction loop, metric calculations
- ~600 lines of analysis code

**../src/utils/teamNameMapper.js**
- Maps full team names to abbreviations
- Required because game results use full names
- Model uses 3-letter codes

## Expected Runtime

- **Data loading:** 5-10 seconds
- **Prediction loop:** 30-60 seconds (1,300+ games)
- **Metric calculation:** 5-10 seconds
- **Report generation:** 1-2 seconds
- **Total:** ~1-2 minutes for both runs

## Troubleshooting

### Common Issues:

**"Cannot find module"**
- Run `npm install` from nhl-savant directory
- Ensure you're running from correct directory

**"Unknown team: X"**
- Check teamNameMapper.js has all 32 teams
- Verify game CSV uses correct team names

**"Error processing game"**
- Check CSV format matches expected structure
- Ensure Score columns are properly parsed

**NaN or undefined values**
- Check data files have complete information
- Verify CSV headers match expected names

## Support

If backtesting fails or produces unexpected results:
1. Check console output for specific errors
2. Verify data files are complete and valid
3. Review first few errors for patterns
4. Check that 2024 team codes match current season

---

**Last Updated:** October 21, 2025  
**Model Version:** Phase 1-3 (with goalie integration)

