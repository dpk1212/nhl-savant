# Sharp Flow — V1 UI Audit

A complete element-by-element breakdown of every component on every Sharp Flow view.
Purpose: identify what each element shows, why it matters, and where data overlaps exist — to inform V2 reorganization.

---

## Global Header (all views)

| Element | What It Shows | Purpose |
|---------|--------------|---------|
| **Title** | "Sharp Flow" + lightning icon | Page identity |
| **Subtitle** | "Real-time market intelligence across prediction markets" | Context |
| **View Tabs** | SIGNALS · MONEY FLOW · WHALE INTEL | Navigation between the 3 views |
| **Sport Filter** | ALL · CBB · NHL | Filters all data across the active view |

---

## View 1: SIGNALS

**What it's trying to show:** Where money and tickets disagree — the classic "sharp vs public" split. When 80% of tickets are on Team A but 90% of money is on Team B, sharps are loading Team B. This is the broadest view of market activity.

### 1.1 — Headline Metrics (4 stat cards)

| Stat | Data Source | Unique? |
|------|-----------|---------|
| **Market Volume** — Total 24h exchange volume | `polyData` + `kalshiData` | **Unique to Signals** — not shown elsewhere |
| **Trades** — Individual trades sampled | `polyData` + `kalshiData` | **Unique to Signals** |
| **Whale Positions** — Large bets ($500+) detected | `polyData` + `kalshiData` | **DUPLICATED** — Whale count also appears in Whale Intel stat cards and inside WhaleSignalCards |
| **Sharp Signals** — Games where money & tickets disagree | Derived from `filteredGames` | **Unique to Signals** |

### 1.2 — Largest Positions (Top 10 whale trades)

| Element | What It Shows | Why It Matters |
|---------|--------------|----------------|
| **Rank / time badge** | Position rank (by $) or time-ago (by recency) | Quick scan of biggest/latest moves |
| **Dollar amount** | Trade size (e.g., "$990.0K") | Shows conviction — bigger = more important |
| **BUY/SELL badge** | Direction | Are they entering or exiting? |
| **Outcome name** | Which team/side they bet | The actual play |
| **Tier badge** | WHALE ($10K+) / SHARK ($5K+) / SHARP ($1K+) | Sizing context |
| **Game + price + time** | "Away vs Home · @99¢ · 14h ago" | Full context |
| **Sport badge** | NHL / CBB | Sport identification |
| **Toggle: Largest / Most Recent** | Sorts by amount vs timestamp | Different perspectives on flow |

**Data Source:** `polyData` + `kalshiData` (whale trades from each game)
**Unique?** The individual trade list is **unique to Signals**. However, these same trades appear inside expanded WhaleSignalCards and GameFlowCards as `WhaleTradeRow` items. The Largest Positions section is a pre-sorted leaderboard of the same underlying data.

### 1.3 — Sharp Signals (game cards)

Each `SharpSignalCard` shows a game where tickets and money diverge by 10%+.

| Element | What It Shows | Why It Matters |
|---------|--------------|----------------|
| **Matchup header** | "Away vs Home" + sport badge | Game identification |
| **Market odds** | Away/Home implied probability (e.g., "Saints 1.1% · Devils 99.0%") | Raw market pricing |
| **Verdict banner** | "Sharps loading X" — summarizes the divergence | The key takeaway at a glance |
| **REVERSE badge** | When public tickets lean one way but money is heavy the other | Strongest signal type |
| **Split badge** | e.g., "81PT SPLIT" — how far tickets and money diverge | Signal strength |
| **TICKETS flow bar** | Public ticket % with horizontal bar | Shows where the public is |
| **MONEY flow bar** | Money % with horizontal bar + sampled amount | Shows where the money is |
| **Metrics grid** | Volume, Whale #, Whale $, Price Movement, Whale Side | 5 key numbers at a glance |
| **Expandable whale trades** | Individual whale trade rows | Drill into who made the big bets |

**Data Source:** `polyData`, `kalshiData`, `whaleProfiles`
**Unique?** The ticket vs money divergence view is **unique to Signals**. The whale trades inside the expandable section are the same data that feeds Largest Positions and Whale Intel.

### 1.4 — All Games (every game, expandable)

Each `GameFlowCard` is a compact row for every game on the board.

| Element | What It Shows | Why It Matters |
|---------|--------------|----------------|
| **Matchup** | Away vs Home + sport badge | Game identification |
| **Market odds** | Away/Home % | Quick pricing |
| **Money %** | Which side the money is on | The signal |
| **Volume** | Exchange volume | Liquidity/interest |
| **Whales** | Count + total $ | Sharp activity level |
| **Expanded: flow bars** | TICKETS + MONEY bars | Detailed divergence |
| **Expanded: metrics** | Trades, Sample $, Whales, Whale $ | Full breakdown |
| **Expanded: whale rows** | Individual trades | Drill-down |

**Data Source:** `polyData`, `kalshiData`, `whaleProfiles`
**Unique?** This is a **condensed version** of the Sharp Signals data, showing ALL games (not just divergence games). The expanded view contains the same flow bars and whale trades.

---

## View 2: MONEY FLOW

**What it's trying to show:** A visual, comparative chart of where money is flowing across all games at once. Instead of clicking into individual games, you see the proportional money split for every game side by side.

### 2.1 — Headline Metrics (4 stat cards)

| Stat | Data Source | Unique? |
|------|-----------|---------|
| **Sampled Volume** — Total money sampled | `flowGames` | **DUPLICATED** — Same data as "Market Volume" in Signals |
| **Games** — Number of games with flow | `flowGames.length` | **DUPLICATED** — Derived from same game list |
| **Top Destination** — Team receiving most money | Derived from `flowGames` | **Unique to Money Flow** |
| **Reverse Signals** — Count of reverse games | Derived from divergence | **DUPLICATED** — Sharp Signals count is a similar metric |

### 2.2 — Explainer Box

| Element | What It Shows | Why It Matters |
|---------|--------------|----------------|
| **"How to read this chart"** | Instructions for interpreting the flow bars | Onboarding — helps users understand the visualization |

**Unique?** Yes, static instructional content only shown here.

### 2.3 — Flow Rows (one per game)

Each `FlowRow` is a horizontal bar chart row.

| Element | What It Shows | Why It Matters |
|---------|--------------|----------------|
| **Away label** | Team name, money %, dollar amount | Left side of the flow |
| **Away bar** | Proportional width = money % | Visual representation |
| **Center** | Total sampled amount, optional REVERSE label | Context + alert |
| **Home bar** | Proportional width = money % | Visual representation |
| **Home label** | Team name, money %, dollar amount | Right side of the flow |

**Data Source:** `polyData`, `kalshiData`
**Unique?** The horizontal bar visualization is **unique to Money Flow**. However, the underlying data (money %, dollar amounts) is the **exact same data** shown in the TICKETS/MONEY flow bars inside SharpSignalCards and GameFlowCards.

### 2.4 — Key Takeaways Footer

| Element | What It Shows |
|---------|--------------|
| 3 tip cards | "Follow the Money", "Reverse Signals Matter", "Bar Thickness" |

**Unique?** Yes, static educational content.

---

## View 3: WHALE INTEL

**What it's trying to show:** This is the premium intelligence layer — verified sharp wallet positions, sportsbook pricing, EV analysis, and auto-locked plays. It moves beyond "where is money flowing?" to "what are the best bettors on Earth actually betting, and is there an edge?"

### 3.1 — Headline Metrics (4 stat cards)

| Stat | Data Source | Unique? |
|------|-----------|---------|
| **Wallets Tracked** — ELITE + PROVEN count | `whaleProfiles` | **Unique to Whale Intel** |
| **Locked Plays** — Today's locked plays + units | `lockedPicks` (Firebase) | **Unique to Whale Intel** |
| **Pre-Game Record** — All-time W-L + P&L | `allTimePnL` (Firebase) | **Unique to Whale Intel** |
| **+EV Spots** — Actionable mispriced lines | `evSignals` from `whaleSignals` | **Unique to Whale Intel** |

### 3.2 — Sharp Positions Section

This is the core of Whale Intel — one `SharpPositionCard` per game where tracked sharp wallets hold positions.

**Section-level elements:**

| Element | What It Shows | Unique? |
|---------|--------------|---------|
| **Section header** | "Sharp Positions (N games)" | Yes |
| **Sport filter** | All / NHL / CBB buttons | **DUPLICATED** — global sport filter already does this |
| **Context legend** | ELITE / PROVEN / +$5.5M / +EV definitions | Yes — educational |

#### SharpPositionCard — Full Breakdown

Each card is dense with ~12 distinct sections:

| Section | What It Shows | Why It Matters | Unique? |
|---------|--------------|----------------|---------|
| **Header row** | Matchup + LOCKED IN/LIVE LOCK badge + value rating (STRONG VALUE/VALUE/LEAN/MONITOR) | Instant assessment | Value rating is **unique** |
| **Action box** | SHARP CONSENSUS / RECOMMENDED BET, team ML, fair value (Pinnacle implied prob), best retail price + book, +EV % badge | The actual actionable information | Fair value + retail EV is **unique to Whale Intel** |
| **Unit sizing** (locked only) | Risk (units), To Win (units), unit tier (STANDARD/STRONG/MAX) | Sizing guidance | **Unique** |
| **Confidence factors** | Badges: sharp wallets count, invested amount, Pinnacle confirms/opposes, consensus grade (DOMINANT/STRONG/LEAN/CONTESTED + %) | Quick signal summary | Consensus grade is **unique**; wallet count + invested amount overlap with Signals whale data |
| **Lock-in criteria** | 6-item checklist: 3+ sharps, +EV, Pinnacle confirms, $5K+, line moving, pred. market aligns — with ✓/○ and X/6 count | Transparency — shows exactly why a play locks or doesn't | **Unique** |
| **Both Sides battle** | Two panels showing each team's sharp money: invested $, wallet count, lifetime P&L, SHARP SIDE badge, money flow bar with % | Shows how aligned or split the sharps are | **Unique visualization**, but invested $ per side overlaps with Signals money flow |
| **Sparkline: Pinnacle ML** | Line chart of Pinnacle odds movement over 6 hours + "Moving with/against play" | Line movement visualization | **Unique** |
| **Sparkline: Prediction Market** | Line chart of Polymarket price over 24h + "Moving with/against play" | Prediction market trend | **Unique** |
| **Pinnacle Open → Now** | "Open: +111 / -125 Now: +109 / -123" + confirms/opposes | Where the sharp book has moved | **Unique** |
| **Book Prices** | Table: Pinnacle, DraftKings, FanDuel, BetMGM odds | Where to actually bet | **Unique** |
| **Verified Sharps** (expandable) | "X VERIFIED SHARPS" button + Combined P&L; individual position rows: wallet tier, name, total PnL, team, invested @ price | Who exactly is betting and their track record | **Unique to Whale Intel** — the Signals whale trades show different data (trade-level, not position-level) |

### 3.3 — +EV Opportunities Section

Each `WhaleSignalCard` shows a game with positive expected value.

| Section | What It Shows | Why It Matters | Unique? |
|---------|--------------|----------------|---------|
| **Header** | Matchup + signal score (/100) | Signal strength | Signal score is **unique** |
| **+EV box** | "+EV OPPORTUNITY", EV%, BET team ML, best price + book, fair value, whale $ | Actionable bet with edge | **PARTIALLY DUPLICATED** — EV calculation appears in SharpPositionCard too |
| **Signal strength bar** | Score /100 with progress fill | Visual strength indicator | **Unique** |
| **Factor pills** | Contributing signal factors + point values | Why the score is what it is | **Unique** |
| **Book prices** | Book names + odds per side | Where to bet | **DUPLICATED** — same data in SharpPositionCard |
| **Pinnacle movement** | Open vs Now + confirms/opposes | Line movement direction | **DUPLICATED** — same data in SharpPositionCard |
| **Sharp positions block** | "SHARP WALLETS IN" + consensus team + position list | Which sharps are in | **DUPLICATED** — same positions in SharpPositionCard verified sharps section |
| **Whale trades** (expandable) | Individual whale trade rows | Trade-level detail | **DUPLICATED** — same trades in Signals view |

---

## Data Overlap Matrix

Shows which data appears on which view. `●` = primary/unique, `○` = also shown, `—` = not present.

| Data | Signals | Money Flow | Whale Intel |
|------|---------|-----------|-------------|
| Exchange volume | ● | ○ | — |
| Trade count | ● | ○ | — |
| Ticket % per side | ● | — | — |
| Money % per side | ● | ● | ○ (in Both Sides) |
| Money flow bars | ● | ● | ○ (in Both Sides) |
| Individual whale trades | ● | — | ○ (in WhaleSignalCard) |
| Whale count per game | ● | — | ○ (in WhaleSignalCard) |
| Whale $ per game | ● | — | ○ (in WhaleSignalCard) |
| Top 10 largest trades | ● | — | — |
| Reverse signals | ● | ○ | — |
| Price movement (prediction market) | — | — | ● |
| Pinnacle odds + history | — | — | ● |
| Retail book prices | — | — | ● |
| EV edge calculation | — | — | ● |
| Sharp wallet positions | — | — | ● |
| Wallet tiers + P&L | ○ (in trade rows) | — | ● |
| Consensus strength | — | — | ● |
| Lock-in criteria | — | — | ● |
| Unit sizing | — | — | ● |
| Locked plays + record | — | — | ● |
| Both sides battle | — | — | ● |
| Sparklines (Pinnacle + Poly) | — | — | ● |

---

## Key Observations for V2

### Duplication Issues

1. **WhaleSignalCard vs SharpPositionCard** — These two card types show overlapping data for the same game. WhaleSignalCard has: EV, signal score, book prices, Pinnacle movement, sharp positions, whale trades. SharpPositionCard has: EV, criteria checklist, book prices, Pinnacle movement, sparklines, Both Sides, verified sharps. When a game appears in both, users see redundant data in two different formats.

2. **Whale trades appear in 3 places** — Largest Positions (top 10 leaderboard), inside SharpSignalCards (expandable), and inside WhaleSignalCards (expandable). Same underlying trades, different wrappers.

3. **Money flow shown in 3 different ways** — Signals has TICKETS/MONEY flow bars per game, Money Flow has horizontal bar rows, Whale Intel has the Both Sides battle. All show "which side has the money" but with different granularity and framing.

4. **Sport filter exists twice in Whale Intel** — The global sport filter (ALL/CBB/NHL) and the Sharp Positions section has its own All/NHL/CBB filter. These could conflict or confuse.

5. **Book prices + Pinnacle movement** — Shown in both SharpPositionCard and WhaleSignalCard when a game has both.

### Information Architecture Questions for V2

1. **Should Signals and Money Flow be combined?** Money Flow is essentially a visualization of the same data that Signals shows in card form. The "All Games" section in Signals already shows every game with money flow data.

2. **Should WhaleSignalCard be merged into SharpPositionCard?** They share significant data overlap. The signal score + factor system from WhaleSignalCard could be incorporated into SharpPositionCard, creating one definitive card per game.

3. **Should the Largest Positions section live in its own tab or at the top of all views?** It's currently only in Signals but represents global whale activity that's relevant regardless of view.

4. **What's the ideal hierarchy?** Currently: Signals prioritizes divergence, Money Flow prioritizes visual comparison, Whale Intel prioritizes verified sharp positions + actionability. A V2 could establish a single flow: Overview → Game Detail → Action.
