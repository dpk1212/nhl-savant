# Sharp Intel v6 — Daily Master Report

_Auto-generated **7/3/2026, 10:57:58 AM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (331 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-07-02** · 22 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 22 | 7-15-0 | 31.8% | -18.39u | -8.43u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Cincinnati Reds @ Milwaukee Brewers | Milwaukee Brewers | 2.5★ · 0.25u | +0 | -2 | -2 | -4 | -185 | L | -0.25u |
| MLB | ML | Detroit Tigers @ Texas Rangers | Detroit Tigers | 3.0★ · 0.50u | +0 | -1 | +1 | +0 | -104 | L | -0.50u |
| MLB | ML | Miami Marlins @ Colorado Rockies | Miami Marlins | 5.0★ · 5.00u | +0 | +2 | +3 | +5 | -138 | L | -5.00u |
| MLB | ML | Pittsburgh Pirates @ Philadelphia Phillies | Pittsburgh Pirates | 5.0★ · 2.50u | +1 | +1 | +0 | +1 | +115 | **W** | +2.88u |
| MLB | ML | St. Louis Cardinals @ Atlanta Braves | Atlanta Braves | 4.0★ · 1.00u | +0 | -2 | +0 | -2 | -113 | L | -1.00u |
| MLB | ML | Tampa Bay Rays @ Kansas City Royals | Tampa Bay Rays | 4.0★ · 1.00u | +1 | +2 | +2 | +4 | -122 | **W** | +4.17u |
| MLB | SPREAD | Cincinnati Reds @ Milwaukee Brewers | Cincinnati Reds | 4.0★ · 1.00u | +1 | +1 | +0 | +1 | -139 | **W** | +2.86u |
| MLB | SPREAD | Chicago White Sox @ Cleveland Guardians | Chicago White Sox | 4.5★ · 1.50u | +0 | +0 | +0 | +0 | +140 | L | -1.50u |
| MLB | SPREAD | Los Angeles Angels @ Seattle Mariners | Seattle Mariners | 4.0★ · 1.00u | +0 | +0 | +0 | +0 | +113 | L | -1.00u |
| MLB | SPREAD | Miami Marlins @ Colorado Rockies | Miami Marlins | 4.0★ · 1.00u | +0 | +1 | +1 | +2 | +118 | L | -1.00u |
| MLB | SPREAD | San Diego Padres @ Los Angeles Dodgers | San Diego Padres | 4.0★ · 1.00u | +0 | +1 | +1 | +2 | -126 | L | -1.00u |
| MLB | SPREAD | St. Louis Cardinals @ Atlanta Braves | Atlanta Braves | 2.5★ · 0.25u | +0 | +0 | +2 | +2 | +184 | L | -0.25u |
| MLB | TOTAL | Cincinnati Reds @ Milwaukee Brewers | Under 6.5 | 4.5★ · 3.00u | +0 | +2 | +3 | +5 | -110 | L | -3.00u |
| MLB | TOTAL | Chicago White Sox @ Cleveland Guardians | Under 8.5 | 5.0★ · 5.00u | +0 | +1 | +1 | +2 | -110 | L | -5.00u |
| MLB | TOTAL | Detroit Tigers @ Texas Rangers | Under 7.5 | 5.0★ · 5.00u | +2 | +6 | +4 | +10 | -110 | L | -5.00u |
| MLB | TOTAL | Los Angeles Angels @ Seattle Mariners | Under 7.5 | 2.5★ · 0.25u | +0 | +2 | +2 | +4 | -110 | **W** | +2.70u |
| MLB | TOTAL | Miami Marlins @ Colorado Rockies | Over 12.5 | 2.5★ · 0.25u | +0 | +0 | +0 | +0 | -110 | **W** | +0.00u |
| MLB | TOTAL | Pittsburgh Pirates @ Philadelphia Phillies | Over 9.5 | 5.0★ · 5.00u | +0 | +4 | +4 | +8 | -110 | L | -5.00u |
| MLB | TOTAL | San Diego Padres @ Los Angeles Dodgers | Over 9.5 | 5.0★ · 1.00u | +0 | +3 | +2 | +5 | +106 | **W** | +0.00u |
| MLB | TOTAL | St. Louis Cardinals @ Atlanta Braves | Under 8.5 | 4.0★ · 1.00u | +0 | +0 | +0 | +0 | -110 | L | -1.00u |
| MLB | TOTAL | Tampa Bay Rays @ Kansas City Royals | Over 10.5 | 4.5★ · 3.00u | +0 | -1 | -1 | -2 | -110 | L | -3.00u |
| SOC | ML | Algeria @ Switzerland | Switzerland | 2.5★ · 0.25u | +0 | +2 | +2 | +4 | +100 | **W** | +2.50u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **73** shipped · 34-38-1 · WR 47.2% · PnL -12.10u (peak) / -5.03u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 73)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 4 | 3-1-0 | 75.0% | +8.34u | +0.96u |
| HC = +2 | 6 | 3-3-0 | 50.0% | +0.21u | +0.08u |
| HC = +1 | 13 | 8-5-0 | 61.5% | +8.14u | +2.08u |
| HC = 0 | 46 | 18-27-1 | 40.0% | -30.34u | -9.40u |
| HC ≤ −1 | 4 | 2-2-0 | 50.0% | +1.55u | +1.25u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 18 | 11-7-0 | 61.1% | +4.68u | +2.95u |
| +2 | 13 | 6-6-1 | 50.0% | -2.88u | -0.83u |
| +1 | 21 | 12-9-0 | 57.1% | -2.41u | +2.89u |
| 0 | 13 | 3-10-0 | 23.1% | -8.04u | -7.29u |
| −1 | 5 | 1-4-0 | 20.0% | -4.50u | -3.05u |
| ≤ −2 | 3 | 1-2-0 | 33.3% | +1.05u | +0.30u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 11 | 5-6-0 | 45.5% | -9.74u | -2.29u |
| +2 | 10 | 6-4-0 | 60.0% | +9.90u | +1.89u |
| +1 | 17 | 5-11-1 | 31.3% | -9.08u | -6.86u |
| 0 | 22 | 10-12-0 | 45.5% | -14.62u | -1.96u |
| −1 | 11 | 7-4-0 | 63.6% | +9.39u | +2.89u |
| ≤ −2 | 2 | 1-1-0 | 50.0% | +2.05u | +1.30u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 73)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 59 | 28-30-1 | 48.3% | -17.40u | -3.70u |
| WEAK   (−1 .. 0) | 14 | 6-8-0 | 42.9% | +5.30u | -1.33u |

### §2b. 7-day

Total: **163** shipped · 77-84-2 · WR 47.8% · PnL -27.71u (peak) / -18.53u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 163)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 7 | 5-2-0 | 71.4% | +11.03u | +1.48u |
| HC = +2 | 12 | 6-6-0 | 50.0% | +8.03u | -1.09u |
| HC = +1 | 26 | 17-9-0 | 65.4% | +9.56u | +3.58u |
| HC = 0 | 113 | 47-64-2 | 42.3% | -57.38u | -22.76u |
| HC ≤ −1 | 5 | 2-3-0 | 40.0% | +1.05u | +0.25u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 29 | 17-12-0 | 58.6% | +10.88u | +1.55u |
| +2 | 22 | 14-7-1 | 66.7% | +8.93u | +3.95u |
| +1 | 64 | 28-36-0 | 43.8% | -28.39u | -10.82u |
| 0 | 35 | 14-21-0 | 40.0% | -15.18u | -9.82u |
| −1 | 9 | 3-5-1 | 37.5% | -4.75u | -2.69u |
| ≤ −2 | 4 | 1-3-0 | 25.0% | +0.80u | -0.70u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 20 | 13-7-0 | 65.0% | +2.57u | +2.03u |
| +2 | 15 | 9-6-0 | 60.0% | +10.79u | +2.36u |
| +1 | 54 | 22-31-1 | 41.5% | -26.16u | -13.43u |
| 0 | 53 | 22-30-1 | 42.3% | -22.90u | -10.64u |
| −1 | 17 | 9-8-0 | 52.9% | +6.19u | -0.05u |
| ≤ −2 | 4 | 2-2-0 | 50.0% | +1.80u | +1.21u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 163)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 133 | 67-65-1 | 50.8% | -20.26u | -10.05u |
| WEAK   (−1 .. 0) | 30 | 10-19-1 | 34.5% | -7.45u | -8.48u |

### §2c. All-time

Total: **1016** shipped · 503-503-10 · WR 50.0% · PnL -207.95u (peak) / -51.95u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 905)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 22 | 9-13-0 | 40.9% | +2.83u | -7.57u |
| HC = +2 | 45 | 23-22-0 | 51.1% | +6.90u | -1.47u |
| HC = +1 | 201 | 119-82-0 | 59.2% | +33.51u | +22.26u |
| HC = 0 | 600 | 281-310-9 | 47.5% | -252.86u | -61.93u |
| HC ≤ −1 | 36 | 20-16-0 | 55.6% | +12.27u | +5.55u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 151 | 78-73-0 | 51.7% | -4.93u | -1.36u |
| +2 | 177 | 90-85-2 | 51.4% | -24.14u | -3.68u |
| +1 | 404 | 208-193-3 | 51.9% | -99.37u | -6.57u |
| 0 | 218 | 102-113-3 | 47.4% | -58.79u | -24.58u |
| −1 | 47 | 17-28-2 | 37.8% | -18.97u | -12.66u |
| ≤ −2 | 13 | 4-9-0 | 30.8% | -5.74u | -3.95u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 163 | 84-76-3 | 52.5% | -29.44u | -1.32u |
| +2 | 151 | 72-79-0 | 47.7% | -27.00u | -12.94u |
| +1 | 326 | 169-153-4 | 52.5% | -33.32u | -7.18u |
| 0 | 257 | 122-133-2 | 47.8% | -103.82u | -20.67u |
| −1 | 82 | 43-38-1 | 53.1% | +4.59u | +1.92u |
| ≤ −2 | 31 | 9-22-0 | 29.0% | -22.20u | -12.53u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 880)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 3 | 3-0-0 | 100.0% | +8.01u | +2.34u |
| LOCK   (+5 .. +7) | 9 | 5-4-0 | 55.6% | -2.93u | -0.47u |
| STRONG (+3 .. +5) | 23 | 13-10-0 | 56.5% | -6.91u | +1.77u |
| NEUT   (0 .. +3) | 581 | 298-280-3 | 51.6% | -111.70u | -22.09u |
| WEAK   (−1 .. 0) | 249 | 112-132-5 | 45.9% | -83.55u | -29.51u |
| FADE   (< −1) | 14 | 9-5-0 | 64.3% | +4.68u | +5.05u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29", "05-30", "05-31", "06-01", "06-02", "06-03", "06-04", "06-05", "06-06", "06-07", "06-08", "06-09", "06-10", "06-11", "06-12", "06-13", "06-14", "06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98, -10.18, -8.90, -14.92, -23.44, -23.30, -28.89, -32.63, -26.98, -29.77, -33.27, -44.12, -48.21, -40.65, -34.49, -30.14, -28.48, -25.53, -22.94, -25.33, -24.75, -21.34, -10.19, -14.95, -13.13, -10.30, -6.20, -6.21, -4.25, 4.40, 4.40, 3.98, 7.06, 9.08, 11.60, 15.45, 14.45, 15.59, 14.62, 12.11, 22.64, 23.97, 26.55, 47.73, 38.33, 43.24]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67, -16.17, -15.07, -14.58, -23.93, -16.53, -21.34, -20.03, -10.27, -14.68, -17.58, -11.51, -11.10, -17.79, -24.29, -24.19, -27.68, -32.54, -32.20, -29.06, -23.09, -21.30, -23.13, -30.43, -35.94, -35.44, -37.73, -54.41, -65.05, -83.05, -92.84, -90.33, -106.79, -110.78, -132.42, -142.67, -168.67, -190.87, -195.48, -198.35, -216.31, -226.59, -222.52, -225.85, -229.56, -252.86]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52, -28.22, -25.84, -31.37, -49.24, -44.70, -55.10, -55.65, -40.24, -49.69, -53.57, -58.35, -62.03, -61.16, -58.77, -56.82, -56.00, -58.91, -48.76, -50.51, -46.96, -36.94, -22.86, -34.92, -38.09, -32.03, -30.22, -46.29, -54.97, -66.82, -79.11, -77.02, -90.52, -92.49, -111.61, -118.01, -145.01, -162.43, -168.01, -173.39, -180.82, -190.27, -183.62, -166.52, -177.33, -195.72]
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
| 2026-06-15 | -4.25u | -65.05u | -54.97u |
| 2026-06-16 | +4.40u | -83.05u | -66.82u |
| 2026-06-17 | +4.40u | -92.84u | -79.11u |
| 2026-06-18 | +3.98u | -90.33u | -77.02u |
| 2026-06-19 | +7.06u | -106.79u | -90.52u |
| 2026-06-20 | +9.08u | -110.78u | -92.49u |
| 2026-06-21 | +11.60u | -132.42u | -111.61u |
| 2026-06-22 | +15.45u | -142.67u | -118.01u |
| 2026-06-23 | +14.45u | -168.67u | -145.01u |
| 2026-06-24 | +15.59u | -190.87u | -162.43u |
| 2026-06-25 | +14.62u | -195.48u | -168.01u |
| 2026-06-26 | +12.11u | -198.35u | -173.39u |
| 2026-06-27 | +22.64u | -216.31u | -180.82u |
| 2026-06-28 | +23.97u | -226.59u | -190.27u |
| 2026-06-29 | +26.55u | -222.52u | -183.62u |
| 2026-06-30 | +47.73u | -225.85u | -166.52u |
| 2026-07-01 | +38.33u | -229.56u | -177.33u |
| 2026-07-02 | +43.24u | -252.86u | -195.72u |

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 95 | 75 | 27 | 36% | 38 | 12 | 5 |
| NBA | 138 | 108 | 44 | 41% | 60 | 29 | 11 |
| NHL | 60 | 43 | 12 | 28% | 24 | 12 | 6 |
| SOC | 131 | 91 | 65 | 71% | 68 | 54 | 42 |
| **ALL (any sport)** | **246** | **191** | **99** | **52%** | **112** | **53** | **34** |

### §4b. Daily roster growth (cumulative through each date)

Format: `tracked (profitable)`. For each date D, recompute the roster using every bet up to and including D.

| Date | ALL | MLB | NBA | NHL | SOC |
|---|---|---|---|---|---|
| 2026-04-18 | 5 (2) | 2 (2) | 3 (0) | 0 (0) | 0 (0) |
| 2026-04-19 | 19 (8) | 5 (3) | 9 (3) | 3 (1) | 0 (0) |
| 2026-04-20 | 29 (12) | 7 (6) | 23 (8) | 5 (2) | 0 (0) |
| 2026-04-21 | 44 (21) | 10 (6) | 31 (10) | 7 (5) | 0 (0) |
| 2026-04-22 | 52 (28) | 12 (6) | 39 (15) | 11 (10) | 0 (0) |
| 2026-04-23 | 56 (29) | 13 (6) | 46 (21) | 13 (10) | 0 (0) |
| 2026-04-24 | 61 (30) | 14 (6) | 51 (23) | 14 (9) | 0 (0) |
| 2026-04-25 | 65 (29) | 16 (8) | 54 (22) | 16 (9) | 0 (0) |
| 2026-04-26 | 67 (31) | 18 (5) | 56 (25) | 17 (9) | 0 (0) |
| 2026-04-27 | 72 (32) | 20 (7) | 60 (24) | 17 (9) | 0 (0) |
| 2026-04-28 | 76 (33) | 21 (7) | 63 (26) | 23 (10) | 0 (0) |
| 2026-04-29 | 77 (33) | 21 (7) | 64 (25) | 23 (10) | 0 (0) |
| 2026-04-30 | 81 (34) | 21 (7) | 70 (27) | 23 (10) | 0 (0) |
| 2026-05-01 | 85 (38) | 22 (5) | 74 (30) | 26 (13) | 0 (0) |
| 2026-05-02 | 86 (37) | 23 (7) | 75 (32) | 26 (12) | 0 (0) |
| 2026-05-03 | 86 (38) | 24 (8) | 75 (33) | 26 (12) | 0 (0) |
| 2026-05-04 | 90 (38) | 24 (9) | 76 (32) | 26 (12) | 0 (0) |
| 2026-05-05 | 91 (40) | 24 (9) | 79 (33) | 26 (12) | 0 (0) |
| 2026-05-06 | 92 (40) | 24 (9) | 80 (33) | 26 (12) | 0 (0) |
| 2026-05-07 | 92 (41) | 24 (9) | 80 (33) | 26 (12) | 0 (0) |
| 2026-05-08 | 92 (40) | 24 (8) | 80 (32) | 26 (11) | 0 (0) |
| 2026-05-09 | 94 (42) | 24 (8) | 82 (35) | 26 (11) | 0 (0) |
| 2026-05-10 | 94 (42) | 24 (8) | 82 (35) | 26 (11) | 0 (0) |
| 2026-05-11 | 96 (42) | 24 (8) | 84 (36) | 26 (11) | 0 (0) |
| 2026-05-12 | 100 (41) | 27 (9) | 86 (37) | 26 (11) | 0 (0) |
| 2026-05-13 | 102 (45) | 29 (11) | 88 (37) | 26 (11) | 0 (0) |
| 2026-05-14 | 102 (41) | 29 (11) | 88 (37) | 28 (12) | 0 (0) |
| 2026-05-15 | 103 (41) | 30 (10) | 88 (39) | 28 (12) | 0 (0) |
| 2026-05-16 | 105 (43) | 31 (12) | 88 (39) | 30 (14) | 0 (0) |
| 2026-05-17 | 105 (46) | 32 (11) | 88 (40) | 30 (14) | 0 (0) |
| 2026-05-18 | 105 (46) | 32 (10) | 88 (38) | 31 (15) | 0 (0) |
| 2026-05-19 | 105 (46) | 32 (12) | 88 (38) | 31 (15) | 0 (0) |
| 2026-05-20 | 106 (48) | 33 (12) | 88 (38) | 31 (16) | 0 (0) |
| 2026-05-21 | 106 (45) | 34 (12) | 88 (37) | 31 (14) | 0 (0) |
| 2026-05-22 | 106 (44) | 34 (10) | 88 (39) | 33 (16) | 0 (0) |
| 2026-05-23 | 111 (49) | 36 (10) | 90 (40) | 36 (19) | 0 (0) |
| 2026-05-24 | 117 (52) | 37 (12) | 94 (39) | 37 (16) | 0 (0) |
| 2026-05-25 | 120 (53) | 38 (13) | 95 (40) | 38 (16) | 0 (0) |
| 2026-05-26 | 122 (55) | 39 (14) | 97 (42) | 38 (16) | 0 (0) |
| 2026-05-27 | 123 (51) | 40 (12) | 97 (42) | 40 (14) | 0 (0) |
| 2026-05-28 | 124 (51) | 40 (12) | 99 (42) | 40 (14) | 0 (0) |
| 2026-05-29 | 125 (50) | 41 (12) | 99 (42) | 41 (12) | 0 (0) |
| 2026-05-30 | 126 (49) | 41 (12) | 101 (43) | 41 (12) | 0 (0) |
| 2026-05-31 | 126 (48) | 41 (11) | 101 (43) | 41 (12) | 0 (0) |
| 2026-06-01 | 129 (52) | 44 (14) | 101 (43) | 41 (12) | 0 (0) |
| 2026-06-02 | 130 (56) | 45 (16) | 101 (43) | 41 (13) | 0 (0) |
| 2026-06-03 | 132 (56) | 45 (14) | 102 (43) | 41 (13) | 0 (0) |
| 2026-06-04 | 132 (57) | 46 (14) | 102 (43) | 41 (14) | 0 (0) |
| 2026-06-05 | 132 (57) | 48 (15) | 102 (43) | 41 (14) | 0 (0) |
| 2026-06-06 | 132 (57) | 49 (15) | 102 (43) | 41 (14) | 0 (0) |
| 2026-06-07 | 133 (56) | 52 (16) | 102 (43) | 41 (14) | 0 (0) |
| 2026-06-08 | 135 (55) | 53 (16) | 103 (44) | 41 (14) | 0 (0) |
| 2026-06-09 | 135 (55) | 53 (15) | 103 (44) | 41 (14) | 0 (0) |
| 2026-06-10 | 135 (56) | 53 (15) | 105 (45) | 41 (14) | 0 (0) |
| 2026-06-11 | 135 (54) | 54 (16) | 105 (45) | 42 (13) | 0 (0) |
| 2026-06-12 | 135 (56) | 55 (17) | 105 (45) | 42 (13) | 0 (0) |
| 2026-06-13 | 136 (56) | 57 (17) | 108 (44) | 42 (13) | 0 (0) |
| 2026-06-14 | 136 (55) | 57 (18) | 108 (44) | 43 (12) | 2 (0) |
| 2026-06-15 | 136 (56) | 57 (19) | 108 (44) | 43 (12) | 2 (0) |
| 2026-06-16 | 141 (60) | 58 (20) | 108 (44) | 43 (12) | 13 (5) |
| 2026-06-17 | 143 (64) | 58 (19) | 108 (44) | 43 (12) | 18 (10) |
| 2026-06-18 | 145 (66) | 58 (20) | 108 (44) | 43 (12) | 24 (14) |
| 2026-06-19 | 145 (66) | 58 (20) | 108 (44) | 43 (12) | 29 (21) |
| 2026-06-20 | 147 (75) | 60 (19) | 108 (44) | 43 (12) | 33 (27) |
| 2026-06-21 | 147 (74) | 60 (19) | 108 (44) | 43 (12) | 35 (29) |
| 2026-06-22 | 153 (77) | 61 (20) | 108 (44) | 43 (12) | 42 (34) |
| 2026-06-23 | 156 (80) | 64 (20) | 108 (44) | 43 (12) | 44 (34) |
| 2026-06-24 | 160 (84) | 65 (22) | 108 (44) | 43 (12) | 52 (40) |
| 2026-06-25 | 160 (82) | 67 (24) | 108 (44) | 43 (12) | 55 (44) |
| 2026-06-26 | 166 (85) | 67 (22) | 108 (44) | 43 (12) | 63 (51) |
| 2026-06-27 | 172 (86) | 68 (20) | 108 (44) | 43 (12) | 72 (54) |
| 2026-06-28 | 175 (91) | 69 (21) | 108 (44) | 43 (12) | 75 (57) |
| 2026-06-29 | 182 (95) | 72 (24) | 108 (44) | 43 (12) | 80 (62) |
| 2026-06-30 | 184 (96) | 73 (26) | 108 (44) | 43 (12) | 81 (62) |
| 2026-07-01 | 187 (96) | 74 (26) | 108 (44) | 43 (12) | 85 (64) |
| 2026-07-02 | 191 (99) | 75 (27) | 108 (44) | 43 (12) | 91 (65) |

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 57be17 | 2 | 1 | 1 | 50.0% | +5.95 | +297.5% | $52.6K |
| 2 | f2f960 | 2 | 2 | 0 | 100.0% | +1.93 | +96.5% | $61.1K |
| 3 | b70f9a | 3 | 3 | 0 | 100.0% | +2.01 | +67.1% | $4.5K |
| 4 | 705ba1 | 4 | 3 | 1 | 75.0% | +2.03 | +50.7% | -$45.7K |
| 5 | e05213 | 15 | 11 | 4 | 73.3% | +6.08 | +40.5% | $278.1K |
| 6 | a82a75 | 14 | 10 | 4 | 71.4% | +4.91 | +35.0% | -$1.4K |
| 7 | 913987 | 44 | 30 | 14 | 68.2% | +14.19 | +32.2% | $666.8K |
| 8 | f9e3d0 | 12 | 8 | 4 | 66.7% | +3.73 | +31.1% | $84.7K |
| 9 | dfa240 | 3 | 2 | 1 | 66.7% | +0.85 | +28.3% | $2.5K |
| 10 | f2d227 | 39 | 26 | 13 | 66.7% | +9.43 | +24.2% | $103.0K |

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

#### SOC

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | daf4de | 2 | 2 | 0 | 100.0% | +25.11 | +1255.3% | $1.78M |
| 2 | 59266e | 2 | 2 | 0 | 100.0% | +18.11 | +905.3% | $2.98M |
| 3 | 7b4652 | 8 | 8 | 0 | 100.0% | +34.07 | +425.9% | $21.0K |
| 4 | cf627b | 3 | 3 | 0 | 100.0% | +11.94 | +398.0% | $595.4K |
| 5 | 12c933 | 8 | 6 | 2 | 75.0% | +31.63 | +395.4% | $133.9K |
| 6 | c9bba3 | 12 | 9 | 3 | 75.0% | +37.62 | +313.5% | $2.49M |
| 7 | a7a9cc | 2 | 2 | 0 | 100.0% | +5.14 | +257.0% | $353.6K |
| 8 | 946418 | 12 | 10 | 2 | 83.3% | +30.07 | +250.6% | $75.0K |
| 9 | 8da2ca | 8 | 6 | 2 | 75.0% | +19.00 | +237.6% | $502.0K |
| 10 | 2d2ca8 | 13 | 9 | 4 | 69.2% | +30.47 | +234.4% | $8.68M |

---
## §5. Proven-wallet roster growth & HC tracking

"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).

### §5a. Current proven-winner roster (snapshot)

Roster as of **2026-07-02** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 146 | 75 | 15 | 12 | **27** | 11 | 18.5% |
| NBA | 210 | 108 | 29 | 15 | **44** | 21 | 21.0% |
| NHL | 105 | 43 | 9 | 3 | **12** | 12 | 11.4% |
| SOC | 175 | 91 | 39 | 26 | **65** | 7 | 37.1% |
| **ALL** | **—** | **—** | **—** | **—** | **148** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 34 · 15 | 21 · 12 | 8 · 11 | +28 live |
| NBA | 58 · 29 | 25 · 15 | 23 · 21 | +39 live |
| NHL | 23 · 9 | 6 · 3 | 16 · 12 | +17 live |
| SOC | 47 · 39 | 27 · 26 | 8 · 7 | +9 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-07-02.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +3 from 24 | +3 from 24 | +11 from 16 | +27 from 0 |
| NBA | +0 from 44 | +0 from 44 | +1 from 43 | +44 from 0 |
| NHL | +0 from 12 | +0 from 12 | -1 from 13 | +12 from 0 |
| SOC | +3 from 62 | +21 from 44 | +65 from 0 | +65 from 0 |

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
| MLB | 146 | 75 (51%) | 27 (36%) | 15 (56%) | **27** | edge (Eligible→Flat-OK) 64% |
| NBA | 210 | 108 (51%) | 44 (41%) | 29 (66%) | **44** | edge (Eligible→Flat-OK) 59% |
| NHL | 105 | 43 (41%) | 12 (28%) | 9 (75%) | **12** | edge (Eligible→Flat-OK) 72% |
| SOC | 175 | 91 (52%) | 65 (71%) | 39 (60%) | **65** | sample (Seen→Eligible) 48% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 68 | 21 (30.9%) | 20 (29.4%) | 7 (10.3%) |
| MLB | 7-day | 144 | 31 (21.5%) | 30 (20.8%) | 8 (5.6%) |
| MLB | All-time | 789 | 204 (25.9%) | 188 (23.8%) | 27 (3.4%) |
| NBA | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NBA | 7-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NBA | All-time | 126 | 83 (65.9%) | 69 (54.8%) | 34 (27.0%) |
| NHL | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NHL | 7-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NHL | All-time | 49 | 21 (42.9%) | 20 (40.8%) | 5 (10.2%) |
| SOC | 3-day | 5 | 3 (60.0%) | 3 (60.0%) | 3 (60.0%) |
| SOC | 7-day | 19 | 15 (78.9%) | 15 (78.9%) | 11 (57.9%) |
| SOC | All-time | 46 | 22 (47.8%) | 21 (45.7%) | 14 (30.4%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 73 | 24 (32.9%) | 23 (31.5%) | 10 (13.7%) |
| 7-day | 163 | 46 (28.2%) | 45 (27.6%) | 19 (11.7%) |
| All-time | 1010 | 330 (32.7%) | 298 (29.5%) | 80 (7.9%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (4)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...020b` | 1 | +1.25 | 13 | -42% |
| `...9373` | 1 | +0.87 | 0 | — |
| `...9b3c` | 1 | +0.77 | 9 | 60% |
| `...8d26` | 1 | +0.72 | 5 | -22% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...0ff5` | 65 | 49% | -0.1% | 94 | -15% |
| `...afd2` | 41 | 51% | -0.5% | 177 | -20% |
| `...64aa` | 286 | 54% | -1.1% | 460 | 1% |
| `...135d` | 391 | 52% | -1.3% | 375 | 7% |
| `...c684` | 28 | 50% | -2.0% | 85 | -2% |
| `...2768` | 60 | 48% | -3.0% | 91 | 18% |

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

#### SOC

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...821d` | 1 | +4.30 | 7 | -31% |
| `...16ea` | 1 | +2.70 | 1 | -100% |
| `...aeeb` | 1 | +1.39 | 2 | 144% |
| `...2036` | 1 | +1.39 | 2 | 138% |
| `...1057` | 1 | +1.13 | 7 | 73% |
| `...06da` | 1 | +1.13 | 4 | 106% |

**Just-under** (4)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...69c2` | 2 | 50% | +0.0% | 18 | 22% |
| `...0319` | 3 | 67% | -1.5% | 14 | -2% |
| `...6aa1` | 6 | 50% | -1.5% | 12 | 29% |
| `...c991` | 2 | 50% | -8.3% | 7 | -100% |

### §5g. v2 wallet-promotion pipeline (Source-A / Source-B mix)

Live snapshot of the v2 promotion gate (shipped 2026-05-10, re-eval **2026-05-24**). Each FLAT-or-better wallet × sport pair is attributed to one of three paths via `sharpWalletProfiles[wallet].bySport[sport].whitelistSource`:

- **A** — flat-positive on featured picks (Source A) only — the v1 gate
- **A+B** — flat-positive in both sources (most reliable signal)
- **B** — flat-positive on-chain only (NEW in v2 — the trial lift)

Re-classified every 2h via `grade-sharp-actions` cron. Roll-back: set `B_ONLY_MIN_BETS = Infinity` in `scripts/exportWalletProfiles.js`.

#### Source mix per sport (live Firestore)

| Sport | A | A+B | B (new) | FLAT-or-better total | % from B-only |
|---|---|---|---|---|---|
| MLB | 11 | 20 | **24** | 55 | 43.6% |
| NBA | 10 | 34 | **39** | 83 | 47.0% |
| NHL | 4 | 8 | **17** | 29 | 58.6% |
| SOC | 35 | 30 | **9** | 74 | 12.2% |
| **ALL** | **60** | **92** | **89** | **241** | **36.9%** |

#### Pipeline freshness

- `sharp_action_positions` GRADED rows: **19251**
- `sharp_action_positions` PENDING rows: **192** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 7/3/2026, 5:55:04 AM ET — **303 min · STALE** — check grade-sharp-actions workflow

**Alarms**: pending > 200 OR rebuild lag > 4h → cron is lagging or failing — check `gh run list --workflow="Grade Sharp Actions"`.

#### B-only roster — wallets currently promoted via Source B path only

Wallets here would have been EXCLUDED under v1 (Source-A-only). Top by Source-B bet count per sport. The 2-week re-eval (2026-05-24) will compare these wallets' realized lift against A-only and A+B cohorts.

**MLB** — 24 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...9a27` | CONFIRMED | 467 | +12.3% | +4.4% |
| `...135d` | CONFIRMED | 375 | +2.1% | +6.8% |
| `...3532` | CONFIRMED | 324 | +1.6% | +6% |
| `...1eae` | FLAT | 147 | +3.1% | -1.4% |
| `...c684` | FLAT | 85 | +6.6% | -2.2% |
| `...69c2` | FLAT | 80 | +9.4% | -9.8% |
| `...ad50` | CONFIRMED | 72 | +16.2% | +7.6% |
| `...d6d2` | FLAT | 38 | +6.8% | -25.5% |
| `...cff6` | CONFIRMED | 26 | +6.6% | +22% |
| `...89a0` | FLAT | 20 | +13.5% | -37.2% |
| … | 14 more | | | |

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

**SOC** — 9 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...c80c` | CONFIRMED | 47 | +0.1% | +27.7% |
| `...e8f1` | CONFIRMED | 31 | +5.1% | +1.5% |
| `...69c2` | CONFIRMED | 18 | +10.6% | +22.3% |
| `...d2f7` | FLAT | 16 | +74.9% | -4.5% |
| `...4d8b` | CONFIRMED | 16 | +22.1% | +72% |
| `...6aa1` | CONFIRMED | 12 | +17% | +28.9% |
| `...f6e1` | CONFIRMED | 10 | +22.7% | +26.6% |
| `...1057` | CONFIRMED | 7 | +59.4% | +73.3% |
| `...d34f` | CONFIRMED | 5 | +49.3% | +54.3% |

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

Slate: **2026-07-02** · 77 bets · 33 distinct proven wallets · WR 65% · $ vol $2.08M · $ PnL $615.4K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...658e` (CONFIRMED) | SOC | ML | Croatia @ Portugal | $267.2K | **W** | $184.2K |
| `...bab3` (FLAT) | SOC | ML | Croatia @ Portugal | $173.3K | **W** | $119.5K |
| `...0c2e` (CONFIRMED) | SOC | ML | Croatia @ Portugal | $120.2K | **W** | $82.9K |
| `...fec8` (CONFIRMED) | SOC | ML | Croatia @ Portugal | $116.0K | **W** | $80.0K |
| `...2f63` (FLAT) | MLB | ML | Tampa Bay Rays @ Kansas City Royals | $85.2K | **W** | $71.0K |
| `...a2ca` (FLAT) | SOC | ML | Austria @ Spain | $198.1K | **W** | $69.7K |
| `...abaf` (CONFIRMED) | MLB | TOTAL | San Diego Padres @ Los Angeles Dodgers | $52.2K | **W** | $55.4K |
| `...abaf` (CONFIRMED) | MLB | TOTAL | Los Angeles Angels @ Seattle Mariners | $47.5K | **W** | $51.3K |
| `...abaf` (CONFIRMED) | SOC | ML | Austria @ Spain | $111.0K | **W** | $39.1K |
| `...abaf` (CONFIRMED) | MLB | ML | Chicago White Sox @ Cleveland Guardians | $35.7K | **W** | $31.6K |
| `...aeea` (FLAT) | SOC | ML | Croatia @ Portugal | $44.2K | **W** | $30.5K |
| `...a3d5` (CONFIRMED) | SOC | ML | Croatia @ Portugal | $38.0K | **W** | $26.2K |
| `...bc8a` (CONFIRMED) | SOC | ML | Croatia @ Portugal | $36.9K | **W** | $25.4K |
| `...5ba1` (FLAT) | MLB | ML | Miami Marlins @ Colorado Rockies | $18.9K | **W** | $22.9K |
| `...5ba1` (FLAT) | MLB | TOTAL | Pittsburgh Pirates @ Philadelphia Phillies | $22.3K | **W** | $20.3K |
| `...9d59` (CONFIRMED) | SOC | ML | Austria @ Spain | $52.3K | **W** | $18.4K |
| `...e279` (CONFIRMED) | SOC | ML | Austria @ Spain | $50.0K | **W** | $17.6K |
| `...5ba1` (FLAT) | MLB | TOTAL | Detroit Tigers @ Texas Rangers | $18.7K | **W** | $17.0K |
| `...0ff5` (CONFIRMED) | SOC | ML | Croatia @ Portugal | $17.8K | **W** | $12.3K |
| `...9d59` (CONFIRMED) | SOC | ML | Croatia @ Portugal | $16.7K | **W** | $11.5K |
| `...9705` (CONFIRMED) | MLB | TOTAL | Miami Marlins @ Colorado Rockies | $8.0K | **W** | $8.1K |
| `...8f33` (CONFIRMED) | MLB | ML | Tampa Bay Rays @ Kansas City Royals | $8.0K | **W** | $6.6K |
| `...4cdf` (FLAT) | SOC | ML | Croatia @ Portugal | $9.1K | **W** | $6.3K |
| `...11a4` (CONFIRMED) | SOC | ML | Algeria @ Switzerland | $4.7K | **W** | $4.7K |
| `...dd71` (CONFIRMED) | MLB | ML | Cincinnati Reds @ Milwaukee Brewers | $2.8K | **W** | $4.7K |
| `...35e3` (CONFIRMED) | SOC | ML | Austria @ Spain | $13.0K | **W** | $4.6K |
| `...2f63` (FLAT) | MLB | ML | Cincinnati Reds @ Milwaukee Brewers | $2.6K | **W** | $4.4K |
| `...a6f5` (CONFIRMED) | SOC | ML | Austria @ Spain | $10.2K | **W** | $3.6K |
| `...1e50` (CONFIRMED) | MLB | SPREAD | St. Louis Cardinals @ Atlanta Braves | $2.0K | **W** | $3.2K |
| `...2f63` (FLAT) | MLB | TOTAL | Los Angeles Angels @ Seattle Mariners | $2.9K | **W** | $3.1K |
| `...35e3` (CONFIRMED) | SOC | ML | Algeria @ Switzerland | $3.0K | **W** | $3.0K |
| `...9705` (CONFIRMED) | MLB | ML | Cincinnati Reds @ Milwaukee Brewers | $1.6K | **W** | $2.7K |
| `...44b0` (FLAT) | SOC | ML | Austria @ Spain | $7.6K | **W** | $2.7K |
| `...bba3` (CONFIRMED) | MLB | ML | San Diego Padres @ Los Angeles Dodgers | $5.2K | **W** | $2.6K |
| `...bba3` (CONFIRMED) | MLB | ML | Los Angeles Angels @ Seattle Mariners | $5.4K | **W** | $2.4K |
| `...35e3` (FLAT) | MLB | ML | St. Louis Cardinals @ Atlanta Braves | $2.2K | **W** | $2.3K |
| `...9d74` (CONFIRMED) | SOC | ML | Algeria @ Switzerland | $2.0K | **W** | $2.0K |
| `...1e50` (CONFIRMED) | MLB | ML | Tampa Bay Rays @ Kansas City Royals | $2.4K | **W** | $2.0K |
| `...1e50` (CONFIRMED) | MLB | ML | Cincinnati Reds @ Milwaukee Brewers | $1.0K | **W** | $1.7K |
| `...1e50` (CONFIRMED) | MLB | SPREAD | Cincinnati Reds @ Milwaukee Brewers | $2.3K | **W** | $1.7K |
| `...88a3` (CONFIRMED) | MLB | ML | Los Angeles Angels @ Seattle Mariners | $3.4K | **W** | $1.5K |
| `...1e50` (CONFIRMED) | MLB | ML | St. Louis Cardinals @ Atlanta Braves | $1.0K | **W** | $1.1K |
| `...9d74` (CONFIRMED) | SOC | ML | Austria @ Spain | $2.0K | **W** | $704 |
| `...dd71` (CONFIRMED) | MLB | TOTAL | San Diego Padres @ Los Angeles Dodgers | $567 | **W** | $601 |
| `...1e50` (CONFIRMED) | MLB | ML | Detroit Tigers @ Texas Rangers | $661 | **W** | $551 |
| `...39b3` (FLAT) | SOC | ML | Algeria @ Switzerland | $500 | **W** | $500 |
| `...eb4c` (FLAT) | SOC | ML | Austria @ Spain | $1.3K | **W** | $457 |
| `...2f63` (FLAT) | MLB | TOTAL | San Diego Padres @ Los Angeles Dodgers | $365 | **W** | $387 |
| `...2a75` (FLAT) | MLB | TOTAL | Detroit Tigers @ Texas Rangers | $85 | **W** | $77 |
| `...2f63` (CONFIRMED) | SOC | ML | Algeria @ Switzerland | $39 | **W** | $39 |
| `...9705` (CONFIRMED) | MLB | SPREAD | San Diego Padres @ Los Angeles Dodgers | $349 | L | -$349 |
| `...2f63` (FLAT) | MLB | TOTAL | Detroit Tigers @ Texas Rangers | $464 | L | -$464 |
| `...9705` (CONFIRMED) | MLB | TOTAL | Pittsburgh Pirates @ Philadelphia Phillies | $910 | L | -$910 |
| `...eb4c` (FLAT) | SOC | ML | Algeria @ Switzerland | $981 | L | -$981 |
| `...00bc` (FLAT) | SOC | ML | Croatia @ Portugal | $1.0K | L | -$1.0K |
| `...88a3` (CONFIRMED) | MLB | TOTAL | Pittsburgh Pirates @ Philadelphia Phillies | $1.4K | L | -$1.4K |
| `...11a4` (CONFIRMED) | SOC | ML | Croatia @ Portugal | $1.9K | L | -$1.9K |
| `...11a4` (CONFIRMED) | SOC | ML | Austria @ Spain | $2.0K | L | -$2.0K |
| `...9705` (CONFIRMED) | MLB | TOTAL | Detroit Tigers @ Texas Rangers | $3.2K | L | -$3.2K |
| `...8f33` (CONFIRMED) | MLB | SPREAD | Miami Marlins @ Colorado Rockies | $3.5K | L | -$3.5K |
| `...44b0` (FLAT) | SOC | ML | Croatia @ Portugal | $3.6K | L | -$3.6K |
| `...1e50` (CONFIRMED) | MLB | TOTAL | Detroit Tigers @ Texas Rangers | $4.1K | L | -$4.1K |
| `...2f63` (FLAT) | MLB | TOTAL | Pittsburgh Pirates @ Philadelphia Phillies | $4.3K | L | -$4.3K |
| `...8f33` (CONFIRMED) | MLB | ML | Miami Marlins @ Colorado Rockies | $4.3K | L | -$4.3K |
| `...1e50` (CONFIRMED) | MLB | TOTAL | Miami Marlins @ Colorado Rockies | $5.1K | L | -$5.1K |
| `...2a75` (FLAT) | MLB | TOTAL | Cincinnati Reds @ Milwaukee Brewers | $5.7K | L | -$5.7K |
| `...a6f5` (CONFIRMED) | SOC | ML | Algeria @ Switzerland | $5.8K | L | -$5.8K |
| `...8f33` (CONFIRMED) | MLB | ML | Chicago White Sox @ Cleveland Guardians | $7.3K | L | -$7.3K |
| `...2a9e` (CONFIRMED) | SOC | ML | Croatia @ Portugal | $11.8K | L | -$11.8K |
| `...abaf` (CONFIRMED) | SOC | ML | Croatia @ Portugal | $17.6K | L | -$17.6K |
| `...abaf` (CONFIRMED) | MLB | TOTAL | Cincinnati Reds @ Milwaukee Brewers | $21.3K | L | -$21.3K |
| `...abaf` (CONFIRMED) | MLB | ML | Cincinnati Reds @ Milwaukee Brewers | $28.9K | L | -$28.9K |
| `...abaf` (CONFIRMED) | MLB | ML | Detroit Tigers @ Texas Rangers | $42.5K | L | -$42.5K |
| `...2d54` (FLAT) | SOC | ML | Croatia @ Portugal | $54.0K | L | -$54.0K |
| `...23c4` (FLAT) | MLB | TOTAL | San Diego Padres @ Los Angeles Dodgers | $55.0K | L | -$55.0K |
| `...23c4` (FLAT) | MLB | TOTAL | Los Angeles Angels @ Seattle Mariners | $56.4K | L | -$56.4K |
| `...5ba1` (FLAT) | MLB | ML | Cincinnati Reds @ Milwaukee Brewers | $105.9K | L | -$105.9K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 16 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 11 | 64% | 3.7 | +3.10 | +28% | $379.9K | $154.0K | +41% | 2W |
| 2 | `...2f63` | FLAT | 19 | 68% | 6.3 | +7.92 | +42% | $236.7K | $74.2K | +31% | 2W |
| 3 | `...8f33` | CONFIRMED | 17 | 65% | 5.7 | +4.60 | +27% | $125.9K | $35.0K | +28% | 1W |
| 4 | `...d227` | CONFIRMED | 1 | 100% | 1.0 | +0.61 | +61% | $11.2K | $6.9K | +61% | 1W |
| 5 | `...dd71` | CONFIRMED | 2 | 100% | 2.0 | +2.75 | +138% | $3.3K | $5.3K | +158% | 2W |
| 6 | `...35e3` | FLAT | 6 | 67% | 2.0 | +1.53 | +26% | $29.3K | $5.3K | +18% | 1W |
| 7 | `...bba3` | CONFIRMED | 2 | 100% | 2.0 | +0.95 | +47% | $10.6K | $5.0K | +47% | 2W |
| 8 | `...1e50` | CONFIRMED | 36 | 61% | 12.0 | +7.68 | +21% | $79.8K | $1.6K | +2% | 3W |
| 9 | `...0f9a` | FLAT | 1 | 100% | 1.0 | +0.45 | +45% | $3.4K | $1.5K | +45% | 1W |
| 10 | `...9705` | CONFIRMED | 16 | 44% | 5.3 | -1.32 | -8% | $43.5K | $1.4K | +3% | 2L |
| 11 | `...88a3` | CONFIRMED | 6 | 50% | 2.0 | -0.82 | -14% | $12.8K | $1.2K | +9% | 1L |
| 12 | `...68b3` | FLAT | 2 | 50% | 2.0 | +0.03 | +2% | $789 | $236 | +30% | 1W |
| 13 | `...2a75` | FLAT | 12 | 75% | 4.0 | +5.00 | +42% | $45.1K | -$1.9K | -4% | 1W |
| 14 | `...e3d0` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $23.7K | -$23.7K | -100% | 1L |
| 15 | `...5ba1` | FLAT | 4 | 75% | 4.0 | +2.03 | +51% | $165.9K | -$45.7K | -28% | 3W |

**SOC** — 36 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...658e` | CONFIRMED | 2 | 100% | 0.7 | +1.94 | +97% | $482.2K | $453.0K | +94% | 2W |
| 2 | `...bab3` | FLAT | 2 | 100% | 0.7 | +1.94 | +97% | $345.3K | $334.5K | +97% | 2W |
| 3 | `...2f63` | CONFIRMED | 3 | 100% | 1.0 | +3.40 | +113% | $269.8K | $330.0K | +122% | 3W |
| 4 | `...a3d5` | CONFIRMED | 3 | 100% | 1.5 | +3.75 | +125% | $171.7K | $278.1K | +162% | 3W |
| 5 | `...627b` | CONFIRMED | 1 | 100% | 1.0 | +1.25 | +125% | $134.2K | $167.8K | +125% | 1W |
| 6 | `...1697` | CONFIRMED | 1 | 100% | 1.0 | +1.15 | +115% | $136.8K | $157.3K | +115% | 1W |
| 7 | `...8a06` | CONFIRMED | 1 | 100% | 1.0 | +2.70 | +270% | $51.5K | $139.0K | +270% | 1W |
| 8 | `...a2ca` | FLAT | 2 | 100% | 1.0 | +0.65 | +32% | $393.2K | $127.1K | +32% | 2W |
| 9 | `...2a9e` | CONFIRMED | 4 | 75% | 1.3 | +1.69 | +42% | $170.8K | $122.1K | +71% | 1L |
| 10 | `...00f2` | CONFIRMED | 1 | 100% | 1.0 | +1.25 | +125% | $88.0K | $110.0K | +125% | 1W |
| 11 | `...0c2e` | CONFIRMED | 1 | 100% | 1.0 | +0.69 | +69% | $120.2K | $82.9K | +69% | 1W |
| 12 | `...fec8` | CONFIRMED | 1 | 100% | 1.0 | +0.69 | +69% | $116.0K | $80.0K | +69% | 1W |
| 13 | `...9d59` | CONFIRMED | 5 | 100% | 1.7 | +1.98 | +40% | $196.2K | $68.6K | +35% | 5W |
| 14 | `...bc8a` | CONFIRMED | 2 | 100% | 0.7 | +0.98 | +49% | $136.9K | $54.0K | +39% | 2W |
| 15 | `...aeea` | FLAT | 2 | 100% | 0.7 | +1.94 | +97% | $56.6K | $46.0K | +81% | 2W |

#### §6b-2. 7-day

**MLB** — 18 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2f63` | FLAT | 25 | 76% | 5.0 | +13.60 | +54% | $297.9K | $129.4K | +43% | 2W |
| 2 | `...e3d0` | CONFIRMED | 6 | 83% | 1.5 | +4.12 | +69% | $155.5K | $108.5K | +70% | 1L |
| 3 | `...d227` | CONFIRMED | 4 | 100% | 0.8 | +2.20 | +55% | $44.9K | $24.7K | +55% | 4W |
| 4 | `...1e50` | CONFIRMED | 86 | 58% | 12.3 | +15.94 | +19% | $173.6K | $17.9K | +10% | 3W |
| 5 | `...9705` | CONFIRMED | 20 | 50% | 5.0 | +0.77 | +4% | $56.6K | $9.7K | +17% | 2L |
| 6 | `...8f33` | CONFIRMED | 32 | 59% | 4.6 | +4.35 | +14% | $249.4K | $7.3K | +3% | 1W |
| 7 | `...35e3` | FLAT | 14 | 64% | 2.0 | +2.74 | +20% | $69.5K | $6.2K | +9% | 1W |
| 8 | `...dd71` | CONFIRMED | 4 | 50% | 0.8 | +0.75 | +19% | $4.2K | $4.4K | +104% | 2W |
| 9 | `...fc82` | FLAT | 1 | 100% | 1.0 | +1.43 | +143% | $2.3K | $3.3K | +143% | 1W |
| 10 | `...0f9a` | FLAT | 2 | 100% | 0.5 | +1.47 | +74% | $4.9K | $3.1K | +63% | 2W |
| 11 | `...aeea` | FLAT | 2 | 50% | 1.0 | -0.09 | -5% | $1.2K | $745 | +60% | 1L |
| 12 | `...68b3` | FLAT | 4 | 50% | 1.3 | -0.16 | -4% | $1.4K | $82 | +6% | 1W |
| 13 | `...2a75` | FLAT | 14 | 71% | 3.5 | +4.91 | +35% | $46.9K | -$1.4K | -3% | 1W |
| 14 | `...88a3` | CONFIRMED | 15 | 40% | 2.1 | -2.93 | -20% | $25.9K | -$5.8K | -23% | 1L |
| 15 | `...bba3` | CONFIRMED | 4 | 50% | 0.8 | -1.05 | -26% | $48.1K | -$32.5K | -68% | 2W |

**SOC** — 55 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...14fb` | FLAT | 2 | 100% | 2.0 | +2.15 | +108% | $2.63M | $1.64M | +62% | 2W |
| 2 | `...2ca8` | FLAT | 4 | 75% | 2.0 | +2.96 | +74% | $996.5K | $856.9K | +86% | 2W |
| 3 | `...bab3` | FLAT | 4 | 100% | 0.6 | +6.77 | +169% | $483.3K | $650.5K | +135% | 4W |
| 4 | `...1697` | CONFIRMED | 4 | 75% | 0.8 | +1.53 | +38% | $1.53M | $628.0K | +41% | 1W |
| 5 | `...66f5` | CONFIRMED | 3 | 67% | 1.0 | +0.09 | +3% | $1.46M | $536.1K | +37% | 1W |
| 6 | `...658e` | CONFIRMED | 2 | 100% | 0.7 | +1.94 | +97% | $482.2K | $453.0K | +94% | 2W |
| 7 | `...2f63` | CONFIRMED | 3 | 100% | 1.0 | +3.40 | +113% | $269.8K | $330.0K | +122% | 3W |
| 8 | `...8a06` | CONFIRMED | 2 | 100% | 0.7 | +3.47 | +173% | $256.7K | $296.9K | +116% | 2W |
| 9 | `...a3d5` | CONFIRMED | 3 | 100% | 1.5 | +3.75 | +125% | $171.7K | $278.1K | +162% | 3W |
| 10 | `...abaf` | CONFIRMED | 9 | 67% | 1.3 | +2.54 | +28% | $430.5K | $228.0K | +53% | 1L |
| 11 | `...659a` | CONFIRMED | 2 | 100% | 1.0 | +1.10 | +55% | $599.5K | $223.8K | +37% | 2W |
| 12 | `...fec8` | CONFIRMED | 3 | 100% | 0.6 | +2.15 | +72% | $291.2K | $208.8K | +72% | 3W |
| 13 | `...77f1` | FLAT | 2 | 100% | 2.0 | +2.22 | +111% | $152.3K | $194.2K | +128% | 2W |
| 14 | `...627b` | CONFIRMED | 1 | 100% | 1.0 | +1.25 | +125% | $134.2K | $167.8K | +125% | 1W |
| 15 | `...00f2` | CONFIRMED | 2 | 100% | 0.4 | +1.94 | +97% | $152.2K | $154.3K | +101% | 2W |

#### §6b-3. All-time

**MLB** — 27 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 101 | 54% | 2.1 | +12.94 | +13% | $2.99M | $1.09M | +36% | 2W |
| 2 | `...3987` | CONFIRMED | 44 | 68% | 4.0 | +14.19 | +32% | $2.29M | $666.8K | +29% | 1L |
| 3 | `...5213` | CONFIRMED | 15 | 73% | 0.7 | +6.08 | +41% | $599.4K | $278.1K | +46% | 1W |
| 4 | `...2f63` | FLAT | 170 | 54% | 2.5 | +10.66 | +6% | $1.07M | $170.4K | +16% | 2W |
| 5 | `...fc82` | FLAT | 28 | 54% | 0.4 | +1.84 | +7% | $558.5K | $143.2K | +26% | 1W |
| 6 | `...d227` | CONFIRMED | 39 | 67% | 0.7 | +9.43 | +24% | $350.6K | $103.0K | +29% | 4W |
| 7 | `...e3d0` | CONFIRMED | 12 | 67% | 0.4 | +3.73 | +31% | $267.5K | $84.7K | +32% | 1L |
| 8 | `...8f33` | CONFIRMED | 177 | 55% | 4.4 | +6.73 | +4% | $1.03M | $67.6K | +7% | 1W |
| 9 | `...f960` | CONFIRMED | 2 | 100% | 2.0 | +1.93 | +96% | $61.1K | $61.1K | +100% | 2W |
| 10 | `...be17` | FLAT | 2 | 50% | 0.1 | +5.95 | +298% | $30.4K | $52.6K | +173% | 1L |
| 11 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 12 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 13 | `...aeea` | FLAT | 20 | 55% | 0.3 | +0.82 | +4% | $48.1K | $12.5K | +26% | 1L |
| 14 | `...1e50` | CONFIRMED | 200 | 54% | 8.0 | +12.25 | +6% | $287.3K | $12.2K | +4% | 3W |
| 15 | `...9705` | CONFIRMED | 20 | 50% | 5.0 | +0.77 | +4% | $56.6K | $9.7K | +17% | 2L |

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

**SOC** — 65 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | FLAT | 13 | 69% | 1.2 | +30.47 | +234% | $4.30M | $8.68M | +202% | 2W |
| 2 | `...266e` | CONFIRMED | 2 | 100% | 1.0 | +18.11 | +905% | $315.4K | $2.98M | +946% | 2W |
| 3 | `...bba3` | CONFIRMED | 12 | 75% | 0.8 | +37.62 | +314% | $428.7K | $2.49M | +580% | 1W |
| 4 | `...11a4` | CONFIRMED | 37 | 68% | 2.2 | +34.30 | +93% | $825.4K | $1.99M | +241% | 2L |
| 5 | `...2f63` | CONFIRMED | 23 | 61% | 1.4 | +31.13 | +135% | $1.73M | $1.94M | +112% | 4W |
| 6 | `...f4de` | CONFIRMED | 2 | 100% | 0.5 | +25.11 | +1255% | $106.1K | $1.78M | +1681% | 2W |
| 7 | `...aeea` | FLAT | 20 | 65% | 1.2 | +24.39 | +122% | $829.3K | $1.64M | +198% | 2W |
| 8 | `...14fb` | FLAT | 2 | 100% | 2.0 | +2.15 | +108% | $2.63M | $1.64M | +62% | 2W |
| 9 | `...abaf` | CONFIRMED | 16 | 69% | 1.1 | +14.85 | +93% | $1.03M | $1.46M | +142% | 1L |
| 10 | `...020b` | FLAT | 13 | 38% | 1.1 | +8.29 | +64% | $1.00M | $1.33M | +133% | 1W |
| 11 | `...2a9e` | CONFIRMED | 41 | 54% | 2.3 | +10.58 | +26% | $1.76M | $1.22M | +70% | 1L |
| 12 | `...e279` | CONFIRMED | 3 | 100% | 0.2 | +5.81 | +194% | $300.0K | $799.9K | +267% | 3W |
| 13 | `...059d` | FLAT | 7 | 71% | 0.8 | +7.87 | +112% | $664.2K | $750.6K | +113% | 1L |
| 14 | `...66f5` | CONFIRMED | 4 | 75% | 0.4 | +0.92 | +23% | $1.61M | $653.6K | +41% | 1W |
| 15 | `...bab3` | FLAT | 4 | 100% | 0.6 | +6.77 | +169% | $483.3K | $650.5K | +135% | 4W |

### §6c. Active streaks (≥3 in a row, last bet within 3 days)

Proven `(wallet × sport)` pairs currently riding a 3-or-more-bet run with their most recent bet inside the last 3 calendar days. Hot-hand monitor — and the same surface for cold streaks worth fading.

| Wallet | Sport | Tier | Streak | Last bet | All-time bets | WR% | $ PnL | $ ROI |
|---|---|---|---|---|---|---|---|---|
| `...9d74` | SOC | CONFIRMED | **6W** | 2026-07-02 | 24 | 92% | $90.6K | +176% |
| `...35e3` | SOC | CONFIRMED | **6W** | 2026-07-02 | 9 | 89% | $70.4K | +64% |
| `...68b3` | SOC | CONFIRMED | **6W** | 2026-06-30 | 11 | 82% | $45.0K | +214% |
| `...9d59` | SOC | CONFIRMED | **5W** | 2026-07-02 | 7 | 86% | $49.1K | +19% |
| `...2f63` | SOC | CONFIRMED | **4W** | 2026-07-02 | 23 | 61% | $1.94M | +112% |
| `...bab3` | SOC | FLAT | **4W** | 2026-07-02 | 4 | 100% | $650.5K | +135% |
| `...4cdf` | SOC | FLAT | **4W** | 2026-07-02 | 15 | 93% | $197.1K | +122% |
| `...bc8a` | SOC | CONFIRMED | **4W** | 2026-07-02 | 4 | 100% | $108.1K | +41% |
| `...d227` | MLB | CONFIRMED | **4W** | 2026-06-30 | 39 | 67% | $103.0K | +29% |
| `...6418` | SOC | CONFIRMED | **4W** | 2026-07-01 | 12 | 83% | $75.0K | +384% |
| `...0ff5` | SOC | CONFIRMED | **4W** | 2026-07-02 | 8 | 75% | $42.7K | +40% |
| `...c67e` | SOC | CONFIRMED | **4W** | 2026-06-29 | 4 | 100% | $11.3K | +62% |
| `...e279` | SOC | CONFIRMED | **3W** | 2026-07-02 | 3 | 100% | $799.9K | +267% |
| `...627b` | SOC | CONFIRMED | **3W** | 2026-06-30 | 3 | 100% | $595.4K | +278% |
| `...2d54` | SOC | FLAT | **3L** | 2026-07-02 | 12 | 58% | $506.4K | +35% |
| `...a3d5` | SOC | CONFIRMED | **3W** | 2026-07-02 | 3 | 100% | $278.1K | +162% |
| `...fec8` | SOC | CONFIRMED | **3W** | 2026-07-02 | 3 | 100% | $208.8K | +72% |
| `...1e50` | MLB | CONFIRMED | **3W** | 2026-07-02 | 200 | 54% | $12.2K | +4% |
| `...0f9a` | MLB | FLAT | **3W** | 2026-06-30 | 3 | 100% | $4.5K | +60% |
| `...5ba1` | MLB | FLAT | **3W** | 2026-07-02 | 4 | 75% | -$45.7K | -28% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL | SOC N · $vol · $PnL |
|---|---|---|---|---|---|
| 2026-06-19 | 67 · $1.34M · $5.17M | 34 · $123.4K · $32.4K | — | — | 33 · $1.21M · $5.13M |
| 2026-06-20 | 41 · $1.83M · $8.09M | 20 · $101.8K · $21.7K | — | — | 21 · $1.73M · $8.07M |
| 2026-06-21 | 46 · $710.1K · $791.1K | 27 · $504.6K · $341.8K | — | — | 19 · $205.6K · $449.3K |
| 2026-06-22 | 75 · $2.92M · $10.36M | 36 · $266.4K · $148.7K | — | — | 39 · $2.66M · $10.21M |
| 2026-06-23 | 35 · $531.3K · $5.57M | 29 · $214.9K · -$73.1K | — | — | 6 · $316.4K · $5.65M |
| 2026-06-24 | 75 · $1.87M · $1.21M | 35 · $414.4K · $190.2K | — | — | 40 · $1.45M · $1.02M |
| 2026-06-25 | 77 · $4.08M · -$2.30M | 21 · $215.7K · $63.5K | — | — | 56 · $3.86M · -$2.37M |
| 2026-06-26 | 71 · $6.66M · $3.11M | 21 · $345.4K · -$202.1K | — | — | 50 · $6.31M · $3.31M |
| 2026-06-27 | 66 · $1.52M · $283.8K | 27 · $214.5K · -$10.3K | — | — | 39 · $1.30M · $294.2K |
| 2026-06-28 | 73 · $2.58M · $1.24M | 53 · $555.8K · -$145.4K | — | — | 20 · $2.02M · $1.39M |
| 2026-06-29 | 82 · $2.62M · -$310.1K | 45 · $346.8K · $71.6K | — | — | 37 · $2.28M · -$381.7K |
| 2026-06-30 | 81 · $2.15M · $1.58M | 50 · $418.4K · $123.4K | — | — | 31 · $1.73M · $1.46M |
| 2026-07-01 | 64 · $907.0K · $408.1K | 48 · $254.6K · $24.0K | — | — | 16 · $652.4K · $384.1K |
| 2026-07-02 | 77 · $2.08M · $615.4K | 44 · $683.7K · -$31.8K | — | — | 33 · $1.39M · $647.2K |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-07-02_
