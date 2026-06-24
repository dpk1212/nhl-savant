# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-24 ET
**Completed Picks**: 1441 | **V8 Era Picks**: 879 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (57.6%) beats 5★ (50.2%) |
| Single-wallet dependency | ⚠️ | 41% of picks are single-wallet (WR: 53.5%, ROI: 1.8%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 59 | 44.1% | -9.30u | -15.8% | -1.77u | -1.5% | -0.83% | -0.60% | Cold streak |
| 7-Day | 113 | 50.4% | -6.03u | -5.3% | 8.31u | 3.4% | -0.56% | -0.80% |  |
| 14-Day | 235 | 50.2% | -12.58u | -5.4% | -6.90u | -1.4% | -0.40% | -1.71% |  |
| 30-Day | 497 | 52.3% | -8.81u | -1.8% | 38.97u | 3.8% | -0.44% | -0.46% |  |
| V8 Era | 879 | 51.2% | -25.53u | -2.9% | -0.22u | -0.0% | -0.23% | -0.44% |  |
| All Time | 1441 | 52.1% | -55.04u | -3.8% | -45.10u | -1.8% | -0.31% | -0.17% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=879)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 261 | 53.5% | 53.5% | 50.2% | -3.3% | -7.6% | -3.6% | 3.20 | -0.15% | Weak |
| 4.5 | 151 | 53.3% | 53.3% | 57.6% | +4.3% | 8.3% | 10.0% | 2.60 | -0.68% | Strong |
| 4 | 167 | 53.0% | 53.0% | 46.7% | -6.3% | -10.7% | -1.0% | 1.26 | -0.18% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 109 | 53.4% | 53.4% | 52.3% | -1.1% | 0.4% | -7.0% | 0.79 | 0.02% | Fair |
| 2.5 | 108 | 52.9% | 52.9% | 50.0% | -2.9% | -3.4% | -10.4% | 0.55 | -0.25% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 11 | 54.2% | 54.2% | 54.5% | +0.4% | 0.1% | 13.6% | 0.45 | 0.01% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.2% | 57.6% | -7.4% | INVERTED |
| 4.5★ vs 4★ | 57.6% | 46.7% | +10.9% | Correct |
| 4★ vs 3.5★ | 46.7% | 51.5% | -4.8% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 52.3% | -0.8% | Flat |
| 3★ vs 2.5★ | 52.3% | 50.0% | +2.3% | Correct |
| 2.5★ vs 2★ | 50.0% | 0.0% | +50.0% | Correct |
| 2★ vs 1★ | 0.0% | 54.5% | -54.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.119 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.571 |
| Brier Score | 0.2467 |
| Monotonicity Score | 0.14 |

### All Time (n=1441)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 274 | 53.8% | 53.8% | 50.4% | -3.4% | -7.7% | -4.0% | 3.17 | -0.11% | Weak |
| 4.5 | 185 | 54.1% | 54.1% | 56.2% | +2.1% | 4.5% | 5.2% | 2.60 | -0.33% | Fair |
| 4 | 282 | 54.2% | 54.2% | 49.6% | -4.6% | -7.7% | -2.4% | 1.61 | -0.39% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 269 | 54.5% | 54.5% | 50.2% | -4.3% | -7.6% | -9.6% | 1.04 | -0.32% | Weak |
| 2.5 | 215 | 53.7% | 53.7% | 52.6% | -1.1% | -2.1% | -3.1% | 0.64 | -0.52% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 11 | 54.2% | 54.2% | 54.5% | +0.4% | 0.1% | 13.6% | 0.45 | 0.01% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.4% | 56.2% | -5.8% | INVERTED |
| 4.5★ vs 4★ | 56.2% | 49.6% | +6.6% | Correct |
| 4★ vs 3.5★ | 49.6% | 56.5% | -6.9% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.2% | +6.3% | Correct |
| 3★ vs 2.5★ | 50.2% | 52.6% | -2.4% | Flat |
| 2.5★ vs 2★ | 52.6% | 0.0% | +52.6% | Correct |
| 2★ vs 1★ | 0.0% | 54.5% | -54.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.143 |
| Spearman: Stars vs Flat ROI | 0.048 |
| Spearman: Stars vs CLV | -0.333 |
| Brier Score | 0.2392 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.081 | -0.011 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.181 | -0.122 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.092 | -0.056 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.132 | -0.047 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.071 | -0.017 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.042 | 0.008 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.139 | -0.046 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.175 | -0.087 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.007 | 0.029 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.137 | -0.076 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.012 | -0.004 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.180 | 0.106 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.184 | 0.112 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.154 | -0.088 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.60–34.50) | 145 | 48.3% | -11.4% | -0.6% | -0.08% |  |
| p20-40 (34.50–39.93) | 145 | 57.2% | 6.2% | 11.5% | -0.25% |  |
| p40-60 (39.95–45.96) | 145 | 51.7% | 0.1% | -7.1% | -0.76% |  |
| p60-80 (45.99–51.80) | 145 | 50.3% | -5.5% | 1.0% | -0.05% |  |
| p80-95 (51.90–59.65) | 145 | 51.0% | 2.0% | -2.2% | -0.03% |  |
| p95+ (59.78–83.30) | 146 | 47.9% | -9.5% | -7.2% | -0.24% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 375 | 48.3% | -8.8% | -5.0% | -0.43% |  |
| 0.90-1.05 | 283 | 48.8% | -8.1% | -7.3% | -0.11% |  |
| 1.05-1.20 | 147 | 63.9% | 24.2% | 31.5% | -0.01% |  |
| 1.20-1.35 | 39 | 48.7% | -10.0% | -18.7% | 0.16% |  |
| 1.35-1.50 | 12 | 41.7% | -22.6% | -40.2% | -0.33% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.19) | 112 | 46.4% | -11.6% | -6.4% | -0.32% |  |
| 20-40% (0.19–0.52) | 113 | 57.5% | 6.1% | 12.1% | -0.06% |  |
| 40-60% (0.52–0.82) | 113 | 54.9% | 2.8% | 9.9% | -0.48% |  |
| 60-80% (0.82–1.14) | 112 | 50.9% | -0.5% | -7.2% | 0.07% |  |
| 80-95% (1.15–1.61) | 113 | 46.9% | -9.2% | -0.8% | 0.04% |  |
| 95%+ (1.62–6.68) | 113 | 46.9% | -12.8% | -9.2% | 0.02% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 34 | 35.3% | -29.3% | -30.3% | 0.23% | Broad support |
| 0.25-0.40 | 127 | 49.6% | -4.1% | -3.0% | 0.14% | Healthy support |
| 0.40-0.60 | 209 | 48.3% | -8.4% | -0.9% | -0.21% | Concentrated |
| 0.60-0.80 | 134 | 58.2% | 7.7% | 10.1% | -0.18% | Very concentrated |
| 0.80-1.00 | 172 | 51.2% | -3.4% | 0.2% | -0.23% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 73 | 39.7% | -27.2% | -27.9% | -0.16% | 4.2 |
| Broad battle | 278 | 48.6% | -6.3% | 0.1% | 0.07% | 3.9 |
| One-wallet nuke | 375 | 52.3% | -0.8% | 1.2% | -0.43% | 3.9 |
| Thin support | 574 | 52.8% | -0.4% | -0.1% | -0.35% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=879)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 28 | 53.6% | -2.8% | 23.3% | 0.20% | 4.2 | 89.3% |
| SMALL_MOVE | 177 | 50.3% | -5.4% | 1.2% | -0.54% | 4.1 | 100.0% |
| CLEAR_MOVE | 143 | 53.8% | -0.8% | 2.6% | 0.07% | 4.1 | 100.0% |
| NEAR_START | 336 | 49.4% | -4.8% | -5.3% | -0.01% | 3.8 | 100.0% |

**All Time** (n=1441)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 545 | 53.8% | -5.0% | -3.0% | -0.47% | 3.3 | 6.1% |
| SMALL_MOVE | 180 | 50.0% | -5.9% | -0.1% | -0.49% | 4.1 | 98.3% |
| CLEAR_MOVE | 169 | 53.8% | -0.6% | 2.5% | -0.00% | 4.1 | 100.0% |
| NEAR_START | 352 | 49.4% | -5.1% | -5.6% | 0.00% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 87 / 49.4% / -9.9% | 70 / 57.1% / 2.7% | 135 / 50.4% / -4.4% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 54 / 57.4% / 10.7% | 42 / 45.2% / -17.1% | 87 / 50.6% / 1.4% |
| 2.5-3★ | 5 / 60.0% / 13.9% | 31 / 41.9% / -17.8% | 31 / 58.1% / 13.3% | 106 / 47.2% / -10.0% |
| 1.0-2★ | — | 5 / 40.0% / -25.6% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 876 | 51.1% | -3.0% | -0.1% | 4.0 | -0.24% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 926 | 51.2% | -3.2% | -0.4% | 4.0 | -0.23% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1496 | 100% |
| LOCKED (direct) | 101 | 6.8% |
| Promoted (SHADOW→LOCKED) | 1000 | 66.8% |
| Rejected (stayed SHADOW) | 197 | 13.2% |
| Superseded (side flipped) | 193 | 12.9% |
| Muted | 518 | 34.6% |
| Cancelled | 20 | 1.3% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=879)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -0.22u | -0.0% | — |
| Flat 1.0u | -25.53u | -2.9% | +25.31u |
| Lock units only | -9.24u | — | +9.02u |
| Units change only on star change | -4.83u | — | +4.61u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 261 | 3.20 | -7.6% | -3.6% | -10.22u | Sizing hurts |
| 4.5 | 151 | 2.60 | 8.3% | 10.0% | +26.58u | Sizing helps |
| 4 | 167 | 1.26 | -10.7% | -1.0% | +15.92u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 109 | 0.79 | 0.4% | -7.0% | -6.36u | Sizing hurts |
| 2.5 | 108 | 0.55 | -3.4% | -10.4% | -2.48u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 11 | 0.45 | 0.1% | 13.6% | +0.67u | Sizing helps |

### All Time (n=1441)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -45.10u | -1.8% | — |
| Flat 1.0u | -55.04u | -3.8% | +9.94u |
| Lock units only | -43.36u | — | -1.74u |
| Units change only on star change | -48.88u | — | +3.78u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 274 | 3.17 | -7.7% | -4.0% | -13.81u | Sizing hurts |
| 4.5 | 185 | 2.60 | 4.5% | 5.2% | +16.57u | Sizing helps |
| 4 | 282 | 1.61 | -7.7% | -2.4% | +10.68u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 269 | 1.04 | -7.6% | -9.6% | -6.51u | Sizing hurts |
| 2.5 | 215 | 0.64 | -2.1% | -3.1% | +0.23u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 11 | 0.45 | 0.1% | 13.6% | +0.67u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 879 | 53.1% | 51.2% | -1.9% | -2.9% | -0.23% | Neutral |
| 4.5-5★ | 412 | 53.4% | 52.9% | -0.5% | -1.8% | -0.35% | Neutral |
| 3.5-4★ | 235 | 52.5% | 48.1% | -4.4% | -6.3% | -0.15% | Below market |
| 2.5-3★ | 219 | 53.2% | 51.6% | -1.6% | -0.7% | -0.12% | Neutral |
| CLEAR_MOVE only | 143 | 54.2% | 53.8% | -0.3% | -0.8% | 0.07% | Neutral |
| NO_MOVE only | 28 | 54.6% | 53.6% | -1.0% | -2.8% | 0.20% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=54)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.340 | 37.252 | 0.39 |  |
| Rank_norm | 52.603 | 38.740 | 0.55 |  |
| PnL_norm | 48.712 | 37.432 | 0.56 |  |
| WalletBase | 46.649 | 38.747 | 0.61 |  |
| SizeRatio | 1.278 | 0.874 | 0.32 |  |
| ConvictionMult | 0.940 | 0.891 | 0.30 |  |
| WalletCountFor | 2.799 | 2.185 | 0.34 |  |
| TopShare | 0.614 | 0.701 | 0.34 |  |
| ForSide | 135.511 | 73.044 | 0.58 |  |
| AgainstSide | 49.255 | 40.954 | 0.11 |  |
| NetEdge | 0.936 | 0.382 | 0.64 |  |
| WalletPlayScore | 0.783 | -0.378 | 0.49 |  |

### V8 Era (n=676)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.340 | 42.805 | 0.08 |  |
| Rank_norm | 52.603 | 59.543 | 0.27 |  |
| PnL_norm | 48.712 | 52.212 | 0.17 |  |
| WalletBase | 46.649 | 46.895 | 0.02 |  |
| SizeRatio | 1.278 | 1.342 | 0.05 |  |
| ConvictionMult | 0.940 | 0.956 | 0.10 |  |
| WalletCountFor | 2.799 | 2.799 | 0.00 |  |
| TopShare | 0.614 | 0.614 | 0.00 |  |
| ForSide | 135.511 | 135.511 | 0.00 |  |
| AgainstSide | 49.255 | 49.255 | 0.00 |  |
| NetEdge | 0.936 | 0.936 | 0.00 |  |
| WalletPlayScore | 0.783 | 0.783 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=879)

No major failure modes detected.

### 7-Day (n=113)

- **Concentration issue**: 26 high-concentration picks (TopShare>0.6) at -10.1% ROI
- **Odds issue**: Avg CLV -0.56% — consistently getting bad closing lines

### All Time (n=1441)

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
| V8 era picks | 879 |
| V8 flat ROI | -2.9% |
| V8 model ROI | -0.0% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -1.8% |
| 2.5-3★ ROI | -0.7% |
| CLEAR_MOVE ROI | -0.8% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 40.6% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.15% | 4.5★: -0.68% | 4★: -0.18% | 3.5★: -0.07% | 3★: 0.02% | 2.5★: -0.25% | 2★: 0.67% | 1★: 0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=879)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 793 | 90.2% | 50.7% | -3.4% | -1.5% | -0.25% |
| MUTED | 75 | 8.5% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.3% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=113)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 113 | 100.0% | 50.4% | -5.3% | 3.4% | -0.56% |

### All Time (n=1441)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1353 | 93.9% | 51.8% | -4.4% | -2.9% | -0.32% |
| MUTED | 75 | 5.2% | 56.0% | 2.2% | 20.8% | -0.11% |
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
