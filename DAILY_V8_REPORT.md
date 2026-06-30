# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-30 ET
**Completed Picks**: 1596 | **V8 Era Picks**: 1034 | **V8 Since**: 2026-04-18
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
| Single-wallet dependency | ⚠️ | 43% of picks are single-wallet (WR: 52.0%, ROI: -1.5%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 68 | 44.1% | -13.45u | -19.8% | 3.77u | 4.4% | 0.77% | -0.23% | Cold streak |
| 7-Day | 158 | 48.1% | -21.52u | -13.6% | -8.61u | -3.5% | -0.13% | 1.30% |  |
| 14-Day | 289 | 49.8% | -25.90u | -9.0% | 7.92u | 1.6% | 0.19% | 0.35% |  |
| 30-Day | 542 | 50.9% | -27.30u | -5.0% | 33.64u | 3.3% | -0.08% | 0.11% |  |
| V8 Era | 1034 | 50.8% | -46.46u | -4.5% | 0.24u | 0.0% | -0.07% | -0.34% |  |
| All Time | 1596 | 51.8% | -75.98u | -4.8% | -44.64u | -1.6% | -0.19% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=1034)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 278 | 53.8% | 53.8% | 50.4% | -3.4% | -8.3% | -4.0% | 3.23 | -0.21% | Weak |
| 4.5 | 200 | 52.0% | 52.0% | 53.0% | +1.0% | -0.1% | 6.6% | 2.53 | 0.22% | Fair |
| 4 | 190 | 52.4% | 52.4% | 48.4% | -4.0% | -7.5% | 2.8% | 1.22 | -0.38% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 132 | 52.5% | 52.5% | 49.2% | -3.3% | -6.1% | -8.7% | 0.74 | 0.57% | Weak |
| 2.5 | 147 | 53.3% | 53.3% | 51.7% | -1.6% | -3.2% | -1.7% | 0.47 | -0.40% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.4% | 53.0% | -2.6% | Flat |
| 4.5★ vs 4★ | 53.0% | 48.4% | +4.6% | Correct |
| 4★ vs 3.5★ | 48.4% | 51.5% | -3.1% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 49.2% | +2.3% | Correct |
| 3★ vs 2.5★ | 49.2% | 51.7% | -2.5% | Flat |
| 2.5★ vs 2★ | 51.7% | 0.0% | +51.7% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.095 |
| Spearman: Stars vs Flat ROI | -0.238 |
| Spearman: Stars vs CLV | -0.286 |
| Brier Score | 0.2410 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1596)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 291 | 54.0% | 54.0% | 50.5% | -3.5% | -8.3% | -4.3% | 3.20 | -0.16% | Weak |
| 4.5 | 234 | 52.8% | 52.8% | 52.6% | -0.3% | -1.9% | 3.2% | 2.54 | 0.39% | Fair |
| 4 | 305 | 53.8% | 53.8% | 50.5% | -3.3% | -5.9% | -0.5% | 1.56 | -0.50% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 292 | 54.0% | 54.0% | 49.0% | -5.0% | -9.9% | -10.1% | 0.99 | 0.00% | Weak |
| 2.5 | 254 | 53.8% | 53.8% | 53.1% | -0.7% | -2.1% | 0.5% | 0.58 | -0.57% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.5% | 52.6% | -2.1% | Flat |
| 4.5★ vs 4★ | 52.6% | 50.5% | +2.1% | Correct |
| 4★ vs 3.5★ | 50.5% | 56.5% | -6.0% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.0% | +7.5% | Correct |
| 3★ vs 2.5★ | 49.0% | 53.1% | -4.1% | INVERTED |
| 2.5★ vs 2★ | 53.1% | 0.0% | +53.1% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.190 |
| Spearman: Stars vs Flat ROI | -0.095 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2362 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.088 | -0.019 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.155 | -0.096 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.092 | -0.044 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.123 | -0.034 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.059 | -0.011 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.036 | 0.011 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.127 | -0.032 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.171 | -0.091 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.002 | 0.033 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.134 | -0.082 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.002 | -0.012 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.164 | 0.106 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.166 | 0.111 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.142 | -0.092 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.50–33.05) | 171 | 45.0% | -18.5% | -8.1% | 0.15% |  |
| p20-40 (33.10–38.70) | 171 | 54.4% | -0.1% | 8.0% | 0.03% |  |
| p40-60 (38.77–44.50) | 171 | 57.9% | 11.3% | 3.8% | -0.74% |  |
| p60-80 (44.50–50.65) | 171 | 50.3% | -6.2% | 6.6% | -0.21% |  |
| p80-95 (50.70–58.27) | 171 | 50.3% | -1.4% | -2.4% | 0.60% |  |
| p95+ (58.30–83.30) | 171 | 46.2% | -12.9% | -12.0% | -0.27% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 455 | 47.9% | -10.0% | -3.1% | -0.33% |  |
| 0.90-1.05 | 330 | 49.4% | -8.1% | -6.1% | 0.17% |  |
| 1.05-1.20 | 167 | 63.5% | 22.6% | 27.1% | -0.09% |  |
| 1.20-1.35 | 45 | 44.4% | -18.5% | -23.2% | 1.21% |  |
| 1.35-1.50 | 13 | 38.5% | -28.6% | -47.4% | -0.54% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.19) | 126 | 47.6% | -9.2% | -2.6% | -0.39% |  |
| 20-40% (0.19–0.51) | 127 | 58.3% | 7.0% | 12.0% | -0.19% |  |
| 40-60% (0.51–0.80) | 127 | 53.5% | -0.3% | 4.9% | -0.02% |  |
| 60-80% (0.80–1.11) | 126 | 50.0% | -4.1% | -1.9% | 0.21% |  |
| 80-95% (1.11–1.60) | 127 | 46.5% | -10.9% | -7.5% | -0.03% |  |
| 95%+ (1.60–6.68) | 127 | 48.0% | -12.1% | -8.0% | -0.04% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 41 | 39.0% | -25.5% | -27.9% | 0.16% | Broad support |
| 0.25-0.40 | 141 | 48.2% | -8.1% | -2.8% | 0.07% | Healthy support |
| 0.40-0.60 | 239 | 49.4% | -7.4% | -1.8% | -0.16% | Concentrated |
| 0.60-0.80 | 146 | 57.5% | 5.8% | 8.0% | -0.17% | Very concentrated |
| 0.80-1.00 | 193 | 51.3% | -3.4% | 0.9% | -0.05% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 86 | 38.4% | -32.1% | -31.9% | -0.25% | 4.2 |
| Broad battle | 307 | 48.9% | -6.6% | 0.9% | 0.01% | 3.8 |
| One-wallet nuke | 467 | 51.2% | -3.3% | 2.0% | -0.06% | 3.9 |
| Thin support | 684 | 52.3% | -1.6% | 1.3% | -0.09% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=1034)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 35 | 54.3% | -2.8% | 33.4% | 1.05% | 4.0 | 91.4% |
| SMALL_MOVE | 193 | 50.3% | -6.3% | -1.0% | -0.53% | 4.1 | 100.0% |
| CLEAR_MOVE | 148 | 54.1% | -0.9% | 3.0% | 0.05% | 4.1 | 100.0% |
| NEAR_START | 392 | 49.5% | -5.7% | -6.1% | 0.00% | 3.7 | 100.0% |

**All Time** (n=1596)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 552 | 53.8% | -5.0% | -2.1% | -0.39% | 3.3 | 7.2% |
| SMALL_MOVE | 196 | 50.0% | -6.8% | -2.2% | -0.48% | 4.1 | 98.5% |
| CLEAR_MOVE | 174 | 54.0% | -0.7% | 2.8% | -0.02% | 4.1 | 100.0% |
| NEAR_START | 408 | 49.5% | -5.9% | -6.3% | 0.02% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 16 / 62.5% / 5.6% | 97 / 50.5% / -8.5% | 74 / 58.1% / 3.7% | 147 / 49.0% / -7.8% |
| 3.5-4★ | 11 / 36.4% / -29.3% | 55 / 56.4% / 8.7% | 43 / 44.2% / -19.0% | 96 / 53.1% / 6.0% |
| 2.5-3★ | 7 / 57.1% / 11.2% | 36 / 41.7% / -20.7% | 31 / 58.1% / 13.3% | 138 / 47.1% / -11.7% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 5 / 40.0% / -25.6% | — | 11 / 54.5% / -3.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1031 | 50.7% | -4.6% | -0.1% | 3.9 | -0.07% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1081 | 50.8% | -4.6% | -0.3% | 3.9 | -0.07% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1724 | 100% |
| LOCKED (direct) | 105 | 6.1% |
| Promoted (SHADOW→LOCKED) | 1144 | 66.4% |
| Rejected (stayed SHADOW) | 201 | 11.7% |
| Superseded (side flipped) | 269 | 15.6% |
| Muted | 596 | 34.6% |
| Cancelled | 20 | 1.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=1034)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 0.24u | 0.0% | — |
| Flat 1.0u | -46.46u | -4.5% | +46.70u |
| Lock units only | -38.65u | — | +38.89u |
| Units change only on star change | -34.25u | — | +34.49u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 278 | 3.23 | -8.3% | -4.0% | -12.40u | Sizing hurts |
| 4.5 | 200 | 2.53 | -0.1% | 6.6% | +33.74u | Sizing helps |
| 4 | 190 | 1.22 | -7.5% | 2.8% | +20.60u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 132 | 0.74 | -6.1% | -8.7% | -0.31u | Neutral |
| 2.5 | 147 | 0.47 | -3.2% | -1.7% | +3.48u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |

### All Time (n=1596)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -44.64u | -1.6% | — |
| Flat 1.0u | -75.98u | -4.8% | +31.34u |
| Lock units only | -72.77u | — | +28.13u |
| Units change only on star change | -78.29u | — | +33.65u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 291 | 3.20 | -8.3% | -4.3% | -15.99u | Sizing hurts |
| 4.5 | 234 | 2.54 | -1.9% | 3.2% | +23.73u | Sizing helps |
| 4 | 305 | 1.56 | -5.9% | -0.5% | +15.36u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 292 | 0.99 | -9.9% | -10.1% | -0.46u | Neutral |
| 2.5 | 254 | 0.58 | -2.1% | 0.5% | +6.20u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 1034 | 52.8% | 50.8% | -2.0% | -4.5% | -0.07% | Below market |
| 4.5-5★ | 478 | 53.0% | 51.5% | -1.6% | -4.9% | -0.03% | Neutral |
| 3.5-4★ | 258 | 52.1% | 49.2% | -2.9% | -4.3% | -0.30% | Below market |
| 2.5-3★ | 281 | 53.0% | 50.9% | -2.1% | -3.9% | 0.06% | Below market |
| CLEAR_MOVE only | 148 | 54.1% | 54.1% | -0.1% | -0.9% | 0.05% | Neutral |
| NO_MOVE only | 35 | 52.9% | 54.3% | +1.4% | -2.8% | 1.05% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=85)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.723 | 37.413 | 0.35 |  |
| Rank_norm | 48.835 | 36.700 | 0.45 |  |
| PnL_norm | 45.632 | 35.322 | 0.48 |  |
| WalletBase | 45.386 | 39.070 | 0.49 |  |
| SizeRatio | 1.261 | 1.212 | 0.04 |  |
| ConvictionMult | 0.934 | 0.926 | 0.05 |  |
| WalletCountFor | 2.875 | 3.471 | 0.30 |  |
| TopShare | 0.611 | 0.588 | 0.09 |  |
| ForSide | 134.372 | 123.809 | 0.09 |  |
| AgainstSide | 47.771 | 37.960 | 0.13 |  |
| NetEdge | 0.938 | 0.915 | 0.02 |  |
| WalletPlayScore | 0.817 | 1.035 | 0.09 |  |

### V8 Era (n=760)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.723 | 42.348 | 0.08 |  |
| Rank_norm | 48.835 | 56.954 | 0.30 |  |
| PnL_norm | 45.632 | 50.167 | 0.21 |  |
| WalletBase | 45.386 | 46.045 | 0.05 |  |
| SizeRatio | 1.261 | 1.339 | 0.06 |  |
| ConvictionMult | 0.934 | 0.954 | 0.12 |  |
| WalletCountFor | 2.875 | 2.875 | 0.00 |  |
| TopShare | 0.611 | 0.611 | 0.00 |  |
| ForSide | 134.372 | 134.372 | 0.00 |  |
| AgainstSide | 47.771 | 47.771 | 0.00 |  |
| NetEdge | 0.938 | 0.938 | 0.00 |  |
| WalletPlayScore | 0.817 | 0.817 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=1034)

No major failure modes detected.

### 7-Day (n=158)

- **Ranking issue**: ≤3★ WR (52%) beats ≥4★ (45%)
- **Concentration issue**: 35 high-concentration picks (TopShare>0.6) at -21.6% ROI

### All Time (n=1596)

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
| V8 era picks | 1034 |
| V8 flat ROI | -4.5% |
| V8 model ROI | 0.0% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -4.9% |
| 2.5-3★ ROI | -3.9% |
| CLEAR_MOVE ROI | -0.9% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 43.1% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.21% | 4.5★: 0.22% | 4★: -0.38% | 3.5★: -0.07% | 3★: 0.57% | 2.5★: -0.40% | 2★: 0.67% | 1★: 0.11% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=1034)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 948 | 91.7% | 50.3% | -5.0% | -1.3% | -0.07% |
| MUTED | 75 | 7.3% | 56.0% | 2.2% | 20.8% | -0.11% |
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

### 7-Day (n=158)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 158 | 100.0% | 48.1% | -13.6% | -3.5% | -0.13% |

### All Time (n=1596)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1508 | 94.5% | 51.5% | -5.3% | -2.7% | -0.19% |
| MUTED | 75 | 4.7% | 56.0% | 2.2% | 20.8% | -0.11% |
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
