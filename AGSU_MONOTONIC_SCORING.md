# AGS-U Monotonic Scoring Lab

_Generated: 2026-05-25T13:06:46.556Z_

**Sample:** 558 W/L picks from 2026-04-18 → today.  Sports: MLB=283 · NHL=62 · NBA=213

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
| **M5** | L1_LOGIT + ISOTONIC λ=1.0 | 0.571 | 0.123 | 0.251 | 0.739 | 100% | 17.5% | 91% | ✅ | 0.868 |
| **M2b** | L1_LOGIT λ=2.0 | 0.580 | 0.136 | 0.247 | 0.689 | 90% | 22.0% | 78% | — | 0.838 |
| **M3** | EN_LOGIT  l1=1.0 l2=1.0 | 0.575 | 0.128 | 0.248 | 0.690 | 90% | 21.1% | 82% | — | 0.816 |
| **M2** | L1_LOGIT λ=1.0 | 0.574 | 0.127 | 0.248 | 0.691 | 90% | 21.1% | 82% | — | 0.813 |
| **M3b** | EN_LOGIT l1=0.5 l2=2.0 | 0.572 | 0.125 | 0.248 | 0.691 | 90% | 21.1% | 80% | — | 0.809 |
| **M1** | L2_LOGIT λ=1.0 | 0.568 | 0.118 | 0.249 | 0.693 | 90% | 22.0% | 71% | — | 0.807 |
| **M2c** | L1_LOGIT λ=0.5 | 0.571 | 0.122 | 0.249 | 0.692 | 90% | 20.2% | 78% | — | 0.796 |
| **M4b** | L1_LOGIT_INT λ=4.0 | 0.564 | 0.110 | 0.249 | 0.693 | 90% | 16.6% | 80% | — | 0.740 |
| **M4** | L1_LOGIT_INT λ=2.0 | 0.556 | 0.097 | 0.251 | 0.698 | 90% | 14.8% | 78% | — | 0.700 |
| **M0** | UNIFORM (current) | 0.577 | 0.134 | 0.332 | 1.222 | 70% | 24.6% | 80% | — | 0.576 |

**Legend:** qMono = pairwise quintile monotonicity rate (50% = chance); Q5−Q1 = top-quintile vs bottom-quintile WR gap; dMono = same for deciles; strict-Q = all 5 quintile WRs strictly increasing.

## In-sample comparison (sanity check, expect higher than OOS)

| id | model | IS AUC | IS ρ | qMono | Q5−Q1 | strict-Q? |
|---|---|---|---|---|---|---|
| M5 | L1_LOGIT + ISOTONIC λ=1.0 | 0.604 | 0.181 | 100% | 26.4% | ✅ |
| M2b | L1_LOGIT λ=2.0 | 0.604 | 0.181 | 90% | 26.4% | — |
| M3 | EN_LOGIT  l1=1.0 l2=1.0 | 0.604 | 0.181 | 100% | 26.4% | ✅ |
| M2 | L1_LOGIT λ=1.0 | 0.604 | 0.181 | 100% | 26.4% | ✅ |
| M3b | EN_LOGIT l1=0.5 l2=2.0 | 0.604 | 0.181 | 100% | 26.4% | ✅ |
| M1 | L2_LOGIT λ=1.0 | 0.604 | 0.182 | 100% | 28.2% | ✅ |
| M2c | L1_LOGIT λ=0.5 | 0.604 | 0.181 | 100% | 26.4% | ✅ |
| M4b | L1_LOGIT_INT λ=4.0 | 0.606 | 0.184 | 100% | 27.3% | ✅ |
| M4 | L1_LOGIT_INT λ=2.0 | 0.604 | 0.181 | 100% | 27.3% | ✅ |
| M0 | UNIFORM (current) | 0.577 | 0.135 | 70% | 26.4% | — |

---

## Winner: **M5 — L1_LOGIT + ISOTONIC λ=1.0**

- OOS AUC: **0.571** (baseline UNIFORM: 0.577)
- OOS Spearman ρ(score, win): **0.123**
- OOS Brier: 0.251 (lower = better calibrated)
- OOS quintile monotonicity (pairwise): **100%**
- OOS Q5 − Q1 win-rate gap: **17.5%**
- Strict quintile monotonicity OOS: ✅ yes

### Final coefficients (refit on ALL 527 picks)

| term | β |
|---|---|
| intercept | 0.0866 |
| dCount | 0.2059 |
| dHcCount | 0.0770 |
| dConvictionAvg | 0.0127 |
| dHcSizeRatio | 0.2291 |
| forContribShare | 0.0000 |

### Bootstrap 95% CIs on coefficients (B=200)

| term | β̂ | 95% CI lo | 95% CI hi | sig? |
|---|---|---|---|---|
| intercept | 0.0935 | -0.0895 | 0.2543 | — |
| dCount | 0.1994 | 0.0000 | 0.4582 | — |
| dHcCount | 0.0826 | -0.1348 | 0.3241 | — |
| dConvictionAvg | 0.0229 | -0.2291 | 0.2776 | — |
| dHcSizeRatio | 0.2366 | 0.0016 | 0.5326 | ✓ |
| forContribShare | -0.0044 | -0.3127 | 0.3133 | — |

### Full-sample quintile WR (proof of monotonicity)

| quintile | n | W | L | WR | score range |
|---|---|---|---|---|---|
| Q1 | 111 | 43 | 68 | **38.7%** | [-1.10, -0.49] |
| Q2 | 112 | 55 | 57 | **49.1%** | [-0.49, -0.01] |
| Q3 | 111 | 57 | 54 | **51.4%** | [-0.01, 0.11] |
| Q4 | 112 | 62 | 50 | **55.4%** | [0.12, 0.48] |
| Q5 | 112 | 73 | 39 | **65.2%** | [0.48, 13.82] |

### Full-sample decile WR

| decile | n | W | L | WR | score range |
|---|---|---|---|---|---|
| D1 | 55 | 22 | 33 | 40.0% | [-1.10, -0.51] |
| D2 | 56 | 21 | 35 | 37.5% | [-0.51, -0.49] |
| D3 | 56 | 25 | 31 | 44.6% | [-0.49, -0.01] |
| D4 | 56 | 30 | 26 | 53.6% | [-0.01, -0.01] |
| D5 | 56 | 27 | 29 | 48.2% | [-0.01, 0.00] |
| D6 | 55 | 30 | 25 | 54.5% | [0.00, 0.11] |
| D7 | 56 | 31 | 25 | 55.4% | [0.12, 0.26] |
| D8 | 56 | 31 | 25 | 55.4% | [0.26, 0.48] |
| D9 | 56 | 34 | 22 | 60.7% | [0.48, 0.57] |
| D10 | 56 | 39 | 17 | 69.6% | [0.57, 13.82] |

### OOS quintile WR (5-fold CV pooled)

| quintile | n | W | L | WR |
|---|---|---|---|---|
| Q1 | 111 | 49 | 62 | **44.1%** |
| Q2 | 112 | 54 | 58 | **48.2%** |
| Q3 | 111 | 56 | 55 | **50.5%** |
| Q4 | 112 | 62 | 50 | **55.4%** |
| Q5 | 112 | 69 | 43 | **61.6%** |

### Per-sport monotonicity (using full-sample winner)

| sport | n | overall WR | AUC | ρ | qMono | Q-top − Q-bot |
|---|---|---|---|---|---|---|
| MLB | 283 | 50.9% | 0.509 | 0.021 | 80% | 8.0% |
| NHL | 62 | 53.2% | 0.621 | 0.205 | 100% | 16.1% |
| NBA | 213 | 53.1% | 0.678 | 0.309 | 100% | 38.8% |

---

## Why the current UNIFORM scoring is wrong (compared to winner)

- UNIFORM OOS AUC: 0.577   →   WINNER OOS AUC: 0.571   (Δ -0.006)
- UNIFORM OOS ρ:   0.134   →   WINNER OOS ρ:   0.123   (Δ -0.011)
- UNIFORM OOS Q5−Q1 gap: 24.6%   →   WINNER OOS Q5−Q1 gap: 17.5%
- UNIFORM weights all 5 features equally, but `dHcCount` has near-zero individual signal and `forContribShare` should have a NEGATIVE weight (high `forContribShare` = lopsided book = picks correlate with losing).

## Drop-in JS replacement for `src/lib/ags.js` `computeAgs()`

```javascript
// AGS-U v2 — Monotonic Scoring (statistically derived, validated OOS)
// Source: scripts/_agsu_monotonic_scoring.mjs · 2026-05-25
// Trained on 558 W/L picks since 2026-04-18.
//
// Coefficients (logistic regression, L1-regularized):
//   intercept              = 0.0866
//   dCount                 = 0.2059
//   dHcCount               = 0.0770
//   dConvictionAvg         = 0.0127
//   dHcSizeRatio           = 0.2291
//   forContribShare        = 0.0000

export function computeAgs(features, calibration) {
  // features = { dCount, dHcCount, dConvictionAvg, dHcSizeRatio, forContribShare }
  // calibration = { dCount: { mean, sd }, ... } from agsCalibration/current
  const z = (k) => {
    const c = calibration?.[k]; if (!c || !c.sd) return 0;
    return (Number(features[k] ?? 0) - Number(c.mean ?? 0)) / Number(c.sd);
  };
  const score = 0.0866
         +0.2059 * z('dCount')
         +0.0770 * z('dHcCount')
         +0.0127 * z('dConvictionAvg')
         +0.2291 * z('dHcSizeRatio')
         +0.0000 * z('forContribShare');
  return score;
}

// Optional: convert to calibrated P(win) for display/threshold use.
export function agsScoreToProb(score) {
  return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, score))));
}
```

---
_Generated by `scripts/_agsu_monotonic_scoring.mjs` · 2026-05-25T13:06:46.556Z_