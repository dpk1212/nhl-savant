# Sharp Intel v6 — Full Analysis

_Auto-generated **5/14/2026, 9:43:23 PM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 178 shipped+graded picks · 2026-04-18 → 2026-05-14  (HC analyses scoped to post-cutover 2026-04-30, 66 picks)
**Headline:** 84-92-2 · WR 47.7% [40.5%–55.1%] vs 52.4% break-even · -8.8u flat (-5.0%) · -20.0u peak.
**Overall t-test:** t = -0.62 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.156 ✓ p<.05**  (full sample, N=172)
- **ρ(HC, flat ROI) = 0.124 ✗**  (post-cutover, N=66)
- **ρ(Δw+HC, flat ROI) = -0.059 ✗**  (post-cutover, N=66)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)** — N=13, 3-10, WR 23.1% [8%–50%], flat ROI -55.1% (t=-2.33 ✓ p<.05)
- **Stale Δw ≤ 0 (full sample)** — N=36, 10-25, WR 28.6% [16%–45%], flat ROI -43.6% (t=-2.95 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=8, WR 50.0%, flat ROI -2.2%. Bayesian posterior WR ≈ 50.0%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=39, WR 59.0%, flat ROI +16.9%. Bayesian posterior WR ≈ 57.1%, half-Kelly = **5.0%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=13, WR 23.1%, flat ROI -55.1%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=35, WR 60.0%, flat ROI +28.2%. Bayesian posterior WR ≈ 57.8%, half-Kelly = **5.7%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -43.6% flat ROI on 36 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.06u/pick), we need **~1729 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 178. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-14 |
| Sides scanned | 404 |
| Shipped + graded | **178** |
| W-L-P | 84-92-2 |
| Win rate | **47.7%** [40.5%–55.1%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +4.7 pp |
| Peak-units PnL | **-20.0u** |
| Flat-1u PnL | **-8.8u** (-5.0% flat ROI) |
| Flat t-statistic vs zero | -0.62 → ✗ noise |
| Flat 95% CI per-pick | [-0.205, 0.106]u |

### Power note

At our observed flat-PnL standard deviation (1.06u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4802 |
| +5% | 1729 |
| +10% | 433 |

We have **178** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 28 | 9-18-1 | 33.3% [19–52] | -34.8% | -13.4u | -2.01 ✓ p<.05 |
| Δw = +1 | 61 | 34-26-1 | 56.7% [44–68] | +8.4% | +7.8u | 0.68 ✗ noise |
| Δw = +2 | 40 | 15-25-0 | 37.5% [24–53] | -22.4% | -18.8u | -1.38 ✗ noise |
| Δw ≥ +3 | 35 | 21-14-0 | 60.0% [44–74] | +28.2% | +6.5u | 1.27 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.137** ~ p<.10  ·  **ρ(Δw, flat ROI) = 0.156** ✓ p<.05  (N=172)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 17 | 6-10-1 | 37.5% [18–61] | -26.2% | -15.2u | -1.16 ✗ noise |
| HC = +1 | 39 | 23-16-0 | 59.0% [43–73] | +16.9% | +9.4u | 1.03 ✗ noise |
| HC = +2 | 7 | 4-3-0 | 57.1% [25–84] | +11.7% | +3.4u | 0.30 ✗ noise |
| HC ≥ +3 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.5u | 0.00 ✗ n<2 |

**Pearson ρ(HC, WIN) = 0.138** ✗  ·  **ρ(HC, flat ROI) = 0.124** ✗  (N=66)

Spearman rank ρ(HC, flat ROI) = 0.199.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Σ = +1 | 11 | 5-5-1 | 50.0% [24–76] | +0.0% | -0.4u | 0.00 ✗ noise |
| Σ = +2 | 29 | 18-11-0 | 62.1% [44–77] | +20.8% | +8.1u | 1.15 ✗ noise |
| Σ = +3 | 11 | 2-9-0 | 18.2% [5–48] | -55.1% | -15.4u | -1.78 ~ p<.10 |
| Σ = +4 | 5 | 3-2-0 | 60.0% [23–88] | +4.1% | -1.3u | 0.09 ✗ noise |
| Σ = +5 | 4 | 3-1-0 | 75.0% [30–95] | +46.8% | +5.6u | 0.96 ✗ noise |
| Σ ≥ +6 | 5 | 2-3-0 | 40.0% [12–77] | -21.9% | -4.8u | -0.46 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = -0.037** ✗  ·  **ρ(Σ, flat ROI) = -0.059** ✗  (N=66)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 66.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.121 ✗ | -0.140 ✗ | -0.105 | weak |
| HC margin | 0.138 ✗ | 0.124 ✗ | 0.199 | weak |
| Δw + HC | -0.037 ✗ | -0.059 ✗ | -0.005 | weak |
| peak.stars | -0.125 ✗ | -0.132 ✗ | -0.107 | weak |
| vault.star | -0.010 ✗ | 0.023 ✗ | -0.011 | weak |
| lock.stars | -0.115 ✗ | -0.143 ✗ | -0.101 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 66 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | — | N=6 · 3-2 · 60% [23–88] · +12%  | N=6 · 2-4 · 33% [10–70] · -35%  | N=5 · 1-4 · 20% [4–62] · -61%  |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=5 · 2-3 · 40% [12–77] · -14%  | N=21 · 16-5 · 76% [55–89] · +48% ★ | N=8 · 2-6 · 25% [7–59] · -38%  | N=4 · 3-1 · 75% [30–95] · +30%  |
| +2 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=1 · 0-1 · 0% [0–79] · —  | N=5 · 4-1 · 80% [38–96] · +56%  |
| ≥ +3 | — | — | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 17 | 6-10-1 | 37.5% [18–61] | -26.2% | -15.2u | -1.16 ✗ noise |
| HC = +1 | 39 | 23-16-0 | 59.0% [43–73] | +16.9% | +9.4u | 1.03 ✗ noise |
| HC = +2 | 7 | 4-3-0 | 57.1% [25–84] | +11.7% | +3.4u | 0.30 ✗ noise |
| HC ≥ +3 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.5u | 0.00 ✗ n<2 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 5 | 2-3-0 | 40.0% [12–77] | -14.0% | -0.1u | -0.26 ✗ noise |
| Δw = +1 | 28 | 19-8-1 | 70.4% [52–84] | +35.2% | +12.3u | 2.05 ✓ p<.05 |
| Δw = +2 | 15 | 4-11-0 | 26.7% [11–52] | -41.1% | -15.0u | -1.53 ✗ noise |
| Δw ≥ +3 | 17 | 8-9-0 | 47.1% [26–69] | -11.9% | -5.6u | -0.50 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 47 | 27-20-0 | 57.4% [43–70] | +13.7% | +9.3u | 0.92 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 13 | 3-10-0 | 23.1% [8–50] | -55.1% | -18.4u | -2.33 ✓ p<.05 |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 6 | 3-2-1 | 60.0% [23–88] | +11.7% | -0.3u | 0.31 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 158 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δcount = −1 | 9 | 1-8-0 | 11.1% [2–44] | -72.8% | -10.2u | -2.67 ✓ p<.01 |
| Δcount = 0 (balanced) | 16 | 5-11-0 | 31.3% [14–56] | -45.7% | -12.3u | -2.15 ✓ p<.05 |
| Δcount = +1 | 44 | 25-18-1 | 58.1% [43–72] | +14.6% | +5.9u | 0.98 ✗ noise |
| Δcount = +2 | 42 | 17-24-1 | 41.5% [28–57] | -20.2% | -11.4u | -1.35 ✗ noise |
| Δcount ≥ +3 (heavy support) | 46 | 30-16-0 | 65.2% [51–77] | +37.9% | +18.1u | 2.11 ✓ p<.05 |

**ρ(Δcount, WIN) = 0.244** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.283** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -2 · ≤ 1 · ≤ 4 · ≤ 14 · > 14

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 37 | 13-24-0 | 35.1% [22–51] | -31.8% | -16.9u | -2.04 ✓ p<.05 |
| Q2 | 32 | 12-19-1 | 38.7% [24–56] | -20.9% | -12.2u | -1.17 ✗ noise |
| Q3 (balanced) | 27 | 12-15-0 | 44.4% [28–63] | -11.3% | -12.9u | -0.57 ✗ noise |
| Q4 | 31 | 18-13-0 | 58.1% [41–74] | +13.5% | +6.0u | 0.71 ✗ noise |
| Q5 (best — heavy support) | 31 | 23-7-1 | 76.7% [59–88] | +57.5% | +25.6u | 2.78 ✓ p<.01 |

**ρ(ΔWlNet, WIN) = 0.315** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.288** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -2.31 · ≤ 0.84 · ≤ 3.68 · ≤ 11.94 · > 11.94

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 32 | 11-21-0 | 34.4% [20–52] | -34.9% | -14.7u | -2.14 ✓ p<.05 |
| Q2 | 32 | 11-20-1 | 35.5% [21–53] | -26.9% | -13.8u | -1.55 ✗ noise |
| Q3 | 32 | 13-19-0 | 40.6% [26–58] | -20.6% | -13.4u | -1.18 ✗ noise |
| Q4 | 31 | 21-10-0 | 67.7% [50–81] | +35.2% | +6.8u | 1.86 ~ p<.10 |
| Q5 | 31 | 22-8-1 | 73.3% [56–86] | +51.4% | +24.6u | 2.42 ✓ p<.05 |

**ρ(ΔFlatPnl, WIN) = 0.345** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.372** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -11.8 · ≤ -0.1 · ≤ 10.9 · ≤ 29.4 · > 29.4

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 32 | 7-24-1 | 22.6% [11–40] | -48.8% | -22.7u | -2.79 ✓ p<.01 |
| Q2 | 32 | 12-20-0 | 37.5% [23–55] | -26.4% | -13.0u | -1.53 ✗ noise |
| Q3 | 31 | 9-22-0 | 29.0% [16–47] | -43.0% | -31.1u | -2.62 ✓ p<.01 |
| Q4 | 32 | 25-6-1 | 80.6% [64–91] | +49.1% | +20.7u | 3.44 ✓ p<.01 |
| Q5 | 31 | 25-6-0 | 80.6% [64–91] | +71.4% | +35.8u | 3.56 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.447** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.432** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 16 | 2-14-0 | 12.5% [3–36] | -74.1% | -15.5u | -4.19 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 12 | 3-9-0 | 25.0% [9–53] | -50.5% | -9.2u | -1.91 ~ p<.10 |
| ΔBestRank = 0 (tied) | 0 | — | — | — | — | — |
| ΔBestRank ∈ [+1,+4] | 7 | 2-5-0 | 28.6% [8–64] | -47.5% | -7.6u | -1.40 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 23 | 14-8-1 | 63.6% [43–80] | +29.9% | +5.9u | 1.25 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.486** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.455** ✓ p<.01  (N=58)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 12 | 3-9-0 | 25.0% [9–53] | -33.4% | -2.6u | -0.89 ✗ noise |
| Δshare ∈ [−30,−10] pp | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.0u | 0.00 ✗ n<2 |
| Δshare ≈ 0 (±10 pp) | 100 | 41-57-2 | 41.8% [33–52] | -19.6% | -41.3u | -2.05 ✓ p<.05 |
| Δshare ∈ [+10,+30] pp | 10 | 5-5-0 | 50.0% [24–76] | -3.9% | +0.7u | -0.12 ✗ noise |
| Δshare ≥ +30 pp | 35 | 29-6-0 | 82.9% [67–92] | +72.9% | +35.8u | 4.07 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.305** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.263** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.447 ✓ p<.01 | 0.432 ✓ p<.01 | 0.443 |
| 2 | **ΔTopQCount** | 0.384 ✓ p<.01 | 0.406 ✓ p<.01 | 0.348 |
| 3 | **ΔFlatPnl** | 0.345 ✓ p<.01 | 0.372 ✓ p<.01 | 0.337 |
| 4 | **ΔWlNet** | 0.315 ✓ p<.01 | 0.288 ✓ p<.01 | 0.274 |
| 5 | **Δcount** | 0.244 ✓ p<.01 | 0.283 ✓ p<.01 | 0.204 |
| 6 | **ΔTopQShare** | 0.305 ✓ p<.01 | 0.263 ✓ p<.01 | 0.315 |

_(ΔBestRank uses N=58 subset where both sides had a proven wallet — ρ(flat ROI) = 0.455 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 339, dateRange = 2026-04-18 → 2026-05-14, computedAt = 2026-05-15T00:55:10.651Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **158** rows · PIT aggregate computable on **152** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **152** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 2 · 100% · +285.1% | 8 · 63% · +13.6% | -271.6pp |
| NEUTRAL (0..+3) | 84 · 58% · +11.1% | 89 · 51% · -1.2% | -12.2pp |
| WEAK (−3..0) | 39 · 39% · -22.1% | 33 · 44% · -12.8% | +9.3pp |
| FADE (<−3) | 18 · 22% · -55.5% | 13 · 38% · +4.2% | +59.7pp |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=45, WR=66%, ROI=+30.7% | N=79, WR=58%, ROI=+13.1% | -17.6pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=86, WR=59%, ROI=+17.4% | N=97, WR=52%, ROI=+0.0% | -17.4pp |
| AGS < −1 (mute veto) | N=23, WR=22%, ROI=-59.6% | N=16, WR=38%, ROI=+3.3% | +62.9pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-01 → 2026-05-14, N=61)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 5 · 80% · +42.6% |
| NEUTRAL (0..+3) | 44 · 48% · -5.6% |
| WEAK (−3..0) | 10 · 60% · +14.2% |
| FADE (<−3) | 2 · 0% · -100.0% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=44, WR=57%, ROI=+10.6% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=49, WR=51%, ROI=-0.7% |
| AGS < −1 (mute veto) | N=3, WR=0%, ROI=-100.0% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.47 | 1.55 |
| `dHcCount` | COUNT_HC | + | 0.47 | 0.83 |
| `dConvictionAvg` | INTENSITY | + | 0.55 | 0.56 |
| `dHcSizeRatio` | INTENSITY_HC | + | 1.64 | 5.47 |
| `forContribShare` | DOMINANCE | + | 0.82 | 0.25 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **152/178** shipped+graded rows (85%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -9.52 |
| 20th pct | -1.42 |
| 40th pct | 0.75 |
| Median | 1.09 |
| 60th pct | 1.30 |
| 80th pct | 1.86 |
| 90th pct | 2.64 |
| Max | 4.67 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 5 | 3.3% |
| **LOCK** | +5..+7 | 68 | 44.7% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 34 | 22.4% |
| **FADE** | < −3 | 16 | 10.5% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 5 | 4-1-0 | 80.0% [38–96] | +42.6% | +6.6u | 1.12 ✗ noise |
| LOCK | 68 | 36-32-0 | 52.9% [41–64] | +3.0% | -2.6u | 0.25 ✗ noise |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 34 | 12-21-1 | 36.4% [22–53] | -31.3% | -16.0u | -2.00 ✓ p<.05 |
| FADE | 16 | 6-10-0 | 37.5% [18–61] | +3.3% | -7.9u | 0.08 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.110** ✗ · r(ROI) = **0.022** ✗ · Spearman ρ(ROI) = **0.061**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 16 | 7-9-0 | 43.8% [23–67] | +14.7% | -5.5u | 0.36 ✗ noise |
| z ∈ [−1, 0) | 55 | 25-28-2 | 47.2% [34–60] | -8.9% | -8.1u | -0.68 ✗ noise |
| z ∈ [0, +1) | 55 | 23-32-0 | 41.8% [30–55] | -20.0% | -19.9u | -1.53 ✗ noise |
| z ≥ +1 (very positive) | 26 | 15-11-0 | 57.7% [39–74] | +10.5% | +12.0u | 0.54 ✗ noise |

#### `dHcCount` (COUNT_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 118 | 55-61-2 | 47.4% [39–56] | -8.2% | -18.4u | -0.91 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dConvictionAvg` (INTENSITY)

r(WIN) = **0.171** ✓ p<.05 · r(ROI) = **0.067** ✗ · Spearman ρ(ROI) = **0.136**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 15 | 3-12-0 | 20.0% [7–45] | -34.1% | -12.0u | -0.83 ✗ noise |
| z ∈ [−1, 0) | 35 | 18-16-1 | 52.9% [37–69] | +1.0% | -4.8u | 0.06 ✗ noise |
| z ∈ [0, +1) | 82 | 38-43-1 | 46.9% [36–58] | -7.8% | -4.5u | -0.71 ✗ noise |
| z ≥ +1 (very positive) | 20 | 11-9-0 | 55.0% [34–74] | +1.7% | -0.1u | 0.08 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 118 | 55-61-2 | 47.4% [39–56] | -8.2% | -18.4u | -0.91 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `forContribShare` (DOMINANCE)

r(WIN) = **0.109** ✗ · r(ROI) = **0.005** ✗ · Spearman ρ(ROI) = **0.092**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 11 | 4-7-0 | 36.4% [15–65] | +7.3% | -4.5u | 0.13 ✗ noise |
| z ∈ [−1, 0) | 38 | 14-23-1 | 37.8% [24–54] | -26.9% | -21.5u | -1.72 ~ p<.10 |
| z ∈ [0, +1) | 103 | 52-50-1 | 51.0% [41–60] | -1.3% | +4.6u | -0.14 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | 0.171 ✓ p<.05 | 0.067 ✗ | 0.136 |
| 2 | `forContribShare` | DOMINANCE | 0.109 ✗ | 0.005 ✗ | 0.092 |
| 3 | `dCount` | COUNT | 0.110 ✗ | 0.022 ✗ | 0.061 |
| 4 | `dHcCount` | COUNT_HC | NaN — | NaN — | NaN |
| 5 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | +0.226 | 0.795 | 32.0% | meaningful |
| 2 | `dConvictionAvg` | +0.143 | 0.766 | 30.9% | meaningful |
| 3 | `forContribShare` | +0.133 | 0.728 | 29.3% | meaningful |
| 4 | `dHcCount` | -0.127 | 0.127 | 5.1% | silent (<0.2) |
| 5 | `dHcSizeRatio` | -0.067 | 0.067 | 2.7% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcCount` | `dConvictionAvg` | `dHcSizeRatio` | `forContribShare` |
|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.360 | +0.331 | +0.360 | +0.553 |
| `dHcCount` | +0.360 | 1.000 | +0.194 | +1.000 ⚠ | +0.276 |
| `dConvictionAvg` | +0.331 | +0.194 | 1.000 | +0.194 | +0.877 ⚠ |
| `dHcSizeRatio` | +0.360 | +1.000 ⚠ | +0.194 | 1.000 | +0.276 |
| `forContribShare` | +0.553 | +0.276 | +0.877 ⚠ | +0.276 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.159**. At AGS ≥ +1 fires N=84, WR=56.0%, ROI=+8.5%. At AGS ≥ +null fires N=104, WR=49.5%, ROI=-4.9%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-84 ROI (matched cohort) | Top-84 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.139 | −0.020 | WR=49%, ROI=-5.1% | +13.7pp | N=69, WR=54%, ROI=+3.7% |
| `dHcCount` | +0.154 | −0.005 | WR=55%, ROI=+5.5% | +3.1pp | N=89, WR=53%, ROI=+2.4% |
| `dConvictionAvg` | +0.090 | −0.069 | WR=48%, ROI=-8.2% | +16.8pp | N=54, WR=50%, ROI=-3.4% |
| `dHcSizeRatio` | +0.164 | +0.005 | WR=55%, ROI=+5.5% | +3.1pp | N=87, WR=54%, ROI=+4.8% |
| `forContribShare` | +0.152 | −0.007 | WR=56%, ROI=+7.1% | +1.5pp | N=49, WR=55%, ROI=+4.8% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dConvictionAvg` | −0.069 | +16.8pp | carries marginal info |
| 2 | `dCount` | −0.020 | +13.7pp | carries marginal info |
| 3 | `forContribShare` | −0.007 | +1.5pp | mild marginal info |
| 4 | `dHcCount` | −0.005 | +3.1pp | mild marginal info |
| 5 | `dHcSizeRatio` | +0.005 | +3.1pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | +0.344 | 0.344 | positive ↑ |
| 2 | `forContribShare` | DOMINANCE | -0.139 | 0.139 | negative ↓ |
| 3 | `dCount` | COUNT | +0.126 | 0.126 | positive ↑ |
| 4 | `dHcCount` | COUNT_HC | -0.025 | 0.025 | flat ≈ 0 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | -0.013 | 0.013 | flat ≈ 0 |

Intercept b = -0.226 · Final log-loss = 0.6730 · N = 152.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | #1 | #2 | #1 | #1 | 1.25 |
| 2 | `dCount` | COUNT | #3 | #1 | #2 | #3 | 2.25 |
| 3 | `forContribShare` | DOMINANCE | #2 | #3 | #3 | #2 | 2.50 |
| 4 | `dHcCount` | COUNT_HC | #4 | #4 | #4 | #4 | 4.00 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | #5 | #5 | #5 | #5 | 5.00 |

#### Plain-English summary

- **Workhorse**: `dConvictionAvg` (INTENSITY) — ranks #1/#2/#1/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dHcSizeRatio` (INTENSITY_HC) — composite avg rank 5.00. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dHcCount` ↔ `dHcSizeRatio` (r=+1.00); `dConvictionAvg` ↔ `forContribShare` (r=+0.88). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dHcCount`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **v9 simplification candidate**: only `dCount`, `dConvictionAvg` carry marginal info (Spearman ρ drop > 0.01 when removed). The other 4 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=152 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 152 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/152 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 50 | 24-26-0 | 48.0% [35–61] | -14.2% | -14.9u | -1.07 ✗ noise |
| 4.5★ | 17 | 9-8-0 | 52.9% [31–74] | +11.1% | +2.3u | 0.39 ✗ noise |
| 4.0★ | 28 | 13-14-1 | 48.1% [31–66] | -0.6% | -2.6u | -0.03 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 17 | 6-10-1 | 37.5% [18–61] | -21.7% | -4.5u | -0.89 ✗ noise |
| 2.5★ | 28 | 13-15-0 | 46.4% [30–64] | -11.1% | -4.1u | -0.60 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 1/0%/-100% | 4/0%/-100% | 6/33%/-26% | 9/38%/-26% | 12/25%/-51% |
| Δw = +1 | 2/100%/+61% | 5/40%/-24% | 13/67%/+32% | 28/54%/+4% | 2/0%/-100% | 10/60%/+9% |
| Δw = +2 | 19/37%/-26% | 4/50%/-3% | 10/40%/-13% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 24/50%/-13% | 4/75%/+90% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | — |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 5 | 2-3-0 | 40.0% [12–77] | -46.3% | -1.0u | -1.41 ✗ noise |
| −200/−151 | 13 | 4-9-0 | 30.8% [13–58] | -50.5% | -13.8u | -2.35 ✓ p<.05 |
| −150/−101 | 104 | 52-51-1 | 50.5% [41–60] | -3.7% | +6.1u | -0.40 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 37 | 17-19-1 | 47.2% [32–63] | +3.6% | -15.2u | 0.20 ✗ noise |
| +151/+200 | 3 | 2-1-0 | 66.7% [21–94] | +86.0% | +2.1u | 0.92 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -67% (4) | — | — | +34% (1) |
| −200/−151 | -100% (5) | +20% (4) | -100% (1) | -100% (2) |
| −150/−101 | -38% (20) | +17% (39) | -39% (25) | +35% (17) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +63% (4) | -15% (14) | +17% (11) | -11% (8) |
| +151/+200 | — | +160% (1) | +198% (1) | — |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 95 | 43-52-0 | 45.3% [36–55] | -7.7% | -27.8u | -0.65 ✗ noise |
| SPREAD | 31 | 13-17-1 | 43.3% [27–61] | -15.5% | +1.6u | -0.90 ✗ noise |
| TOTAL | 52 | 28-23-1 | 54.9% [41–68] | +6.2% | +6.2u | 0.47 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=16 · 19% · -64% | N=33 · 55% · +4% | N=20 · 35% · -22% | N=23 · 57% · +27% |
| SPREAD | N=10 · 22% · -51% | N=8 · 38% · -27% | N=7 · 57% · +10% | N=5 · 60% · +17% |
| TOTAL | N=10 · 50% · -3% | N=20 · 68% · +30% | N=13 · 31% · -40% | N=7 · 71% · +39% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 65 | 27-38-0 | 41.5% [30–54] | -19.1% | -19.3u | -1.59 ✗ noise |
| NBA | 90 | 45-44-1 | 50.6% [40–61] | +1.9% | +2.4u | 0.16 ✗ noise |
| NHL | 23 | 12-10-1 | 54.5% [35–73] | +8.2% | -3.1u | 0.39 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=8 · 25% · -45% | N=28 · 54% · +2% | N=18 · 22% · -54% | N=10 · 50% · -2% |
| NBA | N=24 · 26% · -50% | N=22 · 59% · +16% | N=15 · 53% · +10% | N=24 · 63% · +36% |
| NHL | N=4 · 50% · -0% | N=11 · 60% · +10% | N=7 · 43% · -9% | N=1 · 100% · +145% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 106 · 43% · -11.1% · -1.03 ✗ noise | 71 · 54% · +2.2% · 0.19 ✗ noise |
| **plusEV** | 24 · 38% · -17.9% · -0.64 ✗ noise | 153 · 49% · -3.9% · -0.48 ✗ noise |
| **pinnacleConfirms** | 50 · 46% · -5.2% · -0.31 ✗ noise | 58 · 43% · -14.6% · -1.06 ✗ noise |
| **invested10kPlus** | 94 · 44% · -10.8% · -0.92 ✗ noise | 14 · 50% · -6.6% · -0.25 ✗ noise |
| **lineMovingWith** | 101 · 50% · -0.6% · -0.05 ✗ noise | 76 · 44% · -12.7% · -1.07 ✗ noise |
| **predMarketAligns** | 39 · 49% · -4.5% · -0.24 ✗ noise | 69 · 42% · -13.5% · -1.04 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 28 | 17-11-0 | 60.7% [42–76] | +18.0% | +4.6u | 0.97 ✗ noise |
| 1 | 36 | 16-19-1 | 45.7% [30–62] | -12.4% | -5.5u | -0.78 ✗ noise |
| 2 | 50 | 24-25-1 | 49.0% [36–63] | +1.3% | +6.6u | 0.09 ✗ noise |
| 3 | 22 | 9-13-0 | 40.9% [23–61] | -23.5% | -11.5u | -1.13 ✗ noise |
| 4 | 20 | 6-14-0 | 30.0% [15–52] | -38.6% | -17.8u | -1.78 ~ p<.10 |
| 5 | 16 | 10-6-0 | 62.5% [39–82] | +4.3% | +3.5u | 0.20 ✗ noise |
| 6 | 6 | 2-4-0 | 33.3% [10–70] | +35.8% | +0.1u | 0.37 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 43 | 27-15-1 | 64.3% [49–77] | +17.7% | +20.5u | 1.27 ✗ noise |
| NEAR_START | 84 | 36-47-1 | 43.4% [33–54] | -8.1% | -22.7u | -0.64 ✗ noise |
| NO_MOVE | 6 | 2-4-0 | 33.3% [10–70] | -36.2% | -1.1u | -0.90 ✗ noise |
| PREGAME | 17 | 9-8-0 | 52.9% [31–74] | -1.1% | +1.0u | -0.04 ✗ noise |
| SMALL_MOVE | 26 | 8-18-0 | 30.8% [17–50] | -36.8% | -20.1u | -1.87 ~ p<.10 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 103 | 48-54-1 | 47.1% [38–57] | -11.9% | -17.9u | -1.28 ✗ noise |
| STRONG | 39 | 19-20-0 | 48.7% [34–64] | -3.8% | -2.6u | -0.24 ✗ noise |
| LEAN | 32 | 15-16-1 | 48.4% [32–65] | +14.2% | -0.8u | 0.57 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.108 ✗ | -0.049 ✗ | -0.081 | -0.65 |
| totalInvested | -0.126 ~ p<.10 | -0.111 ✗ | -0.042 | -1.48 |
| evEdge | 0.057 ✗ | 0.063 ✗ | 0.069 | 0.84 |
| moneyPct | -0.001 ✗ | -0.080 ✗ | -0.050 | -1.06 |
| walletPct | 0.070 ✗ | 0.024 ✗ | 0.023 | 0.32 |
| criteriaMet | -0.074 ✗ | -0.044 ✗ | -0.111 | -0.58 |
| maxContribFor | 0.049 ✗ | 0.060 ✗ | 0.095 | 0.80 |
| meanBaseFor | 0.008 ✗ | 0.020 ✗ | 0.055 | 0.26 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **170** picks. Mean CLV = **-0.0031**.
t-statistic vs zero: -2.60 → ✓ p<.01 · 95% CI [-0.0055, -0.0008]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 14 | 7-7-0 | 50.0% [27–73] | -12.4% | +1.1u | -0.51 ✗ noise |
| CLV (−2%, 0] | 94 | 43-49-2 | 46.7% [37–57] | -7.4% | -18.5u | -0.71 ✗ noise |
| CLV (0, +2%] | 51 | 25-26-0 | 49.0% [36–62] | +5.8% | -0.0u | 0.34 ✗ noise |
| CLV > +2% | 11 | 4-7-0 | 36.4% [15–65] | -37.7% | -8.8u | -1.39 ✗ noise |

ρ(CLV, flat ROI) = -0.040 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=67 (with all features non-null). Intercept β₀ = 0.048.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔAvgRoi | +0.621 | ↑ helps |
| 2 | sharpCount | -0.522 | ↓ hurts |
| 3 | pw.ΔFlatPnl | +0.512 | ↑ helps |
| 4 | pw.Δcount | +0.512 | ↑ helps |
| 5 | evEdge | +0.471 | ↑ helps |
| 6 | Δw | -0.428 | ↓ hurts |
| 7 | pw.ΔWlNet | +0.425 | ↑ helps |
| 8 | moneyPct | -0.352 | ↓ hurts |
| 9 | odds (American) | -0.328 | ↓ hurts |
| 10 | pw.ΔTopQShare | +0.317 | ↑ helps |
| 11 | Δw + HC | -0.305 | ↓ hurts |
| 12 | peak.stars | -0.242 | ↓ hurts |
| 13 | vault.star | +0.145 | ↑ helps |
| 14 | log(impliedProb) | +0.143 | ↑ helps |
| 15 | HC margin | +0.107 | ↑ helps |
| 16 | log10(invested) | -0.094 | ↓ hurts |
| 17 | walletPct | -0.065 | ↓ hurts |
| 18 | criteriaMet | -0.039 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 8 | 4-4 | 50.0% | 50.0% | -105 | — (mute) | 3.44u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 39 | 23-16 | 59.0% | 57.1% | -106 | 5.86% bankroll | 1.61u | **UNDER-SIZED** — ship up to 5.86u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 13 | 3-10 | 23.1% | 34.8% | -105 | — (mute) | 2.08u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 35 | 21-14 | 60.0% | 57.8% | -105 | 6.72% bankroll | 2.66u | **UNDER-SIZED** — ship up to 6.72u (1u=1% bankroll) |
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
| 2026-05-13 | 6 | 4-2 | +3.2u | -18.3u |
| 2026-05-14 | 2 | 0-2 | -1.7u | -20.0u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -28.6u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.161  (annualized × √252 ≈ -2.55)

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
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 2 | 4 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | 0 | 0.00 | L | -0.5u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._