# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-09 ET
**Completed Picks**: 1185 | **V8 Era Picks**: 623 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (66.7%) beats 5★ (48.7%) |
| Single-wallet dependency | ⚠️ | 30% of picks are single-wallet (WR: 56.9%, ROI: 7.2%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 51 | 56.9% | 3.56u | 7.0% | 11.82u | 10.6% | -0.17% | 3.23% | Strong |
| 7-Day | 111 | 56.8% | 8.50u | 7.7% | 22.89u | 10.2% | -0.26% | 0.48% | Strong |
| 14-Day | 222 | 54.5% | 4.89u | 2.2% | 31.74u | 7.2% | -0.30% | -0.47% |  |
| 30-Day | 414 | 52.9% | -3.46u | -0.8% | -5.12u | -0.6% | -0.10% | -0.51% |  |
| V8 Era | 623 | 51.7% | -12.23u | -2.0% | -7.40u | -0.7% | -0.10% | -0.45% |  |
| All Time | 1185 | 52.6% | -41.74u | -3.5% | -52.28u | -2.6% | -0.25% | -0.16% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=623)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 199 | 53.6% | 53.6% | 48.7% | -4.9% | -11.2% | -7.0% | 2.91 | -0.05% | Weak |
| 4.5 | 78 | 53.6% | 53.6% | 66.7% | +13.0% | 25.2% | 21.2% | 2.62 | -0.51% | Strong |
| 4 | 112 | 53.2% | 53.2% | 49.1% | -4.1% | -6.6% | -0.8% | 1.39 | 0.02% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 78 | 53.3% | 53.3% | 51.3% | -2.1% | 0.2% | -10.9% | 0.90 | 0.15% | Fair |
| 2.5 | 75 | 53.5% | 53.5% | 49.3% | -4.2% | -4.9% | -12.1% | 0.68 | -0.24% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.7% | 66.7% | -18.0% | INVERTED |
| 4.5★ vs 4★ | 66.7% | 49.1% | +17.6% | Correct |
| 4★ vs 3.5★ | 49.1% | 51.5% | -2.4% | Flat |
| 3.5★ vs 3★ | 51.5% | 51.3% | +0.2% | Correct |
| 3★ vs 2.5★ | 51.3% | 49.3% | +2.0% | Correct |
| 2.5★ vs 2★ | 49.3% | 0.0% | +49.3% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.476 |
| Spearman: Stars vs Flat ROI | 0.476 |
| Spearman: Stars vs CLV | -0.405 |
| Brier Score | 0.2469 |
| Monotonicity Score | -0.14 |

### All Time (n=1185)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 212 | 53.9% | 53.9% | 49.1% | -4.9% | -11.0% | -7.4% | 2.89 | 0.00% | Weak |
| 4.5 | 112 | 54.9% | 54.9% | 61.6% | +6.7% | 13.8% | 9.9% | 2.62 | 0.05% | Strong |
| 4 | 227 | 54.6% | 54.6% | 51.5% | -3.1% | -4.9% | -2.5% | 1.76 | -0.33% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 238 | 54.6% | 54.6% | 49.6% | -5.0% | -8.7% | -10.9% | 1.11 | -0.32% | Weak |
| 2.5 | 182 | 54.1% | 54.1% | 52.7% | -1.3% | -2.4% | -3.3% | 0.71 | -0.57% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 9 | 54.3% | 54.3% | 44.4% | -9.9% | -19.3% | 14.3% | 0.53 | -0.01% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.1% | 61.6% | -12.5% | INVERTED |
| 4.5★ vs 4★ | 61.6% | 51.5% | +10.1% | Correct |
| 4★ vs 3.5★ | 51.5% | 56.5% | -5.0% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.6% | +6.9% | Correct |
| 3★ vs 2.5★ | 49.6% | 52.7% | -3.1% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |
| 2★ vs 1★ | 0.0% | 44.4% | -44.4% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.500 |
| Spearman: Stars vs CLV | 0.071 |
| Brier Score | 0.2377 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.166 | -0.058 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.167 | -0.113 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.056 | -0.030 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.181 | -0.074 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.038 | 0.006 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.003 | 0.035 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.159 | -0.050 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.203 | -0.089 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.008 | 0.046 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.173 | -0.089 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.028 | -0.001 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.217 | 0.114 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.227 | 0.123 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.198 | -0.100 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.20) | 102 | 55.9% | 0.1% | 1.7% | -0.02% |  |
| p20-40 (35.20–43.60) | 103 | 57.3% | 10.1% | 8.4% | 0.07% |  |
| p40-60 (43.60–48.97) | 102 | 56.9% | 5.7% | 9.9% | -0.40% |  |
| p60-80 (48.98–54.75) | 103 | 41.7% | -15.8% | -12.8% | 0.07% |  |
| p80-95 (54.75–62.63) | 102 | 51.0% | 0.2% | -1.7% | 0.03% |  |
| p95+ (62.70–83.30) | 103 | 46.6% | -13.0% | -19.3% | -0.36% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 223 | 48.9% | -8.2% | -5.1% | -0.28% |  |
| 0.90-1.05 | 211 | 48.3% | -9.0% | -10.6% | 0.00% |  |
| 1.05-1.20 | 126 | 62.7% | 23.1% | 27.2% | 0.06% |  |
| 1.20-1.35 | 35 | 51.4% | -5.1% | -15.9% | 0.21% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.30) | 89 | 53.9% | -0.8% | 9.6% | -0.24% |  |
| 20-40% (0.30–0.66) | 89 | 61.8% | 14.8% | 13.6% | -0.17% |  |
| 40-60% (0.67–0.93) | 89 | 47.2% | -12.3% | 1.3% | -0.26% |  |
| 60-80% (0.93–1.24) | 89 | 56.2% | 12.3% | -0.6% | 0.29% |  |
| 80-95% (1.24–1.70) | 89 | 42.7% | -15.9% | -7.7% | 0.08% |  |
| 95%+ (1.72–6.68) | 89 | 44.9% | -16.6% | -13.1% | 0.07% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 30 | 33.3% | -31.6% | -33.1% | 0.26% | Broad support |
| 0.25-0.40 | 107 | 48.6% | -4.6% | -8.5% | 0.25% | Healthy support |
| 0.40-0.60 | 166 | 48.2% | -8.8% | 2.7% | -0.09% | Concentrated |
| 0.60-0.80 | 117 | 59.0% | 9.8% | 9.2% | -0.21% | Very concentrated |
| 0.80-1.00 | 114 | 54.4% | 1.0% | 2.6% | -0.14% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 59 | 35.6% | -33.8% | -34.5% | -0.14% | 4.3 |
| Broad battle | 227 | 48.5% | -5.8% | -0.3% | 0.06% | 3.9 |
| One-wallet nuke | 203 | 54.7% | 2.6% | 0.9% | -0.27% | 3.7 |
| Thin support | 362 | 55.0% | 2.8% | 1.3% | -0.17% | 3.8 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=623)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 23 | 56.5% | 2.1% | 28.7% | 0.34% | 4.3 | 87.0% |
| SMALL_MOVE | 133 | 48.1% | -11.1% | -0.4% | -0.44% | 4.1 | 100.0% |
| CLEAR_MOVE | 134 | 55.2% | 2.0% | 6.2% | 0.15% | 4.1 | 100.0% |
| NEAR_START | 252 | 50.4% | -1.5% | -7.1% | 0.04% | 3.8 | 100.0% |

**All Time** (n=1185)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 540 | 53.9% | -4.9% | -3.0% | -0.47% | 3.3 | 5.2% |
| SMALL_MOVE | 136 | 47.8% | -11.6% | -2.1% | -0.38% | 4.1 | 97.8% |
| CLEAR_MOVE | 160 | 55.0% | 1.7% | 5.5% | 0.06% | 4.1 | 100.0% |
| NEAR_START | 268 | 50.4% | -2.2% | -7.4% | 0.05% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 12 / 66.7% / 16.0% | 66 / 53.0% / -6.2% | 66 / 59.1% / 6.1% | 105 / 49.5% / -4.5% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 44 / 47.7% / -8.6% | 39 / 46.2% / -14.5% | 64 / 59.4% / 20.7% |
| 2.5-3★ | 3 / 66.7% / 31.2% | 19 / 36.8% / -25.7% | 29 / 58.6% / 14.7% | 76 / 44.7% / -14.1% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 7 / 42.9% / -24.2% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 620 | 51.6% | -2.1% | -0.8% | 4.0 | -0.10% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 670 | 51.6% | -2.4% | -1.1% | 4.0 | -0.10% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1018 | 100% |
| LOCKED (direct) | 90 | 8.8% |
| Promoted (SHADOW→LOCKED) | 633 | 62.2% |
| Rejected (stayed SHADOW) | 178 | 17.5% |
| Superseded (side flipped) | 112 | 11.0% |
| Muted | 373 | 36.6% |
| Cancelled | 20 | 2.0% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=623)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -7.40u | -0.7% | — |
| Flat 1.0u | -12.23u | -2.0% | +4.83u |
| Lock units only | 4.33u | — | -11.73u |
| Units change only on star change | 8.74u | — | -16.14u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 199 | 2.91 | -11.2% | -7.0% | -18.35u | Sizing hurts |
| 4.5 | 78 | 2.62 | 25.2% | 21.2% | +23.70u | Sizing helps |
| 4 | 112 | 1.39 | -6.6% | -0.8% | +6.17u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 78 | 0.90 | 0.2% | -10.9% | -7.82u | Sizing hurts |
| 2.5 | 75 | 0.68 | -4.9% | -12.1% | -2.50u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |

### All Time (n=1185)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -52.28u | -2.6% | — |
| Flat 1.0u | -41.74u | -3.5% | -10.54u |
| Lock units only | -29.78u | — | -22.50u |
| Units change only on star change | -35.30u | — | -16.98u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 212 | 2.89 | -11.0% | -7.4% | -21.94u | Sizing hurts |
| 4.5 | 112 | 2.62 | 13.8% | 9.9% | +13.69u | Sizing helps |
| 4 | 227 | 1.76 | -4.9% | -2.5% | +0.93u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 238 | 1.11 | -8.7% | -10.9% | -7.96u | Sizing hurts |
| 2.5 | 182 | 0.71 | -2.4% | -3.3% | +0.21u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 9 | 0.53 | -19.3% | 14.3% | +2.42u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 623 | 53.3% | 51.7% | -1.6% | -2.0% | -0.10% | Neutral |
| 4.5-5★ | 277 | 53.6% | 53.8% | +0.2% | -0.9% | -0.18% | Neutral |
| 3.5-4★ | 180 | 52.5% | 50.0% | -2.5% | -2.3% | -0.02% | Below market |
| 2.5-3★ | 155 | 53.4% | 51.0% | -2.5% | -1.2% | -0.05% | Below market |
| CLEAR_MOVE only | 134 | 54.2% | 55.2% | +1.0% | 2.0% | 0.15% | Neutral |
| NO_MOVE only | 23 | 54.8% | 56.5% | +1.7% | 2.1% | 0.34% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=81)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.873 | 31.211 | 0.76 |  |
| Rank_norm | 59.969 | 61.944 | 0.10 |  |
| PnL_norm | 52.969 | 56.472 | 0.20 |  |
| WalletBase | 48.647 | 40.959 | 0.58 |  |
| SizeRatio | 1.429 | 1.165 | 0.20 |  |
| ConvictionMult | 0.966 | 0.938 | 0.17 |  |
| WalletCountFor | 2.940 | 2.395 | 0.30 |  |
| TopShare | 0.592 | 0.713 | 0.49 |  |
| ForSide | 148.371 | 109.393 | 0.35 |  |
| AgainstSide | 50.168 | 54.804 | 0.06 |  |
| NetEdge | 1.057 | 0.628 | 0.50 |  |
| WalletPlayScore | 1.054 | -0.140 | 0.51 |  |

### V8 Era (n=534)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.873 | 43.775 | 0.06 |  |
| Rank_norm | 59.969 | 63.393 | 0.17 |  |
| PnL_norm | 52.969 | 54.195 | 0.07 |  |
| WalletBase | 48.647 | 48.263 | 0.03 |  |
| SizeRatio | 1.429 | 1.432 | 0.00 |  |
| ConvictionMult | 0.966 | 0.970 | 0.03 |  |
| WalletCountFor | 2.940 | 2.940 | 0.00 |  |
| TopShare | 0.592 | 0.592 | 0.00 |  |
| ForSide | 148.371 | 148.371 | 0.00 |  |
| AgainstSide | 50.168 | 50.168 | 0.00 |  |
| NetEdge | 1.057 | 1.057 | 0.00 |  |
| WalletPlayScore | 1.054 | 1.054 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=623)

No major failure modes detected.

### 7-Day (n=111)

No major failure modes detected.

### All Time (n=1185)

- **Sizing issue**: Model P/L (-52.28u) trails flat (-41.74u) by 10.54u
- **Environment issue**: 45.6% NO_MOVE (WR: 53.9%, ROI: -4.9%)


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
| V8 era picks | 623 |
| V8 flat ROI | -2.0% |
| V8 model ROI | -0.7% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | -0.9% |
| 2.5-3★ ROI | -1.2% |
| CLEAR_MOVE ROI | 2.0% |
| NO_MOVE ROI | 2.1% |
| Single-wallet play rate | 30.2% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.05% | 4.5★: -0.51% | 4★: 0.02% | 3.5★: -0.07% | 3★: 0.15% | 2.5★: -0.24% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=623)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 537 | 86.2% | 51.0% | -2.5% | -3.0% | -0.10% |
| MUTED | 75 | 12.0% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.8% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=111)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 111 | 100.0% | 56.8% | 7.7% | 10.2% | -0.26% |

### All Time (n=1185)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1097 | 92.6% | 52.2% | -4.2% | -4.2% | -0.25% |
| MUTED | 75 | 6.3% | 56.0% | 2.2% | 20.8% | -0.11% |
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
