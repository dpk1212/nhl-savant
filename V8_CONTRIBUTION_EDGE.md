# V8 Contribution-Edge Map

_Generated 2026-04-24T13:50:49.281Z_

N = 74 picks (LOCKED=68, SHADOW=6)
Baseline: WR 45.9% · flat ROI -4.7% · units-wtd ROI -9.4%

> Per-wallet signal: `contribution = walletBase × convictionMult` (quality × size, already stored in walletDetails).

## A. Count of `contribution ≥ T` on pick side (H1)

Hypothesis: more high-contribution sharps on side ⇒ higher WR / ROI.


#### Threshold T = 30   |   ρ(qFor, won) = 0.286   ρ(qFor, flat ROI) = 0.305

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 1 | 3 | 0.0% | -100.0% | -100.0% |
| qFor ≥ 2 | 29 | 37.9% | -28.2% | -47.3% |
| qFor ≥ 3+ | 42 | 54.8% | +18.2% | +11.4% |

#### Threshold T = 40   |   ρ(qFor, won) = 0.257   ρ(qFor, flat ROI) = 0.284

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 1 | 0.0% | -100.0% | — |
| qFor ≥ 1 | 16 | 37.5% | -29.9% | -63.3% |
| qFor ≥ 2 | 24 | 37.5% | -27.1% | -42.6% |
| qFor ≥ 3+ | 33 | 57.6% | +26.6% | +20.1% |

#### Threshold T = 50   |   ρ(qFor, won) = 0.241   ρ(qFor, flat ROI) = 0.214

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 8 | 37.5% | -24.2% | -61.7% |
| qFor ≥ 1 | 25 | 48.0% | -9.3% | -20.0% |
| qFor ≥ 2 | 22 | 36.4% | -12.5% | -26.3% |
| qFor ≥ 3+ | 19 | 57.9% | +18.5% | +19.2% |

#### Threshold T = 60   |   ρ(qFor, won) = 0.264   ρ(qFor, flat ROI) = 0.167

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 27 | 48.1% | -7.0% | -8.6% |
| qFor ≥ 1 | 21 | 38.1% | -22.5% | -47.8% |
| qFor ≥ 2 | 13 | 53.8% | +23.5% | +15.2% |
| qFor ≥ 3+ | 13 | 46.2% | +0.5% | +7.2% |

#### Threshold T = 70   |   ρ(qFor, won) = 0.241   ρ(qFor, flat ROI) = 0.151

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 32 | 50.0% | -2.9% | -4.7% |
| qFor ≥ 1 | 25 | 32.0% | -33.9% | -44.3% |
| qFor ≥ 2 | 14 | 64.3% | +35.4% | +29.2% |
| qFor ≥ 3+ | 3 | 33.3% | +31.7% | +12.9% |

## B. Margin `contribution ≥ T` (qFor − qAgainst) (H2)

Hypothesis: positive margin of high-contribution sharps ⇒ edge.


#### Threshold T = 30   |   ρ(margin, won) = 0.338   ρ(margin, flat ROI) = 0.376

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 7 | 14.3% | -83.0% | -89.2% |
| margin +1 | 20 | 30.0% | -49.3% | -58.1% |
| margin +2 | 22 | 59.1% | +19.6% | +6.6% |
| margin ≥ +3 | 25 | 56.0% | +31.5% | +14.9% |

#### Threshold T = 40   |   ρ(margin, won) = 0.243   ρ(margin, flat ROI) = 0.268

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 10 | 30.0% | -11.9% | -40.1% |
| margin +1 | 23 | 47.8% | -9.8% | -39.7% |
| margin +2 | 24 | 37.5% | -25.1% | -31.2% |
| margin ≥ +3 | 17 | 64.7% | +35.1% | +35.6% |

#### Threshold T = 50   |   ρ(margin, won) = 0.191   ρ(margin, flat ROI) = 0.131

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 18 | 50.0% | +18.6% | -6.2% |
| margin +1 | 28 | 42.9% | -12.5% | -25.1% |
| margin +2 | 15 | 33.3% | -38.4% | -30.1% |
| margin ≥ +3 | 13 | 61.5% | +18.5% | +24.8% |

#### Threshold T = 60   |   ρ(margin, won) = 0.246   ρ(margin, flat ROI) = 0.097

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 35 | 51.4% | +12.9% | +3.5% |
| margin +1 | 20 | 35.0% | -35.7% | -39.0% |
| margin +2 | 10 | 50.0% | +11.1% | +11.6% |
| margin ≥ +3 | 9 | 44.4% | -22.1% | -9.2% |

#### Threshold T = 70   |   ρ(margin, won) = 0.253   ρ(margin, flat ROI) = 0.119

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 42 | 47.6% | +2.2% | -3.5% |
| margin +1 | 18 | 33.3% | -35.5% | -53.4% |
| margin +2 | 12 | 66.7% | +33.0% | +38.4% |
| margin ≥ +3 | 2 | 0.0% | -100.0% | -100.0% |

## C. Count × Margin grid at T = 50

Rows = # qFor (contrib ≥ 50) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 50

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| 0 | 8 / 37.5% / -24.2% | — | — | — | — |
| 1 | 19 / 47.4% / -12.4% | 5 / 60.0% / +20.6% | 1 / 0.0% / -100.0% | — | — |
| 2 | 11 / 27.3% / -44.6% | 8 / 25.0% / -51.0% | 2 / 100.0% / +74.9% | 1 / 100.0% / +475.0% | — |
| 3 | 3 / 100.0% / +107.6% | 3 / 66.7% / +4.9% | 1 / 100.0% / +295.0% | — | — |
| 4 | 4 / 50.0% / -2.4% | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |
| 5 | 1 / 100.0% / +26.7% | 2 / 0.0% / -100.0% | — | — | — |
| 6 | 1 / 0.0% / -100.0% | 1 / 100.0% / +90.9% | — | 1 / 100.0% / +110.0% | — |

## C. Count × Margin grid at T = 40

Rows = # qFor (contrib ≥ 40) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 40

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 1 / 0.0% / -100.0% | — | — | — | — | — | — | — | — |
| 1 | 13 / 38.5% / -28.1% | 3 / 33.3% / -37.7% | — | — | — | — | — | — | — |
| 2 | 15 / 40.0% / -23.2% | 6 / 50.0% / -0.3% | 2 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | — | — | — | — | — |
| 3 | 6 / 66.7% / +32.7% | 7 / 42.9% / -7.7% | 3 / 100.0% / +80.2% | 2 / 100.0% / +246.8% | — | — | — | — | — |
| 4 | 2 / 50.0% / -6.1% | — | 1 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | — | — | — | — | 1 / 0.0% / -100.0% |
| 5 | 3 / 66.7% / +30.2% | — | 1 / 100.0% / +295.0% | 1 / 0.0% / -100.0% | — | — | — | — | — |
| 6 | 1 / 100.0% / +26.7% | 1 / 100.0% / +90.9% | 1 / 0.0% / -100.0% | 1 / 100.0% / +110.0% | — | — | — | — | — |
| 7 | 1 / 0.0% / -100.0% | — | — | — | — | — | — | — | — |

## D. Continuous Δcontribution (sumContrib_F − sumContrib_A) terciles

No threshold. Sort all picks by Δ and cut into thirds.

ρ(Δcontribution, won) = 0.152   |   ρ(Δcontribution, flat ROI) = 0.179


#### Terciles

| Bucket | N | mean Δ | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- | --- |
| Low  (Δ ≤ 86.2) | 24 | 45.6 | 41.7% | -6.7% | -23.8% |
| Mid  (87.9 .. 135.5) | 25 | 112.8 | 48.0% | -7.8% | -30.3% |
| High (Δ ≥ 137.7) | 25 | 251.1 | 48.0% | +0.3% | +11.2% |

#### Absolute Δcontribution cuts

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| Δ ≤ 0 (opposition matched/led) | 2 | 0.0% | -100.0% | -100.0% |
| 0 < Δ ≤ 50 | 7 | 14.3% | -83.0% | -86.4% |
| 50 < Δ ≤ 100 | 21 | 57.1% | +29.8% | -7.8% |
| Δ > 100 | 44 | 47.7% | -4.4% | -0.5% |

## E. Proposed sizing tiers (derived from §A/B/C)

Rules (all use `contribution ≥ 50` wallet count):
- **STRONG**  : qFor ≥ 3 AND qAgainst = 0  **OR**  qFor ≥ 2 AND margin ≥ +1
- **STANDARD**: qFor ≥ 1 AND margin ≥ +1 AND maxContrib_F ≥ 50
- **LEAN**    : qFor ≥ 1 AND margin ≥ 0
- **MUTE**    : margin < 0


#### Tier performance on current V8 sample

| Tier | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| STRONG | 37 | 43.2% | -12.1% | -4.7% |
| STANDARD | 19 | 47.4% | -12.4% | -22.9% |
| LEAN | 16 | 50.0% | -2.5% | -16.9% |
| MUTE | 2 | 50.0% | +187.5% | +55.4% |

#### Current V8 ★/units assigned within each proposed tier

| Tier | N | mean ★ | mean units |
| --- | --- | --- | --- |
| STRONG | 37 | 3.49 | 1.36 |
| STANDARD | 19 | 2.97 | 1.08 |
| LEAN | 16 | 2.81 | 0.66 |
| MUTE | 2 | 3.00 | 0.93 |

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