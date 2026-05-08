# Sharp Flow — V8 Diagnostic Report
**Generated**: 2026-05-08 ET
**Completed Picks**: 759 | **V8 Era Picks**: 197 | **V8 Since**: 2026-04-18
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
| Star inversion | ⚠️ | 4.5★ WR (60.0%) beats 5★ (51.9%) |

---

## 2. Performance Windows

Track V8 on multiple windows so you do not get fooled by one hot or cold streak.

| Window | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Avg CLV | Avg EV | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 3-Day | 10 | 60.0% | 1.35u | 13.5% | 3.34u | 16.6% | -0.78% | -0.26% | Strong |
| 7-Day | 37 | 48.6% | -2.88u | -7.8% | -4.88u | -9.3% | -0.98% | -0.33% |  |
| 14-Day | 121 | 49.6% | -6.87u | -5.7% | -5.91u | -3.4% | -0.30% | -0.25% |  |
| 30-Day | 456 | 48.9% | -37.95u | -8.3% | -55.89u | -8.7% | -0.22% | -0.23% |  |
| V8 Era | 197 | 48.2% | -11.30u | -5.7% | -10.52u | -3.9% | -0.10% | -0.38% |  |
| All Time | 759 | 52.2% | -40.82u | -5.4% | -55.40u | -4.9% | -0.35% | -0.07% |  |

---

## 3. Star Calibration

V8 is working only if higher stars beat lower stars.

### V8 Era (n=197)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 54 | 53.2% | 53.2% | 51.9% | -1.4% | -6.0% | -0.7% | 2.38 | 0.07% | Weak |
| 4.5 | 10 | 49.7% | 49.7% | 60.0% | +10.3% | 30.7% | 25.6% | 2.20 | -0.61% | Strong |
| 4 | 27 | 52.7% | 52.7% | 51.9% | -0.8% | 0.5% | -8.1% | 1.23 | 0.15% | Fair |
| 3.5 | 51 | 50.7% | 50.7% | 49.0% | -1.7% | 2.8% | 5.7% | 0.72 | -0.22% | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | -0.02% | Failing |
| 2.5 | 30 | 53.2% | 53.2% | 40.0% | -13.2% | -23.0% | -36.3% | 0.73 | -0.28% | Failing |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 51.9% | 60.0% | -8.1% | INVERTED |
| 4.5★ vs 4★ | 60.0% | 51.9% | +8.1% | Correct |
| 4★ vs 3.5★ | 51.9% | 49.0% | +2.9% | Correct |
| 3.5★ vs 3★ | 49.0% | 38.1% | +10.9% | Correct |
| 3★ vs 2.5★ | 38.1% | 40.0% | -1.9% | Flat |
| 2.5★ vs 2★ | 40.0% | 0.0% | +40.0% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.857 |
| Spearman: Stars vs Flat ROI | 0.714 |
| Spearman: Stars vs CLV | -0.214 |
| Brier Score | 0.2521 |
| Monotonicity Score | -0.33 |

### All Time (n=759)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 67 | 54.3% | 54.3% | 52.2% | -2.0% | -6.5% | -3.4% | 2.43 | 0.22% | Weak |
| 4.5 | 44 | 55.9% | 55.9% | 52.3% | -3.6% | -2.6% | -7.7% | 2.52 | 1.00% | Fair |
| 4 | 142 | 55.3% | 55.3% | 53.5% | -1.8% | -2.5% | -4.2% | 1.95 | -0.55% | Fair |
| 3.5 | 169 | 55.0% | 55.0% | 56.2% | +1.2% | 1.2% | 3.2% | 1.45 | -0.33% | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | -0.54% | Weak |
| 2.5 | 137 | 54.2% | 54.2% | 51.8% | -2.4% | -5.6% | -5.9% | 0.73 | -0.69% | Weak |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | 0.67% | Failing |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.2% | 52.3% | -0.1% | Flat |
| 4.5★ vs 4★ | 52.3% | 53.5% | -1.2% | Flat |
| 4★ vs 3.5★ | 53.5% | 56.2% | -2.7% | Flat |
| 3.5★ vs 3★ | 56.2% | 47.5% | +8.7% | Correct |
| 3★ vs 2.5★ | 47.5% | 51.8% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 51.8% | 0.0% | +51.8% | Correct |

**Calibration Summary**

| Metric | Value |
|---|---|
| Spearman: Stars vs WR | 0.607 |
| Spearman: Stars vs Flat ROI | 0.429 |
| Spearman: Stars vs CLV | 0.286 |
| Brier Score | 0.2339 |
| Monotonicity Score | 0.33 |


---

## 4. V8 Core Variable Audit

These are the variables that actually make V8 work. Each one should be tracked as a predictor.

| Variable | Type | What It Measures | Expected Direction | Spearman vs WR | Spearman vs ROI | Verdict |
|---|---|---|---|---|---|---|
| ROI_norm | Wallet quality | Wallet skill percentile | Higher → better | 0.088 | 0.059 | Keep |
| Rank_norm | Wallet quality | Leaderboard quality | Higher → better | -0.083 | -0.074 | Tune |
| PnL_norm | Wallet quality | Wallet durability | Higher → better | -0.035 | -0.059 | Monitor |
| WalletBase | Wallet quality | Composite skill score | Higher → better | -0.009 | -0.035 | Monitor |
| SizeRatio | Conviction | Current bet vs avg bet | Higher → better (nonlinear) | 0.143 | 0.169 | Keep |
| ConvictionMult | Conviction | Log-scaled conviction boost | Higher → better (capped) | 0.203 | 0.224 | Keep |
| WalletContribution | Per-wallet force | Skill × conviction | Higher → better | 0.135 | 0.133 | Keep |
| ForSide | Side support | Total wallet force on side | Higher → better | -0.031 | 0.028 | Monitor |
| AgainstSide | Opposition | Force against side | Higher → worse | 0.041 | 0.095 | Monitor |
| NetEdge | Core side edge | For minus discounted against | Higher → better | -0.019 | -0.021 | Monitor |
| BreadthBonus | Consensus | More supporting wallets | Higher → better (modest) | 0.058 | 0.086 | Keep |
| TopShare | Concentration | Dependency on one wallet | Higher → worse | 0.072 | -0.015 | Tune |
| ConcPenalty | Concentration | Penalty from TopShare | Higher → worse | 0.085 | 0.000 | Tune |
| WalletPlayScore | Final raw score | Pre-star V8 signal | Higher → better | -0.035 | 0.016 | Monitor |

---

## 5. Variable Buckets

This is how you find out where V8 is actually making money.

### WalletBase Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| p0-20 (36.10–50.40) | 31 | 45.2% | -8.2% | -6.0% | -0.58% |  |
| p20-40 (50.53–54.60) | 32 | 59.4% | 25.2% | 27.2% | 0.48% |  |
| p40-60 (54.76–58.48) | 31 | 54.8% | 9.9% | 0.4% | 0.28% |  |
| p60-80 (59.08–63.29) | 32 | 43.8% | -15.0% | -6.2% | 0.34% |  |
| p80-95 (63.40–65.93) | 31 | 41.9% | -28.3% | -31.3% | -0.69% |  |
| p95+ (66.00–82.40) | 32 | 40.6% | -22.2% | -21.9% | -0.55% |  |

### ConvictionMultiplier Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| 0.70-0.90 | 68 | 41.2% | -22.3% | -19.1% | -0.14% |  |
| 0.90-1.05 | 61 | 42.6% | -19.8% | -24.1% | -0.32% |  |
| 1.05-1.20 | 43 | 62.8% | 33.9% | 39.5% | 0.25% |  |
| 1.20-1.35 | 8 | 62.5% | 21.1% | -14.4% | -0.18% |  |
| 1.35-1.50 | 6 | 50.0% | 2.3% | -24.1% | 0.52% |  |

### NetEdge Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Notes |
|---|---|---|---|---|---|---|
| Bottom 20% (-0.62–0.73) | 31 | 48.4% | -3.4% | 5.1% | -0.45% |  |
| 20-40% (0.73–0.93) | 31 | 51.6% | -0.8% | 15.3% | -0.82% |  |
| 40-60% (0.93–1.24) | 32 | 62.5% | 32.7% | 3.0% | 0.10% |  |
| 60-80% (1.25–1.57) | 31 | 32.3% | -40.1% | -28.6% | 0.25% |  |
| 80-95% (1.58–2.13) | 31 | 32.3% | -43.3% | -33.4% | -0.11% |  |
| 95%+ (2.17–4.76) | 32 | 56.3% | 9.8% | 3.4% | 0.41% |  |

### TopShare / Concentration Buckets

| Bucket | N | WR | Flat ROI | Model ROI | Avg CLV | Interpretation |
|---|---|---|---|---|---|---|
| 0.00-0.25 | 14 | 35.7% | -20.2% | -26.7% | 0.45% | Broad support |
| 0.25-0.40 | 67 | 50.7% | 0.2% | -5.5% | 0.09% | Healthy support |
| 0.40-0.60 | 63 | 41.3% | -17.7% | -0.4% | 0.01% | Concentrated |
| 0.60-0.80 | 32 | 53.1% | -2.3% | -6.5% | -0.23% | Very concentrated |
| 0.80-1.00 | 12 | 58.3% | 8.4% | -4.8% | -2.11% | One-wallet driven |

---

## 6. Consensus vs Conflict

| Board Type | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars |
|---|---|---|---|---|---|---|
| Clean consensus | 30 | 36.7% | -30.3% | -22.1% | -0.18% | 4.0 |
| Broad battle | 114 | 47.4% | -4.6% | -1.0% | -0.07% | 3.9 |
| One-wallet nuke | 21 | 61.9% | 15.4% | 22.8% | -1.24% | 3.4 |
| Thin support | 77 | 51.9% | -1.8% | -0.9% | -0.35% | 3.5 |

---

## 7. Regime and Gate Audit

V8 stars are wallet-only, but the production system still depends on lock/shadow gating.

### Regime Performance

**V8 Era** (n=197)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 9 | 44.4% | -13.8% | 5.1% | 0.41% | 4.3 | 66.7% |
| SMALL_MOVE | 32 | 31.3% | -41.1% | -46.8% | 0.19% | 3.9 | 100.0% |
| CLEAR_MOVE | 61 | 59.0% | 6.5% | 14.2% | -0.35% | 4.0 | 100.0% |
| NEAR_START | 94 | 46.8% | -2.4% | -5.9% | -0.08% | 3.6 | 100.0% |

**All Time** (n=759)

| Regime | N | WR | Flat ROI | Model ROI | Avg CLV | Avg Stars | Lock Rate |
|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 2.7% |
| SMALL_MOVE | 35 | 31.4% | -40.6% | -47.6% | 0.36% | 4.0 | 91.4% |
| CLEAR_MOVE | 87 | 57.5% | 4.7% | 9.9% | -0.37% | 4.0 | 100.0% |
| NEAR_START | 110 | 47.3% | -3.8% | -7.0% | -0.02% | 3.6 | 100.0% |

### Stars × Regime

| Stars | NO_MOVE (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 6 / 50.0% / -2.1% | 10 / 30.0% / -53.8% | 25 / 64.0% / 12.6% | 23 / 52.2% / 9.5% |
| 3.5-4★ | 1 / 0.0% / -100.0% | 19 / 31.6% / -34.4% | 23 / 52.2% / -4.4% | 34 / 58.8% / 25.6% |
| 2.5-3★ | 2 / 50.0% / -5.8% | 2 / 50.0% / -11.5% | 13 / 61.5% / 13.9% | 36 / 33.3% / -33.8% |
| 1.0-2★ | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |

### Lock vs Shadow

**V8 Era**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 194 | 47.9% | -6.3% | -4.7% | 3.8 | -0.11% |
| SHADOW | 3 | 66.7% | 31.2% | 49.5% | 3.7 | 0.66% |

**All Time**

| Status | N | WR | Flat ROI | Model ROI | Avg Stars | Avg CLV |
|---|---|---|---|---|---|---|
| LOCKED | 244 | 48.8% | -6.2% | -4.7% | 3.8 | -0.11% |
| SHADOW | 515 | 53.8% | -5.0% | -5.0% | 3.2 | -0.50% |

### V8 Era Gate Volume

| Category | Count | % |
|---|---|---|
| Total Written | 341 | 100% |
| LOCKED (direct) | 65 | 19.1% |
| Promoted (SHADOW→LOCKED) | 140 | 41.1% |
| Rejected (stayed SHADOW) | 104 | 30.5% |
| Superseded (side flipped) | 27 | 7.9% |
| Muted | 164 | 48.1% |
| Cancelled | 15 | 4.4% |

---

## 8. Sizing Audit

Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.

### V8 Era (n=197)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -10.52u | -3.9% | — |
| Flat 1.0u | -11.30u | -5.7% | +0.78u |
| Lock units only | -8.36u | — | -2.16u |
| Units change only on star change | -4.40u | — | -6.12u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 54 | 2.38 | -6.0% | -0.7% | +2.39u | Sizing helps |
| 4.5 | 10 | 2.20 | 30.7% | 25.6% | +2.57u | Sizing helps |
| 4 | 27 | 1.23 | 0.5% | -8.1% | -2.81u | Sizing hurts |
| 3.5 | 51 | 0.72 | 2.8% | 5.7% | +0.64u | Sizing helps |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 30 | 0.73 | -23.0% | -36.3% | -1.02u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

### All Time (n=759)

**Counterfactual Scenarios**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -55.40u | -4.9% | — |
| Flat 1.0u | -40.82u | -5.4% | -14.58u |
| Lock units only | -42.48u | — | -12.92u |
| Units change only on star change | -48.44u | — | -6.96u |

**Sizing by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 67 | 2.43 | -6.5% | -3.4% | -1.21u | Sizing hurts |
| 4.5 | 44 | 2.52 | -2.6% | -7.7% | -7.44u | Sizing hurts |
| 4 | 142 | 1.95 | -2.5% | -4.2% | -8.05u | Sizing hurts |
| 3.5 | 169 | 1.45 | 1.2% | 3.2% | +5.95u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 137 | 0.73 | -5.6% | -5.9% | +1.69u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |


---

## 9. Calibration Against Market Baseline

Use market expectation as a discipline check.

| Bucket | N | Avg Implied% | Actual WR | WR Delta | Flat ROI | Avg CLV | Verdict |
|---|---|---|---|---|---|---|---|
| All V8 plays | 197 | 52.6% | 48.2% | -4.4% | -5.7% | -0.10% | Below market |
| 4.5-5★ | 64 | 52.7% | 53.1% | +0.4% | -0.2% | -0.04% | Neutral |
| 3.5-4★ | 78 | 51.4% | 50.0% | -1.4% | 2.0% | -0.09% | Neutral |
| 2.5-3★ | 53 | 54.2% | 41.5% | -12.7% | -20.2% | -0.19% | Below market |
| CLEAR_MOVE only | 61 | 54.3% | 59.0% | +4.7% | 6.5% | -0.35% | Beating market |
| NO_MOVE only | 9 | 52.7% | 44.4% | -8.3% | -13.8% | 0.41% | Below market |

---

## 10. Drift Monitoring

V8 should be rechecked anytime the live board stops looking like the calibration universe.

### 7-Day (n=36)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.272 | 62.875 | 0.45 |  |
| Rank_norm | 64.827 | 63.525 | 0.09 |  |
| PnL_norm | 56.941 | 55.056 | 0.13 |  |
| WalletBase | 58.624 | 60.842 | 0.27 |  |
| SizeRatio | 1.623 | 1.367 | 0.17 |  |
| ConvictionMult | 0.975 | 0.975 | 0.00 |  |
| WalletCountFor | 3.436 | 3.028 | 0.23 |  |
| TopShare | 0.472 | 0.568 | 0.49 |  |
| ForSide | 198.317 | 179.139 | 0.18 |  |
| AgainstSide | 64.976 | 55.247 | 0.11 |  |
| NetEdge | 1.431 | 1.322 | 0.12 |  |
| WalletPlayScore | 2.144 | 1.453 | 0.33 |  |

### V8 Era (n=188)

| Feature | Frozen Mean | Live Mean | Drift (σ) | Alert |
|---|---|---|---|---|
| ROI_norm | 58.272 | 58.216 | 0.01 |  |
| Rank_norm | 64.827 | 64.755 | 0.00 |  |
| PnL_norm | 56.941 | 57.010 | 0.00 |  |
| WalletBase | 58.624 | 58.577 | 0.01 |  |
| SizeRatio | 1.623 | 1.593 | 0.02 |  |
| ConvictionMult | 0.975 | 0.973 | 0.01 |  |
| WalletCountFor | 3.436 | 3.436 | 0.00 |  |
| TopShare | 0.472 | 0.472 | 0.00 |  |
| ForSide | 198.317 | 198.317 | 0.00 |  |
| AgainstSide | 64.976 | 64.976 | 0.00 |  |
| NetEdge | 1.431 | 1.431 | 0.00 |  |
| WalletPlayScore | 2.144 | 2.144 | 0.00 |  |


---

## 11. Failure Diagnostics

### V8 Era (n=197)

- **Gate issue**: NO_MOVE ROI (-13.8%) significantly trails CLEAR_MOVE (6.5%)

### 7-Day (n=37)

- **Ranking issue**: ≤3★ WR (56%) beats ≥4★ (42%)
- **Sizing issue**: Model P/L (-4.88u) trails flat (-2.88u) by 2.00u
- **Odds issue**: Avg CLV -0.98% — consistently getting bad closing lines

### All Time (n=759)

- **Sizing issue**: Model P/L (-55.40u) trails flat (-40.82u) by 14.58u
- **Environment issue**: 69.3% NO_MOVE (WR: 53.6%, ROI: -5.3%)


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
| V8 era picks | 197 |
| V8 flat ROI | -5.7% |
| V8 model ROI | -3.9% |
| V8 star monotonicity score | -0.33 |
| 4.5-5★ ROI | -0.2% |
| 2.5-3★ ROI | -20.2% |
| CLEAR_MOVE ROI | 6.5% |
| NO_MOVE ROI | -13.8% |
| Single-wallet play rate | 10.7% |
| Whale override win rate | 100.0% |
| Avg CLV by star bucket | 5★: 0.07% | 4.5★: -0.61% | 4★: 0.15% | 3.5★: -0.22% | 3★: -0.02% | 2.5★: -0.28% | 2★: 0.67% |
| Drift alert count | 0 |

---

## Pick Health (Mute/Cancel) Audit

### V8 Era (n=197)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 141 | 71.6% | 46.8% | -6.3% | -8.0% | 0.01% |
| MUTED | 48 | 24.4% | 50.0% | -6.5% | 10.8% | -0.41% |
| CANCELLED | 8 | 4.1% | 62.5% | 8.4% | -7.4% | -0.17% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| v73_hc_rescue | 13 | 38.5% |
| winners_faded | 11 | 63.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| opp_side_stronger_diag | 6 | 33.3% |
| winners_killed | 6 | 66.7% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| ags_quality_veto | 3 | 66.7% |
| whitelist_fade_strong | 2 | 50.0% |

### 7-Day (n=37)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 27 | 73.0% | 51.9% | -0.0% | -7.5% | -0.93% |
| MUTED | 9 | 24.3% | 44.4% | -20.8% | 15.6% | -0.34% |
| CANCELLED | 1 | 2.7% | 0.0% | -100.0% | -100.0% | -7.24% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| v73_hc_rescue | 11 | 45.5% |
| wps_flipped_diag | 3 | 0.0% |
| opp_side_stronger_diag | 3 | 0.0% |
| ags_quality_veto | 3 | 66.7% |
| winners_below_floor | 2 | 50.0% |
| winners_faded | 2 | 50.0% |
| quality_below_floor | 1 | 0.0% |
| winners_killed | 1 | 0.0% |
| sum_below_floor | 1 | 0.0% |

### All Time (n=759)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 701 | 92.4% | 52.1% | -5.8% | -5.9% | -0.33% |
| MUTED | 48 | 6.3% | 50.0% | -6.5% | 10.8% | -0.41% |
| CANCELLED | 10 | 1.3% | 70.0% | 32.9% | 10.4% | -1.54% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 13 | 30.8% |
| v73_hc_rescue | 13 | 38.5% |
| winners_faded | 11 | 63.6% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| opp_side_stronger_diag | 6 | 33.3% |
| winners_killed | 6 | 66.7% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| ags_quality_veto | 3 | 66.7% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |
