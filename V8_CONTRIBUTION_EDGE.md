# V8 Contribution-Edge Map

_Generated 2026-04-22T14:15:39.054Z_

N = 52 picks (LOCKED=47, SHADOW=5)
Baseline: WR 46.2% · flat ROI -0.1% · units-wtd ROI -12.6%

> Per-wallet signal: `contribution = walletBase × convictionMult` (quality × size, already stored in walletDetails).

## A. Count of `contribution ≥ T` on pick side (H1)

Hypothesis: more high-contribution sharps on side ⇒ higher WR / ROI.


#### Threshold T = 30   |   ρ(qFor, won) = 0.152   ρ(qFor, flat ROI) = 0.231

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 1 | 2 | 0.0% | -100.0% | -100.0% |
| qFor ≥ 2 | 23 | 43.5% | -18.3% | -36.8% |
| qFor ≥ 3+ | 27 | 51.9% | +22.9% | +5.1% |

#### Threshold T = 40   |   ρ(qFor, won) = 0.127   ρ(qFor, flat ROI) = 0.234

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 1 | 0.0% | -100.0% | — |
| qFor ≥ 1 | 14 | 42.9% | -19.8% | -56.6% |
| qFor ≥ 2 | 16 | 43.8% | -15.1% | -26.8% |
| qFor ≥ 3+ | 21 | 52.4% | +29.3% | +13.2% |

#### Threshold T = 50   |   ρ(qFor, won) = 0.138   ρ(qFor, flat ROI) = 0.186

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 6 | 33.3% | -33.1% | -74.4% |
| qFor ≥ 1 | 20 | 55.0% | +2.8% | -10.2% |
| qFor ≥ 2 | 15 | 40.0% | +8.9% | -3.4% |
| qFor ≥ 3+ | 11 | 45.5% | +0.4% | -11.5% |

#### Threshold T = 60   |   ρ(qFor, won) = 0.138   ρ(qFor, flat ROI) = 0.102

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 21 | 57.1% | +9.8% | +15.1% |
| qFor ≥ 1 | 17 | 41.2% | -16.6% | -45.5% |
| qFor ≥ 2 | 7 | 42.9% | +26.9% | -8.1% |
| qFor ≥ 3+ | 7 | 28.6% | -16.3% | -22.3% |

#### Threshold T = 70   |   ρ(qFor, won) = 0.156   ρ(qFor, flat ROI) = 0.140

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 23 | 60.9% | +16.1% | +18.3% |
| qFor ≥ 1 | 20 | 25.0% | -47.5% | -69.4% |
| qFor ≥ 2 | 6 | 66.7% | +79.8% | +44.2% |
| qFor ≥ 3+ | 3 | 33.3% | +31.7% | +12.9% |

## B. Margin `contribution ≥ T` (qFor − qAgainst) (H2)

Hypothesis: positive margin of high-contribution sharps ⇒ edge.


#### Threshold T = 30   |   ρ(margin, won) = 0.218   ρ(margin, flat ROI) = 0.320

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 6 | 16.7% | -80.2% | -88.1% |
| margin +1 | 13 | 38.5% | -30.1% | -31.3% |
| margin +2 | 16 | 56.3% | +14.5% | -11.1% |
| margin ≥ +3 | 17 | 52.9% | +37.4% | +9.6% |

#### Threshold T = 40   |   ρ(margin, won) = 0.107   ρ(margin, flat ROI) = 0.194

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 8 | 37.5% | +10.1% | -19.9% |
| margin +1 | 18 | 50.0% | -1.0% | -33.8% |
| margin +2 | 16 | 37.5% | -25.8% | -29.8% |
| margin ≥ +3 | 10 | 60.0% | +34.6% | +24.0% |

#### Threshold T = 50   |   ρ(margin, won) = 0.112   ρ(margin, flat ROI) = 0.087

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 13 | 46.2% | +24.2% | +0.1% |
| margin +1 | 22 | 50.0% | +2.9% | -11.7% |
| margin +2 | 10 | 40.0% | -27.2% | -17.0% |
| margin ≥ +3 | 7 | 42.9% | -15.7% | -18.8% |

#### Threshold T = 60   |   ρ(margin, won) = 0.137   ρ(margin, flat ROI) = 0.050

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 28 | 57.1% | +26.3% | +21.6% |
| margin +1 | 15 | 33.3% | -41.3% | -66.4% |
| margin +2 | 4 | 50.0% | +47.3% | +30.6% |
| margin ≥ +3 | 5 | 20.0% | -61.8% | -52.3% |

#### Threshold T = 70   |   ρ(margin, won) = 0.171   ρ(margin, flat ROI) = 0.111

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 30 | 53.3% | +15.0% | +9.5% |
| margin +1 | 16 | 31.3% | -39.7% | -66.2% |
| margin +2 | 4 | 75.0% | +95.1% | +72.7% |
| margin ≥ +3 | 2 | 0.0% | -100.0% | -100.0% |

## C. Count × Margin grid at T = 50

Rows = # qFor (contrib ≥ 50) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 50

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| 0 | 6 / 33.3% / -33.1% | — | — | — | — |
| 1 | 16 / 56.3% / +4.0% | 4 / 50.0% / -1.8% | — | — | — |
| 2 | 8 / 37.5% / -23.9% | 5 / 20.0% / -59.0% | 1 / 100.0% / +145.0% | 1 / 100.0% / +475.0% | — |
| 3 | 1 / 100.0% / +105.0% | 1 / 100.0% / +18.7% | 1 / 100.0% / +295.0% | — | — |
| 4 | 3 / 33.3% / -35.2% | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |
| 5 | — | 1 / 0.0% / -100.0% | — | — | — |
| 6 | 1 / 0.0% / -100.0% | 1 / 100.0% / +90.9% | — | — | — |

## C. Count × Margin grid at T = 40

Rows = # qFor (contrib ≥ 40) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 40

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 1 / 0.0% / -100.0% | — | — | — | — | — | — | — | — |
| 1 | 11 / 45.5% / -15.0% | 3 / 33.3% / -37.7% | — | — | — | — | — | — | — |
| 2 | 11 / 45.5% / -13.9% | 4 / 50.0% / +2.8% | — | 1 / 0.0% / -100.0% | — | — | — | — | — |
| 3 | 4 / 75.0% / +41.5% | 3 / 33.3% / -20.0% | 2 / 100.0% / +118.0% | 2 / 100.0% / +246.8% | — | — | — | — | — |
| 4 | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | — | — | — | — | 1 / 0.0% / -100.0% |
| 5 | 2 / 50.0% / -2.8% | — | 1 / 100.0% / +295.0% | 1 / 0.0% / -100.0% | — | — | — | — | — |
| 6 | — | 1 / 100.0% / +90.9% | — | — | — | — | — | — | — |
| 7 | 1 / 0.0% / -100.0% | — | — | — | — | — | — | — | — |

## D. Continuous Δcontribution (sumContrib_F − sumContrib_A) terciles

No threshold. Sort all picks by Δ and cut into thirds.

ρ(Δcontribution, won) = -0.044   |   ρ(Δcontribution, flat ROI) = 0.073


#### Terciles

| Bucket | N | mean Δ | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- | --- |
| Low  (Δ ≤ 82.1) | 17 | 40.0 | 52.9% | +19.7% | +8.1% |
| Mid  (86.2 .. 131.9) | 17 | 107.3 | 52.9% | +6.8% | -21.2% |
| High (Δ ≥ 134.6) | 18 | 233.8 | 33.3% | -25.2% | -16.5% |

#### Absolute Δcontribution cuts

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| Δ ≤ 0 (opposition matched/led) | 1 | 0.0% | -100.0% | -100.0% |
| 0 < Δ ≤ 50 | 6 | 16.7% | -80.2% | -81.7% |
| 50 < Δ ≤ 100 | 16 | 68.8% | +57.5% | +8.4% |
| Δ > 100 | 29 | 41.4% | -11.8% | -12.5% |

## E. Proposed sizing tiers (derived from §A/B/C)

Rules (all use `contribution ≥ 50` wallet count):
- **STRONG**  : qFor ≥ 3 AND qAgainst = 0  **OR**  qFor ≥ 2 AND margin ≥ +1
- **STANDARD**: qFor ≥ 1 AND margin ≥ +1 AND maxContrib_F ≥ 50
- **LEAN**    : qFor ≥ 1 AND margin ≥ 0
- **MUTE**    : margin < 0


#### Tier performance on current V8 sample

| Tier | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| STRONG | 23 | 39.1% | -16.6% | -17.0% |
| STANDARD | 16 | 56.3% | +4.0% | -11.2% |
| LEAN | 12 | 41.7% | -13.4% | -33.8% |
| MUTE | 1 | 100.0% | +475.0% | +475.0% |

#### Current V8 ★/units assigned within each proposed tier

| Tier | N | mean ★ | mean units |
| --- | --- | --- | --- |
| STRONG | 23 | 3.48 | 1.21 |
| STANDARD | 16 | 3.03 | 1.11 |
| LEAN | 12 | 2.79 | 0.58 |
| MUTE | 1 | 3.50 | 0.50 |

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