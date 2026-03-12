# NHL Claude API Integration — Data Exploration

**Goal:** Identify what data we have and how it could be sent to Claude API to improve bet selection, sizing, or veto decisions.

---

## 1. Current NHL Data Sources

### Firebase (`bets` collection)
NHL bets live in `bets` (not `basketball_bets`). Document shape:

| Field | Description |
|-------|-------------|
| `game.awayTeam`, `game.homeTeam` | Matchup |
| `game.gameTime`, `game.actualStartTime` | Schedule |
| `bet.market` | MONEYLINE (totals removed) |
| `bet.pick`, `bet.team`, `bet.odds`, `bet.side` | Pick details |
| `prediction.modelProb`, `marketProb`, `evPercent` | Model vs market |
| `prediction.ensembleProb`, `agreement`, `confidence` | Ensemble metrics |
| `prediction.qualityGrade`, `rating` | A+ / A / B+ |
| `prediction.dynamicUnits`, `dynamicTier`, `dynamicScore` | NHL confidence weights |
| `prediction.whyBestValue` | Human-readable reason (e.g. "Special Teams: SEA has 53% edge") |
| `goalies.away`, `goalies.home` | Starting goalie names (when known) |
| `result.*` | Outcome after grading |

### Public / Static Data (fetched by `fetchData.js`)

| Source | Path | Contents |
|--------|------|----------|
| **MoneyPuck** | `moneypuck_predictions.json` | `awayProb`, `homeProb` per game (70% ensemble weight) |
| **DRatings** | `dratings_predictions.json` | NHL predictions (30% ensemble weight) |
| **Starting Goalies** | `starting_goalies.json` | Per-game `away.goalie`, `home.goalie`, `confirmed`, `source` |
| **Odds** | `odds_money.md` / parsed | Best ML odds per book |
| **Goalies CSV** | `goalieies.csv` | GSAE, xGoals, save%, danger zone stats per goalie |
| **Skaters CSV** | `skaters.csv` | Per-60 rates, xG, etc. |
| **Teams CSV** | `teams.csv` | Team-level xGF, xGA, PDO, regression |

### Dynamic Confidence Weights
`nhl_confidence_weights.json` — factor weights (rating, oddsRange, evRange, confidence, side, modelProb) derived from backtest of 549 bets. Used for `dynamicUnits` (0.5–1.5u).

### Schedule / Back-to-Back
`scheduleHelper` — rest days, back-to-back penalty, travel. Used in `dataProcessing.js` and edge calc.

---

## 2. What Claude Would Need (Per-Game Context)

To act as a **contextual veto layer** or **sizing advisor**, Claude would need:

### A. Game Context (Required)
```
- match: awayTeam @ homeTeam
- gameTime: ISO string
- market: MONEYLINE
- pick: team (e.g. SEA ML)
- odds: American (e.g. +122)
- modelProb, marketProb, evPercent
- qualityGrade, rating (A+/A/B+)
- dynamicUnits (current)
```

### B. Goalie Context (High Impact)
```
- awayGoalie: name, confirmed (bool)
- homeGoalie: name, confirmed (bool)
- awayGoalieGSAE: from goalies.csv (if available)
- homeGoalieGSAE: from goalies.csv (if available)
- note: "backup vs starter" if applicable
```

### C. Schedule Context (Medium Impact)
```
- awayRestDays, homeRestDays
- awayBackToBack, homeBackToBack
- awayTravel: e.g. "3rd game in 4 nights"
```

### D. Injury / Roster (If Available)
```
- awayInjuries: [list] — we don't have this yet
- homeInjuries: [list] — we don't have this yet
- note: Would need scraping or API
```

### E. Model Context (Optional)
```
- whyBestValue: e.g. "Special Teams: SEA has 53% edge"
- regressionScore: away vs home (if PDO regression)
- xGF/xGA differential: from teams.csv
```

### F. Historical Performance (Optional)
```
- lastN bets: similar grade/odds range
- win rate by segment (e.g. B+ moderate_dog)
```

---

## 3. Data We Have vs Don't Have

| Data | Have | Source | Notes |
|------|------|--------|-------|
| Game matchup | ✅ | Firebase / odds | |
| Odds, EV, grade | ✅ | EdgeCalculator | |
| Dynamic units | ✅ | nhlDynamicConfidence.js | |
| Starting goalies | ✅ | starting_goalies.json | Often "Unknown" |
| Goalie GSAE | ✅ | goalies.csv | Need to match by name |
| Rest / B2B | ✅ | scheduleHelper | |
| Team xGF/xGA | ✅ | teams.csv | |
| whyBestValue | ✅ | From edge calc | |
| Injuries | ❌ | — | Would need new source |
| Recent news | ❌ | — | Would need scraping |

---

## 4. Proposed Claude API Payload (Per Game)

```json
{
  "game": {
    "matchup": "SEA @ STL",
    "gameTime": "2026-02-26T19:00:00-05:00",
    "market": "MONEYLINE",
    "pick": "SEA",
    "odds": 122,
    "side": "AWAY"
  },
  "model": {
    "modelProb": 0.483,
    "marketProb": 0.45,
    "evPercent": 7.2,
    "grade": "A+",
    "rating": "A+",
    "dynamicUnits": 1.25,
    "whyBestValue": "Special Teams: SEA has 53% edge"
  },
  "goalies": {
    "away": { "name": "Joey Daccord", "confirmed": true, "gsae": 2.1 },
    "home": { "name": "Jordan Binnington", "confirmed": true, "gsae": -0.8 }
  },
  "schedule": {
    "awayRestDays": 1,
    "homeRestDays": 2,
    "awayBackToBack": false,
    "homeBackToBack": false
  },
  "teams": {
    "away": { "xGF_per60": 2.8, "xGA_per60": 2.5, "regressionScore": 1.2 },
    "home": { "xGF_per60": 2.6, "xGA_per60": 2.7, "regressionScore": -0.5 }
  }
}
```

---

## 5. Claude Response Schema (Structured Output)

```json
{
  "action": "BET" | "VETO" | "DOWNGRADE",
  "confidence": 0.0 - 1.0,
  "flags": ["backup_goalie_unconfirmed", "back_to_back_away", "..."],
  "suggestedUnits": 1.0,
  "reasoning": "Short explanation."
}
```

- **BET**: No red flags, proceed.
- **VETO**: Strong reason to skip (e.g. goalie TBD, major injury).
- **DOWNGRADE**: Bet is valid but reduce units (e.g. B2B fatigue).

---

## 6. Integration Points

| Where | When | Action |
|-------|------|--------|
| **BetTracker.saveBet()** | Before `setDoc` | Call Claude API with payload; if `action === "VETO"`, skip write |
| **TodaysGames.jsx** | When surfacing picks | Display Claude flags if present |
| **Fetch workflow** | After edge calc, before save | Batch Claude calls for all qualifying games |

---

## 7. Next Steps

1. **Build payload builder** — `scripts/buildClaudePayload.js` — assembles JSON from game + edge + goalies + schedule.
2. **Claude API client** — Use `@anthropic-ai/sdk` with structured output (or JSON mode).
3. **Goalies CSV lookup** — Match `starting_goalies.json` names to `goalies.csv` for GSAE.
4. **Optional: Injury scraping** — Add source if we want that context.
5. **A/B test** — Log Claude vetoes vs human review; measure if vetoes would have been correct.

---

## 8. Files to Modify / Create

| File | Purpose |
|------|---------|
| `scripts/buildClaudePayload.js` | Build per-game JSON from existing data |
| `scripts/claudeVetoService.js` | Call Claude API, return structured response |
| `src/firebase/betTracker.js` | Optional: call veto service before save |
| `src/firebase/betTracker.js` | Or: new workflow step that runs before BetTracker |

---

## 9. Cost / Latency Notes

- **Per-game call**: ~500–1000 tokens input, ~100 tokens output. ~$0.02–0.05 per game at Claude 3.5 rates.
- **~10 games/night**: ~$0.20–0.50/day.
- **Latency**: 1–3 seconds per call. Sequential = 10–30s for full slate. Parallel = ~3–5s.
