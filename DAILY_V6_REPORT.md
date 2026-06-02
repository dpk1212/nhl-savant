# Sharp Intel v6 — Daily Master Report

_Auto-generated **6/2/2026, 1:07:58 PM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (226 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-06-01** · 7 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 7 | 4-3-0 | 57.1% | +2.39u | +1.50u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Chicago White Sox @ Minnesota Twins | Minnesota Twins | 4.5★ · 3.00u | +2 | +3 | +2 | +5 | -155 | **W** | +2.08u |
| MLB | ML | Detroit Tigers @ Tampa Bay Rays | Detroit Tigers | 4.0★ · 1.00u | +2 | +2 | +1 | +3 | +135 | **W** | +1.35u |
| MLB | ML | Kansas City Royals @ Cincinnati Reds | Kansas City Royals | 5.0★ · 2.50u | -1 | +2 | +1 | +3 | +160 | **W** | +2.73u |
| MLB | ML | Miami Marlins @ Washington Nationals | Washington Nationals | 3.0★ · 0.50u | +0 | -1 | +0 | -1 | -142 | L | -0.50u |
| MLB | TOTAL | Kansas City Royals @ Cincinnati Reds | Under 9.5 | 4.0★ · 1.00u | +0 | +0 | +2 | +2 | -116 | L | -1.00u |
| MLB | TOTAL | San Francisco Giants @ Milwaukee Brewers | Under 4.5 | 5.0★ · 5.00u | +0 | +1 | +0 | +1 | -110 | L | -5.00u |
| MLB | TOTAL | Texas Rangers @ St. Louis Cardinals | Under 5.5 | 4.5★ · 3.00u | +1 | +1 | +4 | +5 | -110 | **W** | +2.73u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **39** shipped · 20-19-0 · WR 51.3% · PnL -0.42u (peak) / -0.76u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 39)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 1 | 0-1-0 | 0.0% | -1.00u | -1.00u |
| HC = +2 | 3 | 3-0-0 | 100.0% | +5.72u | +2.80u |
| HC = +1 | 14 | 8-6-0 | 57.1% | +4.91u | +0.73u |
| HC = 0 | 20 | 8-12-0 | 40.0% | -12.78u | -4.88u |
| HC ≤ −1 | 1 | 1-0-0 | 100.0% | +2.73u | +1.60u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 4 | 1-3-0 | 25.0% | -2.42u | -2.35u |
| +2 | 8 | 5-3-0 | 62.5% | +3.48u | +2.63u |
| +1 | 14 | 8-6-0 | 57.1% | -5.25u | +1.81u |
| 0 | 10 | 6-4-0 | 60.0% | +8.02u | +0.17u |
| −1 | 2 | 0-2-0 | 0.0% | -1.50u | -2.00u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -2.75u | -1.00u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 5 | 2-3-0 | 40.0% | -0.24u | -1.55u |
| +2 | 10 | 4-6-0 | 40.0% | -2.76u | -3.08u |
| +1 | 11 | 9-2-0 | 81.8% | +14.82u | +7.52u |
| 0 | 10 | 4-6-0 | 40.0% | -9.14u | -2.94u |
| −1 | 1 | 1-0-0 | 100.0% | +0.65u | +1.29u |
| ≤ −2 | 2 | 0-2-0 | 0.0% | -3.75u | -2.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 39)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 32 | 15-17-0 | 46.9% | -5.93u | -3.90u |
| WEAK   (−1 .. 0) | 7 | 5-2-0 | 71.4% | +5.51u | +3.15u |

### §2b. 7-day

Total: **101** shipped · 53-48-0 · WR 52.5% · PnL -3.12u (peak) / -2.41u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 101)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 1-1-0 | 50.0% | +0.93u | -0.49u |
| HC = +2 | 6 | 4-2-0 | 66.7% | +2.22u | +1.70u |
| HC = +1 | 32 | 17-15-0 | 53.1% | -5.01u | -0.98u |
| HC = 0 | 57 | 29-28-0 | 50.9% | -4.26u | -3.25u |
| HC ≤ −1 | 4 | 2-2-0 | 50.0% | +3.00u | +0.61u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 17 | 5-12-0 | 29.4% | -13.57u | -7.49u |
| +2 | 30 | 15-15-0 | 50.0% | -2.62u | -0.87u |
| +1 | 29 | 19-10-0 | 65.5% | +5.25u | +6.23u |
| 0 | 21 | 14-7-0 | 66.7% | +13.32u | +3.72u |
| −1 | 3 | 0-3-0 | 0.0% | -2.75u | -3.00u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -2.75u | -1.00u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 13 | 4-9-0 | 30.8% | -9.41u | -5.83u |
| +2 | 19 | 9-10-0 | 47.4% | -4.33u | -2.74u |
| +1 | 40 | 25-15-0 | 62.5% | +17.44u | +7.80u |
| 0 | 18 | 8-10-0 | 44.4% | -8.89u | -3.30u |
| −1 | 7 | 6-1-0 | 85.7% | +5.52u | +3.92u |
| ≤ −2 | 4 | 1-3-0 | 25.0% | -3.45u | -2.25u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 101)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 88 | 45-43-0 | 51.1% | -5.48u | -5.29u |
| WEAK   (−1 .. 0) | 13 | 8-5-0 | 61.5% | +2.36u | +2.88u |

### §2c. All-time

Total: **422** shipped · 209-210-3 · WR 49.9% · PnL -71.00u (peak) / -18.34u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 311)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 9 | 3-6-0 | 33.3% | -8.58u | -4.67u |
| HC = +2 | 23 | 10-13-0 | 43.5% | -20.49u | -2.84u |
| HC = +1 | 126 | 70-56-0 | 55.6% | -5.42u | +9.70u |
| HC = 0 | 143 | 72-69-2 | 51.1% | -24.29u | -9.19u |
| HC ≤ −1 | 9 | 3-6-0 | 33.3% | -1.62u | -2.55u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 83 | 39-44-0 | 47.0% | -32.62u | -2.85u |
| +2 | 107 | 49-58-0 | 45.8% | -37.31u | -10.29u |
| +1 | 139 | 80-58-1 | 58.0% | +10.16u | +11.45u |
| 0 | 72 | 35-35-2 | 50.0% | -3.39u | -6.04u |
| −1 | 13 | 2-11-0 | 15.4% | -8.58u | -9.46u |
| ≤ −2 | 2 | 0-2-0 | 0.0% | -3.25u | -2.00u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 105 | 50-53-2 | 48.5% | -26.85u | -4.99u |
| +2 | 89 | 38-51-0 | 42.7% | -41.06u | -14.24u |
| +1 | 129 | 68-60-1 | 53.1% | +5.26u | +0.51u |
| 0 | 60 | 31-29-0 | 51.7% | -2.41u | -0.78u |
| −1 | 23 | 16-7-0 | 69.6% | +7.84u | +6.68u |
| ≤ −2 | 10 | 2-8-0 | 20.0% | -17.02u | -6.29u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 286)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 3 | 3-0-0 | 100.0% | +8.01u | +2.34u |
| LOCK   (+5 .. +7) | 9 | 5-4-0 | 55.6% | -2.93u | -0.47u |
| STRONG (+3 .. +5) | 22 | 13-9-0 | 59.1% | -6.66u | +2.77u |
| NEUT   (0 .. +3) | 209 | 103-106-0 | 49.3% | -51.23u | -17.72u |
| WEAK   (−1 .. 0) | 32 | 16-15-1 | 51.6% | -4.36u | +1.61u |
| FADE   (< −1) | 10 | 6-4-0 | 60.0% | +1.72u | +2.16u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29", "05-30", "05-31", "06-01"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98, -10.18, -8.90, -14.92, -23.44, -23.30, -28.89, -32.63, -26.98, -29.77, -33.27, -44.12, -48.21, -40.65, -34.49]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67, -16.17, -15.07, -14.58, -23.93, -16.53, -21.34, -20.03, -10.27, -14.68, -17.58, -11.51, -11.10, -17.79, -24.29]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52, -28.22, -25.84, -31.37, -49.24, -44.70, -55.10, -55.65, -40.24, -49.69, -53.57, -58.35, -62.03, -61.16, -58.77]
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

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 64 | 44 | 14 | 32% | 18 | 7 | 4 |
| NBA | 133 | 101 | 43 | 43% | 59 | 28 | 13 |
| NHL | 57 | 41 | 12 | 29% | 23 | 10 | 6 |
| **ALL (any sport)** | **164** | **129** | **52** | **40%** | **72** | **29** | **13** |

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

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | c289a0 | 3 | 3 | 0 | 100.0% | +2.87 | +95.6% | $1.5K |
| 2 | 880232 | 2 | 2 | 0 | 100.0% | +1.82 | +90.9% | $130.1K |
| 3 | c9bba3 | 3 | 3 | 0 | 100.0% | +2.42 | +80.7% | $66.5K |
| 4 | 913987 | 5 | 4 | 1 | 80.0% | +3.28 | +65.6% | $82.0K |
| 5 | 491f30 | 7 | 4 | 3 | 57.1% | +2.70 | +38.6% | $9.1K |
| 6 | eeabaf | 35 | 21 | 14 | 60.0% | +12.74 | +36.4% | $924.7K |
| 7 | c668b3 | 15 | 10 | 5 | 66.7% | +4.16 | +27.7% | $649 |
| 8 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 9 | a10ff5 | 32 | 18 | 14 | 56.3% | +3.72 | +11.6% | $6.4K |
| 10 | 4c64aa | 131 | 78 | 53 | 59.5% | +13.41 | +10.2% | $238.0K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | 4a9953 | 2 | 2 | 0 | 100.0% | +2.16 | +108.2% | $3.7K |
| 3 | a0d6d2 | 2 | 2 | 0 | 100.0% | +1.91 | +95.3% | $4.1K |
| 4 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 5 | b51a56 | 6 | 5 | 1 | 83.3% | +5.44 | +90.7% | $74.4K |
| 6 | 11b032 | 7 | 6 | 1 | 85.7% | +5.40 | +77.1% | $249.9K |
| 7 | 769c38 | 13 | 12 | 1 | 92.3% | +9.01 | +69.3% | $100.0K |
| 8 | 2e8da5 | 11 | 8 | 3 | 72.7% | +7.06 | +64.2% | $84.1K |
| 9 | 7f00bc | 17 | 11 | 6 | 64.7% | +8.63 | +50.7% | $11.7K |
| 10 | f9e3d0 | 4 | 3 | 1 | 75.0% | +1.90 | +47.4% | $4.3K |

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

Roster as of **2026-06-01** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 115 | 44 | 7 | 7 | **14** | 4 | 12.2% |
| NBA | 192 | 101 | 28 | 15 | **43** | 21 | 22.4% |
| NHL | 95 | 41 | 8 | 4 | **12** | 11 | 12.6% |
| **ALL** | **—** | **—** | **—** | **—** | **69** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 27 · 7 | 8 · 7 | 6 · 4 | +21 live |
| NBA | 54 · 28 | 22 · 15 | 20 · 21 | +33 live |
| NHL | 19 · 8 | 6 · 4 | 14 · 11 | +13 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-06-01.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +2 from 12 | +1 from 13 | +7 from 7 | +14 from 0 |
| NBA | +1 from 42 | +3 from 40 | +11 from 32 | +43 from 0 |
| NHL | +0 from 12 | -4 from 16 | +0 from 12 | +12 from 0 |

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
| MLB | 115 | 44 (38%) | 14 (32%) | 7 (50%) | **14** | edge (Eligible→Flat-OK) 68% |
| NBA | 192 | 101 (53%) | 43 (43%) | 28 (65%) | **43** | edge (Eligible→Flat-OK) 57% |
| NHL | 95 | 41 (43%) | 12 (29%) | 8 (67%) | **12** | edge (Eligible→Flat-OK) 71% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 37 | 17 (45.9%) | 17 (45.9%) | 3 (8.1%) |
| MLB | 7-day | 89 | 39 (43.8%) | 35 (39.3%) | 4 (4.5%) |
| MLB | All-time | 258 | 113 (43.8%) | 107 (41.5%) | 12 (4.7%) |
| NBA | 3-day | 2 | 2 (100.0%) | 1 (50.0%) | 1 (50.0%) |
| NBA | 7-day | 6 | 5 (83.3%) | 4 (66.7%) | 4 (66.7%) |
| NBA | All-time | 116 | 75 (64.7%) | 63 (54.3%) | 29 (25.0%) |
| NHL | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NHL | 7-day | 6 | 1 (16.7%) | 1 (16.7%) | 0 (0.0%) |
| NHL | All-time | 42 | 19 (45.2%) | 18 (42.9%) | 4 (9.5%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 39 | 19 (48.7%) | 18 (46.2%) | 4 (10.3%) |
| 7-day | 101 | 45 (44.6%) | 40 (39.6%) | 8 (7.9%) |
| All-time | 416 | 207 (49.8%) | 188 (45.2%) | 45 (10.8%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...be17` | 1 | +6.95 | 23 | -60% |
| `...e3d0` | 1 | +0.91 | 19 | 21% |
| `...be00` | 1 | +0.87 | 14 | 3% |
| `...a240` | 1 | +0.87 | 7 | 83% |
| `...9373` | 1 | +0.87 | 0 | — |
| `...9b3c` | 1 | +0.77 | 8 | 52% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...1eae` | 61 | 49% | -0.9% | 120 | 8% |
| `...2768` | 24 | 46% | -1.7% | 42 | 19% |
| `...9d74` | 29 | 48% | -5.9% | 138 | -11% |
| `...c12b` | 40 | 48% | -6.5% | 67 | -19% |
| `...35e3` | 22 | 50% | -6.7% | 100 | -19% |
| `...2f63` | 82 | 48% | -6.8% | 765 | -9% |

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
| MLB | 3 | 11 | **21** | 35 | 60.0% |
| NBA | 15 | 28 | **33** | 76 | 43.4% |
| NHL | 4 | 8 | **13** | 25 | 52.0% |
| **ALL** | **22** | **47** | **67** | **136** | **49.3%** |

#### Pipeline freshness

- `sharp_action_positions` GRADED rows: **10508**
- `sharp_action_positions` PENDING rows: **142** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 6/2/2026, 8:39:07 AM ET — **269 min · STALE** — check grade-sharp-actions workflow

**Alarms**: pending > 200 OR rebuild lag > 4h → cron is lagging or failing — check `gh run list --workflow="Grade Sharp Actions"`.

#### B-only roster — wallets currently promoted via Source B path only

Wallets here would have been EXCLUDED under v1 (Source-A-only). Top by Source-B bet count per sport. The 2-week re-eval (2026-05-24) will compare these wallets' realized lift against A-only and A+B cohorts.

**MLB** — 21 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...9a27` | CONFIRMED | 439 | +10.4% | +1.1% |
| `...135d` | CONFIRMED | 326 | +1.9% | +6.9% |
| `...1eae` | CONFIRMED | 123 | +11.4% | +8.4% |
| `...8f33` | CONFIRMED | 67 | +1.8% | +5.9% |
| `...69c2` | CONFIRMED | 58 | +19.7% | +2.3% |
| `...2768` | CONFIRMED | 42 | +15.2% | +19.3% |
| `...ad50` | CONFIRMED | 17 | +34% | +21.8% |
| `...1fc6` | CONFIRMED | 17 | +15.5% | +19.7% |
| `...f804` | CONFIRMED | 16 | +50.5% | +49.5% |
| `...600d` | CONFIRMED | 9 | +10.8% | +20.3% |
| … | 11 more | | | |

**NBA** — 33 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...aeea` | FLAT | 150 | +0.5% | -2.8% |
| `...135d` | FLAT | 102 | +5.1% | -11.9% |
| `...3782` | CONFIRMED | 64 | +2% | +1.1% |
| `...935c` | FLAT | 50 | +17.3% | -21.4% |
| `...b33b` | CONFIRMED | 45 | +12.6% | +18.8% |
| `...b6ef` | CONFIRMED | 41 | +8.9% | +7.2% |
| `...d227` | CONFIRMED | 38 | +1.6% | +18.6% |
| `...0563` | CONFIRMED | 37 | +4.9% | +41.7% |
| `...68b3` | CONFIRMED | 36 | +11% | +9.3% |
| `...be00` | FLAT | 33 | +0.9% | -1.8% |
| … | 23 more | | | |

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

Slate: **2026-06-01** · 24 bets · 7 distinct proven wallets · WR 63% · $ vol $576.5K · $ PnL $87.1K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...3987` (CONFIRMED) | MLB | ML | Kansas City Royals @ Cincinnati Reds | $80.0K | **W** | $87.2K |
| `...3987` (CONFIRMED) | MLB | TOTAL | Kansas City Royals @ Cincinnati Reds | $42.8K | **W** | $37.5K |
| `...abaf` (CONFIRMED) | MLB | TOTAL | Texas Rangers @ St. Louis Cardinals | $40.8K | **W** | $37.1K |
| `...abaf` (CONFIRMED) | MLB | ML | Kansas City Royals @ Cincinnati Reds | $25.6K | **W** | $27.9K |
| `...3987` (CONFIRMED) | MLB | TOTAL | Detroit Tigers @ Tampa Bay Rays | $31.8K | **W** | $27.4K |
| `...64aa` (CONFIRMED) | MLB | ML | Detroit Tigers @ Tampa Bay Rays | $19.1K | **W** | $25.7K |
| `...64aa` (CONFIRMED) | MLB | ML | Chicago White Sox @ Minnesota Twins | $34.2K | **W** | $23.8K |
| `...1f30` (CONFIRMED) | MLB | ML | Detroit Tigers @ Tampa Bay Rays | $12.7K | **W** | $17.2K |
| `...3987` (CONFIRMED) | MLB | ML | Los Angeles Dodgers @ Arizona Diamondbacks | $10.6K | **W** | $15.4K |
| `...abaf` (CONFIRMED) | MLB | ML | Colorado Rockies @ Los Angeles Angels | $8.0K | **W** | $13.4K |
| `...fc82` (FLAT) | MLB | ML | Miami Marlins @ Washington Nationals | $9.1K | **W** | $6.6K |
| `...1f30` (CONFIRMED) | MLB | SPREAD | Kansas City Royals @ Cincinnati Reds | $4.0K | **W** | $6.3K |
| `...1f30` (CONFIRMED) | MLB | ML | Colorado Rockies @ Los Angeles Angels | $3.5K | **W** | $5.9K |
| `...1f30` (CONFIRMED) | MLB | ML | Kansas City Royals @ Cincinnati Reds | $4.2K | **W** | $4.6K |
| `...d6d2` (FLAT) | MLB | ML | Chicago White Sox @ Minnesota Twins | $809 | **W** | $562 |
| `...64aa` (CONFIRMED) | MLB | ML | Colorado Rockies @ Los Angeles Angels | $4.8K | L | -$4.8K |
| `...1f30` (CONFIRMED) | MLB | SPREAD | San Francisco Giants @ Milwaukee Brewers | $6.7K | L | -$6.7K |
| `...1f30` (CONFIRMED) | MLB | ML | New York Mets @ Seattle Mariners | $7.7K | L | -$7.7K |
| `...1f30` (CONFIRMED) | MLB | ML | San Francisco Giants @ Milwaukee Brewers | $10.5K | L | -$10.5K |
| `...abaf` (CONFIRMED) | MLB | TOTAL | San Francisco Giants @ Milwaukee Brewers | $23.9K | L | -$23.9K |
| `...64aa` (CONFIRMED) | MLB | ML | Miami Marlins @ Washington Nationals | $27.8K | L | -$27.8K |
| `...64aa` (CONFIRMED) | MLB | ML | Los Angeles Dodgers @ Arizona Diamondbacks | $34.5K | L | -$34.5K |
| `...23c4` (FLAT) | MLB | TOTAL | Kansas City Royals @ Cincinnati Reds | $48.0K | L | -$48.0K |
| `...3987` (CONFIRMED) | MLB | TOTAL | Texas Rangers @ St. Louis Cardinals | $85.5K | L | -$85.5K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 7 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 8 | 63% | 2.7 | +2.54 | +32% | $206.3K | $100.6K | +49% | 1W |
| 2 | `...64aa` | CONFIRMED | 15 | 67% | 5.0 | +4.23 | +28% | $299.6K | $92.5K | +31% | 2L |
| 3 | `...3987` | CONFIRMED | 5 | 80% | 5.0 | +3.28 | +66% | $250.7K | $82.0K | +33% | 1L |
| 4 | `...1f30` | CONFIRMED | 7 | 57% | 7.0 | +2.70 | +39% | $49.2K | $9.1K | +19% | 3L |
| 5 | `...fc82` | FLAT | 3 | 67% | 1.0 | +0.62 | +21% | $33.7K | $6.0K | +18% | 2W |
| 6 | `...d6d2` | FLAT | 1 | 100% | 1.0 | +0.69 | +69% | $809 | $562 | +69% | 1W |
| 7 | `...23c4` | FLAT | 2 | 0% | 1.0 | -2.00 | -100% | $127.9K | -$127.9K | -100% | 2L |

**NBA** — 11 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...0c2e` | CONFIRMED | 1 | 100% | 1.0 | +0.91 | +91% | $152.7K | $138.8K | +91% | 1W |
| 2 | `...2f63` | FLAT | 3 | 33% | 3.0 | -1.32 | -44% | $139.5K | $94.1K | +67% | 2L |
| 3 | `...1697` | CONFIRMED | 2 | 100% | 2.0 | +1.58 | +79% | $64.0K | $48.4K | +76% | 2W |
| 4 | `...11a4` | CONFIRMED | 1 | 100% | 1.0 | +0.68 | +68% | $5.0K | $3.4K | +68% | 1W |
| 5 | `...9791` | CONFIRMED | 1 | 100% | 1.0 | +0.68 | +68% | $993 | $671 | +68% | 1W |
| 6 | `...03d4` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $2.5K | -$2.5K | -100% | 1L |
| 7 | `...aeeb` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $10.0K | -$10.0K | -100% | 1L |
| 8 | `...e3d0` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $46.6K | -$46.6K | -100% | 1L |
| 9 | `...9a27` | CONFIRMED | 2 | 0% | 2.0 | -2.00 | -100% | $87.6K | -$87.6K | -100% | 2L |
| 10 | `...3532` | FLAT | 2 | 0% | 2.0 | -2.00 | -100% | $102.2K | -$102.2K | -100% | 2L |
| 11 | `...abaf` | FLAT | 2 | 0% | 2.0 | -2.00 | -100% | $124.4K | -$124.4K | -100% | 2L |

#### §6b-2. 7-day

**MLB** — 10 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...64aa` | CONFIRMED | 34 | 76% | 4.9 | +14.72 | +43% | $680.8K | $299.2K | +44% | 2L |
| 2 | `...abaf` | CONFIRMED | 24 | 58% | 3.4 | +4.35 | +18% | $431.3K | $156.8K | +36% | 1W |
| 3 | `...3987` | CONFIRMED | 5 | 80% | 5.0 | +3.28 | +66% | $250.7K | $82.0K | +33% | 1L |
| 4 | `...fc82` | FLAT | 7 | 57% | 1.2 | +0.80 | +11% | $103.4K | $26.5K | +26% | 2W |
| 5 | `...bba3` | CONFIRMED | 1 | 100% | 1.0 | +0.75 | +75% | $22.0K | $16.4K | +75% | 1W |
| 6 | `...1f30` | CONFIRMED | 7 | 57% | 7.0 | +2.70 | +39% | $49.2K | $9.1K | +19% | 3L |
| 7 | `...d6d2` | FLAT | 6 | 67% | 1.2 | +1.36 | +23% | $10.3K | $1.9K | +18% | 2W |
| 8 | `...68b3` | FLAT | 5 | 60% | 1.7 | +0.67 | +13% | $3.0K | $251 | +8% | 1W |
| 9 | `...0ff5` | FLAT | 12 | 50% | 3.0 | -0.02 | -0% | $91.8K | -$8.4K | -9% | 1W |
| 10 | `...23c4` | FLAT | 13 | 62% | 1.9 | +2.52 | +19% | $332.8K | -$24.1K | -7% | 2L |

**NBA** — 17 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...1697` | CONFIRMED | 3 | 100% | 1.0 | +2.23 | +74% | $272.0K | $183.5K | +67% | 3W |
| 2 | `...0c2e` | CONFIRMED | 3 | 67% | 0.6 | +0.89 | +30% | $187.5K | $135.3K | +72% | 2W |
| 3 | `...2f63` | FLAT | 8 | 25% | 1.6 | -4.45 | -56% | $162.1K | $78.8K | +49% | 2L |
| 4 | `...aeeb` | CONFIRMED | 3 | 67% | 0.6 | +0.50 | +17% | $117.8K | $55.2K | +47% | 1L |
| 5 | `...9ef0` | CONFIRMED | 3 | 67% | 1.0 | +0.91 | +30% | $22.3K | $18.1K | +81% | 1W |
| 6 | `...d6d2` | FLAT | 2 | 100% | 0.7 | +1.91 | +95% | $4.2K | $4.1K | +96% | 2W |
| 7 | `...9791` | CONFIRMED | 1 | 100% | 1.0 | +0.68 | +68% | $993 | $671 | +68% | 1W |
| 8 | `...df91` | FLAT | 2 | 100% | 0.7 | +1.16 | +58% | $257 | $144 | +56% | 2W |
| 9 | `...11a4` | CONFIRMED | 2 | 50% | 0.7 | -0.32 | -16% | $10.0K | -$1.5K | -15% | 1W |
| 10 | `...00bc` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $2.6K | -$2.6K | -100% | 1L |
| 11 | `...23c4` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $4.9K | -$4.9K | -100% | 1L |
| 12 | `...03d4` | FLAT | 3 | 0% | 0.6 | -3.00 | -100% | $6.5K | -$6.5K | -100% | 3L |
| 13 | `...c926` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $8.5K | -$8.5K | -100% | 1L |
| 14 | `...9a27` | CONFIRMED | 3 | 33% | 0.6 | -1.02 | -34% | $143.6K | -$32.7K | -23% | 2L |
| 15 | `...e3d0` | FLAT | 3 | 67% | 0.6 | +0.96 | +32% | $51.9K | -$41.5K | -80% | 1L |

**NHL** — 2 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...3532` | FLAT | 1 | 100% | 1.0 | +0.66 | +66% | $75.4K | $49.6K | +66% | 1W |
| 2 | `...1187` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $35.0K | -$35.0K | -100% | 1L |

#### §6b-3. All-time

**MLB** — 14 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 35 | 60% | 2.1 | +12.74 | +36% | $837.7K | $924.7K | +110% | 1W |
| 2 | `...64aa` | CONFIRMED | 131 | 60% | 3.0 | +13.41 | +10% | $2.51M | $238.0K | +9% | 2L |
| 3 | `...fc82` | FLAT | 22 | 55% | 0.5 | +1.71 | +8% | $416.3K | $130.8K | +31% | 2W |
| 4 | `...0232` | CONFIRMED | 2 | 100% | 0.2 | +1.82 | +91% | $143.1K | $130.1K | +91% | 2W |
| 5 | `...3987` | CONFIRMED | 5 | 80% | 5.0 | +3.28 | +66% | $250.7K | $82.0K | +33% | 1L |
| 6 | `...bba3` | CONFIRMED | 3 | 100% | 0.5 | +2.42 | +81% | $83.0K | $66.5K | +80% | 3W |
| 7 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 8 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 9 | `...1f30` | CONFIRMED | 7 | 57% | 7.0 | +2.70 | +39% | $49.2K | $9.1K | +19% | 3L |
| 10 | `...0ff5` | FLAT | 32 | 56% | 1.8 | +3.72 | +12% | $218.8K | $6.4K | +3% | 1W |
| 11 | `...89a0` | FLAT | 3 | 100% | 0.4 | +2.87 | +96% | $1.6K | $1.5K | +95% | 3W |
| 12 | `...68b3` | FLAT | 15 | 67% | 0.5 | +4.16 | +28% | $15.9K | $649 | +4% | 1W |
| 13 | `...d6d2` | FLAT | 9 | 56% | 0.5 | +0.27 | +3% | $19.5K | -$5.5K | -28% | 2W |
| 14 | `...23c4` | FLAT | 37 | 57% | 1.0 | +3.52 | +10% | $813.3K | -$23.5K | -3% | 2L |

**NBA** — 43 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 22 | 64% | 0.6 | +7.14 | +32% | $2.24M | $921.0K | +41% | 3W |
| 2 | `...9a27` | CONFIRMED | 87 | 59% | 2.4 | +6.08 | +7% | $2.66M | $440.2K | +17% | 2L |
| 3 | `...1697` | CONFIRMED | 12 | 67% | 0.3 | +2.45 | +20% | $1.32M | $284.0K | +21% | 4W |
| 4 | `...aeeb` | CONFIRMED | 56 | 61% | 1.3 | +9.41 | +17% | $1.10M | $267.5K | +24% | 1L |
| 5 | `...b032` | CONFIRMED | 7 | 86% | 0.7 | +5.40 | +77% | $244.0K | $249.9K | +102% | 3W |
| 6 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +5.66 | +283% | $141.8K | $241.7K | +170% | 2W |
| 7 | `...be3d` | CONFIRMED | 5 | 60% | 0.4 | +0.03 | +1% | $821.5K | $180.0K | +22% | 1L |
| 8 | `...0c2e` | CONFIRMED | 4 | 75% | 0.7 | +1.82 | +45% | $188.1K | $135.8K | +72% | 2W |
| 9 | `...32f2` | CONFIRMED | 9 | 44% | 0.3 | +0.91 | +10% | $143.6K | $124.9K | +87% | 1L |
| 10 | `...e8f1` | FLAT | 17 | 41% | 0.5 | +1.53 | +9% | $569.0K | $124.5K | +22% | 1L |
| 11 | `...02c3` | CONFIRMED | 6 | 33% | 0.9 | +0.75 | +13% | $681.1K | $104.0K | +15% | 3L |
| 12 | `...9c38` | CONFIRMED | 13 | 92% | 0.4 | +9.01 | +69% | $170.3K | $100.0K | +59% | 4W |
| 13 | `...8da5` | CONFIRMED | 11 | 73% | 0.3 | +7.06 | +64% | $242.0K | $84.1K | +35% | 2L |
| 14 | `...b814` | CONFIRMED | 3 | 100% | 0.4 | +0.56 | +19% | $431.9K | $81.3K | +19% | 3W |
| 15 | `...1a56` | CONFIRMED | 6 | 83% | 0.2 | +5.44 | +91% | $53.7K | $74.4K | +139% | 1L |

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
| `...1697` | NBA | CONFIRMED | **4W** | 2026-05-30 | 12 | 67% | $284.0K | +21% |
| `...bba3` | MLB | CONFIRMED | **3W** | 2026-05-29 | 3 | 100% | $66.5K | +80% |
| `...03d4` | NBA | FLAT | **3L** | 2026-05-30 | 27 | 63% | $27.9K | +29% |
| `...1f30` | MLB | CONFIRMED | **3L** | 2026-06-01 | 7 | 57% | $9.1K | +19% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-05-19 | 26 · $522.2K · -$42.8K | 7 · $148.4K · $89.0K | 19 · $373.8K · -$131.9K | — |
| 2026-05-20 | 27 · $571.5K · $195.0K | 12 · $185.6K · $46.3K | 12 · $316.9K · $213.0K | 3 · $69.0K · -$64.3K |
| 2026-05-21 | 24 · $814.1K · -$342.8K | 5 · $49.9K · -$15.6K | 16 · $750.2K · -$332.6K | 3 · $14.0K · $5.4K |
| 2026-05-22 | 28 · $990.0K · -$106.4K | 6 · $132.5K · -$87.1K | 20 · $848.8K · -$10.5K | 2 · $8.7K · -$8.7K |
| 2026-05-23 | 29 · $925.5K · $480.8K | 12 · $334.6K · -$9.4K | 11 · $441.3K · $391.0K | 6 · $149.7K · $99.2K |
| 2026-05-24 | 35 · $1.11M · $1.09M | 20 · $442.3K · $856.5K | 14 · $626.3K · $270.8K | 1 · $40.0K · -$40.0K |
| 2026-05-25 | 35 · $848.8K · $102.3K | 18 · $328.1K · -$49.2K | 17 · $520.7K · $151.5K | — |
| 2026-05-26 | 28 · $425.9K · $248.7K | 14 · $160.1K · $150.2K | 13 · $230.7K · $133.5K | 1 · $35.0K · -$35.0K |
| 2026-05-27 | 29 · $579.8K · $210.7K | 28 · $504.4K · $161.1K | — | 1 · $75.4K · $49.6K |
| 2026-05-28 | 22 · $406.9K · $239.9K | 7 · $101.6K · $87.3K | 15 · $305.3K · $152.6K | — |
| 2026-05-29 | 24 · $240.9K · -$1.9K | 24 · $240.9K · -$1.9K | — | — |
| 2026-05-30 | 23 · $848.8K · -$17.7K | 6 · $113.4K · $70.2K | 17 · $735.4K · -$87.9K | — |
| 2026-05-31 | 11 · $278.3K · $5.7K | 11 · $278.3K · $5.7K | — | — |
| 2026-06-01 | 24 · $576.5K · $87.1K | 24 · $576.5K · $87.1K | — | — |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-06-01_
