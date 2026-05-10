# FLOOR-LOWERING WITH WALLET-TIER GATES

Generated: 4/30/2026, 4:41:57 PM ET · sample 111 graded sides · 2026-04-18 → 2026-04-30 (13 days)

**Question.** The vault analysis showed CONFIRMED wallets win at 59.3% / +9.7pp lift, while FLAT wallets bleed at 43.6% / −5.1pp lift. HC-CONFIRMED wallets (sizeRatio ≥ 1.5×) hit 63–70% WR. Does this give us enough signal to lower the v7.0 LOCK floor from `Σ ≥ +5` to `Σ ≥ +3` or `Σ ≥ +4` for picks where the wallet composition is favourable?

**Lens.** All tier evaluations use POINT-IN-TIME tiers from chronological replay — the L2 lens validated in `WALLET_PREDICTIVENESS_BACKTEST.md`. Δw and Δq are recomputed under L2 tiers from the frozen walletDetails on each pick.

**Inclusion rule** mirrors live Pick Performance dashboard. WR shown with Wilson 95% CI; ✓ = t-test vs zero clears p < 0.05.

---
## §1. Reference cohorts (under L2 tiers)

| Cohort | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |
|---|---|---|---|---|---|---|
| v7.0 LOCK baseline (Σ ≥ +5) | 34 | 61.8% (45.0%–76.1%) | +35.7% | +9.61u | 1.56 | 0.118 |
| Σ = +5 alone | 10 | 70.0% (39.7%–89.2%) | +79.8% | +6.32u | 1.48 | 0.139 |
| Σ ≥ +6 alone | 24 | 58.3% (38.8%–75.5%) | +17.4% | +3.29u | 0.75 | 0.453 |
| Σ = +4 LEAN cell | 19 | 36.8% (19.1%–59.0%) | -35.0% | -8.64u | -1.71 | 0.087 |
| Σ = +3 LEAN cell | 16 | 62.5% (38.6%–81.5%) | +23.0% | +5.73u | 0.91 | 0.365 |
| Σ ∈ {3, 4} (full LEAN cohort) | 35 | 48.6% (33.0%–64.4%) | -8.5% | -2.91u | -0.51 | 0.609 |

Note. Δw_legacy here is recomputed under L2 (point-in-time) tiers from frozen walletDetails. This may differ slightly from the dwFrozen stamp, which used the live profiles cache at lock time. Σ values in the L2 lens reflect what each pick *actually represented* given the wallets' state on the pick date.

---
## §2. Tier composition of LEAN cells (Σ ∈ {3, 4})

| Cohort | N | CONFIRMED for/ag | FLAT for/ag | HC-CONF for/ag | ≥1 CONF backing | ≥2 CONF backing | ≥1 HC backing | CONF backing & 0 FLAT |
|---|---|---|---|---|---|---|---|---|
| Σ ∈ {3,4} | 35 | 47/9 | 26/8 | 12/2 | 28 (80.0%) | 12 (34.3%) | 10 (28.6%) | 13 (37.1%) |
| Σ = +3 | 16 | 24/4 | 5/4 | 4/1 | 14 (87.5%) | 8 (50.0%) | 3 (18.8%) | 11 (68.8%) |
| Σ = +4 | 19 | 23/5 | 21/4 | 8/1 | 14 (73.7%) | 4 (21.1%) | 7 (36.8%) | 2 (10.5%) |

---
## §3. Tier-based rescue gates

Each gate filters the LEAN cohort to a wallet-composition subset. Useful gate: holds N ≥ 6, lifts flat ROI > 0, ideally clears p < 0.05.

### §3.a Σ ∈ {3, 4} pooled

| Gate | Description | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |
|---|---|---|---|---|---|---|---|
| (none) | full cohort | 35 | 48.6% (33.0%–64.4%) | -8.5% | -2.91u | -0.51 | 0.609 |
| G1 | CONFIRMED_for ≥ 1 | 28 | 46.4% (29.5%–64.2%) | -14.3% | -2.53u | -0.78 | 0.435 |
| G2 | CONFIRMED_for ≥ 2 | 12 | 41.7% (19.3%–68.0%) | -22.6% | +2.61u | -0.78 | 0.436 |
| G3 | (CONF_for − CONF_ag) ≥ 1 | 24 | 50.0% (31.4%–68.6%) | -8.5% | -0.05u | -0.43 | 0.668 |
| G4 | (CONF_for − CONF_ag) ≥ 2 | 10 | 50.0% (23.7%–76.3%) | -7.1% | +3.61u | -0.22 | 0.828 |
| G5 | HC_CONFIRMED_for ≥ 1 | 10 | 60.0% (31.3%–83.2%) | +0.9% | -0.05u | 0.03 | 0.975 |
| G6 | HC_CONFIRMED_for ≥ 1 ∧ HC_CONFIRMED_ag = 0 | 9 | 66.7% (35.4%–87.9%) | +12.1% | +0.70u | 0.40 | 0.686 |
| G7 | CONFIRMED_for ≥ 1 ∧ FLAT_for = 0 | 13 | 61.5% (35.5%–82.3%) | +13.3% | +2.76u | 0.49 | 0.624 |
| G8 | CONFIRMED_for ≥ 1 ∧ CONFIRMED_ag = 0 | 22 | 50.0% (30.7%–69.3%) | -6.2% | -0.55u | -0.29 | 0.768 |
| G9 | (CONF_for − CONF_ag) ≥ 1  OR  HC dominance | 25 | 52.0% (33.5%–70.0%) | -4.0% | +0.47u | -0.20 | 0.838 |
| G10 | (CONF_for − CONF_ag) ≥ 2  OR  HC dominance | 14 | 57.1% (32.6%–78.6%) | +5.1% | +2.94u | 0.19 | 0.850 |

### §3.b Σ = +4 alone

| Gate | Description | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |
|---|---|---|---|---|---|---|---|
| (none) | full cohort | 19 | 36.8% (19.1%–59.0%) | -35.0% | -8.64u | -1.71 | 0.087 |
| G1 | CONFIRMED_for ≥ 1 | 14 | 28.6% (11.7%–54.6%) | -52.9% ✓ | -7.75u | -2.50 | 0.012 |
| G2 | CONFIRMED_for ≥ 2 | 4 | 25.0% (4.6%–69.9%) | -66.7% ✓ | -0.50u | -2.00 | 0.046 |
| G3 | (CONF_for − CONF_ag) ≥ 1 | 12 | 33.3% (13.8%–60.9%) | -45.1% | -5.25u | -1.88 | 0.061 |
| G4 | (CONF_for − CONF_ag) ≥ 2 | 3 | 33.3% (6.1%–79.2%) | -55.6% | -0.00u | -1.25 | 0.211 |
| G5 | HC_CONFIRMED_for ≥ 1 | 7 | 42.9% (15.8%–75.0%) | -32.6% | -1.94u | -0.99 | 0.323 |
| G6 | HC_CONFIRMED_for ≥ 1 ∧ HC_CONFIRMED_ag = 0 | 6 | 50.0% (18.8%–81.2%) | -21.4% | -1.19u | -0.58 | 0.560 |
| G7 | CONFIRMED_for ≥ 1 ∧ FLAT_for = 0 | 2 | 50.0% (9.5%–90.5%) | -33.3% | +0.50u | -0.50 | 0.617 |
| G8 | CONFIRMED_for ≥ 1 ∧ CONFIRMED_ag = 0 | 10 | 30.0% (10.8%–60.3%) | -47.5% | -5.75u | -1.74 | 0.082 |
| G9 | (CONF_for − CONF_ag) ≥ 1  OR  HC dominance | 12 | 33.3% (13.8%–60.9%) | -45.1% | -5.25u | -1.88 | 0.061 |
| G10 | (CONF_for − CONF_ag) ≥ 2  OR  HC dominance | 6 | 50.0% (18.8%–81.2%) | -21.4% | -1.19u | -0.58 | 0.560 |

### §3.c Σ = +3 alone

| Gate | Description | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |
|---|---|---|---|---|---|---|---|
| (none) | full cohort | 16 | 62.5% (38.6%–81.5%) | +23.0% | +5.73u | 0.91 | 0.365 |
| G1 | CONFIRMED_for ≥ 1 | 14 | 64.3% (38.8%–83.7%) | +24.4% | +5.22u | 0.92 | 0.358 |
| G2 | CONFIRMED_for ≥ 2 | 8 | 50.0% (21.5%–78.5%) | -0.6% | +3.11u | -0.02 | 0.988 |
| G3 | (CONF_for − CONF_ag) ≥ 1 | 12 | 66.7% (39.1%–86.2%) | +28.2% | +5.20u | 0.99 | 0.322 |
| G4 | (CONF_for − CONF_ag) ≥ 2 | 7 | 57.1% (25.0%–84.2%) | +13.6% | +3.61u | 0.32 | 0.748 |
| G5 | HC_CONFIRMED_for ≥ 1 | 3 | 100.0% (43.8%–100.0%) | +79.1% ✓ | +1.89u | 3.11 | 0.002 |
| G6 | HC_CONFIRMED_for ≥ 1 ∧ HC_CONFIRMED_ag = 0 | 3 | 100.0% (43.8%–100.0%) | +79.1% ✓ | +1.89u | 3.11 | 0.002 |
| G7 | CONFIRMED_for ≥ 1 ∧ FLAT_for = 0 | 11 | 63.6% (35.4%–84.8%) | +21.8% | +2.26u | 0.72 | 0.472 |
| G8 | CONFIRMED_for ≥ 1 ∧ CONFIRMED_ag = 0 | 12 | 66.7% (39.1%–86.2%) | +28.2% | +5.20u | 0.99 | 0.322 |
| G9 | (CONF_for − CONF_ag) ≥ 1  OR  HC dominance | 13 | 69.2% (42.4%–87.3%) | +34.0% | +5.72u | 1.27 | 0.204 |
| G10 | (CONF_for − CONF_ag) ≥ 2  OR  HC dominance | 8 | 62.5% (30.6%–86.3%) | +24.9% | +4.13u | 0.65 | 0.516 |

---
## §4. Combined-floor projections

Each row is a candidate v7.1 LOCK rule. "lift vs v7.0" = (flat ROI − v7.0 baseline flat ROI). The shipped slate is everything that meets the rule.

| Floor rule | N | WR (95% CI) | Flat ROI | Peak PnL | t | p | lift vs v7.0 |
|---|---|---|---|---|---|---|---|
| v7.0 baseline (Σ ≥ +5) | 34 | 61.8% (45.0%–76.1%) | +35.7% | +9.61u | 1.56 | 0.118 | +0.0% |
| Σ ≥ +5 OR (Σ = +4 ∧ G3: net CONFIRMED ≥ +1) | 46 | 54.3% (40.2%–67.8%) | +14.6% | +4.36u | 0.79 | 0.432 | -21.1% |
| Σ ≥ +5 OR (Σ = +4 ∧ G4: net CONFIRMED ≥ +2) | 37 | 59.5% (43.5%–73.7%) | +28.3% | +9.61u | 1.31 | 0.189 | -7.4% |
| Σ ≥ +5 OR (Σ = +4 ∧ G6: HC dominance) | 40 | 60.0% (44.6%–73.7%) | +27.2% | +8.42u | 1.34 | 0.180 | -8.6% |
| Σ ≥ +5 OR (Σ = +4 ∧ G7: CONF ≥ 1, no FLAT) | 36 | 61.1% (44.9%–75.2%) | +31.9% | +10.11u | 1.46 | 0.145 | -3.8% |
| Σ ≥ +5 OR (Σ = +4 ∧ G9: CONF≥1 OR HC dominance) | 46 | 54.3% (40.2%–67.8%) | +14.6% | +4.36u | 0.79 | 0.432 | -21.1% |
| Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G3: net CONFIRMED ≥ +1) | 58 | 56.9% (44.1%–68.8%) | +17.4% | +9.55u | 1.10 | 0.270 | -18.3% |
| Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G4: net CONFIRMED ≥ +2) | 44 | 59.1% (44.4%–72.3%) | +26.0% | +13.22u | 1.35 | 0.175 | -9.7% |
| Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G6: HC dominance) | 43 | 62.8% (47.9%–75.6%) | +30.8% | +10.31u | 1.62 | 0.106 | -4.9% |
| Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G9) | 59 | 57.6% (44.9%–69.4%) | +18.9% | +10.07u | 1.21 | 0.226 | -16.8% |
| Σ ≥ +4 (no gate — fully lower) | 53 | 52.8% (39.7%–65.6%) | +10.4% | +0.97u | 0.61 | 0.539 | -25.3% |
| Σ ≥ +3 (no gate — fully lower) | 69 | 55.1% (43.4%–66.2%) | +13.3% | +6.69u | 0.94 | 0.348 | -22.4% |

---
## §5. Per-sport breakdown (most promising candidates)

### Σ ≥ +5 OR (Σ = +4 ∧ G6: HC dominance)

| Sport | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |
|---|---|---|---|---|---|---|
| MLB | 13 | 53.8% (29.1%–76.8%) | +5.6% | +3.10u | 0.19 | 0.846 |
| NBA | 24 | 62.5% (42.7%–78.8%) | +35.6% | +6.07u | 1.22 | 0.222 |
| NHL | 3 | 66.7% (20.8%–93.9%) | +53.3% | -0.75u | 0.69 | 0.488 |

### Σ ≥ +5 OR (Σ = +4 ∧ G3: net CONFIRMED ≥ +1)

| Sport | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |
|---|---|---|---|---|---|---|
| MLB | 17 | 41.2% (21.6%–64.0%) | -19.3% | -0.90u | -0.79 | 0.429 |
| NBA | 26 | 61.5% (42.5%–77.6%) | +32.4% | +6.00u | 1.18 | 0.239 |
| NHL | 3 | 66.7% (20.8%–93.9%) | +53.3% | -0.75u | 0.69 | 0.488 |

### Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G4: net CONFIRMED ≥ +2)

| Sport | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |
|---|---|---|---|---|---|---|
| MLB | 16 | 43.8% (23.1%–66.8%) | -14.2% | -0.15u | -0.56 | 0.577 |
| NBA | 24 | 66.7% (46.7%–82.0%) | +44.5% | +11.28u | 1.55 | 0.122 |
| NHL | 4 | 75.0% (30.1%–95.4%) | +75.5% | +2.09u | 1.29 | 0.198 |

### Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G6: HC dominance)

| Sport | N | WR (95% CI) | Flat ROI | Peak PnL | t | p |
|---|---|---|---|---|---|---|
| MLB | 15 | 60.0% (35.7%–80.2%) | +18.7% | +4.15u | 0.72 | 0.474 |
| NBA | 25 | 64.0% (44.5%–79.8%) | +35.3% | +6.91u | 1.26 | 0.207 |
| NHL | 3 | 66.7% (20.8%–93.9%) | +53.3% | -0.75u | 0.69 | 0.488 |

---
## §6. Pick-level diff — newly admitted Σ=+4 picks under each gate

What the gates would actually promote from LEAN → LOCKED, and how those picks performed.

### G3: (CONF_for − CONF_ag) ≥ 1

| Date | Sport | Mkt | Pick | Σ | (Δw, Δq) | CONF for/ag | HC for/ag | Outcome | Flat | Peak |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-18 | MLB | TOTAL | `2026-04-18_MLB_bal_cle_total` under | 3 | (2, 1) | 2/0 | 2/0 | WIN | +1.05 | +0.52u |
| 2026-04-18 | MLB | TOTAL | `2026-04-18_MLB_sfg_wsh_total` under | 3 | (2, 1) | 2/0 | 0/0 | LOSS | -1.00 | -0.50u |
| 2026-04-20 | MLB | ML | `2026-04-20_MLB_hou_cle` home | 4 | (2, 2) | 1/0 | 0/0 | LOSS | -1.00 | -1.00u |
| 2026-04-20 | NBA | TOTAL | `2026-04-20_NBA_min_den_total` over | 4 | (2, 2) | 1/0 | 0/0 | WIN | +0.87 | +0.43u |
| 2026-04-20 | NHL | TOTAL | `2026-04-20_NHL_ana_edm_total` over | 3 | (1, 2) | 1/0 | 0/0 | WIN | +0.75 | +0.38u |
| 2026-04-21 | MLB | ML | `2026-04-21_MLB_stl_mia` home | 4 | (2, 2) | 1/0 | 0/0 | LOSS | -1.00 | -1.25u |
| 2026-04-21 | NBA | ML | `2026-04-21_NBA_hou_lal` away | 3 | (1, 2) | 1/0 | 0/0 | LOSS | -1.00 | -3.00u |
| 2026-04-21 | MLB | TOTAL | `2026-04-21_MLB_phi_chc_total` under | 4 | (2, 2) | 1/0 | 0/0 | LOSS | -1.00 | -1.00u |
| 2026-04-24 | MLB | ML | `2026-04-24_MLB_laa_kcr` home | 3 | (1, 2) | 1/0 | 0/0 | WIN | +0.93 | +0.69u |
| 2026-04-24 | NBA | ML | `2026-04-24_NBA_bos_phi` away | 4 | (2, 2) | 6/2 | 2/0 | WIN | +0.33 | +1.00u |
| 2026-04-24 | NHL | ML | `2026-04-24_NHL_tbl_mtl` home | 3 | (2, 1) | 1/0 | 0/0 | WIN | +0.98 | +2.94u |
| 2026-04-25 | NBA | ML | `2026-04-25_NBA_det_orl` home | 3 | (2, 1) | 3/0 | 0/0 | WIN | +1.20 | +2.40u |
| 2026-04-26 | NBA | ML | `2026-04-26_NBA_bos_phi` away | 4 | (2, 2) | 1/0 | 1/0 | WIN | +0.34 | +1.03u |
| 2026-04-26 | NBA | ML | `2026-04-26_NBA_cle_tor` away | 4 | (2, 2) | 1/0 | 1/0 | LOSS | -1.00 | -3.00u |
| 2026-04-26 | MLB | TOTAL | `2026-04-26_MLB_col_nym_total` over | 4 | (2, 2) | 2/0 | 1/0 | LOSS | -1.00 | -0.50u |
| 2026-04-27 | MLB | ML | `2026-04-27_MLB_stl_pit` away | 4 | (2, 2) | 1/0 | 1/0 | WIN | +1.04 | +0.78u |
| 2026-04-28 | MLB | ML | `2026-04-28_MLB_ari_mil` home | 3 | (1, 2) | 1/0 | 0/0 | WIN | +0.77 | +0.58u |
| 2026-04-28 | MLB | ML | `2026-04-28_MLB_sea_min` home | 4 | (2, 2) | 1/0 | 0/0 | LOSS | -1.00 | -0.75u |
| 2026-04-28 | MLB | ML | `2026-04-28_MLB_sfg_phi` away | 3 | (1, 2) | 2/0 | 0/0 | LOSS | -1.00 | -2.00u |
| 2026-04-29 | NBA | ML | `2026-04-29_NBA_tor_cle` home | 3 | (1, 2) | 2/0 | 1/0 | WIN | +0.28 | +0.85u |
| 2026-04-29 | NHL | ML | `2026-04-29_NHL_mtl_tbl` away | 3 | (2, 1) | 2/0 | 0/0 | WIN | +1.42 | +2.84u |
| 2026-04-29 | NBA | SPREAD | `2026-04-29_NBA_hou_lal_spread` home | 4 | (2, 2) | 2/1 | 0/0 | LOSS | -1.00 | -0.50u |
| 2026-04-29 | MLB | TOTAL | `2026-04-29_MLB_wsh_nym_total` under | 4 | (2, 2) | 3/0 | 1/0 | LOSS | -1.00 | -0.50u |
| 2026-04-30 | MLB | ML | `2026-04-30_MLB_col_cin` away | 3 | (1, 2) | 2/0 | 0/0 | LOSS | -1.00 | -0.50u |

### G6: HC dominance

| Date | Sport | Mkt | Pick | Σ | (Δw, Δq) | CONF for/ag | HC for/ag | Outcome | Flat | Peak |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-18 | MLB | TOTAL | `2026-04-18_MLB_bal_cle_total` under | 3 | (2, 1) | 2/0 | 2/0 | WIN | +1.05 | +0.52u |
| 2026-04-20 | MLB | TOTAL | `2026-04-20_MLB_stl_mia_total` under | 3 | (1, 2) | 1/1 | 1/0 | WIN | +1.04 | +0.52u |
| 2026-04-24 | NBA | ML | `2026-04-24_NBA_bos_phi` away | 4 | (2, 2) | 6/2 | 2/0 | WIN | +0.33 | +1.00u |
| 2026-04-26 | NBA | ML | `2026-04-26_NBA_bos_phi` away | 4 | (2, 2) | 1/0 | 1/0 | WIN | +0.34 | +1.03u |
| 2026-04-26 | NBA | ML | `2026-04-26_NBA_cle_tor` away | 4 | (2, 2) | 1/0 | 1/0 | LOSS | -1.00 | -3.00u |
| 2026-04-26 | MLB | TOTAL | `2026-04-26_MLB_col_nym_total` over | 4 | (2, 2) | 2/0 | 1/0 | LOSS | -1.00 | -0.50u |
| 2026-04-27 | MLB | ML | `2026-04-27_MLB_stl_pit` away | 4 | (2, 2) | 1/0 | 1/0 | WIN | +1.04 | +0.78u |
| 2026-04-29 | NBA | ML | `2026-04-29_NBA_tor_cle` home | 3 | (1, 2) | 2/0 | 1/0 | WIN | +0.28 | +0.85u |
| 2026-04-29 | MLB | TOTAL | `2026-04-29_MLB_wsh_nym_total` under | 4 | (2, 2) | 3/0 | 1/0 | LOSS | -1.00 | -0.50u |

---
## §7. Decision applied

Pre-registered rule for floor lowering (calibrated to vault findings — same as `WALLET_PREDICTIVENESS_PLAYBOOK §6` LOOSEN arm):

1. **PROMOTED bucket WR ≥ 56%** (between baseline 50% and HC ceiling 63%).
2. **PROMOTED bucket flat ROI ≥ +5%** (positive EV after vig).
3. **N ≥ 6 promoted picks** (avoid acting on rounding error).
4. **Combined floor flat ROI within 5pp of v7.0 baseline** (don't crash overall ROI).
5. **Holds in ≥ 2 of 3 sports** for cross-sport robustness.

| Floor candidate | N gain | Promoted WR | Promoted Flat ROI | Combined ROI | ΔROI vs v7 | Verdict |
|---|---|---|---|---|---|---|
| Σ ≥ +5 OR (Σ = +4 ∧ G3: net CONFIRMED ≥ +1) | +12 | 33.3% | -45.1% | +14.6% | -21.1% | KILL (0/2 sports) |
| Σ ≥ +5 OR (Σ = +4 ∧ G4: net CONFIRMED ≥ +2) | +3 | 33.3% | -55.6% | +28.3% | -7.4% | KILL (0/2 sports) |
| Σ ≥ +5 OR (Σ = +4 ∧ G6: HC dominance) | +6 | 50.0% | -21.4% | +27.2% | -8.6% | KILL (0/2 sports) |
| Σ ≥ +5 OR (Σ = +4 ∧ G7: CONF ≥ 1, no FLAT) | +2 | 50.0% | -33.3% | +31.9% | -3.8% | KILL (0/2 sports) |
| Σ ≥ +5 OR (Σ = +4 ∧ G9: CONF≥1 OR HC dominance) | +12 | 33.3% | -45.1% | +14.6% | -21.1% | KILL (0/2 sports) |
| Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G3: net CONFIRMED ≥ +1) | +24 | 50.0% | -8.5% | +17.4% | -18.3% | KILL (2/3 sports) |
| Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G4: net CONFIRMED ≥ +2) | +10 | 50.0% | -7.1% | +26.0% | -9.7% | KILL (1/3 sports) |
| Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G6: HC dominance) | +9 | 66.7% | +12.1% | +30.8% | -4.9% | KILL (1/2 sports) |
| Σ ≥ +5 OR (Σ ∈ {3,4} ∧ G9) | +25 | 52.0% | -4.0% | +18.9% | -16.8% | KILL (2/3 sports) |
| Σ ≥ +4 (no gate — fully lower) | +19 | 36.8% | -35.0% | +10.4% | -25.3% | KILL (1/2 sports) |
| Σ ≥ +3 (no gate — fully lower) | +35 | 48.6% | -8.5% | +13.3% | -22.4% | KILL (2/3 sports) |

---
## §8. Notes & caveats

- All Δw / Δq values recomputed under L2 (point-in-time) tiers, NOT the dwFrozen stamps. This may shift some picks across Σ buckets relative to the original v7 stamping. The v7.0 baseline row in §1 / §4 reflects the L2-recomputed Σ ≥ +5 set, which is what matters for an apples-to-apples comparison.
- Sample window is short (~12 days). Per-sport per-gate cells are noisy; treat as directional, not definitive.
- Σ=+3 cell decomposes into (Δw=+1, Δq=+2) and (Δw=+2, Δq=+1). Σ=+4 decomposes into (1,3), (2,2), (3,1). The wallet-tier composition may differ across these sub-cells.
- HC threshold = `sizeRatio ≥ 1.5×`. HC-CONFIRMED is a strict subset of CONFIRMED.
- "PROMOTED" in §7 = picks newly admitted to LOCK by each candidate that v7.0 (Σ ≥ +5) would not have shipped at full units. LEAN picks (Σ=3,4) under v7 are tracked at 0u; the candidates here would ship them at full ladder units.
