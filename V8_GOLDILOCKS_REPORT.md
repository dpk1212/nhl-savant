# V8 Goldilocks Deep Dive

_Generated 2026-05-04T14:38:53.938Z_

## 0. Sample & Baseline

- Picks in sample: **261** (LOCKED=169, SHADOW=92)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **47.5%** · flat ROI **-6.8%** · units-wtd ROI **-4.0%**


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

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| meanConv_F | +0.128 | +0.157 |
| sumSize_delta | +0.109 | +0.129 |
| sumSize_F | +0.044 | +0.094 |
| maxRoiN_F | +0.096 | +0.084 |
| againstSide | +0.056 | +0.078 |
| walletCountAgainst | +0.075 | +0.063 |
| countDelta | +0.080 | +0.062 |
| meanBase_delta | -0.018 | -0.046 |
| sumRoiN_A | +0.016 | +0.044 |
| topShare | +0.128 | +0.043 |
| concPenalty | +0.118 | +0.035 |
| sumInvest_F | -0.037 | +0.035 |
| breadthBonus | +0.009 | +0.033 |
| walletCountFor | +0.009 | +0.033 |
| sumContrib_delta | -0.051 | -0.031 |
| netEdge | -0.062 | -0.031 |
| walletPlayScore | -0.095 | -0.026 |
| sumRoiN_F | -0.078 | -0.025 |
| sumRoiN_delta | -0.015 | -0.019 |
| meanConv_delta | +0.049 | -0.011 |
| forSide | -0.075 | -0.010 |
| sumContrib_F | -0.074 | -0.009 |
| sumInvest_delta | -0.060 | +0.008 |
| maxRoiN_delta | +0.063 | +0.003 |
| meanBase_F | +0.031 | -0.002 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.232 | +0.168 |
| sizeRatio≥1 (roi any) | +0.156 | +0.146 |
| invested≥$5k | +0.138 | +0.145 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.207 | +0.142 |
| convictionMult≥1 | +0.152 | +0.138 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.174 | +0.130 |
| roiNorm≥60 & sizeRatio≥1 | +0.173 | +0.128 |
| roiNorm≥50 & sizeRatio≥1 | +0.132 | +0.119 |
| contribution≥60 | +0.167 | +0.119 |
| walletBase≥50 & sizeRatio≥1 | +0.129 | +0.109 |
| walletBase≥60 & sizeRatio≥1 | +0.197 | +0.104 |
| contribution≥50 | +0.104 | +0.088 |
| rankNorm≥60 | +0.016 | +0.031 |
| roiNorm≥50 (size any) | +0.052 | +0.024 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 167 | 47.3% | -8.0% | -9.4% |
| 1 qFor | 73 | 45.2% | -12.1% | -10.2% |
| 2 qFor | 17 | 52.9% | +11.8% | +14.8% |
| 3+ qFor | 4 | 75.0% | +56.5% | +98.7% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 77 | 42.9% | -18.6% | -28.5% |
| 1 qFor | 109 | 52.3% | -0.4% | +7.2% |
| 2 qFor | 34 | 38.2% | -27.7% | -33.5% |
| 3+ qFor | 41 | 51.2% | +15.6% | +13.5% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 28 | 32.1% | -41.7% | -35.7% |
| 1 qFor | 123 | 48.8% | -7.1% | -5.0% |
| 2 qFor | 59 | 50.8% | -2.7% | -9.4% |
| 3+ qFor | 51 | 49.0% | +8.2% | +7.3% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 151 | 47.7% | -6.8% | -9.6% |
| 1 qFor | 78 | 46.2% | -11.0% | -8.9% |
| 2 qFor | 21 | 38.1% | -16.2% | -17.6% |
| 3+ qFor | 11 | 72.7% | +39.8% | +70.0% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 80 | 43.8% | -16.8% | -29.7% |
| 1 qFor | 106 | 51.9% | -1.3% | +8.8% |
| 2 qFor | 34 | 38.2% | -27.7% | -33.5% |
| 3+ qFor | 41 | 51.2% | +15.6% | +13.5% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 140 | 47.9% | -9.0% | -11.4% |
| 1 qFor | 82 | 48.8% | -2.1% | -0.7% |
| 2 qFor | 22 | 31.8% | -30.1% | -27.3% |
| 3+ qFor | 17 | 58.8% | +18.4% | +35.9% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 137 | 49.6% | -3.2% | -1.9% |
| 1 qFor | 85 | 43.5% | -17.0% | -16.6% |
| 2 qFor | 25 | 40.0% | -9.3% | -10.9% |
| 3+ qFor | 14 | 64.3% | +23.7% | +41.9% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 123 | 48.8% | -8.3% | -6.3% |
| 1 qFor | 91 | 49.5% | -0.7% | +0.6% |
| 2 qFor | 24 | 29.2% | -35.9% | -42.8% |
| 3+ qFor | 23 | 52.2% | +7.0% | +22.2% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 89 | 46.1% | -11.7% | -12.0% |
| 1 qFor | 105 | 50.5% | -2.1% | +1.4% |
| 2 qFor | 34 | 44.1% | -13.6% | -14.9% |
| 3+ qFor | 33 | 45.5% | -1.7% | +6.0% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 112 | 50.0% | -4.2% | -3.8% |
| 1 qFor | 97 | 46.4% | -11.6% | -2.6% |
| 2 qFor | 26 | 38.5% | -16.9% | -37.3% |
| 3+ qFor | 26 | 50.0% | +9.9% | +19.1% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 152 | 48.7% | -2.9% | -4.7% |
| 1 qFor | 84 | 45.2% | -16.3% | -7.9% |
| 2 qFor | 19 | 42.1% | -17.0% | -27.4% |
| 3+ qFor | 6 | 66.7% | +58.1% | +105.3% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 36 | 44.4% | -14.4% | -24.8% |
| 1 qFor | 112 | 50.9% | -1.9% | +5.3% |
| 2 qFor | 64 | 40.6% | -19.2% | -23.3% |
| 3+ qFor | 49 | 51.0% | +3.7% | +9.9% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 34 | 58.8% | +11.9% | +31.0% |
| 1 qFor | 110 | 42.7% | -20.2% | -24.1% |
| 2 qFor | 85 | 50.6% | +0.1% | +6.2% |
| 3+ qFor | 32 | 43.8% | +0.9% | +2.2% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 14 | 35.7% | -31.5% | -42.0% |
| 1 qFor | 91 | 54.9% | +4.3% | +9.1% |
| 2 qFor | 90 | 47.8% | -3.5% | -1.6% |
| 3+ qFor | 66 | 39.4% | -21.5% | -12.9% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| sizeRatio≥1 (roi any) | +0.201 | +0.136 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.213 | +0.133 |
| convictionMult≥1 | +0.197 | +0.128 |
| roiNorm≥70 & sizeRatio≥1 | +0.212 | +0.117 |
| invested≥$5k | +0.136 | +0.115 |
| roiNorm≥60 & sizeRatio≥1 | +0.181 | +0.110 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.179 | +0.094 |
| roiNorm≥50 & sizeRatio≥1 | +0.142 | +0.079 |
| walletBase≥50 & sizeRatio≥1 | +0.141 | +0.067 |
| walletBase≥60 & sizeRatio≥1 | +0.176 | +0.060 |
| contribution≥60 | +0.154 | +0.058 |
| contribution≥50 | +0.109 | +0.048 |
| roiNorm≥50 (size any) | +0.092 | +0.040 |
| rankNorm≥60 | +0.007 | +0.016 |

### Per-definition bucket tables


#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 104 | 44.2% | -10.6% | -6.8% |
| margin +1 | 110 | 50.0% | -4.4% | -6.2% |
| margin +2 | 20 | 40.0% | -25.2% | -25.0% |
| margin ≥+3 | 27 | 55.6% | +11.4% | +20.1% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 172 | 47.1% | -7.2% | -10.4% |
| margin +1 | 66 | 47.0% | -8.1% | -6.5% |
| margin +2 | 19 | 47.4% | -6.1% | +17.1% |
| margin ≥+3 | 4 | 75.0% | +26.7% | +52.1% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 107 | 44.9% | -9.5% | -8.3% |
| margin +1 | 107 | 49.5% | -5.3% | -5.0% |
| margin +2 | 20 | 40.0% | -25.2% | -25.0% |
| margin ≥+3 | 27 | 55.6% | +11.4% | +20.1% |

#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 182 | 47.8% | -5.3% | -3.4% |
| margin +1 | 64 | 43.8% | -17.2% | -15.7% |
| margin +2 | 11 | 54.5% | +4.8% | -6.0% |
| margin ≥+3 | 4 | 75.0% | +56.5% | +98.7% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 69 | 44.9% | -14.7% | +3.7% |
| margin +1 | 119 | 47.1% | -7.3% | -12.6% |
| margin +2 | 44 | 50.0% | +2.9% | -15.0% |
| margin ≥+3 | 29 | 51.7% | -0.9% | +16.2% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 161 | 48.4% | -4.7% | -3.4% |
| margin +1 | 75 | 44.0% | -14.0% | -16.0% |
| margin +2 | 17 | 47.1% | -11.2% | -0.5% |
| margin ≥+3 | 8 | 62.5% | +26.4% | +42.6% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 162 | 48.8% | -4.1% | -5.0% |
| margin +1 | 74 | 45.9% | -9.6% | -11.8% |
| margin +2 | 17 | 35.3% | -28.7% | +3.9% |
| margin ≥+3 | 8 | 62.5% | +9.9% | +43.0% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 148 | 49.3% | -3.6% | -1.9% |
| margin +1 | 83 | 47.0% | -6.9% | -8.7% |
| margin +2 | 19 | 26.3% | -50.6% | -36.3% |
| margin ≥+3 | 11 | 63.6% | +25.8% | +55.5% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 138 | 50.7% | +1.2% | +6.6% |
| margin +1 | 90 | 43.3% | -17.9% | -18.7% |
| margin +2 | 20 | 30.0% | -41.4% | -36.8% |
| margin ≥+3 | 13 | 69.2% | +37.7% | +46.3% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 173 | 49.7% | -0.8% | +3.1% |
| margin +1 | 71 | 42.3% | -21.6% | -22.6% |
| margin +2 | 13 | 38.5% | -32.0% | -25.0% |
| margin ≥+3 | 4 | 75.0% | +73.6% | +119.2% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 117 | 49.6% | +0.7% | +5.3% |
| margin +1 | 101 | 46.5% | -12.0% | -12.8% |
| margin +2 | 25 | 44.0% | -17.1% | -6.6% |
| margin ≥+3 | 18 | 44.4% | -12.6% | -0.3% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 70 | 47.1% | +0.0% | +3.5% |
| margin +1 | 114 | 51.8% | -0.6% | -3.7% |
| margin +2 | 49 | 36.7% | -33.2% | -23.8% |
| margin ≥+3 | 28 | 50.0% | -3.0% | +9.7% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 61 | 52.5% | +5.8% | +26.4% |
| margin +1 | 93 | 46.2% | -11.7% | -19.8% |
| margin +2 | 67 | 50.7% | +2.5% | +2.8% |
| margin ≥+3 | 40 | 37.5% | -30.4% | -15.5% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 81 | 49.4% | -6.7% | -5.6% |
| margin +1 | 100 | 46.0% | -7.2% | -6.3% |
| margin +2 | 61 | 47.5% | -8.8% | -5.7% |
| margin ≥+3 | 19 | 47.4% | +0.8% | +7.9% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=261 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletPlayScore≥3 | 55 | 49.1% | +3.5% | -0.2% |
| qFor(roi60+size1.25)≥2 | 32 | 50.0% | +3.0% | +18.1% |
| regime=CLEAR_MOVE | 62 | 54.8% | +2.7% | +10.6% |
| sumInvested_F≥$10k | 214 | 49.5% | -2.2% | -2.5% |
| stars≥3.5 | 129 | 48.1% | -3.3% | +2.3% |
| qFor(roi50+size1)≥1 | 138 | 46.4% | -5.5% | -2.8% |
| maxRoiN_F≥70 | 170 | 48.2% | -5.7% | -1.7% |
| qMargin(roi60+size1.25)≥1 | 89 | 48.3% | -6.1% | +3.7% |
| concPenalty≤2.5 | 190 | 46.8% | -6.6% | -4.9% |
| walletPlayScore≥2 | 94 | 44.7% | -7.4% | -7.8% |
| stars≥3 | 166 | 46.4% | -7.5% | -1.5% |
| walletCountAgainst=0 | 99 | 48.5% | -8.6% | -20.6% |
| topShare≤0.5 | 121 | 44.6% | -10.2% | -5.5% |
| walletCountFor≥3 | 133 | 44.4% | -10.7% | -3.2% |
| netEdge≥1 | 140 | 45.0% | -11.0% | -11.8% |
| qMargin(roi50+size1)≥1 | 113 | 45.1% | -11.1% | -5.9% |
| meanBase_F≥55 | 168 | 44.6% | -14.5% | -11.0% |
| qFor(roi50+size1)≥2 | 47 | 40.4% | -14.9% | -7.0% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 23 | 56.5% | +21.7% | +30.9% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 | 27 | 55.6% | +17.7% | +24.4% |
| qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE | 9 | 66.7% | +17.1% | +28.5% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 20 | 65.0% | +16.8% | +26.8% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3 | 29 | 55.2% | +13.7% | +23.7% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 | 28 | 53.6% | +13.5% | +21.8% |
| walletPlayScore≥3 ∧ stars≥3.5 | 50 | 52.0% | +10.2% | +2.3% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 | 30 | 53.3% | +9.9% | +30.9% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 | 30 | 53.3% | +9.9% | +21.8% |
| qFor(roi60+size1.25)≥2 ∧ topShare≤0.5 | 30 | 53.3% | +9.9% | +21.8% |
| qFor(roi60+size1.25)≥2 ∧ maxRoiN_F≥70 | 30 | 53.3% | +9.9% | +21.8% |
| regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 51 | 58.8% | +8.7% | +12.7% |
| qFor(roi60+size1.25)≥2 ∧ meanBase_F≥55 | 22 | 54.5% | +8.4% | +34.3% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥3 | 28 | 50.0% | +8.2% | +11.1% |
| walletPlayScore≥3 ∧ stars≥3 | 53 | 50.9% | +7.4% | +1.6% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 | 28 | 53.6% | +7.1% | +28.0% |
| qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 37 | 51.4% | +6.2% | +12.0% |
| qFor(roi50+size1)≥1 ∧ walletPlayScore≥3 | 46 | 47.8% | +5.1% | +1.5% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 25 | 56.0% | +5.0% | -4.7% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 35 | 51.4% | +3.7% | +15.5% |
| stars≥3.5 ∧ sumInvested_F≥$10k | 113 | 51.3% | +3.6% | +3.6% |
| walletCountFor≥3 ∧ walletPlayScore≥3 | 55 | 49.1% | +3.5% | -0.2% |
| walletPlayScore≥2 ∧ walletPlayScore≥3 | 55 | 49.1% | +3.5% | -0.2% |
| walletPlayScore≥3 ∧ netEdge≥1 | 55 | 49.1% | +3.5% | -0.2% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ stars≥3.5 | 23 | 65.2% | +38.2% | +43.1% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 ∧ meanBase_F≥55 | 17 | 64.7% | +33.4% | +43.7% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 21 | 61.9% | +33.3% | +49.2% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ stars≥3.5 | 21 | 61.9% | +33.3% | +35.1% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +31.7% | +53.4% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +31.7% | +53.4% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ stars≥3.5 | 22 | 63.6% | +30.9% | +37.2% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ meanBase_F≥55 | 16 | 62.5% | +30.2% | +39.8% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ stars≥3 | 22 | 59.1% | +27.3% | +33.4% |
| qFor(roi50+size1)≥1 ∧ qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi50+size1)≥2 ∧ qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥2 | 25 | 60.0% | +27.1% | +38.8% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 ∧ stars≥3.5 | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ stars≥3.5 | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 ∧ stars≥3.5 | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi60+size1.25)≥2 ∧ topShare≤0.5 ∧ stars≥3.5 | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi60+size1.25)≥2 ∧ concPenalty≤2.5 ∧ stars≥3.5 | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3 ∧ stars≥3.5 | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 ∧ sumInvested_F≥$10k | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 ∧ maxRoiN_F≥70 | 25 | 60.0% | +27.1% | +27.8% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ meanBase_F≥55 | 18 | 61.1% | +25.9% | +40.5% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3 ∧ meanBase_F≥55 | 19 | 63.2% | +25.6% | +43.4% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 ∧ regime=CLEAR_MOVE | 7 | 71.4% | +25.5% | +48.3% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 20 | 60.0% | +25.1% | +42.5% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 19 | 68.4% | +22.9% | +28.6% |