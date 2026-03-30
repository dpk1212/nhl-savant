# Sharp Flow — Star Rating, Bet Recommendation & Unit Sizing System

## Overview

The star rating is the **single source of truth** for every decision in Sharp Flow:
- Whether a play gets **locked** (auto-tracked)
- How many **units** to risk
- How it's **categorized** in performance tracking

Stars are not a separate visual layer — they ARE the system. What you see on the card is exactly what drives the bet.

---

## The Star Rating Model

Every play is scored using a **proprietary weighted signal model** that evaluates multiple dimensions of sharp activity, market pricing, and directional momentum. Signals are assigned different weights based on their predictive value (validated against historical results) and combined into a composite score, which is then mapped to a **0.5–5.0 star conviction rating**.

### Signal Weights (max 12 points)

The model treats **Consensus** and **Pinnacle Alignment** as co-primary signals. Together they represent 58% of the maximum score. This weighting is driven by historical data analysis of 84 completed picks:

- DOMINANT + Line Moving With: **81.8% WR, +89.9% ROI** (n=11)
- DOMINANT + Line Moving Against: **33.3% WR, -44.6% ROI** (n=6)
- DOMINANT + Pinnacle Confirms: **77.8% WR, +79.4% ROI** (n=9)
- DOMINANT + Pinnacle No: **50.0% WR, -0.5% ROI** (n=8)

| Signal | Max Points | Weight | Rationale |
|--------|-----------|--------|-----------|
| **Consensus Grade** | 4 pts | **33%** | Primary predictor. DOMINANT consensus is the strongest single signal. |
| **Pinnacle Alignment** | 3 pts / -2 penalty | **25%** | Co-primary signal. Line direction is the most important confirmation factor. Without Pinnacle, even DOMINANT consensus is a coin flip. |
| Money Invested | 1.5 pts | 12.5% | Sweet-spot rewarded ($5K–$10K and $50K–$100K outperform). |
| Sharp Count | 1 pt | 8% | Secondary factor. High sharp count alone does not predict wins. |
| EV Edge | 1 pt | 8% | Reduced weight — data shows weak/negative correlation with outcomes. 0–1% trap zone penalty retained. |
| Pred Market | up to 1.5 pts | conditional | Weight varies by consensus tier. Critical for LEAN plays; negligible for DOMINANT. |

### Detailed Scoring

**Consensus Grade (max 4 pts)**
- DOMINANT (avg ≥ 80%): +4 pts
- STRONG (avg ≥ 65%): +2 pts
- LEAN (avg ≥ 55%): +0.5 pts
- CONTESTED (avg < 55%): −2 pts

**Pinnacle Alignment (max 3 pts / -2 penalty)**
- Pinnacle confirms + line moving with play: +3 pts
- Pinnacle confirms only (line flat): +1.5 pts
- Line moving with play only (no structural confirm): +1.5 pts
- Neutral (no data or flat): 0 pts
- **Line moving against consensus: −2 pts** (active penalty — historically the strongest negative predictor)

**Sharp Wallet Count (max 1 pt)**
- 5+ sharps: +1 pt
- 3–4 sharps: +0.5 pts
- 1–2 sharps: +0.25 pts

**Money Invested (max 1.5 pts)**
- $5K–$10K or $50K–$100K (sweet spot): +1.5 pts
- $20K–$35K: +0.75 pts
- $10K+ (other): +0.25 pts
- Below $5K: 0 pts (no penalty)

**EV Edge (max 1 pt)**
- Above 3%: +1 pt
- 1–3%: +0.5 pts
- **0–1%: −0.5 pts** (trap zone — demonstrated value trap in backtest)
- Negative: 0 pts (no penalty)

**Prediction Market (conditional)**
- LEAN consensus + pred aligns: +1.5 pts
- STRONG consensus + pred aligns: +0.5 pts
- DOMINANT consensus + pred aligns: +0.25 pts

**Flip Penalty (opposing side already locked)**
- Opposing side peaked at ≥4.5★: −2 pts
- Opposing side peaked at ≥3.5★: −1.5 pts
- Opposing side peaked at ≥3★: −1 pt

### Star-to-Label Mapping

| Stars | Label | Meaning |
|-------|-------|---------|
| ★★★★★ (5.0) | **ELITE PLAY** | Maximum conviction — all signals aligned |
| ★★★★½ (4.5) | **ELITE PLAY** | Near-perfect signal alignment |
| ★★★★ (4.0) | **STRONG PLAY** | Dominant consensus + confirming signals |
| ★★★½ (3.5) | **STRONG PLAY** | Above-average conviction across multiple signals |
| ★★★ (3.0) | **SOLID PLAY** | Strong consensus with confirming signals |
| ★★½ (2.5) | **SOLID PLAY** | Good consensus support — meets conviction threshold |
| ★★ (2.0) | LEAN | Moderate sharp interest — limited confirmation |
| ★½ (1.5) | DEVELOPING | Early sharp activity — watching for more signals |
| ★ (1.0) | MONITORING | Low activity — not yet actionable |
| ½ (0.5) | MONITORING | Minimal data available |

---

## Lock Threshold

A play is **LOCKED IN** (auto-tracked, assigned units, tracked for performance) when it reaches **2.5 stars or higher**.

There are no separate gates or manual overrides. The star rating already accounts for all relevant factors — consensus strength, Pinnacle alignment, market pricing, volume, and more. If the card shows the play is locked, it met the threshold. If it doesn't, it didn't.

Plays below the threshold are displayed for monitoring but not tracked as recommendations.

---

## Unit Sizing

Units are derived directly from the star rating. Higher-conviction plays receive proportionally larger positions. The system also adjusts unit sizing based on consensus quality — plays with weaker or more divided consensus receive a reduction.

| Conviction Level | Star Range | Position Size |
|-----------------|------------|---------------|
| Elite (highest) | ★★★★½–★★★★★ | 3.0–3.5u |
| Strong | ★★★★ | 2.5u |
| Above Average | ★★★½ | 2.0u |
| Solid | ★★★ | 1.5u |
| Threshold | ★★½ | 1.0u |

### Consensus Adjustment

After the base size is set, the model applies a consensus-quality adjustment. Plays with dominant consensus keep their full size. Plays with weaker or split consensus are scaled down to reflect the reduced confidence when sharps don't fully agree.

---

## Built-In Safeguards

The model includes safeguards that are baked directly into the star score — not applied as external filters or gates.

### Pinnacle Opposition Protection

When Pinnacle's line is actively moving against the sharp consensus side, the play receives a **-2 pt penalty**. This is the heaviest directional safeguard in the model. Historical data shows DOMINANT consensus plays with opposing Pinnacle movement win at only 33.3% with -44.6% ROI. Pinnacle's line reflects the aggregate of all sharp action across global markets — when it disagrees with the tracked wallets, the wallets are usually wrong.

### EV Trap Protection

Low positive EV (0–1%) receives a scoring penalty. Backtesting showed this range has a 31% win rate and is the single largest profit destroyer. The market often prices these as traps. Only mid-to-high EV (>1%) adds conviction.

### Contested Consensus Protection

When sharp money is roughly split between both sides, the play receives a significant scoring penalty (−2 pts). If sharps themselves disagree, there's no clear directional edge to act on.

### Conditional Prediction Market

Prediction market alignment is weighted differently based on consensus tier. For LEAN plays, it's a critical confirming signal (+1.5 pts). For DOMINANT plays, it's nearly irrelevant (+0.25 pts). This reflects the finding that strong consensus doesn't need external confirmation, but weak consensus does.

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
- **Grading**: Uses lock snapshot for profit/loss calculation after the game

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

1. **Consensus + Pinnacle are co-primary.** The model is built around the interaction between sharp consensus and Pinnacle line direction. Historical data shows this combination is the strongest predictor of outcomes by a wide margin.

2. **Stars are the single source of truth.** No hidden gates, no overrides. What you see is what the system believes.

3. **Penalties are baked in, not bolted on.** Pinnacle opposition, contested consensus, EV traps, and flip situations reduce the star count directly — they don't silently block an otherwise high-rated play.

4. **The model favors confluence.** No single signal can carry a play to the conviction threshold alone. Dominant consensus without Pinnacle confirmation is a coin flip; Pinnacle confirmation without consensus is directionless.

5. **Data-driven weights.** Signal weights are validated against historical outcomes. Factors that don't predict wins are downweighted. Factors that inversely predict wins are penalized.

6. **The market is the final judge.** Performance is tracked, graded, and displayed transparently. If the star system doesn't predict winners, the numbers will show it.
