# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-17 ET
**Completed Picks**: 1327 | **V8 Era Picks**: 765 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (61.3%) beats 5★ (48.9%) |
| Single-wallet dependency | ⚠️ | 36% of picks are single-wallet (WR: 54.0%, ROI: 2.9%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 51 | 49.0% | -5.21u | -10.2% | -7.85u | -8.6% | -0.46% | -0.79% |  |
| 7-Day | 121 | 50.4% | -5.55u | -4.6% | -11.21u | -4.9% | -0.24% | -2.01% |  |
| 14-Day | 243 | 53.5% | 4.11u | 1.7% | 23.81u | 5.0% | -0.44% | 0.18% |  |
| 30-Day | 486 | 52.1% | -10.28u | -2.1% | 3.90u | 0.4% | -0.28% | -0.45% |  |
| V8 Era | 765 | 51.4% | -18.50u | -2.4% | -4.53u | -0.3% | -0.18% | -0.43% |  |
| All Time | 1327 | 52.3% | -48.01u | -3.6% | -49.41u | -2.2% | -0.29% | -0.17% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=765)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 229 | 53.5% | 53.5% | 48.9% | -4.6% | -10.0% | -5.1% | 3.10 | -0.04% | Weak |
| 4.5 | 111 | 53.4% | 53.4% | 61.3% | +7.9% | 16.0% | 13.5% | 2.66 | -0.88% | Strong |
| 4 | 154 | 53.0% | 53.0% | 48.1% | -4.9% | -7.8% | -2.5% | 1.28 | -0.12% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 95 | 53.6% | 53.6% | 52.6% | -0.9% | 0.6% | -2.5% | 0.83 | 0.09% | Fair |
| 2.5 | 94 | 53.6% | 53.6% | 50.0% | -3.6% | -4.4% | -11.1% | 0.59 | -0.19% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 48.9% | 61.3% | -12.4% | INVERTED |
| 4.5★ vs 4★ | 61.3% | 48.1% | +13.2% | Correct |
| 4★ vs 3.5★ | 48.1% | 51.5% | -3.4% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 52.6% | -1.1% | Flat |
| 3★ vs 2.5★ | 52.6% | 50.0% | +2.6% | Correct |
| 2.5★ vs 2★ | 50.0% | 0.0% | +50.0% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.167 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.500 |
| Brier Score | 0.2478 |
| Monotonicity Score | 0.14 |

### All Time (n=1327)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 242 | 53.8% | 53.8% | 49.2% | -4.6% | -9.9% | -5.5% | 3.07 | 0.01% | Weak |
| 4.5 | 145 | 54.4% | 54.4% | 58.6% | +4.3% | 9.4% | 6.7% | 2.65 | -0.38% | Strong |
| 4 | 269 | 54.3% | 54.3% | 50.6% | -3.7% | -5.8% | -3.1% | 1.64 | -0.36% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 255 | 54.6% | 54.6% | 50.2% | -4.4% | -7.9% | -8.4% | 1.06 | -0.31% | Weak |
| 2.5 | 201 | 54.1% | 54.1% | 52.7% | -1.3% | -2.4% | -3.1% | 0.67 | -0.51% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.2% | 58.6% | -9.4% | INVERTED |
| 4.5★ vs 4★ | 58.6% | 50.6% | +8.0% | Correct |
| 4★ vs 3.5★ | 50.6% | 56.5% | -5.9% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.2% | +6.3% | Correct |
| 3★ vs 2.5★ | 50.2% | 52.7% | -2.5% | Flat |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.333 |
| Spearman: Stars vs Flat ROI | 0.262 |
| Spearman: Stars vs CLV | -0.190 |
| Brier Score | 0.2391 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.091 | -0.014 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.178 | -0.117 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.087 | -0.050 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.131 | -0.042 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.067 | -0.020 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.039 | 0.006 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.137 | -0.040 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.179 | -0.084 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.006 | 0.031 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.142 | -0.076 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.021 | -0.006 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.193 | 0.110 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.197 | 0.116 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.166 | -0.090 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–34.97) | 126 | 50.8% | -8.6% | -4.7% | -0.08% |  |
| p20-40 (35.00–42.10) | 126 | 59.5% | 14.0% | 15.7% | -0.41% |  |
| p40-60 (42.25–47.70) | 126 | 50.0% | -5.2% | -0.9% | -0.37% |  |
| p60-80 (47.71–53.40) | 126 | 46.0% | -12.9% | -8.6% | 0.12% |  |
| p80-95 (53.47–61.33) | 126 | 49.2% | -0.8% | -7.6% | -0.06% |  |
| p95+ (61.37–83.30) | 127 | 52.0% | -1.9% | -0.1% | -0.31% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 299 | 48.2% | -8.7% | -8.5% | -0.40% |  |
| 0.90-1.05 | 257 | 49.0% | -7.7% | -5.3% | -0.06% |  |
| 1.05-1.20 | 139 | 63.3% | 23.5% | 30.1% | 0.02% |  |
| 1.20-1.35 | 38 | 47.4% | -12.6% | -18.7% | 0.17% |  |
| 1.35-1.50 | 12 | 41.7% | -22.6% | -40.2% | -0.33% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.21) | 103 | 48.5% | -8.4% | -3.0% | -0.33% |  |
| 20-40% (0.22–0.58) | 104 | 59.6% | 9.9% | 16.8% | 0.09% |  |
| 40-60% (0.58–0.86) | 103 | 50.5% | -5.2% | 4.6% | -0.58% |  |
| 60-80% (0.87–1.19) | 104 | 53.8% | 5.2% | -4.3% | 0.09% |  |
| 80-95% (1.19–1.65) | 103 | 46.6% | -9.0% | -3.8% | 0.04% |  |
| 95%+ (1.66–6.68) | 104 | 45.2% | -16.1% | -9.5% | 0.00% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 34 | 35.3% | -29.3% | -30.3% | 0.23% | Broad support |
| 0.25-0.40 | 121 | 47.9% | -6.7% | -5.6% | 0.15% | Healthy support |
| 0.40-0.60 | 187 | 48.7% | -7.7% | 0.1% | -0.25% | Concentrated |
| 0.60-0.80 | 128 | 60.2% | 11.3% | 12.0% | -0.20% | Very concentrated |
| 0.80-1.00 | 151 | 51.0% | -4.2% | -0.7% | -0.15% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 69 | 37.7% | -30.4% | -31.8% | -0.18% | 4.2 |
| Broad battle | 253 | 48.6% | -6.0% | 0.0% | 0.06% | 3.9 |
| One-wallet nuke | 295 | 52.5% | -0.1% | 0.2% | -0.31% | 3.9 |
| Thin support | 477 | 53.9% | 1.6% | 0.8% | -0.28% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=765)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 28 | 53.6% | -2.8% | 23.3% | 0.20% | 4.2 | 89.3% |
| SMALL_MOVE | 161 | 50.3% | -5.6% | -0.1% | -0.59% | 4.1 | 100.0% |
| CLEAR_MOVE | 138 | 54.3% | 0.1% | 2.8% | 0.18% | 4.1 | 100.0% |
| NEAR_START | 302 | 49.3% | -4.6% | -4.8% | -0.01% | 3.8 | 100.0% |

**All Time** (n=1327)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 545 | 53.8% | -5.0% | -3.0% | -0.47% | 3.3 | 6.1% |
| SMALL_MOVE | 164 | 50.0% | -6.1% | -1.6% | -0.54% | 4.1 | 98.2% |
| CLEAR_MOVE | 164 | 54.3% | 0.1% | 2.6% | 0.09% | 4.1 | 100.0% |
| NEAR_START | 318 | 49.4% | -5.0% | -5.2% | 0.00% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 76 / 50.0% / -9.4% | 68 / 57.4% / 2.9% | 118 / 50.0% / -4.1% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 53 / 56.6% / 9.2% | 41 / 46.3% / -15.0% | 81 / 51.9% / 4.6% |
| 2.5-3★ | 5 / 60.0% / 13.9% | 28 / 42.9% / -16.9% | 29 / 58.6% / 14.7% | 95 / 46.3% / -12.8% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 762 | 51.3% | -2.6% | -0.5% | 4.0 | -0.19% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 812 | 51.4% | -2.7% | -0.7% | 4.0 | -0.18% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1267 | 100% |
| LOCKED (direct) | 98 | 7.7% |
| Promoted (SHADOW→LOCKED) | 822 | 64.9% |
| Rejected (stayed SHADOW) | 191 | 15.1% |
| Superseded (side flipped) | 151 | 11.9% |
| Muted | 450 | 35.5% |
| Cancelled | 20 | 1.6% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=765)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -4.53u | -0.3% | — |
| Flat 1.0u | -18.50u | -2.4% | +13.97u |
| Lock units only | -9.37u | — | +4.84u |
| Units change only on star change | -4.97u | — | +0.44u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 229 | 3.10 | -10.0% | -5.1% | -13.33u | Sizing hurts |
| 4.5 | 111 | 2.66 | 16.0% | 13.5% | +22.14u | Sizing helps |
| 4 | 154 | 1.28 | -7.8% | -2.5% | +7.09u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 95 | 0.83 | 0.6% | -2.5% | -2.54u | Sizing hurts |
| 2.5 | 94 | 0.59 | -4.4% | -11.1% | -2.03u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |

### All Time (n=1327)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -49.41u | -2.2% | — |
| Flat 1.0u | -48.01u | -3.6% | -1.40u |
| Lock units only | -43.49u | — | -5.92u |
| Units change only on star change | -49.01u | — | -0.40u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 242 | 3.07 | -9.9% | -5.5% | -16.92u | Sizing hurts |
| 4.5 | 145 | 2.65 | 9.4% | 6.7% | +12.12u | Sizing helps |
| 4 | 269 | 1.64 | -5.8% | -3.1% | +1.85u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 255 | 1.06 | -7.9% | -8.4% | -2.69u | Sizing hurts |
| 2.5 | 201 | 0.67 | -2.4% | -3.1% | +0.68u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 765 | 53.2% | 51.4% | -1.8% | -2.4% | -0.18% | Neutral |
| 4.5-5★ | 340 | 53.5% | 52.9% | -0.5% | -1.5% | -0.32% | Neutral |
| 3.5-4★ | 222 | 52.4% | 49.1% | -3.3% | -4.0% | -0.10% | Below market |
| 2.5-3★ | 191 | 53.6% | 51.8% | -1.8% | -1.0% | -0.05% | Neutral |
| CLEAR_MOVE only | 138 | 54.2% | 54.3% | +0.1% | 0.1% | 0.18% | Neutral |
| NO_MOVE only | 28 | 54.6% | 53.6% | -1.0% | -2.8% | 0.20% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=76)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.026 | 40.860 | 0.22 |  |
| Rank_norm | 55.763 | 48.216 | 0.32 |  |
| PnL_norm | 50.794 | 47.578 | 0.17 |  |
| WalletBase | 47.815 | 43.401 | 0.34 |  |
| SizeRatio | 1.357 | 1.143 | 0.16 |  |
| ConvictionMult | 0.952 | 0.918 | 0.21 |  |
| WalletCountFor | 2.853 | 2.342 | 0.28 |  |
| TopShare | 0.606 | 0.694 | 0.34 |  |
| ForSide | 140.994 | 97.120 | 0.40 |  |
| AgainstSide | 50.019 | 52.024 | 0.03 |  |
| NetEdge | 0.985 | 0.529 | 0.53 |  |
| WalletPlayScore | 0.885 | -0.155 | 0.44 |  |

### V8 Era (n=621)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.026 | 43.287 | 0.09 |  |
| Rank_norm | 55.763 | 61.391 | 0.24 |  |
| PnL_norm | 50.794 | 53.521 | 0.15 |  |
| WalletBase | 47.815 | 47.612 | 0.02 |  |
| SizeRatio | 1.357 | 1.383 | 0.02 |  |
| ConvictionMult | 0.952 | 0.962 | 0.06 |  |
| WalletCountFor | 2.853 | 2.853 | 0.00 |  |
| TopShare | 0.606 | 0.606 | 0.00 |  |
| ForSide | 140.994 | 140.994 | 0.00 |  |
| AgainstSide | 50.019 | 50.019 | 0.00 |  |
| NetEdge | 0.985 | 0.985 | 0.00 |  |
| WalletPlayScore | 0.885 | 0.885 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=765)

No major failure modes detected.

### 7-Day (n=121)

- **Ranking issue**: ≤3★ WR (59%) beats ≥4★ (47%)
- **Sizing issue**: Model P/L (-11.21u) trails flat (-5.55u) by 5.66u

### All Time (n=1327)

- **Sizing issue**: Model P/L (-49.41u) trails flat (-48.01u) by 1.40u
- **Environment issue**: 41.1% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 765 |
| V8 flat ROI | -2.4% |
| V8 model ROI | -0.3% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -1.5% |
| 2.5-3★ ROI | -1.0% |
| CLEAR_MOVE ROI | 0.1% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 36.3% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.04% | 4.5★: -0.88% | 4★: -0.12% | 3.5★: -0.07% | 3★: 0.09% | 2.5★: -0.19% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=765)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 679 | 88.8% | 50.8% | -2.9% | -2.1% | -0.20% |
| MUTED | 75 | 9.8% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.4% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=121)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 121 | 100.0% | 50.4% | -4.6% | -4.9% | -0.24% |

### All Time (n=1327)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1239 | 93.4% | 52.0% | -4.2% | -3.5% | -0.29% |
| MUTED | 75 | 5.7% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 1.0% | 61.5% | 17.8% | 4.8% | -0.95% |

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
