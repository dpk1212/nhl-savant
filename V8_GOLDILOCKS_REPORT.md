# V8 Goldilocks Deep Dive

_Generated 2026-04-28T15:04:06.648Z_

## 0. Sample & Baseline

- Picks in sample: **148** (LOCKED=120, SHADOW=28)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **48.6%** · flat ROI **-4.0%** · units-wtd ROI **-6.6%**


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
| 2026-04-27 | MLB | ML | away | 2.5 | 0.5 | +100 | 0.55 | 0 | 0 | 0 | LOSS |
| 2026-04-27 | MLB | ML | home | 2.5 | 0.5 | +100 | -1.64 | 1 | 0 | 1 | WIN |
| 2026-04-27 | MLB | ML | home | 5 | 2 | +140 | 3.48 | 1 | 0 | 1 | LOSS |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | -130 | 0.21 | 1 | 0 | 1 | LOSS |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +104 | 1.19 | 1 | 0 | 1 | WIN |
| 2026-04-27 | MLB | ML | away | 3.5 | 0.75 | +119 | 1.46 | 2 | 1 | 1 | WIN |
| 2026-04-27 | NBA | ML | home | 5 | 2 | +130 | 0.74 | 1 | 1 | 0 | WIN |
| 2026-04-27 | NBA | ML | home | 5 | 3 | -500 | 4.76 | 3 | 1 | 2 | WIN |
| 2026-04-27 | NBA | ML | away | 4 | 1.25 | -500 | 3.31 | 1 | 1 | 0 | WIN |
| 2026-04-27 | NHL | ML | home | 4 | 1.25 | -132 | 3.24 | 1 | 0 | 1 | WIN |
| 2026-04-27 | NHL | ML | away | 5 | 3 | -120 | 2.19 | 2 | 0 | 2 | WIN |
| 2026-04-27 | NBA | SPREAD | away | 4 | 0.75 | -114 | 5.29 | 5 | 1 | 4 | LOSS |
| 2026-04-27 | NBA | SPREAD | home | 3.5 | 0.5 | -105 | 2.87 | 3 | 2 | 1 | WIN |
| 2026-04-27 | NBA | SPREAD | away | 2.5 | 0.5 | -104 | 0.50 | 0 | 0 | 0 | LOSS |
| 2026-04-27 | NBA | TOTAL | over | 5 | 2 | -104 | 2.63 | 2 | 1 | 1 | LOSS |
| 2026-04-27 | NBA | TOTAL | over | 5 | 2 | -115 | 4.01 | 0 | 0 | 0 | WIN |
| 2026-04-27 | NBA | TOTAL | under | 3.5 | 0.5 | -104 | 1.18 | 0 | 0 | 0 | LOSS |
| 2026-04-27 | NHL | TOTAL | under | 3.5 | 0.5 | -119 | 1.30 | 1 | 0 | 1 | LOSS |

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| maxRoiN_F | +0.253 | +0.199 |
| countDelta | +0.200 | +0.183 |
| sumSize_delta | +0.125 | +0.148 |
| breadthBonus | +0.148 | +0.138 |
| walletCountFor | +0.148 | +0.138 |
| sumRoiN_F | +0.105 | +0.114 |
| walletPlayScore | +0.064 | +0.099 |
| sumRoiN_delta | +0.127 | +0.094 |
| sumSize_F | +0.081 | +0.091 |
| sumContrib_F | +0.073 | +0.088 |
| forSide | +0.073 | +0.087 |
| meanBase_F | +0.151 | +0.087 |
| netEdge | +0.082 | +0.084 |
| topShare | -0.014 | -0.072 |
| meanConv_F | +0.083 | +0.072 |
| sumContrib_delta | +0.074 | +0.070 |
| meanConv_delta | -0.054 | -0.068 |
| concPenalty | -0.009 | -0.063 |
| againstSide | +0.068 | +0.054 |
| sumInvest_F | -0.020 | +0.039 |
| walletCountAgainst | +0.092 | +0.034 |
| sumInvest_delta | -0.029 | +0.034 |
| meanBase_delta | -0.022 | -0.031 |
| maxRoiN_delta | +0.083 | +0.028 |
| sumRoiN_A | +0.013 | +0.019 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.316 | +0.194 |
| contribution≥50 | +0.203 | +0.151 |
| invested≥$5k | +0.168 | +0.148 |
| roiNorm≥60 & sizeRatio≥1 | +0.232 | +0.144 |
| contribution≥60 | +0.269 | +0.141 |
| sizeRatio≥1 (roi any) | +0.198 | +0.138 |
| roiNorm≥50 & sizeRatio≥1 | +0.192 | +0.138 |
| roiNorm≥50 (size any) | +0.225 | +0.128 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.235 | +0.127 |
| convictionMult≥1 | +0.187 | +0.126 |
| walletBase≥50 & sizeRatio≥1 | +0.182 | +0.122 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.201 | +0.112 |
| rankNorm≥60 | +0.130 | +0.096 |
| walletBase≥60 & sizeRatio≥1 | +0.239 | +0.085 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 89 | 46.1% | -7.3% | -12.5% |
| 1 qFor | 46 | 52.2% | +1.6% | -1.1% |
| 2 qFor | 11 | 54.5% | +4.8% | -3.2% |
| 3+ qFor | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 17 | 35.3% | -29.5% | -45.2% |
| 1 qFor | 52 | 51.9% | -0.7% | +2.3% |
| 2 qFor | 46 | 43.5% | -8.7% | -20.2% |
| 3+ qFor | 33 | 57.6% | +10.3% | +5.6% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 1 qFor | 69 | 47.8% | -8.3% | -7.4% |
| 2 qFor | 40 | 47.5% | -12.4% | -16.6% |
| 3+ qFor | 39 | 51.3% | +12.2% | +1.5% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 71 | 49.3% | -0.5% | +0.1% |
| 1 qFor | 51 | 47.1% | -10.3% | -17.7% |
| 2 qFor | 15 | 46.7% | +1.5% | -2.0% |
| 3+ qFor | 11 | 54.5% | -5.7% | +6.7% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 40 | 42.5% | -17.8% | -14.8% |
| 1 qFor | 60 | 51.7% | +2.9% | -0.3% |
| 2 qFor | 25 | 56.0% | +9.9% | +3.1% |
| 3+ qFor | 23 | 43.5% | -13.1% | -18.0% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 28 | 46.4% | -10.2% | -24.6% |
| 1 qFor | 69 | 50.7% | -2.9% | +0.0% |
| 2 qFor | 21 | 42.9% | -19.4% | -15.0% |
| 3+ qFor | 30 | 50.0% | +9.9% | -5.0% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 60 | 46.7% | -12.2% | -7.4% |
| 1 qFor | 59 | 52.5% | +8.1% | -1.6% |
| 2 qFor | 15 | 40.0% | -10.3% | -18.6% |
| 3+ qFor | 14 | 50.0% | -13.3% | -8.6% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 7 | 14.3% | -66.4% | -100.0% |
| 1 qFor | 45 | 48.9% | -6.6% | +1.9% |
| 2 qFor | 57 | 50.9% | +5.7% | -3.4% |
| 3+ qFor | 39 | 51.3% | -4.1% | -10.6% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 79 | 48.1% | -2.7% | -5.8% |
| 1 qFor | 46 | 50.0% | -4.2% | -10.9% |
| 2 qFor | 15 | 40.0% | -15.5% | -19.3% |
| 3+ qFor | 8 | 62.5% | +5.4% | +31.7% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 30 | 50.0% | -3.3% | -20.7% |
| 1 qFor | 67 | 49.3% | -5.8% | -0.8% |
| 2 qFor | 21 | 42.9% | -19.4% | -15.0% |
| 3+ qFor | 30 | 50.0% | +9.9% | -5.0% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 52 | 51.9% | -0.2% | +0.6% |
| 1 qFor | 59 | 45.8% | -11.1% | -5.8% |
| 2 qFor | 19 | 52.6% | +13.7% | -17.7% |
| 3+ qFor | 18 | 44.4% | -10.6% | -7.3% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 70 | 47.1% | -9.3% | -9.6% |
| 1 qFor | 53 | 52.8% | +8.4% | +1.3% |
| 2 qFor | 15 | 33.3% | -27.3% | -34.6% |
| 3+ qFor | 10 | 60.0% | +2.0% | +12.3% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 8 | 62.5% | +16.5% | +29.3% |
| 1 qFor | 60 | 45.0% | -15.2% | -19.8% |
| 2 qFor | 57 | 50.9% | +0.3% | +1.6% |
| 3+ qFor | 23 | 47.8% | +7.4% | -7.1% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 78 | 50.0% | +4.8% | +4.2% |
| 1 qFor | 54 | 48.1% | -12.1% | -9.3% |
| 2 qFor | 14 | 50.0% | -8.7% | -23.3% |
| 3+ qFor | 2 | 0.0% | -100.0% | -100.0% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| sizeRatio≥1 (roi any) | +0.211 | +0.118 |
| roiNorm≥70 & sizeRatio≥1 | +0.238 | +0.113 |
| invested≥$5k | +0.117 | +0.108 |
| convictionMult≥1 | +0.200 | +0.107 |
| roiNorm≥50 (size any) | +0.214 | +0.105 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.202 | +0.102 |
| contribution≥50 | +0.180 | +0.096 |
| roiNorm≥60 & sizeRatio≥1 | +0.183 | +0.093 |
| rankNorm≥60 | +0.087 | +0.079 |
| walletBase≥50 & sizeRatio≥1 | +0.150 | +0.059 |
| contribution≥60 | +0.220 | +0.058 |
| roiNorm≥50 & sizeRatio≥1 | +0.143 | +0.054 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.164 | +0.049 |
| walletBase≥60 & sizeRatio≥1 | +0.154 | +0.011 |

### Per-definition bucket tables


#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 44 | 47.7% | +0.6% | +0.7% |
| margin +1 | 71 | 49.3% | -5.1% | -11.2% |
| margin +2 | 12 | 41.7% | -23.1% | -10.0% |
| margin ≥+3 | 21 | 52.4% | +0.8% | -1.6% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 96 | 47.9% | -2.4% | -7.3% |
| margin +1 | 42 | 47.6% | -10.7% | -8.9% |
| margin +2 | 8 | 62.5% | +19.7% | +8.5% |
| margin ≥+3 | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 22 | 63.6% | +15.9% | +32.8% |
| margin +1 | 74 | 43.2% | -11.8% | -22.5% |
| margin +2 | 30 | 50.0% | +4.8% | -5.8% |
| margin ≥+3 | 22 | 50.0% | -9.8% | -3.3% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 46 | 50.0% | +4.6% | +2.4% |
| margin +1 | 69 | 47.8% | -8.0% | -12.1% |
| margin +2 | 12 | 41.7% | -23.1% | -10.0% |
| margin ≥+3 | 21 | 52.4% | +0.8% | -1.6% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 35 | 48.6% | +5.8% | +27.1% |
| margin +1 | 51 | 39.2% | -24.4% | -41.3% |
| margin +2 | 40 | 60.0% | +18.7% | +4.5% |
| margin ≥+3 | 22 | 50.0% | -13.8% | -5.9% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 91 | 47.3% | -5.2% | -10.8% |
| margin +1 | 40 | 52.5% | +4.3% | -3.4% |
| margin +2 | 14 | 42.9% | -22.6% | -9.5% |
| margin ≥+3 | 3 | 66.7% | +5.9% | +38.5% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 35 | 42.9% | -3.7% | -1.6% |
| margin +1 | 61 | 52.5% | +2.2% | -7.4% |
| margin +2 | 32 | 43.8% | -19.5% | -18.9% |
| margin ≥+3 | 20 | 55.0% | +1.1% | +5.5% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 83 | 49.4% | -1.1% | -3.0% |
| margin +1 | 47 | 46.8% | -7.1% | -18.2% |
| margin +2 | 12 | 50.0% | -6.7% | +13.8% |
| margin ≥+3 | 6 | 50.0% | -14.7% | -6.1% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 39 | 46.2% | -13.5% | -11.3% |
| margin +1 | 55 | 49.1% | +1.4% | -4.0% |
| margin +2 | 40 | 50.0% | -4.0% | -4.5% |
| margin ≥+3 | 14 | 50.0% | +0.8% | -8.1% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 67 | 55.2% | +13.0% | +15.5% |
| margin +1 | 56 | 41.1% | -22.0% | -26.9% |
| margin +2 | 16 | 37.5% | -26.8% | -21.2% |
| margin ≥+3 | 9 | 66.7% | +21.7% | +17.4% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 56 | 51.8% | +10.4% | +14.1% |
| margin +1 | 60 | 45.0% | -15.4% | -19.6% |
| margin +2 | 19 | 57.9% | +9.1% | +3.5% |
| margin ≥+3 | 13 | 38.5% | -32.4% | -26.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 75 | 50.7% | +2.1% | +2.6% |
| margin +1 | 55 | 47.3% | -7.0% | -16.1% |
| margin +2 | 10 | 40.0% | -25.7% | -17.5% |
| margin ≥+3 | 8 | 50.0% | -13.9% | +7.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 84 | 48.8% | -1.2% | -5.1% |
| margin +1 | 49 | 49.0% | -3.9% | -10.0% |
| margin +2 | 10 | 40.0% | -29.2% | -15.2% |
| margin ≥+3 | 5 | 60.0% | -1.1% | +31.1% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 88 | 53.4% | +9.6% | +14.0% |
| margin +1 | 48 | 41.7% | -23.5% | -29.0% |
| margin +2 | 11 | 45.5% | -19.6% | -14.8% |
| margin ≥+3 | 1 | 0.0% | -100.0% | -100.0% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=148 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletPlayScore≥3 | 39 | 53.8% | +10.9% | -1.3% |
| walletPlayScore≥2 | 60 | 51.7% | +5.6% | -6.8% |
| stars≥3.5 | 80 | 52.5% | +4.7% | +1.1% |
| maxRoiN_F≥70 | 99 | 53.5% | +4.0% | -4.1% |
| topShare≤0.5 | 78 | 51.3% | +2.8% | -4.1% |
| regime=CLEAR_MOVE | 36 | 58.3% | +2.7% | +12.0% |
| netEdge≥1 | 86 | 51.2% | +1.8% | -8.7% |
| qFor(roi50+size1)≥1 | 88 | 50.0% | +1.5% | -6.2% |
| walletCountFor≥3 | 86 | 50.0% | +0.9% | -2.2% |
| concPenalty≤2.5 | 115 | 50.4% | +0.2% | -6.6% |
| qMargin(roi60+size1.25)≥1 | 57 | 50.9% | -2.2% | -2.4% |
| stars≥3 | 106 | 49.1% | -2.6% | -3.6% |
| meanBase_F≥55 | 86 | 51.2% | -3.3% | -5.3% |
| sumInvested_F≥$10k | 148 | 48.6% | -4.0% | -6.6% |
| walletCountAgainst=0 | 48 | 50.0% | -5.7% | -13.4% |
| qFor(roi60+size1.25)≥2 | 23 | 47.8% | -8.3% | -0.1% |
| qMargin(roi50+size1)≥1 | 73 | 46.6% | -10.3% | -13.3% |
| qFor(roi50+size1)≥2 | 29 | 44.8% | -11.8% | -13.0% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 16 | 75.0% | +26.6% | +17.4% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 15 | 66.7% | +24.8% | +19.4% |
| qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 | 8 | 62.5% | +20.0% | +8.0% |
| walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 11 | 72.7% | +14.8% | +10.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 | 32 | 53.1% | +13.9% | -2.1% |
| walletCountFor≥3 ∧ stars≥3.5 | 57 | 54.4% | +11.4% | +5.8% |
| walletCountFor≥3 ∧ walletPlayScore≥3 | 39 | 53.8% | +10.9% | -1.3% |
| walletPlayScore≥2 ∧ walletPlayScore≥3 | 39 | 53.8% | +10.9% | -1.3% |
| walletPlayScore≥3 ∧ netEdge≥1 | 39 | 53.8% | +10.9% | -1.3% |
| walletPlayScore≥3 ∧ topShare≤0.5 | 39 | 53.8% | +10.9% | -1.3% |
| walletPlayScore≥3 ∧ concPenalty≤2.5 | 39 | 53.8% | +10.9% | -1.3% |
| walletPlayScore≥3 ∧ stars≥3 | 39 | 53.8% | +10.9% | -1.3% |
| walletPlayScore≥3 ∧ stars≥3.5 | 39 | 53.8% | +10.9% | -1.3% |
| walletPlayScore≥3 ∧ sumInvested_F≥$10k | 39 | 53.8% | +10.9% | -1.3% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 | 18 | 55.6% | +10.6% | +7.4% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 18 | 55.6% | +10.6% | +7.4% |
| regime=CLEAR_MOVE ∧ meanBase_F≥55 | 24 | 62.5% | +10.4% | +13.9% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 | 34 | 55.9% | +10.1% | +3.9% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 25 | 56.0% | +9.7% | +9.4% |
| stars≥3.5 ∧ regime=CLEAR_MOVE | 22 | 63.6% | +9.2% | +16.5% |
| walletCountFor≥3 ∧ regime=CLEAR_MOVE | 20 | 65.0% | +9.2% | +26.5% |
| netEdge≥1 ∧ topShare≤0.5 | 65 | 53.8% | +8.6% | -3.7% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥3 | 17 | 52.9% | +8.4% | +4.9% |
| walletPlayScore≥2 ∧ stars≥3.5 | 47 | 53.2% | +8.3% | -5.8% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qMargin(roi60+size1.25)≥1 ∧ walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +45.2% | +11.6% |
| qMargin(roi60+size1.25)≥1 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 9 | 88.9% | +40.2% | +39.1% |
| qMargin(roi60+size1.25)≥1 ∧ walletCountFor≥3 ∧ regime=CLEAR_MOVE | 11 | 81.8% | +35.2% | +36.8% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 ∧ meanBase_F≥55 | 6 | 66.7% | +27.6% | +14.9% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE ∧ meanBase_F≥55 | 9 | 66.7% | +27.5% | +13.0% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 9 | 77.8% | +27.0% | +19.8% |
| qFor(roi50+size1)≥1 ∧ qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 16 | 75.0% | +26.6% | +17.4% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 16 | 75.0% | +26.6% | +17.4% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ maxRoiN_F≥70 | 16 | 75.0% | +26.6% | +17.4% |
| walletCountFor≥3 ∧ walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 10 | 80.0% | +26.3% | +25.4% |
| walletPlayScore≥2 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 10 | 80.0% | +26.3% | +25.4% |
| qMargin(roi60+size1.25)≥1 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 12 | 75.0% | +25.9% | +17.5% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +25.0% | +23.3% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +25.0% | +23.3% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +25.0% | +23.3% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 15 | 66.7% | +24.8% | +19.4% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE ∧ maxRoiN_F≥70 | 9 | 66.7% | +24.4% | +6.8% |
| qFor(roi50+size1)≥1 ∧ qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi50+size1)≥2 ∧ qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi50+size1)≥2 ∧ walletCountFor≥3 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi50+size1)≥2 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |