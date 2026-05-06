# Sharp Intel v6 — Full Analysis

_Auto-generated **5/6/2026, 9:22:50 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 139 shipped+graded picks · 2026-04-18 → 2026-05-05  (HC analyses scoped to post-cutover 2026-04-30, 28 picks)
**Headline:** 63-74-2 · WR 46.0% [37.9%–54.3%] vs 52.4% break-even · -11.1u flat (-8.0%) · -21.5u peak.
**Overall t-test:** t = -0.88 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.284 ✓ p<.01**  (full sample, N=134)
- **ρ(HC, flat ROI) = 0.110 ✗**  (post-cutover, N=28)
- **ρ(Δw+HC, flat ROI) = 0.143 ✗**  (post-cutover, N=28)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0 (full sample)** — N=35, 9-25, WR 26.5% [15%–43%], flat ROI -48.6% (t=-3.41 ✓ p<.01)

### Action map

- **Tier-1b (HC = +1)** — N=19, WR 47.4%, flat ROI -4.9%. Bayesian posterior WR ≈ 48.3%, half-Kelly = **0.0%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=3, WR 33.3%, flat ROI -37.4%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=23, WR 65.2%, flat ROI +47.1%. Bayesian posterior WR ≈ 60.6%, half-Kelly = **8.6%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -48.6% flat ROI on 35 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.08u/pick), we need **~1779 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 139. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-05 |
| Sides scanned | 331 |
| Shipped + graded | **139** |
| W-L-P | 63-74-2 |
| Win rate | **46.0%** [37.9%–54.3%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +6.4 pp |
| Peak-units PnL | **-21.5u** |
| Flat-1u PnL | **-11.1u** (-8.0% flat ROI) |
| Flat t-statistic vs zero | -0.88 → ✗ noise |
| Flat 95% CI per-pick | [-0.259, 0.099]u |

### Power note

At our observed flat-PnL standard deviation (1.08u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4941 |
| +5% | 1779 |
| +10% | 445 |

We have **139** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 27 | 8-18-1 | 30.8% [17–50] | -41.1% | -15.0u | -2.45 ✓ p<.05 |
| Δw = +1 | 46 | 23-22-1 | 51.1% [37–65] | -4.0% | -4.6u | -0.29 ✗ noise |
| Δw = +2 | 30 | 13-17-0 | 43.3% [27–61] | -9.8% | -8.9u | -0.50 ✗ noise |
| Δw ≥ +3 | 23 | 15-8-0 | 65.2% [45–81] | +47.1% | +10.7u | 1.57 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.254** ✓ p<.01  ·  **ρ(Δw, flat ROI) = 0.284** ✓ p<.01  (N=134)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 7 | 4-2-1 | 66.7% [30–90] | +22.6% | -0.3u | 0.66 ✗ noise |
| HC = +1 | 19 | 9-10-0 | 47.4% [27–68] | -4.9% | -5.5u | -0.20 ✗ noise |
| HC = +2 | 0 | — | — | — | — | — |
| HC ≥ +3 | 0 | — | — | — | — | — |

**Pearson ρ(HC, WIN) = 0.128** ✗  ·  **ρ(HC, flat ROI) = 0.110** ✗  (N=28)

Spearman rank ρ(HC, flat ROI) = 0.115.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Σ = +1 | 10 | 4-5-1 | 44.4% [19–73] | -13.4% | -1.9u | -0.44 ✗ noise |
| Σ = +2 | 10 | 6-4-0 | 60.0% [31–83] | +10.7% | -3.2u | 0.35 ✗ noise |
| Σ = +3 | 4 | 1-3-0 | 25.0% [5–70] | -25.5% | -5.1u | -0.34 ✗ noise |
| Σ = +4 | 1 | 1-0-0 | 100.0% [21–100] | +98.0% | +3.2u | 0.00 ✗ n<2 |
| Σ = +5 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -4.5u | 0.00 ✗ n<2 |
| Σ ≥ +6 | 1 | 1-0-0 | 100.0% [21–100] | +95.2% | +3.3u | 0.00 ✗ n<2 |

**Pearson ρ(Δw+HC, WIN) = 0.140** ✗  ·  **ρ(Σ, flat ROI) = 0.143** ✗  (N=28)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 28.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.081 ✗ | 0.093 ✗ | 0.097 | weak |
| HC margin | 0.128 ✗ | 0.110 ✗ | 0.115 | weak |
| Δw + HC | 0.140 ✗ | 0.143 ✗ | 0.173 | weak |
| peak.stars | -0.152 ✗ | -0.120 ✗ | -0.072 | weak |
| vault.star | -0.131 ✗ | -0.084 ✗ | -0.047 | weak |
| lock.stars | -0.012 ✗ | 0.076 ✗ | 0.082 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 28 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | — | N=6 · 3-2 · 60% [23–88] · +12%  | N=1 · 1-0 · 100% [21–100] · —  | — |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=4 · 1-3 · 25% [5–70] · -51%  | N=7 · 5-2 · 71% [36–92] · +31%  | N=4 · 1-3 · 25% [5–70] · -26%  | N=3 · 2-1 · 67% [21–94] · +31%  |
| +2 | — | — | — | — | — | — | — |
| ≥ +3 | — | — | — | — | — | — | — |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 7 | 4-2-1 | 66.7% [30–90] | +22.6% | -0.3u | 0.66 ✗ noise |
| HC = +1 | 19 | 9-10-0 | 47.4% [27–68] | -4.9% | -5.5u | -0.20 ✗ noise |
| HC = +2 | 0 | — | — | — | — | — |
| HC ≥ +3 | 0 | — | — | — | — | — |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 4 | 1-3-0 | 25.0% [5–70] | -51.0% | -1.6u | -1.04 ✗ noise |
| Δw = +1 | 13 | 8-4-1 | 66.7% [39–86] | +22.2% | -0.0u | 0.91 ✗ noise |
| Δw = +2 | 5 | 2-3-0 | 40.0% [12–77] | -2.9% | -5.1u | -0.05 ✗ noise |
| Δw ≥ +3 | 5 | 2-3-0 | 40.0% [12–77] | -21.3% | -1.4u | -0.44 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 19 | 9-10-0 | 47.4% [27–68] | -4.9% | -5.5u | -0.20 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 3 | 1-2-0 | 33.3% [6–79] | -37.4% | -3.5u | -0.60 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 6 | 3-2-1 | 60.0% [23–88] | +11.7% | -0.3u | 0.31 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 107 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -1.8u | 0.00 ✗ noise |
| Δcount = −1 | 10 | 2-8-0 | 20.0% [6–51] | -64.2% | -10.7u | -2.65 ✓ p<.01 |
| Δcount = 0 (balanced) | 15 | 3-12-0 | 20.0% [7–45] | -59.1% | -12.4u | -2.67 ✓ p<.01 |
| Δcount = +1 | 35 | 18-17-0 | 51.4% [36–67] | -5.2% | -8.2u | -0.32 ✗ noise |
| Δcount = +2 | 23 | 14-9-0 | 60.9% [41–78] | +16.0% | +8.0u | 0.79 ✗ noise |
| Δcount ≥ +3 (heavy support) | 21 | 15-5-1 | 75.0% [53–89] | +73.8% | +13.9u | 2.41 ✓ p<.05 |

**ρ(Δcount, WIN) = 0.400** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.486** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -2 · ≤ 2 · ≤ 5 · ≤ 8 · > 8

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 24 | 5-19-0 | 20.8% [9–40] | -59.5% | -20.4u | -3.57 ✓ p<.01 |
| Q2 | 22 | 9-13-0 | 40.9% [23–61] | -13.6% | -13.2u | -0.59 ✗ noise |
| Q3 (balanced) | 27 | 15-12-0 | 55.6% [37–72] | +15.6% | +5.9u | 0.62 ✗ noise |
| Q4 | 15 | 8-7-0 | 53.3% [30–75] | +18.1% | +4.8u | 0.55 ✗ noise |
| Q5 (best — heavy support) | 19 | 15-3-1 | 83.3% [61–94] | +49.5% | +11.6u | 2.95 ✓ p<.01 |

**ρ(ΔWlNet, WIN) = 0.370** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.325** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -1.64 · ≤ 2.04 · ≤ 4.49 · ≤ 8.95 · > 8.95

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 22 | 4-18-0 | 18.2% [7–39] | -63.9% | -18.6u | -3.76 ✓ p<.01 |
| Q2 | 21 | 8-13-0 | 38.1% [21–59] | -25.7% | -13.2u | -1.21 ✗ noise |
| Q3 | 22 | 12-10-0 | 54.5% [35–73] | -1.1% | +3.2u | -0.05 ✗ noise |
| Q4 | 21 | 14-7-0 | 66.7% [45–83] | +26.4% | +3.7u | 1.29 ✗ noise |
| Q5 | 21 | 14-6-1 | 70.0% [48–85] | +63.0% | +13.7u | 1.99 ✓ p<.05 |

**ρ(ΔFlatPnl, WIN) = 0.381** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.464** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -17.3 · ≤ 7.9 · ≤ 19.6 · ≤ 28.9 · > 28.9

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 22 | 3-19-0 | 13.6% [5–33] | -70.0% | -22.8u | -4.24 ✓ p<.01 |
| Q2 | 21 | 6-15-0 | 28.6% [14–50] | -37.0% | -13.2u | -1.53 ✗ noise |
| Q3 | 22 | 11-10-1 | 52.4% [32–72] | -6.7% | -5.3u | -0.35 ✗ noise |
| Q4 | 21 | 15-6-0 | 71.4% [50–86] | +36.4% | +6.9u | 1.84 ~ p<.10 |
| Q5 | 21 | 17-4-0 | 81.0% [60–92] | +76.6% | +23.2u | 2.81 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.449** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.431** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 11 | 2-9-0 | 18.2% [5–48] | -58.6% | -8.1u | -2.11 ✓ p<.05 |
| ΔBestRank ∈ [−4,−1] | 7 | 1-6-0 | 14.3% [3–51] | -72.7% | -11.6u | -2.67 ✓ p<.01 |
| ΔBestRank = 0 (tied) | 0 | — | — | — | — | — |
| ΔBestRank ∈ [+1,+4] | 7 | 2-5-0 | 28.6% [8–64] | -47.0% | -5.1u | -1.37 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 12 | 5-6-1 | 45.5% [21–72] | +8.7% | +0.7u | 0.22 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.309** ~ p<.10  ·  **ρ(ΔBestRank, flat ROI) = 0.349** ✓ p<.05  (N=37)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 10 | 2-8-0 | 20.0% [6–51] | -55.1% | -6.1u | -1.83 ~ p<.10 |
| Δshare ∈ [−30,−10] pp | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.0u | 0.00 ✗ n<2 |
| Δshare ≈ 0 (±10 pp) | 64 | 27-36-1 | 42.9% [31–55] | -20.5% | -29.8u | -1.76 ~ p<.10 |
| Δshare ∈ [+10,+30] pp | 2 | 1-1-0 | 50.0% [9–91] | +97.5% | +2.6u | 0.49 ✗ noise |
| Δshare ≥ +30 pp | 30 | 22-8-0 | 73.3% [56–86] | +55.8% | +25.2u | 2.52 ✓ p<.05 |

**ρ(ΔTopQShare, WIN) = 0.280** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.261** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **Δcount** | 0.400 ✓ p<.01 | 0.486 ✓ p<.01 | 0.410 |
| 2 | **ΔFlatPnl** | 0.381 ✓ p<.01 | 0.464 ✓ p<.01 | 0.380 |
| 3 | **ΔTopQCount** | 0.372 ✓ p<.01 | 0.434 ✓ p<.01 | 0.362 |
| 4 | **ΔAvgRoi** | 0.449 ✓ p<.01 | 0.431 ✓ p<.01 | 0.428 |
| 5 | **ΔWlNet** | 0.370 ✓ p<.01 | 0.325 ✓ p<.01 | 0.323 |
| 6 | **ΔTopQShare** | 0.280 ✓ p<.01 | 0.261 ✓ p<.01 | 0.308 |

_(ΔBestRank uses N=37 subset where both sides had a proven wallet — ρ(flat ROI) = 0.349 ✓ p<.05.)_

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 38 | 18-20-0 | 47.4% [32–63] | -16.1% | -11.9u | -1.07 ✗ noise |
| 4.5★ | 9 | 5-4-0 | 55.6% [27–81] | +23.7% | +2.4u | 0.52 ✗ noise |
| 4.0★ | 20 | 10-9-1 | 52.6% [32–73] | +6.5% | -1.7u | 0.28 ✗ noise |
| 3.5★ | 27 | 11-16-0 | 40.7% [25–59] | -6.0% | -1.7u | -0.23 ✗ noise |
| 3.0★ | 17 | 6-10-1 | 37.5% [18–61] | -21.7% | -4.5u | -0.89 ✗ noise |
| 2.5★ | 28 | 13-15-0 | 46.4% [30–64] | -11.1% | -4.1u | -0.60 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 1/0%/-100% | 4/0%/-100% | 5/20%/-58% | 9/38%/-26% | 12/25%/-51% |
| Δw = +1 | 1/100%/+27% | 3/33%/-35% | 11/60%/+15% | 18/44%/-13% | 2/0%/-100% | 10/60%/+9% |
| Δw = +2 | 18/39%/-22% | 1/100%/+91% | 4/75%/+68% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 14/50%/-15% | 2/100%/+181% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | — |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 5 | 4-1-0 | 80.0% [38–96] | +0.5% | +2.6u | 0.02 ✗ noise |
| −300/−201 | 5 | 2-3-0 | 40.0% [12–77] | -46.3% | -1.0u | -1.41 ✗ noise |
| −200/−151 | 11 | 3-8-0 | 27.3% [10–57] | -56.4% | -10.1u | -2.51 ✓ p<.05 |
| −150/−101 | 77 | 37-39-1 | 48.7% [38–60] | -7.6% | -7.8u | -0.71 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 29 | 14-14-1 | 50.0% [33–67] | +8.9% | -2.8u | 0.44 ✗ noise |
| +151/+200 | 2 | 1-1-0 | 50.0% [9–91] | +49.0% | -0.5u | 0.33 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +24% (2) |
| −300/−201 | -67% (4) | — | — | +34% (1) |
| −200/−151 | -100% (5) | +5% (3) | -100% (1) | -100% (1) |
| −150/−101 | -38% (20) | +12% (27) | -27% (18) | +32% (10) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +39% (3) | -27% (13) | +36% (8) | +42% (5) |
| +151/+200 | — | — | +198% (1) | — |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 77 | 34-43-0 | 44.2% [34–55] | -9.3% | -17.3u | -0.70 ✗ noise |
| SPREAD | 25 | 8-16-1 | 33.3% [18–53] | -34.3% | -8.2u | -1.88 ~ p<.10 |
| TOTAL | 37 | 21-15-1 | 58.3% [42–73] | +12.5% | +3.9u | 0.79 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=15 · 13% · -77% | N=24 · 46% · -17% | N=17 · 41% · -9% | N=18 · 67% · +55% |
| SPREAD | N=10 · 22% · -51% | N=7 · 29% · -45% | N=6 · 50% · -4% | N=2 · 50% · -2% |
| TOTAL | N=10 · 50% · -3% | N=15 · 71% · +35% | N=7 · 43% · -17% | N=3 · 67% · +30% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 45 | 18-27-0 | 40.0% [27–55] | -21.8% | -12.4u | -1.50 ✗ noise |
| NBA | 76 | 34-41-1 | 45.3% [35–57] | -7.6% | -13.0u | -0.58 ✗ noise |
| NHL | 18 | 11-6-1 | 64.7% [41–83] | +24.9% | +3.9u | 1.10 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=7 · 14% · -71% | N=18 · 39% · -25% | N=13 · 31% · -37% | N=6 · 83% · +63% |
| NBA | N=24 · 26% · -50% | N=19 · 58% · +10% | N=13 · 46% · -4% | N=16 · 56% · +35% |
| NHL | N=4 · 50% · -0% | N=9 · 63% · +8% | N=4 · 75% · +59% | N=1 · 100% · +145% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 90 · 41% · -14.7% · -1.24 ✗ noise | 49 · 55% · +4.4% · 0.32 ✗ noise |
| **plusEV** | 22 · 32% · -31.1% · -1.08 ✗ noise | 117 · 49% · -3.7% · -0.39 ✗ noise |
| **pinnacleConfirms** | 45 · 49% · +1.2% · 0.06 ✗ noise | 32 · 38% · -23.9% · -1.24 ✗ noise |
| **invested10kPlus** | 71 · 42% · -11.8% · -0.84 ✗ noise | 6 · 67% · +20.8% · 0.50 ✗ noise |
| **lineMovingWith** | 87 · 49% · -2.4% · -0.21 ✗ noise | 52 · 41% · -17.3% · -1.19 ✗ noise |
| **predMarketAligns** | 37 · 51% · +0.7% · 0.03 ✗ noise | 40 · 38% · -18.5% · -1.03 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 8 | 6-2-0 | 75.0% [41–93] | +48.5% | +2.4u | 1.49 ✗ noise |
| 1 | 32 | 13-18-1 | 41.9% [26–59] | -19.9% | -5.8u | -1.20 ✗ noise |
| 2 | 43 | 20-22-1 | 47.6% [33–62] | -0.3% | +1.9u | -0.02 ✗ noise |
| 3 | 18 | 7-11-0 | 38.9% [20–61] | -31.8% | -13.0u | -1.49 ✗ noise |
| 4 | 16 | 5-11-0 | 31.3% [14–56] | -34.9% | -10.6u | -1.39 ✗ noise |
| 5 | 16 | 10-6-0 | 62.5% [39–82] | +4.3% | +3.5u | 0.20 ✗ noise |
| 6 | 6 | 2-4-0 | 33.3% [10–70] | +35.8% | +0.1u | 0.37 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 37 | 22-14-1 | 61.1% [45–75] | +10.6% | +7.6u | 0.70 ✗ noise |
| NEAR_START | 74 | 32-41-1 | 43.8% [33–55] | -6.3% | -11.6u | -0.46 ✗ noise |
| NO_MOVE | 6 | 2-4-0 | 33.3% [10–70] | -36.2% | -1.1u | -0.90 ✗ noise |
| SMALL_MOVE | 21 | 6-15-0 | 28.6% [14–50] | -43.4% | -17.2u | -2.08 ✓ p<.05 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 74 | 33-40-1 | 45.2% [34–57] | -15.3% | -16.1u | -1.40 ✗ noise |
| STRONG | 34 | 16-18-0 | 47.1% [31–63] | -8.6% | -2.5u | -0.50 ✗ noise |
| LEAN | 28 | 13-14-1 | 48.1% [31–66] | +15.0% | -2.6u | 0.55 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.081 ✗ | -0.013 ✗ | -0.065 | -0.16 |
| totalInvested | -0.132 ✗ | -0.119 ✗ | -0.060 | -1.40 |
| evEdge | 0.005 ✗ | 0.014 ✗ | -0.012 | 0.16 |
| moneyPct | -0.003 ✗ | -0.084 ✗ | -0.054 | -0.99 |
| walletPct | 0.067 ✗ | 0.030 ✗ | 0.044 | 0.35 |
| criteriaMet | -0.032 ✗ | -0.007 ✗ | -0.077 | -0.08 |
| maxContribFor | -0.079 ✗ | -0.053 ✗ | -0.034 | -0.62 |
| meanBaseFor | -0.067 ✗ | -0.053 ✗ | -0.035 | -0.62 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **135** picks. Mean CLV = **-0.0030**.
t-statistic vs zero: -2.15 → ✓ p<.05 · 95% CI [-0.0058, -0.0003]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 12 | 5-7-0 | 41.7% [19–68] | -29.3% | -3.5u | -1.15 ✗ noise |
| CLV (−2%, 0] | 75 | 35-38-2 | 47.9% [37–59] | -5.0% | -7.5u | -0.42 ✗ noise |
| CLV (0, +2%] | 37 | 18-19-0 | 48.6% [33–64] | +6.5% | -0.7u | 0.31 ✗ noise |
| CLV > +2% | 11 | 4-7-0 | 36.4% [15–65] | -37.7% | -8.8u | -1.39 ✗ noise |

ρ(CLV, flat ROI) = -0.032 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=28 (with all features non-null). Intercept β₀ = -0.306.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | log10(invested) | -1.122 | ↓ hurts |
| 2 | pw.ΔAvgRoi | +0.789 | ↑ helps |
| 3 | pw.Δcount | +0.672 | ↑ helps |
| 4 | pw.ΔWlNet | +0.612 | ↑ helps |
| 5 | evEdge | +0.581 | ↑ helps |
| 6 | walletPct | -0.561 | ↓ hurts |
| 7 | HC margin | +0.367 | ↑ helps |
| 8 | moneyPct | -0.357 | ↓ hurts |
| 9 | pw.ΔFlatPnl | +0.346 | ↑ helps |
| 10 | sharpCount | -0.267 | ↓ hurts |
| 11 | odds (American) | -0.263 | ↓ hurts |
| 12 | pw.ΔTopQShare | -0.213 | ↓ hurts |
| 13 | log(impliedProb) | +0.178 | ↑ helps |
| 14 | peak.stars | -0.171 | ↓ hurts |
| 15 | vault.star | -0.161 | ↓ hurts |
| 16 | Δw + HC | +0.150 | ↑ helps |
| 17 | criteriaMet | +0.037 | ≈ flat |
| 18 | Δw | -0.026 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 0 | — | — | — | — | — | — | — |
| Tier-1b HC = +1 (post-cutover) | 19 | 9-10 | 47.4% | 48.3% | -105 | — (mute) | 1.60u | **MUTE** (negative EV at posterior) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 3 | 1-2 | 33.3% | 46.2% | -114 | — (mute) | 1.33u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 23 | 15-8 | 65.2% | 60.6% | -105 | 9.62% bankroll | 2.13u | **UNDER-SIZED** — ship up to 9.62u (1u=1% bankroll) |
| Stale Δw = 0 | 27 | 8-18 | 30.8% | 36.1% | -108 | — (mute) | 1.12u | **MUTE** (negative EV at posterior) |
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

**Peak cum PnL:** +7.1u
**Max drawdown:** -28.6u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 2
**Daily Sharpe-like (μ/σ):** -0.320  (annualized × √252 ≈ -5.08)

---

## §14. Per-pick row-level detail (every shipped+graded pick)
_Sortable raw data behind every section. Use to spot-check individual decisions._

| Date | Sport | Mkt | Side | ★ | u | Odds | Δw | HC | Δw+HC | pw.Δcnt | pw.ΔWl | EV | Outcome | Peak PnL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.50 | +105 | 2 | — | — | 2 | 7 | 0.00 | W | +0.5u |
| 2026-04-18 | MLB | ML | away | 4.5 | 2.50 | -155 | — | — | — | — | — | -1.60 | W | +1.6u |
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.50 | -117 | 2 | — | — | 2 | 7 | 0.00 | L | -0.5u |
| 2026-04-18 | MLB | ML | home | 4.5 | 3.00 | -150 | 3 | — | — | 3 | 9 | -0.20 | W | +2.0u |
| 2026-04-18 | NBA | ML | away | 3.5 | 0.50 | +200 | — | — | — | — | — | -0.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.50 | -108 | 0 | — | — | 0 | 0 | -2.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1.00 | -108 | 0 | — | — | -1 | -3 | -1.70 | L | -1.0u |
| 2026-04-18 | NBA | TOTAL | over | 3.0 | 0.75 | -107 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-18 | NBA | TOTAL | under | 5.0 | 2.00 | -104 | — | — | — | — | — | 0.00 | W | +1.9u |
| 2026-04-18 | NBA | ML | home | 5.0 | 3.00 | -360 | — | — | — | — | — | 0.20 | W | +0.8u |
| 2026-04-18 | NBA | TOTAL | under | 4.5 | 1.50 | -105 | — | — | — | — | — | 0.00 | L | -1.5u |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 0 | 0 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 3 | 9 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 2 | 5 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 3 | 9 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 1 | 7 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 3 | 6 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 1 | 2 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 2 | 5 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | 1 | 2 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 1 | 2 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | -1 | -4 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | 0 | -9 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 2 | 8 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 1 | 2 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | -1 | -2 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | -2 | -8 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 0 | 0 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 1 | 8 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | 1 | 2 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 2 | -2 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 2 | 6 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 2 | 9 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 0 | 0 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | 0 | 0 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 0 | 0 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 0 | 0 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 0 | 0 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | 0 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | -1 | -6 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | -3 | -8 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | 0 | -4 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 1 | 2 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 6 | 5 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 3 | 4 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 1 | 2 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | 0 | -3 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | -1 | -3 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | 1 | 0 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | 1 | 3 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 0 | -1 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 2 | 4 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 2 | 5 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 0 | 0 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -2 | -5 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 1 | -1 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 5 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | -1 | -3 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 13 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 2 | 5 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | 4 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | -1 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 1 | 3 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 1 | 21 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 3 | 18 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | -1 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 5 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 1 | 3 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 0 | 0 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 0 | 0 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | -1 | -9 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 3 | 6 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 0 | -6 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 0 | 1 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | 5 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 0 | 0 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 1 | 8 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 3 | 17 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 1 | -1 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 0 | -6 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 1 | 2 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | 0 | -2 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 0 | 0 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | -1 | -8 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 1 | 9 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 4 | 16 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 2 | 14 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 0 | 0 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 1 | 3 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 3 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 0 | 0 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 3 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 0 | -4 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 4 | 5 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 12 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 2 | 8 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 1 | 0 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 0 | 2 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 1 | 3 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 1 | 5 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 2 | 3 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 6 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | 1 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 0 | -17 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 2 | 6 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 0 | 0 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 3 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 0 | 0 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 3 | -9 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 1 | 11 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 4 | 10 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 1 | 3 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 2 | 11 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | 0 | -3 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 0 | 4 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 9 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 6 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 9 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | -1 | -2 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 28 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 4 | 7 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 3 | -3 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 2 | 3 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 3 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 3 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 3 | 7 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 2 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 13 | 0.00 | W | +0.7u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._