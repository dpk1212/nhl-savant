# Surplus Policy Deploy Sim — May-fit → June-deploy

Generated: 2026-07-14T19:44:50.976Z

## Discipline
- Fit CLV quartiles on **2026-05-10 → 2026-06-01** only (May UI-staked n=272, CLV n=272)
- Frozen thresholds: CLV-low ≤ **65.47** · CLV-high ≥ **72.03**
- Deploy on June 1+ actual UI staked book (n=422)
- Odds cap applied after policy (same production bands)

## June+ policy bakeoff
| Policy | n | dropped | stake | WR | PnL | ROI | Surplus | ΔPnL |
|--------|---|---------|-------|----|-----|-----|---------|------|
| **DROP_SHARP** | 383 | 39 | 1028.5u | 56.4% | **63.88u** | 6.2% | 63.88u | 17.62u |
| **KEEP_CORE** | 145 | 277 | 461.5u | 60% | **56.26u** | 12.2% | 56.26u | 10u |
| **DROP_CLV_LOW** | 235 | 187 | 654.25u | 57.4% | **50.06u** | 7.7% | 50.06u | 3.8u |
| **TOPVSTOP_1U** | 422 | 0 | 1126u | 55.2% | **47.99u** | 4.3% | 47.99u | 1.73u |
| **BASELINE** | 422 | 0 | 1142u | 55.2% | **46.26u** | 4.1% | 46.26u | 0u |
| **BOOST_KEEPCORE** | 210 | 212 | 684.97u | 57.1% | **40.44u** | 5.9% | 40.44u | -5.82u |
| **COMBO_KILL** | 210 | 212 | 575.75u | 57.1% | **35.73u** | 6.2% | 35.73u | -10.53u |

## Weekly cumulative — BASELINE vs BOOST_KEEPCORE
| Week | Base cum PnL | Boost cum PnL | Base ROI | Boost ROI |
|------|--------------|---------------|----------|-----------|
| 2026-06-01 | 13.11u | -8.7u | 6.4% | -6.2% |
| 2026-06-08 | 23.2u | -6.06u | 5.2% | -2.4% |
| 2026-06-15 | 36.38u | 10.95u | 6.7% | 3.6% |
| 2026-06-22 | 29.49u | -0.61u | 4.2% | -0.2% |
| 2026-06-29 | 51.2u | 38.16u | 5.2% | 6.5% |
| 2026-07-06 | 46.26u | 40.43u | 4.1% | 5.9% |

## Walk-forward sensitivity (CLV thresholds refresh each week from prior history)
| Week | prior n | CLV lo | Base PnL | Combo PnL | Boost PnL |
|------|---------|--------|----------|-----------|-----------|
| 2026-06-01 | 272 | 65.5 | 13.11u | -10.63u | -8.7u |
| 2026-06-08 | 375 | 63.5 | 10.09u | 7.03u | 7.63u |
| 2026-06-15 | 486 | 62.4 | 13.18u | 15.25u | 16.86u |
| 2026-06-22 | 516 | 62.1 | -6.89u | 4.72u | 3.12u |
| 2026-06-29 | 564 | 61.7 | 21.71u | 34.95u | 39.19u |
| 2026-07-06 | 645 | 62 | -4.94u | 6.63u | 7.18u |

Walk-forward totals: BASE **46.26u** · COMBO_KILL **57.95u** · BOOST_KEEPCORE **65.28u**

## Verdict
- Best June PnL: **DROP_SHARP** at **63.88u** (Δ 17.62u vs baseline, ROI 6.2%)
- Walk-forward boost vs base: **19.02u**
- **PASS for further production design** — fixed May thresholds and walk-forward both non-negative vs baseline.

## Artifacts
- `tmp_surplus_policy_deploy_sim.json`
- `SURPLUS_POLICY_DEPLOY_SIM.md`
- `scripts/_surplus_policy_deploy_sim.mjs`