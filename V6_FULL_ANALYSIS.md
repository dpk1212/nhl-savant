# Sharp Intel v6 — Full Analysis

_Auto-generated **5/20/2026, 12:21:52 PM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 220 shipped+graded picks · 2026-04-18 → 2026-05-19  (HC analyses scoped to post-cutover 2026-04-30, 108 picks)
**Headline:** 105-113-2 · WR 48.2% [41.6%–54.8%] vs 52.4% break-even · -10.0u flat (-4.6%) · -40.4u peak.
**Overall t-test:** t = -0.64 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.158 ✓ p<.05**  (full sample, N=214)
- **ρ(HC, flat ROI) = -0.013 ✗**  (post-cutover, N=108)
- **ρ(Δw+HC, flat ROI) = -0.030 ✗**  (post-cutover, N=108)

Cohort breakdown:

**No cohort cleared the 90% sig threshold. Best directional cohorts:**

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0 (full sample)** — N=43, 13-29, WR 31.0% [19%–46%], flat ROI -40.7% (t=-3.02 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=16, WR 37.5%, flat ROI -29.0%. Bayesian posterior WR ≈ 42.3%, half-Kelly = **0.0%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=61, WR 57.4%, flat ROI +14.2%. Bayesian posterior WR ≈ 56.3%, half-Kelly = **4.2%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=20, WR 35.0%, flat ROI -32.6%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=46, WR 58.7%, flat ROI +26.4%. Bayesian posterior WR ≈ 57.1%, half-Kelly = **5.0%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -40.7% flat ROI on 43 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.05u/pick), we need **~1689 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 220. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-19 |
| Sides scanned | 506 |
| Shipped + graded | **220** |
| W-L-P | 105-113-2 |
| Win rate | **48.2%** [41.6%–54.8%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +4.2 pp |
| Peak-units PnL | **-40.4u** |
| Flat-1u PnL | **-10.0u** (-4.6% flat ROI) |
| Flat t-statistic vs zero | -0.64 → ✗ noise |
| Flat 95% CI per-pick | [-0.184, 0.093]u |

### Power note

At our observed flat-PnL standard deviation (1.05u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4690 |
| +5% | 1689 |
| +10% | 423 |

We have **220** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 35 | 12-22-1 | 35.3% [21–52] | -33.1% | -14.6u | -2.15 ✓ p<.05 |
| Δw = +1 | 70 | 39-30-1 | 56.5% [45–68] | +7.9% | +6.5u | 0.69 ✗ noise |
| Δw = +2 | 55 | 22-33-0 | 40.0% [28–53] | -20.1% | -26.6u | -1.48 ✗ noise |
| Δw ≥ +3 | 46 | 27-19-0 | 58.7% [44–72] | +26.4% | -3.6u | 1.41 ✗ noise |

**Pearson ρ(Δw, WIN) = 0.128** ~ p<.10  ·  **ρ(Δw, flat ROI) = 0.158** ✓ p<.05  (N=214)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 29 | 13-15-1 | 46.4% [30–64] | -11.2% | -16.2u | -0.63 ✗ noise |
| HC = +1 | 61 | 35-26-0 | 57.4% [45–69] | +14.2% | +3.8u | 1.09 ✗ noise |
| HC = +2 | 12 | 5-7-0 | 41.7% [19–68] | -16.9% | -8.6u | -0.57 ✗ noise |
| HC ≥ +3 | 4 | 1-3-0 | 25.0% [5–70] | -65.4% | -5.4u | -1.89 ~ p<.10 |

**Pearson ρ(HC, WIN) = 0.000** ✗  ·  **ρ(HC, flat ROI) = -0.013** ✗  (N=108)

Spearman rank ρ(HC, flat ROI) = 0.050.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.6u | 0.00 ✗ noise |
| Σ = +1 | 20 | 10-9-1 | 52.6% [32–73] | +1.8% | +2.4u | 0.08 ✗ noise |
| Σ = +2 | 41 | 24-17-0 | 58.5% [43–72] | +13.5% | +1.8u | 0.88 ✗ noise |
| Σ = +3 | 16 | 6-10-0 | 37.5% [18–61] | -27.4% | -8.4u | -1.07 ✗ noise |
| Σ = +4 | 13 | 7-6-0 | 53.8% [29–77] | +6.8% | -10.7u | 0.23 ✗ noise |
| Σ = +5 | 10 | 4-6-0 | 40.0% [17–69] | -19.8% | -7.2u | -0.60 ✗ noise |
| Σ ≥ +6 | 6 | 3-3-0 | 50.0% [19–81] | +5.9% | -4.1u | 0.12 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = -0.040** ✗  ·  **ρ(Σ, flat ROI) = -0.030** ✗  (N=108)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 108.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | -0.049 ✗ | -0.028 ✗ | -0.007 | weak |
| HC margin | 0.000 ✗ | -0.013 ✗ | 0.050 | weak |
| Δw + HC | -0.040 ✗ | -0.030 ✗ | 0.015 | weak |
| peak.stars | -0.160 ~ p<.10 | -0.182 ~ p<.10 | -0.181 | weak |
| vault.star | -0.149 ✗ | -0.132 ✗ | -0.151 | weak |
| lock.stars | -0.082 ✗ | -0.121 ✗ | -0.121 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 108 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=10 · 6-3 · 67% [35–88] · +23%  | N=13 · 6-7 · 46% [23–71] · -11%  | N=5 · 1-4 · 20% [4–62] · -61%  |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=10 · 4-6 · 40% [17–69] · -19%  | N=26 · 18-8 · 69% [50–83] · +35%  | N=12 · 5-7 · 42% [19–68] · -15%  | N=12 · 8-4 · 67% [39–86] · +36%  |
| +2 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=3 · 0-3 · 0% [0–56] · -100%  | N=8 · 5-3 · 63% [31–86] · +25%  |
| ≥ +3 | — | — | — | N=1 · 1-0 · 100% [21–100] · —  | — | N=2 · 0-2 · 0% [0–66] · —  | N=1 · 0-1 · 0% [0–79] · —  |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 29 | 13-15-1 | 46.4% [30–64] | -11.2% | -16.2u | -0.63 ✗ noise |
| HC = +1 | 61 | 35-26-0 | 57.4% [45–69] | +14.2% | +3.8u | 1.09 ✗ noise |
| HC = +2 | 12 | 5-7-0 | 41.7% [19–68] | -16.9% | -8.6u | -0.57 ✗ noise |
| HC ≥ +3 | 4 | 1-3-0 | 25.0% [5–70] | -65.4% | -5.4u | -1.89 ~ p<.10 |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 12 | 5-7-0 | 41.7% [19–68] | -21.1% | -1.2u | -0.73 ✗ noise |
| Δw = +1 | 37 | 24-12-1 | 66.7% [50–80] | +27.8% | +11.1u | 1.83 ~ p<.10 |
| Δw = +2 | 30 | 11-19-0 | 36.7% [22–54] | -27.5% | -22.9u | -1.51 ✗ noise |
| Δw ≥ +3 | 28 | 14-14-0 | 50.0% [33–67] | +0.9% | -15.7u | 0.05 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 77 | 41-36-0 | 53.2% [42–64] | +5.2% | -10.2u | 0.45 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 20 | 7-13-0 | 35.0% [18–57] | -32.6% | -20.1u | -1.53 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 11 | 6-4-1 | 60.0% [31–83] | +11.5% | +0.5u | 0.41 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 200 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δcount = −1 | 9 | 1-8-0 | 11.1% [2–44] | -72.8% | -10.2u | -2.67 ✓ p<.01 |
| Δcount = 0 (balanced) | 19 | 6-13-0 | 31.6% [15–54] | -44.2% | -14.3u | -2.24 ✓ p<.05 |
| Δcount = +1 | 49 | 28-20-1 | 58.3% [44–71] | +14.8% | +6.3u | 1.05 ✗ noise |
| Δcount = +2 | 60 | 26-33-1 | 44.1% [32–57] | -15.0% | -16.2u | -1.18 ✗ noise |
| Δcount ≥ +3 (heavy support) | 62 | 38-24-0 | 61.3% [49–72] | +27.4% | +4.1u | 1.84 ~ p<.10 |

**ρ(Δcount, WIN) = 0.211** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.251** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -2 · ≤ 0 · ≤ 4 · ≤ 12 · > 12

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 46 | 18-28-0 | 39.1% [26–54] | -21.4% | -18.5u | -1.44 ✗ noise |
| Q2 | 39 | 17-21-1 | 44.7% [30–60] | -9.0% | -5.2u | -0.54 ✗ noise |
| Q3 (balanced) | 43 | 20-23-0 | 46.5% [33–61] | -10.8% | -30.6u | -0.72 ✗ noise |
| Q4 | 33 | 21-12-0 | 63.6% [47–78] | +22.7% | +13.4u | 1.26 ✗ noise |
| Q5 (best — heavy support) | 39 | 23-15-1 | 60.5% [45–74] | +25.2% | +10.1u | 1.30 ✗ noise |

**ρ(ΔWlNet, WIN) = 0.142** ✓ p<.05  ·  **ρ(ΔWlNet, flat ROI) = 0.123** ~ p<.10

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -2.30 · ≤ 0.15 · ≤ 2.76 · ≤ 10.63 · > 10.63

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 41 | 17-24-0 | 41.5% [28–57] | -16.5% | -13.9u | -1.03 ✗ noise |
| Q2 | 42 | 15-26-1 | 36.6% [24–52] | -27.9% | -21.6u | -1.90 ~ p<.10 |
| Q3 | 39 | 18-21-0 | 46.2% [32–61] | -14.1% | -15.5u | -0.92 ✗ noise |
| Q4 | 39 | 25-14-0 | 64.1% [48–77] | +24.3% | +3.6u | 1.55 ✗ noise |
| Q5 | 39 | 24-14-1 | 63.2% [47–77] | +35.4% | +16.5u | 1.75 ~ p<.10 |

**ρ(ΔFlatPnl, WIN) = 0.187** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.216** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -8.8 · ≤ 0.0 · ≤ 9.8 · ≤ 27.8 · > 27.8

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 41 | 11-29-1 | 27.5% [16–43] | -39.6% | -30.0u | -2.48 ✓ p<.05 |
| Q2 | 40 | 18-22-0 | 45.0% [31–60] | -13.1% | -9.1u | -0.84 ✗ noise |
| Q3 | 40 | 12-28-0 | 30.0% [18–45] | -41.9% | -42.0u | -2.92 ✓ p<.01 |
| Q4 | 40 | 29-10-1 | 74.4% [59–85] | +38.0% | +23.4u | 2.75 ✓ p<.01 |
| Q5 | 39 | 29-10-0 | 74.4% [59–85] | +57.2% | +26.9u | 3.14 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.370** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.362** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 18 | 3-15-0 | 16.7% [6–39] | -62.3% | -15.5u | -3.02 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 15 | 5-10-0 | 33.3% [15–58] | -34.1% | -9.8u | -1.35 ✗ noise |
| ΔBestRank = 0 (tied) | 2 | 2-0-0 | 100.0% [34–100] | +90.9% | +0.5u | 0.00 ✗ noise |
| ΔBestRank ∈ [+1,+4] | 10 | 2-8-0 | 20.0% [6–51] | -63.2% | -11.8u | -2.58 ✓ p<.05 |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 32 | 17-14-1 | 54.8% [38–71] | +13.9% | -2.8u | 0.68 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.322** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.297** ✓ p<.01  (N=77)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 13 | 3-10-0 | 23.1% [8–50] | -38.5% | -5.1u | -1.11 ✗ noise |
| Δshare ∈ [−30,−10] pp | 3 | 1-2-0 | 33.3% [6–79] | -11.7% | -4.5u | -0.13 ✗ noise |
| Δshare ≈ 0 (±10 pp) | 123 | 55-66-2 | 45.5% [37–54] | -13.5% | -43.3u | -1.57 ✗ noise |
| Δshare ∈ [+10,+30] pp | 15 | 8-7-0 | 53.3% [30–75] | +7.9% | -0.8u | 0.29 ✗ noise |
| Δshare ≥ +30 pp | 46 | 32-14-0 | 69.6% [55–81] | +43.8% | +22.8u | 2.60 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.215** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.185** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **ΔAvgRoi** | 0.370 ✓ p<.01 | 0.362 ✓ p<.01 | 0.337 |
| 2 | **ΔTopQCount** | 0.249 ✓ p<.01 | 0.275 ✓ p<.01 | 0.233 |
| 3 | **Δcount** | 0.211 ✓ p<.01 | 0.251 ✓ p<.01 | 0.168 |
| 4 | **ΔFlatPnl** | 0.187 ✓ p<.01 | 0.216 ✓ p<.01 | 0.192 |
| 5 | **ΔTopQShare** | 0.215 ✓ p<.01 | 0.185 ✓ p<.01 | 0.220 |
| 6 | **ΔWlNet** | 0.142 ✓ p<.05 | 0.123 ~ p<.10 | 0.136 |

_(ΔBestRank uses N=77 subset where both sides had a proven wallet — ρ(flat ROI) = 0.297 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 429, dateRange = 2026-04-18 → 2026-05-19, computedAt = 2026-05-20T16:18:15.943Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **200** rows · PIT aggregate computable on **194** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **194** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 0 · — · — | 0 · — · — | — |
| LOCK (+5..+7) | 0 · — · — | 0 · — · — | — |
| STRONG (+3..+5) | 2 · 100% · +285.1% | 8 · 63% · +13.6% | -271.6pp |
| NEUTRAL (0..+3) | 109 · 57% · +9.7% | 113 · 54% · +3.3% | -6.4pp |
| WEAK (−3..0) | 55 · 41% · -18.4% | 48 · 38% · -23.0% | -4.6pp |
| FADE (<−3) | 19 · 21% · -57.9% | 16 · 44% · +8.5% | +66.4pp |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=69, WR=60%, ROI=+17.9% | N=97, WR=58%, ROI=+10.7% | -7.2pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=111, WR=58%, ROI=+14.7% | N=121, WR=54%, ROI=+4.0% | -10.7pp |
| AGS < −1 (mute veto) | N=25, WR=20%, ROI=-62.9% | N=23, WR=43%, ROI=+8.3% | +71.1pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-05-06 → 2026-05-19, N=81)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 0 · — · — |
| LOCK (+5..+7) | 0 · — · — |
| STRONG (+3..+5) | 3 · 100% · +72.6% |
| NEUTRAL (0..+3) | 53 · 53% · +3.2% |
| WEAK (−3..0) | 22 · 41% · -16.3% |
| FADE (<−3) | 3 · 67% · +27.3% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=47, WR=57%, ROI=+9.7% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=56, WR=55%, ROI=+6.9% |
| AGS < −1 (mute veto) | N=8, WR=50%, ROI=+4.7% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | COUNT | + | 1.43 | 1.57 |
| `dHcCount` | COUNT_HC | + | 0.45 | 0.83 |
| `dConvictionAvg` | INTENSITY | + | 0.54 | 0.55 |
| `dHcSizeRatio` | INTENSITY_HC | + | 1.52 | 5.19 |
| `forContribShare` | DOMINANCE | + | 0.81 | 0.25 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **194/220** shipped+graded rows (88%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -9.56 |
| 20th pct | -1.62 |
| 40th pct | 0.69 |
| Median | 1.08 |
| 60th pct | 1.28 |
| 80th pct | 1.93 |
| 90th pct | 2.43 |
| Max | 4.67 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 5 | 2.6% |
| **LOCK** | +5..+7 | 96 | 49.5% |
| **STRONG** | +3..+5 | 0 | 0.0% |
| **NEUTRAL** | 0..+3 | 0 | 0.0% |
| **WEAK** | −3..0 | 38 | 19.6% |
| **FADE** | < −3 | 22 | 11.3% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 5 | 4-1-0 | 80.0% [38–96] | +42.6% | +6.6u | 1.12 ✗ noise |
| LOCK | 96 | 49-47-0 | 51.0% [41–61] | -2.2% | -21.7u | -0.22 ✗ noise |
| STRONG | 0 | — | — | — | — | — |
| NEUTRAL | 0 | — | — | — | — | — |
| WEAK | 38 | 13-24-1 | 35.1% [22–51] | -32.6% | -18.7u | -2.19 ✓ p<.05 |
| FADE | 22 | 10-12-0 | 45.5% [27–65] | +13.2% | -8.3u | 0.41 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (COUNT)

r(WIN) = **0.085** ✗ · r(ROI) = **0.018** ✗ · Spearman ρ(ROI) = **0.029**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 22 | 10-12-0 | 45.5% [27–65] | +9.7% | -8.5u | 0.31 ✗ noise |
| z ∈ [−1, 0) | 66 | 32-32-2 | 50.0% [38–62] | -2.4% | -3.4u | -0.19 ✗ noise |
| z ∈ [0, +1) | 68 | 27-41-0 | 39.7% [29–52] | -23.6% | -36.4u | -2.03 ✓ p<.05 |
| z ≥ +1 (very positive) | 38 | 22-16-0 | 57.9% [42–72] | +9.3% | +6.4u | 0.58 ✗ noise |

#### `dHcCount` (COUNT_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 160 | 76-82-2 | 48.1% [40–56] | -6.8% | -38.9u | -0.87 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `dConvictionAvg` (INTENSITY)

r(WIN) = **0.154** ✓ p<.05 · r(ROI) = **0.056** ✗ · Spearman ρ(ROI) = **0.104**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 23 | 6-17-0 | 26.1% [13–46] | -28.3% | -18.6u | -0.95 ✗ noise |
| z ∈ [−1, 0) | 49 | 24-24-1 | 50.0% [36–64] | -2.8% | -13.9u | -0.19 ✗ noise |
| z ∈ [0, +1) | 99 | 49-49-1 | 50.0% [40–60] | -2.9% | -3.1u | -0.30 ✗ noise |
| z ≥ +1 (very positive) | 23 | 12-11-0 | 52.2% [33–71] | -5.2% | -6.3u | -0.26 ✗ noise |

#### `dHcSizeRatio` (INTENSITY_HC)

r(WIN) = **NaN** — · r(ROI) = **NaN** — · Spearman ρ(ROI) = **NaN**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 0 | — | — | — | — | — |
| z ∈ [−1, 0) | 34 | 15-19-0 | 44.1% [29–61] | -3.2% | -3.0u | -0.15 ✗ noise |
| z ∈ [0, +1) | 160 | 76-82-2 | 48.1% [40–56] | -6.8% | -38.9u | -0.87 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### `forContribShare` (DOMINANCE)

r(WIN) = **0.102** ✗ · r(ROI) = **0.005** ✗ · Spearman ρ(ROI) = **0.075**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 17 | 8-9-0 | 47.1% [26–69] | +18.7% | -4.9u | 0.49 ✗ noise |
| z ∈ [−1, 0) | 52 | 18-33-1 | 35.3% [24–49] | -30.2% | -34.7u | -2.25 ✓ p<.05 |
| z ∈ [0, +1) | 125 | 65-59-1 | 52.4% [44–61] | +0.4% | -2.2u | 0.05 ✗ noise |
| z ≥ +1 (very positive) | 0 | — | — | — | — | — |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | 0.154 ✓ p<.05 | 0.056 ✗ | 0.104 |
| 2 | `forContribShare` | DOMINANCE | 0.102 ✗ | 0.005 ✗ | 0.075 |
| 3 | `dCount` | COUNT | 0.085 ✗ | 0.018 ✗ | 0.029 |
| 4 | `dHcCount` | COUNT_HC | NaN — | NaN — | NaN |
| 5 | `dHcSizeRatio` | INTENSITY_HC | NaN — | NaN — | NaN |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dCount` | +0.227 | 0.793 | 32.4% | meaningful |
| 2 | `dConvictionAvg` | +0.078 | 0.777 | 31.8% | meaningful |
| 3 | `forContribShare` | +0.085 | 0.730 | 29.9% | meaningful |
| 4 | `dHcCount` | -0.094 | 0.094 | 3.9% | silent (<0.2) |
| 5 | `dHcSizeRatio` | -0.051 | 0.051 | 2.1% | silent (<0.2) |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dHcCount` | `dConvictionAvg` | `dHcSizeRatio` | `forContribShare` |
|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.301 | +0.265 | +0.301 | +0.506 |
| `dHcCount` | +0.301 | 1.000 | +0.132 | +1.000 ⚠ | +0.209 |
| `dConvictionAvg` | +0.265 | +0.132 | 1.000 | +0.132 | +0.872 ⚠ |
| `dHcSizeRatio` | +0.301 | +1.000 ⚠ | +0.132 | 1.000 | +0.209 |
| `forContribShare` | +0.506 | +0.209 | +0.872 ⚠ | +0.209 | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.120**. At AGS ≥ +1 fires N=102, WR=55.9%, ROI=+7.1%. At AGS ≥ +null fires N=128, WR=52.0%, ROI=-0.2%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-102 ROI (matched cohort) | Top-102 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.102 | −0.018 | WR=53%, ROI=+1.9% | +5.2pp | N=87, WR=53%, ROI=+1.2% |
| `dHcCount` | +0.111 | −0.008 | WR=55%, ROI=+4.5% | +2.5pp | N=106, WR=54%, ROI=+3.0% |
| `dConvictionAvg` | +0.075 | −0.044 | WR=50%, ROI=-6.0% | +13.0pp | N=73, WR=51%, ROI=-2.7% |
| `dHcSizeRatio` | +0.116 | −0.003 | WR=55%, ROI=+4.5% | +2.5pp | N=105, WR=54%, ROI=+4.0% |
| `forContribShare` | +0.120 | −0.000 | WR=57%, ROI=+8.0% | -0.9pp | N=61, WR=54%, ROI=+3.0% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dConvictionAvg` | −0.044 | +13.0pp | carries marginal info |
| 2 | `dCount` | −0.018 | +5.2pp | mild marginal info |
| 3 | `dHcCount` | −0.008 | +2.5pp | mild marginal info |
| 4 | `dHcSizeRatio` | −0.003 | +2.5pp | mild marginal info |
| 5 | `forContribShare` | −0.000 | -0.9pp | mild marginal info |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dConvictionAvg` | INTENSITY | +0.295 | 0.295 | positive ↑ |
| 2 | `forContribShare` | DOMINANCE | -0.100 | 0.100 | negative ↓ |
| 3 | `dCount` | COUNT | +0.092 | 0.092 | positive ↑ |
| 4 | `dHcCount` | COUNT_HC | +0.007 | 0.007 | flat ≈ 0 |
| 5 | `dHcSizeRatio` | INTENSITY_HC | +0.004 | 0.004 | flat ≈ 0 |

Intercept b = -0.161 · Final log-loss = 0.6788 · N = 194.

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
- **v9 simplification candidate**: only `dCount`, `dConvictionAvg` carry marginal info (Spearman ρ drop > 0.01 when removed). The other 4 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=194 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 194 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/194 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 65 | 28-37-0 | 43.1% [32–55] | -22.2% | -43.5u | -1.92 ~ p<.10 |
| 4.5★ | 21 | 13-8-0 | 61.9% [41–79] | +26.1% | +12.4u | 1.08 ✗ noise |
| 4.0★ | 38 | 18-19-1 | 48.6% [33–64] | -4.4% | -4.7u | -0.27 ✗ noise |
| 3.5★ | 38 | 19-19-0 | 50.0% [35–65] | +8.8% | +3.8u | 0.43 ✗ noise |
| 3.0★ | 21 | 9-11-1 | 45.0% [26–66] | -4.1% | -2.3u | -0.18 ✗ noise |
| 2.5★ | 37 | 18-19-0 | 48.6% [33–64] | -5.1% | -6.1u | -0.31 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 4/50%/-32% | 2/50%/-6% | 6/0%/-100% | 6/33%/-26% | 10/33%/-33% | 14/29%/-44% |
| Δw = +1 | 4/75%/+28% | 5/40%/-24% | 14/69%/+34% | 28/54%/+4% | 2/0%/-100% | 16/56%/+5% |
| Δw = +2 | 24/29%/-41% | 6/67%/+28% | 16/44%/-14% | — | 5/40%/-17% | 4/50%/+8% |
| Δw ≥ +3 | 31/45%/-18% | 5/80%/+90% | 2/100%/+91% | 3/67%/+156% | 4/100%/+133% | 1/100%/+145% |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 8 | 4-4-0 | 50.0% [22–78] | -30.7% | -2.8u | -1.17 ✗ noise |
| −200/−151 | 14 | 5-9-0 | 35.7% [16–61] | -42.8% | -12.9u | -2.01 ✓ p<.05 |
| −150/−101 | 129 | 65-63-1 | 50.8% [42–59] | -3.3% | -4.0u | -0.40 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 49 | 21-27-1 | 43.8% [31–58] | -3.0% | -25.4u | -0.19 ✗ noise |
| +151/+200 | 4 | 3-1-0 | 75.0% [30–95] | +105.8% | +2.9u | 1.53 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -46% (5) | — | +47% (1) | -33% (2) |
| −200/−151 | -100% (5) | +20% (4) | -21% (2) | -100% (2) |
| −150/−101 | -29% (23) | +20% (46) | -33% (34) | +16% (23) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | -7% (7) | -26% (16) | +2% (15) | +27% (11) |
| +151/+200 | — | +160% (1) | +198% (1) | +165% (1) |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 121 | 57-64-0 | 47.1% [38–56] | -4.5% | -40.7u | -0.45 ✗ noise |
| SPREAD | 35 | 14-20-1 | 41.2% [26–58] | -20.6% | -1.7u | -1.29 ✗ noise |
| TOTAL | 64 | 34-29-1 | 54.0% [42–66] | +4.2% | +1.9u | 0.35 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=21 · 24% · -57% | N=38 · 55% · +5% | N=28 · 39% · -18% | N=31 · 58% · +31% |
| SPREAD | N=10 · 22% · -51% | N=10 · 30% · -42% | N=8 · 63% · +16% | N=6 · 50% · -2% |
| TOTAL | N=12 · 50% · -4% | N=22 · 71% · +36% | N=19 · 32% · -39% | N=9 · 67% · +30% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 92 | 42-50-0 | 45.7% [36–56] | -11.8% | -26.6u | -1.15 ✗ noise |
| NBA | 101 | 49-51-1 | 49.0% [39–59] | -0.9% | -6.0u | -0.08 ✗ noise |
| NHL | 27 | 14-12-1 | 53.8% [35–71] | +6.2% | -7.9u | 0.32 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=12 · 25% · -47% | N=34 · 56% · +6% | N=30 · 37% · -29% | N=15 · 53% · +7% |
| NBA | N=26 · 28% · -49% | N=25 · 56% · +10% | N=17 · 47% · -3% | N=28 · 61% · +35% |
| NHL | N=5 · 60% · +17% | N=11 · 60% · +10% | N=8 · 38% · -21% | N=3 · 67% · +45% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 129 · 43% · -11.3% · -1.17 ✗ noise | 90 · 54% · +3.5% · 0.35 ✗ noise |
| **plusEV** | 30 · 40% · -14.1% · -0.59 ✗ noise | 189 · 49% · -3.8% · -0.52 ✗ noise |
| **pinnacleConfirms** | 62 · 48% · -1.4% · -0.10 ✗ noise | 82 · 46% · -8.9% · -0.77 ✗ noise |
| **invested10kPlus** | 119 · 45% · -9.9% · -0.97 ✗ noise | 25 · 60% · +14.5% · 0.74 ✗ noise |
| **lineMovingWith** | 120 · 49% · -3.3% · -0.34 ✗ noise | 99 · 47% · -7.6% · -0.73 ✗ noise |
| **predMarketAligns** | 54 · 52% · +4.4% · 0.27 ✗ noise | 90 · 44% · -11.7% · -1.07 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 36 | 23-13-0 | 63.9% [48–78] | +22.8% | +5.6u | 1.44 ✗ noise |
| 1 | 44 | 19-24-1 | 44.2% [30–59] | -16.3% | -12.6u | -1.15 ✗ noise |
| 2 | 61 | 27-33-1 | 45.0% [33–58] | -7.9% | -7.6u | -0.58 ✗ noise |
| 3 | 26 | 12-14-0 | 46.2% [29–65] | -7.4% | -8.2u | -0.35 ✗ noise |
| 4 | 23 | 8-15-0 | 34.8% [19–55] | -30.5% | -15.5u | -1.47 ✗ noise |
| 5 | 22 | 13-9-0 | 59.1% [39–77] | +3.1% | +0.3u | 0.16 ✗ noise |
| 6 | 8 | 3-5-0 | 37.5% [14–69] | +25.3% | -2.5u | 0.35 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 56 | 35-20-1 | 63.6% [50–75] | +18.4% | +22.8u | 1.49 ✗ noise |
| NEAR_START | 94 | 37-56-1 | 39.8% [30–50] | -15.9% | -42.8u | -1.36 ✗ noise |
| NO_MOVE | 7 | 2-5-0 | 28.6% [8–64] | -45.3% | -3.6u | -1.28 ✗ noise |
| PREGAME | 25 | 15-10-0 | 60.0% [41–77] | +11.9% | +2.0u | 0.63 ✗ noise |
| SMALL_MOVE | 36 | 14-22-0 | 38.9% [25–55] | -20.9% | -21.2u | -1.20 ✗ noise |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 120 | 57-62-1 | 47.9% [39–57] | -9.9% | -27.1u | -1.14 ✗ noise |
| STRONG | 48 | 24-24-0 | 50.0% [36–64] | -0.1% | -9.4u | -0.01 ✗ noise |
| LEAN | 48 | 22-25-1 | 46.8% [33–61] | +3.3% | -5.2u | 0.18 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.102 ✗ | -0.041 ✗ | -0.057 | -0.61 |
| totalInvested | -0.087 ✗ | -0.084 ✗ | -0.052 | -1.24 |
| evEdge | 0.085 ✗ | 0.085 ✗ | 0.060 | 1.26 |
| moneyPct | 0.026 ✗ | -0.040 ✗ | -0.039 | -0.58 |
| walletPct | 0.060 ✗ | 0.028 ✗ | 0.037 | 0.41 |
| criteriaMet | -0.064 ✗ | -0.033 ✗ | -0.084 | -0.48 |
| maxContribFor | 0.012 ✗ | 0.025 ✗ | 0.048 | 0.38 |
| meanBaseFor | 0.011 ✗ | 0.027 ✗ | 0.055 | 0.40 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **212** picks. Mean CLV = **-0.0037**.
t-statistic vs zero: -3.20 → ✓ p<.01 · 95% CI [-0.0059, -0.0014]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 22 | 12-10-0 | 54.5% [35–73] | -5.4% | +0.8u | -0.28 ✗ noise |
| CLV (−2%, 0] | 113 | 49-62-2 | 44.1% [35–53] | -12.4% | -40.4u | -1.29 ✗ noise |
| CLV (0, +2%] | 63 | 33-30-0 | 52.4% [40–64] | +12.3% | +0.9u | 0.82 ✗ noise |
| CLV > +2% | 14 | 6-8-0 | 42.9% [21–67] | -26.4% | -7.9u | -1.08 ✗ noise |

ρ(CLV, flat ROI) = -0.025 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=109 (with all features non-null). Intercept β₀ = -0.011.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔAvgRoi | +0.570 | ↑ helps |
| 2 | pw.Δcount | +0.524 | ↑ helps |
| 3 | sharpCount | -0.394 | ↓ hurts |
| 4 | peak.stars | -0.299 | ↓ hurts |
| 5 | evEdge | +0.291 | ↑ helps |
| 6 | odds (American) | -0.286 | ↓ hurts |
| 7 | vault.star | -0.163 | ↓ hurts |
| 8 | pw.ΔFlatPnl | +0.144 | ↑ helps |
| 9 | walletPct | -0.105 | ↓ hurts |
| 10 | pw.ΔWlNet | -0.101 | ↓ hurts |
| 11 | criteriaMet | -0.074 | ↓ hurts |
| 12 | log10(invested) | -0.049 | ≈ flat |
| 13 | pw.ΔTopQShare | -0.047 | ≈ flat |
| 14 | log(impliedProb) | +0.044 | ≈ flat |
| 15 | Δw | -0.042 | ≈ flat |
| 16 | HC margin | +0.041 | ≈ flat |
| 17 | Δw + HC | -0.014 | ≈ flat |
| 18 | moneyPct | -0.012 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 16 | 6-10 | 37.5% | 42.3% | -105 | — (mute) | 3.34u | **MUTE** (negative EV at posterior) |
| Tier-1b HC = +1 (post-cutover) | 61 | 35-26 | 57.4% | 56.3% | -108 | 4.59% bankroll | 1.83u | **UNDER-SIZED** — ship up to 4.59u (1u=1% bankroll) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 20 | 7-13 | 35.0% | 40.0% | -110 | — (mute) | 1.99u | **MUTE** (negative EV at posterior) |
| Δw ≥ +3 (full sample) | 46 | 27-19 | 58.7% | 57.1% | -105 | 6.07% bankroll | 2.76u | **UNDER-SIZED** — ship up to 6.07u (1u=1% bankroll) |
| Stale Δw = 0 | 35 | 12-22 | 35.3% | 38.6% | -108 | — (mute) | 1.25u | **MUTE** (negative EV at posterior) |
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

**Peak cum PnL:** +7.1u
**Max drawdown:** -47.5u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 5
**Daily Sharpe-like (μ/σ):** -0.273  (annualized × √252 ≈ -4.33)

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

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._