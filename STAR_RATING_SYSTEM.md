# Sharp Flow — Star Rating, Bet Recommendation & Unit Sizing System

## Overview

The star rating is the **single source of truth** for every decision in Sharp Flow:
- Whether a play gets **locked** (auto-tracked)
- How many **units** to risk
- How it's **categorized** in performance tracking

Stars are not a separate visual layer — they ARE the system. What you see on the card is exactly what drives the bet.

---

## The Star Rating Formula

Every play is scored on a **weighted 11-point scale** across 7 signal dimensions, then mapped to a 0.5–5.0 star rating.

### Signal Dimensions & Point Values

| Signal | Condition | Points | Max Possible |
|--------|-----------|--------|-------------|
| **Sharp Wallet Count** | 5+ unique wallets on side | +3 | 3 pts |
| | 3–4 wallets | +2 | |
| | 1–2 wallets | +1 | |
| **Money Deployed** (on consensus side) | $25K+ invested | +2 | 2 pts |
| | $7K–$24.9K invested | +1 | |
| | **Under $7K** | **−1** (penalty) | |
| **EV Edge** (retail beats Pinnacle) | Edge > 3% | +2 | 2 pts |
| | Edge > 0% | +1 | |
| **Pinnacle Direction** | Pinnacle's line confirms play | +1 | 2 pts |
| | Pinnacle line *moving* toward play | +1 | |
| **Consensus Strength** | DOMINANT (80%+ avg of money% + wallet%) | +1.5 | 1.5 pts |
| | STRONG (65–79%) | +1 | |
| | LEAN (55–64%) | +0.5 | |
| | **CONTESTED (below 55%)** | **−1.5** (penalty) | |
| **Prediction Market** | Polymarket price moving with play | +0.5 | 0.5 pts |

**Maximum possible: 11 points**

### How Points Become Stars

```
raw = (points / 11) × 5
stars = round(raw × 2) / 2     ← rounds to nearest 0.5
stars = clamp(stars, 0.5, 5.0) ← floor 0.5, ceiling 5.0
```

### Star-to-Label Mapping

| Stars | Label | Meaning |
|-------|-------|---------|
| ★★★★★ (5.0) | **ELITE PLAY** | Maximum conviction — all signals aligned |
| ★★★★½ (4.5) | **ELITE PLAY** | Near-perfect signal alignment |
| ★★★★ (4.0) | **STRONG PLAY** | Strong conviction — sharps + line movement agree |
| ★★★½ (3.5) | **STRONG PLAY** | Above-average conviction across multiple signals |
| ★★★ (3.0) | **SOLID PLAY** | Good sharp support with confirming signals |
| ★★½ (2.5) | LEAN | Moderate sharp interest — limited confirmation |
| ★★ (2.0) | DEVELOPING | Early sharp activity — watching for more signals |
| ★½ (1.5) | DEVELOPING | Minimal sharp activity so far |
| ★ (1.0) | MONITORING | Low activity — not yet actionable |
| ½ (0.5) | MONITORING | Minimal data available |

---

## Lock Threshold

A play is **LOCKED IN** (auto-tracked to Firebase, assigned units, tracked for performance) when:

```
stars >= 3.0
```

That's it. No separate gates. The star rating already accounts for consensus strength (CONTESTED penalty), volume (under-$7K penalty), and all other factors. If the card shows 3+ stars, it's locked.

Plays below 3 stars are displayed for monitoring but not tracked as recommendations.

---

## Unit Sizing

Units are derived directly from the star rating, with an optional consensus penalty:

| Star Rating | Base Units | Tier Label |
|-------------|-----------|------------|
| ★★★★★ (5.0) | 3.5u | MAX |
| ★★★★½ (4.5) | 3.0u | MAX |
| ★★★★ (4.0) | 2.5u | STRONG |
| ★★★½ (3.5) | 2.0u | STRONG |
| ★★★ (3.0) | 1.5u | STANDARD |

### Consensus Penalty on Units

After the base is set, a penalty is applied based on consensus grade:

| Consensus Grade | Avg (Money% + Wallet%) / 2 | Unit Penalty |
|-----------------|---------------------------|-------------|
| DOMINANT | 80%+ | 0 |
| STRONG | 65–79% | 0 |
| LEAN | 55–64% | −0.5u |
| CONTESTED | Below 55% | −1.0u |

**Final units = clamp(base + penalty, 0.5, 5.0)**

### Example Calculations

**Example 1: Elite NHL Play**
- 7 sharp wallets (+3), $30K on side (+2), +4.2% EV (+2), Pinnacle confirms (+1), line moving with (+1), DOMINANT consensus (+1.5), Polymarket aligns (+0.5) = **11 pts**
- raw = (11/11) × 5 = 5.0 → **★★★★★ ELITE PLAY**
- Units: 3.5u base, DOMINANT penalty 0 → **3.5u MAX**

**Example 2: Solid CBB Play**
- 4 wallets (+2), $8K on side (+1), +1.5% EV (+1), Pinnacle doesn't confirm (+0), line moving with (+1), STRONG consensus (+1), no Polymarket data (+0) = **6 pts**
- raw = (6/11) × 5 = 2.73 → rounds to 2.5 → **but wait**: 2.5 rounds to ★★½ (LEAN) — **NOT locked**

**Example 3: Same play but $12K invested and Pinnacle confirms**
- 4 wallets (+2), $12K on side (+1), +1.5% EV (+1), Pinnacle confirms (+1), line moving with (+1), STRONG (+1), no poly (+0) = **7 pts**
- raw = (7/11) × 5 = 3.18 → rounds to 3.0 → **★★★ SOLID PLAY — LOCKED**
- Units: 1.5u base, STRONG penalty 0 → **1.5u STANDARD**

**Example 4: High stars but CONTESTED**
- 8 wallets (+3), $20K on side (+1), +2% EV (+1), Pinnacle confirms (+1), line moving with (+1), CONTESTED (−1.5), poly aligns (+0.5) = **6 pts**
- raw = (6/11) × 5 = 2.73 → ★★½ → **NOT locked** (CONTESTED penalty dropped it)

---

## Penalties Explained

### Under-$7K Volume Penalty (−1 pt)

When less than $7,000 is invested on the consensus side, the play receives a −1 point penalty. This prevents locking plays backed by only a few hundred dollars of sharp money — thin positions can be noise rather than signal.

**What counts**: Only money on the *consensus side* (the side the system recommends), not total game volume.

### CONTESTED Consensus Penalty (−1.5 pts)

When sharp money is roughly split between both sides (money% + wallet% average below 55%), the play receives a −1.5 point penalty. This is the heaviest penalty in the system because a contested signal means sharps themselves disagree — there's no clear directional edge.

**How consensus is calculated**:
```
moneyPct  = consensus side $ / total game $
walletPct = consensus side wallets / total wallets
average   = (moneyPct + walletPct) / 2
```

| Average | Grade |
|---------|-------|
| 80%+ | DOMINANT |
| 65–79% | STRONG |
| 55–64% | LEAN |
| Below 55% | CONTESTED |

---

## What the 6 Criteria Checklist Means

Each card still displays a 6-item criteria checklist for transparency. These are **informational only** — they do NOT drive locking or unit sizing. The star rating handles that.

| Criteria | What It Checks |
|----------|---------------|
| 3+ Sharp Bettors | At least 3 unique wallets on one side |
| +EV Edge | Best retail price beats Pinnacle fair value |
| Pinnacle Confirms | Pinnacle's line moved toward the consensus side |
| $7K+ on Side | At least $7,000 invested on the consensus side |
| Line Moving With Play | Pinnacle odds trending in direction of the play |
| Pred. Market Aligns | Polymarket price moving toward consensus |

These checkboxes help you visually assess which signals are present, but the **weighted star formula** (which values some signals more than others) is what actually determines the play's status.

---

## Performance Tracking

### How Picks Are Stored

Every locked play (3+ stars) is saved to Firebase with:
- **Lock snapshot**: Odds, book, units, stars, and criteria at the moment of lock
- **Peak snapshot**: Updated pregame if the play's units increase (more money flows in, Pinnacle shifts, etc.)
- **Grading**: Uses peak snapshot for profit/loss calculation after the game

### Star-Based Performance Breakdown

The performance tracker groups results by conviction tier:

| Tier | Star Range | Display |
|------|-----------|---------|
| 5-Star | 4.5–5.0 | ★★★★★ ELITE |
| 4-Star | 3.5–4.4 | ★★★★ STRONG |
| 3-Star | 2.5–3.4 | ★★★ SOLID |
| 2-Star | 1.5–2.4 | ★★ DEVELOPING |

This lets you see whether higher-conviction plays outperform lower-conviction ones — the ultimate validation of the rating system.

### Profit Calculation

```
If odds > 0: profit = units × (odds / 100)
If odds < 0: profit = units × (100 / |odds|)
Loss = −units
```

ROI = (total profit / total units wagered) × 100

---

## Design Principles

1. **Stars are the single source of truth.** No hidden gates, no overrides. What you see is what the system believes.

2. **Penalties are baked in, not bolted on.** CONTESTED consensus and thin volume reduce the star count directly — they don't silently block an otherwise high-rated play.

3. **The formula favors confluence.** No single signal can carry a play to 3 stars alone. You need multiple confirming factors (sharps + money + line movement + EV) to reach the lock threshold.

4. **Volume matters.** A few hundred dollars from 2 wallets is noise. The system penalizes low-volume plays and rewards heavy investment because sharp bettors put more money where they have the most conviction.

5. **The market is the final judge.** Performance is tracked, graded, and displayed transparently. If the star system doesn't predict winners, the numbers will show it.
