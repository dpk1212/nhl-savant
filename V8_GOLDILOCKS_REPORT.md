# V8 Goldilocks Deep Dive

_Generated 2026-04-26T13:46:10.371Z_

## 0. Sample & Baseline

- Picks in sample: **103** (LOCKED=86, SHADOW=17)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **46.6%** · flat ROI **-5.4%** · units-wtd ROI **-11.2%**


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
| 2026-04-23 | MLB | ML | home | 3 | 1 | -155 | 2.42 | 2 | 0 | 2 | LOSS |
| 2026-04-23 | NBA | ML | home | 3.5 | 1.6 | +130 | 4.46 | 2 | 0 | 2 | WIN |
| 2026-04-23 | NBA | ML | home | 4 | 2.5 | +110 | 5.28 | 3 | 1 | 2 | WIN |
| 2026-04-23 | NBA | ML | home | 3 | 1.85 | -104 | 2.12 | 1 | 1 | 0 | WIN |
| 2026-04-23 | NHL | ML | home | 2 | 1.1 | -115 | -2.14 | 0 | 0 | 0 | LOSS |
| 2026-04-23 | NHL | ML | home | 2.5 | 1.35 | +140 | 0.89 | 0 | 1 | -1 | LOSS |
| 2026-04-23 | NBA | SPREAD | away | 3 | 1.6 | -104 | 1.58 | 1 | 0 | 1 | LOSS |
| 2026-04-23 | MLB | TOTAL | under | 3 | 1.75 | -110 | 2.17 | 1 | 0 | 1 | LOSS |
| 2026-04-23 | NBA | TOTAL | over | 4.5 | 2 | -104 | 6.14 | 1 | 0 | 1 | WIN |
| 2026-04-23 | NBA | TOTAL | over | 2.5 | 1.1 | -107 | 0.43 | 0 | 0 | 0 | LOSS |
| 2026-04-23 | NBA | TOTAL | under | 4 | 1.85 | -102 | 5.41 | 0 | 0 | 0 | LOSS |
| 2026-04-24 | MLB | ML | home | 2.5 | 1.5 | -160 | 1.24 | 0 | 0 | 0 | LOSS |
| 2026-04-24 | MLB | ML | home | 2.5 | 0.5 | -207 | -2.08 | 0 | 0 | 0 | LOSS |
| 2026-04-24 | MLB | ML | home | 3.5 | 0.75 | -108 | 1.24 | 1 | 0 | 1 | WIN |
| 2026-04-24 | MLB | ML | away | 2.5 | 0.5 | -145 | -2.00 | 1 | 0 | 1 | WIN |
| 2026-04-24 | NBA | ML | away | 5 | 3 | -295 | 4.27 | 1 | 0 | 1 | WIN |
| 2026-04-24 | NBA | ML | home | 5 | 2 | +120 | 5.39 | 1 | 0 | 1 | LOSS |
| 2026-04-24 | NHL | ML | home | 3.5 | 0.75 | +120 | 1.73 | 1 | 0 | 1 | WIN |
| 2026-04-24 | NHL | ML | home | 5 | 3 | +102 | 0.85 | 0 | 0 | 0 | WIN |
| 2026-04-24 | NHL | ML | away | 3.5 | 0.75 | -110 | -2.50 | 0 | 0 | 0 | LOSS |
| 2026-04-24 | NBA | SPREAD | away | 5 | 2 | -110 | 2.64 | 1 | 3 | -2 | WIN |
| 2026-04-24 | NBA | SPREAD | home | 4 | 1.85 | -110 | 4.59 | 2 | 2 | 0 | LOSS |
| 2026-04-24 | NBA | TOTAL | over | 3.5 | 0.5 | -111 | -2.03 | 1 | 0 | 1 | WIN |
| 2026-04-25 | MLB | ML | away | 2.5 | 0 | +108 | 1.06 | 1 | 0 | 1 | WIN |
| 2026-04-25 | MLB | ML | away | 3.5 | 0.75 | +124 | 0.66 | 1 | 0 | 1 | LOSS |
| 2026-04-25 | MLB | ML | away | 2.5 | 0.5 | +116 | 0.54 | 1 | 1 | 0 | WIN |
| 2026-04-25 | MLB | ML | home | 4 | 1.25 | +128 | 2.35 | 1 | 0 | 1 | LOSS |
| 2026-04-25 | MLB | ML | home | 2.5 | 0.5 | -140 | -1.86 | 1 | 0 | 1 | LOSS |
| 2026-04-25 | NBA | ML | away | 5 | 3 | -118 | 2.82 | 3 | 1 | 2 | LOSS |
| 2026-04-25 | NBA | ML | home | 5 | 2 | +125 | 1.10 | 1 | 0 | 1 | WIN |
| 2026-04-25 | NBA | ML | away | 4 | 1.25 | -130 | 3.57 | 3 | 0 | 3 | WIN |
| 2026-04-25 | NBA | ML | home | 5 | 0.5 | +370 | 1.12 | 0 | 0 | 0 | LOSS |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | -125 | 0.34 | 0 | 0 | 0 | WIN |
| 2026-04-25 | NHL | ML | away | 3.5 | 0.75 | +118 | 0.68 | 1 | 0 | 1 | LOSS |
| 2026-04-25 | NHL | ML | home | 5 | 3 | -120 | 4.87 | 3 | 2 | 1 | LOSS |
| 2026-04-25 | NBA | SPREAD | home | 2.5 | 0.5 | -110 | 1.82 | 0 | 0 | 0 | WIN |
| 2026-04-25 | NBA | SPREAD | home | 5 | 2 | -105 | 4.95 | 1 | 2 | -1 | LOSS |
| 2026-04-25 | MLB | TOTAL | under | 3 | 0.5 | +109 | -0.24 | 0 | 0 | 0 | LOSS |
| 2026-04-25 | NBA | TOTAL | over | 2.5 | 0.5 | -108 | 0.67 | 1 | 0 | 1 | LOSS |
| 2026-04-25 | NBA | TOTAL | over | 2.5 | 0.5 | -103 | 0.50 | 0 | 0 | 0 | WIN |

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| sumSize_delta | +0.199 | +0.208 |
| maxRoiN_F | +0.219 | +0.197 |
| countDelta | +0.144 | +0.193 |
| breadthBonus | +0.080 | +0.120 |
| walletCountFor | +0.080 | +0.120 |
| sumInvest_delta | +0.106 | +0.119 |
| walletPlayScore | +0.035 | +0.117 |
| netEdge | +0.052 | +0.106 |
| sumSize_F | +0.083 | +0.104 |
| sumContrib_delta | +0.044 | +0.091 |
| sumRoiN_F | +0.024 | +0.089 |
| sumContrib_F | +0.030 | +0.088 |
| forSide | +0.029 | +0.088 |
| meanConv_F | +0.104 | +0.083 |
| meanBase_F | +0.128 | +0.082 |
| topShare | +0.018 | -0.082 |
| sumRoiN_delta | +0.042 | +0.076 |
| sumInvest_F | +0.039 | +0.075 |
| concPenalty | +0.024 | -0.073 |
| maxRoiN_delta | +0.096 | +0.046 |
| meanBase_delta | -0.010 | -0.042 |
| meanConv_delta | +0.019 | -0.022 |
| againstSide | +0.018 | +0.020 |
| sumRoiN_A | -0.012 | -0.006 |
| walletCountAgainst | +0.041 | -0.003 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.303 | +0.200 |
| contribution≥50 | +0.170 | +0.156 |
| sizeRatio≥1 (roi any) | +0.188 | +0.149 |
| roiNorm≥50 & sizeRatio≥1 | +0.183 | +0.147 |
| walletBase≥50 & sizeRatio≥1 | +0.207 | +0.143 |
| rankNorm≥60 | +0.177 | +0.143 |
| roiNorm≥60 & sizeRatio≥1 | +0.208 | +0.139 |
| invested≥$5k | +0.124 | +0.138 |
| contribution≥60 | +0.225 | +0.136 |
| convictionMult≥1 | +0.165 | +0.131 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.201 | +0.128 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.179 | +0.123 |
| roiNorm≥50 (size any) | +0.111 | +0.080 |
| walletBase≥60 & sizeRatio≥1 | +0.216 | +0.077 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 69 | 44.9% | -8.6% | -19.8% |
| 1 qFor | 26 | 50.0% | +6.6% | +3.7% |
| 2 qFor | 6 | 50.0% | -10.1% | -17.9% |
| 3+ qFor | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 13 | 38.5% | -24.3% | -46.6% |
| 1 qFor | 33 | 51.5% | -1.5% | -9.9% |
| 2 qFor | 31 | 38.7% | -11.1% | -22.3% |
| 3+ qFor | 26 | 53.8% | +5.9% | +2.1% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 19 | 47.4% | -10.7% | -31.4% |
| 1 qFor | 43 | 46.5% | -7.6% | -11.2% |
| 2 qFor | 15 | 46.7% | -14.0% | -1.2% |
| 3+ qFor | 26 | 46.2% | +7.1% | -7.9% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 43 | 44.2% | -18.7% | -18.8% |
| 1 qFor | 40 | 52.5% | +15.1% | -0.3% |
| 2 qFor | 9 | 33.3% | -17.4% | -26.6% |
| 3+ qFor | 11 | 45.5% | -18.3% | -11.8% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 36 | 50.0% | -4.6% | -10.3% |
| 1 qFor | 38 | 42.1% | -13.9% | -19.6% |
| 2 qFor | 13 | 53.8% | +18.9% | -1.0% |
| 3+ qFor | 16 | 43.8% | -6.9% | -7.8% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 2 | 50.0% | -15.5% | -15.5% |
| 1 qFor | 42 | 42.9% | -17.5% | -27.0% |
| 2 qFor | 39 | 48.7% | -1.8% | -5.1% |
| 3+ qFor | 20 | 50.0% | +13.9% | -1.7% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 53 | 47.2% | -3.4% | -8.6% |
| 1 qFor | 32 | 46.9% | -6.9% | -18.2% |
| 2 qFor | 10 | 40.0% | -7.9% | -19.4% |
| 3+ qFor | 8 | 50.0% | -9.8% | +6.4% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 46 | 47.8% | -6.6% | -21.4% |
| 2 qFor | 25 | 40.0% | -26.4% | -15.2% |
| 3+ qFor | 32 | 50.0% | +12.7% | -1.4% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 33 | 45.5% | -12.5% | -11.5% |
| 1 qFor | 36 | 47.2% | -4.4% | -17.0% |
| 2 qFor | 16 | 56.3% | +20.7% | +9.0% |
| 3+ qFor | 18 | 38.9% | -17.6% | -18.9% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 21 | 52.4% | -0.8% | -26.0% |
| 1 qFor | 41 | 43.9% | -12.6% | -12.8% |
| 2 qFor | 15 | 46.7% | -14.0% | -1.2% |
| 3+ qFor | 26 | 46.2% | +7.1% | -7.9% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 58 | 46.6% | -4.9% | -14.7% |
| 1 qFor | 28 | 50.0% | +0.4% | -5.3% |
| 2 qFor | 12 | 33.3% | -26.3% | -41.2% |
| 3+ qFor | 5 | 60.0% | +5.5% | +43.0% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 50 | 46.0% | -12.8% | -19.7% |
| 1 qFor | 35 | 51.4% | +13.4% | +6.0% |
| 2 qFor | 11 | 27.3% | -35.6% | -50.0% |
| 3+ qFor | 7 | 57.1% | +0.6% | +13.8% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 6 | 16.7% | -60.8% | -100.0% |
| 1 qFor | 34 | 50.0% | -4.8% | +2.5% |
| 2 qFor | 36 | 47.2% | +3.5% | -11.9% |
| 3+ qFor | 27 | 48.1% | -5.7% | -14.4% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 60 | 48.3% | +3.4% | -1.5% |
| 1 qFor | 33 | 42.4% | -19.5% | -26.3% |
| 2 qFor | 9 | 55.6% | -1.8% | +1.8% |
| 3+ qFor | 1 | 0.0% | -100.0% | -100.0% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| invested≥$5k | +0.152 | +0.165 |
| sizeRatio≥1 (roi any) | +0.236 | +0.162 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.229 | +0.148 |
| convictionMult≥1 | +0.215 | +0.146 |
| roiNorm≥70 & sizeRatio≥1 | +0.262 | +0.131 |
| rankNorm≥60 | +0.143 | +0.127 |
| roiNorm≥60 & sizeRatio≥1 | +0.204 | +0.126 |
| walletBase≥50 & sizeRatio≥1 | +0.203 | +0.103 |
| contribution≥50 | +0.145 | +0.096 |
| roiNorm≥50 & sizeRatio≥1 | +0.165 | +0.084 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.181 | +0.084 |
| contribution≥60 | +0.202 | +0.072 |
| roiNorm≥50 (size any) | +0.119 | +0.069 |
| walletBase≥60 & sizeRatio≥1 | +0.177 | +0.033 |

### Per-definition bucket tables


#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 15 | 60.0% | +7.6% | +20.7% |
| margin +1 | 50 | 40.0% | -13.4% | -37.9% |
| margin +2 | 19 | 47.4% | +5.1% | +7.5% |
| margin ≥+3 | 19 | 52.6% | -5.2% | -3.1% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 29 | 44.8% | -1.1% | -16.3% |
| margin +1 | 47 | 48.9% | -3.6% | -12.6% |
| margin +2 | 9 | 33.3% | -40.0% | -16.0% |
| margin ≥+3 | 18 | 50.0% | +0.1% | -2.8% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 65 | 44.6% | -9.0% | -21.7% |
| margin +1 | 26 | 53.8% | +12.7% | +10.8% |
| margin +2 | 9 | 33.3% | -35.4% | -32.2% |
| margin ≥+3 | 3 | 66.7% | +5.9% | +38.5% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 31 | 48.4% | +5.1% | -13.3% |
| margin +1 | 45 | 46.7% | -7.9% | -14.1% |
| margin +2 | 9 | 33.3% | -40.0% | -16.0% |
| margin ≥+3 | 18 | 50.0% | +0.1% | -2.8% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 74 | 45.9% | -4.0% | -13.8% |
| margin +1 | 22 | 45.5% | -10.4% | -7.6% |
| margin +2 | 5 | 60.0% | +7.9% | -8.6% |
| margin ≥+3 | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 23 | 39.1% | -26.6% | -38.3% |
| margin +1 | 40 | 47.5% | +3.6% | -7.5% |
| margin +2 | 27 | 51.9% | -0.4% | +5.4% |
| margin ≥+3 | 13 | 46.2% | -6.2% | -10.9% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 60 | 46.7% | -4.8% | -12.4% |
| margin +1 | 30 | 46.7% | -3.3% | -13.5% |
| margin +2 | 7 | 42.9% | -11.9% | -4.0% |
| margin ≥+3 | 6 | 50.0% | -14.7% | -6.1% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 45 | 53.3% | +12.8% | +1.9% |
| margin +1 | 36 | 36.1% | -30.0% | -36.9% |
| margin +2 | 13 | 38.5% | -19.1% | -12.0% |
| margin ≥+3 | 9 | 66.7% | +21.7% | +17.4% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 25 | 48.0% | +9.5% | -9.4% |
| margin +1 | 38 | 47.4% | -4.9% | -16.7% |
| margin +2 | 23 | 39.1% | -27.3% | -16.7% |
| margin ≥+3 | 17 | 52.9% | +1.0% | -0.8% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 53 | 49.1% | +0.7% | -5.3% |
| margin +1 | 36 | 44.4% | -8.9% | -20.1% |
| margin +2 | 7 | 28.6% | -37.1% | -30.5% |
| margin ≥+3 | 7 | 57.1% | -1.6% | +14.3% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 59 | 47.5% | -2.4% | -14.5% |
| margin +1 | 33 | 45.5% | -6.5% | -11.3% |
| margin +2 | 7 | 28.6% | -42.2% | -26.9% |
| margin ≥+3 | 4 | 75.0% | +23.6% | +45.6% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 43 | 51.2% | +10.1% | +6.2% |
| margin +1 | 36 | 41.7% | -19.9% | -26.1% |
| margin +2 | 12 | 50.0% | +3.7% | +3.3% |
| margin ≥+3 | 12 | 41.7% | -26.8% | -24.2% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 26 | 50.0% | +11.2% | +18.6% |
| margin +1 | 34 | 35.3% | -33.6% | -45.3% |
| margin +2 | 28 | 57.1% | +18.3% | +0.1% |
| margin ≥+3 | 15 | 46.7% | -14.8% | -8.5% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 63 | 50.8% | +8.2% | +4.2% |
| margin +1 | 31 | 35.5% | -34.1% | -41.0% |
| margin +2 | 9 | 55.6% | -1.8% | +17.1% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=103 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletPlayScore≥3 | 30 | 50.0% | +11.0% | -2.1% |
| stars≥3.5 | 46 | 50.0% | +6.5% | -0.7% |
| regime=CLEAR_MOVE | 20 | 60.0% | +5.7% | +22.5% |
| qFor(roi50+size1)≥1 | 60 | 48.3% | +4.1% | -7.3% |
| topShare≤0.5 | 59 | 49.2% | +2.5% | -7.0% |
| walletPlayScore≥2 | 45 | 46.7% | +1.8% | -8.1% |
| concPenalty≤2.5 | 83 | 49.4% | +1.1% | -7.2% |
| qMargin(roi60+size1.25)≥1 | 38 | 50.0% | +0.7% | +0.6% |
| netEdge≥1 | 62 | 46.8% | -1.3% | -13.4% |
| maxRoiN_F≥70 | 63 | 49.2% | -1.6% | -12.0% |
| meanBase_F≥55 | 53 | 50.9% | -1.7% | -9.5% |
| walletCountFor≥3 | 64 | 46.9% | -2.0% | -7.6% |
| stars≥3 | 68 | 47.1% | -2.1% | -7.2% |
| sumInvested_F≥$10k | 103 | 46.6% | -5.4% | -11.2% |
| walletCountAgainst=0 | 35 | 48.6% | -6.8% | -16.0% |
| qMargin(roi50+size1)≥1 | 50 | 44.0% | -11.9% | -15.9% |
| qFor(roi60+size1.25)≥2 | 17 | 41.2% | -16.9% | -13.2% |
| qFor(roi50+size1)≥2 | 20 | 40.0% | -17.9% | -16.9% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +42.3% | +51.5% |
| regime=CLEAR_MOVE ∧ meanBase_F≥55 | 9 | 77.8% | +40.2% | +39.5% |
| walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +28.9% | +31.0% |
| stars≥3.5 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +27.5% | +40.1% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +23.5% | +29.3% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 | 25 | 52.0% | +21.3% | +2.5% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 | 8 | 62.5% | +20.0% | +8.0% |
| qFor(roi50+size1)≥1 ∧ stars≥3.5 | 35 | 51.4% | +15.7% | -2.2% |
| walletCountAgainst=0 ∧ stars≥3.5 | 13 | 61.5% | +15.3% | +11.9% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 | 25 | 56.0% | +14.8% | +11.2% |
| qMargin(roi60+size1.25)≥1 ∧ maxRoiN_F≥70 | 32 | 56.3% | +13.8% | +7.1% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 | 36 | 50.0% | +13.6% | -1.2% |
| qMargin(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 7 | 71.4% | +13.1% | +20.3% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 20 | 55.0% | +12.3% | +12.8% |
| walletPlayScore≥3 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +12.1% | +18.7% |
| walletCountFor≥3 ∧ stars≥3.5 | 37 | 51.4% | +11.7% | +2.3% |
| walletCountFor≥3 ∧ regime=CLEAR_MOVE | 12 | 66.7% | +11.2% | +27.8% |
| walletCountFor≥3 ∧ walletPlayScore≥3 | 30 | 50.0% | +11.0% | -2.1% |
| walletPlayScore≥2 ∧ walletPlayScore≥3 | 30 | 50.0% | +11.0% | -2.1% |
| walletPlayScore≥3 ∧ netEdge≥1 | 30 | 50.0% | +11.0% | -2.1% |
| walletPlayScore≥3 ∧ topShare≤0.5 | 30 | 50.0% | +11.0% | -2.1% |
| walletPlayScore≥3 ∧ concPenalty≤2.5 | 30 | 50.0% | +11.0% | -2.1% |
| walletPlayScore≥3 ∧ stars≥3 | 30 | 50.0% | +11.0% | -2.1% |
| walletPlayScore≥3 ∧ stars≥3.5 | 30 | 50.0% | +11.0% | -2.1% |
| walletPlayScore≥3 ∧ sumInvested_F≥$10k | 30 | 50.0% | +11.0% | -2.1% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletCountAgainst=0 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 3 | 100.0% | +78.1% | +75.7% |
| walletCountAgainst=0 ∧ concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +58.4% | +60.1% |
| concPenalty≤2.5 ∧ regime=CLEAR_MOVE ∧ meanBase_F≥55 | 7 | 85.7% | +48.2% | +44.1% |
| walletCountAgainst=0 ∧ stars≥3 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +42.9% | +53.6% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 8 | 75.0% | +42.3% | +51.5% |
| regime=CLEAR_MOVE ∧ sumInvested_F≥$10k ∧ meanBase_F≥55 | 9 | 77.8% | +40.2% | +39.5% |
| stars≥3.5 ∧ regime=CLEAR_MOVE ∧ meanBase_F≥55 | 4 | 75.0% | +36.7% | +40.2% |
| qFor(roi50+size1)≥1 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +34.7% | +36.8% |
| qMargin(roi50+size1)≥1 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +34.7% | +36.8% |
| qMargin(roi60+size1.25)≥1 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +34.7% | +36.8% |
| stars≥3.5 ∧ regime=CLEAR_MOVE ∧ maxRoiN_F≥70 | 5 | 80.0% | +34.7% | +36.8% |
| walletCountFor≥3 ∧ walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +33.6% | +50.8% |
| walletCountAgainst=0 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +33.6% | +50.8% |
| walletPlayScore≥2 ∧ regime=CLEAR_MOVE ∧ meanBase_F≥55 | 4 | 75.0% | +29.4% | +32.6% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +28.9% | +31.0% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +28.9% | +31.0% |
| walletCountFor≥3 ∧ walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +28.9% | +31.0% |
| walletPlayScore≥2 ∧ netEdge≥1 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +28.9% | +31.0% |
| walletPlayScore≥2 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +28.9% | +31.0% |
| walletPlayScore≥2 ∧ concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +28.9% | +31.0% |
| walletPlayScore≥2 ∧ stars≥3 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +28.9% | +31.0% |
| walletPlayScore≥2 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 5 | 80.0% | +28.9% | +31.0% |
| walletPlayScore≥2 ∧ regime=CLEAR_MOVE ∧ maxRoiN_F≥70 | 5 | 80.0% | +28.9% | +31.0% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 ∧ meanBase_F≥55 | 15 | 66.7% | +28.7% | +27.2% |
| netEdge≥1 ∧ concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +27.8% | +27.6% |