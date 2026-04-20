# V8 Goldilocks Deep Dive

_Generated 2026-04-20T15:09:42.072Z_

## 0. Sample & Baseline

- Picks in sample: **18** (LOCKED=15, SHADOW=3)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **50.0%** · flat ROI **+1.4%** · units-wtd ROI **+19.5%**


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

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| maxRoiN_F | +0.498 | +0.554 |
| sumInvest_F | +0.540 | +0.552 |
| forSide | +0.505 | +0.540 |
| sumContrib_F | +0.505 | +0.540 |
| sumRoiN_delta | +0.311 | +0.531 |
| walletPlayScore | +0.358 | +0.488 |
| sumRoiN_F | +0.434 | +0.488 |
| netEdge | +0.315 | +0.486 |
| sumContrib_delta | +0.284 | +0.482 |
| topShare | -0.354 | -0.465 |
| meanBase_F | +0.503 | +0.457 |
| sumInvest_delta | +0.391 | +0.428 |
| countDelta | +0.191 | +0.418 |
| sumSize_delta | +0.300 | +0.418 |
| breadthBonus | +0.265 | +0.377 |
| walletCountFor | +0.265 | +0.377 |
| sumSize_F | +0.387 | +0.362 |
| concPenalty | -0.207 | -0.282 |
| walletCountAgainst | -0.077 | -0.280 |
| meanConv_F | +0.389 | +0.271 |
| sumRoiN_A | -0.046 | -0.243 |
| maxRoiN_delta | +0.061 | +0.199 |
| againstSide | +0.055 | -0.139 |
| meanConv_delta | +0.003 | +0.073 |
| meanBase_delta | -0.044 | +0.065 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| invested≥$5k | +0.492 | +0.505 |
| contribution≥50 | +0.465 | +0.476 |
| roiNorm≥50 (size any) | +0.410 | +0.424 |
| roiNorm≥50 & sizeRatio≥1 | +0.280 | +0.222 |
| roiNorm≥60 & sizeRatio≥1 | +0.280 | +0.222 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.276 | +0.201 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.276 | +0.201 |
| convictionMult≥1 | +0.191 | +0.176 |
| sizeRatio≥1 (roi any) | +0.191 | +0.176 |
| roiNorm≥70 & sizeRatio≥1 | +0.214 | +0.032 |
| walletBase≥50 & sizeRatio≥1 | +0.127 | +0.011 |
| contribution≥60 | +0.117 | -0.018 |
| walletBase≥60 & sizeRatio≥1 | +0.119 | -0.106 |
| rankNorm≥60 | -0.203 | -0.226 |

### Per-definition bucket tables


#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 4 | 0.0% | -100.0% | -100.0% |
| 2 qFor | 8 | 62.5% | +7.8% | +16.9% |
| 3+ qFor | 6 | 66.7% | +60.6% | +49.0% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 4 | 25.0% | -58.3% | -58.3% |
| 1 qFor | 5 | 40.0% | -30.7% | +13.3% |
| 2 qFor | 4 | 50.0% | -0.2% | +10.6% |
| 3+ qFor | 5 | 80.0% | +82.6% | +57.6% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 1 | 0.0% | -100.0% | — |
| 1 qFor | 8 | 25.0% | -51.9% | -50.9% |
| 2 qFor | 4 | 75.0% | +31.9% | +47.7% |
| 3+ qFor | 5 | 80.0% | +82.6% | +57.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 10 | 40.0% | -29.2% | +10.3% |
| 1 qFor | 4 | 50.0% | +2.5% | -18.0% |
| 2 qFor | 3 | 66.7% | +71.2% | +29.8% |
| 3+ qFor | 1 | 100.0% | +94.3% | +94.3% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 10 | 40.0% | -29.2% | +10.3% |
| 1 qFor | 4 | 50.0% | +2.5% | -18.0% |
| 2 qFor | 3 | 66.7% | +71.2% | +29.8% |
| 3+ qFor | 1 | 100.0% | +94.3% | +94.3% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 10 | 40.0% | -29.2% | +10.3% |
| 1 qFor | 4 | 50.0% | +2.5% | -18.0% |
| 2 qFor | 4 | 75.0% | +77.0% | +53.3% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 10 | 40.0% | -29.2% | +10.3% |
| 1 qFor | 4 | 50.0% | +2.5% | -18.0% |
| 2 qFor | 4 | 75.0% | +77.0% | +53.3% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 3 | 33.3% | -44.4% | -58.3% |
| 1 qFor | 6 | 66.7% | +24.3% | +54.8% |
| 2 qFor | 5 | 40.0% | -35.3% | -41.1% |
| 3+ qFor | 4 | 50.0% | +47.3% | +30.6% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 3 | 33.3% | -44.4% | -58.3% |
| 1 qFor | 6 | 66.7% | +24.3% | +54.8% |
| 2 qFor | 5 | 40.0% | -35.3% | -41.1% |
| 3+ qFor | 4 | 50.0% | +47.3% | +30.6% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 14 | 42.9% | -20.2% | +4.7% |
| 1 qFor | 3 | 66.7% | +96.4% | +56.7% |
| 2 qFor | 1 | 100.0% | +18.7% | +18.7% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 10 | 50.0% | -8.7% | +23.7% |
| 1 qFor | 3 | 33.3% | -31.7% | -41.4% |
| 2 qFor | 2 | 50.0% | -40.7% | -60.4% |
| 3+ qFor | 3 | 66.7% | +96.4% | +56.7% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 9 | 55.6% | +1.4% | +30.4% |
| 1 qFor | 4 | 25.0% | -48.8% | -54.4% |
| 2 qFor | 3 | 66.7% | +4.3% | +28.0% |
| 3+ qFor | 2 | 50.0% | +97.5% | +31.7% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 13 | 46.2% | +0.6% | +18.6% |
| 1 qFor | 4 | 50.0% | -0.2% | +22.8% |
| 2 qFor | 1 | 100.0% | +18.7% | +18.7% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 11 | 54.5% | -2.8% | +28.4% |
| 2 qFor | 6 | 50.0% | +26.0% | +44.5% |
| 3+ qFor | 1 | 0.0% | -100.0% | -100.0% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| contribution≥50 | +0.313 | +0.373 |
| invested≥$5k | +0.228 | +0.346 |
| roiNorm≥50 (size any) | +0.086 | +0.335 |
| convictionMult≥1 | +0.222 | +0.212 |
| sizeRatio≥1 (roi any) | +0.222 | +0.212 |
| roiNorm≥50 & sizeRatio≥1 | +0.143 | +0.123 |
| roiNorm≥60 & sizeRatio≥1 | +0.143 | +0.123 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.129 | +0.106 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.129 | +0.106 |
| walletBase≥50 & sizeRatio≥1 | +0.121 | +0.038 |
| contribution≥60 | +0.055 | -0.038 |
| walletBase≥60 & sizeRatio≥1 | -0.032 | -0.267 |
| roiNorm≥70 & sizeRatio≥1 | -0.156 | -0.331 |
| rankNorm≥60 | -0.441 | -0.366 |

### Per-definition bucket tables


#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 5 | 20.0% | -66.7% | -66.7% |
| margin +1 | 6 | 66.7% | +57.8% | +68.2% |
| margin +2 | 4 | 50.0% | -21.7% | -0.1% |
| margin ≥+3 | 3 | 66.7% | +33.1% | +9.2% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 2 | 50.0% | -40.7% | -40.7% |
| margin +1 | 4 | 25.0% | -48.8% | -48.8% |
| margin +2 | 8 | 50.0% | +16.7% | +31.0% |
| margin ≥+3 | 4 | 75.0% | +42.2% | +34.6% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 4 | 50.0% | -19.1% | +7.9% |
| margin +1 | 6 | 16.7% | -70.0% | -62.1% |
| margin +2 | 5 | 80.0% | +84.5% | +81.9% |
| margin ≥+3 | 3 | 66.7% | +33.1% | +9.2% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 4 | 25.0% | -58.3% | -66.7% |
| margin +1 | 8 | 75.0% | +33.7% | +55.7% |
| margin +2 | 2 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 4 | 50.0% | +47.3% | +30.6% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 4 | 25.0% | -58.3% | -66.7% |
| margin +1 | 8 | 75.0% | +33.7% | +55.7% |
| margin +2 | 2 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 4 | 50.0% | +47.3% | +30.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 11 | 45.5% | -17.0% | +14.9% |
| margin +1 | 5 | 60.0% | +43.7% | +59.1% |
| margin +2 | 1 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 1 | 100.0% | +94.3% | +94.3% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 11 | 45.5% | -17.0% | +14.9% |
| margin +1 | 5 | 60.0% | +43.7% | +59.1% |
| margin +2 | 1 | 0.0% | -100.0% | -100.0% |
| margin ≥+3 | 1 | 100.0% | +94.3% | +94.3% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 11 | 45.5% | -17.0% | +14.9% |
| margin +1 | 5 | 60.0% | +43.7% | +59.1% |
| margin +2 | 2 | 50.0% | -2.8% | -2.8% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 11 | 45.5% | -17.0% | +14.9% |
| margin +1 | 5 | 60.0% | +43.7% | +59.1% |
| margin +2 | 2 | 50.0% | -2.8% | -2.8% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 11 | 54.5% | +1.6% | +27.7% |
| margin +1 | 3 | 33.3% | -60.4% | -66.1% |
| margin +2 | 2 | 50.0% | +97.5% | +97.5% |
| margin ≥+3 | 2 | 50.0% | -2.8% | -2.8% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 11 | 54.5% | +1.6% | +27.7% |
| margin +1 | 3 | 33.3% | -60.4% | -66.1% |
| margin +2 | 3 | 66.7% | +96.4% | +95.9% |
| margin ≥+3 | 1 | 0.0% | -100.0% | -100.0% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 14 | 50.0% | +8.0% | +21.7% |
| margin +1 | 3 | 33.3% | -35.2% | +11.1% |
| margin +2 | 1 | 100.0% | +18.7% | +18.7% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 15 | 46.7% | +0.8% | +26.2% |
| margin +1 | 2 | 50.0% | -2.8% | -2.8% |
| margin +2 | 1 | 100.0% | +18.7% | +18.7% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 3 | 66.7% | +7.9% | +7.9% |
| margin +1 | 9 | 55.6% | +26.8% | +59.7% |
| margin +2 | 5 | 40.0% | -27.8% | -5.6% |
| margin ≥+3 | 1 | 0.0% | -100.0% | -100.0% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=18 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi50+size1)≥2 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi60+size1.25)≥2 | 4 | 75.0% | +77.0% | +53.3% |
| stars≥3.5 | 7 | 71.4% | +65.0% | +53.4% |
| walletPlayScore≥3 | 6 | 66.7% | +64.8% | +48.6% |
| maxRoiN_F≥70 | 6 | 66.7% | +52.2% | +40.1% |
| meanBase_F≥55 | 5 | 80.0% | +44.6% | +63.3% |
| walletPlayScore≥2 | 7 | 57.1% | +41.2% | +36.3% |
| qFor(roi50+size1)≥1 | 8 | 62.5% | +39.8% | +31.0% |
| topShare≤0.5 | 12 | 66.7% | +35.1% | +36.6% |
| stars≥3 | 12 | 66.7% | +35.1% | +36.6% |
| qMargin(roi50+size1)≥1 | 7 | 57.1% | +30.4% | +26.1% |
| qMargin(roi60+size1.25)≥1 | 7 | 57.1% | +30.4% | +26.1% |
| netEdge≥1 | 12 | 58.3% | +25.2% | +32.6% |
| regime=CLEAR_MOVE | 4 | 75.0% | +16.3% | +34.4% |
| walletCountFor≥3 | 14 | 57.1% | +15.8% | +28.1% |
| concPenalty≤2.5 | 15 | 53.3% | +10.6% | +18.0% |
| sumInvested_F≥$10k | 18 | 50.0% | +1.4% | +19.5% |
| walletCountAgainst=0 | 9 | 55.6% | +1.4% | +9.6% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletPlayScore≥3 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| stars≥3.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥2 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ netEdge≥1 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥2 ∧ stars≥3.5 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 3 | 66.7% | +96.4% | +56.7% |
| qFor(roi50+size1)≥1 ∧ maxRoiN_F≥70 | 5 | 80.0% | +82.6% | +57.6% |
| qMargin(roi50+size1)≥1 ∧ maxRoiN_F≥70 | 5 | 80.0% | +82.6% | +57.6% |
| qMargin(roi60+size1.25)≥1 ∧ maxRoiN_F≥70 | 5 | 80.0% | +82.6% | +57.6% |
| qFor(roi50+size1)≥1 ∧ meanBase_F≥55 | 4 | 100.0% | +80.8% | +86.6% |
| qFor(roi50+size1)≥1 ∧ qFor(roi50+size1)≥2 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi50+size1)≥1 ∧ qFor(roi60+size1.25)≥2 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi50+size1)≥2 ∧ qFor(roi60+size1.25)≥2 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi50+size1)≥1 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi60+size1.25)≥1 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi50+size1)≥2 ∧ walletCountFor≥3 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi50+size1)≥2 ∧ topShare≤0.5 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi50+size1)≥2 ∧ concPenalty≤2.5 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi50+size1)≥2 ∧ stars≥3 | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi50+size1)≥2 ∧ sumInvested_F≥$10k | 4 | 75.0% | +77.0% | +53.3% |
| qFor(roi50+size1)≥2 ∧ maxRoiN_F≥70 | 4 | 75.0% | +77.0% | +53.3% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qFor(roi50+size1)≥1 ∧ netEdge≥1 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qFor(roi50+size1)≥1 ∧ stars≥3.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qMargin(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qMargin(roi50+size1)≥1 ∧ netEdge≥1 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qMargin(roi50+size1)≥1 ∧ stars≥3.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qMargin(roi60+size1.25)≥1 ∧ netEdge≥1 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| qMargin(roi60+size1.25)≥1 ∧ stars≥3.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| walletCountFor≥3 ∧ walletPlayScore≥3 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| walletCountFor≥3 ∧ stars≥3.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| walletPlayScore≥2 ∧ walletPlayScore≥3 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| walletPlayScore≥2 ∧ stars≥3.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| walletPlayScore≥3 ∧ netEdge≥1 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| walletPlayScore≥3 ∧ topShare≤0.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| walletPlayScore≥3 ∧ concPenalty≤2.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| walletPlayScore≥3 ∧ stars≥3 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| walletPlayScore≥3 ∧ stars≥3.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| walletPlayScore≥3 ∧ sumInvested_F≥$10k ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| netEdge≥1 ∧ stars≥3.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| topShare≤0.5 ∧ stars≥3.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |
| concPenalty≤2.5 ∧ stars≥3.5 ∧ maxRoiN_F≥70 | 4 | 75.0% | +98.6% | +61.1% |