# Sharp Intel v6 — Full Analysis

_Auto-generated **5/9/2026, 9:26:10 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 147 shipped+graded picks · 2026-04-18 → 2026-05-08  (HC analyses scoped to post-cutover 2026-04-30, 36 picks)
**Headline:** 69-76-2 · WR 47.6% [39.6%–55.7%] vs 52.4% break-even · -6.9u flat (-4.7%) · -11.6u peak.
**Overall t-test:** t = -0.53 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The two real engine-signals are **Δw** (proven-roster directional consensus) and **HC** (high-conviction-wallet margin, post-cutover). Univariate correlations:

- **ρ(Δw, flat ROI) = 0.300 ✓ p<.01**  (full sample, N=142)
- **ρ(HC, flat ROI) = 0.137 ✗**  (post-cutover, N=36)
- **ρ(Δw+HC, flat ROI) = 0.230 ✗**  (post-cutover, N=36)

Cohort breakdown:

**Winning cohorts (t ≥ 1.645 with positive mean):**
- **Tier-1a HC ≥ +2 (post-cutover)** — N=2, 2-0, WR 100.0% [34%–100%], flat ROI +96.2% (t=104.00 ✓ p<.01)
- **Δw ≥ +3 (full sample)** — N=26, 18-8, WR 69.2% [50%–83%], flat ROI +52.7% (t=1.98 ✓ p<.05)

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0 (full sample)** — N=35, 9-25, WR 26.5% [15%–43%], flat ROI -48.6% (t=-3.41 ✓ p<.01)

### Action map

- **Tier-1a (HC ≥ +2)** — N=2, WR 100.0%, flat ROI +96.2%. Bayesian posterior WR ≈ 58.3%, half-Kelly = **6.3%** bankroll at −110 → **size aggressively**.
- **Tier-1b (HC = +1)** — N=23, WR 47.8%, flat ROI -2.7%. Bayesian posterior WR ≈ 48.5%, half-Kelly = **0.0%** bankroll at −110.
- **Tier-2 (HC ≤ 0 ∧ Δw ≥ +2, HC era)** — N=5, WR 60.0%, flat ROI +16.8%. Δw saves the pick when HC is silent.
- **Δw ≥ +3 (full sample)** — N=26, WR 69.2%, flat ROI +52.7%. Bayesian posterior WR ≈ 63.9%, half-Kelly = **12.1%** bankroll at −110.
- **Stale Δw ≤ 0 (full sample)** — -48.6% flat ROI on 35 picks. Already muted by v7.x; should not re-appear.
- **Sample size:** at observed σ (1.08u/pick), we need **~1778 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 147. Cohort findings — especially HC subsets — are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-08 |
| Sides scanned | 345 |
| Shipped + graded | **147** |
| W-L-P | 69-76-2 |
| Win rate | **47.6%** [39.6%–55.7%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +4.8 pp |
| Peak-units PnL | **-11.6u** |
| Flat-1u PnL | **-6.9u** (-4.7% flat ROI) |
| Flat t-statistic vs zero | -0.53 → ✗ noise |
| Flat 95% CI per-pick | [-0.221, 0.127]u |

### Power note

At our observed flat-PnL standard deviation (1.08u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 4938 |
| +5% | 1778 |
| +10% | 445 |

We have **147** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen, full sample)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 7 | 1-6-0 | 14.3% [3–51] | -70.6% | -5.6u | -2.40 ✓ p<.05 |
| Δw = 0 | 27 | 8-18-1 | 30.8% [17–50] | -41.1% | -15.0u | -2.45 ✓ p<.05 |
| Δw = +1 | 49 | 25-23-1 | 52.1% [38–66] | -1.1% | -3.5u | -0.08 ✗ noise |
| Δw = +2 | 32 | 14-18-0 | 43.8% [28–61] | -9.1% | -10.0u | -0.49 ✗ noise |
| Δw ≥ +3 | 26 | 18-8-0 | 69.2% [50–83] | +52.7% | +20.6u | 1.98 ✓ p<.05 |

**Pearson ρ(Δw, WIN) = 0.277** ✓ p<.01  ·  **ρ(Δw, flat ROI) = 0.300** ✓ p<.01  (N=142)

### §2b. HC margin — high-conviction proven-wallet margin (post-cutover 2026-04-30)

HC = `hcConfFor − hcConfAg`. "High-conviction" wallets = `CONFIRMED` tier with `sizeRatio ≥ 1.5×` their own median bet. Pre-cutover picks have no HC stamp and are excluded from this analysis (no retro-fit).

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 9 | 6-2-1 | 75.0% [41–93] | +39.4% | +3.6u | 1.39 ✗ noise |
| HC = +1 | 23 | 11-12-0 | 47.8% [29–67] | -2.7% | -6.2u | -0.12 ✗ noise |
| HC = +2 | 2 | 2-0-0 | 100.0% [34–100] | +96.2% | +6.7u | 104.00 ✓ p<.01 |
| HC ≥ +3 | 0 | — | — | — | — | — |

**Pearson ρ(HC, WIN) = 0.152** ✗  ·  **ρ(HC, flat ROI) = 0.137** ✗  (N=36)

Spearman rank ρ(HC, flat ROI) = 0.143.

### §2c. Δw + HC — combined scalar (post-cutover only)

Sum of the two axes the engine actually relies on. Captures the v7.4 lock-floor logic (`HC ≥ +1` OR `Σ ≥ +5`) in a single ranked predictor.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Σ = +1 | 10 | 4-5-1 | 44.4% [19–73] | -13.4% | -1.9u | -0.44 ✗ noise |
| Σ = +2 | 14 | 9-5-0 | 64.3% [39–84] | +24.2% | -1.3u | 0.93 ✗ noise |
| Σ = +3 | 5 | 1-4-0 | 20.0% [4–62] | -40.4% | -7.0u | -0.68 ✗ noise |
| Σ = +4 | 2 | 2-0-0 | 100.0% [34–100] | +96.6% | +6.4u | 69.00 ✓ p<.01 |
| Σ = +5 | 2 | 1-1-0 | 50.0% [9–91] | -1.5% | -1.1u | -0.01 ✗ noise |
| Σ ≥ +6 | 2 | 2-0-0 | 100.0% [34–100] | +95.2% | +6.7u | 0.00 ✗ noise |

**Pearson ρ(Δw+HC, WIN) = 0.241** ✗  ·  **ρ(Σ, flat ROI) = 0.230** ✗  (N=36)

### §2d. Which axis is the strongest single predictor?

Comparison restricted to the post-cutover sample where every axis has a value (so the rows are apples-to-apples). N = 36.

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.188 ✗ | 0.184 ✗ | 0.228 | weak |
| HC margin | 0.152 ✗ | 0.137 ✗ | 0.143 | weak |
| Δw + HC | 0.241 ✗ | 0.230 ✗ | 0.282 | meaningful |
| peak.stars | -0.040 ✗ | -0.022 ✗ | 0.048 | weak |
| vault.star | -0.002 ✗ | 0.028 ✗ | 0.105 | weak |
| lock.stars | 0.016 ✗ | 0.029 ✗ | 0.134 | weak |

---

## §3. Bivariate HC × Δw matrix (post-cutover 2026-04-30 only)
_Each cell: N · W-L · WR% · Wilson 95% CI · flat ROI %. ★ flag = sig 95% one-sample t-test on flat PnL._

Universe N = 36 (post-cutover, both axes present).

| HC \ Δw | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | — | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | — | — | — | — | — | — | N=2 · 0-2 · 0% [0–66] · —  |
| +0 | — | — | — | — | N=6 · 3-2 · 60% [23–88] · +12%  | N=2 · 2-0 · 100% [34–100] · — ★ | N=1 · 1-0 · 100% [21–100] · —  |
| +1 | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=4 · 1-3 · 25% [5–70] · -51%  | N=10 · 7-3 · 70% [40–89] · +35%  | N=5 · 1-4 · 20% [4–62] · -40%  | N=3 · 2-1 · 67% [21–94] · +31%  |
| +2 | — | — | — | — | — | — | N=2 · 2-0 · 100% [34–100] · — ★ |
| ≥ +3 | — | — | — | — | — | — | — |

### §3b. Row totals (HC fixed, Δw collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| HC ≤ −2 | 0 | — | — | — | — | — |
| HC = −1 | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -3.5u | 0.00 ✗ noise |
| HC = 0 | 9 | 6-2-1 | 75.0% [41–93] | +39.4% | +3.6u | 1.39 ✗ noise |
| HC = +1 | 23 | 11-12-0 | 47.8% [29–67] | -2.7% | -6.2u | -0.12 ✗ noise |
| HC = +2 | 2 | 2-0-0 | 100.0% [34–100] | +96.2% | +6.7u | 104.00 ✓ p<.01 |
| HC ≥ +3 | 0 | — | — | — | — | — |

### §3c. Column totals (Δw fixed, HC collapsed)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 0 | — | — | — | — | — |
| Δw = −1 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.1u | 0.00 ✗ n<2 |
| Δw = 0 | 4 | 1-3-0 | 25.0% [5–70] | -51.0% | -1.6u | -1.04 ✗ noise |
| Δw = +1 | 16 | 10-5-1 | 66.7% [42–85] | +26.3% | +1.1u | 1.14 ✗ noise |
| Δw = +2 | 7 | 3-4-0 | 42.9% [16–75] | -1.9% | -6.3u | -0.04 ✗ noise |
| Δw ≥ +3 | 8 | 5-3-0 | 62.5% [31–86] | +22.6% | +8.5u | 0.63 ✗ noise |

### §3d. Practical lock zones (v7.4 floor anatomy)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Tier-1: HC ≥ +1 | 25 | 13-12-0 | 52.0% [33–70] | +5.2% | +0.5u | 0.25 ✗ noise |
| Tier-2: HC ≤ 0 ∧ Δw ≥ +2 | 5 | 3-2-0 | 60.0% [23–88] | +16.8% | +0.4u | 0.35 ✗ noise |
| No-ship zone: HC ≤ 0 ∧ Δw ≤ +1 | 6 | 3-2-1 | 60.0% [23–88] | +11.7% | -0.3u | 0.31 ✗ noise |

---

## §4. Proven-wallet feature predictors
_Even without HC / Δw, what do the *characteristics* of the proven wallets on each side tell us? Universe = `CONFIRMED ∪ FLAT` per sport. Δfeature = For-side − Against-side._

Universe N = 112 picks where ≥1 proven wallet appeared on either side.

### §4a. ΔCount — proven-wallet count differential

Crude version: do we win more often when the proven roster is *more numerous* on our side?

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δcount ≤ −2 (heavy oppose) | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -1.8u | 0.00 ✗ noise |
| Δcount = −1 | 9 | 2-7-0 | 22.2% [6–55] | -60.2% | -9.9u | -2.26 ✓ p<.05 |
| Δcount = 0 (balanced) | 17 | 3-14-0 | 17.6% [6–41] | -64.0% | -13.7u | -3.24 ✓ p<.01 |
| Δcount = +1 | 36 | 20-16-0 | 55.6% [40–70] | +4.2% | -5.7u | 0.26 ✗ noise |
| Δcount = +2 | 23 | 14-9-0 | 60.9% [41–78] | +16.3% | +6.9u | 0.80 ✗ noise |
| Δcount ≥ +3 (heavy support) | 24 | 18-5-1 | 78.3% [58–90] | +76.6% | +23.8u | 2.86 ✓ p<.01 |

**ρ(Δcount, WIN) = 0.415** ✓ p<.01  ·  **ρ(Δcount, flat ROI) = 0.492** ✓ p<.01

### §4b. ΔWlNet — sum-of-(wins − losses) across proven wallets on each side

Each proven wallet brings its own historical W − L record (in this sport). ΔWlNet is `Σwl(For) − Σwl(Ag)`. A high ΔWlNet means the wallets backing our side have collectively won far more games over their tracked history than the wallets backing the opposing side.

Quintile cuts: ≤ -2 · ≤ 3 · ≤ 6 · ≤ 10 · > 10

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 (worst — heavy oppose) | 23 | 5-18-0 | 21.7% [10–42] | -57.8% | -18.5u | -3.33 ✓ p<.01 |
| Q2 | 26 | 12-14-0 | 46.2% [29–65] | -2.3% | -10.4u | -0.11 ✗ noise |
| Q3 (balanced) | 22 | 12-10-0 | 54.5% [35–73] | +13.7% | +4.6u | 0.55 ✗ noise |
| Q4 | 19 | 13-6-0 | 68.4% [46–85] | +42.3% | +13.6u | 1.36 ✗ noise |
| Q5 (best — heavy support) | 22 | 15-6-1 | 71.4% [50–86] | +32.8% | +10.5u | 1.75 ~ p<.10 |

**ρ(ΔWlNet, WIN) = 0.365** ✓ p<.01  ·  **ρ(ΔWlNet, flat ROI) = 0.317** ✓ p<.01

### §4c. ΔFlatPnl — sum-of-flatPnL across proven wallets on each side

Same shape as §4b but using flatPnL (units) instead of W−L count. Captures which side has the *biggest cumulative-units winners* historically — slightly different from W−L because a 60%-WR low-volume wallet can have lower flatPnL than a 53%-WR high-volume wallet.

Quintile cuts (units): ≤ -1.14 · ≤ 2.76 · ≤ 6.51 · ≤ 11.97 · > 11.97

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 23 | 4-19-0 | 17.4% [7–37] | -65.5% | -19.7u | -4.02 ✓ p<.01 |
| Q2 | 24 | 10-14-0 | 41.7% [24–61] | -22.4% | -13.7u | -1.15 ✗ noise |
| Q3 | 23 | 12-11-0 | 52.2% [33–71] | +2.2% | +1.3u | 0.10 ✗ noise |
| Q4 | 20 | 15-5-0 | 75.0% [53–89] | +57.3% | +13.5u | 2.36 ✓ p<.05 |
| Q5 | 22 | 16-5-1 | 76.2% [55–89] | +58.3% | +18.3u | 2.20 ✓ p<.05 |

**ρ(ΔFlatPnl, WIN) = 0.399** ✓ p<.01  ·  **ρ(ΔFlatPnl, flat ROI) = 0.442** ✓ p<.01

### §4d. ΔAvgRoi — mean-of-flatRoi across proven wallets on each side

Normalizes for volume: a side with 5 sharp wallets averaging +20% ROI scores higher than a side with 5 sharp wallets averaging +3% ROI, even if the W−L counts are similar. Pure quality lens.

Quintile cuts (% ROI): ≤ -15.4 · ≤ 12.2 · ≤ 20.3 · ≤ 30.4 · > 30.4

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Q1 | 23 | 4-19-0 | 17.4% [7–37] | -64.6% | -23.8u | -3.87 ✓ p<.01 |
| Q2 | 22 | 5-17-0 | 22.7% [10–43] | -47.2% | -14.7u | -2.06 ✓ p<.05 |
| Q3 | 23 | 14-8-1 | 63.6% [43–80] | +24.7% | +0.7u | 1.20 ✗ noise |
| Q4 | 22 | 15-7-0 | 68.2% [47–84] | +25.1% | +7.1u | 1.29 ✗ noise |
| Q5 | 22 | 19-3-0 | 86.4% [67–95] | +83.7% | +30.4u | 3.46 ✓ p<.01 |

**ρ(ΔAvgRoi, WIN) = 0.485** ✓ p<.01  ·  **ρ(ΔAvgRoi, flat ROI) = 0.459** ✓ p<.01

### §4e. Sport-rank comparison — best rank on each side

For each pick we look up the BEST (lowest-numbered) sport rank among proven wallets on each side. ΔBestRank > 0 = our side has a *better* (lower-numbered) top wallet than the opposite side.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ΔBestRank ≤ −5 (we have worse #1 by ≥5) | 11 | 2-9-0 | 18.2% [5–48] | -58.6% | -9.6u | -2.11 ✓ p<.05 |
| ΔBestRank ∈ [−4,−1] | 6 | 0-6-0 | 0.0% [0–39] | -100.0% | -10.7u | 0.00 ✗ noise |
| ΔBestRank = 0 (tied) | 0 | — | — | — | — | — |
| ΔBestRank ∈ [+1,+4] | 9 | 3-6-0 | 33.3% [12–65] | -37.5% | -5.4u | -1.20 ✗ noise |
| ΔBestRank ≥ +5 (we have better #1 by ≥5) | 11 | 5-5-1 | 50.0% [24–76] | +18.6% | +1.7u | 0.45 ✗ noise |

**ρ(ΔBestRank, WIN) = 0.319** ✓ p<.05  ·  **ρ(ΔBestRank, flat ROI) = 0.333** ✓ p<.05  (N=37)

### §4f. ΔTopQ share — fraction-of-side that's in the sport's top quartile

Top quartile = top 25% of proven wallets in the sport, ranked by flatRoi. Δshare > 0 = our side is more concentrated in elite wallets than the opposite.

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δshare ≤ −30 pp | 11 | 2-9-0 | 18.2% [5–48] | -59.2% | -8.8u | -2.15 ✓ p<.05 |
| Δshare ∈ [−30,−10] pp | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -3.0u | 0.00 ✗ n<2 |
| Δshare ≈ 0 (±10 pp) | 69 | 31-37-1 | 45.6% [34–57] | -14.9% | -26.6u | -1.31 ✗ noise |
| Δshare ∈ [+10,+30] pp | 5 | 4-1-0 | 80.0% [38–96] | +116.7% | +9.2u | 1.78 ~ p<.10 |
| Δshare ≥ +30 pp | 26 | 20-6-0 | 76.9% [58–89] | +62.7% | +29.0u | 2.66 ✓ p<.01 |

**ρ(ΔTopQShare, WIN) = 0.311** ✓ p<.01  ·  **ρ(ΔTopQShare, flat ROI) = 0.298** ✓ p<.01

### §4g. Predictor leaderboard — which proven-wallet feature is strongest?

Apples-to-apples (same N for all rows). Sorted by |ρ(·, flat ROI)|.

| Rank | Feature | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ |
|---|---|---|---|---|
| 1 | **Δcount** | 0.415 ✓ p<.01 | 0.492 ✓ p<.01 | 0.425 |
| 2 | **ΔAvgRoi** | 0.485 ✓ p<.01 | 0.459 ✓ p<.01 | 0.455 |
| 3 | **ΔFlatPnl** | 0.399 ✓ p<.01 | 0.442 ✓ p<.01 | 0.406 |
| 4 | **ΔTopQCount** | 0.377 ✓ p<.01 | 0.431 ✓ p<.01 | 0.372 |
| 5 | **ΔWlNet** | 0.365 ✓ p<.01 | 0.317 ✓ p<.01 | 0.315 |
| 6 | **ΔTopQShare** | 0.311 ✓ p<.01 | 0.298 ✓ p<.01 | 0.344 |

_(ΔBestRank uses N=37 subset where both sides had a proven wallet — ρ(flat ROI) = 0.333 ✓ p<.05.)_

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 40 | 20-20-0 | 50.0% [35–65] | -10.6% | -5.3u | -0.71 ✗ noise |
| 4.5★ | 10 | 6-4-0 | 60.0% [31–83] | +31.0% | +5.8u | 0.75 ✗ noise |
| 4.0★ | 22 | 11-10-1 | 52.4% [32–72] | +6.0% | -2.8u | 0.27 ✗ noise |
| 3.5★ | 30 | 13-17-0 | 43.3% [27–61] | -1.0% | -0.6u | -0.04 ✗ noise |
| 3.0★ | 17 | 6-10-1 | 37.5% [18–61] | -21.7% | -4.5u | -0.89 ✗ noise |
| 2.5★ | 28 | 13-15-0 | 46.4% [30–64] | -11.1% | -4.1u | -0.60 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 1/0%/-100% | 4/0%/-100% | 5/20%/-58% | 9/38%/-26% | 12/25%/-51% |
| Δw = +1 | 1/100%/+27% | 3/33%/-35% | 11/60%/+15% | 21/48%/-5% | 2/0%/-100% | 10/60%/+9% |
| Δw = +2 | 18/39%/-22% | 1/100%/+91% | 6/67%/+46% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 16/56%/-1% | 3/100%/+153% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | — |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 5 | 4-1-0 | 80.0% [38–96] | +0.5% | +2.6u | 0.02 ✗ noise |
| −300/−201 | 5 | 2-3-0 | 40.0% [12–77] | -46.3% | -1.0u | -1.41 ✗ noise |
| −200/−151 | 11 | 3-8-0 | 27.3% [10–57] | -56.4% | -10.1u | -2.51 ✓ p<.05 |
| −150/−101 | 83 | 41-41-1 | 50.0% [39–61] | -4.9% | -0.2u | -0.47 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 31 | 16-14-1 | 53.3% [36–70] | +16.2% | -0.4u | 0.82 ✗ noise |
| +151/+200 | 2 | 1-1-0 | 50.0% [9–91] | +49.0% | -0.5u | 0.33 ✗ noise |
| +201+ | 7 | 2-5-0 | 28.6% [8–64] | +38.6% | +2.5u | 0.42 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +24% (2) |
| −300/−201 | -67% (4) | — | — | +34% (1) |
| −200/−151 | -100% (5) | +5% (3) | -100% (1) | -100% (1) |
| −150/−101 | -38% (20) | +11% (29) | -31% (19) | +47% (13) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +39% (3) | -15% (14) | +43% (9) | +42% (5) |
| +151/+200 | — | — | +198% (1) | — |
| +201+ | -100% (1) | -100% (1) | -100% (1) | +143% (4) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 80 | 35-45-0 | 43.8% [33–55] | -9.7% | -18.7u | -0.74 ✗ noise |
| SPREAD | 27 | 10-16-1 | 38.5% [22–57] | -24.7% | -1.7u | -1.36 ✗ noise |
| TOTAL | 40 | 24-15-1 | 61.5% [46–75] | +18.7% | +8.8u | 1.26 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=15 · 13% · -77% | N=26 · 46% · -14% | N=18 · 39% · -14% | N=18 · 67% · +55% |
| SPREAD | N=10 · 22% · -51% | N=7 · 29% · -45% | N=6 · 50% · -4% | N=4 · 75% · +46% |
| TOTAL | N=10 · 50% · -3% | N=16 · 73% · +39% | N=8 · 50% · -2% | N=4 · 75% · +47% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 47 | 19-28-0 | 40.4% [28–55] | -21.0% | -13.6u | -1.48 ✗ noise |
| NBA | 80 | 38-41-1 | 48.1% [37–59] | -2.4% | -2.4u | -0.19 ✗ noise |
| NHL | 20 | 12-7-1 | 63.2% [41–81] | +24.4% | +4.4u | 1.10 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=7 · 14% · -71% | N=19 · 42% · -19% | N=14 · 29% · -41% | N=6 · 83% · +63% |
| NBA | N=24 · 26% · -50% | N=19 · 58% · +10% | N=14 · 50% · +4% | N=19 · 63% · +45% |
| NHL | N=4 · 50% · -0% | N=11 · 60% · +10% | N=4 · 75% · +59% | N=1 · 100% · +145% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 93 · 43% · -11.2% · -0.95 ✗ noise | 53 · 55% · +3.9% · 0.30 ✗ noise |
| **plusEV** | 22 · 32% · -31.1% · -1.08 ✗ noise | 124 · 50% · -1.2% · -0.13 ✗ noise |
| **pinnacleConfirms** | 46 · 48% · -1.0% · -0.06 ✗ noise | 34 · 38% · -22.8% · -1.22 ✗ noise |
| **invested10kPlus** | 72 · 42% · -13.0% · -0.94 ✗ noise | 8 · 63% · +14.4% · 0.41 ✗ noise |
| **lineMovingWith** | 92 · 51% · +0.8% · 0.07 ✗ noise | 54 · 42% · -16.7% · -1.18 ✗ noise |
| **predMarketAligns** | 38 · 50% · -2.0% · -0.10 ✗ noise | 42 · 38% · -17.8% · -1.02 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 10 | 7-3-0 | 70.0% [40–89] | +42.9% | +2.9u | 1.36 ✗ noise |
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
| SMALL_MOVE | 22 | 6-16-0 | 27.3% [13–48] | -46.0% | -18.4u | -2.29 ✓ p<.05 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 80 | 38-41-1 | 48.1% [37–59] | -9.4% | -6.6u | -0.89 ✗ noise |
| STRONG | 34 | 16-18-0 | 47.1% [31–63] | -8.6% | -2.5u | -0.50 ✗ noise |
| LEAN | 29 | 13-15-1 | 46.4% [30–64] | +11.0% | -3.7u | 0.41 ✗ noise |
| CONTESTED | 3 | 1-2-0 | 33.3% [6–79] | -34.6% | -0.3u | -0.53 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.075 ✗ | -0.010 ✗ | -0.055 | -0.11 |
| totalInvested | -0.137 ~ p<.10 | -0.123 ✗ | -0.066 | -1.49 |
| evEdge | 0.017 ✗ | 0.025 ✗ | 0.009 | 0.30 |
| moneyPct | 0.036 ✗ | -0.046 ✗ | -0.005 | -0.55 |
| walletPct | 0.110 ✗ | 0.070 ✗ | 0.087 | 0.85 |
| criteriaMet | -0.064 ✗ | -0.040 ✗ | -0.118 | -0.49 |
| maxContribFor | -0.058 ✗ | -0.034 ✗ | -0.000 | -0.40 |
| meanBaseFor | -0.059 ✗ | -0.043 ✗ | -0.025 | -0.52 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **141** picks. Mean CLV = **-0.0031**.
t-statistic vs zero: -2.27 → ✓ p<.05 · 95% CI [-0.0057, -0.0004]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 12 | 5-7-0 | 41.7% [19–68] | -29.3% | -3.5u | -1.15 ✗ noise |
| CLV (−2%, 0] | 79 | 38-39-2 | 49.4% [38–60] | -2.5% | -1.4u | -0.21 ✗ noise |
| CLV (0, +2%] | 39 | 19-20-0 | 48.7% [34–64] | +7.3% | -1.0u | 0.36 ✗ noise |
| CLV > +2% | 11 | 4-7-0 | 36.4% [15–65] | -37.7% | -8.8u | -1.39 ✗ noise |

ρ(CLV, flat ROI) = -0.030 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=36 (with all features non-null). Intercept β₀ = 0.275.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | evEdge | +0.678 | ↑ helps |
| 2 | pw.Δcount | +0.633 | ↑ helps |
| 3 | pw.ΔAvgRoi | +0.604 | ↑ helps |
| 4 | pw.ΔWlNet | +0.581 | ↑ helps |
| 5 | pw.ΔFlatPnl | +0.464 | ↑ helps |
| 6 | sharpCount | -0.420 | ↓ hurts |
| 7 | peak.stars | -0.383 | ↓ hurts |
| 8 | walletPct | -0.377 | ↓ hurts |
| 9 | odds (American) | -0.280 | ↓ hurts |
| 10 | log(impliedProb) | +0.229 | ↑ helps |
| 11 | vault.star | -0.175 | ↓ hurts |
| 12 | log10(invested) | -0.170 | ↓ hurts |
| 13 | criteriaMet | -0.107 | ↓ hurts |
| 14 | Δw | +0.102 | ↑ helps |
| 15 | Δw + HC | +0.076 | ↑ helps |
| 16 | moneyPct | -0.054 | ↓ hurts |
| 17 | HC margin | -0.035 | ≈ flat |
| 18 | pw.ΔTopQShare | +0.019 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Tier-1a HC ≥ +2 (post-cutover) | 2 | 2-0 | 100.0% | 58.3% | -103 | 7.71% bankroll | 3.50u | **UNDER-SIZED** — ship up to 7.71u (1u=1% bankroll) |
| Tier-1b HC = +1 (post-cutover) | 23 | 11-12 | 47.8% | 48.5% | -105 | — (mute) | 1.53u | **MUTE** (negative EV at posterior) |
| Tier-2 HC ≤ 0 ∧ Δw ≥ +2 (HC era) | 5 | 3-2 | 60.0% | 53.3% | -105 | 2.17% bankroll | 1.65u | ~ in range — 2.17u |
| Δw ≥ +3 (full sample) | 26 | 18-8 | 69.2% | 63.9% | -105 | 12.99% bankroll | 2.29u | **UNDER-SIZED** — ship up to 12.99u (1u=1% bankroll) |
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

**Peak cum PnL:** +7.1u
**Max drawdown:** -28.6u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 3
**Daily Sharpe-like (μ/σ):** -0.143  (annualized × √252 ≈ -2.26)

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
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1.00 | -108 | 0 | — | — | -1 | -4 | -1.70 | L | -1.0u |
| 2026-04-18 | NBA | TOTAL | over | 3.0 | 0.75 | -107 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-18 | NBA | TOTAL | under | 5.0 | 2.00 | -104 | — | — | — | — | — | 0.00 | W | +1.9u |
| 2026-04-18 | NBA | ML | home | 5.0 | 3.00 | -360 | — | — | — | — | — | 0.20 | W | +0.8u |
| 2026-04-18 | NBA | TOTAL | under | 4.5 | 1.50 | -105 | — | — | — | — | — | 0.00 | L | -1.5u |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | — | — | 0 | 0 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | — | — | 3 | 8 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | — | — | 1 | 4 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | — | — | 3 | 8 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | — | — | 1 | 8 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | — | — | 3 | 5 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | — | — | 1 | 6 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | — | — | 2 | 4 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | — | — | 1 | 2 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | — | — | 1 | 2 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | — | — | -1 | -4 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | — | — | 0 | -10 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | — | — | 2 | 13 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | — | — | 1 | 6 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | — | — | -1 | -2 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | — | — | -2 | -13 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | — | — | 0 | 0 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | — | — | 1 | 9 | 0.60 | L | -0.5u |
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
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | — | — | -1 | -8 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | — | — | 0 | 0 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | — | — | -3 | -9 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | — | — | 0 | -1 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | — | — | 1 | 6 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | — | — | 6 | 8 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | — | — | 3 | 10 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | — | — | 1 | 6 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | — | — | 0 | -3 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | — | — | -1 | -4 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | — | — | 0 | -1 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | — | — | 1 | 2 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | — | — | 0 | -2 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | — | — | 2 | 8 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | — | — | 2 | 8 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | — | — | 0 | 0 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | — | — | -2 | -6 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | — | — | 1 | 0 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | — | — | 1 | 6 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | — | — | -1 | -2 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | — | — | 4 | 14 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | — | — | 2 | 10 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | — | — | 3 | 9 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | — | — | -1 | -1 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | — | — | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | — | — | 1 | 3 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | — | — | 1 | 22 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | — | — | 3 | 24 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | — | — | 1 | 1 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | — | — | 2 | 13 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | — | — | 1 | 3 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | — | — | 0 | 0 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | — | — | 0 | 0 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | — | — | -1 | -16 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | — | — | 3 | 6 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | — | — | 0 | -13 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | — | — | 0 | 0 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | — | — | 0 | 1 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | — | — | 1 | 6 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | — | — | 0 | 0 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | — | — | 1 | 8 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | — | — | 3 | 25 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | — | — | 1 | 1 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | — | — | 0 | -12 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | — | — | 1 | 10 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | — | — | 0 | -4 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | — | — | 0 | 0 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | — | — | 0 | -10 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | — | — | 1 | 16 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | — | — | 4 | 23 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | — | — | 2 | 27 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | — | — | 0 | 0 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | — | — | 1 | 2 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | — | — | 1 | 3 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | — | — | 0 | 0 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | — | — | 0 | 0 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | — | — | 0 | 0 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | — | — | 2 | 3 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | — | — | 0 | -3 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | — | — | 4 | 12 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | — | — | 3 | 18 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | — | — | 2 | 8 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | — | — | 0 | 0 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | — | — | 0 | 9 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | — | — | 1 | 4 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | — | — | 1 | 5 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | — | — | 2 | 5 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | — | — | 2 | 6 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 1 | 3 | 3 | -1 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 1 | 1 | 0 | -25 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 1 | 2 | 2 | 5 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 1 | 1 | 0 | -1 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 0 | 1 | 0 | 0 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 0 | 1 | 1 | 2 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 0 | 1 | 0 | 0 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | -1 | 2 | 3 | -9 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 1 | 3 | 1 | 19 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 0 | 1 | 1 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 0 | 2 | 3 | 9 | -0.70 | W | +0.0u |
| 2026-05-02 | MLB | ML | away | 4.5 | 3.00 | +140 | 1 | 1 | 2 | 1 | 3 | -0.50 | L | -3.0u |
| 2026-05-02 | NBA | TOTAL | over | 4.0 | 1.13 | -109 | 1 | 1 | 2 | 2 | 17 | 0.00 | W | +1.1u |
| 2026-05-03 | MLB | ML | away | 2.8 | 0.75 | -130 | 1 | 1 | 2 | 0 | -4 | -1.00 | W | +0.6u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +310 | 0 | 1 | 1 | 0 | 2 | 0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 1 | 2 | 1 | 16 | -0.20 | W | +0.7u |
| 2026-05-03 | NBA | ML | away | 4.0 | 0.75 | +260 | 1 | 1 | 2 | 2 | 8 | -0.70 | L | -0.8u |
| 2026-05-03 | NBA | SPREAD | home | 2.8 | 0.75 | -104 | 0 | 1 | 1 | 1 | 16 | -1.20 | W | +0.7u |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -1 | 1 | 0 | -1 | -2 | -0.20 | L | -1.1u |
| 2026-05-04 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 5 | 1 | 6 | 5 | 36 | -1.00 | W | +3.3u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 3.50 | -102 | 3 | 1 | 4 | 4 | 8 | 0.00 | W | +3.2u |
| 2026-05-04 | NBA | ML | away | 5.0 | 0.50 | +245 | 3 | -1 | 2 | 3 | -4 | -0.20 | L | -0.5u |
| 2026-05-04 | NBA | SPREAD | away | 4.0 | 1.13 | -110 | 2 | 1 | 3 | 2 | 4 | -2.10 | L | -1.1u |
| 2026-05-04 | NBA | TOTAL | under | 5.0 | 2.00 | -102 | 2 | 1 | 3 | 2 | 4 | 0.00 | L | -2.0u |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 1 | 1 | 2 | 1 | 4 | -0.10 | W | +0.7u |
| 2026-05-05 | NBA | ML | away | 5.0 | 4.50 | +132 | 4 | 1 | 5 | 3 | 12 | -0.40 | L | -4.5u |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.50 | -105 | 1 | 0 | 1 | 1 | 1 | -0.20 | L | -0.5u |
| 2026-05-05 | NBA | TOTAL | under | 4.0 | 0.75 | -113 | 1 | 0 | 1 | 2 | 21 | 0.00 | W | +0.7u |
| 2026-05-06 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 0 | 4 | 4 | 19 | -1.20 | W | +3.2u |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 2 | 1 | 3 | — | W | +1.6u |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 0 | 0 | 0.00 | W | +0.7u |
| 2026-05-08 | MLB | ML | home | 4.0 | 1.88 | -136 | 2 | 1 | 3 | 1 | 2 | -0.20 | L | -1.9u |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.50 | -103 | 3 | 2 | 5 | 3 | 28 | 0.00 | W | +3.4u |
| 2026-05-08 | NBA | SPREAD | away | 5.0 | 3.50 | -105 | 4 | 2 | 6 | 4 | 33 | 0.00 | W | +3.3u |
| 2026-05-08 | NBA | TOTAL | over | 4.0 | 0.75 | +101 | 2 | 0 | 2 | 2 | 17 | 0.00 | W | +0.8u |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 1 | 2 | 0 | 0 | -1.30 | L | -1.1u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._