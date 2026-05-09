# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-09 ET
**Completed Picks**: 766 | **V8 Era Picks**: 204 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (63.6%) beats 5★ (52.7%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 13 | 69.2% | 3.86u | 29.7% | 11.52u | 43.2% | -0.01% | -0.67% | Strong |
| 7-Day | 34 | 52.9% | -0.18u | -0.5% | 3.99u | 6.9% | -1.10% | -0.33% |  |
| 14-Day | 118 | 49.2% | -7.77u | -6.6% | -3.81u | -2.3% | -0.36% | -0.25% |  |
| 30-Day | 443 | 48.8% | -38.61u | -8.7% | -51.38u | -8.2% | -0.25% | -0.27% |  |
| V8 Era | 204 | 48.5% | -10.91u | -5.3% | -6.65u | -2.4% | -0.10% | -0.39% |  |
| All Time | 766 | 52.2% | -40.42u | -5.3% | -51.53u | -4.5% | -0.35% | -0.08% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=204)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 55 | 53.2% | 53.2% | 52.7% | -0.5% | -4.1% | 1.9% | 2.40 | 0.07% | Fair |
| 4.5 | 11 | 49.8% | 49.8% | 63.6% | +13.8% | 36.7% | 35.5% | 2.32 | -0.62% | Strong |
| 4 | 29 | 52.7% | 52.7% | 51.7% | -1.0% | 0.5% | -10.6% | 1.23 | 0.17% | Fair |
| 3.5 | 54 | 51.2% | 51.2% | 48.1% | -3.1% | -0.2% | 0.8% | 0.74 | -0.21% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 30 | 53.2% | 53.2% | 40.0% | -13.2% | -23.0% | -36.3% | 0.73 | -0.28% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.7% | 63.6% | -10.9% | INVERTED |
| 4.5★ vs 4★ | 63.6% | 51.7% | +11.9% | Correct |
| 4★ vs 3.5★ | 51.7% | 48.1% | +3.6% | Correct |
| 3.5★ vs 3★ | 48.1% | 38.1% | +10.0% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.0% | -1.9% | Flat |
| 2.5★ vs 2★ | 40.0% | 0.0% | +40.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.929 |
| Spearman: Stars vs Flat ROI | 0.750 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2521 |
| Monotonicity Score | -0.33 |

### All Time (n=766)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 68 | 54.2% | 54.2% | 52.9% | -1.3% | -5.0% | -1.3% | 2.44 | 0.22% | Weak |
| 4.5 | 45 | 55.8% | 55.8% | 53.3% | -2.4% | -0.4% | -4.5% | 2.54 | 0.96% | Fair |
| 4 | 144 | 55.3% | 55.3% | 53.5% | -1.8% | -2.5% | -4.6% | 1.94 | -0.54% | Fair |
| 3.5 | 172 | 55.0% | 55.0% | 55.8% | +0.8% | 0.3% | 2.5% | 1.44 | -0.32% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 137 | 54.2% | 54.2% | 51.8% | -2.4% | -5.6% | -5.9% | 0.73 | -0.69% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.9% | 53.3% | -0.4% | Flat |
| 4.5★ vs 4★ | 53.3% | 53.5% | -0.2% | Flat |
| 4★ vs 3.5★ | 53.5% | 55.8% | -2.3% | Flat |
| 3.5★ vs 3★ | 55.8% | 47.5% | +8.3% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.8% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.607 |
| Spearman: Stars vs Flat ROI | 0.643 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2340 |
| Monotonicity Score | 0.33 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.078 | 0.054 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.077 | -0.067 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.035 | -0.059 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.010 | -0.033 | Monitor |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.136 | 0.158 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.196 | 0.213 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.121 | 0.118 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.019 | 0.036 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.045 | 0.093 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.009 | -0.008 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.082 | 0.103 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.075 | -0.013 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.090 | 0.004 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.033 | 0.020 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (36.10–50.30) | 32 | 50.0% | 1.2% | 16.8% | -0.62% |  |
| p20-40 (50.40–54.05) | 33 | 48.5% | -9.1% | 6.8% | 0.58% |  |
| p40-60 (54.47–58.36) | 33 | 60.6% | 33.7% | 9.4% | 0.13% |  |
| p60-80 (58.48–63.20) | 32 | 43.8% | -14.2% | -6.7% | 0.43% |  |
| p80-95 (63.25–65.93) | 33 | 42.4% | -29.0% | -28.7% | -0.68% |  |
| p95+ (66.00–82.40) | 33 | 42.4% | -18.5% | -19.9% | -0.55% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 69 | 42.0% | -20.5% | -18.0% | -0.14% |  |
| 0.90-1.05 | 64 | 42.2% | -20.5% | -22.2% | -0.30% |  |
| 1.05-1.20 | 45 | 64.4% | 35.6% | 42.5% | 0.23% |  |
| 1.20-1.35 | 9 | 55.6% | 7.7% | -23.5% | -0.14% |  |
| 1.35-1.50 | 6 | 50.0% | 2.3% | -24.1% | 0.52% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.71) | 32 | 50.0% | -1.8% | 7.5% | -0.43% |  |
| 20-40% (0.72–0.93) | 33 | 48.5% | -6.8% | 6.4% | -0.78% |  |
| 40-60% (0.93–1.23) | 32 | 65.6% | 39.0% | 6.5% | 0.26% |  |
| 60-80% (1.24–1.55) | 33 | 30.3% | -43.3% | -30.1% | 0.00% |  |
| 80-95% (1.57–2.11) | 32 | 37.5% | -33.3% | -16.6% | -0.09% |  |
| 95%+ (2.13–4.76) | 33 | 54.5% | 6.5% | 1.9% | 0.45% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 14 | 35.7% | -20.2% | -26.7% | 0.45% | Broad support |
| 0.25-0.40 | 67 | 50.7% | 0.2% | -5.5% | 0.09% | Healthy support |
| 0.40-0.60 | 65 | 43.1% | -14.9% | 4.7% | 0.01% | Concentrated |
| 0.60-0.80 | 35 | 54.3% | 0.7% | 0.4% | -0.22% | Very concentrated |
| 0.80-1.00 | 14 | 50.0% | -7.1% | -23.3% | -1.80% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 31 | 38.7% | -26.3% | -14.3% | -0.18% | 4.1 |
| Broad battle | 115 | 47.8% | -4.2% | -0.6% | -0.07% | 3.9 |
| One-wallet nuke | 23 | 56.5% | 5.4% | 12.3% | -1.12% | 3.4 |
| Thin support | 81 | 50.6% | -4.2% | -4.6% | -0.33% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=204)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 33 | 30.3% | -42.9% | -48.2% | 0.19% | 3.9 | 100.0% |
| CLEAR_MOVE | 61 | 59.0% | 6.5% | 14.2% | -0.35% | 4.0 | 100.0% |
| NEAR_START | 100 | 48.0% | -0.9% | -1.4% | -0.08% | 3.6 | 100.0% |

**All Time** (n=766)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 36 | 30.6% | -42.2% | -48.7% | 0.36% | 4.0 | 91.7% |
| CLEAR_MOVE | 87 | 57.5% | 4.7% | 9.9% | -0.37% | 4.0 | 100.0% |
| NEAR_START | 116 | 48.3% | -2.4% | -3.3% | -0.02% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 10 / 30.0% / -53.8% | 25 / 64.0% / 12.6% | 25 / 56.0% / 16.4% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 20 / 30.0% / -37.7% | 23 / 52.2% / -4.4% | 38 / 57.9% / 21.5% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 36 / 33.3% / -33.8% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 201 | 48.3% | -5.9% | -3.1% | 3.8 | -0.11% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 251 | 49.0% | -5.8% | -3.5% | 3.8 | -0.11% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 345 | 100% |
| LOCKED (direct) | 65 | 18.8% |
| Promoted (SHADOW→LOCKED) | 144 | 41.7% |
| Rejected (stayed SHADOW) | 104 | 30.1% |
| Superseded (side flipped) | 27 | 7.8% |
| Muted | 166 | 48.1% |
| Cancelled | 15 | 4.3% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=204)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -6.65u | -2.4% | — |
| Flat 1.0u | -10.91u | -5.3% | +4.26u |
| Lock units only | -4.50u | — | -2.15u |
| Units change only on star change | -0.53u | — | -6.12u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 55 | 2.40 | -4.1% | 1.9% | +4.76u | Sizing helps |
| 4.5 | 11 | 2.32 | 36.7% | 35.5% | +5.00u | Sizing helps |
| 4 | 29 | 1.23 | 0.5% | -10.6% | -3.94u | Sizing hurts |
| 3.5 | 54 | 0.74 | -0.2% | 0.8% | +0.44u | Neutral |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 30 | 0.73 | -23.0% | -36.3% | -1.02u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=766)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -51.53u | -4.5% | — |
| Flat 1.0u | -40.42u | -5.3% | -11.11u |
| Lock units only | -38.61u | — | -12.92u |
| Units change only on star change | -44.57u | — | -6.96u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 68 | 2.44 | -5.0% | -1.3% | +1.17u | Sizing helps |
| 4.5 | 45 | 2.54 | -0.4% | -4.5% | -5.01u | Sizing hurts |
| 4 | 144 | 1.94 | -2.5% | -4.6% | -9.18u | Sizing hurts |
| 3.5 | 172 | 1.44 | 0.3% | 2.5% | +5.75u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 137 | 0.73 | -5.6% | -5.9% | +1.69u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 204 | 52.7% | 48.5% | -4.2% | -5.3% | -0.10% | Below market |
| 4.5-5★ | 66 | 52.6% | 54.5% | +1.9% | 2.7% | -0.05% | Neutral |
| 3.5-4★ | 83 | 51.7% | 49.4% | -2.3% | 0.0% | -0.08% | Below market |
| 2.5-3★ | 53 | 54.2% | 41.5% | -12.7% | -20.2% | -0.19% | Below market |
| CLEAR_MOVE only | 61 | 54.3% | 59.0% | +4.7% | 6.5% | -0.35% | Beating market |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=33)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.061 | 60.478 | 0.23 |  |
| Rank_norm | 64.633 | 64.244 | 0.03 |  |
| PnL_norm | 56.778 | 55.994 | 0.05 |  |
| WalletBase | 58.464 | 59.850 | 0.17 |  |
| SizeRatio | 1.624 | 1.629 | 0.00 |  |
| ConvictionMult | 0.977 | 1.025 | 0.29 |  |
| WalletCountFor | 3.405 | 2.788 | 0.35 |  |
| TopShare | 0.480 | 0.615 | 0.68 |  |
| ForSide | 196.269 | 171.739 | 0.23 |  |
| AgainstSide | 64.718 | 46.112 | 0.21 |  |
| NetEdge | 1.413 | 1.325 | 0.10 |  |
| WalletPlayScore | 2.078 | 1.156 | 0.44 |  |

### V8 Era (n=195)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.061 | 58.006 | 0.01 |  |
| Rank_norm | 64.633 | 64.562 | 0.00 |  |
| PnL_norm | 56.778 | 56.845 | 0.00 |  |
| WalletBase | 58.464 | 58.417 | 0.01 |  |
| SizeRatio | 1.624 | 1.595 | 0.02 |  |
| ConvictionMult | 0.977 | 0.975 | 0.01 |  |
| WalletCountFor | 3.405 | 3.405 | 0.00 |  |
| TopShare | 0.480 | 0.480 | 0.00 |  |
| ForSide | 196.269 | 196.269 | 0.00 |  |
| AgainstSide | 64.718 | 64.718 | 0.00 |  |
| NetEdge | 1.413 | 1.413 | 0.00 |  |
| WalletPlayScore | 2.078 | 2.078 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=204)

- **Gate issue**: NO_MOVE ROI (-13.8%) significantly trails CLEAR_MOVE (6.5%)

### 7-Day (n=34)

- **Ranking issue**: ≤3★ WR (67%) beats ≥4★ (50%)
- **Odds issue**: Avg CLV -1.10% — consistently getting bad closing lines

### All Time (n=766)

- **Sizing issue**: Model P/L (-51.53u) trails flat (-40.42u) by 11.11u
- **Environment issue**: 68.7% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 204 |
| V8 flat ROI | -5.3% |
| V8 model ROI | -2.4% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | 2.7% |
| 2.5-3★ ROI | -20.2% |
| CLEAR_MOVE ROI | 6.5% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 11.3% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.07% | 4.5★: -0.62% | 4★: 0.17% | 3.5★: -0.21% | 3★: -0.02% | 2.5★: -0.28% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=204)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 146 | 71.6% | 47.3% | -5.4% | -5.4% | 0.01% |
| MUTED | 50 | 24.5% | 50.0% | -7.3% | 9.3% | -0.41% |
| CANCELLED | 8 | 3.9% | 62.5% | 8.4% | -7.4% | -0.17% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 15 | 40.0% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| winners_faded | 11 | 63.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| opp_side_stronger_diag | 7 | 42.9% |
| winners_killed | 6 | 66.7% |
| ags_quality_veto | 5 | 60.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |

### 7-Day (n=34)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 26 | 76.5% | 53.8% | 4.7% | 15.1% | -0.99% |
| MUTED | 7 | 20.6% | 57.1% | -5.8% | 8.4% | -0.37% |
| CANCELLED | 1 | 2.9% | 0.0% | -100.0% | -100.0% | -7.24% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 13 | 46.2% |
| ags_quality_veto | 5 | 60.0% |
| opp_side_stronger_diag | 4 | 25.0% |
| wps_flipped_diag | 2 | 0.0% |
| winners_killed | 1 | 0.0% |
| winners_faded | 1 | 0.0% |
| winners_below_floor | 1 | 100.0% |

### All Time (n=766)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 706 | 92.2% | 52.1% | -5.7% | -5.5% | -0.33% |
| MUTED | 50 | 6.5% | 50.0% | -7.3% | 9.3% | -0.41% |
| CANCELLED | 10 | 1.3% | 70.0% | 32.9% | 10.4% | -1.54% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 15 | 40.0% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| winners_faded | 11 | 63.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| opp_side_stronger_diag | 7 | 42.9% |
| winners_killed | 6 | 66.7% |
| ags_quality_veto | 5 | 60.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
