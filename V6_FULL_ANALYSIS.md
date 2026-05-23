# Sharp Intel v6 — Full Analysis

_Auto-generated **5/23/2026, 10:24:32 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 260 shipped+graded picks · 2026-04-18 → 2026-05-22  (HC analyses scoped to post-cutover 2026-04-30, 148 picks)
**Headline:** 124-134-2 · WR 48.1% [42.0%–54.1%] vs 52.4% break-even · -14.3u flat (-5.5%) · -61.5u peak.
**Overall t-test:** t = -0.86 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.123 ✓ p<.05**  (full sample, N=254)
- **ρ(HC, flat ROI) = -0.008 ✗**  (post-cutover, N=148)
- **ρ(Δw+HC, flat ROI) = -0.019 ✗**  (post-cutover, N=148)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Tier-1a HC ≥ +2 (post-cutover)** — N=21, 7-14, WR 33.3% [17%–55%], flat ROI -39.0% (t=-1.99 ✓ p<.05)
- **Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era)** — N=26, 9-17, WR 34.6% [19%–54%], flat ROI -35.5% (t=-1.98 ✓ p<.05)
- **Stale Δw ≤ 0 (full sample)** — N=48, 15-32, WR 31.9% [20%–46%], flat ROI -38.5% (t=-2.97 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=21, WR 33.3%, flat ROI -39.0%. Bayesian posterior WR ≈ 38.7%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=77, WR 58.4%, flat ROI +15.5%. Bayesian posterior WR ≈ 57.5%, half-Kelly = **5.3%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=26, WR 34.6%, flat ROI -35.5%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=57, WR 54.4%, flat ROI +14.6%. Bayesian posterior WR ≈ 53.7%, half-Kelly = **1.4%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -38.5% flat ROI on 48 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.03u/pick), we need **~1644 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 260. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-22 |
| Sides scanned | 574 |
| Shipped + graded | **260** |
| W-L-P | 124-134-2 |
| Win rate | **48.1%** [42.0%–54.1%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +4.3 pp |
| Peak-units PnL | **-61.5u** |
| Flat-1u PnL | **-14.3u** (-5.5% flat ROI) |
| Flat t-statistic vs zero | -0.86 → ✗ noise |
| Flat 95% CI per-pick | [-0.181, 0.071]u |

### Power note

At our observed flat-PnL standard deviation (1.03u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4565 |
| +5% | 1644 |
| +10% | 411 |

We have **260** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 40 | 14-25-1 | 35.9% [23–52] | -31.4% | -20.7u | -2.16 ✓ p<.05 |
| Δw = +1 | 85 | 47-37-1 | 56.0% [45–66] | +6.4% | +4.6u | 0.62 ✗ noise |
| Δw = +2 | 64 | 27-37-0 | 42.2% [31–54] | -16.3% | -30.0u | -1.30 ✗ noise |
| Δw ≥ +3 | 57 | 31-26-0 | 54.4% [42–67] | +14.6% | -13.3u | 0.90 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.112** ~ p<.10  ·  **ρ(Δw, flat ROI) = 0.123** ✓ p<.05  (N=254)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 48 | 21-26-1 | 44.7% [31–59] | -15.2% | -23.9u | -1.11 ✗ noise |
| HC = +1 | 77 | 45-32-0 | 58.4% [47–69] | +15.5% | +5.1u | 1.35 ✗ noise |
| HC = +2 | 15 | 5-10-0 | 33.3% [15–58] | -33.5% | -21.6u | -1.33 ✗ noise |
| HC ≥ +3 | 6 | 2-4-0 | 33.3% [10–70] | -52.8% | -7.0u | -1.77 ~ p<.10 |

**Pearson ρ(HC, WIN) = 0.013** ✗  ·  **ρ(HC, flat ROI) = -0.008** ✗  (N=148)

Spearman rank ρ(HC, flat ROI) = 0.044.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 5 | 1-4-0 | 20.0% [4–62] | -61.8% | -9.1u | -1.62 ✗ noise |
| Σ = +1 | 32 | 16-15-1 | 51.6% [35–68] | +0.7% | +1.9u | 0.04 ✗ noise |
| Σ = +2 | 50 | 29-21-0 | 58.0% [44–71] | +10.0% | -0.0u | 0.73 ✗ noise |
| Σ = +3 | 22 | 9-13-0 | 40.9% [23–61] | -18.5% | -9.8u | -0.83 ✗ noise |
| Σ = +4 | 17 | 9-8-0 | 52.9% [31–74] | +4.0% | -13.0u | 0.16 ✗ noise |
| Σ = +5 | 11 | 4-7-0 | 36.4% [15–65] | -27.1% | -9.9u | -0.89 ✗ noise |
| Σ ≥ +6 | 11 | 5-6-0 | 45.5% [21–72] | -11.4% | -11.0u | -0.36 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = -0.005** ✗  ·  **ρ(Σ, flat ROI) = -0.019** ✗  (N=148)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 148.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.015 ✗ | -0.020 ✗ | -0.034 | weak |
| HC margin | 0.013 ✗ | -0.008 ✗ | 0.044 | weak |
| Δw + HC | -0.005 ✗ | -0.019 ✗ | -0.004 | weak |
| peak.stars | -0.127 ✗ | -0.158 ~ p<.10 | -0.169 | weak |
| vault.star | -0.085 ✗ | -0.087 ✗ | -0.136 | weak |
| lock.stars | -0.086 ✗ | -0.118 ✗ | -0.122 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 148 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | N=4 · 1-3 · 25% [5–70] · -52%  | N=20 · 11-8 · 58% [36–77] · +10%  | N=17 · 8-9 · 47% [26–69] · -13%  | N=7 · 1-6 · 14% [3–51] · -72% ✗ |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=12 · 5-7 · 42% [19–68] · -15%  | N=31 · 21-10 · 68% [50–81] · +30%  | N=16 · 8-8 · 50% [28–72] · +3%  | N=17 · 11-6 · 65% [41–83] · +30%  |
| +2 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=4 · 0-4 · 0% [0–49] · -100%  | N=10 · 5-5 · 50% [24–76] · -0%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | — | N=2 · 0-2 · 0% [0–66] · —  | N=3 · 1-2 · 33% [6–79] · -52%  |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 48 | 21-26-1 | 44.7% [31–59] | -15.2% | -23.9u | -1.11 ✗ noise |
| HC = +1 | 77 | 45-32-0 | 58.4% [47–69] | +15.5% | +5.1u | 1.35 ✗ noise |
| HC = +2 | 15 | 5-10-0 | 33.3% [15–58] | -33.5% | -21.6u | -1.33 ✗ noise |
| HC ≥ +3 | 6 | 2-4-0 | 33.3% [10–70] | -52.8% | -7.0u | -1.77 ~ p<.10 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 17 | 7-10-0 | 41.2% [22–64] | -20.6% | -7.4u | -0.86 ✗ noise |
| Δw = +1 | 52 | 32-19-1 | 62.7% [49–75] | +19.6% | +9.2u | 1.50 ✗ noise |
| Δw = +2 | 39 | 16-23-0 | 41.0% [27–57] | -19.6% | -26.2u | -1.22 ✗ noise |
| Δw ≥ +3 | 39 | 18-21-0 | 46.2% [32–61] | -9.1% | -25.4u | -0.56 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 98 | 52-46-0 | 53.1% [43–63] | +3.9% | -23.4u | 0.38 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 26 | 9-17-0 | 34.6% [19–54] | -35.5% | -22.6u | -1.98 ✓ p<.05 |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 24 | 12-11-1 | 52.2% [33–71] | -0.3% | -4.8u | -0.01 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 236 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -6.5u | 0.00 ✗ noise |
| Δcount = −1 | 15 | 5-10-0 | 33.3% [15–58] | -31.3% | -9.9u | -1.20 ✗ noise |
| Δcount = 0 (balanced) | 20 | 7-13-0 | 35.0% [18–57] | -34.7% | -10.4u | -1.64 ✗ noise |
| Δcount = +1 | 89 | 41-46-2 | 47.1% [37–58] | -12.4% | -21.3u | -1.26 ✗ noise |
| Δcount = +2 | 59 | 25-34-0 | 42.4% [31–55] | -16.5% | -22.2u | -1.27 ✗ noise |
| Δcount ≥ +3 (heavy support) | 50 | 37-13-0 | 74.0% [60–84] | +57.1% | +23.7u | 3.51 ✓ p<.01 |

**ρ(Δcount, WIN) = 0.241** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.265** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -5 · ≤ -1 · ≤ 3 · ≤ 13 · > 13

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 71 | 26-45-0 | 36.6% [26–48] | -25.9% | -43.4u | -2.19 ✓ p<.05 |
| Q2 | 27 | 10-16-1 | 38.5% [22–57] | -28.7% | -11.2u | -1.66 ~ p<.10 |
| Q3 (balanced) | 48 | 27-21-0 | 56.3% [42–69] | +11.2% | +0.9u | 0.77 ✗ noise |
| Q4 | 43 | 21-22-0 | 48.8% [35–63] | -10.3% | -17.1u | -0.71 ✗ noise |
| Q5 (best — heavy support) | 47 | 31-15-1 | 67.4% [53–79] | +39.2% | +24.3u | 2.27 ✓ p<.05 |

**ρ(ΔWlNet, WIN) = 0.236** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.230** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -8.60 · ≤ -1.35 · ≤ 1.43 · ≤ 10.41 · > 10.41

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 52 | 18-34-0 | 34.6% [23–48] | -32.7% | -40.7u | -2.51 ✓ p<.05 |
| Q2 | 50 | 20-30-0 | 40.0% [28–54] | -23.1% | -26.9u | -1.67 ~ p<.10 |
| Q3 | 40 | 20-19-1 | 51.3% [36–66] | +2.0% | -2.9u | 0.12 ✗ noise |
| Q4 | 47 | 24-23-0 | 51.1% [37–65] | -5.4% | -5.9u | -0.39 ✗ noise |
| Q5 | 47 | 33-13-1 | 71.7% [57–83] | +50.0% | +29.8u | 2.95 ✓ p<.01 |

**ρ(ΔFlatPnl, WIN) = 0.258** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.297** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -10.8 · ≤ -4.8 · ≤ 3.6 · ≤ 18.0 · > 18.0

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 48 | 10-37-1 | 21.3% [12–35] | -53.7% | -46.4u | -4.00 ✓ p<.01 |
| Q2 | 47 | 22-25-0 | 46.8% [33–61] | -10.4% | -12.7u | -0.73 ✗ noise |
| Q3 | 47 | 22-25-0 | 46.8% [33–61] | -10.6% | -25.1u | -0.75 ✗ noise |
| Q4 | 47 | 26-20-1 | 56.5% [42–70] | +10.3% | -3.8u | 0.71 ✗ noise |
| Q5 | 47 | 35-12-0 | 74.5% [60–85] | +51.0% | +41.5u | 3.22 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.371** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.395** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 22 | 2-20-0 | 9.1% [3–28] | -84.2% | -27.8u | -7.64 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 10 | 5-5-0 | 50.0% [24–76] | +10.3% | -6.2u | 0.28 ✗ noise |
| ΔBestRank = 0 (tied) | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -4.2u | 0.00 ✗ noise |
| ΔBestRank ∈ [+1,+4] | 13 | 6-7-0 | 46.2% [23–71] | +5.7% | -5.3u | 0.16 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 36 | 22-13-1 | 62.9% [46–77] | +33.1% | +11.8u | 1.58 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.456** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.517** ✓ p<.01  (N=83)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 19 | 4-15-0 | 21.1% [9–43] | -51.9% | -12.9u | -2.12 ✓ p<.05 |
| Δshare ∈ [−30,−10] pp | 4 | 1-3-0 | 25.0% [5–70] | -33.8% | -6.5u | -0.51 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 146 | 65-80-1 | 44.8% [37–53] | -14.6% | -67.7u | -1.84 ~ p<.10 |
| Δshare ∈ [+10,+30] pp | 14 | 7-7-0 | 50.0% [27–73] | -1.7% | -5.6u | -0.06 ✗ noise |
| Δshare ≥ +30 pp | 53 | 38-14-1 | 73.1% [60–83] | +49.0% | +46.0u | 3.26 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.241** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.227** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.371 ✓ p<.01 | 0.395 ✓ p<.01 | 0.334 |
| 2 | **ΔTopQCount** | 0.307 ✓ p<.01 | 0.355 ✓ p<.01 | 0.326 |
| 3 | **ΔFlatPnl** | 0.258 ✓ p<.01 | 0.297 ✓ p<.01 | 0.244 |
| 4 | **Δcount** | 0.241 ✓ p<.01 | 0.265 ✓ p<.01 | 0.246 |
| 5 | **ΔWlNet** | 0.236 ✓ p<.01 | 0.230 ✓ p<.01 | 0.182 |
| 6 | **ΔTopQShare** | 0.241 ✓ p<.01 | 0.227 ✓ p<.01 | 0.268 |

_(ΔBestRank uses N=83 subset where both sides had a proven wallet — ρ(flat ROI) = 0.517 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 494, dateRange = 2026-04-18 → 2026-05-22, computedAt = 2026-05-23T14:15:37.132Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **236** rows · PIT aggregate computable on **234** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **234** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 0 · — · — | 0 · — · — | — |
| NEUTRAL (0..+3) | 159 · 55% · +8.3% | 155 · 51% · -3.5% | -11.8pp |
| WEAK (−3..0) | 63 · 34% · -33.8% | 67 · 45% · -3.9% | +29.9pp |
| FADE (<−3) | 0 · — · — | 0 · — · — | — |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=115, WR=62%, ROI=+22.6% | N=117, WR=53%, ROI=+0.9% | -21.7pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=159, WR=55%, ROI=+8.3% | N=155, WR=51%, ROI=-3.5% | -11.8pp |
| AGS < −1 (mute veto) | N=28, WR=33%, ROI=-30.5% | N=30, WR=48%, ROI=+12.4% | +42.9pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-09 → 2026-05-22, N=109)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 0 · — · — |
| NEUTRAL (0..+3) | 72 · 50% · -6.1% |
| WEAK (−3..0) | 37 · 49% · -2.4% |
| FADE (<−3) | 0 · — · — |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=52, WR=48%, ROI=-9.4% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=72, WR=50%, ROI=-6.1% |
| AGS < −1 (mute veto) | N=16, WR=56%, ROI=+13.1% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.22 | 1.44 |
| `dHcCount` | COUNT_HC | + | 0.34 | 0.76 |
| `dConvictionAvg` | INTENSITY | + | 0.52 | 0.60 |
| `dHcSizeRatio` | INTENSITY_HC | + | 1.21 | 5.13 |
| `forContribShare` | DOMINANCE | − | 0.80 | 0.28 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **234/260** shipped+graded rows (90%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -1.11 |
| 20th pct | -0.16 |
| 40th pct | 0.11 |
| Median | 0.18 |
| 60th pct | 0.23 |
| 80th pct | 0.39 |
| 90th pct | 0.54 |
| Max | 1.10 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 20 | 8.5% |
| **LOCK** | +5..+7 | 71 | 30.3% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 36 | 15.4% |
| **FADE** | < −3 | 33 | 14.1% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 20 | 13-7-0 | 65.0% [43–82] | +24.1% | +12.2u | 1.11 ✗ noise |
| LOCK | 71 | 37-34-0 | 52.1% [41–63] | +1.1% | -2.3u | 0.10 ✗ noise |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 36 | 16-20-0 | 44.4% [30–60] | -14.8% | -8.0u | -0.90 ✗ noise |
| FADE | 33 | 15-17-1 | 46.9% [31–64] | +8.0% | -13.1u | 0.34 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.027** ✗ · r(ROI) = **-0.022** ✗ · Spearman ρ(ROI) = **-0.016**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 27 | 14-13-0 | 51.9% [34–69] | +18.1% | -11.1u | 0.68 ✗ noise |
| z ∈ [−1, 0) | 83 | 41-40-2 | 50.6% [40–61] | -3.2% | +0.8u | -0.30 ✗ noise |
| z ∈ [0, +1) | 78 | 31-47-0 | 39.7% [30–51] | -22.9% | -45.0u | -2.09 ✓ p<.05 |
| z ≥ +1 (very positive) | 46 | 24-22-0 | 52.2% [38–66] | -1.4% | -7.6u | -0.10 ✗ noise |

#### `dHcCount` (COUNT_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 200 | 95-103-2 | 48.0% [41–55] | -7.6% | -59.9u | -1.10 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dConvictionAvg` (INTENSITY)

r(WIN) = **0.140** ✓ p<.05 · r(ROI) = **0.050** ✗ · Spearman ρ(ROI) = **0.080**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 31 | 9-22-0 | 29.0% [16–47] | -25.6% | -26.8u | -1.06 ✗ noise |
| z ∈ [−1, 0) | 57 | 29-27-1 | 51.8% [39–64] | -0.3% | -13.6u | -0.03 ✗ noise |
| z ∈ [0, +1) | 121 | 60-60-1 | 50.0% [41–59] | -4.4% | -8.9u | -0.50 ✗ noise |
| z ≥ +1 (very positive) | 25 | 12-13-0 | 48.0% [30–67] | -11.5% | -13.6u | -0.60 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 200 | 95-103-2 | 48.0% [41–55] | -7.6% | -59.9u | -1.10 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `forContribShare` (DOMINANCE)

r(WIN) = **0.087** ✗ · r(ROI) = **-0.001** ✗ · Spearman ρ(ROI) = **0.049**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 20 | 9-11-0 | 45.0% [26–66] | +8.1% | -10.3u | 0.24 ✗ noise |
| z ∈ [−1, 0) | 62 | 22-39-1 | 36.1% [25–49] | -27.4% | -40.4u | -2.19 ✓ p<.05 |
| z ∈ [0, +1) | 152 | 79-72-1 | 52.3% [44–60] | -0.6% | -12.2u | -0.07 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | 0.140 ✓ p<.05 | 0.050 ✗ | 0.080 |
| 2 | `forContribShare` | DOMINANCE | 0.087 ✗ | -0.001 ✗ | 0.049 |
| 3 | `dCount` | COUNT | 0.027 ✗ | -0.022 ✗ | -0.016 |
| 4 | `dHcCount` | COUNT_HC | NaN — | NaN — | NaN |
| 5 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | +0.200 | 0.786 | 33.6% | meaningful |
| 2 | `dConvictionAvg` | +0.071 | 0.757 | 32.4% | meaningful |
| 3 | `forContribShare` | +0.113 | 0.697 | 29.8% | meaningful |
| 4 | `dHcCount` | -0.064 | 0.064 | 2.8% | silent (<0.2) |
| 5 | `dHcSizeRatio` | -0.034 | 0.034 | 1.5% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcCount` | `dConvictionAvg` | `dHcSizeRatio` | `forContribShare` |
|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.217 | +0.260 | +0.217 | +0.488 |
| `dHcCount` | +0.217 | 1.000 | +0.102 | +1.000 ⚠ | +0.174 |
| `dConvictionAvg` | +0.260 | +0.102 | 1.000 | +0.102 | +0.862 ⚠ |
| `dHcSizeRatio` | +0.217 | +1.000 ⚠ | +0.102 | 1.000 | +0.174 |
| `forContribShare` | +0.488 | +0.174 | +0.862 ⚠ | +0.174 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.052**. At AGS ≥ +0.17 fires N=122, WR=51.6%, ROI=-1.7%. At AGS ≥ +null fires N=164, WR=48.5%, ROI=-7.7%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-122 ROI (matched cohort) | Top-122 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.060 | +0.008 | WR=51%, ROI=-3.0% | +1.3pp | N=58, WR=55%, ROI=+2.9% |
| `dHcCount` | +0.033 | −0.019 | WR=49%, ROI=-6.3% | +4.7pp | N=101, WR=50%, ROI=-5.3% |
| `dConvictionAvg` | -0.016 | −0.036 | WR=46%, ROI=-6.8% | +5.1pp | N=95, WR=45%, ROI=-8.0% |
| `dHcSizeRatio` | +0.035 | −0.017 | WR=51%, ROI=-3.1% | +1.5pp | N=99, WR=51%, ROI=-3.4% |
| `forContribShare` | +0.069 | +0.017 | WR=55%, ROI=+3.8% | -5.4pp | N=144, WR=51%, ROI=-2.8% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dConvictionAvg` | −0.036 | +5.1pp | carries marginal info |
| 2 | `dHcCount` | −0.019 | +4.7pp | mild marginal info |
| 3 | `dHcSizeRatio` | −0.017 | +1.5pp | mild marginal info |
| 4 | `dCount` | +0.008 | +1.3pp | redundant — other features cover it |
| 5 | `forContribShare` | +0.017 | -5.4pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | +0.265 | 0.265 | positive ↑ |
| 2 | `forContribShare` | DOMINANCE | -0.045 | 0.045 | flat ≈ 0 |
| 3 | `dHcCount` | COUNT_HC | +0.023 | 0.023 | flat ≈ 0 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | +0.012 | 0.012 | flat ≈ 0 |
| 5 | `dCount` | COUNT | -0.011 | 0.011 | flat ≈ 0 |

Intercept b = -0.131 · Final log-loss = 0.6824 · N = 234.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | #1 | #2 | #1 | #1 | 1.25 |
| 2 | `forContribShare` | DOMINANCE | #2 | #3 | #5 | #2 | 3.00 |
| 3 | `dCount` | COUNT | #3 | #1 | #4 | #5 | 3.25 |
| 4 | `dHcCount` | COUNT_HC | #4 | #4 | #2 | #3 | 3.25 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | #5 | #5 | #3 | #4 | 4.25 |

#### Plain-English summary

- **Workhorse**: `dConvictionAvg` (INTENSITY) — ranks #1/#2/#1/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dHcSizeRatio` (INTENSITY_HC) — composite avg rank 4.25. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dHcCount` ↔ `dHcSizeRatio` (r=+1.00); `dConvictionAvg` ↔ `forContribShare` (r=+0.86). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dHcCount`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **v9 simplification candidate**: only `dHcCount`, `dConvictionAvg`, `dHcSizeRatio` carry marginal info (Spearman ρ drop > 0.01 when removed). The other 3 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=234 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 234 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/234 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 80 | 35-45-0 | 43.8% [33–55] | -21.2% | -57.6u | -2.05 ✓ p<.05 |
| 4.5★ | 23 | 14-9-0 | 60.9% [41–78] | +23.5% | +11.1u | 1.02 ✗ noise |
| 4.0★ | 45 | 21-23-1 | 47.7% [34–62] | -8.0% | -8.0u | -0.54 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 31 | 13-17-1 | 43.3% [27–61] | -8.9% | -4.8u | -0.47 ✗ noise |
| 2.5★ | 43 | 22-21-0 | 51.2% [37–65] | +0.5% | -6.0u | 0.03 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 5/40%/-46% | 2/50%/-6% | 6/0%/-100% | 6/33%/-26% | 11/30%/-39% | 17/35%/-30% |
| Δw = +1 | 7/57%/-3% | 5/40%/-24% | 17/69%/+31% | 28/54%/+4% | 9/44%/-10% | 18/56%/+3% |
| Δw = +2 | 28/32%/-37% | 7/71%/+37% | 18/44%/-15% | — | 6/33%/-31% | 5/60%/+34% |
| Δw ≥ +3 | 38/47%/-14% | 6/67%/+58% | 4/50%/-4% | 3/67%/+156% | 5/80%/+86% | 1/100%/+145% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 9 | 5-4-0 | 55.6% [27–81] | -22.4% | -0.7u | -0.91 ✗ noise |
| −200/−151 | 23 | 9-14-0 | 39.1% [22–59] | -36.9% | -18.2u | -2.19 ✓ p<.05 |
| −150/−101 | 149 | 74-74-1 | 50.0% [42–58] | -5.0% | -15.5u | -0.64 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 57 | 26-30-1 | 46.4% [34–59] | +2.4% | -29.0u | 0.16 ✗ noise |
| +151/+200 | 6 | 3-3-0 | 50.0% [19–81] | +37.2% | +0.1u | 0.60 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -46% (5) | — | +47% (1) | -7% (3) |
| −200/−151 | -100% (6) | +14% (7) | +22% (4) | -100% (5) |
| −150/−101 | -30% (26) | +16% (54) | -33% (37) | +12% (29) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +8% (8) | -19% (20) | +9% (18) | +27% (11) |
| +151/+200 | — | +160% (1) | +49% (2) | +32% (2) |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 144 | 65-79-0 | 45.1% [37–53] | -9.3% | -67.0u | -1.02 ✗ noise |
| SPREAD | 44 | 19-24-1 | 44.2% [30–59] | -16.6% | -1.2u | -1.18 ✗ noise |
| TOTAL | 72 | 40-31-1 | 56.3% [45–67] | +8.8% | +6.8u | 0.78 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=24 · 25% · -54% | N=45 · 53% · +1% | N=34 · 41% · -15% | N=38 · 50% · +11% |
| SPREAD | N=11 · 20% · -56% | N=15 · 40% · -26% | N=9 · 67% · +21% | N=8 · 50% · -2% |
| TOTAL | N=13 · 54% · +4% | N=25 · 71% · +35% | N=21 · 33% · -35% | N=11 · 73% · +41% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 120 | 55-65-0 | 45.8% [37–55] | -11.9% | -41.0u | -1.35 ✗ noise |
| NBA | 108 | 53-54-1 | 49.5% [40–59] | -0.5% | -8.0u | -0.05 ✗ noise |
| NHL | 32 | 16-15-1 | 51.6% [35–68] | +1.9% | -12.5u | 0.11 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=15 · 33% · -31% | N=47 · 55% · +4% | N=38 · 39% · -24% | N=19 · 42% · -16% |
| NBA | N=27 · 27% · -51% | N=26 · 54% · +5% | N=18 · 50% · +3% | N=32 · 63% · +35% |
| NHL | N=6 · 50% · -2% | N=12 · 64% · +18% | N=8 · 38% · -21% | N=6 · 50% · +4% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 144 · 43% · -12.3% · -1.36 ✗ noise | 115 · 54% · +1.8% · 0.20 ✗ noise |
| **plusEV** | 33 · 39% · -17.1% · -0.77 ✗ noise | 226 · 49% · -4.5% · -0.67 ✗ noise |
| **pinnacleConfirms** | 72 · 46% · -6.4% · -0.47 ✗ noise | 105 · 48% · -8.0% · -0.81 ✗ noise |
| **invested10kPlus** | 140 · 45% · -9.9% · -1.08 ✗ noise | 37 · 54% · +2.5% · 0.16 ✗ noise |
| **lineMovingWith** | 142 · 49% · -3.3% · -0.38 ✗ noise | 117 · 47% · -9.4% · -1.01 ✗ noise |
| **predMarketAligns** | 66 · 45% · -8.7% · -0.62 ✗ noise | 111 · 48% · -6.5% · -0.67 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 45 | 27-18-0 | 60.0% [45–73] | +15.5% | +0.7u | 1.08 ✗ noise |
| 1 | 54 | 26-27-1 | 49.1% [36–62] | -8.0% | -7.7u | -0.63 ✗ noise |
| 2 | 71 | 32-38-1 | 45.7% [35–57] | -8.5% | -13.0u | -0.69 ✗ noise |
| 3 | 27 | 12-15-0 | 44.4% [28–63] | -10.8% | -11.2u | -0.53 ✗ noise |
| 4 | 28 | 10-18-0 | 35.7% [21–54] | -28.6% | -18.1u | -1.51 ✗ noise |
| 5 | 27 | 14-13-0 | 51.9% [34–69] | -7.5% | -9.6u | -0.41 ✗ noise |
| 6 | 8 | 3-5-0 | 37.5% [14–69] | +25.3% | -2.5u | 0.35 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 69 | 42-26-1 | 61.8% [50–72] | +15.2% | +19.5u | 1.35 ✗ noise |
| NEAR_START | 104 | 41-62-1 | 39.8% [31–49] | -16.4% | -54.2u | -1.50 ✗ noise |
| NO_MOVE | 9 | 4-5-0 | 44.4% [19–73] | -21.0% | -0.2u | -0.66 ✗ noise |
| PREGAME | 31 | 18-13-0 | 58.1% [41–74] | +9.4% | -2.2u | 0.54 ✗ noise |
| SMALL_MOVE | 45 | 17-28-0 | 37.8% [25–52] | -24.5% | -26.9u | -1.62 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 145 | 70-74-1 | 48.6% [41–57] | -9.5% | -37.9u | -1.21 ✗ noise |
| STRONG | 52 | 26-26-0 | 50.0% [37–63] | +0.5% | -12.2u | 0.04 ✗ noise |
| LEAN | 59 | 26-32-1 | 44.8% [33–58] | -2.1% | -12.6u | -0.13 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.080 ✗ | -0.035 ✗ | -0.053 | -0.56 |
| totalInvested | -0.070 ✗ | -0.082 ✗ | -0.067 | -1.31 |
| evEdge | 0.093 ✗ | 0.095 ✗ | 0.077 | 1.52 |
| moneyPct | 0.021 ✗ | -0.044 ✗ | -0.042 | -0.70 |
| walletPct | 0.079 ✗ | 0.042 ✗ | 0.040 | 0.67 |
| criteriaMet | -0.086 ✗ | -0.052 ✗ | -0.095 | -0.84 |
| maxContribFor | 0.005 ✗ | 0.019 ✗ | 0.043 | 0.31 |
| meanBaseFor | 0.010 ✗ | 0.029 ✗ | 0.065 | 0.46 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **252** picks. Mean CLV = **-0.0036**.
t-statistic vs zero: -3.59 → ✓ p<.01 · 95% CI [-0.0056, -0.0016]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 25 | 13-12-0 | 52.0% [33–70] | -10.1% | +1.2u | -0.57 ✗ noise |
| CLV (−2%, 0] | 135 | 60-73-2 | 45.1% [37–54] | -10.9% | -50.0u | -1.25 ✗ noise |
| CLV (0, +2%] | 77 | 40-37-0 | 51.9% [41–63] | +8.4% | -9.7u | 0.65 ✗ noise |
| CLV > +2% | 15 | 6-9-0 | 40.0% [20–64] | -31.3% | -9.2u | -1.35 ✗ noise |

ρ(CLV, flat ROI) = -0.022 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=149 (with all features non-null). Intercept β₀ = -0.024.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔAvgRoi | +0.537 | ↑ helps |
| 2 | sharpCount | -0.347 | ↓ hurts |
| 3 | pw.Δcount | +0.295 | ↑ helps |
| 4 | evEdge | +0.282 | ↑ helps |
| 5 | peak.stars | -0.255 | ↓ hurts |
| 6 | pw.ΔFlatPnl | +0.215 | ↑ helps |
| 7 | pw.ΔWlNet | +0.160 | ↑ helps |
| 8 | odds (American) | -0.148 | ↓ hurts |
| 9 | pw.ΔTopQShare | +0.113 | ↑ helps |
| 10 | log(impliedProb) | +0.100 | ↑ helps |
| 11 | log10(invested) | -0.073 | ↓ hurts |
| 12 | Δw | -0.055 | ↓ hurts |
| 13 | criteriaMet | -0.054 | ↓ hurts |
| 14 | HC margin | +0.054 | ↑ helps |
| 15 | walletPct | +0.045 | ≈ flat |
| 16 | vault.star | +0.031 | ≈ flat |
| 17 | Δw + HC | -0.019 | ≈ flat |
| 18 | moneyPct | -0.007 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 21 | 7-14 | 33.3% | 38.7% | -110 | — (mute) | 3.58u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 77 | 45-32 | 58.4% | 57.5% | -109 | 5.56% bankroll | 1.82u | **UNDER-SIZED** — ship up to 5.56u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 26 | 9-17 | 34.6% | 38.9% | -110 | — (mute) | 1.85u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 57 | 31-26 | 54.4% | 53.7% | -106 | 2.34% bankroll | 2.77u | ~ in range — 2.34u |
| Stale Δw = 0 | 40 | 14-25 | 35.9% | 38.8% | -108 | — (mute) | 1.29u | **MUTE** (negative EV at posterior) |
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
| 2026-05-21 | 11 | 5-6 | -5.5u | -43.6u |
| 2026-05-22 | 19 | 8-11 | -17.9u | -61.5u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -68.5u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.330  (annualized × √252 ≈ -5.23)

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
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 1 | 0 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 1 | 2 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 1 | -5 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 1 | 2 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 0 | 3 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 4 | 14 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 2 | -4 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 1 | 2 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | -1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 2 | -7 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | 1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | -1 | -16 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 1 | 10 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 0 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | 1 | -4 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | 0 | -11 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 1 | 4 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 2 | 17 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | 0 | 0 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 1 | -1 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 3 | 1 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 2 | 5 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 2 | 8 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 2 | -9 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | -1 | 9 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 1 | 0 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 2 | -10 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 1 | 0 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | 0 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | 1 | 6 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | 0 | -25 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | -1 | -10 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 1 | -5 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 4 | 22 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 3 | 3 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 1 | -5 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | -1 | 0 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | 0 | -6 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | -1 | 5 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | -1 | 9 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 1 | -9 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 1 | 3 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 3 | 16 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 2 | 3 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -2 | -8 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 1 | 3 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 5 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | 1 | 0 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 15 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 3 | 0 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | -2 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | 2 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 2 | -4 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 4 | 18 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 1 | 28 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 5 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 32 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 1 | 0 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 2 | -14 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 2 | -14 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | 0 | -33 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 2 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 2 | -1 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | -1 | 0 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 1 | 1 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | -1 | 5 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | 5 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 2 | -4 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 18 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 37 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | 14 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -9 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 3 | 20 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | -1 | -5 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 1 | -5 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -19 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 4 | 30 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 4 | 29 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 4 | 26 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 1 | 1 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 0 | 0 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 1 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 0 | 0 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | -2 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 1 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 2 | -5 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 6 | 11 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 22 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 1 | 5 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 2 | -3 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 1 | 24 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 0 | -6 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 0 | -4 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 4 | 20 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 2 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | -14 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 1 | -21 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 3 | 13 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 1 | -4 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 1 | -1 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | 9 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 3 | -20 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 20 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 4 | 8 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 2 | -8 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 3 | 30 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | -1 | -5 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 2 | 3 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 21 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 14 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 21 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | 0 | -2 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 43 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 3 | 14 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 2 | -6 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 1 | 6 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 3 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 6 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 5 | 21 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 0 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 24 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 3 | 21 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 0 | 0 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 1 | -3 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 1 | -3 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 2 | 29 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 3 | 32 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 26 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 1 | 1 | -1.30 | L | -1.1u |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.70 | -104 | — | — | — | 2 | 20 | 0.00 | W | +1.6u |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-09 | NBA | ML | away | 5.0 | 4.50 | -364 | 3 | 1 | 4 | 6 | 43 | 0.00 | W | +1.2u |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2.00 | -104 | 2 | 1 | 3 | 2 | 26 | 0.00 | W | +1.9u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -120 | 1 | 1 | 2 | 0 | 4 | 0.00 | W | +0.9u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -5 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -5 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -103 | 1 | 1 | 2 | 1 | -5 | 0.00 | L | -1.1u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -110 | 1 | 1 | 2 | 1 | -5 | 0.00 | W | +1.0u |
| 2026-05-10 | MLB | ML | away | 3.5 | 1.13 | +134 | 0 | 1 | 1 | 1 | -5 | 0.00 | W | +1.5u |
| 2026-05-10 | NBA | ML | home | 4.0 | 1.50 | +160 | 1 | 1 | 2 | 3 | 15 | 0.80 | W | +2.6u |
| 2026-05-10 | NBA | TOTAL | over | 5.0 | 3.50 | -110 | 3 | 2 | 5 | 2 | 25 | 0.00 | W | +3.3u |
| 2026-05-10 | NHL | ML | away | 4.5 | 4.50 | +108 | 2 | 2 | 4 | 2 | 1 | -0.70 | L | -4.5u |
| 2026-05-10 | NHL | TOTAL | under | 5.0 | 1.70 | -110 | 2 | 1 | 3 | 2 | -1 | 0.00 | L | -1.7u |
| 2026-05-11 | MLB | ML | away | 3.5 | 1.13 | -101 | 1 | 1 | 2 | 2 | -7 | 0.00 | W | +1.1u |
| 2026-05-11 | MLB | ML | home | 3.5 | 1.13 | -156 | 1 | 1 | 2 | 0 | 4 | 0.00 | W | +0.7u |
| 2026-05-11 | NBA | TOTAL | under | 4.5 | 2.00 | -110 | 1 | 2 | 3 | 0 | 13 | 0.00 | L | -2.0u |
| 2026-05-11 | NHL | TOTAL | under | 4.5 | 1.27 | -110 | 2 | 0 | 2 | 2 | 6 | 0.00 | L | -1.3u |
| 2026-05-12 | MLB | ML | away | 5.0 | 4.50 | +108 | 4 | 0 | 4 | 2 | 0 | -0.20 | L | -4.5u |
| 2026-05-12 | MLB | TOTAL | under | 4.0 | 0.64 | -110 | 2 | 1 | 3 | 2 | 0 | 0.00 | L | -0.6u |
| 2026-05-12 | MLB | ML | away | 4.5 | 3.00 | +129 | 3 | 0 | 3 | 1 | 5 | -1.00 | L | -3.0u |
| 2026-05-12 | MLB | ML | home | 5.0 | 3.00 | +108 | 3 | 0 | 3 | 2 | 0 | -0.50 | L | -3.0u |
| 2026-05-12 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 6 | 4 | 10 | 6 | 37 | -0.70 | L | -3.5u |
| 2026-05-13 | MLB | ML | home | 4.5 | 4.50 | -116 | 1 | 1 | 2 | 1 | -5 | -1.30 | W | +3.7u |
| 2026-05-13 | MLB | SPREAD | home | 5.0 | 3.50 | -105 | 1 | 1 | 2 | 2 | -8 | 0.90 | W | +3.2u |
| 2026-05-13 | MLB | TOTAL | under | 4.0 | 0.96 | -110 | 1 | 1 | 2 | 3 | -6 | 0.00 | W | +0.9u |
| 2026-05-13 | MLB | TOTAL | under | 5.0 | 3.50 | -110 | 4 | 2 | 6 | 4 | -6 | 0.00 | L | -3.5u |
| 2026-05-13 | NBA | ML | home | 5.0 | 4.50 | -162 | 6 | 0 | 6 | 2 | -18 | -1.00 | L | -4.5u |
| 2026-05-13 | NBA | TOTAL | over | 5.0 | 3.50 | -101 | 3 | 2 | 5 | 4 | 4 | 0.00 | W | +3.4u |
| 2026-05-14 | MLB | ML | home | 5.0 | 4.50 | -103 | 4 | 1 | 5 | 0 | 0 | -0.40 | L | -4.5u |
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 2 | 0 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | -3 | 0.00 | L | -0.5u |
| 2026-05-14 | NHL | TOTAL | under | 5.0 | 3.50 | -110 | 3 | 1 | 4 | 3 | 5 | 0.00 | L | -3.5u |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 0 | 1 | 1 | 4 | 9 | 0.00 | W | +1.7u |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 1 | 1 | 2 | 1 | -4 | 0.00 | W | +0.3u |
| 2026-05-15 | MLB | ML | home | 4.0 | 2.50 | +128 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -2.5u |
| 2026-05-15 | MLB | ML | away | 4.0 | 2.75 | -211 | 2 | 1 | 3 | 1 | 5 | -0.90 | W | +1.3u |
| 2026-05-15 | MLB | ML | away | 3.0 | 1.25 | +115 | 0 | 1 | 1 | -1 | -5 | -1.10 | L | -1.3u |
| 2026-05-15 | NBA | ML | away | 2.5 | 0.50 | +145 | 6 | 1 | 7 | 5 | 19 | -0.50 | W | +0.8u |
| 2026-05-15 | NBA | TOTAL | over | 4.0 | 0.75 | -109 | 0 | 1 | 1 | 2 | -17 | 0.00 | L | -0.8u |
| 2026-05-15 | NBA | SPREAD | home | 2.5 | 1.00 | -105 | 1 | 0 | 1 | 1 | 26 | 0.00 | L | -1.0u |
| 2026-05-15 | NBA | TOTAL | over | 5.0 | 2.00 | -110 | 1 | 0 | 1 | 3 | 6 | 0.00 | W | +1.9u |
| 2026-05-16 | MLB | ML | away | 5.0 | 4.50 | +124 | 3 | 1 | 4 | 4 | -7 | -1.30 | W | +1.4u |
| 2026-05-16 | MLB | SPREAD | away | 4.0 | 1.65 | -175 | 2 | 0 | 2 | 2 | 0 | 0.00 | W | +0.9u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +119 | 2 | 1 | 3 | 1 | -5 | -2.00 | L | -2.5u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +115 | 3 | 2 | 5 | 2 | 0 | -1.10 | W | +2.8u |
| 2026-05-16 | MLB | TOTAL | over | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | -5 | 0.00 | L | -1.6u |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.50 | -102 | 1 | 0 | 1 | 1 | -11 | 0.00 | W | +0.5u |
| 2026-05-17 | MLB | ML | away | 4.0 | 2.75 | -148 | 1 | 0 | 1 | 2 | 0 | -0.70 | W | +1.9u |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.50 | +139 | 0 | 1 | 1 | 0 | -10 | 0.70 | L | -0.5u |
| 2026-05-17 | MLB | ML | away | 5.0 | 5.00 | -129 | 3 | 1 | 4 | 1 | -5 | 0.40 | L | -5.0u |
| 2026-05-17 | MLB | ML | home | 4.0 | 2.75 | -114 | 3 | 1 | 4 | 4 | -2 | 2.20 | W | +2.4u |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 1 | 3 | 2 | -8 | 0.00 | W | +2.0u |
| 2026-05-17 | MLB | TOTAL | over | 5.0 | 2.50 | +107 | 2 | 2 | 4 | 1 | -5 | 0.00 | L | -2.5u |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | 1 | 0.00 | W | +0.3u |
| 2026-05-17 | NBA | ML | away | 3.0 | 1.25 | +165 | 3 | 1 | 4 | 3 | 10 | -0.60 | W | +0.8u |
| 2026-05-17 | NBA | TOTAL | under | 5.0 | 0.75 | -110 | 2 | 3 | 5 | 0 | 26 | 0.00 | L | -0.8u |
| 2026-05-18 | MLB | ML | home | 4.5 | 5.00 | -111 | 2 | 1 | 3 | 2 | 0 | -1.10 | W | +4.4u |
| 2026-05-18 | MLB | ML | away | 4.0 | 2.50 | +120 | 2 | 0 | 2 | 1 | -5 | -2.10 | L | -2.5u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | -118 | 2 | 0 | 2 | 1 | -5 | 1.00 | W | +1.1u |
| 2026-05-18 | MLB | ML | home | 4.0 | 2.75 | -150 | 2 | 0 | 2 | 1 | 5 | -0.80 | L | -2.8u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | +132 | 2 | 0 | 2 | 2 | 0 | 0.40 | W | +1.6u |
| 2026-05-18 | NBA | ML | home | 5.0 | 5.00 | -240 | 3 | 2 | 5 | 4 | 23 | -1.60 | L | -5.0u |
| 2026-05-18 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 1 | 2 | 0 | 19 | 0.20 | L | -1.0u |
| 2026-05-18 | NHL | ML | home | 5.0 | 5.00 | -112 | 2 | 2 | 4 | 3 | 4 | -1.10 | L | -5.0u |
| 2026-05-18 | NHL | TOTAL | under | 4.5 | 2.25 | -110 | 3 | 1 | 4 | 3 | 8 | 0.00 | W | +2.0u |
| 2026-05-19 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 1 | -8 | -1.30 | L | -2.5u |
| 2026-05-19 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 1 | 3 | 0.00 | W | +1.5u |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.50 | +105 | 1 | 1 | 2 | 2 | -7 | -0.90 | L | -2.5u |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 1 | 1 | 2 | 0 | -2 | -1.20 | W | +1.2u |
| 2026-05-19 | NBA | ML | home | 5.0 | 5.00 | -260 | 0 | 3 | 3 | 3 | 10 | -0.50 | W | +1.9u |
| 2026-05-19 | NBA | SPREAD | away | 5.0 | 2.25 | -105 | 3 | 2 | 5 | 2 | 4 | -0.90 | L | -2.3u |
| 2026-05-19 | NBA | TOTAL | under | 5.0 | 3.00 | -106 | 2 | 3 | 5 | 2 | 11 | 0.00 | L | -3.0u |
| 2026-05-20 | MLB | ML | away | 5.0 | 2.50 | +113 | 2 | 1 | 3 | 1 | -5 | -1.00 | L | -2.5u |
| 2026-05-20 | MLB | ML | home | 4.0 | 2.75 | -154 | 2 | 0 | 2 | 1 | 5 | -1.50 | W | +1.9u |
| 2026-05-20 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | -5 | 0.00 | L | -0.8u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | -140 | 1 | 1 | 2 | 1 | -5 | -1.10 | W | +0.9u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | +111 | 0 | 1 | 1 | -1 | -5 | 0.00 | W | +0.6u |
| 2026-05-20 | MLB | ML | away | 4.0 | 2.75 | +113 | 1 | 1 | 2 | 0 | -10 | -1.00 | L | -2.8u |
| 2026-05-20 | NBA | ML | home | 5.0 | 5.00 | -225 | 10 | 5 | 15 | 1 | 14 | -0.20 | W | +2.1u |
| 2026-05-20 | NBA | SPREAD | home | 5.0 | 3.00 | -106 | 6 | 1 | 7 | 4 | 48 | -0.70 | W | +2.7u |
| 2026-05-20 | NBA | TOTAL | over | 5.0 | 1.65 | -112 | 3 | 1 | 4 | 3 | 50 | 0.00 | W | +1.5u |
| 2026-05-20 | NHL | ML | home | 2.5 | 1.25 | -192 | 0 | 1 | 1 | 1 | -4 | -0.80 | L | -1.3u |
| 2026-05-21 | MLB | ML | home | 5.0 | 2.50 | +125 | 1 | 1 | 2 | 2 | -7 | -0.40 | L | -2.5u |
| 2026-05-21 | MLB | SPREAD | home | 3.0 | 0.75 | -148 | 0 | 0 | 0 | 1 | -5 | -1.50 | L | -0.8u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +172 | 2 | 0 | 2 | 1 | -5 | -0.50 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 4.5 | 2.75 | -110 | 2 | 1 | 3 | 1 | -5 | -0.50 | W | +2.5u |
| 2026-05-21 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 0 | 0 | 1 | -3 | 0.00 | W | +0.3u |
| 2026-05-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 3 | 1 | 4 | 2 | -8 | -0.40 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +129 | 1 | 0 | 1 | 3 | -8 | -0.40 | W | +1.6u |
| 2026-05-21 | MLB | SPREAD | away | 4.0 | 1.65 | -170 | 1 | 1 | 2 | 1 | -3 | 0.30 | W | +1.0u |
| 2026-05-21 | NBA | SPREAD | away | 5.0 | 3.00 | -110 | 4 | 2 | 6 | 3 | 16 | 0.70 | L | -3.0u |
| 2026-05-21 | NHL | ML | home | 4.0 | 2.75 | -197 | 4 | 1 | 5 | 2 | 6 | -1.30 | L | -2.8u |
| 2026-05-21 | NHL | TOTAL | over | 3.0 | 0.75 | +103 | 1 | 0 | 1 | 1 | 6 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 5.0 | 1.25 | -175 | 1 | 0 | 1 | 1 | 5 | -0.90 | L | -1.3u |
| 2026-05-22 | MLB | ML | home | 4.0 | 1.25 | -195 | 3 | 0 | 3 | 0 | 0 | 0.80 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 3.0 | 1.25 | -137 | 1 | 0 | 1 | 1 | -1 | 0.00 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -144 | 4 | 2 | 6 | 2 | 0 | -1.60 | L | -5.0u |
| 2026-05-22 | MLB | SPREAD | home | 5.0 | 0.75 | -155 | 2 | 0 | 2 | 1 | -5 | -0.30 | W | +0.4u |
| 2026-05-22 | MLB | ML | home | 5.0 | 2.75 | -158 | 1 | 0 | 1 | 1 | 5 | -0.80 | W | +1.7u |
| 2026-05-22 | MLB | SPREAD | home | 3.0 | 0.75 | -142 | 1 | 0 | 1 | 1 | -5 | -2.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -145 | 2 | 2 | 4 | 1 | 5 | -2.20 | L | -5.0u |
| 2026-05-22 | MLB | ML | home | 2.5 | 0.50 | +139 | 2 | 1 | 3 | 0 | -8 | -0.90 | W | +0.7u |
| 2026-05-22 | MLB | SPREAD | home | 4.0 | 1.65 | -119 | 1 | 1 | 2 | 1 | -5 | -1.20 | W | +1.3u |
| 2026-05-22 | MLB | ML | away | 5.0 | 1.50 | +185 | 3 | 0 | 3 | 2 | -7 | -1.10 | L | -1.5u |
| 2026-05-22 | MLB | SPREAD | away | 3.0 | 0.75 | -112 | 1 | 0 | 1 | 1 | -5 | -1.40 | W | +0.6u |
| 2026-05-22 | NBA | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | -3 | -40 | 0.00 | L | -5.0u |
| 2026-05-22 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 0 | 1 | -2 | -2 | -0.50 | L | -1.0u |
| 2026-05-22 | NBA | TOTAL | over | 5.0 | 0.75 | +101 | 2 | 1 | 3 | 1 | 14 | 0.00 | W | +0.7u |
| 2026-05-22 | NHL | ML | home | 4.5 | 3.75 | -167 | 4 | 3 | 7 | 5 | 2 | 0.00 | L | -3.8u |
| 2026-05-22 | NHL | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 1 | 4 | 3 | -1 | 0.00 | W | +2.5u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._