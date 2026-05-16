# Sharp Intel v6 — Full Analysis

_Auto-generated **5/16/2026, 10:17:07 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 189 shipped+graded picks · 2026-04-18 → 2026-05-15  (HC analyses scoped to post-cutover 2026-04-30, 77 picks)
**Headline:** 89-98-2 · WR 47.6% [40.6%–54.7%] vs 52.4% break-even · -10.2u flat (-5.4%) · -27.7u peak.
**Overall t-test:** t = -0.70 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.164 ✓ p<.05**  (full sample, N=183)
- **ρ(HC, flat ROI) = 0.126 ✗**  (post-cutover, N=77)
- **ρ(Δw+HC, flat ROI) = 0.003 ✗**  (post-cutover, N=77)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)** — N=13, 3-10, WR 23.1% [8%–50%], flat ROI -55.1% (t=-2.33 ✓ p<.05)
- **Stale Δw ≤ 0 (full sample)** — N=40, 11-28, WR 28.2% [17%–44%], flat ROI -44.5% (t=-3.21 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=8, WR 50.0%, flat ROI -2.2%. Bayesian posterior WR ≈ 50.0%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=47, WR 57.4%, flat ROI +13.4%. Bayesian posterior WR ≈ 56.1%, half-Kelly = **3.9%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=13, WR 23.1%, flat ROI -55.1%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=38, WR 57.9%, flat ROI +24.5%. Bayesian posterior WR ≈ 56.3%, half-Kelly = **4.1%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -44.5% flat ROI on 40 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.06u/pick), we need **~1715 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 189. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-15 |
| Sides scanned | 420 |
| Shipped + graded | **189** |
| W-L-P | 89-98-2 |
| Win rate | **47.6%** [40.6%–54.7%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +4.8 pp |
| Peak-units PnL | **-27.7u** |
| Flat-1u PnL | **-10.2u** (-5.4% flat ROI) |
| Flat t-statistic vs zero | -0.70 → ✗ noise |
| Flat 95% CI per-pick | [-0.205, 0.097]u |

### Power note

At our observed flat-PnL standard deviation (1.06u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4763 |
| +5% | 1715 |
| +10% | 429 |

We have **189** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 32 | 10-21-1 | 32.3% [19–50] | -37.1% | -16.2u | -2.31 ✓ p<.05 |
| Δw = +1 | 64 | 36-27-1 | 57.1% [45–69] | +9.3% | +8.9u | 0.77 ✗ noise |
| Δw = +2 | 41 | 16-25-0 | 39.0% [26–54] | -20.7% | -17.5u | -1.30 ✗ noise |
| Δw ≥ +3 | 38 | 22-16-0 | 57.9% [42–72] | +24.5% | -0.7u | 1.16 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.140** ~ p<.10  ·  **ρ(Δw, flat ROI) = 0.164** ✓ p<.05  (N=183)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 20 | 7-12-1 | 36.8% [19–59] | -27.7% | -16.8u | -1.33 ✗ noise |
| HC = +1 | 47 | 27-20-0 | 57.4% [43–70] | +13.4% | +3.3u | 0.90 ✗ noise |
| HC = +2 | 7 | 4-3-0 | 57.1% [25–84] | +11.7% | +3.4u | 0.30 ✗ noise |
| HC ≥ +3 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.5u | 0.00 ✗ n<2 |

**Pearson ρ(HC, WIN) = 0.138** ✗  ·  **ρ(HC, flat ROI) = 0.126** ✗  (N=77)

Spearman rank ρ(HC, flat ROI) = 0.196.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.6u | 0.00 ✗ noise |
| Σ = +1 | 16 | 7-8-1 | 46.7% [25–70] | -7.6% | +0.2u | -0.31 ✗ noise |
| Σ = +2 | 30 | 19-11-0 | 63.3% [46–78] | +23.1% | +8.4u | 1.31 ✗ noise |
| Σ = +3 | 12 | 3-9-0 | 25.0% [9–53] | -46.5% | -14.2u | -1.58 ✗ noise |
| Σ = +4 | 6 | 3-3-0 | 50.0% [19–81] | -13.2% | -4.8u | -0.33 ✗ noise |
| Σ = +5 | 5 | 3-2-0 | 60.0% [23–88] | +17.4% | +1.1u | 0.36 ✗ noise |
| Σ ≥ +6 | 6 | 3-3-0 | 50.0% [19–81] | +5.9% | -4.1u | 0.12 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = 0.005** ✗  ·  **ρ(Σ, flat ROI) = 0.003** ✗  (N=77)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 77.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.064 ✗ | -0.060 ✗ | -0.031 | weak |
| HC margin | 0.138 ✗ | 0.126 ✗ | 0.196 | weak |
| Δw + HC | 0.005 ✗ | 0.003 ✗ | 0.057 | weak |
| peak.stars | -0.118 ✗ | -0.135 ✗ | -0.119 | weak |
| vault.star | -0.052 ✗ | -0.031 ✗ | -0.056 | weak |
| lock.stars | -0.095 ✗ | -0.121 ✗ | -0.111 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 77 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=8 · 4-3 · 57% [25–84] · +8%  | N=6 · 2-4 · 33% [10–70] · -35%  | N=5 · 1-4 · 20% [4–62] · -61%  |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=8 · 3-5 · 38% [14–69] · -23%  | N=22 · 17-5 · 77% [57–90] · +50% ★ | N=9 · 3-6 · 33% [12–65] · -29%  | N=7 · 4-3 · 57% [25–84] · +9%  |
| +2 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=1 · 0-1 · 0% [0–79] · —  | N=5 · 4-1 · 80% [38–96] · +56%  |
| ≥ +3 | — | — | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 20 | 7-12-1 | 36.8% [19–59] | -27.7% | -16.8u | -1.33 ✗ noise |
| HC = +1 | 47 | 27-20-0 | 57.4% [43–70] | +13.4% | +3.3u | 0.90 ✗ noise |
| HC = +2 | 7 | 4-3-0 | 57.1% [25–84] | +11.7% | +3.4u | 0.30 ✗ noise |
| HC ≥ +3 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.5u | 0.00 ✗ n<2 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 9 | 3-6-0 | 33.3% [12–65] | -31.3% | -2.9u | -0.91 ✗ noise |
| Δw = +1 | 31 | 21-9-1 | 70.0% [52–83] | +34.4% | +13.5u | 2.11 ✓ p<.05 |
| Δw = +2 | 16 | 5-11-0 | 31.3% [14–56] | -35.6% | -13.7u | -1.39 ✗ noise |
| Δw ≥ +3 | 20 | 9-11-0 | 45.0% [26–66] | -12.8% | -12.8u | -0.57 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 55 | 31-24-0 | 56.4% [43–69] | +11.1% | +3.3u | 0.81 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 13 | 3-10-0 | 23.1% [8–50] | -55.1% | -18.4u | -2.33 ✓ p<.05 |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 9 | 4-4-1 | 50.0% [22–78] | -4.3% | -2.0u | -0.14 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 169 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δcount = −1 | 9 | 1-8-0 | 11.1% [2–44] | -72.8% | -10.2u | -2.67 ✓ p<.01 |
| Δcount = 0 (balanced) | 17 | 5-12-0 | 29.4% [13–53] | -48.9% | -13.6u | -2.42 ✓ p<.05 |
| Δcount = +1 | 46 | 26-19-1 | 57.8% [43–71] | +13.7% | +5.2u | 0.94 ✗ noise |
| Δcount = +2 | 46 | 19-26-1 | 42.2% [29–57] | -19.8% | -11.7u | -1.40 ✗ noise |
| Δcount ≥ +3 (heavy support) | 50 | 32-18-0 | 64.0% [50–76] | +35.6% | +12.8u | 2.08 ✓ p<.05 |

**ρ(Δcount, WIN) = 0.244** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.287** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -2 · ≤ 1 · ≤ 4 · ≤ 14 · > 14

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 41 | 15-26-0 | 36.6% [24–52] | -27.8% | -17.9u | -1.83 ~ p<.10 |
| Q2 | 34 | 13-20-1 | 39.4% [25–56] | -20.0% | -13.8u | -1.15 ✗ noise |
| Q3 (balanced) | 30 | 13-17-0 | 43.3% [27–61] | -13.9% | -18.1u | -0.75 ✗ noise |
| Q4 | 32 | 19-13-0 | 59.4% [42–74] | +14.6% | +7.3u | 0.79 ✗ noise |
| Q5 (best — heavy support) | 32 | 23-8-1 | 74.2% [57–86] | +52.6% | +24.6u | 2.55 ✓ p<.05 |

**ρ(ΔWlNet, WIN) = 0.275** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.248** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -2.45 · ≤ 0.39 · ≤ 3.19 · ≤ 11.43 · > 11.43

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 34 | 13-21-0 | 38.2% [24–55] | -25.9% | -12.6u | -1.56 ✗ noise |
| Q2 | 34 | 10-23-1 | 30.3% [17–47] | -37.0% | -20.4u | -2.28 ✓ p<.05 |
| Q3 | 34 | 14-20-0 | 41.2% [26–58] | -22.6% | -18.9u | -1.39 ✗ noise |
| Q4 | 34 | 23-11-0 | 67.6% [51–81] | +30.3% | +7.1u | 1.85 ~ p<.10 |
| Q5 | 33 | 23-9-1 | 71.9% [55–84] | +54.2% | +26.8u | 2.49 ✓ p<.05 |

**ρ(ΔFlatPnl, WIN) = 0.309** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.336** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -11.4 · ≤ -0.1 · ≤ 9.9 · ≤ 29.4 · > 29.4

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 34 | 8-25-1 | 24.2% [13–41] | -46.3% | -25.8u | -2.73 ✓ p<.01 |
| Q2 | 34 | 13-21-0 | 38.2% [24–55] | -25.1% | -12.2u | -1.50 ✗ noise |
| Q3 | 34 | 11-23-0 | 32.4% [19–49] | -36.4% | -33.6u | -2.24 ✓ p<.05 |
| Q4 | 34 | 26-7-1 | 78.8% [62–89] | +45.9% | +21.2u | 3.23 ✓ p<.01 |
| Q5 | 33 | 25-8-0 | 75.8% [59–87] | +61.1% | +32.3u | 3.02 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.414** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.403** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 17 | 2-15-0 | 11.8% [3–34] | -75.6% | -16.3u | -4.54 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 12 | 3-9-0 | 25.0% [9–53] | -50.5% | -9.2u | -1.91 ~ p<.10 |
| ΔBestRank = 0 (tied) | 1 | 1-0-0 | 100.0% [21–100] | +90.9% | +0.3u | 0.00 ✗ n<2 |
| ΔBestRank ∈ [+1,+4] | 8 | 2-6-0 | 25.0% [7–59] | -54.0% | -8.8u | -1.79 ~ p<.10 |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 25 | 15-9-1 | 62.5% [43–79] | +29.3% | +5.7u | 1.27 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.447** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.422** ✓ p<.01  (N=63)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 12 | 3-9-0 | 25.0% [9–53] | -33.4% | -2.6u | -0.89 ✗ noise |
| Δshare ∈ [−30,−10] pp | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.0u | 0.00 ✗ n<2 |
| Δshare ≈ 0 (±10 pp) | 107 | 45-60-2 | 42.9% [34–52] | -18.2% | -44.9u | -1.97 ✓ p<.05 |
| Δshare ∈ [+10,+30] pp | 12 | 6-6-0 | 50.0% [25–75] | +0.5% | +0.5u | 0.02 ✗ noise |
| Δshare ≥ +30 pp | 37 | 29-8-0 | 78.4% [63–89] | +63.6% | +32.0u | 3.50 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.252** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.218** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.414 ✓ p<.01 | 0.403 ✓ p<.01 | 0.405 |
| 2 | **ΔTopQCount** | 0.344 ✓ p<.01 | 0.374 ✓ p<.01 | 0.323 |
| 3 | **ΔFlatPnl** | 0.309 ✓ p<.01 | 0.336 ✓ p<.01 | 0.304 |
| 4 | **Δcount** | 0.244 ✓ p<.01 | 0.287 ✓ p<.01 | 0.208 |
| 5 | **ΔWlNet** | 0.275 ✓ p<.01 | 0.248 ✓ p<.01 | 0.241 |
| 6 | **ΔTopQShare** | 0.252 ✓ p<.01 | 0.218 ✓ p<.01 | 0.281 |

_(ΔBestRank uses N=63 subset where both sides had a proven wallet — ρ(flat ROI) = 0.422 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 359, dateRange = 2026-04-18 → 2026-05-15, computedAt = 2026-05-16T14:09:20.257Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **169** rows · PIT aggregate computable on **163** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **163** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 2 · 100% · +285.1% | 8 · 63% · +13.6% | -271.6pp |
| NEUTRAL (0..+3) | 91 · 58% · +11.0% | 95 · 52% · +0.7% | -10.3pp |
| WEAK (−3..0) | 42 · 39% · -23.2% | 36 · 40% · -20.1% | +3.1pp |
| FADE (<−3) | 19 · 21% · -57.9% | 15 · 40% · +3.0% | +60.9pp |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=54, WR=62%, ROI=+23.0% | N=84, WR=58%, ROI=+12.6% | -10.3pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=93, WR=59%, ROI=+16.9% | N=103, WR=53%, ROI=+1.7% | -15.2pp |
| AGS < −1 (mute veto) | N=24, WR=21%, ROI=-61.3% | N=19, WR=37%, ROI=-3.0% | +58.3pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-02 → 2026-05-15, N=67)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 5 · 80% · +42.6% |
| NEUTRAL (0..+3) | 47 · 51% · +0.7% |
| WEAK (−3..0) | 12 · 42% · -20.5% |
| FADE (<−3) | 3 · 33% · -36.4% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=46, WR=59%, ROI=+13.1% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=52, WR=54%, ROI=+4.8% |
| AGS < −1 (mute veto) | N=5, WR=20%, ROI=-61.8% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.48 | 1.60 |
| `dHcCount` | COUNT_HC | + | 0.47 | 0.83 |
| `dConvictionAvg` | INTENSITY | + | 0.54 | 0.56 |
| `dHcSizeRatio` | INTENSITY_HC | + | 1.58 | 5.43 |
| `forContribShare` | DOMINANCE | + | 0.81 | 0.25 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **163/189** shipped+graded rows (86%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -9.47 |
| 20th pct | -1.53 |
| 40th pct | 0.76 |
| Median | 1.08 |
| 60th pct | 1.28 |
| 80th pct | 1.85 |
| 90th pct | 2.59 |
| Max | 4.67 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 5 | 3.1% |
| **LOCK** | +5..+7 | 71 | 43.6% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 36 | 22.1% |
| **FADE** | < −3 | 19 | 11.7% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 5 | 4-1-0 | 80.0% [38–96] | +42.6% | +6.6u | 1.12 ✗ noise |
| LOCK | 71 | 39-32-0 | 54.9% [43–66] | +6.1% | -1.1u | 0.52 ✗ noise |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 36 | 12-23-1 | 34.3% [21–51] | -35.2% | -18.2u | -2.34 ✓ p<.05 |
| FADE | 19 | 7-12-0 | 36.8% [19–59] | -3.0% | -10.9u | -0.08 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.137** ~ p<.10 · r(ROI) = **0.065** ✗ · Spearman ρ(ROI) = **0.093**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 19 | 8-11-0 | 42.1% [23–64] | +6.6% | -9.0u | 0.19 ✗ noise |
| z ∈ [−1, 0) | 58 | 26-30-2 | 46.4% [34–59] | -11.0% | -11.1u | -0.88 ✗ noise |
| z ∈ [0, +1) | 58 | 24-34-0 | 41.4% [30–54] | -20.9% | -23.7u | -1.65 ~ p<.10 |
| z ≥ +1 (very positive) | 28 | 17-11-0 | 60.7% [42–76] | +18.1% | +14.6u | 0.96 ✗ noise |

#### `dHcCount` (COUNT_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 129 | 60-67-2 | 47.2% [39–56] | -8.6% | -26.1u | -0.99 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dConvictionAvg` (INTENSITY)

r(WIN) = **0.162** ✓ p<.05 · r(ROI) = **0.058** ✗ · Spearman ρ(ROI) = **0.124**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 20 | 5-15-0 | 25.0% [11–47] | -28.8% | -15.2u | -0.87 ✗ noise |
| z ∈ [−1, 0) | 36 | 18-17-1 | 51.4% [36–67] | -1.8% | -6.1u | -0.11 ✗ noise |
| z ∈ [0, +1) | 86 | 40-45-1 | 47.1% [37–58] | -7.7% | -8.9u | -0.72 ✗ noise |
| z ≥ +1 (very positive) | 21 | 12-9-0 | 57.1% [37–76] | +3.9% | +1.2u | 0.19 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 129 | 60-67-2 | 47.2% [39–56] | -8.6% | -26.1u | -0.99 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `forContribShare` (DOMINANCE)

r(WIN) = **0.112** ✗ · r(ROI) = **0.010** ✗ · Spearman ρ(ROI) = **0.091**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 14 | 5-9-0 | 35.7% [16–61] | -2.1% | -7.5u | -0.05 ✗ noise |
| z ∈ [−1, 0) | 41 | 15-25-1 | 37.5% [24–53] | -26.3% | -23.0u | -1.72 ~ p<.10 |
| z ∈ [0, +1) | 108 | 55-52-1 | 51.4% [42–61] | -1.0% | +1.4u | -0.11 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | 0.162 ✓ p<.05 | 0.058 ✗ | 0.124 |
| 2 | `dCount` | COUNT | 0.137 ~ p<.10 | 0.065 ✗ | 0.093 |
| 3 | `forContribShare` | DOMINANCE | 0.112 ✗ | 0.010 ✗ | 0.091 |
| 4 | `dHcCount` | COUNT_HC | NaN — | NaN — | NaN |
| 5 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | +0.219 | 0.803 | 32.1% | dominant |
| 2 | `dConvictionAvg` | +0.111 | 0.780 | 31.2% | meaningful |
| 3 | `forContribShare` | +0.104 | 0.741 | 29.6% | meaningful |
| 4 | `dHcCount` | -0.117 | 0.117 | 4.7% | silent (<0.2) |
| 5 | `dHcSizeRatio` | -0.061 | 0.061 | 2.4% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcCount` | `dConvictionAvg` | `dHcSizeRatio` | `forContribShare` |
|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.331 | +0.285 | +0.331 | +0.515 |
| `dHcCount` | +0.331 | 1.000 | +0.161 | +1.000 ⚠ | +0.239 |
| `dConvictionAvg` | +0.285 | +0.161 | 1.000 | +0.161 | +0.883 ⚠ |
| `dHcSizeRatio` | +0.331 | +1.000 ⚠ | +0.161 | 1.000 | +0.239 |
| `forContribShare` | +0.515 | +0.239 | +0.883 ⚠ | +0.239 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.174**. At AGS ≥ +1 fires N=89, WR=56.2%, ROI=+8.4%. At AGS ≥ +null fires N=110, WR=50.5%, ROI=-3.1%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-89 ROI (matched cohort) | Top-89 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.130 | −0.044 | WR=51%, ROI=-2.0% | +10.3pp | N=73, WR=53%, ROI=+2.6% |
| `dHcCount` | +0.167 | −0.008 | WR=55%, ROI=+5.4% | +2.9pp | N=93, WR=54%, ROI=+3.7% |
| `dConvictionAvg` | +0.128 | −0.046 | WR=50%, ROI=-4.2% | +12.6pp | N=58, WR=52%, ROI=+0.7% |
| `dHcSizeRatio` | +0.177 | +0.003 | WR=55%, ROI=+5.4% | +2.9pp | N=91, WR=55%, ROI=+6.0% |
| `forContribShare` | +0.183 | +0.009 | WR=58%, ROI=+11.8% | -3.5pp | N=53, WR=57%, ROI=+8.8% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dConvictionAvg` | −0.046 | +12.6pp | carries marginal info |
| 2 | `dCount` | −0.044 | +10.3pp | carries marginal info |
| 3 | `dHcCount` | −0.008 | +2.9pp | mild marginal info |
| 4 | `dHcSizeRatio` | +0.003 | +2.9pp | redundant — other features cover it |
| 5 | `forContribShare` | +0.009 | -3.5pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | +0.319 | 0.319 | positive ↑ |
| 2 | `dCount` | COUNT | +0.183 | 0.183 | positive ↑ |
| 3 | `forContribShare` | DOMINANCE | -0.142 | 0.142 | negative ↓ |
| 4 | `dHcCount` | COUNT_HC | -0.032 | 0.032 | flat ≈ 0 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | -0.017 | 0.017 | flat ≈ 0 |

Intercept b = -0.230 · Final log-loss = 0.6719 · N = 163.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | #1 | #2 | #1 | #1 | 1.25 |
| 2 | `dCount` | COUNT | #2 | #1 | #2 | #2 | 1.75 |
| 3 | `forContribShare` | DOMINANCE | #3 | #3 | #5 | #3 | 3.50 |
| 4 | `dHcCount` | COUNT_HC | #4 | #4 | #3 | #4 | 3.75 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | #5 | #5 | #4 | #5 | 4.75 |

#### Plain-English summary

- **Workhorse**: `dConvictionAvg` (INTENSITY) — ranks #1/#2/#1/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dHcSizeRatio` (INTENSITY_HC) — composite avg rank 4.75. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dHcCount` ↔ `dHcSizeRatio` (r=+1.00); `dConvictionAvg` ↔ `forContribShare` (r=+0.88). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dHcCount`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **v9 simplification candidate**: only `dCount`, `dConvictionAvg` carry marginal info (Spearman ρ drop > 0.01 when removed). The other 4 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=163 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 163 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/163 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 53 | 25-28-0 | 47.2% [34–60] | -15.4% | -21.1u | -1.20 ✗ noise |
| 4.5★ | 18 | 10-8-0 | 55.6% [34–75] | +15.4% | +4.0u | 0.56 ✗ noise |
| 4.0★ | 31 | 14-16-1 | 46.7% [30–64] | -5.5% | -4.6u | -0.30 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 18 | 6-11-1 | 35.3% [17–59] | -26.0% | -5.8u | -1.11 ✗ noise |
| 2.5★ | 31 | 15-16-0 | 48.4% [32–65] | -5.6% | -4.0u | -0.31 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 2/50%/-6% | 6/0%/-100% | 6/33%/-26% | 10/33%/-33% | 12/25%/-51% |
| Δw = +1 | 3/100%/+71% | 5/40%/-24% | 13/67%/+32% | 28/54%/+4% | 2/0%/-100% | 12/58%/+7% |
| Δw = +2 | 19/37%/-26% | 4/50%/-3% | 11/45%/-7% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 26/46%/-19% | 4/75%/+90% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | 1/100%/+145% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 6 | 3-3-0 | 50.0% [19–81] | -30.7% | +0.3u | -0.99 ✗ noise |
| −200/−151 | 13 | 4-9-0 | 30.8% [13–58] | -50.5% | -13.8u | -2.35 ✓ p<.05 |
| −150/−101 | 111 | 55-55-1 | 50.0% [41–59] | -4.7% | +0.2u | -0.52 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 40 | 18-21-1 | 46.2% [32–61] | +2.0% | -18.2u | 0.11 ✗ noise |
| +151/+200 | 3 | 2-1-0 | 66.7% [21–94] | +86.0% | +2.1u | 0.92 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -67% (4) | — | +47% (1) | +34% (1) |
| −200/−151 | -100% (5) | +20% (4) | -100% (1) | -100% (2) |
| −150/−101 | -35% (22) | +18% (42) | -39% (25) | +21% (19) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +8% (6) | -15% (14) | +17% (11) | +6% (9) |
| +151/+200 | — | +160% (1) | +198% (1) | — |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 101 | 46-55-0 | 45.5% [36–55] | -7.4% | -32.3u | -0.66 ✗ noise |
| SPREAD | 32 | 13-18-1 | 41.9% [26–59] | -18.1% | +0.6u | -1.07 ✗ noise |
| TOTAL | 56 | 30-25-1 | 54.5% [42–67] | +5.5% | +4.1u | 0.42 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=19 · 21% · -60% | N=33 · 55% · +4% | N=21 · 38% · -19% | N=25 · 56% · +27% |
| SPREAD | N=10 · 22% · -51% | N=9 · 33% · -35% | N=7 · 57% · +10% | N=5 · 60% · +17% |
| TOTAL | N=11 · 45% · -12% | N=22 · 71% · +36% | N=13 · 31% · -40% | N=8 · 63% · +22% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 70 | 29-41-0 | 41.4% [31–53] | -20.1% | -26.1u | -1.74 ~ p<.10 |
| NBA | 94 | 47-46-1 | 50.5% [41–60] | +2.2% | +3.3u | 0.19 ✗ noise |
| NHL | 25 | 13-11-1 | 54.2% [35–72] | +7.1% | -4.9u | 0.35 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=10 · 20% · -56% | N=29 · 55% · +5% | N=19 · 26% · -49% | N=11 · 45% · -11% |
| NBA | N=25 · 25% · -52% | N=24 · 58% · +14% | N=15 · 53% · +10% | N=25 · 64% · +40% |
| NHL | N=5 · 60% · +17% | N=11 · 60% · +10% | N=7 · 43% · -9% | N=2 · 50% · +22% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 112 · 43% · -12.0% · -1.14 ✗ noise | 76 · 54% · +2.4% · 0.22 ✗ noise |
| **plusEV** | 24 · 38% · -17.9% · -0.64 ✗ noise | 164 · 49% · -4.5% · -0.57 ✗ noise |
| **pinnacleConfirms** | 52 · 44% · -8.9% · -0.54 ✗ noise | 65 · 46% · -9.0% · -0.69 ✗ noise |
| **invested10kPlus** | 99 · 43% · -11.3% · -1.00 ✗ noise | 18 · 56% · +4.3% · 0.18 ✗ noise |
| **lineMovingWith** | 104 · 49% · -3.4% · -0.32 ✗ noise | 84 · 46% · -9.6% · -0.85 ✗ noise |
| **predMarketAligns** | 42 · 48% · -5.5% · -0.30 ✗ noise | 75 · 44% · -10.9% · -0.88 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 31 | 19-12-0 | 61.3% [44–76] | +18.8% | +4.0u | 1.07 ✗ noise |
| 1 | 40 | 18-21-1 | 46.2% [32–61] | -12.7% | -6.9u | -0.85 ✗ noise |
| 2 | 51 | 24-26-1 | 48.0% [35–61] | -0.7% | +5.8u | -0.04 ✗ noise |
| 3 | 23 | 10-13-0 | 43.5% [26–63] | -16.2% | -10.7u | -0.76 ✗ noise |
| 4 | 21 | 6-15-0 | 28.6% [14–50] | -41.5% | -19.0u | -1.99 ✓ p<.05 |
| 5 | 17 | 10-7-0 | 58.8% [36–78] | -1.8% | -1.0u | -0.08 ✗ noise |
| 6 | 6 | 2-4-0 | 33.3% [10–70] | +35.8% | +0.1u | 0.37 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 44 | 27-16-1 | 62.8% [48–76] | +15.0% | +19.8u | 1.08 ✗ noise |
| NEAR_START | 87 | 36-50-1 | 41.9% [32–52] | -11.3% | -29.5u | -0.92 ✗ noise |
| NO_MOVE | 6 | 2-4-0 | 33.3% [10–70] | -36.2% | -1.1u | -0.90 ✗ noise |
| PREGAME | 20 | 11-9-0 | 55.0% [34–74] | +3.0% | +0.4u | 0.14 ✗ noise |
| SMALL_MOVE | 30 | 11-19-0 | 36.7% [22–54] | -25.8% | -19.7u | -1.37 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 106 | 49-56-1 | 46.7% [37–56] | -12.6% | -24.0u | -1.37 ✗ noise |
| STRONG | 42 | 22-20-0 | 52.4% [38–67] | +3.2% | -0.4u | 0.20 ✗ noise |
| LEAN | 37 | 16-20-1 | 44.4% [30–60] | +3.8% | -4.6u | 0.17 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.091 ✗ | -0.027 ✗ | -0.069 | -0.37 |
| totalInvested | -0.103 ✗ | -0.083 ✗ | -0.021 | -1.14 |
| evEdge | 0.053 ✗ | 0.061 ✗ | 0.062 | 0.83 |
| moneyPct | -0.017 ✗ | -0.089 ✗ | -0.057 | -1.22 |
| walletPct | 0.063 ✗ | 0.023 ✗ | 0.028 | 0.31 |
| criteriaMet | -0.089 ✗ | -0.055 ✗ | -0.113 | -0.75 |
| maxContribFor | 0.062 ✗ | 0.075 ✗ | 0.114 | 1.03 |
| meanBaseFor | 0.010 ✗ | 0.025 ✗ | 0.057 | 0.35 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **181** picks. Mean CLV = **-0.0033**.
t-statistic vs zero: -2.68 → ✓ p<.01 · 95% CI [-0.0057, -0.0009]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 16 | 9-7-0 | 56.3% [33–77] | -2.4% | +4.0u | -0.11 ✗ noise |
| CLV (−2%, 0] | 98 | 43-53-2 | 44.8% [35–55] | -11.2% | -28.7u | -1.09 ✗ noise |
| CLV (0, +2%] | 55 | 28-27-0 | 50.9% [38–64] | +9.5% | +2.1u | 0.58 ✗ noise |
| CLV > +2% | 12 | 4-8-0 | 33.3% [14–61] | -42.9% | -11.3u | -1.69 ~ p<.10 |

ρ(CLV, flat ROI) = -0.062 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=78 (with all features non-null). Intercept β₀ = -0.021.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.Δcount | +0.697 | ↑ helps |
| 2 | pw.ΔAvgRoi | +0.549 | ↑ helps |
| 3 | sharpCount | -0.496 | ↓ hurts |
| 4 | peak.stars | -0.360 | ↓ hurts |
| 5 | evEdge | +0.353 | ↑ helps |
| 6 | pw.ΔFlatPnl | +0.335 | ↑ helps |
| 7 | odds (American) | -0.302 | ↓ hurts |
| 8 | moneyPct | -0.299 | ↓ hurts |
| 9 | Δw | -0.204 | ↓ hurts |
| 10 | log(impliedProb) | +0.158 | ↑ helps |
| 11 | HC margin | +0.148 | ↑ helps |
| 12 | pw.ΔWlNet | +0.131 | ↑ helps |
| 13 | Δw + HC | -0.109 | ↓ hurts |
| 14 | criteriaMet | -0.090 | ↓ hurts |
| 15 | pw.ΔTopQShare | +0.061 | ↑ helps |
| 16 | walletPct | -0.034 | ≈ flat |
| 17 | vault.star | +0.033 | ≈ flat |
| 18 | log10(invested) | -0.011 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 8 | 4-4 | 50.0% | 50.0% | -105 | — (mute) | 3.44u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 47 | 27-20 | 57.4% | 56.1% | -108 | 4.39% bankroll | 1.66u | **UNDER-SIZED** — ship up to 4.39u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 13 | 3-10 | 23.1% | 34.8% | -105 | — (mute) | 2.08u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 38 | 22-16 | 57.9% | 56.3% | -105 | 5.16% bankroll | 2.67u | **UNDER-SIZED** — ship up to 5.16u (1u=1% bankroll) |
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

**Peak cum PnL:** +7.1u
**Max drawdown:** -34.7u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.209  (annualized × √252 ≈ -3.32)

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

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._