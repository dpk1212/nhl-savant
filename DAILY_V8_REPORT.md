# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-13 ET
**Completed Picks**: 1257 | **V8 Era Picks**: 695 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (65.2%) beats 5★ (49.3%) |
| Single-wallet dependency | ⚠️ | 34% of picks are single-wallet (WR: 55.7%, ROI: 5.9%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 51 | 49.0% | -2.60u | -5.1% | -5.17u | -5.4% | -0.15% | -3.15% |  |
| 7-Day | 123 | 52.0% | 0.23u | 0.2% | 20.73u | 8.2% | -0.56% | 1.28% |  |
| 14-Day | 224 | 53.1% | 3.92u | 1.7% | 33.23u | 7.4% | -0.43% | -0.10% |  |
| 30-Day | 446 | 51.8% | -9.75u | -2.2% | -5.13u | -0.6% | -0.23% | -0.44% |  |
| V8 Era | 695 | 51.4% | -15.56u | -2.2% | 1.51u | 0.1% | -0.17% | -0.41% |  |
| All Time | 1257 | 52.3% | -45.07u | -3.6% | -43.37u | -2.0% | -0.29% | -0.16% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=695)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 217 | 53.5% | 53.5% | 49.3% | -4.2% | -9.6% | -4.6% | 3.01 | -0.05% | Weak |
| 4.5 | 92 | 53.3% | 53.3% | 65.2% | +11.9% | 24.2% | 19.3% | 2.65 | -1.01% | Strong |
| 4 | 133 | 53.0% | 53.0% | 46.6% | -6.4% | -10.3% | -3.8% | 1.32 | -0.02% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 87 | 53.6% | 53.6% | 52.9% | -0.7% | 1.9% | -9.3% | 0.86 | 0.12% | Fair |
| 2.5 | 84 | 53.3% | 53.3% | 47.6% | -5.6% | -8.3% | -12.7% | 0.63 | -0.21% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.3% | 65.2% | -15.9% | INVERTED |
| 4.5★ vs 4★ | 65.2% | 46.6% | +18.6% | Correct |
| 4★ vs 3.5★ | 46.6% | 51.5% | -4.9% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 52.9% | -1.4% | Flat |
| 3★ vs 2.5★ | 52.9% | 47.6% | +5.3% | Correct |
| 2.5★ vs 2★ | 47.6% | 0.0% | +47.6% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.286 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.524 |
| Brier Score | 0.2476 |
| Monotonicity Score | 0.14 |

### All Time (n=1257)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 230 | 53.8% | 53.8% | 49.6% | -4.2% | -9.6% | -5.0% | 2.99 | 0.01% | Weak |
| 4.5 | 126 | 54.5% | 54.5% | 61.1% | +6.6% | 14.3% | 9.9% | 2.64 | -0.41% | Strong |
| 4 | 248 | 54.4% | 54.4% | 50.0% | -4.4% | -7.0% | -3.7% | 1.69 | -0.32% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 247 | 54.6% | 54.6% | 50.2% | -4.4% | -7.7% | -10.4% | 1.08 | -0.31% | Weak |
| 2.5 | 191 | 53.9% | 53.9% | 51.8% | -2.1% | -4.1% | -3.6% | 0.69 | -0.54% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.6% | 61.1% | -11.5% | INVERTED |
| 4.5★ vs 4★ | 61.1% | 50.0% | +11.1% | Correct |
| 4★ vs 3.5★ | 50.0% | 56.5% | -6.5% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.2% | +6.3% | Correct |
| 3★ vs 2.5★ | 50.2% | 51.8% | -1.6% | Flat |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.167 |
| Spearman: Stars vs Flat ROI | 0.262 |
| Spearman: Stars vs CLV | -0.190 |
| Brier Score | 0.2386 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.107 | -0.022 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.182 | -0.125 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.089 | -0.056 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.141 | -0.051 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.047 | -0.002 | Monitor |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.016 | 0.025 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.135 | -0.038 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.178 | -0.080 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.005 | 0.045 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.147 | -0.078 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.018 | 0.002 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.196 | 0.105 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.203 | 0.113 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.172 | -0.089 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.50) | 114 | 54.4% | -2.3% | 1.4% | -0.05% |  |
| p20-40 (35.52–43.35) | 115 | 56.5% | 10.6% | 14.2% | -0.28% |  |
| p40-60 (43.40–48.56) | 114 | 50.9% | -4.4% | -2.0% | -0.48% |  |
| p60-80 (48.60–54.47) | 115 | 46.1% | -11.9% | -5.7% | 0.15% |  |
| p80-95 (54.51–62.05) | 114 | 50.0% | 0.3% | -6.8% | -0.02% |  |
| p95+ (62.08–83.30) | 115 | 49.6% | -6.5% | -5.5% | -0.36% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 262 | 48.1% | -9.0% | -5.5% | -0.41% |  |
| 0.90-1.05 | 236 | 49.2% | -7.1% | -6.8% | -0.03% |  |
| 1.05-1.20 | 132 | 62.9% | 23.3% | 28.6% | 0.05% |  |
| 1.20-1.35 | 37 | 48.6% | -10.2% | -19.4% | 0.15% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.26) | 95 | 48.4% | -9.4% | -2.8% | -0.33% |  |
| 20-40% (0.26–0.62) | 96 | 60.4% | 12.8% | 12.8% | 0.15% |  |
| 40-60% (0.63–0.89) | 96 | 49.0% | -8.0% | 2.1% | -0.87% |  |
| 60-80% (0.89–1.22) | 96 | 53.1% | 5.1% | -2.7% | 0.24% |  |
| 80-95% (1.22–1.68) | 96 | 45.8% | -9.7% | -5.6% | 0.05% |  |
| 95%+ (1.69–6.68) | 96 | 43.8% | -19.0% | -14.4% | 0.04% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 32 | 34.4% | -29.9% | -33.6% | 0.21% | Broad support |
| 0.25-0.40 | 114 | 47.4% | -7.2% | -9.5% | 0.22% | Healthy support |
| 0.40-0.60 | 176 | 47.7% | -9.0% | 0.2% | -0.31% | Concentrated |
| 0.60-0.80 | 123 | 59.3% | 10.1% | 10.8% | -0.22% | Very concentrated |
| 0.80-1.00 | 130 | 50.8% | -4.5% | -4.9% | -0.13% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 64 | 35.9% | -33.2% | -34.3% | -0.14% | 4.3 |
| Broad battle | 240 | 48.3% | -6.0% | -0.2% | 0.05% | 3.9 |
| One-wallet nuke | 250 | 54.0% | 2.2% | 4.3% | -0.27% | 3.8 |
| Thin support | 421 | 54.4% | 2.5% | 2.6% | -0.27% | 3.8 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=695)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 25 | 52.0% | -6.1% | 15.1% | 0.31% | 4.2 | 88.0% |
| SMALL_MOVE | 148 | 48.6% | -8.1% | -3.2% | -0.72% | 4.1 | 100.0% |
| CLEAR_MOVE | 136 | 54.4% | 0.5% | 3.8% | 0.15% | 4.1 | 100.0% |
| NEAR_START | 274 | 48.9% | -4.8% | -7.2% | 0.04% | 3.8 | 100.0% |

**All Time** (n=1257)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 542 | 53.7% | -5.2% | -3.6% | -0.46% | 3.3 | 5.5% |
| SMALL_MOVE | 151 | 48.3% | -8.7% | -4.7% | -0.66% | 4.1 | 98.0% |
| CLEAR_MOVE | 162 | 54.3% | 0.5% | 3.4% | 0.06% | 4.1 | 100.0% |
| NEAR_START | 290 | 49.0% | -5.2% | -7.5% | 0.05% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 13 / 61.5% / 7.1% | 74 / 50.0% / -9.5% | 67 / 58.2% / 4.5% | 107 / 49.5% / -4.5% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 48 / 52.1% / 2.2% | 40 / 45.0% / -16.6% | 75 / 53.3% / 8.2% |
| 2.5-3★ | 4 / 50.0% / -1.6% | 22 / 40.9% / -18.3% | 29 / 58.6% / 14.7% | 84 / 44.0% / -16.5% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 692 | 51.3% | -2.4% | -0.0% | 4.0 | -0.18% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 742 | 51.3% | -2.6% | -0.3% | 4.0 | -0.17% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1120 | 100% |
| LOCKED (direct) | 96 | 8.6% |
| Promoted (SHADOW→LOCKED) | 714 | 63.7% |
| Rejected (stayed SHADOW) | 184 | 16.4% |
| Superseded (side flipped) | 121 | 10.8% |
| Muted | 395 | 35.3% |
| Cancelled | 20 | 1.8% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=695)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 1.51u | 0.1% | — |
| Flat 1.0u | -15.56u | -2.2% | +17.07u |
| Lock units only | 13.62u | — | -12.11u |
| Units change only on star change | 18.03u | — | -16.52u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 217 | 3.01 | -9.6% | -4.6% | -8.98u | Sizing hurts |
| 4.5 | 92 | 2.65 | 24.2% | 19.3% | +24.80u | Sizing helps |
| 4 | 133 | 1.32 | -10.3% | -3.8% | +6.99u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 87 | 0.86 | 1.9% | -9.3% | -8.63u | Sizing hurts |
| 2.5 | 84 | 0.63 | -8.3% | -12.7% | +0.24u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |

### All Time (n=1257)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -43.37u | -2.0% | — |
| Flat 1.0u | -45.07u | -3.6% | +1.70u |
| Lock units only | -20.49u | — | -22.88u |
| Units change only on star change | -26.01u | — | -17.36u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 230 | 2.99 | -9.6% | -5.0% | -12.57u | Sizing hurts |
| 4.5 | 126 | 2.64 | 14.3% | 9.9% | +14.79u | Sizing helps |
| 4 | 248 | 1.69 | -7.0% | -3.7% | +1.75u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 247 | 1.08 | -7.7% | -10.4% | -8.78u | Sizing hurts |
| 2.5 | 191 | 0.69 | -4.1% | -3.6% | +2.95u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 695 | 53.1% | 51.4% | -1.8% | -2.2% | -0.17% | Neutral |
| 4.5-5★ | 309 | 53.4% | 54.0% | +0.6% | 0.4% | -0.34% | Neutral |
| 3.5-4★ | 201 | 52.4% | 48.3% | -4.1% | -5.2% | -0.04% | Below market |
| 2.5-3★ | 173 | 53.4% | 50.9% | -2.6% | -2.1% | -0.05% | Below market |
| CLEAR_MOVE only | 136 | 54.2% | 54.4% | +0.2% | 0.5% | 0.15% | Neutral |
| NO_MOVE only | 25 | 54.7% | 52.0% | -2.7% | -6.1% | 0.31% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=78)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.336 | 40.968 | 0.24 |  |
| Rank_norm | 57.663 | 59.087 | 0.06 |  |
| PnL_norm | 51.855 | 53.652 | 0.10 |  |
| WalletBase | 48.456 | 45.653 | 0.22 |  |
| SizeRatio | 1.382 | 1.065 | 0.24 |  |
| ConvictionMult | 0.959 | 0.925 | 0.21 |  |
| WalletCountFor | 2.892 | 2.308 | 0.32 |  |
| TopShare | 0.599 | 0.688 | 0.36 |  |
| ForSide | 144.607 | 103.249 | 0.37 |  |
| AgainstSide | 50.526 | 57.928 | 0.09 |  |
| NetEdge | 1.017 | 0.540 | 0.55 |  |
| WalletPlayScore | 0.967 | -0.131 | 0.47 |  |

### V8 Era (n=575)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.336 | 43.901 | 0.08 |  |
| Rank_norm | 57.663 | 62.732 | 0.23 |  |
| PnL_norm | 51.855 | 54.159 | 0.13 |  |
| WalletBase | 48.456 | 48.232 | 0.02 |  |
| SizeRatio | 1.382 | 1.400 | 0.01 |  |
| ConvictionMult | 0.959 | 0.966 | 0.04 |  |
| WalletCountFor | 2.892 | 2.892 | 0.00 |  |
| TopShare | 0.599 | 0.599 | 0.00 |  |
| ForSide | 144.607 | 144.607 | 0.00 |  |
| AgainstSide | 50.526 | 50.526 | 0.00 |  |
| NetEdge | 1.017 | 1.017 | 0.00 |  |
| WalletPlayScore | 0.967 | 0.967 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=695)

No major failure modes detected.

### 7-Day (n=123)

- **Odds issue**: Avg CLV -0.56% — consistently getting bad closing lines

### All Time (n=1257)

- **Environment issue**: 43.1% NO_MOVE (WR: 53.7%, ROI: -5.2%)


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
| V8 era picks | 695 |
| V8 flat ROI | -2.2% |
| V8 model ROI | 0.1% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | 0.4% |
| 2.5-3★ ROI | -2.1% |
| CLEAR_MOVE ROI | 0.5% |
| NO_MOVE ROI | -6.1% |
| Single-wallet play rate | 33.8% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.05% | 4.5★: -1.01% | 4★: -0.02% | 3.5★: -0.07% | 3★: 0.12% | 2.5★: -0.21% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=695)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 609 | 87.6% | 50.7% | -2.8% | -1.9% | -0.19% |
| MUTED | 75 | 10.8% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.6% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=123)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 123 | 100.0% | 52.0% | 0.2% | 8.2% | -0.56% |

### All Time (n=1257)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1169 | 93.0% | 52.0% | -4.2% | -3.4% | -0.29% |
| MUTED | 75 | 6.0% | 56.0% | 2.2% | 20.8% | -0.11% |
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
