# Sharp Flow V2 — Planning Document

## The Vision

Three distinct views, each with a clear identity and zero redundancy:

| View | Identity | Data Scope | User Question It Answers |
|------|----------|-----------|-------------------------|
| **Whale Intel** | Premium curated plays | Top 200 verified wallets ONLY | "What are the best bettors on Earth playing today, and should I tail?" |
| **Sharp Signals** | Broad market divergence | ALL money — every trade, every wallet | "Where does the market disagree with itself?" |
| **Money Flow** | Activity dashboard | ALL volume + dollars | "What's happening right now? Where is money moving?" |

---

## View 1: WHALE INTEL — "The Top Plays"

### Identity
This is the **premium, curated** view. It only shows data from our tracked top 200 wallets — ELITE and PROVEN tier bettors with $25K-$5M+ in verifiable lifetime profit. Every signal here is backed by blockchain-verified positions from the sharpest bettors on the planet.

### 5-Star Rating System (replaces the current mixed VALUE/LEAN/MONITOR + lock-in system)

The idea: every game with sharp wallet activity gets a star rating. Users scan the page, see the stars, and instantly know which plays are strongest.

**Proposed Rating Factors:**

| Factor | Weight | What It Measures |
|--------|--------|-----------------|
| Consensus strength | High | How aligned are the sharps? (DOMINANT/STRONG/LEAN/CONTESTED) |
| Wallet count | High | How many verified sharps are positioned? |
| Capital deployed | Medium | Dollar amount invested by sharps |
| EV edge | High | Does the best retail price beat Pinnacle fair value? |
| Pinnacle confirmation | Medium | Is the sharpest book moving toward the consensus? |
| Line movement direction | Medium | Is the price trending with or against the sharp side? |
| Prediction market alignment | Low | Is Polymarket price confirming? |
| Lifetime P&L of positioned wallets | Medium | Are the sharps on this game the most profitable ones in our pool? |

**Star Mapping Options:**

Option A — Weighted point system (like current `rateValue` but expanded):
```
★★★★★  =  Elite play — 5+ sharps, strong consensus, +EV, Pinnacle confirms, heavy capital
★★★★☆  =  Strong play — 4+ criteria met, good consensus, actionable
★★★☆☆  =  Solid play — clear sharp lean but missing confirmations
★★☆☆☆  =  Monitoring — sharp interest but contested or low capital
★☆☆☆☆  =  Early signal — 1-2 sharps positioned, watching for confirmation
```

Option B — Tiered criteria gates:
```
★★★★★  =  Must have: 4+ sharps, DOMINANT consensus (80%+), +EV, Pinnacle confirms
★★★★☆  =  Must have: 3+ sharps, STRONG consensus (65%+), +EV or Pinnacle confirms
★★★☆☆  =  Must have: 3+ sharps, consensus 55%+
★★☆☆☆  =  Must have: 2+ sharps, any consensus
★☆☆☆☆  =  Must have: 1+ sharp positioned
```

**Decision needed:** Option A is more nuanced but harder to explain. Option B is clearer for users — they know exactly what each star means.

### What Stays from V1

| Element | Keep? | Notes |
|---------|-------|-------|
| SharpPositionCard | **Yes — this is the core** | The primary card format for Whale Intel |
| Both Sides battle | **Yes** | Shows consensus clarity — critical for star rating |
| Lock-in system | **Evolve** | Replace with star system; 4-5 stars = auto-lock |
| Unit sizing | **Yes** | Driven by star rating instead of criteria count |
| Sparklines (Pinnacle + Poly) | **Yes** | Unique to this view, high value |
| Book prices | **Yes** | Users need to know where to bet |
| Verified sharps expandable | **Yes** | Premium feel, shows exactly who is in |
| Criteria checklist | **Replace** | The 6-item checklist becomes the star rating |
| FlowStatCard summary | **Yes** | Update labels for star-based metrics |
| Pre-game record + P&L | **Yes** | Track record builds trust |

### What Gets Removed from Whale Intel

| Element | Why Remove |
|---------|-----------|
| WhaleSignalCard | **Merge into SharpPositionCard** — redundant card type showing overlapping data |
| +EV Opportunities section | **Fold into star rating** — EV is a factor, not a separate section |
| Signal score /100 | **Replace with stars** — simpler, more intuitive |
| Duplicate sport filter | **Remove** — use the global sport filter only |

### New Elements for Whale Intel V2

| Element | What It Shows |
|---------|--------------|
| **Star rating badge** (on each card) | ★★★★☆ with label (e.g., "STRONG PLAY") |
| **"Top Plays" sort** | Sort/filter by star rating — 5-star plays at top |
| **Star breakdown tooltip/expand** | Shows why each star was earned or missed |
| **Explainer banner** | Short description at top: what this page is, what the stars mean, why it's different |
| **Quick-action bar** | For 4-5 star plays: "Bet [Team] ML at [Book] for [Odds]" — one-line summary |

### Proposed Card Layout (V2 SharpPositionCard)

```
┌─────────────────────────────────────────────────────┐
│  🏒 NHL   Wild vs Blackhawks         ★★★★☆ STRONG  │
├─────────────────────────────────────────────────────┤
│  SHARP CONSENSUS            BET AT                  │
│  4 sharps backing           +155                    │
│  Blackhawks ML              FanDuel                 │
│  Fair value: +158 (38.8%)   +2.1% EV               │
│                                                     │
│  Risk: 2.0u  /  To Win: +3.10u  /  STRONG          │
├─────────────────────────────────────────────────────┤
│  WHY THIS RATING                                    │
│  ★ 4 sharp wallets (3+ required)                    │
│  ★ Strong consensus — 97% of sharp money            │
│  ★ $7.2K invested ($5K+ threshold)                  │
│  ★ Pinnacle confirms direction                      │
│  ☆ No +EV edge (retail matches fair value)          │
├─────────────────────────────────────────────────────┤
│  [Both Sides] [Sparklines] [Books] [Sharps ▾]      │
│  (collapsible detail sections)                      │
└─────────────────────────────────────────────────────┘
```

---

## View 2: SHARP SIGNALS — "Where Markets Disagree"

### Identity
This is the **broad market intelligence** view. It looks at ALL money flowing through prediction markets — not just the top 200 wallets. When 80% of tickets are on Team A but 90% of the money is on Team B, something is off. This page surfaces those disagreements.

### What Changes from V1

The current Signals view already does this well. The main changes:

| Change | Why |
|--------|-----|
| **Remove Largest Positions** | Move to Money Flow (it's about volume/activity, not signals) |
| **Remove All Games section** | Move to Money Flow (it's a browse-all view, not a signal view) |
| **Keep Sharp Signals cards only** | This view should ONLY show games with meaningful divergence |
| **Add severity indicator** | How extreme is the disagreement? (e.g., "81pt split" → more visual) |
| **Add context on why it matters** | Brief explainer at top for new users |

### What Stays

| Element | Notes |
|---------|-------|
| SharpSignalCard | Core of this view — ticket vs money divergence |
| REVERSE badge | The strongest signal type |
| TICKETS / MONEY flow bars | The key visualization |
| Verdict banner | "Sharps loading X" |
| Sort/filter controls | Divergence, Volume, Whale $, Most Active |
| Expandable whale trades | Drill into who made the trades |

### What's Different from Whale Intel

| Whale Intel | Sharp Signals |
|------------|--------------|
| Only top 200 verified wallets | ALL market participants |
| Star rating based on verified sharp positions | Signal based on ticket/money divergence |
| Shows Pinnacle odds, EV, book prices | Shows flow bars, divergence %, reverse detection |
| Answer: "Should I bet this?" | Answer: "Something is off here — dig deeper" |
| Actionable (unit sizing, lock-in) | Informational (here's what the market is saying) |

### New Elements for Signals V2

| Element | What It Shows |
|---------|--------------|
| **Explainer banner** | "This page shows ALL market money, not just verified sharps. When tickets and money disagree, smart money is at work." |
| **Divergence severity scale** | Visual: Minor (10-30pt) → Moderate (30-60pt) → Extreme (60pt+) |
| **"Confirmed by Whale Intel" badge** | If a divergence game ALSO has sharp wallet positions, show a link to Whale Intel for that game |

---

## View 3: MONEY FLOW — "The Activity Dashboard"

### Identity
This is the **volume and activity overview**. No analysis, no recommendations — just clean data on where money is moving across all games. Think of it as the Bloomberg terminal view. Users come here to get the full picture at a glance.

### What Changes from V1

| Change | Why |
|--------|-----|
| **Inherit Largest Positions** | Moved from Signals — this is where "biggest trades" belongs |
| **Inherit All Games** | Moved from Signals — this is the "browse everything" view |
| **Keep flow rows** | The horizontal bar chart is the core visualization |
| **Add more stats** | Total volume trending, busiest game, quietest game |

### Proposed Layout

```
┌─────────────────────────────────────────────────────┐
│  SUMMARY STATS                                      │
│  Total Volume │ Games │ Trades │ Whale Activity      │
├─────────────────────────────────────────────────────┤
│  LARGEST POSITIONS  [Largest] [Most Recent]          │
│  1. $990.0K  BUY  Duke  ...                         │
│  2. $49.5K   BUY  Duke  ...                         │
│  ...                                                │
├─────────────────────────────────────────────────────┤
│  MONEY FLOW BY GAME                                 │
│  ┌─ Away ──────── $ ──────── Home ─┐                │
│  │ Saints ████████ $1.1M █ Devils  │                │
│  │ Navy ███████ $884 ██ Wakeforest │                │
│  └─────────────────────────────────┘                │
├─────────────────────────────────────────────────────┤
│  ALL GAMES  [Sort: Volume/Divergence/Whale$/Active] │
│  Compact expandable rows for every game             │
└─────────────────────────────────────────────────────┘
```

### What Stays

| Element | Notes |
|---------|-------|
| FlowRow bars | Core visualization |
| FlowStatCards | Volume, games, top destination |
| How to read explainer | Onboarding for new users |
| Key takeaways footer | Educational |

### What Moves Here (from V1 Signals)

| Element | From | Why It Fits Here |
|---------|------|-----------------|
| Largest Positions (top 10) | Signals | It's about volume/activity, not divergence |
| All Games section | Signals | Browse-all belongs in the activity dashboard |

---

## Cross-View Connections

Games can appear on multiple views with different context. Linking between them adds value:

| Scenario | Connection |
|----------|-----------|
| A game has sharp wallet positions AND a ticket/money divergence | Whale Intel card shows ★ rating; Signals card shows "Also tracked in Whale Intel ★★★★" badge |
| A game has a massive trade in Money Flow | Money Flow shows the trade; tapping it could highlight the game in Signals if there's divergence |
| A play is locked in Whale Intel | Locked play summary visible from all views (in header stats) |

---

## Migration Checklist

### Data that stays where it is
- [x] `polyData` → Signals + Money Flow (exchange volume, trades, flow)
- [x] `kalshiData` → Signals + Money Flow (same)
- [x] `whaleProfiles` → Whale Intel only (verified wallet positions)
- [x] `sharpPositions` → Whale Intel only (top 200 wallet positions)
- [x] `pinnacleHistory` → Whale Intel only (book prices, EV)
- [x] `lockedPicks` → Whale Intel only (Firebase)
- [x] `allTimePnL` → Whale Intel only (Firebase)

### Components to modify
- [ ] `SharpPositionCard` → Add star rating, replace criteria checklist with star breakdown, add quick-action bar
- [ ] `SharpSignalCard` → Add divergence severity, add "Confirmed by Whale Intel" badge
- [ ] `MoneyFlowView` → Add Largest Positions, add All Games section
- [ ] Remove `WhaleSignalCard` → Merge into SharpPositionCard
- [ ] Remove duplicate sport filter from Sharp Positions section

### New components to build
- [ ] Star rating system (`calculateStarRating()` function)
- [ ] Star breakdown display (why each star was earned/missed)
- [ ] Quick-action bar for high-rated plays
- [ ] Explainer banners for each view
- [ ] Cross-view badges ("Also in Whale Intel ★★★★")
- [ ] Divergence severity indicator

---

## Market Maker Detection & Removal

### The Problem

Our top-200 wallet pool includes **market makers (MMs)** — accounts that provide liquidity by continuously posting both buy and sell orders to earn the spread. They are not directional bettors. Their "positions" are noise: they profit regardless of outcome, and tailing them gives us neutral/random signals that dilute real sharp edge.

Public data confirms this: volume leaders on the Polymarket leaderboard are overwhelmingly MMs. The sharps we want are **profit leaders with sport concentration** — specialists crushing NHL/CBB props with directional conviction.

### MM vs Sharp — Behavioral Signatures

| Signal | Market Maker | True Directional Sharp |
|--------|-------------|----------------------|
| **Volume vs P&L** | Extremely high volume ($10M-$180M+) with modest net P&L (spread capture) | Moderate volume with outsized, directional P&L |
| **Buy/Sell balance** | Near-equal buy + sell in same market (often within minutes) | Heavy one-sided conviction ($40K+ buy, no offsetting sells) |
| **Position holding** | Rarely holds large exposure; exits quickly; P&L from many small fills | Holds through volatility, collects big wins/losses at resolution |
| **Trade sizing** | 50%+ of trades under $5K (grinding small edges) | Concentrated larger bets on conviction plays |
| **Win rate** | 45-55% across high trade count (break-even + spread) | 60%+ on their niche sports/markets |
| **Market breadth** | Active in 100+ markets, low sport concentration (generalists) | Focused on specific sports, high concentration |

### MM Likelihood Score

Add an `mmScore` field to each wallet profile. Score 0-100 where higher = more likely MM.

**Scoring factors (each 0-20 points):**

| Factor | MM Signal (high score) | Sharp Signal (low score) | Data Available? |
|--------|----------------------|------------------------|----------------|
| **Volume/PnL ratio** | $10M+ vol with <$500K PnL → 20pts | <$1M vol with >$100K PnL → 0pts | **YES** — `vol` from leaderboard, `totalPnl` from profile |
| **Markets traded breadth** | 100+ markets across many categories → 20pts | <50 markets, sport-focused → 0pts | **YES** — `marketsTraded` from profile |
| **Sport concentration** | <30% of markets in one sport → 20pts | >70% in one sport → 0pts | **YES** — `sportMarkets` from profile |
| **PnL consistency** | Small steady gains (low variance in `pnlHistory`) → 20pts | Lumpy big wins/losses → 0pts | **PARTIAL** — `pnlHistory` has up to 30 snapshots |
| **Position sizing** | Avg position <$5K → 20pts | Avg position >$20K → 0pts | **NEEDS NEW DATA** — requires position-level analysis |

**Thresholds:**
```
mmScore 0-25:   SHARP — include with full weight
mmScore 26-50:  LIKELY SHARP — include, minor down-weight
mmScore 51-75:  SUSPECT MM — exclude from Whale Intel, include in Signals
mmScore 76-100: LIKELY MM — strip entirely from sharp tracking
```

### Implementation Plan

#### Phase 1: Quick Filter (can ship this week)

Modify `buildWhaleProfiles.js` to compute `mmScore` using data we already have:

```javascript
function calculateMMScore(profile, leaderboardEntry) {
  let score = 0;
  
  // Factor 1: Volume/PnL ratio
  const vol = leaderboardEntry?.vol || 0;
  const pnl = Math.abs(profile.totalPnl || 0);
  if (vol > 0 && pnl > 0) {
    const ratio = vol / pnl;
    // MMs: $10M vol / $100K pnl = ratio 100+
    // Sharps: $500K vol / $200K pnl = ratio 2.5
    if (ratio > 50) score += 20;
    else if (ratio > 20) score += 12;
    else if (ratio > 10) score += 5;
  }
  
  // Factor 2: Market breadth
  const markets = profile.marketsTraded || 0;
  if (markets > 200) score += 20;
  else if (markets > 100) score += 12;
  else if (markets > 50) score += 5;
  
  // Factor 3: Sport concentration
  const sportMarkets = profile.sportMarkets || {};
  const totalSportMarkets = Object.values(sportMarkets).reduce((s, v) => s + v, 0);
  const maxSportMarkets = Math.max(...Object.values(sportMarkets), 0);
  const concentration = totalSportMarkets > 0 ? maxSportMarkets / totalSportMarkets : 0;
  if (concentration < 0.3) score += 20;    // generalist → MM
  else if (concentration < 0.5) score += 10;
  // concentration > 0.7 → specialist → sharp, 0 points
  
  // Factor 4: PnL consistency (low variance = MM)
  const pnlHistory = profile.pnlHistory || [];
  if (pnlHistory.length >= 5) {
    const deltas = [];
    for (let i = 1; i < pnlHistory.length; i++) {
      deltas.push(Math.abs(pnlHistory[i].pnl - pnlHistory[i-1].pnl));
    }
    const avgDelta = deltas.reduce((s, d) => s + d, 0) / deltas.length;
    const pnlMag = Math.abs(profile.totalPnl || 1);
    // MMs: tiny consistent deltas relative to total PnL
    // Sharps: big swings
    if (avgDelta / pnlMag < 0.01) score += 20;
    else if (avgDelta / pnlMag < 0.03) score += 10;
  }
  
  return Math.min(score, 100);
}
```

Changes needed:
- `buildWhaleProfiles.js` — Add `mmScore` to each profile, store `vol` from leaderboard data
- `scanSharpPositions.js` — Filter out wallets with `mmScore > 50` (in addition to ELITE/PROVEN filter)
- `SharpFlow.jsx` — Whale Intel only shows wallets with `mmScore <= 50`

#### Phase 2: Deep Analysis (next iteration)

Add a new API call in `buildWhaleProfiles.js` to fetch position-level data:

```
GET /positions?user={wallet}&sortBy=CASHPNL&limit=500
```

For each position, analyze:
- Average position size (small + high frequency = MM)
- Buy/sell ratio within same markets (balanced = MM)
- Hold duration patterns (quick exits = MM)
- Resolution exposure (low open interest at resolution = MM)

Store as additional profile fields: `avgPositionSize`, `buySellRatio`, `holdPatterns`.

#### Phase 3: Ongoing Monitoring

- Add an `mmScore` column to the wallet display in the UI (admin/debug view)
- Flag any newly discovered wallet that scores >50 before it enters the sharp pool
- Periodic re-scoring as more trade data accumulates (MMs sometimes start sharp then shift to MM behavior)

### Impact on V2 Views

| View | How MM filtering applies |
|------|------------------------|
| **Whale Intel** | STRICT — only wallets with `mmScore <= 50`. This is the clean, directional-only view. |
| **Sharp Signals** | LENIENT — all money shown including MM trades (this view is about market-wide divergence, not specific wallets). Could badge MM-flagged wallets differently. |
| **Money Flow** | NO FILTER — shows all volume as-is (this is a raw activity dashboard). |

---

## Open Questions

1. **Star system: weighted points (Option A) or tiered gates (Option B)?**
   - Option A: More granular, can produce half-stars, harder to explain
   - Option B: Clear criteria per tier, users know exactly what earns each star

2. **Should 5-star plays auto-lock, or should locking be manual?**
   - Current: auto-lock at 4+ criteria. V2 could auto-lock at 4-5 stars, or let users manually lock plays they want to track.

3. **Unit sizing: driven by stars or separate calculation?**
   - Current: driven by criteria count + boosters. V2 could map directly: 5★ = 3u base, 4★ = 2u, 3★ = 1u.

4. **Should the Sharp Signals view show whale trades at all?**
   - Pro: Users can see who's driving the divergence
   - Con: Blurs the line between "all money" and "verified sharps"
   - Compromise: Show whale trades but without wallet identification (just amounts + direction)

5. **How prominent should cross-view linking be?**
   - Subtle badge? Clickable link that switches views? Inline preview?

6. **Explainer banners: always visible or dismissible?**
   - First-time users need them, power users might find them noisy
   - Option: Show by default, add "Got it" dismiss that persists in localStorage

7. **MM threshold: hard cutoff or weighted?**
   - Hard cutoff: `mmScore > 50` = excluded entirely from Whale Intel
   - Weighted: MM-suspect wallets still appear but their positions count for less in star ratings / consensus calculations
   - Recommendation: Hard cutoff for V2 launch, weighted for V3 once we have more data to validate the scoring

8. **Should we expose MM detection to users?**
   - Could show "200 wallets tracked, 15 market makers excluded" as a trust indicator
   - Shows users we're curating the pool, not just dumping raw leaderboard data
