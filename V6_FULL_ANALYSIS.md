# Sharp Intel v6 — Full Analysis

_Auto-generated **5/19/2026, 12:13:19 PM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 213 shipped+graded picks · 2026-04-18 → 2026-05-18  (HC analyses scoped to post-cutover 2026-04-30, 101 picks)
**Headline:** 102-109-2 · WR 48.3% [41.7%–55.1%] vs 52.4% break-even · -8.3u flat (-3.9%) · -34.7u peak.
**Overall t-test:** t = -0.54 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.167 ✓ p<.05**  (full sample, N=207)
- **ρ(HC, flat ROI) = 0.029 ✗**  (post-cutover, N=101)
- **ρ(Δw+HC, flat ROI) = -0.005 ✗**  (post-cutover, N=101)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)** — N=19, 6-13, WR 31.6% [15%–54%], flat ROI -39.1% (t=-1.83 ~ p<.10)
- **Stale Δw ≤ 0 (full sample)** — N=42, 12-29, WR 29.3% [18%–44%], flat ROI -42.6% (t=-3.12 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=13, WR 38.5%, flat ROI -23.3%. Bayesian posterior WR ≈ 43.5%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=58, WR 58.6%, flat ROI +16.7%. Bayesian posterior WR ≈ 57.4%, half-Kelly = **5.2%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=19, WR 31.6%, flat ROI -39.1%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=45, WR 60.0%, flat ROI +29.2%. Bayesian posterior WR ≈ 58.2%, half-Kelly = **6.1%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -42.6% flat ROI on 42 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.05u/pick), we need **~1703 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 213. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-18 |
| Sides scanned | 482 |
| Shipped + graded | **213** |
| W-L-P | 102-109-2 |
| Win rate | **48.3%** [41.7%–55.1%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +4.0 pp |
| Peak-units PnL | **-34.7u** |
| Flat-1u PnL | **-8.3u** (-3.9% flat ROI) |
| Flat t-statistic vs zero | -0.54 → ✗ noise |
| Flat 95% CI per-pick | [-0.180, 0.103]u |

### Power note

At our observed flat-PnL standard deviation (1.05u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4729 |
| +5% | 1703 |
| +10% | 426 |

We have **213** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 34 | 11-22-1 | 33.3% [20–50] | -35.2% | -16.5u | -2.25 ✓ p<.05 |
| Δw = +1 | 67 | 38-28-1 | 57.6% [46–69] | +9.8% | +10.3u | 0.84 ✗ noise |
| Δw = +2 | 53 | 21-32-0 | 39.6% [28–53] | -20.6% | -25.1u | -1.49 ✗ noise |
| Δw ≥ +3 | 45 | 27-18-0 | 60.0% [45–73] | +29.2% | -1.4u | 1.55 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.140** ✓ p<.05  ·  **ρ(Δw, flat ROI) = 0.167** ✓ p<.05  (N=207)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 28 | 12-15-1 | 44.4% [28–63] | -14.8% | -17.7u | -0.82 ✗ noise |
| HC = +1 | 58 | 34-24-0 | 58.6% [46–70] | +16.7% | +7.6u | 1.25 ✗ noise |
| HC = +2 | 11 | 5-6-0 | 45.5% [21–72] | -9.3% | -6.3u | -0.30 ✗ noise |
| HC ≥ +3 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -4.3u | 0.00 ✗ noise |

**Pearson ρ(HC, WIN) = 0.028** ✗  ·  **ρ(HC, flat ROI) = 0.029** ✗  (N=101)

Spearman rank ρ(HC, flat ROI) = 0.101.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.6u | 0.00 ✗ noise |
| Σ = +1 | 20 | 10-9-1 | 52.6% [32–73] | +1.8% | +2.4u | 0.08 ✗ noise |
| Σ = +2 | 37 | 22-15-0 | 59.5% [43–74] | +15.4% | +4.1u | 0.95 ✗ noise |
| Σ = +3 | 15 | 5-10-0 | 33.3% [15–58] | -31.8% | -10.3u | -1.18 ✗ noise |
| Σ = +4 | 13 | 7-6-0 | 53.8% [29–77] | +6.8% | -10.7u | 0.23 ✗ noise |
| Σ = +5 | 8 | 4-4-0 | 50.0% [22–78] | +0.3% | -1.9u | 0.01 ✗ noise |
| Σ ≥ +6 | 6 | 3-3-0 | 50.0% [19–81] | +5.9% | -4.1u | 0.12 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = -0.016** ✗  ·  **ρ(Σ, flat ROI) = -0.005** ✗  (N=101)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 101.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.036 ✗ | -0.022 ✗ | 0.001 | weak |
| HC margin | 0.028 ✗ | 0.029 ✗ | 0.101 | weak |
| Δw + HC | -0.016 ✗ | -0.005 ✗ | 0.045 | weak |
| peak.stars | -0.152 ✗ | -0.168 ~ p<.10 | -0.155 | weak |
| vault.star | -0.128 ✗ | -0.104 ✗ | -0.126 | weak |
| lock.stars | -0.095 ✗ | -0.132 ✗ | -0.128 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 101 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=10 · 6-3 · 67% [35–88] · +23%  | N=12 · 5-7 · 42% [19–68] · -20%  | N=5 · 1-4 · 20% [4–62] · -61%  |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=10 · 4-6 · 40% [17–69] · -19%  | N=23 · 17-6 · 74% [54–87] · +44% ★ | N=12 · 5-7 · 42% [19–68] · -15%  | N=12 · 8-4 · 67% [39–86] · +36%  |
| +2 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=3 · 0-3 · 0% [0–56] · -100%  | N=7 · 5-2 · 71% [36–92] · +42%  |
| ≥ +3 | — | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=1 · 0-1 · 0% [0–79] · —  |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 28 | 12-15-1 | 44.4% [28–63] | -14.8% | -17.7u | -0.82 ✗ noise |
| HC = +1 | 58 | 34-24-0 | 58.6% [46–70] | +16.7% | +7.6u | 1.25 ✗ noise |
| HC = +2 | 11 | 5-6-0 | 45.5% [21–72] | -9.3% | -6.3u | -0.30 ✗ noise |
| HC ≥ +3 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -4.3u | 0.00 ✗ noise |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 11 | 4-7-0 | 36.4% [15–65] | -26.5% | -3.1u | -0.86 ✗ noise |
| Δw = +1 | 34 | 23-10-1 | 69.7% [53–83] | +33.3% | +14.9u | 2.15 ✓ p<.05 |
| Δw = +2 | 28 | 10-18-0 | 35.7% [21–54] | -29.1% | -21.4u | -1.54 ✗ noise |
| Δw ≥ +3 | 27 | 14-13-0 | 51.9% [34–69] | +4.7% | -13.5u | 0.23 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 71 | 39-32-0 | 54.9% [43–66] | +9.4% | -3.0u | 0.77 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 19 | 6-13-0 | 31.6% [15–54] | -39.1% | -21.6u | -1.83 ~ p<.10 |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 11 | 6-4-1 | 60.0% [31–83] | +11.5% | +0.5u | 0.41 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 193 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δcount = −1 | 9 | 1-8-0 | 11.1% [2–44] | -72.8% | -10.2u | -2.67 ✓ p<.01 |
| Δcount = 0 (balanced) | 19 | 6-13-0 | 31.6% [15–54] | -44.2% | -14.3u | -2.24 ✓ p<.05 |
| Δcount = +1 | 48 | 27-20-1 | 57.4% [43–70] | +13.1% | +5.2u | 0.92 ✗ noise |
| Δcount = +2 | 58 | 25-32-1 | 43.9% [32–57] | -15.4% | -15.2u | -1.19 ✗ noise |
| Δcount ≥ +3 (heavy support) | 58 | 37-21-0 | 63.8% [51–75] | +33.8% | +9.9u | 2.18 ✓ p<.05 |

**ρ(Δcount, WIN) = 0.231** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.272** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -2 · ≤ 0 · ≤ 4 · ≤ 12 · > 12

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 44 | 17-27-0 | 38.6% [26–53] | -22.2% | -17.1u | -1.46 ✗ noise |
| Q2 | 37 | 16-20-1 | 44.4% [30–60] | -9.2% | -4.2u | -0.54 ✗ noise |
| Q3 (balanced) | 42 | 19-23-0 | 45.2% [31–60] | -12.0% | -32.5u | -0.78 ✗ noise |
| Q4 | 33 | 21-12-0 | 63.6% [47–78] | +22.7% | +13.4u | 1.26 ✗ noise |
| Q5 (best — heavy support) | 37 | 23-13-1 | 63.9% [48–78] | +31.9% | +15.4u | 1.61 ✗ noise |

**ρ(ΔWlNet, WIN) = 0.180** ✓ p<.05  ·  **ρ(ΔWlNet, flat ROI) = 0.157** ✓ p<.05

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -2.30 · ≤ 0.15 · ≤ 2.76 · ≤ 9.40 · > 9.40

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 39 | 16-23-0 | 41.0% [27–57] | -17.2% | -12.6u | -1.05 ✗ noise |
| Q2 | 40 | 14-25-1 | 35.9% [23–52] | -29.0% | -20.6u | -1.94 ~ p<.10 |
| Q3 | 38 | 17-21-0 | 44.7% [30–60] | -15.5% | -17.4u | -0.99 ✗ noise |
| Q4 | 38 | 24-14-0 | 63.2% [47–77] | +19.7% | +3.6u | 1.28 ✗ noise |
| Q5 | 38 | 25-12-1 | 67.6% [51–80] | +46.8% | +21.8u | 2.28 ✓ p<.05 |

**ρ(ΔFlatPnl, WIN) = 0.221** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.248** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -8.8 · ≤ 0.1 · ≤ 9.8 · ≤ 28.9 · > 28.9

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 40 | 11-28-1 | 28.2% [17–44] | -38.1% | -27.8u | -2.34 ✓ p<.05 |
| Q2 | 39 | 17-22-0 | 43.6% [29–59] | -16.0% | -10.7u | -1.02 ✗ noise |
| Q3 | 37 | 11-26-0 | 29.7% [17–46] | -42.2% | -37.5u | -2.82 ✓ p<.01 |
| Q4 | 39 | 29-9-1 | 76.3% [61–87] | +43.3% | +24.6u | 3.13 ✓ p<.01 |
| Q5 | 38 | 28-10-0 | 73.7% [58–85] | +55.9% | +26.4u | 3.00 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.375** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.367** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 18 | 3-15-0 | 16.7% [6–39] | -62.3% | -15.5u | -3.02 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 13 | 4-9-0 | 30.8% [13–58] | -39.1% | -8.7u | -1.46 ✗ noise |
| ΔBestRank = 0 (tied) | 2 | 2-0-0 | 100.0% [34–100] | +90.9% | +0.5u | 0.00 ✗ noise |
| ΔBestRank ∈ [+1,+4] | 9 | 2-7-0 | 22.2% [6–55] | -59.1% | -9.3u | -2.19 ✓ p<.05 |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 30 | 17-12-1 | 58.6% [41–74] | +21.5% | +2.7u | 1.03 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.349** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.320** ✓ p<.01  (N=72)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 12 | 3-9-0 | 25.0% [9–53] | -33.4% | -2.6u | -0.89 ✗ noise |
| Δshare ∈ [−30,−10] pp | 2 | 1-1-0 | 50.0% [9–91] | +32.5% | -2.2u | 0.25 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 121 | 53-66-2 | 44.5% [36–53] | -15.3% | -46.0u | -1.76 ~ p<.10 |
| Δshare ∈ [+10,+30] pp | 15 | 8-7-0 | 53.3% [30–75] | +7.9% | -0.8u | 0.29 ✗ noise |
| Δshare ≥ +30 pp | 43 | 31-12-0 | 72.1% [57–83] | +50.6% | +26.4u | 2.91 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.213** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.184** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.375 ✓ p<.01 | 0.367 ✓ p<.01 | 0.349 |
| 2 | **ΔTopQCount** | 0.272 ✓ p<.01 | 0.300 ✓ p<.01 | 0.258 |
| 3 | **Δcount** | 0.231 ✓ p<.01 | 0.272 ✓ p<.01 | 0.194 |
| 4 | **ΔFlatPnl** | 0.221 ✓ p<.01 | 0.248 ✓ p<.01 | 0.216 |
| 5 | **ΔTopQShare** | 0.213 ✓ p<.01 | 0.184 ✓ p<.01 | 0.227 |
| 6 | **ΔWlNet** | 0.180 ✓ p<.05 | 0.157 ✓ p<.05 | 0.159 |

_(ΔBestRank uses N=72 subset where both sides had a proven wallet — ρ(flat ROI) = 0.320 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 413, dateRange = 2026-04-18 → 2026-05-18, computedAt = 2026-05-19T16:03:30.841Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **193** rows · PIT aggregate computable on **187** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **187** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 2 · 100% · +285.1% | 8 · 63% · +13.6% | -271.6pp |
| NEUTRAL (0..+3) | 107 · 57% · +8.7% | 112 · 53% · +3.0% | -5.7pp |
| WEAK (−3..0) | 54 · 42% · -16.6% | 42 · 39% · -21.2% | -4.6pp |
| FADE (<−3) | 15 · 20% · -60.6% | 16 · 44% · +8.5% | +69.2pp |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=69, WR=60%, ROI=+18.8% | N=96, WR=57%, ROI=+10.4% | -8.4pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=109, WR=57%, ROI=+13.7% | N=120, WR=54%, ROI=+3.7% | -10.0pp |
| AGS < −1 (mute veto) | N=24, WR=21%, ROI=-61.3% | N=22, WR=41%, ROI=+4.5% | +65.8pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-05 → 2026-05-18, N=77)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 3 · 100% · +72.6% |
| NEUTRAL (0..+3) | 55 · 51% · +0.3% |
| WEAK (−3..0) | 16 · 44% · -9.1% |
| FADE (<−3) | 3 · 67% · +27.3% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=49, WR=55%, ROI=+6.2% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=58, WR=53%, ROI=+4.1% |
| AGS < −1 (mute veto) | N=7, WR=43%, ROI=-7.6% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.42 | 1.58 |
| `dHcCount` | COUNT_HC | + | 0.44 | 0.83 |
| `dConvictionAvg` | INTENSITY | + | 0.54 | 0.55 |
| `dHcSizeRatio` | INTENSITY_HC | + | 1.46 | 5.19 |
| `forContribShare` | DOMINANCE | + | 0.81 | 0.25 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **187/213** shipped+graded rows (88%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -9.46 |
| 20th pct | -1.53 |
| 40th pct | 0.81 |
| Median | 1.16 |
| 60th pct | 1.30 |
| 80th pct | 1.93 |
| 90th pct | 2.43 |
| Max | 4.67 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 5 | 2.7% |
| **LOCK** | +5..+7 | 96 | 51.3% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 34 | 18.2% |
| **FADE** | < −3 | 21 | 11.2% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 5 | 4-1-0 | 80.0% [38–96] | +42.6% | +6.6u | 1.12 ✗ noise |
| LOCK | 96 | 49-47-0 | 51.0% [41–61] | -2.2% | -21.7u | -0.22 ✗ noise |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 34 | 12-21-1 | 36.4% [22–53] | -30.4% | -12.1u | -1.92 ~ p<.10 |
| FADE | 21 | 9-12-0 | 42.9% [24–63] | +9.5% | -9.8u | 0.29 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.110** ✗ · r(ROI) = **0.043** ✗ · Spearman ρ(ROI) = **0.063**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 21 | 9-12-0 | 42.9% [24–63] | +5.6% | -9.7u | 0.17 ✗ noise |
| z ∈ [−1, 0) | 65 | 31-32-2 | 49.2% [37–61] | -3.8% | -4.9u | -0.31 ✗ noise |
| z ∈ [0, +1) | 68 | 28-40-0 | 41.2% [30–53] | -21.8% | -33.2u | -1.88 ~ p<.10 |
| z ≥ +1 (very positive) | 33 | 20-13-0 | 60.6% [44–75] | +17.8% | +11.5u | 1.03 ✗ noise |

#### `dHcCount` (COUNT_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 153 | 73-78-2 | 48.3% [41–56] | -6.0% | -33.2u | -0.75 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dConvictionAvg` (INTENSITY)

r(WIN) = **0.141** ~ p<.10 · r(ROI) = **0.043** ✗ · Spearman ρ(ROI) = **0.094**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 21 | 6-15-0 | 28.6% [14–50] | -21.5% | -13.9u | -0.67 ✗ noise |
| z ∈ [−1, 0) | 45 | 22-22-1 | 50.0% [36–64] | -2.8% | -11.0u | -0.18 ✗ noise |
| z ∈ [0, +1) | 98 | 48-49-1 | 49.5% [40–59] | -3.4% | -5.0u | -0.34 ✗ noise |
| z ≥ +1 (very positive) | 23 | 12-11-0 | 52.2% [33–71] | -5.2% | -6.3u | -0.26 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 153 | 73-78-2 | 48.3% [41–56] | -6.0% | -33.2u | -0.75 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `forContribShare` (DOMINANCE)

r(WIN) = **0.105** ✗ · r(ROI) = **0.006** ✗ · Spearman ρ(ROI) = **0.073**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 16 | 7-9-0 | 43.8% [23–67] | +14.2% | -6.4u | 0.35 ✗ noise |
| z ∈ [−1, 0) | 48 | 17-30-1 | 36.2% [24–50] | -28.5% | -28.1u | -2.02 ✓ p<.05 |
| z ∈ [0, +1) | 123 | 64-58-1 | 52.5% [44–61] | +0.9% | -1.6u | 0.11 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | 0.141 ~ p<.10 | 0.043 ✗ | 0.094 |
| 2 | `forContribShare` | DOMINANCE | 0.105 ✗ | 0.006 ✗ | 0.073 |
| 3 | `dCount` | COUNT | 0.110 ✗ | 0.043 ✗ | 0.063 |
| 4 | `dHcCount` | COUNT_HC | NaN — | NaN — | NaN |
| 5 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | +0.219 | 0.786 | 32.3% | meaningful |
| 2 | `dConvictionAvg` | +0.103 | 0.772 | 31.7% | meaningful |
| 3 | `forContribShare` | +0.105 | 0.731 | 30.0% | meaningful |
| 4 | `dHcCount` | -0.097 | 0.097 | 4.0% | silent (<0.2) |
| 5 | `dHcSizeRatio` | -0.051 | 0.051 | 2.1% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcCount` | `dConvictionAvg` | `dHcSizeRatio` | `forContribShare` |
|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.299 | +0.280 | +0.299 | +0.516 |
| `dHcCount` | +0.299 | 1.000 | +0.149 | +1.000 ⚠ | +0.218 |
| `dConvictionAvg` | +0.280 | +0.149 | 1.000 | +0.149 | +0.879 ⚠ |
| `dHcSizeRatio` | +0.299 | +1.000 ⚠ | +0.149 | 1.000 | +0.218 |
| `forContribShare` | +0.516 | +0.218 | +0.879 ⚠ | +0.218 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.123**. At AGS ≥ +1 fires N=101, WR=55.4%, ROI=+6.8%. At AGS ≥ +null fires N=127, WR=51.6%, ROI=-0.5%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-101 ROI (matched cohort) | Top-101 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.096 | −0.027 | WR=53%, ROI=+1.5% | +5.2pp | N=86, WR=52%, ROI=+0.8% |
| `dHcCount` | +0.114 | −0.010 | WR=54%, ROI=+4.2% | +2.6pp | N=105, WR=53%, ROI=+2.7% |
| `dConvictionAvg` | +0.093 | −0.030 | WR=51%, ROI=-2.7% | +9.5pp | N=71, WR=51%, ROI=-1.9% |
| `dHcSizeRatio` | +0.118 | −0.005 | WR=54%, ROI=+4.2% | +2.6pp | N=104, WR=54%, ROI=+3.7% |
| `forContribShare` | +0.129 | +0.005 | WR=57%, ROI=+10.1% | -3.3pp | N=60, WR=53%, ROI=+2.4% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dConvictionAvg` | −0.030 | +9.5pp | carries marginal info |
| 2 | `dCount` | −0.027 | +5.2pp | carries marginal info |
| 3 | `dHcCount` | −0.010 | +2.6pp | mild marginal info |
| 4 | `dHcSizeRatio` | −0.005 | +2.6pp | mild marginal info |
| 5 | `forContribShare` | +0.005 | -3.3pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | +0.247 | 0.247 | positive ↑ |
| 2 | `dCount` | COUNT | +0.129 | 0.129 | positive ↑ |
| 3 | `forContribShare` | DOMINANCE | -0.077 | 0.077 | negative ↓ |
| 4 | `dHcCount` | COUNT_HC | -0.000 | 0.000 | flat ≈ 0 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | -0.000 | 0.000 | flat ≈ 0 |

Intercept b = -0.166 · Final log-loss = 0.6803 · N = 187.

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
- **v9 simplification candidate**: only `dCount`, `dConvictionAvg` carry marginal info (Spearman ρ drop > 0.01 when removed). The other 4 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=187 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 187 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/187 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 61 | 27-34-0 | 44.3% [33–57] | -19.3% | -37.7u | -1.60 ✗ noise |
| 4.5★ | 21 | 13-8-0 | 61.9% [41–79] | +26.1% | +12.4u | 1.08 ✗ noise |
| 4.0★ | 37 | 17-19-1 | 47.2% [32–63] | -7.0% | -6.2u | -0.42 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 21 | 9-11-1 | 45.0% [26–66] | -4.1% | -2.3u | -0.18 ✗ noise |
| 2.5★ | 35 | 17-18-0 | 48.6% [33–64] | -5.3% | -4.8u | -0.31 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 2/50%/-6% | 6/0%/-100% | 6/33%/-26% | 10/33%/-33% | 14/29%/-44% |
| Δw = +1 | 3/100%/+71% | 5/40%/-24% | 14/69%/+34% | 28/54%/+4% | 2/0%/-100% | 14/57%/+6% |
| Δw = +2 | 23/30%/-39% | 6/67%/+28% | 15/40%/-21% | — | 5/40%/-17% | 4/50%/+8% |
| Δw ≥ +3 | 30/47%/-15% | 5/80%/+90% | 2/100%/+91% | 3/67%/+156% | 4/100%/+133% | 1/100%/+145% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 7 | 3-4-0 | 42.9% [16–75] | -40.6% | -4.7u | -1.45 ✗ noise |
| −200/−151 | 14 | 5-9-0 | 35.7% [16–61] | -42.8% | -12.9u | -2.01 ✓ p<.05 |
| −150/−101 | 125 | 63-61-1 | 50.8% [42–59] | -3.3% | -1.4u | -0.39 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 47 | 21-25-1 | 45.7% [32–60] | +1.1% | -20.4u | 0.07 ✗ noise |
| +151/+200 | 4 | 3-1-0 | 75.0% [30–95] | +105.8% | +2.9u | 1.53 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -67% (4) | — | +47% (1) | -33% (2) |
| −200/−151 | -100% (5) | +20% (4) | -21% (2) | -100% (2) |
| −150/−101 | -29% (23) | +18% (45) | -35% (32) | +22% (22) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | -7% (7) | -15% (14) | +2% (15) | +27% (11) |
| +151/+200 | — | +160% (1) | +198% (1) | +165% (1) |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 117 | 55-62-0 | 47.0% [38–56] | -4.1% | -38.7u | -0.40 ✗ noise |
| SPREAD | 34 | 14-19-1 | 42.4% [27–59] | -18.3% | +0.5u | -1.13 ✗ noise |
| TOTAL | 62 | 33-28-1 | 54.1% [42–66] | +4.5% | +3.4u | 0.37 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=20 · 20% · -62% | N=35 · 57% · +8% | N=28 · 39% · -18% | N=31 · 58% · +31% |
| SPREAD | N=10 · 22% · -51% | N=10 · 30% · -42% | N=8 · 63% · +16% | N=5 · 60% · +17% |
| TOTAL | N=12 · 50% · -4% | N=22 · 71% · +36% | N=17 · 29% · -43% | N=9 · 67% · +30% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 88 | 40-48-0 | 45.5% [35–56] | -12.1% | -24.2u | -1.16 ✗ noise |
| NBA | 98 | 48-49-1 | 49.5% [40–59] | +0.8% | -2.7u | 0.07 ✗ noise |
| NHL | 27 | 14-12-1 | 53.8% [35–71] | +6.2% | -7.9u | 0.32 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=12 · 25% · -47% | N=31 · 58% · +10% | N=29 · 34% · -34% | N=15 · 53% · +7% |
| NBA | N=25 · 25% · -52% | N=25 · 56% · +10% | N=16 · 50% · +3% | N=27 · 63% · +40% |
| NHL | N=5 · 60% · +17% | N=11 · 60% · +10% | N=8 · 38% · -21% | N=3 · 67% · +45% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 123 · 44% · -9.7% · -0.97 ✗ noise | 89 · 54% · +2.6% · 0.25 ✗ noise |
| **plusEV** | 30 · 40% · -14.1% · -0.59 ✗ noise | 182 · 49% · -3.0% · -0.40 ✗ noise |
| **pinnacleConfirms** | 61 · 48% · -2.1% · -0.14 ✗ noise | 77 · 47% · -8.0% · -0.67 ✗ noise |
| **invested10kPlus** | 113 · 44% · -9.8% · -0.93 ✗ noise | 25 · 60% · +14.5% · 0.74 ✗ noise |
| **lineMovingWith** | 117 · 49% · -2.0% · -0.20 ✗ noise | 95 · 47% · -7.7% · -0.73 ✗ noise |
| **predMarketAligns** | 54 · 52% · +4.4% · 0.27 ✗ noise | 84 · 44% · -11.7% · -1.02 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 35 | 22-13-0 | 62.9% [46–77] | +20.9% | +4.1u | 1.29 ✗ noise |
| 1 | 44 | 19-24-1 | 44.2% [30–59] | -16.3% | -12.6u | -1.15 ✗ noise |
| 2 | 56 | 26-29-1 | 47.3% [35–60] | -3.1% | +1.5u | -0.22 ✗ noise |
| 3 | 26 | 12-14-0 | 46.2% [29–65] | -7.4% | -8.2u | -0.35 ✗ noise |
| 4 | 22 | 7-15-0 | 31.8% [16–53] | -33.7% | -17.4u | -1.57 ✗ noise |
| 5 | 22 | 13-9-0 | 59.1% [39–77] | +3.1% | +0.3u | 0.16 ✗ noise |
| 6 | 8 | 3-5-0 | 37.5% [14–69] | +25.3% | -2.5u | 0.35 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 53 | 33-19-1 | 63.5% [50–75] | +18.8% | +22.2u | 1.47 ✗ noise |
| NEAR_START | 92 | 37-54-1 | 40.7% [31–51] | -14.0% | -37.6u | -1.19 ✗ noise |
| NO_MOVE | 7 | 2-5-0 | 28.6% [8–64] | -45.3% | -3.6u | -1.28 ✗ noise |
| PREGAME | 24 | 14-10-0 | 58.3% [39–76] | +8.6% | +0.5u | 0.44 ✗ noise |
| SMALL_MOVE | 35 | 14-21-0 | 40.0% [26–56] | -18.6% | -18.7u | -1.05 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 119 | 56-62-1 | 47.5% [39–56] | -10.8% | -28.6u | -1.24 ✗ noise |
| STRONG | 45 | 23-22-0 | 51.1% [37–65] | +2.2% | -5.3u | 0.14 ✗ noise |
| LEAN | 45 | 21-23-1 | 47.7% [34–62] | +7.1% | -2.1u | 0.37 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.100 ✗ | -0.034 ✗ | -0.054 | -0.49 |
| totalInvested | -0.120 ~ p<.10 | -0.099 ✗ | -0.049 | -1.44 |
| evEdge | 0.081 ✗ | 0.081 ✗ | 0.056 | 1.18 |
| moneyPct | -0.011 ✗ | -0.079 ✗ | -0.064 | -1.15 |
| walletPct | 0.047 ✗ | 0.010 ✗ | 0.019 | 0.14 |
| criteriaMet | -0.066 ✗ | -0.031 ✗ | -0.081 | -0.46 |
| maxContribFor | 0.026 ✗ | 0.042 ✗ | 0.067 | 0.61 |
| meanBaseFor | 0.013 ✗ | 0.030 ✗ | 0.059 | 0.44 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **205** picks. Mean CLV = **-0.0033**.
t-statistic vs zero: -2.84 → ✓ p<.01 · 95% CI [-0.0056, -0.0010]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 20 | 11-9-0 | 55.0% [34–74] | -2.9% | +1.9u | -0.14 ✗ noise |
| CLV (−2%, 0] | 109 | 48-59-2 | 44.9% [36–54] | -11.0% | -34.3u | -1.12 ✗ noise |
| CLV (0, +2%] | 62 | 32-30-0 | 51.6% [39–64] | +11.0% | -0.6u | 0.73 ✗ noise |
| CLV > +2% | 14 | 6-8-0 | 42.9% [21–67] | -26.4% | -7.9u | -1.08 ✗ noise |

ρ(CLV, flat ROI) = -0.032 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=102 (with all features non-null). Intercept β₀ = 0.017.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.Δcount | +0.609 | ↑ helps |
| 2 | pw.ΔAvgRoi | +0.580 | ↑ helps |
| 3 | sharpCount | -0.501 | ↓ hurts |
| 4 | peak.stars | -0.314 | ↓ hurts |
| 5 | evEdge | +0.291 | ↑ helps |
| 6 | moneyPct | -0.200 | ↓ hurts |
| 7 | odds (American) | -0.179 | ↓ hurts |
| 8 | pw.ΔFlatPnl | +0.157 | ↑ helps |
| 9 | vault.star | -0.123 | ↓ hurts |
| 10 | criteriaMet | -0.104 | ↓ hurts |
| 11 | pw.ΔTopQShare | -0.077 | ↓ hurts |
| 12 | walletPct | -0.075 | ↓ hurts |
| 13 | log(impliedProb) | +0.054 | ↑ helps |
| 14 | HC margin | +0.053 | ↑ helps |
| 15 | pw.ΔWlNet | -0.050 | ≈ flat |
| 16 | log10(invested) | -0.041 | ≈ flat |
| 17 | Δw | -0.041 | ≈ flat |
| 18 | Δw + HC | -0.009 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 13 | 5-8 | 38.5% | 43.5% | -105 | — (mute) | 3.33u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 58 | 34-24 | 58.6% | 57.4% | -109 | 5.43% bankroll | 1.82u | **UNDER-SIZED** — ship up to 5.43u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 19 | 6-13 | 31.6% | 37.9% | -110 | — (mute) | 2.01u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 45 | 27-18 | 60.0% | 58.2% | -105 | 7.14% bankroll | 2.77u | **UNDER-SIZED** — ship up to 7.14u (1u=1% bankroll) |
| Stale Δw = 0 | 34 | 11-22 | 33.3% | 37.2% | -108 | — (mute) | 1.14u | **MUTE** (negative EV at posterior) |
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

**Peak cum PnL:** +7.1u
**Max drawdown:** -41.8u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.242  (annualized × √252 ≈ -3.84)

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

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._