# Additive Win-Prob Model — June 1+ staked book

Generated: 2026-07-14T19:20:19.617Z

## Universe
- n=422 · 233-189 · WR 55.2% · 1163.5u · PnL 49.79u · ROI 4.3%
- Filter: date≥2026-06-01, !tracked, AGS-U tier, finalUnits>0, W/L only
- Missing EDGE: 202 · Missing CLV: 1 · Complete-case n=220

## Model
```
logit(P(win)) = β0 + Σ βk · z(xk)
edge_vs_mkt   = P(win) − implied(odds)
```
- Ridge λ=8 on non-intercept; z-scored on train fold; nulls → train median
- **Odds not trained** — only for edge / ROI buckets

## CV bakeoff (expanding-window, mean AUC, train≥100)
| Model | mean AUC |
|-------|----------|
| Market implied | 0.5839 |
| agsV12 alone | 0.4967 |
| EDGE alone | 0.4915 |
| Core5 (ags+conv+edge+clv+RANK) | 0.465 |
| **Full additive** | **0.4938** |
| Complete-case full (n=220) | 0.4499 (mkt 0.5923) |

### Univariate AUC (descriptive, full sample)
| Feature | AUC |
|---------|-----|
| conviction | 0.5498 |
| clvTop2 | 0.5496 |
| topUnopp | 0.5338 |
| hcMargin | 0.5263 |
| agsV12 | 0.5232 |
| isSOC | 0.5229 |
| deltaQ | 0.5198 |
| isRank | 0.5097 |
| edge | 0.5077 |
| top2MinusMean | 0.498 |
| topVsTop | 0.494 |
| isMLB | 0.4811 |
| isSharp | 0.4783 |

### Holdout last 30%
| market 0.5401 · ags 0.5164 · edge 0.5404 · core5 0.5216 · **full 0.5569** |

## Coefficient rank (|β| on z-scored features, final 70% train)
| Rank | Feature | β_z |
|------|---------|-----|
| 1 | top2MinusMean | -0.3619 |
| 2 | deltaQ | 0.315 |
| 3 | isSOC | 0.2078 |
| 4 | isRank | 0.0911 |
| 5 | hcMargin | -0.0896 |
| 6 | isSharp | -0.0613 |
| 7 | topVsTop | 0.0569 |
| 8 | clvTop2 | 0.0552 |
| 9 | agsV12 | 0.0531 |
| 10 | isMLB | -0.0525 |
| 11 | topUnopp | 0.0389 |
| 12 | edge | 0.0178 |
| 13 | conviction | -0.004 |

## Edge quintiles (OOS CV predictions)
| Q | n | WR | flat ROI | units ROI | units PnL | mean edge pp |
|---|---|----|----------|-----------|-----------|--------------|
| bottom_edge | 50 | 58% | -3.2% | -6.6% | -10.98u | -17.58 |
| Q2 | 50 | 60% | 12.8% | 6% | 9.78u | -2.52 |
| Q3 | 51 | 58.8% | 11.3% | 11% | 16.06u | 2.33 |
| Q4 | 50 | 48% | -8.4% | 1.3% | 1.85u | 7.27 |
| top_edge | 51 | 54.9% | 4.6% | 3.2% | 5.82u | 29.93 |

## Pass bar
- Full beats market (+1pp AUC): **false**
- Full beats best single (+0.5pp): **false**
- Top edge quintile ROI>0 & n≥40: **true** (n=51, ROI=3.2%)
- **Verdict: MIXED — directional signal, not full bar**

## Interpretation notes
- Market implied alone is a strong baseline (favorites win more); beating it is the real bar.
- Gates (CLV cancel, top_cap, RANK) can still have value as *policies* even if linear combo does not beat market AUC.
- Negative β on a feature means higher values associate with *lower* win rate in the joint model (collinearity possible).

## Artifacts
- `tmp_additive_winprob_june1.json`
- `tmp_additive_winprob_june1_rows.csv`
- `scripts/_additive_winprob_model.mjs`
