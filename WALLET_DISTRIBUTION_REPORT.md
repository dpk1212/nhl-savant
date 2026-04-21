# Wallet Distribution Report

Generated: 2026-04-21T20:28:25.647Z

> Descriptive statistics for every sharp wallet observed across both data
> sources, ahead of committing to the `walletBets` Firestore collection.

---

## §1. Population counts

| Metric | Source A (walletDetails) | Source B (positions) |
|---|---|---|
| Unique wallets | 57 | 66 |
| Wallet-bets | 166 | 371 |
| Unique games / date-span | 35 / 2026-04-18 → 2026-04-20 (3d) | — / 2026-04-17 → 2026-04-21 (5d) |
| Total union of wallets | **75** | |
| Wallets in both sources | 48 | |

## §2. Bet-size distribution (per-bet $invested)

| Source | n | min | p05 | p10 | p25 | **p50** | p75 | p90 | p95 | max | mean | std |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A: walletDetails | 166 | $4 | $184 | $652 | $3,012 | **$7,884** | $18,768 | $50,492 | $69,471 | $495,433 | $20,633 | $46,914 |
| B: positions | 371 | $1 | $81 | $1,052 | $3,755 | **$11,599** | $40,083 | $86,242 | $143,197 | $1,055,341 | $39,194 | $94,476 |

*Bolded column (p50) = median per-bet size.*

## §3. Per-wallet activity distribution

**How many bets does a typical sharp wallet place in our dataset?**

| Source | metric | n | min | p05 | p10 | p25 | **p50** | p75 | p90 | p95 | max | mean | std |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | #bets/wallet | 57 | 1.0 | 1.0 | 1.0 | 1.0 | **2.0** | 3.0 | 6.4 | 10.6 | 17.0 | 2.9 | 3.3 |
| B | #bets/wallet | 66 | 1.0 | 1.0 | 1.0 | 2.0 | **3.0** | 7.8 | 13.5 | 14.8 | 32.0 | 5.6 | 5.9 |
| B | $invested/wallet | 66 | $152 | $3,220 | $4,315 | $20,202 | **$51,180** | $185,691 | $620,108 | $906,712 | $3,360,808 | $220,319 | $471,043 |

## §4. Performance distributions (per wallet)

*Only wallets with at least 1 bet in the respective source.*

| Source | metric | n | min | p05 | p10 | p25 | **p50** | p75 | p90 | p95 | max | mean | std |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | Win Rate % | 57 | 0.0 | 0.0 | 0.0 | 0.0 | **50.0** | 100.0 | 100.0 | 100.0 | 100.0 | 49.7 | 39.4 |
| A | flat ROI % | 57 | -100.0 | -100.0 | -100.0 | -100.0 | **-3.7** | 90.9 | 134.0 | 196.5 | 315.0 | 12.6 | 107.2 |
| B | Win Rate % | 66 | 0.0 | 0.0 | 0.0 | 25.0 | **51.7** | 70.9 | 100.0 | 100.0 | 100.0 | 49.5 | 33.8 |
| B | $ ROI % | 66 | -100.1 | -100.0 | -100.0 | -45.8 | **6.3** | 50.1 | 89.6 | 111.2 | 376.2 | 6.6 | 85.4 |
| B | $ PnL | 66 | -$795,000 | -$119,955 | -$69,336 | -$15,189 | **$4,201** | $30,944 | $58,309 | $97,364 | $554,783 | -$879 | $130,768 |

## §5. Wallet-quality signal distributions (from walletDetails snapshots)

*Observation-level (one row per wallet-bet). If a wallet appears many times, high-activity wallets weigh more.*

| Signal | n | min | p05 | p10 | p25 | **p50** | p75 | p90 | p95 | max | mean | std |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| walletBase | 166 | 14.1 | 26.6 | 31.8 | 42.4 | **51.5** | 64.1 | 75.8 | 77.8 | 95.5 | 52.9 | 15.9 |
| roiNorm | 166 | 15.9 | 17.9 | 26.5 | 37.6 | **51.2** | 67.8 | 74.3 | 83.1 | 97.0 | 51.9 | 20.4 |
| rankNorm | 152 | 0.0 | 8.6 | 16.6 | 30.0 | **60.5** | 89.3 | 92.7 | 94.7 | 100.0 | 57.8 | 30.2 |
| lifetimeRoi % | 166 | 1.1 | 1.2 | 1.7 | 2.2 | **3.8** | 6.3 | 8.0 | 12.2 | 44.9 | 5.1 | 5.0 |
| contribution | 166 | 16.0 | 25.2 | 28.5 | 35.4 | **48.0** | 65.7 | 80.2 | 90.0 | 114.5 | 51.4 | 20.4 |
| sizeRatio | 166 | 0.0 | 0.0 | 0.1 | 0.2 | **0.9** | 1.9 | 4.1 | 7.1 | 23.3 | 1.9 | 3.6 |
| rank (lower=better) | 152 | 1.0 | 24.0 | 34.0 | 47.0 | **181.5** | 335.8 | 399.0 | 438.7 | 540.0 | 199.5 | 146.2 |

**Latest per-wallet snapshot** (one row per unique wallet = closer to the "wallet population" shape):

| Signal | n | min | p05 | p10 | p25 | **p50** | p75 | p90 | p95 | max | mean | std |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| walletBase | 57 | 14.1 | 25.7 | 31.7 | 44.9 | **51.0** | 62.7 | 73.1 | 78.4 | 95.5 | 52.4 | 16.6 |
| roiNorm | 57 | 15.9 | 19.5 | 26.5 | 36.3 | **54.9** | 68.9 | 84.2 | 91.0 | 97.0 | 54.1 | 22.1 |
| rank | 51 | 1.0 | 23.5 | 34.0 | 99.5 | **210.0** | 369.5 | 436.0 | 445.0 | 540.0 | 228.8 | 149.8 |
| lifetimeRoi % | 57 | 1.1 | 1.3 | 1.7 | 2.1 | **4.2** | 6.7 | 13.0 | 22.0 | 44.9 | 6.4 | 7.4 |

## §6. Where does the "average wallet" sit?

| Median sharp wallet (Source A — picks) | value |
|---|---|
| Win Rate | 50.0% |
| Flat ROI | -3.7% |
| # bets in sample | 2 |
| walletBase (latest) | 51.0 |
| roiNorm (latest) | 54.9 |
| Leaderboard rank (latest) | 210 |
| Lifetime ROI % (latest) | 4.20% |

| Median sharp wallet (Source B — positions) | value |
|---|---|
| Win Rate | 51.7% |
| Dollar ROI | 6.3% |
| Settled $ PnL | $4,201 |
| Total $ invested | $51,180 |
| # positions in sample | 3 |

## §7. Quality-band counts — how many wallets clear each threshold?

| Band | definition | wallets | % of A population |
|---|---|---|---|
| ELITE quality | ELITE quality | 1 | 2.0% |
| High walletBase | High walletBase | 1 | 2.0% |
| High roiNorm | High roiNorm | 4 | 7.8% |
| Mid walletBase (60–80) | Mid walletBase (60–80) | 14 | 27.5% |
| Mid roiNorm (60–80) | Mid roiNorm (60–80) | 17 | 33.3% |
| Top-50 rank | Top-50 rank | 10 | 19.6% |
| Top-100 rank | Top-100 rank | 13 | 25.5% |
| Top-250 rank | Top-250 rank | 30 | 58.8% |
| Lifetime ROI ≥ 10% | Lifetime ROI ≥ 10% | 4 | 7.8% |
| Lifetime ROI ≥ 5% | Lifetime ROI ≥ 5% | 22 | 43.1% |
| Lifetime ROI ≥ 0% | Lifetime ROI ≥ 0% | 51 | 100.0% |
| Lifetime ROI < 0% | Lifetime ROI < 0% | 0 | 0.0% |

**Wallets with high realised performance (from Source A in-sample):**

| Band | wallets | % |
|---|---|---|
| WR ≥ 60% & ≥ 3 bets | 4 | 7.0% |
| WR ≥ 55% & ≥ 3 bets | 5 | 8.8% |
| flat ROI ≥ +10 & ≥ 3 bets | 7 | 12.3% |
| flat ROI ≥ 0 & ≥ 3 bets | 9 | 15.8% |
| flat ROI ≤ -20 & ≥ 3 bets | 7 | 12.3% |

**Wallets with high realised performance (from Source B dollars):**

| Band | wallets | % |
|---|---|---|
| $ ROI ≥ +10% & ≥ 3 positions | 19 | 28.8% |
| $ ROI ≥ 0 & ≥ 3 positions | 22 | 33.3% |
| $ PnL ≥ +$50k | 10 | 15.2% |
| $ PnL ≤ -$50k | 9 | 13.6% |
| $ PnL ≤ -$250k | 1 | 1.5% |

## §8. Cross-tabs — does wallet quality predict performance?

**Per-wallet performance bucketed by roiNorm (latest):**

| roiNorm band | wallets | wallet-bets | WR % | flat ROI % |
|---|---|---|---|---|
| <40 | 17 | 60 | 40.0% | -11.1% |
| 40–60 | 13 | 27 | 51.9% | 7.7% |
| 60–80 | 17 | 57 | 50.9% | 0.5% |
| ≥80 | 4 | 8 | 62.5% | 64.8% |

**Per-wallet performance bucketed by walletBase (latest):**

| walletBase band | wallets | wallet-bets | WR % | flat ROI % |
|---|---|---|---|---|
| <40 | 11 | 34 | 44.1% | 7.3% |
| 40–60 | 25 | 59 | 44.1% | -7.8% |
| 60–80 | 14 | 58 | 53.4% | 6.9% |
| ≥80 | 1 | 1 | 0.0% | -100.0% |

**Source B — performance bucketed by leaderboardRank at bet time:**

| LB-rank band | positions | WR % | $ invested | $ PnL | $ ROI % |
|---|---|---|---|---|---|
| ≤50 | 74 | 44.6% | $4,474,622 | -$391,012 | -8.7% |
| 51–150 | 48 | 47.9% | $2,973,573 | -$1,331,083 | -44.8% |
| 151–350 | 86 | 55.8% | $5,404,764 | $1,551,665 | 28.7% |
| >350 | 84 | 53.6% | $1,220,155 | $133,672 | 11.0% |
| unknown | 79 | 51.9% | $467,971 | -$21,255 | -4.5% |

## §9. Source overlap

- Wallets in **both** sources: **48** (64.0% of total)
- Only in walletDetails: 9
- Only in positions:     18

- Confirmed winners (positive on both): **16**
- Confirmed bleeders (negative on both): **17**
- Mixed / disagreeing sign: 15

## §10. Tail snapshots

**Top 10 wallets by flat ROI (Source A, ≥ 3 bets):**

| wallet | n | WR | flat ROI | flat PnL (u) | walletBase | roiNorm | rank |
|---|---|---|---|---|---|---|---|
| `b05143` | 4 | 75.0% | 46.9% | +1.88 | 64.1 | 51.2 | 79 |
| `4edc5b` | 4 | 50.0% | 44.7% | +1.79 | 73.4 | 83.1 | 115 |
| `6b853d` | 8 | 75.0% | 44.3% | +3.54 | 49.5 | 74.3 | — |
| `40d814` | 4 | 50.0% | 39.4% | +1.58 | 47.2 | 66.8 | 399 |
| `779ef0` | 4 | 50.0% | 39.4% | +1.58 | 36.0 | 26.5 | 238 |
| `2d2ca8` | 4 | 50.0% | 38.0% | +1.52 | 23.5 | 15.9 | 316 |
| `981187` | 17 | 58.8% | 15.8% | +2.68 | 71.6 | 67.8 | 109 |
| `d50c53` | 3 | 66.7% | 9.8% | +0.30 | 47.5 | 72.9 | 442 |
| `fcc12b` | 13 | 61.5% | 9.8% | +1.28 | 77.8 | 67.8 | 34 |
| `73f5b0` | 10 | 50.0% | -3.6% | -0.36 | 49.0 | 26.5 | 81 |

**Bottom 10 wallets by flat ROI (Source A, ≥ 3 bets):**

| wallet | n | WR | flat ROI | flat PnL (u) | walletBase | roiNorm | rank |
|---|---|---|---|---|---|---|---|
| `407422` | 4 | 0.0% | -100.0% | -4.00 | 19.2 | 16.3 | 364 |
| `dfa240` | 3 | 33.3% | -48.6% | -1.46 | 32.6 | 47.4 | 436 |
| `4c64aa` | 3 | 33.3% | -44.4% | -1.33 | 51.1 | 53.1 | 151 |
| `a7a9cc` | 3 | 33.3% | -43.8% | -1.32 | 60.8 | 66.2 | 136 |
| `1d14b8` | 3 | 33.3% | -35.8% | -1.07 | 57.2 | 68.9 | 292 |
| `af1697` | 7 | 28.6% | -33.6% | -2.35 | 48.8 | 20.3 | 41 |
| `52aeeb` | 5 | 40.0% | -32.4% | -1.62 | 59.4 | 37.6 | 38 |
| `dcafd2` | 13 | 46.2% | -15.2% | -1.98 | 31.8 | 37.6 | 375 |
| `12192c` | 6 | 50.0% | -14.1% | -0.85 | 67.1 | 51.2 | 24 |
| `73f5b0` | 10 | 50.0% | -3.6% | -0.36 | 49.0 | 26.5 | 81 |

**Top 10 wallets by dollar PnL (Source B):**

| wallet | n | WR | $ invested | $ PnL | $ ROI | tier | LB rank |
|---|---|---|---|---|---|---|---|
| `2d2ca8` | 7 | 57.1% | $720,332 | $554,783 | 77.0% | ELITE | 316 |
| `78e8f1` | 5 | 20.0% | $158,606 | $136,415 | 86.0% | ELITE | 324 |
| `5c32f2` | 4 | 75.0% | $215,719 | $136,264 | 63.2% | ELITE | 49 |
| `3033ee` | 4 | 50.0% | $294,668 | $101,921 | 34.6% | ELITE | 1 |
| `b05143` | 14 | 57.1% | $618,215 | $83,691 | 13.5% | ELITE | 116 |
| `c5cea1` | 1 | 100.0% | $50,700 | $79,300 | 156.4% | ELITE | 27 |
| `43020b` | 3 | 66.7% | $68,918 | $59,942 | 87.0% | ELITE | 178 |
| `161f17` | 1 | 100.0% | $69,258 | $56,676 | 81.8% | ELITE | 200 |
| `22f091` | 1 | 100.0% | $49,236 | $53,338 | 108.3% | ELITE | 445 |
| `b31fc6` | 2 | 50.0% | $99,555 | $50,901 | 51.1% | ELITE | 128 |

**Bottom 10 wallets by dollar PnL (Source B):**

| wallet | n | WR | $ invested | $ PnL | $ ROI | tier | LB rank |
|---|---|---|---|---|---|---|---|
| `f09a15` | 2 | 0.0% | $794,609 | -$795,000 | -100.0% | ELITE | 50 |
| `af1697` | 8 | 62.5% | $964,135 | -$160,742 | -16.7% | ELITE | 41 |
| `8a3782` | 3 | 33.3% | $473,191 | -$125,537 | -26.5% | ELITE | 1 |
| `12192c` | 11 | 45.5% | $586,858 | -$123,549 | -21.1% | ELITE | 22 |
| `73f5b0` | 21 | 47.6% | $622,001 | -$109,172 | -17.6% | ELITE | 81 |
| `df4429` | 2 | 0.0% | $100,465 | -$100,426 | -100.0% | ELITE | — |
| `b81a50` | 2 | 0.0% | $85,295 | -$85,326 | -100.0% | ELITE | 134 |
| `7a9723` | 5 | 40.0% | $329,183 | -$53,347 | -16.2% | ELITE | 25 |
| `10c684` | 1 | 0.0% | $51,660 | -$51,706 | -100.1% | ELITE | 44 |
| `fbb0a0` | 2 | 0.0% | $48,682 | -$48,682 | -100.0% | ELITE | 406 |

## §11. Sample-size caveats

- Source A (walletDetails) covers 3 days (2026-04-18 → 2026-04-20). V8 scoring started 2026-04-18.
- Source B (positions) covers 5 days (2026-04-17 → 2026-04-21). Our ingest window is short.
- Median wallets in the sample have **very few bets** — treat per-wallet metrics as a rough prior, not as conviction.
- "flat ROI" assumes 1-unit flat staking at the tracked side's odds (walletDetails does not store actual $ size per wallet-bet).
- "$ ROI" is authoritative only in Source B (real invested $, real settled $).
- Population will grow each day — this report is a snapshot and should be re-run after every grading cycle.
