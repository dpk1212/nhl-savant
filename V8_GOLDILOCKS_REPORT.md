# V8 Goldilocks Deep Dive

_Generated 2026-04-25T13:08:21.090Z_

## 0. Sample & Baseline

- Picks in sample: **86** (LOCKED=78, SHADOW=8)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **47.7%** · flat ROI **-2.9%** · units-wtd ROI **-6.1%**


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

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| sumSize_delta | +0.230 | +0.233 |
| countDelta | +0.158 | +0.231 |
| maxRoiN_F | +0.252 | +0.224 |
| walletPlayScore | +0.082 | +0.168 |
| sumInvest_delta | +0.156 | +0.162 |
| sumInvest_F | +0.129 | +0.156 |
| breadthBonus | +0.106 | +0.150 |
| walletCountFor | +0.106 | +0.150 |
| netEdge | +0.085 | +0.142 |
| sumSize_F | +0.129 | +0.140 |
| topShare | -0.025 | -0.135 |
| concPenalty | -0.023 | -0.132 |
| meanConv_F | +0.165 | +0.132 |
| sumContrib_delta | +0.071 | +0.124 |
| sumContrib_F | +0.067 | +0.119 |
| forSide | +0.066 | +0.119 |
| sumRoiN_F | +0.051 | +0.116 |
| meanBase_F | +0.161 | +0.093 |
| sumRoiN_delta | +0.043 | +0.092 |
| maxRoiN_delta | +0.103 | +0.053 |
| meanBase_delta | -0.009 | -0.050 |
| againstSide | +0.041 | +0.025 |
| sumRoiN_A | -0.005 | -0.014 |
| meanConv_delta | +0.013 | -0.011 |
| walletCountAgainst | +0.061 | -0.004 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.357 | +0.232 |
| contribution≥50 | +0.246 | +0.214 |
| roiNorm≥50 & sizeRatio≥1 | +0.237 | +0.191 |
| invested≥$5k | +0.164 | +0.178 |
| walletBase≥50 & sizeRatio≥1 | +0.258 | +0.178 |
| convictionMult≥1 | +0.218 | +0.174 |
| sizeRatio≥1 (roi any) | +0.218 | +0.174 |
| contribution≥60 | +0.273 | +0.164 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.222 | +0.158 |
| roiNorm≥60 & sizeRatio≥1 | +0.234 | +0.155 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.221 | +0.141 |
| rankNorm≥60 | +0.168 | +0.123 |
| roiNorm≥50 (size any) | +0.125 | +0.103 |
| walletBase≥60 & sizeRatio≥1 | +0.256 | +0.087 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 60 | 45.0% | -7.9% | -17.6% |
| 1 qFor | 19 | 52.6% | +13.4% | +11.0% |
| 2 qFor | 5 | 60.0% | +7.9% | +18.1% |
| 3+ qFor | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 9 | 33.3% | -32.6% | -66.8% |
| 1 qFor | 28 | 50.0% | -6.2% | -17.8% |
| 2 qFor | 26 | 42.3% | -2.3% | -9.6% |
| 3+ qFor | 23 | 56.5% | +12.0% | +12.4% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 38 | 42.1% | -22.9% | -21.6% |
| 1 qFor | 31 | 58.1% | +27.5% | +6.8% |
| 2 qFor | 9 | 33.3% | -17.4% | -26.6% |
| 3+ qFor | 8 | 50.0% | -9.8% | +17.6% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 37 | 45.9% | -11.0% | -29.3% |
| 2 qFor | 20 | 40.0% | -27.7% | -15.8% |
| 3+ qFor | 29 | 55.2% | +24.4% | +16.2% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 32 | 50.0% | -4.8% | -10.9% |
| 1 qFor | 29 | 41.4% | -15.8% | -23.6% |
| 2 qFor | 12 | 58.3% | +28.9% | +16.6% |
| 3+ qFor | 13 | 46.2% | +1.0% | +7.8% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 16 | 50.0% | -5.9% | -30.9% |
| 1 qFor | 33 | 45.5% | -10.7% | -14.7% |
| 2 qFor | 15 | 46.7% | -14.0% | -1.2% |
| 3+ qFor | 22 | 50.0% | +18.5% | +9.6% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 16 | 50.0% | -5.9% | -30.9% |
| 1 qFor | 33 | 45.5% | -10.7% | -14.7% |
| 2 qFor | 15 | 46.7% | -14.0% | -1.2% |
| 3+ qFor | 22 | 50.0% | +18.5% | +9.6% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 29 | 44.8% | -13.5% | -12.7% |
| 1 qFor | 27 | 48.1% | -3.7% | -20.5% |
| 2 qFor | 15 | 60.0% | +28.7% | +25.9% |
| 3+ qFor | 15 | 40.0% | -12.9% | -8.3% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 43 | 44.2% | -16.6% | -19.9% |
| 1 qFor | 28 | 57.1% | +26.0% | +11.3% |
| 2 qFor | 10 | 30.0% | -29.2% | -39.1% |
| 3+ qFor | 5 | 60.0% | +5.5% | +43.0% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 46 | 47.8% | -1.0% | -8.3% |
| 1 qFor | 24 | 50.0% | -2.9% | -9.5% |
| 2 qFor | 9 | 33.3% | -17.4% | -29.7% |
| 3+ qFor | 7 | 57.1% | +3.1% | +31.4% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 49 | 46.9% | -3.2% | -12.6% |
| 1 qFor | 22 | 54.5% | +7.7% | +4.4% |
| 2 qFor | 10 | 30.0% | -29.2% | -39.1% |
| 3+ qFor | 5 | 60.0% | +5.5% | +43.0% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 2 | 50.0% | -15.5% | -15.5% |
| 1 qFor | 37 | 45.9% | -11.3% | -19.4% |
| 2 qFor | 30 | 46.7% | -5.3% | -4.0% |
| 3+ qFor | 17 | 52.9% | +20.8% | +7.2% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 6 | 16.7% | -60.8% | -100.0% |
| 1 qFor | 27 | 51.9% | -2.5% | -2.3% |
| 2 qFor | 32 | 46.9% | +3.2% | -10.7% |
| 3+ qFor | 21 | 52.4% | +3.7% | +3.8% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 53 | 49.1% | +6.3% | +2.1% |
| 1 qFor | 25 | 44.0% | -19.8% | -23.9% |
| 2 qFor | 7 | 57.1% | +1.0% | +20.9% |
| 3+ qFor | 1 | 0.0% | -100.0% | -100.0% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| invested≥$5k | +0.192 | +0.217 |
| convictionMult≥1 | +0.264 | +0.189 |
| sizeRatio≥1 (roi any) | +0.264 | +0.189 |
| contribution≥50 | +0.208 | +0.149 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.222 | +0.131 |
| walletBase≥50 & sizeRatio≥1 | +0.241 | +0.124 |
| roiNorm≥70 & sizeRatio≥1 | +0.272 | +0.113 |
| roiNorm≥50 & sizeRatio≥1 | +0.202 | +0.109 |
| roiNorm≥60 & sizeRatio≥1 | +0.201 | +0.107 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.210 | +0.105 |
| rankNorm≥60 | +0.116 | +0.101 |
| contribution≥60 | +0.237 | +0.085 |
| roiNorm≥50 (size any) | +0.113 | +0.074 |
| walletBase≥60 & sizeRatio≥1 | +0.192 | +0.016 |

### Per-definition bucket tables


#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 12 | 66.7% | +18.6% | +27.5% |
| margin +1 | 42 | 35.7% | -21.3% | -48.6% |
| margin +2 | 14 | 57.1% | +29.9% | +41.8% |
| margin ≥+3 | 18 | 55.6% | +0.1% | +6.3% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 25 | 44.0% | -1.5% | -18.0% |
| margin +1 | 37 | 51.4% | +0.5% | -10.1% |
| margin +2 | 8 | 37.5% | -32.5% | +4.4% |
| margin ≥+3 | 16 | 50.0% | +1.6% | +4.3% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 25 | 44.0% | -1.5% | -18.0% |
| margin +1 | 37 | 51.4% | +0.5% | -10.1% |
| margin +2 | 8 | 37.5% | -32.5% | +4.4% |
| margin ≥+3 | 16 | 50.0% | +1.6% | +4.3% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 19 | 47.4% | +12.3% | -11.5% |
| margin +1 | 32 | 46.9% | -6.2% | -15.9% |
| margin +2 | 21 | 42.9% | -20.4% | -11.1% |
| margin ≥+3 | 14 | 57.1% | +10.1% | +14.9% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 54 | 46.3% | -4.9% | -13.1% |
| margin +1 | 22 | 54.5% | +13.1% | +6.9% |
| margin +2 | 7 | 28.6% | -42.2% | -26.9% |
| margin ≥+3 | 3 | 66.7% | +5.9% | +38.5% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 40 | 52.5% | +11.8% | +0.6% |
| margin +1 | 26 | 38.5% | -26.7% | -32.2% |
| margin +2 | 13 | 38.5% | -19.1% | -12.0% |
| margin ≥+3 | 7 | 71.4% | +31.2% | +35.6% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 64 | 46.9% | -1.1% | -7.6% |
| margin +1 | 16 | 43.8% | -15.4% | -15.7% |
| margin +2 | 4 | 75.0% | +34.9% | +38.3% |
| margin ≥+3 | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 46 | 47.8% | -1.1% | -4.0% |
| margin +1 | 28 | 50.0% | +1.6% | -12.5% |
| margin +2 | 6 | 33.3% | -26.7% | -9.3% |
| margin ≥+3 | 6 | 50.0% | -14.7% | +7.0% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 51 | 49.0% | +0.9% | -3.7% |
| margin +1 | 24 | 45.8% | -6.2% | -16.9% |
| margin +2 | 6 | 33.3% | -26.7% | -13.7% |
| margin ≥+3 | 5 | 60.0% | +2.4% | +24.4% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 50 | 46.0% | -4.7% | -12.1% |
| margin +1 | 26 | 53.8% | +10.0% | +3.5% |
| margin +2 | 7 | 28.6% | -42.2% | -26.9% |
| margin ≥+3 | 3 | 66.7% | +5.9% | +38.5% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 21 | 42.9% | -19.6% | -27.4% |
| margin +1 | 35 | 48.6% | +7.8% | -6.9% |
| margin +2 | 20 | 50.0% | -5.4% | +9.7% |
| margin ≥+3 | 10 | 50.0% | -0.5% | -1.8% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 38 | 50.0% | +9.0% | +4.8% |
| margin +1 | 26 | 46.2% | -13.1% | -16.4% |
| margin +2 | 12 | 50.0% | +3.7% | +3.3% |
| margin ≥+3 | 10 | 40.0% | -29.9% | -18.9% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 21 | 52.4% | +17.6% | +30.7% |
| margin +1 | 27 | 37.0% | -31.0% | -40.9% |
| margin +2 | 25 | 56.0% | +16.6% | +5.0% |
| margin ≥+3 | 13 | 46.2% | -15.3% | -8.1% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 56 | 51.8% | +11.5% | +8.1% |
| margin +1 | 22 | 36.4% | -36.6% | -36.9% |
| margin +2 | 8 | 50.0% | -11.6% | +10.9% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=86 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| stars≥3.5 | 36 | 55.6% | +19.9% | +11.3% |
| walletPlayScore≥3 | 27 | 51.9% | +16.8% | +6.8% |
| qFor(roi50+size1)≥1 | 48 | 52.1% | +12.9% | +3.3% |
| walletPlayScore≥2 | 40 | 50.0% | +10.1% | +4.4% |
| topShare≤0.5 | 52 | 51.9% | +9.2% | +3.7% |
| concPenalty≤2.5 | 71 | 52.1% | +7.3% | +3.1% |
| regime=CLEAR_MOVE | 16 | 62.5% | +6.8% | +17.2% |
| stars≥3 | 57 | 50.9% | +6.6% | +1.1% |
| meanBase_F≥55 | 41 | 53.7% | +2.2% | -4.1% |
| maxRoiN_F≥70 | 49 | 51.0% | +1.8% | -5.1% |
| walletCountFor≥3 | 56 | 48.2% | +1.4% | -1.0% |
| netEdge≥1 | 53 | 47.2% | +0.5% | -4.4% |
| qMargin(roi60+size1.25)≥1 | 32 | 50.0% | +0.3% | +1.7% |
| sumInvested_F≥$10k | 86 | 47.7% | -2.9% | -6.1% |
| qMargin(roi50+size1)≥1 | 40 | 47.5% | -5.1% | -8.0% |
| walletCountAgainst=0 | 29 | 48.3% | -7.0% | -15.3% |
| qFor(roi50+size1)≥2 | 17 | 41.2% | -13.8% | -1.9% |
| qFor(roi60+size1.25)≥2 | 15 | 40.0% | -17.6% | -6.8% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 7 | 71.4% | +36.9% | +49.2% |
| qFor(roi50+size1)≥1 ∧ stars≥3.5 | 27 | 59.3% | +35.1% | +13.6% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 | 22 | 54.5% | +29.8% | +13.9% |
| regime=CLEAR_MOVE ∧ meanBase_F≥55 | 8 | 75.0% | +29.6% | +26.0% |
| walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +28.9% | +31.0% |
| concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 12 | 75.0% | +28.5% | +32.1% |
| concPenalty≤2.5 ∧ stars≥3.5 | 31 | 58.1% | +27.7% | +18.9% |
| walletCountAgainst=0 ∧ stars≥3.5 | 9 | 66.7% | +26.9% | +17.8% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 | 31 | 54.8% | +26.2% | +15.7% |
| netEdge≥1 ∧ stars≥3.5 | 30 | 56.7% | +24.4% | +13.7% |
| walletCountFor≥3 ∧ stars≥3.5 | 30 | 56.7% | +24.4% | +15.6% |
| topShare≤0.5 ∧ stars≥3.5 | 30 | 56.7% | +24.4% | +15.6% |
| topShare≤0.5 ∧ regime=CLEAR_MOVE | 9 | 77.8% | +23.3% | +32.1% |
| stars≥3.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +23.0% | +30.0% |
| qFor(roi50+size1)≥1 ∧ topShare≤0.5 | 35 | 54.3% | +21.5% | +13.3% |
| stars≥3 ∧ stars≥3.5 | 36 | 55.6% | +19.9% | +11.3% |
| stars≥3.5 ∧ sumInvested_F≥$10k | 36 | 55.6% | +19.9% | +11.3% |
| walletPlayScore≥2 ∧ stars≥3.5 | 28 | 53.6% | +19.5% | +10.5% |
| qFor(roi50+size1)≥1 ∧ stars≥3 | 39 | 53.8% | +18.8% | +5.9% |
| qFor(roi50+size1)≥1 ∧ concPenalty≤2.5 | 41 | 53.7% | +18.4% | +12.0% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 | 23 | 56.5% | +17.1% | +17.7% |
| walletCountFor≥3 ∧ walletPlayScore≥3 | 27 | 51.9% | +16.8% | +6.8% |
| walletPlayScore≥2 ∧ walletPlayScore≥3 | 27 | 51.9% | +16.8% | +6.8% |
| walletPlayScore≥3 ∧ netEdge≥1 | 27 | 51.9% | +16.8% | +6.8% |
| walletPlayScore≥3 ∧ topShare≤0.5 | 27 | 51.9% | +16.8% | +6.8% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletCountAgainst=0 ∧ concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +58.4% | +60.1% |
| concPenalty≤2.5 ∧ regime=CLEAR_MOVE ∧ meanBase_F≥55 | 7 | 85.7% | +48.2% | +44.1% |
| qFor(roi50+size1)≥1 ∧ concPenalty≤2.5 ∧ stars≥3.5 | 25 | 60.0% | +38.3% | +21.1% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 7 | 71.4% | +36.9% | +49.2% |
| qFor(roi50+size1)≥1 ∧ netEdge≥1 ∧ stars≥3.5 | 24 | 58.3% | +36.1% | +17.5% |
| qFor(roi50+size1)≥1 ∧ walletCountFor≥3 ∧ stars≥3.5 | 24 | 58.3% | +36.1% | +19.8% |
| qFor(roi50+size1)≥1 ∧ topShare≤0.5 ∧ stars≥3.5 | 24 | 58.3% | +36.1% | +19.8% |
| qFor(roi50+size1)≥1 ∧ stars≥3 ∧ stars≥3.5 | 27 | 59.3% | +35.1% | +13.6% |
| qFor(roi50+size1)≥1 ∧ stars≥3.5 ∧ sumInvested_F≥$10k | 27 | 59.3% | +35.1% | +13.6% |
| walletCountFor≥3 ∧ walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +33.6% | +50.8% |
| walletCountAgainst=0 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +33.6% | +50.8% |
| walletCountAgainst=0 ∧ stars≥3 ∧ regime=CLEAR_MOVE | 4 | 75.0% | +33.6% | +50.8% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ stars≥3.5 | 23 | 56.5% | +32.4% | +17.8% |
| qMargin(roi60+size1.25)≥1 ∧ walletCountAgainst=0 ∧ meanBase_F≥55 | 6 | 66.7% | +30.2% | +12.7% |
| walletCountAgainst=0 ∧ stars≥3.5 ∧ meanBase_F≥55 | 6 | 66.7% | +30.2% | +12.7% |
| qFor(roi50+size1)≥1 ∧ walletCountFor≥3 ∧ walletPlayScore≥3 | 22 | 54.5% | +29.8% | +13.9% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ walletPlayScore≥3 | 22 | 54.5% | +29.8% | +13.9% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ netEdge≥1 | 22 | 54.5% | +29.8% | +13.9% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ topShare≤0.5 | 22 | 54.5% | +29.8% | +13.9% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ concPenalty≤2.5 | 22 | 54.5% | +29.8% | +13.9% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ stars≥3 | 22 | 54.5% | +29.8% | +13.9% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ stars≥3.5 | 22 | 54.5% | +29.8% | +13.9% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ sumInvested_F≥$10k | 22 | 54.5% | +29.8% | +13.9% |
| regime=CLEAR_MOVE ∧ sumInvested_F≥$10k ∧ meanBase_F≥55 | 8 | 75.0% | +29.6% | +26.0% |
| walletPlayScore≥2 ∧ regime=CLEAR_MOVE ∧ meanBase_F≥55 | 4 | 75.0% | +29.4% | +32.6% |