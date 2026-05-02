# Sharp Intel v6 — Full Analysis

_Auto-generated **5/2/2026, 10:03:41 AM ET** by `scripts/v6FullAnalysis.js`. Do not edit by hand._

**Inclusion mirrors live Pick Performance dashboard:** `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL in **peak units** (the size shipped to users) and **flat 1u** (cohort EV lens). Cohort tags from frozen `v8_walletConsensus*` stamps written at last sync before T-15.

## Executive summary

**Sample:** 122 shipped+graded picks · 2026-04-18 → 2026-05-01
**Headline:** 55-65-2 · WR 45.8% [37.2%–54.7%] vs 52.4% break-even · -9.1u flat (-7.5%) · -18.2u peak.
**Overall t-test:** t = -0.76 → ✗ noise.

**Verdict:** ✗ overall sample is consistent with zero or negative true ROI.

### Where IS the edge?

The deltas are real signals: **ρ(Δw, flat ROI) = 0.319 ✓ p<.01** and **ρ(Δw+Δq, flat ROI) = 0.295 ✓ p<.01**. The overall sample loses because we ship picks across cohorts that have no edge. Cohort breakdown:

**Winning cohorts (t ≥ 1.645 with positive mean):**
- **Path-1 (Δw ≥ +3)** — N=19, 13-6, WR 68.4% [46%–85%], flat ROI +57.3% (t=1.66 ~ p<.10)

**Bleeder cohorts (t ≤ −1.645 with negative mean):**
- **Stale Δw ≤ 0** — N=32, 8-23, WR 25.8% [14%–43%], flat ROI -50.0% (t=-3.39 ✓ p<.01)

### Action map

- **Path-1 (Δw ≥ +3)**: ship at maximum size, lift any plus-money cap. Bayesian posterior WR ≈ 62.1%; half-Kelly recommends ~10.2% bankroll at −110.
- **Path-2 (Δw = +2)**: bayesian WR 47.4% → half-Kelly = 0% at −110. **Demote off the 5★ tier.**
- **Floor-B (Δw = +1 ∧ Δq ≥ +2)**: bayesian WR 51.3% → modest positive Kelly. Keep but don't oversize.
- **Stale Δw ≤ 0**: −50.0% flat ROI on 32 picks. Already addressed by the post-4/24 mute engine — should not re-appear.
- **Sample size:** at observed σ (1.09u/pick), we need **~1837 graded picks** to validate a true +5% flat ROI at 95% confidence. We have 122. Cohort findings are provisional until N grows.

---

## §1. Sample summary
_Dashboard-truth filter (mirrors live Pick Performance)._

| Metric | Value |
|---|---|
| Date range | 2026-04-18 … 2026-05-01 |
| Sides scanned | 271 |
| Shipped + graded | **122** |
| W-L-P | 55-65-2 |
| Win rate | **45.8%** [37.2%–54.7%] |
| Break-even WR @ −110 | 52.38% |
| Distance to break-even | WR needs +6.5 pp |
| Peak-units PnL | **-18.2u** |
| Flat-1u PnL | **-9.1u** (-7.5% flat ROI) |
| Flat t-statistic vs zero | -0.76 → ✗ noise |
| Flat 95% CI per-pick | [-0.269, 0.119]u |

### Power note

At our observed flat-PnL standard deviation (1.09u/pick), to detect a true edge of:

| True flat ROI | Picks needed (95% conf) |
|---|---|
| +3% | 5103 |
| +5% | 1837 |
| +10% | 460 |

We have **122** graded picks. Anything we conclude on cohorts smaller than ~200 is provisional.

---

## §2. Univariate signal analysis
_For each axis: bucket performance + Pearson/Spearman correlation with WIN and flat ROI._

### §2a. Δw — winner margin (frozen)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δw ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -0.5u | 0.00 ✗ n<2 |
| Δw = −1 | 6 | 1-5-0 | 16.7% [3–56] | -65.7% | -4.5u | -1.91 ~ p<.10 |
| Δw = 0 | 25 | 7-17-1 | 29.2% [15–49] | -44.2% | -14.9u | -2.59 ✓ p<.01 |
| Δw = +1 | 38 | 18-19-1 | 48.6% [33–64] | -7.9% | -4.1u | -0.51 ✗ noise |
| Δw = +2 | 28 | 13-15-0 | 46.4% [30–64] | -3.3% | -5.8u | -0.16 ✗ noise |
| Δw ≥ +3 | 19 | 13-6-0 | 68.4% [46–85] | +57.3% | +9.1u | 1.66 ~ p<.10 |

**Pearson ρ(Δw, WIN) = 0.287** ✓ p<.01  ·  **ρ(Δw, flat ROI) = 0.319** ✓ p<.01

### §2b. Δq — quality margin (frozen, contribution ≥ 30)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Δq ≤ −2 | 1 | 0-1-0 | 0.0% [0–79] | -100.0% | -1.0u | 0.00 ✗ n<2 |
| Δq = −1 | 0 | — | — | — | — | — |
| Δq = 0 | 4 | 0-4-0 | 0.0% [0–49] | -100.0% | -3.5u | 0.00 ✗ noise |
| Δq = +1 | 27 | 11-16-0 | 40.7% [25–59] | -21.2% | -4.6u | -1.13 ✗ noise |
| Δq = +2 | 38 | 18-20-0 | 47.4% [32–63] | -3.2% | -6.8u | -0.18 ✗ noise |
| Δq ≥ +3 | 46 | 22-22-2 | 50.0% [36–64] | +4.4% | -5.6u | 0.24 ✗ noise |

**Pearson ρ(Δq, WIN) = 0.190** ✓ p<.05  ·  **ρ(Δq, flat ROI) = 0.169** ~ p<.10

### §2c. Δw + Δq — scalar sum (v6.6 hybrid floor input)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Σ ≤ 0 | 9 | 1-8-0 | 11.1% [2–44] | -77.1% | -6.7u | -3.37 ✓ p<.01 |
| Σ = +1 | 5 | 0-5-0 | 0.0% [0–43] | -100.0% | -4.3u | 0.00 ✗ noise |
| Σ = +2 | 16 | 8-8-0 | 50.0% [28–72] | -11.5% | -4.7u | -0.50 ✗ noise |
| Σ = +3 | 29 | 12-16-1 | 42.9% [27–61] | -16.2% | -5.9u | -0.91 ✗ noise |
| Σ = +4 | 22 | 9-12-1 | 42.9% [24–63] | -6.9% | -3.4u | -0.30 ✗ noise |
| Σ = +5 | 11 | 6-5-0 | 54.5% [28–79] | +21.4% | -2.1u | 0.61 ✗ noise |
| Σ ≥ +6 | 24 | 15-9-0 | 62.5% [43–79] | +32.2% | +5.6u | 1.13 ✗ noise |

**Pearson ρ(Δw+Δq, WIN) = 0.295** ✓ p<.01  ·  **ρ(Σ, flat ROI) = 0.295** ✓ p<.01

Spearman rank ρ(Δw+Δq, flat ROI) = 0.258.

### §2d. Which axis is the strongest single predictor?

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | Verdict |
|---|---|---|---|---|
| Δw | 0.300 ✓ p<.01 | 0.329 ✓ p<.01 | 0.277 | meaningful |
| Δq | 0.190 ✓ p<.05 | 0.169 ~ p<.10 | 0.149 | weak |
| Δw + Δq | 0.295 ✓ p<.01 | 0.295 ✓ p<.01 | 0.258 | meaningful |
| Δw × Δq | 0.280 ✓ p<.01 | 0.294 ✓ p<.01 | 0.258 | meaningful |
| peak.stars | 0.078 ✗ | 0.040 ✗ | 0.042 | weak |
| lock.stars | 0.003 ✗ | 0.011 ✗ | -0.012 | weak |

---

## §3. Bivariate Δw × Δq matrix
_Each cell: N · W-L · WR% · Wilson 95% CI · Peak ROI%. ★ flag = sig 95% one-sample t-test on flat PnL._

| Δw \ Δq | ≤ −3 | -2 | -1 | +0 | +1 | +2 | ≥ +3 |
|---|---|---|---|---|---|---|---|
| ≤ −3 | — | — | — | — | N=1 · 0-1 · 0% [0–79] · —  | — | — |
| -2 | — | — | — | — | — | — | — |
| -1 | N=1 · 0-1 · 0% [0–79] · —  | — | — | N=1 · 0-1 · 0% [0–79] · —  | N=3 · 1-2 · 33% [6–79] · -31%  | N=1 · 0-1 · 0% [0–79] · —  | — |
| +0 | — | — | — | N=3 · 0-3 · 0% [0–56] · -100%  | N=4 · 0-4 · 0% [0–49] · -100%  | N=8 · 5-3 · 63% [31–86] · +12%  | N=9 · 1-7 · 13% [2–47] · -66% ✗ |
| +1 | — | — | — | — | N=8 · 3-5 · 38% [14–69] · -35%  | N=15 · 7-8 · 47% [25–70] · -11%  | N=15 · 8-6 · 57% [33–79] · +9%  |
| +2 | — | — | — | — | N=9 · 5-4 · 56% [27–81] · +10%  | N=10 · 4-6 · 40% [17–69] · -4%  | N=9 · 4-5 · 44% [19–73] · -15%  |
| ≥ +3 | — | — | — | — | N=2 · 2-0 · 100% [34–100] · — ★ | N=4 · 2-2 · 50% [15–85] · +21%  | N=13 · 9-4 · 69% [42–87] · +61%  |

---

## §4. Wallet contribution thresholds — V8 contribution-edge style
_Per-wallet `contribution = walletBase × convictionMult` (frozen on `peak.v8Scoring.walletDetails`). For each cut T we count qFor / qAg on the pick side and check predictive power._


### §4.30 — Threshold T = 30

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 6 | 4-2-0 | 66.7% [30–90] | +12.8% | +3.2u | 0.35 ✗ noise |
| qFor = 1 | 6 | 2-4-0 | 33.3% [10–70] | -36.5% | -2.3u | -0.91 ✗ noise |
| qFor = 2 | 40 | 18-22-0 | 45.0% [31–60] | -13.0% | -5.8u | -0.83 ✗ noise |
| qFor ≥ 3 | 70 | 31-37-2 | 45.6% [34–57] | -3.6% | -13.4u | -0.25 ✗ noise |

ρ(qFor, WIN) = -0.015 ✗  ·  ρ(qFor, flat ROI) = 0.069 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 11 | 4-7-0 | 36.4% [15–65] | -38.5% | -1.3u | -1.47 ✗ noise |
| margin = +1 | 28 | 12-16-0 | 42.9% [27–61] | -15.1% | -1.7u | -0.79 ✗ noise |
| margin = +2 | 41 | 19-21-1 | 47.5% [33–63] | -7.5% | -9.2u | -0.47 ✗ noise |
| margin ≥ +3 | 42 | 20-21-1 | 48.8% [34–64] | +5.7% | -6.0u | 0.29 ✗ noise |

ρ(margin, WIN) = 0.103 ✗  ·  ρ(margin, flat ROI) = 0.128 ✗

### §4.40 — Threshold T = 40

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 6 | 4-2-0 | 66.7% [30–90] | +12.8% | +3.2u | 0.35 ✗ noise |
| qFor = 1 | 16 | 7-9-0 | 43.8% [23–67] | -19.2% | -7.4u | -0.81 ✗ noise |
| qFor = 2 | 41 | 18-22-1 | 45.0% [31–60] | -12.8% | -1.8u | -0.84 ✗ noise |
| qFor ≥ 3 | 59 | 26-32-1 | 44.8% [33–58] | -2.7% | -12.2u | -0.17 ✗ noise |

ρ(qFor, WIN) = -0.024 ✗  ·  ρ(qFor, flat ROI) = 0.013 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 15 | 6-9-0 | 40.0% [20–64] | -4.1% | -2.8u | -0.10 ✗ noise |
| margin = +1 | 37 | 19-18-0 | 51.4% [36–67] | +3.3% | -2.6u | 0.19 ✗ noise |
| margin = +2 | 38 | 13-23-2 | 36.1% [22–52] | -30.2% | -12.0u | -2.04 ✓ p<.05 |
| margin ≥ +3 | 32 | 17-15-0 | 53.1% [36–69] | +5.4% | -0.7u | 0.28 ✗ noise |

ρ(margin, WIN) = 0.091 ✗  ·  ρ(margin, flat ROI) = 0.043 ✗

### §4.50 — Threshold T = 50

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 14 | 6-8-0 | 42.9% [21–67] | -20.7% | -2.7u | -0.79 ✗ noise |
| qFor = 1 | 36 | 20-16-0 | 55.6% [40–70] | +7.3% | +4.5u | 0.44 ✗ noise |
| qFor = 2 | 40 | 14-25-1 | 35.9% [23–52] | -20.9% | -14.8u | -1.08 ✗ noise |
| qFor ≥ 3 | 32 | 15-16-1 | 48.4% [32–65] | -1.5% | -5.2u | -0.08 ✗ noise |

ρ(qFor, WIN) = -0.060 ✗  ·  ρ(qFor, flat ROI) = -0.050 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 30 | 15-15-0 | 50.0% [33–67] | +15.3% | -0.5u | 0.61 ✗ noise |
| margin = +1 | 41 | 19-21-1 | 47.5% [33–63] | -6.5% | -5.5u | -0.40 ✗ noise |
| margin = +2 | 31 | 11-19-1 | 36.7% [22–54] | -30.3% | -10.3u | -1.83 ~ p<.10 |
| margin ≥ +3 | 20 | 10-10-0 | 50.0% [30–70] | -8.2% | -1.9u | -0.38 ✗ noise |

ρ(margin, WIN) = -0.005 ✗  ·  ρ(margin, flat ROI) = -0.098 ✗

### §4.60 — Threshold T = 60

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 37 | 18-19-0 | 48.6% [33–64] | -8.3% | -2.7u | -0.51 ✗ noise |
| qFor = 1 | 40 | 19-19-2 | 50.0% [35–65] | -1.0% | +1.7u | -0.06 ✗ noise |
| qFor = 2 | 24 | 8-16-0 | 33.3% [18–53] | -23.6% | -14.2u | -0.85 ✗ noise |
| qFor ≥ 3 | 21 | 10-11-0 | 47.6% [28–68] | -0.1% | -3.0u | -0.00 ✗ noise |

ρ(qFor, WIN) = -0.037 ✗  ·  ρ(qFor, flat ROI) = -0.010 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 51 | 25-25-1 | 50.0% [37–63] | +4.7% | +0.8u | 0.28 ✗ noise |
| margin = +1 | 39 | 15-23-1 | 39.5% [26–55] | -21.1% | -15.2u | -1.33 ✗ noise |
| margin = +2 | 18 | 9-9-0 | 50.0% [29–71] | -0.9% | -0.1u | -0.03 ✗ noise |
| margin ≥ +3 | 14 | 6-8-0 | 42.9% [21–67] | -22.4% | -3.7u | -0.89 ✗ noise |

ρ(margin, WIN) = 0.021 ✗  ·  ρ(margin, flat ROI) = -0.052 ✗

### §4.70 — Threshold T = 70

**Count of qFor (high-contribution sharps on side):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| qFor = 0 | 49 | 25-22-2 | 53.2% [39–67] | +0.6% | +2.1u | 0.04 ✗ noise |
| qFor = 1 | 44 | 16-28-0 | 36.4% [24–51] | -27.8% | -14.5u | -1.89 ~ p<.10 |
| qFor = 2 | 22 | 11-11-0 | 50.0% [31–69] | +9.2% | -6.4u | 0.30 ✗ noise |
| qFor ≥ 3 | 7 | 3-4-0 | 42.9% [16–75] | +11.4% | +0.6u | 0.19 ✗ noise |

ρ(qFor, WIN) = -0.061 ✗  ·  ρ(qFor, flat ROI) = -0.009 ✗

**Margin (qFor − qAgainst):**

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| margin ≤ 0 | 66 | 31-33-2 | 48.4% [37–60] | +0.3% | -1.3u | 0.02 ✗ noise |
| margin = +1 | 34 | 14-20-0 | 41.2% [26–58] | -21.3% | -14.4u | -1.27 ✗ noise |
| margin = +2 | 16 | 8-8-0 | 50.0% [28–72] | +0.4% | +0.1u | 0.01 ✗ noise |
| margin ≥ +3 | 6 | 2-4-0 | 33.3% [10–70] | -35.9% | -2.6u | -0.89 ✗ noise |

ρ(margin, WIN) = -0.018 ✗  ·  ρ(margin, flat ROI) = -0.071 ✗

### §4.cont — Continuous Δcontribution (sumContrib_For − sumContrib_Against)

Tercile cuts: low ≤ 86.3 · mid ≤ 161.7 · high > 161.7

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| Low Δcontrib | 41 | 21-20-0 | 51.2% [36–66] | +8.6% | +5.1u | 0.44 ✗ noise |
| Mid Δcontrib | 41 | 17-23-1 | 42.5% [29–58] | -17.5% | -12.7u | -1.14 ✗ noise |
| High Δcontrib | 40 | 17-22-1 | 43.6% [29–59] | -13.7% | -10.6u | -0.83 ✗ noise |

ρ(Δcontrib, WIN) = 0.052 ✗  ·  ρ(Δcontrib, flat ROI) = 0.030 ✗

---

## §5. Star tier analysis (frozen `peak.stars`)
_Does the engine's star calc add information beyond the deltas?_

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 5.0★ | 33 | 16-17-0 | 48.5% [33–65] | -15.3% | -11.4u | -0.95 ✗ noise |
| 4.5★ | 8 | 5-3-0 | 62.5% [31–86] | +39.2% | +5.4u | 0.81 ✗ noise |
| 4.0★ | 15 | 8-6-1 | 57.1% [33–79] | +16.7% | -0.8u | 0.61 ✗ noise |
| 3.5★ | 25 | 10-15-0 | 40.0% [23–59] | -4.9% | -1.3u | -0.18 ✗ noise |
| 3.0★ | 17 | 6-10-1 | 37.5% [18–61] | -21.7% | -4.5u | -0.89 ✗ noise |
| 2.5★ | 24 | 10-14-0 | 41.7% [24–61] | -20.0% | -5.5u | -1.00 ✗ noise |

### §5b. Stars × Δw stratified — does the star tier hold up within each Δw cohort?

| Δw cohort | 5★ | 4.5★ | 4★ | 3.5★ | 3★ | 2.5★ |
|---|---|---|---|---|---|---|
| Δw ≤ 0 | 3/33%/-55% | 1/0%/-100% | 3/0%/-100% | 4/25%/-48% | 9/38%/-26% | 12/25%/-51% |
| Δw = +1 | 1/100%/+27% | 2/50%/-2% | 8/57%/+10% | 17/41%/-18% | 2/0%/-100% | 8/63%/+12% |
| Δw = +2 | 17/41%/-17% | 1/100%/+91% | 3/100%/+124% | — | 3/0%/-100% | 4/50%/+8% |
| Δw ≥ +3 | 10/50%/-20% | 2/100%/+181% | 1/100%/+94% | 3/67%/+156% | 3/100%/+122% | — |

---

## §6. Odds-bucket interaction
_How does the system perform across the price ladder? Identifies under/over-priced buckets._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| −400+ | 5 | 4-1-0 | 80.0% [38–96] | +0.5% | +2.6u | 0.02 ✗ noise |
| −300/−201 | 5 | 2-3-0 | 40.0% [12–77] | -46.3% | -1.0u | -1.41 ✗ noise |
| −200/−151 | 9 | 2-7-0 | 22.2% [6–55] | -64.6% | -9.6u | -2.75 ✓ p<.01 |
| −150/−101 | 67 | 30-36-1 | 45.5% [34–57] | -13.9% | -14.4u | -1.21 ✗ noise |
| −100/+100 | 3 | 0-3-0 | 0.0% [0–56] | -100.0% | -4.5u | 0.00 ✗ noise |
| +101/+150 | 27 | 14-12-1 | 53.8% [35–71] | +17.0% | +4.7u | 0.81 ✗ noise |
| +151/+200 | 2 | 1-1-0 | 50.0% [9–91] | +49.0% | -0.5u | 0.33 ✗ noise |
| +201+ | 4 | 2-2-0 | 50.0% [15–85] | +142.5% | +4.5u | 0.98 ✗ noise |

### §6b. Odds × Δw heatmap (flat ROI %, sample size in parens)

| Odds | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| −400+ | -100% (1) | +27% (1) | — | +24% (2) |
| −300/−201 | -67% (4) | — | — | +34% (1) |
| −200/−151 | -100% (4) | -23% (2) | -100% (1) | -100% (1) |
| −150/−101 | -45% (19) | +4% (22) | -18% (16) | +16% (8) |
| −100/+100 | -100% (1) | -100% (1) | -100% (1) | — |
| +101/+150 | +39% (3) | -21% (12) | +36% (8) | +77% (4) |
| +151/+200 | — | — | +198% (1) | — |
| +201+ | — | — | -100% (1) | +223% (3) |

---

## §7. Market split (ML / SPREAD / TOTAL)
_Per-market global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| ML | 69 | 32-37-0 | 46.4% [35–58] | -3.6% | -7.9u | -0.25 ✗ noise |
| SPREAD | 20 | 5-14-1 | 26.3% [12–49] | -47.2% | -11.3u | -2.49 ✓ p<.05 |
| TOTAL | 33 | 18-14-1 | 56.3% [39–72] | +8.6% | +1.0u | 0.51 ✗ noise |

### §7b. Market × Δw cohort

| Market | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| ML | N=13 · 15% · -74% | N=20 · 45% · -17% | N=17 · 41% · -9% | N=16 · 75% · +75% |
| SPREAD | N=9 · 13% · -68% | N=5 · 20% · -62% | N=5 · 60% · +15% | N=1 · 0% · -100% |
| TOTAL | N=10 · 50% · -3% | N=13 · 67% · +27% | N=6 · 50% · -3% | N=2 · 50% · -5% |

---

## §8. Sport split (MLB / NBA / NHL)
_Per-sport global stats + Δw cohort breakdown._

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| MLB | 42 | 17-25-0 | 40.5% [27–56] | -20.4% | -8.9u | -1.34 ✗ noise |
| NBA | 63 | 28-34-1 | 45.2% [33–57] | -7.1% | -12.6u | -0.47 ✗ noise |
| NHL | 17 | 10-6-1 | 62.5% [39–82] | +22.8% | +3.2u | 0.95 ✗ noise |

### §8b. Sport × Δw cohort

| Sport | Δw ≤ 0 | Δw = +1 | Δw = +2 | Δw ≥ +3 |
|---|---|---|---|---|
| MLB | N=6 · 17% · -66% | N=16 · 38% · -27% | N=13 · 31% · -37% | N=6 · 83% · +63% |
| NBA | N=22 · 24% · -55% | N=14 · 57% · +8% | N=11 · 55% · +13% | N=12 · 58% · +47% |
| NHL | N=4 · 50% · -0% | N=8 · 57% · +1% | N=4 · 75% · +59% | N=1 · 100% · +145% |

---

## §9. Lock-criteria gates
_For each binary criterion, compare picks where it was met vs not._

| Criterion | Met N · WR · Flat ROI · t | NOT met N · WR · Flat ROI · t |
|---|---|---|
| **sharps3Plus** | 81 · 42% · -12.5% · -0.98 ✗ noise | 41 · 54% · +2.4% · 0.16 ✗ noise |
| **plusEV** | 21 · 33% · -27.8% · -0.92 ✗ noise | 101 · 48% · -3.3% · -0.32 ✗ noise |
| **pinnacleConfirms** | 40 · 53% · +9.8% · 0.50 ✗ noise | 29 · 38% · -22.2% · -1.07 ✗ noise |
| **invested10kPlus** | 64 · 45% · -4.9% · -0.33 ✗ noise | 5 · 60% · +12.8% · 0.26 ✗ noise |
| **lineMovingWith** | 76 · 49% · -0.6% · -0.05 ✗ noise | 46 · 40% · -18.8% · -1.21 ✗ noise |
| **predMarketAligns** | 34 · 50% · -0.4% · -0.02 ✗ noise | 35 · 43% · -6.8% · -0.34 ✗ noise |

### §9b. Total criteria met (0–6)

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| 0 | 6 | 5-1-0 | 83.3% [44–97] | +65.4% | +2.8u | 1.97 ✓ p<.05 |
| 1 | 27 | 10-16-1 | 38.5% [22–57] | -26.4% | -6.6u | -1.49 ✗ noise |
| 2 | 38 | 17-20-1 | 45.9% [31–62] | -2.2% | -0.3u | -0.12 ✗ noise |
| 3 | 17 | 6-11-0 | 35.3% [17–59] | -37.3% | -13.7u | -1.70 ~ p<.10 |
| 4 | 13 | 5-8-0 | 38.5% [18–64] | -19.9% | -4.8u | -0.67 ✗ noise |
| 5 | 16 | 10-6-0 | 62.5% [39–82] | +4.3% | +3.5u | 0.20 ✗ noise |
| 6 | 5 | 2-3-0 | 40.0% [12–77] | +63.0% | +0.9u | 0.56 ✗ noise |

### §9c. Regime

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLEAR_MOVE | 29 | 17-11-1 | 60.7% [42–76] | +8.9% | +3.9u | 0.52 ✗ noise |
| NEAR_START | 68 | 30-37-1 | 44.8% [33–57] | -3.7% | -8.2u | -0.26 ✗ noise |
| NO_MOVE | 6 | 2-4-0 | 33.3% [10–70] | -36.2% | -1.1u | -0.90 ✗ noise |
| SMALL_MOVE | 18 | 5-13-0 | 27.8% [12–51] | -43.8% | -13.7u | -1.90 ~ p<.10 |

### §9d. Consensus grade

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| DOMINANT | 64 | 29-34-1 | 46.0% [34–58] | -13.7% | -13.3u | -1.15 ✗ noise |
| STRONG | 30 | 14-16-0 | 46.7% [30–64] | -8.7% | +0.8u | -0.47 ✗ noise |
| LEAN | 26 | 12-13-1 | 48.0% [30–67] | +16.2% | -4.7u | 0.56 ✗ noise |
| CONTESTED | 2 | 0-2-0 | 0.0% [0–66] | -100.0% | -1.0u | 0.00 ✗ noise |

### §9e. Continuous criteria — correlation with WIN / flat ROI

| Predictor | ρ(·, WIN) | ρ(·, flat ROI) | Spearman ρ | t-stat |
|---|---|---|---|---|
| sharpCount | -0.054 ✗ | 0.011 ✗ | -0.045 | 0.12 |
| totalInvested | -0.112 ✗ | -0.103 ✗ | -0.014 | -1.13 |
| evEdge | 0.009 ✗ | 0.018 ✗ | -0.014 | 0.20 |
| moneyPct | 0.023 ✗ | -0.065 ✗ | -0.030 | -0.72 |
| walletPct | 0.080 ✗ | 0.039 ✗ | 0.064 | 0.43 |
| criteriaMet | 0.016 ✗ | 0.038 ✗ | -0.031 | 0.41 |
| maxContribFor | -0.087 ✗ | -0.059 ✗ | -0.046 | -0.64 |
| meanBaseFor | -0.080 ✗ | -0.062 ✗ | -0.046 | -0.68 |

---

## §10. CLV / line-movement diagnostic
_CLV is the gold-standard "are we beating the closing line?" metric._

Sample with CLV: **118** picks. Mean CLV = **-0.0023**.
t-statistic vs zero: -1.45 → ✗ noise · 95% CI [-0.0053, 0.0008]

Bucketed CLV vs flat PnL:

| Bucket | N | W-L-P | WR % [95% Wilson] | Flat ROI | Peak PnL | Flat t-stat |
|---|---|---|---|---|---|---|
| CLV ≤ −2% | 10 | 5-5-0 | 50.0% [24–76] | -15.1% | -1.2u | -0.53 ✗ noise |
| CLV (−2%, 0] | 63 | 28-33-2 | 45.9% [34–58] | -7.8% | -6.7u | -0.59 ✗ noise |
| CLV (0, +2%] | 34 | 17-17-0 | 50.0% [34–66] | +10.3% | -0.5u | 0.46 ✗ noise |
| CLV > +2% | 11 | 4-7-0 | 36.4% [15–65] | -37.7% | -8.8u | -1.39 ✗ noise |

ρ(CLV, flat ROI) = -0.054 ✗

---

## §11. Logistic regression — feature importance
_L2-regularized (λ=0.05) logistic regression with z-scored features. Coefficients ranked by absolute magnitude. Larger |β| ≈ stronger effect at fixed everything-else._

Trained on N=122 (with all features non-null). Intercept β₀ = -0.218.

| Rank | Feature | β (z-scaled) | Direction |
|---|---|---|---|
| 1 | Δw | +0.558 | ↑ helps |
| 2 | Δq | +0.384 | ↑ helps |
| 3 | meanBaseFor | -0.326 | ↓ hurts |
| 4 | sharpCount | -0.256 | ↓ hurts |
| 5 | log(impliedProb) | +0.122 | ↑ helps |
| 6 | qFor@T50 | -0.099 | ↓ hurts |
| 7 | walletPct | -0.092 | ↓ hurts |
| 8 | margin@T50 | +0.067 | ↑ helps |
| 9 | criteriaMet | -0.063 | ↓ hurts |
| 10 | evEdge | +0.048 | ≈ flat |
| 11 | peak.stars | -0.040 | ≈ flat |
| 12 | maxContribFor | -0.030 | ≈ flat |
| 13 | odds (American) | -0.024 | ≈ flat |
| 14 | moneyPct | -0.018 | ≈ flat |
| 15 | log10(invested) | -0.003 | ≈ flat |

---

## §12. Per-cohort sizing recommendation
_Bayesian posterior WR (Beta(5,5) prior) and half-Kelly stake at the cohort's median odds. Compares to current ladder._

| Cohort | N | W-L | WR observed | Bayesian WR | Median odds | Half-Kelly stake | Current avg | Verdict |
|---|---|---|---|---|---|---|---|---|
| Path-1 (Δw ≥ +3 ∧ Δq ≥ +1) | 19 | 13-6 | 68.4% | 62.1% | -106 | 10.93% bankroll | 1.95u | **UNDER-SIZED** — ship up to 10.93u (1u=1% bankroll) |
| Path-2 (Δw = +2 ∧ Δq ≥ +1) | 28 | 13-15 | 46.4% | 47.4% | -105 | — (mute) | 1.79u | **MUTE** (negative EV at posterior) |
| Floor-B (Δw = +1 ∧ Δq ≥ +2) | 30 | 15-14 | 51.7% | 51.3% | -104 | 0.31% bankroll | 0.95u | **OVER-SIZED** — reduce to 0.31u |
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
| 2026-04-30 | 5 | 2-2 | -0.5u | -12.7u |
| 2026-05-01 | 6 | 3-3 | -5.5u | -18.2u |

**Peak cum PnL:** +7.1u
**Max drawdown:** -25.3u
**Longest losing-day streak:** 4
**Longest winning-day streak:** 2
**Daily Sharpe-like (μ/σ):** -0.323  (annualized × √252 ≈ -5.13)

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
| 2026-04-30 | NBA | ML | home | 4.0 | 1.00 | +198 | 2 | 2 | 4 | 3 | 3 | 2 | -0.20 | W | +0.0u |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 0 | 3 | 3 | 5 | 3 | 3 | 0.20 | L | -0.8u |
| 2026-04-30 | NBA | TOTAL | under | 4.0 | 1.13 | -106 | 1 | 3 | 4 | 2 | 0 | 2 | 0.00 | W | +1.0u |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 0 | 3 | 3 | 3 | 0 | 4 | -0.60 | L | -0.8u |
| 2026-04-30 | NHL | TOTAL | over | 4.0 | 1.00 | +105 | 1 | 3 | 4 | 2 | 0 | 2 | 0.00 | P | +0.0u |
| 2026-05-01 | MLB | ML | away | 3.5 | 1.00 | -110 | 1 | 2 | 3 | 1 | 0 | 3 | -1.10 | W | +0.0u |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.50 | -115 | 1 | 3 | 4 | 1 | 0 | 1 | -1.80 | L | -0.5u |
| 2026-05-01 | NBA | ML | home | 5.0 | 3.00 | -180 | 3 | 3 | 6 | 5 | 6 | 3 | 0.10 | L | -3.0u |
| 2026-05-01 | NBA | SPREAD | home | 5.0 | 2.00 | -108 | 2 | 4 | 6 | 4 | 1 | 1 | -2.70 | L | -2.0u |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.50 | -110 | 1 | 2 | 3 | 1 | 0 | 1 | 0.00 | W | +0.0u |
| 2026-05-01 | NHL | ML | away | 4.0 | 0.50 | -114 | 2 | 1 | 3 | 0 | 0 | 5 | -0.70 | W | +0.0u |

---
_Generator: `scripts/v6FullAnalysis.js` · regenerates daily via `.github/workflows/v6-full-analysis.yml`._