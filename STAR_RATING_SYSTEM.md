# Sharp Flow — Star Rating V7.0 (Σ-driven, LEAN tier)

> **Active system — v7.0 deployed 2026-04-29.** Replaces the v6.6 Hybrid
> Floor. All Sharp Intel game cards and Locked Picks use this. Driven by
> the V6 Full Analysis (`V6_FULL_ANALYSIS.md`, N=104, 4/18–4/28).
>
> Earlier system docs are kept inline below for change-history; the
> active rules are in **§v7.0 floor + ladder** at the top.

## §v7.0 floor + ladder (active 2026-04-29)

```
Lock floor:   Δw ≥ +1  AND  Δq ≥ +1  AND  Δw+Δq ≥ +5
LEAN tier:    Δw ≥ +1  AND  Δq ≥ +1  AND  Δw+Δq ∈ {3, 4}     ← tracked, 0u
MUTED:        otherwise (handled by health engine)

Sub-tiers inside the lock floor:
  ELITE  (Σ ≥ +7)   →  5.0★   ML 4.0u   S+T 2.5u
  LOCKED (Σ = +6)   →  5.0★   ML 3.0u   S+T 2.0u
  LOCKED (Σ = +5)   →  4.5★   ML 2.0u   S+T 1.5u
  LEAN   (Σ = +4)   →  4.0★   0u  (display only)
  LEAN   (Σ = +3)   →  3.5★   0u  (display only)
```

LEAN picks would have locked under the v6.6 Σ ≥ +3 floor but fall short
of the v7.0 Σ ≥ +5 lock floor. They render in the Locked Picks list
with a blue **LEAN · TRACK ONLY** badge replacing the unit chip and a
0u stake — visible enough to monitor cohort regression but never debit
the bankroll.

### Why Σ ≥ +5

Source: `V6_FULL_ANALYSIS.md` (N=104, 11 graded days).

```
ρ(Δw+Δq, flat ROI) = +0.319  ✓ p<.01

Σ ≥ +3 (v6.6 floor) :  N=72   WR 51.4%  flat ROI +12.8%  peak +2.4u
Σ ≥ +5 (v7.0 floor) :  N=31   WR 61.3%  flat ROI +35.2%  peak +5.8u   t≈1.95
Σ ≥ +6              :  N=20   WR 65.0%  flat ROI +42.8%  peak +7.9u
Σ ≥ +7              :  N=11   WR 72.7%  flat ROI +59.0%  peak +6.2u
```

Σ ≥ +5 is the first cumulative cohort to clear t = 1.96 on the flat-PnL
t-test. Σ ∈ {3, 4} is directionally flat (-7% to -29% flat ROI) so we
mute it from sizing but keep it in view as LEAN.

### v7.0 ladder rationale

Ladder B (calibrated). The ELITE bonus on Σ ≥ +7 honors the Path-1 audit
(+9.4u peak, 11-5, 68.8% WR). The 4.5★ S+T bump from 1.25u → 1.50u
matches the cohort cell edge. Bayesian half-Kelly on the Σ ≥ +5 cohort
sits at ~9–10% bankroll; ladder B uses about half of that to cushion
sample size.

---

## Legacy v6.6 (kept for change-history)

> Active 2026-04-20 → 2026-04-29. Replaced by v7.0.

> Backtested on 74 graded V8 picks before ship; see
> [V8_TWO_FACTOR_BACKTEST.md](V8_TWO_FACTOR_BACKTEST.md).

## Overview — the two signals that matter

After a full-sample predictor shoot-out on V8 history, only two factors
separated winners from losers at statistical significance:

1. **Δ_winner** — unique whitelisted (CONFIRMED / FLAT) `{SPORT}` wallets
   supporting the pick minus unique whitelisted wallets opposing it.
2. **Δ_quality** — wallets with `contribution ≥ 30` on the pick side minus
   the same on the other side (whitelist-independent quality filter).

Every other V8 signal (regime, WPS, breadth, concentration, meanBase_F,
maxRoi_F, contribTier) was non-separating or noisy. They are retained on
the pick document as **diagnostic-only** fields.

## Promotion floor — Hybrid Floor (v6.6, 2026-04-27)

```
Δ_winner ≥ +1  AND  Δ_quality ≥ +1  AND  Δw+Δq ≥ +3   →   LOCKED
anything else                                          →   SHADOW
```

The original **Floor G** (`Δw ≥ +1 ∧ Δq ≥ +1`, no sum gate) shipped on
2026-04-22. Forward-tested on 88 shipped picks across 9 graded days
(4/18 → 4/26) it produced **+5.04u peak / +16.8% flat ROI on 53 picks**
— directionally profitable but the `1/+1` sub-cell went **3-5 (37.5% WR,
−35% flat ROI, −2.97u peak)**, the only sub-floor below break-even.

The **Hybrid Floor** drops just that one cell by additionally requiring
`Δw + Δq ≥ +3`. Same 88-pick post-ship sample restricted to the hybrid
gate: **+8.01u peak / +26.0% flat ROI on 45 picks** (~60% more PnL on
15% fewer picks). One-tailed t-test against vig breakeven clears at
p = 0.054 (95% confidence). See `canvases/v6-edge-analysis.canvas.tsx`.

Symmetric mute rules in `evaluatePickHealth` / `reconcileHealth` ensure
that any pick locked at a stronger Δ-state which later decays into the
1/+1 cell mutes (`reasons: ['sum_below_floor']`).

## Two-Factor Vault Star

`dw = Δ_winner`, `dq = Δ_quality`:

```
Elite rule:
  dw ≥ +3                 →  5.0★
  (dw ≥ +2 AND dq ≥ +1)   →  5.0★

Base from dw:
  dw ≤ −2  →  1.0★
  dw = −1  →  1.5★
  dw =  0  →  2.5★
  dw = +1  →  3.5★
  dw = +2  →  4.5★   (falls back here if dq < +1)

Quality adjustment to the base:
  dq ≤ −2  →  −1.0
  dq ≤  0  →  −0.5
  dq ∈ [+1, +2]  →  0
  dq ≥ +3  →  +0.5
```

Star floor 1.0, ceiling 5.0. Star rating is the **display** layer; the lock
decision uses the raw (dw, dq) thresholds directly so adjustments can't
block a legitimate Δw≥+1 promotion.

## Unit ladder (stars → units)

```
ML:            5.0→3.00u | 4.5→2.00u | 4.0→1.25u | 3.5→0.75u | <3.5→0u
Spread/Total:  5.0→2.00u | 4.5→1.25u | 4.0→0.75u | 3.5→0.50u | <3.5→0u

Odds caps (applied after ladder):
  ≥ +200   → cap 0.5u
  +151..+199 → cap 1.0u (ML) / 0.75u (spread/total)
  +100..+150 → cap 2.0u (ML) / 1.0u (spread/total)
```

## Health engine — four rules

In `evaluatePickHealth` the live Δ values determine status:

```
Δ_winner ≤ −2                      →  CANCELLED  (reason: winners_killed)
Δ_winner = −1                      →  MUTED      (reason: winners_faded)
Δ_quality ≤ −3 AND Δ_winner ≤ 0    →  MUTED      (reason: quality_faded)
otherwise                           →  ACTIVE
```

WPS flip and opp-side dominance are retained as diagnostic tags
(`wps_flipped_diag`, `opp_side_stronger_diag`) but never change status
on their own in v6.

## TOP PICK badges

```
Δ_winner ≥ +2  →  SUPER TOP PICK  (filled gold, glow)
Δ_winner ≥ +1  →  TOP PICK        (outlined gold)
```

Δ_quality is reflected in the star/unit, not the badge.

## Firestore stamp (v7.0)

Every side doc carries:

```
v8_walletConsensusVersion: 6
v8_walletConsensusForW / AgW / Delta / Verdict
v8_walletConsensusQualityForT30 / QualityAgT30 / QualityMargin
v8_walletConsensusMuteTriggered / CancelTriggered / PromotionTriggered
v8_vaultStar   (Σ-driven Vault Star, v7.0 ladder)
v8_lockTier    (NEW v7.0: ELITE | LOCKED | LEAN | MUTED)
```

`lockStage` in Firestore stays binary (`LOCKED` / `SHADOW`) — every pick
that passes the v6.6 base (`Δw≥+1 ∧ Δq≥+1 ∧ Σ≥+3`) writes as LOCKED so
LEANs flow into the Locked Picks list. The renderer derives the live
sub-tier (ELITE / LOCKED / LEAN) from current Δw/Δq via
`lockTierFromDeltas` so the badge stays honest if signals decay between
sync and tipoff.

Backfill / restamp is handled by `scripts/backfillWalletConsensus.js`.

---

# Legacy V8 star rating (archived 2026-04-20)

> The sections below describe the V7/V8 walletPlayScore star system that
> preceded the two-factor overhaul. Retained here for historical context
> only — the code paths are no longer active.

## Overview

The star rating was the **single source of truth** for every decision in Sharp Flow:
- Whether a play gets **locked** (auto-tracked)
- How many **units** to risk
- How it's **categorized** in performance tracking

Stars are not a separate visual layer — they ARE the system. What you see on the card is exactly what drives the bet.

---

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| **v5.5 Renderer-Side Whitelist Margin Override** | 2026-04-22 | Renderer `meetsThreshold` gate (lines ~4561, ~4773, ~4909 in `SharpFlow.jsx`) now accepts a 1.0★ side when `decideLockStage(...).promotedBy === 'whitelist'` for the same side, alongside the legacy 2.5★ gate. Without this, `syncPickToFirebase` was never called for sub-2.5★ margin plays so the v5 whitelist promotion path inside the sync function literally never ran. Whitelist-qualified sides are also marked `isLocked = true` regardless of regime, so the sync `useEffect` actually fires. |
| **v5.4 All-Sides Drift + Whitelist Side-Creation + FADING Badge** | 2026-04-22 | `restampDriftedSides()` helper drift-restamps every non-superseded side per sync (not just consensus side); new-side gate allows whitelist-eligible side creation to supersede an existing locked side; UI FADING badge shows whenever any winner is on opposite side. |
| **v5.3 Δ Drift Restamp** | 2026-04-22 | Live-vs-stored Δ check at end of every sync triggers `consensus_drift_restamp` when a new whitelisted sharp arrives or flips sides after peak. |
| **v5.2 Stale-Health Self-Heal** | 2026-04-22 | UI locked-list reconciles `health.status === 'MUTED'` back to `ACTIVE` when reasons are *only* whitelist_fade_* and current verdict is positive/neutral. `backfillWalletConsensus.js` writes the same reset to Firebase. |
| **v5.1 TOP PICK Consolidation** | 2026-04-22 | Single gold ribbon family driven by Δ: `Δ ≥ 2` → Super TOP PICK (filled gold); `Δ === 1 && agW === 0` → Regular TOP PICK (outlined). Replaces earlier regime/fmean composite and PROVEN/SHARP CONSENSUS pills. |
| **v5 Wallet-Consensus Promotion (LEAN_FOR + 1.0★ baseline)** | 2026-04-22 | Universal `WHITELIST_INTERVENTION` (all sports), promotion path opened to `LEAN_FOR` (Δ=+1) with `agW === 0`, `basePickStars` floor lowered from 1.5 → 1.0. Fade actions (Δ=−1 MUTE, Δ≤−2 CANCEL) fire universally. `WHITELIST_CONSENSUS_VERSION = 5`. |
| **V8.3 Wallet-Crew Quality + NEAR_START Elite-Wallet Sizing** | 2026-04-21 | Two additional sizing modifiers stacked onto V8.2 via a single `computeRegimeBonus()` that sums three independent signals (regime, for-side wallet caliber, NEAR_START elite wallet). `meanBase_F ≥ 55 → +0.25u` / `< 50 → −0.25u` applies **everywhere** (regime-agnostic). `NEAR_START` regime additionally bumps `maxRoiN_F ≥ 70 → +0.25u` / `50–70 → −0.25u`. Full stack: max swing ±0.75u (before clamp / odds caps). Evidence: `meanBase_F` was the strongest, cleanest separator in the full V8 sample (N=42) — 71.4% WR / +33.9% ROI at ≥55 vs 30% / −35.6% at <50, monotonic, present in every regime. |
| **V8.2 CLEAR_MOVE Sizing Bonus** | 2026-04-21 | Flat +0.5u added to any pick written while `regime === 'CLEAR_MOVE'` (replaces the old starDelta `topPickBonus` that rarely fired). Applied inside `calculateUnits` / `calculateSpreadTotalUnits` before odds caps, so long-shot variance rules still win. Evidence: CLEAR_MOVE subset was 72.7% WR / +29.5% flat ROI (N=11) and every sub-partition was profitable. |
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

## V8.2 — CLEAR_MOVE Sizing Bonus (2026-04-21)

Stars remain wallet-only. **Sizing** now reflects the one regime with proven edge in V8-era data.

### The rule

```js
clearMoveSizeBonus(regime):
  return  regime === 'CLEAR_MOVE'  ?  +0.5  :  0
```

Applied inside both `calculateUnits` (ML) and `calculateSpreadTotalUnits` (Spread/Total), **before** the existing odds-based variance caps:

```
1. Base units from star ladder
2. + consensusPenalty
3. + regimeBonus            ← V8.2
4. Clamp to [0.5, MAX]      (MAX = 3 for ML, 2 for Spread/Total)
5. Apply odds caps          (+200 → 0.5u, etc.)
```

### Why +0.5u and not more

The data supports two more aggressive bonuses (`meanBase_F ≥ 55` and `contribTier = 'STANDARD'`, both ≈ 80–100% WR inside CLEAR_MOVE) but with N=3 and N=5 respectively. Those stay out of sizing until N grows. **Sub-sample sizes drive the ceiling on how aggressive the bonus can be.**

### What gets removed

The old `topPickBonus` (based on `starDelta ≥ 1.0 AND regime !== 'NO_MOVE'`) is gone from all three sync functions. In practice it fired almost never (star jumps of +1.0 during SHADOW→LOCKED promotion are rare), so regime info was effectively absent from sizing.

### Evidence (V8-era CLEAR_MOVE subset, N=11)

| Metric | CLEAR_MOVE | Not CLEAR_MOVE |
|---|---:|---:|
| WR | 72.7% | 41.9% |
| Flat ROI | +29.5% | −15.0% |
| Weighted ROI | +51.3% | −20.0% |

Every sub-partition of CLEAR_MOVE (by star, contribTier, Δcontribution) was profitable — no rotten cells to mis-size into.

### Examples

| Pick | Old units | New units |
|---|---:|---:|
| 3★ ML, regime = NO_MOVE | 1.0 | 1.0 |
| 3★ ML, regime = CLEAR_MOVE | 1.0 | **1.5** |
| 4★ ML, regime = CLEAR_MOVE | 2.0 | **2.5** |
| 5★ ML, regime = CLEAR_MOVE | 3.0 | 3.0 (ceiling) |
| 3★ SPREAD, regime = CLEAR_MOVE | 0.75 | **1.25** |
| 2.5★ ML, +250 odds, CLEAR_MOVE | 0.5 | 0.5 (odds cap wins) |

---

## V8.3 — Wallet-Crew Quality + NEAR_START Elite-Wallet Sizing (2026-04-21)

V8.2 let **regime** influence sizing. V8.3 lets **wallet-crew caliber** influence sizing on top of regime. The two signals are independent — market confirmation vs. who's riding the side — so they stack.

### The three signals (composed additively)

```js
computeRegimeBonus(regime, v8Scoring, sideKey) =
    clearMoveSizeBonus(regime)                         // market signal (V8.2)
  + qualityBonus(v8Scoring, sideKey)                   // wallet-crew signal
  + nearStartMaxRoiBonus(regime, v8Scoring, sideKey)   // late-money elite signal
```

Result is added to base star units **before** the `[0.5, MAX]` clamp and the long-shot odds caps, so dog-variance rules still win.

### Signal 2 — `qualityBonus` (regime-agnostic, always applies)

`meanBase_F` = average `walletBase` across for-side wallets.

| Bucket | Bonus | Rationale (full V8 sample, N=42) |
|---|---:|---|
| meanBase_F ≥ 55 | **+0.25u** | N=14, WR 71.4%, flat ROI +33.9% |
| meanBase_F 50–55 | 0 | N=8, WR 62.5%, flat ROI +12.1% (neutral) |
| meanBase_F < 50 | **−0.25u** | N=20, WR 30.0%, flat ROI −35.6% |

Holds in **every regime** that had a sample:

| Regime | meanBase_F ≥ 55 |
|---|---|
| CLEAR_MOVE | N=3 · 100% · +73.1% |
| NEAR_START | N=8 · 62.5% · +22.6% |
| SMALL_MOVE | N=3 · 66.7% · +24.5% |

### Signal 3 — `nearStartMaxRoiBonus` (regime-specific to NEAR_START)

`maxRoiN_F` = highest `roiNorm` across for-side wallets.

| Condition | Bonus | Rationale (NEAR_START only, N=22) |
|---|---:|---|
| NEAR_START AND maxRoiN_F ≥ 70 | **+0.25u** | N=11, WR 63.6%, flat ROI +42.6% |
| NEAR_START AND 50 ≤ maxRoiN_F < 70 | **−0.25u** | N=10, WR 20.0%, flat ROI **−60.2%** |
| NEAR_START AND maxRoiN_F < 50 | 0 | N=1, ignore |
| not NEAR_START | 0 | signal weak outside NEAR_START |

### Stacking bounds

| Scenario | Net bonus |
|---|---:|
| CLEAR_MOVE + meanBase_F ≥ 55 | **+0.75u** (best case) |
| CLEAR_MOVE + meanBase_F 50–55 | +0.50u |
| CLEAR_MOVE + meanBase_F < 50 | +0.25u |
| NEAR_START + meanBase_F ≥ 55 + maxRoiN_F ≥ 70 | +0.50u |
| NEAR_START + meanBase_F < 50 + maxRoiN_F 50–70 | **−0.50u** (worst case) |
| NO_MOVE + meanBase_F < 50 | −0.25u |
| any neutral / no-signal | 0 |

Stacked bonus can't exceed the CLEAR_MOVE base move (±0.75u above/below), which keeps one regime from dominating.

### Examples (stacked)

| Pick | Base | Bonuses | Final |
|---|---:|---|---:|
| 3★ ML, CLEAR_MOVE, meanBase_F=62 | 1.0 | +0.5 + 0.25 | **1.75u** |
| 4★ ML, CLEAR_MOVE, meanBase_F=62 | 2.0 | +0.75 | **2.75u** |
| 5★ ML, CLEAR_MOVE, meanBase_F=62 | 3.0 | clamp wins | 3.0u |
| 3★ ML, CLEAR_MOVE, meanBase_F=44 | 1.0 | +0.5 − 0.25 | **1.25u** |
| 3★ ML, NEAR_START, meanBase_F=58, maxRoiN_F=82 | 1.0 | +0.25 + 0.25 | **1.5u** |
| 4★ ML, NEAR_START, meanBase_F=42, maxRoiN_F=62 | 2.0 | −0.25 − 0.25 | **1.5u** |
| 2.5★ SPREAD, NEAR_START, meanBase_F=46, maxRoiN_F=68 | 0.5 | floor wins | 0.5u |
| 3★ ML, NO_MOVE, meanBase_F=44 | 1.0 | −0.25 | **0.75u** |
| 4.5★ ML +315 odds, NEAR_START, high wallets | 0.5 | odds cap wins | 0.5u |

### What we explicitly did NOT encode yet

| Candidate | Status | Re-evaluate when |
|---|---|---|
| `maxRoiN_F ≥ 70 AND meanBase_F ≥ 55` elite-of-elite combo (+0.25u on top) | deferred | N=7 → N≥15 |
| NBA NEAR_START fade | deferred | N=12 → N≥20 |
| contribTier = STANDARD bonus inside CLEAR_MOVE / NEAR_START | deferred | N=4 → N≥10 per regime |
| `stars ≥ 4` as a standalone bonus | rejected | real effect is via regime × wallet-quality, not stars |
| `Δcontribution ∈ (50, 100]` bonus | deferred | N=5 → N≥15 |
| MUTE auto-suppress | deferred | N=0 still |

Each of these lines is tracked weekly by `scripts/signalAcrossFullSample.js` so we can tell when a sub-sample crosses the actionable threshold.

---

## Rollout

V8 applies to **new picks only**. All existing Firebase `sharp_action_positions` retain their V7 star ratings, lock stages, and promoted regimes. No backfill.

V8.1 (contribution-tier promotion), V8.2 (CLEAR_MOVE sizing bonus), and V8.3 (wallet-crew quality + NEAR_START elite-wallet sizing) all roll forward only: pre-V8.1 picks keep their existing `lockStage` / `units` and do not have `contribTier` or `promotedBy` fields. Analysis scripts tolerate this with `?.` access. V8.3 requires no new Firebase fields — both signals derive from `v8Scoring.walletDetails` which is already on every V8-era pick.

---

## Data Sources

All inputs come from `public/sports_sharps.json`:
- `sportROI` → ROI_norm (percentile)
- `sportPnlTotal` / `totalPnl` → PnL_norm (percentile)
- `leaderboardRank` → Rank_norm (re-ranked within universe; ~231 wallets have it, ~269 use fallback)
- `avgSportBet` → SizeRatio denominator
- `invested` (per position) → SizeRatio numerator
