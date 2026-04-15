# Sharp Flow — Wallet Intelligence System

## What This Document Covers

How Sharp Flow discovers, profiles, tiers, scans, and displays wallet-level data. This is the system that answers: **who are the sharps, what are they betting on, how good are they, and how much are they risking?**

---

## Part 1: Finding the Sharps

### Primary Pipeline: `seedSportsSharps.js` (runs 2x daily)

The definitive source of sharp wallets. Scans the Polymarket sports leaderboard and builds a ranked list of the most profitable sports bettors.

**Discovery Process:**

1. **Leaderboard scrape** — Fetches up to 1,500 entries from the all-time SPORTS leaderboard (`GET /v1/leaderboard?timePeriod=ALL&category=SPORTS&orderBy=PNL&limit=50`) plus up to 1,000 entries from the monthly leaderboard (`timePeriod=MONTH`).

2. **Monthly hot merge** — Wallets with $20K+ monthly P&L (`MIN_MONTHLY_PNL = 20000`) that don't appear on the all-time list are appended. This catches surging bettors who haven't yet built lifetime totals.

3. **Per-wallet profiling** — For each wallet (unless fresh within 48 hours), fetches:
   - Open positions (`GET /positions?user={wallet}&sortBy=CASHPNL&limit=500`, paginated)
   - Closed positions (`GET /closed-positions?user={wallet}&limit=500`, paginated)
   - Traded count (`GET /traded?user={wallet}`)

4. **Sport classification** — Every position title is run through `classifySport()` which keyword-matches to NHL, CBB, NBA, NFL, or MLB. This builds `sportMarkets` (count per sport) and determines whether the wallet has actual sports activity.

5. **Qualification** — A wallet makes the final list if:
   - `sportPnlTotal >= $5,000` (from leaderboard P&L, not position sums), OR
   - `monthlyQualified === true` AND has at least one sport-tagged position

6. **Overall P&L cross-reference** — A separate OVERALL category leaderboard is fetched (same depth) and stored as `overallPnl` / `overallVol`. This gives each wallet's true cross-category Polymarket P&L, separate from their sports-only P&L.

7. **Avg bet computation** — Computed from actual position data: `sportInvested / sportPositionCount`, where `sportInvested` sums `totalBought * avgPrice` (closed) and `size * avgPrice` (open) across all sport-tagged positions. This avoids the volume/count mismatch that occurs when using leaderboard volume divided by keyword-counted markets.

8. **Output** — Top 500 qualified wallets (sorted by sportPnlTotal descending) written to `public/sports_sharps.json`.

**Critical detail:** P&L for qualification comes from the **leaderboard API** (`lb.pnl` with `category=SPORTS`), not from summing position `cashPnl`. The leaderboard is authoritative. Positions are used for sport market counting and avg bet computation.

### Legacy Pipeline: `buildWhaleProfiles.js` (runs 4x daily)

Kept as a fallback. Sources wallets from whale trades in `polymarket_data.json` + the leaderboard (top 1,000 where P&L > $2K).

**Key differences from primary pipeline:**
- Computes `totalPnl` by summing position `cashPnl` (not leaderboard P&L) for trade-derived wallets
- Assigns tiers via `tierFromStats()` (see Part 2)
- Computes `mmScore` for market-maker detection (see Part 3)
- Tracks `pnlHistory` (up to 30 timestamped entries)
- Caps at 1,000 profiles, pruning non-leaderboard entries older than 30 days

**Output:** `public/whale_profiles.json`

---

## Part 2: Tier System

### Assignment (`tierFromStats` in `buildWhaleProfiles.js`)

Evaluated in order — first match wins:

| Tier | Criteria | Meaning |
|------|----------|---------|
| **ELITE** | $100K+ lifetime profit AND 50+ markets | Best of the best |
| **PROVEN** | $25K+ lifetime profit AND 20+ markets | Strong track record |
| **ACTIVE** | $5K+ lifetime profit AND 10+ markets | Profitable, smaller sample |
| **DEGEN** | -$50K or worse | Large losing wallet (faded) |
| **LOSING** | -$10K or worse | Losing wallet (faded) |
| **UNKNOWN** | Everything else | Insufficient data |

### Effective Tier Upgrade (`effectiveTier` in `scanSharpPositions.js`)

When a wallet exists in `sports_sharps.json`, its tier can be upgraded based on verified sport P&L:

| Sport P&L | Sport Rank | Effective Tier (if higher than base) |
|-----------|-----------|--------------------------------------|
| $50K+ | 4 | ELITE |
| $10K+ | 3 | SHARP |
| $0+ | 2 | PROVEN |
| $0 or below | — | No upgrade, keep base tier |

The `SHARP` tier only comes from this sport-based upgrade path — it doesn't exist in the base `tierFromStats` system.

### Tier Weights in Scoring (`SharpFlow.jsx`)

Tiers directly affect the `breadth` feature used in star rating:

```
TIER_WEIGHT = { ELITE: 3, SHARP: 2, PROVEN: 1.5, ACTIVE: 1 }

breadth = sum(TIER_WEIGHT[wallet.tier]) / (totalWallets * 3)
```

An ELITE wallet on the consensus side contributes 3x more breadth than an ACTIVE wallet.

---

## Part 3: Market Maker Detection

### `mmScore` (`calculateMMScore` in `buildWhaleProfiles.js`)

A heuristic score (0–100) that flags likely market makers — wallets that trade both sides for liquidity provision rather than directional conviction.

| Component | Logic | Max Points |
|-----------|-------|-----------|
| Volume/PnL ratio | vol/pnl > 50 → +20, > 20 → +12, > 10 → +5 | 20 |
| Market breadth | 200+ markets → +15, 100+ → +8, 50+ → +4 | 15 |
| Low sport concentration | Largest sport < 30% of total → +15, < 50% → +8 | 15 |
| PnL smoothness | If 5+ history points: avg delta / |P&L| < 1% → +15, < 3% → +8 | 15 |
| Negative sport P&L | Sport P&L < -$100K → +35, < -$25K → +25, < -$5K → +15, < $0 → +5 | 35 |

**Exclusion threshold:** `mmScore > 40` → wallet excluded from scanning in `scanSharpPositions.js`.

---

## Part 4: Scanning Positions (What Are They Betting On?)

### `scanSharpPositions.js` (runs every 15 minutes)

This is the script that answers "what are the sharps betting on right now?" It takes the qualified wallet lists and checks their current Polymarket positions against today's games.

### Wallet Selection (Additive Merge)

**Base wallets** (from `whale_profiles.json`):
- Must be ELITE, PROVEN, or ACTIVE tier
- Excluded if `mmScore > 40`
- Excluded if sport P&L < -$50,000 (aggregate from profile)
- Excluded if sport P&L <= $0 (unless `monthlyQualified` in sports_sharps)

**Supplementary wallets** (from `sports_sharps.json`, not already in base):
- Added if `sportPnlTotal > 0` OR `monthlyQualified`
- Default tier: `SHARP`
- No mmScore filtering needed (pre-qualified by sport profit)

**Scan order:** All wallets sorted by `totalPnl` descending (biggest bettors first).

### Position Scanning

For each wallet: `GET /positions?user={wallet}&limit=500` (single page, no pagination).

**Filters applied per position:**
- `curPrice <= 0.01` or `>= 0.99` → skipped (settled/illiquid)
- Position title must match a game in today's schedule via team name resolution
- Classified as ML, spread, or total based on title/outcome keywords

### Per-Position Data Captured

Each position that matches a today's game gets this data written to the output:

| Field | Source | What It Shows |
|-------|--------|---------------|
| `wallet` | Wallet address | Identifies the bettor |
| `tier` | `effectiveTier()` result | ELITE / SHARP / PROVEN / ACTIVE |
| `totalPnl` | Sport P&L from effectiveTier, or profile totalPnl | Lifetime sports profit |
| `sportPnlTotal` | From sports_sharps lookup | Verified sport P&L |
| `sportVerified` | `effectiveTier()` | `true` if sport P&L > $0 in sports_sharps |
| `sportROI` | `(leaderboard pnl / leaderboard vol) * 100` | Sports betting ROI % |
| `avgSportBet` | `leaderboard vol / sport market count` | Typical bet size |
| `monthlyPnl` | From sports_sharps (if monthlyQualified) | Current month profit |
| `monthlyQualified` | From sports_sharps | Hot this month ($20K+) |
| `side` | `resolveOutcomeSide()` | away/home (or over/under for totals) |
| `invested` | `round(size * avgPrice)` | Dollar amount at risk |
| `size` | Position size (shares) | Raw share count |
| `avgPrice` | Average entry price | Entry price per share |
| `curPrice` | Current market price | Live price |
| `currentValue` | `round(size * curPrice)` | Current position value |
| `pnl` | `round(cashPnl)` | Profit/loss on this position |
| `firstSeen` | Preserved across runs | When position first appeared |
| `marketType` | ml / spread / total | Market classification |

### Consensus Determination

Per game, consensus side is determined by **total dollars invested** (not wallet count):

- ML/Spread: `awayInvested > homeInvested` → consensus = `'away'`; tie → `null`
- Totals: `overInvested > underInvested` → consensus = `'over'`; tie → `null`

### Output Files

| File | Contents |
|------|----------|
| `sharp_positions.json` | ML positions only |
| `sharp_spread_positions.json` | Spread positions only |
| `sharp_total_positions.json` | Total (O/U) positions only |

Each file has the same structure: `{ NHL: { gameKey: { away, home, positions: [], summary: {...} } }, CBB: {...}, MLB: {...}, NBA: {...}, meta: {...} }`

---

## Part 5: What the UI Displays

### Per-Wallet Card (within a game)

```
[ELITE]  ...1697  +$1.6M sports P&L                    8h ago
Wings  $35.1K @ 56¢  +$960  +1.5% ROI
```

| UI Element | Data Source | Computation |
|-----------|-------------|-------------|
| **Tier badge** (ELITE) | `position.tier` | From `effectiveTier()` in scanSharpPositions |
| **Wallet address** (...1697) | `position.wallet` | Last 4 chars of hex address |
| **Sports P&L** (+$1.6M) | `position.totalPnl` | Sport P&L from leaderboard `category=SPORTS`, via effectiveTier |
| **Monthly P&L** (when shown) | `position.monthlyPnl` | Only shown when `monthlyQualified && monthlyPnl > 0 && totalPnl <= 0` |
| **Team** (Wings) | `position.side` + game data | Resolved from position outcome to team name |
| **Position size** ($35.1K) | `position.invested` | `round(size * avgPrice)` from positions API |
| **Entry price** (@ 56¢) | `position.avgPrice` | `round(avgPrice * 100)` displayed as cents |
| **Position P&L** (+$960) | `position.pnl` | `round(cashPnl)` from Polymarket positions API |
| **ROI** (+1.5%) | `position.sportROI` | `(leaderboard pnl / leaderboard vol) * 100` from SPORTS leaderboard |
| **Conviction badge** (1.5x avg) | `position.avgSportBet` | Shows when `invested / avgSportBet >= 1.5` — bettor risking 1.5x+ their typical bet |
| **Time** (8h ago) | `position.firstSeen` | Computed from firstSeen timestamp vs now |

### Sharp Vault Expanded Card

| UI Element | Data Source | Computation |
|-----------|-------------|-------------|
| **SPORT P&L** | `sportPnlTotal` | Leaderboard `pnl` with `category=SPORTS` |
| **OVERALL P&L** | `overallPnl` | Leaderboard `pnl` with `category=OVERALL` (true cross-category P&L) |
| **VOLUME** | `vol` | Leaderboard `vol` with `category=SPORTS` |
| **ROI** | `sportROI` | `(sport pnl / sport vol) * 100` |
| **AVG BET** | `avgSportBet` | `sportInvested / sportPositionCount` from actual position data |
| **SPORT BETS** | `sportBetCount` | Count of sport-keyword-matched positions (open + closed) |
| **SPORT ACTIVITY** | `sportMarkets` | Per-sport market counts from position title keyword matching |

### Sort Order

Wallet positions within a game are sorted by:
1. `sportVerified` wallets first (true before false)
2. Then by `invested` descending (biggest positions first)

### Sport Verified Badge

A wallet is `sportVerified: true` when `sports_sharps.json` has a positive `sportPnlTotal` for that address. These wallets sort to the top of the position list because they have verified sport-specific profitability, not just general Polymarket profit.

---

## Part 6: How Wallet Data Feeds the Star Rating

The per-wallet position data flows into `computeSharpFeatures()` which produces the features that drive `rateStarsV7()`:

| Feature | How Wallet Data Contributes |
|---------|---------------------------|
| **breadth** | Tier-weighted wallet count: `sum(TIER_WEIGHT[tier]) / (totalWallets * 3)` |
| **conviction** | `log10(avgInvestedPerWallet)` normalized to 0–1 |
| **concentration** | `maxSingleWalletInvested / totalConsensusInvested` — flags single-whale risk |
| **counterSharpScore** | ELITE opposing = 3 pts, SHARP = 2 pts (tier from effectiveTier) |
| **conWalletCount / oppWalletCount** | Raw wallet counts per side |
| **conTotalInvested / oppTotalInv** | Sum of `invested` per side |
| **conMoneyPct / conWalletPct** | Percentage of money and wallets on consensus side |
| **sportSharpCount** | Count of consensus wallets with `sportVerified === true` |
| **dominantTier** | Tier of the largest consensus wallet |

### Net-Position Handling

Wallets betting both sides of a game are handled via net-position: if a wallet has $1K on one side and $500 on the other, only the $500 net counts on the dominant side.

---

## Part 7: Data Freshness & Scheduling

| Data | Script | Schedule | Staleness |
|------|--------|----------|-----------|
| Sharp wallet list | `seedSportsSharps.js` | 10 AM & 10 PM ET | 48h incremental refresh; monthly-hot always refreshed |
| Whale profiles (legacy) | `buildWhaleProfiles.js` | 8 AM, 12 PM, 4 PM, 8 PM ET | 12h refresh (24h in seed mode); 30-day stale prune |
| Today's positions | `scanSharpPositions.js` | Every 15 min (via fetch-polymarket workflow) | Rewritten from scratch each run |
| Position firstSeen | Preserved across runs | Carried forward from previous output files | Stable until position disappears |

### Data Flow Summary

```
Polymarket Leaderboard API
├── category=SPORTS  ──→ Sport P&L, Volume, ROI
├── category=OVERALL ──→ Overall P&L (cross-reference)
├── timePeriod=MONTH ──→ Monthly hot detection
        │
        ▼
  seedSportsSharps.js ──→ sports_sharps.json (500 wallets, sport P&L, overall P&L, ROI)
        │
        │   buildWhaleProfiles.js ──→ whale_profiles.json (1000 wallets, tiers, mmScore)
        │           │
        ▼           ▼
    scanSharpPositions.js ──→ sharp_positions.json (today's bets per game)
                                    │
                                    ▼
                          SharpFlow.jsx UI
                          ├── computeSharpFeatures() → breadth, conviction, etc.
                          ├── rateStarsV7() → star rating
                          ├── Wallet position cards (tier, P&L, ROI, size)
                          └── syncPickToFirebase() → locked picks
```

**See also:** `POLYMARKET_API_REFERENCE.md` — full endpoint schemas, unused fields, and implementation ideas.
