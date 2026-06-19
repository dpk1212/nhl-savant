# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-19 ET
**Completed Picks**: 1349 | **V8 Era Picks**: 787 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (60.0%) beats 5★ (49.6%) |
| Single-wallet dependency | ⚠️ | 37% of picks are single-wallet (WR: 54.0%, ROI: 2.7%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 43 | 55.8% | 1.20u | 2.8% | 5.20u | 5.2% | -0.42% | -1.00% | Strong |
| 7-Day | 109 | 53.2% | -1.14u | -1.0% | 2.07u | 0.9% | -0.30% | -0.83% |  |
| 14-Day | 233 | 53.2% | 2.00u | 0.9% | 27.95u | 5.8% | -0.42% | 0.35% |  |
| 30-Day | 490 | 52.7% | -5.38u | -1.1% | 14.86u | 1.5% | -0.28% | -0.45% |  |
| V8 Era | 787 | 51.5% | -18.37u | -2.3% | -2.48u | -0.2% | -0.19% | -0.43% |  |
| All Time | 1349 | 52.3% | -47.88u | -3.5% | -47.36u | -2.0% | -0.29% | -0.17% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=787)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 236 | 53.6% | 53.6% | 49.6% | -4.0% | -8.9% | -4.6% | 3.14 | -0.07% | Weak |
| 4.5 | 120 | 53.4% | 53.4% | 60.0% | +6.6% | 13.6% | 13.7% | 2.68 | -0.80% | Strong |
| 4 | 156 | 52.9% | 52.9% | 48.1% | -4.8% | -7.9% | -2.5% | 1.27 | -0.13% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 96 | 53.6% | 53.6% | 52.1% | -1.6% | -0.5% | -7.5% | 0.83 | 0.09% | Fair |
| 2.5 | 97 | 53.5% | 53.5% | 50.5% | -3.0% | -3.4% | -10.9% | 0.58 | -0.19% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.6% | 60.0% | -10.4% | INVERTED |
| 4.5★ vs 4★ | 60.0% | 48.1% | +11.9% | Correct |
| 4★ vs 3.5★ | 48.1% | 51.5% | -3.4% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 52.1% | -0.6% | Flat |
| 3★ vs 2.5★ | 52.1% | 50.5% | +1.6% | Correct |
| 2.5★ vs 2★ | 50.5% | 0.0% | +50.5% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.214 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.571 |
| Brier Score | 0.2476 |
| Monotonicity Score | 0.14 |

### All Time (n=1349)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 249 | 53.8% | 53.8% | 49.8% | -4.0% | -8.9% | -5.0% | 3.12 | -0.02% | Weak |
| 4.5 | 154 | 54.4% | 54.4% | 57.8% | +3.4% | 7.9% | 7.3% | 2.66 | -0.35% | Strong |
| 4 | 271 | 54.2% | 54.2% | 50.6% | -3.7% | -5.9% | -3.1% | 1.63 | -0.36% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 256 | 54.6% | 54.6% | 50.0% | -4.6% | -8.3% | -9.9% | 1.06 | -0.31% | Weak |
| 2.5 | 204 | 54.0% | 54.0% | 52.9% | -1.1% | -2.0% | -3.1% | 0.66 | -0.50% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.8% | 57.8% | -8.0% | INVERTED |
| 4.5★ vs 4★ | 57.8% | 50.6% | +7.2% | Correct |
| 4★ vs 3.5★ | 50.6% | 56.5% | -5.9% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.0% | +6.5% | Correct |
| 3★ vs 2.5★ | 50.0% | 52.9% | -2.9% | Flat |
| 2.5★ vs 2★ | 52.9% | 0.0% | +52.9% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.262 |
| Spearman: Stars vs Flat ROI | 0.262 |
| Spearman: Stars vs CLV | -0.333 |
| Brier Score | 0.2392 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.085 | -0.011 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.186 | -0.123 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.096 | -0.057 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.132 | -0.044 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.067 | -0.017 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.037 | 0.009 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.138 | -0.041 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.177 | -0.085 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.009 | 0.031 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.138 | -0.075 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.012 | -0.001 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.184 | 0.105 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.188 | 0.111 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.157 | -0.085 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–34.97) | 129 | 50.4% | -9.2% | -4.6% | -0.08% |  |
| p20-40 (35.00–41.78) | 130 | 58.5% | 10.8% | 11.7% | -0.11% |  |
| p40-60 (41.80–47.30) | 130 | 49.2% | -5.5% | 0.6% | -0.74% |  |
| p60-80 (47.37–53.07) | 130 | 50.0% | -6.3% | -2.6% | 0.14% |  |
| p80-95 (53.10–61.12) | 130 | 48.5% | -1.8% | -10.6% | -0.07% |  |
| p95+ (61.30–83.30) | 130 | 51.5% | -2.8% | 0.9% | -0.30% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 311 | 48.2% | -8.8% | -7.5% | -0.41% |  |
| 0.90-1.05 | 265 | 49.4% | -6.8% | -5.1% | -0.06% |  |
| 1.05-1.20 | 141 | 63.1% | 23.1% | 28.9% | 0.01% |  |
| 1.20-1.35 | 38 | 47.4% | -12.6% | -18.7% | 0.17% |  |
| 1.35-1.50 | 12 | 41.7% | -22.6% | -40.2% | -0.33% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.21) | 105 | 47.6% | -9.7% | -4.3% | -0.31% |  |
| 20-40% (0.21–0.57) | 105 | 60.0% | 10.2% | 16.5% | 0.10% |  |
| 40-60% (0.58–0.86) | 106 | 51.9% | -2.5% | 8.0% | -0.57% |  |
| 60-80% (0.86–1.17) | 105 | 53.3% | 4.1% | -6.8% | 0.09% |  |
| 80-95% (1.18–1.65) | 105 | 46.7% | -9.0% | -3.5% | 0.02% |  |
| 95%+ (1.65–6.68) | 106 | 46.2% | -14.4% | -9.2% | 0.04% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 34 | 35.3% | -29.3% | -30.3% | 0.23% | Broad support |
| 0.25-0.40 | 125 | 49.6% | -3.9% | -2.8% | 0.15% | Healthy support |
| 0.40-0.60 | 191 | 48.2% | -8.6% | -0.2% | -0.25% | Concentrated |
| 0.60-0.80 | 129 | 59.7% | 10.4% | 10.1% | -0.19% | Very concentrated |
| 0.80-1.00 | 153 | 51.6% | -3.0% | -0.7% | -0.14% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 70 | 38.6% | -29.0% | -31.1% | -0.14% | 4.2 |
| Broad battle | 259 | 48.6% | -6.0% | 0.3% | 0.05% | 3.9 |
| One-wallet nuke | 308 | 52.6% | -0.2% | 0.5% | -0.33% | 3.9 |
| Thin support | 495 | 53.5% | 0.9% | 0.4% | -0.29% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=787)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 28 | 53.6% | -2.8% | 23.3% | 0.20% | 4.2 | 89.3% |
| SMALL_MOVE | 164 | 50.0% | -6.4% | -0.1% | -0.59% | 4.1 | 100.0% |
| CLEAR_MOVE | 139 | 54.7% | 0.7% | 3.8% | 0.18% | 4.1 | 100.0% |
| NEAR_START | 309 | 49.8% | -3.7% | -5.2% | -0.00% | 3.8 | 100.0% |

**All Time** (n=1349)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 545 | 53.8% | -5.0% | -3.0% | -0.47% | 3.3 | 6.1% |
| SMALL_MOVE | 167 | 49.7% | -6.9% | -1.5% | -0.54% | 4.1 | 98.2% |
| CLEAR_MOVE | 165 | 54.5% | 0.7% | 3.4% | 0.08% | 4.1 | 100.0% |
| NEAR_START | 325 | 49.8% | -4.1% | -5.5% | 0.01% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 78 / 50.0% / -9.7% | 69 / 58.0% / 4.2% | 122 / 50.8% / -2.6% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 53 / 56.6% / 9.2% | 41 / 46.3% / -15.0% | 81 / 51.9% / 4.6% |
| 2.5-3★ | 5 / 60.0% / 13.9% | 29 / 41.4% / -19.8% | 29 / 58.6% / 14.7% | 98 / 46.9% / -11.5% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 784 | 51.4% | -2.5% | -0.3% | 4.0 | -0.19% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 834 | 51.4% | -2.7% | -0.6% | 4.0 | -0.19% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1324 | 100% |
| LOCKED (direct) | 98 | 7.4% |
| Promoted (SHADOW→LOCKED) | 867 | 65.5% |
| Rejected (stayed SHADOW) | 193 | 14.6% |
| Superseded (side flipped) | 161 | 12.2% |
| Muted | 473 | 35.7% |
| Cancelled | 20 | 1.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=787)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -2.48u | -0.2% | — |
| Flat 1.0u | -18.37u | -2.3% | +15.89u |
| Lock units only | -6.54u | — | +4.06u |
| Units change only on star change | -2.13u | — | -0.35u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 236 | 3.14 | -8.9% | -4.6% | -13.32u | Sizing hurts |
| 4.5 | 120 | 2.68 | 13.6% | 13.7% | +27.67u | Sizing helps |
| 4 | 156 | 1.27 | -7.9% | -2.5% | +7.37u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 96 | 0.83 | -0.5% | -7.5% | -5.54u | Sizing hurts |
| 2.5 | 97 | 0.58 | -3.4% | -10.9% | -2.93u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |

### All Time (n=1349)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -47.36u | -2.0% | — |
| Flat 1.0u | -47.88u | -3.5% | +0.52u |
| Lock units only | -40.66u | — | -6.70u |
| Units change only on star change | -46.18u | — | -1.18u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 249 | 3.12 | -8.9% | -5.0% | -16.91u | Sizing hurts |
| 4.5 | 154 | 2.66 | 7.9% | 7.3% | +17.65u | Sizing helps |
| 4 | 271 | 1.63 | -5.9% | -3.1% | +2.13u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 256 | 1.06 | -8.3% | -9.9% | -5.69u | Sizing hurts |
| 2.5 | 204 | 0.66 | -2.0% | -3.1% | -0.21u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 787 | 53.2% | 51.5% | -1.8% | -2.3% | -0.19% | Neutral |
| 4.5-5★ | 356 | 53.5% | 53.1% | -0.4% | -1.3% | -0.32% | Neutral |
| 3.5-4★ | 224 | 52.4% | 49.1% | -3.3% | -4.0% | -0.11% | Below market |
| 2.5-3★ | 195 | 53.6% | 51.8% | -1.8% | -1.0% | -0.06% | Neutral |
| CLEAR_MOVE only | 139 | 54.2% | 54.7% | +0.5% | 0.7% | 0.18% | Neutral |
| NO_MOVE only | 28 | 54.6% | 53.6% | -1.0% | -2.8% | 0.20% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=69)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.035 | 40.895 | 0.22 |  |
| Rank_norm | 54.836 | 45.195 | 0.40 |  |
| PnL_norm | 50.170 | 43.329 | 0.36 |  |
| WalletBase | 47.618 | 42.484 | 0.40 |  |
| SizeRatio | 1.347 | 1.089 | 0.20 |  |
| ConvictionMult | 0.950 | 0.908 | 0.26 |  |
| WalletCountFor | 2.853 | 2.391 | 0.25 |  |
| TopShare | 0.606 | 0.671 | 0.26 |  |
| ForSide | 140.161 | 95.114 | 0.41 |  |
| AgainstSide | 49.923 | 42.846 | 0.09 |  |
| NetEdge | 0.977 | 0.587 | 0.45 |  |
| WalletPlayScore | 0.882 | 0.035 | 0.36 |  |

### V8 Era (n=632)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.035 | 43.325 | 0.09 |  |
| Rank_norm | 54.836 | 60.826 | 0.25 |  |
| PnL_norm | 50.170 | 53.130 | 0.16 |  |
| WalletBase | 47.618 | 47.506 | 0.01 |  |
| SizeRatio | 1.347 | 1.375 | 0.02 |  |
| ConvictionMult | 0.950 | 0.961 | 0.06 |  |
| WalletCountFor | 2.853 | 2.853 | 0.00 |  |
| TopShare | 0.606 | 0.606 | 0.00 |  |
| ForSide | 140.161 | 140.161 | 0.00 |  |
| AgainstSide | 49.923 | 49.923 | 0.00 |  |
| NetEdge | 0.977 | 0.977 | 0.00 |  |
| WalletPlayScore | 0.882 | 0.882 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=787)

No major failure modes detected.

### 7-Day (n=109)

- **Ranking issue**: ≤3★ WR (61%) beats ≥4★ (51%)

### All Time (n=1349)

- **Environment issue**: 40.4% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 787 |
| V8 flat ROI | -2.3% |
| V8 model ROI | -0.2% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -1.3% |
| 2.5-3★ ROI | -1.0% |
| CLEAR_MOVE ROI | 0.7% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 37.0% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.07% | 4.5★: -0.80% | 4★: -0.13% | 3.5★: -0.07% | 3★: 0.09% | 2.5★: -0.19% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=787)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 701 | 89.1% | 50.9% | -2.8% | -1.9% | -0.21% |
| MUTED | 75 | 9.5% | 56.0% | 2.2% | 20.8% | -0.11% |
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

### 7-Day (n=109)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 109 | 100.0% | 53.2% | -1.0% | 0.9% | -0.30% |

### All Time (n=1349)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1261 | 93.5% | 52.0% | -4.1% | -3.3% | -0.29% |
| MUTED | 75 | 5.6% | 56.0% | 2.2% | 20.8% | -0.11% |
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
