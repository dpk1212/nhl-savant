# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-14 ET
**Completed Picks**: 811 | **V8 Era Picks**: 249 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (60.0%) beats 5★ (54.3%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 28 | 57.1% | 0.44u | 1.6% | 4.39u | 6.0% | 0.27% | -0.42% | Strong |
| 7-Day | 54 | 61.1% | 7.34u | 13.6% | 21.08u | 17.4% | 0.02% | -0.43% | Strong |
| 14-Day | 93 | 54.8% | 3.54u | 3.8% | 11.80u | 6.8% | -0.36% | -0.35% |  |
| 30-Day | 320 | 48.8% | -20.22u | -6.3% | -13.36u | -2.7% | 0.03% | -0.43% |  |
| V8 Era | 249 | 50.6% | -5.80u | -2.3% | 6.64u | 1.7% | -0.07% | -0.39% |  |
| All Time | 811 | 52.7% | -35.32u | -4.4% | -38.24u | -3.0% | -0.33% | -0.08% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=249)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 70 | 54.1% | 54.1% | 54.3% | +0.2% | -2.3% | 3.9% | 2.70 | 0.16% | Fair |
| 4.5 | 20 | 50.7% | 50.7% | 60.0% | +9.3% | 21.7% | 20.3% | 2.53 | -1.02% | Strong |
| 4 | 37 | 52.7% | 52.7% | 51.4% | -1.4% | -0.2% | -3.5% | 1.20 | 0.17% | Fair |
| 3.5 | 67 | 51.2% | 51.2% | 52.2% | +1.0% | 6.3% | 9.8% | 0.80 | -0.07% | Strong |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 30 | 53.2% | 53.2% | 40.0% | -13.2% | -23.0% | -36.3% | 0.73 | -0.28% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 54.3% | 60.0% | -5.7% | INVERTED |
| 4.5★ vs 4★ | 60.0% | 51.4% | +8.6% | Correct |
| 4★ vs 3.5★ | 51.4% | 52.2% | -0.8% | Flat |
| 3.5★ vs 3★ | 52.2% | 38.1% | +14.1% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.0% | -1.9% | Flat |
| 2.5★ vs 2★ | 40.0% | 0.0% | +40.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.893 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2479 |
| Monotonicity Score | 0.00 |

### All Time (n=811)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 83 | 54.8% | 54.8% | 54.2% | -0.6% | -3.3% | 1.2% | 2.69 | 0.27% | Fair |
| 4.5 | 54 | 55.1% | 55.1% | 53.7% | -1.4% | 0.2% | -2.8% | 2.58 | 0.52% | Fair |
| 4 | 152 | 55.2% | 55.2% | 53.3% | -1.9% | -2.5% | -3.6% | 1.90 | -0.49% | Fair |
| 3.5 | 185 | 54.8% | 54.8% | 56.8% | +2.0% | 2.6% | 4.3% | 1.41 | -0.25% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 137 | 54.2% | 54.2% | 51.8% | -2.4% | -5.6% | -5.9% | 0.73 | -0.69% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 54.2% | 53.7% | +0.5% | Correct |
| 4.5★ vs 4★ | 53.7% | 53.3% | +0.4% | Correct |
| 4★ vs 3.5★ | 53.3% | 56.8% | -3.5% | INVERTED |
| 3.5★ vs 3★ | 56.8% | 47.5% | +9.3% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.8% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.750 |
| Spearman: Stars vs Flat ROI | 0.643 |
| Spearman: Stars vs CLV | 0.179 |
| Brier Score | 0.2337 |
| Monotonicity Score | -0.33 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.022 | 0.001 | Monitor |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.040 | -0.048 | Monitor |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.037 | -0.060 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.070 | -0.055 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.186 | 0.176 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.232 | 0.227 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.107 | 0.104 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.012 | 0.026 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.038 | 0.078 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | 0.006 | -0.005 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.102 | 0.104 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.077 | 0.004 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.094 | 0.023 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.024 | 0.016 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (21.47–48.94) | 40 | 57.5% | 8.3% | 22.6% | -0.56% |  |
| p20-40 (49.05–52.70) | 40 | 45.0% | -15.2% | 1.2% | 0.47% |  |
| p40-60 (52.90–57.16) | 40 | 57.5% | 27.8% | 18.3% | 0.12% |  |
| p60-80 (57.23–62.76) | 40 | 47.5% | -8.2% | -8.4% | 0.42% |  |
| p80-95 (62.80–66.00) | 40 | 47.5% | -17.4% | -20.8% | -0.50% |  |
| p95+ (66.05–83.30) | 41 | 46.3% | -11.6% | -17.1% | -0.40% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 77 | 41.6% | -21.2% | -11.2% | -0.16% |  |
| 0.90-1.05 | 82 | 42.7% | -20.7% | -19.4% | -0.13% |  |
| 1.05-1.20 | 57 | 70.2% | 42.3% | 48.3% | 0.22% |  |
| 1.20-1.35 | 13 | 61.5% | 21.3% | -1.0% | -0.12% |  |
| 1.35-1.50 | 8 | 50.0% | 0.6% | -40.8% | -0.46% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.71) | 37 | 48.6% | -5.2% | 3.7% | -0.35% |  |
| 20-40% (0.72–0.95) | 37 | 48.6% | -6.3% | 3.8% | -0.56% |  |
| 40-60% (0.95–1.24) | 38 | 63.2% | 30.0% | 4.4% | 0.09% |  |
| 60-80% (1.25–1.57) | 37 | 40.5% | -21.7% | 5.2% | 0.37% |  |
| 80-95% (1.58–2.11) | 37 | 43.2% | -22.2% | -5.8% | -0.38% |  |
| 95%+ (2.11–4.76) | 38 | 52.6% | 0.6% | -5.5% | 0.42% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 18 | 38.9% | -24.3% | -30.0% | 0.50% | Broad support |
| 0.25-0.40 | 71 | 53.5% | 5.0% | 4.4% | 0.12% | Healthy support |
| 0.40-0.60 | 76 | 46.1% | -8.6% | 13.4% | -0.01% | Concentrated |
| 0.60-0.80 | 41 | 53.7% | -1.2% | -10.1% | -0.24% | Very concentrated |
| 0.80-1.00 | 18 | 50.0% | -5.7% | -17.8% | -1.21% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 35 | 40.0% | -23.5% | -12.5% | -0.03% | 4.2 |
| Broad battle | 128 | 49.2% | -2.1% | 4.5% | -0.09% | 3.9 |
| One-wallet nuke | 43 | 55.8% | 4.7% | 8.6% | -0.60% | 3.7 |
| Thin support | 108 | 51.9% | -2.5% | -4.5% | -0.18% | 3.6 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=249)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 11 | 45.5% | -18.7% | 4.1% | 0.26% | 4.3 | 72.7% |
| SMALL_MOVE | 41 | 36.6% | -31.0% | -35.3% | 0.23% | 4.0 | 100.0% |
| CLEAR_MOVE | 69 | 60.9% | 9.6% | 22.8% | -0.22% | 4.0 | 100.0% |
| NEAR_START | 111 | 48.6% | 0.1% | -1.6% | -0.11% | 3.7 | 100.0% |

**All Time** (n=811)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 528 | 53.6% | -5.4% | -4.6% | -0.49% | 3.2 | 3.0% |
| SMALL_MOVE | 44 | 36.4% | -31.3% | -37.4% | 0.37% | 4.0 | 93.2% |
| CLEAR_MOVE | 95 | 58.9% | 7.1% | 16.4% | -0.27% | 4.0 | 100.0% |
| NEAR_START | 127 | 48.8% | -1.4% | -3.0% | -0.05% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 7 / 57.1% / 0.8% | 13 / 30.8% / -54.8% | 29 / 69.0% / 22.6% | 35 / 54.3% / 11.5% |
| 3.5-4★ | 2 / 0.0% / -100.0% | 25 / 40.0% / -17.5% | 27 / 51.9% / -6.4% | 39 / 59.0% / 23.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 36 / 33.3% / -33.8% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 246 | 50.4% | -2.7% | 1.2% | 3.9 | -0.08% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 296 | 50.7% | -3.2% | 0.1% | 3.9 | -0.08% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 395 | 100% |
| LOCKED (direct) | 65 | 16.5% |
| Promoted (SHADOW→LOCKED) | 191 | 48.4% |
| Rejected (stayed SHADOW) | 104 | 26.3% |
| Superseded (side flipped) | 30 | 7.6% |
| Muted | 180 | 45.6% |
| Cancelled | 20 | 5.1% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=249)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 6.64u | 1.7% | — |
| Flat 1.0u | -5.80u | -2.3% | +12.44u |
| Lock units only | 4.50u | — | +2.14u |
| Units change only on star change | 14.81u | — | -8.17u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 70 | 2.70 | -2.3% | 3.9% | +8.97u | Sizing helps |
| 4.5 | 20 | 2.53 | 21.7% | 20.3% | +5.95u | Sizing helps |
| 4 | 37 | 1.20 | -0.2% | -3.5% | -1.47u | Sizing hurts |
| 3.5 | 67 | 0.80 | 6.3% | 9.8% | +1.01u | Sizing helps |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 30 | 0.73 | -23.0% | -36.3% | -1.02u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=811)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -38.24u | -3.0% | — |
| Flat 1.0u | -35.32u | -4.4% | -2.92u |
| Lock units only | -29.62u | — | -8.62u |
| Units change only on star change | -29.23u | — | -9.01u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 83 | 2.69 | -3.3% | 1.2% | +5.37u | Sizing helps |
| 4.5 | 54 | 2.58 | 0.2% | -2.8% | -4.07u | Sizing hurts |
| 4 | 152 | 1.90 | -2.5% | -3.6% | -6.71u | Sizing hurts |
| 3.5 | 185 | 1.41 | 2.6% | 4.3% | +6.32u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 137 | 0.73 | -5.6% | -5.9% | +1.69u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 249 | 52.9% | 50.6% | -2.3% | -2.3% | -0.07% | Below market |
| 4.5-5★ | 90 | 53.4% | 55.6% | +2.2% | 3.0% | -0.10% | Beating market |
| 3.5-4★ | 104 | 51.8% | 51.9% | +0.2% | 4.0% | 0.02% | Neutral |
| 2.5-3★ | 53 | 54.2% | 41.5% | -12.7% | -20.2% | -0.19% | Below market |
| CLEAR_MOVE only | 69 | 54.5% | 60.9% | +6.4% | 9.6% | -0.22% | Beating market |
| NO_MOVE only | 11 | 55.7% | 45.5% | -10.2% | -18.7% | 0.26% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=38)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.922 | 51.001 | 0.55 |  |
| Rank_norm | 65.258 | 66.085 | 0.05 |  |
| PnL_norm | 56.392 | 50.285 | 0.40 |  |
| WalletBase | 57.690 | 52.154 | 0.58 |  |
| SizeRatio | 1.708 | 1.777 | 0.04 |  |
| ConvictionMult | 0.990 | 1.040 | 0.30 |  |
| WalletCountFor | 3.438 | 3.395 | 0.02 |  |
| TopShare | 0.488 | 0.573 | 0.41 |  |
| ForSide | 195.683 | 178.679 | 0.16 |  |
| AgainstSide | 64.680 | 61.966 | 0.03 |  |
| NetEdge | 1.407 | 1.260 | 0.17 |  |
| WalletPlayScore | 2.049 | 1.483 | 0.26 |  |

### V8 Era (n=224)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 56.922 | 57.040 | 0.01 |  |
| Rank_norm | 65.258 | 65.109 | 0.01 |  |
| PnL_norm | 56.392 | 55.983 | 0.03 |  |
| WalletBase | 57.690 | 57.557 | 0.01 |  |
| SizeRatio | 1.708 | 1.621 | 0.05 |  |
| ConvictionMult | 0.990 | 0.983 | 0.05 |  |
| WalletCountFor | 3.438 | 3.438 | 0.00 |  |
| TopShare | 0.488 | 0.488 | 0.00 |  |
| ForSide | 195.683 | 195.683 | 0.00 |  |
| AgainstSide | 64.680 | 64.680 | 0.00 |  |
| NetEdge | 1.407 | 1.407 | 0.00 |  |
| WalletPlayScore | 2.049 | 2.049 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=249)

- **Gate issue**: NO_MOVE ROI (-18.7%) significantly trails CLEAR_MOVE (9.6%)

### 7-Day (n=54)

No major failure modes detected.

### All Time (n=811)

- **Sizing issue**: Model P/L (-38.24u) trails flat (-35.32u) by 2.92u
- **Environment issue**: 65.1% NO_MOVE (WR: 53.6%, ROI: -5.4%)


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
| V8 era picks | 249 |
| V8 flat ROI | -2.3% |
| V8 model ROI | 1.7% |
| V8 star monotonicity score | 0.00 |
| 4.5-5★ ROI | 3.0% |
| 2.5-3★ ROI | -20.2% |
| CLEAR_MOVE ROI | 9.6% |
| NO_MOVE ROI | -18.7% |
| Single-wallet play rate | 17.3% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.16% | 4.5★: -1.02% | 4★: 0.17% | 3.5★: -0.07% | 3★: -0.02% | 2.5★: -0.28% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=249)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 175 | 70.3% | 48.0% | -4.5% | -6.5% | -0.03% |
| MUTED | 63 | 25.3% | 57.1% | 3.7% | 28.0% | -0.21% |
| CANCELLED | 11 | 4.4% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 16 | 75.0% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=54)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 35 | 64.8% | 54.3% | 5.5% | -1.9% | -0.28% |
| MUTED | 16 | 29.6% | 81.3% | 40.0% | 58.1% | 0.43% |
| CANCELLED | 3 | 5.6% | 33.3% | -32.7% | -24.3% | 1.04% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| ags_quality_veto | 14 | 78.6% |
| v73_hc_rescue | 8 | 75.0% |
| opp_side_stronger_diag | 4 | 75.0% |
| winners_killed | 3 | 33.3% |
| winners_faded | 1 | 100.0% |
| dw1_no_ags_support | 1 | 100.0% |

### All Time (n=811)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 735 | 90.6% | 52.1% | -5.4% | -5.7% | -0.32% |
| MUTED | 63 | 7.8% | 57.1% | 3.7% | 28.0% | -0.21% |
| CANCELLED | 13 | 1.6% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| ags_quality_veto | 16 | 75.0% |
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| winners_faded | 12 | 66.7% |
| opp_side_stronger_diag | 10 | 50.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
