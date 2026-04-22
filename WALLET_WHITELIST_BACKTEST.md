# Wallet-Whitelist Backtest

Generated: 4/22/2026, 5:49:49 AM ET

Backtest of "what if V8 had known which wallets were profitable per sport and only acted on their consensus?"

**Sample**: 59 graded V8-era picks across 3 sports (MLB, NBA, NHL), dates 2026-04-18 → 2026-04-21.

**Whitelists** (rebuilt per backtest variant):
- `CONFIRMED` — wallet has flat PnL > 0 in Source A **AND** dollar PnL > 0 in Source B (same sport, ≥2 bets).
- `FLAT` — wallet has flat PnL > 0 in Source A (same sport, ≥2 bets). [broader]
- `WR50` — wallet has WR ≥ 50% in Source A (same sport, ≥2 bets). [broadest]

**Lenses** applied to every V8 pick:
- **L1 ALIGNMENT** — bucket by `Δ = forW − agW` (how much more whitelist wallets back the V8 side vs. the other) and show baseline V8 WR/ROI per bucket.
- **L2 FILTER** — only keep picks where whitelist agrees: `forW ≥ 1 AND agW = 0`.
- **L3 RE-SIDE** — if `Δ ≤ −1` (whitelist favors the other side), flip to the opposing side.
- **L4 WHITELIST-ONLY** — ignore V8, take whichever side has `|Δ| ≥ 2`.

All figures are flat 1u per pick.  Dollar PnL is informative but we report flat because V8 sizing rules are in flux.

**Baseline V8** (no whitelist filter applied): N=59, WR=45.8%, Flat PnL=-2.10u, Flat ROI=-3.6%.

---
## §A. IN-SAMPLE backtest (full-period whitelist)

> ⚠️ **Leakage warning:** the whitelist used here is built from the *same* graded picks it is evaluated against, so these numbers are an upper bound on what the approach could have done with perfect hindsight. See §B for the honest leave-one-date-out version.

### CONFIRMED whitelist

_Whitelist size per sport:_ MLB=3, NBA=9, NHL=2

**L1 — Alignment buckets (baseline V8 WR/ROI, sliced by Δ):**

| Bucket | N | W | L | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|---|
| Δ ≥ +2 | 10 | 8 | 2 | 80.0% | +11.13 | +111.3% |
| Δ = +1 | 10 | 5 | 5 | 50.0% | -0.10 | -1.0% |
| Δ = 0 | 29 | 11 | 18 | 37.9% | -8.28 | -28.6% |
| Δ = −1 | 7 | 2 | 5 | 28.6% | -3.03 | -43.3% |
| Δ ≤ −2 | 3 | 1 | 2 | 33.3% | -1.81 | -60.4% |

**L2/L3/L4 summary vs. baseline:**

| Lens | N | WR% | Flat PnL (u) | Flat ROI | Δ ROI vs. baseline |
|---|---|---|---|---|---|
| BASELINE | 59 | 45.8% | -2.10 | -3.6% | +0.0% |
| L2 FILTER (forW≥1, agW=0) | 20 | 65.0% | +11.03 | +55.1% | +58.7% |
| L2 FILTER (forW≥2, agW≤1) | 10 | 80.0% | +11.13 | +111.3% | +114.8% |
| L3 RE-SIDE (flip on Δ≤−1) | 59 | 52.5% | +17.98 | +30.5% | +34.0% |
| L4 WHITELIST-ONLY (|Δ|≥2) | 13 | 76.9% | +20.98 | +161.4% | +164.9% |

**Per-sport breakdown (baseline vs. filter vs. re-side):**

| Sport | Baseline N / WR / ROI | FILTER (forW≥1, agW=0) N / WR / ROI | RE-SIDE (flip on Δ≤−1) N / WR / ROI |
|---|---|---|---|
| MLB | 21 / 52.4% / +2.0% | 12 / 58.3% / +11.8% | 21 / 47.6% / -7.8% |
| NBA | 28 / 32.1% / -21.6% | 5 / 60.0% / +135.5% | 28 / 42.9% / +41.3% |
| NHL | 10 / 70.0% / +35.1% | 3 / 100.0% / +94.4% | 10 / 90.0% / +80.5% |

### FLAT whitelist

_Whitelist size per sport:_ MLB=6, NBA=13, NHL=6

**L1 — Alignment buckets (baseline V8 WR/ROI, sliced by Δ):**

| Bucket | N | W | L | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|---|
| Δ ≥ +2 | 17 | 12 | 5 | 70.6% | +13.54 | +79.6% |
| Δ = +1 | 14 | 6 | 8 | 42.9% | -2.88 | -20.5% |
| Δ = 0 | 19 | 6 | 13 | 31.6% | -8.92 | -46.9% |
| Δ = −1 | 6 | 2 | 4 | 33.3% | -2.03 | -33.8% |
| Δ ≤ −2 | 3 | 1 | 2 | 33.3% | -1.81 | -60.4% |

**L2/L3/L4 summary vs. baseline:**

| Lens | N | WR% | Flat PnL (u) | Flat ROI | Δ ROI vs. baseline |
|---|---|---|---|---|---|
| BASELINE | 59 | 45.8% | -2.10 | -3.6% | +0.0% |
| L2 FILTER (forW≥1, agW=0) | 24 | 58.3% | +6.22 | +25.9% | +29.5% |
| L2 FILTER (forW≥2, agW≤1) | 21 | 66.7% | +13.33 | +63.5% | +67.0% |
| L3 RE-SIDE (flip on Δ≤−1) | 59 | 50.8% | +15.24 | +25.8% | +29.4% |
| L4 WHITELIST-ONLY (|Δ|≥2) | 20 | 70.0% | +23.39 | +116.9% | +120.5% |

**Per-sport breakdown (baseline vs. filter vs. re-side):**

| Sport | Baseline N / WR / ROI | FILTER (forW≥1, agW=0) N / WR / ROI | RE-SIDE (flip on Δ≤−1) N / WR / ROI |
|---|---|---|---|
| MLB | 21 / 52.4% / +2.0% | 13 / 53.8% / +5.9% | 21 / 52.4% / +4.8% |
| NBA | 28 / 32.1% / -21.6% | 7 / 42.9% / +12.8% | 28 / 39.3% / +28.1% |
| NHL | 10 / 70.0% / +35.1% | 4 / 100.0% / +113.8% | 10 / 80.0% / +63.6% |

### WR50 whitelist

_Whitelist size per sport:_ MLB=8, NBA=15, NHL=6

**L1 — Alignment buckets (baseline V8 WR/ROI, sliced by Δ):**

| Bucket | N | W | L | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|---|
| Δ ≥ +2 | 20 | 13 | 7 | 65.0% | +11.25 | +56.2% |
| Δ = +1 | 14 | 8 | 6 | 57.1% | +1.65 | +11.8% |
| Δ = 0 | 19 | 5 | 14 | 26.3% | -10.19 | -53.6% |
| Δ = −1 | 3 | 1 | 2 | 33.3% | -1.81 | -60.4% |
| Δ ≤ −2 | 3 | 0 | 3 | 0.0% | -3.00 | -100.0% |

**L2/L3/L4 summary vs. baseline:**

| Lens | N | WR% | Flat PnL (u) | Flat ROI | Δ ROI vs. baseline |
|---|---|---|---|---|---|
| BASELINE | 59 | 45.8% | -2.10 | -3.6% | +0.0% |
| L2 FILTER (forW≥1, agW=0) | 23 | 56.5% | +6.01 | +26.1% | +29.7% |
| L2 FILTER (forW≥2, agW≤1) | 26 | 65.4% | +12.77 | +49.1% | +52.7% |
| L3 RE-SIDE (flip on Δ≤−1) | 59 | 52.5% | +17.36 | +29.4% | +33.0% |
| L4 WHITELIST-ONLY (|Δ|≥2) | 23 | 69.6% | +23.15 | +100.6% | +104.2% |

**Per-sport breakdown (baseline vs. filter vs. re-side):**

| Sport | Baseline N / WR / ROI | FILTER (forW≥1, agW=0) N / WR / ROI | RE-SIDE (flip on Δ≤−1) N / WR / ROI |
|---|---|---|---|
| MLB | 21 / 52.4% / +2.0% | 12 / 50.0% / -2.3% | 21 / 52.4% / +2.0% |
| NBA | 28 / 32.1% / -21.6% | 7 / 42.9% / +37.3% | 28 / 46.4% / +47.9% |
| NHL | 10 / 70.0% / +35.1% | 4 / 100.0% / +92.1% | 10 / 70.0% / +35.1% |

---
## §B. Leave-one-date-out backtest (honest)

For every pick on date D, the whitelist is rebuilt from **all graded data on dates ≠ D**.  No future information is used to grade the pick.

### CONFIRMED whitelist (LODO)

**L1 — Alignment buckets:**

| Bucket | N | W | L | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|---|
| Δ ≥ +2 | 4 | 2 | 2 | 50.0% | -0.28 | -7.1% |
| Δ = +1 | 11 | 3 | 8 | 27.3% | +1.30 | +11.8% |
| Δ = 0 | 34 | 18 | 16 | 52.9% | +0.21 | +0.6% |
| Δ = −1 | 9 | 4 | 5 | 44.4% | -2.32 | -25.8% |
| Δ ≤ −2 | 1 | 0 | 1 | 0.0% | -1.00 | -100.0% |

**L2/L3/L4 summary vs. baseline:**

| Lens | N | WR% | Flat PnL (u) | Flat ROI | Δ ROI vs. baseline |
|---|---|---|---|---|---|
| BASELINE | 59 | 45.8% | -2.10 | -3.6% | +0.0% |
| L2 FILTER (forW≥1, agW=0) | 14 | 35.7% | +2.02 | +14.4% | +18.0% |
| L2 FILTER (forW≥2, agW≤1) | 5 | 40.0% | -1.28 | -25.7% | -22.1% |
| L3 RE-SIDE (flip on Δ≤−1) | 59 | 49.2% | +13.55 | +23.0% | +26.5% |
| L4 WHITELIST-ONLY (|Δ|≥2) | 5 | 60.0% | +8.22 | +164.3% | +167.9% |

**Per-sport breakdown (baseline vs. filter vs. re-side):**

| Sport | Baseline N / WR / ROI | FILTER (forW≥1, agW=0) N / WR / ROI | RE-SIDE (flip on Δ≤−1) N / WR / ROI |
|---|---|---|---|
| MLB | 21 / 52.4% / +2.0% | 7 / 42.9% / -12.6% | 21 / 47.6% / -7.8% |
| NBA | 28 / 32.1% / -21.6% | 7 / 28.6% / +41.4% | 28 / 46.4% / +48.1% |
| NHL | 10 / 70.0% / +35.1% | 0 / 0.0% / +0.0% | 10 / 60.0% / +17.1% |

### FLAT whitelist (LODO)

**L1 — Alignment buckets:**

| Bucket | N | W | L | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|---|
| Δ ≥ +2 | 9 | 4 | 5 | 44.4% | +1.48 | +16.4% |
| Δ = +1 | 15 | 5 | 10 | 33.3% | -5.31 | -35.4% |
| Δ = 0 | 27 | 16 | 11 | 59.3% | +6.48 | +24.0% |
| Δ = −1 | 6 | 1 | 5 | 16.7% | -3.94 | -65.7% |
| Δ ≤ −2 | 2 | 1 | 1 | 50.0% | -0.81 | -40.7% |

**L2/L3/L4 summary vs. baseline:**

| Lens | N | WR% | Flat PnL (u) | Flat ROI | Δ ROI vs. baseline |
|---|---|---|---|---|---|
| BASELINE | 59 | 45.8% | -2.10 | -3.6% | +0.0% |
| L2 FILTER (forW≥1, agW=0) | 21 | 33.3% | -4.92 | -23.4% | -19.9% |
| L2 FILTER (forW≥2, agW≤1) | 12 | 50.0% | +2.57 | +21.4% | +24.9% |
| L3 RE-SIDE (flip on Δ≤−1) | 59 | 52.5% | +16.88 | +28.6% | +32.2% |
| L4 WHITELIST-ONLY (|Δ|≥2) | 11 | 45.5% | +8.98 | +81.6% | +85.2% |

**Per-sport breakdown (baseline vs. filter vs. re-side):**

| Sport | Baseline N / WR / ROI | FILTER (forW≥1, agW=0) N / WR / ROI | RE-SIDE (flip on Δ≤−1) N / WR / ROI |
|---|---|---|---|
| MLB | 21 / 52.4% / +2.0% | 11 / 45.5% / -8.6% | 21 / 52.4% / +1.7% |
| NBA | 28 / 32.1% / -21.6% | 10 / 20.0% / -39.7% | 28 / 42.9% / +40.6% |
| NHL | 10 / 70.0% / +35.1% | 0 / 0.0% / +0.0% | 10 / 80.0% / +51.4% |

### WR50 whitelist (LODO)

**L1 — Alignment buckets:**

| Bucket | N | W | L | WR% | Flat PnL (u) | Flat ROI |
|---|---|---|---|---|---|---|
| Δ ≥ +2 | 16 | 7 | 9 | 43.8% | +0.11 | +0.7% |
| Δ = +1 | 12 | 5 | 7 | 41.7% | -2.66 | -22.2% |
| Δ = 0 | 23 | 11 | 12 | 47.8% | -2.95 | -12.8% |
| Δ = −1 | 8 | 4 | 4 | 50.0% | +3.40 | +42.5% |
| Δ ≤ −2 | — | — | — | — | — | — |

**L2/L3/L4 summary vs. baseline:**

| Lens | N | WR% | Flat PnL (u) | Flat ROI | Δ ROI vs. baseline |
|---|---|---|---|---|---|
| BASELINE | 59 | 45.8% | -2.10 | -3.6% | +0.0% |
| L2 FILTER (forW≥1, agW=0) | 22 | 36.4% | -6.70 | -30.4% | -26.9% |
| L2 FILTER (forW≥2, agW≤1) | 19 | 47.4% | +1.20 | +6.3% | +9.9% |
| L3 RE-SIDE (flip on Δ≤−1) | 59 | 45.8% | +3.38 | +5.7% | +9.3% |
| L4 WHITELIST-ONLY (|Δ|≥2) | 16 | 43.8% | +0.11 | +0.7% | +4.3% |

**Per-sport breakdown (baseline vs. filter vs. re-side):**

| Sport | Baseline N / WR / ROI | FILTER (forW≥1, agW=0) N / WR / ROI | RE-SIDE (flip on Δ≤−1) N / WR / ROI |
|---|---|---|---|
| MLB | 21 / 52.4% / +2.0% | 12 / 50.0% / -2.3% | 21 / 47.6% / -7.8% |
| NBA | 28 / 32.1% / -21.6% | 8 / 0.0% / -100.0% | 28 / 35.7% / +8.1% |
| NHL | 10 / 70.0% / +35.1% | 2 / 100.0% / +79.1% | 10 / 70.0% / +27.4% |

---
## §C. Per-pick whitelist tally (in-sample, FLAT flavor)

For each graded V8 pick, the counts of FLAT-whitelist wallets that bet the V8 side vs. the opposing side. Use this to eyeball alignment vs. outcome.

| Date | Sport | Mkt | Game | V8 side | Odds | Result | Whitelist for V8 | Whitelist vs V8 | Δ |
|---|---|---|---|---|---|---|---|---|---|
| 2026-04-18 | MLB | ML | 2026-04-18_MLB_bal_cle | away | +116 | L | 0 | 0 | +0 |
| 2026-04-18 | MLB | TOTAL | 2026-04-18_MLB_bal_cle_total | under | +105 | W | 2 | 0 | +2 |
| 2026-04-18 | MLB | ML | 2026-04-18_MLB_cin_min | home | -132 | L | 0 | 0 | +0 |
| 2026-04-18 | MLB | ML | 2026-04-18_MLB_det_bos | away | -155 | W | 0 | 0 | +0 |
| 2026-04-18 | MLB | TOTAL | 2026-04-18_MLB_sfg_wsh_total | under | -117 | L | 2 | 0 | +2 |
| 2026-04-18 | MLB | ML | 2026-04-18_MLB_tor_ari | home | -150 | W | 3 | 0 | +3 |
| 2026-04-18 | NBA | ML | 2026-04-18_NBA_atl_nyk | away | +200 | L | 0 | 0 | +0 |
| 2026-04-18 | NBA | SPREAD | 2026-04-18_NBA_atl_nyk_spread | away | -108 | L | 0 | 0 | +0 |
| 2026-04-18 | NBA | SPREAD | 2026-04-18_NBA_hou_lal_spread | away | -108 | L | 0 | 0 | +0 |
| 2026-04-18 | NBA | TOTAL | 2026-04-18_NBA_hou_lal_total | over | -106 | L | 0 | 0 | +0 |
| 2026-04-18 | NBA | TOTAL | 2026-04-18_NBA_min_den_total | under | -104 | W | 0 | 0 | +0 |
| 2026-04-18 | NBA | ML | 2026-04-18_NBA_tor_cle | home | -360 | W | 0 | 0 | +0 |
| 2026-04-18 | NBA | TOTAL | 2026-04-18_NBA_tor_cle_total | under | -112 | L | 0 | 0 | +0 |
| 2026-04-18 | NHL | ML | 2026-04-18_NHL_min_dal | away | +105 | W | 1 | 0 | +1 |
| 2026-04-19 | MLB | ML | 2026-04-19_MLB_atl_phi | away | -108 | W | 3 | 0 | +3 |
| 2026-04-19 | MLB | ML | 2026-04-19_MLB_kcr_nyy | home | -150 | W | 1 | 0 | +1 |
| 2026-04-19 | MLB | ML | 2026-04-19_MLB_mil_mia | home | -110 | W | 4 | 1 | +3 |
| 2026-04-19 | MLB | ML | 2026-04-19_MLB_nym_chc | home | -125 | W | 3 | 0 | +3 |
| 2026-04-19 | MLB | ML | 2026-04-19_MLB_sfg_wsh | away | -145 | L | 1 | 0 | +1 |
| 2026-04-19 | MLB | ML | 2026-04-19_MLB_tbr_pit | away | +100 | L | 1 | 1 | +0 |
| 2026-04-19 | NBA | ML | 2026-04-19_NBA_orl_det | away | +315 | W | 5 | 0 | +5 |
| 2026-04-19 | NBA | SPREAD | 2026-04-19_NBA_orl_det_spread | home | -110 | L | 0 | 0 | +0 |
| 2026-04-19 | NBA | ML | 2026-04-19_NBA_por_sas | home | -535 | W | 1 | 3 | -2 |
| 2026-04-19 | NHL | ML | 2026-04-19_NHL_bos_buf | away | +146 | L | 2 | 1 | +1 |
| 2026-04-19 | NHL | ML | 2026-04-19_NHL_mtl_tbl | home | -185 | L | 1 | 2 | -1 |
| 2026-04-20 | MLB | ML | 2026-04-20_MLB_hou_cle | home | -130 | L | 2 | 0 | +2 |
| 2026-04-20 | MLB | TOTAL | 2026-04-20_MLB_hou_cle_total | over | +106 | W | 0 | 1 | -1 |
| 2026-04-20 | MLB | ML | 2026-04-20_MLB_oak_sea | away | +126 | W | 2 | 0 | +2 |
| 2026-04-20 | MLB | TOTAL | 2026-04-20_MLB_stl_mia_total | under | +104 | W | 2 | 1 | +1 |
| 2026-04-20 | NBA | ML | 2026-04-20_NBA_atl_nyk | home | -235 | L | 1 | 6 | -5 |
| 2026-04-20 | NBA | SPREAD | 2026-04-20_NBA_atl_nyk_spread | home | -105 | L | 1 | 0 | +1 |
| 2026-04-20 | NBA | TOTAL | 2026-04-20_NBA_atl_nyk_total | under | -102 | W | 0 | 0 | +0 |
| 2026-04-20 | NBA | ML | 2026-04-20_NBA_min_den | home | -270 | L | 1 | 1 | +0 |
| 2026-04-20 | NBA | SPREAD | 2026-04-20_NBA_min_den_spread | home | -105 | L | 0 | 1 | -1 |
| 2026-04-20 | NBA | TOTAL | 2026-04-20_NBA_min_den_total | over | -115 | W | 1 | 0 | +1 |
| 2026-04-20 | NBA | ML | 2026-04-20_NBA_tor_cle | away | +360 | L | 5 | 0 | +5 |
| 2026-04-20 | NBA | SPREAD | 2026-04-20_NBA_tor_cle_spread | home | -110 | W | 0 | 1 | -1 |
| 2026-04-20 | NBA | TOTAL | 2026-04-20_NBA_tor_cle_total | over | -108 | L | 0 | 0 | +0 |
| 2026-04-20 | NHL | ML | 2026-04-20_NHL_ana_edm | away | +160 | L | 3 | 2 | +1 |
| 2026-04-20 | NHL | TOTAL | 2026-04-20_NHL_ana_edm_total | over | -133 | W | 1 | 0 | +1 |
| 2026-04-20 | NHL | ML | 2026-04-20_NHL_min_dal | home | -134 | W | 2 | 1 | +1 |
| 2026-04-20 | NHL | ML | 2026-04-20_NHL_ott_car | home | -146 | W | 1 | 1 | +0 |
| 2026-04-21 | MLB | ML | 2026-04-21_MLB_min_nym | away | +140 | W | 3 | 0 | +3 |
| 2026-04-21 | MLB | ML | 2026-04-21_MLB_oak_sea | home | -165 | L | 0 | 1 | -1 |
| 2026-04-21 | MLB | TOTAL | 2026-04-21_MLB_phi_chc_total | under | -103 | L | 2 | 0 | +2 |
| 2026-04-21 | MLB | ML | 2026-04-21_MLB_pit_tex | away | -102 | L | 1 | 0 | +1 |
| 2026-04-21 | MLB | ML | 2026-04-21_MLB_stl_mia | home | -116 | L | 2 | 0 | +2 |
| 2026-04-21 | NBA | ML | 2026-04-21_NBA_hou_lal | away | -192 | L | 1 | 0 | +1 |
| 2026-04-21 | NBA | SPREAD | 2026-04-21_NBA_hou_lal_spread | away | -105 | L | 2 | 1 | +1 |
| 2026-04-21 | NBA | TOTAL | 2026-04-21_NBA_hou_lal_total | over | -106 | L | 1 | 0 | +1 |
| 2026-04-21 | NBA | ML | 2026-04-21_NBA_phi_bos | home | -850 | L | 0 | 4 | -4 |
| 2026-04-21 | NBA | SPREAD | 2026-04-21_NBA_phi_bos_spread | home | -110 | L | 0 | 1 | -1 |
| 2026-04-21 | NBA | TOTAL | 2026-04-21_NBA_phi_bos_total | over | -106 | L | 0 | 0 | +0 |
| 2026-04-21 | NBA | ML | 2026-04-21_NBA_por_sas | away | +475 | W | 3 | 1 | +2 |
| 2026-04-21 | NBA | SPREAD | 2026-04-21_NBA_por_sas_spread | away | -114 | W | 2 | 0 | +2 |
| 2026-04-21 | NBA | TOTAL | 2026-04-21_NBA_por_sas_total | over | -101 | L | 0 | 0 | +0 |
| 2026-04-21 | NHL | ML | 2026-04-21_NHL_bos_buf | away | +140 | W | 3 | 0 | +3 |
| 2026-04-21 | NHL | ML | 2026-04-21_NHL_mtl_tbl | home | -188 | W | 1 | 1 | +0 |
| 2026-04-21 | NHL | ML | 2026-04-21_NHL_uta_vgk | away | +135 | W | 2 | 0 | +2 |

---
*Generated by `scripts/walletWhitelistBacktest.js`.*
