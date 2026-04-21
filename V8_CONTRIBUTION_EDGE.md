# V8 Contribution-Edge Map

_Generated 2026-04-21T12:47:17.859Z_

N = 35 picks (LOCKED=31, SHADOW=4)
Baseline: WR 51.4% · flat ROI +1.6% · units-wtd ROI +2.0%

> Per-wallet signal: `contribution = walletBase × convictionMult` (quality × size, already stored in walletDetails).

## A. Count of `contribution ≥ T` on pick side (H1)

Hypothesis: more high-contribution sharps on side ⇒ higher WR / ROI.


#### Threshold T = 30   |   ρ(qFor, won) = 0.079   ρ(qFor, flat ROI) = 0.151

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 1 | 1 | 0.0% | -100.0% | -100.0% |
| qFor ≥ 2 | 17 | 52.9% | +1.4% | -1.2% |
| qFor ≥ 3+ | 17 | 52.9% | +7.8% | +6.1% |

#### Threshold T = 40   |   ρ(qFor, won) = 0.071   ρ(qFor, flat ROI) = 0.211

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 1 | 0.0% | -100.0% | — |
| qFor ≥ 1 | 8 | 50.0% | -8.4% | -26.7% |
| qFor ≥ 2 | 13 | 53.8% | +4.5% | +2.0% |
| qFor ≥ 3+ | 13 | 53.8% | +12.7% | +10.2% |

#### Threshold T = 50   |   ρ(qFor, won) = 0.103   ρ(qFor, flat ROI) = 0.174

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 4 | 25.0% | -58.3% | -58.3% |
| qFor ≥ 1 | 14 | 71.4% | +35.9% | +43.9% |
| qFor ≥ 2 | 10 | 30.0% | -42.6% | -36.7% |
| qFor ≥ 3+ | 7 | 57.1% | +30.4% | +5.1% |

#### Threshold T = 60   |   ρ(qFor, won) = 0.170   ρ(qFor, flat ROI) = 0.125

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 15 | 60.0% | +11.7% | +30.0% |
| qFor ≥ 1 | 12 | 50.0% | -2.3% | -23.2% |
| qFor ≥ 2 | 5 | 40.0% | -37.4% | -25.3% |
| qFor ≥ 3+ | 3 | 33.3% | +31.7% | -1.2% |

#### Threshold T = 70   |   ρ(qFor, won) = 0.193   ρ(qFor, flat ROI) = 0.159

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 17 | 64.7% | +20.1% | +33.6% |
| qFor ≥ 1 | 13 | 30.8% | -38.0% | -58.1% |
| qFor ≥ 2 | 3 | 66.7% | +4.3% | +28.0% |
| qFor ≥ 3+ | 2 | 50.0% | +97.5% | +31.7% |

## B. Margin `contribution ≥ T` (qFor − qAgainst) (H2)

Hypothesis: positive margin of high-contribution sharps ⇒ edge.


#### Threshold T = 30   |   ρ(margin, won) = 0.128   ρ(margin, flat ROI) = 0.274

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 5 | 20.0% | -76.3% | -81.7% |
| margin +1 | 8 | 50.0% | -5.7% | +3.2% |
| margin +2 | 11 | 63.6% | +22.5% | +4.3% |
| margin ≥ +3 | 11 | 54.5% | +21.4% | +17.3% |

#### Threshold T = 40   |   ρ(margin, won) = 0.124   ρ(margin, flat ROI) = 0.296

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 5 | 40.0% | -38.9% | -44.4% |
| margin +1 | 12 | 50.0% | -4.4% | -14.3% |
| margin +2 | 10 | 50.0% | -5.3% | -12.7% |
| margin ≥ +3 | 8 | 62.5% | +44.4% | +30.3% |

#### Threshold T = 50   |   ρ(margin, won) = 0.185   ρ(margin, flat ROI) = 0.211

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 9 | 33.3% | -37.8% | -44.0% |
| margin +1 | 15 | 66.7% | +40.6% | +42.2% |
| margin +2 | 7 | 42.9% | -30.3% | -18.0% |
| margin ≥ +3 | 4 | 50.0% | -0.2% | -24.4% |

#### Threshold T = 60   |   ρ(margin, won) = 0.282   ρ(margin, flat ROI) = 0.213

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 20 | 55.0% | +4.3% | +17.2% |
| margin +1 | 10 | 50.0% | -12.0% | -30.3% |
| margin +2 | 4 | 50.0% | +47.3% | +30.6% |
| margin ≥ +3 | 1 | 0.0% | -100.0% | -100.0% |

#### Threshold T = 70   |   ρ(margin, won) = 0.321   ρ(margin, flat ROI) = 0.281

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 22 | 54.5% | +2.1% | +15.2% |
| margin +1 | 10 | 40.0% | -28.0% | -54.7% |
| margin +2 | 2 | 100.0% | +194.7% | +161.2% |
| margin ≥ +3 | 1 | 0.0% | -100.0% | -100.0% |

## C. Count × Margin grid at T = 50

Rows = # qFor (contrib ≥ 50) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 50

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| 0 | 4 / 25.0% / -58.3% | — | — | — | — |
| 1 | 10 / 80.0% / +50.9% | 4 / 50.0% / -1.8% | — | — | — |
| 2 | 6 / 33.3% / -38.5% | 4 / 25.0% / -48.8% | — | — | — |
| 3 | 1 / 100.0% / +105.0% | 1 / 100.0% / +18.7% | 1 / 100.0% / +295.0% | — | — |
| 4 | 2 / 50.0% / -2.8% | — | — | — | 1 / 0.0% / -100.0% |
| 5 | — | — | — | — | — |
| 6 | 1 / 0.0% / -100.0% | — | — | — | — |

## C. Count × Margin grid at T = 40

Rows = # qFor (contrib ≥ 40) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 40

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 1 / 0.0% / -100.0% | — | — | — | — | — | — | — | — |
| 1 | 7 / 42.9% / -22.0% | 1 / 100.0% / +87.0% | — | — | — | — | — | — | — |
| 2 | 8 / 62.5% / +18.4% | 4 / 50.0% / +2.8% | — | 1 / 0.0% / -100.0% | — | — | — | — | — |
| 3 | 4 / 75.0% / +41.5% | 1 / 0.0% / -100.0% | 1 / 100.0% / +90.9% | 1 / 100.0% / +18.7% | — | — | — | — | — |
| 4 | — | — | 1 / 0.0% / -100.0% | — | — | — | — | — | 1 / 0.0% / -100.0% |
| 5 | 2 / 50.0% / -2.8% | — | 1 / 100.0% / +295.0% | — | — | — | — | — | — |
| 6 | — | — | — | — | — | — | — | — | — |
| 7 | 1 / 0.0% / -100.0% | — | — | — | — | — | — | — | — |

## D. Continuous Δcontribution (sumContrib_F − sumContrib_A) terciles

No threshold. Sort all picks by Δ and cut into thirds.

ρ(Δcontribution, won) = -0.001   |   ρ(Δcontribution, flat ROI) = 0.183


#### Terciles

| Bucket | N | mean Δ | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- | --- |
| Low  (Δ ≤ 73.1) | 11 | 23.3 | 36.4% | -36.0% | -34.9% |
| Mid  (77.2 .. 131.9) | 12 | 103.6 | 75.0% | +41.4% | +33.2% |
| High (Δ ≥ 137.7) | 12 | 235.8 | 41.7% | -3.7% | +1.5% |

#### Absolute Δcontribution cuts

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| Δ ≤ 0 (opposition matched/led) | 1 | 0.0% | -100.0% | -100.0% |
| 0 < Δ ≤ 50 | 6 | 16.7% | -80.2% | -81.7% |
| 50 < Δ ≤ 100 | 9 | 88.9% | +71.8% | +77.0% |
| Δ > 100 | 19 | 47.4% | -0.5% | +0.3% |

## E. Proposed sizing tiers (derived from §A/B/C)

Rules (all use `contribution ≥ 50` wallet count):
- **STRONG**  : qFor ≥ 3 AND qAgainst = 0  **OR**  qFor ≥ 2 AND margin ≥ +1
- **STANDARD**: qFor ≥ 1 AND margin ≥ +1 AND maxContrib_F ≥ 50
- **LEAN**    : qFor ≥ 1 AND margin ≥ 0
- **MUTE**    : margin < 0


#### Tier performance on current V8 sample

| Tier | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| STRONG | 16 | 43.8% | -7.1% | -12.0% |
| STANDARD | 10 | 80.0% | +50.9% | +53.7% |
| LEAN | 9 | 33.3% | -37.8% | -44.0% |
| MUTE | 0 | — | — | — |

#### Current V8 ★/units assigned within each proposed tier

| Tier | N | mean ★ | mean units |
| --- | --- | --- | --- |
| STRONG | 16 | 3.41 | 1.11 |
| STANDARD | 10 | 2.85 | 0.93 |
| LEAN | 9 | 2.72 | 0.56 |
| MUTE | 0 | — | — |

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