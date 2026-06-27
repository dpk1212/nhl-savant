# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-27 ET
**Completed Picks**: 1528 | **V8 Era Picks**: 966 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (56.4%) beats 5★ (50.2%) |
| Single-wallet dependency | ⚠️ | 43% of picks are single-wallet (WR: 53.5%, ROI: 1.3%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 65 | 56.9% | -0.11u | -0.2% | -3.88u | -3.3% | -0.87% | 2.98% | Strong |
| 7-Day | 147 | 49.7% | -14.69u | -10.0% | -3.05u | -1.1% | 0.15% | 1.12% |  |
| 14-Day | 271 | 50.9% | -17.46u | -6.4% | -5.04u | -1.0% | -0.03% | 0.24% |  |
| 30-Day | 526 | 51.7% | -16.50u | -3.1% | 29.43u | 2.9% | -0.24% | -0.08% |  |
| V8 Era | 966 | 51.2% | -33.02u | -3.4% | -3.53u | -0.2% | -0.13% | -0.34% |  |
| All Time | 1528 | 52.1% | -62.53u | -4.1% | -48.41u | -1.8% | -0.24% | -0.14% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=966)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 273 | 53.6% | 53.6% | 50.2% | -3.4% | -8.1% | -4.2% | 3.21 | -0.20% | Weak |
| 4.5 | 179 | 52.2% | 52.2% | 56.4% | +4.2% | 6.3% | 10.5% | 2.58 | -0.22% | Strong |
| 4 | 182 | 52.5% | 52.5% | 47.8% | -4.7% | -8.6% | -1.3% | 1.23 | -0.42% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 118 | 52.4% | 52.4% | 50.0% | -2.4% | -4.4% | -8.1% | 0.76 | 0.65% | Fair |
| 2.5 | 127 | 53.5% | 53.5% | 51.2% | -2.3% | -4.0% | -15.8% | 0.50 | -0.24% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.2% | 56.4% | -6.2% | INVERTED |
| 4.5★ vs 4★ | 56.4% | 47.8% | +8.6% | Correct |
| 4★ vs 3.5★ | 47.8% | 51.5% | -3.7% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 50.0% | +1.5% | Correct |
| 3★ vs 2.5★ | 50.0% | 51.2% | -1.2% | Flat |
| 2.5★ vs 2★ | 51.2% | 0.0% | +51.2% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.048 |
| Spearman: Stars vs Flat ROI | 0.000 |
| Spearman: Stars vs CLV | -0.524 |
| Brier Score | 0.2416 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### All Time (n=1528)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 286 | 53.8% | 53.8% | 50.3% | -3.5% | -8.1% | -4.5% | 3.19 | -0.15% | Weak |
| 4.5 | 213 | 53.1% | 53.1% | 55.4% | +2.3% | 3.3% | 6.2% | 2.58 | 0.02% | Fair |
| 4 | 297 | 53.8% | 53.8% | 50.2% | -3.7% | -6.5% | -2.6% | 1.58 | -0.53% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 278 | 54.0% | 54.0% | 49.3% | -4.7% | -9.3% | -10.0% | 1.02 | 0.01% | Weak |
| 2.5 | 234 | 53.9% | 53.9% | 53.0% | -0.9% | -2.5% | -5.7% | 0.61 | -0.49% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 15 | 52.7% | 52.7% | 60.0% | +7.3% | 5.8% | 20.8% | 0.40 | 0.11% | Strong |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.3% | 55.4% | -5.1% | INVERTED |
| 4.5★ vs 4★ | 55.4% | 50.2% | +5.2% | Correct |
| 4★ vs 3.5★ | 50.2% | 56.5% | -6.3% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 49.3% | +7.2% | Correct |
| 3★ vs 2.5★ | 49.3% | 53.0% | -3.7% | INVERTED |
| 2.5★ vs 2★ | 53.0% | 0.0% | +53.0% | Correct |
| 2★ vs 1★ | 0.0% | 60.0% | -60.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | -0.048 |
| Spearman: Stars vs Flat ROI | -0.048 |
| Spearman: Stars vs CLV | -0.429 |
| Brier Score | 0.2364 |
| Monotonicity Score | 0.14 |

**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.085 | -0.016 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.163 | -0.105 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.093 | -0.048 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.131 | -0.043 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.072 | -0.019 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.047 | 0.004 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.139 | -0.043 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.179 | -0.097 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.003 | 0.031 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.141 | -0.087 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.014 | -0.017 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.181 | 0.114 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.184 | 0.119 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.156 | -0.099 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (10.60–34.15) | 159 | 47.8% | -13.4% | -1.4% | -0.15% |  |
| p20-40 (34.16–39.77) | 160 | 56.9% | 5.2% | 7.8% | -0.29% |  |
| p40-60 (39.80–45.17) | 160 | 54.4% | 4.6% | -2.3% | -0.69% |  |
| p60-80 (45.17–51.38) | 159 | 49.7% | -7.4% | 4.3% | -0.03% |  |
| p80-95 (51.40–59.00) | 160 | 51.2% | 1.2% | -2.2% | 0.58% |  |
| p95+ (59.08–83.30) | 160 | 46.9% | -11.5% | -10.8% | -0.23% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 414 | 49.3% | -7.7% | -3.2% | -0.44% |  |
| 0.90-1.05 | 310 | 48.4% | -9.6% | -7.9% | 0.10% |  |
| 1.05-1.20 | 161 | 64.0% | 24.3% | 29.8% | -0.08% |  |
| 1.20-1.35 | 45 | 44.4% | -18.5% | -23.2% | 1.21% |  |
| 1.35-1.50 | 13 | 38.5% | -28.6% | -47.4% | -0.54% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.19) | 120 | 49.2% | -6.2% | -0.7% | -0.37% |  |
| 20-40% (0.19–0.51) | 120 | 58.3% | 6.8% | 10.8% | -0.17% |  |
| 40-60% (0.51–0.80) | 120 | 53.3% | -0.3% | 8.8% | -0.01% |  |
| 60-80% (0.81–1.12) | 120 | 49.2% | -4.8% | -8.8% | -0.08% |  |
| 80-95% (1.12–1.60) | 120 | 45.8% | -11.0% | -4.0% | 0.09% |  |
| 95%+ (1.60–6.68) | 121 | 47.9% | -12.4% | -7.8% | -0.03% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 38 | 36.8% | -28.5% | -28.4% | 0.34% | Broad support |
| 0.25-0.40 | 135 | 47.4% | -9.0% | -5.7% | 0.05% | Healthy support |
| 0.40-0.60 | 224 | 49.6% | -7.0% | -0.1% | -0.28% | Concentrated |
| 0.60-0.80 | 139 | 58.3% | 7.8% | 10.3% | -0.18% | Very concentrated |
| 0.80-1.00 | 185 | 51.4% | -3.2% | 0.4% | 0.01% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 80 | 40.0% | -29.4% | -26.7% | -0.27% | 4.2 |
| Broad battle | 294 | 48.6% | -6.6% | 0.9% | 0.07% | 3.8 |
| One-wallet nuke | 430 | 52.3% | -1.2% | 0.9% | -0.14% | 3.9 |
| Thin support | 639 | 53.1% | -0.2% | 0.4% | -0.15% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=966)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 32 | 53.1% | -6.9% | 27.2% | 1.72% | 4.1 | 90.6% |
| SMALL_MOVE | 185 | 50.3% | -5.8% | 1.5% | -0.54% | 4.1 | 100.0% |
| CLEAR_MOVE | 147 | 53.7% | -1.4% | 2.8% | 0.08% | 4.1 | 100.0% |
| NEAR_START | 365 | 49.6% | -4.9% | -6.1% | -0.09% | 3.8 | 100.0% |

**All Time** (n=1528)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 549 | 53.7% | -5.3% | -2.6% | -0.35% | 3.3 | 6.7% |
| SMALL_MOVE | 188 | 50.0% | -6.3% | 0.2% | -0.50% | 4.1 | 98.4% |
| CLEAR_MOVE | 173 | 53.8% | -1.1% | 2.6% | 0.01% | 4.1 | 100.0% |
| NEAR_START | 381 | 49.6% | -5.2% | -6.4% | -0.07% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 16 / 62.5% / 5.6% | 91 / 50.5% / -7.6% | 73 / 57.5% / 2.8% | 142 / 50.0% / -5.3% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 55 / 56.4% / 8.7% | 43 / 44.2% / -19.0% | 93 / 52.7% / 5.7% |
| 2.5-3★ | 6 / 50.0% / -5.1% | 34 / 41.2% / -21.6% | 31 / 58.1% / 13.3% | 119 / 46.2% / -12.8% |
| 1.0-2★ | 1 / 100.0% / 57.1% | 5 / 40.0% / -25.6% | — | 11 / 54.5% / -3.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 963 | 51.2% | -3.5% | -0.3% | 4.0 | -0.13% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 1013 | 51.2% | -3.6% | -0.5% | 4.0 | -0.13% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1607 | 100% |
| LOCKED (direct) | 104 | 6.5% |
| Promoted (SHADOW→LOCKED) | 1066 | 66.3% |
| Rejected (stayed SHADOW) | 201 | 12.5% |
| Superseded (side flipped) | 231 | 14.4% |
| Muted | 563 | 35.0% |
| Cancelled | 20 | 1.2% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=966)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -3.53u | -0.2% | — |
| Flat 1.0u | -33.02u | -3.4% | +29.49u |
| Lock units only | -18.55u | — | +15.02u |
| Units change only on star change | -14.14u | — | +10.61u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 273 | 3.21 | -8.1% | -4.2% | -14.57u | Sizing hurts |
| 4.5 | 179 | 2.58 | 6.3% | 10.5% | +36.94u | Sizing helps |
| 4 | 182 | 1.23 | -8.6% | -1.3% | +12.67u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 118 | 0.76 | -4.4% | -8.1% | -2.13u | Sizing hurts |
| 2.5 | 127 | 0.50 | -4.0% | -15.8% | -5.00u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |

### All Time (n=1528)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -48.41u | -1.8% | — |
| Flat 1.0u | -62.53u | -4.1% | +14.12u |
| Lock units only | -52.67u | — | +4.26u |
| Units change only on star change | -58.19u | — | +9.78u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 286 | 3.19 | -8.1% | -4.5% | -18.17u | Sizing hurts |
| 4.5 | 213 | 2.58 | 3.3% | 6.2% | +26.92u | Sizing helps |
| 4 | 297 | 1.58 | -6.5% | -2.6% | +7.43u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 278 | 1.02 | -9.3% | -10.0% | -2.28u | Sizing hurts |
| 2.5 | 234 | 0.61 | -2.5% | -5.7% | -2.28u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 15 | 0.40 | 5.8% | 20.8% | +0.38u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 966 | 52.8% | 51.2% | -1.5% | -3.4% | -0.13% | Neutral |
| 4.5-5★ | 452 | 53.0% | 52.7% | -0.4% | -2.4% | -0.21% | Neutral |
| 3.5-4★ | 250 | 52.1% | 48.8% | -3.3% | -5.0% | -0.33% | Below market |
| 2.5-3★ | 247 | 53.0% | 51.0% | -2.0% | -3.5% | 0.19% | Neutral |
| CLEAR_MOVE only | 147 | 54.1% | 53.7% | -0.4% | -1.4% | 0.08% | Neutral |
| NO_MOVE only | 32 | 53.5% | 53.1% | -0.3% | -6.9% | 1.72% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=74)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.031 | 37.272 | 0.37 |  |
| Rank_norm | 50.615 | 39.669 | 0.42 |  |
| PnL_norm | 47.233 | 38.256 | 0.44 |  |
| WalletBase | 46.122 | 40.009 | 0.48 |  |
| SizeRatio | 1.295 | 1.299 | 0.00 |  |
| ConvictionMult | 0.939 | 0.929 | 0.06 |  |
| WalletCountFor | 2.845 | 2.878 | 0.02 |  |
| TopShare | 0.613 | 0.679 | 0.26 |  |
| ForSide | 135.387 | 106.626 | 0.26 |  |
| AgainstSide | 48.386 | 36.174 | 0.16 |  |
| NetEdge | 0.943 | 0.759 | 0.20 |  |
| WalletPlayScore | 0.802 | 0.271 | 0.22 |  |

### V8 Era (n=721)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 44.031 | 42.648 | 0.08 |  |
| Rank_norm | 50.615 | 58.185 | 0.29 |  |
| PnL_norm | 47.233 | 51.211 | 0.19 |  |
| WalletBase | 46.122 | 46.554 | 0.03 |  |
| SizeRatio | 1.295 | 1.358 | 0.05 |  |
| ConvictionMult | 0.939 | 0.956 | 0.10 |  |
| WalletCountFor | 2.845 | 2.845 | 0.00 |  |
| TopShare | 0.613 | 0.613 | 0.00 |  |
| ForSide | 135.387 | 135.387 | 0.00 |  |
| AgainstSide | 48.386 | 48.386 | 0.00 |  |
| NetEdge | 0.943 | 0.943 | 0.00 |  |
| WalletPlayScore | 0.802 | 0.802 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=966)

No major failure modes detected.

### 7-Day (n=147)

- **Concentration issue**: 38 high-concentration picks (TopShare>0.6) at -14.0% ROI

### All Time (n=1528)

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
| V8 era picks | 966 |
| V8 flat ROI | -3.4% |
| V8 model ROI | -0.2% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -2.4% |
| 2.5-3★ ROI | -3.5% |
| CLEAR_MOVE ROI | -1.4% |
| NO_MOVE ROI | -6.9% |
| Single-wallet play rate | 42.5% |
| Whale override win rate | 80.0% |
| Avg CLV by star bucket | 5★: -0.20% | 4.5★: -0.22% | 4★: -0.42% | 3.5★: -0.07% | 3★: 0.65% | 2.5★: -0.24% | 2★: 0.67% | 1★: 0.11% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=966)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 880 | 91.1% | 50.8% | -3.9% | -1.6% | -0.14% |
| MUTED | 75 | 7.8% | 56.0% | 2.2% | 20.8% | -0.11% |
| CANCELLED | 11 | 1.1% | 54.5% | -2.8% | -10.4% | 0.16% |

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

### 7-Day (n=147)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 147 | 100.0% | 49.7% | -10.0% | -1.1% | 0.15% |

### All Time (n=1528)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1440 | 94.2% | 51.8% | -4.6% | -2.9% | -0.24% |
| MUTED | 75 | 4.9% | 56.0% | 2.2% | 20.8% | -0.11% |
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
