# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-21 ET
**Completed Picks**: 598 | **V8 Era Picks**: 36 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 2.5★ WR (61.5%) beats 3★ (37.5%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 36 | 52.8% | 1.09u | 3.0% | 2.94u | 7.4% | -0.04% | -0.49% |  |
| 7-Day | 107 | 45.8% | -13.33u | -12.5% | -17.06u | -11.1% | 0.24% | -0.52% |  |
| 14-Day | 321 | 50.2% | -28.45u | -8.9% | -48.56u | -10.8% | -0.28% | -0.12% |  |
| 30-Day | 598 | 53.5% | -28.42u | -4.8% | -41.94u | -4.6% | -0.43% | -0.00% |  |
| V8 Era | 36 | 52.8% | 1.09u | 3.0% | 2.94u | 7.4% | -0.04% | -0.49% |  |
| All Time | 598 | 53.5% | -28.42u | -4.8% | -41.94u | -4.6% | -0.43% | -0.00% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=36)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 3 | 60.5% | 60.5% | 66.7% | +6.1% | 8.0% | 10.7% | 2.33 | 0.98% | Strong |
| 4.5 | 5 | 49.6% | 49.6% | 60.0% | +10.4% | 45.2% | 32.6% | 2.00 | -1.14% | Strong |
| 4 | 2 | 46.1% | 46.1% | 50.0% | +3.9% | -2.8% | 9.1% | 1.75 | -1.09% | Fair |
| 3.5 | 5 | 41.4% | 41.4% | 40.0% | -1.4% | -20.1% | 3.5% | 0.85 | 1.13% | Failing |
| 3 | 8 | 62.3% | 62.3% | 37.5% | -24.8% | -38.8% | -43.4% | 0.84 | 0.08% | Failing |
| 2.5 | 13 | 51.8% | 51.8% | 61.5% | +9.8% | 21.2% | 16.4% | 0.65 | -0.13% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 66.7% | 60.0% | +6.7% | Correct |
| 4.5★ vs 4★ | 60.0% | 50.0% | +10.0% | Correct |
| 4★ vs 3.5★ | 50.0% | 40.0% | +10.0% | Correct |
| 3.5★ vs 3★ | 40.0% | 37.5% | +2.5% | Correct |
| 3★ vs 2.5★ | 37.5% | 61.5% | -24.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.429 |
| Spearman: Stars vs Flat ROI | 0.314 |
| Spearman: Stars vs CLV | -0.086 |
| Brier Score | 0.2492 |
| Monotonicity Score | -0.60 |

### All Time (n=598)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 16 | 59.0% | 59.0% | 56.3% | -2.7% | -5.6% | -9.6% | 2.59 | 0.90% | Weak |
| 4.5 | 39 | 56.6% | 56.6% | 51.3% | -5.4% | -5.0% | -11.1% | 2.53 | 1.17% | Weak |
| 4 | 117 | 55.8% | 55.8% | 53.8% | -2.0% | -3.2% | -3.5% | 2.12 | -0.75% | Fair |
| 3.5 | 123 | 56.2% | 56.2% | 58.5% | +2.4% | -0.4% | 2.8% | 1.72 | -0.32% | Fair |
| 3 | 168 | 55.5% | 55.5% | 48.2% | -7.3% | -14.2% | -11.9% | 1.19 | -0.59% | Weak |
| 2.5 | 120 | 54.2% | 54.2% | 55.8% | +1.7% | 1.7% | 3.9% | 0.72 | -0.74% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 56.3% | 51.3% | +5.0% | Correct |
| 4.5★ vs 4★ | 51.3% | 53.8% | -2.5% | Flat |
| 4★ vs 3.5★ | 53.8% | 58.5% | -4.7% | INVERTED |
| 3.5★ vs 3★ | 58.5% | 48.2% | +10.3% | Correct |
| 3★ vs 2.5★ | 48.2% | 55.8% | -7.6% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.143 |
| Spearman: Stars vs Flat ROI | -0.429 |
| Spearman: Stars vs CLV | 0.600 |
| Brier Score | 0.2288 |
| Monotonicity Score | 0.20 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.304 | 0.342 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | 0.257 | 0.141 | Keep |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.115 | 0.091 | Keep |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.329 | 0.297 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.004 | 0.088 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.009 | 0.116 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.208 | 0.319 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.272 | -0.094 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.032 | -0.063 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.152 | 0.044 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.290 | -0.186 | Tune |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.329 | 0.143 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.265 | 0.081 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.323 | -0.130 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (43.23–44.63) | 5 | 0.0% | -100.0% | -100.0% | 0.70% |  |
| p20-40 (46.02–49.15) | 5 | 60.0% | 58.0% | 38.9% | -0.94% |  |
| p40-60 (49.25–53.07) | 5 | 60.0% | 14.5% | 29.7% | 0.87% |  |
| p60-80 (53.23–54.86) | 5 | 40.0% | -23.7% | -20.8% | 0.12% |  |
| p80-95 (54.87–63.03) | 5 | 60.0% | 15.5% | 4.6% | 0.17% |  |
| p95+ (63.49–74.70) | 6 | 83.3% | 49.9% | 44.7% | -0.64% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 8 | 50.0% | -1.0% | -15.2% | -1.90% |  |
| 0.90-1.05 | 12 | 50.0% | -4.8% | -0.7% | 0.43% |  |
| 1.05-1.20 | 8 | 50.0% | 13.3% | 9.1% | 0.74% |  |
| 1.20-1.35 | 1 | 100.0% | 105.0% | 106.0% | 1.71% |  |
| 1.35-1.50 | 1 | 0.0% | -100.0% | -100.0% | 0.00% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.67) | 5 | 20.0% | -59.0% | -72.5% | 1.06% |  |
| 20-40% (0.68–0.85) | 5 | 80.0% | 37.3% | 43.3% | 0.11% |  |
| 40-60% (0.89–1.12) | 5 | 80.0% | 60.6% | 47.1% | -1.17% |  |
| 60-80% (1.22–1.45) | 5 | 40.0% | -25.8% | -13.9% | -0.24% |  |
| 80-95% (1.52–2.04) | 5 | 60.0% | 13.2% | 34.3% | 0.09% |  |
| 95%+ (2.11–4.76) | 6 | 33.3% | -1.8% | -16.1% | 0.01% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 4 | 25.0% | -1.2% | -36.2% | -0.74% | Broad support |
| 0.25-0.40 | 8 | 75.0% | 33.7% | 52.4% | 0.63% | Healthy support |
| 0.40-0.60 | 13 | 30.8% | -41.0% | -38.7% | 0.38% | Concentrated |
| 0.60-0.80 | 6 | 83.3% | 64.7% | 65.0% | -1.13% | Very concentrated |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 8 | 50.0% | -6.7% | -6.7% | 0.26% | 3.8 |
| Broad battle | 16 | 50.0% | 4.5% | 9.1% | 0.25% | 3.1 |
| One-wallet nuke | 5 | 60.0% | -2.3% | 24.8% | -0.30% | 4.5 |
| Thin support | 15 | 66.7% | 25.2% | 26.2% | -0.18% | 3.2 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=36)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 1 | 0.0% | -100.0% | -100.0% | -1.71% | 4.5 | 100.0% |
| SMALL_MOVE | 2 | 50.0% | 2.5% | -58.8% | 1.41% | 4.3 | 100.0% |
| CLEAR_MOVE | 11 | 72.7% | 29.5% | 51.3% | 0.43% | 3.3 | 100.0% |
| NEAR_START | 22 | 45.5% | -5.5% | -4.5% | -0.38% | 3.2 | 100.0% |

**All Time** (n=598)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 518 | 53.7% | -5.3% | -5.0% | -0.52% | 3.2 | 1.7% |
| SMALL_MOVE | 5 | 40.0% | -20.0% | -52.9% | 1.86% | 4.4 | 40.0% |
| CLEAR_MOVE | 37 | 59.5% | 9.1% | 12.4% | -0.15% | 3.7 | 100.0% |
| NEAR_START | 38 | 47.4% | -8.2% | -8.6% | -0.08% | 3.4 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 1 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | 3 / 100.0% / 75.8% | 3 / 66.7% / 74.3% |
| 3.5-4★ | — | 1 / 100.0% / 105.0% | 1 / 0.0% / -100.0% | 5 / 40.0% / -22.3% |
| 2.5-3★ | — | — | 7 / 71.4% / 28.2% | 14 / 42.9% / -16.6% |
| 1.0-2★ | — | — | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 36 | 52.8% | 3.0% | 7.4% | 3.3 | -0.04% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 86 | 52.3% | -2.0% | -0.9% | 3.7 | -0.07% |
| SHADOW | 512 | 53.7% | -5.2% | -5.2% | 3.2 | -0.51% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 44 | 100% |
| LOCKED (direct) | 36 | 81.8% |
| Promoted (SHADOW→LOCKED) | 2 | 4.5% |
| Rejected (stayed SHADOW) | 6 | 13.6% |
| Superseded (side flipped) | 0 | 0.0% |
| Muted | 4 | 9.1% |
| Cancelled | 0 | 0.0% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=36)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 2.94u | 7.4% | — |
| Flat 1.0u | 1.09u | 3.0% | +1.85u |
| Lock units only | 2.88u | — | +0.06u |
| Units change only on star change | 2.84u | — | +0.10u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 3 | 2.33 | 8.0% | 10.7% | +0.51u | Sizing helps |
| 4.5 | 5 | 2.00 | 45.2% | 32.6% | +1.00u | Sizing helps |
| 4 | 2 | 1.75 | -2.8% | 9.1% | +0.38u | Neutral |
| 3.5 | 5 | 0.85 | -20.1% | 3.5% | +1.16u | Sizing helps |
| 3 | 8 | 0.84 | -38.8% | -43.4% | +0.17u | Neutral |
| 2.5 | 13 | 0.65 | 21.2% | 16.4% | -1.37u | Sizing hurts |

### All Time (n=598)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -41.94u | -4.6% | — |
| Flat 1.0u | -28.42u | -4.8% | -13.52u |
| Lock units only | -31.24u | — | -10.70u |
| Units change only on star change | -41.20u | — | -0.74u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 16 | 2.59 | -5.6% | -9.6% | -3.08u | Sizing hurts |
| 4.5 | 39 | 2.53 | -5.0% | -11.1% | -9.02u | Sizing hurts |
| 4 | 117 | 2.12 | -3.2% | -3.5% | -4.86u | Sizing hurts |
| 3.5 | 123 | 1.72 | -0.4% | 2.8% | +6.46u | Sizing helps |
| 3 | 168 | 1.19 | -14.2% | -11.9% | +0.03u | Neutral |
| 2.5 | 120 | 0.72 | 1.7% | 3.9% | +1.34u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 36 | 52.8% | 52.8% | -0.0% | 3.0% | -0.04% | Neutral |
| 4.5-5★ | 8 | 53.7% | 62.5% | +8.8% | 31.3% | -0.34% | Beating market |
| 3.5-4★ | 7 | 42.8% | 42.9% | +0.1% | -15.2% | 0.39% | Neutral |
| 2.5-3★ | 21 | 55.8% | 52.4% | -3.4% | -1.6% | -0.05% | Below market |
| CLEAR_MOVE only | 11 | 55.3% | 72.7% | +17.5% | 29.5% | 0.43% | Beating market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=31)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 53.387 | 53.387 | 0.00 |  |
| Rank_norm | 60.605 | 60.605 | 0.00 |  |
| PnL_norm | 54.664 | 54.664 | 0.00 |  |
| WalletBase | 54.228 | 54.228 | 0.00 |  |
| SizeRatio | 1.858 | 1.858 | 0.00 |  |
| ConvictionMult | 0.976 | 0.976 | 0.00 |  |
| WalletCountFor | 3.710 | 3.710 | 0.00 |  |
| TopShare | 0.434 | 0.434 | 0.00 |  |
| ForSide | 195.535 | 195.535 | 0.00 |  |
| AgainstSide | 62.339 | 62.339 | 0.00 |  |
| NetEdge | 1.426 | 1.426 | 0.00 |  |
| WalletPlayScore | 2.377 | 2.377 | 0.00 |  |

### V8 Era (n=31)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 53.387 | 53.387 | 0.00 |  |
| Rank_norm | 60.605 | 60.605 | 0.00 |  |
| PnL_norm | 54.664 | 54.664 | 0.00 |  |
| WalletBase | 54.228 | 54.228 | 0.00 |  |
| SizeRatio | 1.858 | 1.858 | 0.00 |  |
| ConvictionMult | 0.976 | 0.976 | 0.00 |  |
| WalletCountFor | 3.710 | 3.710 | 0.00 |  |
| TopShare | 0.434 | 0.434 | 0.00 |  |
| ForSide | 195.535 | 195.535 | 0.00 |  |
| AgainstSide | 62.339 | 62.339 | 0.00 |  |
| NetEdge | 1.426 | 1.426 | 0.00 |  |
| WalletPlayScore | 2.377 | 2.377 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=36)

No major failure modes detected.

### 7-Day (n=107)

- **Sizing issue**: Model P/L (-17.06u) trails flat (-13.33u) by 3.73u
- **Gate issue**: NO_MOVE ROI (-29.6%) significantly trails CLEAR_MOVE (11.4%)

### All Time (n=598)

- **Sizing issue**: Model P/L (-41.94u) trails flat (-28.42u) by 13.52u
- **Environment issue**: 86.6% NO_MOVE (WR: 53.7%, ROI: -5.3%)


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
| V8 era picks | 36 |
| V8 flat ROI | 3.0% |
| V8 model ROI | 7.4% |
| V8 star monotonicity score | -0.60 |
| 4.5-5★ ROI | 31.3% |
| 2.5-3★ ROI | -1.6% |
| CLEAR_MOVE ROI | 29.5% |
| NO_MOVE ROI | -100.0% |
| Single-wallet play rate | 13.9% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.98% | 4.5★: -1.14% | 4★: -1.09% | 3.5★: 1.13% | 3★: 0.08% | 2.5★: -0.13% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=36)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 34 | 94.4% | 52.9% | 5.6% | 10.0% | 0.00% |
| MUTED | 2 | 5.6% | 50.0% | -40.7% | -60.7% | -0.71% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 2 | 50.0% |

### 7-Day (n=107)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 103 | 96.3% | 44.7% | -14.7% | -12.5% | 0.41% |
| MUTED | 2 | 1.9% | 50.0% | -40.7% | -60.7% | -0.71% |
| CANCELLED | 2 | 1.9% | 100.0% | 131.0% | 131.0% | -7.02% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| below_lock_range | 2 | 50.0% |

### All Time (n=598)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 594 | 99.3% | 53.4% | -5.1% | -4.8% | -0.41% |
| MUTED | 2 | 0.3% | 50.0% | -40.7% | -60.7% | -0.71% |
| CANCELLED | 2 | 0.3% | 100.0% | 131.0% | 131.0% | -7.02% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| below_lock_range | 2 | 50.0% |
