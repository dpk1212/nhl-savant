# Sharp Ranking System & Vault Facelift Plan

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
| `sportRecord` | `{ won, lost }` from closed positions | **2/500** (stale — see Accuracy Audit) |
| `sportWinRate` | `won / (won + lost) * 100` | **2/500** (stale) |
| `perSport` | Per-sport breakdown (bets, invested, pnl, W/L, ROI, avgBet) | **2/500** (stale) |
| `overallPnl` | Cross-category P&L from OVERALL leaderboard | 500/500 |

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

Only 2 out of 500 wallets have `sportRecord` and `perSport` — these are stale artifacts from a previous version of `buildProfile()`. The current version only counts sport markets and computes invested amounts. W/L computation must be restored from scratch.

**Additional bug:** `buildProfile()` fetches closed positions with `limit=500` but the API caps at 50 per page. The break condition `if (page.length < 500) break` always fires immediately, so only the first 50 closed positions are ever retrieved. This must be fixed to `limit=50` with `if (page.length < 50) break` before W/L computation can be accurate.

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

---

## Accuracy Audit — What's Real vs Computed vs Broken

### API Fields Verified (Live-tested April 15, 2026)

| Field | API Endpoint | Actually Returned? | Currently Stored? | Notes |
|-------|-------------|-------------------|------------------|-------|
| `rank` | `/v1/leaderboard` | **YES** — string like "1", "2" | **NO** — stripped at line 112 | Trivial to add |
| `profileImage` | `/v1/leaderboard` | **YES** — URL string (empty if unset) | **NO** — stripped | 8/50 top sports bettors have one |
| `xUsername` | `/v1/leaderboard` | **YES** — string (empty if unset) | **NO** — stripped | Only 2/50 top bettors have one |
| `verifiedBadge` | `/v1/leaderboard` | **YES** — boolean | **NO** — stripped | 0/50 top sports bettors verified |
| `WEEK` leaderboard | `/v1/leaderboard?timePeriod=WEEK` | **YES** — returns pnl, vol, rank | **NO** — not fetched | Works identically to ALL |
| `DAY` leaderboard | `/v1/leaderboard?timePeriod=DAY` | **YES** — returns pnl, vol, rank | **NO** — not fetched | Works identically to ALL |
| `/value` endpoint | `/value?user={addr}` | **YES** — returns `{ value: number }` | **NO** — not called | Portfolio value for bankroll context |
| `realizedPnl` | `/closed-positions` | **YES** — dollar P&L per settled bet | **NO** — not stored | Key for recent results |
| `timestamp` | `/closed-positions` | **YES** — unix timestamp of settlement | **NO** — not stored | Key for "recent bets" sort |
| `outcome` | `/closed-positions` | **YES** — which side they took | **NO** — not stored | Key for showing win/loss |
| `slug` / `eventSlug` | `/closed-positions` | **YES** — Polymarket URL paths | **NO** — not stored | Enables "View on Polymarket" links |
| `percentPnl` | `/positions` | **YES** — percent ROI per position | **NO** — not stored | Better than dollar P&L for comparison |
| `totalBought` | `/positions` | **YES** — total tokens ever purchased | **NO** — not stored in scan output | Reveals position adds |

### Known Bugs / Inaccuracies

**BUG: Closed positions pagination is broken.** `buildProfile()` at line 135-142 requests `limit=500` but the API silently caps at 50 per page. The `if (page.length < 500) break` always triggers on the first page, so **we only ever get the first 50 closed positions per wallet**. For wallets with hundreds of sport bets, `sportPositionCount`, `sportInvested`, and `avgSportBet` are all undercount.

**Impact:** `avgSportBet` and `sportBetCount` are potentially wrong for any wallet with >50 total closed positions. `sportPnlTotal` and `sportROI` are NOT affected (they come from the leaderboard, not position sums).

**Fix:** Change `limit=500` to `limit=50` and adjust the break condition to `if (page.length < 50) break` to properly paginate.

**STALE: `sportRecord` and `perSport` only exist on 2 wallets** (not 291 as previously documented). The previous `buildProfile()` version that computed W/L was replaced — the current version only counts sport markets and invested amounts. These fields are carried forward from old data and cover almost nobody.

**STALE: `sportWinRate` field** — only 2 wallets have it. The doc's claim of "291/500" was from an older dataset. Cannot be used for ranking without restoration.

### What's Trustworthy Today

| Field | Source | Accuracy | Coverage |
|-------|--------|----------|----------|
| `sportPnlTotal` | Leaderboard `category=SPORTS` `pnl` | **Authoritative** — Polymarket's official number | 500/500 |
| `sportROI` | `(leaderboard pnl / leaderboard vol) * 100` | **Correct** — both inputs from same API | 500/500 |
| `overallPnl` | Leaderboard `category=OVERALL` `pnl` | **Authoritative** | 500/500 |
| `vol` | Leaderboard `category=SPORTS` `vol` | **Authoritative** | 500/500 |
| `name` | Leaderboard `userName` | **Correct** | 500/500 |
| `sportMarkets` | Position title keyword matching | **Undercount** for high-volume wallets (50-position cap bug) | 500/500 (all have it, values may be low) |
| `sportBetCount` | Position counting | **Undercount** — same 50-position cap | 500/500 |
| `avgSportBet` | `sportInvested / sportPositionCount` | **Possibly inaccurate** — derived from undercounted positions | 500/500 |
| `monthlyPnl` | Monthly SPORTS leaderboard `pnl` | **Authoritative** | Monthly-hot wallets only |

### What Needs to Be Built / Fixed Before Facelift

| Item | Type | Blocking? |
|------|------|-----------|
| Fix closed-positions pagination (limit=50 not 500) | **Bug fix** | Yes — affects sportBetCount, avgSportBet, sportMarkets |
| Restore W/L computation in `buildProfile()` | **New code** | Yes — no win rate without it |
| Store `rank`, `profileImage`, `xUsername` from leaderboard | **Trivial change** — expand line 112-117 | No |
| Add WEEK + DAY leaderboard fetches | **New code** — copy existing `fetchLeaderboard()` | No |
| Fetch + store recent resolved sport bets | **New code** — moderate pagination work | No |

---

## Sharp Vault Facelift — Plans & Ideas

### What the Vault Shows Today

The current Vault has three sections:

1. **Header stats** — Elite sharp count, combined P&L, avg ROI, active today count
2. **Today's Convergence** — Games where 2+ top-10 sharps align on the same side (name, sport P&L, invested amount)
3. **Leaderboard** — Top 10 sorted by sport P&L with expandable cards showing:
   - 6-stat grid: Sport P&L, Overall P&L, Volume, ROI, Avg Bet, Sport Bets
   - Sport Activity breakdown (market counts per sport)
   - Live Positions (today's bets with game, side, invested, entry price, current P&L)

### What's Missing / What Users Would Want

| Gap | Why It Matters |
|-----|---------------|
| No W/L record | Can't see actual win rate — P&L alone doesn't tell you if they grind small edges or swing big |
| No recent results | No accountability — "did this sharp just win 8 of 10, or lose 6 straight?" |
| No trending/form | A sharp +$2M lifetime could be down $100K this month — no way to know |
| No leaderboard rank | "#4 sports bettor on Polymarket" is an instant credibility signal |
| No per-sport P&L | Sport Activity shows market counts but not profit per sport |
| No profile enrichment | No avatar, no Twitter link, no verified badge — feels anonymous |
| No position adds signal | Can't tell if a sharp doubled down or just held |
| Static sort only | Leaderboard is always by all-time P&L — can't sort by ROI, win rate, recent form |
| No historical performance | No chart/sparkline of how P&L has trended over time |

---

### Phase 1: Data Enrichment (Backend — `seedSportsSharps.js`)

These changes add new fields to `sports_sharps.json` without touching the UI.

#### 1A. Restore W/L Record for All 500 Wallets

**Status:** 291/500 have it, rest are stale-protected gaps.

Fix `buildProfile()` to compute from closed positions on every refresh:

```javascript
// For each closed sport position:
if (curPrice >= 0.95) sportRecord.won++;
else if (curPrice <= 0.05) sportRecord.lost++;
// Compute: sportWinRate = won / (won + lost) * 100
```

**New fields:** `sportRecord.won`, `sportRecord.lost`, `sportWinRate` (all 500)

#### 1B. Add Weekly + Daily Leaderboard Fetches

```javascript
const weeklyLb = await fetchLeaderboard('WEEK', 1500, 'SPORTS');
const dailyLb  = await fetchLeaderboard('DAY', 1500, 'SPORTS');
```

Cross-reference against our 500 wallets. Store:

```javascript
weeklyPnl, weeklyVol, weeklyROI
dailyPnl, dailyVol, dailyROI
```

**Cost:** ~30 seconds extra runtime. Enables "Hot This Week" and "Hot Today" sort modes.

#### 1C. Store Leaderboard Rank

Already returned in the `rank` field of leaderboard responses — just not stored. Save:

```javascript
leaderboardRank       // from ALL/SPORTS response
weeklyRank            // from WEEK/SPORTS response
```

**Cost:** Zero extra API calls. Enables "#4 Sports Bettor" badge.

#### 1D. Recent Resolved Sport Bets (Biggest Lift)

For each wallet (or top N), fetch recent closed sport positions:

```javascript
GET /closed-positions?user={addr}&sortBy=TIMESTAMP&sortDirection=DESC&limit=50
```

Filter to sport-keyword matches, store last 10–20 with:
- Game title, sport, side taken
- Entry price (`avgPrice`), tokens bought (`totalBought`), realized P&L (`realizedPnl`)
- Win/loss (curPrice ≥ 0.95 = won, ≤ 0.05 = lost)
- Timestamp

**New field:** `recentResults: [{ title, sport, side, entryPrice, invested, realizedPnl, won, timestamp }, ...]`

**Cost:** Moderate — max 50 per page, need pagination for active wallets. Could limit to top 50 wallets to stay within rate limits, or stagger across runs.

#### 1E. Profile Enrichment (Trivial)

Already in leaderboard responses, just not stored:

```javascript
profileImage   // avatar URL
xUsername       // Twitter/X handle  
verifiedBadge  // boolean
```

#### 1F. Per-Sport P&L (from perSport restoration)

Once 1A restores W/L computation, `perSport` also gets per-sport P&L, W/L, ROI, avg bet. This enables:
- "Best NHL bettor: +$450K, 62% WR"
- Sport-specific leaderboard sorts

---

### Phase 2: Vault UI Facelift

#### 2A. Enhanced Leaderboard Row (Compact View)

Current: `Rank | Name | Sport P&L | ROI | Avg Bet | Sport Bets`

Proposed: `Rank | Name + Badge | Sport P&L | W/L Record | WR% | Form Indicator | ROI`

| Element | Data Source | Example |
|---------|-----------|---------|
| Leaderboard rank badge | `leaderboardRank` | `#4` with trophy icon for top 10 |
| Profile avatar | `profileImage` | Small circular image or default icon |
| Verified badge | `verifiedBadge` | ✓ checkmark next to name |
| W/L Record | `sportRecord` | `187-142` |
| Win Rate | `sportWinRate` | `56.8%` with color coding |
| Form indicator | `weeklyPnl` | `🔥 +$52K this week` or `📉 -$18K this week` |

#### 2B. Sort Mode Selector

Add a sort dropdown/toggle above the leaderboard:

| Sort Mode | Sorts By | Filter |
|-----------|---------|--------|
| All-Time P&L | `sportPnlTotal` desc | Default (current behavior) |
| Best ROI | `sportROI` desc | Min 20 sport bets |
| Best Win Rate | `sportWinRate` desc | Min 30 sport bets |
| Hot This Week | `weeklyPnl` desc | Only wallets with weekly data |
| Hot Today | `dailyPnl` desc | Only wallets with daily data |
| Biggest Bettors | `avgSportBet` desc | — |
| By Sport | `perSport[sport].pnl` desc | Sport filter active |

When sport filter is active (e.g., "NHL"), sort by that sport's P&L instead of total.

#### 2C. Enhanced Expanded Card

Current expanded card shows: 6 stats + sport activity + live positions.

**Add these sections:**

**Recent Results (from Phase 1D):**
```
RECENT SPORT BETS                    Last 10: 7W-3L
─────────────────────────────────────────────────
✅ Lakers vs Celtics (NBA)    +$2,100   2d ago
❌ Yankees vs Red Sox (MLB)   -$1,500   3d ago
✅ Oilers vs Stars (NHL)      +$3,200   3d ago
...
```

**Trending Performance:**
```
FORM                    LEADERBOARD
This Week: +$52,100     Rank: #4 (Sports)
This Month: +$187,400   Peak: #2 (last month)
```

**Per-Sport P&L Breakdown (replace plain market counts):**
```
SPORT BREAKDOWN
NBA  $+890K  142 bets  58.2% WR  +4.1% ROI
NHL  $+450K   98 bets  55.6% WR  +3.8% ROI
MLB  $+220K   67 bets  52.4% WR  +2.1% ROI
```

**Profile Link (if xUsername exists):**
```
@sharpbettor42 on X  |  View on Polymarket →
```

#### 2D. Enhanced Convergence Cards

Current: Name + sport P&L + invested amount.

Add:
- Win rate next to each sharp's name
- Recent form dot indicator (last 5: ●●●○● = 3-2)
- Combined W/L: "These 3 sharps are 14-6 (70%) on NHL this season"

#### 2E. Vault Header Enhancement

Current: Elite Sharps count, Combined P&L, Avg ROI, Active Today.

Add/replace:
- **Combined Win Rate** across all vault sharps
- **Combined Weekly P&L** — how the top 10 did this week collectively
- **Best Performer This Week** — name + weekly P&L highlight

---

### Phase 3: Advanced Features (Future)

#### 3A. Sharp Performance Tracking Over Time

Store `pnlHistory` snapshots (weekly or daily) for vault sharps. Display as a sparkline or mini-chart in the expanded card showing P&L trajectory over last 30 days.

**Implementation:** Add a `pnlHistory: [{ date, sportPnl, weeklyPnl }]` array to each wallet in `sports_sharps.json`, appended on each `seedSportsSharps.js` run.

#### 3B. Portfolio Value / Bankroll Context

```javascript
GET /value?user={addr}
// Response: { value: 523000 }
```

Show "Betting $50K with a $520K bankroll" — reveals whether a position is a small allocation or an all-in.

#### 3C. Position Conviction Signals

Already available in the API but unused:

| Signal | Source | Display |
|--------|--------|---------|
| Added to position | `totalBought > size` | "Added 3x" badge |
| Position % P&L | `percentPnl` | "+12.5% on this bet" |
| Time to resolution | `endDate` | "Resolves in 4h" |
| Market link | `slug` / `eventSlug` | "View on Polymarket →" |

#### 3D. Top Holders Discovery

```javascript
GET /holders?market={conditionId}
```

For each game's Polymarket market, see the top holders. Could discover new wallets not on our tracked list but with massive positions on specific games. Would require mapping our game keys to Polymarket conditionIds (available from Gamma API events).

#### 3E. Sharp Alert System

When a top-10 vault sharp takes a new position on today's game, trigger a notification or highlight. Detectable by comparing `scanSharpPositions` output across runs (positions that didn't exist in the previous scan).

---

### Implementation Priority

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| **P0** | 1A: Restore W/L record (all 500) | Low | Unlocks win rate display everywhere |
| **P0** | 1E: Store profileImage, xUsername, verifiedBadge | Trivial | Instant visual upgrade |
| **P0** | 1C: Store leaderboard rank | Trivial | "#4 Sports Bettor" badge |
| **P1** | 1B: Weekly + Daily leaderboard | Low | Enables trending/form sort |
| **P1** | 2A: Enhanced leaderboard row | Medium | Main visual facelift |
| **P1** | 2B: Sort mode selector | Medium | Power user feature |
| **P2** | 1D: Recent resolved sport bets | Medium | Accountability / recent results |
| **P2** | 2C: Enhanced expanded card | Medium | Deep-dive richness |
| **P2** | 2D: Enhanced convergence cards | Low | Better convergence context |
| **P3** | 3A: P&L history sparklines | Medium | Trending visualization |
| **P3** | 3B: Portfolio value | Low | Bankroll context |
| **P3** | 3C: Position conviction signals | Low | Bet-level detail |

**See also:** `POLYMARKET_API_REFERENCE.md` — full endpoint schemas, unused fields, and implementation ideas.
**See also:** `WALLET_INTELLIGENCE_SYSTEM.md` — complete data pipeline documentation.
