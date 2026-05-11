# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-11 ET
**Completed Picks**: 783 | **V8 Era Picks**: 221 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (66.7%) beats 5★ (53.4%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 24 | 62.5% | 5.05u | 21.1% | 12.77u | 29.1% | -0.29% | -0.44% | Strong |
| 7-Day | 42 | 57.1% | 3.95u | 9.4% | 15.10u | 18.8% | -1.01% | -0.39% | Strong |
| 14-Day | 106 | 52.8% | 1.64u | 1.5% | 14.85u | 9.2% | -0.50% | -0.35% |  |
| 30-Day | 402 | 48.8% | -30.50u | -7.6% | -35.54u | -6.2% | -0.18% | -0.35% |  |
| V8 Era | 221 | 49.8% | -6.25u | -2.8% | 2.25u | 0.7% | -0.12% | -0.38% |  |
| All Time | 783 | 52.5% | -35.76u | -4.6% | -42.63u | -3.6% | -0.35% | -0.08% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=221)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 58 | 53.6% | 53.6% | 53.4% | -0.2% | -3.6% | 3.7% | 2.44 | 0.04% | Fair |
| 4.5 | 15 | 50.0% | 50.0% | 66.7% | +16.7% | 39.1% | 29.6% | 2.42 | -0.94% | Strong |
| 4 | 32 | 52.3% | 52.3% | 50.0% | -2.3% | -0.8% | -6.5% | 1.20 | 0.09% | Fair |
| 3.5 | 61 | 50.9% | 50.9% | 50.8% | -0.1% | 4.8% | 7.2% | 0.78 | -0.11% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 30 | 53.2% | 53.2% | 40.0% | -13.2% | -23.0% | -36.3% | 0.73 | -0.28% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.4% | 66.7% | -13.3% | INVERTED |
| 4.5★ vs 4★ | 66.7% | 50.0% | +16.7% | Correct |
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
| Brier Score | 0.2511 |
| Monotonicity Score | 0.00 |

### All Time (n=783)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 71 | 54.5% | 54.5% | 53.5% | -1.0% | -4.5% | 0.3% | 2.48 | 0.19% | Fair |
| 4.5 | 49 | 55.3% | 55.3% | 55.1% | -0.2% | 3.4% | -2.8% | 2.55 | 0.74% | Fair |
| 4 | 147 | 55.2% | 55.2% | 53.1% | -2.1% | -2.7% | -4.1% | 1.92 | -0.54% | Fair |
| 3.5 | 179 | 54.8% | 54.8% | 56.4% | +1.6% | 1.9% | 3.6% | 1.43 | -0.28% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 137 | 54.2% | 54.2% | 51.8% | -2.4% | -5.6% | -5.9% | 0.73 | -0.69% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.5% | 55.1% | -1.6% | Flat |
| 4.5★ vs 4★ | 55.1% | 53.1% | +2.0% | Correct |
| 4★ vs 3.5★ | 53.1% | 56.4% | -3.3% | INVERTED |
| 3.5★ vs 3★ | 56.4% | 47.5% | +8.9% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.8% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.714 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2341 |
| Monotonicity Score | 0.00 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.049 | 0.035 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.051 | -0.046 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.011 | -0.046 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.010 | -0.030 | Monitor |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.171 | 0.177 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.225 | 0.232 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.140 | 0.134 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.013 | 0.039 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.040 | 0.090 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.003 | 0.001 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.086 | 0.104 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.084 | -0.003 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.106 | 0.020 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.032 | 0.019 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (36.10–49.70) | 35 | 51.4% | 1.8% | 23.5% | -0.58% |  |
| p20-40 (50.29–54.05) | 36 | 50.0% | -4.9% | 9.8% | 0.51% |  |
| p40-60 (54.47–58.36) | 35 | 60.0% | 31.6% | 10.4% | 0.01% |  |
| p60-80 (58.48–63.29) | 36 | 44.4% | -13.2% | -8.9% | 0.24% |  |
| p80-95 (63.40–66.26) | 35 | 45.7% | -19.7% | -19.2% | -0.51% |  |
| p95+ (66.40–83.30) | 36 | 44.4% | -14.8% | -19.6% | -0.50% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 72 | 41.7% | -21.2% | -15.5% | -0.19% |  |
| 0.90-1.05 | 67 | 41.8% | -21.1% | -22.0% | -0.29% |  |
| 1.05-1.20 | 50 | 68.0% | 41.5% | 48.1% | 0.23% |  |
| 1.20-1.35 | 13 | 61.5% | 21.3% | -1.0% | -0.12% |  |
| 1.35-1.50 | 7 | 42.9% | -12.3% | -50.6% | 0.03% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.71) | 33 | 48.5% | -4.8% | 4.1% | -0.42% |  |
| 20-40% (0.72–0.93) | 34 | 50.0% | -3.6% | 9.5% | -0.63% |  |
| 40-60% (0.93–1.24) | 34 | 64.7% | 36.4% | 8.6% | 0.10% |  |
| 60-80% (1.24–1.55) | 33 | 33.3% | -37.4% | -25.3% | 0.05% |  |
| 80-95% (1.57–2.11) | 34 | 38.2% | -29.6% | -18.2% | -0.21% |  |
| 95%+ (2.13–4.76) | 34 | 55.9% | 8.9% | 6.4% | 0.41% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 14 | 35.7% | -20.2% | -26.7% | 0.45% | Broad support |
| 0.25-0.40 | 67 | 50.7% | 0.2% | -5.5% | 0.09% | Healthy support |
| 0.40-0.60 | 68 | 45.6% | -9.3% | 14.5% | -0.07% | Concentrated |
| 0.60-0.80 | 36 | 52.8% | -2.1% | -10.0% | -0.28% | Very concentrated |
| 0.80-1.00 | 17 | 52.9% | -0.2% | -13.5% | -1.22% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 31 | 38.7% | -26.3% | -14.3% | -0.18% | 4.1 |
| Broad battle | 118 | 48.3% | -2.8% | 1.9% | -0.11% | 3.9 |
| One-wallet nuke | 36 | 58.3% | 9.7% | 18.0% | -0.67% | 3.6 |
| Thin support | 95 | 51.6% | -2.3% | -3.3% | -0.28% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=221)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 37 | 35.1% | -31.3% | -36.5% | 0.25% | 3.9 | 100.0% |
| CLEAR_MOVE | 61 | 59.0% | 6.5% | 14.2% | -0.35% | 4.0 | 100.0% |
| NEAR_START | 103 | 48.5% | -0.1% | -0.3% | -0.14% | 3.6 | 100.0% |

**All Time** (n=783)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 40 | 35.0% | -31.6% | -38.9% | 0.40% | 3.9 | 92.5% |
| CLEAR_MOVE | 87 | 57.5% | 4.7% | 9.9% | -0.37% | 4.0 | 100.0% |
| NEAR_START | 119 | 48.7% | -1.7% | -2.2% | -0.08% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 10 / 30.0% / -53.8% | 25 / 64.0% / 12.6% | 28 / 57.1% / 17.6% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 24 / 37.5% / -20.7% | 23 / 52.2% / -4.4% | 38 / 57.9% / 21.5% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 36 / 33.3% / -33.8% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 218 | 49.5% | -3.3% | 0.1% | 3.8 | -0.13% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 268 | 50.0% | -3.7% | -1.0% | 3.8 | -0.12% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 368 | 100% |
| LOCKED (direct) | 65 | 17.7% |
| Promoted (SHADOW→LOCKED) | 165 | 44.8% |
| Rejected (stayed SHADOW) | 104 | 28.3% |
| Superseded (side flipped) | 29 | 7.9% |
| Muted | 168 | 45.7% |
| Cancelled | 19 | 5.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=221)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 2.25u | 0.7% | — |
| Flat 1.0u | -6.25u | -2.8% | +8.50u |
| Lock units only | 3.01u | — | -0.76u |
| Units change only on star change | 7.84u | — | -5.59u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 58 | 2.44 | -3.6% | 3.7% | +7.39u | Sizing helps |
| 4.5 | 15 | 2.42 | 39.1% | 29.6% | +4.88u | Sizing helps |
| 4 | 32 | 1.20 | -0.8% | -6.5% | -2.24u | Sizing hurts |
| 3.5 | 61 | 0.78 | 4.8% | 7.2% | +0.48u | Neutral |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 30 | 0.73 | -23.0% | -36.3% | -1.02u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=783)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -42.63u | -3.6% | — |
| Flat 1.0u | -35.76u | -4.6% | -6.87u |
| Lock units only | -31.11u | — | -11.52u |
| Units change only on star change | -36.20u | — | -6.43u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 71 | 2.48 | -4.5% | 0.3% | +3.80u | Sizing helps |
| 4.5 | 49 | 2.55 | 3.4% | -2.8% | -5.14u | Sizing hurts |
| 4 | 147 | 1.92 | -2.7% | -4.1% | -7.48u | Sizing hurts |
| 3.5 | 179 | 1.43 | 1.9% | 3.6% | +5.79u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 137 | 0.73 | -5.6% | -5.9% | +1.69u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 221 | 52.6% | 49.8% | -2.8% | -2.8% | -0.12% | Below market |
| 4.5-5★ | 73 | 52.9% | 56.2% | +3.3% | 5.2% | -0.16% | Beating market |
| 3.5-4★ | 93 | 51.4% | 50.5% | -0.8% | 2.9% | -0.04% | Neutral |
| 2.5-3★ | 53 | 54.2% | 41.5% | -12.7% | -20.2% | -0.19% | Below market |
| CLEAR_MOVE only | 61 | 54.3% | 59.0% | +4.7% | 6.5% | -0.35% | Beating market |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=31)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.941 | 58.714 | 0.07 |  |
| Rank_norm | 65.120 | 64.136 | 0.06 |  |
| PnL_norm | 57.456 | 54.515 | 0.20 |  |
| WalletBase | 58.699 | 58.799 | 0.01 |  |
| SizeRatio | 1.696 | 1.750 | 0.03 |  |
| ConvictionMult | 0.988 | 1.050 | 0.36 |  |
| WalletCountFor | 3.371 | 2.839 | 0.30 |  |
| TopShare | 0.488 | 0.613 | 0.60 |  |
| ForSide | 195.316 | 174.723 | 0.19 |  |
| AgainstSide | 64.424 | 48.339 | 0.18 |  |
| NetEdge | 1.406 | 1.336 | 0.08 |  |
| WalletPlayScore | 2.023 | 1.201 | 0.39 |  |

### V8 Era (n=202)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 57.941 | 58.144 | 0.02 |  |
| Rank_norm | 65.120 | 64.697 | 0.03 |  |
| PnL_norm | 57.456 | 56.892 | 0.04 |  |
| WalletBase | 58.699 | 58.578 | 0.01 |  |
| SizeRatio | 1.696 | 1.634 | 0.04 |  |
| ConvictionMult | 0.988 | 0.982 | 0.04 |  |
| WalletCountFor | 3.371 | 3.371 | 0.00 |  |
| TopShare | 0.488 | 0.488 | 0.00 |  |
| ForSide | 195.316 | 195.316 | 0.00 |  |
| AgainstSide | 64.424 | 64.424 | 0.00 |  |
| NetEdge | 1.406 | 1.406 | 0.00 |  |
| WalletPlayScore | 2.023 | 2.023 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=221)

- **Gate issue**: NO_MOVE ROI (-13.8%) significantly trails CLEAR_MOVE (6.5%)

### 7-Day (n=42)

- **Odds issue**: Avg CLV -1.01% — consistently getting bad closing lines

### All Time (n=783)

- **Sizing issue**: Model P/L (-42.63u) trails flat (-35.76u) by 6.87u
- **Environment issue**: 67.2% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 221 |
| V8 flat ROI | -2.8% |
| V8 model ROI | 0.7% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 5.2% |
| 2.5-3★ ROI | -20.2% |
| CLEAR_MOVE ROI | 6.5% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 16.3% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.04% | 4.5★: -0.94% | 4★: 0.09% | 3.5★: -0.11% | 3★: -0.02% | 2.5★: -0.28% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=221)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 160 | 72.4% | 48.8% | -2.6% | -2.1% | -0.03% |
| MUTED | 51 | 23.1% | 51.0% | -5.4% | 13.2% | -0.46% |
| CANCELLED | 10 | 4.5% | 60.0% | 6.9% | -6.2% | 0.29% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 17 | 47.1% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| winners_faded | 11 | 63.6% |
| opp_side_stronger_diag | 9 | 44.4% |
| winners_killed | 8 | 62.5% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| ags_quality_veto | 6 | 66.7% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |

### 7-Day (n=42)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 32 | 76.2% | 59.4% | 16.8% | 24.7% | -1.09% |
| MUTED | 7 | 16.7% | 57.1% | -6.2% | 26.0% | -0.56% |
| CANCELLED | 3 | 7.1% | 33.3% | -32.7% | -60.4% | -0.99% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 8 | 50.0% |
| ags_quality_veto | 6 | 66.7% |
| opp_side_stronger_diag | 5 | 40.0% |
| winners_killed | 3 | 33.3% |
| wps_flipped_diag | 1 | 0.0% |
| winners_faded | 1 | 0.0% |

### All Time (n=783)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 720 | 92.0% | 52.4% | -5.0% | -4.8% | -0.33% |
| MUTED | 51 | 6.5% | 51.0% | -5.4% | 13.2% | -0.46% |
| CANCELLED | 12 | 1.5% | 66.7% | 27.6% | 9.2% | -0.93% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 17 | 47.1% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| winners_faded | 11 | 63.6% |
| opp_side_stronger_diag | 9 | 44.4% |
| winners_killed | 8 | 62.5% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| ags_quality_veto | 6 | 66.7% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
