# V8 Goldilocks Deep Dive

_Generated 2026-04-22T09:27:38.718Z_

## 0. Sample & Baseline

- Picks in sample: **52** (LOCKED=47, SHADOW=5)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **46.2%** · flat ROI **-0.1%** · units-wtd ROI **-12.6%**


## 5. Every V8 Pick — Row-Level Detail

| Date | Sport | Mkt | Pick | Stars | Units | Odds | WPS | qFor(roi50+size1) | qAgainst | Margin | Result |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| 2026-04-18 | MLB | ML | home | 4.5 | 3 | -150 | 1.18 | 0 | 0 | 0 | WIN |
| 2026-04-18 | NHL | ML | away | 3.5 | 0.5 | +105 | 3.80 | 1 | 0 | 1 | WIN |
| 2026-04-18 | NBA | SPREAD | away | 2.5 | 0.5 | -108 | 0.36 | 0 | 0 | 0 | LOSS |
| 2026-04-18 | NBA | SPREAD | away | 3.5 | 1 | -108 | 3.05 | 1 | 0 | 1 | LOSS |
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.5 | +105 | 0.38 | 1 | 1 | 0 | WIN |
| 2026-04-18 | MLB | TOTAL | under | 2.5 | 0.5 | -117 | 1.02 | 1 | 0 | 1 | LOSS |
| 2026-04-18 | NBA | TOTAL | over | 3 | 0.75 | -107 | 2.94 | 0 | 0 | 0 | LOSS |
| 2026-04-19 | MLB | ML | away | 3.5 | 1.75 | -106 | 3.53 | 0 | 0 | 0 | WIN |
| 2026-04-19 | MLB | ML | home | 3 | 0.5 | -150 | 1.57 | 0 | 0 | 0 | WIN |
| 2026-04-19 | MLB | ML | home | 4 | 2 | -106 | 5.02 | 3 | 0 | 3 | WIN |
| 2026-04-19 | MLB | ML | home | 3 | 1 | -125 | 1.97 | 0 | 0 | 0 | WIN |
| 2026-04-19 | MLB | ML | away | 3 | 1 | -145 | 1.78 | 0 | 0 | 0 | LOSS |
| 2026-04-19 | MLB | ML | away | 2.5 | 1 | +100 | 0.52 | 0 | 0 | 0 | LOSS |
| 2026-04-19 | NBA | ML | away | 4.5 | 1 | +295 | 6.61 | 2 | 1 | 1 | WIN |
| 2026-04-19 | NBA | ML | home | 3 | 0.5 | -535 | 1.57 | 2 | 1 | 1 | WIN |
| 2026-04-19 | NHL | ML | away | 2.5 | 0 | +146 | 0.30 | 0 | 0 | 0 | LOSS |
| 2026-04-19 | NHL | ML | home | 2.5 | 0.5 | -185 | 0.22 | 0 | 0 | 0 | LOSS |
| 2026-04-19 | NBA | SPREAD | home | 5 | 2 | -110 | 8.21 | 2 | 0 | 2 | LOSS |
| 2026-04-20 | MLB | ML | home | 2.5 | 1 | -130 | 1.16 | 0 | 0 | 0 | LOSS |
| 2026-04-20 | MLB | ML | away | 2.5 | 1 | +126 | 1.13 | 0 | 0 | 0 | WIN |
| 2026-04-20 | NBA | ML | home | 3 | 1 | -235 | 1.79 | 4 | 3 | 1 | LOSS |
| 2026-04-20 | NBA | ML | home | 3 | 1 | -285 | 2.68 | 1 | 0 | 1 | LOSS |
| 2026-04-20 | NBA | ML | away | 3.5 | 0.5 | +360 | 4.08 | 0 | 1 | -1 | LOSS |
| 2026-04-20 | NHL | ML | away | 4 | 1.5 | +146 | 5.14 | 0 | 0 | 0 | LOSS |
| 2026-04-20 | NHL | ML | home | 2.5 | 1 | -134 | 0.88 | 0 | 0 | 0 | WIN |
| 2026-04-20 | NHL | ML | home | 2.5 | 0.5 | -146 | 0.55 | 0 | 0 | 0 | WIN |
| 2026-04-20 | NBA | SPREAD | home | 4.5 | 2 | -102 | 6.00 | 1 | 0 | 1 | LOSS |
| 2026-04-20 | NBA | SPREAD | home | 3 | 0.75 | -105 | 1.68 | 1 | 0 | 1 | LOSS |
| 2026-04-20 | NBA | SPREAD | home | 3 | 0.75 | -110 | 2.60 | 0 | 0 | 0 | WIN |
| 2026-04-20 | MLB | TOTAL | over | 2.5 | 0.5 | +106 | 0.44 | 1 | 0 | 1 | WIN |
| 2026-04-20 | MLB | TOTAL | under | 2.5 | 0.5 | +104 | 0.37 | 1 | 0 | 1 | WIN |
| 2026-04-20 | NBA | TOTAL | under | 2.5 | 0.5 | -102 | 0.92 | 0 | 0 | 0 | WIN |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.5 | -115 | 1.34 | 0 | 0 | 0 | WIN |
| 2026-04-20 | NBA | TOTAL | over | 2.5 | 0.5 | -108 | 0.89 | 1 | 1 | 0 | LOSS |
| 2026-04-20 | NHL | TOTAL | over | 2.5 | 0.5 | -133 | 0.64 | 0 | 0 | 0 | WIN |
| 2026-04-21 | MLB | ML | away | 3 | 1.5 | +140 | 2.17 | 1 | 0 | 1 | WIN |
| 2026-04-21 | MLB | ML | home | 2.5 | 0.75 | -165 | 0.89 | 1 | 0 | 1 | LOSS |
| 2026-04-21 | MLB | ML | away | 3 | 1.5 | +100 | 2.19 | 0 | 0 | 0 | LOSS |
| 2026-04-21 | MLB | ML | home | 3 | 1.25 | -116 | 2.06 | 0 | 0 | 0 | LOSS |
| 2026-04-21 | NBA | ML | away | 5 | 3 | -192 | 0.31 | 1 | 0 | 1 | LOSS |
| 2026-04-21 | NBA | ML | home | 4 | 0.5 | -850 | 5.38 | 5 | 0 | 5 | LOSS |
| 2026-04-21 | NBA | ML | away | 3.5 | 0.5 | +475 | 3.58 | 1 | 3 | -2 | WIN |
| 2026-04-21 | NHL | ML | away | 3 | 0.75 | +145 | 2.37 | 1 | 1 | 0 | WIN |
| 2026-04-21 | NHL | ML | home | 2.5 | 1 | -184 | 0.31 | 0 | 0 | 0 | WIN |
| 2026-04-21 | NHL | ML | away | 3 | 0 | +135 | 1.65 | 0 | 0 | 0 | WIN |
| 2026-04-21 | NBA | SPREAD | away | 3.5 | 1.75 | -114 | 3.31 | 4 | 0 | 4 | LOSS |
| 2026-04-21 | NBA | SPREAD | home | 4.5 | 1.5 | -110 | 0.21 | 0 | 0 | 0 | LOSS |
| 2026-04-21 | NBA | SPREAD | away | 4.5 | 2 | -110 | 6.47 | 4 | 0 | 4 | WIN |
| 2026-04-21 | MLB | TOTAL | under | 3 | 1 | -103 | 2.16 | 1 | 0 | 1 | LOSS |
| 2026-04-21 | NBA | TOTAL | over | 2.5 | 0.75 | -106 | 0.38 | 0 | 0 | 0 | LOSS |
| 2026-04-21 | NBA | TOTAL | over | 3.5 | 1.5 | -108 | 3.93 | 1 | 0 | 1 | LOSS |
| 2026-04-21 | NBA | TOTAL | over | 4 | 1.75 | -102 | 4.72 | 2 | 0 | 2 | LOSS |

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| sumSize_delta | +0.142 | +0.230 |
| sumInvest_F | +0.085 | +0.201 |
| countDelta | +0.067 | +0.185 |
| meanBase_F | +0.239 | +0.183 |
| sumInvest_delta | +0.075 | +0.173 |
| maxRoiN_F | +0.198 | +0.168 |
| meanConv_F | +0.080 | +0.124 |
| walletPlayScore | -0.052 | +0.105 |
| sumSize_F | +0.021 | +0.104 |
| sumRoiN_A | -0.063 | -0.084 |
| netEdge | -0.047 | +0.082 |
| sumContrib_delta | -0.044 | +0.073 |
| sumContrib_F | -0.061 | +0.070 |
| forSide | -0.061 | +0.069 |
| sumRoiN_delta | -0.030 | +0.057 |
| breadthBonus | -0.053 | +0.054 |
| walletCountFor | -0.053 | +0.054 |
| walletCountAgainst | +0.011 | -0.051 |
| topShare | +0.124 | -0.048 |
| maxRoiN_delta | +0.077 | +0.047 |
| concPenalty | +0.120 | -0.043 |
| sumRoiN_F | -0.088 | +0.030 |
| againstSide | +0.000 | -0.028 |
| meanBase_delta | -0.019 | -0.022 |
| meanConv_delta | -0.022 | +0.004 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| contribution≥50 | +0.138 | +0.186 |
| roiNorm≥50 & sizeRatio≥1 | +0.182 | +0.185 |
| walletBase≥50 & sizeRatio≥1 | +0.181 | +0.160 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.169 | +0.159 |
| roiNorm≥70 & sizeRatio≥1 | +0.246 | +0.156 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.166 | +0.143 |
| roiNorm≥60 & sizeRatio≥1 | +0.162 | +0.141 |
| invested≥$5k | +0.044 | +0.126 |
| roiNorm≥50 (size any) | +0.102 | +0.116 |
| contribution≥60 | +0.138 | +0.102 |
| convictionMult≥1 | +0.049 | +0.082 |
| sizeRatio≥1 (roi any) | +0.049 | +0.082 |
| walletBase≥60 & sizeRatio≥1 | +0.171 | +0.036 |
| rankNorm≥60 | -0.008 | -0.014 |

### Per-definition bucket tables


#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 6 | 33.3% | -33.1% | -74.4% |
| 1 qFor | 20 | 55.0% | +2.8% | -10.2% |
| 2 qFor | 15 | 40.0% | +8.9% | -3.4% |
| 3+ qFor | 11 | 45.5% | +0.4% | -11.5% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 26 | 50.0% | -7.0% | -8.8% |
| 1 qFor | 17 | 41.2% | +10.6% | -25.9% |
| 2 qFor | 4 | 50.0% | +28.4% | -13.5% |
| 3+ qFor | 5 | 40.0% | -23.0% | +6.3% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 27 | 51.9% | -2.9% | -6.5% |
| 1 qFor | 13 | 38.5% | -15.4% | -33.2% |
| 2 qFor | 4 | 50.0% | +73.4% | -13.3% |
| 3+ qFor | 8 | 37.5% | -2.5% | -2.9% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 28 | 50.0% | -4.9% | -7.9% |
| 1 qFor | 15 | 40.0% | +9.0% | -29.5% |
| 2 qFor | 6 | 50.0% | +18.0% | -6.3% |
| 3+ qFor | 3 | 33.3% | -36.4% | +9.1% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 38 | 47.4% | +1.3% | -18.2% |
| 1 qFor | 9 | 44.4% | +15.0% | +10.8% |
| 2 qFor | 4 | 50.0% | -22.6% | -16.0% |
| 3+ qFor | 1 | 0.0% | -100.0% | -100.0% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 31 | 51.6% | +11.0% | +0.5% |
| 1 qFor | 12 | 33.3% | -28.7% | -49.6% |
| 2 qFor | 6 | 50.0% | +18.0% | -6.3% |
| 3+ qFor | 3 | 33.3% | -36.4% | +9.1% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 30 | 53.3% | +14.7% | +4.3% |
| 1 qFor | 13 | 30.8% | -34.2% | -53.1% |
| 2 qFor | 4 | 50.0% | +28.4% | -13.5% |
| 3+ qFor | 5 | 40.0% | -23.0% | +6.3% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 21 | 47.6% | -8.2% | -37.5% |
| 2 qFor | 13 | 46.2% | -15.2% | +5.0% |
| 3+ qFor | 18 | 44.4% | +20.3% | -2.1% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 2 | 50.0% | +17.5% | — |
| 1 qFor | 16 | 37.5% | -26.9% | -35.0% |
| 2 qFor | 23 | 52.2% | +16.9% | -3.2% |
| 3+ qFor | 11 | 45.5% | +0.4% | -10.0% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 21 | 57.1% | +9.8% | +15.1% |
| 1 qFor | 17 | 41.2% | -16.6% | -45.5% |
| 2 qFor | 7 | 42.9% | +26.9% | -8.1% |
| 3+ qFor | 7 | 28.6% | -16.3% | -22.3% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 12 | 58.3% | +8.4% | -16.9% |
| 1 qFor | 20 | 50.0% | -1.4% | -2.5% |
| 2 qFor | 8 | 37.5% | -28.9% | -37.2% |
| 3+ qFor | 12 | 33.3% | +12.9% | -14.5% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 12 | 58.3% | +8.4% | -16.9% |
| 1 qFor | 20 | 50.0% | -1.4% | -2.5% |
| 2 qFor | 8 | 37.5% | -28.9% | -37.2% |
| 3+ qFor | 12 | 33.3% | +12.9% | -14.5% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 35 | 51.4% | +15.4% | +5.9% |
| 1 qFor | 12 | 33.3% | -29.3% | -48.2% |
| 2 qFor | 4 | 50.0% | -22.6% | -7.1% |
| 3+ qFor | 1 | 0.0% | -100.0% | -100.0% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 26 | 50.0% | -5.2% | -14.0% |
| 2 qFor | 18 | 44.4% | -4.5% | -12.2% |
| 3+ qFor | 8 | 37.5% | +26.4% | -10.2% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| invested≥$5k | +0.125 | +0.220 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.180 | +0.139 |
| convictionMult≥1 | +0.116 | +0.132 |
| sizeRatio≥1 (roi any) | +0.116 | +0.132 |
| walletBase≥50 & sizeRatio≥1 | +0.183 | +0.115 |
| contribution≥50 | +0.112 | +0.087 |
| roiNorm≥60 & sizeRatio≥1 | +0.125 | +0.086 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.135 | +0.078 |
| roiNorm≥50 & sizeRatio≥1 | +0.116 | +0.070 |
| roiNorm≥50 (size any) | +0.083 | +0.064 |
| contribution≥60 | +0.137 | +0.050 |
| roiNorm≥70 & sizeRatio≥1 | +0.157 | +0.018 |
| walletBase≥60 & sizeRatio≥1 | +0.128 | -0.026 |
| rankNorm≥60 | -0.031 | -0.037 |

### Per-definition bucket tables


#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 6 | 66.7% | +13.4% | -2.8% |
| margin +1 | 26 | 38.5% | -10.1% | -40.1% |
| margin +2 | 10 | 60.0% | +41.8% | +54.7% |
| margin ≥+3 | 10 | 40.0% | -24.0% | -19.3% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 34 | 50.0% | +7.2% | -2.8% |
| margin +1 | 12 | 41.7% | -2.9% | -25.8% |
| margin +2 | 4 | 25.0% | -51.4% | -48.2% |
| margin ≥+3 | 2 | 50.0% | -4.5% | +52.7% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 18 | 50.0% | +14.8% | -9.8% |
| margin +1 | 22 | 54.5% | +6.8% | -1.1% |
| margin +2 | 3 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 9 | 33.3% | -13.3% | -15.2% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 18 | 50.0% | +14.8% | -9.8% |
| margin +1 | 22 | 54.5% | +6.8% | -1.1% |
| margin +2 | 3 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 9 | 33.3% | -13.3% | -15.2% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 32 | 53.1% | +14.0% | +0.6% |
| margin +1 | 11 | 36.4% | -30.1% | -41.9% |
| margin +2 | 5 | 20.0% | -21.0% | -36.8% |
| margin ≥+3 | 4 | 50.0% | -3.7% | -0.6% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 13 | 46.2% | +24.2% | +0.1% |
| margin +1 | 22 | 50.0% | +2.9% | -11.7% |
| margin +2 | 10 | 40.0% | -27.2% | -17.0% |
| margin ≥+3 | 7 | 42.9% | -15.7% | -18.8% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 32 | 53.1% | +13.9% | +4.3% |
| margin +1 | 14 | 35.7% | -16.8% | -35.2% |
| margin +2 | 2 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 4 | 50.0% | -3.7% | +23.3% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 32 | 50.0% | +7.6% | -2.2% |
| margin +1 | 14 | 42.9% | -2.2% | -25.2% |
| margin +2 | 4 | 25.0% | -51.4% | -48.2% |
| margin ≥+3 | 2 | 50.0% | -4.5% | +52.7% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 30 | 53.3% | +14.7% | +5.4% |
| margin +1 | 16 | 37.5% | -14.5% | -34.0% |
| margin +2 | 2 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 4 | 50.0% | -3.7% | +23.3% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 10 | 60.0% | +56.6% | +53.0% |
| margin +1 | 17 | 29.4% | -42.4% | -41.2% |
| margin +2 | 18 | 55.6% | +14.5% | -5.1% |
| margin ≥+3 | 7 | 42.9% | -15.7% | -16.9% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 28 | 57.1% | +26.3% | +21.6% |
| margin +1 | 15 | 33.3% | -41.3% | -66.4% |
| margin +2 | 4 | 50.0% | +47.3% | +30.6% |
| margin ≥+3 | 5 | 20.0% | -61.8% | -52.3% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 39 | 48.7% | +8.9% | -9.8% |
| margin +1 | 9 | 33.3% | -28.9% | -24.3% |
| margin +2 | 3 | 66.7% | +3.2% | +3.8% |
| margin ≥+3 | 1 | 0.0% | -100.0% | -100.0% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 36 | 52.8% | +17.9% | +7.4% |
| margin +1 | 11 | 27.3% | -41.5% | -53.5% |
| margin +2 | 5 | 40.0% | -38.1% | -23.3% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 12 | 41.7% | -24.4% | -51.1% |
| margin +1 | 24 | 54.2% | +29.8% | +14.0% |
| margin +2 | 13 | 38.5% | -24.5% | -16.4% |
| margin ≥+3 | 3 | 33.3% | -36.4% | -36.4% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=52 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletPlayScore≥3 | 15 | 40.0% | +17.0% | -6.4% |
| meanBase_F≥55 | 22 | 59.1% | +11.9% | -9.6% |
| concPenalty≤2.5 | 44 | 50.0% | +9.7% | -5.2% |
| topShare≤0.5 | 32 | 46.9% | +8.9% | -5.4% |
| qFor(roi50+size1)≥1 | 26 | 42.3% | +6.9% | -15.7% |
| stars≥3.5 | 18 | 38.9% | +6.7% | -13.7% |
| regime=CLEAR_MOVE | 10 | 60.0% | +6.4% | +12.6% |
| walletPlayScore≥2 | 23 | 39.1% | +5.7% | -10.2% |
| sumInvested_F≥$10k | 52 | 46.2% | -0.1% | -12.6% |
| stars≥3 | 33 | 42.4% | -0.1% | -16.9% |
| qFor(roi50+size1)≥2 | 9 | 44.4% | -0.1% | -2.0% |
| qFor(roi60+size1.25)≥2 | 9 | 44.4% | -0.1% | -2.0% |
| walletCountFor≥3 | 35 | 42.9% | -0.4% | -9.7% |
| netEdge≥1 | 32 | 40.6% | -2.1% | -11.9% |
| maxRoiN_F≥70 | 27 | 44.4% | -7.2% | -27.1% |
| walletCountAgainst=0 | 20 | 45.0% | -12.7% | -27.3% |
| qMargin(roi60+size1.25)≥1 | 18 | 38.9% | -13.9% | -24.6% |
| qMargin(roi50+size1)≥1 | 22 | 36.4% | -20.3% | -29.9% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 | 12 | 41.7% | +30.0% | -5.7% |
| regime=CLEAR_MOVE ∧ meanBase_F≥55 | 4 | 75.0% | +29.8% | +8.2% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 6 | 66.7% | +28.5% | +38.6% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 | 16 | 43.8% | +27.8% | +1.2% |
| walletCountFor≥3 ∧ stars≥3.5 | 16 | 43.8% | +20.1% | +3.0% |
| netEdge≥1 ∧ stars≥3.5 | 16 | 43.8% | +20.1% | +3.0% |
| topShare≤0.5 ∧ stars≥3.5 | 16 | 43.8% | +20.1% | +3.0% |
| qFor(roi50+size1)≥1 ∧ stars≥3.5 | 13 | 38.5% | +20.0% | -20.2% |
| qFor(roi50+size1)≥1 ∧ concPenalty≤2.5 | 22 | 45.5% | +17.0% | -3.5% |
| walletCountFor≥3 ∧ walletPlayScore≥3 | 15 | 40.0% | +17.0% | -6.4% |
| walletPlayScore≥2 ∧ walletPlayScore≥3 | 15 | 40.0% | +17.0% | -6.4% |
| walletPlayScore≥2 ∧ stars≥3.5 | 15 | 40.0% | +17.0% | -6.4% |
| walletPlayScore≥3 ∧ netEdge≥1 | 15 | 40.0% | +17.0% | -6.4% |
| walletPlayScore≥3 ∧ topShare≤0.5 | 15 | 40.0% | +17.0% | -6.4% |
| walletPlayScore≥3 ∧ concPenalty≤2.5 | 15 | 40.0% | +17.0% | -6.4% |
| walletPlayScore≥3 ∧ stars≥3 | 15 | 40.0% | +17.0% | -6.4% |
| walletPlayScore≥3 ∧ stars≥3.5 | 15 | 40.0% | +17.0% | -6.4% |
| walletPlayScore≥3 ∧ sumInvested_F≥$10k | 15 | 40.0% | +17.0% | -6.4% |
| concPenalty≤2.5 ∧ stars≥3.5 | 15 | 40.0% | +17.0% | -6.4% |
| qFor(roi50+size1)≥1 ∧ topShare≤0.5 | 19 | 42.1% | +13.9% | -6.1% |
| concPenalty≤2.5 ∧ meanBase_F≥55 | 20 | 60.0% | +12.9% | -0.0% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi60+size1.25)≥1 | 8 | 50.0% | +12.4% | +6.5% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 | 8 | 50.0% | +12.4% | +6.5% |
| concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 8 | 62.5% | +12.2% | +1.9% |
| sumInvested_F≥$10k ∧ meanBase_F≥55 | 22 | 59.1% | +11.9% | -9.6% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletCountAgainst=0 ∧ concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +51.0% | +44.3% |
| qFor(roi50+size1)≥1 ∧ walletCountFor≥3 ∧ walletPlayScore≥3 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ walletCountFor≥3 ∧ stars≥3.5 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ walletPlayScore≥3 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ stars≥3.5 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ netEdge≥1 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ topShare≤0.5 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ concPenalty≤2.5 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ stars≥3 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ stars≥3.5 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ sumInvested_F≥$10k | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ netEdge≥1 ∧ stars≥3.5 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ topShare≤0.5 ∧ stars≥3.5 | 12 | 41.7% | +30.0% | -5.7% |
| qFor(roi50+size1)≥1 ∧ concPenalty≤2.5 ∧ stars≥3.5 | 12 | 41.7% | +30.0% | -5.7% |
| concPenalty≤2.5 ∧ regime=CLEAR_MOVE ∧ meanBase_F≥55 | 4 | 75.0% | +29.8% | +8.2% |
| regime=CLEAR_MOVE ∧ sumInvested_F≥$10k ∧ meanBase_F≥55 | 4 | 75.0% | +29.8% | +8.2% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 6 | 66.7% | +28.5% | +38.6% |
| qFor(roi50+size1)≥1 ∧ walletCountFor≥3 ∧ walletPlayScore≥2 | 16 | 43.8% | +27.8% | +1.2% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ topShare≤0.5 | 16 | 43.8% | +27.8% | +1.2% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ concPenalty≤2.5 | 16 | 43.8% | +27.8% | +1.2% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ stars≥3 | 16 | 43.8% | +27.8% | +1.2% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ sumInvested_F≥$10k | 16 | 43.8% | +27.8% | +1.2% |
| walletCountFor≥3 ∧ netEdge≥1 ∧ stars≥3.5 | 16 | 43.8% | +20.1% | +3.0% |
| walletCountFor≥3 ∧ topShare≤0.5 ∧ stars≥3.5 | 16 | 43.8% | +20.1% | +3.0% |
| walletCountFor≥3 ∧ stars≥3 ∧ stars≥3.5 | 16 | 43.8% | +20.1% | +3.0% |