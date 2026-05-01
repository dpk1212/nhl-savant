# Sharp Intel v6 — Full Analysis

_Auto-generated **5/1/2026, 10:12:18 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 116 shipped+graded picks · 2026-04-18 → 2026-04-30
**Headline:** 52-62-2 · WR 45.6% [36.8%–54.8%] vs 52.4% break-even · -8.8u flat (-7.6%) · -9.7u peak.
**Overall t-test:** t = -0.75 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The deltas are real signals: **ρ(Δw, flat ROI) = 0.341 ✓ p<.01** and **ρ(Δw+Δq, flat ROI) = 0.328 ✓ p<.01**. The overall sample loses because we ship picks across cohorts that have no edge. Cohort breakdown:

**Winning cohorts (t ≥ 1.645 with positive mean):**
- **Path-1 (Δw ≥ +3)** — N=18, 13-5, WR 72.2% [49%–88%], flat ROI +66.1% (t=1.88 ~ p<.10)

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0** — N=32, 8-23, WR 25.8% [14%–43%], flat ROI -50.0% (t=-3.39 ✓ p<.01)

### Action map

- **Path-1 (Δw ≥ +3)**: ship at maximum size, lift any plus-money cap. Bayesian posterior WR ≈ 64.3%; half-Kelly recommends ~12.5% bankroll at −110.
- **Path-2 (Δw = +2)**: bayesian WR 47.2% → half-Kelly = 0% at −110. **Demote off the 5★ tier.**
- **Floor-B (Δw = +1 ∧ Δq ≥ +2)**: bayesian WR 50.0% → modest positive Kelly. Keep but don't oversize.
- **Stale Δw ≤ 0**: −50.0% flat ROI on 32 picks. Already addressed by the post-4/24 mute engine — should not re-appear.
- **Sample size:** at observed σ (1.10u/pick), we need **~1861 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 116. Cohort findings are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-04-30 |
| Sides scanned | 247 |
| Shipped + graded | **116** |
| W-L-P | 52-62-2 |
| Win rate | **45.6%** [36.8%–54.8%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +6.8 pp |
| Peak-units PnL | **-9.7u** |
| Flat-1u PnL | **-8.8u** (-7.6% flat ROI) |
| Flat t-statistic vs zero | -0.75 → ✗ noise |
| Flat 95% CI per-pick | [-0.276, 0.124]u |

### Power note

At our observed flat-PnL standard deviation (1.10u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 5168 |
| +5% | 1861 |
| +10% | 466 |

We have **116** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 6 | 1-5-0 | 16.7% [3–56] | -65.7% | -4.5u | -1.91 ~ p<.10 |
| Δw = 0 | 25 | 7-17-1 | 29.2% [15–49] | -44.2% | -14.9u | -2.59 ✓ p<.01 |
| Δw = +1 | 35 | 16-18-1 | 47.1% [31–63] | -10.9% | -3.6u | -0.67 ✗ noise |
| Δw = +2 | 26 | 12-14-0 | 46.2% [29–65] | -3.1% | -0.8u | -0.15 ✗ noise |
| Δw ≥ +3 | 18 | 13-5-0 | 72.2% [49–88] | +66.1% | +12.1u | 1.88 ~ p<.10 |

**Pearson ρ(Δw, WIN) = 0.311** ✓ p<.01  ·  **ρ(Δw, flat ROI) = 0.341** ✓ p<.01

### §2b. Δq — quality margin (frozen, contribution ≥ 30)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δq ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.0u | 0.00 ✗ n<2 |
| Δq = −1 | 0 | — | — | — | — | — |
| Δq = 0 | 4 | 0-4-0 | 0.0% [0–49] | -100.0% | -3.5u | 0.00 ✗ noise |
| Δq = +1 | 26 | 10-16-0 | 38.5% [22–57] | -25.4% | -4.6u | -1.33 ✗ noise |
| Δq = +2 | 36 | 16-20-0 | 44.4% [30–60] | -8.4% | -3.8u | -0.47 ✗ noise |
| Δq ≥ +3 | 43 | 22-19-2 | 53.7% [39–68] | +11.7% | -0.1u | 0.62 ✗ noise |

**Pearson ρ(Δq, WIN) = 0.226** ✓ p<.05  ·  **ρ(Δq, flat ROI) = 0.198** ✓ p<.05

### §2c. Δw + Δq — scalar sum (v6.6 hybrid floor input)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 9 | 1-8-0 | 11.1% [2–44] | -77.1% | -6.7u | -3.37 ✓ p<.01 |
| Σ = +1 | 5 | 0-5-0 | 0.0% [0–43] | -100.0% | -4.3u | 0.00 ✗ noise |
| Σ = +2 | 16 | 8-8-0 | 50.0% [28–72] | -11.5% | -4.7u | -0.50 ✗ noise |
| Σ = +3 | 26 | 9-16-1 | 36.0% [20–55] | -28.5% | -5.9u | -1.54 ✗ noise |
| Σ = +4 | 21 | 9-11-1 | 45.0% [26–66] | -2.5% | +0.0u | -0.10 ✗ noise |
| Σ = +5 | 11 | 6-5-0 | 54.5% [28–79] | +21.4% | -2.1u | 0.61 ✗ noise |
| Σ ≥ +6 | 22 | 15-7-0 | 68.2% [47–84] | +44.3% | +10.6u | 1.48 ✗ noise |

**Pearson ρ(Δw+Δq, WIN) = 0.332** ✓ p<.01  ·  **ρ(Σ, flat ROI) = 0.328** ✓ p<.01

Spearman rank ρ(Δw+Δq, flat ROI) = 0.300.

### §2d. Which axis is the strongest single predictor?

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.324 ✓ p<.01 | 0.352 ✓ p<.01 | 0.303 | meaningful |
| Δq | 0.226 ✓ p<.05 | 0.198 ✓ p<.05 | 0.187 | weak |
| Δw + Δq | 0.332 ✓ p<.01 | 0.328 ✓ p<.01 | 0.300 | meaningful |
| Δw × Δq | 0.321 ✓ p<.01 | 0.329 ✓ p<.01 | 0.294 | meaningful |
| peak.stars | 0.108 ✗ | 0.063 ✗ | 0.065 | weak |
| lock.stars | 0.005 ✗ | 0.016 ✗ | -0.010 | weak |

---

## §3. Bivariate Δw × Δq matrix
_Each cell: N · W-L · WR% · Wilson 95% CI · Peak ROI%. ★ flag = sig 95% one-sample t-test on flat PnL._

| Δw \ Δq | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | N=1 · 0-1 · 0% [0–79] · —  | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=3 · 1-2 · 33% [6–79] · -31%  | N=1 · 0-1 · 0% [0–79] · —  | — |
| +0 | — | — | — | N=3 · 0-3 · 0% [0–56] · -100%  | N=4 · 0-4 · 0% [0–49] · -100%  | N=8 · 5-3 · 63% [31–86] · +12%  | N=9 · 1-7 · 13% [2–47] · -66% ✗ |
| +1 | — | — | — | — | N=8 · 3-5 · 38% [14–69] · -35%  | N=13 · 5-8 · 38% [18–64] · -26%  | N=14 · 8-5 · 62% [36–82] · +17%  |
| +2 | — | — | — | — | N=8 · 4-4 · 50% [22–78] · -0%  | N=10 · 4-6 · 40% [17–69] · -4%  | N=8 · 4-4 · 50% [22–78] · -5%  |
| ≥ +3 | — | — | — | — | N=2 · 2-0 · 100% [34–100] · — ★ | N=4 · 2-2 · 50% [15–85] · +21%  | N=12 · 9-3 · 75% [47–91] · +74%  |

---

## §4. Wallet contribution thresholds — V8 contribution-edge style
_Per-wallet `contribution = walletBase × convictionMult` (frozen on `peak.v8Scoring.walletDetails`). For each cut T we count qFor / qAg on the pick side and check predictive power._


### §4.30 — Threshold T = 30

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 6 | 4-2-0 | 66.7% [30–90] | +12.8% | +3.2u | 0.35 ✗ noise |
| qFor = 1 | 5 | 1-4-0 | 20.0% [4–62] | -62.0% | -2.3u | -1.63 ✗ noise |
| qFor = 2 | 38 | 17-21-0 | 44.7% [30–60] | -13.4% | -5.3u | -0.84 ✗ noise |
| qFor ≥ 3 | 67 | 30-35-2 | 46.2% [35–58] | -2.1% | -5.4u | -0.14 ✗ noise |

ρ(qFor, WIN) = 0.032 ✗  ·  ρ(qFor, flat ROI) = 0.119 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 11 | 4-7-0 | 36.4% [15–65] | -38.5% | -1.3u | -1.47 ✗ noise |
| margin = +1 | 27 | 11-16-0 | 40.7% [25–59] | -19.1% | -1.7u | -0.98 ✗ noise |
| margin = +2 | 38 | 17-20-1 | 45.9% [31–62] | -10.1% | -5.8u | -0.62 ✗ noise |
| margin ≥ +3 | 40 | 20-19-1 | 51.3% [36–66] | +11.0% | -1.0u | 0.54 ✗ noise |

ρ(margin, WIN) = 0.128 ✗  ·  ρ(margin, flat ROI) = 0.150 ✗

### §4.40 — Threshold T = 40

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 6 | 4-2-0 | 66.7% [30–90] | +12.8% | +3.2u | 0.35 ✗ noise |
| qFor = 1 | 14 | 5-9-0 | 35.7% [16–61] | -35.0% | -7.4u | -1.44 ✗ noise |
| qFor = 2 | 40 | 18-21-1 | 46.2% [32–61] | -10.6% | -1.3u | -0.68 ✗ noise |
| qFor ≥ 3 | 56 | 25-30-1 | 45.5% [33–58] | -0.8% | -4.2u | -0.05 ✗ noise |

ρ(qFor, WIN) = 0.020 ✗  ·  ρ(qFor, flat ROI) = 0.055 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 15 | 6-9-0 | 40.0% [20–64] | -4.1% | -2.8u | -0.10 ✗ noise |
| margin = +1 | 34 | 17-17-0 | 50.0% [34–66] | +1.2% | +3.3u | 0.06 ✗ noise |
| margin = +2 | 36 | 12-22-2 | 35.3% [21–52] | -31.5% | -11.5u | -2.08 ✓ p<.05 |
| margin ≥ +3 | 31 | 17-14-0 | 54.8% [38–71] | +8.8% | +1.3u | 0.45 ✗ noise |

ρ(margin, WIN) = 0.107 ✗  ·  ρ(margin, flat ROI) = 0.055 ✗

### §4.50 — Threshold T = 50

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 13 | 5-8-0 | 38.5% [18–64] | -29.1% | -2.7u | -1.09 ✗ noise |
| qFor = 1 | 33 | 18-15-0 | 54.5% [38–70] | +5.4% | +5.0u | 0.32 ✗ noise |
| qFor = 2 | 40 | 14-25-1 | 35.9% [23–52] | -20.9% | -14.8u | -1.08 ✗ noise |
| qFor ≥ 3 | 30 | 15-14-1 | 51.7% [34–69] | +5.1% | +2.7u | 0.25 ✗ noise |

ρ(qFor, WIN) = -0.016 ✗  ·  ρ(qFor, flat ROI) = -0.012 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 28 | 14-14-0 | 50.0% [33–67] | +16.8% | +5.5u | 0.64 ✗ noise |
| margin = +1 | 38 | 17-20-1 | 45.9% [31–62] | -9.2% | -5.0u | -0.54 ✗ noise |
| margin = +2 | 31 | 11-19-1 | 36.7% [22–54] | -30.3% | -10.3u | -1.83 ~ p<.10 |
| margin ≥ +3 | 19 | 10-9-0 | 52.6% [32–73] | -3.4% | +0.1u | -0.15 ✗ noise |

ρ(margin, WIN) = 0.003 ✗  ·  ρ(margin, flat ROI) = -0.096 ✗

### §4.60 — Threshold T = 60

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 33 | 15-18-0 | 45.5% [30–62] | -14.4% | -2.2u | -0.85 ✗ noise |
| qFor = 1 | 40 | 19-19-2 | 50.0% [35–65] | -1.0% | +1.7u | -0.06 ✗ noise |
| qFor = 2 | 22 | 8-14-0 | 36.4% [20–57] | -16.7% | -9.2u | -0.56 ✗ noise |
| qFor ≥ 3 | 21 | 10-11-0 | 47.6% [28–68] | -0.1% | -0.0u | -0.00 ✗ noise |

ρ(qFor, WIN) = -0.010 ✗  ·  ρ(qFor, flat ROI) = 0.014 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 46 | 22-23-1 | 48.9% [35–63] | +3.7% | +4.3u | 0.21 ✗ noise |
| margin = +1 | 38 | 15-22-1 | 40.5% [26–57] | -19.0% | -10.2u | -1.17 ✗ noise |
| margin = +2 | 18 | 9-9-0 | 50.0% [29–71] | -0.9% | -0.1u | -0.03 ✗ noise |
| margin ≥ +3 | 14 | 6-8-0 | 42.9% [21–67] | -22.4% | -3.7u | -0.89 ✗ noise |

ρ(margin, WIN) = 0.014 ✗  ·  ρ(margin, flat ROI) = -0.067 ✗

### §4.70 — Threshold T = 70

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 45 | 22-21-2 | 51.2% [37–65] | -3.1% | +2.6u | -0.22 ✗ noise |
| qFor = 1 | 43 | 16-27-0 | 37.2% [24–52] | -26.2% | -12.5u | -1.75 ~ p<.10 |
| qFor = 2 | 21 | 11-10-0 | 52.4% [32–72] | +14.4% | -0.4u | 0.46 ✗ noise |
| qFor ≥ 3 | 7 | 3-4-0 | 42.9% [16–75] | +11.4% | +0.6u | 0.19 ✗ noise |

ρ(qFor, WIN) = -0.036 ✗  ·  ρ(qFor, flat ROI) = 0.013 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 61 | 28-31-2 | 47.5% [35–60] | -0.8% | +5.2u | -0.06 ✗ noise |
| margin = +1 | 33 | 14-19-0 | 42.4% [27–59] | -18.9% | -12.4u | -1.11 ✗ noise |
| margin = +2 | 16 | 8-8-0 | 50.0% [28–72] | +0.4% | +0.1u | 0.01 ✗ noise |
| margin ≥ +3 | 6 | 2-4-0 | 33.3% [10–70] | -35.9% | -2.6u | -0.89 ✗ noise |

ρ(margin, WIN) = -0.015 ✗  ·  ρ(margin, flat ROI) = -0.073 ✗

### §4.cont — Continuous Δcontribution (sumContrib_For − sumContrib_Against)

Tercile cuts: low ≤ 89.1 · mid ≤ 164.8 · high > 164.8

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Low Δcontrib | 39 | 20-19-0 | 51.3% [36–66] | +8.9% | +8.5u | 0.45 ✗ noise |
| Mid Δcontrib | 39 | 16-22-1 | 42.1% [28–58] | -17.3% | -8.4u | -1.08 ✗ noise |
| High Δcontrib | 38 | 16-21-1 | 43.2% [29–59] | -14.7% | -9.8u | -0.86 ✗ noise |

ρ(Δcontrib, WIN) = 0.066 ✗  ·  ρ(Δcontrib, flat ROI) = 0.040 ✗

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 31 | 16-15-0 | 51.6% [35–68] | -9.9% | -6.4u | -0.59 ✗ noise |
| 4.5★ | 8 | 5-3-0 | 62.5% [31–86] | +39.2% | +5.4u | 0.81 ✗ noise |
| 4.0★ | 14 | 7-6-1 | 53.8% [29–77] | +11.6% | +2.1u | 0.40 ✗ noise |
| 3.5★ | 24 | 9-15-0 | 37.5% [21–57] | -8.9% | -1.3u | -0.31 ✗ noise |
| 3.0★ | 17 | 6-10-1 | 37.5% [18–61] | -21.7% | -4.5u | -0.89 ✗ noise |
| 2.5★ | 22 | 9-13-0 | 40.9% [23–61] | -21.4% | -5.0u | -1.03 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 1/0%/-100% | 3/0%/-100% | 4/25%/-48% | 9/38%/-26% | 12/25%/-51% |
| Δw = +1 | 1/100%/+27% | 2/50%/-2% | 8/57%/+10% | 16/38%/-25% | 2/0%/-100% | 6/67%/+18% |
| Δw = +2 | 16/44%/-12% | 1/100%/+91% | 2/100%/+143% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 9/56%/-11% | 2/100%/+181% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | — |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 5 | 4-1-0 | 80.0% [38–96] | +0.5% | +2.6u | 0.02 ✗ noise |
| −300/−201 | 5 | 2-3-0 | 40.0% [12–77] | -46.3% | -1.0u | -1.41 ✗ noise |
| −200/−151 | 8 | 2-6-0 | 25.0% [7–59] | -60.1% | -6.6u | -2.30 ✓ p<.05 |
| −150/−101 | 62 | 27-34-1 | 44.3% [33–57] | -16.1% | -11.9u | -1.35 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 27 | 14-12-1 | 53.8% [35–71] | +17.0% | +4.7u | 0.81 ✗ noise |
| +151/+200 | 2 | 1-1-0 | 50.0% [9–91] | +49.0% | +2.5u | 0.33 ✗ noise |
| +201+ | 4 | 2-2-0 | 50.0% [15–85] | +142.5% | +4.5u | 0.98 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +24% (2) |
| −300/−201 | -67% (4) | — | — | +34% (1) |
| −200/−151 | -100% (4) | -23% (2) | -100% (1) | — |
| −150/−101 | -45% (19) | -0% (19) | -19% (14) | +16% (8) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +39% (3) | -21% (12) | +36% (8) | +77% (4) |
| +151/+200 | — | — | +198% (1) | — |
| +201+ | — | — | -100% (1) | +223% (3) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 66 | 30-36-0 | 45.5% [34–57] | -5.0% | -2.0u | -0.34 ✗ noise |
| SPREAD | 18 | 5-12-1 | 29.4% [13–53] | -41.4% | -8.8u | -2.00 ✓ p<.05 |
| TOTAL | 32 | 17-14-1 | 54.8% [38–71] | +6.0% | +1.0u | 0.35 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=13 · 15% · -74% | N=19 · 42% · -23% | N=16 · 38% · -15% | N=15 · 80% · +87% |
| SPREAD | N=9 · 13% · -68% | N=4 · 25% · -52% | N=4 · 75% · +43% | N=1 · 0% · -100% |
| TOTAL | N=10 · 50% · -3% | N=12 · 64% · +21% | N=6 · 50% · -3% | N=2 · 50% · -5% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 41 | 16-25-0 | 39.0% [26–54] | -23.1% | -8.9u | -1.51 ✗ noise |
| NBA | 59 | 27-31-1 | 46.6% [34–59] | -4.0% | -4.1u | -0.26 ✗ noise |
| NHL | 16 | 9-6-1 | 60.0% [36–80] | +18.7% | +3.2u | 0.74 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=6 · 17% · -66% | N=15 · 33% · -34% | N=13 · 31% · -37% | N=6 · 83% · +63% |
| NBA | N=22 · 24% · -55% | N=12 · 58% · +11% | N=10 · 60% · +25% | N=11 · 64% · +61% |
| NHL | N=4 · 50% · -0% | N=8 · 57% · +1% | N=3 · 67% · +49% | N=1 · 100% · +145% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 78 · 42% · -11.5% · -0.88 ✗ noise | 38 · 53% · +0.4% · 0.03 ✗ noise |
| **plusEV** | 20 · 35% · -24.2% · -0.77 ✗ noise | 96 · 48% · -4.2% · -0.40 ✗ noise |
| **pinnacleConfirms** | 38 · 50% · +5.6% · 0.27 ✗ noise | 28 · 39% · -19.4% · -0.91 ✗ noise |
| **invested10kPlus** | 62 · 45% · -4.9% · -0.32 ✗ noise | 4 · 50% · -6.7% · -0.11 ✗ noise |
| **lineMovingWith** | 72 · 48% · -3.0% · -0.23 ✗ noise | 44 · 42% · -15.1% · -0.94 ✗ noise |
| **predMarketAligns** | 32 · 47% · -6.0% · -0.27 ✗ noise | 34 · 44% · -4.1% · -0.20 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 6 | 5-1-0 | 83.3% [44–97] | +65.4% | +2.8u | 1.97 ✓ p<.05 |
| 1 | 24 | 9-14-1 | 39.1% [22–59] | -25.2% | -4.1u | -1.33 ✗ noise |
| 2 | 38 | 17-20-1 | 45.9% [31–62] | -2.2% | +2.7u | -0.12 ✗ noise |
| 3 | 15 | 5-10-0 | 33.3% [15–58] | -41.6% | -10.7u | -1.81 ~ p<.10 |
| 4 | 13 | 5-8-0 | 38.5% [18–64] | -19.9% | -4.8u | -0.67 ✗ noise |
| 5 | 15 | 9-6-0 | 60.0% [36–80] | -1.2% | +3.5u | -0.05 ✗ noise |
| 6 | 5 | 2-3-0 | 40.0% [12–77] | +63.0% | +0.9u | 0.56 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 26 | 16-9-1 | 64.0% [45–80] | +14.1% | +8.9u | 0.79 ✗ noise |
| NEAR_START | 65 | 28-36-1 | 43.8% [32–56] | -5.1% | -7.7u | -0.34 ✗ noise |
| NO_MOVE | 6 | 2-4-0 | 33.3% [10–70] | -36.2% | -1.1u | -0.90 ✗ noise |
| SMALL_MOVE | 18 | 5-13-0 | 27.8% [12–51] | -43.8% | -10.7u | -1.90 ~ p<.10 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 62 | 27-34-1 | 44.3% [33–57] | -17.0% | -13.3u | -1.42 ✗ noise |
| STRONG | 28 | 14-14-0 | 50.0% [33–67] | -2.2% | +3.3u | -0.11 ✗ noise |
| LEAN | 24 | 11-12-1 | 47.8% [29–67] | +18.1% | +1.3u | 0.58 ✗ noise |
| CONTESTED | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -1.0u | 0.00 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.006 ✗ | 0.064 ✗ | -0.018 | 0.69 |
| totalInvested | -0.099 ✗ | -0.092 ✗ | 0.012 | -0.99 |
| evEdge | -0.014 ✗ | -0.004 ✗ | -0.021 | -0.04 |
| moneyPct | -0.003 ✗ | -0.094 ✗ | -0.059 | -1.01 |
| walletPct | 0.070 ✗ | 0.027 ✗ | 0.048 | 0.29 |
| criteriaMet | -0.004 ✗ | 0.021 ✗ | -0.047 | 0.22 |
| maxContribFor | -0.066 ✗ | -0.041 ✗ | -0.026 | -0.44 |
| meanBaseFor | -0.070 ✗ | -0.053 ✗ | -0.029 | -0.56 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **112** picks. Mean CLV = **-0.0019**.
t-statistic vs zero: -1.22 → ✗ noise · 95% CI [-0.0050, 0.0012]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 8 | 5-3-0 | 62.5% [31–86] | +6.1% | +1.3u | 0.19 ✗ noise |
| CLV (−2%, 0] | 61 | 26-33-2 | 44.1% [32–57] | -11.0% | -3.7u | -0.82 ✗ noise |
| CLV (0, +2%] | 33 | 16-17-0 | 48.5% [33–65] | +8.0% | -0.5u | 0.35 ✗ noise |
| CLV > +2% | 10 | 4-6-0 | 40.0% [17–69] | -31.5% | -5.8u | -1.07 ✗ noise |

ρ(CLV, flat ROI) = -0.064 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=116 (with all features non-null). Intercept β₀ = -0.229.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | Δw | +0.586 | ↑ helps |
| 2 | Δq | +0.416 | ↑ helps |
| 3 | meanBaseFor | -0.317 | ↓ hurts |
| 4 | sharpCount | -0.177 | ↓ hurts |
| 5 | log(impliedProb) | +0.177 | ↑ helps |
| 6 | criteriaMet | -0.118 | ↓ hurts |
| 7 | walletPct | -0.107 | ↓ hurts |
| 8 | maxContribFor | -0.055 | ↓ hurts |
| 9 | peak.stars | -0.033 | ≈ flat |
| 10 | moneyPct | -0.028 | ≈ flat |
| 11 | margin@T50 | -0.011 | ≈ flat |
| 12 | qFor@T50 | -0.006 | ≈ flat |
| 13 | odds (American) | +0.005 | ≈ flat |
| 14 | log10(invested) | -0.002 | ≈ flat |
| 15 | evEdge | -0.001 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Path-1 (Δw ≥ +3 ∧ Δq ≥ +1) | 18 | 13-5 | 72.2% | 64.3% | -105 | 13.39% bankroll | 1.89u | **UNDER-SIZED** — ship up to 13.39u (1u=1% bankroll) |
| Path-2 (Δw = +2 ∧ Δq ≥ +1) | 26 | 12-14 | 46.2% | 47.2% | -103 | — (mute) | 1.83u | **MUTE** (negative EV at posterior) |
| Floor-B (Δw = +1 ∧ Δq ≥ +2) | 27 | 13-13 | 50.0% | 50.0% | -104 | — (mute) | 0.98u | **MUTE** (negative EV at posterior) |
| Floor-A (Δw = +1 ∧ Δq = +1)  [MUTED v6.6] | 8 | 3-5 | 37.5% | 44.4% | +108 | — (mute) | 0.90u | **MUTE** (negative EV at posterior) |
| Stale Δw = 0 | 25 | 7-17 | 29.2% | 35.3% | -108 | — (mute) | 1.15u | **MUTE** (negative EV at posterior) |
| Stale Δw ≤ −1 | 7 | 1-6 | 14.3% | 35.3% | -165 | — (mute) | 0.86u | **MUTE** (negative EV at posterior) |

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
| 2026-04-30 | 5 | 2-2 | +2.5u | -9.7u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -22.8u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 2
**Daily Sharpe-like (μ/σ):** -0.182  (annualized × √252 ≈ -2.90)

---

## §14. Per-pick row-level detail (every shipped+graded pick)
_Sortable raw data behind every section. Use to spot-check individual decisions._

| Date | Sport | Mkt | Side | ★ | u | Odds | Δw | Δq | Σ | qF₅₀ | qA₅₀ | Crit | EV | Outcome | Peak PnL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.50 | +105 | 2 | 1 | 3 | 2 | 1 | 1 | 0.00 | W | +0.5u |
| 2026-04-18 | MLB | ML | away | 4.5 | 2.50 | -155 | — | — | — | 0 | 0 | 2 | -1.60 | W | +1.6u |
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.50 | -117 | 2 | 1 | 3 | 1 | 0 | 2 | 0.00 | L | -0.5u |
| 2026-04-18 | MLB | ML | home | 4.5 | 3.00 | -150 | 3 | 3 | 6 | 1 | 0 | 5 | -0.20 | W | +2.0u |
| 2026-04-18 | NBA | ML | away | 3.5 | 0.50 | +200 | — | — | — | 0 | 0 | 2 | -0.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.50 | -108 | 0 | 0 | 0 | 1 | 1 | 1 | -2.40 | L | -0.5u |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1.00 | -108 | 0 | 2 | 2 | 2 | 0 | 2 | -1.70 | L | -1.0u |
| 2026-04-18 | NBA | TOTAL | over | 3.0 | 0.75 | -107 | 0 | 2 | 2 | 2 | 0 | 2 | 0.00 | L | -0.8u |
| 2026-04-18 | NBA | TOTAL | under | 5.0 | 2.00 | -104 | — | — | — | 0 | 0 | 0 | 0.00 | W | +1.9u |
| 2026-04-18 | NBA | ML | home | 5.0 | 3.00 | -360 | — | — | — | 0 | 0 | 5 | 0.20 | W | +0.8u |
| 2026-04-18 | NBA | TOTAL | under | 4.5 | 1.50 | -105 | — | — | — | 0 | 0 | 0 | 0.00 | L | -1.5u |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.50 | +105 | 1 | 4 | 5 | 3 | 0 | 2 | -0.70 | W | +0.5u |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3 | 3 | 6 | 2 | 0 | 5 | -1.70 | W | +1.6u |
| 2026-04-19 | MLB | ML | home | 4.0 | 2.00 | -106 | 3 | 4 | 7 | 4 | 0 | 5 | 0.00 | W | +1.8u |
| 2026-04-19 | MLB | ML | home | 3.0 | 1.00 | -125 | 3 | 3 | 6 | 1 | 0 | 5 | -0.60 | W | +0.8u |
| 2026-04-19 | MLB | ML | away | 2.5 | 1.00 | +100 | 0 | 1 | 1 | 0 | 0 | 5 | 1.00 | L | -1.0u |
| 2026-04-19 | NBA | ML | away | 4.5 | 1.00 | +295 | 4 | 5 | 9 | 3 | 2 | 2 | -0.50 | W | +3.1u |
| 2026-04-19 | NBA | SPREAD | home | 5.0 | 2.00 | -110 | 0 | 7 | 7 | 6 | 0 | 1 | -0.70 | L | -2.0u |
| 2026-04-20 | MLB | ML | home | 2.5 | 1.00 | -130 | 2 | 2 | 4 | 2 | 0 | 4 | -0.80 | L | -1.0u |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.50 | +106 | -1 | 1 | 0 | 1 | 1 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | MLB | ML | away | 2.5 | 1.00 | +126 | 2 | 2 | 4 | 1 | 0 | 3 | -0.40 | W | +1.3u |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.50 | +104 | 1 | 2 | 3 | 1 | 0 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -235 | -1 | -4 | -5 | 4 | 4 | 5 | -1.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2.00 | -102 | 1 | 6 | 7 | 4 | 0 | 2 | -0.20 | L | -2.0u |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.50 | -102 | 0 | 2 | 2 | 1 | 0 | 0 | 0.00 | W | +0.5u |
| 2026-04-20 | NBA | ML | home | 3.0 | 1.00 | -285 | -1 | 2 | 1 | 2 | 0 | 6 | 2.00 | L | -1.0u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -105 | -1 | 0 | -1 | 2 | 1 | 3 | 1.20 | L | -0.8u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -115 | 0 | 2 | 2 | 1 | 1 | 2 | 0.00 | W | +0.4u |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.50 | +360 | 3 | 3 | 6 | 1 | 1 | 3 | 0.60 | L | -0.5u |
| 2026-04-20 | NBA | SPREAD | home | 3.0 | 0.75 | -110 | 0 | 2 | 2 | 1 | 0 | 2 | -1.40 | W | +0.7u |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.50 | -108 | 0 | 1 | 1 | 2 | 1 | 1 | 0.00 | L | -0.5u |
| 2026-04-20 | NHL | ML | away | 4.0 | 1.50 | +146 | 0 | 3 | 3 | 2 | 1 | 2 | -1.00 | L | -1.5u |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.50 | -133 | 1 | 2 | 3 | 1 | 0 | 1 | 0.00 | W | +0.4u |
| 2026-04-20 | NHL | ML | home | 2.5 | 1.00 | -134 | 1 | 1 | 2 | 2 | 0 | 4 | -0.40 | W | +0.8u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +140 | 3 | 2 | 5 | 2 | 0 | 6 | 0.40 | W | +2.1u |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | -1 | 1 | 0 | 1 | 0 | 2 | -2.70 | L | -0.8u |
| 2026-04-21 | MLB | TOTAL | under | 3.0 | 1.00 | -103 | 2 | 2 | 4 | 2 | 0 | 1 | 0.00 | L | -1.0u |
| 2026-04-21 | MLB | ML | away | 3.0 | 1.50 | +100 | 1 | 3 | 4 | 1 | 0 | 4 | -0.50 | L | -1.5u |
| 2026-04-21 | MLB | ML | home | 3.0 | 1.25 | -116 | 2 | 2 | 4 | 0 | 0 | 6 | 0.20 | L | -1.3u |
| 2026-04-21 | NBA | ML | away | 5.0 | 3.00 | -192 | 0 | 2 | 2 | 1 | 0 | 4 | 0.00 | L | -3.0u |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 0 | 0 | 0 | 4 | 2 | 3 | 1.60 | L | -1.8u |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0 | 1 | 1 | 1 | 0 | 1 | 0.00 | L | -0.8u |
| 2026-04-21 | NBA | ML | home | 4.0 | 0.50 | -850 | -3 | 1 | -2 | 5 | 1 | 2 | -0.40 | L | -0.5u |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.50 | -110 | -1 | 1 | 0 | 1 | 0 | 1 | -0.90 | L | -1.5u |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.50 | -108 | 0 | 4 | 4 | 2 | 1 | 2 | 0.00 | L | -1.5u |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.50 | +475 | 3 | 3 | 6 | 2 | 3 | 6 | 0.60 | W | +2.4u |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2.00 | -110 | 2 | 5 | 7 | 6 | 1 | 2 | -0.20 | W | +1.8u |
| 2026-04-21 | NBA | TOTAL | over | 4.0 | 1.75 | -102 | 0 | 4 | 4 | 4 | 0 | 1 | 0.00 | L | -1.8u |
| 2026-04-21 | NHL | ML | away | 3.0 | 0.75 | +145 | 3 | 2 | 5 | 2 | 2 | 4 | -0.90 | W | +1.1u |
| 2026-04-21 | NHL | ML | home | 2.5 | 1.00 | -184 | 1 | 1 | 2 | 1 | 0 | 1 | -1.60 | W | +0.5u |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.50 | -152 | 0 | 0 | 0 | 2 | 1 | 4 | -0.60 | L | -0.5u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.00 | -207 | 0 | 1 | 1 | 2 | 0 | 1 | -1.70 | L | -1.0u |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.10 | +130 | 1 | 1 | 2 | 1 | 0 | 4 | -0.40 | L | -1.1u |
| 2026-04-22 | NBA | ML | home | 5.0 | 3.00 | -375 | 1 | 7 | 8 | 5 | 0 | 3 | -1.10 | W | +0.8u |
| 2026-04-22 | NBA | SPREAD | home | 4.0 | 2.00 | -114 | 2 | 5 | 7 | 3 | 0 | 1 | -1.20 | W | +1.8u |
| 2026-04-22 | NBA | TOTAL | over | 3.0 | 0.50 | -115 | 0 | 2 | 2 | 2 | 1 | 2 | 0.00 | W | +0.4u |
| 2026-04-22 | NHL | ML | home | 3.0 | 0.50 | -188 | 1 | 2 | 3 | 1 | 0 | 2 | -1.80 | L | -0.5u |
| 2026-04-22 | NHL | ML | away | 3.5 | 1.00 | +110 | 0 | 4 | 4 | 1 | 1 | 2 | 0.00 | W | +1.2u |
| 2026-04-23 | MLB | ML | home | 3.0 | 1.00 | -155 | 0 | 3 | 3 | 2 | 0 | 3 | 0.30 | L | -1.0u |
| 2026-04-23 | MLB | TOTAL | under | 3.0 | 1.75 | -110 | 2 | 2 | 4 | 2 | 1 | 1 | 0.00 | L | -1.8u |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.60 | +130 | 1 | 4 | 5 | 3 | 0 | 5 | -1.20 | W | +2.0u |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2.00 | -104 | 1 | 5 | 6 | 4 | 0 | 2 | 0.00 | W | +1.9u |
| 2026-04-23 | NBA | TOTAL | under | 4.0 | 1.85 | -102 | 1 | 4 | 5 | 3 | 1 | 2 | 0.00 | L | -1.9u |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | 1 | 2 | 1 | 2 | 6 | 1.40 | L | -1.4u |
| 2026-04-23 | NHL | TOTAL | over | 3.0 | 1.00 | -113 | 0 | — | — | 0 | 0 | 0 | 0.00 | W | +0.9u |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1 | 2 | 3 | 2 | 0 | 1 | -1.40 | W | +0.7u |
| 2026-04-24 | NBA | ML | away | 5.0 | 3.00 | -295 | 0 | 2 | 2 | 3 | 1 | 5 | 0.00 | W | +1.0u |
| 2026-04-24 | NBA | SPREAD | home | 3.0 | 1.50 | -108 | 0 | 3 | 3 | 3 | 2 | 1 | -1.70 | P | +0.0u |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.50 | -111 | 1 | 1 | 2 | 1 | 0 | 1 | 0.00 | W | +0.5u |
| 2026-04-24 | NBA | ML | home | 5.0 | 2.00 | +120 | 2 | 2 | 4 | 4 | 1 | 3 | 0.70 | L | -2.0u |
| 2026-04-24 | NHL | ML | home | 5.0 | 3.00 | +102 | 2 | 1 | 3 | 2 | 0 | 1 | -1.70 | W | +2.9u |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 1 | 1 | 2 | 2 | 0 | 1 | -1.50 | L | -0.8u |
| 2026-04-25 | MLB | ML | home | 4.0 | 1.25 | +128 | 1 | 3 | 4 | 2 | 0 | 3 | -0.40 | L | -1.3u |
| 2026-04-25 | NBA | ML | away | 5.0 | 3.00 | -118 | 3 | 3 | 6 | 2 | 2 | 2 | -1.90 | L | -3.0u |
| 2026-04-25 | NBA | ML | home | 5.0 | 2.00 | +125 | 4 | 1 | 5 | 1 | 1 | 4 | -1.20 | W | +2.4u |
| 2026-04-25 | NBA | SPREAD | home | 5.0 | 2.00 | -105 | 2 | 4 | 6 | 5 | 2 | 2 | -0.70 | L | -2.0u |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | 2 | 3 | 1 | 0 | 1 | -0.60 | L | -0.8u |
| 2026-04-25 | NHL | ML | home | 5.0 | 3.00 | -120 | 2 | 3 | 5 | 5 | 2 | 5 | -0.40 | L | -3.0u |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 1 | 1 | 2 | 0 | 0 | 5 | 0.50 | L | -0.8u |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.50 | -116 | 1 | 2 | 3 | 1 | 1 | 1 | 0.00 | L | -0.5u |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | 1 | 2 | 1 | 0 | 1 | -1.40 | L | -0.8u |
| 2026-04-26 | MLB | ML | away | 5.0 | 2.00 | +100 | 2 | 1 | 3 | 2 | 0 | 4 | 0.00 | L | -2.0u |
| 2026-04-26 | MLB | TOTAL | over | 4.0 | 0.75 | -102 | 1 | 3 | 4 | 1 | 0 | 1 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -290 | 3 | 7 | 10 | 2 | 0 | 5 | 1.40 | W | +1.0u |
| 2026-04-26 | NBA | TOTAL | over | 4.0 | 0.75 | -101 | 1 | 3 | 4 | 3 | 1 | 2 | 0.00 | W | +0.7u |
| 2026-04-26 | NBA | ML | away | 5.0 | 3.00 | -158 | 2 | 1 | 3 | 2 | 0 | 3 | -0.70 | L | -3.0u |
| 2026-04-26 | NBA | TOTAL | under | 5.0 | 2.00 | -110 | 3 | 1 | 4 | 1 | 1 | 1 | 0.00 | W | +1.8u |
| 2026-04-26 | NBA | SPREAD | home | 4.0 | 0.75 | -110 | 1 | 4 | 5 | 3 | 1 | 3 | 0.20 | W | +0.7u |
| 2026-04-27 | MLB | ML | home | 5.0 | 2.00 | +140 | 2 | 4 | 6 | 2 | 0 | 5 | -0.50 | L | -2.0u |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1 | 2 | 3 | 2 | 0 | 3 | -0.70 | W | +0.8u |
| 2026-04-27 | NBA | SPREAD | away | 4.0 | 0.75 | -114 | 1 | 3 | 4 | 5 | 2 | 2 | -0.70 | L | -0.8u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -104 | 3 | 2 | 5 | 2 | 1 | 2 | 0.00 | L | -2.0u |
| 2026-04-27 | NBA | ML | home | 5.0 | 3.00 | -500 | 3 | 4 | 7 | 5 | 1 | 5 | 0.40 | W | +0.6u |
| 2026-04-27 | NBA | TOTAL | over | 5.0 | 2.00 | -115 | 2 | 2 | 4 | 2 | 1 | 2 | 0.00 | W | +1.7u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | 2 | 3 | 1 | 0 | 4 | -0.80 | W | +0.6u |
| 2026-04-28 | MLB | ML | away | 5.0 | 3.00 | -102 | 2 | 1 | 3 | 0 | 0 | 2 | -0.50 | L | -3.0u |
| 2026-04-28 | MLB | ML | home | 5.0 | 3.00 | -124 | 2 | 1 | 3 | 1 | 0 | 2 | -0.80 | W | +2.4u |
| 2026-04-28 | MLB | ML | home | 5.0 | 2.00 | +102 | 2 | 3 | 5 | 2 | 0 | 3 | -1.90 | L | -2.0u |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1 | 2 | 3 | 0 | 0 | 2 | -0.20 | L | -0.8u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +142 | 3 | 2 | 5 | 2 | 1 | 4 | 0.00 | L | -2.0u |
| 2026-04-28 | MLB | ML | away | 5.0 | 2.00 | +112 | 2 | 1 | 3 | 1 | 1 | 4 | 0.00 | W | +2.2u |
| 2026-04-28 | NBA | ML | away | 5.0 | 0.50 | +215 | 2 | 2 | 4 | 4 | 2 | 5 | -0.70 | L | -0.5u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 2 | 6 | 8 | 5 | 1 | 2 | -1.60 | W | +1.8u |
| 2026-04-28 | NBA | SPREAD | away | 5.0 | 2.00 | -105 | 3 | 5 | 8 | 0 | 0 | 3 | 0.20 | L | -2.0u |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.50 | -108 | 1 | 2 | 3 | 1 | 0 | 2 | 0.50 | L | -0.5u |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.50 | -117 | 1 | 2 | 3 | 2 | 1 | 2 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.50 | -105 | 1 | 2 | 3 | 2 | 0 | 2 | -0.70 | L | -0.5u |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.50 | -104 | 1 | 2 | 3 | 2 | 0 | 1 | 0.00 | L | -0.5u |
| 2026-04-29 | NBA | ML | home | 5.0 | 3.00 | -355 | 4 | 4 | 8 | 2 | 1 | 3 | 0.20 | W | +0.8u |
| 2026-04-29 | NBA | TOTAL | over | 5.0 | 2.00 | -112 | 2 | 4 | 6 | 5 | 1 | 2 | 0.00 | W | +1.9u |
| 2026-04-29 | NHL | ML | away | 5.0 | 2.00 | +145 | 2 | 2 | 4 | 0 | 1 | 2 | -0.30 | W | +2.8u |
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 2 | 4 | 3 | 3 | 2 | -0.20 | W | +3.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 3 | 3 | 5 | 3 | 3 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 3 | 4 | 2 | 0 | 2 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 3 | 3 | 3 | 0 | 4 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 3 | 4 | 2 | 0 | 2 | 0.00 | P | +0.0u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._