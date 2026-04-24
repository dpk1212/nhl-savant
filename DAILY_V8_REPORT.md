# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-24 ET
**Completed Picks**: 638 | **V8 Era Picks**: 76 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 3.5★ WR (54.5%) beats 4★ (37.5%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 40 | 40.0% | -5.53u | -13.8% | -7.55u | -13.8% | 0.45% | -0.68% | Cold streak |
| 7-Day | 87 | 43.7% | -9.76u | -11.2% | -11.76u | -10.4% | 0.19% | -0.53% | Cold streak |
| 14-Day | 291 | 48.1% | -27.26u | -9.4% | -47.42u | -11.7% | -0.23% | -0.32% |  |
| 30-Day | 638 | 52.7% | -33.95u | -5.3% | -49.49u | -5.1% | -0.37% | -0.04% |  |
| V8 Era | 76 | 46.1% | -4.44u | -5.8% | -4.61u | -4.9% | 0.22% | -0.59% |  |
| All Time | 638 | 52.7% | -33.95u | -5.3% | -49.49u | -5.1% | -0.37% | -0.04% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=76)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 6 | 62.5% | 62.5% | 66.7% | +4.1% | 9.3% | 4.1% | 2.50 | 0.93% | Strong |
| 4.5 | 8 | 50.4% | 50.4% | 62.5% | +12.1% | 39.2% | 34.8% | 1.94 | -0.68% | Strong |
| 4 | 8 | 54.4% | 54.4% | 37.5% | -16.9% | -26.0% | -9.0% | 1.70 | 0.99% | Failing |
| 3.5 | 11 | 46.9% | 46.9% | 54.5% | +7.6% | 38.1% | 21.9% | 1.05 | 0.46% | Strong |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 21 | 53.2% | 53.2% | 42.9% | -10.3% | -17.6% | -28.8% | 0.76 | 0.16% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 66.7% | 62.5% | +4.2% | Correct |
| 4.5★ vs 4★ | 62.5% | 37.5% | +25.0% | Correct |
| 4★ vs 3.5★ | 37.5% | 54.5% | -17.0% | INVERTED |
| 3.5★ vs 3★ | 54.5% | 38.1% | +16.4% | Correct |
| 3★ vs 2.5★ | 38.1% | 42.9% | -4.8% | INVERTED |
| 2.5★ vs 2★ | 42.9% | 0.0% | +42.9% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.750 |
| Spearman: Stars vs Flat ROI | 0.679 |
| Spearman: Stars vs CLV | 0.143 |
| Brier Score | 0.2707 |
| Monotonicity Score | -0.33 |

### All Time (n=638)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 19 | 59.8% | 59.8% | 57.9% | -1.9% | -3.1% | -8.3% | 2.61 | 0.90% | Fair |
| 4.5 | 42 | 56.3% | 56.3% | 52.4% | -3.9% | -2.6% | -8.5% | 2.48 | 1.08% | Fair |
| 4 | 123 | 55.9% | 55.9% | 52.8% | -3.0% | -4.7% | -4.0% | 2.10 | -0.61% | Fair |
| 3.5 | 129 | 55.9% | 55.9% | 58.9% | +3.0% | 3.7% | 3.8% | 1.70 | -0.30% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 128 | 54.2% | 54.2% | 53.1% | -1.1% | -3.5% | -2.8% | 0.74 | -0.65% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 57.9% | 52.4% | +5.5% | Correct |
| 4.5★ vs 4★ | 52.4% | 52.8% | -0.4% | Flat |
| 4★ vs 3.5★ | 52.8% | 58.9% | -6.1% | INVERTED |
| 3.5★ vs 3★ | 58.9% | 47.5% | +11.4% | Correct |
| 3★ vs 2.5★ | 47.5% | 53.1% | -5.6% | INVERTED |
| 2.5★ vs 2★ | 53.1% | 0.0% | +53.1% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.464 |
| Spearman: Stars vs Flat ROI | 0.607 |
| Spearman: Stars vs CLV | 0.500 |
| Brier Score | 0.2326 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.126 | 0.140 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | 0.165 | 0.119 | Keep |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.079 | 0.053 | Keep |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.135 | 0.139 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.196 | 0.190 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.224 | 0.232 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.263 | 0.274 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.108 | 0.163 | Keep |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.077 | 0.082 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.137 | 0.174 | Keep |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.126 | 0.160 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | -0.085 | -0.180 | Keep |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | -0.093 | -0.188 | Keep |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.117 | 0.191 | Keep |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–48.10) | 11 | 27.3% | -47.7% | -35.0% | 0.13% |  |
| p20-40 (48.22–50.80) | 11 | 36.4% | -10.5% | -26.8% | 0.33% |  |
| p40-60 (50.93–53.53) | 12 | 50.0% | -14.5% | -8.5% | 0.93% |  |
| p60-80 (53.90–56.56) | 11 | 54.5% | 42.2% | 28.6% | -0.18% |  |
| p80-95 (57.23–61.33) | 11 | 27.3% | -42.2% | -47.0% | 0.56% |  |
| p95+ (61.44–74.70) | 12 | 66.7% | 24.1% | 16.3% | -0.36% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 20 | 30.0% | -40.7% | -55.4% | -0.47% |  |
| 0.90-1.05 | 21 | 42.9% | -20.0% | -16.0% | 0.13% |  |
| 1.05-1.20 | 20 | 55.0% | 32.5% | 29.8% | 0.75% |  |
| 1.20-1.35 | 4 | 75.0% | 45.7% | 27.1% | 0.54% |  |
| 1.35-1.50 | 2 | 0.0% | -100.0% | -100.0% | 1.50% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.73) | 11 | 27.3% | -48.6% | -65.1% | 0.72% |  |
| 20-40% (0.75–1.00) | 11 | 54.5% | -1.3% | -22.6% | -0.27% |  |
| 40-60% (1.00–1.26) | 12 | 41.7% | 20.7% | -12.7% | 0.26% |  |
| 60-80% (1.27–1.52) | 11 | 45.5% | -24.1% | -7.1% | -0.20% |  |
| 80-95% (1.60–2.22) | 11 | 45.5% | -4.6% | 5.9% | 0.56% |  |
| 95%+ (2.56–4.76) | 12 | 50.0% | 7.6% | 7.4% | 0.31% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 8 | 50.0% | 15.3% | 3.5% | 0.74% | Broad support |
| 0.25-0.40 | 27 | 55.6% | 20.5% | 17.1% | 0.16% | Healthy support |
| 0.40-0.60 | 21 | 23.8% | -54.5% | -58.0% | 0.29% | Concentrated |
| 0.60-0.80 | 11 | 54.5% | 3.9% | -37.4% | -0.08% | Very concentrated |
| 0.80-1.00 | 1 | 0.0% | -100.0% | -100.0% | 0.67% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 15 | 40.0% | -24.7% | -16.0% | 0.18% | 3.6 |
| Broad battle | 43 | 46.5% | 1.0% | -1.3% | 0.33% | 3.2 |
| One-wallet nuke | 9 | 55.6% | -2.0% | 22.2% | 0.13% | 3.9 |
| Thin support | 27 | 48.1% | -10.2% | -10.2% | 0.22% | 3.1 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=76)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 6 | 33.3% | -34.4% | -40.2% | 0.58% | 4.2 | 50.0% |
| SMALL_MOVE | 5 | 20.0% | -59.0% | -77.6% | 0.66% | 3.5 | 100.0% |
| CLEAR_MOVE | 18 | 61.1% | 7.5% | 24.1% | 0.08% | 3.3 | 100.0% |
| NEAR_START | 47 | 44.7% | -1.6% | -5.8% | 0.18% | 3.2 | 100.0% |

**All Time** (n=638)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 523 | 53.5% | -5.5% | -5.3% | -0.50% | 3.2 | 2.1% |
| SMALL_MOVE | 8 | 25.0% | -50.0% | -60.1% | 1.22% | 3.9 | 62.5% |
| CLEAR_MOVE | 44 | 56.8% | 3.4% | 9.4% | -0.20% | 3.6 | 100.0% |
| NEAR_START | 63 | 46.0% | -4.3% | -7.9% | 0.24% | 3.3 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 4 / 25.0% / -48.8% | 1 / 0.0% / -100.0% | 4 / 100.0% / 63.5% | 5 / 80.0% / 82.0% |
| 3.5-4★ | — | 2 / 50.0% / 2.5% | 3 / 33.3% / -37.4% | 14 / 50.0% / 22.7% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 1 / 0.0% / -100.0% | 11 / 54.5% / -0.6% | 28 / 35.7% / -28.8% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 73 | 45.2% | -7.4% | -7.3% | 3.3 | 0.21% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 123 | 48.0% | -6.6% | -5.8% | 3.6 | 0.09% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 95 | 100% |
| LOCKED (direct) | 58 | 61.1% |
| Promoted (SHADOW→LOCKED) | 19 | 20.0% |
| Rejected (stayed SHADOW) | 8 | 8.4% |
| Superseded (side flipped) | 4 | 4.2% |
| Muted | 16 | 16.8% |
| Cancelled | 4 | 4.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=76)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -4.61u | -4.9% | — |
| Flat 1.0u | -4.44u | -5.8% | -0.17u |
| Lock units only | 0.85u | — | -5.46u |
| Units change only on star change | -4.08u | — | -0.53u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 6 | 2.50 | 9.3% | 4.1% | +0.06u | Neutral |
| 4.5 | 8 | 1.94 | 39.2% | 34.8% | +2.27u | Sizing helps |
| 4 | 8 | 1.70 | -26.0% | -9.0% | +0.85u | Sizing helps |
| 3.5 | 11 | 1.05 | 38.1% | 21.9% | -1.65u | Sizing hurts |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 21 | 0.76 | -17.6% | -28.8% | -0.93u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=638)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -49.49u | -5.1% | — |
| Flat 1.0u | -33.95u | -5.3% | -15.54u |
| Lock units only | -33.27u | — | -16.22u |
| Units change only on star change | -48.12u | — | -1.37u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 19 | 2.61 | -3.1% | -8.3% | -3.53u | Sizing hurts |
| 4.5 | 42 | 2.48 | -2.6% | -8.5% | -7.75u | Sizing hurts |
| 4 | 123 | 2.10 | -4.7% | -4.0% | -4.39u | Sizing hurts |
| 3.5 | 129 | 1.70 | 3.7% | 3.8% | +3.66u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 128 | 0.74 | -3.5% | -2.8% | +1.78u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 76 | 53.5% | 46.1% | -7.5% | -5.8% | 0.22% | Below market |
| 4.5-5★ | 14 | 55.6% | 64.3% | +8.7% | 26.3% | 0.01% | Beating market |
| 3.5-4★ | 19 | 50.1% | 47.4% | -2.7% | 11.1% | 0.70% | Below market |
| 2.5-3★ | 42 | 54.4% | 40.5% | -13.9% | -22.0% | 0.07% | Below market |
| CLEAR_MOVE only | 18 | 55.5% | 61.1% | +5.6% | 7.5% | 0.08% | Beating market |
| NO_MOVE only | 6 | 52.9% | 33.3% | -19.6% | -34.4% | 0.58% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=68)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 52.763 | 52.763 | 0.00 |  |
| Rank_norm | 63.976 | 63.976 | 0.00 |  |
| PnL_norm | 55.285 | 55.285 | 0.00 |  |
| WalletBase | 54.505 | 54.505 | 0.00 |  |
| SizeRatio | 1.945 | 1.945 | 0.00 |  |
| ConvictionMult | 0.999 | 0.999 | 0.00 |  |
| WalletCountFor | 3.779 | 3.779 | 0.00 |  |
| TopShare | 0.426 | 0.426 | 0.00 |  |
| ForSide | 210.379 | 210.379 | 0.00 |  |
| AgainstSide | 66.331 | 66.331 | 0.00 |  |
| NetEdge | 1.540 | 1.540 | 0.00 |  |
| WalletPlayScore | 2.567 | 2.567 | 0.00 |  |

### V8 Era (n=68)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 52.763 | 52.763 | 0.00 |  |
| Rank_norm | 63.976 | 63.976 | 0.00 |  |
| PnL_norm | 55.285 | 55.285 | 0.00 |  |
| WalletBase | 54.505 | 54.505 | 0.00 |  |
| SizeRatio | 1.945 | 1.945 | 0.00 |  |
| ConvictionMult | 0.999 | 0.999 | 0.00 |  |
| WalletCountFor | 3.779 | 3.779 | 0.00 |  |
| TopShare | 0.426 | 0.426 | 0.00 |  |
| ForSide | 210.379 | 210.379 | 0.00 |  |
| AgainstSide | 66.331 | 66.331 | 0.00 |  |
| NetEdge | 1.540 | 1.540 | 0.00 |  |
| WalletPlayScore | 2.567 | 2.567 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=76)

- **Gate issue**: NO_MOVE ROI (-34.4%) significantly trails CLEAR_MOVE (7.5%)

### 7-Day (n=87)

- **Sizing issue**: Model P/L (-11.76u) trails flat (-9.76u) by 2.00u
- **Gate issue**: NO_MOVE ROI (-19.9%) significantly trails CLEAR_MOVE (-3.2%)

### All Time (n=638)

- **Sizing issue**: Model P/L (-49.49u) trails flat (-33.95u) by 15.54u
- **Environment issue**: 82.0% NO_MOVE (WR: 53.5%, ROI: -5.5%)


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
| V8 era picks | 76 |
| V8 flat ROI | -5.8% |
| V8 model ROI | -4.9% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | 26.3% |
| 2.5-3★ ROI | -22.0% |
| CLEAR_MOVE ROI | 7.5% |
| NO_MOVE ROI | -34.4% |
| Single-wallet play rate | 11.8% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.93% | 4.5★: -0.68% | 4★: 0.99% | 3.5★: 0.46% | 3★: -0.02% | 2.5★: 0.16% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=76)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 65 | 85.5% | 46.2% | -2.7% | -4.6% | 0.18% |
| MUTED | 9 | 11.8% | 44.4% | -30.6% | -14.5% | 0.05% |
| CANCELLED | 2 | 2.6% | 50.0% | 5.0% | 15.4% | 2.49% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 6 | 33.3% |
| whitelist_fade_weak | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |

### 7-Day (n=87)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 76 | 87.4% | 43.4% | -9.3% | -11.0% | 0.14% |
| MUTED | 9 | 10.3% | 44.4% | -30.6% | -14.5% | 0.05% |
| CANCELLED | 2 | 2.3% | 50.0% | 5.0% | 15.4% | 2.49% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 6 | 33.3% |
| whitelist_fade_weak | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |

### All Time (n=638)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 625 | 98.0% | 52.6% | -5.4% | -5.4% | -0.36% |
| MUTED | 9 | 1.4% | 44.4% | -30.6% | -14.5% | 0.05% |
| CANCELLED | 4 | 0.6% | 75.0% | 68.0% | 53.3% | -2.27% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 6 | 33.3% |
| whitelist_fade_weak | 3 | 66.7% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
