# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-06-16 ET
**Completed Picks**: 1306 | **V8 Era Picks**: 744 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (61.5%) beats 5★ (49.1%) |
| Single-wallet dependency | ⚠️ | 36% of picks are single-wallet (WR: 54.0%, ROI: 2.8%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 49 | 49.0% | -4.01u | -8.2% | -9.19u | -9.6% | -0.25% | -0.78% |  |
| 7-Day | 121 | 48.8% | -7.34u | -6.1% | -0.28u | -0.1% | -0.59% | -0.09% |  |
| 14-Day | 232 | 52.6% | 1.17u | 0.5% | 22.61u | 4.9% | -0.43% | 0.21% |  |
| 30-Day | 474 | 51.9% | -10.32u | -2.2% | 0.66u | 0.1% | -0.27% | -0.44% |  |
| V8 Era | 744 | 51.2% | -19.56u | -2.6% | -7.68u | -0.6% | -0.18% | -0.42% |  |
| All Time | 1306 | 52.2% | -49.08u | -3.8% | -52.56u | -2.4% | -0.29% | -0.16% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=744)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 226 | 53.6% | 53.6% | 49.1% | -4.4% | -9.7% | -4.8% | 3.08 | -0.03% | Weak |
| 4.5 | 104 | 53.1% | 53.1% | 61.5% | +8.5% | 17.2% | 13.0% | 2.67 | -0.92% | Strong |
| 4 | 148 | 53.0% | 53.0% | 47.3% | -5.7% | -9.3% | -2.6% | 1.29 | -0.07% | Weak |
| 3.5 | 68 | 51.2% | 51.2% | 51.5% | +0.2% | 4.8% | 8.8% | 0.79 | -0.07% | Fair |
| 3 | 92 | 53.4% | 53.4% | 53.3% | -0.2% | 2.2% | -5.5% | 0.84 | 0.08% | Fair |
| 2.5 | 92 | 53.6% | 53.6% | 48.9% | -4.7% | -6.5% | -11.2% | 0.60 | -0.21% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.1% | 61.5% | -12.4% | INVERTED |
| 4.5★ vs 4★ | 61.5% | 47.3% | +14.2% | Correct |
| 4★ vs 3.5★ | 47.3% | 51.5% | -4.2% | INVERTED |
| 3.5★ vs 3★ | 51.5% | 53.3% | -1.8% | Flat |
| 3★ vs 2.5★ | 53.3% | 48.9% | +4.4% | Correct |
| 2.5★ vs 2★ | 48.9% | 0.0% | +48.9% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.286 |
| Spearman: Stars vs Flat ROI | 0.190 |
| Spearman: Stars vs CLV | -0.500 |
| Brier Score | 0.2479 |
| Monotonicity Score | 0.14 |

### All Time (n=1306)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 239 | 53.8% | 53.8% | 49.4% | -4.5% | -9.6% | -5.2% | 3.06 | 0.02% | Weak |
| 4.5 | 138 | 54.2% | 54.2% | 58.7% | +4.5% | 9.9% | 6.0% | 2.66 | -0.39% | Strong |
| 4 | 263 | 54.3% | 54.3% | 50.2% | -4.1% | -6.7% | -3.2% | 1.65 | -0.34% | Weak |
| 3.5 | 186 | 54.8% | 54.8% | 56.5% | +1.7% | 2.0% | 4.1% | 1.41 | -0.25% | Fair |
| 3 | 252 | 54.5% | 54.5% | 50.4% | -4.1% | -7.4% | -9.3% | 1.07 | -0.32% | Weak |
| 2.5 | 199 | 54.1% | 54.1% | 52.3% | -1.8% | -3.4% | -3.2% | 0.67 | -0.52% | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |
| 1 | 10 | 53.9% | 53.9% | 50.0% | -3.9% | -7.6% | 13.6% | 0.50 | -0.01% | Weak |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 49.4% | 58.7% | -9.3% | INVERTED |
| 4.5★ vs 4★ | 58.7% | 50.2% | +8.5% | Correct |
| 4★ vs 3.5★ | 50.2% | 56.5% | -6.3% | INVERTED |
| 3.5★ vs 3★ | 56.5% | 50.4% | +6.1% | Correct |
| 3★ vs 2.5★ | 50.4% | 52.3% | -1.9% | Flat |
| 2.5★ vs 2★ | 52.3% | 0.0% | +52.3% | Correct |
| 2★ vs 1★ | 0.0% | 50.0% | -50.0% | INVERTED |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.286 |
| Spearman: Stars vs Flat ROI | 0.333 |
| Spearman: Stars vs CLV | -0.190 |
| Brier Score | 0.2391 |
| Monotonicity Score | 0.14 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | -0.090 | -0.013 | Tune |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.176 | -0.119 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.086 | -0.051 | Tune |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.130 | -0.043 | Tune |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | -0.057 | -0.012 | Tune |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | -0.025 | 0.017 | Monitor |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | -0.131 | -0.036 | Tune |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.188 | -0.088 | Tune |
| AgainstSide | Opposition | Force against side | Higher → worse | -0.002 | 0.036 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.153 | -0.082 | Tune |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | -0.027 | -0.007 | Monitor |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.201 | 0.112 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.205 | 0.117 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.176 | -0.094 | Tune |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (11.60–35.20) | 122 | 52.5% | -5.9% | -1.6% | -0.10% |  |
| p20-40 (35.25–42.58) | 123 | 56.1% | 8.5% | 9.0% | -0.33% |  |
| p40-60 (42.67–48.10) | 123 | 51.2% | -2.9% | 3.7% | -0.37% |  |
| p60-80 (48.10–53.90) | 122 | 46.7% | -10.9% | -9.5% | 0.12% |  |
| p80-95 (53.95–61.44) | 123 | 47.2% | -5.1% | -9.9% | -0.06% |  |
| p95+ (61.50–83.30) | 123 | 52.8% | -0.3% | 1.0% | -0.35% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 286 | 47.6% | -9.7% | -8.7% | -0.39% |  |
| 0.90-1.05 | 255 | 49.4% | -7.0% | -4.8% | -0.05% |  |
| 1.05-1.20 | 137 | 62.8% | 22.8% | 28.2% | 0.03% |  |
| 1.20-1.35 | 37 | 48.6% | -10.2% | -19.4% | 0.15% |  |
| 1.35-1.50 | 11 | 45.5% | -15.6% | -42.1% | -0.34% |  |
| 1.50+ | 1 | 100.0% | 94.3% | 94.7% | 0.23% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-2.06–0.23) | 101 | 50.5% | -5.3% | -1.3% | -0.31% |  |
| 20-40% (0.24–0.59) | 101 | 59.4% | 10.2% | 15.2% | 0.10% |  |
| 40-60% (0.62–0.88) | 101 | 48.5% | -8.8% | 2.8% | -0.66% |  |
| 60-80% (0.88–1.19) | 101 | 55.4% | 8.3% | -2.1% | 0.08% |  |
| 80-95% (1.20–1.65) | 101 | 45.5% | -10.8% | -7.0% | 0.05% |  |
| 95%+ (1.66–6.68) | 102 | 44.1% | -17.6% | -11.8% | -0.01% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 33 | 33.3% | -32.0% | -33.9% | 0.17% | Broad support |
| 0.25-0.40 | 119 | 47.1% | -8.0% | -9.3% | 0.16% | Healthy support |
| 0.40-0.60 | 185 | 48.6% | -7.6% | 0.1% | -0.28% | Concentrated |
| 0.60-0.80 | 126 | 60.3% | 11.6% | 12.2% | -0.21% | Very concentrated |
| 0.80-1.00 | 144 | 51.4% | -3.5% | -0.8% | -0.15% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 69 | 37.7% | -30.4% | -31.8% | -0.18% | 4.2 |
| Broad battle | 251 | 48.6% | -5.9% | -1.0% | 0.06% | 3.9 |
| One-wallet nuke | 281 | 52.7% | -0.0% | 1.4% | -0.27% | 3.9 |
| Thin support | 459 | 54.0% | 1.8% | 1.6% | -0.27% | 3.9 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=744)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 28 | 53.6% | -2.8% | 23.3% | 0.20% | 4.2 | 89.3% |
| SMALL_MOVE | 155 | 49.7% | -6.3% | -0.9% | -0.66% | 4.1 | 100.0% |
| CLEAR_MOVE | 138 | 54.3% | 0.1% | 2.8% | 0.18% | 4.1 | 100.0% |
| NEAR_START | 294 | 49.3% | -4.5% | -6.5% | -0.01% | 3.8 | 100.0% |

**All Time** (n=1306)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 545 | 53.8% | -5.0% | -3.0% | -0.47% | 3.3 | 6.1% |
| SMALL_MOVE | 158 | 49.4% | -6.9% | -2.3% | -0.61% | 4.1 | 98.1% |
| CLEAR_MOVE | 164 | 54.3% | 0.1% | 2.6% | 0.09% | 4.1 | 100.0% |
| NEAR_START | 310 | 49.4% | -4.9% | -6.8% | 0.01% | 3.8 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 14 / 64.3% / 13.6% | 75 / 50.7% / -8.2% | 68 / 57.4% / 2.9% | 113 / 49.6% / -4.6% |
| 3.5-4★ | 9 / 33.3% / -37.5% | 51 / 54.9% / 7.0% | 41 / 46.3% / -15.0% | 80 / 52.5% / 6.0% |
| 2.5-3★ | 5 / 60.0% / 13.9% | 25 / 40.0% / -20.8% | 29 / 58.6% / 14.7% | 93 / 46.2% / -13.0% |
| 1.0-2★ | — | 4 / 25.0% / -51.2% | — | 8 / 50.0% / -8.9% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 741 | 51.1% | -2.8% | -0.7% | 4.0 | -0.18% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 791 | 51.2% | -2.9% | -1.0% | 4.0 | -0.18% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 1231 | 100% |
| LOCKED (direct) | 97 | 7.9% |
| Promoted (SHADOW→LOCKED) | 799 | 64.9% |
| Rejected (stayed SHADOW) | 190 | 15.4% |
| Superseded (side flipped) | 140 | 11.4% |
| Muted | 436 | 35.4% |
| Cancelled | 20 | 1.6% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=744)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -7.68u | -0.6% | — |
| Flat 1.0u | -19.56u | -2.6% | +11.88u |
| Lock units only | -6.15u | — | -1.53u |
| Units change only on star change | -1.74u | — | -5.94u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 226 | 3.08 | -9.7% | -4.8% | -11.34u | Sizing hurts |
| 4.5 | 104 | 2.67 | 17.2% | 13.0% | +18.16u | Sizing helps |
| 4 | 148 | 1.29 | -9.3% | -2.6% | +8.87u | Sizing helps |
| 3.5 | 68 | 0.79 | 4.8% | 8.8% | +1.52u | Sizing helps |
| 3 | 92 | 0.84 | 2.2% | -5.5% | -6.26u | Sizing hurts |
| 2.5 | 92 | 0.60 | -6.5% | -11.2% | -0.19u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |

### All Time (n=1306)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -52.56u | -2.4% | — |
| Flat 1.0u | -49.08u | -3.8% | -3.48u |
| Lock units only | -40.26u | — | -12.30u |
| Units change only on star change | -45.78u | — | -6.78u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 239 | 3.06 | -9.6% | -5.2% | -14.93u | Sizing hurts |
| 4.5 | 138 | 2.66 | 9.9% | 6.0% | +8.14u | Sizing helps |
| 4 | 263 | 1.65 | -6.7% | -3.2% | +3.63u | Sizing helps |
| 3.5 | 186 | 1.41 | 2.0% | 4.1% | +6.83u | Sizing helps |
| 3 | 252 | 1.07 | -7.4% | -9.3% | -6.41u | Sizing hurts |
| 2.5 | 199 | 0.67 | -3.4% | -3.2% | +2.52u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |
| 1 | 10 | 0.50 | -7.6% | 13.6% | +1.44u | Sizing helps |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 744 | 53.2% | 51.2% | -1.9% | -2.6% | -0.18% | Neutral |
| 4.5-5★ | 330 | 53.4% | 53.0% | -0.4% | -1.2% | -0.31% | Neutral |
| 3.5-4★ | 216 | 52.4% | 48.6% | -3.8% | -4.9% | -0.07% | Below market |
| 2.5-3★ | 186 | 53.5% | 51.6% | -1.9% | -1.2% | -0.07% | Neutral |
| CLEAR_MOVE only | 138 | 54.2% | 54.3% | +0.1% | 0.1% | 0.18% | Neutral |
| NO_MOVE only | 28 | 54.6% | 53.6% | -1.0% | -2.8% | 0.20% | Neutral |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=73)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.335 | 42.007 | 0.18 |  |
| Rank_norm | 56.288 | 51.098 | 0.22 |  |
| PnL_norm | 51.036 | 50.339 | 0.04 |  |
| WalletBase | 48.106 | 44.942 | 0.24 |  |
| SizeRatio | 1.354 | 1.055 | 0.23 |  |
| ConvictionMult | 0.955 | 0.917 | 0.23 |  |
| WalletCountFor | 2.865 | 2.315 | 0.30 |  |
| TopShare | 0.604 | 0.687 | 0.33 |  |
| ForSide | 142.203 | 97.084 | 0.41 |  |
| AgainstSide | 50.339 | 51.588 | 0.02 |  |
| NetEdge | 0.994 | 0.532 | 0.53 |  |
| WalletPlayScore | 0.910 | -0.143 | 0.44 |  |

### V8 Era (n=607)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 45.335 | 43.562 | 0.10 |  |
| Rank_norm | 56.288 | 61.887 | 0.24 |  |
| PnL_norm | 51.036 | 53.731 | 0.15 |  |
| WalletBase | 48.106 | 47.864 | 0.02 |  |
| SizeRatio | 1.354 | 1.386 | 0.03 |  |
| ConvictionMult | 0.955 | 0.964 | 0.06 |  |
| WalletCountFor | 2.865 | 2.865 | 0.00 |  |
| TopShare | 0.604 | 0.604 | 0.00 |  |
| ForSide | 142.203 | 142.203 | 0.00 |  |
| AgainstSide | 50.339 | 50.339 | 0.00 |  |
| NetEdge | 0.994 | 0.994 | 0.00 |  |
| WalletPlayScore | 0.910 | 0.910 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=744)

No major failure modes detected.

### 7-Day (n=121)

- **Ranking issue**: ≤3★ WR (56%) beats ≥4★ (46%)
- **Odds issue**: Avg CLV -0.59% — consistently getting bad closing lines

### All Time (n=1306)

- **Sizing issue**: Model P/L (-52.56u) trails flat (-49.08u) by 3.48u
- **Environment issue**: 41.7% NO_MOVE (WR: 53.8%, ROI: -5.0%)


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
| V8 era picks | 744 |
| V8 flat ROI | -2.6% |
| V8 model ROI | -0.6% |
| V8 star monotonicity score | 0.14 |
| 4.5-5★ ROI | -1.2% |
| 2.5-3★ ROI | -1.2% |
| CLEAR_MOVE ROI | 0.1% |
| NO_MOVE ROI | -2.8% |
| Single-wallet play rate | 35.6% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: -0.03% | 4.5★: -0.92% | 4★: -0.07% | 3.5★: -0.07% | 3★: 0.08% | 2.5★: -0.21% | 2★: 0.67% | 1★: -0.01% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=744)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 658 | 88.4% | 50.6% | -3.2% | -2.5% | -0.19% |
| MUTED | 75 | 10.1% | 56.0% | 2.2% | 20.8% | -0.11% |
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

### 7-Day (n=121)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 121 | 100.0% | 48.8% | -6.1% | -0.1% | -0.59% |

### All Time (n=1306)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 1218 | 93.3% | 51.9% | -4.4% | -3.7% | -0.29% |
| MUTED | 75 | 5.7% | 56.0% | 2.2% | 20.8% | -0.11% |
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
