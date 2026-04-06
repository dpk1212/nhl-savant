# Sharp Flow — Star Rating V3, Bet Recommendation & Unit Sizing System

## Overview

The star rating is the **single source of truth** for every decision in Sharp Flow:
- Whether a play gets **locked** (auto-tracked)
- How many **units** to risk
- How it's **categorized** in performance tracking

Stars are not a separate visual layer — they ARE the system. What you see on the card is exactly what drives the bet.

---

## The Star Rating Model (V3)

Every play is scored using a **proprietary weighted signal model** that evaluates multiple dimensions of sharp activity, market pricing, and directional momentum. V3 decomposes consensus into **breadth**, **conviction**, and **concentration** — replacing the single blended grade — and adds **counter-sharp detection**, **RLM interaction**, and **CLV tracking**.

### Signal Weights (max ~14.5 points)

| Signal | Max Points | Notes |
|--------|-----------|-------|
| **Sharp Breadth** (quality-weighted) | 3 pts | Tier-weighted wallet diversity. Replaces old blended consensus grade. |
| **Pinnacle Alignment** | 3 pts / -2 penalty | Co-primary signal. Line direction is the most important confirmation factor. |
| **Sharp Conviction** | 1.5 pts | log-dollar per wallet, normalized. Captures per-wallet sizing. |
| **Concentration Penalty** | 0 to -1.5 pts | When one wallet dominates >60% of consensus money. |
| **Counter-Sharp Penalty** | 0 to -2 pts | When ELITE/SHARP-tier wallets are on the opposing side. |
| **EV Edge** | 3.5 pts max | Steep 4-tier curve. Strongest predictive signal. |
| **Prediction Market** | up to 1.5 pts | Conditional on consensus tier (LEAN/CONTESTED benefit most). |
| **RLM Interaction** | up to 1.5 pts | Public opposes + line confirms sharps = upgrade. |
| **Flip Penalty** | 0 to -2 pts | Opposing side already locked at peak. |

---

## Phase 1: Decomposed Consensus — `computeSharpFeatures()`

### What changed

The old `consensusGrade` function blended money% and wallet% into a single label (DOMINANT/STRONG/LEAN/CONTESTED). This obscured three distinct phenomena:
- **Breadth**: How many quality wallets agree?
- **Conviction**: How much are they betting per wallet?
- **Concentration**: Is one whale driving the entire position?

### How it works

`computeSharpFeatures(positions, consensusSide)` computes from raw position data:

- **breadth**: Quality-weighted unique wallet count on consensus side. ELITE=3x, SHARP=2x, PROVEN=1.5x, ACTIVE=1x. Normalized against max possible (if all wallets were ELITE).
- **conviction**: `log10(avgInvestedPerWallet)` normalized to 0–1. $100 avg = 0, $10K avg = 1.
- **concentration**: `maxSingleWalletInvested / totalConsensusInvested`. Penalty triggers above 60%.
- **counterSharpScore**: ELITE wallets opposing = 3 pts each, SHARP opposing = 2 pts each.

### Scoring

**Sharp Breadth (max 3 pts)**
- breadth ≥ 0.50: +3 pts
- breadth ≥ 0.35: +2 pts
- breadth ≥ 0.20: +1 pt
- breadth ≥ 0.10: +0.5 pts

**Sharp Conviction (max 1.5 pts)**
- conviction ≥ 0.80: +1.5 pts
- conviction ≥ 0.50: +1 pt
- conviction ≥ 0.25: +0.5 pts

**Concentration Penalty (0 to -1.5 pts)**
- concentration > 85%: -1.5 pts
- concentration > 70%: -1 pt
- concentration > 60%: -0.5 pts

---

## Phase 2: Counter-Sharp Detection

When ELITE or SHARP-tier wallets are on the opposing side, consensus is less trustworthy regardless of dollar volume.

**Counter-Sharp Penalty (0 to -2 pts)**
- counterSharpScore ≥ 6: -2 pts (multiple elite wallets disagree)
- counterSharpScore ≥ 3: -1 pt (meaningful opposition)
- counterSharpScore ≥ 1: -0.5 pts (minor opposition)

---

## Phase 3: RLM (Reverse Line Movement) as Interaction Term

RLM is only useful WHEN it confirms the wallet signal. It's not a standalone signal.

**Conditions for RLM upgrade:**
- Public tickets < 50% on consensus side
- Ticket divergence ≥ 10 points

**Scoring:**
- Full RLM (public opposes + Pinnacle line moving WITH sharps + divergence ≥ 10): +1.5 pts
- Partial RLM (public opposes + divergence ≥ 10, line not confirmed): +0.75 pts

Data source: `gameFlowMap` built from Polymarket + Kalshi ticket/money flow data.

---

## Pinnacle Alignment (unchanged from V2)

**Pinnacle Alignment (max 3 pts / -2 penalty)**
- Pinnacle confirms + line moving with play: +3 pts
- Pinnacle confirms only (line flat): +1.5 pts
- Line moving with play only: +1.5 pts
- Neutral: 0 pts
- **Line moving against consensus: −2 pts**

Uses opener-to-current odds comparison (not sparkline endpoints) to avoid intraday noise.

---

## Other Scoring (unchanged from V2)

**EV Edge (max 3.5 pts) — strongest predictive signal**
- Above 3%: +3.5 pts (83% WR, +68% ROI historically)
- 2–3%: +2.5 pts
- 1–2%: +1.5 pts
- 0–1%: +0.5 pts (any positive EV = gap exists, no penalty)

**Prediction Market (conditional)**
- LEAN/CONTESTED + pred aligns: +1.5 pts
- STRONG + pred aligns: +0.5 pts
- DOMINANT + pred aligns: +0.25 pts

**Flip Penalty**
- Opposing side peaked at ≥4.5★: −2 pts
- Opposing side peaked at ≥3.5★: −1.5 pts
- Opposing side peaked at ≥3★: −1 pt

---

## Phase 4: CLV (Closing Line Value) Tracking

### What CLV is

The difference between the Pinnacle odds when a pick was locked and the Pinnacle odds at game start (the "close"). Beating the close is the gold-standard measure of sharp betting — more predictive of long-term profitability than win rate.

### How it works

1. **`updateClosingOdds.js`** runs every 15 minutes alongside market data fetches. For each PENDING pick, it reads current Pinnacle odds from `pinnacle_history.json` and writes `closingOdds` / `closingPinnProb` to each side of the pick document. The last write before game start becomes the close.

2. **`betTracking.js`** computes CLV at grading time:
   ```
   lockProb  = impliedProb(sides.<side>.lock.pinnacleOdds)
   closeProb = impliedProb(sides.<side>.closingOdds)
   clv       = closeProb - lockProb  // positive = beat the close
   ```

3. **Performance dashboard** displays:
   - Average CLV per pick
   - CLV-positive rate (% of picks that beat the close)
   - Total CLV-tracked picks

### Firebase document additions

```
sides.<side>.closingOdds: number        // Pinnacle odds at last pre-game sync
sides.<side>.closingPinnProb: number    // Implied probability at close
sides.<side>.result.clv: number         // closeProb - lockProb (computed at grading)
sides.<side>.result.lockProb: number    // Implied prob at lock
sides.<side>.result.closeProb: number   // Implied prob at close
sides.<side>.maxEV: number              // Highest EV ever observed for this side
sides.<side>.maxEVAt: number            // Timestamp when maxEV was recorded
```

---

## Star-to-Label Mapping

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

There are no separate gates or manual overrides. The star rating already accounts for all relevant factors — breadth, conviction, Pinnacle alignment, market pricing, concentration, and more. If the card shows the play is locked, it met the threshold. If it doesn't, it didn't.

---

## Unit Sizing

Units are derived directly from the star rating. Higher-conviction plays receive proportionally larger positions.

| Conviction Level | Star Range | Position Size |
|-----------------|------------|---------------|
| Elite (highest) | ★★★★½–★★★★★ | 3.0–3.5u |
| Strong | ★★★★ | 2.5u |
| Above Average | ★★★½ | 2.0u |
| Solid | ★★★ | 1.5u |
| Threshold | ★★½ | 1.0u |

### Consensus Adjustment

After the base size is set, the model applies a consensus-quality adjustment via `consensusGrade()` (still used for display and unit sizing, not for star scoring). Plays with dominant consensus keep their full size. Plays with weaker or split consensus are scaled down.

---

## Built-In Safeguards

### Pinnacle Opposition Protection

When Pinnacle's line is actively moving against the sharp consensus side, the play receives a **-2 pt penalty**. Historical data shows DOMINANT consensus plays with opposing Pinnacle movement win at only 33.3% with -44.6% ROI.

### Counter-Sharp Protection (V3 NEW)

When ELITE or SHARP-tier wallets are on the opposing side, the play receives up to **-2 pts penalty**. High dollar consensus is less meaningful when the best wallets disagree.

### Concentration Protection (V3 NEW)

When a single wallet accounts for >60% of consensus-side money, the play is penalized up to **-1.5 pts**. One whale doesn't equal consensus.

### RLM Upgrade (V3 NEW)

When public bettors are heavily against the sharp side but the line still moves with sharps (Reverse Line Movement), the play gets up to **+1.5 pts**. This is the strongest possible confirming signal — the market is ignoring the public and moving with informed money.

### EV Edge as Primary Signal

EV edge uses a steep 4-tier curve (+0.5 / +1.5 / +2.5 / +3.5) reflecting its status as the strongest single predictor. No positive EV interval is penalized — any positive EV indicates a Pinnacle-retail gap exists. The system also tracks `maxEV` per side to capture transient EV windows that may close between snapshots.

### Conditional Prediction Market

Prediction market alignment is weighted differently based on consensus tier. Critical for LEAN plays (+1.5 pts). Nearly irrelevant for DOMINANT (+0.25 pts).

---

## Architecture

### Data Pipeline

| Script | Purpose | Schedule |
|--------|---------|----------|
| `snapshotPinnacle.js` | Captures Pinnacle + retail odds | Every 15 min |
| `fetchPolymarketData.js` | Polymarket event data | Every 15 min |
| `fetchKalshiData.js` | Kalshi event data | Every 15 min |
| `scanSharpPositions.js` | Sharp wallet positions | Every 15 min |
| `updateClosingOdds.js` | Closing Pinnacle odds to Firebase | Every 15 min |
| `betTracking.js` | Grading + CLV computation | Firebase Cloud Function |

### Sports Tracked

NHL, CBB, MLB, NBA — all use the same star rating model. Team code maps are maintained per-sport.

---

## Design Principles

1. **Breadth + Pinnacle are co-primary.** Quality-weighted wallet diversity and Pinnacle line direction are the strongest predictors.

2. **Decompose, don't blend.** Breadth, conviction, and concentration are separate signals. Blending them hides important information.

3. **Stars are the single source of truth.** No hidden gates, no overrides. What you see is what the system believes.

4. **Penalties are baked in, not bolted on.** Counter-sharp opposition, concentration risk, Pinnacle opposition, EV traps, and flip situations reduce the star count directly.

5. **Interaction terms > standalone signals.** RLM is only useful when it confirms wallet consensus. Prediction markets are only useful when consensus is weak.

6. **CLV is the ultimate validation.** Beating the closing line consistently is the gold-standard measure of sharp betting edge. Win rate can be noisy; CLV is structural.

7. **Data-driven weights.** Signal weights are validated against historical outcomes and continuously refined.

8. **The market is the final judge.** Performance is tracked, graded, and displayed transparently.
