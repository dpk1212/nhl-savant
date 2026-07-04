# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-07-04 ET
**Completed Picks**: 1688 | **V8 Era Picks**: 1126 | **V8 Since**: 2026-04-18
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
| Single-wallet dependency | ⚠️ | 43% of picks are single-wallet (WR: 50.7%, ROI: -3.7%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 62 | 50.0% | -2.65u | -4.3% | -2.34u | -1.8% | 0.26% | -0.24% |  |
| 7-Day | 160 | 48.8% | -13.45u | -8.4% | 18.53u | 7.3% | 0.37% | -0.26% |  |
| 14-Day | 307 | 49.2% | -28.13u | -9.2% | 15.48u | 3.0% | 0.27% | 0.43% |  |
| 30-Day | 585 | 51.1% | -26.06u | -4.5% | 42.52u | 3.9% | -0.04% | 0.30% |  |
| V8 Era | 1126 | 50.9% | -46.47u | -4.1% | 15.00u | 0.7% | -0.06% | -0.34% |  |
| All Time | 1688 | 51.8% | -75.98u | -4.5% | -29.88u | -1.0% | -0.17% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=1126)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 296 | 53.9% | 53.9% | 50.0% | -3.9% | -9.0% | -5.7% | 3.29 | -0.25% | Weak |
| 4.5 | 223 | 51.9% | 51.9% | 53.4% | +1.4% | 0.8% | 7.4% | 2.56 | 0.25% | Fair |
| 4 | 207 | 52.3% | 52.3% | 48.8% | -3.5% | -6.5% | 12.3% | 1.20 | -0.37% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 147 | 52.5% | 52.5% | 51.7% | -0.8% | -0.8% | -2.3% | 0.71 | 0.74% | Fair |
| 2.5 | 164 | 53.1% | 53.1% | 50.0% | -3.1% | -6.1% | -7.1% | 0.45 | -0.46% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 17 | 54.2% | 54.2% | 58.8% | +4.6% | 0.9% | 17.9% | 0.41 | 0.00% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.0% | 53.4% | -3.4% | INVERTED |
| 4.5★ vs 4★ | 53.4% | 48.8% | +4.6% | Correct |
| 4★ vs 3.5★ | 48.8% | 51.5% | -2.7% | Flat |
| 3.5★ vs 3★ | 51.5% | 51.7% | -0.2% | Flat |
| 3★ vs 2.5★ | 51.7% | 50.0% | +1.7% | Correct |
| 2.5★ vs 2★ | 50.0% | 0.0% | +50.0% | Correct |
| 2★ vs 1★ | 0.0% | 58.8% | -58.8% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.143 |
| Spearman: Stars vs Flat ROI | -0.119 |
| Spearman: Stars vs CLV | -0.238 |
| Brier Score | 0.2416 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1688)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 309 | 54.1% | 54.1% | 50.2% | -4.0% | -9.0% | -6.0% | 3.26 | -0.20% | Weak |
| 4.5 | 257 | 52.7% | 52.7% | 52.9% | +0.2% | -1.0% | 4.2% | 2.57 | 0.40% | Fair |
| 4 | 322 | 53.6% | 53.6% | 50.6% | -3.0% | -5.3% | 4.4% | 1.53 | -0.49% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 307 | 53.9% | 53.9% | 50.2% | -3.8% | -7.1% | -7.8% | 0.97 | 0.13% | Weak |
| 2.5 | 271 | 53.6% | 53.6% | 52.0% | -1.6% | -4.0% | -2.1% | 0.56 | -0.59% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 17 | 54.2% | 54.2% | 58.8% | +4.6% | 0.9% | 17.9% | 0.41 | 0.00% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.2% | 52.9% | -2.7% | Flat |
| 4.5★ vs 4★ | 52.9% | 50.6% | +2.3% | Correct |
| 4★ vs 3.5★ | 50.6% | 56.5% | -5.9% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.2% | +6.3% | Correct |
| 3★ vs 2.5★ | 50.2% | 52.0% | -1.8% | Flat |
| 2.5★ vs 2★ | 52.0% | 0.0% | +52.0% | Correct |
| 2★ vs 1★ | 0.0% | 58.8% | -58.8% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.190 |
| Spearman: Stars vs Flat ROI | -0.095 |
| Spearman: Stars vs CLV | -0.143 |
| Brier Score | 0.2369 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.082 | -0.017 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.152 | -0.094 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.100 | -0.050 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.112 | -0.029 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.050 | -0.009 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.026 | 0.013 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.116 | -0.030 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.139 | -0.067 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.011 | 0.038 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.111 | -0.063 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.036 | 0.015 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.124 | 0.078 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.129 | 0.084 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.105 | -0.065 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.10–32.47) | 186 | 46.8% | -14.1% | -1.7% | 0.32% |  |
| p20-40 (32.55–38.57) | 186 | 51.1% | -6.5% | 7.1% | -0.03% |  |
| p40-60 (38.60–44.20) | 187 | 59.9% | 14.2% | 7.2% | -0.82% |  |
| p60-80 (44.30–50.03) | 186 | 50.5% | -6.3% | 3.6% | -0.24% |  |
| p80-95 (50.14–57.80) | 186 | 48.4% | -3.9% | -7.0% | 0.65% |  |
| p95+ (57.83–83.30) | 187 | 48.1% | -8.9% | -8.1% | -0.25% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 487 | 48.5% | -8.6% | -1.4% | -0.35% |  |
| 0.90-1.05 | 367 | 49.6% | -7.7% | -5.0% | 0.28% |  |
| 1.05-1.20 | 184 | 62.0% | 19.2% | 24.2% | -0.14% |  |
| 1.20-1.35 | 51 | 45.1% | -16.4% | -17.2% | 0.93% |  |
| 1.35-1.50 | 13 | 38.5% | -28.6% | -47.4% | -0.54% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.18) | 136 | 47.8% | -9.5% | -0.1% | -0.21% |  |
| 20-40% (0.19–0.51) | 137 | 56.9% | 4.9% | 12.0% | -0.21% |  |
| 40-60% (0.51–0.80) | 136 | 54.4% | 1.0% | 4.8% | 0.08% |  |
| 60-80% (0.80–1.12) | 137 | 51.8% | 0.3% | 2.6% | 0.35% |  |
| 80-95% (1.12–1.60) | 136 | 47.1% | -9.2% | -4.1% | -0.15% |  |
| 95%+ (1.60–6.68) | 137 | 49.6% | -9.6% | -6.1% | -0.16% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 46 | 43.5% | -16.5% | -10.9% | 0.11% | Broad support |
| 0.25-0.40 | 156 | 50.6% | -3.4% | -0.2% | 0.13% | Healthy support |
| 0.40-0.60 | 260 | 50.0% | -6.4% | 1.0% | -0.08% | Concentrated |
| 0.60-0.80 | 156 | 57.1% | 5.1% | 6.6% | -0.16% | Very concentrated |
| 0.80-1.00 | 201 | 50.7% | -4.2% | 0.7% | -0.09% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 93 | 39.8% | -29.0% | -24.3% | -0.29% | 4.2 |
| Broad battle | 335 | 50.7% | -2.9% | 4.8% | 0.00% | 3.7 |
| One-wallet nuke | 508 | 50.2% | -4.9% | 0.4% | -0.09% | 3.9 |
| Thin support | 737 | 51.6% | -2.9% | 0.2% | -0.07% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=1126)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 35 | 54.3% | -2.8% | 33.4% | 1.05% | 4.0 | 91.4% |
| SMALL_MOVE | 211 | 50.2% | -6.0% | 1.0% | -0.43% | 4.0 | 100.0% |
| CLEAR_MOVE | 149 | 53.7% | -1.5% | 3.0% | 0.22% | 4.1 | 100.0% |
| NEAR_START | 432 | 50.9% | -3.1% | -2.4% | -0.04% | 3.7 | 100.0% |

**All Time** (n=1688)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 552 | 53.8% | -5.0% | -2.1% | -0.39% | 3.3 | 7.2% |
| SMALL_MOVE | 214 | 50.0% | -6.4% | -0.1% | -0.39% | 4.0 | 98.6% |
| CLEAR_MOVE | 175 | 53.7% | -1.2% | 2.8% | 0.13% | 4.1 | 100.0% |
| NEAR_START | 448 | 50.9% | -3.4% | -2.8% | -0.03% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 16 / 62.5% / 5.6% | 104 / 50.0% / -8.5% | 75 / 57.3% / 2.3% | 164 / 50.6% / -5.3% |
| 3.5-4★ | 11 / 36.4% / -29.3% | 59 / 57.6% / 10.7% | 43 / 44.2% / -19.0% | 99 / 53.5% / 6.9% |
| 2.5-3★ | 7 / 57.1% / 11.2% | 42 / 40.5% / -22.0% | 31 / 58.1% / 13.3% | 157 / 49.7% / -6.3% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 6 / 50.0% / -16.4% | — | 12 / 50.0% / -11.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1123 | 50.8% | -4.2% | 0.6% | 3.9 | -0.06% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1173 | 50.9% | -4.3% | 0.4% | 3.9 | -0.06% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1887 | 100% |
| LOCKED (direct) | 108 | 5.7% |
| Promoted (SHADOW→LOCKED) | 1243 | 65.9% |
| Rejected (stayed SHADOW) | 204 | 10.8% |
| Superseded (side flipped) | 327 | 17.3% |
| Muted | 647 | 34.3% |
| Cancelled | 20 | 1.1% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=1126)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 15.00u | 0.7% | — |
| Flat 1.0u | -46.47u | -4.1% | +61.47u |
| Lock units only | -56.97u | — | +71.97u |
| Units change only on star change | -52.56u | — | +67.56u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 296 | 3.29 | -9.0% | -5.7% | -28.82u | Sizing hurts |
| 4.5 | 223 | 2.56 | 0.8% | 7.4% | +40.37u | Sizing helps |
| 4 | 207 | 1.20 | -6.5% | 12.3% | +44.04u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 147 | 0.71 | -0.8% | -2.3% | -1.22u | Sizing hurts |
| 2.5 | 164 | 0.45 | -6.1% | -7.1% | +4.81u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 17 | 0.41 | 0.9% | 17.9% | +1.09u | Sizing helps |

### All Time (n=1688)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -29.88u | -1.0% | — |
| Flat 1.0u | -75.98u | -4.5% | +46.10u |
| Lock units only | -91.09u | — | +61.21u |
| Units change only on star change | -96.61u | — | +66.73u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 309 | 3.26 | -9.0% | -6.0% | -32.41u | Sizing hurts |
| 4.5 | 257 | 2.57 | -1.0% | 4.2% | +30.36u | Sizing helps |
| 4 | 322 | 1.53 | -5.3% | 4.4% | +38.80u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 307 | 0.97 | -7.1% | -7.8% | -1.37u | Sizing hurts |
| 2.5 | 271 | 0.56 | -4.0% | -2.1% | +7.52u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 17 | 0.41 | 0.9% | 17.9% | +1.09u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 1126 | 52.8% | 50.9% | -1.9% | -4.1% | -0.06% | Neutral |
| 4.5-5★ | 519 | 53.1% | 51.4% | -1.6% | -4.8% | -0.03% | Neutral |
| 3.5-4★ | 275 | 52.0% | 49.5% | -2.6% | -3.7% | -0.30% | Below market |
| 2.5-3★ | 313 | 52.8% | 51.1% | -1.7% | -3.0% | 0.11% | Neutral |
| CLEAR_MOVE only | 149 | 54.1% | 53.7% | -0.4% | -1.5% | 0.22% | Neutral |
| NO_MOVE only | 35 | 52.9% | 54.3% | +1.4% | -2.8% | 1.05% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=98)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.516 | 39.653 | 0.22 |  |
| Rank_norm | 47.600 | 40.098 | 0.28 |  |
| PnL_norm | 44.366 | 33.217 | 0.52 |  |
| WalletBase | 44.849 | 39.398 | 0.42 |  |
| SizeRatio | 1.254 | 1.185 | 0.06 |  |
| ConvictionMult | 0.936 | 0.954 | 0.12 |  |
| WalletCountFor | 2.934 | 3.592 | 0.33 |  |
| TopShare | 0.605 | 0.539 | 0.26 |  |
| ForSide | 135.754 | 138.456 | 0.02 |  |
| AgainstSide | 48.079 | 45.814 | 0.03 |  |
| NetEdge | 0.949 | 0.995 | 0.05 |  |
| WalletPlayScore | 0.876 | 1.418 | 0.22 |  |

### V8 Era (n=819)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.516 | 42.289 | 0.07 |  |
| Rank_norm | 47.600 | 55.988 | 0.31 |  |
| PnL_norm | 44.366 | 49.058 | 0.22 |  |
| WalletBase | 44.849 | 45.697 | 0.06 |  |
| SizeRatio | 1.254 | 1.337 | 0.07 |  |
| ConvictionMult | 0.936 | 0.956 | 0.13 |  |
| WalletCountFor | 2.934 | 2.934 | 0.00 |  |
| TopShare | 0.605 | 0.605 | 0.00 |  |
| ForSide | 135.754 | 135.754 | 0.00 |  |
| AgainstSide | 48.079 | 48.079 | 0.00 |  |
| NetEdge | 0.949 | 0.949 | 0.00 |  |
| WalletPlayScore | 0.876 | 0.876 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=1126)

No major failure modes detected.

### 7-Day (n=160)

- **Concentration issue**: 33 high-concentration picks (TopShare>0.6) at -15.9% ROI

### All Time (n=1688)

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
| V8 era picks | 1126 |
| V8 flat ROI | -4.1% |
| V8 model ROI | 0.7% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -4.8% |
| 2.5-3★ ROI | -3.0% |
| CLEAR_MOVE ROI | -1.5% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 43.1% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.25% | 4.5★: 0.25% | 4★: -0.37% | 3.5★: -0.07% | 3★: 0.74% | 2.5★: -0.46% | 2★: 0.67% | 1★: 0.00% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=1126)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1040 | 92.4% | 50.5% | -4.6% | -0.4% | -0.06% |
| MUTED | 75 | 6.7% | 56.0% | 2.2% | 20.8% | -0.11% |
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

### 7-Day (n=160)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 160 | 100.0% | 48.8% | -8.4% | 7.3% | 0.37% |

### All Time (n=1688)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1600 | 94.8% | 51.5% | -5.0% | -2.0% | -0.17% |
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
