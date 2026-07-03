# Sharp Intel v6 — Full Analysis

_Auto-generated **7/3/2026, 11:00:12 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 1016 shipped+graded picks · 2026-04-18 → 2026-07-02  (HC analyses scoped to post-cutover 2026-04-30, 904 picks)
**Headline:** 503-503-10 · WR 50.0% [46.9%–53.1%] vs 52.4% break-even · -51.9u flat (-5.1%) · -208.0u peak.
**Overall t-test:** t = -1.67 → ~ p<.10.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.040 ✗**  (full sample, N=1010)
- **ρ(HC, flat ROI) = -0.002 ✗**  (post-cutover, N=904)
- **ρ(Δw+HC, flat ROI) = 0.005 ✗**  (post-cutover, N=904)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0 (full sample)** — N=278, 123-150, WR 45.1% [39%–51%], flat ROI -14.8% (t=-2.59 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=67, WR 47.8%, flat ROI -13.5%. Bayesian posterior WR ≈ 48.1%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=201, WR 59.2%, flat ROI +11.1%. Bayesian posterior WR ≈ 58.8%, half-Kelly = **6.7%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=138, WR 47.8%, flat ROI -10.2%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=151, WR 51.7%, flat ROI -0.9%. Bayesian posterior WR ≈ 51.6%, half-Kelly = **0.0%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -14.8% flat ROI on 278 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (0.97u/pick), we need **~1461 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 1016. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-07-02 |
| Sides scanned | 1869 |
| Shipped + graded | **1016** |
| W-L-P | 503-503-10 |
| Win rate | **50.0%** [46.9%–53.1%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +2.4 pp |
| Peak-units PnL | **-208.0u** |
| Flat-1u PnL | **-51.9u** (-5.1% flat ROI) |
| Flat t-statistic vs zero | -1.67 → ~ p<.10 |
| Flat 95% CI per-pick | [-0.111, 0.009]u |

### Power note

At our observed flat-PnL standard deviation (0.97u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4058 |
| +5% | 1461 |
| +10% | 366 |

We have **1016** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 13 | 4-9-0 | 30.8% [13–58] | -30.4% | -5.7u | -0.96 ✗ noise |
| Δw = −1 | 47 | 17-28-2 | 37.8% [25–52] | -26.9% | -19.0u | -1.98 ✓ p<.05 |
| Δw = 0 | 218 | 102-113-3 | 47.4% [41–54] | -11.3% | -58.8u | -1.76 ~ p<.10 |
| Δw = +1 | 404 | 208-193-3 | 51.9% [47–57] | -1.6% | -99.4u | -0.34 ✗ noise |
| Δw = +2 | 177 | 90-85-2 | 51.4% [44–59] | -2.1% | -24.1u | -0.28 ✗ noise |
| Δw ≥ +3 | 151 | 78-73-0 | 51.7% [44–59] | -0.9% | -4.9u | -0.10 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.054** ~ p<.10  ·  **ρ(Δw, flat ROI) = 0.040** ✗  (N=1010)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 1 | 1-0-0 | 100.0% [21–100] | +86.2% | +2.5u | 0.00 ✗ n<2 |
| HC = −1 | 35 | 19-16-0 | 54.3% [38–70] | +13.4% | +9.7u | 0.72 ✗ noise |
| HC = 0 | 600 | 281-310-9 | 47.5% [44–52] | -10.3% | -252.9u | -2.66 ✓ p<.01 |
| HC = +1 | 201 | 119-82-0 | 59.2% [52–66] | +11.1% | +33.5u | 1.64 ✗ noise |
| HC = +2 | 45 | 23-22-0 | 51.1% [37–65] | -3.3% | +6.9u | -0.23 ✗ noise |
| HC ≥ +3 | 22 | 9-13-0 | 40.9% [23–61] | -34.4% | +2.8u | -1.97 ✓ p<.05 |

**Pearson ρ(HC, WIN) = 0.021** ✗  ·  **ρ(HC, flat ROI) = -0.002** ✗  (N=904)

Spearman rank ρ(HC, flat ROI) = 0.029.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 223 | 99-120-4 | 45.2% [39–52] | -14.2% | -78.8u | -2.21 ✓ p<.05 |
| Σ = +1 | 318 | 162-153-3 | 51.4% [46–57] | -2.3% | -104.1u | -0.43 ✗ noise |
| Σ = +2 | 168 | 94-72-2 | 56.6% [49–64] | +6.3% | +2.8u | 0.86 ✗ noise |
| Σ = +3 | 82 | 39-43-0 | 47.6% [37–58] | -10.4% | -7.4u | -0.97 ✗ noise |
| Σ = +4 | 48 | 25-23-0 | 52.1% [38–66] | +2.1% | -8.7u | 0.15 ✗ noise |
| Σ = +5 | 27 | 16-11-0 | 59.3% [41–75] | +6.4% | +5.0u | 0.35 ✗ noise |
| Σ ≥ +6 | 38 | 17-21-0 | 44.7% [30–60] | -23.7% | -6.1u | -1.65 ~ p<.10 |

**Pearson ρ(Δw+HC, WIN) = 0.031** ✗  ·  **ρ(Σ, flat ROI) = 0.005** ✗  (N=904)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 904.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.030 ✗ | 0.008 ✗ | 0.021 | weak |
| HC margin | 0.021 ✗ | -0.002 ✗ | 0.029 | weak |
| Δw + HC | 0.031 ✗ | 0.005 ✗ | 0.033 | weak |
| peak.stars | -0.036 ✗ | -0.048 ✗ | -0.050 | weak |
| vault.star | 0.014 ✗ | -0.003 ✗ | -0.020 | weak |
| lock.stars | -0.032 ✗ | -0.044 ✗ | -0.042 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 904 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | N=1 · 1-0 · 100% [21–100] · —  | — | — | — | — | — |
| -1 | N=1 · 1-0 · 100% [21–100] · —  | N=1 · 0-1 · 0% [0–79] · —  | N=9 · 5-4 · 56% [27–81] · +15%  | N=8 · 5-3 · 63% [31–86] · +31%  | N=9 · 4-5 · 44% [19–73] · -21%  | N=3 · 2-1 · 67% [21–94] · +48%  | N=4 · 2-2 · 50% [15–85] · -1%  |
| +0 | N=2 · 1-1 · 50% [9–91] · —  | N=6 · 1-5 · 17% [3–56] · -62%  | N=23 · 6-15 · 29% [14–50] · -42% ✗ | N=153 · 70-81 · 46% [39–54] · -13%  | N=285 · 142-140 · 50% [45–56] · -4%  | N=90 · 46-42 · 52% [42–62] · -3%  | N=41 · 15-26 · 37% [24–52] · -31% ✗ |
| +1 | — | — | N=9 · 5-4 · 56% [27–81] · -6%  | N=30 · 18-12 · 60% [42–75] · +12%  | N=71 · 45-26 · 63% [52–74] · +21%  | N=45 · 25-20 · 56% [41–69] · +6%  | N=46 · 26-20 · 57% [42–70] · +4%  |
| +2 | — | N=1 · 0-1 · 0% [0–79] · —  | — | N=3 · 1-2 · 33% [6–79] · -47%  | N=5 · 1-4 · 20% [4–62] · -64%  | N=11 · 5-6 · 45% [21–72] · -7%  | N=25 · 16-9 · 64% [45–80] · +20%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | N=1 · 1-0 · 100% [21–100] · —  | N=3 · 1-2 · 33% [6–79] · -50%  | N=17 · 6-11 · 35% [17–59] · -43% ✗ |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 1 | 1-0-0 | 100.0% [21–100] | +86.2% | +2.5u | 0.00 ✗ n<2 |
| HC = −1 | 35 | 19-16-0 | 54.3% [38–70] | +13.4% | +9.7u | 0.72 ✗ noise |
| HC = 0 | 600 | 281-310-9 | 47.5% [44–52] | -10.3% | -252.9u | -2.66 ✓ p<.01 |
| HC = +1 | 201 | 119-82-0 | 59.2% [52–66] | +11.1% | +33.5u | 1.64 ✗ noise |
| HC = +2 | 45 | 23-22-0 | 51.1% [37–65] | -3.3% | +6.9u | -0.23 ✗ noise |
| HC ≥ +3 | 22 | 9-13-0 | 40.9% [23–61] | -34.4% | +2.8u | -1.97 ✓ p<.05 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 12 | 4-8-0 | 33.3% [14–61] | -24.6% | -5.2u | -0.72 ✗ noise |
| Δw = −1 | 41 | 16-23-2 | 41.0% [27–57] | -21.3% | -14.5u | -1.45 ✗ noise |
| Δw = 0 | 195 | 95-98-2 | 49.2% [42–56] | -8.0% | -45.4u | -1.17 ✗ noise |
| Δw = +1 | 371 | 193-175-3 | 52.4% [47–57] | -0.5% | -94.8u | -0.10 ✗ noise |
| Δw = +2 | 152 | 79-71-2 | 52.7% [45–60] | -0.6% | -20.3u | -0.07 ✗ noise |
| Δw ≥ +3 | 133 | 65-68-0 | 48.9% [41–57] | -10.0% | -17.1u | -1.21 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 268 | 151-117-0 | 56.3% [50–62] | +4.9% | +43.2u | 0.85 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 138 | 65-71-2 | 47.8% [40–56] | -10.2% | -44.2u | -1.26 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 498 | 236-255-7 | 48.1% [44–52] | -8.5% | -196.4u | -1.97 ✓ p<.05 |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 942 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 43 | 17-26-0 | 39.5% [26–54] | -18.9% | -16.1u | -1.18 ✗ noise |
| Δcount = −1 | 82 | 38-43-1 | 46.9% [36–58] | -9.4% | -3.9u | -0.87 ✗ noise |
| Δcount = 0 (balanced) | 143 | 60-81-2 | 42.6% [35–51] | -19.9% | -60.0u | -2.52 ✓ p<.05 |
| Δcount = +1 | 345 | 177-166-2 | 51.6% [46–57] | -2.3% | -137.9u | -0.43 ✗ noise |
| Δcount = +2 | 181 | 95-84-2 | 53.1% [46–60] | -1.2% | -10.2u | -0.17 ✗ noise |
| Δcount ≥ +3 (heavy support) | 148 | 92-54-2 | 63.0% [55–70] | +21.5% | +53.5u | 2.54 ✓ p<.05 |

**ρ(Δcount, WIN) = 0.123** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.110** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -13 · ≤ 0 · ≤ 10 · ≤ 19 · > 19

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 200 | 78-122-0 | 39.0% [33–46] | -26.2% | -90.7u | -3.95 ✓ p<.01 |
| Q2 | 198 | 85-109-4 | 43.8% [37–51] | -14.9% | -70.1u | -2.18 ✓ p<.05 |
| Q3 (balanced) | 170 | 87-81-2 | 51.8% [44–59] | -2.3% | -51.0u | -0.31 ✗ noise |
| Q4 | 208 | 121-86-1 | 58.5% [52–65] | +11.2% | -32.3u | 1.66 ~ p<.10 |
| Q5 (best — heavy support) | 166 | 108-56-2 | 65.9% [58–73] | +24.3% | +69.6u | 3.16 ✓ p<.01 |

**ρ(ΔWlNet, WIN) = 0.203** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.187** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -Infinity · ≤ -17.97 · ≤ 3.24 · ≤ 12.94 · > 12.94

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 40 | 19-20-1 | 48.7% [34–64] | -6.8% | -10.7u | -0.44 ✗ noise |
| Q2 | 121 | 52-69-0 | 43.0% [35–52] | -19.9% | -36.9u | -2.34 ✓ p<.05 |
| Q3 | 238 | 110-127-1 | 46.4% [40–53] | -11.4% | -31.5u | -1.81 ~ p<.10 |
| Q4 | 242 | 137-102-3 | 57.3% [51–63] | +9.0% | -49.3u | 1.45 ✗ noise |
| Q5 | 301 | 161-136-4 | 54.2% [49–60] | +3.3% | -46.1u | 0.57 ✗ noise |

**ρ(ΔFlatPnl, WIN) = NaN** —  ·  **ρ(ΔFlatPnl, flat ROI) = NaN** —

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -Infinity · ≤ -10.7 · ≤ 3.2 · ≤ 18.1 · > 18.1

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 40 | 19-20-1 | 48.7% [34–64] | -6.8% | -10.7u | -0.44 ✗ noise |
| Q2 | 101 | 23-78-0 | 22.8% [16–32] | -55.9% | -73.9u | -6.68 ✓ p<.01 |
| Q3 | 259 | 134-123-2 | 52.1% [46–58] | -0.7% | -0.1u | -0.11 ✗ noise |
| Q4 | 252 | 139-110-3 | 55.8% [50–62] | +7.3% | -17.0u | 1.19 ✗ noise |
| Q5 | 290 | 164-123-3 | 57.1% [51–63] | +6.9% | -72.9u | 1.20 ✗ noise |

**ρ(ΔAvgRoi, WIN) = NaN** —  ·  **ρ(ΔAvgRoi, flat ROI) = NaN** —

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 108 | 35-70-3 | 33.3% [25–43] | -34.2% | -56.1u | -3.82 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 34 | 12-22-0 | 35.3% [21–52] | -33.3% | -18.0u | -2.09 ✓ p<.05 |
| ΔBestRank = 0 (tied) | 8 | 5-3-0 | 62.5% [31–86] | +25.9% | +2.2u | 0.70 ✗ noise |
| ΔBestRank ∈ [+1,+4] | 40 | 13-27-0 | 32.5% [20–48] | -37.9% | -32.5u | -2.60 ✓ p<.01 |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 224 | 124-98-2 | 55.9% [49–62] | +6.8% | -3.5u | 0.99 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.255** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.229** ✓ p<.01  (N=414)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 74 | 21-52-1 | 28.8% [20–40] | -43.5% | -60.5u | -4.16 ✓ p<.01 |
| Δshare ∈ [−30,−10] pp | 10 | 4-6-0 | 40.0% [17–69] | -6.5% | +0.7u | -0.16 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 605 | 312-289-4 | 51.9% [48–56] | -1.3% | -105.9u | -0.33 ✗ noise |
| Δshare ∈ [+10,+30] pp | 38 | 22-15-1 | 59.5% [43–74] | +9.4% | +19.5u | 0.63 ✗ noise |
| Δshare ≥ +30 pp | 215 | 120-92-3 | 56.6% [50–63] | +6.9% | -28.3u | 0.99 ✗ noise |

**ρ(ΔTopQShare, WIN) = 0.096** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.085** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔWlNet** | 0.203 ✓ p<.01 | 0.187 ✓ p<.01 | 0.160 |
| 2 | **ΔTopQCount** | 0.153 ✓ p<.01 | 0.137 ✓ p<.01 | 0.098 |
| 3 | **Δcount** | 0.123 ✓ p<.01 | 0.110 ✓ p<.01 | 0.096 |
| 4 | **ΔTopQShare** | 0.096 ✓ p<.01 | 0.085 ✓ p<.01 | 0.080 |
| 5 | **ΔFlatPnl** | NaN — | NaN — | 0.065 |
| 6 | **ΔAvgRoi** | NaN — | NaN — | 0.081 |

_(ΔBestRank uses N=414 subset where both sides had a proven wallet — ρ(flat ROI) = 0.229 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 1683, dateRange = 2026-04-18 → 2026-07-02, computedAt = 2026-07-03T14:57:46.154Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **942** rows · PIT aggregate computable on **977** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **977** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 0 · — · — | 1 · 0% · -100.0% | — |
| NEUTRAL (0..+3) | 738 · 53% · -0.5% | 561 · 53% · -1.2% | -0.7pp |
| WEAK (−3..0) | 177 · 48% · -8.1% | 351 · 50% · -2.4% | +5.7pp |
| FADE (<−3) | 0 · — · — | 2 · 0% · -100.0% | — |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=508, WR=55%, ROI=+4.8% | N=437, WR=53%, ROI=-1.2% | -6.0pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=738, WR=53%, ROI=-0.5% | N=562, WR=53%, ROI=-1.3% | -0.9pp |
| AGS < −1 (mute veto) | N=57, WR=49%, ROI=-4.7% | N=207, WR=46%, ROI=-9.2% | -4.5pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-06-19 → 2026-07-02, N=283)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 1 · 0% · -100.0% |
| NEUTRAL (0..+3) | 168 · 56% · +2.2% |
| WEAK (−3..0) | 112 · 43% · -17.5% |
| FADE (<−3) | 2 · 0% · -100.0% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=140, WR=56%, ROI=+3.0% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=169, WR=55%, ROI=+1.6% |
| AGS < −1 (mute veto) | N=59, WR=37%, ROI=-27.0% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 0.69 | 2.32 |
| `dHcSizeRatio` | INTENSITY_HC | + | 0.48 | 5.66 |
| `dSumRankNorm` | QUALITY_RANK | − | 37.89 | 92.14 |
| `dWinnerCtPreA` | QUALITY_TRACK | − | 0.39 | 1.75 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **977/1016** shipped+graded rows (96%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -4.22 |
| 20th pct | -0.21 |
| 40th pct | 0.01 |
| Median | 0.10 |
| 60th pct | 0.16 |
| 80th pct | 0.40 |
| 90th pct | 0.60 |
| Max | 3.04 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 174 | 17.8% |
| **LOCK** | +5..+7 | 183 | 18.7% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 130 | 13.3% |
| **FADE** | < −3 | 238 | 24.4% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 174 | 97-74-3 | 56.7% [49–64] | +2.4% | +2.9u | 0.35 ✗ noise |
| LOCK | 183 | 81-102-0 | 44.3% [37–52] | -15.4% | -100.8u | -2.14 ✓ p<.05 |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 130 | 65-63-2 | 50.8% [42–59] | -3.0% | -26.3u | -0.35 ✗ noise |
| FADE | 238 | 107-127-4 | 45.7% [39–52] | -8.7% | -70.2u | -1.30 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.061** ~ p<.10 · r(ROI) = **0.028** ✗ · Spearman ρ(ROI) = **0.005**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 195 | 93-100-2 | 48.2% [41–55] | -4.8% | -46.5u | -0.67 ✗ noise |
| z ∈ [−1, 0) | 400 | 200-196-4 | 50.5% [46–55] | -3.6% | -109.0u | -0.73 ✗ noise |
| z ∈ [0, +1) | 244 | 123-119-2 | 50.8% [45–57] | -5.4% | -29.3u | -0.88 ✗ noise |
| z ≥ +1 (very positive) | 138 | 70-66-2 | 51.5% [43–60] | -6.8% | -10.9u | -0.87 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 943 | 471-462-10 | 50.5% [47–54] | -4.8% | -192.6u | -1.54 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dSumRankNorm` (QUALITY_RANK)

r(WIN) = **-0.034** ✗ · r(ROI) = **-0.042** ✗ · Spearman ρ(ROI) = **-0.041**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 170 | 92-77-1 | 54.4% [47–62] | +1.9% | +11.2u | 0.26 ✗ noise |
| z ∈ [−1, 0) | 424 | 213-207-4 | 50.7% [46–55] | -2.9% | -118.1u | -0.60 ✗ noise |
| z ∈ [0, +1) | 283 | 133-146-4 | 47.7% [42–54] | -8.8% | -85.6u | -1.53 ✗ noise |
| z ≥ +1 (very positive) | 100 | 48-51-1 | 48.5% [39–58] | -12.4% | -3.1u | -1.35 ✗ noise |

#### `dWinnerCtPreA` (QUALITY_TRACK)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 943 | 471-462-10 | 50.5% [47–54] | -4.8% | -192.6u | -1.54 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.034 ✗ | -0.042 ✗ | -0.041 |
| 2 | `dCount` | COUNT | 0.061 ~ p<.10 | 0.028 ✗ | 0.005 |
| 3 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |
| 4 | `dWinnerCtPreA` | QUALITY_TRACK | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | -0.079 | 0.825 | 50.7% | dominant |
| 2 | `dSumRankNorm` | -0.218 | 0.791 | 48.6% | meaningful |
| 3 | `dWinnerCtPreA` | -0.008 | 0.008 | 0.5% | silent (<0.2) |
| 4 | `dHcSizeRatio` | -0.003 | 0.003 | 0.2% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcSizeRatio` | `dSumRankNorm` | `dWinnerCtPreA` |
|---|---|---|---|---|
| `dCount` | 1.000 | -0.016 | +0.648 | -0.016 |
| `dHcSizeRatio` | -0.016 | 1.000 | -0.047 | +1.000 ⚠ |
| `dSumRankNorm` | +0.648 | -0.047 | 1.000 | -0.047 |
| `dWinnerCtPreA` | -0.016 | +1.000 ⚠ | -0.047 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.023**. At AGS ≥ +0.12 fires N=462, WR=51.9%, ROI=-3.7%. At AGS ≥ +null fires N=593, WR=51.8%, ROI=-3.8%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-462 ROI (matched cohort) | Top-462 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.056 | +0.033 | WR=54%, ROI=+2.9% | -6.6pp | N=556, WR=52%, ROI=-0.8% |
| `dHcSizeRatio` | +0.065 | +0.042 | WR=54%, ROI=-0.1% | -3.6pp | N=493, WR=53%, ROI=-0.4% |
| `dSumRankNorm` | -0.012 | −0.011 | WR=50%, ROI=-7.9% | +4.1pp | N=378, WR=52%, ROI=-4.9% |
| `dWinnerCtPreA` | +0.064 | +0.042 | WR=54%, ROI=+0.3% | -4.0pp | N=484, WR=54%, ROI=+0.1% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dSumRankNorm` | −0.011 | +4.1pp | mild marginal info |
| 2 | `dCount` | +0.033 | -6.6pp | redundant — other features cover it |
| 3 | `dWinnerCtPreA` | +0.042 | -4.0pp | redundant — other features cover it |
| 4 | `dHcSizeRatio` | +0.042 | -3.6pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.172 | 0.172 | negative ↓ |
| 2 | `dCount` | COUNT | +0.157 | 0.157 | positive ↑ |
| 3 | `dWinnerCtPreA` | QUALITY_TRACK | +0.008 | 0.008 | flat ≈ 0 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | +0.003 | 0.003 | flat ≈ 0 |

Intercept b = -0.035 · Final log-loss = 0.6877 · N = 977.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | #1 | #2 | #1 | #1 | 1.25 |
| 2 | `dCount` | COUNT | #2 | #1 | #2 | #2 | 1.75 |
| 3 | `dWinnerCtPreA` | QUALITY_TRACK | #4 | #3 | #3 | #3 | 3.25 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | #3 | #4 | #4 | #4 | 3.75 |

#### Plain-English summary

- **Workhorse**: `dSumRankNorm` (QUALITY_RANK) — ranks #1/#2/#1/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dHcSizeRatio` (INTENSITY_HC) — composite avg rank 3.75. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dHcSizeRatio` ↔ `dWinnerCtPreA` (r=+1.00). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dWinnerCtPreA`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **v9 simplification candidate**: only `dSumRankNorm` carries marginal info (Spearman ρ drop > 0.01 when removed). The other 5 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=977 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 977 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/977 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 271 | 130-141-0 | 48.0% [42–54] | -12.6% | -171.7u | -2.22 ✓ p<.05 |
| 4.5★ | 214 | 110-101-3 | 52.1% [45–59] | -1.0% | -61.6u | -0.15 ✗ noise |
| 4.0★ | 195 | 92-100-3 | 47.9% [41–55] | -7.5% | -0.1u | -1.07 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 139 | 70-66-3 | 51.5% [43–60] | -0.2% | +7.7u | -0.02 ✗ noise |
| 2.5★ | 159 | 82-76-1 | 51.9% [44–60] | -2.6% | +14.0u | -0.34 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 51/51%/-9% | 53/48%/-9% | 46/36%/-34% | 6/33%/-26% | 49/34%/-32% | 72/52%/-0% |
| Δw = +1 | 70/53%/-3% | 100/50%/-4% | 97/48%/-7% | 28/54%/+4% | 58/59%/+12% | 50/52%/-6% |
| Δw = +2 | 71/44%/-17% | 31/55%/+2% | 41/60%/+15% | — | 18/59%/+12% | 16/50%/-3% |
| Δw ≥ +3 | 77/44%/-21% | 27/63%/+20% | 11/55%/+11% | 3/67%/+156% | 14/71%/+43% | 19/47%/-12% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 20 | 18-2-0 | 90.0% [70–97] | +9.4% | +10.9u | 1.11 ✗ noise |
| −300/−201 | 32 | 21-11-0 | 65.6% [48–80] | -4.8% | +11.4u | -0.39 ✗ noise |
| −200/−151 | 102 | 60-42-0 | 58.8% [49–68] | -6.2% | -30.2u | -0.79 ✗ noise |
| −150/−101 | 589 | 291-291-7 | 50.0% [46–54] | -6.1% | -118.8u | -1.59 ✗ noise |
| −100/+100 | 14 | 8-6-0 | 57.1% [33–79] | +14.3% | +1.3u | 0.52 ✗ noise |
| +101/+150 | 202 | 86-113-3 | 43.2% [37–50] | -5.2% | -71.8u | -0.68 ✗ noise |
| +151/+200 | 31 | 15-16-0 | 48.4% [32–65] | +26.8% | +6.8u | 1.12 ✗ noise |
| +201+ | 24 | 4-20-0 | 16.7% [7–36] | -32.7% | -7.5u | -1.00 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -10% (4) | -4% (5) | +26% (2) | +21% (8) |
| −300/−201 | -16% (12) | +27% (7) | +20% (6) | -39% (7) |
| −200/−151 | -20% (30) | +0% (38) | +28% (15) | -29% (18) |
| −150/−101 | -11% (157) | -1% (244) | -10% (103) | -6% (82) |
| −100/+100 | -100% (3) | +43% (7) | +33% (3) | +100% (1) |
| +101/+150 | -16% (58) | -5% (81) | -2% (38) | +15% (25) |
| +151/+200 | +2% (5) | +31% (14) | +54% (7) | +29% (4) |
| +201+ | -28% (9) | -100% (6) | -100% (3) | +62% (6) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 530 | 261-268-1 | 49.3% [45–54] | -7.0% | -91.7u | -1.63 ✗ noise |
| SPREAD | 179 | 88-89-2 | 49.7% [42–57] | -6.3% | -49.0u | -0.87 ✗ noise |
| TOTAL | 307 | 154-146-7 | 51.3% [46–57] | -1.2% | -67.3u | -0.21 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=145 · 43% · -19% | N=189 · 51% · -5% | N=92 · 54% · +5% | N=101 · 50% · -4% |
| SPREAD | N=50 · 37% · -31% | N=86 · 56% · +9% | N=26 · 58% · +2% | N=16 · 38% · -27% |
| TOTAL | N=83 · 54% · +3% | N=129 · 50% · -3% | N=59 · 44% · -14% | N=34 · 62% · +19% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 790 | 391-392-7 | 49.9% [46–53] | -5.5% | -194.2u | -1.63 ✗ noise |
| NBA | 130 | 60-69-1 | 46.5% [38–55] | -7.4% | -15.3u | -0.78 ✗ noise |
| NHL | 50 | 25-23-2 | 52.1% [38–66] | +0.7% | -16.2u | 0.05 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=225 · 46% · -13% | N=351 · 52% · -2% | N=134 · 52% · -1% | N=79 · 49% · -7% |
| NBA | N=30 · 31% · -43% | N=29 · 48% · -6% | N=23 · 48% · -5% | N=43 · 53% · +14% |
| NHL | N=10 · 70% · +44% | N=14 · 69% · +25% | N=13 · 42% · -18% | N=13 · 31% · -40% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 360 · 48% · -7.4% · -1.40 ✗ noise | 655 · 51% · -4.1% · -1.09 ✗ noise |
| **plusEV** | 87 · 52% · -0.9% · -0.08 ✗ noise | 928 · 50% · -5.7% · -1.79 ~ p<.10 |
| **pinnacleConfirms** | 194 · 55% · +1.8% · 0.25 ✗ noise | 633 · 48% · -8.4% · -2.18 ✓ p<.05 |
| **invested10kPlus** | 447 · 51% · -4.3% · -0.92 ✗ noise | 380 · 48% · -8.0% · -1.61 ✗ noise |
| **lineMovingWith** | 379 · 54% · +2.1% · 0.43 ✗ noise | 636 · 47% · -9.7% · -2.51 ✓ p<.05 |
| **predMarketAligns** | 216 · 52% · -1.7% · -0.25 ✗ noise | 611 · 49% · -7.5% · -1.93 ~ p<.10 |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 385 | 187-198-0 | 48.6% [44–54] | -7.2% | -163.4u | -1.46 ✗ noise |
| 1 | 191 | 90-94-7 | 48.9% [42–56] | -5.9% | -28.7u | -0.84 ✗ noise |
| 2 | 206 | 102-101-3 | 50.2% [43–57] | -5.6% | -0.4u | -0.83 ✗ noise |
| 3 | 73 | 39-34-0 | 53.4% [42–64] | -0.1% | -1.3u | -0.01 ✗ noise |
| 4 | 75 | 41-34-0 | 54.7% [43–65] | +1.3% | -9.6u | 0.11 ✗ noise |
| 5 | 68 | 35-33-0 | 51.5% [40–63] | -7.7% | -9.0u | -0.68 ✗ noise |
| 6 | 18 | 9-9-0 | 50.0% [29–71] | +16.0% | +4.4u | 0.45 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 121 | 65-55-1 | 54.2% [45–63] | +0.5% | -5.8u | 0.06 ✗ noise |
| NEAR_START | 389 | 189-193-7 | 49.5% [44–54] | -5.4% | -49.9u | -1.08 ✗ noise |
| NO_MOVE | 28 | 14-14-0 | 50.0% [33–67] | -6.2% | +10.9u | -0.34 ✗ noise |
| PREGAME | 290 | 142-148-0 | 49.0% [43–55] | -6.8% | -136.9u | -1.20 ✗ noise |
| SMALL_MOVE | 186 | 91-93-2 | 49.5% [42–57] | -6.6% | -28.7u | -0.93 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 591 | 297-290-4 | 50.6% [47–55] | -5.3% | -199.7u | -1.34 ✗ noise |
| STRONG | 131 | 63-65-3 | 49.2% [41–58] | -5.5% | -5.6u | -0.65 ✗ noise |
| LEAN | 279 | 137-139-3 | 49.6% [44–56] | -3.7% | +0.5u | -0.60 ✗ noise |
| CONTESTED | 14 | 5-9-0 | 35.7% [16–61] | -33.8% | -4.7u | -1.34 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.018 ✗ | -0.018 ✗ | -0.017 | -0.57 |
| totalInvested | -0.025 ✗ | -0.037 ✗ | 0.004 | -1.18 |
| evEdge | 0.082 ✓ p<.01 | 0.105 ✓ p<.01 | 0.034 | 3.37 |
| moneyPct | 0.024 ✗ | 0.002 ✗ | -0.005 | 0.06 |
| walletPct | 0.036 ✗ | 0.024 ✗ | 0.021 | 0.76 |
| criteriaMet | 0.032 ✗ | 0.025 ✗ | -0.005 | 0.79 |
| maxContribFor | 0.006 ✗ | 0.013 ✗ | 0.029 | 0.42 |
| meanBaseFor | -0.006 ✗ | 0.017 ✗ | 0.033 | 0.55 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **1000** picks. Mean CLV = **-0.0020**.
t-statistic vs zero: -1.31 → ✗ noise · 95% CI [-0.0050, 0.0010]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 111 | 50-60-1 | 45.5% [36–55] | -16.3% | -45.4u | -1.84 ~ p<.10 |
| CLV (−2%, 0] | 586 | 294-285-7 | 50.8% [47–55] | -4.3% | -96.9u | -1.07 ✗ noise |
| CLV (0, +2%] | 250 | 127-122-1 | 51.0% [45–57] | -1.0% | -46.3u | -0.15 ✗ noise |
| CLV > +2% | 53 | 25-27-1 | 48.1% [35–61] | -6.6% | -9.6u | -0.47 ✗ noise |

ρ(CLV, flat ROI) = 0.009 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=741 (with all features non-null). Intercept β₀ = 0.064.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | sharpCount | -0.242 | ↓ hurts |
| 2 | log(impliedProb) | +0.231 | ↑ helps |
| 3 | pw.ΔAvgRoi | +0.226 | ↑ helps |
| 4 | pw.ΔWlNet | +0.207 | ↑ helps |
| 5 | pw.Δcount | +0.188 | ↑ helps |
| 6 | evEdge | +0.166 | ↑ helps |
| 7 | pw.ΔTopQShare | +0.147 | ↑ helps |
| 8 | odds (American) | -0.106 | ↓ hurts |
| 9 | moneyPct | -0.105 | ↓ hurts |
| 10 | criteriaMet | +0.072 | ↑ helps |
| 11 | peak.stars | -0.067 | ↓ hurts |
| 12 | pw.ΔFlatPnl | +0.053 | ↑ helps |
| 13 | walletPct | +0.044 | ≈ flat |
| 14 | vault.star | +0.039 | ≈ flat |
| 15 | HC margin | +0.017 | ≈ flat |
| 16 | log10(invested) | +0.010 | ≈ flat |
| 17 | Δw + HC | +0.006 | ≈ flat |
| 18 | Δw | -0.002 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 67 | 32-35 | 47.8% | 48.1% | -110 | — (mute) | 2.36u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 201 | 119-82 | 59.2% | 58.8% | -110 | 6.71% bankroll | 2.03u | **UNDER-SIZED** — ship up to 6.71u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 138 | 65-71 | 47.8% | 47.9% | -110 | — (mute) | 2.01u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 151 | 78-73 | 51.7% | 51.6% | -110 | — (mute) | 2.33u | **MUTE** (negative EV at posterior) |
| Stale Δw = 0 | 218 | 102-113 | 47.4% | 47.6% | -110 | — (mute) | 1.78u | **MUTE** (negative EV at posterior) |
| Stale Δw ≤ −1 | 60 | 21-37 | 36.2% | 38.2% | -110 | — (mute) | 1.23u | **MUTE** (negative EV at posterior) |

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
| 2026-06-13 | 19 | 11-8 | +1.8u | -42.4u |
| 2026-06-14 | 13 | 6-7 | -16.1u | -58.5u |
| 2026-06-15 | 18 | 7-11 | -8.7u | -67.2u |
| 2026-06-16 | 23 | 12-11 | -11.8u | -79.0u |
| 2026-06-17 | 17 | 9-8 | -12.3u | -91.3u |
| 2026-06-18 | 8 | 6-2 | +2.1u | -89.2u |
| 2026-06-19 | 23 | 12-11 | -13.5u | -102.7u |
| 2026-06-20 | 14 | 7-7 | -2.0u | -104.7u |
| 2026-06-21 | 22 | 7-15 | -19.1u | -123.8u |
| 2026-06-22 | 19 | 11-8 | -6.4u | -130.2u |
| 2026-06-23 | 25 | 9-16 | -27.0u | -157.2u |
| 2026-06-24 | 30 | 18-12 | -17.4u | -174.7u |
| 2026-06-25 | 14 | 6-8 | -5.6u | -180.2u |
| 2026-06-26 | 21 | 13-8 | -5.4u | -185.6u |
| 2026-06-27 | 23 | 10-13 | -7.4u | -193.0u |
| 2026-06-28 | 25 | 10-15 | -9.5u | -202.5u |
| 2026-06-29 | 21 | 10-10 | +6.7u | -195.8u |
| 2026-06-30 | 31 | 17-13 | +17.1u | -178.7u |
| 2026-07-01 | 20 | 10-10 | -10.8u | -189.6u |
| 2026-07-02 | 22 | 7-15 | -18.4u | -207.9u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -215.0u
**Longest losing-day streak:** 10
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.339  (annualized × √252 ≈ -5.38)

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
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.50 | -108 | 0 | — | — | -1 | 0 | -2.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1.00 | -108 | 0 | — | — | 0 | 0 | -1.70 | L | -1.0u |
| 2026-04-18 | NBA | TOTAL | over | 3.0 | 0.75 | -107 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-18 | NBA | TOTAL | under | 5.0 | 2.00 | -104 | — | — | — | — | — | 0.00 | W | +1.9u |
| 2026-04-18 | NBA | ML | home | 5.0 | 3.00 | -360 | — | — | — | — | — | 0.20 | W | +0.8u |
| 2026-04-18 | NBA | TOTAL | under | 4.5 | 1.50 | -105 | — | — | — | — | — | 0.00 | L | -1.5u |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 2 | -5 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 1 | 2 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 1 | -8 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 1 | 2 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | -1 | -2 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 4 | 21 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 2 | -7 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 1 | 2 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | -1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 1 | 2 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | 1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | -2 | -21 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 1 | 12 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 0 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | 1 | -6 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | 0 | -13 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 1 | 3 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 2 | 26 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | -1 | 1 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 1 | -3 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 0 | 9 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 1 | 5 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 1 | 15 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 1 | 0 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | 0 | 0 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 1 | 0 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 1 | -6 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 1 | 0 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | 0 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | 1 | 2 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | 0 | -31 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | -1 | -12 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 1 | -8 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 4 | 24 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 3 | -3 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 1 | -8 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | -1 | -12 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | 1 | -14 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | 0 | -8 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | 0 | 0 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 0 | 0 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 1 | 6 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 3 | 15 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 1 | 1 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -1 | -16 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 2 | -4 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 0 | 0 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | 1 | 0 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 16 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 2 | -5 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | -5 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | -11 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 2 | -17 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 4 | 18 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 1 | 25 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 2 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 21 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 2 | 0 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 0 | -31 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 2 | -7 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | 1 | -17 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 10 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 1 | 3 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 1 | -6 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 2 | -3 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 2 | 6 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | 0 | 31 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | -5 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 2 | 7 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 3 | 4 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 12 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 26 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | 6 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -6 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 3 | -1 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | 2 | 10 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 2 | -7 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -18 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 3 | 16 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 3 | 28 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 4 | 17 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 2 | 23 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 0 | 17 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 19 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 2 | 7 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 2 | 7 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | 20 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 24 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 2 | -3 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 6 | 1 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 21 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 1 | 12 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 3 | 6 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 1 | 15 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 0 | -1 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 0 | 4 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 3 | 10 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 9 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | -9 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 0 | -20 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 3 | 8 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 0 | -5 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 0 | 0 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 12 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | 4 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 4 | -9 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 12 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 2 | 16 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 2 | 14 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 3 | 17 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | 0 | 0 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 2 | 3 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 13 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 15 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 13 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | 0 | 3 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 34 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 4 | 14 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 2 | -7 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 1 | 7 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 5 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 8 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 5 | 17 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 0 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 18 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 3 | 21 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 0 | 6 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 1 | -6 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 1 | -6 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 2 | 24 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 3 | 29 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 15 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 0 | 0 | -1.30 | L | -1.1u |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.70 | -104 | — | — | — | 2 | 9 | 0.00 | W | +1.6u |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-09 | NBA | ML | away | 5.0 | 4.50 | -364 | 3 | 1 | 4 | 6 | 36 | 0.00 | W | +1.2u |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2.00 | -104 | 2 | 1 | 3 | 2 | 15 | 0.00 | W | +1.9u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -120 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +0.9u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -103 | 1 | 1 | 2 | 1 | -19 | 0.00 | L | -1.1u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -110 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +1.0u |
| 2026-05-10 | MLB | ML | away | 3.5 | 1.13 | +134 | 0 | 1 | 1 | 1 | -19 | 0.00 | W | +1.5u |
| 2026-05-10 | NBA | ML | home | 4.0 | 1.50 | +160 | 1 | 1 | 2 | 3 | 22 | 0.80 | W | +2.6u |
| 2026-05-10 | NBA | TOTAL | over | 5.0 | 3.50 | -110 | 3 | 2 | 5 | 2 | 19 | 0.00 | W | +3.3u |
| 2026-05-10 | NHL | ML | away | 4.5 | 4.50 | +108 | 2 | 2 | 4 | 1 | 6 | -0.70 | L | -4.5u |
| 2026-05-10 | NHL | TOTAL | under | 5.0 | 1.70 | -110 | 2 | 1 | 3 | 0 | 0 | 0.00 | L | -1.7u |
| 2026-05-11 | MLB | ML | away | 3.5 | 1.13 | -101 | 1 | 1 | 2 | 2 | -21 | 0.00 | W | +1.1u |
| 2026-05-11 | MLB | ML | home | 3.5 | 1.13 | -156 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +0.7u |
| 2026-05-11 | NBA | TOTAL | under | 4.5 | 2.00 | -110 | 1 | 2 | 3 | 0 | 8 | 0.00 | L | -2.0u |
| 2026-05-11 | NHL | TOTAL | under | 4.5 | 1.27 | -110 | 2 | 0 | 2 | 2 | 14 | 0.00 | L | -1.3u |
| 2026-05-12 | MLB | ML | away | 5.0 | 4.50 | +108 | 4 | 0 | 4 | 2 | -16 | -0.20 | L | -4.5u |
| 2026-05-12 | MLB | TOTAL | under | 4.0 | 0.64 | -110 | 2 | 1 | 3 | 1 | -6 | 0.00 | L | -0.6u |
| 2026-05-12 | MLB | ML | away | 4.5 | 3.00 | +129 | 3 | 0 | 3 | 1 | 3 | -1.00 | L | -3.0u |
| 2026-05-12 | MLB | ML | home | 5.0 | 3.00 | +108 | 3 | 0 | 3 | 1 | -6 | -0.50 | L | -3.0u |
| 2026-05-12 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 6 | 4 | 10 | 5 | 31 | -0.70 | L | -3.5u |
| 2026-05-13 | MLB | ML | home | 4.5 | 4.50 | -116 | 1 | 1 | 2 | 2 | -16 | -1.30 | W | +3.7u |
| 2026-05-13 | MLB | SPREAD | home | 5.0 | 3.50 | -105 | 1 | 1 | 2 | 2 | -25 | 0.90 | W | +3.2u |
| 2026-05-13 | MLB | TOTAL | under | 4.0 | 0.96 | -110 | 1 | 1 | 2 | 2 | -6 | 0.00 | W | +0.9u |
| 2026-05-13 | MLB | TOTAL | under | 5.0 | 3.50 | -110 | 4 | 2 | 6 | 4 | -21 | 0.00 | L | -3.5u |
| 2026-05-13 | NBA | ML | home | 5.0 | 4.50 | -162 | 6 | 0 | 6 | 2 | -16 | -1.00 | L | -4.5u |
| 2026-05-13 | NBA | TOTAL | over | 5.0 | 3.50 | -101 | 3 | 2 | 5 | 4 | 2 | 0.00 | W | +3.4u |
| 2026-05-14 | MLB | ML | home | 5.0 | 4.50 | -103 | 4 | 1 | 5 | 2 | 3 | -0.40 | L | -4.5u |
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 1 | -19 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | -6 | 0.00 | L | -0.5u |
| 2026-05-14 | NHL | TOTAL | under | 5.0 | 3.50 | -110 | 3 | 1 | 4 | 1 | 8 | 0.00 | L | -3.5u |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 0 | 1 | 1 | 3 | 10 | 0.00 | W | +1.7u |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 1 | 1 | 2 | 3 | -8 | 0.00 | W | +0.3u |
| 2026-05-15 | MLB | ML | home | 4.0 | 2.50 | +128 | 0 | 0 | 0 | 0 | 3 | 0.00 | L | -2.5u |
| 2026-05-15 | MLB | ML | away | 4.0 | 2.75 | -211 | 2 | 1 | 3 | 1 | 3 | -0.90 | W | +1.3u |
| 2026-05-15 | MLB | ML | away | 3.0 | 1.25 | +115 | 0 | 1 | 1 | 0 | 0 | -1.10 | L | -1.3u |
| 2026-05-15 | NBA | ML | away | 2.5 | 0.50 | +145 | 6 | 1 | 7 | 5 | 38 | -0.50 | W | +0.8u |
| 2026-05-15 | NBA | TOTAL | over | 4.0 | 0.75 | -109 | 0 | 1 | 1 | 3 | -14 | 0.00 | L | -0.8u |
| 2026-05-15 | NBA | SPREAD | home | 2.5 | 1.00 | -105 | 1 | 0 | 1 | 1 | 23 | 0.00 | L | -1.0u |
| 2026-05-15 | NBA | TOTAL | over | 5.0 | 2.00 | -110 | 1 | 0 | 1 | 3 | -1 | 0.00 | W | +1.9u |
| 2026-05-16 | MLB | ML | away | 5.0 | 4.50 | +124 | 3 | 1 | 4 | 3 | -27 | -1.30 | W | +1.4u |
| 2026-05-16 | MLB | SPREAD | away | 4.0 | 1.65 | -175 | 2 | 0 | 2 | 1 | -6 | 0.00 | W | +0.9u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +119 | 2 | 1 | 3 | 1 | -19 | -2.00 | L | -2.5u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +115 | 3 | 2 | 5 | 1 | -6 | -1.10 | W | +2.8u |
| 2026-05-16 | MLB | TOTAL | over | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | -28 | 0.00 | L | -1.6u |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.50 | -102 | 1 | 0 | 1 | 3 | 6 | 0.00 | W | +0.5u |
| 2026-05-17 | MLB | ML | away | 4.0 | 2.75 | -148 | 1 | 0 | 1 | 1 | -19 | -0.70 | W | +1.9u |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.50 | +139 | 0 | 1 | 1 | 1 | -19 | 0.70 | L | -0.5u |
| 2026-05-17 | MLB | ML | away | 5.0 | 5.00 | -129 | 3 | 1 | 4 | 1 | -19 | 0.40 | L | -5.0u |
| 2026-05-17 | MLB | ML | home | 4.0 | 2.75 | -114 | 3 | 1 | 4 | 3 | -12 | 2.20 | W | +2.4u |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 1 | 3 | 2 | -25 | 0.00 | W | +2.0u |
| 2026-05-17 | MLB | TOTAL | over | 5.0 | 2.50 | +107 | 2 | 2 | 4 | 1 | -19 | 0.00 | L | -2.5u |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | -13 | 0.00 | W | +0.3u |
| 2026-05-17 | NBA | ML | away | 3.0 | 1.25 | +165 | 3 | 1 | 4 | 3 | 2 | -0.60 | W | +0.8u |
| 2026-05-17 | NBA | TOTAL | under | 5.0 | 0.75 | -110 | 2 | 3 | 5 | 0 | 30 | 0.00 | L | -0.8u |
| 2026-05-18 | MLB | ML | home | 4.5 | 5.00 | -111 | 2 | 1 | 3 | 1 | -19 | -1.10 | W | +4.4u |
| 2026-05-18 | MLB | ML | away | 4.0 | 2.50 | +120 | 2 | 0 | 2 | 1 | -19 | -2.10 | L | -2.5u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | -118 | 2 | 0 | 2 | 1 | -19 | 1.00 | W | +1.1u |
| 2026-05-18 | MLB | ML | home | 4.0 | 2.75 | -150 | 2 | 0 | 2 | 0 | 0 | -0.80 | L | -2.8u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | +132 | 2 | 0 | 2 | 2 | -3 | 0.40 | W | +1.6u |
| 2026-05-18 | NBA | ML | home | 5.0 | 5.00 | -240 | 3 | 2 | 5 | 4 | 23 | -1.60 | L | -5.0u |
| 2026-05-18 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 1 | 2 | 0 | 19 | 0.20 | L | -1.0u |
| 2026-05-18 | NHL | ML | home | 5.0 | 5.00 | -112 | 2 | 2 | 4 | 1 | 5 | -1.10 | L | -5.0u |
| 2026-05-18 | NHL | TOTAL | under | 4.5 | 2.25 | -110 | 3 | 1 | 4 | 1 | 8 | 0.00 | W | +2.0u |
| 2026-05-19 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 2 | -20 | -1.30 | L | -2.5u |
| 2026-05-19 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | 15 | 0.00 | W | +1.5u |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.50 | +105 | 1 | 1 | 2 | 2 | -21 | -0.90 | L | -2.5u |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 1 | 1 | 2 | 1 | -10 | -1.20 | W | +1.2u |
| 2026-05-19 | NBA | ML | home | 5.0 | 5.00 | -260 | 0 | 3 | 3 | 3 | 5 | -0.50 | W | +1.9u |
| 2026-05-19 | NBA | SPREAD | away | 5.0 | 2.25 | -105 | 3 | 2 | 5 | 2 | -4 | -0.90 | L | -2.3u |
| 2026-05-19 | NBA | TOTAL | under | 5.0 | 3.00 | -106 | 2 | 3 | 5 | 2 | 14 | 0.00 | L | -3.0u |
| 2026-05-20 | MLB | ML | away | 5.0 | 2.50 | +113 | 2 | 1 | 3 | 1 | -19 | -1.00 | L | -2.5u |
| 2026-05-20 | MLB | ML | home | 4.0 | 2.75 | -154 | 2 | 0 | 2 | 1 | 3 | -1.50 | W | +1.9u |
| 2026-05-20 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -0.8u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | -140 | 1 | 1 | 2 | 1 | -19 | -1.10 | W | +0.9u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | +111 | 0 | 1 | 1 | 0 | 0 | 0.00 | W | +0.6u |
| 2026-05-20 | MLB | ML | away | 4.0 | 2.75 | +113 | 1 | 1 | 2 | 1 | -19 | -1.00 | L | -2.8u |
| 2026-05-20 | NBA | ML | home | 5.0 | 5.00 | -225 | 10 | 5 | 15 | 1 | 19 | -0.20 | W | +2.1u |
| 2026-05-20 | NBA | SPREAD | home | 5.0 | 3.00 | -106 | 6 | 1 | 7 | 4 | 40 | -0.70 | W | +2.7u |
| 2026-05-20 | NBA | TOTAL | over | 5.0 | 1.65 | -112 | 3 | 1 | 4 | 3 | 38 | 0.00 | W | +1.5u |
| 2026-05-20 | NHL | ML | home | 2.5 | 1.25 | -192 | 0 | 1 | 1 | 1 | 1 | -0.80 | L | -1.3u |
| 2026-05-21 | MLB | ML | home | 5.0 | 2.50 | +125 | 1 | 1 | 2 | 2 | -21 | -0.40 | L | -2.5u |
| 2026-05-21 | MLB | SPREAD | home | 3.0 | 0.75 | -148 | 0 | 0 | 0 | 1 | -19 | -1.50 | L | -0.8u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +172 | 2 | 0 | 2 | 1 | -19 | -0.50 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 4.5 | 2.75 | -110 | 2 | 1 | 3 | 1 | -19 | -0.50 | W | +2.5u |
| 2026-05-21 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 0 | 0 | 0 | -36 | 0.00 | W | +0.3u |
| 2026-05-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 3 | 1 | 4 | 3 | -22 | -0.40 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +129 | 1 | 0 | 1 | 3 | -26 | -0.40 | W | +1.6u |
| 2026-05-21 | MLB | SPREAD | away | 4.0 | 1.65 | -170 | 1 | 1 | 2 | 1 | -6 | 0.30 | W | +1.0u |
| 2026-05-21 | NBA | SPREAD | away | 5.0 | 3.00 | -110 | 4 | 2 | 6 | 3 | 16 | 0.70 | L | -3.0u |
| 2026-05-21 | NHL | ML | home | 4.0 | 2.75 | -197 | 4 | 1 | 5 | 1 | 8 | -1.30 | L | -2.8u |
| 2026-05-21 | NHL | TOTAL | over | 3.0 | 0.75 | +103 | 1 | 0 | 1 | 1 | 8 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 5.0 | 1.25 | -175 | 1 | 0 | 1 | 0 | 0 | -0.90 | L | -1.3u |
| 2026-05-22 | MLB | ML | home | 4.0 | 1.25 | -195 | 3 | 0 | 3 | 1 | 3 | 0.80 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 12 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 3.0 | 1.25 | -137 | 1 | 0 | 1 | 1 | -16 | 0.00 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | -1 | -12 | 0.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -144 | 4 | 2 | 6 | 1 | -19 | -1.60 | L | -5.0u |
| 2026-05-22 | MLB | SPREAD | home | 5.0 | 0.75 | -155 | 2 | 0 | 2 | 1 | -19 | -0.30 | W | +0.4u |
| 2026-05-22 | MLB | ML | home | 5.0 | 2.75 | -158 | 1 | 0 | 1 | 0 | 0 | -0.80 | W | +1.7u |
| 2026-05-22 | MLB | SPREAD | home | 3.0 | 0.75 | -142 | 1 | 0 | 1 | 1 | -19 | -2.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -145 | 2 | 2 | 4 | 0 | 0 | -2.20 | L | -5.0u |
| 2026-05-22 | MLB | ML | home | 2.5 | 0.50 | +139 | 2 | 1 | 3 | 1 | -6 | -0.90 | W | +0.7u |
| 2026-05-22 | MLB | SPREAD | home | 4.0 | 1.65 | -119 | 1 | 1 | 2 | 1 | -19 | -1.20 | W | +1.3u |
| 2026-05-22 | MLB | ML | away | 5.0 | 1.50 | +185 | 3 | 0 | 3 | 2 | -21 | -1.10 | L | -1.5u |
| 2026-05-22 | MLB | SPREAD | away | 3.0 | 0.75 | -112 | 1 | 0 | 1 | 1 | -19 | -1.40 | W | +0.6u |
| 2026-05-22 | NBA | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | -2 | -36 | 0.00 | L | -5.0u |
| 2026-05-22 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 0 | 1 | -2 | 7 | -0.50 | L | -1.0u |
| 2026-05-22 | NBA | TOTAL | over | 5.0 | 0.75 | +101 | 2 | 1 | 3 | 1 | 9 | 0.00 | W | +0.7u |
| 2026-05-22 | NHL | ML | home | 4.5 | 3.75 | -167 | 4 | 3 | 7 | 4 | 4 | 0.00 | L | -3.8u |
| 2026-05-22 | NHL | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 1 | 4 | 0 | 0 | 0.00 | W | +2.5u |
| 2026-05-23 | MLB | ML | home | 2.5 | 0.50 | -181 | 1 | 0 | 1 | 1 | 13 | -1.70 | W | +0.3u |
| 2026-05-23 | MLB | ML | away | 2.5 | 2.75 | +109 | 2 | 0 | 2 | 2 | -13 | -0.50 | L | -2.8u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | -30 | 0.00 | W | +0.3u |
| 2026-05-23 | MLB | ML | home | 5.0 | 1.00 | -148 | 0 | 0 | 0 | 1 | -26 | -0.20 | L | -1.0u |
| 2026-05-23 | MLB | SPREAD | away | 3.0 | 0.75 | -163 | 1 | 0 | 1 | 0 | -31 | 0.00 | W | +0.5u |
| 2026-05-23 | MLB | TOTAL | under | 5.0 | 3.00 | -110 | 3 | 1 | 4 | 3 | -29 | 0.00 | W | +2.7u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | 13 | -0.90 | L | -0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 1 | 3 | 2 | -28 | 0.00 | L | -0.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 1.50 | -209 | 0 | 0 | 0 | 2 | -6 | 29.00 | W | +2.5u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | +102 | 0 | 0 | 0 | 1 | 13 | 0.00 | W | +0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -19 | 0.00 | W | +0.7u |
| 2026-05-23 | MLB | ML | away | 2.5 | 1.25 | -111 | -1 | 1 | 0 | 1 | 16 | 0.40 | L | -1.3u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -135 | 0 | 0 | 0 | 1 | 13 | 0.40 | W | +0.6u |
| 2026-05-23 | MLB | TOTAL | under | 2.5 | 0.30 | +108 | 0 | 0 | 0 | 0 | 2 | 0.00 | P | +0.0u |
| 2026-05-23 | MLB | ML | home | 4.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | -21 | 1.10 | W | +2.9u |
| 2026-05-23 | MLB | ML | away | 3.0 | 1.25 | +166 | 2 | 1 | 3 | 2 | -40 | -0.30 | W | +1.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 2.25 | -123 | 1 | 0 | 1 | 2 | 7 | -0.90 | W | +1.6u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -111 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -0.3u |
| 2026-05-23 | NBA | SPREAD | home | 5.0 | 3.00 | -107 | 5 | 1 | 6 | 2 | 24 | 0.20 | L | -3.0u |
| 2026-05-23 | NBA | TOTAL | under | 5.0 | 3.00 | +102 | 1 | -1 | 0 | 6 | 1 | 0.00 | L | -3.0u |
| 2026-05-23 | NHL | ML | home | 5.0 | 5.00 | -205 | 8 | 0 | 8 | 3 | 4 | -0.70 | W | +2.4u |
| 2026-05-23 | NHL | TOTAL | under | 3.0 | 0.30 | -110 | 1 | 1 | 2 | 0 | -3 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | home | 4.5 | 3.75 | -101 | 2 | 1 | 3 | 2 | -25 | 0.00 | L | -3.8u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -189 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -8 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 1 | 2 | 1 | -33 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | 1 | -6 | 0.00 | W | +4.3u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 2.5 | 0.50 | +144 | 1 | 1 | 2 | -1 | -40 | 0.00 | L | -0.5u |
| 2026-05-24 | MLB | SPREAD | home | 4.0 | 1.65 | -110 | 2 | 1 | 3 | 2 | -6 | -1.30 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -107 | 1 | 0 | 1 | 1 | 11 | 0.00 | W | +1.2u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 1.00 | -101 | 1 | 1 | 2 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 0.30 | -104 | 0 | 0 | 0 | 0 | -2 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | away | 4.0 | 1.25 | +148 | 2 | 2 | 4 | 0 | -39 | -1.40 | W | +1.9u |
| 2026-05-24 | MLB | ML | away | 3.0 | 1.25 | -122 | -1 | 1 | 0 | 0 | -29 | -1.10 | L | -1.3u |
| 2026-05-24 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 2 | 0 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | SPREAD | home | 3.0 | 0.75 | +134 | 1 | 0 | 1 | 1 | 5 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | -38 | 0.00 | W | +0.7u |
| 2026-05-24 | NBA | SPREAD | away | 5.0 | 1.65 | -103 | 3 | 0 | 3 | 1 | 2 | 0.50 | L | -1.6u |
| 2026-05-24 | NBA | TOTAL | over | 4.5 | 3.00 | -107 | 2 | 1 | 3 | 2 | -21 | 0.00 | L | -3.0u |
| 2026-05-24 | NHL | ML | away | 4.0 | 2.75 | -136 | 3 | 0 | 3 | 1 | 4 | -0.70 | L | -2.8u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -149 | 1 | 0 | 1 | 2 | -13 | -0.70 | L | -5.0u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -310 | 2 | 0 | 2 | 1 | 2 | -1.20 | W | +1.6u |
| 2026-05-25 | MLB | TOTAL | over | 4.0 | 1.65 | +103 | 1 | 0 | 1 | 2 | 22 | 0.00 | L | -1.6u |
| 2026-05-25 | MLB | ML | home | 4.0 | 1.25 | -125 | 1 | -1 | 0 | 1 | -7 | -1.90 | L | -1.3u |
| 2026-05-25 | MLB | SPREAD | away | 4.0 | 1.65 | -184 | 1 | 0 | 1 | 1 | -6 | 28.40 | W | +2.4u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 2.25 | -112 | 4 | 0 | 4 | 3 | 5 | 0.00 | L | -2.3u |
| 2026-05-25 | MLB | ML | home | 5.0 | 1.25 | -160 | 3 | 0 | 3 | 2 | -45 | -1.10 | L | -1.3u |
| 2026-05-25 | MLB | TOTAL | over | 5.0 | 3.00 | -110 | 3 | 0 | 3 | 3 | 29 | 0.00 | W | +2.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 3.75 | -108 | 0 | 0 | 0 | 3 | -32 | -1.70 | L | -3.8u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -124 | 2 | 0 | 2 | 2 | -6 | -1.30 | W | +0.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 5.00 | -119 | 2 | -1 | 1 | 4 | 10 | -0.60 | W | +3.1u |
| 2026-05-25 | MLB | ML | away | 2.5 | 2.75 | -113 | 0 | 0 | 0 | 0 | -11 | -1.80 | W | +1.1u |
| 2026-05-25 | MLB | ML | home | 4.0 | 5.00 | -209 | -1 | 0 | -1 | 2 | -13 | -0.80 | W | +2.3u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 0.75 | -101 | 2 | 1 | 3 | 1 | -8 | 0.00 | W | +0.7u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -178 | 1 | 0 | 1 | 2 | -6 | -1.60 | W | +0.9u |
| 2026-05-25 | NBA | ML | away | 5.0 | 5.00 | -125 | 0 | 0 | 0 | 3 | 26 | -0.40 | W | +4.0u |
| 2026-05-25 | NBA | TOTAL | under | 5.0 | 3.00 | -110 | 2 | 2 | 4 | 0 | -2 | 0.00 | L | -3.0u |
| 2026-05-25 | NHL | ML | home | 5.0 | 2.50 | +120 | 8 | 4 | 12 | 1 | -4 | -0.60 | L | -2.5u |
| 2026-05-25 | NHL | SPREAD | home | 4.5 | 2.25 | -215 | 1 | 1 | 2 | 1 | 1 | -0.80 | W | +1.1u |
| 2026-05-26 | MLB | TOTAL | over | 5.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | -6 | 0.00 | W | +1.5u |
| 2026-05-26 | MLB | ML | away | 5.0 | 1.50 | +200 | 2 | 0 | 2 | 2 | -21 | -1.00 | L | -1.5u |
| 2026-05-26 | MLB | SPREAD | away | 5.0 | 1.00 | -101 | 2 | 1 | 3 | 2 | -6 | 0.50 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 2.5 | 1.25 | +113 | 0 | 0 | 0 | -1 | -13 | -1.50 | W | +1.4u |
| 2026-05-26 | MLB | ML | home | 2.5 | 1.25 | -130 | 1 | 0 | 1 | -1 | -13 | -1.30 | W | +1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -200 | 1 | 0 | 1 | 1 | 13 | -0.60 | W | +1.9u |
| 2026-05-26 | MLB | SPREAD | home | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 2 | 22 | -0.20 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -102 | 3 | 1 | 4 | 2 | -32 | -0.50 | W | +4.9u |
| 2026-05-26 | MLB | ML | home | 5.0 | 3.75 | -108 | 3 | 1 | 4 | 2 | 7 | -0.20 | L | -3.8u |
| 2026-05-26 | MLB | ML | home | 5.0 | 5.00 | -105 | 2 | 1 | 3 | 1 | 13 | -2.00 | W | +3.6u |
| 2026-05-26 | MLB | ML | away | 5.0 | 2.50 | +116 | 1 | 0 | 1 | 1 | 13 | -1.00 | W | +2.9u |
| 2026-05-26 | NBA | ML | home | 5.0 | 5.00 | -198 | 2 | 4 | 6 | 2 | 12 | -0.70 | W | +1.9u |
| 2026-05-26 | NBA | SPREAD | home | 5.0 | 1.00 | -110 | 2 | 2 | 4 | 3 | 21 | 1.20 | W | +0.0u |
| 2026-05-26 | NBA | TOTAL | over | 5.0 | 3.00 | -108 | 0 | 0 | 0 | 3 | -3 | 0.00 | W | +2.6u |
| 2026-05-26 | NHL | SPREAD | home | 5.0 | 2.25 | -250 | 2 | 0 | 2 | 2 | 6 | 0.80 | W | +0.9u |
| 2026-05-27 | MLB | ML | home | 4.5 | 0.50 | -102 | 3 | 1 | 4 | 1 | -3 | -1.10 | W | +0.4u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 2.50 | +141 | 1 | 1 | 2 | 3 | -6 | 0.80 | L | -2.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.00 | +105 | 2 | 0 | 2 | 2 | -6 | 0.00 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 4.5 | 3.75 | -420 | 1 | 1 | 2 | 0 | 0 | -0.50 | W | +0.7u |
| 2026-05-27 | MLB | ML | home | 3.0 | 1.25 | -144 | -1 | -1 | -2 | 0 | -20 | -1.00 | L | -1.3u |
| 2026-05-27 | MLB | ML | away | 5.0 | 0.50 | -102 | 3 | 0 | 3 | 1 | -5 | -1.00 | L | -0.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | 13 | 0.40 | W | +0.5u |
| 2026-05-27 | MLB | TOTAL | under | 5.0 | 1.00 | -112 | 3 | 1 | 4 | 3 | -2 | 0.00 | W | +0.0u |
| 2026-05-27 | MLB | ML | away | 4.0 | 1.00 | -108 | 1 | -1 | 0 | 0 | 30 | -0.90 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 5.0 | 0.50 | +132 | 2 | 0 | 2 | 2 | 29 | -0.50 | L | -0.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.65 | +104 | 2 | 0 | 2 | 2 | 22 | 0.00 | W | +1.7u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 0.75 | +104 | 2 | 0 | 2 | 2 | 24 | 0.00 | W | +0.8u |
| 2026-05-27 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 2 | 5 | 2 | -34 | -0.30 | L | -2.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.5 | 1.65 | -145 | 1 | 1 | 2 | 1 | 13 | -0.30 | W | +1.1u |
| 2026-05-27 | MLB | ML | away | 5.0 | 5.00 | -126 | 2 | 0 | 2 | 3 | 38 | -4.10 | L | -5.0u |
| 2026-05-27 | MLB | ML | home | 4.0 | 1.25 | -190 | 1 | 0 | 1 | 0 | 0 | -0.70 | W | +0.7u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 3.00 | -135 | 0 | 0 | 0 | 2 | 13 | -0.90 | W | +2.2u |
| 2026-05-27 | NHL | SPREAD | home | 5.0 | 1.00 | -194 | 3 | 0 | 3 | 1 | 1 | 0.00 | L | -1.0u |
| 2026-05-27 | NHL | TOTAL | over | 5.0 | 2.25 | -112 | 3 | 0 | 3 | 1 | -1 | 0.00 | L | -2.3u |
| 2026-05-28 | MLB | TOTAL | over | 5.0 | 3.00 | +101 | 3 | -1 | 2 | 3 | 48 | 0.00 | W | +2.5u |
| 2026-05-28 | MLB | ML | home | 5.0 | 1.25 | -140 | 2 | 0 | 2 | 2 | -20 | -0.50 | L | -1.3u |
| 2026-05-28 | MLB | TOTAL | under | 5.0 | 1.00 | -107 | 1 | 0 | 1 | 1 | 29 | 0.00 | W | +0.0u |
| 2026-05-28 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 1 | 4 | 3 | -32 | -0.60 | L | -2.5u |
| 2026-05-28 | MLB | TOTAL | over | 2.5 | 1.65 | -108 | 2 | 0 | 2 | 2 | -6 | 0.00 | L | -1.6u |
| 2026-05-28 | NBA | SPREAD | away | 5.0 | 1.00 | -110 | 1 | 2 | 3 | 0 | -2 | -0.90 | L | -1.0u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.50 | +118 | 5 | 1 | 6 | 4 | 36 | -0.90 | L | -2.5u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 0.75 | -135 | 2 | 0 | 2 | 1 | -38 | 1.00 | L | -0.8u |
| 2026-05-29 | MLB | ML | home | 5.0 | 3.75 | -124 | 2 | 1 | 3 | 2 | -6 | -1.00 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 1.65 | -106 | 2 | 0 | 2 | 3 | 24 | 0.00 | L | -1.6u |
| 2026-05-29 | MLB | ML | home | 4.0 | 2.50 | +120 | 1 | 0 | 1 | 1 | -2 | 0.40 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 2.25 | -112 | 2 | 0 | 2 | 3 | 55 | 0.00 | W | +2.0u |
| 2026-05-29 | MLB | SPREAD | away | 4.0 | 0.75 | +150 | 0 | 0 | 0 | 1 | 13 | -0.50 | L | -0.8u |
| 2026-05-29 | MLB | ML | away | 5.0 | 2.50 | +140 | 2 | 1 | 3 | 1 | -37 | 1.00 | L | -2.5u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 1.65 | -103 | 0 | 0 | 0 | 2 | -6 | 0.00 | W | +1.6u |
| 2026-05-29 | MLB | ML | away | 4.5 | 1.25 | -142 | 0 | 1 | 1 | 0 | 56 | -1.20 | W | +0.3u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 1.65 | -135 | 1 | 0 | 1 | 2 | -6 | 0.40 | W | +1.2u |
| 2026-05-29 | MLB | ML | home | 4.5 | 1.25 | -134 | 1 | 0 | 1 | 0 | -26 | -1.70 | W | +2.8u |
| 2026-05-29 | MLB | SPREAD | away | 5.0 | 2.25 | -184 | 0 | 0 | 0 | 1 | 13 | -1.00 | W | +1.2u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 0.75 | -109 | 1 | 0 | 1 | 2 | 24 | 0.00 | W | +0.7u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.75 | -106 | 2 | 1 | 3 | 0 | -4 | 0.70 | L | -2.8u |
| 2026-05-29 | MLB | SPREAD | home | 4.0 | 1.65 | -175 | 0 | 0 | 0 | 2 | -6 | -0.80 | L | -1.6u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 0.30 | +105 | 2 | 1 | 3 | 0 | -4 | 0.00 | W | +0.3u |
| 2026-05-29 | MLB | ML | home | 4.5 | 3.75 | -122 | 0 | 1 | 1 | 1 | 20 | -0.60 | L | -3.8u |
| 2026-05-29 | MLB | TOTAL | over | 3.0 | 1.00 | -108 | 0 | 0 | 0 | 1 | 13 | 0.00 | W | +1.5u |
| 2026-05-29 | NHL | ML | away | 5.0 | 1.00 | +205 | 3 | 0 | 3 | 0 | -4 | -0.60 | L | -1.0u |
| 2026-05-29 | NHL | SPREAD | away | 5.0 | 3.00 | -118 | 3 | 1 | 4 | 1 | -4 | 0.00 | L | -3.0u |
| 2026-05-29 | NHL | TOTAL | under | 5.0 | 2.25 | -106 | 2 | 0 | 2 | 2 | 1 | 0.00 | L | -2.3u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +132 | 2 | 1 | 3 | 2 | -25 | 0.00 | L | -2.5u |
| 2026-05-30 | MLB | ML | away | 4.5 | 2.75 | -125 | 1 | 2 | 3 | 1 | 30 | -0.60 | W | +2.3u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -130 | 1 | 0 | 1 | 2 | -7 | -1.20 | L | -5.0u |
| 2026-05-30 | MLB | ML | away | 4.0 | 3.75 | -132 | 1 | 1 | 2 | 0 | 38 | -1.00 | W | +2.9u |
| 2026-05-30 | MLB | SPREAD | home | 3.0 | 0.75 | -143 | 0 | 1 | 1 | 0 | -19 | -1.40 | L | -0.8u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -118 | 1 | 1 | 2 | 1 | -11 | -1.30 | L | -3.8u |
| 2026-05-30 | MLB | SPREAD | away | 4.0 | 1.00 | +152 | 1 | 0 | 1 | 1 | 13 | 0.20 | L | -1.0u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | 3 | -32 | -1.10 | W | +4.2u |
| 2026-05-30 | MLB | TOTAL | over | 4.5 | 0.75 | +100 | 1 | 1 | 2 | 1 | -10 | 0.00 | W | +0.8u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.75 | -130 | 0 | 1 | 1 | -1 | -13 | -1.60 | W | +0.4u |
| 2026-05-30 | MLB | TOTAL | over | 4.0 | 2.25 | -116 | 2 | 0 | 2 | 2 | 32 | 0.00 | W | +1.9u |
| 2026-05-30 | MLB | TOTAL | under | 4.0 | 1.65 | -107 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -1.6u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.50 | +129 | 1 | 0 | 1 | 1 | -19 | -0.90 | W | +0.7u |
| 2026-05-30 | MLB | SPREAD | home | 5.0 | 1.65 | -120 | 2 | 1 | 3 | 2 | -6 | -0.60 | W | +1.4u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +108 | 1 | 0 | 1 | 3 | -32 | -0.90 | W | +2.7u |
| 2026-05-30 | MLB | ML | home | 4.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | -19 | -0.20 | W | +0.6u |
| 2026-05-30 | MLB | ML | home | 5.0 | 1.25 | -102 | 2 | 0 | 2 | 1 | -19 | -0.70 | W | +1.2u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -122 | 1 | 1 | 2 | 2 | -13 | -0.20 | L | -3.8u |
| 2026-05-30 | MLB | TOTAL | under | 3.0 | 0.75 | -108 | 0 | 0 | 0 | 1 | 13 | 0.00 | L | -0.8u |
| 2026-05-30 | NBA | ML | home | 5.0 | 1.00 | -154 | 3 | 3 | 6 | 0 | 5 | 0.00 | L | -1.0u |
| 2026-05-30 | NBA | TOTAL | under | 5.0 | 2.50 | -109 | 5 | 0 | 5 | 6 | 6 | 0.00 | L | -2.5u |
| 2026-05-31 | MLB | ML | away | 3.0 | 2.75 | -125 | -2 | 0 | -2 | 1 | -7 | -1.20 | L | -2.8u |
| 2026-05-31 | MLB | TOTAL | under | 5.0 | 1.65 | -114 | 2 | 0 | 2 | 3 | 5 | 0.00 | L | -1.6u |
| 2026-05-31 | MLB | ML | home | 2.5 | 2.75 | -115 | 1 | 1 | 2 | 1 | 41 | 0.00 | W | +2.4u |
| 2026-05-31 | MLB | ML | away | 5.0 | 1.00 | +115 | -1 | 0 | -1 | 2 | -13 | -0.60 | L | -1.0u |
| 2026-05-31 | MLB | SPREAD | away | 5.0 | 1.00 | -117 | 3 | 1 | 4 | 3 | 3 | -0.20 | L | -1.0u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -164 | 0 | 1 | 1 | 2 | -13 | -1.20 | W | +2.3u |
| 2026-05-31 | MLB | ML | away | 3.0 | 1.25 | -184 | 0 | 0 | 0 | 0 | -39 | -1.70 | W | +0.7u |
| 2026-05-31 | MLB | ML | home | 2.5 | 1.25 | -232 | 0 | 0 | 0 | 0 | 15 | -0.50 | W | +0.5u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -102 | 0 | 1 | 1 | 3 | -19 | 0.20 | W | +4.9u |
| 2026-05-31 | MLB | TOTAL | over | 4.0 | 1.00 | +101 | 2 | 1 | 3 | 2 | 7 | 0.00 | L | -1.0u |
| 2026-05-31 | MLB | ML | away | 4.5 | 2.50 | +110 | 0 | 0 | 0 | 0 | -39 | -1.10 | L | -2.5u |
| 2026-06-01 | MLB | ML | home | 4.5 | 3.00 | -155 | 3 | 2 | 5 | 2 | 13 | -1.00 | W | +2.1u |
| 2026-06-01 | MLB | ML | away | 4.0 | 1.00 | +135 | 2 | 2 | 4 | 1 | 33 | -0.20 | W | +1.4u |
| 2026-06-01 | MLB | ML | away | 5.0 | 2.50 | +160 | 2 | -1 | 1 | 1 | 32 | -1.30 | W | +2.7u |
| 2026-06-01 | MLB | TOTAL | under | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 2 | -18 | 0.00 | L | -1.0u |
| 2026-06-01 | MLB | ML | home | 3.0 | 0.50 | -142 | -1 | 0 | -1 | -2 | -15 | -0.40 | L | -0.5u |
| 2026-06-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 26 | 0.00 | L | -5.0u |
| 2026-06-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 3 | -10 | 0.00 | W | +2.7u |
| 2026-06-02 | MLB | ML | home | 2.5 | 0.25 | -215 | -1 | 0 | -1 | -1 | -17 | -1.40 | L | -0.3u |
| 2026-06-02 | MLB | TOTAL | under | 4.0 | 1.00 | -117 | 1 | 0 | 1 | 0 | -2 | 0.00 | L | -1.0u |
| 2026-06-02 | MLB | ML | away | 5.0 | 2.50 | +130 | 2 | 0 | 2 | -1 | 29 | -0.60 | W | +3.1u |
| 2026-06-02 | MLB | ML | away | 3.0 | 0.50 | +100 | 1 | 0 | 1 | 1 | 13 | -1.20 | W | +0.5u |
| 2026-06-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 13 | 0.00 | L | -3.0u |
| 2026-06-02 | MLB | ML | home | 4.0 | 1.00 | -112 | 1 | 0 | 1 | 0 | 0 | -1.10 | L | -1.0u |
| 2026-06-02 | MLB | ML | home | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 0 | 0 | -0.50 | L | -1.0u |
| 2026-06-02 | MLB | ML | away | 5.0 | 2.50 | +102 | 0 | -1 | -1 | 2 | -3 | 0.00 | L | -2.5u |
| 2026-06-02 | NHL | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 2 | 4 | 2 | 13 | 0.00 | W | +4.3u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -150 | 3 | 1 | 4 | 4 | -19 | -1.30 | W | +0.3u |
| 2026-06-03 | MLB | ML | away | 4.0 | 1.00 | +134 | -1 | -1 | -2 | -2 | 13 | -1.00 | W | +1.2u |
| 2026-06-03 | MLB | ML | away | 4.0 | 1.00 | +125 | 0 | -1 | -1 | -1 | 24 | 0.40 | W | +1.3u |
| 2026-06-03 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 55 | 0.00 | L | -3.0u |
| 2026-06-03 | MLB | ML | home | 4.5 | 1.50 | +167 | 0 | 0 | 0 | -2 | -19 | -0.40 | L | -1.5u |
| 2026-06-03 | MLB | SPREAD | away | 4.0 | 1.00 | -111 | 1 | 0 | 1 | 0 | 6 | 0.20 | W | +0.8u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -103 | 3 | 1 | 4 | 2 | -24 | -1.20 | L | -0.5u |
| 2026-06-03 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | -16 | 0.00 | L | -5.0u |
| 2026-06-03 | MLB | ML | away | 3.0 | 0.50 | +119 | 1 | 0 | 1 | -1 | 5 | 0.00 | W | +0.6u |
| 2026-06-03 | MLB | ML | away | 4.5 | 3.00 | -137 | 0 | 0 | 0 | -2 | 6 | -1.50 | L | -3.0u |
| 2026-06-03 | MLB | ML | home | 5.0 | 5.00 | -215 | 0 | 1 | 1 | -1 | 26 | -1.00 | W | +2.3u |
| 2026-06-03 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 1 | 1 | 2 | 0 | -17 | 0.00 | L | -0.3u |
| 2026-06-03 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 1 | 0 | 1 | 0 | -2 | 0.00 | W | +2.5u |
| 2026-06-03 | MLB | ML | home | 4.5 | 3.00 | -112 | 0 | 0 | 0 | 0 | 0 | -0.90 | W | +2.7u |
| 2026-06-03 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 0 | 0.00 | W | +4.5u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -139 | 0 | 0 | 0 | -2 | 46 | -1.20 | W | +0.3u |
| 2026-06-03 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 1 | 0 | 1 | 0 | -2 | 0.00 | L | -2.5u |
| 2026-06-03 | NBA | ML | home | 2.5 | 0.25 | -198 | 3 | 4 | 7 | 5 | 9 | -1.20 | L | -0.3u |
| 2026-06-03 | NBA | SPREAD | away | 2.5 | 0.25 | -104 | 3 | -1 | 2 | 4 | 1 | -1.20 | W | +0.2u |
| 2026-06-04 | MLB | ML | away | 3.0 | 0.50 | +104 | 1 | 0 | 1 | 0 | -17 | 0.00 | W | +0.5u |
| 2026-06-04 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | -1 | 0 | 0 | 21 | 0.00 | L | -1.0u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | +102 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-04 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 0 | 42 | -0.40 | W | +3.0u |
| 2026-06-04 | MLB | SPREAD | away | 5.0 | 5.00 | -111 | 0 | 0 | 0 | 1 | 19 | 0.00 | L | -5.0u |
| 2026-06-04 | MLB | ML | home | 5.0 | 5.00 | -131 | 1 | 0 | 1 | 0 | 42 | 0.20 | W | +3.5u |
| 2026-06-04 | MLB | ML | away | 2.5 | 0.25 | +105 | 0 | 0 | 0 | 1 | 2 | -1.00 | W | +0.2u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | -210 | 1 | 0 | 1 | 1 | 50 | -1.00 | W | +0.5u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | -188 | 0 | 0 | 0 | -1 | -13 | -1.10 | L | -1.0u |
| 2026-06-04 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 33 | 0.00 | W | +2.7u |
| 2026-06-04 | MLB | ML | home | 3.0 | 0.50 | -235 | 4 | 0 | 4 | 4 | 31 | 0.00 | L | -0.5u |
| 2026-06-04 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 3 | 0.00 | L | -5.0u |
| 2026-06-04 | NHL | ML | home | 2.5 | 0.25 | -160 | -3 | 0 | -3 | 2 | 11 | -0.40 | W | +0.2u |
| 2026-06-05 | MLB | ML | home | 2.5 | 0.25 | -144 | 1 | 1 | 2 | -1 | -1 | -1.20 | L | -0.3u |
| 2026-06-05 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | -1 | -1 | -1 | 20 | 0.00 | W | +2.8u |
| 2026-06-05 | MLB | ML | away | 3.0 | 0.50 | +128 | 1 | 0 | 1 | 0 | 24 | 0.00 | W | +0.6u |
| 2026-06-05 | MLB | TOTAL | over | 4.0 | 1.00 | -109 | 0 | 0 | 0 | 0 | -2 | 0.00 | P | +0.0u |
| 2026-06-05 | MLB | ML | home | 3.0 | 0.50 | -136 | 1 | 0 | 1 | 1 | -1 | 0.00 | W | +0.4u |
| 2026-06-05 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 3 | 0 | 3 | 4 | 24 | 0.00 | W | +0.4u |
| 2026-06-05 | MLB | ML | away | 5.0 | 5.00 | -122 | 0 | 1 | 1 | 1 | 55 | -0.80 | L | -5.0u |
| 2026-06-05 | MLB | ML | home | 5.0 | 5.00 | -171 | 0 | 2 | 2 | 2 | 29 | -0.20 | W | +2.7u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -188 | 2 | 0 | 2 | 1 | 13 | -0.90 | W | +0.5u |
| 2026-06-05 | MLB | ML | away | 4.0 | 1.00 | -105 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -141 | 3 | 2 | 5 | 2 | -7 | 0.30 | W | +0.7u |
| 2026-06-05 | MLB | TOTAL | over | 5.0 | 2.50 | -110 | 0 | 1 | 1 | -1 | 29 | 0.00 | W | +2.5u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -172 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-05 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 0 | -1 | -1 | 0 | -2 | 0.00 | W | +4.4u |
| 2026-06-05 | MLB | ML | away | 4.5 | 3.00 | -129 | -1 | 1 | 0 | -2 | 38 | -1.10 | W | +2.2u |
| 2026-06-05 | MLB | SPREAD | away | 3.0 | 0.50 | +126 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.6u |
| 2026-06-05 | NBA | ML | home | 2.5 | 0.25 | -230 | 2 | 2 | 4 | 4 | 11 | 1.00 | L | -0.3u |
| 2026-06-05 | NBA | SPREAD | home | 2.5 | 0.25 | -106 | 3 | 0 | 3 | 0 | 4 | -0.70 | L | -0.3u |
| 2026-06-06 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 1 | 0 | 1 | 0 | 14 | 0.00 | W | +0.2u |
| 2026-06-06 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 6 | 0.00 | W | +2.7u |
| 2026-06-06 | MLB | ML | home | 4.5 | 3.00 | -126 | 0 | 0 | 0 | -1 | -13 | -1.00 | W | +2.4u |
| 2026-06-06 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | 0 | 0.00 | W | +2.7u |
| 2026-06-06 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 1 | 1 | -1 | 13 | 0.00 | L | -1.0u |
| 2026-06-06 | MLB | ML | home | 3.0 | 0.50 | -130 | 0 | 0 | 0 | -1 | 11 | -0.90 | L | -0.5u |
| 2026-06-06 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -5.0u |
| 2026-06-06 | MLB | ML | home | 4.5 | 3.00 | -350 | 0 | 1 | 1 | -1 | 45 | -0.90 | W | +0.9u |
| 2026-06-06 | MLB | TOTAL | under | 5.0 | 2.50 | -110 | 0 | 0 | 0 | 0 | 3 | 0.00 | L | -2.5u |
| 2026-06-06 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 1 | 4 | 3 | 3 | 0.00 | W | +2.8u |
| 2026-06-06 | MLB | ML | home | 5.0 | 5.00 | -123 | 0 | 0 | 0 | 1 | 9 | 0.00 | W | +4.1u |
| 2026-06-06 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | L | -1.0u |
| 2026-06-06 | MLB | ML | home | 5.0 | 2.50 | +117 | -2 | -1 | -3 | 0 | 29 | 0.00 | L | -2.5u |
| 2026-06-06 | MLB | ML | home | 5.0 | 5.00 | -154 | 2 | 1 | 3 | -1 | 29 | -0.80 | L | -5.0u |
| 2026-06-07 | MLB | ML | home | 4.5 | 3.00 | -130 | 1 | 0 | 1 | -1 | 26 | -0.90 | W | +2.2u |
| 2026-06-07 | MLB | TOTAL | over | 3.0 | 0.50 | -112 | 0 | 0 | 0 | 3 | 2 | 0.00 | L | -0.5u |
| 2026-06-07 | MLB | ML | home | 5.0 | 5.00 | -143 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +3.5u |
| 2026-06-07 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | 0 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -136 | 1 | 0 | 1 | -1 | 26 | 0.00 | W | +0.7u |
| 2026-06-07 | MLB | ML | home | 4.5 | 3.00 | -165 | 2 | 2 | 4 | 2 | -13 | -1.10 | W | +1.8u |
| 2026-06-07 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 1 | 12 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | away | 2.5 | 0.25 | -107 | 1 | 0 | 1 | -2 | 10 | -0.80 | W | +0.2u |
| 2026-06-07 | MLB | TOTAL | over | 2.5 | 0.25 | -115 | 0 | 0 | 0 | -1 | -22 | 0.00 | W | +0.2u |
| 2026-06-07 | MLB | ML | home | 2.5 | 0.25 | -210 | -1 | 0 | -1 | 0 | 15 | 0.80 | L | -0.3u |
| 2026-06-07 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -0.5u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | +158 | 1 | 0 | 1 | 2 | -6 | -1.30 | L | -0.5u |
| 2026-06-07 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | W | +0.9u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -105 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-07 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | -3 | 0.00 | L | -5.0u |
| 2026-06-07 | MLB | SPREAD | away | 4.5 | 3.00 | -152 | 2 | 0 | 2 | 1 | 48 | -0.50 | W | +1.9u |
| 2026-06-07 | MLB | TOTAL | over | 5.0 | 2.25 | -114 | 1 | 1 | 2 | 1 | -14 | 0.00 | L | -2.3u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | +102 | 1 | 0 | 1 | -3 | 7 | -0.20 | W | +0.5u |
| 2026-06-07 | MLB | SPREAD | away | 4.5 | 2.25 | +164 | 1 | 1 | 2 | 1 | 13 | 29.50 | W | +3.7u |
| 2026-06-07 | MLB | ML | away | 2.5 | 0.25 | +103 | -1 | 0 | -1 | -1 | 11 | 0.20 | W | +0.3u |
| 2026-06-07 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | -1 | 0 | 1 | 31 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -102 | 2 | 0 | 2 | -1 | -13 | 0.50 | W | +1.0u |
| 2026-06-07 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | -1 | 14 | 0.00 | W | +4.8u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | -127 | 0 | 1 | 1 | -2 | 10 | -1.90 | W | +0.4u |
| 2026-06-07 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | -2 | 0.00 | W | +0.5u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -113 | 6 | 1 | 7 | 5 | 60 | -0.50 | L | -3.0u |
| 2026-06-08 | MLB | ML | home | 4.5 | 3.00 | -129 | 3 | 0 | 3 | 1 | 29 | -0.40 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | -1 | -20 | 0.00 | L | -3.0u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -121 | 1 | 1 | 2 | -1 | -10 | -1.60 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 71 | 0.00 | P | +0.0u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -146 | 1 | 0 | 1 | -1 | -20 | -0.50 | W | +2.0u |
| 2026-06-08 | MLB | ML | home | 4.0 | 1.00 | -118 | 2 | 0 | 2 | 1 | -77 | -0.40 | L | -1.0u |
| 2026-06-08 | MLB | TOTAL | over | 4.5 | 2.50 | -116 | -2 | -2 | -4 | -2 | 23 | 0.00 | W | +2.5u |
| 2026-06-08 | MLB | ML | away | 4.5 | 1.50 | +151 | 0 | -1 | -1 | 0 | 14 | 0.00 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | under | 5.0 | 2.50 | +101 | 0 | 0 | 0 | -1 | -22 | 0.00 | W | +2.5u |
| 2026-06-08 | NBA | ML | home | 2.5 | 0.25 | -132 | 5 | 2 | 7 | 3 | 6 | -0.40 | L | -0.3u |
| 2026-06-08 | NBA | SPREAD | away | 5.0 | 5.00 | -110 | 3 | 2 | 5 | 2 | 4 | -1.30 | W | +4.3u |
| 2026-06-08 | NBA | TOTAL | under | 4.0 | 1.00 | -107 | 1 | 0 | 1 | 3 | -1 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 2.5 | 0.25 | +132 | 1 | 0 | 1 | 3 | 31 | -1.20 | L | -0.3u |
| 2026-06-09 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 3 | 0.00 | W | +4.3u |
| 2026-06-09 | MLB | ML | away | 3.0 | 0.50 | -148 | 1 | 0 | 1 | 2 | -3 | 0.00 | L | -0.5u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 3 | 25 | 0.80 | L | -1.0u |
| 2026-06-09 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -143 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | SPREAD | home | 4.5 | 3.00 | -117 | 1 | 0 | 1 | 0 | 7 | 0.00 | W | +2.6u |
| 2026-06-09 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | -2 | 2 | 0.00 | W | +0.5u |
| 2026-06-09 | MLB | ML | away | 5.0 | 5.00 | -122 | 2 | 1 | 3 | 2 | 21 | 0.00 | W | +4.1u |
| 2026-06-09 | MLB | ML | away | 2.5 | 0.25 | -120 | 0 | 0 | 0 | -1 | -19 | 0.00 | L | -0.3u |
| 2026-06-09 | MLB | ML | home | 4.0 | 1.00 | -107 | 1 | 0 | 1 | -1 | 16 | -1.30 | L | -1.0u |
| 2026-06-09 | MLB | ML | home | 5.0 | 5.00 | -105 | 1 | -1 | 0 | 0 | 0 | 0.00 | W | +4.8u |
| 2026-06-09 | MLB | ML | away | 4.5 | 2.50 | +115 | 1 | 0 | 1 | -1 | -13 | -0.70 | L | -2.5u |
| 2026-06-09 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 5 | 0.00 | W | +2.7u |
| 2026-06-09 | MLB | ML | away | 3.0 | 0.50 | -116 | 1 | 0 | 1 | 2 | 31 | 0.00 | W | +0.4u |
| 2026-06-09 | MLB | ML | home | 5.0 | 2.50 | +100 | 4 | 2 | 6 | -1 | -16 | 0.00 | W | +2.5u |
| 2026-06-09 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | -1 | -12 | 0.00 | W | +4.5u |
| 2026-06-09 | MLB | ML | home | 4.0 | 1.00 | +102 | 2 | 0 | 2 | 2 | -18 | -1.20 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -119 | 1 | 0 | 1 | -1 | 26 | -0.80 | L | -1.0u |
| 2026-06-09 | NHL | SPREAD | away | 4.5 | 1.00 | +215 | 0 | 0 | 0 | 2 | 11 | 41.70 | W | +2.1u |
| 2026-06-09 | NHL | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 2 | 13 | 0.00 | L | -5.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 3 | 0.00 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 4.5 | 3.00 | -148 | 0 | 0 | 0 | 0 | 35 | -0.50 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | +136 | 3 | 0 | 3 | 4 | 14 | -1.10 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | W | +0.9u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | -172 | 1 | 0 | 1 | 1 | 0 | -1.00 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | W | +4.5u |
| 2026-06-10 | MLB | ML | away | 3.0 | 0.50 | +136 | 0 | 0 | 0 | -2 | 0 | 0.00 | L | -0.5u |
| 2026-06-10 | MLB | TOTAL | under | 4.0 | 1.00 | -113 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -1.0u |
| 2026-06-10 | MLB | ML | home | 2.5 | 0.25 | -117 | 0 | 0 | 0 | 2 | 18 | 0.00 | W | +0.2u |
| 2026-06-10 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 0 | 0.00 | L | -5.0u |
| 2026-06-10 | MLB | ML | home | 4.0 | 1.00 | +178 | 1 | 0 | 1 | -2 | 40 | -1.40 | W | +1.7u |
| 2026-06-10 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 3 | 0 | 3 | -1 | -16 | 0.00 | W | +4.5u |
| 2026-06-10 | MLB | ML | away | 5.0 | 5.00 | -104 | 0 | 0 | 0 | 1 | 19 | -0.20 | L | -5.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | +148 | 0 | 0 | 0 | -1 | 16 | -0.80 | W | +1.5u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 28 | 0.00 | W | +2.7u |
| 2026-06-10 | MLB | ML | home | 4.5 | 2.50 | +103 | 0 | 0 | 0 | 1 | 12 | 0.00 | W | +2.6u |
| 2026-06-10 | MLB | ML | home | 4.0 | 1.00 | -127 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 30 | 0.00 | W | +3.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | -120 | 1 | 0 | 1 | 0 | 0 | -0.40 | W | +0.8u |
| 2026-06-10 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | -1 | 0 | -1 | 1 | 19 | 0.00 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 5.0 | 5.00 | -106 | 1 | 0 | 1 | -2 | 27 | -0.70 | L | -5.0u |
| 2026-06-10 | MLB | SPREAD | home | 2.5 | 1.00 | -190 | 0 | 0 | 0 | 0 | -10 | -31.40 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 4 | 1 | 5 | -1 | 1 | 0.00 | L | -5.0u |
| 2026-06-10 | NBA | ML | away | 2.5 | 0.25 | +112 | -2 | 0 | -2 | -3 | -11 | 0.20 | L | -0.3u |
| 2026-06-10 | NBA | TOTAL | under | 2.5 | 0.25 | -108 | 4 | 1 | 5 | 3 | 9 | 0.00 | W | +0.2u |
| 2026-06-11 | MLB | ML | away | 4.0 | 1.00 | +112 | 0 | 0 | 0 | 0 | 26 | 0.00 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -120 | -1 | 0 | -1 | 4 | -10 | -1.70 | P | +0.0u |
| 2026-06-11 | MLB | SPREAD | away | 4.5 | 2.50 | +140 | 1 | 0 | 1 | 2 | -3 | -1.00 | P | +0.0u |
| 2026-06-11 | MLB | ML | home | 5.0 | 5.00 | — | 1 | 0 | 1 | 1 | -2 | 0.00 | L | -5.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -167 | 1 | -1 | 0 | 0 | 32 | -0.10 | W | +0.3u |
| 2026-06-11 | MLB | TOTAL | under | 5.0 | 1.00 | -108 | 1 | 1 | 2 | 0 | -27 | 0.00 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 5.0 | 1.00 | +110 | 3 | 1 | 4 | 2 | -13 | -0.90 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -111 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-11 | MLB | ML | home | 5.0 | 5.00 | -131 | 2 | 1 | 3 | -1 | -16 | 0.00 | W | +3.8u |
| 2026-06-11 | MLB | ML | away | 4.0 | 1.00 | +100 | 1 | 0 | 1 | 1 | -36 | -0.50 | W | +1.0u |
| 2026-06-11 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | -1 | -2 | -2 | 19 | 0.00 | W | +0.2u |
| 2026-06-11 | NHL | TOTAL | under | 3.0 | 0.50 | -104 | 2 | 0 | 2 | 3 | 14 | 0.00 | P | +0.0u |
| 2026-06-12 | MLB | ML | home | 5.0 | 5.00 | -114 | 0 | 0 | 0 | -1 | -16 | 0.00 | W | +4.4u |
| 2026-06-12 | MLB | ML | home | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | -32 | 0.00 | L | -3.0u |
| 2026-06-12 | MLB | TOTAL | over | 4.0 | 1.00 | +100 | 0 | 0 | 0 | 0 | -2 | 0.00 | L | -1.0u |
| 2026-06-12 | MLB | ML | home | 3.0 | 0.50 | -210 | 2 | 0 | 2 | 1 | -16 | -0.10 | W | +0.2u |
| 2026-06-12 | MLB | ML | away | 2.5 | 0.25 | +111 | 3 | 1 | 4 | 2 | -13 | -0.70 | L | -0.3u |
| 2026-06-12 | MLB | ML | away | 4.0 | 1.00 | -114 | 2 | 0 | 2 | 1 | -10 | -1.20 | W | +0.9u |
| 2026-06-12 | MLB | ML | home | 5.0 | 2.50 | +123 | 0 | 1 | 1 | 0 | 3 | 0.00 | W | +3.1u |
| 2026-06-12 | MLB | SPREAD | away | 4.0 | 1.00 | +121 | 0 | 0 | 0 | 2 | 32 | 0.40 | L | -1.0u |
| 2026-06-12 | MLB | ML | home | 4.5 | 3.00 | -138 | 1 | 0 | 1 | -1 | 16 | -1.00 | L | -3.0u |
| 2026-06-12 | MLB | SPREAD | home | 3.0 | 0.50 | -107 | 2 | 0 | 2 | 2 | 3 | -0.40 | W | +0.4u |
| 2026-06-12 | MLB | ML | away | 2.5 | 0.25 | +118 | -1 | 0 | -1 | -2 | -29 | -0.20 | L | -0.3u |
| 2026-06-12 | MLB | ML | away | 4.0 | 1.00 | -136 | 2 | 0 | 2 | 1 | -16 | -1.30 | W | +0.7u |
| 2026-06-12 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | -1 | -1 | 0 | -1 | 0.00 | W | +2.7u |
| 2026-06-12 | MLB | ML | home | 3.0 | 0.50 | -134 | 2 | 0 | 2 | 2 | -3 | -1.10 | W | +0.4u |
| 2026-06-12 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 12 | 0.00 | W | +2.7u |
| 2026-06-12 | MLB | SPREAD | away | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 0 | 35 | -1.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | away | 5.0 | 5.00 | -128 | 3 | 0 | 3 | -1 | 32 | -0.20 | L | -5.0u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | +123 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | away | 4.5 | 3.00 | -102 | 0 | 0 | 0 | 1 | 19 | -2.00 | W | +2.9u |
| 2026-06-13 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 0 | 6 | 0.00 | W | +4.5u |
| 2026-06-13 | MLB | ML | away | 2.5 | 0.25 | -118 | 0 | 0 | 0 | -3 | 9 | -1.30 | W | +0.2u |
| 2026-06-13 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +2.7u |
| 2026-06-13 | MLB | ML | away | 4.5 | 2.50 | +136 | 1 | 0 | 1 | -1 | 12 | 1.30 | L | -2.5u |
| 2026-06-13 | MLB | ML | home | 5.0 | 2.50 | +134 | 2 | 0 | 2 | -2 | -18 | 0.00 | W | +3.4u |
| 2026-06-13 | MLB | SPREAD | home | 4.0 | 1.00 | -130 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.8u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | -120 | 1 | 0 | 1 | 2 | 3 | 0.20 | W | +0.8u |
| 2026-06-13 | MLB | ML | away | 4.5 | 2.50 | +114 | 1 | 0 | 1 | 0 | 6 | 0.00 | L | -2.5u |
| 2026-06-13 | MLB | TOTAL | under | 4.0 | 1.00 | +101 | 0 | 0 | 0 | 0 | -2 | 0.00 | W | +1.0u |
| 2026-06-13 | MLB | ML | home | 4.5 | 3.00 | -157 | 0 | 0 | 0 | -2 | -10 | 0.00 | L | -3.0u |
| 2026-06-13 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 48 | 0.00 | W | +0.5u |
| 2026-06-13 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | -2 | 13 | -0.40 | W | +4.3u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | -106 | 0 | 0 | 0 | 1 | 19 | 0.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | home | 4.0 | 1.00 | -112 | 0 | 0 | 0 | 2 | 3 | -1.30 | W | +0.8u |
| 2026-06-13 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 14 | 0.00 | L | -5.0u |
| 2026-06-13 | NBA | ML | home | 2.5 | 0.25 | -205 | 6 | 6 | 12 | 6 | -27 | 0.60 | L | -0.3u |
| 2026-06-14 | MLB | ML | away | 4.0 | 1.00 | +106 | 1 | 1 | 2 | 3 | -4 | -1.50 | L | -1.0u |
| 2026-06-14 | MLB | ML | home | 2.5 | 0.25 | -124 | 1 | 0 | 1 | 3 | 6 | -1.50 | W | +0.2u |
| 2026-06-14 | MLB | SPREAD | away | 5.0 | 5.00 | -180 | 1 | 0 | 1 | 0 | -7 | 0.00 | L | -5.0u |
| 2026-06-14 | MLB | ML | home | 5.0 | 5.00 | -192 | 1 | 0 | 1 | 1 | 2 | 0.00 | L | -5.0u |
| 2026-06-14 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | ML | away | 4.5 | 2.50 | +106 | 0 | 0 | 0 | 1 | 19 | 0.00 | L | -2.5u |
| 2026-06-14 | MLB | SPREAD | away | 4.5 | 3.00 | -116 | 2 | 0 | 2 | 2 | -7 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | SPREAD | away | 4.0 | 1.00 | -158 | 1 | -1 | 0 | 1 | 48 | 0.10 | W | +0.6u |
| 2026-06-14 | MLB | ML | away | 4.0 | 1.00 | -125 | 2 | 1 | 3 | 3 | 7 | -1.20 | W | +0.8u |
| 2026-06-14 | MLB | ML | away | 4.5 | 3.00 | -101 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | ML | away | 2.5 | 0.25 | -115 | 2 | 0 | 2 | 2 | -3 | 0.00 | W | +0.2u |
| 2026-06-14 | NHL | ML | away | 2.5 | 0.25 | -115 | -1 | 1 | 0 | 1 | -5 | -0.20 | W | +0.2u |
| 2026-06-14 | NHL | TOTAL | under | 5.0 | 5.00 | -110 | -1 | 0 | -1 | 1 | 5 | 0.00 | W | +4.4u |
| 2026-06-15 | MLB | ML | home | 4.0 | 1.00 | -204 | 1 | 0 | 1 | 0 | 0 | -0.60 | W | +0.0u |
| 2026-06-15 | MLB | SPREAD | away | 4.5 | 3.00 | -114 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +2.9u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | SPREAD | home | 4.0 | 1.00 | +153 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-15 | MLB | TOTAL | over | 4.5 | 2.50 | -110 | 0 | 0 | 0 | 0 | -2 | 0.00 | W | +0.0u |
| 2026-06-15 | MLB | ML | away | 3.0 | 0.50 | +115 | 2 | 0 | 2 | 2 | 26 | -0.80 | L | -0.5u |
| 2026-06-15 | MLB | ML | away | 3.0 | 0.50 | +160 | 2 | 0 | 2 | 0 | 41 | -0.70 | L | -0.5u |
| 2026-06-15 | MLB | SPREAD | away | 2.5 | 0.25 | -120 | 0 | 0 | 0 | -1 | 4 | 0.00 | L | -0.3u |
| 2026-06-15 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 1 | 46 | 0.00 | L | -3.0u |
| 2026-06-15 | MLB | ML | home | 2.5 | 0.25 | -157 | 1 | 0 | 1 | 2 | -18 | -0.20 | L | -0.3u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | ML | home | 3.0 | 0.50 | -132 | 3 | 1 | 4 | 3 | 6 | -0.70 | W | +2.2u |
| 2026-06-15 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | ML | home | 3.0 | 0.50 | -154 | 1 | 0 | 1 | 3 | -21 | 0.50 | W | +0.0u |
| 2026-06-15 | MLB | SPREAD | away | 5.0 | 5.00 | -160 | 1 | 0 | 1 | 1 | 13 | -1.30 | L | -5.0u |
| 2026-06-15 | MLB | ML | home | 2.5 | 0.25 | -161 | -1 | 1 | 0 | -3 | -5 | -1.00 | W | +0.0u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | -1 | 0.00 | L | -1.0u |
| 2026-06-15 | SOC | ML | home | 2.5 | 0.25 | -105 | 3 | 3 | 6 | 1 | -8 | -1.10 | L | -0.3u |
| 2026-06-16 | MLB | ML | home | 4.0 | 1.00 | -145 | 1 | 0 | 1 | -1 | -12 | -1.00 | W | +0.0u |
| 2026-06-16 | MLB | SPREAD | away | 4.5 | 1.00 | -162 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | TOTAL | under | 5.0 | 5.00 | -101 | 1 | 0 | 1 | 1 | 7 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -194 | 1 | 0 | 1 | -1 | 22 | 0.40 | L | -3.0u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 31 | 0.00 | L | -3.0u |
| 2026-06-16 | MLB | SPREAD | home | 4.0 | 1.00 | +156 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -163 | 5 | 3 | 8 | 3 | 27 | -1.00 | W | +2.4u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | -1 | 0 | -1 | -2 | -29 | 0.00 | L | -3.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -135 | 3 | 2 | 5 | 0 | -9 | -2.10 | W | +4.5u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 10 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | away | 2.5 | 0.25 | -106 | 1 | 0 | 1 | 1 | 12 | -0.20 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -174 | 2 | 1 | 3 | 2 | 26 | -1.40 | W | +2.3u |
| 2026-06-16 | MLB | ML | away | 4.0 | 1.00 | -116 | 0 | 0 | 0 | -1 | 5 | -0.80 | L | -1.0u |
| 2026-06-16 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 3 | 38 | 0.00 | L | -5.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -138 | 0 | 0 | 0 | -1 | -16 | 0.70 | L | -0.5u |
| 2026-06-16 | MLB | ML | away | 3.0 | 0.50 | -102 | 1 | 0 | 1 | 0 | 0 | -1.00 | L | -0.5u |
| 2026-06-16 | MLB | SPREAD | away | 4.0 | 1.00 | -160 | 0 | 0 | 0 | 2 | 26 | 30.10 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -161 | 1 | 1 | 2 | 0 | -27 | -0.40 | L | -0.5u |
| 2026-06-16 | MLB | ML | away | 5.0 | 2.50 | +120 | -1 | -1 | -2 | -1 | 19 | -1.80 | L | -2.5u |
| 2026-06-16 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 2 | -5 | 0.00 | L | -1.0u |
| 2026-06-16 | MLB | ML | away | 2.5 | 0.25 | -112 | 1 | 0 | 1 | 2 | 2 | -0.90 | W | +0.0u |
| 2026-06-16 | MLB | SPREAD | away | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-16 | SOC | ML | home | 4.0 | 1.00 | +1375 | 1 | 0 | 1 | -2 | -33 | 0.00 | L | -1.0u |
| 2026-06-17 | MLB | ML | away | 2.5 | 0.25 | +126 | -2 | 0 | -2 | -2 | -29 | -0.40 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +2.7u |
| 2026-06-17 | MLB | ML | away | 4.5 | 2.50 | +112 | -1 | -1 | -2 | -2 | 6 | -1.20 | L | -2.5u |
| 2026-06-17 | MLB | ML | home | 5.0 | 5.00 | -173 | 1 | 0 | 1 | 0 | -21 | 0.00 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +2.7u |
| 2026-06-17 | MLB | ML | away | 5.0 | 2.50 | +100 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +2.5u |
| 2026-06-17 | MLB | ML | home | 4.5 | 2.50 | +115 | 1 | 0 | 1 | 0 | 7 | 0.00 | L | -2.5u |
| 2026-06-17 | MLB | SPREAD | home | 4.5 | 3.00 | -141 | 0 | 0 | 0 | 1 | 19 | 0.00 | L | -3.0u |
| 2026-06-17 | MLB | SPREAD | away | 5.0 | 5.00 | -181 | 0 | 0 | 0 | 1 | 13 | -0.80 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 2 | 10 | 0.00 | L | -5.0u |
| 2026-06-17 | MLB | ML | home | 2.5 | 0.25 | -157 | 0 | 0 | 0 | 1 | 19 | -1.10 | W | +0.0u |
| 2026-06-17 | MLB | SPREAD | home | 2.5 | 0.25 | +125 | -1 | 0 | -1 | 0 | 19 | -0.60 | L | -0.3u |
| 2026-06-17 | MLB | ML | home | 5.0 | 5.00 | -123 | 1 | 0 | 1 | 0 | 15 | 0.00 | L | -5.0u |
| 2026-06-17 | MLB | SPREAD | home | 4.0 | 1.00 | +161 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-17 | SOC | ML | away | 5.0 | 1.00 | +1028 | 1 | 0 | 1 | -5 | -45 | 0.00 | L | -1.0u |
| 2026-06-17 | SOC | ML | home | 4.0 | 1.00 | -140 | 0 | 0 | 0 | 0 | 8 | -0.30 | W | +0.0u |
| 2026-06-17 | SOC | ML | home | 4.0 | 1.00 | +142 | 1 | 0 | 1 | 3 | -24 | 0.00 | W | +0.0u |
| 2026-06-18 | MLB | ML | home | 4.0 | 1.00 | -138 | 1 | 0 | 1 | 1 | 2 | 0.00 | W | +0.0u |
| 2026-06-18 | MLB | ML | home | 4.5 | 3.00 | -141 | 1 | 1 | 2 | 0 | 11 | -1.30 | L | -3.0u |
| 2026-06-18 | MLB | ML | home | 4.5 | 3.00 | -151 | 3 | 0 | 3 | 3 | 27 | -1.50 | W | +0.0u |
| 2026-06-18 | MLB | ML | away | 4.5 | 2.50 | +108 | 3 | 1 | 4 | 5 | 13 | -1.20 | W | +2.6u |
| 2026-06-18 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 31 | 0.00 | W | +2.7u |
| 2026-06-18 | MLB | SPREAD | away | 4.5 | 3.00 | -199 | 1 | 0 | 1 | 2 | -3 | 0.00 | L | -3.0u |
| 2026-06-18 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 3 | 4 | 0.00 | W | +2.8u |
| 2026-06-18 | SOC | ML | home | 5.0 | 2.50 | +113 | 2 | 0 | 2 | 4 | 0 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | ML | home | 4.5 | 3.00 | -205 | 1 | 0 | 1 | 2 | 18 | 0.10 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 4.5 | 3.00 | -114 | 0 | 0 | 0 | 2 | 32 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 5.0 | 5.00 | -194 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 3.0 | 0.50 | -117 | 0 | 0 | 0 | 0 | -2 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | ML | away | 4.5 | 1.00 | +239 | 1 | 0 | 1 | 0 | -21 | 0.00 | L | -1.0u |
| 2026-06-19 | MLB | SPREAD | home | 4.5 | 3.00 | -111 | 1 | 1 | 2 | 0 | 3 | 0.00 | W | +3.1u |
| 2026-06-19 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 1 | 3 | 0.00 | L | -3.0u |
| 2026-06-19 | MLB | ML | away | 4.0 | 1.00 | +107 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -1.0u |
| 2026-06-19 | MLB | SPREAD | away | 4.0 | 1.00 | -115 | 2 | 0 | 2 | 3 | 48 | 0.00 | W | +2.5u |
| 2026-06-19 | MLB | ML | away | 4.5 | 2.50 | +141 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -2.5u |
| 2026-06-19 | MLB | ML | home | 2.5 | 0.25 | +158 | -1 | -1 | -2 | 0 | -7 | -1.10 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 4.5 | 2.50 | -101 | 0 | -1 | -1 | -1 | 23 | -0.70 | L | -2.5u |
| 2026-06-19 | MLB | ML | home | 4.5 | 3.00 | -163 | -1 | -1 | -2 | -2 | 24 | -0.40 | W | +2.4u |
| 2026-06-19 | MLB | SPREAD | home | 4.5 | 2.50 | +130 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -5.0u |
| 2026-06-19 | MLB | ML | home | 3.0 | 0.50 | -152 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | home | 2.5 | 0.25 | +147 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.3u |
| 2026-06-19 | MLB | ML | home | 5.0 | 1.00 | -109 | 1 | 0 | 1 | 1 | -9 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 31 | 0.00 | L | -3.0u |
| 2026-06-19 | MLB | SPREAD | home | 2.5 | 0.25 | +170 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.3u |
| 2026-06-19 | SOC | ML | away | 3.0 | 0.50 | +2500 | 0 | 0 | 0 | -4 | -30 | 0.00 | L | -0.5u |
| 2026-06-19 | SOC | ML | home | 4.5 | 2.50 | +108 | 1 | 0 | 1 | 5 | 31 | -2.40 | L | -2.5u |
| 2026-06-20 | MLB | SPREAD | away | 5.0 | 5.00 | -194 | 0 | 0 | 0 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | ML | home | 4.5 | 3.00 | -200 | -2 | 0 | -2 | -2 | -3 | -1.30 | L | -3.0u |
| 2026-06-20 | MLB | SPREAD | home | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 12 | 0.00 | L | -0.5u |
| 2026-06-20 | MLB | ML | away | 4.5 | 2.50 | +123 | 2 | 0 | 2 | 2 | -10 | -3.20 | L | -2.5u |
| 2026-06-20 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | 1 | 0 | 0 | 7 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | -7 | 0.00 | W | +1.8u |
| 2026-06-20 | MLB | ML | away | 3.0 | 0.50 | +116 | 0 | 0 | 0 | -1 | -2 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | -1 | 0 | -1 | -2 | -29 | 0.00 | L | -1.0u |
| 2026-06-20 | MLB | ML | home | 4.0 | 1.00 | -190 | 2 | 1 | 3 | 0 | -7 | -1.70 | W | +2.0u |
| 2026-06-20 | MLB | ML | home | 5.0 | 5.00 | -137 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +2.2u |
| 2026-06-20 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 12 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 12 | 0.00 | L | -0.5u |
| 2026-06-20 | SOC | ML | away | 2.5 | 0.25 | +474 | -3 | 0 | -3 | -20 | -62 | 0.00 | L | -0.3u |
| 2026-06-20 | SOC | ML | away | 2.5 | 0.25 | +2200 | 0 | 0 | 0 | -1 | -14 | -0.20 | L | -0.3u |
| 2026-06-21 | MLB | ML | home | 4.0 | 1.00 | -226 | 1 | 0 | 1 | 0 | 15 | 0.30 | L | -1.0u |
| 2026-06-21 | MLB | SPREAD | away | 5.0 | 5.00 | -190 | 0 | 0 | 0 | 1 | 13 | -0.50 | L | -5.0u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 2.50 | +100 | 1 | 1 | 2 | 0 | 24 | 0.00 | W | +2.5u |
| 2026-06-21 | MLB | ML | home | 4.0 | 1.00 | -104 | -1 | 0 | -1 | 0 | -25 | -0.50 | L | -1.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-21 | MLB | ML | away | 5.0 | 2.50 | +113 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -2.5u |
| 2026-06-21 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | 8 | 0.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 1 | 19 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-21 | MLB | ML | away | 2.5 | 0.25 | +110 | 0 | 0 | 0 | -1 | -12 | -1.00 | W | +0.0u |
| 2026-06-21 | MLB | SPREAD | home | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 1 | 12 | -1.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | ML | home | 4.5 | 3.00 | -178 | 3 | 0 | 3 | 3 | 77 | -1.30 | W | +1.6u |
| 2026-06-21 | MLB | ML | home | 3.0 | 0.50 | +130 | 0 | 0 | 0 | -1 | -16 | -0.80 | L | -0.5u |
| 2026-06-21 | MLB | ML | home | 3.0 | 0.50 | +123 | 1 | 0 | 1 | 0 | 0 | -0.20 | W | +0.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | -1 | -16 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | SPREAD | away | 5.0 | 2.50 | +130 | 0 | 0 | 0 | 1 | 13 | -1.30 | W | +0.0u |
| 2026-06-21 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 2 | 0 | 2 | 2 | 33 | 0.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 1.00 | -114 | 1 | 1 | 2 | 1 | -26 | 0.00 | W | +0.0u |
| 2026-06-21 | SOC | ML | away | 4.5 | 1.00 | +725 | 2 | 0 | 2 | -5 | -68 | 0.00 | L | -1.0u |
| 2026-06-21 | SOC | ML | home | 4.0 | 1.00 | +650 | 2 | 0 | 2 | 1 | -4 | -0.20 | L | -1.0u |
| 2026-06-21 | SOC | ML | draw | 3.0 | 0.50 | +950 | 0 | 0 | 0 | -9 | -44 | 0.00 | L | -0.5u |
| 2026-06-22 | MLB | ML | home | 4.5 | 3.00 | -138 | 0 | 0 | 0 | 0 | 3 | 0.30 | W | +0.0u |
| 2026-06-22 | MLB | SPREAD | away | 5.0 | 5.00 | -168 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 1.00 | +105 | 1 | 0 | 1 | 1 | 22 | 0.00 | L | -1.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 7 | 0.00 | L | -3.0u |
| 2026-06-22 | MLB | SPREAD | away | 5.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 22 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +2.7u |
| 2026-06-22 | MLB | ML | home | 5.0 | 5.00 | -124 | 1 | 0 | 1 | 1 | 9 | -1.20 | W | +2.3u |
| 2026-06-22 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 3 | 0 | 3 | 3 | 37 | 0.00 | W | +2.7u |
| 2026-06-22 | MLB | ML | home | 3.0 | 0.50 | -180 | 1 | 0 | 1 | 0 | 0 | -1.30 | L | -0.5u |
| 2026-06-22 | MLB | ML | home | 5.0 | 2.50 | +133 | 0 | 0 | 0 | 0 | -18 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | ML | home | 5.0 | 2.50 | +137 | 0 | 0 | 0 | 0 | -18 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | SPREAD | home | 4.5 | 1.00 | -109 | 0 | 0 | 0 | -1 | 9 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | SPREAD | away | 4.5 | 2.50 | +138 | 2 | 0 | 2 | 1 | 48 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | TOTAL | under | 4.0 | 1.00 | -104 | 2 | 1 | 3 | 2 | 21 | 0.00 | W | +3.9u |
| 2026-06-22 | MLB | ML | away | 5.0 | 5.00 | — | 1 | 0 | 1 | 1 | 23 | 0.00 | L | -5.0u |
| 2026-06-22 | SOC | ML | draw | 4.5 | 1.00 | +350 | -1 | 0 | -1 | -16 | -58 | -0.70 | L | -1.0u |
| 2026-06-22 | SOC | ML | home | 2.5 | 0.25 | -950 | 1 | 0 | 1 | 8 | 57 | 0.00 | W | +0.0u |
| 2026-06-22 | SOC | ML | home | 4.5 | 2.50 | +139 | 1 | 0 | 1 | 9 | 49 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | home | 3.0 | 0.50 | -109 | 0 | 0 | 0 | -1 | -13 | -1.80 | L | -0.5u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 5.00 | -168 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | -2 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -108 | 2 | 0 | 2 | 3 | 3 | -1.40 | L | -3.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -133 | 1 | 0 | 1 | 3 | 19 | -1.40 | L | -3.0u |
| 2026-06-23 | MLB | SPREAD | away | 3.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -0.5u |
| 2026-06-23 | MLB | ML | away | 3.0 | 0.50 | -162 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | SPREAD | home | 4.0 | 1.00 | -107 | 0 | 0 | 0 | 0 | -35 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 5.00 | -114 | 0 | 0 | 0 | -1 | -45 | 0.00 | L | -5.0u |
| 2026-06-23 | MLB | ML | home | 2.5 | 0.25 | -125 | 1 | 0 | 1 | 0 | -28 | -1.90 | L | -0.3u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 1.00 | -102 | 1 | 2 | 3 | 1 | 10 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -172 | 1 | 0 | 1 | 1 | -16 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 1.00 | -109 | 2 | 0 | 2 | 1 | -2 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 2.50 | +132 | 1 | 0 | 1 | 1 | -16 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | ML | home | 5.0 | 2.50 | +104 | 1 | 0 | 1 | 1 | -9 | 0.00 | L | -2.5u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | 13 | 0.00 | L | -5.0u |
| 2026-06-23 | MLB | ML | away | 4.0 | 1.00 | +117 | 1 | 0 | 1 | 1 | 16 | -0.20 | L | -1.0u |
| 2026-06-23 | MLB | SPREAD | away | 2.5 | 0.25 | +106 | 1 | 0 | 1 | 0 | 41 | -1.50 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | -1 | -22 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | home | 4.5 | 1.00 | -153 | 2 | 0 | 2 | 2 | 19 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | SPREAD | home | 3.0 | 0.50 | +139 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 4.5 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-23 | SOC | ML | home | 2.5 | 0.25 | -450 | 1 | 0 | 1 | 0 | 0 | 0.60 | L | -0.3u |
| 2026-06-23 | SOC | ML | away | 4.5 | 1.00 | +1800 | 1 | 0 | 1 | -4 | -22 | 0.00 | L | -1.0u |
| 2026-06-24 | MLB | SPREAD | away | 5.0 | 5.00 | -214 | 0 | 0 | 0 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 4.5 | 3.00 | -132 | 1 | 0 | 1 | 0 | 16 | -1.10 | L | -3.0u |
| 2026-06-24 | MLB | SPREAD | away | 4.0 | 1.00 | +155 | 1 | 0 | 1 | 1 | 19 | -0.30 | L | -1.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 3.0 | 0.50 | +110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-24 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -27 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 2.50 | +152 | 2 | 0 | 2 | 1 | 6 | -1.10 | W | +5.8u |
| 2026-06-24 | MLB | SPREAD | away | 5.0 | 5.00 | -105 | 0 | 0 | 0 | 1 | 13 | 0.00 | L | -5.0u |
| 2026-06-24 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | -1 | 0 | 3 | 3 | 0.00 | W | +3.6u |
| 2026-06-24 | MLB | ML | away | 4.5 | 2.50 | -134 | 1 | 0 | 1 | 2 | 7 | -0.20 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | -1 | -34 | 0.00 | L | -5.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 3.00 | -134 | 1 | 0 | 1 | 1 | -16 | -1.90 | L | -3.0u |
| 2026-06-24 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -8 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 3.0 | 0.50 | +132 | 0 | 0 | 0 | -1 | -16 | -2.20 | L | -0.5u |
| 2026-06-24 | MLB | SPREAD | home | 4.0 | 1.00 | -115 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -3.0u |
| 2026-06-24 | MLB | ML | away | 4.5 | 2.50 | +117 | 1 | 0 | 1 | 1 | 9 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 8 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 2.5 | 0.25 | -102 | -1 | 0 | -1 | -1 | 8 | -0.70 | W | +0.0u |
| 2026-06-24 | MLB | SPREAD | away | 4.0 | 1.00 | +136 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -1.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 2.50 | +108 | 0 | 0 | 0 | 0 | -32 | 0.00 | L | -2.5u |
| 2026-06-24 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -3.0u |
| 2026-06-24 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -0.5u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 1.00 | -115 | 2 | 0 | 2 | 2 | 29 | 0.00 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 4.0 | 1.00 | +153 | 3 | 0 | 3 | 2 | 37 | -1.10 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 4.5 | 3.00 | -525 | 4 | 1 | 5 | 2 | 72 | 0.50 | W | +1.1u |
| 2026-06-24 | SOC | ML | away | 4.5 | 3.00 | -104 | -1 | 0 | -1 | 2 | 35 | -1.00 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 2.5 | 0.25 | -257 | 2 | 0 | 2 | 2 | 26 | -1.10 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.0u |
| 2026-06-25 | MLB | SPREAD | away | 4.5 | 1.00 | +164 | 1 | 1 | 2 | 1 | 13 | 27.50 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 2 | 0 | 0.00 | W | +3.6u |
| 2026-06-25 | MLB | ML | away | 2.5 | 0.25 | -136 | 3 | 0 | 3 | 1 | -10 | -2.40 | L | -0.3u |
| 2026-06-25 | MLB | SPREAD | away | 5.0 | 2.50 | +114 | 2 | 0 | 2 | 1 | -3 | -1.90 | L | -2.5u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -116 | 0 | 0 | 0 | 0 | -10 | 0.00 | L | -3.0u |
| 2026-06-25 | MLB | ML | home | 4.5 | 1.00 | +443 | 1 | 0 | 1 | 1 | -19 | 0.00 | L | -1.0u |
| 2026-06-25 | MLB | SPREAD | away | 4.5 | 3.00 | -105 | 1 | 0 | 1 | 2 | 0 | 0.00 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 1 | 1 | -1 | -11 | 0.00 | L | -0.3u |
| 2026-06-25 | SOC | ML | home | 4.5 | 1.50 | +163 | -1 | 0 | -1 | -1 | 14 | 0.00 | L | -1.5u |
| 2026-06-25 | SOC | ML | away | 2.5 | 0.25 | -600 | 4 | 1 | 5 | 4 | 37 | -0.70 | W | +0.0u |
| 2026-06-25 | SOC | ML | away | 4.0 | 1.00 | -110 | 12 | 7 | 19 | 12 | 57 | -0.90 | L | -1.0u |
| 2026-06-25 | SOC | ML | away | 5.0 | 5.00 | -700 | 5 | 1 | 6 | 4 | 49 | 1.80 | W | +0.5u |
| 2026-06-25 | SOC | ML | away | 2.5 | 0.25 | -105 | 4 | 4 | 8 | 5 | 3 | -0.20 | L | -0.3u |
| 2026-06-26 | MLB | ML | away | 4.5 | 3.00 | -120 | 2 | 0 | 2 | 1 | -16 | -0.80 | W | +3.3u |
| 2026-06-26 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-26 | MLB | SPREAD | home | 2.5 | 0.25 | -117 | 0 | 1 | 1 | 0 | 16 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | 1 | 9 | 0.00 | L | -5.0u |
| 2026-06-26 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 5.0 | 2.50 | +100 | 0 | 0 | 0 | 0 | -10 | 0.00 | L | -2.5u |
| 2026-06-26 | MLB | SPREAD | home | 2.5 | 0.25 | -135 | 1 | 0 | 1 | 1 | 3 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | SPREAD | away | 4.5 | 3.00 | -204 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | home | 4.0 | 1.00 | -2261 | 0 | 0 | 0 | 0 | -18 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 2.5 | 0.25 | -154 | 0 | 0 | 0 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | SPREAD | away | 4.5 | 2.50 | +110 | 1 | 1 | 2 | 1 | 18 | 0.00 | L | -2.5u |
| 2026-06-26 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -16 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 1 | 11 | -1.00 | W | +0.0u |
| 2026-06-26 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -3.0u |
| 2026-06-26 | MLB | ML | away | 3.0 | 0.50 | +121 | 1 | 0 | 1 | 0 | 0 | -0.80 | L | -0.5u |
| 2026-06-26 | SOC | ML | away | 5.0 | 5.00 | -600 | 1 | 0 | 1 | 1 | 13 | -0.30 | W | +0.8u |
| 2026-06-26 | SOC | ML | away | 3.0 | 0.50 | -200 | 7 | 2 | 9 | 10 | 69 | -0.20 | W | +4.1u |
| 2026-06-26 | SOC | ML | away | 2.5 | 0.25 | -155 | 5 | 2 | 7 | 7 | 67 | 1.20 | W | +1.6u |
| 2026-06-26 | SOC | ML | home | 3.0 | 0.50 | +150 | 0 | 2 | 2 | -1 | 7 | -0.30 | L | -0.5u |
| 2026-06-26 | SOC | ML | home | 2.5 | 0.25 | -380 | -1 | 1 | 0 | 0 | 18 | 0.00 | W | +0.0u |
| 2026-06-26 | SOC | ML | home | 2.5 | 0.25 | +135 | -2 | 2 | 0 | -5 | -7 | -0.30 | L | -0.3u |
| 2026-06-27 | MLB | ML | away | 5.0 | 2.50 | +121 | 0 | 0 | 0 | 0 | -10 | 0.00 | L | -2.5u |
| 2026-06-27 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -1.0u |
| 2026-06-27 | MLB | ML | away | 4.0 | 1.00 | +116 | 0 | 0 | 0 | 1 | -55 | -0.70 | L | -1.0u |
| 2026-06-27 | MLB | ML | home | 2.5 | 0.25 | -155 | 0 | 2 | 2 | 0 | 20 | -0.80 | L | -0.3u |
| 2026-06-27 | MLB | ML | away | 2.5 | 0.25 | -112 | 3 | 1 | 4 | 4 | 43 | -0.90 | W | +3.6u |
| 2026-06-27 | MLB | ML | home | 4.5 | 3.00 | -134 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-06-27 | MLB | TOTAL | under | 2.5 | 0.25 | -104 | 4 | 1 | 5 | 4 | 6 | 0.00 | L | -0.3u |
| 2026-06-27 | MLB | ML | away | 5.0 | 2.50 | +114 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -2.5u |
| 2026-06-27 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -16 | 0.00 | W | +0.0u |
| 2026-06-27 | MLB | ML | home | 4.5 | 3.00 | -130 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-06-27 | MLB | SPREAD | away | 4.5 | 3.00 | -204 | 2 | 0 | 2 | 2 | 26 | -1.70 | W | +2.3u |
| 2026-06-27 | MLB | ML | away | 4.0 | 1.00 | -104 | 0 | 0 | 0 | 0 | 0 | -1.20 | L | -1.0u |
| 2026-06-27 | MLB | ML | home | 4.0 | 1.00 | -123 | 0 | 0 | 0 | -1 | -16 | 0.00 | W | +3.3u |
| 2026-06-27 | MLB | SPREAD | home | 4.5 | 1.50 | +154 | 1 | 0 | 1 | 1 | 9 | 0.00 | W | +0.0u |
| 2026-06-27 | MLB | TOTAL | over | 2.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 3 | 0.00 | L | -1.0u |
| 2026-06-27 | MLB | ML | away | 4.5 | 3.00 | -142 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-06-27 | MLB | ML | home | 4.5 | 3.00 | -178 | 3 | 0 | 3 | 2 | 22 | -0.10 | L | -3.0u |
| 2026-06-27 | MLB | SPREAD | home | 4.5 | 2.50 | +113 | 1 | 0 | 1 | 1 | -16 | 0.00 | L | -2.5u |
| 2026-06-27 | SOC | ML | away | 5.0 | 5.00 | -500 | 2 | 1 | 3 | 3 | 4 | 1.30 | W | +0.8u |
| 2026-06-27 | SOC | ML | draw | 2.5 | 0.25 | +109 | -1 | 0 | -1 | 0 | 24 | 1.40 | W | +0.0u |
| 2026-06-27 | SOC | ML | away | 5.0 | 5.00 | -575 | 4 | 1 | 5 | 5 | 36 | -0.10 | W | +0.8u |
| 2026-06-27 | SOC | ML | home | 2.5 | 0.25 | -122 | 1 | 3 | 4 | 4 | 17 | 1.00 | W | +2.5u |
| 2026-06-27 | SOC | ML | home | 3.0 | 0.50 | -125 | 2 | 1 | 3 | 3 | 18 | -1.00 | W | +3.3u |
| 2026-06-28 | MLB | ML | away | 4.5 | 1.00 | +337 | 0 | 0 | 0 | 0 | -7 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | SPREAD | home | 3.0 | 0.50 | -131 | 1 | 0 | 1 | 1 | 19 | -0.50 | W | +0.0u |
| 2026-06-28 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 2 | 0 | 2 | 2 | 20 | 0.00 | W | +1.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 2 | 1 | 3 | 2 | 0 | 0.00 | W | +3.6u |
| 2026-06-28 | MLB | SPREAD | away | 4.5 | 3.00 | -180 | 1 | 0 | 1 | 1 | 9 | -0.30 | L | -3.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 2 | 0 | 2 | 3 | 0 | 0.00 | L | -2.5u |
| 2026-06-28 | MLB | ML | home | 2.5 | 0.25 | -103 | 1 | 0 | 1 | 1 | 22 | 0.20 | L | -0.3u |
| 2026-06-28 | MLB | SPREAD | home | 4.5 | 1.00 | -155 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 1.00 | -110 | 1 | 0 | 1 | 2 | -16 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | ML | home | 4.5 | 2.50 | +122 | 0 | 0 | 0 | 0 | -7 | 0.00 | L | -2.5u |
| 2026-06-28 | MLB | SPREAD | home | 3.0 | 0.50 | -149 | 1 | 0 | 1 | 1 | 19 | -0.20 | L | -0.5u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | -5 | 0.00 | W | +0.0u |
| 2026-06-28 | MLB | ML | away | 3.0 | 0.50 | +108 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -0.5u |
| 2026-06-28 | MLB | SPREAD | away | 4.0 | 1.00 | -168 | 0 | 0 | 0 | 2 | 26 | 0.00 | W | +2.1u |
| 2026-06-28 | MLB | ML | away | 4.5 | 1.00 | -101 | 4 | 0 | 4 | 4 | 18 | -0.70 | L | -1.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 3.00 | -104 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -3.0u |
| 2026-06-28 | MLB | ML | away | 4.5 | 3.00 | +1210 | 3 | 1 | 4 | 3 | 6 | -1.20 | L | -3.0u |
| 2026-06-28 | MLB | ML | away | 4.5 | 3.00 | -158 | 0 | 0 | 0 | 0 | -7 | 0.00 | W | +0.0u |
| 2026-06-28 | MLB | SPREAD | away | 4.5 | 1.00 | +119 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-28 | MLB | ML | away | 3.0 | 0.50 | -103 | 1 | 0 | 1 | 1 | 19 | -1.20 | L | -0.5u |
| 2026-06-28 | MLB | ML | away | 4.0 | 1.00 | +115 | 1 | 0 | 1 | 1 | 12 | -1.10 | W | +4.4u |
| 2026-06-28 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | -1 | -1 | -1 | 0 | 0.00 | L | -0.5u |
| 2026-06-28 | MLB | SPREAD | away | 3.0 | 0.50 | -124 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-28 | SOC | ML | away | 5.0 | 5.00 | -142 | 12 | 3 | 15 | 16 | 92 | -0.50 | W | +0.7u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | -128 | 0 | 1 | 1 | 1 | -9 | -1.50 | W | +0.0u |
| 2026-06-29 | MLB | SPREAD | home | 2.5 | 0.25 | +139 | 0 | 0 | 0 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-29 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 0 | -5 | 0.00 | L | -0.5u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | 7 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | SPREAD | away | 2.5 | 0.25 | -176 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -105 | 1 | 0 | 1 | 0 | 4 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | ML | away | 3.0 | 0.50 | +193 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-29 | MLB | SPREAD | away | 3.0 | 0.50 | -119 | 1 | 0 | 1 | -1 | -12 | 0.00 | L | -0.5u |
| 2026-06-29 | MLB | ML | away | 2.5 | 0.25 | -112 | 0 | 0 | 0 | 0 | -22 | -0.60 | W | +0.0u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | +129 | 1 | 0 | 1 | 1 | -19 | -0.50 | L | -0.3u |
| 2026-06-29 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 17 | 0.00 | W | +2.6u |
| 2026-06-29 | MLB | SPREAD | home | 2.5 | 0.25 | +171 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | ML | away | 4.0 | 1.00 | +100 | 2 | 0 | 2 | 4 | 0 | 0.00 | W | +0.0u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | -158 | 2 | 1 | 3 | 2 | 29 | -0.60 | W | +0.0u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 1 | 0 | 1 | 1 | -2 | 0.00 | W | +3.6u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | -131 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +3.0u |
| 2026-06-29 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | -1 | 0 | -1 | -1 | -2 | 0.00 | P | +0.0u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | 0 | -1 | -1 | -43 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | ML | away | 4.5 | 2.50 | +150 | 1 | 0 | 1 | 1 | -16 | -0.60 | L | -2.5u |
| 2026-06-29 | SOC | ML | home | 2.5 | 0.25 | -145 | 10 | 2 | 12 | 14 | 79 | -1.00 | W | +3.1u |
| 2026-06-29 | SOC | ML | home | 3.0 | 0.50 | -265 | 5 | 3 | 8 | 6 | 41 | 0.00 | L | -0.5u |
| 2026-06-30 | MLB | SPREAD | home | 3.0 | 1.00 | +123 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-30 | MLB | ML | away | 4.5 | 2.50 | +120 | 1 | 0 | 1 | 1 | -3 | -1.70 | W | +5.0u |
| 2026-06-30 | MLB | SPREAD | home | 2.5 | 0.25 | +135 | 0 | 0 | 0 | 0 | -3 | 0.00 | L | -0.3u |
| 2026-06-30 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 1 | 2 | 2 | 22 | 0.00 | W | +3.6u |
| 2026-06-30 | MLB | ML | home | 2.5 | 0.25 | -111 | 0 | 0 | 0 | 0 | -18 | -1.80 | L | -0.3u |
| 2026-06-30 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 5 | 2 | 7 | 5 | 31 | 0.00 | L | -3.0u |
| 2026-06-30 | MLB | ML | away | 4.5 | 1.50 | +163 | 3 | 0 | 3 | 3 | 17 | -1.20 | L | -1.5u |
| 2026-06-30 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | -1 | -1 | -2 | -1 | -5 | 0.00 | L | -0.5u |
| 2026-06-30 | MLB | ML | away | 3.0 | 0.50 | -172 | 3 | 0 | 3 | 3 | 35 | -0.10 | W | +0.0u |
| 2026-06-30 | MLB | SPREAD | away | 3.0 | 0.50 | -101 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-06-30 | MLB | ML | away | 3.0 | 0.50 | -128 | 1 | 1 | 2 | 2 | 22 | -1.30 | W | +3.0u |
| 2026-06-30 | MLB | ML | away | 4.0 | 1.00 | -109 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -1.0u |
| 2026-06-30 | MLB | ML | home | 3.0 | 0.50 | -201 | 1 | 1 | 2 | 2 | -29 | -1.80 | W | +0.0u |
| 2026-06-30 | MLB | SPREAD | away | 2.5 | 0.25 | -113 | 2 | -1 | 1 | 2 | -3 | -0.50 | L | -0.3u |
| 2026-06-30 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 2 | 0 | 0.00 | W | +0.9u |
| 2026-06-30 | MLB | ML | away | 5.0 | 2.50 | +133 | 0 | 0 | 0 | 1 | -9 | 0.00 | L | -2.5u |
| 2026-06-30 | MLB | SPREAD | home | 4.0 | 1.00 | +131 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-30 | MLB | TOTAL | over | 4.0 | 1.00 | +103 | 0 | 1 | 1 | 1 | 16 | 0.00 | W | +4.5u |
| 2026-06-30 | MLB | ML | away | 4.5 | 3.00 | +100 | 1 | 0 | 1 | 1 | -16 | -0.20 | L | -3.0u |
| 2026-06-30 | MLB | ML | home | 4.5 | 3.00 | -141 | 2 | 0 | 2 | 2 | -3 | 0.00 | L | -3.0u |
| 2026-06-30 | MLB | SPREAD | away | 4.5 | 3.00 | -160 | 2 | 0 | 2 | 2 | 29 | -1.50 | W | +2.5u |
| 2026-06-30 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | -1 | 1 | 0 | 0 | -11 | 0.00 | L | -0.5u |
| 2026-06-30 | MLB | ML | away | 2.5 | 0.25 | -114 | 3 | 2 | 5 | 4 | 45 | -1.40 | W | +2.7u |
| 2026-06-30 | MLB | SPREAD | home | 2.5 | 0.25 | -145 | 0 | 0 | 0 | -1 | -13 | 1.10 | L | -0.3u |
| 2026-06-30 | MLB | ML | home | 4.5 | 2.50 | +110 | 1 | 0 | 1 | 1 | -9 | 0.00 | L | -2.5u |
| 2026-06-30 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 3 | 0 | 3 | 3 | 40 | 0.00 | W | +2.6u |
| 2026-06-30 | MLB | ML | away | 4.5 | 2.50 | +117 | 4 | 1 | 5 | 4 | 19 | -0.40 | W | +2.9u |
| 2026-06-30 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 2 | 0 | 2 | 1 | 9 | 0.00 | P | +0.0u |
| 2026-06-30 | SOC | ML | home | 3.0 | 0.50 | +129 | 3 | 2 | 5 | 5 | 38 | -1.00 | W | +3.1u |
| 2026-06-30 | SOC | ML | away | 2.5 | 0.25 | +105 | 7 | 4 | 11 | 7 | 41 | -0.80 | W | +4.6u |
| 2026-06-30 | SOC | ML | home | 5.0 | 5.00 | -350 | 6 | 3 | 9 | 7 | 35 | -0.50 | W | +0.3u |
| 2026-07-01 | MLB | ML | home | 4.5 | 3.00 | -160 | 7 | 4 | 11 | 6 | 30 | -1.70 | W | +3.7u |
| 2026-07-01 | MLB | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 2 | 5 | 2 | 16 | 0.00 | W | +2.6u |
| 2026-07-01 | MLB | ML | away | 4.0 | 1.00 | +123 | 1 | 0 | 1 | 1 | -12 | -0.90 | L | -1.0u |
| 2026-07-01 | MLB | ML | home | 5.0 | 5.00 | -134 | 3 | 1 | 4 | 3 | 0 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | SPREAD | away | 2.5 | 0.25 | -107 | 1 | 2 | 3 | 2 | 23 | -1.20 | L | -0.3u |
| 2026-07-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 1 | 16 | 0.00 | W | +0.9u |
| 2026-07-01 | MLB | SPREAD | home | 3.0 | 0.50 | -105 | -1 | -1 | -2 | 0 | 30 | 0.70 | W | +0.0u |
| 2026-07-01 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 19 | 0.00 | W | +0.0u |
| 2026-07-01 | MLB | ML | away | 4.0 | 1.00 | +119 | 4 | 0 | 4 | 3 | 28 | -1.00 | W | +4.9u |
| 2026-07-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | ML | away | 2.5 | 0.25 | +124 | 2 | 1 | 3 | 2 | -26 | 0.00 | L | -0.3u |
| 2026-07-01 | MLB | SPREAD | away | 5.0 | 5.00 | -180 | 2 | 1 | 3 | 1 | 16 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | 1 | 16 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | ML | home | 5.0 | 5.00 | -130 | 0 | 0 | 0 | 0 | -10 | 0.00 | W | +0.0u |
| 2026-07-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -16 | 0.00 | W | +0.0u |
| 2026-07-01 | MLB | SPREAD | home | 3.0 | 0.50 | -127 | 0 | 0 | 0 | 0 | -22 | 0.00 | L | -0.5u |
| 2026-07-01 | MLB | ML | away | 2.5 | 0.25 | -102 | 5 | 3 | 8 | 4 | 17 | -0.70 | L | -0.3u |
| 2026-07-01 | MLB | ML | away | 4.5 | 2.50 | +128 | 1 | 0 | 1 | 1 | 6 | -0.90 | W | +0.0u |
| 2026-07-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 3 | 9 | 0.00 | L | -3.0u |
| 2026-07-01 | SOC | ML | draw | 3.0 | 0.50 | +230 | -3 | -1 | -4 | -5 | 13 | 0.00 | W | +2.3u |
| 2026-07-02 | MLB | ML | home | 2.5 | 0.25 | -185 | -2 | 0 | -2 | -2 | 9 | -0.70 | L | -0.3u |
| 2026-07-02 | MLB | SPREAD | away | 4.0 | 1.00 | -139 | 1 | 1 | 2 | 1 | 16 | -0.50 | W | +2.9u |
| 2026-07-02 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 2 | 15 | 0.00 | L | -3.0u |
| 2026-07-02 | MLB | SPREAD | away | 4.5 | 1.50 | +140 | 0 | 0 | 0 | 0 | 0 | -0.60 | L | -1.5u |
| 2026-07-02 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | -16 | 0.00 | L | -5.0u |
| 2026-07-02 | MLB | ML | away | 3.0 | 0.50 | -104 | -1 | 0 | -1 | 0 | -7 | -0.70 | L | -0.5u |
| 2026-07-02 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 6 | 2 | 8 | 5 | -7 | 0.00 | L | -5.0u |
| 2026-07-02 | MLB | SPREAD | home | 4.0 | 1.00 | +113 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-07-02 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 2 | 0 | 2 | 3 | 7 | 0.00 | W | +2.7u |
| 2026-07-02 | MLB | ML | away | 5.0 | 5.00 | -138 | 2 | 0 | 2 | 1 | 1 | -1.10 | L | -5.0u |
| 2026-07-02 | MLB | SPREAD | away | 4.0 | 1.00 | +118 | 1 | 0 | 1 | 1 | 19 | 0.00 | L | -1.0u |
| 2026-07-02 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -16 | 0.00 | W | +0.0u |
| 2026-07-02 | MLB | ML | away | 5.0 | 2.50 | +115 | 1 | 1 | 2 | 0 | 0 | 0.00 | W | +2.9u |
| 2026-07-02 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 4 | 0 | 4 | 3 | 0 | 0.00 | L | -5.0u |
| 2026-07-02 | MLB | SPREAD | away | 4.0 | 1.00 | -126 | 1 | 0 | 1 | 1 | 0 | 0.00 | L | -1.0u |
| 2026-07-02 | MLB | TOTAL | over | 5.0 | 1.00 | +106 | 3 | 0 | 3 | 2 | 23 | 0.00 | W | +0.0u |
| 2026-07-02 | MLB | ML | home | 4.0 | 1.00 | -113 | -2 | 0 | -2 | -2 | -29 | 0.00 | L | -1.0u |
| 2026-07-02 | MLB | SPREAD | home | 2.5 | 0.25 | +184 | 0 | 0 | 0 | 0 | -32 | 0.00 | L | -0.3u |
| 2026-07-02 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-07-02 | MLB | ML | away | 4.0 | 1.00 | -122 | 2 | 1 | 3 | 2 | 53 | -0.80 | W | +4.2u |
| 2026-07-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | -1 | 0 | -1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-07-02 | SOC | ML | home | 2.5 | 0.25 | +100 | 2 | 0 | 2 | 2 | 61 | -0.50 | W | +2.5u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._