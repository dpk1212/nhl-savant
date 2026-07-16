# Surplus Edge Analysis — June 1+ staked book

Generated: 2026-07-14T19:42:01.505Z

## 0 · Proof we beat the market
- n=422 · WR 55.2% · actual PnL **49.79u** · ROI **4.3%**
- Unit surplus vs efficient market: **49.8u** (expected flat≈0 → this is pure edge)
- Mean residual (won − p_mkt): **1.39pp**

## 1 · Selection vs sizing
| Book | PnL | Surplus | ROI |
|------|-----|---------|-----|
| Flat 1u (selection only) | 15.34u | 15.34u | 3.6% |
| Even-size @ avg 2.76u | 42.29u | 42.29u | 3.6% |
| **Actual sizing** | **49.79u** | **49.8u** | **4.3%** |

- **Selection surplus** (flat 1u): 15.34u
- **Sizing skill** (actual − even-size): 7.5u

### Oracle keep (at actual units of kept picks)
| Keep rule | n | %n | WR | ROI | PnL | Surplus |
|-----------|---|----|----|-----|-----|---------|
| keep_topUnopp | 210 | 49.8% | 58.6% | 13.8% | 76.24u | 76.24u |
| keep_clvHigh | 106 | 25.1% | 59.4% | 19.5% | 56u | 56u |
| keep_rank_or_superTop | 117 | 27.7% | 62.4% | 10.9% | 52.52u | 52.52u |
| keep_core | 202 | 47.9% | 60.4% | 12.9% | 79.98u | 79.99u |
| keep_convHigh | 106 | 25.1% | 59.4% | 10.2% | 33.48u | 33.48u |
| drop_nothing | 422 | 100% | 55.2% | 4.3% | 49.79u | 49.8u |

## 2 · Feature ↔ residual correlation (direction of surplus)
| Feature | r(feature, won−p_mkt) | n |
|---------|----------------------|---|
| pMkt | -0.0789 | 422 |
| isSharp | -0.0643 | 422 |
| topUnopp | 0.0579 | 422 |
| superTop | 0.0571 | 422 |
| edge | 0.0537 | 220 |
| clvTop2 | 0.0532 | 421 |
| conviction | -0.0418 | 421 |
| isRank | 0.034 | 422 |
| topVsTop | -0.0295 | 422 |
| pathA | 0.0252 | 422 |
| hcMargin | -0.0166 | 422 |
| agsV12 | 0.0165 | 422 |
| deltaQ | 0.0085 | 422 |

## 3 · Surplus model (ridge OLS on residual)
- OOS mean R²: **-15.7184** (folds: -0.1017, -0.0041, -47.0493)
| Rank | Feature | β_z |
|------|---------|-----|
| 1 | deltaQ | 0.031 |
| 2 | agsV12 | 0.0297 |
| 3 | topVsTop | 0.0178 |
| 4 | isRank | 0.0161 |
| 5 | conviction | -0.0144 |
| 6 | clvTop2 | 0.0108 |
| 7 | pathA | -0.0078 |
| 8 | hcMargin | -0.0045 |
| 9 | topUnopp | 0.0026 |
| 10 | edge | -0.0005 |
| 11 | isSharp | 0 |

### OOS predicted-surplus quintiles (ridge)
| Bucket | n | WR | ROI | PnL | Residual pp | Surplus |
|--------|---|----|-----|-----|-------------|---------|
| bot_pred_surplus | 42 | 61.9% | 18.4% | 25.09u | 8.83 | 25.09u |
| Q2 | 42 | 59.5% | 7% | 9.15u | 6.89 | 9.15u |
| Q3 | 43 | 51.2% | -3.9% | -6.14u | -3.5 | -6.14u |
| Q4 | 42 | 52.4% | -2.3% | -3.7u | -3.85 | -3.7u |
| top_pred_surplus | 43 | 55.8% | 3.5% | 5u | -0.11 | 5u |

### Tape score quintiles (rule: +TopUnopp +CLVhigh +SUPER/RANK −CLVlow −SHARP −topVsTop)
| Bucket | n | WR | ROI | PnL | Residual pp | Surplus |
|--------|---|----|-----|-----|-------------|---------|
| bot_tapeScore | 84 | 51.2% | -1.7% | -3.3u | -0.81 | -3.3u |
| tape_Q2 | 84 | 48.8% | -8.5% | -19.1u | -4.54 | -19.1u |
| tape_Q3 | 85 | 48.2% | -10.3% | -21.51u | -5.23 | -21.51u |
| tape_Q4 | 84 | 57.1% | 0.1% | 0.22u | 1.67 | 0.22u |
| top_tapeScore | 85 | 70.6% | 31.9% | 93.48u | 15.75 | 93.48u |

## 4 · Kill-list ablation (dollar value)
| Policy | n | dropped | units | PnL | ROI | Surplus | ΔPnL vs base |
|--------|---|---------|-------|-----|-----|---------|--------------|
| baseline | 422 | 0 | 1163.5 | 49.79u | 4.3% | 49.8u | 0u |
| drop_clvLow | 316 | 106 | 871.5 | 76.22u | 8.7% | 76.23u | 26.43u |
| drop_SHARP | 383 | 39 | 1050 | 65.05u | 6.2% | 65.06u | 15.26u |
| drop_topVsTop | 398 | 24 | 1132 | 52.22u | 4.6% | 52.23u | 2.43u |
| topVsTop_to_1u | 422 | 0 | 1147.5 | 51.26u | 4.5% | 51.27u | 1.47u |
| drop_clvLow_and_SHARP | 286 | 136 | 783.5 | 69.28u | 8.8% | 69.29u | 19.49u |
| combo_kill | 286 | 136 | 777 | 67.84u | 8.7% | 67.85u | 18.05u |
| only_keepCore | 202 | 220 | 619.8 | 79.98u | 12.9% | 79.99u | 30.19u |
| boost_keepCore_1p35 | 286 | 136 | 948 | 87.87u | 9.3% | 87.88u | 38.08u |

## 5 · Joint cells
| Cell | n | WR | ROI | PnL | Residual pp | Surplus |
|------|---|----|-----|-----|-------------|---------|
| keepCore | 202 | 60.4% | 12.9% | 79.98u | 5.76 | 79.99u |
| TopUnopp × CLV high | 54 | 63% | 33.4% | 52.21u | 9.43 | 52.21u |
| PathA × TopUnopp | 43 | 67.4% | 21.1% | 35.04u | 11.51 | 35.04u |
| SUPER/TOP × TopUnopp | 31 | 71% | 23.8% | 32.08u | 14.17 | 32.08u |
| TopUnopp × mid CLV | 103 | 58.3% | 4.5% | 12.02u | 3.16 | 12.02u |
| TopUnopp × CLV low | 53 | 54.7% | 9.3% | 12.01u | 1.2 | 12.01u |
| SHARP × CLV high | 16 | 56.3% | 6.8% | 3.54u | 0.84 | 3.54u |
| SUPER/TOP × TopVsTop | 1 | 100% | 58.8% | 3.53u | 37.04 | 3.53u |
| PathA × TopVsTop | 5 | 60% | 25.1% | 2.51u | -6.93 | 2.51u |
| TopVsTop × any | 24 | 50% | -7.7% | -2.43u | -4.59 | -2.43u |
| RANK × CLV high | 9 | 44.4% | -12.7% | -4.58u | -5.62 | -4.58u |
| SHARP × CLV low | 9 | 11.1% | -87.1% | -22.2u | -38.65 | -22.2u |

## Takeaways
- Best ΔPnL policy in this pass: **boost_keepCore_1p35** (38.08u) at ROI 9.3%
- Press cells with positive residual + surplus; kill CLV-low / SHARP / (downsize) topVsTop.
- Next deploy step: May-fit → June-holdout bakeoff on the winning ablation (not in-sample only).

## Artifacts
- `tmp_surplus_edge_june1.json`
- `scripts/_surplus_edge_analysis.mjs`
- `SURPLUS_EDGE_REPORT.md`