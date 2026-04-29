# V8 Contribution-Edge Map

_Generated 2026-04-29T14:37:33.739Z_

N = 173 picks (LOCKED=136, SHADOW=37)
Baseline: WR 46.8% · flat ROI -7.9% · units-wtd ROI -8.4%

> Per-wallet signal: `contribution = walletBase × convictionMult` (quality × size, already stored in walletDetails).

## A. Count of `contribution ≥ T` on pick side (H1)

Hypothesis: more high-contribution sharps on side ⇒ higher WR / ROI.


#### Threshold T = 30   |   ρ(qFor, won) = 0.200   ρ(qFor, flat ROI) = 0.188

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 1 | 0.0% | -100.0% | — |
| qFor ≥ 1 | 15 | 33.3% | -36.6% | -50.4% |
| qFor ≥ 2 | 73 | 43.8% | -16.0% | -16.6% |
| qFor ≥ 3+ | 84 | 52.4% | +5.3% | -0.7% |

#### Threshold T = 40   |   ρ(qFor, won) = 0.219   ρ(qFor, flat ROI) = 0.182

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 4 | 0.0% | -100.0% | -100.0% |
| qFor ≥ 1 | 35 | 40.0% | -22.7% | -37.8% |
| qFor ≥ 2 | 70 | 48.6% | -6.7% | -5.2% |
| qFor ≥ 3+ | 64 | 51.6% | +4.5% | -2.3% |

#### Threshold T = 50   |   ρ(qFor, won) = 0.199   ρ(qFor, flat ROI) = 0.147

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 23 | 26.1% | -47.9% | -67.8% |
| qFor ≥ 1 | 63 | 52.4% | +1.3% | +10.8% |
| qFor ≥ 2 | 51 | 43.1% | -11.5% | -25.1% |
| qFor ≥ 3+ | 36 | 55.6% | +6.6% | +6.8% |

#### Threshold T = 60   |   ρ(qFor, won) = 0.266   ρ(qFor, flat ROI) = 0.150

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 50 | 36.0% | -29.4% | -25.4% |
| qFor ≥ 1 | 71 | 53.5% | +5.0% | +2.5% |
| qFor ≥ 2 | 28 | 50.0% | -1.9% | -4.2% |
| qFor ≥ 3+ | 24 | 45.8% | -8.6% | -12.6% |

#### Threshold T = 70   |   ρ(qFor, won) = 0.224   ρ(qFor, flat ROI) = 0.105

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 80 | 47.5% | -7.8% | -9.1% |
| qFor ≥ 1 | 62 | 41.9% | -17.4% | -11.0% |
| qFor ≥ 2 | 23 | 60.9% | +15.6% | +1.7% |
| qFor ≥ 3+ | 8 | 37.5% | -4.1% | -18.5% |

## B. Margin `contribution ≥ T` (qFor − qAgainst) (H2)

Hypothesis: positive margin of high-contribution sharps ⇒ edge.


#### Threshold T = 30   |   ρ(margin, won) = 0.243   ρ(margin, flat ROI) = 0.215

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 14 | 14.3% | -76.4% | -91.5% |
| margin +1 | 62 | 43.5% | -15.4% | -5.6% |
| margin +2 | 50 | 58.0% | +10.0% | +2.6% |
| margin ≥ +3 | 47 | 48.9% | +3.2% | -12.1% |

#### Threshold T = 40   |   ρ(margin, won) = 0.215   ρ(margin, flat ROI) = 0.159

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 24 | 29.2% | -28.1% | -32.5% |
| margin +1 | 62 | 50.0% | -3.2% | -3.0% |
| margin +2 | 52 | 48.1% | -9.6% | -9.8% |
| margin ≥ +3 | 35 | 51.4% | -0.1% | -5.5% |

#### Threshold T = 50   |   ρ(margin, won) = 0.200   ρ(margin, flat ROI) = 0.115

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 43 | 37.2% | -16.7% | -14.5% |
| margin +1 | 72 | 51.4% | +0.5% | -4.6% |
| margin +2 | 37 | 43.2% | -22.0% | -22.7% |
| margin ≥ +3 | 21 | 57.1% | +5.5% | +9.9% |

#### Threshold T = 60   |   ρ(margin, won) = 0.240   ρ(margin, flat ROI) = 0.088

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 68 | 45.6% | -2.4% | +3.3% |
| margin +1 | 72 | 45.8% | -14.6% | -19.3% |
| margin +2 | 19 | 57.9% | +9.1% | +3.5% |
| margin ≥ +3 | 14 | 42.9% | -23.3% | -17.2% |

#### Threshold T = 70   |   ρ(margin, won) = 0.184   ρ(margin, flat ROI) = 0.041

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 101 | 47.5% | -3.1% | -0.6% |
| margin +1 | 50 | 42.0% | -23.0% | -24.9% |
| margin +2 | 16 | 62.5% | +20.1% | +14.5% |
| margin ≥ +3 | 6 | 33.3% | -38.0% | -35.6% |

## C. Count × Margin grid at T = 50

Rows = # qFor (contrib ≥ 50) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 50

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| 0 | 20 / 30.0% / -40.1% | 3 / 0.0% / -100.0% | — | — | — |
| 1 | 49 / 53.1% / +0.4% | 12 / 50.0% / +2.6% | 2 / 50.0% / +15.0% | — | — |
| 2 | 28 / 39.3% / -26.8% | 19 / 42.1% / -19.1% | 3 / 66.7% / +16.6% | 1 / 100.0% / +475.0% | — |
| 3 | 5 / 100.0% / +96.6% | 6 / 83.3% / +39.8% | 3 / 66.7% / +96.7% | — | 1 / 0.0% / -100.0% |
| 4 | 4 / 50.0% / -2.4% | 1 / 0.0% / -100.0% | 3 / 0.0% / -100.0% | 1 / 100.0% / +90.9% | 1 / 0.0% / -100.0% |
| 5 | 1 / 100.0% / +26.7% | 4 / 50.0% / -21.2% | 3 / 0.0% / -100.0% | — | — |
| 6 | 1 / 0.0% / -100.0% | 1 / 100.0% / +90.9% | — | 1 / 100.0% / +110.0% | — |

## C. Count × Margin grid at T = 40

Rows = # qFor (contrib ≥ 40) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 40

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 2 / 0.0% / -100.0% | 2 / 0.0% / -100.0% | — | — | — | — | — | — | — |
| 1 | 25 / 36.0% / -33.0% | 9 / 55.6% / +14.7% | 1 / 0.0% / -100.0% | — | — | — | — | — | — |
| 2 | 35 / 48.6% / -9.5% | 30 / 56.7% / +12.1% | 4 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | — | — | — | — | — |
| 3 | 13 / 46.2% / -9.9% | 12 / 50.0% / +0.6% | 5 / 100.0% / +93.2% | 3 / 66.7% / +131.2% | 1 / 0.0% / -100.0% | — | — | — | — |
| 4 | 3 / 33.3% / -37.4% | 3 / 66.7% / +6.3% | 3 / 33.3% / -55.4% | 2 / 0.0% / -100.0% | — | — | — | — | 1 / 0.0% / -100.0% |
| 5 | 3 / 66.7% / +30.2% | 1 / 100.0% / +90.9% | 5 / 40.0% / +3.0% | 2 / 50.0% / -4.5% | — | — | — | — | — |
| 6 | 1 / 100.0% / +26.7% | 1 / 100.0% / +90.9% | 2 / 0.0% / -100.0% | 1 / 100.0% / +110.0% | — | — | — | — | — |
| 7 | 1 / 0.0% / -100.0% | 1 / 100.0% / +95.2% | — | — | — | — | — | — | — |

## D. Continuous Δcontribution (sumContrib_F − sumContrib_A) terciles

No threshold. Sort all picks by Δ and cut into thirds.

ρ(Δcontribution, won) = 0.063   |   ρ(Δcontribution, flat ROI) = 0.055


#### Terciles

| Bucket | N | mean Δ | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- | --- |
| Low  (Δ ≤ 75.2) | 57 | 38.2 | 40.4% | -14.2% | +10.8% |
| Mid  (75.6 .. 131.9) | 58 | 103.1 | 53.4% | +2.3% | -20.4% |
| High (Δ ≥ 132.5) | 58 | 216.7 | 46.6% | -12.1% | -11.3% |

#### Absolute Δcontribution cuts

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| Δ ≤ 0 (opposition matched/led) | 6 | 0.0% | -100.0% | -100.0% |
| 0 < Δ ≤ 50 | 22 | 40.9% | -19.4% | -6.3% |
| 50 < Δ ≤ 100 | 54 | 50.0% | +5.7% | +5.7% |
| Δ > 100 | 91 | 49.5% | -7.2% | -11.8% |

## E. Proposed sizing tiers (derived from §A/B/C)

Rules (all use `contribution ≥ 50` wallet count):
- **STRONG**  : qFor ≥ 3 AND qAgainst = 0  **OR**  qFor ≥ 2 AND margin ≥ +1
- **STANDARD**: qFor ≥ 1 AND margin ≥ +1 AND maxContrib_F ≥ 50
- **LEAN**    : qFor ≥ 1 AND margin ≥ 0
- **MUTE**    : margin < 0


#### Tier performance on current V8 sample

| Tier | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| STRONG | 81 | 48.1% | -8.4% | -9.3% |
| STANDARD | 49 | 53.1% | +0.4% | -0.6% |
| LEAN | 36 | 38.9% | -22.8% | -22.2% |
| MUTE | 7 | 28.6% | +15.0% | +27.8% |

#### Current V8 ★/units assigned within each proposed tier

| Tier | N | mean ★ | mean units |
| --- | --- | --- | --- |
| STRONG | 81 | 3.85 | 1.45 |
| STANDARD | 49 | 3.22 | 0.90 |
| LEAN | 36 | 3.29 | 0.88 |
| MUTE | 7 | 3.79 | 0.84 |

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