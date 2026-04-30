# V8 Goldilocks Deep Dive

_Generated 2026-04-30T14:33:38.615Z_

## 0. Sample & Baseline

- Picks in sample: **196** (LOCKED=146, SHADOW=50)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **47.4%** · flat ROI **-6.7%** · units-wtd ROI **-4.5%**


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

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| sumSize_delta | +0.128 | +0.143 |
| maxRoiN_F | +0.185 | +0.142 |
| meanConv_F | +0.123 | +0.137 |
| countDelta | +0.165 | +0.125 |
| sumSize_F | +0.089 | +0.116 |
| breadthBonus | +0.108 | +0.102 |
| walletCountFor | +0.108 | +0.102 |
| againstSide | +0.068 | +0.081 |
| sumRoiN_F | +0.045 | +0.062 |
| walletCountAgainst | +0.083 | +0.060 |
| sumContrib_F | +0.027 | +0.057 |
| forSide | +0.027 | +0.056 |
| meanBase_delta | -0.030 | -0.055 |
| sumInvest_F | -0.010 | +0.055 |
| meanConv_delta | -0.019 | -0.055 |
| walletPlayScore | +0.021 | +0.050 |
| sumRoiN_delta | +0.087 | +0.046 |
| sumInvest_delta | -0.027 | +0.041 |
| meanBase_F | +0.098 | +0.039 |
| sumRoiN_A | +0.009 | +0.039 |
| netEdge | +0.038 | +0.031 |
| topShare | +0.028 | -0.025 |
| sumContrib_delta | +0.040 | +0.023 |
| concPenalty | +0.027 | -0.018 |
| maxRoiN_delta | +0.068 | -0.001 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.270 | +0.183 |
| contribution≥60 | +0.253 | +0.159 |
| sizeRatio≥1 (roi any) | +0.197 | +0.158 |
| invested≥$5k | +0.164 | +0.154 |
| convictionMult≥1 | +0.189 | +0.148 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.231 | +0.143 |
| roiNorm≥60 & sizeRatio≥1 | +0.208 | +0.142 |
| contribution≥50 | +0.181 | +0.139 |
| roiNorm≥50 & sizeRatio≥1 | +0.173 | +0.139 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.203 | +0.135 |
| walletBase≥50 & sizeRatio≥1 | +0.180 | +0.134 |
| roiNorm≥50 (size any) | +0.179 | +0.100 |
| walletBase≥60 & sizeRatio≥1 | +0.210 | +0.095 |
| rankNorm≥60 | +0.076 | +0.066 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 125 | 46.4% | -8.1% | -8.2% |
| 1 qFor | 55 | 45.5% | -11.2% | -8.7% |
| 2 qFor | 13 | 61.5% | +23.2% | +27.6% |
| 3+ qFor | 3 | 66.7% | +5.3% | +37.9% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 61 | 39.3% | -23.1% | -17.1% |
| 1 qFor | 80 | 52.5% | +2.7% | +2.2% |
| 2 qFor | 29 | 48.3% | -5.3% | -5.3% |
| 3+ qFor | 26 | 50.0% | +1.4% | -0.9% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 50 | 40.0% | -22.2% | -32.6% |
| 1 qFor | 87 | 52.9% | +0.8% | +7.6% |
| 2 qFor | 25 | 36.0% | -32.3% | -29.0% |
| 3+ qFor | 34 | 52.9% | +15.8% | +6.6% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 12 | 25.0% | -55.4% | -38.1% |
| 1 qFor | 94 | 47.9% | -8.3% | -5.6% |
| 2 qFor | 45 | 48.9% | -8.5% | -11.8% |
| 3+ qFor | 45 | 51.1% | +11.4% | +6.7% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 53 | 41.5% | -19.3% | -33.9% |
| 1 qFor | 84 | 52.4% | -0.2% | +9.3% |
| 2 qFor | 25 | 36.0% | -32.3% | -29.0% |
| 3+ qFor | 34 | 52.9% | +15.8% | +6.6% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 111 | 46.8% | -6.5% | -9.9% |
| 1 qFor | 60 | 46.7% | -9.8% | -4.8% |
| 2 qFor | 15 | 40.0% | -15.5% | -19.3% |
| 3+ qFor | 10 | 70.0% | +22.7% | +45.7% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 100 | 49.0% | -2.3% | -1.3% |
| 1 qFor | 65 | 43.1% | -18.0% | -16.4% |
| 2 qFor | 18 | 44.4% | -1.3% | +0.8% |
| 3+ qFor | 13 | 61.5% | +9.4% | +20.9% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 27 | 33.3% | -32.8% | -39.4% |
| 1 qFor | 76 | 51.3% | -0.6% | +8.8% |
| 2 qFor | 55 | 41.8% | -15.6% | -24.4% |
| 3+ qFor | 38 | 57.9% | +12.6% | +14.0% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 88 | 46.6% | -11.6% | -7.4% |
| 1 qFor | 71 | 50.7% | +3.0% | +0.9% |
| 2 qFor | 19 | 31.6% | -29.2% | -34.4% |
| 3+ qFor | 18 | 55.6% | +2.9% | +12.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 102 | 46.1% | -11.3% | -12.8% |
| 1 qFor | 64 | 50.0% | +1.5% | +2.5% |
| 2 qFor | 18 | 33.3% | -25.3% | -22.9% |
| 3+ qFor | 12 | 66.7% | +17.0% | +27.2% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 77 | 48.1% | -6.8% | -5.1% |
| 1 qFor | 74 | 47.3% | -9.4% | -0.5% |
| 2 qFor | 24 | 41.7% | -10.0% | -30.9% |
| 3+ qFor | 21 | 52.4% | +7.1% | +11.2% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 9 | 22.2% | -50.1% | -68.1% |
| 1 qFor | 61 | 49.2% | -6.5% | +4.3% |
| 2 qFor | 75 | 50.7% | +3.5% | +1.0% |
| 3+ qFor | 51 | 45.1% | -14.1% | -13.1% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 111 | 48.6% | -0.7% | -0.3% |
| 1 qFor | 63 | 46.0% | -15.0% | -7.2% |
| 2 qFor | 17 | 41.2% | -24.8% | -32.0% |
| 3+ qFor | 5 | 60.0% | +27.7% | +64.8% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 19 | 63.2% | +21.9% | +41.1% |
| 1 qFor | 82 | 41.5% | -23.4% | -25.5% |
| 2 qFor | 67 | 50.7% | +1.1% | +7.7% |
| 3+ qFor | 28 | 46.4% | +4.2% | -1.5% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| sizeRatio≥1 (roi any) | +0.210 | +0.125 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.214 | +0.122 |
| convictionMult≥1 | +0.203 | +0.114 |
| invested≥$5k | +0.139 | +0.111 |
| roiNorm≥70 & sizeRatio≥1 | +0.214 | +0.109 |
| roiNorm≥60 & sizeRatio≥1 | +0.179 | +0.098 |
| roiNorm≥50 (size any) | +0.194 | +0.095 |
| contribution≥50 | +0.177 | +0.093 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.187 | +0.082 |
| contribution≥60 | +0.218 | +0.075 |
| roiNorm≥50 & sizeRatio≥1 | +0.141 | +0.060 |
| walletBase≥50 & sizeRatio≥1 | +0.151 | +0.055 |
| rankNorm≥60 | +0.041 | +0.030 |
| walletBase≥60 & sizeRatio≥1 | +0.152 | +0.026 |

### Per-definition bucket tables


#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 72 | 43.1% | -9.6% | -0.2% |
| margin +1 | 87 | 50.6% | -4.0% | -8.5% |
| margin +2 | 14 | 35.7% | -34.1% | -19.2% |
| margin ≥+3 | 23 | 56.5% | +8.8% | +8.0% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 126 | 46.0% | -8.1% | -10.9% |
| margin +1 | 51 | 49.0% | -3.4% | -1.0% |
| margin +2 | 15 | 46.7% | -14.7% | -1.5% |
| margin ≥+3 | 4 | 75.0% | +26.7% | +52.1% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 75 | 44.0% | -8.0% | -2.5% |
| margin +1 | 84 | 50.0% | -5.2% | -7.3% |
| margin +2 | 14 | 35.7% | -34.1% | -19.2% |
| margin ≥+3 | 23 | 56.5% | +8.8% | +8.0% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 43 | 46.5% | -12.7% | +10.0% |
| margin +1 | 93 | 45.2% | -9.6% | -15.6% |
| margin +2 | 35 | 51.4% | +7.3% | -5.0% |
| margin ≥+3 | 25 | 52.0% | -5.2% | +4.3% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 135 | 47.4% | -4.7% | -3.1% |
| margin +1 | 49 | 42.9% | -19.2% | -15.2% |
| margin +2 | 9 | 66.7% | +28.1% | +22.5% |
| margin ≥+3 | 3 | 66.7% | +5.3% | +37.9% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 116 | 48.3% | -3.8% | -1.8% |
| margin +1 | 59 | 44.1% | -13.3% | -15.5% |
| margin +2 | 14 | 50.0% | -6.1% | +11.0% |
| margin ≥+3 | 7 | 57.1% | +0.2% | +7.3% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 45 | 46.7% | -0.6% | +26.2% |
| margin +1 | 68 | 42.6% | -18.2% | -24.5% |
| margin +2 | 55 | 54.5% | +8.7% | +1.6% |
| margin ≥+3 | 28 | 46.4% | -18.6% | -10.8% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 49 | 40.8% | -9.1% | +0.9% |
| margin +1 | 86 | 51.2% | -0.7% | -3.7% |
| margin +2 | 39 | 41.0% | -26.0% | -24.1% |
| margin ≥+3 | 22 | 59.1% | +9.3% | +13.7% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 121 | 47.1% | -5.3% | -6.4% |
| margin +1 | 56 | 48.2% | -6.3% | -6.0% |
| margin +2 | 12 | 33.3% | -41.0% | -18.9% |
| margin ≥+3 | 7 | 71.4% | +25.6% | +52.3% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 82 | 46.3% | -1.8% | +9.2% |
| margin +1 | 79 | 46.8% | -12.6% | -16.8% |
| margin +2 | 20 | 55.0% | +3.6% | +1.9% |
| margin ≥+3 | 15 | 46.7% | -15.8% | -9.5% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 106 | 49.1% | -2.1% | +1.3% |
| margin +1 | 67 | 46.3% | -9.0% | -11.4% |
| margin +2 | 13 | 30.8% | -42.8% | -27.4% |
| margin ≥+3 | 10 | 60.0% | +7.3% | +27.8% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 97 | 50.5% | +3.4% | +11.3% |
| margin +1 | 70 | 42.9% | -19.8% | -21.7% |
| margin +2 | 18 | 33.3% | -34.9% | -28.3% |
| margin ≥+3 | 11 | 72.7% | +34.5% | +30.1% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 56 | 48.2% | -7.8% | -6.4% |
| margin +1 | 74 | 45.9% | -7.2% | -3.9% |
| margin +2 | 49 | 49.0% | -5.1% | -0.3% |
| margin ≥+3 | 17 | 47.1% | -5.5% | -8.8% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 125 | 50.4% | +1.9% | +8.5% |
| margin +1 | 55 | 41.8% | -22.2% | -23.2% |
| margin +2 | 13 | 38.5% | -32.0% | -25.0% |
| margin ≥+3 | 3 | 66.7% | +28.2% | +61.9% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=196 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletPlayScore≥3 | 43 | 53.5% | +9.5% | +0.5% |
| regime=CLEAR_MOVE | 50 | 56.0% | +1.6% | +9.8% |
| qFor(roi60+size1.25)≥2 | 25 | 52.0% | -0.2% | +9.4% |
| walletPlayScore≥2 | 72 | 48.6% | -0.5% | -7.7% |
| maxRoiN_F≥70 | 127 | 51.2% | -1.1% | -1.4% |
| qFor(roi50+size1)≥1 | 108 | 48.1% | -2.7% | -2.9% |
| sumInvested_F≥$10k | 174 | 49.4% | -2.7% | -3.3% |
| stars≥3.5 | 110 | 49.1% | -2.8% | +1.7% |
| qMargin(roi60+size1.25)≥1 | 70 | 50.0% | -4.1% | +2.8% |
| concPenalty≤2.5 | 153 | 48.4% | -4.5% | -5.2% |
| topShare≤0.5 | 99 | 47.5% | -5.7% | -5.0% |
| netEdge≥1 | 110 | 48.2% | -5.9% | -11.5% |
| walletCountFor≥3 | 109 | 46.8% | -6.4% | -2.2% |
| stars≥3 | 140 | 47.1% | -6.9% | -2.0% |
| walletCountAgainst=0 | 69 | 47.8% | -9.7% | -20.8% |
| meanBase_F≥55 | 121 | 47.1% | -11.0% | -11.1% |
| qMargin(roi50+size1)≥1 | 90 | 45.6% | -12.1% | -9.2% |
| qFor(roi50+size1)≥2 | 37 | 43.2% | -13.6% | -8.2% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi50+size1)≥2 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +24.7% | +16.7% |
| qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE | 6 | 83.3% | +24.0% | +23.1% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 17 | 70.6% | +19.1% | +15.6% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 | 20 | 60.0% | +18.8% | +16.8% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 20 | 60.0% | +18.8% | +16.8% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 17 | 58.8% | +17.5% | +20.6% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥3 | 19 | 57.9% | +17.2% | +15.1% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 27 | 59.3% | +15.8% | +16.5% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 | 35 | 54.3% | +15.2% | +3.5% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 | 21 | 57.1% | +13.1% | +13.7% |
| qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 28 | 57.1% | +11.6% | +9.5% |
| walletCountFor≥3 ∧ walletPlayScore≥3 | 43 | 53.5% | +9.5% | +0.5% |
| walletPlayScore≥2 ∧ walletPlayScore≥3 | 43 | 53.5% | +9.5% | +0.5% |
| walletPlayScore≥3 ∧ netEdge≥1 | 43 | 53.5% | +9.5% | +0.5% |
| walletPlayScore≥3 ∧ topShare≤0.5 | 43 | 53.5% | +9.5% | +0.5% |
| walletPlayScore≥3 ∧ concPenalty≤2.5 | 43 | 53.5% | +9.5% | +0.5% |
| walletPlayScore≥3 ∧ stars≥3 | 43 | 53.5% | +9.5% | +0.5% |
| walletPlayScore≥3 ∧ stars≥3.5 | 43 | 53.5% | +9.5% | +0.5% |
| walletPlayScore≥3 ∧ sumInvested_F≥$10k | 43 | 53.5% | +9.5% | +0.5% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 | 38 | 55.3% | +8.6% | +7.8% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 | 23 | 56.5% | +8.5% | +13.7% |
| qFor(roi60+size1.25)≥2 ∧ topShare≤0.5 | 23 | 56.5% | +8.5% | +13.7% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3 | 23 | 56.5% | +8.5% | +13.7% |
| qFor(roi60+size1.25)≥2 ∧ maxRoiN_F≥70 | 23 | 56.5% | +8.5% | +13.7% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 | 23 | 56.5% | +8.5% | +18.0% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi50+size1)≥2 ∧ walletCountFor≥3 ∧ regime=CLEAR_MOVE | 7 | 85.7% | +42.6% | +42.2% |
| qFor(roi50+size1)≥2 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 7 | 85.7% | +42.6% | +42.2% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 17 | 64.7% | +31.0% | +34.2% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ meanBase_F≥55 | 13 | 69.2% | +27.6% | +36.0% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 ∧ meanBase_F≥55 | 13 | 69.2% | +27.6% | +36.0% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 16 | 75.0% | +26.6% | +17.4% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ maxRoiN_F≥70 | 16 | 75.0% | +26.6% | +17.4% |
| qMargin(roi60+size1.25)≥1 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 10 | 80.0% | +26.2% | +35.4% |
| qMargin(roi60+size1.25)≥1 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 12 | 75.0% | +25.9% | +17.5% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 7 | 71.4% | +25.6% | +16.7% |
| qFor(roi50+size1)≥2 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 7 | 71.4% | +25.6% | +16.7% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥2 | 19 | 63.2% | +25.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ stars≥3.5 | 19 | 63.2% | +25.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 | 19 | 63.2% | +25.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ stars≥3.5 | 19 | 63.2% | +25.0% | +23.1% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +25.0% | +23.3% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +25.0% | +23.3% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 5 | 80.0% | +25.0% | +23.3% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 16 | 62.5% | +24.8% | +28.6% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 16 | 62.5% | +24.8% | +28.6% |
| qFor(roi50+size1)≥1 ∧ qFor(roi50+size1)≥2 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +24.7% | +16.7% |
| qFor(roi50+size1)≥2 ∧ qMargin(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +24.7% | +16.7% |
| qFor(roi50+size1)≥2 ∧ concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +24.7% | +16.7% |
| qFor(roi50+size1)≥2 ∧ stars≥3 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +24.7% | +16.7% |
| qFor(roi50+size1)≥2 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 8 | 75.0% | +24.7% | +16.7% |