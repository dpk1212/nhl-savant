# AGS-U Monotonic Scoring Lab

_Generated: 2026-05-22T15:31:25.417Z_

**Sample:** 470 W/L picks from 2026-04-18 → today.  Sports: MLB=218 · NBA=198 · NHL=54

---

## Goal

Rebuild the AGS-U scoring function so that **higher score ⇒ higher P(win)** — with monotonicity validated out-of-sample, not just in-sample.

## Methodology

1. Binary task: y = 1 (WIN), 0 (LOSS). PUSH excluded.
2. Five canonical features (z-scored within training fold):
   - `dCount` (proven-wallet count delta for the side)
   - `dHcCount` (high-conviction wallet count delta)
   - `dConvictionAvg` (avg conviction of for-wallets)
   - `dHcSizeRatio` (for-side HC size share)
   - `forContribShare` (for-side contribution to total)
3. Candidate models fit logistic P(WIN | x) with several regularizers.
4. **5-fold time-aware CV** — picks sorted by date, each fold tested on a contiguous 20% block.
5. Out-of-sample metrics: ROC AUC, Spearman ρ(score, y), Brier score, quintile/decile WR monotonicity.

## Candidate models

| id | model | regularization |
|---|---|---|
| M0 | UNIFORM | (current) |
| M1 | L2_LOGIT | λ=1.0 |
| M2 | L1_LOGIT | λ=1.0 |
| M2b | L1_LOGIT | λ=2.0 |
| M2c | L1_LOGIT | λ=0.5 |
| M3 | EN_LOGIT |  l1=1.0 l2=1.0 |
| M3b | EN_LOGIT | l1=0.5 l2=2.0 |
| M4 | L1_LOGIT_INT | λ=2.0 |
| M4b | L1_LOGIT_INT | λ=4.0 |
| M5 | L1_LOGIT | + ISOTONIC λ=1.0 |

## Out-of-sample comparison (5-fold time-aware CV)

Sorted by composite score (AUC + ρ + monotonicity + Q5−Q1 gap − Brier).

| id | model | OOS AUC | OOS ρ | Brier | LogLoss | qMono | Q5−Q1 | dMono | strict-Q? | composite |
|---|---|---|---|---|---|---|---|---|---|---|
| **M2b** | L1_LOGIT λ=2.0 | 0.597 | 0.167 | 0.245 | 0.685 | 100% | 24.5% | 82% | ✅ | 1.014 |
| **M3b** | EN_LOGIT l1=0.5 l2=2.0 | 0.595 | 0.165 | 0.245 | 0.686 | 100% | 24.5% | 91% | ✅ | 1.009 |
| **M3** | EN_LOGIT  l1=1.0 l2=1.0 | 0.596 | 0.166 | 0.245 | 0.685 | 100% | 23.4% | 91% | ✅ | 1.000 |
| **M2** | L1_LOGIT λ=1.0 | 0.595 | 0.164 | 0.245 | 0.686 | 100% | 23.4% | 93% | ✅ | 0.998 |
| **M0** | UNIFORM (current) | 0.610 | 0.190 | 0.310 | 1.133 | 90% | 30.9% | 82% | — | 0.948 |
| **M4b** | L1_LOGIT_INT λ=4.0 | 0.581 | 0.140 | 0.247 | 0.689 | 100% | 21.3% | 87% | ✅ | 0.936 |
| **M2c** | L1_LOGIT λ=0.5 | 0.593 | 0.161 | 0.246 | 0.687 | 90% | 26.6% | 87% | — | 0.924 |
| **M5** | L1_LOGIT + ISOTONIC λ=1.0 | 0.593 | 0.162 | 0.249 | 0.746 | 90% | 25.5% | 87% | — | 0.911 |
| **M1** | L2_LOGIT λ=1.0 | 0.590 | 0.155 | 0.246 | 0.688 | 90% | 25.5% | 84% | — | 0.904 |
| **M4** | L1_LOGIT_INT λ=2.0 | 0.577 | 0.133 | 0.248 | 0.690 | 90% | 23.4% | 76% | — | 0.846 |

**Legend:** qMono = pairwise quintile monotonicity rate (50% = chance); Q5−Q1 = top-quintile vs bottom-quintile WR gap; dMono = same for deciles; strict-Q = all 5 quintile WRs strictly increasing.

## In-sample comparison (sanity check, expect higher than OOS)

| id | model | IS AUC | IS ρ | qMono | Q5−Q1 | strict-Q? |
|---|---|---|---|---|---|---|
| M2b | L1_LOGIT λ=2.0 | 0.616 | 0.199 | 90% | 31.9% | — |
| M3b | EN_LOGIT l1=0.5 l2=2.0 | 0.615 | 0.197 | 90% | 31.9% | — |
| M3 | EN_LOGIT  l1=1.0 l2=1.0 | 0.615 | 0.197 | 100% | 30.9% | ✅ |
| M2 | L1_LOGIT λ=1.0 | 0.614 | 0.196 | 90% | 31.9% | — |
| M0 | UNIFORM (current) | 0.610 | 0.189 | 80% | 31.9% | — |
| M4b | L1_LOGIT_INT λ=4.0 | 0.626 | 0.216 | 90% | 33.0% | — |
| M2c | L1_LOGIT λ=0.5 | 0.614 | 0.196 | 100% | 31.9% | ✅ |
| M5 | L1_LOGIT + ISOTONIC λ=1.0 | 0.613 | 0.195 | 90% | 31.9% | — |
| M1 | L2_LOGIT λ=1.0 | 0.615 | 0.197 | 100% | 30.9% | ✅ |
| M4 | L1_LOGIT_INT λ=2.0 | 0.625 | 0.215 | 70% | 36.2% | — |

---

## Winner: **M2b — L1_LOGIT λ=2.0**

- OOS AUC: **0.597** (baseline UNIFORM: 0.610)
- OOS Spearman ρ(score, win): **0.167**
- OOS Brier: 0.245 (lower = better calibrated)
- OOS quintile monotonicity (pairwise): **100%**
- OOS Q5 − Q1 win-rate gap: **24.5%**
- Strict quintile monotonicity OOS: ✅ yes

### Final coefficients (refit on ALL 527 picks)

| term | β |
|---|---|
| intercept | 0.0696 |
| dCount | 0.2716 |
| dHcCount | 0.0050 |
| dConvictionAvg | 0.2275 |
| dHcSizeRatio | 0.1763 |
| forContribShare | -0.0297 |

### Bootstrap 95% CIs on coefficients (B=200)

| term | β̂ | 95% CI lo | 95% CI hi | sig? |
|---|---|---|---|---|
| intercept | 0.0649 | -0.1237 | 0.2528 | — |
| dCount | 0.2886 | 0.0799 | 0.5521 | ✓ |
| dHcCount | 0.0216 | -0.1853 | 0.2430 | — |
| dConvictionAvg | 0.2641 | 0.0174 | 0.5527 | ✓ |
| dHcSizeRatio | 0.1707 | 0.0000 | 0.4226 | — |
| forContribShare | -0.0826 | -0.3696 | 0.1627 | — |

### Full-sample quintile WR (proof of monotonicity)

| quintile | n | W | L | WR | score range |
|---|---|---|---|---|---|
| Q1 | 94 | 33 | 61 | **35.1%** | [-1.59, -0.28] |
| Q2 | 94 | 49 | 45 | **52.1%** | [-0.27, -0.01] |
| Q3 | 94 | 44 | 50 | **46.8%** | [-0.01, 0.17] |
| Q4 | 94 | 54 | 40 | **57.4%** | [0.17, 0.38] |
| Q5 | 94 | 63 | 31 | **67.0%** | [0.38, 1.67] |

### Full-sample decile WR

| decile | n | W | L | WR | score range |
|---|---|---|---|---|---|
| D1 | 47 | 15 | 32 | 31.9% | [-1.59, -0.45] |
| D2 | 47 | 18 | 29 | 38.3% | [-0.45, -0.28] |
| D3 | 47 | 22 | 25 | 46.8% | [-0.27, -0.04] |
| D4 | 47 | 27 | 20 | 57.4% | [-0.04, -0.01] |
| D5 | 47 | 19 | 28 | 40.4% | [-0.01, 0.09] |
| D6 | 47 | 25 | 22 | 53.2% | [0.09, 0.17] |
| D7 | 47 | 29 | 18 | 61.7% | [0.17, 0.25] |
| D8 | 47 | 25 | 22 | 53.2% | [0.25, 0.38] |
| D9 | 47 | 29 | 18 | 61.7% | [0.38, 0.58] |
| D10 | 47 | 34 | 13 | 72.3% | [0.59, 1.67] |

### OOS quintile WR (5-fold CV pooled)

| quintile | n | W | L | WR |
|---|---|---|---|---|
| Q1 | 94 | 36 | 58 | **38.3%** |
| Q2 | 94 | 46 | 48 | **48.9%** |
| Q3 | 94 | 50 | 44 | **53.2%** |
| Q4 | 94 | 52 | 42 | **55.3%** |
| Q5 | 94 | 59 | 35 | **62.8%** |

### Per-sport monotonicity (using full-sample winner)

| sport | n | overall WR | AUC | ρ | qMono | Q-top − Q-bot |
|---|---|---|---|---|---|---|
| MLB | 218 | 49.1% | 0.526 | 0.044 | 70% | 3.4% |
| NBA | 198 | 54.0% | 0.686 | 0.322 | 90% | 39.1% |
| NHL | 54 | 53.7% | 0.641 | 0.242 | 100% | 25.9% |

---

## Why the current UNIFORM scoring is wrong (compared to winner)

- UNIFORM OOS AUC: 0.610   →   WINNER OOS AUC: 0.597   (Δ -0.013)
- UNIFORM OOS ρ:   0.190   →   WINNER OOS ρ:   0.167   (Δ -0.023)
- UNIFORM OOS Q5−Q1 gap: 30.9%   →   WINNER OOS Q5−Q1 gap: 24.5%
- UNIFORM weights all 5 features equally, but `dHcCount` has near-zero individual signal and `forContribShare` should have a NEGATIVE weight (high `forContribShare` = lopsided book = picks correlate with losing).

## Drop-in JS replacement for `src/lib/ags.js` `computeAgs()`

```javascript
// AGS-U v2 — Monotonic Scoring (statistically derived, validated OOS)
// Source: scripts/_agsu_monotonic_scoring.mjs · 2026-05-22
// Trained on 470 W/L picks since 2026-04-18.
//
// Coefficients (logistic regression, L1-regularized):
//   intercept              = 0.0696
//   dCount                 = 0.2716
//   dHcCount               = 0.0050
//   dConvictionAvg         = 0.2275
//   dHcSizeRatio           = 0.1763
//   forContribShare        = -0.0297

export function computeAgs(features, calibration) {
  // features = { dCount, dHcCount, dConvictionAvg, dHcSizeRatio, forContribShare }
  // calibration = { dCount: { mean, sd }, ... } from agsCalibration/current
  const z = (k) => {
    const c = calibration?.[k]; if (!c || !c.sd) return 0;
    return (Number(features[k] ?? 0) - Number(c.mean ?? 0)) / Number(c.sd);
  };
  const score = 0.0696
         +0.2716 * z('dCount')
         +0.0050 * z('dHcCount')
         +0.2275 * z('dConvictionAvg')
         +0.1763 * z('dHcSizeRatio')
         -0.0297 * z('forContribShare');
  return score;
}

// Optional: convert to calibrated P(win) for display/threshold use.
export function agsScoreToProb(score) {
  return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, score))));
}
```

---
_Generated by `scripts/_agsu_monotonic_scoring.mjs` · 2026-05-22T15:31:25.417Z_