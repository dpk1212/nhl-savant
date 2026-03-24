# Sharp Flow — Whale Intel & Sharp Tracker System

## Part 1: How It Works (For Bettors)

### What is Sharp Flow?

Sharp Flow is a real-time intelligence system that tracks what the **sharpest sports bettors on the planet** are actually betting on — then cross-references that with sportsbook pricing to find **positive expected value (+EV) opportunities** you can act on.

Unlike tout services that sell picks based on opinions, Sharp Flow is built on **blockchain-verified betting data**. Every bet placed on Polymarket is publicly recorded on-chain. We identify the wallets with the best lifetime track records, monitor their positions, and surface the plays they're making on today's games.

### The Data Pipeline — Where Signals Come From

**1. Finding the Sharps**

We scan the top 1,500 entries on the Polymarket sports leaderboard, profile every wallet's positions, and **rank them purely by sport P&L** — the sum of profit/loss across all sports markets (NHL, CBB, NBA, NFL, MLB). We take the **top 250 wallets with $5K+ sport P&L**. These are the most profitable *sports* bettors on the platform, not just high-volume generalists.

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

### How Plays Get "Locked In"

Every game with sharp positions gets evaluated against **6 criteria**:

| # | Criteria | What It Checks |
|---|----------|----------------|
| 1 | **3+ Sharp Wallets** | At least 3 unique ELITE/PROVEN wallets aligned on one side |
| 2 | **+EV Edge** | The best retail sportsbook price beats Pinnacle's fair value |
| 3 | **Pinnacle Confirms** | Pinnacle's line has moved toward the sharp consensus side |
| 4 | **$5K+ Invested** | Meaningful capital deployed (not just small test bets) |
| 5 | **Line Moving With Play** | Pinnacle odds trending in the direction of the play |
| 6 | **Prediction Market Aligns** | Polymarket price moving toward the consensus side |

When **4 or more criteria are met**, the play is automatically **LOCKED IN** — saved to our database with a unit size for performance tracking.

### Unit Sizing

Locked plays are sized based on signal strength:

| Signal Strength | Base Units |
|----------------|------------|
| 6/6 criteria met | 3.0u |
| 5/6 criteria met | 2.0u |
| 4/6 criteria met | 1.0u |

**Boosters** (each adds to the base):
- EV edge 5%+ → +0.5u
- EV edge 3%+ → +0.25u
- 5+ sharp wallets aligned → +0.5u
- 4 sharp wallets → +0.25u
- $20K+ total invested → +0.5u
- $10K+ total invested → +0.25u

Maximum: 5.0u cap.

### Value Ratings

Each game also gets a value rating based on a point system:

| Rating | Points Required | Factors |
|--------|----------------|---------|
| **STRONG VALUE** | 8+ points | High EV + many sharps + Pinnacle confirms + heavy investment |
| **VALUE** | 5-7 points | Good EV + solid sharp backing |
| **LEAN** | 3-4 points | Some sharp interest but missing key confirmations |
| **MONITOR** | 0-2 points | Sharp activity present but insufficient confluence |

### Performance Tracking

Every locked play is recorded with its odds, book, unit size, and criteria at time of lock. After games finish, results are automatically graded and profit/loss tracked. This creates a verifiable, auditable record of the system's performance over time.

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
│  Polymarket ──────→ sports_sharps.json    (2x daily)  [NEW] │
│  Polymarket ──────→ whale_profiles.json   (legacy, 4x/day) │
│  Scan step  ──────→ sharp_positions.json  (every 15 min)    │
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
- **APIs**: Gamma API (events), Data API (trades, volume, positions), CLOB (price history), Odds API (CBB schedule)
- **ML Market Selection**: Filters out markets where `groupItemTitle` contains "o/u"/"spread" or outcomes include "Over"/"Under". First remaining market = moneyline.
- **Price History**: Fetches 24h candles from CLOB for token[0] of the ML market, samples ~12 points for sparkline. Flips if token[0] is not the away team.
- **Output**: `public/polymarket_data.json` keyed by sport → game_key (e.g., `NHL.bos_njd`)

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
- **API**: The Odds API — `icehockey_nhl` and `basketball_ncaab` with bookmakers `pinnacle,draftkings,fanduel,betmgm,caesars`
- **Tracks**: Opener, current, history (timestamped array), movement direction, best retail price per side, EV calculation
- **Output**: `public/pinnacle_history.json` keyed by sport → game_key

### Firebase Collections

| Collection | Purpose | Written By | Read By |
|-----------|---------|-----------|---------|
| **sharpFlowPicks** | Locked plays with unit size, odds, criteria | SharpFlow.jsx (client) | SharpFlow.jsx (client), updateBetResults (function) |
| **bets** | NHL model bets | betTracker.js (client) | updateBetResults (function) |
| **live_scores** | NHL game scores | liveScores function | updateBetResults (function) |

#### `sharpFlowPicks` Document Schema

```javascript
{
  date: "2026-03-16",           // ET date
  sport: "NHL",
  gameKey: "uta_dal",
  away: "Utah",
  home: "Stars",
  consensusSide: "away",        // "away" or "home"
  consensusTeam: "Utah",
  market: "MONEYLINE",
  criteriaMet: 4,               // 4-6
  criteria: {
    sharps3Plus: true,
    plusEV: false,
    pinnacleConfirms: true,
    invested5kPlus: true,
    lineMovingWith: true,
    predMarketAligns: true,
  },
  odds: 135,                    // Best retail odds at lock time
  book: "BetMGM",
  pinnacleOdds: 137,
  evEdge: 0,
  sharpCount: 2,
  totalInvested: 5572,
  units: 1.0,
  unitTier: "STANDARD",        // STANDARD / STRONG / MAX
  potentialProfit: 1.35,
  lockedAt: 1710612000000,     // epoch ms
  status: "PENDING",           // PENDING → COMPLETED
  result: {
    outcome: null,              // WIN / LOSS / PUSH
    awayScore: null,
    homeScore: null,
    winner: null,               // "away" or "home"
    profit: null,               // +1.35 or -1.0
    gradedAt: null,
  }
}
```

### Grading (Firebase Function: `updateBetResults`)

Located in `functions/src/betTracking.js`. Runs every 10 minutes.

1. Reads `live_scores/current` for FINAL games
2. Grades regular `bets` collection (existing system)
3. **Then grades `sharpFlowPicks`**:
   - Queries `status == "PENDING"`, filters to `sport == "NHL"`
   - Maps `gameKey` (e.g., `uta_dal`) to NHL abbreviations (`UTA`, `DAL`) via `ABBREV_MAP`
   - Matches against final games by `awayTeam`/`homeTeam`
   - Uses same `calculateOutcome` and `calculateProfit` functions as the main bet tracker
   - Updates doc with result + `status: "COMPLETED"`

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
- `scoreWhaleSignal()` — calculates 0-100 signal strength per game
- `SharpPositionCard` — main card component with both-sides battle, sparklines, criteria checklist, unit sizing
- `MiniSparkline` — SVG sparkline for Pinnacle/prediction market price movement
- `syncLockedPicks()` — auto-evaluates criteria, writes qualifying picks to Firebase
- `loadAllTimePnL()` — queries completed picks for running record

**Data Flow in Card**:
1. `sharp_positions.json` → per-side wallet counts, invested amounts, P&L
2. `pinnacle_history.json` → book prices, line movement, sparkline data
3. `polymarket_data.json` → prediction market price history, sparkline
4. Criteria evaluated → lock decision → Firebase write → unit sizing display

### Deployment Rules

**The only workflow that deploys the UI is `fetch-polymarket.yml`** (every 15 min).

**Rule**: Any changes to files in `src/` MUST be committed and pushed to `main` before the next workflow run. If you deploy locally with `npm run deploy` without pushing to `main`, the next scheduled run will overwrite your changes.

**Safe workflow**:
1. Make code changes
2. `git add . && git commit -m "..." && git push` (push to main)
3. `npm run deploy` (optional — immediate deploy, workflow will also deploy within 15 min)

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
