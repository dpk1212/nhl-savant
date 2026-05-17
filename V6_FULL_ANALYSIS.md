# Sharp Intel v6 — Full Analysis

_Auto-generated **5/17/2026, 10:19:43 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 195 shipped+graded picks · 2026-04-18 → 2026-05-16  (HC analyses scoped to post-cutover 2026-04-30, 83 picks)
**Headline:** 93-100-2 · WR 48.2% [41.2%–55.2%] vs 52.4% break-even · -8.3u flat (-4.2%) · -26.2u peak.
**Overall t-test:** t = -0.56 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.170 ✓ p<.05**  (full sample, N=189)
- **ρ(HC, flat ROI) = 0.133 ✗**  (post-cutover, N=83)
- **ρ(Δw+HC, flat ROI) = 0.022 ✗**  (post-cutover, N=83)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)** — N=15, 4-11, WR 26.7% [11%–52%], flat ROI -50.6% (t=-2.30 ✓ p<.05)
- **Stale Δw ≤ 0 (full sample)** — N=40, 11-28, WR 28.2% [17%–44%], flat ROI -44.5% (t=-3.21 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=9, WR 55.6%, flat ROI +10.8%. Bayesian posterior WR ≈ 52.6%, half-Kelly = **0.3%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=49, WR 57.1%, flat ROI +13.4%. Bayesian posterior WR ≈ 55.9%, half-Kelly = **3.7%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=15, WR 26.7%, flat ROI -50.6%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=40, WR 60.0%, flat ROI +29.3%. Bayesian posterior WR ≈ 58.0%, half-Kelly = **5.9%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -44.5% flat ROI on 40 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.06u/pick), we need **~1712 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 195. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-16 |
| Sides scanned | 433 |
| Shipped + graded | **195** |
| W-L-P | 93-100-2 |
| Win rate | **48.2%** [41.2%–55.2%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +4.2 pp |
| Peak-units PnL | **-26.2u** |
| Flat-1u PnL | **-8.3u** (-4.2% flat ROI) |
| Flat t-statistic vs zero | -0.56 → ✗ noise |
| Flat 95% CI per-pick | [-0.191, 0.106]u |

### Power note

At our observed flat-PnL standard deviation (1.06u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4755 |
| +5% | 1712 |
| +10% | 428 |

We have **195** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 32 | 10-21-1 | 32.3% [19–50] | -37.1% | -16.2u | -2.31 ✓ p<.05 |
| Δw = +1 | 65 | 37-27-1 | 57.8% [46–69] | +10.6% | +9.4u | 0.89 ✗ noise |
| Δw = +2 | 44 | 17-27-0 | 38.6% [26–53] | -22.5% | -20.7u | -1.48 ✗ noise |
| Δw ≥ +3 | 40 | 24-16-0 | 60.0% [45–74] | +29.3% | +3.4u | 1.44 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.145** ✓ p<.05  ·  **ρ(Δw, flat ROI) = 0.170** ✓ p<.05  (N=189)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 23 | 9-13-1 | 40.9% [23–61] | -21.7% | -17.0u | -1.12 ✗ noise |
| HC = +1 | 49 | 28-21-0 | 57.1% [43–70] | +13.4% | +2.2u | 0.91 ✗ noise |
| HC = +2 | 8 | 5-3-0 | 62.5% [31–86] | +24.7% | +6.2u | 0.67 ✗ noise |
| HC ≥ +3 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.5u | 0.00 ✗ n<2 |

**Pearson ρ(HC, WIN) = 0.134** ✗  ·  **ρ(HC, flat ROI) = 0.133** ✗  (N=83)

Spearman rank ρ(HC, flat ROI) = 0.203.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.6u | 0.00 ✗ noise |
| Σ = +1 | 17 | 8-8-1 | 50.0% [28–72] | -1.3% | +0.7u | -0.06 ✗ noise |
| Σ = +2 | 32 | 20-12-0 | 62.5% [45–77] | +20.4% | +7.7u | 1.19 ✗ noise |
| Σ = +3 | 13 | 3-10-0 | 23.1% [8–50] | -50.7% | -16.7u | -1.85 ~ p<.10 |
| Σ = +4 | 7 | 4-3-0 | 57.1% [25–84] | +6.4% | -3.5u | 0.16 ✗ noise |
| Σ = +5 | 6 | 4-2-0 | 66.7% [30–90] | +33.7% | +3.9u | 0.79 ✗ noise |
| Σ ≥ +6 | 6 | 3-3-0 | 50.0% [19–81] | +5.9% | -4.1u | 0.12 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = 0.017** ✗  ·  **ρ(Σ, flat ROI) = 0.022** ✗  (N=83)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 83.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.049 ✗ | -0.042 ✗ | -0.011 | weak |
| HC margin | 0.134 ✗ | 0.133 ✗ | 0.203 | weak |
| Δw + HC | 0.017 ✗ | 0.022 ✗ | 0.071 | weak |
| peak.stars | -0.117 ✗ | -0.126 ✗ | -0.103 | weak |
| vault.star | -0.093 ✗ | -0.059 ✗ | -0.061 | weak |
| lock.stars | -0.108 ✗ | -0.136 ✗ | -0.138 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 83 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=9 · 5-3 · 63% [31–86] · +18%  | N=8 · 3-5 · 38% [14–69] · -32%  | N=5 · 1-4 · 20% [4–62] · -61%  |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=8 · 3-5 · 38% [14–69] · -23%  | N=22 · 17-5 · 77% [57–90] · +50% ★ | N=10 · 3-7 · 30% [11–60] · -36%  | N=8 · 5-3 · 63% [31–86] · +24%  |
| +2 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=1 · 0-1 · 0% [0–79] · —  | N=6 · 5-1 · 83% [44–97] · +66% ★ |
| ≥ +3 | — | — | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 23 | 9-13-1 | 40.9% [23–61] | -21.7% | -17.0u | -1.12 ✗ noise |
| HC = +1 | 49 | 28-21-0 | 57.1% [43–70] | +13.4% | +2.2u | 0.91 ✗ noise |
| HC = +2 | 8 | 5-3-0 | 62.5% [31–86] | +24.7% | +6.2u | 0.67 ✗ noise |
| HC ≥ +3 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.5u | 0.00 ✗ n<2 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 9 | 3-6-0 | 33.3% [12–65] | -31.3% | -2.9u | -0.91 ✗ noise |
| Δw = +1 | 32 | 22-9-1 | 71.0% [53–84] | +36.4% | +14.0u | 2.29 ✓ p<.05 |
| Δw = +2 | 19 | 6-13-0 | 31.6% [15–54] | -37.5% | -16.9u | -1.66 ~ p<.10 |
| Δw ≥ +3 | 22 | 11-11-0 | 50.0% [31–69] | -0.8% | -8.7u | -0.04 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 58 | 33-25-0 | 56.9% [44–69] | +13.0% | +4.9u | 0.97 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 15 | 4-11-0 | 26.7% [11–52] | -50.6% | -19.1u | -2.30 ✓ p<.05 |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 10 | 5-4-1 | 55.6% [27–81] | +5.9% | -1.5u | 0.20 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 175 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δcount = −1 | 9 | 1-8-0 | 11.1% [2–44] | -72.8% | -10.2u | -2.67 ✓ p<.01 |
| Δcount = 0 (balanced) | 17 | 5-12-0 | 29.4% [13–53] | -48.9% | -13.6u | -2.42 ✓ p<.05 |
| Δcount = +1 | 47 | 27-19-1 | 58.7% [44–72] | +15.5% | +5.7u | 1.08 ✗ noise |
| Δcount = +2 | 50 | 21-28-1 | 42.9% [30–57] | -18.8% | -12.2u | -1.39 ✗ noise |
| Δcount ≥ +3 (heavy support) | 51 | 33-18-0 | 64.7% [51–76] | +37.3% | +14.1u | 2.21 ✓ p<.05 |

**ρ(Δcount, WIN) = 0.240** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.284** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -2 · ≤ 0 · ≤ 4 · ≤ 12 · > 12

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 42 | 16-26-0 | 38.1% [25–53] | -24.8% | -17.4u | -1.64 ✗ noise |
| Q2 | 31 | 12-18-1 | 40.0% [25–58] | -16.0% | -5.0u | -0.85 ✗ noise |
| Q3 (balanced) | 38 | 17-21-0 | 44.7% [30–60] | -13.3% | -26.1u | -0.83 ✗ noise |
| Q4 | 30 | 19-11-0 | 63.3% [46–78] | +22.2% | +9.8u | 1.17 ✗ noise |
| Q5 (best — heavy support) | 34 | 23-10-1 | 69.7% [53–83] | +43.6% | +22.1u | 2.14 ✓ p<.05 |

**ρ(ΔWlNet, WIN) = 0.261** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.235** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -2.31 · ≤ 0.22 · ≤ 2.86 · ≤ 10.63 · > 10.63

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 36 | 14-22-0 | 38.9% [25–55] | -24.5% | -13.9u | -1.52 ✗ noise |
| Q2 | 35 | 10-24-1 | 29.4% [17–46] | -38.2% | -23.3u | -2.38 ✓ p<.05 |
| Q3 | 35 | 16-19-0 | 45.7% [30–62] | -14.5% | -14.5u | -0.89 ✗ noise |
| Q4 | 35 | 23-12-0 | 65.7% [49–79] | +27.2% | +6.6u | 1.65 ~ p<.10 |
| Q5 | 34 | 24-9-1 | 72.7% [56–85] | +55.3% | +28.5u | 2.61 ✓ p<.01 |

**ρ(ΔFlatPnl, WIN) = 0.295** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.322** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -9.2 · ≤ -0.1 · ≤ 9.8 · ≤ 28.9 · > 28.9

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 36 | 9-26-1 | 25.7% [14–42] | -43.8% | -26.8u | -2.64 ✓ p<.01 |
| Q2 | 35 | 15-20-0 | 42.9% [28–59] | -16.6% | -7.0u | -0.99 ✗ noise |
| Q3 | 35 | 10-25-0 | 28.6% [16–45] | -42.8% | -38.4u | -2.72 ✓ p<.01 |
| Q4 | 35 | 27-7-1 | 79.4% [63–90] | +47.3% | +22.9u | 3.40 ✓ p<.01 |
| Q5 | 34 | 26-8-0 | 76.5% [60–88] | +61.8% | +32.7u | 3.15 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.406** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.397** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 17 | 2-15-0 | 11.8% [3–34] | -75.6% | -16.3u | -4.54 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 13 | 4-9-0 | 30.8% [13–58] | -39.1% | -8.7u | -1.46 ✗ noise |
| ΔBestRank = 0 (tied) | 1 | 1-0-0 | 100.0% [21–100] | +90.9% | +0.3u | 0.00 ✗ n<2 |
| ΔBestRank ∈ [+1,+4] | 8 | 2-6-0 | 25.0% [7–59] | -54.0% | -8.8u | -1.79 ~ p<.10 |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 26 | 16-9-1 | 64.0% [45–80] | +33.0% | +7.1u | 1.46 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.438** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.415** ✓ p<.01  (N=65)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 12 | 3-9-0 | 25.0% [9–53] | -33.4% | -2.6u | -0.89 ✗ noise |
| Δshare ∈ [−30,−10] pp | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.0u | 0.00 ✗ n<2 |
| Δshare ≈ 0 (±10 pp) | 111 | 48-61-2 | 44.0% [35–53] | -16.0% | -42.4u | -1.76 ~ p<.10 |
| Δshare ∈ [+10,+30] pp | 13 | 7-6-0 | 53.8% [29–77] | +10.0% | +1.8u | 0.34 ✗ noise |
| Δshare ≥ +30 pp | 38 | 29-9-0 | 76.3% [61–87] | +59.3% | +29.5u | 3.26 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.240** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.208** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.406 ✓ p<.01 | 0.397 ✓ p<.01 | 0.389 |
| 2 | **ΔTopQCount** | 0.331 ✓ p<.01 | 0.363 ✓ p<.01 | 0.312 |
| 3 | **ΔFlatPnl** | 0.295 ✓ p<.01 | 0.322 ✓ p<.01 | 0.273 |
| 4 | **Δcount** | 0.240 ✓ p<.01 | 0.284 ✓ p<.01 | 0.203 |
| 5 | **ΔWlNet** | 0.261 ✓ p<.01 | 0.235 ✓ p<.01 | 0.212 |
| 6 | **ΔTopQShare** | 0.240 ✓ p<.01 | 0.208 ✓ p<.01 | 0.267 |

_(ΔBestRank uses N=65 subset where both sides had a proven wallet — ρ(flat ROI) = 0.415 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 370, dateRange = 2026-04-18 → 2026-05-16, computedAt = 2026-05-17T14:11:01.426Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **175** rows · PIT aggregate computable on **169** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **169** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 2 · 100% · +285.1% | 8 · 63% · +13.6% | -271.6pp |
| NEUTRAL (0..+3) | 96 · 57% · +9.1% | 99 · 53% · +2.4% | -6.7pp |
| WEAK (−3..0) | 43 · 43% · -15.1% | 38 · 41% · -18.4% | -3.3pp |
| FADE (<−3) | 19 · 21% · -57.9% | 15 · 40% · +3.0% | +60.9pp |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=56, WR=62%, ROI=+22.4% | N=86, WR=58%, ROI=+12.5% | -9.9pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=98, WR=58%, ROI=+14.7% | N=107, WR=54%, ROI=+3.2% | -11.5pp |
| AGS < −1 (mute veto) | N=24, WR=21%, ROI=-61.3% | N=19, WR=37%, ROI=-3.0% | +58.3pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-03 → 2026-05-16, N=71)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 4 · 100% · +78.3% |
| NEUTRAL (0..+3) | 50 · 52% · +2.2% |
| WEAK (−3..0) | 14 · 43% · -15.8% |
| FADE (<−3) | 3 · 33% · -36.4% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=46, WR=59%, ROI=+13.6% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=54, WR=56%, ROI=+7.9% |
| AGS < −1 (mute veto) | N=5, WR=20%, ROI=-61.8% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.46 | 1.60 |
| `dHcCount` | COUNT_HC | + | 0.46 | 0.82 |
| `dConvictionAvg` | INTENSITY | + | 0.54 | 0.56 |
| `dHcSizeRatio` | INTENSITY_HC | + | 1.56 | 5.35 |
| `forContribShare` | DOMINANCE | + | 0.81 | 0.25 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **169/195** shipped+graded rows (87%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -9.49 |
| 20th pct | -1.53 |
| 40th pct | 0.80 |
| Median | 1.08 |
| 60th pct | 1.25 |
| 80th pct | 1.85 |
| 90th pct | 2.59 |
| Max | 4.67 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 5 | 3.0% |
| **LOCK** | +5..+7 | 85 | 50.3% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 31 | 18.3% |
| **FADE** | < −3 | 18 | 10.7% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 5 | 4-1-0 | 80.0% [38–96] | +42.6% | +6.6u | 1.12 ✗ noise |
| LOCK | 85 | 44-41-0 | 51.8% [41–62] | -0.4% | -14.1u | -0.04 ✗ noise |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 31 | 11-19-1 | 36.7% [22–54] | -29.7% | -13.3u | -1.79 ~ p<.10 |
| FADE | 18 | 7-11-0 | 38.9% [20–61] | +2.4% | -9.9u | 0.07 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.129** ~ p<.10 · r(ROI) = **0.059** ✗ · Spearman ρ(ROI) = **0.080**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 19 | 8-11-0 | 42.1% [23–64] | +6.6% | -9.0u | 0.19 ✗ noise |
| z ∈ [−1, 0) | 61 | 29-30-2 | 49.2% [37–62] | -5.6% | -6.0u | -0.46 ✗ noise |
| z ∈ [0, +1) | 60 | 24-36-0 | 40.0% [29–53] | -23.5% | -27.8u | -1.90 ~ p<.10 |
| z ≥ +1 (very positive) | 29 | 18-11-0 | 62.1% [44–77] | +20.9% | +15.1u | 1.13 ✗ noise |

#### `dHcCount` (COUNT_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 135 | 64-69-2 | 48.1% [40–57] | -6.8% | -24.7u | -0.80 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dConvictionAvg` (INTENSITY)

r(WIN) = **0.158** ✓ p<.05 · r(ROI) = **0.055** ✗ · Spearman ρ(ROI) = **0.113**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 21 | 6-15-0 | 28.6% [14–50] | -21.5% | -13.9u | -0.67 ✗ noise |
| z ∈ [−1, 0) | 38 | 19-18-1 | 51.4% [36–67] | -1.8% | -7.3u | -0.11 ✗ noise |
| z ∈ [0, +1) | 89 | 42-46-1 | 47.7% [38–58] | -6.6% | -7.8u | -0.63 ✗ noise |
| z ≥ +1 (very positive) | 21 | 12-9-0 | 57.1% [37–76] | +3.9% | +1.2u | 0.19 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 135 | 64-69-2 | 48.1% [40–57] | -6.8% | -24.7u | -0.80 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `forContribShare` (DOMINANCE)

r(WIN) = **0.112** ✗ · r(ROI) = **0.010** ✗ · Spearman ρ(ROI) = **0.081**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 14 | 5-9-0 | 35.7% [16–61] | -2.1% | -7.5u | -0.05 ✗ noise |
| z ∈ [−1, 0) | 43 | 16-26-1 | 38.1% [25–53] | -24.5% | -23.3u | -1.62 ✗ noise |
| z ∈ [0, +1) | 112 | 58-53-1 | 52.3% [43–61] | +0.5% | +3.1u | 0.06 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | 0.158 ✓ p<.05 | 0.055 ✗ | 0.113 |
| 2 | `forContribShare` | DOMINANCE | 0.112 ✗ | 0.010 ✗ | 0.081 |
| 3 | `dCount` | COUNT | 0.129 ~ p<.10 | 0.059 ✗ | 0.080 |
| 4 | `dHcCount` | COUNT_HC | NaN — | NaN — | NaN |
| 5 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | +0.216 | 0.793 | 32.0% | meaningful |
| 2 | `dConvictionAvg` | +0.105 | 0.781 | 31.5% | meaningful |
| 3 | `forContribShare` | +0.108 | 0.732 | 29.5% | meaningful |
| 4 | `dHcCount` | -0.114 | 0.114 | 4.6% | silent (<0.2) |
| 5 | `dHcSizeRatio` | -0.059 | 0.059 | 2.4% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcCount` | `dConvictionAvg` | `dHcSizeRatio` | `forContribShare` |
|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.324 | +0.277 | +0.324 | +0.508 |
| `dHcCount` | +0.324 | 1.000 | +0.155 | +1.000 ⚠ | +0.236 |
| `dConvictionAvg` | +0.277 | +0.155 | 1.000 | +0.155 | +0.882 ⚠ |
| `dHcSizeRatio` | +0.324 | +1.000 ⚠ | +0.155 | 1.000 | +0.236 |
| `forContribShare` | +0.508 | +0.236 | +0.882 ⚠ | +0.236 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.152**. At AGS ≥ +1 fires N=91, WR=56.0%, ROI=+8.3%. At AGS ≥ +null fires N=114, WR=51.3%, ROI=-1.5%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-91 ROI (matched cohort) | Top-91 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.122 | −0.030 | WR=52%, ROI=-0.0% | +8.4pp | N=76, WR=54%, ROI=+3.4% |
| `dHcCount` | +0.141 | −0.010 | WR=55%, ROI=+5.5% | +2.9pp | N=95, WR=54%, ROI=+3.8% |
| `dConvictionAvg` | +0.113 | −0.039 | WR=50%, ROI=-4.2% | +12.5pp | N=60, WR=52%, ROI=+0.6% |
| `dHcSizeRatio` | +0.152 | −0.000 | WR=55%, ROI=+5.5% | +2.9pp | N=93, WR=55%, ROI=+6.0% |
| `forContribShare` | +0.165 | +0.013 | WR=58%, ROI=+11.8% | -3.5pp | N=53, WR=57%, ROI=+8.8% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dConvictionAvg` | −0.039 | +12.5pp | carries marginal info |
| 2 | `dCount` | −0.030 | +8.4pp | carries marginal info |
| 3 | `dHcCount` | −0.010 | +2.9pp | mild marginal info |
| 4 | `dHcSizeRatio` | −0.000 | +2.9pp | redundant — other features cover it |
| 5 | `forContribShare` | +0.013 | -3.5pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | +0.298 | 0.298 | positive ↑ |
| 2 | `dCount` | COUNT | +0.163 | 0.163 | positive ↑ |
| 3 | `forContribShare` | DOMINANCE | -0.120 | 0.120 | negative ↓ |
| 4 | `dHcCount` | COUNT_HC | -0.014 | 0.014 | flat ≈ 0 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | -0.007 | 0.007 | flat ≈ 0 |

Intercept b = -0.190 · Final log-loss = 0.6753 · N = 169.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | #1 | #2 | #1 | #1 | 1.25 |
| 2 | `dCount` | COUNT | #3 | #1 | #2 | #2 | 2.00 |
| 3 | `forContribShare` | DOMINANCE | #2 | #3 | #5 | #3 | 3.25 |
| 4 | `dHcCount` | COUNT_HC | #4 | #4 | #3 | #4 | 3.75 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | #5 | #5 | #4 | #5 | 4.75 |

#### Plain-English summary

- **Workhorse**: `dConvictionAvg` (INTENSITY) — ranks #1/#2/#1/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dHcSizeRatio` (INTENSITY_HC) — composite avg rank 4.75. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dHcCount` ↔ `dHcSizeRatio` (r=+1.00); `dConvictionAvg` ↔ `forContribShare` (r=+0.88). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dHcCount`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **v9 simplification candidate**: only `dCount`, `dHcCount`, `dConvictionAvg` carry marginal info (Spearman ρ drop > 0.01 when removed). The other 3 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=169 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 169 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/169 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 56 | 27-29-0 | 48.2% [36–61] | -12.1% | -19.4u | -0.96 ✗ noise |
| 4.5★ | 18 | 10-8-0 | 55.6% [34–75] | +15.4% | +4.0u | 0.56 ✗ noise |
| 4.0★ | 33 | 15-17-1 | 46.9% [31–64] | -6.5% | -5.3u | -0.36 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 18 | 6-11-1 | 35.3% [17–59] | -26.0% | -5.8u | -1.11 ✗ noise |
| 2.5★ | 32 | 16-16-0 | 50.0% [34–66] | -2.4% | -3.5u | -0.14 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 2/50%/-6% | 6/0%/-100% | 6/33%/-26% | 10/33%/-33% | 12/25%/-51% |
| Δw = +1 | 3/100%/+71% | 5/40%/-24% | 13/67%/+32% | 28/54%/+4% | 2/0%/-100% | 13/62%/+14% |
| Δw = +2 | 20/35%/-29% | 4/50%/-3% | 13/46%/-9% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 28/50%/-9% | 4/75%/+90% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | 1/100%/+145% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 6 | 3-3-0 | 50.0% [19–81] | -30.7% | +0.3u | -0.99 ✗ noise |
| −200/−151 | 14 | 5-9-0 | 35.7% [16–61] | -42.8% | -12.9u | -2.01 ✓ p<.05 |
| −150/−101 | 113 | 56-56-1 | 50.0% [41–59] | -4.6% | -1.0u | -0.51 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 43 | 20-22-1 | 47.6% [33–62] | +5.1% | -16.5u | 0.30 ✗ noise |
| +151/+200 | 3 | 2-1-0 | 66.7% [21–94] | +86.0% | +2.1u | 0.92 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -67% (4) | — | +47% (1) | +34% (1) |
| −200/−151 | -100% (5) | +20% (4) | -21% (2) | -100% (2) |
| −150/−101 | -35% (22) | +20% (43) | -42% (26) | +21% (19) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +8% (6) | -15% (14) | +8% (12) | +27% (11) |
| +151/+200 | — | +160% (1) | +198% (1) | — |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 105 | 49-56-0 | 46.7% [37–56] | -4.9% | -30.2u | -0.44 ✗ noise |
| SPREAD | 33 | 14-18-1 | 43.8% [28–61] | -15.8% | +1.5u | -0.96 ✗ noise |
| TOTAL | 57 | 30-26-1 | 53.6% [41–66] | +3.6% | +2.4u | 0.28 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=19 · 21% · -60% | N=34 · 56% · +7% | N=22 · 36% · -23% | N=27 · 59% · +34% |
| SPREAD | N=10 · 22% · -51% | N=9 · 33% · -35% | N=8 · 63% · +16% | N=5 · 60% · +17% |
| TOTAL | N=11 · 45% · -12% | N=22 · 71% · +36% | N=14 · 29% · -44% | N=8 · 63% · +22% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 76 | 33-43-0 | 43.4% [33–55] | -15.9% | -24.7u | -1.43 ✗ noise |
| NBA | 94 | 47-46-1 | 50.5% [41–60] | +2.2% | +3.3u | 0.19 ✗ noise |
| NHL | 25 | 13-11-1 | 54.2% [35–72] | +7.1% | -4.9u | 0.35 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=10 · 20% · -56% | N=30 · 57% · +8% | N=22 · 27% · -49% | N=13 · 54% · +9% |
| NBA | N=25 · 25% · -52% | N=24 · 58% · +14% | N=15 · 53% · +10% | N=25 · 64% · +40% |
| NHL | N=5 · 60% · +17% | N=11 · 60% · +10% | N=7 · 43% · -9% | N=2 · 50% · +22% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 113 · 43% · -10.8% · -1.03 ✗ noise | 81 · 54% · +3.1% · 0.29 ✗ noise |
| **plusEV** | 24 · 38% · -17.9% · -0.64 ✗ noise | 170 · 49% · -3.2% · -0.41 ✗ noise |
| **pinnacleConfirms** | 54 · 46% · -4.1% · -0.25 ✗ noise | 69 · 46% · -9.1% · -0.73 ✗ noise |
| **invested10kPlus** | 102 · 44% · -9.8% · -0.88 ✗ noise | 21 · 57% · +7.1% · 0.33 ✗ noise |
| **lineMovingWith** | 106 · 50% · -1.1% · -0.11 ✗ noise | 88 · 46% · -9.7% · -0.88 ✗ noise |
| **predMarketAligns** | 44 · 50% · +0.2% · 0.01 ✗ noise | 79 · 44% · -10.9% · -0.92 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 34 | 21-13-0 | 61.8% [45–76] | +18.8% | +3.8u | 1.13 ✗ noise |
| 1 | 41 | 18-22-1 | 45.0% [31–60] | -14.9% | -9.4u | -1.01 ✗ noise |
| 2 | 51 | 24-26-1 | 48.0% [35–61] | -0.7% | +5.8u | -0.04 ✗ noise |
| 3 | 24 | 11-13-0 | 45.8% [28–65] | -10.7% | -8.0u | -0.51 ✗ noise |
| 4 | 21 | 6-15-0 | 28.6% [14–50] | -41.5% | -19.0u | -1.99 ✓ p<.05 |
| 5 | 18 | 11-7-0 | 61.1% [39–80] | +5.2% | +0.3u | 0.24 ✗ noise |
| 6 | 6 | 2-4-0 | 33.3% [10–70] | +35.8% | +0.1u | 0.37 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 46 | 29-16-1 | 64.4% [50–77] | +19.5% | +23.9u | 1.44 ✗ noise |
| NEAR_START | 88 | 36-51-1 | 41.4% [32–52] | -12.3% | -32.0u | -1.01 ✗ noise |
| NO_MOVE | 6 | 2-4-0 | 33.3% [10–70] | -36.2% | -1.1u | -0.90 ✗ noise |
| PREGAME | 23 | 13-10-0 | 56.5% [37–74] | +5.0% | +0.2u | 0.25 ✗ noise |
| SMALL_MOVE | 30 | 11-19-0 | 36.7% [22–54] | -25.8% | -19.7u | -1.37 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 110 | 51-58-1 | 46.8% [38–56] | -12.3% | -25.8u | -1.36 ✗ noise |
| STRONG | 42 | 22-20-0 | 52.4% [38–67] | +3.2% | -0.4u | 0.20 ✗ noise |
| LEAN | 39 | 18-20-1 | 47.4% [32–63] | +9.1% | -1.3u | 0.42 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.086 ✗ | -0.021 ✗ | -0.054 | -0.30 |
| totalInvested | -0.107 ✗ | -0.087 ✗ | -0.030 | -1.21 |
| evEdge | 0.052 ✗ | 0.056 ✗ | 0.047 | 0.78 |
| moneyPct | -0.036 ✗ | -0.107 ✗ | -0.085 | -1.49 |
| walletPct | 0.052 ✗ | 0.011 ✗ | 0.011 | 0.16 |
| criteriaMet | -0.079 ✗ | -0.041 ✗ | -0.090 | -0.56 |
| maxContribFor | 0.049 ✗ | 0.064 ✗ | 0.096 | 0.89 |
| meanBaseFor | 0.001 ✗ | 0.017 ✗ | 0.038 | 0.23 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **187** picks. Mean CLV = **-0.0031**.
t-statistic vs zero: -2.54 → ✓ p<.05 · 95% CI [-0.0055, -0.0007]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 17 | 9-8-0 | 52.9% [31–74] | -8.2% | +2.4u | -0.37 ✗ noise |
| CLV (−2%, 0] | 100 | 44-54-2 | 44.9% [35–55] | -11.0% | -30.7u | -1.08 ✗ noise |
| CLV (0, +2%] | 57 | 30-27-0 | 52.6% [40–65] | +13.3% | +6.3u | 0.84 ✗ noise |
| CLV > +2% | 13 | 5-8-0 | 38.5% [18–64] | -35.2% | -10.3u | -1.43 ✗ noise |

ρ(CLV, flat ROI) = -0.029 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=84 (with all features non-null). Intercept β₀ = 0.047.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔAvgRoi | +0.626 | ↑ helps |
| 2 | pw.Δcount | +0.553 | ↑ helps |
| 3 | sharpCount | -0.499 | ↓ hurts |
| 4 | moneyPct | -0.428 | ↓ hurts |
| 5 | evEdge | +0.249 | ↑ helps |
| 6 | pw.ΔFlatPnl | +0.245 | ↑ helps |
| 7 | log(impliedProb) | +0.236 | ↑ helps |
| 8 | peak.stars | -0.228 | ↓ hurts |
| 9 | HC margin | +0.202 | ↑ helps |
| 10 | odds (American) | -0.167 | ↓ hurts |
| 11 | Δw | -0.138 | ↓ hurts |
| 12 | vault.star | -0.131 | ↓ hurts |
| 13 | pw.ΔWlNet | +0.090 | ↑ helps |
| 14 | criteriaMet | +0.036 | ≈ flat |
| 15 | Δw + HC | -0.028 | ≈ flat |
| 16 | walletPct | +0.009 | ≈ flat |
| 17 | log10(invested) | +0.007 | ≈ flat |
| 18 | pw.ΔTopQShare | -0.007 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 9 | 5-4 | 55.6% | 52.6% | -105 | 1.45% bankroll | 3.33u | **OVER-SIZED** — reduce to 1.45u |
| Tier-1b HC = +1 (post-cutover) | 49 | 28-21 | 57.1% | 55.9% | -106 | 4.61% bankroll | 1.74u | **UNDER-SIZED** — ship up to 4.61u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 15 | 4-11 | 26.7% | 36.0% | -110 | — (mute) | 2.02u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 40 | 24-16 | 60.0% | 58.0% | -104 | 7.16% bankroll | 2.71u | **UNDER-SIZED** — ship up to 7.16u (1u=1% bankroll) |
| Stale Δw = 0 | 32 | 10-21 | 32.3% | 36.6% | -108 | — (mute) | 1.18u | **MUTE** (negative EV at posterior) |
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
| 2026-05-13 | 6 | 4-2 | +3.2u | -18.3u |
| 2026-05-14 | 5 | 1-4 | -8.0u | -26.3u |
| 2026-05-15 | 8 | 4-4 | -1.4u | -27.7u |
| 2026-05-16 | 6 | 4-2 | +1.4u | -26.3u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -34.7u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.194  (annualized × √252 ≈ -3.08)

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
| 2026-05-13 | MLB | ML | home | 4.5 | 4.50 | -116 | 1 | 1 | 2 | 3 | -2 | -1.30 | W | +3.7u |
| 2026-05-13 | MLB | SPREAD | home | 5.0 | 3.50 | -105 | 1 | 1 | 2 | 4 | 2 | 0.90 | W | +3.2u |
| 2026-05-13 | MLB | TOTAL | under | 4.0 | 0.96 | -110 | 1 | 1 | 2 | 1 | -2 | 0.00 | W | +0.9u |
| 2026-05-13 | MLB | TOTAL | under | 5.0 | 3.50 | -110 | 4 | 2 | 6 | 3 | -2 | 0.00 | L | -3.5u |
| 2026-05-13 | NBA | ML | home | 5.0 | 4.50 | -162 | 6 | 0 | 6 | 4 | 3 | -1.00 | L | -4.5u |
| 2026-05-13 | NBA | TOTAL | over | 5.0 | 3.50 | -101 | 3 | 2 | 5 | 4 | 0 | 0.00 | W | +3.4u |
| 2026-05-14 | MLB | ML | home | 5.0 | 4.50 | -103 | 4 | 1 | 5 | 4 | 2 | -0.40 | L | -4.5u |
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 2 | 4 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | 0 | 0.00 | L | -0.5u |
| 2026-05-14 | NHL | TOTAL | under | 5.0 | 3.50 | -110 | 3 | 1 | 4 | 3 | 1 | 0.00 | L | -3.5u |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 0 | 1 | 1 | 2 | 2 | 0.00 | W | +1.7u |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 1 | 1 | 2 | 1 | -2 | 0.00 | W | +0.3u |
| 2026-05-15 | MLB | ML | home | 4.0 | 2.50 | +128 | 0 | 0 | 0 | 2 | 3 | 0.00 | L | -2.5u |
| 2026-05-15 | MLB | ML | away | 4.0 | 2.75 | -211 | 2 | 1 | 3 | 2 | 6 | -0.90 | W | +1.3u |
| 2026-05-15 | MLB | ML | away | 3.0 | 1.25 | +115 | 0 | 1 | 1 | 0 | -4 | -1.10 | L | -1.3u |
| 2026-05-15 | NBA | ML | away | 2.5 | 0.50 | +145 | 6 | 1 | 7 | 7 | -26 | -0.50 | W | +0.8u |
| 2026-05-15 | NBA | TOTAL | over | 4.0 | 0.75 | -109 | 0 | 1 | 1 | 2 | -25 | 0.00 | L | -0.8u |
| 2026-05-15 | NBA | SPREAD | home | 2.5 | 1.00 | -105 | 1 | 0 | 1 | 1 | 38 | 0.00 | L | -1.0u |
| 2026-05-15 | NBA | TOTAL | over | 5.0 | 2.00 | -110 | 1 | 0 | 1 | 3 | -1 | 0.00 | W | +1.9u |
| 2026-05-16 | MLB | ML | away | 5.0 | 4.50 | +124 | 3 | 1 | 4 | 3 | -1 | -1.30 | W | +1.4u |
| 2026-05-16 | MLB | SPREAD | away | 4.0 | 1.65 | -175 | 2 | 0 | 2 | 2 | 0 | 0.00 | W | +0.9u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +119 | 2 | 1 | 3 | 2 | 0 | -2.00 | L | -2.5u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +115 | 3 | 2 | 5 | 2 | 0 | -1.10 | W | +2.8u |
| 2026-05-16 | MLB | TOTAL | over | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | 0 | 0.00 | L | -1.6u |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.50 | -102 | 1 | 0 | 1 | 1 | -8 | 0.00 | W | +0.5u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._