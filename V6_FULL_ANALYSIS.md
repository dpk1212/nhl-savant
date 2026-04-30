# Sharp Intel v6 — Full Analysis

_Auto-generated **4/30/2026, 5:35:35 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 111 shipped+graded picks · 2026-04-18 → 2026-04-29
**Headline:** 50-60-1 · WR 45.5% [36.5%–54.8%] vs 52.4% break-even · -9.8u flat (-8.8%) · -12.2u peak.
**Overall t-test:** t = -0.84 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The deltas are real signals: **ρ(Δw, flat ROI) = 0.330 ✓ p<.01** and **ρ(Δw+Δq, flat ROI) = 0.328 ✓ p<.01**. The overall sample loses because we ship picks across cohorts that have no edge. Cohort breakdown:

**Winning cohorts (t ≥ 1.645 with positive mean):**
- **Path-1 (Δw ≥ +3)** — N=18, 13-5, WR 72.2% [49%–88%], flat ROI +66.1% (t=1.88 ~ p<.10)

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0** — N=30, 8-21, WR 27.6% [15%–46%], flat ROI -46.6% (t=-3.00 ✓ p<.01)

### Action map

- **Path-1 (Δw ≥ +3)**: ship at maximum size, lift any plus-money cap. Bayesian posterior WR ≈ 64.3%; half-Kelly recommends ~12.5% bankroll at −110.
- **Path-2 (Δw = +2)**: bayesian WR 45.7% → half-Kelly = 0% at −110. **Demote off the 5★ tier.**
- **Floor-B (Δw = +1 ∧ Δq ≥ +2)**: bayesian WR 48.6% → modest positive Kelly. Keep but don't oversize.
- **Stale Δw ≤ 0**: −46.6% flat ROI on 30 picks. Already addressed by the post-4/24 mute engine — should not re-appear.
- **Sample size:** at observed σ (1.10u/pick), we need **~1848 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 111. Cohort findings are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-04-29 |
| Sides scanned | 233 |
| Shipped + graded | **111** |
| W-L-P | 50-60-1 |
| Win rate | **45.5%** [36.5%–54.8%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +6.9 pp |
| Peak-units PnL | **-12.2u** |
| Flat-1u PnL | **-9.8u** (-8.8% flat ROI) |
| Flat t-statistic vs zero | -0.84 → ✗ noise |
| Flat 95% CI per-pick | [-0.292, 0.116]u |

### Power note

At our observed flat-PnL standard deviation (1.10u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 5132 |
| +5% | 1848 |
| +10% | 462 |

We have **111** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 6 | 1-5-0 | 16.7% [3–56] | -65.7% | -4.5u | -1.91 ~ p<.10 |
| Δw = 0 | 23 | 7-15-1 | 31.8% [16–53] | -39.3% | -13.4u | -2.16 ✓ p<.05 |
| Δw = +1 | 33 | 15-18-0 | 45.5% [30–62] | -14.4% | -4.6u | -0.86 ✗ noise |
| Δw = +2 | 25 | 11-14-0 | 44.0% [27–63] | -11.2% | -3.8u | -0.54 ✗ noise |
| Δw ≥ +3 | 18 | 13-5-0 | 72.2% [49–88] | +66.1% | +12.1u | 1.88 ~ p<.10 |

**Pearson ρ(Δw, WIN) = 0.299** ✓ p<.01  ·  **ρ(Δw, flat ROI) = 0.330** ✓ p<.01

### §2b. Δq — quality margin (frozen, contribution ≥ 30)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δq ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.0u | 0.00 ✗ n<2 |
| Δq = −1 | 0 | — | — | — | — | — |
| Δq = 0 | 4 | 0-4-0 | 0.0% [0–49] | -100.0% | -3.5u | 0.00 ✗ noise |
| Δq = +1 | 26 | 10-16-0 | 38.5% [22–57] | -25.4% | -4.6u | -1.33 ✗ noise |
| Δq = +2 | 35 | 15-20-0 | 42.9% [28–59] | -14.3% | -6.8u | -0.83 ✗ noise |
| Δq ≥ +3 | 39 | 21-17-1 | 55.3% [40–70] | +15.6% | +0.4u | 0.76 ✗ noise |

**Pearson ρ(Δq, WIN) = 0.240** ✓ p<.05  ·  **ρ(Δq, flat ROI) = 0.211** ✓ p<.05

### §2c. Δw + Δq — scalar sum (v6.6 hybrid floor input)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 9 | 1-8-0 | 11.1% [2–44] | -77.1% | -6.7u | -3.37 ✓ p<.01 |
| Σ = +1 | 5 | 0-5-0 | 0.0% [0–43] | -100.0% | -4.3u | 0.00 ✗ noise |
| Σ = +2 | 16 | 8-8-0 | 50.0% [28–72] | -11.5% | -4.7u | -0.50 ✗ noise |
| Σ = +3 | 24 | 9-14-1 | 39.1% [22–59] | -22.5% | -4.4u | -1.15 ✗ noise |
| Σ = +4 | 18 | 7-11-0 | 38.9% [20–61] | -19.1% | -4.0u | -0.77 ✗ noise |
| Σ = +5 | 11 | 6-5-0 | 54.5% [28–79] | +21.4% | -2.1u | 0.61 ✗ noise |
| Σ ≥ +6 | 22 | 15-7-0 | 68.2% [47–84] | +44.3% | +10.6u | 1.48 ✗ noise |

**Pearson ρ(Δw+Δq, WIN) = 0.334** ✓ p<.01  ·  **ρ(Σ, flat ROI) = 0.328** ✓ p<.01

Spearman rank ρ(Δw+Δq, flat ROI) = 0.292.

### §2d. Which axis is the strongest single predictor?

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.313 ✓ p<.01 | 0.341 ✓ p<.01 | 0.288 | meaningful |
| Δq | 0.240 ✓ p<.05 | 0.211 ✓ p<.05 | 0.199 | meaningful |
| Δw + Δq | 0.334 ✓ p<.01 | 0.328 ✓ p<.01 | 0.292 | meaningful |
| Δw × Δq | 0.316 ✓ p<.01 | 0.327 ✓ p<.01 | 0.273 | meaningful |
| peak.stars | 0.086 ✗ | 0.038 ✗ | 0.032 | weak |
| lock.stars | -0.010 ✗ | -0.017 ✗ | -0.036 | weak |

---

## §3. Bivariate Δw × Δq matrix
_Each cell: N · W-L · WR% · Wilson 95% CI · Peak ROI%. ★ flag = sig 95% one-sample t-test on flat PnL._

| Δw \ Δq | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | N=1 · 0-1 · 0% [0–79] · —  | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=3 · 1-2 · 33% [6–79] · -31%  | N=1 · 0-1 · 0% [0–79] · —  | — |
| +0 | — | — | — | N=3 · 0-3 · 0% [0–56] · -100%  | N=4 · 0-4 · 0% [0–49] · -100%  | N=8 · 5-3 · 63% [31–86] · +12%  | N=7 · 1-5 · 17% [3–56] · -56%  |
| +1 | — | — | — | — | N=8 · 3-5 · 38% [14–69] · -35%  | N=13 · 5-8 · 38% [18–64] · -26%  | N=12 · 7-5 · 58% [32–81] · +12%  |
| +2 | — | — | — | — | N=8 · 4-4 · 50% [22–78] · -0%  | N=9 · 3-6 · 33% [12–65] · -27%  | N=8 · 4-4 · 50% [22–78] · -5%  |
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
| qFor ≥ 3 | 62 | 28-33-1 | 45.9% [34–58] | -3.7% | -7.9u | -0.25 ✗ noise |

ρ(qFor, WIN) = 0.045 ✗  ·  ρ(qFor, flat ROI) = 0.129 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 11 | 4-7-0 | 36.4% [15–65] | -38.5% | -1.3u | -1.47 ✗ noise |
| margin = +1 | 27 | 11-16-0 | 40.7% [25–59] | -19.1% | -1.7u | -0.98 ✗ noise |
| margin = +2 | 37 | 16-20-1 | 44.4% [30–60] | -15.7% | -8.7u | -0.99 ✗ noise |
| margin ≥ +3 | 36 | 19-17-0 | 52.8% [37–68] | +15.1% | -0.5u | 0.68 ✗ noise |

ρ(margin, WIN) = 0.139 ✗  ·  ρ(margin, flat ROI) = 0.160 ~ p<.10

### §4.40 — Threshold T = 40

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 6 | 4-2-0 | 66.7% [30–90] | +12.8% | +3.2u | 0.35 ✗ noise |
| qFor = 1 | 14 | 5-9-0 | 35.7% [16–61] | -35.0% | -7.4u | -1.44 ✗ noise |
| qFor = 2 | 39 | 18-21-0 | 46.2% [32–61] | -10.9% | -1.3u | -0.68 ✗ noise |
| qFor ≥ 3 | 52 | 23-28-1 | 45.1% [32–59] | -2.7% | -6.7u | -0.16 ✗ noise |

ρ(qFor, WIN) = 0.020 ✗  ·  ρ(qFor, flat ROI) = 0.054 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 15 | 6-9-0 | 40.0% [20–64] | -4.1% | -2.8u | -0.10 ✗ noise |
| margin = +1 | 32 | 16-16-0 | 50.0% [34–66] | -1.8% | +1.1u | -0.10 ✗ noise |
| margin = +2 | 35 | 12-22-1 | 35.3% [21–52] | -32.4% | -11.5u | -2.08 ✓ p<.05 |
| margin ≥ +3 | 29 | 16-13-0 | 55.2% [38–72] | +9.6% | +1.0u | 0.47 ✗ noise |

ρ(margin, WIN) = 0.110 ✗  ·  ρ(margin, flat ROI) = 0.061 ✗

### §4.50 — Threshold T = 50

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 13 | 5-8-0 | 38.5% [18–64] | -29.1% | -2.7u | -1.09 ✗ noise |
| qFor = 1 | 33 | 18-15-0 | 54.5% [38–70] | +5.4% | +5.0u | 0.32 ✗ noise |
| qFor = 2 | 38 | 13-25-0 | 34.2% [21–50] | -24.5% | -15.9u | -1.22 ✗ noise |
| qFor ≥ 3 | 27 | 14-12-1 | 53.8% [35–71] | +5.7% | +1.3u | 0.27 ✗ noise |

ρ(qFor, WIN) = -0.001 ✗  ·  ρ(qFor, flat ROI) = -0.004 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 27 | 13-14-0 | 48.1% [31–66] | +10.1% | +2.5u | 0.38 ✗ noise |
| margin = +1 | 38 | 17-20-1 | 45.9% [31–62] | -9.2% | -5.0u | -0.54 ✗ noise |
| margin = +2 | 28 | 10-18-0 | 35.7% [21–54] | -33.4% | -10.6u | -1.90 ~ p<.10 |
| margin ≥ +3 | 18 | 10-8-0 | 55.6% [34–75] | +2.0% | +0.9u | 0.09 ✗ noise |

ρ(margin, WIN) = 0.026 ✗  ·  ρ(margin, flat ROI) = -0.074 ✗

### §4.60 — Threshold T = 60

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 33 | 15-18-0 | 45.5% [30–62] | -14.4% | -2.2u | -0.85 ✗ noise |
| qFor = 1 | 38 | 18-19-1 | 48.6% [33–64] | -3.5% | +0.7u | -0.21 ✗ noise |
| qFor = 2 | 21 | 8-13-0 | 38.1% [21–59] | -12.7% | -8.4u | -0.41 ✗ noise |
| qFor ≥ 3 | 19 | 9-10-0 | 47.4% [27–68] | -5.3% | -2.3u | -0.20 ✗ noise |

ρ(qFor, WIN) = -0.008 ✗  ·  ρ(qFor, flat ROI) = 0.009 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 46 | 22-23-1 | 48.9% [35–63] | +3.7% | +4.3u | 0.21 ✗ noise |
| margin = +1 | 35 | 13-22-0 | 37.1% [23–54] | -29.0% | -14.2u | -1.81 ~ p<.10 |
| margin = +2 | 16 | 9-7-0 | 56.3% [33–77] | +11.5% | +1.4u | 0.39 ✗ noise |
| margin ≥ +3 | 14 | 6-8-0 | 42.9% [21–67] | -22.4% | -3.7u | -0.89 ✗ noise |

ρ(margin, WIN) = 0.028 ✗  ·  ρ(margin, flat ROI) = -0.057 ✗

### §4.70 — Threshold T = 70

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 44 | 22-21-1 | 51.2% [37–65] | -3.2% | +2.6u | -0.22 ✗ noise |
| qFor = 1 | 41 | 15-26-0 | 36.6% [24–52] | -27.3% | -12.7u | -1.78 ~ p<.10 |
| qFor = 2 | 19 | 10-9-0 | 52.6% [32–73] | +10.8% | -2.6u | 0.33 ✗ noise |
| qFor ≥ 3 | 7 | 3-4-0 | 42.9% [16–75] | +11.4% | +0.6u | 0.19 ✗ noise |

ρ(qFor, WIN) = -0.047 ✗  ·  ρ(qFor, flat ROI) = 0.004 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 58 | 27-30-1 | 47.4% [35–60] | -2.6% | +3.0u | -0.17 ✗ noise |
| margin = +1 | 32 | 13-19-0 | 40.6% [26–58] | -22.4% | -13.5u | -1.30 ✗ noise |
| margin = +2 | 15 | 8-7-0 | 53.3% [30–75] | +7.1% | +0.8u | 0.23 ✗ noise |
| margin ≥ +3 | 6 | 2-4-0 | 33.3% [10–70] | -35.9% | -2.6u | -0.89 ✗ noise |

ρ(margin, WIN) = -0.012 ✗  ·  ρ(margin, flat ROI) = -0.062 ✗

### §4.cont — Continuous Δcontribution (sumContrib_For − sumContrib_Against)

Tercile cuts: low ≤ 87.1 · mid ≤ 159.6 · high > 159.6

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Low Δcontrib | 38 | 19-19-0 | 50.0% [35–65] | +7.2% | +8.1u | 0.35 ✗ noise |
| Mid Δcontrib | 37 | 15-21-1 | 41.7% [27–58] | -21.8% | -11.2u | -1.42 ✗ noise |
| High Δcontrib | 36 | 16-20-0 | 44.4% [30–60] | -12.3% | -9.2u | -0.69 ✗ noise |

ρ(Δcontrib, WIN) = 0.071 ✗  ·  ρ(Δcontrib, flat ROI) = 0.046 ✗

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 31 | 16-15-0 | 51.6% [35–68] | -9.9% | -6.4u | -0.59 ✗ noise |
| 4.5★ | 8 | 5-3-0 | 62.5% [31–86] | +39.2% | +5.4u | 0.81 ✗ noise |
| 4.0★ | 11 | 5-6-0 | 45.5% [21–72] | -11.8% | -1.9u | -0.39 ✗ noise |
| 3.5★ | 24 | 9-15-0 | 37.5% [21–57] | -8.9% | -1.3u | -0.31 ✗ noise |
| 3.0★ | 17 | 6-10-1 | 37.5% [18–61] | -21.7% | -4.5u | -0.89 ✗ noise |
| 2.5★ | 20 | 9-11-0 | 45.0% [26–66] | -13.5% | -3.5u | -0.61 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 1/0%/-100% | 3/0%/-100% | 4/25%/-48% | 9/38%/-26% | 10/30%/-41% |
| Δw = +1 | 1/100%/+27% | 2/50%/-2% | 6/50%/-2% | 16/38%/-25% | 2/0%/-100% | 6/67%/+18% |
| Δw = +2 | 16/44%/-12% | 1/100%/+91% | 1/100%/+88% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 9/56%/-11% | 2/100%/+181% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | — |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 5 | 4-1-0 | 80.0% [38–96] | +0.5% | +2.6u | 0.02 ✗ noise |
| −300/−201 | 5 | 2-3-0 | 40.0% [12–77] | -46.3% | -1.0u | -1.41 ✗ noise |
| −200/−151 | 8 | 2-6-0 | 25.0% [7–59] | -60.1% | -6.6u | -2.30 ✓ p<.05 |
| −150/−101 | 59 | 26-32-1 | 44.8% [33–58] | -15.2% | -11.5u | -1.24 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 26 | 14-12-0 | 53.8% [35–71] | +17.7% | +4.7u | 0.81 ✗ noise |
| +151/+200 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| +201+ | 4 | 2-2-0 | 50.0% [15–85] | +142.5% | +4.5u | 0.98 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +24% (2) |
| −300/−201 | -67% (4) | — | — | +34% (1) |
| −200/−151 | -100% (4) | -23% (2) | -100% (1) | — |
| −150/−101 | -38% (17) | -5% (18) | -19% (14) | +16% (8) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +39% (3) | -23% (11) | +36% (8) | +77% (4) |
| +151/+200 | — | — | — | — |
| +201+ | — | — | -100% (1) | +223% (3) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 64 | 29-35-0 | 45.3% [34–57] | -6.7% | -4.2u | -0.45 ✗ noise |
| SPREAD | 17 | 5-11-1 | 31.3% [14–56] | -37.9% | -8.0u | -1.75 ~ p<.10 |
| TOTAL | 30 | 16-14-0 | 53.3% [36–70] | +3.2% | -0.1u | 0.18 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=12 · 17% · -71% | N=19 · 42% · -23% | N=15 · 33% · -29% | N=15 · 80% · +87% |
| SPREAD | N=8 · 14% · -64% | N=4 · 25% · -52% | N=4 · 75% · +43% | N=1 · 0% · -100% |
| TOTAL | N=10 · 50% · -3% | N=10 · 60% · +16% | N=6 · 50% · -3% | N=2 · 50% · -5% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 41 | 16-25-0 | 39.0% [26–54] | -23.1% | -8.9u | -1.51 ✗ noise |
| NBA | 56 | 25-30-1 | 45.5% [33–58] | -7.6% | -7.4u | -0.48 ✗ noise |
| NHL | 14 | 9-5-0 | 64.3% [39–84] | +28.5% | +4.0u | 1.04 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=6 · 17% · -66% | N=15 · 33% · -34% | N=13 · 31% · -37% | N=6 · 83% · +63% |
| NBA | N=21 · 25% · -53% | N=11 · 55% · +3% | N=9 · 56% · +6% | N=11 · 64% · +61% |
| NHL | N=3 · 67% · +33% | N=7 · 57% · +1% | N=3 · 67% · +49% | N=1 · 100% · +145% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 73 · 42% · -13.6% · -1.00 ✗ noise | 38 · 53% · +0.4% · 0.03 ✗ noise |
| **plusEV** | 19 · 37% · -20.2% · -0.61 ✗ noise | 92 · 47% · -6.4% · -0.60 ✗ noise |
| **pinnacleConfirms** | 37 · 51% · +8.5% · 0.40 ✗ noise | 27 · 37% · -27.4% · -1.34 ✗ noise |
| **invested10kPlus** | 60 · 45% · -6.7% · -0.43 ✗ noise | 4 · 50% · -6.7% · -0.11 ✗ noise |
| **lineMovingWith** | 68 · 49% · -1.7% · -0.12 ✗ noise | 43 · 40% · -20.1% · -1.28 ✗ noise |
| **predMarketAligns** | 32 · 47% · -6.0% · -0.27 ✗ noise | 32 · 44% · -7.4% · -0.36 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 6 | 5-1-0 | 83.3% [44–97] | +65.4% | +2.8u | 1.97 ✓ p<.05 |
| 1 | 24 | 9-14-1 | 39.1% [22–59] | -25.2% | -4.1u | -1.33 ✗ noise |
| 2 | 35 | 15-20-0 | 42.9% [28–59] | -10.8% | -1.3u | -0.58 ✗ noise |
| 3 | 14 | 5-9-0 | 35.7% [16–61] | -37.4% | -9.9u | -1.55 ✗ noise |
| 4 | 12 | 5-7-0 | 41.7% [19–68] | -13.2% | -4.1u | -0.42 ✗ noise |
| 5 | 15 | 9-6-0 | 60.0% [36–80] | -1.2% | +3.5u | -0.05 ✗ noise |
| 6 | 5 | 2-3-0 | 40.0% [12–77] | +63.0% | +0.9u | 0.56 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 26 | 16-9-1 | 64.0% [45–80] | +14.1% | +8.9u | 0.79 ✗ noise |
| NEAR_START | 61 | 27-34-0 | 44.3% [33–57] | -3.7% | -7.2u | -0.24 ✗ noise |
| NO_MOVE | 6 | 2-4-0 | 33.3% [10–70] | -36.2% | -1.1u | -0.90 ✗ noise |
| SMALL_MOVE | 17 | 4-13-0 | 23.5% [10–47] | -58.1% | -13.7u | -3.02 ✓ p<.01 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 59 | 26-33-0 | 44.1% [32–57] | -17.8% | -13.6u | -1.44 ✗ noise |
| STRONG | 27 | 14-13-0 | 51.9% [34–69] | +1.5% | +4.1u | 0.07 ✗ noise |
| LEAN | 23 | 10-12-1 | 45.5% [27–65] | +10.3% | -1.7u | 0.33 ✗ noise |
| CONTESTED | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -1.0u | 0.00 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.002 ✗ | 0.068 ✗ | -0.026 | 0.72 |
| totalInvested | -0.099 ✗ | -0.086 ✗ | 0.020 | -0.90 |
| evEdge | -0.014 ✗ | -0.008 ✗ | -0.022 | -0.09 |
| moneyPct | 0.013 ✗ | -0.078 ✗ | -0.052 | -0.82 |
| walletPct | 0.074 ✗ | 0.027 ✗ | 0.048 | 0.28 |
| criteriaMet | 0.009 ✗ | 0.040 ✗ | -0.032 | 0.41 |
| maxContribFor | -0.083 ✗ | -0.060 ✗ | -0.045 | -0.63 |
| meanBaseFor | -0.066 ✗ | -0.053 ✗ | -0.022 | -0.55 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **107** picks. Mean CLV = **-0.0020**.
t-statistic vs zero: -1.22 → ✗ noise · 95% CI [-0.0052, 0.0012]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 8 | 5-3-0 | 62.5% [31–86] | +6.1% | +1.3u | 0.19 ✗ noise |
| CLV (−2%, 0] | 58 | 25-32-1 | 43.9% [32–57] | -13.3% | -5.9u | -0.98 ✗ noise |
| CLV (0, +2%] | 31 | 15-16-0 | 48.4% [32–65] | +8.7% | -0.8u | 0.36 ✗ noise |
| CLV > +2% | 10 | 4-6-0 | 40.0% [17–69] | -31.5% | -5.8u | -1.07 ✗ noise |

ρ(CLV, flat ROI) = -0.069 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=111 (with all features non-null). Intercept β₀ = -0.220.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | Δw | +0.568 | ↑ helps |
| 2 | Δq | +0.449 | ↑ helps |
| 3 | meanBaseFor | -0.303 | ↓ hurts |
| 4 | log(impliedProb) | +0.221 | ↑ helps |
| 5 | sharpCount | -0.173 | ↓ hurts |
| 6 | walletPct | -0.139 | ↓ hurts |
| 7 | maxContribFor | -0.137 | ↓ hurts |
| 8 | criteriaMet | -0.092 | ↓ hurts |
| 9 | peak.stars | -0.073 | ↓ hurts |
| 10 | margin@T50 | +0.030 | ≈ flat |
| 11 | odds (American) | +0.026 | ≈ flat |
| 12 | qFor@T50 | +0.015 | ≈ flat |
| 13 | moneyPct | -0.014 | ≈ flat |
| 14 | evEdge | -0.002 | ≈ flat |
| 15 | log10(invested) | -0.001 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Path-1 (Δw ≥ +3 ∧ Δq ≥ +1) | 18 | 13-5 | 72.2% | 64.3% | -105 | 13.39% bankroll | 1.89u | **UNDER-SIZED** — ship up to 13.39u (1u=1% bankroll) |
| Path-2 (Δw = +2 ∧ Δq ≥ +1) | 25 | 11-14 | 44.0% | 45.7% | -105 | — (mute) | 1.86u | **MUTE** (negative EV at posterior) |
| Floor-B (Δw = +1 ∧ Δq ≥ +2) | 25 | 12-13 | 48.0% | 48.6% | -104 | — (mute) | 0.98u | **MUTE** (negative EV at posterior) |
| Floor-A (Δw = +1 ∧ Δq = +1)  [MUTED v6.6] | 8 | 3-5 | 37.5% | 44.4% | +108 | — (mute) | 0.90u | **MUTE** (negative EV at posterior) |
| Stale Δw = 0 | 23 | 7-15 | 31.8% | 37.5% | -108 | — (mute) | 1.18u | **MUTE** (negative EV at posterior) |
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

**Peak cum PnL:** +7.1u
**Max drawdown:** -22.8u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 2
**Daily Sharpe-like (μ/σ):** -0.245  (annualized × √252 ≈ -3.88)

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

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._