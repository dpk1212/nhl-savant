# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-23 ET
**Completed Picks**: 625 | **V8 Era Picks**: 63 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 3.5★ WR (50.0%) beats 4★ (33.3%) |
| Star inversion | ⚠️ | 2.5★ WR (47.4%) beats 3★ (37.5%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 2.1u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 43 | 41.9% | -5.17u | -12.0% | -11.96u | -25.1% | -0.07% | -0.54% | Cold streak |
| 7-Day | 84 | 45.2% | -7.61u | -9.1% | -12.69u | -11.2% | 0.16% | -0.54% |  |
| 14-Day | 302 | 48.3% | -31.39u | -10.4% | -50.54u | -12.1% | -0.29% | -0.25% |  |
| 30-Day | 625 | 52.8% | -33.21u | -5.3% | -50.69u | -5.4% | -0.40% | -0.03% |  |
| V8 Era | 63 | 46.0% | -3.69u | -5.9% | -5.81u | -7.8% | 0.08% | -0.57% |  |
| All Time | 625 | 52.8% | -33.21u | -5.3% | -50.69u | -5.4% | -0.40% | -0.03% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=63)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 5 | 65.3% | 65.3% | 60.0% | -5.3% | -9.9% | -11.4% | 2.60 | 1.02% | Weak |
| 4.5 | 7 | 50.4% | 50.4% | 57.1% | +6.8% | 31.0% | 26.0% | 1.93 | -0.85% | Strong |
| 4 | 6 | 56.2% | 56.2% | 33.3% | -22.9% | -36.3% | -17.4% | 1.54 | -0.37% | Failing |
| 3.5 | 10 | 47.3% | 47.3% | 50.0% | +2.7% | 28.9% | 5.4% | 1.00 | 0.53% | Strong |
| 3 | 16 | 56.3% | 56.3% | 37.5% | -18.8% | -27.4% | -31.1% | 0.92 | 0.16% | Failing |
| 2.5 | 19 | 53.8% | 53.8% | 47.4% | -6.5% | -8.9% | -16.0% | 0.72 | 0.04% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 60.0% | 57.1% | +2.9% | Correct |
| 4.5★ vs 4★ | 57.1% | 33.3% | +23.8% | Correct |
| 4★ vs 3.5★ | 33.3% | 50.0% | -16.7% | INVERTED |
| 3.5★ vs 3★ | 50.0% | 37.5% | +12.5% | Correct |
| 3★ vs 2.5★ | 37.5% | 47.4% | -9.9% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.600 |
| Spearman: Stars vs Flat ROI | 0.086 |
| Spearman: Stars vs CLV | 0.086 |
| Brier Score | 0.2719 |
| Monotonicity Score | -0.20 |

### All Time (n=625)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 18 | 60.5% | 60.5% | 55.6% | -4.9% | -9.1% | -13.1% | 2.64 | 0.93% | Weak |
| 4.5 | 41 | 56.4% | 56.4% | 51.2% | -5.2% | -5.0% | -10.5% | 2.49 | 1.10% | Weak |
| 4 | 121 | 56.0% | 56.0% | 52.9% | -3.1% | -4.9% | -4.2% | 2.10 | -0.72% | Fair |
| 3.5 | 128 | 56.0% | 56.0% | 58.6% | +2.5% | 2.7% | 2.9% | 1.70 | -0.30% | Fair |
| 3 | 176 | 55.3% | 55.3% | 47.7% | -7.5% | -14.3% | -12.3% | 1.18 | -0.54% | Weak |
| 2.5 | 126 | 54.4% | 54.4% | 54.0% | -0.4% | -1.9% | -0.2% | 0.73 | -0.69% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 55.6% | 51.2% | +4.4% | Correct |
| 4.5★ vs 4★ | 51.2% | 52.9% | -1.7% | Flat |
| 4★ vs 3.5★ | 52.9% | 58.6% | -5.7% | INVERTED |
| 3.5★ vs 3★ | 58.6% | 47.7% | +10.9% | Correct |
| 3★ vs 2.5★ | 47.7% | 54.0% | -6.3% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.143 |
| Spearman: Stars vs Flat ROI | -0.314 |
| Spearman: Stars vs CLV | 0.600 |
| Brier Score | 0.2320 |
| Monotonicity Score | 0.20 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.102 | 0.140 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | 0.220 | 0.176 | Keep |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.131 | 0.117 | Keep |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.156 | 0.188 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.147 | 0.144 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.161 | 0.174 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.247 | 0.278 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.002 | 0.076 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.050 | 0.029 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.029 | 0.090 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.028 | 0.068 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.033 | -0.084 | Monitor |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.025 | -0.093 | Monitor |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.007 | 0.104 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (37.88–47.73) | 9 | 11.1% | -82.9% | -80.3% | 0.17% |  |
| p20-40 (48.10–50.53) | 10 | 50.0% | 17.5% | 3.4% | 0.24% |  |
| p40-60 (50.93–53.18) | 9 | 55.6% | -9.4% | -2.4% | -0.02% |  |
| p60-80 (53.23–55.77) | 10 | 50.0% | 36.8% | 3.1% | 0.27% |  |
| p80-95 (56.56–60.40) | 9 | 33.3% | -29.3% | -33.5% | 0.56% |  |
| p95+ (61.33–74.70) | 10 | 70.0% | 29.3% | 33.6% | -0.51% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 16 | 37.5% | -25.8% | -40.2% | -0.58% |  |
| 0.90-1.05 | 18 | 50.0% | -6.6% | 0.4% | 0.02% |  |
| 1.05-1.20 | 16 | 43.8% | 13.6% | -0.5% | 0.41% |  |
| 1.20-1.35 | 4 | 75.0% | 45.7% | 27.1% | 0.54% |  |
| 1.35-1.50 | 2 | 0.0% | -100.0% | -100.0% | 1.50% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.73) | 9 | 33.3% | -37.2% | -54.3% | 0.61% |  |
| 20-40% (0.77–1.00) | 10 | 60.0% | 8.5% | -12.6% | -0.36% |  |
| 40-60% (1.00–1.22) | 9 | 55.6% | 61.0% | 38.1% | 0.55% |  |
| 60-80% (1.24–1.45) | 10 | 30.0% | -52.8% | -61.0% | 0.08% |  |
| 80-95% (1.52–2.13) | 9 | 44.4% | -13.8% | -3.3% | -0.17% |  |
| 95%+ (2.56–4.76) | 10 | 50.0% | 9.5% | 8.8% | 0.07% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 6 | 50.0% | 18.8% | 1.5% | -0.71% | Broad support |
| 0.25-0.40 | 22 | 54.5% | 19.7% | 11.3% | 0.22% | Healthy support |
| 0.40-0.60 | 19 | 26.3% | -49.8% | -50.0% | 0.37% | Concentrated |
| 0.60-0.80 | 10 | 60.0% | 14.3% | -29.9% | -0.16% | Very concentrated |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 13 | 38.5% | -28.2% | -23.0% | 0.26% | 3.6 |
| Broad battle | 35 | 48.6% | 5.9% | 2.6% | 0.10% | 3.2 |
| One-wallet nuke | 6 | 50.0% | -18.6% | 13.0% | -0.11% | 4.3 |
| Thin support | 23 | 47.8% | -11.7% | -15.2% | 0.15% | 3.2 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=63)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 4 | 0.0% | -100.0% | -100.0% | 0.59% | 4.3 | 75.0% |
| SMALL_MOVE | 4 | 25.0% | -48.8% | -70.6% | 0.66% | 3.9 | 100.0% |
| CLEAR_MOVE | 15 | 66.7% | 15.9% | 33.4% | 0.20% | 3.4 | 100.0% |
| NEAR_START | 40 | 45.0% | -0.3% | -7.9% | -0.09% | 3.2 | 100.0% |

**All Time** (n=625)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 521 | 53.4% | -5.9% | -5.7% | -0.50% | 3.2 | 2.1% |
| SMALL_MOVE | 7 | 28.6% | -42.8% | -56.6% | 1.30% | 4.1 | 57.1% |
| CLEAR_MOVE | 41 | 58.5% | 6.1% | 11.2% | -0.18% | 3.7 | 100.0% |
| NEAR_START | 56 | 46.4% | -3.7% | -9.5% | 0.04% | 3.3 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 3 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | 4 / 100.0% / 63.5% | 4 / 75.0% / 78.4% |
| 3.5-4★ | — | 2 / 50.0% / 2.5% | 3 / 33.3% / -37.4% | 11 / 45.5% / 16.2% |
| 2.5-3★ | 1 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | 8 / 62.5% / 12.2% | 25 / 40.0% / -20.2% |
| 1.0-2★ | — | — | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 62 | 46.8% | -4.3% | -6.6% | 3.4 | 0.07% |
| SHADOW | 1 | 0.0% | -100.0% | -100.0% | 3.0 | 0.85% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 112 | 49.1% | -4.9% | -5.4% | 3.6 | -0.01% |
| SHADOW | 513 | 53.6% | -5.4% | -5.4% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 78 | 100% |
| LOCKED (direct) | 53 | 67.9% |
| Promoted (SHADOW→LOCKED) | 13 | 16.7% |
| Rejected (stayed SHADOW) | 8 | 10.3% |
| Superseded (side flipped) | 2 | 2.6% |
| Muted | 11 | 14.1% |
| Cancelled | 2 | 2.6% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=63)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -5.81u | -7.8% | — |
| Flat 1.0u | -3.69u | -5.9% | -2.12u |
| Lock units only | -1.31u | — | -4.50u |
| Units change only on star change | -5.95u | — | +0.14u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 5 | 2.60 | -9.9% | -11.4% | -0.99u | Sizing hurts |
| 4.5 | 7 | 1.93 | 31.0% | 26.0% | +1.34u | Sizing helps |
| 4 | 6 | 1.54 | -36.3% | -17.4% | +0.57u | Sizing helps |
| 3.5 | 10 | 1.00 | 28.9% | 5.4% | -2.35u | Sizing hurts |
| 3 | 16 | 0.92 | -27.4% | -31.1% | -0.21u | Neutral |
| 2.5 | 19 | 0.72 | -8.9% | -16.0% | -0.48u | Neutral |

### All Time (n=625)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -50.69u | -5.4% | — |
| Flat 1.0u | -33.21u | -5.3% | -17.48u |
| Lock units only | -35.43u | — | -15.26u |
| Units change only on star change | -49.99u | — | -0.70u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 18 | 2.64 | -9.1% | -13.1% | -4.58u | Sizing hurts |
| 4.5 | 41 | 2.49 | -5.0% | -10.5% | -8.68u | Sizing hurts |
| 4 | 121 | 2.10 | -4.9% | -4.2% | -4.67u | Sizing hurts |
| 3.5 | 128 | 1.70 | 2.7% | 2.9% | +2.96u | Sizing helps |
| 3 | 176 | 1.18 | -14.3% | -12.3% | -0.35u | Neutral |
| 2.5 | 126 | 0.73 | -1.9% | -0.2% | +2.23u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 63 | 54.2% | 46.0% | -8.1% | -5.9% | 0.08% | Below market |
| 4.5-5★ | 12 | 56.6% | 58.3% | +1.8% | 14.0% | -0.07% | Neutral |
| 3.5-4★ | 16 | 50.6% | 43.8% | -6.9% | 4.4% | 0.17% | Below market |
| 2.5-3★ | 35 | 55.0% | 42.9% | -12.1% | -17.4% | 0.09% | Below market |
| CLEAR_MOVE only | 15 | 56.3% | 66.7% | +10.3% | 15.9% | 0.20% | Beating market |
| NO_MOVE only | 4 | 53.9% | 0.0% | -53.9% | -100.0% | 0.59% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=57)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 53.125 | 53.125 | 0.00 |  |
| Rank_norm | 62.076 | 62.076 | 0.00 |  |
| PnL_norm | 54.182 | 54.182 | 0.00 |  |
| WalletBase | 54.217 | 54.217 | 0.00 |  |
| SizeRatio | 2.056 | 2.056 | 0.00 |  |
| ConvictionMult | 1.000 | 1.000 | 0.00 |  |
| WalletCountFor | 3.772 | 3.772 | 0.00 |  |
| TopShare | 0.427 | 0.427 | 0.00 |  |
| ForSide | 209.958 | 209.958 | 0.00 |  |
| AgainstSide | 66.870 | 66.870 | 0.00 |  |
| NetEdge | 1.531 | 1.531 | 0.00 |  |
| WalletPlayScore | 2.558 | 2.558 | 0.00 |  |

### V8 Era (n=57)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 53.125 | 53.125 | 0.00 |  |
| Rank_norm | 62.076 | 62.076 | 0.00 |  |
| PnL_norm | 54.182 | 54.182 | 0.00 |  |
| WalletBase | 54.217 | 54.217 | 0.00 |  |
| SizeRatio | 2.056 | 2.056 | 0.00 |  |
| ConvictionMult | 1.000 | 1.000 | 0.00 |  |
| WalletCountFor | 3.772 | 3.772 | 0.00 |  |
| TopShare | 0.427 | 0.427 | 0.00 |  |
| ForSide | 209.958 | 209.958 | 0.00 |  |
| AgainstSide | 66.870 | 66.870 | 0.00 |  |
| NetEdge | 1.531 | 1.531 | 0.00 |  |
| WalletPlayScore | 2.558 | 2.558 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=63)

- **Sizing issue**: Model P/L (-5.81u) trails flat (-3.69u) by 2.12u
- **Gate issue**: NO_MOVE ROI (-100.0%) significantly trails CLEAR_MOVE (15.9%)

### 7-Day (n=84)

- **Sizing issue**: Model P/L (-12.69u) trails flat (-7.61u) by 5.08u
- **Gate issue**: NO_MOVE ROI (-41.7%) significantly trails CLEAR_MOVE (11.1%)

### All Time (n=625)

- **Sizing issue**: Model P/L (-50.69u) trails flat (-33.21u) by 17.48u
- **Environment issue**: 83.4% NO_MOVE (WR: 53.4%, ROI: -5.9%)


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
| V8 era picks | 63 |
| V8 flat ROI | -5.9% |
| V8 model ROI | -7.8% |
| V8 star monotonicity score | -0.20 |
| 4.5-5★ ROI | 14.0% |
| 2.5-3★ ROI | -17.4% |
| CLEAR_MOVE ROI | 15.9% |
| NO_MOVE ROI | -100.0% |
| Single-wallet play rate | 9.5% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 1.02% | 4.5★: -0.85% | 4★: -0.37% | 3.5★: 0.53% | 3★: 0.16% | 2.5★: 0.04% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=63)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 58 | 92.1% | 46.6% | -1.6% | -3.6% | 0.12% |
| MUTED | 5 | 7.9% | 40.0% | -55.3% | -67.0% | -0.38% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 3 | 33.3% |
| whitelist_fade_weak | 2 | 50.0% |

### 7-Day (n=84)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 79 | 94.0% | 45.6% | -6.1% | -8.6% | 0.20% |
| MUTED | 5 | 6.0% | 40.0% | -55.3% | -67.0% | -0.38% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 3 | 33.3% |
| whitelist_fade_weak | 2 | 50.0% |

### All Time (n=625)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 618 | 98.9% | 52.8% | -5.3% | -5.3% | -0.37% |
| MUTED | 5 | 0.8% | 40.0% | -55.3% | -67.0% | -0.38% |
| CANCELLED | 2 | 0.3% | 100.0% | 131.0% | 131.0% | -7.02% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_weak | 2 | 50.0% |
