# Sharp Flow — Star Rating V8 (Wallet-Contribution System)

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
| **V8.1 Contribution-Tier Promotion** | 2026-04-20 | Additive LOCKED path via `contribTier='STRONG'`; `minInvestedFloor` relaxed to $2.5K for STRONG/STANDARD; per-pick `contribTier` + `promotedBy` written to Firebase; daily `contributionEdgeMap` + `qualifiedSharpDeepDive` workflow |
| **V8 Wallet-Contribution** | 2026-04-16 | Complete overhaul: wallet-first architecture (WalletBase × ConvictionMultiplier), percentile normalization, internal re-ranking, NetEdge/100 side scoring, breadth=2×ln, single-wallet cap, regime decoupled from stars |
| V7.1 + Regime Dampening | 2026-04-15 | Regime-aware update dampening, NO_MOVE star cap, lock baseline tracking |
| V7 + Two-Sided Overlay | 2026-04-06 | Two-stage architecture, live CLV blending, z-score model, two-sided features |
| V6 | 2026-04-11 (pre-V7) | Trimmed breadth, bumped conviction, conditional Pinnacle |

---

## The Star Rating Model (V8)

V8 replaces the V7 z-score model with a **wallet-contribution system**. Instead of scoring aggregated features, V8 scores each individual wallet's quality, scales it by bet-size conviction, and computes a side-vs-side WalletPlayScore.

### Design Principles

1. **ROI drives skill**: ROI is the primary wallet quality signal (60% weight)
2. **Conviction is multiplicative**: Bet size vs average bet size amplifies the signal, not additive
3. **Side-vs-side netting**: Strong wallets on the opposing side reduce confidence
4. **Breadth rewards agreement**: Multiple wallets agreeing earns a bonus, but it's secondary to wallet quality
5. **Concentration penalizes dependency**: One wallet carrying the signal is penalized
6. **Regime is decoupled**: Regime detection still gates lock/shadow, but does not affect the star number

---

## Step 1: WalletBase (per-wallet skill score)

**With external leaderboard rank:**
```
WalletBase_i = 0.60 × ROI_norm + 0.25 × Rank_norm + 0.15 × PnL_norm
```

**Without external rank (fallback for ~54% of wallets):**
```
WalletBase_i = 0.65 × ROI_norm + 0.35 × PnL_norm
```

### Normalization

- **ROI_norm**: Percentile of wallet's `sportROI` across all ~500 tracked wallets (0–100 scale)
- **PnL_norm**: Percentile of wallet's `sportPnlTotal` across all ~500 tracked wallets (0–100 scale)
- **Rank_norm**: `100 × (1 - (internalRank - 1) / (K - 1))`
  - `internalRank` = ordinal position after sorting wallets by their external `leaderboardRank`
  - `K` = count of wallets with external rank (~231)
  - Re-ranked within the tracked universe, not against the global Polymarket leaderboard

### Weight Rationale

- ROI at 60%: purest skill signal, measures edge per dollar risked
- Rank at 25%: captures non-PnL signal from external leaderboard (volume, consistency)
- PnL at 15%: reduced from 25% because rank and PnL are 93% Spearman-correlated (near-duplicate)
- Fallback (65/35): when rank is missing, ROI remains dominant with PnL as support

---

## Step 2: ConvictionMultiplier (per-wallet, per-play)

```
SizeRatio_i = CurrentBet_i / AvgBet_i
ConvictionMultiplier_i = clip(1 + 0.30 × ln(SizeRatio_i), 0.70, 1.60)
```

- Log transform compresses right-skewed bet-size data
- A wallet betting 3× their average gets ConvMult ≈ 1.33
- A wallet betting 0.3× their average gets ConvMult ≈ 0.70 (floor)
- Clipped to [0.70, 1.60] to prevent extreme values

### Validated Distribution (2026-04-16)
- p10 SizeRatio: 0.12 → ConvMult: 0.70 (clipped)
- p50 SizeRatio: 1.18 → ConvMult: 1.05
- p90 SizeRatio: 4.43 → ConvMult: 1.45

---

## Step 3: WalletContribution

```
WalletContribution_i = WalletBase_i × ConvictionMultiplier_i
```

This is the core structural choice: a great bettor betting big-for-them produces a major signal, while an average bettor betting big does not.

---

## Step 4: Side Score (WalletPlayScore)

```
ForSide = Σ WalletContribution_i  (wallets on consensus side)
AgainstSide = Σ WalletContribution_j  (wallets on opposing side)

NetEdge = (ForSide - 0.85 × AgainstSide) / 100
BreadthBonus = 2 × ln(1 + WalletCountFor)
ConcPenalty = concCoeff × TopShare    (concCoeff = 4 if walletCount ≤ 2, else 5)

WalletPlayScore = NetEdge + BreadthBonus - ConcPenalty
```

Where:
- **TopShare** = max(WalletContribution_i) / ForSide  (1.0 if ForSide = 0)
- **0.85 penalty**: opposition wallets are discounted slightly since consensus-side selection already filters
- **NetEdge / 100**: scales net wallet quality to be comparable with breadth and concentration terms
- **BreadthBonus = 2×ln**: reduced from 4× so net wallet quality remains the primary differentiator
- **ConcPenalty = concCoeff × TopShare**: penalizes single-wallet dependency. Coefficient is **4** for ≤2-wallet plays (reduced to avoid structural over-penalizing) and **5** for 3+ wallets

### Validated Component Ranges (2026-04-16)
- NetEdge/100: [-0.2, 3.1]
- BreadthBonus: [1.39, 5.42]
- ConcPenalty: [0.00, 5.00] (4.00 max for ≤2 wallets)

---

## Step 5: Star Conversion

Stars are assigned from WalletPlayScore using calibrated thresholds:

| WPS Threshold | Stars | Label |
|---------------|-------|-------|
| ≥ 7.5 (p98) | 5.0 | ELITE PLAY |
| ≥ 6.0 (p95) | 4.5 | ELITE PLAY |
| ≥ 4.5 (p88) | 4.0 | STRONG PLAY |
| ≥ 3.0 (p78) | 3.5 | STRONG PLAY |
| ≥ 1.5 (p65) | 3.0 | SOLID PLAY |
| ≥ 0.0 (p50) | 2.5 | SOLID PLAY |
| ≥ -3.0 (p30) | 2.0 | LEAN |
| < -3.0 | 1.0 | MONITORING |

Thresholds bootstrapped from 58 live plays (2026-04-16). Will be refined as sample grows.

---

## Step 6: Single-Wallet Rule

**Structural cap**: If `WalletCountFor = 1`, hard cap at 2.5 stars maximum regardless of WPS. Requires WPS ≥ p78 to reach 2.5.

**Whale override exception**: If a single wallet has:
- `invested >= $25,000` AND
- `sportPnl >= $500,000`

Then the cap is raised to 3.5 stars. This override is logged when it fires.

---

## Pick Health Evaluation (WPS-Driven)

The WalletPlayScore is not only used for star assignment — it also drives the **pick health system** that determines whether a locked pick should be muted or cancelled during the pregame window.

**Key rule: WPS >= 0.0 = in lock range = ACTIVE.** A pick's score can drop significantly from its peak, but as long as it remains at or above 0.0 (the 2.5-star threshold), the pick stays active. This prevents false mutes from normal market fluctuation within the lock range.

| Health Status | Trigger |
|---------------|---------|
| **ACTIVE** | WPS >= 0.0 (in lock range), or flip rejected, or near game start |
| **MUTED** | WPS < 0.0 (below lock range) and > 20 min to game |
| **CANCELLED** | Side flipped and new side's WPS exceeds the ratcheting flip threshold |

**Ratcheting flip threshold:** On initial lock, `flipBeatThreshold` = `lockWPS`. Each successful side flip ratchets this threshold up to the new side's WPS, requiring progressively higher scores for subsequent flips. This prevents flip-flop chaos.

See `SHARP_FLOW_SYSTEM.md` for full implementation details, Firebase schema, and decision flow.

---

## Lock Promotion (V8.1 — two additive paths)

As of 2026-04-20, a play becomes **LOCKED** via either of two independent paths:

1. **Regime path (original V8):** market movement confirms the sharp side.
2. **Contribution path (new):** qualified-sharp contribution signal is strong enough on its own.

### Regime Detection

| Regime | Condition | Locks via regime? |
|--------|-----------|-------------------|
| NO_MOVE | No Pinnacle movement | No |
| SMALL_MOVE | `pinnMoveSize > 0` | No |
| CLEAR_MOVE | `pinnMoveSize ≥ 0.02` | Yes |
| NEAR_START | ≤ 60 min to game + move ≥ 0.01 | Yes |

### Contribution Tier

Per-wallet **contribution** = `walletBase × convictionMult` (the quantity already computed inside WPS). For each pick, we count wallets with `contribution ≥ 50` on each side:

- `qFor` = # for-side wallets with contribution ≥ 50
- `qAg` = # against-side wallets with contribution ≥ 50
- `margin = qFor − qAg`
- `maxContrib_F` = highest contribution on the for-side

```
contribTier =
  'MUTE'     if margin < 0
  'STRONG'   if (qFor ≥ 3 AND qAg = 0) OR (qFor ≥ 2 AND margin ≥ +1)
  'STANDARD' if qFor ≥ 1 AND margin ≥ +1 AND maxContrib_F ≥ 50
  'LEAN'     otherwise
```

### Final Lock Decision

```
decideLockStage(regime, v8Scoring, side):
  if regime ∈ {CLEAR_MOVE, NEAR_START}:  return { stage: 'LOCKED', promotedBy: 'regime' }
  if contribTier === 'STRONG':           return { stage: 'LOCKED', promotedBy: 'contribution' }
  return { stage: 'SHADOW', promotedBy: null }
```

### SHADOW Gate

A pick must first pass the SHADOW gate to be written to Firebase at all:

```
stars ≥ 2.5
  AND (Spread/Total only) walletCountFor ≥ 2
  AND consensusInvested ≥ minInvestedFloor(contribTier)

minInvestedFloor('STRONG') = minInvestedFloor('STANDARD') = 2500
minInvestedFloor(_) = 5000
```

The relaxed $2.5K floor for STRONG/STANDARD tiers intentionally promotes more low-dollar, high-quality-sharp picks to SHADOW so they can be monitored and graded.

### MUTE is Data-Only

`contribTier = 'MUTE'` (qualified counter-sharps strictly outnumber qualified backers) is recorded on the pick but **does not automatically suppress display or writing**. The live sample is too small to act on MUTE yet; once the daily `contributionEdgeMap.js` report confirms the edge on more picks, MUTE may graduate to an auto-suppress rule.

---

## Rollout

V8 applies to **new picks only**. All existing Firebase `sharp_action_positions` retain their V7 star ratings, lock stages, and promoted regimes. No backfill.

V8.1 (contribution-tier promotion) also rolls forward only: pre-V8.1 picks keep their existing `lockStage` and do not have `contribTier` or `promotedBy` fields. Analysis scripts tolerate this with `?.` access.

---

## Data Sources

All inputs come from `public/sports_sharps.json`:
- `sportROI` → ROI_norm (percentile)
- `sportPnlTotal` / `totalPnl` → PnL_norm (percentile)
- `leaderboardRank` → Rank_norm (re-ranked within universe; ~231 wallets have it, ~269 use fallback)
- `avgSportBet` → SizeRatio denominator
- `invested` (per position) → SizeRatio numerator
