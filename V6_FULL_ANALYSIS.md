# Sharp Intel v6 — Full Analysis

_Auto-generated **5/13/2026, 9:44:59 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 170 shipped+graded picks · 2026-04-18 → 2026-05-12  (HC analyses scoped to post-cutover 2026-04-30, 58 picks)
**Headline:** 80-88-2 · WR 47.6% [40.2%–55.1%] vs 52.4% break-even · -8.5u flat (-5.0%) · -21.4u peak.
**Overall t-test:** t = -0.62 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.196 ✓ p<.05**  (full sample, N=164)
- **ρ(HC, flat ROI) = 0.096 ✗**  (post-cutover, N=58)
- **ρ(Δw+HC, flat ROI) = -0.016 ✗**  (post-cutover, N=58)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)** — N=11, 3-8, WR 27.3% [10%–57%], flat ROI -46.9% (t=-1.71 ~ p<.10)
- **Stale Δw ≤ 0 (full sample)** — N=36, 10-25, WR 28.6% [16%–45%], flat ROI -43.6% (t=-2.95 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=6, WR 50.0%, flat ROI -2.8%. Bayesian posterior WR ≈ 50.0%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=35, WR 57.1%, flat ROI +13.9%. Bayesian posterior WR ≈ 55.6%, half-Kelly = **3.3%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=11, WR 27.3%, flat ROI -46.9%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=32, WR 62.5%, flat ROI +34.0%. Bayesian posterior WR ≈ 59.5%, half-Kelly = **7.5%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -43.6% flat ROI on 36 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.06u/pick), we need **~1743 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 170. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-12 |
| Sides scanned | 388 |
| Shipped + graded | **170** |
| W-L-P | 80-88-2 |
| Win rate | **47.6%** [40.2%–55.1%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +4.8 pp |
| Peak-units PnL | **-21.4u** |
| Flat-1u PnL | **-8.5u** (-5.0% flat ROI) |
| Flat t-statistic vs zero | -0.62 → ✗ noise |
| Flat 95% CI per-pick | [-0.210, 0.110]u |

### Power note

At our observed flat-PnL standard deviation (1.06u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4842 |
| +5% | 1743 |
| +10% | 436 |

We have **170** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 28 | 9-18-1 | 33.3% [19–52] | -34.8% | -13.4u | -2.01 ✓ p<.05 |
| Δw = +1 | 57 | 31-25-1 | 55.4% [42–68] | +5.9% | +0.5u | 0.46 ✗ noise |
| Δw = +2 | 39 | 15-24-0 | 38.5% [25–54] | -20.4% | -17.5u | -1.23 ✗ noise |
| Δw ≥ +3 | 32 | 20-12-0 | 62.5% [45–77] | +34.0% | +11.1u | 1.45 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.179** ✓ p<.05  ·  **ρ(Δw, flat ROI) = 0.196** ✓ p<.05  (N=164)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 15 | 6-8-1 | 42.9% [21–67] | -16.4% | -9.4u | -0.67 ✗ noise |
| HC = +1 | 35 | 20-15-0 | 57.1% [41–72] | +13.9% | +2.1u | 0.79 ✗ noise |
| HC = +2 | 5 | 3-2-0 | 60.0% [23–88] | +16.6% | +3.5u | 0.35 ✗ noise |
| HC ≥ +3 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.5u | 0.00 ✗ n<2 |

**Pearson ρ(HC, WIN) = 0.111** ✗  ·  **ρ(HC, flat ROI) = 0.096** ✗  (N=58)

Spearman rank ρ(HC, flat ROI) = 0.166.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Σ = +1 | 11 | 5-5-1 | 50.0% [24–76] | +0.0% | -0.4u | 0.00 ✗ noise |
| Σ = +2 | 24 | 15-9-0 | 62.5% [43–79] | +22.1% | +2.1u | 1.10 ✗ noise |
| Σ = +3 | 11 | 2-9-0 | 18.2% [5–48] | -55.1% | -15.4u | -1.78 ~ p<.10 |
| Σ = +4 | 5 | 3-2-0 | 60.0% [23–88] | +4.1% | -1.3u | 0.09 ✗ noise |
| Σ = +5 | 3 | 2-1-0 | 66.7% [21–94] | +29.3% | +2.2u | 0.45 ✗ noise |
| Σ ≥ +6 | 3 | 2-1-0 | 66.7% [21–94] | +30.2% | +3.2u | 0.46 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = 0.011** ✗  ·  **ρ(Σ, flat ROI) = -0.016** ✗  (N=58)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 58.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.053 ✗ | -0.078 ✗ | -0.074 | weak |
| HC margin | 0.111 ✗ | 0.096 ✗ | 0.166 | weak |
| Δw + HC | 0.011 ✗ | -0.016 ✗ | 0.016 | weak |
| peak.stars | -0.163 ✗ | -0.167 ✗ | -0.154 | weak |
| vault.star | -0.051 ✗ | -0.010 ✗ | -0.029 | weak |
| lock.stars | -0.118 ✗ | -0.145 ✗ | -0.087 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 58 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | — | N=6 · 3-2 · 60% [23–88] · +12%  | N=5 · 2-3 · 40% [12–77] · -22%  | N=4 · 1-3 · 25% [5–70] · -51%  |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=5 · 2-3 · 40% [12–77] · -14%  | N=17 · 13-4 · 76% [53–90] · +50% ★ | N=8 · 2-6 · 25% [7–59] · -38%  | N=4 · 3-1 · 75% [30–95] · +30%  |
| +2 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=1 · 0-1 · 0% [0–79] · —  | N=3 · 3-0 · 100% [44–100] · +94% ★ |
| ≥ +3 | — | — | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 15 | 6-8-1 | 42.9% [21–67] | -16.4% | -9.4u | -0.67 ✗ noise |
| HC = +1 | 35 | 20-15-0 | 57.1% [41–72] | +13.9% | +2.1u | 0.79 ✗ noise |
| HC = +2 | 5 | 3-2-0 | 60.0% [23–88] | +16.6% | +3.5u | 0.35 ✗ noise |
| HC ≥ +3 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.5u | 0.00 ✗ n<2 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 5 | 2-3-0 | 40.0% [12–77] | -14.0% | -0.1u | -0.26 ✗ noise |
| Δw = +1 | 24 | 16-7-1 | 69.6% [49–84] | +33.9% | +5.1u | 1.80 ~ p<.10 |
| Δw = +2 | 14 | 4-10-0 | 28.6% [12–55] | -36.9% | -13.7u | -1.30 ✗ noise |
| Δw ≥ +3 | 14 | 7-7-0 | 50.0% [27–73] | -7.2% | -1.0u | -0.28 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 41 | 23-18-0 | 56.1% [41–70] | +11.5% | +2.1u | 0.71 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 11 | 3-8-0 | 27.3% [10–57] | -46.9% | -12.6u | -1.71 ~ p<.10 |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 6 | 3-2-1 | 60.0% [23–88] | +11.7% | -0.3u | 0.31 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 150 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δcount = −1 | 9 | 1-8-0 | 11.1% [2–44] | -72.8% | -10.2u | -2.67 ✓ p<.01 |
| Δcount = 0 (balanced) | 16 | 5-11-0 | 31.3% [14–56] | -45.7% | -12.3u | -2.15 ✓ p<.05 |
| Δcount = +1 | 42 | 24-17-1 | 58.5% [43–72] | +15.5% | +5.6u | 1.02 ✗ noise |
| Δcount = +2 | 41 | 17-23-1 | 42.5% [29–58] | -18.2% | -10.2u | -1.20 ✗ noise |
| Δcount ≥ +3 (heavy support) | 41 | 27-14-0 | 65.9% [51–78] | +40.6% | +15.8u | 2.09 ✓ p<.05 |

**ρ(Δcount, WIN) = 0.248** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.290** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -2 · ≤ 1 · ≤ 5 · ≤ 16 · > 16

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 34 | 11-23-0 | 32.4% [19–49] | -36.9% | -18.0u | -2.29 ✓ p<.05 |
| Q2 | 30 | 11-18-1 | 37.9% [23–56] | -22.3% | -15.2u | -1.21 ✗ noise |
| Q3 (balanced) | 27 | 13-14-0 | 48.1% [31–66] | -2.2% | -8.0u | -0.11 ✗ noise |
| Q4 | 31 | 18-13-0 | 58.1% [41–74] | +13.2% | +7.0u | 0.69 ✗ noise |
| Q5 (best — heavy support) | 28 | 21-6-1 | 77.8% [59–89] | +59.1% | +22.4u | 2.69 ✓ p<.01 |

**ρ(ΔWlNet, WIN) = 0.328** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.297** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -2.09 · ≤ 1.52 · ≤ 4.04 · ≤ 14.36 · > 14.36

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 31 | 11-20-0 | 35.5% [21–53] | -30.5% | -14.2u | -1.76 ~ p<.10 |
| Q2 | 30 | 8-21-1 | 27.6% [15–46] | -43.5% | -22.4u | -2.65 ✓ p<.01 |
| Q3 | 30 | 12-18-0 | 40.0% [25–58] | -21.9% | -15.0u | -1.22 ✗ noise |
| Q4 | 30 | 22-8-0 | 73.3% [56–86] | +46.3% | +16.2u | 2.50 ✓ p<.05 |
| Q5 | 29 | 21-7-1 | 75.0% [57–87] | +55.1% | +23.5u | 2.50 ✓ p<.05 |

**ρ(ΔFlatPnl, WIN) = 0.359** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.384** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -11.8 · ≤ 0.5 · ≤ 12.9 · ≤ 29.9 · > 29.9

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 31 | 7-23-1 | 23.3% [12–41] | -47.1% | -18.2u | -2.63 ✓ p<.01 |
| Q2 | 30 | 10-20-0 | 33.3% [19–51] | -34.0% | -20.0u | -1.95 ~ p<.10 |
| Q3 | 31 | 12-19-0 | 38.7% [24–56] | -27.7% | -20.9u | -1.64 ✗ noise |
| Q4 | 31 | 23-7-1 | 76.7% [59–88] | +45.8% | +14.9u | 2.93 ✓ p<.01 |
| Q5 | 27 | 22-5-0 | 81.5% [63–92] | +74.0% | +32.5u | 3.35 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.455** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.438** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 16 | 2-14-0 | 12.5% [3–36] | -74.1% | -15.5u | -4.19 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 12 | 3-9-0 | 25.0% [9–53] | -50.5% | -9.2u | -1.91 ~ p<.10 |
| ΔBestRank = 0 (tied) | 0 | — | — | — | — | — |
| ΔBestRank ∈ [+1,+4] | 7 | 2-5-0 | 28.6% [8–64] | -47.5% | -7.6u | -1.40 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 22 | 14-7-1 | 66.7% [45–83] | +35.8% | +10.4u | 1.47 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.494** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.462** ✓ p<.01  (N=57)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 12 | 3-9-0 | 25.0% [9–53] | -33.4% | -2.6u | -0.89 ✗ noise |
| Δshare ∈ [−30,−10] pp | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.0u | 0.00 ✗ n<2 |
| Δshare ≈ 0 (±10 pp) | 94 | 38-54-2 | 41.3% [32–52] | -20.6% | -43.8u | -2.09 ✓ p<.05 |
| Δshare ∈ [+10,+30] pp | 8 | 4-4-0 | 50.0% [22–78] | -4.7% | +1.8u | -0.13 ✗ noise |
| Δshare ≥ +30 pp | 35 | 29-6-0 | 82.9% [67–92] | +72.9% | +35.8u | 4.07 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.312** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.267** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.455 ✓ p<.01 | 0.438 ✓ p<.01 | 0.452 |
| 2 | **ΔTopQCount** | 0.398 ✓ p<.01 | 0.417 ✓ p<.01 | 0.358 |
| 3 | **ΔFlatPnl** | 0.359 ✓ p<.01 | 0.384 ✓ p<.01 | 0.355 |
| 4 | **ΔWlNet** | 0.328 ✓ p<.01 | 0.297 ✓ p<.01 | 0.292 |
| 5 | **Δcount** | 0.248 ✓ p<.01 | 0.290 ✓ p<.01 | 0.205 |
| 6 | **ΔTopQShare** | 0.312 ✓ p<.01 | 0.267 ✓ p<.01 | 0.321 |

_(ΔBestRank uses N=57 subset where both sides had a proven wallet — ρ(flat ROI) = 0.462 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 150, dateRange = 2026-04-18 → 2026-05-12, computedAt = 2026-05-13T13:17:57.477Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **150** rows · PIT aggregate computable on **144** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **144** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 7 · 100% · +148.7% | 6 · 67% · +18.9% | -129.8pp |
| LOCK (+5..+7) | 10 · 70% · +31.2% | 19 · 63% · +18.6% | -12.6pp |
| STRONG (+3..+5) | 20 · 70% · +29.2% | 26 · 69% · +33.9% | +4.7pp |
| NEUTRAL (0..+3) | 43 · 49% · -1.3% | 33 · 41% · -18.9% | -17.6pp |
| WEAK (−3..0) | 23 · 45% · -11.7% | 24 · 33% · -32.3% | -20.7pp |
| FADE (<−3) | 32 · 19% · -60.8% | 27 · 38% · -10.5% | +50.3pp |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=17, WR=82%, ROI=+79.6% | N=25, WR=64%, ROI=+18.7% | -60.9pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=37, WR=76%, ROI=+52.3% | N=51, WR=67%, ROI=+26.4% | -25.9pp |
| AGS < −1 (mute veto) | N=45, WR=25%, ROI=-50.1% | N=42, WR=41%, ROI=-9.3% | +40.9pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-04-29 → 2026-05-12, N=65)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 4 · 75% · +29.5% |
| LOCK (+5..+7) | 10 · 70% · +36.7% |
| STRONG (+3..+5) | 14 · 64% · +28.0% |
| NEUTRAL (0..+3) | 19 · 33% · -29.3% |
| WEAK (−3..0) | 9 · 22% · -54.3% |
| FADE (<−3) | 9 · 56% · +6.8% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=14, WR=71%, ROI=+34.6% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=28, WR=68%, ROI=+31.3% |
| AGS < −1 (mute veto) | N=16, WR=44%, ROI=-14.2% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | TOTAL | + | 1.79 | 1.58 |
| `dContribution` | TOTAL | + | 106.53 | 92.77 |
| `dBestContrib` | CONCENTRATION | + | 49.12 | 41.85 |
| `dBestWalletBase` | CONCENTRATION | + | 45.07 | 36.55 |
| `dConvictionAvg` | BLENDED | + | 0.63 | 0.57 |
| `dRoiNormAvg` | BLENDED | + | 36.78 | 35.03 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **144/170** shipped+graded rows (85%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -16.14 |
| 20th pct | -2.90 |
| 40th pct | 0.75 |
| Median | 1.81 |
| 60th pct | 2.46 |
| 80th pct | 4.71 |
| 90th pct | 6.00 |
| Max | 11.06 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 6 | 4.2% |
| **LOCK** | +5..+7 | 20 | 13.9% |
| **STRONG** | +3..+5 | 27 | 18.8% |
| **NEUTRAL** | 0..+3 | 38 | 26.4% |
| **WEAK** | −3..0 | 26 | 18.1% |
| **FADE** | < −3 | 27 | 18.8% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 6 | 4-2-0 | 66.7% [30–90] | +18.9% | +3.6u | 0.48 ✗ noise |
| LOCK | 20 | 12-8-0 | 60.0% [39–78] | +12.7% | +1.7u | 0.59 ✗ noise |
| STRONG | 27 | 18-9-0 | 66.7% [48–81] | +28.9% | +9.1u | 1.60 ✗ noise |
| NEUTRAL | 38 | 14-23-1 | 37.8% [24–54] | -24.7% | -14.2u | -1.55 ✗ noise |
| WEAK | 26 | 8-18-0 | 30.8% [17–50] | -37.5% | -9.2u | -1.97 ✓ p<.05 |
| FADE | 27 | 10-16-1 | 38.5% [22–57] | -10.5% | -13.9u | -0.40 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (TOTAL)

r(WIN) = **0.103** ✗ · r(ROI) = **0.012** ✗ · Spearman ρ(ROI) = **0.050**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 22 | 10-12-0 | 45.5% [27–65] | +9.6% | -4.8u | 0.31 ✗ noise |
| z ∈ [−1, 0) | 45 | 20-23-2 | 46.5% [33–61] | -9.8% | -8.4u | -0.68 ✗ noise |
| z ∈ [0, +1) | 52 | 22-30-0 | 42.3% [30–56] | -19.2% | -18.6u | -1.43 ✗ noise |
| z ≥ +1 (very positive) | 25 | 14-11-0 | 56.0% [37–73] | +7.1% | +8.8u | 0.35 ✗ noise |

#### `dContribution` (TOTAL)

r(WIN) = **0.203** ✓ p<.05 · r(ROI) = **0.087** ✗ · Spearman ρ(ROI) = **0.136**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 12 | 4-7-1 | 36.4% [15–65] | +6.7% | -4.5u | 0.13 ✗ noise |
| z ∈ [−1, 0) | 58 | 20-37-1 | 35.1% [24–48] | -30.8% | -26.5u | -2.44 ✓ p<.05 |
| z ∈ [0, +1) | 45 | 25-20-0 | 55.6% [41–69] | +9.1% | +2.9u | 0.61 ✗ noise |
| z ≥ +1 (very positive) | 29 | 17-12-0 | 58.6% [41–74] | +8.5% | +5.2u | 0.47 ✗ noise |

#### `dBestContrib` (CONCENTRATION)

r(WIN) = **0.258** ✓ p<.01 · r(ROI) = **0.150** ~ p<.10 · Spearman ρ(ROI) = **0.260**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 13 | 3-10-0 | 23.1% [8–50] | -23.9% | -10.4u | -0.51 ✗ noise |
| z ∈ [−1, 0) | 38 | 15-22-1 | 40.5% [26–57] | -22.5% | -16.2u | -1.42 ✗ noise |
| z ∈ [0, +1) | 69 | 30-38-1 | 44.1% [33–56] | -13.8% | -8.1u | -1.17 ✗ noise |
| z ≥ +1 (very positive) | 24 | 18-6-0 | 75.0% [55–88] | +44.5% | +11.8u | 2.48 ✓ p<.05 |

#### `dBestWalletBase` (CONCENTRATION)

r(WIN) = **0.166** ✓ p<.05 · r(ROI) = **0.083** ✗ · Spearman ρ(ROI) = **0.211**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 20 | 7-13-0 | 35.0% [18–57] | -17.2% | -9.6u | -0.54 ✗ noise |
| z ∈ [−1, 0) | 33 | 14-18-1 | 43.8% [28–61] | -13.2% | -9.0u | -0.75 ✗ noise |
| z ∈ [0, +1) | 69 | 28-41-0 | 40.6% [30–52] | -21.2% | -24.5u | -1.80 ~ p<.10 |
| z ≥ +1 (very positive) | 22 | 17-4-1 | 81.0% [60–92] | +54.3% | +20.2u | 3.23 ✓ p<.01 |

#### `dConvictionAvg` (BLENDED)

r(WIN) = **0.167** ✓ p<.05 · r(ROI) = **0.060** ✗ · Spearman ρ(ROI) = **0.139**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 16 | 4-12-0 | 25.0% [10–49] | -27.3% | -11.3u | -0.70 ✗ noise |
| z ∈ [−1, 0) | 33 | 17-15-1 | 53.1% [36–69] | +1.8% | -1.1u | 0.10 ✗ noise |
| z ∈ [0, +1) | 79 | 36-42-1 | 46.2% [36–57] | -10.1% | -7.0u | -0.91 ✗ noise |
| z ≥ +1 (very positive) | 16 | 9-7-0 | 56.3% [33–77] | +7.6% | -3.6u | 0.30 ✗ noise |

#### `dRoiNormAvg` (BLENDED)

r(WIN) = **0.144** ~ p<.10 · r(ROI) = **0.037** ✗ · Spearman ρ(ROI) = **0.147**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 18 | 6-12-0 | 33.3% [16–56] | -11.3% | -11.5u | -0.31 ✗ noise |
| z ∈ [−1, 0) | 37 | 16-20-1 | 44.4% [30–60] | -14.4% | -4.8u | -0.87 ✗ noise |
| z ∈ [0, +1) | 71 | 33-38-0 | 46.5% [35–58] | -9.6% | -2.1u | -0.82 ✗ noise |
| z ≥ +1 (very positive) | 18 | 11-6-1 | 64.7% [41–83] | +20.4% | -4.5u | 0.93 ✗ noise |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dBestContrib` | CONCENTRATION | 0.258 ✓ p<.01 | 0.150 ~ p<.10 | 0.260 |
| 2 | `dBestWalletBase` | CONCENTRATION | 0.166 ✓ p<.05 | 0.083 ✗ | 0.211 |
| 3 | `dRoiNormAvg` | BLENDED | 0.144 ~ p<.10 | 0.037 ✗ | 0.147 |
| 4 | `dConvictionAvg` | BLENDED | 0.167 ✓ p<.05 | 0.060 ✗ | 0.139 |
| 5 | `dContribution` | TOTAL | 0.203 ✓ p<.05 | 0.087 ✗ | 0.136 |
| 6 | `dCount` | TOTAL | 0.103 ✗ | 0.012 ✗ | 0.050 |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dBestWalletBase` | +0.072 | 0.842 | 17.6% | dominant |
| 2 | `dCount` | +0.180 | 0.823 | 17.2% | dominant |
| 3 | `dContribution` | +0.204 | 0.798 | 16.7% | meaningful |
| 4 | `dBestContrib` | +0.155 | 0.782 | 16.4% | meaningful |
| 5 | `dRoiNormAvg` | +0.065 | 0.774 | 16.2% | meaningful |
| 6 | `dConvictionAvg` | +0.088 | 0.760 | 15.9% | meaningful |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dContribution` | `dBestContrib` | `dBestWalletBase` | `dConvictionAvg` | `dRoiNormAvg` |
|---|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.897 ⚠ | +0.475 | +0.529 | +0.369 | +0.379 |
| `dContribution` | +0.897 ⚠ | 1.000 | +0.642 | +0.533 | +0.453 | +0.410 |
| `dBestContrib` | +0.475 | +0.642 | 1.000 | +0.855 ⚠ | +0.888 ⚠ | +0.763 ⚠ |
| `dBestWalletBase` | +0.529 | +0.533 | +0.855 ⚠ | 1.000 | +0.811 ⚠ | +0.896 ⚠ |
| `dConvictionAvg` | +0.369 | +0.453 | +0.888 ⚠ | +0.811 ⚠ | 1.000 | +0.759 ⚠ |
| `dRoiNormAvg` | +0.379 | +0.410 | +0.763 ⚠ | +0.896 ⚠ | +0.759 ⚠ | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.208**. At AGS ≥ +5 fires N=26, WR=61.5%, ROI=+14.1%. At AGS ≥ +3 fires N=53, WR=64.2%, ROI=+21.6%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-26 ROI (matched cohort) | Top-26 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.225 | +0.017 | WR=69%, ROI=+28.9% | -14.8pp | N=13, WR=69%, ROI=+25.4% |
| `dContribution` | +0.212 | +0.004 | WR=65%, ROI=+21.6% | -7.5pp | N=14, WR=79%, ROI=+44.1% |
| `dBestContrib` | +0.196 | −0.012 | WR=65%, ROI=+21.7% | -7.6pp | N=15, WR=60%, ROI=+10.5% |
| `dBestWalletBase` | +0.209 | +0.002 | WR=62%, ROI=+14.1% | +0.0pp | N=15, WR=67%, ROI=+23.5% |
| `dConvictionAvg` | +0.203 | −0.004 | WR=65%, ROI=+21.7% | -7.6pp | N=18, WR=61%, ROI=+14.2% |
| `dRoiNormAvg` | +0.207 | −0.001 | WR=62%, ROI=+17.0% | -2.9pp | N=17, WR=71%, ROI=+32.1% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dBestContrib` | −0.012 | -7.6pp | mild marginal info |
| 2 | `dConvictionAvg` | −0.004 | -7.6pp | mild marginal info |
| 3 | `dRoiNormAvg` | −0.001 | -2.9pp | mild marginal info |
| 4 | `dBestWalletBase` | +0.002 | +0.0pp | redundant — other features cover it |
| 5 | `dContribution` | +0.004 | -7.5pp | redundant — other features cover it |
| 6 | `dCount` | +0.017 | -14.8pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dBestContrib` | CONCENTRATION | +0.425 | 0.425 | positive ↑ |
| 2 | `dContribution` | TOTAL | +0.291 | 0.291 | positive ↑ |
| 3 | `dCount` | TOTAL | -0.207 | 0.207 | negative ↓ |
| 4 | `dConvictionAvg` | BLENDED | -0.057 | 0.057 | negative ↓ |
| 5 | `dRoiNormAvg` | BLENDED | -0.050 | 0.050 | flat ≈ 0 |
| 6 | `dBestWalletBase` | CONCENTRATION | +0.024 | 0.024 | flat ≈ 0 |

Intercept b = -0.261 · Final log-loss = 0.6499 · N = 144.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dBestContrib` | CONCENTRATION | #1 | #4 | #1 | #1 | 1.75 |
| 2 | `dBestWalletBase` | CONCENTRATION | #2 | #1 | #4 | #6 | 3.25 |
| 3 | `dContribution` | TOTAL | #5 | #3 | #5 | #2 | 3.75 |
| 4 | `dConvictionAvg` | BLENDED | #4 | #6 | #2 | #4 | 4.00 |
| 5 | `dRoiNormAvg` | BLENDED | #3 | #5 | #3 | #5 | 4.00 |
| 6 | `dCount` | TOTAL | #6 | #2 | #6 | #3 | 4.25 |

#### Plain-English summary

- **Workhorse**: `dBestContrib` (CONCENTRATION) — ranks #1/#4/#1/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dCount` (TOTAL) — composite avg rank 4.25. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dCount` ↔ `dContribution` (r=+0.90); `dBestContrib` ↔ `dBestWalletBase` (r=+0.85); `dBestContrib` ↔ `dConvictionAvg` (r=+0.89); `dBestContrib` ↔ `dRoiNormAvg` (r=+0.76); `dBestWalletBase` ↔ `dConvictionAvg` (r=+0.81); `dBestWalletBase` ↔ `dRoiNormAvg` (r=+0.90); `dConvictionAvg` ↔ `dRoiNormAvg` (r=+0.76). Each pair effectively double-counts the same signal in the composite.
- **v9 simplification candidate**: only `dBestContrib` carries marginal info (Spearman ρ drop > 0.01 when removed). The other 5 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=144 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 144 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/144 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 46 | 22-24-0 | 47.8% [34–62] | -15.3% | -13.5u | -1.12 ✗ noise |
| 4.5★ | 16 | 8-8-0 | 50.0% [28–72] | +6.4% | -1.4u | 0.21 ✗ noise |
| 4.0★ | 26 | 12-13-1 | 48.0% [30–67] | -0.3% | -2.2u | -0.02 ✗ noise |
| 3.5★ | 37 | 19-18-0 | 51.4% [36–67] | +11.8% | +4.3u | 0.56 ✗ noise |
| 3.0★ | 17 | 6-10-1 | 37.5% [18–61] | -21.7% | -4.5u | -0.89 ✗ noise |
| 2.5★ | 28 | 13-15-0 | 46.4% [30–64] | -11.1% | -4.1u | -0.60 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 1/0%/-100% | 4/0%/-100% | 6/33%/-26% | 9/38%/-26% | 12/25%/-51% |
| Δw = +1 | 1/100%/+27% | 4/25%/-51% | 12/64%/+27% | 27/56%/+8% | 2/0%/-100% | 10/60%/+9% |
| Δw = +2 | 19/37%/-26% | 4/50%/-3% | 9/44%/-3% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 21/52%/-9% | 4/75%/+90% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | — |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 5 | 2-3-0 | 40.0% [12–77] | -46.3% | -1.0u | -1.41 ✗ noise |
| −200/−151 | 12 | 4-8-0 | 33.3% [14–61] | -46.4% | -9.3u | -2.03 ✓ p<.05 |
| −150/−101 | 98 | 48-49-1 | 49.5% [40–59] | -5.7% | -1.1u | -0.59 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 36 | 17-18-1 | 48.6% [33–64] | +6.5% | -13.9u | 0.35 ✗ noise |
| +151/+200 | 3 | 2-1-0 | 66.7% [21–94] | +86.0% | +2.1u | 0.92 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -67% (4) | — | — | +34% (1) |
| −200/−151 | -100% (5) | +20% (4) | -100% (1) | -100% (1) |
| −150/−101 | -38% (20) | +14% (35) | -39% (25) | +40% (15) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +63% (4) | -15% (14) | +29% (10) | -11% (8) |
| +151/+200 | — | +160% (1) | +198% (1) | — |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 92 | 42-50-0 | 45.7% [36–56] | -6.7% | -25.7u | -0.56 ✗ noise |
| SPREAD | 30 | 12-17-1 | 41.4% [26–59] | -19.2% | -1.6u | -1.10 ✗ noise |
| TOTAL | 48 | 26-21-1 | 55.3% [41–69] | +7.0% | +5.9u | 0.50 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=16 · 19% · -64% | N=32 · 53% · +1% | N=19 · 37% · -18% | N=22 · 59% · +33% |
| SPREAD | N=10 · 22% · -51% | N=7 · 29% · -45% | N=7 · 57% · +10% | N=5 · 60% · +17% |
| TOTAL | N=10 · 50% · -3% | N=18 · 71% · +34% | N=13 · 31% · -40% | N=5 · 80% · +55% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 59 | 24-35-0 | 40.7% [29–53] | -20.6% | -21.8u | -1.63 ✗ noise |
| NBA | 88 | 44-43-1 | 50.6% [40–61] | +2.0% | +3.5u | 0.16 ✗ noise |
| NHL | 23 | 12-10-1 | 54.5% [35–73] | +8.2% | -3.1u | 0.39 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=8 · 25% · -45% | N=24 · 50% · -5% | N=17 · 24% · -52% | N=9 · 56% · +8% |
| NBA | N=24 · 26% · -50% | N=22 · 59% · +16% | N=15 · 53% · +10% | N=22 · 64% · +39% |
| NHL | N=4 · 50% · -0% | N=11 · 60% · +10% | N=7 · 43% · -9% | N=1 · 100% · +145% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 101 · 42% · -12.5% · -1.12 ✗ noise | 68 · 54% · +3.9% · 0.33 ✗ noise |
| **plusEV** | 23 · 35% · -22.8% · -0.79 ✗ noise | 146 · 49% · -3.2% · -0.39 ✗ noise |
| **pinnacleConfirms** | 47 · 47% · -3.1% · -0.18 ✗ noise | 54 · 43% · -15.4% · -1.07 ✗ noise |
| **invested10kPlus** | 89 · 44% · -10.0% · -0.82 ✗ noise | 12 · 50% · -7.4% · -0.25 ✗ noise |
| **lineMovingWith** | 96 · 49% · -1.4% · -0.13 ✗ noise | 73 · 44% · -11.8% · -0.97 ✗ noise |
| **predMarketAligns** | 39 · 49% · -4.5% · -0.24 ✗ noise | 62 · 42% · -13.0% · -0.94 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 25 | 16-9-0 | 64.0% [45–80] | +24.6% | +7.7u | 1.26 ✗ noise |
| 1 | 36 | 16-19-1 | 45.7% [30–62] | -12.4% | -5.5u | -0.78 ✗ noise |
| 2 | 49 | 23-25-1 | 47.9% [34–62] | -0.7% | +3.1u | -0.04 ✗ noise |
| 3 | 20 | 8-12-0 | 40.0% [22–61] | -25.6% | -13.4u | -1.18 ✗ noise |
| 4 | 18 | 5-13-0 | 27.8% [12–51] | -42.1% | -17.0u | -1.84 ~ p<.10 |
| 5 | 16 | 10-6-0 | 62.5% [39–82] | +4.3% | +3.5u | 0.20 ✗ noise |
| 6 | 6 | 2-4-0 | 33.3% [10–70] | +35.8% | +0.1u | 0.37 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 39 | 24-14-1 | 63.2% [47–77] | +14.9% | +11.5u | 1.02 ✗ noise |
| NEAR_START | 83 | 36-46-1 | 43.9% [34–55] | -7.0% | -18.2u | -0.55 ✗ noise |
| NO_MOVE | 6 | 2-4-0 | 33.3% [10–70] | -36.2% | -1.1u | -0.90 ✗ noise |
| PREGAME | 14 | 8-6-0 | 57.1% [33–79] | +6.5% | +4.1u | 0.25 ✗ noise |
| SMALL_MOVE | 26 | 8-18-0 | 30.8% [17–50] | -36.8% | -20.1u | -1.87 ~ p<.10 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 98 | 46-51-1 | 47.4% [38–57] | -11.3% | -16.7u | -1.19 ✗ noise |
| STRONG | 37 | 18-19-0 | 48.6% [33–64] | -3.7% | -1.8u | -0.22 ✗ noise |
| LEAN | 31 | 14-16-1 | 46.7% [30–64] | +11.4% | -4.2u | 0.45 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.102 ✗ | -0.041 ✗ | -0.080 | -0.54 |
| totalInvested | -0.116 ✗ | -0.103 ✗ | -0.032 | -1.33 |
| evEdge | 0.047 ✗ | 0.054 ✗ | 0.053 | 0.70 |
| moneyPct | 0.014 ✗ | -0.069 ✗ | -0.037 | -0.90 |
| walletPct | 0.084 ✗ | 0.035 ✗ | 0.035 | 0.45 |
| criteriaMet | -0.085 ✗ | -0.052 ✗ | -0.123 | -0.67 |
| maxContribFor | 0.050 ✗ | 0.062 ✗ | 0.103 | 0.80 |
| meanBaseFor | 0.025 ✗ | 0.035 ✗ | 0.082 | 0.45 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **162** picks. Mean CLV = **-0.0029**.
t-statistic vs zero: -2.39 → ✓ p<.05 · 95% CI [-0.0053, -0.0005]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 12 | 5-7-0 | 41.7% [19–68] | -29.3% | -3.5u | -1.15 ✗ noise |
| CLV (−2%, 0] | 92 | 43-47-2 | 47.8% [38–58] | -5.4% | -13.5u | -0.51 ✗ noise |
| CLV (0, +2%] | 47 | 23-24-0 | 48.9% [35–63] | +6.4% | -1.9u | 0.36 ✗ noise |
| CLV > +2% | 11 | 4-7-0 | 36.4% [15–65] | -37.7% | -8.8u | -1.39 ✗ noise |

ρ(CLV, flat ROI) = -0.019 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=59 (with all features non-null). Intercept β₀ = 0.041.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔFlatPnl | +0.675 | ↑ helps |
| 2 | pw.ΔAvgRoi | +0.640 | ↑ helps |
| 3 | pw.ΔWlNet | +0.555 | ↑ helps |
| 4 | evEdge | +0.525 | ↑ helps |
| 5 | peak.stars | -0.479 | ↓ hurts |
| 6 | sharpCount | -0.437 | ↓ hurts |
| 7 | pw.ΔTopQShare | +0.408 | ↑ helps |
| 8 | pw.Δcount | +0.322 | ↑ helps |
| 9 | moneyPct | -0.300 | ↓ hurts |
| 10 | Δw | -0.279 | ↓ hurts |
| 11 | Δw + HC | -0.220 | ↓ hurts |
| 12 | odds (American) | -0.196 | ↓ hurts |
| 13 | log(impliedProb) | +0.163 | ↑ helps |
| 14 | criteriaMet | -0.133 | ↓ hurts |
| 15 | log10(invested) | -0.113 | ↓ hurts |
| 16 | walletPct | -0.028 | ≈ flat |
| 17 | HC margin | +0.010 | ≈ flat |
| 18 | vault.star | +0.006 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 6 | 3-3 | 50.0% | 50.0% | -105 | — (mute) | 3.42u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 35 | 20-15 | 57.1% | 55.6% | -106 | 4.22% bankroll | 1.52u | **UNDER-SIZED** — ship up to 4.22u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 11 | 3-8 | 27.3% | 38.1% | -105 | — (mute) | 1.94u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 32 | 20-12 | 62.5% | 59.5% | -105 | 8.51% bankroll | 2.55u | **UNDER-SIZED** — ship up to 8.51u (1u=1% bankroll) |
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
| 2026-05-11 | 4 | 2-2 | -1.4u | -6.8u |
| 2026-05-12 | 5 | 0-5 | -14.6u | -21.4u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -28.6u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.182  (annualized × √252 ≈ -2.88)

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
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.50 | -108 | 0 | — | — | 0 | 0 | -2.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1.00 | -108 | 0 | — | — | 0 | -1 | -1.70 | L | -1.0u |
| 2026-04-18 | NBA | TOTAL | over | 3.0 | 0.75 | -107 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-18 | NBA | TOTAL | under | 5.0 | 2.00 | -104 | — | — | — | — | — | 0.00 | W | +1.9u |
| 2026-04-18 | NBA | ML | home | 5.0 | 3.00 | -360 | — | — | — | — | — | 0.20 | W | +0.8u |
| 2026-04-18 | NBA | TOTAL | under | 4.5 | 1.50 | -105 | — | — | — | — | — | 0.00 | L | -1.5u |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 0 | 0 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 3 | 6 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 3 | 1 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 3 | 6 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 1 | 6 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 4 | 6 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 3 | 3 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 2 | 4 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | 0 | 3 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 1 | 2 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | 0 | -3 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | -1 | -15 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 2 | 18 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 1 | 7 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | 0 | -4 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | -1 | -20 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 1 | 3 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 2 | 14 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | 1 | 7 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 3 | -3 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 2 | 6 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 2 | 9 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 1 | -1 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | 0 | 0 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 1 | -1 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 0 | 0 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 1 | -1 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | 0 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | 0 | -1 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | -1 | -19 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | 0 | -4 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 2 | 3 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 6 | 18 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 4 | 12 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 2 | 3 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | -1 | -2 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | 0 | -3 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | 1 | -1 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | 1 | 2 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 0 | 0 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 2 | 9 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 3 | 17 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 2 | 0 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -2 | -5 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 1 | -1 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 6 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | 0 | -3 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 16 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 4 | 7 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 4 | 6 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | 0 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 2 | 1 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 2 | 26 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 2 | 30 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 6 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 3 | 27 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 1 | 2 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 1 | -2 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 1 | -2 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | -1 | -20 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 17 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 2 | -24 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | -1 | 1 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | -1 | 2 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | 6 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 1 | -2 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 1 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 29 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | -1 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -27 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 3 | 8 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | 0 | -4 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 1 | -2 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -29 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 4 | 16 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 4 | 39 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 5 | 19 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 0 | 0 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 1 | 2 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 3 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 0 | 0 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 3 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 3 | -17 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 7 | 6 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 4 | 18 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 2 | 8 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 2 | -1 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 1 | 10 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 0 | 11 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 0 | 12 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 4 | 4 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 5 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | 0 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 1 | -42 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 3 | -1 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 1 | -1 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 2 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | -7 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 3 | -7 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 23 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 4 | 8 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 1 | 3 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 3 | 18 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | 0 | -4 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 2 | -9 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 24 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 11 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 24 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | -1 | -2 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 48 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 4 | 16 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 3 | -9 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 2 | 3 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 6 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 3 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 4 | 22 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 1 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 31 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 4 | 29 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 1 | 2 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 1 | 0 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 2 | 2 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 3 | 37 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 4 | 44 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 30 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 1 | -1 | -1.30 | L | -1.1u |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.70 | -104 | — | — | — | 2 | 21 | 0.00 | W | +1.6u |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-09 | NBA | ML | away | 5.0 | 4.50 | -364 | 3 | 1 | 4 | 5 | 45 | 0.00 | W | +1.2u |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2.00 | -104 | 2 | 1 | 3 | 2 | 30 | 0.00 | W | +1.9u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -120 | 1 | 1 | 2 | 1 | -2 | 0.00 | W | +0.9u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 2 | 0 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 2 | 0 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -103 | 1 | 1 | 2 | 1 | -2 | 0.00 | L | -1.1u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -110 | 1 | 1 | 2 | 1 | -2 | 0.00 | W | +1.0u |
| 2026-05-10 | MLB | ML | away | 3.5 | 1.13 | +134 | 0 | 1 | 1 | 1 | -2 | 0.00 | W | +1.5u |
| 2026-05-10 | NBA | ML | home | 4.0 | 1.50 | +160 | 1 | 1 | 2 | 2 | 17 | 0.80 | W | +2.6u |
| 2026-05-10 | NBA | TOTAL | over | 5.0 | 3.50 | -110 | 3 | 2 | 5 | 3 | 40 | 0.00 | W | +3.3u |
| 2026-05-10 | NHL | ML | away | 4.5 | 4.50 | +108 | 2 | 2 | 4 | 2 | 1 | -0.70 | L | -4.5u |
| 2026-05-10 | NHL | TOTAL | under | 5.0 | 1.70 | -110 | 2 | 1 | 3 | 2 | -2 | 0.00 | L | -1.7u |
| 2026-05-11 | MLB | ML | away | 3.5 | 1.13 | -101 | 1 | 1 | 2 | 2 | -1 | 0.00 | W | +1.1u |
| 2026-05-11 | MLB | ML | home | 3.5 | 1.13 | -156 | 1 | 1 | 2 | 1 | -2 | 0.00 | W | +0.7u |
| 2026-05-11 | NBA | TOTAL | under | 4.5 | 2.00 | -110 | 1 | 2 | 3 | 0 | 14 | 0.00 | L | -2.0u |
| 2026-05-11 | NHL | TOTAL | under | 4.5 | 1.27 | -110 | 2 | 0 | 2 | 2 | 5 | 0.00 | L | -1.3u |
| 2026-05-12 | MLB | ML | away | 5.0 | 4.50 | +108 | 4 | 0 | 4 | 4 | 4 | -0.20 | L | -4.5u |
| 2026-05-12 | MLB | TOTAL | under | 4.0 | 0.64 | -110 | 2 | 1 | 3 | 2 | 0 | 0.00 | L | -0.6u |
| 2026-05-12 | MLB | ML | away | 4.5 | 3.00 | +129 | 3 | 0 | 3 | 3 | 6 | -1.00 | L | -3.0u |
| 2026-05-12 | MLB | ML | home | 5.0 | 3.00 | +108 | 3 | 0 | 3 | 3 | 2 | -0.50 | L | -3.0u |
| 2026-05-12 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 6 | 4 | 10 | 7 | 36 | -0.70 | L | -3.5u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._