# Sharp Flow — Whale Intel & Sharp Tracker System

## Part 1: How It Works (For Bettors)

### What is Sharp Flow?

Sharp Flow is a real-time intelligence system that tracks what the **sharpest sports bettors on the planet** are actually betting on — then cross-references that with sportsbook pricing to find **positive expected value (+EV) opportunities** you can act on.

Unlike tout services that sell picks based on opinions, Sharp Flow is built on **blockchain-verified betting data**. Every bet placed on Polymarket is publicly recorded on-chain. We identify the wallets with the best lifetime track records, monitor their positions, and surface the plays they're making on today's games.

### The Data Pipeline — Where Signals Come From

**1. Finding the Sharps**

We scan the top 1,500 entries on the Polymarket sports leaderboard, profile every wallet's positions, and **rank them purely by sport P&L** — the sum of profit/loss across all sports markets (NHL, CBB, NBA, NFL, MLB). We take the **top 250 wallets with $5K+ sport P&L**. These are the most profitable *sports* bettors on the platform, not just high-volume generalists. Sharp Flow currently tracks **four sports**: NHL, CBB, MLB, and NBA.

This list is rebuilt twice a day by a dedicated `seedSportsSharps.js` pipeline and stored in `sports_sharps.json`. Because qualification is based solely on verified sport profit, there is no need for market-maker scoring or tier-based filtering — every wallet in the file is pre-qualified.

**Legacy tiers** (still used as a fallback if `sports_sharps.json` is unavailable):

| Tier | Criteria | What It Means |
|------|----------|---------------|
| **ELITE** | $100K+ lifetime profit, 50+ markets | Best of the best — consistently profitable across hundreds of bets |
| **PROVEN** | $25K+ lifetime profit, 20+ markets | Strong track record with meaningful sample size |
| **ACTIVE** | $5K+ lifetime profit, 10+ markets | Profitable but smaller sample |
| **DEGEN** | -$50K or worse lifetime | Large losing wallet — we fade (bet against) these |
| **LOSING** | -$10K or worse lifetime | Losing wallet — also faded |

**2. Tracking Their Bets**

Every 15 minutes, we scan what positions these sharp wallets hold on today's games. We're not just looking at new trades — we see **all open positions**, including bets placed days ago. This gives us a complete picture of where the smart money sits.

**3. Cross-Referencing with Sportsbook Odds**

Simultaneously, we pull real-time odds from 5 books:
- **Pinnacle** — the sharpest book in the world (our "fair value" benchmark)
- **DraftKings, FanDuel, BetMGM, Caesars** — retail books where you actually bet

When the best retail price beats Pinnacle's implied probability, that's a **+EV edge**. When sharps are also positioned on that side, the signal strengthens.

**4. Prediction Market Price Movement**

We track the Polymarket moneyline price over 24 hours. If the price is moving in the same direction as the sharp consensus, that's additional confirmation. If it's moving against, it's a caution flag.

### How Plays Get Rated & Locked In

Every game with sharp positions is scored using a **weighted star rating system (V6)** that evaluates multiple signal dimensions on a 15-point scale: sharp wallet breadth, conviction (avg bet size), EV edge, conditional Pinnacle alignment, consensus strength, prediction market direction, sport-specific adjustments, implied probability, and sport-specialist verification.

The points are converted to a 0.5–5.0 star rating. **Plays are LOCKED IN when they meet BOTH a star threshold AND a minimum invested threshold:**

| Market | Star Threshold | Min Invested | Min Wallets |
|--------|---------------|-------------|-------------|
| **Moneyline** | ≥ 2.5 stars | **$7,000** | — |
| **Spread** | ≥ 2.5 stars | **$5,000** | **2 wallets** |
| **Total (O/U)** | ≥ 2.5 stars | **$5,000** | **2 wallets** |

**No bet is EVER written to Firebase unless these minimums are met.** This is enforced at the lock-decision level in `SharpFlow.jsx`.

The star rating is the **single source of truth** — there are no separate gates or overrides beyond the invested minimums. Penalties for contested consensus, concentration, Pinnacle opposition, dog odds, and flips are baked directly into the point score.

#### V6 Key Changes (2026-04-11)

1. **Breadth ceiling trimmed** — max 2.5pts (was 3). Mid-range bumped. Prevents crowded boards from auto-inflating stars.
2. **Conviction bumped** — max 2.5pts (was 1.5). Added extra tier. "Fewer, stronger wallets" is the #1 independent predictive signal.
3. **Pinnacle made conditional** — full bonus only on borderline (LEAN/CONTESTED) plays, halved on STRONG/DOMINANT. Deep audit showed "No Pinn" outperformed "Pinn confirms" at every breadth level.
4. **Sport-specific bonuses** — MLB gets broader consensus bonus (5-7+ wallets), NHL/CBB get specialist-group bonus (sport-verified sharps in tight groups).
5. **Minimum invested thresholds enforced** — ML requires $7K, Spread/Total requires $5K + 2 wallets. No low-conviction noise gets tracked.

### Unit Sizing

Units are derived directly from the star rating:

**ML Unit Sizing:**

| Star Rating | Base Units | Tier |
|-------------|-----------|------|
| ★★★★★ (5.0) | 3.5u | MAX |
| ★★★★½ (4.5) | 3.0u | MAX |
| ★★★★ (4.0) | 2.5u | STRONG |
| ★★★½ (3.5) | 2.0u | STRONG |
| ★★★ (3.0) | 1.5u | STANDARD |
| ★★½ (2.5) | 1.0u | STANDARD |

Dog caps (ML): +200 → max 0.5u, +151 → max 1.0u, +100 → max 2.0u.

**Spread/Total Unit Sizing:**

| Star Rating | Base Units |
|-------------|-----------|
| ★★★★★ (5.0) | 2.0u |
| ★★★★½ (4.5) | 1.75u |
| ★★★★ (4.0) | 1.5u |
| ★★★½ (3.5) | 1.25u |
| ★★★ (3.0) | 1.0u |
| ★★½ (2.5) | 0.5u |

Dog caps (Spread/Total): +200 → max 0.5u, +151 → max 0.75u, +100 → max 1.0u.

A consensus penalty (−0.5u for LEAN, −1.0u for CONTESTED) is applied after the base. Final ML units are capped between 0.5u and 5.0u. Spread/Total units are capped between 0.5u and 2.0u.

### Performance Tracking

Every locked play is recorded with its odds, book, unit size, star rating, and criteria at time of lock. After games finish, results are automatically graded and profit/loss tracked. Performance is broken down by star tier (5★, 4★, 3★, 2★) to validate whether higher-conviction plays outperform.

---

## Part 2: Technical Reference (For Developers)

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    DATA COLLECTION                            │
│                                                              │
│  Polymarket API ──→ polymarket_data.json  (every 15 min)    │
│  Kalshi API ──────→ kalshi_data.json      (every 15 min)    │
│  Odds API ────────→ pinnacle_history.json (every 15 min)    │
│  Polymarket ──────→ sports_sharps.json    (2x daily)        │
│  Polymarket ──────→ whale_profiles.json   (legacy, 4x/day) │
│  Scan step  ──────→ sharp_positions.json  (every 15 min)    │
│                                                              │
│  Sports: NHL, CBB, MLB, NBA                                 │
│                                                              │
│  scanSharpPositions merges whale_profiles.json (base)        │
│  + sports_sharps.json (supplementary sport-profitable).     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                    UI (SharpFlow.jsx)                         │
│                                                              │
│  Reads all 5 JSON files from public/                        │
│  Scores signals, applies criteria, renders cards            │
│  Writes locked picks to Firebase (sharpFlowPicks)           │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                    GRADING (Firebase Functions)               │
│                                                              │
│  updateBetResults ──→ Grades bets + sharpFlowPicks          │
│  Runs every 10 min, uses live_scores/current                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### GitHub Actions Workflows

| Workflow | Schedule | Script(s) | Data Written | Deploys UI? |
|----------|----------|-----------|--------------|-------------|
| **fetch-polymarket.yml** | Every 15 min | `fetchPolymarketData.js`, `fetchKalshiData.js`, `snapshotPinnacle.js`, `scanSharpPositions.js`, `auditMarketData.js` | `polymarket_data.json`, `kalshi_data.json`, `pinnacle_history.json`, `sharp_positions.json` | **YES** — builds & deploys to gh-pages |
| **seed-sports-sharps.yml** | 10 AM & 10 PM ET | `seedSportsSharps.js` | `sports_sharps.json` | No |
| **build-whale-profiles.yml** | 8 AM, 12 PM, 4 PM, 8 PM ET | `buildWhaleProfiles.js` | `whale_profiles.json` | No |
| **seed-whale-leaderboard.yml** | Every 3 hrs (:30) | `buildWhaleProfiles.js --seed` | `whale_profiles.json` | No |
| **scan-sharp-positions.yml** | Every 2 hrs (:15) | `scanSharpPositions.js` | `sharp_positions.json` | No |

**Critical Note**: The `fetch-polymarket.yml` workflow is the **only workflow that deploys the UI**. Any code changes to `src/` MUST be pushed to `main` before this workflow runs, or the deployment will overwrite local deploys with stale code.

### Scripts Reference

#### `scripts/fetchPolymarketData.js`
- **APIs**: Gamma API (events), Data API (trades, volume, positions), CLOB (price history), Odds API (CBB + MLB + NBA schedule)
- **Sports**: NHL (from `odds_money.md`), CBB (from Odds API `basketball_ncaab`), MLB (from Odds API `baseball_mlb`), NBA (from Odds API `basketball_nba`)
- **ML Market Selection**: Filters out markets where `groupItemTitle` contains "o/u"/"spread" or outcomes include "Over"/"Under". First remaining market = moneyline.
- **Price History**: Fetches 24h candles from CLOB for token[0] of the ML market, samples ~12 points for sparkline. Flips if token[0] is not the away team.
- **Series collision guard**: Each Polymarket event has an `endDate` field that is the game start time. When multiple Polymarket events share the same game key (e.g., back-to-back MLB series), the script compares each event's `endDate` (ET calendar day) against the Odds API `commence_time` for that game key. Only the event whose date matches today's game is accepted. If a wrong-day event was already enriched and a correct-day event appears later, it replaces it.
- **Output**: `public/polymarket_data.json` keyed by sport → game_key (e.g., `NHL.bos_njd`, `MLB.nyy_bos`). Each entry includes `commence` (Odds API time, falling back to Polymarket `endDate`) and `polyGameTime` (Polymarket's native game start time).

#### `scripts/seedSportsSharps.js`
- **Purpose**: Builds the definitive list of top 250 most profitable sports bettors
- **Sources**: Polymarket leaderboard API (`/v1/leaderboard?category=SPORTS`), depth 1,500 entries
- **Per wallet**: Fetches `/positions` (P&L by sport) and `/traded` (market count)
- **Ranking**: Sorts all wallets by `sportPnlTotal` (sum of all sport P&L), takes top 250 above $5K
- **No MM scoring**: Wallets are qualified purely by sport profit — no tier/mmScore logic
- **Incremental**: Only re-profiles wallets whose `builtAt` is older than 48 hours
- **Ready flag**: Output includes `_meta.ready` — `scanSharpPositions.js` only uses the file when `ready: true` and `walletCount >= 50`
- **Output**: `public/sports_sharps.json` — `{ _meta: {...}, [walletAddress]: { totalPnl, sportPnl, sportPnlTotal, sportMarkets, marketsTraded, ... } }`

#### `scripts/buildWhaleProfiles.js` (legacy, unchanged)
- **Sources**: Polymarket leaderboard API (`/v1/leaderboard?category=SPORTS`) + whale trades from `polymarket_data.json`
- **Per wallet**: Fetches `/positions` (P&L) and `/traded` (market count)
- **Tier assignment**: `tierFromStats(totalPnl, marketsTraded)` — see Part 1 table
- **Rate limiting**: 1.5s delay between API calls (1s in seed mode), max 40 wallets/run (50 in seed)
- **Output**: `public/whale_profiles.json` — `{ [walletAddress]: { totalPnl, sportPnl, marketsTraded, tier, lastSeen, pnlHistory } }`
- **Note**: This pipeline is kept running as a fallback. `scanSharpPositions.js` uses `whale_profiles.json` only if `sports_sharps.json` is missing or not ready.

#### `scripts/scanSharpPositions.js`
- **Additive merge**: Loads `whale_profiles.json` as the base (tier/mmScore filtering), then merges in any additional wallets from `sports_sharps.json` that aren't already in the base list
- **Base wallets**: ELITE + PROVEN + ACTIVE wallets from `whale_profiles.json`, excluding mmScore > 40 and sport PnL < -$100K
- **Supplementary wallets**: All wallets from `sports_sharps.json` not already in the base list — pre-qualified by sport PnL, no tier/mmScore filtering needed
- **API**: Polymarket `/positions?user={wallet}` for each wallet
- **Filters out**: Resolved positions (curPrice ≤ 0.01 or ≥ 0.99), totals (Over/Under outcomes)
- **Matches**: Position titles to today's games using team name mapping
- **Output**: `public/sharp_positions.json` — per-game breakdown with `summary` (consensus, invested per side) and `positions` array

#### `scripts/snapshotPinnacle.js`
- **API**: The Odds API — `icehockey_nhl`, `basketball_ncaab`, `baseball_mlb`, and `basketball_nba` with bookmakers `pinnacle,draftkings,fanduel,betmgm,caesars`
- **Tracks**: Opener, current, history (timestamped array), movement direction, best retail price per side, EV calculation
- **Series collision guard**: Stores the Odds API unique `game.id` as `apiId` per game key. When a new game arrives for an existing key but with a different `apiId` (different game in a series), compares `commence_time` distances to `Date.now()`. Keeps whichever game is closer; if swapping, resets `opener`/`history`/`movement` so the new game starts fresh.
- **Output**: `public/pinnacle_history.json` keyed by sport → game_key. Each entry includes `commence` (ISO game time) and `apiId` (Odds API UUID).

### Firebase Collections

| Collection | Purpose | Written By | Read By |
|-----------|---------|-----------|---------|
| **sharpFlowPicks** | Locked ML plays with unit size, odds, criteria | SharpFlow.jsx (client) | SharpFlow.jsx (client), updateBetResults (function) |
| **sharpFlowSpreads** | Locked spread plays | SharpFlow.jsx (client) | SharpFlow.jsx (client), updateBetResults (function) |
| **sharpFlowTotals** | Locked total (O/U) plays | SharpFlow.jsx (client) | SharpFlow.jsx (client), updateBetResults (function) |
| **mlb_bets** | MLB model picks (separate from Sharp Flow) | fetchMLBPicks.js | MLB.jsx (client), updateBetResults (function) |
| **bets** | NHL model bets | betTracker.js (client) | updateBetResults (function) |
| **live_scores** | NHL game scores | liveScores function | updateBetResults (function) |

**CRITICAL: Lock thresholds are enforced BEFORE any Firebase write:**
- ML (`sharpFlowPicks`): stars ≥ 2.5 AND consensusInvested ≥ $7,000
- Spread (`sharpFlowSpreads`): stars ≥ 2.5 AND conWalletCount ≥ 2 AND conTotalInvested ≥ $5,000
- Total (`sharpFlowTotals`): stars ≥ 2.5 AND conWalletCount ≥ 2 AND conTotalInvested ≥ $5,000

#### `sharpFlowPicks` Document Schema (v3 — lock + peak + pregame snapshots)

Each document represents one game. Up to two sides can independently lock if both reach 3+ stars. Each side tracks three snapshots: **lock** (first trigger), **peak** (highest stars), and **pregame** (~30 min before game). Grading uses peak units/odds.

**Three Snapshots Per Side:**
- **`lock`** — frozen at first trigger (stars ≥ 2.5). Never updated.
- **`peak`** — high-water mark. Updated when stars or units climb higher.
- **`pregame`** — final state captured 30-35 min before game start. Includes full opposition data. Written once.

This enables **lock → peak → pregame** transformation analysis: did sharps pile on? Did opposition appear? Did EV evaporate?

```javascript
{
  date: "2026-03-24",           // ET date (derived from commence time)
  sport: "NHL",                  // NHL | CBB | MLB | NBA
  gameKey: "tor_bos",
  away: "Maple Leafs",
  home: "Bruins",
  commenceTime: 1711300000000,  // epoch ms
  lockType: "PREGAME",          // always PREGAME (live games are skipped)
  status: "PENDING",            // PENDING → COMPLETED (when all sides graded)

  sides: {
    home: {                     // one entry per side that reached 3+ stars
      team: "Bruins",
      lock: {                   // original lock snapshot (never changes)
        odds: -190,
        book: "BetMGM",
        pinnacleOdds: -194,
        evEdge: 5.0,
        criteriaMet: 6,
        criteria: { sharps3Plus: true, plusEV: true, ... },
        sharpCount: 6,
        totalInvested: 9824,
        units: 3.5,
        unitTier: "MAX",
        lockedAt: 1711300000000,
        opposition: {           // opposition at lock time (added 2026-04-04)
          sharpCount: 2,
          totalInvested: 3500,
          avgBet: 1750,
          stars: 1.5,
          counterSharpScore: 1,
          consensusTier: "LEAN",
        },
      },
      peak: {                   // high-water mark (updated pregame when units grow)
        odds: -210,
        book: "BetMGM",
        criteriaMet: 6,
        sharpCount: 9,
        totalInvested: 15200,
        units: 4.0,
        unitTier: "MAX",
        updatedAt: 1711305000000,
        opposition: { ... },    // opposition at peak time
      },
      pregame: {                // final snapshot ~30 min before game (added 2026-04-04)
        odds: -215,
        book: "BetMGM",
        pinnacleOdds: -210,
        evEdge: 2.1,
        criteriaMet: 6,
        criteria: { ... },
        sharpCount: 11,
        totalInvested: 22000,
        units: 4.0,
        stars: 4.0,
        consensusStrength: { moneyPct: 78, walletPct: 85, grade: "DOMINANT" },
        opposition: {           // opposition 30 min before game
          sharpCount: 4,
          totalInvested: 8500,
          avgBet: 2125,
          stars: 2.0,
          counterSharpScore: 3,
        },
        minutesBeforeGame: 32,
        capturedAt: 1711310000000,
      },
      status: "PENDING",        // PENDING → COMPLETED
      result: {
        outcome: null,          // WIN / LOSS / PUSH
        profit: null,           // graded at peak.units and peak.odds
        gradedAt: null,
      },
    },
    away: {                     // only present if away side also hit 3+ stars
      team: "Maple Leafs",
      lock: { ... },
      peak: { ... },
      pregame: { ... },         // may or may not exist
      status: "PENDING",
      result: { ... },
    },
  },

  result: {                     // game-level scores (shared)
    awayScore: null,
    homeScore: null,
    winner: null,               // "away" or "home"
  },
}
```

**Legacy format** (pre-v2 docs): Flat structure with `consensusSide`, `units`, `odds` at top level. The grading function and P&L loader handle both formats — if `doc.sides` exists, use v2 logic; otherwise fall back to flat format.

### Grading (Firebase Function: `updateBetResults`)

Located in `functions/src/betTracking.js`. Runs every 10 minutes.

1. Reads `live_scores/current` for FINAL games
2. Grades regular `bets` collection (existing system)
3. **Then grades `sharpFlowPicks`**:
   - Queries `status == "PENDING"` for all sports (NHL, CBB, MLB, NBA)
   - Maps `gameKey` (e.g., `uta_dal`) to NHL abbreviations (`UTA`, `DAL`) via `ABBREV_MAP`
   - Matches against final games by `awayTeam`/`homeTeam`
   - **v2 format** (`doc.sides` exists): iterates each side, grades using `side.peak.units` and `side.peak.odds`, marks each side's `status: "COMPLETED"`. Top-level `status` becomes `"COMPLETED"` when all sides are graded.
   - **Legacy format** (flat `consensusSide`): grades as before with top-level `units` and `odds`
   - Uses same `calculateOutcome` and `calculateProfit` functions as the main bet tracker

### Firestore Indexes Required

```json
[
  { "collection": "sharpFlowPicks", "fields": ["date ASC", "lockedAt DESC"] },
  { "collection": "sharpFlowPicks", "fields": ["status ASC", "lockedAt DESC"] }
]
```

Defined in `firestore.indexes.json`.

### UI Component: `SharpFlow.jsx`

**Key Functions**:
- `useMarketData()` — loads all 5 JSON files
- `computeSharpFeatures()` — decomposes positions into breadth, conviction, concentration, counterSharp, consensus tier (net-position approach for hedgers)
- `rateStars()` — V6 multi-signal scoring on 15-pt scale → 0.5–5.0 star rating (ML picks, includes RLM + flip penalty)
- `rateSpreadTotalStars()` — V6 scoring for spread/total picks (same weights, no RLM/flip)
- `calculateUnits()` — maps ML star rating to unit size with consensus penalty + dog caps
- `calculateSpreadTotalUnits()` — maps spread/total star rating to unit size with dog caps
- `SharpPositionCard` — main card component (React.memo) with both-sides battle, sparklines, criteria checklist, unit sizing. Handles ML, Spread, and Total tabs.
- `syncLockedPicks()` — auto-evaluates criteria, writes qualifying picks to Firebase (`sharpFlowPicks`, `sharpFlowSpreads`, or `sharpFlowTotals`)
- `loadAllTimePnL()` — queries completed picks from all three collections for running record

**Lock Decision Flow** (no bet is written without meeting ALL requirements):
1. `sharp_positions.json` → per-side wallet counts, invested amounts
2. `pinnacle_history.json` → book prices, line movement, EV edge
3. `computeSharpFeatures()` → breadth, conviction, concentration, counterSharp
4. `rateStars()` / `rateSpreadTotalStars()` → star rating
5. **Threshold check**: stars ≥ 2.5 AND invested ≥ minimum ($7K ML / $5K spread+total)
6. Only if ALL conditions met → Firebase write → unit sizing → locked card display

### Deployment Rules

**The only workflow that deploys the UI is `fetch-polymarket.yml`** (every 15 min).

**CRITICAL RULE**: Any changes to files in `src/` MUST be committed and pushed to `main` before the next workflow run. If you deploy locally with `npm run deploy` without pushing to `main`, the next scheduled run will **OVERWRITE your changes** with stale code from the last commit on `main`.

**Safe workflow** (ALWAYS follow this sequence):
1. Make code changes
2. `git add . && git commit -m "..." && git push` (push to main FIRST)
3. `npm run deploy` (immediate deploy so changes go live right away)
4. The workflow will also deploy within 15 min, but since `main` has your changes, it will deploy the same code.

**What happens if you skip step 2**: The workflow runs `npm run build` from whatever is on `main`. If your local changes aren't pushed, the workflow builds old code and deploys it to `gh-pages`, wiping out your local deploy. This has caused issues multiple times — **NEVER skip the push to main.**

### Merge Conflict Handling

Multiple workflows write to `public/` JSON files. To prevent failures from concurrent writes, all commit steps use:

```bash
git pull --rebase -X theirs || (git add -A && git rebase --continue)
```

This accepts the remote version on conflict (safe because each workflow regenerates its own data fresh).

---

## Part 3: Known Risks & Future Work

### Data Retention — Current Safeguards

| Data Source | Retention Mechanism | Growth Risk |
|------------|---------------------|-------------|
| `pinnacle_history.json` | 24 snapshots/game max, 36-hour stale purge | **None** — self-cleaning |
| `polymarket_data.json` | Rewritten from scratch each run (today's games only) | **None** — self-cleaning |
| `sharp_positions.json` | Rewritten from scratch each run (today's games only) | **None** — self-cleaning |
| `sports_sharps.json` | 250 wallet cap, 48-hour incremental refresh | **None** — bounded |
| `whale_profiles.json` | 1000 profile cap, 30-day stale pruning, 30-entry pnlHistory cap | **None** — bounded |
| Firebase `sharpFlowPicks` | No cleanup — documents accumulate indefinitely | **Low** — ~500 docs/season |
| Git commit history | ~96 auto-commits/day from data file updates across workflows | **Medium** — repo clone size grows over months |

### TODO: Long-Term Git Repository Size Plan

The automated workflows commit updated JSON data files to `main` approximately every 15 minutes (plus additional commits from sharp position scans, whale profile builds, etc.). While git handles this without performance issues short-term, the `.git` directory will grow significantly over weeks and months as every version of every data file is stored in history.

**Options to evaluate:**

1. **Periodic history squashing** — Squash auto-commit history for data files on a schedule (e.g., monthly). Keeps the repo lean but requires force-push to main.
2. **Move data files out of git** — Store JSON data files in an external location (e.g., a cloud storage bucket, Firebase Storage, or a CDN) and fetch them at build time instead of committing to the repo. Eliminates the commit bloat entirely but adds infrastructure.
3. **Git LFS for data files** — Track the JSON data files with Git Large File Storage. Reduces clone size but adds LFS hosting costs.
4. **Shallow clone in workflows** — Use `fetch-depth: 1` in all GitHub Actions checkouts (may already be in place). Doesn't fix the underlying growth but keeps workflow run times fast.
5. **Firebase cleanup function** — Add a scheduled Cloud Function that archives or deletes `sharpFlowPicks` documents older than 90 days, preserving aggregated P&L stats but pruning raw pick data.

**Priority**: Medium. Not urgent for the first few weeks of operation, but should be addressed before the end of a full season (~6 months) to prevent the repo from becoming unwieldy for fresh clones.
