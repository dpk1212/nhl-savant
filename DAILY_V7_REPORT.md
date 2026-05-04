# V7 Diagnostic Report — Blame Assignment System
**Generated**: 2026-05-04 ET | **Completed Picks**: 741 | **V7 Since**: 2026-04-06 | **Regime Since**: 2026-04-16

---

## 0. Intervention Triggers

- **Signal disagreement picks at 33% WR (below 40%)**
- **MUTED WR (52%) exceeds ACTIVE (46%) — mute thresholds too aggressive**

---

## Executive Summary

### By Era

| Era | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Sizing Edge | Avg CLV |
|---|---|---|---|---|---|---|---|---|
| Post-Regime | 200 | 47.5% | -14.11u | -7.1% | -19.73u | -7.3% | -5.62u | 0.10% |
| Pre-Regime | 280 | 50.0% | -28.60u | -10.2% | -50.56u | -12.9% | -21.96u | -0.37% |
| V7 Era | 480 | 49.0% | -42.71u | -8.9% | -70.29u | -10.6% | -27.58u | -0.17% |
| All Time | 741 | 52.2% | -39.71u | -5.4% | -57.73u | -5.2% | -18.02u | -0.31% |

### By Trend Window

| Era | Picks | WR | Flat P/L | Flat ROI | Model P/L | Model ROI | Sizing Edge | Avg CLV |
|---|---|---|---|---|---|---|---|---|
| 3-Day | 19 | 47.4% | -1.77u | -9.3% | -7.21u | -44.7% | -5.44u | -0.23% |
| 7-Day | 64 | 50.0% | -2.31u | -3.6% | -0.25u | -0.3% | 2.06u | -0.23% |
| V7 Era | 480 | 49.0% | -42.71u | -8.9% | -70.29u | -10.6% | -27.58u | -0.17% |
| All Time | 741 | 52.2% | -39.71u | -5.4% | -57.73u | -5.2% | -18.02u | -0.31% |

---

## 1. What Is Winning — Truth Finder Leaderboard

Factors ranked by signal persistence across time windows. Higher signal score = more reliable.

| Rank | Factor | Signal Score | Persistence | 7-Day WR Mono | Post-Regime WR Mono | V7 Era WR Mono | All Time WR Mono | 7-Day Spread | Post-Regime Spread | V7 Era Spread | All Time Spread |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Avg Bet Size | 3.19 | 4/4 | 2 | 0 | 0 | 0 | 36.5% | 7.5% | 3.1% | -0.4% |
| 2 | Total Invested | 2.79 | 4/4 | 2 | 1 | 0 | 2 | 21.2% | -2.5% | 9.4% | 8.4% |
| 3 | Sharp Count | 1.77 | 4/4 | 0 | 0 | 2 | 2 | -28.2% | -7.5% | 7.3% | 7.7% |
| 4 | Sharp Edge | 1.07 | 4/4 | 0 | 0 | 0 | 0 | -26.9% | -15.0% | 5.2% | 5.7% |
| 5 | Counter Sharp | 0.66 | 4/4 | 0 | 0 | 0 | 0 | -11.5% | 10.0% | -2.0% | 3.0% |
| 6 | Market Dominance | 0.57 | 4/4 | 0 | -3 | 0 | 2 | -28.2% | -17.5% | -4.1% | -3.0% |
| 7 | Market Dom (z) | 0.57 | 4/4 | 0 | -3 | 0 | 2 | -28.2% | -17.5% | -4.1% | -3.0% |
| 8 | Against Sharp Count | -0.13 | 4/4 | -1 | 1 | 0 | -2 | -3.8% | 0.0% | 2.1% | -9.1% |
| 9 | Money % | -0.29 | 4/4 | 1 | -3 | 0 | 0 | 12.1% | -12.5% | 1.7% | -2.0% |
| 10 | Money Edge | -0.33 | 4/4 | 1 | -3 | 0 | 0 | 12.1% | -12.5% | -1.0% | -1.0% |
| 11 | Money Edge (z) | -0.33 | 4/4 | 1 | -3 | 0 | 0 | 12.1% | -12.5% | -1.0% | -1.0% |
| 12 | EV Edge | -0.73 | 4/4 | 0 | 0 | -2 | 0 | 3.8% | -2.5% | -16.6% | -7.8% |

**Strongest surviving signal**: Avg Bet Size (score: 3.19)

---

## 2. What Is Misranked — Star Calibration

### Post-Regime (n=200)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Sizing Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 5 | 51 | 53.6% | 53.6% | 52.9% | -0.6% | -4.3% | -1.7% | 2.28 | Fair |
| 4.5 | 16 | 50.0% | 50.0% | 50.0% | +0.0% | 8.2% | 1.6% | 2.16 | Underbet |
| 4 | 28 | 52.1% | 52.1% | 50.0% | -2.1% | -3.4% | -11.2% | 1.31 | Fair |
| 3.5 | 47 | 50.0% | 50.0% | 46.8% | -3.2% | -1.0% | -0.3% | 0.70 | Fair |
| 3 | 21 | 55.6% | 55.6% | 38.1% | -17.6% | -26.4% | -28.3% | 1.05 | Massively overbet |
| 2.5 | 33 | 52.7% | 52.7% | 42.4% | -10.3% | -18.1% | -29.8% | 0.74 | Massively overbet |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | Massively overbet |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.9% | 50.0% | +2.9% | Correct |
| 4.5★ vs 4★ | 50.0% | 50.0% | 0.0% | Flat |
| 4★ vs 3.5★ | 50.0% | 46.8% | +3.2% | Correct |
| 3.5★ vs 3★ | 46.8% | 38.1% | +8.7% | Correct |
| 3★ vs 2.5★ | 38.1% | 42.4% | -4.3% | INVERTED |
| 2.5★ vs 2★ | 42.4% | 0.0% | +42.4% | Correct |

**Spearman rank correlation**: Stars vs Flat ROI: 0.714 | Stars vs WR: 0.929

### Pre-Regime (n=280)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Sizing Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 5 | 6 | 62.6% | 62.6% | 50.0% | -12.6% | -17.8% | -30.1% | 2.83 | Massively overbet |
| 4.5 | 17 | 58.3% | 58.3% | 47.1% | -11.2% | -21.4% | -26.2% | 2.57 | Massively overbet |
| 4 | 59 | 55.3% | 55.3% | 52.5% | -2.7% | -4.9% | -8.4% | 1.92 | Fair |
| 3.5 | 53 | 56.8% | 56.8% | 50.9% | -5.8% | -13.5% | -13.4% | 1.69 | Overbet |
| 3 | 79 | 53.7% | 53.7% | 44.3% | -9.4% | -20.1% | -18.9% | 1.05 | Massively overbet |
| 2.5 | 66 | 52.9% | 52.9% | 54.5% | +1.7% | 3.1% | 6.7% | 0.70 | Fair |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 50.0% | 47.1% | +2.9% | Correct |
| 4.5★ vs 4★ | 47.1% | 52.5% | -5.4% | INVERTED |
| 4★ vs 3.5★ | 52.5% | 50.9% | +1.6% | Correct |
| 3.5★ vs 3★ | 50.9% | 44.3% | +6.6% | Correct |
| 3★ vs 2.5★ | 44.3% | 54.5% | -10.2% | INVERTED |

**Spearman rank correlation**: Stars vs Flat ROI: -0.486 | Stars vs WR: -0.314
**RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI

### V7 Era (n=480)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Sizing Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 5 | 57 | 54.5% | 54.5% | 52.6% | -1.9% | -5.7% | -5.3% | 2.34 | Overbet |
| 4.5 | 33 | 54.3% | 54.3% | 48.5% | -5.8% | -7.0% | -13.9% | 2.37 | Overbet |
| 4 | 87 | 54.3% | 54.3% | 51.7% | -2.5% | -4.4% | -9.0% | 1.72 | Fair |
| 3.5 | 100 | 53.6% | 53.6% | 49.0% | -4.6% | -7.7% | -9.9% | 1.23 | Overbet |
| 3 | 100 | 54.1% | 54.1% | 43.0% | -11.1% | -21.4% | -20.8% | 1.05 | Massively overbet |
| 2.5 | 99 | 52.8% | 52.8% | 50.5% | -2.3% | -4.0% | -5.8% | 0.72 | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | Massively overbet |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 52.6% | 48.5% | +4.1% | Correct |
| 4.5★ vs 4★ | 48.5% | 51.7% | -3.2% | INVERTED |
| 4★ vs 3.5★ | 51.7% | 49.0% | +2.7% | Correct |
| 3.5★ vs 3★ | 49.0% | 43.0% | +6.0% | Correct |
| 3★ vs 2.5★ | 43.0% | 50.5% | -7.5% | INVERTED |
| 2.5★ vs 2★ | 50.5% | 0.0% | +50.5% | Correct |

**Spearman rank correlation**: Stars vs Flat ROI: 0.357 | Stars vs WR: 0.643

### All Time (n=741)

| Stars | N | Avg Implied% | Expected WR | Actual WR | WR Delta | Flat ROI | Model ROI | Avg Units | Sizing Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 5 | 58 | 54.6% | 54.6% | 53.4% | -1.1% | -4.3% | -3.2% | 2.36 | Fair |
| 4.5 | 43 | 56.0% | 56.0% | 51.2% | -4.8% | -4.8% | -11.0% | 2.49 | Fair |
| 4 | 140 | 55.4% | 55.4% | 53.6% | -1.8% | -2.5% | -4.1% | 1.97 | Fair |
| 3.5 | 164 | 55.0% | 55.0% | 56.1% | +1.1% | 0.6% | 2.8% | 1.46 | Fair |
| 3 | 181 | 55.2% | 55.2% | 47.5% | -7.7% | -14.5% | -12.6% | 1.19 | Overbet |
| 2.5 | 136 | 54.2% | 54.2% | 52.2% | -2.0% | -4.9% | -5.5% | 0.73 | Fair |
| 2 | 1 | 53.5% | 53.5% | 0.0% | -53.5% | -100.0% | -100.0% | 1.10 | Massively overbet |

**Pairwise Rank Test**

| Comparison | Higher WR | Lower WR | Delta | Status |
|---|---|---|---|---|
| 5★ vs 4.5★ | 53.4% | 51.2% | +2.2% | Correct |
| 4.5★ vs 4★ | 51.2% | 53.6% | -2.4% | Flat |
| 4★ vs 3.5★ | 53.6% | 56.1% | -2.5% | Flat |
| 3.5★ vs 3★ | 56.1% | 47.5% | +8.6% | Correct |
| 3★ vs 2.5★ | 47.5% | 52.2% | -4.7% | INVERTED |
| 2.5★ vs 2★ | 52.2% | 0.0% | +52.2% | Correct |

**Spearman rank correlation**: Stars vs Flat ROI: 0.643 | Stars vs WR: 0.500


---

## 3. What Is Oversized — Sizing Attribution

### Post-Regime (n=200)

**Counterfactual P/L**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -19.73u | -7.3% | — |
| Flat 1.0u per pick | -14.11u | -7.1% | -5.62u |
| Lock units only (no bumps) | -13.02u | — | -6.71u |
| Units change only when stars change | -11.83u | — | -7.90u |

**Incremental Sizing Value by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 51 | 2.28 | -4.3% | -1.7% | +0.15u | Neutral |
| 4.5 | 16 | 2.16 | 8.2% | 1.6% | -0.77u | Sizing hurts |
| 4 | 28 | 1.31 | -3.4% | -11.2% | -3.15u | Sizing hurts |
| 3.5 | 47 | 0.70 | -1.0% | -0.3% | +0.39u | Neutral |
| 3 | 21 | 1.05 | -26.4% | -28.3% | -0.67u | Sizing hurts |
| 2.5 | 33 | 0.74 | -18.1% | -29.8% | -1.25u | Sizing hurts |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

**Sizing Edge by Regime**

| Regime | N | WR | Flat ROI | Model ROI | Sizing Edge |
|---|---|---|---|---|---|
| NO_MOVE | 17 | 47.1% | -13.2% | -2.6% | +1.38u |
| SMALL_MOVE | 29 | 34.5% | -35.0% | -41.9% | -5.61u |
| CLEAR_MOVE | 59 | 54.2% | 0.3% | 5.0% | +4.13u |
| NEAR_START | 95 | 47.4% | -2.0% | -6.6% | -5.52u |

**4 picks had unit increases without star improvement**: P/L -8.45u, WR 0.0%

### Pre-Regime (n=280)

**Counterfactual P/L**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -50.56u | -12.9% | — |
| Flat 1.0u per pick | -28.60u | -10.2% | -21.96u |
| Lock units only (no bumps) | -29.67u | — | -20.89u |
| Units change only when stars change | -48.38u | — | -2.18u |

**Incremental Sizing Value by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 6 | 2.83 | -17.8% | -30.1% | -4.04u | Sizing hurts |
| 4.5 | 17 | 2.57 | -21.4% | -26.2% | -7.82u | Sizing hurts |
| 4 | 59 | 1.92 | -4.9% | -8.4% | -6.56u | Sizing hurts |
| 3.5 | 53 | 1.69 | -13.5% | -13.4% | -4.83u | Sizing hurts |
| 3 | 79 | 1.05 | -20.1% | -18.9% | +0.20u | Neutral |
| 2.5 | 66 | 0.70 | 3.1% | 6.7% | +1.09u | Sizing helps |

**Sizing Edge by Regime**

| Regime | N | WR | Flat ROI | Model ROI | Sizing Edge |
|---|---|---|---|---|---|
| NO_MOVE | 248 | 49.2% | -11.6% | -14.7% | -20.02u |
| SMALL_MOVE | 3 | 33.3% | -34.9% | -51.2% | -3.56u |
| CLEAR_MOVE | 21 | 57.1% | 1.5% | 4.0% | +1.31u |
| NEAR_START | 8 | 62.5% | 10.1% | 9.0% | +0.31u |

**5 picks had unit increases without star improvement**: P/L -3.93u, WR 40.0%

### V7 Era (n=480)

**Counterfactual P/L**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -70.29u | -10.6% | — |
| Flat 1.0u per pick | -42.71u | -8.9% | -27.58u |
| Lock units only (no bumps) | -42.69u | — | -27.60u |
| Units change only when stars change | -60.21u | — | -10.08u |

**Incremental Sizing Value by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 57 | 2.34 | -5.7% | -5.3% | -3.89u | Sizing hurts |
| 4.5 | 33 | 2.37 | -7.0% | -13.9% | -8.58u | Sizing hurts |
| 4 | 87 | 1.72 | -4.4% | -9.0% | -9.72u | Sizing hurts |
| 3.5 | 100 | 1.23 | -7.7% | -9.9% | -4.44u | Sizing hurts |
| 3 | 100 | 1.05 | -21.4% | -20.8% | -0.47u | Neutral |
| 2.5 | 99 | 0.72 | -4.0% | -5.8% | -0.16u | Neutral |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

**Sizing Edge by Regime**

| Regime | N | WR | Flat ROI | Model ROI | Sizing Edge |
|---|---|---|---|---|---|
| NO_MOVE | 265 | 49.1% | -11.7% | -13.6% | -18.64u |
| SMALL_MOVE | 32 | 34.4% | -35.0% | -43.7% | -9.18u |
| CLEAR_MOVE | 80 | 55.0% | 0.6% | 4.7% | +5.45u |
| NEAR_START | 103 | 48.5% | -1.0% | -5.0% | -5.21u |

**9 picks had unit increases without star improvement**: P/L -12.38u, WR 22.2%

### All Time (n=741)

**Counterfactual P/L**

| Scenario | P/L | ROI | vs Actual |
|---|---|---|---|
| Actual (model units) | -57.73u | -5.2% | — |
| Flat 1.0u per pick | -39.71u | -5.4% | -18.02u |
| Lock units only (no bumps) | -38.81u | — | -18.92u |
| Units change only when stars change | -49.99u | — | -7.74u |

**Incremental Sizing Value by Star Bucket**

| Stars | N | Avg Units | Flat ROI | Model ROI | Sizing Edge | Verdict |
|---|---|---|---|---|---|---|
| 5 | 58 | 2.36 | -4.3% | -3.2% | -1.94u | Sizing hurts |
| 4.5 | 43 | 2.49 | -4.8% | -11.0% | -9.75u | Sizing hurts |
| 4 | 140 | 1.97 | -2.5% | -4.1% | -7.70u | Sizing hurts |
| 3.5 | 164 | 1.46 | 0.6% | 2.8% | +5.70u | Sizing helps |
| 3 | 181 | 1.19 | -14.5% | -12.6% | -0.82u | Sizing hurts |
| 2.5 | 136 | 0.73 | -4.9% | -5.5% | +1.19u | Sizing helps |
| 2 | 1 | 1.10 | -100.0% | -100.0% | -0.10u | Neutral |

**Sizing Edge by Regime**

| Regime | N | WR | Flat ROI | Model ROI | Sizing Edge |
|---|---|---|---|---|---|
| NO_MOVE | 526 | 53.6% | -5.3% | -4.6% | -9.09u |
| SMALL_MOVE | 32 | 34.4% | -35.0% | -43.7% | -9.18u |
| CLEAR_MOVE | 80 | 55.0% | 0.6% | 4.7% | +5.45u |
| NEAR_START | 103 | 48.5% | -1.0% | -5.0% | -5.21u |

**27 picks had unit increases without star improvement**: P/L -11.26u, WR 40.7%


---

## 4. What The Environment Is Doing

### Regime Performance

**Post-Regime** (n=200)

| Regime | N | % | WR | Flat ROI | Model ROI | Avg CLV | Avg★ | Avg Units |
|---|---|---|---|---|---|---|---|---|
| NO_MOVE | 17 | 8.5% | 47.1% | -13.2% | -2.6% | 0.27% | 4.5 | 1.97 |
| SMALL_MOVE | 29 | 14.5% | 34.5% | -35.0% | -41.9% | 0.19% | 3.9 | 1.30 |
| CLEAR_MOVE | 59 | 29.5% | 54.2% | 0.3% | 5.0% | -0.10% | 3.9 | 1.47 |
| NEAR_START | 95 | 47.5% | 47.4% | -2.0% | -6.6% | 0.16% | 3.5 | 1.18 |

**Pre-Regime** (n=280)

| Regime | N | % | WR | Flat ROI | Model ROI | Avg CLV | Avg★ | Avg Units |
|---|---|---|---|---|---|---|---|---|
| NO_MOVE | 248 | 88.6% | 49.2% | -11.6% | -14.7% | -0.39% | 3.3 | 1.33 |
| SMALL_MOVE | 3 | 1.1% | 33.3% | -34.9% | -51.2% | 2.16% | 4.5 | 3.00 |
| CLEAR_MOVE | 21 | 7.5% | 57.1% | 1.5% | 4.0% | -0.34% | 3.9 | 1.94 |
| NEAR_START | 8 | 2.9% | 62.5% | 10.1% | 9.0% | -1.02% | 3.3 | 1.56 |

**V7 Era** (n=480)

| Regime | N | % | WR | Flat ROI | Model ROI | Avg CLV | Avg★ | Avg Units |
|---|---|---|---|---|---|---|---|---|
| NO_MOVE | 265 | 55.2% | 49.1% | -11.7% | -13.6% | -0.35% | 3.3 | 1.38 |
| SMALL_MOVE | 32 | 6.7% | 34.4% | -35.0% | -43.7% | 0.38% | 4.0 | 1.46 |
| CLEAR_MOVE | 80 | 16.7% | 55.0% | 0.6% | 4.7% | -0.17% | 3.9 | 1.59 |
| NEAR_START | 103 | 21.5% | 48.5% | -1.0% | -5.0% | 0.10% | 3.5 | 1.21 |

**All Time** (n=741)

| Regime | N | % | WR | Flat ROI | Model ROI | Avg CLV | Avg★ | Avg Units |
|---|---|---|---|---|---|---|---|---|
| NO_MOVE | 526 | 71.0% | 53.6% | -5.3% | -4.6% | -0.49% | 3.2 | 1.53 |
| SMALL_MOVE | 32 | 4.3% | 34.4% | -35.0% | -43.7% | 0.38% | 4.0 | 1.46 |
| CLEAR_MOVE | 80 | 10.8% | 55.0% | 0.6% | 4.7% | -0.17% | 3.9 | 1.59 |
| NEAR_START | 103 | 13.9% | 48.5% | -1.0% | -5.0% | 0.10% | 3.5 | 1.21 |

### Board Composition

**3-Day** (19 picks)

| Sport | N | % | WR | Flat ROI |
|---|---|---|---|---|
| MLB | 6 | 31.6% | 33.3% | -38.7% |
| NBA | 12 | 63.2% | 50.0% | -2.7% |
| NHL | 1 | 5.3% | 100.0% | 87.7% |

| Odds Band | N | % | WR | Flat ROI |
|---|---|---|---|---|
| SLIGHT_FAV | 2 | 10.5% | 50.0% | -11.5% |
| COIN_FLIP | 13 | 68.4% | 61.5% | 18.9% |
| SLIGHT_DOG | 2 | 10.5% | 0.0% | -100.0% |
| LONG_DOG | 2 | 10.5% | 0.0% | -100.0% |

**7-Day** (64 picks)

| Sport | N | % | WR | Flat ROI |
|---|---|---|---|---|
| MLB | 21 | 32.8% | 38.1% | -26.0% |
| NBA | 36 | 56.3% | 52.8% | -0.5% |
| NHL | 7 | 10.9% | 71.4% | 47.7% |

| Odds Band | N | % | WR | Flat ROI |
|---|---|---|---|---|
| HEAVY_FAV | 5 | 7.8% | 80.0% | -3.0% |
| SLIGHT_FAV | 7 | 10.9% | 42.9% | -23.8% |
| COIN_FLIP | 39 | 60.9% | 51.3% | -0.5% |
| SLIGHT_DOG | 8 | 12.5% | 50.0% | 21.4% |
| LONG_DOG | 5 | 7.8% | 20.0% | -40.4% |


---

## 5. Interaction Tables

### Star × Regime

| starBucket | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | NO_MOVE (N/WR/ROI) |
|---|---|---|---|---|
| 4.5-5★ | 32 / 62.5% / 7.8% | 22 / 59.1% / 21.5% | 11 / 36.4% / -40.3% | 25 / 36.0% / -33.6% |
| 3.5-4★ | 28 / 42.9% / -19.7% | 39 / 56.4% / 17.8% | 18 / 33.3% / -30.8% | 102 / 52.9% / -7.3% |
| 2.5-3★ | 20 / 60.0% / 17.5% | 41 / 36.6% / -28.7% | 2 / 50.0% / -11.5% | 138 / 48.6% / -11.0% |

_Tells you whether stars only work in CLEAR_MOVE / certain environments._

### Star × Unit Tier

| starBucket | MAX (N/WR/ROI) | STRONG (N/WR/ROI) | STANDARD (N/WR/ROI) |
|---|---|---|---|
| 4.5-5★ | 42 / 54.8% / -17.2% | 44 / 50.0% / 3.8% | 4 / 25.0% / -1.2% |
| 3.5-4★ | 20 / 50.0% / -15.4% | 77 / 53.2% / -5.5% | 90 / 47.8% / -4.7% |
| 2.5-3★ | — | 25 / 48.0% / -21.2% | 176 / 47.2% / -10.4% |

_Tells you whether high-star plays are being oversized._

### Star × Odds Band

| starBucket | HEAVY_FAV (N/WR/ROI) | SLIGHT_FAV (N/WR/ROI) | COIN_FLIP (N/WR/ROI) | SLIGHT_DOG (N/WR/ROI) | LONG_DOG (N/WR/ROI) |
|---|---|---|---|---|---|
| 4.5-5★ | 10 / 90.0% / 16.1% | 22 / 54.5% / -12.1% | 43 / 41.9% / -18.1% | 11 / 54.5% / 30.2% | 4 / 25.0% / -1.2% |
| 3.5-4★ | 17 / 82.4% / 8.3% | 42 / 50.0% / -18.9% | 103 / 49.5% / -2.9% | 17 / 35.3% / -16.2% | 8 / 25.0% / 9.1% |
| 2.5-3★ | 11 / 72.7% / -3.0% | 67 / 55.2% / -9.1% | 90 / 43.3% / -15.0% | 25 / 36.0% / -12.9% | 8 / 25.0% / -5.6% |

_Tells you whether certain star levels are broken only on coin flips or dogs._

### Sport × Regime

| sport | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | NO_MOVE (N/WR/ROI) |
|---|---|---|---|---|
| MLB | 17 / 52.9% / 0.4% | 44 / 38.6% / -23.0% | 11 / 27.3% / -49.6% | 123 / 43.1% / -21.0% |
| NBA | 46 / 50.0% / -13.8% | 45 / 53.3% / 12.2% | 12 / 50.0% / -6.2% | 72 / 51.4% / -7.8% |
| NHL | 17 / 70.6% / 39.8% | 14 / 64.3% / 25.4% | 9 / 22.2% / -55.5% | 70 / 57.1% / 0.7% |

_Tells you where NO_MOVE or CLEAR_MOVE matters most._

### Upgrade × Regime

| upgradeStatus | CLEAR_MOVE (N/WR/ROI) | NEAR_START (N/WR/ROI) | SMALL_MOVE (N/WR/ROI) | NO_MOVE (N/WR/ROI) |
|---|---|---|---|---|
| Upgraded | 39 / 59.0% / 2.2% | 43 / 58.1% / 18.2% | 18 / 33.3% / -37.5% | 99 / 49.5% / -15.2% |
| Unchanged | 41 / 51.2% / -0.9% | 53 / 43.4% / -10.8% | 13 / 30.8% / -49.6% | 164 / 48.8% / -9.6% |
| Downgraded | — | 7 / 28.6% / -45.3% | 1 / 100.0% / 198.0% | 2 / 50.0% / -10.0% |

_Tells you whether upgrades help only in supportive regimes._


---

## 6. Failure Diagnostics — Why Are We Losing Money?

### 7-Day (n=64)

**Root cause analysis**:

- **Overexposed at MAX**: 8 MAX-tier picks losing 2.2u (WR: 63%)
- **Favs Not Covering**: 12 fav picks at 58% WR but -15.2% flat ROI — winning but not enough to cover juice

### Post-Regime (n=200)

**Root cause analysis**:

- **Bad Sizing**: Model P/L (-19.73u) trails flat P/L (-14.11u) by 5.62u — sizing is amplifying losses
- **Overexposed at MAX**: 26 MAX-tier picks losing 5.1u (WR: 62%)
- **Favs Not Covering**: 45 fav picks at 58% WR but -12.9% flat ROI — winning but not enough to cover juice

### V7 Era (n=480)

**Root cause analysis**:

- **Bad Sizing**: Model P/L (-70.29u) trails flat P/L (-42.71u) by 27.58u — sizing is amplifying losses
- **Bad Board Mix**: 55.2% of picks are NO_MOVE (WR: 49.1%, ROI: -11.7%)
- **Overexposed at MAX**: 62 MAX-tier picks losing 34.3u (WR: 53%)
- **Bad Upgrades**: 199 upgraded picks lost 26.1u total — upgrades are adding size to wrong picks
- **Favs Not Covering**: 169 fav picks at 60% WR but -8.3% flat ROI — winning but not enough to cover juice


---

## 7. Two-Step Regime System Audit

_Regime system live since 2026-04-16_

### Volume Summary

| Category | Count | % |
|---|---|---|
| Total Written | 339 | 100% |
| LOCKED (direct) | 72 | 21.2% |
| Promoted (SHADOW→LOCKED) | 133 | 39.2% |
| Rejected (stayed SHADOW) | 101 | 29.8% |
| Superseded (side flipped) | 28 | 8.3% |
| Muted | 142 | 41.9% |
| Cancelled | 13 | 3.8% |

### Promotion Rate by Regime

| Regime | Written | Promoted | Promotion Rate |
|---|---|---|---|
| NO_MOVE | 33 | 10 | 30.3% |
| SMALL_MOVE | 60 | 26 | 43.3% |
| CLEAR_MOVE | 74 | 43 | 58.1% |
| NEAR_START | 143 | 54 | 37.8% |

### Promoted vs Rejected — Graded Results

| Group | N | WR | Flat ROI | Model ROI | Avg CLV | Avg★ |
|---|---|---|---|---|---|---|
| LOCKED | 197 | 47.2% | -7.6% | -8.2% | 0.09% | 3.8 |
| SHADOW (rejected) | 3 | 66.7% | 31.2% | 49.5% | 0.66% | 3.7 |

**Regime filter NOT separating**: LOCKED WR (47%) ≤ SHADOW WR (67%)

---

## 8. Pick Health (Mute/Cancel) Audit

### 7-Day (n=64)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 41 | 64.1% | 46.3% | -10.5% | -15.8% | 0.10% |
| MUTED | 21 | 32.8% | 52.4% | 4.1% | 35.5% | -0.81% |
| CANCELLED | 2 | 3.1% | 100.0% | 57.6% | 42.3% | -1.01% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 10 | 50.0% |
| v73_hc_rescue | 9 | 44.4% |
| wps_flipped_diag | 6 | 33.3% |
| winners_faded | 5 | 80.0% |
| sum_below_floor | 3 | 33.3% |
| quality_below_floor | 3 | 33.3% |
| opp_side_stronger_diag | 3 | 33.3% |
| winners_killed | 2 | 100.0% |

### Post-Regime (n=200)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 149 | 74.5% | 45.6% | -9.0% | -12.6% | 0.23% |
| MUTED | 44 | 22.0% | 50.0% | -5.3% | 9.5% | -0.45% |
| CANCELLED | 7 | 3.5% | 71.4% | 23.9% | 24.8% | 0.84% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 12 | 33.3% |
| winners_faded | 10 | 70.0% |
| v73_hc_rescue | 9 | 44.4% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| winners_killed | 5 | 80.0% |
| opp_side_stronger_diag | 4 | 50.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| whitelist_fade_strong | 2 | 50.0% |

### V7 Era (n=480)

| Health | N | % | WR | Flat ROI | Model ROI | Avg CLV |
|---|---|---|---|---|---|---|
| ACTIVE | 427 | 89.0% | 48.2% | -10.5% | -13.3% | -0.13% |
| MUTED | 44 | 9.2% | 50.0% | -5.3% | 9.5% | -0.45% |
| CANCELLED | 9 | 1.9% | 77.8% | 47.7% | 42.3% | -0.91% |

**Health Trigger Frequency**

| Reason | N | WR |
|---|---|---|
| winners_below_floor | 14 | 42.9% |
| wps_flipped_diag | 12 | 33.3% |
| winners_faded | 10 | 70.0% |
| v73_hc_rescue | 9 | 44.4% |
| below_lock_range | 7 | 28.6% |
| quality_below_floor | 7 | 57.1% |
| winners_killed | 5 | 80.0% |
| opp_side_stronger_diag | 4 | 50.0% |
| whitelist_fade_weak | 3 | 66.7% |
| sum_below_floor | 3 | 33.3% |
| opposition_building | 2 | 100.0% |
| mid_tier_or_lower | 2 | 100.0% |
| whitelist_fade_strong | 2 | 50.0% |


---

## 9. Drift & Calibration

### 7-Day (n=64)

| Feature | Frozen Mean | Live Mean | Drift (σ) |
|---|---|---|---|
| moneyPct | 78.17 | 85.39 | 0.45 |
| avgBet | 4162.25 | 11858.03 | 1.06 ⚠️ |
| invested | 27502.21 | 40483.73 | 0.23 |
| sharpCount | 5.64 | 2.81 | 0.83 |
| counterSharp | 21.72 | 14.61 | 0.45 |
| moneyEdge | 1.68 | 2.72 | 0.76 |
| mktDominance | 1.55 | 2.01 | 0.51 |

### Post-Regime (n=200)

| Feature | Frozen Mean | Live Mean | Drift (σ) |
|---|---|---|---|
| moneyPct | 78.17 | 86.91 | 0.55 |
| avgBet | 4162.25 | 18498.42 | 1.98 ⚠️ |
| invested | 27502.21 | 49440.68 | 0.38 |
| sharpCount | 5.64 | 2.56 | 0.91 |
| counterSharp | 21.72 | 13.09 | 0.54 |
| moneyEdge | 1.68 | 2.90 | 0.89 |
| mktDominance | 1.55 | 2.09 | 0.60 |

### V7 Era (n=480)

| Feature | Frozen Mean | Live Mean | Drift (σ) |
|---|---|---|---|
| moneyPct | 78.17 | 84.01 | 0.37 |
| avgBet | 4162.25 | 10924.92 | 0.93 |
| invested | 27502.21 | 39445.97 | 0.21 |
| sharpCount | 5.64 | 4.22 | 0.42 |
| counterSharp | 21.72 | 15.79 | 0.37 |
| moneyEdge | 1.68 | 2.36 | 0.50 |
| mktDominance | 1.55 | 1.79 | 0.26 |
