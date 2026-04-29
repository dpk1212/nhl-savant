# V8 Goldilocks Deep Dive

_Generated 2026-04-29T14:37:34.913Z_

## 0. Sample & Baseline

- Picks in sample: **173** (LOCKED=136, SHADOW=37)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **46.8%** · flat ROI **-7.9%** · units-wtd ROI **-8.4%**


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

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| maxRoiN_F | +0.219 | +0.172 |
| sumSize_delta | +0.142 | +0.158 |
| countDelta | +0.177 | +0.155 |
| breadthBonus | +0.127 | +0.118 |
| walletCountFor | +0.127 | +0.118 |
| sumSize_F | +0.088 | +0.101 |
| meanConv_F | +0.102 | +0.100 |
| sumRoiN_F | +0.071 | +0.083 |
| sumContrib_F | +0.056 | +0.073 |
| forSide | +0.056 | +0.073 |
| sumRoiN_delta | +0.100 | +0.072 |
| meanConv_delta | -0.053 | -0.072 |
| walletPlayScore | +0.039 | +0.067 |
| againstSide | +0.069 | +0.065 |
| netEdge | +0.065 | +0.065 |
| meanBase_delta | -0.052 | -0.060 |
| meanBase_F | +0.121 | +0.058 |
| sumContrib_delta | +0.063 | +0.055 |
| sumInvest_F | -0.006 | +0.046 |
| walletCountAgainst | +0.088 | +0.045 |
| sumInvest_delta | -0.009 | +0.044 |
| topShare | +0.016 | -0.035 |
| sumRoiN_A | +0.017 | +0.027 |
| concPenalty | +0.022 | -0.019 |
| maxRoiN_delta | +0.059 | +0.012 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.283 | +0.187 |
| invested≥$5k | +0.173 | +0.157 |
| contribution≥60 | +0.266 | +0.150 |
| contribution≥50 | +0.199 | +0.147 |
| roiNorm≥60 & sizeRatio≥1 | +0.206 | +0.134 |
| sizeRatio≥1 (roi any) | +0.190 | +0.134 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.224 | +0.132 |
| roiNorm≥50 & sizeRatio≥1 | +0.171 | +0.129 |
| convictionMult≥1 | +0.180 | +0.122 |
| walletBase≥50 & sizeRatio≥1 | +0.180 | +0.120 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.193 | +0.119 |
| roiNorm≥50 (size any) | +0.175 | +0.098 |
| walletBase≥60 & sizeRatio≥1 | +0.214 | +0.083 |
| rankNorm≥60 | +0.108 | +0.082 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 107 | 44.9% | -10.6% | -12.7% |
| 1 qFor | 52 | 48.1% | -6.1% | -7.0% |
| 2 qFor | 12 | 58.3% | +12.3% | +10.3% |
| 3+ qFor | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 5 | 0.0% | -100.0% | -100.0% |
| 1 qFor | 82 | 47.6% | -9.4% | -8.8% |
| 2 qFor | 44 | 47.7% | -10.7% | -12.8% |
| 3+ qFor | 42 | 50.0% | +8.8% | +0.5% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 50 | 36.0% | -29.4% | -25.4% |
| 1 qFor | 71 | 53.5% | +5.0% | +2.5% |
| 2 qFor | 28 | 50.0% | -1.9% | -4.2% |
| 3+ qFor | 24 | 45.8% | -8.6% | -12.6% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 23 | 26.1% | -47.9% | -67.8% |
| 1 qFor | 63 | 52.4% | +1.3% | +10.8% |
| 2 qFor | 51 | 43.1% | -11.5% | -25.1% |
| 3+ qFor | 36 | 55.6% | +6.6% | +6.8% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 86 | 47.7% | -4.6% | -5.4% |
| 1 qFor | 58 | 44.8% | -14.3% | -16.4% |
| 2 qFor | 17 | 41.2% | -10.5% | -13.1% |
| 3+ qFor | 12 | 58.3% | +2.7% | +14.7% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 40 | 40.0% | -21.2% | -33.6% |
| 1 qFor | 78 | 51.3% | -2.7% | +3.3% |
| 2 qFor | 23 | 39.1% | -26.4% | -26.6% |
| 3+ qFor | 32 | 50.0% | +9.2% | -2.1% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 96 | 45.8% | -8.1% | -13.8% |
| 1 qFor | 53 | 47.2% | -9.4% | -8.7% |
| 2 qFor | 15 | 40.0% | -15.5% | -19.3% |
| 3+ qFor | 9 | 66.7% | +15.3% | +40.0% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 74 | 44.6% | -16.0% | -12.7% |
| 1 qFor | 66 | 51.5% | +5.4% | +0.9% |
| 2 qFor | 17 | 35.3% | -20.9% | -31.7% |
| 3+ qFor | 16 | 50.0% | -11.9% | -2.8% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 43 | 41.9% | -17.7% | -34.9% |
| 1 qFor | 75 | 50.7% | -4.0% | +5.1% |
| 2 qFor | 23 | 39.1% | -26.4% | -26.6% |
| 3+ qFor | 32 | 50.0% | +9.2% | -2.1% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 64 | 46.9% | -8.9% | -10.4% |
| 1 qFor | 68 | 47.1% | -9.8% | -1.3% |
| 2 qFor | 22 | 45.5% | -1.8% | -28.8% |
| 3+ qFor | 19 | 47.4% | -5.0% | -1.5% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 87 | 44.8% | -14.0% | -17.2% |
| 1 qFor | 60 | 50.0% | +2.3% | +2.0% |
| 2 qFor | 15 | 33.3% | -27.3% | -34.6% |
| 3+ qFor | 11 | 63.6% | +10.5% | +20.8% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 8 | 12.5% | -70.6% | -100.0% |
| 1 qFor | 52 | 50.0% | -5.5% | +1.3% |
| 2 qFor | 67 | 49.3% | +2.1% | -0.6% |
| 3+ qFor | 46 | 45.7% | -14.4% | -18.5% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 95 | 47.4% | -2.0% | -4.2% |
| 1 qFor | 59 | 47.5% | -12.9% | -6.3% |
| 2 qFor | 16 | 43.8% | -20.1% | -30.7% |
| 3+ qFor | 3 | 33.3% | -34.9% | +4.1% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 13 | 61.5% | +18.2% | +43.6% |
| 1 qFor | 74 | 40.5% | -24.7% | -30.3% |
| 2 qFor | 59 | 52.5% | +4.3% | +6.5% |
| 3+ qFor | 27 | 44.4% | -1.3% | -8.9% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.230 | +0.129 |
| sizeRatio≥1 (roi any) | +0.217 | +0.128 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.213 | +0.126 |
| invested≥$5k | +0.140 | +0.121 |
| convictionMult≥1 | +0.207 | +0.116 |
| contribution≥50 | +0.200 | +0.115 |
| roiNorm≥60 & sizeRatio≥1 | +0.182 | +0.106 |
| roiNorm≥50 (size any) | +0.177 | +0.090 |
| contribution≥60 | +0.240 | +0.088 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.174 | +0.071 |
| walletBase≥50 & sizeRatio≥1 | +0.164 | +0.068 |
| roiNorm≥50 & sizeRatio≥1 | +0.138 | +0.057 |
| rankNorm≥60 | +0.071 | +0.055 |
| walletBase≥60 & sizeRatio≥1 | +0.159 | +0.033 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 115 | 46.1% | -7.1% | -8.8% |
| margin +1 | 47 | 44.7% | -15.7% | -14.0% |
| margin +2 | 9 | 66.7% | +28.1% | +22.5% |
| margin ≥+3 | 2 | 50.0% | -36.7% | +8.6% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 59 | 42.4% | -10.6% | -8.7% |
| margin +1 | 79 | 49.4% | -6.1% | -10.8% |
| margin +2 | 13 | 38.5% | -29.0% | -17.5% |
| margin ≥+3 | 22 | 54.5% | +5.1% | +3.6% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 110 | 44.5% | -11.2% | -17.3% |
| margin +1 | 45 | 51.1% | +1.5% | -0.2% |
| margin +2 | 15 | 46.7% | -14.7% | -1.5% |
| margin ≥+3 | 3 | 66.7% | +5.9% | +38.5% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 34 | 47.1% | -12.5% | +5.7% |
| margin +1 | 82 | 43.9% | -12.2% | -20.5% |
| margin +2 | 34 | 50.0% | +5.0% | -6.1% |
| margin ≥+3 | 23 | 52.2% | -5.2% | +1.4% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 62 | 43.5% | -8.6% | -10.9% |
| margin +1 | 76 | 48.7% | -7.5% | -9.5% |
| margin +2 | 13 | 38.5% | -29.0% | -17.5% |
| margin ≥+3 | 22 | 54.5% | +5.1% | +3.6% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 43 | 37.2% | -16.7% | -14.5% |
| margin +1 | 72 | 51.4% | +0.5% | -4.6% |
| margin +2 | 37 | 43.2% | -22.0% | -22.7% |
| margin ≥+3 | 21 | 57.1% | +5.5% | +9.9% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 100 | 47.0% | -6.6% | -7.9% |
| margin +1 | 53 | 45.3% | -10.2% | -16.0% |
| margin +2 | 14 | 50.0% | -6.1% | +11.0% |
| margin ≥+3 | 6 | 50.0% | -14.7% | -6.1% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 41 | 46.3% | -2.1% | +21.9% |
| margin +1 | 60 | 41.7% | -18.6% | -27.2% |
| margin +2 | 46 | 54.3% | +7.3% | -3.3% |
| margin ≥+3 | 26 | 46.2% | -19.6% | -14.4% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 68 | 45.6% | -2.4% | +3.3% |
| margin +1 | 72 | 45.8% | -14.6% | -19.3% |
| margin +2 | 19 | 57.9% | +9.1% | +3.5% |
| margin ≥+3 | 14 | 42.9% | -23.3% | -17.2% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 105 | 45.7% | -8.2% | -12.6% |
| margin +1 | 52 | 48.1% | -6.0% | -7.2% |
| margin +2 | 10 | 40.0% | -29.2% | -15.2% |
| margin ≥+3 | 6 | 66.7% | +15.0% | +44.6% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 82 | 50.0% | +2.7% | +5.9% |
| margin +1 | 64 | 42.2% | -21.2% | -23.9% |
| margin +2 | 17 | 35.3% | -31.1% | -27.0% |
| margin ≥+3 | 10 | 70.0% | +29.0% | +24.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 91 | 48.4% | -3.1% | -1.4% |
| margin +1 | 62 | 45.2% | -11.6% | -17.4% |
| margin +2 | 11 | 36.4% | -32.4% | -24.4% |
| margin ≥+3 | 9 | 55.6% | -1.8% | +19.5% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 47 | 44.7% | -15.3% | -12.3% |
| margin +1 | 68 | 45.6% | -7.2% | -8.3% |
| margin +2 | 41 | 51.2% | -1.6% | -3.3% |
| margin ≥+3 | 17 | 47.1% | -5.5% | -8.8% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 107 | 49.5% | +0.8% | +3.8% |
| margin +1 | 52 | 42.3% | -21.8% | -23.1% |
| margin +2 | 12 | 41.7% | -26.3% | -23.2% |
| margin ≥+3 | 2 | 50.0% | -2.4% | +42.0% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=173 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletPlayScore≥3 | 42 | 52.4% | +7.6% | -2.1% |
| maxRoiN_F≥70 | 115 | 52.2% | +1.0% | -3.5% |
| qFor(roi50+size1)≥1 | 99 | 48.5% | -1.9% | -6.1% |
| regime=CLEAR_MOVE | 45 | 55.6% | -2.1% | +2.0% |
| qMargin(roi60+size1.25)≥1 | 63 | 50.8% | -2.2% | +1.7% |
| walletPlayScore≥2 | 67 | 47.8% | -2.5% | -12.2% |
| stars≥3.5 | 100 | 49.0% | -3.1% | -2.5% |
| topShare≤0.5 | 89 | 48.3% | -3.7% | -8.0% |
| netEdge≥1 | 98 | 49.0% | -3.7% | -12.8% |
| qFor(roi60+size1.25)≥2 | 24 | 50.0% | -3.9% | +5.1% |
| walletCountFor≥3 | 99 | 47.5% | -4.6% | -4.7% |
| sumInvested_F≥$10k | 165 | 48.5% | -4.8% | -6.1% |
| concPenalty≤2.5 | 135 | 48.1% | -5.0% | -9.7% |
| stars≥3 | 129 | 46.5% | -8.1% | -6.2% |
| meanBase_F≥55 | 104 | 48.1% | -9.6% | -11.7% |
| qMargin(roi50+size1)≥1 | 82 | 45.1% | -13.3% | -14.0% |
| walletCountAgainst=0 | 57 | 45.6% | -14.1% | -23.8% |
| qFor(roi50+size1)≥2 | 33 | 42.4% | -16.5% | -16.3% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 17 | 70.6% | +19.1% | +15.6% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 | 19 | 57.9% | +15.1% | +12.6% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 19 | 57.9% | +15.1% | +12.6% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥3 | 18 | 55.6% | +13.2% | +10.5% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 16 | 56.3% | +13.0% | +15.6% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 | 34 | 52.9% | +13.0% | +0.5% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 26 | 57.7% | +12.9% | +13.3% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 | 36 | 55.6% | +9.4% | +6.0% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 | 20 | 55.0% | +9.3% | +9.4% |
| qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 27 | 55.6% | +8.8% | +6.1% |
| qMargin(roi60+size1.25)≥1 ∧ maxRoiN_F≥70 | 55 | 56.4% | +8.7% | +6.6% |
| walletCountFor≥3 ∧ walletPlayScore≥3 | 42 | 52.4% | +7.6% | -2.1% |
| walletPlayScore≥2 ∧ walletPlayScore≥3 | 42 | 52.4% | +7.6% | -2.1% |
| walletPlayScore≥3 ∧ netEdge≥1 | 42 | 52.4% | +7.6% | -2.1% |
| walletPlayScore≥3 ∧ topShare≤0.5 | 42 | 52.4% | +7.6% | -2.1% |
| walletPlayScore≥3 ∧ concPenalty≤2.5 | 42 | 52.4% | +7.6% | -2.1% |
| walletPlayScore≥3 ∧ stars≥3 | 42 | 52.4% | +7.6% | -2.1% |
| walletPlayScore≥3 ∧ stars≥3.5 | 42 | 52.4% | +7.6% | -2.1% |
| walletPlayScore≥3 ∧ sumInvested_F≥$10k | 42 | 52.4% | +7.6% | -2.1% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 | 9 | 55.6% | +6.7% | -6.1% |
| qFor(roi50+size1)≥2 ∧ regime=CLEAR_MOVE | 7 | 71.4% | +6.3% | -1.9% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 | 22 | 54.5% | +4.8% | +9.5% |
| qFor(roi60+size1.25)≥2 ∧ topShare≤0.5 | 22 | 54.5% | +4.8% | +9.5% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3 | 22 | 54.5% | +4.8% | +9.5% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi50+size1)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 16 | 62.5% | +27.4% | +30.1% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 16 | 75.0% | +26.6% | +17.4% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ maxRoiN_F≥70 | 16 | 75.0% | +26.6% | +17.4% |
| qMargin(roi60+size1.25)≥1 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 10 | 80.0% | +26.2% | +35.4% |
| qMargin(roi60+size1.25)≥1 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 12 | 75.0% | +25.9% | +17.5% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +25.0% | +23.3% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +25.0% | +23.3% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +25.0% | +23.3% |
| qFor(roi50+size1)≥1 ∧ qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi50+size1)≥2 ∧ qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi50+size1)≥2 ∧ walletCountFor≥3 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi50+size1)≥2 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 6 | 83.3% | +24.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE ∧ maxRoiN_F≥70 | 6 | 83.3% | +24.0% | +23.1% |
| qMargin(roi60+size1.25)≥1 ∧ walletCountFor≥3 ∧ regime=CLEAR_MOVE | 12 | 75.0% | +23.9% | +33.8% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ meanBase_F≥55 | 12 | 66.7% | +22.5% | +31.3% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 ∧ meanBase_F≥55 | 12 | 66.7% | +22.5% | +31.3% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥2 | 18 | 61.1% | +21.5% | +19.0% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ stars≥3.5 | 18 | 61.1% | +21.5% | +19.0% |