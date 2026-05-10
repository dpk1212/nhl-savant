# WALLET PREDICTIVENESS BACKTEST

Generated: **2026-04-30T20:28:11.858Z** · sample window starts 2026-04-18

Counterfactual replay of every Sharp Intel lock decision since the v6 cutover under seven Δw rules informed by `WALLET_FEATURE_PREDICTIVENESS.md`. Each rule is evaluated under two lenses to control for lookahead bias.

---
## §1. Sample inventory

| Bucket | N |
|---|---|
| Total graded sides | 231 |
| Shipped under v7 (inDashboard) | 112 |
| Cancelled / muted / superseded / shadow | 119 |
| Sports | MLB · NBA · NHL |
| Markets | ML · SPREAD · TOTAL |
| Date range | 2026-04-18 → 2026-04-30 |

### §1.1 Status-quo (v7) baseline

| Metric | Value |
|---|---|
| Shipped picks (LOCKED, peakStars ≥ 2.5) | 112 |
| Win rate | 45.0% (50-61-1) |
| Flat 1u ROI | -9.7% (-10.75u total) |
| Peak-unit PnL | -12.73u |

### §1.2 Status-quo per sport

| Sport | N | WR | Flat ROI | Peak-u PnL |
|---|---|---|---|---|
| MLB | 42 | 38.1% | -24.9% | -9.36u |
| NBA | 56 | 45.5% | -7.8% | -7.37u |
| NHL | 14 | 64.3% | +28.5% | +4.00u |

---
## §2. Per-config aggregate (both lenses)

"Shipped" = the set of sides this config would have allowed onto the dashboard (after the same health gates v7 applies). Status-quo row is identical across lenses.

### L1 — today's tiers (upper bound)

| Config | Shipped N | WR | ΔWR vs v7 | Flat ROI | ΔROI vs v7 | Peak-u PnL | Volume change |
|---|---|---|---|---|---|---|---|
| `v7_status_quo` | 112 | 45.0% | +0.0% | -9.7% | +0.0% | -12.73u | +0.0% |
| `A_drop_flat` | 19 | 68.4% | +23.4% | +58.4% | +68.1% | +10.64u | -83.0% |
| `B_hc_weight` | 24 | 70.8% | +25.8% | +53.5% | +63.2% | +14.56u | -78.6% |
| `AB_combined` | 24 | 70.8% | +25.8% | +53.5% | +63.2% | +14.56u | -78.6% |
| `R1_pure_count` | 17 | 81.3% | +36.2% | +92.8% | +102.5% | +17.10u | -84.8% |
| `R2_pure_hc` | 28 | 71.4% | +26.4% | +41.6% | +51.3% | +16.64u | -75.0% |
| `R3_replace` | 35 | 73.5% | +28.5% | +53.2% | +62.9% | +25.46u | -68.8% |

### L2 — point-in-time tiers (the honest one)

| Config | Shipped N | WR | ΔWR vs v7 | Flat ROI | ΔROI vs v7 | Peak-u PnL | Volume change |
|---|---|---|---|---|---|---|---|
| `v7_status_quo` | 112 | 45.0% | +0.0% | -9.7% | +0.0% | -12.73u | +0.0% |
| `A_drop_flat` | 22 | 68.2% | +23.1% | +31.8% | +41.5% | +10.91u | -80.4% |
| `B_hc_weight` | 27 | 63.0% | +17.9% | +20.0% | +29.6% | +8.22u | -75.9% |
| `AB_combined` | 27 | 63.0% | +17.9% | +20.0% | +29.6% | +8.22u | -75.9% |
| `R1_pure_count` | 36 | 61.1% | +16.1% | +17.6% | +27.3% | +14.21u | -67.9% |
| `R2_pure_hc` | 27 | 70.4% | +25.3% | +36.1% | +45.8% | +15.83u | -75.9% |
| `R3_replace` | 44 | 59.1% | +14.0% | +13.6% | +23.3% | +13.01u | -60.7% |

### §2.3 Per-sport breakdown (L2 only — the trustworthy lens)

#### `A_drop_flat`

| Sport | N | WR | ΔWR vs v7 | Flat ROI | ΔROI vs v7 | Vol Δ |
|---|---|---|---|---|---|---|
| MLB | 7 | 57.1% | +19.0% | +5.0% | +30.0% | -83.3% |
| NBA | 15 | 73.3% | +27.9% | +44.3% | +52.0% | -73.2% |
| NHL | 0 | — | — | — | — | -100.0% |

#### `B_hc_weight`

| Sport | N | WR | ΔWR vs v7 | Flat ROI | ΔROI vs v7 | Vol Δ |
|---|---|---|---|---|---|---|
| MLB | 9 | 55.6% | +17.5% | +4.5% | +29.4% | -78.6% |
| NBA | 18 | 66.7% | +21.2% | +27.7% | +35.5% | -67.9% |
| NHL | 0 | — | — | — | — | -100.0% |

#### `AB_combined`

| Sport | N | WR | ΔWR vs v7 | Flat ROI | ΔROI vs v7 | Vol Δ |
|---|---|---|---|---|---|---|
| MLB | 9 | 55.6% | +17.5% | +4.5% | +29.4% | -78.6% |
| NBA | 18 | 66.7% | +21.2% | +27.7% | +35.5% | -67.9% |
| NHL | 0 | — | — | — | — | -100.0% |

#### `R1_pure_count`

| Sport | N | WR | ΔWR vs v7 | Flat ROI | ΔROI vs v7 | Vol Δ |
|---|---|---|---|---|---|---|
| MLB | 16 | 43.8% | +5.7% | -16.7% | +8.2% | -61.9% |
| NBA | 18 | 72.2% | +26.8% | +37.8% | +45.6% | -67.9% |
| NHL | 2 | 100.0% | +35.7% | +109.8% | +81.3% | -85.7% |

#### `R2_pure_hc`

| Sport | N | WR | ΔWR vs v7 | Flat ROI | ΔROI vs v7 | Vol Δ |
|---|---|---|---|---|---|---|
| MLB | 12 | 66.7% | +28.6% | +30.0% | +55.0% | -71.4% |
| NBA | 15 | 73.3% | +27.9% | +41.0% | +48.8% | -73.2% |
| NHL | 0 | — | — | — | — | -100.0% |

#### `R3_replace`

| Sport | N | WR | ΔWR vs v7 | Flat ROI | ΔROI vs v7 | Vol Δ |
|---|---|---|---|---|---|---|
| MLB | 20 | 45.0% | +6.9% | -13.0% | +12.0% | -52.4% |
| NBA | 22 | 68.2% | +22.7% | +29.0% | +36.8% | -60.7% |
| NHL | 2 | 100.0% | +35.7% | +109.8% | +81.3% | -85.7% |

---
## §3. Confusion matrices vs v7 status quo (L2)

"AVOIDED" = picks v7 shipped that this config would have killed. Low WR here = real losers we'd dodge. "PROMOTED" = picks v7 didn't ship that this config would. High WR here = hidden winners we'd find.

### `A_drop_flat`

| Transition | N | WR | Flat ROI | Net flat |
|---|---|---|---|---|
| PRESERVED (shipped in both) | 22 | 68.2% | +31.8% | +6.99u |
| AVOIDED (shipped in v7 only) | 90 | 39.3% | -19.9% | -17.74u |
| PROMOTED (shipped in cfg only) | 0 | — | — | +0.00u |

### `B_hc_weight`

| Transition | N | WR | Flat ROI | Net flat |
|---|---|---|---|---|
| PRESERVED (shipped in both) | 27 | 63.0% | +20.0% | +5.39u |
| AVOIDED (shipped in v7 only) | 85 | 39.3% | -19.2% | -16.14u |
| PROMOTED (shipped in cfg only) | 0 | — | — | +0.00u |

### `AB_combined`

| Transition | N | WR | Flat ROI | Net flat |
|---|---|---|---|---|
| PRESERVED (shipped in both) | 27 | 63.0% | +20.0% | +5.39u |
| AVOIDED (shipped in v7 only) | 85 | 39.3% | -19.2% | -16.14u |
| PROMOTED (shipped in cfg only) | 0 | — | — | +0.00u |

### `R1_pure_count`

| Transition | N | WR | Flat ROI | Net flat |
|---|---|---|---|---|
| PRESERVED (shipped in both) | 36 | 61.1% | +17.6% | +6.33u |
| AVOIDED (shipped in v7 only) | 76 | 37.3% | -22.8% | -17.08u |
| PROMOTED (shipped in cfg only) | 0 | — | — | +0.00u |

### `R2_pure_hc`

| Transition | N | WR | Flat ROI | Net flat |
|---|---|---|---|---|
| PRESERVED (shipped in both) | 27 | 70.4% | +36.1% | +9.76u |
| AVOIDED (shipped in v7 only) | 85 | 36.9% | -24.4% | -20.51u |
| PROMOTED (shipped in cfg only) | 0 | — | — | +0.00u |

### `R3_replace`

| Transition | N | WR | Flat ROI | Net flat |
|---|---|---|---|---|
| PRESERVED (shipped in both) | 44 | 59.1% | +13.6% | +5.99u |
| AVOIDED (shipped in v7 only) | 68 | 35.8% | -25.0% | -16.74u |
| PROMOTED (shipped in cfg only) | 0 | — | — | +0.00u |

---
## §4. Pick-level diff — biggest L2 transitions

### `AB_combined` — AVOIDED picks (v7 shipped, cfg would kill)

| Date | Sport | Mkt | Pick | Outcome | Profit | v7 Δw/Δq | cfg Δw |
|---|---|---|---|---|---|---|---|
| 2026-04-18 | NBA | ML | `2026-04-18_NBA_atl_nyk` away | LOSS | -0.50u | +0/+0 | +0 |
| 2026-04-19 | MLB | ML | `2026-04-19_MLB_tbr_pit` away | LOSS | -1.00u | +0/+1 | +2 |
| 2026-04-20 | MLB | ML | `2026-04-20_MLB_hou_cle` home | LOSS | -1.00u | +2/+2 | +1 |
| 2026-04-20 | NBA | ML | `2026-04-20_NBA_atl_nyk` home | LOSS | -1.00u | -1/-4 | +0 |
| 2026-04-20 | NBA | ML | `2026-04-20_NBA_min_den` home | LOSS | -1.00u | +0/+2 | +0 |
| 2026-04-20 | NBA | ML | `2026-04-20_NBA_tor_cle` away | LOSS | -0.50u | +2/+3 | +0 |
| 2026-04-20 | NHL | ML | `2026-04-20_NHL_ana_edm` away | LOSS | -1.50u | -2/+3 | -1 |
| 2026-04-21 | MLB | ML | `2026-04-21_MLB_oak_sea` home | LOSS | -0.75u | +0/+1 | +0 |
| 2026-04-21 | MLB | ML | `2026-04-21_MLB_pit_tex` away | LOSS | -1.50u | +1/+3 | +0 |
| 2026-04-21 | MLB | ML | `2026-04-21_MLB_stl_mia` home | LOSS | -1.25u | +2/+2 | +1 |
| 2026-04-21 | NBA | ML | `2026-04-21_NBA_hou_lal` away | LOSS | -3.00u | +1/+2 | +1 |
| 2026-04-21 | NBA | ML | `2026-04-21_NBA_phi_bos` home | LOSS | -0.50u | -3/+1 | -3 |
| 2026-04-22 | MLB | ML | `2026-04-22_MLB_hou_cle` home | LOSS | -0.50u | -1/+0 | -1 |
| 2026-04-22 | MLB | ML | `2026-04-22_MLB_lad_sfg` away | LOSS | -1.00u | +0/+1 | +0 |
| 2026-04-22 | MLB | ML | `2026-04-22_MLB_tor_laa` away | LOSS | -1.10u | +1/+1 | +0 |
| 2026-04-22 | NHL | ML | `2026-04-22_NHL_ana_edm` home | LOSS | -0.50u | +1/+2 | +0 |
| 2026-04-23 | MLB | ML | `2026-04-23_MLB_cws_ari` home | LOSS | -1.00u | +1/+3 | +0 |
| 2026-04-23 | NHL | ML | `2026-04-23_NHL_col_lak` home | LOSS | -1.35u | +0/+1 | -1 |
| 2026-04-24 | NBA | ML | `2026-04-24_NBA_sas_por` home | LOSS | -2.00u | +2/+5 | +0 |
| 2026-04-25 | MLB | ML | `2026-04-25_MLB_cle_tor` away | LOSS | -0.75u | +1/+1 | +0 |
| 2026-04-25 | NBA | ML | `2026-04-25_NBA_den_min` away | LOSS | -3.00u | +0/+1 | -1 |
| 2026-04-25 | NHL | ML | `2026-04-25_NHL_dal_min` away | LOSS | -0.75u | +1/+2 | +0 |
| 2026-04-25 | NHL | ML | `2026-04-25_NHL_pit_phi` home | LOSS | -3.00u | +2/+3 | +1 |
| 2026-04-26 | MLB | ML | `2026-04-26_MLB_chc_lad` away | LOSS | -0.75u | +1/+1 | +0 |
| 2026-04-26 | MLB | ML | `2026-04-26_MLB_det_cin` home | LOSS | -0.75u | +1/+1 | +0 |

### `AB_combined` — PROMOTED picks (cfg ships, v7 didn't)

| Date | Sport | Mkt | Pick | Outcome | Flat | v7 Δw/Δq | cfg Δw |
|---|---|---|---|---|---|---|---|

### `R3_replace` — AVOIDED picks (v7 shipped, cfg would kill)

| Date | Sport | Mkt | Pick | Outcome | Profit | v7 Δw/Δq | cfg Δw |
|---|---|---|---|---|---|---|---|
| 2026-04-18 | NBA | ML | `2026-04-18_NBA_atl_nyk` away | LOSS | -0.50u | +0/+0 | +0 |
| 2026-04-20 | MLB | ML | `2026-04-20_MLB_hou_cle` home | LOSS | -1.00u | +2/+2 | +1 |
| 2026-04-20 | NBA | ML | `2026-04-20_NBA_atl_nyk` home | LOSS | -1.00u | -1/-4 | +0 |
| 2026-04-20 | NBA | ML | `2026-04-20_NBA_min_den` home | LOSS | -1.00u | +0/+2 | +0 |
| 2026-04-20 | NBA | ML | `2026-04-20_NBA_tor_cle` away | LOSS | -0.50u | +2/+3 | +1 |
| 2026-04-20 | NHL | ML | `2026-04-20_NHL_ana_edm` away | LOSS | -1.50u | -2/+3 | -1 |
| 2026-04-21 | MLB | ML | `2026-04-21_MLB_oak_sea` home | LOSS | -0.75u | +0/+1 | +0 |
| 2026-04-21 | MLB | ML | `2026-04-21_MLB_pit_tex` away | LOSS | -1.50u | +1/+3 | +0 |
| 2026-04-21 | MLB | ML | `2026-04-21_MLB_stl_mia` home | LOSS | -1.25u | +2/+2 | +1 |
| 2026-04-21 | NBA | ML | `2026-04-21_NBA_hou_lal` away | LOSS | -3.00u | +1/+2 | +1 |
| 2026-04-21 | NBA | ML | `2026-04-21_NBA_phi_bos` home | LOSS | -0.50u | -3/+1 | -2 |
| 2026-04-22 | MLB | ML | `2026-04-22_MLB_hou_cle` home | LOSS | -0.50u | -1/+0 | -1 |
| 2026-04-22 | MLB | ML | `2026-04-22_MLB_lad_sfg` away | LOSS | -1.00u | +0/+1 | +0 |
| 2026-04-22 | MLB | ML | `2026-04-22_MLB_tor_laa` away | LOSS | -1.10u | +1/+1 | +1 |
| 2026-04-22 | NHL | ML | `2026-04-22_NHL_ana_edm` home | LOSS | -0.50u | +1/+2 | +0 |
| 2026-04-23 | MLB | ML | `2026-04-23_MLB_cws_ari` home | LOSS | -1.00u | +1/+3 | +0 |
| 2026-04-23 | NHL | ML | `2026-04-23_NHL_col_lak` home | LOSS | -1.35u | +0/+1 | -1 |
| 2026-04-24 | NBA | ML | `2026-04-24_NBA_sas_por` home | LOSS | -2.00u | +2/+5 | +0 |
| 2026-04-25 | MLB | ML | `2026-04-25_MLB_cle_tor` away | LOSS | -0.75u | +1/+1 | +0 |
| 2026-04-25 | NBA | ML | `2026-04-25_NBA_den_min` away | LOSS | -3.00u | +0/+1 | -1 |
| 2026-04-25 | NHL | ML | `2026-04-25_NHL_dal_min` away | LOSS | -0.75u | +1/+2 | +0 |
| 2026-04-25 | NHL | ML | `2026-04-25_NHL_pit_phi` home | LOSS | -3.00u | +2/+3 | +1 |
| 2026-04-26 | MLB | ML | `2026-04-26_MLB_chc_lad` away | LOSS | -0.75u | +1/+1 | +0 |
| 2026-04-26 | MLB | ML | `2026-04-26_MLB_det_cin` home | LOSS | -0.75u | +1/+1 | +0 |
| 2026-04-28 | MLB | ML | `2026-04-28_MLB_nyy_tex` home | LOSS | -2.00u | +3/+3 | +1 |

### `R3_replace` — PROMOTED picks (cfg ships, v7 didn't)

| Date | Sport | Mkt | Pick | Outcome | Flat | v7 Δw/Δq | cfg Δw |
|---|---|---|---|---|---|---|---|

---
## §5. REPLACE-arm threshold sweep (L2)

Sweeps the pure-tier-count rule across thresholds to find the WR / volume sweet spot.

| Rule | N | WR | Flat ROI | Vol vs v7 |
|---|---|---|---|---|
| (CONF_for − CONF_ag) ≥ 1 | 62 | 54.8% | +5.7% | -44.6% |
| (CONF_for − CONF_ag) ≥ 2 | 36 | 61.1% | +17.6% | -67.9% |
| (CONF_for − CONF_ag) ≥ 3 | 11 | 63.6% | +29.7% | -90.2% |
| HC_for ≥ 1 ∧ HC_ag = 0 | 27 | 70.4% | +36.1% | -75.9% |
| HC_for ≥ 2 ∧ HC_ag = 0 | 10 | 80.0% | +63.8% | -91.1% |
| (CONF_for − CONF_ag) ≥ 1  OR  (HC_for ≥ 1 ∧ HC_ag=0) | 64 | 54.7% | +5.6% | -42.9% |
| (CONF_for − CONF_ag) ≥ 2  OR  (HC_for ≥ 1 ∧ HC_ag=0) | 44 | 59.1% | +13.6% | -60.7% |
| (CONF_for − CONF_ag) ≥ 3  OR  (HC_for ≥ 1 ∧ HC_ag=0) | 29 | 65.5% | +26.8% | -74.1% |

---
## §6. Bias diagnostic — L1 vs L2 tier-mismatch

For each pick we count how many contributors had a different tier on the pick date than they do today. If this is small, L1 ≈ L2 and we can trust either lens.

| Bucket | N contributors | % |
|---|---|---|
| Same tier under L1 and L2 | 367 | 40.2% |
| L1 > L2 (today's tier higher → lookahead bias upward) | 113 | 12.4% |
| L1 < L2 (wallet decayed since the pick) | 432 | 47.4% |

Total contributor rows: 912.

---
## §7. Decision applied (pre-registered rule)

| Config | Arm | Verdict | Gates |
|---|---|---|---|
| `A_drop_flat` | TIGHTEN | KILL | ✅ AVOIDED bucket WR ≤ 45%: 39.3%<br/>✅ Net WR delta ≥ +2pp: +23.1%<br/>❌ Volume drop ≤ 30%: -80.4% |
| `B_hc_weight` | LOOSEN | KILL | ❌ PROMOTED bucket WR ≥ 56%: no promoted picks<br/>✅ Net WR delta ≥ +1.5pp: +17.9% |
| `AB_combined` | TIGHTEN | KILL | ✅ AVOIDED bucket WR ≤ 45%: 39.3%<br/>✅ Net WR delta ≥ +2pp: +17.9%<br/>❌ Volume drop ≤ 30%: -75.9% |
| `R1_pure_count` | REPLACE | KILL | ✅ LOCKED WR ≥ 55%: 61.1%<br/>✅ Flat ROI ≥ +5%: +17.6%<br/>❌ Volume within ±50% of v7: -67.9%<br/>✅ Holds in ≥ 2 of 3 sports: 3/3 sports |
| `R2_pure_hc` | REPLACE | KILL | ✅ LOCKED WR ≥ 55%: 70.4%<br/>✅ Flat ROI ≥ +5%: +36.1%<br/>❌ Volume within ±50% of v7: -75.9%<br/>✅ Holds in ≥ 2 of 3 sports: 2/2 sports |
| `R3_replace` | REPLACE | KILL | ✅ LOCKED WR ≥ 55%: 59.1%<br/>✅ Flat ROI ≥ +5%: +13.6%<br/>❌ Volume within ±50% of v7: -60.7%<br/>✅ Holds in ≥ 2 of 3 sports: 3/3 sports |

Verdict computed against L2 (point-in-time) lens.

---
## §8. Notes & caveats

- Sample window since v6 cutover. WR / ROI confidence bands at this sample size are wide (±5–7pp at N=80–100); treat marginal verdicts with appropriate skepticism.
- Δq calculation is unchanged from v7 — based on contribution ≥ T30 cut. Only Δw inputs mutate across configs (or are ignored entirely in REPLACE).
- Health gates (CANCELLED, MUTED, superseded, SHADOW) always apply. We are backtesting promotion/lock decisions, not the mute engine.
- "Today's tiers" lens uses the current `sharpWalletProfiles` snapshot. "Point-in-time" lens replays Source A + B chronologically and stamps `firstFlatDate`, `firstConfirmedDate`, `firstWR50Date` per (wallet × sport).
- HC threshold = `sizeRatio ≥ 1.5×` (= `betMultiplier ≥ 1.5`). HC-CONFIRMED contributes 2 to Δw (counted as both CONFIRMED and HC).
