# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-30 ET
**Completed Picks**: 718 | **V8 Era Picks**: 156 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (62.5%) beats 5★ (55.8%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 41 | 51.2% | -1.46u | -3.6% | 7.44u | 12.2% | -0.28% | -0.36% |  |
| 7-Day | 93 | 49.5% | -5.65u | -6.1% | 0.65u | 0.5% | 0.10% | -0.28% |  |
| 14-Day | 177 | 47.5% | -13.27u | -7.5% | -12.04u | -4.8% | 0.13% | -0.41% |  |
| 30-Day | 610 | 51.6% | -38.39u | -6.3% | -45.54u | -5.1% | -0.32% | -0.05% |  |
| V8 Era | 156 | 48.1% | -9.35u | -6.0% | -5.16u | -2.5% | 0.09% | -0.40% |  |
| All Time | 718 | 52.4% | -38.86u | -5.4% | -50.04u | -4.6% | -0.32% | -0.06% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=156)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 43 | 53.2% | 53.2% | 55.8% | +2.6% | 1.5% | 5.4% | 2.27 | 0.25% | Fair |
| 4.5 | 8 | 50.4% | 50.4% | 62.5% | +12.1% | 39.2% | 34.8% | 1.94 | -0.68% | Strong |
| 4 | 19 | 56.5% | 56.5% | 47.4% | -9.2% | -13.0% | -11.0% | 1.34 | 0.03% | Weak |
| 3.5 | 42 | 50.3% | 50.3% | 47.6% | -2.7% | 1.4% | 1.3% | 0.75 | 0.14% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 22 | 53.5% | 53.5% | 40.9% | -12.6% | -21.4% | -34.9% | 0.80 | 0.09% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 55.8% | 62.5% | -6.7% | INVERTED |
| 4.5★ vs 4★ | 62.5% | 47.4% | +15.1% | Correct |
| 4★ vs 3.5★ | 47.4% | 47.6% | -0.2% | Flat |
| 3.5★ vs 3★ | 47.6% | 38.1% | +9.5% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.9% | -2.8% | Flat |
| 2.5★ vs 2★ | 40.9% | 0.0% | +40.9% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.893 |
| Spearman: Stars vs CLV | -0.286 |
| Brier Score | 0.2533 |
| Monotonicity Score | 0.00 |

### All Time (n=718)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 56 | 54.5% | 54.5% | 55.4% | +0.9% | -0.9% | 0.4% | 2.36 | 0.39% | Fair |
| 4.5 | 42 | 56.3% | 56.3% | 52.4% | -3.9% | -2.6% | -8.5% | 2.48 | 1.08% | Fair |
| 4 | 134 | 56.0% | 56.0% | 53.0% | -3.1% | -4.6% | -4.4% | 2.01 | -0.62% | Fair |
| 3.5 | 160 | 55.1% | 55.1% | 56.3% | +1.2% | 0.7% | 2.6% | 1.49 | -0.22% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 129 | 54.3% | 54.3% | 52.7% | -1.6% | -4.2% | -4.3% | 0.74 | -0.66% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 55.4% | 52.4% | +3.0% | Correct |
| 4.5★ vs 4★ | 52.4% | 53.0% | -0.6% | Flat |
| 4★ vs 3.5★ | 53.0% | 56.3% | -3.3% | INVERTED |
| 3.5★ vs 3★ | 56.3% | 47.5% | +8.8% | Correct |
| 3★ vs 2.5★ | 47.5% | 52.7% | -5.2% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.571 |
| Spearman: Stars vs Flat ROI | 0.643 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2331 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.143 | 0.090 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.045 | -0.072 | Monitor |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.008 | -0.053 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.069 | 0.006 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.136 | 0.154 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.173 | 0.192 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.177 | 0.150 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.060 | 0.092 | Keep |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.128 | 0.150 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.019 | 0.002 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.140 | 0.147 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | -0.017 | -0.086 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | -0.006 | -0.069 | Monitor |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.039 | 0.071 | Keep |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–50.40) | 24 | 37.5% | -20.2% | -16.9% | 0.18% |  |
| p20-40 (50.53–54.47) | 25 | 56.0% | 6.5% | 8.1% | 0.69% |  |
| p40-60 (54.51–57.92) | 25 | 56.0% | 24.3% | 18.3% | 0.00% |  |
| p60-80 (58.15–62.76) | 24 | 41.7% | -15.9% | -1.5% | 0.78% |  |
| p80-95 (63.03–65.33) | 25 | 52.0% | -11.1% | -12.4% | -0.60% |  |
| p95+ (65.40–74.70) | 25 | 40.0% | -25.6% | -33.3% | -0.46% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 59 | 39.0% | -25.6% | -20.9% | -0.14% |  |
| 0.90-1.05 | 43 | 48.8% | -8.3% | -6.5% | 0.29% |  |
| 1.05-1.20 | 33 | 60.6% | 31.0% | 32.7% | 0.27% |  |
| 1.20-1.35 | 7 | 57.1% | 11.2% | -23.4% | -0.01% |  |
| 1.35-1.50 | 4 | 25.0% | -55.8% | -66.0% | 0.88% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.76) | 24 | 45.8% | -5.8% | 5.1% | 0.56% |  |
| 20-40% (0.77–0.98) | 25 | 52.0% | 1.7% | 32.8% | -0.56% |  |
| 40-60% (1.00–1.24) | 25 | 60.0% | 30.1% | -9.1% | 0.26% |  |
| 60-80% (1.24–1.52) | 24 | 29.2% | -50.6% | -32.2% | -0.18% |  |
| 80-95% (1.53–2.13) | 25 | 40.0% | -30.3% | -27.1% | -0.11% |  |
| 95%+ (2.17–4.76) | 25 | 56.0% | 12.1% | 6.3% | 0.58% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 11 | 45.5% | 1.6% | -7.5% | 0.56% | Broad support |
| 0.25-0.40 | 52 | 51.9% | 2.4% | -3.0% | 0.26% | Healthy support |
| 0.40-0.60 | 54 | 42.6% | -14.9% | -2.9% | -0.03% | Concentrated |
| 0.60-0.80 | 28 | 50.0% | -8.8% | -7.3% | -0.16% | Very concentrated |
| 0.80-1.00 | 3 | 33.3% | -36.6% | -59.6% | 0.07% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 24 | 33.3% | -37.3% | -34.0% | -0.32% | 3.9 |
| Broad battle | 92 | 51.1% | 3.3% | 8.6% | 0.21% | 3.9 |
| One-wallet nuke | 11 | 54.5% | -2.5% | 18.5% | 0.06% | 3.9 |
| Thin support | 58 | 50.0% | -6.3% | -3.0% | 0.10% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=156)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 25 | 32.0% | -43.6% | -41.3% | 0.37% | 4.0 | 100.0% |
| CLEAR_MOVE | 46 | 56.5% | 1.2% | 13.5% | -0.10% | 4.0 | 100.0% |
| NEAR_START | 76 | 48.7% | 2.9% | -2.2% | 0.08% | 3.6 | 100.0% |

**All Time** (n=718)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 28 | 32.1% | -42.7% | -43.4% | 0.56% | 4.0 | 89.3% |
| CLEAR_MOVE | 72 | 55.6% | 1.0% | 8.6% | -0.21% | 3.9 | 100.0% |
| NEAR_START | 92 | 48.9% | 0.3% | -4.4% | 0.13% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 8 / 37.5% / -42.3% | 20 / 65.0% / 14.8% | 17 / 58.8% / 25.3% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 15 / 33.3% / -36.8% | 15 / 46.7% / -15.5% | 30 / 56.7% / 23.3% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 1 / 0.0% / -100.0% | 11 / 54.5% / -0.6% | 29 / 34.5% / -31.2% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 153 | 47.7% | -6.7% | -3.5% | 3.8 | 0.08% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 203 | 48.8% | -6.4% | -3.8% | 3.8 | 0.04% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 237 | 100% |
| LOCKED (direct) | 58 | 24.5% |
| Promoted (SHADOW→LOCKED) | 97 | 40.9% |
| Rejected (stayed SHADOW) | 62 | 26.2% |
| Superseded (side flipped) | 15 | 6.3% |
| Muted | 98 | 41.4% |
| Cancelled | 11 | 4.6% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=156)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -5.16u | -2.5% | — |
| Flat 1.0u | -9.35u | -6.0% | +4.19u |
| Lock units only | -1.39u | — | -3.77u |
| Units change only on star change | -2.99u | — | -2.17u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 43 | 2.27 | 1.5% | 5.4% | +4.65u | Sizing helps |
| 4.5 | 8 | 1.94 | 39.2% | 34.8% | +2.27u | Sizing helps |
| 4 | 19 | 1.34 | -13.0% | -11.0% | -0.33u | Neutral |
| 3.5 | 42 | 0.75 | 1.4% | 1.3% | -0.20u | Neutral |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 22 | 0.80 | -21.4% | -34.9% | -1.43u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=718)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -50.04u | -4.6% | — |
| Flat 1.0u | -38.86u | -5.4% | -11.18u |
| Lock units only | -35.50u | — | -14.54u |
| Units change only on star change | -47.04u | — | -3.00u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 56 | 2.36 | -0.9% | 0.4% | +1.06u | Sizing helps |
| 4.5 | 42 | 2.48 | -2.6% | -8.5% | -7.75u | Sizing hurts |
| 4 | 134 | 2.01 | -4.6% | -4.4% | -5.57u | Sizing hurts |
| 3.5 | 160 | 1.49 | 0.7% | 2.6% | +5.10u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 129 | 0.74 | -4.2% | -4.3% | +1.28u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 156 | 53.1% | 48.1% | -5.0% | -6.0% | 0.09% | Below market |
| 4.5-5★ | 51 | 52.8% | 56.9% | +4.1% | 7.4% | 0.11% | Beating market |
| 3.5-4★ | 61 | 52.3% | 47.5% | -4.7% | -3.1% | 0.11% | Below market |
| 2.5-3★ | 43 | 54.6% | 39.5% | -15.0% | -23.8% | 0.04% | Below market |
| CLEAR_MOVE only | 46 | 54.9% | 56.5% | +1.6% | 1.2% | -0.10% | Neutral |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=91)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.053 | 59.513 | 0.25 |  |
| Rank_norm | 65.308 | 67.333 | 0.15 |  |
| PnL_norm | 57.567 | 59.688 | 0.17 |  |
| WalletBase | 58.105 | 60.541 | 0.32 |  |
| SizeRatio | 1.637 | 1.374 | 0.16 |  |
| ConvictionMult | 0.970 | 0.951 | 0.11 |  |
| WalletCountFor | 3.493 | 3.319 | 0.11 |  |
| TopShare | 0.453 | 0.469 | 0.10 |  |
| ForSide | 200.244 | 194.159 | 0.06 |  |
| AgainstSide | 65.808 | 65.143 | 0.01 |  |
| NetEdge | 1.443 | 1.388 | 0.06 |  |
| WalletPlayScore | 2.266 | 2.083 | 0.09 |  |

### V8 Era (n=148)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.053 | 57.053 | 0.00 |  |
| Rank_norm | 65.308 | 65.308 | 0.00 |  |
| PnL_norm | 57.567 | 57.567 | 0.00 |  |
| WalletBase | 58.105 | 58.105 | 0.00 |  |
| SizeRatio | 1.637 | 1.637 | 0.00 |  |
| ConvictionMult | 0.970 | 0.970 | 0.00 |  |
| WalletCountFor | 3.493 | 3.493 | 0.00 |  |
| TopShare | 0.453 | 0.453 | 0.00 |  |
| ForSide | 200.244 | 200.244 | 0.00 |  |
| AgainstSide | 65.808 | 65.808 | 0.00 |  |
| NetEdge | 1.443 | 1.443 | 0.00 |  |
| WalletPlayScore | 2.266 | 2.266 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=156)

- **Concentration issue**: 31 high-concentration picks (TopShare>0.6) at -11.5% ROI

### 7-Day (n=93)

- **Concentration issue**: 21 high-concentration picks (TopShare>0.6) at -23.8% ROI

### All Time (n=718)

- **Sizing issue**: Model P/L (-50.04u) trails flat (-38.86u) by 11.18u
- **Environment issue**: 73.3% NO_MOVE (WR: 53.6%, ROI: -5.3%)
- **Concentration issue**: 31 high-concentration picks (TopShare>0.6) at -11.5% ROI


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
| V8 era picks | 156 |
| V8 flat ROI | -6.0% |
| V8 model ROI | -2.5% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 7.4% |
| 2.5-3★ ROI | -23.8% |
| CLEAR_MOVE ROI | 1.2% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 7.1% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.25% | 4.5★: -0.68% | 4★: 0.03% | 3.5★: 0.14% | 3★: -0.02% | 2.5★: 0.09% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=156)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 110 | 70.5% | 45.5% | -8.9% | -8.0% | 0.23% |
| MUTED | 39 | 25.0% | 51.3% | -3.2% | 9.7% | -0.43% |
| CANCELLED | 7 | 4.5% | 71.4% | 23.9% | 24.8% | 0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 12 | 41.7% |
| wps_flipped_diag | 10 | 40.0% |
| winners_faded | 9 | 66.7% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 6 | 66.7% |
| winners_killed | 5 | 80.0% |
| whitelist_fade_weak | 3 | 66.7% |
| opp_side_stronger_diag | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |
| sum_below_floor | 2 | 50.0% |

### 7-Day (n=93)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 52 | 55.9% | 44.2% | -17.0% | -11.6% | 0.35% |
| MUTED | 34 | 36.6% | 52.9% | 4.4% | 18.9% | -0.44% |
| CANCELLED | 7 | 7.5% | 71.4% | 23.9% | 24.8% | 0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 12 | 41.7% |
| wps_flipped_diag | 10 | 40.0% |
| winners_faded | 9 | 66.7% |
| quality_below_floor | 6 | 66.7% |
| winners_killed | 5 | 80.0% |
| below_lock_range | 4 | 25.0% |
| opp_side_stronger_diag | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |
| sum_below_floor | 2 | 50.0% |
| whitelist_fade_weak | 1 | 100.0% |

### All Time (n=718)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 670 | 93.3% | 52.1% | -6.3% | -5.8% | -0.30% |
| MUTED | 39 | 5.4% | 51.3% | -3.2% | 9.7% | -0.43% |
| CANCELLED | 9 | 1.3% | 77.8% | 47.7% | 42.3% | -0.91% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 12 | 41.7% |
| wps_flipped_diag | 10 | 40.0% |
| winners_faded | 9 | 66.7% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 6 | 66.7% |
| winners_killed | 5 | 80.0% |
| whitelist_fade_weak | 3 | 66.7% |
| opp_side_stronger_diag | 3 | 66.7% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| sum_below_floor | 2 | 50.0% |
