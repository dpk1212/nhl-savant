# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-14 ET
**Completed Picks**: 1276 | **V8 Era Picks**: 714 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (63.9%) beats 5★ (49.5%) |
| Single-wallet dependency | ⚠️ | 35% of picks are single-wallet (WR: 55.8%, ROI: 6.2%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 45 | 55.6% | 2.22u | 4.9% | 6.70u | 8.0% | 0.04% | -0.83% | Strong |
| 7-Day | 128 | 53.1% | 3.98u | 3.1% | 24.29u | 9.4% | -0.49% | 1.06% |  |
| 14-Day | 222 | 53.6% | 5.88u | 2.6% | 36.72u | 8.2% | -0.39% | 0.01% |  |
| 30-Day | 458 | 52.6% | -2.36u | -0.5% | 12.71u | 1.4% | -0.23% | -0.44% |  |
| V8 Era | 714 | 51.5% | -13.29u | -1.9% | 3.32u | 0.3% | -0.16% | -0.42% |  |
| All Time | 1276 | 52.4% | -42.80u | -3.4% | -41.56u | -1.9% | -0.28% | -0.16% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=714)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 222 | 53.4% | 53.4% | 49.5% | -3.9% | -8.9% | -4.1% | 3.05 | -0.02% | Weak |
| 4.5 | 97 | 53.1% | 53.1% | 63.9% | +10.8% | 21.8% | 17.3% | 2.66 | -0.93% | Strong |
| 4 | 139 | 52.9% | 52.9% | 47.5% | -5.4% | -8.8% | -2.9% | 1.31 | -0.05% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 88 | 53.6% | 53.6% | 53.4% | -0.2% | 2.9% | -8.6% | 0.86 | 0.11% | Fair |
| 2.5 | 86 | 53.4% | 53.4% | 47.7% | -5.8% | -8.3% | -12.7% | 0.62 | -0.22% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.5% | 63.9% | -14.4% | INVERTED |
| 4.5★ vs 4★ | 63.9% | 47.5% | +16.4% | Correct |
| 4★ vs 3.5★ | 47.5% | 51.5% | -4.0% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 53.4% | -1.9% | Flat |
| 3★ vs 2.5★ | 53.4% | 47.7% | +5.7% | Correct |
| 2.5★ vs 2★ | 47.7% | 0.0% | +47.7% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.286 |
| Spearman: Stars vs Flat ROI | 0.143 |
| Spearman: Stars vs CLV | -0.476 |
| Brier Score | 0.2478 |
| Monotonicity Score | 0.14 |

### All Time (n=1276)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 235 | 53.7% | 53.7% | 49.8% | -3.9% | -8.9% | -4.6% | 3.03 | 0.03% | Weak |
| 4.5 | 131 | 54.3% | 54.3% | 60.3% | +6.0% | 12.9% | 8.8% | 2.64 | -0.37% | Strong |
| 4 | 254 | 54.3% | 54.3% | 50.4% | -3.9% | -6.3% | -3.4% | 1.68 | -0.33% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 248 | 54.6% | 54.6% | 50.4% | -4.2% | -7.3% | -10.2% | 1.08 | -0.32% | Weak |
| 2.5 | 193 | 54.0% | 54.0% | 51.8% | -2.2% | -4.1% | -3.7% | 0.69 | -0.54% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.8% | 60.3% | -10.5% | INVERTED |
| 4.5★ vs 4★ | 60.3% | 50.4% | +9.9% | Correct |
| 4★ vs 3.5★ | 50.4% | 56.5% | -6.1% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.4% | +6.1% | Correct |
| 3★ vs 2.5★ | 50.4% | 51.8% | -1.4% | Flat |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.286 |
| Spearman: Stars vs Flat ROI | 0.333 |
| Spearman: Stars vs CLV | -0.190 |
| Brier Score | 0.2388 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.089 | -0.014 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.189 | -0.131 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.095 | -0.060 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.132 | -0.048 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.059 | -0.012 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.028 | 0.015 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.134 | -0.040 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.186 | -0.088 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.001 | 0.039 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.152 | -0.083 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.026 | -0.006 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.200 | 0.111 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.204 | 0.116 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.177 | -0.094 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.60) | 117 | 54.7% | -1.3% | 2.5% | -0.04% |  |
| p20-40 (35.65–43.35) | 118 | 56.8% | 11.1% | 12.9% | -0.25% |  |
| p40-60 (43.40–48.60) | 118 | 50.8% | -4.6% | -0.9% | -0.45% |  |
| p60-80 (48.73–54.50) | 117 | 45.3% | -13.3% | -8.2% | 0.17% |  |
| p80-95 (54.51–62.00) | 118 | 50.0% | -0.1% | -5.9% | -0.08% |  |
| p95+ (62.05–83.30) | 118 | 50.8% | -4.0% | -4.2% | -0.34% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 270 | 48.5% | -8.0% | -5.3% | -0.41% |  |
| 0.90-1.05 | 243 | 49.4% | -6.6% | -5.7% | -0.01% |  |
| 1.05-1.20 | 135 | 62.2% | 22.0% | 27.4% | 0.04% |  |
| 1.20-1.35 | 37 | 48.6% | -10.2% | -19.4% | 0.15% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.24) | 97 | 50.5% | -5.3% | -3.4% | -0.26% |  |
| 20-40% (0.25–0.62) | 98 | 60.2% | 12.6% | 15.3% | 0.11% |  |
| 40-60% (0.62–0.89) | 98 | 48.0% | -9.8% | 2.1% | -0.72% |  |
| 60-80% (0.89–1.21) | 97 | 52.6% | 3.4% | -6.7% | 0.16% |  |
| 80-95% (1.21–1.67) | 98 | 46.9% | -8.1% | -3.7% | 0.02% |  |
| 95%+ (1.68–6.68) | 98 | 43.9% | -18.0% | -13.6% | 0.07% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 33 | 33.3% | -32.0% | -33.9% | 0.17% | Broad support |
| 0.25-0.40 | 114 | 47.4% | -7.2% | -9.5% | 0.22% | Healthy support |
| 0.40-0.60 | 180 | 48.3% | -7.9% | -0.6% | -0.29% | Concentrated |
| 0.60-0.80 | 123 | 59.3% | 10.1% | 10.8% | -0.22% | Very concentrated |
| 0.80-1.00 | 136 | 51.5% | -3.1% | -2.9% | -0.09% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 64 | 35.9% | -33.2% | -34.3% | -0.14% | 4.3 |
| Broad battle | 246 | 48.0% | -6.8% | -1.4% | 0.06% | 3.9 |
| One-wallet nuke | 264 | 54.2% | 2.7% | 5.0% | -0.25% | 3.8 |
| Thin support | 438 | 54.8% | 3.3% | 3.4% | -0.26% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=714)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 26 | 53.8% | -2.1% | 19.8% | 0.31% | 4.2 | 88.5% |
| SMALL_MOVE | 151 | 49.0% | -7.4% | -2.7% | -0.69% | 4.1 | 100.0% |
| CLEAR_MOVE | 137 | 54.0% | -0.3% | 2.8% | 0.17% | 4.1 | 100.0% |
| NEAR_START | 280 | 49.3% | -4.2% | -7.4% | 0.04% | 3.8 | 100.0% |

**All Time** (n=1276)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 543 | 53.8% | -5.0% | -3.3% | -0.46% | 3.3 | 5.7% |
| SMALL_MOVE | 154 | 48.7% | -7.9% | -4.1% | -0.64% | 4.1 | 98.1% |
| CLEAR_MOVE | 163 | 54.0% | -0.2% | 2.6% | 0.08% | 4.1 | 100.0% |
| NEAR_START | 296 | 49.3% | -4.6% | -7.6% | 0.06% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 74 / 50.0% / -9.5% | 68 / 57.4% / 2.9% | 110 / 49.1% / -5.4% |
| 3.5-4★ | 8 / 37.5% / -29.6% | 50 / 54.0% / 5.9% | 40 / 45.0% / -16.6% | 76 / 53.9% / 9.2% |
| 2.5-3★ | 4 / 50.0% / -1.6% | 23 / 39.1% / -21.8% | 29 / 58.6% / 14.7% | 86 / 45.3% / -14.1% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 711 | 51.5% | -2.0% | 0.1% | 4.0 | -0.17% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 761 | 51.5% | -2.2% | -0.2% | 4.0 | -0.16% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1149 | 100% |
| LOCKED (direct) | 96 | 8.4% |
| Promoted (SHADOW→LOCKED) | 735 | 64.0% |
| Rejected (stayed SHADOW) | 188 | 16.4% |
| Superseded (side flipped) | 125 | 10.9% |
| Muted | 408 | 35.5% |
| Cancelled | 20 | 1.7% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=714)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | 3.32u | 0.3% | — |
| Flat 1.0u | -13.29u | -1.9% | +16.61u |
| Lock units only | 15.46u | — | -12.14u |
| Units change only on star change | 19.86u | — | -16.54u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 222 | 3.05 | -8.9% | -4.1% | -7.85u | Sizing hurts |
| 4.5 | 97 | 2.66 | 21.8% | 17.3% | +23.58u | Sizing helps |
| 4 | 139 | 1.31 | -8.8% | -2.9% | +6.94u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 88 | 0.86 | 2.9% | -8.6% | -9.06u | Sizing hurts |
| 2.5 | 86 | 0.62 | -8.3% | -12.7% | +0.35u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |

### All Time (n=1276)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -41.56u | -1.9% | — |
| Flat 1.0u | -42.80u | -3.4% | +1.24u |
| Lock units only | -18.66u | — | -22.90u |
| Units change only on star change | -24.18u | — | -17.38u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 235 | 3.03 | -8.9% | -4.6% | -11.44u | Sizing hurts |
| 4.5 | 131 | 2.64 | 12.9% | 8.8% | +13.57u | Sizing helps |
| 4 | 254 | 1.68 | -6.3% | -3.4% | +1.70u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 248 | 1.08 | -7.3% | -10.2% | -9.21u | Sizing hurts |
| 2.5 | 193 | 0.69 | -4.1% | -3.7% | +3.07u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 714 | 53.1% | 51.5% | -1.6% | -1.9% | -0.16% | Neutral |
| 4.5-5★ | 319 | 53.3% | 53.9% | +0.6% | 0.4% | -0.30% | Neutral |
| 3.5-4★ | 207 | 52.4% | 48.8% | -3.6% | -4.4% | -0.05% | Below market |
| 2.5-3★ | 176 | 53.5% | 51.1% | -2.4% | -1.6% | -0.06% | Below market |
| CLEAR_MOVE only | 137 | 54.1% | 54.0% | -0.1% | -0.3% | 0.17% | Neutral |
| NO_MOVE only | 26 | 54.6% | 53.8% | -0.7% | -2.1% | 0.31% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=80)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.612 | 43.327 | 0.12 |  |
| Rank_norm | 57.155 | 57.532 | 0.02 |  |
| PnL_norm | 51.513 | 51.909 | 0.02 |  |
| WalletBase | 48.483 | 46.525 | 0.15 |  |
| SizeRatio | 1.374 | 1.079 | 0.23 |  |
| ConvictionMult | 0.958 | 0.925 | 0.21 |  |
| WalletCountFor | 2.884 | 2.388 | 0.27 |  |
| TopShare | 0.601 | 0.685 | 0.33 |  |
| ForSide | 144.205 | 107.779 | 0.32 |  |
| AgainstSide | 51.101 | 61.548 | 0.13 |  |
| NetEdge | 1.008 | 0.555 | 0.52 |  |
| WalletPlayScore | 0.941 | -0.087 | 0.43 |  |

### V8 Era (n=586)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.612 | 44.024 | 0.09 |  |
| Rank_norm | 57.155 | 62.570 | 0.24 |  |
| PnL_norm | 51.513 | 54.016 | 0.14 |  |
| WalletBase | 48.483 | 48.260 | 0.02 |  |
| SizeRatio | 1.374 | 1.398 | 0.02 |  |
| ConvictionMult | 0.958 | 0.966 | 0.05 |  |
| WalletCountFor | 2.884 | 2.884 | 0.00 |  |
| TopShare | 0.601 | 0.601 | 0.00 |  |
| ForSide | 144.205 | 144.205 | 0.00 |  |
| AgainstSide | 51.101 | 51.101 | 0.00 |  |
| NetEdge | 1.008 | 1.008 | 0.00 |  |
| WalletPlayScore | 0.941 | 0.941 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=714)

No major failure modes detected.

### 7-Day (n=128)

No major failure modes detected.

### All Time (n=1276)

- **Environment issue**: 42.6% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 714 |
| V8 flat ROI | -1.9% |
| V8 model ROI | 0.3% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | 0.4% |
| 2.5-3★ ROI | -1.6% |
| CLEAR_MOVE ROI | -0.3% |
| NO_MOVE ROI | -2.1% |
| Single-wallet play rate | 34.9% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.02% | 4.5★: -0.93% | 4★: -0.05% | 3.5★: -0.07% | 3★: 0.11% | 2.5★: -0.22% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=714)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 628 | 88.0% | 51.0% | -2.3% | -1.6% | -0.18% |
| MUTED | 75 | 10.5% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.5% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=128)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 128 | 100.0% | 53.1% | 3.1% | 9.4% | -0.49% |

### All Time (n=1276)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1188 | 93.1% | 52.1% | -3.9% | -3.3% | -0.28% |
| MUTED | 75 | 5.9% | 56.0% | 2.2% | 20.8% | -0.11% |
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
