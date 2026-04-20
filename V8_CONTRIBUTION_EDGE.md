# V8 Contribution-Edge Map

_Generated 2026-04-20T15:09:40.366Z_

N = 18 picks (LOCKED=15, SHADOW=3)
Baseline: WR 50.0% · flat ROI +1.4% · units-wtd ROI +19.5%

> Per-wallet signal: `contribution = walletBase × convictionMult` (quality × size, already stored in walletDetails).

## A. Count of `contribution ≥ T` on pick side (H1)

Hypothesis: more high-contribution sharps on side ⇒ higher WR / ROI.


#### Threshold T = 30   |   ρ(qFor, won) = 0.319   ρ(qFor, flat ROI) = 0.385

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 1 | 1 | 0.0% | -100.0% | -100.0% |
| qFor ≥ 2 | 7 | 28.6% | -46.9% | -50.4% |
| qFor ≥ 3+ | 10 | 70.0% | +45.4% | +43.0% |

#### Threshold T = 40   |   ρ(qFor, won) = 0.472   ρ(qFor, flat ROI) = 0.521

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 1 | 0.0% | -100.0% | — |
| qFor ≥ 1 | 5 | 20.0% | -66.7% | -76.2% |
| qFor ≥ 2 | 4 | 50.0% | -3.7% | +2.7% |
| qFor ≥ 3+ | 8 | 75.0% | +59.3% | +52.0% |

#### Threshold T = 50   |   ρ(qFor, won) = 0.465   ρ(qFor, flat ROI) = 0.476

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 4 | 25.0% | -58.3% | -58.3% |
| qFor ≥ 1 | 5 | 40.0% | -30.7% | +13.3% |
| qFor ≥ 2 | 4 | 50.0% | -0.2% | +10.6% |
| qFor ≥ 3+ | 5 | 80.0% | +82.6% | +57.6% |

#### Threshold T = 60   |   ρ(qFor, won) = 0.117   ρ(qFor, flat ROI) = -0.018

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 9 | 55.6% | +1.4% | +30.4% |
| qFor ≥ 1 | 4 | 25.0% | -48.8% | -54.4% |
| qFor ≥ 2 | 3 | 66.7% | +4.3% | +28.0% |
| qFor ≥ 3+ | 2 | 50.0% | +97.5% | +31.7% |

#### Threshold T = 70   |   ρ(qFor, won) = 0.191   ρ(qFor, flat ROI) = 0.042

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| qFor ≥ 0 | 9 | 55.6% | +1.4% | +30.4% |
| qFor ≥ 1 | 5 | 20.0% | -59.0% | -68.5% |
| qFor ≥ 2 | 2 | 100.0% | +56.5% | +79.2% |
| qFor ≥ 3+ | 2 | 50.0% | +97.5% | +31.7% |

## B. Margin `contribution ≥ T` (qFor − qAgainst) (H2)

Hypothesis: positive margin of high-contribution sharps ⇒ edge.


#### Threshold T = 30   |   ρ(margin, won) = 0.207   ρ(margin, flat ROI) = 0.441

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 3 | 33.3% | -60.4% | -60.4% |
| margin +1 | 4 | 25.0% | -48.8% | -48.8% |
| margin +2 | 3 | 33.3% | -44.4% | -63.0% |
| margin ≥ +3 | 8 | 75.0% | +66.9% | +55.6% |

#### Threshold T = 40   |   ρ(margin, won) = 0.220   ρ(margin, flat ROI) = 0.455

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 2 | 50.0% | -40.7% | +18.7% |
| margin +1 | 7 | 28.6% | -46.9% | -58.7% |
| margin +2 | 2 | 50.0% | -10.0% | +2.9% |
| margin ≥ +3 | 7 | 71.4% | +65.0% | +53.4% |

#### Threshold T = 50   |   ρ(margin, won) = 0.313   ρ(margin, flat ROI) = 0.373

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 5 | 20.0% | -66.7% | -66.7% |
| margin +1 | 6 | 66.7% | +57.8% | +68.2% |
| margin +2 | 4 | 50.0% | -21.7% | -0.1% |
| margin ≥ +3 | 3 | 66.7% | +33.1% | +9.2% |

#### Threshold T = 60   |   ρ(margin, won) = 0.055   ρ(margin, flat ROI) = -0.038

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 11 | 54.5% | +1.6% | +27.7% |
| margin +1 | 3 | 33.3% | -60.4% | -66.1% |
| margin +2 | 3 | 66.7% | +96.4% | +95.9% |
| margin ≥ +3 | 1 | 0.0% | -100.0% | -100.0% |

#### Threshold T = 70   |   ρ(margin, won) = 0.102   ρ(margin, flat ROI) = 0.015

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| margin ≤ 0 | 11 | 54.5% | +1.6% | +27.7% |
| margin +1 | 4 | 25.0% | -70.3% | -78.4% |
| margin +2 | 2 | 100.0% | +194.7% | +161.2% |
| margin ≥ +3 | 1 | 0.0% | -100.0% | -100.0% |

## C. Count × Margin grid at T = 50

Rows = # qFor (contrib ≥ 50) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 50

| qFor \ qAgainst | 0 | 1 | 2 |
| --- | --- | --- | --- |
| 0 | 4 / 25.0% / -58.3% | — | — |
| 1 | 4 / 50.0% / -13.3% | 1 / 0.0% / -100.0% | — |
| 2 | 3 / 33.3% / -35.2% | 1 / 100.0% / +105.0% | — |
| 3 | 1 / 100.0% / +105.0% | 1 / 100.0% / +18.7% | 1 / 100.0% / +295.0% |
| 4 | 1 / 100.0% / +94.3% | — | — |
| 5 | — | — | — |
| 6 | 1 / 0.0% / -100.0% | — | — |

## C. Count × Margin grid at T = 40

Rows = # qFor (contrib ≥ 40) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.


#### Grid: qFor × qAgainst at contribution ≥ 40

| qFor \ qAgainst | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| 0 | 1 / 0.0% / -100.0% | — | — | — |
| 1 | 5 / 20.0% / -66.7% | — | — | — |
| 2 | 2 / 50.0% / -10.0% | 2 / 50.0% / +2.5% | — | — |
| 3 | 4 / 75.0% / +41.5% | — | — | 1 / 100.0% / +18.7% |
| 4 | — | — | — | — |
| 5 | 1 / 100.0% / +94.3% | — | 1 / 100.0% / +295.0% | — |
| 6 | — | — | — | — |
| 7 | 1 / 0.0% / -100.0% | — | — | — |

## D. Continuous Δcontribution (sumContrib_F − sumContrib_A) terciles

No threshold. Sort all picks by Δ and cut into thirds.

ρ(Δcontribution, won) = 0.284   |   ρ(Δcontribution, flat ROI) = 0.482


#### Terciles

| Bucket | N | mean Δ | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- | --- |
| Low  (Δ ≤ 53.5) | 6 | 28.7 | 33.3% | -46.1% | -46.1% |
| Mid  (106.0 .. 184.7) | 6 | 138.8 | 66.7% | +17.9% | +42.4% |
| High (Δ ≥ 202.6) | 6 | 281.0 | 50.0% | +32.4% | +22.2% |

#### Absolute Δcontribution cuts

| Bucket | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| 0 < Δ ≤ 50 | 5 | 20.0% | -76.3% | -76.3% |
| 50 < Δ ≤ 100 | 1 | 100.0% | +105.0% | +105.0% |
| Δ > 100 | 12 | 58.3% | +25.2% | +32.6% |

## E. Proposed sizing tiers (derived from §A/B/C)

Rules (all use `contribution ≥ 50` wallet count):
- **STRONG**  : qFor ≥ 3 AND qAgainst = 0  **OR**  qFor ≥ 2 AND margin ≥ +1
- **STANDARD**: qFor ≥ 1 AND margin ≥ +1 AND maxContrib_F ≥ 50
- **LEAN**    : qFor ≥ 1 AND margin ≥ 0
- **MUTE**    : margin < 0


#### Tier performance on current V8 sample

| Tier | N | WR | flat ROI | wtd ROI |
| --- | --- | --- | --- | --- |
| STRONG | 9 | 66.7% | +45.8% | +38.8% |
| STANDARD | 4 | 50.0% | -13.3% | +23.6% |
| LEAN | 5 | 20.0% | -66.7% | -66.7% |
| MUTE | 0 | — | — | — |

#### Current V8 ★/units assigned within each proposed tier

| Tier | N | mean ★ | mean units |
| --- | --- | --- | --- |
| STRONG | 9 | 3.61 | 1.11 |
| STANDARD | 4 | 3.25 | 1.38 |
| LEAN | 5 | 2.60 | 0.50 |
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