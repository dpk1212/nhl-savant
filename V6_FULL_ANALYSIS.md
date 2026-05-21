# Sharp Intel v6 — Full Analysis

_Auto-generated **5/21/2026, 9:31:28 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 230 shipped+graded picks · 2026-04-18 → 2026-05-20  (HC analyses scoped to post-cutover 2026-04-30, 118 picks)
**Headline:** 111-117-2 · WR 48.7% [42.3%–55.1%] vs 52.4% break-even · -9.3u flat (-4.0%) · -38.1u peak.
**Overall t-test:** t = -0.59 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.165 ✓ p<.05**  (full sample, N=224)
- **ρ(HC, flat ROI) = 0.011 ✗**  (post-cutover, N=118)
- **ρ(Δw+HC, flat ROI) = 0.024 ✗**  (post-cutover, N=118)

Cohort breakdown:

**Winning cohorts (t ≥ 1.645 with positive mean):**
- **Δw ≥ +3 (full sample)** — N=49, 30-19, WR 61.2% [47%–74%], flat ROI +29.4% (t=1.67 ~ p<.10)

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0 (full sample)** — N=45, 14-30, WR 31.8% [20%–47%], flat ROI -38.7% (t=-2.89 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=17, WR 41.2%, flat ROI -24.7%. Bayesian posterior WR ≈ 44.4%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=68, WR 57.4%, flat ROI +13.7%. Bayesian posterior WR ≈ 56.4%, half-Kelly = **4.2%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=22, WR 36.4%, flat ROI -31.2%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=49, WR 61.2%, flat ROI +29.4%. Bayesian posterior WR ≈ 59.3%, half-Kelly = **7.3%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -38.7% flat ROI on 45 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.04u/pick), we need **~1670 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 230. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-20 |
| Sides scanned | 525 |
| Shipped + graded | **230** |
| W-L-P | 111-117-2 |
| Win rate | **48.7%** [42.3%–55.1%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +3.7 pp |
| Peak-units PnL | **-38.1u** |
| Flat-1u PnL | **-9.3u** (-4.0% flat ROI) |
| Flat t-statistic vs zero | -0.59 → ✗ noise |
| Flat 95% CI per-pick | [-0.175, 0.094]u |

### Power note

At our observed flat-PnL standard deviation (1.04u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4637 |
| +5% | 1670 |
| +10% | 418 |

We have **230** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 37 | 13-23-1 | 36.1% [22–52] | -31.0% | -15.3u | -2.05 ✓ p<.05 |
| Δw = +1 | 72 | 40-31-1 | 56.3% [45–67] | +7.3% | +4.6u | 0.65 ✗ noise |
| Δw = +2 | 58 | 23-35-0 | 39.7% [28–53] | -21.3% | -28.0u | -1.63 ✗ noise |
| Δw ≥ +3 | 49 | 30-19-0 | 61.2% [47–74] | +29.4% | +2.7u | 1.67 ~ p<.10 |

**Pearson ρ(Δw, WIN) = 0.156** ✓ p<.05  ·  **ρ(Δw, flat ROI) = 0.165** ✓ p<.05  (N=224)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 31 | 14-16-1 | 46.7% [30–64] | -11.6% | -15.1u | -0.68 ✗ noise |
| HC = +1 | 68 | 39-29-0 | 57.4% [46–68] | +13.7% | +2.9u | 1.11 ✗ noise |
| HC = +2 | 12 | 5-7-0 | 41.7% [19–68] | -16.9% | -8.6u | -0.57 ✗ noise |
| HC ≥ +3 | 5 | 2-3-0 | 40.0% [12–77] | -43.4% | -3.3u | -1.25 ✗ noise |

**Pearson ρ(HC, WIN) = 0.041** ✗  ·  **ρ(HC, flat ROI) = 0.011** ✗  (N=118)

Spearman rank ρ(HC, flat ROI) = 0.057.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.6u | 0.00 ✗ noise |
| Σ = +1 | 22 | 11-10-1 | 52.4% [32–72] | +2.1% | +1.7u | 0.10 ✗ noise |
| Σ = +2 | 45 | 26-19-0 | 57.8% [43–71] | +10.9% | +1.0u | 0.75 ✗ noise |
| Σ = +3 | 17 | 6-11-0 | 35.3% [17–59] | -31.7% | -10.9u | -1.30 ✗ noise |
| Σ = +4 | 14 | 8-6-0 | 57.1% [33–79] | +12.7% | -9.2u | 0.45 ✗ noise |
| Σ = +5 | 10 | 4-6-0 | 40.0% [17–69] | -19.8% | -7.2u | -0.60 ✗ noise |
| Σ ≥ +6 | 8 | 5-3-0 | 62.5% [31–86] | +21.8% | +0.7u | 0.59 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = 0.044** ✗  ·  **ρ(Σ, flat ROI) = 0.024** ✗  (N=118)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 118.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.034 ✗ | 0.025 ✗ | 0.005 | weak |
| HC margin | 0.041 ✗ | 0.011 ✗ | 0.057 | weak |
| Δw + HC | 0.044 ✗ | 0.024 ✗ | 0.026 | weak |
| peak.stars | -0.140 ✗ | -0.165 ~ p<.10 | -0.167 | weak |
| vault.star | -0.131 ✗ | -0.122 ✗ | -0.145 | weak |
| lock.stars | -0.074 ✗ | -0.112 ✗ | -0.115 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 118 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=10 · 6-3 · 67% [35–88] · +23%  | N=15 · 7-8 · 47% [25–70] · -12%  | N=5 · 1-4 · 20% [4–62] · -61%  |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=12 · 5-7 · 42% [19–68] · -15%  | N=28 · 19-9 · 68% [49–82] · +31%  | N=13 · 5-8 · 38% [18–64] · -21%  | N=14 · 10-4 · 71% [45–88] · +44%  |
| +2 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=3 · 0-3 · 0% [0–56] · -100%  | N=8 · 5-3 · 63% [31–86] · +25%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | — | N=2 · 0-2 · 0% [0–66] · —  | N=2 · 1-1 · 50% [9–91] · —  |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 31 | 14-16-1 | 46.7% [30–64] | -11.6% | -15.1u | -0.68 ✗ noise |
| HC = +1 | 68 | 39-29-0 | 57.4% [46–68] | +13.7% | +2.9u | 1.11 ✗ noise |
| HC = +2 | 12 | 5-7-0 | 41.7% [19–68] | -16.9% | -8.6u | -0.57 ✗ noise |
| HC ≥ +3 | 5 | 2-3-0 | 40.0% [12–77] | -43.4% | -3.3u | -1.25 ✗ noise |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 14 | 6-8-0 | 42.9% [21–67] | -17.3% | -1.9u | -0.64 ✗ noise |
| Δw = +1 | 39 | 25-13-1 | 65.8% [50–79] | +25.6% | +9.2u | 1.73 ~ p<.10 |
| Δw = +2 | 33 | 12-21-0 | 36.4% [22–53] | -29.1% | -24.3u | -1.70 ~ p<.10 |
| Δw ≥ +3 | 31 | 17-14-0 | 54.8% [38–71] | +8.2% | -9.4u | 0.45 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 85 | 46-39-0 | 54.1% [44–64] | +6.0% | -8.9u | 0.55 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 22 | 8-14-0 | 36.4% [20–57] | -31.2% | -19.0u | -1.56 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 11 | 6-4-1 | 60.0% [31–83] | +11.5% | +0.5u | 0.41 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 210 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δcount = −1 | 9 | 1-8-0 | 11.1% [2–44] | -72.8% | -10.2u | -2.67 ✓ p<.01 |
| Δcount = 0 (balanced) | 22 | 8-14-0 | 36.4% [20–57] | -34.4% | -14.1u | -1.79 ~ p<.10 |
| Δcount = +1 | 50 | 29-20-1 | 59.2% [45–72] | +15.4% | +8.4u | 1.12 ✗ noise |
| Δcount = +2 | 64 | 27-36-1 | 42.9% [31–55] | -17.7% | -20.4u | -1.46 ✗ noise |
| Δcount ≥ +3 (heavy support) | 64 | 40-24-0 | 62.5% [50–73] | +29.4% | +8.3u | 2.03 ✓ p<.05 |

**ρ(Δcount, WIN) = 0.203** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.244** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -2 · ≤ 0 · ≤ 4 · ≤ 14 · > 14

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 49 | 20-29-0 | 40.8% [28–55] | -18.4% | -19.8u | -1.27 ✗ noise |
| Q2 | 41 | 17-23-1 | 42.5% [29–58] | -13.4% | -8.5u | -0.84 ✗ noise |
| Q3 (balanced) | 44 | 20-24-0 | 45.5% [32–60] | -12.9% | -31.9u | -0.87 ✗ noise |
| Q4 | 36 | 22-14-0 | 61.1% [45–75] | +17.0% | +12.8u | 0.99 ✗ noise |
| Q5 (best — heavy support) | 40 | 26-13-1 | 66.7% [51–79] | +35.2% | +19.0u | 1.92 ~ p<.10 |

**ρ(ΔWlNet, WIN) = 0.160** ✓ p<.05  ·  **ρ(ΔWlNet, flat ROI) = 0.137** ✓ p<.05

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -2.19 · ≤ 0.05 · ≤ 2.76 · ≤ 11.43 · > 11.43

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 43 | 18-25-0 | 41.9% [28–57] | -16.4% | -15.8u | -1.06 ✗ noise |
| Q2 | 42 | 15-26-1 | 36.6% [24–52] | -26.8% | -20.5u | -1.81 ~ p<.10 |
| Q3 | 43 | 20-23-0 | 46.5% [33–61] | -14.4% | -17.5u | -1.00 ✗ noise |
| Q4 | 41 | 26-15-0 | 63.4% [48–76] | +22.9% | +4.1u | 1.50 ✗ noise |
| Q5 | 41 | 26-14-1 | 65.0% [50–78] | +37.0% | +21.1u | 1.92 ~ p<.10 |

**ρ(ΔFlatPnl, WIN) = 0.201** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.226** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -8.6 · ≤ 0.1 · ≤ 9.8 · ≤ 28.9 · > 28.9

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 45 | 13-31-1 | 29.5% [18–44] | -35.8% | -29.3u | -2.33 ✓ p<.05 |
| Q2 | 40 | 18-22-0 | 45.0% [31–60] | -14.4% | -13.1u | -0.95 ✗ noise |
| Q3 | 42 | 13-29-0 | 31.0% [19–46] | -39.3% | -40.9u | -2.74 ✓ p<.01 |
| Q4 | 42 | 31-10-1 | 75.6% [61–86] | +39.0% | +25.6u | 2.97 ✓ p<.01 |
| Q5 | 41 | 30-11-0 | 73.2% [58–84] | +53.9% | +29.3u | 3.04 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.364** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.357** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 19 | 4-15-0 | 21.1% [9–43] | -55.2% | -14.6u | -2.66 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 15 | 5-10-0 | 33.3% [15–58] | -34.1% | -9.8u | -1.35 ✗ noise |
| ΔBestRank = 0 (tied) | 2 | 2-0-0 | 100.0% [34–100] | +90.9% | +0.5u | 0.00 ✗ noise |
| ΔBestRank ∈ [+1,+4] | 12 | 3-9-0 | 25.0% [9–53] | -51.8% | -14.0u | -2.05 ✓ p<.05 |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 35 | 19-15-1 | 55.9% [39–71] | +13.7% | -0.4u | 0.72 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.319** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.296** ✓ p<.01  (N=83)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 13 | 3-10-0 | 23.1% [8–50] | -38.5% | -5.1u | -1.11 ✗ noise |
| Δshare ∈ [−30,−10] pp | 3 | 1-2-0 | 33.3% [6–79] | -11.7% | -4.5u | -0.13 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 130 | 58-70-2 | 45.3% [37–54] | -14.5% | -45.7u | -1.74 ~ p<.10 |
| Δshare ∈ [+10,+30] pp | 17 | 10-7-0 | 58.8% [36–78] | +17.7% | +3.5u | 0.71 ✗ noise |
| Δshare ≥ +30 pp | 47 | 33-14-0 | 70.2% [56–81] | +45.2% | +23.4u | 2.73 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.224** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.198** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.364 ✓ p<.01 | 0.357 ✓ p<.01 | 0.335 |
| 2 | **ΔTopQCount** | 0.256 ✓ p<.01 | 0.284 ✓ p<.01 | 0.251 |
| 3 | **Δcount** | 0.203 ✓ p<.01 | 0.244 ✓ p<.01 | 0.163 |
| 4 | **ΔFlatPnl** | 0.201 ✓ p<.01 | 0.226 ✓ p<.01 | 0.196 |
| 5 | **ΔTopQShare** | 0.224 ✓ p<.01 | 0.198 ✓ p<.01 | 0.242 |
| 6 | **ΔWlNet** | 0.160 ✓ p<.05 | 0.137 ✓ p<.05 | 0.141 |

_(ΔBestRank uses N=83 subset where both sides had a proven wallet — ρ(flat ROI) = 0.296 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 429, dateRange = 2026-04-18 → 2026-05-19, computedAt = 2026-05-20T16:18:15.943Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **210** rows · PIT aggregate computable on **204** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **204** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 2 · 100% · +285.1% | 9 · 67% · +22.5% | -262.6pp |
| NEUTRAL (0..+3) | 114 · 58% · +9.7% | 117 · 53% · +2.8% | -6.9pp |
| WEAK (−3..0) | 59 · 41% · -18.6% | 53 · 40% · -20.3% | -1.8pp |
| FADE (<−3) | 20 · 25% · -49.4% | 16 · 44% · +8.5% | +58.0pp |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=72, WR=61%, ROI=+18.0% | N=101, WR=57%, ROI=+9.9% | -8.1pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=116, WR=58%, ROI=+14.5% | N=126, WR=54%, ROI=+4.2% | -10.2pp |
| AGS < −1 (mute veto) | N=27, WR=26%, ROI=-52.4% | N=25, WR=48%, ROI=+13.8% | +66.3pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-07 → 2026-05-20, N=89)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 3 · 100% · +72.4% |
| NEUTRAL (0..+3) | 56 · 52% · -0.3% |
| WEAK (−3..0) | 27 · 44% · -12.3% |
| FADE (<−3) | 3 · 67% · +27.3% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=49, WR=55%, ROI=+3.6% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=59, WR=54%, ROI=+3.4% |
| AGS < −1 (mute veto) | N=10, WR=60%, ROI=+19.3% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.43 | 1.57 |
| `dHcCount` | COUNT_HC | + | 0.45 | 0.83 |
| `dConvictionAvg` | INTENSITY | + | 0.54 | 0.55 |
| `dHcSizeRatio` | INTENSITY_HC | + | 1.52 | 5.19 |
| `forContribShare` | DOMINANCE | + | 0.81 | 0.25 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **204/230** shipped+graded rows (89%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -9.56 |
| 20th pct | -1.62 |
| 40th pct | 0.68 |
| Median | 1.05 |
| 60th pct | 1.25 |
| 80th pct | 1.93 |
| 90th pct | 2.43 |
| Max | 4.67 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 5 | 2.5% |
| **LOCK** | +5..+7 | 99 | 48.5% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 41 | 20.1% |
| **FADE** | < −3 | 24 | 11.8% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 5 | 4-1-0 | 80.0% [38–96] | +42.6% | +6.6u | 1.12 ✗ noise |
| LOCK | 99 | 50-49-0 | 50.5% [41–60] | -3.5% | -23.1u | -0.35 ✗ noise |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 41 | 14-26-1 | 35.0% [22–50] | -33.3% | -21.8u | -2.34 ✓ p<.05 |
| FADE | 24 | 12-12-0 | 50.0% [31–69] | +18.6% | -5.6u | 0.63 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.076** ✗ · r(ROI) = **0.015** ✗ · Spearman ρ(ROI) = **0.021**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 24 | 12-12-0 | 50.0% [31–69] | +16.5% | -7.1u | 0.57 ✗ noise |
| z ∈ [−1, 0) | 69 | 34-33-2 | 50.7% [39–62] | -2.1% | -0.7u | -0.18 ✗ noise |
| z ∈ [0, +1) | 71 | 27-44-0 | 38.0% [28–50] | -26.9% | -42.4u | -2.38 ✓ p<.05 |
| z ≥ +1 (very positive) | 40 | 24-16-0 | 60.0% [45–74] | +13.4% | +10.6u | 0.87 ✗ noise |

#### `dHcCount` (COUNT_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 170 | 82-86-2 | 48.8% [41–56] | -6.0% | -36.5u | -0.79 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dConvictionAvg` (INTENSITY)

r(WIN) = **0.146** ✓ p<.05 · r(ROI) = **0.053** ✗ · Spearman ρ(ROI) = **0.098**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 24 | 6-18-0 | 25.0% [12–45] | -31.3% | -21.4u | -1.10 ✗ noise |
| z ∈ [−1, 0) | 54 | 28-25-1 | 52.8% [40–66] | +1.5% | -10.1u | 0.11 ✗ noise |
| z ∈ [0, +1) | 102 | 51-50-1 | 50.5% [41–60] | -2.3% | +0.7u | -0.23 ✗ noise |
| z ≥ +1 (very positive) | 24 | 12-12-0 | 50.0% [31–69] | -9.1% | -8.8u | -0.47 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 170 | 82-86-2 | 48.8% [41–56] | -6.0% | -36.5u | -0.79 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `forContribShare` (DOMINANCE)

r(WIN) = **0.093** ✗ · r(ROI) = **0.001** ✗ · Spearman ρ(ROI) = **0.064**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 18 | 9-9-0 | 50.0% [29–71] | +20.1% | -2.8u | 0.56 ✗ noise |
| z ∈ [−1, 0) | 55 | 19-35-1 | 35.2% [24–49] | -30.2% | -38.2u | -2.31 ✓ p<.05 |
| z ∈ [0, +1) | 131 | 69-61-1 | 53.1% [45–61] | +1.3% | +1.5u | 0.16 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | 0.146 ✓ p<.05 | 0.053 ✗ | 0.098 |
| 2 | `forContribShare` | DOMINANCE | 0.093 ✗ | 0.001 ✗ | 0.064 |
| 3 | `dCount` | COUNT | 0.076 ✗ | 0.015 ✗ | 0.021 |
| 4 | `dHcCount` | COUNT_HC | NaN — | NaN — | NaN |
| 5 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | +0.217 | 0.793 | 32.7% | meaningful |
| 2 | `dConvictionAvg` | +0.070 | 0.772 | 31.8% | meaningful |
| 3 | `forContribShare` | +0.080 | 0.724 | 29.8% | meaningful |
| 4 | `dHcCount` | -0.090 | 0.090 | 3.7% | silent (<0.2) |
| 5 | `dHcSizeRatio` | -0.049 | 0.049 | 2.0% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcCount` | `dConvictionAvg` | `dHcSizeRatio` | `forContribShare` |
|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.288 | +0.268 | +0.288 | +0.503 |
| `dHcCount` | +0.288 | 1.000 | +0.126 | +1.000 ⚠ | +0.202 |
| `dConvictionAvg` | +0.268 | +0.126 | 1.000 | +0.126 | +0.873 ⚠ |
| `dHcSizeRatio` | +0.288 | +1.000 ⚠ | +0.126 | 1.000 | +0.202 |
| `forContribShare` | +0.503 | +0.202 | +0.873 ⚠ | +0.202 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.110**. At AGS ≥ +1 fires N=106, WR=55.7%, ROI=+6.4%. At AGS ≥ +null fires N=133, WR=52.3%, ROI=+0.1%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-106 ROI (matched cohort) | Top-106 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.093 | −0.017 | WR=53%, ROI=+1.4% | +5.0pp | N=90, WR=53%, ROI=+1.8% |
| `dHcCount` | +0.101 | −0.008 | WR=55%, ROI=+4.0% | +2.5pp | N=110, WR=54%, ROI=+2.6% |
| `dConvictionAvg` | +0.071 | −0.038 | WR=50%, ROI=-5.9% | +12.3pp | N=77, WR=51%, ROI=-2.8% |
| `dHcSizeRatio` | +0.106 | −0.003 | WR=55%, ROI=+4.0% | +2.5pp | N=109, WR=54%, ROI=+3.5% |
| `forContribShare` | +0.111 | +0.002 | WR=57%, ROI=+7.3% | -0.9pp | N=63, WR=54%, ROI=+2.8% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dConvictionAvg` | −0.038 | +12.3pp | carries marginal info |
| 2 | `dCount` | −0.017 | +5.0pp | mild marginal info |
| 3 | `dHcCount` | −0.008 | +2.5pp | mild marginal info |
| 4 | `dHcSizeRatio` | −0.003 | +2.5pp | mild marginal info |
| 5 | `forContribShare` | +0.002 | -0.9pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | +0.287 | 0.287 | positive ↑ |
| 2 | `forContribShare` | DOMINANCE | -0.107 | 0.107 | negative ↓ |
| 3 | `dCount` | COUNT | +0.077 | 0.077 | positive ↑ |
| 4 | `dHcCount` | COUNT_HC | +0.021 | 0.021 | flat ≈ 0 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | +0.011 | 0.011 | flat ≈ 0 |

Intercept b = -0.126 · Final log-loss = 0.6809 · N = 204.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | #1 | #2 | #1 | #1 | 1.25 |
| 2 | `dCount` | COUNT | #3 | #1 | #2 | #3 | 2.25 |
| 3 | `forContribShare` | DOMINANCE | #2 | #3 | #5 | #2 | 3.00 |
| 4 | `dHcCount` | COUNT_HC | #4 | #4 | #3 | #4 | 3.75 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | #5 | #5 | #4 | #5 | 4.75 |

#### Plain-English summary

- **Workhorse**: `dConvictionAvg` (INTENSITY) — ranks #1/#2/#1/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dHcSizeRatio` (INTENSITY_HC) — composite avg rank 4.75. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dHcCount` ↔ `dHcSizeRatio` (r=+1.00); `dConvictionAvg` ↔ `forContribShare` (r=+0.87). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dHcCount`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **v9 simplification candidate**: only `dCount`, `dConvictionAvg` carry marginal info (Spearman ρ drop > 0.01 when removed). The other 4 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=204 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 204 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/204 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 69 | 31-38-0 | 44.9% [34–57] | -19.0% | -39.7u | -1.70 ~ p<.10 |
| 4.5★ | 21 | 13-8-0 | 61.9% [41–79] | +26.1% | +12.4u | 1.08 ✗ noise |
| 4.0★ | 41 | 19-21-1 | 47.5% [33–63] | -7.4% | -6.3u | -0.47 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 21 | 9-11-1 | 45.0% [26–66] | -4.1% | -2.3u | -0.18 ✗ noise |
| 2.5★ | 40 | 20-20-0 | 50.0% [35–65] | -2.7% | -5.9u | -0.17 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 4/50%/-32% | 2/50%/-6% | 6/0%/-100% | 6/33%/-26% | 10/33%/-33% | 16/31%/-38% |
| Δw = +1 | 4/75%/+28% | 5/40%/-24% | 15/64%/+25% | 28/54%/+4% | 2/0%/-100% | 17/59%/+9% |
| Δw = +2 | 25/28%/-44% | 6/67%/+28% | 18/44%/-15% | — | 5/40%/-17% | 4/50%/+8% |
| Δw ≥ +3 | 34/50%/-10% | 5/80%/+90% | 2/100%/+91% | 3/67%/+156% | 4/100%/+133% | 1/100%/+145% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 9 | 5-4-0 | 55.6% [27–81] | -22.4% | -0.7u | -0.91 ✗ noise |
| −200/−151 | 16 | 6-10-0 | 37.5% [18–61] | -39.6% | -12.3u | -1.97 ✓ p<.05 |
| −150/−101 | 133 | 68-64-1 | 51.5% [43–60] | -2.1% | +0.4u | -0.25 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 52 | 22-29-1 | 43.1% [31–57] | -4.6% | -30.1u | -0.30 ✗ noise |
| +151/+200 | 4 | 3-1-0 | 75.0% [30–95] | +105.8% | +2.9u | 1.53 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -46% (5) | — | +47% (1) | -7% (3) |
| −200/−151 | -100% (6) | +20% (4) | +7% (3) | -100% (2) |
| −150/−101 | -29% (23) | +21% (47) | -35% (35) | +22% (25) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +8% (8) | -30% (17) | -5% (16) | +27% (11) |
| +151/+200 | — | +160% (1) | +198% (1) | +165% (1) |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 128 | 61-67-0 | 47.7% [39–56] | -4.4% | -41.8u | -0.44 ✗ noise |
| SPREAD | 36 | 15-20-1 | 42.9% [28–59] | -17.4% | +1.0u | -1.10 ✗ noise |
| TOTAL | 66 | 35-30-1 | 53.8% [42–65] | +3.9% | +2.7u | 0.33 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=23 · 26% · -52% | N=40 · 55% · +4% | N=30 · 40% · -18% | N=32 · 59% · +31% |
| SPREAD | N=10 · 22% · -51% | N=10 · 30% · -42% | N=8 · 63% · +16% | N=7 · 57% · +11% |
| TOTAL | N=12 · 50% · -4% | N=22 · 71% · +36% | N=20 · 30% · -42% | N=10 · 70% · +36% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 98 | 45-53-0 | 45.9% [36–56] | -11.6% | -29.3u | -1.18 ✗ noise |
| NBA | 104 | 52-51-1 | 50.5% [41–60] | +1.3% | +0.3u | 0.12 ✗ noise |
| NHL | 28 | 14-13-1 | 51.9% [34–69] | +2.4% | -9.1u | 0.13 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=13 · 31% · -35% | N=36 · 56% · +5% | N=33 · 36% · -31% | N=15 · 53% · +7% |
| NBA | N=26 · 28% · -49% | N=25 · 56% · +10% | N=17 · 47% · -3% | N=31 · 65% · +39% |
| NHL | N=6 · 50% · -2% | N=11 · 60% · +10% | N=8 · 38% · -21% | N=3 · 67% · +45% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 133 · 44% · -10.0% · -1.06 ✗ noise | 96 · 54% · +2.8% · 0.28 ✗ noise |
| **plusEV** | 30 · 40% · -14.1% · -0.59 ✗ noise | 199 · 50% · -3.2% · -0.46 ✗ noise |
| **pinnacleConfirms** | 64 · 47% · -4.5% · -0.31 ✗ noise | 89 · 48% · -6.1% · -0.56 ✗ noise |
| **invested10kPlus** | 126 · 45% · -9.4% · -0.96 ✗ noise | 27 · 59% · +13.2% · 0.70 ✗ noise |
| **lineMovingWith** | 125 · 48% · -4.1% · -0.43 ✗ noise | 104 · 49% · -5.4% · -0.54 ✗ noise |
| **predMarketAligns** | 56 · 50% · +0.6% · 0.04 ✗ noise | 97 · 46% · -8.9% · -0.85 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 37 | 24-13-0 | 64.9% [49–78] | +25.2% | +6.1u | 1.61 ✗ noise |
| 1 | 48 | 21-26-1 | 44.7% [31–59] | -16.3% | -11.9u | -1.21 ✗ noise |
| 2 | 64 | 30-33-1 | 47.6% [36–60] | -3.9% | -1.3u | -0.30 ✗ noise |
| 3 | 26 | 12-14-0 | 46.2% [29–65] | -7.4% | -8.2u | -0.35 ✗ noise |
| 4 | 24 | 8-16-0 | 33.3% [18–53] | -33.4% | -18.0u | -1.67 ~ p<.10 |
| 5 | 23 | 13-10-0 | 56.5% [37–74] | -1.4% | -2.5u | -0.07 ✗ noise |
| 6 | 8 | 3-5-0 | 37.5% [14–69] | +25.3% | -2.5u | 0.35 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 58 | 36-21-1 | 63.2% [50–74] | +17.7% | +23.0u | 1.45 ✗ noise |
| NEAR_START | 98 | 39-58-1 | 40.2% [31–50] | -15.6% | -43.9u | -1.38 ✗ noise |
| NO_MOVE | 8 | 3-5-0 | 37.5% [14–69] | -34.1% | -1.5u | -1.05 ✗ noise |
| PREGAME | 26 | 16-10-0 | 61.5% [43–78] | +15.7% | +2.6u | 0.84 ✗ noise |
| SMALL_MOVE | 38 | 15-23-0 | 39.5% [26–55] | -20.7% | -20.6u | -1.23 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 125 | 60-64-1 | 48.4% [40–57] | -9.7% | -25.5u | -1.15 ✗ noise |
| STRONG | 49 | 25-24-0 | 51.0% [37–64] | +1.8% | -6.7u | 0.12 ✗ noise |
| LEAN | 52 | 24-27-1 | 47.1% [34–60] | +3.1% | -7.2u | 0.17 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.068 ✗ | -0.021 ✗ | -0.048 | -0.32 |
| totalInvested | -0.031 ✗ | -0.051 ✗ | -0.051 | -0.77 |
| evEdge | 0.081 ✗ | 0.085 ✗ | 0.065 | 1.29 |
| moneyPct | 0.016 ✗ | -0.049 ✗ | -0.053 | -0.74 |
| walletPct | 0.056 ✗ | 0.022 ✗ | 0.025 | 0.33 |
| criteriaMet | -0.081 ✗ | -0.049 ✗ | -0.098 | -0.74 |
| maxContribFor | 0.023 ✗ | 0.034 ✗ | 0.057 | 0.52 |
| meanBaseFor | 0.022 ✗ | 0.040 ✗ | 0.076 | 0.61 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **222** picks. Mean CLV = **-0.0037**.
t-statistic vs zero: -3.36 → ✓ p<.01 · 95% CI [-0.0059, -0.0016]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 23 | 13-10-0 | 56.5% [37–74] | -2.3% | +2.7u | -0.13 ✗ noise |
| CLV (−2%, 0] | 119 | 52-65-2 | 44.4% [36–53] | -12.1% | -39.8u | -1.31 ✗ noise |
| CLV (0, +2%] | 66 | 35-31-0 | 53.0% [41–65] | +12.6% | +0.8u | 0.87 ✗ noise |
| CLV > +2% | 14 | 6-8-0 | 42.9% [21–67] | -26.4% | -7.9u | -1.08 ✗ noise |

ρ(CLV, flat ROI) = -0.031 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=119 (with all features non-null). Intercept β₀ = 0.029.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔAvgRoi | +0.516 | ↑ helps |
| 2 | sharpCount | -0.350 | ↓ hurts |
| 3 | pw.Δcount | +0.334 | ↑ helps |
| 4 | peak.stars | -0.307 | ↓ hurts |
| 5 | odds (American) | -0.288 | ↓ hurts |
| 6 | evEdge | +0.278 | ↑ helps |
| 7 | vault.star | -0.172 | ↓ hurts |
| 8 | Δw | +0.136 | ↑ helps |
| 9 | Δw + HC | +0.131 | ↑ helps |
| 10 | criteriaMet | -0.125 | ↓ hurts |
| 11 | pw.ΔFlatPnl | +0.104 | ↑ helps |
| 12 | moneyPct | -0.096 | ↓ hurts |
| 13 | pw.ΔWlNet | -0.075 | ↓ hurts |
| 14 | log(impliedProb) | +0.071 | ↑ helps |
| 15 | HC margin | +0.058 | ↑ helps |
| 16 | walletPct | -0.051 | ↓ hurts |
| 17 | log10(invested) | -0.044 | ≈ flat |
| 18 | pw.ΔTopQShare | +0.038 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 17 | 7-10 | 41.2% | 44.4% | -106 | — (mute) | 3.44u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 68 | 39-29 | 57.4% | 56.4% | -106 | 5.10% bankroll | 1.82u | **UNDER-SIZED** — ship up to 5.10u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 22 | 8-14 | 36.4% | 40.6% | -110 | — (mute) | 1.97u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 49 | 30-19 | 61.2% | 59.3% | -105 | 8.31% bankroll | 2.79u | **UNDER-SIZED** — ship up to 8.31u (1u=1% bankroll) |
| Stale Δw = 0 | 37 | 13-23 | 36.1% | 39.1% | -108 | — (mute) | 1.23u | **MUTE** (negative EV at posterior) |
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
| 2026-05-17 | 9 | 5-4 | -1.3u | -27.6u |
| 2026-05-18 | 9 | 4-5 | -7.2u | -34.8u |
| 2026-05-19 | 7 | 3-4 | -5.7u | -40.5u |
| 2026-05-20 | 10 | 6-4 | +2.4u | -38.1u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -47.5u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.250  (annualized × √252 ≈ -3.98)

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
| 2026-05-17 | MLB | ML | away | 4.0 | 2.75 | -148 | 1 | 0 | 1 | 2 | 4 | -0.70 | W | +1.9u |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.50 | +139 | 0 | 1 | 1 | 1 | -6 | 0.70 | L | -0.5u |
| 2026-05-17 | MLB | ML | away | 5.0 | 5.00 | -129 | 3 | 1 | 4 | 3 | 2 | 0.40 | L | -5.0u |
| 2026-05-17 | MLB | ML | home | 4.0 | 2.75 | -114 | 3 | 1 | 4 | 3 | -1 | 2.20 | W | +2.4u |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 1 | 3 | 3 | 0 | 0.00 | W | +2.0u |
| 2026-05-17 | MLB | TOTAL | over | 5.0 | 2.50 | +107 | 2 | 2 | 4 | 2 | 0 | 0.00 | L | -2.5u |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 1 | 1 | 0 | 0 | 0.00 | W | +0.3u |
| 2026-05-17 | NBA | ML | away | 3.0 | 1.25 | +165 | 3 | 1 | 4 | 2 | -15 | -0.60 | W | +0.8u |
| 2026-05-17 | NBA | TOTAL | under | 5.0 | 0.75 | -110 | 2 | 3 | 5 | 2 | 44 | 0.00 | L | -0.8u |
| 2026-05-18 | MLB | ML | home | 4.5 | 5.00 | -111 | 2 | 1 | 3 | 3 | 6 | -1.10 | W | +4.4u |
| 2026-05-18 | MLB | ML | away | 4.0 | 2.50 | +120 | 2 | 0 | 2 | 2 | 0 | -2.10 | L | -2.5u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | -118 | 2 | 0 | 2 | 2 | 0 | 1.00 | W | +1.1u |
| 2026-05-18 | MLB | ML | home | 4.0 | 2.75 | -150 | 2 | 0 | 2 | 2 | 6 | -0.80 | L | -2.8u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | +132 | 2 | 0 | 2 | 2 | 1 | 0.40 | W | +1.6u |
| 2026-05-18 | NBA | ML | home | 5.0 | 5.00 | -240 | 3 | 2 | 5 | 3 | 55 | -1.60 | L | -5.0u |
| 2026-05-18 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 1 | 2 | 0 | 31 | 0.20 | L | -1.0u |
| 2026-05-18 | NHL | ML | home | 5.0 | 5.00 | -112 | 2 | 2 | 4 | 3 | 4 | -1.10 | L | -5.0u |
| 2026-05-18 | NHL | TOTAL | under | 4.5 | 2.25 | -110 | 3 | 1 | 4 | 3 | 6 | 0.00 | W | +2.0u |
| 2026-05-19 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 4 | 0 | -1.30 | L | -2.5u |
| 2026-05-19 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | 0 | 0.00 | W | +1.5u |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.50 | +105 | 1 | 1 | 2 | 2 | -3 | -0.90 | L | -2.5u |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 1 | 1 | 2 | 1 | -4 | -1.20 | W | +1.2u |
| 2026-05-19 | NBA | ML | home | 5.0 | 5.00 | -260 | 0 | 3 | 3 | 3 | 1 | -0.50 | W | +1.9u |
| 2026-05-19 | NBA | SPREAD | away | 5.0 | 2.25 | -105 | 3 | 2 | 5 | 3 | 40 | -0.90 | L | -2.3u |
| 2026-05-19 | NBA | TOTAL | under | 5.0 | 3.00 | -106 | 2 | 3 | 5 | 3 | 46 | 0.00 | L | -3.0u |
| 2026-05-20 | MLB | ML | away | 5.0 | 2.50 | +113 | 2 | 1 | 3 | 2 | 0 | -1.00 | L | -2.5u |
| 2026-05-20 | MLB | ML | home | 4.0 | 2.75 | -154 | 2 | 0 | 2 | 2 | 6 | -1.50 | W | +1.9u |
| 2026-05-20 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 2 | 0 | 2 | 2 | 0 | 0.00 | L | -0.8u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | -140 | 1 | 1 | 2 | 0 | -4 | -1.10 | W | +0.9u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | +111 | 0 | 1 | 1 | 0 | -4 | 0.00 | W | +0.6u |
| 2026-05-20 | MLB | ML | away | 4.0 | 2.75 | +113 | 1 | 1 | 2 | 2 | -4 | -1.00 | L | -2.8u |
| 2026-05-20 | NBA | ML | home | 5.0 | 5.00 | -225 | 10 | 5 | 15 | 1 | 25 | -0.20 | W | +2.1u |
| 2026-05-20 | NBA | SPREAD | home | 5.0 | 3.00 | -106 | 6 | 1 | 7 | 4 | 34 | -0.70 | W | +2.7u |
| 2026-05-20 | NBA | TOTAL | over | 5.0 | 1.65 | -112 | 3 | 1 | 4 | 3 | 26 | 0.00 | W | +1.5u |
| 2026-05-20 | NHL | ML | home | 2.5 | 1.25 | -192 | 0 | 1 | 1 | 0 | 2 | -0.80 | L | -1.3u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._