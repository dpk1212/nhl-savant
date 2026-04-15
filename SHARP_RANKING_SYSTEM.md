# Sharp Ranking System — Implementation Plan

## Current State

### What We Can Rank By Today (No New API Calls)

All 500 wallets in `sports_sharps.json` have:

| Field | Description | Available |
|-------|-------------|-----------|
| `sportPnlTotal` | All-time sport P&L (from SPORTS leaderboard) | 500/500 |
| `sportROI` | `(pnl / vol) * 100` from SPORTS leaderboard | 500/500 |
| `sportBets` | Keyword-matched sport position count | 500/500 |
| `avgSportBet` | Position-derived avg bet size | 500/500 |
| `vol` | Total sports volume from leaderboard | 500/500 |
| `sportRecord` | `{ won, lost }` from closed positions | 291/500 |
| `sportWinRate` | `won / (won + lost) * 100` | 291/500 |
| `perSport` | Per-sport breakdown (bets, invested, pnl, W/L, ROI, avgBet) | 291/500 |
| `overallPnl` | Cross-category P&L from OVERALL leaderboard | Pending next run |

### What We Need for Time-Period Rankings

Add bulk leaderboard fetches in `seedSportsSharps.js`:

```javascript
// Already fetching:
fetchLeaderboard('ALL', 1500, 'SPORTS')    // all-time sport P&L + vol
fetchLeaderboard('MONTH', 1000, 'SPORTS')  // monthly hot detection
fetchLeaderboard('ALL', 1500, 'OVERALL')   // overall P&L cross-ref

// Add for rankings:
fetchLeaderboard('WEEK', 1500, 'SPORTS')   // weekly sport P&L + vol
fetchLeaderboard('DAY', 1500, 'SPORTS')    // daily sport P&L + vol
```

Cross-reference each against our 500 wallets. Store per wallet:

```javascript
weeklyPnl, weeklyVol, weeklyROI   // trending this week
dailyPnl, dailyVol, dailyROI      // today's performance
monthlyPnl, monthlyVol             // already partially stored for hot detection
leaderboardRank                    // actual rank from API response
```

**Cost:** ~60 extra API pages (1500 entries / 50 per page × 2 new periods). With 500ms delay, adds ~30 seconds to script runtime.

### W/L Record Gap

291 out of 500 wallets have `sportRecord` and `perSport` from a previous version of `buildProfile()`. The current version doesn't compute these — they're carried forward from stale-protected wallets. Fix: restore W/L computation in `buildProfile()` using closed positions.

For each closed position:
- `curPrice >= 0.95` → won (market resolved to ~1.0 for their side)
- `curPrice <= 0.05` → lost (market resolved to ~0.0 for their side)
- Otherwise → still settling or partially resolved

### Ranking Views to Build

1. **All-Time Leaderboard**: Rank by `sportPnlTotal` (already possible)
2. **Best ROI**: Rank by `sportROI` with min bet count filter (e.g., 20+ bets)
3. **Hot This Week**: Rank by `weeklyPnl` (needs WEEK leaderboard fetch)
4. **Hot Today**: Rank by `dailyPnl` (needs DAY leaderboard fetch)
5. **Best Win Rate**: Rank by `sportWinRate` with min bet count filter
6. **Sport-Specific**: Rank by `perSport[sport].pnl` — best NHL bettor, best NBA bettor, etc.
7. **Biggest Bettors**: Rank by `avgSportBet` — who risks the most per play

### How the 548 "Sharp Bettors" Number is Computed

Two sources merged in `SharpFlow.jsx`:

**Source 1 — whale_profiles.json (base):**
- Start with 986 ELITE + PROVEN wallets
- Remove 381 market makers (`mmScore > 40`)
- Remove 319 non-sport wallets (sport P&L <= 0 and not monthly-hot)
- = ~286 clean base wallets

**Source 2 — sports_sharps.json (supplemental):**
- Wallets NOT already in the clean base set
- Must have `sportPnlTotal > 0` OR `monthlyQualified`
- = ~262 supplemental wallets

**Total: ~286 + ~262 = 548**

The "700 non-sharp filtered" = 381 MMs + 319 non-sport.
