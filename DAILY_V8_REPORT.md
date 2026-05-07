# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-07 ET
**Completed Picks**: 757 | **V8 Era Picks**: 195 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: MONITORING
- **Ranking health**: HEALTHY
- **Sizing health**: MARGINAL
- **Environment health**: HEALTHY
- **Most important takeaway**: Sizing is amplifying losses — consider flattening unit assignments until ranking layer stabilizes.

---

## 1. Intervention Triggers

**No intervention triggers fired.** System operating within parameters.


---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 16 | 43.8% | -2.95u | -18.4% | -1.59u | -4.9% | -2.03% | -0.36% | Cold streak |
| 7-Day | 39 | 46.2% | -3.80u | -9.7% | -9.28u | -17.7% | -0.85% | -0.30% |  |
| 14-Day | 132 | 48.5% | -9.45u | -7.2% | -8.63u | -4.6% | -0.17% | -0.29% |  |
| 30-Day | 480 | 49.0% | -42.69u | -8.9% | -65.94u | -9.8% | -0.22% | -0.20% |  |
| V8 Era | 195 | 47.7% | -13.15u | -6.7% | -14.44u | -5.5% | -0.09% | -0.38% |  |
| All Time | 757 | 52.0% | -42.66u | -5.6% | -59.32u | -5.2% | -0.35% | -0.07% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=195)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 54 | 53.2% | 53.2% | 51.9% | -1.4% | -6.0% | -0.7% | 2.38 | 0.07% | Weak |
| 4.5 | 9 | 49.5% | 49.5% | 55.6% | +6.1% | 23.7% | 13.0% | 2.06 | -0.68% | Strong |
| 4 | 27 | 52.7% | 52.7% | 51.9% | -0.8% | 0.5% | -8.1% | 1.23 | 0.15% | Fair |
| 3.5 | 50 | 50.7% | 50.7% | 48.0% | -2.7% | 1.1% | 3.9% | 0.72 | -0.20% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 30 | 53.2% | 53.2% | 40.0% | -13.2% | -23.0% | -36.3% | 0.73 | -0.28% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 51.9% | 55.6% | -3.7% | INVERTED |
| 4.5★ vs 4★ | 55.6% | 51.9% | +3.7% | Correct |
| 4★ vs 3.5★ | 51.9% | 48.0% | +3.9% | Correct |
| 3.5★ vs 3★ | 48.0% | 38.1% | +9.9% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.0% | -1.9% | Flat |
| 2.5★ vs 2★ | 40.0% | 0.0% | +40.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.857 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2523 |
| Monotonicity Score | -0.33 |

### All Time (n=757)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 67 | 54.3% | 54.3% | 52.2% | -2.0% | -6.5% | -3.4% | 2.43 | 0.22% | Weak |
| 4.5 | 43 | 56.0% | 56.0% | 51.2% | -4.8% | -4.8% | -11.0% | 2.49 | 1.03% | Fair |
| 4 | 142 | 55.3% | 55.3% | 53.5% | -1.8% | -2.5% | -4.2% | 1.95 | -0.55% | Fair |
| 3.5 | 168 | 55.0% | 55.0% | 56.0% | +1.0% | 0.6% | 3.0% | 1.45 | -0.32% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 137 | 54.2% | 54.2% | 51.8% | -2.4% | -5.6% | -5.9% | 0.73 | -0.69% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.2% | 51.2% | +1.0% | Correct |
| 4.5★ vs 4★ | 51.2% | 53.5% | -2.3% | Flat |
| 4★ vs 3.5★ | 53.5% | 56.0% | -2.5% | Flat |
| 3.5★ vs 3★ | 56.0% | 47.5% | +8.5% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.8% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.429 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2339 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.101 | 0.067 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.066 | -0.065 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.016 | -0.048 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.009 | -0.025 | Monitor |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.132 | 0.162 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.187 | 0.214 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.133 | 0.132 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.018 | 0.034 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.043 | 0.095 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.004 | -0.013 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.069 | 0.091 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.062 | -0.019 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.075 | -0.004 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.023 | 0.021 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (36.10–50.53) | 31 | 41.9% | -14.4% | -12.3% | -0.53% |  |
| p20-40 (50.55–54.76) | 31 | 58.1% | 23.0% | 22.5% | 0.49% |  |
| p40-60 (54.80–59.08) | 31 | 54.8% | 9.9% | -1.1% | 0.38% |  |
| p60-80 (59.10–63.29) | 31 | 45.2% | -12.3% | -2.5% | 0.26% |  |
| p80-95 (63.40–65.93) | 31 | 41.9% | -28.3% | -31.3% | -0.69% |  |
| p95+ (66.00–82.40) | 32 | 40.6% | -22.2% | -21.9% | -0.55% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 68 | 41.2% | -22.3% | -19.1% | -0.14% |  |
| 0.90-1.05 | 61 | 42.6% | -19.8% | -24.1% | -0.32% |  |
| 1.05-1.20 | 42 | 61.9% | 32.5% | 36.6% | 0.26% |  |
| 1.20-1.35 | 7 | 57.1% | 11.2% | -23.4% | -0.01% |  |
| 1.35-1.50 | 6 | 50.0% | 2.3% | -24.1% | 0.52% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.73) | 31 | 45.2% | -9.5% | -6.9% | -0.63% |  |
| 20-40% (0.74–0.93) | 31 | 51.6% | -0.8% | 26.6% | -0.60% |  |
| 40-60% (0.94–1.25) | 31 | 64.5% | 36.9% | -0.8% | 0.13% |  |
| 60-80% (1.25–1.58) | 31 | 32.3% | -40.2% | -26.3% | 0.20% |  |
| 80-95% (1.58–2.17) | 31 | 32.3% | -41.9% | -33.1% | -0.08% |  |
| 95%+ (2.22–4.76) | 31 | 54.8% | 5.9% | 0.4% | 0.43% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 14 | 35.7% | -20.2% | -26.7% | 0.45% | Broad support |
| 0.25-0.40 | 66 | 50.0% | -1.2% | -8.7% | 0.10% | Healthy support |
| 0.40-0.60 | 63 | 41.3% | -17.7% | -0.4% | 0.01% | Concentrated |
| 0.60-0.80 | 32 | 53.1% | -2.3% | -6.5% | -0.23% | Very concentrated |
| 0.80-1.00 | 11 | 54.5% | 0.9% | -13.1% | -2.18% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 30 | 36.7% | -30.3% | -22.1% | -0.18% | 4.0 |
| Broad battle | 113 | 46.9% | -5.5% | -3.1% | -0.07% | 3.9 |
| One-wallet nuke | 20 | 60.0% | 11.6% | 20.7% | -1.24% | 3.4 |
| Thin support | 76 | 51.3% | -3.1% | -1.7% | -0.34% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=195)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 32 | 31.3% | -41.1% | -46.8% | 0.19% | 3.9 | 100.0% |
| CLEAR_MOVE | 60 | 58.3% | 5.1% | 13.6% | -0.33% | 4.0 | 100.0% |
| NEAR_START | 93 | 46.2% | -3.4% | -8.9% | -0.08% | 3.6 | 100.0% |

**All Time** (n=757)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 35 | 31.4% | -40.6% | -47.6% | 0.36% | 4.0 | 91.4% |
| CLEAR_MOVE | 86 | 57.0% | 3.7% | 9.4% | -0.35% | 4.0 | 100.0% |
| NEAR_START | 109 | 46.8% | -4.7% | -9.5% | -0.02% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 10 / 30.0% / -53.8% | 25 / 64.0% / 12.6% | 22 / 50.0% / 5.7% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 19 / 31.6% / -34.4% | 22 / 50.0% / -8.7% | 34 / 58.8% / 25.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 36 / 33.3% / -33.8% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 192 | 47.4% | -7.3% | -6.3% | 3.8 | -0.11% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 242 | 48.3% | -7.0% | -5.8% | 3.8 | -0.10% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 336 | 100% |
| LOCKED (direct) | 65 | 19.3% |
| Promoted (SHADOW→LOCKED) | 136 | 40.5% |
| Rejected (stayed SHADOW) | 103 | 30.7% |
| Superseded (side flipped) | 27 | 8.0% |
| Muted | 162 | 48.2% |
| Cancelled | 15 | 4.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=195)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -14.44u | -5.5% | — |
| Flat 1.0u | -13.15u | -6.7% | -1.29u |
| Lock units only | -10.35u | — | -4.09u |
| Units change only on star change | -6.38u | — | -8.06u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 54 | 2.38 | -6.0% | -0.7% | +2.39u | Sizing helps |
| 4.5 | 9 | 2.06 | 23.7% | 13.0% | +0.27u | Neutral |
| 4 | 27 | 1.23 | 0.5% | -8.1% | -2.81u | Sizing hurts |
| 3.5 | 50 | 0.72 | 1.1% | 3.9% | +0.87u | Sizing helps |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 30 | 0.73 | -23.0% | -36.3% | -1.02u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=757)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -59.32u | -5.2% | — |
| Flat 1.0u | -42.66u | -5.6% | -16.66u |
| Lock units only | -44.46u | — | -14.86u |
| Units change only on star change | -50.42u | — | -8.90u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 67 | 2.43 | -6.5% | -3.4% | -1.21u | Sizing hurts |
| 4.5 | 43 | 2.49 | -4.8% | -11.0% | -9.75u | Sizing hurts |
| 4 | 142 | 1.95 | -2.5% | -4.2% | -8.05u | Sizing hurts |
| 3.5 | 168 | 1.45 | 0.6% | 3.0% | +6.18u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 137 | 0.73 | -5.6% | -5.9% | +1.69u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 195 | 52.6% | 47.7% | -4.9% | -6.7% | -0.09% | Below market |
| 4.5-5★ | 63 | 52.7% | 52.4% | -0.3% | -1.7% | -0.04% | Neutral |
| 3.5-4★ | 77 | 51.4% | 49.4% | -2.0% | 0.9% | -0.07% | Below market |
| 2.5-3★ | 53 | 54.2% | 41.5% | -12.7% | -20.2% | -0.19% | Below market |
| CLEAR_MOVE only | 60 | 54.4% | 58.3% | +4.0% | 5.1% | -0.33% | Beating market |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=38)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.330 | 63.028 | 0.46 |  |
| Rank_norm | 64.987 | 63.384 | 0.11 |  |
| PnL_norm | 57.076 | 55.508 | 0.11 |  |
| WalletBase | 58.708 | 60.823 | 0.26 |  |
| SizeRatio | 1.619 | 1.403 | 0.14 |  |
| ConvictionMult | 0.973 | 0.975 | 0.01 |  |
| WalletCountFor | 3.446 | 3.263 | 0.10 |  |
| TopShare | 0.470 | 0.537 | 0.35 |  |
| ForSide | 199.156 | 194.921 | 0.04 |  |
| AgainstSide | 65.234 | 63.000 | 0.03 |  |
| NetEdge | 1.437 | 1.414 | 0.03 |  |
| WalletPlayScore | 2.164 | 1.769 | 0.19 |  |

### V8 Era (n=186)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.330 | 58.274 | 0.01 |  |
| Rank_norm | 64.987 | 64.915 | 0.00 |  |
| PnL_norm | 57.076 | 57.147 | 0.00 |  |
| WalletBase | 58.708 | 58.660 | 0.01 |  |
| SizeRatio | 1.619 | 1.589 | 0.02 |  |
| ConvictionMult | 0.973 | 0.971 | 0.01 |  |
| WalletCountFor | 3.446 | 3.446 | 0.00 |  |
| TopShare | 0.470 | 0.470 | 0.00 |  |
| ForSide | 199.156 | 199.156 | 0.00 |  |
| AgainstSide | 65.234 | 65.234 | 0.00 |  |
| NetEdge | 1.437 | 1.437 | 0.00 |  |
| WalletPlayScore | 2.164 | 2.164 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=195)

- **Sizing issue**: Model P/L (-14.44u) trails flat (-13.15u) by 1.29u
- **Gate issue**: NO_MOVE ROI (-13.8%) significantly trails CLEAR_MOVE (5.1%)

### 7-Day (n=39)

- **Sizing issue**: Model P/L (-9.28u) trails flat (-3.80u) by 5.48u
- **Odds issue**: Avg CLV -0.85% — consistently getting bad closing lines

### All Time (n=757)

- **Sizing issue**: Model P/L (-59.32u) trails flat (-42.66u) by 16.66u
- **Environment issue**: 69.5% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 195 |
| V8 flat ROI | -6.7% |
| V8 model ROI | -5.5% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | -1.7% |
| 2.5-3★ ROI | -20.2% |
| CLEAR_MOVE ROI | 5.1% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 10.3% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.07% | 4.5★: -0.68% | 4★: 0.15% | 3.5★: -0.20% | 3★: -0.02% | 2.5★: -0.28% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=195)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 140 | 71.8% | 46.4% | -7.0% | -8.3% | 0.02% |
| MUTED | 47 | 24.1% | 48.9% | -8.7% | 5.4% | -0.42% |
| CANCELLED | 8 | 4.1% | 62.5% | 8.4% | -7.4% | -0.17% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| v73_hc_rescue | 13 | 38.5% |
| winners_faded | 11 | 63.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| opp_side_stronger_diag | 6 | 33.3% |
| winners_killed | 6 | 66.7% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| ags_quality_veto | 2 | 50.0% |

### 7-Day (n=39)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 30 | 76.9% | 50.0% | 0.0% | -9.6% | -0.74% |
| MUTED | 8 | 20.5% | 37.5% | -35.0% | -25.8% | -0.39% |
| CANCELLED | 1 | 2.6% | 0.0% | -100.0% | -100.0% | -7.24% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 13 | 38.5% |
| wps_flipped_diag | 3 | 0.0% |
| opp_side_stronger_diag | 3 | 0.0% |
| winners_below_floor | 2 | 50.0% |
| ags_quality_veto | 2 | 50.0% |
| winners_faded | 2 | 50.0% |
| quality_below_floor | 1 | 0.0% |
| winners_killed | 1 | 0.0% |
| sum_below_floor | 1 | 0.0% |

### All Time (n=757)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 700 | 92.5% | 52.0% | -6.0% | -6.0% | -0.33% |
| MUTED | 47 | 6.2% | 48.9% | -8.7% | 5.4% | -0.42% |
| CANCELLED | 10 | 1.3% | 70.0% | 32.9% | 10.4% | -1.54% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| v73_hc_rescue | 13 | 38.5% |
| winners_faded | 11 | 63.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| opp_side_stronger_diag | 6 | 33.3% |
| winners_killed | 6 | 66.7% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| ags_quality_veto | 2 | 50.0% |
