# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-20 ET
**Completed Picks**: 1370 | **V8 Era Picks**: 808 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (59.2%) beats 5★ (50.0%) |
| Single-wallet dependency | ⚠️ | 38% of picks are single-wallet (WR: 53.6%, ROI: 2.0%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 42 | 57.1% | 2.61u | 6.2% | 8.05u | 7.7% | -0.37% | -0.45% | Strong |
| 7-Day | 113 | 53.1% | -1.33u | -1.2% | -1.99u | -0.8% | -0.32% | -0.81% |  |
| 14-Day | 236 | 52.5% | -1.09u | -0.5% | 18.74u | 3.8% | -0.44% | 0.44% |  |
| 30-Day | 501 | 52.7% | -4.65u | -0.9% | 14.23u | 1.4% | -0.29% | -0.45% |  |
| V8 Era | 808 | 51.6% | -16.88u | -2.1% | -0.48u | -0.0% | -0.19% | -0.43% |  |
| All Time | 1370 | 52.4% | -46.40u | -3.4% | -45.36u | -1.9% | -0.29% | -0.17% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=808)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 240 | 53.6% | 53.6% | 50.0% | -3.6% | -8.2% | -4.9% | 3.15 | -0.12% | Weak |
| 4.5 | 130 | 53.2% | 53.2% | 59.2% | +6.0% | 11.9% | 13.4% | 2.67 | -0.74% | Strong |
| 4 | 158 | 52.9% | 52.9% | 48.1% | -4.8% | -7.9% | -1.2% | 1.27 | -0.13% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 98 | 53.7% | 53.7% | 53.1% | -0.7% | 1.1% | -7.5% | 0.82 | 0.09% | Fair |
| 2.5 | 100 | 53.1% | 53.1% | 50.0% | -3.1% | -3.7% | -10.8% | 0.57 | -0.14% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.0% | 59.2% | -9.2% | INVERTED |
| 4.5★ vs 4★ | 59.2% | 48.1% | +11.1% | Correct |
| 4★ vs 3.5★ | 48.1% | 51.5% | -3.4% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 53.1% | -1.6% | Flat |
| 3★ vs 2.5★ | 53.1% | 50.0% | +3.1% | Correct |
| 2.5★ vs 2★ | 50.0% | 0.0% | +50.0% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.167 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.571 |
| Brier Score | 0.2467 |
| Monotonicity Score | 0.14 |

### All Time (n=1370)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 253 | 53.9% | 53.9% | 50.2% | -3.7% | -8.2% | -5.3% | 3.13 | -0.07% | Weak |
| 4.5 | 164 | 54.1% | 54.1% | 57.3% | +3.2% | 6.9% | 7.4% | 2.65 | -0.33% | Strong |
| 4 | 273 | 54.2% | 54.2% | 50.5% | -3.6% | -5.9% | -2.5% | 1.63 | -0.36% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 258 | 54.6% | 54.6% | 50.4% | -4.2% | -7.6% | -9.8% | 1.06 | -0.31% | Weak |
| 2.5 | 207 | 53.8% | 53.8% | 52.7% | -1.1% | -2.1% | -3.1% | 0.66 | -0.47% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.2% | 57.3% | -7.1% | INVERTED |
| 4.5★ vs 4★ | 57.3% | 50.5% | +6.8% | Correct |
| 4★ vs 3.5★ | 50.5% | 56.5% | -6.0% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.4% | +6.1% | Correct |
| 3★ vs 2.5★ | 50.4% | 52.7% | -2.3% | Flat |
| 2.5★ vs 2★ | 52.7% | 0.0% | +52.7% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.500 |
| Spearman: Stars vs Flat ROI | 0.262 |
| Spearman: Stars vs CLV | -0.333 |
| Brier Score | 0.2388 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.095 | -0.016 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.184 | -0.126 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.093 | -0.061 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.141 | -0.051 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.072 | -0.017 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.041 | 0.011 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.147 | -0.046 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.184 | -0.088 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.005 | 0.034 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.147 | -0.080 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.011 | -0.001 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.183 | 0.104 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.186 | 0.110 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.162 | -0.089 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.60–34.88) | 133 | 50.4% | -8.8% | -5.8% | -0.10% |  |
| p20-40 (34.90–41.20) | 133 | 59.4% | 12.2% | 15.0% | -0.15% |  |
| p40-60 (41.20–47.07) | 134 | 48.5% | -6.9% | -3.9% | -0.75% |  |
| p60-80 (47.10–52.73) | 133 | 51.9% | -2.8% | -1.2% | 0.14% |  |
| p80-95 (52.86–60.94) | 133 | 48.9% | -1.3% | -7.5% | -0.09% |  |
| p95+ (61.05–83.30) | 134 | 50.0% | -5.7% | -0.9% | -0.22% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 325 | 48.6% | -8.2% | -6.0% | -0.39% |  |
| 0.90-1.05 | 270 | 49.6% | -6.3% | -6.1% | -0.08% |  |
| 1.05-1.20 | 142 | 63.4% | 23.3% | 29.5% | 0.01% |  |
| 1.20-1.35 | 38 | 47.4% | -12.6% | -18.7% | 0.17% |  |
| 1.35-1.50 | 12 | 41.7% | -22.6% | -40.2% | -0.33% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.20) | 106 | 48.1% | -8.5% | -3.6% | -0.30% |  |
| 20-40% (0.20–0.57) | 107 | 60.7% | 12.0% | 16.5% | 0.08% |  |
| 40-60% (0.57–0.85) | 107 | 52.3% | -2.5% | 8.6% | -0.61% |  |
| 60-80% (0.86–1.17) | 107 | 53.3% | 4.2% | -4.6% | 0.13% |  |
| 80-95% (1.17–1.64) | 107 | 46.7% | -9.0% | -4.7% | 0.04% |  |
| 95%+ (1.65–6.68) | 107 | 46.7% | -13.3% | -7.6% | 0.04% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 34 | 35.3% | -29.3% | -30.3% | 0.23% | Broad support |
| 0.25-0.40 | 126 | 50.0% | -3.4% | -1.6% | 0.15% | Healthy support |
| 0.40-0.60 | 198 | 49.0% | -7.0% | 1.2% | -0.24% | Concentrated |
| 0.60-0.80 | 129 | 59.7% | 10.4% | 10.1% | -0.19% | Very concentrated |
| 0.80-1.00 | 154 | 51.9% | -2.4% | -0.7% | -0.14% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 70 | 38.6% | -29.0% | -31.1% | -0.14% | 4.2 |
| Broad battle | 266 | 49.2% | -4.9% | 2.0% | 0.06% | 3.9 |
| One-wallet nuke | 321 | 52.3% | -0.7% | -0.5% | -0.34% | 3.9 |
| Thin support | 512 | 53.5% | 0.9% | -0.3% | -0.30% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=808)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 28 | 53.6% | -2.8% | 23.3% | 0.20% | 4.2 | 89.3% |
| SMALL_MOVE | 165 | 50.3% | -5.8% | 0.7% | -0.59% | 4.1 | 100.0% |
| CLEAR_MOVE | 140 | 55.0% | 1.3% | 3.8% | 0.17% | 4.1 | 100.0% |
| NEAR_START | 316 | 50.3% | -2.8% | -3.9% | 0.00% | 3.8 | 100.0% |

**All Time** (n=1370)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 545 | 53.8% | -5.0% | -3.0% | -0.47% | 3.3 | 6.1% |
| SMALL_MOVE | 168 | 50.0% | -6.3% | -0.7% | -0.54% | 4.1 | 98.2% |
| CLEAR_MOVE | 166 | 54.8% | 1.2% | 3.4% | 0.08% | 4.1 | 100.0% |
| NEAR_START | 332 | 50.3% | -3.3% | -4.3% | 0.02% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 78 / 50.0% / -9.7% | 69 / 58.0% / 4.2% | 128 / 51.6% / -1.8% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 54 / 57.4% / 10.7% | 41 / 46.3% / -15.0% | 81 / 51.9% / 4.6% |
| 2.5-3★ | 5 / 60.0% / 13.9% | 29 / 41.4% / -19.8% | 30 / 60.0% / 17.1% | 99 / 47.5% / -9.8% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 805 | 51.6% | -2.2% | -0.2% | 4.0 | -0.20% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 855 | 51.6% | -2.4% | -0.4% | 4.0 | -0.19% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1353 | 100% |
| LOCKED (direct) | 98 | 7.2% |
| Promoted (SHADOW→LOCKED) | 890 | 65.8% |
| Rejected (stayed SHADOW) | 194 | 14.3% |
| Superseded (side flipped) | 166 | 12.3% |
| Muted | 477 | 35.3% |
| Cancelled | 20 | 1.5% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=808)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -0.48u | -0.0% | — |
| Flat 1.0u | -16.88u | -2.1% | +16.40u |
| Lock units only | -3.01u | — | +2.53u |
| Units change only on star change | 1.40u | — | -1.88u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 240 | 3.15 | -8.2% | -4.9% | -17.66u | Sizing hurts |
| 4.5 | 130 | 2.67 | 11.9% | 13.4% | +30.95u | Sizing helps |
| 4 | 158 | 1.27 | -7.9% | -1.2% | +10.04u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 98 | 0.82 | 1.1% | -7.5% | -7.06u | Sizing hurts |
| 2.5 | 100 | 0.57 | -3.7% | -10.8% | -2.51u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |

### All Time (n=1370)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -45.36u | -1.9% | — |
| Flat 1.0u | -46.40u | -3.4% | +1.04u |
| Lock units only | -37.12u | — | -8.24u |
| Units change only on star change | -42.65u | — | -2.71u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 253 | 3.13 | -8.2% | -5.3% | -21.25u | Sizing hurts |
| 4.5 | 164 | 2.65 | 6.9% | 7.4% | +20.93u | Sizing helps |
| 4 | 273 | 1.63 | -5.9% | -2.5% | +4.80u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 258 | 1.06 | -7.6% | -9.8% | -7.20u | Sizing hurts |
| 2.5 | 207 | 0.66 | -2.1% | -3.1% | +0.21u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 808 | 53.1% | 51.6% | -1.5% | -2.1% | -0.19% | Neutral |
| 4.5-5★ | 370 | 53.5% | 53.2% | -0.2% | -1.1% | -0.34% | Neutral |
| 3.5-4★ | 226 | 52.4% | 49.1% | -3.3% | -4.1% | -0.11% | Below market |
| 2.5-3★ | 200 | 53.4% | 52.0% | -1.4% | -0.4% | -0.03% | Neutral |
| CLEAR_MOVE only | 140 | 54.2% | 55.0% | +0.8% | 1.3% | 0.17% | Neutral |
| NO_MOVE only | 28 | 54.6% | 53.6% | -1.0% | -2.8% | 0.20% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=66)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.827 | 37.777 | 0.38 |  |
| Rank_norm | 54.318 | 40.565 | 0.57 |  |
| PnL_norm | 49.880 | 41.688 | 0.43 |  |
| WalletBase | 47.369 | 39.897 | 0.58 |  |
| SizeRatio | 1.329 | 1.072 | 0.20 |  |
| ConvictionMult | 0.948 | 0.907 | 0.25 |  |
| WalletCountFor | 2.846 | 2.439 | 0.22 |  |
| TopShare | 0.605 | 0.663 | 0.23 |  |
| ForSide | 139.229 | 92.379 | 0.43 |  |
| AgainstSide | 49.995 | 45.365 | 0.06 |  |
| NetEdge | 0.967 | 0.538 | 0.50 |  |
| WalletPlayScore | 0.871 | 0.034 | 0.35 |  |

### V8 Era (n=641)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.827 | 43.271 | 0.08 |  |
| Rank_norm | 54.318 | 60.410 | 0.25 |  |
| PnL_norm | 49.880 | 52.875 | 0.16 |  |
| WalletBase | 47.369 | 47.374 | 0.00 |  |
| SizeRatio | 1.329 | 1.366 | 0.03 |  |
| ConvictionMult | 0.948 | 0.960 | 0.07 |  |
| WalletCountFor | 2.846 | 2.846 | 0.00 |  |
| TopShare | 0.605 | 0.605 | 0.00 |  |
| ForSide | 139.229 | 139.229 | 0.00 |  |
| AgainstSide | 49.995 | 49.995 | 0.00 |  |
| NetEdge | 0.967 | 0.967 | 0.00 |  |
| WalletPlayScore | 0.871 | 0.871 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=808)

No major failure modes detected.

### 7-Day (n=113)

- **Ranking issue**: ≤3★ WR (59%) beats ≥4★ (51%)

### All Time (n=1370)

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
| V8 era picks | 808 |
| V8 flat ROI | -2.1% |
| V8 model ROI | -0.0% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -1.1% |
| 2.5-3★ ROI | -0.4% |
| CLEAR_MOVE ROI | 1.3% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 37.6% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.12% | 4.5★: -0.74% | 4★: -0.13% | 3.5★: -0.07% | 3★: 0.09% | 2.5★: -0.14% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=808)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 722 | 89.4% | 51.1% | -2.5% | -1.7% | -0.21% |
| MUTED | 75 | 9.3% | 56.0% | 2.2% | 20.8% | -0.11% |
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

### 7-Day (n=113)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 113 | 100.0% | 53.1% | -1.2% | -0.8% | -0.32% |

### All Time (n=1370)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1282 | 93.6% | 52.1% | -3.9% | -3.1% | -0.29% |
| MUTED | 75 | 5.5% | 56.0% | 2.2% | 20.8% | -0.11% |
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
