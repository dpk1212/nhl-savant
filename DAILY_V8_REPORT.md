# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-27 ET
**Completed Picks**: 677 | **V8 Era Picks**: 115 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: NEEDS ATTENTION
- **Ranking health**: DEGRADED
- **Sizing health**: DEGRADED
- **Environment health**: HEALTHY
- **Most important takeaway**: Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Star inversion | ⚠️ | 4.5★ WR (62.5%) beats 5★ (52.4%) |
| Star inversion | ⚠️ | 3.5★ WR (51.9%) beats 4★ (46.7%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 4.7u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 39 | 48.7% | -3.45u | -8.8% | -7.99u | -14.6% | 0.24% | -0.11% |  |
| 7-Day | 95 | 45.3% | -9.36u | -9.9% | -18.75u | -15.2% | 0.20% | -0.36% |  |
| 14-Day | 215 | 46.0% | -24.15u | -11.2% | -31.66u | -10.5% | 0.12% | -0.49% |  |
| 30-Day | 632 | 51.9% | -45.18u | -7.1% | -68.90u | -7.3% | -0.32% | -0.10% |  |
| V8 Era | 115 | 47.0% | -7.89u | -6.9% | -12.60u | -8.4% | 0.23% | -0.41% |  |
| All Time | 677 | 52.4% | -37.40u | -5.5% | -57.48u | -5.6% | -0.32% | -0.04% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=115)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 21 | 55.6% | 55.6% | 52.4% | -3.2% | -10.5% | -8.7% | 2.40 | 0.79% | Weak |
| 4.5 | 8 | 50.4% | 50.4% | 62.5% | +12.1% | 39.2% | 34.8% | 1.94 | -0.68% | Strong |
| 4 | 15 | 53.1% | 53.1% | 46.7% | -6.4% | -9.5% | -9.6% | 1.40 | 0.34% | Weak |
| 3.5 | 27 | 49.2% | 49.2% | 51.9% | +2.7% | 14.3% | 8.4% | 0.82 | 0.28% | Strong |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 22 | 53.5% | 53.5% | 40.9% | -12.6% | -21.4% | -34.9% | 0.80 | 0.09% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.4% | 62.5% | -10.1% | INVERTED |
| 4.5★ vs 4★ | 62.5% | 46.7% | +15.8% | Correct |
| 4★ vs 3.5★ | 46.7% | 51.9% | -5.2% | INVERTED |
| 3.5★ vs 3★ | 51.9% | 38.1% | +13.8% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.9% | -2.8% | Flat |
| 2.5★ vs 2★ | 40.9% | 0.0% | +40.9% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | 0.071 |
| Brier Score | 0.2582 |
| Monotonicity Score | 0.00 |

### All Time (n=677)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 34 | 56.8% | 56.8% | 52.9% | -3.8% | -9.8% | -10.7% | 2.50 | 0.82% | Weak |
| 4.5 | 42 | 56.3% | 56.3% | 52.4% | -3.9% | -2.6% | -8.5% | 2.48 | 1.08% | Fair |
| 4 | 130 | 55.6% | 55.6% | 53.1% | -2.6% | -4.0% | -4.1% | 2.04 | -0.60% | Fair |
| 3.5 | 145 | 55.4% | 55.4% | 57.9% | +2.6% | 3.0% | 3.4% | 1.59 | -0.24% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 129 | 54.3% | 54.3% | 52.7% | -1.6% | -4.2% | -4.3% | 0.74 | -0.66% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.9% | 52.4% | +0.5% | Correct |
| 4.5★ vs 4★ | 52.4% | 53.1% | -0.7% | Flat |
| 4★ vs 3.5★ | 53.1% | 57.9% | -4.8% | INVERTED |
| 3.5★ vs 3★ | 57.9% | 47.5% | +10.4% | Correct |
| 3★ vs 2.5★ | 47.5% | 52.7% | -5.2% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.464 |
| Spearman: Stars vs CLV | 0.500 |
| Brier Score | 0.2327 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.175 | 0.141 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | 0.018 | -0.010 | Monitor |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.072 | -0.009 | Keep |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.136 | 0.073 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.112 | 0.105 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.160 | 0.159 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.201 | 0.149 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.029 | 0.092 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.071 | 0.095 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.041 | 0.076 | Keep |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.091 | 0.138 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.021 | -0.101 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.021 | -0.097 | Monitor |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.013 | 0.102 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–49.25) | 17 | 47.1% | 2.3% | 6.5% | 0.25% |  |
| p20-40 (49.40–52.58) | 18 | 33.3% | -43.5% | -27.6% | 0.73% |  |
| p40-60 (53.07–56.56) | 18 | 50.0% | 21.3% | -3.7% | -0.10% |  |
| p60-80 (57.23–61.50) | 18 | 44.4% | -12.5% | -9.8% | 0.91% |  |
| p80-95 (61.97–65.33) | 18 | 61.1% | 11.5% | 18.3% | -0.40% |  |
| p95+ (65.40–74.70) | 18 | 38.9% | -27.4% | -43.7% | 0.08% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 39 | 41.0% | -20.2% | -23.1% | -0.03% |  |
| 0.90-1.05 | 30 | 40.0% | -26.1% | -28.0% | 0.27% |  |
| 1.05-1.20 | 28 | 57.1% | 27.3% | 23.4% | 0.45% |  |
| 1.20-1.35 | 5 | 60.0% | 16.6% | -23.7% | 0.27% |  |
| 1.35-1.50 | 4 | 25.0% | -55.8% | -66.0% | 0.88% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.72) | 17 | 41.2% | -21.2% | -14.2% | 0.63% |  |
| 20-40% (0.73–0.93) | 18 | 50.0% | -8.1% | 2.6% | -0.26% |  |
| 40-60% (0.98–1.24) | 18 | 55.6% | 37.8% | -12.1% | 0.36% |  |
| 60-80% (1.24–1.53) | 18 | 33.3% | -45.5% | -27.2% | 0.23% |  |
| 80-95% (1.58–2.22) | 18 | 44.4% | -15.8% | -12.2% | 0.06% |  |
| 95%+ (2.39–4.76) | 18 | 50.0% | 3.2% | -9.4% | 0.47% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 9 | 44.4% | 2.5% | -8.1% | 0.74% | Broad support |
| 0.25-0.40 | 37 | 51.4% | 7.3% | -3.7% | 0.52% | Healthy support |
| 0.40-0.60 | 35 | 40.0% | -21.0% | -20.4% | 0.08% | Concentrated |
| 0.60-0.80 | 23 | 47.8% | -13.8% | -18.7% | -0.12% | Very concentrated |
| 0.80-1.00 | 3 | 33.3% | -36.6% | -59.6% | 0.07% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 19 | 42.1% | -20.8% | -14.7% | -0.14% | 3.7 |
| Broad battle | 64 | 48.4% | 1.3% | -5.1% | 0.48% | 3.6 |
| One-wallet nuke | 11 | 54.5% | -2.5% | 18.5% | 0.06% | 3.9 |
| Thin support | 47 | 48.9% | -9.6% | -7.1% | 0.11% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=115)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 7 | 42.9% | -14.9% | -8.3% | 0.46% | 4.3 | 57.1% |
| SMALL_MOVE | 18 | 27.8% | -49.5% | -51.4% | 0.58% | 3.8 | 100.0% |
| CLEAR_MOVE | 29 | 55.2% | -3.3% | 6.7% | 0.15% | 3.8 | 100.0% |
| NEAR_START | 61 | 49.2% | 5.0% | -5.3% | 0.13% | 3.4 | 100.0% |

**All Time** (n=677)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 524 | 53.6% | -5.3% | -4.9% | -0.50% | 3.2 | 2.3% |
| SMALL_MOVE | 21 | 28.6% | -47.4% | -51.3% | 0.81% | 3.9 | 85.7% |
| CLEAR_MOVE | 55 | 54.5% | -1.5% | 4.0% | -0.11% | 3.8 | 100.0% |
| NEAR_START | 77 | 49.4% | 1.4% | -7.1% | 0.18% | 3.4 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 5 / 40.0% / -18.6% | 4 / 25.0% / -63.4% | 11 / 63.6% / 4.3% | 9 / 66.7% / 43.5% |
| 3.5-4★ | — | 12 / 33.3% / -36.4% | 7 / 42.9% / -19.6% | 23 / 60.9% / 35.5% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 1 / 0.0% / -100.0% | 11 / 54.5% / -0.6% | 29 / 34.5% / -31.2% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 112 | 46.4% | -7.9% | -10.0% | 3.6 | 0.22% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 162 | 48.1% | -7.2% | -7.9% | 3.7 | 0.13% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 154 | 100% |
| LOCKED (direct) | 58 | 37.7% |
| Promoted (SHADOW→LOCKED) | 58 | 37.7% |
| Rejected (stayed SHADOW) | 27 | 17.5% |
| Superseded (side flipped) | 6 | 3.9% |
| Muted | 45 | 29.2% |
| Cancelled | 7 | 4.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=115)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -12.60u | -8.4% | — |
| Flat 1.0u | -7.89u | -6.9% | -4.71u |
| Lock units only | -7.21u | — | -5.39u |
| Units change only on star change | -10.75u | — | -1.85u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 21 | 2.40 | -10.5% | -8.7% | -2.19u | Sizing hurts |
| 4.5 | 8 | 1.94 | 39.2% | 34.8% | +2.27u | Sizing helps |
| 4 | 15 | 1.40 | -9.5% | -9.6% | -0.58u | Sizing hurts |
| 3.5 | 27 | 0.82 | 14.3% | 8.4% | -2.01u | Sizing hurts |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 22 | 0.80 | -21.4% | -34.9% | -1.43u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=677)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -57.48u | -5.6% | — |
| Flat 1.0u | -37.40u | -5.5% | -20.08u |
| Lock units only | -41.33u | — | -16.15u |
| Units change only on star change | -54.79u | — | -2.69u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 34 | 2.50 | -9.8% | -10.7% | -5.79u | Sizing hurts |
| 4.5 | 42 | 2.48 | -2.6% | -8.5% | -7.75u | Sizing hurts |
| 4 | 130 | 2.04 | -4.0% | -4.1% | -5.82u | Sizing hurts |
| 3.5 | 145 | 1.59 | 3.0% | 3.4% | +3.30u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 129 | 0.74 | -4.2% | -4.3% | +1.28u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 115 | 53.0% | 47.0% | -6.0% | -6.9% | 0.23% | Below market |
| 4.5-5★ | 29 | 54.2% | 55.2% | +1.0% | 3.2% | 0.38% | Neutral |
| 3.5-4★ | 42 | 50.6% | 50.0% | -0.6% | 5.8% | 0.30% | Neutral |
| 2.5-3★ | 43 | 54.6% | 39.5% | -15.0% | -23.8% | 0.04% | Below market |
| CLEAR_MOVE only | 29 | 54.4% | 55.2% | +0.8% | -3.3% | 0.15% | Neutral |
| NO_MOVE only | 7 | 52.4% | 42.9% | -9.6% | -14.9% | 0.46% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=92)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 55.807 | 56.287 | 0.05 |  |
| Rank_norm | 65.198 | 67.193 | 0.13 |  |
| PnL_norm | 57.962 | 59.354 | 0.11 |  |
| WalletBase | 57.303 | 58.201 | 0.11 |  |
| SizeRatio | 1.791 | 1.738 | 0.03 |  |
| ConvictionMult | 0.987 | 0.978 | 0.05 |  |
| WalletCountFor | 3.505 | 3.435 | 0.04 |  |
| TopShare | 0.458 | 0.466 | 0.04 |  |
| ForSide | 201.667 | 199.360 | 0.02 |  |
| AgainstSide | 64.564 | 67.824 | 0.04 |  |
| NetEdge | 1.468 | 1.417 | 0.05 |  |
| WalletPlayScore | 2.276 | 2.191 | 0.04 |  |

### V8 Era (n=107)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 55.807 | 55.807 | 0.00 |  |
| Rank_norm | 65.198 | 65.198 | 0.00 |  |
| PnL_norm | 57.962 | 57.962 | 0.00 |  |
| WalletBase | 57.303 | 57.303 | 0.00 |  |
| SizeRatio | 1.791 | 1.791 | 0.00 |  |
| ConvictionMult | 0.987 | 0.987 | 0.00 |  |
| WalletCountFor | 3.505 | 3.505 | 0.00 |  |
| TopShare | 0.458 | 0.458 | 0.00 |  |
| ForSide | 201.667 | 201.667 | 0.00 |  |
| AgainstSide | 64.564 | 64.564 | 0.00 |  |
| NetEdge | 1.468 | 1.468 | 0.00 |  |
| WalletPlayScore | 2.276 | 2.276 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=115)

- **Sizing issue**: Model P/L (-12.60u) trails flat (-7.89u) by 4.71u
- **Concentration issue**: 26 high-concentration picks (TopShare>0.6) at -16.4% ROI

### 7-Day (n=95)

- **Sizing issue**: Model P/L (-18.75u) trails flat (-9.36u) by 9.39u
- **Concentration issue**: 24 high-concentration picks (TopShare>0.6) at -18.0% ROI

### All Time (n=677)

- **Sizing issue**: Model P/L (-57.48u) trails flat (-37.40u) by 20.08u
- **Environment issue**: 77.4% NO_MOVE (WR: 53.6%, ROI: -5.3%)
- **Concentration issue**: 26 high-concentration picks (TopShare>0.6) at -16.4% ROI


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
| V8 era picks | 115 |
| V8 flat ROI | -6.9% |
| V8 model ROI | -8.4% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 3.2% |
| 2.5-3★ ROI | -23.8% |
| CLEAR_MOVE ROI | -3.3% |
| NO_MOVE ROI | -14.9% |
| Single-wallet play rate | 9.6% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.79% | 4.5★: -0.68% | 4★: 0.34% | 3.5★: 0.28% | 3★: -0.02% | 2.5★: 0.09% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=115)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 87 | 75.7% | 46.0% | -6.0% | -9.4% | 0.25% |
| MUTED | 23 | 20.0% | 47.8% | -13.9% | -13.4% | -0.12% |
| CANCELLED | 5 | 4.3% | 60.0% | 10.3% | 21.1% | 1.57% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 7 | 28.6% |
| wps_flipped_diag | 6 | 33.3% |
| winners_faded | 5 | 60.0% |
| winners_below_floor | 4 | 25.0% |
| quality_below_floor | 4 | 75.0% |
| whitelist_fade_weak | 3 | 66.7% |
| winners_killed | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |
| opp_side_stronger_diag | 1 | 100.0% |

### 7-Day (n=95)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 69 | 72.6% | 43.5% | -10.9% | -19.8% | 0.18% |
| MUTED | 21 | 22.1% | 47.6% | -11.3% | -10.5% | -0.07% |
| CANCELLED | 5 | 5.3% | 60.0% | 10.3% | 21.1% | 1.57% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| wps_flipped_diag | 6 | 33.3% |
| below_lock_range | 5 | 20.0% |
| winners_faded | 5 | 60.0% |
| winners_below_floor | 4 | 25.0% |
| quality_below_floor | 4 | 75.0% |
| whitelist_fade_weak | 3 | 66.7% |
| winners_killed | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |
| opp_side_stronger_diag | 1 | 100.0% |

### All Time (n=677)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 647 | 95.6% | 52.4% | -5.8% | -5.9% | -0.33% |
| MUTED | 23 | 3.4% | 47.8% | -13.9% | -13.4% | -0.12% |
| CANCELLED | 7 | 1.0% | 71.4% | 44.8% | 42.3% | -0.88% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 7 | 28.6% |
| wps_flipped_diag | 6 | 33.3% |
| winners_faded | 5 | 60.0% |
| winners_below_floor | 4 | 25.0% |
| quality_below_floor | 4 | 75.0% |
| whitelist_fade_weak | 3 | 66.7% |
| winners_killed | 3 | 66.7% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| opp_side_stronger_diag | 1 | 100.0% |
