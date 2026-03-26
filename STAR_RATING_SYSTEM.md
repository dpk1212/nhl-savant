# Sharp Flow — Star Rating, Bet Recommendation & Unit Sizing System

## Overview

The star rating is the **single source of truth** for every decision in Sharp Flow:
- Whether a play gets **locked** (auto-tracked)
- How many **units** to risk
- How it's **categorized** in performance tracking

Stars are not a separate visual layer — they ARE the system. What you see on the card is exactly what drives the bet.

---

## The Star Rating Model

Every play is scored using a **proprietary weighted signal model** that evaluates multiple dimensions of sharp activity, market pricing, and directional momentum. Signals are assigned different weights based on their predictive value and combined into a composite score, which is then mapped to a **0.5–5.0 star conviction rating**.

### What the Model Evaluates

The model considers a range of real-time inputs including — but not limited to:
- **Sharp bettor activity** — the volume and concentration of professional wallets on a side
- **Capital deployment** — how much money is behind a position, not just how many bettors
- **Market pricing signals** — where the sharpest sportsbook in the world has its line, and whether it's moving
- **Expected value** — whether the best available retail price offers an edge over true fair value
- **Consensus direction** — how aligned or divided sharp activity is across both sides
- **External market indicators** — corroborating signals from prediction and exchange markets

Each of these dimensions carries a different weight. Some signals are far more predictive than others, and the model reflects that.

### Star-to-Label Mapping

| Stars | Label | Meaning |
|-------|-------|---------|
| ★★★★★ (5.0) | **ELITE PLAY** | Maximum conviction — all signals aligned |
| ★★★★½ (4.5) | **ELITE PLAY** | Near-perfect signal alignment |
| ★★★★ (4.0) | **STRONG PLAY** | High conviction across multiple dimensions |
| ★★★½ (3.5) | **STRONG PLAY** | Above-average conviction with confirming signals |
| ★★★ (3.0) | **SOLID PLAY** | Good sharp support with multiple confirmations |
| ★★½ (2.5) | LEAN | Moderate sharp interest — limited confirmation |
| ★★ (2.0) | DEVELOPING | Early sharp activity — watching for more signals |
| ★½ (1.5) | DEVELOPING | Minimal sharp activity so far |
| ★ (1.0) | MONITORING | Low activity — not yet actionable |
| ½ (0.5) | MONITORING | Minimal data available |

---

## Lock Threshold

A play is **LOCKED IN** (auto-tracked, assigned units, tracked for performance) when it crosses the model's **conviction threshold**.

There are no separate gates or manual overrides. The star rating already accounts for all relevant factors — signal strength, market consensus, volume confidence, and more. If the card shows the play is locked, it met the threshold. If it doesn't, it didn't.

Plays below the threshold are displayed for monitoring but not tracked as recommendations.

---

## Unit Sizing

Units are derived directly from the star rating. Higher-conviction plays receive proportionally larger positions. The system also adjusts unit sizing based on consensus quality — plays with weaker or more divided consensus receive a reduction.

| Conviction Level | Position Size | Description |
|-----------------|--------------|-------------|
| Elite (highest) | Largest | Maximum confidence — full signals aligned |
| Strong | Above average | Multiple strong confirming signals |
| Solid (threshold) | Standard | Meets conviction threshold, base position |

### Consensus Adjustment

After the base size is set, the model applies a consensus-quality adjustment. Plays with dominant consensus keep their full size. Plays with weaker or split consensus are scaled down to reflect the reduced confidence when sharps don't fully agree.

---

## Built-In Safeguards

The model includes safeguards that are baked directly into the star score — not applied as external filters or gates.

### Volume Protection

Plays backed by thin capital receive a scoring penalty. A handful of dollars from a few wallets can be noise, not signal. The model requires meaningful capital commitment before a play can reach the conviction threshold.

### Contested Consensus Protection

When sharp money is roughly split between both sides, the play receives a significant scoring penalty. This is the heaviest safeguard in the model — if sharps themselves disagree, there's no clear directional edge to act on.

These penalties reduce the star count directly, which means you can see their effect reflected in the rating. A play with strong signals but thin volume or contested consensus will display a lower star count and may fall below the lock threshold.

---

## What the Criteria Checklist Means

Each card displays a criteria checklist for transparency. These items are **informational only** — they help you visually assess which signals are present, but they do NOT drive locking or unit sizing. The **weighted star model** (which values some signals more than others) is what actually determines the play's status.

The checklist covers factors like:
- Sharp bettor count
- Expected value edge
- Market-maker confirmation
- Capital invested on the consensus side
- Line movement direction
- External market alignment

Think of the checklist as a "signal dashboard" — useful context, but the star rating is the decision engine.

---

## Performance Tracking

### How Picks Are Stored

Every locked play is saved with:
- **Lock snapshot**: Odds, book, units, stars, and signal data at the moment of lock
- **Peak snapshot**: Updated pregame if the play's conviction increases (more capital flows in, market shifts, etc.)
- **Grading**: Uses peak snapshot for profit/loss calculation after the game

### Conviction-Based Performance Breakdown

The performance tracker groups results by conviction tier:

| Tier | Display |
|------|---------|
| Elite | ★★★★★ ELITE |
| Strong | ★★★★ STRONG |
| Solid | ★★★ SOLID |
| Developing | ★★ DEVELOPING |

This lets you see whether higher-conviction plays outperform lower-conviction ones — the ultimate validation of the rating system.

### Profit Calculation

Standard American odds conversion is used:

```
If odds > 0: profit = units × (odds / 100)
If odds < 0: profit = units × (100 / |odds|)
Loss = −units
```

ROI = (total profit / total units wagered) × 100

---

## Design Principles

1. **Stars are the single source of truth.** No hidden gates, no overrides. What you see is what the system believes.

2. **Penalties are baked in, not bolted on.** Contested consensus and thin volume reduce the star count directly — they don't silently block an otherwise high-rated play.

3. **The model favors confluence.** No single signal can carry a play to the conviction threshold alone. You need multiple confirming factors to reach a lock.

4. **Volume matters.** A small amount of money from a couple of wallets is noise. The system penalizes low-volume plays and rewards heavy investment because professional bettors put more money where they have the most conviction.

5. **The market is the final judge.** Performance is tracked, graded, and displayed transparently. If the star system doesn't predict winners, the numbers will show it.
