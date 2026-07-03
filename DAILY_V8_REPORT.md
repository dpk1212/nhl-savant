# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-07-03 ET
**Completed Picks**: 1669 | **V8 Era Picks**: 1107 | **V8 Since**: 2026-04-18
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
| Single-wallet dependency | ⚠️ | 43% of picks are single-wallet (WR: 50.7%, ROI: -3.6%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 73 | 47.9% | -4.74u | -6.5% | -1.35u | -1.1% | 0.16% | -0.59% |  |
| 7-Day | 162 | 48.1% | -19.07u | -11.8% | 2.79u | 1.1% | 0.06% | -0.26% |  |
| 14-Day | 312 | 48.4% | -32.67u | -10.5% | 1.37u | 0.3% | 0.26% | 0.44% |  |
| 30-Day | 585 | 50.8% | -28.59u | -4.9% | 27.23u | 2.5% | -0.05% | 0.25% |  |
| V8 Era | 1107 | 50.6% | -51.21u | -4.6% | -1.11u | -0.1% | -0.06% | -0.35% |  |
| All Time | 1669 | 51.6% | -80.72u | -4.8% | -45.99u | -1.6% | -0.17% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=1107)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 292 | 53.8% | 53.8% | 49.7% | -4.1% | -9.6% | -6.0% | 3.27 | -0.24% | Weak |
| 4.5 | 217 | 51.9% | 51.9% | 52.5% | +0.6% | -0.7% | 5.6% | 2.55 | 0.28% | Fair |
| 4 | 205 | 52.3% | 52.3% | 48.8% | -3.5% | -6.5% | 10.5% | 1.20 | -0.37% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 144 | 52.4% | 52.4% | 50.7% | -1.7% | -2.4% | -5.9% | 0.71 | 0.67% | Fair |
| 2.5 | 161 | 53.1% | 53.1% | 50.3% | -2.8% | -5.5% | 0.4% | 0.45 | -0.42% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 16 | 54.2% | 54.2% | 62.5% | +8.3% | 7.2% | 17.9% | 0.44 | 0.10% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.7% | 52.5% | -2.8% | Flat |
| 4.5★ vs 4★ | 52.5% | 48.8% | +3.7% | Correct |
| 4★ vs 3.5★ | 48.8% | 51.5% | -2.7% | Flat |
| 3.5★ vs 3★ | 51.5% | 50.7% | +0.8% | Correct |
| 3★ vs 2.5★ | 50.7% | 50.3% | +0.4% | Correct |
| 2.5★ vs 2★ | 50.3% | 0.0% | +50.3% | Correct |
| 2★ vs 1★ | 0.0% | 62.5% | -62.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.119 |
| Spearman: Stars vs Flat ROI | -0.214 |
| Spearman: Stars vs CLV | -0.286 |
| Brier Score | 0.2416 |
| Monotonicity Score | -0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1669)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 305 | 54.0% | 54.0% | 49.8% | -4.2% | -9.5% | -6.3% | 3.24 | -0.20% | Weak |
| 4.5 | 251 | 52.7% | 52.7% | 52.2% | -0.5% | -2.3% | 2.6% | 2.56 | 0.43% | Fair |
| 4 | 320 | 53.6% | 53.6% | 50.6% | -3.0% | -5.4% | 3.5% | 1.53 | -0.49% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 304 | 53.9% | 53.9% | 49.7% | -4.2% | -8.0% | -9.1% | 0.97 | 0.08% | Weak |
| 2.5 | 268 | 53.7% | 53.7% | 52.2% | -1.4% | -3.6% | 1.5% | 0.56 | -0.57% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 16 | 54.2% | 54.2% | 62.5% | +8.3% | 7.2% | 17.9% | 0.44 | 0.10% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.8% | 52.2% | -2.4% | Flat |
| 4.5★ vs 4★ | 52.2% | 50.6% | +1.6% | Correct |
| 4★ vs 3.5★ | 50.6% | 56.5% | -5.9% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.7% | +6.8% | Correct |
| 3★ vs 2.5★ | 49.7% | 52.2% | -2.5% | Flat |
| 2.5★ vs 2★ | 52.2% | 0.0% | +52.2% | Correct |
| 2★ vs 1★ | 0.0% | 62.5% | -62.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.190 |
| Spearman: Stars vs Flat ROI | -0.190 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2368 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.081 | -0.015 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.152 | -0.096 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.096 | -0.049 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.110 | -0.027 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.047 | -0.007 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.023 | 0.014 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.116 | -0.029 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.135 | -0.065 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.010 | 0.040 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.107 | -0.062 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.035 | 0.015 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.126 | 0.078 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.133 | 0.085 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.105 | -0.065 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.10–32.55) | 183 | 45.9% | -15.8% | -2.8% | 0.26% |  |
| p20-40 (32.57–38.60) | 183 | 51.4% | -6.0% | 5.9% | -0.02% |  |
| p40-60 (38.60–44.20) | 183 | 59.6% | 14.0% | 7.6% | -0.79% |  |
| p60-80 (44.30–50.15) | 183 | 50.3% | -6.9% | 0.8% | -0.22% |  |
| p80-95 (50.20–57.83) | 183 | 48.1% | -4.3% | -7.2% | 0.68% |  |
| p95+ (57.83–83.30) | 184 | 47.8% | -9.3% | -8.5% | -0.26% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 479 | 48.0% | -9.4% | -1.7% | -0.34% |  |
| 0.90-1.05 | 358 | 48.9% | -8.9% | -8.1% | 0.27% |  |
| 1.05-1.20 | 182 | 62.6% | 20.5% | 26.5% | -0.15% |  |
| 1.20-1.35 | 51 | 45.1% | -16.4% | -17.2% | 0.93% |  |
| 1.35-1.50 | 13 | 38.5% | -28.6% | -47.4% | -0.54% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.19) | 134 | 47.0% | -10.6% | -1.4% | -0.16% |  |
| 20-40% (0.19–0.51) | 134 | 56.7% | 4.4% | 11.3% | -0.17% |  |
| 40-60% (0.52–0.80) | 135 | 54.8% | 1.9% | 6.1% | -0.03% |  |
| 60-80% (0.80–1.12) | 134 | 50.7% | -1.9% | 0.0% | 0.40% |  |
| 80-95% (1.12–1.60) | 134 | 47.0% | -9.5% | -3.7% | -0.19% |  |
| 95%+ (1.60–6.68) | 135 | 49.6% | -9.2% | -8.0% | -0.15% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 44 | 43.2% | -16.1% | -14.3% | 0.05% | Broad support |
| 0.25-0.40 | 154 | 50.6% | -3.5% | -1.1% | 0.13% | Healthy support |
| 0.40-0.60 | 255 | 49.0% | -8.1% | -0.4% | -0.10% | Concentrated |
| 0.60-0.80 | 156 | 57.1% | 5.1% | 6.6% | -0.16% | Very concentrated |
| 0.80-1.00 | 197 | 50.8% | -4.2% | 0.6% | -0.05% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 91 | 39.6% | -29.6% | -27.3% | -0.31% | 4.2 |
| Broad battle | 329 | 50.5% | -3.3% | 4.2% | 0.04% | 3.7 |
| One-wallet nuke | 498 | 50.0% | -5.2% | -0.1% | -0.06% | 3.9 |
| Thin support | 723 | 51.2% | -3.6% | -0.5% | -0.06% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=1107)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 35 | 54.3% | -2.8% | 33.4% | 1.05% | 4.0 | 91.4% |
| SMALL_MOVE | 207 | 50.2% | -6.1% | 0.7% | -0.51% | 4.0 | 100.0% |
| CLEAR_MOVE | 149 | 53.7% | -1.5% | 3.0% | 0.22% | 4.1 | 100.0% |
| NEAR_START | 423 | 50.4% | -3.9% | -4.0% | -0.01% | 3.7 | 100.0% |

**All Time** (n=1669)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 552 | 53.8% | -5.0% | -2.1% | -0.39% | 3.3 | 7.2% |
| SMALL_MOVE | 210 | 50.0% | -6.5% | -0.4% | -0.47% | 4.0 | 98.6% |
| CLEAR_MOVE | 175 | 53.7% | -1.2% | 2.8% | 0.13% | 4.1 | 100.0% |
| NEAR_START | 439 | 50.3% | -4.2% | -4.4% | 0.01% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 16 / 62.5% / 5.6% | 102 / 50.0% / -8.6% | 75 / 57.3% / 2.3% | 160 / 49.4% / -7.4% |
| 3.5-4★ | 11 / 36.4% / -29.3% | 59 / 57.6% / 10.7% | 43 / 44.2% / -19.0% | 99 / 53.5% / 6.9% |
| 2.5-3★ | 7 / 57.1% / 11.2% | 40 / 40.0% / -22.9% | 31 / 58.1% / 13.3% | 153 / 49.0% / -7.4% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 6 / 50.0% / -16.4% | — | 11 / 54.5% / -3.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1104 | 50.5% | -4.7% | -0.2% | 3.9 | -0.06% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1154 | 50.6% | -4.8% | -0.3% | 3.9 | -0.06% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1858 | 100% |
| LOCKED (direct) | 107 | 5.8% |
| Promoted (SHADOW→LOCKED) | 1223 | 65.8% |
| Rejected (stayed SHADOW) | 204 | 11.0% |
| Superseded (side flipped) | 319 | 17.2% |
| Muted | 642 | 34.6% |
| Cancelled | 20 | 1.1% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=1107)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -1.11u | -0.1% | — |
| Flat 1.0u | -51.21u | -4.6% | +50.10u |
| Lock units only | -71.45u | — | +70.34u |
| Units change only on star change | -67.04u | — | +65.93u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 292 | 3.27 | -9.6% | -6.0% | -29.76u | Sizing hurts |
| 4.5 | 217 | 2.55 | -0.7% | 5.6% | +32.49u | Sizing helps |
| 4 | 205 | 1.20 | -6.5% | 10.5% | +39.40u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 144 | 0.71 | -2.4% | -5.9% | -2.54u | Sizing hurts |
| 2.5 | 161 | 0.45 | -5.5% | 0.4% | +9.22u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 16 | 0.44 | 7.2% | 17.9% | +0.09u | Neutral |

### All Time (n=1669)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -45.99u | -1.6% | — |
| Flat 1.0u | -80.72u | -4.8% | +34.73u |
| Lock units only | -105.56u | — | +59.57u |
| Units change only on star change | -111.08u | — | +65.09u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 305 | 3.24 | -9.5% | -6.3% | -33.35u | Sizing hurts |
| 4.5 | 251 | 2.56 | -2.3% | 2.6% | +22.47u | Sizing helps |
| 4 | 320 | 1.53 | -5.4% | 3.5% | +34.16u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 304 | 0.97 | -8.0% | -9.1% | -2.69u | Sizing hurts |
| 2.5 | 268 | 0.56 | -3.6% | 1.5% | +11.93u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 16 | 0.44 | 7.2% | 17.9% | +0.09u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 1107 | 52.7% | 50.6% | -2.1% | -4.6% | -0.06% | Below market |
| 4.5-5★ | 509 | 53.0% | 50.9% | -2.1% | -5.8% | -0.02% | Below market |
| 3.5-4★ | 273 | 52.0% | 49.5% | -2.6% | -3.7% | -0.30% | Below market |
| 2.5-3★ | 307 | 52.8% | 50.8% | -2.0% | -3.5% | 0.09% | Neutral |
| CLEAR_MOVE only | 149 | 54.1% | 53.7% | -0.4% | -1.5% | 0.22% | Neutral |
| NO_MOVE only | 35 | 52.9% | 54.3% | +1.4% | -2.8% | 1.05% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=93)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.524 | 38.942 | 0.26 |  |
| Rank_norm | 47.818 | 39.182 | 0.32 |  |
| PnL_norm | 44.528 | 32.929 | 0.54 |  |
| WalletBase | 44.896 | 38.994 | 0.45 |  |
| SizeRatio | 1.259 | 1.216 | 0.03 |  |
| ConvictionMult | 0.936 | 0.959 | 0.14 |  |
| WalletCountFor | 2.928 | 3.785 | 0.43 |  |
| TopShare | 0.605 | 0.533 | 0.29 |  |
| ForSide | 135.242 | 140.904 | 0.05 |  |
| AgainstSide | 47.815 | 43.958 | 0.05 |  |
| NetEdge | 0.946 | 1.035 | 0.10 |  |
| WalletPlayScore | 0.867 | 1.521 | 0.27 |  |

### V8 Era (n=806)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.524 | 42.284 | 0.07 |  |
| Rank_norm | 47.818 | 56.198 | 0.31 |  |
| PnL_norm | 44.528 | 49.224 | 0.22 |  |
| WalletBase | 44.896 | 45.726 | 0.06 |  |
| SizeRatio | 1.259 | 1.344 | 0.07 |  |
| ConvictionMult | 0.936 | 0.957 | 0.13 |  |
| WalletCountFor | 2.928 | 2.928 | 0.00 |  |
| TopShare | 0.605 | 0.605 | 0.00 |  |
| ForSide | 135.242 | 135.242 | 0.00 |  |
| AgainstSide | 47.815 | 47.815 | 0.00 |  |
| NetEdge | 0.946 | 0.946 | 0.00 |  |
| WalletPlayScore | 0.867 | 0.867 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=1107)

No major failure modes detected.

### 7-Day (n=162)

- **Ranking issue**: ≤3★ WR (54%) beats ≥4★ (44%)
- **Concentration issue**: 31 high-concentration picks (TopShare>0.6) at -19.0% ROI

### All Time (n=1669)

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
| V8 era picks | 1107 |
| V8 flat ROI | -4.6% |
| V8 model ROI | -0.1% |
| V8 star monotonicity score | -0.14 |
| 4.5-5★ ROI | -5.8% |
| 2.5-3★ ROI | -3.5% |
| CLEAR_MOVE ROI | -1.5% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 43.1% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.24% | 4.5★: 0.28% | 4★: -0.37% | 3.5★: -0.07% | 3★: 0.67% | 2.5★: -0.42% | 2★: 0.67% | 1★: 0.10% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=1107)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1021 | 92.2% | 50.1% | -5.1% | -1.3% | -0.05% |
| MUTED | 75 | 6.8% | 56.0% | 2.2% | 20.8% | -0.11% |
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

### 7-Day (n=162)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 162 | 100.0% | 48.1% | -11.8% | 1.1% | 0.06% |

### All Time (n=1669)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1581 | 94.7% | 51.3% | -5.4% | -2.6% | -0.17% |
| MUTED | 75 | 4.5% | 56.0% | 2.2% | 20.8% | -0.11% |
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
