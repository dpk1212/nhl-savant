# V8 Goldilocks Deep Dive

_Generated 2026-05-06T15:11:27.354Z_

## 0. Sample & Baseline

- Picks in sample: **285** (LOCKED=181, SHADOW=104)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **46.7%** · flat ROI **-8.7%** · units-wtd ROI **-6.0%**


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
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -118 | 0.80 | 0 | 0 | 0 | WIN |
| 2026-04-28 | MLB | ML | away | 5 | 3 | -102 | 0.69 | 0 | 0 | 0 | LOSS |
| 2026-04-28 | MLB | ML | away | 3.5 | 0.75 | -118 | 0.99 | 1 | 0 | 1 | WIN |
| 2026-04-28 | MLB | ML | home | 5 | 3 | -124 | 0.49 | 1 | 0 | 1 | WIN |
| 2026-04-28 | MLB | ML | home | 3 | 0 | +112 | -2.38 | 0 | 0 | 0 | WIN |
| 2026-04-28 | MLB | ML | home | 5 | 2 | +102 | 2.59 | 2 | 0 | 2 | LOSS |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | +108 | 1.07 | 0 | 0 | 0 | LOSS |
| 2026-04-28 | MLB | ML | away | 5 | 2 | +142 | 1.98 | 2 | 1 | 1 | LOSS |
| 2026-04-28 | MLB | ML | home | 3.5 | 0.75 | -152 | 0.88 | 0 | 0 | 0 | LOSS |
| 2026-04-28 | MLB | ML | away | 5 | 2 | +112 | 0.57 | 1 | 1 | 0 | WIN |
| 2026-04-28 | NBA | ML | away | 5 | 0.5 | +215 | 4.01 | 1 | 1 | 0 | LOSS |
| 2026-04-28 | NBA | ML | home | 4 | 1.25 | -550 | 2.20 | 0 | 0 | 0 | LOSS |
| 2026-04-28 | NBA | ML | home | 5 | 3 | -600 | 1.99 | 0 | 0 | 0 | WIN |
| 2026-04-28 | NHL | ML | away | 4 | 0.5 | +135 | 1.92 | 3 | 2 | 1 | LOSS |
| 2026-04-28 | NHL | ML | away | 5 | 2 | +142 | 1.19 | 0 | 0 | 0 | WIN |
| 2026-04-28 | NHL | ML | home | 2.5 | 0.5 | -126 | 0.78 | 0 | 1 | -1 | LOSS |
| 2026-04-28 | NBA | SPREAD | away | 3.5 | 0.5 | -112 | 0.46 | 0 | 0 | 0 | LOSS |
| 2026-04-28 | NBA | SPREAD | away | 5 | 2 | -105 | 7.78 | 5 | 1 | 4 | WIN |
| 2026-04-28 | NBA | SPREAD | away | 5 | 2 | -105 | 4.39 | 0 | 0 | 0 | LOSS |
| 2026-04-28 | MLB | TOTAL | under | 3.5 | 0.5 | +102 | 0.60 | 1 | 0 | 1 | LOSS |
| 2026-04-28 | MLB | TOTAL | under | 3.5 | 0.5 | -114 | 0.34 | 0 | 0 | 0 | LOSS |
| 2026-04-28 | NBA | TOTAL | under | 5 | 2 | -108 | 2.51 | 1 | 0 | 1 | LOSS |
| 2026-04-28 | NBA | TOTAL | under | 2.5 | 0.5 | -106 | 0.67 | 0 | 0 | 0 | WIN |
| 2026-04-28 | NBA | TOTAL | over | 3 | 0.5 | -108 | 2.08 | 1 | 0 | 1 | LOSS |
| 2026-04-28 | NHL | TOTAL | over | 3 | 0 | -102 | -1.04 | 0 | 0 | 0 | LOSS |
| 2026-04-29 | MLB | ML | home | 2.5 | 0.5 | -125 | 0.61 | 0 | 0 | 0 | LOSS |
| 2026-04-29 | MLB | ML | home | 2.5 | 0.5 | -124 | 1.02 | 0 | 0 | 0 | WIN |
| 2026-04-29 | MLB | ML | home | 3.5 | 0.5 | -108 | 1.86 | 0 | 0 | 0 | LOSS |
| 2026-04-29 | MLB | ML | away | 2.5 | 0.5 | +130 | 0.92 | 1 | 0 | 1 | WIN |
| 2026-04-29 | MLB | ML | away | 2.5 | 0.5 | -144 | 1.98 | 0 | 0 | 0 | LOSS |
| 2026-04-29 | MLB | ML | home | 3 | 0.5 | -115 | 2.44 | 0 | 0 | 0 | WIN |
| 2026-04-29 | MLB | ML | away | 2.5 | 0.5 | -130 | -2.10 | 0 | 0 | 0 | WIN |
| 2026-04-29 | MLB | ML | away | 2.75 | 0.5 | +114 | -2.59 | 0 | 0 | 0 | WIN |
| 2026-04-29 | MLB | ML | home | 2.5 | 0.5 | -115 | -1.99 | 0 | 0 | 0 | WIN |
| 2026-04-29 | MLB | ML | home | 2.5 | 0.5 | -162 | 0.70 | 0 | 0 | 0 | LOSS |
| 2026-04-29 | NBA | ML | away | 5 | 2 | +154 | 2.46 | 3 | 2 | 1 | WIN |
| 2026-04-29 | NBA | ML | away | 5 | 0.5 | +320 | 0.43 | 1 | 0 | 1 | LOSS |
| 2026-04-29 | NBA | ML | home | 5 | 3 | -355 | 1.77 | 1 | 0 | 1 | WIN |
| 2026-04-29 | NHL | ML | away | 5 | 2 | +145 | 0.39 | 0 | 1 | -1 | WIN |
| 2026-04-29 | NHL | ML | away | 2.5 | 0.5 | +102 | -2.11 | 0 | 0 | 0 | LOSS |
| 2026-04-29 | NBA | SPREAD | home | 3.5 | 0.5 | -105 | 2.28 | 0 | 0 | 0 | LOSS |
| 2026-04-29 | NBA | SPREAD | away | 3.5 | 0.5 | -115 | 0.89 | 0 | 0 | 0 | WIN |
| 2026-04-29 | NBA | SPREAD | home | 2.5 | 0.5 | -102 | 1.59 | 1 | 1 | 0 | LOSS |
| 2026-04-29 | MLB | TOTAL | under | 3.5 | 0.5 | -117 | 1.75 | 2 | 0 | 2 | LOSS |
| 2026-04-29 | NBA | TOTAL | over | 2.5 | 0.5 | -103 | 0.92 | 1 | 0 | 1 | LOSS |
| 2026-04-29 | NBA | TOTAL | under | 3.5 | 0.5 | -104 | 2.46 | 2 | 0 | 2 | LOSS |
| 2026-04-29 | NBA | TOTAL | over | 5 | 2 | -112 | 5.49 | 5 | 0 | 5 | WIN |
| 2026-04-29 | NHL | TOTAL | under | 2.5 | 0.5 | -117 | 0.45 | 0 | 0 | 0 | WIN |
| 2026-04-30 | MLB | ML | away | 2.5 | 0.5 | -130 | -1.92 | 1 | 0 | 1 | LOSS |
| 2026-04-30 | NBA | ML | home | 4 | 1.5 | +198 | 3.38 | 3 | 2 | 1 | WIN |
| 2026-04-30 | NBA | ML | away | 3 | 0.5 | -250 | 6.64 | 3 | 1 | 2 | LOSS |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.5 | +110 | 1.34 | 1 | 1 | 0 | LOSS |
| 2026-04-30 | NHL | ML | away | 2.5 | 0.75 | -130 | 3.52 | 1 | 1 | 0 | LOSS |
| 2026-04-30 | NBA | SPREAD | home | 2.75 | 0.5 | -110 | 0.00 | 0 | 0 | 0 | WIN |
| 2026-04-30 | NBA | SPREAD | away | 2.5 | 0.75 | -104 | 5.13 | 3 | 1 | 2 | LOSS |
| 2026-04-30 | MLB | TOTAL | under | 2.5 | 0.5 | -115 | -2.11 | 0 | 0 | 0 | WIN |
| 2026-04-30 | NBA | TOTAL | under | 4 | 1.13 | -106 | 3.38 | 2 | 0 | 2 | WIN |
| 2026-04-30 | NBA | TOTAL | over | 2.5 | 0.5 | -109 | -1.93 | 1 | 0 | 1 | WIN |
| 2026-04-30 | NHL | TOTAL | under | 2.5 | 0.5 | +103 | 1.02 | 0 | 0 | 0 | LOSS |
| 2026-05-01 | MLB | ML | away | 3.5 | 0 | +129 | 2.26 | 0 | 0 | 0 | LOSS |
| 2026-05-01 | MLB | ML | away | 2.5 | 0 | -184 | -2.11 | 0 | 0 | 0 | WIN |
| 2026-05-01 | MLB | ML | home | 2.5 | 0.5 | -135 | 0.17 | 0 | 0 | 0 | WIN |
| 2026-05-01 | MLB | ML | away | 3.5 | 0 | -110 | 0.51 | 0 | 0 | 0 | WIN |
| 2026-05-01 | MLB | ML | home | 3 | 0.5 | -145 | 2.06 | 0 | 0 | 0 | LOSS |
| 2026-05-01 | MLB | ML | away | 3 | 0.5 | -175 | 2.06 | 0 | 0 | 0 | LOSS |
| 2026-05-01 | MLB | ML | away | 2.75 | 0.5 | -154 | -3.17 | 0 | 0 | 0 | WIN |
| 2026-05-01 | MLB | ML | home | 2.5 | 0.5 | -102 | 0.87 | 1 | 0 | 1 | LOSS |
| 2026-05-01 | MLB | ML | home | 2.5 | 0.5 | -104 | 0.12 | 0 | 0 | 0 | LOSS |
| 2026-05-01 | NBA | ML | home | 5 | 3 | -180 | 5.60 | 4 | 4 | 0 | LOSS |
| 2026-05-01 | NHL | ML | away | 3 | 0.5 | -122 | 3.87 | 0 | 0 | 0 | WIN |
| 2026-05-01 | NHL | ML | away | 4 | 0.5 | -114 | 2.72 | 0 | 0 | 0 | WIN |
| 2026-05-01 | NHL | ML | home | 3 | 0.5 | -105 | 3.37 | 1 | 0 | 1 | LOSS |
| 2026-05-01 | NBA | SPREAD | away | 2.5 | 0.5 | -115 | 0.64 | 0 | 0 | 0 | LOSS |
| 2026-05-01 | NBA | SPREAD | home | 5 | 2 | -108 | 4.67 | 2 | 1 | 1 | LOSS |
| 2026-05-01 | MLB | TOTAL | under | 2.5 | 0.5 | -108 | -2.11 | 0 | 0 | 0 | LOSS |
| 2026-05-01 | MLB | TOTAL | under | 2.5 | 0.5 | +102 | -2.01 | 0 | 0 | 0 | LOSS |
| 2026-05-01 | MLB | TOTAL | under | 3.5 | 0 | -108 | 0.91 | 1 | 0 | 1 | LOSS |
| 2026-05-01 | NBA | TOTAL | under | 2.75 | 0.5 | +100 | -2.63 | 0 | 0 | 0 | LOSS |
| 2026-05-01 | NBA | TOTAL | under | 3.5 | 0.5 | +100 | 1.00 | 0 | 0 | 0 | WIN |
| 2026-05-01 | NBA | TOTAL | under | 2.5 | 0.5 | -110 | -2.09 | 0 | 0 | 0 | WIN |
| 2026-05-02 | MLB | ML | away | 4.5 | 3 | +140 | 4.19 | 2 | 0 | 2 | LOSS |
| 2026-05-02 | MLB | ML | away | 2.5 | 0.5 | -219 | 1.66 | 1 | 0 | 1 | WIN |
| 2026-05-02 | MLB | ML | away | 2.5 | 0.5 | +145 | 2.03 | 1 | 1 | 0 | LOSS |
| 2026-05-02 | MLB | ML | home | 2.5 | 0.5 | -134 | -0.03 | 0 | 0 | 0 | WIN |
| 2026-05-02 | MLB | ML | home | 2.5 | 0.5 | -184 | 0.13 | 1 | 1 | 0 | LOSS |
| 2026-05-02 | MLB | ML | away | 2.5 | 0.5 | -136 | 0.63 | 0 | 0 | 0 | LOSS |
| 2026-05-02 | MLB | ML | home | 2.5 | 0.5 | +109 | 0.94 | 0 | 0 | 0 | WIN |
| 2026-05-02 | MLB | ML | home | 3 | 0.5 | -130 | -0.05 | 1 | 0 | 1 | WIN |
| 2026-05-02 | MLB | ML | home | 2.5 | 0.5 | -102 | 0.55 | 0 | 0 | 0 | WIN |
| 2026-05-02 | MLB | ML | away | 3.5 | 0.5 | +115 | 2.32 | 0 | 0 | 0 | LOSS |
| 2026-05-02 | MLB | ML | away | 3 | 0.5 | -134 | 2.08 | 0 | 0 | 0 | WIN |
| 2026-05-02 | NBA | ML | away | 5 | 3 | +210 | 8.01 | 5 | 2 | 3 | WIN |
| 2026-05-02 | NHL | ML | away | 4.5 | 0.5 | +205 | 2.01 | 0 | 0 | 0 | LOSS |
| 2026-05-02 | NHL | SPREAD | home | 3.5 | 0.5 | +112 | 0.57 | 0 | 0 | 0 | WIN |
| 2026-05-02 | NBA | TOTAL | over | 4 | 1.13 | -109 | 2.07 | 1 | 1 | 0 | WIN |
| 2026-05-02 | NHL | TOTAL | over | 3.5 | 0.5 | -101 | 1.44 | 1 | 0 | 1 | LOSS |
| 2026-05-03 | MLB | ML | away | 3.5 | 0.5 | +250 | 1.30 | 0 | 0 | 0 | LOSS |
| 2026-05-03 | MLB | ML | home | 2.5 | 0.5 | -120 | -2.18 | 0 | 0 | 0 | WIN |
| 2026-05-03 | MLB | ML | home | 2.5 | 0 | +109 | 0.55 | 1 | 0 | 1 | WIN |
| 2026-05-03 | MLB | ML | home | 2.5 | 0 | -162 | 0.12 | 0 | 0 | 0 | WIN |
| 2026-05-03 | MLB | ML | home | 2.5 | 0.5 | +120 | -2.11 | 0 | 0 | 0 | LOSS |
| 2026-05-03 | MLB | ML | away | 2.75 | 0.75 | -130 | -2.11 | 1 | 0 | 1 | WIN |
| 2026-05-03 | MLB | ML | away | 2.5 | 0.5 | -140 | 0.01 | 0 | 0 | 0 | WIN |
| 2026-05-03 | NBA | ML | away | 4 | 0.75 | +310 | 3.43 | 2 | 0 | 2 | LOSS |
| 2026-05-03 | NBA | ML | away | 4 | 0.75 | +260 | 2.41 | 2 | 0 | 2 | LOSS |
| 2026-05-03 | NHL | ML | away | 2.5 | 0.5 | +140 | 0.61 | 1 | 0 | 1 | WIN |
| 2026-05-03 | NBA | SPREAD | home | 2.5 | 0.75 | -105 | -1.69 | 1 | 0 | 1 | WIN |
| 2026-05-03 | NBA | SPREAD | home | 2.75 | 0.75 | -104 | -2.11 | 1 | 1 | 0 | WIN |
| 2026-05-03 | MLB | TOTAL | under | 2.5 | 0 | +100 | -1.71 | 1 | 0 | 1 | LOSS |
| 2026-05-03 | MLB | TOTAL | over | 2.5 | 0 | -104 | -1.98 | 0 | 0 | 0 | LOSS |
| 2026-05-03 | MLB | TOTAL | over | 2.5 | 0 | -113 | 0.25 | 0 | 0 | 0 | LOSS |
| 2026-05-03 | NBA | TOTAL | under | 2.25 | 0.75 | -113 | -2.33 | 1 | 0 | 1 | LOSS |
| 2026-05-03 | NBA | TOTAL | over | 2.5 | 0 | -107 | 0.47 | 0 | 0 | 0 | WIN |
| 2026-05-04 | MLB | ML | away | 2.5 | 0.5 | +185 | -1.46 | 1 | 0 | 1 | LOSS |
| 2026-05-04 | MLB | ML | home | 3.5 | 1.13 | -199 | -2.68 | 1 | 0 | 1 | LOSS |
| 2026-05-04 | MLB | ML | away | 2.5 | 0.5 | +104 | -1.87 | 0 | 0 | 0 | LOSS |
| 2026-05-04 | MLB | ML | home | 2.5 | 0 | +170 | -1.72 | 1 | 0 | 1 | LOSS |
| 2026-05-04 | MLB | ML | home | 2.5 | 0 | +110 | -2.23 | 0 | 0 | 0 | WIN |
| 2026-05-04 | MLB | ML | home | 2.5 | 0.5 | +122 | -2.09 | 0 | 0 | 0 | LOSS |
| 2026-05-04 | MLB | ML | away | 2.5 | 0.5 | -110 | -1.83 | 1 | 0 | 1 | WIN |
| 2026-05-04 | MLB | ML | home | 2.5 | 0.5 | +116 | -1.79 | 1 | 0 | 1 | WIN |
| 2026-05-04 | MLB | ML | away | 2.5 | 0 | +104 | -1.98 | 0 | 0 | 0 | LOSS |
| 2026-05-04 | NBA | ML | home | 5 | 3.5 | -600 | 2.01 | 2 | 0 | 2 | LOSS |
| 2026-05-04 | NBA | ML | away | 5 | 0.5 | +245 | 3.55 | 1 | 0 | 1 | LOSS |
| 2026-05-04 | NHL | ML | home | 3.5 | 1.13 | -165 | -2.19 | 1 | 0 | 1 | WIN |
| 2026-05-04 | NBA | SPREAD | away | 5 | 3.5 | -105 | 5.37 | 2 | 0 | 2 | WIN |
| 2026-05-04 | NBA | SPREAD | away | 4 | 1.13 | -110 | 1.43 | 1 | 0 | 1 | LOSS |
| 2026-05-04 | NBA | TOTAL | under | 5 | 3.5 | -102 | 2.81 | 1 | 0 | 1 | WIN |
| 2026-05-04 | NBA | TOTAL | under | 5 | 2 | -102 | 3.68 | 0 | 0 | 0 | LOSS |
| 2026-05-05 | MLB | ML | home | 2.5 | 0.5 | -155 | -2.01 | 0 | 0 | 0 | LOSS |
| 2026-05-05 | MLB | ML | home | 2.5 | 0.5 | -188 | -2.26 | 0 | 0 | 0 | WIN |
| 2026-05-05 | MLB | ML | home | 2.5 | 0.5 | -125 | -2.19 | 0 | 0 | 0 | WIN |
| 2026-05-05 | NBA | ML | away | 5 | 4.5 | +132 | 4.78 | 2 | 1 | 1 | LOSS |
| 2026-05-05 | NBA | ML | away | 4 | 0.5 | +660 | 2.94 | 2 | 1 | 1 | LOSS |
| 2026-05-05 | NBA | SPREAD | away | 3.5 | 0.75 | -115 | 1.68 | 2 | 0 | 2 | LOSS |
| 2026-05-05 | NBA | SPREAD | away | 2.5 | 0.5 | -105 | -1.91 | 1 | 0 | 1 | LOSS |
| 2026-05-05 | NBA | TOTAL | under | 4 | 0.75 | -113 | 0.43 | 0 | 0 | 0 | WIN |

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| meanConv_F | +0.102 | +0.131 |
| sumSize_delta | +0.095 | +0.118 |
| sumSize_F | +0.029 | +0.081 |
| countDelta | +0.100 | +0.077 |
| maxRoiN_F | +0.065 | +0.062 |
| againstSide | +0.032 | +0.058 |
| walletCountAgainst | +0.059 | +0.053 |
| topShare | +0.130 | +0.044 |
| concPenalty | +0.127 | +0.042 |
| breadthBonus | +0.011 | +0.036 |
| walletCountFor | +0.011 | +0.036 |
| meanBase_delta | +0.001 | -0.034 |
| sumRoiN_A | -0.000 | +0.032 |
| meanBase_F | -0.010 | -0.030 |
| sumRoiN_F | -0.083 | -0.028 |
| walletPlayScore | -0.093 | -0.025 |
| netEdge | -0.056 | -0.025 |
| sumContrib_delta | -0.042 | -0.023 |
| sumInvest_delta | -0.088 | -0.018 |
| forSide | -0.080 | -0.014 |
| sumRoiN_delta | -0.011 | -0.014 |
| sumContrib_F | -0.080 | -0.014 |
| maxRoiN_delta | +0.076 | +0.013 |
| sumInvest_F | -0.064 | +0.011 |
| meanConv_delta | +0.061 | +0.001 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.226 | +0.163 |
| sizeRatio≥1 (roi any) | +0.148 | +0.139 |
| invested≥$5k | +0.129 | +0.138 |
| convictionMult≥1 | +0.144 | +0.132 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.194 | +0.131 |
| roiNorm≥60 & sizeRatio≥1 | +0.162 | +0.121 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.166 | +0.120 |
| roiNorm≥50 & sizeRatio≥1 | +0.126 | +0.111 |
| contribution≥60 | +0.150 | +0.105 |
| walletBase≥50 & sizeRatio≥1 | +0.121 | +0.104 |
| walletBase≥60 & sizeRatio≥1 | +0.189 | +0.103 |
| contribution≥50 | +0.081 | +0.070 |
| rankNorm≥60 | +0.017 | +0.032 |
| roiNorm≥50 (size any) | +0.031 | +0.012 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 182 | 46.7% | -9.4% | -11.2% |
| 1 qFor | 80 | 45.0% | -12.5% | -10.4% |
| 2 qFor | 19 | 47.4% | +0.0% | +8.7% |
| 3+ qFor | 4 | 75.0% | +56.5% | +98.7% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 84 | 44.0% | -16.7% | -26.3% |
| 1 qFor | 120 | 50.0% | -4.8% | +2.6% |
| 2 qFor | 39 | 38.5% | -26.9% | -23.5% |
| 3+ qFor | 42 | 50.0% | +12.8% | +7.9% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 30 | 33.3% | -39.3% | -32.0% |
| 1 qFor | 139 | 48.2% | -8.4% | -4.8% |
| 2 qFor | 62 | 50.0% | -4.3% | -9.7% |
| 3+ qFor | 54 | 46.3% | +2.2% | +0.3% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 87 | 44.8% | -15.1% | -27.6% |
| 1 qFor | 117 | 49.6% | -5.7% | +3.9% |
| 2 qFor | 39 | 38.5% | -26.9% | -23.5% |
| 3+ qFor | 42 | 50.0% | +12.8% | +7.9% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 163 | 47.9% | -6.9% | -10.2% |
| 1 qFor | 86 | 44.2% | -14.7% | -10.7% |
| 2 qFor | 25 | 36.0% | -21.8% | -19.6% |
| 3+ qFor | 11 | 72.7% | +39.8% | +70.0% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 147 | 49.7% | -3.7% | -3.2% |
| 1 qFor | 95 | 42.1% | -19.4% | -17.4% |
| 2 qFor | 29 | 37.9% | -15.1% | -14.1% |
| 3+ qFor | 14 | 64.3% | +23.7% | +41.9% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 151 | 47.7% | -9.4% | -12.6% |
| 1 qFor | 90 | 47.8% | -4.7% | +0.7% |
| 2 qFor | 27 | 29.6% | -35.8% | -32.9% |
| 3+ qFor | 17 | 58.8% | +18.4% | +35.9% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 132 | 48.5% | -9.0% | -8.2% |
| 1 qFor | 101 | 48.5% | -3.0% | +1.9% |
| 2 qFor | 29 | 27.6% | -40.2% | -43.8% |
| 3+ qFor | 23 | 52.2% | +7.0% | +22.2% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 95 | 47.4% | -9.9% | -11.7% |
| 1 qFor | 116 | 49.1% | -4.6% | +2.4% |
| 2 qFor | 36 | 41.7% | -18.4% | -17.9% |
| 3+ qFor | 38 | 42.1% | -9.5% | -3.4% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 121 | 50.4% | -4.0% | -3.7% |
| 1 qFor | 107 | 44.9% | -14.2% | -3.0% |
| 2 qFor | 30 | 36.7% | -21.5% | -35.1% |
| 3+ qFor | 27 | 48.1% | +5.8% | +11.0% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 164 | 48.2% | -4.6% | -7.2% |
| 1 qFor | 93 | 45.2% | -15.8% | -4.4% |
| 2 qFor | 22 | 36.4% | -28.3% | -38.8% |
| 3+ qFor | 6 | 66.7% | +58.1% | +105.3% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 40 | 50.0% | -5.4% | -17.5% |
| 1 qFor | 124 | 49.2% | -5.0% | +6.4% |
| 2 qFor | 67 | 38.8% | -22.8% | -27.2% |
| 3+ qFor | 54 | 48.1% | -2.3% | +2.5% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 41 | 58.5% | +9.5% | +24.5% |
| 1 qFor | 118 | 41.5% | -22.0% | -25.3% |
| 2 qFor | 87 | 50.6% | -0.0% | +6.0% |
| 3+ qFor | 39 | 41.0% | -7.1% | -4.4% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 18 | 44.4% | -16.5% | -29.5% |
| 1 qFor | 103 | 53.4% | +1.4% | +11.6% |
| 2 qFor | 93 | 46.2% | -6.6% | -5.6% |
| 3+ qFor | 71 | 38.0% | -24.3% | -16.5% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| sizeRatio≥1 (roi any) | +0.201 | +0.140 |
| convictionMult≥1 | +0.197 | +0.132 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.203 | +0.124 |
| roiNorm≥70 & sizeRatio≥1 | +0.214 | +0.120 |
| invested≥$5k | +0.139 | +0.118 |
| roiNorm≥60 & sizeRatio≥1 | +0.175 | +0.108 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.174 | +0.088 |
| roiNorm≥50 & sizeRatio≥1 | +0.142 | +0.079 |
| walletBase≥50 & sizeRatio≥1 | +0.146 | +0.076 |
| walletBase≥60 & sizeRatio≥1 | +0.176 | +0.065 |
| contribution≥60 | +0.145 | +0.054 |
| contribution≥50 | +0.105 | +0.048 |
| roiNorm≥50 (size any) | +0.087 | +0.039 |
| rankNorm≥60 | +0.022 | +0.030 |

### Per-definition bucket tables


#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 113 | 44.2% | -11.3% | -7.3% |
| margin +1 | 122 | 48.4% | -7.5% | -9.5% |
| margin +2 | 22 | 40.9% | -23.1% | -14.5% |
| margin ≥+3 | 28 | 53.6% | +7.4% | +11.4% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 116 | 44.8% | -10.2% | -8.8% |
| margin +1 | 119 | 47.9% | -8.4% | -8.6% |
| margin +2 | 22 | 40.9% | -23.1% | -14.5% |
| margin ≥+3 | 28 | 53.6% | +7.4% | +11.4% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 184 | 47.3% | -7.2% | -10.8% |
| margin +1 | 75 | 44.0% | -13.9% | -9.5% |
| margin +2 | 22 | 45.5% | -10.1% | +8.7% |
| margin ≥+3 | 4 | 75.0% | +26.7% | +52.1% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 198 | 47.0% | -7.3% | -7.9% |
| margin +1 | 71 | 43.7% | -17.1% | -11.3% |
| margin +2 | 12 | 50.0% | -3.9% | -10.2% |
| margin ≥+3 | 4 | 75.0% | +56.5% | +98.7% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 74 | 44.6% | -15.3% | +1.6% |
| margin +1 | 135 | 45.9% | -10.0% | -15.1% |
| margin +2 | 46 | 50.0% | +2.6% | -9.0% |
| margin ≥+3 | 30 | 50.0% | -4.2% | +6.5% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 171 | 48.5% | -5.0% | -4.3% |
| margin +1 | 87 | 41.4% | -18.9% | -21.2% |
| margin +2 | 19 | 47.4% | -10.3% | +7.6% |
| margin ≥+3 | 8 | 62.5% | +26.4% | +42.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 173 | 48.6% | -4.7% | -6.3% |
| margin +1 | 83 | 44.6% | -12.8% | -9.9% |
| margin +2 | 21 | 33.3% | -33.0% | -10.6% |
| margin ≥+3 | 8 | 62.5% | +9.9% | +43.0% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 157 | 49.0% | -4.5% | -3.5% |
| margin +1 | 95 | 45.3% | -10.6% | -11.0% |
| margin +2 | 22 | 27.3% | -48.5% | -31.5% |
| margin ≥+3 | 11 | 63.6% | +25.8% | +55.5% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 149 | 50.3% | -0.3% | +5.2% |
| margin +1 | 100 | 42.0% | -20.0% | -20.6% |
| margin +2 | 22 | 31.8% | -37.9% | -25.2% |
| margin ≥+3 | 14 | 64.3% | +27.8% | +29.7% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 185 | 49.2% | -2.4% | +0.5% |
| margin +1 | 82 | 41.5% | -22.3% | -20.7% |
| margin +2 | 14 | 35.7% | -36.8% | -27.7% |
| margin ≥+3 | 4 | 75.0% | +73.6% | +119.2% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 123 | 50.4% | +1.5% | +4.8% |
| margin +1 | 113 | 45.1% | -14.3% | -11.0% |
| margin +2 | 29 | 37.9% | -28.5% | -21.6% |
| margin ≥+3 | 20 | 45.0% | -11.6% | -0.6% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 76 | 48.7% | +1.4% | -1.9% |
| margin +1 | 126 | 50.0% | -3.8% | -1.2% |
| margin +2 | 52 | 34.6% | -37.0% | -28.4% |
| margin ≥+3 | 31 | 48.4% | -6.1% | +5.6% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 67 | 52.2% | +4.4% | +15.0% |
| margin +1 | 104 | 46.2% | -11.9% | -13.4% |
| margin +2 | 70 | 48.6% | -1.9% | -2.5% |
| margin ≥+3 | 44 | 36.4% | -32.3% | -16.6% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 89 | 49.4% | -7.4% | -9.8% |
| margin +1 | 110 | 43.6% | -11.8% | -9.3% |
| margin +2 | 63 | 47.6% | -8.7% | -5.3% |
| margin ≥+3 | 23 | 47.8% | +0.4% | +6.3% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=285 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| regime=CLEAR_MOVE | 71 | 57.7% | +7.8% | +15.5% |
| walletPlayScore≥3 | 59 | 47.5% | -0.2% | -3.9% |
| qFor(roi60+size1.25)≥2 | 36 | 47.2% | -3.0% | +11.2% |
| sumInvested_F≥$10k | 232 | 47.8% | -5.6% | -5.5% |
| stars≥3.5 | 141 | 46.8% | -6.2% | -0.9% |
| qFor(roi50+size1)≥1 | 153 | 45.1% | -8.5% | -4.8% |
| concPenalty≤2.5 | 199 | 45.7% | -8.9% | -7.1% |
| walletCountAgainst=0 | 116 | 48.3% | -9.1% | -17.1% |
| maxRoiN_F≥70 | 185 | 46.5% | -9.2% | -4.3% |
| stars≥3 | 178 | 45.5% | -9.5% | -3.9% |
| walletPlayScore≥2 | 101 | 43.6% | -10.0% | -9.7% |
| qMargin(roi60+size1.25)≥1 | 101 | 45.5% | -11.5% | -0.7% |
| topShare≤0.5 | 128 | 43.8% | -12.0% | -7.3% |
| walletCountFor≥3 | 140 | 43.6% | -12.3% | -5.1% |
| netEdge≥1 | 150 | 44.0% | -13.0% | -12.0% |
| qMargin(roi50+size1)≥1 | 128 | 43.8% | -14.0% | -7.9% |
| meanBase_F≥55 | 186 | 43.0% | -17.5% | -12.9% |
| qFor(roi50+size1)≥2 | 52 | 38.5% | -19.3% | -12.8% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 25 | 56.0% | +19.8% | +23.2% |
| qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE | 9 | 66.7% | +17.1% | +28.5% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 29 | 55.2% | +16.3% | +18.7% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 32 | 62.5% | +16.1% | +5.4% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 24 | 62.5% | +13.5% | +30.2% |
| qFor(roi60+size1.25)≥2 ∧ walletCountAgainst=0 | 5 | 60.0% | +13.3% | +16.7% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 | 30 | 53.3% | +12.5% | +17.6% |
| regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 55 | 60.0% | +11.1% | +15.8% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥3 | 30 | 50.0% | +7.5% | +7.5% |
| regime=CLEAR_MOVE ∧ meanBase_F≥55 | 51 | 56.9% | +6.5% | +10.0% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 | 33 | 51.5% | +5.8% | +15.6% |
| qFor(roi60+size1.25)≥2 ∧ topShare≤0.5 | 33 | 51.5% | +5.8% | +15.6% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3 | 33 | 51.5% | +5.8% | +15.6% |
| walletPlayScore≥3 ∧ stars≥3.5 | 54 | 50.0% | +5.7% | -1.8% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 | 32 | 50.0% | +5.4% | +14.0% |
| qFor(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 39 | 56.4% | +4.9% | +16.6% |
| stars≥3.5 ∧ regime=CLEAR_MOVE | 43 | 55.8% | +3.5% | +16.2% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 37 | 51.4% | +3.4% | +11.8% |
| walletPlayScore≥3 ∧ stars≥3 | 57 | 49.1% | +3.3% | -2.4% |
| qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 40 | 50.0% | +3.1% | +8.2% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 | 34 | 50.0% | +2.7% | +21.1% |
| qFor(roi60+size1.25)≥2 ∧ maxRoiN_F≥70 | 34 | 50.0% | +2.7% | +14.1% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 | 49 | 46.9% | +2.6% | -0.6% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 | 15 | 53.3% | +2.1% | -6.3% |
| qMargin(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 31 | 54.8% | +1.9% | +19.1% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +31.7% | +53.4% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +31.7% | +53.4% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 23 | 60.9% | +30.2% | +37.2% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ stars≥3.5 | 23 | 60.9% | +30.2% | +26.5% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ meanBase_F≥55 | 18 | 61.1% | +26.6% | +28.3% |
| qMargin(roi60+size1.25)≥1 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 14 | 71.4% | +26.4% | +55.4% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 ∧ regime=CLEAR_MOVE | 7 | 71.4% | +25.5% | +48.3% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 21 | 66.7% | +25.1% | +6.7% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ stars≥3.5 | 27 | 59.3% | +24.9% | +30.3% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ stars≥3 | 24 | 58.3% | +24.8% | +25.2% |
| qMargin(roi60+size1.25)≥1 ∧ walletCountFor≥3 ∧ regime=CLEAR_MOVE | 16 | 68.8% | +24.7% | +51.8% |
| qFor(roi60+size1.25)≥2 ∧ walletCountAgainst=0 ∧ meanBase_F≥55 | 3 | 66.7% | +24.1% | +39.2% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 22 | 68.2% | +23.8% | +31.7% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ maxRoiN_F≥70 | 22 | 68.2% | +23.8% | +35.5% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 22 | 59.1% | +22.6% | +31.4% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥2 | 28 | 57.1% | +20.5% | +29.0% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 ∧ stars≥3.5 | 28 | 57.1% | +20.5% | +20.4% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ stars≥3.5 | 28 | 57.1% | +20.5% | +20.4% |
| qFor(roi60+size1.25)≥2 ∧ topShare≤0.5 ∧ stars≥3.5 | 28 | 57.1% | +20.5% | +20.4% |
| qFor(roi50+size1)≥1 ∧ qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 25 | 56.0% | +19.8% | +23.2% |
| qFor(roi50+size1)≥2 ∧ qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 25 | 56.0% | +19.8% | +23.2% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 ∧ walletPlayScore≥3 | 25 | 56.0% | +19.8% | +23.2% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ walletPlayScore≥3 | 25 | 56.0% | +19.8% | +23.2% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ netEdge≥1 | 25 | 56.0% | +19.8% | +23.2% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ topShare≤0.5 | 25 | 56.0% | +19.8% | +23.2% |