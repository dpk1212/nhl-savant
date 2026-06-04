# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-04 ET
**Completed Picks**: 1103 | **V8 Era Picks**: 541 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: NEEDS ATTENTION
- **Ranking health**: DEGRADED
- **Sizing health**: DEGRADED
- **Environment health**: HEALTHY
- **Most important takeaway**: Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Star inversion | ⚠️ | 4.5★ WR (62.5%) beats 5★ (48.3%) |
| Model P/L vs flat P/L | ⚠️ | Model trails flat by 7.1u — sizing amplifying losses |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 37 | 51.4% | 0.83u | 2.2% | 4.91u | 6.8% | -0.23% | -0.72% |  |
| 7-Day | 101 | 50.5% | -3.89u | -3.8% | 5.44u | 2.8% | -0.39% | -0.73% |  |
| 14-Day | 234 | 51.7% | -8.17u | -3.5% | -12.81u | -2.9% | -0.15% | -0.72% |  |
| 30-Day | 354 | 52.3% | -7.75u | -2.2% | -13.66u | -1.9% | -0.09% | -0.67% |  |
| V8 Era | 541 | 50.6% | -20.41u | -3.8% | -27.52u | -2.9% | -0.08% | -0.53% |  |
| All Time | 1103 | 52.1% | -49.92u | -4.5% | -72.40u | -4.0% | -0.25% | -0.19% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=541)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 180 | 53.6% | 53.6% | 48.3% | -5.3% | -12.2% | -7.7% | 2.77 | 0.05% | Weak |
| 4.5 | 56 | 53.4% | 53.4% | 62.5% | +9.1% | 17.7% | 12.9% | 2.52 | -0.59% | Strong |
| 4 | 96 | 52.8% | 52.8% | 51.0% | -1.8% | -1.8% | 3.2% | 1.45 | 0.07% | Fair |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 65 | 53.6% | 53.6% | 49.2% | -4.4% | -4.3% | -14.2% | 0.98 | 0.11% | Fair |
| 2.5 | 64 | 53.0% | 53.0% | 48.4% | -4.5% | -6.4% | -12.9% | 0.76 | -0.40% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 8 | 55.0% | 55.0% | 37.5% | -17.5% | -35.0% | -10.1% | 0.47 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.3% | 62.5% | -14.2% | INVERTED |
| 4.5★ vs 4★ | 62.5% | 51.0% | +11.5% | Correct |
| 4★ vs 3.5★ | 51.0% | 51.5% | -0.5% | Flat |
| 3.5★ vs 3★ | 51.5% | 49.2% | +2.3% | Correct |
| 3★ vs 2.5★ | 49.2% | 48.4% | +0.8% | Correct |
| 2.5★ vs 2★ | 48.4% | 0.0% | +48.4% | Correct |
| 2★ vs 1★ | 0.0% | 37.5% | -37.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.595 |
| Spearman: Stars vs Flat ROI | 0.595 |
| Spearman: Stars vs CLV | -0.238 |
| Brier Score | 0.2461 |
| Monotonicity Score | -0.14 |

### All Time (n=1103)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 193 | 54.0% | 54.0% | 48.7% | -5.3% | -11.9% | -8.1% | 2.77 | 0.10% | Weak |
| 4.5 | 90 | 55.0% | 55.0% | 57.8% | +2.8% | 6.3% | 1.7% | 2.56 | 0.13% | Strong |
| 4 | 211 | 54.5% | 54.5% | 52.6% | -1.9% | -2.6% | -1.2% | 1.82 | -0.34% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 225 | 54.7% | 54.7% | 48.9% | -5.8% | -10.5% | -11.7% | 1.14 | -0.37% | Weak |
| 2.5 | 171 | 53.9% | 53.9% | 52.6% | -1.3% | -2.8% | -3.4% | 0.74 | -0.65% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 8 | 55.0% | 55.0% | 37.5% | -17.5% | -35.0% | -10.1% | 0.47 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.7% | 57.8% | -9.1% | INVERTED |
| 4.5★ vs 4★ | 57.8% | 52.6% | +5.2% | Correct |
| 4★ vs 3.5★ | 52.6% | 56.5% | -3.9% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 48.9% | +7.6% | Correct |
| 3★ vs 2.5★ | 48.9% | 52.6% | -3.7% | INVERTED |
| 2.5★ vs 2★ | 52.6% | 0.0% | +52.6% | Correct |
| 2★ vs 1★ | 0.0% | 37.5% | -37.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.571 |
| Spearman: Stars vs CLV | 0.119 |
| Brier Score | 0.2366 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.185 | -0.067 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.158 | -0.101 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.071 | -0.032 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.197 | -0.078 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.024 | 0.025 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.006 | 0.049 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.160 | -0.042 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.178 | -0.060 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.000 | 0.049 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.135 | -0.055 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.012 | 0.045 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.177 | 0.067 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.189 | 0.078 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.157 | -0.055 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.25) | 88 | 56.8% | 3.0% | 4.6% | -0.01% |  |
| p20-40 (35.50–44.33) | 89 | 50.6% | -2.7% | -4.7% | -0.06% |  |
| p40-60 (44.33–49.65) | 89 | 52.8% | -1.7% | 4.6% | -0.53% |  |
| p60-80 (49.65–55.33) | 89 | 46.1% | -7.7% | -5.8% | 0.24% |  |
| p80-95 (55.40–63.63) | 89 | 50.6% | -2.2% | -5.6% | 0.15% |  |
| p95+ (63.65–83.30) | 89 | 46.1% | -12.5% | -18.1% | -0.30% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 186 | 47.8% | -10.8% | -7.9% | -0.25% |  |
| 0.90-1.05 | 181 | 46.4% | -11.6% | -14.1% | -0.05% |  |
| 1.05-1.20 | 116 | 61.2% | 20.1% | 23.5% | 0.13% |  |
| 1.20-1.35 | 31 | 51.6% | -4.2% | -14.1% | 0.30% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.39) | 79 | 54.4% | -0.8% | 8.1% | -0.13% |  |
| 20-40% (0.40–0.71) | 79 | 54.4% | 2.3% | 1.6% | -0.27% |  |
| 40-60% (0.71–0.96) | 80 | 48.8% | -9.7% | 2.6% | -0.30% |  |
| 60-80% (0.97–1.26) | 79 | 51.9% | 7.4% | -10.3% | 0.39% |  |
| 80-95% (1.26–1.83) | 79 | 43.0% | -16.3% | -5.6% | -0.05% |  |
| 95%+ (1.84–6.68) | 80 | 46.3% | -13.7% | -11.8% | 0.11% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 28 | 35.7% | -26.7% | -32.6% | 0.21% | Broad support |
| 0.25-0.40 | 99 | 50.5% | -0.3% | -4.8% | 0.29% | Healthy support |
| 0.40-0.60 | 151 | 46.4% | -10.7% | 0.8% | -0.11% | Concentrated |
| 0.60-0.80 | 106 | 56.6% | 5.3% | -0.0% | -0.26% | Very concentrated |
| 0.80-1.00 | 92 | 51.1% | -6.9% | -3.2% | -0.11% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 55 | 34.5% | -35.4% | -35.4% | -0.11% | 4.4 |
| Broad battle | 198 | 47.5% | -6.5% | -3.0% | 0.05% | 3.9 |
| One-wallet nuke | 157 | 53.5% | -1.3% | 0.1% | -0.21% | 3.6 |
| Thin support | 300 | 53.3% | -0.9% | -3.1% | -0.14% | 3.7 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=541)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 20 | 50.0% | -12.6% | 18.9% | 0.30% | 4.3 | 85.0% |
| SMALL_MOVE | 120 | 45.0% | -16.2% | -6.6% | -0.44% | 4.1 | 100.0% |
| CLEAR_MOVE | 130 | 56.2% | 3.9% | 5.9% | 0.12% | 4.1 | 100.0% |
| NEAR_START | 214 | 49.1% | -3.2% | -10.1% | 0.05% | 3.8 | 100.0% |

**All Time** (n=1103)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 537 | 53.6% | -5.4% | -3.7% | -0.48% | 3.3 | 4.7% |
| SMALL_MOVE | 123 | 44.7% | -16.7% | -8.3% | -0.37% | 4.1 | 97.6% |
| CLEAR_MOVE | 156 | 55.8% | 3.3% | 5.2% | 0.03% | 4.1 | 100.0% |
| NEAR_START | 230 | 49.1% | -3.8% | -10.2% | 0.07% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 10 / 60.0% / -0.3% | 56 / 48.2% / -14.8% | 65 / 58.5% / 5.3% | 88 / 47.7% / -7.5% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 42 / 47.6% / -7.9% | 38 / 47.4% / -12.2% | 58 / 58.6% / 21.3% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 18 / 33.3% / -32.1% | 27 / 63.0% / 23.2% | 62 / 43.5% / -15.9% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 6 / 33.3% / -45.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 538 | 50.6% | -4.0% | -3.1% | 4.0 | -0.08% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 588 | 50.7% | -4.1% | -3.2% | 4.0 | -0.09% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 880 | 100% |
| LOCKED (direct) | 83 | 9.4% |
| Promoted (SHADOW→LOCKED) | 524 | 59.5% |
| Rejected (stayed SHADOW) | 171 | 19.4% |
| Superseded (side flipped) | 97 | 11.0% |
| Muted | 337 | 38.3% |
| Cancelled | 20 | 2.3% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=541)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -27.52u | -2.9% | — |
| Flat 1.0u | -20.41u | -3.8% | -7.11u |
| Lock units only | -16.35u | — | -11.17u |
| Units change only on star change | -11.94u | — | -15.58u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 180 | 2.77 | -12.2% | -7.7% | -16.78u | Sizing hurts |
| 4.5 | 56 | 2.52 | 17.7% | 12.9% | +8.25u | Sizing helps |
| 4 | 96 | 1.45 | -1.8% | 3.2% | +6.22u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 65 | 0.98 | -4.3% | -14.2% | -6.26u | Sizing hurts |
| 2.5 | 64 | 0.76 | -6.4% | -12.9% | -2.17u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 8 | 0.47 | -35.0% | -10.1% | +2.42u | Sizing helps |

### All Time (n=1103)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -72.40u | -4.0% | — |
| Flat 1.0u | -49.92u | -4.5% | -22.48u |
| Lock units only | -50.47u | — | -21.93u |
| Units change only on star change | -55.99u | — | -16.41u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 193 | 2.77 | -11.9% | -8.1% | -20.38u | Sizing hurts |
| 4.5 | 90 | 2.56 | 6.3% | 1.7% | -1.76u | Sizing hurts |
| 4 | 211 | 1.82 | -2.6% | -1.2% | +0.98u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 225 | 1.14 | -10.5% | -11.7% | -6.40u | Sizing hurts |
| 2.5 | 171 | 0.74 | -2.8% | -3.4% | +0.54u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 8 | 0.47 | -35.0% | -10.1% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 541 | 53.1% | 50.6% | -2.4% | -3.8% | -0.08% | Below market |
| 4.5-5★ | 236 | 53.6% | 51.7% | -1.9% | -5.1% | -0.11% | Neutral |
| 3.5-4★ | 164 | 52.2% | 51.2% | -0.9% | 0.9% | 0.01% | Neutral |
| 2.5-3★ | 131 | 53.3% | 49.6% | -3.7% | -3.9% | -0.15% | Below market |
| CLEAR_MOVE only | 130 | 54.1% | 56.2% | +2.1% | 3.9% | 0.12% | Beating market |
| NO_MOVE only | 20 | 55.5% | 50.0% | -5.5% | -12.6% | 0.30% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=93)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.842 | 27.643 | 1.03 | ⚠️ |
| Rank_norm | 60.970 | 58.712 | 0.11 |  |
| PnL_norm | 53.241 | 54.492 | 0.07 |  |
| WalletBase | 49.382 | 38.025 | 0.83 |  |
| SizeRatio | 1.486 | 1.167 | 0.23 |  |
| ConvictionMult | 0.973 | 0.944 | 0.18 |  |
| WalletCountFor | 3.006 | 2.419 | 0.33 |  |
| TopShare | 0.579 | 0.684 | 0.44 |  |
| ForSide | 152.770 | 94.044 | 0.53 |  |
| AgainstSide | 49.283 | 34.402 | 0.19 |  |
| NetEdge | 1.109 | 0.648 | 0.54 |  |
| WalletPlayScore | 1.194 | 0.059 | 0.49 |  |

### V8 Era (n=476)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.842 | 45.014 | 0.05 |  |
| Rank_norm | 60.970 | 63.342 | 0.12 |  |
| PnL_norm | 53.241 | 53.997 | 0.04 |  |
| WalletBase | 49.382 | 48.984 | 0.03 |  |
| SizeRatio | 1.486 | 1.468 | 0.01 |  |
| ConvictionMult | 0.973 | 0.974 | 0.01 |  |
| WalletCountFor | 3.006 | 3.006 | 0.00 |  |
| TopShare | 0.579 | 0.579 | 0.00 |  |
| ForSide | 152.770 | 152.770 | 0.00 |  |
| AgainstSide | 49.283 | 49.283 | 0.00 |  |
| NetEdge | 1.109 | 1.109 | 0.00 |  |
| WalletPlayScore | 1.194 | 1.194 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=541)

- **Sizing issue**: Model P/L (-27.52u) trails flat (-20.41u) by 7.11u
- **Gate issue**: NO_MOVE ROI (-12.6%) significantly trails CLEAR_MOVE (3.9%)

### 7-Day (n=101)

No major failure modes detected.

### All Time (n=1103)

- **Sizing issue**: Model P/L (-72.40u) trails flat (-49.92u) by 22.48u
- **Environment issue**: 48.7% NO_MOVE (WR: 53.6%, ROI: -5.4%)


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
| V8 era picks | 541 |
| V8 flat ROI | -3.8% |
| V8 model ROI | -2.9% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | -5.1% |
| 2.5-3★ ROI | -3.9% |
| CLEAR_MOVE ROI | 3.9% |
| NO_MOVE ROI | -12.6% |
| Single-wallet play rate | 26.4% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.05% | 4.5★: -0.59% | 4★: 0.07% | 3.5★: -0.07% | 3★: 0.11% | 2.5★: -0.40% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=541)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 455 | 84.1% | 49.7% | -4.8% | -6.1% | -0.08% |
| MUTED | 75 | 13.9% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 2.0% | 54.5% | -2.8% | -10.4% | 0.16% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 19 | 42.1% |
| ags_quality_veto | 18 | 66.7% |
| opp_side_stronger_diag | 16 | 50.0% |
| winners_below_floor | 14 | 42.9% |
| winners_faded | 12 | 66.7% |
| ags_hard_mute | 10 | 60.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |

### 7-Day (n=101)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 99 | 98.0% | 49.5% | -5.5% | 0.4% | -0.41% |
| MUTED | 2 | 2.0% | 100.0% | 80.1% | 64.1% | 0.66% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| opp_side_stronger_diag | 3 | 66.7% |
| ags_hard_mute | 2 | 100.0% |
| wps_flipped_diag | 1 | 100.0% |

### All Time (n=1103)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1015 | 92.0% | 51.7% | -5.3% | -5.8% | -0.26% |
| MUTED | 75 | 6.8% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.2% | 61.5% | 17.8% | 4.8% | -0.95% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 21 | 52.4% |
| wps_flipped_diag | 19 | 42.1% |
| ags_quality_veto | 18 | 66.7% |
| opp_side_stronger_diag | 16 | 50.0% |
| winners_below_floor | 14 | 42.9% |
| winners_faded | 12 | 66.7% |
| ags_hard_mute | 10 | 60.0% |
| winners_killed | 9 | 55.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
| dw1_no_ags_support | 1 | 100.0% |
