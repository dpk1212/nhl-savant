# Realistic Next Win: B2B/Rest Adjustments

**Current Status:** 3 critical fixes ✅ implemented
**Next Priority:** B2B detection using 2025 schedule

---

## HONEST ASSESSMENT

**What I was wrong about:**
- ❌ Recency weighting NOT feasible (no game-by-game xG data)
- ✅ B2B/rest IS feasible (schedule dates available)

**Why:**
- `nhl-202526-asplayed.csv` has dates but only scores
- `teams.csv` has season stats only (not game-by-game xG)
- Recency weighting needs recent form (xG per game), not just dates

---

## What CAN Work: B2B Detection

You have everything needed in `/nhl-202526-asplayed.csv`:

```
Date,Start Time (Sask),Start Time (ET),Visitor,Score,Home,Score,Status,...
10/7/2025,3:00 PM,5:00 PM,Chicago Blackhawks,2,Florida Panthers,3,...
10/8/2025,5:00 PM,7:00 PM,Montreal Canadiens,2,Toronto Maple Leafs,5,...
```

**Simple logic:**
1. Parse schedule by team
2. For any upcoming game, find team's last game date
3. Calculate days since last game
4. If days = 1 → B2B, apply -3% goals
5. If days >= 3 → extra rest, apply +4% goals

---

## Why This Actually Works

**B2B teams score measurably less:**
- Fatigue is real
- Travel is real
- Proven statistical effect

**Expected impact:**
- October has many B2B games
- Current Oct RMSE = 2.696 (after fixes)
- B2B adjustment should drop it to 2.65-2.68
- +0.01-0.05 RMSE improvement

**Data already in project:**
- Schedule: `/nhl-202526-asplayed.csv` ✓
- No external APIs needed ✓

---

## Implementation (2 hours)

1. Create `scheduleHelper.js` - parse schedule, track days rest
2. Load schedule in App.jsx
3. Wire into predictTeamScore()
4. Test on backtest

Total: 2-3 hours, LOW RISK

---

## Bottom Line

Your model works better now (RMSE 2.380). B2B adjustment is the next real win because:
- ✅ Data is available
- ✅ Effect is proven
- ✅ Implementation is straightforward
- ❌ Unlike recency weighting (needs data we don't have)

Ready when you are.

