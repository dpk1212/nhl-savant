# Sharp Intel v6 — Full Analysis

_Auto-generated **6/13/2026, 10:55:16 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 608 shipped+graded picks · 2026-04-18 → 2026-06-12  (HC analyses scoped to post-cutover 2026-04-30, 496 picks)
**Headline:** 305-295-8 · WR 50.8% [46.8%–54.8%] vs 52.4% break-even · -15.2u flat (-2.5%) · -44.3u peak.
**Overall t-test:** t = -0.62 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.012 ✗**  (full sample, N=602)
- **ρ(HC, flat ROI) = -0.029 ✗**  (post-cutover, N=496)
- **ρ(Δw+HC, flat ROI) = -0.056 ✗**  (post-cutover, N=496)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**


### Action map

- **Tier-1a (HC ≥ +2)** — N=41, WR 46.3%, flat ROI -14.1%. Bayesian posterior WR ≈ 47.1%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=154, WR 55.2%, flat ROI +6.4%. Bayesian posterior WR ≈ 54.9%, half-Kelly = **2.6%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=84, WR 45.8%, flat ROI -14.9%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=103, WR 47.6%, flat ROI -4.1%. Bayesian posterior WR ≈ 47.8%, half-Kelly = **0.0%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -9.2% flat ROI on 154 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (0.99u/pick), we need **~1501 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 608. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-06-12 |
| Sides scanned | 1125 |
| Shipped + graded | **608** |
| W-L-P | 305-295-8 |
| Win rate | **50.8%** [46.8%–54.8%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +1.5 pp |
| Peak-units PnL | **-44.3u** |
| Flat-1u PnL | **-15.2u** (-2.5% flat ROI) |
| Flat t-statistic vs zero | -0.62 → ✗ noise |
| Flat 95% CI per-pick | [-0.104, 0.054]u |

### Power note

At our observed flat-PnL standard deviation (0.99u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4168 |
| +5% | 1501 |
| +10% | 376 |

We have **608** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 6 | 2-4-0 | 33.3% [10–70] | -41.9% | -3.3u | -1.14 ✗ noise |
| Δw = −1 | 22 | 6-15-1 | 28.6% [14–50] | -42.8% | -8.5u | -2.25 ✓ p<.05 |
| Δw = 0 | 126 | 64-59-3 | 52.0% [43–61] | -1.8% | +12.3u | -0.21 ✗ noise |
| Δw = +1 | 216 | 117-96-3 | 54.9% [48–61] | +3.9% | +9.3u | 0.60 ✗ noise |
| Δw = +2 | 129 | 63-65-1 | 49.2% [41–58] | -4.7% | -31.8u | -0.54 ✗ noise |
| Δw ≥ +3 | 103 | 49-54-0 | 47.6% [38–57] | -4.1% | -26.2u | -0.37 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.006** ✗  ·  **ρ(Δw, flat ROI) = 0.012** ✗  (N=602)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 1 | 1-0-0 | 100.0% [21–100] | +86.2% | +2.5u | 0.00 ✗ n<2 |
| HC = −1 | 23 | 13-10-0 | 56.5% [37–74] | +16.1% | +9.5u | 0.73 ✗ noise |
| HC = 0 | 277 | 136-134-7 | 50.4% [44–56] | -5.4% | -35.4u | -0.95 ✗ noise |
| HC = +1 | 154 | 85-69-0 | 55.2% [47–63] | +6.4% | +3.1u | 0.80 ✗ noise |
| HC = +2 | 31 | 16-15-0 | 51.6% [35–68] | -0.4% | -4.6u | -0.02 ✗ noise |
| HC ≥ +3 | 10 | 3-7-0 | 30.0% [11–60] | -56.7% | -8.8u | -2.57 ✓ p<.05 |

**Pearson ρ(HC, WIN) = -0.011** ✗  ·  **ρ(HC, flat ROI) = -0.029** ✗  (N=496)

Spearman rank ρ(HC, flat ROI) = 0.003.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 103 | 49-51-3 | 49.0% [39–59] | -6.3% | +4.4u | -0.66 ✗ noise |
| Σ = +1 | 146 | 81-62-3 | 56.6% [48–64] | +7.3% | +11.4u | 0.93 ✗ noise |
| Σ = +2 | 114 | 66-47-1 | 58.4% [49–67] | +8.9% | +5.9u | 1.01 ✗ noise |
| Σ = +3 | 55 | 22-33-0 | 40.0% [28–53] | -21.6% | -15.7u | -1.62 ✗ noise |
| Σ = +4 | 39 | 20-19-0 | 51.3% [36–66] | +0.7% | -10.5u | 0.04 ✗ noise |
| Σ = +5 | 18 | 8-10-0 | 44.4% [25–66] | -15.5% | -12.5u | -0.67 ✗ noise |
| Σ ≥ +6 | 21 | 8-13-0 | 38.1% [21–59] | -29.8% | -16.6u | -1.46 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = -0.043** ✗  ·  **ρ(Σ, flat ROI) = -0.056** ✗  (N=496)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 496.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.052 ✗ | -0.058 ✗ | -0.039 | weak |
| HC margin | -0.011 ✗ | -0.029 ✗ | 0.003 | weak |
| Δw + HC | -0.043 ✗ | -0.056 ✗ | -0.028 | weak |
| peak.stars | -0.041 ✗ | -0.063 ✗ | -0.078 | weak |
| vault.star | -0.056 ✗ | -0.071 ✗ | -0.082 | weak |
| lock.stars | -0.024 ✗ | -0.038 ✗ | -0.043 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 496 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | N=1 · 1-0 · 100% [21–100] · —  | — | — | — | — | — |
| -1 | — | N=1 · 0-1 · 0% [0–79] · —  | N=3 · 2-1 · 67% [21–94] · +42%  | N=6 · 5-1 · 83% [44–97] · +75% ★ | N=7 · 2-5 · 29% [8–64] · -49%  | N=2 · 2-0 · 100% [34–100] · — ★ | N=4 · 2-2 · 50% [15–85] · -1%  |
| +0 | N=1 · 1-0 · 100% [21–100] · —  | N=2 · 0-2 · 0% [0–66] · —  | N=9 · 2-6 · 25% [7–59] · -50%  | N=69 · 35-32 · 52% [40–64] · -1%  | N=118 · 64-51 · 56% [47–64] · +5%  | N=54 · 28-25 · 53% [40–66] · -3%  | N=24 · 6-18 · 25% [12–45] · -54% ✗ |
| +1 | — | — | N=4 · 1-3 · 25% [5–70] · -56%  | N=26 · 15-11 · 58% [39–74] · +7%  | N=55 · 35-20 · 64% [50–75] · +21%  | N=34 · 16-18 · 47% [31–63] · -5%  | N=35 · 18-17 · 51% [36–67] · +1%  |
| +2 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | N=3 · 1-2 · 33% [6–79] · -40%  | N=11 · 5-6 · 45% [21–72] · -7%  | N=16 · 9-7 · 56% [33–77] · +8%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | — | N=3 · 1-2 · 33% [6–79] · -50%  | N=6 · 1-5 · 17% [3–56] · -76% ✗ |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 1 | 1-0-0 | 100.0% [21–100] | +86.2% | +2.5u | 0.00 ✗ n<2 |
| HC = −1 | 23 | 13-10-0 | 56.5% [37–74] | +16.1% | +9.5u | 0.73 ✗ noise |
| HC = 0 | 277 | 136-134-7 | 50.4% [44–56] | -5.4% | -35.4u | -0.95 ✗ noise |
| HC = +1 | 154 | 85-69-0 | 55.2% [47–63] | +6.4% | +3.1u | 0.80 ✗ noise |
| HC = +2 | 31 | 16-15-0 | 51.6% [35–68] | -0.4% | -4.6u | -0.02 ✗ noise |
| HC ≥ +3 | 10 | 3-7-0 | 30.0% [11–60] | -56.7% | -8.8u | -2.57 ✓ p<.05 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 5 | 2-3-0 | 40.0% [12–77] | -30.3% | -2.8u | -0.71 ✗ noise |
| Δw = −1 | 16 | 5-10-1 | 33.3% [15–58] | -34.2% | -4.0u | -1.49 ✗ noise |
| Δw = 0 | 103 | 57-44-2 | 56.4% [47–66] | +6.6% | +25.6u | 0.69 ✗ noise |
| Δw = +1 | 183 | 102-78-3 | 56.7% [49–64] | +7.2% | +13.9u | 1.02 ✗ noise |
| Δw = +2 | 104 | 52-51-1 | 50.5% [41–60] | -3.1% | -28.0u | -0.32 ✗ noise |
| Δw ≥ +3 | 85 | 36-49-0 | 42.4% [32–53] | -18.9% | -38.4u | -1.81 ~ p<.10 |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 195 | 104-91-0 | 53.3% [46–60] | +2.1% | -10.3u | 0.29 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 84 | 38-45-1 | 45.8% [35–56] | -14.9% | -29.1u | -1.45 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 217 | 112-99-6 | 53.1% [46–60] | +1.0% | +5.8u | 0.15 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 581 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 11 | 5-6-0 | 45.5% [21–72] | +0.5% | -3.5u | 0.01 ✗ noise |
| Δcount = −1 | 30 | 15-15-0 | 50.0% [33–67] | -4.3% | -12.1u | -0.24 ✗ noise |
| Δcount = 0 (balanced) | 85 | 35-48-2 | 42.2% [32–53] | -18.9% | -14.5u | -1.82 ~ p<.10 |
| Δcount = +1 | 227 | 117-108-2 | 52.0% [45–58] | -2.2% | -14.4u | -0.35 ✗ noise |
| Δcount = +2 | 126 | 62-63-1 | 49.6% [41–58] | -6.1% | -23.8u | -0.71 ✗ noise |
| Δcount ≥ +3 (heavy support) | 102 | 62-38-2 | 62.0% [52–71] | +23.9% | +36.8u | 2.22 ✓ p<.05 |

**ρ(Δcount, WIN) = 0.073** ~ p<.10  ·  **ρ(Δcount, flat ROI) = 0.084** ✓ p<.05

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -17 · ≤ 0 · ≤ 6 · ≤ 21 · > 21

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 117 | 49-67-1 | 42.2% [34–51] | -18.0% | -56.9u | -2.01 ✓ p<.05 |
| Q2 | 121 | 53-66-2 | 44.5% [36–53] | -13.7% | -26.1u | -1.55 ✗ noise |
| Q3 (balanced) | 120 | 65-55-0 | 54.2% [45–63] | +2.8% | -3.3u | 0.32 ✗ noise |
| Q4 | 113 | 62-48-3 | 56.4% [47–65] | +7.8% | +22.0u | 0.85 ✗ noise |
| Q5 (best — heavy support) | 110 | 67-42-1 | 61.5% [52–70] | +18.0% | +32.6u | 1.82 ~ p<.10 |

**ρ(ΔWlNet, WIN) = 0.160** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.149** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -17.97 · ≤ -2.86 · ≤ 3.89 · ≤ 15.60 · > 15.60

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 121 | 50-68-3 | 42.4% [34–51] | -20.9% | -40.3u | -2.51 ✓ p<.05 |
| Q2 | 112 | 51-61-0 | 45.5% [37–55] | -14.7% | -25.4u | -1.63 ✗ noise |
| Q3 | 116 | 56-60-0 | 48.3% [39–57] | -10.3% | -33.3u | -1.16 ✗ noise |
| Q4 | 116 | 68-45-3 | 60.2% [51–69] | +15.7% | +31.6u | 1.75 ~ p<.10 |
| Q5 | 116 | 71-44-1 | 61.7% [53–70] | +25.7% | +35.7u | 2.54 ✓ p<.05 |

**ρ(ΔFlatPnl, WIN) = NaN** —  ·  **ρ(ΔFlatPnl, flat ROI) = NaN** —

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -9.5 · ≤ -1.9 · ≤ 7.4 · ≤ 21.8 · > 21.8

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 117 | 33-82-2 | 28.7% [21–38] | -44.9% | -82.8u | -5.60 ✓ p<.01 |
| Q2 | 116 | 58-58-0 | 50.0% [41–59] | -8.2% | -8.2u | -0.94 ✗ noise |
| Q3 | 120 | 63-56-1 | 52.9% [44–62] | +0.5% | -11.1u | 0.05 ✗ noise |
| Q4 | 112 | 66-44-2 | 60.0% [51–69] | +14.9% | +40.8u | 1.64 ✗ noise |
| Q5 | 116 | 76-38-2 | 66.7% [58–75] | +33.7% | +29.7u | 3.49 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = NaN** —  ·  **ρ(ΔAvgRoi, flat ROI) = NaN** —

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 55 | 12-42-1 | 22.2% [13–35] | -56.1% | -43.4u | -5.09 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 18 | 4-14-0 | 22.2% [9–45] | -59.4% | -13.5u | -3.17 ✓ p<.01 |
| ΔBestRank = 0 (tied) | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.6u | 0.00 ✗ n<2 |
| ΔBestRank ∈ [+1,+4] | 14 | 6-8-0 | 42.9% [21–67] | -13.1% | -6.4u | -0.46 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 155 | 89-62-4 | 58.9% [51–66] | +17.3% | +18.0u | 2.03 ✓ p<.05 |

**ρ(ΔBestRank, WIN) = 0.314** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.362** ✓ p<.01  (N=243)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 32 | 9-23-0 | 28.1% [16–45] | -46.1% | -15.8u | -2.88 ✓ p<.01 |
| Δshare ∈ [−30,−10] pp | 5 | 1-4-0 | 20.0% [4–62] | -61.8% | -10.8u | -1.62 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 381 | 187-190-4 | 49.6% [45–55] | -7.4% | -41.7u | -1.53 ✗ noise |
| Δshare ∈ [+10,+30] pp | 29 | 16-13-0 | 55.2% [38–72] | +15.6% | +1.0u | 0.74 ✗ noise |
| Δshare ≥ +30 pp | 134 | 83-48-3 | 63.4% [55–71] | +26.7% | +35.5u | 2.96 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.153** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.175** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔTopQCount** | 0.186 ✓ p<.01 | 0.231 ✓ p<.01 | 0.206 |
| 2 | **ΔTopQShare** | 0.153 ✓ p<.01 | 0.175 ✓ p<.01 | 0.192 |
| 3 | **ΔWlNet** | 0.160 ✓ p<.01 | 0.149 ✓ p<.01 | 0.114 |
| 4 | **Δcount** | 0.073 ~ p<.10 | 0.084 ✓ p<.05 | 0.077 |
| 5 | **ΔFlatPnl** | NaN — | NaN — | 0.179 |
| 6 | **ΔAvgRoi** | NaN — | NaN — | 0.273 |

_(ΔBestRank uses N=243 subset where both sides had a proven wallet — ρ(flat ROI) = 0.362 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 1031, dateRange = 2026-04-18 → 2026-06-12, computedAt = 2026-06-13T14:53:33.425Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **581** rows · PIT aggregate computable on **578** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **578** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 0 · — · — | 0 · — · — | — |
| NEUTRAL (0..+3) | 402 · 56% · +6.5% | 339 · 52% · -2.3% | -8.8pp |
| WEAK (−3..0) | 159 · 42% · -18.2% | 222 · 51% · +2.2% | +20.4pp |
| FADE (<−3) | 0 · — · — | 0 · — · — | — |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=326, WR=56%, ROI=+7.5% | N=260, WR=52%, ROI=-3.0% | -10.5pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=402, WR=56%, ROI=+6.5% | N=339, WR=52%, ROI=-2.3% | -8.8pp |
| AGS < −1 (mute veto) | N=57, WR=43%, ROI=-16.4% | N=132, WR=47%, ROI=-3.3% | +13.0pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-30 → 2026-06-12, N=224)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 0 · — · — |
| NEUTRAL (0..+3) | 105 · 56% · +4.5% |
| WEAK (−3..0) | 119 · 50% · -1.1% |
| FADE (<−3) | 0 · — · — |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=74, WR=58%, ROI=+8.5% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=105, WR=56%, ROI=+4.5% |
| AGS < −1 (mute veto) | N=77, WR=49%, ROI=-3.3% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.03 | 1.50 |
| `dHcSizeRatio` | INTENSITY_HC | + | 0.90 | 4.32 |
| `dSumRankNorm` | QUALITY_RANK | − | 53.76 | 87.58 |
| `dWinnerCtPreA` | QUALITY_TRACK | − | 0.58 | 1.13 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **578/608** shipped+graded rows (95%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -1.25 |
| 20th pct | -0.22 |
| 40th pct | 0.01 |
| Median | 0.08 |
| 60th pct | 0.16 |
| 80th pct | 0.38 |
| 90th pct | 0.59 |
| Max | 1.74 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 93 | 16.1% |
| **LOCK** | +5..+7 | 104 | 18.0% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 72 | 12.5% |
| **FADE** | < −3 | 138 | 23.9% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 93 | 47-44-2 | 51.6% [42–62] | -4.7% | -14.9u | -0.49 ✗ noise |
| LOCK | 104 | 48-56-0 | 46.2% [37–56] | -13.0% | -21.1u | -1.37 ✗ noise |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 72 | 37-33-2 | 52.9% [41–64] | +1.7% | +8.7u | 0.15 ✗ noise |
| FADE | 138 | 63-72-3 | 46.7% [38–55] | -4.8% | -28.8u | -0.52 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **-0.014** ✗ · r(ROI) = **-0.043** ✗ · Spearman ρ(ROI) = **-0.046**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 126 | 64-60-2 | 51.6% [43–60] | +4.7% | -15.7u | 0.49 ✗ noise |
| z ∈ [−1, 0) | 194 | 104-87-3 | 54.5% [47–61] | +2.5% | +22.8u | 0.37 ✗ noise |
| z ∈ [0, +1) | 170 | 81-88-1 | 47.9% [41–55] | -9.2% | -35.9u | -1.25 ✗ noise |
| z ≥ +1 (very positive) | 88 | 42-44-2 | 48.8% [39–59] | -9.5% | -9.7u | -0.95 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 544 | 276-260-8 | 51.5% [47–56] | -2.2% | -35.4u | -0.54 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dSumRankNorm` (QUALITY_RANK)

r(WIN) = **-0.062** ✗ · r(ROI) = **-0.069** ~ p<.10 · Spearman ρ(ROI) = **-0.073**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 108 | 60-47-1 | 56.1% [47–65] | +3.8% | -3.2u | 0.42 ✗ noise |
| z ∈ [−1, 0) | 202 | 109-91-2 | 54.5% [48–61] | +6.7% | +9.3u | 0.93 ✗ noise |
| z ∈ [0, +1) | 200 | 92-104-4 | 46.9% [40–54] | -9.6% | -38.7u | -1.40 ✗ noise |
| z ≥ +1 (very positive) | 68 | 30-37-1 | 44.8% [33–57] | -17.2% | -6.0u | -1.53 ✗ noise |

#### `dWinnerCtPreA` (QUALITY_TRACK)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 544 | 276-260-8 | 51.5% [47–56] | -2.2% | -35.4u | -0.54 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.062 ✗ | -0.069 ~ p<.10 | -0.073 |
| 2 | `dCount` | COUNT | -0.014 ✗ | -0.043 ✗ | -0.046 |
| 3 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |
| 4 | `dWinnerCtPreA` | QUALITY_TRACK | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | -0.045 | 0.814 | 49.2% | dominant |
| 2 | `dSumRankNorm` | -0.113 | 0.797 | 48.2% | meaningful |
| 3 | `dWinnerCtPreA` | -0.030 | 0.030 | 1.8% | silent (<0.2) |
| 4 | `dHcSizeRatio` | -0.012 | 0.012 | 0.7% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcSizeRatio` | `dSumRankNorm` | `dWinnerCtPreA` |
|---|---|---|---|---|
| `dCount` | 1.000 | +0.037 | +0.725 ⚠ | +0.037 |
| `dHcSizeRatio` | +0.037 | 1.000 | +0.010 | +1.000 ⚠ |
| `dSumRankNorm` | +0.725 ⚠ | +0.010 | 1.000 | +0.010 |
| `dWinnerCtPreA` | +0.037 | +1.000 ⚠ | +0.010 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **-0.010**. At AGS ≥ +0.12 fires N=268, WR=51.5%, ROI=-3.8%. At AGS ≥ +null fires N=349, WR=51.7%, ROI=-3.5%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-268 ROI (matched cohort) | Top-268 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.074 | +0.064 | WR=56%, ROI=+7.1% | -10.8pp | N=286, WR=55%, ROI=+6.2% |
| `dHcSizeRatio` | +0.046 | +0.036 | WR=54%, ROI=+1.7% | -5.5pp | N=276, WR=55%, ROI=+3.0% |
| `dSumRankNorm` | -0.049 | +0.039 | WR=48%, ROI=-9.7% | +5.9pp | N=266, WR=48%, ROI=-9.0% |
| `dWinnerCtPreA` | +0.048 | +0.038 | WR=55%, ROI=+2.5% | -6.2pp | N=265, WR=55%, ROI=+2.1% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dHcSizeRatio` | +0.036 | -5.5pp | redundant — other features cover it |
| 2 | `dWinnerCtPreA` | +0.038 | -6.2pp | redundant — other features cover it |
| 3 | `dSumRankNorm` | +0.039 | +5.9pp | redundant — other features cover it |
| 4 | `dCount` | +0.064 | -10.8pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.145 | 0.145 | negative ↓ |
| 2 | `dCount` | COUNT | +0.046 | 0.046 | flat ≈ 0 |
| 3 | `dWinnerCtPreA` | QUALITY_TRACK | +0.034 | 0.034 | flat ≈ 0 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | +0.014 | 0.014 | flat ≈ 0 |

Intercept b = +0.001 · Final log-loss = 0.6902 · N = 578.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | #1 | #2 | #3 | #1 | 1.75 |
| 2 | `dCount` | COUNT | #2 | #1 | #4 | #2 | 2.25 |
| 3 | `dHcSizeRatio` | INTENSITY_HC | #3 | #4 | #1 | #4 | 3.00 |
| 4 | `dWinnerCtPreA` | QUALITY_TRACK | #4 | #3 | #2 | #3 | 3.00 |

#### Plain-English summary

- **Workhorse**: `dSumRankNorm` (QUALITY_RANK) — ranks #1/#2/#3/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dWinnerCtPreA` (QUALITY_TRACK) — composite avg rank 3.00. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dCount` ↔ `dSumRankNorm` (r=+0.72); `dHcSizeRatio` ↔ `dWinnerCtPreA` (r=+1.00). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dWinnerCtPreA`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 578 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/578 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 196 | 92-104-0 | 46.9% [40–54] | -13.8% | -65.0u | -2.06 ✓ p<.05 |
| 4.5★ | 88 | 56-30-2 | 65.1% [55–74] | +23.7% | +41.1u | 2.32 ✓ p<.05 |
| 4.0★ | 122 | 54-66-2 | 45.0% [36–54] | -12.3% | -15.4u | -1.38 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 82 | 43-36-3 | 54.4% [43–65] | +6.0% | -1.8u | 0.55 ✗ noise |
| 2.5★ | 82 | 41-40-1 | 50.6% [40–61] | -2.7% | -7.0u | -0.25 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 30/60%/+6% | 24/63%/+21% | 26/32%/-35% | 6/33%/-26% | 31/38%/-28% | 36/49%/-7% |
| Δw = +1 | 36/50%/-9% | 36/65%/+18% | 57/46%/-10% | 28/54%/+4% | 29/66%/+27% | 29/55%/+2% |
| Δw = +2 | 62/44%/-17% | 14/64%/+20% | 32/53%/+4% | — | 13/58%/+15% | 8/38%/-16% |
| Δw ≥ +3 | 66/41%/-25% | 11/73%/+53% | 7/43%/-21% | 3/67%/+156% | 9/67%/+43% | 7/43%/-9% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 9 | 8-1-0 | 88.9% [56–98] | +12.7% | +6.9u | 0.90 ✗ noise |
| −300/−201 | 22 | 14-8-0 | 63.6% [43–80] | -8.4% | +10.8u | -0.56 ✗ noise |
| −200/−151 | 53 | 28-25-0 | 52.8% [40–66] | -16.2% | -9.7u | -1.47 ✗ noise |
| −150/−101 | 370 | 185-180-5 | 50.7% [46–56] | -4.7% | -24.9u | -0.96 ✗ noise |
| −100/+100 | 8 | 4-4-0 | 50.0% [22–78] | +0.0% | -0.8u | 0.00 ✗ noise |
| +101/+150 | 121 | 55-63-3 | 46.6% [38–56] | +1.8% | -33.0u | 0.18 ✗ noise |
| +151/+200 | 15 | 8-7-0 | 53.3% [30–75] | +42.8% | +7.8u | 1.20 ✗ noise |
| +201+ | 9 | 3-6-0 | 33.3% [12–65] | +42.8% | +3.7u | 0.57 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -36% (2) | +25% (2) | +32% (1) | +25% (3) |
| −300/−201 | -22% (11) | +47% (2) | +9% (4) | -14% (5) |
| −200/−151 | -40% (16) | +20% (17) | +24% (9) | -84% (10) |
| −150/−101 | -6% (89) | -1% (143) | -16% (77) | +1% (58) |
| −100/+100 | -100% (2) | +50% (4) | -100% (1) | +100% (1) |
| +101/+150 | +4% (30) | +5% (41) | +6% (31) | -16% (19) |
| +151/+200 | +26% (2) | +60% (5) | +65% (5) | +32% (2) |
| +201+ | +57% (2) | -100% (1) | -100% (1) | +94% (5) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 329 | 163-165-1 | 49.7% [44–55] | -4.2% | -47.3u | -0.74 ✗ noise |
| SPREAD | 92 | 44-46-2 | 48.9% [39–59] | -9.3% | +2.9u | -0.95 ✗ noise |
| TOTAL | 187 | 98-84-5 | 53.8% [47–61] | +3.8% | +0.2u | 0.54 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=84 · 45% · -17% | N=111 · 57% · +7% | N=67 · 51% · +1% | N=64 · 42% · -12% |
| SPREAD | N=24 · 35% · -33% | N=33 · 53% · -2% | N=18 · 67% · +19% | N=16 · 38% · -27% |
| TOTAL | N=46 · 61% · +17% | N=72 · 53% · +2% | N=44 · 40% · -22% | N=23 · 70% · +34% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 431 | 222-204-5 | 52.1% [47–57] | -1.2% | -8.4u | -0.26 ✗ noise |
| NBA | 129 | 60-68-1 | 46.9% [38–55] | -6.7% | -15.0u | -0.70 ✗ noise |
| NHL | 48 | 23-23-2 | 50.0% [36–64] | -3.0% | -20.8u | -0.21 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=116 · 51% · -3% | N=173 · 55% · +4% | N=93 · 51% · -3% | N=48 · 46% · -12% |
| NBA | N=30 · 31% · -43% | N=29 · 48% · -6% | N=23 · 48% · -5% | N=42 · 55% · +16% |
| NHL | N=8 · 63% · +33% | N=14 · 69% · +25% | N=13 · 42% · -18% | N=13 · 31% · -40% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 247 · 45% · -10.5% · -1.60 ✗ noise | 360 · 54% · +2.6% · 0.51 ✗ noise |
| **plusEV** | 65 · 48% · -3.8% · -0.26 ✗ noise | 542 · 51% · -2.6% · -0.63 ✗ noise |
| **pinnacleConfirms** | 143 · 52% · -0.3% · -0.03 ✗ noise | 303 · 51% · -3.3% · -0.59 ✗ noise |
| **invested10kPlus** | 297 · 51% · -1.9% · -0.33 ✗ noise | 149 · 51% · -3.2% · -0.40 ✗ noise |
| **lineMovingWith** | 280 · 54% · +2.7% · 0.45 ✗ noise | 327 · 48% · -7.4% · -1.36 ✗ noise |
| **predMarketAligns** | 149 · 52% · -1.3% · -0.15 ✗ noise | 297 · 51% · -2.9% · -0.50 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 165 | 87-78-0 | 52.7% [45–60] | +1.2% | +8.2u | 0.17 ✗ noise |
| 1 | 133 | 64-64-5 | 50.0% [41–59] | -4.6% | -24.3u | -0.55 ✗ noise |
| 2 | 141 | 71-67-3 | 51.4% [43–60] | -1.2% | +0.2u | -0.14 ✗ noise |
| 3 | 54 | 26-28-0 | 48.1% [35–61] | -9.1% | -10.1u | -0.68 ✗ noise |
| 4 | 51 | 25-26-0 | 49.0% [36–62] | -10.7% | -15.0u | -0.80 ✗ noise |
| 5 | 50 | 26-24-0 | 52.0% [39–65] | -3.3% | -5.8u | -0.24 ✗ noise |
| 6 | 14 | 6-8-0 | 42.9% [21–67] | +17.4% | +2.5u | 0.39 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 108 | 59-48-1 | 55.1% [46–64] | +3.3% | +2.2u | 0.36 ✗ noise |
| NEAR_START | 241 | 112-124-5 | 47.5% [41–54] | -7.2% | -56.6u | -1.10 ✗ noise |
| NO_MOVE | 19 | 9-10-0 | 47.4% [27–68] | -13.5% | +1.5u | -0.62 ✗ noise |
| PREGAME | 109 | 62-47-0 | 56.9% [48–66] | +8.8% | +23.9u | 0.96 ✗ noise |
| SMALL_MOVE | 129 | 61-66-2 | 48.0% [40–57] | -8.3% | -17.7u | -0.96 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 332 | 168-161-3 | 51.1% [46–56] | -4.1% | -52.3u | -0.78 ✗ noise |
| STRONG | 96 | 48-46-2 | 51.1% [41–61] | +0.3% | -1.7u | 0.03 ✗ noise |
| LEAN | 172 | 85-84-3 | 50.3% [43–58] | -1.5% | +8.2u | -0.19 ✗ noise |
| CONTESTED | 7 | 3-4-0 | 42.9% [16–75] | -11.9% | -0.1u | -0.29 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.092 ✓ p<.05 | -0.071 ~ p<.10 | -0.058 | -1.76 |
| totalInvested | -0.055 ✗ | -0.069 ~ p<.10 | -0.023 | -1.71 |
| evEdge | 0.092 ✓ p<.05 | 0.119 ✓ p<.01 | 0.062 | 2.96 |
| moneyPct | 0.039 ✗ | 0.009 ✗ | -0.003 | 0.22 |
| walletPct | 0.039 ✗ | 0.023 ✗ | 0.019 | 0.56 |
| criteriaMet | -0.018 ✗ | -0.012 ✗ | -0.040 | -0.28 |
| maxContribFor | -0.012 ✗ | 0.002 ✗ | 0.026 | 0.04 |
| meanBaseFor | 0.005 ✗ | 0.030 ✗ | 0.057 | 0.74 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **595** picks. Mean CLV = **-0.0043**.
t-statistic vs zero: -3.47 → ✓ p<.01 · 95% CI [-0.0068, -0.0019]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 67 | 33-33-1 | 50.0% [38–62] | -9.3% | -1.1u | -0.83 ✗ noise |
| CLV (−2%, 0] | 352 | 173-173-6 | 50.0% [45–55] | -4.7% | -45.0u | -0.91 ✗ noise |
| CLV (0, +2%] | 150 | 80-70-0 | 53.3% [45–61] | +6.9% | +1.8u | 0.79 ✗ noise |
| CLV > +2% | 26 | 13-12-1 | 52.0% [33–70] | -2.6% | +3.8u | -0.14 ✗ noise |

ρ(CLV, flat ROI) = 0.086 ✓ p<.05

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=474 (with all features non-null). Intercept β₀ = 0.068.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔAvgRoi | +0.368 | ↑ helps |
| 2 | sharpCount | -0.286 | ↓ hurts |
| 3 | evEdge | +0.226 | ↑ helps |
| 4 | pw.Δcount | +0.168 | ↑ helps |
| 5 | pw.ΔFlatPnl | +0.165 | ↑ helps |
| 6 | log(impliedProb) | +0.163 | ↑ helps |
| 7 | peak.stars | -0.099 | ↓ hurts |
| 8 | pw.ΔWlNet | +0.086 | ↑ helps |
| 9 | HC margin | +0.066 | ↑ helps |
| 10 | odds (American) | -0.065 | ↓ hurts |
| 11 | vault.star | +0.061 | ↑ helps |
| 12 | pw.ΔTopQShare | -0.052 | ↓ hurts |
| 13 | log10(invested) | +0.045 | ≈ flat |
| 14 | walletPct | +0.037 | ≈ flat |
| 15 | Δw | -0.032 | ≈ flat |
| 16 | moneyPct | -0.023 | ≈ flat |
| 17 | Δw + HC | +0.005 | ≈ flat |
| 18 | criteriaMet | -0.000 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 41 | 19-22 | 46.3% | 47.1% | -110 | — (mute) | 2.96u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 154 | 85-69 | 55.2% | 54.9% | -110 | 2.62% bankroll | 2.11u | ~ in range — 2.62u |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 84 | 38-45 | 45.8% | 46.2% | -110 | — (mute) | 1.96u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 103 | 49-54 | 47.6% | 47.8% | -109 | — (mute) | 2.44u | **MUTE** (negative EV at posterior) |
| Stale Δw = 0 | 126 | 64-59 | 52.0% | 51.9% | -110 | — (mute) | 1.82u | **MUTE** (negative EV at posterior) |
| Stale Δw ≤ −1 | 28 | 8-19 | 29.6% | 35.1% | -120 | — (mute) | 1.23u | **MUTE** (negative EV at posterior) |

> Bayesian posterior uses Beta(5,5) prior — pulls small-sample WR toward 50%. Half-Kelly is conservative; reduce by another 50% if you prefer quarter-Kelly. **Treat 1u = 1% of bankroll** when reading suggested stakes.

---

## §13. Drawdown / streaks / variance
_Daily PnL distribution + max drawdown._

| Date | N | W-L | Peak PnL | Cum |
|---|---|---|---|---|
| 2026-04-18 | 12 | 6-6 | +2.7u | +2.7u |
| 2026-04-19 | 6 | 4-2 | +4.4u | +7.1u |
| 2026-04-20 | 16 | 8-8 | -3.2u | +3.9u |
| 2026-04-21 | 16 | 5-11 | -7.4u | -3.6u |
| 2026-04-22 | 8 | 4-4 | +1.1u | -2.5u |
| 2026-04-23 | 7 | 3-4 | -1.2u | -3.6u |
| 2026-04-24 | 6 | 4-1 | +3.1u | -0.6u |
| 2026-04-25 | 7 | 1-6 | -8.3u | -8.9u |
| 2026-04-26 | 10 | 5-5 | -2.0u | -10.9u |
| 2026-04-27 | 6 | 3-3 | -1.6u | -12.6u |
| 2026-04-28 | 10 | 4-6 | -3.2u | -15.8u |
| 2026-04-29 | 7 | 3-4 | +3.5u | -12.2u |
| 2026-04-30 | 5 | 2-2 | -0.5u | -12.7u |
| 2026-05-01 | 6 | 3-3 | -5.5u | -18.2u |
| 2026-05-02 | 2 | 1-1 | -1.9u | -20.1u |
| 2026-05-03 | 5 | 3-2 | +0.5u | -19.7u |
| 2026-05-04 | 7 | 3-4 | +2.5u | -17.2u |
| 2026-05-05 | 3 | 1-2 | -4.3u | -21.5u |
| 2026-05-06 | 2 | 2-0 | +4.8u | -16.8u |
| 2026-05-07 | 1 | 1-0 | +0.7u | -16.1u |
| 2026-05-08 | 5 | 3-2 | +4.5u | -11.6u |
| 2026-05-09 | 4 | 4-0 | +5.5u | -6.1u |
| 2026-05-10 | 10 | 5-5 | +0.7u | -5.4u |
| 2026-05-11 | 4 | 2-2 | -1.4u | -6.8u |
| 2026-05-12 | 5 | 0-5 | -14.6u | -21.4u |
| 2026-05-13 | 6 | 4-2 | +3.2u | -18.3u |
| 2026-05-14 | 5 | 1-4 | -8.0u | -26.3u |
| 2026-05-15 | 8 | 4-4 | -1.4u | -27.7u |
| 2026-05-16 | 6 | 4-2 | +1.4u | -26.3u |
| 2026-05-17 | 9 | 5-4 | -1.3u | -27.6u |
| 2026-05-18 | 9 | 4-5 | -7.2u | -34.8u |
| 2026-05-19 | 7 | 3-4 | -5.7u | -40.5u |
| 2026-05-20 | 10 | 6-4 | +2.4u | -38.1u |
| 2026-05-21 | 11 | 5-6 | -5.5u | -43.6u |
| 2026-05-22 | 19 | 8-11 | -17.9u | -61.5u |
| 2026-05-23 | 22 | 13-8 | +4.5u | -56.9u |
| 2026-05-24 | 20 | 8-12 | -10.4u | -67.3u |
| 2026-05-25 | 19 | 11-8 | -0.5u | -67.9u |
| 2026-05-26 | 15 | 11-4 | +15.4u | -52.5u |
| 2026-05-27 | 19 | 9-10 | -9.4u | -61.9u |
| 2026-05-28 | 6 | 2-4 | -3.9u | -65.8u |
| 2026-05-29 | 22 | 11-11 | -4.8u | -70.6u |
| 2026-05-30 | 21 | 11-10 | -3.7u | -74.3u |
| 2026-05-31 | 11 | 5-6 | +0.9u | -73.4u |
| 2026-06-01 | 7 | 4-3 | +2.4u | -71.0u |
| 2026-06-02 | 10 | 4-6 | +1.9u | -69.0u |
| 2026-06-03 | 19 | 11-8 | +0.8u | -68.2u |
| 2026-06-04 | 13 | 7-6 | -2.9u | -71.1u |
| 2026-06-05 | 18 | 11-6 | +10.1u | -61.0u |
| 2026-06-06 | 14 | 7-7 | -1.8u | -62.7u |
| 2026-06-07 | 25 | 15-10 | +3.6u | -59.2u |
| 2026-06-08 | 13 | 7-5 | +10.0u | -49.2u |
| 2026-06-09 | 21 | 10-11 | +14.1u | -35.1u |
| 2026-06-10 | 25 | 11-14 | -12.1u | -47.1u |
| 2026-06-11 | 12 | 4-5 | -3.2u | -50.3u |
| 2026-06-12 | 16 | 9-7 | +6.1u | -44.3u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -81.3u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.126  (annualized × √252 ≈ -2.00)

---

## §14. Per-pick row-level detail (every shipped+graded pick)
_Sortable raw data behind every section. Use to spot-check individual decisions._

| Date | Sport | Mkt | Side | ★ | u | Odds | Δw | HC | Δw+HC | pw.Δcnt | pw.ΔWl | EV | Outcome | Peak PnL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.50 | +105 | 2 | — | — | 0 | 0 | 0.00 | W | +0.5u |
| 2026-04-18 | MLB | ML | away | 4.5 | 2.50 | -155 | — | — | — | — | — | -1.60 | W | +1.6u |
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.50 | -117 | 2 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-18 | MLB | ML | home | 4.5 | 3.00 | -150 | 3 | — | — | 1 | 2 | -0.20 | W | +2.0u |
| 2026-04-18 | NBA | ML | away | 3.5 | 0.50 | +200 | — | — | — | — | — | -0.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.50 | -108 | 0 | — | — | -1 | -1 | -2.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1.00 | -108 | 0 | — | — | 0 | 0 | -1.70 | L | -1.0u |
| 2026-04-18 | NBA | TOTAL | over | 3.0 | 0.75 | -107 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-18 | NBA | TOTAL | under | 5.0 | 2.00 | -104 | — | — | — | — | — | 0.00 | W | +1.9u |
| 2026-04-18 | NBA | ML | home | 5.0 | 3.00 | -360 | — | — | — | — | — | 0.20 | W | +0.8u |
| 2026-04-18 | NBA | TOTAL | under | 4.5 | 1.50 | -105 | — | — | — | — | — | 0.00 | L | -1.5u |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 1 | 1 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 1 | 2 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 1 | -8 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 1 | 2 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 0 | 22 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 4 | 19 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 2 | -6 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 1 | 2 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | -1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 1 | 2 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | 1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | -2 | -20 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 1 | 12 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 0 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | 1 | -6 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | 0 | -13 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 1 | 3 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 2 | 25 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | -1 | 0 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 1 | -3 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 1 | 3 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 1 | 5 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 2 | 9 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 1 | 0 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | 0 | 0 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 1 | 0 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 1 | -7 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 1 | 0 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | 0 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | 1 | 1 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | 0 | -30 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | -1 | -12 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 1 | -8 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 4 | 23 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 3 | -4 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 1 | -8 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | -2 | -7 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | 0 | -8 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | 0 | -8 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | 0 | 0 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 0 | 0 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 1 | 6 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 3 | 15 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 2 | 3 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -2 | -10 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 1 | 2 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 24 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | 1 | 0 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 14 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 3 | -4 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | -5 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -2 | -6 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 2 | -17 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 4 | 20 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 1 | 25 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 1 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 21 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 1 | 7 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 1 | -19 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 1 | -19 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | 0 | -20 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 8 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 2 | 6 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 1 | 3 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 1 | 6 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | -1 | 19 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | 24 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 2 | -13 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 13 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 27 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | 6 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -5 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 3 | -1 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | -1 | -24 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 1 | -19 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -17 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 4 | 18 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 4 | 27 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 4 | 18 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 1 | 6 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 0 | 0 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 2 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 0 | 0 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | 3 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 6 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 2 | -2 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 6 | 1 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 22 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 1 | 24 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 2 | -6 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 1 | 15 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 0 | -2 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 0 | 2 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 4 | 11 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 10 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | -12 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 1 | -18 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 3 | 10 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 0 | -5 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 0 | 0 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | 5 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 3 | -14 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 11 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 4 | 11 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 1 | 2 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 3 | 19 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | -1 | -24 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 2 | 4 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 13 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 14 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 13 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | 0 | 3 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 35 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 4 | 14 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 2 | -7 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 1 | 6 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 5 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 8 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 5 | 16 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 1 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 18 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 3 | 19 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 0 | 7 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 1 | -6 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 1 | -6 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 2 | 23 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 3 | 28 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 14 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 1 | 1 | -1.30 | L | -1.1u |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.70 | -104 | — | — | — | 2 | 9 | 0.00 | W | +1.6u |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-09 | NBA | ML | away | 5.0 | 4.50 | -364 | 3 | 1 | 4 | 6 | 34 | 0.00 | W | +1.2u |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2.00 | -104 | 2 | 1 | 3 | 2 | 14 | 0.00 | W | +1.9u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -120 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +0.9u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -103 | 1 | 1 | 2 | 1 | -19 | 0.00 | L | -1.1u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -110 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +1.0u |
| 2026-05-10 | MLB | ML | away | 3.5 | 1.13 | +134 | 0 | 1 | 1 | 1 | -19 | 0.00 | W | +1.5u |
| 2026-05-10 | NBA | ML | home | 4.0 | 1.50 | +160 | 1 | 1 | 2 | 3 | 22 | 0.80 | W | +2.6u |
| 2026-05-10 | NBA | TOTAL | over | 5.0 | 3.50 | -110 | 3 | 2 | 5 | 2 | 19 | 0.00 | W | +3.3u |
| 2026-05-10 | NHL | ML | away | 4.5 | 4.50 | +108 | 2 | 2 | 4 | 2 | 8 | -0.70 | L | -4.5u |
| 2026-05-10 | NHL | TOTAL | under | 5.0 | 1.70 | -110 | 2 | 1 | 3 | 0 | 0 | 0.00 | L | -1.7u |
| 2026-05-11 | MLB | ML | away | 3.5 | 1.13 | -101 | 1 | 1 | 2 | 2 | -22 | 0.00 | W | +1.1u |
| 2026-05-11 | MLB | ML | home | 3.5 | 1.13 | -156 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +0.7u |
| 2026-05-11 | NBA | TOTAL | under | 4.5 | 2.00 | -110 | 1 | 2 | 3 | 0 | 9 | 0.00 | L | -2.0u |
| 2026-05-11 | NHL | TOTAL | under | 4.5 | 1.27 | -110 | 2 | 0 | 2 | 2 | 15 | 0.00 | L | -1.3u |
| 2026-05-12 | MLB | ML | away | 5.0 | 4.50 | +108 | 4 | 0 | 4 | 2 | 5 | -0.20 | L | -4.5u |
| 2026-05-12 | MLB | TOTAL | under | 4.0 | 0.64 | -110 | 2 | 1 | 3 | 2 | -3 | 0.00 | L | -0.6u |
| 2026-05-12 | MLB | ML | away | 4.5 | 3.00 | +129 | 3 | 0 | 3 | 1 | 24 | -1.00 | L | -3.0u |
| 2026-05-12 | MLB | ML | home | 5.0 | 3.00 | +108 | 3 | 0 | 3 | 2 | -3 | -0.50 | L | -3.0u |
| 2026-05-12 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 6 | 4 | 10 | 6 | 35 | -0.70 | L | -3.5u |
| 2026-05-13 | MLB | ML | home | 4.5 | 4.50 | -116 | 1 | 1 | 2 | 1 | -19 | -1.30 | W | +3.7u |
| 2026-05-13 | MLB | SPREAD | home | 5.0 | 3.50 | -105 | 1 | 1 | 2 | 2 | -25 | 0.90 | W | +3.2u |
| 2026-05-13 | MLB | TOTAL | under | 4.0 | 0.96 | -110 | 1 | 1 | 2 | 2 | -22 | 0.00 | W | +0.9u |
| 2026-05-13 | MLB | TOTAL | under | 5.0 | 3.50 | -110 | 4 | 2 | 6 | 4 | -25 | 0.00 | L | -3.5u |
| 2026-05-13 | NBA | ML | home | 5.0 | 4.50 | -162 | 6 | 0 | 6 | 2 | -18 | -1.00 | L | -4.5u |
| 2026-05-13 | NBA | TOTAL | over | 5.0 | 3.50 | -101 | 3 | 2 | 5 | 4 | 4 | 0.00 | W | +3.4u |
| 2026-05-14 | MLB | ML | home | 5.0 | 4.50 | -103 | 4 | 1 | 5 | 1 | 0 | -0.40 | L | -4.5u |
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 2 | 5 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | -6 | 0.00 | L | -0.5u |
| 2026-05-14 | NHL | TOTAL | under | 5.0 | 3.50 | -110 | 3 | 1 | 4 | 1 | 8 | 0.00 | L | -3.5u |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 0 | 1 | 1 | 4 | 11 | 0.00 | W | +1.7u |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 1 | 1 | 2 | 2 | -19 | 0.00 | W | +0.3u |
| 2026-05-15 | MLB | ML | home | 4.0 | 2.50 | +128 | 0 | 0 | 0 | 1 | -3 | 0.00 | L | -2.5u |
| 2026-05-15 | MLB | ML | away | 4.0 | 2.75 | -211 | 2 | 1 | 3 | 1 | 24 | -0.90 | W | +1.3u |
| 2026-05-15 | MLB | ML | away | 3.0 | 1.25 | +115 | 0 | 1 | 1 | -1 | -24 | -1.10 | L | -1.3u |
| 2026-05-15 | NBA | ML | away | 2.5 | 0.50 | +145 | 6 | 1 | 7 | 5 | 35 | -0.50 | W | +0.8u |
| 2026-05-15 | NBA | TOTAL | over | 4.0 | 0.75 | -109 | 0 | 1 | 1 | 2 | -14 | 0.00 | L | -0.8u |
| 2026-05-15 | NBA | SPREAD | home | 2.5 | 1.00 | -105 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -1.0u |
| 2026-05-15 | NBA | TOTAL | over | 5.0 | 2.00 | -110 | 1 | 0 | 1 | 3 | 0 | 0.00 | W | +1.9u |
| 2026-05-16 | MLB | ML | away | 5.0 | 4.50 | +124 | 3 | 1 | 4 | 4 | -25 | -1.30 | W | +1.4u |
| 2026-05-16 | MLB | SPREAD | away | 4.0 | 1.65 | -175 | 2 | 0 | 2 | 2 | -3 | 0.00 | W | +0.9u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +119 | 2 | 1 | 3 | 1 | -19 | -2.00 | L | -2.5u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +115 | 3 | 2 | 5 | 2 | -3 | -1.10 | W | +2.8u |
| 2026-05-16 | MLB | TOTAL | over | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -1.6u |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.50 | -102 | 1 | 0 | 1 | 1 | -46 | 0.00 | W | +0.5u |
| 2026-05-17 | MLB | ML | away | 4.0 | 2.75 | -148 | 1 | 0 | 1 | 2 | 5 | -0.70 | W | +1.9u |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.50 | +139 | 0 | 1 | 1 | 0 | -43 | 0.70 | L | -0.5u |
| 2026-05-17 | MLB | ML | away | 5.0 | 5.00 | -129 | 3 | 1 | 4 | 1 | -19 | 0.40 | L | -5.0u |
| 2026-05-17 | MLB | ML | home | 4.0 | 2.75 | -114 | 3 | 1 | 4 | 4 | -13 | 2.20 | W | +2.4u |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 1 | 3 | 2 | -25 | 0.00 | W | +2.0u |
| 2026-05-17 | MLB | TOTAL | over | 5.0 | 2.50 | +107 | 2 | 2 | 4 | 1 | -19 | 0.00 | L | -2.5u |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | 3 | 0.00 | W | +0.3u |
| 2026-05-17 | NBA | ML | away | 3.0 | 1.25 | +165 | 3 | 1 | 4 | 3 | 3 | -0.60 | W | +0.8u |
| 2026-05-17 | NBA | TOTAL | under | 5.0 | 0.75 | -110 | 2 | 3 | 5 | 0 | 28 | 0.00 | L | -0.8u |
| 2026-05-18 | MLB | ML | home | 4.5 | 5.00 | -111 | 2 | 1 | 3 | 2 | 5 | -1.10 | W | +4.4u |
| 2026-05-18 | MLB | ML | away | 4.0 | 2.50 | +120 | 2 | 0 | 2 | 1 | -19 | -2.10 | L | -2.5u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | -118 | 2 | 0 | 2 | 1 | -19 | 1.00 | W | +1.1u |
| 2026-05-18 | MLB | ML | home | 4.0 | 2.75 | -150 | 2 | 0 | 2 | 1 | 24 | -0.80 | L | -2.8u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | +132 | 2 | 0 | 2 | 2 | -4 | 0.40 | W | +1.6u |
| 2026-05-18 | NBA | ML | home | 5.0 | 5.00 | -240 | 3 | 2 | 5 | 4 | 20 | -1.60 | L | -5.0u |
| 2026-05-18 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 1 | 2 | 0 | 18 | 0.20 | L | -1.0u |
| 2026-05-18 | NHL | ML | home | 5.0 | 5.00 | -112 | 2 | 2 | 4 | 2 | 6 | -1.10 | L | -5.0u |
| 2026-05-18 | NHL | TOTAL | under | 4.5 | 2.25 | -110 | 3 | 1 | 4 | 1 | 8 | 0.00 | W | +2.0u |
| 2026-05-19 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 1 | -24 | -1.30 | L | -2.5u |
| 2026-05-19 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | 3 | 0.00 | W | +1.5u |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.50 | +105 | 1 | 1 | 2 | 2 | -22 | -0.90 | L | -2.5u |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 1 | 1 | 2 | 0 | -13 | -1.20 | W | +1.2u |
| 2026-05-19 | NBA | ML | home | 5.0 | 5.00 | -260 | 0 | 3 | 3 | 3 | 7 | -0.50 | W | +1.9u |
| 2026-05-19 | NBA | SPREAD | away | 5.0 | 2.25 | -105 | 3 | 2 | 5 | 2 | -5 | -0.90 | L | -2.3u |
| 2026-05-19 | NBA | TOTAL | under | 5.0 | 3.00 | -106 | 2 | 3 | 5 | 2 | 13 | 0.00 | L | -3.0u |
| 2026-05-20 | MLB | ML | away | 5.0 | 2.50 | +113 | 2 | 1 | 3 | 1 | -19 | -1.00 | L | -2.5u |
| 2026-05-20 | MLB | ML | home | 4.0 | 2.75 | -154 | 2 | 0 | 2 | 1 | 24 | -1.50 | W | +1.9u |
| 2026-05-20 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -0.8u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | -140 | 1 | 1 | 2 | 1 | -19 | -1.10 | W | +0.9u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | +111 | 0 | 1 | 1 | -1 | -24 | 0.00 | W | +0.6u |
| 2026-05-20 | MLB | ML | away | 4.0 | 2.75 | +113 | 1 | 1 | 2 | 0 | -43 | -1.00 | L | -2.8u |
| 2026-05-20 | NBA | ML | home | 5.0 | 5.00 | -225 | 10 | 5 | 15 | 1 | 18 | -0.20 | W | +2.1u |
| 2026-05-20 | NBA | SPREAD | home | 5.0 | 3.00 | -106 | 6 | 1 | 7 | 4 | 40 | -0.70 | W | +2.7u |
| 2026-05-20 | NBA | TOTAL | over | 5.0 | 1.65 | -112 | 3 | 1 | 4 | 3 | 37 | 0.00 | W | +1.5u |
| 2026-05-20 | NHL | ML | home | 2.5 | 1.25 | -192 | 0 | 1 | 1 | 1 | 2 | -0.80 | L | -1.3u |
| 2026-05-21 | MLB | ML | home | 5.0 | 2.50 | +125 | 1 | 1 | 2 | 2 | -22 | -0.40 | L | -2.5u |
| 2026-05-21 | MLB | SPREAD | home | 3.0 | 0.75 | -148 | 0 | 0 | 0 | 1 | -19 | -1.50 | L | -0.8u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +172 | 2 | 0 | 2 | 1 | -19 | -0.50 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 4.5 | 2.75 | -110 | 2 | 1 | 3 | 1 | -19 | -0.50 | W | +2.5u |
| 2026-05-21 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 0 | 0 | 2 | -10 | 0.00 | W | +0.3u |
| 2026-05-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 3 | 1 | 4 | 2 | -25 | -0.40 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +129 | 1 | 0 | 1 | 3 | -47 | -0.40 | W | +1.6u |
| 2026-05-21 | MLB | SPREAD | away | 4.0 | 1.65 | -170 | 1 | 1 | 2 | 1 | -6 | 0.30 | W | +1.0u |
| 2026-05-21 | NBA | SPREAD | away | 5.0 | 3.00 | -110 | 4 | 2 | 6 | 3 | 17 | 0.70 | L | -3.0u |
| 2026-05-21 | NHL | ML | home | 4.0 | 2.75 | -197 | 4 | 1 | 5 | 1 | 8 | -1.30 | L | -2.8u |
| 2026-05-21 | NHL | TOTAL | over | 3.0 | 0.75 | +103 | 1 | 0 | 1 | 1 | 8 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 5.0 | 1.25 | -175 | 1 | 0 | 1 | 1 | 24 | -0.90 | L | -1.3u |
| 2026-05-22 | MLB | ML | home | 4.0 | 1.25 | -195 | 3 | 0 | 3 | 0 | 0 | 0.80 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 3.0 | 1.25 | -137 | 1 | 0 | 1 | 1 | -24 | 0.00 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -144 | 4 | 2 | 6 | 2 | 5 | -1.60 | L | -5.0u |
| 2026-05-22 | MLB | SPREAD | home | 5.0 | 0.75 | -155 | 2 | 0 | 2 | 1 | -19 | -0.30 | W | +0.4u |
| 2026-05-22 | MLB | ML | home | 5.0 | 2.75 | -158 | 1 | 0 | 1 | 1 | 24 | -0.80 | W | +1.7u |
| 2026-05-22 | MLB | SPREAD | home | 3.0 | 0.75 | -142 | 1 | 0 | 1 | 1 | -19 | -2.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -145 | 2 | 2 | 4 | 1 | 24 | -2.20 | L | -5.0u |
| 2026-05-22 | MLB | ML | home | 2.5 | 0.50 | +139 | 2 | 1 | 3 | 0 | -30 | -0.90 | W | +0.7u |
| 2026-05-22 | MLB | SPREAD | home | 4.0 | 1.65 | -119 | 1 | 1 | 2 | 1 | -19 | -1.20 | W | +1.3u |
| 2026-05-22 | MLB | ML | away | 5.0 | 1.50 | +185 | 3 | 0 | 3 | 2 | -22 | -1.10 | L | -1.5u |
| 2026-05-22 | MLB | SPREAD | away | 3.0 | 0.75 | -112 | 1 | 0 | 1 | 1 | -19 | -1.40 | W | +0.6u |
| 2026-05-22 | NBA | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | -3 | -34 | 0.00 | L | -5.0u |
| 2026-05-22 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 0 | 1 | -2 | 7 | -0.50 | L | -1.0u |
| 2026-05-22 | NBA | TOTAL | over | 5.0 | 0.75 | +101 | 2 | 1 | 3 | 1 | 10 | 0.00 | W | +0.7u |
| 2026-05-22 | NHL | ML | home | 4.5 | 3.75 | -167 | 4 | 3 | 7 | 4 | 4 | 0.00 | L | -3.8u |
| 2026-05-22 | NHL | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 1 | 4 | 0 | 0 | 0.00 | W | +2.5u |
| 2026-05-23 | MLB | ML | home | 2.5 | 0.50 | -181 | 1 | 0 | 1 | 2 | 21 | -1.70 | W | +0.3u |
| 2026-05-23 | MLB | ML | away | 2.5 | 2.75 | +109 | 2 | 0 | 2 | 2 | -27 | -0.50 | L | -2.8u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -110 | 0 | 1 | 1 | 0 | -6 | 0.00 | W | +0.3u |
| 2026-05-23 | MLB | ML | home | 5.0 | 1.00 | -148 | 0 | 0 | 0 | 1 | -24 | -0.20 | L | -1.0u |
| 2026-05-23 | MLB | SPREAD | away | 3.0 | 0.75 | -163 | 1 | 0 | 1 | 1 | -19 | 0.00 | W | +0.5u |
| 2026-05-23 | MLB | TOTAL | under | 5.0 | 3.00 | -110 | 3 | 1 | 4 | 2 | -19 | 0.00 | W | +2.7u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | -3 | -0.90 | L | -0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 1 | 3 | 1 | -19 | 0.00 | L | -0.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 1.50 | -209 | 0 | 0 | 0 | 2 | -22 | 29.00 | W | +2.5u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | +102 | 0 | 0 | 0 | 1 | -3 | 0.00 | W | +0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -19 | 0.00 | W | +0.7u |
| 2026-05-23 | MLB | ML | away | 2.5 | 1.25 | -111 | -1 | 1 | 0 | 1 | 11 | 0.40 | L | -1.3u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -135 | 0 | 0 | 0 | 1 | -3 | 0.40 | W | +0.6u |
| 2026-05-23 | MLB | TOTAL | under | 2.5 | 0.30 | +108 | 0 | 0 | 0 | 0 | -9 | 0.00 | P | +0.0u |
| 2026-05-23 | MLB | ML | home | 4.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | -10 | 1.10 | W | +2.9u |
| 2026-05-23 | MLB | ML | away | 3.0 | 1.25 | +166 | 2 | 1 | 3 | 2 | -25 | -0.30 | W | +1.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 2.25 | -123 | 1 | 0 | 1 | 2 | -9 | -0.90 | W | +1.6u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -111 | 1 | 0 | 1 | 0 | -6 | 0.00 | L | -0.3u |
| 2026-05-23 | NBA | SPREAD | home | 5.0 | 3.00 | -107 | 5 | 1 | 6 | 2 | 23 | 0.20 | L | -3.0u |
| 2026-05-23 | NBA | TOTAL | under | 5.0 | 3.00 | +102 | 1 | -1 | 0 | 6 | 4 | 0.00 | L | -3.0u |
| 2026-05-23 | NHL | ML | home | 5.0 | 5.00 | -205 | 8 | 0 | 8 | 4 | 7 | -0.70 | W | +2.4u |
| 2026-05-23 | NHL | TOTAL | under | 3.0 | 0.30 | -110 | 1 | 1 | 2 | 0 | -1 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | home | 4.5 | 3.75 | -101 | 2 | 1 | 3 | 2 | -25 | 0.00 | L | -3.8u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -189 | 1 | 0 | 1 | 1 | 24 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 1 | 0 | 1 | 2 | 6 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 1 | 2 | 0 | -29 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | 1 | -6 | 0.00 | W | +4.3u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | 4 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 0 | 1 | 1 | 6 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 2.5 | 0.50 | +144 | 1 | 1 | 2 | -1 | -48 | 0.00 | L | -0.5u |
| 2026-05-24 | MLB | SPREAD | home | 4.0 | 1.65 | -110 | 2 | 1 | 3 | 2 | -22 | -1.30 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -107 | 1 | 0 | 1 | 1 | 6 | 0.00 | W | +1.2u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 1.00 | -101 | 1 | 1 | 2 | 1 | -3 | 0.00 | W | +0.0u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 0.30 | -104 | 0 | 0 | 0 | 1 | 12 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | away | 4.0 | 1.25 | +148 | 2 | 2 | 4 | 0 | -21 | -1.40 | W | +1.9u |
| 2026-05-24 | MLB | ML | away | 3.0 | 1.25 | -122 | -1 | 1 | 0 | 0 | -37 | -1.10 | L | -1.3u |
| 2026-05-24 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 2 | -14 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | SPREAD | home | 3.0 | 0.75 | +134 | 1 | 0 | 1 | 1 | -8 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | -24 | 0.00 | W | +0.7u |
| 2026-05-24 | NBA | SPREAD | away | 5.0 | 1.65 | -103 | 3 | 0 | 3 | 1 | 2 | 0.50 | L | -1.6u |
| 2026-05-24 | NBA | TOTAL | over | 4.5 | 3.00 | -107 | 2 | 1 | 3 | 2 | -20 | 0.00 | L | -3.0u |
| 2026-05-24 | NHL | ML | away | 4.0 | 2.75 | -136 | 3 | 0 | 3 | 1 | 4 | -0.70 | L | -2.8u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -149 | 1 | 0 | 1 | 3 | -3 | -0.70 | L | -5.0u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -310 | 2 | 0 | 2 | 1 | 24 | -1.20 | W | +1.6u |
| 2026-05-25 | MLB | TOTAL | over | 4.0 | 1.65 | +103 | 1 | 0 | 1 | 2 | 3 | 0.00 | L | -1.6u |
| 2026-05-25 | MLB | ML | home | 4.0 | 1.25 | -125 | 1 | -1 | 0 | 1 | -21 | -1.90 | L | -1.3u |
| 2026-05-25 | MLB | SPREAD | away | 4.0 | 1.65 | -184 | 1 | 0 | 1 | 1 | -6 | 28.40 | W | +2.4u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 2.25 | -112 | 4 | 0 | 4 | 4 | -13 | 0.00 | L | -2.3u |
| 2026-05-25 | MLB | ML | home | 5.0 | 1.25 | -160 | 3 | 0 | 3 | 2 | -43 | -1.10 | L | -1.3u |
| 2026-05-25 | MLB | TOTAL | over | 5.0 | 3.00 | -110 | 3 | 0 | 3 | 3 | 7 | 0.00 | W | +2.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 3.75 | -108 | 0 | 0 | 0 | 3 | -46 | -1.70 | L | -3.8u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -124 | 2 | 0 | 2 | 2 | -22 | -1.30 | W | +0.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 5.00 | -119 | 2 | -1 | 1 | 4 | -12 | -0.60 | W | +3.1u |
| 2026-05-25 | MLB | ML | away | 2.5 | 2.75 | -113 | 0 | 0 | 0 | 0 | 6 | -1.80 | W | +1.1u |
| 2026-05-25 | MLB | ML | home | 4.0 | 5.00 | -209 | -1 | 0 | -1 | 3 | -3 | -0.80 | W | +2.3u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 0.75 | -101 | 2 | 1 | 3 | 1 | 3 | 0.00 | W | +0.7u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -178 | 1 | 0 | 1 | 2 | -22 | -1.60 | W | +0.9u |
| 2026-05-25 | NBA | ML | away | 5.0 | 5.00 | -125 | 0 | 0 | 0 | 3 | 31 | -0.40 | W | +4.0u |
| 2026-05-25 | NBA | TOTAL | under | 5.0 | 3.00 | -110 | 2 | 2 | 4 | 0 | -2 | 0.00 | L | -3.0u |
| 2026-05-25 | NHL | ML | home | 5.0 | 2.50 | +120 | 8 | 4 | 12 | 1 | -5 | -0.60 | L | -2.5u |
| 2026-05-25 | NHL | SPREAD | home | 4.5 | 2.25 | -215 | 1 | 1 | 2 | 1 | 1 | -0.80 | W | +1.1u |
| 2026-05-26 | MLB | TOTAL | over | 5.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | -22 | 0.00 | W | +1.5u |
| 2026-05-26 | MLB | ML | away | 5.0 | 1.50 | +200 | 2 | 0 | 2 | 2 | -22 | -1.00 | L | -1.5u |
| 2026-05-26 | MLB | SPREAD | away | 5.0 | 1.00 | -101 | 2 | 1 | 3 | 2 | -22 | 0.50 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 2.5 | 1.25 | +113 | 0 | 0 | 0 | 0 | 27 | -1.50 | W | +1.4u |
| 2026-05-26 | MLB | ML | home | 2.5 | 1.25 | -130 | 1 | 0 | 1 | 0 | 27 | -1.30 | W | +1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -200 | 1 | 0 | 1 | 2 | 21 | -0.60 | W | +1.9u |
| 2026-05-26 | MLB | SPREAD | home | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 2 | 3 | -0.20 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -102 | 3 | 1 | 4 | 3 | -27 | -0.50 | W | +4.9u |
| 2026-05-26 | MLB | ML | home | 5.0 | 3.75 | -108 | 3 | 1 | 4 | 3 | -6 | -0.20 | L | -3.8u |
| 2026-05-26 | MLB | ML | home | 5.0 | 5.00 | -105 | 2 | 1 | 3 | 2 | 21 | -2.00 | W | +3.6u |
| 2026-05-26 | MLB | ML | away | 5.0 | 2.50 | +116 | 1 | 0 | 1 | 2 | 21 | -1.00 | W | +2.9u |
| 2026-05-26 | NBA | ML | home | 5.0 | 5.00 | -198 | 2 | 4 | 6 | 2 | 12 | -0.70 | W | +1.9u |
| 2026-05-26 | NBA | SPREAD | home | 5.0 | 1.00 | -110 | 2 | 2 | 4 | 3 | 22 | 1.20 | W | +0.0u |
| 2026-05-26 | NBA | TOTAL | over | 5.0 | 3.00 | -108 | 0 | 0 | 0 | 3 | 0 | 0.00 | W | +2.6u |
| 2026-05-26 | NHL | SPREAD | home | 5.0 | 2.25 | -250 | 2 | 0 | 2 | 2 | 4 | 0.80 | W | +0.9u |
| 2026-05-27 | MLB | ML | home | 4.5 | 0.50 | -102 | 3 | 1 | 4 | 3 | 35 | -1.10 | W | +0.4u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 2.50 | +141 | 1 | 1 | 2 | 4 | -19 | 0.80 | L | -2.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.00 | +105 | 2 | 0 | 2 | 2 | -22 | 0.00 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 4.5 | 3.75 | -420 | 1 | 1 | 2 | 1 | 24 | -0.50 | W | +0.7u |
| 2026-05-27 | MLB | ML | home | 3.0 | 1.25 | -144 | -1 | -1 | -2 | 0 | -18 | -1.00 | L | -1.3u |
| 2026-05-27 | MLB | ML | away | 5.0 | 0.50 | -102 | 3 | 0 | 3 | 2 | 11 | -1.00 | L | -0.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | -3 | 0.40 | W | +0.5u |
| 2026-05-27 | MLB | TOTAL | under | 5.0 | 1.00 | -112 | 3 | 1 | 4 | 3 | -21 | 0.00 | W | +0.0u |
| 2026-05-27 | MLB | ML | away | 4.0 | 1.00 | -108 | 1 | -1 | 0 | 0 | 40 | -0.90 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 5.0 | 0.50 | +132 | 2 | 0 | 2 | 2 | 8 | -0.50 | L | -0.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.65 | +104 | 2 | 0 | 2 | 2 | 3 | 0.00 | W | +1.7u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 0.75 | +104 | 2 | 0 | 2 | 2 | 3 | 0.00 | W | +0.8u |
| 2026-05-27 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 2 | 5 | 3 | -24 | -0.30 | L | -2.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.5 | 1.65 | -145 | 1 | 1 | 2 | 1 | -3 | -0.30 | W | +1.1u |
| 2026-05-27 | MLB | ML | away | 5.0 | 5.00 | -126 | 2 | 0 | 2 | 2 | -3 | -4.10 | L | -5.0u |
| 2026-05-27 | MLB | ML | home | 4.0 | 1.25 | -190 | 1 | 0 | 1 | 1 | 24 | -0.70 | W | +0.7u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 3.00 | -135 | 0 | 0 | 0 | 3 | 0 | -0.90 | W | +2.2u |
| 2026-05-27 | NHL | SPREAD | home | 5.0 | 1.00 | -194 | 3 | 0 | 3 | 2 | 2 | 0.00 | L | -1.0u |
| 2026-05-27 | NHL | TOTAL | over | 5.0 | 2.25 | -112 | 3 | 0 | 3 | 1 | -1 | 0.00 | L | -2.3u |
| 2026-05-28 | MLB | TOTAL | over | 5.0 | 3.00 | +101 | 3 | -1 | 2 | 3 | 26 | 0.00 | W | +2.5u |
| 2026-05-28 | MLB | ML | home | 5.0 | 1.25 | -140 | 2 | 0 | 2 | 2 | -20 | -0.50 | L | -1.3u |
| 2026-05-28 | MLB | TOTAL | under | 5.0 | 1.00 | -107 | 1 | 0 | 1 | 1 | 37 | 0.00 | W | +0.0u |
| 2026-05-28 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 1 | 4 | 2 | -70 | -0.60 | L | -2.5u |
| 2026-05-28 | MLB | TOTAL | over | 2.5 | 1.65 | -108 | 2 | 0 | 2 | 2 | -22 | 0.00 | L | -1.6u |
| 2026-05-28 | NBA | SPREAD | away | 5.0 | 1.00 | -110 | 1 | 2 | 3 | 0 | 1 | -0.90 | L | -1.0u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.50 | +118 | 5 | 1 | 6 | 5 | 15 | -0.90 | L | -2.5u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 0.75 | -135 | 2 | 0 | 2 | 1 | -23 | 1.00 | L | -0.8u |
| 2026-05-29 | MLB | ML | home | 5.0 | 3.75 | -124 | 2 | 1 | 3 | 3 | 2 | -1.00 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 1.65 | -106 | 2 | 0 | 2 | 3 | 3 | 0.00 | L | -1.6u |
| 2026-05-29 | MLB | ML | home | 4.0 | 2.50 | +120 | 1 | 0 | 1 | 1 | -3 | 0.40 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 2.25 | -112 | 2 | 0 | 2 | 3 | 31 | 0.00 | W | +2.0u |
| 2026-05-29 | MLB | SPREAD | away | 4.0 | 0.75 | +150 | 0 | 0 | 0 | 1 | -3 | -0.50 | L | -0.8u |
| 2026-05-29 | MLB | ML | away | 5.0 | 2.50 | +140 | 2 | 1 | 3 | 1 | -22 | 1.00 | L | -2.5u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 1.65 | -103 | 0 | 0 | 0 | 2 | -22 | 0.00 | W | +1.6u |
| 2026-05-29 | MLB | ML | away | 4.5 | 1.25 | -142 | 0 | 1 | 1 | -1 | 27 | -1.20 | W | +0.3u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 1.65 | -135 | 1 | 0 | 1 | 2 | -22 | 0.40 | W | +1.2u |
| 2026-05-29 | MLB | ML | home | 4.5 | 1.25 | -134 | 1 | 0 | 1 | 0 | -7 | -1.70 | W | +2.8u |
| 2026-05-29 | MLB | SPREAD | away | 5.0 | 2.25 | -184 | 0 | 0 | 0 | 2 | 0 | -1.00 | W | +1.2u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 0.75 | -109 | 1 | 0 | 1 | 2 | 3 | 0.00 | W | +0.7u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.75 | -106 | 2 | 1 | 3 | 2 | 36 | 0.70 | L | -2.8u |
| 2026-05-29 | MLB | SPREAD | home | 4.0 | 1.65 | -175 | 0 | 0 | 0 | 2 | -22 | -0.80 | L | -1.6u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 0.30 | +105 | 2 | 1 | 3 | 1 | 12 | 0.00 | W | +0.3u |
| 2026-05-29 | MLB | ML | home | 4.5 | 3.75 | -122 | 0 | 1 | 1 | 1 | 2 | -0.60 | L | -3.8u |
| 2026-05-29 | MLB | TOTAL | over | 3.0 | 1.00 | -108 | 0 | 0 | 0 | 1 | -3 | 0.00 | W | +1.5u |
| 2026-05-29 | NHL | ML | away | 5.0 | 1.00 | +205 | 3 | 0 | 3 | 0 | -2 | -0.60 | L | -1.0u |
| 2026-05-29 | NHL | SPREAD | away | 5.0 | 3.00 | -118 | 3 | 1 | 4 | 1 | -5 | 0.00 | L | -3.0u |
| 2026-05-29 | NHL | TOTAL | under | 5.0 | 2.25 | -106 | 2 | 0 | 2 | 2 | -2 | 0.00 | L | -2.3u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +132 | 2 | 1 | 3 | 2 | -25 | 0.00 | L | -2.5u |
| 2026-05-30 | MLB | ML | away | 4.5 | 2.75 | -125 | 1 | 2 | 3 | 1 | 3 | -0.60 | W | +2.3u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -130 | 1 | 0 | 1 | 2 | -19 | -1.20 | L | -5.0u |
| 2026-05-30 | MLB | ML | away | 4.0 | 3.75 | -132 | 1 | 1 | 2 | 1 | 48 | -1.00 | W | +2.9u |
| 2026-05-30 | MLB | SPREAD | home | 3.0 | 0.75 | -143 | 0 | 1 | 1 | 0 | -3 | -1.40 | L | -0.8u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -118 | 1 | 1 | 2 | 1 | -24 | -1.30 | L | -3.8u |
| 2026-05-30 | MLB | SPREAD | away | 4.0 | 1.00 | +152 | 1 | 0 | 1 | 1 | -3 | 0.20 | L | -1.0u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | 3 | -46 | -1.10 | W | +4.2u |
| 2026-05-30 | MLB | TOTAL | over | 4.5 | 0.75 | +100 | 1 | 1 | 2 | 1 | 3 | 0.00 | W | +0.8u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.75 | -130 | 0 | 1 | 1 | 0 | 27 | -1.60 | W | +0.4u |
| 2026-05-30 | MLB | TOTAL | over | 4.0 | 2.25 | -116 | 2 | 0 | 2 | 2 | 2 | 0.00 | W | +1.9u |
| 2026-05-30 | MLB | TOTAL | under | 4.0 | 1.65 | -107 | 1 | 0 | 1 | 1 | 5 | 0.00 | L | -1.6u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.50 | +129 | 1 | 0 | 1 | 1 | -19 | -0.90 | W | +0.7u |
| 2026-05-30 | MLB | SPREAD | home | 5.0 | 1.65 | -120 | 2 | 1 | 3 | 2 | -22 | -0.60 | W | +1.4u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +108 | 1 | 0 | 1 | 3 | -46 | -0.90 | W | +2.7u |
| 2026-05-30 | MLB | ML | home | 4.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | -19 | -0.20 | W | +0.6u |
| 2026-05-30 | MLB | ML | home | 5.0 | 1.25 | -102 | 2 | 0 | 2 | 2 | 5 | -0.70 | W | +1.2u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -122 | 1 | 1 | 2 | 2 | -27 | -0.20 | L | -3.8u |
| 2026-05-30 | MLB | TOTAL | under | 3.0 | 0.75 | -108 | 0 | 0 | 0 | 1 | -3 | 0.00 | L | -0.8u |
| 2026-05-30 | NBA | ML | home | 5.0 | 1.00 | -154 | 3 | 3 | 6 | 0 | 3 | 0.00 | L | -1.0u |
| 2026-05-30 | NBA | TOTAL | under | 5.0 | 2.50 | -109 | 5 | 0 | 5 | 6 | 9 | 0.00 | L | -2.5u |
| 2026-05-31 | MLB | ML | away | 3.0 | 2.75 | -125 | -2 | 0 | -2 | 1 | -21 | -1.20 | L | -2.8u |
| 2026-05-31 | MLB | TOTAL | under | 5.0 | 1.65 | -114 | 2 | 0 | 2 | 3 | -16 | 0.00 | L | -1.6u |
| 2026-05-31 | MLB | ML | home | 2.5 | 2.75 | -115 | 1 | 1 | 2 | 1 | 22 | 0.00 | W | +2.4u |
| 2026-05-31 | MLB | ML | away | 5.0 | 1.00 | +115 | -1 | 0 | -1 | 2 | -27 | -0.60 | L | -1.0u |
| 2026-05-31 | MLB | SPREAD | away | 5.0 | 1.00 | -117 | 3 | 1 | 4 | 3 | -16 | -0.20 | L | -1.0u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -164 | 0 | 1 | 1 | 2 | -27 | -1.20 | W | +2.3u |
| 2026-05-31 | MLB | ML | away | 3.0 | 1.25 | -184 | 0 | 0 | 0 | 0 | -21 | -1.70 | W | +0.7u |
| 2026-05-31 | MLB | ML | home | 2.5 | 1.25 | -232 | 0 | 0 | 0 | 1 | 24 | -0.50 | W | +0.5u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -102 | 0 | 1 | 1 | 2 | -57 | 0.20 | W | +4.9u |
| 2026-05-31 | MLB | TOTAL | over | 4.0 | 1.00 | +101 | 2 | 1 | 3 | 2 | -10 | 0.00 | L | -1.0u |
| 2026-05-31 | MLB | ML | away | 4.5 | 2.50 | +110 | 0 | 0 | 0 | 0 | -21 | -1.10 | L | -2.5u |
| 2026-06-01 | MLB | ML | home | 4.5 | 3.00 | -155 | 3 | 2 | 5 | 3 | 21 | -1.00 | W | +2.1u |
| 2026-06-01 | MLB | ML | away | 4.0 | 1.00 | +135 | 2 | 2 | 4 | 3 | 43 | -0.20 | W | +1.4u |
| 2026-06-01 | MLB | ML | away | 5.0 | 2.50 | +160 | 2 | -1 | 1 | 2 | 47 | -1.30 | W | +2.7u |
| 2026-06-01 | MLB | TOTAL | under | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 2 | -37 | 0.00 | L | -1.0u |
| 2026-06-01 | MLB | ML | home | 3.0 | 0.50 | -142 | -1 | 0 | -1 | -1 | 25 | -0.40 | L | -0.5u |
| 2026-06-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 6 | 0.00 | L | -5.0u |
| 2026-06-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 2 | -28 | 0.00 | W | +2.7u |
| 2026-06-02 | MLB | ML | home | 2.5 | 0.25 | -215 | -1 | 0 | -1 | 0 | -7 | -1.40 | L | -0.3u |
| 2026-06-02 | MLB | TOTAL | under | 4.0 | 1.00 | -117 | 1 | 0 | 1 | 0 | 9 | 0.00 | L | -1.0u |
| 2026-06-02 | MLB | ML | away | 5.0 | 2.50 | +130 | 2 | 0 | 2 | 0 | 67 | -0.60 | W | +3.1u |
| 2026-06-02 | MLB | ML | away | 3.0 | 0.50 | +100 | 1 | 0 | 1 | 2 | 21 | -1.20 | W | +0.5u |
| 2026-06-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -3.0u |
| 2026-06-02 | MLB | ML | home | 4.0 | 1.00 | -112 | 1 | 0 | 1 | 1 | 24 | -1.10 | L | -1.0u |
| 2026-06-02 | MLB | ML | home | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 1 | 24 | -0.50 | L | -1.0u |
| 2026-06-02 | MLB | ML | away | 5.0 | 2.50 | +102 | 0 | -1 | -1 | 0 | 1 | 0.00 | L | -2.5u |
| 2026-06-02 | NHL | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 2 | 4 | 2 | 11 | 0.00 | W | +4.3u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -150 | 3 | 1 | 4 | 5 | -9 | -1.30 | W | +0.3u |
| 2026-06-03 | MLB | ML | away | 4.0 | 1.00 | +134 | -1 | -1 | -2 | -1 | 51 | -1.00 | W | +1.2u |
| 2026-06-03 | MLB | ML | away | 4.0 | 1.00 | +125 | 0 | -1 | -1 | 0 | 57 | 0.40 | W | +1.3u |
| 2026-06-03 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 37 | 0.00 | L | -3.0u |
| 2026-06-03 | MLB | ML | home | 4.5 | 1.50 | +167 | 0 | 0 | 0 | -1 | 24 | -0.40 | L | -1.5u |
| 2026-06-03 | MLB | SPREAD | away | 4.0 | 1.00 | -111 | 1 | 0 | 1 | 0 | 8 | 0.20 | W | +0.8u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -103 | 3 | 1 | 4 | 3 | 2 | -1.20 | L | -0.5u |
| 2026-06-03 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 0 | 0.00 | L | -5.0u |
| 2026-06-03 | MLB | ML | away | 3.0 | 0.50 | +119 | 1 | 0 | 1 | 1 | 24 | 0.00 | W | +0.6u |
| 2026-06-03 | MLB | ML | away | 4.5 | 3.00 | -137 | 0 | 0 | 0 | -1 | 46 | -1.50 | L | -3.0u |
| 2026-06-03 | MLB | ML | home | 5.0 | 5.00 | -215 | 0 | 1 | 1 | 0 | 48 | -1.00 | W | +2.3u |
| 2026-06-03 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 1 | 1 | 2 | 1 | -8 | 0.00 | L | -0.3u |
| 2026-06-03 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 1 | 0 | 1 | 0 | 9 | 0.00 | W | +2.5u |
| 2026-06-03 | MLB | ML | home | 4.5 | 3.00 | -112 | 0 | 0 | 0 | 1 | 24 | -0.90 | W | +2.7u |
| 2026-06-03 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 1 | 4 | 0.00 | W | +4.5u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -139 | 0 | 0 | 0 | -1 | 69 | -1.20 | W | +0.3u |
| 2026-06-03 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 1 | 0 | 1 | 0 | 9 | 0.00 | L | -2.5u |
| 2026-06-03 | NBA | ML | home | 2.5 | 0.25 | -198 | 3 | 4 | 7 | 5 | 15 | -1.20 | L | -0.3u |
| 2026-06-03 | NBA | SPREAD | away | 2.5 | 0.25 | -104 | 3 | -1 | 2 | 3 | -1 | -1.20 | W | +0.2u |
| 2026-06-04 | MLB | ML | away | 3.0 | 0.50 | +104 | 1 | 0 | 1 | 1 | 24 | 0.00 | W | +0.5u |
| 2026-06-04 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | -1 | 0 | 1 | 16 | 0.00 | L | -1.0u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | +102 | 0 | 0 | 0 | 1 | 24 | 0.00 | L | -1.0u |
| 2026-06-04 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 1 | 64 | -0.40 | W | +3.0u |
| 2026-06-04 | MLB | SPREAD | away | 5.0 | 5.00 | -111 | 0 | 0 | 0 | 1 | 5 | 0.00 | L | -5.0u |
| 2026-06-04 | MLB | ML | home | 5.0 | 5.00 | -131 | 1 | 0 | 1 | 1 | 64 | 0.20 | W | +3.5u |
| 2026-06-04 | MLB | ML | away | 2.5 | 0.25 | +105 | 0 | 0 | 0 | 0 | -21 | -1.00 | W | +0.2u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | -210 | 1 | 0 | 1 | 2 | 51 | -1.00 | W | +0.5u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | -188 | 0 | 0 | 0 | 0 | 27 | -1.10 | L | -1.0u |
| 2026-06-04 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-04 | MLB | ML | home | 3.0 | 0.50 | -235 | 4 | 0 | 4 | 4 | 10 | 0.00 | L | -0.5u |
| 2026-06-04 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 19 | 0.00 | L | -5.0u |
| 2026-06-04 | NHL | ML | home | 2.5 | 0.25 | -160 | -3 | 0 | -3 | 2 | 10 | -0.40 | W | +0.2u |
| 2026-06-05 | MLB | ML | home | 2.5 | 0.25 | -144 | 1 | 1 | 2 | 0 | 25 | -1.20 | L | -0.3u |
| 2026-06-05 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | -1 | -1 | -1 | 34 | 0.00 | W | +2.8u |
| 2026-06-05 | MLB | ML | away | 3.0 | 0.50 | +128 | 1 | 0 | 1 | 1 | 5 | 0.00 | W | +0.6u |
| 2026-06-05 | MLB | TOTAL | over | 4.0 | 1.00 | -109 | 0 | 0 | 0 | 0 | 9 | 0.00 | P | +0.0u |
| 2026-06-05 | MLB | ML | home | 3.0 | 0.50 | -136 | 1 | 0 | 1 | 2 | 24 | 0.00 | W | +0.4u |
| 2026-06-05 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 3 | 0 | 3 | 4 | -11 | 0.00 | W | +0.4u |
| 2026-06-05 | MLB | ML | away | 5.0 | 5.00 | -122 | 0 | 1 | 1 | 1 | 37 | -0.80 | L | -5.0u |
| 2026-06-05 | MLB | ML | home | 5.0 | 5.00 | -171 | 0 | 2 | 2 | 3 | 37 | -0.20 | W | +2.7u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -188 | 2 | 0 | 2 | 2 | 21 | -0.90 | W | +0.5u |
| 2026-06-05 | MLB | ML | away | 4.0 | 1.00 | -105 | 1 | 0 | 1 | 1 | 24 | 0.00 | L | -1.0u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -141 | 3 | 2 | 5 | 3 | 5 | 0.30 | W | +0.7u |
| 2026-06-05 | MLB | TOTAL | over | 5.0 | 2.50 | -110 | 0 | 1 | 1 | -1 | 43 | 0.00 | W | +2.5u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -172 | 1 | 0 | 1 | 1 | 24 | 0.00 | L | -1.0u |
| 2026-06-05 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 0 | -1 | -1 | 0 | 9 | 0.00 | W | +4.4u |
| 2026-06-05 | MLB | ML | away | 4.5 | 3.00 | -129 | -1 | 1 | 0 | -2 | 39 | -1.10 | W | +2.2u |
| 2026-06-05 | MLB | SPREAD | away | 3.0 | 0.50 | +126 | 1 | 0 | 1 | 1 | 5 | 0.00 | W | +0.6u |
| 2026-06-05 | NBA | ML | home | 2.5 | 0.25 | -230 | 2 | 2 | 4 | 4 | 18 | 1.00 | L | -0.3u |
| 2026-06-05 | NBA | SPREAD | home | 2.5 | 0.25 | -106 | 3 | 0 | 3 | 0 | 3 | -0.70 | L | -0.3u |
| 2026-06-06 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 1 | 0 | 1 | 0 | 28 | 0.00 | W | +0.2u |
| 2026-06-06 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 4 | 0.00 | W | +2.7u |
| 2026-06-06 | MLB | ML | home | 4.5 | 3.00 | -126 | 0 | 0 | 0 | 0 | 27 | -1.00 | W | +2.4u |
| 2026-06-06 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | -14 | 0.00 | W | +2.7u |
| 2026-06-06 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 1 | 1 | -1 | 24 | 0.00 | L | -1.0u |
| 2026-06-06 | MLB | ML | home | 3.0 | 0.50 | -130 | 0 | 0 | 0 | -1 | 12 | -0.90 | L | -0.5u |
| 2026-06-06 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 6 | 0.00 | L | -5.0u |
| 2026-06-06 | MLB | ML | home | 4.5 | 3.00 | -350 | 0 | 1 | 1 | 0 | 52 | -0.90 | W | +0.9u |
| 2026-06-06 | MLB | TOTAL | under | 5.0 | 2.50 | -110 | 0 | 0 | 0 | 0 | 19 | 0.00 | L | -2.5u |
| 2026-06-06 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 1 | 4 | 3 | -11 | 0.00 | W | +2.8u |
| 2026-06-06 | MLB | ML | home | 5.0 | 5.00 | -123 | 0 | 0 | 0 | 1 | 6 | 0.00 | W | +4.1u |
| 2026-06-06 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | L | -1.0u |
| 2026-06-06 | MLB | ML | home | 5.0 | 2.50 | +117 | -2 | -1 | -3 | -1 | 16 | 0.00 | L | -2.5u |
| 2026-06-06 | MLB | ML | home | 5.0 | 5.00 | -154 | 2 | 1 | 3 | 0 | 67 | -0.80 | L | -5.0u |
| 2026-06-07 | MLB | ML | home | 4.5 | 3.00 | -130 | 1 | 0 | 1 | 0 | 48 | -0.90 | W | +2.2u |
| 2026-06-07 | MLB | TOTAL | over | 3.0 | 0.50 | -112 | 0 | 0 | 0 | 3 | -4 | 0.00 | L | -0.5u |
| 2026-06-07 | MLB | ML | home | 5.0 | 5.00 | -143 | 1 | 0 | 1 | 1 | 5 | 0.00 | W | +3.5u |
| 2026-06-07 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | -14 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -136 | 1 | 0 | 1 | 0 | 48 | 0.00 | W | +0.7u |
| 2026-06-07 | MLB | ML | home | 4.5 | 3.00 | -165 | 2 | 2 | 4 | 3 | -3 | -1.10 | W | +1.8u |
| 2026-06-07 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 1 | 4 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | away | 2.5 | 0.25 | -107 | 1 | 0 | 1 | -1 | 62 | -0.80 | W | +0.2u |
| 2026-06-07 | MLB | TOTAL | over | 2.5 | 0.25 | -115 | 0 | 0 | 0 | -1 | -6 | 0.00 | W | +0.2u |
| 2026-06-07 | MLB | ML | home | 2.5 | 0.25 | -210 | -1 | 0 | -1 | 1 | 24 | 0.80 | L | -0.3u |
| 2026-06-07 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | -3 | 0.00 | L | -0.5u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | +158 | 1 | 0 | 1 | 3 | 14 | -1.30 | L | -0.5u |
| 2026-06-07 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 6 | 0.00 | W | +0.9u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -105 | 1 | 0 | 1 | 1 | 24 | 0.00 | L | -1.0u |
| 2026-06-07 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 6 | 0.00 | L | -5.0u |
| 2026-06-07 | MLB | SPREAD | away | 4.5 | 3.00 | -152 | 2 | 0 | 2 | 1 | 5 | -0.50 | W | +1.9u |
| 2026-06-07 | MLB | TOTAL | over | 5.0 | 2.25 | -114 | 1 | 1 | 2 | 1 | -12 | 0.00 | L | -2.3u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | +102 | 1 | 0 | 1 | -2 | 28 | -0.20 | W | +0.5u |
| 2026-06-07 | MLB | SPREAD | away | 4.5 | 2.25 | +164 | 1 | 1 | 2 | 1 | -3 | 29.50 | W | +3.7u |
| 2026-06-07 | MLB | ML | away | 2.5 | 0.25 | +103 | -1 | 0 | -1 | -2 | 0 | 0.20 | W | +0.3u |
| 2026-06-07 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | -1 | 0 | 1 | 14 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -102 | 2 | 0 | 2 | 0 | 27 | 0.50 | W | +1.0u |
| 2026-06-07 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 16 | 0.00 | W | +4.8u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | -127 | 0 | 1 | 1 | -1 | 62 | -1.90 | W | +0.4u |
| 2026-06-07 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | -3 | 0.00 | W | +0.5u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -113 | 6 | 1 | 7 | 5 | 25 | -0.50 | L | -3.0u |
| 2026-06-08 | MLB | ML | home | 4.5 | 3.00 | -129 | 3 | 0 | 3 | 1 | 64 | -0.40 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 9 | 0.00 | L | -3.0u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -121 | 1 | 1 | 2 | 1 | 32 | -1.60 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | P | +0.0u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -146 | 1 | 0 | 1 | 1 | 35 | -0.50 | W | +2.0u |
| 2026-06-08 | MLB | ML | home | 4.0 | 1.00 | -118 | 2 | 0 | 2 | 3 | -26 | -0.40 | L | -1.0u |
| 2026-06-08 | MLB | TOTAL | over | 4.5 | 2.50 | -116 | -2 | -2 | -4 | -1 | 40 | 0.00 | W | +2.5u |
| 2026-06-08 | MLB | ML | away | 4.5 | 1.50 | +151 | 0 | -1 | -1 | 1 | 6 | 0.00 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | under | 5.0 | 2.50 | +101 | 0 | 0 | 0 | 0 | 10 | 0.00 | W | +2.5u |
| 2026-06-08 | NBA | ML | home | 2.5 | 0.25 | -132 | 5 | 2 | 7 | 3 | 1 | -0.40 | L | -0.3u |
| 2026-06-08 | NBA | SPREAD | away | 5.0 | 5.00 | -110 | 3 | 2 | 5 | 2 | 6 | -1.30 | W | +4.3u |
| 2026-06-08 | NBA | TOTAL | under | 4.0 | 1.00 | -107 | 1 | 0 | 1 | 3 | 0 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 2.5 | 0.25 | +132 | 1 | 0 | 1 | 3 | 32 | -1.20 | L | -0.3u |
| 2026-06-09 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 19 | 0.00 | W | +4.3u |
| 2026-06-09 | MLB | ML | away | 3.0 | 0.50 | -148 | 1 | 0 | 1 | 3 | 18 | 0.00 | L | -0.5u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 4 | 20 | 0.80 | L | -1.0u |
| 2026-06-09 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 1 | 3 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -143 | 1 | 0 | 1 | 1 | 24 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | SPREAD | home | 4.5 | 3.00 | -117 | 1 | 0 | 1 | 1 | 5 | 0.00 | W | +2.6u |
| 2026-06-09 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 0 | 10 | 0.00 | W | +0.5u |
| 2026-06-09 | MLB | ML | away | 5.0 | 5.00 | -122 | 2 | 1 | 3 | 1 | 6 | 0.00 | W | +4.1u |
| 2026-06-09 | MLB | ML | away | 2.5 | 0.25 | -120 | 0 | 0 | 0 | 0 | 19 | 0.00 | L | -0.3u |
| 2026-06-09 | MLB | ML | home | 4.0 | 1.00 | -107 | 1 | 0 | 1 | 0 | 27 | -1.30 | L | -1.0u |
| 2026-06-09 | MLB | ML | home | 5.0 | 5.00 | -105 | 1 | -1 | 0 | 1 | 4 | 0.00 | W | +4.8u |
| 2026-06-09 | MLB | ML | away | 4.5 | 2.50 | +115 | 1 | 0 | 1 | 0 | 27 | -0.70 | L | -2.5u |
| 2026-06-09 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 6 | 0.00 | W | +2.7u |
| 2026-06-09 | MLB | ML | away | 3.0 | 0.50 | -116 | 1 | 0 | 1 | 1 | 5 | 0.00 | W | +0.4u |
| 2026-06-09 | MLB | ML | home | 5.0 | 2.50 | +100 | 4 | 2 | 6 | 1 | 4 | 0.00 | W | +2.5u |
| 2026-06-09 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | 1 | 7 | 0.00 | W | +4.5u |
| 2026-06-09 | MLB | ML | home | 4.0 | 1.00 | +102 | 2 | 0 | 2 | 2 | 3 | -1.20 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -119 | 1 | 0 | 1 | 0 | 48 | -0.80 | L | -1.0u |
| 2026-06-09 | NHL | SPREAD | away | 4.5 | 1.00 | +215 | 0 | 0 | 0 | 2 | 10 | 41.70 | W | +2.1u |
| 2026-06-09 | NHL | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 2 | 11 | 0.00 | L | -5.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 5 | 0.00 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 4.5 | 3.00 | -148 | 0 | 0 | 0 | 0 | 8 | -0.50 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | +136 | 3 | 0 | 3 | 5 | 46 | -1.10 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 1 | 3 | 0.00 | W | +0.9u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | -172 | 1 | 0 | 1 | 2 | 21 | -1.00 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | 4 | 0.00 | W | +4.5u |
| 2026-06-10 | MLB | ML | away | 3.0 | 0.50 | +136 | 0 | 0 | 0 | 0 | 9 | 0.00 | L | -0.5u |
| 2026-06-10 | MLB | TOTAL | under | 4.0 | 1.00 | -113 | 1 | 0 | 1 | 1 | -3 | 0.00 | L | -1.0u |
| 2026-06-10 | MLB | ML | home | 2.5 | 0.25 | -117 | 0 | 0 | 0 | 1 | -6 | 0.00 | W | +0.2u |
| 2026-06-10 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 1 | 4 | 0.00 | L | -5.0u |
| 2026-06-10 | MLB | ML | home | 4.0 | 1.00 | +178 | 1 | 0 | 1 | -2 | 36 | -1.40 | W | +1.7u |
| 2026-06-10 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 3 | 0 | 3 | 1 | 4 | 0.00 | W | +4.5u |
| 2026-06-10 | MLB | ML | away | 5.0 | 5.00 | -104 | 0 | 0 | 0 | 1 | 5 | -0.20 | L | -5.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | +148 | 0 | 0 | 0 | 0 | 27 | -0.80 | W | +1.5u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-10 | MLB | ML | home | 4.5 | 2.50 | +103 | 0 | 0 | 0 | 1 | 4 | 0.00 | W | +2.6u |
| 2026-06-10 | MLB | ML | home | 4.0 | 1.00 | -127 | 1 | 0 | 1 | 1 | 24 | 0.00 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 28 | 0.00 | W | +3.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | -120 | 1 | 0 | 1 | 1 | 24 | -0.40 | W | +0.8u |
| 2026-06-10 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | -1 | 0 | -1 | 1 | 5 | 0.00 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 5.0 | 5.00 | -106 | 1 | 0 | 1 | -1 | 51 | -0.70 | L | -5.0u |
| 2026-06-10 | MLB | SPREAD | home | 2.5 | 1.00 | -190 | 0 | 0 | 0 | 0 | -21 | -31.40 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 4 | 1 | 5 | -1 | 3 | 0.00 | L | -5.0u |
| 2026-06-10 | NBA | ML | away | 2.5 | 0.25 | +112 | -2 | 0 | -2 | -3 | -6 | 0.20 | L | -0.3u |
| 2026-06-10 | NBA | TOTAL | under | 2.5 | 0.25 | -108 | 4 | 1 | 5 | 3 | 9 | 0.00 | W | +0.2u |
| 2026-06-11 | MLB | ML | away | 4.0 | 1.00 | +112 | 0 | 0 | 0 | 0 | 10 | 0.00 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -120 | -1 | 0 | -1 | 4 | -25 | -1.70 | P | +0.0u |
| 2026-06-11 | MLB | SPREAD | away | 4.5 | 2.50 | +140 | 1 | 0 | 1 | 3 | -2 | -1.00 | P | +0.0u |
| 2026-06-11 | MLB | ML | home | 5.0 | 5.00 | — | 1 | 0 | 1 | 1 | -3 | 0.00 | L | -5.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -167 | 1 | -1 | 0 | 1 | 51 | -0.10 | W | +0.3u |
| 2026-06-11 | MLB | TOTAL | under | 5.0 | 1.00 | -108 | 1 | 1 | 2 | 1 | -10 | 0.00 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 5.0 | 1.00 | +110 | 3 | 1 | 4 | 3 | -3 | -0.90 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -111 | 1 | 0 | 1 | 1 | 24 | 0.00 | L | -0.5u |
| 2026-06-11 | MLB | ML | home | 5.0 | 5.00 | -131 | 2 | 1 | 3 | 1 | 4 | 0.00 | W | +3.8u |
| 2026-06-11 | MLB | ML | away | 4.0 | 1.00 | +100 | 1 | 0 | 1 | 1 | -35 | -0.50 | W | +1.0u |
| 2026-06-11 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | -1 | -2 | -1 | 13 | 0.00 | W | +0.2u |
| 2026-06-11 | NHL | TOTAL | under | 3.0 | 0.50 | -104 | 2 | 0 | 2 | 2 | 11 | 0.00 | P | +0.0u |
| 2026-06-12 | MLB | ML | home | 5.0 | 5.00 | -114 | 0 | 0 | 0 | 1 | 4 | 0.00 | W | +4.4u |
| 2026-06-12 | MLB | ML | home | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 1 | 0.00 | L | -3.0u |
| 2026-06-12 | MLB | TOTAL | over | 4.0 | 1.00 | +100 | 0 | 0 | 0 | 0 | 9 | 0.00 | L | -1.0u |
| 2026-06-12 | MLB | ML | home | 3.0 | 0.50 | -210 | 2 | 0 | 2 | 2 | 21 | -0.10 | W | +0.2u |
| 2026-06-12 | MLB | ML | away | 2.5 | 0.25 | +111 | 3 | 1 | 4 | 3 | -3 | -0.70 | L | -0.3u |
| 2026-06-12 | MLB | ML | away | 4.0 | 1.00 | -114 | 2 | 0 | 2 | 1 | 5 | -1.20 | W | +0.9u |
| 2026-06-12 | MLB | ML | home | 5.0 | 2.50 | +123 | 0 | 1 | 1 | 1 | -3 | 0.00 | W | +3.1u |
| 2026-06-12 | MLB | SPREAD | away | 4.0 | 1.00 | +121 | 0 | 0 | 0 | 1 | 1 | 0.40 | L | -1.0u |
| 2026-06-12 | MLB | ML | home | 4.5 | 3.00 | -138 | 1 | 0 | 1 | 0 | 27 | -1.00 | L | -3.0u |
| 2026-06-12 | MLB | SPREAD | home | 3.0 | 0.50 | -107 | 2 | 0 | 2 | 3 | 3 | -0.40 | W | +0.4u |
| 2026-06-12 | MLB | ML | away | 2.5 | 0.25 | +118 | -1 | 0 | -1 | -1 | 5 | -0.20 | L | -0.3u |
| 2026-06-12 | MLB | ML | away | 4.0 | 1.00 | -136 | 2 | 0 | 2 | 2 | 21 | -1.30 | W | +0.7u |
| 2026-06-12 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | -1 | -1 | 1 | 6 | 0.00 | W | +2.7u |
| 2026-06-12 | MLB | ML | home | 3.0 | 0.50 | -134 | 2 | 0 | 2 | 3 | 18 | -1.10 | W | +0.4u |
| 2026-06-12 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 4 | 0.00 | W | +2.7u |
| 2026-06-12 | MLB | SPREAD | away | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 0 | 8 | -1.00 | L | -1.0u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._