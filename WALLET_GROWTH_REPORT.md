# Wallet Roster Growth & Profitability

Generated: 4/24/2026, 12:02:53 PM ET

**Source:** `v8Scoring.walletDetails` on graded `sharpFlow{Picks,Spreads,Totals}` from **2026-04-18** onward. Each wallet-bet is one wallet appearing on one side of one graded game. Flat unit PnL uses the peak odds of the side the wallet was on.

**Roster definition:** a wallet counts as "tracked in sport X" when it has placed **≥ 2 bets** in X within the sample window. Profitability = cumulative flat PnL > 0.

**Coverage:** 364 wallet-bets · 80 unique wallets · sports: MLB, NBA, NHL · dates: 2026-04-18 → 2026-04-23

---
## §1. Current snapshot — per-sport wallet counts

Wallets tracked in each sport right now, with profitability + WR cuts. "Tracked" means ≥ 2 bets in the sport.

| Sport | Total wallets seen | Tracked (≥2 bets) | Profitable | % profitable | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 20 | 13 | 6 | 46% | 7 | 4 | 3 |
| NBA | 70 | 46 | 21 | 46% | 30 | 12 | 7 |
| NHL | 22 | 13 | 10 | 77% | 11 | 4 | 2 |
| **ALL (any sport)** | **80** | **56** | **29** | **52%** | **37** | **14** | **10** |

---
## §2. Daily roster growth (cumulative)

For each graded date D, we recompute the per-sport wallet roster **using every bet up to and including D**. This shows the live roster you'd have had on that day. Columns are per sport: `tracked (profitable)`.

| Date | ALL | MLB | NBA | NHL |
|---|---|---|---|---|
| 2026-04-18 | 5 (2) | 2 (2) | 3 (0) | 0 (0) |
| 2026-04-19 | 19 (8) | 5 (3) | 9 (3) | 3 (1) |
| 2026-04-20 | 29 (12) | 7 (6) | 23 (8) | 5 (2) |
| 2026-04-21 | 44 (21) | 10 (6) | 31 (10) | 7 (5) |
| 2026-04-22 | 52 (28) | 12 (6) | 39 (15) | 11 (10) |
| 2026-04-23 | 56 (29) | 13 (6) | 46 (21) | 13 (10) |

Format: `tracked (profitable)`. "Tracked" = wallets with ≥ 2 bets in that sport as of that date. "Profitable" = subset with cumulative flat PnL > 0.

---
## §3. Profitable-wallet distribution (current snapshot)

Flat-ROI distribution across tracked wallets in each sport. Min / Q25 / median / Q75 / max are in flat-unit ROI %. `profit quartile` is the median flat ROI *among profitable wallets only* — i.e. "how good is the middle winner in this sport."

| Sport | Tracked | Min ROI | Q25 ROI | Median ROI | Q75 ROI | Max ROI | Profitable | Median ROI of profitable |
|---|---|---|---|---|---|---|---|---|
| MLB | 13 | -100.0% | -37.9% | -4.5% | +20.7% | +85.4% | 6 | +26.9% |
| NBA | 46 | -100.0% | -50.6% | -4.7% | +52.7% | +283.0% | 21 | +56.5% |
| NHL | 13 | -26.7% | +1.0% | +20.0% | +30.0% | +100.6% | 10 | +20.0% |

---
## §4. Top profitable wallets by sport

Top 10 wallets by flat-ROI in each sport (min 2 bets in the sport).

### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|---|---|
| 1 | 63fc82 | 2 | 2 | 0 | 100.0% | +1.71 | +85.4% |
| 2 | 6bd96a | 7 | 5 | 2 | 71.4% | +2.41 | +34.4% |
| 3 | dcafd2 | 10 | 7 | 3 | 70.0% | +3.32 | +33.2% |
| 4 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% |
| 5 | 6b853d | 6 | 3 | 3 | 50.0% | +0.35 | +5.8% |
| 6 | fcc12b | 11 | 6 | 5 | 54.5% | +0.26 | +2.4% |
| 7 | 8c1eae | 2 | 1 | 1 | 50.0% | -0.09 | -4.5% |
| 8 | b05143 | 7 | 3 | 4 | 42.9% | -0.65 | -9.3% |
| 9 | 1d14b8 | 3 | 1 | 2 | 33.3% | -1.07 | -35.8% |
| 10 | 12192c | 6 | 2 | 4 | 33.3% | -2.27 | -37.9% |

### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% |
| 2 | 769c38 | 2 | 2 | 0 | 100.0% | +3.34 | +166.8% |
| 3 | 92df91 | 3 | 2 | 1 | 66.7% | +3.87 | +128.9% |
| 4 | 78e8f1 | 2 | 1 | 1 | 50.0% | +2.15 | +107.5% |
| 5 | 5c32f2 | 2 | 1 | 1 | 50.0% | +2.15 | +107.5% |
| 6 | a6c56e | 3 | 3 | 0 | 100.0% | +3.10 | +103.5% |
| 7 | cdb33b | 4 | 2 | 2 | 50.0% | +4.00 | +100.0% |
| 8 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% |
| 9 | bc3532 | 6 | 3 | 3 | 50.0% | +3.54 | +58.9% |
| 10 | d3f7ad | 2 | 2 | 0 | 100.0% | +1.17 | +58.3% |

### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|---|---|
| 1 | 981187 | 5 | 5 | 0 | 100.0% | +5.03 | +100.6% |
| 2 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% |
| 3 | 12192c | 3 | 2 | 1 | 66.7% | +1.60 | +53.3% |
| 4 | 1cb5b6 | 2 | 1 | 1 | 50.0% | +0.60 | +30.0% |
| 5 | 3033ee | 2 | 1 | 1 | 50.0% | +0.40 | +20.0% |
| 6 | dcafd2 | 2 | 1 | 1 | 50.0% | +0.40 | +20.0% |
| 7 | bc3532 | 2 | 1 | 1 | 50.0% | +0.40 | +20.0% |
| 8 | fcc12b | 3 | 2 | 1 | 66.7% | +0.50 | +16.6% |
| 9 | dfa240 | 7 | 4 | 3 | 57.1% | +0.62 | +8.9% |
| 10 | af1697 | 13 | 6 | 7 | 46.2% | +0.13 | +1.0% |

---
## §5. New wallets discovered per day

Wallets entering the roster for the first time on each date (first bet landed on date D). Shows how fast our universe of tracked sharps is expanding.

| Date | New wallets (any sport) | Running total |
|---|---|---|
| 2026-04-18 | 16 | 16 |
| 2026-04-19 | 20 | 36 |
| 2026-04-20 | 21 | 57 |
| 2026-04-21 | 13 | 70 |
| 2026-04-22 | 6 | 76 |
| 2026-04-23 | 4 | 80 |
