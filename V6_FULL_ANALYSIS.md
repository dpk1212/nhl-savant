# Sharp Intel v6 — Full Analysis

_Auto-generated **5/24/2026, 10:19:09 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 282 shipped+graded picks · 2026-04-18 → 2026-05-23  (HC analyses scoped to post-cutover 2026-04-30, 170 picks)
**Headline:** 137-142-3 · WR 49.1% [43.3%–54.9%] vs 52.4% break-even · -11.1u flat (-3.9%) · -56.9u peak.
**Overall t-test:** t = -0.64 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.110 ~ p<.10**  (full sample, N=276)
- **ρ(HC, flat ROI) = -0.011 ✗**  (post-cutover, N=170)
- **ρ(Δw+HC, flat ROI) = -0.021 ✗**  (post-cutover, N=170)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Tier-1a HC ≥ +2 (post-cutover)** — N=21, 7-14, WR 33.3% [17%–55%], flat ROI -39.0% (t=-1.99 ✓ p<.05)
- **Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)** — N=28, 10-18, WR 35.7% [21%–54%], flat ROI -34.8% (t=-2.04 ✓ p<.05)
- **Stale Δw ≤ 0 (full sample)** — N=56, 19-35, WR 35.2% [24%–49%], flat ROI -32.8% (t=-2.72 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=21, WR 33.3%, flat ROI -39.0%. Bayesian posterior WR ≈ 38.7%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=84, WR 58.3%, flat ROI +15.9%. Bayesian posterior WR ≈ 57.4%, half-Kelly = **5.3%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=28, WR 35.7%, flat ROI -34.8%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=60, WR 55.0%, flat ROI +14.6%. Bayesian posterior WR ≈ 54.3%, half-Kelly = **2.0%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -32.8% flat ROI on 56 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.03u/pick), we need **~1620 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 282. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-23 |
| Sides scanned | 615 |
| Shipped + graded | **282** |
| W-L-P | 137-142-3 |
| Win rate | **49.1%** [43.3%–54.9%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +3.3 pp |
| Peak-units PnL | **-56.9u** |
| Flat-1u PnL | **-11.1u** (-3.9% flat ROI) |
| Flat t-statistic vs zero | -0.64 → ✗ noise |
| Flat 95% CI per-pick | [-0.159, 0.080]u |

### Power note

At our observed flat-PnL standard deviation (1.03u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4499 |
| +5% | 1620 |
| +10% | 405 |

We have **282** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 8 | 1-7-0 | 12.5% [2–47] | -74.3% | -6.8u | -2.88 ✓ p<.01 |
| Δw = 0 | 47 | 18-27-2 | 40.0% [27–55] | -24.3% | -18.3u | -1.81 ~ p<.10 |
| Δw = +1 | 93 | 53-39-1 | 57.6% [47–67] | +9.0% | +7.5u | 0.92 ✗ noise |
| Δw = +2 | 67 | 28-39-0 | 41.8% [31–54] | -16.1% | -31.7u | -1.29 ✗ noise |
| Δw ≥ +3 | 60 | 33-27-0 | 55.0% [42–67] | +14.6% | -11.1u | 0.93 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.105** ~ p<.10  ·  **ρ(Δw, flat ROI) = 0.110** ~ p<.10  (N=276)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -6.5u | 0.00 ✗ noise |
| HC = 0 | 62 | 30-30-2 | 50.0% [38–62] | -7.2% | -16.5u | -0.61 ✗ noise |
| HC = +1 | 84 | 49-35-0 | 58.3% [48–68] | +15.9% | +5.3u | 1.44 ✗ noise |
| HC = +2 | 15 | 5-10-0 | 33.3% [15–58] | -33.5% | -21.6u | -1.33 ✗ noise |
| HC ≥ +3 | 6 | 2-4-0 | 33.3% [10–70] | -52.8% | -7.0u | -1.77 ~ p<.10 |

**Pearson ρ(HC, WIN) = 0.003** ✗  ·  **ρ(HC, flat ROI) = -0.011** ✗  (N=170)

Spearman rank ρ(HC, flat ROI) = 0.047.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 13 | 4-8-1 | 33.3% [14–61] | -37.3% | -11.3u | -1.57 ✗ noise |
| Σ = +1 | 39 | 22-16-1 | 57.9% [42–72] | +10.8% | +7.8u | 0.70 ✗ noise |
| Σ = +2 | 52 | 30-22-0 | 57.7% [44–70] | +9.4% | -2.5u | 0.71 ✗ noise |
| Σ = +3 | 24 | 10-14-0 | 41.7% [24–61] | -14.3% | -8.7u | -0.65 ✗ noise |
| Σ = +4 | 18 | 10-8-0 | 55.6% [34–75] | +8.9% | -10.3u | 0.36 ✗ noise |
| Σ = +5 | 11 | 4-7-0 | 36.4% [15–65] | -27.1% | -9.9u | -0.89 ✗ noise |
| Σ ≥ +6 | 13 | 6-7-0 | 46.2% [23–71] | -13.6% | -11.6u | -0.49 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = -0.003** ✗  ·  **ρ(Σ, flat ROI) = -0.021** ✗  (N=170)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 170.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.006 ✗ | -0.021 ✗ | -0.037 | weak |
| HC margin | 0.003 ✗ | -0.011 ✗ | 0.047 | weak |
| Δw + HC | -0.003 ✗ | -0.021 ✗ | -0.005 | weak |
| peak.stars | -0.113 ✗ | -0.152 ✓ p<.05 | -0.161 | weak |
| vault.star | -0.069 ✗ | -0.078 ✗ | -0.113 | weak |
| lock.stars | -0.070 ✗ | -0.100 ✗ | -0.093 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 170 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | N=10 · 4-5 · 44% [19–73] · -19%  | N=26 · 16-9 · 64% [45–80] · +20%  | N=18 · 8-10 · 44% [25–66] · -18%  | N=8 · 2-6 · 25% [7–59] · -57% ✗ |
| +1 | — | — | N=2 · 0-2 · 0% [0–66] · —  | N=13 · 6-7 · 46% [23–71] · -7%  | N=32 · 22-10 · 69% [51–82] · +31%  | N=18 · 9-9 · 50% [29–71] · +7%  | N=19 · 12-7 · 63% [41–81] · +26%  |
| +2 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=4 · 0-4 · 0% [0–49] · -100%  | N=10 · 5-5 · 50% [24–76] · -0%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | — | N=2 · 0-2 · 0% [0–66] · —  | N=3 · 1-2 · 33% [6–79] · -52%  |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -6.5u | 0.00 ✗ noise |
| HC = 0 | 62 | 30-30-2 | 50.0% [38–62] | -7.2% | -16.5u | -0.61 ✗ noise |
| HC = +1 | 84 | 49-35-0 | 58.3% [48–68] | +15.9% | +5.3u | 1.44 ✗ noise |
| HC = +2 | 15 | 5-10-0 | 33.3% [15–58] | -33.5% | -21.6u | -1.33 ✗ noise |
| HC ≥ +3 | 6 | 2-4-0 | 33.3% [10–70] | -52.8% | -7.0u | -1.77 ~ p<.10 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -2.4u | 0.00 ✗ noise |
| Δw = 0 | 24 | 11-12-1 | 47.8% [29–67] | -9.8% | -4.9u | -0.50 ✗ noise |
| Δw = +1 | 60 | 38-21-1 | 64.4% [52–75] | +21.9% | +12.1u | 1.84 ~ p<.10 |
| Δw = +2 | 42 | 17-25-0 | 40.5% [27–56] | -19.0% | -27.9u | -1.20 ✗ noise |
| Δw ≥ +3 | 42 | 20-22-0 | 47.6% [33–62] | -7.5% | -23.2u | -0.48 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 105 | 56-49-0 | 53.3% [44–63] | +4.9% | -23.3u | 0.50 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 28 | 10-18-0 | 35.7% [21–54] | -34.8% | -22.9u | -2.04 ✓ p<.05 |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 37 | 20-15-2 | 57.1% [41–72] | +6.1% | -0.1u | 0.40 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 258 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -6.5u | 0.00 ✗ noise |
| Δcount = −1 | 14 | 5-9-0 | 35.7% [16–61] | -26.4% | -6.9u | -0.96 ✗ noise |
| Δcount = 0 (balanced) | 24 | 8-15-1 | 34.8% [19–55] | -33.5% | -13.4u | -1.78 ~ p<.10 |
| Δcount = +1 | 99 | 47-50-2 | 48.5% [39–58] | -10.1% | -19.5u | -1.08 ✗ noise |
| Δcount = +2 | 67 | 31-36-0 | 46.3% [35–58] | -9.0% | -18.1u | -0.74 ✗ noise |
| Δcount ≥ +3 (heavy support) | 51 | 37-14-0 | 72.5% [59–83] | +53.2% | +22.3u | 3.28 ✓ p<.01 |

**ρ(Δcount, WIN) = 0.219** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.236** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -2 · ≤ 0 · ≤ 4 · ≤ 12 · > 12

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 89 | 33-55-1 | 37.5% [28–48] | -27.2% | -46.9u | -2.68 ✓ p<.01 |
| Q2 | 28 | 13-14-1 | 48.1% [31–66] | -1.6% | -0.9u | -0.08 ✗ noise |
| Q3 (balanced) | 43 | 25-18-0 | 58.1% [43–72] | +14.6% | +1.5u | 0.96 ✗ noise |
| Q4 | 47 | 23-24-0 | 48.9% [35–63] | -8.7% | -22.0u | -0.62 ✗ noise |
| Q5 (best — heavy support) | 51 | 34-16-1 | 68.0% [54–79] | +36.8% | +26.1u | 2.28 ✓ p<.05 |

**ρ(ΔWlNet, WIN) = 0.234** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.223** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -4.71 · ≤ -0.82 · ≤ 1.99 · ≤ 10.16 · > 10.16

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 68 | 24-44-0 | 35.3% [25–47] | -34.1% | -45.5u | -3.09 ✓ p<.01 |
| Q2 | 44 | 17-25-2 | 40.5% [27–56] | -19.0% | -21.6u | -1.28 ✗ noise |
| Q3 | 43 | 23-20-0 | 53.5% [39–67] | +5.3% | +0.3u | 0.35 ✗ noise |
| Q4 | 53 | 33-20-0 | 62.3% [49–74] | +18.8% | +2.9u | 1.43 ✗ noise |
| Q5 | 50 | 31-18-1 | 63.3% [49–75] | +31.3% | +21.9u | 1.84 ~ p<.10 |

**ρ(ΔFlatPnl, WIN) = 0.270** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.306** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -8.4 · ≤ -2.7 · ≤ 7.0 · ≤ 18.6 · > 18.6

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 52 | 10-40-2 | 20.0% [11–33] | -53.9% | -53.5u | -4.19 ✓ p<.01 |
| Q2 | 52 | 28-24-0 | 53.8% [41–67] | +1.3% | -2.9u | 0.10 ✗ noise |
| Q3 | 53 | 22-31-0 | 41.5% [29–55] | -19.4% | -27.0u | -1.44 ✗ noise |
| Q4 | 50 | 30-19-1 | 61.2% [47–74] | +16.4% | +5.2u | 1.20 ✗ noise |
| Q5 | 51 | 38-13-0 | 74.5% [61–84] | +50.6% | +36.1u | 3.38 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.367** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.370** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 22 | 1-20-1 | 4.8% [1–23] | -88.4% | -29.8u | -10.82 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 14 | 7-7-0 | 50.0% [27–73] | +6.7% | -5.9u | 0.22 ✗ noise |
| ΔBestRank = 0 (tied) | 1 | 1-0-0 | 100.0% [21–100] | +90.9% | +0.3u | 0.00 ✗ n<2 |
| ΔBestRank ∈ [+1,+4] | 15 | 7-8-0 | 46.7% [25–70] | +6.2% | -1.7u | 0.18 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 40 | 25-14-1 | 64.1% [48–77] | +33.9% | +11.9u | 1.75 ~ p<.10 |

**ρ(ΔBestRank, WIN) = 0.464** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.500** ✓ p<.01  (N=92)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 20 | 4-16-0 | 20.0% [8–42] | -54.3% | -13.2u | -2.33 ✓ p<.05 |
| Δshare ∈ [−30,−10] pp | 3 | 1-2-0 | 33.3% [6–79] | -11.7% | -7.2u | -0.13 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 172 | 78-92-2 | 45.9% [39–53] | -12.3% | -65.4u | -1.67 ~ p<.10 |
| Δshare ∈ [+10,+30] pp | 15 | 9-6-0 | 60.0% [36–80] | +21.1% | -3.2u | 0.76 ✗ noise |
| Δshare ≥ +30 pp | 48 | 36-11-1 | 76.6% [63–86] | +53.1% | +46.9u | 3.49 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.256** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.233** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.367 ✓ p<.01 | 0.370 ✓ p<.01 | 0.318 |
| 2 | **ΔTopQCount** | 0.326 ✓ p<.01 | 0.353 ✓ p<.01 | 0.303 |
| 3 | **ΔFlatPnl** | 0.270 ✓ p<.01 | 0.306 ✓ p<.01 | 0.254 |
| 4 | **Δcount** | 0.219 ✓ p<.01 | 0.236 ✓ p<.01 | 0.224 |
| 5 | **ΔTopQShare** | 0.256 ✓ p<.01 | 0.233 ✓ p<.01 | 0.267 |
| 6 | **ΔWlNet** | 0.234 ✓ p<.01 | 0.223 ✓ p<.01 | 0.187 |

_(ΔBestRank uses N=92 subset where both sides had a proven wallet — ρ(flat ROI) = 0.500 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 530, dateRange = 2026-04-18 → 2026-05-23, computedAt = 2026-05-24T14:11:18.880Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **258** rows · PIT aggregate computable on **255** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **255** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 0 · — · — | 0 · — · — | — |
| NEUTRAL (0..+3) | 172 · 56% · +9.3% | 165 · 51% · -4.1% | -13.4pp |
| WEAK (−3..0) | 71 · 36% · -28.1% | 78 · 50% · +3.7% | +31.8pp |
| FADE (<−3) | 0 · — · — | 0 · — · — | — |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=124, WR=61%, ROI=+19.1% | N=124, WR=52%, ROI=-0.9% | -20.0pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=172, WR=56%, ROI=+9.3% | N=165, WR=51%, ROI=-4.1% | -13.4pp |
| AGS < −1 (mute veto) | N=28, WR=33%, ROI=-30.5% | N=33, WR=52%, ROI=+15.9% | +46.4pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-10 → 2026-05-23, N=126)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 0 · — · — |
| NEUTRAL (0..+3) | 79 · 48% · -10.0% |
| WEAK (−3..0) | 47 · 54% · +7.7% |
| FADE (<−3) | 0 · — · — |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=56, WR=45%, ROI=-16.6% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=79, WR=48%, ROI=-10.0% |
| AGS < −1 (mute veto) | N=19, WR=61%, ROI=+19.1% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.20 | 1.47 |
| `dHcCount` | COUNT_HC | + | 0.32 | 0.75 |
| `dConvictionAvg` | INTENSITY | + | 0.52 | 0.59 |
| `dHcSizeRatio` | INTENSITY_HC | + | 1.20 | 5.01 |
| `forContribShare` | DOMINANCE | − | 0.80 | 0.28 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **255/282** shipped+graded rows (90%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -1.12 |
| 20th pct | -0.16 |
| 40th pct | 0.09 |
| Median | 0.17 |
| 60th pct | 0.23 |
| 80th pct | 0.39 |
| 90th pct | 0.54 |
| Max | 1.10 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 21 | 8.2% |
| **LOCK** | +5..+7 | 75 | 29.4% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 45 | 17.6% |
| **FADE** | < −3 | 35 | 13.7% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 21 | 14-7-0 | 66.7% [45–83] | +25.3% | +14.6u | 1.22 ✗ noise |
| LOCK | 75 | 38-37-0 | 50.7% [40–62] | -2.4% | -3.6u | -0.21 ✗ noise |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 45 | 22-23-0 | 48.9% [35–63] | -5.3% | -3.1u | -0.35 ✗ noise |
| FADE | 35 | 17-16-2 | 51.5% [35–67] | +14.7% | -11.3u | 0.68 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.022** ✗ · r(ROI) = **-0.031** ✗ · Spearman ρ(ROI) = **-0.032**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 30 | 16-13-1 | 55.2% [38–72] | +21.3% | -10.3u | 0.89 ✗ noise |
| z ∈ [−1, 0) | 92 | 47-43-2 | 52.2% [42–62] | -0.4% | +2.4u | -0.04 ✗ noise |
| z ∈ [0, +1) | 85 | 35-50-0 | 41.2% [31–52] | -20.0% | -41.3u | -1.88 ~ p<.10 |
| z ≥ +1 (very positive) | 48 | 25-23-0 | 52.1% [38–66] | -2.4% | -8.2u | -0.17 ✗ noise |

#### `dHcCount` (COUNT_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 221 | 108-110-3 | 49.5% [43–56] | -5.0% | -54.4u | -0.76 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dConvictionAvg` (INTENSITY)

r(WIN) = **0.115** ~ p<.10 · r(ROI) = **0.027** ✗ · Spearman ρ(ROI) = **0.056**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 33 | 11-22-0 | 33.3% [20–50] | -16.2% | -22.3u | -0.69 ✗ noise |
| z ∈ [−1, 0) | 63 | 33-28-2 | 54.1% [42–66] | +3.3% | -10.0u | 0.26 ✗ noise |
| z ∈ [0, +1) | 133 | 66-66-1 | 50.0% [42–58] | -4.7% | -12.3u | -0.56 ✗ noise |
| z ≥ +1 (very positive) | 26 | 13-13-0 | 50.0% [32–68] | -10.0% | -12.9u | -0.54 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 221 | 108-110-3 | 49.5% [43–56] | -5.0% | -54.4u | -0.76 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `forContribShare` (DOMINANCE)

r(WIN) = **0.075** ✗ · r(ROI) = **-0.012** ✗ · Spearman ρ(ROI) = **0.026**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 23 | 11-11-1 | 50.0% [31–69] | +13.4% | -7.3u | 0.46 ✗ noise |
| z ∈ [−1, 0) | 65 | 24-40-1 | 37.5% [27–50] | -25.4% | -39.9u | -2.07 ✓ p<.05 |
| z ∈ [0, +1) | 167 | 88-78-1 | 53.0% [45–60] | +0.8% | -10.1u | 0.11 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | 0.115 ~ p<.10 | 0.027 ✗ | 0.056 |
| 2 | `dCount` | COUNT | 0.022 ✗ | -0.031 ✗ | -0.032 |
| 3 | `forContribShare` | DOMINANCE | 0.075 ✗ | -0.012 ✗ | 0.026 |
| 4 | `dHcCount` | COUNT_HC | NaN — | NaN — | NaN |
| 5 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | +0.181 | 0.774 | 33.5% | meaningful |
| 2 | `dConvictionAvg` | +0.066 | 0.744 | 32.2% | meaningful |
| 3 | `forContribShare` | +0.112 | 0.702 | 30.4% | meaningful |
| 4 | `dHcCount` | -0.058 | 0.058 | 2.5% | silent (<0.2) |
| 5 | `dHcSizeRatio` | -0.032 | 0.032 | 1.4% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcCount` | `dConvictionAvg` | `dHcSizeRatio` | `forContribShare` |
|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.194 | +0.262 | +0.194 | +0.481 |
| `dHcCount` | +0.194 | 1.000 | +0.099 | +1.000 ⚠ | +0.167 |
| `dConvictionAvg` | +0.262 | +0.099 | 1.000 | +0.099 | +0.856 ⚠ |
| `dHcSizeRatio` | +0.194 | +1.000 ⚠ | +0.099 | 1.000 | +0.167 |
| `forContribShare` | +0.481 | +0.167 | +0.856 ⚠ | +0.167 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.014**. At AGS ≥ +0.17 fires N=129, WR=51.2%, ROI=-3.3%. At AGS ≥ +null fires N=174, WR=48.6%, ROI=-8.0%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-129 ROI (matched cohort) | Top-129 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.043 | +0.030 | WR=52%, ROI=-2.6% | -0.7pp | N=65, WR=55%, ROI=+1.1% |
| `dHcCount` | -0.004 | −0.010 | WR=51%, ROI=-4.3% | +1.0pp | N=106, WR=49%, ROI=-6.7% |
| `dConvictionAvg` | -0.021 | +0.008 | WR=47%, ROI=-5.2% | +1.9pp | N=101, WR=47%, ROI=-4.9% |
| `dHcSizeRatio` | -0.001 | −0.013 | WR=51%, ROI=-4.3% | +1.0pp | N=104, WR=50%, ROI=-4.9% |
| `forContribShare` | +0.031 | +0.017 | WR=54%, ROI=+1.8% | -5.1pp | N=153, WR=51%, ROI=-4.2% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dHcSizeRatio` | −0.013 | +1.0pp | mild marginal info |
| 2 | `dHcCount` | −0.010 | +1.0pp | mild marginal info |
| 3 | `dConvictionAvg` | +0.008 | +1.9pp | redundant — other features cover it |
| 4 | `forContribShare` | +0.017 | -5.1pp | redundant — other features cover it |
| 5 | `dCount` | +0.030 | -0.7pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | +0.208 | 0.208 | positive ↑ |
| 2 | `dHcCount` | COUNT_HC | +0.036 | 0.036 | flat ≈ 0 |
| 3 | `forContribShare` | DOMINANCE | -0.030 | 0.030 | flat ≈ 0 |
| 4 | `dCount` | COUNT | -0.020 | 0.020 | flat ≈ 0 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | +0.020 | 0.020 | flat ≈ 0 |

Intercept b = -0.075 · Final log-loss = 0.6869 · N = 255.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | #1 | #2 | #3 | #1 | 1.75 |
| 2 | `dCount` | COUNT | #2 | #1 | #5 | #4 | 3.00 |
| 3 | `dHcCount` | COUNT_HC | #4 | #4 | #2 | #2 | 3.00 |
| 4 | `forContribShare` | DOMINANCE | #3 | #3 | #4 | #3 | 3.25 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | #5 | #5 | #1 | #5 | 4.00 |

#### Plain-English summary

- **Workhorse**: `dConvictionAvg` (INTENSITY) — ranks #1/#2/#3/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dHcSizeRatio` (INTENSITY_HC) — composite avg rank 4.00. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dHcCount` ↔ `dHcSizeRatio` (r=+1.00); `dConvictionAvg` ↔ `forContribShare` (r=+0.86). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dHcCount`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **v9 simplification candidate**: only `dHcSizeRatio` carries marginal info (Spearman ρ drop > 0.01 when removed). The other 5 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=255 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 255 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/255 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 85 | 37-48-0 | 43.5% [33–54] | -21.8% | -59.4u | -2.18 ✓ p<.05 |
| 4.5★ | 25 | 16-9-0 | 64.0% [45–80] | +26.7% | +15.3u | 1.26 ✗ noise |
| 4.0★ | 46 | 22-23-1 | 48.9% [35–63] | -5.2% | -5.2u | -0.36 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 39 | 19-19-1 | 50.0% [35–65] | +2.8% | -1.8u | 0.17 ✗ noise |
| 2.5★ | 49 | 24-24-1 | 50.0% [36–64] | -2.7% | -9.7u | -0.19 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 6/33%/-55% | 3/67%/+12% | 6/0%/-100% | 6/33%/-26% | 14/38%/-26% | 20/37%/-26% |
| Δw = +1 | 8/50%/-15% | 6/50%/-6% | 18/71%/+36% | 28/54%/+4% | 12/58%/+13% | 20/55%/+0% |
| Δw = +2 | 28/32%/-37% | 7/71%/+37% | 18/44%/-15% | — | 8/38%/-15% | 6/50%/+12% |
| Δw ≥ +3 | 41/49%/-12% | 6/67%/+58% | 4/50%/-4% | 3/67%/+156% | 5/80%/+86% | 1/100%/+145% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 11 | 7-4-0 | 63.6% [35–85] | -9.5% | +4.2u | -0.44 ✗ noise |
| −200/−151 | 26 | 11-15-0 | 42.3% [26–61] | -32.0% | -18.2u | -2.01 ✓ p<.05 |
| −150/−101 | 160 | 80-79-1 | 50.3% [43–58] | -4.5% | -15.6u | -0.60 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 62 | 28-32-2 | 46.7% [35–59] | +2.5% | -31.1u | 0.18 ✗ noise |
| +151/+200 | 7 | 4-3-0 | 57.1% [25–84] | +55.6% | +1.9u | 1.01 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -30% (6) | — | +47% (1) | +7% (4) |
| −200/−151 | -100% (7) | +24% (9) | +22% (4) | -100% (5) |
| −150/−101 | -27% (30) | +17% (58) | -35% (38) | +11% (31) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +16% (10) | -17% (22) | +3% (19) | +27% (11) |
| +151/+200 | — | +160% (1) | +88% (3) | +32% (2) |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 151 | 69-82-0 | 45.7% [38–54] | -8.3% | -64.7u | -0.93 ✗ noise |
| SPREAD | 50 | 23-26-1 | 46.9% [34–61] | -13.3% | +0.2u | -1.02 ✗ noise |
| TOTAL | 81 | 45-34-2 | 57.0% [46–67] | +9.9% | +7.5u | 0.94 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=26 · 23% · -57% | N=47 · 55% · +5% | N=36 · 42% · -12% | N=39 · 51% · +12% |
| SPREAD | N=14 · 31% · -42% | N=17 · 47% · -14% | N=9 · 67% · +21% | N=9 · 44% · -13% |
| TOTAL | N=16 · 60% · +15% | N=29 · 68% · +30% | N=22 · 32% · -38% | N=12 · 75% · +45% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 138 | 66-71-1 | 48.2% [40–56] | -7.6% | -33.2u | -0.92 ✗ noise |
| NBA | 110 | 53-56-1 | 48.6% [39–58] | -2.4% | -14.0u | -0.22 ✗ noise |
| NHL | 34 | 18-15-1 | 54.5% [38–70] | +5.9% | -9.7u | 0.35 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=23 · 41% · -20% | N=53 · 58% · +9% | N=41 · 39% · -23% | N=20 · 45% · -10% |
| NBA | N=27 · 27% · -51% | N=27 · 52% · +1% | N=18 · 50% · +3% | N=33 · 61% · +30% |
| NHL | N=6 · 50% · -2% | N=13 · 67% · +23% | N=8 · 38% · -21% | N=7 · 57% · +11% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 149 · 44% · -9.7% · -1.09 ✗ noise | 132 · 54% · +1.5% · 0.18 ✗ noise |
| **plusEV** | 38 · 42% · -13.8% · -0.69 ✗ noise | 243 · 50% · -3.0% · -0.47 ✗ noise |
| **pinnacleConfirms** | 76 · 46% · -4.9% · -0.37 ✗ noise | 117 · 50% · -4.1% · -0.45 ✗ noise |
| **invested10kPlus** | 146 · 47% · -6.9% · -0.77 ✗ noise | 47 · 55% · +3.3% · 0.24 ✗ noise |
| **lineMovingWith** | 154 · 49% · -2.2% · -0.26 ✗ noise | 127 · 48% · -7.2% · -0.81 ✗ noise |
| **predMarketAligns** | 71 · 45% · -8.3% · -0.61 ✗ noise | 122 · 51% · -2.2% · -0.24 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 50 | 31-19-0 | 62.0% [48–74] | +18.6% | +4.1u | 1.38 ✗ noise |
| 1 | 64 | 31-31-2 | 50.0% [38–62] | -7.1% | -7.2u | -0.62 ✗ noise |
| 2 | 74 | 34-39-1 | 46.6% [36–58] | -7.8% | -13.0u | -0.65 ✗ noise |
| 3 | 28 | 12-16-0 | 42.9% [27–61] | -14.0% | -13.9u | -0.70 ✗ noise |
| 4 | 28 | 10-18-0 | 35.7% [21–54] | -28.6% | -18.1u | -1.51 ✗ noise |
| 5 | 29 | 15-14-0 | 51.7% [34–69] | -4.7% | -9.1u | -0.26 ✗ noise |
| 6 | 9 | 4-5-0 | 44.4% [19–73] | +35.6% | +0.4u | 0.55 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 73 | 44-28-1 | 61.1% [50–72] | +15.5% | +19.9u | 1.39 ✗ noise |
| NEAR_START | 112 | 46-64-2 | 41.8% [33–51] | -13.2% | -53.9u | -1.27 ✗ noise |
| NO_MOVE | 9 | 4-5-0 | 44.4% [19–73] | -21.0% | -0.2u | -0.66 ✗ noise |
| PREGAME | 35 | 21-14-0 | 60.0% [44–74] | +12.4% | +0.9u | 0.78 ✗ noise |
| SMALL_MOVE | 51 | 20-31-0 | 39.2% [27–53] | -24.2% | -26.1u | -1.74 ~ p<.10 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 159 | 79-79-1 | 50.0% [42–58] | -6.9% | -32.2u | -0.92 ✗ noise |
| STRONG | 53 | 27-26-0 | 50.9% [38–64] | +2.8% | -9.4u | 0.19 ✗ noise |
| LEAN | 66 | 29-35-2 | 45.3% [34–57] | -3.0% | -16.7u | -0.21 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.085 ✗ | -0.049 ✗ | -0.071 | -0.82 |
| totalInvested | -0.063 ✗ | -0.079 ✗ | -0.073 | -1.33 |
| evEdge | 0.091 ✗ | 0.065 ✗ | 0.080 | 1.09 |
| moneyPct | 0.032 ✗ | -0.030 ✗ | -0.029 | -0.50 |
| walletPct | 0.081 ✗ | 0.044 ✗ | 0.044 | 0.74 |
| criteriaMet | -0.088 ✗ | -0.048 ✗ | -0.088 | -0.81 |
| maxContribFor | 0.002 ✗ | 0.013 ✗ | 0.038 | 0.22 |
| meanBaseFor | 0.023 ✗ | 0.038 ✗ | 0.072 | 0.63 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **274** picks. Mean CLV = **-0.0023**.
t-statistic vs zero: -1.59 → ✗ noise · 95% CI [-0.0051, 0.0005]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 26 | 13-13-0 | 50.0% [32–68] | -13.6% | +0.4u | -0.78 ✗ noise |
| CLV (−2%, 0] | 146 | 66-78-2 | 45.8% [38–54] | -10.2% | -50.6u | -1.23 ✗ noise |
| CLV (0, +2%] | 85 | 46-39-0 | 54.1% [44–64] | +12.2% | -6.3u | 1.00 ✗ noise |
| CLV > +2% | 17 | 7-9-1 | 43.8% [23–67] | -24.8% | -6.6u | -1.18 ✗ noise |

ρ(CLV, flat ROI) = 0.018 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=171 (with all features non-null). Intercept β₀ = 0.047.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔAvgRoi | +0.517 | ↑ helps |
| 2 | sharpCount | -0.327 | ↓ hurts |
| 3 | pw.ΔFlatPnl | +0.305 | ↑ helps |
| 4 | evEdge | +0.298 | ↑ helps |
| 5 | peak.stars | -0.246 | ↓ hurts |
| 6 | pw.Δcount | +0.220 | ↑ helps |
| 7 | pw.ΔTopQShare | +0.166 | ↑ helps |
| 8 | odds (American) | -0.165 | ↓ hurts |
| 9 | pw.ΔWlNet | +0.143 | ↑ helps |
| 10 | log10(invested) | -0.100 | ↓ hurts |
| 11 | walletPct | +0.067 | ↑ helps |
| 12 | vault.star | +0.055 | ↑ helps |
| 13 | log(impliedProb) | +0.054 | ↑ helps |
| 14 | Δw | -0.051 | ↓ hurts |
| 15 | criteriaMet | -0.039 | ≈ flat |
| 16 | HC margin | +0.034 | ≈ flat |
| 17 | Δw + HC | -0.025 | ≈ flat |
| 18 | moneyPct | +0.020 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 21 | 7-14 | 33.3% | 38.7% | -110 | — (mute) | 3.58u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 84 | 49-35 | 58.3% | 57.4% | -109 | 5.53% bankroll | 1.79u | **UNDER-SIZED** — ship up to 5.53u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 28 | 10-18 | 35.7% | 39.5% | -110 | — (mute) | 1.99u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 60 | 33-27 | 55.0% | 54.3% | -106 | 2.91% bankroll | 2.81u | ~ in range — 2.91u |
| Stale Δw = 0 | 47 | 18-27 | 40.0% | 41.8% | -110 | — (mute) | 1.21u | **MUTE** (negative EV at posterior) |
| Stale Δw ≤ −1 | 9 | 1-8 | 11.1% | 31.6% | -165 | — (mute) | 0.93u | **MUTE** (negative EV at posterior) |

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

**Peak cum PnL:** +7.1u
**Max drawdown:** -68.5u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.295  (annualized × √252 ≈ -4.69)

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
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 1 | -2 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 1 | 2 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 0 | 4 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 4 | 16 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 2 | -6 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 1 | 2 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | -1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 2 | -8 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | 1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | -1 | -15 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 1 | 10 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 0 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | 1 | -4 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | 0 | -11 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 1 | 4 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 2 | 18 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | 0 | 0 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 1 | 0 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 3 | 1 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 2 | 5 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 2 | 10 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 2 | -10 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | -1 | 10 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 1 | 0 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 2 | -11 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 1 | 0 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | 0 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | 1 | 5 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | 0 | -25 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | -1 | -10 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 1 | -7 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 4 | 20 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 3 | 0 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 1 | -7 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | -1 | 0 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | 0 | -6 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | -1 | 9 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | -1 | 10 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 1 | -10 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 1 | 4 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 3 | 15 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 2 | 3 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -2 | -8 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 1 | 2 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 6 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | 1 | 0 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 15 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 3 | -2 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | -4 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | 0 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 2 | -1 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 4 | 21 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 1 | 27 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 4 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 28 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 1 | 1 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 2 | -12 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 2 | -12 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | 0 | -32 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 2 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 2 | 3 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 0 | 2 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 1 | 1 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | -1 | 2 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | 6 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 2 | -1 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 19 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 35 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | 13 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -7 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 3 | 15 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | -1 | -6 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 1 | -2 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -21 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 4 | 26 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 4 | 27 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 4 | 21 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 1 | 1 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 0 | 0 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 1 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 0 | 0 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | -2 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 1 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 2 | -6 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 6 | 6 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 22 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 1 | 6 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 2 | 0 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 1 | 22 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 0 | -6 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 0 | -4 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 4 | 19 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 4 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | -14 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 1 | -18 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 3 | 13 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 1 | -3 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 1 | -1 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | 9 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 3 | -24 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 17 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 4 | 10 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 2 | -9 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 3 | 28 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | -1 | -6 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 2 | 4 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 19 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 14 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 19 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | 0 | -2 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 41 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 3 | 14 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 2 | -6 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 1 | 6 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 3 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 6 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 5 | 19 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 0 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 22 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 3 | 20 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 0 | 1 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 1 | 0 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 1 | 0 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 2 | 27 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 3 | 30 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 23 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 1 | 1 | -1.30 | L | -1.1u |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.70 | -104 | — | — | — | 2 | 18 | 0.00 | W | +1.6u |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-09 | NBA | ML | away | 5.0 | 4.50 | -364 | 3 | 1 | 4 | 6 | 41 | 0.00 | W | +1.2u |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2.00 | -104 | 2 | 1 | 3 | 2 | 23 | 0.00 | W | +1.9u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -120 | 1 | 1 | 2 | 0 | 8 | 0.00 | W | +0.9u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -2 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -2 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -103 | 1 | 1 | 2 | 1 | -2 | 0.00 | L | -1.1u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -110 | 1 | 1 | 2 | 1 | -2 | 0.00 | W | +1.0u |
| 2026-05-10 | MLB | ML | away | 3.5 | 1.13 | +134 | 0 | 1 | 1 | 1 | -2 | 0.00 | W | +1.5u |
| 2026-05-10 | NBA | ML | home | 4.0 | 1.50 | +160 | 1 | 1 | 2 | 3 | 16 | 0.80 | W | +2.6u |
| 2026-05-10 | NBA | TOTAL | over | 5.0 | 3.50 | -110 | 3 | 2 | 5 | 2 | 23 | 0.00 | W | +3.3u |
| 2026-05-10 | NHL | ML | away | 4.5 | 4.50 | +108 | 2 | 2 | 4 | 2 | 2 | -0.70 | L | -4.5u |
| 2026-05-10 | NHL | TOTAL | under | 5.0 | 1.70 | -110 | 2 | 1 | 3 | 2 | -1 | 0.00 | L | -1.7u |
| 2026-05-11 | MLB | ML | away | 3.5 | 1.13 | -101 | 1 | 1 | 2 | 2 | -3 | 0.00 | W | +1.1u |
| 2026-05-11 | MLB | ML | home | 3.5 | 1.13 | -156 | 1 | 1 | 2 | 0 | 8 | 0.00 | W | +0.7u |
| 2026-05-11 | NBA | TOTAL | under | 4.5 | 2.00 | -110 | 1 | 2 | 3 | 0 | 12 | 0.00 | L | -2.0u |
| 2026-05-11 | NHL | TOTAL | under | 4.5 | 1.27 | -110 | 2 | 0 | 2 | 2 | 7 | 0.00 | L | -1.3u |
| 2026-05-12 | MLB | ML | away | 5.0 | 4.50 | +108 | 4 | 0 | 4 | 2 | 4 | -0.20 | L | -4.5u |
| 2026-05-12 | MLB | TOTAL | under | 4.0 | 0.64 | -110 | 2 | 1 | 3 | 2 | 5 | 0.00 | L | -0.6u |
| 2026-05-12 | MLB | ML | away | 4.5 | 3.00 | +129 | 3 | 0 | 3 | 1 | 6 | -1.00 | L | -3.0u |
| 2026-05-12 | MLB | ML | home | 5.0 | 3.00 | +108 | 3 | 0 | 3 | 2 | 5 | -0.50 | L | -3.0u |
| 2026-05-12 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 6 | 4 | 10 | 6 | 38 | -0.70 | L | -3.5u |
| 2026-05-13 | MLB | ML | home | 4.5 | 4.50 | -116 | 1 | 1 | 2 | 1 | -2 | -1.30 | W | +3.7u |
| 2026-05-13 | MLB | SPREAD | home | 5.0 | 3.50 | -105 | 1 | 1 | 2 | 2 | -2 | 0.90 | W | +3.2u |
| 2026-05-13 | MLB | TOTAL | under | 4.0 | 0.96 | -110 | 1 | 1 | 2 | 2 | -4 | 0.00 | W | +0.9u |
| 2026-05-13 | MLB | TOTAL | under | 5.0 | 3.50 | -110 | 4 | 2 | 6 | 4 | 1 | 0.00 | L | -3.5u |
| 2026-05-13 | NBA | ML | home | 5.0 | 4.50 | -162 | 6 | 0 | 6 | 2 | -20 | -1.00 | L | -4.5u |
| 2026-05-13 | NBA | TOTAL | over | 5.0 | 3.50 | -101 | 3 | 2 | 5 | 4 | 6 | 0.00 | W | +3.4u |
| 2026-05-14 | MLB | ML | home | 5.0 | 4.50 | -103 | 4 | 1 | 5 | 0 | 0 | -0.40 | L | -4.5u |
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 2 | 4 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | 0 | 0.00 | L | -0.5u |
| 2026-05-14 | NHL | TOTAL | under | 5.0 | 3.50 | -110 | 3 | 1 | 4 | 3 | 5 | 0.00 | L | -3.5u |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 0 | 1 | 1 | 4 | 9 | 0.00 | W | +1.7u |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 1 | 1 | 2 | 2 | 0 | 0.00 | W | +0.3u |
| 2026-05-15 | MLB | ML | home | 4.0 | 2.50 | +128 | 0 | 0 | 0 | 1 | -1 | 0.00 | L | -2.5u |
| 2026-05-15 | MLB | ML | away | 4.0 | 2.75 | -211 | 2 | 1 | 3 | 1 | 6 | -0.90 | W | +1.3u |
| 2026-05-15 | MLB | ML | away | 3.0 | 1.25 | +115 | 0 | 1 | 1 | -1 | -6 | -1.10 | L | -1.3u |
| 2026-05-15 | NBA | ML | away | 2.5 | 0.50 | +145 | 6 | 1 | 7 | 5 | 21 | -0.50 | W | +0.8u |
| 2026-05-15 | NBA | TOTAL | over | 4.0 | 0.75 | -109 | 0 | 1 | 1 | 2 | -14 | 0.00 | L | -0.8u |
| 2026-05-15 | NBA | SPREAD | home | 2.5 | 1.00 | -105 | 1 | 0 | 1 | 1 | 21 | 0.00 | L | -1.0u |
| 2026-05-15 | NBA | TOTAL | over | 5.0 | 2.00 | -110 | 1 | 0 | 1 | 3 | 7 | 0.00 | W | +1.9u |
| 2026-05-16 | MLB | ML | away | 5.0 | 4.50 | +124 | 3 | 1 | 4 | 4 | 2 | -1.30 | W | +1.4u |
| 2026-05-16 | MLB | SPREAD | away | 4.0 | 1.65 | -175 | 2 | 0 | 2 | 2 | 5 | 0.00 | W | +0.9u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +119 | 2 | 1 | 3 | 1 | -2 | -2.00 | L | -2.5u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +115 | 3 | 2 | 5 | 2 | 5 | -1.10 | W | +2.8u |
| 2026-05-16 | MLB | TOTAL | over | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | -2 | 0.00 | L | -1.6u |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.50 | -102 | 1 | 0 | 1 | 1 | -10 | 0.00 | W | +0.5u |
| 2026-05-17 | MLB | ML | away | 4.0 | 2.75 | -148 | 1 | 0 | 1 | 2 | 4 | -0.70 | W | +1.9u |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.50 | +139 | 0 | 1 | 1 | 0 | -8 | 0.70 | L | -0.5u |
| 2026-05-17 | MLB | ML | away | 5.0 | 5.00 | -129 | 3 | 1 | 4 | 1 | -2 | 0.40 | L | -5.0u |
| 2026-05-17 | MLB | ML | home | 4.0 | 2.75 | -114 | 3 | 1 | 4 | 4 | 4 | 2.20 | W | +2.4u |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 1 | 3 | 2 | -2 | 0.00 | W | +2.0u |
| 2026-05-17 | MLB | TOTAL | over | 5.0 | 2.50 | +107 | 2 | 2 | 4 | 1 | -2 | 0.00 | L | -2.5u |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | 2 | 0.00 | W | +0.3u |
| 2026-05-17 | NBA | ML | away | 3.0 | 1.25 | +165 | 3 | 1 | 4 | 3 | 8 | -0.60 | W | +0.8u |
| 2026-05-17 | NBA | TOTAL | under | 5.0 | 0.75 | -110 | 2 | 3 | 5 | 0 | 23 | 0.00 | L | -0.8u |
| 2026-05-18 | MLB | ML | home | 4.5 | 5.00 | -111 | 2 | 1 | 3 | 2 | 4 | -1.10 | W | +4.4u |
| 2026-05-18 | MLB | ML | away | 4.0 | 2.50 | +120 | 2 | 0 | 2 | 1 | -2 | -2.10 | L | -2.5u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | -118 | 2 | 0 | 2 | 1 | -2 | 1.00 | W | +1.1u |
| 2026-05-18 | MLB | ML | home | 4.0 | 2.75 | -150 | 2 | 0 | 2 | 1 | 6 | -0.80 | L | -2.8u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | +132 | 2 | 0 | 2 | 2 | 1 | 0.40 | W | +1.6u |
| 2026-05-18 | NBA | ML | home | 5.0 | 5.00 | -240 | 3 | 2 | 5 | 4 | 22 | -1.60 | L | -5.0u |
| 2026-05-18 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 1 | 2 | 0 | 16 | 0.20 | L | -1.0u |
| 2026-05-18 | NHL | ML | home | 5.0 | 5.00 | -112 | 2 | 2 | 4 | 3 | 6 | -1.10 | L | -5.0u |
| 2026-05-18 | NHL | TOTAL | under | 4.5 | 2.25 | -110 | 3 | 1 | 4 | 3 | 8 | 0.00 | W | +2.0u |
| 2026-05-19 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 1 | -4 | -1.30 | L | -2.5u |
| 2026-05-19 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | 5 | 0.00 | W | +1.5u |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.50 | +105 | 1 | 1 | 2 | 2 | -3 | -0.90 | L | -2.5u |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 1 | 1 | 2 | 0 | -2 | -1.20 | W | +1.2u |
| 2026-05-19 | NBA | ML | home | 5.0 | 5.00 | -260 | 0 | 3 | 3 | 3 | 13 | -0.50 | W | +1.9u |
| 2026-05-19 | NBA | SPREAD | away | 5.0 | 2.25 | -105 | 3 | 2 | 5 | 2 | 1 | -0.90 | L | -2.3u |
| 2026-05-19 | NBA | TOTAL | under | 5.0 | 3.00 | -106 | 2 | 3 | 5 | 2 | 11 | 0.00 | L | -3.0u |
| 2026-05-20 | MLB | ML | away | 5.0 | 2.50 | +113 | 2 | 1 | 3 | 1 | -2 | -1.00 | L | -2.5u |
| 2026-05-20 | MLB | ML | home | 4.0 | 2.75 | -154 | 2 | 0 | 2 | 1 | 6 | -1.50 | W | +1.9u |
| 2026-05-20 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | -2 | 0.00 | L | -0.8u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | -140 | 1 | 1 | 2 | 1 | -2 | -1.10 | W | +0.9u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | +111 | 0 | 1 | 1 | -1 | -6 | 0.00 | W | +0.6u |
| 2026-05-20 | MLB | ML | away | 4.0 | 2.75 | +113 | 1 | 1 | 2 | 0 | -8 | -1.00 | L | -2.8u |
| 2026-05-20 | NBA | ML | home | 5.0 | 5.00 | -225 | 10 | 5 | 15 | 1 | 13 | -0.20 | W | +2.1u |
| 2026-05-20 | NBA | SPREAD | home | 5.0 | 3.00 | -106 | 6 | 1 | 7 | 4 | 46 | -0.70 | W | +2.7u |
| 2026-05-20 | NBA | TOTAL | over | 5.0 | 1.65 | -112 | 3 | 1 | 4 | 3 | 46 | 0.00 | W | +1.5u |
| 2026-05-20 | NHL | ML | home | 2.5 | 1.25 | -192 | 0 | 1 | 1 | 1 | -2 | -0.80 | L | -1.3u |
| 2026-05-21 | MLB | ML | home | 5.0 | 2.50 | +125 | 1 | 1 | 2 | 2 | -3 | -0.40 | L | -2.5u |
| 2026-05-21 | MLB | SPREAD | home | 3.0 | 0.75 | -148 | 0 | 0 | 0 | 1 | -2 | -1.50 | L | -0.8u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +172 | 2 | 0 | 2 | 1 | -2 | -0.50 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 4.5 | 2.75 | -110 | 2 | 1 | 3 | 1 | -2 | -0.50 | W | +2.5u |
| 2026-05-21 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 0 | 0 | 1 | 1 | 0.00 | W | +0.3u |
| 2026-05-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 3 | 1 | 4 | 2 | -2 | -0.40 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +129 | 1 | 0 | 1 | 3 | -1 | -0.40 | W | +1.6u |
| 2026-05-21 | MLB | SPREAD | away | 4.0 | 1.65 | -170 | 1 | 1 | 2 | 1 | 0 | 0.30 | W | +1.0u |
| 2026-05-21 | NBA | SPREAD | away | 5.0 | 3.00 | -110 | 4 | 2 | 6 | 3 | 16 | 0.70 | L | -3.0u |
| 2026-05-21 | NHL | ML | home | 4.0 | 2.75 | -197 | 4 | 1 | 5 | 2 | 7 | -1.30 | L | -2.8u |
| 2026-05-21 | NHL | TOTAL | over | 3.0 | 0.75 | +103 | 1 | 0 | 1 | 1 | 6 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 5.0 | 1.25 | -175 | 1 | 0 | 1 | 1 | 6 | -0.90 | L | -1.3u |
| 2026-05-22 | MLB | ML | home | 4.0 | 1.25 | -195 | 3 | 0 | 3 | 0 | 0 | 0.80 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 3.0 | 1.25 | -137 | 1 | 0 | 1 | 1 | -1 | 0.00 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -144 | 4 | 2 | 6 | 2 | 4 | -1.60 | L | -5.0u |
| 2026-05-22 | MLB | SPREAD | home | 5.0 | 0.75 | -155 | 2 | 0 | 2 | 1 | -2 | -0.30 | W | +0.4u |
| 2026-05-22 | MLB | ML | home | 5.0 | 2.75 | -158 | 1 | 0 | 1 | 1 | 6 | -0.80 | W | +1.7u |
| 2026-05-22 | MLB | SPREAD | home | 3.0 | 0.75 | -142 | 1 | 0 | 1 | 1 | -2 | -2.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -145 | 2 | 2 | 4 | 1 | 6 | -2.20 | L | -5.0u |
| 2026-05-22 | MLB | ML | home | 2.5 | 0.50 | +139 | 2 | 1 | 3 | 0 | -6 | -0.90 | W | +0.7u |
| 2026-05-22 | MLB | SPREAD | home | 4.0 | 1.65 | -119 | 1 | 1 | 2 | 1 | -2 | -1.20 | W | +1.3u |
| 2026-05-22 | MLB | ML | away | 5.0 | 1.50 | +185 | 3 | 0 | 3 | 2 | -3 | -1.10 | L | -1.5u |
| 2026-05-22 | MLB | SPREAD | away | 3.0 | 0.75 | -112 | 1 | 0 | 1 | 1 | -2 | -1.40 | W | +0.6u |
| 2026-05-22 | NBA | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | -3 | -37 | 0.00 | L | -5.0u |
| 2026-05-22 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 0 | 1 | -2 | -1 | -0.50 | L | -1.0u |
| 2026-05-22 | NBA | TOTAL | over | 5.0 | 0.75 | +101 | 2 | 1 | 3 | 1 | 12 | 0.00 | W | +0.7u |
| 2026-05-22 | NHL | ML | home | 4.5 | 3.75 | -167 | 4 | 3 | 7 | 5 | 6 | 0.00 | L | -3.8u |
| 2026-05-22 | NHL | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 1 | 4 | 3 | 0 | 0.00 | W | +2.5u |
| 2026-05-23 | MLB | ML | home | 2.5 | 0.50 | -181 | 1 | 0 | 1 | 1 | 14 | -1.70 | W | +0.3u |
| 2026-05-23 | MLB | ML | away | 2.5 | 2.75 | +109 | 2 | 0 | 2 | 2 | -3 | -0.50 | L | -2.8u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -110 | 0 | 1 | 1 | 0 | 6 | 0.00 | W | +0.3u |
| 2026-05-23 | MLB | ML | home | 5.0 | 1.00 | -148 | 0 | 0 | 0 | 1 | -1 | -0.20 | L | -1.0u |
| 2026-05-23 | MLB | SPREAD | away | 3.0 | 0.75 | -163 | 1 | 0 | 1 | 1 | -2 | 0.00 | W | +0.5u |
| 2026-05-23 | MLB | TOTAL | under | 5.0 | 3.00 | -110 | 3 | 1 | 4 | 2 | 0 | 0.00 | W | +2.7u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | -2 | -0.90 | L | -0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 1 | 3 | 1 | -2 | 0.00 | L | -0.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 1.50 | -209 | 0 | 0 | 0 | 2 | -4 | 29.00 | W | +2.5u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | +102 | 0 | 0 | 0 | 1 | -2 | 0.00 | W | +0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -2 | 0.00 | W | +0.7u |
| 2026-05-23 | MLB | ML | away | 2.5 | 1.25 | -111 | -1 | 1 | 0 | 1 | 1 | 0.40 | L | -1.3u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -135 | 0 | 0 | 0 | 1 | -2 | 0.40 | W | +0.6u |
| 2026-05-23 | MLB | TOTAL | under | 2.5 | 0.30 | +108 | 0 | 0 | 0 | 0 | -3 | 0.00 | P | +0.0u |
| 2026-05-23 | MLB | ML | home | 4.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | 1 | 1.10 | W | +2.9u |
| 2026-05-23 | MLB | ML | away | 3.0 | 1.25 | +166 | 2 | 1 | 3 | 2 | -1 | -0.30 | W | +1.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 2.25 | -123 | 1 | 0 | 1 | 2 | -2 | -0.90 | W | +1.6u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -111 | 1 | 0 | 1 | 0 | -7 | 0.00 | L | -0.3u |
| 2026-05-23 | NBA | SPREAD | home | 5.0 | 3.00 | -107 | 5 | 1 | 6 | 2 | 27 | 0.20 | L | -3.0u |
| 2026-05-23 | NBA | TOTAL | under | 5.0 | 3.00 | +102 | 1 | -1 | 0 | 6 | 11 | 0.00 | L | -3.0u |
| 2026-05-23 | NHL | ML | home | 5.0 | 5.00 | -205 | 8 | 0 | 8 | 5 | 15 | -0.70 | W | +2.4u |
| 2026-05-23 | NHL | TOTAL | under | 3.0 | 0.30 | -110 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.3u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._