# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-26 ET
**Completed Picks**: 1507 | **V8 Era Picks**: 945 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (56.3%) beats 5★ (50.4%) |
| Single-wallet dependency | ⚠️ | 42% of picks are single-wallet (WR: 53.3%, ROI: 1.6%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 69 | 47.8% | -7.19u | -10.4% | -12.75u | -10.2% | -0.29% | 3.55% |  |
| 7-Day | 150 | 48.7% | -13.60u | -9.1% | -1.42u | -0.5% | 0.49% | 1.22% |  |
| 14-Day | 267 | 50.6% | -14.90u | -5.6% | 0.65u | 0.1% | 0.17% | 0.16% |  |
| 30-Day | 524 | 51.1% | -18.85u | -3.6% | 21.36u | 2.1% | -0.13% | -0.18% |  |
| V8 Era | 945 | 51.0% | -32.13u | -3.4% | -3.90u | -0.2% | -0.08% | -0.35% |  |
| All Time | 1507 | 52.0% | -61.65u | -4.1% | -48.78u | -1.9% | -0.20% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=945)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 270 | 53.5% | 53.5% | 50.4% | -3.1% | -7.5% | -3.9% | 3.20 | -0.17% | Weak |
| 4.5 | 174 | 52.2% | 52.2% | 56.3% | +4.1% | 6.8% | 10.6% | 2.57 | -0.23% | Strong |
| 4 | 179 | 52.2% | 52.2% | 47.5% | -4.7% | -8.8% | -1.4% | 1.23 | -0.17% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 114 | 52.5% | 52.5% | 50.0% | -2.5% | -4.0% | -11.3% | 0.77 | 0.76% | Fair |
| 2.5 | 121 | 53.2% | 53.2% | 49.6% | -3.6% | -6.0% | -16.3% | 0.52 | -0.31% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.4% | 56.3% | -5.9% | INVERTED |
| 4.5★ vs 4★ | 56.3% | 47.5% | +8.8% | Correct |
| 4★ vs 3.5★ | 47.5% | 51.5% | -4.0% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 50.0% | +1.5% | Correct |
| 3★ vs 2.5★ | 50.0% | 49.6% | +0.4% | Correct |
| 2.5★ vs 2★ | 49.6% | 0.0% | +49.6% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.095 |
| Spearman: Stars vs Flat ROI | 0.024 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2430 |
| Monotonicity Score | -0.14 |

### All Time (n=1507)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 283 | 53.7% | 53.7% | 50.5% | -3.2% | -7.6% | -4.3% | 3.18 | -0.13% | Weak |
| 4.5 | 208 | 53.1% | 53.1% | 55.3% | +2.2% | 3.7% | 6.2% | 2.57 | 0.02% | Fair |
| 4 | 294 | 53.7% | 53.7% | 50.0% | -3.7% | -6.6% | -2.6% | 1.58 | -0.37% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 274 | 54.0% | 54.0% | 49.3% | -4.8% | -9.3% | -11.0% | 1.03 | 0.05% | Weak |
| 2.5 | 228 | 53.8% | 53.8% | 52.2% | -1.6% | -3.5% | -5.8% | 0.62 | -0.54% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.5% | 55.3% | -4.8% | INVERTED |
| 4.5★ vs 4★ | 55.3% | 50.0% | +5.3% | Correct |
| 4★ vs 3.5★ | 50.0% | 56.5% | -6.5% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.3% | +7.2% | Correct |
| 3★ vs 2.5★ | 49.3% | 52.2% | -2.9% | Flat |
| 2.5★ vs 2★ | 52.2% | 0.0% | +52.2% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.048 |
| Spearman: Stars vs Flat ROI | -0.048 |
| Spearman: Stars vs CLV | -0.429 |
| Brier Score | 0.2372 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.080 | -0.015 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.156 | -0.106 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.084 | -0.047 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.125 | -0.042 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.073 | -0.020 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.047 | 0.004 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.134 | -0.042 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.183 | -0.098 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.001 | 0.033 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.148 | -0.089 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.018 | -0.016 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.187 | 0.117 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.191 | 0.122 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.163 | -0.101 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.60–34.40) | 156 | 46.8% | -14.3% | -1.4% | 0.16% |  |
| p20-40 (34.46–39.90) | 156 | 56.4% | 5.0% | 9.1% | -0.26% |  |
| p40-60 (39.90–45.25) | 156 | 54.5% | 5.3% | -5.5% | -0.72% |  |
| p60-80 (45.25–51.50) | 156 | 48.7% | -8.7% | 1.7% | -0.02% |  |
| p80-95 (51.56–59.20) | 156 | 51.3% | 1.4% | 0.4% | 0.62% |  |
| p95+ (59.20–83.30) | 157 | 47.8% | -9.8% | -9.9% | -0.26% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 404 | 48.8% | -7.8% | -3.9% | -0.32% |  |
| 0.90-1.05 | 304 | 48.4% | -9.6% | -7.7% | 0.09% |  |
| 1.05-1.20 | 157 | 63.7% | 24.4% | 29.9% | -0.05% |  |
| 1.20-1.35 | 45 | 44.4% | -18.5% | -23.2% | 1.21% |  |
| 1.35-1.50 | 12 | 41.7% | -22.6% | -40.2% | -0.33% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.18) | 118 | 48.3% | -7.9% | -4.1% | -0.39% |  |
| 20-40% (0.18–0.50) | 119 | 58.8% | 8.3% | 12.7% | -0.13% |  |
| 40-60% (0.51–0.80) | 119 | 53.8% | 1.3% | 8.9% | 0.03% |  |
| 60-80% (0.81–1.12) | 119 | 48.7% | -5.7% | -8.8% | -0.06% |  |
| 80-95% (1.12–1.60) | 119 | 46.2% | -10.2% | -3.4% | 0.12% |  |
| 95%+ (1.60–6.68) | 119 | 47.1% | -13.5% | -10.1% | -0.08% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 36 | 33.3% | -33.3% | -36.9% | 0.18% | Broad support |
| 0.25-0.40 | 133 | 48.1% | -7.6% | -4.4% | 0.11% | Healthy support |
| 0.40-0.60 | 222 | 49.1% | -7.5% | -0.9% | -0.27% | Concentrated |
| 0.60-0.80 | 139 | 58.3% | 7.8% | 10.3% | -0.18% | Very concentrated |
| 0.80-1.00 | 183 | 51.4% | -2.8% | 0.2% | 0.03% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 79 | 39.2% | -29.7% | -29.4% | -0.27% | 4.2 |
| Broad battle | 290 | 48.6% | -6.4% | 0.3% | 0.08% | 3.8 |
| One-wallet nuke | 415 | 52.0% | -1.0% | 1.6% | -0.02% | 3.9 |
| Thin support | 623 | 52.8% | -0.2% | 0.9% | -0.07% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=945)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 31 | 51.6% | -7.1% | 22.7% | 1.72% | 4.0 | 90.3% |
| SMALL_MOVE | 184 | 50.5% | -5.3% | 1.5% | -0.55% | 4.1 | 100.0% |
| CLEAR_MOVE | 146 | 53.4% | -1.5% | 2.6% | 0.11% | 4.1 | 100.0% |
| NEAR_START | 360 | 49.4% | -5.0% | -6.6% | -0.08% | 3.8 | 100.0% |

**All Time** (n=1507)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 548 | 53.6% | -5.3% | -3.0% | -0.35% | 3.3 | 6.6% |
| SMALL_MOVE | 187 | 50.3% | -5.8% | 0.2% | -0.50% | 4.1 | 98.4% |
| CLEAR_MOVE | 172 | 53.5% | -1.2% | 2.4% | 0.03% | 4.1 | 100.0% |
| NEAR_START | 376 | 49.5% | -5.3% | -6.8% | -0.06% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 15 / 60.0% / 6.0% | 91 / 50.5% / -7.6% | 72 / 56.9% / 2.6% | 142 / 50.0% / -5.3% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 55 / 56.4% / 8.7% | 43 / 44.2% / -19.0% | 92 / 52.2% / 4.7% |
| 2.5-3★ | 6 / 50.0% / -5.1% | 33 / 42.4% / -19.2% | 31 / 58.1% / 13.3% | 115 / 46.1% / -12.5% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 5 / 40.0% / -25.6% | — | 11 / 54.5% / -3.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 942 | 51.0% | -3.5% | -0.3% | 4.0 | -0.08% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 992 | 51.0% | -3.6% | -0.5% | 4.0 | -0.08% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1573 | 100% |
| LOCKED (direct) | 103 | 6.5% |
| Promoted (SHADOW→LOCKED) | 1045 | 66.4% |
| Rejected (stayed SHADOW) | 200 | 12.7% |
| Superseded (side flipped) | 220 | 14.0% |
| Muted | 548 | 34.8% |
| Cancelled | 20 | 1.3% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=945)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -3.90u | -0.2% | — |
| Flat 1.0u | -32.13u | -3.4% | +28.23u |
| Lock units only | -10.81u | — | +6.91u |
| Units change only on star change | -6.40u | — | +2.50u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 270 | 3.20 | -7.5% | -3.9% | -13.21u | Sizing hurts |
| 4.5 | 174 | 2.57 | 6.8% | 10.6% | +35.50u | Sizing helps |
| 4 | 179 | 1.23 | -8.8% | -1.4% | +12.66u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 114 | 0.77 | -4.0% | -11.3% | -5.36u | Sizing hurts |
| 2.5 | 121 | 0.52 | -6.0% | -16.3% | -2.94u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |

### All Time (n=1507)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -48.78u | -1.9% | — |
| Flat 1.0u | -61.65u | -4.1% | +12.87u |
| Lock units only | -44.93u | — | -3.85u |
| Units change only on star change | -50.45u | — | +1.67u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 283 | 3.18 | -7.6% | -4.3% | -16.80u | Sizing hurts |
| 4.5 | 208 | 2.57 | 3.7% | 6.2% | +25.49u | Sizing helps |
| 4 | 294 | 1.58 | -6.6% | -2.6% | +7.42u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 274 | 1.03 | -9.3% | -11.0% | -5.51u | Sizing hurts |
| 2.5 | 228 | 0.62 | -3.5% | -5.8% | -0.23u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 945 | 52.7% | 51.0% | -1.7% | -3.4% | -0.08% | Neutral |
| 4.5-5★ | 444 | 53.0% | 52.7% | -0.3% | -1.9% | -0.19% | Neutral |
| 3.5-4★ | 247 | 52.0% | 48.6% | -3.4% | -5.0% | -0.14% | Below market |
| 2.5-3★ | 237 | 52.8% | 50.2% | -2.6% | -4.3% | 0.20% | Below market |
| CLEAR_MOVE only | 146 | 53.9% | 53.4% | -0.5% | -1.5% | 0.11% | Neutral |
| NO_MOVE only | 31 | 53.5% | 51.6% | -1.8% | -7.1% | 1.72% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=77)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.199 | 37.965 | 0.34 |  |
| Rank_norm | 51.186 | 39.588 | 0.45 |  |
| PnL_norm | 47.622 | 37.750 | 0.48 |  |
| WalletBase | 46.315 | 39.721 | 0.52 |  |
| SizeRatio | 1.296 | 1.242 | 0.04 |  |
| ConvictionMult | 0.939 | 0.922 | 0.10 |  |
| WalletCountFor | 2.816 | 2.545 | 0.15 |  |
| TopShare | 0.615 | 0.686 | 0.28 |  |
| ForSide | 134.504 | 90.847 | 0.40 |  |
| AgainstSide | 48.319 | 36.652 | 0.16 |  |
| NetEdge | 0.934 | 0.597 | 0.38 |  |
| WalletPlayScore | 0.782 | -0.008 | 0.33 |  |

### V8 Era (n=713)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.199 | 42.720 | 0.08 |  |
| Rank_norm | 51.186 | 58.456 | 0.28 |  |
| PnL_norm | 47.622 | 51.350 | 0.18 |  |
| WalletBase | 46.315 | 46.604 | 0.02 |  |
| SizeRatio | 1.296 | 1.360 | 0.05 |  |
| ConvictionMult | 0.939 | 0.956 | 0.11 |  |
| WalletCountFor | 2.816 | 2.816 | 0.00 |  |
| TopShare | 0.615 | 0.615 | 0.00 |  |
| ForSide | 134.504 | 134.504 | 0.00 |  |
| AgainstSide | 48.319 | 48.319 | 0.00 |  |
| NetEdge | 0.934 | 0.934 | 0.00 |  |
| WalletPlayScore | 0.782 | 0.782 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=945)

No major failure modes detected.

### 7-Day (n=150)

No major failure modes detected.

### All Time (n=1507)

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
| V8 era picks | 945 |
| V8 flat ROI | -3.4% |
| V8 model ROI | -0.2% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | -1.9% |
| 2.5-3★ ROI | -4.3% |
| CLEAR_MOVE ROI | -1.5% |
| NO_MOVE ROI | -7.1% |
| Single-wallet play rate | 41.9% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.17% | 4.5★: -0.23% | 4★: -0.17% | 3.5★: -0.07% | 3★: 0.76% | 2.5★: -0.31% | 2★: 0.67% | 1★: 0.11% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=945)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 859 | 90.9% | 50.5% | -3.9% | -1.6% | -0.08% |
| MUTED | 75 | 7.9% | 56.0% | 2.2% | 20.8% | -0.11% |
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

### 7-Day (n=150)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 150 | 100.0% | 48.7% | -9.1% | -0.5% | 0.49% |

### All Time (n=1507)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1419 | 94.2% | 51.7% | -4.6% | -3.0% | -0.20% |
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
