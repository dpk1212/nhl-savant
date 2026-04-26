# V8 Contribution-Edge Map

_Generated 2026-04-26T13:46:09.194Z_

N = 103 picks (LOCKED=86, SHADOW=17)
Baseline: WR 46.6% · flat ROI -5.4% · units-wtd ROI -11.2%

> Per-wallet signal: `contribution = walletBase × convictionMult` (quality × size, already stored in walletDetails).

## A. Count of `contribution ≥ T` on pick side (H1)

Hypothesis: more high-contribution sharps on side ⇒ higher WR / ROI.


#### Threshold T = 30   |   ρ(qFor, won) = 0.177   ρ(qFor, flat ROI) = 0.217

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 1 | 9 | 33.3% | -40.1% | -46.2% |
| qFor ≥ 2 | 39 | 41.0% | -20.5% | -32.7% |
| qFor ≥ 3+ | 55 | 52.7% | +11.0% | +0.5% |

#### Threshold T = 40   |   ρ(qFor, won) = 0.206   ρ(qFor, flat ROI) = 0.227

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 2 | 0.0% | -100.0% | -100.0% |
| qFor ≥ 1 | 23 | 39.1% | -27.8% | -54.1% |
| qFor ≥ 2 | 35 | 45.7% | -8.3% | -11.8% |
| qFor ≥ 3+ | 43 | 53.5% | +13.3% | +1.4% |

#### Threshold T = 50   |   ρ(qFor, won) = 0.170   ρ(qFor, flat ROI) = 0.156

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 13 | 38.5% | -24.3% | -46.6% |
| qFor ≥ 1 | 33 | 51.5% | -1.5% | -9.9% |
| qFor ≥ 2 | 31 | 38.7% | -11.1% | -22.3% |
| qFor ≥ 3+ | 26 | 53.8% | +5.9% | +2.1% |

#### Threshold T = 60   |   ρ(qFor, won) = 0.225   ρ(qFor, flat ROI) = 0.136

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 33 | 45.5% | -12.5% | -11.5% |
| qFor ≥ 1 | 36 | 47.2% | -4.4% | -17.0% |
| qFor ≥ 2 | 16 | 56.3% | +20.7% | +9.0% |
| qFor ≥ 3+ | 18 | 38.9% | -17.6% | -18.9% |

#### Threshold T = 70   |   ρ(qFor, won) = 0.199   ρ(qFor, flat ROI) = 0.098

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 46 | 52.2% | +1.4% | +2.0% |
| qFor ≥ 1 | 35 | 34.3% | -29.3% | -35.7% |
| qFor ≥ 2 | 16 | 62.5% | +26.8% | +14.9% |
| qFor ≥ 3+ | 6 | 33.3% | -4.7% | -35.8% |

## B. Margin `contribution ≥ T` (qFor − qAgainst) (H2)

Hypothesis: positive margin of high-contribution sharps ⇒ edge.


#### Threshold T = 30   |   ρ(margin, won) = 0.247   ρ(margin, flat ROI) = 0.285

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 8 | 12.5% | -85.2% | -90.1% |
| margin +1 | 34 | 38.2% | -29.6% | -27.0% |
| margin +2 | 30 | 63.3% | +25.6% | +12.8% |
| margin ≥ +3 | 31 | 48.4% | +11.7% | -7.3% |

#### Threshold T = 40   |   ρ(margin, won) = 0.202   ρ(margin, flat ROI) = 0.204

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 14 | 21.4% | -37.1% | -63.6% |
| margin +1 | 36 | 52.8% | +2.0% | -5.5% |
| margin +2 | 30 | 46.7% | -9.5% | -16.7% |
| margin ≥ +3 | 23 | 52.2% | +7.6% | +4.2% |

#### Threshold T = 50   |   ρ(margin, won) = 0.145   ρ(margin, flat ROI) = 0.096

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 25 | 48.0% | +9.5% | -9.4% |
| margin +1 | 38 | 47.4% | -4.9% | -16.7% |
| margin +2 | 23 | 39.1% | -27.3% | -16.7% |
| margin ≥ +3 | 17 | 52.9% | +1.0% | -0.8% |

#### Threshold T = 60   |   ρ(margin, won) = 0.202   ρ(margin, flat ROI) = 0.072

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 43 | 51.2% | +10.1% | +6.2% |
| margin +1 | 36 | 41.7% | -19.9% | -26.1% |
| margin +2 | 12 | 50.0% | +3.7% | +3.3% |
| margin ≥ +3 | 12 | 41.7% | -26.8% | -24.2% |

#### Threshold T = 70   |   ρ(margin, won) = 0.202   ρ(margin, flat ROI) = 0.073

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 58 | 50.0% | +4.2% | +1.2% |
| margin +1 | 28 | 32.1% | -36.0% | -52.1% |
| margin +2 | 13 | 69.2% | +33.1% | +37.8% |
| margin ≥ +3 | 4 | 25.0% | -55.8% | -67.2% |

## C. Count × Margin grid at T = 50

Rows = # qFor (contrib ≥ 50) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 50

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| 0 | 11 / 45.5% / -10.6% | 2 / 0.0% / -100.0% | — | — | — |
| 1 | 26 / 50.0% / -6.9% | 6 / 66.7% / +38.0% | 1 / 0.0% / -100.0% | — | — |
| 2 | 17 / 35.3% / -28.0% | 10 / 30.0% / -39.2% | 3 / 66.7% / +16.6% | 1 / 100.0% / +475.0% | — |
| 3 | 4 / 100.0% / +99.9% | 4 / 75.0% / +12.2% | 1 / 100.0% / +295.0% | — | — |
| 4 | 4 / 50.0% / -2.4% | 1 / 0.0% / -100.0% | 2 / 0.0% / -100.0% | 1 / 100.0% / +90.9% | 1 / 0.0% / -100.0% |
| 5 | 1 / 100.0% / +26.7% | 2 / 0.0% / -100.0% | 2 / 0.0% / -100.0% | — | — |
| 6 | 1 / 0.0% / -100.0% | 1 / 100.0% / +90.9% | — | 1 / 100.0% / +110.0% | — |

## C. Count × Margin grid at T = 40

Rows = # qFor (contrib ≥ 40) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 40

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 2 / 0.0% / -100.0% | — | — | — | — | — | — | — | — |
| 1 | 19 / 42.1% / -22.4% | 3 / 33.3% / -37.7% | 1 / 0.0% / -100.0% | — | — | — | — | — | — |
| 2 | 18 / 44.4% / -13.7% | 13 / 61.5% / +27.5% | 3 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | — | — | — | — | — |
| 3 | 8 / 62.5% / +21.6% | 8 / 50.0% / +4.6% | 3 / 100.0% / +80.2% | 3 / 66.7% / +131.2% | — | — | — | — | — |
| 4 | 2 / 50.0% / -6.1% | 1 / 0.0% / -100.0% | 2 / 50.0% / -33.1% | 1 / 0.0% / -100.0% | — | — | — | — | 1 / 0.0% / -100.0% |
| 5 | 3 / 66.7% / +30.2% | — | 3 / 33.3% / +31.7% | 2 / 50.0% / -4.5% | — | — | — | — | — |
| 6 | 1 / 100.0% / +26.7% | 1 / 100.0% / +90.9% | 2 / 0.0% / -100.0% | 1 / 100.0% / +110.0% | — | — | — | — | — |
| 7 | 1 / 0.0% / -100.0% | — | — | — | — | — | — | — | — |

## D. Continuous Δcontribution (sumContrib_F − sumContrib_A) terciles

No threshold. Sort all picks by Δ and cut into thirds.

ρ(Δcontribution, won) = 0.044   |   ρ(Δcontribution, flat ROI) = 0.091


#### Terciles

| Bucket | N | mean Δ | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- | --- |
| Low  (Δ ≤ 77.2) | 34 | 41.5 | 41.2% | -13.1% | -0.8% |
| Mid  (77.3 .. 134.1) | 34 | 107.0 | 58.8% | +16.7% | -18.2% |
| High (Δ ≥ 134.6) | 35 | 235.2 | 40.0% | -19.5% | -12.3% |

#### Absolute Δcontribution cuts

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| Δ ≤ 0 (opposition matched/led) | 3 | 0.0% | -100.0% | -100.0% |
| 0 < Δ ≤ 50 | 11 | 27.3% | -53.9% | -33.4% |
| 50 < Δ ≤ 100 | 32 | 56.3% | +22.2% | +3.8% |
| Δ > 100 | 57 | 47.4% | -6.6% | -11.7% |

## E. Proposed sizing tiers (derived from §A/B/C)

Rules (all use `contribution ≥ 50` wallet count):
- **STRONG**  : qFor ≥ 3 AND qAgainst = 0  **OR**  qFor ≥ 2 AND margin ≥ +1
- **STANDARD**: qFor ≥ 1 AND margin ≥ +1 AND maxContrib_F ≥ 50
- **LEAN**    : qFor ≥ 1 AND margin ≥ 0
- **MUTE**    : margin < 0


#### Tier performance on current V8 sample

| Tier | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| STRONG | 52 | 44.2% | -11.8% | -8.3% |
| STANDARD | 26 | 50.0% | -6.9% | -21.9% |
| LEAN | 21 | 52.4% | +2.9% | -11.1% |
| MUTE | 4 | 25.0% | +43.8% | +0.9% |

#### Current V8 ★/units assigned within each proposed tier

| Tier | N | mean ★ | mean units |
| --- | --- | --- | --- |
| STRONG | 52 | 3.63 | 1.43 |
| STANDARD | 26 | 2.92 | 0.91 |
| LEAN | 21 | 3.07 | 0.84 |
| MUTE | 4 | 3.50 | 0.71 |

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