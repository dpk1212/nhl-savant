# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-04-19 ET
**Completed Picks**: 574 | **V8 Era Picks**: 12 | **V8 Since**: 2026-04-18
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
| Single-wallet dependency | ⚠️ | 42% of picks are single-wallet (WR: 60.0%, ROI: -2.3%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 33 | 45.5% | -5.27u | -16.0% | -4.21u | -7.6% | 0.35% | -0.63% |  |
| 7-Day | 163 | 47.9% | -20.48u | -12.6% | -26.84u | -11.2% | -0.14% | -0.28% |  |
| 14-Day | 340 | 49.7% | -36.76u | -10.8% | -59.00u | -12.1% | -0.38% | 0.08% |  |
| 30-Day | 574 | 53.5% | -30.86u | -5.4% | -42.21u | -4.8% | -0.45% | 0.01% |  |
| V8 Era | 12 | 50.0% | -1.35u | -11.2% | 2.67u | 16.4% | 0.25% | -1.09% |  |
| All Time | 574 | 53.5% | -30.86u | -5.4% | -42.21u | -4.8% | -0.45% | 0.01% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=12)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 2 | 64.6% | 64.6% | 100.0% | +35.4% | 62.0% | 55.0% | 2.50 | 0.62% | Strong |
| 4.5 | 3 | 57.3% | 57.3% | 66.7% | +9.3% | 10.4% | 30.1% | 2.33 | -1.53% | Strong |
| 3.5 | 3 | 44.7% | 44.7% | 33.3% | -11.3% | -31.7% | -48.5% | 0.67 | 1.04% | Failing |
| 3 | 1 | 51.7% | 51.7% | 0.0% | -51.7% | -100.0% | -100.0% | 0.75 | -0.95% | Failing |
| 2.5 | 3 | 51.5% | 51.5% | 33.3% | -18.2% | -31.7% | -31.3% | 0.50 | 1.95% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 100.0% | 66.7% | +33.3% | Correct |
| 4.5★ vs 3.5★ | 66.7% | 33.3% | +33.4% | Correct |
| 3.5★ vs 3★ | 33.3% | 0.0% | +33.3% | Correct |
| 3★ vs 2.5★ | 0.0% | 33.3% | -33.3% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.700 |
| Spearman: Stars vs Flat ROI | 0.700 |
| Spearman: Stars vs CLV | -0.500 |
| Brier Score | 0.2164 |
| Monotonicity Score | -0.50 |

### All Time (n=574)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 15 | 59.4% | 59.4% | 60.0% | +0.6% | 0.7% | -5.0% | 2.63 | 0.85% | Fair |
| 4.5 | 37 | 57.7% | 57.7% | 51.4% | -6.3% | -10.5% | -12.6% | 2.59 | 1.29% | Weak |
| 4 | 115 | 56.0% | 56.0% | 53.9% | -2.1% | -3.2% | -3.7% | 2.12 | -0.75% | Fair |
| 3.5 | 121 | 56.5% | 56.5% | 58.7% | +2.2% | -0.3% | 2.3% | 1.73 | -0.34% | Fair |
| 3 | 161 | 55.1% | 55.1% | 48.4% | -6.7% | -13.5% | -11.2% | 1.20 | -0.63% | Weak |
| 2.5 | 110 | 54.4% | 54.4% | 54.5% | +0.2% | -1.5% | 1.9% | 0.73 | -0.76% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 60.0% | 51.4% | +8.6% | Correct |
| 4.5★ vs 4★ | 51.4% | 53.9% | -2.5% | Flat |
| 4★ vs 3.5★ | 53.9% | 58.7% | -4.8% | INVERTED |
| 3.5★ vs 3★ | 58.7% | 48.4% | +10.3% | Correct |
| 3★ vs 2.5★ | 48.4% | 54.5% | -6.1% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.314 |
| Spearman: Stars vs Flat ROI | 0.314 |
| Spearman: Stars vs CLV | 0.771 |
| Brier Score | 0.2272 |
| Monotonicity Score | 0.20 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | — | — | Insufficient data |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | — | — | Insufficient data |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | — | — | Insufficient data |
| WalletBase | Wallet quality | Composite skill score | Higher → better | — | — | Insufficient data |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | — | — | Insufficient data |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | — | — | Insufficient data |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | — | — | Insufficient data |
| ForSide | Side support | Total wallet force on side | Higher → better | — | — | Insufficient data |
| AgainstSide | Opposition | Force against side | Higher → worse | — | — | Insufficient data |
| NetEdge | Core side edge | For minus discounted against | Higher → better | — | — | Insufficient data |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | — | — | Insufficient data |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | — | — | Insufficient data |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | — | — | Insufficient data |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | — | — | Insufficient data |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

_Insufficient data_

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.90-1.05 | 4 | 50.0% | -7.1% | 34.0% | 0.60% |  |
| 1.05-1.20 | 2 | 0.0% | -100.0% | -100.0% | 0.35% |  |
| 1.20-1.35 | 1 | 100.0% | 105.0% | 106.0% | 1.71% |  |

### NetEdge Buckets

_Insufficient data_

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.25-0.40 | 2 | 100.0% | 85.8% | 72.3% | -0.19% | Healthy support |
| 0.40-0.60 | 3 | 0.0% | -100.0% | -100.0% | 0.96% | Concentrated |
| 0.60-0.80 | 2 | 50.0% | 2.5% | 3.0% | 1.71% | Very concentrated |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 3 | 66.7% | 23.9% | 41.9% | -0.44% | 3.7 |
| Broad battle | 3 | 33.3% | -31.7% | -48.5% | 1.85% | 2.8 |
| One-wallet nuke | 5 | 60.0% | -2.3% | 24.8% | -0.30% | 4.5 |
| Thin support | 6 | 66.7% | 15.6% | 28.9% | 0.03% | 4.2 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=12)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 1 | 0.0% | -100.0% | -100.0% | -1.71% | 4.5 | 100.0% |
| SMALL_MOVE | 1 | 100.0% | 105.0% | 106.0% | 1.13% | 3.5 | 100.0% |
| CLEAR_MOVE | 4 | 75.0% | 31.8% | 62.9% | -0.23% | 4.4 | 100.0% |
| NEAR_START | 6 | 33.3% | -44.5% | -22.2% | 0.85% | 3.2 | 100.0% |

**All Time** (n=574)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 518 | 53.7% | -5.3% | -5.0% | -0.52% | 3.2 | 1.7% |
| SMALL_MOVE | 4 | 50.0% | 0.1% | -42.9% | 1.91% | 4.3 | 25.0% |
| CLEAR_MOVE | 30 | 56.7% | 4.7% | 10.3% | -0.38% | 3.9 | 100.0% |
| NEAR_START | 22 | 45.5% | -20.9% | -13.9% | 0.57% | 3.5 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 1 / 0.0% / -100.0% | — | 3 / 100.0% / 75.8% | 1 / 100.0% / 27.8% |
| 3.5-4★ | — | 1 / 100.0% / 105.0% | 1 / 0.0% / -100.0% | 1 / 0.0% / -100.0% |
| 2.5-3★ | — | — | — | 4 / 25.0% / -48.8% |
| 1.0-2★ | — | — | — | — |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 12 | 50.0% | -11.2% | 16.4% | 3.7 | 0.25% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 62 | 51.6% | -6.7% | -1.3% | 3.9 | -0.03% |
| SHADOW | 512 | 53.7% | -5.2% | -5.2% | 3.2 | -0.51% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 16 | 100% |
| LOCKED (direct) | 14 | 87.5% |
| Promoted (SHADOW→LOCKED) | 0 | 0.0% |
| Rejected (stayed SHADOW) | 2 | 12.5% |
| Superseded (side flipped) | 0 | 0.0% |
| Muted | 1 | 6.3% |
| Cancelled | 0 | 0.0% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=12)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 2.67u | 16.4% | — |
| Flat 1.0u | -1.35u | -11.2% | +4.02u |
| Lock units only | 2.61u | — | +0.06u |
| Units change only on star change | 2.67u | — | +0.00u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 2 | 2.50 | 62.0% | 55.0% | +1.51u | Sizing helps |
| 4.5 | 3 | 2.33 | 10.4% | 30.1% | +1.80u | Sizing helps |
| 3.5 | 3 | 0.67 | -31.7% | -48.5% | -0.02u | Neutral |
| 3 | 1 | 0.75 | -100.0% | -100.0% | +0.25u | Neutral |
| 2.5 | 3 | 0.50 | -31.7% | -31.3% | +0.48u | Neutral |

### All Time (n=574)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -42.21u | -4.8% | — |
| Flat 1.0u | -30.86u | -5.4% | -11.35u |
| Lock units only | -31.50u | — | -10.71u |
| Units change only on star change | -41.37u | — | -0.84u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 15 | 2.63 | 0.7% | -5.0% | -2.08u | Sizing hurts |
| 4.5 | 37 | 2.59 | -10.5% | -12.6% | -8.22u | Sizing hurts |
| 4 | 115 | 2.12 | -3.2% | -3.7% | -5.24u | Sizing hurts |
| 3.5 | 121 | 1.73 | -0.3% | 2.3% | +5.29u | Sizing helps |
| 3 | 161 | 1.20 | -13.5% | -11.2% | +0.10u | Neutral |
| 2.5 | 110 | 0.73 | -1.5% | 1.9% | +3.19u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 12 | 53.5% | 50.0% | -3.5% | -11.2% | 0.25% | Below market |
| 4.5-5★ | 5 | 60.2% | 80.0% | +19.8% | 31.0% | -0.67% | Beating market |
| 3.5-4★ | 3 | 44.7% | 33.3% | -11.3% | -31.7% | 1.04% | Below market |
| 2.5-3★ | 4 | 51.6% | 25.0% | -26.6% | -48.8% | 0.98% | Below market |
| CLEAR_MOVE only | 4 | 51.3% | 75.0% | +23.7% | 31.8% | -0.23% | Beating market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

_Insufficient V8 data for drift monitoring._

---

## 11. Failure Diagnostics

### V8 Era (n=12)

No major failure modes detected.

### 7-Day (n=163)

- **Sizing issue**: Model P/L (-26.84u) trails flat (-20.48u) by 6.36u
- **Environment issue**: 65.6% NO_MOVE (WR: 45.8%, ROI: -16.2%)
- **Gate issue**: NO_MOVE ROI (-16.2%) significantly trails CLEAR_MOVE (4.7%)

### All Time (n=574)

- **Sizing issue**: Model P/L (-42.21u) trails flat (-30.86u) by 11.35u
- **Environment issue**: 90.2% NO_MOVE (WR: 53.7%, ROI: -5.3%)


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
| V8 era picks | 12 |
| V8 flat ROI | -11.2% |
| V8 model ROI | 16.4% |
| V8 star monotonicity score | -0.50 |
| 4.5-5★ ROI | 31.0% |
| 2.5-3★ ROI | -48.8% |
| CLEAR_MOVE ROI | 31.8% |
| NO_MOVE ROI | -100.0% |
| Single-wallet play rate | 41.7% |
| Whale override win rate | — |
| Avg CLV by star bucket | 5★: 0.62% | 4.5★: -1.53% | 3.5★: 1.04% | 3★: -0.95% | 2.5★: 1.95% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=12)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 12 | 100.0% | 50.0% | -11.2% | 16.4% | 0.25% |

### 7-Day (n=163)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 161 | 98.8% | 47.2% | -14.3% | -12.4% | -0.05% |
| CANCELLED | 2 | 1.2% | 100.0% | 131.0% | 131.0% | -7.02% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |

### All Time (n=574)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 572 | 99.7% | 53.3% | -5.9% | -5.1% | -0.42% |
| CANCELLED | 2 | 0.3% | 100.0% | 131.0% | 131.0% | -7.02% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
