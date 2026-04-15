# Polymarket API Reference — Sharp Flow Implementation Guide

## Overview

Polymarket exposes three public APIs. No authentication required for any of them.

| API | Base URL | Purpose |
|-----|----------|---------|
| **Data API** | `https://data-api.polymarket.com` | Positions, trades, leaderboard, activity |
| **Gamma API** | `https://gamma-api.polymarket.com` | Events, markets, discovery, metadata |
| **CLOB API** | `https://clob.polymarket.com` | Prices, order books, price history |

---

## Part 1: Data API — What We Use Today

### `GET /v1/leaderboard` — Wallet Rankings

The authoritative source for wallet P&L and volume. This is where Sports P&L, ROI, and Volume come from.

**Parameters:**

| Param | Values | Default | Notes |
|-------|--------|---------|-------|
| `category` | `OVERALL`, `SPORTS`, `POLITICS`, `CRYPTO`, `CULTURE`, `WEATHER`, `ECONOMICS`, `TECH`, `FINANCE` | `OVERALL` | Category-scoped P&L and volume |
| `timePeriod` | `ALL`, `MONTH`, `WEEK`, `DAY` | `DAY` | Time window |
| `orderBy` | `PNL`, `VOL` | `PNL` | Sort criterion |
| `limit` | 1–50 | 25 | Page size |
| `offset` | 0–1000 | 0 | Pagination |
| `user` | `0x...` address | — | Filter to single wallet |
| `userName` | string | — | Filter by username |

**Response fields (`TraderLeaderboardEntry`):**

| Field | Type | Description | Used By Us? |
|-------|------|-------------|-------------|
| `rank` | string | Position on leaderboard | **Not used** — could show "#6 sports bettor" |
| `proxyWallet` | address | Wallet address | Yes — primary key |
| `userName` | string | Display name | Yes — stored as `name` |
| `vol` | number | Trading volume (category-scoped) | Yes — sports volume, ROI denominator |
| `pnl` | number | Profit/loss (category-scoped) | Yes — `sportPnlTotal`, `totalPnl` |
| `profileImage` | string | Avatar URL | **Not used** — could show in Vault |
| `xUsername` | string | Twitter/X handle | **Not used** — could link to profile |
| `verifiedBadge` | boolean | Verified status | **Not used** — trust signal |

**How we call it:**

```javascript
// Sports leaderboard (primary — P&L and volume are sports-only)
GET /v1/leaderboard?timePeriod=ALL&category=SPORTS&orderBy=PNL&limit=50&offset=0

// Overall leaderboard (cross-reference for true overall P&L)
GET /v1/leaderboard?timePeriod=ALL&category=OVERALL&orderBy=PNL&limit=50&offset=0

// Monthly hot bettors
GET /v1/leaderboard?timePeriod=MONTH&category=SPORTS&orderBy=PNL&limit=50&offset=0

// Single wallet lookup (any category/period)
GET /v1/leaderboard?category=SPORTS&timePeriod=ALL&user=0x1234...
```

**Critical accuracy note:** When `category=SPORTS`, the returned `pnl` and `vol` are scoped to sports markets only. This is the trusted source for sports P&L — never sum `cashPnl` from positions for total wallet assessment.

---

### `GET /positions` — Open Positions

Current (unsettled) positions for a wallet. This is how we see what sharps are betting on right now.

**Parameters:**

| Param | Values | Default | Notes |
|-------|--------|---------|-------|
| `user` | address (required) | — | Wallet to query |
| `market` | conditionId(s) | — | Filter by market (csv) |
| `eventId` | integer(s) | — | Filter by event (csv) |
| `sizeThreshold` | number | 1 | Min position size |
| `redeemable` | boolean | false | Only redeemable positions |
| `mergeable` | boolean | false | Only mergeable positions |
| `limit` | 0–500 | 100 | Page size |
| `offset` | 0–10000 | 0 | Pagination |
| `sortBy` | `TOKENS`, `CASHPNL`, `PERCENTPNL`, `CURRENT`, `INITIAL`, `TITLE`, `RESOLVING`, `PRICE`, `AVGPRICE` | `TOKENS` | Sort criterion |
| `title` | string | — | Filter by market title |

**Response fields (`Position`):**

| Field | Type | Description | Used By Us? |
|-------|------|-------------|-------------|
| `proxyWallet` | address | Wallet address | Yes |
| `asset` | string | Token ID | No |
| `conditionId` | hash | Market condition ID | No |
| `size` | number | Tokens held (current) | Yes — position sizing |
| `avgPrice` | number | Average entry price | Yes — entry price display |
| `initialValue` | number | Original investment value | **Not used** — more accurate cost basis than `size * avgPrice` |
| `currentValue` | number | Current position value | Yes (computed, but API provides it) |
| `cashPnl` | number | Unrealized dollar P&L | Yes — per-position P&L |
| `percentPnl` | number | Unrealized % P&L | **Not used** — better for comparing wallets with different sizes |
| `totalBought` | number | Total tokens ever purchased | **Not used** — reveals if they added to position |
| `realizedPnl` | number | Realized portion of P&L | **Not used** — partial exits |
| `percentRealizedPnl` | number | Realized P&L as % | **Not used** |
| `curPrice` | number | Current market price | Yes — for filtering settled positions |
| `redeemable` | boolean | Position can be redeemed | No |
| `mergeable` | boolean | Position can be merged | No |
| `title` | string | Market title | Yes — game matching, sport classification |
| `slug` | string | Market URL slug | **Not used** — could link to Polymarket |
| `icon` | string | Market icon URL | No |
| `eventSlug` | string | Event URL slug | **Not used** — could link to event |
| `outcome` | string | Outcome label (team name, Yes/No) | Yes — side determination |
| `outcomeIndex` | integer | 0 or 1 | No |
| `oppositeOutcome` | string | Other side's label | No |
| `oppositeAsset` | string | Other side's token ID | No |
| `endDate` | string | Market resolution date | **Not used** — could show time to resolution |
| `negativeRisk` | boolean | Negative risk market flag | No |

**How we call it:**

```javascript
// Scan a wallet's current positions
GET /positions?user=0x1234...&limit=500&sortBy=CASHPNL

// During profiling (paginated)
GET /positions?user=0x1234...&sortBy=CASHPNL&limit=500&offset=0
GET /positions?user=0x1234...&sortBy=CASHPNL&limit=500&offset=500
```

---

### `GET /closed-positions` — Resolved Bets

Settled/closed positions for a wallet. Currently only used for sport market counting during profiling — the biggest untapped data source.

**Parameters:**

| Param | Values | Default | Notes |
|-------|--------|---------|-------|
| `user` | address (required) | — | Wallet to query |
| `market` | conditionId(s) | — | Filter by market |
| `title` | string | — | Filter by title |
| `eventId` | integer(s) | — | Filter by event |
| `limit` | 0–50 | 10 | Page size (max 50!) |
| `offset` | 0–100000 | 0 | Pagination |
| `sortBy` | `REALIZEDPNL`, `TITLE`, `PRICE`, `AVGPRICE`, `TIMESTAMP` | `REALIZEDPNL` | Sort criterion |
| `sortDirection` | `ASC`, `DESC` | `DESC` | Sort order |

**Response fields (`ClosedPosition`):**

| Field | Type | Description | Used By Us? |
|-------|------|-------------|-------------|
| `proxyWallet` | address | Wallet address | Yes (during profiling) |
| `asset` | string | Token ID | No |
| `conditionId` | hash | Market condition ID | No |
| `avgPrice` | number | Average entry price | **Partially** — used for avgBet calc |
| `totalBought` | number | Total tokens bought | **Partially** — used for avgBet calc |
| `realizedPnl` | number | Final settled P&L | **Not displayed** — could show bet outcomes |
| `curPrice` | number | Final price (0 or 1 for settled) | No |
| `timestamp` | int64 | When position closed | **Not used** — could show recent resolved bets |
| `title` | string | Market title | Yes — sport classification |
| `slug` | string | Market URL slug | **Not used** |
| `icon` | string | Market icon URL | No |
| `eventSlug` | string | Event URL slug | **Not used** |
| `outcome` | string | Which side they were on | **Not used** — could show win/loss |
| `outcomeIndex` | integer | 0 or 1 | No |
| `oppositeOutcome` | string | Other side | No |
| `oppositeAsset` | string | Other side's token | No |
| `endDate` | string | Market end date | No |

**Note:** Max page size is 50 (vs 500 for open positions). Pagination is required for wallets with many closed positions.

---

### `GET /traded` — Trade Count

Returns the total number of markets a wallet has ever traded on.

```javascript
GET /traded?user=0x1234...
// Response: { "traded": 52582 }
```

This is ALL markets (not sport-specific). Currently used as `marketsTraded`.

---

### `GET /activity` — Onchain Activity

**Not currently used.** Returns onchain transaction activity for a wallet.

```javascript
GET /activity?user=0x1234...
```

Could be used for: trade timing patterns, recent activity monitoring, detecting when a wallet is actively trading.

---

### `GET /value` — Portfolio Value

**Not currently used.** Returns total current position value for a wallet.

```javascript
GET /value?user=0x1234...
```

Could be used for: bankroll estimation, position sizing context.

---

### `GET /oi` — Open Interest

**Not currently used.** Returns open interest for a specific market.

```javascript
GET /oi?market=0xconditionId...
```

Could be used for: market liquidity assessment, detecting thin markets.

---

### `GET /holders` — Top Holders

**Not currently used.** Returns the top holders of a specific market/outcome.

```javascript
GET /holders?market=0xconditionId...
```

Could be used for: discovering new wallets positioned on specific games, seeing overall market concentration.

---

### `GET /trades` — Trade History

Used in `fetchPolymarketData.js` for whale trade aggregation, not in wallet profiling.

```javascript
GET /trades?market=0xconditionId...&limit=100
```

---

## Part 2: Gamma API — Markets & Events

### `GET /events` — Event Discovery

Primary source for game data. Used in `fetchPolymarketData.js`.

```javascript
// Fetch sports events
GET /events?tag_slug=nhl&limit=50&active=true
GET /events?tag_slug=nba&limit=50&active=true
```

**Key response fields:**

| Field | Description |
|-------|-------------|
| `id` | Event ID |
| `title` | Event title |
| `slug` | URL slug |
| `markets` | Array of market objects |
| `startDate` / `endDate` | Event timing |
| `active` | Whether event is live |
| `volume` | Total event volume |
| `liquidity` | Current liquidity |

Each market within an event includes `outcomes`, `outcomePrices`, `clobTokenIds`, `conditionId`.

### Other Gamma Endpoints

| Endpoint | Description | Our Usage |
|----------|-------------|-----------|
| `GET /markets` | Market listing/search | Not directly used |
| `GET /public-search` | Search events/markets | Not used |
| `GET /tags` | Category/tag list | Not used |
| `GET /series` | Event series | Not used |
| `GET /sports` | Sports metadata | Not used |
| `GET /teams` | Team metadata | Not used |

---

## Part 3: CLOB API — Prices & History

### `GET /prices-history` — Price Charts

Used in `fetchPolymarketData.js` for sparkline data.

```javascript
GET /prices-history?market=tokenId&interval=1h&fidelity=60
```

**Response:** Array of `{ t: timestamp, p: price }` points.

### Other CLOB Endpoints

| Endpoint | Description | Our Usage |
|----------|-------------|-----------|
| `GET /price` | Single token price | Not used |
| `GET /prices` | Multiple token prices | Not used |
| `GET /book` | Order book depth | Not used |
| `GET /midpoint` | Midpoint price | Not used |
| `GET /spread` | Bid-ask spread | Not used |

---

## Part 4: Rate Limiting

All APIs are public and unauthenticated. Rate limits are enforced per-IP:

| Behavior | Our Approach |
|----------|-------------|
| HTTP 429 (Too Many Requests) | Exponential backoff: 2s, 4s, 8s |
| General delays | 800ms between wallet scans |
| Retry limit | 3 attempts per request |
| Leaderboard pagination | 500ms between pages |

---

## Part 5: Implementation Ideas (Unused Data)

### 1. Recent Resolved Sport Bets (High Value)

**Source:** `/closed-positions?user={addr}&sortBy=TIMESTAMP&sortDirection=DESC&limit=50`

Display each vault wallet's last 10–20 settled sport bets with:
- Game title, sport, which side they took
- Entry price, total bought, realized P&L
- Win/loss determination (curPrice = 1.0 → won, 0.0 → lost)
- Settlement timestamp

This provides accountability — "this wallet won 7 of their last 10 sport bets."

**Complexity:** Moderate. Need to keyword-match titles to sports, paginate (max 50 per page), handle non-sport positions in results.

### 2. Leaderboard Rank Display

**Source:** Leaderboard `rank` field (already returned, just not stored)

Show "Ranked #6 in Sports" next to wallet name. Provides instant credibility signal.

**Complexity:** Trivial. Just store `rank` from leaderboard response.

### 3. Trending Performance (Weekly/Daily P&L)

**Source:** `/v1/leaderboard?timePeriod=WEEK&category=SPORTS&user={addr}`

Show recent form: "+$50K this week" or "Top 10 this month". Identifies who's hot now vs who built profit long ago.

**Complexity:** Low. One extra leaderboard call per wallet with `timePeriod=WEEK` or `DAY`.

### 4. Position % P&L

**Source:** `percentPnl` field from `/positions` (already returned, not used)

Show "+12.5% ROI on this position" instead of just dollar P&L. Better for comparing conviction across different-sized wallets.

**Complexity:** Trivial. Field already exists in API response.

### 5. Position Adds (Size vs TotalBought)

**Source:** `totalBought` and `size` from `/positions`

If `totalBought > size`, the wallet has been adding to or partially exiting the position. Could display "Added 3x" as a conviction signal.

**Complexity:** Trivial. Both fields already returned.

### 6. Market Links

**Source:** `slug` and `eventSlug` from `/positions`

Link directly to the Polymarket market page: `https://polymarket.com/event/{eventSlug}`.

**Complexity:** Trivial. Fields already returned.

### 7. Time to Resolution

**Source:** `endDate` from `/positions`

Show "Resolves in 4h" next to each position. Helps gauge how close to settlement.

**Complexity:** Trivial. Field already returned.

### 8. Portfolio Value / Bankroll

**Source:** `GET /value?user={addr}`

Show estimated bankroll size. A wallet betting $50K with a $10M bankroll is less significant than one betting $50K with a $100K bankroll.

**Complexity:** Low. Single API call per wallet.

### 9. Wallet Profile Enrichment

**Source:** `profileImage`, `xUsername`, `verifiedBadge` from leaderboard

Show avatar, link to Twitter, and verified badge. Makes the vault feel more like real profiles.

**Complexity:** Trivial. Fields already in leaderboard response.

### 10. Top Holders Discovery

**Source:** `GET /holders?market={conditionId}`

For each game's Polymarket market, see the top holders. Could discover new wallets not on leaderboard but with large positions on specific games.

**Complexity:** Medium. Need to map our game keys to Polymarket conditionIds.

---

## Part 6: Data Flow Summary

```
Polymarket Data API
├── /v1/leaderboard (category=SPORTS)  ──→  Sport P&L, Volume, ROI
├── /v1/leaderboard (category=OVERALL) ──→  Overall P&L (cross-ref)
├── /v1/leaderboard (timePeriod=MONTH) ──→  Monthly hot detection
├── /positions                         ──→  Current bets on today's games
├── /closed-positions                  ──→  Sport market counting, avg bet calc
└── /traded                            ──→  Total markets traded

Polymarket Gamma API
└── /events (by tag_slug)              ──→  Game schedule, market IDs, outcomes

Polymarket CLOB API
└── /prices-history                    ──→  Price sparklines

The Odds API
└── /v4/sports/{key}/odds              ──→  Pinnacle + retail sportsbook odds
```

---

## Part 7: Current Field Sources (Quick Reference)

For any field displayed in the UI, this table shows exactly where it comes from:

| Display Field | Script | API Endpoint | API Field | Computation |
|--------------|--------|-------------|-----------|-------------|
| Sports P&L | seedSportsSharps | `/v1/leaderboard?category=SPORTS` | `pnl` | Direct (rounded) |
| Overall P&L | seedSportsSharps | `/v1/leaderboard?category=OVERALL` | `pnl` | Cross-referenced by wallet |
| Volume | seedSportsSharps | `/v1/leaderboard?category=SPORTS` | `vol` | Direct |
| ROI | seedSportsSharps | `/v1/leaderboard?category=SPORTS` | `pnl`, `vol` | `(pnl / vol) * 100` |
| Avg Bet | seedSportsSharps | `/positions`, `/closed-positions` | `size`, `avgPrice`, `totalBought` | `sportInvested / sportPositionCount` |
| Sport Bets | seedSportsSharps | `/positions`, `/closed-positions` | `title` | Keyword-matched position count |
| Total Markets | seedSportsSharps | `/traded` | `traded` | Direct (all categories) |
| Tier | scanSharpPositions | — | — | `effectiveTier()` from sport P&L thresholds |
| Position Size | scanSharpPositions | `/positions` | `size`, `avgPrice` | `round(size * avgPrice)` |
| Entry Price | scanSharpPositions | `/positions` | `avgPrice` | Direct |
| Position P&L | scanSharpPositions | `/positions` | `cashPnl` | `round(cashPnl)` |
| First Seen | scanSharpPositions | — | — | Preserved timestamp from first detection |
