# Sharp Intel v6 — Full Analysis

_Auto-generated **7/5/2026, 10:23:24 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 1055 shipped+graded picks · 2026-04-18 → 2026-07-04  (HC analyses scoped to post-cutover 2026-04-30, 943 picks)
**Headline:** 530-515-10 · WR 50.7% [47.7%–53.7%] vs 52.4% break-even · -41.9u flat (-4.0%) · -180.0u peak.
**Overall t-test:** t = -1.32 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.046 ✗**  (full sample, N=1049)
- **ρ(HC, flat ROI) = 0.000 ✗**  (post-cutover, N=943)
- **ρ(Δw+HC, flat ROI) = 0.014 ✗**  (post-cutover, N=943)

Cohort breakdown:

**Winning cohorts (t ≥ 1.645 with positive mean):**
- **Tier-1b HC = +1 (post-cutover)** — N=212, 127-85, WR 59.9% [53%–66%], flat ROI +12.3% (t=1.88 ~ p<.10)

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0 (full sample)** — N=288, 129-154, WR 45.6% [40%–51%], flat ROI -13.7% (t=-2.44 ✓ p<.05)

### Action map

- **Tier-1a (HC ≥ +2)** — N=75, WR 49.3%, flat ROI -11.7%. Bayesian posterior WR ≈ 49.4%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=212, WR 59.9%, flat ROI +12.3%. Bayesian posterior WR ≈ 59.5%, half-Kelly = **7.4%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=141, WR 48.2%, flat ROI -9.5%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=160, WR 52.5%, flat ROI -0.1%. Bayesian posterior WR ≈ 52.4%, half-Kelly = **0.0%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -13.7% flat ROI on 288 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (0.97u/pick), we need **~1454 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 1055. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-07-04 |
| Sides scanned | 1927 |
| Shipped + graded | **1055** |
| W-L-P | 530-515-10 |
| Win rate | **50.7%** [47.7%–53.7%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +1.7 pp |
| Peak-units PnL | **-180.0u** |
| Flat-1u PnL | **-41.9u** (-4.0% flat ROI) |
| Flat t-statistic vs zero | -1.32 → ✗ noise |
| Flat 95% CI per-pick | [-0.098, 0.019]u |

### Power note

At our observed flat-PnL standard deviation (0.97u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4038 |
| +5% | 1454 |
| +10% | 364 |

We have **1055** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 14 | 4-10-0 | 28.6% [12–55] | -35.4% | -6.0u | -1.18 ✗ noise |
| Δw = −1 | 49 | 19-28-2 | 40.4% [28–55] | -22.1% | -19.0u | -1.64 ✗ noise |
| Δw = 0 | 225 | 106-116-3 | 47.7% [41–54] | -10.5% | -55.9u | -1.67 ~ p<.10 |
| Δw = +1 | 420 | 220-197-3 | 52.8% [48–58] | -0.2% | -85.4u | -0.05 ✗ noise |
| Δw = +2 | 181 | 93-86-2 | 52.0% [45–59] | -1.2% | -16.3u | -0.17 ✗ noise |
| Δw ≥ +3 | 160 | 84-76-0 | 52.5% [45–60] | -0.1% | -1.4u | -0.01 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.063** ✓ p<.05  ·  **ρ(Δw, flat ROI) = 0.046** ✗  (N=1049)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 1 | 1-0-0 | 100.0% [21–100] | +86.2% | +2.5u | 0.00 ✗ n<2 |
| HC = −1 | 37 | 21-16-0 | 56.8% [41–71] | +18.0% | +9.7u | 1.01 ✗ noise |
| HC = 0 | 618 | 293-316-9 | 48.1% [44–52] | -9.4% | -245.0u | -2.45 ✓ p<.05 |
| HC = +1 | 212 | 127-85-0 | 59.9% [53–66] | +12.3% | +50.0u | 1.88 ~ p<.10 |
| HC = +2 | 51 | 27-24-0 | 52.9% [40–66] | -1.8% | +13.0u | -0.14 ✗ noise |
| HC ≥ +3 | 24 | 10-14-0 | 41.7% [24–61] | -32.5% | +0.3u | -1.92 ~ p<.10 |

**Pearson ρ(HC, WIN) = 0.026** ✗  ·  **ρ(HC, flat ROI) = 0.000** ✗  (N=943)

Spearman rank ρ(HC, flat ROI) = 0.024.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 234 | 106-124-4 | 46.1% [40–53] | -12.3% | -76.2u | -1.96 ✓ p<.05 |
| Σ = +1 | 325 | 167-155-3 | 51.9% [46–57] | -1.7% | -102.5u | -0.32 ✗ noise |
| Σ = +2 | 179 | 102-75-2 | 57.6% [50–65] | +7.9% | +18.4u | 1.11 ✗ noise |
| Σ = +3 | 83 | 40-43-0 | 48.2% [38–59] | -9.2% | -2.8u | -0.86 ✗ noise |
| Σ = +4 | 49 | 25-24-0 | 51.0% [37–64] | +0.0% | -13.7u | 0.00 ✗ noise |
| Σ = +5 | 27 | 16-11-0 | 59.3% [41–75] | +6.4% | +5.0u | 0.35 ✗ noise |
| Σ ≥ +6 | 46 | 23-23-0 | 50.0% [36–64] | -14.6% | +2.4u | -1.12 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = 0.041** ✗  ·  **ρ(Σ, flat ROI) = 0.014** ✗  (N=943)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 943.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.043 ✗ | 0.019 ✗ | 0.019 | weak |
| HC margin | 0.026 ✗ | 0.000 ✗ | 0.024 | weak |
| Δw + HC | 0.041 ✗ | 0.014 ✗ | 0.030 | weak |
| peak.stars | -0.032 ✗ | -0.045 ✗ | -0.048 | weak |
| vault.star | 0.011 ✗ | -0.008 ✗ | -0.027 | weak |
| lock.stars | -0.025 ✗ | -0.038 ✗ | -0.037 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 943 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | N=1 · 1-0 · 100% [21–100] · —  | — | — | — | — | — |
| -1 | N=1 · 1-0 · 100% [21–100] · —  | N=1 · 0-1 · 0% [0–79] · —  | N=10 · 6-4 · 60% [31–83] · +23%  | N=8 · 5-3 · 63% [31–86] · +31%  | N=10 · 5-5 · 50% [24–76] · -9%  | N=3 · 2-1 · 67% [21–94] · +48%  | N=4 · 2-2 · 50% [15–85] · -1%  |
| +0 | N=2 · 1-1 · 50% [9–91] · —  | N=6 · 1-5 · 17% [3–56] · -62%  | N=24 · 7-15 · 32% [16–53] · -36% ✗ | N=160 · 74-84 · 47% [39–55] · -12%  | N=292 · 147-142 · 51% [45–57] · -4%  | N=93 · 48-43 · 53% [43–63] · -2%  | N=41 · 15-26 · 37% [24–52] · -31% ✗ |
| +1 | — | — | N=9 · 5-4 · 56% [27–81] · -6%  | N=30 · 18-12 · 60% [42–75] · +12%  | N=79 · 51-28 · 65% [54–74] · +22% ★ | N=46 · 26-20 · 57% [42–70] · +8%  | N=48 · 27-21 · 56% [42–69] · +4%  |
| +2 | — | N=2 · 0-2 · 0% [0–66] · —  | — | N=3 · 1-2 · 33% [6–79] · -47%  | N=5 · 1-4 · 20% [4–62] · -64%  | N=11 · 5-6 · 45% [21–72] · -7%  | N=30 · 20-10 · 67% [49–81] · +21%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | N=1 · 1-0 · 100% [21–100] · —  | N=3 · 1-2 · 33% [6–79] · -50%  | N=19 · 7-12 · 37% [19–59] · -40% ✗ |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 1 | 1-0-0 | 100.0% [21–100] | +86.2% | +2.5u | 0.00 ✗ n<2 |
| HC = −1 | 37 | 21-16-0 | 56.8% [41–71] | +18.0% | +9.7u | 1.01 ✗ noise |
| HC = 0 | 618 | 293-316-9 | 48.1% [44–52] | -9.4% | -245.0u | -2.45 ✓ p<.05 |
| HC = +1 | 212 | 127-85-0 | 59.9% [53–66] | +12.3% | +50.0u | 1.88 ~ p<.10 |
| HC = +2 | 51 | 27-24-0 | 52.9% [40–66] | -1.8% | +13.0u | -0.14 ✗ noise |
| HC ≥ +3 | 24 | 10-14-0 | 41.7% [24–61] | -32.5% | +0.3u | -1.92 ~ p<.10 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 13 | 4-9-0 | 30.8% [13–58] | -30.4% | -5.5u | -0.96 ✗ noise |
| Δw = −1 | 43 | 18-23-2 | 43.9% [30–59] | -16.0% | -14.5u | -1.11 ✗ noise |
| Δw = 0 | 202 | 99-101-2 | 49.5% [43–56] | -7.3% | -42.6u | -1.08 ✗ noise |
| Δw = +1 | 387 | 205-179-3 | 53.4% [48–58] | +1.0% | -80.8u | 0.20 ✗ noise |
| Δw = +2 | 156 | 82-72-2 | 53.2% [45–61] | +0.4% | -12.5u | 0.05 ✗ noise |
| Δw ≥ +3 | 142 | 71-71-0 | 50.0% [42–58] | -8.4% | -13.6u | -1.06 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 287 | 164-123-0 | 57.1% [51–63] | +6.0% | +63.3u | 1.08 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 141 | 67-72-2 | 48.2% [40–56] | -9.5% | -40.9u | -1.19 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 515 | 248-260-7 | 48.8% [44–53] | -7.2% | -191.8u | -1.69 ~ p<.10 |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 981 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 45 | 17-28-0 | 37.8% [25–52] | -22.5% | -16.8u | -1.45 ✗ noise |
| Δcount = −1 | 82 | 39-42-1 | 48.1% [38–59] | -7.0% | -3.4u | -0.65 ✗ noise |
| Δcount = 0 (balanced) | 150 | 64-84-2 | 43.2% [36–51] | -18.4% | -57.2u | -2.38 ✓ p<.05 |
| Δcount = +1 | 361 | 189-170-2 | 52.6% [47–58] | -0.4% | -124.7u | -0.08 ✗ noise |
| Δcount = +2 | 186 | 98-86-2 | 53.3% [46–60] | -1.1% | -6.8u | -0.15 ✗ noise |
| Δcount ≥ +3 (heavy support) | 157 | 99-56-2 | 63.9% [56–71] | +22.0% | +62.3u | 2.71 ✓ p<.01 |

**ρ(Δcount, WIN) = 0.129** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.114** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -14 · ≤ 0 · ≤ 12 · ≤ 20 · > 20

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 197 | 80-117-0 | 40.6% [34–48] | -22.9% | -77.4u | -3.39 ✓ p<.01 |
| Q2 | 199 | 84-111-4 | 43.1% [36–50] | -16.1% | -73.5u | -2.34 ✓ p<.05 |
| Q3 (balanced) | 207 | 114-92-1 | 55.3% [49–62] | +3.8% | -23.5u | 0.57 ✗ noise |
| Q4 | 200 | 113-85-2 | 57.1% [50–64] | +7.9% | -42.6u | 1.17 ✗ noise |
| Q5 (best — heavy support) | 178 | 115-61-2 | 65.3% [58–72] | +23.2% | +70.4u | 3.13 ✓ p<.01 |

**ρ(ΔWlNet, WIN) = 0.195** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.178** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -Infinity · ≤ -17.97 · ≤ 3.20 · ≤ 14.81 · > 14.81

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 41 | 20-20-1 | 50.0% [35–65] | -4.4% | -10.7u | -0.29 ✗ noise |
| Q2 | 124 | 54-70-0 | 43.5% [35–52] | -17.6% | -35.1u | -2.03 ✓ p<.05 |
| Q3 | 248 | 119-128-1 | 48.2% [42–54] | -9.1% | -20.0u | -1.50 ✗ noise |
| Q4 | 266 | 150-112-4 | 57.3% [51–63] | +8.2% | -38.0u | 1.41 ✗ noise |
| Q5 | 302 | 163-136-3 | 54.5% [49–60] | +4.0% | -42.8u | 0.69 ✗ noise |

**ρ(ΔFlatPnl, WIN) = NaN** —  ·  **ρ(ΔFlatPnl, flat ROI) = NaN** —

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -Infinity · ≤ -10.4 · ≤ 1.7 · ≤ 19.3 · > 19.3

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 41 | 20-20-1 | 50.0% [35–65] | -4.4% | -10.7u | -0.29 ✗ noise |
| Q2 | 104 | 25-79-0 | 24.0% [17–33] | -53.0% | -73.7u | -6.26 ✓ p<.01 |
| Q3 | 288 | 146-141-1 | 50.9% [45–57] | -3.6% | -26.1u | -0.64 ✗ noise |
| Q4 | 253 | 148-101-4 | 59.4% [53–65] | +13.7% | +33.3u | 2.26 ✓ p<.05 |
| Q5 | 295 | 167-125-3 | 57.2% [51–63] | +7.0% | -69.4u | 1.22 ✗ noise |

**ρ(ΔAvgRoi, WIN) = NaN** —  ·  **ρ(ΔAvgRoi, flat ROI) = NaN** —

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 114 | 37-75-2 | 33.0% [25–42] | -35.4% | -58.1u | -4.08 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 30 | 11-19-0 | 36.7% [22–54] | -29.9% | -13.0u | -1.72 ~ p<.10 |
| ΔBestRank = 0 (tied) | 9 | 6-3-0 | 66.7% [35–88] | +25.3% | +3.3u | 0.77 ✗ noise |
| ΔBestRank ∈ [+1,+4] | 21 | 10-11-0 | 47.6% [28–68] | -6.5% | -3.3u | -0.29 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 259 | 139-117-3 | 54.3% [48–60] | +3.6% | -16.2u | 0.57 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.242** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.225** ✓ p<.01  (N=433)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 76 | 24-51-1 | 32.0% [23–43] | -36.6% | -49.6u | -3.40 ✓ p<.01 |
| Δshare ∈ [−30,−10] pp | 9 | 3-6-0 | 33.3% [12–65] | -24.2% | +0.7u | -0.59 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 601 | 304-293-4 | 50.9% [47–55] | -3.1% | -89.6u | -0.78 ✗ noise |
| Δshare ∈ [+10,+30] pp | 43 | 27-15-1 | 64.3% [49–77] | +18.5% | +25.1u | 1.34 ✗ noise |
| Δshare ≥ +30 pp | 252 | 148-101-3 | 59.4% [53–65] | +11.2% | -33.1u | 1.81 ~ p<.10 |

**ρ(ΔTopQShare, WIN) = 0.118** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.102** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔWlNet** | 0.195 ✓ p<.01 | 0.178 ✓ p<.01 | 0.153 |
| 2 | **ΔTopQCount** | 0.164 ✓ p<.01 | 0.148 ✓ p<.01 | 0.111 |
| 3 | **Δcount** | 0.129 ✓ p<.01 | 0.114 ✓ p<.01 | 0.094 |
| 4 | **ΔTopQShare** | 0.118 ✓ p<.01 | 0.102 ✓ p<.01 | 0.095 |
| 5 | **ΔFlatPnl** | NaN — | NaN — | 0.074 |
| 6 | **ΔAvgRoi** | NaN — | NaN — | 0.097 |

_(ΔBestRank uses N=433 subset where both sides had a proven wallet — ρ(flat ROI) = 0.225 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 1751, dateRange = 2026-04-18 → 2026-07-04, computedAt = 2026-07-05T14:20:32.763Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **981** rows · PIT aggregate computable on **1015** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **1015** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 1 · 100% · +76.9% | 2 · 50% · -11.5% | -88.5pp |
| NEUTRAL (0..+3) | 767 · 53% · +0.6% | 583 · 54% · -0.3% | -0.9pp |
| WEAK (−3..0) | 185 · 48% · -6.8% | 366 · 51% · -0.9% | +5.9pp |
| FADE (<−3) | 0 · — · — | 2 · 0% · -100.0% | — |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=530, WR=56%, ROI=+6.2% | N=456, WR=54%, ROI=+0.2% | -6.0pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=768, WR=53%, ROI=+0.7% | N=585, WR=54%, ROI=-0.3% | -1.0pp |
| AGS < −1 (mute veto) | N=59, WR=49%, ROI=-4.4% | N=218, WR=47%, ROI=-7.9% | -3.5pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-06-21 → 2026-07-04, N=288)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 2 · 50% · -11.5% |
| NEUTRAL (0..+3) | 170 · 57% · +4.9% |
| WEAK (−3..0) | 115 · 46% · -11.8% |
| FADE (<−3) | 1 · 0% · -100.0% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=141, WR=58%, ROI=+5.7% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=172, WR=57%, ROI=+4.8% |
| AGS < −1 (mute veto) | N=63, WR=43%, ROI=-18.4% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 0.71 | 2.36 |
| `dHcSizeRatio` | INTENSITY_HC | + | 0.53 | 6.03 |
| `dSumRankNorm` | QUALITY_RANK | − | 38.07 | 93.26 |
| `dWinnerCtPreA` | QUALITY_TRACK | − | 0.42 | 1.77 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **1015/1055** shipped+graded rows (96%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -4.22 |
| 20th pct | -0.21 |
| 40th pct | 0.01 |
| Median | 0.10 |
| 60th pct | 0.16 |
| 80th pct | 0.41 |
| 90th pct | 0.61 |
| Max | 4.66 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 183 | 18.0% |
| **LOCK** | +5..+7 | 190 | 18.7% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 133 | 13.1% |
| **FADE** | < −3 | 250 | 24.6% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 183 | 103-77-3 | 57.2% [50–64] | +2.9% | +9.0u | 0.43 ✗ noise |
| LOCK | 190 | 86-104-0 | 45.3% [38–52] | -13.7% | -95.4u | -1.95 ~ p<.10 |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 133 | 68-63-2 | 51.9% [43–60] | -1.0% | -14.8u | -0.12 ✗ noise |
| FADE | 250 | 115-131-4 | 46.7% [41–53] | -7.2% | -76.0u | -1.11 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.068** ✓ p<.05 · r(ROI) = **0.035** ✗ · Spearman ρ(ROI) = **0.002**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 200 | 97-101-2 | 49.0% [42–56] | -3.6% | -46.7u | -0.51 ✗ noise |
| z ∈ [−1, 0) | 419 | 213-202-4 | 51.3% [47–56] | -2.1% | -95.2u | -0.44 ✗ noise |
| z ∈ [0, +1) | 248 | 125-121-2 | 50.8% [45–57] | -5.5% | -26.7u | -0.91 ✗ noise |
| z ≥ +1 (very positive) | 148 | 78-68-2 | 53.4% [45–61] | -3.8% | +1.9u | -0.50 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 981 | 498-473-10 | 51.3% [48–54] | -3.5% | -163.7u | -1.14 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dSumRankNorm` (QUALITY_RANK)

r(WIN) = **-0.022** ✗ · r(ROI) = **-0.031** ✗ · Spearman ρ(ROI) = **-0.038**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 175 | 95-79-1 | 54.6% [47–62] | +2.3% | +18.2u | 0.31 ✗ noise |
| z ∈ [−1, 0) | 442 | 226-212-4 | 51.6% [47–56] | -1.6% | -111.0u | -0.33 ✗ noise |
| z ∈ [0, +1) | 292 | 138-150-4 | 47.9% [42–54] | -8.5% | -86.2u | -1.51 ✗ noise |
| z ≥ +1 (very positive) | 106 | 54-51-1 | 51.4% [42–61] | -7.0% | +12.3u | -0.78 ✗ noise |

#### `dWinnerCtPreA` (QUALITY_TRACK)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 981 | 498-473-10 | 51.3% [48–54] | -3.5% | -163.7u | -1.14 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dSumRankNorm` | QUALITY_RANK | -0.022 ✗ | -0.031 ✗ | -0.038 |
| 2 | `dCount` | COUNT | 0.068 ✓ p<.05 | 0.035 ✗ | 0.002 |
| 3 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |
| 4 | `dWinnerCtPreA` | QUALITY_TRACK | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | -0.062 | 0.840 | 51.0% | dominant |
| 2 | `dSumRankNorm` | -0.204 | 0.797 | 48.4% | meaningful |
| 3 | `dWinnerCtPreA` | -0.008 | 0.008 | 0.5% | silent (<0.2) |
| 4 | `dHcSizeRatio` | -0.003 | 0.003 | 0.2% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcSizeRatio` | `dSumRankNorm` | `dWinnerCtPreA` |
|---|---|---|---|---|
| `dCount` | 1.000 | -0.011 | +0.657 | -0.011 |
| `dHcSizeRatio` | -0.011 | 1.000 | -0.042 | +1.000 ⚠ |
| `dSumRankNorm` | +0.657 | -0.042 | 1.000 | -0.042 |
| `dWinnerCtPreA` | -0.011 | +1.000 ⚠ | -0.042 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.020**. At AGS ≥ +0.12 fires N=481, WR=52.7%, ROI=-2.3%. At AGS ≥ +null fires N=616, WR=52.5%, ROI=-2.8%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-481 ROI (matched cohort) | Top-481 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.050 | +0.030 | WR=55%, ROI=+4.1% | -6.4pp | N=579, WR=53%, ROI=+0.3% |
| `dHcSizeRatio` | +0.056 | +0.037 | WR=54%, ROI=+0.8% | -3.1pp | N=512, WR=54%, ROI=+0.8% |
| `dSumRankNorm` | -0.012 | −0.008 | WR=50%, ROI=-6.7% | +4.4pp | N=392, WR=52%, ROI=-3.9% |
| `dWinnerCtPreA` | +0.056 | +0.037 | WR=55%, ROI=+1.5% | -3.8pp | N=503, WR=55%, ROI=+1.3% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dSumRankNorm` | −0.008 | +4.4pp | mild marginal info |
| 2 | `dCount` | +0.030 | -6.4pp | redundant — other features cover it |
| 3 | `dHcSizeRatio` | +0.037 | -3.1pp | redundant — other features cover it |
| 4 | `dWinnerCtPreA` | +0.037 | -3.8pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dCount` | COUNT | +0.157 | 0.157 | positive ↑ |
| 2 | `dSumRankNorm` | QUALITY_RANK | -0.150 | 0.150 | negative ↓ |
| 3 | `dWinnerCtPreA` | QUALITY_TRACK | +0.009 | 0.009 | flat ≈ 0 |
| 4 | `dHcSizeRatio` | INTENSITY_HC | +0.003 | 0.003 | flat ≈ 0 |

Intercept b = +0.001 · Final log-loss = 0.6881 · N = 1015.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dCount` | COUNT | #2 | #1 | #2 | #1 | 1.50 |
| 2 | `dSumRankNorm` | QUALITY_RANK | #1 | #2 | #1 | #2 | 1.50 |
| 3 | `dHcSizeRatio` | INTENSITY_HC | #3 | #4 | #3 | #4 | 3.50 |
| 4 | `dWinnerCtPreA` | QUALITY_TRACK | #4 | #3 | #4 | #3 | 3.50 |

#### Plain-English summary

- **Workhorse**: `dCount` (COUNT) — ranks #2/#1/#2/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dWinnerCtPreA` (QUALITY_TRACK) — composite avg rank 3.50. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dHcSizeRatio` ↔ `dWinnerCtPreA` (r=+1.00). Each pair effectively double-counts the same signal in the composite.
- **Silent inputs (mean |z| < 0.2)**: `dWinnerCtPreA`, `dHcSizeRatio`. These barely move the AGS score in practice — calibration is washing them out.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 1015 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/1015 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 280 | 137-143-0 | 48.9% [43–55] | -11.3% | -171.7u | -2.03 ✓ p<.05 |
| 4.5★ | 224 | 117-104-3 | 52.9% [46–59] | +0.5% | -48.0u | 0.08 ✗ noise |
| 4.0★ | 202 | 96-103-3 | 48.2% [41–55] | -6.9% | +1.4u | -1.00 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 144 | 75-66-3 | 53.2% [45–61] | +2.7% | +15.9u | 0.33 ✗ noise |
| 2.5★ | 167 | 86-80-1 | 51.8% [44–59] | -2.9% | +18.5u | -0.39 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 52/52%/-7% | 53/48%/-9% | 47/37%/-31% | 6/33%/-26% | 51/37%/-27% | 78/51%/-3% |
| Δw = +1 | 73/55%/-0% | 105/50%/-4% | 102/49%/-6% | 28/54%/+4% | 61/61%/+15% | 50/52%/-6% |
| Δw = +2 | 72/44%/-16% | 33/58%/+7% | 42/59%/+12% | — | 18/59%/+12% | 16/50%/-3% |
| Δw ≥ +3 | 81/44%/-22% | 30/63%/+21% | 11/55%/+11% | 3/67%/+156% | 14/71%/+43% | 21/52%/-4% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 22 | 19-3-0 | 86.4% [67–95] | +4.9% | +7.1u | 0.54 ✗ noise |
| −300/−201 | 34 | 23-11-0 | 67.6% [51–81] | -1.7% | +13.9u | -0.15 ✗ noise |
| −200/−151 | 104 | 62-42-0 | 59.6% [50–69] | -5.0% | -28.1u | -0.65 ✗ noise |
| −150/−101 | 616 | 310-299-7 | 50.9% [47–55] | -4.5% | -92.1u | -1.18 ✗ noise |
| −100/+100 | 14 | 8-6-0 | 57.1% [33–79] | +14.3% | +1.3u | 0.52 ✗ noise |
| +101/+150 | 208 | 89-116-3 | 43.4% [37–50] | -4.9% | -71.3u | -0.65 ✗ noise |
| +151/+200 | 31 | 15-16-0 | 48.4% [32–65] | +26.8% | +6.8u | 1.12 ✗ noise |
| +201+ | 24 | 4-20-0 | 16.7% [7–36] | -32.7% | -7.5u | -1.00 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -10% (4) | -4% (5) | +26% (2) | +9% (10) |
| −300/−201 | -16% (12) | +30% (8) | +20% (6) | -28% (8) |
| −200/−151 | -20% (30) | +3% (40) | +28% (15) | -29% (18) |
| −150/−101 | -10% (165) | +0% (255) | -8% (106) | -5% (87) |
| −100/+100 | -100% (3) | +43% (7) | +33% (3) | +100% (1) |
| +101/+150 | -16% (60) | -5% (83) | -4% (39) | +19% (26) |
| +151/+200 | +2% (5) | +31% (14) | +54% (7) | +29% (4) |
| +201+ | -28% (9) | -100% (6) | -100% (3) | +62% (6) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 545 | 271-273-1 | 49.8% [46–54] | -6.5% | -83.4u | -1.53 ✗ noise |
| SPREAD | 186 | 93-91-2 | 50.5% [43–58] | -4.7% | -50.2u | -0.67 ✗ noise |
| TOTAL | 324 | 166-151-7 | 52.4% [47–58] | +0.7% | -46.5u | 0.13 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=146 · 43% · -20% | N=193 · 51% · -5% | N=94 · 54% · +4% | N=109 · 52% · -1% |
| SPREAD | N=52 · 37% · -30% | N=91 · 58% · +11% | N=26 · 58% · +2% | N=16 · 38% · -27% |
| TOTAL | N=90 · 55% · +6% | N=136 · 51% · -1% | N=61 · 46% · -11% | N=35 · 60% · +16% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 824 | 415-402-7 | 50.8% [47–54] | -4.0% | -167.2u | -1.21 ✗ noise |
| NBA | 130 | 60-69-1 | 46.5% [38–55] | -7.4% | -15.3u | -0.78 ✗ noise |
| NHL | 50 | 25-23-2 | 52.1% [38–66] | +0.7% | -16.2u | 0.05 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=234 · 47% · -12% | N=367 · 53% · -0% | N=138 · 53% · -0% | N=84 · 50% · -5% |
| NBA | N=30 · 31% · -43% | N=29 · 48% · -6% | N=23 · 48% · -5% | N=43 · 53% · +14% |
| NHL | N=10 · 70% · +44% | N=14 · 69% · +25% | N=13 · 42% · -18% | N=13 · 31% · -40% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 372 · 49% · -6.1% · -1.17 ✗ noise | 682 · 51% · -3.0% · -0.83 ✗ noise |
| **plusEV** | 89 · 52% · -1.5% · -0.13 ✗ noise | 965 · 51% · -4.3% · -1.40 ✗ noise |
| **pinnacleConfirms** | 199 · 55% · +2.5% · 0.35 ✗ noise | 665 · 49% · -7.0% · -1.87 ~ p<.10 |
| **invested10kPlus** | 462 · 52% · -2.8% · -0.62 ✗ noise | 402 · 49% · -7.1% · -1.47 ✗ noise |
| **lineMovingWith** | 389 · 55% · +3.2% · 0.64 ✗ noise | 665 · 48% · -8.4% · -2.23 ✓ p<.05 |
| **predMarketAligns** | 221 · 52% · -1.7% · -0.25 ✗ noise | 643 · 50% · -5.9% · -1.55 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 408 | 202-206-0 | 49.5% [45–54] | -5.6% | -146.1u | -1.17 ✗ noise |
| 1 | 193 | 92-94-7 | 49.5% [42–57] | -4.9% | -28.7u | -0.70 ✗ noise |
| 2 | 213 | 108-102-3 | 51.4% [45–58] | -3.5% | +7.6u | -0.53 ✗ noise |
| 3 | 76 | 39-37-0 | 51.3% [40–62] | -4.1% | -7.5u | -0.36 ✗ noise |
| 4 | 76 | 42-34-0 | 55.3% [44–66] | +1.9% | -7.1u | 0.17 ✗ noise |
| 5 | 71 | 38-33-0 | 53.5% [42–65] | -4.7% | -2.6u | -0.42 ✗ noise |
| 6 | 18 | 9-9-0 | 50.0% [29–71] | +16.0% | +4.4u | 0.45 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 121 | 65-55-1 | 54.2% [45–63] | +0.5% | -5.8u | 0.06 ✗ noise |
| NEAR_START | 406 | 203-196-7 | 50.9% [46–56] | -3.2% | -26.9u | -0.66 ✗ noise |
| NO_MOVE | 28 | 14-14-0 | 50.0% [33–67] | -6.2% | +10.9u | -0.34 ✗ noise |
| PREGAME | 306 | 152-154-0 | 49.7% [44–55] | -5.7% | -131.0u | -1.04 ✗ noise |
| SMALL_MOVE | 192 | 94-96-2 | 49.5% [42–57] | -6.5% | -29.6u | -0.92 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 615 | 313-298-4 | 51.2% [47–55] | -4.3% | -191.1u | -1.13 ✗ noise |
| STRONG | 135 | 67-65-3 | 50.8% [42–59] | -2.9% | +3.1u | -0.35 ✗ noise |
| LEAN | 289 | 144-142-3 | 50.3% [45–56] | -2.4% | +11.5u | -0.40 ✗ noise |
| CONTESTED | 15 | 5-10-0 | 33.3% [15–58] | -38.2% | -5.0u | -1.60 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.005 ✗ | -0.009 ✗ | -0.013 | -0.29 |
| totalInvested | -0.018 ✗ | -0.034 ✗ | -0.000 | -1.11 |
| evEdge | 0.080 ✓ p<.01 | 0.102 ✓ p<.01 | 0.028 | 3.34 |
| moneyPct | 0.025 ✗ | 0.002 ✗ | -0.007 | 0.06 |
| walletPct | 0.034 ✗ | 0.022 ✗ | 0.018 | 0.72 |
| criteriaMet | 0.030 ✗ | 0.022 ✗ | -0.010 | 0.70 |
| maxContribFor | 0.011 ✗ | 0.012 ✗ | 0.023 | 0.41 |
| meanBaseFor | -0.013 ✗ | 0.009 ✗ | 0.027 | 0.29 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **1039** picks. Mean CLV = **-0.0021**.
t-statistic vs zero: -1.41 → ✗ noise · 95% CI [-0.0050, 0.0008]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 116 | 52-63-1 | 45.2% [36–54] | -17.0% | -45.6u | -1.97 ✓ p<.05 |
| CLV (−2%, 0] | 608 | 312-289-7 | 51.9% [48–56] | -2.3% | -58.2u | -0.59 ✗ noise |
| CLV (0, +2%] | 260 | 132-127-1 | 51.0% [45–57] | -1.3% | -56.9u | -0.20 ✗ noise |
| CLV > +2% | 55 | 27-27-1 | 50.0% [37–63] | -3.6% | -9.6u | -0.27 ✗ noise |

ρ(CLV, flat ROI) = 0.010 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=775 (with all features non-null). Intercept β₀ = 0.091.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | sharpCount | -0.227 | ↓ hurts |
| 2 | log(impliedProb) | +0.227 | ↑ helps |
| 3 | pw.ΔTopQShare | +0.222 | ↑ helps |
| 4 | pw.ΔWlNet | +0.203 | ↑ helps |
| 5 | pw.Δcount | +0.200 | ↑ helps |
| 6 | evEdge | +0.162 | ↑ helps |
| 7 | pw.ΔAvgRoi | +0.135 | ↑ helps |
| 8 | odds (American) | -0.109 | ↓ hurts |
| 9 | moneyPct | -0.103 | ↓ hurts |
| 10 | criteriaMet | +0.083 | ↑ helps |
| 11 | peak.stars | -0.082 | ↓ hurts |
| 12 | pw.ΔFlatPnl | +0.052 | ↑ helps |
| 13 | vault.star | +0.030 | ≈ flat |
| 14 | walletPct | +0.029 | ≈ flat |
| 15 | Δw | +0.005 | ≈ flat |
| 16 | Δw + HC | +0.005 | ≈ flat |
| 17 | HC margin | +0.002 | ≈ flat |
| 18 | log10(invested) | -0.001 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 75 | 37-38 | 49.3% | 49.4% | -110 | — (mute) | 2.39u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 212 | 127-85 | 59.9% | 59.5% | -110 | 7.43% bankroll | 2.07u | **UNDER-SIZED** — ship up to 7.43u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 141 | 67-72 | 48.2% | 48.3% | -110 | — (mute) | 2.03u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 160 | 84-76 | 52.5% | 52.4% | -110 | — (mute) | 2.38u | **MUTE** (negative EV at posterior) |
| Stale Δw = 0 | 225 | 106-116 | 47.7% | 47.8% | -110 | — (mute) | 1.74u | **MUTE** (negative EV at posterior) |
| Stale Δw ≤ −1 | 63 | 23-38 | 37.7% | 39.4% | -110 | — (mute) | 1.19u | **MUTE** (negative EV at posterior) |

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
| 2026-06-01 | 7 | 4-3 | +2.4u | -71.0u |
| 2026-06-02 | 10 | 4-6 | +1.9u | -69.0u |
| 2026-06-03 | 19 | 11-8 | +0.8u | -68.2u |
| 2026-06-04 | 13 | 7-6 | -2.9u | -71.1u |
| 2026-06-05 | 18 | 11-6 | +10.1u | -61.0u |
| 2026-06-06 | 14 | 7-7 | -1.8u | -62.7u |
| 2026-06-07 | 25 | 15-10 | +3.6u | -59.2u |
| 2026-06-08 | 13 | 7-5 | +10.0u | -49.2u |
| 2026-06-09 | 21 | 10-11 | +14.1u | -35.1u |
| 2026-06-10 | 25 | 11-14 | -12.1u | -47.1u |
| 2026-06-11 | 12 | 4-5 | -3.2u | -50.3u |
| 2026-06-12 | 16 | 9-7 | +6.1u | -44.3u |
| 2026-06-13 | 19 | 11-8 | +1.8u | -42.4u |
| 2026-06-14 | 13 | 6-7 | -16.1u | -58.5u |
| 2026-06-15 | 18 | 7-11 | -8.7u | -67.2u |
| 2026-06-16 | 23 | 12-11 | -11.8u | -79.0u |
| 2026-06-17 | 17 | 9-8 | -12.3u | -91.3u |
| 2026-06-18 | 8 | 6-2 | +2.1u | -89.2u |
| 2026-06-19 | 23 | 12-11 | -13.5u | -102.7u |
| 2026-06-20 | 14 | 7-7 | -2.0u | -104.7u |
| 2026-06-21 | 22 | 7-15 | -19.1u | -123.8u |
| 2026-06-22 | 19 | 11-8 | -6.4u | -130.2u |
| 2026-06-23 | 25 | 9-16 | -27.0u | -157.2u |
| 2026-06-24 | 30 | 18-12 | -17.4u | -174.7u |
| 2026-06-25 | 14 | 6-8 | -5.6u | -180.2u |
| 2026-06-26 | 21 | 13-8 | -5.4u | -185.6u |
| 2026-06-27 | 23 | 10-13 | -7.4u | -193.0u |
| 2026-06-28 | 25 | 10-15 | -9.5u | -202.5u |
| 2026-06-29 | 21 | 10-10 | +6.7u | -195.8u |
| 2026-06-30 | 31 | 17-13 | +17.1u | -178.7u |
| 2026-07-01 | 20 | 10-10 | -10.8u | -189.6u |
| 2026-07-02 | 22 | 7-15 | -18.4u | -207.9u |
| 2026-07-03 | 18 | 13-5 | +18.1u | -189.8u |
| 2026-07-04 | 21 | 14-7 | +9.8u | -180.0u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -215.0u
**Longest losing-day streak:** 10
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.274  (annualized × √252 ≈ -4.35)

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
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.50 | -108 | 0 | — | — | -1 | 0 | -2.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1.00 | -108 | 0 | — | — | 0 | 0 | -1.70 | L | -1.0u |
| 2026-04-18 | NBA | TOTAL | over | 3.0 | 0.75 | -107 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-18 | NBA | TOTAL | under | 5.0 | 2.00 | -104 | — | — | — | — | — | 0.00 | W | +1.9u |
| 2026-04-18 | NBA | ML | home | 5.0 | 3.00 | -360 | — | — | — | — | — | 0.20 | W | +0.8u |
| 2026-04-18 | NBA | TOTAL | under | 4.5 | 1.50 | -105 | — | — | — | — | — | 0.00 | L | -1.5u |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 2 | -5 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 1 | 2 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 1 | -8 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 1 | 2 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | -1 | -2 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 4 | 21 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 2 | -7 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 1 | 2 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | -1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 1 | 2 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | 1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | -2 | -21 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 1 | 12 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 0 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | 1 | -6 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | 0 | -13 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 1 | 3 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 2 | 26 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | -1 | 1 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 1 | -3 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 0 | 9 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 1 | 5 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 1 | 15 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 1 | 0 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | 0 | 0 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 1 | 0 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 1 | -6 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 1 | 0 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | 0 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | 1 | 2 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | 0 | -31 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | -1 | -12 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 1 | -8 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 4 | 24 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 3 | -3 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 1 | -8 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | -1 | -12 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | 1 | -14 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | 0 | -8 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | 0 | 0 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 0 | 0 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 1 | 6 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 3 | 15 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 1 | 1 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -1 | -16 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 2 | -4 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 0 | 0 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | 1 | 0 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 16 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 2 | -5 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | -5 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | -11 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 2 | -17 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 4 | 18 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 1 | 25 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 2 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 21 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 2 | 0 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 0 | -34 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 2 | -4 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | 1 | -17 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 2 | 10 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 1 | 3 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 1 | -6 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 2 | -3 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 2 | 6 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | 0 | 34 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | -5 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 2 | 10 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 3 | 7 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 2 | 12 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 4 | 26 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 2 | 6 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 1 | -6 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 3 | -1 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | 2 | 12 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 2 | -4 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 2 | -18 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 3 | 16 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 3 | 28 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 4 | 17 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 2 | 26 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 0 | 20 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 22 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 2 | 10 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 2 | 10 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | 23 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 26 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 2 | -3 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 6 | 1 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 21 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 1 | 15 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 3 | 9 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 1 | 15 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 0 | -1 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 0 | 4 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 3 | 10 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 9 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | -9 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 0 | -20 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 3 | 8 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 0 | -5 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 0 | 0 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 15 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 1 | 4 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 4 | -9 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 2 | 12 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 2 | 16 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 2 | 17 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 3 | 17 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | 0 | 0 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 2 | 3 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 13 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 15 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 13 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | 0 | 3 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 34 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 4 | 14 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 2 | -7 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 1 | 7 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 5 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 8 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 5 | 17 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 0 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 18 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 3 | 21 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 0 | 6 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 1 | -6 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 1 | -6 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 2 | 24 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 3 | 29 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 15 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 0 | 0 | -1.30 | L | -1.1u |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.70 | -104 | — | — | — | 2 | 9 | 0.00 | W | +1.6u |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 1 | 2 | 1 | 5 | 0.00 | W | +0.7u |
| 2026-05-09 | NBA | ML | away | 5.0 | 4.50 | -364 | 3 | 1 | 4 | 6 | 36 | 0.00 | W | +1.2u |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2.00 | -104 | 2 | 1 | 3 | 2 | 15 | 0.00 | W | +1.9u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -120 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +0.9u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | TOTAL | over | 4.0 | 0.64 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -0.6u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -103 | 1 | 1 | 2 | 1 | -19 | 0.00 | L | -1.1u |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -110 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +1.0u |
| 2026-05-10 | MLB | ML | away | 3.5 | 1.13 | +134 | 0 | 1 | 1 | 1 | -19 | 0.00 | W | +1.5u |
| 2026-05-10 | NBA | ML | home | 4.0 | 1.50 | +160 | 1 | 1 | 2 | 3 | 22 | 0.80 | W | +2.6u |
| 2026-05-10 | NBA | TOTAL | over | 5.0 | 3.50 | -110 | 3 | 2 | 5 | 2 | 19 | 0.00 | W | +3.3u |
| 2026-05-10 | NHL | ML | away | 4.5 | 4.50 | +108 | 2 | 2 | 4 | 1 | 6 | -0.70 | L | -4.5u |
| 2026-05-10 | NHL | TOTAL | under | 5.0 | 1.70 | -110 | 2 | 1 | 3 | 0 | 0 | 0.00 | L | -1.7u |
| 2026-05-11 | MLB | ML | away | 3.5 | 1.13 | -101 | 1 | 1 | 2 | 2 | -21 | 0.00 | W | +1.1u |
| 2026-05-11 | MLB | ML | home | 3.5 | 1.13 | -156 | 1 | 1 | 2 | 1 | -19 | 0.00 | W | +0.7u |
| 2026-05-11 | NBA | TOTAL | under | 4.5 | 2.00 | -110 | 1 | 2 | 3 | 0 | 8 | 0.00 | L | -2.0u |
| 2026-05-11 | NHL | TOTAL | under | 4.5 | 1.27 | -110 | 2 | 0 | 2 | 2 | 14 | 0.00 | L | -1.3u |
| 2026-05-12 | MLB | ML | away | 5.0 | 4.50 | +108 | 4 | 0 | 4 | 2 | -16 | -0.20 | L | -4.5u |
| 2026-05-12 | MLB | TOTAL | under | 4.0 | 0.64 | -110 | 2 | 1 | 3 | 1 | -6 | 0.00 | L | -0.6u |
| 2026-05-12 | MLB | ML | away | 4.5 | 3.00 | +129 | 3 | 0 | 3 | 1 | 3 | -1.00 | L | -3.0u |
| 2026-05-12 | MLB | ML | home | 5.0 | 3.00 | +108 | 3 | 0 | 3 | 1 | -6 | -0.50 | L | -3.0u |
| 2026-05-12 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 6 | 4 | 10 | 5 | 31 | -0.70 | L | -3.5u |
| 2026-05-13 | MLB | ML | home | 4.5 | 4.50 | -116 | 1 | 1 | 2 | 2 | -16 | -1.30 | W | +3.7u |
| 2026-05-13 | MLB | SPREAD | home | 5.0 | 3.50 | -105 | 1 | 1 | 2 | 2 | -25 | 0.90 | W | +3.2u |
| 2026-05-13 | MLB | TOTAL | under | 4.0 | 0.96 | -110 | 1 | 1 | 2 | 2 | -5 | 0.00 | W | +0.9u |
| 2026-05-13 | MLB | TOTAL | under | 5.0 | 3.50 | -110 | 4 | 2 | 6 | 4 | -20 | 0.00 | L | -3.5u |
| 2026-05-13 | NBA | ML | home | 5.0 | 4.50 | -162 | 6 | 0 | 6 | 2 | -16 | -1.00 | L | -4.5u |
| 2026-05-13 | NBA | TOTAL | over | 5.0 | 3.50 | -101 | 3 | 2 | 5 | 4 | 2 | 0.00 | W | +3.4u |
| 2026-05-14 | MLB | ML | home | 5.0 | 4.50 | -103 | 4 | 1 | 5 | 2 | 3 | -0.40 | L | -4.5u |
| 2026-05-14 | MLB | ML | home | 4.0 | 1.25 | +108 | 2 | 0 | 2 | 1 | -19 | -0.90 | L | -1.3u |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 1 | 2 | 1 | -6 | 0.00 | L | -0.5u |
| 2026-05-14 | NHL | TOTAL | under | 5.0 | 3.50 | -110 | 3 | 1 | 4 | 1 | 8 | 0.00 | L | -3.5u |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 0 | 1 | 1 | 3 | 10 | 0.00 | W | +1.7u |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 1 | 1 | 2 | 3 | -5 | 0.00 | W | +0.3u |
| 2026-05-15 | MLB | ML | home | 4.0 | 2.50 | +128 | 0 | 0 | 0 | 0 | 3 | 0.00 | L | -2.5u |
| 2026-05-15 | MLB | ML | away | 4.0 | 2.75 | -211 | 2 | 1 | 3 | 1 | 3 | -0.90 | W | +1.3u |
| 2026-05-15 | MLB | ML | away | 3.0 | 1.25 | +115 | 0 | 1 | 1 | 0 | 0 | -1.10 | L | -1.3u |
| 2026-05-15 | NBA | ML | away | 2.5 | 0.50 | +145 | 6 | 1 | 7 | 5 | 38 | -0.50 | W | +0.8u |
| 2026-05-15 | NBA | TOTAL | over | 4.0 | 0.75 | -109 | 0 | 1 | 1 | 3 | -14 | 0.00 | L | -0.8u |
| 2026-05-15 | NBA | SPREAD | home | 2.5 | 1.00 | -105 | 1 | 0 | 1 | 1 | 23 | 0.00 | L | -1.0u |
| 2026-05-15 | NBA | TOTAL | over | 5.0 | 2.00 | -110 | 1 | 0 | 1 | 3 | -1 | 0.00 | W | +1.9u |
| 2026-05-16 | MLB | ML | away | 5.0 | 4.50 | +124 | 3 | 1 | 4 | 3 | -27 | -1.30 | W | +1.4u |
| 2026-05-16 | MLB | SPREAD | away | 4.0 | 1.65 | -175 | 2 | 0 | 2 | 1 | -6 | 0.00 | W | +0.9u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +119 | 2 | 1 | 3 | 1 | -19 | -2.00 | L | -2.5u |
| 2026-05-16 | MLB | ML | home | 5.0 | 2.50 | +115 | 3 | 2 | 5 | 1 | -6 | -1.10 | W | +2.8u |
| 2026-05-16 | MLB | TOTAL | over | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | -28 | 0.00 | L | -1.6u |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.50 | -102 | 1 | 0 | 1 | 3 | 10 | 0.00 | W | +0.5u |
| 2026-05-17 | MLB | ML | away | 4.0 | 2.75 | -148 | 1 | 0 | 1 | 1 | -19 | -0.70 | W | +1.9u |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.50 | +139 | 0 | 1 | 1 | 1 | -19 | 0.70 | L | -0.5u |
| 2026-05-17 | MLB | ML | away | 5.0 | 5.00 | -129 | 3 | 1 | 4 | 1 | -19 | 0.40 | L | -5.0u |
| 2026-05-17 | MLB | ML | home | 4.0 | 2.75 | -114 | 3 | 1 | 4 | 3 | -8 | 2.20 | W | +2.4u |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 1 | 3 | 2 | -25 | 0.00 | W | +2.0u |
| 2026-05-17 | MLB | TOTAL | over | 5.0 | 2.50 | +107 | 2 | 2 | 4 | 1 | -19 | 0.00 | L | -2.5u |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | -14 | 0.00 | W | +0.3u |
| 2026-05-17 | NBA | ML | away | 3.0 | 1.25 | +165 | 3 | 1 | 4 | 3 | 2 | -0.60 | W | +0.8u |
| 2026-05-17 | NBA | TOTAL | under | 5.0 | 0.75 | -110 | 2 | 3 | 5 | 0 | 30 | 0.00 | L | -0.8u |
| 2026-05-18 | MLB | ML | home | 4.5 | 5.00 | -111 | 2 | 1 | 3 | 1 | -19 | -1.10 | W | +4.4u |
| 2026-05-18 | MLB | ML | away | 4.0 | 2.50 | +120 | 2 | 0 | 2 | 1 | -19 | -2.10 | L | -2.5u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | -118 | 2 | 0 | 2 | 1 | -19 | 1.00 | W | +1.1u |
| 2026-05-18 | MLB | ML | home | 4.0 | 2.75 | -150 | 2 | 0 | 2 | 0 | 0 | -0.80 | L | -2.8u |
| 2026-05-18 | MLB | ML | home | 3.0 | 1.25 | +132 | 2 | 0 | 2 | 2 | -3 | 0.40 | W | +1.6u |
| 2026-05-18 | NBA | ML | home | 5.0 | 5.00 | -240 | 3 | 2 | 5 | 4 | 23 | -1.60 | L | -5.0u |
| 2026-05-18 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 1 | 2 | 0 | 19 | 0.20 | L | -1.0u |
| 2026-05-18 | NHL | ML | home | 5.0 | 5.00 | -112 | 2 | 2 | 4 | 1 | 5 | -1.10 | L | -5.0u |
| 2026-05-18 | NHL | TOTAL | under | 4.5 | 2.25 | -110 | 3 | 1 | 4 | 1 | 8 | 0.00 | W | +2.0u |
| 2026-05-19 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 2 | -20 | -1.30 | L | -2.5u |
| 2026-05-19 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | 18 | 0.00 | W | +1.5u |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.50 | +105 | 1 | 1 | 2 | 2 | -21 | -0.90 | L | -2.5u |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 1 | 1 | 2 | 1 | -10 | -1.20 | W | +1.2u |
| 2026-05-19 | NBA | ML | home | 5.0 | 5.00 | -260 | 0 | 3 | 3 | 3 | 5 | -0.50 | W | +1.9u |
| 2026-05-19 | NBA | SPREAD | away | 5.0 | 2.25 | -105 | 3 | 2 | 5 | 2 | -4 | -0.90 | L | -2.3u |
| 2026-05-19 | NBA | TOTAL | under | 5.0 | 3.00 | -106 | 2 | 3 | 5 | 2 | 14 | 0.00 | L | -3.0u |
| 2026-05-20 | MLB | ML | away | 5.0 | 2.50 | +113 | 2 | 1 | 3 | 1 | -19 | -1.00 | L | -2.5u |
| 2026-05-20 | MLB | ML | home | 4.0 | 2.75 | -154 | 2 | 0 | 2 | 1 | 3 | -1.50 | W | +1.9u |
| 2026-05-20 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | -19 | 0.00 | L | -0.8u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | -140 | 1 | 1 | 2 | 1 | -19 | -1.10 | W | +0.9u |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.50 | +111 | 0 | 1 | 1 | 0 | 0 | 0.00 | W | +0.6u |
| 2026-05-20 | MLB | ML | away | 4.0 | 2.75 | +113 | 1 | 1 | 2 | 1 | -19 | -1.00 | L | -2.8u |
| 2026-05-20 | NBA | ML | home | 5.0 | 5.00 | -225 | 10 | 5 | 15 | 1 | 19 | -0.20 | W | +2.1u |
| 2026-05-20 | NBA | SPREAD | home | 5.0 | 3.00 | -106 | 6 | 1 | 7 | 4 | 40 | -0.70 | W | +2.7u |
| 2026-05-20 | NBA | TOTAL | over | 5.0 | 1.65 | -112 | 3 | 1 | 4 | 3 | 38 | 0.00 | W | +1.5u |
| 2026-05-20 | NHL | ML | home | 2.5 | 1.25 | -192 | 0 | 1 | 1 | 1 | 1 | -0.80 | L | -1.3u |
| 2026-05-21 | MLB | ML | home | 5.0 | 2.50 | +125 | 1 | 1 | 2 | 2 | -21 | -0.40 | L | -2.5u |
| 2026-05-21 | MLB | SPREAD | home | 3.0 | 0.75 | -148 | 0 | 0 | 0 | 1 | -19 | -1.50 | L | -0.8u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +172 | 2 | 0 | 2 | 1 | -19 | -0.50 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 4.5 | 2.75 | -110 | 2 | 1 | 3 | 1 | -19 | -0.50 | W | +2.5u |
| 2026-05-21 | MLB | TOTAL | under | 2.5 | 0.30 | -110 | 0 | 0 | 0 | 0 | -40 | 0.00 | W | +0.3u |
| 2026-05-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 3 | 1 | 4 | 3 | -22 | -0.40 | L | -1.3u |
| 2026-05-21 | MLB | ML | away | 3.0 | 1.25 | +129 | 1 | 0 | 1 | 3 | -26 | -0.40 | W | +1.6u |
| 2026-05-21 | MLB | SPREAD | away | 4.0 | 1.65 | -170 | 1 | 1 | 2 | 1 | -6 | 0.30 | W | +1.0u |
| 2026-05-21 | NBA | SPREAD | away | 5.0 | 3.00 | -110 | 4 | 2 | 6 | 3 | 16 | 0.70 | L | -3.0u |
| 2026-05-21 | NHL | ML | home | 4.0 | 2.75 | -197 | 4 | 1 | 5 | 1 | 8 | -1.30 | L | -2.8u |
| 2026-05-21 | NHL | TOTAL | over | 3.0 | 0.75 | +103 | 1 | 0 | 1 | 1 | 8 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 5.0 | 1.25 | -175 | 1 | 0 | 1 | 0 | 0 | -0.90 | L | -1.3u |
| 2026-05-22 | MLB | ML | home | 4.0 | 1.25 | -195 | 3 | 0 | 3 | 1 | 3 | 0.80 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | 12 | 0.00 | W | +0.7u |
| 2026-05-22 | MLB | ML | home | 3.0 | 1.25 | -137 | 1 | 0 | 1 | 1 | -13 | 0.00 | L | -1.3u |
| 2026-05-22 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | -1 | -15 | 0.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -144 | 4 | 2 | 6 | 1 | -19 | -1.60 | L | -5.0u |
| 2026-05-22 | MLB | SPREAD | home | 5.0 | 0.75 | -155 | 2 | 0 | 2 | 1 | -19 | -0.30 | W | +0.4u |
| 2026-05-22 | MLB | ML | home | 5.0 | 2.75 | -158 | 1 | 0 | 1 | 0 | 0 | -0.80 | W | +1.7u |
| 2026-05-22 | MLB | SPREAD | home | 3.0 | 0.75 | -142 | 1 | 0 | 1 | 1 | -19 | -2.00 | L | -0.8u |
| 2026-05-22 | MLB | ML | home | 5.0 | 5.00 | -145 | 2 | 2 | 4 | 0 | 0 | -2.20 | L | -5.0u |
| 2026-05-22 | MLB | ML | home | 2.5 | 0.50 | +139 | 2 | 1 | 3 | 1 | -6 | -0.90 | W | +0.7u |
| 2026-05-22 | MLB | SPREAD | home | 4.0 | 1.65 | -119 | 1 | 1 | 2 | 1 | -19 | -1.20 | W | +1.3u |
| 2026-05-22 | MLB | ML | away | 5.0 | 1.50 | +185 | 3 | 0 | 3 | 2 | -21 | -1.10 | L | -1.5u |
| 2026-05-22 | MLB | SPREAD | away | 3.0 | 0.75 | -112 | 1 | 0 | 1 | 1 | -19 | -1.40 | W | +0.6u |
| 2026-05-22 | NBA | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | -2 | -36 | 0.00 | L | -5.0u |
| 2026-05-22 | NBA | SPREAD | home | 2.5 | 1.00 | -110 | 1 | 0 | 1 | -2 | 7 | -0.50 | L | -1.0u |
| 2026-05-22 | NBA | TOTAL | over | 5.0 | 0.75 | +101 | 2 | 1 | 3 | 1 | 9 | 0.00 | W | +0.7u |
| 2026-05-22 | NHL | ML | home | 4.5 | 3.75 | -167 | 4 | 3 | 7 | 4 | 4 | 0.00 | L | -3.8u |
| 2026-05-22 | NHL | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 1 | 4 | 0 | 0 | 0.00 | W | +2.5u |
| 2026-05-23 | MLB | ML | home | 2.5 | 0.50 | -181 | 1 | 0 | 1 | 1 | 14 | -1.70 | W | +0.3u |
| 2026-05-23 | MLB | ML | away | 2.5 | 2.75 | +109 | 2 | 0 | 2 | 2 | -12 | -0.50 | L | -2.8u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -110 | 0 | 1 | 1 | -1 | -31 | 0.00 | W | +0.3u |
| 2026-05-23 | MLB | ML | home | 5.0 | 1.00 | -148 | 0 | 0 | 0 | 1 | -26 | -0.20 | L | -1.0u |
| 2026-05-23 | MLB | SPREAD | away | 3.0 | 0.75 | -163 | 1 | 0 | 1 | 0 | -34 | 0.00 | W | +0.5u |
| 2026-05-23 | MLB | TOTAL | under | 5.0 | 3.00 | -110 | 3 | 1 | 4 | 3 | -29 | 0.00 | W | +2.7u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | 14 | -0.90 | L | -0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 1 | 3 | 2 | -28 | 0.00 | L | -0.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 1.50 | -209 | 0 | 0 | 0 | 2 | -5 | 29.00 | W | +2.5u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | +102 | 0 | 0 | 0 | 1 | 14 | 0.00 | W | +0.8u |
| 2026-05-23 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -19 | 0.00 | W | +0.7u |
| 2026-05-23 | MLB | ML | away | 2.5 | 1.25 | -111 | -1 | 1 | 0 | 1 | 20 | 0.40 | L | -1.3u |
| 2026-05-23 | MLB | SPREAD | home | 3.0 | 0.75 | -135 | 0 | 0 | 0 | 1 | 14 | 0.40 | W | +0.6u |
| 2026-05-23 | MLB | TOTAL | under | 2.5 | 0.30 | +108 | 0 | 0 | 0 | 0 | 3 | 0.00 | P | +0.0u |
| 2026-05-23 | MLB | ML | home | 4.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | -22 | 1.10 | W | +2.9u |
| 2026-05-23 | MLB | ML | away | 3.0 | 1.25 | +166 | 2 | 1 | 3 | 2 | -41 | -0.30 | W | +1.8u |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 2.25 | -123 | 1 | 0 | 1 | 2 | 8 | -0.90 | W | +1.6u |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.30 | -111 | 1 | 0 | 1 | 1 | 14 | 0.00 | L | -0.3u |
| 2026-05-23 | NBA | SPREAD | home | 5.0 | 3.00 | -107 | 5 | 1 | 6 | 2 | 24 | 0.20 | L | -3.0u |
| 2026-05-23 | NBA | TOTAL | under | 5.0 | 3.00 | +102 | 1 | -1 | 0 | 6 | 1 | 0.00 | L | -3.0u |
| 2026-05-23 | NHL | ML | home | 5.0 | 5.00 | -205 | 8 | 0 | 8 | 3 | 4 | -0.70 | W | +2.4u |
| 2026-05-23 | NHL | TOTAL | under | 3.0 | 0.30 | -110 | 1 | 1 | 2 | 0 | -3 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | home | 4.5 | 3.75 | -101 | 2 | 1 | 3 | 2 | -25 | 0.00 | L | -3.8u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -189 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 0.75 | -110 | 1 | 0 | 1 | 1 | -9 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 1 | 2 | 1 | -27 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | 1 | -6 | 0.00 | W | +4.3u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 2 | 0 | 2 | 1 | 4 | 0.00 | W | +0.7u |
| 2026-05-24 | MLB | TOTAL | under | 4.0 | 1.65 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 2.5 | 0.50 | +144 | 1 | 1 | 2 | -1 | -37 | 0.00 | L | -0.5u |
| 2026-05-24 | MLB | SPREAD | home | 4.0 | 1.65 | -110 | 2 | 1 | 3 | 2 | -5 | -1.30 | L | -1.6u |
| 2026-05-24 | MLB | ML | home | 3.0 | 1.25 | -107 | 1 | 0 | 1 | 1 | 11 | 0.00 | W | +1.2u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 1.00 | -101 | 1 | 1 | 2 | 1 | 14 | 0.00 | W | +0.0u |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 0.30 | -104 | 0 | 0 | 0 | 0 | -3 | 0.00 | W | +0.3u |
| 2026-05-24 | MLB | ML | away | 4.0 | 1.25 | +148 | 2 | 2 | 4 | 0 | -40 | -1.40 | W | +1.9u |
| 2026-05-24 | MLB | ML | away | 3.0 | 1.25 | -122 | -1 | 1 | 0 | 0 | -27 | -1.10 | L | -1.3u |
| 2026-05-24 | MLB | TOTAL | over | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 2 | -3 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | SPREAD | home | 3.0 | 0.75 | +134 | 1 | 0 | 1 | 1 | 2 | 0.00 | L | -0.8u |
| 2026-05-24 | MLB | TOTAL | under | 3.0 | 0.75 | -110 | 1 | 0 | 1 | 0 | -35 | 0.00 | W | +0.7u |
| 2026-05-24 | NBA | SPREAD | away | 5.0 | 1.65 | -103 | 3 | 0 | 3 | 1 | 2 | 0.50 | L | -1.6u |
| 2026-05-24 | NBA | TOTAL | over | 4.5 | 3.00 | -107 | 2 | 1 | 3 | 2 | -21 | 0.00 | L | -3.0u |
| 2026-05-24 | NHL | ML | away | 4.0 | 2.75 | -136 | 3 | 0 | 3 | 1 | 4 | -0.70 | L | -2.8u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -149 | 1 | 0 | 1 | 2 | -12 | -0.70 | L | -5.0u |
| 2026-05-25 | MLB | ML | home | 5.0 | 5.00 | -310 | 2 | 0 | 2 | 1 | 2 | -1.20 | W | +1.6u |
| 2026-05-25 | MLB | TOTAL | over | 4.0 | 1.65 | +103 | 1 | 0 | 1 | 2 | 27 | 0.00 | L | -1.6u |
| 2026-05-25 | MLB | ML | home | 4.0 | 1.25 | -125 | 1 | -1 | 0 | 1 | -6 | -1.90 | L | -1.3u |
| 2026-05-25 | MLB | SPREAD | away | 4.0 | 1.65 | -184 | 1 | 0 | 1 | 1 | -6 | 28.40 | W | +2.4u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 2.25 | -112 | 4 | 0 | 4 | 3 | 6 | 0.00 | L | -2.3u |
| 2026-05-25 | MLB | ML | home | 5.0 | 1.25 | -160 | 3 | 0 | 3 | 2 | -45 | -1.10 | L | -1.3u |
| 2026-05-25 | MLB | TOTAL | over | 5.0 | 3.00 | -110 | 3 | 0 | 3 | 3 | 29 | 0.00 | W | +2.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 3.75 | -108 | 0 | 0 | 0 | 3 | -31 | -1.70 | L | -3.8u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -124 | 2 | 0 | 2 | 2 | -5 | -1.30 | W | +0.5u |
| 2026-05-25 | MLB | ML | away | 5.0 | 5.00 | -119 | 2 | -1 | 1 | 4 | 10 | -0.60 | W | +3.1u |
| 2026-05-25 | MLB | ML | away | 2.5 | 2.75 | -113 | 0 | 0 | 0 | 0 | -11 | -1.80 | W | +1.1u |
| 2026-05-25 | MLB | ML | home | 4.0 | 5.00 | -209 | -1 | 0 | -1 | 2 | -12 | -0.80 | W | +2.3u |
| 2026-05-25 | MLB | TOTAL | under | 5.0 | 0.75 | -101 | 2 | 1 | 3 | 1 | -9 | 0.00 | W | +0.7u |
| 2026-05-25 | MLB | SPREAD | home | 5.0 | 1.65 | -178 | 1 | 0 | 1 | 2 | -5 | -1.60 | W | +0.9u |
| 2026-05-25 | NBA | ML | away | 5.0 | 5.00 | -125 | 0 | 0 | 0 | 3 | 26 | -0.40 | W | +4.0u |
| 2026-05-25 | NBA | TOTAL | under | 5.0 | 3.00 | -110 | 2 | 2 | 4 | 0 | -2 | 0.00 | L | -3.0u |
| 2026-05-25 | NHL | ML | home | 5.0 | 2.50 | +120 | 8 | 4 | 12 | 1 | -4 | -0.60 | L | -2.5u |
| 2026-05-25 | NHL | SPREAD | home | 4.5 | 2.25 | -215 | 1 | 1 | 2 | 1 | 1 | -0.80 | W | +1.1u |
| 2026-05-26 | MLB | TOTAL | over | 5.0 | 1.65 | -110 | 2 | 0 | 2 | 2 | -5 | 0.00 | W | +1.5u |
| 2026-05-26 | MLB | ML | away | 5.0 | 1.50 | +200 | 2 | 0 | 2 | 2 | -21 | -1.00 | L | -1.5u |
| 2026-05-26 | MLB | SPREAD | away | 5.0 | 1.00 | -101 | 2 | 1 | 3 | 2 | -5 | 0.50 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 2.5 | 1.25 | +113 | 0 | 0 | 0 | -1 | -14 | -1.50 | W | +1.4u |
| 2026-05-26 | MLB | ML | home | 2.5 | 1.25 | -130 | 1 | 0 | 1 | -1 | -14 | -1.30 | W | +1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -200 | 1 | 0 | 1 | 1 | 14 | -0.60 | W | +1.9u |
| 2026-05-26 | MLB | SPREAD | home | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 2 | 27 | -0.20 | L | -1.0u |
| 2026-05-26 | MLB | ML | away | 5.0 | 5.00 | -102 | 3 | 1 | 4 | 2 | -32 | -0.50 | W | +4.9u |
| 2026-05-26 | MLB | ML | home | 5.0 | 3.75 | -108 | 3 | 1 | 4 | 2 | 8 | -0.20 | L | -3.8u |
| 2026-05-26 | MLB | ML | home | 5.0 | 5.00 | -105 | 2 | 1 | 3 | 1 | 14 | -2.00 | W | +3.6u |
| 2026-05-26 | MLB | ML | away | 5.0 | 2.50 | +116 | 1 | 0 | 1 | 1 | 14 | -1.00 | W | +2.9u |
| 2026-05-26 | NBA | ML | home | 5.0 | 5.00 | -198 | 2 | 4 | 6 | 2 | 12 | -0.70 | W | +1.9u |
| 2026-05-26 | NBA | SPREAD | home | 5.0 | 1.00 | -110 | 2 | 2 | 4 | 3 | 21 | 1.20 | W | +0.0u |
| 2026-05-26 | NBA | TOTAL | over | 5.0 | 3.00 | -108 | 0 | 0 | 0 | 3 | -3 | 0.00 | W | +2.6u |
| 2026-05-26 | NHL | SPREAD | home | 5.0 | 2.25 | -250 | 2 | 0 | 2 | 2 | 6 | 0.80 | W | +0.9u |
| 2026-05-27 | MLB | ML | home | 4.5 | 0.50 | -102 | 3 | 1 | 4 | 1 | 0 | -1.10 | W | +0.4u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 2.50 | +141 | 1 | 1 | 2 | 3 | -5 | 0.80 | L | -2.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.00 | +105 | 2 | 0 | 2 | 2 | -5 | 0.00 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 4.5 | 3.75 | -420 | 1 | 1 | 2 | 0 | 0 | -0.50 | W | +0.7u |
| 2026-05-27 | MLB | ML | home | 3.0 | 1.25 | -144 | -1 | -1 | -2 | 0 | -20 | -1.00 | L | -1.3u |
| 2026-05-27 | MLB | ML | away | 5.0 | 0.50 | -102 | 3 | 0 | 3 | 1 | -2 | -1.00 | L | -0.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.0 | 0.75 | -163 | 0 | 0 | 0 | 1 | 14 | 0.40 | W | +0.5u |
| 2026-05-27 | MLB | TOTAL | under | 5.0 | 1.00 | -112 | 3 | 1 | 4 | 3 | -1 | 0.00 | W | +0.0u |
| 2026-05-27 | MLB | ML | away | 4.0 | 1.00 | -108 | 1 | -1 | 0 | 0 | 33 | -0.90 | L | -1.0u |
| 2026-05-27 | MLB | ML | home | 5.0 | 0.50 | +132 | 2 | 0 | 2 | 2 | 34 | -0.50 | L | -0.5u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 1.65 | +104 | 2 | 0 | 2 | 2 | 27 | 0.00 | W | +1.7u |
| 2026-05-27 | MLB | TOTAL | under | 4.0 | 0.75 | +104 | 2 | 0 | 2 | 2 | 25 | 0.00 | W | +0.8u |
| 2026-05-27 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 2 | 5 | 2 | -33 | -0.30 | L | -2.5u |
| 2026-05-27 | MLB | SPREAD | away | 4.5 | 1.65 | -145 | 1 | 1 | 2 | 1 | 14 | -0.30 | W | +1.1u |
| 2026-05-27 | MLB | ML | away | 5.0 | 5.00 | -126 | 2 | 0 | 2 | 3 | 38 | -4.10 | L | -5.0u |
| 2026-05-27 | MLB | ML | home | 4.0 | 1.25 | -190 | 1 | 0 | 1 | 0 | 0 | -0.70 | W | +0.7u |
| 2026-05-27 | MLB | SPREAD | away | 5.0 | 3.00 | -135 | 0 | 0 | 0 | 2 | 14 | -0.90 | W | +2.2u |
| 2026-05-27 | NHL | SPREAD | home | 5.0 | 1.00 | -194 | 3 | 0 | 3 | 1 | 1 | 0.00 | L | -1.0u |
| 2026-05-27 | NHL | TOTAL | over | 5.0 | 2.25 | -112 | 3 | 0 | 3 | 1 | -1 | 0.00 | L | -2.3u |
| 2026-05-28 | MLB | TOTAL | over | 5.0 | 3.00 | +101 | 3 | -1 | 2 | 3 | 48 | 0.00 | W | +2.5u |
| 2026-05-28 | MLB | ML | home | 5.0 | 1.25 | -140 | 2 | 0 | 2 | 2 | -20 | -0.50 | L | -1.3u |
| 2026-05-28 | MLB | TOTAL | under | 5.0 | 1.00 | -107 | 1 | 0 | 1 | 1 | 27 | 0.00 | W | +0.0u |
| 2026-05-28 | MLB | ML | away | 5.0 | 2.50 | +128 | 3 | 1 | 4 | 3 | -31 | -0.60 | L | -2.5u |
| 2026-05-28 | MLB | TOTAL | over | 2.5 | 1.65 | -108 | 2 | 0 | 2 | 2 | -5 | 0.00 | L | -1.6u |
| 2026-05-28 | NBA | SPREAD | away | 5.0 | 1.00 | -110 | 1 | 2 | 3 | 0 | -2 | -0.90 | L | -1.0u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.50 | +118 | 5 | 1 | 6 | 4 | 36 | -0.90 | L | -2.5u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 0.75 | -135 | 2 | 0 | 2 | 1 | -39 | 1.00 | L | -0.8u |
| 2026-05-29 | MLB | ML | home | 5.0 | 3.75 | -124 | 2 | 1 | 3 | 2 | -5 | -1.00 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 1.65 | -106 | 2 | 0 | 2 | 3 | 25 | 0.00 | L | -1.6u |
| 2026-05-29 | MLB | ML | home | 4.0 | 2.50 | +120 | 1 | 0 | 1 | 1 | -2 | 0.40 | W | +3.0u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 2.25 | -112 | 2 | 0 | 2 | 3 | 55 | 0.00 | W | +2.0u |
| 2026-05-29 | MLB | SPREAD | away | 4.0 | 0.75 | +150 | 0 | 0 | 0 | 1 | 14 | -0.50 | L | -0.8u |
| 2026-05-29 | MLB | ML | away | 5.0 | 2.50 | +140 | 2 | 1 | 3 | 1 | -38 | 1.00 | L | -2.5u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 1.65 | -103 | 0 | 0 | 0 | 2 | -5 | 0.00 | W | +1.6u |
| 2026-05-29 | MLB | ML | away | 4.5 | 1.25 | -142 | 0 | 1 | 1 | 0 | 60 | -1.20 | W | +0.3u |
| 2026-05-29 | MLB | SPREAD | home | 5.0 | 1.65 | -135 | 1 | 0 | 1 | 2 | -5 | 0.40 | W | +1.2u |
| 2026-05-29 | MLB | ML | home | 4.5 | 1.25 | -134 | 1 | 0 | 1 | 0 | -30 | -1.70 | W | +2.8u |
| 2026-05-29 | MLB | SPREAD | away | 5.0 | 2.25 | -184 | 0 | 0 | 0 | 1 | 14 | -1.00 | W | +1.2u |
| 2026-05-29 | MLB | TOTAL | over | 4.0 | 0.75 | -109 | 1 | 0 | 1 | 2 | 25 | 0.00 | W | +0.7u |
| 2026-05-29 | MLB | ML | home | 5.0 | 2.75 | -106 | 2 | 1 | 3 | 0 | -1 | 0.70 | L | -2.8u |
| 2026-05-29 | MLB | SPREAD | home | 4.0 | 1.65 | -175 | 0 | 0 | 0 | 2 | -5 | -0.80 | L | -1.6u |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 0.30 | +105 | 2 | 1 | 3 | 0 | -1 | 0.00 | W | +0.3u |
| 2026-05-29 | MLB | ML | home | 4.5 | 3.75 | -122 | 0 | 1 | 1 | 1 | 21 | -0.60 | L | -3.8u |
| 2026-05-29 | MLB | TOTAL | over | 3.0 | 1.00 | -108 | 0 | 0 | 0 | 1 | 14 | 0.00 | W | +1.5u |
| 2026-05-29 | NHL | ML | away | 5.0 | 1.00 | +205 | 3 | 0 | 3 | 0 | -4 | -0.60 | L | -1.0u |
| 2026-05-29 | NHL | SPREAD | away | 5.0 | 3.00 | -118 | 3 | 1 | 4 | 1 | -4 | 0.00 | L | -3.0u |
| 2026-05-29 | NHL | TOTAL | under | 5.0 | 2.25 | -106 | 2 | 0 | 2 | 2 | 1 | 0.00 | L | -2.3u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +132 | 2 | 1 | 3 | 2 | -25 | 0.00 | L | -2.5u |
| 2026-05-30 | MLB | ML | away | 4.5 | 2.75 | -125 | 1 | 2 | 3 | 1 | 28 | -0.60 | W | +2.3u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -130 | 1 | 0 | 1 | 2 | -10 | -1.20 | L | -5.0u |
| 2026-05-30 | MLB | ML | away | 4.0 | 3.75 | -132 | 1 | 1 | 2 | 0 | 35 | -1.00 | W | +2.9u |
| 2026-05-30 | MLB | SPREAD | home | 3.0 | 0.75 | -143 | 0 | 1 | 1 | 0 | -20 | -1.40 | L | -0.8u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -118 | 1 | 1 | 2 | 1 | -10 | -1.30 | L | -3.8u |
| 2026-05-30 | MLB | SPREAD | away | 4.0 | 1.00 | +152 | 1 | 0 | 1 | 1 | 14 | 0.20 | L | -1.0u |
| 2026-05-30 | MLB | ML | home | 5.0 | 5.00 | -120 | 0 | 0 | 0 | 3 | -31 | -1.10 | W | +4.2u |
| 2026-05-30 | MLB | TOTAL | over | 4.5 | 0.75 | +100 | 1 | 1 | 2 | 1 | -7 | 0.00 | W | +0.8u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.75 | -130 | 0 | 1 | 1 | -1 | -14 | -1.60 | W | +0.4u |
| 2026-05-30 | MLB | TOTAL | over | 4.0 | 2.25 | -116 | 2 | 0 | 2 | 2 | 30 | 0.00 | W | +1.9u |
| 2026-05-30 | MLB | TOTAL | under | 4.0 | 1.65 | -107 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -1.6u |
| 2026-05-30 | MLB | ML | home | 4.0 | 2.50 | +129 | 1 | 0 | 1 | 1 | -19 | -0.90 | W | +0.7u |
| 2026-05-30 | MLB | SPREAD | home | 5.0 | 1.65 | -120 | 2 | 1 | 3 | 2 | -5 | -0.60 | W | +1.4u |
| 2026-05-30 | MLB | ML | away | 5.0 | 2.50 | +108 | 1 | 0 | 1 | 3 | -31 | -0.90 | W | +2.7u |
| 2026-05-30 | MLB | ML | home | 4.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | -19 | -0.20 | W | +0.6u |
| 2026-05-30 | MLB | ML | home | 5.0 | 1.25 | -102 | 2 | 0 | 2 | 1 | -19 | -0.70 | W | +1.2u |
| 2026-05-30 | MLB | ML | away | 5.0 | 3.75 | -122 | 1 | 1 | 2 | 2 | -12 | -0.20 | L | -3.8u |
| 2026-05-30 | MLB | TOTAL | under | 3.0 | 0.75 | -108 | 0 | 0 | 0 | 1 | 14 | 0.00 | L | -0.8u |
| 2026-05-30 | NBA | ML | home | 5.0 | 1.00 | -154 | 3 | 3 | 6 | 0 | 5 | 0.00 | L | -1.0u |
| 2026-05-30 | NBA | TOTAL | under | 5.0 | 2.50 | -109 | 5 | 0 | 5 | 6 | 6 | 0.00 | L | -2.5u |
| 2026-05-31 | MLB | ML | away | 3.0 | 2.75 | -125 | -2 | 0 | -2 | 1 | -6 | -1.20 | L | -2.8u |
| 2026-05-31 | MLB | TOTAL | under | 5.0 | 1.65 | -114 | 2 | 0 | 2 | 3 | 6 | 0.00 | L | -1.6u |
| 2026-05-31 | MLB | ML | home | 2.5 | 2.75 | -115 | 1 | 1 | 2 | 1 | 46 | 0.00 | W | +2.4u |
| 2026-05-31 | MLB | ML | away | 5.0 | 1.00 | +115 | -1 | 0 | -1 | 2 | -12 | -0.60 | L | -1.0u |
| 2026-05-31 | MLB | SPREAD | away | 5.0 | 1.00 | -117 | 3 | 1 | 4 | 3 | 8 | -0.20 | L | -1.0u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -164 | 0 | 1 | 1 | 2 | -12 | -1.20 | W | +2.3u |
| 2026-05-31 | MLB | ML | away | 3.0 | 1.25 | -184 | 0 | 0 | 0 | 0 | -40 | -1.70 | W | +0.7u |
| 2026-05-31 | MLB | ML | home | 2.5 | 1.25 | -232 | 0 | 0 | 0 | 0 | 16 | -0.50 | W | +0.5u |
| 2026-05-31 | MLB | ML | home | 5.0 | 5.00 | -102 | 0 | 1 | 1 | 3 | -18 | 0.20 | W | +4.9u |
| 2026-05-31 | MLB | TOTAL | over | 4.0 | 1.00 | +101 | 2 | 1 | 3 | 2 | 8 | 0.00 | L | -1.0u |
| 2026-05-31 | MLB | ML | away | 4.5 | 2.50 | +110 | 0 | 0 | 0 | 0 | -40 | -1.10 | L | -2.5u |
| 2026-06-01 | MLB | ML | home | 4.5 | 3.00 | -155 | 3 | 2 | 5 | 2 | 14 | -1.00 | W | +2.1u |
| 2026-06-01 | MLB | ML | away | 4.0 | 1.00 | +135 | 2 | 2 | 4 | 1 | 34 | -0.20 | W | +1.4u |
| 2026-06-01 | MLB | ML | away | 5.0 | 2.50 | +160 | 2 | -1 | 1 | 1 | 35 | -1.30 | W | +2.7u |
| 2026-06-01 | MLB | TOTAL | under | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 2 | -17 | 0.00 | L | -1.0u |
| 2026-06-01 | MLB | ML | home | 3.0 | 0.50 | -142 | -1 | 0 | -1 | -2 | -16 | -0.40 | L | -0.5u |
| 2026-06-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 33 | 0.00 | L | -5.0u |
| 2026-06-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 3 | -3 | 0.00 | W | +2.7u |
| 2026-06-02 | MLB | ML | home | 2.5 | 0.25 | -215 | -1 | 0 | -1 | -1 | -16 | -1.40 | L | -0.3u |
| 2026-06-02 | MLB | TOTAL | under | 4.0 | 1.00 | -117 | 1 | 0 | 1 | 0 | -3 | 0.00 | L | -1.0u |
| 2026-06-02 | MLB | ML | away | 5.0 | 2.50 | +130 | 2 | 0 | 2 | -1 | 28 | -0.60 | W | +3.1u |
| 2026-06-02 | MLB | ML | away | 3.0 | 0.50 | +100 | 1 | 0 | 1 | 1 | 14 | -1.20 | W | +0.5u |
| 2026-06-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 13 | 0.00 | L | -3.0u |
| 2026-06-02 | MLB | ML | home | 4.0 | 1.00 | -112 | 1 | 0 | 1 | 0 | 0 | -1.10 | L | -1.0u |
| 2026-06-02 | MLB | ML | home | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 0 | 0 | -0.50 | L | -1.0u |
| 2026-06-02 | MLB | ML | away | 5.0 | 2.50 | +102 | 0 | -1 | -1 | 2 | 7 | 0.00 | L | -2.5u |
| 2026-06-02 | NHL | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 2 | 4 | 2 | 13 | 0.00 | W | +4.3u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -150 | 3 | 1 | 4 | 4 | -18 | -1.30 | W | +0.3u |
| 2026-06-03 | MLB | ML | away | 4.0 | 1.00 | +134 | -1 | -1 | -2 | -2 | 12 | -1.00 | W | +1.2u |
| 2026-06-03 | MLB | ML | away | 4.0 | 1.00 | +125 | 0 | -1 | -1 | -1 | 23 | 0.40 | W | +1.3u |
| 2026-06-03 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 56 | 0.00 | L | -3.0u |
| 2026-06-03 | MLB | ML | home | 4.5 | 1.50 | +167 | 0 | 0 | 0 | -2 | -21 | -0.40 | L | -1.5u |
| 2026-06-03 | MLB | SPREAD | away | 4.0 | 1.00 | -111 | 1 | 0 | 1 | 0 | 2 | 0.20 | W | +0.8u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -103 | 3 | 1 | 4 | 2 | -24 | -1.20 | L | -0.5u |
| 2026-06-03 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | -17 | 0.00 | L | -5.0u |
| 2026-06-03 | MLB | ML | away | 3.0 | 0.50 | +119 | 1 | 0 | 1 | -1 | 5 | 0.00 | W | +0.6u |
| 2026-06-03 | MLB | ML | away | 4.5 | 3.00 | -137 | 0 | 0 | 0 | -2 | 5 | -1.50 | L | -3.0u |
| 2026-06-03 | MLB | ML | home | 5.0 | 5.00 | -215 | 0 | 1 | 1 | -1 | 26 | -1.00 | W | +2.3u |
| 2026-06-03 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 1 | 1 | 2 | 0 | -17 | 0.00 | L | -0.3u |
| 2026-06-03 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 1 | 0 | 1 | 0 | -3 | 0.00 | W | +2.5u |
| 2026-06-03 | MLB | ML | home | 4.5 | 3.00 | -112 | 0 | 0 | 0 | 0 | 0 | -0.90 | W | +2.7u |
| 2026-06-03 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 0 | 0.00 | W | +4.5u |
| 2026-06-03 | MLB | ML | home | 3.0 | 0.50 | -139 | 0 | 0 | 0 | -2 | 46 | -1.20 | W | +0.3u |
| 2026-06-03 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 1 | 0 | 1 | 0 | -3 | 0.00 | L | -2.5u |
| 2026-06-03 | NBA | ML | home | 2.5 | 0.25 | -198 | 3 | 4 | 7 | 5 | 9 | -1.20 | L | -0.3u |
| 2026-06-03 | NBA | SPREAD | away | 2.5 | 0.25 | -104 | 3 | -1 | 2 | 4 | 1 | -1.20 | W | +0.2u |
| 2026-06-04 | MLB | ML | away | 3.0 | 0.50 | +104 | 1 | 0 | 1 | 0 | -20 | 0.00 | W | +0.5u |
| 2026-06-04 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | -1 | 0 | 0 | 21 | 0.00 | L | -1.0u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | +102 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-04 | MLB | ML | home | 5.0 | 2.50 | +118 | 1 | 1 | 2 | 0 | 42 | -0.40 | W | +3.0u |
| 2026-06-04 | MLB | SPREAD | away | 5.0 | 5.00 | -111 | 0 | 0 | 0 | 1 | 16 | 0.00 | L | -5.0u |
| 2026-06-04 | MLB | ML | home | 5.0 | 5.00 | -131 | 1 | 0 | 1 | 0 | 42 | 0.20 | W | +3.5u |
| 2026-06-04 | MLB | ML | away | 2.5 | 0.25 | +105 | 0 | 0 | 0 | 1 | 3 | -1.00 | W | +0.2u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | -210 | 1 | 0 | 1 | 1 | 51 | -1.00 | W | +0.5u |
| 2026-06-04 | MLB | ML | home | 4.0 | 1.00 | -188 | 0 | 0 | 0 | -1 | -14 | -1.10 | L | -1.0u |
| 2026-06-04 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 36 | 0.00 | W | +2.7u |
| 2026-06-04 | MLB | ML | home | 3.0 | 0.50 | -235 | 4 | 0 | 4 | 4 | 32 | 0.00 | L | -0.5u |
| 2026-06-04 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 2 | 0.00 | L | -5.0u |
| 2026-06-04 | NHL | ML | home | 2.5 | 0.25 | -160 | -3 | 0 | -3 | 2 | 11 | -0.40 | W | +0.2u |
| 2026-06-05 | MLB | ML | home | 2.5 | 0.25 | -144 | 1 | 1 | 2 | -1 | -5 | -1.20 | L | -0.3u |
| 2026-06-05 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | -1 | -1 | -1 | 19 | 0.00 | W | +2.8u |
| 2026-06-05 | MLB | ML | away | 3.0 | 0.50 | +128 | 1 | 0 | 1 | 0 | 21 | 0.00 | W | +0.6u |
| 2026-06-05 | MLB | TOTAL | over | 4.0 | 1.00 | -109 | 0 | 0 | 0 | 0 | -3 | 0.00 | P | +0.0u |
| 2026-06-05 | MLB | ML | home | 3.0 | 0.50 | -136 | 1 | 0 | 1 | 1 | -3 | 0.00 | W | +0.4u |
| 2026-06-05 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 3 | 0 | 3 | 4 | 22 | 0.00 | W | +0.4u |
| 2026-06-05 | MLB | ML | away | 5.0 | 5.00 | -122 | 0 | 1 | 1 | 1 | 56 | -0.80 | L | -5.0u |
| 2026-06-05 | MLB | ML | home | 5.0 | 5.00 | -171 | 0 | 2 | 2 | 2 | 30 | -0.20 | W | +2.7u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -188 | 2 | 0 | 2 | 1 | 14 | -0.90 | W | +0.5u |
| 2026-06-05 | MLB | ML | away | 4.0 | 1.00 | -105 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -141 | 3 | 2 | 5 | 2 | -10 | 0.30 | W | +0.7u |
| 2026-06-05 | MLB | TOTAL | over | 5.0 | 2.50 | -110 | 0 | 1 | 1 | -1 | 28 | 0.00 | W | +2.5u |
| 2026-06-05 | MLB | ML | home | 4.0 | 1.00 | -172 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-05 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 0 | -1 | -1 | 0 | -3 | 0.00 | W | +4.4u |
| 2026-06-05 | MLB | ML | away | 4.5 | 3.00 | -129 | -1 | 1 | 0 | -2 | 34 | -1.10 | W | +2.2u |
| 2026-06-05 | MLB | SPREAD | away | 3.0 | 0.50 | +126 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.6u |
| 2026-06-05 | NBA | ML | home | 2.5 | 0.25 | -230 | 2 | 2 | 4 | 4 | 11 | 1.00 | L | -0.3u |
| 2026-06-05 | NBA | SPREAD | home | 2.5 | 0.25 | -106 | 3 | 0 | 3 | 0 | 4 | -0.70 | L | -0.3u |
| 2026-06-06 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 1 | 0 | 1 | 0 | 13 | 0.00 | W | +0.2u |
| 2026-06-06 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | 6 | 0.00 | W | +2.7u |
| 2026-06-06 | MLB | ML | home | 4.5 | 3.00 | -126 | 0 | 0 | 0 | -1 | -14 | -1.00 | W | +2.4u |
| 2026-06-06 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | -3 | 0.00 | W | +2.7u |
| 2026-06-06 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 1 | 1 | -1 | 12 | 0.00 | L | -1.0u |
| 2026-06-06 | MLB | ML | home | 3.0 | 0.50 | -130 | 0 | 0 | 0 | -1 | 15 | -0.90 | L | -0.5u |
| 2026-06-06 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -5.0u |
| 2026-06-06 | MLB | ML | home | 4.5 | 3.00 | -350 | 0 | 1 | 1 | -1 | 46 | -0.90 | W | +0.9u |
| 2026-06-06 | MLB | TOTAL | under | 5.0 | 2.50 | -110 | 0 | 0 | 0 | 0 | 2 | 0.00 | L | -2.5u |
| 2026-06-06 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 1 | 4 | 3 | 4 | 0.00 | W | +2.8u |
| 2026-06-06 | MLB | ML | home | 5.0 | 5.00 | -123 | 0 | 0 | 0 | 1 | 13 | 0.00 | W | +4.1u |
| 2026-06-06 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | L | -1.0u |
| 2026-06-06 | MLB | ML | home | 5.0 | 2.50 | +117 | -2 | -1 | -3 | 0 | 28 | 0.00 | L | -2.5u |
| 2026-06-06 | MLB | ML | home | 5.0 | 5.00 | -154 | 2 | 1 | 3 | -1 | 28 | -0.80 | L | -5.0u |
| 2026-06-07 | MLB | ML | home | 4.5 | 3.00 | -130 | 1 | 0 | 1 | -1 | 26 | -0.90 | W | +2.2u |
| 2026-06-07 | MLB | TOTAL | over | 3.0 | 0.50 | -112 | 0 | 0 | 0 | 3 | 5 | 0.00 | L | -0.5u |
| 2026-06-07 | MLB | ML | home | 5.0 | 5.00 | -143 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +3.5u |
| 2026-06-07 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | -3 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -136 | 1 | 0 | 1 | -1 | 26 | 0.00 | W | +0.7u |
| 2026-06-07 | MLB | ML | home | 4.5 | 3.00 | -165 | 2 | 2 | 4 | 2 | -12 | -1.10 | W | +1.8u |
| 2026-06-07 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 1 | 15 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | away | 2.5 | 0.25 | -107 | 1 | 0 | 1 | -2 | 12 | -0.80 | W | +0.2u |
| 2026-06-07 | MLB | TOTAL | over | 2.5 | 0.25 | -115 | 0 | 0 | 0 | -1 | -23 | 0.00 | W | +0.2u |
| 2026-06-07 | MLB | ML | home | 2.5 | 0.25 | -210 | -1 | 0 | -1 | 0 | 16 | 0.80 | L | -0.3u |
| 2026-06-07 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -0.5u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | +158 | 1 | 0 | 1 | 2 | -6 | -1.30 | L | -0.5u |
| 2026-06-07 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | W | +0.9u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -105 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-07 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | -2 | 0.00 | L | -5.0u |
| 2026-06-07 | MLB | SPREAD | away | 4.5 | 3.00 | -152 | 2 | 0 | 2 | 1 | 44 | -0.50 | W | +1.9u |
| 2026-06-07 | MLB | TOTAL | over | 5.0 | 2.25 | -114 | 1 | 1 | 2 | 1 | -11 | 0.00 | L | -2.3u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | +102 | 1 | 0 | 1 | -3 | 5 | -0.20 | W | +0.5u |
| 2026-06-07 | MLB | SPREAD | away | 4.5 | 2.25 | +164 | 1 | 1 | 2 | 1 | 14 | 29.50 | W | +3.7u |
| 2026-06-07 | MLB | ML | away | 2.5 | 0.25 | +103 | -1 | 0 | -1 | -1 | 10 | 0.20 | W | +0.3u |
| 2026-06-07 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | -1 | 0 | 1 | 29 | 0.00 | L | -3.0u |
| 2026-06-07 | MLB | ML | home | 4.0 | 1.00 | -102 | 2 | 0 | 2 | -1 | -14 | 0.50 | W | +1.0u |
| 2026-06-07 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | -1 | 11 | 0.00 | W | +4.8u |
| 2026-06-07 | MLB | ML | home | 3.0 | 0.50 | -127 | 0 | 1 | 1 | -2 | 12 | -1.90 | W | +0.4u |
| 2026-06-07 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | -2 | 0.00 | W | +0.5u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -113 | 6 | 1 | 7 | 5 | 64 | -0.50 | L | -3.0u |
| 2026-06-08 | MLB | ML | home | 4.5 | 3.00 | -129 | 3 | 0 | 3 | 1 | 34 | -0.40 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | -1 | -21 | 0.00 | L | -3.0u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -121 | 1 | 1 | 2 | -1 | -18 | -1.60 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 78 | 0.00 | P | +0.0u |
| 2026-06-08 | MLB | ML | away | 4.5 | 3.00 | -146 | 1 | 0 | 1 | -1 | -26 | -0.50 | W | +2.0u |
| 2026-06-08 | MLB | ML | home | 4.0 | 1.00 | -118 | 2 | 0 | 2 | 1 | -80 | -0.40 | L | -1.0u |
| 2026-06-08 | MLB | TOTAL | over | 4.5 | 2.50 | -116 | -2 | -2 | -4 | -2 | 16 | 0.00 | W | +2.5u |
| 2026-06-08 | MLB | ML | away | 4.5 | 1.50 | +151 | 0 | -1 | -1 | 0 | 18 | 0.00 | W | +2.3u |
| 2026-06-08 | MLB | TOTAL | under | 5.0 | 2.50 | +101 | 0 | 0 | 0 | -1 | -27 | 0.00 | W | +2.5u |
| 2026-06-08 | NBA | ML | home | 2.5 | 0.25 | -132 | 5 | 2 | 7 | 3 | 6 | -0.40 | L | -0.3u |
| 2026-06-08 | NBA | SPREAD | away | 5.0 | 5.00 | -110 | 3 | 2 | 5 | 2 | 4 | -1.30 | W | +4.3u |
| 2026-06-08 | NBA | TOTAL | under | 4.0 | 1.00 | -107 | 1 | 0 | 1 | 3 | -1 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 2.5 | 0.25 | +132 | 1 | 0 | 1 | 3 | 37 | -1.20 | L | -0.3u |
| 2026-06-09 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 2 | 0.00 | W | +4.3u |
| 2026-06-09 | MLB | ML | away | 3.0 | 0.50 | -148 | 1 | 0 | 1 | 2 | 0 | 0.00 | L | -0.5u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -116 | 0 | 0 | 0 | 3 | 28 | 0.80 | L | -1.0u |
| 2026-06-09 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -143 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-09 | MLB | SPREAD | home | 4.5 | 3.00 | -117 | 1 | 0 | 1 | 0 | 1 | 0.00 | W | +2.6u |
| 2026-06-09 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | -2 | -1 | 0.00 | W | +0.5u |
| 2026-06-09 | MLB | ML | away | 5.0 | 5.00 | -122 | 2 | 1 | 3 | 2 | 28 | 0.00 | W | +4.1u |
| 2026-06-09 | MLB | ML | away | 2.5 | 0.25 | -120 | 0 | 0 | 0 | -1 | -16 | 0.00 | L | -0.3u |
| 2026-06-09 | MLB | ML | home | 4.0 | 1.00 | -107 | 1 | 0 | 1 | -1 | 14 | -1.30 | L | -1.0u |
| 2026-06-09 | MLB | ML | home | 5.0 | 5.00 | -105 | 1 | -1 | 0 | 0 | 0 | 0.00 | W | +4.8u |
| 2026-06-09 | MLB | ML | away | 4.5 | 2.50 | +115 | 1 | 0 | 1 | -1 | -14 | -0.70 | L | -2.5u |
| 2026-06-09 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 8 | 0.00 | W | +2.7u |
| 2026-06-09 | MLB | ML | away | 3.0 | 0.50 | -116 | 1 | 0 | 1 | 2 | 31 | 0.00 | W | +0.4u |
| 2026-06-09 | MLB | ML | home | 5.0 | 2.50 | +100 | 4 | 2 | 6 | -1 | -20 | 0.00 | W | +2.5u |
| 2026-06-09 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | -1 | -16 | 0.00 | W | +4.5u |
| 2026-06-09 | MLB | ML | home | 4.0 | 1.00 | +102 | 2 | 0 | 2 | 2 | -17 | -1.20 | L | -1.0u |
| 2026-06-09 | MLB | ML | away | 4.0 | 1.00 | -119 | 1 | 0 | 1 | -1 | 26 | -0.80 | L | -1.0u |
| 2026-06-09 | NHL | SPREAD | away | 4.5 | 1.00 | +215 | 0 | 0 | 0 | 2 | 11 | 41.70 | W | +2.1u |
| 2026-06-09 | NHL | TOTAL | under | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 2 | 13 | 0.00 | L | -5.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | -4 | 0.00 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 4.5 | 3.00 | -148 | 0 | 0 | 0 | 0 | 30 | -0.50 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | +136 | 3 | 0 | 3 | 4 | 17 | -1.10 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | W | +0.9u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | -172 | 1 | 0 | 1 | 1 | 0 | -1.00 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | W | +4.5u |
| 2026-06-10 | MLB | ML | away | 3.0 | 0.50 | +136 | 0 | 0 | 0 | -2 | -4 | 0.00 | L | -0.5u |
| 2026-06-10 | MLB | TOTAL | under | 4.0 | 1.00 | -113 | 1 | 0 | 1 | 1 | 14 | 0.00 | L | -1.0u |
| 2026-06-10 | MLB | ML | home | 2.5 | 0.25 | -117 | 0 | 0 | 0 | 2 | 18 | 0.00 | W | +0.2u |
| 2026-06-10 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 0 | 0 | 0.00 | L | -5.0u |
| 2026-06-10 | MLB | ML | home | 4.0 | 1.00 | +178 | 1 | 0 | 1 | -2 | 37 | -1.40 | W | +1.7u |
| 2026-06-10 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 3 | 0 | 3 | -1 | -20 | 0.00 | W | +4.5u |
| 2026-06-10 | MLB | ML | away | 5.0 | 5.00 | -104 | 0 | 0 | 0 | 1 | 16 | -0.20 | L | -5.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | +148 | 0 | 0 | 0 | -1 | 14 | -0.80 | W | +1.5u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 31 | 0.00 | W | +2.7u |
| 2026-06-10 | MLB | ML | home | 4.5 | 2.50 | +103 | 0 | 0 | 0 | 1 | 15 | 0.00 | W | +2.6u |
| 2026-06-10 | MLB | ML | home | 4.0 | 1.00 | -127 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 27 | 0.00 | W | +3.0u |
| 2026-06-10 | MLB | ML | away | 4.0 | 1.00 | -120 | 1 | 0 | 1 | 0 | 0 | -0.40 | W | +0.8u |
| 2026-06-10 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | -1 | 0 | -1 | 1 | 16 | 0.00 | L | -3.0u |
| 2026-06-10 | MLB | ML | away | 5.0 | 5.00 | -106 | 1 | 0 | 1 | -2 | 24 | -0.70 | L | -5.0u |
| 2026-06-10 | MLB | SPREAD | home | 2.5 | 1.00 | -190 | 0 | 0 | 0 | 0 | -12 | -31.40 | L | -1.0u |
| 2026-06-10 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 4 | 1 | 5 | -1 | -2 | 0.00 | L | -5.0u |
| 2026-06-10 | NBA | ML | away | 2.5 | 0.25 | +112 | -2 | 0 | -2 | -3 | -11 | 0.20 | L | -0.3u |
| 2026-06-10 | NBA | TOTAL | under | 2.5 | 0.25 | -108 | 4 | 1 | 5 | 3 | 9 | 0.00 | W | +0.2u |
| 2026-06-11 | MLB | ML | away | 4.0 | 1.00 | +112 | 0 | 0 | 0 | 0 | 31 | 0.00 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -120 | -1 | 0 | -1 | 4 | -10 | -1.70 | P | +0.0u |
| 2026-06-11 | MLB | SPREAD | away | 4.5 | 2.50 | +140 | 1 | 0 | 1 | 2 | 0 | -1.00 | P | +0.0u |
| 2026-06-11 | MLB | ML | home | 5.0 | 5.00 | — | 1 | 0 | 1 | 1 | -2 | 0.00 | L | -5.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -167 | 1 | -1 | 0 | 0 | 33 | -0.10 | W | +0.3u |
| 2026-06-11 | MLB | TOTAL | under | 5.0 | 1.00 | -108 | 1 | 1 | 2 | 0 | -25 | 0.00 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 5.0 | 1.00 | +110 | 3 | 1 | 4 | 2 | -12 | -0.90 | L | -1.0u |
| 2026-06-11 | MLB | ML | away | 3.0 | 0.50 | -111 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-11 | MLB | ML | home | 5.0 | 5.00 | -131 | 2 | 1 | 3 | -1 | -20 | 0.00 | W | +3.8u |
| 2026-06-11 | MLB | ML | away | 4.0 | 1.00 | +100 | 1 | 0 | 1 | 1 | -40 | -0.50 | W | +1.0u |
| 2026-06-11 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | -1 | -2 | -2 | 18 | 0.00 | W | +0.2u |
| 2026-06-11 | NHL | TOTAL | under | 3.0 | 0.50 | -104 | 2 | 0 | 2 | 3 | 14 | 0.00 | P | +0.0u |
| 2026-06-12 | MLB | ML | home | 5.0 | 5.00 | -114 | 0 | 0 | 0 | -1 | -20 | 0.00 | W | +4.4u |
| 2026-06-12 | MLB | ML | home | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | -34 | 0.00 | L | -3.0u |
| 2026-06-12 | MLB | TOTAL | over | 4.0 | 1.00 | +100 | 0 | 0 | 0 | 0 | -3 | 0.00 | L | -1.0u |
| 2026-06-12 | MLB | ML | home | 3.0 | 0.50 | -210 | 2 | 0 | 2 | 1 | -14 | -0.10 | W | +0.2u |
| 2026-06-12 | MLB | ML | away | 2.5 | 0.25 | +111 | 3 | 1 | 4 | 2 | -12 | -0.70 | L | -0.3u |
| 2026-06-12 | MLB | ML | away | 4.0 | 1.00 | -114 | 2 | 0 | 2 | 1 | -12 | -1.20 | W | +0.9u |
| 2026-06-12 | MLB | ML | home | 5.0 | 2.50 | +123 | 0 | 1 | 1 | 0 | 3 | 0.00 | W | +3.1u |
| 2026-06-12 | MLB | SPREAD | away | 4.0 | 1.00 | +121 | 0 | 0 | 0 | 2 | 30 | 0.40 | L | -1.0u |
| 2026-06-12 | MLB | ML | home | 4.5 | 3.00 | -138 | 1 | 0 | 1 | -1 | 14 | -1.00 | L | -3.0u |
| 2026-06-12 | MLB | SPREAD | home | 3.0 | 0.50 | -107 | 2 | 0 | 2 | 2 | 2 | -0.40 | W | +0.4u |
| 2026-06-12 | MLB | ML | away | 2.5 | 0.25 | +118 | -1 | 0 | -1 | -2 | -24 | -0.20 | L | -0.3u |
| 2026-06-12 | MLB | ML | away | 4.0 | 1.00 | -136 | 2 | 0 | 2 | 1 | -14 | -1.30 | W | +0.7u |
| 2026-06-12 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | -1 | -1 | 0 | -4 | 0.00 | W | +2.7u |
| 2026-06-12 | MLB | ML | home | 3.0 | 0.50 | -134 | 2 | 0 | 2 | 2 | 0 | -1.10 | W | +0.4u |
| 2026-06-12 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +2.7u |
| 2026-06-12 | MLB | SPREAD | away | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 0 | 30 | -1.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | away | 5.0 | 5.00 | -128 | 3 | 0 | 3 | -1 | 28 | -0.20 | L | -5.0u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | +123 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | away | 4.5 | 3.00 | -102 | 0 | 0 | 0 | 1 | 16 | -2.00 | W | +2.9u |
| 2026-06-13 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 0 | 10 | 0.00 | W | +4.5u |
| 2026-06-13 | MLB | ML | away | 2.5 | 0.25 | -118 | 0 | 0 | 0 | -3 | 8 | -1.30 | W | +0.2u |
| 2026-06-13 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-13 | MLB | ML | away | 4.5 | 2.50 | +136 | 1 | 0 | 1 | -1 | 13 | 1.30 | L | -2.5u |
| 2026-06-13 | MLB | ML | home | 5.0 | 2.50 | +134 | 2 | 0 | 2 | -2 | -22 | 0.00 | W | +3.4u |
| 2026-06-13 | MLB | SPREAD | home | 4.0 | 1.00 | -130 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.8u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | -120 | 1 | 0 | 1 | 2 | 2 | 0.20 | W | +0.8u |
| 2026-06-13 | MLB | ML | away | 4.5 | 2.50 | +114 | 1 | 0 | 1 | 0 | 2 | 0.00 | L | -2.5u |
| 2026-06-13 | MLB | TOTAL | under | 4.0 | 1.00 | +101 | 0 | 0 | 0 | 0 | -3 | 0.00 | W | +1.0u |
| 2026-06-13 | MLB | ML | home | 4.5 | 3.00 | -157 | 0 | 0 | 0 | -2 | -14 | 0.00 | L | -3.0u |
| 2026-06-13 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 44 | 0.00 | W | +0.5u |
| 2026-06-13 | MLB | ML | home | 5.0 | 5.00 | -115 | 1 | 1 | 2 | -2 | 12 | -0.40 | W | +4.3u |
| 2026-06-13 | MLB | SPREAD | away | 4.0 | 1.00 | -106 | 0 | 0 | 0 | 1 | 16 | 0.00 | L | -1.0u |
| 2026-06-13 | MLB | ML | home | 4.0 | 1.00 | -112 | 0 | 0 | 0 | 2 | 2 | -1.30 | W | +0.8u |
| 2026-06-13 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 18 | 0.00 | L | -5.0u |
| 2026-06-13 | NBA | ML | home | 2.5 | 0.25 | -205 | 6 | 6 | 12 | 6 | -27 | 0.60 | L | -0.3u |
| 2026-06-14 | MLB | ML | away | 4.0 | 1.00 | +106 | 1 | 1 | 2 | 3 | -4 | -1.50 | L | -1.0u |
| 2026-06-14 | MLB | ML | home | 2.5 | 0.25 | -124 | 1 | 0 | 1 | 3 | 4 | -1.50 | W | +0.2u |
| 2026-06-14 | MLB | SPREAD | away | 5.0 | 5.00 | -180 | 1 | 0 | 1 | 0 | -7 | 0.00 | L | -5.0u |
| 2026-06-14 | MLB | ML | home | 5.0 | 5.00 | -192 | 1 | 0 | 1 | 1 | 3 | 0.00 | L | -5.0u |
| 2026-06-14 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | ML | away | 4.5 | 2.50 | +106 | 0 | 0 | 0 | 1 | 16 | 0.00 | L | -2.5u |
| 2026-06-14 | MLB | SPREAD | away | 4.5 | 3.00 | -116 | 2 | 0 | 2 | 2 | -1 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | SPREAD | away | 4.0 | 1.00 | -158 | 1 | -1 | 0 | 1 | 44 | 0.10 | W | +0.6u |
| 2026-06-14 | MLB | ML | away | 4.0 | 1.00 | -125 | 2 | 1 | 3 | 3 | 5 | -1.20 | W | +0.8u |
| 2026-06-14 | MLB | ML | away | 4.5 | 3.00 | -101 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -3.0u |
| 2026-06-14 | MLB | ML | away | 2.5 | 0.25 | -115 | 2 | 0 | 2 | 2 | 0 | 0.00 | W | +0.2u |
| 2026-06-14 | NHL | ML | away | 2.5 | 0.25 | -115 | -1 | 1 | 0 | 1 | -5 | -0.20 | W | +0.2u |
| 2026-06-14 | NHL | TOTAL | under | 5.0 | 5.00 | -110 | -1 | 0 | -1 | 1 | 5 | 0.00 | W | +4.4u |
| 2026-06-15 | MLB | ML | home | 4.0 | 1.00 | -204 | 1 | 0 | 1 | 0 | 0 | -0.60 | W | +0.0u |
| 2026-06-15 | MLB | SPREAD | away | 4.5 | 3.00 | -114 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.9u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | SPREAD | home | 4.0 | 1.00 | +153 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-15 | MLB | TOTAL | over | 4.5 | 2.50 | -110 | 0 | 0 | 0 | 0 | -3 | 0.00 | W | +0.0u |
| 2026-06-15 | MLB | ML | away | 3.0 | 0.50 | +115 | 2 | 0 | 2 | 2 | 24 | -0.80 | L | -0.5u |
| 2026-06-15 | MLB | ML | away | 3.0 | 0.50 | +160 | 2 | 0 | 2 | 0 | 43 | -0.70 | L | -0.5u |
| 2026-06-15 | MLB | SPREAD | away | 2.5 | 0.25 | -120 | 0 | 0 | 0 | -1 | 5 | 0.00 | L | -0.3u |
| 2026-06-15 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 1 | 41 | 0.00 | L | -3.0u |
| 2026-06-15 | MLB | ML | home | 2.5 | 0.25 | -157 | 1 | 0 | 1 | 2 | -17 | -0.20 | L | -0.3u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | ML | home | 3.0 | 0.50 | -132 | 3 | 1 | 4 | 3 | 4 | -0.70 | W | +2.2u |
| 2026-06-15 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-15 | MLB | ML | home | 3.0 | 0.50 | -154 | 1 | 0 | 1 | 3 | -27 | 0.50 | W | +0.0u |
| 2026-06-15 | MLB | SPREAD | away | 5.0 | 5.00 | -160 | 1 | 0 | 1 | 1 | 15 | -1.30 | L | -5.0u |
| 2026-06-15 | MLB | ML | home | 2.5 | 0.25 | -161 | -1 | 1 | 0 | -3 | -9 | -1.00 | W | +0.0u |
| 2026-06-15 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | -5 | 0.00 | L | -1.0u |
| 2026-06-15 | SOC | ML | home | 2.5 | 0.25 | -105 | 3 | 3 | 6 | 1 | -6 | -1.10 | L | -0.3u |
| 2026-06-16 | MLB | ML | home | 4.0 | 1.00 | -145 | 1 | 0 | 1 | -1 | -15 | -1.00 | W | +0.0u |
| 2026-06-16 | MLB | SPREAD | away | 4.5 | 1.00 | -162 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | TOTAL | under | 5.0 | 5.00 | -101 | 1 | 0 | 1 | 1 | 7 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -194 | 1 | 0 | 1 | -1 | 23 | 0.40 | L | -3.0u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 31 | 0.00 | L | -3.0u |
| 2026-06-16 | MLB | SPREAD | home | 4.0 | 1.00 | +156 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -163 | 5 | 3 | 8 | 3 | 29 | -1.00 | W | +2.4u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | -1 | 0 | -1 | -2 | -34 | 0.00 | L | -3.0u |
| 2026-06-16 | MLB | ML | home | 4.5 | 3.00 | -135 | 3 | 2 | 5 | 0 | -12 | -2.10 | W | +4.5u |
| 2026-06-16 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 10 | 0.00 | W | +0.0u |
| 2026-06-16 | MLB | ML | away | 2.5 | 0.25 | -106 | 1 | 0 | 1 | 1 | 15 | -0.20 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -174 | 2 | 1 | 3 | 2 | 27 | -1.40 | W | +2.3u |
| 2026-06-16 | MLB | ML | away | 4.0 | 1.00 | -116 | 0 | 0 | 0 | -1 | 8 | -0.80 | L | -1.0u |
| 2026-06-16 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 2 | 0 | 2 | 3 | 38 | 0.00 | L | -5.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -138 | 0 | 0 | 0 | -1 | -20 | 0.70 | L | -0.5u |
| 2026-06-16 | MLB | ML | away | 3.0 | 0.50 | -102 | 1 | 0 | 1 | 0 | 0 | -1.00 | L | -0.5u |
| 2026-06-16 | MLB | SPREAD | away | 4.0 | 1.00 | -160 | 0 | 0 | 0 | 2 | 29 | 30.10 | W | +0.0u |
| 2026-06-16 | MLB | ML | home | 3.0 | 0.50 | -161 | 1 | 1 | 2 | 0 | -25 | -0.40 | L | -0.5u |
| 2026-06-16 | MLB | ML | away | 5.0 | 2.50 | +120 | -1 | -1 | -2 | -1 | 19 | -1.80 | L | -2.5u |
| 2026-06-16 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 2 | -3 | 0.00 | L | -1.0u |
| 2026-06-16 | MLB | ML | away | 2.5 | 0.25 | -112 | 1 | 0 | 1 | 2 | 2 | -0.90 | W | +0.0u |
| 2026-06-16 | MLB | SPREAD | away | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-16 | SOC | ML | home | 4.0 | 1.00 | +1375 | 1 | 0 | 1 | -2 | -34 | 0.00 | L | -1.0u |
| 2026-06-17 | MLB | ML | away | 2.5 | 0.25 | +126 | -2 | 0 | -2 | -2 | -34 | -0.40 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-17 | MLB | ML | away | 4.5 | 2.50 | +112 | -1 | -1 | -2 | -2 | 5 | -1.20 | L | -2.5u |
| 2026-06-17 | MLB | ML | home | 5.0 | 5.00 | -173 | 1 | 0 | 1 | 0 | -24 | 0.00 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-17 | MLB | ML | away | 5.0 | 2.50 | +100 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.5u |
| 2026-06-17 | MLB | ML | home | 4.5 | 2.50 | +115 | 1 | 0 | 1 | 0 | 1 | 0.00 | L | -2.5u |
| 2026-06-17 | MLB | SPREAD | home | 4.5 | 3.00 | -141 | 0 | 0 | 0 | 1 | 16 | 0.00 | L | -3.0u |
| 2026-06-17 | MLB | SPREAD | away | 5.0 | 5.00 | -181 | 0 | 0 | 0 | 1 | 15 | -0.80 | W | +0.0u |
| 2026-06-17 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 2 | 10 | 0.00 | L | -5.0u |
| 2026-06-17 | MLB | ML | home | 2.5 | 0.25 | -157 | 0 | 0 | 0 | 1 | 16 | -1.10 | W | +0.0u |
| 2026-06-17 | MLB | SPREAD | home | 2.5 | 0.25 | +125 | -1 | 0 | -1 | 0 | 16 | -0.60 | L | -0.3u |
| 2026-06-17 | MLB | ML | home | 5.0 | 5.00 | -123 | 1 | 0 | 1 | 0 | 12 | 0.00 | L | -5.0u |
| 2026-06-17 | MLB | SPREAD | home | 4.0 | 1.00 | +161 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-17 | SOC | ML | away | 5.0 | 1.00 | +1028 | 1 | 0 | 1 | -5 | -50 | 0.00 | L | -1.0u |
| 2026-06-17 | SOC | ML | home | 4.0 | 1.00 | -140 | 0 | 0 | 0 | 0 | 5 | -0.30 | W | +0.0u |
| 2026-06-17 | SOC | ML | home | 4.0 | 1.00 | +142 | 1 | 0 | 1 | 2 | -10 | 0.00 | W | +0.0u |
| 2026-06-18 | MLB | ML | home | 4.0 | 1.00 | -138 | 1 | 0 | 1 | 1 | 2 | 0.00 | W | +0.0u |
| 2026-06-18 | MLB | ML | home | 4.5 | 3.00 | -141 | 1 | 1 | 2 | 0 | 12 | -1.30 | L | -3.0u |
| 2026-06-18 | MLB | ML | home | 4.5 | 3.00 | -151 | 3 | 0 | 3 | 3 | 35 | -1.50 | W | +0.0u |
| 2026-06-18 | MLB | ML | away | 4.5 | 2.50 | +108 | 3 | 1 | 4 | 5 | 20 | -1.20 | W | +2.6u |
| 2026-06-18 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 31 | 0.00 | W | +2.7u |
| 2026-06-18 | MLB | SPREAD | away | 4.5 | 3.00 | -199 | 1 | 0 | 1 | 2 | 1 | 0.00 | L | -3.0u |
| 2026-06-18 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 3 | 6 | 0.00 | W | +2.8u |
| 2026-06-18 | SOC | ML | home | 5.0 | 2.50 | +113 | 2 | 0 | 2 | 4 | 4 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | ML | home | 4.5 | 3.00 | -205 | 1 | 0 | 1 | 2 | 22 | 0.10 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 4.5 | 3.00 | -114 | 0 | 0 | 0 | 2 | 30 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 5.0 | 5.00 | -194 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 3.0 | 0.50 | -117 | 0 | 0 | 0 | 0 | -3 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | ML | away | 4.5 | 1.00 | +239 | 1 | 0 | 1 | 0 | -24 | 0.00 | L | -1.0u |
| 2026-06-19 | MLB | SPREAD | home | 4.5 | 3.00 | -111 | 1 | 1 | 2 | 0 | -3 | 0.00 | W | +3.1u |
| 2026-06-19 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 1 | 6 | 0.00 | L | -3.0u |
| 2026-06-19 | MLB | ML | away | 4.0 | 1.00 | +107 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -1.0u |
| 2026-06-19 | MLB | SPREAD | away | 4.0 | 1.00 | -115 | 2 | 0 | 2 | 3 | 50 | 0.00 | W | +2.5u |
| 2026-06-19 | MLB | ML | away | 4.5 | 2.50 | +141 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -2.5u |
| 2026-06-19 | MLB | ML | home | 2.5 | 0.25 | +158 | -1 | -1 | -2 | 0 | -1 | -1.10 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 4.5 | 2.50 | -101 | 0 | -1 | -1 | -1 | 15 | -0.70 | L | -2.5u |
| 2026-06-19 | MLB | ML | home | 4.5 | 3.00 | -163 | -1 | -1 | -2 | -2 | 18 | -0.40 | W | +2.4u |
| 2026-06-19 | MLB | SPREAD | home | 4.5 | 2.50 | +130 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -5.0u |
| 2026-06-19 | MLB | ML | home | 3.0 | 0.50 | -152 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | home | 2.5 | 0.25 | +147 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.3u |
| 2026-06-19 | MLB | ML | home | 5.0 | 1.00 | -109 | 1 | 0 | 1 | 1 | -9 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | SPREAD | away | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-19 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 2 | 31 | 0.00 | L | -3.0u |
| 2026-06-19 | MLB | SPREAD | home | 2.5 | 0.25 | +170 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.3u |
| 2026-06-19 | SOC | ML | away | 3.0 | 0.50 | +2500 | 0 | 0 | 0 | -4 | -29 | 0.00 | L | -0.5u |
| 2026-06-19 | SOC | ML | home | 4.5 | 2.50 | +108 | 1 | 0 | 1 | 5 | 35 | -2.40 | L | -2.5u |
| 2026-06-20 | MLB | SPREAD | away | 5.0 | 5.00 | -194 | 0 | 0 | 0 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | ML | home | 4.5 | 3.00 | -200 | -2 | 0 | -2 | -2 | -8 | -1.30 | L | -3.0u |
| 2026-06-20 | MLB | SPREAD | home | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -0.5u |
| 2026-06-20 | MLB | ML | away | 4.5 | 2.50 | +123 | 2 | 0 | 2 | 2 | -7 | -3.20 | L | -2.5u |
| 2026-06-20 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | 1 | 0 | 0 | 1 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 2 | -1 | 0.00 | W | +1.8u |
| 2026-06-20 | MLB | ML | away | 3.0 | 0.50 | +116 | 0 | 0 | 0 | -1 | -3 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | -1 | 0 | -1 | -2 | -34 | 0.00 | L | -1.0u |
| 2026-06-20 | MLB | ML | home | 4.0 | 1.00 | -190 | 2 | 1 | 3 | 0 | -7 | -1.70 | W | +2.0u |
| 2026-06-20 | MLB | ML | home | 5.0 | 5.00 | -137 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.2u |
| 2026-06-20 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-20 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 15 | 0.00 | L | -0.5u |
| 2026-06-20 | SOC | ML | away | 2.5 | 0.25 | +474 | -3 | 0 | -3 | -20 | -70 | 0.00 | L | -0.3u |
| 2026-06-20 | SOC | ML | away | 2.5 | 0.25 | +2200 | 0 | 0 | 0 | -1 | -15 | -0.20 | L | -0.3u |
| 2026-06-21 | MLB | ML | home | 4.0 | 1.00 | -226 | 1 | 0 | 1 | 0 | 16 | 0.30 | L | -1.0u |
| 2026-06-21 | MLB | SPREAD | away | 5.0 | 5.00 | -190 | 0 | 0 | 0 | 1 | 15 | -0.50 | L | -5.0u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 2.50 | +100 | 1 | 1 | 2 | 0 | 23 | 0.00 | W | +2.5u |
| 2026-06-21 | MLB | ML | home | 4.0 | 1.00 | -104 | -1 | 0 | -1 | 0 | -29 | -0.50 | L | -1.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-21 | MLB | ML | away | 5.0 | 2.50 | +113 | 0 | 0 | 0 | 1 | -2 | 0.00 | L | -2.5u |
| 2026-06-21 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | 5 | 0.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 1 | 16 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-21 | MLB | ML | away | 2.5 | 0.25 | +110 | 0 | 0 | 0 | -1 | -15 | -1.00 | W | +0.0u |
| 2026-06-21 | MLB | SPREAD | home | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 1 | 15 | -1.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | ML | home | 4.5 | 3.00 | -178 | 3 | 0 | 3 | 3 | 79 | -1.30 | W | +1.6u |
| 2026-06-21 | MLB | ML | home | 3.0 | 0.50 | +130 | 0 | 0 | 0 | -1 | -20 | -0.80 | L | -0.5u |
| 2026-06-21 | MLB | ML | home | 3.0 | 0.50 | +123 | 1 | 0 | 1 | 0 | 0 | -0.20 | W | +0.0u |
| 2026-06-21 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | -1 | -20 | 0.00 | L | -3.0u |
| 2026-06-21 | MLB | SPREAD | away | 5.0 | 2.50 | +130 | 0 | 0 | 0 | 1 | 15 | -1.30 | W | +0.0u |
| 2026-06-21 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 2 | 0 | 2 | 2 | 38 | 0.00 | L | -0.3u |
| 2026-06-21 | MLB | TOTAL | under | 4.5 | 1.00 | -114 | 1 | 1 | 2 | 1 | -26 | 0.00 | W | +0.0u |
| 2026-06-21 | SOC | ML | away | 4.5 | 1.00 | +725 | 2 | 0 | 2 | -5 | -70 | 0.00 | L | -1.0u |
| 2026-06-21 | SOC | ML | home | 4.0 | 1.00 | +650 | 2 | 0 | 2 | 1 | -1 | -0.20 | L | -1.0u |
| 2026-06-21 | SOC | ML | draw | 3.0 | 0.50 | +950 | 0 | 0 | 0 | -9 | -48 | 0.00 | L | -0.5u |
| 2026-06-22 | MLB | ML | home | 4.5 | 3.00 | -138 | 0 | 0 | 0 | 0 | -4 | 0.30 | W | +0.0u |
| 2026-06-22 | MLB | SPREAD | away | 5.0 | 5.00 | -168 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 1.00 | +105 | 1 | 0 | 1 | 1 | 22 | 0.00 | L | -1.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | -3 | 0.00 | L | -3.0u |
| 2026-06-22 | MLB | SPREAD | away | 5.0 | 2.50 | +118 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 21 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.7u |
| 2026-06-22 | MLB | ML | home | 5.0 | 5.00 | -124 | 1 | 0 | 1 | 1 | 13 | -1.20 | W | +2.3u |
| 2026-06-22 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 3 | 0 | 3 | 3 | 34 | 0.00 | W | +2.7u |
| 2026-06-22 | MLB | ML | home | 3.0 | 0.50 | -180 | 1 | 0 | 1 | 0 | 0 | -1.30 | L | -0.5u |
| 2026-06-22 | MLB | ML | home | 5.0 | 2.50 | +133 | 0 | 0 | 0 | 0 | -22 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | ML | home | 5.0 | 2.50 | +137 | 0 | 0 | 0 | 0 | -22 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | SPREAD | home | 4.5 | 1.00 | -109 | 0 | 0 | 0 | -1 | 7 | 0.00 | W | +0.0u |
| 2026-06-22 | MLB | SPREAD | away | 4.5 | 2.50 | +138 | 2 | 0 | 2 | 1 | 45 | 0.00 | L | -2.5u |
| 2026-06-22 | MLB | TOTAL | under | 4.0 | 1.00 | -104 | 2 | 1 | 3 | 2 | 24 | 0.00 | W | +3.9u |
| 2026-06-22 | MLB | ML | away | 5.0 | 5.00 | — | 1 | 0 | 1 | 1 | 25 | 0.00 | L | -5.0u |
| 2026-06-22 | SOC | ML | draw | 4.5 | 1.00 | +350 | -1 | 0 | -1 | -16 | -66 | -0.70 | L | -1.0u |
| 2026-06-22 | SOC | ML | home | 2.5 | 0.25 | -950 | 1 | 0 | 1 | 8 | 61 | 0.00 | W | +0.0u |
| 2026-06-22 | SOC | ML | home | 4.5 | 2.50 | +139 | 1 | 0 | 1 | 9 | 58 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | home | 3.0 | 0.50 | -109 | 0 | 0 | 0 | -1 | -14 | -1.80 | L | -0.5u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 5.00 | -168 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | -2 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -108 | 2 | 0 | 2 | 3 | 9 | -1.40 | L | -3.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -133 | 1 | 0 | 1 | 3 | 22 | -1.40 | L | -3.0u |
| 2026-06-23 | MLB | SPREAD | away | 3.0 | 0.50 | +110 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -0.5u |
| 2026-06-23 | MLB | ML | away | 3.0 | 0.50 | -162 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | SPREAD | home | 4.0 | 1.00 | -107 | 0 | 0 | 0 | 0 | -30 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 5.00 | -114 | 0 | 0 | 0 | -1 | -48 | 0.00 | L | -5.0u |
| 2026-06-23 | MLB | ML | home | 2.5 | 0.25 | -125 | 1 | 0 | 1 | 0 | -25 | -1.90 | L | -0.3u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 1.00 | -102 | 1 | 2 | 3 | 1 | 18 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | ML | away | 4.5 | 3.00 | -172 | 1 | 0 | 1 | 1 | -14 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 5.0 | 1.00 | -109 | 2 | 0 | 2 | 1 | -2 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 2.50 | +132 | 1 | 0 | 1 | 1 | -14 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -1.0u |
| 2026-06-23 | MLB | ML | home | 5.0 | 2.50 | +104 | 1 | 0 | 1 | 1 | -9 | 0.00 | L | -2.5u |
| 2026-06-23 | MLB | SPREAD | away | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 1 | 15 | 0.00 | L | -5.0u |
| 2026-06-23 | MLB | ML | away | 4.0 | 1.00 | +117 | 1 | 0 | 1 | 1 | 20 | -0.20 | L | -1.0u |
| 2026-06-23 | MLB | SPREAD | away | 2.5 | 0.25 | +106 | 1 | 0 | 1 | 0 | 41 | -1.50 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | -1 | -22 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | ML | home | 4.5 | 1.00 | -153 | 2 | 0 | 2 | 2 | 16 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | SPREAD | home | 3.0 | 0.50 | +139 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-23 | MLB | TOTAL | under | 4.5 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-23 | SOC | ML | home | 2.5 | 0.25 | -450 | 1 | 0 | 1 | 0 | 0 | 0.60 | L | -0.3u |
| 2026-06-23 | SOC | ML | away | 4.5 | 1.00 | +1800 | 1 | 0 | 1 | -4 | -22 | 0.00 | L | -1.0u |
| 2026-06-24 | MLB | SPREAD | away | 5.0 | 5.00 | -214 | 0 | 0 | 0 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 4.5 | 3.00 | -132 | 1 | 0 | 1 | 0 | 13 | -1.10 | L | -3.0u |
| 2026-06-24 | MLB | SPREAD | away | 4.0 | 1.00 | +155 | 1 | 0 | 1 | 1 | 16 | -0.30 | L | -1.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 3.0 | 0.50 | +110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-24 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -25 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 2.50 | +152 | 2 | 0 | 2 | 1 | 7 | -1.10 | W | +5.8u |
| 2026-06-24 | MLB | SPREAD | away | 5.0 | 5.00 | -105 | 0 | 0 | 0 | 1 | 15 | 0.00 | L | -5.0u |
| 2026-06-24 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | -1 | 0 | 3 | 9 | 0.00 | W | +3.6u |
| 2026-06-24 | MLB | ML | away | 4.5 | 2.50 | -134 | 1 | 0 | 1 | 2 | 6 | -0.20 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | -1 | -36 | 0.00 | L | -5.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 3.00 | -134 | 1 | 0 | 1 | 1 | -14 | -1.90 | L | -3.0u |
| 2026-06-24 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -5 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | away | 3.0 | 0.50 | +132 | 0 | 0 | 0 | -1 | -20 | -2.20 | L | -0.5u |
| 2026-06-24 | MLB | SPREAD | home | 4.0 | 1.00 | -115 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -3.0u |
| 2026-06-24 | MLB | ML | away | 4.5 | 2.50 | +117 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 0 | 8 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 2.5 | 0.25 | -102 | -1 | 0 | -1 | -1 | 9 | -0.70 | W | +0.0u |
| 2026-06-24 | MLB | SPREAD | away | 4.0 | 1.00 | +136 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -1.0u |
| 2026-06-24 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | W | +0.0u |
| 2026-06-24 | MLB | ML | home | 4.5 | 2.50 | +108 | 0 | 0 | 0 | 0 | -34 | 0.00 | L | -2.5u |
| 2026-06-24 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -3.0u |
| 2026-06-24 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -0.5u |
| 2026-06-24 | MLB | TOTAL | under | 5.0 | 1.00 | -115 | 2 | 0 | 2 | 2 | 34 | 0.00 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 4.0 | 1.00 | +153 | 3 | 0 | 3 | 3 | 32 | -1.10 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 4.5 | 3.00 | -525 | 4 | 1 | 5 | 3 | 65 | 0.50 | W | +1.1u |
| 2026-06-24 | SOC | ML | away | 4.5 | 3.00 | -104 | -1 | 0 | -1 | 2 | 36 | -1.00 | W | +0.0u |
| 2026-06-24 | SOC | ML | home | 2.5 | 0.25 | -257 | 2 | 0 | 2 | 2 | 28 | -1.10 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | W | +0.0u |
| 2026-06-25 | MLB | SPREAD | away | 4.5 | 1.00 | +164 | 1 | 1 | 2 | 1 | 14 | 27.50 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 2 | 6 | 0.00 | W | +3.6u |
| 2026-06-25 | MLB | ML | away | 2.5 | 0.25 | -136 | 3 | 0 | 3 | 1 | -4 | -2.40 | L | -0.3u |
| 2026-06-25 | MLB | SPREAD | away | 5.0 | 2.50 | +114 | 2 | 0 | 2 | 1 | 3 | -1.90 | L | -2.5u |
| 2026-06-25 | MLB | TOTAL | under | 4.5 | 3.00 | -116 | 0 | 0 | 0 | 0 | -8 | 0.00 | L | -3.0u |
| 2026-06-25 | MLB | ML | home | 4.5 | 1.00 | +443 | 1 | 0 | 1 | 1 | -17 | 0.00 | L | -1.0u |
| 2026-06-25 | MLB | SPREAD | away | 4.5 | 3.00 | -105 | 1 | 0 | 1 | 2 | 6 | 0.00 | W | +0.0u |
| 2026-06-25 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 1 | 1 | -1 | -11 | 0.00 | L | -0.3u |
| 2026-06-25 | SOC | ML | home | 4.5 | 1.50 | +163 | -1 | 0 | -1 | -1 | 6 | 0.00 | L | -1.5u |
| 2026-06-25 | SOC | ML | away | 2.5 | 0.25 | -600 | 4 | 1 | 5 | 4 | 44 | -0.70 | W | +0.0u |
| 2026-06-25 | SOC | ML | away | 4.0 | 1.00 | -110 | 12 | 7 | 19 | 12 | 70 | -0.90 | L | -1.0u |
| 2026-06-25 | SOC | ML | away | 5.0 | 5.00 | -700 | 5 | 1 | 6 | 5 | 40 | 1.80 | W | +0.5u |
| 2026-06-25 | SOC | ML | away | 2.5 | 0.25 | -105 | 4 | 4 | 8 | 5 | 4 | -0.20 | L | -0.3u |
| 2026-06-26 | MLB | ML | away | 4.5 | 3.00 | -120 | 2 | 0 | 2 | 1 | -14 | -0.80 | W | +3.3u |
| 2026-06-26 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-06-26 | MLB | SPREAD | home | 2.5 | 0.25 | -117 | 0 | 1 | 1 | 0 | 13 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | 1 | 13 | 0.00 | L | -5.0u |
| 2026-06-26 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 5.0 | 2.50 | +100 | 0 | 0 | 0 | 0 | -13 | 0.00 | L | -2.5u |
| 2026-06-26 | MLB | SPREAD | home | 2.5 | 0.25 | -135 | 1 | 0 | 1 | 1 | 3 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | SPREAD | away | 4.5 | 3.00 | -204 | 1 | 0 | 1 | 1 | 15 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | home | 4.0 | 1.00 | -2261 | 0 | 0 | 0 | 0 | -22 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 2.5 | 0.25 | -154 | 0 | 0 | 0 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | SPREAD | away | 4.5 | 2.50 | +110 | 1 | 1 | 2 | 1 | 15 | 0.00 | L | -2.5u |
| 2026-06-26 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -14 | 0.00 | W | +0.0u |
| 2026-06-26 | MLB | ML | away | 4.0 | 1.00 | -106 | 1 | 0 | 1 | 1 | 11 | -1.00 | W | +0.0u |
| 2026-06-26 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -3.0u |
| 2026-06-26 | MLB | ML | away | 3.0 | 0.50 | +121 | 1 | 0 | 1 | 0 | 0 | -0.80 | L | -0.5u |
| 2026-06-26 | SOC | ML | away | 5.0 | 5.00 | -600 | 1 | 0 | 1 | 2 | 12 | -0.30 | W | +0.8u |
| 2026-06-26 | SOC | ML | away | 3.0 | 0.50 | -200 | 7 | 2 | 9 | 7 | 87 | -0.20 | W | +4.1u |
| 2026-06-26 | SOC | ML | away | 2.5 | 0.25 | -155 | 5 | 2 | 7 | 7 | 63 | 1.20 | W | +1.6u |
| 2026-06-26 | SOC | ML | home | 3.0 | 0.50 | +150 | 0 | 2 | 2 | -2 | 8 | -0.30 | L | -0.5u |
| 2026-06-26 | SOC | ML | home | 2.5 | 0.25 | -380 | -1 | 1 | 0 | 0 | 14 | 0.00 | W | +0.0u |
| 2026-06-26 | SOC | ML | home | 2.5 | 0.25 | +135 | -2 | 2 | 0 | -7 | -3 | -0.30 | L | -0.3u |
| 2026-06-27 | MLB | ML | away | 5.0 | 2.50 | +121 | 0 | 0 | 0 | 0 | -13 | 0.00 | L | -2.5u |
| 2026-06-27 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 11 | 0.00 | L | -1.0u |
| 2026-06-27 | MLB | ML | away | 4.0 | 1.00 | +116 | 0 | 0 | 0 | 1 | -54 | -0.70 | L | -1.0u |
| 2026-06-27 | MLB | ML | home | 2.5 | 0.25 | -155 | 0 | 2 | 2 | 0 | 21 | -0.80 | L | -0.3u |
| 2026-06-27 | MLB | ML | away | 2.5 | 0.25 | -112 | 3 | 1 | 4 | 4 | 45 | -0.90 | W | +3.6u |
| 2026-06-27 | MLB | ML | home | 4.5 | 3.00 | -134 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-06-27 | MLB | TOTAL | under | 2.5 | 0.25 | -104 | 4 | 1 | 5 | 4 | 11 | 0.00 | L | -0.3u |
| 2026-06-27 | MLB | ML | away | 5.0 | 2.50 | +114 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -2.5u |
| 2026-06-27 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -14 | 0.00 | W | +0.0u |
| 2026-06-27 | MLB | ML | home | 4.5 | 3.00 | -130 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-06-27 | MLB | SPREAD | away | 4.5 | 3.00 | -204 | 2 | 0 | 2 | 2 | 29 | -1.70 | W | +2.3u |
| 2026-06-27 | MLB | ML | away | 4.0 | 1.00 | -104 | 0 | 0 | 0 | 0 | 0 | -1.20 | L | -1.0u |
| 2026-06-27 | MLB | ML | home | 4.0 | 1.00 | -123 | 0 | 0 | 0 | -1 | -20 | 0.00 | W | +3.3u |
| 2026-06-27 | MLB | SPREAD | home | 4.5 | 1.50 | +154 | 1 | 0 | 1 | 1 | 13 | 0.00 | W | +0.0u |
| 2026-06-27 | MLB | TOTAL | over | 2.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 3 | 0.00 | L | -1.0u |
| 2026-06-27 | MLB | ML | away | 4.5 | 3.00 | -142 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-06-27 | MLB | ML | home | 4.5 | 3.00 | -178 | 3 | 0 | 3 | 2 | 27 | -0.10 | L | -3.0u |
| 2026-06-27 | MLB | SPREAD | home | 4.5 | 2.50 | +113 | 1 | 0 | 1 | 1 | -14 | 0.00 | L | -2.5u |
| 2026-06-27 | SOC | ML | away | 5.0 | 5.00 | -500 | 2 | 1 | 3 | 3 | 7 | 1.30 | W | +0.8u |
| 2026-06-27 | SOC | ML | draw | 2.5 | 0.25 | +109 | -1 | 0 | -1 | 0 | 21 | 1.40 | W | +0.0u |
| 2026-06-27 | SOC | ML | away | 5.0 | 5.00 | -575 | 4 | 1 | 5 | 5 | 40 | -0.10 | W | +0.8u |
| 2026-06-27 | SOC | ML | home | 2.5 | 0.25 | -122 | 1 | 3 | 4 | 3 | 17 | 1.00 | W | +2.5u |
| 2026-06-27 | SOC | ML | home | 3.0 | 0.50 | -125 | 2 | 1 | 3 | 2 | 21 | -1.00 | W | +3.3u |
| 2026-06-28 | MLB | ML | away | 4.5 | 1.00 | +337 | 0 | 0 | 0 | 0 | -7 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | SPREAD | home | 3.0 | 0.50 | -131 | 1 | 0 | 1 | 1 | 16 | -0.50 | W | +0.0u |
| 2026-06-28 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 2 | 0 | 2 | 2 | 24 | 0.00 | W | +1.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 2 | 1 | 3 | 2 | 6 | 0.00 | W | +3.6u |
| 2026-06-28 | MLB | SPREAD | away | 4.5 | 3.00 | -180 | 1 | 0 | 1 | 1 | 13 | -0.30 | L | -3.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 2.50 | -110 | 2 | 0 | 2 | 3 | 5 | 0.00 | L | -2.5u |
| 2026-06-28 | MLB | ML | home | 2.5 | 0.25 | -103 | 1 | 0 | 1 | 1 | 21 | 0.20 | L | -0.3u |
| 2026-06-28 | MLB | SPREAD | home | 4.5 | 1.00 | -155 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 1.00 | -110 | 1 | 0 | 1 | 2 | -15 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | ML | home | 4.5 | 2.50 | +122 | 0 | 0 | 0 | 0 | -7 | 0.00 | L | -2.5u |
| 2026-06-28 | MLB | SPREAD | home | 3.0 | 0.50 | -149 | 1 | 0 | 1 | 1 | 16 | -0.20 | L | -0.5u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 0 | 0 | 0 | 0 | -9 | 0.00 | W | +0.0u |
| 2026-06-28 | MLB | ML | away | 3.0 | 0.50 | +108 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -0.5u |
| 2026-06-28 | MLB | SPREAD | away | 4.0 | 1.00 | -168 | 0 | 0 | 0 | 2 | 29 | 0.00 | W | +2.1u |
| 2026-06-28 | MLB | ML | away | 4.5 | 1.00 | -101 | 4 | 0 | 4 | 4 | 28 | -0.70 | L | -1.0u |
| 2026-06-28 | MLB | TOTAL | under | 4.5 | 3.00 | -104 | 1 | 0 | 1 | 1 | 7 | 0.00 | L | -3.0u |
| 2026-06-28 | MLB | ML | away | 4.5 | 3.00 | +1210 | 3 | 1 | 4 | 3 | 13 | -1.20 | L | -3.0u |
| 2026-06-28 | MLB | ML | away | 4.5 | 3.00 | -158 | 0 | 0 | 0 | 0 | -7 | 0.00 | W | +0.0u |
| 2026-06-28 | MLB | SPREAD | away | 4.5 | 1.00 | +119 | 1 | 0 | 1 | 1 | 13 | 0.00 | L | -1.0u |
| 2026-06-28 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-28 | MLB | ML | away | 3.0 | 0.50 | -103 | 1 | 0 | 1 | 1 | 16 | -1.20 | L | -0.5u |
| 2026-06-28 | MLB | ML | away | 4.0 | 1.00 | +115 | 1 | 0 | 1 | 1 | 19 | -1.10 | W | +4.4u |
| 2026-06-28 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | -1 | -1 | -1 | -7 | 0.00 | L | -0.5u |
| 2026-06-28 | MLB | SPREAD | away | 3.0 | 0.50 | -124 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-28 | SOC | ML | away | 5.0 | 5.00 | -142 | 12 | 3 | 15 | 16 | 92 | -0.50 | W | +0.7u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | -128 | 0 | 1 | 1 | 1 | -9 | -1.50 | W | +0.0u |
| 2026-06-29 | MLB | SPREAD | home | 2.5 | 0.25 | +139 | 0 | 0 | 0 | 1 | 20 | 0.00 | W | +0.0u |
| 2026-06-29 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 0 | -9 | 0.00 | L | -0.5u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | 7 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | SPREAD | away | 2.5 | 0.25 | -176 | 1 | 0 | 1 | 1 | 20 | 0.00 | W | +0.0u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -105 | 1 | 0 | 1 | 0 | 5 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | ML | away | 3.0 | 0.50 | +193 | 1 | 0 | 1 | 0 | 0 | 0.00 | L | -0.5u |
| 2026-06-29 | MLB | SPREAD | away | 3.0 | 0.50 | -119 | 1 | 0 | 1 | -1 | -15 | 0.00 | L | -0.5u |
| 2026-06-29 | MLB | ML | away | 2.5 | 0.25 | -112 | 0 | 0 | 0 | 0 | -21 | -0.60 | W | +0.0u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | +129 | 1 | 0 | 1 | 1 | -19 | -0.50 | L | -0.3u |
| 2026-06-29 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +2.6u |
| 2026-06-29 | MLB | SPREAD | home | 2.5 | 0.25 | +171 | 1 | 0 | 1 | 1 | 20 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | ML | away | 4.0 | 1.00 | +100 | 2 | 0 | 2 | 4 | 7 | 0.00 | W | +0.0u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | -158 | 2 | 1 | 3 | 2 | 34 | -0.60 | W | +0.0u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 1 | 0 | 1 | 1 | -1 | 0.00 | W | +3.6u |
| 2026-06-29 | MLB | ML | home | 2.5 | 0.25 | -131 | 1 | 0 | 1 | 1 | 20 | 0.00 | W | +3.0u |
| 2026-06-29 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | -1 | 0 | -1 | -1 | -2 | 0.00 | P | +0.0u |
| 2026-06-29 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | -1 | 0 | -1 | -1 | -45 | 0.00 | L | -0.3u |
| 2026-06-29 | MLB | ML | away | 4.5 | 2.50 | +150 | 1 | 0 | 1 | 1 | -14 | -0.60 | L | -2.5u |
| 2026-06-29 | SOC | ML | home | 2.5 | 0.25 | -145 | 10 | 2 | 12 | 13 | 88 | -1.00 | W | +3.1u |
| 2026-06-29 | SOC | ML | home | 3.0 | 0.50 | -265 | 5 | 3 | 8 | 7 | 40 | 0.00 | L | -0.5u |
| 2026-06-30 | MLB | SPREAD | home | 3.0 | 1.00 | +123 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-30 | MLB | ML | away | 4.5 | 2.50 | +120 | 1 | 0 | 1 | 1 | -7 | -1.70 | W | +5.0u |
| 2026-06-30 | MLB | SPREAD | home | 2.5 | 0.25 | +135 | 0 | 0 | 0 | 0 | 4 | 0.00 | L | -0.3u |
| 2026-06-30 | MLB | TOTAL | over | 4.0 | 1.00 | -110 | 1 | 1 | 2 | 2 | 30 | 0.00 | W | +3.6u |
| 2026-06-30 | MLB | ML | home | 2.5 | 0.25 | -111 | 0 | 0 | 0 | 0 | -22 | -1.80 | L | -0.3u |
| 2026-06-30 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 5 | 2 | 7 | 5 | 42 | 0.00 | L | -3.0u |
| 2026-06-30 | MLB | ML | away | 4.5 | 1.50 | +163 | 3 | 0 | 3 | 3 | 20 | -1.20 | L | -1.5u |
| 2026-06-30 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | -1 | -1 | -2 | -1 | -6 | 0.00 | L | -0.5u |
| 2026-06-30 | MLB | ML | away | 3.0 | 0.50 | -172 | 3 | 0 | 3 | 3 | 41 | -0.10 | W | +0.0u |
| 2026-06-30 | MLB | SPREAD | away | 3.0 | 0.50 | -101 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-06-30 | MLB | ML | away | 3.0 | 0.50 | -128 | 1 | 1 | 2 | 2 | 30 | -1.30 | W | +3.0u |
| 2026-06-30 | MLB | ML | away | 4.0 | 1.00 | -109 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -1.0u |
| 2026-06-30 | MLB | ML | home | 3.0 | 0.50 | -201 | 1 | 1 | 2 | 2 | -35 | -1.80 | W | +0.0u |
| 2026-06-30 | MLB | SPREAD | away | 2.5 | 0.25 | -113 | 2 | -1 | 1 | 2 | -1 | -0.50 | L | -0.3u |
| 2026-06-30 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 2 | 6 | 0.00 | W | +0.9u |
| 2026-06-30 | MLB | ML | away | 5.0 | 2.50 | +133 | 0 | 0 | 0 | 1 | -9 | 0.00 | L | -2.5u |
| 2026-06-30 | MLB | SPREAD | home | 4.0 | 1.00 | +131 | 1 | 0 | 1 | 1 | 20 | 0.00 | W | +0.0u |
| 2026-06-30 | MLB | TOTAL | over | 4.0 | 1.00 | +103 | 0 | 1 | 1 | 1 | 20 | 0.00 | W | +4.5u |
| 2026-06-30 | MLB | ML | away | 4.5 | 3.00 | +100 | 1 | 0 | 1 | 1 | -14 | -0.20 | L | -3.0u |
| 2026-06-30 | MLB | ML | home | 4.5 | 3.00 | -141 | 2 | 0 | 2 | 2 | 1 | 0.00 | L | -3.0u |
| 2026-06-30 | MLB | SPREAD | away | 4.5 | 3.00 | -160 | 2 | 0 | 2 | 2 | 35 | -1.50 | W | +2.5u |
| 2026-06-30 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | -1 | 1 | 0 | 0 | -9 | 0.00 | L | -0.5u |
| 2026-06-30 | MLB | ML | away | 2.5 | 0.25 | -114 | 3 | 2 | 5 | 4 | 48 | -1.40 | W | +2.7u |
| 2026-06-30 | MLB | SPREAD | home | 2.5 | 0.25 | -145 | 0 | 0 | 0 | -1 | -14 | 1.10 | L | -0.3u |
| 2026-06-30 | MLB | ML | home | 4.5 | 2.50 | +110 | 1 | 0 | 1 | 1 | -9 | 0.00 | L | -2.5u |
| 2026-06-30 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 3 | 0 | 3 | 3 | 40 | 0.00 | W | +2.6u |
| 2026-06-30 | MLB | ML | away | 4.5 | 2.50 | +117 | 4 | 1 | 5 | 4 | 29 | -0.40 | W | +2.9u |
| 2026-06-30 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 2 | 0 | 2 | 1 | 13 | 0.00 | P | +0.0u |
| 2026-06-30 | SOC | ML | home | 3.0 | 0.50 | +129 | 3 | 2 | 5 | 6 | 40 | -1.00 | W | +3.1u |
| 2026-06-30 | SOC | ML | away | 2.5 | 0.25 | +105 | 7 | 4 | 11 | 6 | 52 | -0.80 | W | +4.6u |
| 2026-06-30 | SOC | ML | home | 5.0 | 5.00 | -350 | 6 | 3 | 9 | 5 | 40 | -0.50 | W | +0.3u |
| 2026-07-01 | MLB | ML | home | 4.5 | 3.00 | -160 | 7 | 4 | 11 | 6 | 44 | -1.70 | W | +3.7u |
| 2026-07-01 | MLB | TOTAL | under | 5.0 | 2.50 | -110 | 3 | 2 | 5 | 2 | 22 | 0.00 | W | +2.6u |
| 2026-07-01 | MLB | ML | away | 4.0 | 1.00 | +123 | 1 | 0 | 1 | 1 | -9 | -0.90 | L | -1.0u |
| 2026-07-01 | MLB | ML | home | 5.0 | 5.00 | -134 | 3 | 1 | 4 | 3 | 8 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | SPREAD | away | 2.5 | 0.25 | -107 | 1 | 2 | 3 | 2 | 26 | -1.20 | L | -0.3u |
| 2026-07-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 1 | 20 | 0.00 | W | +0.9u |
| 2026-07-01 | MLB | SPREAD | home | 3.0 | 0.50 | -105 | -1 | -1 | -2 | 0 | 36 | 0.70 | W | +0.0u |
| 2026-07-01 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 16 | 0.00 | W | +0.0u |
| 2026-07-01 | MLB | ML | away | 4.0 | 1.00 | +119 | 4 | 0 | 4 | 3 | 37 | -1.00 | W | +4.9u |
| 2026-07-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | ML | away | 2.5 | 0.25 | +124 | 2 | 1 | 3 | 2 | -19 | 0.00 | L | -0.3u |
| 2026-07-01 | MLB | SPREAD | away | 5.0 | 5.00 | -180 | 2 | 1 | 3 | 1 | 20 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 1 | 2 | 1 | 20 | 0.00 | L | -5.0u |
| 2026-07-01 | MLB | ML | home | 5.0 | 5.00 | -130 | 0 | 0 | 0 | 0 | -8 | 0.00 | W | +0.0u |
| 2026-07-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | -14 | 0.00 | W | +0.0u |
| 2026-07-01 | MLB | SPREAD | home | 3.0 | 0.50 | -127 | 0 | 0 | 0 | 0 | -24 | 0.00 | L | -0.5u |
| 2026-07-01 | MLB | ML | away | 2.5 | 0.25 | -102 | 5 | 3 | 8 | 4 | 20 | -0.70 | L | -0.3u |
| 2026-07-01 | MLB | ML | away | 4.5 | 2.50 | +128 | 1 | 0 | 1 | 1 | 7 | -0.90 | W | +0.0u |
| 2026-07-01 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 3 | 0 | 3 | 3 | 15 | 0.00 | L | -3.0u |
| 2026-07-01 | SOC | ML | draw | 3.0 | 0.50 | +230 | -3 | -1 | -4 | -4 | -5 | 0.00 | W | +2.3u |
| 2026-07-02 | MLB | ML | home | 2.5 | 0.25 | -185 | -2 | 0 | -2 | -2 | 5 | -0.70 | L | -0.3u |
| 2026-07-02 | MLB | SPREAD | away | 4.0 | 1.00 | -139 | 1 | 1 | 2 | 1 | 20 | -0.50 | W | +2.9u |
| 2026-07-02 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 2 | 23 | 0.00 | L | -3.0u |
| 2026-07-02 | MLB | SPREAD | away | 4.5 | 1.50 | +140 | 0 | 0 | 0 | 0 | 0 | -0.60 | L | -1.5u |
| 2026-07-02 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 1 | 0 | 1 | 1 | -14 | 0.00 | L | -5.0u |
| 2026-07-02 | MLB | ML | away | 3.0 | 0.50 | -104 | -1 | 0 | -1 | 0 | -7 | -0.70 | L | -0.5u |
| 2026-07-02 | MLB | TOTAL | under | 5.0 | 5.00 | -110 | 6 | 2 | 8 | 5 | 1 | 0.00 | L | -5.0u |
| 2026-07-02 | MLB | SPREAD | home | 4.0 | 1.00 | +113 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-07-02 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 2 | 0 | 2 | 3 | 17 | 0.00 | W | +2.7u |
| 2026-07-02 | MLB | ML | away | 5.0 | 5.00 | -138 | 2 | 0 | 2 | 1 | 0 | -1.10 | L | -5.0u |
| 2026-07-02 | MLB | SPREAD | away | 4.0 | 1.00 | +118 | 1 | 0 | 1 | 1 | 16 | 0.00 | L | -1.0u |
| 2026-07-02 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -18 | 0.00 | W | +0.0u |
| 2026-07-02 | MLB | ML | away | 5.0 | 2.50 | +115 | 1 | 1 | 2 | 0 | 0 | 0.00 | W | +2.9u |
| 2026-07-02 | MLB | TOTAL | over | 5.0 | 5.00 | -110 | 4 | 0 | 4 | 3 | 8 | 0.00 | L | -5.0u |
| 2026-07-02 | MLB | SPREAD | away | 4.0 | 1.00 | -126 | 1 | 0 | 1 | 1 | 2 | 0.00 | L | -1.0u |
| 2026-07-02 | MLB | TOTAL | over | 5.0 | 1.00 | +106 | 3 | 0 | 3 | 2 | 31 | 0.00 | W | +0.0u |
| 2026-07-02 | MLB | ML | home | 4.0 | 1.00 | -113 | -2 | 0 | -2 | -2 | -31 | 0.00 | L | -1.0u |
| 2026-07-02 | MLB | SPREAD | home | 2.5 | 0.25 | +184 | 0 | 0 | 0 | 0 | -34 | 0.00 | L | -0.3u |
| 2026-07-02 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 0 | 0 | 0 | 0 | 0 | 0.00 | L | -1.0u |
| 2026-07-02 | MLB | ML | away | 4.0 | 1.00 | -122 | 2 | 1 | 3 | 2 | 57 | -0.80 | W | +4.2u |
| 2026-07-02 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | -1 | 0 | -1 | 0 | 0 | 0.00 | L | -3.0u |
| 2026-07-02 | SOC | ML | home | 2.5 | 0.25 | +100 | 2 | 0 | 2 | 3 | 52 | -0.50 | W | +2.5u |
| 2026-07-03 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 1 | 2 | 1 | 2 | 0.00 | W | +4.5u |
| 2026-07-03 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 0 | 1 | 1 | 7 | 0.00 | W | +0.0u |
| 2026-07-03 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 1 | 3 | 2 | 20 | 0.00 | W | +4.5u |
| 2026-07-03 | MLB | ML | away | 5.0 | 5.00 | -146 | 2 | 0 | 2 | 2 | 6 | 0.00 | W | +0.7u |
| 2026-07-03 | MLB | SPREAD | away | 5.0 | 2.50 | +112 | 0 | 0 | 0 | 0 | -33 | -0.60 | W | +0.0u |
| 2026-07-03 | MLB | TOTAL | over | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 0 | 20 | 0.00 | W | +3.6u |
| 2026-07-03 | MLB | ML | home | 3.0 | 0.50 | -216 | 1 | 0 | 1 | 1 | 3 | 0.60 | W | +0.0u |
| 2026-07-03 | MLB | SPREAD | away | 2.5 | 0.25 | -126 | 0 | 0 | 0 | 0 | -4 | -2.00 | L | -0.3u |
| 2026-07-03 | MLB | ML | home | 4.5 | 3.00 | -141 | 1 | 1 | 2 | 1 | 7 | -1.20 | W | +3.4u |
| 2026-07-03 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -18 | 0.00 | W | +0.0u |
| 2026-07-03 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 1 | 1 | 2 | 1 | 16 | 0.00 | L | -3.0u |
| 2026-07-03 | MLB | SPREAD | away | 3.0 | 0.50 | -110 | 1 | 1 | 2 | 1 | 9 | -0.10 | W | +0.0u |
| 2026-07-03 | MLB | ML | away | 4.5 | 3.00 | -103 | 6 | 1 | 7 | 6 | 12 | -1.20 | W | +4.6u |
| 2026-07-03 | MLB | TOTAL | under | 4.5 | 3.00 | -118 | 1 | 0 | 1 | 1 | 9 | 0.00 | W | +3.7u |
| 2026-07-03 | MLB | ML | home | 4.0 | 1.00 | +117 | 2 | 0 | 2 | 2 | 22 | 0.00 | L | -1.0u |
| 2026-07-03 | SOC | ML | home | 5.0 | 5.00 | -525 | 6 | 4 | 10 | 5 | 38 | 0.00 | L | -5.0u |
| 2026-07-03 | SOC | ML | away | 2.5 | 0.25 | +150 | -2 | 2 | 0 | -2 | 7 | -0.20 | L | -0.3u |
| 2026-07-03 | SOC | ML | home | 5.0 | 5.00 | -205 | 7 | 2 | 9 | 8 | 46 | -1.20 | W | +2.5u |
| 2026-07-04 | MLB | ML | away | 4.5 | 2.50 | +108 | 4 | 2 | 6 | 4 | 37 | -1.10 | W | +2.7u |
| 2026-07-04 | MLB | SPREAD | away | 5.0 | 5.00 | -192 | 1 | 1 | 2 | 1 | 2 | 0.00 | W | +2.1u |
| 2026-07-04 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | -1 | -1 | -2 | -1 | 2 | 0.00 | W | +0.0u |
| 2026-07-04 | MLB | SPREAD | away | 4.0 | 1.00 | +105 | 1 | -1 | 0 | 1 | 28 | -1.20 | W | +0.0u |
| 2026-07-04 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 0 | 0 | 0 | 0 | -10 | 0.00 | W | +0.0u |
| 2026-07-04 | MLB | TOTAL | under | 3.0 | 0.50 | -110 | 1 | 1 | 2 | 1 | 11 | 0.00 | W | +4.7u |
| 2026-07-04 | MLB | ML | away | 2.5 | 0.25 | -131 | 5 | 2 | 7 | 5 | 32 | -0.70 | W | +2.9u |
| 2026-07-04 | MLB | ML | away | 5.0 | 5.00 | -149 | 3 | 1 | 4 | 2 | 18 | 0.00 | L | -5.0u |
| 2026-07-04 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | -1 | 0 | -1 | 1 | 2 | 0.00 | W | +0.0u |
| 2026-07-04 | MLB | TOTAL | over | 5.0 | 4.00 | -110 | 1 | 1 | 2 | 1 | 20 | 0.00 | W | +3.6u |
| 2026-07-04 | MLB | ML | home | 5.0 | 5.00 | -165 | 1 | 0 | 1 | 1 | 10 | 0.00 | W | +0.0u |
| 2026-07-04 | MLB | SPREAD | away | 4.5 | 3.00 | -143 | 1 | 1 | 2 | 1 | 2 | 0.00 | L | -3.0u |
| 2026-07-04 | MLB | ML | home | 4.0 | 1.00 | +135 | 1 | 0 | 1 | 1 | -26 | 0.40 | L | -1.0u |
| 2026-07-04 | MLB | TOTAL | under | 4.5 | 3.00 | -110 | 2 | 0 | 2 | 2 | 6 | 0.00 | W | +3.6u |
| 2026-07-04 | MLB | TOTAL | over | 4.5 | 3.00 | -110 | 4 | 2 | 6 | 4 | 53 | 0.00 | L | -3.0u |
| 2026-07-04 | MLB | SPREAD | away | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 20 | 0.00 | W | +0.0u |
| 2026-07-04 | MLB | TOTAL | over | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | 1 | 0.00 | L | -0.3u |
| 2026-07-04 | MLB | TOTAL | under | 4.0 | 1.00 | -110 | 1 | 0 | 1 | 1 | 20 | 0.00 | L | -1.0u |
| 2026-07-04 | MLB | TOTAL | under | 2.5 | 0.25 | -110 | 0 | 0 | 0 | 0 | -9 | 0.00 | L | -0.3u |
| 2026-07-04 | SOC | ML | away | 5.0 | 5.00 | -500 | 4 | 2 | 6 | 4 | 16 | -0.70 | W | +1.1u |
| 2026-07-04 | SOC | ML | away | 2.5 | 0.25 | -130 | 20 | 8 | 28 | 20 | 92 | -0.40 | W | +2.5u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._