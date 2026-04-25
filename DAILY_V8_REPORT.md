# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-25 ET
**Completed Picks**: 648 | **V8 Era Picks**: 86 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 3.5★ WR (60.0%) beats 4★ (33.3%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 34 | 50.0% | -2.29u | -6.7% | 1.66u | 3.3% | 0.44% | -0.65% |  |
| 7-Day | 86 | 47.7% | -3.14u | -3.7% | -2.84u | -2.6% | 0.26% | -0.58% |  |
| 14-Day | 267 | 47.6% | -27.39u | -10.3% | -40.63u | -10.8% | -0.08% | -0.39% |  |
| 30-Day | 646 | 52.9% | -30.66u | -4.7% | -40.47u | -4.2% | -0.35% | -0.05% |  |
| V8 Era | 86 | 47.7% | -3.14u | -3.7% | -2.84u | -2.6% | 0.26% | -0.58% |  |
| All Time | 648 | 52.8% | -32.66u | -5.0% | -47.72u | -4.9% | -0.35% | -0.05% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=86)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 10 | 59.7% | 59.7% | 70.0% | +10.3% | 18.2% | 17.8% | 2.50 | 1.31% | Strong |
| 4.5 | 8 | 50.4% | 50.4% | 62.5% | +12.1% | 39.2% | 34.8% | 1.94 | -0.68% | Strong |
| 4 | 9 | 54.2% | 54.2% | 33.3% | -20.9% | -34.2% | -19.9% | 1.72 | 0.88% | Failing |
| 3.5 | 15 | 47.9% | 47.9% | 60.0% | +12.1% | 41.5% | 26.7% | 0.96 | 0.27% | Strong |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 22 | 53.5% | 53.5% | 40.9% | -12.6% | -21.4% | -34.9% | 0.80 | 0.09% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 70.0% | 62.5% | +7.5% | Correct |
| 4.5★ vs 4★ | 62.5% | 33.3% | +29.2% | Correct |
| 4★ vs 3.5★ | 33.3% | 60.0% | -26.7% | INVERTED |
| 3.5★ vs 3★ | 60.0% | 38.1% | +21.9% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.9% | -2.8% | Flat |
| 2.5★ vs 2★ | 40.9% | 0.0% | +40.9% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.750 |
| Spearman: Stars vs Flat ROI | 0.536 |
| Spearman: Stars vs CLV | 0.214 |
| Brier Score | 0.2675 |
| Monotonicity Score | -0.33 |

### All Time (n=648)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 23 | 59.1% | 59.1% | 60.9% | +1.8% | 3.0% | -0.5% | 2.59 | 1.08% | Fair |
| 4.5 | 42 | 56.3% | 56.3% | 52.4% | -3.9% | -2.6% | -8.5% | 2.48 | 1.08% | Fair |
| 4 | 124 | 55.8% | 55.8% | 52.4% | -3.4% | -5.5% | -4.6% | 2.09 | -0.60% | Weak |
| 3.5 | 133 | 55.8% | 55.8% | 59.4% | +3.6% | 5.1% | 4.4% | 1.67 | -0.30% | Strong |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 129 | 54.3% | 54.3% | 52.7% | -1.6% | -4.2% | -4.3% | 0.74 | -0.66% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 60.9% | 52.4% | +8.5% | Correct |
| 4.5★ vs 4★ | 52.4% | 52.4% | 0.0% | Flat |
| 4★ vs 3.5★ | 52.4% | 59.4% | -7.0% | INVERTED |
| 3.5★ vs 3★ | 59.4% | 47.5% | +11.9% | Correct |
| 3★ vs 2.5★ | 47.5% | 52.7% | -5.2% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.571 |
| Spearman: Stars vs Flat ROI | 0.643 |
| Spearman: Stars vs CLV | 0.500 |
| Brier Score | 0.2328 |
| Monotonicity Score | -0.17 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.126 | 0.151 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | 0.127 | 0.072 | Keep |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.003 | -0.017 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.155 | 0.143 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.146 | 0.155 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.167 | 0.194 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.233 | 0.240 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.053 | 0.114 | Keep |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.093 | 0.093 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.049 | 0.102 | Keep |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.085 | 0.124 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | -0.033 | -0.141 | Keep |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | -0.047 | -0.157 | Keep |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.056 | 0.140 | Keep |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–48.22) | 13 | 30.8% | -41.4% | -33.9% | 0.17% |  |
| p20-40 (48.47–51.50) | 13 | 38.5% | -14.5% | -9.5% | 0.74% |  |
| p40-60 (51.57–54.60) | 13 | 61.5% | 47.1% | 12.7% | 0.29% |  |
| p60-80 (54.76–57.92) | 13 | 46.2% | -15.6% | -0.4% | -0.04% |  |
| p80-95 (58.15–62.76) | 13 | 38.5% | -20.5% | -15.4% | 1.11% |  |
| p95+ (63.03–74.70) | 13 | 61.5% | 14.3% | -7.6% | -0.56% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 26 | 38.5% | -25.7% | -30.8% | -0.09% |  |
| 0.90-1.05 | 23 | 43.5% | -18.6% | -17.7% | 0.08% |  |
| 1.05-1.20 | 22 | 54.5% | 29.1% | 26.1% | 0.68% |  |
| 1.20-1.35 | 4 | 75.0% | 45.7% | 27.1% | 0.54% |  |
| 1.35-1.50 | 2 | 0.0% | -100.0% | -100.0% | 1.50% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.72) | 13 | 38.5% | -27.2% | -30.0% | 0.61% |  |
| 20-40% (0.73–1.00) | 13 | 53.8% | -1.0% | -5.2% | -0.28% |  |
| 40-60% (1.00–1.24) | 13 | 53.8% | 43.2% | 10.3% | 0.20% |  |
| 60-80% (1.24–1.52) | 13 | 38.5% | -35.8% | -22.8% | -0.28% |  |
| 80-95% (1.60–2.39) | 13 | 46.2% | -9.0% | -0.1% | 0.78% |  |
| 95%+ (2.56–4.76) | 13 | 46.2% | -0.7% | -1.7% | 0.58% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 8 | 50.0% | 15.3% | 3.5% | 0.74% | Broad support |
| 0.25-0.40 | 31 | 54.8% | 15.5% | 11.5% | 0.41% | Healthy support |
| 0.40-0.60 | 25 | 32.0% | -37.2% | -31.2% | 0.16% | Concentrated |
| 0.60-0.80 | 11 | 54.5% | 3.9% | -37.4% | -0.08% | Very concentrated |
| 0.80-1.00 | 3 | 33.3% | -36.6% | -59.6% | 0.07% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 15 | 40.0% | -24.7% | -16.0% | 0.18% | 3.6 |
| Broad battle | 49 | 49.0% | 3.8% | 3.6% | 0.44% | 3.4 |
| One-wallet nuke | 11 | 54.5% | -2.5% | 18.5% | 0.06% | 3.9 |
| Thin support | 32 | 50.0% | -5.9% | -3.7% | 0.14% | 3.2 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=86)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 7 | 42.9% | -14.9% | -8.3% | 0.46% | 4.3 | 57.1% |
| SMALL_MOVE | 8 | 25.0% | -50.3% | -69.5% | 1.01% | 3.7 | 100.0% |
| CLEAR_MOVE | 19 | 63.2% | 8.9% | 25.1% | 0.28% | 3.4 | 100.0% |
| NEAR_START | 52 | 46.2% | 0.5% | -5.4% | 0.10% | 3.3 | 100.0% |

**All Time** (n=648)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 524 | 53.6% | -5.3% | -4.9% | -0.50% | 3.2 | 2.3% |
| SMALL_MOVE | 11 | 27.3% | -46.1% | -59.9% | 1.32% | 3.9 | 72.7% |
| CLEAR_MOVE | 45 | 57.8% | 4.0% | 10.3% | -0.11% | 3.7 | 100.0% |
| NEAR_START | 68 | 47.1% | -2.5% | -7.4% | 0.17% | 3.3 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 5 / 40.0% / -18.6% | 2 / 0.0% / -100.0% | 5 / 100.0% / 57.6% | 6 / 83.3% / 83.5% |
| 3.5-4★ | — | 4 / 50.0% / -0.6% | 3 / 33.3% / -37.4% | 17 / 52.9% / 25.2% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 1 / 0.0% / -100.0% | 11 / 54.5% / -0.6% | 29 / 34.5% / -31.2% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 83 | 47.0% | -4.9% | -4.5% | 3.4 | 0.25% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 133 | 48.9% | -5.2% | -4.5% | 3.6 | 0.12% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 107 | 100% |
| LOCKED (direct) | 58 | 54.2% |
| Promoted (SHADOW→LOCKED) | 29 | 27.1% |
| Rejected (stayed SHADOW) | 12 | 11.2% |
| Superseded (side flipped) | 3 | 2.8% |
| Muted | 25 | 23.4% |
| Cancelled | 3 | 2.8% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=86)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -2.84u | -2.6% | — |
| Flat 1.0u | -3.14u | -3.7% | +0.30u |
| Lock units only | 1.14u | — | -3.98u |
| Units change only on star change | -1.14u | — | -1.70u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 10 | 2.50 | 18.2% | 17.8% | +2.63u | Sizing helps |
| 4.5 | 8 | 1.94 | 39.2% | 34.8% | +2.27u | Sizing helps |
| 4 | 9 | 1.72 | -34.2% | -19.9% | -0.00u | Neutral |
| 3.5 | 15 | 0.96 | 41.5% | 26.7% | -2.39u | Sizing hurts |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 22 | 0.80 | -21.4% | -34.9% | -1.43u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=648)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -47.72u | -4.9% | — |
| Flat 1.0u | -32.66u | -5.0% | -15.06u |
| Lock units only | -32.97u | — | -14.75u |
| Units change only on star change | -45.18u | — | -2.54u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 23 | 2.59 | 3.0% | -0.5% | -0.97u | Sizing hurts |
| 4.5 | 42 | 2.48 | -2.6% | -8.5% | -7.75u | Sizing hurts |
| 4 | 124 | 2.09 | -5.5% | -4.6% | -5.24u | Sizing hurts |
| 3.5 | 133 | 1.67 | 5.1% | 4.4% | +2.92u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 129 | 0.74 | -4.2% | -4.3% | +1.28u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 86 | 53.6% | 47.7% | -5.9% | -3.7% | 0.26% | Below market |
| 4.5-5★ | 18 | 55.6% | 66.7% | +11.1% | 27.5% | 0.43% | Beating market |
| 3.5-4★ | 24 | 50.3% | 50.0% | -0.3% | 13.1% | 0.51% | Neutral |
| 2.5-3★ | 43 | 54.6% | 39.5% | -15.0% | -23.8% | 0.04% | Below market |
| CLEAR_MOVE only | 19 | 56.5% | 63.2% | +6.7% | 8.9% | 0.28% | Beating market |
| NO_MOVE only | 7 | 52.4% | 42.9% | -9.6% | -14.9% | 0.46% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=78)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 53.553 | 53.553 | 0.00 |  |
| Rank_norm | 63.824 | 63.824 | 0.00 |  |
| PnL_norm | 55.540 | 55.540 | 0.00 |  |
| WalletBase | 55.151 | 55.151 | 0.00 |  |
| SizeRatio | 1.826 | 1.826 | 0.00 |  |
| ConvictionMult | 0.988 | 0.988 | 0.00 |  |
| WalletCountFor | 3.718 | 3.718 | 0.00 |  |
| TopShare | 0.438 | 0.438 | 0.00 |  |
| ForSide | 208.951 | 208.951 | 0.00 |  |
| AgainstSide | 68.651 | 68.651 | 0.00 |  |
| NetEdge | 1.506 | 1.506 | 0.00 |  |
| WalletPlayScore | 2.461 | 2.461 | 0.00 |  |

### V8 Era (n=78)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 53.553 | 53.553 | 0.00 |  |
| Rank_norm | 63.824 | 63.824 | 0.00 |  |
| PnL_norm | 55.540 | 55.540 | 0.00 |  |
| WalletBase | 55.151 | 55.151 | 0.00 |  |
| SizeRatio | 1.826 | 1.826 | 0.00 |  |
| ConvictionMult | 0.988 | 0.988 | 0.00 |  |
| WalletCountFor | 3.718 | 3.718 | 0.00 |  |
| TopShare | 0.438 | 0.438 | 0.00 |  |
| ForSide | 208.951 | 208.951 | 0.00 |  |
| AgainstSide | 68.651 | 68.651 | 0.00 |  |
| NetEdge | 1.506 | 1.506 | 0.00 |  |
| WalletPlayScore | 2.461 | 2.461 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=86)

- **Gate issue**: NO_MOVE ROI (-14.9%) significantly trails CLEAR_MOVE (8.9%)

### 7-Day (n=86)

- **Gate issue**: NO_MOVE ROI (-14.9%) significantly trails CLEAR_MOVE (8.9%)

### All Time (n=648)

- **Sizing issue**: Model P/L (-47.72u) trails flat (-32.66u) by 15.06u
- **Environment issue**: 80.9% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 86 |
| V8 flat ROI | -3.7% |
| V8 model ROI | -2.6% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | 27.5% |
| 2.5-3★ ROI | -23.8% |
| CLEAR_MOVE ROI | 8.9% |
| NO_MOVE ROI | -14.9% |
| Single-wallet play rate | 12.8% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 1.31% | 4.5★: -0.68% | 4★: 0.88% | 3.5★: 0.27% | 3★: -0.02% | 2.5★: 0.09% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=86)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 70 | 81.4% | 48.6% | 0.6% | -0.6% | 0.27% |
| MUTED | 14 | 16.3% | 42.9% | -26.0% | -16.3% | -0.08% |
| CANCELLED | 2 | 2.3% | 50.0% | 5.0% | 15.4% | 2.49% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 7 | 28.6% |
| whitelist_fade_weak | 3 | 66.7% |
| winners_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| quality_below_floor | 1 | 100.0% |
| wps_flipped_diag | 1 | 100.0% |
| opp_side_stronger_diag | 1 | 100.0% |

### 7-Day (n=86)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 70 | 81.4% | 48.6% | 0.6% | -0.6% | 0.27% |
| MUTED | 14 | 16.3% | 42.9% | -26.0% | -16.3% | -0.08% |
| CANCELLED | 2 | 2.3% | 50.0% | 5.0% | 15.4% | 2.49% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 7 | 28.6% |
| whitelist_fade_weak | 3 | 66.7% |
| winners_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| quality_below_floor | 1 | 100.0% |
| wps_flipped_diag | 1 | 100.0% |
| opp_side_stronger_diag | 1 | 100.0% |

### All Time (n=648)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 630 | 97.2% | 52.9% | -5.0% | -5.0% | -0.34% |
| MUTED | 14 | 2.2% | 42.9% | -26.0% | -16.3% | -0.08% |
| CANCELLED | 4 | 0.6% | 75.0% | 68.0% | 53.3% | -2.27% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 7 | 28.6% |
| whitelist_fade_weak | 3 | 66.7% |
| winners_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| quality_below_floor | 1 | 100.0% |
| wps_flipped_diag | 1 | 100.0% |
| opp_side_stronger_diag | 1 | 100.0% |
