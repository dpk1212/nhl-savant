# V8 Contribution-Edge Map

_Generated 2026-04-23T09:07:24.606Z_

N = 63 picks (LOCKED=57, SHADOW=6)
Baseline: WR 47.6% · flat ROI -1.3% · units-wtd ROI -10.1%

> Per-wallet signal: `contribution = walletBase × convictionMult` (quality × size, already stored in walletDetails).

## A. Count of `contribution ≥ T` on pick side (H1)

Hypothesis: more high-contribution sharps on side ⇒ higher WR / ROI.


#### Threshold T = 30   |   ρ(qFor, won) = 0.240   ρ(qFor, flat ROI) = 0.261

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 1 | 2 | 0.0% | -100.0% | -100.0% |
| qFor ≥ 2 | 27 | 40.7% | -22.8% | -41.0% |
| qFor ≥ 3+ | 34 | 55.9% | +21.6% | +9.0% |

#### Threshold T = 40   |   ρ(qFor, won) = 0.202   ρ(qFor, flat ROI) = 0.250

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 1 | 0.0% | -100.0% | — |
| qFor ≥ 1 | 14 | 42.9% | -19.8% | -56.6% |
| qFor ≥ 2 | 22 | 40.9% | -20.4% | -32.8% |
| qFor ≥ 3+ | 26 | 57.7% | +28.7% | +16.2% |

#### Threshold T = 50   |   ρ(qFor, won) = 0.168   ρ(qFor, flat ROI) = 0.143

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 7 | 42.9% | -13.3% | -50.4% |
| qFor ≥ 1 | 23 | 52.2% | -1.5% | -11.3% |
| qFor ≥ 2 | 19 | 42.1% | +1.4% | -8.5% |
| qFor ≥ 3+ | 14 | 50.0% | +1.3% | -3.1% |

#### Threshold T = 60   |   ρ(qFor, won) = 0.195   ρ(qFor, flat ROI) = 0.086

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 24 | 54.2% | +4.6% | +8.8% |
| qFor ≥ 1 | 18 | 44.4% | -9.6% | -35.8% |
| qFor ≥ 2 | 11 | 45.5% | +7.2% | -15.1% |
| qFor ≥ 3+ | 10 | 40.0% | -10.0% | -7.1% |

#### Threshold T = 70   |   ρ(qFor, won) = 0.224   ρ(qFor, flat ROI) = 0.126

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 26 | 57.7% | +10.6% | +12.0% |
| qFor ≥ 1 | 22 | 27.3% | -42.7% | -63.7% |
| qFor ≥ 2 | 12 | 66.7% | +40.4% | +31.5% |
| qFor ≥ 3+ | 3 | 33.3% | +31.7% | +12.9% |

## B. Margin `contribution ≥ T` (qFor − qAgainst) (H2)

Hypothesis: positive margin of high-contribution sharps ⇒ edge.


#### Threshold T = 30   |   ρ(margin, won) = 0.304   ρ(margin, flat ROI) = 0.365

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 7 | 14.3% | -83.0% | -89.2% |
| margin +1 | 16 | 37.5% | -36.7% | -40.2% |
| margin +2 | 19 | 57.9% | +17.1% | -7.4% |
| margin ≥ +3 | 21 | 57.1% | +36.2% | +14.2% |

#### Threshold T = 40   |   ρ(margin, won) = 0.175   ρ(margin, flat ROI) = 0.224

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 9 | 33.3% | -2.2% | -26.6% |
| margin +1 | 21 | 52.4% | -1.2% | -31.9% |
| margin +2 | 20 | 40.0% | -19.9% | -24.8% |
| margin ≥ +3 | 13 | 61.5% | +27.7% | +21.9% |

#### Threshold T = 50   |   ρ(margin, won) = 0.111   ρ(margin, flat ROI) = 0.050

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 16 | 56.3% | +33.4% | +16.8% |
| margin +1 | 26 | 46.2% | -5.7% | -17.0% |
| margin +2 | 11 | 36.4% | -33.8% | -23.7% |
| margin ≥ +3 | 10 | 50.0% | -9.5% | -5.6% |

#### Threshold T = 60   |   ρ(margin, won) = 0.203   ρ(margin, flat ROI) = 0.035

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 32 | 56.3% | +23.5% | +19.2% |
| margin +1 | 15 | 33.3% | -41.3% | -66.4% |
| margin +2 | 9 | 44.4% | -2.1% | -6.5% |
| margin ≥ +3 | 7 | 42.9% | -27.8% | -12.5% |

#### Threshold T = 70   |   ρ(margin, won) = 0.240   ρ(margin, flat ROI) = 0.091

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 35 | 51.4% | +10.5% | +3.3% |
| margin +1 | 16 | 31.3% | -39.7% | -66.2% |
| margin +2 | 10 | 70.0% | +38.6% | +43.7% |
| margin ≥ +3 | 2 | 0.0% | -100.0% | -100.0% |

## C. Count × Margin grid at T = 50

Rows = # qFor (contrib ≥ 50) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 50

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| 0 | 7 / 42.9% / -13.3% | — | — | — | — |
| 1 | 18 / 50.0% / -7.6% | 5 / 60.0% / +20.6% | — | — | — |
| 2 | 9 / 33.3% / -32.3% | 7 / 28.6% / -44.0% | 2 / 100.0% / +74.9% | 1 / 100.0% / +475.0% | — |
| 3 | 2 / 100.0% / +96.4% | 1 / 100.0% / +18.7% | 1 / 100.0% / +295.0% | — | — |
| 4 | 3 / 33.3% / -35.2% | — | 1 / 0.0% / -100.0% | — | 1 / 0.0% / -100.0% |
| 5 | 1 / 100.0% / +26.7% | 2 / 0.0% / -100.0% | — | — | — |
| 6 | 1 / 0.0% / -100.0% | 1 / 100.0% / +90.9% | — | — | — |

## C. Count × Margin grid at T = 40

Rows = # qFor (contrib ≥ 40) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 40

| qFor \ qAgainst | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 1 / 0.0% / -100.0% | — | — | — | — | — | — | — | — |
| 1 | 11 / 45.5% / -15.0% | 3 / 33.3% / -37.7% | — | — | — | — | — | — | — |
| 2 | 14 / 42.9% / -17.7% | 6 / 50.0% / -0.3% | 1 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | — | — | — | — | — |
| 3 | 4 / 75.0% / +41.5% | 4 / 50.0% / +12.5% | 3 / 100.0% / +80.2% | 2 / 100.0% / +246.8% | — | — | — | — | — |
| 4 | 2 / 50.0% / -6.1% | — | 1 / 0.0% / -100.0% | 1 / 0.0% / -100.0% | — | — | — | — | 1 / 0.0% / -100.0% |
| 5 | 2 / 50.0% / -2.8% | — | 1 / 100.0% / +295.0% | 1 / 0.0% / -100.0% | — | — | — | — | — |
| 6 | 1 / 100.0% / +26.7% | 1 / 100.0% / +90.9% | 1 / 0.0% / -100.0% | — | — | — | — | — | — |
| 7 | 1 / 0.0% / -100.0% | — | — | — | — | — | — | — | — |

## D. Continuous Δcontribution (sumContrib_F − sumContrib_A) terciles

No threshold. Sort all picks by Δ and cut into thirds.

ρ(Δcontribution, won) = 0.067   |   ρ(Δcontribution, flat ROI) = 0.116


#### Terciles

| Bucket | N | mean Δ | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- | --- |
| Low  (Δ ≤ 86.2) | 21 | 46.6 | 47.6% | +6.6% | -4.6% |
| Mid  (87.9 .. 134.6) | 21 | 111.2 | 52.4% | +0.4% | -26.9% |
| High (Δ ≥ 135.5) | 21 | 249.4 | 42.9% | -10.9% | -1.6% |

#### Absolute Δcontribution cuts

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| Δ ≤ 0 (opposition matched/led) | 1 | 0.0% | -100.0% | -100.0% |
| 0 < Δ ≤ 50 | 6 | 16.7% | -80.2% | -81.7% |
| 50 < Δ ≤ 100 | 20 | 60.0% | +36.3% | -1.9% |
| Δ > 100 | 36 | 47.2% | -6.3% | -6.0% |

## E. Proposed sizing tiers (derived from §A/B/C)

Rules (all use `contribution ≥ 50` wallet count):
- **STRONG**  : qFor ≥ 3 AND qAgainst = 0  **OR**  qFor ≥ 2 AND margin ≥ +1
- **STANDARD**: qFor ≥ 1 AND margin ≥ +1 AND maxContrib_F ≥ 50
- **LEAN**    : qFor ≥ 1 AND margin ≥ 0
- **MUTE**    : margin < 0


#### Tier performance on current V8 sample

| Tier | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| STRONG | 29 | 41.4% | -16.6% | -13.0% |
| STANDARD | 18 | 50.0% | -7.6% | -18.5% |
| LEAN | 15 | 53.3% | +4.0% | -7.3% |
| MUTE | 1 | 100.0% | +475.0% | +475.0% |

#### Current V8 ★/units assigned within each proposed tier

| Tier | N | mean ★ | mean units |
| --- | --- | --- | --- |
| STRONG | 29 | 3.48 | 1.25 |
| STANDARD | 18 | 3.00 | 1.08 |
| LEAN | 15 | 2.87 | 0.63 |
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