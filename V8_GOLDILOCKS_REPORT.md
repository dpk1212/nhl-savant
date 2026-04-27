# V8 Goldilocks Deep Dive

_Generated 2026-04-27T14:34:28.657Z_

## 0. Sample & Baseline

- Picks in sample: **130** (LOCKED=105, SHADOW=25)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **47.7%** · flat ROI **-4.9%** · units-wtd ROI **-10.2%**


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
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +108 | 0.38 | 0 | 0 | 0 | LOSS |
| 2026-04-26 | MLB | ML | home | 2.5 | 0.5 | -205 | 0.49 | 0 | 1 | -1 | LOSS |
| 2026-04-26 | MLB | ML | home | 3.5 | 0.75 | -110 | 0.38 | 0 | 0 | 0 | LOSS |
| 2026-04-26 | MLB | ML | away | 5 | 2 | +100 | 0.66 | 1 | 0 | 1 | LOSS |
| 2026-04-26 | MLB | ML | away | 3 | 0 | +110 | -2.72 | 0 | 0 | 0 | LOSS |
| 2026-04-26 | MLB | ML | away | 3 | 0 | +185 | 1.06 | 2 | 1 | 1 | LOSS |
| 2026-04-26 | MLB | ML | away | 3 | 0.5 | +105 | 0.06 | 0 | 0 | 0 | LOSS |
| 2026-04-26 | MLB | ML | home | 2.5 | 0.5 | +114 | 0.27 | 0 | 1 | -1 | WIN |
| 2026-04-26 | MLB | ML | away | 2.5 | 0.5 | -130 | 0.12 | 1 | 0 | 1 | WIN |
| 2026-04-26 | MLB | ML | away | 3.5 | 0.75 | +102 | 0.58 | 0 | 0 | 0 | WIN |
| 2026-04-26 | NBA | ML | away | 5 | 3 | -290 | 1.31 | 1 | 0 | 1 | WIN |
| 2026-04-26 | NBA | ML | away | 5 | 3 | -158 | 2.17 | 2 | 0 | 2 | LOSS |
| 2026-04-26 | NBA | ML | away | 5 | 2 | +156 | 3.03 | 1 | 1 | 0 | LOSS |
| 2026-04-26 | NBA | ML | away | 5 | 3 | -215 | 0.90 | 1 | 0 | 1 | WIN |
| 2026-04-26 | NHL | ML | home | 3.5 | 0.75 | -108 | 0.65 | 1 | 0 | 1 | LOSS |
| 2026-04-26 | NHL | ML | away | 3 | 0.5 | -115 | 2.14 | 0 | 0 | 0 | WIN |
| 2026-04-26 | MLB | SPREAD | away | 4 | 0.75 | -120 | 1.90 | 1 | 0 | 1 | LOSS |
| 2026-04-26 | NBA | SPREAD | away | 3.5 | 0.5 | -105 | 0.98 | 0 | 0 | 0 | WIN |
| 2026-04-26 | NBA | SPREAD | home | 3.5 | 0.5 | -102 | 1.34 | 1 | 1 | 0 | WIN |
| 2026-04-26 | NBA | SPREAD | home | 4 | 0.75 | -110 | 5.81 | 0 | 0 | 0 | WIN |
| 2026-04-26 | MLB | TOTAL | over | 3.5 | 0.5 | -116 | 1.34 | 1 | 1 | 0 | LOSS |
| 2026-04-26 | MLB | TOTAL | under | 2.5 | 0.5 | +106 | 0.54 | 0 | 1 | -1 | WIN |
| 2026-04-26 | MLB | TOTAL | over | 4 | 0.75 | -102 | 2.18 | 0 | 0 | 0 | WIN |
| 2026-04-26 | NBA | TOTAL | over | 4 | 0.75 | -101 | 4.03 | 2 | 1 | 1 | WIN |
| 2026-04-26 | NBA | TOTAL | under | 5 | 2 | -110 | -0.12 | 0 | 1 | -1 | WIN |
| 2026-04-26 | NBA | TOTAL | under | 3.5 | 0.5 | -111 | 1.05 | 1 | 0 | 1 | LOSS |
| 2026-04-26 | NBA | TOTAL | under | 3.5 | 0.5 | -113 | 0.54 | 1 | 0 | 1 | WIN |

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| maxRoiN_F | +0.247 | +0.211 |
| countDelta | +0.174 | +0.193 |
| sumSize_delta | +0.133 | +0.150 |
| breadthBonus | +0.116 | +0.147 |
| walletCountFor | +0.116 | +0.147 |
| sumRoiN_F | +0.061 | +0.112 |
| walletPlayScore | +0.027 | +0.108 |
| meanBase_F | +0.175 | +0.102 |
| sumRoiN_delta | +0.095 | +0.098 |
| netEdge | +0.059 | +0.095 |
| sumContrib_F | +0.034 | +0.084 |
| sumContrib_delta | +0.055 | +0.084 |
| forSide | +0.034 | +0.084 |
| topShare | +0.026 | -0.082 |
| sumSize_F | +0.055 | +0.079 |
| concPenalty | +0.026 | -0.077 |
| meanConv_delta | -0.022 | -0.062 |
| sumInvest_delta | +0.005 | +0.052 |
| meanConv_F | +0.067 | +0.052 |
| sumInvest_F | -0.005 | +0.051 |
| againstSide | +0.040 | +0.047 |
| meanBase_delta | -0.006 | -0.035 |
| walletCountAgainst | +0.066 | +0.034 |
| maxRoiN_delta | +0.095 | +0.029 |
| sumRoiN_A | -0.010 | +0.015 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.302 | +0.182 |
| invested≥$5k | +0.156 | +0.159 |
| contribution≥60 | +0.262 | +0.158 |
| contribution≥50 | +0.171 | +0.152 |
| sizeRatio≥1 (roi any) | +0.178 | +0.133 |
| roiNorm≥50 (size any) | +0.190 | +0.133 |
| roiNorm≥60 & sizeRatio≥1 | +0.208 | +0.130 |
| roiNorm≥50 & sizeRatio≥1 | +0.169 | +0.127 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.215 | +0.126 |
| walletBase≥50 & sizeRatio≥1 | +0.190 | +0.124 |
| convictionMult≥1 | +0.162 | +0.119 |
| rankNorm≥60 | +0.143 | +0.117 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.183 | +0.112 |
| walletBase≥60 & sizeRatio≥1 | +0.239 | +0.082 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 84 | 47.6% | -4.0% | -12.8% |
| 1 qFor | 36 | 47.2% | -4.5% | -7.8% |
| 2 qFor | 8 | 50.0% | -7.7% | -9.6% |
| 3+ qFor | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 61 | 47.5% | -8.7% | -12.6% |
| 2 qFor | 33 | 45.5% | -15.1% | -19.4% |
| 3+ qFor | 36 | 50.0% | +11.0% | -2.4% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 40 | 42.5% | -17.8% | -14.8% |
| 1 qFor | 50 | 52.0% | +2.9% | -6.7% |
| 2 qFor | 20 | 55.0% | +12.8% | +2.6% |
| 3+ qFor | 20 | 40.0% | -15.9% | -21.0% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 17 | 35.3% | -29.5% | -45.2% |
| 1 qFor | 45 | 55.6% | +5.2% | +1.8% |
| 2 qFor | 39 | 38.5% | -15.5% | -26.1% |
| 3+ qFor | 29 | 55.2% | +8.4% | +0.8% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 27 | 48.1% | -6.9% | -22.6% |
| 1 qFor | 58 | 50.0% | -3.7% | -4.2% |
| 2 qFor | 18 | 38.9% | -28.3% | -26.5% |
| 3+ qFor | 27 | 48.1% | +10.5% | -6.1% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 7 | 14.3% | -66.4% | -100.0% |
| 1 qFor | 43 | 48.8% | -6.9% | +1.9% |
| 2 qFor | 50 | 50.0% | +3.9% | -10.0% |
| 3+ qFor | 30 | 50.0% | -2.1% | -14.5% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 67 | 50.7% | +2.7% | -0.3% |
| 1 qFor | 43 | 44.2% | -15.2% | -23.5% |
| 2 qFor | 12 | 41.7% | -6.7% | -12.9% |
| 3+ qFor | 8 | 50.0% | -9.8% | +6.4% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 56 | 48.2% | -9.3% | -8.4% |
| 1 qFor | 51 | 51.0% | +6.8% | -4.9% |
| 2 qFor | 12 | 33.3% | -21.4% | -35.0% |
| 3+ qFor | 11 | 45.5% | -18.3% | -11.8% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 74 | 48.6% | -1.6% | -8.0% |
| 1 qFor | 37 | 48.6% | -6.0% | -12.7% |
| 2 qFor | 14 | 35.7% | -22.6% | -35.6% |
| 3+ qFor | 5 | 60.0% | +5.5% | +43.0% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 48 | 52.1% | +0.6% | -3.9% |
| 1 qFor | 50 | 44.0% | -13.9% | -12.5% |
| 2 qFor | 16 | 50.0% | +9.1% | -17.5% |
| 3+ qFor | 16 | 43.8% | -6.9% | -7.8% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 29 | 51.7% | +0.1% | -18.7% |
| 1 qFor | 56 | 48.2% | -7.2% | -5.2% |
| 2 qFor | 18 | 38.9% | -28.3% | -26.5% |
| 3+ qFor | 27 | 48.1% | +10.5% | -6.1% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 5 | 80.0% | +42.5% | +47.3% |
| 1 qFor | 50 | 44.0% | -16.2% | -20.0% |
| 2 qFor | 53 | 47.2% | -5.7% | -10.7% |
| 3+ qFor | 22 | 50.0% | +12.2% | -5.2% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 65 | 47.7% | -8.6% | -12.3% |
| 1 qFor | 44 | 52.3% | +9.4% | +1.8% |
| 2 qFor | 14 | 28.6% | -35.2% | -51.8% |
| 3+ qFor | 7 | 57.1% | +0.6% | +13.8% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 72 | 50.0% | +5.5% | +1.3% |
| 1 qFor | 45 | 44.4% | -18.0% | -18.2% |
| 2 qFor | 12 | 50.0% | -9.7% | -18.9% |
| 3+ qFor | 1 | 0.0% | -100.0% | -100.0% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| invested≥$5k | +0.133 | +0.137 |
| sizeRatio≥1 (roi any) | +0.206 | +0.127 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.202 | +0.121 |
| roiNorm≥50 (size any) | +0.189 | +0.116 |
| contribution≥50 | +0.175 | +0.114 |
| convictionMult≥1 | +0.191 | +0.113 |
| rankNorm≥60 | +0.115 | +0.107 |
| contribution≥60 | +0.237 | +0.094 |
| roiNorm≥60 & sizeRatio≥1 | +0.163 | +0.083 |
| roiNorm≥70 & sizeRatio≥1 | +0.209 | +0.077 |
| walletBase≥50 & sizeRatio≥1 | +0.168 | +0.070 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.160 | +0.060 |
| roiNorm≥50 & sizeRatio≥1 | +0.124 | +0.041 |
| walletBase≥60 & sizeRatio≥1 | +0.178 | +0.026 |

### Per-definition bucket tables


#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 19 | 63.2% | +15.8% | +29.6% |
| margin +1 | 64 | 40.6% | -15.3% | -29.1% |
| margin +2 | 27 | 51.9% | +9.2% | -0.3% |
| margin ≥+3 | 20 | 50.0% | -9.9% | -8.5% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 41 | 46.3% | -0.6% | -6.9% |
| margin +1 | 60 | 50.0% | -4.1% | -11.1% |
| margin +2 | 11 | 36.4% | -32.8% | -24.7% |
| margin ≥+3 | 18 | 50.0% | +0.1% | -2.8% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 84 | 46.4% | -6.3% | -17.0% |
| margin +1 | 32 | 53.1% | +6.2% | +1.6% |
| margin +2 | 11 | 36.4% | -29.1% | -26.6% |
| margin ≥+3 | 3 | 66.7% | +5.9% | +38.5% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 33 | 48.5% | +5.3% | +22.1% |
| margin +1 | 45 | 37.8% | -28.0% | -44.8% |
| margin +2 | 36 | 58.3% | +16.3% | +0.4% |
| margin ≥+3 | 16 | 50.0% | -8.2% | -5.5% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 31 | 45.2% | +1.3% | -5.2% |
| margin +1 | 53 | 50.9% | +0.3% | -10.5% |
| margin +2 | 29 | 41.4% | -24.3% | -20.0% |
| margin ≥+3 | 17 | 52.9% | +1.0% | -0.8% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 43 | 48.8% | +3.8% | -4.8% |
| margin +1 | 58 | 48.3% | -7.5% | -12.1% |
| margin +2 | 11 | 36.4% | -32.8% | -24.7% |
| margin ≥+3 | 18 | 50.0% | +0.1% | -2.8% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 30 | 46.7% | -13.0% | -20.0% |
| margin +1 | 47 | 46.8% | -0.2% | -3.8% |
| margin +2 | 39 | 48.7% | -6.3% | -11.2% |
| margin ≥+3 | 14 | 50.0% | +0.8% | -8.1% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 54 | 50.0% | +6.1% | +7.1% |
| margin +1 | 48 | 43.8% | -16.9% | -23.6% |
| margin +2 | 16 | 56.3% | +10.6% | +0.1% |
| margin ≥+3 | 12 | 41.7% | -26.8% | -24.2% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 77 | 49.4% | -0.4% | -7.6% |
| margin +1 | 38 | 44.7% | -11.3% | -18.2% |
| margin +2 | 9 | 44.4% | -9.3% | +2.3% |
| margin ≥+3 | 6 | 50.0% | -14.7% | -6.1% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 90 | 48.9% | +0.7% | -7.7% |
| margin +1 | 31 | 41.9% | -21.3% | -18.8% |
| margin +2 | 7 | 57.1% | +5.5% | -0.2% |
| margin ≥+3 | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 61 | 54.1% | +12.4% | +8.6% |
| margin +1 | 46 | 39.1% | -26.9% | -31.3% |
| margin +2 | 14 | 35.7% | -24.9% | -24.2% |
| margin ≥+3 | 9 | 66.7% | +21.7% | +17.4% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 77 | 48.1% | -2.1% | -11.4% |
| margin +1 | 41 | 48.8% | -4.1% | -6.8% |
| margin +2 | 8 | 25.0% | -49.5% | -41.1% |
| margin ≥+3 | 4 | 75.0% | +23.6% | +45.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 69 | 50.7% | +3.1% | -2.0% |
| margin +1 | 46 | 45.7% | -10.4% | -15.7% |
| margin +2 | 8 | 25.0% | -45.0% | -43.7% |
| margin ≥+3 | 7 | 57.1% | -1.6% | +14.3% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 79 | 51.9% | +8.8% | +8.5% |
| margin +1 | 40 | 40.0% | -27.8% | -32.4% |
| margin +2 | 11 | 45.5% | -19.6% | -14.8% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=130 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletPlayScore≥3 | 33 | 51.5% | +12.7% | -3.1% |
| walletPlayScore≥2 | 51 | 49.0% | +5.0% | -10.4% |
| stars≥3.5 | 65 | 50.8% | +3.7% | -3.0% |
| topShare≤0.5 | 67 | 49.3% | +1.8% | -7.3% |
| netEdge≥1 | 75 | 49.3% | +0.9% | -12.2% |
| maxRoiN_F≥70 | 84 | 51.2% | +0.8% | -9.7% |
| concPenalty≤2.5 | 101 | 49.5% | +0.2% | -9.4% |
| meanBase_F≥55 | 73 | 52.1% | -0.6% | -8.1% |
| walletCountFor≥3 | 73 | 47.9% | -0.8% | -7.2% |
| qFor(roi50+size1)≥1 | 74 | 47.3% | -1.5% | -11.1% |
| qMargin(roi60+size1.25)≥1 | 46 | 50.0% | -2.2% | -2.6% |
| stars≥3 | 91 | 47.3% | -4.5% | -7.8% |
| sumInvested_F≥$10k | 130 | 47.7% | -4.9% | -10.2% |
| regime=CLEAR_MOVE | 27 | 51.9% | -9.5% | -1.5% |
| walletCountAgainst=0 | 46 | 47.8% | -10.4% | -16.3% |
| qMargin(roi50+size1)≥1 | 61 | 44.3% | -13.9% | -16.7% |
| qFor(roi60+size1.25)≥2 | 19 | 42.1% | -15.2% | -10.2% |
| qFor(roi50+size1)≥2 | 23 | 39.1% | -19.9% | -21.3% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletCountAgainst=0 ∧ walletPlayScore≥3 | 8 | 62.5% | +20.0% | +8.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 | 27 | 51.9% | +19.7% | -0.4% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 21 | 57.1% | +16.5% | +14.6% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥3 | 15 | 53.3% | +14.9% | +6.2% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 13 | 53.8% | +14.8% | +11.7% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 | 27 | 55.6% | +13.7% | +5.4% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 13 | 61.5% | +12.9% | +13.6% |
| walletCountFor≥3 ∧ walletPlayScore≥3 | 33 | 51.5% | +12.7% | -3.1% |
| walletPlayScore≥2 ∧ walletPlayScore≥3 | 33 | 51.5% | +12.7% | -3.1% |
| walletPlayScore≥3 ∧ netEdge≥1 | 33 | 51.5% | +12.7% | -3.1% |
| walletPlayScore≥3 ∧ topShare≤0.5 | 33 | 51.5% | +12.7% | -3.1% |
| walletPlayScore≥3 ∧ concPenalty≤2.5 | 33 | 51.5% | +12.7% | -3.1% |
| walletPlayScore≥3 ∧ stars≥3 | 33 | 51.5% | +12.7% | -3.1% |
| walletPlayScore≥3 ∧ stars≥3.5 | 33 | 51.5% | +12.7% | -3.1% |
| walletPlayScore≥3 ∧ sumInvested_F≥$10k | 33 | 51.5% | +12.7% | -3.1% |
| walletCountFor≥3 ∧ stars≥3.5 | 44 | 52.3% | +11.8% | +1.2% |
| qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 22 | 54.5% | +11.2% | +5.7% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 | 39 | 48.7% | +10.0% | -7.7% |
| qMargin(roi60+size1.25)≥1 ∧ topShare≤0.5 | 29 | 55.2% | +9.9% | +10.9% |
| netEdge≥1 ∧ topShare≤0.5 | 56 | 51.8% | +8.6% | -6.6% |
| walletPlayScore≥2 ∧ stars≥3.5 | 38 | 50.0% | +8.1% | -10.0% |
| netEdge≥1 ∧ stars≥3.5 | 48 | 52.1% | +7.8% | -5.2% |
| qMargin(roi60+size1.25)≥1 ∧ maxRoiN_F≥70 | 40 | 55.0% | +7.7% | +2.3% |
| maxRoiN_F≥70 ∧ meanBase_F≥55 | 59 | 55.9% | +7.3% | -4.9% |
| walletCountFor≥3 ∧ walletPlayScore≥2 | 50 | 50.0% | +7.1% | -6.8% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi50+size1)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 13 | 61.5% | +32.5% | +30.0% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 ∧ meanBase_F≥55 | 6 | 66.7% | +27.6% | +14.9% |
| qMargin(roi60+size1.25)≥1 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +27.2% | +30.5% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 ∧ meanBase_F≥55 | 17 | 64.7% | +25.3% | +16.8% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 12 | 58.3% | +24.4% | +22.0% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 12 | 58.3% | +24.4% | +22.0% |
| qMargin(roi60+size1.25)≥1 ∧ walletCountFor≥3 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +23.5% | +29.3% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 14 | 57.1% | +23.1% | +14.2% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 ∧ maxRoiN_F≥70 | 20 | 60.0% | +22.3% | +17.9% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ meanBase_F≥55 | 8 | 62.5% | +21.4% | +20.3% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ meanBase_F≥55 | 8 | 62.5% | +21.4% | +20.3% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 ∧ meanBase_F≥55 | 8 | 62.5% | +21.4% | +20.3% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 ∧ meanBase_F≥55 | 14 | 64.3% | +21.0% | +17.5% |
| walletCountFor≥3 ∧ walletCountAgainst=0 ∧ walletPlayScore≥3 | 8 | 62.5% | +20.0% | +8.0% |
| walletCountAgainst=0 ∧ walletPlayScore≥2 ∧ walletPlayScore≥3 | 8 | 62.5% | +20.0% | +8.0% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 ∧ netEdge≥1 | 8 | 62.5% | +20.0% | +8.0% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 ∧ topShare≤0.5 | 8 | 62.5% | +20.0% | +8.0% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 ∧ concPenalty≤2.5 | 8 | 62.5% | +20.0% | +8.0% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 ∧ stars≥3 | 8 | 62.5% | +20.0% | +8.0% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 ∧ stars≥3.5 | 8 | 62.5% | +20.0% | +8.0% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 ∧ sumInvested_F≥$10k | 8 | 62.5% | +20.0% | +8.0% |
| qFor(roi50+size1)≥1 ∧ walletCountFor≥3 ∧ walletPlayScore≥3 | 27 | 51.9% | +19.7% | -0.4% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥2 ∧ walletPlayScore≥3 | 27 | 51.9% | +19.7% | -0.4% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ netEdge≥1 | 27 | 51.9% | +19.7% | -0.4% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 ∧ topShare≤0.5 | 27 | 51.9% | +19.7% | -0.4% |