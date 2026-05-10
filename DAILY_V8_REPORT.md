# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-10 ET
**Completed Picks**: 771 | **V8 Era Picks**: 209 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: MONITORING
- **Ranking health**: DEGRADED
- **Sizing health**: HEALTHY
- **Environment health**: HEALTHY
- **Most important takeaway**: Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Star inversion | ⚠️ | 4.5★ WR (69.2%) beats 5★ (53.6%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 14 | 71.4% | 4.38u | 31.3% | 12.16u | 44.5% | -0.21% | -0.50% | Strong |
| 7-Day | 37 | 56.8% | 2.04u | 5.5% | 10.29u | 16.0% | -1.06% | -0.27% | Strong |
| 14-Day | 113 | 52.2% | -1.45u | -1.3% | 7.85u | 4.8% | -0.45% | -0.25% |  |
| 30-Day | 424 | 49.1% | -31.60u | -7.5% | -45.09u | -7.5% | -0.25% | -0.30% |  |
| V8 Era | 209 | 49.3% | -8.77u | -4.2% | -2.28u | -0.8% | -0.10% | -0.39% |  |
| All Time | 771 | 52.4% | -38.28u | -5.0% | -47.16u | -4.1% | -0.35% | -0.08% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=209)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 56 | 53.6% | 53.6% | 53.6% | -0.1% | -3.6% | 2.7% | 2.43 | 0.07% | Fair |
| 4.5 | 13 | 50.0% | 50.0% | 69.2% | +19.3% | 45.9% | 43.1% | 2.25 | -0.63% | Strong |
| 4 | 29 | 52.7% | 52.7% | 51.7% | -1.0% | 0.5% | -10.6% | 1.23 | 0.17% | Fair |
| 3.5 | 56 | 51.0% | 51.0% | 48.2% | -2.8% | -0.3% | -0.2% | 0.75 | -0.20% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 30 | 53.2% | 53.2% | 40.0% | -13.2% | -23.0% | -36.3% | 0.73 | -0.28% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.6% | 69.2% | -15.6% | INVERTED |
| 4.5★ vs 4★ | 69.2% | 51.7% | +17.5% | Correct |
| 4★ vs 3.5★ | 51.7% | 48.2% | +3.5% | Correct |
| 3.5★ vs 3★ | 48.2% | 38.1% | +10.1% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.0% | -1.9% | Flat |
| 2.5★ vs 2★ | 40.0% | 0.0% | +40.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.929 |
| Spearman: Stars vs Flat ROI | 0.750 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2504 |
| Monotonicity Score | -0.33 |

### All Time (n=771)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 69 | 54.6% | 54.6% | 53.6% | -1.0% | -4.5% | -0.6% | 2.47 | 0.22% | Fair |
| 4.5 | 47 | 55.6% | 55.6% | 55.3% | -0.2% | 3.7% | -1.4% | 2.51 | 0.91% | Fair |
| 4 | 144 | 55.3% | 55.3% | 53.5% | -1.8% | -2.5% | -4.6% | 1.94 | -0.54% | Fair |
| 3.5 | 174 | 54.9% | 54.9% | 55.7% | +0.8% | 0.2% | 2.3% | 1.44 | -0.32% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 137 | 54.2% | 54.2% | 51.8% | -2.4% | -5.6% | -5.9% | 0.73 | -0.69% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.6% | 55.3% | -1.7% | Flat |
| 4.5★ vs 4★ | 55.3% | 53.5% | +1.8% | Correct |
| 4★ vs 3.5★ | 53.5% | 55.7% | -2.2% | Flat |
| 3.5★ vs 3★ | 55.7% | 47.5% | +8.2% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.8% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.714 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2337 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.068 | 0.046 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.056 | -0.050 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.016 | -0.046 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.006 | -0.029 | Monitor |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.156 | 0.165 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.218 | 0.223 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.139 | 0.126 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.021 | 0.036 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.034 | 0.085 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.002 | -0.002 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.073 | 0.100 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.082 | -0.010 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.097 | 0.007 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.039 | 0.018 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (36.10–50.29) | 33 | 51.5% | 2.1% | 19.9% | -0.59% |  |
| p20-40 (50.30–54.05) | 34 | 50.0% | -6.2% | 8.1% | 0.52% |  |
| p40-60 (54.47–58.36) | 33 | 60.6% | 33.7% | 9.4% | 0.13% |  |
| p60-80 (58.48–63.29) | 34 | 44.1% | -15.7% | -6.0% | 0.37% |  |
| p80-95 (63.40–66.05) | 33 | 42.4% | -26.8% | -31.6% | -0.67% |  |
| p95+ (66.26–83.30) | 34 | 44.1% | -15.1% | -14.3% | -0.52% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 69 | 42.0% | -20.5% | -18.0% | -0.14% |  |
| 0.90-1.05 | 66 | 42.4% | -19.9% | -20.7% | -0.29% |  |
| 1.05-1.20 | 47 | 66.0% | 36.7% | 42.8% | 0.21% |  |
| 1.20-1.35 | 9 | 55.6% | 7.7% | -23.5% | -0.14% |  |
| 1.35-1.50 | 6 | 50.0% | 2.3% | -24.1% | 0.52% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.70) | 32 | 50.0% | -1.8% | 6.3% | -0.44% |  |
| 20-40% (0.71–0.93) | 33 | 45.5% | -12.5% | 2.8% | -0.74% |  |
| 40-60% (0.93–1.23) | 33 | 66.7% | 40.5% | 7.6% | 0.21% |  |
| 60-80% (1.24–1.53) | 33 | 33.3% | -37.4% | -26.9% | 0.00% |  |
| 80-95% (1.55–2.11) | 33 | 36.4% | -35.3% | -17.6% | -0.08% |  |
| 95%+ (2.13–4.76) | 33 | 54.5% | 6.5% | 1.9% | 0.45% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 14 | 35.7% | -20.2% | -26.7% | 0.45% | Broad support |
| 0.25-0.40 | 67 | 50.7% | 0.2% | -5.5% | 0.09% | Healthy support |
| 0.40-0.60 | 65 | 43.1% | -14.9% | 4.7% | 0.01% | Concentrated |
| 0.60-0.80 | 35 | 54.3% | 0.7% | 0.4% | -0.22% | Very concentrated |
| 0.80-1.00 | 16 | 50.0% | -6.6% | -23.2% | -1.56% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 31 | 38.7% | -26.3% | -14.3% | -0.18% | 4.1 |
| Broad battle | 116 | 47.4% | -5.0% | -1.3% | -0.07% | 3.9 |
| One-wallet nuke | 28 | 60.7% | 12.1% | 20.9% | -1.01% | 3.6 |
| Thin support | 86 | 52.3% | -1.5% | 0.3% | -0.32% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=209)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 35 | 31.4% | -40.6% | -47.1% | 0.18% | 3.9 | 100.0% |
| CLEAR_MOVE | 61 | 59.0% | 6.5% | 14.2% | -0.35% | 4.0 | 100.0% |
| NEAR_START | 100 | 48.0% | -0.9% | -1.4% | -0.08% | 3.6 | 100.0% |

**All Time** (n=771)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 38 | 31.6% | -40.2% | -47.8% | 0.34% | 4.0 | 92.1% |
| CLEAR_MOVE | 87 | 57.5% | 4.7% | 9.9% | -0.37% | 4.0 | 100.0% |
| NEAR_START | 116 | 48.3% | -2.4% | -3.3% | -0.02% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 10 / 30.0% / -53.8% | 25 / 64.0% / 12.6% | 25 / 56.0% / 16.4% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 22 / 31.8% / -34.5% | 23 / 52.2% / -4.4% | 38 / 57.9% / 21.5% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 36 / 33.3% / -33.8% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 206 | 49.0% | -4.7% | -1.5% | 3.8 | -0.11% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 256 | 49.6% | -4.9% | -2.2% | 3.8 | -0.11% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 353 | 100% |
| LOCKED (direct) | 65 | 18.4% |
| Promoted (SHADOW→LOCKED) | 151 | 42.8% |
| Rejected (stayed SHADOW) | 105 | 29.7% |
| Superseded (side flipped) | 27 | 7.6% |
| Muted | 168 | 47.6% |
| Cancelled | 16 | 4.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=209)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -2.28u | -0.8% | — |
| Flat 1.0u | -8.77u | -4.2% | +6.49u |
| Lock units only | -0.12u | — | -2.16u |
| Units change only on star change | 3.84u | — | -6.12u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 56 | 2.43 | -3.6% | 2.7% | +5.73u | Sizing helps |
| 4.5 | 13 | 2.25 | 45.9% | 43.1% | +6.63u | Sizing helps |
| 4 | 29 | 1.23 | 0.5% | -10.6% | -3.94u | Sizing hurts |
| 3.5 | 56 | 0.75 | -0.3% | -0.2% | +0.08u | Neutral |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 30 | 0.73 | -23.0% | -36.3% | -1.02u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=771)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -47.16u | -4.1% | — |
| Flat 1.0u | -38.28u | -5.0% | -8.88u |
| Lock units only | -34.24u | — | -12.92u |
| Units change only on star change | -40.20u | — | -6.96u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 69 | 2.47 | -4.5% | -0.6% | +2.14u | Sizing helps |
| 4.5 | 47 | 2.51 | 3.7% | -1.4% | -3.39u | Sizing hurts |
| 4 | 144 | 1.94 | -2.5% | -4.6% | -9.18u | Sizing hurts |
| 3.5 | 174 | 1.44 | 0.2% | 2.3% | +5.39u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 137 | 0.73 | -5.6% | -5.9% | +1.69u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 209 | 52.7% | 49.3% | -3.4% | -4.2% | -0.10% | Below market |
| 4.5-5★ | 69 | 53.0% | 56.5% | +3.6% | 5.7% | -0.06% | Beating market |
| 3.5-4★ | 85 | 51.6% | 49.4% | -2.2% | -0.0% | -0.07% | Below market |
| 2.5-3★ | 53 | 54.2% | 41.5% | -12.7% | -20.2% | -0.19% | Below market |
| CLEAR_MOVE only | 61 | 54.3% | 59.0% | +4.7% | 6.5% | -0.35% | Beating market |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=33)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.148 | 61.005 | 0.27 |  |
| Rank_norm | 64.739 | 64.665 | 0.00 |  |
| PnL_norm | 57.031 | 57.290 | 0.02 |  |
| WalletBase | 58.607 | 60.538 | 0.23 |  |
| SizeRatio | 1.653 | 1.766 | 0.07 |  |
| ConvictionMult | 0.982 | 1.042 | 0.36 |  |
| WalletCountFor | 3.381 | 2.636 | 0.42 |  |
| TopShare | 0.485 | 0.654 | 0.82 |  |
| ForSide | 195.476 | 165.694 | 0.28 |  |
| AgainstSide | 65.043 | 49.915 | 0.17 |  |
| NetEdge | 1.402 | 1.233 | 0.19 |  |
| WalletPlayScore | 2.034 | 0.830 | 0.57 |  |

### V8 Era (n=197)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.148 | 58.241 | 0.01 |  |
| Rank_norm | 64.739 | 64.587 | 0.01 |  |
| PnL_norm | 57.031 | 57.033 | 0.00 |  |
| WalletBase | 58.607 | 58.604 | 0.00 |  |
| SizeRatio | 1.653 | 1.613 | 0.03 |  |
| ConvictionMult | 0.982 | 0.978 | 0.02 |  |
| WalletCountFor | 3.381 | 3.381 | 0.00 |  |
| TopShare | 0.485 | 0.485 | 0.00 |  |
| ForSide | 195.476 | 195.476 | 0.00 |  |
| AgainstSide | 65.043 | 65.043 | 0.00 |  |
| NetEdge | 1.402 | 1.402 | 0.00 |  |
| WalletPlayScore | 2.034 | 2.034 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=209)

- **Gate issue**: NO_MOVE ROI (-13.8%) significantly trails CLEAR_MOVE (6.5%)

### 7-Day (n=37)

- **Ranking issue**: ≤3★ WR (67%) beats ≥4★ (57%)
- **Odds issue**: Avg CLV -1.06% — consistently getting bad closing lines

### All Time (n=771)

- **Sizing issue**: Model P/L (-47.16u) trails flat (-38.28u) by 8.88u
- **Environment issue**: 68.2% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 209 |
| V8 flat ROI | -4.2% |
| V8 model ROI | -0.8% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | 5.7% |
| 2.5-3★ ROI | -20.2% |
| CLEAR_MOVE ROI | 6.5% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 13.4% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.07% | 4.5★: -0.63% | 4★: 0.17% | 3.5★: -0.20% | 3★: -0.02% | 2.5★: -0.28% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=209)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 150 | 71.8% | 48.7% | -3.2% | -2.6% | 0.01% |
| MUTED | 50 | 23.9% | 50.0% | -7.3% | 9.3% | -0.41% |
| CANCELLED | 9 | 4.3% | 55.6% | -3.7% | -14.5% | -0.15% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 15 | 40.0% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| winners_faded | 11 | 63.6% |
| opp_side_stronger_diag | 8 | 37.5% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| winners_killed | 7 | 57.1% |
| ags_quality_veto | 5 | 60.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |

### 7-Day (n=37)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 28 | 75.7% | 60.7% | 15.9% | 29.0% | -0.99% |
| MUTED | 7 | 18.9% | 57.1% | -5.8% | 8.4% | -0.37% |
| CANCELLED | 2 | 5.4% | 0.0% | -100.0% | -100.0% | -3.62% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 12 | 41.7% |
| opp_side_stronger_diag | 5 | 20.0% |
| ags_quality_veto | 5 | 60.0% |
| wps_flipped_diag | 2 | 0.0% |
| winners_killed | 2 | 0.0% |
| winners_faded | 1 | 0.0% |
| winners_below_floor | 1 | 100.0% |

### All Time (n=771)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 710 | 92.1% | 52.4% | -5.2% | -4.9% | -0.33% |
| MUTED | 50 | 6.5% | 50.0% | -7.3% | 9.3% | -0.41% |
| CANCELLED | 11 | 1.4% | 63.6% | 20.8% | 2.9% | -1.40% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 15 | 40.0% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| winners_faded | 11 | 63.6% |
| opp_side_stronger_diag | 8 | 37.5% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| winners_killed | 7 | 57.1% |
| ags_quality_veto | 5 | 60.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
