# Sharp Intel v6 — Daily Master Report

_Auto-generated **5/30/2026, 10:18:10 AM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (221 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-05-29** · 22 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 22 | 11-11-0 | 50.0% | -4.78u | -1.50u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Atlanta Braves @ Cincinnati Reds | Cincinnati Reds | 5.0★ · 2.50u | +1 | +5 | -2 | +3 | +118 | L | -2.50u |
| MLB | ML | Boston Red Sox @ Cleveland Guardians | Cleveland Guardians | 5.0★ · 3.75u | +1 | +2 | +4 | +6 | -124 | **W** | +2.98u |
| MLB | ML | Chicago Cubs @ St. Louis Cardinals | St. Louis Cardinals | 4.0★ · 2.50u | +0 | +1 | +1 | +2 | +120 | **W** | +3.00u |
| MLB | ML | Los Angeles Angels @ Tampa Bay Rays | Los Angeles Angels | 5.0★ · 2.50u | +1 | +2 | +2 | +4 | +140 | L | -2.50u |
| MLB | ML | Milwaukee Brewers @ Houston Astros | Milwaukee Brewers | 4.5★ · 1.25u | +1 | +0 | +1 | +1 | -142 | **W** | +0.35u |
| MLB | ML | Minnesota Twins @ Pittsburgh Pirates | Pittsburgh Pirates | 4.5★ · 1.25u | +0 | +1 | -3 | -2 | -134 | **W** | +2.80u |
| MLB | ML | San Diego Padres @ Washington Nationals | Washington Nationals | 5.0★ · 2.75u | +1 | +2 | +3 | +5 | -106 | L | -2.75u |
| MLB | ML | Toronto Blue Jays @ Baltimore Orioles | Baltimore Orioles | 4.5★ · 3.75u | +1 | +0 | +0 | +0 | -122 | L | -3.75u |
| MLB | SPREAD | Atlanta Braves @ Cincinnati Reds | Cincinnati Reds | 5.0★ · 0.75u | +0 | +2 | +1 | +3 | -135 | L | -0.75u |
| MLB | SPREAD | Detroit Tigers @ Chicago White Sox | Detroit Tigers | 4.0★ · 0.75u | +0 | +0 | -1 | -1 | +150 | L | -0.75u |
| MLB | SPREAD | Milwaukee Brewers @ Houston Astros | Houston Astros | 5.0★ · 1.65u | +0 | +1 | +1 | +2 | -135 | **W** | +1.22u |
| MLB | SPREAD | Minnesota Twins @ Pittsburgh Pirates | Minnesota Twins | 5.0★ · 2.25u | +0 | +0 | +2 | +2 | -184 | **W** | +1.22u |
| MLB | SPREAD | San Diego Padres @ Washington Nationals | Washington Nationals | 4.0★ · 1.65u | +0 | +0 | +3 | +3 | -175 | L | -1.65u |
| MLB | TOTAL | Boston Red Sox @ Cleveland Guardians | Over 8 | 4.5★ · 1.65u | +0 | +2 | +0 | +2 | -106 | L | -1.65u |
| MLB | TOTAL | Chicago Cubs @ St. Louis Cardinals | Over 7.5 | 4.5★ · 2.25u | +0 | +2 | -1 | +1 | -112 | **W** | +2.01u |
| MLB | TOTAL | Miami Marlins @ New York Mets | Over 7.5 | 4.0★ · 1.65u | +0 | +0 | +0 | +0 | -103 | **W** | +1.60u |
| MLB | TOTAL | Minnesota Twins @ Pittsburgh Pirates | Over 8 | 4.0★ · 0.75u | +0 | +1 | +1 | +2 | -109 | **W** | +0.74u |
| MLB | TOTAL | San Diego Padres @ Washington Nationals | Over 9.5 | 4.5★ · 0.30u | +1 | +2 | +2 | +4 | +105 | **W** | +0.32u |
| MLB | TOTAL | Toronto Blue Jays @ Baltimore Orioles | Over 9 | 3.0★ · 1.00u | +0 | +0 | +2 | +2 | -108 | **W** | +1.53u |
| NHL | ML | Canadiens @ Hurricanes | Canadiens | 5.0★ · 1.00u | +0 | +3 | +2 | +5 | +205 | L | -1.00u |
| NHL | SPREAD | Canadiens @ Hurricanes | Canadiens | 5.0★ · 3.00u | +1 | +3 | +1 | +4 | -118 | L | -3.00u |
| NHL | TOTAL | Canadiens @ Hurricanes | Under 5.5 | 5.0★ · 2.25u | +0 | +2 | +0 | +2 | -106 | L | -2.25u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **47** shipped · 22-25-0 · WR 46.8% · PnL -18.11u (peak) / -6.80u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 47)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC = +2 | 2 | 0-2-0 | 0.0% | -3.50u | -2.00u |
| HC = +1 | 14 | 7-7-0 | 50.0% | -13.64u | -1.64u |
| HC = 0 | 28 | 14-14-0 | 50.0% | -1.24u | -2.17u |
| HC ≤ −1 | 3 | 1-2-0 | 33.3% | +0.27u | -0.99u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 11 | 3-8-0 | 27.3% | -12.30u | -5.12u |
| +2 | 15 | 5-10-0 | 33.3% | -11.50u | -5.17u |
| +1 | 11 | 8-3-0 | 72.7% | +5.70u | +2.99u |
| 0 | 9 | 6-3-0 | 66.7% | +1.24u | +1.50u |
| −1 | 1 | 0-1-0 | 0.0% | -1.25u | -1.00u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 7 | 1-6-0 | 14.3% | -9.17u | -5.19u |
| +2 | 7 | 4-3-0 | 57.1% | -2.68u | +0.41u |
| +1 | 22 | 11-11-0 | 50.0% | -4.95u | -2.10u |
| 0 | 5 | 2-3-0 | 40.0% | -3.53u | -1.02u |
| −1 | 4 | 3-1-0 | 75.0% | +1.92u | +1.35u |
| ≤ −2 | 2 | 1-1-0 | 50.0% | +0.30u | -0.25u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 47)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 41 | 19-22-0 | 46.3% | -14.96u | -6.53u |
| WEAK   (−1 .. 0) | 6 | 3-3-0 | 50.0% | -3.15u | -0.27u |

### §2b. 7-day

Total: **123** shipped · 65-57-1 · WR 53.3% · PnL -9.11u (peak) / -3.29u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 123)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 1-1-0 | 50.0% | -0.57u | -0.49u |
| HC = +2 | 5 | 2-3-0 | 40.0% | -4.64u | -0.61u |
| HC = +1 | 35 | 17-18-0 | 48.6% | -15.47u | -3.00u |
| HC = 0 | 75 | 43-31-1 | 58.1% | +12.42u | +2.97u |
| HC ≤ −1 | 6 | 2-4-0 | 33.3% | -0.85u | -2.15u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 22 | 7-15-0 | 31.8% | -16.92u | -8.83u |
| +2 | 35 | 17-18-0 | 48.6% | -10.81u | -2.49u |
| +1 | 40 | 25-15-0 | 62.5% | +10.77u | +4.20u |
| 0 | 22 | 15-6-1 | 71.4% | +9.33u | +6.35u |
| −1 | 4 | 1-3-0 | 25.0% | -1.48u | -2.52u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 15 | 6-9-0 | 40.0% | -7.32u | -4.83u |
| +2 | 17 | 7-10-0 | 41.2% | -6.68u | -4.22u |
| +1 | 49 | 25-23-1 | 52.1% | -4.21u | -1.69u |
| 0 | 25 | 16-9-0 | 64.0% | +8.09u | +4.77u |
| −1 | 14 | 10-4-0 | 71.4% | +5.71u | +3.94u |
| ≤ −2 | 3 | 1-2-0 | 33.3% | -4.70u | -1.25u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 123)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 109 | 59-50-0 | 54.1% | -3.56u | -1.44u |
| WEAK   (−1 .. 0) | 14 | 6-7-1 | 46.2% | -5.55u | -1.84u |

### §2c. All-time

Total: **383** shipped · 189-191-3 · WR 49.7% · PnL -70.58u (peak) / -17.59u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 272)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 8 | 3-5-0 | 37.5% | -7.58u | -3.67u |
| HC = +2 | 20 | 7-13-0 | 35.0% | -26.21u | -5.64u |
| HC = +1 | 112 | 62-50-0 | 55.4% | -10.33u | +8.97u |
| HC = 0 | 123 | 64-57-2 | 52.9% | -11.51u | -4.31u |
| HC ≤ −1 | 8 | 2-6-0 | 25.0% | -4.35u | -4.15u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 79 | 38-41-0 | 48.1% | -30.20u | -0.49u |
| +2 | 99 | 44-55-0 | 44.4% | -40.79u | -12.91u |
| +1 | 125 | 72-52-1 | 58.1% | +15.41u | +9.64u |
| 0 | 62 | 29-31-2 | 48.3% | -11.41u | -6.21u |
| −1 | 11 | 2-9-0 | 18.2% | -7.08u | -7.46u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 100 | 48-50-2 | 49.0% | -26.61u | -3.45u |
| +2 | 79 | 34-45-0 | 43.0% | -38.30u | -11.16u |
| +1 | 118 | 59-58-1 | 50.4% | -9.56u | -7.02u |
| 0 | 50 | 27-23-0 | 54.0% | +6.73u | +2.16u |
| −1 | 22 | 15-7-0 | 68.2% | +7.19u | +5.39u |
| ≤ −2 | 8 | 2-6-0 | 25.0% | -13.27u | -4.29u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 247)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 3 | 3-0-0 | 100.0% | +8.01u | +2.34u |
| LOCK   (+5 .. +7) | 9 | 5-4-0 | 55.6% | -2.93u | -0.47u |
| STRONG (+3 .. +5) | 22 | 13-9-0 | 59.1% | -6.66u | +2.77u |
| NEUT   (0 .. +3) | 177 | 88-89-0 | 49.7% | -45.30u | -13.82u |
| WEAK   (−1 .. 0) | 25 | 11-13-1 | 45.8% | -9.87u | -1.53u |
| FADE   (< −1) | 10 | 6-4-0 | 60.0% | +1.72u | +2.16u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98, -10.18, -8.90, -14.92, -23.44, -23.30, -28.89, -32.63, -26.98, -29.77, -33.27, -44.12]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67, -16.17, -15.07, -14.58, -23.93, -16.53, -21.34, -20.03, -10.27, -14.68, -17.58, -11.51]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52, -28.22, -25.84, -31.37, -49.24, -44.70, -55.10, -55.65, -40.24, -49.69, -53.57, -58.35]
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

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 59 | 41 | 12 | 29% | 17 | 6 | 3 |
| NBA | 132 | 99 | 42 | 42% | 57 | 30 | 12 |
| NHL | 57 | 41 | 12 | 29% | 23 | 10 | 6 |
| **ALL (any sport)** | **159** | **125** | **50** | **40%** | **69** | **29** | **13** |

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

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | c289a0 | 3 | 3 | 0 | 100.0% | +2.87 | +95.6% | $1.5K |
| 2 | 880232 | 2 | 2 | 0 | 100.0% | +1.82 | +90.9% | $130.1K |
| 3 | c9bba3 | 3 | 3 | 0 | 100.0% | +2.42 | +80.7% | $66.5K |
| 4 | eeabaf | 27 | 16 | 11 | 59.3% | +10.20 | +37.8% | $824.1K |
| 5 | c668b3 | 15 | 10 | 5 | 66.7% | +4.16 | +27.7% | $649 |
| 6 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 7 | 7923c4 | 35 | 21 | 14 | 60.0% | +5.52 | +15.8% | $104.4K |
| 8 | a10ff5 | 32 | 18 | 14 | 56.3% | +3.72 | +11.6% | $6.4K |
| 9 | 4c64aa | 116 | 68 | 48 | 58.6% | +9.17 | +7.9% | $145.5K |
| 10 | 63fc82 | 19 | 10 | 9 | 52.6% | +1.09 | +5.8% | $124.8K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | 4a9953 | 2 | 2 | 0 | 100.0% | +2.16 | +108.2% | $3.7K |
| 3 | f9e3d0 | 3 | 3 | 0 | 100.0% | +2.90 | +96.5% | $51.0K |
| 4 | a0d6d2 | 2 | 2 | 0 | 100.0% | +1.91 | +95.3% | $4.1K |
| 5 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 6 | b51a56 | 6 | 5 | 1 | 83.3% | +5.44 | +90.7% | $74.4K |
| 7 | 11b032 | 7 | 6 | 1 | 85.7% | +5.40 | +77.1% | $249.9K |
| 8 | 769c38 | 13 | 12 | 1 | 92.3% | +9.01 | +69.3% | $100.0K |
| 9 | 2e8da5 | 11 | 8 | 3 | 72.7% | +7.06 | +64.2% | $84.1K |
| 10 | 7f00bc | 17 | 11 | 6 | 64.7% | +8.63 | +50.7% | $11.7K |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 8366f5 | 2 | 2 | 0 | 100.0% | +2.30 | +114.9% | $107.6K |
| 2 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 3 | fec67e | 4 | 3 | 1 | 75.0% | +2.82 | +70.5% | $12.5K |
| 4 | 30935c | 4 | 3 | 1 | 75.0% | +2.11 | +52.7% | $953 |
| 5 | 981187 | 8 | 6 | 2 | 75.0% | +3.52 | +44.0% | -$25.2K |
| 6 | fcc12b | 10 | 7 | 3 | 70.0% | +3.15 | +31.5% | -$67.5K |
| 7 | e70853 | 9 | 6 | 3 | 66.7% | +2.66 | +29.5% | -$11.1K |
| 8 | c5cea1 | 3 | 2 | 1 | 66.7% | +0.62 | +20.7% | $22.1K |
| 9 | bc3532 | 16 | 9 | 7 | 56.3% | +3.20 | +20.0% | $10.7K |
| 10 | dfa240 | 24 | 15 | 9 | 62.5% | +4.32 | +18.0% | $14.2K |

---
## §5. Proven-wallet roster growth & HC tracking

"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).

### §5a. Current proven-winner roster (snapshot)

Roster as of **2026-05-29** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 107 | 41 | 6 | 6 | **12** | 6 | 11.2% |
| NBA | 190 | 99 | 27 | 15 | **42** | 19 | 22.1% |
| NHL | 95 | 41 | 8 | 4 | **12** | 11 | 12.6% |
| **ALL** | **—** | **—** | **—** | **—** | **66** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 23 · 6 | 9 · 6 | 4 · 6 | +20 live |
| NBA | 55 · 27 | 21 · 15 | 21 · 19 | +34 live |
| NHL | 19 · 8 | 6 · 4 | 14 · 11 | +13 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-05-29.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | -2 from 14 | +2 from 10 | +5 from 7 | +12 from 0 |
| NBA | +0 from 42 | +3 from 39 | +17 from 25 | +42 from 0 |
| NHL | -4 from 16 | -4 from 16 | +2 from 10 | +12 from 0 |

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
| MLB | 107 | 41 (38%) | 12 (29%) | 6 (50%) | **12** | edge (Eligible→Flat-OK) 71% |
| NBA | 190 | 99 (52%) | 42 (42%) | 27 (64%) | **42** | edge (Eligible→Flat-OK) 58% |
| NHL | 95 | 41 (43%) | 12 (29%) | 8 (67%) | **12** | edge (Eligible→Flat-OK) 71% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 41 | 18 (43.9%) | 14 (34.1%) | 1 (2.4%) |
| MLB | 7-day | 102 | 37 (36.3%) | 32 (31.4%) | 2 (2.0%) |
| MLB | All-time | 221 | 96 (43.4%) | 90 (40.7%) | 9 (4.1%) |
| NBA | 3-day | 1 | 1 (100.0%) | 1 (100.0%) | 1 (100.0%) |
| NBA | 7-day | 10 | 8 (80.0%) | 6 (60.0%) | 4 (40.0%) |
| NBA | All-time | 114 | 73 (64.0%) | 62 (54.4%) | 28 (24.6%) |
| NHL | 3-day | 5 | 1 (20.0%) | 1 (20.0%) | 0 (0.0%) |
| NHL | 7-day | 11 | 4 (36.4%) | 4 (36.4%) | 1 (9.1%) |
| NHL | All-time | 42 | 19 (45.2%) | 18 (42.9%) | 4 (9.5%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 47 | 20 (42.6%) | 16 (34.0%) | 2 (4.3%) |
| 7-day | 123 | 49 (39.8%) | 42 (34.1%) | 7 (5.7%) |
| All-time | 377 | 188 (49.9%) | 170 (45.1%) | 41 (10.9%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (5)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...be17` | 1 | +6.95 | 18 | -41% |
| `...be00` | 1 | +0.87 | 14 | 3% |
| `...a240` | 1 | +0.87 | 7 | 83% |
| `...9373` | 1 | +0.87 | 0 | — |
| `...8d26` | 1 | +0.72 | 5 | -22% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...1eae` | 48 | 50% | -0.8% | 101 | 10% |
| `...d6d2` | 8 | 50% | -5.3% | 19 | -25% |
| `...9d74` | 29 | 48% | -5.9% | 115 | -15% |
| `...c12b` | 40 | 48% | -6.5% | 67 | -19% |
| `...35e3` | 22 | 50% | -6.7% | 83 | -23% |
| `...ad50` | 4 | 50% | -6.8% | 11 | 32% |

#### NBA

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...bf5d` | 1 | +3.15 | 3 | 42% |
| `...ed41` | 1 | +3.15 | 3 | 3% |
| `...6b87` | 1 | +2.05 | 8 | -27% |
| `...c991` | 1 | +1.14 | 8 | 77% |
| `...9d74` | 1 | +0.93 | 27 | -35% |
| `...c556` | 1 | +0.93 | 3 | 42% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...b33b` | 14 | 36% | -0.5% | 45 | 19% |
| `...d814` | 8 | 50% | -0.5% | 48 | 8% |
| `...d96a` | 19 | 37% | -1.5% | 72 | -27% |
| `...65dd` | 6 | 50% | -2.4% | 17 | 27% |
| `...853d` | 40 | 53% | -2.7% | 90 | -2% |
| `...f5b0` | 20 | 50% | -3.7% | 57 | -28% |

#### NHL

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...2e78` | 1 | +1.46 | 0 | — |
| `...017f` | 1 | +1.45 | 5 | 125% |
| `...32f2` | 1 | +1.40 | 0 | — |
| `...e0fd` | 1 | +1.20 | 3 | 124% |
| `...266e` | 1 | +1.05 | 0 | — |
| `...2194` | 1 | +1.05 | 0 | — |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...33ee` | 4 | 50% | -0.3% | 8 | -23% |
| `...afd2` | 6 | 50% | -1.9% | 18 | 1% |
| `...192c` | 7 | 43% | -2.9% | 21 | -15% |
| `...35e3` | 7 | 57% | -5.5% | 26 | 31% |
| `...618e` | 2 | 50% | -6.1% | 28 | 24% |
| `...9ef0` | 7 | 43% | -8.6% | 23 | 0% |

### §5g. v2 wallet-promotion pipeline (Source-A / Source-B mix)

Live snapshot of the v2 promotion gate (shipped 2026-05-10, re-eval **2026-05-24**). Each FLAT-or-better wallet × sport pair is attributed to one of three paths via `sharpWalletProfiles[wallet].bySport[sport].whitelistSource`:

- **A** — flat-positive on featured picks (Source A) only — the v1 gate
- **A+B** — flat-positive in both sources (most reliable signal)
- **B** — flat-positive on-chain only (NEW in v2 — the trial lift)

Re-classified every 2h via `grade-sharp-actions` cron. Roll-back: set `B_ONLY_MIN_BETS = Infinity` in `scripts/exportWalletProfiles.js`.

#### Source mix per sport (live Firestore)

| Sport | A | A+B | B (new) | FLAT-or-better total | % from B-only |
|---|---|---|---|---|---|
| MLB | 3 | 9 | **20** | 32 | 62.5% |
| NBA | 15 | 27 | **34** | 76 | 44.7% |
| NHL | 4 | 8 | **13** | 25 | 52.0% |
| **ALL** | **22** | **44** | **67** | **133** | **50.4%** |

#### Pipeline freshness

- `sharp_action_positions` GRADED rows: **9955**
- `sharp_action_positions` PENDING rows: **105** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 5/30/2026, 5:12:52 AM ET — **305 min · STALE** — check grade-sharp-actions workflow

**Alarms**: pending > 200 OR rebuild lag > 4h → cron is lagging or failing — check `gh run list --workflow="Grade Sharp Actions"`.

#### B-only roster — wallets currently promoted via Source B path only

Wallets here would have been EXCLUDED under v1 (Source-A-only). Top by Source-B bet count per sport. The 2-week re-eval (2026-05-24) will compare these wallets' realized lift against A-only and A+B cohorts.

**MLB** — 20 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...9a27` | FLAT | 405 | +9.5% | -0.4% |
| `...135d` | CONFIRMED | 326 | +1.9% | +6.9% |
| `...1eae` | CONFIRMED | 104 | +11.5% | +10.3% |
| `...8f33` | CONFIRMED | 62 | +4.1% | +11.3% |
| `...69c2` | CONFIRMED | 50 | +21% | +7.7% |
| `...d6d2` | FLAT | 35 | +10.9% | -23.3% |
| `...1fc6` | CONFIRMED | 17 | +15.5% | +19.7% |
| `...f804` | CONFIRMED | 13 | +44.3% | +44.9% |
| `...cff6` | CONFIRMED | 12 | +19% | +15% |
| `...ad50` | CONFIRMED | 11 | +36.8% | +31.8% |
| … | 10 more | | | |

**NBA** — 34 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...135d` | FLAT | 102 | +5.1% | -11.9% |
| `...3782` | CONFIRMED | 64 | +2% | +1.1% |
| `...11a4` | CONFIRMED | 56 | +26.8% | +12.6% |
| `...935c` | FLAT | 50 | +17.3% | -21.4% |
| `...b33b` | CONFIRMED | 45 | +12.6% | +18.8% |
| `...b6ef` | CONFIRMED | 41 | +8.9% | +7.2% |
| `...0563` | CONFIRMED | 36 | +2.9% | +41.6% |
| `...d227` | CONFIRMED | 36 | +3.1% | +25.7% |
| `...68b3` | CONFIRMED | 34 | +3.5% | +8.5% |
| `...be00` | FLAT | 33 | +0.9% | -1.8% |
| … | 24 more | | | |

**NHL** — 13 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...1697` | CONFIRMED | 46 | +4.1% | +8.4% |
| `...2125` | CONFIRMED | 39 | +45.2% | +47.7% |
| `...3782` | CONFIRMED | 38 | +6.5% | +12.8% |
| `...618e` | CONFIRMED | 28 | +6.2% | +23.8% |
| `...35e3` | CONFIRMED | 26 | +10.6% | +31.5% |
| `...b33b` | CONFIRMED | 22 | +6.4% | +18.1% |
| `...192c` | FLAT | 21 | +14% | -15.2% |
| `...0c2e` | CONFIRMED | 12 | +43.4% | +21.1% |
| `...be17` | CONFIRMED | 7 | +15.6% | +28% |
| `...a9cc` | CONFIRMED | 7 | +49.5% | +46.9% |
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

Slate: **2026-05-29** · 22 bets · 8 distinct proven wallets · WR 55% · $ vol $243.1K · $ PnL $9.3K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...abaf` (CONFIRMED) | MLB | ML | Milwaukee Brewers @ Houston Astros | $31.1K | **W** | $21.9K |
| `...64aa` (CONFIRMED) | MLB | ML | Boston Red Sox @ Cleveland Guardians | $27.5K | **W** | $21.9K |
| `...bba3` (CONFIRMED) | MLB | ML | Minnesota Twins @ Pittsburgh Pirates | $22.0K | **W** | $16.4K |
| `...abaf` (CONFIRMED) | MLB | TOTAL | San Diego Padres @ Washington Nationals | $14.1K | **W** | $14.8K |
| `...fc82` (FLAT) | MLB | ML | Milwaukee Brewers @ Houston Astros | $12.7K | **W** | $9.0K |
| `...2768` (CONFIRMED) | MLB | ML | Chicago Cubs @ St. Louis Cardinals | $7.1K | **W** | $8.5K |
| `...23c4` (FLAT) | MLB | TOTAL | Chicago Cubs @ St. Louis Cardinals | $8.5K | **W** | $7.6K |
| `...23c4` (FLAT) | MLB | TOTAL | Minnesota Twins @ Pittsburgh Pirates | $5.1K | **W** | $5.0K |
| `...0ff5` (FLAT) | MLB | SPREAD | Minnesota Twins @ Pittsburgh Pirates | $8.1K | **W** | $4.4K |
| `...23c4` (FLAT) | MLB | TOTAL | Los Angeles Angels @ Tampa Bay Rays | $1.5K | **W** | $1.5K |
| `...0ff5` (FLAT) | MLB | TOTAL | San Diego Padres @ Washington Nationals | $1.4K | **W** | $1.5K |
| `...68b3` (FLAT) | MLB | TOTAL | Chicago Cubs @ St. Louis Cardinals | $310 | **W** | $277 |
| `...68b3` (FLAT) | MLB | ML | Atlanta Braves @ Cincinnati Reds | $769 | L | -$769 |
| `...23c4` (FLAT) | MLB | TOTAL | Boston Red Sox @ Cleveland Guardians | $5.7K | L | -$5.7K |
| `...0ff5` (FLAT) | MLB | ML | San Diego Padres @ Washington Nationals | $7.7K | L | -$7.7K |
| `...64aa` (CONFIRMED) | MLB | ML | San Diego Padres @ Washington Nationals | $8.5K | L | -$8.5K |
| `...abaf` (CONFIRMED) | MLB | ML | San Diego Padres @ Washington Nationals | $8.6K | L | -$8.6K |
| `...0ff5` (FLAT) | MLB | ML | Atlanta Braves @ Cincinnati Reds | $10.8K | L | -$10.8K |
| `...fc82` (FLAT) | MLB | ML | Kansas City Royals @ Texas Rangers | $12.0K | L | -$12.0K |
| `...64aa` (CONFIRMED) | MLB | ML | Milwaukee Brewers @ Houston Astros | $14.1K | L | -$14.1K |
| `...abaf` (CONFIRMED) | MLB | ML | Minnesota Twins @ Pittsburgh Pirates | $15.0K | L | -$15.0K |
| `...23c4` (FLAT) | MLB | ML | Atlanta Braves @ Cincinnati Reds | $20.4K | L | -$20.4K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 8 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...64aa` | CONFIRMED | 13 | 77% | 4.3 | +4.94 | +38% | $280.8K | $118.9K | +42% | 2L |
| 2 | `...23c4` | FLAT | 10 | 70% | 3.3 | +3.56 | +36% | $203.2K | $102.2K | +50% | 3W |
| 3 | `...fc82` | FLAT | 4 | 50% | 1.3 | +0.18 | +5% | $69.7K | $20.5K | +29% | 1W |
| 4 | `...bba3` | CONFIRMED | 1 | 100% | 1.0 | +0.75 | +75% | $22.0K | $16.4K | +75% | 1W |
| 5 | `...abaf` | CONFIRMED | 12 | 50% | 4.0 | -0.69 | -6% | $184.8K | $9.1K | +5% | 1W |
| 6 | `...2768` | CONFIRMED | 1 | 100% | 1.0 | +1.20 | +120% | $7.1K | $8.5K | +120% | 1W |
| 7 | `...68b3` | FLAT | 5 | 60% | 1.7 | +0.67 | +13% | $3.0K | $251 | +8% | 1W |
| 8 | `...0ff5` | FLAT | 9 | 44% | 3.0 | -1.80 | -20% | $74.0K | -$22.1K | -30% | 1W |

**NBA** — 11 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...1697` | CONFIRMED | 1 | 100% | 1.0 | +0.65 | +65% | $208.0K | $135.1K | +65% | 1W |
| 2 | `...3532` | FLAT | 1 | 100% | 1.0 | +0.93 | +93% | $33.9K | $31.4K | +93% | 1W |
| 3 | `...0c2e` | CONFIRMED | 1 | 100% | 1.0 | +0.98 | +98% | $15.9K | $15.6K | +98% | 1W |
| 4 | `...9ef0` | CONFIRMED | 2 | 50% | 2.0 | -0.07 | -4% | $9.3K | $5.4K | +58% | 1W |
| 5 | `...d6d2` | FLAT | 1 | 100% | 1.0 | +0.93 | +93% | $1.3K | $1.2K | +93% | 1W |
| 6 | `...e3d0` | FLAT | 1 | 100% | 1.0 | +0.98 | +98% | $363 | $356 | +98% | 1W |
| 7 | `...df91` | FLAT | 1 | 100% | 1.0 | +0.65 | +65% | $83 | $54 | +65% | 1W |
| 8 | `...03d4` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $1.3K | -$1.3K | -100% | 1L |
| 9 | `...23c4` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $4.9K | -$4.9K | -100% | 1L |
| 10 | `...c926` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $8.5K | -$8.5K | -100% | 1L |
| 11 | `...2f63` | FLAT | 3 | 0% | 3.0 | -3.00 | -100% | $16.8K | -$16.8K | -100% | 3L |

**NHL** — 1 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...3532` | FLAT | 1 | 100% | 1.0 | +0.66 | +66% | $75.4K | $49.6K | +66% | 1W |

#### §6b-2. 7-day

**MLB** — 9 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 23 | 57% | 3.3 | +8.39 | +36% | $546.0K | $789.9K | +145% | 1W |
| 2 | `...64aa` | CONFIRMED | 31 | 74% | 4.4 | +10.52 | +34% | $678.1K | $212.2K | +31% | 2L |
| 3 | `...bba3` | CONFIRMED | 3 | 100% | 0.5 | +2.42 | +81% | $83.0K | $66.5K | +80% | 3W |
| 4 | `...0232` | CONFIRMED | 1 | 100% | 1.0 | +0.91 | +91% | $70.3K | $63.9K | +91% | 1W |
| 5 | `...23c4` | FLAT | 28 | 61% | 4.0 | +4.76 | +17% | $534.3K | $48.6K | +9% | 3W |
| 6 | `...fc82` | FLAT | 4 | 50% | 1.3 | +0.18 | +5% | $69.7K | $20.5K | +29% | 1W |
| 7 | `...2768` | CONFIRMED | 5 | 60% | 0.7 | +2.14 | +43% | $40.8K | $17.3K | +42% | 1W |
| 8 | `...68b3` | FLAT | 11 | 73% | 1.8 | +4.00 | +36% | $10.9K | -$2.2K | -20% | 1W |
| 9 | `...0ff5` | FLAT | 17 | 53% | 2.4 | +1.03 | +6% | $110.2K | -$6.0K | -5% | 1W |

**NBA** — 22 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 3 | 100% | 1.0 | +2.62 | +87% | $1.09M | $943.5K | +87% | 3W |
| 2 | `...1697` | CONFIRMED | 1 | 100% | 1.0 | +0.65 | +65% | $208.0K | $135.1K | +65% | 1W |
| 3 | `...aeeb` | CONFIRMED | 3 | 100% | 1.5 | +2.29 | +76% | $108.0K | $65.4K | +61% | 3W |
| 4 | `...e3d0` | FLAT | 3 | 100% | 0.6 | +2.90 | +97% | $54.3K | $51.0K | +94% | 3W |
| 5 | `...2f63` | FLAT | 13 | 46% | 2.2 | -1.39 | -11% | $130.1K | $50.4K | +39% | 3L |
| 6 | `...9c38` | CONFIRMED | 2 | 100% | 0.7 | +1.93 | +97% | $23.1K | $23.4K | +101% | 2W |
| 7 | `...3532` | FLAT | 3 | 33% | 0.5 | -1.07 | -36% | $48.9K | $16.4K | +34% | 1W |
| 8 | `...abaf` | FLAT | 1 | 100% | 1.0 | +0.98 | +98% | $16.0K | $15.7K | +98% | 1W |
| 9 | `...9ef0` | CONFIRMED | 5 | 40% | 1.3 | -1.09 | -22% | $27.2K | $13.1K | +48% | 1W |
| 10 | `...d6d2` | FLAT | 2 | 100% | 0.7 | +1.91 | +95% | $4.2K | $4.1K | +96% | 2W |
| 11 | `...5348` | CONFIRMED | 2 | 50% | 1.0 | +0.14 | +7% | $8.9K | $730 | +8% | 1L |
| 12 | `...df91` | FLAT | 3 | 67% | 0.6 | +0.16 | +5% | $431 | -$30 | -7% | 2W |
| 13 | `...00bc` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $2.6K | -$2.6K | -100% | 1L |
| 14 | `...03d4` | FLAT | 6 | 50% | 1.0 | -0.25 | -4% | $11.1K | -$2.6K | -24% | 2L |
| 15 | `...0c2e` | CONFIRMED | 3 | 67% | 0.8 | +0.91 | +30% | $35.4K | -$3.0K | -8% | 1W |

**NHL** — 6 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...3532` | FLAT | 2 | 100% | 0.4 | +1.90 | +95% | $83.8K | $60.0K | +72% | 2W |
| 2 | `...0853` | CONFIRMED | 1 | 100% | 1.0 | +0.49 | +49% | $70.0K | $34.1K | +49% | 1W |
| 3 | `...c12b` | CONFIRMED | 1 | 100% | 1.0 | +1.24 | +124% | $22.8K | $28.3K | +124% | 1W |
| 4 | `...c67e` | CONFIRMED | 1 | 100% | 1.0 | +0.98 | +98% | $5.5K | $5.4K | +98% | 1W |
| 5 | `...9d74` | CONFIRMED | 1 | 100% | 1.0 | +0.49 | +49% | $3.0K | $1.5K | +49% | 1W |
| 6 | `...1187` | FLAT | 3 | 33% | 0.8 | -1.51 | -50% | $115.0K | -$55.5K | -48% | 2L |

#### §6b-3. All-time

**MLB** — 12 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 27 | 59% | 1.9 | +10.20 | +38% | $631.4K | $824.1K | +131% | 1W |
| 2 | `...64aa` | CONFIRMED | 116 | 59% | 2.8 | +9.17 | +8% | $2.21M | $145.5K | +7% | 2L |
| 3 | `...0232` | CONFIRMED | 2 | 100% | 0.2 | +1.82 | +91% | $143.1K | $130.1K | +91% | 2W |
| 4 | `...fc82` | FLAT | 19 | 53% | 0.5 | +1.09 | +6% | $382.6K | $124.8K | +33% | 1W |
| 5 | `...23c4` | FLAT | 35 | 60% | 1.0 | +5.52 | +16% | $685.4K | $104.4K | +15% | 3W |
| 6 | `...bba3` | CONFIRMED | 3 | 100% | 0.5 | +2.42 | +81% | $83.0K | $66.5K | +80% | 3W |
| 7 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 8 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 9 | `...0ff5` | FLAT | 32 | 56% | 1.8 | +3.72 | +12% | $218.8K | $6.4K | +3% | 1W |
| 10 | `...2768` | CONFIRMED | 21 | 48% | 1.1 | +0.56 | +3% | $184.2K | $6.3K | +3% | 1W |
| 11 | `...89a0` | FLAT | 3 | 100% | 0.4 | +2.87 | +96% | $1.6K | $1.5K | +95% | 3W |
| 12 | `...68b3` | FLAT | 15 | 67% | 0.5 | +4.16 | +28% | $15.9K | $649 | +4% | 1W |

**NBA** — 42 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 22 | 64% | 0.6 | +7.14 | +32% | $2.24M | $921.0K | +41% | 3W |
| 2 | `...9a27` | CONFIRMED | 85 | 60% | 2.6 | +8.08 | +10% | $2.58M | $527.8K | +20% | 1W |
| 3 | `...aeeb` | CONFIRMED | 55 | 62% | 1.4 | +10.41 | +19% | $1.09M | $277.5K | +25% | 3W |
| 4 | `...b032` | CONFIRMED | 7 | 86% | 0.7 | +5.40 | +77% | $244.0K | $249.9K | +102% | 3W |
| 5 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +5.66 | +283% | $141.8K | $241.7K | +170% | 2W |
| 6 | `...1697` | CONFIRMED | 10 | 60% | 0.3 | +0.87 | +9% | $1.26M | $235.6K | +19% | 2W |
| 7 | `...be3d` | CONFIRMED | 5 | 60% | 0.4 | +0.03 | +1% | $821.5K | $180.0K | +22% | 1L |
| 8 | `...32f2` | CONFIRMED | 9 | 44% | 0.3 | +0.91 | +10% | $143.6K | $124.9K | +87% | 1L |
| 9 | `...e8f1` | FLAT | 17 | 41% | 0.5 | +1.53 | +9% | $569.0K | $124.5K | +22% | 1L |
| 10 | `...abaf` | FLAT | 12 | 58% | 0.8 | +2.09 | +17% | $247.3K | $113.9K | +46% | 3W |
| 11 | `...02c3` | CONFIRMED | 6 | 33% | 0.9 | +0.75 | +13% | $681.1K | $104.0K | +15% | 3L |
| 12 | `...9c38` | CONFIRMED | 13 | 92% | 0.4 | +9.01 | +69% | $170.3K | $100.0K | +59% | 4W |
| 13 | `...3532` | FLAT | 66 | 53% | 1.7 | +5.71 | +9% | $1.11M | $86.5K | +8% | 1W |
| 14 | `...8da5` | CONFIRMED | 11 | 73% | 0.3 | +7.06 | +64% | $242.0K | $84.1K | +35% | 2L |
| 15 | `...b814` | CONFIRMED | 3 | 100% | 0.4 | +0.56 | +19% | $431.9K | $81.3K | +19% | 3W |

**NHL** — 12 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...66f5` | FLAT | 2 | 100% | 0.7 | +2.30 | +115% | $78.8K | $107.6K | +137% | 2W |
| 2 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +1.88 | +94% | $88.2K | $46.9K | +53% | 2W |
| 3 | `...cea1` | CONFIRMED | 3 | 67% | 0.4 | +0.62 | +21% | $27.7K | $22.1K | +80% | 1W |
| 4 | `...a240` | CONFIRMED | 24 | 63% | 0.7 | +4.32 | +18% | $80.3K | $14.2K | +18% | 1W |
| 5 | `...c67e` | CONFIRMED | 4 | 75% | 0.2 | +2.82 | +71% | $20.7K | $12.5K | +60% | 1W |
| 6 | `...3532` | FLAT | 16 | 56% | 0.4 | +3.20 | +20% | $283.8K | $10.7K | +4% | 3W |
| 7 | `...9d74` | CONFIRMED | 3 | 67% | 0.1 | +0.54 | +18% | $8.7K | $1.9K | +22% | 1W |
| 8 | `...935c` | CONFIRMED | 4 | 75% | 1.0 | +2.11 | +53% | $1.3K | $953 | +74% | 3W |
| 9 | `...df91` | FLAT | 9 | 56% | 0.4 | +0.55 | +6% | $16.0K | -$4.8K | -30% | 1L |
| 10 | `...0853` | CONFIRMED | 9 | 67% | 0.3 | +2.66 | +30% | $250.0K | -$11.1K | -4% | 1W |
| 11 | `...1187` | FLAT | 8 | 75% | 0.2 | +3.52 | +44% | $153.0K | -$25.2K | -16% | 2L |
| 12 | `...c12b` | CONFIRMED | 10 | 70% | 0.3 | +3.15 | +32% | $474.2K | -$67.5K | -14% | 1W |

### §6c. Active streaks (≥3 in a row, last bet within 3 days)

Proven `(wallet × sport)` pairs currently riding a 3-or-more-bet run with their most recent bet inside the last 3 calendar days. Hot-hand monitor — and the same surface for cold streaks worth fading.

| Wallet | Sport | Tier | Streak | Last bet | All-time bets | WR% | $ PnL | $ ROI |
|---|---|---|---|---|---|---|---|---|
| `...aeeb` | NBA | CONFIRMED | **3W** | 2026-05-26 | 55 | 62% | $277.5K | +25% |
| `...abaf` | NBA | FLAT | **3W** | 2026-05-26 | 12 | 58% | $113.9K | +46% |
| `...23c4` | MLB | FLAT | **3W** | 2026-05-29 | 35 | 60% | $104.4K | +15% |
| `...bba3` | MLB | CONFIRMED | **3W** | 2026-05-29 | 3 | 100% | $66.5K | +80% |
| `...e3d0` | NBA | FLAT | **3W** | 2026-05-28 | 3 | 100% | $51.0K | +94% |
| `...3532` | NHL | FLAT | **3W** | 2026-05-27 | 16 | 56% | $10.7K | +4% |
| `...2f63` | NBA | FLAT | **3L** | 2026-05-28 | 98 | 54% | -$87.8K | -7% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-05-16 | 15 · $260.1K · $30.8K | 9 · $103.7K · -$5.5K | — | 6 · $156.4K · $36.3K |
| 2026-05-17 | 35 · $543.3K · $226.0K | 17 · $212.7K · $55.9K | 18 · $330.6K · $170.1K | — |
| 2026-05-18 | 24 · $579.3K · -$65.9K | 5 · $119.1K · $37.7K | 16 · $362.2K · -$12.4K | 3 · $98.0K · -$91.2K |
| 2026-05-19 | 28 · $537.1K · -$57.8K | 9 · $163.3K · $74.1K | 19 · $373.8K · -$131.9K | — |
| 2026-05-20 | 26 · $570.4K · $196.2K | 12 · $187.1K · $44.8K | 11 · $314.3K · $215.7K | 3 · $69.0K · -$64.3K |
| 2026-05-21 | 24 · $822.5K · -$353.0K | 5 · $58.3K · -$25.8K | 16 · $750.2K · -$332.6K | 3 · $14.0K · $5.4K |
| 2026-05-22 | 28 · $993.9K · -$121.8K | 8 · $150.8K · -$88.5K | 18 · $834.4K · -$24.6K | 2 · $8.7K · -$8.7K |
| 2026-05-23 | 31 · $962.0K · $464.5K | 13 · $343.5K · $3.5K | 12 · $468.8K · $361.8K | 6 · $149.7K · $99.2K |
| 2026-05-24 | 35 · $1.11M · $1.10M | 21 · $450.6K · $869.0K | 13 · $624.3K · $272.8K | 1 · $40.0K · -$40.0K |
| 2026-05-25 | 35 · $854.4K · $89.4K | 19 · $337.8K · -$58.8K | 16 · $516.6K · $148.2K | — |
| 2026-05-26 | 30 · $435.3K · $244.0K | 15 · $167.0K · $143.3K | 14 · $233.2K · $135.7K | 1 · $35.0K · -$35.0K |
| 2026-05-27 | 29 · $579.8K · $210.7K | 28 · $504.4K · $161.1K | — | 1 · $75.4K · $49.6K |
| 2026-05-28 | 19 · $397.3K · $240.9K | 5 · $97.0K · $83.3K | 14 · $300.3K · $157.5K | — |
| 2026-05-29 | 22 · $243.1K · $9.3K | 22 · $243.1K · $9.3K | — | — |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-05-29_
