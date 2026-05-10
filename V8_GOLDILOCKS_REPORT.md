# V8 Goldilocks Deep Dive

_Generated 2026-05-10T14:00:04.778Z_

## 0. Sample & Baseline

- Picks in sample: **307** (LOCKED=199, SHADOW=108)
- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.
- Baseline: WR **48.2%** · flat ROI **-6.2%** · units-wtd ROI **-0.1%**


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
| 2026-05-06 | MLB | ML | home | 2.5 | 0.5 | -104 | -2.02 | 0 | 0 | 0 | WIN |
| 2026-05-06 | NBA | ML | home | 5 | 3 | -380 | 5.00 | 1 | 0 | 1 | WIN |
| 2026-05-06 | NBA | ML | away | 5 | 1.75 | +227 | 3.49 | 1 | 0 | 1 | LOSS |
| 2026-05-06 | NHL | ML | away | 3.5 | 1.13 | +141 | — | 1 | 1 | 0 | WIN |
| 2026-05-06 | NBA | SPREAD | away | 3.5 | 0.75 | -104 | -2.37 | 1 | 0 | 1 | LOSS |
| 2026-05-06 | NBA | SPREAD | away | 5 | 3.5 | -105 | 3.71 | 1 | 0 | 1 | WIN |
| 2026-05-06 | NBA | TOTAL | over | 3.5 | 0.75 | -107 | -1.46 | 1 | 0 | 1 | WIN |
| 2026-05-07 | NBA | SPREAD | home | 4.5 | 3.5 | -107 | 2.50 | 0 | 1 | -1 | WIN |
| 2026-05-07 | NHL | SPREAD | home | 2.5 | 0 | -190 | -1.70 | 1 | 0 | 1 | LOSS |
| 2026-05-07 | MLB | TOTAL | over | 3.5 | 0.75 | -110 | -1.99 | 1 | 0 | 1 | WIN |
| 2026-05-08 | MLB | ML | home | 4 | 1.88 | -136 | 0.72 | 1 | 0 | 1 | LOSS |
| 2026-05-08 | NBA | ML | away | 3.5 | 1.13 | -218 | 1.42 | 1 | 2 | -1 | WIN |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -134 | -1.95 | 0 | 0 | 0 | LOSS |
| 2026-05-08 | NHL | ML | home | 3.5 | 1.13 | -108 | -1.99 | 1 | 0 | 1 | LOSS |
| 2026-05-08 | NBA | SPREAD | away | 5 | 3.5 | -105 | 2.49 | 0 | 0 | 0 | WIN |
| 2026-05-08 | NBA | TOTAL | under | 4.5 | 3.5 | -103 | 0.47 | 1 | 0 | 1 | WIN |
| 2026-05-08 | NBA | TOTAL | over | 4 | 0.75 | +101 | 1.02 | 0 | 0 | 0 | WIN |
| 2026-05-09 | NBA | ML | away | 3.5 | 1.13 | +165 | -3.15 | 1 | 2 | -1 | LOSS |
| 2026-05-09 | NBA | ML | away | 5 | 4.5 | -364 | — | 3 | 0 | 3 | WIN |
| 2026-05-09 | NBA | SPREAD | home | 4.5 | 1.7 | -104 | — | 2 | 1 | 1 | WIN |
| 2026-05-09 | NBA | SPREAD | away | 4.5 | 2 | -104 | — | 1 | 0 | 1 | WIN |
| 2026-05-09 | NBA | TOTAL | over | 3.5 | 0.75 | -106 | -1.35 | 1 | 0 | 1 | WIN |

## 3. Continuous Predictors — ρ vs outcomes

Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.

| Feature | ρ(·, won) | ρ(·, flat profit) |
|---|---:|---:|
| meanConv_F | +0.139 | +0.145 |
| sumSize_delta | +0.125 | +0.127 |
| sumSize_F | +0.069 | +0.095 |
| countDelta | +0.122 | +0.084 |
| maxRoiN_F | +0.066 | +0.065 |
| walletCountAgainst | +0.063 | +0.049 |
| walletCountFor | +0.036 | +0.042 |
| againstSide | +0.017 | +0.041 |
| meanBase_F | -0.021 | -0.035 |
| walletPlayScore | -0.100 | -0.035 |
| maxRoiN_delta | +0.096 | +0.031 |
| netEdge | -0.054 | -0.030 |
| forSide | -0.086 | -0.030 |
| sumRoiN_A | +0.006 | +0.030 |
| sumRoiN_F | -0.066 | -0.026 |
| topShare | +0.100 | +0.024 |
| concPenalty | +0.100 | +0.023 |
| sumInvest_delta | -0.070 | -0.020 |
| breadthBonus | -0.001 | +0.019 |
| meanBase_delta | +0.022 | -0.017 |
| sumInvest_F | -0.044 | +0.015 |
| meanConv_delta | +0.086 | +0.015 |
| sumContrib_delta | -0.013 | -0.014 |
| sumRoiN_delta | +0.002 | -0.010 |
| sumContrib_F | -0.047 | -0.004 |
## 1. Qualified-Sharp Count Scan (H1)

For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.
Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.263 | +0.187 |
| sizeRatio≥1 (roi any) | +0.188 | +0.154 |
| convictionMult≥1 | +0.185 | +0.148 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.224 | +0.144 |
| invested≥$5k | +0.142 | +0.137 |
| roiNorm≥60 & sizeRatio≥1 | +0.190 | +0.132 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.194 | +0.128 |
| walletBase≥60 & sizeRatio≥1 | +0.228 | +0.125 |
| roiNorm≥50 & sizeRatio≥1 | +0.151 | +0.116 |
| walletBase≥50 & sizeRatio≥1 | +0.157 | +0.116 |
| contribution≥60 | +0.186 | +0.115 |
| contribution≥50 | +0.115 | +0.078 |
| rankNorm≥60 | +0.064 | +0.055 |
| roiNorm≥50 (size any) | +0.046 | +0.012 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 193 | 47.2% | -8.9% | -8.0% |
| 1 qFor | 90 | 48.9% | -5.6% | +0.4% |
| 2 qFor | 20 | 50.0% | +4.8% | +14.6% |
| 3+ qFor | 4 | 75.0% | +56.5% | +98.7% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 85 | 44.7% | -15.3% | -24.4% |
| 1 qFor | 131 | 49.6% | -5.1% | +0.8% |
| 2 qFor | 46 | 45.7% | -14.0% | +2.6% |
| 3+ qFor | 45 | 53.3% | +15.7% | +11.5% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 88 | 45.5% | -13.8% | -25.8% |
| 1 qFor | 128 | 49.2% | -5.9% | +2.0% |
| 2 qFor | 46 | 45.7% | -14.0% | +2.6% |
| 3+ qFor | 45 | 53.3% | +15.7% | +11.5% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 171 | 48.5% | -5.5% | -5.6% |
| 1 qFor | 98 | 46.9% | -10.0% | -2.0% |
| 2 qFor | 26 | 38.5% | -17.3% | -14.7% |
| 3+ qFor | 12 | 75.0% | +38.7% | +62.3% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 33 | 36.4% | -32.9% | -25.9% |
| 1 qFor | 151 | 49.0% | -6.3% | -0.0% |
| 2 qFor | 65 | 50.8% | -3.7% | -5.5% |
| 3+ qFor | 58 | 50.0% | +6.6% | +8.8% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 155 | 50.3% | -2.4% | +1.2% |
| 1 qFor | 107 | 44.9% | -14.5% | -7.7% |
| 2 qFor | 30 | 40.0% | -11.3% | -10.0% |
| 3+ qFor | 15 | 66.7% | +23.9% | +39.9% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 156 | 48.7% | -7.2% | -6.1% |
| 1 qFor | 105 | 49.5% | -2.3% | +6.3% |
| 2 qFor | 28 | 32.1% | -31.1% | -28.0% |
| 3+ qFor | 18 | 61.1% | +18.9% | +34.8% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 173 | 48.6% | -3.9% | -4.4% |
| 1 qFor | 104 | 48.1% | -10.5% | +5.2% |
| 2 qFor | 24 | 41.7% | -20.1% | -30.6% |
| 3+ qFor | 6 | 66.7% | +58.1% | +105.3% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 137 | 49.6% | -6.6% | -1.1% |
| 1 qFor | 116 | 50.0% | -1.0% | +7.1% |
| 2 qFor | 30 | 30.0% | -35.6% | -38.8% |
| 3+ qFor | 24 | 54.2% | +7.8% | +22.7% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 124 | 51.6% | -1.5% | +5.0% |
| 1 qFor | 120 | 45.0% | -13.4% | -2.8% |
| 2 qFor | 35 | 45.7% | -8.2% | -14.2% |
| 3+ qFor | 28 | 50.0% | +6.6% | +12.3% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 96 | 47.9% | -8.8% | -10.9% |
| 1 qFor | 130 | 50.0% | -2.5% | +9.1% |
| 2 qFor | 42 | 47.6% | -9.6% | -4.5% |
| 3+ qFor | 39 | 43.6% | -8.5% | -1.5% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 40 | 50.0% | -5.4% | -17.5% |
| 1 qFor | 138 | 50.0% | -3.0% | +10.6% |
| 2 qFor | 72 | 41.7% | -17.3% | -13.9% |
| 3+ qFor | 57 | 50.9% | -0.5% | +4.8% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 45 | 57.8% | +8.4% | +19.8% |
| 1 qFor | 126 | 42.1% | -20.4% | -21.0% |
| 2 qFor | 93 | 52.7% | +4.1% | +15.7% |
| 3+ qFor | 43 | 46.5% | -1.9% | +1.7% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| 0 qFor | 20 | 45.0% | -15.1% | -31.6% |
| 1 qFor | 115 | 53.9% | +3.0% | +18.8% |
| 2 qFor | 99 | 48.5% | -2.8% | +1.0% |
| 3+ qFor | 73 | 39.7% | -22.9% | -13.8% |

## 2. Qualified-Margin Scan (H2)

Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.

### Quality-definition leaderboard (ρ per-pick)

| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |
|---|---:|---:|
| roiNorm≥70 & sizeRatio≥1 | +0.264 | +0.155 |
| sizeRatio≥1 (roi any) | +0.231 | +0.149 |
| convictionMult≥1 | +0.228 | +0.142 |
| roiNorm≥60 & sizeRatio≥1.25 | +0.229 | +0.134 |
| roiNorm≥60 & sizeRatio≥1 | +0.201 | +0.118 |
| invested≥$5k | +0.147 | +0.115 |
| roiNorm≥50 & sizeRatio≥1.25 | +0.194 | +0.095 |
| walletBase≥60 & sizeRatio≥1 | +0.210 | +0.085 |
| roiNorm≥50 & sizeRatio≥1 | +0.162 | +0.085 |
| walletBase≥50 & sizeRatio≥1 | +0.168 | +0.082 |
| contribution≥60 | +0.172 | +0.062 |
| contribution≥50 | +0.130 | +0.055 |
| rankNorm≥60 | +0.051 | +0.045 |
| roiNorm≥50 (size any) | +0.103 | +0.043 |

### Per-definition bucket tables


#### Quality: roiNorm≥70 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 210 | 47.1% | -7.4% | -6.0% |
| margin +1 | 80 | 48.8% | -7.8% | +2.3% |
| margin +2 | 13 | 53.8% | +3.8% | -0.5% |
| margin ≥+3 | 4 | 75.0% | +56.5% | +98.7% |

#### Quality: sizeRatio≥1 (roi any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 118 | 45.8% | -8.4% | -2.8% |
| margin +1 | 132 | 48.5% | -7.2% | -8.0% |
| margin +2 | 28 | 50.0% | -7.1% | +11.6% |
| margin ≥+3 | 29 | 55.2% | +8.1% | +12.8% |

#### Quality: convictionMult≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 121 | 46.3% | -7.5% | -4.3% |
| margin +1 | 129 | 48.1% | -8.0% | -7.2% |
| margin +2 | 28 | 50.0% | -7.1% | +11.6% |
| margin ≥+3 | 29 | 55.2% | +8.1% | +12.8% |

#### Quality: roiNorm≥60 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 195 | 48.2% | -5.5% | -6.3% |
| margin +1 | 85 | 47.1% | -8.8% | +1.1% |
| margin +2 | 22 | 45.5% | -10.1% | +8.7% |
| margin ≥+3 | 5 | 80.0% | +26.9% | +42.8% |

#### Quality: roiNorm≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 182 | 49.5% | -3.3% | -0.1% |
| margin +1 | 97 | 44.3% | -13.9% | -9.7% |
| margin +2 | 19 | 47.4% | -10.3% | +7.6% |
| margin ≥+3 | 9 | 66.7% | +26.5% | +39.4% |

#### Quality: invested≥$5k

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 81 | 46.9% | -10.5% | +5.4% |
| margin +1 | 144 | 46.5% | -8.9% | -10.9% |
| margin +2 | 50 | 52.0% | +4.7% | +0.8% |
| margin ≥+3 | 32 | 53.1% | -0.1% | +13.0% |

#### Quality: roiNorm≥50 & sizeRatio≥1.25

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 181 | 49.7% | -2.4% | -0.7% |
| margin +1 | 96 | 46.9% | -9.1% | -1.5% |
| margin +2 | 21 | 33.3% | -33.0% | -10.6% |
| margin ≥+3 | 9 | 66.7% | +11.8% | +38.8% |

#### Quality: walletBase≥60 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 197 | 49.7% | -1.4% | +2.8% |
| margin +1 | 92 | 45.7% | -15.3% | -7.0% |
| margin +2 | 14 | 35.7% | -36.8% | -27.7% |
| margin ≥+3 | 4 | 75.0% | +73.6% | +119.2% |

#### Quality: roiNorm≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 165 | 50.3% | -2.0% | +2.4% |
| margin +1 | 108 | 47.2% | -7.6% | -2.9% |
| margin +2 | 22 | 27.3% | -48.5% | -31.5% |
| margin ≥+3 | 12 | 66.7% | +25.9% | +50.3% |

#### Quality: walletBase≥50 & sizeRatio≥1

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 156 | 51.9% | +2.7% | +12.9% |
| margin +1 | 111 | 42.3% | -19.2% | -19.0% |
| margin +2 | 25 | 40.0% | -24.6% | -6.8% |
| margin ≥+3 | 15 | 66.7% | +27.8% | +29.4% |

#### Quality: contribution≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 129 | 51.9% | +4.3% | +10.6% |
| margin +1 | 124 | 46.0% | -12.4% | -5.9% |
| margin +2 | 33 | 42.4% | -21.5% | -9.3% |
| margin ≥+3 | 21 | 47.6% | -9.7% | +2.1% |

#### Quality: contribution≥50

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 81 | 49.4% | +2.3% | +0.9% |
| margin +1 | 138 | 51.4% | -0.9% | +7.0% |
| margin +2 | 55 | 36.4% | -33.4% | -20.6% |
| margin ≥+3 | 33 | 51.5% | -4.1% | +8.0% |

#### Quality: rankNorm≥60

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 97 | 50.5% | -5.0% | -6.7% |
| margin +1 | 118 | 44.9% | -10.1% | -2.6% |
| margin +2 | 67 | 49.3% | -5.3% | +4.1% |
| margin ≥+3 | 25 | 52.0% | +5.3% | +10.7% |

#### Quality: roiNorm≥50 (size any)

| Bucket | N | WR | flat ROI | units-wtd ROI |
|---|---:|---:|---:|---:|
| margin ≤ 0 | 75 | 52.0% | +3.6% | +15.3% |
| margin +1 | 112 | 48.2% | -7.7% | -3.0% |
| margin +2 | 75 | 50.7% | +1.1% | +3.6% |
| margin ≥+3 | 45 | 37.8% | -31.0% | -13.9% |

## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)

Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.
Use this as a hint generator, not a backtest — with N=307 most rules are overfit.

### Single-factor rules (N ≥ 3)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| regime=CLEAR_MOVE | 75 | 58.7% | +8.9% | +18.4% |
| qFor(roi60+size1.25)≥2 | 38 | 50.0% | +0.4% | +14.5% |
| walletPlayScore≥3 | 62 | 48.4% | +0.1% | -1.4% |
| stars≥3.5 | 161 | 49.7% | -1.8% | +6.0% |
| sumInvested_F≥$10k | 251 | 49.4% | -3.2% | +0.7% |
| maxRoiN_F≥70 | 201 | 49.3% | -4.5% | +4.3% |
| walletCountAgainst=0 | 129 | 50.4% | -4.6% | -5.1% |
| stars≥3 | 198 | 48.0% | -5.6% | +2.7% |
| qFor(roi50+size1)≥1 | 170 | 47.1% | -5.9% | +0.3% |
| concPenalty≤2.5 | 206 | 47.1% | -6.8% | -2.5% |
| qMargin(roi60+size1.25)≥1 | 112 | 48.2% | -7.4% | +6.2% |
| walletPlayScore≥2 | 106 | 45.3% | -7.5% | -3.3% |
| walletCountFor≥3 | 150 | 46.7% | -7.7% | +3.8% |
| netEdge≥1 | 160 | 46.3% | -9.1% | -4.7% |
| topShare≤0.5 | 134 | 45.5% | -9.5% | -1.7% |
| qMargin(roi50+size1)≥1 | 142 | 45.8% | -11.1% | -2.0% |
| meanBase_F≥55 | 196 | 43.9% | -15.8% | -10.6% |
| qFor(roi50+size1)≥2 | 54 | 40.7% | -16.3% | -8.8% |

### Top 2-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 34 | 64.7% | +20.6% | +15.8% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 | 25 | 56.0% | +19.8% | +23.2% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3.5 | 31 | 58.1% | +19.3% | +21.5% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 26 | 65.4% | +17.1% | +34.7% |
| qFor(roi60+size1.25)≥2 ∧ regime=CLEAR_MOVE | 9 | 66.7% | +17.1% | +28.5% |
| qFor(roi60+size1.25)≥2 ∧ walletCountAgainst=0 | 5 | 60.0% | +13.3% | +16.7% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 | 30 | 53.3% | +12.5% | +17.6% |
| regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 58 | 60.3% | +10.9% | +18.3% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 | 35 | 54.3% | +9.0% | +18.6% |
| qFor(roi60+size1.25)≥2 ∧ stars≥3 | 35 | 54.3% | +9.0% | +18.6% |
| qFor(roi50+size1)≥2 ∧ walletPlayScore≥3 | 30 | 50.0% | +7.5% | +7.5% |
| qFor(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 43 | 58.1% | +7.1% | +20.5% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 | 36 | 52.8% | +6.0% | +23.7% |
| qFor(roi60+size1.25)≥2 ∧ maxRoiN_F≥70 | 36 | 52.8% | +6.0% | +17.2% |
| qFor(roi60+size1.25)≥2 ∧ topShare≤0.5 | 33 | 51.5% | +5.8% | +15.6% |
| walletPlayScore≥3 ∧ stars≥3.5 | 57 | 50.9% | +5.7% | +0.6% |
| stars≥3.5 ∧ regime=CLEAR_MOVE | 47 | 57.4% | +5.6% | +19.6% |
| qFor(roi60+size1.25)≥2 ∧ netEdge≥1 | 32 | 50.0% | +5.4% | +14.0% |
| qMargin(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 35 | 57.1% | +4.9% | +23.5% |
| regime=CLEAR_MOVE ∧ meanBase_F≥55 | 53 | 56.6% | +4.8% | +9.5% |
| regime=CLEAR_MOVE ∧ maxRoiN_F≥70 | 51 | 56.9% | +4.1% | +15.6% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 40 | 52.5% | +3.7% | +13.7% |
| walletPlayScore≥3 ∧ stars≥3 | 60 | 50.0% | +3.5% | +0.0% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 | 34 | 52.9% | +3.5% | +21.3% |
| qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 43 | 51.2% | +3.4% | +10.4% |

### Top 3-factor AND rules (N ≥ 3, top 25)

| Rule | N | WR | flat ROI | wtd ROI |
|---|---:|---:|---:|---:|
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 ∧ regime=CLEAR_MOVE | 9 | 77.8% | +33.3% | +52.6% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +31.7% | +53.4% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE | 8 | 75.0% | +31.7% | +53.4% |
| qMargin(roi60+size1.25)≥1 ∧ topShare≤0.5 ∧ regime=CLEAR_MOVE | 16 | 75.0% | +30.7% | +56.9% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥3 | 23 | 60.9% | +30.2% | +37.2% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ stars≥3.5 | 23 | 60.9% | +30.2% | +26.5% |
| qMargin(roi60+size1.25)≥1 ∧ walletCountFor≥3 ∧ regime=CLEAR_MOVE | 18 | 72.2% | +28.7% | +53.8% |
| walletCountAgainst=0 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 22 | 68.2% | +28.3% | +17.5% |
| walletCountAgainst=0 ∧ walletPlayScore≥3 ∧ regime=CLEAR_MOVE | 3 | 66.7% | +27.7% | +41.2% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ stars≥3.5 | 29 | 62.1% | +27.5% | +32.0% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ sumInvested_F≥$10k | 24 | 70.8% | +26.9% | +36.1% |
| qMargin(roi60+size1.25)≥1 ∧ regime=CLEAR_MOVE ∧ maxRoiN_F≥70 | 24 | 70.8% | +26.9% | +39.4% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ meanBase_F≥55 | 18 | 61.1% | +26.6% | +28.3% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥3 ∧ stars≥3 | 24 | 58.3% | +24.8% | +25.2% |
| qFor(roi60+size1.25)≥2 ∧ walletCountAgainst=0 ∧ meanBase_F≥55 | 3 | 66.7% | +24.1% | +39.2% |
| qMargin(roi60+size1.25)≥1 ∧ walletCountAgainst=0 ∧ regime=CLEAR_MOVE | 9 | 66.7% | +23.6% | +31.7% |
| qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥2 ∧ regime=CLEAR_MOVE | 16 | 68.8% | +23.3% | +44.4% |
| qFor(roi60+size1.25)≥2 ∧ walletCountFor≥3 ∧ stars≥3.5 | 30 | 60.0% | +23.2% | +23.0% |
| qMargin(roi60+size1.25)≥1 ∧ stars≥3.5 ∧ regime=CLEAR_MOVE | 19 | 68.4% | +23.2% | +37.4% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ walletPlayScore≥3 | 22 | 59.1% | +22.6% | +31.4% |
| qMargin(roi60+size1.25)≥1 ∧ netEdge≥1 ∧ regime=CLEAR_MOVE | 19 | 68.4% | +21.6% | +39.2% |
| qMargin(roi60+size1.25)≥1 ∧ concPenalty≤2.5 ∧ regime=CLEAR_MOVE | 20 | 70.0% | +21.5% | +37.6% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi60+size1.25)≥1 ∧ stars≥3.5 | 28 | 60.7% | +21.4% | +27.5% |
| qFor(roi60+size1.25)≥2 ∧ qMargin(roi50+size1)≥1 ∧ walletPlayScore≥2 | 28 | 57.1% | +20.5% | +29.0% |
| qFor(roi60+size1.25)≥2 ∧ walletPlayScore≥2 ∧ stars≥3.5 | 28 | 57.1% | +20.5% | +20.4% |