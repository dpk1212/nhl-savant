# Sharp Intel v6 — Daily Master Report

_Auto-generated **7/6/2026, 12:05:33 PM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (342 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-07-05** · 19 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 19 | 10-8-1 | 55.6% | -3.56u | +2.31u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Boston Red Sox @ Los Angeles Angels | Boston Red Sox | 4.0★ · 1.00u | +0 | +3 | +1 | +4 | -157 | **W** | +0.65u |
| MLB | ML | Minnesota Twins @ New York Yankees | New York Yankees | 4.5★ · 4.00u | +1 | +2 | +2 | +4 | -131 | L | -4.00u |
| MLB | ML | New York Mets @ Atlanta Braves | Atlanta Braves | 3.0★ · 0.50u | +1 | +2 | +2 | +4 | -111 | L | -0.50u |
| MLB | ML | San Diego Padres @ Los Angeles Dodgers | San Diego Padres | 4.0★ · 1.00u | +0 | +1 | +0 | +1 | +197 | **W** | +0.00u |
| MLB | ML | San Francisco Giants @ Colorado Rockies | San Francisco Giants | 4.5★ · 3.00u | +0 | +2 | +1 | +3 | -110 | L | -3.00u |
| MLB | ML | St. Louis Cardinals @ Chicago Cubs | Chicago Cubs | 4.5★ · 3.00u | +1 | +1 | +1 | +2 | -142 | **W** | +2.82u |
| MLB | ML | Tampa Bay Rays @ Houston Astros | Tampa Bay Rays | 4.5★ · 2.50u | +0 | +1 | +0 | +1 | +103 | L | -2.50u |
| MLB | SPREAD | San Diego Padres @ Los Angeles Dodgers | San Diego Padres | 5.0★ · 5.00u | +3 | +4 | +3 | +7 | -107 | **W** | +5.71u |
| MLB | SPREAD | St. Louis Cardinals @ Chicago Cubs | St. Louis Cardinals | 5.0★ · 5.00u | +1 | +2 | +2 | +4 | -161 | L | -5.00u |
| MLB | TOTAL | Detroit Tigers @ Texas Rangers | Over 7.5 | 4.0★ · 1.00u | +0 | +1 | +0 | +1 | -110 | **W** | +0.00u |
| MLB | TOTAL | Milwaukee Brewers @ Arizona Diamondbacks | Over 9.5 | 4.5★ · 3.00u | +0 | +1 | +0 | +1 | -110 | L | -3.00u |
| MLB | TOTAL | Minnesota Twins @ New York Yankees | Under 8.5 | 5.0★ · 5.00u | +0 | +1 | +1 | +2 | -110 | **W** | +2.73u |
| MLB | TOTAL | Philadelphia Phillies @ Kansas City Royals | Over 10.5 | 4.5★ · 3.00u | +1 | +2 | +1 | +3 | -110 | L | -3.00u |
| MLB | TOTAL | San Diego Padres @ Los Angeles Dodgers | Under 9.5 | 2.5★ · 1.00u | +0 | +2 | +0 | +2 | -110 | **W** | +0.00u |
| MLB | TOTAL | San Francisco Giants @ Colorado Rockies | Over 12.5 | 4.5★ · 2.50u | +2 | +4 | +1 | +5 | -110 | P | +0.00u |
| MLB | TOTAL | St. Louis Cardinals @ Chicago Cubs | Over 8.5 | 4.0★ · 1.00u | +0 | +1 | +0 | +1 | -110 | **W** | +0.00u |
| MLB | TOTAL | Tampa Bay Rays @ Houston Astros | Under 8.5 | 4.5★ · 3.00u | +0 | +2 | +2 | +4 | -110 | **W** | +3.70u |
| SOC | ML | England @ Mexico | England | 2.5★ · 0.25u | +1 | -4 | -3 | -7 | +152 | **W** | +2.33u |
| SOC | ML | Norway @ Brazil | Brazil | 3.0★ · 0.50u | +5 | +7 | +8 | +15 | -105 | L | -0.50u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **58** shipped · 37-20-1 · WR 64.9% · PnL +24.39u (peak) / +12.40u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 58)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 4 | 2-2-0 | 50.0% | +2.71u | -0.30u |
| HC = +2 | 7 | 4-2-1 | 66.7% | +6.11u | +0.53u |
| HC = +1 | 17 | 10-7-0 | 58.8% | +9.15u | +1.97u |
| HC = 0 | 28 | 19-9-0 | 67.9% | +6.42u | +8.24u |
| HC ≤ −1 | 2 | 2-0-0 | 100.0% | +0.00u | +1.96u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 13 | 8-4-1 | 66.7% | +9.35u | +1.84u |
| +2 | 11 | 5-6-0 | 45.5% | -3.93u | -1.68u |
| +1 | 23 | 17-6-0 | 73.9% | +14.04u | +9.05u |
| 0 | 7 | 4-3-0 | 57.1% | +2.85u | +0.85u |
| −1 | 2 | 2-0-0 | 100.0% | +0.00u | +1.82u |
| ≤ −2 | 2 | 1-1-0 | 50.0% | +2.08u | +0.52u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 9 | 7-2-0 | 77.8% | +16.70u | +3.21u |
| +2 | 10 | 4-6-0 | 40.0% | -12.25u | -2.15u |
| +1 | 16 | 10-5-1 | 66.7% | +8.72u | +3.11u |
| 0 | 18 | 12-6-0 | 66.7% | +5.22u | +5.00u |
| −1 | 2 | 1-1-0 | 50.0% | +3.67u | -0.09u |
| ≤ −2 | 3 | 3-0-0 | 100.0% | +2.33u | +3.34u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 58)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| STRONG (+3 .. +5) | 1 | 1-0-0 | 100.0% | +2.50u | +0.77u |
| NEUT   (0 .. +3) | 48 | 29-18-1 | 61.7% | +16.72u | +7.06u |
| WEAK   (−1 .. 0) | 9 | 7-2-0 | 77.8% | +5.17u | +4.57u |

### §2b. 7-day

Total: **152** shipped · 81-68-3 · WR 54.4% · PnL +18.94u (peak) / +5.90u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 152)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 9 | 5-4-0 | 55.6% | +10.55u | -0.34u |
| HC = +2 | 14 | 8-5-1 | 61.5% | +9.40u | +1.30u |
| HC = +1 | 32 | 20-12-0 | 62.5% | +17.29u | +5.46u |
| HC = 0 | 91 | 44-45-2 | 49.4% | -19.85u | -3.73u |
| HC ≤ −1 | 6 | 4-2-0 | 66.7% | +1.55u | +3.21u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 33 | 20-12-1 | 62.5% | +16.61u | +4.48u |
| +2 | 26 | 13-12-1 | 52.0% | -6.81u | -0.87u |
| +1 | 54 | 33-21-0 | 61.1% | +16.70u | +9.09u |
| 0 | 25 | 10-15-0 | 40.0% | -5.94u | -5.38u |
| −1 | 9 | 3-5-1 | 37.5% | -4.75u | -2.23u |
| ≤ −2 | 5 | 2-3-0 | 40.0% | +3.13u | +0.82u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 24 | 15-9-0 | 62.5% | +9.54u | +2.39u |
| +2 | 20 | 10-10-0 | 50.0% | -2.35u | -0.26u |
| +1 | 38 | 18-18-2 | 50.0% | +2.32u | -3.45u |
| 0 | 49 | 25-23-1 | 52.1% | -7.26u | +0.90u |
| −1 | 16 | 9-7-0 | 56.3% | +12.31u | +1.69u |
| ≤ −2 | 5 | 4-1-0 | 80.0% | +4.38u | +4.64u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 152)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| STRONG (+3 .. +5) | 1 | 1-0-0 | 100.0% | +2.50u | +0.77u |
| NEUT   (0 .. +3) | 125 | 67-56-2 | 54.5% | +6.72u | +3.90u |
| WEAK   (−1 .. 0) | 26 | 13-12-1 | 52.0% | +9.72u | +1.24u |

### §2c. All-time

Total: **1074** shipped · 540-523-11 · WR 50.8% · PnL -183.56u (peak) / -39.55u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 963)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 26 | 11-15-0 | 42.3% | +5.54u | -7.86u |
| HC = +2 | 52 | 27-24-1 | 52.9% | +13.01u | -0.94u |
| HC = +1 | 218 | 129-89-0 | 59.2% | +42.66u | +24.23u |
| HC = 0 | 628 | 300-319-9 | 48.5% | -246.44u | -53.69u |
| HC ≤ −1 | 38 | 22-16-0 | 57.9% | +12.27u | +7.51u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 164 | 86-77-1 | 52.8% | +4.42u | +0.49u |
| +2 | 188 | 95-91-2 | 51.1% | -28.07u | -5.36u |
| +1 | 427 | 225-199-3 | 53.1% | -85.33u | +2.48u |
| 0 | 225 | 106-116-3 | 47.7% | -55.94u | -23.73u |
| −1 | 49 | 19-28-2 | 40.4% | -18.97u | -10.84u |
| ≤ −2 | 15 | 5-10-0 | 33.3% | -3.66u | -3.43u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 172 | 91-78-3 | 53.8% | -12.74u | +1.89u |
| +2 | 161 | 76-85-0 | 47.2% | -39.25u | -15.09u |
| +1 | 342 | 179-158-5 | 53.1% | -24.60u | -4.08u |
| 0 | 275 | 134-139-2 | 49.1% | -98.60u | -15.68u |
| −1 | 84 | 44-39-1 | 53.0% | +8.26u | +1.83u |
| ≤ −2 | 34 | 12-22-0 | 35.3% | -19.87u | -9.19u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 938)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 3 | 3-0-0 | 100.0% | +8.01u | +2.34u |
| LOCK   (+5 .. +7) | 9 | 5-4-0 | 55.6% | -2.93u | -0.47u |
| STRONG (+3 .. +5) | 24 | 14-10-0 | 58.3% | -4.41u | +2.54u |
| NEUT   (0 .. +3) | 629 | 327-298-4 | 52.3% | -94.98u | -15.03u |
| WEAK   (−1 .. 0) | 258 | 119-134-5 | 47.0% | -78.38u | -24.94u |
| FADE   (< −1) | 14 | 9-5-0 | 64.3% | +4.68u | +5.05u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29", "05-30", "05-31", "06-01", "06-02", "06-03", "06-04", "06-05", "06-06", "06-07", "06-08", "06-09", "06-10", "06-11", "06-12", "06-13", "06-14", "06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98, -10.18, -8.90, -14.92, -23.44, -23.30, -28.89, -32.63, -26.98, -29.77, -33.27, -44.12, -48.21, -40.65, -34.49, -30.14, -28.48, -25.53, -22.94, -25.33, -24.75, -21.34, -10.19, -14.95, -13.13, -10.30, -6.20, -6.21, -4.25, 4.40, 4.40, 3.98, 7.06, 9.08, 11.60, 15.45, 14.45, 15.59, 14.62, 12.11, 22.64, 23.97, 26.55, 47.73, 38.33, 43.24, 54.65, 63.35, 61.21]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67, -16.17, -15.07, -14.58, -23.93, -16.53, -21.34, -20.03, -10.27, -14.68, -17.58, -11.51, -11.10, -17.79, -24.29, -24.19, -27.68, -32.54, -32.20, -29.06, -23.09, -21.30, -23.13, -30.43, -35.94, -35.44, -37.73, -54.41, -65.05, -83.05, -92.84, -90.33, -106.79, -110.78, -132.42, -142.67, -168.67, -190.87, -195.48, -198.35, -216.31, -226.59, -222.52, -225.85, -229.56, -252.86, -246.16, -245.02, -246.44]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52, -28.22, -25.84, -31.37, -49.24, -44.70, -55.10, -55.65, -40.24, -49.69, -53.57, -58.35, -62.03, -61.16, -58.77, -56.82, -56.00, -58.91, -48.76, -50.51, -46.96, -36.94, -22.86, -34.92, -38.09, -32.03, -30.22, -46.29, -54.97, -66.82, -79.11, -77.02, -90.52, -92.49, -111.61, -118.01, -145.01, -162.43, -168.01, -173.39, -180.82, -190.27, -183.62, -166.52, -177.33, -195.72, -177.61, -167.77, -171.33]
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
| 2026-07-03 | +54.65u | -246.16u | -177.61u |
| 2026-07-04 | +63.35u | -245.02u | -167.77u |
| 2026-07-05 | +61.21u | -246.44u | -171.33u |

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 97 | 75 | 26 | 35% | 36 | 11 | 3 |
| NBA | 138 | 108 | 44 | 41% | 60 | 29 | 11 |
| NHL | 60 | 43 | 12 | 28% | 24 | 12 | 6 |
| SOC | 136 | 96 | 64 | 67% | 69 | 55 | 41 |
| **ALL (any sport)** | **251** | **193** | **98** | **51%** | **111** | **57** | **31** |

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
| 2026-07-03 | 191 (98) | 75 (26) | 108 (44) | 43 (12) | 93 (64) |
| 2026-07-04 | 193 (97) | 75 (26) | 108 (44) | 43 (12) | 95 (66) |
| 2026-07-05 | 193 (98) | 75 (26) | 108 (44) | 43 (12) | 96 (64) |

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 57be17 | 2 | 1 | 1 | 50.0% | +5.95 | +297.5% | $52.6K |
| 2 | b70f9a | 3 | 3 | 0 | 100.0% | +2.01 | +67.1% | $4.5K |
| 3 | a82a75 | 24 | 18 | 6 | 75.0% | +10.06 | +41.9% | $11.4K |
| 4 | e05213 | 15 | 11 | 4 | 73.3% | +6.08 | +40.5% | $278.1K |
| 5 | 705ba1 | 12 | 8 | 4 | 66.7% | +4.61 | +38.4% | -$116.2K |
| 6 | 913987 | 44 | 30 | 14 | 68.2% | +14.19 | +32.2% | $666.8K |
| 7 | dfa240 | 3 | 2 | 1 | 66.7% | +0.85 | +28.3% | $2.5K |
| 8 | f9e3d0 | 14 | 9 | 5 | 64.3% | +3.64 | +26.0% | $95.1K |
| 9 | f2d227 | 42 | 28 | 14 | 66.7% | +9.97 | +23.7% | $98.5K |
| 10 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |

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
| 1 | 59266e | 2 | 2 | 0 | 100.0% | +18.11 | +905.3% | $2.98M |
| 2 | daf4de | 3 | 2 | 1 | 66.7% | +24.11 | +803.5% | $1.77M |
| 3 | 7b4652 | 8 | 8 | 0 | 100.0% | +34.07 | +425.9% | $21.0K |
| 4 | 12c933 | 8 | 6 | 2 | 75.0% | +31.63 | +395.4% | $133.9K |
| 5 | c9bba3 | 14 | 10 | 4 | 71.4% | +38.17 | +272.7% | $2.62M |
| 6 | a7a9cc | 2 | 2 | 0 | 100.0% | +5.14 | +257.0% | $353.6K |
| 7 | 2d2ca8 | 13 | 9 | 4 | 69.2% | +30.47 | +234.4% | $8.68M |
| 8 | 946418 | 15 | 13 | 2 | 86.7% | +32.66 | +217.7% | $76.6K |
| 9 | cf627b | 5 | 3 | 2 | 60.0% | +9.94 | +198.8% | $386.7K |
| 10 | 8da2ca | 10 | 7 | 3 | 70.0% | +19.55 | +195.5% | $1.01M |

---
## §5. Proven-wallet roster growth & HC tracking

"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).

### §5a. Current proven-winner roster (snapshot)

Roster as of **2026-07-05** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 149 | 75 | 15 | 11 | **26** | 10 | 17.4% |
| NBA | 210 | 108 | 29 | 15 | **44** | 21 | 21.0% |
| NHL | 105 | 43 | 9 | 3 | **12** | 12 | 11.4% |
| SOC | 185 | 96 | 39 | 25 | **64** | 7 | 34.6% |
| **ALL** | **—** | **—** | **—** | **—** | **146** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 35 · 15 | 20 · 11 | 7 · 10 | +29 live |
| NBA | 58 · 29 | 25 · 15 | 23 · 21 | +39 live |
| NHL | 23 · 9 | 6 · 3 | 16 · 12 | +17 live |
| SOC | 50 · 39 | 27 · 25 | 9 · 7 | +13 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-07-05.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | -1 from 27 | +5 from 21 | +11 from 15 | +26 from 0 |
| NBA | +0 from 44 | +0 from 44 | +1 from 43 | +44 from 0 |
| NHL | +0 from 12 | +0 from 12 | -2 from 14 | +12 from 0 |
| SOC | -1 from 65 | +7 from 57 | +64 from 0 | +64 from 0 |

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
| MLB | 149 | 75 (50%) | 26 (35%) | 15 (58%) | **26** | edge (Eligible→Flat-OK) 65% |
| NBA | 210 | 108 (51%) | 44 (41%) | 29 (66%) | **44** | edge (Eligible→Flat-OK) 59% |
| NHL | 105 | 43 (41%) | 12 (28%) | 9 (75%) | **12** | edge (Eligible→Flat-OK) 72% |
| SOC | 185 | 96 (52%) | 64 (67%) | 39 (61%) | **64** | sample (Seen→Eligible) 48% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 51 | 21 (41.2%) | 21 (41.2%) | 5 (9.8%) |
| MLB | 7-day | 138 | 44 (31.9%) | 43 (31.2%) | 12 (8.7%) |
| MLB | All-time | 840 | 225 (26.8%) | 209 (24.9%) | 32 (3.8%) |
| NBA | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NBA | 7-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NBA | All-time | 126 | 83 (65.9%) | 69 (54.8%) | 34 (27.0%) |
| NHL | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NHL | 7-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NHL | All-time | 49 | 21 (42.9%) | 20 (40.8%) | 5 (10.2%) |
| SOC | 3-day | 7 | 7 (100.0%) | 7 (100.0%) | 6 (85.7%) |
| SOC | 7-day | 14 | 12 (85.7%) | 12 (85.7%) | 11 (78.6%) |
| SOC | All-time | 53 | 29 (54.7%) | 28 (52.8%) | 20 (37.7%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 58 | 28 (48.3%) | 28 (48.3%) | 11 (19.0%) |
| 7-day | 152 | 56 (36.8%) | 55 (36.2%) | 23 (15.1%) |
| All-time | 1068 | 358 (33.5%) | 326 (30.5%) | 91 (8.5%) |

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
| `...0ff5` | 69 | 49% | -0.2% | 105 | -14% |
| `...afd2` | 41 | 51% | -0.5% | 177 | -20% |
| `...135d` | 413 | 52% | -1.1% | 375 | 7% |
| `...64aa` | 292 | 54% | -1.2% | 480 | 0% |
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

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...2d54` | 16 | 44% | -0.3% | 37 | -21% |
| `...4d8b` | 9 | 33% | -0.3% | 16 | 72% |
| `...0319` | 3 | 67% | -1.5% | 14 | -2% |
| `...6aa1` | 6 | 50% | -1.5% | 12 | 29% |
| `...912c` | 4 | 50% | -2.4% | 12 | -17% |
| `...3f67` | 7 | 43% | -7.5% | 29 | 19% |

### §5g. v2 wallet-promotion pipeline (Source-A / Source-B mix)

Live snapshot of the v2 promotion gate (shipped 2026-05-10, re-eval **2026-05-24**). Each FLAT-or-better wallet × sport pair is attributed to one of three paths via `sharpWalletProfiles[wallet].bySport[sport].whitelistSource`:

- **A** — flat-positive on featured picks (Source A) only — the v1 gate
- **A+B** — flat-positive in both sources (most reliable signal)
- **B** — flat-positive on-chain only (NEW in v2 — the trial lift)

Re-classified every 2h via `grade-sharp-actions` cron. Roll-back: set `B_ONLY_MIN_BETS = Infinity` in `scripts/exportWalletProfiles.js`.

#### Source mix per sport (live Firestore)

| Sport | A | A+B | B (new) | FLAT-or-better total | % from B-only |
|---|---|---|---|---|---|
| MLB | 11 | 19 | **25** | 55 | 45.5% |
| NBA | 10 | 34 | **39** | 83 | 47.0% |
| NHL | 4 | 8 | **17** | 29 | 58.6% |
| SOC | 32 | 32 | **13** | 77 | 16.9% |
| **ALL** | **57** | **93** | **94** | **244** | **38.5%** |

#### Pipeline freshness

- `sharp_action_positions` GRADED rows: **20020**
- `sharp_action_positions` PENDING rows: **208** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 7/6/2026, 8:43:35 AM ET — 202 min · within 2 cron cycles

**Alarms**: pending > 200 OR rebuild lag > 4h → cron is lagging or failing — check `gh run list --workflow="Grade Sharp Actions"`.

#### B-only roster — wallets currently promoted via Source B path only

Wallets here would have been EXCLUDED under v1 (Source-A-only). Top by Source-B bet count per sport. The 2-week re-eval (2026-05-24) will compare these wallets' realized lift against A-only and A+B cohorts.

**MLB** — 25 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...9a27` | CONFIRMED | 467 | +12.3% | +4.4% |
| `...135d` | CONFIRMED | 375 | +2.1% | +6.8% |
| `...3532` | CONFIRMED | 324 | +1.6% | +6% |
| `...1eae` | FLAT | 147 | +3.1% | -1.4% |
| `...69c2` | FLAT | 86 | +7.8% | -8% |
| `...c684` | FLAT | 85 | +6.6% | -2.2% |
| `...ad50` | CONFIRMED | 76 | +15.5% | +7.7% |
| `...39b3` | CONFIRMED | 63 | +1.5% | +1.6% |
| `...d6d2` | FLAT | 38 | +6.8% | -25.5% |
| `...cff6` | CONFIRMED | 26 | +6.6% | +22% |
| … | 15 more | | | |

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

**SOC** — 13 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...8d4c` | CONFIRMED | 65 | +5% | +38.6% |
| `...e8f1` | CONFIRMED | 31 | +5.1% | +1.5% |
| `...3f67` | CONFIRMED | 29 | +5.9% | +18.9% |
| `...8b21` | CONFIRMED | 23 | +7.3% | +47.8% |
| `...d2f7` | FLAT | 16 | +74.9% | -4.5% |
| `...4d8b` | CONFIRMED | 16 | +22.1% | +72% |
| `...ef79` | FLAT | 13 | +39.9% | -3.5% |
| `...6aa1` | CONFIRMED | 12 | +17% | +28.9% |
| `...f6e1` | CONFIRMED | 10 | +22.7% | +26.6% |
| `...1057` | CONFIRMED | 7 | +59.4% | +73.3% |
| … | 3 more | | | |

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

Slate: **2026-07-05** · 57 bets · 27 distinct proven wallets · WR 46% · $ vol $2.11M · $ PnL -$432.8K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...a2ca` (FLAT) | SOC | ML | England @ Mexico | $392.6K | **W** | $608.5K |
| `...bba3` (CONFIRMED) | SOC | ML | England @ Mexico | $100.0K | **W** | $155.0K |
| `...a3d5` (FLAT) | SOC | ML | England @ Mexico | $77.1K | **W** | $119.5K |
| `...11a4` (CONFIRMED) | SOC | ML | England @ Mexico | $27.5K | **W** | $42.6K |
| `...5ba1` (FLAT) | MLB | ML | San Diego Padres @ Los Angeles Dodgers | $8.7K | **W** | $17.1K |
| `...90ea` (CONFIRMED) | SOC | ML | England @ Mexico | $6.6K | **W** | $10.3K |
| `...f960` (CONFIRMED) | MLB | SPREAD | San Diego Padres @ Los Angeles Dodgers | $10.4K | **W** | $9.9K |
| `...5ba1` (FLAT) | MLB | TOTAL | Detroit Tigers @ Texas Rangers | $8.3K | **W** | $7.6K |
| `...4cdf` (FLAT) | SOC | ML | England @ Mexico | $4.7K | **W** | $7.3K |
| `...1e50` (CONFIRMED) | MLB | SPREAD | San Diego Padres @ Los Angeles Dodgers | $4.5K | **W** | $4.3K |
| `...35e3` (FLAT) | MLB | TOTAL | San Diego Padres @ Los Angeles Dodgers | $3.7K | **W** | $3.3K |
| `...9d74` (CONFIRMED) | SOC | ML | England @ Mexico | $2.0K | **W** | $3.1K |
| `...2a75` (CONFIRMED) | MLB | TOTAL | San Diego Padres @ Los Angeles Dodgers | $2.9K | **W** | $2.6K |
| `...44b0` (CONFIRMED) | SOC | ML | England @ Mexico | $1.7K | **W** | $2.6K |
| `...1e50` (CONFIRMED) | MLB | ML | St. Louis Cardinals @ Chicago Cubs | $3.4K | **W** | $2.4K |
| `...1e50` (CONFIRMED) | SOC | ML | England @ Mexico | $1.2K | **W** | $1.9K |
| `...f960` (CONFIRMED) | MLB | TOTAL | Minnesota Twins @ New York Yankees | $1.8K | **W** | $1.6K |
| `...2f63` (FLAT) | MLB | ML | Boston Red Sox @ Los Angeles Angels | $2.5K | **W** | $1.6K |
| `...1e50` (CONFIRMED) | MLB | TOTAL | San Diego Padres @ Los Angeles Dodgers | $1.3K | **W** | $1.2K |
| `...1e50` (CONFIRMED) | MLB | ML | Boston Red Sox @ Los Angeles Angels | $1.6K | **W** | $1.0K |
| `...1e50` (CONFIRMED) | MLB | ML | New York Mets @ Atlanta Braves | $783 | **W** | $746 |
| `...1e50` (CONFIRMED) | MLB | TOTAL | St. Louis Cardinals @ Chicago Cubs | $750 | **W** | $682 |
| `...1e50` (CONFIRMED) | SOC | ML | Norway @ Brazil | $713 | **W** | $548 |
| `...2a75` (CONFIRMED) | MLB | TOTAL | Tampa Bay Rays @ Houston Astros | $584 | **W** | $541 |
| `...6418` (CONFIRMED) | SOC | ML | Norway @ Brazil | $400 | **W** | $308 |
| `...2a75` (CONFIRMED) | MLB | SPREAD | San Diego Padres @ Los Angeles Dodgers | $295 | **W** | $281 |
| `...68b3` (FLAT) | MLB | SPREAD | New York Mets @ Atlanta Braves | $305 | L | -$305 |
| `...2a75` (CONFIRMED) | MLB | ML | Tampa Bay Rays @ Houston Astros | $1.1K | L | -$1.1K |
| `...90ea` (CONFIRMED) | SOC | ML | Norway @ Brazil | $1.2K | L | -$1.2K |
| `...f960` (CONFIRMED) | MLB | SPREAD | New York Mets @ Atlanta Braves | $1.5K | L | -$1.5K |
| `...1e50` (CONFIRMED) | MLB | ML | Minnesota Twins @ New York Yankees | $1.6K | L | -$1.6K |
| `...1e50` (CONFIRMED) | MLB | TOTAL | Milwaukee Brewers @ Arizona Diamondbacks | $2.0K | L | -$2.0K |
| `...a6f5` (CONFIRMED) | SOC | ML | England @ Mexico | $2.6K | L | -$2.6K |
| `...1e50` (CONFIRMED) | MLB | TOTAL | Philadelphia Phillies @ Kansas City Royals | $2.8K | L | -$2.8K |
| `...f960` (CONFIRMED) | MLB | ML | Minnesota Twins @ New York Yankees | $3.7K | L | -$3.7K |
| `...35e3` (FLAT) | MLB | SPREAD | New York Mets @ Atlanta Braves | $4.8K | L | -$4.8K |
| `...a6f5` (CONFIRMED) | SOC | ML | Norway @ Brazil | $5.5K | L | -$5.5K |
| `...11a4` (CONFIRMED) | SOC | ML | Norway @ Brazil | $6.9K | L | -$6.9K |
| `...4cdf` (FLAT) | SOC | ML | Norway @ Brazil | $8.0K | L | -$8.0K |
| `...2f63` (FLAT) | MLB | TOTAL | San Diego Padres @ Los Angeles Dodgers | $8.9K | L | -$8.9K |
| `...aeea` (CONFIRMED) | SOC | ML | England @ Mexico | $9.1K | L | -$9.1K |
| `...2f63` (FLAT) | MLB | TOTAL | Philadelphia Phillies @ Kansas City Royals | $10.2K | L | -$10.2K |
| `...d227` (CONFIRMED) | MLB | SPREAD | St. Louis Cardinals @ Chicago Cubs | $11.2K | L | -$11.2K |
| `...8f33` (CONFIRMED) | MLB | ML | New York Mets @ Atlanta Braves | $19.8K | L | -$19.8K |
| `...77f1` (FLAT) | SOC | ML | Norway @ Brazil | $22.5K | L | -$22.5K |
| `...fc82` (FLAT) | MLB | ML | San Francisco Giants @ Colorado Rockies | $24.5K | L | -$24.5K |
| `...2a9e` (CONFIRMED) | SOC | ML | Norway @ Brazil | $26.9K | L | -$26.9K |
| `...bab3` (FLAT) | SOC | ML | England @ Mexico | $40.0K | L | -$40.0K |
| `...fec8` (CONFIRMED) | SOC | ML | Norway @ Brazil | $55.3K | L | -$55.3K |
| `...2a9e` (CONFIRMED) | SOC | ML | England @ Mexico | $77.6K | L | -$77.6K |
| `...1697` (CONFIRMED) | SOC | ML | England @ Mexico | $82.0K | L | -$82.0K |
| `...2f63` (CONFIRMED) | SOC | ML | Norway @ Brazil | $91.9K | L | -$91.9K |
| `...a2ca` (FLAT) | SOC | ML | Norway @ Brazil | $99.3K | L | -$99.3K |
| `...a3d5` (FLAT) | SOC | ML | Norway @ Brazil | $127.7K | L | -$127.7K |
| `...bab3` (FLAT) | SOC | ML | Norway @ Brazil | $165.0K | L | -$165.0K |
| `...627b` (CONFIRMED) | SOC | ML | Norway @ Brazil | $198.7K | L | -$198.7K |
| `...2f63` (CONFIRMED) | SOC | ML | England @ Mexico | $326.7K | L | -$326.7K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 16 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 8 | 75% | 4.0 | +3.61 | +45% | $321.7K | $225.8K | +70% | 4W |
| 2 | `...2a75` | CONFIRMED | 10 | 80% | 3.3 | +5.15 | +51% | $20.4K | $12.8K | +63% | 1W |
| 3 | `...1e50` | CONFIRMED | 37 | 59% | 12.3 | +4.64 | +13% | $67.8K | $10.6K | +16% | 4W |
| 4 | `...e3d0` | CONFIRMED | 2 | 50% | 2.0 | -0.09 | -5% | $36.9K | $10.3K | +28% | 1L |
| 5 | `...bba3` | CONFIRMED | 1 | 100% | 1.0 | +0.45 | +45% | $13.4K | $6.1K | +45% | 1W |
| 6 | `...f960` | CONFIRMED | 8 | 50% | 4.0 | -0.88 | -11% | $32.5K | $5.1K | +16% | 1W |
| 7 | `...9705` | CONFIRMED | 4 | 75% | 2.0 | +1.93 | +48% | $11.3K | $5.0K | +44% | 1L |
| 8 | `...88a3` | CONFIRMED | 5 | 60% | 2.5 | +0.52 | +10% | $6.6K | $1.3K | +19% | 2W |
| 9 | `...68b3` | FLAT | 2 | 0% | 0.7 | -2.00 | -100% | $736 | -$736 | -100% | 2L |
| 10 | `...35e3` | FLAT | 4 | 50% | 2.0 | -0.19 | -5% | $12.8K | -$1.7K | -14% | 1W |
| 11 | `...d227` | CONFIRMED | 3 | 67% | 1.0 | +0.54 | +18% | $22.7K | -$4.5K | -20% | 1L |
| 12 | `...23c4` | FLAT | 2 | 50% | 2.0 | +0.09 | +4% | $34.1K | -$15.1K | -44% | 1L |
| 13 | `...fc82` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $24.5K | -$24.5K | -100% | 1L |
| 14 | `...2f63` | FLAT | 16 | 56% | 5.3 | +0.90 | +6% | $106.7K | -$40.8K | -38% | 2L |
| 15 | `...8f33` | CONFIRMED | 14 | 36% | 4.7 | -4.44 | -32% | $126.4K | -$47.8K | -38% | 5L |

**SOC** — 32 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...a2ca` | FLAT | 2 | 50% | 2.0 | +0.55 | +27% | $491.8K | $509.2K | +104% | 1L |
| 2 | `...11a4` | CONFIRMED | 7 | 71% | 2.3 | +1.15 | +16% | $501.7K | $138.5K | +28% | 1L |
| 3 | `...bba3` | CONFIRMED | 2 | 50% | 0.7 | +0.55 | +27% | $125.8K | $129.2K | +103% | 1W |
| 4 | `...77f1` | FLAT | 2 | 50% | 1.0 | -0.17 | -8% | $182.6K | $110.9K | +61% | 1L |
| 5 | `...8a06` | CONFIRMED | 1 | 100% | 1.0 | +0.43 | +43% | $123.8K | $52.7K | +43% | 1W |
| 6 | `...d739` | FLAT | 1 | 100% | 1.0 | +0.83 | +83% | $53.0K | $44.1K | +83% | 1W |
| 7 | `...fec8` | CONFIRMED | 2 | 50% | 1.0 | -0.17 | -8% | $153.3K | $26.4K | +17% | 1L |
| 8 | `...8973` | FLAT | 1 | 100% | 1.0 | +1.40 | +140% | $17.3K | $24.2K | +140% | 1W |
| 9 | `...aeea` | CONFIRMED | 2 | 50% | 1.0 | -0.17 | -8% | $47.1K | $22.6K | +48% | 1L |
| 10 | `...4cdf` | FLAT | 3 | 67% | 1.5 | +1.38 | +46% | $27.5K | $11.7K | +43% | 1L |
| 11 | `...90ea` | CONFIRMED | 3 | 67% | 1.5 | +1.38 | +46% | $8.6K | $9.7K | +113% | 1L |
| 12 | `...8f33` | FLAT | 1 | 100% | 1.0 | +0.83 | +83% | $11.2K | $9.3K | +83% | 1W |
| 13 | `...dc5b` | CONFIRMED | 3 | 100% | 1.5 | +1.45 | +48% | $22.1K | $9.2K | +42% | 3W |
| 14 | `...a3d5` | FLAT | 4 | 75% | 1.3 | +1.81 | +45% | $237.1K | $8.9K | +4% | 1L |
| 15 | `...35e3` | CONFIRMED | 1 | 100% | 1.0 | +0.83 | +83% | $7.5K | $6.3K | +83% | 1W |

#### §6b-2. 7-day

**MLB** — 17 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 20 | 70% | 3.3 | +8.07 | +40% | $707.7K | $388.0K | +55% | 4W |
| 2 | `...e3d0` | CONFIRMED | 6 | 67% | 1.2 | +1.67 | +28% | $148.7K | $66.8K | +45% | 1L |
| 3 | `...2f63` | FLAT | 40 | 68% | 5.7 | +13.61 | +34% | $364.4K | $52.8K | +14% | 2L |
| 4 | `...1e50` | CONFIRMED | 90 | 61% | 12.9 | +16.71 | +19% | $179.4K | $23.2K | +13% | 4W |
| 5 | `...35e3` | FLAT | 13 | 69% | 1.9 | +3.96 | +30% | $60.0K | $18.9K | +32% | 1W |
| 6 | `...9705` | CONFIRMED | 24 | 54% | 4.0 | +2.69 | +11% | $67.9K | $14.7K | +22% | 1L |
| 7 | `...2a75` | CONFIRMED | 24 | 75% | 3.4 | +10.06 | +42% | $67.3K | $11.4K | +17% | 1W |
| 8 | `...bba3` | CONFIRMED | 3 | 100% | 1.5 | +1.40 | +47% | $24.0K | $11.1K | +46% | 3W |
| 9 | `...f960` | CONFIRMED | 8 | 50% | 4.0 | -0.88 | -11% | $32.5K | $5.1K | +16% | 1W |
| 10 | `...d227` | CONFIRMED | 4 | 75% | 0.7 | +1.15 | +29% | $34.0K | $2.4K | +7% | 1L |
| 11 | `...0f9a` | FLAT | 1 | 100% | 1.0 | +0.45 | +45% | $3.4K | $1.5K | +45% | 1W |
| 12 | `...88a3` | CONFIRMED | 14 | 50% | 2.3 | -1.39 | -10% | $22.8K | $1.0K | +4% | 2W |
| 13 | `...68b3` | FLAT | 5 | 40% | 0.7 | -1.16 | -23% | $1.8K | -$297 | -17% | 2L |
| 14 | `...8f33` | CONFIRMED | 31 | 52% | 5.2 | +0.16 | +1% | $252.3K | -$12.8K | -5% | 5L |
| 15 | `...fc82` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $24.5K | -$24.5K | -100% | 1L |

**SOC** — 43 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...658e` | CONFIRMED | 2 | 100% | 0.7 | +1.94 | +97% | $482.2K | $453.0K | +94% | 2W |
| 2 | `...8a06` | CONFIRMED | 3 | 100% | 0.6 | +3.89 | +130% | $380.5K | $349.5K | +92% | 3W |
| 3 | `...77f1` | FLAT | 4 | 75% | 0.6 | +2.05 | +51% | $334.9K | $305.1K | +91% | 1L |
| 4 | `...a3d5` | FLAT | 7 | 86% | 1.4 | +5.56 | +79% | $408.8K | $287.0K | +70% | 1L |
| 5 | `...a2ca` | FLAT | 6 | 67% | 0.9 | +0.97 | +16% | $1.46M | $204.0K | +14% | 1L |
| 6 | `...fec8` | CONFIRMED | 4 | 75% | 0.6 | +1.29 | +32% | $369.7K | $183.6K | +50% | 1L |
| 7 | `...11a4` | CONFIRMED | 15 | 67% | 2.1 | +2.20 | +15% | $628.6K | $141.8K | +23% | 1L |
| 8 | `...bab3` | FLAT | 5 | 60% | 0.8 | +1.34 | +27% | $555.3K | $136.5K | +25% | 2L |
| 9 | `...bba3` | CONFIRMED | 4 | 50% | 0.6 | -0.16 | -4% | $173.9K | $130.6K | +75% | 1W |
| 10 | `...00f2` | CONFIRMED | 1 | 100% | 1.0 | +1.25 | +125% | $88.0K | $110.0K | +125% | 1W |
| 11 | `...0c2e` | CONFIRMED | 2 | 50% | 0.5 | -0.31 | -16% | $131.0K | $72.1K | +55% | 1W |
| 12 | `...aeea` | CONFIRMED | 4 | 75% | 0.7 | +1.77 | +44% | $103.7K | $68.6K | +66% | 1L |
| 13 | `...abaf` | CONFIRMED | 8 | 38% | 1.3 | -2.73 | -34% | $367.7K | $65.8K | +18% | 3L |
| 14 | `...059d` | FLAT | 3 | 67% | 3.0 | +1.22 | +41% | $347.3K | $64.0K | +18% | 1L |
| 15 | `...2a9e` | CONFIRMED | 10 | 50% | 1.4 | -0.71 | -7% | $441.2K | $50.2K | +11% | 2L |

#### §6b-3. All-time

**MLB** — 26 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 109 | 56% | 2.2 | +16.56 | +15% | $3.32M | $1.31M | +40% | 4W |
| 2 | `...3987` | CONFIRMED | 44 | 68% | 4.0 | +14.19 | +32% | $2.29M | $666.8K | +29% | 1L |
| 3 | `...5213` | CONFIRMED | 15 | 73% | 0.7 | +6.08 | +41% | $599.4K | $278.1K | +46% | 1W |
| 4 | `...2f63` | FLAT | 186 | 54% | 2.6 | +11.56 | +6% | $1.18M | $129.6K | +11% | 2L |
| 5 | `...fc82` | FLAT | 29 | 52% | 0.4 | +0.84 | +3% | $583.0K | $118.7K | +20% | 1L |
| 6 | `...d227` | CONFIRMED | 42 | 67% | 0.7 | +9.97 | +24% | $373.3K | $98.5K | +26% | 1L |
| 7 | `...e3d0` | CONFIRMED | 14 | 64% | 0.4 | +3.64 | +26% | $304.4K | $95.1K | +31% | 1L |
| 8 | `...f960` | CONFIRMED | 10 | 60% | 0.8 | +1.05 | +10% | $93.6K | $66.2K | +71% | 1W |
| 9 | `...be17` | FLAT | 2 | 50% | 0.1 | +5.95 | +298% | $30.4K | $52.6K | +173% | 1L |
| 10 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 11 | `...1e50` | CONFIRMED | 237 | 55% | 8.5 | +16.89 | +7% | $355.2K | $22.8K | +6% | 4W |
| 12 | `...8f33` | CONFIRMED | 191 | 54% | 4.4 | +2.29 | +1% | $1.16M | $19.8K | +2% | 5L |
| 13 | `...9705` | CONFIRMED | 24 | 54% | 4.0 | +2.69 | +11% | $67.9K | $14.7K | +22% | 1L |
| 14 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 15 | `...aeea` | FLAT | 20 | 55% | 0.3 | +0.82 | +4% | $48.1K | $12.5K | +26% | 1L |

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

**SOC** — 64 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | FLAT | 13 | 69% | 1.2 | +30.47 | +234% | $4.30M | $8.68M | +202% | 2W |
| 2 | `...266e` | CONFIRMED | 2 | 100% | 1.0 | +18.11 | +905% | $315.4K | $2.98M | +946% | 2W |
| 3 | `...bba3` | CONFIRMED | 14 | 71% | 0.7 | +38.17 | +273% | $554.4K | $2.62M | +472% | 1W |
| 4 | `...11a4` | CONFIRMED | 44 | 68% | 2.2 | +35.46 | +81% | $1.33M | $2.13M | +160% | 1L |
| 5 | `...f4de` | CONFIRMED | 3 | 67% | 0.2 | +24.11 | +804% | $118.1K | $1.77M | +1499% | 1L |
| 6 | `...aeea` | CONFIRMED | 22 | 64% | 1.1 | +24.22 | +110% | $876.4K | $1.67M | +190% | 1L |
| 7 | `...14fb` | FLAT | 2 | 100% | 2.0 | +2.15 | +108% | $2.63M | $1.64M | +62% | 2W |
| 8 | `...2f63` | CONFIRMED | 27 | 56% | 1.4 | +28.96 | +107% | $2.37M | $1.61M | +68% | 2L |
| 9 | `...abaf` | CONFIRMED | 18 | 61% | 1.1 | +12.85 | +71% | $1.08M | $1.41M | +130% | 3L |
| 10 | `...020b` | FLAT | 13 | 38% | 1.1 | +8.29 | +64% | $1.00M | $1.33M | +133% | 1W |
| 11 | `...2a9e` | CONFIRMED | 45 | 51% | 2.1 | +8.41 | +19% | $1.99M | $1.19M | +60% | 2L |
| 12 | `...a2ca` | FLAT | 10 | 70% | 0.8 | +19.55 | +196% | $1.85M | $1.01M | +55% | 1L |
| 13 | `...e279` | CONFIRMED | 3 | 100% | 0.2 | +5.81 | +194% | $300.0K | $799.9K | +267% | 3W |
| 14 | `...059d` | FLAT | 7 | 71% | 0.8 | +7.87 | +112% | $664.2K | $750.6K | +113% | 1L |
| 15 | `...66f5` | CONFIRMED | 4 | 75% | 0.4 | +0.92 | +23% | $1.61M | $653.6K | +41% | 1W |

### §6c. Active streaks (≥3 in a row, last bet within 3 days)

Proven `(wallet × sport)` pairs currently riding a 3-or-more-bet run with their most recent bet inside the last 3 calendar days. Hot-hand monitor — and the same surface for cold streaks worth fading.

| Wallet | Sport | Tier | Streak | Last bet | All-time bets | WR% | $ PnL | $ ROI |
|---|---|---|---|---|---|---|---|---|
| `...35e3` | SOC | CONFIRMED | **7W** | 2026-07-04 | 10 | 90% | $76.7K | +65% |
| `...6418` | SOC | CONFIRMED | **7W** | 2026-07-05 | 15 | 87% | $76.6K | +351% |
| `...1e50` | SOC | CONFIRMED | **6W** | 2026-07-05 | 57 | 51% | $16.6K | +16% |
| `...8f33` | MLB | CONFIRMED | **5L** | 2026-07-05 | 191 | 54% | $19.8K | +2% |
| `...abaf` | MLB | CONFIRMED | **4W** | 2026-07-04 | 109 | 56% | $1.31M | +40% |
| `...d739` | SOC | FLAT | **4W** | 2026-07-04 | 4 | 100% | $382.1K | +193% |
| `...0ff5` | SOC | CONFIRMED | **4W** | 2026-07-02 | 8 | 75% | $42.7K | +40% |
| `...1e50` | MLB | CONFIRMED | **4W** | 2026-07-05 | 237 | 55% | $22.8K | +6% |
| `...dc5b` | SOC | CONFIRMED | **4W** | 2026-07-04 | 4 | 100% | $13.0K | +40% |
| `...abaf` | SOC | CONFIRMED | **3L** | 2026-07-04 | 18 | 61% | $1.41M | +130% |
| `...e279` | SOC | CONFIRMED | **3W** | 2026-07-02 | 3 | 100% | $799.9K | +267% |
| `...8a06` | SOC | CONFIRMED | **3W** | 2026-07-03 | 3 | 100% | $349.5K | +92% |
| `...4582` | SOC | CONFIRMED | **3W** | 2026-07-04 | 3 | 100% | $176.6K | +66% |
| `...bba3` | MLB | CONFIRMED | **3W** | 2026-07-03 | 11 | 64% | -$44.1K | -18% |
| `...5ba1` | MLB | FLAT | **3W** | 2026-07-05 | 12 | 67% | -$116.2K | -27% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL | SOC N · $vol · $PnL |
|---|---|---|---|---|---|
| 2026-06-22 | 73 · $2.74M · $10.25M | 36 · $266.4K · $148.7K | — | — | 37 · $2.47M · $10.10M |
| 2026-06-23 | 35 · $531.3K · $5.57M | 29 · $214.9K · -$73.1K | — | — | 6 · $316.4K · $5.65M |
| 2026-06-24 | 74 · $1.82M · $1.14M | 35 · $414.4K · $190.2K | — | — | 39 · $1.40M · $945.4K |
| 2026-06-25 | 74 · $3.64M · -$2.78M | 21 · $215.7K · $63.5K | — | — | 53 · $3.42M · -$2.85M |
| 2026-06-26 | 68 · $6.27M · $3.05M | 21 · $345.4K · -$202.1K | — | — | 47 · $5.93M · $3.25M |
| 2026-06-27 | 66 · $1.52M · $283.8K | 27 · $214.5K · -$10.3K | — | — | 39 · $1.30M · $294.2K |
| 2026-06-28 | 70 · $2.41M · $1.12M | 51 · $554.9K · -$144.5K | — | — | 19 · $1.85M · $1.27M |
| 2026-06-29 | 78 · $2.40M · -$183.4K | 45 · $346.8K · $71.6K | — | — | 33 · $2.06M · -$255.0K |
| 2026-06-30 | 80 · $2.05M · $1.69M | 50 · $418.4K · $123.4K | — | — | 30 · $1.63M · $1.56M |
| 2026-07-01 | 64 · $805.0K · $524.6K | 48 · $254.6K · $24.0K | — | — | 16 · $550.4K · $500.7K |
| 2026-07-02 | 75 · $2.03M · $670.0K | 42 · $680.4K · -$37.1K | — | — | 33 · $1.35M · $707.1K |
| 2026-07-03 | 67 · $1.08M · -$284.7K | 43 · $399.6K · $78.3K | — | — | 24 · $683.3K · -$363.0K |
| 2026-07-04 | 79 · $2.10M · $764.4K | 54 · $562.4K · $30.5K | — | — | 25 · $1.54M · $733.8K |
| 2026-07-05 | 57 · $2.11M · -$432.8K | 28 · $144.0K · -$37.5K | — | — | 29 · $1.96M · -$395.3K |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-07-05_
