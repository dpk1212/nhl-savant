# Wallet-Consensus V8 Pick Backtest

_Generated 4/22/2026, 4:06:12 PM ET · window: **2026-04-18 → 2026-12-31** · N = 53 graded sides · profiles loaded = 87_

> Each row represents a V8 pick (ML / Spread / Total) that was **LOCKED or SHADOW-eligible** with graded outcome and stored `walletDetails`. For every pick, we recompute:
> - `forW` = # of sport-whitelisted (CONFIRMED / FLAT) wallets on our pick side
> - `agW` = # of sport-whitelisted wallets opposing our pick
> - `Δ = forW − agW` (ladder ≤ −2 / −1 / 0 / +1 / ≥ +2)
> Flat ROI = risk 1u / pick. Wtd ROI = risk `peak.units`. PUSH counts as 0.

## Baseline (all picks)

| N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd ROI | Avg ★ |
|---:|---|---:|---:|---:|---:|---:|
| 53 | 24-29-0 | 45.3% | -0.98u | -1.9% | -12.8% | 3.2 |

### By wallet-consensus Δ (forW − agW)

| Bucket | N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd P&L | Wtd ROI | Avg ★ |
|---|---:|---|---:|---:|---:|---:|---:|---:|
| ≤ −2 (FADE_STRONG) | 1 | 0-1-0 | 0.0% | -1.00u | -100.0% | -0.50u | -100.0% | 4.0 |
| −1 (FADE_WEAK) | 7 | 2-5-0 | 28.6% | -3.75u | -53.6% | -4.38u | -73.0% | 3.1 |
| 0 (NEUTRAL) | 19 | 4-15-0 | 21.1% | -11.56u | -60.8% | -16.06u | -83.4% | 3.1 |
| +1 (LEAN_FOR) | 10 | 7-3-0 | 70.0% | +3.14u | +31.4% | -0.11u | -1.3% | 3.0 |
| ≥ +2 (STRONG_FOR) | 16 | 11-5-0 | 68.8% | +12.19u | +76.2% | +14.21u | +73.8% | 3.3 |

### By whitelist activity

| Bucket | N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd P&L | Wtd ROI | Avg ★ |
|---|---:|---|---:|---:|---:|---:|---:|---:|
| ≥1 whitelisted sharp | 41 | 21-20-0 | 51.2% | +5.26u | +12.8% | +3.31u | +8.3% | 3.1 |
| no whitelisted sharps | 12 | 3-9-0 | 25.0% | -6.24u | -52.0% | -10.15u | -75.2% | 3.3 |

### By strength ratio forW / (forW + agW) — only picks with ≥1 WL

| Bucket | N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd P&L | Wtd ROI | Avg ★ |
|---|---:|---|---:|---:|---:|---:|---:|---:|
| 1.00 (all for, none ag) | 21 | 14-7-0 | 66.7% | +10.48u | +49.9% | +8.36u | +36.7% | 3.1 |
| [0.67, 1.00) mostly for | 3 | 2-1-0 | 66.7% | +3.06u | +102.0% | +4.47u | +127.7% | 4.0 |
| [0.34, 0.67) split | 11 | 4-7-0 | 36.4% | -4.34u | -39.5% | -5.55u | -63.4% | 2.8 |
| 0.00 (all against) | 6 | 1-5-0 | 16.7% | -3.94u | -65.7% | -3.97u | -79.4% | 3.3 |

### By market type

| Bucket | N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd P&L | Wtd ROI | Avg ★ |
|---|---:|---|---:|---:|---:|---:|---:|---:|
| ML | 31 | 16-15-0 | 51.6% | +5.48u | +17.7% | +4.10u | +13.0% | 3.2 |
| SPREAD | 9 | 2-7-0 | 22.2% | -5.21u | -57.9% | -7.07u | -57.7% | 3.8 |
| TOTAL | 13 | 6-7-0 | 46.2% | -1.25u | -9.6% | -3.87u | -39.7% | 2.8 |

### By lock stage

| Bucket | N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd P&L | Wtd ROI | Avg ★ |
|---|---:|---|---:|---:|---:|---:|---:|---:|
| LOCKED | 48 | 21-27-0 | 43.8% | -1.69u | -3.5% | -7.36u | -14.2% | 3.2 |
| SHADOW | 5 | 3-2-0 | 60.0% | +0.70u | +14.0% | +0.52u | +34.7% | 2.7 |

### Regime × wallet consensus

| Bucket | N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd P&L | Wtd ROI | Avg ★ |
|---|---:|---|---:|---:|---:|---:|---:|---:|
| CLEAR_MOVE · Δ ≥ +1 | 5 | 4-1-0 | 80.0% | +2.47u | +49.5% | +3.81u | +54.4% | 3.1 |
| CLEAR_MOVE · Δ ≤ 0 | 5 | 2-3-0 | 40.0% | -1.83u | -36.7% | -2.42u | -60.5% | 2.8 |
| non-CLEAR · Δ ≥ +1 | 21 | 14-7-0 | 66.7% | +12.85u | +61.2% | +10.29u | +49.6% | 3.2 |
| non-CLEAR · Δ ≤ 0 | 22 | 4-18-0 | 18.2% | -14.48u | -65.8% | -18.52u | -85.1% | 3.2 |

### Contrib tier × wallet consensus

| Bucket | N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd P&L | Wtd ROI | Avg ★ |
|---|---:|---|---:|---:|---:|---:|---:|---:|
| STRONG · Δ ≥ +1 | 6 | 3-3-0 | 50.0% | +0.02u | +0.4% | +0.60u | +7.1% | 3.3 |
| STRONG · Δ ≤ 0 | 9 | 0-9-0 | 0.0% | -9.00u | -100.0% | -9.75u | -100.0% | 3.3 |
| STANDARD · Δ ≥ +1 | 5 | 4-1-0 | 80.0% | +2.58u | +51.7% | +1.19u | +26.4% | 2.6 |
| STANDARD · Δ ≤ 0 | 7 | 3-4-0 | 42.9% | -1.43u | -20.4% | -4.49u | -57.9% | 3.2 |
| LEAN · Δ ≥ +1 | 4 | 2-2-0 | 50.0% | +0.75u | +18.8% | +0.65u | +26.0% | 3.1 |
| LEAN · Δ ≤ 0 | 3 | 2-1-0 | 66.7% | +0.93u | +31.0% | -0.04u | -2.0% | 2.7 |

### Stars × wallet consensus

| Bucket | N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd P&L | Wtd ROI | Avg ★ |
|---|---:|---|---:|---:|---:|---:|---:|---:|
| ≥4★ · Δ ≥ +1 | 5 | 4-1-0 | 80.0% | +4.60u | +92.1% | +6.72u | +67.2% | 4.4 |
| ≥4★ · Δ ≤ 0 | 6 | 0-6-0 | 0.0% | -6.00u | -100.0% | -10.25u | -100.0% | 4.4 |
| 3★ · Δ ≥ +1 | 13 | 8-5-0 | 61.5% | +7.34u | +56.5% | +4.91u | +41.8% | 3.2 |
| 3★ · Δ ≤ 0 | 9 | 2-7-0 | 22.2% | -5.90u | -65.6% | -6.98u | -77.6% | 3.2 |
| <3★ · Δ ≥ +1 | 8 | 6-2-0 | 75.0% | +3.38u | +42.3% | +2.47u | +41.2% | 2.5 |
| <3★ · Δ ≤ 0 | 12 | 4-8-0 | 33.3% | -4.41u | -36.7% | -3.71u | -57.1% | 2.5 |

## Every STRONG_FOR (Δ ≥ +2) pick

| Date | Sport | Market | Pick | ★ | Stage | Regime | Tier | forW / agW | Δ | Outcome | Profit |
|---|---|---|---|---:|---|---|---|---|---:|---|---:|
| 2026-04-18 | MLB | ML | Arizona Diamondbacks | 4.5 | LOCKED | CLEAR_MOVE | — | 3/0 | +3 | WIN | +2.00u |
| 2026-04-18 | MLB | TOTAL | Under 7 | 2.5 | LOCKED | NEAR_START | — | 2/0 | +2 | WIN | +0.53u |
| 2026-04-18 | MLB | TOTAL | Under 9.5 | 2.5 | LOCKED | NEAR_START | — | 2/0 | +2 | LOSS | -0.50u |
| 2026-04-19 | MLB | ML | Atlanta Braves | 3.5 | LOCKED | NEAR_START | — | 3/0 | +3 | WIN | +1.62u |
| 2026-04-19 | MLB | ML | Miami Marlins | 4 | LOCKED | NEAR_START | — | 4/1 | +3 | WIN | +1.82u |
| 2026-04-19 | MLB | ML | Chicago Cubs | 3 | LOCKED | CLEAR_MOVE | — | 3/0 | +3 | WIN | +0.80u |
| 2026-04-19 | NBA | ML | Magic | 4.5 | LOCKED | NEAR_START | — | 5/1 | +4 | WIN | +3.15u |
| 2026-04-20 | MLB | ML | Cleveland Guardians | 2.5 | LOCKED | NEAR_START | STRONG | 2/0 | +2 | LOSS | -1.00u |
| 2026-04-20 | MLB | ML | Athletics | 2.5 | LOCKED | CLEAR_MOVE | STANDARD | 2/0 | +2 | WIN | +1.26u |
| 2026-04-20 | NBA | ML | Raptors | 3.5 | LOCKED | NEAR_START | LEAN | 4/1 | +3 | LOSS | -0.50u |
| 2026-04-21 | MLB | ML | Minnesota Twins | 3 | LOCKED | NEAR_START | STRONG | 3/0 | +3 | WIN | +2.10u |
| 2026-04-21 | MLB | ML | Miami Marlins | 3 | LOCKED | NEAR_START | LEAN | 2/0 | +2 | LOSS | -1.25u |
| 2026-04-21 | NBA | ML | Trail Blazers | 3.5 | LOCKED | NEAR_START | MUTE | 3/0 | +3 | WIN | +2.38u |
| 2026-04-21 | NHL | ML | Bruins | 3 | LOCKED | NEAR_START | LEAN | 3/0 | +3 | WIN | +1.05u |
| 2026-04-21 | NBA | SPREAD | Trail Blazers | 4.5 | LOCKED | NEAR_START | STRONG | 2/0 | +2 | WIN | +1.75u |
| 2026-04-21 | MLB | TOTAL | Under 8.5 | 3 | LOCKED | NEAR_START | STRONG | 2/0 | +2 | LOSS | -1.00u |

## Every FADE pick (Δ ≤ −1)

| Date | Sport | Market | Pick | ★ | Stage | Regime | Tier | forW / agW | Δ | Outcome | Profit |
|---|---|---|---|---:|---|---|---|---|---:|---|---:|
| 2026-04-19 | NBA | ML | Spurs | 3 | LOCKED | CLEAR_MOVE | — | 2/3 | -1 | WIN | +0.09u |
| 2026-04-20 | NBA | ML | Knicks | 3 | LOCKED | NEAR_START | LEAN | 2/3 | -1 | LOSS | -1.00u |
| 2026-04-20 | NBA | ML | Nuggets | 3 | LOCKED | NEAR_START | STRONG | 0/1 | -1 | LOSS | -1.00u |
| 2026-04-20 | NBA | SPREAD | Nuggets | 3 | LOCKED | NEAR_START | STRONG | 0/1 | -1 | LOSS | -0.75u |
| 2026-04-20 | MLB | TOTAL | Over 7.5 | 2.5 | LOCKED | NEAR_START | LEAN | 0/1 | -1 | WIN | +0.53u |
| 2026-04-21 | MLB | ML | Seattle Mariners | 2.5 | LOCKED | NEAR_START | STANDARD | 0/1 | -1 | LOSS | -0.75u |
| 2026-04-21 | NBA | ML | Celtics | 4 | LOCKED | SMALL_MOVE | STRONG | 0/3 | -3 | LOSS | -0.50u |
| 2026-04-21 | NBA | SPREAD | Celtics | 4.5 | LOCKED | NO_MOVE | STANDARD | 0/1 | -1 | LOSS | -1.50u |

