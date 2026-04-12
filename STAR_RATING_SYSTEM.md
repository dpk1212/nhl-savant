# Sharp Flow — Star Rating V7 (Two-Stage + Two-Sided Overlay)

## Overview

The star rating is the **single source of truth** for every decision in Sharp Flow:
- Whether a play gets **locked** (auto-tracked)
- How many **units** to risk
- How it's **categorized** in performance tracking

Stars are not a separate visual layer — they ARE the system. What you see on the card is exactly what drives the bet.

---

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| **V7 + Two-Sided Overlay** | 2026-04-06 | Two-stage architecture (lock + update formulas), live CLV blending, `qualityProxy` replaces `predictedCLV`, compressed 1–3u ML scale, two-sided features (moneyEdge, marketDominance, signalDisagreement), middle-tier gates |
| V6 | 2026-04-11 (pre-V7) | Trimmed breadth, bumped conviction, conditional Pinnacle, sport-specific bonuses |

---

## The Star Rating Model (V7)

V7 replaces the V6 point-based system with a **weighted z-score model** using frozen population statistics. All continuous features are winsorized and standardized against a frozen 411-pick dataset. The raw score is mapped to stars using fixed percentile thresholds.

### Two-Stage Architecture

V7 uses two distinct scoring formulas depending on market state:

1. **Lock formula** — used when no Pinnacle movement has been observed (initial rating)
2. **Update formula** — used when live Pinnacle movement provides real market evidence

The key insight: `qualityProxy` (formerly `predictedCLV`) is a decent win-rate proxy but a poor CLV predictor. Real Pinnacle movement (`liveCLV`) is a strong CLV predictor. So the system uses `qualityProxy` as a prior at lock time, then progressively replaces it with `liveCLV` as market evidence arrives.

### Frozen Population Statistics (`V7_STATS`)

All z-scoring uses frozen means and standard deviations extracted from the historical dataset. This prevents the scoring distribution from shifting as new picks are added.

```javascript
V7_STATS = {
  avgBet:       { mean: 4162.25, std: 7251.29, lo: 216, hi: 24028.63 },
  invested:     { mean: 27502.21, std: 57067.40, lo: 693.25, hi: 169147 },
  moneyPct:     { mean: 78.17, std: 15.90 },
  walletPct:    { mean: 62.82, std: 16.29 },
  counter:      { mean: 21.72, std: 15.93 },
  sharpCount:   { mean: 5.64, std: 3.38 },
  qp:           { mean: 1.83, std: 1.99 },
  liveCLV:      { mean: 0.0002, std: 0.0303 },
  moneyEdge:    { mean: 1.68, std: 1.37 },
  sharpEdge:    { mean: 1.36, std: 0.71 },
  mktDominance: { mean: 1.55, std: 0.90 },
  againstSC:    { mean: 0.92, std: 1.62 },
}
```

Features are winsorized before z-scoring (`avgBet` and `invested` use `lo`/`hi` bounds; `sharpCount` is capped at 6).

---

## Lock Formula (No Market Movement)

Used at initial lock time when no Pinnacle line movement has been observed yet.

```
rawScore =
  + 3.00 * moneyPct_z
  + 1.50 * avgBet_z
  + 1.20 * invested_z
  + 1.00 * qualityProxy_z
  + 0.80 * sharpCount_z
  + 0.60 * pinnacleConditional
  + 0.40 * evConditional
  - 2.50 * counterSharp_z
  - 1.50 * walletPct_z
  - 2.00 * contradictionPenalty
  + 1.25 * moneyEdge_z          ← two-sided overlay
  + 0.50 * marketDominance_z    ← two-sided overlay
  - 1.25 * signalDisagreement   ← two-sided overlay
  - 0.50 * againstSharpCount_z  ← two-sided overlay
```

### Feature Definitions

| Feature | Description | Weight |
|---------|-------------|--------|
| `moneyPct_z` | Consensus money percentage (z-scored) | +3.00 |
| `avgBet_z` | Average bet per wallet, winsorized + z-scored | +1.50 |
| `invested_z` | Total invested on consensus side, winsorized + z-scored | +1.20 |
| `qualityProxy_z` | Rule-based quality score (win-rate proxy, not CLV) | +1.00 |
| `sharpCount_z` | Sharp count capped at 6, z-scored | +0.80 |
| `pinnacleConditional` | 1 if Pinnacle confirms AND qualityProxy >= 0 | +0.60 |
| `evConditional` | 1 if EV edge > 0 AND qualityProxy >= 0 | +0.40 |
| `counterSharp_z` | Counter-sharp score (z-scored) | -2.50 |
| `walletPct_z` | Wallet percentage (z-scored) — noisy, penalized | -1.50 |
| `contradictionPenalty` | Sum of 3 binary flags (0–3) | -2.00 |
| `moneyEdge_z` | Log ratio of consensus vs opposition money, z-scored | +1.25 |
| `marketDominance_z` | Composite: 0.6 * moneyEdge + 0.4 * sharpEdge, z-scored | +0.50 |
| `signalDisagreement` | 1 if money and sharp edge signs conflict (both sides active) | -1.25 |
| `againstSharpCount_z` | Opposition sharp count (capped at 6), z-scored | -0.50 |

---

## Update Formula (With Live Market Evidence)

Used when Pinnacle line movement has been detected. The CLV input is a time-aware blend of `qualityProxy` and `liveCLV` (see Regime Detection below).

```
rawScore =
  + 3.00 * moneyPct_z
  + 2.00 * clvInput              ← blended CLV signal (replaces qualityProxy_z)
  + 1.50 * avgBet_z
  + 1.20 * invested_z
  + 0.80 * sharpCount_z
  + 0.60 * pinnacleConditional
  + 0.40 * evConditional
  - 2.50 * counterSharp_z
  - 1.50 * walletPct_z
  - 2.00 * contradictionPenalty
  + 1.00 * moneyEdge_z           ← two-sided (lighter)
  + 0.40 * marketDominance_z     ← two-sided (lighter)
  - 1.00 * signalDisagreement    ← two-sided (lighter)
```

No `againstSharpCount_z` in the update formula — liveCLV already subsumes opposition movement pressure.

---

## Two-Sided Features (Overlay)

These features measure **relative strength** between the consensus and opposition sides, not just absolute consensus metrics.

### Computed Inside `rateStarsV7`

```javascript
againstMoneyPct = 100 - moneyPct
moneyEdge       = log((moneyPct + 1) / (againstMoneyPct + 1))
sharpEdgeVal    = log((sharpCount + 1) / (oppSharpCount + 1))
mktDom          = 0.6 * moneyEdge + 0.4 * sharpEdgeVal
disagreement    = 1 if both sides have sharps AND sign(moneyEdge) != sign(sharpEdge)
```

### Why These Features Matter

| Feature | Signal | Analysis Finding |
|---------|--------|-----------------|
| **Money Edge** | Relative money dominance | Triple-monotonic: improves WR, ROI, and CLV across quintiles |
| **Market Dominance** | Composite money + sharp edge | Triple-monotonic, strongest composite signal |
| **Signal Disagreement** | Money says one thing, sharp count says another | 42.3% WR when present vs 56.7% when absent — strong kill signal |
| **Against Sharp Count** | Opposition sharp pressure | Penalizes plays facing meaningful opposition |

---

## Regime Detection & CLV Blending

The system detects how much market movement has occurred and blends CLV signals accordingly.

### Regime Rules

| Regime | Conditions | Blend |
|--------|-----------|-------|
| `NO_MOVE` | No Pinnacle movement detected | 100% `qualityProxy_z` (lock formula used) |
| `SMALL_MOVE` | Pinnacle moved but < 2% probability shift | 25% `qualityProxy_z` + 75% `liveCLV_z` |
| `CLEAR_MOVE` | Pinnacle moved >= 2% probability shift | 10% `qualityProxy_z` + 90% `liveCLV_z` |
| `NEAR_START` | <= 30 min to game AND >= 1% move | 100% `liveCLV_z` |

### `liveCLV` Computation

```
liveCLV = impliedProb(pinnCurrentOdds) - impliedProb(lockOdds)
```

Positive liveCLV means the market has moved in the play's direction since lock — the play is "beating the line."

### `qualityProxy` (formerly `predictedCLV`)

A rule-based score computed from lock-time features only. Renamed because analysis showed it predicts win rate, not CLV. Components:

- Money percentage tiers (+2 / +1 / -1)
- Sharp count vs avg bet interaction (+1.5 / +0.5)
- Counter-sharp level (+1 / -1.5)
- Line movement + Pinnacle confirmation (+1 / +0.5)
- EV edge direction (+0.5 / -0.5)
- Sport-specific odds band adjustments (+0.5)
- Sharp count vs money percentage contradiction (-1)

---

## Contradiction Flags

Three binary contradiction penalties, each contributing 1 point to `contradictionPenalty`:

| Flag | Condition | Meaning |
|------|-----------|---------|
| `moneyCounter` | moneyPct >= 80 AND counterSharp >= 30 | Strong money but strong opposition |
| `sharpsMoney` | sharpCount >= 7 AND moneyPct < 65 | Many sharps but money doesn't follow |
| `evQP` | evEdge > 0 AND qualityProxy < 0 | EV says bet, quality says don't |

---

## Star Mapping (Percentile Thresholds)

The raw score is mapped to stars using frozen percentile thresholds computed from the historical dataset WITH the full formula (including two-sided terms):

| Percentile | Threshold | Stars |
|------------|-----------|-------|
| < p15 | < -10.58 | 1.0 |
| p15–p30 | -10.58 to -5.67 | 2.0 |
| p30–p50 | -5.67 to 0.82 | 2.5 |
| p50–p75 | 0.82 to 7.13 | 3.0 |
| p75–p87 | 7.13 to 8.85 | 3.5 |
| p87–p93 | 8.85 to 10.36 | 4.0 |
| p93–p97 | 10.36 to 13.18 | 4.5 |
| >= p97 | >= 13.18 | 5.0 |

---

## Gates (Post-Score Adjustments)

Gates run after star assignment and enforce structural constraints. They run in order — earlier gates can be overridden by later ones.

### Core Gates

| Gate | Rule | Purpose |
|------|------|---------|
| 5-star quality | 5★ requires qualityProxy >= 1 AND contradictions < 2 | Prevent noisy elite assignments |
| Contradiction cap | 4.5★ capped to 4★ if contradictions >= 2 | Structural disagreement limit |
| Heavy dog cap | Odds >= +200 → max 3★ | Historical: +200 dogs underperform |
| Moderate dog cap | Odds +151 to +199 → max 3.5★ | Moderate dog limit |
| NBA dog cap | NBA + odds >= +100 → max 3.5★ | NBA dogs are 13% WR historically |

### Middle-Tier Two-Sided Gates (New)

These target the 2.5–3.5★ range where the V7 base model had the most noise.

| Gate | Rule | Purpose |
|------|------|---------|
| Disagreement block | If disagreement AND stars >= 4 AND qualityProxy < 2 → 3.5★ | Money/sharp conflict prevents high ratings |
| Weak money edge downgrade | 2.5–3.5★ AND moneyEdge_z <= -0.50 → downgrade 0.5★ | Opposition money dominance demotes |
| Strong money edge promote | 2.5–3.5★ AND moneyEdge_z >= 0.75 AND no contradictions → promote 0.5★ | Clean money dominance promotes |

---

## Star-to-Label Mapping

| Stars | Label | Meaning |
|-------|-------|---------|
| 5.0 | **ELITE PLAY** | Maximum conviction — all signals aligned |
| 4.5 | **ELITE PLAY** | Near-perfect signal alignment |
| 4.0 | **STRONG PLAY** | Dominant consensus + confirming signals |
| 3.5 | **STRONG PLAY** | Above-average conviction across multiple signals |
| 3.0 | **SOLID PLAY** | Strong consensus with confirming signals |
| 2.5 | **SOLID PLAY** | Good consensus support — meets conviction threshold |
| 2.0 | LEAN | Moderate sharp interest — limited confirmation |
| 1.5 | DEVELOPING | Early sharp activity — watching for more signals |
| 1.0 | MONITORING | Low activity — not yet actionable |
| 0.5 | MONITORING | Minimal data available |

---

## Lock Threshold & Minimum Invested Requirements

A play is **LOCKED IN** (auto-tracked, assigned units, tracked for performance) when it meets ALL of the following:

### Moneyline (ML) Picks
- Star rating >= **2.5 stars**
- Total consensus-side invested >= **$7,000**

### Spread Picks
- Star rating >= **2.5 stars**
- Consensus-side wallet count >= **2 wallets**
- Total consensus-side invested >= **$5,000**

### Total (O/U) Picks
- Star rating >= **2.5 stars**
- Consensus-side wallet count >= **2 wallets**
- Total consensus-side invested >= **$5,000**

**These thresholds are enforced in `SharpFlow.jsx` and are MANDATORY. No bet should ever be written to Firebase without meeting these minimums.**

---

## Unit Sizing (V7 — Compressed Scale)

V7 uses a compressed unit scale. Stars determine play quality; units determine risk size.

### ML Unit Sizing (1–3u scale)

| Star Rating | Base Units | Tier |
|-------------|-----------|------|
| 5.0 | 3.0u | MAX |
| 4.5 | 2.5u | MAX |
| 4.0 | 2.0u | STRONG |
| 3.5 | 1.5u | STRONG |
| 3.0 / 2.5 | 1.0u | STANDARD |

Dog caps (ML): +200 -> max 0.5u, +151 -> max 1.0u, +100 -> max 2.0u. Final ML units capped at **3.0u** (down from 5.0u in V6).

### Spread/Total Unit Sizing (0.5–2u scale)

| Star Rating | Base Units |
|-------------|-----------|
| 5.0 | 2.0u |
| 4.5 | 1.5u |
| 4.0 | 1.25u |
| 3.5 | 1.0u |
| 3.0 | 0.75u |
| 2.5 | 0.5u |

Dog caps (Spread/Total): +200 -> max 0.5u, +151 -> max 0.75u, +100 -> max 1.0u. Final spread/total units capped at **2.0u**.

### Unit Tiers

| Tier | Threshold |
|------|-----------|
| MAX | >= 2.5u |
| STRONG | >= 1.5u |
| STANDARD | < 1.5u |

### Top Pick Bonus (CLV-Gated)

When a play's stars increase significantly during pregame updates, a unit bonus is applied — but **only if live market evidence confirms the improvement**:

- `starDelta >= 1.5` AND regime is not `NO_MOVE` -> +0.5u bonus
- `starDelta >= 1.0` AND regime is not `NO_MOVE` -> +0.25u bonus
- If regime IS `NO_MOVE` (no Pinnacle movement) -> no bonus

This prevents fake upgrades from inflating units when there's no market confirmation.

---

## CLV (Closing Line Value) Tracking

### What CLV is

The difference between the Pinnacle odds when a pick was locked and the Pinnacle odds at game start (the "close"). Beating the close is the gold-standard measure of sharp betting.

### How it works

1. **`updateClosingOdds.js`** runs every 15 minutes. For each PENDING pick, it reads current Pinnacle odds and writes `closingOdds` / `closingPinnProb` to the pick document.

2. **`betTracking.js`** computes CLV at grading time:
   ```
   lockProb  = impliedProb(sides.<side>.lock.pinnacleOdds)
   closeProb = impliedProb(sides.<side>.closingOdds)
   clv       = closeProb - lockProb  // positive = beat the close
   ```

3. **Performance dashboard** displays average CLV, CLV-positive rate, and total CLV-tracked picks.

---

## Phase 1: Decomposed Consensus — `computeSharpFeatures()`

### Net-Position Approach

Wallets with positions on both sides are handled via net-position: if a wallet has $1K on one side and $500 on the other, the $500 difference counts on the dominant side.

### What it computes

`computeSharpFeatures(positions, consensusSide)` returns:

- **breadth**: Quality-weighted unique wallet count. ELITE=3x, SHARP=2x, PROVEN=1.5x, ACTIVE=1x.
- **conviction**: `log10(avgInvestedPerWallet)` normalized to 0–1.
- **concentration**: `maxSingleWalletInvested / totalConsensusInvested`. Penalty triggers above 80%.
- **counterSharpScore**: ELITE opposing = 3 pts each, SHARP opposing = 2 pts each.
- **consensusTier**: Blended money% (60%) + wallet% (40%). DOMINANT >= 80, STRONG >= 65, LEAN >= 55, CONTESTED < 55.
- **sportSharpCount**: Wallets with `sportVerified === true` on consensus side.
- **conWalletCount / oppWalletCount**: Raw wallet counts for each side.
- **conTotalInvested / oppTotalInv**: Total invested for each side.
- **conMoneyPct / conWalletPct**: Money and wallet percentages for consensus side.

---

## Firebase Schema — Persisted Fields

Each pick document stores `regime` and `qualityProxy` in lock/peak/pregame snapshots (added in V7). The two-sided features (`moneyEdge`, `marketDominance`, `signalDisagreement`) are **not persisted** — they are computed live from data already in scope.

### Snapshot Fields Added in V7

| Field | Type | Description |
|-------|------|-------------|
| `regime` | string | `NO_MOVE`, `SMALL_MOVE`, `CLEAR_MOVE`, or `NEAR_START` |
| `qualityProxy` | number | Rule-based quality score at time of snapshot |
| `walletProfile` | object | Wallet-level metrics (breadth, conviction, etc.) |

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

NHL, CBB, MLB, NBA — all use the same unified `rateStarsV7` function.

---

## Design Principles

1. **Two-stage scoring.** Lock-time features provide the initial rating. Live market evidence progressively takes over as game time approaches.

2. **Relative strength matters.** The two-sided overlay measures consensus vs opposition, not just absolute consensus metrics. A play with 80% money is stronger when the opposition has 1 sharp than when it has 5.

3. **Stars are the single source of truth.** No hidden gates or overrides beyond minimum invested thresholds. Penalties for contradictions, opposition pressure, signal disagreement, and dog odds are baked directly into the score.

4. **Frozen statistics prevent drift.** All z-scoring uses frozen means/stds from the historical dataset. Thresholds are fixed percentiles of the historical score distribution.

5. **Compressed unit sizing.** ML uses 1–3u, spread/total uses 0.5–2u. Prevents oversized bets on marginal plays.

6. **CLV-gated updates.** The top pick bonus only fires when live Pinnacle movement confirms the star upgrade. No bonus when regime is `NO_MOVE`.

7. **Middle-tier filtering.** The two-sided gates specifically target the 2.5–3.5 star range where historical analysis showed the most noise. Strong money edge promotes, weak money edge demotes, signal disagreement blocks.

8. **Minimum invested thresholds prevent noise.** ML requires $7K, Spread/Total requires $5K. No bet is ever written without meaningful sharp conviction.

9. **Data-driven weights.** Signal weights are validated against 411+ graded picks through ablation tests, walk-forward backtests, and monotonicity analysis.
