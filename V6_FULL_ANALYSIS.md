# Sharp Intel v6 — Full Analysis

_Auto-generated **5/25/2026, 11:44:54 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 302 shipped+graded picks · 2026-04-18 → 2026-05-24  (HC analyses scoped to post-cutover 2026-04-30, 190 picks)
**Headline:** 145-154-3 · WR 48.5% [42.9%–54.1%] vs 52.4% break-even · -15.5u flat (-5.1%) · -67.3u peak.
**Overall t-test:** t = -0.87 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.102 ~ p<.10**  (full sample, N=296)
- **ρ(HC, flat ROI) = 0.004 ✗**  (post-cutover, N=190)
- **ρ(Δw+HC, flat ROI) = -0.015 ✗**  (post-cutover, N=190)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)** — N=31, 11-20, WR 35.5% [21%–53%], flat ROI -34.9% (t=-2.15 ✓ p<.05)
- **Stale Δw ≤ 0 (full sample)** — N=58, 20-36, WR 35.7% [24%–49%], flat ROI -31.7% (t=-2.66 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=22, WR 36.4%, flat ROI -30.5%. Bayesian posterior WR ≈ 40.6%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=92, WR 55.4%, flat ROI +10.0%. Bayesian posterior WR ≈ 54.9%, half-Kelly = **2.6%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=31, WR 35.5%, flat ROI -34.9%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=62, WR 53.2%, flat ROI +10.9%. Bayesian posterior WR ≈ 52.8%, half-Kelly = **0.4%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -31.7% flat ROI on 58 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.02u/pick), we need **~1611 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 302. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-24 |
| Sides scanned | 653 |
| Shipped + graded | **302** |
| W-L-P | 145-154-3 |
| Win rate | **48.5%** [42.9%–54.1%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +3.9 pp |
| Peak-units PnL | **-67.3u** |
| Flat-1u PnL | **-15.5u** (-5.1% flat ROI) |
| Flat t-statistic vs zero | -0.87 → ✗ noise |
| Flat 95% CI per-pick | [-0.167, 0.064]u |

### Power note

At our observed flat-PnL standard deviation (1.02u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4474 |
| +5% | 1611 |
| +10% | 403 |

We have **302** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 9 | 1-8-0 | 11.1% [2–44] | -77.1% | -8.1u | -3.37 ✓ p<.01 |
| Δw = 0 | 48 | 19-27-2 | 41.3% [28–56] | -21.8% | -18.0u | -1.63 ✗ noise |
| Δw = +1 | 104 | 58-45-1 | 56.3% [47–65] | +6.4% | +8.3u | 0.69 ✗ noise |
| Δw = +2 | 72 | 30-42-0 | 41.7% [31–53] | -15.8% | -37.5u | -1.31 ✗ noise |
| Δw ≥ +3 | 62 | 33-29-0 | 53.2% [41–65] | +10.9% | -15.5u | 0.71 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.096** ~ p<.10  ·  **ρ(Δw, flat ROI) = 0.102** ~ p<.10  (N=296)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -6.5u | 0.00 ✗ noise |
| HC = 0 | 73 | 35-36-2 | 49.3% [38–61] | -8.6% | -21.3u | -0.79 ✗ noise |
| HC = +1 | 92 | 51-41-0 | 55.4% [45–65] | +10.0% | -2.2u | 0.95 ✗ noise |
| HC = +2 | 16 | 6-10-0 | 37.5% [18–61] | -22.2% | -19.7u | -0.85 ✗ noise |
| HC ≥ +3 | 6 | 2-4-0 | 33.3% [10–70] | -52.8% | -7.0u | -1.77 ~ p<.10 |

**Pearson ρ(HC, WIN) = 0.010** ✗  ·  **ρ(HC, flat ROI) = 0.004** ✗  (N=190)

Spearman rank ρ(HC, flat ROI) = 0.057.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 15 | 5-9-1 | 35.7% [16–61] | -32.6% | -12.2u | -1.43 ✗ noise |
| Σ = +1 | 46 | 25-20-1 | 55.6% [41–69] | +5.6% | +6.4u | 0.40 ✗ noise |
| Σ = +2 | 57 | 33-24-0 | 57.9% [45–70] | +9.9% | +0.4u | 0.78 ✗ noise |
| Σ = +3 | 29 | 10-19-0 | 34.5% [20–53] | -29.0% | -21.5u | -1.51 ✗ noise |
| Σ = +4 | 19 | 11-8-0 | 57.9% [36–77] | +16.2% | -8.4u | 0.67 ✗ noise |
| Σ = +5 | 11 | 4-7-0 | 36.4% [15–65] | -27.1% | -9.9u | -0.89 ✗ noise |
| Σ ≥ +6 | 13 | 6-7-0 | 46.2% [23–71] | -13.6% | -11.6u | -0.49 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = -0.003** ✗  ·  **ρ(Σ, flat ROI) = -0.015** ✗  (N=190)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 190.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.009 ✗ | -0.021 ✗ | -0.044 | weak |
| HC margin | 0.010 ✗ | 0.004 ✗ | 0.057 | weak |
| Δw + HC | -0.003 ✗ | -0.015 ✗ | -0.005 | weak |
| peak.stars | -0.124 ~ p<.10 | -0.157 ✓ p<.05 | -0.167 | weak |
| vault.star | -0.045 ✗ | -0.049 ✗ | -0.084 | weak |
| lock.stars | -0.081 ✗ | -0.109 ✗ | -0.108 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 190 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | N=11 · 5-5 · 50% [24–76] · -8%  | N=33 · 19-13 · 59% [42–74] · +10%  | N=19 · 9-10 · 47% [27–68] · -12%  | N=10 · 2-8 · 20% [6–51] · -66% ✗ |
| +1 | — | — | N=3 · 0-3 · 0% [0–56] · -100%  | N=13 · 6-7 · 46% [23–71] · -7%  | N=36 · 24-12 · 67% [50–80] · +28%  | N=21 · 9-12 · 43% [24–63] · -9%  | N=19 · 12-7 · 63% [41–81] · +26%  |
| +2 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=5 · 1-4 · 20% [4–62] · -50%  | N=10 · 5-5 · 50% [24–76] · -0%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | — | N=2 · 0-2 · 0% [0–66] · —  | N=3 · 1-2 · 33% [6–79] · -52%  |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -6.5u | 0.00 ✗ noise |
| HC = 0 | 73 | 35-36-2 | 49.3% [38–61] | -8.6% | -21.3u | -0.79 ✗ noise |
| HC = +1 | 92 | 51-41-0 | 55.4% [45–65] | +10.0% | -2.2u | 0.95 ✗ noise |
| HC = +2 | 16 | 6-10-0 | 37.5% [18–61] | -22.2% | -19.7u | -0.85 ✗ noise |
| HC ≥ +3 | 6 | 2-4-0 | 33.3% [10–70] | -52.8% | -7.0u | -1.77 ~ p<.10 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -3.6u | 0.00 ✗ noise |
| Δw = 0 | 25 | 12-12-1 | 50.0% [31–69] | -5.6% | -4.6u | -0.29 ✗ noise |
| Δw = +1 | 71 | 43-27-1 | 61.4% [50–72] | +16.0% | +12.9u | 1.45 ✗ noise |
| Δw = +2 | 47 | 19-28-0 | 40.4% [28–55] | -18.3% | -33.8u | -1.21 ✗ noise |
| Δw ≥ +3 | 44 | 20-24-0 | 45.5% [32–60] | -11.7% | -27.6u | -0.78 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 114 | 59-55-0 | 51.8% [43–61] | +2.2% | -28.9u | 0.23 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 31 | 11-20-0 | 35.5% [21–53] | -34.9% | -26.6u | -2.15 ✓ p<.05 |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 45 | 24-19-2 | 55.8% [41–70] | +3.5% | -1.2u | 0.25 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 278 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 5 | 1-4-0 | 20.0% [4–62] | -51.0% | -6.8u | -1.04 ✗ noise |
| Δcount = −1 | 13 | 4-9-0 | 30.8% [13–58] | -39.6% | -7.1u | -1.51 ✗ noise |
| Δcount = 0 (balanced) | 25 | 8-16-1 | 33.3% [18–53] | -36.1% | -14.9u | -1.98 ✓ p<.05 |
| Δcount = +1 | 115 | 56-57-2 | 49.6% [41–59] | -7.1% | -21.2u | -0.81 ✗ noise |
| Δcount = +2 | 73 | 34-39-0 | 46.6% [36–58] | -7.1% | -15.9u | -0.59 ✗ noise |
| Δcount ≥ +3 (heavy support) | 47 | 33-14-0 | 70.2% [56–81] | +47.0% | +13.4u | 2.72 ✓ p<.01 |

**ρ(Δcount, WIN) = 0.204** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.221** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -6 · ≤ -2 · ≤ 3 · ≤ 10 · > 10

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 90 | 32-57-1 | 36.0% [27–46] | -29.0% | -58.8u | -2.87 ✓ p<.01 |
| Q2 | 25 | 13-12-0 | 52.0% [33–70] | -0.2% | +5.9u | -0.01 ✗ noise |
| Q3 (balanced) | 57 | 29-27-1 | 51.8% [39–64] | +2.5% | -6.9u | 0.19 ✗ noise |
| Q4 | 51 | 27-24-0 | 52.9% [40–66] | -1.0% | -13.8u | -0.07 ✗ noise |
| Q5 (best — heavy support) | 55 | 35-19-1 | 64.8% [51–76] | +31.2% | +21.1u | 2.00 ✓ p<.05 |

**ρ(ΔWlNet, WIN) = 0.225** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.220** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -3.89 · ≤ -1.68 · ≤ 2.24 · ≤ 8.47 · > 8.47

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 56 | 16-39-1 | 29.1% [19–42] | -45.0% | -50.4u | -3.91 ✓ p<.01 |
| Q2 | 56 | 21-35-0 | 37.5% [26–51] | -29.1% | -27.9u | -2.34 ✓ p<.05 |
| Q3 | 58 | 31-26-1 | 54.4% [42–67] | +6.1% | -1.7u | 0.47 ✗ noise |
| Q4 | 53 | 33-20-0 | 62.3% [49–74] | +20.8% | -0.7u | 1.55 ✗ noise |
| Q5 | 55 | 35-19-1 | 64.8% [51–76] | +34.3% | +28.1u | 2.17 ✓ p<.05 |

**ρ(ΔFlatPnl, WIN) = 0.281** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.322** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -12.7 · ≤ -2.6 · ≤ 6.7 · ≤ 20.6 · > 20.6

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 56 | 12-42-2 | 22.2% [13–35] | -53.0% | -49.8u | -4.47 ✓ p<.01 |
| Q2 | 56 | 27-29-0 | 48.2% [36–61] | -7.1% | -13.3u | -0.53 ✗ noise |
| Q3 | 55 | 23-32-0 | 41.8% [30–55] | -19.6% | -29.6u | -1.49 ✗ noise |
| Q4 | 56 | 30-25-1 | 54.5% [42–67] | +3.1% | -7.2u | 0.24 ✗ noise |
| Q5 | 55 | 44-11-0 | 80.0% [68–88] | +63.0% | +47.5u | 4.65 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.351** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.367** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 24 | 2-21-1 | 8.7% [2–27] | -81.3% | -25.3u | -7.60 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 15 | 6-9-0 | 40.0% [20–64] | -9.9% | -12.3u | -0.33 ✗ noise |
| ΔBestRank = 0 (tied) | 1 | 1-0-0 | 100.0% [21–100] | +90.9% | +0.3u | 0.00 ✗ n<2 |
| ΔBestRank ∈ [+1,+4] | 16 | 7-9-0 | 43.8% [23–67] | -10.4% | -6.8u | -0.35 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 42 | 26-15-1 | 63.4% [48–76] | +34.8% | +13.3u | 1.83 ~ p<.10 |

**ρ(ΔBestRank, WIN) = 0.475** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.510** ✓ p<.01  (N=98)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 19 | 3-16-0 | 15.8% [6–38] | -62.1% | -18.5u | -2.68 ✓ p<.01 |
| Δshare ∈ [−30,−10] pp | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -5.5u | 0.00 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 199 | 91-106-2 | 46.2% [39–53] | -10.9% | -76.0u | -1.57 ✗ noise |
| Δshare ∈ [+10,+30] pp | 14 | 11-3-0 | 78.6% [52–92] | +46.4% | +12.8u | 2.12 ✓ p<.05 |
| Δshare ≥ +30 pp | 43 | 31-11-1 | 73.8% [59–85] | +50.8% | +34.7u | 2.96 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.259** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.240** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.351 ✓ p<.01 | 0.367 ✓ p<.01 | 0.334 |
| 2 | **ΔTopQCount** | 0.318 ✓ p<.01 | 0.361 ✓ p<.01 | 0.308 |
| 3 | **ΔFlatPnl** | 0.281 ✓ p<.01 | 0.322 ✓ p<.01 | 0.282 |
| 4 | **ΔTopQShare** | 0.259 ✓ p<.01 | 0.240 ✓ p<.01 | 0.275 |
| 5 | **Δcount** | 0.204 ✓ p<.01 | 0.221 ✓ p<.01 | 0.197 |
| 6 | **ΔWlNet** | 0.225 ✓ p<.01 | 0.220 ✓ p<.01 | 0.182 |

_(ΔBestRank uses N=98 subset where both sides had a proven wallet — ρ(flat ROI) = 0.510 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 565, dateRange = 2026-04-18 → 2026-05-24, computedAt = 2026-05-25T15:41:33.029Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **278** rows · PIT aggregate computable on **275** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **275** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 0 · — · — | 0 · — · — | — |
| NEUTRAL (0..+3) | 182 · 57% · +10.9% | 177 · 49% · -6.7% | -17.7pp |
| WEAK (−3..0) | 81 · 33% · -34.8% | 86 · 51% · +4.2% | +39.0pp |
| FADE (<−3) | 0 · — · — | 0 · — · — | — |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=150, WR=57%, ROI=+12.0% | N=143, WR=48%, ROI=-10.1% | -22.1pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=182, WR=57%, ROI=+10.9% | N=177, WR=49%, ROI=-6.7% | -17.7pp |
| AGS < −1 (mute veto) | N=24, WR=29%, ROI=-43.1% | N=47, WR=47%, ROI=+1.3% | +44.4pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-11 → 2026-05-24, N=136)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 0 · — · — |
| NEUTRAL (0..+3) | 86 · 48% · -9.7% |
| WEAK (−3..0) | 50 · 51% · -1.9% |
| FADE (<−3) | 0 · — · — |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=72, WR=44%, ROI=-15.7% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=86, WR=48%, ROI=-9.7% |
| AGS < −1 (mute veto) | N=34, WR=50%, ROI=-3.9% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.12 | 1.49 |
| `dHcSizeRatio` | INTENSITY_HC | + | 1.05 | 5.44 |
| `dSumRankNorm` | QUALITY_RANK | − | 62.12 | 90.68 |
| `dWinnerCtPreA` | QUALITY_TRACK | − | 0.70 | 1.29 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **275/302** shipped+graded rows (91%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -1.07 |
| 20th pct | -0.15 |
| 40th pct | 0.05 |
| Median | 0.14 |
| 60th pct | 0.23 |
| 80th pct | 0.43 |
| 90th pct | 0.61 |
| Max | 1.74 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 53 | 19.3% |
| **LOCK** | +5..+7 | 61 | 22.2% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 26 | 9.5% |
| **FADE** | < −3 | 51 | 18.5% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 53 | 28-25-0 | 52.8% [40–66] | -2.7% | -14.5u | -0.20 ✗ noise |
| LOCK | 61 | 24-37-0 | 39.3% [28–52] | -25.4% | -35.4u | -2.08 ✓ p<.05 |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 26 | 14-11-1 | 56.0% [37–73] | +9.4% | +3.2u | 0.49 ✗ noise |
| FADE | 51 | 22-27-2 | 44.9% [32–59] | -2.7% | -15.2u | -0.16 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.017** ✗ · r(ROI) = **-0.033** ✗ · Spearman ρ(ROI) = **-0.044**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 33 | 17-15-1 | 53.1% [36–69] | +17.8% | -10.2u | 0.78 ✗ noise |
| z ∈ [−1, 0) | 105 | 54-49-2 | 52.4% [43–62] | -0.2% | +0.1u | -0.03 ✗ noise |
| z ∈ [0, +1) | 88 | 35-53-0 | 39.8% [30–50] | -22.7% | -46.7u | -2.19 ✓ p<.05 |
| z ≥ +1 (very positive) | 49 | 25-24-0 | 51.0% [37–64] | -4.4% | -10.9u | -0.32 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 241 | 116-122-3 | 48.7% [42–55] | -6.4% | -64.8u | -1.02 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dSumRankNorm` (QUALITY_RANK)

r(WIN) = **-0.016** ✗ · r(ROI) = **-0.036** ✗ · Spearman ρ(ROI) = **-0.041**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 41 | 21-19-1 | 52.5% [37–67] | -6.4% | -13.3u | -0.45 ✗ noise |
| z ∈ [−1, 0) | 73 | 38-34-1 | 52.8% [41–64] | +10.0% | -12.7u | 0.74 ✗ noise |
| z ∈ [0, +1) | 124 | 54-69-1 | 43.9% [35–53] | -14.1% | -39.7u | -1.59 ✗ noise |
| z ≥ +1 (very positive) | 37 | 18-19-0 | 48.6% [33–64] | -9.9% | -2.1u | -0.63 ✗ noise |

#### `dWinnerCtPreA` (QUALITY_TRACK)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 241 | 116-122-3 | 48.7% [42–55] | -6.4% | -64.8u | -1.02 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dCount` | COUNT | 0.017 ✗ | -0.033 ✗ | -0.044 |
| 2 | `dSumRankNorm` | QUALITY_RANK | -0.016 ✗ | -0.036 ✗ | -0.041 |
| 3 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |
| 4 | `dWinnerCtPreA` | QUALITY_TRACK | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | +0.145 | 0.766 | 48.8% | meaningful |
| 2 | `dSumRankNorm` | +0.068 | 0.713 | 45.4% | meaningful |
| 3 | `dWinnerCtPreA` | -0.067 | 0.067 | 4.3% | silent (<0.2) |
| 4 | `dHcSizeRatio` | -0.024 | 0.024 | 1.5% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcSizeRatio` | `dSumRankNorm` | `dWinnerCtPreA` |
|---|---|---|---|---|
| `dCount` | 1.000 | +0.153 | +0.681 | +0.153 |
| `dHcSizeRatio` | +0.153 | 1.000 | +0.123 | +1.000 ⚠ |
| `dSumRankNorm` | +0.681 | +0.123 | 1.000 | +0.123 |
| `dWinnerCtPreA` | +0.153 | +1.000 ⚠ | +0.123 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **-0.031**. At AGS ≥ +0.12 fires N=151, WR=46.4%, ROI=-12.3%. At AGS ≥ +null fires N=187, WR=47.6%, ROI=-9.7%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-151 ROI (matched cohort) | Top-151 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.041 | +0.009 | WR=52%, ROI=+2.0% | -14.4pp | N=109, WR=53%, ROI=+5.7% |
| `dHcSizeRatio` | -0.008 | −0.023 | WR=50%, ROI=-5.2% | -7.2pp | N=147, WR=51%, ROI=-3.9% |
| `dSumRankNorm` | -0.049 | +0.018 | WR=42%, ROI=-18.5% | +6.2pp | N=145, WR=44%, ROI=-15.2% |
| `dWinnerCtPreA` | -0.008 | −0.023 | WR=49%, ROI=-6.7% | -5.7pp | N=132, WR=50%, ROI=-6.4% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dWinnerCtPreA` | −0.023 | -5.7pp | carries marginal info |
| 2 | `dHcSizeRatio` | −0.023 | -7.2pp | carries marginal info |
| 3 | `dCount` | +0.009 | -14.4pp | redundant — other features cover it |
| 4 | `dSumRankNorm` | +0.018 | +6.2pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.080 | 0.080 | negative ↓ |
| 2 | `dCount` | COUNT | +0.048 | 0.048 | flat ≈ 0 |
| 3 | `dWinnerCtPreA` | QUALITY_TRACK | +0.042 | 0.042 | flat ≈ 0 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | +0.015 | 0.015 | flat ≈ 0 |

Intercept b = -0.093 · Final log-loss = 0.6911 · N = 275.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dCount` | COUNT | #1 | #1 | #3 | #2 | 1.75 |
| 2 | `dSumRankNorm` | QUALITY_RANK | #2 | #2 | #4 | #1 | 2.25 |
| 3 | `dWinnerCtPreA` | QUALITY_TRACK | #4 | #3 | #1 | #3 | 2.75 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | #3 | #4 | #2 | #4 | 3.25 |

#### Plain-English summary

- **Workhorse**: `dCount` (COUNT) — ranks #1/#1/#3/#2 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dHcSizeRatio` (INTENSITY_HC) — composite avg rank 3.25. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dHcSizeRatio` ↔ `dWinnerCtPreA` (r=+1.00). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dWinnerCtPreA`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **v9 simplification candidate**: only `dHcSizeRatio`, `dWinnerCtPreA` carry marginal info (Spearman ρ drop > 0.01 when removed). The other 4 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=275 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 275 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/275 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 87 | 38-49-0 | 43.7% [34–54] | -21.5% | -56.7u | -2.17 ✓ p<.05 |
| 4.5★ | 27 | 16-11-0 | 59.3% [41–75] | +17.4% | +8.5u | 0.84 ✗ noise |
| 4.0★ | 52 | 23-28-1 | 45.1% [32–59] | -11.4% | -11.8u | -0.82 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 46 | 23-22-1 | 51.1% [37–65] | +3.0% | -1.3u | 0.20 ✗ noise |
| 2.5★ | 52 | 26-25-1 | 51.0% [38–64] | -0.7% | -9.9u | -0.05 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 6/33%/-55% | 3/67%/+12% | 6/0%/-100% | 6/33%/-26% | 15/36%/-31% | 21/40%/-20% |
| Δw = +1 | 9/56%/-4% | 6/50%/-6% | 21/60%/+16% | 28/54%/+4% | 17/59%/+11% | 22/55%/+0% |
| Δw = +2 | 28/32%/-37% | 9/56%/+7% | 20/45%/-11% | — | 9/44%/-3% | 6/50%/+12% |
| Δw ≥ +3 | 42/48%/-14% | 6/67%/+58% | 5/40%/-24% | 3/67%/+156% | 5/80%/+86% | 1/100%/+145% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 11 | 7-4-0 | 63.6% [35–85] | -9.5% | +4.2u | -0.44 ✗ noise |
| −200/−151 | 27 | 12-15-0 | 44.4% [28–63] | -28.8% | -17.5u | -1.85 ~ p<.10 |
| −150/−101 | 176 | 86-89-1 | 49.1% [42–56] | -6.6% | -27.3u | -0.92 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 65 | 29-34-2 | 46.0% [34–58] | +1.6% | -30.5u | 0.12 ✗ noise |
| +151/+200 | 7 | 4-3-0 | 57.1% [25–84] | +55.6% | +1.9u | 1.01 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -30% (6) | — | +47% (1) | +7% (4) |
| −200/−151 | -100% (7) | +27% (10) | +22% (4) | -100% (5) |
| −150/−101 | -26% (32) | +15% (66) | -37% (42) | +4% (33) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +16% (10) | -24% (24) | +11% (20) | +27% (11) |
| +151/+200 | — | +160% (1) | +88% (3) | +32% (2) |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 159 | 73-86-0 | 45.9% [38–54] | -8.0% | -64.9u | -0.92 ✗ noise |
| SPREAD | 53 | 23-29-1 | 44.2% [32–58] | -18.2% | -3.8u | -1.44 ✗ noise |
| TOTAL | 90 | 49-39-2 | 55.7% [45–66] | +7.5% | +1.4u | 0.75 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=27 · 22% · -59% | N=51 · 57% · +7% | N=38 · 42% · -10% | N=40 · 50% · +9% |
| SPREAD | N=14 · 31% · -42% | N=18 · 44% · -19% | N=10 · 60% · +9% | N=10 · 40% · -22% |
| TOTAL | N=17 · 63% · +20% | N=35 · 62% · +19% | N=24 · 33% · -35% | N=12 · 75% · +45% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 155 | 74-80-1 | 48.1% [40–56] | -7.7% | -36.2u | -0.99 ✗ noise |
| NBA | 112 | 53-58-1 | 47.7% [39–57] | -4.1% | -18.6u | -0.39 ✗ noise |
| NHL | 35 | 18-16-1 | 52.9% [37–69] | +2.9% | -12.5u | 0.17 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=25 · 42% · -18% | N=64 · 56% · +5% | N=45 · 40% · -20% | N=20 · 45% · -10% |
| NBA | N=27 · 27% · -51% | N=27 · 52% · +1% | N=19 · 47% · -3% | N=34 · 59% · +27% |
| NHL | N=6 · 50% · -2% | N=13 · 67% · +23% | N=8 · 38% · -21% | N=8 · 50% · -3% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 154 · 43% · -11.1% · -1.26 ✗ noise | 147 · 53% · +0.1% · 0.01 ✗ noise |
| **plusEV** | 39 · 41% · -16.0% · -0.82 ✗ noise | 262 · 49% · -4.1% · -0.67 ✗ noise |
| **pinnacleConfirms** | 77 · 45% · -6.2% · -0.47 ✗ noise | 133 · 49% · -6.9% · -0.80 ✗ noise |
| **invested10kPlus** | 152 · 45% · -9.0% · -1.02 ✗ noise | 58 · 53% · -0.5% · -0.04 ✗ noise |
| **lineMovingWith** | 160 · 49% · -3.4% · -0.41 ✗ noise | 141 · 48% · -8.2% · -0.97 ✗ noise |
| **predMarketAligns** | 72 · 44% · -9.6% · -0.71 ✗ noise | 138 · 49% · -5.1% · -0.60 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 61 | 36-25-0 | 59.0% [46–70] | +12.2% | +2.6u | 1.00 ✗ noise |
| 1 | 69 | 33-34-2 | 49.3% [38–61] | -8.1% | -12.8u | -0.73 ✗ noise |
| 2 | 76 | 35-40-1 | 46.7% [36–58] | -7.0% | -11.9u | -0.59 ✗ noise |
| 3 | 29 | 12-17-0 | 41.4% [26–59] | -17.0% | -15.6u | -0.87 ✗ noise |
| 4 | 28 | 10-18-0 | 35.7% [21–54] | -28.6% | -18.1u | -1.51 ✗ noise |
| 5 | 30 | 15-15-0 | 50.0% [33–67] | -7.9% | -11.8u | -0.44 ✗ noise |
| 6 | 9 | 4-5-0 | 44.4% [19–73] | +35.6% | +0.4u | 0.55 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 77 | 45-31-1 | 59.2% [48–70] | +12.0% | +15.1u | 1.10 ✗ noise |
| NEAR_START | 115 | 48-65-2 | 42.5% [34–52] | -11.6% | -53.3u | -1.13 ✗ noise |
| NO_MOVE | 9 | 4-5-0 | 44.4% [19–73] | -21.0% | -0.2u | -0.66 ✗ noise |
| PREGAME | 46 | 26-20-0 | 56.5% [42–70] | +5.4% | -0.6u | 0.39 ✗ noise |
| SMALL_MOVE | 53 | 20-33-0 | 37.7% [26–51] | -27.1% | -30.7u | -2.01 ✓ p<.05 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 174 | 86-87-1 | 49.7% [42–57] | -7.1% | -36.5u | -0.98 ✗ noise |
| STRONG | 55 | 28-27-0 | 50.9% [38–64] | +2.6% | -9.6u | 0.18 ✗ noise |
| LEAN | 69 | 29-38-2 | 43.3% [32–55] | -7.3% | -22.6u | -0.51 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.084 ✗ | -0.048 ✗ | -0.069 | -0.83 |
| totalInvested | -0.059 ✗ | -0.073 ✗ | -0.068 | -1.26 |
| evEdge | 0.088 ✗ | 0.062 ✗ | 0.069 | 1.08 |
| moneyPct | 0.048 ✗ | -0.011 ✗ | -0.012 | -0.19 |
| walletPct | 0.086 ✗ | 0.051 ✗ | 0.048 | 0.88 |
| criteriaMet | -0.085 ✗ | -0.045 ✗ | -0.080 | -0.78 |
| maxContribFor | -0.025 ✗ | -0.009 ✗ | 0.018 | -0.16 |
| meanBaseFor | 0.011 ✗ | 0.026 ✗ | 0.058 | 0.44 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **294** picks. Mean CLV = **-0.0020**.
t-statistic vs zero: -1.44 → ✗ noise · 95% CI [-0.0046, 0.0007]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 27 | 13-14-0 | 48.1% [31–66] | -16.8% | -0.3u | -0.98 ✗ noise |
| CLV (−2%, 0] | 156 | 69-85-2 | 44.8% [37–53] | -11.9% | -61.7u | -1.47 ✗ noise |
| CLV (0, +2%] | 92 | 49-43-0 | 53.3% [43–63] | +9.6% | -10.3u | 0.82 ✗ noise |
| CLV > +2% | 19 | 9-9-1 | 50.0% [29–71] | -12.7% | -1.1u | -0.62 ✗ noise |

ρ(CLV, flat ROI) = 0.030 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=191 (with all features non-null). Intercept β₀ = -0.016.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔAvgRoi | +0.376 | ↑ helps |
| 2 | pw.ΔFlatPnl | +0.344 | ↑ helps |
| 3 | sharpCount | -0.308 | ↓ hurts |
| 4 | peak.stars | -0.290 | ↓ hurts |
| 5 | evEdge | +0.272 | ↑ helps |
| 6 | pw.Δcount | +0.257 | ↑ helps |
| 7 | odds (American) | -0.141 | ↓ hurts |
| 8 | pw.ΔWlNet | +0.111 | ↑ helps |
| 9 | walletPct | +0.101 | ↑ helps |
| 10 | log10(invested) | -0.101 | ↓ hurts |
| 11 | log(impliedProb) | +0.100 | ↑ helps |
| 12 | criteriaMet | -0.082 | ↓ hurts |
| 13 | vault.star | +0.077 | ↑ helps |
| 14 | HC margin | +0.066 | ↑ helps |
| 15 | pw.ΔTopQShare | +0.061 | ↑ helps |
| 16 | Δw | -0.030 | ≈ flat |
| 17 | moneyPct | -0.007 | ≈ flat |
| 18 | Δw + HC | +0.004 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 22 | 8-14 | 36.4% | 40.6% | -110 | — (mute) | 3.48u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 92 | 51-41 | 55.4% | 54.9% | -109 | 2.87% bankroll | 1.82u | **UNDER-SIZED** — ship up to 2.87u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 31 | 11-20 | 35.5% | 39.0% | -110 | — (mute) | 1.96u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 62 | 33-29 | 53.2% | 52.8% | -106 | 1.36% bankroll | 2.79u | **OVER-SIZED** — reduce to 1.36u |
| Stale Δw = 0 | 48 | 19-27 | 41.3% | 42.9% | -109 | — (mute) | 1.19u | **MUTE** (negative EV at posterior) |
| Stale Δw ≤ −1 | 10 | 1-9 | 10.0% | 30.0% | -122 | — (mute) | 0.96u | **MUTE** (negative EV at posterior) |

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

**Peak cum PnL:** +7.1u
**Max drawdown:** -74.4u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.332  (annualized × √252 ≈ -5.28)

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
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 1 | 1 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 1 | 2 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 1 | -4 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 1 | 2 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 0 | 4 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 4 | 16 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 2 | -6 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 1 | 2 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | -1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 2 | -6 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | 1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | -1 | -14 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 1 | 10 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 0 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | 1 | -6 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | 0 | -11 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 1 | 4 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 2 | 19 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | 0 | 0 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 1 | -1 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 2 | 1 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 1 | 4 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 2 | 9 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 2 | -8 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | -1 | 8 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 1 | 0 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 2 | -9 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 1 | 0 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | 0 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | 1 | 4 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | 0 | -27 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | -1 | -10 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 1 | -7 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 4 | 19 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 3 | -1 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 1 | -7 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | -2 | -1 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | 0 | -6 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | -1 | 5 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | -1 | 8 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 1 | -8 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 1 | 5 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 3 | 14 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 2 | 3 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -2 | -8 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 1 | 2 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 6 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | 1 | 0 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 14 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 3 | -2 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | -5 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -2 | -1 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 2 | -5 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 4 | 22 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 1 | 27 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 3 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 26 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 1 | 1 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 2 | -14 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 2 | -14 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | 0 | -31 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 3 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 2 | 3 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 1 | 3 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 1 | 2 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | -1 | 6 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | 6 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 2 | -4 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 18 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 33 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | 11 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -7 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 3 | 12 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | -1 | -6 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 1 | -6 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -20 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 4 | 25 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 4 | 26 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 4 | 22 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 1 | 2 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 0 | 0 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 1 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 0 | 0 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | -2 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 4 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 2 | -4 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 6 | 5 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 21 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 1 | 6 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 2 | -2 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 1 | 20 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 0 | -5 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 0 | -3 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 4 | 17 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 4 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | -13 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 1 | -20 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 3 | 12 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 1 | -3 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 1 | -1 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | 8 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 3 | -24 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 16 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 4 | 10 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 2 | -7 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 3 | 26 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | -1 | -6 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 2 | 5 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 18 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 14 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 18 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | 0 | -2 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 40 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 3 | 12 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 2 | -6 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 1 | 6 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 2 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 6 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 5 | 18 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 0 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 21 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 3 | 19 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 0 | 1 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 1 | -2 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 1 | -2 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 2 | 27 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 3 | 30 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 21 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 1 | 1 | -1.30 | L | -1.1u |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.70 | -104 | — | — | — | 2 | 17 | 0.00 | W | +1.6u |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-09 | NBA | ML | away | 5.0 | 4.50 | -364 | 3 | 1 | 4 | 6 | 37 | 0.00 | W | +1.2u |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2.00 | -104 | 2 | 1 | 3 | 2 | 21 | 0.00 | W | +1.9u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -120 | 1 | 1 | 2 | 0 | 2 | 0.00 | W | +0.9u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -6 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -6 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -103 | 1 | 1 | 2 | 1 | -6 | 0.00 | L | -1.1u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -110 | 1 | 1 | 2 | 1 | -6 | 0.00 | W | +1.0u |
| 2026-05-10 | MLB | ML | away | 3.5 | 1.13 | +134 | 0 | 1 | 1 | 1 | -6 | 0.00 | W | +1.5u |
| 2026-05-10 | NBA | ML | home | 4.0 | 1.50 | +160 | 1 | 1 | 2 | 2 | 18 | 0.80 | W | +2.6u |
| 2026-05-10 | NBA | TOTAL | over | 5.0 | 3.50 | -110 | 3 | 2 | 5 | 2 | 22 | 0.00 | W | +3.3u |
| 2026-05-10 | NHL | ML | away | 4.5 | 4.50 | +108 | 2 | 2 | 4 | 2 | 2 | -0.70 | L | -4.5u |
| 2026-05-10 | NHL | TOTAL | under | 5.0 | 1.70 | -110 | 2 | 1 | 3 | 2 | -1 | 0.00 | L | -1.7u |
| 2026-05-11 | MLB | ML | away | 3.5 | 1.13 | -101 | 1 | 1 | 2 | 2 | -6 | 0.00 | W | +1.1u |
| 2026-05-11 | MLB | ML | home | 3.5 | 1.13 | -156 | 1 | 1 | 2 | 0 | 2 | 0.00 | W | +0.7u |
| 2026-05-11 | NBA | TOTAL | under | 4.5 | 2.00 | -110 | 1 | 2 | 3 | 0 | 12 | 0.00 | L | -2.0u |
| 2026-05-11 | NHL | TOTAL | under | 4.5 | 1.27 | -110 | 2 | 0 | 2 | 2 | 7 | 0.00 | L | -1.3u |
| 2026-05-12 | MLB | ML | away | 5.0 | 4.50 | +108 | 4 | 0 | 4 | 2 | 0 | -0.20 | L | -4.5u |
| 2026-05-12 | MLB | TOTAL | under | 4.0 | 0.64 | -110 | 2 | 1 | 3 | 2 | 3 | 0.00 | L | -0.6u |
| 2026-05-12 | MLB | ML | away | 4.5 | 3.00 | +129 | 3 | 0 | 3 | 1 | 6 | -1.00 | L | -3.0u |
| 2026-05-12 | MLB | ML | home | 5.0 | 3.00 | +108 | 3 | 0 | 3 | 2 | 3 | -0.50 | L | -3.0u |
| 2026-05-12 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 6 | 4 | 10 | 6 | 37 | -0.70 | L | -3.5u |
| 2026-05-13 | MLB | ML | home | 4.5 | 4.50 | -116 | 1 | 1 | 2 | 1 | -6 | -1.30 | W | +3.7u |
| 2026-05-13 | MLB | SPREAD | home | 5.0 | 3.50 | -105 | 1 | 1 | 2 | 2 | -8 | 0.90 | W | +3.2u |
| 2026-05-13 | MLB | TOTAL | under | 4.0 | 0.96 | -110 | 1 | 1 | 2 | 2 | -14 | 0.00 | W | +0.9u |
| 2026-05-13 | MLB | TOTAL | under | 5.0 | 3.50 | -110 | 4 | 2 | 6 | 4 | -11 | 0.00 | L | -3.5u |
| 2026-05-13 | NBA | ML | home | 5.0 | 4.50 | -162 | 6 | 0 | 6 | 3 | -21 | -1.00 | L | -4.5u |
| 2026-05-13 | NBA | TOTAL | over | 5.0 | 3.50 | -101 | 3 | 2 | 5 | 4 | 4 | 0.00 | W | +3.4u |
| 2026-05-14 | MLB | ML | home | 5.0 | 4.50 | -103 | 4 | 1 | 5 | 0 | 0 | -0.40 | L | -4.5u |
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 2 | 0 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | -2 | 0.00 | L | -0.5u |
| 2026-05-14 | NHL | TOTAL | under | 5.0 | 3.50 | -110 | 3 | 1 | 4 | 3 | 5 | 0.00 | L | -3.5u |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 0 | 1 | 1 | 4 | 9 | 0.00 | W | +1.7u |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 1 | 1 | 2 | 2 | -4 | 0.00 | W | +0.3u |
| 2026-05-15 | MLB | ML | home | 4.0 | 2.50 | +128 | 0 | 0 | 0 | 1 | 0 | 0.00 | L | -2.5u |
| 2026-05-15 | MLB | ML | away | 4.0 | 2.75 | -211 | 2 | 1 | 3 | 1 | 6 | -0.90 | W | +1.3u |
| 2026-05-15 | MLB | ML | away | 3.0 | 1.25 | +115 | 0 | 1 | 1 | -1 | -6 | -1.10 | L | -1.3u |
| 2026-05-15 | NBA | ML | away | 2.5 | 0.50 | +145 | 6 | 1 | 7 | 6 | 23 | -0.50 | W | +0.8u |
| 2026-05-15 | NBA | TOTAL | over | 4.0 | 0.75 | -109 | 0 | 1 | 1 | 2 | -16 | 0.00 | L | -0.8u |
| 2026-05-15 | NBA | SPREAD | home | 2.5 | 1.00 | -105 | 1 | 0 | 1 | 1 | 20 | 0.00 | L | -1.0u |
| 2026-05-15 | NBA | TOTAL | over | 5.0 | 2.00 | -110 | 1 | 0 | 1 | 3 | 4 | 0.00 | W | +1.9u |
| 2026-05-16 | MLB | ML | away | 5.0 | 4.50 | +124 | 3 | 1 | 4 | 4 | -3 | -1.30 | W | +1.4u |
| 2026-05-16 | MLB | SPREAD | away | 4.0 | 1.65 | -175 | 2 | 0 | 2 | 2 | 3 | 0.00 | W | +0.9u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +119 | 2 | 1 | 3 | 1 | -6 | -2.00 | L | -2.5u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +115 | 3 | 2 | 5 | 2 | 3 | -1.10 | W | +2.8u |
| 2026-05-16 | MLB | TOTAL | over | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | -6 | 0.00 | L | -1.6u |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.50 | -102 | 1 | 0 | 1 | 1 | -20 | 0.00 | W | +0.5u |
| 2026-05-17 | MLB | ML | away | 4.0 | 2.75 | -148 | 1 | 0 | 1 | 2 | 0 | -0.70 | W | +1.9u |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.50 | +139 | 0 | 1 | 1 | 0 | -12 | 0.70 | L | -0.5u |
| 2026-05-17 | MLB | ML | away | 5.0 | 5.00 | -129 | 3 | 1 | 4 | 1 | -6 | 0.40 | L | -5.0u |
| 2026-05-17 | MLB | ML | home | 4.0 | 2.75 | -114 | 3 | 1 | 4 | 4 | 2 | 2.20 | W | +2.4u |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 1 | 3 | 2 | -8 | 0.00 | W | +2.0u |
| 2026-05-17 | MLB | TOTAL | over | 5.0 | 2.50 | +107 | 2 | 2 | 4 | 1 | -6 | 0.00 | L | -2.5u |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | 8 | 0.00 | W | +0.3u |
| 2026-05-17 | NBA | ML | away | 3.0 | 1.25 | +165 | 3 | 1 | 4 | 2 | 6 | -0.60 | W | +0.8u |
| 2026-05-17 | NBA | TOTAL | under | 5.0 | 0.75 | -110 | 2 | 3 | 5 | 1 | 25 | 0.00 | L | -0.8u |
| 2026-05-18 | MLB | ML | home | 4.5 | 5.00 | -111 | 2 | 1 | 3 | 2 | 0 | -1.10 | W | +4.4u |
| 2026-05-18 | MLB | ML | away | 4.0 | 2.50 | +120 | 2 | 0 | 2 | 1 | -6 | -2.10 | L | -2.5u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | -118 | 2 | 0 | 2 | 1 | -6 | 1.00 | W | +1.1u |
| 2026-05-18 | MLB | ML | home | 4.0 | 2.75 | -150 | 2 | 0 | 2 | 1 | 6 | -0.80 | L | -2.8u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | +132 | 2 | 0 | 2 | 2 | 2 | 0.40 | W | +1.6u |
| 2026-05-18 | NBA | ML | home | 5.0 | 5.00 | -240 | 3 | 2 | 5 | 4 | 19 | -1.60 | L | -5.0u |
| 2026-05-18 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 1 | 2 | 0 | 18 | 0.20 | L | -1.0u |
| 2026-05-18 | NHL | ML | home | 5.0 | 5.00 | -112 | 2 | 2 | 4 | 2 | 5 | -1.10 | L | -5.0u |
| 2026-05-18 | NHL | TOTAL | under | 4.5 | 2.25 | -110 | 3 | 1 | 4 | 1 | 6 | 0.00 | W | +2.0u |
| 2026-05-19 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 1 | -7 | -1.30 | L | -2.5u |
| 2026-05-19 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | 5 | 0.00 | W | +1.5u |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.50 | +105 | 1 | 1 | 2 | 2 | -6 | -0.90 | L | -2.5u |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 1 | 1 | 2 | 0 | -4 | -1.20 | W | +1.2u |
| 2026-05-19 | NBA | ML | home | 5.0 | 5.00 | -260 | 0 | 3 | 3 | 3 | 11 | -0.50 | W | +1.9u |
| 2026-05-19 | NBA | SPREAD | away | 5.0 | 2.25 | -105 | 3 | 2 | 5 | 2 | 1 | -0.90 | L | -2.3u |
| 2026-05-19 | NBA | TOTAL | under | 5.0 | 3.00 | -106 | 2 | 3 | 5 | 2 | 11 | 0.00 | L | -3.0u |
| 2026-05-20 | MLB | ML | away | 5.0 | 2.50 | +113 | 2 | 1 | 3 | 1 | -6 | -1.00 | L | -2.5u |
| 2026-05-20 | MLB | ML | home | 4.0 | 2.75 | -154 | 2 | 0 | 2 | 1 | 6 | -1.50 | W | +1.9u |
| 2026-05-20 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | -6 | 0.00 | L | -0.8u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | -140 | 1 | 1 | 2 | 1 | -6 | -1.10 | W | +0.9u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | +111 | 0 | 1 | 1 | -1 | -6 | 0.00 | W | +0.6u |
| 2026-05-20 | MLB | ML | away | 4.0 | 2.75 | +113 | 1 | 1 | 2 | 0 | -12 | -1.00 | L | -2.8u |
| 2026-05-20 | NBA | ML | home | 5.0 | 5.00 | -225 | 10 | 5 | 15 | 2 | 12 | -0.20 | W | +2.1u |
| 2026-05-20 | NBA | SPREAD | home | 5.0 | 3.00 | -106 | 6 | 1 | 7 | 4 | 45 | -0.70 | W | +2.7u |
| 2026-05-20 | NBA | TOTAL | over | 5.0 | 1.65 | -112 | 3 | 1 | 4 | 3 | 46 | 0.00 | W | +1.5u |
| 2026-05-20 | NHL | ML | home | 2.5 | 1.25 | -192 | 0 | 1 | 1 | 1 | -2 | -0.80 | L | -1.3u |
| 2026-05-21 | MLB | ML | home | 5.0 | 2.50 | +125 | 1 | 1 | 2 | 2 | -6 | -0.40 | L | -2.5u |
| 2026-05-21 | MLB | SPREAD | home | 3.0 | 0.75 | -148 | 0 | 0 | 0 | 1 | -6 | -1.50 | L | -0.8u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +172 | 2 | 0 | 2 | 1 | -6 | -0.50 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 4.5 | 2.75 | -110 | 2 | 1 | 3 | 1 | -6 | -0.50 | W | +2.5u |
| 2026-05-21 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 0 | 0 | 1 | 4 | 0.00 | W | +0.3u |
| 2026-05-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 3 | 1 | 4 | 2 | -8 | -0.40 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +129 | 1 | 0 | 1 | 3 | -7 | -0.40 | W | +1.6u |
| 2026-05-21 | MLB | SPREAD | away | 4.0 | 1.65 | -170 | 1 | 1 | 2 | 1 | -2 | 0.30 | W | +1.0u |
| 2026-05-21 | NBA | SPREAD | away | 5.0 | 3.00 | -110 | 4 | 2 | 6 | 3 | 15 | 0.70 | L | -3.0u |
| 2026-05-21 | NHL | ML | home | 4.0 | 2.75 | -197 | 4 | 1 | 5 | 1 | 6 | -1.30 | L | -2.8u |
| 2026-05-21 | NHL | TOTAL | over | 3.0 | 0.75 | +103 | 1 | 0 | 1 | 1 | 6 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 5.0 | 1.25 | -175 | 1 | 0 | 1 | 1 | 6 | -0.90 | L | -1.3u |
| 2026-05-22 | MLB | ML | home | 4.0 | 1.25 | -195 | 3 | 0 | 3 | 0 | 0 | 0.80 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 3.0 | 1.25 | -137 | 1 | 0 | 1 | 0 | -6 | 0.00 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -144 | 4 | 2 | 6 | 2 | 0 | -1.60 | L | -5.0u |
| 2026-05-22 | MLB | SPREAD | home | 5.0 | 0.75 | -155 | 2 | 0 | 2 | 1 | -6 | -0.30 | W | +0.4u |
| 2026-05-22 | MLB | ML | home | 5.0 | 2.75 | -158 | 1 | 0 | 1 | 1 | 6 | -0.80 | W | +1.7u |
| 2026-05-22 | MLB | SPREAD | home | 3.0 | 0.75 | -142 | 1 | 0 | 1 | 1 | -6 | -2.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -145 | 2 | 2 | 4 | 1 | 6 | -2.20 | L | -5.0u |
| 2026-05-22 | MLB | ML | home | 2.5 | 0.50 | +139 | 2 | 1 | 3 | 0 | -8 | -0.90 | W | +0.7u |
| 2026-05-22 | MLB | SPREAD | home | 4.0 | 1.65 | -119 | 1 | 1 | 2 | 1 | -6 | -1.20 | W | +1.3u |
| 2026-05-22 | MLB | ML | away | 5.0 | 1.50 | +185 | 3 | 0 | 3 | 2 | -6 | -1.10 | L | -1.5u |
| 2026-05-22 | MLB | SPREAD | away | 3.0 | 0.75 | -112 | 1 | 0 | 1 | 1 | -6 | -1.40 | W | +0.6u |
| 2026-05-22 | NBA | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | -3 | -34 | 0.00 | L | -5.0u |
| 2026-05-22 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 0 | 1 | -2 | 2 | -0.50 | L | -1.0u |
| 2026-05-22 | NBA | TOTAL | over | 5.0 | 0.75 | +101 | 2 | 1 | 3 | 1 | 12 | 0.00 | W | +0.7u |
| 2026-05-22 | NHL | ML | home | 4.5 | 3.75 | -167 | 4 | 3 | 7 | 3 | 4 | 0.00 | L | -3.8u |
| 2026-05-22 | NHL | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 1 | 4 | 2 | -1 | 0.00 | W | +2.5u |
| 2026-05-23 | MLB | ML | home | 2.5 | 0.50 | -181 | 1 | 0 | 1 | 1 | 6 | -1.70 | W | +0.3u |
| 2026-05-23 | MLB | ML | away | 2.5 | 2.75 | +109 | 2 | 0 | 2 | 2 | -13 | -0.50 | L | -2.8u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -110 | 0 | 1 | 1 | 0 | 9 | 0.00 | W | +0.3u |
| 2026-05-23 | MLB | ML | home | 5.0 | 1.00 | -148 | 0 | 0 | 0 | 1 | -5 | -0.20 | L | -1.0u |
| 2026-05-23 | MLB | SPREAD | away | 3.0 | 0.75 | -163 | 1 | 0 | 1 | 1 | -6 | 0.00 | W | +0.5u |
| 2026-05-23 | MLB | TOTAL | under | 5.0 | 3.00 | -110 | 3 | 1 | 4 | 2 | -4 | 0.00 | W | +2.7u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | -8 | -0.90 | L | -0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 1 | 3 | 1 | -6 | 0.00 | L | -0.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 1.50 | -209 | 0 | 0 | 0 | 2 | -14 | 29.00 | W | +2.5u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | +102 | 0 | 0 | 0 | 1 | -8 | 0.00 | W | +0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -6 | 0.00 | W | +0.7u |
| 2026-05-23 | MLB | ML | away | 2.5 | 1.25 | -111 | -1 | 1 | 0 | 1 | 2 | 0.40 | L | -1.3u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -135 | 0 | 0 | 0 | 1 | -8 | 0.40 | W | +0.6u |
| 2026-05-23 | MLB | TOTAL | under | 2.5 | 0.30 | +108 | 0 | 0 | 0 | 0 | -10 | 0.00 | P | +0.0u |
| 2026-05-23 | MLB | ML | home | 4.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | 4 | 1.10 | W | +2.9u |
| 2026-05-23 | MLB | ML | away | 3.0 | 1.25 | +166 | 2 | 1 | 3 | 2 | 0 | -0.30 | W | +1.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 2.25 | -123 | 1 | 0 | 1 | 2 | -10 | -0.90 | W | +1.6u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -111 | 1 | 0 | 1 | 0 | -13 | 0.00 | L | -0.3u |
| 2026-05-23 | NBA | SPREAD | home | 5.0 | 3.00 | -107 | 5 | 1 | 6 | 2 | 27 | 0.20 | L | -3.0u |
| 2026-05-23 | NBA | TOTAL | under | 5.0 | 3.00 | +102 | 1 | -1 | 0 | 6 | 9 | 0.00 | L | -3.0u |
| 2026-05-23 | NHL | ML | home | 5.0 | 5.00 | -205 | 8 | 0 | 8 | 3 | 12 | -0.70 | W | +2.4u |
| 2026-05-23 | NHL | TOTAL | under | 3.0 | 0.30 | -110 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | home | 4.5 | 3.75 | -101 | 2 | 1 | 3 | 2 | -8 | 0.00 | L | -3.8u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -189 | 1 | 0 | 1 | 1 | 6 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 1 | 0 | 1 | 2 | 13 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 1 | 2 | 1 | -5 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | 1 | -2 | 0.00 | W | +4.3u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | 3 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 0 | 1 | 1 | 3 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 2.5 | 0.50 | +144 | 1 | 1 | 2 | -1 | -13 | 0.00 | L | -0.5u |
| 2026-05-24 | MLB | SPREAD | home | 4.0 | 1.65 | -110 | 2 | 1 | 3 | 2 | -14 | -1.30 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -107 | 1 | 0 | 1 | 1 | 2 | 0.00 | W | +1.2u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 1.00 | -101 | 1 | 1 | 2 | 1 | -8 | 0.00 | W | +0.0u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 0.30 | -104 | 0 | 0 | 0 | 1 | 15 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | away | 4.0 | 1.25 | +148 | 2 | 2 | 4 | 1 | -5 | -1.40 | W | +1.9u |
| 2026-05-24 | MLB | ML | away | 3.0 | 1.25 | -122 | -1 | 1 | 0 | 0 | -18 | -1.10 | L | -1.3u |
| 2026-05-24 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -6 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | SPREAD | home | 3.0 | 0.75 | +134 | 1 | 0 | 1 | 1 | -6 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -6 | 0.00 | W | +0.7u |
| 2026-05-24 | NBA | SPREAD | away | 5.0 | 1.65 | -103 | 3 | 0 | 3 | 1 | 3 | 0.50 | L | -1.6u |
| 2026-05-24 | NBA | TOTAL | over | 4.5 | 3.00 | -107 | 2 | 1 | 3 | 3 | -21 | 0.00 | L | -3.0u |
| 2026-05-24 | NHL | ML | away | 4.0 | 2.75 | -136 | 3 | 0 | 3 | 0 | 4 | -0.70 | L | -2.8u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._