# Sharp Intel v6 — Daily Master Report

_Auto-generated **5/23/2026, 10:15:41 AM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (211 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-05-22** · 19 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 19 | 8-11-0 | 42.1% | -17.87u | -3.77u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Cleveland Guardians @ Philadelphia Phillies | Philadelphia Phillies | 5.0★ · 1.25u | +0 | +1 | +2 | +3 | -175 | L | -1.25u |
| MLB | ML | Colorado Rockies @ Arizona Diamondbacks | Arizona Diamondbacks | 4.0★ · 1.25u | +0 | +3 | +1 | +4 | -195 | L | -1.25u |
| MLB | ML | Houston Astros @ Chicago Cubs | Chicago Cubs | 3.0★ · 1.25u | +0 | +1 | +2 | +3 | -137 | L | -1.25u |
| MLB | ML | Minnesota Twins @ Boston Red Sox | Boston Red Sox | 5.0★ · 5.00u | +2 | +4 | +4 | +8 | -144 | L | -5.00u |
| MLB | ML | Pittsburgh Pirates @ Toronto Blue Jays | Toronto Blue Jays | 5.0★ · 2.75u | +0 | +1 | +1 | +2 | -158 | **W** | +1.72u |
| MLB | ML | Tampa Bay Rays @ New York Yankees | New York Yankees | 5.0★ · 5.00u | +2 | +2 | +2 | +4 | -145 | L | -5.00u |
| MLB | ML | Texas Rangers @ Los Angeles Angels | Los Angeles Angels | 2.5★ · 0.50u | +1 | +2 | +2 | +4 | +139 | **W** | +0.68u |
| MLB | ML | Washington Nationals @ Atlanta Braves | Washington Nationals | 5.0★ · 1.50u | +0 | +3 | +3 | +6 | +185 | L | -1.50u |
| MLB | SPREAD | New York Mets @ Miami Marlins | Miami Marlins | 5.0★ · 0.75u | +0 | +2 | +1 | +3 | -155 | **W** | +0.41u |
| MLB | SPREAD | Seattle Mariners @ Kansas City Royals | Kansas City Royals | 3.0★ · 0.75u | +0 | +1 | +1 | +2 | -142 | L | -0.75u |
| MLB | SPREAD | Texas Rangers @ Los Angeles Angels | Los Angeles Angels | 4.0★ · 1.65u | +1 | +1 | +1 | +2 | -119 | **W** | +1.32u |
| MLB | SPREAD | Washington Nationals @ Atlanta Braves | Washington Nationals | 3.0★ · 0.75u | +0 | +1 | +0 | +1 | -112 | **W** | +0.59u |
| MLB | TOTAL | Detroit Tigers @ Baltimore Orioles | Over 8.5 | 3.0★ · 0.75u | +0 | +1 | +0 | +1 | -110 | **W** | +0.68u |
| MLB | TOTAL | Houston Astros @ Chicago Cubs | Over 7.5 | 3.0★ · 0.75u | +0 | +1 | +1 | +2 | -110 | L | -0.75u |
| NBA | ML | Thunder @ Spurs | Spurs | 5.0★ · 5.00u | +0 | +0 | -2 | -2 | -120 | L | -5.00u |
| NBA | SPREAD | Thunder @ Spurs | Spurs | 2.5★ · 1.00u | +0 | +1 | +1 | +2 | -110 | L | -1.00u |
| NBA | TOTAL | Thunder @ Spurs | Over 218.5 | 5.0★ · 0.75u | +1 | +2 | +3 | +5 | +101 | **W** | +0.73u |
| NHL | ML | Golden Knights @ Avalanche | Avalanche | 4.5★ · 3.75u | +3 | +4 | +2 | +6 | -167 | L | -3.75u |
| NHL | TOTAL | Golden Knights @ Avalanche | Under 4.5 | 5.0★ · 2.50u | +1 | +3 | +3 | +6 | -110 | **W** | +2.50u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **40** shipped · 19-21-0 · WR 47.5% · PnL -21.02u (peak) / -4.29u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 40)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 1-1-0 | 50.0% | -1.65u | -0.56u |
| HC = +2 | 3 | 0-3-0 | 0.0% | -13.00u | -3.00u |
| HC = +1 | 16 | 10-6-0 | 62.5% | +1.39u | +3.31u |
| HC = 0 | 19 | 8-11-0 | 42.1% | -7.76u | -4.04u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 11 | 4-7-0 | 36.4% | -9.67u | -3.81u |
| +2 | 9 | 5-4-0 | 55.6% | -3.33u | +0.60u |
| +1 | 15 | 8-7-0 | 53.3% | -1.85u | -0.10u |
| 0 | 5 | 2-3-0 | 40.0% | -6.17u | -0.98u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 9 | 5-4-0 | 55.6% | -1.19u | +0.20u |
| +2 | 8 | 2-6-0 | 25.0% | -10.07u | -3.70u |
| +1 | 13 | 7-6-0 | 53.8% | +0.75u | -0.32u |
| 0 | 6 | 4-2-0 | 66.7% | -0.53u | +1.63u |
| −1 | 3 | 1-2-0 | 33.3% | -4.98u | -1.09u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -5.00u | -1.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 40)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 2 | 2-0-0 | 100.0% | +4.83u | +1.39u |
| STRONG (+3 .. +5) | 3 | 0-3-0 | 0.0% | -8.00u | -3.00u |
| NEUT   (0 .. +3) | 28 | 13-15-0 | 46.4% | -17.54u | -4.00u |
| WEAK   (−1 .. 0) | 5 | 2-3-0 | 40.0% | -1.14u | -0.70u |
| FADE   (< −1) | 2 | 2-0-0 | 100.0% | +0.83u | +2.02u |

### §2b. 7-day

Total: **71** shipped · 35-36-0 · WR 49.3% · PnL -33.81u (peak) / -4.09u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 71)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 5 | 2-3-0 | 40.0% | -3.51u | -2.17u |
| HC = +2 | 8 | 1-7-0 | 12.5% | -25.00u | -5.85u |
| HC = +1 | 30 | 18-12-0 | 60.0% | +1.80u | +5.66u |
| HC = 0 | 28 | 14-14-0 | 50.0% | -7.10u | -1.74u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 19 | 9-10-0 | 47.4% | -12.57u | -0.98u |
| +2 | 23 | 11-12-0 | 47.8% | -12.47u | -1.94u |
| +1 | 21 | 11-10-0 | 52.4% | -4.26u | -0.48u |
| 0 | 8 | 4-4-0 | 50.0% | -4.51u | -0.69u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 14 | 9-5-0 | 64.3% | +1.24u | +3.29u |
| +2 | 18 | 7-11-0 | 38.9% | -17.87u | -3.65u |
| +1 | 24 | 12-12-0 | 50.0% | -6.43u | -2.08u |
| 0 | 9 | 6-3-0 | 66.7% | +2.48u | +2.44u |
| −1 | 4 | 1-3-0 | 25.0% | -7.48u | -2.09u |
| ≤ −2 | 2 | 0-2-0 | 0.0% | -5.75u | -2.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 71)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 2 | 2-0-0 | 100.0% | +4.83u | +1.39u |
| LOCK   (+5 .. +7) | 3 | 1-2-0 | 33.3% | -3.61u | -1.62u |
| STRONG (+3 .. +5) | 7 | 2-5-0 | 28.6% | -11.50u | -3.18u |
| NEUT   (0 .. +3) | 46 | 23-23-0 | 50.0% | -20.78u | -2.54u |
| WEAK   (−1 .. 0) | 9 | 4-5-0 | 44.4% | -3.07u | -0.14u |
| FADE   (< −1) | 4 | 3-1-0 | 75.0% | +0.32u | +2.00u |

### §2c. All-time

Total: **260** shipped · 124-134-2 · WR 48.1% · PnL -61.47u (peak) / -14.30u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 149)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 6 | 2-4-0 | 33.3% | -7.01u | -3.17u |
| HC = +2 | 15 | 5-10-0 | 33.3% | -21.57u | -5.03u |
| HC = +1 | 77 | 45-32-0 | 58.4% | +5.14u | +11.97u |
| HC = 0 | 48 | 21-26-1 | 44.7% | -23.93u | -7.29u |
| HC ≤ −1 | 2 | 0-2-0 | 0.0% | -3.50u | -2.00u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 57 | 31-26-0 | 54.4% | -13.28u | +8.34u |
| +2 | 64 | 27-37-0 | 42.2% | -29.98u | -10.43u |
| +1 | 85 | 47-37-1 | 56.0% | +4.64u | +5.44u |
| 0 | 40 | 14-25-1 | 35.9% | -20.74u | -12.56u |
| −1 | 7 | 1-6-0 | 14.3% | -5.60u | -4.94u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 85 | 42-41-2 | 50.6% | -19.29u | +1.39u |
| +2 | 62 | 27-35-0 | 43.5% | -31.62u | -6.93u |
| +1 | 69 | 34-35-0 | 49.3% | -5.35u | -5.33u |
| 0 | 25 | 11-14-0 | 44.0% | -1.36u | -2.61u |
| −1 | 8 | 5-3-0 | 62.5% | +1.48u | +1.45u |
| ≤ −2 | 5 | 1-4-0 | 20.0% | -8.57u | -3.04u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 124)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 3 | 3-0-0 | 100.0% | +8.01u | +2.34u |
| LOCK   (+5 .. +7) | 9 | 5-4-0 | 55.6% | -2.93u | -0.47u |
| STRONG (+3 .. +5) | 22 | 13-9-0 | 59.1% | -6.66u | +2.77u |
| NEUT   (0 .. +3) | 68 | 29-39-0 | 42.6% | -41.74u | -12.37u |
| WEAK   (−1 .. 0) | 11 | 5-6-0 | 45.5% | -4.32u | +0.31u |
| FADE   (< −1) | 10 | 6-4-0 | 60.0% | +1.72u | +2.16u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98, -10.18, -8.90, -14.92, -23.44]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67, -16.17, -15.07, -14.58, -23.93]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52, -28.22, -25.84, -31.37, -49.24]
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

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 53 | 34 | 10 | 29% | 14 | 5 | 3 |
| NBA | 120 | 88 | 39 | 44% | 51 | 23 | 13 |
| NHL | 52 | 33 | 16 | 48% | 23 | 10 | 4 |
| **ALL (any sport)** | **143** | **106** | **44** | **42%** | **55** | **26** | **10** |

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

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | b31fc6 | 2 | 2 | 0 | 100.0% | +2.56 | +128.0% | $4.2K |
| 2 | c289a0 | 3 | 3 | 0 | 100.0% | +2.87 | +95.6% | $1.5K |
| 3 | eeabaf | 4 | 3 | 1 | 75.0% | +1.80 | +45.1% | $34.1K |
| 4 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 5 | a10ff5 | 15 | 9 | 6 | 60.0% | +2.69 | +17.9% | $12.4K |
| 6 | 7923c4 | 7 | 4 | 3 | 57.1% | +0.76 | +10.8% | $55.8K |
| 7 | 8ec926 | 4 | 2 | 2 | 50.0% | +0.29 | +7.2% | $6.0K |
| 8 | 63fc82 | 15 | 8 | 7 | 53.3% | +0.91 | +6.1% | $104.4K |
| 9 | c668b3 | 4 | 2 | 2 | 50.0% | +0.16 | +4.0% | $2.9K |
| 10 | b05143 | 10 | 5 | 5 | 50.0% | +0.27 | +2.7% | $26.2K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | 4a9953 | 2 | 2 | 0 | 100.0% | +2.16 | +108.2% | $3.7K |
| 3 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 4 | b51a56 | 6 | 5 | 1 | 83.3% | +5.44 | +90.7% | $74.4K |
| 5 | 2e8da5 | 10 | 8 | 2 | 80.0% | +8.06 | +80.6% | $120.4K |
| 6 | 11b032 | 7 | 6 | 1 | 85.7% | +5.40 | +77.1% | $249.9K |
| 7 | 8ec926 | 7 | 6 | 1 | 85.7% | +4.53 | +64.7% | $7.9K |
| 8 | 769c38 | 11 | 10 | 1 | 90.9% | +7.08 | +64.3% | $76.6K |
| 9 | 7f00bc | 16 | 11 | 5 | 68.8% | +9.63 | +60.2% | $14.2K |
| 10 | 92df91 | 20 | 14 | 6 | 70.0% | +10.09 | +50.5% | -$183 |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 8366f5 | 2 | 2 | 0 | 100.0% | +2.30 | +114.9% | $107.6K |
| 2 | 981187 | 5 | 5 | 0 | 100.0% | +5.03 | +100.6% | $30.3K |
| 3 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 4 | fec67e | 3 | 2 | 1 | 66.7% | +1.84 | +61.3% | $7.1K |
| 5 | 30935c | 4 | 3 | 1 | 75.0% | +2.11 | +52.7% | $953 |
| 6 | e70853 | 8 | 5 | 3 | 62.5% | +2.17 | +27.1% | -$45.2K |
| 7 | fcc12b | 9 | 6 | 3 | 66.7% | +1.91 | +21.3% | -$95.8K |
| 8 | c5cea1 | 3 | 2 | 1 | 66.7% | +0.62 | +20.7% | $22.1K |
| 9 | dfa240 | 24 | 15 | 9 | 62.5% | +4.32 | +18.0% | $14.2K |
| 10 | 12192c | 6 | 3 | 3 | 50.0% | +0.80 | +13.3% | $136.2K |

---
## §5. Proven-wallet roster growth & HC tracking

"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).

### §5a. Current proven-winner roster (snapshot)

Roster as of **2026-05-22** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 95 | 34 | 4 | 6 | **10** | 4 | 10.5% |
| NBA | 181 | 88 | 26 | 13 | **39** | 16 | 21.5% |
| NHL | 88 | 33 | 11 | 5 | **16** | 7 | 18.2% |
| **ALL** | **—** | **—** | **—** | **—** | **65** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 20 · 4 | 8 · 6 | 4 · 4 | +18 live |
| NBA | 52 · 26 | 20 · 13 | 24 · 16 | +33 live |
| NHL | 21 · 11 | 8 · 5 | 4 · 7 | +13 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-05-22.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | -2 from 12 | +0 from 10 | +4 from 6 | +10 from 0 |
| NBA | +1 from 38 | +0 from 39 | +24 from 15 | +39 from 0 |
| NHL | +1 from 15 | +4 from 12 | +6 from 10 | +16 from 0 |

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
| MLB | 95 | 34 (36%) | 10 (29%) | 4 (40%) | **10** | edge (Eligible→Flat-OK) 71% |
| NBA | 181 | 88 (49%) | 39 (44%) | 26 (67%) | **39** | edge (Eligible→Flat-OK) 56% |
| NHL | 88 | 33 (38%) | 16 (48%) | 11 (69%) | **16** | sample (Seen→Eligible) 63% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 28 | 12 (42.9%) | 12 (42.9%) | 2 (7.1%) |
| MLB | 7-day | 50 | 25 (50.0%) | 25 (50.0%) | 4 (8.0%) |
| MLB | All-time | 119 | 59 (49.6%) | 58 (48.7%) | 7 (5.9%) |
| NBA | 3-day | 7 | 7 (100.0%) | 5 (71.4%) | 2 (28.6%) |
| NBA | 7-day | 14 | 14 (100.0%) | 12 (85.7%) | 7 (50.0%) |
| NBA | All-time | 104 | 65 (62.5%) | 56 (53.8%) | 24 (23.1%) |
| NHL | 3-day | 5 | 4 (80.0%) | 4 (80.0%) | 1 (20.0%) |
| NHL | 7-day | 7 | 6 (85.7%) | 6 (85.7%) | 2 (28.6%) |
| NHL | All-time | 31 | 15 (48.4%) | 14 (45.2%) | 3 (9.7%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 40 | 23 (57.5%) | 21 (52.5%) | 5 (12.5%) |
| 7-day | 71 | 45 (63.4%) | 43 (60.6%) | 13 (18.3%) |
| All-time | 254 | 139 (54.7%) | 128 (50.4%) | 34 (13.4%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (5)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...0232` | 1 | +0.91 | 7 | 93% |
| `...be00` | 1 | +0.87 | 11 | -8% |
| `...a240` | 1 | +0.87 | 7 | 83% |
| `...9373` | 1 | +0.87 | 0 | — |
| `...8d26` | 1 | +0.72 | 5 | -22% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...64aa` | 85 | 53% | -1.6% | 171 | -2% |
| `...2f63` | 76 | 50% | -2.0% | 486 | -5% |
| `...135d` | 9 | 44% | -5.0% | 326 | 7% |
| `...c12b` | 40 | 48% | -6.5% | 67 | -19% |
| `...35e3` | 22 | 50% | -6.7% | 53 | -17% |
| `...9a27` | 97 | 47% | -8.9% | 288 | 2% |

#### NBA

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...bf5d` | 1 | +3.15 | 3 | 42% |
| `...ed41` | 1 | +3.15 | 3 | 3% |
| `...6b87` | 1 | +2.05 | 8 | -27% |
| `...9d74` | 1 | +0.93 | 22 | -49% |
| `...c556` | 1 | +0.93 | 3 | 42% |
| `...5c69` | 1 | +0.91 | 2 | 28% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...d814` | 8 | 50% | -0.5% | 47 | -9% |
| `...d96a` | 19 | 37% | -1.5% | 64 | -19% |
| `...65dd` | 6 | 50% | -2.4% | 17 | 27% |
| `...853d` | 40 | 53% | -2.7% | 79 | 3% |
| `...11a4` | 13 | 38% | -3.3% | 49 | 27% |
| `...f5b0` | 20 | 50% | -3.7% | 57 | -28% |

#### NHL

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...2e78` | 1 | +1.46 | 0 | — |
| `...017f` | 1 | +1.45 | 5 | 125% |
| `...5ad0` | 1 | +1.42 | 7 | 28% |
| `...32f2` | 1 | +1.40 | 0 | — |
| `...e0fd` | 1 | +1.20 | 3 | 124% |
| `...266e` | 1 | +1.05 | 0 | — |

**Just-under** (5)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...33ee` | 4 | 50% | -0.3% | 8 | -23% |
| `...23c4` | 4 | 50% | -5.9% | 15 | 10% |
| `...618e` | 2 | 50% | -6.1% | 28 | 24% |
| `...3782` | 2 | 50% | -9.0% | 25 | -1% |
| `...d227` | 2 | 50% | -9.0% | 18 | 20% |

### §5g. v2 wallet-promotion pipeline (Source-A / Source-B mix)

Live snapshot of the v2 promotion gate (shipped 2026-05-10, re-eval **2026-05-24**). Each FLAT-or-better wallet × sport pair is attributed to one of three paths via `sharpWalletProfiles[wallet].bySport[sport].whitelistSource`:

- **A** — flat-positive on featured picks (Source A) only — the v1 gate
- **A+B** — flat-positive in both sources (most reliable signal)
- **B** — flat-positive on-chain only (NEW in v2 — the trial lift)

Re-classified every 2h via `grade-sharp-actions` cron. Roll-back: set `B_ONLY_MIN_BETS = Infinity` in `scripts/exportWalletProfiles.js`.

#### Source mix per sport (live Firestore)

| Sport | A | A+B | B (new) | FLAT-or-better total | % from B-only |
|---|---|---|---|---|---|
| MLB | 6 | 4 | **18** | 28 | 64.3% |
| NBA | 10 | 29 | **33** | 72 | 45.8% |
| NHL | 7 | 9 | **13** | 29 | 44.8% |
| **ALL** | **23** | **42** | **64** | **129** | **49.6%** |

#### Pipeline freshness

- `sharp_action_positions` GRADED rows: **7870**
- `sharp_action_positions` PENDING rows: **88** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 5/23/2026, 8:16:24 AM ET — 119 min · OK

**Alarms**: pending > 200 OR rebuild lag > 4h → cron is lagging or failing — check `gh run list --workflow="Grade Sharp Actions"`.

#### B-only roster — wallets currently promoted via Source B path only

Wallets here would have been EXCLUDED under v1 (Source-A-only). Top by Source-B bet count per sport. The 2-week re-eval (2026-05-24) will compare these wallets' realized lift against A-only and A+B cohorts.

**MLB** — 18 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...135d` | CONFIRMED | 326 | +1.9% | +6.9% |
| `...9a27` | CONFIRMED | 288 | +17.8% | +1.6% |
| `...64aa` | FLAT | 171 | +1.1% | -2% |
| `...d96a` | CONFIRMED | 98 | +1.4% | +24.3% |
| `...1eae` | CONFIRMED | 75 | +9.2% | +1.8% |
| `...2768` | CONFIRMED | 33 | +9.2% | +13.7% |
| `...69c2` | FLAT | 13 | +7.6% | -5.7% |
| `...aeeb` | CONFIRMED | 9 | +21.6% | +32% |
| `...a9cc` | CONFIRMED | 8 | +6.3% | +0.3% |
| `...bba3` | CONFIRMED | 8 | +41.6% | +32.6% |
| … | 8 more | | | |

**NBA** — 33 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...135d` | FLAT | 102 | +5.1% | -11.9% |
| `...3782` | CONFIRMED | 57 | +11.2% | +12.4% |
| `...935c` | FLAT | 50 | +17.3% | -21.4% |
| `...11a4` | CONFIRMED | 49 | +34.1% | +26.8% |
| `...b6ef` | CONFIRMED | 41 | +8.9% | +7.2% |
| `...be00` | CONFIRMED | 28 | +12.7% | +2.7% |
| `...68b3` | CONFIRMED | 22 | +20.1% | +28.4% |
| `...9791` | CONFIRMED | 19 | +3.7% | +14.6% |
| `...9e7a` | CONFIRMED | 19 | +6% | +22.2% |
| `...0563` | CONFIRMED | 17 | +0.6% | +12.8% |
| … | 23 more | | | |

**NHL** — 13 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...618e` | CONFIRMED | 28 | +6.2% | +23.8% |
| `...2125` | CONFIRMED | 25 | +51% | +46.8% |
| `...3782` | FLAT | 25 | +0.6% | -0.9% |
| `...d227` | CONFIRMED | 18 | +2.8% | +20.4% |
| `...b33b` | CONFIRMED | 17 | +23.3% | +12.9% |
| `...23c4` | CONFIRMED | 15 | +6.1% | +9.8% |
| `...b989` | CONFIRMED | 12 | +13.1% | +30.4% |
| `...35e3` | CONFIRMED | 12 | +47.6% | +66% |
| `...5ad0` | CONFIRMED | 7 | +19.5% | +28% |
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

Slate: **2026-05-22** · 26 bets · 18 distinct proven wallets · WR 65% · $ vol $891.0K · $ PnL -$11.2K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...1697` (CONFIRMED) | NBA | ML | Thunder @ Spurs | $180.0K | **W** | $198.0K |
| `...3532` (FLAT) | NBA | ML | Thunder @ Spurs | $86.2K | **W** | $94.8K |
| `...9a27` (CONFIRMED) | NBA | ML | Thunder @ Spurs | $56.3K | **W** | $61.9K |
| `...abaf` (CONFIRMED) | NBA | SPREAD | Thunder @ Spurs | $23.2K | **W** | $22.1K |
| `...b33b` (CONFIRMED) | NBA | ML | Thunder @ Spurs | $16.3K | **W** | $17.9K |
| `...9a27` (CONFIRMED) | NBA | SPREAD | Thunder @ Spurs | $14.9K | **W** | $14.2K |
| `...9ef0` (FLAT) | NHL | TOTAL | Golden Knights @ Avalanche | $12.9K | **W** | $12.9K |
| `...2f63` (FLAT) | NBA | ML | Thunder @ Spurs | $6.9K | **W** | $7.6K |
| `...afd2` (CONFIRMED) | NHL | TOTAL | Golden Knights @ Avalanche | $5.0K | **W** | $5.0K |
| `...1eae` (CONFIRMED) | NBA | ML | Thunder @ Spurs | $4.3K | **W** | $4.7K |
| `...abaf` (CONFIRMED) | NBA | ML | Thunder @ Spurs | $4.1K | **W** | $4.5K |
| `...2f63` (FLAT) | NBA | TOTAL | Thunder @ Spurs | $4.5K | **W** | $4.4K |
| `...9ef0` (CONFIRMED) | NBA | ML | Thunder @ Spurs | $2.8K | **W** | $3.1K |
| `...03d4` (FLAT) | NBA | ML | Thunder @ Spurs | $2.5K | **W** | $2.7K |
| `...3532` (FLAT) | NBA | SPREAD | Thunder @ Spurs | $2.5K | **W** | $2.4K |
| `...2f63` (FLAT) | NBA | SPREAD | Thunder @ Spurs | $460 | **W** | $438 |
| `...df91` (FLAT) | NBA | ML | Thunder @ Spurs | $137 | **W** | $151 |
| `...68b3` (CONFIRMED) | MLB | ML | Seattle Mariners @ Kansas City Royals | $1.2K | L | -$1.2K |
| `...03d4` (FLAT) | NBA | SPREAD | Thunder @ Spurs | $2.5K | L | -$2.5K |
| `...9d74` (CONFIRMED) | NHL | ML | Golden Knights @ Avalanche | $2.7K | L | -$2.7K |
| `...afd2` (CONFIRMED) | NHL | ML | Golden Knights @ Avalanche | $5.0K | L | -$5.0K |
| `...c67e` (CONFIRMED) | NHL | ML | Golden Knights @ Avalanche | $6.0K | L | -$6.0K |
| `...853d` (CONFIRMED) | NHL | ML | Golden Knights @ Avalanche | $7.5K | L | -$7.5K |
| `...5143` (FLAT) | NBA | ML | Thunder @ Spurs | $43.8K | L | -$43.8K |
| `...be3d` (CONFIRMED) | NBA | ML | Thunder @ Spurs | $101.9K | L | -$101.9K |
| `...2ca8` (CONFIRMED) | NBA | ML | Thunder @ Spurs | $297.4K | L | -$297.4K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 5 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 1 | 100% | 1.0 | +0.88 | +88% | $22.7K | $20.1K | +88% | 1W |
| 2 | `...0ff5` | FLAT | 3 | 67% | 1.5 | +1.11 | +37% | $16.0K | $10.6K | +66% | 1W |
| 3 | `...23c4` | FLAT | 1 | 100% | 1.0 | +0.91 | +91% | $6.3K | $5.7K | +91% | 1W |
| 4 | `...1fc6` | CONFIRMED | 1 | 100% | 1.0 | +1.26 | +126% | $1.6K | $2.0K | +126% | 1W |
| 5 | `...68b3` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $1.2K | -$1.2K | -100% | 1L |

**NBA** — 21 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...9a27` | CONFIRMED | 6 | 83% | 2.0 | +3.37 | +56% | $303.3K | $215.5K | +71% | 2W |
| 2 | `...1697` | CONFIRMED | 1 | 100% | 1.0 | +1.10 | +110% | $180.0K | $198.0K | +110% | 1W |
| 3 | `...3532` | FLAT | 4 | 75% | 2.0 | +1.55 | +39% | $129.1K | $109.6K | +85% | 2W |
| 4 | `...aeeb` | CONFIRMED | 4 | 75% | 2.0 | +0.83 | +21% | $111.8K | $40.7K | +36% | 1L |
| 5 | `...abaf` | CONFIRMED | 2 | 100% | 2.0 | +2.05 | +103% | $27.3K | $26.6K | +97% | 2W |
| 6 | `...b33b` | CONFIRMED | 1 | 100% | 1.0 | +1.10 | +110% | $16.3K | $17.9K | +110% | 1W |
| 7 | `...d49f` | FLAT | 1 | 100% | 1.0 | +0.91 | +91% | $14.7K | $13.4K | +91% | 1W |
| 8 | `...03d4` | FLAT | 4 | 75% | 1.3 | +1.92 | +48% | $19.2K | $13.2K | +69% | 1L |
| 9 | `...9c38` | CONFIRMED | 1 | 100% | 1.0 | +0.50 | +50% | $19.2K | $9.6K | +50% | 1W |
| 10 | `...1eae` | CONFIRMED | 1 | 100% | 1.0 | +1.10 | +110% | $4.3K | $4.7K | +110% | 1W |
| 11 | `...00bc` | CONFIRMED | 1 | 100% | 1.0 | +0.95 | +95% | $3.2K | $3.1K | +95% | 1W |
| 12 | `...df91` | FLAT | 2 | 100% | 0.7 | +1.52 | +76% | $5.1K | $2.2K | +44% | 2W |
| 13 | `...0f9a` | CONFIRMED | 1 | 100% | 1.0 | +0.42 | +42% | $4.0K | $1.7K | +42% | 1W |
| 14 | `...1a56` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $342 | -$342 | -100% | 1L |
| 15 | `...9ef0` | CONFIRMED | 2 | 50% | 1.0 | +0.10 | +5% | $6.5K | -$670 | -10% | 1W |

**NHL** — 8 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...9ef0` | FLAT | 1 | 100% | 1.0 | +1.00 | +100% | $12.9K | $12.9K | +100% | 1W |
| 2 | `...a240` | CONFIRMED | 3 | 67% | 1.5 | +0.44 | +15% | $8.5K | $1.8K | +21% | 1W |
| 3 | `...afd2` | CONFIRMED | 2 | 50% | 2.0 | +0.00 | +0% | $10.0K | $0 | +0% | 1W |
| 4 | `...9d74` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $2.7K | -$2.7K | -100% | 1L |
| 5 | `...c67e` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $6.0K | -$6.0K | -100% | 1L |
| 6 | `...853d` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $7.5K | -$7.5K | -100% | 1L |
| 7 | `...3532` | FLAT | 2 | 50% | 1.0 | -0.38 | -19% | $27.1K | -$13.3K | -49% | 1W |
| 8 | `...0853` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $47.4K | -$47.4K | -100% | 1L |

#### §6b-2. 7-day

**MLB** — 6 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...fc82` | FLAT | 1 | 100% | 1.0 | +1.15 | +115% | $76.6K | $88.1K | +115% | 1W |
| 2 | `...0ff5` | FLAT | 9 | 78% | 1.5 | +4.70 | +52% | $51.7K | $34.8K | +67% | 1W |
| 3 | `...abaf` | CONFIRMED | 4 | 75% | 0.8 | +1.80 | +45% | $85.4K | $34.1K | +40% | 3W |
| 4 | `...23c4` | FLAT | 1 | 100% | 1.0 | +0.91 | +91% | $6.3K | $5.7K | +91% | 1W |
| 5 | `...1fc6` | CONFIRMED | 2 | 100% | 0.5 | +2.56 | +128% | $3.3K | $4.2K | +128% | 2W |
| 6 | `...68b3` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $1.2K | -$1.2K | -100% | 1L |

**NBA** — 26 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...1697` | CONFIRMED | 1 | 100% | 1.0 | +1.10 | +110% | $180.0K | $198.0K | +110% | 1W |
| 2 | `...9a27` | CONFIRMED | 13 | 46% | 2.2 | -1.65 | -13% | $518.4K | $130.2K | +25% | 2W |
| 3 | `...abaf` | CONFIRMED | 7 | 57% | 1.2 | +1.63 | +23% | $172.8K | $96.9K | +56% | 2W |
| 4 | `...be3d` | CONFIRMED | 3 | 67% | 0.8 | +0.43 | +14% | $349.2K | $51.0K | +15% | 1L |
| 5 | `...3532` | FLAT | 9 | 67% | 1.5 | +2.99 | +33% | $265.5K | $48.3K | +18% | 2W |
| 6 | `...2f63` | FLAT | 17 | 82% | 2.8 | +11.41 | +67% | $413.2K | $37.5K | +9% | 4W |
| 7 | `...aeeb` | CONFIRMED | 5 | 60% | 1.3 | -0.17 | -3% | $118.3K | $34.2K | +29% | 1L |
| 8 | `...d49f` | FLAT | 2 | 100% | 1.0 | +1.80 | +90% | $16.1K | $14.6K | +91% | 2W |
| 9 | `...9c38` | CONFIRMED | 3 | 67% | 0.6 | -0.12 | -4% | $43.6K | $13.7K | +31% | 2W |
| 10 | `...1eae` | CONFIRMED | 2 | 100% | 0.4 | +2.08 | +104% | $6.3K | $6.7K | +106% | 2W |
| 11 | `...32f2` | CONFIRMED | 1 | 100% | 1.0 | +0.93 | +93% | $3.9K | $3.6K | +93% | 1W |
| 12 | `...df91` | FLAT | 3 | 100% | 0.5 | +3.12 | +104% | $5.3K | $2.6K | +49% | 3W |
| 13 | `...e8f1` | FLAT | 1 | 100% | 1.0 | +1.60 | +160% | $1.4K | $2.3K | +160% | 1W |
| 14 | `...0f9a` | CONFIRMED | 1 | 100% | 1.0 | +0.42 | +42% | $4.0K | $1.7K | +42% | 1W |
| 15 | `...03d4` | FLAT | 9 | 44% | 1.5 | -1.10 | -12% | $38.4K | $308 | +1% | 1L |

**NHL** — 11 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...66f5` | FLAT | 1 | 100% | 1.0 | +1.42 | +142% | $70.9K | $100.6K | +142% | 1W |
| 2 | `...9ef0` | FLAT | 2 | 100% | 0.3 | +2.42 | +121% | $16.5K | $18.0K | +109% | 2W |
| 3 | `...a240` | CONFIRMED | 5 | 80% | 0.8 | +2.75 | +55% | $14.3K | $8.2K | +57% | 1W |
| 4 | `...df91` | FLAT | 2 | 50% | 0.7 | +0.42 | +21% | $6.5K | $1.4K | +21% | 1L |
| 5 | `...afd2` | CONFIRMED | 2 | 50% | 2.0 | +0.00 | +0% | $10.0K | $0 | +0% | 1W |
| 6 | `...c67e` | CONFIRMED | 2 | 50% | 0.3 | +0.42 | +21% | $9.2K | -$1.4K | -15% | 1L |
| 7 | `...9d74` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $2.7K | -$2.7K | -100% | 1L |
| 8 | `...853d` | CONFIRMED | 2 | 50% | 0.4 | -0.11 | -5% | $8.4K | -$6.7K | -80% | 1L |
| 9 | `...3532` | FLAT | 3 | 33% | 0.5 | -1.38 | -46% | $29.2K | -$15.3K | -52% | 1W |
| 10 | `...0853` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $47.4K | -$47.4K | -100% | 1L |
| 11 | `...c12b` | CONFIRMED | 2 | 0% | 0.7 | -2.00 | -100% | $165.9K | -$165.9K | -100% | 2L |

#### §6b-3. All-time

**MLB** — 10 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...fc82` | FLAT | 15 | 53% | 0.5 | +0.91 | +6% | $312.9K | $104.4K | +33% | 1W |
| 2 | `...23c4` | FLAT | 7 | 57% | 0.3 | +0.76 | +11% | $151.1K | $55.8K | +37% | 2W |
| 3 | `...abaf` | CONFIRMED | 4 | 75% | 0.8 | +1.80 | +45% | $85.4K | $34.1K | +40% | 3W |
| 4 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 5 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 6 | `...0ff5` | FLAT | 15 | 60% | 1.5 | +2.69 | +18% | $108.6K | $12.4K | +11% | 1W |
| 7 | `...c926` | FLAT | 4 | 50% | 0.3 | +0.29 | +7% | $14.1K | $6.0K | +42% | 1L |
| 8 | `...1fc6` | CONFIRMED | 2 | 100% | 0.5 | +2.56 | +128% | $3.3K | $4.2K | +128% | 2W |
| 9 | `...68b3` | CONFIRMED | 4 | 50% | 0.2 | +0.16 | +4% | $5.0K | $2.9K | +57% | 1L |
| 10 | `...89a0` | FLAT | 3 | 100% | 0.4 | +2.87 | +96% | $1.6K | $1.5K | +95% | 3W |

**NBA** — 39 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...9a27` | CONFIRMED | 77 | 64% | 2.7 | +12.16 | +16% | $2.33M | $640.6K | +27% | 2W |
| 2 | `...b032` | CONFIRMED | 7 | 86% | 0.7 | +5.40 | +77% | $244.0K | $249.9K | +102% | 3W |
| 3 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +5.66 | +283% | $141.8K | $241.7K | +170% | 2W |
| 4 | `...aeeb` | CONFIRMED | 52 | 60% | 1.6 | +8.12 | +16% | $980.8K | $212.1K | +22% | 1L |
| 5 | `...be3d` | CONFIRMED | 5 | 60% | 0.4 | +0.03 | +1% | $821.5K | $180.0K | +22% | 1L |
| 6 | `...32f2` | CONFIRMED | 8 | 50% | 0.3 | +1.91 | +24% | $130.7K | $137.8K | +105% | 1W |
| 7 | `...e8f1` | FLAT | 16 | 44% | 0.6 | +2.53 | +16% | $564.8K | $128.7K | +23% | 2W |
| 8 | `...8da5` | CONFIRMED | 10 | 80% | 0.4 | +8.06 | +81% | $205.7K | $120.4K | +59% | 1L |
| 9 | `...02c3` | CONFIRMED | 6 | 33% | 0.9 | +0.75 | +13% | $681.1K | $104.0K | +15% | 3L |
| 10 | `...1697` | CONFIRMED | 9 | 56% | 0.3 | +0.22 | +2% | $1.05M | $100.5K | +10% | 1W |
| 11 | `...abaf` | CONFIRMED | 11 | 55% | 0.9 | +1.10 | +10% | $231.3K | $98.2K | +42% | 2W |
| 12 | `...b814` | CONFIRMED | 3 | 100% | 0.4 | +0.56 | +19% | $431.9K | $81.3K | +19% | 3W |
| 13 | `...9c38` | CONFIRMED | 11 | 91% | 0.3 | +7.08 | +64% | $147.1K | $76.6K | +52% | 2W |
| 14 | `...1a56` | CONFIRMED | 6 | 83% | 0.2 | +5.44 | +91% | $53.7K | $74.4K | +139% | 1L |
| 15 | `...3532` | FLAT | 63 | 54% | 2.0 | +6.78 | +11% | $1.06M | $70.1K | +7% | 2W |

**NHL** — 16 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...192c` | CONFIRMED | 6 | 50% | 0.5 | +0.80 | +13% | $166.9K | $136.2K | +82% | 2L |
| 2 | `...66f5` | FLAT | 2 | 100% | 0.7 | +2.30 | +115% | $78.8K | $107.6K | +137% | 2W |
| 3 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +1.88 | +94% | $88.2K | $46.9K | +53% | 2W |
| 4 | `...1187` | CONFIRMED | 5 | 100% | 2.5 | +5.03 | +101% | $38.0K | $30.3K | +80% | 5W |
| 5 | `...cea1` | CONFIRMED | 3 | 67% | 0.4 | +0.62 | +21% | $27.7K | $22.1K | +80% | 1W |
| 6 | `...a240` | CONFIRMED | 24 | 63% | 0.7 | +4.32 | +18% | $80.3K | $14.2K | +18% | 1W |
| 7 | `...c67e` | CONFIRMED | 3 | 67% | 0.1 | +1.84 | +61% | $15.2K | $7.1K | +47% | 1L |
| 8 | `...afd2` | CONFIRMED | 4 | 50% | 0.1 | +0.40 | +10% | $28.2K | $4.9K | +18% | 1W |
| 9 | `...9ef0` | FLAT | 6 | 50% | 0.2 | +0.40 | +7% | $49.7K | $4.0K | +8% | 2W |
| 10 | `...935c` | CONFIRMED | 4 | 75% | 1.0 | +2.11 | +53% | $1.3K | $953 | +74% | 3W |
| 11 | `...853d` | CONFIRMED | 8 | 63% | 0.2 | +1.02 | +13% | $37.5K | $938 | +3% | 1L |
| 12 | `...9d74` | CONFIRMED | 2 | 50% | 0.1 | +0.05 | +2% | $5.7K | $420 | +7% | 1L |
| 13 | `...df91` | FLAT | 9 | 56% | 0.4 | +0.55 | +6% | $16.0K | -$4.8K | -30% | 1L |
| 14 | `...0853` | FLAT | 8 | 63% | 0.3 | +2.17 | +27% | $180.0K | -$45.2K | -25% | 1L |
| 15 | `...3532` | FLAT | 14 | 50% | 0.5 | +1.31 | +9% | $200.0K | -$49.3K | -25% | 1W |

### §6c. Active streaks (≥3 in a row, last bet within 3 days)

Proven `(wallet × sport)` pairs currently riding a 3-or-more-bet run with their most recent bet inside the last 3 calendar days. Hot-hand monitor — and the same surface for cold streaks worth fading.

| Wallet | Sport | Tier | Streak | Last bet | All-time bets | WR% | $ PnL | $ ROI |
|---|---|---|---|---|---|---|---|---|
| `...df91` | NBA | FLAT | **9W** | 2026-05-22 | 20 | 70% | -$183 | -1% |
| `...23c4` | NBA | CONFIRMED | **4L** | 2026-05-21 | 17 | 59% | $53.9K | +8% |
| `...2f63` | NBA | FLAT | **4W** | 2026-05-22 | 85 | 55% | -$138.1K | -12% |
| `...abaf` | MLB | CONFIRMED | **3W** | 2026-05-20 | 4 | 75% | $34.1K | +40% |
| `...1eae` | NBA | CONFIRMED | **3W** | 2026-05-22 | 18 | 56% | $552 | +1% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-05-09 | 16 · $356.4K · $180.8K | — | 16 · $356.4K · $180.8K | — |
| 2026-05-10 | 21 · $575.7K · $449.8K | — | 17 · $507.9K · $480.4K | 4 · $67.8K · -$30.6K |
| 2026-05-11 | 24 · $788.4K · $162.9K | — | 22 · $773.6K · $177.7K | 2 · $14.8K · -$14.8K |
| 2026-05-12 | 27 · $350.1K · $24.0K | 5 · $83.7K · $59.0K | 19 · $157.7K · -$73.0K | 3 · $108.7K · $38.0K |
| 2026-05-13 | 18 · $378.1K · -$18.0K | 4 · $49.4K · -$7.3K | 14 · $328.8K · -$10.6K | — |
| 2026-05-14 | 9 · $53.8K · -$20.3K | 4 · $18.3K · -$11.4K | — | 5 · $35.5K · -$8.9K |
| 2026-05-15 | 37 · $682.5K · $117.5K | 1 · $2.9K · -$2.9K | 36 · $679.6K · $120.5K | — |
| 2026-05-16 | 11 · $198.9K · $33.8K | 4 · $39.0K · -$7.5K | — | 7 · $160.0K · $41.3K |
| 2026-05-17 | 22 · $380.0K · $206.5K | 4 · $49.4K · $36.5K | 18 · $330.6K · $170.1K | — |
| 2026-05-18 | 23 · $495.3K · -$133.1K | 1 · $1.7K · $2.2K | 18 · $394.8K · -$44.9K | 4 · $98.9K · -$90.4K |
| 2026-05-19 | 21 · $460.7K · -$34.4K | 2 · $86.8K · $97.4K | 19 · $373.8K · -$131.9K | — |
| 2026-05-20 | 18 · $416.8K · $172.3K | 3 · $29.6K · $19.3K | 12 · $318.3K · $217.3K | 3 · $69.0K · -$64.3K |
| 2026-05-21 | 22 · $781.1K · -$308.1K | 3 · $16.9K · $19.1K | 16 · $750.2K · -$332.6K | 3 · $14.0K · $5.4K |
| 2026-05-22 | 26 · $891.0K · -$11.2K | 1 · $1.2K · -$1.2K | 19 · $850.6K · -$6.7K | 6 · $39.2K · -$3.3K |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-05-22_
