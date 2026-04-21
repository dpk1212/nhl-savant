# V8 Goldilocks Deep Dive

_Generated 2026-04-21T09:26:40.712Z_

## 0. Sample & Baseline

- Picks in sample: **35** (LOCKED=31, SHADOW=4)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **51.4%** · flat ROI **+1.6%** · units-wtd ROI **+2.0%**


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

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| maxRoiN_F | +0.471 | +0.496 |
| meanBase_F | +0.387 | +0.339 |
| sumSize_delta | +0.126 | +0.254 |
| maxRoiN_delta | +0.219 | +0.235 |
| sumInvest_delta | +0.101 | +0.212 |
| sumRoiN_delta | +0.021 | +0.202 |
| sumRoiN_A | -0.109 | -0.197 |
| sumInvest_F | +0.055 | +0.192 |
| sumContrib_delta | -0.001 | +0.183 |
| netEdge | -0.008 | +0.170 |
| walletCountAgainst | -0.017 | -0.148 |
| countDelta | -0.028 | +0.141 |
| meanConv_F | +0.061 | +0.136 |
| againstSide | -0.025 | -0.119 |
| meanConv_delta | +0.055 | +0.103 |
| topShare | +0.281 | +0.095 |
| concPenalty | +0.283 | +0.092 |
| meanBase_delta | +0.050 | +0.086 |
| sumSize_F | -0.032 | +0.078 |
| sumContrib_F | -0.092 | +0.061 |
| forSide | -0.093 | +0.059 |
| sumRoiN_F | -0.081 | +0.038 |
| walletPlayScore | -0.153 | +0.024 |
| breadthBonus | -0.116 | -0.013 |
| walletCountFor | -0.116 | -0.013 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥50 (size any) | +0.245 | +0.267 |
| roiNorm≥50 & sizeRatio≥1 | +0.244 | +0.251 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.242 | +0.245 |
| roiNorm≥60 & sizeRatio≥1 | +0.213 | +0.224 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.211 | +0.218 |
| roiNorm≥70 & sizeRatio≥1 | +0.304 | +0.178 |
| contribution≥50 | +0.103 | +0.174 |
| walletBase≥50 & sizeRatio≥1 | +0.230 | +0.166 |
| contribution≥60 | +0.170 | +0.125 |
| walletBase≥60 & sizeRatio≥1 | +0.282 | +0.091 |
| invested≥$5k | -0.046 | +0.062 |
| convictionMult≥1 | +0.003 | +0.052 |
| sizeRatio≥1 (roi any) | +0.003 | +0.052 |
| rankNorm≥60 | -0.153 | -0.215 |

### Per-definition bucket tables


#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 1 | 0.0% | -100.0% | — |
| 1 qFor | 11 | 36.4% | -30.0% | -34.5% |
| 2 qFor | 16 | 62.5% | +17.1% | +17.1% |
| 3+ qFor | 7 | 57.1% | +30.4% | +5.1% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 20 | 55.0% | +1.4% | +13.3% |
| 1 qFor | 10 | 40.0% | -18.0% | -47.1% |
| 2 qFor | 3 | 66.7% | +71.2% | +29.8% |
| 3+ qFor | 2 | 50.0% | -2.8% | +29.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 20 | 55.0% | +1.4% | +13.3% |
| 1 qFor | 10 | 40.0% | -18.0% | -47.1% |
| 2 qFor | 4 | 75.0% | +77.0% | +53.3% |
| 3+ qFor | 1 | 0.0% | -100.0% | -100.0% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 21 | 57.1% | +6.3% | +15.8% |
| 1 qFor | 9 | 33.3% | -31.6% | -57.5% |
| 2 qFor | 3 | 66.7% | +71.2% | +29.8% |
| 3+ qFor | 2 | 50.0% | -2.8% | +29.6% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 21 | 57.1% | +6.3% | +15.8% |
| 1 qFor | 9 | 33.3% | -31.6% | -57.5% |
| 2 qFor | 4 | 75.0% | +77.0% | +53.3% |
| 3+ qFor | 1 | 0.0% | -100.0% | -100.0% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 27 | 51.9% | -2.2% | -1.3% |
| 1 qFor | 6 | 50.0% | +32.6% | +26.7% |
| 2 qFor | 2 | 50.0% | -40.7% | -60.4% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 4 | 25.0% | -58.3% | -58.3% |
| 1 qFor | 14 | 71.4% | +35.9% | +43.9% |
| 2 qFor | 10 | 30.0% | -42.6% | -36.7% |
| 3+ qFor | 7 | 57.1% | +30.4% | +5.1% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 22 | 54.5% | +1.5% | +11.3% |
| 1 qFor | 6 | 50.0% | +2.5% | -12.1% |
| 2 qFor | 3 | 33.3% | -60.4% | -83.0% |
| 3+ qFor | 4 | 50.0% | +47.3% | +30.6% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 15 | 60.0% | +11.7% | +30.0% |
| 1 qFor | 12 | 50.0% | -2.3% | -23.2% |
| 2 qFor | 5 | 40.0% | -37.4% | -25.3% |
| 3+ qFor | 3 | 33.3% | +31.7% | -1.2% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 26 | 53.8% | +9.0% | +12.3% |
| 1 qFor | 7 | 42.9% | -13.8% | -18.2% |
| 2 qFor | 1 | 100.0% | +18.7% | +18.7% |
| 3+ qFor | 1 | 0.0% | -100.0% | -100.0% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 13 | 61.5% | +18.4% | +21.2% |
| 2 qFor | 11 | 45.5% | -21.6% | -8.4% |
| 3+ qFor | 11 | 45.5% | +5.0% | -1.9% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 8 | 62.5% | +13.9% | +9.3% |
| 1 qFor | 14 | 64.3% | +23.7% | +35.8% |
| 2 qFor | 6 | 33.3% | -46.1% | -50.2% |
| 3+ qFor | 7 | 28.6% | -15.8% | -25.4% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 8 | 62.5% | +13.9% | +9.3% |
| 1 qFor | 14 | 64.3% | +23.7% | +35.8% |
| 2 qFor | 6 | 33.3% | -46.1% | -50.2% |
| 3+ qFor | 7 | 28.6% | -15.8% | -25.4% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 19 | 63.2% | +17.4% | +29.7% |
| 2 qFor | 11 | 54.5% | +20.5% | +22.9% |
| 3+ qFor | 5 | 0.0% | -100.0% | -100.0% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| roiNorm≥50 (size any) | +0.264 | +0.328 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.307 | +0.296 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.269 | +0.263 |
| walletBase≥50 & sizeRatio≥1 | +0.313 | +0.250 |
| roiNorm≥50 & sizeRatio≥1 | +0.239 | +0.236 |
| convictionMult≥1 | +0.172 | +0.220 |
| sizeRatio≥1 (roi any) | +0.172 | +0.220 |
| contribution≥60 | +0.282 | +0.213 |
| contribution≥50 | +0.185 | +0.211 |
| roiNorm≥60 & sizeRatio≥1 | +0.194 | +0.196 |
| invested≥$5k | +0.008 | +0.159 |
| walletBase≥60 & sizeRatio≥1 | +0.263 | +0.054 |
| roiNorm≥70 & sizeRatio≥1 | +0.231 | +0.038 |
| rankNorm≥60 | -0.209 | -0.199 |

### Per-definition bucket tables


#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 7 | 42.9% | -27.1% | -27.1% |
| margin +1 | 11 | 27.3% | -46.9% | -55.1% |
| margin +2 | 13 | 76.9% | +58.6% | +58.2% |
| margin ≥+3 | 4 | 50.0% | -0.2% | -24.4% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 23 | 52.2% | -2.9% | +7.0% |
| margin +1 | 10 | 50.0% | +12.9% | -7.7% |
| margin +2 | 2 | 50.0% | -2.8% | -2.8% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 24 | 54.2% | +1.5% | +9.4% |
| margin +1 | 9 | 44.4% | +2.7% | -14.9% |
| margin +2 | 2 | 50.0% | -2.8% | -2.8% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 24 | 54.2% | +1.6% | +9.5% |
| margin +1 | 6 | 50.0% | -11.9% | -29.5% |
| margin +2 | 3 | 33.3% | +31.7% | -1.2% |
| margin ≥+3 | 2 | 50.0% | -2.8% | -2.8% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 22 | 54.5% | +1.5% | +12.8% |
| margin +1 | 11 | 45.5% | +2.6% | -17.6% |
| margin +2 | 1 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 1 | 100.0% | +94.3% | +94.3% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 13 | 46.2% | -15.2% | -15.9% |
| margin +1 | 14 | 71.4% | +33.2% | +43.1% |
| margin +2 | 2 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 6 | 33.3% | -1.8% | -17.5% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 13 | 46.2% | -15.2% | -15.9% |
| margin +1 | 14 | 71.4% | +33.2% | +43.1% |
| margin +2 | 2 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 6 | 33.3% | -1.8% | -17.5% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 20 | 55.0% | +4.3% | +17.2% |
| margin +1 | 10 | 50.0% | -12.0% | -30.3% |
| margin +2 | 4 | 50.0% | +47.3% | +30.6% |
| margin ≥+3 | 1 | 0.0% | -100.0% | -100.0% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 9 | 33.3% | -37.8% | -44.0% |
| margin +1 | 15 | 66.7% | +40.6% | +42.2% |
| margin +2 | 7 | 42.9% | -30.3% | -18.0% |
| margin ≥+3 | 4 | 50.0% | -0.2% | -24.4% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 23 | 56.5% | +6.0% | +15.1% |
| margin +1 | 10 | 40.0% | -7.5% | -24.6% |
| margin +2 | 1 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 1 | 100.0% | +94.3% | +94.3% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 6 | 66.7% | +13.4% | -2.8% |
| margin +1 | 15 | 46.7% | -8.4% | -6.5% |
| margin +2 | 8 | 50.0% | +16.7% | +31.0% |
| margin ≥+3 | 6 | 50.0% | -5.2% | -11.3% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 27 | 55.6% | +12.6% | +14.3% |
| margin +1 | 6 | 33.3% | -33.6% | -27.3% |
| margin +2 | 2 | 50.0% | -40.7% | -60.4% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 28 | 53.6% | +8.5% | +10.8% |
| margin +1 | 6 | 33.3% | -33.3% | -29.8% |
| margin +2 | 1 | 100.0% | +18.7% | +18.7% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 8 | 62.5% | +13.4% | -12.8% |
| margin +1 | 17 | 58.8% | +21.3% | +40.0% |
| margin +2 | 8 | 37.5% | -26.6% | -6.9% |
| margin ≥+3 | 2 | 0.0% | -100.0% | -100.0% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=35 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi50+size1)≥2 | 5 | 60.0% | +41.6% | +29.7% |
| qFor(roi60+size1.25)≥2 | 5 | 60.0% | +41.6% | +29.7% |
| meanBase_F≥55 | 14 | 71.4% | +34.1% | +21.7% |
| regime=CLEAR_MOVE | 8 | 75.0% | +33.0% | +45.8% |
| maxRoiN_F≥70 | 16 | 62.5% | +29.6% | +8.5% |
| stars≥3.5 | 10 | 50.0% | +15.5% | +13.2% |
| walletPlayScore≥3 | 9 | 44.4% | +9.9% | +0.1% |
| walletCountAgainst=0 | 14 | 57.1% | +8.0% | +1.2% |
| concPenalty≤2.5 | 31 | 51.6% | +2.8% | -3.2% |
| qFor(roi50+size1)≥1 | 15 | 46.7% | +1.9% | -12.1% |
| qMargin(roi50+size1)≥1 | 13 | 46.2% | +1.8% | -13.2% |
| qMargin(roi60+size1.25)≥1 | 11 | 45.5% | +1.7% | -10.8% |
| sumInvested_F≥$10k | 35 | 51.4% | +1.6% | +2.0% |
| topShare≤0.5 | 20 | 50.0% | -0.1% | -0.6% |
| netEdge≥1 | 19 | 47.4% | -0.5% | +0.3% |
| walletPlayScore≥2 | 12 | 41.7% | -1.7% | -7.2% |
| stars≥3 | 19 | 47.4% | -4.7% | -2.6% |
| walletCountFor≥3 | 22 | 45.5% | -9.2% | -4.8% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥2 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ netEdge≥1 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ stars≥3.5 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi60+size1.25)≥1 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 | 4 | 75.0% | +77.0% | +53.3% |
| regime=CLEAR_MOVE ∧ meanBase_F≥55 | 3 | 100.0% | +73.1% | +84.0% |
| walletPlayScore≥3 ∧ maxRoiN_F≥70 | 5 | 60.0% | +58.9% | +18.2% |
| stars≥3.5 ∧ maxRoiN_F≥70 | 5 | 60.0% | +58.9% | +18.2% |
| maxRoiN_F≥70 ∧ meanBase_F≥55 | 7 | 85.7% | +57.6% | +29.7% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +54.1% | +54.6% |
| qFor(roi50+size1)≥1 ∧ meanBase_F≥55 | 8 | 75.0% | +41.6% | +18.3% |
| qFor(roi50+size1)≥1 ∧ qFor(roi50+size1)≥2 | 5 | 60.0% | +41.6% | +29.7% |
| qFor(roi50+size1)≥1 ∧ qFor(roi60+size1.25)≥2 | 5 | 60.0% | +41.6% | +29.7% |
| qFor(roi50+size1)≥2 ∧ qFor(roi60+size1.25)≥2 | 5 | 60.0% | +41.6% | +29.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi50+size1)≥1 | 5 | 60.0% | +41.6% | +29.7% |
| qFor(roi50+size1)≥2 ∧ walletCountFor≥3 | 5 | 60.0% | +41.6% | +29.7% |
| qFor(roi50+size1)≥2 ∧ topShare≤0.5 | 5 | 60.0% | +41.6% | +29.7% |
| qFor(roi50+size1)≥2 ∧ concPenalty≤2.5 | 5 | 60.0% | +41.6% | +29.7% |
| qFor(roi50+size1)≥2 ∧ stars≥3 | 5 | 60.0% | +41.6% | +29.7% |
| qFor(roi50+size1)≥2 ∧ sumInvested_F≥$10k | 5 | 60.0% | +41.6% | +29.7% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi50+size1)≥1 ∧ qFor(roi50+size1)≥2 ∧ walletPlayScore≥2 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥1 ∧ qFor(roi50+size1)≥2 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥1 ∧ qFor(roi50+size1)≥2 ∧ netEdge≥1 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥1 ∧ qFor(roi50+size1)≥2 ∧ stars≥3.5 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥1 ∧ qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥1 ∧ qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥1 ∧ qFor(roi60+size1.25)≥2 ∧ netEdge≥1 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥1 ∧ qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qFor(roi60+size1.25)≥2 ∧ netEdge≥1 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥2 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi50+size1)≥1 ∧ netEdge≥1 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi50+size1)≥1 ∧ stars≥3.5 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ netEdge≥1 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ stars≥3.5 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ walletCountFor≥3 ∧ walletPlayScore≥2 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ walletCountFor≥3 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ walletCountFor≥3 ∧ netEdge≥1 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ walletCountFor≥3 ∧ stars≥3.5 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥2 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |