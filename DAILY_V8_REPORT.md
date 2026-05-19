# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-19 ET
**Completed Picks**: 851 | **V8 Era Picks**: 289 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: MONITORING
- **Ranking health**: DEGRADED
- **Sizing health**: MARGINAL
- **Environment health**: HEALTHY
- **Most important takeaway**: Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Star inversion | ⚠️ | 4.5★ WR (61.5%) beats 5★ (50.6%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 25 | 52.0% | 0.94u | 3.8% | -1.39u | -2.5% | 0.25% | -0.63% |  |
| 7-Day | 60 | 50.0% | -2.41u | -4.0% | -13.37u | -9.3% | 0.35% | -0.70% |  |
| 14-Day | 102 | 53.9% | 2.41u | 2.4% | 2.72u | 1.2% | 0.09% | -0.56% |  |
| 30-Day | 277 | 49.8% | -8.90u | -3.2% | -13.81u | -3.0% | -0.02% | -0.39% |  |
| V8 Era | 289 | 49.8% | -10.24u | -3.5% | -11.14u | -2.4% | -0.01% | -0.42% |  |
| All Time | 851 | 52.3% | -39.76u | -4.7% | -56.02u | -4.2% | -0.29% | -0.10% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=289)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 81 | 53.8% | 53.8% | 50.6% | -3.2% | -7.8% | -5.7% | 2.80 | 0.26% | Weak |
| 4.5 | 26 | 51.5% | 51.5% | 61.5% | +10.1% | 22.8% | 17.7% | 2.69 | -0.71% | Strong |
| 4 | 47 | 53.1% | 53.1% | 48.9% | -4.2% | -7.4% | -6.0% | 1.39 | 0.23% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 25 | 54.0% | 54.0% | 44.0% | -10.0% | -10.9% | -14.7% | 1.08 | 0.03% | Weak |
| 2.5 | 38 | 52.4% | 52.4% | 42.1% | -10.3% | -17.5% | -29.0% | 0.63 | -0.30% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.6% | 61.5% | -10.9% | INVERTED |
| 4.5★ vs 4★ | 61.5% | 48.9% | +12.6% | Correct |
| 4★ vs 3.5★ | 48.9% | 51.5% | -2.6% | Flat |
| 3.5★ vs 3★ | 51.5% | 44.0% | +7.5% | Correct |
| 3★ vs 2.5★ | 44.0% | 42.1% | +1.9% | Correct |
| 2.5★ vs 2★ | 42.1% | 0.0% | +42.1% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.821 |
| Spearman: Stars vs Flat ROI | 0.750 |
| Spearman: Stars vs CLV | -0.143 |
| Brier Score | 0.2492 |
| Monotonicity Score | -0.33 |

### All Time (n=851)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 94 | 54.5% | 54.5% | 51.1% | -3.4% | -7.9% | -6.7% | 2.78 | 0.34% | Weak |
| 4.5 | 60 | 55.0% | 55.0% | 55.0% | +0.0% | 2.9% | -1.2% | 2.65 | 0.49% | Fair |
| 4 | 162 | 55.2% | 55.2% | 52.5% | -2.7% | -4.4% | -4.2% | 1.91 | -0.43% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 185 | 55.0% | 55.0% | 48.1% | -6.9% | -12.7% | -11.3% | 1.19 | -0.52% | Weak |
| 2.5 | 145 | 53.9% | 53.9% | 51.7% | -2.2% | -5.1% | -4.9% | 0.71 | -0.68% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 51.1% | 55.0% | -3.9% | INVERTED |
| 4.5★ vs 4★ | 55.0% | 52.5% | +2.5% | Correct |
| 4★ vs 3.5★ | 52.5% | 56.5% | -4.0% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.1% | +8.4% | Correct |
| 3★ vs 2.5★ | 48.1% | 51.7% | -3.6% | INVERTED |
| 2.5★ vs 2★ | 51.7% | 0.0% | +51.7% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.464 |
| Spearman: Stars vs Flat ROI | 0.536 |
| Spearman: Stars vs CLV | 0.179 |
| Brier Score | 0.2349 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.029 | 0.019 | Monitor |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.062 | -0.055 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.093 | -0.092 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.091 | -0.053 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.150 | 0.153 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.181 | 0.191 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.043 | 0.072 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.008 | 0.044 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.038 | 0.088 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.023 | 0.019 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.121 | 0.130 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.049 | -0.027 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.069 | -0.010 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.006 | 0.042 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (21.47–47.02) | 46 | 39.1% | -25.7% | -11.3% | -0.30% |  |
| p20-40 (47.06–51.50) | 47 | 57.4% | 8.6% | 21.7% | -0.05% |  |
| p40-60 (51.56–55.74) | 47 | 57.4% | 23.0% | 14.5% | 0.45% |  |
| p60-80 (55.77–61.40) | 47 | 42.6% | -16.7% | -20.9% | 0.41% |  |
| p80-95 (61.44–65.40) | 47 | 53.2% | -3.7% | -2.8% | -0.35% |  |
| p95+ (65.52–83.30) | 47 | 46.8% | -9.6% | -15.6% | -0.28% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 90 | 42.2% | -20.1% | -8.1% | -0.15% |  |
| 0.90-1.05 | 97 | 43.3% | -17.5% | -22.2% | -0.05% |  |
| 1.05-1.20 | 63 | 69.8% | 41.3% | 47.3% | 0.33% |  |
| 1.20-1.35 | 18 | 50.0% | -4.2% | -36.5% | -0.05% |  |
| 1.35-1.50 | 9 | 44.4% | -10.6% | -49.9% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.71) | 42 | 42.9% | -16.5% | -14.6% | -0.34% |  |
| 20-40% (0.72–0.95) | 43 | 48.8% | -6.7% | 10.4% | -0.46% |  |
| 40-60% (0.95–1.23) | 43 | 62.8% | 28.2% | 9.3% | 0.36% |  |
| 60-80% (1.23–1.46) | 42 | 35.7% | -29.7% | -33.6% | 0.08% |  |
| 80-95% (1.51–2.05) | 43 | 48.8% | -7.9% | 5.3% | 0.06% |  |
| 95%+ (2.06–4.76) | 43 | 51.2% | -2.3% | -7.8% | 0.40% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 21 | 42.9% | -10.9% | -30.4% | 0.53% | Broad support |
| 0.25-0.40 | 78 | 51.3% | 0.9% | -1.2% | 0.24% | Healthy support |
| 0.40-0.60 | 87 | 46.0% | -9.0% | 8.1% | 0.02% | Concentrated |
| 0.60-0.80 | 46 | 54.3% | -0.0% | -4.0% | -0.24% | Very concentrated |
| 0.80-1.00 | 24 | 41.7% | -21.4% | -28.6% | -0.70% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 40 | 40.0% | -23.5% | -19.8% | 0.01% | 4.3 |
| Broad battle | 142 | 47.2% | -5.3% | -0.5% | 0.04% | 3.9 |
| One-wallet nuke | 57 | 52.6% | -1.5% | -3.0% | -0.45% | 3.7 |
| Thin support | 129 | 51.2% | -3.8% | -7.5% | -0.15% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=289)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 12 | 41.7% | -25.5% | 3.7% | 0.34% | 4.3 | 75.0% |
| SMALL_MOVE | 50 | 42.0% | -19.3% | -24.2% | 0.03% | 3.9 | 100.0% |
| CLEAR_MOVE | 81 | 59.3% | 8.7% | 15.6% | 0.01% | 4.1 | 100.0% |
| NEAR_START | 121 | 45.5% | -6.6% | -9.9% | -0.02% | 3.7 | 100.0% |

**All Time** (n=851)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 529 | 53.5% | -5.6% | -4.6% | -0.49% | 3.2 | 3.2% |
| SMALL_MOVE | 53 | 41.5% | -20.2% | -27.1% | 0.15% | 4.0 | 94.3% |
| CLEAR_MOVE | 107 | 57.9% | 6.7% | 12.1% | -0.09% | 4.0 | 100.0% |
| NEAR_START | 137 | 46.0% | -7.3% | -10.1% | 0.02% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 7 / 57.1% / 0.8% | 16 / 37.5% / -39.4% | 37 / 64.9% / 18.3% | 40 / 47.5% / -2.4% |
| 3.5-4★ | 3 / 0.0% / -100.0% | 28 / 42.9% / -15.1% | 29 / 48.3% / -12.8% | 40 / 60.0% / 25.2% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 5 / 60.0% / 37.4% | 15 / 66.7% / 26.5% | 40 / 30.0% / -40.4% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 286 | 49.7% | -3.9% | -2.8% | 3.9 | -0.02% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 336 | 50.0% | -4.2% | -3.1% | 3.9 | -0.03% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 480 | 100% |
| LOCKED (direct) | 65 | 13.5% |
| Promoted (SHADOW→LOCKED) | 244 | 50.8% |
| Rejected (stayed SHADOW) | 125 | 26.0% |
| Superseded (side flipped) | 41 | 8.5% |
| Muted | 216 | 45.0% |
| Cancelled | 20 | 4.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=289)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -11.14u | -2.4% | — |
| Flat 1.0u | -10.24u | -3.5% | -0.90u |
| Lock units only | -8.39u | — | -2.75u |
| Units change only on star change | -1.51u | — | -9.63u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 81 | 2.80 | -7.8% | -5.7% | -6.58u | Sizing hurts |
| 4.5 | 26 | 2.69 | 22.8% | 17.7% | +6.45u | Sizing helps |
| 4 | 47 | 1.39 | -7.4% | -6.0% | -0.43u | Neutral |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 25 | 1.08 | -10.9% | -14.7% | -1.25u | Sizing hurts |
| 2.5 | 38 | 0.63 | -17.5% | -29.0% | -0.29u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=851)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -56.02u | -4.2% | — |
| Flat 1.0u | -39.76u | -4.7% | -16.26u |
| Lock units only | -42.50u | — | -13.52u |
| Units change only on star change | -45.55u | — | -10.47u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 94 | 2.78 | -7.9% | -6.7% | -10.18u | Sizing hurts |
| 4.5 | 60 | 2.65 | 2.9% | -1.2% | -3.57u | Sizing hurts |
| 4 | 162 | 1.91 | -4.4% | -4.2% | -5.67u | Sizing hurts |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 185 | 1.19 | -12.7% | -11.3% | -1.40u | Sizing hurts |
| 2.5 | 145 | 0.71 | -5.1% | -4.9% | +2.43u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 289 | 52.7% | 49.8% | -2.9% | -3.5% | -0.01% | Below market |
| 4.5-5★ | 107 | 53.3% | 53.3% | +0.0% | -0.3% | 0.02% | Neutral |
| 3.5-4★ | 115 | 52.0% | 50.4% | -1.6% | -0.2% | 0.05% | Neutral |
| 2.5-3★ | 65 | 53.1% | 44.6% | -8.4% | -11.8% | -0.19% | Below market |
| CLEAR_MOVE only | 81 | 54.2% | 59.3% | +5.1% | 8.7% | 0.01% | Beating market |
| NO_MOVE only | 12 | 54.8% | 41.7% | -13.2% | -25.5% | 0.34% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=49)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 55.598 | 46.964 | 0.76 |  |
| Rank_norm | 64.414 | 69.178 | 0.26 |  |
| PnL_norm | 54.780 | 47.515 | 0.45 |  |
| WalletBase | 56.340 | 47.643 | 0.86 |  |
| SizeRatio | 1.664 | 1.331 | 0.22 |  |
| ConvictionMult | 0.991 | 0.990 | 0.00 |  |
| WalletCountFor | 3.418 | 3.633 | 0.12 |  |
| TopShare | 0.494 | 0.509 | 0.07 |  |
| ForSide | 190.782 | 171.971 | 0.18 |  |
| AgainstSide | 62.996 | 52.835 | 0.12 |  |
| NetEdge | 1.372 | 1.271 | 0.12 |  |
| WalletPlayScore | 1.980 | 1.896 | 0.04 |  |

### V8 Era (n=256)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 55.598 | 55.809 | 0.02 |  |
| Rank_norm | 64.414 | 65.488 | 0.06 |  |
| PnL_norm | 54.780 | 55.040 | 0.02 |  |
| WalletBase | 56.340 | 56.370 | 0.00 |  |
| SizeRatio | 1.664 | 1.589 | 0.05 |  |
| ConvictionMult | 0.991 | 0.984 | 0.04 |  |
| WalletCountFor | 3.418 | 3.418 | 0.00 |  |
| TopShare | 0.494 | 0.494 | 0.00 |  |
| ForSide | 190.782 | 190.782 | 0.00 |  |
| AgainstSide | 62.996 | 62.996 | 0.00 |  |
| NetEdge | 1.372 | 1.372 | 0.00 |  |
| WalletPlayScore | 1.980 | 1.980 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=289)

- **Gate issue**: NO_MOVE ROI (-25.5%) significantly trails CLEAR_MOVE (8.7%)

### 7-Day (n=60)

- **Ranking issue**: ≤3★ WR (58%) beats ≥4★ (47%)
- **Sizing issue**: Model P/L (-13.37u) trails flat (-2.41u) by 10.96u

### All Time (n=851)

- **Sizing issue**: Model P/L (-56.02u) trails flat (-39.76u) by 16.26u
- **Environment issue**: 62.2% NO_MOVE (WR: 53.5%, ROI: -5.6%)


---

## 12. Action Board

| Priority | Issue | Evidence | Action | Owner | Status |
|---|---|---|---|---|---|
| P1 | _Review after data accumulates_ | — | — | — | Pending |
| P2 | _Review after data accumulates_ | — | — | — | Pending |

_Fill this in manually after reviewing the diagnostic sections above._

---

## 13. Keep / Tune / Cut Rules

### Keep
- Variables with stable monotonic improvement across 7-day, 14-day, and V8-era windows
- Variables that improve both flat ROI and CLV
- Variables that work inside supportive regimes without needing heroic overrides

### Tune
- Variables with mixed direction by sport or odds band
- Variables that improve WR but not ROI
- Variables that work only when paired with low concentration or supportive gate conditions

### Cut
- Variables with repeated inversion
- Variables that only add value through noise or one hot streak
- Overrides that increase size without improving rank quality

---

## 14. Required Weekly Questions

1. Are higher V8 stars still beating lower V8 stars?
2. Is WalletPlayScore monotonic by WR, ROI, and CLV?
3. Is high conviction actually helping, or only in certain ranges?
4. Is concentration penalty strong enough to suppress fake one-wallet bombs?
5. Is the lock/shadow gate improving V8 or polluting it?
6. Are certain sports or odds bands breaking V8?
7. Is the whale override helping or leaking bad exposure?
8. Did the live wallet universe drift far enough to require threshold recalibration?

---

## 15. Minimal Dashboard KPIs

| KPI | Value |
|---|---|
| V8 era picks | 289 |
| V8 flat ROI | -3.5% |
| V8 model ROI | -2.4% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | -0.3% |
| 2.5-3★ ROI | -11.8% |
| CLEAR_MOVE ROI | 8.7% |
| NO_MOVE ROI | -25.5% |
| Single-wallet play rate | 18.0% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.26% | 4.5★: -0.71% | 4★: 0.23% | 3.5★: -0.07% | 3★: 0.03% | 2.5★: -0.30% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=289)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 212 | 73.4% | 48.1% | -4.4% | -7.8% | 0.01% |
| MUTED | 66 | 22.8% | 54.5% | -1.0% | 17.9% | -0.11% |
| CANCELLED | 11 | 3.8% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 14 | 35.7% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
| ags_hard_mute | 1 | 0.0% |

### 7-Day (n=60)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 48 | 80.0% | 45.8% | -9.8% | -18.8% | 0.12% |
| MUTED | 12 | 20.0% | 66.7% | 19.3% | 25.4% | 1.28% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_quality_veto | 9 | 66.7% |
| v73_hc_rescue | 3 | 100.0% |
| winners_faded | 1 | 100.0% |
| opp_side_stronger_diag | 1 | 100.0% |
| wps_flipped_diag | 1 | 100.0% |
| dw1_no_ags_support | 1 | 100.0% |
| ags_hard_mute | 1 | 0.0% |

### All Time (n=851)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 772 | 90.7% | 51.9% | -5.4% | -6.2% | -0.29% |
| MUTED | 66 | 7.8% | 54.5% | -1.0% | 17.9% | -0.11% |
| CANCELLED | 13 | 1.5% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 18 | 66.7% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 14 | 35.7% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
| ags_hard_mute | 1 | 0.0% |
