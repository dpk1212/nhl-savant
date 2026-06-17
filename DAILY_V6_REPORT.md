# Sharp Intel v6 — Daily Master Report

_Auto-generated **6/17/2026, 12:28:43 PM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (264 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-06-16** · 21 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 21 | 12-9-0 | 57.1% | -10.35u | +1.07u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Baltimore Orioles @ Seattle Mariners | Seattle Mariners | 4.0★ · 1.00u | +0 | +1 | +0 | +1 | -145 | **W** | +0.00u |
| MLB | ML | Colorado Rockies @ Chicago Cubs | Chicago Cubs | 4.5★ · 3.00u | +0 | +1 | +0 | +1 | -194 | L | -3.00u |
| MLB | ML | Detroit Tigers @ Houston Astros | Houston Astros | 4.5★ · 3.00u | +3 | +5 | +5 | +10 | -163 | **W** | +2.38u |
| MLB | ML | Kansas City Royals @ Washington Nationals | Washington Nationals | 4.5★ · 3.00u | +2 | +3 | +0 | +3 | -135 | **W** | +4.48u |
| MLB | ML | Los Angeles Angels @ Arizona Diamondbacks | Los Angeles Angels | 2.5★ · 0.25u | +0 | +1 | +1 | +2 | -106 | **W** | +0.00u |
| MLB | ML | Miami Marlins @ Philadelphia Phillies | Philadelphia Phillies | 3.0★ · 0.50u | +1 | +2 | +2 | +4 | -174 | **W** | +2.29u |
| MLB | ML | New York Mets @ Cincinnati Reds | New York Mets | 4.0★ · 1.00u | +0 | +0 | +0 | +0 | -116 | L | -1.00u |
| MLB | ML | Pittsburgh Pirates @ Athletics | Athletics | 3.0★ · 0.50u | +0 | +0 | +0 | +0 | -138 | L | -0.50u |
| MLB | ML | San Diego Padres @ St. Louis Cardinals | San Diego Padres | 3.0★ · 0.50u | +0 | +1 | +0 | +1 | -102 | L | -0.50u |
| MLB | ML | Tampa Bay Rays @ Los Angeles Dodgers | Tampa Bay Rays | 5.0★ · 2.50u | -1 | -1 | +0 | -1 | +120 | L | -2.50u |
| MLB | ML | Toronto Blue Jays @ Boston Red Sox | Toronto Blue Jays | 2.5★ · 0.25u | +0 | +1 | -1 | +0 | -112 | **W** | +0.00u |
| MLB | SPREAD | Cleveland Guardians @ Milwaukee Brewers | Cleveland Guardians | 4.5★ · 1.00u | +0 | +1 | +0 | +1 | -162 | **W** | +0.00u |
| MLB | SPREAD | Chicago White Sox @ New York Yankees | New York Yankees | 4.0★ · 1.00u | +0 | +1 | +0 | +1 | +156 | **W** | +0.00u |
| MLB | SPREAD | San Diego Padres @ St. Louis Cardinals | San Diego Padres | 4.0★ · 1.00u | +0 | +0 | +0 | +0 | -160 | **W** | +0.00u |
| MLB | SPREAD | Toronto Blue Jays @ Boston Red Sox | Toronto Blue Jays | 4.0★ · 1.00u | +0 | +1 | +0 | +1 | -110 | **W** | +0.00u |
| MLB | TOTAL | Cleveland Guardians @ Milwaukee Brewers | Under 8 | 5.0★ · 5.00u | +0 | +1 | -1 | +0 | -101 | **W** | +0.00u |
| MLB | TOTAL | Colorado Rockies @ Chicago Cubs | Over 9.5 | 4.5★ · 3.00u | +0 | +1 | +2 | +3 | -110 | L | -3.00u |
| MLB | TOTAL | Detroit Tigers @ Houston Astros | Over 7.5 | 4.5★ · 3.00u | +0 | -1 | +0 | -1 | -110 | L | -3.00u |
| MLB | TOTAL | Kansas City Royals @ Washington Nationals | Over 8.5 | 4.5★ · 3.00u | +0 | +1 | +0 | +1 | -110 | **W** | +0.00u |
| MLB | TOTAL | New York Mets @ Cincinnati Reds | Over 9.5 | 5.0★ · 5.00u | +0 | +2 | +1 | +3 | -110 | L | -5.00u |
| MLB | TOTAL | Tampa Bay Rays @ Los Angeles Dodgers | Over 9.5 | 4.0★ · 1.00u | +0 | +0 | +0 | +0 | -110 | L | -1.00u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **51** shipped · 25-26-0 · WR 49.0% · PnL -34.85u (peak) / -5.21u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 51)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 1 | 1-0-0 | 100.0% | +2.38u | +0.61u |
| HC = +2 | 1 | 1-0-0 | 100.0% | +4.48u | +0.74u |
| HC = +1 | 6 | 5-1-0 | 83.3% | +4.49u | +2.62u |
| HC = 0 | 41 | 17-24-0 | 41.5% | -44.32u | -8.82u |
| HC ≤ −1 | 2 | 1-1-0 | 50.0% | -1.88u | -0.37u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 4 | 3-1-0 | 75.0% | +6.07u | +1.11u |
| +2 | 7 | 3-4-0 | 42.9% | -5.73u | -1.76u |
| +1 | 28 | 14-14-0 | 50.0% | -29.08u | -1.50u |
| 0 | 7 | 2-5-0 | 28.6% | -5.25u | -3.47u |
| −1 | 5 | 3-2-0 | 60.0% | -0.86u | +0.40u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 3 | 3-0-0 | 100.0% | +4.59u | +2.02u |
| +2 | 6 | 2-4-0 | 33.3% | -4.19u | -2.63u |
| +1 | 13 | 6-7-0 | 46.2% | -19.24u | -1.48u |
| 0 | 25 | 12-13-0 | 48.0% | -15.26u | -3.01u |
| −1 | 3 | 2-1-0 | 66.7% | -0.50u | +0.88u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.25u | -1.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 51)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 30 | 16-14-0 | 53.3% | -23.61u | -0.17u |
| WEAK   (−1 .. 0) | 21 | 9-12-0 | 42.9% | -11.24u | -5.04u |

### §2b. 7-day

Total: **123** shipped · 60-60-3 · WR 50.0% · PnL -42.21u (peak) / -6.53u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 123)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 1-1-0 | 50.0% | +2.13u | -0.39u |
| HC = +2 | 1 | 1-0-0 | 100.0% | +4.48u | +0.74u |
| HC = +1 | 14 | 9-5-0 | 64.3% | +8.73u | +2.41u |
| HC = 0 | 101 | 45-53-3 | 45.9% | -58.92u | -11.34u |
| HC ≤ −1 | 5 | 4-1-0 | 80.0% | +1.37u | +2.05u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 12 | 5-7-0 | 41.7% | -1.64u | -3.05u |
| +2 | 16 | 10-5-1 | 66.7% | -0.93u | +3.12u |
| +1 | 56 | 26-29-1 | 47.3% | -43.23u | -5.27u |
| 0 | 29 | 15-14-0 | 51.7% | +7.72u | +0.37u |
| −1 | 9 | 4-4-1 | 50.0% | -3.88u | -0.69u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.25u | -1.00u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 11 | 6-4-1 | 60.0% | -2.23u | +0.46u |
| +2 | 16 | 8-8-0 | 50.0% | -0.79u | -0.92u |
| +1 | 38 | 21-15-2 | 58.3% | -9.73u | +3.03u |
| 0 | 43 | 19-24-0 | 44.2% | -27.01u | -6.05u |
| −1 | 10 | 4-6-0 | 40.0% | -4.26u | -1.98u |
| ≤ −2 | 5 | 2-3-0 | 40.0% | +1.81u | -1.06u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 123)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| STRONG (+3 .. +5) | 1 | 0-1-0 | 0.0% | -0.25u | -1.00u |
| NEUT   (0 .. +3) | 67 | 36-29-2 | 55.4% | -15.42u | +2.86u |
| WEAK   (−1 .. 0) | 54 | 23-30-1 | 43.4% | -28.20u | -10.17u |
| FADE   (< −1) | 1 | 1-0-0 | 100.0% | +1.66u | +1.78u |

### §2c. All-time

Total: **678** shipped · 341-329-8 · WR 50.9% · PnL -77.30u (peak) / -18.15u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 567)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 12 | 4-8-0 | 33.3% | -6.70u | -6.05u |
| HC = +2 | 32 | 17-15-0 | 53.1% | -0.13u | +0.62u |
| HC = +1 | 161 | 91-70-0 | 56.5% | +11.98u | +13.28u |
| HC = 0 | 335 | 163-165-7 | 49.7% | -82.05u | -21.40u |
| HC ≤ −1 | 26 | 15-11-0 | 57.7% | +10.20u | +4.19u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 109 | 52-57-0 | 47.7% | -25.43u | -5.06u |
| +2 | 137 | 67-69-1 | 49.3% | -34.17u | -6.46u |
| +1 | 253 | 136-114-3 | 54.4% | -21.62u | +7.16u |
| 0 | 140 | 71-66-3 | 51.8% | +12.57u | -3.12u |
| −1 | 27 | 9-17-1 | 34.6% | -9.35u | -9.01u |
| ≤ −2 | 6 | 2-4-0 | 33.3% | -3.29u | -2.51u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 130 | 65-62-3 | 51.2% | -24.34u | -2.13u |
| +2 | 123 | 56-67-0 | 45.5% | -38.75u | -14.75u |
| +1 | 207 | 112-92-3 | 54.9% | +13.32u | +7.40u |
| 0 | 142 | 71-70-1 | 50.4% | -24.35u | -4.03u |
| −1 | 52 | 28-23-1 | 54.9% | +10.58u | +3.00u |
| ≤ −2 | 18 | 5-13-0 | 27.8% | -17.00u | -8.42u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 542)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 3 | 3-0-0 | 100.0% | +8.01u | +2.34u |
| LOCK   (+5 .. +7) | 9 | 5-4-0 | 55.6% | -2.93u | -0.47u |
| STRONG (+3 .. +5) | 23 | 13-10-0 | 56.5% | -6.91u | +1.77u |
| NEUT   (0 .. +3) | 332 | 170-160-2 | 51.5% | -48.55u | -10.15u |
| WEAK   (−1 .. 0) | 160 | 78-78-4 | 50.0% | -16.05u | -7.66u |
| FADE   (< −1) | 14 | 9-5-0 | 64.3% | +4.68u | +5.05u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29", "05-30", "05-31", "06-01", "06-02", "06-03", "06-04", "06-05", "06-06", "06-07", "06-08", "06-09", "06-10", "06-11", "06-12", "06-13", "06-14", "06-15", "06-16"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98, -10.18, -8.90, -14.92, -23.44, -23.30, -28.89, -32.63, -26.98, -29.77, -33.27, -44.12, -48.21, -40.65, -34.49, -30.14, -28.48, -25.53, -22.94, -25.33, -24.75, -21.34, -10.19, -14.95, -13.13, -10.30, -6.20, -6.21, -4.00, 5.15]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67, -16.17, -15.07, -14.58, -23.93, -16.53, -21.34, -20.03, -10.27, -14.68, -17.58, -11.51, -11.10, -17.79, -24.29, -24.19, -27.68, -32.54, -32.20, -29.06, -23.09, -21.30, -23.13, -30.43, -35.94, -35.44, -37.73, -54.41, -65.05, -82.05]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52, -28.22, -25.84, -31.37, -49.24, -44.70, -55.10, -55.65, -40.24, -49.69, -53.57, -58.35, -62.03, -61.16, -58.77, -56.82, -56.00, -58.91, -48.76, -50.51, -46.96, -36.94, -22.86, -34.92, -38.09, -32.03, -30.22, -46.29, -54.72, -65.07]
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
| 2026-06-16 | +5.15u | -82.05u | -65.07u |

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 77 | 58 | 20 | 34% | 27 | 10 | 3 |
| NBA | 138 | 108 | 44 | 41% | 60 | 29 | 11 |
| NHL | 60 | 43 | 12 | 28% | 24 | 12 | 6 |
| **ALL (any sport)** | **172** | **137** | **56** | **41%** | **72** | **30** | **9** |

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

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | ad88a3 | 9 | 7 | 2 | 77.8% | +4.36 | +48.4% | $9.8K |
| 2 | e05213 | 13 | 10 | 3 | 76.9% | +6.17 | +47.4% | $274.7K |
| 3 | b839b3 | 4 | 3 | 1 | 75.0% | +1.74 | +43.4% | $466 |
| 4 | 913987 | 44 | 30 | 14 | 68.2% | +14.19 | +32.2% | $666.8K |
| 5 | dfa240 | 3 | 2 | 1 | 66.7% | +0.85 | +28.3% | $2.5K |
| 6 | f2d227 | 20 | 12 | 8 | 60.0% | +4.83 | +24.2% | $40.9K |
| 7 | c9bba3 | 6 | 4 | 2 | 66.7% | +1.37 | +22.8% | -$17.7K |
| 8 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 9 | c668b3 | 16 | 10 | 6 | 62.5% | +3.16 | +19.7% | $270 |
| 10 | 779ef0 | 3 | 2 | 1 | 66.7% | +0.54 | +18.0% | -$424 |

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

Roster as of **2026-06-16** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 127 | 58 | 13 | 7 | **20** | 7 | 15.7% |
| NBA | 210 | 108 | 29 | 15 | **44** | 21 | 21.0% |
| NHL | 105 | 43 | 9 | 3 | **12** | 12 | 11.4% |
| **ALL** | **—** | **—** | **—** | **—** | **76** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 33 · 13 | 17 · 7 | 5 · 7 | +30 live |
| NBA | 58 · 29 | 25 · 15 | 23 · 21 | +39 live |
| NHL | 23 · 9 | 6 · 3 | 16 · 12 | +17 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-06-16.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +3 from 17 | +5 from 15 | +9 from 11 | +20 from 0 |
| NBA | +0 from 44 | +0 from 44 | +4 from 40 | +44 from 0 |
| NHL | -1 from 13 | -2 from 14 | -2 from 14 | +12 from 0 |

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
| MLB | 127 | 58 (46%) | 20 (34%) | 13 (65%) | **20** | edge (Eligible→Flat-OK) 66% |
| NBA | 210 | 108 (51%) | 44 (41%) | 29 (66%) | **44** | edge (Eligible→Flat-OK) 59% |
| NHL | 105 | 43 (41%) | 12 (28%) | 9 (75%) | **12** | edge (Eligible→Flat-OK) 72% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 49 | 7 (14.3%) | 7 (14.3%) | 2 (4.1%) |
| MLB | 7-day | 117 | 16 (13.7%) | 14 (12.0%) | 2 (1.7%) |
| MLB | All-time | 497 | 159 (32.0%) | 146 (29.4%) | 18 (3.6%) |
| NBA | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NBA | 7-day | 3 | 3 (100.0%) | 2 (66.7%) | 1 (33.3%) |
| NBA | All-time | 126 | 83 (65.9%) | 69 (54.8%) | 34 (27.0%) |
| NHL | 3-day | 2 | 1 (50.0%) | 1 (50.0%) | 0 (0.0%) |
| NHL | 7-day | 3 | 1 (33.3%) | 1 (33.3%) | 0 (0.0%) |
| NHL | All-time | 49 | 21 (42.9%) | 20 (40.8%) | 5 (10.2%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 51 | 8 (15.7%) | 8 (15.7%) | 2 (3.9%) |
| 7-day | 123 | 20 (16.3%) | 17 (13.8%) | 3 (2.4%) |
| All-time | 672 | 263 (39.1%) | 235 (35.0%) | 57 (8.5%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...be17` | 1 | +6.95 | 23 | -60% |
| `...fc26` | 1 | +0.91 | 16 | -31% |
| `...be00` | 1 | +0.87 | 15 | 10% |
| `...9373` | 1 | +0.87 | 0 | — |
| `...9b3c` | 1 | +0.77 | 8 | 52% |
| `...8d26` | 1 | +0.72 | 5 | -22% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...afd2` | 41 | 51% | -0.5% | 177 | -20% |
| `...135d` | 319 | 50% | -3.3% | 348 | 6% |
| `...600d` | 16 | 50% | -4.3% | 55 | 1% |
| `...0232` | 4 | 50% | -4.5% | 11 | 30% |
| `...2768` | 44 | 45% | -5.3% | 71 | 10% |
| `...017f` | 19 | 47% | -5.6% | 81 | -12% |

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
| MLB | 9 | 14 | **27** | 50 | 54.0% |
| NBA | 10 | 34 | **39** | 83 | 47.0% |
| NHL | 4 | 8 | **17** | 29 | 58.6% |
| **ALL** | **23** | **56** | **83** | **162** | **51.2%** |

#### Pipeline freshness

- `sharp_action_positions` GRADED rows: **14855**
- `sharp_action_positions` PENDING rows: **407** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 6/17/2026, 8:50:31 AM ET — 218 min · within 2 cron cycles

**Alarms**: pending > 200 OR rebuild lag > 4h → cron is lagging or failing — check `gh run list --workflow="Grade Sharp Actions"`.

#### B-only roster — wallets currently promoted via Source B path only

Wallets here would have been EXCLUDED under v1 (Source-A-only). Top by Source-B bet count per sport. The 2-week re-eval (2026-05-24) will compare these wallets' realized lift against A-only and A+B cohorts.

**MLB** — 27 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...9a27` | CONFIRMED | 467 | +12.3% | +4.4% |
| `...135d` | CONFIRMED | 348 | +2.4% | +5.6% |
| `...3532` | CONFIRMED | 322 | +1.5% | +5.5% |
| `...1e50` | FLAT | 219 | +1.2% | -3.4% |
| `...1eae` | FLAT | 147 | +3.1% | -1.4% |
| `...c684` | FLAT | 85 | +6.6% | -2.2% |
| `...69c2` | CONFIRMED | 66 | +17.4% | +1% |
| `...ad50` | CONFIRMED | 53 | +14.4% | +7.7% |
| `...d6d2` | FLAT | 38 | +6.8% | -25.5% |
| `...cff6` | CONFIRMED | 26 | +6.6% | +22% |
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

Slate: **2026-06-16** · 30 bets · 10 distinct proven wallets · WR 60% · $ vol $482.7K · $ PnL -$136.6K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...64aa` (CONFIRMED) | MLB | ML | Miami Marlins @ Philadelphia Phillies | $42.1K | **W** | $24.1K |
| `...d227` (CONFIRMED) | MLB | SPREAD | San Diego Padres @ St. Louis Cardinals | $14.3K | **W** | $24.0K |
| `...5213` (CONFIRMED) | MLB | TOTAL | Cleveland Guardians @ Milwaukee Brewers | $21.2K | **W** | $21.0K |
| `...5213` (CONFIRMED) | MLB | TOTAL | Kansas City Royals @ Washington Nationals | $22.9K | **W** | $20.8K |
| `...64aa` (CONFIRMED) | MLB | ML | Detroit Tigers @ Houston Astros | $19.6K | **W** | $11.7K |
| `...64aa` (CONFIRMED) | MLB | ML | Baltimore Orioles @ Seattle Mariners | $15.6K | **W** | $10.7K |
| `...1f30` (CONFIRMED) | MLB | ML | Detroit Tigers @ Houston Astros | $15.0K | **W** | $8.9K |
| `...23c4` (FLAT) | MLB | ML | Toronto Blue Jays @ Boston Red Sox | $10.0K | **W** | $8.5K |
| `...d227` (CONFIRMED) | MLB | SPREAD | Toronto Blue Jays @ Boston Red Sox | $5.7K | **W** | $5.2K |
| `...d227` (CONFIRMED) | MLB | SPREAD | Chicago White Sox @ New York Yankees | $3.1K | **W** | $4.9K |
| `...64aa` (CONFIRMED) | MLB | ML | Los Angeles Angels @ Arizona Diamondbacks | $3.2K | **W** | $3.0K |
| `...23c4` (FLAT) | MLB | ML | Kansas City Royals @ Washington Nationals | $3.6K | **W** | $2.7K |
| `...8f33` (CONFIRMED) | MLB | ML | Detroit Tigers @ Houston Astros | $4.3K | **W** | $2.5K |
| `...8f33` (CONFIRMED) | MLB | ML | Miami Marlins @ Philadelphia Phillies | $4.3K | **W** | $2.4K |
| `...88a3` (CONFIRMED) | MLB | ML | Miami Marlins @ Philadelphia Phillies | $3.4K | **W** | $1.9K |
| `...8f33` (CONFIRMED) | MLB | SPREAD | Cleveland Guardians @ Milwaukee Brewers | $1.3K | **W** | $805 |
| `...39b3` (CONFIRMED) | MLB | ML | Kansas City Royals @ Washington Nationals | $1.0K | **W** | $746 |
| `...9ef0` (FLAT) | MLB | SPREAD | Detroit Tigers @ Houston Astros | $1.1K | **W** | $705 |
| `...1f30` (CONFIRMED) | MLB | TOTAL | Detroit Tigers @ Houston Astros | $4.0K | L | -$4.0K |
| `...1f30` (CONFIRMED) | MLB | TOTAL | Baltimore Orioles @ Seattle Mariners | $4.4K | L | -$4.4K |
| `...8f33` (CONFIRMED) | MLB | TOTAL | New York Mets @ Cincinnati Reds | $6.8K | L | -$6.8K |
| `...8f33` (CONFIRMED) | MLB | TOTAL | Colorado Rockies @ Chicago Cubs | $7.1K | L | -$7.1K |
| `...64aa` (CONFIRMED) | MLB | ML | San Diego Padres @ St. Louis Cardinals | $7.2K | L | -$7.2K |
| `...64aa` (CONFIRMED) | MLB | ML | Pittsburgh Pirates @ Athletics | $9.2K | L | -$9.2K |
| `...23c4` (FLAT) | MLB | ML | Miami Marlins @ Philadelphia Phillies | $9.9K | L | -$9.9K |
| `...64aa` (CONFIRMED) | MLB | ML | New York Mets @ Cincinnati Reds | $14.3K | L | -$14.3K |
| `...abaf` (CONFIRMED) | MLB | ML | Tampa Bay Rays @ Los Angeles Dodgers | $25.4K | L | -$25.4K |
| `...23c4` (FLAT) | MLB | TOTAL | Tampa Bay Rays @ Los Angeles Dodgers | $48.5K | L | -$48.5K |
| `...5213` (CONFIRMED) | MLB | TOTAL | New York Mets @ Cincinnati Reds | $55.4K | L | -$55.4K |
| `...23c4` (FLAT) | MLB | ML | Colorado Rockies @ Chicago Cubs | $99.0K | L | -$99.0K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 13 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...d227` | CONFIRMED | 6 | 83% | 2.0 | +5.98 | +100% | $46.2K | $32.6K | +71% | 3W |
| 2 | `...8f33` | CONFIRMED | 23 | 61% | 7.7 | +2.11 | +9% | $96.0K | $15.5K | +16% | 1L |
| 3 | `...aeea` | FLAT | 2 | 100% | 2.0 | +2.41 | +120% | $8.0K | $8.9K | +110% | 2W |
| 4 | `...1f30` | CONFIRMED | 6 | 33% | 3.0 | -2.87 | -48% | $44.0K | $6.7K | +15% | 1L |
| 5 | `...88a3` | CONFIRMED | 2 | 100% | 0.7 | +1.48 | +74% | $5.6K | $4.0K | +71% | 2W |
| 6 | `...64aa` | CONFIRMED | 16 | 56% | 5.3 | -0.53 | -3% | $253.9K | $2.6K | +1% | 3L |
| 7 | `...39b3` | CONFIRMED | 1 | 100% | 1.0 | +0.75 | +75% | $1.0K | $746 | +75% | 1W |
| 8 | `...9ef0` | FLAT | 1 | 100% | 1.0 | +0.67 | +67% | $1.1K | $705 | +67% | 1W |
| 9 | `...0ff5` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $9.3K | -$9.3K | -100% | 1L |
| 10 | `...5213` | CONFIRMED | 4 | 50% | 2.0 | -0.10 | -3% | $105.7K | -$19.7K | -19% | 1L |
| 11 | `...bba3` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $32.5K | -$32.5K | -100% | 1L |
| 12 | `...abaf` | CONFIRMED | 3 | 0% | 1.0 | -3.00 | -100% | $40.5K | -$40.5K | -100% | 3L |
| 13 | `...23c4` | FLAT | 12 | 33% | 6.0 | -4.50 | -37% | $323.6K | -$182.6K | -56% | 1W |

**NHL** — 2 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2125` | CONFIRMED | 2 | 100% | 2.0 | +1.75 | +88% | $46.9K | $41.0K | +87% | 2W |
| 2 | `...3532` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $18.8K | -$18.8K | -100% | 1L |

#### §6b-2. 7-day

**MLB** — 17 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...d227` | CONFIRMED | 14 | 71% | 2.0 | +7.51 | +54% | $133.3K | $61.0K | +46% | 3W |
| 2 | `...fc82` | FLAT | 3 | 67% | 0.8 | +0.70 | +23% | $94.6K | $54.3K | +57% | 1L |
| 3 | `...64aa` | CONFIRMED | 40 | 50% | 5.7 | -3.83 | -10% | $610.6K | $26.0K | +4% | 3L |
| 4 | `...8f33` | CONFIRMED | 46 | 54% | 6.6 | -0.20 | -0% | $193.6K | $23.1K | +12% | 1L |
| 5 | `...aeea` | FLAT | 4 | 75% | 0.8 | +2.53 | +63% | $14.4K | $9.2K | +64% | 2W |
| 6 | `...1f30` | CONFIRMED | 22 | 45% | 3.1 | -3.26 | -15% | $154.6K | $8.4K | +5% | 1L |
| 7 | `...88a3` | CONFIRMED | 7 | 86% | 1.0 | +3.56 | +51% | $16.9K | $8.2K | +48% | 5W |
| 8 | `...a240` | CONFIRMED | 1 | 100% | 1.0 | +0.98 | +98% | $2.4K | $2.4K | +98% | 1W |
| 9 | `...39b3` | CONFIRMED | 3 | 100% | 0.6 | +2.74 | +91% | $1.8K | $1.5K | +84% | 3W |
| 10 | `...9ef0` | FLAT | 1 | 100% | 1.0 | +0.67 | +67% | $1.1K | $705 | +67% | 1W |
| 11 | `...0ff5` | FLAT | 2 | 50% | 0.3 | -0.09 | -5% | $14.0K | -$5.0K | -35% | 1L |
| 12 | `...5213` | CONFIRMED | 4 | 50% | 2.0 | -0.10 | -3% | $105.7K | -$19.7K | -19% | 1L |
| 13 | `...bba3` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $32.5K | -$32.5K | -100% | 1L |
| 14 | `...3987` | CONFIRMED | 4 | 75% | 2.0 | +1.75 | +44% | $157.0K | -$64.4K | -41% | 1L |
| 15 | `...abaf` | CONFIRMED | 8 | 25% | 1.3 | -4.18 | -52% | $174.9K | -$79.3K | -45% | 5L |

**NBA** — 19 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 1 | 100% | 1.0 | +0.76 | +76% | $222.9K | $168.9K | +76% | 1W |
| 2 | `...e8f1` | CONFIRMED | 2 | 100% | 0.5 | +1.28 | +64% | $196.5K | $137.3K | +70% | 2W |
| 3 | `...66f5` | CONFIRMED | 3 | 100% | 0.8 | +2.24 | +75% | $92.0K | $65.4K | +71% | 3W |
| 4 | `...aeeb` | CONFIRMED | 1 | 100% | 1.0 | +0.76 | +76% | $31.8K | $24.1K | +76% | 1W |
| 5 | `...2f63` | FLAT | 6 | 50% | 1.5 | -0.31 | -5% | $60.6K | $13.0K | +21% | 1L |
| 6 | `...c933` | CONFIRMED | 2 | 100% | 0.5 | +1.28 | +64% | $16.8K | $11.5K | +68% | 2W |
| 7 | `...00bc` | CONFIRMED | 2 | 100% | 0.5 | +1.74 | +87% | $6.9K | $6.1K | +88% | 2W |
| 8 | `...684d` | CONFIRMED | 2 | 100% | 0.5 | +1.94 | +97% | $1.8K | $1.7K | +98% | 2W |
| 9 | `...03d4` | CONFIRMED | 1 | 100% | 1.0 | +0.52 | +52% | $3.0K | $1.6K | +52% | 1W |
| 10 | `...39b3` | CONFIRMED | 3 | 100% | 0.8 | +2.26 | +75% | $2.0K | $1.5K | +75% | 3W |
| 11 | `...9ef0` | CONFIRMED | 1 | 100% | 1.0 | +0.52 | +52% | $734 | $382 | +52% | 1W |
| 12 | `...9953` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $6.2K | -$6.2K | -100% | 1L |
| 13 | `...3532` | FLAT | 3 | 67% | 0.8 | +0.95 | +32% | $29.3K | -$7.0K | -24% | 2W |
| 14 | `...3f67` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $27.7K | -$27.7K | -100% | 1L |
| 15 | `...9c38` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $54.6K | -$54.6K | -100% | 1L |

**NHL** — 3 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2125` | CONFIRMED | 4 | 75% | 1.0 | +1.73 | +43% | $90.8K | $23.8K | +26% | 3W |
| 2 | `...a240` | CONFIRMED | 1 | 100% | 1.0 | +0.97 | +97% | $2.8K | $2.7K | +97% | 1W |
| 3 | `...3532` | FLAT | 2 | 50% | 0.5 | -0.35 | -18% | $31.0K | -$11.0K | -35% | 1L |

#### §6b-3. All-time

**MLB** — 20 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 55 | 51% | 1.7 | +6.48 | +12% | $1.28M | $831.8K | +65% | 5L |
| 2 | `...3987` | CONFIRMED | 44 | 68% | 4.0 | +14.19 | +32% | $2.29M | $666.8K | +29% | 1L |
| 3 | `...64aa` | CONFIRMED | 238 | 56% | 4.0 | +5.31 | +2% | $4.22M | $285.7K | +7% | 3L |
| 4 | `...5213` | CONFIRMED | 13 | 77% | 0.9 | +6.17 | +47% | $491.8K | $274.7K | +56% | 1L |
| 5 | `...fc82` | FLAT | 27 | 52% | 0.5 | +0.41 | +2% | $556.2K | $139.9K | +25% | 1L |
| 6 | `...8f33` | CONFIRMED | 84 | 58% | 3.5 | +7.57 | +9% | $465.0K | $85.8K | +18% | 1L |
| 7 | `...d227` | CONFIRMED | 20 | 60% | 0.5 | +4.83 | +24% | $186.2K | $40.9K | +22% | 3W |
| 8 | `...1f30` | CONFIRMED | 37 | 51% | 2.3 | +1.17 | +3% | $257.8K | $40.5K | +16% | 1L |
| 9 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 10 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 11 | `...aeea` | FLAT | 16 | 56% | 0.3 | +1.19 | +7% | $43.8K | $12.2K | +28% | 2W |
| 12 | `...88a3` | CONFIRMED | 9 | 78% | 0.6 | +4.36 | +48% | $20.8K | $9.8K | +47% | 5W |
| 13 | `...a240` | CONFIRMED | 3 | 67% | 0.1 | +0.85 | +28% | $6.7K | $2.5K | +38% | 1W |
| 14 | `...39b3` | CONFIRMED | 4 | 75% | 0.3 | +1.74 | +43% | $2.8K | $466 | +17% | 3W |
| 15 | `...68b3` | FLAT | 16 | 63% | 0.4 | +3.16 | +20% | $16.3K | $270 | +2% | 1L |

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
| `...abaf` | MLB | CONFIRMED | **5L** | 2026-06-16 | 55 | 51% | $831.8K | +65% |
| `...9ef0` | NBA | CONFIRMED | **5W** | 2026-06-13 | 33 | 61% | $38.4K | +14% |
| `...88a3` | MLB | CONFIRMED | **5W** | 2026-06-16 | 9 | 78% | $9.8K | +47% |
| `...03d4` | NBA | CONFIRMED | **4W** | 2026-06-13 | 31 | 68% | $37.0K | +35% |
| `...64aa` | MLB | CONFIRMED | **3L** | 2026-06-16 | 238 | 56% | $285.7K | +7% |
| `...2125` | NHL | CONFIRMED | **3W** | 2026-06-14 | 17 | 65% | $80.3K | +44% |
| `...66f5` | NBA | CONFIRMED | **3W** | 2026-06-13 | 17 | 59% | $64.5K | +19% |
| `...d227` | MLB | CONFIRMED | **3W** | 2026-06-16 | 20 | 60% | $40.9K | +22% |
| `...684d` | NBA | CONFIRMED | **3W** | 2026-06-13 | 10 | 90% | $11.2K | +68% |
| `...39b3` | NBA | CONFIRMED | **3W** | 2026-06-13 | 4 | 75% | $519 | +17% |
| `...39b3` | MLB | CONFIRMED | **3W** | 2026-06-16 | 4 | 75% | $466 | +17% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-06-03 | 54 · $1.07M · -$145.4K | 29 · $584.3K · $123.7K | 25 · $488.2K · -$269.1K | — |
| 2026-06-04 | 22 · $552.7K · $8.3K | 20 · $513.8K · -$16.0K | — | 2 · $39.0K · $24.4K |
| 2026-06-05 | 41 · $1.26M · -$235.8K | 23 · $627.6K · $179.0K | 18 · $631.4K · -$414.8K | — |
| 2026-06-06 | 27 · $727.4K · $32.7K | 24 · $720.3K · $32.2K | — | 3 · $7.1K · $568 |
| 2026-06-07 | 38 · $812.1K · $277.5K | 38 · $812.1K · $277.5K | — | — |
| 2026-06-08 | 36 · $1.13M · $404.7K | 20 · $399.7K · $131.3K | 16 · $728.8K · $273.4K | — |
| 2026-06-09 | 31 · $671.0K · -$8.6K | 26 · $620.1K · -$44.9K | — | 5 · $50.9K · $36.2K |
| 2026-06-10 | 52 · $1.49M · $182.3K | 32 · $424.1K · -$13.3K | 20 · $1.07M · $195.6K | — |
| 2026-06-11 | 18 · $316.9K · -$103.5K | 14 · $258.2K · -$96.8K | — | 4 · $58.8K · -$6.7K |
| 2026-06-12 | 29 · $284.3K · -$12.6K | 29 · $284.3K · -$12.6K | — | — |
| 2026-06-13 | 48 · $1.26M · -$765.4K | 30 · $310.6K · $51.4K | 18 · $954.4K · -$816.8K | — |
| 2026-06-14 | 22 · $196.5K · -$16.9K | 19 · $130.7K · -$39.1K | — | 3 · $65.7K · $22.2K |
| 2026-06-15 | 29 · $353.9K · -$37.1K | 29 · $353.9K · -$37.1K | — | — |
| 2026-06-16 | 30 · $482.7K · -$136.6K | 30 · $482.7K · -$136.6K | — | — |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-06-16_
