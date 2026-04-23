# V8 Goldilocks Deep Dive

_Generated 2026-04-23T09:07:26.234Z_

## 0. Sample & Baseline

- Picks in sample: **63** (LOCKED=57, SHADOW=6)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **47.6%** · flat ROI **-1.3%** · units-wtd ROI **-10.1%**


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
| 2026-04-22 | MLB | ML | home | 2.5 | 0.5 | -152 | 0.82 | 2 | 1 | 1 | LOSS |
| 2026-04-22 | MLB | ML | away | 2.5 | 1 | -207 | 1.48 | 2 | 0 | 2 | LOSS |
| 2026-04-22 | MLB | ML | away | 2.5 | 1.1 | +130 | 0.76 | 0 | 0 | 0 | LOSS |
| 2026-04-22 | NBA | ML | home | 5 | 3 | -375 | 7.79 | 4 | 0 | 4 | WIN |
| 2026-04-22 | NBA | ML | home | 3.5 | 1 | -2100 | 3.29 | 0 | 0 | 0 | WIN |
| 2026-04-22 | NHL | ML | home | 3 | 0.5 | -188 | 1.51 | 0 | 0 | 0 | LOSS |
| 2026-04-22 | NHL | ML | away | 3.5 | 1 | +110 | 3.52 | 1 | 1 | 0 | WIN |
| 2026-04-22 | MLB | SPREAD | home | 2.5 | 0.5 | +105 | 0.91 | 0 | 0 | 0 | WIN |
| 2026-04-22 | NBA | SPREAD | home | 4 | 2 | -114 | 5.39 | 1 | 0 | 1 | WIN |
| 2026-04-22 | NBA | SPREAD | home | 4 | 1.5 | -108 | 5.03 | 3 | 0 | 3 | LOSS |
| 2026-04-22 | NBA | TOTAL | over | 3 | 0.5 | -115 | 2.08 | 1 | 0 | 1 | WIN |

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| countDelta | +0.188 | +0.265 |
| sumSize_delta | +0.216 | +0.227 |
| sumInvest_delta | +0.174 | +0.186 |
| sumInvest_F | +0.131 | +0.154 |
| maxRoiN_F | +0.184 | +0.154 |
| walletPlayScore | +0.053 | +0.144 |
| netEdge | +0.074 | +0.130 |
| sumContrib_delta | +0.067 | +0.116 |
| sumRoiN_A | -0.090 | -0.113 |
| breadthBonus | +0.075 | +0.112 |
| walletCountFor | +0.075 | +0.112 |
| sumSize_F | +0.107 | +0.109 |
| sumRoiN_delta | +0.040 | +0.106 |
| maxRoiN_delta | +0.130 | +0.098 |
| meanBase_F | +0.128 | +0.096 |
| walletCountAgainst | -0.010 | -0.094 |
| sumContrib_F | +0.027 | +0.081 |
| forSide | +0.026 | +0.080 |
| topShare | +0.034 | -0.080 |
| meanConv_F | +0.104 | +0.076 |
| concPenalty | +0.049 | -0.064 |
| againstSide | -0.021 | -0.057 |
| sumRoiN_F | -0.019 | +0.055 |
| meanConv_delta | +0.000 | +0.021 |
| meanBase_delta | +0.004 | -0.007 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.296 | +0.172 |
| roiNorm≥50 & sizeRatio≥1 | +0.187 | +0.147 |
| contribution≥50 | +0.168 | +0.143 |
| invested≥$5k | +0.115 | +0.132 |
| walletBase≥50 & sizeRatio≥1 | +0.207 | +0.127 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.179 | +0.123 |
| roiNorm≥60 & sizeRatio≥1 | +0.172 | +0.099 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.173 | +0.097 |
| contribution≥60 | +0.195 | +0.086 |
| convictionMult≥1 | +0.123 | +0.080 |
| sizeRatio≥1 (roi any) | +0.123 | +0.080 |
| rankNorm≥60 | +0.122 | +0.062 |
| walletBase≥60 & sizeRatio≥1 | +0.221 | +0.052 |
| roiNorm≥50 (size any) | +0.058 | +0.050 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 47 | 48.9% | +1.0% | -13.1% |
| 1 qFor | 10 | 40.0% | +3.5% | -2.2% |
| 2 qFor | 4 | 50.0% | -22.6% | -16.0% |
| 3+ qFor | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 30 | 50.0% | -9.1% | -11.6% |
| 1 qFor | 20 | 50.0% | +23.2% | -5.2% |
| 2 qFor | 6 | 33.3% | -14.4% | -32.7% |
| 3+ qFor | 7 | 42.9% | -26.9% | -2.1% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 7 | 42.9% | -13.3% | -50.4% |
| 1 qFor | 23 | 52.2% | -1.5% | -11.3% |
| 2 qFor | 19 | 42.1% | +1.4% | -8.5% |
| 3+ qFor | 14 | 50.0% | +1.3% | -3.1% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 25 | 48.0% | -7.2% | -35.9% |
| 2 qFor | 16 | 43.8% | -18.0% | +1.3% |
| 3+ qFor | 22 | 50.0% | +17.5% | +1.9% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 29 | 51.7% | -2.5% | -8.3% |
| 1 qFor | 16 | 43.8% | -6.4% | -21.7% |
| 2 qFor | 8 | 50.0% | +23.3% | -2.7% |
| 3+ qFor | 10 | 40.0% | -9.3% | -6.3% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 32 | 50.0% | -7.1% | -10.6% |
| 1 qFor | 18 | 50.0% | +23.3% | -6.1% |
| 2 qFor | 9 | 33.3% | -21.3% | -29.7% |
| 3+ qFor | 4 | 50.0% | -20.6% | +17.2% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 35 | 54.3% | +13.2% | +4.0% |
| 1 qFor | 15 | 40.0% | -18.0% | -32.1% |
| 2 qFor | 7 | 28.6% | -26.6% | -44.9% |
| 3+ qFor | 6 | 50.0% | -14.7% | +12.2% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 36 | 52.8% | +10.0% | +0.7% |
| 1 qFor | 14 | 42.9% | -12.1% | -27.8% |
| 2 qFor | 9 | 33.3% | -21.3% | -29.7% |
| 3+ qFor | 4 | 50.0% | -20.6% | +17.2% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 24 | 54.2% | +4.6% | +8.8% |
| 1 qFor | 18 | 44.4% | -9.6% | -35.8% |
| 2 qFor | 11 | 45.5% | +7.2% | -15.1% |
| 3+ qFor | 10 | 40.0% | -10.0% | -7.1% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 14 | 57.1% | +7.5% | -19.6% |
| 1 qFor | 21 | 47.6% | -6.1% | -4.8% |
| 2 qFor | 12 | 41.7% | -19.5% | -23.6% |
| 3+ qFor | 16 | 43.8% | +10.9% | -5.6% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 14 | 57.1% | +7.5% | -19.6% |
| 1 qFor | 21 | 47.6% | -6.1% | -4.8% |
| 2 qFor | 12 | 41.7% | -19.5% | -23.6% |
| 3+ qFor | 16 | 43.8% | +10.9% | -5.6% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 29 | 48.3% | -7.9% | -16.9% |
| 2 qFor | 23 | 43.5% | -11.6% | -16.0% |
| 3+ qFor | 11 | 54.5% | +37.6% | +14.3% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 39 | 51.3% | +13.6% | +3.6% |
| 1 qFor | 18 | 38.9% | -28.3% | -36.0% |
| 2 qFor | 5 | 60.0% | -0.5% | +21.0% |
| 3+ qFor | 1 | 0.0% | -100.0% | -100.0% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 3 | 33.3% | -21.7% | -100.0% |
| 1 qFor | 20 | 50.0% | -6.2% | -14.6% |
| 2 qFor | 26 | 46.2% | +3.4% | -12.1% |
| 3+ qFor | 14 | 50.0% | +1.3% | -2.0% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| invested≥$5k | +0.191 | +0.227 |
| convictionMult≥1 | +0.211 | +0.142 |
| sizeRatio≥1 (roi any) | +0.211 | +0.142 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.184 | +0.082 |
| walletBase≥50 & sizeRatio≥1 | +0.215 | +0.082 |
| rankNorm≥60 | +0.125 | +0.070 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.179 | +0.067 |
| roiNorm≥70 & sizeRatio≥1 | +0.228 | +0.056 |
| roiNorm≥50 & sizeRatio≥1 | +0.157 | +0.055 |
| contribution≥50 | +0.111 | +0.050 |
| roiNorm≥60 & sizeRatio≥1 | +0.143 | +0.043 |
| roiNorm≥50 (size any) | +0.085 | +0.040 |
| contribution≥60 | +0.203 | +0.035 |
| walletBase≥60 & sizeRatio≥1 | +0.174 | -0.019 |

### Per-definition bucket tables


#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 8 | 62.5% | +8.4% | -3.7% |
| margin +1 | 31 | 38.7% | -11.2% | -37.7% |
| margin +2 | 10 | 60.0% | +41.8% | +54.7% |
| margin ≥+3 | 14 | 50.0% | -15.8% | -8.5% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 21 | 47.6% | +8.2% | -15.2% |
| margin +1 | 25 | 56.0% | +9.9% | +3.2% |
| margin +2 | 4 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 13 | 46.2% | -7.7% | -4.7% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 21 | 47.6% | +8.2% | -15.2% |
| margin +1 | 25 | 56.0% | +9.9% | +3.2% |
| margin +2 | 4 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 13 | 46.2% | -7.7% | -4.7% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 39 | 51.3% | +6.8% | -2.3% |
| margin +1 | 15 | 46.7% | +2.6% | -11.1% |
| margin +2 | 6 | 16.7% | -67.6% | -61.1% |
| margin ≥+3 | 3 | 66.7% | +5.9% | +38.5% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 35 | 54.3% | +16.1% | +2.3% |
| margin +1 | 13 | 38.5% | -26.5% | -38.9% |
| margin +2 | 10 | 30.0% | -31.3% | -28.6% |
| margin ≥+3 | 5 | 60.0% | +2.4% | +7.0% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 15 | 33.3% | -39.5% | -62.2% |
| margin +1 | 26 | 57.7% | +32.6% | +17.2% |
| margin +2 | 17 | 41.2% | -25.1% | -19.9% |
| margin ≥+3 | 5 | 60.0% | +17.7% | +7.5% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 37 | 51.4% | +7.1% | -1.7% |
| margin +1 | 17 | 47.1% | +2.6% | -11.6% |
| margin +2 | 6 | 16.7% | -67.6% | -61.1% |
| margin ≥+3 | 3 | 66.7% | +5.9% | +38.5% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 48 | 50.0% | +7.1% | -6.3% |
| margin +1 | 10 | 30.0% | -36.0% | -33.2% |
| margin +2 | 3 | 66.7% | +3.2% | +3.8% |
| margin ≥+3 | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 35 | 54.3% | +13.2% | +4.9% |
| margin +1 | 19 | 42.1% | -8.2% | -20.5% |
| margin +2 | 3 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 6 | 50.0% | -14.7% | +7.0% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 16 | 56.3% | +33.4% | +16.8% |
| margin +1 | 26 | 46.2% | -5.7% | -17.0% |
| margin +2 | 11 | 36.4% | -33.8% | -23.7% |
| margin ≥+3 | 10 | 50.0% | -9.5% | -5.6% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 37 | 54.1% | +12.6% | +4.0% |
| margin +1 | 17 | 41.2% | -9.4% | -20.6% |
| margin +2 | 4 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 5 | 60.0% | +2.4% | +24.4% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 14 | 57.1% | +34.3% | +34.4% |
| margin +1 | 19 | 36.8% | -27.9% | -32.8% |
| margin +2 | 20 | 50.0% | +3.1% | -13.2% |
| margin ≥+3 | 10 | 50.0% | -9.5% | -4.2% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 32 | 56.3% | +23.5% | +19.2% |
| margin +1 | 15 | 33.3% | -41.3% | -66.4% |
| margin +2 | 9 | 44.4% | -2.1% | -6.5% |
| margin ≥+3 | 7 | 42.9% | -27.8% | -12.5% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 41 | 53.7% | +18.2% | +7.9% |
| margin +1 | 16 | 31.3% | -45.3% | -46.1% |
| margin +2 | 6 | 50.0% | -17.1% | +5.4% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=63 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletPlayScore≥3 | 20 | 50.0% | +19.2% | +3.2% |
| regime=CLEAR_MOVE | 12 | 66.7% | +14.9% | +24.7% |
| walletPlayScore≥2 | 29 | 48.3% | +12.0% | -0.8% |
| stars≥3.5 | 23 | 47.8% | +10.9% | -4.4% |
| topShare≤0.5 | 39 | 51.3% | +10.3% | +0.3% |
| concPenalty≤2.5 | 55 | 50.9% | +6.3% | -3.9% |
| qFor(roi50+size1)≥1 | 33 | 45.5% | +5.8% | -9.0% |
| stars≥3 | 40 | 47.5% | +2.8% | -9.5% |
| walletCountFor≥3 | 42 | 47.6% | +2.4% | -3.4% |
| meanBase_F≥55 | 26 | 53.8% | +1.9% | -11.0% |
| netEdge≥1 | 39 | 46.2% | +1.2% | -5.9% |
| sumInvested_F≥$10k | 63 | 47.6% | -1.3% | -10.1% |
| maxRoiN_F≥70 | 31 | 48.4% | -2.4% | -18.1% |
| walletCountAgainst=0 | 22 | 50.0% | -2.7% | -15.3% |
| qMargin(roi60+size1.25)≥1 | 24 | 41.7% | -14.5% | -18.2% |
| qMargin(roi50+size1)≥1 | 28 | 39.3% | -19.5% | -22.8% |
| qFor(roi50+size1)≥2 | 13 | 38.5% | -21.1% | -13.3% |
| qFor(roi60+size1.25)≥2 | 13 | 38.5% | -21.1% | -13.3% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| regime=CLEAR_MOVE ∧ meanBase_F≥55 | 5 | 80.0% | +41.4% | +33.7% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 7 | 71.4% | +36.9% | +49.2% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 | 21 | 52.4% | +31.3% | +9.8% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ stars≥3.5 | 17 | 47.1% | +22.6% | -6.6% |
| walletCountFor≥3 ∧ stars≥3.5 | 21 | 52.4% | +21.4% | +9.2% |
| netEdge≥1 ∧ stars≥3.5 | 21 | 52.4% | +21.4% | +9.2% |
| topShare≤0.5 ∧ stars≥3.5 | 21 | 52.4% | +21.4% | +9.2% |
| concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 10 | 70.0% | +21.2% | +22.0% |
| stars≥3.5 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +20.3% | +28.8% |
| qFor(roi50+size1)≥1 ∧ topShare≤0.5 | 24 | 50.0% | +19.8% | +3.8% |
| walletCountFor≥3 ∧ walletPlayScore≥3 | 20 | 50.0% | +19.2% | +3.2% |
| walletPlayScore≥2 ∧ walletPlayScore≥3 | 20 | 50.0% | +19.2% | +3.2% |
| walletPlayScore≥2 ∧ stars≥3.5 | 20 | 50.0% | +19.2% | +3.2% |
| walletPlayScore≥3 ∧ netEdge≥1 | 20 | 50.0% | +19.2% | +3.2% |
| walletPlayScore≥3 ∧ topShare≤0.5 | 20 | 50.0% | +19.2% | +3.2% |
| walletPlayScore≥3 ∧ concPenalty≤2.5 | 20 | 50.0% | +19.2% | +3.2% |
| walletPlayScore≥3 ∧ stars≥3 | 20 | 50.0% | +19.2% | +3.2% |
| walletPlayScore≥3 ∧ stars≥3.5 | 20 | 50.0% | +19.2% | +3.2% |
| walletPlayScore≥3 ∧ sumInvested_F≥$10k | 20 | 50.0% | +19.2% | +3.2% |
| concPenalty≤2.5 ∧ stars≥3.5 | 20 | 50.0% | +19.2% | +3.2% |
| qFor(roi50+size1)≥1 ∧ stars≥3 | 25 | 48.0% | +15.0% | -5.4% |
| regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 12 | 66.7% | +14.9% | +24.7% |
| maxRoiN_F≥70 ∧ meanBase_F≥55 | 15 | 60.0% | +14.8% | -8.8% |
| netEdge≥1 ∧ topShare≤0.5 | 33 | 51.5% | +13.6% | +1.8% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletCountAgainst=0 ∧ concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +58.4% | +60.1% |
| concPenalty≤2.5 ∧ regime=CLEAR_MOVE ∧ meanBase_F≥55 | 5 | 80.0% | +41.4% | +33.7% |
| regime=CLEAR_MOVE ∧ sumInvested_F≥$10k ∧ meanBase_F≥55 | 5 | 80.0% | +41.4% | +33.7% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 7 | 71.4% | +36.9% | +49.2% |
| walletCountFor≥3 ∧ walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +33.6% | +50.8% |
| walletCountAgainst=0 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +33.6% | +50.8% |
| walletCountAgainst=0 ∧ stars≥3 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +33.6% | +50.8% |
| qFor(roi50+size1)≥1 ∧ walletCountFor≥3 ∧ walletPlayScore≥2 | 21 | 52.4% | +31.3% | +9.8% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ topShare≤0.5 | 21 | 52.4% | +31.3% | +9.8% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ concPenalty≤2.5 | 21 | 52.4% | +31.3% | +9.8% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ stars≥3 | 21 | 52.4% | +31.3% | +9.8% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ sumInvested_F≥$10k | 21 | 52.4% | +31.3% | +9.8% |
| qFor(roi50+size1)≥1 ∧ walletCountFor≥3 ∧ walletPlayScore≥3 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ walletCountFor≥3 ∧ stars≥3.5 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ walletPlayScore≥3 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ stars≥3.5 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ netEdge≥1 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ topShare≤0.5 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ concPenalty≤2.5 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ stars≥3 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ stars≥3.5 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ sumInvested_F≥$10k | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ netEdge≥1 ∧ stars≥3.5 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ topShare≤0.5 ∧ stars≥3.5 | 16 | 50.0% | +30.3% | +5.0% |
| qFor(roi50+size1)≥1 ∧ concPenalty≤2.5 ∧ stars≥3.5 | 16 | 50.0% | +30.3% | +5.0% |