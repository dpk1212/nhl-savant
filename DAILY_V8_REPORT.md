# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-25 ET
**Completed Picks**: 1493 | **V8 Era Picks**: 931 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (56.3%) beats 5★ (50.4%) |
| Single-wallet dependency | ⚠️ | 42% of picks are single-wallet (WR: 53.1%, ROI: 1.0%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 74 | 51.4% | -2.50u | -3.4% | 0.68u | 0.5% | -0.11% | -0.57% |  |
| 7-Day | 146 | 50.7% | -7.34u | -5.0% | 7.50u | 2.7% | 0.32% | -0.65% |  |
| 14-Day | 262 | 50.8% | -13.35u | -5.1% | 4.31u | 0.9% | 0.07% | -0.72% |  |
| 30-Day | 530 | 51.9% | -11.73u | -2.2% | 40.07u | 3.9% | -0.20% | -0.45% |  |
| V8 Era | 931 | 51.1% | -28.85u | -3.1% | 0.93u | 0.1% | -0.11% | -0.44% |  |
| All Time | 1493 | 52.0% | -58.37u | -3.9% | -43.95u | -1.7% | -0.23% | -0.18% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=931)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 268 | 53.4% | 53.4% | 50.4% | -3.0% | -7.3% | -3.5% | 3.20 | -0.16% | Weak |
| 4.5 | 167 | 52.5% | 52.5% | 56.3% | +3.7% | 6.3% | 10.1% | 2.59 | -0.45% | Strong |
| 4 | 178 | 52.2% | 52.2% | 47.8% | -4.5% | -8.2% | -0.9% | 1.23 | -0.20% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 114 | 52.5% | 52.5% | 50.0% | -2.5% | -4.0% | -11.3% | 0.77 | 0.76% | Fair |
| 2.5 | 117 | 52.9% | 52.9% | 50.4% | -2.5% | -3.8% | -10.0% | 0.53 | -0.25% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.4% | 56.3% | -5.9% | INVERTED |
| 4.5★ vs 4★ | 56.3% | 47.8% | +8.5% | Correct |
| 4★ vs 3.5★ | 47.8% | 51.5% | -3.7% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 50.0% | +1.5% | Correct |
| 3★ vs 2.5★ | 50.0% | 50.4% | -0.4% | Flat |
| 2.5★ vs 2★ | 50.4% | 0.0% | +50.4% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.048 |
| Spearman: Stars vs Flat ROI | 0.000 |
| Spearman: Stars vs CLV | -0.524 |
| Brier Score | 0.2435 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1493)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 281 | 53.6% | 53.6% | 50.5% | -3.1% | -7.3% | -3.9% | 3.17 | -0.12% | Weak |
| 4.5 | 201 | 53.4% | 53.4% | 55.2% | +1.8% | 3.1% | 5.7% | 2.59 | -0.16% | Fair |
| 4 | 293 | 53.7% | 53.7% | 50.2% | -3.5% | -6.3% | -2.4% | 1.58 | -0.39% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 274 | 54.0% | 54.0% | 49.3% | -4.8% | -9.3% | -11.0% | 1.03 | 0.05% | Weak |
| 2.5 | 224 | 53.6% | 53.6% | 52.7% | -1.0% | -2.3% | -3.0% | 0.63 | -0.51% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.5% | 55.2% | -4.7% | INVERTED |
| 4.5★ vs 4★ | 55.2% | 50.2% | +5.0% | Correct |
| 4★ vs 3.5★ | 50.2% | 56.5% | -6.3% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.3% | +7.2% | Correct |
| 3★ vs 2.5★ | 49.3% | 52.7% | -3.4% | INVERTED |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.048 |
| Spearman: Stars vs Flat ROI | -0.048 |
| Spearman: Stars vs CLV | -0.405 |
| Brier Score | 0.2374 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.087 | -0.018 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.163 | -0.115 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.085 | -0.053 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.131 | -0.046 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.070 | -0.017 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.042 | 0.006 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.137 | -0.044 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.182 | -0.092 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.005 | 0.038 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.148 | -0.085 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.015 | -0.008 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.185 | 0.109 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.188 | 0.114 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.162 | -0.095 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.60–34.50) | 153 | 47.7% | -12.5% | -0.4% | -0.09% |  |
| p20-40 (34.50–40.05) | 154 | 57.1% | 6.3% | 11.5% | -0.26% |  |
| p40-60 (40.06–45.40) | 154 | 53.9% | 3.9% | -6.8% | -0.82% |  |
| p60-80 (45.47–51.57) | 154 | 49.4% | -7.4% | 2.3% | 0.14% |  |
| p80-95 (51.60–59.22) | 154 | 50.6% | 0.8% | -1.5% | 0.61% |  |
| p95+ (59.26–83.30) | 154 | 47.4% | -10.5% | -9.4% | -0.26% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 397 | 48.6% | -7.9% | -4.5% | -0.42% |  |
| 0.90-1.05 | 301 | 48.5% | -9.0% | -7.2% | 0.10% |  |
| 1.05-1.20 | 156 | 63.5% | 23.5% | 29.9% | -0.05% |  |
| 1.20-1.35 | 42 | 47.6% | -12.7% | -17.5% | 1.34% |  |
| 1.35-1.50 | 12 | 41.7% | -22.6% | -40.2% | -0.33% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.18) | 117 | 48.7% | -7.1% | -4.2% | -0.36% |  |
| 20-40% (0.18–0.50) | 117 | 58.1% | 6.4% | 12.4% | -0.13% |  |
| 40-60% (0.50–0.80) | 118 | 54.2% | 1.8% | 8.3% | 0.04% |  |
| 60-80% (0.80–1.12) | 117 | 49.6% | -3.3% | -5.9% | -0.04% |  |
| 80-95% (1.12–1.60) | 117 | 46.2% | -10.6% | -3.6% | 0.08% |  |
| 95%+ (1.60–6.68) | 118 | 47.5% | -11.9% | -8.2% | -0.02% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 34 | 35.3% | -29.3% | -30.3% | 0.23% | Broad support |
| 0.25-0.40 | 129 | 48.8% | -5.6% | -3.0% | 0.16% | Healthy support |
| 0.40-0.60 | 221 | 48.9% | -7.6% | -0.9% | -0.27% | Concentrated |
| 0.60-0.80 | 138 | 58.7% | 8.6% | 10.3% | -0.17% | Very concentrated |
| 0.80-1.00 | 182 | 51.1% | -3.7% | 0.2% | 0.03% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 77 | 39.0% | -29.4% | -28.5% | -0.24% | 4.2 |
| Broad battle | 285 | 49.5% | -4.8% | 1.4% | 0.10% | 3.8 |
| One-wallet nuke | 409 | 51.8% | -1.6% | 1.2% | -0.12% | 3.9 |
| Thin support | 616 | 52.8% | -0.4% | 0.6% | -0.13% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=931)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 31 | 51.6% | -7.1% | 22.7% | 1.72% | 4.0 | 90.3% |
| SMALL_MOVE | 182 | 50.0% | -6.3% | 1.5% | -0.54% | 4.1 | 100.0% |
| CLEAR_MOVE | 146 | 53.4% | -1.5% | 2.6% | 0.11% | 4.1 | 100.0% |
| NEAR_START | 353 | 50.1% | -3.5% | -5.2% | -0.06% | 3.8 | 100.0% |

**All Time** (n=1493)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 548 | 53.6% | -5.3% | -3.0% | -0.35% | 3.3 | 6.6% |
| SMALL_MOVE | 185 | 49.7% | -6.8% | 0.2% | -0.50% | 4.1 | 98.4% |
| CLEAR_MOVE | 172 | 53.5% | -1.2% | 2.4% | 0.03% | 4.1 | 100.0% |
| NEAR_START | 369 | 50.1% | -3.8% | -5.5% | -0.04% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 15 / 60.0% / 6.0% | 90 / 50.0% / -9.5% | 72 / 56.9% / 2.6% | 139 / 50.4% / -4.1% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 55 / 56.4% / 8.7% | 43 / 44.2% / -19.0% | 91 / 52.7% / 5.8% |
| 2.5-3★ | 6 / 50.0% / -5.1% | 32 / 40.6% / -20.4% | 31 / 58.1% / 13.3% | 112 / 47.3% / -10.1% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 5 / 40.0% / -25.6% | — | 11 / 54.5% / -3.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 928 | 51.1% | -3.2% | -0.1% | 4.0 | -0.11% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 978 | 51.1% | -3.3% | -0.3% | 4.0 | -0.11% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1543 | 100% |
| LOCKED (direct) | 102 | 6.6% |
| Promoted (SHADOW→LOCKED) | 1030 | 66.8% |
| Rejected (stayed SHADOW) | 199 | 12.9% |
| Superseded (side flipped) | 207 | 13.4% |
| Muted | 535 | 34.7% |
| Cancelled | 20 | 1.3% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=931)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 0.93u | 0.1% | — |
| Flat 1.0u | -28.85u | -3.1% | +29.78u |
| Lock units only | -10.13u | — | +11.06u |
| Units change only on star change | -5.72u | — | +6.65u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 268 | 3.20 | -7.3% | -3.5% | -10.59u | Sizing hurts |
| 4.5 | 167 | 2.59 | 6.3% | 10.1% | +33.28u | Sizing helps |
| 4 | 178 | 1.23 | -8.2% | -0.9% | +12.66u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 114 | 0.77 | -4.0% | -11.3% | -5.36u | Sizing hurts |
| 2.5 | 117 | 0.53 | -3.8% | -10.0% | -1.78u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |

### All Time (n=1493)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -43.95u | -1.7% | — |
| Flat 1.0u | -58.37u | -3.9% | +14.42u |
| Lock units only | -44.24u | — | +0.29u |
| Units change only on star change | -49.76u | — | +5.81u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 281 | 3.17 | -7.3% | -3.9% | -14.19u | Sizing hurts |
| 4.5 | 201 | 2.59 | 3.1% | 5.7% | +23.26u | Sizing helps |
| 4 | 293 | 1.58 | -6.3% | -2.4% | +7.42u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 274 | 1.03 | -9.3% | -11.0% | -5.51u | Sizing hurts |
| 2.5 | 224 | 0.63 | -2.3% | -3.0% | +0.94u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 931 | 52.7% | 51.1% | -1.5% | -3.1% | -0.11% | Neutral |
| 4.5-5★ | 435 | 53.0% | 52.6% | -0.4% | -2.1% | -0.27% | Neutral |
| 3.5-4★ | 246 | 52.0% | 48.8% | -3.2% | -4.6% | -0.16% | Below market |
| 2.5-3★ | 233 | 52.7% | 50.6% | -2.0% | -3.1% | 0.24% | Below market |
| CLEAR_MOVE only | 146 | 53.9% | 53.4% | -0.5% | -1.5% | 0.11% | Neutral |
| NO_MOVE only | 31 | 53.5% | 51.6% | -1.8% | -7.1% | 1.72% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=75)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.290 | 39.398 | 0.27 |  |
| Rank_norm | 51.569 | 40.148 | 0.45 |  |
| PnL_norm | 48.007 | 37.869 | 0.50 |  |
| WalletBase | 46.450 | 40.460 | 0.47 |  |
| SizeRatio | 1.292 | 1.073 | 0.17 |  |
| ConvictionMult | 0.939 | 0.902 | 0.23 |  |
| WalletCountFor | 2.777 | 2.187 | 0.33 |  |
| TopShare | 0.617 | 0.698 | 0.32 |  |
| ForSide | 133.292 | 75.300 | 0.54 |  |
| AgainstSide | 48.368 | 34.484 | 0.19 |  |
| NetEdge | 0.922 | 0.460 | 0.54 |  |
| WalletPlayScore | 0.748 | -0.288 | 0.44 |  |

### V8 Era (n=704)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.290 | 42.813 | 0.08 |  |
| Rank_norm | 51.569 | 58.827 | 0.28 |  |
| PnL_norm | 48.007 | 51.631 | 0.18 |  |
| WalletBase | 46.450 | 46.728 | 0.02 |  |
| SizeRatio | 1.292 | 1.349 | 0.04 |  |
| ConvictionMult | 0.939 | 0.955 | 0.10 |  |
| WalletCountFor | 2.777 | 2.777 | 0.00 |  |
| TopShare | 0.617 | 0.617 | 0.00 |  |
| ForSide | 133.292 | 133.292 | 0.00 |  |
| AgainstSide | 48.368 | 48.368 | 0.00 |  |
| NetEdge | 0.922 | 0.922 | 0.00 |  |
| WalletPlayScore | 0.748 | 0.748 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=931)

No major failure modes detected.

### 7-Day (n=146)

- **Concentration issue**: 37 high-concentration picks (TopShare>0.6) at -12.3% ROI
- **Gate issue**: NO_MOVE ROI (-47.6%) significantly trails CLEAR_MOVE (-28.4%)

### All Time (n=1493)

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
| V8 era picks | 931 |
| V8 flat ROI | -3.1% |
| V8 model ROI | 0.1% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -2.1% |
| 2.5-3★ ROI | -3.1% |
| CLEAR_MOVE ROI | -1.5% |
| NO_MOVE ROI | -7.1% |
| Single-wallet play rate | 41.9% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.16% | 4.5★: -0.45% | 4★: -0.20% | 3.5★: -0.07% | 3★: 0.76% | 2.5★: -0.25% | 2★: 0.67% | 1★: 0.11% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=931)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 845 | 90.8% | 50.7% | -3.6% | -1.4% | -0.11% |
| MUTED | 75 | 8.1% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.2% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=146)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 146 | 100.0% | 50.7% | -5.0% | 2.7% | 0.32% |

### All Time (n=1493)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1405 | 94.1% | 51.7% | -4.4% | -2.8% | -0.22% |
| MUTED | 75 | 5.0% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 13 | 0.9% | 61.5% | 17.8% | 4.8% | -0.95% |

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
