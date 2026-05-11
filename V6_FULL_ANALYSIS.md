# Sharp Intel v6 — Full Analysis

_Auto-generated **5/11/2026, 11:51:04 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 161 shipped+graded picks · 2026-04-18 → 2026-05-10  (HC analyses scoped to post-cutover 2026-04-30, 49 picks)
**Headline:** 78-81-2 · WR 49.1% [41.4%–56.8%] vs 52.4% break-even · -3.2u flat (-2.0%) · -5.4u peak.
**Overall t-test:** t = -0.23 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.269 ✓ p<.01**  (full sample, N=155)
- **ρ(HC, flat ROI) = 0.175 ✗**  (post-cutover, N=49)
- **ρ(Δw+HC, flat ROI) = 0.157 ✗**  (post-cutover, N=49)

Cohort breakdown:

**Winning cohorts (t ≥ 1.645 with positive mean):**
- **Δw ≥ +3 (full sample)** — N=28, 20-8, WR 71.4% [53%–85%], flat ROI +53.1% (t=2.14 ✓ p<.05)

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0 (full sample)** — N=36, 10-25, WR 28.6% [16%–45%], flat ROI -43.6% (t=-2.95 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=4, WR 75.0%, flat ROI +45.8%. Bayesian posterior WR ≈ 57.1%, half-Kelly = **5.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=32, WR 56.3%, flat ROI +13.3%. Bayesian posterior WR ≈ 54.8%, half-Kelly = **2.5%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=7, WR 42.9%, flat ROI -16.6%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=28, WR 71.4%, flat ROI +53.1%. Bayesian posterior WR ≈ 65.8%, half-Kelly = **14.1%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -43.6% flat ROI on 36 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.07u/pick), we need **~1764 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 161. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-10 |
| Sides scanned | 368 |
| Shipped + graded | **161** |
| W-L-P | 78-81-2 |
| Win rate | **49.1%** [41.4%–56.8%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +3.3 pp |
| Peak-units PnL | **-5.4u** |
| Flat-1u PnL | **-3.2u** (-2.0% flat ROI) |
| Flat t-statistic vs zero | -0.23 → ✗ noise |
| Flat 95% CI per-pick | [-0.185, 0.146]u |

### Power note

At our observed flat-PnL standard deviation (1.07u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4900 |
| +5% | 1764 |
| +10% | 441 |

We have **161** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 28 | 9-18-1 | 33.3% [19–52] | -34.8% | -13.4u | -2.01 ✓ p<.05 |
| Δw = +1 | 54 | 29-24-1 | 54.7% [41–67] | +5.1% | +0.7u | 0.38 ✗ noise |
| Δw = +2 | 37 | 15-22-0 | 40.5% [26–57] | -16.1% | -15.6u | -0.94 ✗ noise |
| Δw ≥ +3 | 28 | 20-8-0 | 71.4% [53–85] | +53.1% | +25.1u | 2.14 ✓ p<.05 |

**Pearson ρ(Δw, WIN) = 0.255** ✓ p<.01  ·  **ρ(Δw, flat ROI) = 0.269** ✓ p<.01  (N=155)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 11 | 6-4-1 | 60.0% [31–83] | +14.0% | +2.3u | 0.49 ✗ noise |
| HC = +1 | 32 | 18-14-0 | 56.3% [39–72] | +13.3% | +0.9u | 0.71 ✗ noise |
| HC = +2 | 4 | 3-1-0 | 75.0% [30–95] | +45.8% | +5.5u | 0.94 ✗ noise |
| HC ≥ +3 | 0 | — | — | — | — | — |

**Pearson ρ(HC, WIN) = 0.194** ✗  ·  **ρ(HC, flat ROI) = 0.175** ✗  (N=49)

Spearman rank ρ(HC, flat ROI) = 0.176.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Σ = +1 | 11 | 5-5-1 | 50.0% [24–76] | +0.0% | -0.4u | 0.00 ✗ noise |
| Σ = +2 | 21 | 13-8-0 | 61.9% [41–79] | +22.3% | +1.6u | 1.02 ✗ noise |
| Σ = +3 | 7 | 2-5-0 | 28.6% [8–64] | -29.4% | -6.8u | -0.63 ✗ noise |
| Σ = +4 | 4 | 3-1-0 | 75.0% [30–95] | +30.2% | +3.2u | 0.65 ✗ noise |
| Σ = +5 | 3 | 2-1-0 | 66.7% [21–94] | +29.3% | +2.2u | 0.45 ✗ noise |
| Σ ≥ +6 | 2 | 2-0-0 | 100.0% [34–100] | +95.2% | +6.7u | 0.00 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = 0.198** ✗  ·  **ρ(Σ, flat ROI) = 0.157** ✗  (N=49)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 49.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.119 ✗ | 0.084 ✗ | 0.069 | weak |
| HC margin | 0.194 ✗ | 0.175 ✗ | 0.176 | weak |
| Δw + HC | 0.198 ✗ | 0.157 ✗ | 0.164 | weak |
| peak.stars | -0.043 ✗ | -0.052 ✗ | -0.015 | weak |
| vault.star | 0.006 ✗ | 0.057 ✗ | 0.085 | weak |
| lock.stars | -0.007 ✗ | -0.037 ✗ | 0.038 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 49 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | — | N=6 · 3-2 · 60% [23–88] · +12%  | N=4 · 2-2 · 50% [15–85] · -3%  | N=1 · 1-0 · 100% [21–100] · —  |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=5 · 2-3 · 40% [12–77] · -14%  | N=15 · 11-4 · 73% [48–89] · +45%  | N=7 · 2-5 · 29% [8–64] · -29%  | N=4 · 3-1 · 75% [30–95] · +30%  |
| +2 | — | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=3 · 3-0 · 100% [44–100] · +94% ★ |
| ≥ +3 | — | — | — | — | — | — | — |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 11 | 6-4-1 | 60.0% [31–83] | +14.0% | +2.3u | 0.49 ✗ noise |
| HC = +1 | 32 | 18-14-0 | 56.3% [39–72] | +13.3% | +0.9u | 0.71 ✗ noise |
| HC = +2 | 4 | 3-1-0 | 75.0% [30–95] | +45.8% | +5.5u | 0.94 ✗ noise |
| HC ≥ +3 | 0 | — | — | — | — | — |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 5 | 2-3-0 | 40.0% [12–77] | -14.0% | -0.1u | -0.26 ✗ noise |
| Δw = +1 | 21 | 14-6-1 | 70.0% [48–85] | +35.7% | +5.2u | 1.77 ~ p<.10 |
| Δw = +2 | 12 | 4-8-0 | 33.3% [14–61] | -26.4% | -11.8u | -0.82 ✗ noise |
| Δw ≥ +3 | 10 | 7-3-0 | 70.0% [40–89] | +29.9% | +13.0u | 1.03 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 36 | 21-15-0 | 58.3% [42–73] | +16.9% | +6.4u | 0.98 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 7 | 3-4-0 | 42.9% [16–75] | -16.6% | -0.8u | -0.42 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 6 | 3-2-1 | 60.0% [23–88] | +11.7% | -0.3u | 0.31 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 143 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δcount = −1 | 11 | 1-10-0 | 9.1% [2–38] | -77.7% | -14.9u | -3.49 ✓ p<.01 |
| Δcount = 0 (balanced) | 15 | 5-10-0 | 33.3% [15–58] | -42.0% | -9.1u | -1.88 ~ p<.10 |
| Δcount = +1 | 44 | 23-20-1 | 53.5% [39–67] | +6.4% | +1.5u | 0.42 ✗ noise |
| Δcount = +2 | 32 | 14-17-1 | 45.2% [29–62] | -11.3% | -4.8u | -0.64 ✗ noise |
| Δcount ≥ +3 (heavy support) | 40 | 28-12-0 | 70.0% [55–82] | +47.3% | +27.2u | 2.46 ✓ p<.05 |

**ρ(Δcount, WIN) = 0.326** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.357** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -3 · ≤ 1 · ≤ 4 · ≤ 12 · > 12

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 32 | 10-22-0 | 31.3% [18–49] | -38.1% | -18.6u | -2.28 ✓ p<.05 |
| Q2 | 31 | 10-20-1 | 33.3% [19–51] | -34.8% | -13.9u | -2.11 ✓ p<.05 |
| Q3 (balanced) | 24 | 12-12-0 | 50.0% [31–69] | +4.5% | -7.3u | 0.20 ✗ noise |
| Q4 | 28 | 18-10-0 | 64.3% [46–79] | +39.2% | +14.2u | 1.54 ✗ noise |
| Q5 (best — heavy support) | 28 | 21-6-1 | 77.8% [59–89] | +47.1% | +24.9u | 2.95 ✓ p<.01 |

**ρ(ΔWlNet, WIN) = 0.367** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.327** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -2.31 · ≤ 0.78 · ≤ 4.14 · ≤ 11.99 · > 11.99

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 29 | 8-21-0 | 27.6% [15–46] | -44.8% | -13.6u | -2.62 ✓ p<.01 |
| Q2 | 29 | 8-20-1 | 28.6% [15–47] | -41.7% | -21.0u | -2.47 ✓ p<.05 |
| Q3 | 28 | 12-16-0 | 42.9% [27–61] | -18.3% | -13.3u | -0.99 ✗ noise |
| Q4 | 29 | 22-7-0 | 75.9% [58–88] | +53.3% | +20.3u | 2.86 ✓ p<.01 |
| Q5 | 28 | 21-6-1 | 77.8% [59–89] | +60.7% | +27.0u | 2.75 ✓ p<.01 |

**ρ(ΔFlatPnl, WIN) = 0.388** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.411** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -15.6 · ≤ -0.9 · ≤ 12.3 · ≤ 29.5 · > 29.5

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 29 | 7-21-1 | 25.0% [13–43] | -43.5% | -13.2u | -2.29 ✓ p<.05 |
| Q2 | 29 | 8-21-0 | 27.6% [15–46] | -46.0% | -23.6u | -2.74 ✓ p<.01 |
| Q3 | 28 | 11-17-0 | 39.3% [24–58] | -24.7% | -13.6u | -1.35 ✗ noise |
| Q4 | 29 | 21-7-1 | 75.0% [57–87] | +41.4% | +13.8u | 2.54 ✓ p<.05 |
| Q5 | 28 | 24-4-0 | 85.7% [69–94] | +82.6% | +36.0u | 4.06 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.455** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.443** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 15 | 2-13-0 | 13.3% [4–38] | -72.4% | -12.5u | -3.85 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 14 | 4-10-0 | 28.6% [12–55] | -44.2% | -11.7u | -1.78 ~ p<.10 |
| ΔBestRank = 0 (tied) | 0 | — | — | — | — | — |
| ΔBestRank ∈ [+1,+4] | 9 | 3-6-0 | 33.3% [12–65] | -45.0% | -5.9u | -1.60 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 18 | 13-4-1 | 76.5% [53–90] | +58.9% | +14.2u | 2.26 ✓ p<.05 |

**ρ(ΔBestRank, WIN) = 0.518** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.501** ✓ p<.01  (N=56)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 13 | 3-10-0 | 23.1% [8–50] | -38.5% | -3.3u | -1.11 ✗ noise |
| Δshare ∈ [−30,−10] pp | 0 | — | — | — | — | — |
| Δshare ≈ 0 (±10 pp) | 90 | 36-52-2 | 40.9% [31–51] | -21.0% | -38.0u | -2.08 ✓ p<.05 |
| Δshare ∈ [+10,+30] pp | 8 | 5-3-0 | 62.5% [31–86] | +19.8% | +6.9u | 0.56 ✗ noise |
| Δshare ≥ +30 pp | 32 | 27-5-0 | 84.4% [68–93] | +76.8% | +33.8u | 4.08 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.324** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.279** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.455 ✓ p<.01 | 0.443 ✓ p<.01 | 0.441 |
| 2 | **ΔTopQCount** | 0.412 ✓ p<.01 | 0.432 ✓ p<.01 | 0.369 |
| 3 | **ΔFlatPnl** | 0.388 ✓ p<.01 | 0.411 ✓ p<.01 | 0.400 |
| 4 | **Δcount** | 0.326 ✓ p<.01 | 0.357 ✓ p<.01 | 0.269 |
| 5 | **ΔWlNet** | 0.367 ✓ p<.01 | 0.327 ✓ p<.01 | 0.341 |
| 6 | **ΔTopQShare** | 0.324 ✓ p<.01 | 0.279 ✓ p<.01 | 0.333 |

_(ΔBestRank uses N=56 subset where both sides had a proven wallet — ρ(flat ROI) = 0.501 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 143, dateRange = 2026-04-18 → 2026-05-10, computedAt = 2026-05-11T15:48:47.461Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **143** rows · PIT aggregate computable on **135** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **135** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 7 · 100% · +148.7% | 6 · 67% · +18.9% | -129.8pp |
| LOCK (+5..+7) | 10 · 60% · +11.3% | 19 · 63% · +18.6% | +7.3pp |
| STRONG (+3..+5) | 22 · 73% · +37.9% | 23 · 74% · +42.7% | +4.7pp |
| NEUTRAL (0..+3) | 34 · 53% · +6.0% | 32 · 39% · -22.3% | -28.3pp |
| WEAK (−3..0) | 18 · 47% · -6.8% | 21 · 38% · -22.7% | -15.9pp |
| FADE (<−3) | 35 · 21% · -58.8% | 25 · 38% · -9.9% | +48.9pp |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=17, WR=76%, ROI=+67.8% | N=25, WR=64%, ROI=+18.7% | -49.2pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=39, WR=74%, ROI=+51.0% | N=48, WR=69%, ROI=+30.2% | -20.8pp |
| AGS < −1 (mute veto) | N=44, WR=26%, ROI=-47.5% | N=40, WR=41%, ROI=-8.9% | +38.6pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-04-27 → 2026-05-10, N=68)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 5 · 80% · +42.6% |
| LOCK (+5..+7) | 13 · 62% · +20.8% |
| STRONG (+3..+5) | 12 · 67% · +32.7% |
| NEUTRAL (0..+3) | 17 · 44% · -14.1% |
| WEAK (−3..0) | 12 · 33% · -33.0% |
| FADE (<−3) | 9 · 44% · -11.4% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=18, WR=67%, ROI=+26.9% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=30, WR=67%, ROI=+29.2% |
| AGS < −1 (mute veto) | N=19, WR=42%, ROI=-15.7% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | TOTAL | + | 1.73 | 1.63 |
| `dContribution` | TOTAL | + | 102.66 | 96.84 |
| `dBestContrib` | CONCENTRATION | + | 47.07 | 42.51 |
| `dBestWalletBase` | CONCENTRATION | + | 43.84 | 37.53 |
| `dConvictionAvg` | BLENDED | + | 0.60 | 0.59 |
| `dRoiNormAvg` | BLENDED | + | 34.94 | 35.40 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **135/161** shipped+graded rows (84%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -15.45 |
| 20th pct | -2.90 |
| 40th pct | 0.90 |
| Median | 2.09 |
| 60th pct | 2.62 |
| 80th pct | 4.87 |
| 90th pct | 6.07 |
| Max | 11.06 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 6 | 4.4% |
| **LOCK** | +5..+7 | 20 | 14.8% |
| **STRONG** | +3..+5 | 24 | 17.8% |
| **NEUTRAL** | 0..+3 | 38 | 28.1% |
| **WEAK** | −3..0 | 22 | 16.3% |
| **FADE** | < −3 | 25 | 18.5% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 6 | 4-2-0 | 66.7% [30–90] | +18.9% | +3.6u | 0.48 ✗ noise |
| LOCK | 20 | 12-8-0 | 60.0% [39–78] | +12.7% | +1.7u | 0.59 ✗ noise |
| STRONG | 24 | 17-7-0 | 70.8% [51–85] | +36.7% | +13.8u | 1.98 ✓ p<.05 |
| NEUTRAL | 38 | 14-23-1 | 37.8% [24–54] | -24.7% | -7.7u | -1.55 ✗ noise |
| WEAK | 22 | 8-14-0 | 36.4% [20–57] | -26.2% | -5.6u | -1.21 ✗ noise |
| FADE | 25 | 9-15-1 | 37.5% [21–57] | -9.9% | -12.6u | -0.36 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (TOTAL)

r(WIN) = **0.148** ~ p<.10 · r(ROI) = **0.041** ✗ · Spearman ρ(ROI) = **0.076**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 20 | 9-11-0 | 45.0% [26–66] | +12.3% | -3.5u | 0.36 ✗ noise |
| z ∈ [−1, 0) | 42 | 19-21-2 | 47.5% [33–63] | -8.1% | -5.9u | -0.54 ✗ noise |
| z ∈ [0, +1) | 50 | 22-28-0 | 44.0% [31–58] | -16.0% | -11.1u | -1.16 ✗ noise |
| z ≥ +1 (very positive) | 23 | 14-9-0 | 60.9% [41–78] | +16.4% | +13.6u | 0.79 ✗ noise |

#### `dContribution` (TOTAL)

r(WIN) = **0.227** ✓ p<.01 · r(ROI) = **0.102** ✗ · Spearman ρ(ROI) = **0.148**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 11 | 3-7-1 | 30.0% [11–60] | -1.0% | -6.3u | -0.02 ✗ noise |
| z ∈ [−1, 0) | 52 | 20-31-1 | 39.2% [27–53] | -22.3% | -14.8u | -1.63 ✗ noise |
| z ∈ [0, +1) | 44 | 24-20-0 | 54.5% [40–68] | +7.0% | +5.6u | 0.47 ✗ noise |
| z ≥ +1 (very positive) | 28 | 17-11-0 | 60.7% [42–76] | +12.4% | +8.7u | 0.68 ✗ noise |

#### `dBestContrib` (CONCENTRATION)

r(WIN) = **0.263** ✓ p<.01 · r(ROI) = **0.148** ~ p<.10 · Spearman ρ(ROI) = **0.256**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 12 | 3-9-0 | 25.0% [9–53] | -17.6% | -6.9u | -0.35 ✗ noise |
| z ∈ [−1, 0) | 35 | 14-20-1 | 41.2% [26–58] | -20.5% | -15.8u | -1.23 ✗ noise |
| z ∈ [0, +1) | 65 | 30-34-1 | 46.9% [35–59] | -8.5% | +5.2u | -0.69 ✗ noise |
| z ≥ +1 (very positive) | 23 | 17-6-0 | 73.9% [54–87] | +42.1% | +10.6u | 2.26 ✓ p<.05 |

#### `dBestWalletBase` (CONCENTRATION)

r(WIN) = **0.182** ✓ p<.05 · r(ROI) = **0.090** ✗ · Spearman ρ(ROI) = **0.210**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 18 | 6-12-0 | 33.3% [16–56] | -17.1% | -6.8u | -0.49 ✗ noise |
| z ∈ [−1, 0) | 32 | 14-17-1 | 45.2% [29–62] | -10.5% | -7.0u | -0.58 ✗ noise |
| z ∈ [0, +1) | 63 | 27-36-0 | 42.9% [31–55] | -16.9% | -13.2u | -1.36 ✗ noise |
| z ≥ +1 (very positive) | 22 | 17-4-1 | 81.0% [60–92] | +54.3% | +20.2u | 3.23 ✓ p<.01 |

#### `dConvictionAvg` (BLENDED)

r(WIN) = **0.174** ✓ p<.05 · r(ROI) = **0.062** ✗ · Spearman ρ(ROI) = **0.135**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 15 | 4-11-0 | 26.7% [11–52] | -22.4% | -7.8u | -0.54 ✗ noise |
| z ∈ [−1, 0) | 33 | 17-15-1 | 53.1% [36–69] | +1.8% | -1.1u | 0.10 ✗ noise |
| z ∈ [0, +1) | 72 | 35-36-1 | 49.3% [38–61] | -3.6% | +6.7u | -0.31 ✗ noise |
| z ≥ +1 (very positive) | 15 | 8-7-0 | 53.3% [30–75] | +1.5% | -4.7u | 0.06 ✗ noise |

#### `dRoiNormAvg` (BLENDED)

r(WIN) = **0.158** ~ p<.10 · r(ROI) = **0.040** ✗ · Spearman ρ(ROI) = **0.140**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 16 | 5-11-0 | 31.3% [14–56] | -10.5% | -8.7u | -0.26 ✗ noise |
| z ∈ [−1, 0) | 35 | 16-18-1 | 47.1% [31–63] | -9.5% | -2.1u | -0.56 ✗ noise |
| z ∈ [0, +1) | 66 | 32-34-0 | 48.5% [37–60] | -5.8% | +8.4u | -0.48 ✗ noise |
| z ≥ +1 (very positive) | 18 | 11-6-1 | 64.7% [41–83] | +20.4% | -4.5u | 0.93 ✗ noise |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dBestContrib` | CONCENTRATION | 0.263 ✓ p<.01 | 0.148 ~ p<.10 | 0.256 |
| 2 | `dBestWalletBase` | CONCENTRATION | 0.182 ✓ p<.05 | 0.090 ✗ | 0.210 |
| 3 | `dContribution` | TOTAL | 0.227 ✓ p<.01 | 0.102 ✗ | 0.148 |
| 4 | `dRoiNormAvg` | BLENDED | 0.158 ~ p<.10 | 0.040 ✗ | 0.140 |
| 5 | `dConvictionAvg` | BLENDED | 0.174 ✓ p<.05 | 0.062 ✗ | 0.135 |
| 6 | `dCount` | TOTAL | 0.148 ~ p<.10 | 0.041 ✗ | 0.076 |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dBestWalletBase` | +0.089 | 0.847 | 17.8% | dominant |
| 2 | `dCount` | +0.196 | 0.793 | 16.7% | meaningful |
| 3 | `dContribution` | +0.231 | 0.792 | 16.6% | meaningful |
| 4 | `dBestContrib` | +0.172 | 0.791 | 16.6% | meaningful |
| 5 | `dRoiNormAvg` | +0.089 | 0.778 | 16.3% | meaningful |
| 6 | `dConvictionAvg` | +0.093 | 0.763 | 16.0% | meaningful |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dContribution` | `dBestContrib` | `dBestWalletBase` | `dConvictionAvg` | `dRoiNormAvg` |
|---|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.903 ⚠ | +0.547 | +0.566 | +0.419 | +0.423 |
| `dContribution` | +0.903 ⚠ | 1.000 | +0.673 | +0.543 | +0.472 | +0.427 |
| `dBestContrib` | +0.547 | +0.673 | 1.000 | +0.861 ⚠ | +0.888 ⚠ | +0.763 ⚠ |
| `dBestWalletBase` | +0.566 | +0.543 | +0.861 ⚠ | 1.000 | +0.813 ⚠ | +0.892 ⚠ |
| `dConvictionAvg` | +0.419 | +0.472 | +0.888 ⚠ | +0.813 ⚠ | 1.000 | +0.761 ⚠ |
| `dRoiNormAvg` | +0.423 | +0.427 | +0.763 ⚠ | +0.892 ⚠ | +0.761 ⚠ | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.208**. At AGS ≥ +5 fires N=26, WR=61.5%, ROI=+14.1%. At AGS ≥ +3 fires N=50, WR=66.0%, ROI=+25.0%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-26 ROI (matched cohort) | Top-26 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.218 | +0.010 | WR=69%, ROI=+28.9% | -14.8pp | N=13, WR=69%, ROI=+25.4% |
| `dContribution` | +0.210 | +0.001 | WR=65%, ROI=+21.6% | -7.5pp | N=14, WR=79%, ROI=+44.1% |
| `dBestContrib` | +0.202 | −0.006 | WR=65%, ROI=+21.7% | -7.6pp | N=15, WR=60%, ROI=+10.5% |
| `dBestWalletBase` | +0.209 | +0.001 | WR=62%, ROI=+14.1% | +0.0pp | N=15, WR=67%, ROI=+23.5% |
| `dConvictionAvg` | +0.204 | −0.004 | WR=65%, ROI=+21.7% | -7.6pp | N=18, WR=61%, ROI=+14.2% |
| `dRoiNormAvg` | +0.209 | +0.001 | WR=65%, ROI=+24.5% | -10.4pp | N=17, WR=71%, ROI=+32.1% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dBestContrib` | −0.006 | -7.6pp | mild marginal info |
| 2 | `dConvictionAvg` | −0.004 | -7.6pp | mild marginal info |
| 3 | `dRoiNormAvg` | +0.001 | -10.4pp | redundant — other features cover it |
| 4 | `dBestWalletBase` | +0.001 | +0.0pp | redundant — other features cover it |
| 5 | `dContribution` | +0.001 | -7.5pp | redundant — other features cover it |
| 6 | `dCount` | +0.010 | -14.8pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dBestContrib` | CONCENTRATION | +0.389 | 0.389 | positive ↑ |
| 2 | `dContribution` | TOTAL | +0.280 | 0.280 | positive ↑ |
| 3 | `dCount` | TOTAL | -0.167 | 0.167 | negative ↓ |
| 4 | `dConvictionAvg` | BLENDED | -0.056 | 0.056 | negative ↓ |
| 5 | `dBestWalletBase` | CONCENTRATION | +0.040 | 0.040 | flat ≈ 0 |
| 6 | `dRoiNormAvg` | BLENDED | -0.030 | 0.030 | flat ≈ 0 |

Intercept b = -0.209 · Final log-loss = 0.6538 · N = 135.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dBestContrib` | CONCENTRATION | #1 | #4 | #1 | #1 | 1.75 |
| 2 | `dBestWalletBase` | CONCENTRATION | #2 | #1 | #4 | #5 | 3.00 |
| 3 | `dContribution` | TOTAL | #3 | #3 | #5 | #2 | 3.25 |
| 4 | `dCount` | TOTAL | #6 | #2 | #6 | #3 | 4.25 |
| 5 | `dConvictionAvg` | BLENDED | #5 | #6 | #2 | #4 | 4.25 |
| 6 | `dRoiNormAvg` | BLENDED | #4 | #5 | #3 | #6 | 4.50 |

#### Plain-English summary

- **Workhorse**: `dBestContrib` (CONCENTRATION) — ranks #1/#4/#1/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dRoiNormAvg` (BLENDED) — composite avg rank 4.50. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dCount` ↔ `dContribution` (r=+0.90); `dBestContrib` ↔ `dBestWalletBase` (r=+0.86); `dBestContrib` ↔ `dConvictionAvg` (r=+0.89); `dBestContrib` ↔ `dRoiNormAvg` (r=+0.76); `dBestWalletBase` ↔ `dConvictionAvg` (r=+0.81); `dBestWalletBase` ↔ `dRoiNormAvg` (r=+0.89); `dConvictionAvg` ↔ `dRoiNormAvg` (r=+0.76). Each pair effectively double-counts the same signal in the composite.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 135 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/135 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 43 | 22-21-0 | 51.2% [37–65] | -9.4% | -2.5u | -0.66 ✗ noise |
| 4.5★ | 13 | 8-5-0 | 61.5% [36–82] | +31.0% | +4.8u | 0.92 ✗ noise |
| 4.0★ | 25 | 12-12-1 | 50.0% [31–69] | +3.7% | -1.5u | 0.17 ✗ noise |
| 3.5★ | 35 | 17-18-0 | 48.6% [33–64] | +7.8% | +2.5u | 0.36 ✗ noise |
| 3.0★ | 17 | 6-10-1 | 37.5% [18–61] | -21.7% | -4.5u | -0.89 ✗ noise |
| 2.5★ | 28 | 13-15-0 | 46.4% [30–64] | -11.1% | -4.1u | -0.60 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 1/0%/-100% | 4/0%/-100% | 6/33%/-26% | 9/38%/-26% | 12/25%/-51% |
| Δw = +1 | 1/100%/+27% | 3/33%/-35% | 12/64%/+27% | 25/52%/+2% | 2/0%/-100% | 10/60%/+9% |
| Δw = +2 | 19/37%/-26% | 3/67%/+29% | 8/50%/+9% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 18/61%/+6% | 3/100%/+153% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | — |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 5 | 2-3-0 | 40.0% [12–77] | -46.3% | -1.0u | -1.41 ✗ noise |
| −200/−151 | 11 | 3-8-0 | 27.3% [10–57] | -56.4% | -10.1u | -2.51 ✓ p<.05 |
| −150/−101 | 93 | 47-45-1 | 51.1% [41–61] | -2.8% | +5.2u | -0.28 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 33 | 17-15-1 | 53.1% [36–69] | +16.2% | -3.4u | 0.84 ✗ noise |
| +151/+200 | 3 | 2-1-0 | 66.7% [21–94] | +86.0% | +2.1u | 0.92 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -67% (4) | — | — | +34% (1) |
| −200/−151 | -100% (5) | +5% (3) | -100% (1) | -100% (1) |
| −150/−101 | -38% (20) | +15% (33) | -34% (23) | +50% (14) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +63% (4) | -15% (14) | +29% (10) | +42% (5) |
| +151/+200 | — | +160% (1) | +198% (1) | — |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 87 | 40-47-0 | 46.0% [36–56] | -5.5% | -17.0u | -0.44 ✗ noise |
| SPREAD | 29 | 12-16-1 | 42.9% [27–61] | -16.4% | +1.9u | -0.92 ✗ noise |
| TOTAL | 45 | 26-18-1 | 59.1% [44–72] | +14.1% | +9.8u | 0.99 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=16 · 19% · -64% | N=30 · 50% · -4% | N=19 · 37% · -18% | N=19 · 68% · +54% |
| SPREAD | N=10 · 22% · -51% | N=7 · 29% · -45% | N=7 · 57% · +10% | N=4 · 75% · +46% |
| TOTAL | N=10 · 50% · -3% | N=17 · 75% · +42% | N=11 · 36% · -29% | N=5 · 80% · +55% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 53 | 22-31-0 | 41.5% [29–55] | -18.5% | -12.5u | -1.37 ✗ noise |
| NBA | 86 | 44-41-1 | 51.8% [41–62] | +4.3% | +9.0u | 0.36 ✗ noise |
| NHL | 22 | 12-9-1 | 57.1% [37–76] | +13.1% | -1.8u | 0.61 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=8 · 25% · -45% | N=22 · 45% · -13% | N=16 · 25% · -49% | N=6 · 83% · +63% |
| NBA | N=24 · 26% · -50% | N=21 · 62% · +21% | N=15 · 53% · +10% | N=21 · 67% · +46% |
| NHL | N=4 · 50% · -0% | N=11 · 60% · +10% | N=6 · 50% · +6% | N=1 · 100% · +145% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 96 · 45% · -7.9% · -0.69 ✗ noise | 64 · 55% · +4.7% · 0.39 ✗ noise |
| **plusEV** | 23 · 35% · -22.8% · -0.79 ✗ noise | 137 · 51% · +0.5% · 0.06 ✗ noise |
| **pinnacleConfirms** | 46 · 48% · -1.0% · -0.06 ✗ noise | 47 · 45% · -10.6% · -0.67 ✗ noise |
| **invested10kPlus** | 82 · 45% · -6.8% · -0.53 ✗ noise | 11 · 55% · +1.1% · 0.04 ✗ noise |
| **lineMovingWith** | 93 · 51% · +1.8% · 0.16 ✗ noise | 67 · 45% · -9.3% · -0.72 ✗ noise |
| **predMarketAligns** | 38 · 50% · -2.0% · -0.10 ✗ noise | 55 · 44% · -8.5% · -0.57 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 21 | 14-7-0 | 66.7% [45–83] | +31.0% | +7.7u | 1.46 ✗ noise |
| 1 | 36 | 16-19-1 | 45.7% [30–62] | -12.4% | -5.5u | -0.78 ✗ noise |
| 2 | 46 | 23-22-1 | 51.1% [37–65] | +5.8% | +11.6u | 0.36 ✗ noise |
| 3 | 19 | 8-11-0 | 42.1% [23–64] | -21.7% | -10.4u | -0.96 ✗ noise |
| 4 | 17 | 5-12-0 | 29.4% [13–53] | -38.7% | -12.5u | -1.62 ✗ noise |
| 5 | 16 | 10-6-0 | 62.5% [39–82] | +4.3% | +3.5u | 0.20 ✗ noise |
| 6 | 6 | 2-4-0 | 33.3% [10–70] | +35.8% | +0.1u | 0.37 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 39 | 24-14-1 | 63.2% [47–77] | +14.9% | +11.5u | 1.02 ✗ noise |
| NEAR_START | 80 | 36-43-1 | 45.6% [35–57] | -3.5% | -7.2u | -0.27 ✗ noise |
| NO_MOVE | 6 | 2-4-0 | 33.3% [10–70] | -36.2% | -1.1u | -0.90 ✗ noise |
| PREGAME | 10 | 6-4-0 | 60.0% [31–83] | +12.8% | +4.2u | 0.40 ✗ noise |
| SMALL_MOVE | 24 | 8-16-0 | 33.3% [18–53] | -31.6% | -15.1u | -1.50 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 91 | 44-46-1 | 48.9% [39–59] | -8.5% | -6.1u | -0.85 ✗ noise |
| STRONG | 36 | 18-18-0 | 50.0% [34–66] | -1.0% | +1.7u | -0.06 ✗ noise |
| LEAN | 30 | 14-15-1 | 48.3% [31–66] | +15.1% | -2.2u | 0.58 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.088 ✗ | -0.027 ✗ | -0.067 | -0.34 |
| totalInvested | -0.131 ~ p<.10 | -0.117 ✗ | -0.050 | -1.48 |
| evEdge | 0.043 ✗ | 0.051 ✗ | 0.044 | 0.65 |
| moneyPct | 0.025 ✗ | -0.060 ✗ | -0.033 | -0.75 |
| walletPct | 0.085 ✗ | 0.036 ✗ | 0.038 | 0.45 |
| criteriaMet | -0.082 ✗ | -0.050 ✗ | -0.121 | -0.64 |
| maxContribFor | 0.023 ✗ | 0.039 ✗ | 0.078 | 0.49 |
| meanBaseFor | -0.023 ✗ | -0.007 ✗ | 0.020 | -0.09 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **153** picks. Mean CLV = **-0.0031**.
t-statistic vs zero: -2.44 → ✓ p<.05 · 95% CI [-0.0056, -0.0006]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 12 | 5-7-0 | 41.7% [19–68] | -29.3% | -3.5u | -1.15 ✗ noise |
| CLV (−2%, 0] | 87 | 43-42-2 | 50.6% [40–61] | +0.0% | +0.1u | 0.00 ✗ noise |
| CLV (0, +2%] | 43 | 21-22-0 | 48.8% [35–63] | +7.8% | +0.6u | 0.41 ✗ noise |
| CLV > +2% | 11 | 4-7-0 | 36.4% [15–65] | -37.7% | -8.8u | -1.39 ✗ noise |

ρ(CLV, flat ROI) = -0.023 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=50 (with all features non-null). Intercept β₀ = 0.443.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔWlNet | +0.656 | ↑ helps |
| 2 | pw.ΔFlatPnl | +0.651 | ↑ helps |
| 3 | pw.ΔAvgRoi | +0.597 | ↑ helps |
| 4 | evEdge | +0.565 | ↑ helps |
| 5 | peak.stars | -0.426 | ↓ hurts |
| 6 | pw.Δcount | +0.392 | ↑ helps |
| 7 | sharpCount | -0.386 | ↓ hurts |
| 8 | pw.ΔTopQShare | +0.342 | ↑ helps |
| 9 | odds (American) | -0.217 | ↓ hurts |
| 10 | walletPct | -0.209 | ↓ hurts |
| 11 | moneyPct | -0.174 | ↓ hurts |
| 12 | Δw | -0.144 | ↓ hurts |
| 13 | log10(invested) | -0.123 | ↓ hurts |
| 14 | criteriaMet | -0.121 | ↓ hurts |
| 15 | vault.star | -0.101 | ↓ hurts |
| 16 | HC margin | +0.100 | ↑ helps |
| 17 | log(impliedProb) | +0.099 | ↑ helps |
| 18 | Δw + HC | -0.078 | ↓ hurts |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 4 | 3-1 | 75.0% | 57.1% | -103 | 6.50% bankroll | 3.75u | **UNDER-SIZED** — ship up to 6.50u (1u=1% bankroll) |
| Tier-1b HC = +1 (post-cutover) | 32 | 18-14 | 56.3% | 54.8% | -105 | 3.63% bankroll | 1.57u | **UNDER-SIZED** — ship up to 3.63u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 7 | 3-4 | 42.9% | 47.1% | -110 | — (mute) | 1.36u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 28 | 20-8 | 71.4% | 65.8% | -105 | 14.93% bankroll | 2.41u | **UNDER-SIZED** — ship up to 14.93u (1u=1% bankroll) |
| Stale Δw = 0 | 28 | 9-18 | 33.3% | 37.8% | -108 | — (mute) | 1.12u | **MUTE** (negative EV at posterior) |
| Stale Δw ≤ −1 | 8 | 1-7 | 12.5% | 33.3% | -165 | — (mute) | 0.89u | **MUTE** (negative EV at posterior) |

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

**Peak cum PnL:** +7.1u
**Max drawdown:** -28.6u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.060  (annualized × √252 ≈ -0.95)

---

## §14. Per-pick row-level detail (every shipped+graded pick)
_Sortable raw data behind every section. Use to spot-check individual decisions._

| Date | Sport | Mkt | Side | ★ | u | Odds | Δw | HC | Δw+HC | pw.Δcnt | pw.ΔWl | EV | Outcome | Peak PnL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.50 | +105 | 2 | — | — | 2 | 4 | 0.00 | W | +0.5u |
| 2026-04-18 | MLB | ML | away | 4.5 | 2.50 | -155 | — | — | — | — | — | -1.60 | W | +1.6u |
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.50 | -117 | 2 | — | — | 2 | 4 | 0.00 | L | -0.5u |
| 2026-04-18 | MLB | ML | home | 4.5 | 3.00 | -150 | 3 | — | — | 3 | 6 | -0.20 | W | +2.0u |
| 2026-04-18 | NBA | ML | away | 3.5 | 0.50 | +200 | — | — | — | — | — | -0.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.50 | -108 | 0 | — | — | 1 | 0 | -2.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1.00 | -108 | 0 | — | — | 0 | -3 | -1.70 | L | -1.0u |
| 2026-04-18 | NBA | TOTAL | over | 3.0 | 0.75 | -107 | 0 | — | — | 1 | 0 | 0.00 | L | -0.8u |
| 2026-04-18 | NBA | TOTAL | under | 5.0 | 2.00 | -104 | — | — | — | — | — | 0.00 | W | +1.9u |
| 2026-04-18 | NBA | ML | home | 5.0 | 3.00 | -360 | — | — | — | — | — | 0.20 | W | +0.8u |
| 2026-04-18 | NBA | TOTAL | under | 4.5 | 1.50 | -105 | — | — | — | — | — | 0.00 | L | -1.5u |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 0 | 0 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 3 | 6 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 2 | 1 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 3 | 6 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 1 | 6 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 4 | 5 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 4 | 4 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 2 | 4 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | 0 | 3 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 1 | 2 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | 0 | -3 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | -1 | -12 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 2 | 16 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 1 | 7 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | 0 | -4 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | -1 | -18 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 1 | 1 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 2 | 11 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | 1 | 7 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 3 | -2 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 2 | 6 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 2 | 9 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 1 | -1 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | 0 | 0 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 1 | -1 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 0 | 0 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 1 | -1 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | -1 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | -1 | -7 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | -1 | -17 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | 0 | -2 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 3 | 4 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 6 | 12 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 5 | 9 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 3 | 4 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | -1 | -3 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | 0 | -4 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | 0 | -1 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | 1 | 2 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 0 | 0 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 3 | 9 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 3 | 11 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 1 | 0 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -2 | -6 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 1 | 0 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 6 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | 0 | -3 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 14 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 5 | 8 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 5 | 7 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | -1 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 2 | -1 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 2 | 23 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 2 | 31 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 2 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 3 | 21 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 1 | 3 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 1 | -4 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 1 | -4 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | -1 | -18 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 15 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 2 | -23 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | -1 | 1 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | -1 | 4 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | 6 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 1 | -4 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 1 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 27 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | -5 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -25 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 4 | 5 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | 0 | -4 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 1 | -4 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -26 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 4 | 14 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 4 | 37 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 5 | 22 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 0 | 0 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 1 | 2 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 3 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 0 | 0 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 3 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 3 | -13 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 7 | 3 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 4 | 16 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 2 | 8 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 1 | -1 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 1 | 8 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 0 | 11 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 0 | 12 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 4 | 0 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 6 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | 2 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 1 | -39 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 3 | -1 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 0 | -1 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 1 | -1 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 2 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | -7 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 3 | -4 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 21 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 4 | 8 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 1 | 3 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 3 | 16 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | 0 | -4 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 2 | -7 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 22 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 8 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 22 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | -1 | -2 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 44 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 4 | 16 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 3 | -6 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 2 | 4 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 6 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 4 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 4 | 18 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 1 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 29 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 4 | 23 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 1 | 3 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 1 | 2 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 3 | 35 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 4 | 42 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 24 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 1 | -1 | -1.30 | L | -1.1u |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.70 | -104 | — | — | — | 3 | 19 | 0.00 | W | +1.6u |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-09 | NBA | ML | away | 5.0 | 4.50 | -364 | 3 | 1 | 4 | 5 | 35 | 0.00 | W | +1.2u |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2.00 | -104 | 2 | 1 | 3 | 2 | 24 | 0.00 | W | +1.9u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -120 | 1 | 1 | 2 | 1 | -4 | 0.00 | W | +0.9u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 2 | -2 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 2 | -2 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -103 | 1 | 1 | 2 | 1 | -4 | 0.00 | L | -1.1u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -110 | 1 | 1 | 2 | 1 | -4 | 0.00 | W | +1.0u |
| 2026-05-10 | MLB | ML | away | 3.5 | 1.13 | +134 | 0 | 1 | 1 | 1 | -4 | 0.00 | W | +1.5u |
| 2026-05-10 | NBA | ML | home | 4.0 | 1.50 | +160 | 1 | 1 | 2 | 2 | 20 | 0.80 | W | +2.6u |
| 2026-05-10 | NBA | TOTAL | over | 5.0 | 3.50 | -110 | 3 | 2 | 5 | 3 | 40 | 0.00 | W | +3.3u |
| 2026-05-10 | NHL | ML | away | 4.5 | 4.50 | +108 | 2 | 2 | 4 | 2 | 2 | -0.70 | L | -4.5u |
| 2026-05-10 | NHL | TOTAL | under | 5.0 | 1.70 | -110 | 2 | 1 | 3 | 2 | -2 | 0.00 | L | -1.7u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._