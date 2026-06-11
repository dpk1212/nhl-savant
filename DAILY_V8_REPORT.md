# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-11 ET
**Completed Picks**: 1231 | **V8 Era Picks**: 669 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (65.9%) beats 5★ (49.3%) |
| Single-wallet dependency | ⚠️ | 33% of picks are single-wallet (WR: 56.3%, ROI: 6.9%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 58 | 48.3% | -1.70u | -2.9% | 14.04u | 10.8% | -1.06% | 0.36% |  |
| 7-Day | 128 | 53.9% | 4.90u | 3.8% | 24.14u | 8.9% | -0.59% | 1.12% |  |
| 14-Day | 229 | 52.4% | 1.02u | 0.4% | 29.58u | 6.3% | -0.50% | -0.19% |  |
| 30-Day | 440 | 52.0% | -7.67u | -1.7% | -5.61u | -0.6% | -0.21% | -0.44% |  |
| V8 Era | 669 | 51.3% | -15.50u | -2.3% | -3.38u | -0.3% | -0.18% | -0.41% |  |
| All Time | 1231 | 52.3% | -45.02u | -3.7% | -48.26u | -2.3% | -0.29% | -0.15% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=669)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 211 | 53.5% | 53.5% | 49.3% | -4.2% | -9.8% | -5.7% | 3.02 | -0.05% | Weak |
| 4.5 | 88 | 53.3% | 53.3% | 65.9% | +12.7% | 25.5% | 20.5% | 2.63 | -1.05% | Strong |
| 4 | 126 | 53.1% | 53.1% | 46.8% | -6.3% | -9.8% | -3.2% | 1.34 | -0.01% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 82 | 53.3% | 53.3% | 51.2% | -2.1% | -0.1% | -10.8% | 0.88 | 0.13% | Fair |
| 2.5 | 81 | 53.4% | 53.4% | 48.1% | -5.3% | -7.3% | -12.4% | 0.65 | -0.23% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.3% | 65.9% | -16.6% | INVERTED |
| 4.5★ vs 4★ | 65.9% | 46.8% | +19.1% | Correct |
| 4★ vs 3.5★ | 46.8% | 51.5% | -4.7% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 51.2% | +0.3% | Correct |
| 3★ vs 2.5★ | 51.2% | 48.1% | +3.1% | Correct |
| 2.5★ vs 2★ | 48.1% | 0.0% | +48.1% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.643 |
| Spearman: Stars vs Flat ROI | 0.476 |
| Spearman: Stars vs CLV | -0.524 |
| Brier Score | 0.2484 |
| Monotonicity Score | -0.14 |

### All Time (n=1231)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 224 | 53.8% | 53.8% | 49.6% | -4.3% | -9.8% | -6.1% | 3.00 | 0.00% | Weak |
| 4.5 | 122 | 54.5% | 54.5% | 61.5% | +7.0% | 14.9% | 10.4% | 2.63 | -0.41% | Strong |
| 4 | 241 | 54.5% | 54.5% | 50.2% | -4.3% | -6.7% | -3.5% | 1.71 | -0.33% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 242 | 54.5% | 54.5% | 49.6% | -4.9% | -8.6% | -10.8% | 1.10 | -0.32% | Weak |
| 2.5 | 188 | 54.0% | 54.0% | 52.1% | -1.9% | -3.5% | -3.5% | 0.70 | -0.55% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.6% | 61.5% | -11.9% | INVERTED |
| 4.5★ vs 4★ | 61.5% | 50.2% | +11.3% | Correct |
| 4★ vs 3.5★ | 50.2% | 56.5% | -6.3% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.6% | +6.9% | Correct |
| 3★ vs 2.5★ | 49.6% | 52.1% | -2.5% | Flat |
| 2.5★ vs 2★ | 52.1% | 0.0% | +52.1% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | -0.190 |
| Brier Score | 0.2388 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.126 | -0.032 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.182 | -0.126 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.084 | -0.053 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.158 | -0.061 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.050 | -0.005 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.017 | 0.022 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.149 | -0.047 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.190 | -0.089 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.010 | 0.046 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.160 | -0.086 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.024 | -0.004 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.208 | 0.114 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.217 | 0.122 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.185 | -0.098 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.40) | 110 | 55.5% | -0.2% | 3.2% | -0.07% |  |
| p20-40 (35.50–43.35) | 110 | 56.4% | 10.3% | 9.6% | -0.30% |  |
| p40-60 (43.42–48.47) | 110 | 50.9% | -4.3% | 0.1% | -0.49% |  |
| p60-80 (48.56–54.42) | 110 | 44.5% | -15.5% | -6.5% | 0.16% |  |
| p80-95 (54.47–62.20) | 110 | 50.9% | 3.9% | -3.5% | -0.05% |  |
| p95+ (62.35–83.30) | 111 | 48.6% | -8.9% | -9.7% | -0.32% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 248 | 48.4% | -8.2% | -5.8% | -0.45% |  |
| 0.90-1.05 | 228 | 48.2% | -8.7% | -8.5% | -0.01% |  |
| 1.05-1.20 | 129 | 62.8% | 23.2% | 28.4% | 0.05% |  |
| 1.20-1.35 | 36 | 50.0% | -7.7% | -16.1% | 0.16% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.27) | 93 | 49.5% | -7.5% | 0.2% | -0.30% |  |
| 20-40% (0.27–0.63) | 93 | 61.3% | 14.3% | 11.2% | 0.15% |  |
| 40-60% (0.63–0.91) | 93 | 50.5% | -5.1% | 7.0% | -0.97% |  |
| 60-80% (0.91–1.22) | 93 | 51.6% | 3.3% | -4.5% | 0.27% |  |
| 80-95% (1.23–1.69) | 93 | 43.0% | -14.8% | -11.2% | 0.04% |  |
| 95%+ (1.69–6.68) | 94 | 44.7% | -17.3% | -11.6% | 0.07% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 32 | 34.4% | -29.9% | -33.6% | 0.21% | Broad support |
| 0.25-0.40 | 111 | 46.8% | -8.0% | -9.7% | 0.23% | Healthy support |
| 0.40-0.60 | 171 | 47.4% | -9.6% | -0.1% | -0.34% | Concentrated |
| 0.60-0.80 | 118 | 59.3% | 10.5% | 10.5% | -0.23% | Very concentrated |
| 0.80-1.00 | 127 | 52.0% | -2.3% | -2.5% | -0.12% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 61 | 34.4% | -36.0% | -35.3% | -0.15% | 4.3 |
| Broad battle | 235 | 48.1% | -6.5% | -0.3% | 0.05% | 3.9 |
| One-wallet nuke | 237 | 54.4% | 3.0% | 4.0% | -0.27% | 3.8 |
| Thin support | 401 | 54.6% | 3.0% | 2.3% | -0.29% | 3.8 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=669)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 25 | 52.0% | -6.1% | 15.1% | 0.31% | 4.2 | 88.0% |
| SMALL_MOVE | 144 | 48.6% | -8.1% | -2.6% | -0.75% | 4.1 | 100.0% |
| CLEAR_MOVE | 135 | 54.8% | 1.2% | 4.2% | 0.15% | 4.1 | 100.0% |
| NEAR_START | 263 | 48.7% | -4.9% | -7.4% | 0.04% | 3.8 | 100.0% |

**All Time** (n=1231)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 542 | 53.7% | -5.2% | -3.6% | -0.46% | 3.3 | 5.5% |
| SMALL_MOVE | 147 | 48.3% | -8.7% | -4.1% | -0.69% | 4.1 | 98.0% |
| CLEAR_MOVE | 161 | 54.7% | 1.1% | 3.8% | 0.06% | 4.1 | 100.0% |
| NEAR_START | 279 | 48.7% | -5.3% | -7.7% | 0.06% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 13 / 61.5% / 7.1% | 72 / 51.4% / -7.0% | 67 / 58.2% / 4.5% | 106 / 50.0% / -3.6% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 47 / 51.1% / 0.7% | 39 / 46.2% / -14.5% | 71 / 53.5% / 8.8% |
| 2.5-3★ | 4 / 50.0% / -1.6% | 21 / 38.1% / -23.6% | 29 / 58.6% / 14.7% | 79 / 43.0% / -17.4% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 7 / 42.9% / -24.2% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 666 | 51.2% | -2.5% | -0.4% | 4.0 | -0.18% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 716 | 51.3% | -2.7% | -0.7% | 4.0 | -0.18% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1076 | 100% |
| LOCKED (direct) | 95 | 8.8% |
| Promoted (SHADOW→LOCKED) | 678 | 63.0% |
| Rejected (stayed SHADOW) | 182 | 16.9% |
| Superseded (side flipped) | 116 | 10.8% |
| Muted | 384 | 35.7% |
| Cancelled | 20 | 1.9% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=669)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -3.38u | -0.3% | — |
| Flat 1.0u | -15.50u | -2.3% | +12.12u |
| Lock units only | 8.43u | — | -11.81u |
| Units change only on star change | 12.83u | — | -16.21u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 211 | 3.02 | -9.8% | -5.7% | -15.40u | Sizing hurts |
| 4.5 | 88 | 2.63 | 25.5% | 20.5% | +25.16u | Sizing helps |
| 4 | 126 | 1.34 | -9.8% | -3.2% | +7.03u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 82 | 0.88 | -0.1% | -10.8% | -7.71u | Sizing hurts |
| 2.5 | 81 | 0.65 | -7.3% | -12.4% | -0.58u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |

### All Time (n=1231)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -48.26u | -2.3% | — |
| Flat 1.0u | -45.02u | -3.7% | -3.24u |
| Lock units only | -25.69u | — | -22.57u |
| Units change only on star change | -31.21u | — | -17.05u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 224 | 3.00 | -9.8% | -6.1% | -18.99u | Sizing hurts |
| 4.5 | 122 | 2.63 | 14.9% | 10.4% | +15.15u | Sizing helps |
| 4 | 241 | 1.71 | -6.7% | -3.5% | +1.78u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 242 | 1.10 | -8.6% | -10.8% | -7.85u | Sizing hurts |
| 2.5 | 188 | 0.70 | -3.5% | -3.5% | +2.13u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 669 | 53.2% | 51.3% | -1.9% | -2.3% | -0.18% | Neutral |
| 4.5-5★ | 299 | 53.5% | 54.2% | +0.7% | 0.5% | -0.35% | Neutral |
| 3.5-4★ | 194 | 52.5% | 48.5% | -4.0% | -4.7% | -0.03% | Below market |
| 2.5-3★ | 165 | 53.4% | 50.3% | -3.1% | -2.6% | -0.06% | Below market |
| CLEAR_MOVE only | 135 | 54.2% | 54.8% | +0.6% | 1.2% | 0.15% | Neutral |
| NO_MOVE only | 25 | 54.7% | 52.0% | -2.7% | -6.1% | 0.31% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=83)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.087 | 35.885 | 0.50 |  |
| Rank_norm | 58.309 | 60.269 | 0.09 |  |
| PnL_norm | 52.268 | 56.107 | 0.22 |  |
| WalletBase | 48.465 | 43.388 | 0.39 |  |
| SizeRatio | 1.396 | 1.062 | 0.25 |  |
| ConvictionMult | 0.961 | 0.931 | 0.19 |  |
| WalletCountFor | 2.912 | 2.373 | 0.29 |  |
| TopShare | 0.598 | 0.712 | 0.45 |  |
| ForSide | 145.961 | 106.911 | 0.35 |  |
| AgainstSide | 50.830 | 59.698 | 0.11 |  |
| NetEdge | 1.028 | 0.562 | 0.53 |  |
| WalletPlayScore | 0.986 | -0.206 | 0.50 |  |

### V8 Era (n=559)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.087 | 43.659 | 0.08 |  |
| Rank_norm | 58.309 | 62.876 | 0.21 |  |
| PnL_norm | 52.268 | 54.311 | 0.11 |  |
| WalletBase | 48.465 | 48.153 | 0.02 |  |
| SizeRatio | 1.396 | 1.408 | 0.01 |  |
| ConvictionMult | 0.961 | 0.967 | 0.04 |  |
| WalletCountFor | 2.912 | 2.912 | 0.00 |  |
| TopShare | 0.598 | 0.598 | 0.00 |  |
| ForSide | 145.961 | 145.961 | 0.00 |  |
| AgainstSide | 50.830 | 50.830 | 0.00 |  |
| NetEdge | 1.028 | 1.028 | 0.00 |  |
| WalletPlayScore | 0.986 | 0.986 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=669)

No major failure modes detected.

### 7-Day (n=128)

- **Odds issue**: Avg CLV -0.59% — consistently getting bad closing lines

### All Time (n=1231)

- **Sizing issue**: Model P/L (-48.26u) trails flat (-45.02u) by 3.24u
- **Environment issue**: 44.0% NO_MOVE (WR: 53.7%, ROI: -5.2%)


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
| V8 era picks | 669 |
| V8 flat ROI | -2.3% |
| V8 model ROI | -0.3% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | 0.5% |
| 2.5-3★ ROI | -2.6% |
| CLEAR_MOVE ROI | 1.2% |
| NO_MOVE ROI | -6.1% |
| Single-wallet play rate | 33.2% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.05% | 4.5★: -1.05% | 4★: -0.01% | 3.5★: -0.07% | 3★: 0.13% | 2.5★: -0.23% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=669)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 583 | 87.1% | 50.6% | -2.9% | -2.4% | -0.19% |
| MUTED | 75 | 11.2% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.6% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=128)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 128 | 100.0% | 53.9% | 3.8% | 8.9% | -0.59% |

### All Time (n=1231)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1143 | 92.9% | 52.0% | -4.3% | -3.7% | -0.30% |
| MUTED | 75 | 6.1% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.1% | 61.5% | 17.8% | 4.8% | -0.95% |

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
