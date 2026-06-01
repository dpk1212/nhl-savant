# Sharp Intel v6 — Full Analysis

_Auto-generated **6/1/2026, 2:32:32 PM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 415 shipped+graded picks · 2026-04-18 → 2026-05-31  (HC analyses scoped to post-cutover 2026-04-30, 303 picks)
**Headline:** 205-207-3 · WR 49.8% [45.0%–54.6%] vs 52.4% break-even · -19.8u flat (-4.8%) · -73.4u peak.
**Overall t-test:** t = -0.98 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.025 ✗**  (full sample, N=409)
- **ρ(HC, flat ROI) = -0.018 ✗**  (post-cutover, N=303)
- **ρ(Δw+HC, flat ROI) = -0.072 ✗**  (post-cutover, N=303)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Tier-1a HC ≥ +2 (post-cutover)** — N=30, 11-19, WR 36.7% [22%–54%], flat ROI -31.7% (t=-1.86 ~ p<.10)
- **Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)** — N=60, 23-37, WR 38.3% [27%–51%], flat ROI -29.7% (t=-2.53 ✓ p<.05)
- **Stale Δw ≤ 0 (full sample)** — N=85, 37-46, WR 44.6% [34%–55%], flat ROI -18.2% (t=-1.84 ~ p<.10)

### Action map

- **Tier-1a (HC ≥ +2)** — N=30, WR 36.7%, flat ROI -31.7%. Bayesian posterior WR ≈ 40.0%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=125, WR 55.2%, flat ROI +7.0%. Bayesian posterior WR ≈ 54.8%, half-Kelly = **2.6%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=60, WR 38.3%, flat ROI -29.7%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=82, WR 46.3%, flat ROI -4.3%. Bayesian posterior WR ≈ 46.7%, half-Kelly = **0.0%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -18.2% flat ROI on 85 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.00u/pick), we need **~1526 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 415. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-31 |
| Sides scanned | 814 |
| Shipped + graded | **415** |
| W-L-P | 205-207-3 |
| Win rate | **49.8%** [45.0%–54.6%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +2.6 pp |
| Peak-units PnL | **-73.4u** |
| Flat-1u PnL | **-19.8u** (-4.8% flat ROI) |
| Flat t-statistic vs zero | -0.98 → ✗ noise |
| Flat 95% CI per-pick | [-0.144, 0.048]u |

### Power note

At our observed flat-PnL standard deviation (1.00u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4237 |
| +5% | 1526 |
| +10% | 382 |

We have **415** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.3u | 0.00 ✗ noise |
| Δw = −1 | 12 | 2-10-0 | 16.7% [5–45] | -70.5% | -8.1u | -3.49 ✓ p<.01 |
| Δw = 0 | 71 | 35-34-2 | 50.7% [39–62] | -7.1% | -2.4u | -0.65 ✗ noise |
| Δw = +1 | 137 | 79-57-1 | 58.1% [50–66] | +8.4% | +12.4u | 1.05 ✗ noise |
| Δw = +2 | 105 | 47-58-0 | 44.8% [36–54] | -12.6% | -41.4u | -1.30 ✗ noise |
| Δw ≥ +3 | 82 | 38-44-0 | 46.3% [36–57] | -4.3% | -34.7u | -0.33 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.006** ✗  ·  **ρ(Δw, flat ROI) = 0.025** ✗  (N=409)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 8 | 2-6-0 | 25.0% [7–59] | -51.9% | -4.3u | -1.64 ✗ noise |
| HC = 0 | 140 | 72-66-2 | 52.2% [44–60] | -4.4% | -17.8u | -0.57 ✗ noise |
| HC = +1 | 125 | 69-56-0 | 55.2% [46–64] | +7.0% | -8.2u | 0.79 ✗ noise |
| HC = +2 | 21 | 8-13-0 | 38.1% [21–59] | -23.0% | -23.9u | -1.04 ✗ noise |
| HC ≥ +3 | 9 | 3-6-0 | 33.3% [12–65] | -51.8% | -8.6u | -2.15 ✓ p<.05 |

**Pearson ρ(HC, WIN) = -0.016** ✗  ·  **ρ(HC, flat ROI) = -0.018** ✗  (N=303)

Spearman rank ρ(HC, flat ROI) = 0.026.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 38 | 18-19-1 | 48.6% [33–64] | -13.3% | -5.0u | -0.92 ✗ noise |
| Σ = +1 | 73 | 44-28-1 | 61.1% [50–72] | +14.4% | +19.2u | 1.33 ✗ noise |
| Σ = +2 | 86 | 49-37-0 | 57.0% [46–67] | +5.8% | -3.3u | 0.57 ✗ noise |
| Σ = +3 | 47 | 17-30-0 | 36.2% [24–50] | -27.8% | -24.6u | -1.92 ~ p<.10 |
| Σ = +4 | 29 | 15-14-0 | 51.7% [34–69] | +2.9% | -18.6u | 0.15 ✗ noise |
| Σ = +5 | 13 | 4-9-0 | 30.8% [13–58] | -38.3% | -14.9u | -1.43 ✗ noise |
| Σ ≥ +6 | 17 | 7-10-0 | 41.2% [22–64] | -25.1% | -15.6u | -1.09 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = -0.076** ✗  ·  **ρ(Σ, flat ROI) = -0.072** ✗  (N=303)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 303.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.091 ✗ | -0.084 ✗ | -0.080 | weak |
| HC margin | -0.016 ✗ | -0.018 ✗ | 0.026 | weak |
| Δw + HC | -0.076 ✗ | -0.072 ✗ | -0.057 | weak |
| peak.stars | -0.105 ~ p<.10 | -0.139 ✓ p<.05 | -0.155 | weak |
| vault.star | -0.055 ✗ | -0.069 ✗ | -0.121 | weak |
| lock.stars | -0.069 ✗ | -0.101 ~ p<.10 | -0.107 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 303 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | — | N=3 · 0-3 · 0% [0–56] · -100%  | N=1 · 1-0 · 100% [21–100] · —  | N=3 · 1-2 · 33% [6–79] · -33%  |
| +0 | — | N=1 · 0-1 · 0% [0–79] · —  | N=2 · 1-1 · 50% [9–91] · —  | N=28 · 17-10 · 63% [44–78] · +12%  | N=53 · 33-19 · 63% [50–75] · +18%  | N=38 · 18-20 · 47% [32–63] · -13%  | N=18 · 3-15 · 17% [6–39] · -70% ✗ |
| +1 | — | — | N=3 · 0-3 · 0% [0–56] · -100%  | N=19 · 10-9 · 53% [32–73] · +1%  | N=45 · 30-15 · 67% [52–79] · +24%  | N=31 · 14-17 · 45% [29–62] · -7%  | N=27 · 15-12 · 56% [37–72] · +11%  |
| +2 | — | — | — | — | N=3 · 1-2 · 33% [6–79] · -40%  | N=7 · 2-5 · 29% [8–64] · -37%  | N=11 · 5-6 · 45% [21–72] · -9%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | — | N=3 · 1-2 · 33% [6–79] · -50%  | N=5 · 1-4 · 20% [4–62] · -71% ✗ |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 8 | 2-6-0 | 25.0% [7–59] | -51.9% | -4.3u | -1.64 ✗ noise |
| HC = 0 | 140 | 72-66-2 | 52.2% [44–60] | -4.4% | -17.8u | -0.57 ✗ noise |
| HC = +1 | 125 | 69-56-0 | 55.2% [46–64] | +7.0% | -8.2u | 0.79 ✗ noise |
| HC = +2 | 21 | 8-13-0 | 38.1% [21–59] | -23.0% | -23.9u | -1.04 ✗ noise |
| HC ≥ +3 | 9 | 3-6-0 | 33.3% [12–65] | -51.8% | -8.6u | -2.15 ✓ p<.05 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -2.8u | 0.00 ✗ n<2 |
| Δw = −1 | 6 | 1-5-0 | 16.7% [3–56] | -75.4% | -3.6u | -3.06 ✓ p<.01 |
| Δw = 0 | 48 | 28-19-1 | 59.6% [45–72] | +8.4% | +11.0u | 0.64 ✗ noise |
| Δw = +1 | 104 | 64-39-1 | 62.1% [52–71] | +15.7% | +17.0u | 1.73 ~ p<.10 |
| Δw = +2 | 80 | 36-44-0 | 45.0% [35–56] | -13.1% | -37.6u | -1.18 ✗ noise |
| Δw ≥ +3 | 64 | 25-39-0 | 39.1% [28–51] | -24.0% | -46.8u | -1.98 ✓ p<.05 |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 155 | 80-75-0 | 51.6% [44–59] | -0.5% | -40.7u | -0.06 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 60 | 23-37-0 | 38.3% [27–51] | -29.7% | -34.4u | -2.53 ✓ p<.05 |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 88 | 51-35-2 | 59.3% [49–69] | +8.5% | +12.2u | 0.87 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 390 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -7.0u | 0.00 ✗ noise |
| Δcount = −1 | 15 | 7-8-0 | 46.7% [25–70] | -7.3% | -6.6u | -0.27 ✗ noise |
| Δcount = 0 (balanced) | 37 | 13-23-1 | 36.1% [22–52] | -27.5% | -14.6u | -1.73 ~ p<.10 |
| Δcount = +1 | 154 | 76-76-2 | 50.0% [42–58] | -8.4% | -37.4u | -1.12 ✗ noise |
| Δcount = +2 | 110 | 53-57-0 | 48.2% [39–57] | -7.3% | -25.8u | -0.78 ✗ noise |
| Δcount ≥ +3 (heavy support) | 71 | 48-23-0 | 67.6% [56–77] | +36.3% | +31.7u | 2.76 ✓ p<.01 |

**ρ(Δcount, WIN) = 0.144** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.161** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -22 · ≤ -5 · ≤ 3 · ≤ 14 · > 14

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 87 | 35-52-0 | 40.2% [31–51] | -23.1% | -48.9u | -2.27 ✓ p<.05 |
| Q2 | 74 | 32-41-1 | 43.8% [33–55] | -14.0% | -25.2u | -1.22 ✗ noise |
| Q3 (balanced) | 82 | 37-44-1 | 45.7% [35–56] | -12.6% | -11.4u | -1.18 ✗ noise |
| Q4 | 70 | 42-28-0 | 60.0% [48–71] | +12.5% | -6.9u | 1.10 ✗ noise |
| Q5 (best — heavy support) | 77 | 51-25-1 | 67.1% [56–77] | +29.3% | +32.7u | 2.42 ✓ p<.05 |

**ρ(ΔWlNet, WIN) = 0.177** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.161** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -20.33 · ≤ -5.97 · ≤ 0.55 · ≤ 10.40 · > 10.40

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 87 | 35-52-0 | 40.2% [31–51] | -24.3% | -43.0u | -2.42 ✓ p<.05 |
| Q2 | 74 | 33-40-1 | 45.2% [34–57] | -14.0% | -40.8u | -1.25 ✗ noise |
| Q3 | 74 | 32-41-1 | 43.8% [33–55] | -14.7% | -6.9u | -1.29 ✗ noise |
| Q4 | 79 | 47-32-0 | 59.5% [48–70] | +12.0% | +4.2u | 1.12 ✗ noise |
| Q5 | 76 | 50-25-1 | 66.7% [55–76] | +30.9% | +26.8u | 2.48 ✓ p<.05 |

**ρ(ΔFlatPnl, WIN) = 0.178** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.193** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -11.7 · ≤ -6.7 · ≤ 3.6 · ≤ 15.3 · > 15.3

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 91 | 30-59-2 | 33.7% [25–44] | -32.3% | -60.4u | -3.18 ✓ p<.01 |
| Q2 | 68 | 28-40-0 | 41.2% [30–53] | -24.7% | -28.0u | -2.23 ✓ p<.05 |
| Q3 | 76 | 41-35-0 | 53.9% [43–65] | +1.8% | -12.0u | 0.16 ✗ noise |
| Q4 | 78 | 41-36-1 | 53.2% [42–64] | +1.3% | -3.2u | 0.12 ✗ noise |
| Q5 | 77 | 57-20-0 | 74.0% [63–83] | +44.6% | +43.9u | 3.93 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.302** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.310** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 40 | 9-30-1 | 23.1% [13–38] | -50.5% | -33.9u | -3.56 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 18 | 4-14-0 | 22.2% [9–45] | -58.8% | -26.5u | -3.11 ✓ p<.01 |
| ΔBestRank = 0 (tied) | 2 | 1-1-0 | 50.0% [9–91] | -4.5% | -1.4u | -0.05 ✗ noise |
| ΔBestRank ∈ [+1,+4] | 19 | 6-13-0 | 31.6% [15–54] | -38.1% | -9.7u | -1.74 ~ p<.10 |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 66 | 45-20-1 | 69.2% [57–79] | +41.5% | +28.7u | 3.00 ✓ p<.01 |

**ρ(ΔBestRank, WIN) = 0.471** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.475** ✓ p<.01  (N=145)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 23 | 5-17-1 | 22.7% [10–43] | -48.5% | -16.1u | -2.29 ✓ p<.05 |
| Δshare ∈ [−30,−10] pp | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -2.8u | 0.00 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 263 | 123-139-1 | 46.9% [41–53] | -11.8% | -82.6u | -2.00 ✓ p<.05 |
| Δshare ∈ [+10,+30] pp | 16 | 10-6-0 | 62.5% [39–82] | +24.4% | -1.8u | 0.93 ✗ noise |
| Δshare ≥ +30 pp | 86 | 59-26-1 | 69.4% [59–78] | +35.7% | +43.5u | 3.26 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.228** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.211** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.302 ✓ p<.01 | 0.310 ✓ p<.01 | 0.257 |
| 2 | **ΔTopQCount** | 0.255 ✓ p<.01 | 0.280 ✓ p<.01 | 0.258 |
| 3 | **ΔTopQShare** | 0.228 ✓ p<.01 | 0.211 ✓ p<.01 | 0.232 |
| 4 | **ΔFlatPnl** | 0.178 ✓ p<.01 | 0.193 ✓ p<.01 | 0.189 |
| 5 | **ΔWlNet** | 0.177 ✓ p<.01 | 0.161 ✓ p<.01 | 0.155 |
| 6 | **Δcount** | 0.144 ✓ p<.01 | 0.161 ✓ p<.01 | 0.150 |

_(ΔBestRank uses N=145 subset where both sides had a proven wallet — ρ(flat ROI) = 0.475 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 725, dateRange = 2026-04-18 → 2026-05-31, computedAt = 2026-06-01T18:28:21.784Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **390** rows · PIT aggregate computable on **386** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **386** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 0 · — · — | 0 · — · — | — |
| NEUTRAL (0..+3) | 266 · 55% · +4.6% | 247 · 51% · -5.0% | -9.5pp |
| WEAK (−3..0) | 107 · 41% · -20.4% | 126 · 51% · +2.1% | +22.5pp |
| FADE (<−3) | 0 · — · — | 0 · — · — | — |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=206, WR=57%, ROI=+7.6% | N=192, WR=49%, ROI=-7.6% | -15.2pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=266, WR=55%, ROI=+4.6% | N=247, WR=51%, ROI=-5.0% | -9.5pp |
| AGS < −1 (mute veto) | N=37, WR=30%, ROI=-41.1% | N=65, WR=46%, ROI=-3.6% | +37.5pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-18 → 2026-05-31, N=205)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 0 · — · — |
| NEUTRAL (0..+3) | 131 · 53% · -2.5% |
| WEAK (−3..0) | 74 · 49% · -7.1% |
| FADE (<−3) | 0 · — · — |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=98, WR=50%, ROI=-7.7% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=131, WR=53%, ROI=-2.5% |
| AGS < −1 (mute veto) | N=44, WR=48%, ROI=-9.1% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.14 | 1.47 |
| `dHcSizeRatio` | INTENSITY_HC | + | 1.28 | 5.19 |
| `dSumRankNorm` | QUALITY_RANK | − | 61.93 | 91.21 |
| `dWinnerCtPreA` | QUALITY_TRACK | − | 0.48 | 1.13 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **386/415** shipped+graded rows (93%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -1.25 |
| 20th pct | -0.13 |
| 40th pct | 0.05 |
| Median | 0.13 |
| 60th pct | 0.21 |
| 80th pct | 0.41 |
| 90th pct | 0.61 |
| Max | 1.74 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 69 | 17.9% |
| **LOCK** | +5..+7 | 79 | 20.5% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 48 | 12.4% |
| **FADE** | < −3 | 70 | 18.1% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 69 | 35-34-0 | 50.7% [39–62] | -6.7% | -20.6u | -0.59 ✗ noise |
| LOCK | 79 | 34-45-0 | 43.0% [33–54] | -19.0% | -33.9u | -1.76 ~ p<.10 |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 48 | 24-23-1 | 51.1% [37–65] | -2.0% | -2.7u | -0.14 ✗ noise |
| FADE | 70 | 30-38-2 | 44.1% [33–56] | -7.6% | -27.5u | -0.56 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **-0.010** ✗ · r(ROI) = **-0.043** ✗ · Spearman ρ(ROI) = **-0.041**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 49 | 26-22-1 | 54.2% [40–67] | +12.5% | -13.1u | 0.74 ✗ noise |
| z ∈ [−1, 0) | 142 | 75-65-2 | 53.6% [45–62] | -0.1% | +0.4u | -0.01 ✗ noise |
| z ∈ [0, +1) | 129 | 58-71-0 | 45.0% [37–54] | -14.2% | -43.1u | -1.67 ~ p<.10 |
| z ≥ +1 (very positive) | 66 | 32-34-0 | 48.5% [37–60] | -9.7% | -12.8u | -0.82 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 352 | 176-173-3 | 50.4% [45–56] | -5.0% | -65.6u | -0.99 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dSumRankNorm` (QUALITY_RANK)

r(WIN) = **-0.063** ✗ · r(ROI) = **-0.063** ✗ · Spearman ρ(ROI) = **-0.053**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 63 | 36-26-1 | 58.1% [46–70] | +2.0% | -5.6u | 0.18 ✗ noise |
| z ∈ [−1, 0) | 111 | 60-50-1 | 54.5% [45–64] | +7.6% | -4.9u | 0.75 ✗ noise |
| z ∈ [0, +1) | 161 | 72-88-1 | 45.0% [37–53] | -12.4% | -51.4u | -1.60 ✗ noise |
| z ≥ +1 (very positive) | 51 | 23-28-0 | 45.1% [32–59] | -16.9% | -6.8u | -1.28 ✗ noise |

#### `dWinnerCtPreA` (QUALITY_TRACK)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 352 | 176-173-3 | 50.4% [45–56] | -5.0% | -65.6u | -0.99 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.063 ✗ | -0.063 ✗ | -0.053 |
| 2 | `dCount` | COUNT | -0.010 ✗ | -0.043 ✗ | -0.041 |
| 3 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |
| 4 | `dWinnerCtPreA` | QUALITY_TRACK | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | +0.105 | 0.763 | 48.3% | meaningful |
| 2 | `dSumRankNorm` | +0.023 | 0.759 | 48.0% | meaningful |
| 3 | `dWinnerCtPreA` | -0.037 | 0.037 | 2.4% | silent (<0.2) |
| 4 | `dHcSizeRatio` | -0.022 | 0.022 | 1.4% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcSizeRatio` | `dSumRankNorm` | `dWinnerCtPreA` |
|---|---|---|---|---|
| `dCount` | 1.000 | +0.120 | +0.689 | +0.120 |
| `dHcSizeRatio` | +0.120 | 1.000 | +0.083 | +1.000 ⚠ |
| `dSumRankNorm` | +0.689 | +0.083 | 1.000 | +0.083 |
| `dWinnerCtPreA` | +0.120 | +1.000 ⚠ | +0.083 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **-0.017**. At AGS ≥ +0.12 fires N=199, WR=48.7%, ROI=-8.9%. At AGS ≥ +null fires N=255, WR=50.2%, ROI=-6.5%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-199 ROI (matched cohort) | Top-199 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.055 | +0.037 | WR=55%, ROI=+4.7% | -13.7pp | N=164, WR=56%, ROI=+5.9% |
| `dHcSizeRatio` | +0.031 | +0.013 | WR=54%, ROI=-0.5% | -8.4pp | N=193, WR=53%, ROI=-1.3% |
| `dSumRankNorm` | -0.045 | +0.028 | WR=47%, ROI=-11.3% | +2.4pp | N=191, WR=47%, ROI=-10.9% |
| `dWinnerCtPreA` | +0.033 | +0.016 | WR=53%, ROI=-1.7% | -7.3pp | N=182, WR=53%, ROI=-1.8% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dHcSizeRatio` | +0.013 | -8.4pp | redundant — other features cover it |
| 2 | `dWinnerCtPreA` | +0.016 | -7.3pp | redundant — other features cover it |
| 3 | `dSumRankNorm` | +0.028 | +2.4pp | redundant — other features cover it |
| 4 | `dCount` | +0.037 | -13.7pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.155 | 0.155 | negative ↓ |
| 2 | `dCount` | COUNT | +0.046 | 0.046 | flat ≈ 0 |
| 3 | `dWinnerCtPreA` | QUALITY_TRACK | +0.040 | 0.040 | flat ≈ 0 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | +0.023 | 0.023 | flat ≈ 0 |

Intercept b = -0.020 · Final log-loss = 0.6898 · N = 386.

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
- **Redundant pairs (|r| ≥ 0.7)**: `dHcSizeRatio` ↔ `dWinnerCtPreA` (r=+1.00). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dWinnerCtPreA`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 386 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/386 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 151 | 67-84-0 | 44.4% [37–52] | -20.0% | -76.3u | -2.68 ✓ p<.01 |
| 4.5★ | 40 | 26-14-0 | 65.0% [50–78] | +23.1% | +12.5u | 1.48 ✗ noise |
| 4.0★ | 76 | 37-38-1 | 49.3% [38–60] | -5.0% | -3.7u | -0.45 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 52 | 25-26-1 | 49.0% [36–62] | -2.2% | -4.6u | -0.16 ✗ noise |
| 2.5★ | 58 | 31-26-1 | 54.4% [42–67] | +4.7% | -5.1u | 0.37 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 15/60%/+1% | 6/50%/-16% | 12/33%/-43% | 6/33%/-26% | 21/35%/-34% | 24/48%/-8% |
| Δw = +1 | 21/52%/-7% | 12/75%/+30% | 34/58%/+11% | 28/54%/+4% | 17/59%/+11% | 24/58%/+7% |
| Δw = +2 | 52/40%/-25% | 12/58%/+13% | 25/48%/-5% | — | 9/44%/-3% | 7/43%/-4% |
| Δw ≥ +3 | 61/39%/-28% | 7/71%/+64% | 5/40%/-24% | 3/67%/+156% | 5/80%/+86% | 1/100%/+145% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 8 | 7-1-0 | 87.5% [53–98] | +10.8% | +6.0u | 0.68 ✗ noise |
| −300/−201 | 15 | 11-4-0 | 73.3% [48–89] | +4.9% | +9.0u | 0.29 ✗ noise |
| −200/−151 | 40 | 21-19-0 | 52.5% [37–67] | -17.1% | -9.9u | -1.35 ✗ noise |
| −150/−101 | 241 | 120-120-1 | 50.0% [44–56] | -5.5% | -34.9u | -0.91 ✗ noise |
| −100/+100 | 4 | 1-3-0 | 25.0% [5–70] | -50.0% | -3.8u | -1.00 ✗ noise |
| +101/+150 | 90 | 39-49-2 | 44.3% [34–55] | -3.2% | -40.8u | -0.28 ✗ noise |
| +151/+200 | 9 | 4-5-0 | 44.4% [19–73] | +21.0% | -0.6u | 0.44 ✗ noise |
| +201+ | 8 | 2-6-0 | 25.0% [7–59] | +21.3% | +1.5u | 0.26 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +25% (2) | +32% (1) | +25% (3) |
| −300/−201 | -11% (8) | +47% (1) | +44% (2) | +7% (4) |
| −200/−151 | -47% (12) | +35% (14) | +27% (5) | -100% (8) |
| −150/−101 | -12% (48) | +11% (83) | -25% (63) | -4% (44) |
| −100/+100 | -100% (1) | +0% (2) | -100% (1) | — |
| +101/+150 | -2% (14) | -9% (32) | +1% (28) | -0% (16) |
| +151/+200 | — | +30% (2) | +41% (4) | +32% (2) |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +94% (5) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 219 | 105-114-0 | 47.9% [41–55] | -6.9% | -66.9u | -0.98 ✗ noise |
| SPREAD | 77 | 35-41-1 | 46.1% [35–57] | -18.0% | -5.7u | -1.76 ~ p<.10 |
| TOTAL | 119 | 65-52-2 | 55.6% [47–64] | +7.6% | -0.8u | 0.86 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=44 · 39% · -31% | N=70 · 60% · +12% | N=51 · 43% · -13% | N=51 · 43% · -7% |
| SPREAD | N=20 · 37% · -35% | N=27 · 48% · -16% | N=16 · 63% · +12% | N=13 · 31% · -40% |
| TOTAL | N=21 · 65% · +25% | N=40 · 62% · +18% | N=38 · 39% · -23% | N=18 · 67% · +29% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 252 | 128-123-1 | 51.0% [45–57] | -4.1% | -33.3u | -0.68 ✗ noise |
| NBA | 120 | 57-62-1 | 47.9% [39–57] | -4.5% | -17.6u | -0.45 ✗ noise |
| NHL | 43 | 20-22-1 | 47.6% [33–62] | -9.6% | -22.5u | -0.65 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=50 · 51% · -7% | N=95 · 59% · +9% | N=73 · 44% · -15% | N=33 · 42% · -16% |
| NBA | N=29 · 32% · -41% | N=28 · 50% · -2% | N=22 · 50% · -1% | N=36 · 56% · +20% |
| NHL | N=6 · 50% · -2% | N=14 · 69% · +25% | N=10 · 40% · -23% | N=13 · 31% · -40% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 197 · 44% · -11.7% · -1.55 ✗ noise | 217 · 55% · +0.8% · 0.13 ✗ noise |
| **plusEV** | 52 · 44% · -13.2% · -0.83 ✗ noise | 362 · 50% · -4.0% · -0.78 ✗ noise |
| **pinnacleConfirms** | 106 · 50% · -2.3% · -0.22 ✗ noise | 168 · 49% · -7.6% · -1.00 ✗ noise |
| **invested10kPlus** | 194 · 47% · -8.0% · -1.06 ✗ noise | 80 · 54% · +0.4% · 0.04 ✗ noise |
| **lineMovingWith** | 217 · 53% · +2.7% · 0.39 ✗ noise | 197 · 45% · -13.7% · -1.98 ✓ p<.05 |
| **predMarketAligns** | 103 · 51% · -0.8% · -0.07 ✗ noise | 171 · 48% · -8.4% · -1.10 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 82 | 42-40-0 | 51.2% [41–62] | -3.4% | -13.0u | -0.32 ✗ noise |
| 1 | 101 | 51-48-2 | 51.5% [42–61] | -3.4% | -13.1u | -0.37 ✗ noise |
| 2 | 107 | 52-54-1 | 49.1% [40–58] | -5.2% | -13.5u | -0.53 ✗ noise |
| 3 | 38 | 19-19-0 | 50.0% [35–65] | -3.5% | -8.1u | -0.21 ✗ noise |
| 4 | 36 | 17-19-0 | 47.2% [32–63] | -13.5% | -11.8u | -0.84 ✗ noise |
| 5 | 40 | 19-21-0 | 47.5% [33–63] | -12.8% | -16.5u | -0.84 ✗ noise |
| 6 | 11 | 5-6-0 | 45.5% [21–72] | +29.0% | +2.5u | 0.53 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 100 | 57-42-1 | 57.6% [48–67] | +8.0% | +7.7u | 0.84 ✗ noise |
| NEAR_START | 164 | 76-86-2 | 46.9% [39–55] | -7.1% | -54.0u | -0.87 ✗ noise |
| NO_MOVE | 13 | 5-8-0 | 38.5% [18–64] | -31.0% | -1.0u | -1.22 ✗ noise |
| PREGAME | 46 | 26-20-0 | 56.5% [42–70] | +5.4% | -0.6u | 0.39 ✗ noise |
| SMALL_MOVE | 90 | 39-51-0 | 43.3% [34–54] | -18.8% | -27.9u | -1.86 ~ p<.10 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 237 | 116-120-1 | 49.2% [43–55] | -8.6% | -58.1u | -1.40 ✗ noise |
| STRONG | 67 | 36-31-0 | 53.7% [42–65] | +7.6% | -0.5u | 0.60 ✗ noise |
| LEAN | 106 | 51-53-2 | 49.0% [40–59] | -3.7% | -15.1u | -0.35 ✗ noise |
| CONTESTED | 4 | 1-3-0 | 25.0% [5–70] | -51.0% | -1.3u | -1.04 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.102 ✓ p<.05 | -0.066 ✗ | -0.077 | -1.33 |
| totalInvested | -0.042 ✗ | -0.057 ✗ | -0.060 | -1.15 |
| evEdge | 0.079 ✗ | 0.055 ✗ | 0.055 | 1.12 |
| moneyPct | 0.031 ✗ | 0.000 ✗ | -0.005 | 0.01 |
| walletPct | 0.032 ✗ | 0.022 ✗ | 0.022 | 0.45 |
| criteriaMet | -0.027 ✗ | -0.006 ✗ | -0.029 | -0.12 |
| maxContribFor | -0.062 ✗ | -0.030 ✗ | -0.008 | -0.60 |
| meanBaseFor | -0.037 ✗ | 0.003 ✗ | 0.041 | 0.05 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **404** picks. Mean CLV = **-0.0036**.
t-statistic vs zero: -2.53 → ✓ p<.05 · 95% CI [-0.0064, -0.0008]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 42 | 20-22-0 | 47.6% [33–62] | -19.2% | -9.8u | -1.43 ✗ noise |
| CLV (−2%, 0] | 229 | 111-116-2 | 48.9% [42–55] | -6.4% | -52.8u | -0.99 ✗ noise |
| CLV (0, +2%] | 112 | 57-55-0 | 50.9% [42–60] | +3.3% | -17.1u | 0.32 ✗ noise |
| CLV > +2% | 21 | 11-9-1 | 55.0% [34–74] | -4.0% | +2.1u | -0.20 ✗ noise |

ρ(CLV, flat ROI) = 0.059 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=304 (with all features non-null). Intercept β₀ = 0.045.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔAvgRoi | +0.331 | ↑ helps |
| 2 | sharpCount | -0.284 | ↓ hurts |
| 3 | pw.Δcount | +0.279 | ↑ helps |
| 4 | evEdge | +0.218 | ↑ helps |
| 5 | log(impliedProb) | +0.199 | ↑ helps |
| 6 | peak.stars | -0.197 | ↓ hurts |
| 7 | pw.ΔTopQShare | +0.163 | ↑ helps |
| 8 | pw.ΔWlNet | +0.136 | ↑ helps |
| 9 | odds (American) | -0.134 | ↓ hurts |
| 10 | Δw | -0.131 | ↓ hurts |
| 11 | HC margin | +0.127 | ↑ helps |
| 12 | pw.ΔFlatPnl | +0.125 | ↑ helps |
| 13 | Δw + HC | -0.044 | ≈ flat |
| 14 | moneyPct | +0.029 | ≈ flat |
| 15 | criteriaMet | +0.028 | ≈ flat |
| 16 | log10(invested) | -0.015 | ≈ flat |
| 17 | vault.star | +0.006 | ≈ flat |
| 18 | walletPct | +0.006 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 30 | 11-19 | 36.7% | 40.0% | -110 | — (mute) | 3.17u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 125 | 69-56 | 55.2% | 54.8% | -110 | 2.56% bankroll | 2.01u | ~ in range — 2.56u |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 60 | 23-37 | 38.3% | 40.0% | -110 | — (mute) | 1.98u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 82 | 38-44 | 46.3% | 46.7% | -106 | — (mute) | 2.62u | **MUTE** (negative EV at posterior) |
| Stale Δw = 0 | 71 | 35-34 | 50.7% | 50.6% | -110 | — (mute) | 1.59u | **MUTE** (negative EV at posterior) |
| Stale Δw ≤ −1 | 14 | 2-12 | 14.3% | 29.2% | -125 | — (mute) | 1.40u | **MUTE** (negative EV at posterior) |

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

**Peak cum PnL:** +7.1u
**Max drawdown:** -81.3u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.286  (annualized × √252 ≈ -4.55)

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
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.50 | -108 | 0 | — | — | 0 | 0 | -2.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1.00 | -108 | 0 | — | — | 0 | 1 | -1.70 | L | -1.0u |
| 2026-04-18 | NBA | TOTAL | over | 3.0 | 0.75 | -107 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-18 | NBA | TOTAL | under | 5.0 | 2.00 | -104 | — | — | — | — | — | 0.00 | W | +1.9u |
| 2026-04-18 | NBA | ML | home | 5.0 | 3.00 | -360 | — | — | — | — | — | 0.20 | W | +0.8u |
| 2026-04-18 | NBA | TOTAL | under | 4.5 | 1.50 | -105 | — | — | — | — | — | 0.00 | L | -1.5u |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 2 | -5 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 1 | 2 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 1 | -3 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 1 | 2 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 0 | 24 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 4 | 16 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 2 | -4 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 1 | 2 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | -1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 1 | 2 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | 1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | -2 | -14 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 1 | 12 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 0 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | 1 | -6 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | 0 | -13 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 1 | 4 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 2 | 21 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | -1 | 0 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 0 | 7 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 1 | 4 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 1 | 14 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 1 | 0 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | 0 | 0 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 1 | 0 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 1 | -1 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 1 | 0 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | 0 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | 1 | 3 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | 0 | -29 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | -1 | -12 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 1 | -8 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 4 | 20 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 3 | -3 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 1 | -8 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | -1 | -8 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | 1 | -12 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | 0 | -2 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | 0 | 0 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 0 | 0 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 1 | 6 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 3 | 18 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 2 | 6 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -1 | -14 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 2 | -5 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 26 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | 1 | 0 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 8 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 3 | -3 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | -6 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | -7 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 2 | -21 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 4 | 27 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 1 | 24 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 2 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 26 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 2 | -4 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 1 | -22 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 1 | -22 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | 0 | -28 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 5 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 2 | 9 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 1 | -6 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 1 | -2 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 1 | 6 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | -1 | 22 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | 26 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 2 | -16 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 18 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 28 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | 9 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -5 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 3 | 4 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | -1 | -26 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 1 | -22 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -19 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 4 | 21 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 3 | 27 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 4 | 16 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 1 | 6 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 0 | 0 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 1 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 0 | 0 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | -2 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 6 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 3 | -5 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 6 | 2 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 21 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 1 | 26 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 2 | -1 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 1 | 17 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 0 | -4 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 1 | -3 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 4 | 15 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 5 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | -16 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 1 | -20 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 3 | 11 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 0 | -3 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 1 | -2 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | 7 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 2 | -24 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 12 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 3 | 16 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 1 | 1 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 3 | 22 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | -1 | -26 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 2 | 4 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 15 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 14 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 15 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | 0 | -2 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 37 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 3 | 11 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 2 | -9 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 1 | 5 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 1 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 6 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 5 | 13 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 0 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 17 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 3 | 19 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 0 | 2 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 1 | -1 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 1 | -1 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 2 | 22 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 3 | 24 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 17 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 1 | 1 | -1.30 | L | -1.1u |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.70 | -104 | — | — | — | 2 | 12 | 0.00 | W | +1.6u |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-09 | NBA | ML | away | 5.0 | 4.50 | -364 | 3 | 1 | 4 | 5 | 37 | 0.00 | W | +1.2u |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2.00 | -104 | 2 | 1 | 3 | 2 | 17 | 0.00 | W | +1.9u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -120 | 1 | 1 | 2 | 1 | -22 | 0.00 | W | +0.9u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -22 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -22 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -103 | 1 | 1 | 2 | 1 | -22 | 0.00 | L | -1.1u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -110 | 1 | 1 | 2 | 1 | -22 | 0.00 | W | +1.0u |
| 2026-05-10 | MLB | ML | away | 3.5 | 1.13 | +134 | 0 | 1 | 1 | 1 | -22 | 0.00 | W | +1.5u |
| 2026-05-10 | NBA | ML | home | 4.0 | 1.50 | +160 | 1 | 1 | 2 | 2 | 22 | 0.80 | W | +2.6u |
| 2026-05-10 | NBA | TOTAL | over | 5.0 | 3.50 | -110 | 3 | 2 | 5 | 2 | 17 | 0.00 | W | +3.3u |
| 2026-05-10 | NHL | ML | away | 4.5 | 4.50 | +108 | 2 | 2 | 4 | 2 | 3 | -0.70 | L | -4.5u |
| 2026-05-10 | NHL | TOTAL | under | 5.0 | 1.70 | -110 | 2 | 1 | 3 | 1 | -2 | 0.00 | L | -1.7u |
| 2026-05-11 | MLB | ML | away | 3.5 | 1.13 | -101 | 1 | 1 | 2 | 2 | -24 | 0.00 | W | +1.1u |
| 2026-05-11 | MLB | ML | home | 3.5 | 1.13 | -156 | 1 | 1 | 2 | 1 | -22 | 0.00 | W | +0.7u |
| 2026-05-11 | NBA | TOTAL | under | 4.5 | 2.00 | -110 | 1 | 2 | 3 | 0 | 9 | 0.00 | L | -2.0u |
| 2026-05-11 | NHL | TOTAL | under | 4.5 | 1.27 | -110 | 2 | 0 | 2 | 2 | 8 | 0.00 | L | -1.3u |
| 2026-05-12 | MLB | ML | away | 5.0 | 4.50 | +108 | 4 | 0 | 4 | 2 | 4 | -0.20 | L | -4.5u |
| 2026-05-12 | MLB | TOTAL | under | 4.0 | 0.64 | -110 | 2 | 1 | 3 | 2 | 3 | 0.00 | L | -0.6u |
| 2026-05-12 | MLB | ML | away | 4.5 | 3.00 | +129 | 3 | 0 | 3 | 1 | 26 | -1.00 | L | -3.0u |
| 2026-05-12 | MLB | ML | home | 5.0 | 3.00 | +108 | 3 | 0 | 3 | 2 | 3 | -0.50 | L | -3.0u |
| 2026-05-12 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 6 | 4 | 10 | 6 | 35 | -0.70 | L | -3.5u |
| 2026-05-13 | MLB | ML | home | 4.5 | 4.50 | -116 | 1 | 1 | 2 | 1 | -22 | -1.30 | W | +3.7u |
| 2026-05-13 | MLB | SPREAD | home | 5.0 | 3.50 | -105 | 1 | 1 | 2 | 2 | -23 | 0.90 | W | +3.2u |
| 2026-05-13 | MLB | TOTAL | under | 4.0 | 0.96 | -110 | 1 | 1 | 2 | 2 | -32 | 0.00 | W | +0.9u |
| 2026-05-13 | MLB | TOTAL | under | 5.0 | 3.50 | -110 | 4 | 2 | 6 | 4 | -29 | 0.00 | L | -3.5u |
| 2026-05-13 | NBA | ML | home | 5.0 | 4.50 | -162 | 6 | 0 | 6 | 3 | -25 | -1.00 | L | -4.5u |
| 2026-05-13 | NBA | TOTAL | over | 5.0 | 3.50 | -101 | 3 | 2 | 5 | 4 | 3 | 0.00 | W | +3.4u |
| 2026-05-14 | MLB | ML | home | 5.0 | 4.50 | -103 | 4 | 1 | 5 | 1 | 0 | -0.40 | L | -4.5u |
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 2 | 4 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | -1 | 0.00 | L | -0.5u |
| 2026-05-14 | NHL | TOTAL | under | 5.0 | 3.50 | -110 | 3 | 1 | 4 | 2 | 4 | 0.00 | L | -3.5u |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 0 | 1 | 1 | 4 | 9 | 0.00 | W | +1.7u |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 1 | 1 | 2 | 2 | -20 | 0.00 | W | +0.3u |
| 2026-05-15 | MLB | ML | home | 4.0 | 2.50 | +128 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -2.5u |
| 2026-05-15 | MLB | ML | away | 4.0 | 2.75 | -211 | 2 | 1 | 3 | 1 | 26 | -0.90 | W | +1.3u |
| 2026-05-15 | MLB | ML | away | 3.0 | 1.25 | +115 | 0 | 1 | 1 | -1 | -26 | -1.10 | L | -1.3u |
| 2026-05-15 | NBA | ML | away | 2.5 | 0.50 | +145 | 6 | 1 | 7 | 6 | 22 | -0.50 | W | +0.8u |
| 2026-05-15 | NBA | TOTAL | over | 4.0 | 0.75 | -109 | 0 | 1 | 1 | 2 | -14 | 0.00 | L | -0.8u |
| 2026-05-15 | NBA | SPREAD | home | 2.5 | 1.00 | -105 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -1.0u |
| 2026-05-15 | NBA | TOTAL | over | 5.0 | 2.00 | -110 | 1 | 0 | 1 | 3 | 3 | 0.00 | W | +1.9u |
| 2026-05-16 | MLB | ML | away | 5.0 | 4.50 | +124 | 3 | 1 | 4 | 4 | -21 | -1.30 | W | +1.4u |
| 2026-05-16 | MLB | SPREAD | away | 4.0 | 1.65 | -175 | 2 | 0 | 2 | 2 | 3 | 0.00 | W | +0.9u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +119 | 2 | 1 | 3 | 1 | -22 | -2.00 | L | -2.5u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +115 | 3 | 2 | 5 | 2 | 3 | -1.10 | W | +2.8u |
| 2026-05-16 | MLB | TOTAL | over | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | -22 | 0.00 | L | -1.6u |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.50 | -102 | 1 | 0 | 1 | 1 | -58 | 0.00 | W | +0.5u |
| 2026-05-17 | MLB | ML | away | 4.0 | 2.75 | -148 | 1 | 0 | 1 | 2 | 4 | -0.70 | W | +1.9u |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.50 | +139 | 0 | 1 | 1 | 0 | -48 | 0.70 | L | -0.5u |
| 2026-05-17 | MLB | ML | away | 5.0 | 5.00 | -129 | 3 | 1 | 4 | 1 | -22 | 0.40 | L | -5.0u |
| 2026-05-17 | MLB | ML | home | 4.0 | 2.75 | -114 | 3 | 1 | 4 | 4 | -15 | 2.20 | W | +2.4u |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 1 | 3 | 2 | -23 | 0.00 | W | +2.0u |
| 2026-05-17 | MLB | TOTAL | over | 5.0 | 2.50 | +107 | 2 | 2 | 4 | 1 | -22 | 0.00 | L | -2.5u |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | 10 | 0.00 | W | +0.3u |
| 2026-05-17 | NBA | ML | away | 3.0 | 1.25 | +165 | 3 | 1 | 4 | 2 | 6 | -0.60 | W | +0.8u |
| 2026-05-17 | NBA | TOTAL | under | 5.0 | 0.75 | -110 | 2 | 3 | 5 | 1 | 18 | 0.00 | L | -0.8u |
| 2026-05-18 | MLB | ML | home | 4.5 | 5.00 | -111 | 2 | 1 | 3 | 2 | 4 | -1.10 | W | +4.4u |
| 2026-05-18 | MLB | ML | away | 4.0 | 2.50 | +120 | 2 | 0 | 2 | 1 | -22 | -2.10 | L | -2.5u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | -118 | 2 | 0 | 2 | 1 | -22 | 1.00 | W | +1.1u |
| 2026-05-18 | MLB | ML | home | 4.0 | 2.75 | -150 | 2 | 0 | 2 | 1 | 26 | -0.80 | L | -2.8u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | +132 | 2 | 0 | 2 | 2 | -3 | 0.40 | W | +1.6u |
| 2026-05-18 | NBA | ML | home | 5.0 | 5.00 | -240 | 3 | 2 | 5 | 4 | 17 | -1.60 | L | -5.0u |
| 2026-05-18 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 1 | 2 | 0 | 14 | 0.20 | L | -1.0u |
| 2026-05-18 | NHL | ML | home | 5.0 | 5.00 | -112 | 2 | 2 | 4 | 2 | 5 | -1.10 | L | -5.0u |
| 2026-05-18 | NHL | TOTAL | under | 4.5 | 2.25 | -110 | 3 | 1 | 4 | 1 | 6 | 0.00 | W | +2.0u |
| 2026-05-19 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 1 | -25 | -1.30 | L | -2.5u |
| 2026-05-19 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | 4 | 0.00 | W | +1.5u |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.50 | +105 | 1 | 1 | 2 | 2 | -24 | -0.90 | L | -2.5u |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 1 | 1 | 2 | 0 | -21 | -1.20 | W | +1.2u |
| 2026-05-19 | NBA | ML | home | 5.0 | 5.00 | -260 | 0 | 3 | 3 | 3 | 12 | -0.50 | W | +1.9u |
| 2026-05-19 | NBA | SPREAD | away | 5.0 | 2.25 | -105 | 3 | 2 | 5 | 2 | -3 | -0.90 | L | -2.3u |
| 2026-05-19 | NBA | TOTAL | under | 5.0 | 3.00 | -106 | 2 | 3 | 5 | 2 | 6 | 0.00 | L | -3.0u |
| 2026-05-20 | MLB | ML | away | 5.0 | 2.50 | +113 | 2 | 1 | 3 | 1 | -22 | -1.00 | L | -2.5u |
| 2026-05-20 | MLB | ML | home | 4.0 | 2.75 | -154 | 2 | 0 | 2 | 1 | 26 | -1.50 | W | +1.9u |
| 2026-05-20 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | -22 | 0.00 | L | -0.8u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | -140 | 1 | 1 | 2 | 1 | -22 | -1.10 | W | +0.9u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | +111 | 0 | 1 | 1 | -1 | -26 | 0.00 | W | +0.6u |
| 2026-05-20 | MLB | ML | away | 4.0 | 2.75 | +113 | 1 | 1 | 2 | 0 | -48 | -1.00 | L | -2.8u |
| 2026-05-20 | NBA | ML | home | 5.0 | 5.00 | -225 | 10 | 5 | 15 | 2 | 14 | -0.20 | W | +2.1u |
| 2026-05-20 | NBA | SPREAD | home | 5.0 | 3.00 | -106 | 6 | 1 | 7 | 4 | 41 | -0.70 | W | +2.7u |
| 2026-05-20 | NBA | TOTAL | over | 5.0 | 1.65 | -112 | 3 | 1 | 4 | 3 | 39 | 0.00 | W | +1.5u |
| 2026-05-20 | NHL | ML | home | 2.5 | 1.25 | -192 | 0 | 1 | 1 | 1 | -1 | -0.80 | L | -1.3u |
| 2026-05-21 | MLB | ML | home | 5.0 | 2.50 | +125 | 1 | 1 | 2 | 2 | -24 | -0.40 | L | -2.5u |
| 2026-05-21 | MLB | SPREAD | home | 3.0 | 0.75 | -148 | 0 | 0 | 0 | 1 | -22 | -1.50 | L | -0.8u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +172 | 2 | 0 | 2 | 1 | -22 | -0.50 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 4.5 | 2.75 | -110 | 2 | 1 | 3 | 1 | -22 | -0.50 | W | +2.5u |
| 2026-05-21 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 0 | 0 | 2 | -6 | 0.00 | W | +0.3u |
| 2026-05-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 3 | 1 | 4 | 2 | -23 | -0.40 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +129 | 1 | 0 | 1 | 3 | -46 | -0.40 | W | +1.6u |
| 2026-05-21 | MLB | SPREAD | away | 4.0 | 1.65 | -170 | 1 | 1 | 2 | 1 | -1 | 0.30 | W | +1.0u |
| 2026-05-21 | NBA | SPREAD | away | 5.0 | 3.00 | -110 | 4 | 2 | 6 | 3 | 15 | 0.70 | L | -3.0u |
| 2026-05-21 | NHL | ML | home | 4.0 | 2.75 | -197 | 4 | 1 | 5 | 1 | 6 | -1.30 | L | -2.8u |
| 2026-05-21 | NHL | TOTAL | over | 3.0 | 0.75 | +103 | 1 | 0 | 1 | 1 | 6 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 5.0 | 1.25 | -175 | 1 | 0 | 1 | 1 | 26 | -0.90 | L | -1.3u |
| 2026-05-22 | MLB | ML | home | 4.0 | 1.25 | -195 | 3 | 0 | 3 | 0 | 0 | 0.80 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 3.0 | 1.25 | -137 | 1 | 0 | 1 | 1 | -5 | 0.00 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -144 | 4 | 2 | 6 | 2 | 4 | -1.60 | L | -5.0u |
| 2026-05-22 | MLB | SPREAD | home | 5.0 | 0.75 | -155 | 2 | 0 | 2 | 1 | -22 | -0.30 | W | +0.4u |
| 2026-05-22 | MLB | ML | home | 5.0 | 2.75 | -158 | 1 | 0 | 1 | 1 | 26 | -0.80 | W | +1.7u |
| 2026-05-22 | MLB | SPREAD | home | 3.0 | 0.75 | -142 | 1 | 0 | 1 | 1 | -22 | -2.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -145 | 2 | 2 | 4 | 1 | 26 | -2.20 | L | -5.0u |
| 2026-05-22 | MLB | ML | home | 2.5 | 0.50 | +139 | 2 | 1 | 3 | 0 | -27 | -0.90 | W | +0.7u |
| 2026-05-22 | MLB | SPREAD | home | 4.0 | 1.65 | -119 | 1 | 1 | 2 | 1 | -22 | -1.20 | W | +1.3u |
| 2026-05-22 | MLB | ML | away | 5.0 | 1.50 | +185 | 3 | 0 | 3 | 2 | -24 | -1.10 | L | -1.5u |
| 2026-05-22 | MLB | SPREAD | away | 3.0 | 0.75 | -112 | 1 | 0 | 1 | 1 | -22 | -1.40 | W | +0.6u |
| 2026-05-22 | NBA | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | -3 | -31 | 0.00 | L | -5.0u |
| 2026-05-22 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 0 | 1 | -2 | 3 | -0.50 | L | -1.0u |
| 2026-05-22 | NBA | TOTAL | over | 5.0 | 0.75 | +101 | 2 | 1 | 3 | 1 | 11 | 0.00 | W | +0.7u |
| 2026-05-22 | NHL | ML | home | 4.5 | 3.75 | -167 | 4 | 3 | 7 | 3 | 4 | 0.00 | L | -3.8u |
| 2026-05-22 | NHL | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 1 | 4 | 1 | -2 | 0.00 | W | +2.5u |
| 2026-05-23 | MLB | ML | home | 2.5 | 0.50 | -181 | 1 | 0 | 1 | 2 | 16 | -1.70 | W | +0.3u |
| 2026-05-23 | MLB | ML | away | 2.5 | 2.75 | +109 | 2 | 0 | 2 | 2 | -15 | -0.50 | L | -2.8u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -110 | 0 | 1 | 1 | 0 | 7 | 0.00 | W | +0.3u |
| 2026-05-23 | MLB | ML | home | 5.0 | 1.00 | -148 | 0 | 0 | 0 | 1 | -5 | -0.20 | L | -1.0u |
| 2026-05-23 | MLB | SPREAD | away | 3.0 | 0.75 | -163 | 1 | 0 | 1 | 1 | -22 | 0.00 | W | +0.5u |
| 2026-05-23 | MLB | TOTAL | under | 5.0 | 3.00 | -110 | 3 | 1 | 4 | 2 | -20 | 0.00 | W | +2.7u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | -10 | -0.90 | L | -0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 1 | 3 | 1 | -22 | 0.00 | L | -0.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 1.50 | -209 | 0 | 0 | 0 | 2 | -32 | 29.00 | W | +2.5u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | +102 | 0 | 0 | 0 | 1 | -10 | 0.00 | W | +0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -22 | 0.00 | W | +0.7u |
| 2026-05-23 | MLB | ML | away | 2.5 | 1.25 | -111 | -1 | 1 | 0 | 1 | -12 | 0.40 | L | -1.3u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -135 | 0 | 0 | 0 | 1 | -10 | 0.40 | W | +0.6u |
| 2026-05-23 | MLB | TOTAL | under | 2.5 | 0.30 | +108 | 0 | 0 | 0 | 0 | -16 | 0.00 | P | +0.0u |
| 2026-05-23 | MLB | ML | home | 4.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | -6 | 1.10 | W | +2.9u |
| 2026-05-23 | MLB | ML | away | 3.0 | 1.25 | +166 | 2 | 1 | 3 | 2 | -15 | -0.30 | W | +1.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 2.25 | -123 | 1 | 0 | 1 | 2 | -11 | -0.90 | W | +1.6u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -111 | 1 | 0 | 1 | 0 | -14 | 0.00 | L | -0.3u |
| 2026-05-23 | NBA | SPREAD | home | 5.0 | 3.00 | -107 | 5 | 1 | 6 | 2 | 22 | 0.20 | L | -3.0u |
| 2026-05-23 | NBA | TOTAL | under | 5.0 | 3.00 | +102 | 1 | -1 | 0 | 6 | 5 | 0.00 | L | -3.0u |
| 2026-05-23 | NHL | ML | home | 5.0 | 5.00 | -205 | 8 | 0 | 8 | 4 | 9 | -0.70 | W | +2.4u |
| 2026-05-23 | NHL | TOTAL | under | 3.0 | 0.30 | -110 | 1 | 1 | 2 | 0 | 2 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | home | 4.5 | 3.75 | -101 | 2 | 1 | 3 | 2 | -23 | 0.00 | L | -3.8u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -189 | 1 | 0 | 1 | 1 | 26 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 1 | 0 | 1 | 2 | 19 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 1 | 2 | 0 | -4 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | 1 | -1 | 0.00 | W | +4.3u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 0 | 1 | 1 | 5 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 2.5 | 0.50 | +144 | 1 | 1 | 2 | -1 | -47 | 0.00 | L | -0.5u |
| 2026-05-24 | MLB | SPREAD | home | 4.0 | 1.65 | -110 | 2 | 1 | 3 | 2 | -32 | -1.30 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -107 | 1 | 0 | 1 | 1 | 6 | 0.00 | W | +1.2u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 1.00 | -101 | 1 | 1 | 2 | 1 | -10 | 0.00 | W | +0.0u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 0.30 | -104 | 0 | 0 | 0 | 1 | 20 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | away | 4.0 | 1.25 | +148 | 2 | 2 | 4 | 0 | 5 | -1.40 | W | +1.9u |
| 2026-05-24 | MLB | ML | away | 3.0 | 1.25 | -122 | -1 | 1 | 0 | 0 | -26 | -1.10 | L | -1.3u |
| 2026-05-24 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 2 | -23 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | SPREAD | home | 3.0 | 0.75 | +134 | 1 | 0 | 1 | 1 | -19 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | -21 | 0.00 | W | +0.7u |
| 2026-05-24 | NBA | SPREAD | away | 5.0 | 1.65 | -103 | 3 | 0 | 3 | 1 | 2 | 0.50 | L | -1.6u |
| 2026-05-24 | NBA | TOTAL | over | 4.5 | 3.00 | -107 | 2 | 1 | 3 | 2 | -15 | 0.00 | L | -3.0u |
| 2026-05-24 | NHL | ML | away | 4.0 | 2.75 | -136 | 3 | 0 | 3 | 1 | 4 | -0.70 | L | -2.8u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -149 | 1 | 0 | 1 | 3 | 11 | -0.70 | L | -5.0u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -310 | 2 | 0 | 2 | 1 | 26 | -1.20 | W | +1.6u |
| 2026-05-25 | MLB | TOTAL | over | 4.0 | 1.65 | +103 | 1 | 0 | 1 | 2 | -5 | 0.00 | L | -1.6u |
| 2026-05-25 | MLB | ML | home | 4.0 | 1.25 | -125 | 1 | -1 | 0 | 1 | -14 | -1.90 | L | -1.3u |
| 2026-05-25 | MLB | SPREAD | away | 4.0 | 1.65 | -184 | 1 | 0 | 1 | 1 | -1 | 28.40 | W | +2.4u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 2.25 | -112 | 4 | 0 | 4 | 4 | -22 | 0.00 | L | -2.3u |
| 2026-05-25 | MLB | ML | home | 5.0 | 1.25 | -160 | 3 | 0 | 3 | 2 | -27 | -1.10 | L | -1.3u |
| 2026-05-25 | MLB | TOTAL | over | 5.0 | 3.00 | -110 | 3 | 0 | 3 | 3 | 1 | 0.00 | W | +2.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 3.75 | -108 | 0 | 0 | 0 | 3 | -37 | -1.70 | L | -3.8u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -124 | 2 | 0 | 2 | 2 | -32 | -1.30 | W | +0.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 5.00 | -119 | 2 | -1 | 1 | 4 | -21 | -0.60 | W | +3.1u |
| 2026-05-25 | MLB | ML | away | 2.5 | 2.75 | -113 | 0 | 0 | 0 | 0 | 13 | -1.80 | W | +1.1u |
| 2026-05-25 | MLB | ML | home | 4.0 | 5.00 | -209 | -1 | 0 | -1 | 3 | 11 | -0.80 | W | +2.3u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 0.75 | -101 | 2 | 1 | 3 | 1 | 15 | 0.00 | W | +0.7u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -178 | 1 | 0 | 1 | 2 | -32 | -1.60 | W | +0.9u |
| 2026-05-25 | NBA | ML | away | 5.0 | 5.00 | -125 | 0 | 0 | 0 | 3 | 42 | -0.40 | W | +4.0u |
| 2026-05-25 | NBA | TOTAL | under | 5.0 | 3.00 | -110 | 2 | 2 | 4 | -1 | 2 | 0.00 | L | -3.0u |
| 2026-05-25 | NHL | ML | home | 5.0 | 2.50 | +120 | 8 | 4 | 12 | 1 | -4 | -0.60 | L | -2.5u |
| 2026-05-25 | NHL | SPREAD | home | 4.5 | 2.25 | -215 | 1 | 1 | 2 | 1 | 1 | -0.80 | W | +1.1u |
| 2026-05-26 | MLB | TOTAL | over | 5.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | -32 | 0.00 | W | +1.5u |
| 2026-05-26 | MLB | ML | away | 5.0 | 1.50 | +200 | 2 | 0 | 2 | 2 | -24 | -1.00 | L | -1.5u |
| 2026-05-26 | MLB | SPREAD | away | 5.0 | 1.00 | -101 | 2 | 1 | 3 | 2 | -32 | 0.50 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 2.5 | 1.25 | +113 | 0 | 0 | 0 | 0 | 36 | -1.50 | W | +1.4u |
| 2026-05-26 | MLB | ML | home | 2.5 | 1.25 | -130 | 1 | 0 | 1 | 0 | 36 | -1.30 | W | +1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -200 | 1 | 0 | 1 | 2 | 16 | -0.60 | W | +1.9u |
| 2026-05-26 | MLB | SPREAD | home | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 2 | -5 | -0.20 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -102 | 3 | 1 | 4 | 3 | -2 | -0.50 | W | +4.9u |
| 2026-05-26 | MLB | ML | home | 5.0 | 3.75 | -108 | 3 | 1 | 4 | 3 | -7 | -0.20 | L | -3.8u |
| 2026-05-26 | MLB | ML | home | 5.0 | 5.00 | -105 | 2 | 1 | 3 | 2 | 16 | -2.00 | W | +3.6u |
| 2026-05-26 | MLB | ML | away | 5.0 | 2.50 | +116 | 1 | 0 | 1 | 2 | 16 | -1.00 | W | +2.9u |
| 2026-05-26 | NBA | ML | home | 5.0 | 5.00 | -198 | 2 | 4 | 6 | 3 | 10 | -0.70 | W | +1.9u |
| 2026-05-26 | NBA | SPREAD | home | 5.0 | 1.00 | -110 | 2 | 2 | 4 | 1 | 25 | 1.20 | W | +0.0u |
| 2026-05-26 | NBA | TOTAL | over | 5.0 | 3.00 | -108 | 0 | 0 | 0 | 3 | 1 | 0.00 | W | +2.6u |
| 2026-05-26 | NHL | SPREAD | home | 5.0 | 2.25 | -250 | 2 | 0 | 2 | 2 | 1 | 0.80 | W | +0.9u |
| 2026-05-27 | MLB | ML | home | 4.5 | 0.50 | -102 | 3 | 1 | 4 | 3 | 27 | -1.10 | W | +0.4u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 2.50 | +141 | 1 | 1 | 2 | 4 | -28 | 0.80 | L | -2.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.00 | +105 | 2 | 0 | 2 | 2 | -32 | 0.00 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 4.5 | 3.75 | -420 | 1 | 1 | 2 | 1 | 26 | -0.50 | W | +0.7u |
| 2026-05-27 | MLB | ML | home | 3.0 | 1.25 | -144 | -1 | -1 | -2 | 0 | -4 | -1.00 | L | -1.3u |
| 2026-05-27 | MLB | ML | away | 5.0 | 0.50 | -102 | 3 | 0 | 3 | 2 | 18 | -1.00 | L | -0.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | -10 | 0.40 | W | +0.5u |
| 2026-05-27 | MLB | TOTAL | under | 5.0 | 1.00 | -112 | 3 | 1 | 4 | 3 | -9 | 0.00 | W | +0.0u |
| 2026-05-27 | MLB | ML | away | 4.0 | 1.00 | -108 | 1 | -1 | 0 | 0 | 37 | -0.90 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 5.0 | 0.50 | +132 | 2 | 0 | 2 | 2 | -22 | -0.50 | L | -0.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.65 | +104 | 2 | 0 | 2 | 2 | -5 | 0.00 | W | +1.7u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 0.75 | +104 | 2 | 0 | 2 | 2 | -4 | 0.00 | W | +0.8u |
| 2026-05-27 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 2 | 5 | 3 | -12 | -0.30 | L | -2.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.5 | 1.65 | -145 | 1 | 1 | 2 | 1 | -10 | -0.30 | W | +1.1u |
| 2026-05-27 | MLB | ML | away | 5.0 | 5.00 | -126 | 2 | 0 | 2 | 2 | -9 | -4.10 | L | -5.0u |
| 2026-05-27 | MLB | ML | home | 4.0 | 1.25 | -190 | 1 | 0 | 1 | 1 | 26 | -0.70 | W | +0.7u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 3.00 | -135 | 0 | 0 | 0 | 3 | -6 | -0.90 | W | +2.2u |
| 2026-05-27 | NHL | SPREAD | home | 5.0 | 1.00 | -194 | 3 | 0 | 3 | 2 | 1 | 0.00 | L | -1.0u |
| 2026-05-27 | NHL | TOTAL | over | 5.0 | 2.25 | -112 | 3 | 0 | 3 | 1 | -1 | 0.00 | L | -2.3u |
| 2026-05-28 | MLB | TOTAL | over | 5.0 | 3.00 | +101 | 3 | -1 | 2 | 3 | 23 | 0.00 | W | +2.5u |
| 2026-05-28 | MLB | ML | home | 5.0 | 1.25 | -140 | 2 | 0 | 2 | 2 | -23 | -0.50 | L | -1.3u |
| 2026-05-28 | MLB | TOTAL | under | 5.0 | 1.00 | -107 | 1 | 0 | 1 | 1 | 26 | 0.00 | W | +0.0u |
| 2026-05-28 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 1 | 4 | 2 | -63 | -0.60 | L | -2.5u |
| 2026-05-28 | MLB | TOTAL | over | 2.5 | 1.65 | -108 | 2 | 0 | 2 | 2 | -32 | 0.00 | L | -1.6u |
| 2026-05-28 | NBA | SPREAD | away | 5.0 | 1.00 | -110 | 1 | 2 | 3 | 0 | 1 | -0.90 | L | -1.0u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.50 | +118 | 5 | 1 | 6 | 5 | -12 | -0.90 | L | -2.5u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 0.75 | -135 | 2 | 0 | 2 | 1 | -13 | 1.00 | L | -0.8u |
| 2026-05-29 | MLB | ML | home | 5.0 | 3.75 | -124 | 2 | 1 | 3 | 3 | -6 | -1.00 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 1.65 | -106 | 2 | 0 | 2 | 3 | -4 | 0.00 | L | -1.6u |
| 2026-05-29 | MLB | ML | home | 4.0 | 2.50 | +120 | 1 | 0 | 1 | 1 | -2 | 0.40 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 2.25 | -112 | 2 | 0 | 2 | 3 | 6 | 0.00 | W | +2.0u |
| 2026-05-29 | MLB | SPREAD | away | 4.0 | 0.75 | +150 | 0 | 0 | 0 | 1 | -10 | -0.50 | L | -0.8u |
| 2026-05-29 | MLB | ML | away | 5.0 | 2.50 | +140 | 2 | 1 | 3 | 1 | -16 | 1.00 | L | -2.5u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 1.65 | -103 | 0 | 0 | 0 | 2 | -32 | 0.00 | W | +1.6u |
| 2026-05-29 | MLB | ML | away | 4.5 | 1.25 | -142 | 0 | 1 | 1 | -1 | 7 | -1.20 | W | +0.3u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 1.65 | -135 | 1 | 0 | 1 | 2 | -32 | 0.40 | W | +1.2u |
| 2026-05-29 | MLB | ML | home | 4.5 | 1.25 | -134 | 1 | 0 | 1 | 0 | 7 | -1.70 | W | +2.8u |
| 2026-05-29 | MLB | SPREAD | away | 5.0 | 2.25 | -184 | 0 | 0 | 0 | 2 | -6 | -1.00 | W | +1.2u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 0.75 | -109 | 1 | 0 | 1 | 2 | -4 | 0.00 | W | +0.7u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.75 | -106 | 2 | 1 | 3 | 2 | 45 | 0.70 | L | -2.8u |
| 2026-05-29 | MLB | SPREAD | home | 4.0 | 1.65 | -175 | 0 | 0 | 0 | 2 | -32 | -0.80 | L | -1.6u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 0.30 | +105 | 2 | 1 | 3 | 1 | 19 | 0.00 | W | +0.3u |
| 2026-05-29 | MLB | ML | home | 4.5 | 3.75 | -122 | 0 | 1 | 1 | 1 | -27 | -0.60 | L | -3.8u |
| 2026-05-29 | MLB | TOTAL | over | 3.0 | 1.00 | -108 | 0 | 0 | 0 | 1 | -10 | 0.00 | W | +1.5u |
| 2026-05-29 | NHL | ML | away | 5.0 | 1.00 | +205 | 3 | 0 | 3 | 1 | -1 | -0.60 | L | -1.0u |
| 2026-05-29 | NHL | SPREAD | away | 5.0 | 3.00 | -118 | 3 | 1 | 4 | 1 | -4 | 0.00 | L | -3.0u |
| 2026-05-29 | NHL | TOTAL | under | 5.0 | 2.25 | -106 | 2 | 0 | 2 | 2 | -4 | 0.00 | L | -2.3u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +132 | 2 | 1 | 3 | 2 | -23 | 0.00 | L | -2.5u |
| 2026-05-30 | MLB | ML | away | 4.5 | 2.75 | -125 | 1 | 2 | 3 | 1 | 10 | -0.60 | W | +2.3u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -130 | 1 | 0 | 1 | 2 | -6 | -1.20 | L | -5.0u |
| 2026-05-30 | MLB | ML | away | 4.0 | 3.75 | -132 | 1 | 1 | 2 | 1 | 47 | -1.00 | W | +2.9u |
| 2026-05-30 | MLB | SPREAD | home | 3.0 | 0.75 | -143 | 0 | 1 | 1 | 0 | 9 | -1.40 | L | -0.8u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -118 | 1 | 1 | 2 | 1 | -13 | -1.30 | L | -3.8u |
| 2026-05-30 | MLB | SPREAD | away | 4.0 | 1.00 | +152 | 1 | 0 | 1 | 1 | -10 | 0.20 | L | -1.0u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | 3 | -37 | -1.10 | W | +4.2u |
| 2026-05-30 | MLB | TOTAL | over | 4.5 | 0.75 | +100 | 1 | 1 | 2 | 1 | 14 | 0.00 | W | +0.8u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.75 | -130 | 0 | 1 | 1 | 0 | 36 | -1.60 | W | +0.4u |
| 2026-05-30 | MLB | TOTAL | over | 4.0 | 2.25 | -116 | 2 | 0 | 2 | 2 | -11 | 0.00 | W | +1.9u |
| 2026-05-30 | MLB | TOTAL | under | 4.0 | 1.65 | -107 | 1 | 0 | 1 | 1 | -1 | 0.00 | L | -1.6u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.50 | +129 | 1 | 0 | 1 | 1 | -22 | -0.90 | W | +0.7u |
| 2026-05-30 | MLB | SPREAD | home | 5.0 | 1.65 | -120 | 2 | 1 | 3 | 2 | -32 | -0.60 | W | +1.4u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +108 | 1 | 0 | 1 | 3 | -37 | -0.90 | W | +2.7u |
| 2026-05-30 | MLB | ML | home | 4.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | -22 | -0.20 | W | +0.6u |
| 2026-05-30 | MLB | ML | home | 5.0 | 1.25 | -102 | 2 | 0 | 2 | 2 | 4 | -0.70 | W | +1.2u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -122 | 1 | 1 | 2 | 2 | -15 | -0.20 | L | -3.8u |
| 2026-05-30 | MLB | TOTAL | under | 3.0 | 0.75 | -108 | 0 | 0 | 0 | 1 | -10 | 0.00 | L | -0.8u |
| 2026-05-30 | NBA | ML | home | 5.0 | 1.00 | -154 | 3 | 3 | 6 | 1 | -3 | 0.00 | L | -1.0u |
| 2026-05-30 | NBA | TOTAL | under | 5.0 | 2.50 | -109 | 5 | 0 | 5 | 6 | 16 | 0.00 | L | -2.5u |
| 2026-05-31 | MLB | ML | away | 3.0 | 2.75 | -125 | -2 | 0 | -2 | 1 | -14 | -1.20 | L | -2.8u |
| 2026-05-31 | MLB | TOTAL | under | 5.0 | 1.65 | -114 | 2 | 0 | 2 | 3 | -26 | 0.00 | L | -1.6u |
| 2026-05-31 | MLB | ML | home | 2.5 | 2.75 | -115 | 1 | 1 | 2 | 1 | 17 | 0.00 | W | +2.4u |
| 2026-05-31 | MLB | ML | away | 5.0 | 1.00 | +115 | -1 | 0 | -1 | 2 | -15 | -0.60 | L | -1.0u |
| 2026-05-31 | MLB | SPREAD | away | 5.0 | 1.00 | -117 | 3 | 1 | 4 | 3 | -27 | -0.20 | L | -1.0u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -164 | 0 | 1 | 1 | 2 | -15 | -1.20 | W | +2.3u |
| 2026-05-31 | MLB | ML | away | 3.0 | 1.25 | -184 | 0 | 0 | 0 | 0 | 5 | -1.70 | W | +0.7u |
| 2026-05-31 | MLB | ML | home | 2.5 | 1.25 | -232 | 0 | 0 | 0 | 1 | 18 | -0.50 | W | +0.5u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -102 | 0 | 1 | 1 | 2 | -42 | 0.20 | W | +4.9u |
| 2026-05-31 | MLB | TOTAL | over | 4.0 | 1.00 | +101 | 2 | 1 | 3 | 2 | -11 | 0.00 | L | -1.0u |
| 2026-05-31 | MLB | ML | away | 4.5 | 2.50 | +110 | 0 | 0 | 0 | 0 | 5 | -1.10 | L | -2.5u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._