# Sharp Intel v6 — Full Analysis

_Auto-generated **6/27/2026, 10:21:15 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 874 shipped+graded picks · 2026-04-18 → 2026-06-26  (HC analyses scoped to post-cutover 2026-04-30, 762 picks)
**Headline:** 439-427-8 · WR 50.7% [47.4%–54.0%] vs 52.4% break-even · -33.5u flat (-3.8%) · -185.6u peak.
**Overall t-test:** t = -1.16 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.023 ✗**  (full sample, N=868)
- **ρ(HC, flat ROI) = -0.031 ✗**  (post-cutover, N=762)
- **ρ(Δw+HC, flat ROI) = -0.028 ✗**  (post-cutover, N=762)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0 (full sample)** — N=238, 110-124, WR 47.0% [41%–53%], flat ROI -11.9% (t=-1.93 ~ p<.10)

### Action map

- **Tier-1a (HC ≥ +2)** — N=52, WR 44.2%, flat ROI -19.8%. Bayesian posterior WR ≈ 45.2%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=179, WR 58.1%, flat ROI +9.9%. Bayesian posterior WR ≈ 57.7%, half-Kelly = **5.6%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=115, WR 46.5%, flat ROI -12.7%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=124, WR 50.8%, flat ROI -1.4%. Bayesian posterior WR ≈ 50.7%, half-Kelly = **0.0%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -11.9% flat ROI on 238 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (0.98u/pick), we need **~1465 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 874. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-06-26 |
| Sides scanned | 1609 |
| Shipped + graded | **874** |
| W-L-P | 439-427-8 |
| Win rate | **50.7%** [47.4%–54.0%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +1.7 pp |
| Peak-units PnL | **-185.6u** |
| Flat-1u PnL | **-33.5u** (-3.8% flat ROI) |
| Flat t-statistic vs zero | -1.16 → ✗ noise |
| Flat 95% CI per-pick | [-0.103, 0.026]u |

### Power note

At our observed flat-PnL standard deviation (0.98u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4070 |
| +5% | 1465 |
| +10% | 367 |

We have **874** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 10 | 3-7-0 | 30.0% [11–60] | -42.5% | -6.8u | -1.43 ✗ noise |
| Δw = −1 | 39 | 15-23-1 | 39.5% [26–55] | -24.9% | -14.2u | -1.65 ~ p<.10 |
| Δw = 0 | 189 | 92-94-3 | 49.5% [42–57] | -7.6% | -46.6u | -1.10 ✗ noise |
| Δw = +1 | 350 | 185-162-3 | 53.3% [48–58] | +0.7% | -82.2u | 0.14 ✗ noise |
| Δw = +2 | 156 | 77-78-1 | 49.7% [42–57] | -4.4% | -29.7u | -0.55 ✗ noise |
| Δw ≥ +3 | 124 | 63-61-0 | 50.8% [42–59] | -1.4% | -10.1u | -0.15 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.025** ✗  ·  **ρ(Δw, flat ROI) = 0.023** ✗  (N=868)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 1 | 1-0-0 | 100.0% [21–100] | +86.2% | +2.5u | 0.00 ✗ n<2 |
| HC = −1 | 30 | 17-13-0 | 56.7% [39–73] | +14.8% | +8.7u | 0.77 ✗ noise |
| HC = 0 | 500 | 243-250-7 | 49.3% [45–54] | -7.5% | -198.4u | -1.77 ~ p<.10 |
| HC = +1 | 179 | 104-75-0 | 58.1% [51–65] | +9.9% | +16.4u | 1.38 ✗ noise |
| HC = +2 | 37 | 19-18-0 | 51.4% [36–67] | -3.3% | +3.9u | -0.21 ✗ noise |
| HC ≥ +3 | 15 | 4-11-0 | 26.7% [11–52] | -60.3% | -8.2u | -3.43 ✓ p<.01 |

**Pearson ρ(HC, WIN) = -0.015** ✗  ·  **ρ(HC, flat ROI) = -0.031** ✗  (N=762)

Spearman rank ρ(HC, flat ROI) = 0.013.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 186 | 88-95-3 | 48.1% [41–55] | -9.6% | -58.7u | -1.37 ✗ noise |
| Σ = +1 | 269 | 143-123-3 | 53.8% [48–60] | +1.4% | -81.6u | 0.24 ✗ noise |
| Σ = +2 | 148 | 81-66-1 | 55.1% [47–63] | +3.9% | -3.5u | 0.50 ✗ noise |
| Σ = +3 | 68 | 31-37-0 | 45.6% [34–57] | -12.5% | -8.9u | -1.04 ✗ noise |
| Σ = +4 | 41 | 22-19-0 | 53.7% [39–68] | +5.2% | -5.7u | 0.33 ✗ noise |
| Σ = +5 | 21 | 11-10-0 | 52.4% [32–72] | -8.1% | -6.9u | -0.40 ✗ noise |
| Σ ≥ +6 | 29 | 12-17-0 | 41.4% [26–59] | -28.8% | -9.7u | -1.75 ~ p<.10 |

**Pearson ρ(Δw+HC, WIN) = -0.012** ✗  ·  **ρ(Σ, flat ROI) = -0.028** ✗  (N=762)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 762.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.008 ✗ | -0.021 ✗ | -0.002 | weak |
| HC margin | -0.015 ✗ | -0.031 ✗ | 0.013 | weak |
| Δw + HC | -0.012 ✗ | -0.028 ✗ | 0.006 | weak |
| peak.stars | -0.032 ✗ | -0.044 ✗ | -0.046 | weak |
| vault.star | -0.027 ✗ | -0.040 ✗ | -0.055 | weak |
| lock.stars | -0.023 ✗ | -0.034 ✗ | -0.032 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 762 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | N=1 · 1-0 · 100% [21–100] · —  | — | — | — | — | — |
| -1 | — | N=1 · 0-1 · 0% [0–79] · —  | N=7 · 4-3 · 57% [25–84] · +21%  | N=7 · 5-2 · 71% [36–92] · +50%  | N=9 · 4-5 · 44% [19–73] · -21%  | N=2 · 2-0 · 100% [34–100] · — ★ | N=4 · 2-2 · 50% [15–85] · -1%  |
| +0 | N=2 · 1-1 · 50% [9–91] · —  | N=4 · 1-3 · 25% [5–70] · -44%  | N=18 · 5-12 · 29% [13–53] · -42% ✗ | N=128 · 62-64 · 49% [41–58] · -8%  | N=239 · 125-111 · 53% [47–59] · -0%  | N=77 · 38-38 · 50% [39–61] · -7%  | N=32 · 11-21 · 34% [20–52] · -36% ✗ |
| +1 | — | — | N=8 · 5-3 · 63% [31–86] · +5%  | N=28 · 16-12 · 57% [39–73] · +6%  | N=65 · 40-25 · 62% [49–72] · +18%  | N=38 · 20-18 · 53% [37–68] · +3%  | N=40 · 23-17 · 57% [42–71] · +7%  |
| +2 | — | N=1 · 0-1 · 0% [0–79] · —  | — | N=2 · 1-1 · 50% [9–91] · —  | N=4 · 1-3 · 25% [5–70] · -55%  | N=11 · 5-6 · 45% [21–72] · -7%  | N=19 · 12-7 · 63% [41–81] · +16%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | — | N=3 · 1-2 · 33% [6–79] · -50%  | N=11 · 2-9 · 18% [5–48] · -72% ✗ |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 1 | 1-0-0 | 100.0% [21–100] | +86.2% | +2.5u | 0.00 ✗ n<2 |
| HC = −1 | 30 | 17-13-0 | 56.7% [39–73] | +14.8% | +8.7u | 0.77 ✗ noise |
| HC = 0 | 500 | 243-250-7 | 49.3% [45–54] | -7.5% | -198.4u | -1.77 ~ p<.10 |
| HC = +1 | 179 | 104-75-0 | 58.1% [51–65] | +9.9% | +16.4u | 1.38 ✗ noise |
| HC = +2 | 37 | 19-18-0 | 51.4% [36–67] | -3.3% | +3.9u | -0.21 ✗ noise |
| HC ≥ +3 | 15 | 4-11-0 | 26.7% [11–52] | -60.3% | -8.2u | -3.43 ✓ p<.01 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 9 | 3-6-0 | 33.3% [12–65] | -36.1% | -6.3u | -1.12 ✗ noise |
| Δw = −1 | 33 | 14-18-1 | 43.8% [28–61] | -17.5% | -9.7u | -1.05 ✗ noise |
| Δw = 0 | 166 | 85-79-2 | 51.8% [44–59] | -3.2% | -33.2u | -0.43 ✗ noise |
| Δw = +1 | 317 | 170-144-3 | 54.1% [49–60] | +2.3% | -77.6u | 0.42 ✗ noise |
| Δw = +2 | 131 | 66-64-1 | 50.8% [42–59] | -3.1% | -25.9u | -0.36 ✗ noise |
| Δw ≥ +3 | 106 | 50-56-0 | 47.2% [38–57] | -12.9% | -22.2u | -1.40 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 231 | 127-104-0 | 55.0% [49–61] | +3.2% | +12.1u | 0.51 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 115 | 53-61-1 | 46.5% [38–56] | -12.7% | -37.1u | -1.42 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 416 | 208-202-6 | 50.7% [46–56] | -4.2% | -150.0u | -0.90 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 839 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 27 | 9-18-0 | 33.3% [19–52] | -32.0% | -13.4u | -1.67 ~ p<.10 |
| Δcount = −1 | 59 | 26-33-0 | 44.1% [32–57] | -15.7% | -34.8u | -1.23 ✗ noise |
| Δcount = 0 (balanced) | 140 | 63-75-2 | 45.7% [38–54] | -12.5% | -33.8u | -1.53 ✗ noise |
| Δcount = +1 | 322 | 163-158-1 | 50.8% [45–56] | -4.8% | -131.8u | -0.91 ✗ noise |
| Δcount = +2 | 164 | 91-72-1 | 55.8% [48–63] | +5.5% | -1.8u | 0.73 ✗ noise |
| Δcount ≥ +3 (heavy support) | 127 | 76-48-3 | 61.3% [53–69] | +17.5% | +40.7u | 1.89 ~ p<.10 |

**ρ(Δcount, WIN) = 0.118** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.116** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -7 · ≤ 2 · ≤ 12 · ≤ 23 · > 23

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 191 | 80-111-0 | 41.9% [35–49] | -18.6% | -85.4u | -2.63 ✓ p<.01 |
| Q2 | 147 | 66-79-2 | 45.5% [38–54] | -10.8% | -46.2u | -1.34 ✗ noise |
| Q3 (balanced) | 172 | 95-75-2 | 55.9% [48–63] | +3.9% | -39.3u | 0.54 ✗ noise |
| Q4 | 173 | 88-84-1 | 51.2% [44–59] | -2.2% | -49.6u | -0.30 ✗ noise |
| Q5 (best — heavy support) | 156 | 99-55-2 | 64.3% [56–71] | +18.4% | +45.5u | 2.36 ✓ p<.05 |

**ρ(ΔWlNet, WIN) = 0.159** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.133** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -46.68 · ≤ 6.61 · ≤ 17.35 · ≤ 0.67 · > 0.67

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 49 | 20-28-1 | 41.7% [29–56] | -19.9% | -11.5u | -1.45 ✗ noise |
| Q2 | 467 | 227-239-1 | 48.7% [44–53] | -8.7% | -100.4u | -1.99 ✓ p<.05 |
| Q3 | 142 | 84-55-3 | 60.4% [52–68] | +15.6% | -22.6u | 1.94 ~ p<.10 |
| Q4 | 0 | — | — | — | — | — |
| Q5 | 181 | 97-82-2 | 54.2% [47–61] | +4.8% | -40.3u | 0.62 ✗ noise |

**ρ(ΔFlatPnl, WIN) = NaN** —  ·  **ρ(ΔFlatPnl, flat ROI) = NaN** —

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -68.8 · ≤ 10.9 · ≤ 24.4 · ≤ 2.5 · > 2.5

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 52 | 19-32-1 | 37.3% [25–51] | -27.2% | -25.9u | -2.04 ✓ p<.05 |
| Q2 | 480 | 231-248-1 | 48.2% [44–53] | -8.5% | -93.2u | -1.92 ~ p<.10 |
| Q3 | 134 | 85-47-2 | 64.4% [56–72] | +20.4% | -8.1u | 2.56 ✓ p<.05 |
| Q4 | 0 | — | — | — | — | — |
| Q5 | 173 | 93-77-3 | 54.7% [47–62] | +4.4% | -47.7u | 0.57 ✗ noise |

**ρ(ΔAvgRoi, WIN) = NaN** —  ·  **ρ(ΔAvgRoi, flat ROI) = NaN** —

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 111 | 36-73-2 | 33.0% [25–42] | -34.5% | -56.6u | -3.88 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 27 | 10-17-0 | 37.0% [22–56] | -30.4% | -8.7u | -1.68 ~ p<.10 |
| ΔBestRank = 0 (tied) | 4 | 3-1-0 | 75.0% [30–95] | +53.0% | +2.6u | 1.03 ✗ noise |
| ΔBestRank ∈ [+1,+4] | 16 | 8-8-0 | 50.0% [28–72] | -5.3% | -4.3u | -0.21 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 231 | 124-105-2 | 54.1% [48–60] | +4.2% | -33.1u | 0.62 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.214** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.209** ✓ p<.01  (N=389)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 63 | 19-43-1 | 30.6% [21–43] | -39.4% | -42.1u | -3.39 ✓ p<.01 |
| Δshare ∈ [−30,−10] pp | 9 | 2-7-0 | 22.2% [6–55] | -50.7% | -4.3u | -1.53 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 559 | 287-270-2 | 51.5% [47–56] | -2.6% | -126.3u | -0.65 ✗ noise |
| Δshare ∈ [+10,+30] pp | 29 | 12-16-1 | 42.9% [27–61] | -18.9% | -4.9u | -1.07 ✗ noise |
| Δshare ≥ +30 pp | 179 | 108-68-3 | 61.4% [54–68] | +16.6% | +2.7u | 2.20 ✓ p<.05 |

**ρ(ΔTopQShare, WIN) = 0.110** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.103** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔTopQCount** | 0.158 ✓ p<.01 | 0.155 ✓ p<.01 | 0.112 |
| 2 | **ΔWlNet** | 0.159 ✓ p<.01 | 0.133 ✓ p<.01 | 0.083 |
| 3 | **Δcount** | 0.118 ✓ p<.01 | 0.116 ✓ p<.01 | 0.094 |
| 4 | **ΔTopQShare** | 0.110 ✓ p<.01 | 0.103 ✓ p<.01 | 0.102 |
| 5 | **ΔFlatPnl** | NaN — | NaN — | 0.088 |
| 6 | **ΔAvgRoi** | NaN — | NaN — | 0.098 |

_(ΔBestRank uses N=389 subset where both sides had a proven wallet — ρ(flat ROI) = 0.209 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 1496, dateRange = 2026-04-18 → 2026-06-26, computedAt = 2026-06-27T14:17:30.342Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **839** rows · PIT aggregate computable on **836** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **836** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 0 · — · — | 1 · 0% · -100.0% | — |
| NEUTRAL (0..+3) | 634 · 54% · +2.0% | 480 · 53% · -1.5% | -3.5pp |
| WEAK (−3..0) | 176 · 44% · -14.8% | 329 · 50% · -1.7% | +13.1pp |
| FADE (<−3) | 2 · 0% · -100.0% | 2 · 0% · -100.0% | +0.0pp |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=433, WR=56%, ROI=+5.6% | N=369, WR=53%, ROI=-1.7% | -7.4pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=634, WR=54%, ROI=+2.0% | N=481, WR=53%, ROI=-1.7% | -3.7pp |
| AGS < −1 (mute veto) | N=69, WR=49%, ROI=-5.5% | N=189, WR=47%, ROI=-6.0% | -0.4pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-06-13 → 2026-06-26, N=247)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 1 · 0% · -100.0% |
| NEUTRAL (0..+3) | 130 · 57% · +3.0% |
| WEAK (−3..0) | 114 · 48% · -8.4% |
| FADE (<−3) | 2 · 0% · -100.0% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=106, WR=58%, ROI=+4.2% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=131, WR=56%, ROI=+2.3% |
| AGS < −1 (mute veto) | N=60, WR=45%, ROI=-13.0% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 0.81 | 1.99 |
| `dHcSizeRatio` | INTENSITY_HC | + | 0.58 | 5.47 |
| `dSumRankNorm` | QUALITY_RANK | − | 43.83 | 88.19 |
| `dWinnerCtPreA` | QUALITY_TRACK | − | 0.44 | 1.59 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **836/874** shipped+graded rows (96%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -4.22 |
| 20th pct | -0.22 |
| 40th pct | -0.00 |
| Median | 0.07 |
| 60th pct | 0.16 |
| 80th pct | 0.38 |
| 90th pct | 0.59 |
| Max | 3.04 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 139 | 16.6% |
| **LOCK** | +5..+7 | 148 | 17.7% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 122 | 14.6% |
| **FADE** | < −3 | 205 | 24.5% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 139 | 76-61-2 | 55.5% [47–64] | -0.3% | -17.7u | -0.04 ✗ noise |
| LOCK | 148 | 71-77-0 | 48.0% [40–56] | -9.4% | -54.8u | -1.18 ✗ noise |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 122 | 62-58-2 | 51.7% [43–60] | -1.3% | -29.0u | -0.15 ✗ noise |
| FADE | 205 | 95-107-3 | 47.0% [40–54] | -6.0% | -64.4u | -0.82 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.042** ✗ · r(ROI) = **0.016** ✗ · Spearman ρ(ROI) = **-0.010**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 178 | 86-90-2 | 48.9% [42–56] | -4.1% | -46.7u | -0.55 ✗ noise |
| z ∈ [−1, 0) | 326 | 172-151-3 | 53.3% [48–59] | +1.1% | -74.6u | 0.21 ✗ noise |
| z ∈ [0, +1) | 221 | 108-112-1 | 49.1% [43–56] | -7.9% | -46.6u | -1.22 ✗ noise |
| z ≥ +1 (very positive) | 111 | 56-53-2 | 51.4% [42–61] | -7.1% | -8.4u | -0.81 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 802 | 407-387-8 | 51.3% [48–55] | -3.5% | -173.3u | -1.03 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dSumRankNorm` (QUALITY_RANK)

r(WIN) = **-0.047** ✗ · r(ROI) = **-0.046** ✗ · Spearman ρ(ROI) = **-0.041**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 152 | 82-69-1 | 54.3% [46–62] | -0.2% | -15.5u | -0.02 ✗ noise |
| z ∈ [−1, 0) | 342 | 177-163-2 | 52.1% [47–57] | +0.0% | -83.9u | 0.00 ✗ noise |
| z ∈ [0, +1) | 261 | 126-131-4 | 49.0% [43–55] | -6.1% | -70.9u | -1.02 ✗ noise |
| z ≥ +1 (very positive) | 81 | 37-43-1 | 46.3% [36–57] | -15.7% | -6.1u | -1.53 ✗ noise |

#### `dWinnerCtPreA` (QUALITY_TRACK)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 802 | 407-387-8 | 51.3% [48–55] | -3.5% | -173.3u | -1.03 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.047 ✗ | -0.046 ✗ | -0.041 |
| 2 | `dCount` | COUNT | 0.042 ✗ | 0.016 ✗ | -0.010 |
| 3 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |
| 4 | `dWinnerCtPreA` | QUALITY_TRACK | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | -0.112 | 0.820 | 50.8% | dominant |
| 2 | `dSumRankNorm` | -0.219 | 0.780 | 48.3% | meaningful |
| 3 | `dWinnerCtPreA` | -0.011 | 0.011 | 0.7% | silent (<0.2) |
| 4 | `dHcSizeRatio` | -0.004 | 0.004 | 0.3% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcSizeRatio` | `dSumRankNorm` | `dWinnerCtPreA` |
|---|---|---|---|---|
| `dCount` | 1.000 | -0.013 | +0.654 | -0.013 |
| `dHcSizeRatio` | -0.013 | 1.000 | -0.038 | +1.000 ⚠ |
| `dSumRankNorm` | +0.654 | -0.038 | 1.000 | -0.038 |
| `dWinnerCtPreA` | -0.013 | +1.000 ⚠ | -0.038 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.008**. At AGS ≥ +0.12 fires N=380, WR=52.6%, ROI=-2.6%. At AGS ≥ +null fires N=496, WR=52.3%, ROI=-3.1%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-380 ROI (matched cohort) | Top-380 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.051 | +0.043 | WR=56%, ROI=+6.1% | -8.7pp | N=459, WR=53%, ROI=+0.7% |
| `dHcSizeRatio` | +0.047 | +0.039 | WR=54%, ROI=+0.7% | -3.3pp | N=409, WR=53%, ROI=-0.8% |
| `dSumRankNorm` | -0.021 | +0.013 | WR=50%, ROI=-7.3% | +4.7pp | N=328, WR=50%, ROI=-6.5% |
| `dWinnerCtPreA` | +0.047 | +0.039 | WR=54%, ROI=+0.6% | -3.1pp | N=401, WR=54%, ROI=+0.0% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dSumRankNorm` | +0.013 | +4.7pp | redundant — other features cover it |
| 2 | `dWinnerCtPreA` | +0.039 | -3.1pp | redundant — other features cover it |
| 3 | `dHcSizeRatio` | +0.039 | -3.3pp | redundant — other features cover it |
| 4 | `dCount` | +0.043 | -8.7pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.178 | 0.178 | negative ↓ |
| 2 | `dCount` | COUNT | +0.137 | 0.137 | positive ↑ |
| 3 | `dWinnerCtPreA` | QUALITY_TRACK | +0.013 | 0.013 | flat ≈ 0 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | +0.005 | 0.005 | flat ≈ 0 |

Intercept b = -0.004 · Final log-loss = 0.6882 · N = 836.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | #1 | #2 | #1 | #1 | 1.25 |
| 2 | `dCount` | COUNT | #2 | #1 | #4 | #2 | 2.25 |
| 3 | `dWinnerCtPreA` | QUALITY_TRACK | #4 | #3 | #2 | #3 | 3.00 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | #3 | #4 | #3 | #4 | 3.50 |

#### Plain-English summary

- **Workhorse**: `dSumRankNorm` (QUALITY_RANK) — ranks #1/#2/#1/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dHcSizeRatio` (INTENSITY_HC) — composite avg rank 3.50. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dHcSizeRatio` ↔ `dWinnerCtPreA` (r=+1.00). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dWinnerCtPreA`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 836 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/836 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 252 | 122-130-0 | 48.4% [42–55] | -11.2% | -132.3u | -1.90 ~ p<.10 |
| 4.5★ | 175 | 97-76-2 | 56.1% [49–63] | +6.1% | -20.3u | 0.83 ✗ noise |
| 4.0★ | 171 | 79-90-2 | 46.7% [39–54] | -9.9% | -26.1u | -1.32 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 113 | 56-54-3 | 50.9% [42–60] | -1.8% | -1.7u | -0.19 ✗ noise |
| 2.5★ | 125 | 66-58-1 | 53.2% [44–62] | -0.2% | -9.1u | -0.03 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 47/53%/-5% | 46/50%/-5% | 38/35%/-34% | 6/33%/-26% | 41/36%/-31% | 59/55%/+5% |
| Δw = +1 | 66/55%/-0% | 83/54%/+2% | 87/48%/-7% | 28/54%/+4% | 45/58%/+12% | 40/55%/+0% |
| Δw = +2 | 68/44%/-15% | 24/54%/+3% | 37/57%/+9% | — | 16/53%/+3% | 11/45%/-9% |
| Δw ≥ +3 | 69/42%/-24% | 19/79%/+50% | 9/44%/-10% | 3/67%/+156% | 11/73%/+47% | 13/38%/-30% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 17 | 15-2-0 | 88.2% [66–97] | +7.2% | +9.1u | 0.73 ✗ noise |
| −300/−201 | 29 | 19-10-0 | 65.5% [47–80] | -5.3% | +9.6u | -0.41 ✗ noise |
| −200/−151 | 89 | 53-36-0 | 59.6% [49–69] | -5.2% | -26.0u | -0.62 ✗ noise |
| −150/−101 | 508 | 257-246-5 | 51.1% [47–55] | -4.0% | -94.8u | -0.96 ✗ noise |
| −100/+100 | 11 | 6-5-0 | 54.5% [28–79] | +9.1% | +1.8u | 0.29 ✗ noise |
| +101/+150 | 171 | 72-96-3 | 42.9% [36–50] | -5.8% | -78.8u | -0.71 ✗ noise |
| +151/+200 | 26 | 14-12-0 | 53.8% [35–71] | +41.5% | +9.3u | 1.58 ✗ noise |
| +201+ | 21 | 3-18-0 | 14.3% [5–35] | -38.8% | -5.8u | -1.12 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -10% (4) | -4% (5) | +32% (1) | +21% (6) |
| −300/−201 | -16% (12) | +23% (6) | +15% (5) | -29% (6) |
| −200/−151 | -20% (26) | +4% (35) | +33% (12) | -36% (15) |
| −150/−101 | -7% (134) | +1% (213) | -13% (90) | -3% (68) |
| −100/+100 | -100% (3) | +67% (6) | -100% (1) | +100% (1) |
| +101/+150 | -12% (48) | -4% (66) | +1% (37) | -10% (20) |
| +151/+200 | +27% (4) | +43% (11) | +54% (7) | +73% (3) |
| +201+ | -55% (7) | -100% (6) | -100% (3) | +94% (5) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 462 | 228-233-1 | 49.5% [45–54] | -6.7% | -100.4u | -1.45 ✗ noise |
| SPREAD | 148 | 75-71-2 | 51.4% [43–59] | -3.6% | -38.7u | -0.45 ✗ noise |
| TOTAL | 264 | 136-123-5 | 52.5% [46–59] | +1.1% | -46.5u | 0.18 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=127 · 44% · -19% | N=167 · 53% · -2% | N=83 · 53% · +4% | N=82 · 48% · -7% |
| SPREAD | N=41 · 38% · -31% | N=68 · 60% · +14% | N=22 · 59% · +6% | N=16 · 38% · -27% |
| TOTAL | N=70 · 59% · +13% | N=115 · 50% · -3% | N=51 · 40% · -22% | N=26 · 69% · +33% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 661 | 339-317-5 | 51.7% [48–55] | -2.4% | -148.4u | -0.65 ✗ noise |
| NBA | 130 | 60-69-1 | 46.5% [38–55] | -7.4% | -15.3u | -0.78 ✗ noise |
| NHL | 50 | 25-23-2 | 52.1% [38–66] | +0.7% | -16.2u | 0.05 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=187 · 49% · -7% | N=298 · 53% · +1% | N=116 · 51% · -2% | N=59 · 51% · -4% |
| NBA | N=30 · 31% · -43% | N=29 · 48% · -6% | N=23 · 48% · -5% | N=43 · 53% · +14% |
| NHL | N=10 · 70% · +44% | N=14 · 69% · +25% | N=13 · 42% · -18% | N=13 · 31% · -40% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 303 · 46% · -11.3% · -1.95 ~ p<.10 | 570 · 53% · -0.1% · -0.03 ✗ noise |
| **plusEV** | 81 · 51% · -2.3% · -0.19 ✗ noise | 792 · 51% · -4.2% · -1.22 ✗ noise |
| **pinnacleConfirms** | 181 · 55% · +2.8% · 0.38 ✗ noise | 511 · 49% · -7.4% · -1.72 ~ p<.10 |
| **invested10kPlus** | 393 · 51% · -5.1% · -1.02 ✗ noise | 299 · 50% · -4.2% · -0.75 ✗ noise |
| **lineMovingWith** | 342 · 55% · +3.4% · 0.65 ✗ noise | 531 · 48% · -8.8% · -2.08 ✓ p<.05 |
| **predMarketAligns** | 197 · 52% · -3.0% · -0.42 ✗ noise | 495 · 50% · -5.4% · -1.23 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 318 | 163-155-0 | 51.3% [46–57] | -2.5% | -116.1u | -0.46 ✗ noise |
| 1 | 167 | 79-83-5 | 48.8% [41–56] | -5.9% | -38.3u | -0.78 ✗ noise |
| 2 | 177 | 88-86-3 | 50.6% [43–58] | -4.5% | -5.7u | -0.61 ✗ noise |
| 3 | 66 | 33-33-0 | 50.0% [38–62] | -7.3% | -10.8u | -0.61 ✗ noise |
| 4 | 67 | 36-31-0 | 53.7% [42–65] | -2.3% | -9.1u | -0.20 ✗ noise |
| 5 | 62 | 31-31-0 | 50.0% [38–62] | -8.9% | -10.3u | -0.73 ✗ noise |
| 6 | 17 | 9-8-0 | 52.9% [31–74] | +22.8% | +4.7u | 0.62 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 119 | 64-54-1 | 54.2% [45–63] | +0.8% | -5.0u | 0.09 ✗ noise |
| NEAR_START | 329 | 157-167-5 | 48.5% [43–54] | -6.8% | -74.2u | -1.24 ✗ noise |
| NO_MOVE | 25 | 12-13-0 | 48.0% [30–67] | -11.9% | +7.5u | -0.63 ✗ noise |
| PREGAME | 234 | 123-111-0 | 52.6% [46–59] | -0.5% | -89.0u | -0.08 ✗ noise |
| SMALL_MOVE | 165 | 81-82-2 | 49.7% [42–57] | -6.2% | -27.4u | -0.81 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 502 | 257-242-3 | 51.5% [47–56] | -3.5% | -154.2u | -0.83 ✗ noise |
| STRONG | 123 | 62-59-2 | 51.2% [42–60] | -2.0% | -3.8u | -0.22 ✗ noise |
| LEAN | 237 | 115-119-3 | 49.1% [43–56] | -4.8% | -25.2u | -0.73 ✗ noise |
| CONTESTED | 11 | 4-7-0 | 36.4% [15–65] | -29.3% | -4.0u | -0.98 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.067 ✓ p<.05 | -0.058 ~ p<.10 | -0.049 | -1.71 |
| totalInvested | -0.067 ✓ p<.05 | -0.075 ✓ p<.05 | -0.016 | -2.22 |
| evEdge | 0.092 ✓ p<.01 | 0.116 ✓ p<.01 | 0.048 | 3.45 |
| moneyPct | 0.043 ✗ | 0.022 ✗ | 0.012 | 0.64 |
| walletPct | 0.047 ✗ | 0.038 ✗ | 0.032 | 1.11 |
| criteriaMet | 0.006 ✗ | 0.002 ✗ | -0.032 | 0.07 |
| maxContribFor | -0.013 ✗ | -0.001 ✗ | 0.013 | -0.04 |
| meanBaseFor | -0.014 ✗ | 0.012 ✗ | 0.029 | 0.36 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **859** picks. Mean CLV = **-0.0027**.
t-statistic vs zero: -1.64 → ✗ noise · 95% CI [-0.0059, 0.0005]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 102 | 46-55-1 | 45.5% [36–55] | -16.9% | -39.1u | -1.84 ~ p<.10 |
| CLV (−2%, 0] | 499 | 253-240-6 | 51.3% [47–56] | -3.1% | -94.1u | -0.72 ✗ noise |
| CLV (0, +2%] | 215 | 112-103-0 | 52.1% [45–59] | +1.8% | -39.8u | 0.26 ✗ noise |
| CLV > +2% | 43 | 22-20-1 | 52.4% [38–67] | -1.7% | -2.9u | -0.11 ✗ noise |

ρ(CLV, flat ROI) = 0.022 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=637 (with all features non-null). Intercept β₀ = 0.065.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | sharpCount | -0.252 | ↓ hurts |
| 2 | log(impliedProb) | +0.226 | ↑ helps |
| 3 | pw.Δcount | +0.203 | ↑ helps |
| 4 | evEdge | +0.202 | ↑ helps |
| 5 | pw.ΔAvgRoi | +0.201 | ↑ helps |
| 6 | odds (American) | -0.154 | ↓ hurts |
| 7 | pw.ΔWlNet | +0.140 | ↑ helps |
| 8 | pw.ΔTopQShare | +0.127 | ↑ helps |
| 9 | pw.ΔFlatPnl | +0.114 | ↑ helps |
| 10 | moneyPct | -0.071 | ↓ hurts |
| 11 | peak.stars | -0.069 | ↓ hurts |
| 12 | walletPct | +0.033 | ≈ flat |
| 13 | vault.star | +0.032 | ≈ flat |
| 14 | Δw | -0.031 | ≈ flat |
| 15 | log10(invested) | +0.026 | ≈ flat |
| 16 | criteriaMet | +0.021 | ≈ flat |
| 17 | HC margin | +0.016 | ≈ flat |
| 18 | Δw + HC | -0.015 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 52 | 23-29 | 44.2% | 45.2% | -110 | — (mute) | 2.53u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 179 | 104-75 | 58.1% | 57.7% | -110 | 5.56% bankroll | 2.04u | **UNDER-SIZED** — ship up to 5.56u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 115 | 53-61 | 46.5% | 46.8% | -110 | — (mute) | 2.01u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 124 | 63-61 | 50.8% | 50.7% | -110 | — (mute) | 2.37u | **MUTE** (negative EV at posterior) |
| Stale Δw = 0 | 189 | 92-94 | 49.5% | 49.5% | -110 | — (mute) | 1.86u | **MUTE** (negative EV at posterior) |
| Stale Δw ≤ −1 | 49 | 18-30 | 37.5% | 39.7% | -110 | — (mute) | 1.29u | **MUTE** (negative EV at posterior) |

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

**Peak cum PnL:** +7.1u
**Max drawdown:** -192.7u
**Longest losing-day streak:** 8
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.347  (annualized × √252 ≈ -5.50)

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
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 0 | 25 | 1.00 | L | -1.0u |
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
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 1 | -4 | -0.50 | L | -1.5u |
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
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | 0 | -7 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | 0 | 0 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 0 | 0 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 1 | 6 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 3 | 15 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 1 | 1 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -1 | -16 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 2 | -4 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 27 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | 1 | 0 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 16 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 2 | -5 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | -5 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | -11 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 2 | -18 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 4 | 18 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 1 | 25 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 2 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 21 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 2 | 0 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 1 | -19 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 1 | -19 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | 1 | -17 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 10 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 1 | 3 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 1 | -6 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 2 | -3 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 2 | 10 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | -1 | 19 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 2 | 22 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 1 | -5 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 2 | -4 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 12 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 26 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | 6 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -6 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 3 | -1 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | 0 | -28 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 1 | -19 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -18 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 3 | 16 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 3 | 28 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 4 | 17 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 1 | 15 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | -1 | 5 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 0 | 6 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 1 | -5 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 1 | -5 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | -1 | 7 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 1 | 11 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 2 | -3 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 6 | 1 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 21 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 1 | 27 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 2 | -6 | 0.00 | L | -0.5u |
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
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | 4 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 4 | -9 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 12 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 2 | 16 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 1 | 1 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 3 | 17 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | -1 | -27 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 2 | 3 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 13 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 15 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 13 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | 0 | 2 | -0.20 | L | -1.1u |
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
| 2026-05-11 | MLB | ML | away | 3.5 | 1.13 | -101 | 1 | 1 | 2 | 2 | -23 | 0.00 | W | +1.1u |
| 2026-05-11 | MLB | ML | home | 3.5 | 1.13 | -156 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +0.7u |
| 2026-05-11 | NBA | TOTAL | under | 4.5 | 2.00 | -110 | 1 | 2 | 3 | 0 | 8 | 0.00 | L | -2.0u |
| 2026-05-11 | NHL | TOTAL | under | 4.5 | 1.27 | -110 | 2 | 0 | 2 | 2 | 14 | 0.00 | L | -1.3u |
| 2026-05-12 | MLB | ML | away | 5.0 | 4.50 | +108 | 4 | 0 | 4 | 3 | 7 | -0.20 | L | -4.5u |
| 2026-05-12 | MLB | TOTAL | under | 4.0 | 0.64 | -110 | 2 | 1 | 3 | 1 | -6 | 0.00 | L | -0.6u |
| 2026-05-12 | MLB | ML | away | 4.5 | 3.00 | +129 | 3 | 0 | 3 | 2 | 26 | -1.00 | L | -3.0u |
| 2026-05-12 | MLB | ML | home | 5.0 | 3.00 | +108 | 3 | 0 | 3 | 1 | -6 | -0.50 | L | -3.0u |
| 2026-05-12 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 6 | 4 | 10 | 5 | 31 | -0.70 | L | -3.5u |
| 2026-05-13 | MLB | ML | home | 4.5 | 4.50 | -116 | 1 | 1 | 2 | 2 | -20 | -1.30 | W | +3.7u |
| 2026-05-13 | MLB | SPREAD | home | 5.0 | 3.50 | -105 | 1 | 1 | 2 | 2 | -25 | 0.90 | W | +3.2u |
| 2026-05-13 | MLB | TOTAL | under | 4.0 | 0.96 | -110 | 1 | 1 | 2 | 2 | -7 | 0.00 | W | +0.9u |
| 2026-05-13 | MLB | TOTAL | under | 5.0 | 3.50 | -110 | 4 | 2 | 6 | 4 | -20 | 0.00 | L | -3.5u |
| 2026-05-13 | NBA | ML | home | 5.0 | 4.50 | -162 | 6 | 0 | 6 | 2 | -16 | -1.00 | L | -4.5u |
| 2026-05-13 | NBA | TOTAL | over | 5.0 | 3.50 | -101 | 3 | 2 | 5 | 4 | 2 | 0.00 | W | +3.4u |
| 2026-05-14 | MLB | ML | home | 5.0 | 4.50 | -103 | 4 | 1 | 5 | 2 | -1 | -0.40 | L | -4.5u |
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 2 | 8 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | -6 | 0.00 | L | -0.5u |
| 2026-05-14 | NHL | TOTAL | under | 5.0 | 3.50 | -110 | 3 | 1 | 4 | 1 | 8 | 0.00 | L | -3.5u |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 0 | 1 | 1 | 3 | 10 | 0.00 | W | +1.7u |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 1 | 1 | 2 | 2 | -19 | 0.00 | W | +0.3u |
| 2026-05-15 | MLB | ML | home | 4.0 | 2.50 | +128 | 0 | 0 | 0 | 0 | 1 | 0.00 | L | -2.5u |
| 2026-05-15 | MLB | ML | away | 4.0 | 2.75 | -211 | 2 | 1 | 3 | 2 | 26 | -0.90 | W | +1.3u |
| 2026-05-15 | MLB | ML | away | 3.0 | 1.25 | +115 | 0 | 1 | 1 | -1 | -27 | -1.10 | L | -1.3u |
| 2026-05-15 | NBA | ML | away | 2.5 | 0.50 | +145 | 6 | 1 | 7 | 5 | 38 | -0.50 | W | +0.8u |
| 2026-05-15 | NBA | TOTAL | over | 4.0 | 0.75 | -109 | 0 | 1 | 1 | 3 | -14 | 0.00 | L | -0.8u |
| 2026-05-15 | NBA | SPREAD | home | 2.5 | 1.00 | -105 | 1 | 0 | 1 | 1 | 23 | 0.00 | L | -1.0u |
| 2026-05-15 | NBA | TOTAL | over | 5.0 | 2.00 | -110 | 1 | 0 | 1 | 3 | -1 | 0.00 | W | +1.9u |
| 2026-05-16 | MLB | ML | away | 5.0 | 4.50 | +124 | 3 | 1 | 4 | 3 | -29 | -1.30 | W | +1.4u |
| 2026-05-16 | MLB | SPREAD | away | 4.0 | 1.65 | -175 | 2 | 0 | 2 | 1 | -6 | 0.00 | W | +0.9u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +119 | 2 | 1 | 3 | 1 | -19 | -2.00 | L | -2.5u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +115 | 3 | 2 | 5 | 1 | -6 | -1.10 | W | +2.8u |
| 2026-05-16 | MLB | TOTAL | over | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | -26 | 0.00 | L | -1.6u |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.50 | -102 | 1 | 0 | 1 | 1 | -34 | 0.00 | W | +0.5u |
| 2026-05-17 | MLB | ML | away | 4.0 | 2.75 | -148 | 1 | 0 | 1 | 2 | 8 | -0.70 | W | +1.9u |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.50 | +139 | 0 | 1 | 1 | 0 | -46 | 0.70 | L | -0.5u |
| 2026-05-17 | MLB | ML | away | 5.0 | 5.00 | -129 | 3 | 1 | 4 | 1 | -19 | 0.40 | L | -5.0u |
| 2026-05-17 | MLB | ML | home | 4.0 | 2.75 | -114 | 3 | 1 | 4 | 3 | -13 | 2.20 | W | +2.4u |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 1 | 3 | 2 | -25 | 0.00 | W | +2.0u |
| 2026-05-17 | MLB | TOTAL | over | 5.0 | 2.50 | +107 | 2 | 2 | 4 | 1 | -19 | 0.00 | L | -2.5u |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | -12 | 0.00 | W | +0.3u |
| 2026-05-17 | NBA | ML | away | 3.0 | 1.25 | +165 | 3 | 1 | 4 | 3 | 2 | -0.60 | W | +0.8u |
| 2026-05-17 | NBA | TOTAL | under | 5.0 | 0.75 | -110 | 2 | 3 | 5 | 0 | 30 | 0.00 | L | -0.8u |
| 2026-05-18 | MLB | ML | home | 4.5 | 5.00 | -111 | 2 | 1 | 3 | 2 | 8 | -1.10 | W | +4.4u |
| 2026-05-18 | MLB | ML | away | 4.0 | 2.50 | +120 | 2 | 0 | 2 | 1 | -19 | -2.10 | L | -2.5u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | -118 | 2 | 0 | 2 | 1 | -19 | 1.00 | W | +1.1u |
| 2026-05-18 | MLB | ML | home | 4.0 | 2.75 | -150 | 2 | 0 | 2 | 1 | 27 | -0.80 | L | -2.8u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | +132 | 2 | 0 | 2 | 2 | -5 | 0.40 | W | +1.6u |
| 2026-05-18 | NBA | ML | home | 5.0 | 5.00 | -240 | 3 | 2 | 5 | 4 | 23 | -1.60 | L | -5.0u |
| 2026-05-18 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 1 | 2 | 0 | 19 | 0.20 | L | -1.0u |
| 2026-05-18 | NHL | ML | home | 5.0 | 5.00 | -112 | 2 | 2 | 4 | 1 | 5 | -1.10 | L | -5.0u |
| 2026-05-18 | NHL | TOTAL | under | 4.5 | 2.25 | -110 | 3 | 1 | 4 | 1 | 8 | 0.00 | W | +2.0u |
| 2026-05-19 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 2 | -25 | -1.30 | L | -2.5u |
| 2026-05-19 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | -1 | 0.00 | W | +1.5u |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.50 | +105 | 1 | 1 | 2 | 2 | -23 | -0.90 | L | -2.5u |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 1 | 1 | 2 | 1 | -14 | -1.20 | W | +1.2u |
| 2026-05-19 | NBA | ML | home | 5.0 | 5.00 | -260 | 0 | 3 | 3 | 3 | 5 | -0.50 | W | +1.9u |
| 2026-05-19 | NBA | SPREAD | away | 5.0 | 2.25 | -105 | 3 | 2 | 5 | 2 | -4 | -0.90 | L | -2.3u |
| 2026-05-19 | NBA | TOTAL | under | 5.0 | 3.00 | -106 | 2 | 3 | 5 | 2 | 14 | 0.00 | L | -3.0u |
| 2026-05-20 | MLB | ML | away | 5.0 | 2.50 | +113 | 2 | 1 | 3 | 1 | -19 | -1.00 | L | -2.5u |
| 2026-05-20 | MLB | ML | home | 4.0 | 2.75 | -154 | 2 | 0 | 2 | 2 | 26 | -1.50 | W | +1.9u |
| 2026-05-20 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -0.8u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | -140 | 1 | 1 | 2 | 1 | -19 | -1.10 | W | +0.9u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | +111 | 0 | 1 | 1 | -1 | -27 | 0.00 | W | +0.6u |
| 2026-05-20 | MLB | ML | away | 4.0 | 2.75 | +113 | 1 | 1 | 2 | 0 | -46 | -1.00 | L | -2.8u |
| 2026-05-20 | NBA | ML | home | 5.0 | 5.00 | -225 | 10 | 5 | 15 | 1 | 19 | -0.20 | W | +2.1u |
| 2026-05-20 | NBA | SPREAD | home | 5.0 | 3.00 | -106 | 6 | 1 | 7 | 4 | 40 | -0.70 | W | +2.7u |
| 2026-05-20 | NBA | TOTAL | over | 5.0 | 1.65 | -112 | 3 | 1 | 4 | 3 | 38 | 0.00 | W | +1.5u |
| 2026-05-20 | NHL | ML | home | 2.5 | 1.25 | -192 | 0 | 1 | 1 | 1 | 1 | -0.80 | L | -1.3u |
| 2026-05-21 | MLB | ML | home | 5.0 | 2.50 | +125 | 1 | 1 | 2 | 2 | -23 | -0.40 | L | -2.5u |
| 2026-05-21 | MLB | SPREAD | home | 3.0 | 0.75 | -148 | 0 | 0 | 0 | 1 | -19 | -1.50 | L | -0.8u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +172 | 2 | 0 | 2 | 1 | -19 | -0.50 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 4.5 | 2.75 | -110 | 2 | 1 | 3 | 1 | -19 | -0.50 | W | +2.5u |
| 2026-05-21 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 0 | 0 | 1 | -15 | 0.00 | W | +0.3u |
| 2026-05-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 3 | 1 | 4 | 3 | -26 | -0.40 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +129 | 1 | 0 | 1 | 2 | -53 | -0.40 | W | +1.6u |
| 2026-05-21 | MLB | SPREAD | away | 4.0 | 1.65 | -170 | 1 | 1 | 2 | 1 | -6 | 0.30 | W | +1.0u |
| 2026-05-21 | NBA | SPREAD | away | 5.0 | 3.00 | -110 | 4 | 2 | 6 | 3 | 16 | 0.70 | L | -3.0u |
| 2026-05-21 | NHL | ML | home | 4.0 | 2.75 | -197 | 4 | 1 | 5 | 1 | 8 | -1.30 | L | -2.8u |
| 2026-05-21 | NHL | TOTAL | over | 3.0 | 0.75 | +103 | 1 | 0 | 1 | 1 | 8 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 5.0 | 1.25 | -175 | 1 | 0 | 1 | 1 | 27 | -0.90 | L | -1.3u |
| 2026-05-22 | MLB | ML | home | 4.0 | 1.25 | -195 | 3 | 0 | 3 | 1 | -1 | 0.80 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 6 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 3.0 | 1.25 | -137 | 1 | 0 | 1 | 0 | -21 | 0.00 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -144 | 4 | 2 | 6 | 2 | 8 | -1.60 | L | -5.0u |
| 2026-05-22 | MLB | SPREAD | home | 5.0 | 0.75 | -155 | 2 | 0 | 2 | 1 | -19 | -0.30 | W | +0.4u |
| 2026-05-22 | MLB | ML | home | 5.0 | 2.75 | -158 | 1 | 0 | 1 | 1 | 27 | -0.80 | W | +1.7u |
| 2026-05-22 | MLB | SPREAD | home | 3.0 | 0.75 | -142 | 1 | 0 | 1 | 1 | -19 | -2.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -145 | 2 | 2 | 4 | 1 | 27 | -2.20 | L | -5.0u |
| 2026-05-22 | MLB | ML | home | 2.5 | 0.50 | +139 | 2 | 1 | 3 | 0 | -33 | -0.90 | W | +0.7u |
| 2026-05-22 | MLB | SPREAD | home | 4.0 | 1.65 | -119 | 1 | 1 | 2 | 1 | -19 | -1.20 | W | +1.3u |
| 2026-05-22 | MLB | ML | away | 5.0 | 1.50 | +185 | 3 | 0 | 3 | 2 | -23 | -1.10 | L | -1.5u |
| 2026-05-22 | MLB | SPREAD | away | 3.0 | 0.75 | -112 | 1 | 0 | 1 | 1 | -19 | -1.40 | W | +0.6u |
| 2026-05-22 | NBA | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | -2 | -36 | 0.00 | L | -5.0u |
| 2026-05-22 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 0 | 1 | -2 | 7 | -0.50 | L | -1.0u |
| 2026-05-22 | NBA | TOTAL | over | 5.0 | 0.75 | +101 | 2 | 1 | 3 | 1 | 9 | 0.00 | W | +0.7u |
| 2026-05-22 | NHL | ML | home | 4.5 | 3.75 | -167 | 4 | 3 | 7 | 4 | 4 | 0.00 | L | -3.8u |
| 2026-05-22 | NHL | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 1 | 4 | 0 | 0 | 0.00 | W | +2.5u |
| 2026-05-23 | MLB | ML | home | 2.5 | 0.50 | -181 | 1 | 0 | 1 | 2 | 39 | -1.70 | W | +0.3u |
| 2026-05-23 | MLB | ML | away | 2.5 | 2.75 | +109 | 2 | 0 | 2 | 2 | -7 | -0.50 | L | -2.8u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | -33 | 0.00 | W | +0.3u |
| 2026-05-23 | MLB | ML | home | 5.0 | 1.00 | -148 | 0 | 0 | 0 | 1 | -19 | -0.20 | L | -1.0u |
| 2026-05-23 | MLB | SPREAD | away | 3.0 | 0.75 | -163 | 1 | 0 | 1 | 1 | -19 | 0.00 | W | +0.5u |
| 2026-05-23 | MLB | TOTAL | under | 5.0 | 3.00 | -110 | 3 | 1 | 4 | 3 | -26 | 0.00 | W | +2.7u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | 12 | -0.90 | L | -0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 1 | 3 | 2 | -26 | 0.00 | L | -0.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 1.50 | -209 | 0 | 0 | 0 | 2 | -7 | 29.00 | W | +2.5u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | +102 | 0 | 0 | 0 | 1 | 12 | 0.00 | W | +0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -19 | 0.00 | W | +0.7u |
| 2026-05-23 | MLB | ML | away | 2.5 | 1.25 | -111 | -1 | 1 | 0 | 1 | 10 | 0.40 | L | -1.3u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -135 | 0 | 0 | 0 | 1 | 12 | 0.40 | W | +0.6u |
| 2026-05-23 | MLB | TOTAL | under | 2.5 | 0.30 | +108 | 0 | 0 | 0 | 0 | -3 | 0.00 | P | +0.0u |
| 2026-05-23 | MLB | ML | home | 4.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | -16 | 1.10 | W | +2.9u |
| 2026-05-23 | MLB | ML | away | 3.0 | 1.25 | +166 | 2 | 1 | 3 | 2 | -41 | -0.30 | W | +1.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 2.25 | -123 | 1 | 0 | 1 | 2 | 6 | -0.90 | W | +1.6u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -111 | 1 | 0 | 1 | 1 | 12 | 0.00 | L | -0.3u |
| 2026-05-23 | NBA | SPREAD | home | 5.0 | 3.00 | -107 | 5 | 1 | 6 | 2 | 24 | 0.20 | L | -3.0u |
| 2026-05-23 | NBA | TOTAL | under | 5.0 | 3.00 | +102 | 1 | -1 | 0 | 6 | 1 | 0.00 | L | -3.0u |
| 2026-05-23 | NHL | ML | home | 5.0 | 5.00 | -205 | 8 | 0 | 8 | 3 | 4 | -0.70 | W | +2.4u |
| 2026-05-23 | NHL | TOTAL | under | 3.0 | 0.30 | -110 | 1 | 1 | 2 | 0 | -3 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | home | 4.5 | 3.75 | -101 | 2 | 1 | 3 | 2 | -25 | 0.00 | L | -3.8u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -189 | 1 | 0 | 1 | 1 | 27 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -3 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 1 | 2 | 0 | -34 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | 1 | -6 | 0.00 | W | +4.3u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 0 | 1 | 1 | 10 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 2.5 | 0.50 | +144 | 1 | 1 | 2 | -2 | -63 | 0.00 | L | -0.5u |
| 2026-05-24 | MLB | SPREAD | home | 4.0 | 1.65 | -110 | 2 | 1 | 3 | 2 | -7 | -1.30 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -107 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +1.2u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 1.00 | -101 | 1 | 1 | 2 | 1 | 12 | 0.00 | W | +0.0u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 0.30 | -104 | 0 | 0 | 0 | 0 | 3 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | away | 4.0 | 1.25 | +148 | 2 | 2 | 4 | 0 | -31 | -1.40 | W | +1.9u |
| 2026-05-24 | MLB | ML | away | 3.0 | 1.25 | -122 | -1 | 1 | 0 | 0 | -27 | -1.10 | L | -1.3u |
| 2026-05-24 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 2 | -4 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | SPREAD | home | 3.0 | 0.75 | +134 | 1 | 0 | 1 | 1 | 1 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | -34 | 0.00 | W | +0.7u |
| 2026-05-24 | NBA | SPREAD | away | 5.0 | 1.65 | -103 | 3 | 0 | 3 | 1 | 2 | 0.50 | L | -1.6u |
| 2026-05-24 | NBA | TOTAL | over | 4.5 | 3.00 | -107 | 2 | 1 | 3 | 2 | -21 | 0.00 | L | -3.0u |
| 2026-05-24 | NHL | ML | away | 4.0 | 2.75 | -136 | 3 | 0 | 3 | 1 | 4 | -0.70 | L | -2.8u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -149 | 1 | 0 | 1 | 3 | 20 | -0.70 | L | -5.0u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -310 | 2 | 0 | 2 | 2 | 29 | -1.20 | W | +1.6u |
| 2026-05-25 | MLB | TOTAL | over | 4.0 | 1.65 | +103 | 1 | 0 | 1 | 2 | 22 | 0.00 | L | -1.6u |
| 2026-05-25 | MLB | ML | home | 4.0 | 1.25 | -125 | 1 | -1 | 0 | 1 | -1 | -1.90 | L | -1.3u |
| 2026-05-25 | MLB | SPREAD | away | 4.0 | 1.65 | -184 | 1 | 0 | 1 | 1 | -6 | 28.40 | W | +2.4u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 2.25 | -112 | 4 | 0 | 4 | 3 | 8 | 0.00 | L | -2.3u |
| 2026-05-25 | MLB | ML | home | 5.0 | 1.25 | -160 | 3 | 0 | 3 | 2 | -38 | -1.10 | L | -1.3u |
| 2026-05-25 | MLB | TOTAL | over | 5.0 | 3.00 | -110 | 3 | 0 | 3 | 3 | 32 | 0.00 | W | +2.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 3.75 | -108 | 0 | 0 | 0 | 3 | -26 | -1.70 | L | -3.8u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -124 | 2 | 0 | 2 | 2 | -7 | -1.30 | W | +0.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 5.00 | -119 | 2 | -1 | 1 | 4 | 13 | -0.60 | W | +3.1u |
| 2026-05-25 | MLB | ML | away | 2.5 | 2.75 | -113 | 0 | 0 | 0 | 0 | -10 | -1.80 | W | +1.1u |
| 2026-05-25 | MLB | ML | home | 4.0 | 5.00 | -209 | -1 | 0 | -1 | 3 | 20 | -0.80 | W | +2.3u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 0.75 | -101 | 2 | 1 | 3 | 1 | -3 | 0.00 | W | +0.7u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -178 | 1 | 0 | 1 | 2 | -7 | -1.60 | W | +0.9u |
| 2026-05-25 | NBA | ML | away | 5.0 | 5.00 | -125 | 0 | 0 | 0 | 3 | 26 | -0.40 | W | +4.0u |
| 2026-05-25 | NBA | TOTAL | under | 5.0 | 3.00 | -110 | 2 | 2 | 4 | 0 | -2 | 0.00 | L | -3.0u |
| 2026-05-25 | NHL | ML | home | 5.0 | 2.50 | +120 | 8 | 4 | 12 | 1 | -4 | -0.60 | L | -2.5u |
| 2026-05-25 | NHL | SPREAD | home | 4.5 | 2.25 | -215 | 1 | 1 | 2 | 1 | 1 | -0.80 | W | +1.1u |
| 2026-05-26 | MLB | TOTAL | over | 5.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | -7 | 0.00 | W | +1.5u |
| 2026-05-26 | MLB | ML | away | 5.0 | 1.50 | +200 | 2 | 0 | 2 | 2 | -23 | -1.00 | L | -1.5u |
| 2026-05-26 | MLB | SPREAD | away | 5.0 | 1.00 | -101 | 2 | 1 | 3 | 2 | -7 | 0.50 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 2.5 | 1.25 | +113 | 0 | 0 | 0 | 0 | 15 | -1.50 | W | +1.4u |
| 2026-05-26 | MLB | ML | home | 2.5 | 1.25 | -130 | 1 | 0 | 1 | 0 | 15 | -1.30 | W | +1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -200 | 1 | 0 | 1 | 2 | 39 | -0.60 | W | +1.9u |
| 2026-05-26 | MLB | SPREAD | home | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 2 | 22 | -0.20 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -102 | 3 | 1 | 4 | 2 | -25 | -0.50 | W | +4.9u |
| 2026-05-26 | MLB | ML | home | 5.0 | 3.75 | -108 | 3 | 1 | 4 | 2 | 6 | -0.20 | L | -3.8u |
| 2026-05-26 | MLB | ML | home | 5.0 | 5.00 | -105 | 2 | 1 | 3 | 2 | 39 | -2.00 | W | +3.6u |
| 2026-05-26 | MLB | ML | away | 5.0 | 2.50 | +116 | 1 | 0 | 1 | 2 | 39 | -1.00 | W | +2.9u |
| 2026-05-26 | NBA | ML | home | 5.0 | 5.00 | -198 | 2 | 4 | 6 | 2 | 12 | -0.70 | W | +1.9u |
| 2026-05-26 | NBA | SPREAD | home | 5.0 | 1.00 | -110 | 2 | 2 | 4 | 3 | 21 | 1.20 | W | +0.0u |
| 2026-05-26 | NBA | TOTAL | over | 5.0 | 3.00 | -108 | 0 | 0 | 0 | 3 | -3 | 0.00 | W | +2.6u |
| 2026-05-26 | NHL | SPREAD | home | 5.0 | 2.25 | -250 | 2 | 0 | 2 | 2 | 6 | 0.80 | W | +0.9u |
| 2026-05-27 | MLB | ML | home | 4.5 | 0.50 | -102 | 3 | 1 | 4 | 2 | 19 | -1.10 | W | +0.4u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 2.50 | +141 | 1 | 1 | 2 | 3 | -7 | 0.80 | L | -2.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.00 | +105 | 2 | 0 | 2 | 2 | -7 | 0.00 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 4.5 | 3.75 | -420 | 1 | 1 | 2 | 1 | 27 | -0.50 | W | +0.7u |
| 2026-05-27 | MLB | ML | home | 3.0 | 1.25 | -144 | -1 | -1 | -2 | 0 | -13 | -1.00 | L | -1.3u |
| 2026-05-27 | MLB | ML | away | 5.0 | 0.50 | -102 | 3 | 0 | 3 | 1 | -3 | -1.00 | L | -0.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | 12 | 0.40 | W | +0.5u |
| 2026-05-27 | MLB | TOTAL | under | 5.0 | 1.00 | -112 | 3 | 1 | 4 | 3 | 8 | 0.00 | W | +0.0u |
| 2026-05-27 | MLB | ML | away | 4.0 | 1.00 | -108 | 1 | -1 | 0 | 0 | 25 | -0.90 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 5.0 | 0.50 | +132 | 2 | 0 | 2 | 2 | 22 | -0.50 | L | -0.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.65 | +104 | 2 | 0 | 2 | 2 | 22 | 0.00 | W | +1.7u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 0.75 | +104 | 2 | 0 | 2 | 2 | 27 | 0.00 | W | +0.8u |
| 2026-05-27 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 2 | 5 | 3 | 0 | -0.30 | L | -2.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.5 | 1.65 | -145 | 1 | 1 | 2 | 1 | 12 | -0.30 | W | +1.1u |
| 2026-05-27 | MLB | ML | away | 5.0 | 5.00 | -126 | 2 | 0 | 2 | 2 | 9 | -4.10 | L | -5.0u |
| 2026-05-27 | MLB | ML | home | 4.0 | 1.25 | -190 | 1 | 0 | 1 | 1 | 27 | -0.70 | W | +0.7u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 3.00 | -135 | 0 | 0 | 0 | 2 | 12 | -0.90 | W | +2.2u |
| 2026-05-27 | NHL | SPREAD | home | 5.0 | 1.00 | -194 | 3 | 0 | 3 | 1 | 1 | 0.00 | L | -1.0u |
| 2026-05-27 | NHL | TOTAL | over | 5.0 | 2.25 | -112 | 3 | 0 | 3 | 1 | -1 | 0.00 | L | -2.3u |
| 2026-05-28 | MLB | TOTAL | over | 5.0 | 3.00 | +101 | 3 | -1 | 2 | 3 | 51 | 0.00 | W | +2.5u |
| 2026-05-28 | MLB | ML | home | 5.0 | 1.25 | -140 | 2 | 0 | 2 | 2 | -20 | -0.50 | L | -1.3u |
| 2026-05-28 | MLB | TOTAL | under | 5.0 | 1.00 | -107 | 1 | 0 | 1 | 1 | 27 | 0.00 | W | +0.0u |
| 2026-05-28 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 1 | 4 | 2 | -53 | -0.60 | L | -2.5u |
| 2026-05-28 | MLB | TOTAL | over | 2.5 | 1.65 | -108 | 2 | 0 | 2 | 2 | -7 | 0.00 | L | -1.6u |
| 2026-05-28 | NBA | SPREAD | away | 5.0 | 1.00 | -110 | 1 | 2 | 3 | 0 | -2 | -0.90 | L | -1.0u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.50 | +118 | 5 | 1 | 6 | 4 | 32 | -0.90 | L | -2.5u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 0.75 | -135 | 2 | 0 | 2 | 1 | -35 | 1.00 | L | -0.8u |
| 2026-05-29 | MLB | ML | home | 5.0 | 3.75 | -124 | 2 | 1 | 3 | 3 | 20 | -1.00 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 1.65 | -106 | 2 | 0 | 2 | 3 | 27 | 0.00 | L | -1.6u |
| 2026-05-29 | MLB | ML | home | 4.0 | 2.50 | +120 | 1 | 0 | 1 | 1 | -4 | 0.40 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 2.25 | -112 | 2 | 0 | 2 | 3 | 51 | 0.00 | W | +2.0u |
| 2026-05-29 | MLB | SPREAD | away | 4.0 | 0.75 | +150 | 0 | 0 | 0 | 1 | 12 | -0.50 | L | -0.8u |
| 2026-05-29 | MLB | ML | away | 5.0 | 2.50 | +140 | 2 | 1 | 3 | 1 | -36 | 1.00 | L | -2.5u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 1.65 | -103 | 0 | 0 | 0 | 2 | -7 | 0.00 | W | +1.6u |
| 2026-05-29 | MLB | ML | away | 4.5 | 1.25 | -142 | 0 | 1 | 1 | -1 | 22 | -1.20 | W | +0.3u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 1.65 | -135 | 1 | 0 | 1 | 2 | -7 | 0.40 | W | +1.2u |
| 2026-05-29 | MLB | ML | home | 4.5 | 1.25 | -134 | 1 | 0 | 1 | 0 | -24 | -1.70 | W | +2.8u |
| 2026-05-29 | MLB | SPREAD | away | 5.0 | 2.25 | -184 | 0 | 0 | 0 | 1 | 12 | -1.00 | W | +1.2u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 0.75 | -109 | 1 | 0 | 1 | 2 | 27 | 0.00 | W | +0.7u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.75 | -106 | 2 | 1 | 3 | 1 | 25 | 0.70 | L | -2.8u |
| 2026-05-29 | MLB | SPREAD | home | 4.0 | 1.65 | -175 | 0 | 0 | 0 | 2 | -7 | -0.80 | L | -1.6u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 0.30 | +105 | 2 | 1 | 3 | 0 | -2 | 0.00 | W | +0.3u |
| 2026-05-29 | MLB | ML | home | 4.5 | 3.75 | -122 | 0 | 1 | 1 | 1 | 12 | -0.60 | L | -3.8u |
| 2026-05-29 | MLB | TOTAL | over | 3.0 | 1.00 | -108 | 0 | 0 | 0 | 1 | 12 | 0.00 | W | +1.5u |
| 2026-05-29 | NHL | ML | away | 5.0 | 1.00 | +205 | 3 | 0 | 3 | 0 | -4 | -0.60 | L | -1.0u |
| 2026-05-29 | NHL | SPREAD | away | 5.0 | 3.00 | -118 | 3 | 1 | 4 | 1 | -4 | 0.00 | L | -3.0u |
| 2026-05-29 | NHL | TOTAL | under | 5.0 | 2.25 | -106 | 2 | 0 | 2 | 2 | 1 | 0.00 | L | -2.3u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +132 | 2 | 1 | 3 | 2 | -25 | 0.00 | L | -2.5u |
| 2026-05-30 | MLB | ML | away | 4.5 | 2.75 | -125 | 1 | 2 | 3 | 1 | 32 | -0.60 | W | +2.3u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -130 | 1 | 0 | 1 | 2 | -4 | -1.20 | L | -5.0u |
| 2026-05-30 | MLB | ML | away | 4.0 | 3.75 | -132 | 1 | 1 | 2 | 1 | 61 | -1.00 | W | +2.9u |
| 2026-05-30 | MLB | SPREAD | home | 3.0 | 0.75 | -143 | 0 | 1 | 1 | 0 | -18 | -1.40 | L | -0.8u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -118 | 1 | 1 | 2 | 1 | -3 | -1.30 | L | -3.8u |
| 2026-05-30 | MLB | SPREAD | away | 4.0 | 1.00 | +152 | 1 | 0 | 1 | 1 | 12 | 0.20 | L | -1.0u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | 3 | -26 | -1.10 | W | +4.2u |
| 2026-05-30 | MLB | TOTAL | over | 4.5 | 0.75 | +100 | 1 | 1 | 2 | 1 | -8 | 0.00 | W | +0.8u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.75 | -130 | 0 | 1 | 1 | 0 | 15 | -1.60 | W | +0.4u |
| 2026-05-30 | MLB | TOTAL | over | 4.0 | 2.25 | -116 | 2 | 0 | 2 | 2 | 27 | 0.00 | W | +1.9u |
| 2026-05-30 | MLB | TOTAL | under | 4.0 | 1.65 | -107 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -1.6u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.50 | +129 | 1 | 0 | 1 | 1 | -19 | -0.90 | W | +0.7u |
| 2026-05-30 | MLB | SPREAD | home | 5.0 | 1.65 | -120 | 2 | 1 | 3 | 2 | -7 | -0.60 | W | +1.4u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +108 | 1 | 0 | 1 | 3 | -26 | -0.90 | W | +2.7u |
| 2026-05-30 | MLB | ML | home | 4.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | -19 | -0.20 | W | +0.6u |
| 2026-05-30 | MLB | ML | home | 5.0 | 1.25 | -102 | 2 | 0 | 2 | 2 | 8 | -0.70 | W | +1.2u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -122 | 1 | 1 | 2 | 2 | -7 | -0.20 | L | -3.8u |
| 2026-05-30 | MLB | TOTAL | under | 3.0 | 0.75 | -108 | 0 | 0 | 0 | 1 | 12 | 0.00 | L | -0.8u |
| 2026-05-30 | NBA | ML | home | 5.0 | 1.00 | -154 | 3 | 3 | 6 | 0 | 5 | 0.00 | L | -1.0u |
| 2026-05-30 | NBA | TOTAL | under | 5.0 | 2.50 | -109 | 5 | 0 | 5 | 6 | 6 | 0.00 | L | -2.5u |
| 2026-05-31 | MLB | ML | away | 3.0 | 2.75 | -125 | -2 | 0 | -2 | 1 | -1 | -1.20 | L | -2.8u |
| 2026-05-31 | MLB | TOTAL | under | 5.0 | 1.65 | -114 | 2 | 0 | 2 | 3 | 8 | 0.00 | L | -1.6u |
| 2026-05-31 | MLB | ML | home | 2.5 | 2.75 | -115 | 1 | 1 | 2 | 1 | 41 | 0.00 | W | +2.4u |
| 2026-05-31 | MLB | ML | away | 5.0 | 1.00 | +115 | -1 | 0 | -1 | 2 | -7 | -0.60 | L | -1.0u |
| 2026-05-31 | MLB | SPREAD | away | 5.0 | 1.00 | -117 | 3 | 1 | 4 | 3 | 3 | -0.20 | L | -1.0u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -164 | 0 | 1 | 1 | 2 | -7 | -1.20 | W | +2.3u |
| 2026-05-31 | MLB | ML | away | 3.0 | 1.25 | -184 | 0 | 0 | 0 | 0 | -31 | -1.70 | W | +0.7u |
| 2026-05-31 | MLB | ML | home | 2.5 | 1.25 | -232 | 0 | 0 | 0 | 1 | 43 | -0.50 | W | +0.5u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -102 | 0 | 1 | 1 | 2 | -40 | 0.20 | W | +4.9u |
| 2026-05-31 | MLB | TOTAL | over | 4.0 | 1.00 | +101 | 2 | 1 | 3 | 2 | 8 | 0.00 | L | -1.0u |
| 2026-05-31 | MLB | ML | away | 4.5 | 2.50 | +110 | 0 | 0 | 0 | 0 | -31 | -1.10 | L | -2.5u |
| 2026-06-01 | MLB | ML | home | 4.5 | 3.00 | -155 | 3 | 2 | 5 | 3 | 39 | -1.00 | W | +2.1u |
| 2026-06-01 | MLB | ML | away | 4.0 | 1.00 | +135 | 2 | 2 | 4 | 3 | 49 | -0.20 | W | +1.4u |
| 2026-06-01 | MLB | ML | away | 5.0 | 2.50 | +160 | 2 | -1 | 1 | 2 | 24 | -1.30 | W | +2.7u |
| 2026-06-01 | MLB | TOTAL | under | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 2 | -8 | 0.00 | L | -1.0u |
| 2026-06-01 | MLB | ML | home | 3.0 | 0.50 | -142 | -1 | 0 | -1 | -1 | 14 | -0.40 | L | -0.5u |
| 2026-06-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 15 | 0.00 | L | -5.0u |
| 2026-06-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 2 | -25 | 0.00 | W | +2.7u |
| 2026-06-02 | MLB | ML | home | 2.5 | 0.25 | -215 | -1 | 0 | -1 | 0 | 16 | -1.40 | L | -0.3u |
| 2026-06-02 | MLB | TOTAL | under | 4.0 | 1.00 | -117 | 1 | 0 | 1 | 0 | 3 | 0.00 | L | -1.0u |
| 2026-06-02 | MLB | ML | away | 5.0 | 2.50 | +130 | 2 | 0 | 2 | 0 | 50 | -0.60 | W | +3.1u |
| 2026-06-02 | MLB | ML | away | 3.0 | 0.50 | +100 | 1 | 0 | 1 | 2 | 39 | -1.20 | W | +0.5u |
| 2026-06-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 17 | 0.00 | L | -3.0u |
| 2026-06-02 | MLB | ML | home | 4.0 | 1.00 | -112 | 1 | 0 | 1 | 1 | 27 | -1.10 | L | -1.0u |
| 2026-06-02 | MLB | ML | home | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 1 | 27 | -0.50 | L | -1.0u |
| 2026-06-02 | MLB | ML | away | 5.0 | 2.50 | +102 | 0 | -1 | -1 | 1 | -10 | 0.00 | L | -2.5u |
| 2026-06-02 | NHL | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 2 | 4 | 2 | 13 | 0.00 | W | +4.3u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -150 | 3 | 1 | 4 | 5 | 14 | -1.30 | W | +0.3u |
| 2026-06-03 | MLB | ML | away | 4.0 | 1.00 | +134 | -1 | -1 | -2 | -1 | 34 | -1.00 | W | +1.2u |
| 2026-06-03 | MLB | ML | away | 4.0 | 1.00 | +125 | 0 | -1 | -1 | 0 | 49 | 0.40 | W | +1.3u |
| 2026-06-03 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 47 | 0.00 | L | -3.0u |
| 2026-06-03 | MLB | ML | home | 4.5 | 1.50 | +167 | 0 | 0 | 0 | -1 | 6 | -0.40 | L | -1.5u |
| 2026-06-03 | MLB | SPREAD | away | 4.0 | 1.00 | -111 | 1 | 0 | 1 | 0 | 3 | 0.20 | W | +0.8u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -103 | 3 | 1 | 4 | 3 | 9 | -1.20 | L | -0.5u |
| 2026-06-03 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | -15 | 0.00 | L | -5.0u |
| 2026-06-03 | MLB | ML | away | 3.0 | 0.50 | +119 | 1 | 0 | 1 | 0 | 32 | 0.00 | W | +0.6u |
| 2026-06-03 | MLB | ML | away | 4.5 | 3.00 | -137 | 0 | 0 | 0 | -1 | 34 | -1.50 | L | -3.0u |
| 2026-06-03 | MLB | ML | home | 5.0 | 5.00 | -215 | 0 | 1 | 1 | 0 | 46 | -1.00 | W | +2.3u |
| 2026-06-03 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 1 | 1 | 2 | 1 | -24 | 0.00 | L | -0.3u |
| 2026-06-03 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 1 | 0 | 1 | 0 | 3 | 0.00 | W | +2.5u |
| 2026-06-03 | MLB | ML | home | 4.5 | 3.00 | -112 | 0 | 0 | 0 | 1 | 27 | -0.90 | W | +2.7u |
| 2026-06-03 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 1 | -3 | 0.00 | W | +4.5u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -139 | 0 | 0 | 0 | -1 | 65 | -1.20 | W | +0.3u |
| 2026-06-03 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 1 | 0 | 1 | 0 | 3 | 0.00 | L | -2.5u |
| 2026-06-03 | NBA | ML | home | 2.5 | 0.25 | -198 | 3 | 4 | 7 | 5 | 9 | -1.20 | L | -0.3u |
| 2026-06-03 | NBA | SPREAD | away | 2.5 | 0.25 | -104 | 3 | -1 | 2 | 4 | 1 | -1.20 | W | +0.2u |
| 2026-06-04 | MLB | ML | away | 3.0 | 0.50 | +104 | 1 | 0 | 1 | 2 | 22 | 0.00 | W | +0.5u |
| 2026-06-04 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | -1 | 0 | 0 | 21 | 0.00 | L | -1.0u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | +102 | 0 | 0 | 0 | 1 | 27 | 0.00 | L | -1.0u |
| 2026-06-04 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 1 | 62 | -0.40 | W | +3.0u |
| 2026-06-04 | MLB | SPREAD | away | 5.0 | 5.00 | -111 | 0 | 0 | 0 | 1 | 15 | 0.00 | L | -5.0u |
| 2026-06-04 | MLB | ML | home | 5.0 | 5.00 | -131 | 1 | 0 | 1 | 1 | 62 | 0.20 | W | +3.5u |
| 2026-06-04 | MLB | ML | away | 2.5 | 0.25 | +105 | 0 | 0 | 0 | 0 | -25 | -1.00 | W | +0.2u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | -210 | 1 | 0 | 1 | 2 | 73 | -1.00 | W | +0.5u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | -188 | 0 | 0 | 0 | 0 | 15 | -1.10 | L | -1.0u |
| 2026-06-04 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 21 | 0.00 | W | +2.7u |
| 2026-06-04 | MLB | ML | home | 3.0 | 0.50 | -235 | 4 | 0 | 4 | 4 | 34 | 0.00 | L | -0.5u |
| 2026-06-04 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 4 | 0.00 | L | -5.0u |
| 2026-06-04 | NHL | ML | home | 2.5 | 0.25 | -160 | -3 | 0 | -3 | 2 | 11 | -0.40 | W | +0.2u |
| 2026-06-05 | MLB | ML | home | 2.5 | 0.25 | -144 | 1 | 1 | 2 | 0 | 23 | -1.20 | L | -0.3u |
| 2026-06-05 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | -1 | -1 | -1 | 14 | 0.00 | W | +2.8u |
| 2026-06-05 | MLB | ML | away | 3.0 | 0.50 | +128 | 1 | 0 | 1 | 0 | 20 | 0.00 | W | +0.6u |
| 2026-06-05 | MLB | TOTAL | over | 4.0 | 1.00 | -109 | 0 | 0 | 0 | 0 | 3 | 0.00 | P | +0.0u |
| 2026-06-05 | MLB | ML | home | 3.0 | 0.50 | -136 | 1 | 0 | 1 | 3 | 36 | 0.00 | W | +0.4u |
| 2026-06-05 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 3 | 0 | 3 | 4 | 23 | 0.00 | W | +0.4u |
| 2026-06-05 | MLB | ML | away | 5.0 | 5.00 | -122 | 0 | 1 | 1 | 1 | 47 | -0.80 | L | -5.0u |
| 2026-06-05 | MLB | ML | home | 5.0 | 5.00 | -171 | 0 | 2 | 2 | 3 | 55 | -0.20 | W | +2.7u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -188 | 2 | 0 | 2 | 2 | 39 | -0.90 | W | +0.5u |
| 2026-06-05 | MLB | ML | away | 4.0 | 1.00 | -105 | 1 | 0 | 1 | 1 | 27 | 0.00 | L | -1.0u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -141 | 3 | 2 | 5 | 3 | 23 | 0.30 | W | +0.7u |
| 2026-06-05 | MLB | TOTAL | over | 5.0 | 2.50 | -110 | 0 | 1 | 1 | -1 | 23 | 0.00 | W | +2.5u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -172 | 1 | 0 | 1 | 1 | 27 | 0.00 | L | -1.0u |
| 2026-06-05 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 0 | -1 | -1 | 0 | 3 | 0.00 | W | +4.4u |
| 2026-06-05 | MLB | ML | away | 4.5 | 3.00 | -129 | -1 | 1 | 0 | -2 | 26 | -1.10 | W | +2.2u |
| 2026-06-05 | MLB | SPREAD | away | 3.0 | 0.50 | +126 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.6u |
| 2026-06-05 | NBA | ML | home | 2.5 | 0.25 | -230 | 2 | 2 | 4 | 4 | 11 | 1.00 | L | -0.3u |
| 2026-06-05 | NBA | SPREAD | home | 2.5 | 0.25 | -106 | 3 | 0 | 3 | 0 | 4 | -0.70 | L | -0.3u |
| 2026-06-06 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 1 | 0 | 1 | 0 | 21 | 0.00 | W | +0.2u |
| 2026-06-06 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 2 | 0.00 | W | +2.7u |
| 2026-06-06 | MLB | ML | home | 4.5 | 3.00 | -126 | 0 | 0 | 0 | 0 | 15 | -1.00 | W | +2.4u |
| 2026-06-06 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | -4 | 0.00 | W | +2.7u |
| 2026-06-06 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 1 | 1 | -1 | 5 | 0.00 | L | -1.0u |
| 2026-06-06 | MLB | ML | home | 3.0 | 0.50 | -130 | 0 | 0 | 0 | -1 | 16 | -0.90 | L | -0.5u |
| 2026-06-06 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 10 | 0.00 | L | -5.0u |
| 2026-06-06 | MLB | ML | home | 4.5 | 3.00 | -350 | 0 | 1 | 1 | 0 | 62 | -0.90 | W | +0.9u |
| 2026-06-06 | MLB | TOTAL | under | 5.0 | 2.50 | -110 | 0 | 0 | 0 | 0 | 4 | 0.00 | L | -2.5u |
| 2026-06-06 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 1 | 4 | 3 | 9 | 0.00 | W | +2.8u |
| 2026-06-06 | MLB | ML | home | 5.0 | 5.00 | -123 | 0 | 0 | 0 | 1 | 10 | 0.00 | W | +4.1u |
| 2026-06-06 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | L | -1.0u |
| 2026-06-06 | MLB | ML | home | 5.0 | 2.50 | +117 | -2 | -1 | -3 | -1 | -6 | 0.00 | L | -2.5u |
| 2026-06-06 | MLB | ML | home | 5.0 | 5.00 | -154 | 2 | 1 | 3 | 0 | 50 | -0.80 | L | -5.0u |
| 2026-06-07 | MLB | ML | home | 4.5 | 3.00 | -130 | 1 | 0 | 1 | 0 | 46 | -0.90 | W | +2.2u |
| 2026-06-07 | MLB | TOTAL | over | 3.0 | 0.50 | -112 | 0 | 0 | 0 | 3 | 19 | 0.00 | L | -0.5u |
| 2026-06-07 | MLB | ML | home | 5.0 | 5.00 | -143 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +3.5u |
| 2026-06-07 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | -4 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -136 | 1 | 0 | 1 | 0 | 46 | 0.00 | W | +0.7u |
| 2026-06-07 | MLB | ML | home | 4.5 | 3.00 | -165 | 2 | 2 | 4 | 3 | 20 | -1.10 | W | +1.8u |
| 2026-06-07 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 1 | -3 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | away | 2.5 | 0.25 | -107 | 1 | 0 | 1 | -1 | 35 | -0.80 | W | +0.2u |
| 2026-06-07 | MLB | TOTAL | over | 2.5 | 0.25 | -115 | 0 | 0 | 0 | -1 | -21 | 0.00 | W | +0.2u |
| 2026-06-07 | MLB | ML | home | 2.5 | 0.25 | -210 | -1 | 0 | -1 | 1 | 43 | 0.80 | L | -0.3u |
| 2026-06-07 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | -4 | 0.00 | L | -0.5u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | +158 | 1 | 0 | 1 | 3 | 21 | -1.30 | L | -0.5u |
| 2026-06-07 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.9u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -105 | 1 | 0 | 1 | 1 | 27 | 0.00 | L | -1.0u |
| 2026-06-07 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 10 | 0.00 | L | -5.0u |
| 2026-06-07 | MLB | SPREAD | away | 4.5 | 3.00 | -152 | 2 | 0 | 2 | 1 | 33 | -0.50 | W | +1.9u |
| 2026-06-07 | MLB | TOTAL | over | 5.0 | 2.25 | -114 | 1 | 1 | 2 | 1 | -9 | 0.00 | L | -2.3u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | +102 | 1 | 0 | 1 | -2 | -5 | -0.20 | W | +0.5u |
| 2026-06-07 | MLB | SPREAD | away | 4.5 | 2.25 | +164 | 1 | 1 | 2 | 1 | 12 | 29.50 | W | +3.7u |
| 2026-06-07 | MLB | ML | away | 2.5 | 0.25 | +103 | -1 | 0 | -1 | -2 | -24 | 0.20 | W | +0.3u |
| 2026-06-07 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | -1 | 0 | 1 | 17 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -102 | 2 | 0 | 2 | 0 | 15 | 0.50 | W | +1.0u |
| 2026-06-07 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 6 | 0.00 | W | +4.8u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | -127 | 0 | 1 | 1 | -1 | 35 | -1.90 | W | +0.4u |
| 2026-06-07 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | -4 | 0.00 | W | +0.5u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -113 | 6 | 1 | 7 | 6 | 67 | -0.50 | L | -3.0u |
| 2026-06-08 | MLB | ML | home | 4.5 | 3.00 | -129 | 3 | 0 | 3 | 2 | 48 | -0.40 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | -1 | -6 | 0.00 | L | -3.0u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -121 | 1 | 1 | 2 | 0 | 26 | -1.60 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 51 | 0.00 | P | +0.0u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -146 | 1 | 0 | 1 | 0 | 26 | -0.50 | W | +2.0u |
| 2026-06-08 | MLB | ML | home | 4.0 | 1.00 | -118 | 2 | 0 | 2 | 2 | -50 | -0.40 | L | -1.0u |
| 2026-06-08 | MLB | TOTAL | over | 4.5 | 2.50 | -116 | -2 | -2 | -4 | -2 | 19 | 0.00 | W | +2.5u |
| 2026-06-08 | MLB | ML | away | 4.5 | 1.50 | +151 | 0 | -1 | -1 | 0 | 15 | 0.00 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | under | 5.0 | 2.50 | +101 | 0 | 0 | 0 | -1 | -9 | 0.00 | W | +2.5u |
| 2026-06-08 | NBA | ML | home | 2.5 | 0.25 | -132 | 5 | 2 | 7 | 3 | 6 | -0.40 | L | -0.3u |
| 2026-06-08 | NBA | SPREAD | away | 5.0 | 5.00 | -110 | 3 | 2 | 5 | 2 | 4 | -1.30 | W | +4.3u |
| 2026-06-08 | NBA | TOTAL | under | 4.0 | 1.00 | -107 | 1 | 0 | 1 | 3 | -1 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 2.5 | 0.25 | +132 | 1 | 0 | 1 | 3 | 39 | -1.20 | L | -0.3u |
| 2026-06-09 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 4 | 0.00 | W | +4.3u |
| 2026-06-09 | MLB | ML | away | 3.0 | 0.50 | -148 | 1 | 0 | 1 | 3 | 33 | 0.00 | L | -0.5u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 4 | 48 | 0.80 | L | -1.0u |
| 2026-06-09 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -143 | 1 | 0 | 1 | 1 | 27 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | SPREAD | home | 4.5 | 3.00 | -117 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +2.6u |
| 2026-06-09 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | -1 | 8 | 0.00 | W | +0.5u |
| 2026-06-09 | MLB | ML | away | 5.0 | 5.00 | -122 | 2 | 1 | 3 | 1 | 10 | 0.00 | W | +4.1u |
| 2026-06-09 | MLB | ML | away | 2.5 | 0.25 | -120 | 0 | 0 | 0 | 0 | 12 | 0.00 | L | -0.3u |
| 2026-06-09 | MLB | ML | home | 4.0 | 1.00 | -107 | 1 | 0 | 1 | 0 | 33 | -1.30 | L | -1.0u |
| 2026-06-09 | MLB | ML | home | 5.0 | 5.00 | -105 | 1 | -1 | 0 | 1 | -3 | 0.00 | W | +4.8u |
| 2026-06-09 | MLB | ML | away | 4.5 | 2.50 | +115 | 1 | 0 | 1 | 0 | 15 | -0.70 | L | -2.5u |
| 2026-06-09 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 6 | 0.00 | W | +2.7u |
| 2026-06-09 | MLB | ML | away | 3.0 | 0.50 | -116 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.4u |
| 2026-06-09 | MLB | ML | home | 5.0 | 2.50 | +100 | 4 | 2 | 6 | 0 | -7 | 0.00 | W | +2.5u |
| 2026-06-09 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | -1 | 4 | 0.00 | W | +4.5u |
| 2026-06-09 | MLB | ML | home | 4.0 | 1.00 | +102 | 2 | 0 | 2 | 2 | -5 | -1.20 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -119 | 1 | 0 | 1 | 0 | 46 | -0.80 | L | -1.0u |
| 2026-06-09 | NHL | SPREAD | away | 4.5 | 1.00 | +215 | 0 | 0 | 0 | 2 | 11 | 41.70 | W | +2.1u |
| 2026-06-09 | NHL | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 2 | 13 | 0.00 | L | -5.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 11 | 0.00 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 4.5 | 3.00 | -148 | 0 | 0 | 0 | 0 | 21 | -0.50 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | +136 | 3 | 0 | 3 | 5 | 48 | -1.10 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | W | +0.9u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | -172 | 1 | 0 | 1 | 2 | 25 | -1.00 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | -3 | 0.00 | W | +4.5u |
| 2026-06-10 | MLB | ML | away | 3.0 | 0.50 | +136 | 0 | 0 | 0 | -2 | 18 | 0.00 | L | -0.5u |
| 2026-06-10 | MLB | TOTAL | under | 4.0 | 1.00 | -113 | 1 | 0 | 1 | 1 | 12 | 0.00 | L | -1.0u |
| 2026-06-10 | MLB | ML | home | 2.5 | 0.25 | -117 | 0 | 0 | 0 | 1 | -10 | 0.00 | W | +0.2u |
| 2026-06-10 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 1 | -3 | 0.00 | L | -5.0u |
| 2026-06-10 | MLB | ML | home | 4.0 | 1.00 | +178 | 1 | 0 | 1 | -2 | 28 | -1.40 | W | +1.7u |
| 2026-06-10 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 3 | 0 | 3 | 0 | -7 | 0.00 | W | +4.5u |
| 2026-06-10 | MLB | ML | away | 5.0 | 5.00 | -104 | 0 | 0 | 0 | 1 | 15 | -0.20 | L | -5.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | +148 | 0 | 0 | 0 | 0 | 33 | -0.80 | W | +1.5u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-10 | MLB | ML | home | 4.5 | 2.50 | +103 | 0 | 0 | 0 | 1 | -3 | 0.00 | W | +2.6u |
| 2026-06-10 | MLB | ML | home | 4.0 | 1.00 | -127 | 1 | 0 | 1 | 1 | 27 | 0.00 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 25 | 0.00 | W | +3.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | -120 | 1 | 0 | 1 | 1 | 27 | -0.40 | W | +0.8u |
| 2026-06-10 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | -1 | 0 | -1 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 5.0 | 5.00 | -106 | 1 | 0 | 1 | -1 | 36 | -0.70 | L | -5.0u |
| 2026-06-10 | MLB | SPREAD | home | 2.5 | 1.00 | -190 | 0 | 0 | 0 | 0 | -13 | -31.40 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 4 | 1 | 5 | -1 | -10 | 0.00 | L | -5.0u |
| 2026-06-10 | NBA | ML | away | 2.5 | 0.25 | +112 | -2 | 0 | -2 | -3 | -11 | 0.20 | L | -0.3u |
| 2026-06-10 | NBA | TOTAL | under | 2.5 | 0.25 | -108 | 4 | 1 | 5 | 3 | 9 | 0.00 | W | +0.2u |
| 2026-06-11 | MLB | ML | away | 4.0 | 1.00 | +112 | 0 | 0 | 0 | 0 | 15 | 0.00 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -120 | -1 | 0 | -1 | 4 | 2 | -1.70 | P | +0.0u |
| 2026-06-11 | MLB | SPREAD | away | 4.5 | 2.50 | +140 | 1 | 0 | 1 | 3 | 3 | -1.00 | P | +0.0u |
| 2026-06-11 | MLB | ML | home | 5.0 | 5.00 | — | 1 | 0 | 1 | 1 | -4 | 0.00 | L | -5.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -167 | 1 | -1 | 0 | 1 | 55 | -0.10 | W | +0.3u |
| 2026-06-11 | MLB | TOTAL | under | 5.0 | 1.00 | -108 | 1 | 1 | 2 | 0 | -21 | 0.00 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 5.0 | 1.00 | +110 | 3 | 1 | 4 | 3 | 20 | -0.90 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -111 | 1 | 0 | 1 | 1 | 27 | 0.00 | L | -0.5u |
| 2026-06-11 | MLB | ML | home | 5.0 | 5.00 | -131 | 2 | 1 | 3 | 0 | -7 | 0.00 | W | +3.8u |
| 2026-06-11 | MLB | ML | away | 4.0 | 1.00 | +100 | 1 | 0 | 1 | 1 | -34 | -0.50 | W | +1.0u |
| 2026-06-11 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | -1 | -2 | 0 | 17 | 0.00 | W | +0.2u |
| 2026-06-11 | NHL | TOTAL | under | 3.0 | 0.50 | -104 | 2 | 0 | 2 | 3 | 14 | 0.00 | P | +0.0u |
| 2026-06-12 | MLB | ML | home | 5.0 | 5.00 | -114 | 0 | 0 | 0 | 0 | -7 | 0.00 | W | +4.4u |
| 2026-06-12 | MLB | ML | home | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -13 | 0.00 | L | -3.0u |
| 2026-06-12 | MLB | TOTAL | over | 4.0 | 1.00 | +100 | 0 | 0 | 0 | 0 | 3 | 0.00 | L | -1.0u |
| 2026-06-12 | MLB | ML | home | 3.0 | 0.50 | -210 | 2 | 0 | 2 | 2 | 21 | -0.10 | W | +0.2u |
| 2026-06-12 | MLB | ML | away | 2.5 | 0.25 | +111 | 3 | 1 | 4 | 3 | 20 | -0.70 | L | -0.3u |
| 2026-06-12 | MLB | ML | away | 4.0 | 1.00 | -114 | 2 | 0 | 2 | 1 | -3 | -1.20 | W | +0.9u |
| 2026-06-12 | MLB | ML | home | 5.0 | 2.50 | +123 | 0 | 1 | 1 | 0 | 1 | 0.00 | W | +3.1u |
| 2026-06-12 | MLB | SPREAD | away | 4.0 | 1.00 | +121 | 0 | 0 | 0 | 2 | 27 | 0.40 | L | -1.0u |
| 2026-06-12 | MLB | ML | home | 4.5 | 3.00 | -138 | 1 | 0 | 1 | 0 | 33 | -1.00 | L | -3.0u |
| 2026-06-12 | MLB | SPREAD | home | 3.0 | 0.50 | -107 | 2 | 0 | 2 | 2 | 9 | -0.40 | W | +0.4u |
| 2026-06-12 | MLB | ML | away | 2.5 | 0.25 | +118 | -1 | 0 | -1 | -1 | -29 | -0.20 | L | -0.3u |
| 2026-06-12 | MLB | ML | away | 4.0 | 1.00 | -136 | 2 | 0 | 2 | 2 | 21 | -1.30 | W | +0.7u |
| 2026-06-12 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | -1 | -1 | 1 | 15 | 0.00 | W | +2.7u |
| 2026-06-12 | MLB | ML | home | 3.0 | 0.50 | -134 | 2 | 0 | 2 | 3 | 33 | -1.10 | W | +0.4u |
| 2026-06-12 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -3 | 0.00 | W | +2.7u |
| 2026-06-12 | MLB | SPREAD | away | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 0 | 21 | -1.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | away | 5.0 | 5.00 | -128 | 3 | 0 | 3 | 1 | 46 | -0.20 | L | -5.0u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | +123 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | away | 4.5 | 3.00 | -102 | 0 | 0 | 0 | 1 | 15 | -2.00 | W | +2.9u |
| 2026-06-13 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 0 | 11 | 0.00 | W | +4.5u |
| 2026-06-13 | MLB | ML | away | 2.5 | 0.25 | -118 | 0 | 0 | 0 | -2 | 34 | -1.30 | W | +0.2u |
| 2026-06-13 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +2.7u |
| 2026-06-13 | MLB | ML | away | 4.5 | 2.50 | +136 | 1 | 0 | 1 | -2 | -23 | 1.30 | L | -2.5u |
| 2026-06-13 | MLB | ML | home | 5.0 | 2.50 | +134 | 2 | 0 | 2 | -1 | -9 | 0.00 | W | +3.4u |
| 2026-06-13 | MLB | SPREAD | home | 4.0 | 1.00 | -130 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.8u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | -120 | 1 | 0 | 1 | 2 | 9 | 0.20 | W | +0.8u |
| 2026-06-13 | MLB | ML | away | 4.5 | 2.50 | +114 | 1 | 0 | 1 | 0 | 3 | 0.00 | L | -2.5u |
| 2026-06-13 | MLB | TOTAL | under | 4.0 | 1.00 | +101 | 0 | 0 | 0 | 0 | 3 | 0.00 | W | +1.0u |
| 2026-06-13 | MLB | ML | home | 4.5 | 3.00 | -157 | 0 | 0 | 0 | -1 | -3 | 0.00 | L | -3.0u |
| 2026-06-13 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 33 | 0.00 | W | +0.5u |
| 2026-06-13 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | -1 | 4 | -0.40 | W | +4.3u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | -106 | 0 | 0 | 0 | 1 | 15 | 0.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | home | 4.0 | 1.00 | -112 | 0 | 0 | 0 | 2 | 9 | -1.30 | W | +0.8u |
| 2026-06-13 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 15 | 0.00 | L | -5.0u |
| 2026-06-13 | NBA | ML | home | 2.5 | 0.25 | -205 | 6 | 6 | 12 | 6 | -27 | 0.60 | L | -0.3u |
| 2026-06-14 | MLB | ML | away | 4.0 | 1.00 | +106 | 1 | 1 | 2 | 3 | 6 | -1.50 | L | -1.0u |
| 2026-06-14 | MLB | ML | home | 2.5 | 0.25 | -124 | 1 | 0 | 1 | 2 | -19 | -1.50 | W | +0.2u |
| 2026-06-14 | MLB | SPREAD | away | 5.0 | 5.00 | -180 | 1 | 0 | 1 | 0 | 6 | 0.00 | L | -5.0u |
| 2026-06-14 | MLB | ML | home | 5.0 | 5.00 | -192 | 1 | 0 | 1 | 1 | 2 | 0.00 | L | -5.0u |
| 2026-06-14 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | ML | away | 4.5 | 2.50 | +106 | 0 | 0 | 0 | 1 | 15 | 0.00 | L | -2.5u |
| 2026-06-14 | MLB | SPREAD | away | 4.5 | 3.00 | -116 | 2 | 0 | 2 | 2 | 4 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | SPREAD | away | 4.0 | 1.00 | -158 | 1 | -1 | 0 | 1 | 33 | 0.10 | W | +0.6u |
| 2026-06-14 | MLB | ML | away | 4.0 | 1.00 | -125 | 2 | 1 | 3 | 4 | 34 | -1.20 | W | +0.8u |
| 2026-06-14 | MLB | ML | away | 4.5 | 3.00 | -101 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | ML | away | 2.5 | 0.25 | -115 | 2 | 0 | 2 | 3 | 33 | 0.00 | W | +0.2u |
| 2026-06-14 | NHL | ML | away | 2.5 | 0.25 | -115 | -1 | 1 | 0 | 1 | -5 | -0.20 | W | +0.2u |
| 2026-06-14 | NHL | TOTAL | under | 5.0 | 5.00 | -110 | -1 | 0 | -1 | 1 | 5 | 0.00 | W | +4.4u |
| 2026-06-15 | MLB | ML | home | 4.0 | 1.00 | -204 | 1 | 0 | 1 | 1 | 27 | -0.60 | W | +0.0u |
| 2026-06-15 | MLB | SPREAD | away | 4.5 | 3.00 | -114 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +2.9u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | SPREAD | home | 4.0 | 1.00 | +153 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-15 | MLB | TOTAL | over | 4.5 | 2.50 | -110 | 0 | 0 | 0 | 0 | 3 | 0.00 | W | +0.0u |
| 2026-06-15 | MLB | ML | away | 3.0 | 0.50 | +115 | 2 | 0 | 2 | 3 | 18 | -0.80 | L | -0.5u |
| 2026-06-15 | MLB | ML | away | 3.0 | 0.50 | +160 | 2 | 0 | 2 | 0 | 23 | -0.70 | L | -0.5u |
| 2026-06-15 | MLB | SPREAD | away | 2.5 | 0.25 | -120 | 0 | 0 | 0 | -1 | -2 | 0.00 | L | -0.3u |
| 2026-06-15 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 2 | 33 | 0.00 | L | -3.0u |
| 2026-06-15 | MLB | ML | home | 2.5 | 0.25 | -157 | 1 | 0 | 1 | 3 | 20 | -0.20 | L | -0.3u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | ML | home | 3.0 | 0.50 | -132 | 3 | 1 | 4 | 3 | 8 | -0.70 | W | +2.2u |
| 2026-06-15 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | ML | home | 3.0 | 0.50 | -154 | 1 | 0 | 1 | 3 | 0 | 0.50 | W | +0.0u |
| 2026-06-15 | MLB | SPREAD | away | 5.0 | 5.00 | -160 | 1 | 0 | 1 | 1 | 10 | -1.30 | L | -5.0u |
| 2026-06-15 | MLB | ML | home | 2.5 | 0.25 | -161 | -1 | 1 | 0 | -2 | 4 | -1.00 | W | +0.0u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -1.0u |
| 2026-06-15 | SOC | ML | home | 2.5 | 0.25 | -105 | 3 | 3 | 6 | 1 | -1 | -1.10 | L | -0.3u |
| 2026-06-16 | MLB | ML | home | 4.0 | 1.00 | -145 | 1 | 0 | 1 | 1 | 27 | -1.00 | W | +0.0u |
| 2026-06-16 | MLB | SPREAD | away | 4.5 | 1.00 | -162 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | TOTAL | under | 5.0 | 5.00 | -101 | 1 | 0 | 1 | 1 | 7 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -194 | 1 | 0 | 1 | -1 | 23 | 0.40 | L | -3.0u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-16 | MLB | SPREAD | home | 4.0 | 1.00 | +156 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -163 | 5 | 3 | 8 | 5 | 41 | -1.00 | W | +2.4u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | -1 | 0 | -1 | -1 | -19 | 0.00 | L | -3.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -135 | 3 | 2 | 5 | 1 | 11 | -2.10 | W | +4.5u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 6 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | away | 2.5 | 0.25 | -106 | 1 | 0 | 1 | 1 | 27 | -0.20 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -174 | 2 | 1 | 3 | 2 | 36 | -1.40 | W | +2.3u |
| 2026-06-16 | MLB | ML | away | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 0 | 23 | -0.80 | L | -1.0u |
| 2026-06-16 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 2 | 22 | 0.00 | L | -5.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -138 | 0 | 0 | 0 | 0 | 23 | 0.70 | L | -0.5u |
| 2026-06-16 | MLB | ML | away | 3.0 | 0.50 | -102 | 1 | 0 | 1 | 1 | 27 | -1.00 | L | -0.5u |
| 2026-06-16 | MLB | SPREAD | away | 4.0 | 1.00 | -160 | 0 | 0 | 0 | 2 | 22 | 30.10 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -161 | 1 | 1 | 2 | 1 | 6 | -0.40 | L | -0.5u |
| 2026-06-16 | MLB | ML | away | 5.0 | 2.50 | +120 | -1 | -1 | -2 | -1 | 25 | -1.80 | L | -2.5u |
| 2026-06-16 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 2 | 9 | 0.00 | L | -1.0u |
| 2026-06-16 | MLB | ML | away | 2.5 | 0.25 | -112 | 1 | 0 | 1 | 2 | 8 | -0.90 | W | +0.0u |
| 2026-06-16 | MLB | SPREAD | away | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-16 | SOC | ML | home | 4.0 | 1.00 | +1375 | 1 | 0 | 1 | -2 | -28 | 0.00 | L | -1.0u |
| 2026-06-17 | MLB | ML | away | 2.5 | 0.25 | +126 | -2 | 0 | -2 | -2 | -16 | -0.40 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +2.7u |
| 2026-06-17 | MLB | ML | away | 4.5 | 2.50 | +112 | -1 | -1 | -2 | -1 | 40 | -1.20 | L | -2.5u |
| 2026-06-17 | MLB | ML | home | 5.0 | 5.00 | -173 | 1 | 0 | 1 | 1 | -7 | 0.00 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +2.7u |
| 2026-06-17 | MLB | ML | away | 5.0 | 2.50 | +100 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +2.5u |
| 2026-06-17 | MLB | ML | home | 4.5 | 2.50 | +115 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -2.5u |
| 2026-06-17 | MLB | SPREAD | home | 4.5 | 3.00 | -141 | 0 | 0 | 0 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-17 | MLB | SPREAD | away | 5.0 | 5.00 | -181 | 0 | 0 | 0 | 1 | 10 | -0.80 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 2 | 6 | 0.00 | L | -5.0u |
| 2026-06-17 | MLB | ML | home | 2.5 | 0.25 | -157 | 0 | 0 | 0 | 0 | 18 | -1.10 | W | +0.0u |
| 2026-06-17 | MLB | SPREAD | home | 2.5 | 0.25 | +125 | -1 | 0 | -1 | -1 | 18 | -0.60 | L | -0.3u |
| 2026-06-17 | MLB | ML | home | 5.0 | 5.00 | -123 | 1 | 0 | 1 | 0 | 15 | 0.00 | L | -5.0u |
| 2026-06-17 | MLB | SPREAD | home | 4.0 | 1.00 | +161 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-17 | SOC | ML | away | 5.0 | 1.00 | +1028 | 1 | 0 | 1 | -5 | -34 | 0.00 | L | -1.0u |
| 2026-06-17 | SOC | ML | home | 4.0 | 1.00 | -140 | 0 | 0 | 0 | 0 | 3 | -0.30 | W | +0.0u |
| 2026-06-17 | SOC | ML | home | 4.0 | 1.00 | +142 | 1 | 0 | 1 | 2 | -3 | 0.00 | W | +0.0u |
| 2026-06-18 | MLB | ML | home | 4.0 | 1.00 | -138 | 1 | 0 | 1 | 1 | 2 | 0.00 | W | +0.0u |
| 2026-06-18 | MLB | ML | home | 4.5 | 3.00 | -141 | 1 | 1 | 2 | 1 | 41 | -1.30 | L | -3.0u |
| 2026-06-18 | MLB | ML | home | 4.5 | 3.00 | -151 | 3 | 0 | 3 | 3 | 46 | -1.50 | W | +0.0u |
| 2026-06-18 | MLB | ML | away | 4.5 | 2.50 | +108 | 3 | 1 | 4 | 4 | -2 | -1.20 | W | +2.6u |
| 2026-06-18 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +2.7u |
| 2026-06-18 | MLB | SPREAD | away | 4.5 | 3.00 | -199 | 1 | 0 | 1 | 2 | 4 | 0.00 | L | -3.0u |
| 2026-06-18 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 3 | -3 | 0.00 | W | +2.8u |
| 2026-06-18 | SOC | ML | home | 5.0 | 2.50 | +113 | 2 | 0 | 2 | 5 | 0 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | ML | home | 4.5 | 3.00 | -205 | 1 | 0 | 1 | 1 | 9 | 0.10 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 4.5 | 3.00 | -114 | 0 | 0 | 0 | 2 | 27 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 5.0 | 5.00 | -194 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 3.0 | 0.50 | -117 | 0 | 0 | 0 | 0 | 3 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | ML | away | 4.5 | 1.00 | +239 | 1 | 0 | 1 | 1 | -7 | 0.00 | L | -1.0u |
| 2026-06-19 | MLB | SPREAD | home | 4.5 | 3.00 | -111 | 1 | 1 | 2 | 0 | 9 | 0.00 | W | +3.1u |
| 2026-06-19 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 2 | -11 | 0.00 | L | -3.0u |
| 2026-06-19 | MLB | ML | away | 4.0 | 1.00 | +107 | 0 | 0 | 0 | 0 | -31 | 0.00 | L | -1.0u |
| 2026-06-19 | MLB | SPREAD | away | 4.0 | 1.00 | -115 | 2 | 0 | 2 | 3 | 31 | 0.00 | W | +2.5u |
| 2026-06-19 | MLB | ML | away | 4.5 | 2.50 | +141 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -2.5u |
| 2026-06-19 | MLB | ML | home | 2.5 | 0.25 | +158 | -1 | -1 | -2 | -1 | -15 | -1.10 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 4.5 | 2.50 | -101 | 0 | -1 | -1 | 0 | 21 | -0.70 | L | -2.5u |
| 2026-06-19 | MLB | ML | home | 4.5 | 3.00 | -163 | -1 | -1 | -2 | -1 | 55 | -0.40 | W | +2.4u |
| 2026-06-19 | MLB | SPREAD | home | 4.5 | 2.50 | +130 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -5.0u |
| 2026-06-19 | MLB | ML | home | 3.0 | 0.50 | -152 | 1 | 0 | 1 | 1 | 27 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | home | 2.5 | 0.25 | +147 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.3u |
| 2026-06-19 | MLB | ML | home | 5.0 | 1.00 | -109 | 1 | 0 | 1 | 1 | -7 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-19 | MLB | SPREAD | home | 2.5 | 0.25 | +170 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.3u |
| 2026-06-19 | SOC | ML | away | 3.0 | 0.50 | +2500 | 0 | 0 | 0 | -4 | -27 | 0.00 | L | -0.5u |
| 2026-06-19 | SOC | ML | home | 4.5 | 2.50 | +108 | 1 | 0 | 1 | 5 | 23 | -2.40 | L | -2.5u |
| 2026-06-20 | MLB | SPREAD | away | 5.0 | 5.00 | -194 | 0 | 0 | 0 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | ML | home | 4.5 | 3.00 | -200 | -2 | 0 | -2 | -3 | -24 | -1.30 | L | -3.0u |
| 2026-06-20 | MLB | SPREAD | home | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-20 | MLB | ML | away | 4.5 | 2.50 | +123 | 2 | 0 | 2 | 3 | 0 | -3.20 | L | -2.5u |
| 2026-06-20 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | 1 | 0 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | 4 | 0.00 | W | +1.8u |
| 2026-06-20 | MLB | ML | away | 3.0 | 0.50 | +116 | 0 | 0 | 0 | -2 | -2 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | -1 | 0 | -1 | -1 | -19 | 0.00 | L | -1.0u |
| 2026-06-20 | MLB | ML | home | 4.0 | 1.00 | -190 | 2 | 1 | 3 | 0 | 32 | -1.70 | W | +2.0u |
| 2026-06-20 | MLB | ML | home | 5.0 | 5.00 | -137 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +2.2u |
| 2026-06-20 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-20 | SOC | ML | away | 2.5 | 0.25 | +474 | -3 | 0 | -3 | -20 | -45 | 0.00 | L | -0.3u |
| 2026-06-20 | SOC | ML | away | 2.5 | 0.25 | +2200 | 0 | 0 | 0 | -1 | -15 | -0.20 | L | -0.3u |
| 2026-06-21 | MLB | ML | home | 4.0 | 1.00 | -226 | 1 | 0 | 1 | 1 | 43 | 0.30 | L | -1.0u |
| 2026-06-21 | MLB | SPREAD | away | 5.0 | 5.00 | -190 | 0 | 0 | 0 | 1 | 10 | -0.50 | L | -5.0u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 2.50 | +100 | 1 | 1 | 2 | 1 | 31 | 0.00 | W | +2.5u |
| 2026-06-21 | MLB | ML | home | 4.0 | 1.00 | -104 | -1 | 0 | -1 | -1 | -38 | -0.50 | L | -1.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-21 | MLB | ML | away | 5.0 | 2.50 | +113 | 0 | 0 | 0 | 1 | -4 | 0.00 | L | -2.5u |
| 2026-06-21 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 18 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-21 | MLB | ML | away | 2.5 | 0.25 | +110 | 0 | 0 | 0 | 1 | 27 | -1.00 | W | +0.0u |
| 2026-06-21 | MLB | SPREAD | home | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | 0 | -1.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | ML | home | 4.5 | 3.00 | -178 | 3 | 0 | 3 | 3 | 51 | -1.30 | W | +1.6u |
| 2026-06-21 | MLB | ML | home | 3.0 | 0.50 | +130 | 0 | 0 | 0 | 0 | 23 | -0.80 | L | -0.5u |
| 2026-06-21 | MLB | ML | home | 3.0 | 0.50 | +123 | 1 | 0 | 1 | 1 | 27 | -0.20 | W | +0.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | -1 | -4 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | SPREAD | away | 5.0 | 2.50 | +130 | 0 | 0 | 0 | 1 | 10 | -1.30 | W | +0.0u |
| 2026-06-21 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 2 | 0 | 2 | 2 | 14 | 0.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 1.00 | -114 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +0.0u |
| 2026-06-21 | SOC | ML | away | 4.5 | 1.00 | +725 | 2 | 0 | 2 | -4 | -46 | 0.00 | L | -1.0u |
| 2026-06-21 | SOC | ML | home | 4.0 | 1.00 | +650 | 2 | 0 | 2 | 1 | 1 | -0.20 | L | -1.0u |
| 2026-06-21 | SOC | ML | draw | 3.0 | 0.50 | +950 | 0 | 0 | 0 | -9 | -33 | 0.00 | L | -0.5u |
| 2026-06-22 | MLB | ML | home | 4.5 | 3.00 | -138 | 0 | 0 | 0 | 0 | 11 | 0.30 | W | +0.0u |
| 2026-06-22 | MLB | SPREAD | away | 5.0 | 5.00 | -168 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 1.00 | +105 | 1 | 0 | 1 | 1 | 7 | 0.00 | L | -1.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 13 | 0.00 | L | -3.0u |
| 2026-06-22 | MLB | SPREAD | away | 5.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 15 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +2.7u |
| 2026-06-22 | MLB | ML | home | 5.0 | 5.00 | -124 | 1 | 0 | 1 | 1 | 10 | -1.20 | W | +2.3u |
| 2026-06-22 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 3 | 0 | 3 | 3 | 37 | 0.00 | W | +2.7u |
| 2026-06-22 | MLB | ML | home | 3.0 | 0.50 | -180 | 1 | 0 | 1 | 1 | 27 | -1.30 | L | -0.5u |
| 2026-06-22 | MLB | ML | home | 5.0 | 2.50 | +133 | 0 | 0 | 0 | 0 | -8 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | ML | home | 5.0 | 2.50 | +137 | 0 | 0 | 0 | 0 | -8 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | SPREAD | home | 4.5 | 1.00 | -109 | 0 | 0 | 0 | -1 | 12 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | SPREAD | away | 4.5 | 2.50 | +138 | 2 | 0 | 2 | 1 | 31 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | TOTAL | under | 4.0 | 1.00 | -104 | 2 | 1 | 3 | 2 | 9 | 0.00 | W | +3.9u |
| 2026-06-22 | MLB | ML | away | 5.0 | 5.00 | — | 1 | 0 | 1 | 1 | 3 | 0.00 | L | -5.0u |
| 2026-06-22 | SOC | ML | draw | 4.5 | 1.00 | +350 | -1 | 0 | -1 | -16 | -40 | -0.70 | L | -1.0u |
| 2026-06-22 | SOC | ML | home | 2.5 | 0.25 | -950 | 1 | 0 | 1 | 8 | 46 | 0.00 | W | +0.0u |
| 2026-06-22 | SOC | ML | home | 4.5 | 2.50 | +139 | 1 | 0 | 1 | 9 | 43 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | home | 3.0 | 0.50 | -109 | 0 | 0 | 0 | 0 | 15 | -1.80 | L | -0.5u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 5.00 | -168 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | -4 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -108 | 2 | 0 | 2 | 3 | -3 | -1.40 | L | -3.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -133 | 1 | 0 | 1 | 2 | 16 | -1.40 | L | -3.0u |
| 2026-06-23 | MLB | SPREAD | away | 3.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -0.5u |
| 2026-06-23 | MLB | ML | away | 3.0 | 0.50 | -162 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | SPREAD | home | 4.0 | 1.00 | -107 | 0 | 0 | 0 | 0 | -21 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 5.00 | -114 | 0 | 0 | 0 | -1 | -22 | 0.00 | L | -5.0u |
| 2026-06-23 | MLB | ML | home | 2.5 | 0.25 | -125 | 1 | 0 | 1 | 1 | 5 | -1.90 | L | -0.3u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 1.00 | -102 | 1 | 2 | 3 | 1 | 1 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -172 | 1 | 0 | 1 | 1 | -6 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 1.00 | -109 | 2 | 0 | 2 | 2 | -3 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 2.50 | +132 | 1 | 0 | 1 | 1 | -6 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | ML | home | 5.0 | 2.50 | +104 | 1 | 0 | 1 | 1 | -7 | 0.00 | L | -2.5u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | 10 | 0.00 | L | -5.0u |
| 2026-06-23 | MLB | ML | away | 4.0 | 1.00 | +117 | 1 | 0 | 1 | 1 | 34 | -0.20 | L | -1.0u |
| 2026-06-23 | MLB | SPREAD | away | 2.5 | 0.25 | +106 | 1 | 0 | 1 | 1 | 33 | -1.50 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -8 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | home | 4.5 | 1.00 | -153 | 2 | 0 | 2 | 2 | 15 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | SPREAD | home | 3.0 | 0.50 | +139 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 4.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | -1 | 0.00 | L | -1.0u |
| 2026-06-23 | SOC | ML | home | 2.5 | 0.25 | -450 | 1 | 0 | 1 | 0 | 0 | 0.60 | L | -0.3u |
| 2026-06-23 | SOC | ML | away | 4.5 | 1.00 | +1800 | 1 | 0 | 1 | -3 | -21 | 0.00 | L | -1.0u |
| 2026-06-24 | MLB | SPREAD | away | 5.0 | 5.00 | -214 | 0 | 0 | 0 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 4.5 | 3.00 | -132 | 1 | 0 | 1 | 0 | 16 | -1.10 | L | -3.0u |
| 2026-06-24 | MLB | SPREAD | away | 4.0 | 1.00 | +155 | 1 | 0 | 1 | 1 | 15 | -0.30 | L | -1.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 3.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | 27 | 0.00 | L | -0.5u |
| 2026-06-24 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -21 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 2.50 | +152 | 2 | 0 | 2 | 2 | 36 | -1.10 | W | +5.8u |
| 2026-06-24 | MLB | SPREAD | away | 5.0 | 5.00 | -105 | 0 | 0 | 0 | 1 | 10 | 0.00 | L | -5.0u |
| 2026-06-24 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | -1 | 0 | 2 | -2 | 0.00 | W | +3.6u |
| 2026-06-24 | MLB | ML | away | 4.5 | 2.50 | -134 | 1 | 0 | 1 | 2 | 7 | -0.20 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | -1 | -12 | 0.00 | L | -5.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 3.00 | -134 | 1 | 0 | 1 | 0 | -8 | -1.90 | L | -3.0u |
| 2026-06-24 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 3.0 | 0.50 | +132 | 0 | 0 | 0 | 0 | 23 | -2.20 | L | -0.5u |
| 2026-06-24 | MLB | SPREAD | home | 4.0 | 1.00 | -115 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-24 | MLB | ML | away | 4.5 | 2.50 | +117 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 16 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 2.5 | 0.25 | -102 | -1 | 0 | -1 | -1 | 6 | -0.70 | W | +0.0u |
| 2026-06-24 | MLB | SPREAD | away | 4.0 | 1.00 | +136 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -1.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 2.50 | +108 | 0 | 0 | 0 | 0 | -10 | 0.00 | L | -2.5u |
| 2026-06-24 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-24 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -0.5u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 1.00 | -115 | 2 | 0 | 2 | 2 | 16 | 0.00 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 4.0 | 1.00 | +153 | 3 | 0 | 3 | 2 | 27 | -1.10 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 4.5 | 3.00 | -525 | 4 | 1 | 5 | 3 | 53 | 0.50 | W | +1.1u |
| 2026-06-24 | SOC | ML | away | 4.5 | 3.00 | -104 | -1 | 0 | -1 | 2 | 27 | -1.00 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 2.5 | 0.25 | -257 | 2 | 0 | 2 | 2 | 25 | -1.10 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.0u |
| 2026-06-25 | MLB | SPREAD | away | 4.5 | 1.00 | +164 | 1 | 1 | 2 | 1 | 12 | 27.50 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 2 | -2 | 0.00 | W | +3.6u |
| 2026-06-25 | MLB | ML | away | 2.5 | 0.25 | -136 | 3 | 0 | 3 | 2 | 23 | -2.40 | L | -0.3u |
| 2026-06-25 | MLB | SPREAD | away | 5.0 | 2.50 | +114 | 2 | 0 | 2 | 1 | -1 | -1.90 | L | -2.5u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -116 | 0 | 0 | 0 | 0 | -2 | 0.00 | L | -3.0u |
| 2026-06-25 | MLB | ML | home | 4.5 | 1.00 | +443 | 1 | 0 | 1 | 1 | -5 | 0.00 | L | -1.0u |
| 2026-06-25 | MLB | SPREAD | away | 4.5 | 3.00 | -105 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 1 | 1 | -1 | -15 | 0.00 | L | -0.3u |
| 2026-06-25 | SOC | ML | home | 4.5 | 1.50 | +163 | -1 | 0 | -1 | -1 | 2 | 0.00 | L | -1.5u |
| 2026-06-25 | SOC | ML | away | 2.5 | 0.25 | -600 | 4 | 1 | 5 | 4 | 36 | -0.70 | W | +0.0u |
| 2026-06-25 | SOC | ML | away | 4.0 | 1.00 | -110 | 12 | 7 | 19 | 12 | 39 | -0.90 | L | -1.0u |
| 2026-06-25 | SOC | ML | away | 5.0 | 5.00 | -700 | 5 | 1 | 6 | 5 | 31 | 1.80 | W | +0.5u |
| 2026-06-25 | SOC | ML | away | 2.5 | 0.25 | -105 | 4 | 4 | 8 | 5 | 2 | -0.20 | L | -0.3u |
| 2026-06-26 | MLB | ML | away | 4.5 | 3.00 | -120 | 2 | 0 | 2 | 2 | 21 | -0.80 | W | +3.3u |
| 2026-06-26 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-26 | MLB | SPREAD | home | 2.5 | 0.25 | -117 | 0 | 1 | 1 | 0 | 16 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | 1 | 10 | 0.00 | L | -5.0u |
| 2026-06-26 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 5.0 | 2.50 | +100 | 0 | 0 | 0 | 0 | 5 | 0.00 | L | -2.5u |
| 2026-06-26 | MLB | SPREAD | home | 2.5 | 0.25 | -135 | 1 | 0 | 1 | 1 | -1 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | SPREAD | away | 4.5 | 3.00 | -204 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | home | 4.0 | 1.00 | -2261 | 0 | 0 | 0 | -1 | -35 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 2.5 | 0.25 | -154 | 0 | 0 | 0 | 0 | -12 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | SPREAD | away | 4.5 | 2.50 | +110 | 1 | 1 | 2 | 1 | 25 | 0.00 | L | -2.5u |
| 2026-06-26 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -6 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 1 | 15 | -1.00 | W | +0.0u |
| 2026-06-26 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-26 | MLB | ML | away | 3.0 | 0.50 | +121 | 1 | 0 | 1 | 1 | 27 | -0.80 | L | -0.5u |
| 2026-06-26 | SOC | ML | away | 5.0 | 5.00 | -600 | 1 | 0 | 1 | 2 | 18 | -0.30 | W | +0.8u |
| 2026-06-26 | SOC | ML | away | 3.0 | 0.50 | -200 | 7 | 2 | 9 | 5 | 62 | -0.20 | W | +4.1u |
| 2026-06-26 | SOC | ML | away | 2.5 | 0.25 | -155 | 5 | 2 | 7 | 8 | 45 | 1.20 | W | +1.6u |
| 2026-06-26 | SOC | ML | home | 3.0 | 0.50 | +150 | 0 | 2 | 2 | -2 | 7 | -0.30 | L | -0.5u |
| 2026-06-26 | SOC | ML | home | 2.5 | 0.25 | -380 | -1 | 1 | 0 | -1 | 10 | 0.00 | W | +0.0u |
| 2026-06-26 | SOC | ML | home | 2.5 | 0.25 | +135 | -2 | 2 | 0 | -6 | -7 | -0.30 | L | -0.3u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._