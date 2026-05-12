# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-12 ET
**Completed Picks**: 791 | **V8 Era Picks**: 229 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (61.1%) beats 5★ (54.2%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 25 | 60.0% | 3.07u | 12.3% | 8.88u | 19.4% | -0.26% | -0.14% | Strong |
| 7-Day | 42 | 59.5% | 4.82u | 11.5% | 16.09u | 20.4% | -0.35% | -0.37% | Strong |
| 14-Day | 99 | 51.5% | -1.29u | -1.3% | 10.71u | 6.9% | -0.47% | -0.33% |  |
| 30-Day | 380 | 48.9% | -26.97u | -7.1% | -27.28u | -5.0% | -0.14% | -0.32% |  |
| V8 Era | 229 | 49.8% | -7.83u | -3.4% | 2.23u | 0.7% | -0.11% | -0.38% |  |
| All Time | 791 | 52.5% | -37.35u | -4.7% | -42.65u | -3.6% | -0.35% | -0.08% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=229)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 59 | 54.1% | 54.1% | 54.2% | +0.1% | -3.2% | 4.2% | 2.47 | 0.05% | Fair |
| 4.5 | 18 | 51.0% | 51.0% | 61.1% | +10.2% | 24.8% | 22.3% | 2.39 | -0.90% | Strong |
| 4 | 32 | 52.3% | 52.3% | 50.0% | -2.3% | -0.8% | -6.5% | 1.20 | 0.09% | Fair |
| 3.5 | 65 | 51.1% | 51.1% | 50.8% | -0.3% | 4.0% | 7.3% | 0.79 | -0.08% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 30 | 53.2% | 53.2% | 40.0% | -13.2% | -23.0% | -36.3% | 0.73 | -0.28% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 54.2% | 61.1% | -6.9% | INVERTED |
| 4.5★ vs 4★ | 61.1% | 50.0% | +11.1% | Correct |
| 4★ vs 3.5★ | 50.0% | 50.8% | -0.8% | Flat |
| 3.5★ vs 3★ | 50.8% | 38.1% | +12.7% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.0% | -1.9% | Flat |
| 2.5★ vs 2★ | 40.0% | 0.0% | +40.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2496 |
| Monotonicity Score | 0.00 |

### All Time (n=791)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 72 | 54.9% | 54.9% | 54.2% | -0.8% | -4.2% | 0.8% | 2.51 | 0.20% | Fair |
| 4.5 | 52 | 55.4% | 55.4% | 53.8% | -1.5% | 0.5% | -3.5% | 2.54 | 0.64% | Fair |
| 4 | 147 | 55.2% | 55.2% | 53.1% | -2.1% | -2.7% | -4.1% | 1.92 | -0.54% | Fair |
| 3.5 | 183 | 54.8% | 54.8% | 56.3% | +1.5% | 1.7% | 3.7% | 1.42 | -0.26% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 137 | 54.2% | 54.2% | 51.8% | -2.4% | -5.6% | -5.9% | 0.73 | -0.69% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 54.2% | 53.8% | +0.4% | Correct |
| 4.5★ vs 4★ | 53.8% | 53.1% | +0.7% | Correct |
| 4★ vs 3.5★ | 53.1% | 56.3% | -3.2% | INVERTED |
| 3.5★ vs 3★ | 56.3% | 47.5% | +8.8% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.8% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.750 |
| Spearman: Stars vs Flat ROI | 0.643 |
| Spearman: Stars vs CLV | 0.107 |
| Brier Score | 0.2339 |
| Monotonicity Score | -0.33 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.055 | 0.045 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.035 | -0.036 | Monitor |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | 0.006 | -0.039 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | 0.003 | -0.017 | Monitor |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.182 | 0.180 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.236 | 0.237 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.155 | 0.142 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | 0.001 | 0.041 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.039 | 0.085 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.010 | 0.002 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.095 | 0.104 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.068 | -0.006 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.090 | 0.017 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.019 | 0.021 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (36.10–49.70) | 36 | 50.0% | -1.1% | 18.3% | -0.62% |  |
| p20-40 (49.75–53.90) | 37 | 48.6% | -9.3% | 8.1% | 0.44% |  |
| p40-60 (54.05–58.15) | 37 | 59.5% | 29.4% | 11.0% | 0.02% |  |
| p60-80 (58.36–63.29) | 37 | 43.2% | -15.5% | -12.0% | 0.31% |  |
| p80-95 (63.40–66.40) | 37 | 45.9% | -19.7% | -17.1% | -0.51% |  |
| p95+ (66.60–83.30) | 37 | 48.6% | -7.3% | -11.4% | -0.44% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 73 | 41.1% | -22.3% | -16.2% | -0.20% |  |
| 0.90-1.05 | 70 | 41.4% | -22.8% | -21.8% | -0.25% |  |
| 1.05-1.20 | 54 | 68.5% | 40.7% | 46.1% | 0.19% |  |
| 1.20-1.35 | 13 | 61.5% | 21.3% | -1.0% | -0.12% |  |
| 1.35-1.50 | 7 | 42.9% | -12.3% | -50.6% | 0.03% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.70) | 34 | 47.1% | -7.6% | 1.9% | -0.42% |  |
| 20-40% (0.71–0.93) | 35 | 48.6% | -6.3% | 7.2% | -0.61% |  |
| 40-60% (0.93–1.23) | 34 | 64.7% | 35.4% | 10.4% | 0.09% |  |
| 60-80% (1.23–1.55) | 35 | 34.3% | -35.4% | -26.5% | -0.04% |  |
| 80-95% (1.57–2.11) | 34 | 38.2% | -29.6% | -18.2% | -0.21% |  |
| 95%+ (2.13–4.76) | 35 | 57.1% | 9.2% | 7.1% | 0.41% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 15 | 40.0% | -17.6% | -20.5% | 0.44% | Broad support |
| 0.25-0.40 | 68 | 51.5% | 1.1% | -3.5% | 0.07% | Healthy support |
| 0.40-0.60 | 68 | 45.6% | -9.3% | 14.5% | -0.07% | Concentrated |
| 0.60-0.80 | 38 | 50.0% | -7.3% | -15.4% | -0.29% | Very concentrated |
| 0.80-1.00 | 18 | 50.0% | -5.7% | -17.8% | -1.21% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 31 | 38.7% | -26.3% | -14.3% | -0.18% | 4.1 |
| Broad battle | 121 | 47.9% | -3.9% | 1.4% | -0.12% | 3.9 |
| One-wallet nuke | 40 | 57.5% | 7.8% | 16.1% | -0.57% | 3.6 |
| Thin support | 100 | 51.0% | -3.5% | -4.0% | -0.25% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=229)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 11 | 45.5% | -18.7% | 4.1% | 0.26% | 4.3 | 72.7% |
| SMALL_MOVE | 38 | 34.2% | -33.1% | -39.1% | 0.19% | 3.9 | 100.0% |
| CLEAR_MOVE | 63 | 58.7% | 5.6% | 15.0% | -0.35% | 4.0 | 100.0% |
| NEAR_START | 103 | 48.5% | -0.1% | -0.3% | -0.14% | 3.6 | 100.0% |

**All Time** (n=791)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 528 | 53.6% | -5.4% | -4.6% | -0.49% | 3.2 | 3.0% |
| SMALL_MOVE | 41 | 34.1% | -33.3% | -41.0% | 0.34% | 4.0 | 92.7% |
| CLEAR_MOVE | 89 | 57.3% | 4.1% | 10.5% | -0.36% | 4.0 | 100.0% |
| NEAR_START | 119 | 48.7% | -1.7% | -2.2% | -0.08% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 7 / 57.1% / 0.8% | 11 / 27.3% / -58.0% | 26 / 65.4% / 14.5% | 28 / 57.1% / 17.6% |
| 3.5-4★ | 2 / 0.0% / -100.0% | 24 / 37.5% / -20.7% | 24 / 50.0% / -8.4% | 38 / 57.9% / 21.5% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 36 / 33.3% / -33.8% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 226 | 49.6% | -3.9% | 0.1% | 3.8 | -0.13% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 276 | 50.0% | -4.2% | -0.9% | 3.9 | -0.12% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 375 | 100% |
| LOCKED (direct) | 65 | 17.3% |
| Promoted (SHADOW→LOCKED) | 172 | 45.9% |
| Rejected (stayed SHADOW) | 104 | 27.7% |
| Superseded (side flipped) | 29 | 7.7% |
| Muted | 170 | 45.3% |
| Cancelled | 20 | 5.3% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=229)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 2.23u | 0.7% | — |
| Flat 1.0u | -7.83u | -3.4% | +10.06u |
| Lock units only | 2.46u | — | -0.23u |
| Units change only on star change | 7.83u | — | -5.60u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 59 | 2.47 | -3.2% | 4.2% | +8.01u | Sizing helps |
| 4.5 | 18 | 2.39 | 24.8% | 22.3% | +5.12u | Sizing helps |
| 4 | 32 | 1.20 | -0.8% | -6.5% | -2.24u | Sizing hurts |
| 3.5 | 65 | 0.79 | 4.0% | 7.3% | +1.19u | Sizing helps |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 30 | 0.73 | -23.0% | -36.3% | -1.02u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=791)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -42.65u | -3.6% | — |
| Flat 1.0u | -37.35u | -4.7% | -5.30u |
| Lock units only | -31.66u | — | -10.99u |
| Units change only on star change | -36.21u | — | -6.44u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 72 | 2.51 | -4.2% | 0.8% | +4.42u | Sizing helps |
| 4.5 | 52 | 2.54 | 0.5% | -3.5% | -4.90u | Sizing hurts |
| 4 | 147 | 1.92 | -2.7% | -4.1% | -7.48u | Sizing hurts |
| 3.5 | 183 | 1.42 | 1.7% | 3.7% | +6.49u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 137 | 0.73 | -5.6% | -5.9% | +1.69u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 229 | 52.8% | 49.8% | -3.0% | -3.4% | -0.11% | Below market |
| 4.5-5★ | 77 | 53.4% | 55.8% | +2.5% | 3.3% | -0.17% | Beating market |
| 3.5-4★ | 97 | 51.5% | 50.5% | -1.0% | 2.4% | -0.03% | Neutral |
| 2.5-3★ | 53 | 54.2% | 41.5% | -12.7% | -20.2% | -0.19% | Below market |
| CLEAR_MOVE only | 63 | 54.4% | 58.7% | +4.3% | 5.6% | -0.35% | Beating market |
| NO_MOVE only | 11 | 55.7% | 45.5% | -10.2% | -18.7% | 0.26% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=28)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.830 | 55.586 | 0.21 |  |
| Rank_norm | 65.320 | 64.473 | 0.05 |  |
| PnL_norm | 57.527 | 56.310 | 0.08 |  |
| WalletBase | 58.728 | 57.824 | 0.10 |  |
| SizeRatio | 1.709 | 1.973 | 0.17 |  |
| ConvictionMult | 0.990 | 1.063 | 0.42 |  |
| WalletCountFor | 3.367 | 2.821 | 0.31 |  |
| TopShare | 0.491 | 0.632 | 0.67 |  |
| ForSide | 195.234 | 172.254 | 0.22 |  |
| AgainstSide | 65.402 | 55.507 | 0.11 |  |
| NetEdge | 1.396 | 1.251 | 0.16 |  |
| WalletPlayScore | 2.000 | 1.022 | 0.45 |  |

### V8 Era (n=207)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.830 | 57.903 | 0.01 |  |
| Rank_norm | 65.320 | 64.651 | 0.04 |  |
| PnL_norm | 57.527 | 56.822 | 0.05 |  |
| WalletBase | 58.728 | 58.436 | 0.03 |  |
| SizeRatio | 1.709 | 1.651 | 0.04 |  |
| ConvictionMult | 0.990 | 0.983 | 0.04 |  |
| WalletCountFor | 3.367 | 3.367 | 0.00 |  |
| TopShare | 0.491 | 0.491 | 0.00 |  |
| ForSide | 195.234 | 195.234 | 0.00 |  |
| AgainstSide | 65.402 | 65.402 | 0.00 |  |
| NetEdge | 1.396 | 1.396 | 0.00 |  |
| WalletPlayScore | 2.000 | 2.000 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=229)

- **Gate issue**: NO_MOVE ROI (-18.7%) significantly trails CLEAR_MOVE (5.6%)

### 7-Day (n=42)

- **Concentration issue**: 15 high-concentration picks (TopShare>0.6) at -21.7% ROI

### All Time (n=791)

- **Sizing issue**: Model P/L (-42.65u) trails flat (-37.35u) by 5.30u
- **Environment issue**: 66.8% NO_MOVE (WR: 53.6%, ROI: -5.4%)


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
| V8 era picks | 229 |
| V8 flat ROI | -3.4% |
| V8 model ROI | 0.7% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 3.3% |
| 2.5-3★ ROI | -20.2% |
| CLEAR_MOVE ROI | 5.6% |
| NO_MOVE ROI | -18.7% |
| Single-wallet play rate | 17.5% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.05% | 4.5★: -0.90% | 4★: 0.09% | 3.5★: -0.08% | 3★: -0.02% | 2.5★: -0.28% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=229)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 164 | 71.6% | 48.8% | -2.8% | -2.7% | -0.03% |
| MUTED | 54 | 23.6% | 51.9% | -5.5% | 14.7% | -0.43% |
| CANCELLED | 11 | 4.8% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 18 | 44.4% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| winners_faded | 11 | 63.6% |
| opp_side_stronger_diag | 9 | 44.4% |
| winners_killed | 9 | 55.6% |
| ags_quality_veto | 9 | 66.7% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |

### 7-Day (n=42)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 29 | 69.0% | 62.1% | 22.3% | 20.7% | -0.52% |
| MUTED | 10 | 23.8% | 60.0% | -6.5% | 25.5% | -0.34% |
| CANCELLED | 3 | 7.1% | 33.3% | -32.7% | -24.3% | 1.04% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_quality_veto | 9 | 66.7% |
| v73_hc_rescue | 5 | 60.0% |
| opp_side_stronger_diag | 3 | 66.7% |
| winners_killed | 3 | 33.3% |
| wps_flipped_diag | 1 | 0.0% |
| winners_faded | 1 | 0.0% |

### All Time (n=791)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 724 | 91.5% | 52.3% | -5.1% | -4.9% | -0.33% |
| MUTED | 54 | 6.8% | 51.9% | -5.5% | 14.7% | -0.43% |
| CANCELLED | 13 | 1.6% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 18 | 44.4% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| winners_faded | 11 | 63.6% |
| opp_side_stronger_diag | 9 | 44.4% |
| winners_killed | 9 | 55.6% |
| ags_quality_veto | 9 | 66.7% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
