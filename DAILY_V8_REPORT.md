# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-07-06 ET
**Completed Picks**: 1727 | **V8 Era Picks**: 1165 | **V8 Since**: 2026-04-18
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
| Single-wallet dependency | ⚠️ | 44% of picks are single-wallet (WR: 51.1%, ROI: -3.0%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 58 | 63.8% | 11.40u | 19.7% | 22.89u | 18.9% | -0.29% | 0.38% | Strong |
| 7-Day | 151 | 54.3% | 5.20u | 3.4% | 28.94u | 11.2% | -0.01% | -0.18% |  |
| 14-Day | 308 | 51.6% | -13.45u | -4.4% | 21.53u | 4.0% | 0.05% | 0.69% |  |
| 30-Day | 593 | 51.3% | -24.01u | -4.0% | 41.00u | 3.7% | -0.04% | 0.39% |  |
| V8 Era | 1165 | 51.2% | -39.80u | -3.4% | 21.78u | 1.0% | -0.07% | -0.33% |  |
| All Time | 1727 | 52.0% | -69.32u | -4.0% | -23.10u | -0.8% | -0.18% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=1165)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 304 | 54.1% | 54.1% | 50.7% | -3.5% | -8.1% | -4.5% | 3.33 | -0.24% | Weak |
| 4.5 | 234 | 52.0% | 52.0% | 52.6% | +0.6% | -0.7% | 5.7% | 2.58 | 0.20% | Fair |
| 4 | 216 | 52.2% | 52.2% | 50.0% | -2.2% | -3.8% | 12.2% | 1.18 | -0.34% | Fair |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 151 | 52.5% | 52.5% | 51.7% | -0.9% | -0.9% | -3.5% | 0.70 | 0.74% | Fair |
| 2.5 | 171 | 53.0% | 53.0% | 50.9% | -2.1% | -4.2% | -0.6% | 0.44 | -0.49% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 17 | 54.2% | 54.2% | 58.8% | +4.6% | 0.9% | 17.9% | 0.41 | 0.00% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.7% | 52.6% | -1.9% | Flat |
| 4.5★ vs 4★ | 52.6% | 50.0% | +2.6% | Correct |
| 4★ vs 3.5★ | 50.0% | 51.5% | -1.5% | Flat |
| 3.5★ vs 3★ | 51.5% | 51.7% | -0.2% | Flat |
| 3★ vs 2.5★ | 51.7% | 50.9% | +0.8% | Correct |
| 2.5★ vs 2★ | 50.9% | 0.0% | +50.9% | Correct |
| 2★ vs 1★ | 0.0% | 58.8% | -58.8% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.143 |
| Spearman: Stars vs Flat ROI | -0.048 |
| Spearman: Stars vs CLV | -0.238 |
| Brier Score | 0.2417 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1727)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 317 | 54.3% | 54.3% | 50.8% | -3.5% | -8.1% | -4.8% | 3.30 | -0.20% | Weak |
| 4.5 | 268 | 52.7% | 52.7% | 52.2% | -0.5% | -2.2% | 2.9% | 2.58 | 0.35% | Fair |
| 4 | 331 | 53.5% | 53.5% | 51.4% | -2.1% | -3.6% | 4.5% | 1.51 | -0.47% | Fair |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 311 | 53.9% | 53.9% | 50.2% | -3.7% | -7.1% | -8.2% | 0.96 | 0.13% | Weak |
| 2.5 | 278 | 53.6% | 53.6% | 52.5% | -1.0% | -2.8% | 1.0% | 0.55 | -0.60% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 17 | 54.2% | 54.2% | 58.8% | +4.6% | 0.9% | 17.9% | 0.41 | 0.00% | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.8% | 52.2% | -1.4% | Flat |
| 4.5★ vs 4★ | 52.2% | 51.4% | +0.8% | Correct |
| 4★ vs 3.5★ | 51.4% | 56.5% | -5.1% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.2% | +6.3% | Correct |
| 3★ vs 2.5★ | 50.2% | 52.5% | -2.3% | Flat |
| 2.5★ vs 2★ | 52.5% | 0.0% | +52.5% | Correct |
| 2★ vs 1★ | 0.0% | 58.8% | -58.8% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.190 |
| Spearman: Stars vs Flat ROI | -0.095 |
| Spearman: Stars vs CLV | -0.143 |
| Brier Score | 0.2371 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.096 | -0.028 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.162 | -0.100 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.114 | -0.058 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.125 | -0.039 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.053 | -0.013 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.029 | 0.009 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.127 | -0.039 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.131 | -0.061 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.017 | 0.043 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.109 | -0.065 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.045 | 0.023 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.115 | 0.070 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.121 | 0.077 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.097 | -0.059 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (8.70–32.15) | 192 | 49.0% | -9.1% | 3.3% | 0.28% |  |
| p20-40 (32.20–38.40) | 193 | 49.2% | -10.8% | -1.6% | -0.06% |  |
| p40-60 (38.41–43.85) | 193 | 60.1% | 14.9% | 11.4% | -0.62% |  |
| p60-80 (43.87–49.70) | 193 | 53.4% | -0.7% | 8.0% | -0.38% |  |
| p80-95 (49.72–57.55) | 193 | 47.2% | -6.4% | -9.2% | 0.61% |  |
| p95+ (57.56–83.30) | 193 | 48.2% | -9.0% | -8.9% | -0.24% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 501 | 48.9% | -7.5% | -0.8% | -0.33% |  |
| 0.90-1.05 | 383 | 49.9% | -7.0% | -6.4% | 0.24% |  |
| 1.05-1.20 | 191 | 62.3% | 19.3% | 27.2% | -0.16% |  |
| 1.20-1.35 | 53 | 45.3% | -15.9% | -16.4% | 0.81% |  |
| 1.35-1.50 | 13 | 38.5% | -28.6% | -47.4% | -0.54% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.18) | 139 | 48.2% | -8.2% | 1.3% | -0.22% |  |
| 20-40% (0.18–0.51) | 140 | 56.4% | 4.1% | 10.9% | -0.21% |  |
| 40-60% (0.51–0.80) | 140 | 55.0% | 2.6% | 6.7% | 0.08% |  |
| 60-80% (0.80–1.12) | 140 | 51.4% | -1.0% | 0.8% | 0.34% |  |
| 80-95% (1.12–1.62) | 140 | 47.1% | -8.7% | -5.9% | -0.18% |  |
| 95%+ (1.62–12.79) | 140 | 50.7% | -8.4% | -1.8% | -0.17% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 49 | 42.9% | -18.0% | -14.7% | 0.04% | Broad support |
| 0.25-0.40 | 160 | 51.2% | -2.4% | 0.3% | 0.11% | Healthy support |
| 0.40-0.60 | 266 | 51.1% | -4.2% | 3.5% | -0.08% | Concentrated |
| 0.60-0.80 | 160 | 56.3% | 3.7% | 6.2% | -0.18% | Very concentrated |
| 0.80-1.00 | 204 | 50.5% | -4.6% | 0.7% | -0.09% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 95 | 40.0% | -28.3% | -24.7% | -0.32% | 4.2 |
| Broad battle | 342 | 51.2% | -2.2% | 4.7% | 0.00% | 3.7 |
| One-wallet nuke | 530 | 50.6% | -4.1% | 0.1% | -0.09% | 3.9 |
| Thin support | 764 | 51.7% | -2.6% | 0.2% | -0.07% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=1165)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 35 | 54.3% | -2.8% | 33.4% | 1.05% | 4.0 | 91.4% |
| SMALL_MOVE | 216 | 50.0% | -6.5% | 0.9% | -0.44% | 4.0 | 100.0% |
| CLEAR_MOVE | 149 | 53.7% | -1.5% | 3.0% | 0.22% | 4.1 | 100.0% |
| NEAR_START | 447 | 51.5% | -2.1% | -0.7% | -0.06% | 3.7 | 100.0% |

**All Time** (n=1727)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 552 | 53.8% | -5.0% | -2.1% | -0.39% | 3.3 | 7.2% |
| SMALL_MOVE | 219 | 49.8% | -6.9% | -0.2% | -0.40% | 4.0 | 98.6% |
| CLEAR_MOVE | 175 | 53.7% | -1.2% | 2.8% | 0.13% | 4.1 | 100.0% |
| NEAR_START | 463 | 51.4% | -2.4% | -1.1% | -0.04% | 3.7 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 16 / 62.5% / 5.6% | 106 / 49.1% / -10.2% | 75 / 57.3% / 2.3% | 170 / 51.2% / -4.4% |
| 3.5-4★ | 11 / 36.4% / -29.3% | 61 / 59.0% / 13.2% | 43 / 44.2% / -19.0% | 100 / 53.0% / 5.9% |
| 2.5-3★ | 7 / 57.1% / 11.2% | 43 / 39.5% / -23.8% | 31 / 58.1% / 13.3% | 165 / 50.9% / -3.7% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 6 / 50.0% / -16.4% | — | 12 / 50.0% / -11.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1162 | 51.2% | -3.5% | 0.9% | 3.9 | -0.07% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1212 | 51.2% | -3.6% | 0.7% | 3.9 | -0.07% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1959 | 100% |
| LOCKED (direct) | 109 | 5.6% |
| Promoted (SHADOW→LOCKED) | 1291 | 65.9% |
| Rejected (stayed SHADOW) | 206 | 10.5% |
| Superseded (side flipped) | 348 | 17.8% |
| Muted | 667 | 34.0% |
| Cancelled | 20 | 1.0% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=1165)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 21.78u | 1.0% | — |
| Flat 1.0u | -39.80u | -3.4% | +61.58u |
| Lock units only | -54.90u | — | +76.68u |
| Units change only on star change | -50.49u | — | +72.27u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 304 | 3.33 | -8.1% | -4.5% | -20.60u | Sizing hurts |
| 4.5 | 234 | 2.58 | -0.7% | 5.7% | +36.16u | Sizing helps |
| 4 | 216 | 1.18 | -3.8% | 12.2% | +39.39u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 151 | 0.70 | -0.9% | -3.5% | -2.37u | Sizing hurts |
| 2.5 | 171 | 0.44 | -4.2% | -0.6% | +6.71u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 17 | 0.41 | 0.9% | 17.9% | +1.09u | Sizing helps |

### All Time (n=1727)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -23.10u | -0.8% | — |
| Flat 1.0u | -69.32u | -4.0% | +46.22u |
| Lock units only | -89.02u | — | +65.92u |
| Units change only on star change | -94.54u | — | +71.44u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 317 | 3.30 | -8.1% | -4.8% | -24.19u | Sizing hurts |
| 4.5 | 268 | 2.58 | -2.2% | 2.9% | +26.14u | Sizing helps |
| 4 | 331 | 1.51 | -3.6% | 4.5% | +34.15u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 311 | 0.96 | -7.1% | -8.2% | -2.52u | Sizing hurts |
| 2.5 | 278 | 0.55 | -2.8% | 1.0% | +9.42u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 17 | 0.41 | 0.9% | 17.9% | +1.09u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 1165 | 52.8% | 51.2% | -1.6% | -3.4% | -0.07% | Neutral |
| 4.5-5★ | 538 | 53.2% | 51.5% | -1.7% | -4.9% | -0.05% | Neutral |
| 3.5-4★ | 284 | 52.0% | 50.4% | -1.6% | -1.8% | -0.28% | Neutral |
| 2.5-3★ | 324 | 52.8% | 51.5% | -1.2% | -2.1% | 0.09% | Neutral |
| CLEAR_MOVE only | 149 | 54.1% | 53.7% | -0.4% | -1.5% | 0.22% | Neutral |
| NO_MOVE only | 35 | 52.9% | 54.3% | +1.4% | -2.8% | 1.05% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=90)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.151 | 39.029 | 0.23 |  |
| Rank_norm | 47.099 | 43.918 | 0.12 |  |
| PnL_norm | 43.921 | 35.540 | 0.39 |  |
| WalletBase | 44.498 | 40.005 | 0.34 |  |
| SizeRatio | 1.254 | 1.340 | 0.07 |  |
| ConvictionMult | 0.936 | 0.974 | 0.24 |  |
| WalletCountFor | 2.980 | 3.967 | 0.46 |  |
| TopShare | 0.603 | 0.528 | 0.29 |  |
| ForSide | 138.071 | 169.409 | 0.26 |  |
| AgainstSide | 48.714 | 56.589 | 0.11 |  |
| NetEdge | 0.967 | 1.213 | 0.24 |  |
| WalletPlayScore | 0.914 | 1.777 | 0.34 |  |

### V8 Era (n=839)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 43.151 | 42.087 | 0.06 |  |
| Rank_norm | 47.099 | 55.794 | 0.32 |  |
| PnL_norm | 43.921 | 48.847 | 0.23 |  |
| WalletBase | 44.498 | 45.523 | 0.08 |  |
| SizeRatio | 1.254 | 1.342 | 0.07 |  |
| ConvictionMult | 0.936 | 0.956 | 0.13 |  |
| WalletCountFor | 2.980 | 2.980 | 0.00 |  |
| TopShare | 0.603 | 0.603 | 0.00 |  |
| ForSide | 138.071 | 138.071 | 0.00 |  |
| AgainstSide | 48.714 | 48.714 | 0.00 |  |
| NetEdge | 0.967 | 0.967 | 0.00 |  |
| WalletPlayScore | 0.914 | 0.914 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=1165)

No major failure modes detected.

### 7-Day (n=151)

- **Concentration issue**: 29 high-concentration picks (TopShare>0.6) at -27.4% ROI

### All Time (n=1727)

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
| V8 era picks | 1165 |
| V8 flat ROI | -3.4% |
| V8 model ROI | 1.0% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -4.9% |
| 2.5-3★ ROI | -2.1% |
| CLEAR_MOVE ROI | -1.5% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 43.5% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.24% | 4.5★: 0.20% | 4★: -0.34% | 3.5★: -0.07% | 3★: 0.74% | 2.5★: -0.49% | 2★: 0.67% | 1★: 0.00% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=1165)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1079 | 92.6% | 50.9% | -3.8% | -0.0% | -0.07% |
| MUTED | 75 | 6.4% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 0.9% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=151)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 151 | 100.0% | 54.3% | 3.4% | 11.2% | -0.01% |

### All Time (n=1727)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1639 | 94.9% | 51.7% | -4.5% | -1.7% | -0.17% |
| MUTED | 75 | 4.3% | 56.0% | 2.2% | 20.8% | -0.11% |
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
