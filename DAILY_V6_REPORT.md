# Sharp Intel v6 — Daily Master Report

_Auto-generated **6/20/2026, 10:56:49 AM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (275 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-06-19** · 21 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 21 | 12-9-0 | 57.1% | -10.50u | +1.48u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Baltimore Orioles @ Los Angeles Dodgers | Los Angeles Dodgers | 4.5★ · 3.00u | +0 | +1 | +2 | +3 | -205 | **W** | +0.00u |
| MLB | ML | Cincinnati Reds @ New York Yankees | Cincinnati Reds | 4.5★ · 1.00u | +0 | +1 | +0 | +1 | +239 | L | -1.00u |
| MLB | ML | Cleveland Guardians @ Houston Astros | Cleveland Guardians | 4.0★ · 1.00u | +0 | +0 | -1 | -1 | +107 | L | -1.00u |
| MLB | ML | Los Angeles Angels @ Athletics | Los Angeles Angels | 4.5★ · 2.50u | +0 | +1 | +0 | +1 | +141 | L | -2.50u |
| MLB | ML | Milwaukee Brewers @ Atlanta Braves | Atlanta Braves | 2.5★ · 0.25u | -1 | -1 | +0 | -1 | +158 | **W** | +0.00u |
| MLB | ML | Minnesota Twins @ Arizona Diamondbacks | Arizona Diamondbacks | 4.5★ · 3.00u | -1 | -1 | +1 | +0 | -163 | **W** | +2.38u |
| MLB | ML | San Diego Padres @ Texas Rangers | Texas Rangers | 3.0★ · 0.50u | +0 | +1 | +1 | +2 | -152 | **W** | +0.00u |
| MLB | ML | San Francisco Giants @ Miami Marlins | Miami Marlins | 5.0★ · 1.00u | +0 | +1 | +0 | +1 | -109 | **W** | +0.00u |
| MLB | SPREAD | Boston Red Sox @ Seattle Mariners | Boston Red Sox | 5.0★ · 5.00u | +0 | +1 | +0 | +1 | -194 | **W** | +0.00u |
| MLB | SPREAD | Cincinnati Reds @ New York Yankees | New York Yankees | 4.5★ · 3.00u | +1 | +1 | +0 | +1 | -111 | **W** | +3.08u |
| MLB | SPREAD | Chicago White Sox @ Detroit Tigers | Chicago White Sox | 4.0★ · 1.00u | +0 | +2 | +1 | +3 | -115 | **W** | +2.54u |
| MLB | SPREAD | Milwaukee Brewers @ Atlanta Braves | Milwaukee Brewers | 4.5★ · 2.50u | -1 | +0 | -2 | -2 | -101 | L | -2.50u |
| MLB | SPREAD | Minnesota Twins @ Arizona Diamondbacks | Arizona Diamondbacks | 4.5★ · 2.50u | +0 | +1 | +0 | +1 | +130 | **W** | +0.00u |
| MLB | SPREAD | San Diego Padres @ Texas Rangers | Texas Rangers | 2.5★ · 0.25u | +0 | +1 | +1 | +2 | +147 | L | -0.25u |
| MLB | SPREAD | St. Louis Cardinals @ Kansas City Royals | St. Louis Cardinals | 5.0★ · 5.00u | +0 | +1 | +0 | +1 | -110 | **W** | +0.00u |
| MLB | SPREAD | Washington Nationals @ Tampa Bay Rays | Tampa Bay Rays | 2.5★ · 0.25u | +0 | +1 | +1 | +2 | +170 | L | -0.25u |
| MLB | TOTAL | Baltimore Orioles @ Los Angeles Dodgers | Over 9 | 4.5★ · 3.00u | +0 | +0 | +0 | +0 | -114 | **W** | +0.00u |
| MLB | TOTAL | Boston Red Sox @ Seattle Mariners | Over 6.5 | 3.0★ · 0.50u | +0 | +0 | +0 | +0 | -117 | **W** | +0.00u |
| MLB | TOTAL | Cincinnati Reds @ New York Yankees | Over 9.5 | 4.5★ · 3.00u | +0 | +2 | +1 | +3 | -110 | L | -3.00u |
| MLB | TOTAL | Pittsburgh Pirates @ Colorado Rockies | Over 11.5 | 5.0★ · 5.00u | +0 | +1 | +1 | +2 | -110 | L | -5.00u |
| MLB | TOTAL | Toronto Blue Jays @ Chicago Cubs | Under 7.5 | 4.5★ · 3.00u | +0 | +1 | +1 | +2 | -110 | L | -3.00u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **42** shipped · 24-18-0 · WR 57.1% · PnL -19.70u (peak) / +2.61u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 42)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC = +1 | 3 | 2-1-0 | 66.7% | +2.66u | +0.98u |
| HC = 0 | 35 | 20-15-0 | 57.1% | -19.74u | +1.44u |
| HC ≤ −1 | 4 | 2-2-0 | 50.0% | -2.62u | +0.19u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 3 | 3-0-0 | 100.0% | +5.36u | +2.65u |
| +2 | 2 | 1-1-0 | 50.0% | -0.46u | -0.13u |
| +1 | 25 | 13-12-0 | 52.0% | -17.73u | -1.28u |
| 0 | 7 | 4-3-0 | 57.1% | -6.50u | -0.08u |
| −1 | 4 | 2-2-0 | 50.0% | -0.37u | +0.19u |
| ≤ −2 | 1 | 1-0-0 | 100.0% | +0.00u | +1.26u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 2 | 2-0-0 | 100.0% | +2.58u | +1.74u |
| +2 | 1 | 1-0-0 | 100.0% | +0.00u | +0.49u |
| +1 | 16 | 9-7-0 | 56.3% | +0.89u | +0.41u |
| 0 | 18 | 10-8-0 | 55.6% | -19.42u | +1.13u |
| −1 | 2 | 1-1-0 | 50.0% | -1.00u | +0.26u |
| ≤ −2 | 3 | 1-2-0 | 33.3% | -2.75u | -1.42u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 42)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 30 | 18-12-0 | 60.0% | -15.33u | +3.01u |
| WEAK   (−1 .. 0) | 12 | 6-6-0 | 50.0% | -4.37u | -0.40u |

### §2b. 7-day

Total: **113** shipped · 60-53-0 · WR 53.1% · PnL -53.24u (peak) / -1.33u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 113)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 1-1-0 | 50.0% | +2.13u | -0.39u |
| HC = +2 | 1 | 1-0-0 | 100.0% | +4.48u | +0.74u |
| HC = +1 | 11 | 8-3-0 | 72.7% | +11.00u | +3.47u |
| HC = 0 | 93 | 47-46-0 | 50.5% | -66.35u | -4.98u |
| HC ≤ −1 | 6 | 3-3-0 | 50.0% | -4.50u | -0.17u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 9 | 6-3-0 | 66.7% | +6.18u | +1.76u |
| +2 | 10 | 5-5-0 | 50.0% | -2.84u | -0.55u |
| +1 | 63 | 32-31-0 | 50.8% | -49.16u | -3.49u |
| 0 | 21 | 11-10-0 | 52.4% | -6.19u | -0.90u |
| −1 | 9 | 5-4-0 | 55.6% | -1.23u | +0.59u |
| ≤ −2 | 1 | 1-0-0 | 100.0% | +0.00u | +1.26u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 7 | 5-2-0 | 71.4% | +6.42u | +1.76u |
| +2 | 9 | 4-5-0 | 44.4% | -5.84u | -1.80u |
| +1 | 38 | 22-16-0 | 57.9% | -13.05u | +3.07u |
| 0 | 50 | 25-25-0 | 50.0% | -36.27u | -3.09u |
| −1 | 5 | 3-2-0 | 60.0% | -1.50u | +1.14u |
| ≤ −2 | 4 | 1-3-0 | 25.0% | -3.00u | -2.42u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 113)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| STRONG (+3 .. +5) | 1 | 0-1-0 | 0.0% | -0.25u | -1.00u |
| NEUT   (0 .. +3) | 70 | 40-30-0 | 57.1% | -34.98u | +4.57u |
| WEAK   (−1 .. 0) | 42 | 20-22-0 | 47.6% | -18.01u | -4.89u |

### §2c. All-time

Total: **721** shipped · 365-348-8 · WR 51.2% · PnL -97.50u (peak) / -16.54u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 610)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 12 | 4-8-0 | 33.3% | -6.70u | -6.05u |
| HC = +2 | 32 | 17-15-0 | 53.1% | -0.13u | +0.62u |
| HC = +1 | 165 | 93-72-0 | 56.4% | +14.14u | +13.26u |
| HC = 0 | 370 | 183-180-7 | 50.4% | -101.79u | -19.96u |
| HC ≤ −1 | 30 | 17-13-0 | 56.7% | +7.58u | +4.39u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 112 | 55-57-0 | 49.1% | -20.07u | -2.41u |
| +2 | 139 | 68-70-1 | 49.3% | -34.63u | -6.59u |
| +1 | 279 | 149-127-3 | 54.0% | -39.85u | +4.88u |
| 0 | 147 | 75-69-3 | 52.1% | +6.07u | -3.20u |
| −1 | 31 | 11-19-1 | 36.7% | -9.72u | -8.81u |
| ≤ −2 | 7 | 3-4-0 | 42.9% | -3.29u | -1.25u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 133 | 67-63-3 | 51.5% | -22.26u | -1.39u |
| +2 | 124 | 57-67-0 | 46.0% | -38.75u | -14.26u |
| +1 | 223 | 121-99-3 | 55.0% | +14.21u | +7.81u |
| 0 | 160 | 81-78-1 | 50.9% | -43.77u | -2.89u |
| −1 | 54 | 29-24-1 | 54.7% | +9.58u | +3.26u |
| ≤ −2 | 21 | 6-15-0 | 28.6% | -19.75u | -9.84u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 585)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 3 | 3-0-0 | 100.0% | +8.01u | +2.34u |
| LOCK   (+5 .. +7) | 9 | 5-4-0 | 55.6% | -2.93u | -0.47u |
| STRONG (+3 .. +5) | 23 | 13-10-0 | 56.5% | -6.91u | +1.77u |
| NEUT   (0 .. +3) | 363 | 188-173-2 | 52.1% | -64.38u | -8.14u |
| WEAK   (−1 .. 0) | 172 | 84-84-4 | 50.0% | -20.42u | -8.06u |
| FADE   (< −1) | 14 | 9-5-0 | 64.3% | +4.68u | +5.05u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29", "05-30", "05-31", "06-01", "06-02", "06-03", "06-04", "06-05", "06-06", "06-07", "06-08", "06-09", "06-10", "06-11", "06-12", "06-13", "06-14", "06-15", "06-16", "06-17", "06-18", "06-19"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98, -10.18, -8.90, -14.92, -23.44, -23.30, -28.89, -32.63, -26.98, -29.77, -33.27, -44.12, -48.21, -40.65, -34.49, -30.14, -28.48, -25.53, -22.94, -25.33, -24.75, -21.34, -10.19, -14.95, -13.13, -10.30, -6.20, -6.21, -4.00, 4.65, 4.65, 4.23, 7.31]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67, -16.17, -15.07, -14.58, -23.93, -16.53, -21.34, -20.03, -10.27, -14.68, -17.58, -11.51, -11.10, -17.79, -24.29, -24.19, -27.68, -32.54, -32.20, -29.06, -23.09, -21.30, -23.13, -30.43, -35.94, -35.44, -37.73, -54.41, -65.05, -82.05, -90.84, -88.33, -101.79]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52, -28.22, -25.84, -31.37, -49.24, -44.70, -55.10, -55.65, -40.24, -49.69, -53.57, -58.35, -62.03, -61.16, -58.77, -56.82, -56.00, -58.91, -48.76, -50.51, -46.96, -36.94, -22.86, -34.92, -38.09, -32.03, -30.22, -46.29, -54.72, -65.57, -76.86, -74.77, -85.27]
```

Daily cumulative table (peak units, HC era only):

| Date | HC ≥ +1 (cum) | HC = 0 (cum) | All shipped (cum) |
|---|---|---|---|
| 2026-04-30 | -0.48u | +0.00u | -0.48u |
| 2026-05-01 | -2.48u | -0.50u | -5.98u |
| 2026-05-02 | -4.41u | -0.50u | -7.91u |
| 2026-05-03 | -3.94u | -0.50u | -7.44u |
| 2026-05-04 | -0.95u | -0.50u | -4.95u |
| 2026-05-05 | -5.45u | -0.34u | -9.29u |
| 2026-05-06 | -3.86u | +2.84u | -4.52u |
| 2026-05-07 | -3.18u | +2.84u | -3.84u |
| 2026-05-08 | +0.54u | +3.60u | +0.64u |
| 2026-05-09 | +4.41u | +3.60u | +6.14u |
| 2026-05-10 | +6.41u | +2.32u | +6.86u |
| 2026-05-11 | +6.25u | +1.05u | +5.43u |
| 2026-05-12 | +2.11u | -9.45u | -9.21u |
| 2026-05-13 | +9.78u | -13.95u | -6.04u |
| 2026-05-14 | +3.00u | -15.20u | -14.07u |
| 2026-05-15 | +3.27u | -16.83u | -15.43u |
| 2026-05-16 | +4.90u | -17.05u | -14.02u |
| 2026-05-17 | +1.62u | -15.11u | -15.36u |
| 2026-05-18 | -2.98u | -17.67u | -22.52u |
| 2026-05-19 | -10.18u | -16.17u | -28.22u |
| 2026-05-20 | -8.90u | -15.07u | -25.84u |
| 2026-05-21 | -14.92u | -14.58u | -31.37u |
| 2026-05-22 | -23.44u | -23.93u | -49.24u |
| 2026-05-23 | -23.30u | -16.53u | -44.70u |
| 2026-05-24 | -28.89u | -21.34u | -55.10u |
| 2026-05-25 | -32.63u | -20.03u | -55.65u |
| 2026-05-26 | -26.98u | -10.27u | -40.24u |
| 2026-05-27 | -29.77u | -14.68u | -49.69u |
| 2026-05-28 | -33.27u | -17.58u | -53.57u |
| 2026-05-29 | -44.12u | -11.51u | -58.35u |
| 2026-05-30 | -48.21u | -11.10u | -62.03u |
| 2026-05-31 | -40.65u | -17.79u | -61.16u |
| 2026-06-01 | -34.49u | -24.29u | -58.77u |
| 2026-06-02 | -30.14u | -24.19u | -56.82u |
| 2026-06-03 | -28.48u | -27.68u | -56.00u |
| 2026-06-04 | -25.53u | -32.54u | -58.91u |
| 2026-06-05 | -22.94u | -32.20u | -48.76u |
| 2026-06-06 | -25.33u | -29.06u | -50.51u |
| 2026-06-07 | -24.75u | -23.09u | -46.96u |
| 2026-06-08 | -21.34u | -21.30u | -36.94u |
| 2026-06-09 | -10.19u | -23.13u | -22.86u |
| 2026-06-10 | -14.95u | -30.43u | -34.92u |
| 2026-06-11 | -13.13u | -35.94u | -38.09u |
| 2026-06-12 | -10.30u | -35.44u | -32.03u |
| 2026-06-13 | -6.20u | -37.73u | -30.22u |
| 2026-06-14 | -6.21u | -54.41u | -46.29u |
| 2026-06-15 | -4.00u | -65.05u | -54.72u |
| 2026-06-16 | +4.65u | -82.05u | -65.57u |
| 2026-06-17 | +4.65u | -90.84u | -76.86u |
| 2026-06-18 | +4.23u | -88.33u | -74.77u |
| 2026-06-19 | +7.31u | -101.79u | -85.27u |

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 78 | 58 | 20 | 34% | 29 | 8 | 2 |
| NBA | 138 | 108 | 44 | 41% | 60 | 29 | 11 |
| NHL | 60 | 43 | 12 | 28% | 24 | 12 | 6 |
| **ALL (any sport)** | **173** | **137** | **58** | **42%** | **75** | **29** | **8** |

### §4b. Daily roster growth (cumulative through each date)

Format: `tracked (profitable)`. For each date D, recompute the roster using every bet up to and including D.

| Date | ALL | MLB | NBA | NHL |
|---|---|---|---|---|
| 2026-04-18 | 5 (2) | 2 (2) | 3 (0) | 0 (0) |
| 2026-04-19 | 19 (8) | 5 (3) | 9 (3) | 3 (1) |
| 2026-04-20 | 29 (12) | 7 (6) | 23 (8) | 5 (2) |
| 2026-04-21 | 44 (21) | 10 (6) | 31 (10) | 7 (5) |
| 2026-04-22 | 52 (28) | 12 (6) | 39 (15) | 11 (10) |
| 2026-04-23 | 56 (29) | 13 (6) | 46 (21) | 13 (10) |
| 2026-04-24 | 61 (30) | 14 (6) | 51 (23) | 14 (9) |
| 2026-04-25 | 65 (29) | 16 (8) | 54 (22) | 16 (9) |
| 2026-04-26 | 67 (31) | 18 (5) | 56 (25) | 17 (9) |
| 2026-04-27 | 72 (32) | 20 (7) | 60 (24) | 17 (9) |
| 2026-04-28 | 76 (33) | 21 (7) | 63 (26) | 23 (10) |
| 2026-04-29 | 77 (33) | 21 (7) | 64 (25) | 23 (10) |
| 2026-04-30 | 81 (34) | 21 (7) | 70 (27) | 23 (10) |
| 2026-05-01 | 85 (38) | 22 (5) | 74 (30) | 26 (13) |
| 2026-05-02 | 86 (37) | 23 (7) | 75 (32) | 26 (12) |
| 2026-05-03 | 86 (38) | 24 (8) | 75 (33) | 26 (12) |
| 2026-05-04 | 90 (38) | 24 (9) | 76 (32) | 26 (12) |
| 2026-05-05 | 91 (40) | 24 (9) | 79 (33) | 26 (12) |
| 2026-05-06 | 92 (40) | 24 (9) | 80 (33) | 26 (12) |
| 2026-05-07 | 92 (41) | 24 (9) | 80 (33) | 26 (12) |
| 2026-05-08 | 92 (40) | 24 (8) | 80 (32) | 26 (11) |
| 2026-05-09 | 94 (42) | 24 (8) | 82 (35) | 26 (11) |
| 2026-05-10 | 94 (42) | 24 (8) | 82 (35) | 26 (11) |
| 2026-05-11 | 96 (42) | 24 (8) | 84 (36) | 26 (11) |
| 2026-05-12 | 100 (41) | 27 (9) | 86 (37) | 26 (11) |
| 2026-05-13 | 102 (45) | 29 (11) | 88 (37) | 26 (11) |
| 2026-05-14 | 102 (41) | 29 (11) | 88 (37) | 28 (12) |
| 2026-05-15 | 103 (41) | 30 (10) | 88 (39) | 28 (12) |
| 2026-05-16 | 105 (43) | 31 (12) | 88 (39) | 30 (14) |
| 2026-05-17 | 105 (46) | 32 (11) | 88 (40) | 30 (14) |
| 2026-05-18 | 105 (46) | 32 (10) | 88 (38) | 31 (15) |
| 2026-05-19 | 105 (46) | 32 (12) | 88 (38) | 31 (15) |
| 2026-05-20 | 106 (48) | 33 (12) | 88 (38) | 31 (16) |
| 2026-05-21 | 106 (45) | 34 (12) | 88 (37) | 31 (14) |
| 2026-05-22 | 106 (44) | 34 (10) | 88 (39) | 33 (16) |
| 2026-05-23 | 111 (49) | 36 (10) | 90 (40) | 36 (19) |
| 2026-05-24 | 117 (52) | 37 (12) | 94 (39) | 37 (16) |
| 2026-05-25 | 120 (53) | 38 (13) | 95 (40) | 38 (16) |
| 2026-05-26 | 122 (55) | 39 (14) | 97 (42) | 38 (16) |
| 2026-05-27 | 123 (51) | 40 (12) | 97 (42) | 40 (14) |
| 2026-05-28 | 124 (51) | 40 (12) | 99 (42) | 40 (14) |
| 2026-05-29 | 125 (50) | 41 (12) | 99 (42) | 41 (12) |
| 2026-05-30 | 126 (49) | 41 (12) | 101 (43) | 41 (12) |
| 2026-05-31 | 126 (48) | 41 (11) | 101 (43) | 41 (12) |
| 2026-06-01 | 129 (52) | 44 (14) | 101 (43) | 41 (12) |
| 2026-06-02 | 130 (56) | 45 (16) | 101 (43) | 41 (13) |
| 2026-06-03 | 132 (56) | 45 (14) | 102 (43) | 41 (13) |
| 2026-06-04 | 132 (57) | 46 (14) | 102 (43) | 41 (14) |
| 2026-06-05 | 132 (57) | 48 (15) | 102 (43) | 41 (14) |
| 2026-06-06 | 132 (57) | 49 (15) | 102 (43) | 41 (14) |
| 2026-06-07 | 133 (56) | 52 (16) | 102 (43) | 41 (14) |
| 2026-06-08 | 135 (55) | 53 (16) | 103 (44) | 41 (14) |
| 2026-06-09 | 135 (55) | 53 (15) | 103 (44) | 41 (14) |
| 2026-06-10 | 135 (56) | 53 (15) | 105 (45) | 41 (14) |
| 2026-06-11 | 135 (54) | 54 (16) | 105 (45) | 42 (13) |
| 2026-06-12 | 135 (56) | 55 (17) | 105 (45) | 42 (13) |
| 2026-06-13 | 136 (56) | 57 (17) | 108 (44) | 42 (13) |
| 2026-06-14 | 136 (55) | 57 (18) | 108 (44) | 43 (12) |
| 2026-06-15 | 136 (56) | 57 (19) | 108 (44) | 43 (12) |
| 2026-06-16 | 137 (56) | 58 (20) | 108 (44) | 43 (12) |
| 2026-06-17 | 137 (57) | 58 (19) | 108 (44) | 43 (12) |
| 2026-06-18 | 137 (58) | 58 (20) | 108 (44) | 43 (12) |
| 2026-06-19 | 137 (58) | 58 (20) | 108 (44) | 43 (12) |

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | ad88a3 | 13 | 10 | 3 | 76.9% | +5.03 | +38.7% | $9.7K |
| 2 | e05213 | 14 | 10 | 4 | 71.4% | +5.17 | +36.9% | $225.2K |
| 3 | 913987 | 44 | 30 | 14 | 68.2% | +14.19 | +32.2% | $666.8K |
| 4 | dfa240 | 3 | 2 | 1 | 66.7% | +0.85 | +28.3% | $2.5K |
| 5 | f2d227 | 25 | 16 | 9 | 64.0% | +6.58 | +26.3% | $53.1K |
| 6 | c9bba3 | 6 | 4 | 2 | 66.7% | +1.37 | +22.8% | -$17.7K |
| 7 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 8 | c668b3 | 16 | 10 | 6 | 62.5% | +3.16 | +19.7% | $270 |
| 9 | a8c991 | 4 | 2 | 2 | 50.0% | +0.60 | +14.9% | -$31.4K |
| 10 | eeabaf | 59 | 31 | 28 | 52.5% | +7.74 | +13.1% | $884.3K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | a0d6d2 | 4 | 4 | 0 | 100.0% | +4.51 | +112.7% | $6.4K |
| 3 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 4 | b51a56 | 6 | 5 | 1 | 83.3% | +5.44 | +90.7% | $74.4K |
| 5 | 11b032 | 7 | 6 | 1 | 85.7% | +5.40 | +77.1% | $249.9K |
| 6 | 12c933 | 2 | 2 | 0 | 100.0% | +1.28 | +63.9% | $11.5K |
| 7 | a1684d | 10 | 9 | 1 | 90.0% | +5.24 | +52.4% | $11.2K |
| 8 | 7f00bc | 21 | 14 | 7 | 66.7% | +9.80 | +46.7% | $14.7K |
| 9 | 92df91 | 23 | 16 | 7 | 69.6% | +10.26 | +44.6% | -$214 |
| 10 | 8ec926 | 8 | 6 | 2 | 75.0% | +3.53 | +44.1% | -$681 |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 8366f5 | 2 | 2 | 0 | 100.0% | +2.30 | +114.9% | $107.6K |
| 2 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 3 | fec67e | 4 | 3 | 1 | 75.0% | +2.82 | +70.5% | $12.5K |
| 4 | 30935c | 4 | 3 | 1 | 75.0% | +2.11 | +52.7% | $953 |
| 5 | 981187 | 8 | 6 | 2 | 75.0% | +3.52 | +44.0% | -$25.2K |
| 6 | fcc12b | 11 | 8 | 3 | 72.7% | +4.45 | +40.5% | -$27.5K |
| 7 | bc3532 | 22 | 14 | 8 | 63.6% | +7.85 | +35.7% | $70.3K |
| 8 | e70853 | 9 | 6 | 3 | 66.7% | +2.66 | +29.5% | -$11.1K |
| 9 | 4d2125 | 17 | 11 | 6 | 64.7% | +4.26 | +25.1% | $80.3K |
| 10 | dfa240 | 28 | 18 | 10 | 64.3% | +6.46 | +23.1% | $19.0K |

---
## §5. Proven-wallet roster growth & HC tracking

"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).

### §5a. Current proven-winner roster (snapshot)

Roster as of **2026-06-19** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 128 | 58 | 12 | 8 | **20** | 9 | 15.6% |
| NBA | 210 | 108 | 29 | 15 | **44** | 21 | 21.0% |
| NHL | 105 | 43 | 9 | 3 | **12** | 12 | 11.4% |
| **ALL** | **—** | **—** | **—** | **—** | **76** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 34 · 12 | 16 · 8 | 5 · 9 | +30 live |
| NBA | 58 · 29 | 25 · 15 | 23 · 21 | +39 live |
| NHL | 23 · 9 | 6 · 3 | 16 · 12 | +17 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-06-19.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +0 from 20 | +3 from 17 | +8 from 12 | +20 from 0 |
| NBA | +0 from 44 | -1 from 45 | +6 from 38 | +44 from 0 |
| NHL | +0 from 12 | -1 from 13 | -4 from 16 | +12 from 0 |

A flat 7-day delta on a sport with healthy slate density = either the bubble pipeline has stalled (no wallets approaching the bar) or our cohort has saturated. Check §13d for the funnel diagnostic.

### §5d. Pipeline funnel — where each sport leaks

Wallets surviving each gate, in order. The biggest %-drop tells you the bottleneck. Gates:

1. **Seen** — placed ≥ 1 bet in the sport (any source)
2. **Eligible** — ≥ 2 graded picks in Source A (required for FLAT/CONFIRMED)
3. **Flat-OK** — eligible AND flat ROI > 0 (becomes FLAT or better)
4. **$-OK** — Flat-OK AND ≥2 positions with dollar ROI > 0 (CONFIRMED)
5. **Promoted** — final whitelisted = CONFIRMED + FLAT

| Sport | 1·Seen | 2·Eligible (% of Seen) | 3·Flat-OK (% of Elig) | 4·$-OK (% of Flat) | 5·Promoted | Bottleneck |
|---|---|---|---|---|---|---|
| MLB | 128 | 58 (45%) | 20 (34%) | 12 (60%) | **20** | edge (Eligible→Flat-OK) 66% |
| NBA | 210 | 108 (51%) | 44 (41%) | 29 (66%) | **44** | edge (Eligible→Flat-OK) 59% |
| NHL | 105 | 43 (41%) | 12 (28%) | 9 (75%) | **12** | edge (Eligible→Flat-OK) 72% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 42 | 4 (9.5%) | 3 (7.1%) | 0 (0.0%) |
| MLB | 7-day | 110 | 13 (11.8%) | 12 (10.9%) | 2 (1.8%) |
| MLB | All-time | 540 | 164 (30.4%) | 150 (27.8%) | 18 (3.3%) |
| NBA | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NBA | 7-day | 1 | 1 (100.0%) | 1 (100.0%) | 1 (100.0%) |
| NBA | All-time | 126 | 83 (65.9%) | 69 (54.8%) | 34 (27.0%) |
| NHL | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NHL | 7-day | 2 | 1 (50.0%) | 1 (50.0%) | 0 (0.0%) |
| NHL | All-time | 49 | 21 (42.9%) | 20 (40.8%) | 5 (10.2%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 42 | 4 (9.5%) | 3 (7.1%) | 0 (0.0%) |
| 7-day | 113 | 15 (13.3%) | 14 (12.4%) | 3 (2.7%) |
| All-time | 715 | 268 (37.5%) | 239 (33.4%) | 57 (8.0%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...be17` | 1 | +6.95 | 23 | -60% |
| `...fc26` | 1 | +0.91 | 22 | 0% |
| `...be00` | 1 | +0.87 | 15 | 10% |
| `...9373` | 1 | +0.87 | 0 | — |
| `...9b3c` | 1 | +0.77 | 8 | 52% |
| `...8d26` | 1 | +0.72 | 5 | -22% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...afd2` | 41 | 51% | -0.5% | 177 | -20% |
| `...2768` | 48 | 48% | -0.8% | 76 | 13% |
| `...135d` | 335 | 51% | -2.8% | 375 | 7% |
| `...2a9e` | 86 | 50% | -4.3% | 163 | 28% |
| `...0232` | 4 | 50% | -4.5% | 11 | 30% |
| `...9d74` | 48 | 50% | -5.4% | 285 | -13% |

#### NBA

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...bf5d` | 1 | +3.15 | 3 | 42% |
| `...ed41` | 1 | +3.15 | 3 | 3% |
| `...6b87` | 1 | +2.05 | 8 | -27% |
| `...c556` | 1 | +0.93 | 3 | 42% |
| `...5c69` | 1 | +0.91 | 2 | 28% |
| `...b989` | 1 | +0.88 | 21 | -90% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...d814` | 8 | 50% | -0.5% | 53 | 1% |
| `...1e50` | 4 | 50% | -1.2% | 29 | 46% |
| `...65dd` | 6 | 50% | -2.4% | 17 | 27% |
| `...853d` | 40 | 53% | -2.7% | 90 | -2% |
| `...1697` | 17 | 53% | -3.5% | 34 | 9% |
| `...11a4` | 20 | 45% | -3.6% | 72 | 54% |

#### NHL

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...2e78` | 1 | +1.46 | 0 | — |
| `...017f` | 1 | +1.45 | 6 | 108% |
| `...32f2` | 1 | +1.40 | 0 | — |
| `...e0fd` | 1 | +1.20 | 3 | 124% |
| `...266e` | 1 | +1.05 | 0 | — |
| `...2194` | 1 | +1.05 | 0 | — |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...33ee` | 4 | 50% | -0.3% | 8 | -23% |
| `...df91` | 14 | 50% | -1.6% | 49 | -36% |
| `...afd2` | 6 | 50% | -1.9% | 26 | -17% |
| `...192c` | 7 | 43% | -2.9% | 21 | -15% |
| `...35e3` | 7 | 57% | -5.5% | 26 | 31% |
| `...618e` | 2 | 50% | -6.1% | 28 | 24% |

### §5g. v2 wallet-promotion pipeline (Source-A / Source-B mix)

Live snapshot of the v2 promotion gate (shipped 2026-05-10, re-eval **2026-05-24**). Each FLAT-or-better wallet × sport pair is attributed to one of three paths via `sharpWalletProfiles[wallet].bySport[sport].whitelistSource`:

- **A** — flat-positive on featured picks (Source A) only — the v1 gate
- **A+B** — flat-positive in both sources (most reliable signal)
- **B** — flat-positive on-chain only (NEW in v2 — the trial lift)

Re-classified every 2h via `grade-sharp-actions` cron. Roll-back: set `B_ONLY_MIN_BETS = Infinity` in `scripts/exportWalletProfiles.js`.

#### Source mix per sport (live Firestore)

| Sport | A | A+B | B (new) | FLAT-or-better total | % from B-only |
|---|---|---|---|---|---|
| MLB | 8 | 15 | **27** | 50 | 54.0% |
| NBA | 10 | 34 | **39** | 83 | 47.0% |
| NHL | 4 | 8 | **17** | 29 | 58.6% |
| **ALL** | **22** | **57** | **83** | **162** | **51.2%** |

#### Pipeline freshness

- `sharp_action_positions` GRADED rows: **15660**
- `sharp_action_positions` PENDING rows: **415** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 6/20/2026, 6:11:55 AM ET — **285 min · STALE** — check grade-sharp-actions workflow

**Alarms**: pending > 200 OR rebuild lag > 4h → cron is lagging or failing — check `gh run list --workflow="Grade Sharp Actions"`.

#### B-only roster — wallets currently promoted via Source B path only

Wallets here would have been EXCLUDED under v1 (Source-A-only). Top by Source-B bet count per sport. The 2-week re-eval (2026-05-24) will compare these wallets' realized lift against A-only and A+B cohorts.

**MLB** — 27 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...9a27` | CONFIRMED | 467 | +12.3% | +4.4% |
| `...135d` | CONFIRMED | 375 | +2.1% | +6.8% |
| `...3532` | CONFIRMED | 324 | +1.6% | +6% |
| `...1e50` | CONFIRMED | 249 | +0.8% | +2.4% |
| `...1eae` | FLAT | 147 | +3.1% | -1.4% |
| `...c684` | FLAT | 85 | +6.6% | -2.2% |
| `...69c2` | CONFIRMED | 66 | +17.4% | +1% |
| `...ad50` | CONFIRMED | 53 | +14.4% | +7.7% |
| `...39b3` | CONFIRMED | 40 | +4.1% | +1.8% |
| `...d6d2` | FLAT | 38 | +6.8% | -25.5% |
| … | 17 more | | | |

**NBA** — 39 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...cff6` | CONFIRMED | 112 | +3.2% | +31.8% |
| `...135d` | FLAT | 104 | +5% | -10.6% |
| `...11a4` | CONFIRMED | 72 | +23.3% | +54.4% |
| `...3782` | CONFIRMED | 70 | +2.3% | +0.4% |
| `...9d74` | FLAT | 50 | +2.3% | -14.4% |
| `...935c` | FLAT | 50 | +17.3% | -21.4% |
| `...68b3` | CONFIRMED | 44 | +33.9% | +13.9% |
| `...b6ef` | CONFIRMED | 42 | +6.3% | +3.3% |
| `...e2ce` | CONFIRMED | 40 | +15.2% | +22.9% |
| `...0563` | CONFIRMED | 37 | +4.9% | +41.7% |
| … | 29 more | | | |

**NHL** — 17 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...1697` | CONFIRMED | 52 | +8.5% | +7.1% |
| `...618e` | CONFIRMED | 28 | +6.2% | +23.8% |
| `...35e3` | CONFIRMED | 26 | +10.6% | +31.5% |
| `...5eee` | CONFIRMED | 23 | +30.5% | +19.3% |
| `...192c` | FLAT | 21 | +14% | -15.2% |
| `...0c2e` | FLAT | 17 | +24.3% | -7% |
| `...2ca8` | CONFIRMED | 10 | +26.9% | +14% |
| `...600d` | CONFIRMED | 9 | +69% | +75.8% |
| `...a9cc` | CONFIRMED | 7 | +49.5% | +46.9% |
| `...aeea` | CONFIRMED | 7 | +90.8% | +87.7% |
| … | 7 more | | | |

### §5 — How to read

- **Roster growth flat in 7-day** + **funnel bottleneck = `data`** → re-run `exportWalletProfiles.js`. The flat-positive wallets are stuck at FLAT because Source-B coverage hasn't caught up. CONFIRMED gate is data-bound, not skill-bound.
- **Roster growth flat in 7-day** + **funnel bottleneck = `sample`** → wallets aren't reaching `≥2` reps fast enough. This is a slate-density problem; consider a soft `MIN_BETS = 1` shadow lane to surface bubble wallets earlier.
- **Roster shrank** (negative delta) → a previously CONFIRMED wallet just dropped flat-positive (lost a recent bet). Variance, not failure — but worth noting if a sport loses ≥3 in a week.
- **HC density on a sport drops below ~30%** → v7.3 promotions there will starve. Either the proven roster needs more CONFIRMED-tier wallets sizing aggressively, or the HC_RATIO (1.5) needs a sport-specific tune.
- **§5g B-only count drops sharply** → wallets are demoting off the B path (losing on-chain). Cross-check `WALLET_PROFILES_SUMMARY.md` churn section for the specific demotions.
- **§5g pipeline freshness lag > 4h** → grade-sharp-actions cron is failing. Check `gh run list --workflow="Grade Sharp Actions"` and re-trigger if needed.

---
## §6. Daily proven-wallet performance

Who on the proven roster is actually printing — yesterday's bets, the rolling leaderboard (`$ PnL`-ranked), current streaks, and per-sport volume. **Proven** = `CONFIRMED` ∪ `FLAT` per sport (the same gate that drives Δ_winner). A wallet only counts in a sport where it's on that sport's proven list.

### §6a. Yesterday's proven-wallet bets

Slate: **2026-06-19** · 37 bets · 10 distinct proven wallets · WR 65% · $ vol $317.2K · $ PnL $118.8K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...64aa` (CONFIRMED) | MLB | ML | Minnesota Twins @ Arizona Diamondbacks | $46.8K | **W** | $27.9K |
| `...64aa` (CONFIRMED) | MLB | ML | St. Louis Cardinals @ Kansas City Royals | $21.1K | **W** | $21.6K |
| `...64aa` (CONFIRMED) | MLB | ML | Chicago White Sox @ Detroit Tigers | $40.0K | **W** | $19.1K |
| `...64aa` (CONFIRMED) | MLB | ML | Cleveland Guardians @ Houston Astros | $16.8K | **W** | $17.9K |
| `...0ff5` (FLAT) | MLB | ML | Milwaukee Brewers @ Atlanta Braves | $10.0K | **W** | $14.7K |
| `...64aa` (CONFIRMED) | MLB | ML | San Diego Padres @ Texas Rangers | $18.0K | **W** | $11.8K |
| `...d227` (CONFIRMED) | MLB | SPREAD | St. Louis Cardinals @ Kansas City Royals | $11.2K | **W** | $10.2K |
| `...2f63` (FLAT) | MLB | ML | Cincinnati Reds @ New York Yankees | $3.7K | **W** | $8.9K |
| `...1f30` (CONFIRMED) | MLB | ML | Boston Red Sox @ Seattle Mariners | $8.5K | **W** | $8.5K |
| `...8f33` (CONFIRMED) | MLB | SPREAD | Chicago White Sox @ Detroit Tigers | $7.2K | **W** | $6.1K |
| `...2f63` (FLAT) | MLB | ML | Milwaukee Brewers @ Atlanta Braves | $3.8K | **W** | $5.7K |
| `...abaf` (CONFIRMED) | MLB | ML | Washington Nationals @ Tampa Bay Rays | $8.2K | **W** | $5.5K |
| `...8f33` (CONFIRMED) | MLB | TOTAL | Baltimore Orioles @ Los Angeles Dodgers | $6.0K | **W** | $5.3K |
| `...2f63` (FLAT) | MLB | ML | Baltimore Orioles @ Los Angeles Dodgers | $10.4K | **W** | $5.2K |
| `...2f63` (FLAT) | MLB | SPREAD | Milwaukee Brewers @ Atlanta Braves | $3.7K | **W** | $3.8K |
| `...8f33` (CONFIRMED) | MLB | SPREAD | Cincinnati Reds @ New York Yankees | $4.0K | **W** | $3.1K |
| `...d227` (CONFIRMED) | MLB | SPREAD | Boston Red Sox @ Seattle Mariners | $5.7K | **W** | $2.9K |
| `...23c4` (FLAT) | MLB | TOTAL | Boston Red Sox @ Seattle Mariners | $3.3K | **W** | $2.8K |
| `...8f33` (CONFIRMED) | MLB | ML | Minnesota Twins @ Arizona Diamondbacks | $4.3K | **W** | $2.6K |
| `...d227` (CONFIRMED) | MLB | SPREAD | Cincinnati Reds @ New York Yankees | $3.1K | **W** | $2.4K |
| `...8f33` (CONFIRMED) | MLB | SPREAD | Minnesota Twins @ Arizona Diamondbacks | $1.7K | **W** | $2.2K |
| `...88a3` (CONFIRMED) | MLB | ML | Baltimore Orioles @ Los Angeles Dodgers | $3.0K | **W** | $1.5K |
| `...2f63` (FLAT) | MLB | ML | Washington Nationals @ Tampa Bay Rays | $1.9K | **W** | $1.3K |
| `...88a3` (CONFIRMED) | MLB | ML | Minnesota Twins @ Arizona Diamondbacks | $1.6K | **W** | $960 |
| `...381f` (FLAT) | MLB | TOTAL | Cincinnati Reds @ New York Yankees | $1.1K | L | -$1.1K |
| `...2f63` (FLAT) | MLB | TOTAL | Toronto Blue Jays @ Chicago Cubs | $2.6K | L | -$2.6K |
| `...2f63` (FLAT) | MLB | ML | Chicago White Sox @ Detroit Tigers | $2.6K | L | -$2.6K |
| `...8f33` (CONFIRMED) | MLB | ML | Los Angeles Angels @ Athletics | $2.7K | L | -$2.7K |
| `...8f33` (CONFIRMED) | MLB | SPREAD | Milwaukee Brewers @ Atlanta Braves | $3.4K | L | -$3.4K |
| `...8f33` (CONFIRMED) | MLB | ML | St. Louis Cardinals @ Kansas City Royals | $3.4K | L | -$3.4K |
| `...8f33` (CONFIRMED) | MLB | ML | Milwaukee Brewers @ Atlanta Braves | $4.3K | L | -$4.3K |
| `...1f30` (CONFIRMED) | MLB | ML | Chicago White Sox @ Detroit Tigers | $5.0K | L | -$5.0K |
| `...1f30` (CONFIRMED) | MLB | TOTAL | Cincinnati Reds @ New York Yankees | $6.1K | L | -$6.1K |
| `...8f33` (CONFIRMED) | MLB | TOTAL | Pittsburgh Pirates @ Colorado Rockies | $6.3K | L | -$6.3K |
| `...8f33` (CONFIRMED) | MLB | TOTAL | Toronto Blue Jays @ Chicago Cubs | $7.0K | L | -$7.0K |
| `...64aa` (CONFIRMED) | MLB | ML | Boston Red Sox @ Seattle Mariners | $8.1K | L | -$8.1K |
| `...64aa` (CONFIRMED) | MLB | ML | Washington Nationals @ Tampa Bay Rays | $20.7K | L | -$20.7K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 12 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 4 | 75% | 1.3 | +1.27 | +32% | $122.3K | $52.6K | +43% | 3W |
| 2 | `...2f63` | FLAT | 19 | 74% | 6.3 | +9.76 | +51% | $68.2K | $39.7K | +58% | 1W |
| 3 | `...0ff5` | FLAT | 2 | 100% | 0.7 | +2.62 | +131% | $19.3K | $25.4K | +132% | 2W |
| 4 | `...64aa` | CONFIRMED | 10 | 60% | 3.3 | +0.39 | +4% | $243.8K | $15.3K | +6% | 1L |
| 5 | `...23c4` | FLAT | 2 | 100% | 0.7 | +1.95 | +98% | $12.5K | $12.9K | +104% | 2W |
| 6 | `...d227` | CONFIRMED | 5 | 80% | 1.7 | +1.75 | +35% | $45.6K | $12.2K | +27% | 3W |
| 7 | `...8f33` | CONFIRMED | 22 | 50% | 7.3 | -1.32 | -6% | $111.1K | $1.7K | +1% | 3L |
| 8 | `...aeea` | FLAT | 1 | 100% | 1.0 | +0.72 | +72% | $1.5K | $1.1K | +72% | 1W |
| 9 | `...381f` | FLAT | 2 | 50% | 0.7 | +0.30 | +15% | $2.0K | $232 | +11% | 1L |
| 10 | `...88a3` | CONFIRMED | 4 | 75% | 2.0 | +0.67 | +17% | $10.0K | -$29 | -0% | 3W |
| 11 | `...1f30` | CONFIRMED | 5 | 40% | 1.7 | -0.70 | -14% | $30.8K | -$5.8K | -19% | 2L |
| 12 | `...5213` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $49.4K | -$49.4K | -100% | 1L |

#### §6b-2. 7-day

**MLB** — 14 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...64aa` | CONFIRMED | 33 | 58% | 4.7 | +1.05 | +3% | $608.7K | $91.3K | +15% | 1L |
| 2 | `...d227` | CONFIRMED | 13 | 77% | 1.9 | +8.15 | +63% | $111.7K | $59.4K | +53% | 3W |
| 3 | `...2f63` | FLAT | 27 | 63% | 5.4 | +7.50 | +28% | $90.9K | $33.6K | +37% | 1W |
| 4 | `...8f33` | CONFIRMED | 56 | 57% | 8.0 | +2.95 | +5% | $256.3K | $29.7K | +12% | 3L |
| 5 | `...0ff5` | FLAT | 3 | 67% | 0.6 | +1.62 | +54% | $28.6K | $16.2K | +56% | 2W |
| 6 | `...aeea` | FLAT | 4 | 75% | 0.7 | +2.13 | +53% | $12.7K | $6.8K | +53% | 3W |
| 7 | `...88a3` | CONFIRMED | 6 | 83% | 1.0 | +2.15 | +36% | $15.6K | $4.0K | +25% | 3W |
| 8 | `...381f` | FLAT | 2 | 50% | 0.7 | +0.30 | +15% | $2.0K | $232 | +11% | 1L |
| 9 | `...1f30` | CONFIRMED | 16 | 38% | 2.3 | -4.36 | -27% | $117.5K | -$6.5K | -6% | 2L |
| 10 | `...fc82` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $14.2K | -$14.2K | -100% | 1L |
| 11 | `...abaf` | CONFIRMED | 10 | 40% | 1.4 | -2.82 | -28% | $239.7K | -$30.3K | -13% | 3W |
| 12 | `...bba3` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $32.5K | -$32.5K | -100% | 1L |
| 13 | `...5213` | CONFIRMED | 5 | 40% | 1.7 | -1.10 | -22% | $155.1K | -$69.1K | -45% | 2L |
| 14 | `...23c4` | FLAT | 16 | 50% | 2.3 | -0.95 | -6% | $357.1K | -$154.9K | -43% | 3W |

**NBA** — 15 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...e8f1` | CONFIRMED | 1 | 100% | 1.0 | +0.52 | +52% | $48.9K | $25.4K | +52% | 1W |
| 2 | `...66f5` | CONFIRMED | 1 | 100% | 1.0 | +0.52 | +52% | $18.2K | $9.5K | +52% | 1W |
| 3 | `...3532` | FLAT | 1 | 100% | 1.0 | +0.99 | +99% | $4.8K | $4.7K | +99% | 1W |
| 4 | `...00bc` | CONFIRMED | 1 | 100% | 1.0 | +0.98 | +98% | $3.7K | $3.6K | +98% | 1W |
| 5 | `...c933` | CONFIRMED | 1 | 100% | 1.0 | +0.52 | +52% | $5.2K | $2.7K | +52% | 1W |
| 6 | `...684d` | CONFIRMED | 1 | 100% | 1.0 | +0.98 | +98% | $1.6K | $1.6K | +98% | 1W |
| 7 | `...03d4` | CONFIRMED | 1 | 100% | 1.0 | +0.52 | +52% | $3.0K | $1.6K | +52% | 1W |
| 8 | `...39b3` | CONFIRMED | 2 | 100% | 2.0 | +1.50 | +75% | $1.0K | $760 | +75% | 2W |
| 9 | `...9ef0` | CONFIRMED | 1 | 100% | 1.0 | +0.52 | +52% | $734 | $382 | +52% | 1W |
| 10 | `...2f63` | FLAT | 3 | 33% | 3.0 | -1.02 | -34% | $14.5K | -$14.2K | -98% | 1L |
| 11 | `...3f67` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $27.7K | -$27.7K | -100% | 1L |
| 12 | `...c991` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $63.0K | -$63.0K | -100% | 1L |
| 13 | `...0c2e` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $96.0K | -$96.0K | -100% | 1L |
| 14 | `...8da5` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $99.8K | -$99.8K | -100% | 1L |
| 15 | `...e3d0` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $566.3K | -$566.3K | -100% | 1L |

**NHL** — 2 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2125` | CONFIRMED | 2 | 100% | 2.0 | +1.75 | +88% | $46.9K | $41.0K | +87% | 2W |
| 2 | `...3532` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $18.8K | -$18.8K | -100% | 1L |

#### §6b-3. All-time

**MLB** — 20 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 59 | 53% | 1.7 | +7.74 | +13% | $1.40M | $884.3K | +63% | 3W |
| 2 | `...3987` | CONFIRMED | 44 | 68% | 4.0 | +14.19 | +32% | $2.29M | $666.8K | +29% | 1L |
| 3 | `...64aa` | CONFIRMED | 249 | 56% | 4.0 | +4.71 | +2% | $4.48M | $288.6K | +6% | 1L |
| 4 | `...5213` | CONFIRMED | 14 | 71% | 0.9 | +5.17 | +37% | $541.2K | $225.2K | +42% | 2L |
| 5 | `...fc82` | FLAT | 27 | 52% | 0.5 | +0.41 | +2% | $556.2K | $139.9K | +25% | 1L |
| 6 | `...8f33` | CONFIRMED | 106 | 57% | 3.9 | +6.26 | +6% | $576.2K | $87.5K | +15% | 3L |
| 7 | `...2f63` | FLAT | 134 | 51% | 2.4 | +2.14 | +2% | $711.4K | $78.3K | +11% | 1W |
| 8 | `...d227` | CONFIRMED | 25 | 64% | 0.5 | +6.58 | +26% | $231.8K | $53.1K | +23% | 3W |
| 9 | `...1f30` | CONFIRMED | 42 | 50% | 2.2 | +0.47 | +1% | $288.7K | $34.7K | +12% | 2L |
| 10 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 11 | `...0ff5` | FLAT | 38 | 55% | 1.0 | +4.25 | +11% | $261.7K | $17.4K | +7% | 2W |
| 12 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 13 | `...aeea` | FLAT | 17 | 59% | 0.3 | +1.91 | +11% | $45.3K | $13.3K | +29% | 3W |
| 14 | `...88a3` | CONFIRMED | 13 | 77% | 0.8 | +5.03 | +39% | $30.8K | $9.7K | +32% | 3W |
| 15 | `...a240` | CONFIRMED | 3 | 67% | 0.1 | +0.85 | +28% | $6.7K | $2.5K | +38% | 1W |

**NBA** — 44 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 26 | 62% | 0.5 | +6.33 | +24% | $2.75M | $945.0K | +34% | 1W |
| 2 | `...9a27` | CONFIRMED | 89 | 57% | 2.2 | +4.08 | +5% | $2.68M | $425.9K | +16% | 4L |
| 3 | `...aeeb` | CONFIRMED | 60 | 60% | 1.1 | +8.98 | +15% | $1.23M | $257.3K | +21% | 2W |
| 4 | `...b032` | CONFIRMED | 7 | 86% | 0.7 | +5.40 | +77% | $244.0K | $249.9K | +102% | 3W |
| 5 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +5.66 | +283% | $141.8K | $241.7K | +170% | 2W |
| 6 | `...e8f1` | CONFIRMED | 21 | 48% | 0.4 | +2.25 | +11% | $877.2K | $197.2K | +22% | 2W |
| 7 | `...be3d` | CONFIRMED | 5 | 60% | 0.4 | +0.03 | +1% | $821.5K | $180.0K | +22% | 1L |
| 8 | `...32f2` | CONFIRMED | 10 | 50% | 0.2 | +1.86 | +19% | $146.1K | $127.3K | +87% | 1W |
| 9 | `...02c3` | CONFIRMED | 6 | 33% | 0.9 | +0.75 | +13% | $681.1K | $104.0K | +15% | 3L |
| 10 | `...b814` | CONFIRMED | 3 | 100% | 0.4 | +0.56 | +19% | $431.9K | $81.3K | +19% | 3W |
| 11 | `...1a56` | CONFIRMED | 6 | 83% | 0.2 | +5.44 | +91% | $53.7K | $74.4K | +139% | 1L |
| 12 | `...23c4` | CONFIRMED | 23 | 61% | 0.6 | +4.81 | +21% | $784.6K | $70.7K | +9% | 3W |
| 13 | `...66f5` | CONFIRMED | 17 | 59% | 0.4 | +5.02 | +30% | $332.9K | $64.5K | +19% | 3W |
| 14 | `...5143` | FLAT | 13 | 62% | 0.4 | +3.27 | +25% | $798.4K | $57.5K | +7% | 1L |
| 15 | `...ad50` | FLAT | 3 | 100% | 1.5 | +2.74 | +91% | $50.6K | $45.5K | +90% | 3W |

**NHL** — 12 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...66f5` | FLAT | 2 | 100% | 0.7 | +2.30 | +115% | $78.8K | $107.6K | +137% | 2W |
| 2 | `...2125` | CONFIRMED | 17 | 65% | 0.7 | +4.26 | +25% | $183.4K | $80.3K | +44% | 3W |
| 3 | `...3532` | FLAT | 22 | 64% | 0.4 | +7.85 | +36% | $384.6K | $70.3K | +18% | 1L |
| 4 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +1.88 | +94% | $88.2K | $46.9K | +53% | 2W |
| 5 | `...cea1` | CONFIRMED | 3 | 67% | 0.4 | +0.62 | +21% | $27.7K | $22.1K | +80% | 1W |
| 6 | `...a240` | CONFIRMED | 28 | 64% | 0.5 | +6.46 | +23% | $92.1K | $19.0K | +21% | 1W |
| 7 | `...c67e` | CONFIRMED | 4 | 75% | 0.2 | +2.82 | +71% | $20.7K | $12.5K | +60% | 1W |
| 8 | `...9d74` | CONFIRMED | 5 | 60% | 0.1 | +0.84 | +17% | $15.0K | $5.2K | +35% | 1L |
| 9 | `...935c` | CONFIRMED | 4 | 75% | 1.0 | +2.11 | +53% | $1.3K | $953 | +74% | 3W |
| 10 | `...0853` | CONFIRMED | 9 | 67% | 0.3 | +2.66 | +30% | $250.0K | -$11.1K | -4% | 1W |
| 11 | `...1187` | FLAT | 8 | 75% | 0.2 | +3.52 | +44% | $153.0K | -$25.2K | -16% | 2L |
| 12 | `...c12b` | CONFIRMED | 11 | 73% | 0.3 | +4.45 | +40% | $504.9K | -$27.5K | -5% | 2W |

### §6c. Active streaks (≥3 in a row, last bet within 3 days)

Proven `(wallet × sport)` pairs currently riding a 3-or-more-bet run with their most recent bet inside the last 3 calendar days. Hot-hand monitor — and the same surface for cold streaks worth fading.

| Wallet | Sport | Tier | Streak | Last bet | All-time bets | WR% | $ PnL | $ ROI |
|---|---|---|---|---|---|---|---|---|
| `...abaf` | MLB | CONFIRMED | **3W** | 2026-06-19 | 59 | 53% | $884.3K | +63% |
| `...8f33` | MLB | CONFIRMED | **3L** | 2026-06-19 | 106 | 57% | $87.5K | +15% |
| `...d227` | MLB | CONFIRMED | **3W** | 2026-06-19 | 25 | 64% | $53.1K | +23% |
| `...aeea` | MLB | FLAT | **3W** | 2026-06-18 | 17 | 59% | $13.3K | +29% |
| `...88a3` | MLB | CONFIRMED | **3W** | 2026-06-19 | 13 | 77% | $9.7K | +32% |
| `...23c4` | MLB | FLAT | **3W** | 2026-06-19 | 84 | 54% | -$329.0K | -17% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-06-06 | 27 · $727.4K · $32.7K | 24 · $720.3K · $32.2K | — | 3 · $7.1K · $568 |
| 2026-06-07 | 42 · $827.6K · $286.0K | 42 · $827.6K · $286.0K | — | — |
| 2026-06-08 | 36 · $1.13M · $404.7K | 20 · $399.7K · $131.3K | 16 · $728.8K · $273.4K | — |
| 2026-06-09 | 36 · $714.7K · $16.7K | 31 · $663.8K · -$19.6K | — | 5 · $50.9K · $36.2K |
| 2026-06-10 | 55 · $1.50M · $179.9K | 35 · $436.3K · -$15.7K | 20 · $1.07M · $195.6K | — |
| 2026-06-11 | 19 · $350.0K · -$136.6K | 15 · $291.3K · -$129.9K | — | 4 · $58.8K · -$6.7K |
| 2026-06-12 | 29 · $295.5K · -$22.8K | 29 · $295.5K · -$22.8K | — | — |
| 2026-06-13 | 48 · $1.26M · -$765.4K | 30 · $310.6K · $51.4K | 18 · $954.4K · -$816.8K | — |
| 2026-06-14 | 22 · $196.5K · -$16.9K | 19 · $130.7K · -$39.1K | — | 3 · $65.7K · $22.2K |
| 2026-06-15 | 30 · $356.0K · -$34.6K | 30 · $356.0K · -$34.6K | — | — |
| 2026-06-16 | 37 · $528.9K · -$150.2K | 37 · $528.9K · -$150.2K | — | — |
| 2026-06-17 | 26 · $203.1K · -$58.8K | 26 · $203.1K · -$58.8K | — | — |
| 2026-06-18 | 14 · $196.3K · $45.8K | 14 · $196.3K · $45.8K | — | — |
| 2026-06-19 | 37 · $317.2K · $118.8K | 37 · $317.2K · $118.8K | — | — |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-06-19_
