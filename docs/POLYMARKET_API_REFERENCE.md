# Polymarket API — Volume & Price Movement Monitoring

Reference for building a monitor of major volume and price movement for games (sports or other). No auth required for read-only data.

---

## API Base URLs

| API | Base URL | Purpose |
|-----|----------|---------|
| **Gamma** | `https://gamma-api.polymarket.com` | Events, markets, discovery |
| **Data** | `https://data-api.polymarket.com` | Trades, volume, open interest |
| **CLOB** | `https://clob.polymarket.com` | Prices, orderbook, price history |

---

## 1. Discover Events & Markets (Gamma API)

### List events
```
GET https://gamma-api.polymarket.com/events
```

**Key params:**
- `tag_id` — Filter by sport/category (e.g. NBA, NHL)
- `tag_slug` — e.g. `sports`, `nba`, `nhl`
- `active=true` — Tradable events
- `closed=false` — Exclude resolved
- `volume_min` — Minimum total volume
- `order=volume_24hr` or `volume` — Sort by volume
- `limit`, `offset` — Pagination

**Response:** Array of events with `id`, `title`, `slug`, `markets[]`, `volume`, `volume_24hr`, `liquidity`, `startDate`, `endDate`.

### List markets (with filters)
```
GET https://gamma-api.polymarket.com/markets
```

**Key params:**
- `game_id` — Sports game identifier
- `sports_market_types` — Array of market types
- `volume_num_min`, `volume_num_max` — Volume range
- `tag_id` — Category filter

**Response:** Markets with `conditionId`, `clobTokenIds`, `volume`, `outcomePrices`, `outcomes`, `question`.

---

## 2. Volume & Dollar Flows (Data API)

### Live volume by event
```
GET https://data-api.polymarket.com/live-volume?id={eventId}
```

**Params:** `id` (required) — Event ID (integer).

**Response:**
```json
[
  {
    "total": 125000.50,
    "markets": [
      { "market": "0x...", "value": 75000.25 },
      { "market": "0x...", "value": 50000.25 }
    ]
  }
]
```

### Trades (for volume, ticket splits, flow)
```
GET https://data-api.polymarket.com/trades
```

**Key params:**
- `eventId` — Comma-separated event IDs
- `market` — Comma-separated condition IDs (mutually exclusive with eventId)
- `side` — `BUY` or `SELL`
- `filterType` + `filterAmount` — Min size (CASH or TOKENS)
- `takerOnly` — Default true (taker fills only)
- `limit` (max 10000), `offset`

**Response:** Array of trades:
- `side`, `size`, `price`, `timestamp`
- `outcome`, `outcomeIndex` — Yes/No or outcome index
- `title`, `slug`, `eventSlug`
- `conditionId`, `asset`

**Use for:** Total dollars, ticket count, buy vs sell flow, outcome splits.

### Open interest
```
GET https://data-api.polymarket.com/oi?market=0x...&market=0x...
```

**Params:** `market` — Comma-separated condition IDs (0x-prefixed).

**Response:** `{ market, value }` per market — total open interest in dollars.

---

## 3. Price & Movement (CLOB API)

### Current price (single token)
```
GET https://clob.polymarket.com/price?token_id={tokenId}
```

### Midpoint prices (batch)
```
GET https://clob.polymarket.com/prices?token_ids=id1,id2,id3
```

### Price history (for movement detection)
```
GET https://clob.polymarket.com/prices-history?market={tokenId}&interval=1h&fidelity=1
```

**Params:**
- `market` (required) — Token/asset ID
- `startTs`, `endTs` — Unix timestamps
- `interval` — `max`, `all`, `1m`, `1h`, `6h`, `1d`, `1w`
- `fidelity` — Minutes (default 1)

**Response:**
```json
{
  "history": [
    { "t": 1710000000, "p": 0.62 },
    { "t": 1710003600, "p": 0.65 }
  ]
}
```

**Use for:** Detect major price moves (e.g. >5% in 1h).

### Order book
```
GET https://clob.polymarket.com/book?token_id={tokenId}
```

Bids/asks, spread, depth.

---

## 4. Data Model: Events → Markets → Tokens

- **Event** — e.g. "Lakers vs Celtics - Who wins?"
- **Markets** — Binary or multi-outcome. Each has `conditionId`, `clobTokenIds` (one per outcome).
- **Token** — One CLOB token per outcome. Use for `/price`, `/prices-history`, `/book`.

**Outcome split:** For binary (Yes/No), two tokens. Sum of prices ≈ 1.0.  
- Yes at 0.65 → No at ~0.35.  
- Ticket/dollar split: aggregate trades by `outcome` or `outcomeIndex`.

---

## 5. Monitoring Architecture (Proposed)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. DISCOVER                                                      │
│    GET /events?tag_slug=sports&active=true&order=volume_24hr    │
│    → Cache event IDs, market conditionIds, clobTokenIds         │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. POLL (every 5–15 min)                                         │
│    • /live-volume?id={eventId}     → total $ volume              │
│    • /trades?eventId={id}&limit=500 → recent flow, buy/sell split │
│    • /prices-history?market={token}&interval=1h → price move %    │
│    • /oi?market={conditionId}      → open interest               │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. ALERTS                                                        │
│    • Volume spike: volume_24hr > 2x baseline                     │
│    • Price move: (p_now - p_1h_ago) / p_1h_ago > 0.05           │
│    • Flow skew: buy_volume / sell_volume > 1.5                  │
│    • OI change: delta > threshold                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Rate Limits

- Gamma: ~100 req/min (check docs)
- Data API: similar
- CLOB: public endpoints generally permissive

Use reasonable polling (e.g. 5–15 min) to avoid limits.

---

## 7. WebSocket (Real-Time)

- **Market channel** — Orderbook, price, trade updates
- **Sports channel** — Live scores, game state

See `docs.polymarket.com/api-reference/wss/market.md` and `sports.md`.

---

## 8. Sports-Specific

- `GET /sports` — Metadata, valid market types
- `GET /sports/teams` — Team list
- Markets can have `game_id` for sports games

Use `tag_slug` or `tag_id` to filter events by sport.

---

## 9. Starter Script

`scripts/polymarketMonitor.js` — One-shot poll of top events by volume:
- Lists events (client-side sort; API `order=volume_24hr` can 422)
- Fetches live volume, recent trades (buy/sell split), 1h price move
- `node scripts/polymarketMonitor.js --sports` to filter sports only
