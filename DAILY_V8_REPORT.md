# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-28 ET
**Completed Picks**: 1551 | **V8 Era Picks**: 989 | **V8 Since**: 2026-04-18
**Universe**: All locked picks across ML, Spread, Total markets

## Executive Summary

- **Overall**: NEEDS ATTENTION
- **Ranking health**: BROKEN
- **Sizing health**: HEALTHY
- **Environment health**: HEALTHY
- **Most important takeaway**: Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.

---

## 1. Intervention Triggers

| Trigger | Status | Detail |
|---|---|---|
| Star inversion | ⚠️ | 4.5★ WR (55.6%) beats 5★ (50.2%) |
| Single-wallet dependency | ⚠️ | 43% of picks are single-wallet (WR: 52.8%, ROI: 0.1%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 58 | 50.0% | -9.44u | -16.3% | -3.89u | -3.9% | -0.79% | 2.24% |  |
| 7-Day | 156 | 48.7% | -18.62u | -11.9% | -4.51u | -1.6% | 0.03% | 1.12% |  |
| 14-Day | 275 | 49.8% | -25.00u | -9.1% | -6.28u | -1.2% | -0.11% | 0.34% |  |
| 30-Day | 541 | 51.4% | -21.32u | -3.9% | 28.23u | 2.7% | -0.28% | -0.05% |  |
| V8 Era | 989 | 51.1% | -38.29u | -3.9% | -2.96u | -0.2% | -0.15% | -0.34% |  |
| All Time | 1551 | 52.0% | -67.80u | -4.4% | -47.84u | -1.8% | -0.25% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=989)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 277 | 53.7% | 53.7% | 50.2% | -3.6% | -8.6% | -4.1% | 3.22 | -0.19% | Weak |
| 4.5 | 187 | 52.4% | 52.4% | 55.6% | +3.2% | 4.9% | 9.6% | 2.58 | -0.23% | Fair |
| 4 | 186 | 52.4% | 52.4% | 47.3% | -5.1% | -9.6% | -1.7% | 1.22 | -0.41% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 119 | 52.4% | 52.4% | 50.4% | -2.0% | -3.7% | -4.4% | 0.76 | 0.68% | Fair |
| 2.5 | 133 | 53.5% | 53.5% | 51.1% | -2.3% | -4.0% | -16.8% | 0.49 | -0.41% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.2% | 55.6% | -5.4% | INVERTED |
| 4.5★ vs 4★ | 55.6% | 47.3% | +8.3% | Correct |
| 4★ vs 3.5★ | 47.3% | 51.5% | -4.2% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 50.4% | +1.1% | Correct |
| 3★ vs 2.5★ | 50.4% | 51.1% | -0.7% | Flat |
| 2.5★ vs 2★ | 51.1% | 0.0% | +51.1% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.143 |
| Spearman: Stars vs Flat ROI | -0.119 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2416 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1551)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 290 | 54.0% | 54.0% | 50.3% | -3.6% | -8.6% | -4.4% | 3.20 | -0.14% | Weak |
| 4.5 | 221 | 53.2% | 53.2% | 54.8% | +1.6% | 2.3% | 5.6% | 2.59 | 0.01% | Fair |
| 4 | 301 | 53.8% | 53.8% | 49.8% | -4.0% | -7.2% | -2.7% | 1.57 | -0.52% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 279 | 54.0% | 54.0% | 49.5% | -4.5% | -9.0% | -8.8% | 1.02 | 0.02% | Weak |
| 2.5 | 240 | 53.9% | 53.9% | 52.9% | -1.0% | -2.5% | -6.2% | 0.60 | -0.58% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.3% | 54.8% | -4.5% | INVERTED |
| 4.5★ vs 4★ | 54.8% | 49.8% | +5.0% | Correct |
| 4★ vs 3.5★ | 49.8% | 56.5% | -6.7% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.5% | +7.0% | Correct |
| 3★ vs 2.5★ | 49.5% | 52.9% | -3.4% | INVERTED |
| 2.5★ vs 2★ | 52.9% | 0.0% | +52.9% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.048 |
| Spearman: Stars vs Flat ROI | -0.048 |
| Spearman: Stars vs CLV | -0.429 |
| Brier Score | 0.2364 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.081 | -0.012 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.158 | -0.102 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.091 | -0.047 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.122 | -0.034 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.067 | -0.015 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.043 | 0.008 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.130 | -0.034 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.170 | -0.089 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.002 | 0.036 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.135 | -0.082 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.006 | -0.012 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.170 | 0.108 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.172 | 0.113 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.146 | -0.092 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.60–33.50) | 163 | 46.0% | -16.9% | -4.6% | -0.38% |  |
| p20-40 (33.57–39.36) | 164 | 55.5% | 2.3% | 8.2% | -0.06% |  |
| p40-60 (39.47–44.92) | 163 | 55.8% | 7.6% | -1.2% | -0.60% |  |
| p60-80 (44.93–51.05) | 164 | 50.6% | -6.3% | 5.9% | -0.23% |  |
| p80-95 (51.22–58.60) | 163 | 50.3% | -0.3% | -2.9% | 0.58% |  |
| p95+ (58.60–83.30) | 164 | 47.6% | -10.3% | -9.2% | -0.22% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 429 | 49.0% | -8.2% | -3.0% | -0.47% |  |
| 0.90-1.05 | 315 | 48.6% | -9.5% | -7.2% | 0.09% |  |
| 1.05-1.20 | 163 | 63.8% | 23.5% | 28.3% | -0.07% |  |
| 1.20-1.35 | 45 | 44.4% | -18.5% | -23.2% | 1.21% |  |
| 1.35-1.50 | 13 | 38.5% | -28.6% | -47.4% | -0.54% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.19) | 122 | 48.4% | -7.8% | -2.6% | -0.37% |  |
| 20-40% (0.19–0.52) | 122 | 58.2% | 6.6% | 11.0% | -0.14% |  |
| 40-60% (0.52–0.80) | 122 | 53.3% | -0.9% | 7.6% | -0.04% |  |
| 60-80% (0.80–1.12) | 122 | 50.0% | -3.9% | -6.9% | -0.07% |  |
| 80-95% (1.12–1.60) | 122 | 46.7% | -10.1% | -4.0% | -0.11% |  |
| 95%+ (1.60–6.68) | 123 | 48.0% | -12.0% | -7.5% | 0.02% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 38 | 36.8% | -28.5% | -28.4% | 0.34% | Broad support |
| 0.25-0.40 | 140 | 48.6% | -7.4% | -2.8% | 0.07% | Healthy support |
| 0.40-0.60 | 228 | 49.6% | -7.0% | -0.5% | -0.37% | Concentrated |
| 0.60-0.80 | 142 | 57.7% | 6.3% | 7.3% | -0.17% | Very concentrated |
| 0.80-1.00 | 185 | 51.4% | -3.2% | 0.4% | 0.01% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 82 | 39.0% | -31.1% | -31.2% | -0.24% | 4.2 |
| Broad battle | 299 | 49.2% | -5.9% | 1.6% | 0.01% | 3.8 |
| One-wallet nuke | 441 | 51.7% | -2.3% | 1.1% | -0.14% | 4.0 |
| Thin support | 653 | 52.7% | -0.9% | 0.5% | -0.15% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=989)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 34 | 52.9% | -6.2% | 26.7% | 1.08% | 4.0 | 91.2% |
| SMALL_MOVE | 189 | 50.3% | -6.4% | 0.1% | -0.54% | 4.1 | 100.0% |
| CLEAR_MOVE | 147 | 53.7% | -1.4% | 2.8% | 0.08% | 4.1 | 100.0% |
| NEAR_START | 371 | 49.9% | -4.7% | -5.4% | -0.08% | 3.8 | 100.0% |

**All Time** (n=1551)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 551 | 53.7% | -5.2% | -2.6% | -0.39% | 3.3 | 7.1% |
| SMALL_MOVE | 192 | 50.0% | -6.8% | -1.2% | -0.50% | 4.1 | 98.4% |
| CLEAR_MOVE | 173 | 53.8% | -1.1% | 2.6% | 0.01% | 4.1 | 100.0% |
| NEAR_START | 387 | 49.9% | -5.0% | -5.7% | -0.07% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 16 / 62.5% / 5.6% | 94 / 51.1% / -7.6% | 73 / 57.5% / 2.8% | 143 / 50.3% / -5.2% |
| 3.5-4★ | 10 / 30.0% / -43.7% | 55 / 56.4% / 8.7% | 43 / 44.2% / -19.0% | 94 / 52.1% / 4.5% |
| 2.5-3★ | 7 / 57.1% / 11.2% | 35 / 40.0% / -23.8% | 31 / 58.1% / 13.3% | 123 / 47.2% / -11.1% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 5 / 40.0% / -25.6% | — | 11 / 54.5% / -3.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 986 | 51.0% | -4.0% | -0.3% | 4.0 | -0.15% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1036 | 51.1% | -4.1% | -0.5% | 4.0 | -0.15% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1641 | 100% |
| LOCKED (direct) | 104 | 6.3% |
| Promoted (SHADOW→LOCKED) | 1092 | 66.5% |
| Rejected (stayed SHADOW) | 203 | 12.4% |
| Superseded (side flipped) | 237 | 14.4% |
| Muted | 573 | 34.9% |
| Cancelled | 20 | 1.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=989)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -2.96u | -0.2% | — |
| Flat 1.0u | -38.29u | -3.9% | +35.33u |
| Lock units only | -31.26u | — | +28.30u |
| Units change only on star change | -26.85u | — | +23.89u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 277 | 3.22 | -8.6% | -4.1% | -12.39u | Sizing hurts |
| 4.5 | 187 | 2.58 | 4.9% | 9.6% | +37.29u | Sizing helps |
| 4 | 186 | 1.22 | -9.6% | -1.7% | +14.11u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 119 | 0.76 | -3.7% | -4.4% | +0.40u | Neutral |
| 2.5 | 133 | 0.49 | -4.0% | -16.8% | -5.66u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |

### All Time (n=1551)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -47.84u | -1.8% | — |
| Flat 1.0u | -67.80u | -4.4% | +19.96u |
| Lock units only | -65.37u | — | +17.53u |
| Units change only on star change | -70.89u | — | +23.05u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 290 | 3.20 | -8.6% | -4.4% | -15.98u | Sizing hurts |
| 4.5 | 221 | 2.59 | 2.3% | 5.6% | +27.27u | Sizing helps |
| 4 | 301 | 1.57 | -7.2% | -2.7% | +8.87u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 279 | 1.02 | -9.0% | -8.8% | +0.25u | Neutral |
| 2.5 | 240 | 0.60 | -2.5% | -6.2% | -2.95u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 989 | 52.9% | 51.1% | -1.8% | -3.9% | -0.15% | Neutral |
| 4.5-5★ | 464 | 53.2% | 52.4% | -0.8% | -3.1% | -0.20% | Neutral |
| 3.5-4★ | 254 | 52.1% | 48.4% | -3.7% | -5.8% | -0.32% | Below market |
| 2.5-3★ | 254 | 53.0% | 51.2% | -1.8% | -3.1% | 0.10% | Neutral |
| CLEAR_MOVE only | 147 | 54.1% | 53.7% | -0.4% | -1.4% | 0.08% | Neutral |
| NO_MOVE only | 34 | 53.1% | 52.9% | -0.1% | -6.2% | 1.08% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=81)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.931 | 36.182 | 0.43 |  |
| Rank_norm | 49.993 | 39.201 | 0.41 |  |
| PnL_norm | 46.700 | 38.458 | 0.39 |  |
| WalletBase | 45.894 | 39.628 | 0.49 |  |
| SizeRatio | 1.280 | 1.265 | 0.01 |  |
| ConvictionMult | 0.936 | 0.925 | 0.07 |  |
| WalletCountFor | 2.859 | 3.062 | 0.10 |  |
| TopShare | 0.611 | 0.645 | 0.13 |  |
| ForSide | 135.255 | 109.699 | 0.23 |  |
| AgainstSide | 48.336 | 36.752 | 0.16 |  |
| NetEdge | 0.942 | 0.785 | 0.18 |  |
| WalletPlayScore | 0.818 | 0.517 | 0.12 |  |

### V8 Era (n=733)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.931 | 42.526 | 0.08 |  |
| Rank_norm | 49.993 | 57.852 | 0.30 |  |
| PnL_norm | 46.700 | 50.956 | 0.20 |  |
| WalletBase | 45.894 | 46.423 | 0.04 |  |
| SizeRatio | 1.280 | 1.351 | 0.05 |  |
| ConvictionMult | 0.936 | 0.955 | 0.11 |  |
| WalletCountFor | 2.859 | 2.859 | 0.00 |  |
| TopShare | 0.611 | 0.611 | 0.00 |  |
| ForSide | 135.255 | 135.255 | 0.00 |  |
| AgainstSide | 48.336 | 48.336 | 0.00 |  |
| NetEdge | 0.942 | 0.942 | 0.00 |  |
| WalletPlayScore | 0.818 | 0.818 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=989)

No major failure modes detected.

### 7-Day (n=156)

- **Ranking issue**: ≤3★ WR (53%) beats ≥4★ (47%)
- **Concentration issue**: 39 high-concentration picks (TopShare>0.6) at -13.1% ROI

### All Time (n=1551)

No major failure modes detected.


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
| V8 era picks | 989 |
| V8 flat ROI | -3.9% |
| V8 model ROI | -0.2% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -3.1% |
| 2.5-3★ ROI | -3.1% |
| CLEAR_MOVE ROI | -1.4% |
| NO_MOVE ROI | -6.2% |
| Single-wallet play rate | 42.7% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.19% | 4.5★: -0.23% | 4★: -0.41% | 3.5★: -0.07% | 3★: 0.68% | 2.5★: -0.41% | 2★: 0.67% | 1★: 0.11% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=989)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 903 | 91.3% | 50.6% | -4.4% | -1.5% | -0.16% |
| MUTED | 75 | 7.6% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.1% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=156)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 156 | 100.0% | 48.7% | -11.9% | -1.6% | 0.03% |

### All Time (n=1551)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1463 | 94.3% | 51.7% | -4.9% | -2.9% | -0.25% |
| MUTED | 75 | 4.8% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 0.8% | 61.5% | 17.8% | 4.8% | -0.95% |

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
