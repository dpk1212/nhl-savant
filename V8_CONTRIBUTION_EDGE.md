# V8 Contribution-Edge Map

_Generated 2026-06-01T18:23:56.003Z_

N = 701 picks (LOCKED=494, SHADOW=207)
Baseline: WR 50.2% · flat ROI -3.5% · units-wtd ROI -3.1%

> Per-wallet signal: `contribution = walletBase × convictionMult` (quality × size, already stored in walletDetails).

## A. Count of `contribution ≥ T` on pick side (H1)

Hypothesis: more high-contribution sharps on side ⇒ higher WR / ROI.


#### Threshold T = 30   |   ρ(qFor, won) = -0.061   ρ(qFor, flat ROI) = -0.003

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 54 | 55.6% | +0.0% | +2.9% |
| qFor ≥ 1 | 250 | 54.0% | +1.1% | +4.1% |
| qFor ≥ 2 | 182 | 45.6% | -11.9% | -10.4% |
| qFor ≥ 3+ | 215 | 48.4% | -2.6% | -4.5% |

#### Threshold T = 40   |   ρ(qFor, won) = -0.073   ρ(qFor, flat ROI) = -0.016

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 107 | 55.1% | +0.9% | +0.2% |
| qFor ≥ 1 | 277 | 53.8% | +1.2% | +6.1% |
| qFor ≥ 2 | 160 | 43.8% | -11.2% | -10.2% |
| qFor ≥ 3+ | 157 | 47.1% | -6.9% | -9.6% |

#### Threshold T = 50   |   ρ(qFor, won) = 0.002   ρ(qFor, flat ROI) = 0.018

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 177 | 54.8% | +1.4% | -3.6% |
| qFor ≥ 1 | 311 | 50.8% | -3.2% | +4.8% |
| qFor ≥ 2 | 126 | 42.9% | -10.1% | -15.0% |
| qFor ≥ 3+ | 87 | 49.4% | -4.8% | -6.5% |

#### Threshold T = 60   |   ρ(qFor, won) = 0.073   ρ(qFor, flat ROI) = 0.061

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 303 | 52.1% | -2.7% | -5.5% |
| qFor ≥ 1 | 269 | 50.2% | -1.0% | +5.6% |
| qFor ≥ 2 | 75 | 48.0% | -8.0% | -11.7% |
| qFor ≥ 3+ | 54 | 42.6% | -14.1% | -16.0% |

#### Threshold T = 70   |   ρ(qFor, won) = 0.152   ρ(qFor, flat ROI) = 0.095

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 414 | 51.7% | -3.2% | -1.3% |
| qFor ≥ 1 | 212 | 49.1% | -1.6% | +0.6% |
| qFor ≥ 2 | 52 | 48.1% | -10.0% | -14.7% |
| qFor ≥ 3+ | 23 | 39.1% | -12.2% | -21.4% |

## B. Margin `contribution ≥ T` (qFor − qAgainst) (H2)

Hypothesis: positive margin of high-contribution sharps ⇒ edge.


#### Threshold T = 30   |   ρ(margin, won) = 0.040   ρ(margin, flat ROI) = 0.048

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 151 | 53.0% | +2.1% | -8.6% |
| margin +1 | 288 | 48.3% | -9.2% | -3.2% |
| margin +2 | 143 | 53.8% | +4.2% | +5.4% |
| margin ≥ +3 | 119 | 47.1% | -6.0% | -7.2% |

#### Threshold T = 40   |   ρ(margin, won) = -0.011   ρ(margin, flat ROI) = -0.009

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 205 | 55.1% | +7.3% | +3.9% |
| margin +1 | 278 | 51.4% | -2.2% | +4.7% |
| margin +2 | 135 | 43.7% | -15.5% | -9.7% |
| margin ≥ +3 | 83 | 44.6% | -15.1% | -20.2% |

#### Threshold T = 50   |   ρ(margin, won) = 0.030   ρ(margin, flat ROI) = -0.002

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 256 | 55.5% | +8.5% | +3.2% |
| margin +1 | 302 | 49.3% | -5.9% | -0.7% |
| margin +2 | 95 | 40.0% | -24.2% | -16.3% |
| margin ≥ +3 | 48 | 47.9% | -11.5% | -8.5% |

#### Threshold T = 60   |   ρ(margin, won) = 0.078   ρ(margin, flat ROI) = 0.023

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 368 | 54.1% | +4.9% | +0.5% |
| margin +1 | 252 | 46.4% | -11.5% | -2.0% |
| margin +2 | 56 | 42.9% | -18.6% | -18.8% |
| margin ≥ +3 | 25 | 48.0% | -11.8% | -7.7% |

#### Threshold T = 70   |   ρ(margin, won) = 0.165   ρ(margin, flat ROI) = 0.067

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 471 | 52.0% | +0.6% | +1.9% |
| margin +1 | 179 | 46.4% | -12.0% | -9.6% |
| margin +2 | 38 | 47.4% | -12.4% | -17.5% |
| margin ≥ +3 | 13 | 46.2% | -9.3% | +3.2% |

## C. Count × Margin grid at T = 50

Rows = # qFor (contrib ≥ 50) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 50

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 150 / 54.0% / -0.3% | 23 / 56.5% / +7.0% | 4 / 75.0% / +30.6% | — | — | — | — | — |
| 1 | 254 / 49.6% / -6.3% | 47 / 55.3% / +7.4% | 7 / 42.9% / -12.4% | 2 / 100.0% / +135.0% | — | 1 / 100.0% / +82.0% | — | — |
| 2 | 74 / 37.8% / -27.9% | 39 / 43.6% / -15.1% | 8 / 87.5% / +145.2% | 3 / 66.7% / +139.8% | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% | — |
| 3 | 15 / 60.0% / +13.6% | 14 / 64.3% / +15.5% | 7 / 57.1% / +45.1% | 2 / 100.0% / +121.2% | 1 / 0.0% / -100.0% | 1 / 100.0% / +45.9% | — | — |
| 4 | 5 / 60.0% / +17.1% | 5 / 0.0% / -100.0% | 5 / 20.0% / -51.0% | 2 / 100.0% / +58.6% | 3 / 33.3% / -15.3% | — | — | — |
| 5 | 3 / 66.7% / -18.5% | 9 / 44.4% / -22.7% | 6 / 16.7% / -70.0% | 2 / 0.0% / -100.0% | — | — | 1 / 0.0% / -100.0% | — |
| 6 | 1 / 0.0% / -100.0% | 1 / 100.0% / +90.9% | 2 / 100.0% / +118.7% | 1 / 100.0% / +110.0% | — | — | — | 1 / 0.0% / -100.0% |

## C. Count × Margin grid at T = 40

Rows = # qFor (contrib ≥ 40) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 40

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 85 / 54.1% / -0.8% | 18 / 50.0% / -7.1% | 4 / 100.0% / +71.8% | — | — | — | — | — | — |
| 1 | 207 / 51.2% / -4.2% | 57 / 66.7% / +26.0% | 8 / 25.0% / -52.1% | 4 / 50.0% / +17.5% | — | 1 / 100.0% / +82.0% | — | — | — |
| 2 | 93 / 41.9% / -20.2% | 55 / 47.3% / -5.9% | 10 / 40.0% / +41.6% | 2 / 50.0% / -1.9% | — | — | — | — | — |
| 3 | 37 / 45.9% / -11.7% | 32 / 46.9% / -7.1% | 7 / 85.7% / +65.3% | 6 / 50.0% / +39.7% | 1 / 0.0% / -100.0% | 3 / 33.3% / -51.4% | 1 / 0.0% / -100.0% | — | — |
| 4 | 7 / 14.3% / -73.2% | 8 / 37.5% / -35.4% | 5 / 60.0% / +17.0% | 5 / 60.0% / +44.6% | 2 / 100.0% / +99.2% | 1 / 0.0% / -100.0% | — | — | 1 / 0.0% / -100.0% |
| 5 | 6 / 83.3% / +38.3% | 7 / 28.6% / -45.7% | 5 / 40.0% / +3.0% | 5 / 40.0% / -12.8% | 2 / 50.0% / -10.0% | — | — | — | — |
| 6 | 1 / 100.0% / +26.7% | 2 / 100.0% / +90.9% | 3 / 0.0% / -100.0% | 3 / 66.7% / +12.5% | — | 1 / 100.0% / +26.3% | — | — | 1 / 0.0% / -100.0% |
| 7 | 1 / 0.0% / -100.0% | 1 / 100.0% / +95.2% | 2 / 50.0% / +55.0% | — | — | — | 1 / 0.0% / -100.0% | — | — |

## D. Continuous Δcontribution (sumContrib_F − sumContrib_A) terciles

No threshold. Sort all picks by Δ and cut into thirds.

ρ(Δcontribution, won) = -0.131   |   ρ(Δcontribution, flat ROI) = -0.071


#### Terciles

| Bucket | N | mean Δ | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- | --- |
| Low  (Δ ≤ 51.6) | 233 | 6.0 | 58.4% | +11.1% | +6.2% |
| Mid  (51.7 .. 105.5) | 234 | 76.1 | 45.3% | -11.0% | -4.7% |
| High (Δ ≥ 105.7) | 234 | 175.0 | 47.0% | -10.6% | -6.4% |

#### Absolute Δcontribution cuts

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| Δ ≤ 0 (opposition matched/led) | 66 | 59.1% | +22.1% | +4.7% |
| 0 < Δ ≤ 50 | 150 | 58.7% | +8.0% | +8.8% |
| 50 < Δ ≤ 100 | 230 | 45.7% | -10.8% | -4.9% |
| Δ > 100 | 255 | 47.1% | -10.3% | -6.7% |

## E. Proposed sizing tiers (derived from §A/B/C)

Rules (all use `contribution ≥ 50` wallet count):
- **STRONG**  : qFor ≥ 3 AND qAgainst = 0  **OR**  qFor ≥ 2 AND margin ≥ +1
- **STANDARD**: qFor ≥ 1 AND margin ≥ +1 AND maxContrib_F ≥ 50
- **LEAN**    : qFor ≥ 1 AND margin ≥ 0
- **MUTE**    : margin < 0


#### Tier performance on current V8 sample

| Tier | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| STRONG | 191 | 44.0% | -15.8% | -12.5% |
| STANDARD | 254 | 49.6% | -6.3% | +1.2% |
| LEAN | 210 | 55.7% | +7.9% | +9.6% |
| MUTE | 46 | 54.3% | +11.2% | -27.9% |

#### Current V8 ★/units assigned within each proposed tier

| Tier | N | mean ★ | mean units |
| --- | --- | --- | --- |
| STRONG | 191 | 3.99 | 1.80 |
| STANDARD | 254 | 3.46 | 1.30 |
| LEAN | 210 | 3.21 | 1.09 |
| MUTE | 46 | 2.59 | 1.02 |

## F. Every V8 pick tagged with proposed tier


#### Row-level detail

| Date | Sport | Mkt | Side | ★ | Units | Odds | qFor₅₀ | qAg₅₀ | mgn₅₀ | Δcontrib | Tier | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-04-18 | MLB | ML | home | 4.5 | 3 | -150 | 1 | 0 | 1 | 152.2 | STANDARD | WIN |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.5 | +105 | 3 | 0 | 3 | 203.7 | STRONG | WIN |
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.5 | -108 | 1 | 1 | 0 | 6.2 | LEAN | LOSS |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1 | -108 | 2 | 0 | 2 | 207.3 | STRONG | LOSS |
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.5 | +105 | 2 | 1 | 1 | 53.5 | STRONG | WIN |
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.5 | -117 | 1 | 0 | 1 | 137.7 | STANDARD | LOSS |
| 2026-04-18 | NBA | TOTAL | over | 3 | 0.75 | -107 | 2 | 0 | 2 | 202.6 | STRONG | LOSS |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 2 | 0 | 2 | 184.7 | STRONG | WIN |
| 2026-04-19 | MLB | ML | home | 3 | 0.5 | -150 | 0 | 0 | 0 | 106.0 | LEAN | WIN |
| 2026-04-19 | MLB | ML | home | 4 | 2 | -106 | 4 | 0 | 4 | 296.7 | STRONG | WIN |
| 2026-04-19 | MLB | ML | home | 3 | 1 | -125 | 1 | 0 | 1 | 128.0 | STANDARD | WIN |
| 2026-04-19 | MLB | ML | away | 3 | 1 | -145 | 1 | 0 | 1 | 124.3 | STANDARD | LOSS |
| 2026-04-19 | MLB | ML | away | 2.5 | 1 | +100 | 0 | 0 | 0 | 49.0 | LEAN | LOSS |
| 2026-04-19 | NBA | ML | away | 4.5 | 1 | +295 | 3 | 2 | 1 | 299.3 | STRONG | WIN |
| 2026-04-19 | NBA | ML | home | 3 | 0.5 | -535 | 3 | 1 | 2 | 47.6 | STRONG | WIN |
| 2026-04-19 | NHL | ML | away | 2.5 | 0 | +146 | 0 | 0 | 0 | 3.0 | LEAN | LOSS |
| 2026-04-19 | NHL | ML | home | 2.5 | 0.5 | -185 | 0 | 0 | 0 | 12.9 | LEAN | LOSS |
| 2026-04-19 | NBA | SPREAD | home | 5 | 2 | -110 | 6 | 0 | 6 | 476.2 | STRONG | LOSS |
| 2026-04-20 | MLB | ML | home | 2.5 | 1 | -130 | 2 | 0 | 2 | 104.6 | STRONG | LOSS |
| 2026-04-20 | MLB | ML | away | 2.5 | 1 | +126 | 1 | 0 | 1 | 98.0 | STANDARD | WIN |
| 2026-04-20 | NBA | ML | home | 3 | 1 | -235 | 4 | 4 | 0 | -140.3 | LEAN | LOSS |
| 2026-04-20 | NBA | ML | home | 3 | 1 | -285 | 2 | 0 | 2 | 157.2 | STRONG | LOSS |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.5 | +360 | 1 | 1 | 0 | 131.9 | LEAN | LOSS |
| 2026-04-20 | NHL | ML | away | 4 | 1.5 | +146 | 2 | 1 | 1 | 191.3 | STRONG | LOSS |
| 2026-04-20 | NHL | ML | home | 2.5 | 1 | -134 | 2 | 0 | 2 | 71.7 | STRONG | WIN |
| 2026-04-20 | NHL | ML | home | 2.5 | 0.5 | -146 | 1 | 0 | 1 | 77.2 | STANDARD | WIN |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2 | -102 | 4 | 0 | 4 | 320.3 | STRONG | LOSS |
| 2026-04-20 | NBA | SPREAD | home | 3 | 0.75 | -105 | 2 | 1 | 1 | 21.2 | STRONG | LOSS |
| 2026-04-20 | NBA | SPREAD | home | 3 | 0.75 | -110 | 1 | 0 | 1 | 108.7 | STANDARD | WIN |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.5 | +106 | 1 | 1 | 0 | 58.4 | LEAN | WIN |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.5 | +104 | 1 | 0 | 1 | 86.2 | STANDARD | WIN |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.5 | -102 | 1 | 0 | 1 | 111.9 | STANDARD | WIN |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.5 | -115 | 1 | 1 | 0 | 77.3 | LEAN | WIN |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.5 | -108 | 2 | 1 | 1 | 73.1 | STRONG | LOSS |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.5 | -133 | 1 | 0 | 1 | 89.1 | STANDARD | WIN |
| 2026-04-21 | MLB | ML | away | 3 | 1.5 | +140 | 2 | 0 | 2 | 114.5 | STRONG | WIN |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | 1 | 0 | 1 | 99.1 | STANDARD | LOSS |
| 2026-04-21 | MLB | ML | away | 3 | 1.5 | +100 | 1 | 0 | 1 | 134.6 | STANDARD | LOSS |
| 2026-04-21 | MLB | ML | home | 3 | 1.25 | -116 | 0 | 0 | 0 | 120.4 | LEAN | LOSS |
| 2026-04-21 | NBA | ML | away | 5 | 3 | -192 | 1 | 0 | 1 | 95.7 | STANDARD | LOSS |
| 2026-04-21 | NBA | ML | home | 4 | 0.5 | -850 | 5 | 1 | 4 | 243.2 | STRONG | LOSS |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.5 | +475 | 2 | 3 | -1 | 70.0 | MUTE | WIN |
| 2026-04-21 | NHL | ML | away | 3 | 0.75 | +145 | 2 | 2 | 0 | 82.1 | LEAN | WIN |
| 2026-04-21 | NHL | ML | home | 2.5 | 1 | -184 | 1 | 0 | 1 | 51.6 | STANDARD | WIN |
| 2026-04-21 | NHL | ML | away | 3 | 0 | +135 | 0 | 0 | 0 | 107.8 | LEAN | WIN |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 4 | 2 | 2 | 91.3 | STRONG | LOSS |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.5 | -110 | 1 | 0 | 1 | 66.3 | STANDARD | LOSS |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2 | -110 | 6 | 1 | 5 | 368.8 | STRONG | WIN |
| 2026-04-21 | MLB | TOTAL | under | 3 | 1 | -103 | 2 | 0 | 2 | 135.5 | STRONG | LOSS |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 1 | 0 | 1 | 107.1 | STANDARD | LOSS |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.5 | -108 | 2 | 1 | 1 | 184.4 | STRONG | LOSS |
| 2026-04-21 | NBA | TOTAL | over | 4 | 1.75 | -102 | 4 | 0 | 4 | 312.1 | STRONG | LOSS |
| 2026-04-22 | MLB | ML | home | 2.5 | 0.5 | -152 | 2 | 1 | 1 | 70.3 | STRONG | LOSS |
| 2026-04-22 | MLB | ML | away | 2.5 | 1 | -207 | 2 | 0 | 2 | 123.3 | STRONG | LOSS |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.1 | +130 | 1 | 0 | 1 | 66.7 | STANDARD | LOSS |
| 2026-04-22 | NBA | ML | home | 5 | 3 | -375 | 5 | 0 | 5 | 455.4 | STRONG | WIN |
| 2026-04-22 | NBA | ML | home | 3.5 | 1 | -2100 | 2 | 2 | 0 | 116.9 | LEAN | WIN |
| 2026-04-22 | NHL | ML | home | 3 | 0.5 | -188 | 1 | 0 | 1 | 75.2 | STANDARD | LOSS |
| 2026-04-22 | NHL | ML | away | 3.5 | 1 | +110 | 1 | 1 | 0 | 164.8 | LEAN | WIN |
| 2026-04-22 | MLB | SPREAD | home | 2.5 | 0.5 | +105 | 0 | 0 | 0 | 87.9 | LEAN | WIN |
| 2026-04-22 | NBA | SPREAD | home | 4 | 2 | -114 | 3 | 0 | 3 | 310.6 | STRONG | WIN |
| 2026-04-22 | NBA | SPREAD | home | 4 | 1.5 | -108 | 5 | 1 | 4 | 232.7 | STRONG | LOSS |
| 2026-04-22 | NBA | TOTAL | over | 3 | 0.5 | -115 | 2 | 1 | 1 | 134.1 | STRONG | WIN |
| 2026-04-23 | MLB | ML | home | 3 | 1 | -155 | 2 | 0 | 2 | 161.7 | STRONG | LOSS |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.6 | +130 | 3 | 0 | 3 | 211.1 | STRONG | WIN |
| 2026-04-23 | NBA | ML | home | 4 | 2.5 | +110 | 6 | 3 | 3 | 183.0 | STRONG | WIN |
| 2026-04-23 | NBA | ML | home | 3 | 1.85 | -104 | 3 | 1 | 2 | 114.3 | STRONG | WIN |
| 2026-04-23 | NHL | ML | home | 2 | 1.1 | -115 | 0 | 0 | 0 | 47.1 | LEAN | LOSS |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 1 | 2 | -1 | -1.8 | MUTE | LOSS |
| 2026-04-23 | NBA | SPREAD | away | 3 | 1.6 | -104 | 2 | 0 | 2 | 126.1 | STRONG | LOSS |
| 2026-04-23 | MLB | TOTAL | under | 3 | 1.75 | -110 | 2 | 1 | 1 | 108.0 | STRONG | LOSS |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2 | -104 | 4 | 0 | 4 | 354.5 | STRONG | WIN |
| 2026-04-23 | NBA | TOTAL | over | 2.5 | 1.1 | -107 | 1 | 0 | 1 | 70.2 | STANDARD | LOSS |
| 2026-04-23 | NBA | TOTAL | under | 4 | 1.85 | -102 | 3 | 1 | 2 | 265.2 | STRONG | LOSS |
| 2026-04-24 | MLB | ML | home | 2.5 | 1.5 | -160 | 2 | 0 | 2 | 123.6 | STRONG | LOSS |
| 2026-04-24 | MLB | ML | home | 2.5 | 0.5 | -207 | 1 | 0 | 1 | 53.8 | STANDARD | LOSS |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 2 | 0 | 2 | 123.2 | STRONG | WIN |
| 2026-04-24 | MLB | ML | away | 2.5 | 0.5 | -145 | 1 | 0 | 1 | 61.7 | STANDARD | WIN |
| 2026-04-24 | NBA | ML | away | 5 | 3 | -295 | 3 | 1 | 2 | 182.4 | STRONG | WIN |
| 2026-04-24 | NBA | ML | home | 5 | 2 | +120 | 4 | 1 | 3 | 270.1 | STRONG | LOSS |
| 2026-04-24 | NHL | ML | home | 3.5 | 0.75 | +120 | 2 | 0 | 2 | 91.1 | STRONG | WIN |
| 2026-04-24 | NHL | ML | home | 5 | 3 | +102 | 2 | 0 | 2 | 72.5 | STRONG | WIN |
| 2026-04-24 | NHL | ML | away | 3.5 | 0.75 | -110 | 0 | 0 | 0 | 7.5 | LEAN | LOSS |
| 2026-04-24 | NBA | SPREAD | away | 5 | 2 | -110 | 4 | 3 | 1 | 7.7 | STRONG | WIN |
| 2026-04-24 | NBA | SPREAD | home | 4 | 1.85 | -110 | 4 | 2 | 2 | 216.0 | STRONG | LOSS |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.5 | -111 | 1 | 0 | 1 | 54.5 | STANDARD | WIN |
| 2026-04-25 | MLB | ML | away | 2.5 | 0 | +108 | 1 | 0 | 1 | 113.3 | STANDARD | WIN |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 2 | 0 | 2 | 85.6 | STRONG | LOSS |
| 2026-04-25 | MLB | ML | away | 2.5 | 0.5 | +116 | 2 | 1 | 1 | 100.2 | STRONG | WIN |
| 2026-04-25 | MLB | ML | home | 4 | 1.25 | +128 | 2 | 0 | 2 | 169.3 | STRONG | LOSS |
| 2026-04-25 | MLB | ML | home | 2.5 | 0.5 | -140 | 1 | 0 | 1 | 75.7 | STANDARD | LOSS |
| 2026-04-25 | NBA | ML | away | 5 | 3 | -118 | 2 | 2 | 0 | 92.9 | LEAN | LOSS |
| 2026-04-25 | NBA | ML | home | 5 | 2 | +125 | 1 | 1 | 0 | 72.3 | LEAN | WIN |
| 2026-04-25 | NBA | ML | away | 4 | 1.25 | -130 | 3 | 0 | 3 | 280.3 | STRONG | WIN |
| 2026-04-25 | NBA | ML | home | 5 | 0.5 | +370 | 0 | 1 | -1 | 6.1 | MUTE | LOSS |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | -125 | 0 | 0 | 0 | 76.1 | LEAN | WIN |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 1 | 0 | 1 | 146.3 | STANDARD | LOSS |
| 2026-04-25 | NHL | ML | home | 5 | 3 | -120 | 5 | 2 | 3 | 244.8 | STRONG | LOSS |
| 2026-04-25 | NBA | SPREAD | home | 2.5 | 0.5 | -110 | 1 | 0 | 1 | 113.4 | STANDARD | WIN |
| 2026-04-25 | NBA | SPREAD | home | 5 | 2 | -105 | 5 | 2 | 3 | 177.3 | STRONG | LOSS |
| 2026-04-25 | MLB | TOTAL | under | 3 | 0.5 | +109 | 0 | 1 | -1 | -33.3 | MUTE | LOSS |
| 2026-04-25 | NBA | TOTAL | over | 2.5 | 0.5 | -108 | 2 | 1 | 1 | 64.0 | STRONG | LOSS |
| 2026-04-25 | NBA | TOTAL | over | 2.5 | 0.5 | -103 | 0 | 0 | 0 | 42.7 | LEAN | WIN |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 0 | 0 | 0 | 71.0 | LEAN | LOSS |
| 2026-04-26 | MLB | ML | home | 2.5 | 0.5 | -205 | 2 | 1 | 1 | 18.6 | STRONG | LOSS |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 1 | 0 | 1 | 86.3 | STANDARD | LOSS |
| 2026-04-26 | MLB | ML | away | 5 | 2 | +100 | 2 | 0 | 2 | 85.3 | STRONG | LOSS |
| 2026-04-26 | MLB | ML | away | 3 | 0 | +110 | 0 | 0 | 0 | -17.8 | LEAN | LOSS |
| 2026-04-26 | MLB | ML | away | 3 | 0 | +185 | 2 | 1 | 1 | 60.5 | STRONG | LOSS |
| 2026-04-26 | MLB | ML | away | 3 | 0.5 | +105 | 0 | 0 | 0 | 29.2 | LEAN | LOSS |
| 2026-04-26 | MLB | ML | home | 2.5 | 0.5 | +114 | 0 | 0 | 0 | 30.2 | LEAN | WIN |
| 2026-04-26 | MLB | ML | away | 2.5 | 0.5 | -130 | 1 | 0 | 1 | 54.8 | STANDARD | WIN |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +102 | 1 | 0 | 1 | 49.4 | STANDARD | WIN |
| 2026-04-26 | NBA | ML | away | 5 | 3 | -290 | 2 | 0 | 2 | 157.9 | STRONG | WIN |
| 2026-04-26 | NBA | ML | away | 5 | 3 | -158 | 2 | 0 | 2 | 199.4 | STRONG | LOSS |
| 2026-04-26 | NBA | ML | away | 5 | 2 | +156 | 3 | 2 | 1 | 133.0 | STRONG | LOSS |
| 2026-04-26 | NBA | ML | away | 5 | 3 | -215 | 1 | 0 | 1 | 131.4 | STANDARD | WIN |
| 2026-04-26 | NHL | ML | home | 3.5 | 0.75 | -108 | 1 | 0 | 1 | 125.4 | STANDARD | LOSS |
| 2026-04-26 | NHL | ML | away | 3 | 0.5 | -115 | 1 | 0 | 1 | 132.5 | STANDARD | WIN |
| 2026-04-26 | MLB | SPREAD | away | 4 | 0.75 | -120 | 1 | 0 | 1 | 161.5 | STANDARD | LOSS |
| 2026-04-26 | NBA | SPREAD | away | 3.5 | 0.5 | -105 | 1 | 0 | 1 | 106.8 | STANDARD | WIN |
| 2026-04-26 | NBA | SPREAD | home | 3.5 | 0.5 | -102 | 2 | 1 | 1 | 102.6 | STRONG | WIN |
| 2026-04-26 | NBA | SPREAD | home | 4 | 0.75 | -110 | 3 | 1 | 2 | 288.8 | STRONG | WIN |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.5 | -116 | 1 | 1 | 0 | 66.3 | LEAN | LOSS |
| 2026-04-26 | MLB | TOTAL | under | 2.5 | 0.5 | +106 | 2 | 1 | 1 | 32.5 | STRONG | WIN |
| 2026-04-26 | MLB | TOTAL | over | 4 | 0.75 | -102 | 1 | 0 | 1 | 159.6 | STANDARD | WIN |
| 2026-04-26 | NBA | TOTAL | over | 4 | 0.75 | -101 | 3 | 1 | 2 | 235.2 | STRONG | WIN |
| 2026-04-26 | NBA | TOTAL | under | 5 | 2 | -110 | 1 | 1 | 0 | 0.6 | LEAN | WIN |
| 2026-04-26 | NBA | TOTAL | under | 3.5 | 0.5 | -111 | 2 | 0 | 2 | 128.8 | STRONG | LOSS |
| 2026-04-26 | NBA | TOTAL | under | 3.5 | 0.5 | -113 | 1 | 0 | 1 | 86.2 | STANDARD | WIN |
| 2026-04-27 | MLB | ML | away | 2.5 | 0.5 | +100 | 1 | 0 | 1 | 63.2 | STANDARD | LOSS |
| 2026-04-27 | MLB | ML | home | 2.5 | 0.5 | +100 | 1 | 0 | 1 | 97.1 | STANDARD | WIN |
| 2026-04-27 | MLB | ML | home | 5 | 2 | +140 | 2 | 0 | 2 | 245.4 | STRONG | LOSS |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | -130 | 1 | 1 | 0 | 74.9 | LEAN | LOSS |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 2 | 0 | 2 | 143.2 | STRONG | WIN |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +119 | 2 | 1 | 1 | 67.4 | STRONG | WIN |
| 2026-04-27 | NBA | ML | home | 5 | 2 | +130 | 1 | 2 | -1 | 60.7 | MUTE | WIN |
| 2026-04-27 | NBA | ML | home | 5 | 3 | -500 | 5 | 1 | 4 | 225.5 | STRONG | WIN |
| 2026-04-27 | NBA | ML | away | 4 | 1.25 | -500 | 2 | 1 | 1 | 171.3 | STRONG | WIN |
| 2026-04-27 | NHL | ML | home | 4 | 1.25 | -132 | 2 | 0 | 2 | 162.5 | STRONG | WIN |
| 2026-04-27 | NHL | ML | away | 5 | 3 | -120 | 3 | 0 | 3 | 148.2 | STRONG | WIN |
| 2026-04-27 | NBA | SPREAD | away | 4 | 0.75 | -114 | 5 | 2 | 3 | 236.7 | STRONG | LOSS |
| 2026-04-27 | NBA | SPREAD | home | 3.5 | 0.5 | -105 | 3 | 2 | 1 | 94.8 | STRONG | WIN |
| 2026-04-27 | NBA | SPREAD | away | 2.5 | 0.5 | -104 | 1 | 1 | 0 | 50.6 | LEAN | LOSS |
| 2026-04-27 | NBA | TOTAL | over | 5 | 2 | -104 | 2 | 1 | 1 | 130.1 | STRONG | LOSS |
| 2026-04-27 | NBA | TOTAL | over | 5 | 2 | -115 | 2 | 1 | 1 | 142.3 | STRONG | WIN |
| 2026-04-27 | NBA | TOTAL | under | 3.5 | 0.5 | -104 | 1 | 1 | 0 | 77.2 | LEAN | LOSS |
| 2026-04-27 | NHL | TOTAL | under | 3.5 | 0.5 | -119 | 1 | 0 | 1 | 104.0 | STANDARD | LOSS |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 1 | 0 | 1 | 104.8 | STANDARD | WIN |
| 2026-04-28 | MLB | ML | away | 5 | 3 | -102 | 0 | 0 | 0 | 45.0 | LEAN | LOSS |
| 2026-04-28 | MLB | ML | away | 3.5 | 0.75 | -118 | 1 | 0 | 1 | 106.7 | STANDARD | WIN |
| 2026-04-28 | MLB | ML | home | 5 | 3 | -124 | 1 | 0 | 1 | 71.9 | STANDARD | WIN |
| 2026-04-28 | MLB | ML | home | 3 | 0 | +112 | 1 | 0 | 1 | 16.8 | STANDARD | WIN |
| 2026-04-28 | MLB | ML | home | 5 | 2 | +102 | 2 | 0 | 2 | 167.0 | STRONG | LOSS |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 0 | 0 | 0 | 93.4 | LEAN | LOSS |
| 2026-04-28 | MLB | ML | away | 5 | 2 | +142 | 2 | 1 | 1 | 101.6 | STRONG | LOSS |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -152 | 1 | 0 | 1 | 92.1 | STANDARD | LOSS |
| 2026-04-28 | MLB | ML | away | 5 | 2 | +112 | 1 | 1 | 0 | 68.9 | LEAN | WIN |
| 2026-04-28 | NBA | ML | away | 5 | 0.5 | +215 | 4 | 2 | 2 | 87.1 | STRONG | LOSS |
| 2026-04-28 | NBA | ML | home | 4 | 1.25 | -550 | 1 | 0 | 1 | 144.9 | STANDARD | LOSS |
| 2026-04-28 | NBA | ML | home | 5 | 3 | -600 | 2 | 0 | 2 | 110.2 | STRONG | WIN |
| 2026-04-28 | NHL | ML | away | 4 | 0.5 | +135 | 3 | 4 | -1 | -61.6 | MUTE | LOSS |
| 2026-04-28 | NHL | ML | away | 5 | 2 | +142 | 1 | 0 | 1 | 41.2 | STANDARD | WIN |
| 2026-04-28 | NHL | ML | home | 2.5 | 0.5 | -126 | 0 | 0 | 0 | 49.7 | LEAN | LOSS |
| 2026-04-28 | NBA | SPREAD | away | 3.5 | 0.5 | -112 | 1 | 0 | 1 | 52.6 | STANDARD | LOSS |
| 2026-04-28 | NBA | SPREAD | away | 5 | 2 | -105 | 5 | 1 | 4 | 426.9 | STRONG | WIN |
| 2026-04-28 | NBA | SPREAD | away | 5 | 2 | -105 | 0 | 0 | 0 | 198.4 | LEAN | LOSS |
| 2026-04-28 | MLB | TOTAL | under | 3.5 | 0.5 | +102 | 1 | 0 | 1 | 118.2 | STANDARD | LOSS |
| 2026-04-28 | MLB | TOTAL | under | 3.5 | 0.5 | -114 | 0 | 1 | -1 | 19.7 | MUTE | LOSS |
| 2026-04-28 | NBA | TOTAL | under | 5 | 2 | -108 | 2 | 0 | 2 | 169.1 | STRONG | LOSS |
| 2026-04-28 | NBA | TOTAL | under | 2.5 | 0.5 | -106 | 2 | 0 | 2 | 75.6 | STRONG | WIN |
| 2026-04-28 | NBA | TOTAL | over | 3 | 0.5 | -108 | 1 | 0 | 1 | 151.3 | STANDARD | LOSS |
| 2026-04-28 | NHL | TOTAL | over | 3 | 0 | -102 | 0 | 0 | 0 | -22.1 | LEAN | LOSS |
| 2026-04-29 | MLB | ML | home | 2.5 | 0.5 | -125 | 1 | 0 | 1 | 49.2 | STANDARD | LOSS |
| 2026-04-29 | MLB | ML | home | 2.5 | 0.5 | -124 | 1 | 0 | 1 | 100.3 | STANDARD | WIN |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.5 | -108 | 1 | 0 | 1 | 134.1 | STANDARD | LOSS |
| 2026-04-29 | MLB | ML | away | 2.5 | 0.5 | +130 | 1 | 0 | 1 | 117.3 | STANDARD | WIN |
| 2026-04-29 | MLB | ML | away | 2.5 | 0.5 | -144 | 1 | 0 | 1 | 127.0 | STANDARD | LOSS |
| 2026-04-29 | MLB | ML | home | 3 | 0.5 | -115 | 0 | 0 | 0 | 140.3 | LEAN | WIN |
| 2026-04-29 | MLB | ML | away | 2.5 | 0.5 | -130 | 1 | 0 | 1 | 51.5 | STANDARD | WIN |
| 2026-04-29 | MLB | ML | away | 2.75 | 0.5 | +114 | 1 | 0 | 1 | -8.8 | STANDARD | WIN |
| 2026-04-29 | MLB | ML | home | 2.5 | 0.5 | -115 | 1 | 0 | 1 | 62.4 | STANDARD | WIN |
| 2026-04-29 | MLB | ML | home | 2.5 | 0.5 | -162 | 0 | 0 | 0 | 79.6 | LEAN | LOSS |
| 2026-04-29 | NBA | ML | away | 5 | 2 | +154 | 4 | 4 | 0 | -73.5 | LEAN | WIN |
| 2026-04-29 | NBA | ML | away | 5 | 0.5 | +320 | 1 | 0 | 1 | 72.6 | STANDARD | LOSS |
| 2026-04-29 | NBA | ML | home | 5 | 3 | -355 | 2 | 1 | 1 | 102.8 | STRONG | WIN |
| 2026-04-29 | NHL | ML | away | 5 | 2 | +145 | 0 | 1 | -1 | 18.6 | MUTE | WIN |
| 2026-04-29 | NHL | ML | away | 2.5 | 0.5 | +102 | 1 | 0 | 1 | 50.5 | STANDARD | LOSS |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.5 | -105 | 2 | 0 | 2 | 120.3 | STRONG | LOSS |
| 2026-04-29 | NBA | SPREAD | away | 3.5 | 0.5 | -115 | 1 | 0 | 1 | 99.9 | STANDARD | WIN |
| 2026-04-29 | NBA | SPREAD | home | 2.5 | 0.5 | -102 | 1 | 1 | 0 | 101.0 | LEAN | LOSS |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.5 | -117 | 2 | 1 | 1 | 124.5 | STRONG | LOSS |
| 2026-04-29 | NBA | TOTAL | over | 2.5 | 0.5 | -103 | 1 | 0 | 1 | 117.2 | STANDARD | LOSS |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.5 | -104 | 2 | 0 | 2 | 176.0 | STRONG | LOSS |
| 2026-04-29 | NBA | TOTAL | over | 5 | 2 | -112 | 5 | 1 | 4 | 337.8 | STRONG | WIN |
| 2026-04-29 | NHL | TOTAL | under | 2.5 | 0.5 | -117 | 0 | 0 | 0 | 73.5 | LEAN | WIN |
| 2026-04-30 | MLB | ML | away | 2.5 | 0.5 | -130 | 1 | 0 | 1 | 69.6 | STANDARD | LOSS |
| 2026-04-30 | NBA | ML | home | 4 | 1.5 | +198 | 3 | 3 | 0 | 100.0 | LEAN | WIN |
| 2026-04-30 | NBA | ML | away | 3 | 0.5 | -250 | 5 | 1 | 4 | 313.2 | STRONG | LOSS |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.5 | +110 | 1 | 1 | 0 | 98.9 | LEAN | LOSS |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 3 | 0 | 3 | 199.3 | STRONG | LOSS |
| 2026-04-30 | NBA | SPREAD | home | 2.75 | 0.5 | -110 | 2 | 1 | 1 | -1.7 | STRONG | WIN |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 5 | 3 | 2 | 170.6 | STRONG | LOSS |
| 2026-04-30 | MLB | TOTAL | under | 2.5 | 0.5 | -115 | 1 | 0 | 1 | 50.5 | STANDARD | WIN |
| 2026-04-30 | NBA | TOTAL | under | 4 | 1.13 | -106 | 2 | 0 | 2 | 241.7 | STRONG | WIN |
| 2026-04-30 | NBA | TOTAL | over | 2.5 | 0.5 | -109 | 1 | 0 | 1 | 68.1 | STANDARD | WIN |
| 2026-04-30 | NHL | TOTAL | under | 2.5 | 0.5 | +103 | 1 | 0 | 1 | 100.7 | STANDARD | LOSS |
| 2026-05-01 | MLB | ML | away | 3.5 | 0 | +129 | 2 | 0 | 2 | 124.4 | STRONG | LOSS |
| 2026-05-01 | MLB | ML | away | 2.5 | 0 | -184 | 1 | 0 | 1 | 50.6 | STANDARD | WIN |
| 2026-05-01 | MLB | ML | home | 2.5 | 0.5 | -135 | 1 | 0 | 1 | 43.9 | STANDARD | WIN |
| 2026-05-01 | MLB | ML | away | 3.5 | 0 | -110 | 1 | 0 | 1 | 87.1 | STANDARD | WIN |
| 2026-05-01 | MLB | ML | home | 3 | 0.5 | -145 | 1 | 0 | 1 | 142.4 | STANDARD | LOSS |
| 2026-05-01 | MLB | ML | away | 3 | 0.5 | -175 | 1 | 0 | 1 | 143.4 | STANDARD | LOSS |
| 2026-05-01 | MLB | ML | away | 2.75 | 0.5 | -154 | 0 | 1 | -1 | -70.7 | MUTE | WIN |
| 2026-05-01 | MLB | ML | home | 2.5 | 0.5 | -102 | 2 | 0 | 2 | 101.2 | STRONG | LOSS |
| 2026-05-01 | MLB | ML | home | 2.5 | 0.5 | -104 | 1 | 0 | 1 | 42.5 | STANDARD | LOSS |
| 2026-05-01 | NBA | ML | home | 5 | 3 | -180 | 5 | 6 | -1 | 41.0 | MUTE | LOSS |
| 2026-05-01 | NHL | ML | away | 3 | 0.5 | -122 | 0 | 0 | 0 | 165.9 | LEAN | WIN |
| 2026-05-01 | NHL | ML | away | 4 | 0.5 | -114 | 0 | 0 | 0 | 81.6 | LEAN | WIN |
| 2026-05-01 | NHL | ML | home | 3 | 0.5 | -105 | 1 | 0 | 1 | 192.7 | STANDARD | LOSS |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.5 | -115 | 1 | 0 | 1 | 69.6 | STANDARD | LOSS |
| 2026-05-01 | NBA | SPREAD | home | 5 | 2 | -108 | 4 | 1 | 3 | 220.3 | STRONG | LOSS |
| 2026-05-01 | MLB | TOTAL | under | 2.5 | 0.5 | -108 | 1 | 0 | 1 | 50.2 | STANDARD | LOSS |
| 2026-05-01 | MLB | TOTAL | under | 2.5 | 0.5 | +102 | 1 | 0 | 1 | 60.4 | STANDARD | LOSS |
| 2026-05-01 | MLB | TOTAL | under | 3.5 | 0 | -108 | 2 | 0 | 2 | 78.0 | STRONG | LOSS |
| 2026-05-01 | NBA | TOTAL | under | 2.75 | 0.5 | +100 | 1 | 1 | 0 | -11.3 | LEAN | LOSS |
| 2026-05-01 | NBA | TOTAL | under | 3.5 | 0.5 | +100 | 1 | 0 | 1 | 101.9 | STANDARD | WIN |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.5 | -110 | 1 | 0 | 1 | 51.9 | STANDARD | WIN |
| 2026-05-02 | MLB | ML | away | 4.5 | 3 | +140 | 3 | 0 | 3 | 252.8 | STRONG | LOSS |
| 2026-05-02 | MLB | ML | away | 2.5 | 0.5 | -219 | 2 | 1 | 1 | 153.1 | STRONG | WIN |
| 2026-05-02 | MLB | ML | away | 2.5 | 0.5 | +145 | 3 | 1 | 2 | 104.6 | STRONG | LOSS |
| 2026-05-02 | MLB | ML | home | 2.5 | 0.5 | -134 | 1 | 0 | 1 | 57.0 | STANDARD | WIN |
| 2026-05-02 | MLB | ML | home | 2.5 | 0.5 | -184 | 1 | 1 | 0 | 59.0 | LEAN | LOSS |
| 2026-05-02 | MLB | ML | away | 2.5 | 0.5 | -136 | 0 | 0 | 0 | 77.3 | LEAN | LOSS |
| 2026-05-02 | MLB | ML | home | 2.5 | 0.5 | +109 | 1 | 0 | 1 | 112.1 | STANDARD | WIN |
| 2026-05-02 | MLB | ML | home | 3 | 0.5 | -130 | 1 | 1 | 0 | 6.6 | LEAN | WIN |
| 2026-05-02 | MLB | ML | home | 2.5 | 0.5 | -102 | 1 | 1 | 0 | 36.9 | LEAN | WIN |
| 2026-05-02 | MLB | ML | away | 3.5 | 0.5 | +115 | 2 | 0 | 2 | 132.3 | STRONG | LOSS |
| 2026-05-02 | MLB | ML | away | 3 | 0.5 | -134 | 0 | 0 | 0 | 121.1 | LEAN | WIN |
| 2026-05-02 | NBA | ML | away | 5 | 3 | +210 | 6 | 2 | 4 | 421.4 | STRONG | WIN |
| 2026-05-02 | NHL | ML | away | 4.5 | 0.5 | +205 | 1 | 0 | 1 | 134.7 | STANDARD | LOSS |
| 2026-05-02 | NHL | SPREAD | home | 3.5 | 0.5 | +112 | 0 | 0 | 0 | 75.8 | LEAN | WIN |
| 2026-05-02 | NBA | TOTAL | over | 4 | 1.13 | -109 | 3 | 1 | 2 | 115.1 | STRONG | WIN |
| 2026-05-02 | NHL | TOTAL | over | 3.5 | 0.5 | -101 | 2 | 0 | 2 | 136.9 | STRONG | LOSS |
| 2026-05-03 | MLB | ML | away | 3.5 | 0.5 | +250 | 2 | 0 | 2 | 116.3 | STRONG | LOSS |
| 2026-05-03 | MLB | ML | home | 2.5 | 0.5 | -120 | 0 | 0 | 0 | 43.5 | LEAN | WIN |
| 2026-05-03 | MLB | ML | home | 2.5 | 0 | +109 | 1 | 0 | 1 | 96.8 | STANDARD | WIN |
| 2026-05-03 | MLB | ML | home | 2.5 | 0 | -162 | 0 | 0 | 0 | 64.1 | LEAN | WIN |
| 2026-05-03 | MLB | ML | home | 2.5 | 0.5 | +120 | 1 | 0 | 1 | 50.3 | STANDARD | LOSS |
| 2026-05-03 | MLB | ML | away | 2.75 | 0.75 | -130 | 1 | 0 | 1 | 45.2 | STANDARD | WIN |
| 2026-05-03 | MLB | ML | away | 2.5 | 0.5 | -140 | 1 | 1 | 0 | 20.6 | LEAN | WIN |
| 2026-05-03 | NBA | ML | away | 4 | 0.75 | +310 | 1 | 1 | 0 | 168.4 | LEAN | LOSS |
| 2026-05-03 | NBA | ML | away | 4 | 0.75 | +260 | 3 | 0 | 3 | 197.8 | STRONG | LOSS |
| 2026-05-03 | NHL | ML | away | 2.5 | 0.5 | +140 | 1 | 1 | 0 | 48.1 | LEAN | WIN |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | 1 | 0 | 1 | 92.5 | STANDARD | WIN |
| 2026-05-03 | NBA | SPREAD | home | 2.75 | 0.75 | -104 | 1 | 1 | 0 | 35.5 | LEAN | WIN |
| 2026-05-03 | MLB | TOTAL | under | 2.5 | 0 | +100 | 1 | 0 | 1 | 87.2 | STANDARD | LOSS |
| 2026-05-03 | MLB | TOTAL | over | 2.5 | 0 | -104 | 1 | 0 | 1 | 62.9 | STANDARD | LOSS |
| 2026-05-03 | MLB | TOTAL | over | 2.5 | 0 | -113 | 0 | 0 | 0 | 57.9 | LEAN | LOSS |
| 2026-05-03 | NBA | TOTAL | under | 2.25 | 0.75 | -113 | 1 | 1 | 0 | 19.5 | LEAN | LOSS |
| 2026-05-03 | NBA | TOTAL | over | 2.5 | 0 | -107 | 1 | 0 | 1 | 88.9 | STANDARD | WIN |
| 2026-05-04 | MLB | ML | away | 2.5 | 0.5 | +185 | 1 | 0 | 1 | 115.4 | STANDARD | LOSS |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | 1 | 1 | 0 | -18.1 | LEAN | LOSS |
| 2026-05-04 | MLB | ML | away | 2.5 | 0.5 | +104 | 1 | 0 | 1 | 74.7 | STANDARD | LOSS |
| 2026-05-04 | MLB | ML | home | 2.5 | 0 | +170 | 1 | 0 | 1 | 89.0 | STANDARD | LOSS |
| 2026-05-04 | MLB | ML | home | 2.5 | 0 | +110 | 0 | 0 | 0 | 38.3 | LEAN | WIN |
| 2026-05-04 | MLB | ML | home | 2.5 | 0.5 | +122 | 1 | 0 | 1 | 52.6 | STANDARD | LOSS |
| 2026-05-04 | MLB | ML | away | 2.5 | 0.5 | -110 | 1 | 0 | 1 | 78.8 | STANDARD | WIN |
| 2026-05-04 | MLB | ML | home | 2.5 | 0.5 | +116 | 1 | 0 | 1 | 82.6 | STANDARD | WIN |
| 2026-05-04 | MLB | ML | away | 2.5 | 0 | +104 | 1 | 0 | 1 | 63.7 | STANDARD | LOSS |
| 2026-05-04 | NBA | ML | home | 5 | 3.5 | -600 | 4 | 4 | 0 | 30.0 | LEAN | LOSS |
| 2026-05-04 | NBA | ML | away | 5 | 0.5 | +245 | 4 | 1 | 3 | 171.5 | STRONG | LOSS |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | 0 | 0 | 0 | 42.3 | LEAN | WIN |
| 2026-05-04 | NBA | SPREAD | away | 5 | 3.5 | -105 | 4 | 0 | 4 | 303.8 | STRONG | WIN |
| 2026-05-04 | NBA | SPREAD | away | 4 | 1.13 | -110 | 2 | 0 | 2 | 141.1 | STRONG | LOSS |
| 2026-05-04 | NBA | TOTAL | under | 5 | 3.5 | -102 | 1 | 0 | 1 | 201.7 | STANDARD | WIN |
| 2026-05-04 | NBA | TOTAL | under | 5 | 2 | -102 | 2 | 0 | 2 | 211.4 | STRONG | LOSS |
| 2026-05-05 | MLB | ML | home | 2.5 | 0.5 | -155 | 1 | 0 | 1 | 60.5 | STANDARD | LOSS |
| 2026-05-05 | MLB | ML | home | 2.5 | 0.5 | -188 | 0 | 0 | 0 | 35.1 | LEAN | WIN |
| 2026-05-05 | MLB | ML | home | 2.5 | 0.5 | -125 | 0 | 0 | 0 | 42.6 | LEAN | WIN |
| 2026-05-05 | NBA | ML | away | 5 | 4.5 | +132 | 4 | 1 | 3 | 264.0 | STRONG | LOSS |
| 2026-05-05 | NBA | ML | away | 4 | 0.5 | +660 | 3 | 2 | 1 | 117.1 | STRONG | LOSS |
| 2026-05-05 | NBA | SPREAD | away | 3.5 | 0.75 | -115 | 2 | 0 | 2 | 150.1 | STRONG | LOSS |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.5 | -105 | 1 | 0 | 1 | 69.9 | STANDARD | LOSS |
| 2026-05-05 | NBA | TOTAL | under | 4 | 0.75 | -113 | 1 | 0 | 1 | 101.1 | STANDARD | WIN |
| 2026-05-06 | MLB | ML | home | 2.5 | 0.5 | -104 | 1 | 0 | 1 | 59.8 | STANDARD | WIN |
| 2026-05-06 | NBA | ML | home | 5 | 3 | -380 | 3 | 0 | 3 | 276.6 | STRONG | WIN |
| 2026-05-06 | NBA | ML | away | 5 | 1.75 | +227 | 2 | 0 | 2 | 198.9 | STRONG | LOSS |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | 1 | 1 | 0 | -16.1 | LEAN | WIN |
| 2026-05-06 | NBA | SPREAD | away | 3.5 | 0.75 | -104 | 1 | 1 | 0 | 15.9 | LEAN | LOSS |
| 2026-05-06 | NBA | SPREAD | away | 5 | 3.5 | -105 | 2 | 0 | 2 | 242.4 | STRONG | WIN |
| 2026-05-06 | NBA | TOTAL | over | 3.5 | 0.75 | -107 | 1 | 0 | 1 | 115.1 | STANDARD | WIN |
| 2026-05-07 | NBA | SPREAD | home | 4.5 | 3.5 | -107 | 2 | 1 | 1 | 96.1 | STRONG | WIN |
| 2026-05-07 | NHL | SPREAD | home | 2.5 | 0 | -190 | 1 | 0 | 1 | 91.5 | STANDARD | LOSS |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | 1 | 0 | 1 | 62.6 | STANDARD | WIN |
| 2026-05-08 | MLB | ML | home | 4 | 1.88 | -136 | 1 | 0 | 1 | 102.7 | STANDARD | LOSS |
| 2026-05-08 | NBA | ML | away | 3.5 | 1.13 | -218 | 3 | 5 | -2 | -70.6 | MUTE | WIN |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | 1 | 0 | 1 | 66.3 | STANDARD | LOSS |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -108 | 1 | 0 | 1 | 58.1 | STANDARD | LOSS |
| 2026-05-08 | NBA | SPREAD | away | 5 | 3.5 | -105 | 1 | 0 | 1 | 165.1 | STANDARD | WIN |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.5 | -103 | 1 | 0 | 1 | 139.4 | STANDARD | WIN |
| 2026-05-08 | NBA | TOTAL | over | 4 | 0.75 | +101 | 1 | 0 | 1 | 123.3 | STANDARD | WIN |
| 2026-05-09 | NBA | ML | away | 3.5 | 1.13 | +165 | 1 | 2 | -1 | -83.0 | MUTE | LOSS |
| 2026-05-09 | NBA | ML | away | 5 | 4.5 | -364 | 6 | 2 | 4 | 300.1 | STRONG | WIN |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.7 | -104 | 2 | 2 | 0 | 42.2 | LEAN | WIN |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2 | -104 | 2 | 0 | 2 | 208.2 | STRONG | WIN |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | 1 | 0 | 1 | 126.1 | STANDARD | WIN |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -120 | 1 | 1 | 0 | 33.1 | LEAN | WIN |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -103 | 1 | 0 | 1 | 90.4 | STANDARD | LOSS |
| 2026-05-10 | MLB | ML | home | 3.5 | 1.13 | -110 | 1 | 0 | 1 | 98.0 | STANDARD | WIN |
| 2026-05-10 | MLB | ML | away | 3.5 | 1.13 | +134 | 1 | 0 | 1 | 61.2 | STANDARD | WIN |
| 2026-05-10 | NBA | ML | away | 3.5 | 1.13 | -260 | 1 | 1 | 0 | 21.4 | LEAN | WIN |
| 2026-05-10 | NBA | ML | home | 4 | 1.5 | +160 | 2 | 1 | 1 | 182.1 | STRONG | WIN |
| 2026-05-10 | NHL | ML | away | 4.5 | 4.5 | +108 | 2 | 0 | 2 | 168.7 | STRONG | LOSS |
| 2026-05-10 | NHL | ML | home | 3.5 | 1.13 | +102 | 1 | 0 | 1 | 77.3 | STANDARD | WIN |
| 2026-05-10 | NBA | SPREAD | home | 4 | 0.75 | -110 | 3 | 1 | 2 | 205.5 | STRONG | WIN |
| 2026-05-10 | MLB | TOTAL | over | 4 | 0.64 | -110 | 1 | 0 | 1 | 68.6 | STANDARD | LOSS |
| 2026-05-10 | MLB | TOTAL | over | 4 | 0.64 | -110 | 1 | 0 | 1 | 68.6 | STANDARD | LOSS |
| 2026-05-10 | NBA | TOTAL | over | 4.5 | 2.63 | -110 | 2 | 1 | 1 | 85.7 | STRONG | WIN |
| 2026-05-10 | NBA | TOTAL | over | 5 | 3.5 | -110 | 2 | 0 | 2 | 231.0 | STRONG | WIN |
| 2026-05-10 | NHL | TOTAL | under | 5 | 1.7 | -110 | 1 | 0 | 1 | 210.7 | STANDARD | LOSS |
| 2026-05-11 | MLB | ML | away | 3.5 | 1.13 | -101 | 2 | 0 | 2 | 180.1 | STRONG | WIN |
| 2026-05-11 | MLB | ML | home | 3.5 | 1.13 | -156 | 1 | 1 | 0 | 35.8 | LEAN | WIN |
| 2026-05-11 | NBA | ML | home | 4.5 | 3.5 | -166 | 3 | 2 | 1 | 61.8 | STRONG | WIN |
| 2026-05-11 | NBA | ML | away | 5 | 4.5 | -557 | 5 | 0 | 5 | 319.5 | STRONG | WIN |
| 2026-05-11 | NBA | SPREAD | away | 3.5 | 0.75 | -115 | 0 | 1 | -1 | -74.3 | MUTE | LOSS |
| 2026-05-11 | NBA | TOTAL | under | 3.5 | 0.75 | -111 | 1 | 0 | 1 | 29.5 | STANDARD | LOSS |
| 2026-05-11 | NBA | TOTAL | under | 4.5 | 2 | -110 | 1 | 0 | 1 | 98.5 | STANDARD | LOSS |
| 2026-05-11 | NHL | TOTAL | under | 4.5 | 1.27 | -110 | 2 | 0 | 2 | 152.4 | STRONG | LOSS |
| 2026-05-12 | MLB | ML | away | 5 | 4.5 | +108 | 2 | 0 | 2 | 185.3 | STRONG | LOSS |
| 2026-05-12 | MLB | ML | away | 4.5 | 3 | +129 | 0 | 0 | 0 | 95.9 | LEAN | LOSS |
| 2026-05-12 | MLB | ML | away | 4 | 1.88 | -150 | 1 | 0 | 1 | 111.3 | STANDARD | WIN |
| 2026-05-12 | MLB | ML | home | 5 | 3 | +108 | 1 | 0 | 1 | 124.8 | STANDARD | LOSS |
| 2026-05-12 | NBA | ML | home | 5 | 4.5 | -380 | 4 | 3 | 1 | 123.6 | STRONG | WIN |
| 2026-05-12 | NHL | ML | home | 3.5 | 1.13 | -160 | 1 | 1 | 0 | 14.2 | LEAN | WIN |
| 2026-05-12 | MLB | SPREAD | home | 4 | 1.13 | -163 | 1 | 0 | 1 | 117.0 | STANDARD | WIN |
| 2026-05-12 | NBA | SPREAD | away | 5 | 3.5 | -105 | 5 | 1 | 4 | 309.2 | STRONG | LOSS |
| 2026-05-12 | MLB | TOTAL | under | 4 | 0.64 | -110 | 0 | 0 | 0 | 61.3 | LEAN | LOSS |
| 2026-05-12 | MLB | TOTAL | under | 3.5 | 0.75 | +104 | 0 | 0 | 0 | 39.8 | LEAN | WIN |
| 2026-05-12 | NBA | TOTAL | under | 4 | 1.13 | -110 | 1 | 0 | 1 | 94.6 | STANDARD | LOSS |
| 2026-05-13 | MLB | ML | home | 4.5 | 4.5 | -116 | 2 | 0 | 2 | 167.2 | STRONG | WIN |
| 2026-05-13 | MLB | ML | home | 5 | 4.5 | +155 | 1 | 1 | 0 | 145.3 | LEAN | WIN |
| 2026-05-13 | MLB | ML | home | 5 | 4.5 | -145 | 2 | 0 | 2 | 192.6 | STRONG | WIN |
| 2026-05-13 | NBA | ML | home | 5 | 4.5 | -162 | 5 | 2 | 3 | 308.5 | STRONG | LOSS |
| 2026-05-13 | MLB | SPREAD | home | 5 | 3.5 | -105 | 1 | 0 | 1 | 151.2 | STANDARD | WIN |
| 2026-05-13 | NBA | SPREAD | away | 5 | 3.5 | -115 | 2 | 2 | 0 | 146.7 | LEAN | WIN |
| 2026-05-13 | MLB | TOTAL | under | 4 | 0.96 | -110 | 3 | 0 | 3 | 193.3 | STRONG | WIN |
| 2026-05-13 | MLB | TOTAL | under | 5 | 3.5 | -110 | 2 | 0 | 2 | 209.5 | STRONG | LOSS |
| 2026-05-13 | NBA | TOTAL | over | 5 | 3.5 | -101 | 0 | 0 | 0 | 142.0 | LEAN | WIN |
| 2026-05-14 | MLB | ML | home | 4.5 | 4.5 | -167 | 1 | 0 | 1 | 136.2 | STANDARD | LOSS |
| 2026-05-14 | MLB | ML | away | 4.5 | 3.5 | -102 | 1 | 1 | 0 | 55.0 | LEAN | LOSS |
| 2026-05-14 | MLB | ML | home | 5 | 4.5 | -103 | 1 | 0 | 1 | 118.9 | STANDARD | LOSS |
| 2026-05-14 | MLB | ML | home | 4 | 1.25 | +108 | 0 | 0 | 0 | 92.1 | LEAN | LOSS |
| 2026-05-14 | NHL | ML | away | 4.5 | 1.95 | -114 | 1 | 0 | 1 | 174.1 | STANDARD | WIN |
| 2026-05-14 | MLB | SPREAD | home | 4 | 0.49 | +138 | 0 | 2 | -2 | -86.4 | MUTE | LOSS |
| 2026-05-14 | MLB | TOTAL | over | 3.5 | 0.49 | -110 | 1 | 0 | 1 | 63.7 | STANDARD | LOSS |
| 2026-05-14 | NHL | TOTAL | under | 5 | 3.5 | -110 | 1 | 0 | 1 | 126.1 | STANDARD | LOSS |
| 2026-05-15 | MLB | ML | home | 4 | 2.5 | +128 | 2 | 1 | 1 | 57.8 | STRONG | LOSS |
| 2026-05-15 | MLB | ML | away | 4 | 2.75 | -211 | 1 | 0 | 1 | 89.0 | STANDARD | WIN |
| 2026-05-15 | MLB | ML | away | 1 | 0 | -140 | 1 | 1 | 0 | -33.7 | LEAN | WIN |
| 2026-05-15 | MLB | ML | away | 3 | 1.25 | +115 | 1 | 0 | 1 | 47.7 | STANDARD | LOSS |
| 2026-05-15 | NBA | ML | away | 2.5 | 0.5 | +145 | 4 | 2 | 2 | 226.9 | STRONG | WIN |
| 2026-05-15 | NBA | ML | away | 1 | 1.25 | -225 | 2 | 3 | -1 | -43.1 | MUTE | WIN |
| 2026-05-15 | NBA | SPREAD | away | 1 | 0 | -114 | 1 | 2 | -1 | -43.5 | MUTE | WIN |
| 2026-05-15 | NBA | SPREAD | home | 2.5 | 0 | -105 | 2 | 0 | 2 | 64.7 | STRONG | LOSS |
| 2026-05-15 | MLB | TOTAL | under | 2.5 | 0.3 | -110 | 2 | 2 | 0 | 35.8 | LEAN | WIN |
| 2026-05-15 | NBA | TOTAL | over | 4 | 0.75 | -109 | 1 | 1 | 0 | 51.7 | LEAN | LOSS |
| 2026-05-15 | NBA | TOTAL | over | 5 | 2 | -110 | 1 | 0 | 1 | 143.1 | STANDARD | WIN |
| 2026-05-16 | MLB | ML | away | 5 | 4.5 | +124 | 2 | 0 | 2 | 153.1 | STRONG | WIN |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.5 | -105 | 1 | 1 | 0 | 31.9 | LEAN | LOSS |
| 2026-05-16 | MLB | ML | home | 5 | 2.5 | +119 | 1 | 0 | 1 | 127.4 | STANDARD | LOSS |
| 2026-05-16 | MLB | ML | home | 5 | 2.5 | +115 | 1 | 0 | 1 | 93.0 | STANDARD | WIN |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.5 | -146 | 0 | 1 | -1 | -81.5 | MUTE | LOSS |
| 2026-05-16 | MLB | ML | away | 2.5 | 0.5 | -102 | 2 | 0 | 2 | 157.5 | STRONG | WIN |
| 2026-05-16 | NHL | ML | home | 2.5 | 0.5 | -165 | 1 | 1 | 0 | -16.7 | LEAN | LOSS |
| 2026-05-16 | MLB | SPREAD | away | 4 | 1.65 | -175 | 0 | 0 | 0 | 74.1 | LEAN | WIN |
| 2026-05-16 | MLB | TOTAL | over | 4 | 1.65 | -110 | 1 | 0 | 1 | 91.8 | STANDARD | LOSS |
| 2026-05-17 | MLB | ML | away | 4 | 2.75 | -148 | 2 | 0 | 2 | 101.3 | STRONG | WIN |
| 2026-05-17 | MLB | ML | away | 2.5 | 0 | -120 | 0 | 0 | 0 | 36.4 | LEAN | WIN |
| 2026-05-17 | MLB | ML | home | 3 | 0 | -146 | 0 | 0 | 0 | 47.4 | LEAN | WIN |
| 2026-05-17 | MLB | ML | home | 2.5 | 0 | +114 | 0 | 0 | 0 | 13.4 | LEAN | WIN |
| 2026-05-17 | MLB | ML | home | 1 | 0 | -120 | 0 | 1 | -1 | -20.5 | MUTE | LOSS |
| 2026-05-17 | MLB | ML | home | 1 | 0 | +125 | 1 | 0 | 1 | 53.8 | STANDARD | LOSS |
| 2026-05-17 | MLB | ML | away | 2.5 | 0.5 | +139 | 1 | 0 | 1 | 67.1 | STANDARD | LOSS |
| 2026-05-17 | MLB | ML | away | 5 | 5 | -129 | 1 | 0 | 1 | 111.8 | STANDARD | LOSS |
| 2026-05-17 | MLB | ML | home | 4 | 2.75 | -114 | 2 | 0 | 2 | 187.3 | STRONG | WIN |
| 2026-05-17 | MLB | ML | home | 2.5 | 0 | -138 | 0 | 0 | 0 | 36.4 | LEAN | LOSS |
| 2026-05-17 | MLB | ML | away | 1 | 0 | +136 | 0 | 0 | 0 | -12.8 | LEAN | WIN |
| 2026-05-17 | MLB | ML | home | 4 | 0 | -146 | 1 | 0 | 1 | 65.2 | STANDARD | LOSS |
| 2026-05-17 | MLB | ML | away | 1 | 0 | -118 | 0 | 0 | 0 | 17.8 | LEAN | WIN |
| 2026-05-17 | MLB | ML | home | 1 | 0 | +106 | 1 | 0 | 1 | 21.2 | STANDARD | LOSS |
| 2026-05-17 | NBA | ML | away | 3 | 1.25 | +165 | 3 | 2 | 1 | 93.2 | STRONG | WIN |
| 2026-05-17 | MLB | SPREAD | away | 1 | 0 | -160 | 0 | 0 | 0 | 30.7 | LEAN | LOSS |
| 2026-05-17 | NBA | SPREAD | home | 1 | 0.75 | -112 | 2 | 3 | -1 | 11.1 | MUTE | LOSS |
| 2026-05-17 | MLB | TOTAL | under | 1 | 0 | -113 | 0 | 0 | 0 | 44.9 | LEAN | LOSS |
| 2026-05-17 | MLB | TOTAL | over | 1 | 0 | -106 | 1 | 0 | 1 | 50.4 | STANDARD | WIN |
| 2026-05-17 | MLB | TOTAL | over | 1 | 0 | +101 | 0 | 1 | -1 | -29.9 | MUTE | WIN |
| 2026-05-17 | MLB | TOTAL | over | 4.5 | 2.25 | -110 | 2 | 0 | 2 | 122.4 | STRONG | WIN |
| 2026-05-17 | MLB | TOTAL | over | 5 | 2.5 | +107 | 1 | 0 | 1 | 128.4 | STANDARD | LOSS |
| 2026-05-17 | MLB | TOTAL | under | 2.5 | 0.3 | -110 | 1 | 0 | 1 | -19.3 | STANDARD | WIN |
| 2026-05-17 | NBA | TOTAL | under | 5 | 0.75 | -110 | 1 | 0 | 1 | 122.8 | STANDARD | LOSS |
| 2026-05-18 | MLB | ML | home | 4.5 | 5 | -111 | 1 | 0 | 1 | 116.6 | STANDARD | WIN |
| 2026-05-18 | MLB | ML | away | 4 | 2.5 | +120 | 1 | 0 | 1 | 104.9 | STANDARD | LOSS |
| 2026-05-18 | MLB | ML | home | 3 | 1.25 | -118 | 1 | 0 | 1 | 75.8 | STANDARD | WIN |
| 2026-05-18 | MLB | ML | home | 4 | 2.75 | -150 | 0 | 0 | 0 | 49.8 | LEAN | LOSS |
| 2026-05-18 | MLB | ML | home | 3 | 1.25 | +132 | 2 | 0 | 2 | 106.6 | STRONG | WIN |
| 2026-05-18 | MLB | ML | away | 3 | 0 | -129 | 0 | 0 | 0 | 2.3 | LEAN | LOSS |
| 2026-05-18 | MLB | ML | home | 1 | 0 | -198 | 0 | 2 | -2 | -182.6 | MUTE | WIN |
| 2026-05-18 | NBA | ML | home | 5 | 5 | -240 | 5 | 3 | 2 | 141.1 | STRONG | LOSS |
| 2026-05-18 | NHL | ML | home | 5 | 5 | -112 | 2 | 0 | 2 | 162.3 | STRONG | LOSS |
| 2026-05-18 | MLB | SPREAD | away | 1 | 0 | -165 | 1 | 0 | 1 | 51.4 | STANDARD | LOSS |
| 2026-05-18 | NBA | SPREAD | home | 2.5 | 0 | -110 | 3 | 1 | 2 | 82.7 | STRONG | LOSS |
| 2026-05-18 | MLB | TOTAL | under | 1 | 0 | -106 | 1 | 0 | 1 | 51.4 | STANDARD | WIN |
| 2026-05-18 | MLB | TOTAL | under | 1 | 0 | -104 | 1 | 0 | 1 | 60.5 | STANDARD | LOSS |
| 2026-05-18 | NBA | TOTAL | under | 2.5 | 0 | -112 | 1 | 2 | -1 | -48.0 | MUTE | LOSS |
| 2026-05-18 | NHL | TOTAL | under | 4.5 | 2.25 | -110 | 1 | 0 | 1 | 117.6 | STANDARD | WIN |
| 2026-05-19 | MLB | ML | home | 5 | 2.5 | +118 | 3 | 1 | 2 | 228.1 | STRONG | LOSS |
| 2026-05-19 | MLB | ML | away | 1 | 0.5 | +111 | 1 | 0 | 1 | 75.2 | STANDARD | LOSS |
| 2026-05-19 | MLB | ML | home | 3 | 0 | -136 | 1 | 0 | 1 | 52.9 | STANDARD | LOSS |
| 2026-05-19 | MLB | ML | home | 2.5 | 2.5 | +105 | 2 | 0 | 2 | 169.5 | STRONG | LOSS |
| 2026-05-19 | MLB | ML | away | 3 | 0 | +120 | 0 | 0 | 0 | 46.3 | LEAN | WIN |
| 2026-05-19 | MLB | ML | away | 2.5 | 0 | -142 | 0 | 0 | 0 | 10.2 | LEAN | LOSS |
| 2026-05-19 | MLB | ML | home | 2.5 | 0 | -132 | 0 | 0 | 0 | 34.7 | LEAN | LOSS |
| 2026-05-19 | MLB | ML | home | 3 | 0 | -110 | 0 | 0 | 0 | 45.0 | LEAN | WIN |
| 2026-05-19 | MLB | ML | away | 2.5 | 1.25 | -104 | 2 | 1 | 1 | 108.6 | STRONG | WIN |
| 2026-05-19 | NBA | ML | home | 5 | 5 | -260 | 3 | 0 | 3 | 218.6 | STRONG | WIN |
| 2026-05-19 | MLB | SPREAD | away | 1 | 0 | +164 | 0 | 0 | 0 | 12.9 | LEAN | LOSS |
| 2026-05-19 | MLB | SPREAD | away | 1 | 0 | +114 | 0 | 0 | 0 | 49.3 | LEAN | LOSS |
| 2026-05-19 | NBA | SPREAD | away | 5 | 2.25 | -105 | 3 | 2 | 1 | 150.8 | STRONG | LOSS |
| 2026-05-19 | MLB | TOTAL | under | 4 | 1.65 | -110 | 0 | 1 | -1 | 23.5 | MUTE | WIN |
| 2026-05-19 | NBA | TOTAL | under | 5 | 3 | -106 | 2 | 1 | 1 | 161.5 | STRONG | LOSS |
| 2026-05-20 | MLB | ML | home | 3 | 0 | +170 | 1 | 0 | 1 | 56.0 | STANDARD | LOSS |
| 2026-05-20 | MLB | ML | away | 5 | 2.5 | +113 | 1 | 0 | 1 | 125.3 | STANDARD | LOSS |
| 2026-05-20 | MLB | ML | home | 3 | 0 | -118 | 1 | 0 | 1 | 54.7 | STANDARD | LOSS |
| 2026-05-20 | MLB | ML | home | 3 | 0 | -144 | 0 | 0 | 0 | 45.2 | LEAN | LOSS |
| 2026-05-20 | MLB | ML | home | 3 | 0 | +104 | 1 | 0 | 1 | 64.3 | STANDARD | LOSS |
| 2026-05-20 | MLB | ML | home | 4 | 2.75 | -154 | 1 | 0 | 1 | 73.0 | STANDARD | WIN |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.5 | -140 | 1 | 0 | 1 | 84.6 | STANDARD | WIN |
| 2026-05-20 | MLB | ML | away | 3 | 0 | -175 | 0 | 0 | 0 | 47.3 | LEAN | WIN |
| 2026-05-20 | MLB | ML | home | 2.5 | 0.5 | +111 | 1 | 0 | 1 | 32.1 | STANDARD | WIN |
| 2026-05-20 | MLB | ML | away | 1 | 0 | -125 | 0 | 1 | -1 | -26.6 | MUTE | WIN |
| 2026-05-20 | MLB | ML | away | 1 | 0 | -102 | 0 | 1 | -1 | -8.8 | MUTE | WIN |
| 2026-05-20 | MLB | ML | away | 4 | 2.75 | +113 | 1 | 1 | 0 | 58.9 | LEAN | LOSS |
| 2026-05-20 | MLB | ML | away | 2.5 | 0 | +146 | 1 | 0 | 1 | 50.8 | STANDARD | WIN |
| 2026-05-20 | NBA | ML | home | 5 | 5 | -225 | 3 | 3 | 0 | 2.1 | LEAN | WIN |
| 2026-05-20 | NHL | ML | home | 2.5 | 1.25 | -192 | 1 | 0 | 1 | 86.7 | STANDARD | LOSS |
| 2026-05-20 | MLB | SPREAD | away | 1 | 0 | -162 | 1 | 0 | 1 | 50.8 | STANDARD | WIN |
| 2026-05-20 | MLB | SPREAD | away | 1 | 0 | -146 | 1 | 0 | 1 | 51.4 | STANDARD | WIN |
| 2026-05-20 | NBA | SPREAD | home | 5 | 3 | -106 | 1 | 0 | 1 | 206.1 | STANDARD | WIN |
| 2026-05-20 | MLB | TOTAL | under | 1 | 0 | -103 | 0 | 1 | -1 | -57.8 | MUTE | LOSS |
| 2026-05-20 | MLB | TOTAL | over | 1 | 0 | -111 | 0 | 0 | 0 | 12.9 | LEAN | WIN |
| 2026-05-20 | MLB | TOTAL | under | 1 | 0 | -117 | 0 | 0 | 0 | 25.0 | LEAN | WIN |
| 2026-05-20 | MLB | TOTAL | under | 4 | 0.75 | -110 | 1 | 0 | 1 | 62.1 | STANDARD | LOSS |
| 2026-05-20 | MLB | TOTAL | under | 1 | 0 | -110 | 0 | 0 | 0 | 25.8 | LEAN | LOSS |
| 2026-05-20 | MLB | TOTAL | under | 1 | 0 | +100 | 1 | 0 | 1 | 50.8 | STANDARD | LOSS |
| 2026-05-20 | MLB | TOTAL | under | 1 | 0 | -113 | 0 | 0 | 0 | 40.1 | LEAN | WIN |
| 2026-05-20 | NBA | TOTAL | over | 5 | 1.65 | -112 | 2 | 0 | 2 | 165.1 | STRONG | WIN |
| 2026-05-21 | MLB | ML | home | 5 | 2.5 | +125 | 3 | 0 | 3 | 195.5 | STRONG | LOSS |
| 2026-05-21 | MLB | ML | home | 3 | 0 | -120 | 1 | 0 | 1 | 52.9 | STANDARD | LOSS |
| 2026-05-21 | MLB | ML | away | 3 | 1.25 | +172 | 1 | 0 | 1 | 56.0 | STANDARD | LOSS |
| 2026-05-21 | MLB | ML | away | 4.5 | 2.75 | -110 | 1 | 0 | 1 | 130.8 | STANDARD | WIN |
| 2026-05-21 | MLB | ML | home | 3 | 1.25 | -116 | 2 | 1 | 1 | 137.1 | STRONG | LOSS |
| 2026-05-21 | MLB | ML | away | 3 | 1.25 | +129 | 2 | 1 | 1 | 148.6 | STRONG | WIN |
| 2026-05-21 | NBA | ML | away | 1 | 3.75 | +200 | 2 | 6 | -4 | -143.7 | MUTE | LOSS |
| 2026-05-21 | NHL | ML | home | 4 | 2.75 | -197 | 0 | 0 | 0 | 71.5 | LEAN | LOSS |
| 2026-05-21 | MLB | SPREAD | home | 3 | 0.75 | -148 | 1 | 0 | 1 | 66.9 | STANDARD | LOSS |
| 2026-05-21 | MLB | SPREAD | away | 4 | 1.65 | -170 | 1 | 0 | 1 | 58.7 | STANDARD | WIN |
| 2026-05-21 | NBA | SPREAD | away | 5 | 3 | -110 | 4 | 1 | 3 | 279.6 | STRONG | LOSS |
| 2026-05-21 | NHL | SPREAD | away | 3 | 0.75 | -160 | 0 | 0 | 0 | 26.7 | LEAN | WIN |
| 2026-05-21 | MLB | TOTAL | under | 2.5 | 0.3 | -110 | 1 | 0 | 1 | 58.1 | STANDARD | WIN |
| 2026-05-21 | NBA | TOTAL | over | 2.5 | 0.3 | -110 | 0 | 0 | 0 | 28.3 | LEAN | LOSS |
| 2026-05-21 | NHL | TOTAL | over | 3 | 0.75 | +103 | 0 | 0 | 0 | 30.0 | LEAN | WIN |
| 2026-05-22 | MLB | ML | home | 5 | 1.25 | -175 | 1 | 0 | 1 | 51.0 | STANDARD | LOSS |
| 2026-05-22 | MLB | ML | home | 4 | 1.25 | -195 | 0 | 0 | 0 | 17.0 | LEAN | LOSS |
| 2026-05-22 | MLB | ML | away | 3 | 1.25 | +121 | 1 | 0 | 1 | 52.1 | STANDARD | LOSS |
| 2026-05-22 | MLB | ML | home | 3 | 1.25 | -137 | 2 | 0 | 2 | 157.0 | STRONG | LOSS |
| 2026-05-22 | MLB | ML | home | 1 | 1.25 | -104 | 1 | 0 | 1 | 14.8 | STANDARD | WIN |
| 2026-05-22 | MLB | ML | home | 5 | 5 | -144 | 3 | 0 | 3 | 196.1 | STRONG | LOSS |
| 2026-05-22 | MLB | ML | home | 1 | 1.25 | +106 | 1 | 1 | 0 | 14.8 | LEAN | WIN |
| 2026-05-22 | MLB | ML | home | 5 | 2.75 | -158 | 1 | 0 | 1 | 56.9 | STANDARD | WIN |
| 2026-05-22 | MLB | ML | home | 1 | 2.5 | +117 | 1 | 1 | 0 | 46.5 | LEAN | LOSS |
| 2026-05-22 | MLB | ML | home | 5 | 5 | -145 | 2 | 0 | 2 | 116.8 | STRONG | LOSS |
| 2026-05-22 | MLB | ML | home | 2.5 | 0.5 | +139 | 2 | 1 | 1 | 105.1 | STRONG | WIN |
| 2026-05-22 | MLB | ML | away | 5 | 1.5 | +185 | 2 | 0 | 2 | 113.3 | STRONG | LOSS |
| 2026-05-22 | NBA | ML | home | 5 | 5 | -120 | 6 | 7 | -1 | 51.7 | MUTE | LOSS |
| 2026-05-22 | NHL | ML | home | 4.5 | 3.75 | -167 | 5 | 1 | 4 | 371.7 | STRONG | LOSS |
| 2026-05-22 | MLB | SPREAD | home | 5 | 0.75 | -155 | 1 | 0 | 1 | 62.5 | STANDARD | WIN |
| 2026-05-22 | MLB | SPREAD | home | 3 | 0.75 | -142 | 1 | 0 | 1 | 51.4 | STANDARD | LOSS |
| 2026-05-22 | MLB | SPREAD | home | 4 | 1.65 | -119 | 1 | 0 | 1 | 83.5 | STANDARD | WIN |
| 2026-05-22 | MLB | SPREAD | away | 3 | 0.75 | -112 | 1 | 0 | 1 | 75.9 | STANDARD | WIN |
| 2026-05-22 | NBA | SPREAD | home | 2.5 | 0 | -110 | 3 | 1 | 2 | 63.8 | STRONG | LOSS |
| 2026-05-22 | MLB | TOTAL | over | 3 | 0.75 | -110 | 0 | 0 | 0 | 5.1 | LEAN | WIN |
| 2026-05-22 | MLB | TOTAL | over | 3 | 0.75 | -110 | 2 | 1 | 1 | 61.5 | STRONG | LOSS |
| 2026-05-22 | NBA | TOTAL | over | 5 | 0.75 | +101 | 1 | 0 | 1 | 159.7 | STANDARD | WIN |
| 2026-05-22 | NHL | TOTAL | under | 5 | 2.5 | -110 | 1 | 0 | 1 | 129.5 | STANDARD | WIN |
| 2026-05-23 | MLB | ML | home | 2.5 | 0.5 | -181 | 0 | 1 | -1 | 4.2 | MUTE | WIN |
| 2026-05-23 | MLB | ML | away | 2.5 | 2.75 | +109 | 0 | 0 | 0 | 44.8 | LEAN | LOSS |
| 2026-05-23 | MLB | ML | home | 5 | 0 | -148 | 0 | 0 | 0 | 29.0 | LEAN | LOSS |
| 2026-05-23 | MLB | ML | home | 1 | 1.25 | +102 | 1 | 0 | 1 | 3.4 | STANDARD | LOSS |
| 2026-05-23 | MLB | ML | home | 1 | 0.5 | -120 | 1 | 0 | 1 | 76.4 | STANDARD | LOSS |
| 2026-05-23 | MLB | ML | away | 2.5 | 1.25 | -111 | 2 | 0 | 2 | 99.1 | STRONG | LOSS |
| 2026-05-23 | MLB | ML | home | 1 | 0 | +135 | 1 | 3 | -2 | -203.5 | MUTE | WIN |
| 2026-05-23 | MLB | ML | home | 4 | 2.5 | +118 | 2 | 0 | 2 | 150.5 | STRONG | WIN |
| 2026-05-23 | MLB | ML | away | 4 | 0 | -108 | 0 | 0 | 0 | 16.0 | LEAN | WIN |
| 2026-05-23 | MLB | ML | home | 4 | 1.25 | +124 | 1 | 0 | 1 | 88.7 | STANDARD | WIN |
| 2026-05-23 | MLB | ML | away | 3 | 1.25 | +166 | 3 | 0 | 3 | 164.0 | STRONG | WIN |
| 2026-05-23 | NBA | ML | home | 1 | 2.5 | -126 | 2 | 4 | -2 | -234.3 | MUTE | LOSS |
| 2026-05-23 | NHL | ML | home | 5 | 5 | -205 | 1 | 0 | 1 | 207.7 | STANDARD | WIN |
| 2026-05-23 | MLB | SPREAD | away | 3 | 0.75 | -163 | 1 | 0 | 1 | 32.0 | STANDARD | WIN |
| 2026-05-23 | MLB | SPREAD | home | 3 | 0.75 | -163 | 0 | 0 | 0 | 19.8 | LEAN | LOSS |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 1.5 | -209 | 1 | 0 | 1 | 84.8 | STANDARD | WIN |
| 2026-05-23 | MLB | SPREAD | home | 3 | 0.75 | -135 | 0 | 0 | 0 | 16.0 | LEAN | WIN |
| 2026-05-23 | MLB | SPREAD | away | 4.5 | 2.25 | -123 | 0 | 0 | 0 | 70.6 | LEAN | WIN |
| 2026-05-23 | NBA | SPREAD | home | 5 | 3 | -107 | 1 | 0 | 1 | 123.6 | STANDARD | LOSS |
| 2026-05-23 | NHL | SPREAD | home | 1 | 0 | +120 | 1 | 0 | 1 | -23.7 | STANDARD | LOSS |
| 2026-05-23 | MLB | TOTAL | under | 1 | 0 | -103 | 0 | 0 | 0 | 41.3 | LEAN | WIN |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.3 | -110 | 1 | 0 | 1 | 38.9 | STANDARD | WIN |
| 2026-05-23 | MLB | TOTAL | under | 3 | 0.75 | -110 | 0 | 0 | 0 | 18.6 | LEAN | WIN |
| 2026-05-23 | MLB | TOTAL | under | 5 | 3 | -110 | 3 | 1 | 2 | 86.8 | STRONG | WIN |
| 2026-05-23 | MLB | TOTAL | under | 3 | 0.75 | -110 | 1 | 0 | 1 | 71.9 | STANDARD | LOSS |
| 2026-05-23 | MLB | TOTAL | under | 3 | 0.75 | +102 | 0 | 0 | 0 | 20.0 | LEAN | WIN |
| 2026-05-23 | MLB | TOTAL | under | 3 | 0.75 | -110 | 1 | 0 | 1 | 54.5 | STANDARD | WIN |
| 2026-05-23 | MLB | TOTAL | over | 2.5 | 0.3 | -111 | 1 | 0 | 1 | 72.7 | STANDARD | LOSS |
| 2026-05-23 | NBA | TOTAL | under | 5 | 3 | +102 | 2 | 0 | 2 | 201.8 | STRONG | LOSS |
| 2026-05-23 | NHL | TOTAL | under | 3 | 0.3 | -110 | 1 | 0 | 1 | 63.2 | STANDARD | WIN |
| 2026-05-24 | MLB | ML | home | 4.5 | 3.75 | -101 | 2 | 0 | 2 | 99.3 | STRONG | LOSS |
| 2026-05-24 | MLB | ML | home | 3 | 1.25 | -189 | 0 | 0 | 0 | 36.3 | LEAN | WIN |
| 2026-05-24 | MLB | ML | home | 2.5 | 1.25 | -113 | 1 | 0 | 1 | 54.9 | STANDARD | WIN |
| 2026-05-24 | MLB | ML | home | 5 | 5 | -115 | 1 | 0 | 1 | 25.9 | STANDARD | WIN |
| 2026-05-24 | MLB | ML | away | 1 | 1.25 | +143 | 2 | 2 | 0 | -67.4 | LEAN | WIN |
| 2026-05-24 | MLB | ML | home | 2.5 | 0.5 | +144 | 1 | 1 | 0 | -30.0 | LEAN | LOSS |
| 2026-05-24 | MLB | ML | away | 5 | 0 | +135 | 1 | 3 | -2 | -206.7 | MUTE | WIN |
| 2026-05-24 | MLB | ML | home | 3 | 1.25 | -107 | 0 | 0 | 0 | 28.4 | LEAN | WIN |
| 2026-05-24 | MLB | ML | away | 2.5 | 0.5 | +695 | 2 | 2 | 0 | -59.7 | LEAN | WIN |
| 2026-05-24 | MLB | ML | away | 4 | 1.25 | +148 | 1 | 0 | 1 | 103.0 | STANDARD | WIN |
| 2026-05-24 | MLB | ML | away | 3 | 1.25 | -122 | 0 | 0 | 0 | 25.1 | LEAN | LOSS |
| 2026-05-24 | MLB | ML | home | 1 | 2.75 | -112 | 1 | 1 | 0 | -39.1 | LEAN | WIN |
| 2026-05-24 | NBA | ML | home | 1 | 0 | -122 | 1 | 5 | -4 | -323.0 | MUTE | WIN |
| 2026-05-24 | NHL | ML | away | 4 | 2.75 | -136 | 0 | 0 | 0 | 107.9 | LEAN | LOSS |
| 2026-05-24 | MLB | SPREAD | home | 4 | 1.65 | -110 | 1 | 0 | 1 | 79.4 | STANDARD | LOSS |
| 2026-05-24 | MLB | SPREAD | home | 3 | 0.75 | +134 | 1 | 0 | 1 | 81.9 | STANDARD | LOSS |
| 2026-05-24 | NBA | SPREAD | away | 5 | 1.65 | -103 | 2 | 1 | 1 | 136.2 | STRONG | LOSS |
| 2026-05-24 | MLB | TOTAL | under | 4 | 0.75 | -110 | 0 | 0 | 0 | 73.7 | LEAN | LOSS |
| 2026-05-24 | MLB | TOTAL | under | 4 | 1.65 | -110 | 0 | 0 | 0 | 16.6 | LEAN | LOSS |
| 2026-05-24 | MLB | TOTAL | under | 3 | 0.75 | -110 | 0 | 0 | 0 | 8.6 | LEAN | WIN |
| 2026-05-24 | MLB | TOTAL | under | 4 | 1.65 | -110 | 1 | 0 | 1 | 71.3 | STANDARD | LOSS |
| 2026-05-24 | MLB | TOTAL | under | 1 | 0.75 | -110 | 0 | 0 | 0 | 14.2 | LEAN | WIN |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 0 | -101 | 0 | 0 | 0 | 32.6 | LEAN | WIN |
| 2026-05-24 | MLB | TOTAL | under | 2.5 | 0.3 | -104 | 0 | 0 | 0 | 32.1 | LEAN | WIN |
| 2026-05-24 | MLB | TOTAL | over | 1 | 0 | -114 | 0 | 0 | 0 | 10.0 | LEAN | LOSS |
| 2026-05-24 | MLB | TOTAL | over | 3 | 0.75 | -110 | 1 | 0 | 1 | 128.9 | STANDARD | LOSS |
| 2026-05-24 | MLB | TOTAL | under | 3 | 0.75 | -110 | 1 | 0 | 1 | 14.3 | STANDARD | WIN |
| 2026-05-24 | NBA | TOTAL | over | 4.5 | 3 | -107 | 1 | 2 | -1 | 90.5 | MUTE | LOSS |
| 2026-05-25 | MLB | ML | home | 2.5 | 0 | +106 | 0 | 0 | 0 | -2.9 | LEAN | WIN |
| 2026-05-25 | MLB | ML | home | 5 | 5 | -149 | 1 | 0 | 1 | 97.0 | STANDARD | LOSS |
| 2026-05-25 | MLB | ML | home | 5 | 5 | -310 | 1 | 0 | 1 | 89.4 | STANDARD | WIN |
| 2026-05-25 | MLB | ML | home | 4 | 1.25 | -125 | 0 | 1 | -1 | -19.4 | MUTE | LOSS |
| 2026-05-25 | MLB | ML | home | 5 | 1.25 | -160 | 0 | 0 | 0 | 71.1 | LEAN | LOSS |
| 2026-05-25 | MLB | ML | away | 5 | 3.75 | -108 | 1 | 0 | 1 | 135.0 | STANDARD | LOSS |
| 2026-05-25 | MLB | ML | home | 1 | 0.5 | +116 | 2 | 1 | 1 | 49.6 | STRONG | LOSS |
| 2026-05-25 | MLB | ML | away | 5 | 5 | -119 | 1 | 0 | 1 | 119.0 | STANDARD | WIN |
| 2026-05-25 | MLB | ML | away | 2.5 | 2.75 | -113 | 0 | 0 | 0 | -8.1 | LEAN | WIN |
| 2026-05-25 | MLB | ML | home | 4 | 5 | -209 | 1 | 1 | 0 | 48.4 | LEAN | WIN |
| 2026-05-25 | MLB | ML | home | 3 | 1.25 | +105 | 3 | 1 | 2 | 152.5 | STRONG | WIN |
| 2026-05-25 | NBA | ML | away | 5 | 5 | -125 | 5 | 2 | 3 | 253.8 | STRONG | WIN |
| 2026-05-25 | NHL | ML | home | 5 | 2.5 | +120 | 0 | 0 | 0 | 61.5 | LEAN | LOSS |
| 2026-05-25 | MLB | SPREAD | away | 1 | 0 | +128 | 1 | 0 | 1 | 60.2 | STANDARD | LOSS |
| 2026-05-25 | MLB | SPREAD | away | 4 | 1.65 | -184 | 0 | 0 | 0 | 49.7 | LEAN | WIN |
| 2026-05-25 | MLB | SPREAD | home | 5 | 1.65 | -124 | 0 | 0 | 0 | 64.2 | LEAN | WIN |
| 2026-05-25 | MLB | SPREAD | home | 5 | 1.65 | -178 | 1 | 0 | 1 | 96.1 | STANDARD | WIN |
| 2026-05-25 | NBA | SPREAD | home | 5 | 1.65 | -105 | 5 | 0 | 5 | 267.3 | STRONG | LOSS |
| 2026-05-25 | NHL | SPREAD | home | 4.5 | 2.25 | -215 | 0 | 0 | 0 | 21.8 | LEAN | WIN |
| 2026-05-25 | MLB | TOTAL | over | 4 | 1.65 | +103 | 1 | 0 | 1 | 86.3 | STANDARD | LOSS |
| 2026-05-25 | MLB | TOTAL | under | 5 | 2.25 | -112 | 1 | 0 | 1 | 131.9 | STANDARD | LOSS |
| 2026-05-25 | MLB | TOTAL | over | 5 | 3 | -110 | 0 | 0 | 0 | 52.2 | LEAN | WIN |
| 2026-05-25 | MLB | TOTAL | over | 4 | 0 | -116 | 0 | 0 | 0 | 18.6 | LEAN | LOSS |
| 2026-05-25 | MLB | TOTAL | under | 5 | 0.75 | -101 | 1 | 0 | 1 | 68.7 | STANDARD | WIN |
| 2026-05-25 | NBA | TOTAL | under | 5 | 3 | -110 | 2 | 1 | 1 | 83.4 | STRONG | LOSS |
| 2026-05-26 | MLB | ML | away | 1 | 1.25 | -105 | 1 | 2 | -1 | -72.9 | MUTE | WIN |
| 2026-05-26 | MLB | ML | home | 1 | 0 | -105 | 0 | 0 | 0 | 2.7 | LEAN | LOSS |
| 2026-05-26 | MLB | ML | home | 1 | 0 | -134 | 0 | 0 | 0 | -8.4 | LEAN | WIN |
| 2026-05-26 | MLB | ML | home | 3 | 2.75 | +105 | 0 | 0 | 0 | -29.1 | LEAN | LOSS |
| 2026-05-26 | MLB | ML | away | 5 | 1.5 | +200 | 1 | 0 | 1 | 105.5 | STANDARD | LOSS |
| 2026-05-26 | MLB | ML | away | 2.5 | 1.25 | +113 | 0 | 0 | 0 | 28.9 | LEAN | WIN |
| 2026-05-26 | MLB | ML | home | 2.5 | 1.25 | -130 | 1 | 0 | 1 | 37.2 | STANDARD | WIN |
| 2026-05-26 | MLB | ML | away | 5 | 5 | -200 | 1 | 0 | 1 | 70.2 | STANDARD | WIN |
| 2026-05-26 | MLB | ML | away | 5 | 5 | -102 | 1 | 0 | 1 | 116.7 | STANDARD | WIN |
| 2026-05-26 | MLB | ML | home | 5 | 3.75 | -108 | 1 | 0 | 1 | 111.6 | STANDARD | LOSS |
| 2026-05-26 | MLB | ML | away | 2.5 | 0 | +155 | 2 | 1 | 1 | 59.2 | STRONG | LOSS |
| 2026-05-26 | MLB | ML | home | 5 | 5 | -105 | 0 | 0 | 0 | 61.6 | LEAN | WIN |
| 2026-05-26 | MLB | ML | away | 5 | 2.5 | +116 | 0 | 0 | 0 | 54.4 | LEAN | WIN |
| 2026-05-26 | NBA | ML | home | 5 | 5 | -198 | 2 | 0 | 2 | 183.3 | STRONG | WIN |
| 2026-05-26 | NHL | ML | away | 1 | 0.5 | -115 | 0 | 0 | 0 | 21.5 | LEAN | LOSS |
| 2026-05-26 | MLB | SPREAD | away | 5 | 0 | -101 | 1 | 0 | 1 | 103.2 | STANDARD | LOSS |
| 2026-05-26 | MLB | SPREAD | home | 4 | 0 | +105 | 0 | 0 | 0 | 54.1 | LEAN | LOSS |
| 2026-05-26 | NBA | SPREAD | home | 5 | 0 | -110 | 5 | 1 | 4 | 235.2 | STRONG | WIN |
| 2026-05-26 | NHL | SPREAD | home | 5 | 2.25 | -250 | 0 | 0 | 0 | 45.1 | LEAN | WIN |
| 2026-05-26 | MLB | TOTAL | over | 5 | 1.65 | -110 | 1 | 0 | 1 | 78.3 | STANDARD | WIN |
| 2026-05-26 | MLB | TOTAL | over | 3 | 0 | -109 | 0 | 0 | 0 | 29.1 | LEAN | WIN |
| 2026-05-26 | MLB | TOTAL | under | 1 | 0 | -106 | 0 | 0 | 0 | 19.7 | LEAN | WIN |
| 2026-05-26 | MLB | TOTAL | over | 1 | 0.75 | -104 | 0 | 0 | 0 | -2.0 | LEAN | LOSS |
| 2026-05-26 | NBA | TOTAL | over | 5 | 3 | -108 | 0 | 0 | 0 | 64.2 | LEAN | WIN |
| 2026-05-27 | MLB | ML | away | 1 | 0 | -126 | 0 | 2 | -2 | -139.1 | MUTE | WIN |
| 2026-05-27 | MLB | ML | home | 4.5 | 0.5 | -102 | 2 | 0 | 2 | 193.9 | STRONG | WIN |
| 2026-05-27 | MLB | ML | away | 1 | 0 | -106 | 0 | 1 | -1 | -43.3 | MUTE | WIN |
| 2026-05-27 | MLB | ML | away | 2.5 | 0 | +102 | 0 | 0 | 0 | 8.2 | LEAN | LOSS |
| 2026-05-27 | MLB | ML | home | 4.5 | 3.75 | -420 | 0 | 0 | 0 | 16.1 | LEAN | WIN |
| 2026-05-27 | MLB | ML | home | 3 | 1.25 | -144 | 0 | 1 | -1 | -28.1 | MUTE | LOSS |
| 2026-05-27 | MLB | ML | away | 5 | 0.5 | -102 | 3 | 0 | 3 | 184.4 | STRONG | LOSS |
| 2026-05-27 | MLB | ML | home | 1 | 0 | -154 | 0 | 0 | 0 | -16.8 | LEAN | WIN |
| 2026-05-27 | MLB | ML | away | 4 | 2.75 | -108 | 2 | 1 | 1 | 59.5 | STRONG | LOSS |
| 2026-05-27 | MLB | ML | home | 5 | 0.5 | +132 | 2 | 0 | 2 | 155.4 | STRONG | LOSS |
| 2026-05-27 | MLB | ML | home | 1 | 3.75 | +125 | 2 | 1 | 1 | 58.6 | STRONG | LOSS |
| 2026-05-27 | MLB | ML | away | 5 | 2.5 | +128 | 1 | 0 | 1 | 111.1 | STANDARD | LOSS |
| 2026-05-27 | MLB | ML | away | 5 | 5 | -126 | 1 | 0 | 1 | 89.5 | STANDARD | LOSS |
| 2026-05-27 | MLB | ML | home | 4 | 1.25 | -190 | 0 | 0 | 0 | 9.2 | LEAN | WIN |
| 2026-05-27 | NHL | ML | away | 1 | 0 | -142 | 1 | 0 | 1 | 35.6 | STANDARD | WIN |
| 2026-05-27 | MLB | SPREAD | away | 5 | 2.5 | +141 | 1 | 0 | 1 | 161.9 | STANDARD | LOSS |
| 2026-05-27 | MLB | SPREAD | away | 4 | 0.75 | -163 | 0 | 0 | 0 | 30.5 | LEAN | WIN |
| 2026-05-27 | MLB | SPREAD | away | 4.5 | 1.65 | -145 | 0 | 0 | 0 | 34.1 | LEAN | WIN |
| 2026-05-27 | MLB | SPREAD | away | 5 | 3 | -135 | 1 | 0 | 1 | 105.7 | STANDARD | WIN |
| 2026-05-27 | NHL | SPREAD | home | 5 | 0 | -194 | 0 | 0 | 0 | 66.6 | LEAN | LOSS |
| 2026-05-27 | MLB | TOTAL | over | 1 | 0 | -102 | 0 | 0 | 0 | -38.9 | LEAN | LOSS |
| 2026-05-27 | MLB | TOTAL | under | 4 | 0 | +105 | 0 | 0 | 0 | 77.5 | LEAN | LOSS |
| 2026-05-27 | MLB | TOTAL | under | 5 | 0 | -112 | 0 | 0 | 0 | 92.7 | LEAN | WIN |
| 2026-05-27 | MLB | TOTAL | under | 4 | 1.65 | +104 | 1 | 0 | 1 | 78.2 | STANDARD | WIN |
| 2026-05-27 | MLB | TOTAL | under | 4 | 0.75 | +104 | 0 | 0 | 0 | 52.8 | LEAN | WIN |
| 2026-05-27 | NHL | TOTAL | over | 5 | 2.25 | -112 | 1 | 0 | 1 | 66.9 | STANDARD | LOSS |
| 2026-05-28 | MLB | ML | home | 5 | 1.25 | -140 | 2 | 0 | 2 | 114.9 | STRONG | LOSS |
| 2026-05-28 | MLB | ML | away | 5 | 2.5 | +128 | 0 | 0 | 0 | 79.4 | LEAN | LOSS |
| 2026-05-28 | NBA | ML | home | 5 | 5 | -154 | 1 | 0 | 1 | 82.7 | STANDARD | WIN |
| 2026-05-28 | NBA | SPREAD | away | 5 | 0 | -110 | 4 | 2 | 2 | 189.5 | STRONG | LOSS |
| 2026-05-28 | MLB | TOTAL | over | 5 | 3 | +101 | 0 | 1 | -1 | -20.3 | MUTE | WIN |
| 2026-05-28 | MLB | TOTAL | under | 5 | 0 | -107 | 0 | 0 | 0 | -26.2 | LEAN | WIN |
| 2026-05-28 | MLB | TOTAL | over | 2.5 | 1.65 | -108 | 1 | 0 | 1 | 84.1 | STANDARD | LOSS |
| 2026-05-28 | NBA | TOTAL | under | 4.5 | 2.25 | -105 | 0 | 0 | 0 | -2.5 | LEAN | WIN |
| 2026-05-29 | MLB | ML | home | 5 | 2.5 | +118 | 1 | 0 | 1 | 141.2 | STANDARD | LOSS |
| 2026-05-29 | MLB | ML | home | 5 | 3.75 | -124 | 1 | 0 | 1 | 147.0 | STANDARD | WIN |
| 2026-05-29 | MLB | ML | home | 4 | 2.5 | +120 | 1 | 0 | 1 | 58.8 | STANDARD | WIN |
| 2026-05-29 | MLB | ML | away | 1 | 0.5 | +114 | 0 | 0 | 0 | -0.1 | LEAN | LOSS |
| 2026-05-29 | MLB | ML | away | 5 | 2.5 | +140 | 1 | 0 | 1 | 97.9 | STANDARD | LOSS |
| 2026-05-29 | MLB | ML | home | 2.5 | 0 | -112 | 1 | 0 | 1 | 59.7 | STANDARD | WIN |
| 2026-05-29 | MLB | ML | away | 4.5 | 1.25 | -142 | 1 | 0 | 1 | -19.6 | STANDARD | WIN |
| 2026-05-29 | MLB | ML | home | 4.5 | 1.25 | -134 | 0 | 0 | 0 | -27.2 | LEAN | WIN |
| 2026-05-29 | MLB | ML | home | 5 | 2.75 | -106 | 0 | 0 | 0 | 68.6 | LEAN | LOSS |
| 2026-05-29 | MLB | ML | home | 4.5 | 3.75 | -122 | 1 | 0 | 1 | 64.9 | STANDARD | LOSS |
| 2026-05-29 | NHL | ML | away | 5 | 1 | +205 | 1 | 0 | 1 | 114.8 | STANDARD | LOSS |
| 2026-05-29 | MLB | SPREAD | home | 5 | 0.75 | -135 | 1 | 0 | 1 | 85.7 | STANDARD | LOSS |
| 2026-05-29 | MLB | SPREAD | away | 4 | 0.75 | +150 | 0 | 0 | 0 | 24.6 | LEAN | LOSS |
| 2026-05-29 | MLB | SPREAD | home | 5 | 1.65 | -135 | 1 | 0 | 1 | 96.6 | STANDARD | WIN |
| 2026-05-29 | MLB | SPREAD | away | 5 | 2.25 | -184 | 0 | 0 | 0 | 46.7 | LEAN | WIN |
| 2026-05-29 | MLB | SPREAD | home | 4 | 1.65 | -175 | 0 | 0 | 0 | 63.7 | LEAN | LOSS |
| 2026-05-29 | NHL | SPREAD | away | 5 | 3 | -118 | 0 | 0 | 0 | 27.4 | LEAN | LOSS |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 1.65 | -106 | 0 | 0 | 0 | 43.7 | LEAN | LOSS |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 2.25 | -112 | 0 | 0 | 0 | 26.0 | LEAN | WIN |
| 2026-05-29 | MLB | TOTAL | over | 1 | 0 | +101 | 0 | 1 | -1 | -42.2 | MUTE | WIN |
| 2026-05-29 | MLB | TOTAL | over | 4 | 1.65 | -103 | 1 | 0 | 1 | 71.7 | STANDARD | WIN |
| 2026-05-29 | MLB | TOTAL | over | 4 | 0.75 | -109 | 0 | 0 | 0 | 43.7 | LEAN | WIN |
| 2026-05-29 | MLB | TOTAL | over | 4.5 | 0.3 | +105 | 0 | 0 | 0 | 49.6 | LEAN | WIN |
| 2026-05-29 | MLB | TOTAL | over | 3 | 0 | -108 | 0 | 0 | 0 | 27.5 | LEAN | WIN |
| 2026-05-29 | NHL | TOTAL | under | 5 | 2.25 | -106 | 0 | 0 | 0 | 41.0 | LEAN | LOSS |
| 2026-05-30 | MLB | ML | away | 5 | 2.5 | +132 | 2 | 0 | 2 | 145.3 | STRONG | LOSS |
| 2026-05-30 | MLB | ML | away | 4.5 | 2.75 | -125 | 1 | 1 | 0 | 52.9 | LEAN | WIN |
| 2026-05-30 | MLB | ML | home | 5 | 5 | -130 | 1 | 0 | 1 | 92.1 | STANDARD | LOSS |
| 2026-05-30 | MLB | ML | away | 4 | 3.75 | -132 | 1 | 1 | 0 | 7.3 | LEAN | WIN |
| 2026-05-30 | MLB | ML | away | 5 | 3.75 | -118 | 0 | 1 | -1 | -0.0 | MUTE | LOSS |
| 2026-05-30 | MLB | ML | home | 5 | 5 | -120 | 1 | 0 | 1 | 136.8 | STANDARD | WIN |
| 2026-05-30 | MLB | ML | away | 1 | 0 | +135 | 1 | 1 | 0 | 4.8 | LEAN | WIN |
| 2026-05-30 | MLB | ML | home | 4 | 2.75 | -130 | 0 | 0 | 0 | 12.6 | LEAN | WIN |
| 2026-05-30 | MLB | ML | home | 4 | 2.5 | +129 | 1 | 0 | 1 | 69.7 | STANDARD | WIN |
| 2026-05-30 | MLB | ML | away | 5 | 2.5 | +108 | 1 | 0 | 1 | 124.6 | STANDARD | WIN |
| 2026-05-30 | MLB | ML | home | 4 | 0.5 | +110 | 1 | 0 | 1 | 61.5 | STANDARD | WIN |
| 2026-05-30 | MLB | ML | home | 5 | 1.25 | -102 | 0 | 0 | 0 | 65.2 | LEAN | WIN |
| 2026-05-30 | MLB | ML | away | 5 | 3.75 | -122 | 0 | 0 | 0 | 49.9 | LEAN | LOSS |
| 2026-05-30 | NBA | ML | home | 5 | 0 | -154 | 5 | 2 | 3 | 151.2 | STRONG | LOSS |
| 2026-05-30 | MLB | SPREAD | home | 3 | 0.75 | -143 | 1 | 0 | 1 | 44.7 | STANDARD | LOSS |
| 2026-05-30 | MLB | SPREAD | away | 4 | 0 | +152 | 0 | 0 | 0 | 27.2 | LEAN | LOSS |
| 2026-05-30 | MLB | SPREAD | home | 5 | 1.65 | -120 | 1 | 0 | 1 | 93.1 | STANDARD | WIN |
| 2026-05-30 | NBA | SPREAD | away | 1 | 1.65 | -108 | 0 | 2 | -2 | -202.9 | MUTE | WIN |
| 2026-05-30 | MLB | TOTAL | over | 4.5 | 0.75 | +100 | 1 | 0 | 1 | 63.3 | STANDARD | WIN |
| 2026-05-30 | MLB | TOTAL | over | 4 | 2.25 | -116 | 1 | 0 | 1 | 74.8 | STANDARD | WIN |
| 2026-05-30 | MLB | TOTAL | under | 4 | 1.65 | -107 | 1 | 0 | 1 | 54.6 | STANDARD | LOSS |
| 2026-05-30 | MLB | TOTAL | under | 3 | 0.75 | -108 | 0 | 0 | 0 | 29.8 | LEAN | LOSS |
| 2026-05-30 | NBA | TOTAL | under | 5 | 2.5 | -109 | 1 | 0 | 1 | 239.5 | STANDARD | LOSS |
| 2026-05-31 | MLB | ML | away | 3 | 2.75 | -125 | 0 | 0 | 0 | 6.0 | LEAN | LOSS |
| 2026-05-31 | MLB | ML | away | 1 | 0 | -103 | 0 | 1 | -1 | -55.7 | MUTE | WIN |
| 2026-05-31 | MLB | ML | home | 2.5 | 2.75 | -115 | 1 | 1 | 0 | 26.6 | LEAN | WIN |
| 2026-05-31 | MLB | ML | away | 5 | 0 | +115 | 0 | 0 | 0 | 53.8 | LEAN | LOSS |
| 2026-05-31 | MLB | ML | away | 1 | 0 | +176 | 1 | 0 | 1 | 43.8 | STANDARD | LOSS |
| 2026-05-31 | MLB | ML | home | 5 | 5 | -164 | 0 | 0 | 0 | 50.0 | LEAN | WIN |
| 2026-05-31 | MLB | ML | away | 1 | 0 | -200 | 0 | 0 | 0 | -71.1 | LEAN | WIN |
| 2026-05-31 | MLB | ML | away | 2.5 | 0 | +135 | 1 | 0 | 1 | 11.7 | STANDARD | LOSS |
| 2026-05-31 | MLB | ML | away | 3 | 1.25 | -184 | 0 | 0 | 0 | 9.2 | LEAN | WIN |
| 2026-05-31 | MLB | ML | home | 2.5 | 1.25 | -232 | 0 | 1 | -1 | -5.4 | MUTE | WIN |
| 2026-05-31 | MLB | ML | home | 5 | 5 | -102 | 1 | 0 | 1 | 99.3 | STANDARD | WIN |
| 2026-05-31 | MLB | ML | away | 1 | 0 | -112 | 0 | 1 | -1 | -73.8 | MUTE | WIN |
| 2026-05-31 | MLB | ML | away | 4.5 | 2.5 | +110 | 0 | 0 | 0 | 10.1 | LEAN | LOSS |
| 2026-05-31 | MLB | SPREAD | away | 5 | 0 | -117 | 1 | 0 | 1 | 140.1 | STANDARD | LOSS |
| 2026-05-31 | MLB | TOTAL | under | 5 | 1.65 | -114 | 2 | 0 | 2 | 155.4 | STRONG | LOSS |
| 2026-05-31 | MLB | TOTAL | over | 1 | 0 | -103 | 1 | 1 | 0 | 25.6 | LEAN | WIN |
| 2026-05-31 | MLB | TOTAL | over | 4 | 0 | +101 | 0 | 0 | 0 | 51.8 | LEAN | LOSS |