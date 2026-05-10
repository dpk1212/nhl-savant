# Sharp Intel v6 — Full Analysis

_Auto-generated **5/10/2026, 10:14:54 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 151 shipped+graded picks · 2026-04-18 → 2026-05-09  (HC analyses scoped to post-cutover 2026-04-30, 39 picks)
**Headline:** 73-76-2 · WR 49.0% [41.1%–56.9%] vs 52.4% break-even · -3.8u flat (-2.5%) · -6.1u peak.
**Overall t-test:** t = -0.29 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.300 ✓ p<.01**  (full sample, N=145)
- **ρ(HC, flat ROI) = 0.156 ✗**  (post-cutover, N=39)
- **ρ(Δw+HC, flat ROI) = 0.232 ✗**  (post-cutover, N=39)

Cohort breakdown:

**Winning cohorts (t ≥ 1.645 with positive mean):**
- **Tier-1a HC ≥ +2 (post-cutover)** — N=2, 2-0, WR 100.0% [34%–100%], flat ROI +96.2% (t=104.00 ✓ p<.01)
- **Δw ≥ +3 (full sample)** — N=27, 19-8, WR 70.4% [52%–84%], flat ROI +51.7% (t=2.02 ✓ p<.05)

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0 (full sample)** — N=35, 9-25, WR 26.5% [15%–43%], flat ROI -48.6% (t=-3.41 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=2, WR 100.0%, flat ROI +96.2%. Bayesian posterior WR ≈ 58.3%, half-Kelly = **6.3%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=26, WR 53.8%, flat ROI +6.0%. Bayesian posterior WR ≈ 52.8%, half-Kelly = **0.4%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=5, WR 60.0%, flat ROI +16.8%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=27, WR 70.4%, flat ROI +51.7%. Bayesian posterior WR ≈ 64.9%, half-Kelly = **13.1%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -48.6% flat ROI on 35 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.07u/pick), we need **~1762 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 151. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-09 |
| Sides scanned | 353 |
| Shipped + graded | **151** |
| W-L-P | 73-76-2 |
| Win rate | **49.0%** [41.1%–56.9%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +3.4 pp |
| Peak-units PnL | **-6.1u** |
| Flat-1u PnL | **-3.8u** (-2.5% flat ROI) |
| Flat t-statistic vs zero | -0.29 → ✗ noise |
| Flat 95% CI per-pick | [-0.196, 0.146]u |

### Power note

At our observed flat-PnL standard deviation (1.07u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4893 |
| +5% | 1762 |
| +10% | 441 |

We have **151** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 27 | 8-18-1 | 30.8% [17–50] | -41.1% | -15.0u | -2.45 ✓ p<.05 |
| Δw = +1 | 50 | 26-23-1 | 53.1% [39–66] | +0.8% | -2.8u | 0.06 ✗ noise |
| Δw = +2 | 33 | 15-18-0 | 45.5% [30–62] | -6.0% | -8.1u | -0.32 ✗ noise |
| Δw ≥ +3 | 27 | 19-8-0 | 70.4% [52–84] | +51.7% | +21.8u | 2.02 ✓ p<.05 |

**Pearson ρ(Δw, WIN) = 0.283** ✓ p<.01  ·  **ρ(Δw, flat ROI) = 0.300** ✓ p<.01  (N=145)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 9 | 6-2-1 | 75.0% [41–93] | +39.4% | +3.6u | 1.39 ✗ noise |
| HC = +1 | 26 | 14-12-0 | 53.8% [35–71] | +6.0% | -2.3u | 0.30 ✗ noise |
| HC = +2 | 2 | 2-0-0 | 100.0% [34–100] | +96.2% | +6.7u | 104.00 ✓ p<.01 |
| HC ≥ +3 | 0 | — | — | — | — | — |

**Pearson ρ(HC, WIN) = 0.179** ✗  ·  **ρ(HC, flat ROI) = 0.156** ✗  (N=39)

Spearman rank ρ(HC, flat ROI) = 0.168.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Σ = +1 | 10 | 4-5-1 | 44.4% [19–73] | -13.4% | -1.9u | -0.44 ✗ noise |
| Σ = +2 | 15 | 10-5-0 | 66.7% [42–85] | +28.9% | -0.6u | 1.17 ✗ noise |
| Σ = +3 | 6 | 2-4-0 | 33.3% [10–70] | -17.6% | -5.1u | -0.33 ✗ noise |
| Σ = +4 | 3 | 3-0-0 | 100.0% [44–100] | +73.6% | +7.7u | 3.19 ✓ p<.01 |
| Σ = +5 | 2 | 1-1-0 | 50.0% [9–91] | -1.5% | -1.1u | -0.01 ✗ noise |
| Σ ≥ +6 | 2 | 2-0-0 | 100.0% [34–100] | +95.2% | +6.7u | 0.00 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = 0.261** ~ p<.10  ·  **ρ(Σ, flat ROI) = 0.232** ✗  (N=39)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 39.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.199 ✗ | 0.178 ✗ | 0.225 | weak |
| HC margin | 0.179 ✗ | 0.156 ✗ | 0.168 | weak |
| Δw + HC | 0.261 ~ p<.10 | 0.232 ✗ | 0.299 | meaningful |
| peak.stars | -0.002 ✗ | -0.010 ✗ | 0.052 | weak |
| vault.star | -0.138 ✗ | -0.058 ✗ | 0.047 | weak |
| lock.stars | 0.088 ✗ | 0.067 ✗ | 0.165 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 39 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | — | N=6 · 3-2 · 60% [23–88] · +12%  | N=2 · 2-0 · 100% [34–100] · — ★ | N=1 · 1-0 · 100% [21–100] · —  |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=4 · 1-3 · 25% [5–70] · -51%  | N=11 · 8-3 · 73% [43–90] · +40%  | N=6 · 2-4 · 33% [10–70] · -18%  | N=4 · 3-1 · 75% [30–95] · +30%  |
| +2 | — | — | — | — | — | — | N=2 · 2-0 · 100% [34–100] · — ★ |
| ≥ +3 | — | — | — | — | — | — | — |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 9 | 6-2-1 | 75.0% [41–93] | +39.4% | +3.6u | 1.39 ✗ noise |
| HC = +1 | 26 | 14-12-0 | 53.8% [35–71] | +6.0% | -2.3u | 0.30 ✗ noise |
| HC = +2 | 2 | 2-0-0 | 100.0% [34–100] | +96.2% | +6.7u | 104.00 ✓ p<.01 |
| HC ≥ +3 | 0 | — | — | — | — | — |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 4 | 1-3-0 | 25.0% [5–70] | -51.0% | -1.6u | -1.04 ✗ noise |
| Δw = +1 | 17 | 11-5-1 | 68.8% [44–86] | +30.3% | +1.8u | 1.38 ✗ noise |
| Δw = +2 | 8 | 4-4-0 | 50.0% [22–78] | +10.4% | -4.3u | 0.24 ✗ noise |
| Δw ≥ +3 | 9 | 6-3-0 | 66.7% [35–88] | +23.1% | +9.7u | 0.73 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 28 | 16-12-0 | 57.1% [39–73] | +12.4% | +4.4u | 0.64 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 5 | 3-2-0 | 60.0% [23–88] | +16.8% | +0.4u | 0.35 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 6 | 3-2-1 | 60.0% [23–88] | +11.7% | -0.3u | 0.31 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 117 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -1.8u | 0.00 ✗ noise |
| Δcount = −1 | 7 | 2-5-0 | 28.6% [8–64] | -48.8% | -5.2u | -1.46 ✗ noise |
| Δcount = 0 (balanced) | 19 | 3-16-0 | 15.8% [6–38] | -67.7% | -18.4u | -3.81 ✓ p<.01 |
| Δcount = +1 | 37 | 22-15-0 | 59.5% [43–74] | +11.7% | -4.0u | 0.74 ✗ noise |
| Δcount = +2 | 26 | 16-10-0 | 61.5% [43–78] | +17.9% | +10.0u | 0.94 ✗ noise |
| Δcount ≥ +3 (heavy support) | 25 | 19-5-1 | 79.2% [60–91] | +74.6% | +25.1u | 2.90 ✓ p<.01 |

**ρ(Δcount, WIN) = 0.400** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.474** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -1 · ≤ 3 · ≤ 6 · ≤ 14 · > 14

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 30 | 6-24-0 | 20.0% [10–37] | -57.7% | -24.8u | -3.56 ✓ p<.01 |
| Q2 | 21 | 12-9-0 | 57.1% [37–76] | +15.7% | -4.8u | 0.69 ✗ noise |
| Q3 (balanced) | 21 | 12-9-0 | 57.1% [37–76] | +19.3% | +4.5u | 0.76 ✗ noise |
| Q4 | 22 | 15-7-0 | 68.2% [47–84] | +42.1% | +16.6u | 1.51 ✗ noise |
| Q5 (best — heavy support) | 23 | 17-5-1 | 77.3% [57–90] | +39.4% | +14.1u | 2.35 ✓ p<.05 |

**ρ(ΔWlNet, WIN) = 0.383** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.325** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -1.14 · ≤ 2.76 · ≤ 6.77 · ≤ 13.21 · > 13.21

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 24 | 4-20-0 | 16.7% [7–36] | -66.9% | -20.4u | -4.27 ✓ p<.01 |
| Q2 | 23 | 11-12-0 | 47.8% [29–67] | -10.9% | -12.0u | -0.54 ✗ noise |
| Q3 | 25 | 13-12-0 | 52.0% [33–70] | +1.8% | +1.5u | 0.09 ✗ noise |
| Q4 | 22 | 16-6-0 | 72.7% [52–87] | +51.9% | +14.4u | 2.23 ✓ p<.05 |
| Q5 | 23 | 18-4-1 | 81.8% [61–93] | +65.5% | +22.2u | 2.69 ✓ p<.01 |

**ρ(ΔFlatPnl, WIN) = 0.414** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.436** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -14.2 · ≤ 13.3 · ≤ 20.7 · ≤ 31.5 · > 31.5

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 24 | 5-19-0 | 20.8% [9–40] | -49.7% | -16.9u | -2.27 ✓ p<.05 |
| Q2 | 26 | 6-19-1 | 24.0% [11–43] | -51.7% | -24.6u | -3.18 ✓ p<.01 |
| Q3 | 21 | 15-6-0 | 71.4% [50–86] | +35.3% | +10.0u | 1.79 ~ p<.10 |
| Q4 | 23 | 16-7-0 | 69.6% [49–84] | +30.3% | +6.2u | 1.54 ✗ noise |
| Q5 | 23 | 20-3-0 | 87.0% [68–95] | +84.1% | +31.1u | 3.64 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.498** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.465** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 14 | 2-12-0 | 14.3% [4–40] | -67.5% | -13.8u | -3.05 ✓ p<.01 |
| ΔBestRank ∈ [−4,−1] | 5 | 0-5-0 | 0.0% [0–43] | -100.0% | -6.7u | 0.00 ✗ noise |
| ΔBestRank = 0 (tied) | 0 | — | — | — | — | — |
| ΔBestRank ∈ [+1,+4] | 9 | 3-6-0 | 33.3% [12–65] | -37.5% | -6.7u | -1.20 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 12 | 6-5-1 | 54.5% [28–79] | +25.1% | +0.8u | 0.65 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.422** ✓ p<.01  ·  **ρ(ΔBestRank, flat ROI) = 0.424** ✓ p<.01  (N=40)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 12 | 2-10-0 | 16.7% [5–45] | -62.6% | -10.8u | -2.47 ✓ p<.05 |
| Δshare ∈ [−30,−10] pp | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.0u | 0.00 ✗ n<2 |
| Δshare ≈ 0 (±10 pp) | 71 | 33-37-1 | 47.1% [36–59] | -12.9% | -26.2u | -1.16 ✗ noise |
| Δshare ∈ [+10,+30] pp | 6 | 5-1-0 | 83.3% [44–97] | +113.6% | +12.4u | 2.11 ✓ p<.05 |
| Δshare ≥ +30 pp | 27 | 22-5-0 | 81.5% [63–92] | +71.1% | +33.3u | 3.26 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.345** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.327** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **Δcount** | 0.400 ✓ p<.01 | 0.474 ✓ p<.01 | 0.406 |
| 2 | **ΔAvgRoi** | 0.498 ✓ p<.01 | 0.465 ✓ p<.01 | 0.458 |
| 3 | **ΔTopQCount** | 0.401 ✓ p<.01 | 0.455 ✓ p<.01 | 0.411 |
| 4 | **ΔFlatPnl** | 0.414 ✓ p<.01 | 0.436 ✓ p<.01 | 0.409 |
| 5 | **ΔTopQShare** | 0.345 ✓ p<.01 | 0.327 ✓ p<.01 | 0.390 |
| 6 | **ΔWlNet** | 0.383 ✓ p<.01 | 0.325 ✓ p<.01 | 0.338 |

_(ΔBestRank uses N=40 subset where both sides had a proven wallet — ρ(flat ROI) = 0.424 ✓ p<.01.)_

---

## §AGS. Aggregate Score deep dive (point-in-time / out-of-sample)
_Which of the six AGS inputs are pulling the weight, and is the composite earning its place vs. its parts? Numbers below are leakage-free (PIT proven gate + walk-forward calibration)._

### §AGS-0. What AGS is, in one paragraph

AGS aggregates the proven-wallet (`CONFIRMED` ∪ `FLAT`) slice of `peak.v8Scoring.walletDetails[]` into 6 *delta* features (FOR-side minus AGAINST-side), z-scores each one against a daily-recomputed calibration, and **sums the z-scores**. Equal sign-weighted — no fitted coefficients. Thresholds: `AGS ≥ +5` rescues a lock (route C), `AGS ≥ +3` confirms a thin Δw=+1 lock (v7.5 route B), `AGS < -1` mutes an otherwise-locking side (confirmation gate). Sizing multiplier scales [0.5, 1.0]× over [-1, +5].

**In-sample (live production) calibration**: source = `cron`, sampleSize = 117, dateRange = 2026-04-18 → 2026-05-09, computedAt = 2026-05-10T14:08:15.690Z. _This is what production scores against today; the §AGS-0a audit below shows how much its in-sample numbers diverge from the leakage-free walk-forward version._

### §AGS-0a. Leakage audit — in-sample vs point-in-time / out-of-sample

Two sources of leakage existed in the prior version of this section: (1) a wallet was treated as "proven" if it currently has CONFIRMED/FLAT tier, even for picks made before it earned that status; (2) the AGS calibration normalizers (and the +5/+3/-1 thresholds tuned against them) were computed on data that overlaps with the test sample. The PIT/OOS pass replaces both: it uses a chronological tier lens (proven gate fires only on events strictly prior to the pick date) and walk-forward calibration (mean/SD per feature recomputed at each pick date from prior picks only, cold-started from live calibration when prior N < 30).

Coverage: in-sample AGS computable on **117** rows · PIT aggregate computable on **125** rows (the proven wallet count drops because some wallets weren't yet proven on those early dates) · PIT walk-forward AGS computed on **125** rows (34 used the cold-start fallback calibration for the early dates).

Same rows, same outcomes — only the AGS scoring lens differs:

| Tier | In-sample N · WR · ROI | PIT-OOS N · WR · ROI | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| ELITE (≥+7) | 4 · 100% · +154.4% | 6 · 67% · +18.9% | -135.6pp |
| LOCK (+5..+7) | 11 · 100% · +98.5% | 18 · 67% · +24.6% | -73.9pp |
| STRONG (+3..+5) | 21 · 71% · +36.3% | 18 · 72% · +39.3% | +3.0pp |
| NEUTRAL (0..+3) | 24 · 50% · -0.8% | 20 · 45% · -15.0% | -14.2pp |
| WEAK (−3..0) | 13 · 50% · -9.7% | 20 · 35% · -30.5% | -20.8pp |
| FADE (<−3) | 29 · 17% · -65.4% | 20 · 42% · +3.4% | +68.8pp |

Production-threshold lift (the rules that actually fire):

| Floor | In-sample fire | PIT-OOS fire | Δ ROI (OOS − in-sample) |
|---|---|---|---|
| AGS ≥ +5 (lock-floor route C) | N=15, WR=100%, ROI=+113.4% | N=24, WR=67%, ROI=+23.2% | -90.2pp |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=36, WR=83%, ROI=+68.4% | N=42, WR=69%, ROI=+30.1% | -38.4pp |
| AGS < −1 (mute veto) | N=37, WR=25%, ROI=-51.5% | N=35, WR=38%, ROI=-14.8% | +36.8pp |

_Reading: a large negative Δ in the LOCK / STRONG rows = the in-sample numbers were optimistically inflated by leakage. A small Δ = the original analysis was directionally honest. The PIT-OOS numbers are what the engine would have produced if every pick had been scored at the moment it was made._

#### §AGS-0a-recent. Last-14-days holdout (PIT-OOS, 2026-04-26 → 2026-05-09, N=59)

The cleanest out-of-sample window — every pick here was scored against a walk-forward calibration computed entirely from prior dates (no cold-start fallback in this slice).

| Tier | N · WR · ROI |
|---|---|
| ELITE (≥+7) | 6 · 67% · +18.9% |
| LOCK (+5..+7) | 12 · 67% · +25.1% |
| STRONG (+3..+5) | 11 · 73% · +45.6% |
| NEUTRAL (0..+3) | 11 · 55% · -0.0% |
| WEAK (−3..0) | 11 · 36% · -30.9% |
| FADE (<−3) | 8 · 38% · -23.3% |

| Floor | Fire (PIT-OOS, last 14d) |
|---|---|
| AGS ≥ +5 (lock-floor route C) | N=18, WR=67%, ROI=+23.0% |
| AGS ≥ +3 (Δw=+1 confirm route B) | N=29, WR=69%, ROI=+31.6% |
| AGS < −1 (mute veto) | N=17, WR=41%, ROI=-19.2% |

#### Reference: in-sample calibration normalizers (used only as cold-start fallback during PIT walk-forward)

| Feature key | Family | Sign | Cal mean | Cal SD |
|---|---|---|---|---|
| `dCount` | TOTAL | + | 1.42 | 1.55 |
| `dContribution` | TOTAL | + | 84.33 | 91.27 |
| `dBestContrib` | CONCENTRATION | + | 42.55 | 46.84 |
| `dBestWalletBase` | CONCENTRATION | + | 39.82 | 39.66 |
| `dConvictionAvg` | BLENDED | + | 0.56 | 0.66 |
| `dRoiNormAvg` | BLENDED | + | 34.80 | 39.26 |

### §AGS-1. Coverage + distribution

PIT-OOS AGS computable on **125/151** shipped+graded rows (83%). Rows drop out for two reasons: missing frozen `walletDetails[]` (older docs), or no wallet on either side was yet proven on this pick's date under the strict-prior PIT lens.

| Stat | AGS value |
|---|---|
| Min | -13.94 |
| 20th pct | -2.77 |
| 40th pct | 0.75 |
| Median | 2.21 |
| 60th pct | 2.80 |
| 80th pct | 5.02 |
| 90th pct | 6.31 |
| Max | 11.06 |

**Tier counts (boundaries set in `src/lib/ags.js → agsTierFromValue`):**

| Tier | Range | N | Share |
|---|---|---|---|
| **ELITE** | ≥ +7 | 6 | 4.8% |
| **LOCK** | +5..+7 | 20 | 16.0% |
| **STRONG** | +3..+5 | 20 | 16.0% |
| **NEUTRAL** | 0..+3 | 36 | 28.8% |
| **WEAK** | −3..0 | 22 | 17.6% |
| **FADE** | < −3 | 21 | 16.8% |

### §AGS-2. AGS tier × outcome — does the ladder pay?

If the AGS calibration is right, win-rate and flat ROI should rise monotonically up the tier ladder. Sample sizes inside FADE/ELITE will be thin — read the directional signal, not the point estimate.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ELITE | 6 | 4-2-0 | 66.7% [30–90] | +18.9% | +3.6u | 0.48 ✗ noise |
| LOCK | 20 | 13-7-0 | 65.0% [43–82] | +22.4% | +8.0u | 1.06 ✗ noise |
| STRONG | 20 | 14-6-0 | 70.0% [48–85] | +35.3% | +8.8u | 1.70 ~ p<.10 |
| NEUTRAL | 36 | 13-22-1 | 37.1% [23–54] | -27.7% | -10.8u | -1.75 ~ p<.10 |
| WEAK | 22 | 7-15-0 | 31.8% [16–53] | -36.8% | -6.2u | -1.80 ~ p<.10 |
| FADE | 21 | 8-12-1 | 40.0% [22–61] | -1.5% | -10.9u | -0.05 ✗ noise |

### §AGS-3. Per-feature univariate predictive power

Each of the 6 inputs evaluated on its own. `r(WIN)` and `r(ROI)` are the Pearson correlations against win-binary and flat profit; Spearman ρ is the rank-based version (robust to fat tails). The bucketed table partitions on the z-scored feature using the active calibration so a "z ≥ +1" row is exactly what the production AGS sees as a strongly positive contribution.

#### `dCount` (TOTAL)

r(WIN) = **0.164** ~ p<.10 · r(ROI) = **0.047** ✗ · Spearman ρ(ROI) = **0.086**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 12 | 4-8-0 | 33.3% [14–61] | +4.5% | -6.7u | 0.09 ✗ noise |
| z ∈ [−1, 0) | 45 | 21-22-2 | 48.8% [35–63] | -5.7% | -3.4u | -0.39 ✗ noise |
| z ∈ [0, +1) | 46 | 21-25-0 | 45.7% [32–60] | -11.4% | -6.1u | -0.78 ✗ noise |
| z ≥ +1 (very positive) | 22 | 13-9-0 | 59.1% [39–77] | +6.9% | +8.5u | 0.34 ✗ noise |

#### `dContribution` (TOTAL)

r(WIN) = **0.225** ✓ p<.05 · r(ROI) = **0.086** ✗ · Spearman ρ(ROI) = **0.141**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 11 | 3-7-1 | 30.0% [11–60] | -1.0% | -6.3u | -0.02 ✗ noise |
| z ∈ [−1, 0) | 42 | 16-25-1 | 39.0% [26–54] | -22.6% | -13.6u | -1.48 ✗ noise |
| z ∈ [0, +1) | 45 | 24-21-0 | 53.3% [39–67] | +5.9% | +8.7u | 0.39 ✗ noise |
| z ≥ +1 (very positive) | 27 | 16-11-0 | 59.3% [41–75] | +4.6% | +3.6u | 0.26 ✗ noise |

#### `dBestContrib` (CONCENTRATION)

r(WIN) = **0.283** ✓ p<.01 · r(ROI) = **0.158** ~ p<.10 · Spearman ρ(ROI) = **0.271**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 12 | 3-9-0 | 25.0% [9–53] | -17.6% | -6.9u | -0.35 ✗ noise |
| z ∈ [−1, 0) | 32 | 13-18-1 | 41.9% [26–59] | -18.8% | -14.5u | -1.07 ✗ noise |
| z ∈ [0, +1) | 61 | 27-33-1 | 45.0% [33–58] | -13.8% | -1.4u | -1.11 ✗ noise |
| z ≥ +1 (very positive) | 20 | 16-4-0 | 80.0% [58–92] | +53.9% | +15.2u | 2.92 ✓ p<.01 |

#### `dBestWalletBase` (CONCENTRATION)

r(WIN) = **0.233** ✓ p<.01 · r(ROI) = **0.136** ✗ · Spearman ρ(ROI) = **0.266**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 17 | 5-12-0 | 29.4% [13–53] | -23.1% | -7.8u | -0.63 ✗ noise |
| z ∈ [−1, 0) | 31 | 13-17-1 | 43.3% [27–61] | -16.0% | -9.6u | -0.90 ✗ noise |
| z ∈ [0, +1) | 55 | 24-31-0 | 43.6% [31–57] | -16.0% | -10.4u | -1.20 ✗ noise |
| z ≥ +1 (very positive) | 22 | 17-4-1 | 81.0% [60–92] | +54.3% | +20.2u | 3.23 ✓ p<.01 |

#### `dConvictionAvg` (BLENDED)

r(WIN) = **0.207** ✓ p<.05 · r(ROI) = **0.091** ✗ · Spearman ρ(ROI) = **0.188**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 14 | 3-11-0 | 21.4% [8–48] | -29.4% | -8.5u | -0.67 ✗ noise |
| z ∈ [−1, 0) | 30 | 14-15-1 | 48.3% [31–66] | -11.1% | -8.6u | -0.63 ✗ noise |
| z ∈ [0, +1) | 69 | 35-33-1 | 51.5% [40–63] | +0.6% | +10.1u | 0.05 ✗ noise |
| z ≥ +1 (very positive) | 12 | 7-5-0 | 58.3% [32–81] | +10.9% | -0.5u | 0.38 ✗ noise |

#### `dRoiNormAvg` (BLENDED)

r(WIN) = **0.210** ✓ p<.05 · r(ROI) = **0.088** ✗ · Spearman ρ(ROI) = **0.196**.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| z < −1 (very negative) | 14 | 3-11-0 | 21.4% [8–48] | -29.4% | -12.3u | -0.67 ✗ noise |
| z ∈ [−1, 0) | 33 | 14-18-1 | 43.8% [28–61] | -16.9% | -6.8u | -0.98 ✗ noise |
| z ∈ [0, +1) | 60 | 31-29-0 | 51.7% [39–64] | +0.5% | +16.0u | 0.04 ✗ noise |
| z ≥ +1 (very positive) | 18 | 11-6-1 | 64.7% [41–83] | +20.4% | -4.5u | 0.93 ✗ noise |

#### §AGS-3 recap — features sorted by univariate predictive power (|Spearman ρ vs. ROI|)

| Rank | Feature | Family | r(WIN) | r(ROI) | Spearman ρ |
|---|---|---|---|---|---|
| 1 | `dBestContrib` | CONCENTRATION | 0.283 ✓ p<.01 | 0.158 ~ p<.10 | 0.271 |
| 2 | `dBestWalletBase` | CONCENTRATION | 0.233 ✓ p<.01 | 0.136 ✗ | 0.266 |
| 3 | `dRoiNormAvg` | BLENDED | 0.210 ✓ p<.05 | 0.088 ✗ | 0.196 |
| 4 | `dConvictionAvg` | BLENDED | 0.207 ✓ p<.05 | 0.091 ✗ | 0.188 |
| 5 | `dContribution` | TOTAL | 0.225 ✓ p<.05 | 0.086 ✗ | 0.141 |
| 6 | `dCount` | TOTAL | 0.164 ~ p<.10 | 0.047 ✗ | 0.086 |

### §AGS-4. Per-feature contribution to the AGS score itself

A feature with mean |z| ≈ 0 contributes almost nothing to AGS in practice — even if it correlates with outcome, the calibration normalizes it down to silence. This is the "is the input even moving the dial" check. **Share of |AGS|** = mean |z| ÷ Σ mean |z|, the average percentage of the absolute AGS magnitude this feature accounts for.

| Rank | Feature | Mean signed z | Mean &#124;z&#124; | Share of &#124;AGS&#124; | Verdict |
|---|---|---|---|---|---|
| 1 | `dBestWalletBase` | +0.102 | 0.848 | 18.0% | dominant |
| 2 | `dContribution` | +0.275 | 0.793 | 16.8% | meaningful |
| 3 | `dCount` | +0.257 | 0.787 | 16.7% | meaningful |
| 4 | `dBestContrib` | +0.171 | 0.774 | 16.4% | meaningful |
| 5 | `dRoiNormAvg` | +0.110 | 0.762 | 16.2% | meaningful |
| 6 | `dConvictionAvg` | +0.096 | 0.753 | 16.0% | meaningful |

### §AGS-5. Pairwise feature correlation (Pearson r between z-scored features)

Two features with |r| ≥ 0.7 are double-counting. Two with |r| ≤ 0.2 are orthogonal — keeping both adds genuine information. The composite design assumes mostly orthogonal inputs; this matrix is the audit.

| | `dCount` | `dContribution` | `dBestContrib` | `dBestWalletBase` | `dConvictionAvg` | `dRoiNormAvg` |
|---|---|---|---|---|---|---|
| `dCount` | 1.000 | +0.903 ⚠ | +0.554 | +0.583 | +0.437 | +0.443 |
| `dContribution` | +0.903 ⚠ | 1.000 | +0.679 | +0.564 | +0.493 | +0.457 |
| `dBestContrib` | +0.554 | +0.679 | 1.000 | +0.866 ⚠ | +0.893 ⚠ | +0.786 ⚠ |
| `dBestWalletBase` | +0.583 | +0.564 | +0.866 ⚠ | 1.000 | +0.818 ⚠ | +0.898 ⚠ |
| `dConvictionAvg` | +0.437 | +0.493 | +0.893 ⚠ | +0.818 ⚠ | 1.000 | +0.764 ⚠ |
| `dRoiNormAvg` | +0.443 | +0.457 | +0.786 ⚠ | +0.898 ⚠ | +0.764 ⚠ | 1.000 |

_⚠ flags |r| ≥ 0.7 — those pairs are essentially the same signal._

### §AGS-6. Drop-one ablation — what happens if we remove each feature?

For each of the 6 inputs, recompute AGS as the **sum of the OTHER 5 z-scores** (each contribution preserved with its original sign), then evaluate three lenses. **The discriminative-power lens (Spearman ρ vs. outcome) is the cleanest** — a big drop in |ρ| means that feature carried marginal info the other five lacked. The cohort-matched lens compares apples-to-apples by holding cohort size fixed at the baseline lock-floor N. The same-threshold lens is included for transparency but read it with the caveat that removing a feature mechanically shrinks the cohort, so the surviving subset can look stronger purely from sample selection.

**Baseline (full 6-feature AGS):** Spearman ρ(AGS, flat ROI) = **0.246**. At AGS ≥ +5 fires N=26, WR=65.4%, ROI=+21.6%. At AGS ≥ +3 fires N=46, WR=67.4%, ROI=+27.5%.

| Feature dropped | ρ(5-feat AGS, ROI) | ρ drop vs full | Top-26 ROI (matched cohort) | Top-26 lift loss vs baseline | Same-threshold ≥+5 cell |
|---|---|---|---|---|---|
| `dCount` | +0.263 | +0.017 | WR=69%, ROI=+28.9% | -7.3pp | N=13, WR=69%, ROI=+25.4% |
| `dContribution` | +0.259 | +0.013 | WR=69%, ROI=+29.1% | -7.5pp | N=14, WR=79%, ROI=+44.1% |
| `dBestContrib` | +0.231 | −0.014 | WR=65%, ROI=+21.7% | -0.1pp | N=16, WR=63%, ROI=+11.5% |
| `dBestWalletBase` | +0.231 | −0.015 | WR=65%, ROI=+21.4% | +0.2pp | N=15, WR=67%, ROI=+23.5% |
| `dConvictionAvg` | +0.237 | −0.008 | WR=65%, ROI=+21.7% | -0.1pp | N=18, WR=61%, ROI=+14.2% |
| `dRoiNormAvg` | +0.228 | −0.018 | WR=69%, ROI=+29.3% | -7.8pp | N=17, WR=71%, ROI=+32.1% |

_Reading the **ρ drop** column: positive (`−0.0XX`) = dropping this feature **reduced** the AGS's ability to rank-order picks → the feature was carrying marginal info. Reading the **matched-cohort lift loss**: positive `+X pp` = the top-K of the 5-feature AGS earned LESS ROI than baseline → the feature was contributing positive lift._

#### §AGS-6 recap — features ranked by marginal info (Spearman ρ drop)

| Rank | Feature | ρ drop when removed | Matched-cohort lift loss | Verdict |
|---|---|---|---|---|
| 1 | `dRoiNormAvg` | −0.018 | -7.8pp | mild marginal info |
| 2 | `dBestWalletBase` | −0.015 | +0.2pp | mild marginal info |
| 3 | `dBestContrib` | −0.014 | -0.1pp | mild marginal info |
| 4 | `dConvictionAvg` | −0.008 | -0.1pp | mild marginal info |
| 5 | `dContribution` | +0.013 | -7.5pp | redundant — other features cover it |
| 6 | `dCount` | +0.017 | -7.3pp | redundant — other features cover it |

### §AGS-7. Multivariate logistic regression on the 6 z-scored features

Fit `logit(P(WIN)) = α + Σ βᵢ · zᵢ` on the AGS sample. Standardized inputs ⇒ |β| is a fair cross-feature importance signal. AGS itself uses **equal sign-weighted** sums (β=+1 for every feature); a fitted β much larger or smaller than 1 indicates the equal-weight assumption may be off for that input.

| Rank | Feature | Family | β (z-input) | |β| | Direction |
|---|---|---|---|---|---|
| 1 | `dBestContrib` | CONCENTRATION | +0.359 | 0.359 | positive ↑ |
| 2 | `dContribution` | TOTAL | +0.218 | 0.218 | positive ↑ |
| 3 | `dCount` | TOTAL | -0.133 | 0.133 | negative ↓ |
| 4 | `dBestWalletBase` | CONCENTRATION | +0.108 | 0.108 | positive ↑ |
| 5 | `dRoiNormAvg` | BLENDED | +0.053 | 0.053 | positive ↑ |
| 6 | `dConvictionAvg` | BLENDED | -0.032 | 0.032 | flat ≈ 0 |

Intercept b = -0.229 · Final log-loss = 0.6503 · N = 125.

### §AGS-8. Final ranked verdict — composite importance across all four lenses

Each feature gets a 1..6 rank in each lens (1 = most important). The **composite rank** is the average — lower is better. A feature that ranks low across all four lenses is a clear candidate to drop or down-weight; a feature that ranks high across all four is the engine's real workhorse.

| Composite rank | Feature | Family | Univariate (§AGS-3) | Score-mover (§AGS-4) | Drop-one (§AGS-6) | Logistic (§AGS-7) | Avg rank |
|---|---|---|---|---|---|---|---|
| 1 | `dBestContrib` | CONCENTRATION | #1 | #4 | #3 | #1 | 2.25 |
| 2 | `dBestWalletBase` | CONCENTRATION | #2 | #1 | #2 | #4 | 2.25 |
| 3 | `dContribution` | TOTAL | #5 | #2 | #5 | #2 | 3.50 |
| 4 | `dRoiNormAvg` | BLENDED | #3 | #5 | #1 | #5 | 3.50 |
| 5 | `dCount` | TOTAL | #6 | #3 | #6 | #3 | 4.50 |
| 6 | `dConvictionAvg` | BLENDED | #4 | #6 | #4 | #6 | 5.00 |

#### Plain-English summary

- **Workhorse**: `dBestContrib` (CONCENTRATION) — ranks #1/#4/#3/#1 across the four lenses. Whatever else changes, this one stays.
- **Weakest contributor**: `dConvictionAvg` (BLENDED) — composite avg rank 5.00. Strong candidate to down-weight or drop in v9.
- **Redundant pairs (|r| ≥ 0.7)**: `dCount` ↔ `dContribution` (r=+0.90); `dBestContrib` ↔ `dBestWalletBase` (r=+0.87); `dBestContrib` ↔ `dConvictionAvg` (r=+0.89); `dBestContrib` ↔ `dRoiNormAvg` (r=+0.79); `dBestWalletBase` ↔ `dConvictionAvg` (r=+0.82); `dBestWalletBase` ↔ `dRoiNormAvg` (r=+0.90); `dConvictionAvg` ↔ `dRoiNormAvg` (r=+0.76). Each pair effectively double-counts the same signal in the composite.
- **v9 simplification candidate**: only `dBestContrib`, `dBestWalletBase`, `dRoiNormAvg` carry marginal info (Spearman ρ drop > 0.01 when removed). The other 3 features add roughly nothing on top — a 2- or 3-feature composite would likely match the 6-feature AGS's discriminative power. **Don't remove them yet** — at N=125 we lack the power to distinguish "redundant in this sample" from "redundant in the population." Revisit once the sample doubles.
- **In-sample calibration source**: `cron` (used as cold-start fallback for the first 34 of 125 PIT rows where prior history was thin). Live calibration is loaded; the means/SDs above are this morning's.
- **Look-ahead controls**: PIT proven gate (strict-prior-events tier lens) + walk-forward feature calibration (mean/SD per feature recomputed at each pick date from prior picks only, 34/125 cold-started). Production thresholds (+5/+3/-1) were tuned on overlapping data and are still treated as fixed constants here — the §AGS-0a leakage audit shows the true lift those thresholds deliver out-of-sample.

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 41 | 21-20-0 | 51.2% [36–66] | -9.6% | -4.1u | -0.66 ✗ noise |
| 4.5★ | 12 | 8-4-0 | 66.7% [39–86] | +41.9% | +9.3u | 1.20 ✗ noise |
| 4.0★ | 22 | 11-10-1 | 52.4% [32–72] | +6.0% | -2.8u | 0.27 ✗ noise |
| 3.5★ | 31 | 14-17-0 | 45.2% [29–62] | +2.0% | +0.1u | 0.09 ✗ noise |
| 3.0★ | 17 | 6-10-1 | 37.5% [18–61] | -21.7% | -4.5u | -0.89 ✗ noise |
| 2.5★ | 28 | 13-15-0 | 46.4% [30–64] | -11.1% | -4.1u | -0.60 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 1/0%/-100% | 4/0%/-100% | 5/20%/-58% | 9/38%/-26% | 12/25%/-51% |
| Δw = +1 | 1/100%/+27% | 3/33%/-35% | 11/60%/+15% | 22/50%/-1% | 2/0%/-100% | 10/60%/+9% |
| Δw = +2 | 18/39%/-22% | 2/100%/+94% | 6/67%/+46% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 17/59%/+1% | 3/100%/+153% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | — |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 6 | 5-1-0 | 83.3% [44–97] | +5.0% | +3.8u | 0.24 ✗ noise |
| −300/−201 | 5 | 2-3-0 | 40.0% [12–77] | -46.3% | -1.0u | -1.41 ✗ noise |
| −200/−151 | 11 | 3-8-0 | 27.3% [10–57] | -56.4% | -10.1u | -2.51 ✓ p<.05 |
| −150/−101 | 86 | 44-41-1 | 51.8% [41–62] | -1.4% | +4.0u | -0.14 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 31 | 16-14-1 | 53.3% [36–70] | +16.2% | -0.4u | 0.82 ✗ noise |
| +151/+200 | 2 | 1-1-0 | 50.0% [9–91] | +49.0% | -0.5u | 0.33 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +25% (3) |
| −300/−201 | -67% (4) | — | — | +34% (1) |
| −200/−151 | -100% (5) | +5% (3) | -100% (1) | -100% (1) |
| −150/−101 | -38% (20) | +14% (30) | -24% (20) | +47% (13) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +39% (3) | -15% (14) | +43% (9) | +42% (5) |
| +151/+200 | — | — | +198% (1) | — |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 81 | 36-45-0 | 44.4% [34–55] | -9.2% | -17.5u | -0.71 ✗ noise |
| SPREAD | 29 | 12-16-1 | 42.9% [27–61] | -16.4% | +1.9u | -0.92 ✗ noise |
| TOTAL | 41 | 25-15-1 | 62.5% [47–76] | +20.6% | +9.5u | 1.40 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=15 · 13% · -77% | N=26 · 46% · -14% | N=18 · 39% · -14% | N=19 · 68% · +54% |
| SPREAD | N=10 · 22% · -51% | N=7 · 29% · -45% | N=7 · 57% · +10% | N=4 · 75% · +46% |
| TOTAL | N=10 · 50% · -3% | N=17 · 75% · +42% | N=8 · 50% · -2% | N=4 · 75% · +47% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 47 | 19-28-0 | 40.4% [28–55] | -21.0% | -13.6u | -1.48 ✗ noise |
| NBA | 84 | 42-41-1 | 50.6% [40–61] | +1.5% | +3.1u | 0.12 ✗ noise |
| NHL | 20 | 12-7-1 | 63.2% [41–81] | +24.4% | +4.4u | 1.10 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=7 · 14% · -71% | N=19 · 42% · -19% | N=14 · 29% · -41% | N=6 · 83% · +63% |
| NBA | N=24 · 26% · -50% | N=20 · 60% · +14% | N=15 · 53% · +10% | N=20 · 65% · +44% |
| NHL | N=4 · 50% · -0% | N=11 · 60% · +10% | N=4 · 75% · +59% | N=1 · 100% · +145% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 94 · 43% · -10.8% · -0.93 ✗ noise | 56 · 57% · +8.8% · 0.69 ✗ noise |
| **plusEV** | 22 · 32% · -31.1% · -1.08 ✗ noise | 128 · 52% · +1.3% · 0.15 ✗ noise |
| **pinnacleConfirms** | 46 · 48% · -1.0% · -0.06 ✗ noise | 37 · 43% · -15.0% · -0.85 ✗ noise |
| **invested10kPlus** | 74 · 43% · -11.0% · -0.81 ✗ noise | 9 · 67% · +23.5% · 0.72 ✗ noise |
| **lineMovingWith** | 92 · 51% · +0.8% · 0.07 ✗ noise | 58 · 46% · -10.2% · -0.75 ✗ noise |
| **predMarketAligns** | 38 · 50% · -2.0% · -0.10 ✗ noise | 45 · 42% · -11.7% · -0.70 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 14 | 11-3-0 | 78.6% [52–92] | +53.1% | +8.4u | 2.31 ✓ p<.05 |
| 1 | 35 | 16-18-1 | 47.1% [31–63] | -9.9% | -1.0u | -0.62 ✗ noise |
| 2 | 45 | 22-22-1 | 50.0% [36–64] | +3.9% | +8.4u | 0.24 ✗ noise |
| 3 | 18 | 7-11-0 | 38.9% [20–61] | -31.8% | -13.0u | -1.49 ✗ noise |
| 4 | 17 | 5-12-0 | 29.4% [13–53] | -38.7% | -12.5u | -1.62 ✗ noise |
| 5 | 16 | 10-6-0 | 62.5% [39–82] | +4.3% | +3.5u | 0.20 ✗ noise |
| 6 | 6 | 2-4-0 | 33.3% [10–70] | +35.8% | +0.1u | 0.37 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 39 | 24-14-1 | 63.2% [47–77] | +14.9% | +11.5u | 1.02 ✗ noise |
| NEAR_START | 78 | 35-42-1 | 45.5% [35–57] | -3.5% | -6.0u | -0.26 ✗ noise |
| NO_MOVE | 6 | 2-4-0 | 33.3% [10–70] | -36.2% | -1.1u | -0.90 ✗ noise |
| PREGAME | 3 | 3-0-0 | 100.0% [44–100] | +73.3% | +4.8u | 3.20 ✓ p<.01 |
| SMALL_MOVE | 23 | 7-16-0 | 30.4% [16–51] | -39.9% | -17.7u | -1.98 ✓ p<.05 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 83 | 41-41-1 | 50.0% [39–61] | -6.5% | -2.7u | -0.62 ✗ noise |
| STRONG | 35 | 17-18-0 | 48.6% [33–64] | -5.6% | -0.9u | -0.33 ✗ noise |
| LEAN | 29 | 13-15-1 | 46.4% [30–64] | +11.0% | -3.7u | 0.41 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.096 ✗ | -0.028 ✗ | -0.082 | -0.34 |
| totalInvested | -0.149 ~ p<.10 | -0.132 ✗ | -0.081 | -1.63 |
| evEdge | 0.031 ✗ | 0.035 ✗ | 0.025 | 0.43 |
| moneyPct | 0.051 ✗ | -0.034 ✗ | 0.007 | -0.41 |
| walletPct | 0.125 ✗ | 0.081 ✗ | 0.094 | 0.99 |
| criteriaMet | -0.103 ✗ | -0.070 ✗ | -0.152 | -0.85 |
| maxContribFor | -0.020 ✗ | -0.005 ✗ | 0.031 | -0.07 |
| meanBaseFor | -0.045 ✗ | -0.029 ✗ | -0.011 | -0.35 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **143** picks. Mean CLV = **-0.0031**.
t-statistic vs zero: -2.29 → ✓ p<.05 · 95% CI [-0.0057, -0.0004]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 12 | 5-7-0 | 41.7% [19–68] | -29.3% | -3.5u | -1.15 ✗ noise |
| CLV (−2%, 0] | 80 | 39-39-2 | 50.0% [39–61] | -1.2% | +0.2u | -0.11 ✗ noise |
| CLV (0, +2%] | 40 | 20-20-0 | 50.0% [35–65] | +9.4% | -0.2u | 0.47 ✗ noise |
| CLV > +2% | 11 | 4-7-0 | 36.4% [15–65] | -37.7% | -8.8u | -1.39 ✗ noise |

ρ(CLV, flat ROI) = -0.029 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=40 (with all features non-null). Intercept β₀ = 0.620.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | pw.ΔAvgRoi | +0.677 | ↑ helps |
| 2 | evEdge | +0.615 | ↑ helps |
| 3 | pw.ΔWlNet | +0.605 | ↑ helps |
| 4 | pw.ΔFlatPnl | +0.541 | ↑ helps |
| 5 | pw.Δcount | +0.447 | ↑ helps |
| 6 | sharpCount | -0.410 | ↓ hurts |
| 7 | walletPct | -0.367 | ↓ hurts |
| 8 | odds (American) | -0.309 | ↓ hurts |
| 9 | vault.star | -0.287 | ↓ hurts |
| 10 | pw.ΔTopQShare | +0.257 | ↑ helps |
| 11 | peak.stars | -0.251 | ↓ hurts |
| 12 | log(impliedProb) | +0.168 | ↑ helps |
| 13 | log10(invested) | -0.154 | ↓ hurts |
| 14 | criteriaMet | -0.119 | ↓ hurts |
| 15 | HC margin | -0.056 | ↓ hurts |
| 16 | Δw | +0.039 | ≈ flat |
| 17 | Δw + HC | +0.010 | ≈ flat |
| 18 | moneyPct | +0.002 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 2 | 2-0 | 100.0% | 58.3% | -103 | 7.71% bankroll | 3.50u | **UNDER-SIZED** — ship up to 7.71u (1u=1% bankroll) |
| Tier-1b HC = +1 (post-cutover) | 26 | 14-12 | 53.8% | 52.8% | -105 | 1.60% bankroll | 1.64u | ~ in range — 1.60u |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 5 | 3-2 | 60.0% | 53.3% | -105 | 2.17% bankroll | 1.65u | ~ in range — 2.17u |
| Δw ≥ +3 (full sample) | 27 | 19-8 | 70.4% | 64.9% | -105 | 13.99% bankroll | 2.37u | **UNDER-SIZED** — ship up to 13.99u (1u=1% bankroll) |
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
| 2026-05-06 | 2 | 2-0 | +4.8u | -16.8u |
| 2026-05-07 | 1 | 1-0 | +0.7u | -16.1u |
| 2026-05-08 | 5 | 3-2 | +4.5u | -11.6u |
| 2026-05-09 | 4 | 4-0 | +5.5u | -6.1u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -28.6u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 4
**Daily Sharpe-like (μ/σ):** -0.069  (annualized × √252 ≈ -1.10)

---

## §14. Per-pick row-level detail (every shipped+graded pick)
_Sortable raw data behind every section. Use to spot-check individual decisions._

| Date | Sport | Mkt | Side | ★ | u | Odds | Δw | HC | Δw+HC | pw.Δcnt | pw.ΔWl | EV | Outcome | Peak PnL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.50 | +105 | 2 | — | — | 2 | 6 | 0.00 | W | +0.5u |
| 2026-04-18 | MLB | ML | away | 4.5 | 2.50 | -155 | — | — | — | — | — | -1.60 | W | +1.6u |
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.50 | -117 | 2 | — | — | 2 | 6 | 0.00 | L | -0.5u |
| 2026-04-18 | MLB | ML | home | 4.5 | 3.00 | -150 | 3 | — | — | 3 | 8 | -0.20 | W | +2.0u |
| 2026-04-18 | NBA | ML | away | 3.5 | 0.50 | +200 | — | — | — | — | — | -0.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.50 | -108 | 0 | — | — | 0 | 0 | -2.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1.00 | -108 | 0 | — | — | 0 | -3 | -1.70 | L | -1.0u |
| 2026-04-18 | NBA | TOTAL | over | 3.0 | 0.75 | -107 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-18 | NBA | TOTAL | under | 5.0 | 2.00 | -104 | — | — | — | — | — | 0.00 | W | +1.9u |
| 2026-04-18 | NBA | ML | home | 5.0 | 3.00 | -360 | — | — | — | — | — | 0.20 | W | +0.8u |
| 2026-04-18 | NBA | TOTAL | under | 4.5 | 1.50 | -105 | — | — | — | — | — | 0.00 | L | -1.5u |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 0 | 0 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 3 | 8 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 1 | 4 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 3 | 8 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 1 | 8 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 4 | 5 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 1 | 6 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 2 | 4 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | 1 | 2 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 1 | 2 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | -1 | -4 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | -1 | -10 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 2 | 13 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 1 | 6 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | -1 | -2 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | -2 | -13 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 1 | 1 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 2 | 9 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | — | — | 1 | 6 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | — | — | 2 | -1 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | — | — | 2 | 6 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | — | — | 2 | 9 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | — | — | 0 | 0 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | — | — | 0 | 0 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | — | — | 0 | 0 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | — | — | 0 | 0 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | — | — | 0 | 0 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | — | — | 0 | 0 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | 0 | -5 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | -3 | -10 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | 0 | -1 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 1 | 6 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 6 | 10 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 3 | 12 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 1 | 6 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | 0 | -3 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | -1 | -4 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | 0 | -1 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | 1 | 2 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 0 | -2 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 2 | 8 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 2 | 10 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 0 | 0 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -2 | -6 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 1 | 0 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 6 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | -1 | -2 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 5 | 14 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 2 | 10 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | 9 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | -1 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 1 | 3 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 1 | 22 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 3 | 24 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 3 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 19 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 1 | 3 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 0 | 0 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 0 | 0 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | 0 | -19 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 3 | 6 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 0 | -16 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 0 | 1 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | 6 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 0 | 0 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 1 | 8 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 3 | 29 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 1 | 3 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 0 | -15 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 1 | 15 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | 0 | -4 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 0 | 0 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 0 | -13 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 1 | 19 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 4 | 27 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 2 | 28 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 0 | 0 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 1 | 2 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 3 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 0 | 0 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 3 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 0 | -6 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 4 | 14 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 18 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 2 | 8 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 0 | 12 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 1 | 4 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 1 | 5 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 2 | 8 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 6 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | -1 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 0 | -28 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 2 | 6 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 0 | -1 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 0 | 0 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 2 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 0 | 0 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 3 | -7 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 1 | 20 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 3 | 9 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 1 | 3 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 2 | 20 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | 0 | -4 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 0 | -1 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 19 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 7 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 19 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | -1 | -2 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 39 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 4 | 10 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 3 | -5 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 2 | 3 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 4 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 4 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 4 | 16 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 1 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 24 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 4 | 21 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 1 | 3 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 1 | 2 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 3 | 31 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 4 | 36 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 22 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 0 | 0 | -1.30 | L | -1.1u |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.70 | -104 | — | — | — | 2 | 17 | 0.00 | W | +1.6u |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 1 | 2 | 1 | 4 | 0.00 | W | +0.7u |
| 2026-05-09 | NBA | ML | away | 5.0 | 4.50 | -364 | 3 | 1 | 4 | 5 | 31 | 0.00 | W | +1.2u |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2.00 | -104 | 2 | 1 | 3 | 2 | 22 | 0.00 | W | +1.9u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._