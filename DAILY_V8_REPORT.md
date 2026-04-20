# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-20 ET
**Completed Picks**: 582 | **V8 Era Picks**: 20 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (75.0%) beats 5★ (66.7%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 31 | 45.2% | -3.85u | -12.4% | -1.00u | -2.2% | 0.23% | -0.48% |  |
| 7-Day | 120 | 46.7% | -14.79u | -12.3% | -12.91u | -7.3% | 0.05% | -0.59% |  |
| 14-Day | 321 | 49.8% | -31.04u | -9.7% | -51.29u | -11.2% | -0.27% | -0.11% |  |
| 30-Day | 582 | 53.6% | -28.04u | -4.8% | -38.73u | -4.3% | -0.43% | 0.00% |  |
| V8 Era | 20 | 55.0% | 1.47u | 7.4% | 6.15u | 23.2% | 0.39% | -0.65% | Strong |
| All Time | 582 | 53.6% | -28.04u | -4.8% | -38.73u | -4.3% | -0.43% | 0.00% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=20)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 3 | 60.5% | 60.5% | 66.7% | +6.1% | 8.0% | 10.7% | 2.33 | 0.98% | Strong |
| 4.5 | 4 | 49.3% | 49.3% | 75.0% | +25.7% | 81.5% | 65.8% | 2.00 | -1.60% | Strong |
| 4 | 1 | 51.5% | 51.5% | 100.0% | +48.5% | 94.3% | 91.0% | 2.00 | 1.40% | Strong |
| 3.5 | 4 | 46.4% | 46.4% | 50.0% | +3.6% | -0.2% | 17.3% | 0.94 | 1.13% | Fair |
| 3 | 4 | 62.7% | 62.7% | 50.0% | -12.7% | -25.3% | -26.5% | 0.81 | -0.02% | Failing |
| 2.5 | 4 | 51.2% | 51.2% | 25.0% | -26.2% | -48.8% | -58.8% | 0.63 | 1.69% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 66.7% | 75.0% | -8.3% | INVERTED |
| 4.5★ vs 4★ | 75.0% | 100.0% | -25.0% | INVERTED |
| 4★ vs 3.5★ | 100.0% | 50.0% | +50.0% | Correct |
| 3.5★ vs 3★ | 50.0% | 50.0% | 0.0% | Flat |
| 3★ vs 2.5★ | 50.0% | 25.0% | +25.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.714 |
| Spearman: Stars vs Flat ROI | 0.771 |
| Spearman: Stars vs CLV | -0.486 |
| Brier Score | 0.2361 |
| Monotonicity Score | 0.00 |

### All Time (n=582)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 16 | 59.0% | 59.0% | 56.3% | -2.7% | -5.6% | -9.6% | 2.59 | 0.90% | Weak |
| 4.5 | 38 | 56.8% | 56.8% | 52.6% | -4.2% | -2.5% | -9.3% | 2.55 | 1.19% | Fair |
| 4 | 116 | 55.9% | 55.9% | 54.3% | -1.6% | -2.4% | -2.9% | 2.12 | -0.72% | Fair |
| 3.5 | 122 | 56.4% | 56.4% | 59.0% | +2.6% | 0.4% | 3.1% | 1.73 | -0.32% | Fair |
| 3 | 164 | 55.3% | 55.3% | 48.8% | -6.6% | -13.3% | -11.1% | 1.20 | -0.61% | Weak |
| 2.5 | 111 | 54.3% | 54.3% | 54.1% | -0.3% | -2.4% | 0.6% | 0.73 | -0.74% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 56.3% | 52.6% | +3.7% | Correct |
| 4.5★ vs 4★ | 52.6% | 54.3% | -1.7% | Flat |
| 4★ vs 3.5★ | 54.3% | 59.0% | -4.7% | INVERTED |
| 3.5★ vs 3★ | 59.0% | 48.8% | +10.2% | Correct |
| 3★ vs 2.5★ | 48.8% | 54.1% | -5.3% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.314 |
| Spearman: Stars vs Flat ROI | -0.314 |
| Spearman: Stars vs CLV | 0.771 |
| Brier Score | 0.2278 |
| Monotonicity Score | 0.20 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.571 | 0.532 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.071 | 0.004 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.446 | 0.282 | Keep |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.582 | 0.514 | Keep |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.321 | 0.211 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.318 | 0.261 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.621 | 0.543 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.404 | 0.446 | Keep |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.182 | -0.036 | Tune |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.136 | 0.361 | Keep |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.039 | 0.196 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | -0.275 | -0.421 | Keep |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | -0.271 | -0.354 | Keep |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | 0.182 | 0.364 | Keep |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (43.23–43.60) | 2 | 0.0% | -100.0% | -100.0% | 1.68% |  |
| p20-40 (43.78–46.02) | 3 | 0.0% | -100.0% | -100.0% | 0.35% |  |
| p40-60 (49.15–51.57) | 2 | 100.0% | 187.5% | 197.5% | 0.25% |  |
| p60-80 (51.90–53.90) | 3 | 66.7% | 29.6% | 51.4% | 0.01% |  |
| p80-95 (54.86–54.87) | 2 | 50.0% | -16.7% | 0.0% | 0.09% |  |
| p95+ (58.15–64.77) | 3 | 100.0% | 76.2% | 76.7% | 1.40% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 1 | 0.0% | -100.0% | -100.0% | -2.78% |  |
| 0.90-1.05 | 7 | 57.1% | 6.6% | 35.8% | 1.12% |  |
| 1.05-1.20 | 6 | 50.0% | 18.0% | 18.1% | 0.56% |  |
| 1.20-1.35 | 1 | 100.0% | 105.0% | 106.0% | 1.71% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (0.26–0.54) | 2 | 0.0% | -100.0% | -100.0% | 1.68% |  |
| 20-40% (0.67–1.24) | 3 | 66.7% | 7.9% | -19.0% | 0.10% |  |
| 40-60% (1.28–1.38) | 2 | 50.0% | -10.0% | 20.0% | 2.31% |  |
| 60-80% (1.52–2.03) | 3 | 66.7% | 20.3% | 52.2% | -0.35% |  |
| 80-95% (2.04–2.13) | 2 | 50.0% | 2.5% | -31.3% | 1.39% |  |
| 95%+ (3.02–4.76) | 3 | 66.7% | 96.4% | 59.4% | 0.43% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 2 | 50.0% | 97.5% | 38.3% | -0.06% | Broad support |
| 0.25-0.40 | 5 | 100.0% | 75.8% | 78.2% | 0.76% | Healthy support |
| 0.40-0.60 | 6 | 16.7% | -70.0% | -65.7% | 0.60% | Concentrated |
| 0.60-0.80 | 2 | 50.0% | 2.5% | 3.0% | 1.71% | Very concentrated |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 7 | 57.1% | 6.6% | 12.0% | 0.19% | 3.6 |
| Broad battle | 7 | 57.1% | 30.4% | 47.5% | 1.10% | 3.2 |
| One-wallet nuke | 5 | 60.0% | -2.3% | 24.8% | -0.30% | 4.5 |
| Thin support | 7 | 57.1% | -0.9% | 17.2% | 0.20% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=20)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 1 | 0.0% | -100.0% | -100.0% | -1.71% | 4.5 | 100.0% |
| SMALL_MOVE | 2 | 50.0% | 2.5% | -58.8% | 1.41% | 4.3 | 100.0% |
| CLEAR_MOVE | 7 | 71.4% | 18.0% | 46.9% | -0.01% | 3.8 | 100.0% |
| NEAR_START | 10 | 50.0% | 11.6% | 35.0% | 0.71% | 3.4 | 100.0% |

**All Time** (n=582)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 518 | 53.7% | -5.3% | -5.0% | -0.52% | 3.2 | 1.7% |
| SMALL_MOVE | 5 | 40.0% | -20.0% | -52.9% | 1.86% | 4.4 | 40.0% |
| CLEAR_MOVE | 33 | 57.6% | 4.2% | 9.7% | -0.32% | 3.8 | 100.0% |
| NEAR_START | 26 | 50.0% | -2.9% | 2.5% | 0.57% | 3.5 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 1 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | 3 / 100.0% / 75.8% | 2 / 100.0% / 161.4% |
| 3.5-4★ | — | 1 / 100.0% / 105.0% | 1 / 0.0% / -100.0% | 3 / 66.7% / 29.6% |
| 2.5-3★ | — | — | 3 / 66.7% / -0.4% | 5 / 20.0% / -59.0% |
| 1.0-2★ | — | — | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 20 | 55.0% | 7.4% | 23.2% | 3.6 | 0.39% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 70 | 52.9% | -1.9% | 1.7% | 3.8 | 0.05% |
| SHADOW | 512 | 53.7% | -5.2% | -5.2% | 3.2 | -0.51% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 26 | 100% |
| LOCKED (direct) | 20 | 76.9% |
| Promoted (SHADOW→LOCKED) | 0 | 0.0% |
| Rejected (stayed SHADOW) | 6 | 23.1% |
| Superseded (side flipped) | 0 | 0.0% |
| Muted | 3 | 11.5% |
| Cancelled | 0 | 0.0% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=20)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 6.15u | 23.2% | — |
| Flat 1.0u | 1.47u | 7.4% | +4.68u |
| Lock units only | 4.34u | — | +1.81u |
| Units change only on star change | 6.05u | — | +0.10u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 3 | 2.33 | 8.0% | 10.7% | +0.51u | Sizing helps |
| 4.5 | 4 | 2.00 | 81.5% | 65.8% | +2.00u | Sizing helps |
| 4 | 1 | 2.00 | 94.3% | 91.0% | +0.88u | Sizing helps |
| 3.5 | 4 | 0.94 | -0.2% | 17.3% | +0.66u | Sizing helps |
| 3 | 4 | 0.81 | -25.3% | -26.5% | +0.15u | Neutral |
| 2.5 | 4 | 0.63 | -48.8% | -58.8% | +0.48u | Neutral |

### All Time (n=582)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -38.73u | -4.3% | — |
| Flat 1.0u | -28.04u | -4.8% | -10.69u |
| Lock units only | -29.78u | — | -8.95u |
| Units change only on star change | -37.99u | — | -0.74u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 16 | 2.59 | -5.6% | -9.6% | -3.08u | Sizing hurts |
| 4.5 | 38 | 2.55 | -2.5% | -9.3% | -8.02u | Sizing hurts |
| 4 | 116 | 2.12 | -2.4% | -2.9% | -4.36u | Sizing hurts |
| 3.5 | 122 | 1.73 | 0.4% | 3.1% | +5.96u | Sizing helps |
| 3 | 164 | 1.20 | -13.3% | -11.1% | +0.01u | Neutral |
| 2.5 | 111 | 0.73 | -2.4% | 0.6% | +3.19u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 20 | 53.6% | 55.0% | +1.4% | 7.4% | 0.39% | Neutral |
| 4.5-5★ | 7 | 54.1% | 71.4% | +17.3% | 50.0% | -0.50% | Beating market |
| 3.5-4★ | 5 | 47.4% | 60.0% | +12.6% | 18.7% | 1.19% | Beating market |
| 2.5-3★ | 8 | 56.9% | 37.5% | -19.4% | -37.0% | 0.72% | Below market |
| CLEAR_MOVE only | 7 | 57.7% | 71.4% | +13.7% | 18.0% | -0.01% | Beating market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=15)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 52.862 | 52.862 | 0.00 |  |
| Rank_norm | 52.962 | 52.962 | 0.00 |  |
| PnL_norm | 49.423 | 49.423 | 0.00 |  |
| WalletBase | 51.798 | 51.798 | 0.00 |  |
| SizeRatio | 2.117 | 2.117 | 0.00 |  |
| ConvictionMult | 1.043 | 1.043 | 0.00 |  |
| WalletCountFor | 3.933 | 3.933 | 0.00 |  |
| TopShare | 0.414 | 0.414 | 0.00 |  |
| ForSide | 215.820 | 215.820 | 0.00 |  |
| AgainstSide | 44.573 | 44.573 | 0.00 |  |
| NetEdge | 1.779 | 1.779 | 0.00 |  |
| WalletPlayScore | 2.797 | 2.797 | 0.00 |  |

### V8 Era (n=15)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 52.862 | 52.862 | 0.00 |  |
| Rank_norm | 52.962 | 52.962 | 0.00 |  |
| PnL_norm | 49.423 | 49.423 | 0.00 |  |
| WalletBase | 51.798 | 51.798 | 0.00 |  |
| SizeRatio | 2.117 | 2.117 | 0.00 |  |
| ConvictionMult | 1.043 | 1.043 | 0.00 |  |
| WalletCountFor | 3.933 | 3.933 | 0.00 |  |
| TopShare | 0.414 | 0.414 | 0.00 |  |
| ForSide | 215.820 | 215.820 | 0.00 |  |
| AgainstSide | 44.573 | 44.573 | 0.00 |  |
| NetEdge | 1.779 | 1.779 | 0.00 |  |
| WalletPlayScore | 2.797 | 2.797 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=20)

No major failure modes detected.

### 7-Day (n=120)

- **Environment issue**: 55.0% NO_MOVE (WR: 42.4%, ROI: -22.2%)
- **Gate issue**: NO_MOVE ROI (-22.2%) significantly trails CLEAR_MOVE (5.3%)

### All Time (n=582)

- **Sizing issue**: Model P/L (-38.73u) trails flat (-28.04u) by 10.69u
- **Environment issue**: 89.0% NO_MOVE (WR: 53.7%, ROI: -5.3%)


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
| V8 era picks | 20 |
| V8 flat ROI | 7.4% |
| V8 model ROI | 23.2% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 50.0% |
| 2.5-3★ ROI | -37.0% |
| CLEAR_MOVE ROI | 18.0% |
| NO_MOVE ROI | -100.0% |
| Single-wallet play rate | 25.0% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.98% | 4.5★: -1.60% | 4★: 1.40% | 3.5★: 1.13% | 3★: -0.02% | 2.5★: 1.69% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=20)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 18 | 90.0% | 55.6% | 12.7% | 28.2% | 0.52% |
| MUTED | 2 | 10.0% | 50.0% | -40.7% | -60.7% | -0.71% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| below_lock_range | 2 | 50.0% |

### 7-Day (n=120)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 116 | 96.7% | 45.7% | -14.3% | -8.4% | 0.20% |
| MUTED | 2 | 1.7% | 50.0% | -40.7% | -60.7% | -0.71% |
| CANCELLED | 2 | 1.7% | 100.0% | 131.0% | 131.0% | -7.02% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| below_lock_range | 2 | 50.0% |

### All Time (n=582)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 578 | 99.3% | 53.5% | -5.2% | -4.5% | -0.40% |
| MUTED | 2 | 0.3% | 50.0% | -40.7% | -60.7% | -0.71% |
| CANCELLED | 2 | 0.3% | 100.0% | 131.0% | 131.0% | -7.02% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| below_lock_range | 2 | 50.0% |
