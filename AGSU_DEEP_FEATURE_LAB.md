# AGS-U Deep Feature Lab

_Generated: 2026-05-25T14:50:08.802Z_

56 candidate features tested with strict-causal 5-fold time-aware CV on 558 W/L picks since 2026-04-18.

Sport counts: MLB=283 NBA=213 NHL=62.

---

## Univariate rankings

### ALL (n=558) — top 20 by |ρ|

| feature | ρ | AUC | Q5−Q1 |
|---|---|---|---|
| `dHcSizeRatio` | 0.147 | 0.583 | 20.7% |
| `dCount` | 0.140 | 0.574 | 23.4% |
| `dSumRoiNorm` | 0.119 | 0.569 | 18.9% |
| `dHcCount` | 0.109 | 0.555 | 15.3% |
| `dHcContribShare` | 0.096 | 0.555 | 11.7% |
| `dHcAvgRoi` | 0.089 | 0.550 | 16.2% |
| `dHcSumRoi` | 0.088 | 0.550 | 13.5% |
| `dSumRoi` | 0.085 | 0.549 | 12.6% |
| `dLeaderboardCt` | 0.082 | 0.546 | 17.1% |
| `top3DeltaRoi` | 0.081 | 0.546 | 10.8% |
| `dSumPreSWr` | 0.080 | 0.546 | 17.1% |
| `dHcSumRankNorm` | 0.079 | 0.545 | 12.6% |
| `dAvgPreAFlatRoi` | -0.079 | 0.454 | -9.0% |
| `dMaxRoiNorm` | 0.077 | 0.545 | 9.9% |
| `dSumPnlNorm` | 0.075 | 0.543 | 15.3% |
| `forContribShare` | 0.074 | 0.548 | 5.4% |
| `dHcSumPnl` | 0.073 | 0.541 | 10.8% |
| `dSumPreAFlatRoi` | -0.067 | 0.461 | -9.9% |
| `dConvictionAvg` | 0.066 | 0.538 | 9.0% |
| `dMaxRoi` | 0.065 | 0.537 | 5.4% |

### MLB (n=283) — top 20 by |ρ|

| feature | ρ | AUC | Q5−Q1 |
|---|---|---|---|
| `dHcAvgPreSWr` | -0.149 | 0.432 | -21.4% |
| `dMaxRankNorm` | -0.125 | 0.427 | -16.1% |
| `dAvgPreAWr` | -0.121 | 0.430 | -21.4% |
| `dAvgPreAFlatRoi` | -0.121 | 0.430 | -23.2% |
| `dHcWinnerCt` | -0.121 | 0.455 | -14.3% |
| `dAvgRankNorm` | -0.119 | 0.429 | -16.1% |
| `dMaxPnlNorm` | -0.111 | 0.436 | -8.9% |
| `top3DeltaRankNorm` | -0.106 | 0.436 | -10.7% |
| `dSumRankNorm` | -0.106 | 0.436 | -10.7% |
| `dHcSumPreSFlatRoi` | -0.104 | 0.455 | -19.6% |
| `dSumLbWalletsByRank` | -0.103 | 0.442 | -14.3% |
| `dAvgPreSWr` | -0.103 | 0.440 | -16.1% |
| `dSumPreAFlatRoi` | -0.100 | 0.442 | -12.5% |
| `dSumPnl` | -0.093 | 0.446 | -10.7% |
| `dWinnerCtPreA` | -0.093 | 0.437 | -7.1% |
| `dHcContribShare` | -0.089 | 0.454 | -7.1% |
| `dWinnerCtPreS` | -0.089 | 0.447 | -7.1% |
| `dSumPnlNorm` | -0.087 | 0.450 | -7.1% |
| `dAvgPreSFlatRoi` | -0.087 | 0.450 | -16.1% |
| `dSumPreSWr` | -0.080 | 0.454 | -3.6% |

### NBA (n=213) — top 20 by |ρ|

| feature | ρ | AUC | Q5−Q1 |
|---|---|---|---|
| `dCount` | 0.265 | 0.644 | 38.1% |
| `dHcSizeRatio` | 0.247 | 0.641 | 40.5% |
| `dHcAvgPreSWr` | 0.245 | 0.635 | 26.2% |
| `dHcContribShare` | 0.228 | 0.628 | 26.2% |
| `dSumRoiNorm` | 0.226 | 0.631 | 31.0% |
| `dSumPreSWr` | 0.214 | 0.623 | 33.3% |
| `forContribShare` | 0.205 | 0.608 | 31.0% |
| `dSumPnlNorm` | 0.203 | 0.617 | 31.0% |
| `dAvgPreSWr` | 0.197 | 0.613 | 26.2% |
| `dHcCount` | 0.190 | 0.595 | 23.8% |
| `dSumPreSN` | 0.187 | 0.608 | 33.3% |
| `dSumPreSWins` | 0.182 | 0.605 | 33.3% |
| `dSumPreSLosses` | 0.171 | 0.597 | 38.1% |
| `dLeaderboardCt` | 0.171 | 0.591 | 23.8% |
| `dAvgPreAWr` | 0.170 | 0.598 | 23.8% |
| `dConvictionAvg` | 0.164 | 0.594 | 19.0% |
| `dSumRoi` | 0.162 | 0.593 | 21.4% |
| `dCombinedQuality` | 0.160 | 0.592 | 23.8% |
| `dHcAvgRoi` | 0.159 | 0.590 | 19.0% |
| `top3DeltaRoi` | 0.155 | 0.589 | 21.4% |

### NHL (n=62) — top 20 by |ρ|

| feature | ρ | AUC | Q5−Q1 |
|---|---|---|---|
| `dHcAvgRoi` | 0.314 | 0.681 | 50.0% |
| `dSumRoi` | 0.303 | 0.673 | 41.7% |
| `dMaxRoi` | 0.298 | 0.671 | 33.3% |
| `top3DeltaRoi` | 0.297 | 0.670 | 41.7% |
| `dHcSumRoi` | 0.296 | 0.671 | 41.7% |
| `dSumRoiNorm` | 0.294 | 0.670 | 58.3% |
| `dHcContribShare` | 0.282 | 0.680 | 25.0% |
| `dSumPnl` | 0.274 | 0.657 | 50.0% |
| `dMaxPnlNorm` | 0.268 | 0.655 | 50.0% |
| `dCount` | 0.261 | 0.666 | 25.0% |
| `dHcCount` | 0.261 | 0.668 | 41.7% |
| `dLeaderboardCt` | 0.260 | 0.669 | 25.0% |
| `dHcSumPnl` | 0.260 | 0.650 | 41.7% |
| `dSumPnlNorm` | 0.248 | 0.644 | 41.7% |
| `dMaxRoiNorm` | 0.243 | 0.641 | 25.0% |
| `bestContribOnFor` | 0.242 | 0.683 | 16.7% |
| `dAvgRoi` | 0.239 | 0.636 | 25.0% |
| `dHcSumRankNorm` | 0.239 | 0.644 | 25.0% |
| `dSumPreSLosses` | 0.239 | 0.647 | 25.0% |
| `dAvgPreSFlatRoi` | -0.228 | 0.369 | -41.7% |

## Forward stepwise

Selected: `[dHcSizeRatio, dCount, dSumRankNorm, dWinnerCtPreA]`  ·  Final CV AUC = **0.596**

| step | added | AUC | MLB | NBA | NHL | Q5-Q1 | accepted |
|---|---|---|---|---|---|---|---|
| 1 | `dHcSizeRatio` | 0.575 | 0.467 | 0.637 | 0.628 | 19.8% | ✓ |
| 2 | `dCount` | 0.583 | 0.477 | 0.662 | 0.636 | 23.4% | ✓ |
| 3 | `dSumRankNorm` | 0.591 | 0.541 | 0.638 | 0.611 | 25.2% | ✓ |
| 4 | `dWinnerCtPreA` | 0.596 | 0.549 | 0.632 | 0.646 | 23.4% | ✓ |
| 5 | `bestPreSRoiOnFor` | 0.596 | 0.550 | 0.633 | 0.651 | 22.5% | ✗ |

### Final fit

Universal CV: AUC=0.596  ρ=0.166  Q5-Q1=23.4%

| sport | n | AUC | ρ | Q5-Q1 |
|---|---|---|---|---|
| MLB | 283 | 0.549 | 0.085 | 10.7% |
| NBA | 213 | 0.632 | 0.228 | 31.0% |
| NHL | 62 | 0.646 | 0.252 | 33.3% |

Coefficients:

| term | β |
|---|---|
| intercept | 0.0887 |
| dHcSizeRatio | 0.2787 |
| dCount | 0.5371 |
| dSumRankNorm | -0.2740 |
| dWinnerCtPreA | -0.1916 |

Normalizers:

| feature | mean | sd |
|---|---|---|
| dHcSizeRatio | 1.2031 | 5.4462 |
| dCount | 1.1237 | 1.4971 |
| dSumRankNorm | 62.3701 | 91.0889 |
| dWinnerCtPreA | 0.6685 | 1.1208 |

---
_Generated by `scripts/_agsu_deep_feature_lab.mjs` · 2026-05-25T14:50:08.802Z_