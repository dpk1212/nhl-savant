# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-06 ET
**Completed Picks**: 753 | **V8 Era Picks**: 191 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: NEEDS ATTENTION
- **Ranking health**: HEALTHY
- **Sizing health**: DEGRADED
- **Environment health**: HEALTHY
- **Most important takeaway**: Sizing is amplifying losses — consider flattening unit assignments until ranking layer stabilizes.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 3.4u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 19 | 42.1% | -3.96u | -20.8% | -5.60u | -20.4% | -1.65% | -0.17% | Cold streak |
| 7-Day | 45 | 44.4% | -5.39u | -12.0% | -6.54u | -11.9% | -0.76% | -0.22% | Cold streak |
| 14-Day | 139 | 47.5% | -13.92u | -10.0% | -13.67u | -7.1% | -0.18% | -0.33% |  |
| 30-Day | 492 | 48.6% | -47.29u | -9.6% | -75.61u | -11.0% | -0.23% | -0.19% |  |
| V8 Era | 191 | 47.1% | -14.77u | -7.7% | -18.17u | -7.2% | -0.10% | -0.38% |  |
| All Time | 753 | 51.9% | -44.28u | -5.9% | -63.05u | -5.6% | -0.36% | -0.07% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=191)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 51 | 53.2% | 53.2% | 51.0% | -2.2% | -6.7% | -2.5% | 2.35 | 0.05% | Weak |
| 4.5 | 9 | 49.5% | 49.5% | 55.6% | +6.1% | 23.7% | 13.0% | 2.06 | -0.68% | Strong |
| 4 | 27 | 52.7% | 52.7% | 51.9% | -0.8% | 0.5% | -8.1% | 1.23 | 0.15% | Fair |
| 3.5 | 49 | 50.9% | 50.9% | 46.9% | -4.0% | -1.8% | -0.5% | 0.71 | -0.20% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 30 | 53.2% | 53.2% | 40.0% | -13.2% | -23.0% | -36.3% | 0.73 | -0.28% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 51.0% | 55.6% | -4.6% | INVERTED |
| 4.5★ vs 4★ | 55.6% | 51.9% | +3.7% | Correct |
| 4★ vs 3.5★ | 51.9% | 46.9% | +5.0% | Correct |
| 3.5★ vs 3★ | 46.9% | 38.1% | +8.8% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.0% | -1.9% | Flat |
| 2.5★ vs 2★ | 40.0% | 0.0% | +40.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.857 |
| Spearman: Stars vs Flat ROI | 0.750 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2538 |
| Monotonicity Score | -0.33 |

### All Time (n=753)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 64 | 54.3% | 54.3% | 51.6% | -2.7% | -7.2% | -5.0% | 2.41 | 0.21% | Weak |
| 4.5 | 43 | 56.0% | 56.0% | 51.2% | -4.8% | -4.8% | -11.0% | 2.49 | 1.03% | Fair |
| 4 | 142 | 55.3% | 55.3% | 53.5% | -1.8% | -2.5% | -4.2% | 1.95 | -0.55% | Fair |
| 3.5 | 167 | 55.1% | 55.1% | 55.7% | +0.6% | -0.2% | 2.3% | 1.45 | -0.32% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 137 | 54.2% | 54.2% | 51.8% | -2.4% | -5.6% | -5.9% | 0.73 | -0.69% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 51.6% | 51.2% | +0.4% | Correct |
| 4.5★ vs 4★ | 51.2% | 53.5% | -2.3% | Flat |
| 4★ vs 3.5★ | 53.5% | 55.7% | -2.2% | Flat |
| 3.5★ vs 3★ | 55.7% | 47.5% | +8.2% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.8% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.321 |
| Spearman: Stars vs Flat ROI | 0.429 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2342 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.091 | 0.055 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.084 | -0.080 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.007 | -0.035 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.002 | -0.037 | Monitor |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.121 | 0.146 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.179 | 0.201 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.116 | 0.115 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.029 | 0.031 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.047 | 0.097 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.021 | -0.020 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.060 | 0.090 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.071 | -0.017 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.085 | -0.002 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.037 | 0.017 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (36.10–50.53) | 30 | 43.3% | -11.5% | -6.9% | -0.53% |  |
| p20-40 (50.55–54.80) | 31 | 58.1% | 22.7% | 19.7% | 0.42% |  |
| p40-60 (54.80–59.08) | 30 | 53.3% | 7.3% | -5.0% | 0.43% |  |
| p60-80 (59.10–63.29) | 31 | 45.2% | -12.3% | -2.5% | 0.26% |  |
| p80-95 (63.40–65.93) | 30 | 40.0% | -30.2% | -35.7% | -0.71% |  |
| p95+ (66.00–82.40) | 31 | 38.7% | -27.5% | -26.1% | -0.55% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 67 | 40.3% | -23.1% | -20.9% | -0.15% |  |
| 0.90-1.05 | 60 | 43.3% | -18.5% | -22.6% | -0.32% |  |
| 1.05-1.20 | 41 | 61.0% | 30.9% | 33.3% | 0.23% |  |
| 1.20-1.35 | 7 | 57.1% | 11.2% | -23.4% | -0.01% |  |
| 1.35-1.50 | 5 | 40.0% | -25.4% | -49.8% | 0.52% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.73) | 30 | 46.7% | -6.5% | 3.1% | -0.41% |  |
| 20-40% (0.73–0.93) | 31 | 51.6% | -0.8% | 15.3% | -0.82% |  |
| 40-60% (0.93–1.24) | 30 | 63.3% | 35.1% | -3.2% | 0.20% |  |
| 60-80% (1.24–1.55) | 31 | 29.0% | -46.0% | -39.4% | 0.07% |  |
| 80-95% (1.57–2.11) | 30 | 36.7% | -35.3% | -21.9% | -0.09% |  |
| 95%+ (2.13–4.76) | 31 | 51.6% | 3.0% | -4.4% | 0.43% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 14 | 35.7% | -20.2% | -26.7% | 0.45% | Broad support |
| 0.25-0.40 | 63 | 49.2% | -1.6% | -11.5% | 0.08% | Healthy support |
| 0.40-0.60 | 63 | 41.3% | -17.7% | -0.4% | 0.01% | Concentrated |
| 0.60-0.80 | 32 | 53.1% | -2.3% | -6.5% | -0.23% | Very concentrated |
| 0.80-1.00 | 11 | 54.5% | 0.9% | -13.1% | -2.18% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 28 | 35.7% | -32.3% | -28.0% | -0.23% | 4.0 |
| Broad battle | 112 | 46.4% | -5.8% | -3.6% | -0.07% | 3.9 |
| One-wallet nuke | 19 | 57.9% | 4.8% | 14.5% | -1.24% | 3.4 |
| Thin support | 75 | 50.7% | -5.0% | -3.7% | -0.34% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=191)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 31 | 32.3% | -39.2% | -44.4% | 0.19% | 3.9 | 100.0% |
| CLEAR_MOVE | 58 | 56.9% | 3.2% | 10.1% | -0.37% | 4.0 | 100.0% |
| NEAR_START | 93 | 46.2% | -3.4% | -8.9% | -0.08% | 3.6 | 100.0% |

**All Time** (n=753)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 34 | 32.4% | -38.8% | -45.7% | 0.36% | 4.0 | 91.2% |
| CLEAR_MOVE | 84 | 56.0% | 2.3% | 7.0% | -0.38% | 3.9 | 100.0% |
| NEAR_START | 109 | 46.8% | -4.7% | -9.5% | -0.02% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 9 / 33.3% / -48.7% | 23 / 60.9% / 8.5% | 22 / 50.0% / 5.7% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 19 / 31.6% / -34.4% | 22 / 50.0% / -8.7% | 34 / 58.8% / 25.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 36 / 33.3% / -33.8% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 188 | 46.8% | -8.4% | -8.1% | 3.8 | -0.11% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 238 | 47.9% | -7.8% | -7.1% | 3.8 | -0.11% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 331 | 100% |
| LOCKED (direct) | 65 | 19.6% |
| Promoted (SHADOW→LOCKED) | 132 | 39.9% |
| Rejected (stayed SHADOW) | 102 | 30.8% |
| Superseded (side flipped) | 27 | 8.2% |
| Muted | 158 | 47.7% |
| Cancelled | 15 | 4.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=191)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -18.17u | -7.2% | — |
| Flat 1.0u | -14.77u | -7.7% | -3.40u |
| Lock units only | -11.69u | — | -6.48u |
| Units change only on star change | -10.35u | — | -7.82u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 51 | 2.35 | -6.7% | -2.5% | +0.46u | Neutral |
| 4.5 | 9 | 2.06 | 23.7% | 13.0% | +0.27u | Neutral |
| 4 | 27 | 1.23 | 0.5% | -8.1% | -2.81u | Sizing hurts |
| 3.5 | 49 | 0.71 | -1.8% | -0.5% | +0.69u | Sizing helps |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 30 | 0.73 | -23.0% | -36.3% | -1.02u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=753)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -63.05u | -5.6% | — |
| Flat 1.0u | -44.28u | -5.9% | -18.77u |
| Lock units only | -45.81u | — | -17.24u |
| Units change only on star change | -54.39u | — | -8.66u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 64 | 2.41 | -7.2% | -5.0% | -3.13u | Sizing hurts |
| 4.5 | 43 | 2.49 | -4.8% | -11.0% | -9.75u | Sizing hurts |
| 4 | 142 | 1.95 | -2.5% | -4.2% | -8.05u | Sizing hurts |
| 3.5 | 167 | 1.45 | -0.2% | 2.3% | +6.00u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 137 | 0.73 | -5.6% | -5.9% | +1.69u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 191 | 52.6% | 47.1% | -5.5% | -7.7% | -0.10% | Below market |
| 4.5-5★ | 60 | 52.6% | 51.7% | -1.0% | -2.2% | -0.06% | Neutral |
| 3.5-4★ | 76 | 51.5% | 48.7% | -2.8% | -1.0% | -0.07% | Below market |
| 2.5-3★ | 53 | 54.2% | 41.5% | -12.7% | -20.2% | -0.19% | Below market |
| CLEAR_MOVE only | 58 | 54.0% | 56.9% | +2.9% | 3.2% | -0.37% | Beating market |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=45)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.268 | 62.688 | 0.43 |  |
| Rank_norm | 64.958 | 64.792 | 0.01 |  |
| PnL_norm | 57.397 | 57.210 | 0.01 |  |
| WalletBase | 58.701 | 61.233 | 0.31 |  |
| SizeRatio | 1.593 | 1.389 | 0.14 |  |
| ConvictionMult | 0.971 | 0.971 | 0.00 |  |
| WalletCountFor | 3.432 | 3.178 | 0.14 |  |
| TopShare | 0.472 | 0.530 | 0.30 |  |
| ForSide | 198.326 | 190.236 | 0.07 |  |
| AgainstSide | 66.132 | 70.056 | 0.05 |  |
| NetEdge | 1.421 | 1.307 | 0.13 |  |
| WalletPlayScore | 2.133 | 1.662 | 0.23 |  |

### V8 Era (n=183)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.268 | 58.268 | 0.00 |  |
| Rank_norm | 64.958 | 64.958 | 0.00 |  |
| PnL_norm | 57.397 | 57.397 | 0.00 |  |
| WalletBase | 58.701 | 58.701 | 0.00 |  |
| SizeRatio | 1.593 | 1.593 | 0.00 |  |
| ConvictionMult | 0.971 | 0.971 | 0.00 |  |
| WalletCountFor | 3.432 | 3.432 | 0.00 |  |
| TopShare | 0.472 | 0.472 | 0.00 |  |
| ForSide | 198.326 | 198.326 | 0.00 |  |
| AgainstSide | 66.132 | 66.132 | 0.00 |  |
| NetEdge | 1.421 | 1.421 | 0.00 |  |
| WalletPlayScore | 2.133 | 2.133 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=191)

- **Sizing issue**: Model P/L (-18.17u) trails flat (-14.77u) by 3.40u
- **Gate issue**: NO_MOVE ROI (-13.8%) significantly trails CLEAR_MOVE (3.2%)

### 7-Day (n=45)

- **Sizing issue**: Model P/L (-6.54u) trails flat (-5.39u) by 1.15u
- **Odds issue**: Avg CLV -0.76% — consistently getting bad closing lines

### All Time (n=753)

- **Sizing issue**: Model P/L (-63.05u) trails flat (-44.28u) by 18.77u
- **Environment issue**: 69.9% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 191 |
| V8 flat ROI | -7.7% |
| V8 model ROI | -7.2% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | -2.2% |
| 2.5-3★ ROI | -20.2% |
| CLEAR_MOVE ROI | 3.2% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 9.9% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.05% | 4.5★: -0.68% | 4★: 0.15% | 3.5★: -0.20% | 3★: -0.02% | 2.5★: -0.28% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=191)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 138 | 72.3% | 45.7% | -8.8% | -11.0% | 0.02% |
| MUTED | 45 | 23.6% | 48.9% | -7.4% | 8.1% | -0.43% |
| CANCELLED | 8 | 4.2% | 62.5% | 8.4% | -7.4% | -0.17% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| v73_hc_rescue | 13 | 38.5% |
| wps_flipped_diag | 12 | 33.3% |
| winners_faded | 11 | 63.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| opp_side_stronger_diag | 6 | 33.3% |
| winners_killed | 6 | 66.7% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |

### 7-Day (n=45)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 35 | 77.8% | 45.7% | -10.7% | -11.4% | -0.59% |
| MUTED | 9 | 20.0% | 44.4% | -7.3% | 48.2% | -0.68% |
| CANCELLED | 1 | 2.2% | 0.0% | -100.0% | -100.0% | -7.24% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 13 | 38.5% |
| wps_flipped_diag | 4 | 25.0% |
| opp_side_stronger_diag | 4 | 25.0% |
| winners_below_floor | 3 | 33.3% |
| winners_faded | 3 | 66.7% |
| quality_below_floor | 2 | 50.0% |
| winners_killed | 1 | 0.0% |
| sum_below_floor | 1 | 0.0% |

### All Time (n=753)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 698 | 92.7% | 51.9% | -6.3% | -6.5% | -0.33% |
| MUTED | 45 | 6.0% | 48.9% | -7.4% | 8.1% | -0.43% |
| CANCELLED | 10 | 1.3% | 70.0% | 32.9% | 10.4% | -1.54% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| v73_hc_rescue | 13 | 38.5% |
| wps_flipped_diag | 12 | 33.3% |
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
