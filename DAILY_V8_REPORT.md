# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-22 ET
**Completed Picks**: 1402 | **V8 Era Picks**: 840 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (58.6%) beats 5★ (50.2%) |
| Single-wallet dependency | ⚠️ | 39% of picks are single-wallet (WR: 53.5%, ROI: 2.0%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 53 | 50.9% | -2.11u | -4.0% | 2.16u | 2.2% | -0.52% | -0.97% |  |
| 7-Day | 113 | 51.3% | -5.08u | -4.5% | 12.43u | 5.6% | -0.56% | -0.92% |  |
| 14-Day | 229 | 51.1% | -6.67u | -2.9% | 17.10u | 3.7% | -0.52% | -0.47% |  |
| 30-Day | 501 | 52.9% | -2.82u | -0.6% | 36.62u | 3.7% | -0.37% | -0.46% |  |
| V8 Era | 840 | 51.4% | -20.48u | -2.4% | -0.32u | -0.0% | -0.21% | -0.44% |  |
| All Time | 1402 | 52.3% | -49.99u | -3.6% | -45.20u | -1.9% | -0.30% | -0.17% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=840)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 245 | 53.7% | 53.7% | 50.2% | -3.5% | -7.8% | -4.5% | 3.17 | -0.10% | Weak |
| 4.5 | 140 | 53.3% | 53.3% | 58.6% | +5.3% | 10.6% | 12.2% | 2.66 | -0.70% | Strong |
| 4 | 163 | 53.0% | 53.0% | 47.2% | -5.8% | -9.7% | -1.6% | 1.26 | -0.15% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 104 | 53.4% | 53.4% | 52.9% | -0.5% | 1.3% | -7.2% | 0.80 | 0.07% | Fair |
| 2.5 | 105 | 53.0% | 53.0% | 49.5% | -3.5% | -4.4% | -10.6% | 0.56 | -0.29% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 11 | 54.2% | 54.2% | 54.5% | +0.4% | 0.1% | 13.6% | 0.45 | 0.01% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.2% | 58.6% | -8.4% | INVERTED |
| 4.5★ vs 4★ | 58.6% | 47.2% | +11.4% | Correct |
| 4★ vs 3.5★ | 47.2% | 51.5% | -4.3% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 52.9% | -1.4% | Flat |
| 3★ vs 2.5★ | 52.9% | 49.5% | +3.4% | Correct |
| 2.5★ vs 2★ | 49.5% | 0.0% | +49.5% | Correct |
| 2★ vs 1★ | 0.0% | 54.5% | -54.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.119 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.571 |
| Brier Score | 0.2471 |
| Monotonicity Score | 0.14 |

### All Time (n=1402)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 258 | 53.9% | 53.9% | 50.4% | -3.5% | -7.8% | -4.9% | 3.14 | -0.05% | Weak |
| 4.5 | 174 | 54.1% | 54.1% | 56.9% | +2.8% | 6.1% | 6.8% | 2.65 | -0.32% | Strong |
| 4 | 278 | 54.3% | 54.3% | 50.0% | -4.3% | -7.1% | -2.7% | 1.62 | -0.37% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 264 | 54.5% | 54.5% | 50.4% | -4.1% | -7.3% | -9.7% | 1.05 | -0.31% | Weak |
| 2.5 | 212 | 53.7% | 53.7% | 52.4% | -1.4% | -2.6% | -3.1% | 0.65 | -0.54% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 11 | 54.2% | 54.2% | 54.5% | +0.4% | 0.1% | 13.6% | 0.45 | 0.01% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.4% | 56.9% | -6.5% | INVERTED |
| 4.5★ vs 4★ | 56.9% | 50.0% | +6.9% | Correct |
| 4★ vs 3.5★ | 50.0% | 56.5% | -6.5% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.4% | +6.1% | Correct |
| 3★ vs 2.5★ | 50.4% | 52.4% | -2.0% | Flat |
| 2.5★ vs 2★ | 52.4% | 0.0% | +52.4% | Correct |
| 2★ vs 1★ | 0.0% | 54.5% | -54.5% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.095 |
| Spearman: Stars vs Flat ROI | 0.095 |
| Spearman: Stars vs CLV | -0.333 |
| Brier Score | 0.2392 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.092 | -0.017 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.184 | -0.126 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.088 | -0.056 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.139 | -0.051 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.067 | -0.016 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.036 | 0.010 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.143 | -0.048 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.184 | -0.094 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.009 | 0.029 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.145 | -0.083 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.015 | -0.008 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.187 | 0.112 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.191 | 0.118 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.161 | -0.094 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.60–34.67) | 138 | 49.3% | -10.2% | -4.2% | -0.05% |  |
| p20-40 (34.79–40.65) | 139 | 59.0% | 9.7% | 14.1% | -0.18% |  |
| p40-60 (40.88–46.69) | 139 | 50.4% | -2.5% | -2.9% | -0.68% |  |
| p60-80 (46.73–52.29) | 138 | 50.0% | -6.0% | -3.7% | -0.05% |  |
| p80-95 (52.50–60.53) | 139 | 51.1% | 2.6% | -2.6% | -0.10% |  |
| p95+ (60.55–83.30) | 139 | 48.2% | -9.1% | -6.2% | -0.23% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 345 | 48.1% | -9.0% | -5.0% | -0.43% |  |
| 0.90-1.05 | 277 | 49.1% | -7.4% | -7.4% | -0.08% |  |
| 1.05-1.20 | 145 | 64.1% | 24.6% | 30.3% | 0.00% |  |
| 1.20-1.35 | 39 | 48.7% | -10.0% | -18.7% | 0.16% |  |
| 1.35-1.50 | 12 | 41.7% | -22.6% | -40.2% | -0.33% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.20) | 109 | 48.6% | -7.3% | -2.1% | -0.29% |  |
| 20-40% (0.20–0.54) | 110 | 59.1% | 9.3% | 11.9% | -0.02% |  |
| 40-60% (0.54–0.83) | 110 | 53.6% | 0.4% | 9.7% | -0.52% |  |
| 60-80% (0.84–1.16) | 110 | 50.0% | -2.4% | -10.7% | 0.08% |  |
| 80-95% (1.17–1.62) | 110 | 48.2% | -6.4% | 0.8% | 0.03% |  |
| 95%+ (1.62–6.68) | 110 | 47.3% | -12.6% | -8.5% | 0.04% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 34 | 35.3% | -29.3% | -30.3% | 0.23% | Broad support |
| 0.25-0.40 | 126 | 50.0% | -3.4% | -1.6% | 0.15% | Healthy support |
| 0.40-0.60 | 205 | 48.3% | -8.6% | -0.4% | -0.21% | Concentrated |
| 0.60-0.80 | 129 | 59.7% | 10.4% | 10.1% | -0.19% | Very concentrated |
| 0.80-1.00 | 165 | 52.1% | -1.5% | 0.3% | -0.20% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 71 | 39.4% | -27.9% | -29.4% | -0.14% | 4.2 |
| Broad battle | 272 | 48.5% | -6.4% | 0.8% | 0.07% | 3.9 |
| One-wallet nuke | 346 | 52.3% | -0.6% | 0.5% | -0.39% | 3.9 |
| Thin support | 539 | 53.2% | 0.5% | -0.3% | -0.33% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=840)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 28 | 53.6% | -2.8% | 23.3% | 0.20% | 4.2 | 89.3% |
| SMALL_MOVE | 173 | 50.9% | -4.3% | 1.5% | -0.53% | 4.1 | 100.0% |
| CLEAR_MOVE | 142 | 54.2% | -0.1% | 3.7% | 0.07% | 4.1 | 100.0% |
| NEAR_START | 324 | 50.0% | -3.6% | -5.1% | 0.00% | 3.8 | 100.0% |

**All Time** (n=1402)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 545 | 53.8% | -5.0% | -3.0% | -0.47% | 3.3 | 6.1% |
| SMALL_MOVE | 176 | 50.6% | -4.8% | 0.1% | -0.48% | 4.1 | 98.3% |
| CLEAR_MOVE | 168 | 54.2% | -0.0% | 3.4% | -0.00% | 4.1 | 100.0% |
| NEAR_START | 340 | 50.0% | -4.0% | -5.4% | 0.02% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 83 / 50.6% / -7.7% | 69 / 58.0% / 4.2% | 131 / 51.1% / -2.8% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 54 / 57.4% / 10.7% | 42 / 45.2% / -17.1% | 84 / 51.2% / 2.7% |
| 2.5-3★ | 5 / 60.0% / 13.9% | 31 / 41.9% / -17.8% | 31 / 58.1% / 13.3% | 101 / 47.5% / -9.5% |
| 1.0-2★ | — | 5 / 40.0% / -25.6% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 837 | 51.4% | -2.6% | -0.1% | 4.0 | -0.22% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 887 | 51.4% | -2.7% | -0.4% | 4.0 | -0.21% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1423 | 100% |
| LOCKED (direct) | 100 | 7.0% |
| Promoted (SHADOW→LOCKED) | 943 | 66.3% |
| Rejected (stayed SHADOW) | 196 | 13.8% |
| Superseded (side flipped) | 179 | 12.6% |
| Muted | 499 | 35.1% |
| Cancelled | 20 | 1.4% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=840)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -0.32u | -0.0% | — |
| Flat 1.0u | -20.48u | -2.4% | +20.16u |
| Lock units only | -9.46u | — | +9.14u |
| Units change only on star change | -5.06u | — | +4.74u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 245 | 3.17 | -7.8% | -4.5% | -16.01u | Sizing hurts |
| 4.5 | 140 | 2.66 | 10.6% | 12.2% | +30.64u | Sizing helps |
| 4 | 163 | 1.26 | -9.7% | -1.6% | +12.53u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 104 | 0.80 | 1.3% | -7.2% | -7.36u | Sizing hurts |
| 2.5 | 105 | 0.56 | -4.4% | -10.6% | -1.52u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 11 | 0.45 | 0.1% | 13.6% | +0.67u | Sizing helps |

### All Time (n=1402)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -45.20u | -1.9% | — |
| Flat 1.0u | -49.99u | -3.6% | +4.79u |
| Lock units only | -43.58u | — | -1.62u |
| Units change only on star change | -49.10u | — | +3.90u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 258 | 3.14 | -7.8% | -4.9% | -19.61u | Sizing hurts |
| 4.5 | 174 | 2.65 | 6.1% | 6.8% | +20.62u | Sizing helps |
| 4 | 278 | 1.62 | -7.1% | -2.7% | +7.29u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 264 | 1.05 | -7.3% | -9.7% | -7.50u | Sizing hurts |
| 2.5 | 212 | 0.65 | -2.6% | -3.1% | +1.20u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 11 | 0.45 | 0.1% | 13.6% | +0.67u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 840 | 53.2% | 51.4% | -1.7% | -2.4% | -0.21% | Neutral |
| 4.5-5★ | 385 | 53.5% | 53.2% | -0.3% | -1.1% | -0.32% | Neutral |
| 3.5-4★ | 231 | 52.5% | 48.5% | -4.0% | -5.5% | -0.13% | Below market |
| 2.5-3★ | 211 | 53.2% | 51.7% | -1.5% | -0.7% | -0.11% | Neutral |
| CLEAR_MOVE only | 142 | 54.2% | 54.2% | +0.1% | -0.1% | 0.07% | Neutral |
| NO_MOVE only | 28 | 54.6% | 53.6% | -1.0% | -2.8% | 0.20% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=66)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.565 | 34.709 | 0.53 |  |
| Rank_norm | 53.530 | 38.233 | 0.62 |  |
| PnL_norm | 49.427 | 41.133 | 0.43 |  |
| WalletBase | 47.052 | 38.142 | 0.69 |  |
| SizeRatio | 1.309 | 0.994 | 0.24 |  |
| ConvictionMult | 0.944 | 0.887 | 0.35 |  |
| WalletCountFor | 2.818 | 2.227 | 0.33 |  |
| TopShare | 0.611 | 0.696 | 0.34 |  |
| ForSide | 137.229 | 78.698 | 0.54 |  |
| AgainstSide | 49.485 | 36.115 | 0.17 |  |
| NetEdge | 0.952 | 0.480 | 0.55 |  |
| WalletPlayScore | 0.820 | -0.250 | 0.45 |  |

### V8 Era (n=659)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.565 | 42.959 | 0.09 |  |
| Rank_norm | 53.530 | 60.034 | 0.26 |  |
| PnL_norm | 49.427 | 52.625 | 0.16 |  |
| WalletBase | 47.052 | 47.127 | 0.01 |  |
| SizeRatio | 1.309 | 1.355 | 0.04 |  |
| ConvictionMult | 0.944 | 0.958 | 0.08 |  |
| WalletCountFor | 2.818 | 2.818 | 0.00 |  |
| TopShare | 0.611 | 0.611 | 0.00 |  |
| ForSide | 137.229 | 137.229 | 0.00 |  |
| AgainstSide | 49.485 | 49.485 | 0.00 |  |
| NetEdge | 0.952 | 0.952 | 0.00 |  |
| WalletPlayScore | 0.820 | 0.820 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=840)

No major failure modes detected.

### 7-Day (n=113)

- **Odds issue**: Avg CLV -0.56% — consistently getting bad closing lines

### All Time (n=1402)

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
| V8 era picks | 840 |
| V8 flat ROI | -2.4% |
| V8 model ROI | -0.0% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -1.1% |
| 2.5-3★ ROI | -0.7% |
| CLEAR_MOVE ROI | -0.1% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 39.2% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.10% | 4.5★: -0.70% | 4★: -0.15% | 3.5★: -0.07% | 3★: 0.07% | 2.5★: -0.29% | 2★: 0.67% | 1★: 0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=840)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 754 | 89.8% | 50.9% | -2.9% | -1.6% | -0.23% |
| MUTED | 75 | 8.9% | 56.0% | 2.2% | 20.8% | -0.11% |
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
| ACTIVE | 113 | 100.0% | 51.3% | -4.5% | 5.6% | -0.56% |

### All Time (n=1402)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1314 | 93.7% | 52.0% | -4.1% | -3.1% | -0.30% |
| MUTED | 75 | 5.3% | 56.0% | 2.2% | 20.8% | -0.11% |
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
