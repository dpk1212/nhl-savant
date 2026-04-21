# Wallet Performance Report

Generated: 4/21/2026, 4:14:15 PM ET

Per-wallet win/loss, PnL, and ROI built from two independent sources:

- **Source A** — `v8Scoring.walletDetails` on graded Sharp Flow picks (V8-era only, from 2026-04-18). Every wallet that backed a side on a game we produced a pick on. Flat unit PnL at the peak odds of the side the wallet bet.
- **Source B** — `sharp_action_positions` (5 days, 2026-04-17 → 2026-04-21). Each document is one wallet's one bet, with real settled dollar PnL at the price they got.

Source A sample: **166 wallet-game records** spanning **57 unique wallets**.
Source B sample: **371 graded positions** spanning **66 unique wallets**.

---
## §1. Wallet leaderboard — Source A (walletDetails flat units)

Every sharp wallet that appeared on a graded V8-era Sharp Flow pick. A "bet" = wallet appearing on the for-side of one graded game. Grading compares `wallet.side` to the winning side. "Flat PnL" uses the peak odds of the side the wallet bet.

### §1a. Top 20 wallets by flat ROI (min 3 bets)

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | Rank | Lifetime ROI | walletBase | roiNorm |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | b05143 | 4 | 3 | 1 | 75.0% | +1.88 | +46.9% | 79 | 3.8% | 64.1 | 51.2 |
| 2 | 4edc5b | 4 | 2 | 2 | 50.0% | +1.79 | +44.7% | 115 | 12.4% | 73.4 | 83.1 |
| 3 | 6b853d | 8 | 6 | 2 | 75.0% | +3.54 | +44.3% | — | 8.0% | 49.5 | 74.3 |
| 4 | 40d814 | 4 | 2 | 2 | 50.0% | +1.58 | +39.4% | 399 | 6.2% | 47.2 | 66.8 |
| 5 | 779ef0 | 4 | 2 | 2 | 50.0% | +1.58 | +39.4% | 238 | 1.7% | 36.0 | 26.5 |
| 6 | 2d2ca8 | 4 | 2 | 2 | 50.0% | +1.52 | +38.0% | 316 | 1.1% | 23.5 | 15.9 |
| 7 | 981187 | 17 | 10 | 7 | 58.8% | +2.68 | +15.8% | 109 | 6.3% | 71.6 | 67.8 |
| 8 | d50c53 | 3 | 2 | 1 | 66.7% | +0.30 | +9.8% | 442 | 7.6% | 47.5 | 72.9 |
| 9 | fcc12b | 13 | 8 | 5 | 61.5% | +1.28 | +9.8% | 34 | 6.3% | 77.8 | 67.8 |
| 10 | 73f5b0 | 10 | 5 | 5 | 50.0% | -0.36 | -3.6% | 81 | 1.7% | 49.0 | 26.5 |
| 11 | 12192c | 6 | 3 | 3 | 50.0% | -0.85 | -14.1% | 24 | 3.8% | 67.1 | 51.2 |
| 12 | dcafd2 | 13 | 6 | 7 | 46.2% | -1.98 | -15.2% | 375 | 2.2% | 31.8 | 37.6 |
| 13 | 52aeeb | 5 | 2 | 3 | 40.0% | -1.62 | -32.4% | 38 | 2.2% | 59.4 | 37.6 |
| 14 | af1697 | 7 | 2 | 5 | 28.6% | -2.35 | -33.6% | 41 | 1.3% | 48.8 | 20.3 |
| 15 | 1d14b8 | 3 | 1 | 2 | 33.3% | -1.07 | -35.8% | 292 | 6.5% | 57.2 | 68.9 |
| 16 | a7a9cc | 3 | 1 | 2 | 33.3% | -1.32 | -43.8% | 136 | 6.0% | 60.8 | 66.2 |
| 17 | 4c64aa | 3 | 1 | 2 | 33.3% | -1.33 | -44.4% | 151 | 4.0% | 51.1 | 53.1 |
| 18 | dfa240 | 3 | 1 | 2 | 33.3% | -1.46 | -48.6% | 436 | 3.2% | 32.6 | 47.4 |
| 19 | 407422 | 4 | 0 | 4 | 0.0% | -4.00 | -100.0% | 364 | 1.1% | 19.2 | 16.3 |

### §1b. Bottom 20 wallets by flat ROI (min 3 bets)

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | Rank | Lifetime ROI | walletBase | roiNorm |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 407422 | 4 | 0 | 4 | 0.0% | -4.00 | -100.0% | 364 | 1.1% | 19.2 | 16.3 |
| 2 | dfa240 | 3 | 1 | 2 | 33.3% | -1.46 | -48.6% | 436 | 3.2% | 32.6 | 47.4 |
| 3 | 4c64aa | 3 | 1 | 2 | 33.3% | -1.33 | -44.4% | 151 | 4.0% | 51.1 | 53.1 |
| 4 | a7a9cc | 3 | 1 | 2 | 33.3% | -1.32 | -43.8% | 136 | 6.0% | 60.8 | 66.2 |
| 5 | 1d14b8 | 3 | 1 | 2 | 33.3% | -1.07 | -35.8% | 292 | 6.5% | 57.2 | 68.9 |
| 6 | af1697 | 7 | 2 | 5 | 28.6% | -2.35 | -33.6% | 41 | 1.3% | 48.8 | 20.3 |
| 7 | 52aeeb | 5 | 2 | 3 | 40.0% | -1.62 | -32.4% | 38 | 2.2% | 59.4 | 37.6 |
| 8 | dcafd2 | 13 | 6 | 7 | 46.2% | -1.98 | -15.2% | 375 | 2.2% | 31.8 | 37.6 |
| 9 | 12192c | 6 | 3 | 3 | 50.0% | -0.85 | -14.1% | 24 | 3.8% | 67.1 | 51.2 |
| 10 | 73f5b0 | 10 | 5 | 5 | 50.0% | -0.36 | -3.6% | 81 | 1.7% | 49.0 | 26.5 |
| 11 | fcc12b | 13 | 8 | 5 | 61.5% | +1.28 | +9.8% | 34 | 6.3% | 77.8 | 67.8 |
| 12 | d50c53 | 3 | 2 | 1 | 66.7% | +0.30 | +9.8% | 442 | 7.6% | 47.5 | 72.9 |
| 13 | 981187 | 17 | 10 | 7 | 58.8% | +2.68 | +15.8% | 109 | 6.3% | 71.6 | 67.8 |
| 14 | 2d2ca8 | 4 | 2 | 2 | 50.0% | +1.52 | +38.0% | 316 | 1.1% | 23.5 | 15.9 |
| 15 | 779ef0 | 4 | 2 | 2 | 50.0% | +1.58 | +39.4% | 238 | 1.7% | 36.0 | 26.5 |
| 16 | 40d814 | 4 | 2 | 2 | 50.0% | +1.58 | +39.4% | 399 | 6.2% | 47.2 | 66.8 |
| 17 | 6b853d | 8 | 6 | 2 | 75.0% | +3.54 | +44.3% | — | 8.0% | 49.5 | 74.3 |
| 18 | 4edc5b | 4 | 2 | 2 | 50.0% | +1.79 | +44.7% | 115 | 12.4% | 73.4 | 83.1 |
| 19 | b05143 | 4 | 3 | 1 | 75.0% | +1.88 | +46.9% | 79 | 3.8% | 64.1 | 51.2 |

### §1c. High-activity wallets only (min 5 bets)

| # | Wallet | N | WR% | Flat PnL (u) | Flat ROI | Rank | walletBase | roiNorm |
|---|---|---|---|---|---|---|---|---|
| 1 | 6b853d | 8 | 75.0% | +3.54 | +44.3% | — | 49.5 | 74.3 |
| 2 | 981187 | 17 | 58.8% | +2.68 | +15.8% | 109 | 71.6 | 67.8 |
| 3 | fcc12b | 13 | 61.5% | +1.28 | +9.8% | 34 | 77.8 | 67.8 |
| 4 | 73f5b0 | 10 | 50.0% | -0.36 | -3.6% | 81 | 49.0 | 26.5 |
| 5 | 12192c | 6 | 50.0% | -0.85 | -14.1% | 24 | 67.1 | 51.2 |
| 6 | dcafd2 | 13 | 46.2% | -1.98 | -15.2% | 375 | 31.8 | 37.6 |
| 7 | 52aeeb | 5 | 40.0% | -1.62 | -32.4% | 38 | 59.4 | 37.6 |
| 8 | af1697 | 7 | 28.6% | -2.35 | -33.6% | 41 | 48.8 | 20.3 |

---
## §2. Wallet leaderboard — Source B (settled dollar PnL, 5-day window)

### §2a. Top 20 wallets by dollar PnL (min 3 bets)

| # | Wallet | N | WR% | Invested ($) | Settled PnL ($) | Dollar ROI | Tier | LB Rank |
|---|---|---|---|---|---|---|---|---|
| 1 | 2d2ca8 | 7 | 57.1% | 720,332 | +554783 | +77.0% | ELITE | 316 |
| 2 | 78e8f1 | 5 | 20.0% | 158,606 | +136415 | +86.0% | ELITE | 324 |
| 3 | 5c32f2 | 4 | 75.0% | 215,719 | +136264 | +63.2% | ELITE | 49 |
| 4 | 3033ee | 4 | 50.0% | 294,668 | +101921 | +34.6% | ELITE | 1 |
| 5 | b05143 | 14 | 57.1% | 618,215 | +83691 | +13.5% | ELITE | 116 |
| 6 | 43020b | 3 | 66.7% | 68,918 | +59942 | +87.0% | ELITE | 178 |
| 7 | a0d6d2 | 23 | 56.5% | 43,389 | +48667 | +112.2% | PROVEN | — |
| 8 | fcc12b | 15 | 53.3% | 944,079 | +48627 | +5.2% | ELITE | 34 |
| 9 | 1d14b8 | 9 | 55.6% | 199,198 | +44733 | +22.5% | ELITE | 292 |
| 10 | d3381b | 4 | 75.0% | 68,933 | +40152 | +58.2% | ELITE | 230 |
| 11 | 4c64aa | 6 | 66.7% | 163,655 | +36875 | +22.5% | ELITE | 156 |
| 12 | 4edc5b | 9 | 77.8% | 436,083 | +32358 | +7.4% | ELITE | 115 |
| 13 | dcafd2 | 32 | 56.3% | 193,036 | +22811 | +11.8% | ELITE | 375 |
| 14 | 981187 | 13 | 69.2% | 3,360,808 | +17618 | +0.5% | ELITE | 109 |
| 15 | a7a9cc | 4 | 100.0% | 25,213 | +17483 | +69.3% | ELITE | 136 |
| 16 | 2bffeb | 3 | 66.7% | 20,897 | +17295 | +82.8% | ELITE | 288 |
| 17 | bc35e3 | 7 | 71.4% | 35,859 | +16921 | +47.2% | SHARP | — |
| 18 | 769c38 | 10 | 60.0% | 94,706 | +14506 | +15.3% | ELITE | 538 |
| 19 | 88c556 | 3 | 66.7% | 30,421 | +12891 | +42.4% | ELITE | 353 |
| 20 | c71ce4 | 3 | 66.7% | 29,386 | +9378 | +31.9% | PROVEN | — |

### §2b. Bottom 20 wallets by dollar PnL (min 3 bets)

| # | Wallet | N | WR% | Invested ($) | Settled PnL ($) | Dollar ROI | Tier | LB Rank |
|---|---|---|---|---|---|---|---|---|
| 1 | af1697 | 8 | 62.5% | 964,135 | -160742 | -16.7% | ELITE | 41 |
| 2 | 8a3782 | 3 | 33.3% | 473,191 | -125537 | -26.5% | ELITE | 1 |
| 3 | 12192c | 11 | 45.5% | 586,858 | -123549 | -21.1% | ELITE | 22 |
| 4 | 73f5b0 | 21 | 47.6% | 622,001 | -109172 | -17.6% | ELITE | 81 |
| 5 | 7a9723 | 5 | 40.0% | 329,183 | -53347 | -16.2% | ELITE | 25 |
| 6 | 6b853d | 14 | 42.9% | 107,509 | -41898 | -39.0% | ELITE | — |
| 7 | bbd49f | 5 | 20.0% | 41,351 | -24325 | -58.8% | ELITE | 244 |
| 8 | ba8492 | 4 | 25.0% | 23,638 | -22922 | -97.0% | PROVEN | — |
| 9 | 407422 | 8 | 25.0% | 60,754 | -21331 | -35.1% | ELITE | 364 |
| 10 | 779ef0 | 9 | 33.3% | 69,036 | -14989 | -21.7% | ELITE | 238 |
| 11 | 59266e | 7 | 71.4% | 1,180,085 | -11306 | -1.0% | ELITE | 385 |
| 12 | d50c53 | 3 | 66.7% | 45,779 | -8647 | -18.9% | ELITE | 442 |
| 13 | 52aeeb | 14 | 28.6% | 403,901 | -8521 | -2.1% | ELITE | 38 |
| 14 | 85acbf | 3 | 0.0% | 3,103 | -3103 | -100.0% | PROVEN | — |
| 15 | dfa240 | 7 | 42.9% | 28,375 | -1633 | -5.8% | ELITE | 436 |
| 16 | 7f00bc | 3 | 33.3% | 5,350 | -1414 | -26.4% | ELITE | — |
| 17 | 8c1eae | 10 | 40.0% | 22,947 | -1405 | -6.1% | ELITE | 242 |
| 18 | d8e720 | 5 | 40.0% | 152 | -73 | -48.0% | PROVEN | — |
| 19 | 0f9d74 | 10 | 60.0% | 14,568 | +4231 | +29.0% | ELITE | — |
| 20 | 40d814 | 7 | 42.9% | 16,218 | +5999 | +37.0% | ELITE | 399 |

### §2c. High-activity wallets only (min 8 bets, sorted by dollar ROI)

| # | Wallet | N | WR% | Invested ($) | PnL ($) | $ ROI | Tier |
|---|---|---|---|---|---|---|---|
| 1 | a0d6d2 | 23 | 56.5% | 43,389 | +48667 | +112.2% | PROVEN |
| 2 | 0f9d74 | 10 | 60.0% | 14,568 | +4231 | +29.0% | ELITE |
| 3 | 1d14b8 | 9 | 55.6% | 199,198 | +44733 | +22.5% | ELITE |
| 4 | 769c38 | 10 | 60.0% | 94,706 | +14506 | +15.3% | ELITE |
| 5 | b05143 | 14 | 57.1% | 618,215 | +83691 | +13.5% | ELITE |
| 6 | dcafd2 | 32 | 56.3% | 193,036 | +22811 | +11.8% | ELITE |
| 7 | 4edc5b | 9 | 77.8% | 436,083 | +32358 | +7.4% | ELITE |
| 8 | fcc12b | 15 | 53.3% | 944,079 | +48627 | +5.2% | ELITE |
| 9 | 981187 | 13 | 69.2% | 3,360,808 | +17618 | +0.5% | ELITE |
| 10 | 52aeeb | 14 | 28.6% | 403,901 | -8521 | -2.1% | ELITE |
| 11 | 8c1eae | 10 | 40.0% | 22,947 | -1405 | -6.1% | ELITE |
| 12 | af1697 | 8 | 62.5% | 964,135 | -160742 | -16.7% | ELITE |
| 13 | 73f5b0 | 21 | 47.6% | 622,001 | -109172 | -17.6% | ELITE |
| 14 | 12192c | 11 | 45.5% | 586,858 | -123549 | -21.1% | ELITE |
| 15 | 779ef0 | 9 | 33.3% | 69,036 | -14989 | -21.7% | ELITE |
| 16 | 407422 | 8 | 25.0% | 60,754 | -21331 | -35.1% | ELITE |
| 17 | 6b853d | 14 | 42.9% | 107,509 | -41898 | -39.0% | ELITE |

---
## §3. Does wallet quality predict wins? (Source A)

Bucket every walletDetails record by its stored quality signals and show aggregate WR / flat ROI. If higher quality → better outcomes, the signal is validated.

### By walletBase (aggregate quality score)
| Bucket | N | Wins | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|
| base 40–55 | 60 | 31 | 51.7% | +5.38 | +9.0% |
| base 55–70 | 41 | 23 | 56.1% | +4.97 | +12.1% |
| base<40 | 34 | 14 | 41.2% | -1.67 | -4.9% |
| base≥70 | 31 | 15 | 48.4% | -0.60 | -1.9% |

### By roiNorm (lifetime ROI percentile)
| Bucket | N | Wins | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|
| roiNorm 40–60 | 37 | 20 | 54.1% | +6.07 | +16.4% |
| roiNorm 60–80 | 58 | 31 | 53.4% | +3.16 | +5.4% |
| roiNorm<40 | 58 | 23 | 39.7% | -8.93 | -15.4% |
| roiNorm≥80 | 13 | 9 | 69.2% | +7.79 | +59.9% |

### By rankNorm (lifetime rank percentile)
| Bucket | N | Wins | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|
| rankNorm 40–60 | 25 | 12 | 48.0% | -0.59 | -2.3% |
| rankNorm 60–80 | 24 | 11 | 45.8% | +0.91 | +3.8% |
| rankNorm<40 | 51 | 26 | 51.0% | +7.00 | +13.7% |
| rankNorm≥80 | 52 | 23 | 44.2% | -6.46 | -12.4% |

### By lifetime rank (absolute)
| Bucket | N | Wins | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|
| Rank 151–350 | 49 | 24 | 49.0% | -1.91 | -3.9% |
| Rank 51–150 | 27 | 13 | 48.1% | +3.39 | +12.5% |
| Rank >350 | 34 | 17 | 50.0% | +5.60 | +16.5% |
| Top 50 | 42 | 18 | 42.9% | -6.21 | -14.8% |

### By contribution on this pick
| Bucket | N | Wins | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|
| contrib 25–50 | 82 | 43 | 52.4% | +10.08 | +12.3% |
| contrib 50–75 | 52 | 27 | 51.9% | +1.51 | +2.9% |
| contrib<25 | 8 | 2 | 25.0% | -4.96 | -62.0% |
| contrib≥75 | 24 | 11 | 45.8% | +1.46 | +6.1% |

### By sizeRatio (sized vs usual)
| Bucket | N | Wins | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|
| size 0.75–1.5× | 35 | 15 | 42.9% | -6.94 | -19.8% |
| size 1.5–3× | 26 | 14 | 53.8% | +9.61 | +36.9% |
| size<0.75× (under-sized) | 78 | 40 | 51.3% | +3.59 | +4.6% |
| size≥3× usual | 27 | 14 | 51.9% | +1.83 | +6.8% |

---
## §4. Tier and sport performance (Source B, dollar PnL)

### By wallet tier
| Bucket | N | WR% | Invested ($) | Settled PnL ($) | Dollar ROI |
|---|---|---|---|---|---|
| ELITE | 325 | 51.7% | 14,375,771 | -96539 | -0.7% |
| PROVEN | 40 | 45.0% | 115,737 | -16798 | -14.5% |
| SHARP | 6 | 66.7% | 49,577 | +55324 | +111.6% |

### By sport
| Bucket | N | WR% | Invested ($) | Settled PnL ($) | Dollar ROI |
|---|---|---|---|---|---|
| MLB | 129 | 56.6% | 2,652,598 | +499645 | +18.8% |
| NBA | 207 | 47.3% | 10,748,696 | -359831 | -3.3% |
| NHL | 35 | 54.3% | 1,139,791 | -197827 | -17.4% |

### By market
| Bucket | N | WR% | Invested ($) | Settled PnL ($) | Dollar ROI |
|---|---|---|---|---|---|
| ML | 204 | 52.5% | 9,981,996 | -221015 | -2.2% |
| SPREAD | 90 | 51.1% | 2,516,033 | -34976 | -1.4% |
| TOTAL | 77 | 48.1% | 2,043,056 | +197978 | +9.7% |

### By sport-leaderboard percentile
| Bucket | N | WR% | Invested ($) | Settled PnL ($) | Dollar ROI |
|---|---|---|---|---|---|
| LB Top 25%+ | 236 | 53.4% | 12,570,907 | +131800 | +1.0% |

### By wallet leaderboard rank
| Bucket | N | WR% | Invested ($) | Settled PnL ($) | Dollar ROI |
|---|---|---|---|---|---|
| LB Rank 151–350 | 86 | 55.8% | 5,404,764 | +1551665 | +28.7% |
| LB Rank 51–150 | 44 | 47.7% | 2,114,134 | -643254 | -30.4% |
| LB Rank >350 | 84 | 53.6% | 1,220,155 | +133672 | +11.0% |
| LB Rank ≤50 | 78 | 44.9% | 5,334,061 | -1078841 | -20.2% |

---
## §5. Cross-source wallet reliability

Wallets that appear in **both** sources — for each, show Source A (walletDetails flat ROI) next to Source B (dollar ROI). Agreement across sources = real signal; disagreement = noise.

| Wallet | A: N | A: WR% | A: Flat ROI | A: Flat PnL (u) | B: N | B: WR% | B: $ ROI | B: $ PnL | Tier |
|---|---|---|---|---|---|---|---|---|---|
| b05143 | 4 | 75.0% | +46.9% | +1.88 | 14 | 57.1% | +13.5% | +83691 | ELITE |
| 4edc5b | 4 | 50.0% | +44.7% | +1.79 | 9 | 77.8% | +7.4% | +32358 | ELITE |
| 6b853d | 8 | 75.0% | +44.3% | +3.54 | 14 | 42.9% | -39.0% | -41898 | ELITE |
| 40d814 | 4 | 50.0% | +39.4% | +1.58 | 7 | 42.9% | +37.0% | +5999 | ELITE |
| 779ef0 | 4 | 50.0% | +39.4% | +1.58 | 9 | 33.3% | -21.7% | -14989 | ELITE |
| 2d2ca8 | 4 | 50.0% | +38.0% | +1.52 | 7 | 57.1% | +77.0% | +554783 | ELITE |
| 981187 | 17 | 58.8% | +15.8% | +2.68 | 13 | 69.2% | +0.5% | +17618 | ELITE |
| d50c53 | 3 | 66.7% | +9.8% | +0.30 | 3 | 66.7% | -18.9% | -8647 | ELITE |
| fcc12b | 13 | 61.5% | +9.8% | +1.28 | 15 | 53.3% | +5.2% | +48627 | ELITE |
| 73f5b0 | 10 | 50.0% | -3.6% | -0.36 | 21 | 47.6% | -17.6% | -109172 | ELITE |
| 12192c | 6 | 50.0% | -14.1% | -0.85 | 11 | 45.5% | -21.1% | -123549 | ELITE |
| dcafd2 | 13 | 46.2% | -15.2% | -1.98 | 32 | 56.3% | +11.8% | +22811 | ELITE |
| 52aeeb | 5 | 40.0% | -32.4% | -1.62 | 14 | 28.6% | -2.1% | -8521 | ELITE |
| af1697 | 7 | 28.6% | -33.6% | -2.35 | 8 | 62.5% | -16.7% | -160742 | ELITE |
| 1d14b8 | 3 | 33.3% | -35.8% | -1.07 | 9 | 55.6% | +22.5% | +44733 | ELITE |
| a7a9cc | 3 | 33.3% | -43.8% | -1.32 | 4 | 100.0% | +69.3% | +17483 | ELITE |
| 4c64aa | 3 | 33.3% | -44.4% | -1.33 | 6 | 66.7% | +22.5% | +36875 | ELITE |
| dfa240 | 3 | 33.3% | -48.6% | -1.46 | 7 | 42.9% | -5.8% | -1633 | ELITE |
| 407422 | 4 | 0.0% | -100.0% | -4.00 | 8 | 25.0% | -35.1% | -21331 | ELITE |

### §5a. Confirmed winners (positive in BOTH sources, min 3 bets each)

- **b05143** · A: 4 bets, +46.9% flat · B: 14 bets, +13.5% $ROI · tier=ELITE
- **4edc5b** · A: 4 bets, +44.7% flat · B: 9 bets, +7.4% $ROI · tier=ELITE
- **40d814** · A: 4 bets, +39.4% flat · B: 7 bets, +37.0% $ROI · tier=ELITE
- **2d2ca8** · A: 4 bets, +38.0% flat · B: 7 bets, +77.0% $ROI · tier=ELITE
- **981187** · A: 17 bets, +15.8% flat · B: 13 bets, +0.5% $ROI · tier=ELITE
- **fcc12b** · A: 13 bets, +9.8% flat · B: 15 bets, +5.2% $ROI · tier=ELITE

### §5b. Confirmed bleeders (negative in BOTH sources, min 3 bets each)

- **73f5b0** · A: 10 bets, -3.6% flat · B: 21 bets, -17.6% $ROI · tier=ELITE
- **12192c** · A: 6 bets, -14.1% flat · B: 11 bets, -21.1% $ROI · tier=ELITE
- **52aeeb** · A: 5 bets, -32.4% flat · B: 14 bets, -2.1% $ROI · tier=ELITE
- **af1697** · A: 7 bets, -33.6% flat · B: 8 bets, -16.7% $ROI · tier=ELITE
- **dfa240** · A: 3 bets, -48.6% flat · B: 7 bets, -5.8% $ROI · tier=ELITE
- **407422** · A: 4 bets, -100.0% flat · B: 8 bets, -35.1% $ROI · tier=ELITE

---
## §6. Does above-average bet size predict wins?

For each wallet-bet we ask: was this an above- or below-average bet **for this wallet**, and did the bigger bets cash more often?

### §6a. Source A — sizeRatio × sport (flat units)

`sizeRatio` = bet size on this pick ÷ the wallet's historical avg bet in this sport. Values >1 = above-average bet, <1 = below-average.

| Size band | MLB N · WR · Flat ROI | NBA N · WR · Flat ROI | NHL N · WR · Flat ROI | TOTAL |
|---|---|---|---|---|
| <0.25× (very light) | N=14 · 57% · +14% | N=19 · 32% · -25% | N=10 · 60% · +26% | **N=43 · 47% · -0% · -0.2u** |
| 0.25–0.75× (light) | N=9 · 67% · +15% | N=17 · 47% · -3% | N=9 · 67% · +32% | **N=35 · 57% · +11% · +3.8u** |
| 0.75–1.5× (routine) | N=5 · 60% · +15% | N=23 · 35% · -37% | N=7 · 57% · +13% | **N=35 · 43% · -20% · -6.9u** |
| 1.5–3× (conviction) | N=6 · 83% · +64% | N=17 · 47% · +39% | N=3 · 33% · -32% | **N=26 · 54% · +37% · +9.6u** |
| 3–5× | N=7 · 71% · +35% | N=8 · 50% · -18% | N=1 · 0% · -100% | **N=16 · 56% · +0% · +0.0u** |
| ≥5× (max conviction) | — | N=11 · 45% · +17% | — | **N=11 · 45% · +17% · +1.8u** |

### §6b. Source A — sizeRatio × market (flat units)

| Size band | ML N · WR · Flat ROI | SPREAD N · WR · Flat ROI | TOTAL N · WR · Flat ROI | TOTAL |
|---|---|---|---|---|
| <0.25× (very light) | N=32 · 50% · +10% | N=5 · 20% · -62% | N=6 · 50% · -2% | **N=43 · 47% · -0% · -0.2u** |
| 0.25–0.75× (light) | N=23 · 61% · +19% | N=6 · 33% · -36% | N=6 · 67% · +25% | **N=35 · 57% · +11% · +3.8u** |
| 0.75–1.5× (routine) | N=17 · 53% · -3% | N=15 · 33% · -36% | N=3 · 33% · -36% | **N=35 · 43% · -20% · -6.9u** |
| 1.5–3× (conviction) | N=15 · 60% · +71% | N=6 · 17% · -68% | N=5 · 80% · +60% | **N=26 · 54% · +37% · +9.6u** |
| 3–5× | N=8 · 75% · +25% | N=4 · 25% · -51% | N=4 · 50% · +1% | **N=16 · 56% · +0% · +0.0u** |
| ≥5× (max conviction) | N=6 · 67% · +82% | N=2 · 50% · -5% | N=3 · 0% · -100% | **N=11 · 45% · +17% · +1.8u** |

### §6c. Source A — sizeRatio × wallet quality (walletBase)

Does size conviction matter MORE for high-quality wallets, or do they win regardless?

| Size band | base<40 N · WR · Flat ROI | base 40–55 N · WR · Flat ROI | base 55–70 N · WR · Flat ROI | base ≥70 N · WR · Flat ROI |
|---|---|---|---|---|
| <0.25× (very light) | N=6 · 17% · -72% | N=20 · 40% · -14% | N=7 · 71% · +77% | N=10 · 60% · +15% |
| 0.25–0.75× (light) | N=5 · 60% · +62% | N=12 · 75% · +40% | N=12 · 33% · -44% | N=6 · 67% · +20% |
| 0.75–1.5× (routine) | N=7 · 29% · -50% | N=12 · 50% · +3% | N=8 · 63% · +14% | N=8 · 25% · -61% |
| 1.5–3× (conviction) | N=6 · 50% · +68% | N=7 · 43% · -24% | N=9 · 67% · +50% | N=4 · 50% · +66% |
| 3–5× | N=9 · 56% · -0% | N=3 · 33% · -34% | N=3 · 67% · +5% | N=1 · 100% · +91% |
| ≥5× (max conviction) | N=1 · 0% · -100% | N=6 · 67% · +94% | N=2 · 50% · -41% | N=2 · 0% · -100% |

### §6d. Source B — each bet vs wallet's own median size (dollar units)

For every wallet with ≥5 graded positions, classify each of their bets as above- or below-their-own-median invested dollars. Then aggregate WR and dollar ROI across all wallets. This strips out cross-wallet scale and tests the "sized-up bet" hypothesis cleanly.

| Self-size bucket | N | WR | Invested ($) | Settled PnL ($) | Dollar ROI |
|---|---|---|---|---|---|
| <1.25× own median (routine/below) | 207 | 52.7% | 3,971,785 | +52715 | +1.3% |
| 1.25–2× own median (above) | 40 | 42.5% | 2,104,149 | -381609 | -18.1% |
| ≥2× own median (way above) | 44 | 52.3% | 5,339,105 | +824838 | +15.4% |

### §6e. Cross-source confirmed winners — is size conviction the tell?

Restricting Source B to the 6 wallets confirmed-positive in BOTH sources (see §5a).

| Self-size bucket | N | WR | Invested ($) | Settled PnL ($) | Dollar ROI |
|---|---|---|---|---|---|
| <1.25× own median (routine/below) | 38 | 63.2% | 1,174,197 | +138482 | +11.8% |
| 1.25–2× own median (above) | 10 | 20.0% | 648,376 | -358982 | -55.4% |
| ≥2× own median (way above) | 17 | 76.5% | 4,273,162 | +963576 | +22.5% |

---
## Headline numbers

- Source A: across **166** wallet-bets, **50.0% WR**, flat ROI **+4.9%**, flat PnL **+8.09u**.
- Source B: across **371** positions, **51.2% WR**, dollar ROI **-0.4%**, dollar PnL **-58013**.

---
*Auto-generated by `scripts/walletPerformanceReport.js`.  Short wallet hashes (e.g. `fcc12b`) are the first 6 chars of the wallet address; full addresses are available in Firestore.*
