# Sharp Intel v6 — Full Analysis

_Auto-generated **7/2/2026, 11:02:42 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 994 shipped+graded picks · 2026-04-18 → 2026-07-01  (HC analyses scoped to post-cutover 2026-04-30, 882 picks)
**Headline:** 496-488-10 · WR 50.4% [47.3%–53.5%] vs 52.4% break-even · -43.5u flat (-4.4%) · -189.6u peak.
**Overall t-test:** t = -1.42 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.034 ✗**  (full sample, N=988)
- **ρ(HC, flat ROI) = -0.008 ✗**  (post-cutover, N=882)
- **ρ(Δw+HC, flat ROI) = -0.003 ✗**  (post-cutover, N=882)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0 (full sample)** — N=269, 122-142, WR 46.2% [40%–52%], flat ROI -12.7% (t=-2.18 ✓ p<.05)

### Action map

- **Tier-1a (HC ≥ +2)** — N=66, WR 48.5%, flat ROI -12.2%. Bayesian posterior WR ≈ 48.7%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=198, WR 58.6%, flat ROI +9.9%. Bayesian posterior WR ≈ 58.2%, half-Kelly = **6.1%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=132, WR 47.7%, flat ROI -10.6%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=148, WR 52.0%, flat ROI -0.3%. Bayesian posterior WR ≈ 51.9%, half-Kelly = **0.0%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -12.7% flat ROI on 269 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (0.98u/pick), we need **~1462 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 994. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-07-01 |
| Sides scanned | 1827 |
| Shipped + graded | **994** |
| W-L-P | 496-488-10 |
| Win rate | **50.4%** [47.3%–53.5%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +2.0 pp |
| Peak-units PnL | **-189.6u** |
| Flat-1u PnL | **-43.5u** (-4.4% flat ROI) |
| Flat t-statistic vs zero | -1.42 → ✗ noise |
| Flat 95% CI per-pick | [-0.104, 0.017]u |

### Power note

At our observed flat-PnL standard deviation (0.98u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4059 |
| +5% | 1462 |
| +10% | 366 |

We have **994** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 11 | 4-7-0 | 36.4% [15–65] | -17.8% | -4.5u | -0.49 ✗ noise |
| Δw = −1 | 45 | 17-26-2 | 39.5% [26–54] | -23.7% | -15.5u | -1.69 ~ p<.10 |
| Δw = 0 | 213 | 101-109-3 | 48.1% [41–55] | -10.1% | -55.0u | -1.56 ✗ noise |
| Δw = +1 | 399 | 206-190-3 | 52.0% [47–57] | -1.4% | -98.1u | -0.28 ✗ noise |
| Δw = +2 | 172 | 87-83-2 | 51.2% [44–59] | -2.6% | -25.5u | -0.35 ✗ noise |
| Δw ≥ +3 | 148 | 77-71-0 | 52.0% [44–60] | -0.3% | +5.1u | -0.03 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.049** ✗  ·  **ρ(Δw, flat ROI) = 0.034** ✗  (N=988)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 1 | 1-0-0 | 100.0% [21–100] | +86.2% | +2.5u | 0.00 ✗ n<2 |
| HC = −1 | 35 | 19-16-0 | 54.3% [38–70] | +13.4% | +9.7u | 0.72 ✗ noise |
| HC = 0 | 582 | 277-296-9 | 48.3% [44–52] | -8.9% | -229.6u | -2.26 ✓ p<.05 |
| HC = +1 | 198 | 116-82-0 | 58.6% [52–65] | +9.9% | +23.6u | 1.45 ✗ noise |
| HC = +2 | 44 | 23-21-0 | 52.3% [38–66] | -1.1% | +11.9u | -0.07 ✗ noise |
| HC ≥ +3 | 22 | 9-13-0 | 40.9% [23–61] | -34.4% | +2.8u | -1.97 ✓ p<.05 |

**Pearson ρ(HC, WIN) = 0.016** ✗  ·  **ρ(HC, flat ROI) = -0.008** ✗  (N=882)

Spearman rank ρ(HC, flat ROI) = 0.022.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 214 | 98-112-4 | 46.7% [40–53] | -11.4% | -70.3u | -1.74 ~ p<.10 |
| Σ = +1 | 315 | 162-150-3 | 51.9% [46–57] | -1.4% | -97.1u | -0.25 ✗ noise |
| Σ = +2 | 162 | 90-70-2 | 56.3% [49–64] | +5.4% | -0.2u | 0.73 ✗ noise |
| Σ = +3 | 80 | 37-43-0 | 46.3% [36–57] | -13.0% | -11.5u | -1.20 ✗ noise |
| Σ = +4 | 47 | 25-22-0 | 53.2% [39–67] | +4.3% | -3.7u | 0.29 ✗ noise |
| Σ = +5 | 27 | 16-11-0 | 59.3% [41–75] | +6.4% | +5.0u | 0.35 ✗ noise |
| Σ ≥ +6 | 37 | 17-20-0 | 45.9% [31–62] | -21.6% | -1.1u | -1.48 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = 0.024** ✗  ·  **ρ(Σ, flat ROI) = -0.003** ✗  (N=882)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 882.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.024 ✗ | 0.000 ✗ | 0.010 | weak |
| HC margin | 0.016 ✗ | -0.008 ✗ | 0.022 | weak |
| Δw + HC | 0.024 ✗ | -0.003 ✗ | 0.020 | weak |
| peak.stars | -0.032 ✗ | -0.045 ✗ | -0.049 | weak |
| vault.star | 0.004 ✗ | -0.013 ✗ | -0.030 | weak |
| lock.stars | -0.026 ✗ | -0.039 ✗ | -0.038 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 882 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | N=1 · 1-0 · 100% [21–100] · —  | — | — | — | — | — |
| -1 | N=1 · 1-0 · 100% [21–100] · —  | N=1 · 0-1 · 0% [0–79] · —  | N=9 · 5-4 · 56% [27–81] · +15%  | N=8 · 5-3 · 63% [31–86] · +31%  | N=9 · 4-5 · 44% [19–73] · -21%  | N=3 · 2-1 · 67% [21–94] · +48%  | N=4 · 2-2 · 50% [15–85] · -1%  |
| +0 | N=2 · 1-1 · 50% [9–91] · —  | N=4 · 1-3 · 25% [5–70] · -44%  | N=21 · 6-13 · 32% [15–54] · -36%  | N=148 · 69-77 · 47% [39–55] · -12%  | N=282 · 142-137 · 51% [45–57] · -3%  | N=86 · 44-40 · 52% [42–63] · -3%  | N=39 · 14-25 · 36% [23–52] · -33% ✗ |
| +1 | — | — | N=9 · 5-4 · 56% [27–81] · -6%  | N=30 · 18-12 · 60% [42–75] · +12%  | N=69 · 43-26 · 62% [51–73] · +19%  | N=44 · 24-20 · 55% [40–68] · +4%  | N=46 · 26-20 · 57% [42–70] · +4%  |
| +2 | — | N=1 · 0-1 · 0% [0–79] · —  | — | N=3 · 1-2 · 33% [6–79] · -47%  | N=5 · 1-4 · 20% [4–62] · -64%  | N=11 · 5-6 · 45% [21–72] · -7%  | N=24 · 16-8 · 67% [47–82] · +25%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | N=1 · 1-0 · 100% [21–100] · —  | N=3 · 1-2 · 33% [6–79] · -50%  | N=17 · 6-11 · 35% [17–59] · -43% ✗ |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 1 | 1-0-0 | 100.0% [21–100] | +86.2% | +2.5u | 0.00 ✗ n<2 |
| HC = −1 | 35 | 19-16-0 | 54.3% [38–70] | +13.4% | +9.7u | 0.72 ✗ noise |
| HC = 0 | 582 | 277-296-9 | 48.3% [44–52] | -8.9% | -229.6u | -2.26 ✓ p<.05 |
| HC = +1 | 198 | 116-82-0 | 58.6% [52–65] | +9.9% | +23.6u | 1.45 ✗ noise |
| HC = +2 | 44 | 23-21-0 | 52.3% [38–66] | -1.1% | +11.9u | -0.07 ✗ noise |
| HC ≥ +3 | 22 | 9-13-0 | 40.9% [23–61] | -34.4% | +2.8u | -1.97 ✓ p<.05 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 10 | 4-6-0 | 40.0% [17–69] | -9.5% | -4.0u | -0.24 ✗ noise |
| Δw = −1 | 39 | 16-21-2 | 43.2% [29–59] | -17.2% | -11.0u | -1.14 ✗ noise |
| Δw = 0 | 190 | 94-94-2 | 50.0% [43–57] | -6.5% | -41.7u | -0.95 ✗ noise |
| Δw = +1 | 366 | 191-172-3 | 52.6% [47–58] | -0.2% | -93.5u | -0.04 ✗ noise |
| Δw = +2 | 147 | 76-69-2 | 52.4% [44–60] | -1.1% | -21.7u | -0.14 ✗ noise |
| Δw ≥ +3 | 130 | 64-66-0 | 49.2% [41–58] | -9.5% | -7.1u | -1.14 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 264 | 148-116-0 | 56.1% [50–62] | +4.4% | +38.3u | 0.74 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 132 | 62-68-2 | 47.7% [39–56] | -10.6% | -36.4u | -1.29 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 486 | 235-244-7 | 49.1% [45–54] | -6.6% | -180.9u | -1.52 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 926 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 41 | 17-24-0 | 41.5% [28–57] | -14.9% | -14.8u | -0.90 ✗ noise |
| Δcount = −1 | 83 | 39-44-0 | 47.0% [37–58] | -9.3% | -4.2u | -0.86 ✗ noise |
| Δcount = 0 (balanced) | 140 | 58-78-4 | 42.6% [35–51] | -19.5% | -59.5u | -2.47 ✓ p<.05 |
| Δcount = +1 | 339 | 175-163-1 | 51.8% [46–57] | -1.9% | -130.9u | -0.37 ✗ noise |
| Δcount = +2 | 174 | 89-83-2 | 51.7% [44–59] | -3.6% | -28.3u | -0.50 ✗ noise |
| Δcount ≥ +3 (heavy support) | 149 | 95-52-2 | 64.6% [57–72] | +24.2% | +73.0u | 2.90 ✓ p<.01 |

**ρ(Δcount, WIN) = 0.124** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.110** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -12 · ≤ 1 · ≤ 10 · ≤ 21 · > 21

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 188 | 71-117-0 | 37.8% [31–45] | -27.8% | -74.9u | -4.04 ✓ p<.01 |
| Q2 | 197 | 89-104-4 | 46.1% [39–53] | -11.5% | -77.8u | -1.68 ~ p<.10 |
| Q3 (balanced) | 177 | 89-86-2 | 50.9% [44–58] | -3.1% | -35.0u | -0.43 ✗ noise |
| Q4 | 223 | 130-92-1 | 58.6% [52–65] | +12.0% | -31.2u | 1.82 ~ p<.10 |
| Q5 (best — heavy support) | 141 | 94-45-2 | 67.6% [59–75] | +25.6% | +54.2u | 3.14 ✓ p<.01 |

**ρ(ΔWlNet, WIN) = 0.201** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.184** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -Infinity · ≤ -17.97 · ≤ 2.31 · ≤ 12.07 · > 12.07

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 40 | 19-20-1 | 48.7% [34–64] | -6.8% | -10.7u | -0.44 ✗ noise |
| Q2 | 118 | 51-67-0 | 43.2% [35–52] | -19.5% | -33.4u | -2.26 ✓ p<.05 |
| Q3 | 224 | 102-121-1 | 45.7% [39–52] | -13.1% | -29.5u | -2.03 ✓ p<.05 |
| Q4 | 238 | 135-101-2 | 57.2% [51–63] | +8.8% | -57.1u | 1.41 ✗ noise |
| Q5 | 306 | 166-135-5 | 55.1% [50–61] | +5.4% | -34.0u | 0.94 ✗ noise |

**ρ(ΔFlatPnl, WIN) = NaN** —  ·  **ρ(ΔFlatPnl, flat ROI) = NaN** —

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -Infinity · ≤ -12.7 · ≤ 3.4 · ≤ 17.1 · > 17.1

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 40 | 19-20-1 | 48.7% [34–64] | -6.8% | -10.7u | -0.44 ✗ noise |
| Q2 | 86 | 19-67-0 | 22.1% [15–32] | -57.5% | -60.0u | -6.53 ✓ p<.01 |
| Q3 | 265 | 132-132-1 | 50.0% [44–56] | -5.0% | -17.2u | -0.85 ✗ noise |
| Q4 | 247 | 136-108-3 | 55.7% [49–62] | +7.3% | -22.4u | 1.17 ✗ noise |
| Q5 | 288 | 167-117-4 | 58.8% [53–64] | +10.3% | -54.4u | 1.78 ~ p<.10 |

**ρ(ΔAvgRoi, WIN) = NaN** —  ·  **ρ(ΔAvgRoi, flat ROI) = NaN** —

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 105 | 32-71-2 | 31.1% [23–41] | -38.7% | -53.9u | -4.30 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 26 | 8-18-0 | 30.8% [17–50] | -38.0% | -22.1u | -1.99 ✓ p<.05 |
| ΔBestRank = 0 (tied) | 5 | 4-1-0 | 80.0% [38–96] | +64.4% | +5.4u | 1.55 ✗ noise |
| ΔBestRank ∈ [+1,+4] | 31 | 14-17-0 | 45.2% [29–62] | -12.7% | -8.6u | -0.71 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 237 | 126-107-4 | 54.1% [48–60] | +2.7% | -22.1u | 0.41 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.257** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.233** ✓ p<.01  (N=404)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 70 | 21-48-1 | 30.4% [21–42] | -40.3% | -44.5u | -3.68 ✓ p<.01 |
| Δshare ∈ [−30,−10] pp | 11 | 4-7-0 | 36.4% [15–65] | -15.0% | -0.3u | -0.40 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 575 | 290-281-4 | 50.8% [47–55] | -3.0% | -101.4u | -0.73 ✗ noise |
| Δshare ∈ [+10,+30] pp | 38 | 21-16-1 | 56.8% [41–71] | +4.3% | +11.8u | 0.28 ✗ noise |
| Δshare ≥ +30 pp | 232 | 137-92-3 | 59.8% [53–66] | +11.9% | -30.3u | 1.82 ~ p<.10 |

**ρ(ΔTopQShare, WIN) = 0.119** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.102** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔWlNet** | 0.201 ✓ p<.01 | 0.184 ✓ p<.01 | 0.155 |
| 2 | **ΔTopQCount** | 0.170 ✓ p<.01 | 0.151 ✓ p<.01 | 0.109 |
| 3 | **Δcount** | 0.124 ✓ p<.01 | 0.110 ✓ p<.01 | 0.096 |
| 4 | **ΔTopQShare** | 0.119 ✓ p<.01 | 0.102 ✓ p<.01 | 0.093 |
| 5 | **ΔFlatPnl** | NaN — | NaN — | 0.072 |
| 6 | **ΔAvgRoi** | NaN — | NaN — | 0.091 |

_(ΔBestRank uses N=404 subset where both sides had a proven wallet — ρ(flat ROI) = 0.233 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 1650, dateRange = 2026-04-18 → 2026-07-01, computedAt = 2026-07-02T14:58:35.458Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **926** rows · PIT aggregate computable on **955** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **955** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 0 · — · — | 1 · 0% · -100.0% | — |
| NEUTRAL (0..+3) | 705 · 53% · +0.5% | 554 · 53% · -1.0% | -1.5pp |
| WEAK (−3..0) | 194 · 47% · -8.7% | 342 · 50% · -1.4% | +7.3pp |
| FADE (<−3) | 0 · — · — | 2 · 0% · -100.0% | — |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=492, WR=56%, ROI=+4.9% | N=431, WR=53%, ROI=-1.2% | -6.1pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=705, WR=53%, ROI=+0.5% | N=555, WR=53%, ROI=-1.2% | -1.7pp |
| AGS < −1 (mute veto) | N=56, WR=50%, ROI=-3.0% | N=202, WR=47%, ROI=-7.9% | -4.8pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-06-18 → 2026-07-01, N=275)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 1 · 0% · -100.0% |
| NEUTRAL (0..+3) | 167 · 57% · +4.8% |
| WEAK (−3..0) | 105 · 44% · -15.2% |
| FADE (<−3) | 2 · 0% · -100.0% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=140, WR=58%, ROI=+5.4% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=168, WR=57%, ROI=+4.2% |
| AGS < −1 (mute veto) | N=56, WR=39%, ROI=-22.7% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 0.70 | 2.32 |
| `dHcSizeRatio` | INTENSITY_HC | + | 0.53 | 5.63 |
| `dSumRankNorm` | QUALITY_RANK | − | 37.92 | 91.51 |
| `dWinnerCtPreA` | QUALITY_TRACK | − | 0.39 | 1.73 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **955/994** shipped+graded rows (96%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -4.22 |
| 20th pct | -0.21 |
| 40th pct | 0.01 |
| Median | 0.10 |
| 60th pct | 0.16 |
| 80th pct | 0.41 |
| 90th pct | 0.60 |
| Max | 3.04 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 172 | 18.0% |
| **LOCK** | +5..+7 | 180 | 18.8% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 127 | 13.3% |
| **FADE** | < −3 | 232 | 24.3% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 172 | 96-73-3 | 56.8% [49–64] | +2.4% | +7.9u | 0.35 ✗ noise |
| LOCK | 180 | 81-99-0 | 45.0% [38–52] | -13.8% | -94.4u | -1.90 ~ p<.10 |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 127 | 64-61-2 | 51.2% [43–60] | -2.2% | -23.0u | -0.26 ✗ noise |
| FADE | 232 | 105-123-4 | 46.1% [40–53] | -7.9% | -71.1u | -1.16 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.061** ~ p<.10 · r(ROI) = **0.027** ✗ · Spearman ρ(ROI) = **0.001**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 192 | 93-97-2 | 48.9% [42–56] | -3.3% | -44.7u | -0.46 ✗ noise |
| z ∈ [−1, 0) | 388 | 196-188-4 | 51.0% [46–56] | -2.6% | -103.5u | -0.53 ✗ noise |
| z ∈ [0, +1) | 243 | 122-119-2 | 50.6% [44–57] | -5.8% | -32.0u | -0.94 ✗ noise |
| z ≥ +1 (very positive) | 132 | 68-62-2 | 52.3% [44–61] | -5.5% | +2.9u | -0.69 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 921 | 464-447-10 | 50.9% [48–54] | -4.0% | -174.2u | -1.27 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dSumRankNorm` (QUALITY_RANK)

r(WIN) = **-0.030** ✗ · r(ROI) = **-0.039** ✗ · Spearman ρ(ROI) = **-0.039**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 168 | 91-76-1 | 54.5% [47–62] | +1.9% | +8.9u | 0.26 ✗ noise |
| z ∈ [−1, 0) | 416 | 211-201-4 | 51.2% [46–56] | -2.0% | -115.9u | -0.41 ✗ noise |
| z ∈ [0, +1) | 277 | 131-142-4 | 48.0% [42–54] | -8.3% | -78.4u | -1.42 ✗ noise |
| z ≥ +1 (very positive) | 94 | 46-47-1 | 49.5% [40–59] | -10.8% | +8.1u | -1.14 ✗ noise |

#### `dWinnerCtPreA` (QUALITY_TRACK)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 921 | 464-447-10 | 50.9% [48–54] | -4.0% | -174.2u | -1.27 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.030 ✗ | -0.039 ✗ | -0.039 |
| 2 | `dCount` | COUNT | 0.061 ~ p<.10 | 0.027 ✗ | 0.001 |
| 3 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |
| 4 | `dWinnerCtPreA` | QUALITY_TRACK | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | -0.082 | 0.825 | 50.9% | dominant |
| 2 | `dSumRankNorm` | -0.229 | 0.786 | 48.4% | meaningful |
| 3 | `dWinnerCtPreA` | -0.008 | 0.008 | 0.5% | silent (<0.2) |
| 4 | `dHcSizeRatio` | -0.003 | 0.003 | 0.2% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcSizeRatio` | `dSumRankNorm` | `dWinnerCtPreA` |
|---|---|---|---|---|
| `dCount` | 1.000 | -0.016 | +0.646 | -0.016 |
| `dHcSizeRatio` | -0.016 | 1.000 | -0.050 | +1.000 ⚠ |
| `dSumRankNorm` | +0.646 | -0.050 | 1.000 | -0.050 |
| `dWinnerCtPreA` | -0.016 | +1.000 ⚠ | -0.050 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.019**. At AGS ≥ +0.12 fires N=450, WR=52.3%, ROI=-2.9%. At AGS ≥ +null fires N=580, WR=52.3%, ROI=-3.1%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-450 ROI (matched cohort) | Top-450 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.053 | +0.034 | WR=55%, ROI=+4.0% | -6.9pp | N=546, WR=53%, ROI=-0.0% |
| `dHcSizeRatio` | +0.056 | +0.037 | WR=54%, ROI=+0.3% | -3.2pp | N=486, WR=54%, ROI=-0.3% |
| `dSumRankNorm` | -0.014 | −0.004 | WR=50%, ROI=-8.0% | +5.1pp | N=371, WR=52%, ROI=-4.7% |
| `dWinnerCtPreA` | +0.056 | +0.037 | WR=54%, ROI=+0.7% | -3.6pp | N=477, WR=54%, ROI=+0.2% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dSumRankNorm` | −0.004 | +5.1pp | mild marginal info |
| 2 | `dCount` | +0.034 | -6.9pp | redundant — other features cover it |
| 3 | `dWinnerCtPreA` | +0.037 | -3.6pp | redundant — other features cover it |
| 4 | `dHcSizeRatio` | +0.037 | -3.2pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.160 | 0.160 | negative ↓ |
| 2 | `dCount` | COUNT | +0.151 | 0.151 | positive ↑ |
| 3 | `dWinnerCtPreA` | QUALITY_TRACK | +0.009 | 0.009 | flat ≈ 0 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | +0.004 | 0.004 | flat ≈ 0 |

Intercept b = -0.018 · Final log-loss = 0.6882 · N = 955.

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
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 955 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/955 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 265 | 128-137-0 | 48.3% [42–54] | -12.2% | -154.6u | -2.13 ✓ p<.05 |
| 4.5★ | 211 | 110-98-3 | 52.9% [46–60] | +0.4% | -54.1u | 0.06 ✗ noise |
| 4.0★ | 188 | 90-95-3 | 48.6% [42–56] | -6.0% | -2.1u | -0.83 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 138 | 70-65-3 | 51.9% [43–60] | +0.5% | +8.2u | 0.06 ✗ noise |
| 2.5★ | 154 | 79-74-1 | 51.6% [44–59] | -3.2% | +9.3u | -0.42 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 51/51%/-9% | 51/50%/-5% | 43/38%/-29% | 6/33%/-26% | 48/35%/-30% | 69/53%/+1% |
| Δw = +1 | 68/53%/-3% | 100/50%/-4% | 94/48%/-6% | 28/54%/+4% | 58/59%/+12% | 50/52%/-6% |
| Δw = +2 | 70/44%/-16% | 30/57%/+5% | 40/59%/+13% | — | 18/59%/+12% | 14/43%/-17% |
| Δw ≥ +3 | 74/45%/-21% | 27/63%/+20% | 11/55%/+11% | 3/67%/+156% | 14/71%/+43% | 19/47%/-12% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 20 | 18-2-0 | 90.0% [70–97] | +9.4% | +10.9u | 1.11 ✗ noise |
| −300/−201 | 32 | 21-11-0 | 65.6% [48–80] | -4.8% | +11.4u | -0.39 ✗ noise |
| −200/−151 | 101 | 60-41-0 | 59.4% [50–68] | -5.3% | -29.9u | -0.67 ✗ noise |
| −150/−101 | 575 | 287-281-7 | 50.5% [46–55] | -5.1% | -99.1u | -1.31 ✗ noise |
| −100/+100 | 13 | 7-6-0 | 53.8% [29–77] | +7.7% | -1.2u | 0.27 ✗ noise |
| +101/+150 | 197 | 84-110-3 | 43.3% [37–50] | -4.9% | -71.2u | -0.63 ✗ noise |
| +151/+200 | 30 | 15-15-0 | 50.0% [33–67] | +31.1% | +7.1u | 1.27 ✗ noise |
| +201+ | 24 | 4-20-0 | 16.7% [7–36] | -32.7% | -7.5u | -1.00 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -10% (4) | -4% (5) | +26% (2) | +21% (8) |
| −300/−201 | -16% (12) | +27% (7) | +20% (6) | -39% (7) |
| −200/−151 | -17% (29) | +0% (38) | +28% (15) | -29% (18) |
| −150/−101 | -10% (152) | -1% (241) | -11% (99) | -4% (80) |
| −100/+100 | -100% (3) | +43% (7) | +0% (2) | +100% (1) |
| +101/+150 | -13% (56) | -5% (79) | -2% (38) | +11% (24) |
| +151/+200 | +27% (4) | +31% (14) | +54% (7) | +29% (4) |
| +201+ | -28% (9) | -100% (6) | -100% (3) | +62% (6) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 523 | 258-264-1 | 49.4% [45–54] | -6.9% | -94.5u | -1.59 ✗ noise |
| SPREAD | 173 | 87-84-2 | 50.9% [43–58] | -4.0% | -47.1u | -0.55 ✗ noise |
| TOTAL | 298 | 151-140-7 | 51.9% [46–58] | -0.1% | -48.0u | -0.03 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=142 · 44% · -18% | N=188 · 51% · -6% | N=89 · 54% · +4% | N=101 · 50% · -4% |
| SPREAD | N=47 · 39% · -27% | N=83 · 57% · +10% | N=26 · 58% · +2% | N=16 · 38% · -27% |
| TOTAL | N=80 · 55% · +5% | N=128 · 51% · -2% | N=57 · 44% · -15% | N=31 · 65% · +24% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 769 | 385-377-7 | 50.5% [47–54] | -4.5% | -173.3u | -1.29 ✗ noise |
| NBA | 130 | 60-69-1 | 46.5% [38–55] | -7.4% | -15.3u | -0.78 ✗ noise |
| NHL | 50 | 25-23-2 | 52.1% [38–66] | +0.7% | -16.2u | 0.05 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=216 · 48% · -11% | N=346 · 52% · -2% | N=130 · 52% · -1% | N=76 · 50% · -6% |
| NBA | N=30 · 31% · -43% | N=29 · 48% · -6% | N=23 · 48% · -5% | N=43 · 53% · +14% |
| NHL | N=10 · 70% · +44% | N=14 · 69% · +25% | N=13 · 42% · -18% | N=13 · 31% · -40% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 351 · 48% · -8.3% · -1.54 ✗ noise | 642 · 52% · -2.5% · -0.66 ✗ noise |
| **plusEV** | 87 · 52% · -0.9% · -0.08 ✗ noise | 906 · 50% · -4.9% · -1.52 ✗ noise |
| **pinnacleConfirms** | 192 · 55% · +2.9% · 0.40 ✗ noise | 614 · 49% · -7.4% · -1.90 ~ p<.10 |
| **invested10kPlus** | 440 · 52% · -3.6% · -0.77 ✗ noise | 366 · 49% · -6.6% · -1.30 ✗ noise |
| **lineMovingWith** | 371 · 55% · +2.8% · 0.54 ✗ noise | 622 · 48% · -8.9% · -2.28 ✓ p<.05 |
| **predMarketAligns** | 213 · 53% · -1.3% · -0.18 ✗ noise | 593 · 49% · -6.3% · -1.60 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 375 | 186-189-0 | 49.6% [45–55] | -5.3% | -151.5u | -1.06 ✗ noise |
| 1 | 189 | 89-93-7 | 48.9% [42–56] | -5.8% | -28.6u | -0.82 ✗ noise |
| 2 | 199 | 98-98-3 | 50.0% [43–57] | -6.1% | +3.0u | -0.90 ✗ noise |
| 3 | 72 | 38-34-0 | 52.8% [41–64] | -1.5% | -3.8u | -0.13 ✗ noise |
| 4 | 73 | 41-32-0 | 56.2% [45–67] | +4.0% | -4.1u | 0.35 ✗ noise |
| 5 | 68 | 35-33-0 | 51.5% [40–63] | -7.7% | -9.0u | -0.68 ✗ noise |
| 6 | 18 | 9-9-0 | 50.0% [29–71] | +16.0% | +4.4u | 0.45 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 120 | 65-54-1 | 54.6% [46–63] | +1.4% | -4.3u | 0.16 ✗ noise |
| NEAR_START | 381 | 185-189-7 | 49.5% [44–55] | -5.5% | -41.6u | -1.08 ✗ noise |
| NO_MOVE | 28 | 14-14-0 | 50.0% [33–67] | -6.2% | +10.9u | -0.34 ✗ noise |
| PREGAME | 281 | 141-140-0 | 50.2% [44–56] | -4.6% | -126.5u | -0.79 ✗ noise |
| SMALL_MOVE | 182 | 89-91-2 | 49.4% [42–57] | -6.5% | -30.5u | -0.90 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 577 | 294-279-4 | 51.3% [47–55] | -4.0% | -178.2u | -1.00 ✗ noise |
| STRONG | 130 | 63-64-3 | 49.6% [41–58] | -4.8% | -5.1u | -0.56 ✗ noise |
| LEAN | 272 | 133-136-3 | 49.4% [44–55] | -4.1% | -3.2u | -0.66 ✗ noise |
| CONTESTED | 14 | 5-9-0 | 35.7% [16–61] | -33.8% | -4.7u | -1.34 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.023 ✗ | -0.024 ✗ | -0.026 | -0.75 |
| totalInvested | -0.028 ✗ | -0.041 ✗ | -0.003 | -1.28 |
| evEdge | 0.083 ✓ p<.01 | 0.106 ✓ p<.01 | 0.036 | 3.37 |
| moneyPct | 0.032 ✗ | 0.010 ✗ | 0.006 | 0.31 |
| walletPct | 0.039 ✗ | 0.027 ✗ | 0.025 | 0.86 |
| criteriaMet | 0.027 ✗ | 0.020 ✗ | -0.013 | 0.62 |
| maxContribFor | 0.004 ✗ | 0.011 ✗ | 0.028 | 0.36 |
| meanBaseFor | -0.006 ✗ | 0.019 ✗ | 0.036 | 0.60 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **979** picks. Mean CLV = **-0.0023**.
t-statistic vs zero: -1.53 → ✗ noise · 95% CI [-0.0054, 0.0007]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 111 | 50-60-1 | 45.5% [36–55] | -16.3% | -45.4u | -1.84 ~ p<.10 |
| CLV (−2%, 0] | 572 | 289-276-7 | 51.2% [47–55] | -3.6% | -85.5u | -0.90 ✗ noise |
| CLV (0, +2%] | 247 | 127-119-1 | 51.6% [45–58] | +0.2% | -44.8u | 0.04 ✗ noise |
| CLV > +2% | 49 | 24-24-1 | 50.0% [36–64] | -2.9% | -4.1u | -0.20 ✗ noise |

ρ(CLV, flat ROI) = 0.016 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=726 (with all features non-null). Intercept β₀ = 0.074.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | sharpCount | -0.234 | ↓ hurts |
| 2 | log(impliedProb) | +0.224 | ↑ helps |
| 3 | pw.ΔAvgRoi | +0.217 | ↑ helps |
| 4 | pw.Δcount | +0.203 | ↑ helps |
| 5 | pw.ΔTopQShare | +0.202 | ↑ helps |
| 6 | pw.ΔWlNet | +0.196 | ↑ helps |
| 7 | evEdge | +0.167 | ↑ helps |
| 8 | odds (American) | -0.113 | ↓ hurts |
| 9 | peak.stars | -0.087 | ↓ hurts |
| 10 | moneyPct | -0.084 | ↓ hurts |
| 11 | criteriaMet | +0.078 | ↑ helps |
| 12 | pw.ΔFlatPnl | +0.050 | ↑ helps |
| 13 | vault.star | +0.044 | ≈ flat |
| 14 | walletPct | +0.037 | ≈ flat |
| 15 | HC margin | +0.018 | ≈ flat |
| 16 | Δw | -0.012 | ≈ flat |
| 17 | log10(invested) | -0.006 | ≈ flat |
| 18 | Δw + HC | -0.001 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 66 | 32-34 | 48.5% | 48.7% | -110 | — (mute) | 2.32u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 198 | 116-82 | 58.6% | 58.2% | -110 | 6.08% bankroll | 2.03u | **UNDER-SIZED** — ship up to 6.08u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 132 | 62-68 | 47.7% | 47.9% | -110 | — (mute) | 1.99u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 148 | 77-71 | 52.0% | 51.9% | -110 | — (mute) | 2.31u | **MUTE** (negative EV at posterior) |
| Stale Δw = 0 | 213 | 101-109 | 48.1% | 48.2% | -110 | — (mute) | 1.80u | **MUTE** (negative EV at posterior) |
| Stale Δw ≤ −1 | 56 | 21-33 | 38.9% | 40.6% | -110 | — (mute) | 1.23u | **MUTE** (negative EV at posterior) |

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

**Peak cum PnL:** +7.1u
**Max drawdown:** -209.6u
**Longest losing-day streak:** 10
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.319  (annualized × √252 ≈ -5.06)

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
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 1 | -5 | -0.50 | L | -1.5u |
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
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 0 | -29 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 2 | -9 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | 1 | -17 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 10 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 1 | 3 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 1 | -6 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 2 | -3 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 2 | 8 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | 0 | 29 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | -5 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 2 | 5 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 3 | 4 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 12 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 26 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | 6 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -6 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 3 | -1 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | 2 | 8 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 2 | -9 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -18 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 3 | 16 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 3 | 28 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 4 | 17 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 2 | 23 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 0 | 15 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 17 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 2 | 5 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 2 | 5 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | 18 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 22 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 2 | -3 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 6 | 1 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 21 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 1 | 10 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 3 | 4 | 0.00 | L | -0.5u |
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
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 10 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | 4 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 4 | -9 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 12 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 2 | 16 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 2 | 12 | -0.50 | L | -3.0u |
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
| 2026-05-12 | MLB | ML | away | 5.0 | 4.50 | +108 | 4 | 0 | 4 | 2 | -17 | -0.20 | L | -4.5u |
| 2026-05-12 | MLB | TOTAL | under | 4.0 | 0.64 | -110 | 2 | 1 | 3 | 1 | -6 | 0.00 | L | -0.6u |
| 2026-05-12 | MLB | ML | away | 4.5 | 3.00 | +129 | 3 | 0 | 3 | 1 | 2 | -1.00 | L | -3.0u |
| 2026-05-12 | MLB | ML | home | 5.0 | 3.00 | +108 | 3 | 0 | 3 | 1 | -6 | -0.50 | L | -3.0u |
| 2026-05-12 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 6 | 4 | 10 | 5 | 31 | -0.70 | L | -3.5u |
| 2026-05-13 | MLB | ML | home | 4.5 | 4.50 | -116 | 1 | 1 | 2 | 2 | -17 | -1.30 | W | +3.7u |
| 2026-05-13 | MLB | SPREAD | home | 5.0 | 3.50 | -105 | 1 | 1 | 2 | 2 | -25 | 0.90 | W | +3.2u |
| 2026-05-13 | MLB | TOTAL | under | 4.0 | 0.96 | -110 | 1 | 1 | 2 | 2 | -7 | 0.00 | W | +0.9u |
| 2026-05-13 | MLB | TOTAL | under | 5.0 | 3.50 | -110 | 4 | 2 | 6 | 4 | -22 | 0.00 | L | -3.5u |
| 2026-05-13 | NBA | ML | home | 5.0 | 4.50 | -162 | 6 | 0 | 6 | 2 | -16 | -1.00 | L | -4.5u |
| 2026-05-13 | NBA | TOTAL | over | 5.0 | 3.50 | -101 | 3 | 2 | 5 | 4 | 2 | 0.00 | W | +3.4u |
| 2026-05-14 | MLB | ML | home | 5.0 | 4.50 | -103 | 4 | 1 | 5 | 2 | 2 | -0.40 | L | -4.5u |
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 1 | -19 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | -6 | 0.00 | L | -0.5u |
| 2026-05-14 | NHL | TOTAL | under | 5.0 | 3.50 | -110 | 3 | 1 | 4 | 1 | 8 | 0.00 | L | -3.5u |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 0 | 1 | 1 | 3 | 10 | 0.00 | W | +1.7u |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 1 | 1 | 2 | 3 | -10 | 0.00 | W | +0.3u |
| 2026-05-15 | MLB | ML | home | 4.0 | 2.50 | +128 | 0 | 0 | 0 | 0 | 3 | 0.00 | L | -2.5u |
| 2026-05-15 | MLB | ML | away | 4.0 | 2.75 | -211 | 2 | 1 | 3 | 1 | 2 | -0.90 | W | +1.3u |
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
| 2026-05-16 | MLB | ML | away | 2.5 | 0.50 | -102 | 1 | 0 | 1 | 3 | 3 | 0.00 | W | +0.5u |
| 2026-05-17 | MLB | ML | away | 4.0 | 2.75 | -148 | 1 | 0 | 1 | 1 | -19 | -0.70 | W | +1.9u |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.50 | +139 | 0 | 1 | 1 | 1 | -19 | 0.70 | L | -0.5u |
| 2026-05-17 | MLB | ML | away | 5.0 | 5.00 | -129 | 3 | 1 | 4 | 1 | -19 | 0.40 | L | -5.0u |
| 2026-05-17 | MLB | ML | home | 4.0 | 2.75 | -114 | 3 | 1 | 4 | 3 | -12 | 2.20 | W | +2.4u |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 1 | 3 | 2 | -25 | 0.00 | W | +2.0u |
| 2026-05-17 | MLB | TOTAL | over | 5.0 | 2.50 | +107 | 2 | 2 | 4 | 1 | -19 | 0.00 | L | -2.5u |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | -12 | 0.00 | W | +0.3u |
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
| 2026-05-19 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 2 | -21 | -1.30 | L | -2.5u |
| 2026-05-19 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | 12 | 0.00 | W | +1.5u |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.50 | +105 | 1 | 1 | 2 | 2 | -21 | -0.90 | L | -2.5u |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 1 | 1 | 2 | 1 | -11 | -1.20 | W | +1.2u |
| 2026-05-19 | NBA | ML | home | 5.0 | 5.00 | -260 | 0 | 3 | 3 | 3 | 5 | -0.50 | W | +1.9u |
| 2026-05-19 | NBA | SPREAD | away | 5.0 | 2.25 | -105 | 3 | 2 | 5 | 2 | -4 | -0.90 | L | -2.3u |
| 2026-05-19 | NBA | TOTAL | under | 5.0 | 3.00 | -106 | 2 | 3 | 5 | 2 | 14 | 0.00 | L | -3.0u |
| 2026-05-20 | MLB | ML | away | 5.0 | 2.50 | +113 | 2 | 1 | 3 | 1 | -19 | -1.00 | L | -2.5u |
| 2026-05-20 | MLB | ML | home | 4.0 | 2.75 | -154 | 2 | 0 | 2 | 1 | 2 | -1.50 | W | +1.9u |
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
| 2026-05-21 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 0 | 0 | 0 | -30 | 0.00 | W | +0.3u |
| 2026-05-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 3 | 1 | 4 | 3 | -23 | -0.40 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +129 | 1 | 0 | 1 | 3 | -26 | -0.40 | W | +1.6u |
| 2026-05-21 | MLB | SPREAD | away | 4.0 | 1.65 | -170 | 1 | 1 | 2 | 1 | -6 | 0.30 | W | +1.0u |
| 2026-05-21 | NBA | SPREAD | away | 5.0 | 3.00 | -110 | 4 | 2 | 6 | 3 | 16 | 0.70 | L | -3.0u |
| 2026-05-21 | NHL | ML | home | 4.0 | 2.75 | -197 | 4 | 1 | 5 | 1 | 8 | -1.30 | L | -2.8u |
| 2026-05-21 | NHL | TOTAL | over | 3.0 | 0.75 | +103 | 1 | 0 | 1 | 1 | 8 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 5.0 | 1.25 | -175 | 1 | 0 | 1 | 0 | 0 | -0.90 | L | -1.3u |
| 2026-05-22 | MLB | ML | home | 4.0 | 1.25 | -195 | 3 | 0 | 3 | 1 | 2 | 0.80 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 11 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 3.0 | 1.25 | -137 | 1 | 0 | 1 | 1 | -18 | 0.00 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | -1 | -10 | 0.00 | L | -0.8u |
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
| 2026-05-23 | MLB | ML | home | 2.5 | 0.50 | -181 | 1 | 0 | 1 | 1 | 12 | -1.70 | W | +0.3u |
| 2026-05-23 | MLB | ML | away | 2.5 | 2.75 | +109 | 2 | 0 | 2 | 2 | -14 | -0.50 | L | -2.8u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | -31 | 0.00 | W | +0.3u |
| 2026-05-23 | MLB | ML | home | 5.0 | 1.00 | -148 | 0 | 0 | 0 | 1 | -26 | -0.20 | L | -1.0u |
| 2026-05-23 | MLB | SPREAD | away | 3.0 | 0.75 | -163 | 1 | 0 | 1 | 0 | -29 | 0.00 | W | +0.5u |
| 2026-05-23 | MLB | TOTAL | under | 5.0 | 3.00 | -110 | 3 | 1 | 4 | 3 | -29 | 0.00 | W | +2.7u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | 12 | -0.90 | L | -0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 1 | 3 | 2 | -28 | 0.00 | L | -0.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 1.50 | -209 | 0 | 0 | 0 | 2 | -7 | 29.00 | W | +2.5u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | +102 | 0 | 0 | 0 | 1 | 12 | 0.00 | W | +0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -19 | 0.00 | W | +0.7u |
| 2026-05-23 | MLB | ML | away | 2.5 | 1.25 | -111 | -1 | 1 | 0 | 1 | 16 | 0.40 | L | -1.3u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -135 | 0 | 0 | 0 | 1 | 12 | 0.40 | W | +0.6u |
| 2026-05-23 | MLB | TOTAL | under | 2.5 | 0.30 | +108 | 0 | 0 | 0 | 0 | -1 | 0.00 | P | +0.0u |
| 2026-05-23 | MLB | ML | home | 4.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | -18 | 1.10 | W | +2.9u |
| 2026-05-23 | MLB | ML | away | 3.0 | 1.25 | +166 | 2 | 1 | 3 | 2 | -39 | -0.30 | W | +1.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 2.25 | -123 | 1 | 0 | 1 | 2 | 6 | -0.90 | W | +1.6u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -111 | 1 | 0 | 1 | 1 | 12 | 0.00 | L | -0.3u |
| 2026-05-23 | NBA | SPREAD | home | 5.0 | 3.00 | -107 | 5 | 1 | 6 | 2 | 24 | 0.20 | L | -3.0u |
| 2026-05-23 | NBA | TOTAL | under | 5.0 | 3.00 | +102 | 1 | -1 | 0 | 6 | 1 | 0.00 | L | -3.0u |
| 2026-05-23 | NHL | ML | home | 5.0 | 5.00 | -205 | 8 | 0 | 8 | 3 | 4 | -0.70 | W | +2.4u |
| 2026-05-23 | NHL | TOTAL | under | 3.0 | 0.30 | -110 | 1 | 1 | 2 | 0 | -3 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | home | 4.5 | 3.75 | -101 | 2 | 1 | 3 | 2 | -25 | 0.00 | L | -3.8u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -189 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -5 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 1 | 2 | 1 | -37 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | 1 | -6 | 0.00 | W | +4.3u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 2.5 | 0.50 | +144 | 1 | 1 | 2 | -1 | -42 | 0.00 | L | -0.5u |
| 2026-05-24 | MLB | SPREAD | home | 4.0 | 1.65 | -110 | 2 | 1 | 3 | 2 | -7 | -1.30 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -107 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +1.2u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 1.00 | -101 | 1 | 1 | 2 | 1 | 12 | 0.00 | W | +0.0u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 0.30 | -104 | 0 | 0 | 0 | 0 | 1 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | away | 4.0 | 1.25 | +148 | 2 | 2 | 4 | 0 | -38 | -1.40 | W | +1.9u |
| 2026-05-24 | MLB | ML | away | 3.0 | 1.25 | -122 | -1 | 1 | 0 | 0 | -32 | -1.10 | L | -1.3u |
| 2026-05-24 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 2 | 2 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | SPREAD | home | 3.0 | 0.75 | +134 | 1 | 0 | 1 | 1 | 7 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | -40 | 0.00 | W | +0.7u |
| 2026-05-24 | NBA | SPREAD | away | 5.0 | 1.65 | -103 | 3 | 0 | 3 | 1 | 2 | 0.50 | L | -1.6u |
| 2026-05-24 | NBA | TOTAL | over | 4.5 | 3.00 | -107 | 2 | 1 | 3 | 2 | -21 | 0.00 | L | -3.0u |
| 2026-05-24 | NHL | ML | away | 4.0 | 2.75 | -136 | 3 | 0 | 3 | 1 | 4 | -0.70 | L | -2.8u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -149 | 1 | 0 | 1 | 2 | -14 | -0.70 | L | -5.0u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -310 | 2 | 0 | 2 | 1 | 2 | -1.20 | W | +1.6u |
| 2026-05-25 | MLB | TOTAL | over | 4.0 | 1.65 | +103 | 1 | 0 | 1 | 2 | 21 | 0.00 | L | -1.6u |
| 2026-05-25 | MLB | ML | home | 4.0 | 1.25 | -125 | 1 | -1 | 0 | 1 | -8 | -1.90 | L | -1.3u |
| 2026-05-25 | MLB | SPREAD | away | 4.0 | 1.65 | -184 | 1 | 0 | 1 | 1 | -6 | 28.40 | W | +2.4u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 2.25 | -112 | 4 | 0 | 4 | 3 | 6 | 0.00 | L | -2.3u |
| 2026-05-25 | MLB | ML | home | 5.0 | 1.25 | -160 | 3 | 0 | 3 | 2 | -45 | -1.10 | L | -1.3u |
| 2026-05-25 | MLB | TOTAL | over | 5.0 | 3.00 | -110 | 3 | 0 | 3 | 3 | 30 | 0.00 | W | +2.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 3.75 | -108 | 0 | 0 | 0 | 3 | -33 | -1.70 | L | -3.8u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -124 | 2 | 0 | 2 | 2 | -7 | -1.30 | W | +0.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 5.00 | -119 | 2 | -1 | 1 | 4 | 11 | -0.60 | W | +3.1u |
| 2026-05-25 | MLB | ML | away | 2.5 | 2.75 | -113 | 0 | 0 | 0 | 0 | -12 | -1.80 | W | +1.1u |
| 2026-05-25 | MLB | ML | home | 4.0 | 5.00 | -209 | -1 | 0 | -1 | 2 | -14 | -0.80 | W | +2.3u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 0.75 | -101 | 2 | 1 | 3 | 1 | -5 | 0.00 | W | +0.7u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -178 | 1 | 0 | 1 | 2 | -7 | -1.60 | W | +0.9u |
| 2026-05-25 | NBA | ML | away | 5.0 | 5.00 | -125 | 0 | 0 | 0 | 3 | 26 | -0.40 | W | +4.0u |
| 2026-05-25 | NBA | TOTAL | under | 5.0 | 3.00 | -110 | 2 | 2 | 4 | 0 | -2 | 0.00 | L | -3.0u |
| 2026-05-25 | NHL | ML | home | 5.0 | 2.50 | +120 | 8 | 4 | 12 | 1 | -4 | -0.60 | L | -2.5u |
| 2026-05-25 | NHL | SPREAD | home | 4.5 | 2.25 | -215 | 1 | 1 | 2 | 1 | 1 | -0.80 | W | +1.1u |
| 2026-05-26 | MLB | TOTAL | over | 5.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | -7 | 0.00 | W | +1.5u |
| 2026-05-26 | MLB | ML | away | 5.0 | 1.50 | +200 | 2 | 0 | 2 | 2 | -21 | -1.00 | L | -1.5u |
| 2026-05-26 | MLB | SPREAD | away | 5.0 | 1.00 | -101 | 2 | 1 | 3 | 2 | -7 | 0.50 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 2.5 | 1.25 | +113 | 0 | 0 | 0 | -1 | -12 | -1.50 | W | +1.4u |
| 2026-05-26 | MLB | ML | home | 2.5 | 1.25 | -130 | 1 | 0 | 1 | -1 | -12 | -1.30 | W | +1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -200 | 1 | 0 | 1 | 1 | 12 | -0.60 | W | +1.9u |
| 2026-05-26 | MLB | SPREAD | home | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 2 | 21 | -0.20 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -102 | 3 | 1 | 4 | 2 | -32 | -0.50 | W | +4.9u |
| 2026-05-26 | MLB | ML | home | 5.0 | 3.75 | -108 | 3 | 1 | 4 | 2 | 6 | -0.20 | L | -3.8u |
| 2026-05-26 | MLB | ML | home | 5.0 | 5.00 | -105 | 2 | 1 | 3 | 1 | 12 | -2.00 | W | +3.6u |
| 2026-05-26 | MLB | ML | away | 5.0 | 2.50 | +116 | 1 | 0 | 1 | 1 | 12 | -1.00 | W | +2.9u |
| 2026-05-26 | NBA | ML | home | 5.0 | 5.00 | -198 | 2 | 4 | 6 | 2 | 12 | -0.70 | W | +1.9u |
| 2026-05-26 | NBA | SPREAD | home | 5.0 | 1.00 | -110 | 2 | 2 | 4 | 3 | 21 | 1.20 | W | +0.0u |
| 2026-05-26 | NBA | TOTAL | over | 5.0 | 3.00 | -108 | 0 | 0 | 0 | 3 | -3 | 0.00 | W | +2.6u |
| 2026-05-26 | NHL | SPREAD | home | 5.0 | 2.25 | -250 | 2 | 0 | 2 | 2 | 6 | 0.80 | W | +0.9u |
| 2026-05-27 | MLB | ML | home | 4.5 | 0.50 | -102 | 3 | 1 | 4 | 1 | -2 | -1.10 | W | +0.4u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 2.50 | +141 | 1 | 1 | 2 | 3 | -7 | 0.80 | L | -2.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.00 | +105 | 2 | 0 | 2 | 2 | -7 | 0.00 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 4.5 | 3.75 | -420 | 1 | 1 | 2 | 0 | 0 | -0.50 | W | +0.7u |
| 2026-05-27 | MLB | ML | home | 3.0 | 1.25 | -144 | -1 | -1 | -2 | 0 | -20 | -1.00 | L | -1.3u |
| 2026-05-27 | MLB | ML | away | 5.0 | 0.50 | -102 | 3 | 0 | 3 | 1 | -4 | -1.00 | L | -0.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | 12 | 0.40 | W | +0.5u |
| 2026-05-27 | MLB | TOTAL | under | 5.0 | 1.00 | -112 | 3 | 1 | 4 | 3 | -1 | 0.00 | W | +0.0u |
| 2026-05-27 | MLB | ML | away | 4.0 | 1.00 | -108 | 1 | -1 | 0 | 0 | 31 | -0.90 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 5.0 | 0.50 | +132 | 2 | 0 | 2 | 2 | 28 | -0.50 | L | -0.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.65 | +104 | 2 | 0 | 2 | 2 | 21 | 0.00 | W | +1.7u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 0.75 | +104 | 2 | 0 | 2 | 2 | 25 | 0.00 | W | +0.8u |
| 2026-05-27 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 2 | 5 | 2 | -35 | -0.30 | L | -2.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.5 | 1.65 | -145 | 1 | 1 | 2 | 1 | 12 | -0.30 | W | +1.1u |
| 2026-05-27 | MLB | ML | away | 5.0 | 5.00 | -126 | 2 | 0 | 2 | 3 | 37 | -4.10 | L | -5.0u |
| 2026-05-27 | MLB | ML | home | 4.0 | 1.25 | -190 | 1 | 0 | 1 | 0 | 0 | -0.70 | W | +0.7u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 3.00 | -135 | 0 | 0 | 0 | 2 | 12 | -0.90 | W | +2.2u |
| 2026-05-27 | NHL | SPREAD | home | 5.0 | 1.00 | -194 | 3 | 0 | 3 | 1 | 1 | 0.00 | L | -1.0u |
| 2026-05-27 | NHL | TOTAL | over | 5.0 | 2.25 | -112 | 3 | 0 | 3 | 1 | -1 | 0.00 | L | -2.3u |
| 2026-05-28 | MLB | TOTAL | over | 5.0 | 3.00 | +101 | 3 | -1 | 2 | 3 | 49 | 0.00 | W | +2.5u |
| 2026-05-28 | MLB | ML | home | 5.0 | 1.25 | -140 | 2 | 0 | 2 | 2 | -20 | -0.50 | L | -1.3u |
| 2026-05-28 | MLB | TOTAL | under | 5.0 | 1.00 | -107 | 1 | 0 | 1 | 1 | 32 | 0.00 | W | +0.0u |
| 2026-05-28 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 1 | 4 | 3 | -33 | -0.60 | L | -2.5u |
| 2026-05-28 | MLB | TOTAL | over | 2.5 | 1.65 | -108 | 2 | 0 | 2 | 2 | -7 | 0.00 | L | -1.6u |
| 2026-05-28 | NBA | SPREAD | away | 5.0 | 1.00 | -110 | 1 | 2 | 3 | 0 | -2 | -0.90 | L | -1.0u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.50 | +118 | 5 | 1 | 6 | 4 | 37 | -0.90 | L | -2.5u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 0.75 | -135 | 2 | 0 | 2 | 1 | -36 | 1.00 | L | -0.8u |
| 2026-05-29 | MLB | ML | home | 5.0 | 3.75 | -124 | 2 | 1 | 3 | 2 | -7 | -1.00 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 1.65 | -106 | 2 | 0 | 2 | 3 | 25 | 0.00 | L | -1.6u |
| 2026-05-29 | MLB | ML | home | 4.0 | 2.50 | +120 | 1 | 0 | 1 | 1 | -2 | 0.40 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 2.25 | -112 | 2 | 0 | 2 | 3 | 56 | 0.00 | W | +2.0u |
| 2026-05-29 | MLB | SPREAD | away | 4.0 | 0.75 | +150 | 0 | 0 | 0 | 1 | 12 | -0.50 | L | -0.8u |
| 2026-05-29 | MLB | ML | away | 5.0 | 2.50 | +140 | 2 | 1 | 3 | 1 | -36 | 1.00 | L | -2.5u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 1.65 | -103 | 0 | 0 | 0 | 2 | -7 | 0.00 | W | +1.6u |
| 2026-05-29 | MLB | ML | away | 4.5 | 1.25 | -142 | 0 | 1 | 1 | 0 | 56 | -1.20 | W | +0.3u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 1.65 | -135 | 1 | 0 | 1 | 2 | -7 | 0.40 | W | +1.2u |
| 2026-05-29 | MLB | ML | home | 4.5 | 1.25 | -134 | 1 | 0 | 1 | 0 | -26 | -1.70 | W | +2.8u |
| 2026-05-29 | MLB | SPREAD | away | 5.0 | 2.25 | -184 | 0 | 0 | 0 | 1 | 12 | -1.00 | W | +1.2u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 0.75 | -109 | 1 | 0 | 1 | 2 | 25 | 0.00 | W | +0.7u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.75 | -106 | 2 | 1 | 3 | 0 | -3 | 0.70 | L | -2.8u |
| 2026-05-29 | MLB | SPREAD | home | 4.0 | 1.65 | -175 | 0 | 0 | 0 | 2 | -7 | -0.80 | L | -1.6u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 0.30 | +105 | 2 | 1 | 3 | 0 | -3 | 0.00 | W | +0.3u |
| 2026-05-29 | MLB | ML | home | 4.5 | 3.75 | -122 | 0 | 1 | 1 | 1 | 19 | -0.60 | L | -3.8u |
| 2026-05-29 | MLB | TOTAL | over | 3.0 | 1.00 | -108 | 0 | 0 | 0 | 1 | 12 | 0.00 | W | +1.5u |
| 2026-05-29 | NHL | ML | away | 5.0 | 1.00 | +205 | 3 | 0 | 3 | 0 | -4 | -0.60 | L | -1.0u |
| 2026-05-29 | NHL | SPREAD | away | 5.0 | 3.00 | -118 | 3 | 1 | 4 | 1 | -4 | 0.00 | L | -3.0u |
| 2026-05-29 | NHL | TOTAL | under | 5.0 | 2.25 | -106 | 2 | 0 | 2 | 2 | 1 | 0.00 | L | -2.3u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +132 | 2 | 1 | 3 | 2 | -25 | 0.00 | L | -2.5u |
| 2026-05-30 | MLB | ML | away | 4.5 | 2.75 | -125 | 1 | 2 | 3 | 1 | 31 | -0.60 | W | +2.3u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -130 | 1 | 0 | 1 | 2 | -5 | -1.20 | L | -5.0u |
| 2026-05-30 | MLB | ML | away | 4.0 | 3.75 | -132 | 1 | 1 | 2 | 0 | 40 | -1.00 | W | +2.9u |
| 2026-05-30 | MLB | SPREAD | home | 3.0 | 0.75 | -143 | 0 | 1 | 1 | 0 | -18 | -1.40 | L | -0.8u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -118 | 1 | 1 | 2 | 1 | -12 | -1.30 | L | -3.8u |
| 2026-05-30 | MLB | SPREAD | away | 4.0 | 1.00 | +152 | 1 | 0 | 1 | 1 | 12 | 0.20 | L | -1.0u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | 3 | -33 | -1.10 | W | +4.2u |
| 2026-05-30 | MLB | TOTAL | over | 4.5 | 0.75 | +100 | 1 | 1 | 2 | 1 | -9 | 0.00 | W | +0.8u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.75 | -130 | 0 | 1 | 1 | -1 | -12 | -1.60 | W | +0.4u |
| 2026-05-30 | MLB | TOTAL | over | 4.0 | 2.25 | -116 | 2 | 0 | 2 | 2 | 33 | 0.00 | W | +1.9u |
| 2026-05-30 | MLB | TOTAL | under | 4.0 | 1.65 | -107 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -1.6u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.50 | +129 | 1 | 0 | 1 | 1 | -19 | -0.90 | W | +0.7u |
| 2026-05-30 | MLB | SPREAD | home | 5.0 | 1.65 | -120 | 2 | 1 | 3 | 2 | -7 | -0.60 | W | +1.4u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +108 | 1 | 0 | 1 | 3 | -33 | -0.90 | W | +2.7u |
| 2026-05-30 | MLB | ML | home | 4.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | -19 | -0.20 | W | +0.6u |
| 2026-05-30 | MLB | ML | home | 5.0 | 1.25 | -102 | 2 | 0 | 2 | 1 | -19 | -0.70 | W | +1.2u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -122 | 1 | 1 | 2 | 2 | -14 | -0.20 | L | -3.8u |
| 2026-05-30 | MLB | TOTAL | under | 3.0 | 0.75 | -108 | 0 | 0 | 0 | 1 | 12 | 0.00 | L | -0.8u |
| 2026-05-30 | NBA | ML | home | 5.0 | 1.00 | -154 | 3 | 3 | 6 | 0 | 5 | 0.00 | L | -1.0u |
| 2026-05-30 | NBA | TOTAL | under | 5.0 | 2.50 | -109 | 5 | 0 | 5 | 6 | 6 | 0.00 | L | -2.5u |
| 2026-05-31 | MLB | ML | away | 3.0 | 2.75 | -125 | -2 | 0 | -2 | 1 | -8 | -1.20 | L | -2.8u |
| 2026-05-31 | MLB | TOTAL | under | 5.0 | 1.65 | -114 | 2 | 0 | 2 | 3 | 6 | 0.00 | L | -1.6u |
| 2026-05-31 | MLB | ML | home | 2.5 | 2.75 | -115 | 1 | 1 | 2 | 1 | 40 | 0.00 | W | +2.4u |
| 2026-05-31 | MLB | ML | away | 5.0 | 1.00 | +115 | -1 | 0 | -1 | 2 | -14 | -0.60 | L | -1.0u |
| 2026-05-31 | MLB | SPREAD | away | 5.0 | 1.00 | -117 | 3 | 1 | 4 | 3 | 2 | -0.20 | L | -1.0u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -164 | 0 | 1 | 1 | 2 | -14 | -1.20 | W | +2.3u |
| 2026-05-31 | MLB | ML | away | 3.0 | 1.25 | -184 | 0 | 0 | 0 | 0 | -38 | -1.70 | W | +0.7u |
| 2026-05-31 | MLB | ML | home | 2.5 | 1.25 | -232 | 0 | 0 | 0 | 0 | 14 | -0.50 | W | +0.5u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -102 | 0 | 1 | 1 | 3 | -20 | 0.20 | W | +4.9u |
| 2026-05-31 | MLB | TOTAL | over | 4.0 | 1.00 | +101 | 2 | 1 | 3 | 2 | 7 | 0.00 | L | -1.0u |
| 2026-05-31 | MLB | ML | away | 4.5 | 2.50 | +110 | 0 | 0 | 0 | 0 | -38 | -1.10 | L | -2.5u |
| 2026-06-01 | MLB | ML | home | 4.5 | 3.00 | -155 | 3 | 2 | 5 | 2 | 12 | -1.00 | W | +2.1u |
| 2026-06-01 | MLB | ML | away | 4.0 | 1.00 | +135 | 2 | 2 | 4 | 1 | 32 | -0.20 | W | +1.4u |
| 2026-06-01 | MLB | ML | away | 5.0 | 2.50 | +160 | 2 | -1 | 1 | 1 | 33 | -1.30 | W | +2.7u |
| 2026-06-01 | MLB | TOTAL | under | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 2 | -17 | 0.00 | L | -1.0u |
| 2026-06-01 | MLB | ML | home | 3.0 | 0.50 | -142 | -1 | 0 | -1 | -2 | -14 | -0.40 | L | -0.5u |
| 2026-06-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 24 | 0.00 | L | -5.0u |
| 2026-06-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 3 | -12 | 0.00 | W | +2.7u |
| 2026-06-02 | MLB | ML | home | 2.5 | 0.25 | -215 | -1 | 0 | -1 | -1 | -18 | -1.40 | L | -0.3u |
| 2026-06-02 | MLB | TOTAL | under | 4.0 | 1.00 | -117 | 1 | 0 | 1 | 0 | 1 | 0.00 | L | -1.0u |
| 2026-06-02 | MLB | ML | away | 5.0 | 2.50 | +130 | 2 | 0 | 2 | -1 | 30 | -0.60 | W | +3.1u |
| 2026-06-02 | MLB | ML | away | 3.0 | 0.50 | +100 | 1 | 0 | 1 | 1 | 12 | -1.20 | W | +0.5u |
| 2026-06-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 14 | 0.00 | L | -3.0u |
| 2026-06-02 | MLB | ML | home | 4.0 | 1.00 | -112 | 1 | 0 | 1 | 0 | 0 | -1.10 | L | -1.0u |
| 2026-06-02 | MLB | ML | home | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 0 | 0 | -0.50 | L | -1.0u |
| 2026-06-02 | MLB | ML | away | 5.0 | 2.50 | +102 | 0 | -1 | -1 | 2 | -7 | 0.00 | L | -2.5u |
| 2026-06-02 | NHL | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 2 | 4 | 2 | 13 | 0.00 | W | +4.3u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -150 | 3 | 1 | 4 | 4 | -20 | -1.30 | W | +0.3u |
| 2026-06-03 | MLB | ML | away | 4.0 | 1.00 | +134 | -1 | -1 | -2 | -2 | 14 | -1.00 | W | +1.2u |
| 2026-06-03 | MLB | ML | away | 4.0 | 1.00 | +125 | 0 | -1 | -1 | -1 | 27 | 0.40 | W | +1.3u |
| 2026-06-03 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 54 | 0.00 | L | -3.0u |
| 2026-06-03 | MLB | ML | home | 4.5 | 1.50 | +167 | 0 | 0 | 0 | -2 | -18 | -0.40 | L | -1.5u |
| 2026-06-03 | MLB | SPREAD | away | 4.0 | 1.00 | -111 | 1 | 0 | 1 | 0 | 9 | 0.20 | W | +0.8u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -103 | 3 | 1 | 4 | 2 | -24 | -1.20 | L | -0.5u |
| 2026-06-03 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | -15 | 0.00 | L | -5.0u |
| 2026-06-03 | MLB | ML | away | 3.0 | 0.50 | +119 | 1 | 0 | 1 | -1 | 5 | 0.00 | W | +0.6u |
| 2026-06-03 | MLB | ML | away | 4.5 | 3.00 | -137 | 0 | 0 | 0 | -2 | 7 | -1.50 | L | -3.0u |
| 2026-06-03 | MLB | ML | home | 5.0 | 5.00 | -215 | 0 | 1 | 1 | -1 | 26 | -1.00 | W | +2.3u |
| 2026-06-03 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 1 | 1 | 2 | 0 | -19 | 0.00 | L | -0.3u |
| 2026-06-03 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 1 | 0 | 1 | 0 | 1 | 0.00 | W | +2.5u |
| 2026-06-03 | MLB | ML | home | 4.5 | 3.00 | -112 | 0 | 0 | 0 | 0 | 0 | -0.90 | W | +2.7u |
| 2026-06-03 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 0 | 0.00 | W | +4.5u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -139 | 0 | 0 | 0 | -2 | 45 | -1.20 | W | +0.3u |
| 2026-06-03 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 1 | 0 | 1 | 0 | 1 | 0.00 | L | -2.5u |
| 2026-06-03 | NBA | ML | home | 2.5 | 0.25 | -198 | 3 | 4 | 7 | 5 | 9 | -1.20 | L | -0.3u |
| 2026-06-03 | NBA | SPREAD | away | 2.5 | 0.25 | -104 | 3 | -1 | 2 | 4 | 1 | -1.20 | W | +0.2u |
| 2026-06-04 | MLB | ML | away | 3.0 | 0.50 | +104 | 1 | 0 | 1 | 0 | -15 | 0.00 | W | +0.5u |
| 2026-06-04 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | -1 | 0 | 0 | 21 | 0.00 | L | -1.0u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | +102 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-04 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 0 | 42 | -0.40 | W | +3.0u |
| 2026-06-04 | MLB | SPREAD | away | 5.0 | 5.00 | -111 | 0 | 0 | 0 | 1 | 21 | 0.00 | L | -5.0u |
| 2026-06-04 | MLB | ML | home | 5.0 | 5.00 | -131 | 1 | 0 | 1 | 0 | 42 | 0.20 | W | +3.5u |
| 2026-06-04 | MLB | ML | away | 2.5 | 0.25 | +105 | 0 | 0 | 0 | 1 | 0 | -1.00 | W | +0.2u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | -210 | 1 | 0 | 1 | 1 | 51 | -1.00 | W | +0.5u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | -188 | 0 | 0 | 0 | -1 | -12 | -1.10 | L | -1.0u |
| 2026-06-04 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 31 | 0.00 | W | +2.7u |
| 2026-06-04 | MLB | ML | home | 3.0 | 0.50 | -235 | 4 | 0 | 4 | 4 | 30 | 0.00 | L | -0.5u |
| 2026-06-04 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 4 | 0.00 | L | -5.0u |
| 2026-06-04 | NHL | ML | home | 2.5 | 0.25 | -160 | -3 | 0 | -3 | 2 | 11 | -0.40 | W | +0.2u |
| 2026-06-05 | MLB | ML | home | 2.5 | 0.25 | -144 | 1 | 1 | 2 | -1 | 2 | -1.20 | L | -0.3u |
| 2026-06-05 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | -1 | -1 | -1 | 21 | 0.00 | W | +2.8u |
| 2026-06-05 | MLB | ML | away | 3.0 | 0.50 | +128 | 1 | 0 | 1 | 0 | 26 | 0.00 | W | +0.6u |
| 2026-06-05 | MLB | TOTAL | over | 4.0 | 1.00 | -109 | 0 | 0 | 0 | 0 | 1 | 0.00 | P | +0.0u |
| 2026-06-05 | MLB | ML | home | 3.0 | 0.50 | -136 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.4u |
| 2026-06-05 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 3 | 0 | 3 | 4 | 27 | 0.00 | W | +0.4u |
| 2026-06-05 | MLB | ML | away | 5.0 | 5.00 | -122 | 0 | 1 | 1 | 1 | 54 | -0.80 | L | -5.0u |
| 2026-06-05 | MLB | ML | home | 5.0 | 5.00 | -171 | 0 | 2 | 2 | 2 | 28 | -0.20 | W | +2.7u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -188 | 2 | 0 | 2 | 1 | 12 | -0.90 | W | +0.5u |
| 2026-06-05 | MLB | ML | away | 4.0 | 1.00 | -105 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -141 | 3 | 2 | 5 | 2 | -5 | 0.30 | W | +0.7u |
| 2026-06-05 | MLB | TOTAL | over | 5.0 | 2.50 | -110 | 0 | 1 | 1 | -1 | 30 | 0.00 | W | +2.5u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -172 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-05 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 0 | -1 | -1 | 0 | 1 | 0.00 | W | +4.4u |
| 2026-06-05 | MLB | ML | away | 4.5 | 3.00 | -129 | -1 | 1 | 0 | -2 | 40 | -1.10 | W | +2.2u |
| 2026-06-05 | MLB | SPREAD | away | 3.0 | 0.50 | +126 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.6u |
| 2026-06-05 | NBA | ML | home | 2.5 | 0.25 | -230 | 2 | 2 | 4 | 4 | 11 | 1.00 | L | -0.3u |
| 2026-06-05 | NBA | SPREAD | home | 2.5 | 0.25 | -106 | 3 | 0 | 3 | 0 | 4 | -0.70 | L | -0.3u |
| 2026-06-06 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 1 | 0 | 1 | 0 | 17 | 0.00 | W | +0.2u |
| 2026-06-06 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 5 | 0.00 | W | +2.7u |
| 2026-06-06 | MLB | ML | home | 4.5 | 3.00 | -126 | 0 | 0 | 0 | -1 | -12 | -1.00 | W | +2.4u |
| 2026-06-06 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | 2 | 0.00 | W | +2.7u |
| 2026-06-06 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 1 | 1 | -1 | 14 | 0.00 | L | -1.0u |
| 2026-06-06 | MLB | ML | home | 3.0 | 0.50 | -130 | 0 | 0 | 0 | -1 | 11 | -0.90 | L | -0.5u |
| 2026-06-06 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -5.0u |
| 2026-06-06 | MLB | ML | home | 4.5 | 3.00 | -350 | 0 | 1 | 1 | -1 | 43 | -0.90 | W | +0.9u |
| 2026-06-06 | MLB | TOTAL | under | 5.0 | 2.50 | -110 | 0 | 0 | 0 | 0 | 4 | 0.00 | L | -2.5u |
| 2026-06-06 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 1 | 4 | 3 | 2 | 0.00 | W | +2.8u |
| 2026-06-06 | MLB | ML | home | 5.0 | 5.00 | -123 | 0 | 0 | 0 | 1 | 9 | 0.00 | W | +4.1u |
| 2026-06-06 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | L | -1.0u |
| 2026-06-06 | MLB | ML | home | 5.0 | 2.50 | +117 | -2 | -1 | -3 | 0 | 30 | 0.00 | L | -2.5u |
| 2026-06-06 | MLB | ML | home | 5.0 | 5.00 | -154 | 2 | 1 | 3 | -1 | 30 | -0.80 | L | -5.0u |
| 2026-06-07 | MLB | ML | home | 4.5 | 3.00 | -130 | 1 | 0 | 1 | -1 | 26 | -0.90 | W | +2.2u |
| 2026-06-07 | MLB | TOTAL | over | 3.0 | 0.50 | -112 | 0 | 0 | 0 | 3 | 10 | 0.00 | L | -0.5u |
| 2026-06-07 | MLB | ML | home | 5.0 | 5.00 | -143 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +3.5u |
| 2026-06-07 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | 2 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -136 | 1 | 0 | 1 | -1 | 26 | 0.00 | W | +0.7u |
| 2026-06-07 | MLB | ML | home | 4.5 | 3.00 | -165 | 2 | 2 | 4 | 2 | -14 | -1.10 | W | +1.8u |
| 2026-06-07 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 1 | 10 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | away | 2.5 | 0.25 | -107 | 1 | 0 | 1 | -2 | 9 | -0.80 | W | +0.2u |
| 2026-06-07 | MLB | TOTAL | over | 2.5 | 0.25 | -115 | 0 | 0 | 0 | -1 | -21 | 0.00 | W | +0.2u |
| 2026-06-07 | MLB | ML | home | 2.5 | 0.25 | -210 | -1 | 0 | -1 | 0 | 14 | 0.80 | L | -0.3u |
| 2026-06-07 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -0.5u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | +158 | 1 | 0 | 1 | 2 | -5 | -1.30 | L | -0.5u |
| 2026-06-07 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.9u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -105 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-07 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | -1 | 0.00 | L | -5.0u |
| 2026-06-07 | MLB | SPREAD | away | 4.5 | 3.00 | -152 | 2 | 0 | 2 | 1 | 43 | -0.50 | W | +1.9u |
| 2026-06-07 | MLB | TOTAL | over | 5.0 | 2.25 | -114 | 1 | 1 | 2 | 1 | -11 | 0.00 | L | -2.3u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | +102 | 1 | 0 | 1 | -3 | 8 | -0.20 | W | +0.5u |
| 2026-06-07 | MLB | SPREAD | away | 4.5 | 2.25 | +164 | 1 | 1 | 2 | 1 | 12 | 29.50 | W | +3.7u |
| 2026-06-07 | MLB | ML | away | 2.5 | 0.25 | +103 | -1 | 0 | -1 | -1 | 12 | 0.20 | W | +0.3u |
| 2026-06-07 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | -1 | 0 | 1 | 28 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -102 | 2 | 0 | 2 | -1 | -12 | 0.50 | W | +1.0u |
| 2026-06-07 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | -1 | 11 | 0.00 | W | +4.8u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | -127 | 0 | 1 | 1 | -2 | 9 | -1.90 | W | +0.4u |
| 2026-06-07 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | -2 | 0.00 | W | +0.5u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -113 | 6 | 1 | 7 | 5 | 57 | -0.50 | L | -3.0u |
| 2026-06-08 | MLB | ML | home | 4.5 | 3.00 | -129 | 3 | 0 | 3 | 1 | 32 | -0.40 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | -1 | -15 | 0.00 | L | -3.0u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -121 | 1 | 1 | 2 | -1 | -3 | -1.60 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 61 | 0.00 | P | +0.0u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -146 | 1 | 0 | 1 | -1 | -7 | -0.50 | W | +2.0u |
| 2026-06-08 | MLB | ML | home | 4.0 | 1.00 | -118 | 2 | 0 | 2 | 1 | -66 | -0.40 | L | -1.0u |
| 2026-06-08 | MLB | TOTAL | over | 4.5 | 2.50 | -116 | -2 | -2 | -4 | -2 | 22 | 0.00 | W | +2.5u |
| 2026-06-08 | MLB | ML | away | 4.5 | 1.50 | +151 | 0 | -1 | -1 | 0 | 14 | 0.00 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | under | 5.0 | 2.50 | +101 | 0 | 0 | 0 | -1 | -17 | 0.00 | W | +2.5u |
| 2026-06-08 | NBA | ML | home | 2.5 | 0.25 | -132 | 5 | 2 | 7 | 3 | 6 | -0.40 | L | -0.3u |
| 2026-06-08 | NBA | SPREAD | away | 5.0 | 5.00 | -110 | 3 | 2 | 5 | 2 | 4 | -1.30 | W | +4.3u |
| 2026-06-08 | NBA | TOTAL | under | 4.0 | 1.00 | -107 | 1 | 0 | 1 | 3 | -1 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 2.5 | 0.25 | +132 | 1 | 0 | 1 | 3 | 36 | -1.20 | L | -0.3u |
| 2026-06-09 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 4 | 0.00 | W | +4.3u |
| 2026-06-09 | MLB | ML | away | 3.0 | 0.50 | -148 | 1 | 0 | 1 | 2 | 2 | 0.00 | L | -0.5u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 3 | 24 | 0.80 | L | -1.0u |
| 2026-06-09 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -143 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | SPREAD | home | 4.5 | 3.00 | -117 | 1 | 0 | 1 | 0 | 11 | 0.00 | W | +2.6u |
| 2026-06-09 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | -2 | 2 | 0.00 | W | +0.5u |
| 2026-06-09 | MLB | ML | away | 5.0 | 5.00 | -122 | 2 | 1 | 3 | 2 | 19 | 0.00 | W | +4.1u |
| 2026-06-09 | MLB | ML | away | 2.5 | 0.25 | -120 | 0 | 0 | 0 | -1 | -21 | 0.00 | L | -0.3u |
| 2026-06-09 | MLB | ML | home | 4.0 | 1.00 | -107 | 1 | 0 | 1 | -1 | 10 | -1.30 | L | -1.0u |
| 2026-06-09 | MLB | ML | home | 5.0 | 5.00 | -105 | 1 | -1 | 0 | 0 | 0 | 0.00 | W | +4.8u |
| 2026-06-09 | MLB | ML | away | 4.5 | 2.50 | +115 | 1 | 0 | 1 | -1 | -12 | -0.70 | L | -2.5u |
| 2026-06-09 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 7 | 0.00 | W | +2.7u |
| 2026-06-09 | MLB | ML | away | 3.0 | 0.50 | -116 | 1 | 0 | 1 | 2 | 31 | 0.00 | W | +0.4u |
| 2026-06-09 | MLB | ML | home | 5.0 | 2.50 | +100 | 4 | 2 | 6 | -1 | -12 | 0.00 | W | +2.5u |
| 2026-06-09 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | -1 | -7 | 0.00 | W | +4.5u |
| 2026-06-09 | MLB | ML | home | 4.0 | 1.00 | +102 | 2 | 0 | 2 | 2 | -9 | -1.20 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -119 | 1 | 0 | 1 | -1 | 26 | -0.80 | L | -1.0u |
| 2026-06-09 | NHL | SPREAD | away | 4.5 | 1.00 | +215 | 0 | 0 | 0 | 2 | 11 | 41.70 | W | +2.1u |
| 2026-06-09 | NHL | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 2 | 13 | 0.00 | L | -5.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 9 | 0.00 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 4.5 | 3.00 | -148 | 0 | 0 | 0 | 0 | 31 | -0.50 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | +136 | 3 | 0 | 3 | 4 | 24 | -1.10 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | W | +0.9u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | -172 | 1 | 0 | 1 | 1 | 0 | -1.00 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | W | +4.5u |
| 2026-06-10 | MLB | ML | away | 3.0 | 0.50 | +136 | 0 | 0 | 0 | -2 | 6 | 0.00 | L | -0.5u |
| 2026-06-10 | MLB | TOTAL | under | 4.0 | 1.00 | -113 | 1 | 0 | 1 | 1 | 12 | 0.00 | L | -1.0u |
| 2026-06-10 | MLB | ML | home | 2.5 | 0.25 | -117 | 0 | 0 | 0 | 2 | 18 | 0.00 | W | +0.2u |
| 2026-06-10 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 0 | 0.00 | L | -5.0u |
| 2026-06-10 | MLB | ML | home | 4.0 | 1.00 | +178 | 1 | 0 | 1 | -2 | 37 | -1.40 | W | +1.7u |
| 2026-06-10 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 3 | 0 | 3 | -1 | -12 | 0.00 | W | +4.5u |
| 2026-06-10 | MLB | ML | away | 5.0 | 5.00 | -104 | 0 | 0 | 0 | 1 | 21 | -0.20 | L | -5.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | +148 | 0 | 0 | 0 | -1 | 10 | -0.80 | W | +1.5u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 26 | 0.00 | W | +2.7u |
| 2026-06-10 | MLB | ML | home | 4.5 | 2.50 | +103 | 0 | 0 | 0 | 1 | 10 | 0.00 | W | +2.6u |
| 2026-06-10 | MLB | ML | home | 4.0 | 1.00 | -127 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 27 | 0.00 | W | +3.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | -120 | 1 | 0 | 1 | 0 | 0 | -0.40 | W | +0.8u |
| 2026-06-10 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | -1 | 0 | -1 | 1 | 21 | 0.00 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 5.0 | 5.00 | -106 | 1 | 0 | 1 | -2 | 22 | -0.70 | L | -5.0u |
| 2026-06-10 | MLB | SPREAD | home | 2.5 | 1.00 | -190 | 0 | 0 | 0 | 0 | -16 | -31.40 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 4 | 1 | 5 | -1 | -4 | 0.00 | L | -5.0u |
| 2026-06-10 | NBA | ML | away | 2.5 | 0.25 | +112 | -2 | 0 | -2 | -3 | -11 | 0.20 | L | -0.3u |
| 2026-06-10 | NBA | TOTAL | under | 2.5 | 0.25 | -108 | 4 | 1 | 5 | 3 | 9 | 0.00 | W | +0.2u |
| 2026-06-11 | MLB | ML | away | 4.0 | 1.00 | +112 | 0 | 0 | 0 | 0 | 21 | 0.00 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -120 | -1 | 0 | -1 | 4 | -3 | -1.70 | P | +0.0u |
| 2026-06-11 | MLB | SPREAD | away | 4.5 | 2.50 | +140 | 1 | 0 | 1 | 2 | 2 | -1.00 | P | +0.0u |
| 2026-06-11 | MLB | ML | home | 5.0 | 5.00 | — | 1 | 0 | 1 | 1 | -2 | 0.00 | L | -5.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -167 | 1 | -1 | 0 | 0 | 32 | -0.10 | W | +0.3u |
| 2026-06-11 | MLB | TOTAL | under | 5.0 | 1.00 | -108 | 1 | 1 | 2 | 0 | -23 | 0.00 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 5.0 | 1.00 | +110 | 3 | 1 | 4 | 2 | -14 | -0.90 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -111 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-11 | MLB | ML | home | 5.0 | 5.00 | -131 | 2 | 1 | 3 | -1 | -12 | 0.00 | W | +3.8u |
| 2026-06-11 | MLB | ML | away | 4.0 | 1.00 | +100 | 1 | 0 | 1 | 1 | -33 | -0.50 | W | +1.0u |
| 2026-06-11 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | -1 | -2 | -2 | 14 | 0.00 | W | +0.2u |
| 2026-06-11 | NHL | TOTAL | under | 3.0 | 0.50 | -104 | 2 | 0 | 2 | 3 | 14 | 0.00 | P | +0.0u |
| 2026-06-12 | MLB | ML | home | 5.0 | 5.00 | -114 | 0 | 0 | 0 | -1 | -12 | 0.00 | W | +4.4u |
| 2026-06-12 | MLB | ML | home | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | -22 | 0.00 | L | -3.0u |
| 2026-06-12 | MLB | TOTAL | over | 4.0 | 1.00 | +100 | 0 | 0 | 0 | 0 | 1 | 0.00 | L | -1.0u |
| 2026-06-12 | MLB | ML | home | 3.0 | 0.50 | -210 | 2 | 0 | 2 | 1 | -10 | -0.10 | W | +0.2u |
| 2026-06-12 | MLB | ML | away | 2.5 | 0.25 | +111 | 3 | 1 | 4 | 2 | -14 | -0.70 | L | -0.3u |
| 2026-06-12 | MLB | ML | away | 4.0 | 1.00 | -114 | 2 | 0 | 2 | 1 | -1 | -1.20 | W | +0.9u |
| 2026-06-12 | MLB | ML | home | 5.0 | 2.50 | +123 | 0 | 1 | 1 | 0 | 3 | 0.00 | W | +3.1u |
| 2026-06-12 | MLB | SPREAD | away | 4.0 | 1.00 | +121 | 0 | 0 | 0 | 2 | 33 | 0.40 | L | -1.0u |
| 2026-06-12 | MLB | ML | home | 4.5 | 3.00 | -138 | 1 | 0 | 1 | -1 | 10 | -1.00 | L | -3.0u |
| 2026-06-12 | MLB | SPREAD | home | 3.0 | 0.50 | -107 | 2 | 0 | 2 | 2 | 11 | -0.40 | W | +0.4u |
| 2026-06-12 | MLB | ML | away | 2.5 | 0.25 | +118 | -1 | 0 | -1 | -2 | -30 | -0.20 | L | -0.3u |
| 2026-06-12 | MLB | ML | away | 4.0 | 1.00 | -136 | 2 | 0 | 2 | 1 | -10 | -1.30 | W | +0.7u |
| 2026-06-12 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | -1 | -1 | 0 | 3 | 0.00 | W | +2.7u |
| 2026-06-12 | MLB | ML | home | 3.0 | 0.50 | -134 | 2 | 0 | 2 | 2 | 2 | -1.10 | W | +0.4u |
| 2026-06-12 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +2.7u |
| 2026-06-12 | MLB | SPREAD | away | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 0 | 31 | -1.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | away | 5.0 | 5.00 | -128 | 3 | 0 | 3 | -1 | 35 | -0.20 | L | -5.0u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | +123 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | away | 4.5 | 3.00 | -102 | 0 | 0 | 0 | 1 | 21 | -2.00 | W | +2.9u |
| 2026-06-13 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 0 | 7 | 0.00 | W | +4.5u |
| 2026-06-13 | MLB | ML | away | 2.5 | 0.25 | -118 | 0 | 0 | 0 | -3 | 10 | -1.30 | W | +0.2u |
| 2026-06-13 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +2.7u |
| 2026-06-13 | MLB | ML | away | 4.5 | 2.50 | +136 | 1 | 0 | 1 | -1 | 7 | 1.30 | L | -2.5u |
| 2026-06-13 | MLB | ML | home | 5.0 | 2.50 | +134 | 2 | 0 | 2 | -2 | -14 | 0.00 | W | +3.4u |
| 2026-06-13 | MLB | SPREAD | home | 4.0 | 1.00 | -130 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.8u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | -120 | 1 | 0 | 1 | 2 | 11 | 0.20 | W | +0.8u |
| 2026-06-13 | MLB | ML | away | 4.5 | 2.50 | +114 | 1 | 0 | 1 | 0 | 9 | 0.00 | L | -2.5u |
| 2026-06-13 | MLB | TOTAL | under | 4.0 | 1.00 | +101 | 0 | 0 | 0 | 0 | 1 | 0.00 | W | +1.0u |
| 2026-06-13 | MLB | ML | home | 4.5 | 3.00 | -157 | 0 | 0 | 0 | -2 | -7 | 0.00 | L | -3.0u |
| 2026-06-13 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 43 | 0.00 | W | +0.5u |
| 2026-06-13 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | -2 | 14 | -0.40 | W | +4.3u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | -106 | 0 | 0 | 0 | 1 | 21 | 0.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | home | 4.0 | 1.00 | -112 | 0 | 0 | 0 | 2 | 11 | -1.30 | W | +0.8u |
| 2026-06-13 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 14 | 0.00 | L | -5.0u |
| 2026-06-13 | NBA | ML | home | 2.5 | 0.25 | -205 | 6 | 6 | 12 | 6 | -27 | 0.60 | L | -0.3u |
| 2026-06-14 | MLB | ML | away | 4.0 | 1.00 | +106 | 1 | 1 | 2 | 3 | 2 | -1.50 | L | -1.0u |
| 2026-06-14 | MLB | ML | home | 2.5 | 0.25 | -124 | 1 | 0 | 1 | 3 | 7 | -1.50 | W | +0.2u |
| 2026-06-14 | MLB | SPREAD | away | 5.0 | 5.00 | -180 | 1 | 0 | 1 | 0 | -3 | 0.00 | L | -5.0u |
| 2026-06-14 | MLB | ML | home | 5.0 | 5.00 | -192 | 1 | 0 | 1 | 1 | 0 | 0.00 | L | -5.0u |
| 2026-06-14 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | ML | away | 4.5 | 2.50 | +106 | 0 | 0 | 0 | 1 | 21 | 0.00 | L | -2.5u |
| 2026-06-14 | MLB | SPREAD | away | 4.5 | 3.00 | -116 | 2 | 0 | 2 | 2 | -1 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | SPREAD | away | 4.0 | 1.00 | -158 | 1 | -1 | 0 | 1 | 43 | 0.10 | W | +0.6u |
| 2026-06-14 | MLB | ML | away | 4.0 | 1.00 | -125 | 2 | 1 | 3 | 3 | 7 | -1.20 | W | +0.8u |
| 2026-06-14 | MLB | ML | away | 4.5 | 3.00 | -101 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | ML | away | 2.5 | 0.25 | -115 | 2 | 0 | 2 | 2 | 2 | 0.00 | W | +0.2u |
| 2026-06-14 | NHL | ML | away | 2.5 | 0.25 | -115 | -1 | 1 | 0 | 1 | -5 | -0.20 | W | +0.2u |
| 2026-06-14 | NHL | TOTAL | under | 5.0 | 5.00 | -110 | -1 | 0 | -1 | 1 | 5 | 0.00 | W | +4.4u |
| 2026-06-15 | MLB | ML | home | 4.0 | 1.00 | -204 | 1 | 0 | 1 | 0 | 0 | -0.60 | W | +0.0u |
| 2026-06-15 | MLB | SPREAD | away | 4.5 | 3.00 | -114 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +2.9u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | SPREAD | home | 4.0 | 1.00 | +153 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-15 | MLB | TOTAL | over | 4.5 | 2.50 | -110 | 0 | 0 | 0 | 0 | 1 | 0.00 | W | +0.0u |
| 2026-06-15 | MLB | ML | away | 3.0 | 0.50 | +115 | 2 | 0 | 2 | 2 | 25 | -0.80 | L | -0.5u |
| 2026-06-15 | MLB | ML | away | 3.0 | 0.50 | +160 | 2 | 0 | 2 | 0 | 33 | -0.70 | L | -0.5u |
| 2026-06-15 | MLB | SPREAD | away | 2.5 | 0.25 | -120 | 0 | 0 | 0 | -1 | -4 | 0.00 | L | -0.3u |
| 2026-06-15 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 1 | 44 | 0.00 | L | -3.0u |
| 2026-06-15 | MLB | ML | home | 2.5 | 0.25 | -157 | 1 | 0 | 1 | 2 | -12 | -0.20 | L | -0.3u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | ML | home | 3.0 | 0.50 | -132 | 3 | 1 | 4 | 3 | 7 | -0.70 | W | +2.2u |
| 2026-06-15 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | ML | home | 3.0 | 0.50 | -154 | 1 | 0 | 1 | 3 | -8 | 0.50 | W | +0.0u |
| 2026-06-15 | MLB | SPREAD | away | 5.0 | 5.00 | -160 | 1 | 0 | 1 | 1 | 13 | -1.30 | L | -5.0u |
| 2026-06-15 | MLB | ML | home | 2.5 | 0.25 | -161 | -1 | 1 | 0 | -3 | -1 | -1.00 | W | +0.0u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 5 | 0.00 | L | -1.0u |
| 2026-06-15 | SOC | ML | home | 2.5 | 0.25 | -105 | 3 | 3 | 6 | 1 | -5 | -1.10 | L | -0.3u |
| 2026-06-16 | MLB | ML | home | 4.0 | 1.00 | -145 | 1 | 0 | 1 | -1 | -10 | -1.00 | W | +0.0u |
| 2026-06-16 | MLB | SPREAD | away | 4.5 | 1.00 | -162 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | TOTAL | under | 5.0 | 5.00 | -101 | 1 | 0 | 1 | 1 | 7 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -194 | 1 | 0 | 1 | -1 | 24 | 0.40 | L | -3.0u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 31 | 0.00 | L | -3.0u |
| 2026-06-16 | MLB | SPREAD | home | 4.0 | 1.00 | +156 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -163 | 5 | 3 | 8 | 3 | 24 | -1.00 | W | +2.4u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | -1 | 0 | -1 | -2 | -24 | 0.00 | L | -3.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -135 | 3 | 2 | 5 | 0 | -4 | -2.10 | W | +4.5u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 9 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | away | 2.5 | 0.25 | -106 | 1 | 0 | 1 | 1 | 10 | -0.20 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -174 | 2 | 1 | 3 | 2 | 24 | -1.40 | W | +2.3u |
| 2026-06-16 | MLB | ML | away | 4.0 | 1.00 | -116 | 0 | 0 | 0 | -1 | 2 | -0.80 | L | -1.0u |
| 2026-06-16 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 3 | 38 | 0.00 | L | -5.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -138 | 0 | 0 | 0 | -1 | -12 | 0.70 | L | -0.5u |
| 2026-06-16 | MLB | ML | away | 3.0 | 0.50 | -102 | 1 | 0 | 1 | 0 | 0 | -1.00 | L | -0.5u |
| 2026-06-16 | MLB | SPREAD | away | 4.0 | 1.00 | -160 | 0 | 0 | 0 | 2 | 25 | 30.10 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -161 | 1 | 1 | 2 | 0 | -23 | -0.40 | L | -0.5u |
| 2026-06-16 | MLB | ML | away | 5.0 | 2.50 | +120 | -1 | -1 | -2 | -1 | 23 | -1.80 | L | -2.5u |
| 2026-06-16 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 2 | 3 | 0.00 | L | -1.0u |
| 2026-06-16 | MLB | ML | away | 2.5 | 0.25 | -112 | 1 | 0 | 1 | 2 | 4 | -0.90 | W | +0.0u |
| 2026-06-16 | MLB | SPREAD | away | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-16 | SOC | ML | home | 4.0 | 1.00 | +1375 | 1 | 0 | 1 | -2 | -33 | 0.00 | L | -1.0u |
| 2026-06-17 | MLB | ML | away | 2.5 | 0.25 | +126 | -2 | 0 | -2 | -2 | -24 | -0.40 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +2.7u |
| 2026-06-17 | MLB | ML | away | 4.5 | 2.50 | +112 | -1 | -1 | -2 | -2 | 11 | -1.20 | L | -2.5u |
| 2026-06-17 | MLB | ML | home | 5.0 | 5.00 | -173 | 1 | 0 | 1 | 0 | -19 | 0.00 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +2.7u |
| 2026-06-17 | MLB | ML | away | 5.0 | 2.50 | +100 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +2.5u |
| 2026-06-17 | MLB | ML | home | 4.5 | 2.50 | +115 | 1 | 0 | 1 | 0 | 11 | 0.00 | L | -2.5u |
| 2026-06-17 | MLB | SPREAD | home | 4.5 | 3.00 | -141 | 0 | 0 | 0 | 1 | 21 | 0.00 | L | -3.0u |
| 2026-06-17 | MLB | SPREAD | away | 5.0 | 5.00 | -181 | 0 | 0 | 0 | 1 | 13 | -0.80 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 2 | 9 | 0.00 | L | -5.0u |
| 2026-06-17 | MLB | ML | home | 2.5 | 0.25 | -157 | 0 | 0 | 0 | 1 | 21 | -1.10 | W | +0.0u |
| 2026-06-17 | MLB | SPREAD | home | 2.5 | 0.25 | +125 | -1 | 0 | -1 | 0 | 21 | -0.60 | L | -0.3u |
| 2026-06-17 | MLB | ML | home | 5.0 | 5.00 | -123 | 1 | 0 | 1 | 0 | 17 | 0.00 | L | -5.0u |
| 2026-06-17 | MLB | SPREAD | home | 4.0 | 1.00 | +161 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-17 | SOC | ML | away | 5.0 | 1.00 | +1028 | 1 | 0 | 1 | -5 | -44 | 0.00 | L | -1.0u |
| 2026-06-17 | SOC | ML | home | 4.0 | 1.00 | -140 | 0 | 0 | 0 | 0 | 8 | -0.30 | W | +0.0u |
| 2026-06-17 | SOC | ML | home | 4.0 | 1.00 | +142 | 1 | 0 | 1 | 3 | -23 | 0.00 | W | +0.0u |
| 2026-06-18 | MLB | ML | home | 4.0 | 1.00 | -138 | 1 | 0 | 1 | 1 | 2 | 0.00 | W | +0.0u |
| 2026-06-18 | MLB | ML | home | 4.5 | 3.00 | -141 | 1 | 1 | 2 | 0 | 11 | -1.30 | L | -3.0u |
| 2026-06-18 | MLB | ML | home | 4.5 | 3.00 | -151 | 3 | 0 | 3 | 3 | 25 | -1.50 | W | +0.0u |
| 2026-06-18 | MLB | ML | away | 4.5 | 2.50 | +108 | 3 | 1 | 4 | 5 | 10 | -1.20 | W | +2.6u |
| 2026-06-18 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 31 | 0.00 | W | +2.7u |
| 2026-06-18 | MLB | SPREAD | away | 4.5 | 3.00 | -199 | 1 | 0 | 1 | 2 | 3 | 0.00 | L | -3.0u |
| 2026-06-18 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 3 | 9 | 0.00 | W | +2.8u |
| 2026-06-18 | SOC | ML | home | 5.0 | 2.50 | +113 | 2 | 0 | 2 | 4 | -1 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | ML | home | 4.5 | 3.00 | -205 | 1 | 0 | 1 | 2 | 16 | 0.10 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 4.5 | 3.00 | -114 | 0 | 0 | 0 | 2 | 33 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 5.0 | 5.00 | -194 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 3.0 | 0.50 | -117 | 0 | 0 | 0 | 0 | 1 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | ML | away | 4.5 | 1.00 | +239 | 1 | 0 | 1 | 0 | -19 | 0.00 | L | -1.0u |
| 2026-06-19 | MLB | SPREAD | home | 4.5 | 3.00 | -111 | 1 | 1 | 2 | 0 | 10 | 0.00 | W | +3.1u |
| 2026-06-19 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 1 | 0 | 0.00 | L | -3.0u |
| 2026-06-19 | MLB | ML | away | 4.0 | 1.00 | +107 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -1.0u |
| 2026-06-19 | MLB | SPREAD | away | 4.0 | 1.00 | -115 | 2 | 0 | 2 | 3 | 45 | 0.00 | W | +2.5u |
| 2026-06-19 | MLB | ML | away | 4.5 | 2.50 | +141 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -2.5u |
| 2026-06-19 | MLB | ML | home | 2.5 | 0.25 | +158 | -1 | -1 | -2 | 0 | -11 | -1.10 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 4.5 | 2.50 | -101 | 0 | -1 | -1 | -1 | 21 | -0.70 | L | -2.5u |
| 2026-06-19 | MLB | ML | home | 4.5 | 3.00 | -163 | -1 | -1 | -2 | -2 | 31 | -0.40 | W | +2.4u |
| 2026-06-19 | MLB | SPREAD | home | 4.5 | 2.50 | +130 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -5.0u |
| 2026-06-19 | MLB | ML | home | 3.0 | 0.50 | -152 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | home | 2.5 | 0.25 | +147 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.3u |
| 2026-06-19 | MLB | ML | home | 5.0 | 1.00 | -109 | 1 | 0 | 1 | 1 | -9 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 31 | 0.00 | L | -3.0u |
| 2026-06-19 | MLB | SPREAD | home | 2.5 | 0.25 | +170 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.3u |
| 2026-06-19 | SOC | ML | away | 3.0 | 0.50 | +2500 | 0 | 0 | 0 | -4 | -30 | 0.00 | L | -0.5u |
| 2026-06-19 | SOC | ML | home | 4.5 | 2.50 | +108 | 1 | 0 | 1 | 5 | 31 | -2.40 | L | -2.5u |
| 2026-06-20 | MLB | SPREAD | away | 5.0 | 5.00 | -194 | 0 | 0 | 0 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | ML | home | 4.5 | 3.00 | -200 | -2 | 0 | -2 | -2 | 3 | -1.30 | L | -3.0u |
| 2026-06-20 | MLB | SPREAD | home | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 10 | 0.00 | L | -0.5u |
| 2026-06-20 | MLB | ML | away | 4.5 | 2.50 | +123 | 2 | 0 | 2 | 2 | -4 | -3.20 | L | -2.5u |
| 2026-06-20 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | 1 | 0 | 0 | 11 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | -1 | 0.00 | W | +1.8u |
| 2026-06-20 | MLB | ML | away | 3.0 | 0.50 | +116 | 0 | 0 | 0 | -1 | 0 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | -1 | 0 | -1 | -2 | -24 | 0.00 | L | -1.0u |
| 2026-06-20 | MLB | ML | home | 4.0 | 1.00 | -190 | 2 | 1 | 3 | 0 | -3 | -1.70 | W | +2.0u |
| 2026-06-20 | MLB | ML | home | 5.0 | 5.00 | -137 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +2.2u |
| 2026-06-20 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 10 | 0.00 | L | -0.5u |
| 2026-06-20 | SOC | ML | away | 2.5 | 0.25 | +474 | -3 | 0 | -3 | -20 | -61 | 0.00 | L | -0.3u |
| 2026-06-20 | SOC | ML | away | 2.5 | 0.25 | +2200 | 0 | 0 | 0 | -1 | -12 | -0.20 | L | -0.3u |
| 2026-06-21 | MLB | ML | home | 4.0 | 1.00 | -226 | 1 | 0 | 1 | 0 | 14 | 0.30 | L | -1.0u |
| 2026-06-21 | MLB | SPREAD | away | 5.0 | 5.00 | -190 | 0 | 0 | 0 | 1 | 13 | -0.50 | L | -5.0u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 2.50 | +100 | 1 | 1 | 2 | 0 | 22 | 0.00 | W | +2.5u |
| 2026-06-21 | MLB | ML | home | 4.0 | 1.00 | -104 | -1 | 0 | -1 | 0 | -21 | -0.50 | L | -1.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-21 | MLB | ML | away | 5.0 | 2.50 | +113 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -2.5u |
| 2026-06-21 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | 8 | 0.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 1 | 21 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-21 | MLB | ML | away | 2.5 | 0.25 | +110 | 0 | 0 | 0 | -1 | -10 | -1.00 | W | +0.0u |
| 2026-06-21 | MLB | SPREAD | home | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 1 | 10 | -1.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | ML | home | 4.5 | 3.00 | -178 | 3 | 0 | 3 | 3 | 74 | -1.30 | W | +1.6u |
| 2026-06-21 | MLB | ML | home | 3.0 | 0.50 | +130 | 0 | 0 | 0 | -1 | -12 | -0.80 | L | -0.5u |
| 2026-06-21 | MLB | ML | home | 3.0 | 0.50 | +123 | 1 | 0 | 1 | 0 | 0 | -0.20 | W | +0.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | -1 | -12 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | SPREAD | away | 5.0 | 2.50 | +130 | 0 | 0 | 0 | 1 | 13 | -1.30 | W | +0.0u |
| 2026-06-21 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 2 | 0 | 2 | 2 | 29 | 0.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 1.00 | -114 | 1 | 1 | 2 | 1 | -26 | 0.00 | W | +0.0u |
| 2026-06-21 | SOC | ML | away | 4.5 | 1.00 | +725 | 2 | 0 | 2 | -5 | -64 | 0.00 | L | -1.0u |
| 2026-06-21 | SOC | ML | home | 4.0 | 1.00 | +650 | 2 | 0 | 2 | 1 | -4 | -0.20 | L | -1.0u |
| 2026-06-21 | SOC | ML | draw | 3.0 | 0.50 | +950 | 0 | 0 | 0 | -9 | -44 | 0.00 | L | -0.5u |
| 2026-06-22 | MLB | ML | home | 4.5 | 3.00 | -138 | 0 | 0 | 0 | 0 | 9 | 0.30 | W | +0.0u |
| 2026-06-22 | MLB | SPREAD | away | 5.0 | 5.00 | -168 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 1.00 | +105 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -1.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 12 | 0.00 | L | -3.0u |
| 2026-06-22 | MLB | SPREAD | away | 5.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 16 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +2.7u |
| 2026-06-22 | MLB | ML | home | 5.0 | 5.00 | -124 | 1 | 0 | 1 | 1 | 9 | -1.20 | W | +2.3u |
| 2026-06-22 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 3 | 0 | 3 | 3 | 41 | 0.00 | W | +2.7u |
| 2026-06-22 | MLB | ML | home | 3.0 | 0.50 | -180 | 1 | 0 | 1 | 0 | 0 | -1.30 | L | -0.5u |
| 2026-06-22 | MLB | ML | home | 5.0 | 2.50 | +133 | 0 | 0 | 0 | 0 | -14 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | ML | home | 5.0 | 2.50 | +137 | 0 | 0 | 0 | 0 | -14 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | SPREAD | home | 4.5 | 1.00 | -109 | 0 | 0 | 0 | -1 | 7 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | SPREAD | away | 4.5 | 2.50 | +138 | 2 | 0 | 2 | 1 | 44 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | TOTAL | under | 4.0 | 1.00 | -104 | 2 | 1 | 3 | 2 | 17 | 0.00 | W | +3.9u |
| 2026-06-22 | MLB | ML | away | 5.0 | 5.00 | — | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -5.0u |
| 2026-06-22 | SOC | ML | draw | 4.5 | 1.00 | +350 | -1 | 0 | -1 | -16 | -58 | -0.70 | L | -1.0u |
| 2026-06-22 | SOC | ML | home | 2.5 | 0.25 | -950 | 1 | 0 | 1 | 8 | 57 | 0.00 | W | +0.0u |
| 2026-06-22 | SOC | ML | home | 4.5 | 2.50 | +139 | 1 | 0 | 1 | 9 | 47 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | home | 3.0 | 0.50 | -109 | 0 | 0 | 0 | -1 | -12 | -1.80 | L | -0.5u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 5.00 | -168 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | -2 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -108 | 2 | 0 | 2 | 3 | 4 | -1.40 | L | -3.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -133 | 1 | 0 | 1 | 3 | 23 | -1.40 | L | -3.0u |
| 2026-06-23 | MLB | SPREAD | away | 3.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -0.5u |
| 2026-06-23 | MLB | ML | away | 3.0 | 0.50 | -162 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | SPREAD | home | 4.0 | 1.00 | -107 | 0 | 0 | 0 | 0 | -31 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 5.00 | -114 | 0 | 0 | 0 | -1 | -34 | 0.00 | L | -5.0u |
| 2026-06-23 | MLB | ML | home | 2.5 | 0.25 | -125 | 1 | 0 | 1 | 0 | -30 | -1.90 | L | -0.3u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 1.00 | -102 | 1 | 2 | 3 | 1 | 3 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -172 | 1 | 0 | 1 | 1 | -10 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 1.00 | -109 | 2 | 0 | 2 | 1 | -2 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 2.50 | +132 | 1 | 0 | 1 | 1 | -10 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | ML | home | 5.0 | 2.50 | +104 | 1 | 0 | 1 | 1 | -9 | 0.00 | L | -2.5u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | 13 | 0.00 | L | -5.0u |
| 2026-06-23 | MLB | ML | away | 4.0 | 1.00 | +117 | 1 | 0 | 1 | 1 | 12 | -0.20 | L | -1.0u |
| 2026-06-23 | MLB | SPREAD | away | 2.5 | 0.25 | +106 | 1 | 0 | 1 | 0 | 44 | -1.50 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | -1 | -21 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | home | 4.5 | 1.00 | -153 | 2 | 0 | 2 | 2 | 22 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | SPREAD | home | 3.0 | 0.50 | +139 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 4.5 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-23 | SOC | ML | home | 2.5 | 0.25 | -450 | 1 | 0 | 1 | 0 | 0 | 0.60 | L | -0.3u |
| 2026-06-23 | SOC | ML | away | 4.5 | 1.00 | +1800 | 1 | 0 | 1 | -4 | -21 | 0.00 | L | -1.0u |
| 2026-06-24 | MLB | SPREAD | away | 5.0 | 5.00 | -214 | 0 | 0 | 0 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 4.5 | 3.00 | -132 | 1 | 0 | 1 | 0 | 19 | -1.10 | L | -3.0u |
| 2026-06-24 | MLB | SPREAD | away | 4.0 | 1.00 | +155 | 1 | 0 | 1 | 1 | 21 | -0.30 | L | -1.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 3.0 | 0.50 | +110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-24 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -23 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 2.50 | +152 | 2 | 0 | 2 | 1 | 6 | -1.10 | W | +5.8u |
| 2026-06-24 | MLB | SPREAD | away | 5.0 | 5.00 | -105 | 0 | 0 | 0 | 1 | 13 | 0.00 | L | -5.0u |
| 2026-06-24 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | -1 | 0 | 3 | 4 | 0.00 | W | +3.6u |
| 2026-06-24 | MLB | ML | away | 4.5 | 2.50 | -134 | 1 | 0 | 1 | 2 | 7 | -0.20 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | -1 | -24 | 0.00 | L | -5.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 3.00 | -134 | 1 | 0 | 1 | 1 | -10 | -1.90 | L | -3.0u |
| 2026-06-24 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -8 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 3.0 | 0.50 | +132 | 0 | 0 | 0 | -1 | -12 | -2.20 | L | -0.5u |
| 2026-06-24 | MLB | SPREAD | home | 4.0 | 1.00 | -115 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -3.0u |
| 2026-06-24 | MLB | ML | away | 4.5 | 2.50 | +117 | 1 | 0 | 1 | 1 | 9 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 11 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 2.5 | 0.25 | -102 | -1 | 0 | -1 | -1 | 2 | -0.70 | W | +0.0u |
| 2026-06-24 | MLB | SPREAD | away | 4.0 | 1.00 | +136 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -1.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 2.50 | +108 | 0 | 0 | 0 | 0 | -22 | 0.00 | L | -2.5u |
| 2026-06-24 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -3.0u |
| 2026-06-24 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -0.5u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 1.00 | -115 | 2 | 0 | 2 | 2 | 24 | 0.00 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 4.0 | 1.00 | +153 | 3 | 0 | 3 | 2 | 35 | -1.10 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 4.5 | 3.00 | -525 | 4 | 1 | 5 | 2 | 69 | 0.50 | W | +1.1u |
| 2026-06-24 | SOC | ML | away | 4.5 | 3.00 | -104 | -1 | 0 | -1 | 2 | 36 | -1.00 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 2.5 | 0.25 | -257 | 2 | 0 | 2 | 2 | 24 | -1.10 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.0u |
| 2026-06-25 | MLB | SPREAD | away | 4.5 | 1.00 | +164 | 1 | 1 | 2 | 1 | 12 | 27.50 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 2 | 2 | 0.00 | W | +3.6u |
| 2026-06-25 | MLB | ML | away | 2.5 | 0.25 | -136 | 3 | 0 | 3 | 1 | -7 | -2.40 | L | -0.3u |
| 2026-06-25 | MLB | SPREAD | away | 5.0 | 2.50 | +114 | 2 | 0 | 2 | 1 | 0 | -1.90 | L | -2.5u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -116 | 0 | 0 | 0 | 0 | -5 | 0.00 | L | -3.0u |
| 2026-06-25 | MLB | ML | home | 4.5 | 1.00 | +443 | 1 | 0 | 1 | 1 | -12 | 0.00 | L | -1.0u |
| 2026-06-25 | MLB | SPREAD | away | 4.5 | 3.00 | -105 | 1 | 0 | 1 | 2 | 2 | 0.00 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 1 | 1 | -1 | -13 | 0.00 | L | -0.3u |
| 2026-06-25 | SOC | ML | home | 4.5 | 1.50 | +163 | -1 | 0 | -1 | -1 | 14 | 0.00 | L | -1.5u |
| 2026-06-25 | SOC | ML | away | 2.5 | 0.25 | -600 | 4 | 1 | 5 | 4 | 38 | -0.70 | W | +0.0u |
| 2026-06-25 | SOC | ML | away | 4.0 | 1.00 | -110 | 12 | 7 | 19 | 12 | 56 | -0.90 | L | -1.0u |
| 2026-06-25 | SOC | ML | away | 5.0 | 5.00 | -700 | 5 | 1 | 6 | 4 | 46 | 1.80 | W | +0.5u |
| 2026-06-25 | SOC | ML | away | 2.5 | 0.25 | -105 | 4 | 4 | 8 | 5 | 4 | -0.20 | L | -0.3u |
| 2026-06-26 | MLB | ML | away | 4.5 | 3.00 | -120 | 2 | 0 | 2 | 1 | -10 | -0.80 | W | +3.3u |
| 2026-06-26 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-26 | MLB | SPREAD | home | 2.5 | 0.25 | -117 | 0 | 1 | 1 | 0 | 19 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | 1 | 9 | 0.00 | L | -5.0u |
| 2026-06-26 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 5.0 | 2.50 | +100 | 0 | 0 | 0 | 0 | -6 | 0.00 | L | -2.5u |
| 2026-06-26 | MLB | SPREAD | home | 2.5 | 0.25 | -135 | 1 | 0 | 1 | 1 | 2 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | SPREAD | away | 4.5 | 3.00 | -204 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | home | 4.0 | 1.00 | -2261 | 0 | 0 | 0 | 0 | -14 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 2.5 | 0.25 | -154 | 0 | 0 | 0 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | SPREAD | away | 4.5 | 2.50 | +110 | 1 | 1 | 2 | 1 | 24 | 0.00 | L | -2.5u |
| 2026-06-26 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -10 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 1 | 13 | -1.00 | W | +0.0u |
| 2026-06-26 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -3.0u |
| 2026-06-26 | MLB | ML | away | 3.0 | 0.50 | +121 | 1 | 0 | 1 | 0 | 0 | -0.80 | L | -0.5u |
| 2026-06-26 | SOC | ML | away | 5.0 | 5.00 | -600 | 1 | 0 | 1 | 1 | 13 | -0.30 | W | +0.8u |
| 2026-06-26 | SOC | ML | away | 3.0 | 0.50 | -200 | 7 | 2 | 9 | 10 | 67 | -0.20 | W | +4.1u |
| 2026-06-26 | SOC | ML | away | 2.5 | 0.25 | -155 | 5 | 2 | 7 | 7 | 65 | 1.20 | W | +1.6u |
| 2026-06-26 | SOC | ML | home | 3.0 | 0.50 | +150 | 0 | 2 | 2 | -1 | 9 | -0.30 | L | -0.5u |
| 2026-06-26 | SOC | ML | home | 2.5 | 0.25 | -380 | -1 | 1 | 0 | 0 | 18 | 0.00 | W | +0.0u |
| 2026-06-26 | SOC | ML | home | 2.5 | 0.25 | +135 | -2 | 2 | 0 | -5 | -6 | -0.30 | L | -0.3u |
| 2026-06-27 | MLB | ML | away | 5.0 | 2.50 | +121 | 0 | 0 | 0 | 0 | -6 | 0.00 | L | -2.5u |
| 2026-06-27 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -1.0u |
| 2026-06-27 | MLB | ML | away | 4.0 | 1.00 | +116 | 0 | 0 | 0 | 1 | -48 | -0.70 | L | -1.0u |
| 2026-06-27 | MLB | ML | home | 2.5 | 0.25 | -155 | 0 | 2 | 2 | 0 | 16 | -0.80 | L | -0.3u |
| 2026-06-27 | MLB | ML | away | 2.5 | 0.25 | -112 | 3 | 1 | 4 | 4 | 44 | -0.90 | W | +3.6u |
| 2026-06-27 | MLB | ML | home | 4.5 | 3.00 | -134 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-06-27 | MLB | TOTAL | under | 2.5 | 0.25 | -104 | 4 | 1 | 5 | 4 | 0 | 0.00 | L | -0.3u |
| 2026-06-27 | MLB | ML | away | 5.0 | 2.50 | +114 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -2.5u |
| 2026-06-27 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -10 | 0.00 | W | +0.0u |
| 2026-06-27 | MLB | ML | home | 4.5 | 3.00 | -130 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-06-27 | MLB | SPREAD | away | 4.5 | 3.00 | -204 | 2 | 0 | 2 | 2 | 25 | -1.70 | W | +2.3u |
| 2026-06-27 | MLB | ML | away | 4.0 | 1.00 | -104 | 0 | 0 | 0 | 0 | 0 | -1.20 | L | -1.0u |
| 2026-06-27 | MLB | ML | home | 4.0 | 1.00 | -123 | 0 | 0 | 0 | -1 | -12 | 0.00 | W | +3.3u |
| 2026-06-27 | MLB | SPREAD | home | 4.5 | 1.50 | +154 | 1 | 0 | 1 | 1 | 9 | 0.00 | W | +0.0u |
| 2026-06-27 | MLB | TOTAL | over | 2.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 2 | 0.00 | L | -1.0u |
| 2026-06-27 | MLB | ML | away | 4.5 | 3.00 | -142 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-06-27 | MLB | ML | home | 4.5 | 3.00 | -178 | 3 | 0 | 3 | 2 | 18 | -0.10 | L | -3.0u |
| 2026-06-27 | MLB | SPREAD | home | 4.5 | 2.50 | +113 | 1 | 0 | 1 | 1 | -10 | 0.00 | L | -2.5u |
| 2026-06-27 | SOC | ML | away | 5.0 | 5.00 | -500 | 2 | 1 | 3 | 3 | 5 | 1.30 | W | +0.8u |
| 2026-06-27 | SOC | ML | draw | 2.5 | 0.25 | +109 | -1 | 0 | -1 | 0 | 22 | 1.40 | W | +0.0u |
| 2026-06-27 | SOC | ML | away | 5.0 | 5.00 | -575 | 4 | 1 | 5 | 5 | 35 | -0.10 | W | +0.8u |
| 2026-06-27 | SOC | ML | home | 2.5 | 0.25 | -122 | 1 | 3 | 4 | 4 | 18 | 1.00 | W | +2.5u |
| 2026-06-27 | SOC | ML | home | 3.0 | 0.50 | -125 | 2 | 1 | 3 | 3 | 18 | -1.00 | W | +3.3u |
| 2026-06-28 | MLB | ML | away | 4.5 | 1.00 | +337 | 0 | 0 | 0 | 0 | -3 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | SPREAD | home | 3.0 | 0.50 | -131 | 1 | 0 | 1 | 1 | 21 | -0.50 | W | +0.0u |
| 2026-06-28 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 2 | 0 | 2 | 2 | 16 | 0.00 | W | +1.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 2 | 1 | 3 | 2 | 2 | 0.00 | W | +3.6u |
| 2026-06-28 | MLB | SPREAD | away | 4.5 | 3.00 | -180 | 1 | 0 | 1 | 1 | 9 | -0.30 | L | -3.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 2 | 0 | 2 | 2 | 2 | 0.00 | L | -2.5u |
| 2026-06-28 | MLB | ML | home | 2.5 | 0.25 | -103 | 1 | 0 | 1 | 1 | 20 | 0.20 | L | -0.3u |
| 2026-06-28 | MLB | SPREAD | home | 4.5 | 1.00 | -155 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | -10 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | ML | home | 4.5 | 2.50 | +122 | 0 | 0 | 0 | 0 | -3 | 0.00 | L | -2.5u |
| 2026-06-28 | MLB | SPREAD | home | 3.0 | 0.50 | -149 | 1 | 0 | 1 | 1 | 21 | -0.20 | L | -0.5u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 1 | 0.00 | W | +0.0u |
| 2026-06-28 | MLB | ML | away | 3.0 | 0.50 | +108 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -0.5u |
| 2026-06-28 | MLB | SPREAD | away | 4.0 | 1.00 | -168 | 0 | 0 | 0 | 2 | 25 | 0.00 | W | +2.1u |
| 2026-06-28 | MLB | ML | away | 4.5 | 1.00 | -101 | 4 | 0 | 4 | 4 | 11 | -0.70 | L | -1.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 3.00 | -104 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -3.0u |
| 2026-06-28 | MLB | ML | away | 4.5 | 3.00 | +1210 | 3 | 1 | 4 | 3 | 8 | -1.20 | L | -3.0u |
| 2026-06-28 | MLB | ML | away | 4.5 | 3.00 | -158 | 0 | 0 | 0 | 0 | -3 | 0.00 | W | +0.0u |
| 2026-06-28 | MLB | SPREAD | away | 4.5 | 1.00 | +119 | 1 | 0 | 1 | 1 | 9 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-28 | MLB | ML | away | 3.0 | 0.50 | -103 | 1 | 0 | 1 | 1 | 21 | -1.20 | L | -0.5u |
| 2026-06-28 | MLB | ML | away | 4.0 | 1.00 | +115 | 1 | 0 | 1 | 1 | 9 | -1.10 | W | +4.4u |
| 2026-06-28 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | -1 | -1 | -1 | 7 | 0.00 | L | -0.5u |
| 2026-06-28 | MLB | SPREAD | away | 3.0 | 0.50 | -124 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-28 | SOC | ML | away | 5.0 | 5.00 | -142 | 12 | 3 | 15 | 16 | 85 | -0.50 | W | +0.7u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | -128 | 0 | 1 | 1 | 1 | -9 | -1.50 | W | +0.0u |
| 2026-06-29 | MLB | SPREAD | home | 2.5 | 0.25 | +139 | 0 | 0 | 0 | 1 | 12 | 0.00 | W | +0.0u |
| 2026-06-29 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 0 | 1 | 0.00 | L | -0.5u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | 9 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | SPREAD | away | 2.5 | 0.25 | -176 | 1 | 0 | 1 | 1 | 12 | 0.00 | W | +0.0u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -105 | 1 | 0 | 1 | 0 | 2 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | ML | away | 3.0 | 0.50 | +193 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-29 | MLB | SPREAD | away | 3.0 | 0.50 | -119 | 1 | 0 | 1 | -1 | -10 | 0.00 | L | -0.5u |
| 2026-06-29 | MLB | ML | away | 2.5 | 0.25 | -112 | 0 | 0 | 0 | 0 | -16 | -0.60 | W | +0.0u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | +129 | 1 | 0 | 1 | 1 | -23 | -0.50 | L | -0.3u |
| 2026-06-29 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 17 | 0.00 | W | +2.6u |
| 2026-06-29 | MLB | SPREAD | home | 2.5 | 0.25 | +171 | 1 | 0 | 1 | 1 | 12 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | ML | away | 4.0 | 1.00 | +100 | 2 | 0 | 2 | 4 | 5 | 0.00 | W | +0.0u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | -158 | 2 | 1 | 3 | 2 | 24 | -0.60 | W | +0.0u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 1 | 0 | 1 | 1 | -5 | 0.00 | W | +3.6u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | -131 | 1 | 0 | 1 | 1 | 12 | 0.00 | W | +3.0u |
| 2026-06-29 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | -1 | 0 | -1 | 0 | 1 | 0.00 | P | +0.0u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | 0 | -1 | -1 | -35 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | ML | away | 4.5 | 2.50 | +150 | 1 | 0 | 1 | 1 | -10 | -0.60 | L | -2.5u |
| 2026-06-29 | SOC | ML | home | 2.5 | 0.25 | -145 | 10 | 2 | 12 | 14 | 72 | -1.00 | W | +3.1u |
| 2026-06-29 | SOC | ML | home | 3.0 | 0.50 | -265 | 5 | 3 | 8 | 6 | 39 | 0.00 | L | -0.5u |
| 2026-06-30 | MLB | SPREAD | home | 3.0 | 1.00 | +123 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-30 | MLB | ML | away | 4.5 | 2.50 | +120 | 1 | 0 | 1 | 1 | 0 | -1.70 | W | +5.0u |
| 2026-06-30 | MLB | SPREAD | home | 2.5 | 0.25 | +135 | 0 | 0 | 0 | -1 | -12 | 0.00 | L | -0.3u |
| 2026-06-30 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 1 | 2 | 3 | 21 | 0.00 | W | +3.6u |
| 2026-06-30 | MLB | ML | home | 2.5 | 0.25 | -111 | 0 | 0 | 0 | 0 | -18 | -1.80 | L | -0.3u |
| 2026-06-30 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 5 | 2 | 7 | 5 | 30 | 0.00 | L | -3.0u |
| 2026-06-30 | MLB | ML | away | 4.5 | 1.50 | +163 | 3 | 0 | 3 | 3 | 17 | -1.20 | L | -1.5u |
| 2026-06-30 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | -1 | -1 | -2 | -1 | -1 | 0.00 | L | -0.5u |
| 2026-06-30 | MLB | ML | away | 3.0 | 0.50 | -172 | 3 | 0 | 3 | 3 | 39 | -0.10 | W | +0.0u |
| 2026-06-30 | MLB | SPREAD | away | 3.0 | 0.50 | -101 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-06-30 | MLB | ML | away | 3.0 | 0.50 | -128 | 1 | 1 | 2 | 3 | 21 | -1.30 | W | +3.0u |
| 2026-06-30 | MLB | ML | away | 4.0 | 1.00 | -109 | 1 | 0 | 1 | 0 | 18 | 0.00 | L | -1.0u |
| 2026-06-30 | MLB | ML | home | 3.0 | 0.50 | -201 | 1 | 1 | 2 | 2 | -26 | -1.80 | W | +0.0u |
| 2026-06-30 | MLB | SPREAD | away | 2.5 | 0.25 | -113 | 2 | -1 | 1 | 2 | -6 | -0.50 | L | -0.3u |
| 2026-06-30 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 3 | 5 | 0.00 | W | +0.9u |
| 2026-06-30 | MLB | ML | away | 5.0 | 2.50 | +133 | 0 | 0 | 0 | 1 | -9 | 0.00 | L | -2.5u |
| 2026-06-30 | MLB | SPREAD | home | 4.0 | 1.00 | +131 | 1 | 0 | 1 | 1 | 12 | 0.00 | W | +0.0u |
| 2026-06-30 | MLB | TOTAL | over | 4.0 | 1.00 | +103 | 0 | 1 | 1 | 2 | 15 | 0.00 | W | +4.5u |
| 2026-06-30 | MLB | ML | away | 4.5 | 3.00 | +100 | 1 | 0 | 1 | 2 | -7 | -0.20 | L | -3.0u |
| 2026-06-30 | MLB | ML | home | 4.5 | 3.00 | -141 | 2 | 0 | 2 | 2 | -3 | 0.00 | L | -3.0u |
| 2026-06-30 | MLB | SPREAD | away | 4.5 | 3.00 | -160 | 2 | 0 | 2 | 3 | 28 | -1.50 | W | +2.5u |
| 2026-06-30 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | -1 | 1 | 0 | 1 | -9 | 0.00 | L | -0.5u |
| 2026-06-30 | MLB | ML | away | 2.5 | 0.25 | -114 | 3 | 2 | 5 | 4 | 43 | -1.40 | W | +2.7u |
| 2026-06-30 | MLB | SPREAD | home | 2.5 | 0.25 | -145 | 0 | 0 | 0 | -1 | -12 | 1.10 | L | -0.3u |
| 2026-06-30 | MLB | ML | home | 4.5 | 2.50 | +110 | 1 | 0 | 1 | 1 | -9 | 0.00 | L | -2.5u |
| 2026-06-30 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 3 | 0 | 3 | 4 | 41 | 0.00 | W | +2.6u |
| 2026-06-30 | MLB | ML | away | 4.5 | 2.50 | +117 | 4 | 1 | 5 | 5 | 20 | -0.40 | W | +2.9u |
| 2026-06-30 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 2 | 0 | 2 | 0 | 6 | 0.00 | P | +0.0u |
| 2026-06-30 | SOC | ML | home | 3.0 | 0.50 | +129 | 3 | 2 | 5 | 5 | 34 | -1.00 | W | +3.1u |
| 2026-06-30 | SOC | ML | away | 2.5 | 0.25 | +105 | 7 | 4 | 11 | 7 | 41 | -0.80 | W | +4.6u |
| 2026-06-30 | SOC | ML | home | 5.0 | 5.00 | -350 | 6 | 3 | 9 | 7 | 33 | -0.50 | W | +0.3u |
| 2026-07-01 | MLB | ML | home | 4.5 | 3.00 | -160 | 7 | 4 | 11 | 7 | 25 | -1.70 | W | +3.7u |
| 2026-07-01 | MLB | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 2 | 5 | 2 | 13 | 0.00 | W | +2.6u |
| 2026-07-01 | MLB | ML | away | 4.0 | 1.00 | +123 | 1 | 0 | 1 | 1 | -8 | -0.90 | L | -1.0u |
| 2026-07-01 | MLB | ML | home | 5.0 | 5.00 | -134 | 3 | 1 | 4 | 3 | 3 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | SPREAD | away | 2.5 | 0.25 | -107 | 1 | 2 | 3 | 1 | 16 | -1.20 | L | -0.3u |
| 2026-07-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 1 | 12 | 0.00 | W | +0.9u |
| 2026-07-01 | MLB | SPREAD | home | 3.0 | 0.50 | -105 | -1 | -1 | -2 | -1 | 19 | 0.70 | W | +0.0u |
| 2026-07-01 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 21 | 0.00 | W | +0.0u |
| 2026-07-01 | MLB | ML | away | 4.0 | 1.00 | +119 | 4 | 0 | 4 | 4 | 26 | -1.00 | W | +4.9u |
| 2026-07-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | 3 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | ML | away | 2.5 | 0.25 | +124 | 2 | 1 | 3 | 3 | -30 | 0.00 | L | -0.3u |
| 2026-07-01 | MLB | SPREAD | away | 5.0 | 5.00 | -180 | 2 | 1 | 3 | 2 | 15 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | 1 | 12 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | ML | home | 5.0 | 5.00 | -130 | 0 | 0 | 0 | 0 | -5 | 0.00 | W | +0.0u |
| 2026-07-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -10 | 0.00 | W | +0.0u |
| 2026-07-01 | MLB | SPREAD | home | 3.0 | 0.50 | -127 | 0 | 0 | 0 | 0 | -16 | 0.00 | L | -0.5u |
| 2026-07-01 | MLB | ML | away | 2.5 | 0.25 | -102 | 5 | 3 | 8 | 5 | 14 | -0.70 | L | -0.3u |
| 2026-07-01 | MLB | ML | away | 4.5 | 2.50 | +128 | 1 | 0 | 1 | 1 | 6 | -0.90 | W | +0.0u |
| 2026-07-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 3 | 12 | 0.00 | L | -3.0u |
| 2026-07-01 | SOC | ML | draw | 3.0 | 0.50 | +230 | -3 | -1 | -4 | -6 | 13 | 0.00 | W | +2.3u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._