# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-07-05 ET
**Completed Picks**: 1709 | **V8 Era Picks**: 1147 | **V8 Since**: 2026-04-18
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
| Single-wallet dependency | ⚠️ | 43% of picks are single-wallet (WR: 50.8%, ROI: -3.7%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 62 | 54.8% | 0.66u | 1.1% | 15.56u | 12.9% | 0.20% | 0.30% |  |
| 7-Day | 158 | 51.9% | -3.82u | -2.4% | 24.30u | 9.6% | 0.48% | -0.24% |  |
| 14-Day | 314 | 50.3% | -22.44u | -7.1% | 19.79u | 3.7% | 0.26% | 0.52% |  |
| 30-Day | 593 | 51.6% | -21.75u | -3.7% | 51.77u | 4.7% | -0.03% | 0.34% |  |
| V8 Era | 1147 | 51.2% | -42.11u | -3.7% | 21.34u | 1.0% | -0.06% | -0.33% |  |
| All Time | 1709 | 52.0% | -71.63u | -4.2% | -23.54u | -0.8% | -0.17% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=1147)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 301 | 54.1% | 54.1% | 50.5% | -3.6% | -8.4% | -5.4% | 3.31 | -0.25% | Weak |
| 4.5 | 227 | 51.9% | 51.9% | 53.3% | +1.4% | 0.8% | 6.8% | 2.56 | 0.22% | Fair |
| 4 | 212 | 52.2% | 52.2% | 49.1% | -3.2% | -6.0% | 12.1% | 1.19 | -0.34% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 149 | 52.5% | 52.5% | 52.3% | -0.2% | 0.4% | 2.1% | 0.71 | 0.74% | Fair |
| 2.5 | 169 | 53.1% | 53.1% | 50.3% | -2.8% | -5.7% | -3.7% | 0.44 | -0.47% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 17 | 54.2% | 54.2% | 58.8% | +4.6% | 0.9% | 17.9% | 0.41 | 0.00% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.5% | 53.3% | -2.8% | Flat |
| 4.5★ vs 4★ | 53.3% | 49.1% | +4.2% | Correct |
| 4★ vs 3.5★ | 49.1% | 51.5% | -2.4% | Flat |
| 3.5★ vs 3★ | 51.5% | 52.3% | -0.8% | Flat |
| 3★ vs 2.5★ | 52.3% | 50.3% | +2.0% | Correct |
| 2.5★ vs 2★ | 50.3% | 0.0% | +50.3% | Correct |
| 2★ vs 1★ | 0.0% | 58.8% | -58.8% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.024 |
| Spearman: Stars vs Flat ROI | -0.119 |
| Spearman: Stars vs CLV | -0.238 |
| Brier Score | 0.2413 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1709)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 314 | 54.3% | 54.3% | 50.6% | -3.7% | -8.4% | -5.7% | 3.28 | -0.20% | Weak |
| 4.5 | 261 | 52.7% | 52.7% | 52.9% | +0.2% | -1.0% | 3.8% | 2.57 | 0.37% | Fair |
| 4 | 327 | 53.5% | 53.5% | 50.8% | -2.8% | -5.0% | 4.3% | 1.52 | -0.47% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 309 | 53.9% | 53.9% | 50.5% | -3.4% | -6.5% | -6.3% | 0.96 | 0.13% | Weak |
| 2.5 | 276 | 53.6% | 53.6% | 52.2% | -1.4% | -3.7% | -0.5% | 0.55 | -0.60% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 17 | 54.2% | 54.2% | 58.8% | +4.6% | 0.9% | 17.9% | 0.41 | 0.00% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.6% | 52.9% | -2.3% | Flat |
| 4.5★ vs 4★ | 52.9% | 50.8% | +2.1% | Correct |
| 4★ vs 3.5★ | 50.8% | 56.5% | -5.7% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.5% | +6.0% | Correct |
| 3★ vs 2.5★ | 50.5% | 52.2% | -1.7% | Flat |
| 2.5★ vs 2★ | 52.2% | 0.0% | +52.2% | Correct |
| 2★ vs 1★ | 0.0% | 58.8% | -58.8% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.095 |
| Spearman: Stars vs Flat ROI | -0.095 |
| Spearman: Stars vs CLV | -0.143 |
| Brier Score | 0.2368 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.091 | -0.024 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.158 | -0.096 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.110 | -0.055 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.122 | -0.036 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.049 | -0.010 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.025 | 0.012 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.125 | -0.037 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.134 | -0.064 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.019 | 0.042 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.108 | -0.063 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.044 | 0.020 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.117 | 0.072 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.122 | 0.079 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.099 | -0.061 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (9.40–32.25) | 189 | 48.1% | -11.3% | 2.2% | 0.31% |  |
| p20-40 (32.27–38.45) | 190 | 50.5% | -7.9% | 4.2% | -0.04% |  |
| p40-60 (38.46–44.07) | 190 | 60.0% | 14.5% | 9.6% | -0.68% |  |
| p60-80 (44.08–49.90) | 190 | 52.1% | -3.5% | 4.2% | -0.36% |  |
| p80-95 (49.94–57.69) | 190 | 47.4% | -6.2% | -9.8% | 0.63% |  |
| p95+ (57.75–83.30) | 190 | 48.4% | -8.3% | -7.2% | -0.25% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 494 | 48.6% | -8.3% | -1.3% | -0.33% |  |
| 0.90-1.05 | 375 | 49.9% | -7.2% | -5.5% | 0.27% |  |
| 1.05-1.20 | 188 | 62.8% | 20.2% | 26.9% | -0.16% |  |
| 1.20-1.35 | 53 | 45.3% | -15.9% | -16.4% | 0.81% |  |
| 1.35-1.50 | 13 | 38.5% | -28.6% | -47.4% | -0.54% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.18) | 138 | 47.8% | -9.4% | 0.1% | -0.22% |  |
| 20-40% (0.18–0.51) | 138 | 57.2% | 5.6% | 13.5% | -0.19% |  |
| 40-60% (0.51–0.80) | 139 | 54.7% | 1.6% | 5.0% | 0.09% |  |
| 60-80% (0.80–1.12) | 138 | 51.4% | -0.4% | 0.7% | 0.34% |  |
| 80-95% (1.12–1.61) | 138 | 47.1% | -9.0% | -4.5% | -0.17% |  |
| 95%+ (1.62–12.79) | 139 | 51.1% | -7.5% | -2.9% | -0.18% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 47 | 44.7% | -14.6% | -8.0% | 0.01% | Broad support |
| 0.25-0.40 | 159 | 50.9% | -3.4% | -0.6% | 0.11% | Healthy support |
| 0.40-0.60 | 263 | 50.6% | -5.2% | 1.5% | -0.07% | Concentrated |
| 0.60-0.80 | 157 | 57.3% | 5.7% | 8.5% | -0.17% | Very concentrated |
| 0.80-1.00 | 204 | 50.5% | -4.6% | 0.7% | -0.09% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 95 | 40.0% | -28.3% | -24.7% | -0.32% | 4.2 |
| Broad battle | 339 | 51.3% | -2.0% | 5.4% | -0.00% | 3.7 |
| One-wallet nuke | 521 | 50.3% | -4.8% | 0.1% | -0.08% | 3.9 |
| Thin support | 751 | 51.7% | -2.8% | 0.4% | -0.06% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=1147)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 35 | 54.3% | -2.8% | 33.4% | 1.05% | 4.0 | 91.4% |
| SMALL_MOVE | 213 | 50.2% | -6.0% | 1.0% | -0.43% | 4.0 | 100.0% |
| CLEAR_MOVE | 149 | 53.7% | -1.5% | 3.0% | 0.22% | 4.1 | 100.0% |
| NEAR_START | 441 | 51.5% | -2.2% | -1.0% | -0.05% | 3.7 | 100.0% |

**All Time** (n=1709)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 552 | 53.8% | -5.0% | -2.1% | -0.39% | 3.3 | 7.2% |
| SMALL_MOVE | 216 | 50.0% | -6.4% | -0.1% | -0.39% | 4.0 | 98.6% |
| CLEAR_MOVE | 175 | 53.7% | -1.2% | 2.8% | 0.13% | 4.1 | 100.0% |
| NEAR_START | 457 | 51.4% | -2.5% | -1.4% | -0.04% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 16 / 62.5% / 5.6% | 104 / 50.0% / -8.5% | 75 / 57.3% / 2.3% | 167 / 50.9% / -5.0% |
| 3.5-4★ | 11 / 36.4% / -29.3% | 60 / 58.3% / 12.3% | 43 / 44.2% / -19.0% | 100 / 53.0% / 5.9% |
| 2.5-3★ | 7 / 57.1% / 11.2% | 43 / 39.5% / -23.8% | 31 / 58.1% / 13.3% | 162 / 51.2% / -3.5% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 6 / 50.0% / -16.4% | — | 12 / 50.0% / -11.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1144 | 51.1% | -3.8% | 0.9% | 3.9 | -0.06% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1194 | 51.2% | -3.8% | 0.7% | 3.9 | -0.06% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1926 | 100% |
| LOCKED (direct) | 108 | 5.6% |
| Promoted (SHADOW→LOCKED) | 1265 | 65.7% |
| Rejected (stayed SHADOW) | 206 | 10.7% |
| Superseded (side flipped) | 342 | 17.8% |
| Muted | 660 | 34.3% |
| Cancelled | 20 | 1.0% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=1147)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 21.34u | 1.0% | — |
| Flat 1.0u | -42.11u | -3.7% | +63.45u |
| Lock units only | -49.39u | — | +70.73u |
| Units change only on star change | -44.98u | — | +66.32u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 301 | 3.31 | -8.4% | -5.4% | -28.19u | Sizing hurts |
| 4.5 | 227 | 2.56 | 0.8% | 6.8% | +37.75u | Sizing helps |
| 4 | 212 | 1.19 | -6.0% | 12.1% | +43.17u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 149 | 0.71 | 0.4% | 2.1% | +1.63u | Sizing helps |
| 2.5 | 169 | 0.44 | -5.7% | -3.7% | +6.81u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 17 | 0.41 | 0.9% | 17.9% | +1.09u | Sizing helps |

### All Time (n=1709)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -23.54u | -0.8% | — |
| Flat 1.0u | -71.63u | -4.2% | +48.09u |
| Lock units only | -83.50u | — | +59.96u |
| Units change only on star change | -89.02u | — | +65.48u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 314 | 3.28 | -8.4% | -5.7% | -31.79u | Sizing hurts |
| 4.5 | 261 | 2.57 | -1.0% | 3.8% | +27.74u | Sizing helps |
| 4 | 327 | 1.52 | -5.0% | 4.3% | +37.93u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 309 | 0.96 | -6.5% | -6.3% | +1.48u | Sizing helps |
| 2.5 | 276 | 0.55 | -3.7% | -0.5% | +9.52u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 17 | 0.41 | 0.9% | 17.9% | +1.09u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 1147 | 52.8% | 51.2% | -1.6% | -3.7% | -0.06% | Neutral |
| 4.5-5★ | 528 | 53.2% | 51.7% | -1.5% | -4.5% | -0.04% | Neutral |
| 3.5-4★ | 280 | 52.0% | 49.6% | -2.3% | -3.4% | -0.28% | Below market |
| 2.5-3★ | 320 | 52.8% | 51.6% | -1.3% | -2.3% | 0.09% | Neutral |
| CLEAR_MOVE only | 149 | 54.1% | 53.7% | -0.4% | -1.5% | 0.22% | Neutral |
| NO_MOVE only | 35 | 52.9% | 54.3% | +1.4% | -2.8% | 1.05% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=97)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.335 | 39.759 | 0.20 |  |
| Rank_norm | 47.334 | 41.379 | 0.22 |  |
| PnL_norm | 44.154 | 34.046 | 0.47 |  |
| WalletBase | 44.663 | 39.566 | 0.39 |  |
| SizeRatio | 1.256 | 1.263 | 0.01 |  |
| ConvictionMult | 0.936 | 0.965 | 0.18 |  |
| WalletCountFor | 2.959 | 3.711 | 0.36 |  |
| TopShare | 0.604 | 0.551 | 0.21 |  |
| ForSide | 137.113 | 151.148 | 0.12 |  |
| AgainstSide | 48.173 | 46.938 | 0.02 |  |
| NetEdge | 0.962 | 1.112 | 0.15 |  |
| WalletPlayScore | 0.896 | 1.490 | 0.23 |  |

### V8 Era (n=830)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.335 | 42.203 | 0.06 |  |
| Rank_norm | 47.334 | 55.898 | 0.31 |  |
| PnL_norm | 44.154 | 48.980 | 0.22 |  |
| WalletBase | 44.663 | 45.622 | 0.07 |  |
| SizeRatio | 1.256 | 1.340 | 0.07 |  |
| ConvictionMult | 0.936 | 0.956 | 0.12 |  |
| WalletCountFor | 2.959 | 2.959 | 0.00 |  |
| TopShare | 0.604 | 0.604 | 0.00 |  |
| ForSide | 137.113 | 137.113 | 0.00 |  |
| AgainstSide | 48.173 | 48.173 | 0.00 |  |
| NetEdge | 0.962 | 0.962 | 0.00 |  |
| WalletPlayScore | 0.896 | 0.896 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=1147)

No major failure modes detected.

### 7-Day (n=158)

- **Concentration issue**: 34 high-concentration picks (TopShare>0.6) at -10.6% ROI

### All Time (n=1709)

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
| V8 era picks | 1147 |
| V8 flat ROI | -3.7% |
| V8 model ROI | 1.0% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -4.5% |
| 2.5-3★ ROI | -2.3% |
| CLEAR_MOVE ROI | -1.5% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 43.4% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.25% | 4.5★: 0.22% | 4★: -0.34% | 3.5★: -0.07% | 3★: 0.74% | 2.5★: -0.47% | 2★: 0.67% | 1★: 0.00% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=1147)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1061 | 92.5% | 50.8% | -4.1% | -0.1% | -0.06% |
| MUTED | 75 | 6.5% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.0% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=158)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 158 | 100.0% | 51.9% | -2.4% | 9.6% | 0.48% |

### All Time (n=1709)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1621 | 94.9% | 51.7% | -4.7% | -1.7% | -0.17% |
| MUTED | 75 | 4.4% | 56.0% | 2.2% | 20.8% | -0.11% |
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
