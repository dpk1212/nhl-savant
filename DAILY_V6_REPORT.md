# Sharp Intel v6 — Daily Master Report

_Auto-generated **6/12/2026, 11:55:45 AM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (239 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-06-11** · 12 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 12 | 4-5-3 | 44.4% | -3.17u | -1.73u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Arizona Diamondbacks @ Miami Marlins | Arizona Diamondbacks | 4.0★ · 1.00u | +0 | +0 | +0 | +0 | +112 | L | -1.00u |
| MLB | ML | Atlanta Braves @ Chicago White Sox | Atlanta Braves | 3.0★ · 0.50u | +0 | -1 | +1 | +0 | -120 | P | +0.00u |
| MLB | ML | Chicago Cubs @ Colorado Rockies | Colorado Rockies | 5.0★ · 5.00u | +0 | +1 | -1 | +0 | — | L | -5.00u |
| MLB | ML | Los Angeles Dodgers @ Pittsburgh Pirates | Los Angeles Dodgers | 3.0★ · 0.50u | -1 | +1 | +1 | +2 | -167 | **W** | +0.29u |
| MLB | ML | Minnesota Twins @ Detroit Tigers | Minnesota Twins | 5.0★ · 1.00u | +1 | +3 | +1 | +4 | +110 | L | -1.00u |
| MLB | ML | Seattle Mariners @ Baltimore Orioles | Seattle Mariners | 3.0★ · 0.50u | +0 | +1 | -1 | +0 | -111 | L | -0.50u |
| MLB | ML | St. Louis Cardinals @ New York Mets | New York Mets | 5.0★ · 5.00u | +1 | +2 | +3 | +5 | -131 | **W** | +3.82u |
| MLB | ML | Texas Rangers @ Kansas City Royals | Texas Rangers | 4.0★ · 1.00u | +0 | +1 | +0 | +1 | +100 | **W** | +0.99u |
| MLB | SPREAD | Atlanta Braves @ Chicago White Sox | Atlanta Braves | 4.5★ · 2.50u | +0 | +1 | +1 | +2 | +140 | P | +0.00u |
| MLB | TOTAL | Los Angeles Dodgers @ Pittsburgh Pirates | Under 9.5 | 5.0★ · 1.00u | +1 | +1 | +2 | +3 | -108 | L | -1.00u |
| MLB | TOTAL | Texas Rangers @ Kansas City Royals | Under 10.5 | 2.5★ · 0.25u | -1 | -1 | -2 | -3 | -110 | **W** | +0.23u |
| NHL | TOTAL | Golden Knights @ Hurricanes | Under 6 | 3.0★ · 0.50u | +0 | +2 | +4 | +6 | -104 | P | +0.00u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **58** shipped · 25-30-3 · WR 45.5% · PnL -1.15u (peak) / -5.00u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 58)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC = +2 | 1 | 1-0-0 | 100.0% | +2.50u | +1.00u |
| HC = +1 | 7 | 4-3-0 | 57.1% | +5.71u | +0.42u |
| HC = 0 | 47 | 17-27-3 | 38.6% | -14.64u | -8.88u |
| HC ≤ −1 | 3 | 3-0-0 | 100.0% | +5.28u | +2.46u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 6 | 3-3-0 | 50.0% | +0.29u | -0.16u |
| +2 | 6 | 2-3-1 | 40.0% | -3.08u | -1.42u |
| +1 | 27 | 12-14-1 | 46.2% | +5.10u | -2.57u |
| 0 | 15 | 7-8-0 | 46.7% | -0.44u | +0.24u |
| −1 | 3 | 1-1-1 | 50.0% | -2.77u | -0.09u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.25u | -1.00u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 9 | 4-4-1 | 50.0% | -7.41u | -0.63u |
| +2 | 6 | 3-3-0 | 50.0% | +4.78u | -0.18u |
| +1 | 17 | 7-8-2 | 46.7% | +3.34u | -2.03u |
| 0 | 12 | 6-6-0 | 50.0% | +1.91u | +2.23u |
| −1 | 9 | 3-6-0 | 33.3% | -4.83u | -3.33u |
| ≤ −2 | 5 | 2-3-0 | 40.0% | +1.06u | -1.06u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 58)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 31 | 14-15-2 | 48.3% | +9.43u | -1.02u |
| WEAK   (−1 .. 0) | 26 | 10-15-1 | 40.0% | -12.24u | -5.76u |
| FADE   (< −1) | 1 | 1-0-0 | 100.0% | +1.66u | +1.78u |

### §2b. 7-day

Total: **128** shipped · 65-58-5 · WR 52.8% · PnL +20.82u (peak) / +2.07u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 128)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC = +2 | 7 | 5-2-0 | 71.4% | +11.53u | +1.81u |
| HC = +1 | 21 | 11-10-0 | 52.4% | +0.87u | -0.45u |
| HC = 0 | 91 | 42-44-5 | 48.8% | -3.40u | -3.94u |
| HC ≤ −1 | 9 | 7-2-0 | 77.8% | +11.82u | +4.65u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 14 | 8-6-0 | 57.1% | +7.30u | +1.05u |
| +2 | 13 | 6-6-1 | 50.0% | -4.14u | -1.64u |
| +1 | 54 | 26-26-2 | 50.0% | +3.82u | -1.26u |
| 0 | 38 | 21-16-1 | 56.8% | +14.61u | +4.35u |
| −1 | 6 | 3-2-1 | 60.0% | -0.57u | +0.71u |
| ≤ −2 | 3 | 1-2-0 | 33.3% | -0.20u | -1.14u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 16 | 8-7-1 | 53.3% | -4.85u | +0.00u |
| +2 | 17 | 10-7-0 | 58.8% | +8.95u | +1.41u |
| +1 | 37 | 20-15-2 | 57.1% | +9.77u | +1.91u |
| 0 | 32 | 17-14-1 | 54.8% | +6.79u | +3.75u |
| −1 | 19 | 7-11-1 | 38.9% | -0.11u | -3.88u |
| ≤ −2 | 7 | 3-4-0 | 42.9% | +0.27u | -1.13u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 128)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 60 | 30-28-2 | 51.7% | +13.64u | +1.11u |
| WEAK   (−1 .. 0) | 65 | 33-29-3 | 53.2% | +5.47u | -0.68u |
| FADE   (< −1) | 3 | 2-1-0 | 66.7% | +1.71u | +1.64u |

### §2c. All-time

Total: **592** shipped · 296-288-8 · WR 50.7% · PnL -50.32u (peak) / -15.91u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 481)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 10 | 3-7-0 | 30.0% | -8.83u | -5.67u |
| HC = +2 | 31 | 16-15-0 | 51.6% | -4.61u | -0.13u |
| HC = +1 | 152 | 84-68-0 | 55.3% | +0.31u | +9.56u |
| HC = 0 | 264 | 129-128-7 | 50.2% | -35.94u | -14.54u |
| HC ≤ −1 | 23 | 13-10-0 | 56.5% | +9.35u | +3.65u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 102 | 49-53-0 | 48.0% | -26.00u | -3.17u |
| +2 | 124 | 58-65-1 | 47.2% | -34.42u | -9.81u |
| +1 | 212 | 116-93-3 | 55.5% | +13.58u | +10.46u |
| 0 | 121 | 61-57-3 | 51.7% | +4.06u | -3.31u |
| −1 | 21 | 6-14-1 | 30.0% | -8.24u | -8.41u |
| ≤ −2 | 6 | 2-4-0 | 33.3% | -3.29u | -2.51u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 125 | 61-61-3 | 50.0% | -29.05u | -3.90u |
| +2 | 111 | 50-61-0 | 45.0% | -34.68u | -14.01u |
| +1 | 180 | 96-81-3 | 54.2% | +23.90u | +4.48u |
| 0 | 106 | 55-50-1 | 52.4% | -5.23u | +2.28u |
| −1 | 47 | 25-21-1 | 54.3% | +8.25u | +1.89u |
| ≤ −2 | 17 | 5-12-0 | 29.4% | -16.75u | -7.42u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 456)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 3 | 3-0-0 | 100.0% | +8.01u | +2.34u |
| LOCK   (+5 .. +7) | 9 | 5-4-0 | 55.6% | -2.93u | -0.47u |
| STRONG (+3 .. +5) | 22 | 13-9-0 | 59.1% | -6.66u | +2.77u |
| NEUT   (0 .. +3) | 283 | 140-141-2 | 49.8% | -38.98u | -17.49u |
| WEAK   (−1 .. 0) | 124 | 63-57-4 | 52.5% | +1.11u | +0.93u |
| FADE   (< −1) | 14 | 9-5-0 | 64.3% | +4.68u | +5.05u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29", "05-30", "05-31", "06-01", "06-02", "06-03", "06-04", "06-05", "06-06", "06-07", "06-08", "06-09", "06-10", "06-11"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98, -10.18, -8.90, -14.92, -23.44, -23.30, -28.89, -32.63, -26.98, -29.77, -33.27, -44.12, -48.21, -40.65, -34.49, -30.14, -28.48, -25.53, -22.94, -25.33, -24.75, -21.34, -10.19, -14.95, -13.13]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67, -16.17, -15.07, -14.58, -23.93, -16.53, -21.34, -20.03, -10.27, -14.68, -17.58, -11.51, -11.10, -17.79, -24.29, -24.19, -27.68, -32.54, -32.20, -29.06, -23.09, -21.30, -23.13, -30.43, -35.94]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52, -28.22, -25.84, -31.37, -49.24, -44.70, -55.10, -55.65, -40.24, -49.69, -53.57, -58.35, -62.03, -61.16, -58.77, -56.82, -56.00, -58.91, -48.76, -50.51, -46.96, -36.94, -22.86, -34.92, -38.09]
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

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 73 | 54 | 16 | 30% | 24 | 8 | 2 |
| NBA | 137 | 105 | 45 | 43% | 59 | 29 | 11 |
| NHL | 59 | 42 | 13 | 31% | 24 | 13 | 6 |
| **ALL (any sport)** | **171** | **135** | **54** | **40%** | **73** | **32** | **10** |

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

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | e05213 | 9 | 8 | 1 | 88.9% | +6.27 | +69.6% | $294.4K |
| 2 | c9bba3 | 5 | 4 | 1 | 80.0% | +2.37 | +47.3% | $14.8K |
| 3 | 913987 | 44 | 30 | 14 | 68.2% | +14.19 | +32.2% | $666.8K |
| 4 | 491f30 | 21 | 13 | 8 | 61.9% | +6.04 | +28.7% | $44.0K |
| 5 | dfa240 | 3 | 2 | 1 | 66.7% | +0.85 | +28.3% | $2.5K |
| 6 | eeabaf | 48 | 27 | 21 | 56.3% | +11.57 | +24.1% | $940.2K |
| 7 | ad88a3 | 5 | 3 | 2 | 60.0% | +1.13 | +22.7% | $2.2K |
| 8 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 9 | c668b3 | 16 | 10 | 6 | 62.5% | +3.16 | +19.7% | $270 |
| 10 | a8c991 | 4 | 2 | 2 | 50.0% | +0.60 | +14.9% | -$31.4K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | a0d6d2 | 4 | 4 | 0 | 100.0% | +4.51 | +112.7% | $6.4K |
| 3 | a8c991 | 2 | 2 | 0 | 100.0% | +1.95 | +97.3% | $103.1K |
| 4 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 5 | b51a56 | 6 | 5 | 1 | 83.3% | +5.44 | +90.7% | $74.4K |
| 6 | 11b032 | 7 | 6 | 1 | 85.7% | +5.40 | +77.1% | $249.9K |
| 7 | a1684d | 9 | 8 | 1 | 88.9% | +4.26 | +47.3% | $9.6K |
| 8 | 92df91 | 23 | 16 | 7 | 69.6% | +10.26 | +44.6% | -$214 |
| 9 | 7f00bc | 20 | 13 | 7 | 65.0% | +8.82 | +44.1% | $11.1K |
| 10 | 8ec926 | 8 | 6 | 2 | 75.0% | +3.53 | +44.1% | -$681 |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 8366f5 | 2 | 2 | 0 | 100.0% | +2.30 | +114.9% | $107.6K |
| 2 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 3 | fec67e | 4 | 3 | 1 | 75.0% | +2.82 | +70.5% | $12.5K |
| 4 | 30935c | 4 | 3 | 1 | 75.0% | +2.11 | +52.7% | $953 |
| 5 | 981187 | 8 | 6 | 2 | 75.0% | +3.52 | +44.0% | -$25.2K |
| 6 | bc3532 | 21 | 14 | 7 | 66.7% | +8.85 | +42.1% | $89.1K |
| 7 | fcc12b | 11 | 8 | 3 | 72.7% | +4.45 | +40.5% | -$27.5K |
| 8 | e70853 | 9 | 6 | 3 | 66.7% | +2.66 | +29.5% | -$11.1K |
| 9 | dfa240 | 28 | 18 | 10 | 64.3% | +6.46 | +23.1% | $19.0K |
| 10 | c5cea1 | 3 | 2 | 1 | 66.7% | +0.62 | +20.7% | $22.1K |

---
## §5. Proven-wallet roster growth & HC tracking

"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).

### §5a. Current proven-winner roster (snapshot)

Roster as of **2026-06-11** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 121 | 54 | 10 | 6 | **16** | 8 | 13.2% |
| NBA | 205 | 105 | 29 | 16 | **45** | 20 | 22.0% |
| NHL | 105 | 42 | 9 | 4 | **13** | 11 | 12.4% |
| **ALL** | **—** | **—** | **—** | **—** | **74** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 30 · 10 | 14 · 6 | 6 · 8 | +28 live |
| NBA | 55 · 29 | 25 · 16 | 22 · 20 | +35 live |
| NHL | 22 · 9 | 8 · 4 | 12 · 11 | +17 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-06-11.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +0 from 16 | +2 from 14 | +7 from 9 | +16 from 0 |
| NBA | +1 from 44 | +2 from 43 | +8 from 37 | +45 from 0 |
| NHL | -1 from 14 | -1 from 14 | +2 from 11 | +13 from 0 |

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
| MLB | 121 | 54 (45%) | 16 (30%) | 10 (63%) | **16** | edge (Eligible→Flat-OK) 70% |
| NBA | 205 | 105 (51%) | 45 (43%) | 29 (64%) | **45** | edge (Eligible→Flat-OK) 57% |
| NHL | 105 | 42 (40%) | 13 (31%) | 9 (69%) | **13** | edge (Eligible→Flat-OK) 69% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 53 | 9 (17.0%) | 7 (13.2%) | 1 (1.9%) |
| MLB | 7-day | 118 | 30 (25.4%) | 24 (20.3%) | 4 (3.4%) |
| MLB | All-time | 414 | 149 (36.0%) | 136 (32.9%) | 16 (3.9%) |
| NBA | 3-day | 2 | 2 (100.0%) | 1 (50.0%) | 0 (0.0%) |
| NBA | 7-day | 7 | 5 (71.4%) | 4 (57.1%) | 3 (42.9%) |
| NBA | All-time | 125 | 82 (65.6%) | 68 (54.4%) | 33 (26.4%) |
| NHL | 3-day | 3 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| NHL | 7-day | 3 | 0 (0.0%) | 0 (0.0%) | 0 (0.0%) |
| NHL | All-time | 47 | 20 (42.6%) | 19 (40.4%) | 5 (10.6%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 58 | 11 (19.0%) | 8 (13.8%) | 1 (1.7%) |
| 7-day | 128 | 35 (27.3%) | 28 (21.9%) | 7 (5.5%) |
| All-time | 586 | 251 (42.8%) | 223 (38.1%) | 54 (9.2%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...be17` | 1 | +6.95 | 23 | -60% |
| `...e3d0` | 1 | +0.91 | 24 | 27% |
| `...fc26` | 1 | +0.91 | 5 | 72% |
| `...be00` | 1 | +0.87 | 15 | 10% |
| `...9373` | 1 | +0.87 | 0 | — |
| `...9b3c` | 1 | +0.77 | 8 | 52% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...afd2` | 41 | 51% | -0.5% | 177 | -20% |
| `...aeea` | 13 | 54% | -1.7% | 295 | -6% |
| `...600d` | 16 | 50% | -4.3% | 52 | -4% |
| `...0232` | 4 | 50% | -4.5% | 11 | 30% |
| `...2f63` | 105 | 49% | -5.0% | 1034 | -5% |
| `...c12b` | 40 | 48% | -6.5% | 67 | -19% |

#### NBA

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...bf5d` | 1 | +3.15 | 3 | 42% |
| `...ed41` | 1 | +3.15 | 3 | 3% |
| `...6b87` | 1 | +2.05 | 8 | -27% |
| `...9d74` | 1 | +0.93 | 44 | -11% |
| `...c556` | 1 | +0.93 | 3 | 42% |
| `...5c69` | 1 | +0.91 | 2 | 28% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...d814` | 8 | 50% | -0.5% | 53 | 1% |
| `...1e50` | 2 | 50% | -1.9% | 18 | 47% |
| `...65dd` | 6 | 50% | -2.4% | 17 | 27% |
| `...853d` | 40 | 53% | -2.7% | 90 | -2% |
| `...1eae` | 19 | 53% | -3.3% | 76 | 15% |
| `...f5b0` | 20 | 50% | -3.7% | 57 | -28% |

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
| `...afd2` | 6 | 50% | -1.9% | 26 | -17% |
| `...192c` | 7 | 43% | -2.9% | 21 | -15% |
| `...44b0` | 5 | 60% | -4.8% | 13 | -32% |
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
| MLB | 4 | 13 | **27** | 44 | 61.4% |
| NBA | 12 | 33 | **35** | 80 | 43.8% |
| NHL | 4 | 9 | **17** | 30 | 56.7% |
| **ALL** | **20** | **55** | **79** | **154** | **51.3%** |

#### Pipeline freshness

- `sharp_action_positions` GRADED rows: **13189**
- `sharp_action_positions` PENDING rows: **147** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 6/12/2026, 8:16:30 AM ET — 219 min · within 2 cron cycles

**Alarms**: pending > 200 OR rebuild lag > 4h → cron is lagging or failing — check `gh run list --workflow="Grade Sharp Actions"`.

#### B-only roster — wallets currently promoted via Source B path only

Wallets here would have been EXCLUDED under v1 (Source-A-only). Top by Source-B bet count per sport. The 2-week re-eval (2026-05-24) will compare these wallets' realized lift against A-only and A+B cohorts.

**MLB** — 27 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...9a27` | CONFIRMED | 467 | +12.3% | +4.4% |
| `...135d` | CONFIRMED | 332 | +1.1% | +3.4% |
| `...1eae` | FLAT | 147 | +3.1% | -1.4% |
| `...c684` | FLAT | 85 | +6.6% | -2.2% |
| `...69c2` | CONFIRMED | 66 | +17.4% | +1% |
| `...ad50` | FLAT | 43 | +5.5% | -1.6% |
| `...d6d2` | FLAT | 38 | +6.8% | -25.5% |
| `...39b3` | CONFIRMED | 28 | +2.8% | +2.7% |
| `...2a9e` | FLAT | 26 | +8.7% | -21.1% |
| `...cff6` | CONFIRMED | 26 | +6.6% | +22% |
| … | 17 more | | | |

**NBA** — 35 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...cff6` | CONFIRMED | 106 | +1.2% | +33.9% |
| `...135d` | FLAT | 103 | +4.1% | -12.6% |
| `...1eae` | CONFIRMED | 76 | +0.7% | +15% |
| `...3782` | CONFIRMED | 69 | +3.8% | +2.6% |
| `...935c` | FLAT | 50 | +17.3% | -21.4% |
| `...9d74` | FLAT | 44 | +2.4% | -11.2% |
| `...68b3` | CONFIRMED | 44 | +33.9% | +13.9% |
| `...b6ef` | CONFIRMED | 42 | +6.3% | +3.3% |
| `...0563` | CONFIRMED | 37 | +4.9% | +41.7% |
| `...e2ce` | CONFIRMED | 35 | +14.2% | +28.7% |
| … | 25 more | | | |

**NHL** — 17 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...618e` | CONFIRMED | 28 | +6.2% | +23.8% |
| `...35e3` | CONFIRMED | 26 | +10.6% | +31.5% |
| `...5eee` | CONFIRMED | 23 | +30.5% | +19.3% |
| `...192c` | FLAT | 21 | +14% | -15.2% |
| `...0c2e` | FLAT | 16 | +20% | -12.9% |
| `...44b0` | FLAT | 13 | +12.3% | -31.5% |
| `...1e50` | FLAT | 12 | +11.8% | -31.6% |
| `...2ca8` | CONFIRMED | 10 | +26.9% | +14% |
| `...600d` | CONFIRMED | 9 | +69% | +75.8% |
| `...a9cc` | CONFIRMED | 7 | +49.5% | +46.9% |
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

Slate: **2026-06-11** · 16 bets · 11 distinct proven wallets · WR 63% · $ vol $299.4K · $ PnL -$115.2K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...abaf` (CONFIRMED) | MLB | TOTAL | Texas Rangers @ Kansas City Royals | $32.0K | **W** | $29.1K |
| `...2125` (CONFIRMED) | NHL | TOTAL | Golden Knights @ Hurricanes | $13.5K | **W** | $13.1K |
| `...1f30` (CONFIRMED) | MLB | ML | St. Louis Cardinals @ New York Mets | $12.0K | **W** | $9.1K |
| `...3532` (FLAT) | NHL | ML | Golden Knights @ Hurricanes | $12.2K | **W** | $7.9K |
| `...23c4` (FLAT) | MLB | TOTAL | Los Angeles Dodgers @ Pittsburgh Pirates | $7.0K | **W** | $6.5K |
| `...8f33` (CONFIRMED) | MLB | ML | Texas Rangers @ Kansas City Royals | $6.0K | **W** | $5.9K |
| `...64aa` (CONFIRMED) | MLB | ML | Los Angeles Dodgers @ Pittsburgh Pirates | $9.2K | **W** | $5.3K |
| `...a240` (CONFIRMED) | NHL | TOTAL | Golden Knights @ Hurricanes | $2.8K | **W** | $2.7K |
| `...a240` (CONFIRMED) | MLB | TOTAL | Arizona Diamondbacks @ Miami Marlins | $2.4K | **W** | $2.4K |
| `...88a3` (CONFIRMED) | MLB | ML | Los Angeles Dodgers @ Pittsburgh Pirates | $3.4K | **W** | $1.9K |
| `...64aa` (CONFIRMED) | MLB | ML | Minnesota Twins @ Detroit Tigers | $358 | L | -$358 |
| `...88a3` (CONFIRMED) | MLB | ML | Arizona Diamondbacks @ Miami Marlins | $2.4K | L | -$2.4K |
| `...64aa` (CONFIRMED) | MLB | ML | Seattle Mariners @ Baltimore Orioles | $3.7K | L | -$3.7K |
| `...2125` (CONFIRMED) | NHL | ML | Golden Knights @ Hurricanes | $30.3K | L | -$30.3K |
| `...c991` (FLAT) | MLB | TOTAL | Texas Rangers @ Kansas City Royals | $54.0K | L | -$54.0K |
| `...3987` (CONFIRMED) | MLB | ML | Texas Rangers @ Kansas City Royals | $108.3K | L | -$108.3K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 12 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...5213` | CONFIRMED | 1 | 100% | 1.0 | +0.91 | +91% | $125.3K | $113.9K | +91% | 1W |
| 2 | `...abaf` | CONFIRMED | 3 | 100% | 1.0 | +2.64 | +88% | $112.4K | $96.9K | +86% | 3W |
| 3 | `...fc82` | FLAT | 1 | 100% | 1.0 | +0.85 | +85% | $52.0K | $44.4K | +85% | 1W |
| 4 | `...1f30` | CONFIRMED | 8 | 75% | 2.7 | +3.56 | +45% | $63.3K | $29.7K | +47% | 2W |
| 5 | `...8f33` | CONFIRMED | 11 | 55% | 3.7 | +1.07 | +10% | $34.0K | $9.4K | +28% | 1W |
| 6 | `...a240` | CONFIRMED | 1 | 100% | 1.0 | +0.98 | +98% | $2.4K | $2.4K | +98% | 1W |
| 7 | `...88a3` | CONFIRMED | 3 | 67% | 1.5 | +0.33 | +11% | $7.0K | $582 | +8% | 1W |
| 8 | `...0ff5` | FLAT | 2 | 50% | 1.0 | -0.09 | -5% | $9.5K | -$431 | -5% | 1W |
| 9 | `...3987` | CONFIRMED | 7 | 71% | 2.3 | +2.53 | +36% | $300.4K | -$87.3K | -29% | 1L |
| 10 | `...c991` | FLAT | 2 | 0% | 1.0 | -2.00 | -100% | $94.0K | -$94.0K | -100% | 2L |
| 11 | `...64aa` | CONFIRMED | 18 | 22% | 6.0 | -10.37 | -58% | $205.0K | -$100.3K | -49% | 2L |
| 12 | `...23c4` | FLAT | 8 | 38% | 2.7 | -1.42 | -18% | $227.2K | -$165.5K | -73% | 3W |

**NBA** — 13 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 1 | 100% | 1.0 | +0.76 | +76% | $222.9K | $168.9K | +76% | 1W |
| 2 | `...e8f1` | FLAT | 1 | 100% | 1.0 | +0.76 | +76% | $147.6K | $111.9K | +76% | 1W |
| 3 | `...66f5` | FLAT | 2 | 100% | 2.0 | +1.72 | +86% | $73.8K | $55.9K | +76% | 2W |
| 4 | `...2f63` | FLAT | 3 | 67% | 3.0 | +0.71 | +24% | $46.1K | $27.3K | +59% | 1L |
| 5 | `...aeeb` | CONFIRMED | 1 | 100% | 1.0 | +0.76 | +76% | $31.8K | $24.1K | +76% | 1W |
| 6 | `...44b0` | CONFIRMED | 2 | 100% | 2.0 | +1.72 | +86% | $16.3K | $13.2K | +81% | 2W |
| 7 | `...00bc` | CONFIRMED | 1 | 100% | 1.0 | +0.76 | +76% | $3.2K | $2.5K | +76% | 1W |
| 8 | `...684d` | CONFIRMED | 1 | 100% | 1.0 | +0.96 | +96% | $110 | $106 | +96% | 1W |
| 9 | `...9953` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $6.2K | -$6.2K | -100% | 1L |
| 10 | `...3532` | FLAT | 2 | 50% | 2.0 | -0.04 | -2% | $24.6K | -$11.7K | -48% | 1W |
| 11 | `...9c38` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $54.6K | -$54.6K | -100% | 1L |
| 12 | `...0c2e` | FLAT | 2 | 50% | 2.0 | -0.04 | -2% | $309.0K | -$63.8K | -21% | 1W |
| 13 | `...8da5` | CONFIRMED | 2 | 50% | 2.0 | -0.04 | -2% | $132.6K | -$68.2K | -51% | 1W |

**NHL** — 4 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...3532` | FLAT | 2 | 100% | 0.7 | +2.80 | +140% | $20.1K | $24.9K | +124% | 2W |
| 2 | `...2125` | CONFIRMED | 5 | 60% | 1.7 | +2.03 | +41% | $83.2K | $5.4K | +7% | 1W |
| 3 | `...a240` | CONFIRMED | 2 | 50% | 0.7 | -0.03 | -1% | $6.3K | -$850 | -14% | 1W |
| 4 | `...df91` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $1.2K | -$1.2K | -100% | 1L |

#### §6b-2. 7-day

**MLB** — 12 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...5213` | CONFIRMED | 5 | 100% | 1.0 | +4.42 | +88% | $328.2K | $295.4K | +90% | 5W |
| 2 | `...3987` | CONFIRMED | 25 | 68% | 3.6 | +7.59 | +30% | $1.50M | $206.4K | +14% | 1L |
| 3 | `...fc82` | FLAT | 1 | 100% | 1.0 | +0.85 | +85% | $52.0K | $44.4K | +85% | 1W |
| 4 | `...abaf` | CONFIRMED | 12 | 50% | 2.0 | -0.17 | -1% | $268.5K | $43.0K | +16% | 4W |
| 5 | `...64aa` | CONFIRMED | 52 | 50% | 7.4 | -6.55 | -13% | $824.8K | $40.6K | +5% | 2L |
| 6 | `...1f30` | CONFIRMED | 12 | 67% | 2.4 | +3.43 | +29% | $90.1K | $36.4K | +40% | 2W |
| 7 | `...8f33` | CONFIRMED | 29 | 59% | 4.1 | +3.20 | +11% | $142.3K | $24.8K | +17% | 1W |
| 8 | `...a240` | CONFIRMED | 2 | 50% | 0.3 | -0.02 | -1% | $4.3K | $436 | +10% | 1W |
| 9 | `...88a3` | CONFIRMED | 4 | 50% | 0.8 | -0.67 | -17% | $9.0K | -$1.4K | -15% | 1W |
| 10 | `...0ff5` | FLAT | 3 | 33% | 1.0 | -1.09 | -36% | $14.2K | -$5.2K | -36% | 1W |
| 11 | `...c991` | FLAT | 2 | 0% | 1.0 | -2.00 | -100% | $94.0K | -$94.0K | -100% | 2L |
| 12 | `...23c4` | FLAT | 19 | 47% | 2.7 | -0.96 | -5% | $424.8K | -$124.0K | -29% | 3W |

**NBA** — 24 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 3 | 67% | 0.5 | +0.19 | +6% | $352.4K | $181.5K | +52% | 1W |
| 2 | `...3f67` | CONFIRMED | 1 | 100% | 1.0 | +0.87 | +87% | $73.7K | $64.1K | +87% | 1W |
| 3 | `...66f5` | FLAT | 2 | 100% | 2.0 | +1.72 | +86% | $73.8K | $55.9K | +76% | 2W |
| 4 | `...e8f1` | FLAT | 3 | 67% | 0.5 | +0.19 | +6% | $259.3K | $47.2K | +18% | 1W |
| 5 | `...c991` | CONFIRMED | 1 | 100% | 1.0 | +0.81 | +81% | $34.5K | $27.8K | +81% | 1W |
| 6 | `...11a4` | CONFIRMED | 2 | 100% | 0.5 | +1.24 | +62% | $39.3K | $18.4K | +47% | 2W |
| 7 | `...32f2` | CONFIRMED | 1 | 100% | 1.0 | +0.95 | +95% | $2.5K | $2.4K | +95% | 1W |
| 8 | `...9ef0` | CONFIRMED | 1 | 100% | 1.0 | +0.43 | +43% | $1.7K | $745 | +43% | 1W |
| 9 | `...b33b` | CONFIRMED | 1 | 100% | 1.0 | +0.43 | +43% | $1.5K | $670 | +43% | 1W |
| 10 | `...684d` | CONFIRMED | 1 | 100% | 1.0 | +0.96 | +96% | $110 | $106 | +96% | 1W |
| 11 | `...00bc` | CONFIRMED | 3 | 67% | 0.5 | +0.19 | +6% | $10.5K | -$574 | -5% | 1W |
| 12 | `...aeeb` | CONFIRMED | 3 | 67% | 0.5 | +0.56 | +19% | $130.0K | -$5.3K | -4% | 2W |
| 13 | `...9953` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $6.2K | -$6.2K | -100% | 1L |
| 14 | `...2f63` | FLAT | 9 | 44% | 1.5 | -1.48 | -16% | $88.3K | -$8.5K | -10% | 1L |
| 15 | `...dc5b` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $10.4K | -$10.4K | -100% | 1L |

**NHL** — 5 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...3532` | FLAT | 3 | 100% | 0.5 | +3.72 | +124% | $24.1K | $28.6K | +119% | 3W |
| 2 | `...2125` | CONFIRMED | 6 | 50% | 1.0 | +1.03 | +17% | $84.2K | $4.4K | +5% | 1W |
| 3 | `...df91` | FLAT | 2 | 50% | 0.5 | -0.07 | -4% | $2.4K | -$192 | -8% | 1L |
| 4 | `...a240` | CONFIRMED | 2 | 50% | 0.7 | -0.03 | -1% | $6.3K | -$850 | -14% | 1W |
| 5 | `...9d74` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $2.1K | -$2.1K | -100% | 1L |

#### §6b-3. All-time

**MLB** — 16 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 48 | 56% | 1.8 | +11.57 | +24% | $1.13M | $940.2K | +83% | 4W |
| 2 | `...3987` | CONFIRMED | 44 | 68% | 4.0 | +14.19 | +32% | $2.29M | $666.8K | +29% | 1L |
| 3 | `...5213` | CONFIRMED | 9 | 89% | 1.1 | +6.27 | +70% | $386.1K | $294.4K | +76% | 7W |
| 4 | `...64aa` | CONFIRMED | 209 | 56% | 3.9 | +5.77 | +3% | $3.76M | $218.4K | +6% | 2L |
| 5 | `...fc82` | FLAT | 25 | 52% | 0.5 | +0.57 | +2% | $513.6K | $130.1K | +25% | 1W |
| 6 | `...8f33` | CONFIRMED | 44 | 57% | 2.3 | +3.76 | +9% | $289.9K | $56.2K | +19% | 1W |
| 7 | `...1f30` | CONFIRMED | 21 | 62% | 1.9 | +6.04 | +29% | $148.3K | $44.0K | +30% | 2W |
| 8 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 9 | `...bba3` | CONFIRMED | 5 | 80% | 0.4 | +2.37 | +47% | $153.7K | $14.8K | +10% | 1L |
| 10 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 11 | `...a240` | CONFIRMED | 3 | 67% | 0.1 | +0.85 | +28% | $6.7K | $2.5K | +38% | 1W |
| 12 | `...88a3` | CONFIRMED | 5 | 60% | 0.6 | +1.13 | +23% | $11.0K | $2.2K | +20% | 1W |
| 13 | `...0ff5` | FLAT | 35 | 54% | 1.2 | +2.63 | +8% | $233.1K | $1.2K | +1% | 1W |
| 14 | `...68b3` | FLAT | 16 | 63% | 0.4 | +3.16 | +20% | $16.3K | $270 | +2% | 1L |
| 15 | `...c991` | FLAT | 4 | 50% | 0.4 | +0.60 | +15% | $155.0K | -$31.4K | -20% | 2L |

**NBA** — 45 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 26 | 62% | 0.5 | +6.33 | +24% | $2.75M | $945.0K | +34% | 1W |
| 2 | `...9a27` | CONFIRMED | 89 | 57% | 2.2 | +4.08 | +5% | $2.68M | $425.9K | +16% | 4L |
| 3 | `...aeeb` | CONFIRMED | 60 | 60% | 1.1 | +8.98 | +15% | $1.23M | $257.3K | +21% | 2W |
| 4 | `...b032` | CONFIRMED | 7 | 86% | 0.7 | +5.40 | +77% | $244.0K | $249.9K | +102% | 3W |
| 5 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +5.66 | +283% | $141.8K | $241.7K | +170% | 2W |
| 6 | `...be3d` | CONFIRMED | 5 | 60% | 0.4 | +0.03 | +1% | $821.5K | $180.0K | +22% | 1L |
| 7 | `...e8f1` | FLAT | 20 | 45% | 0.4 | +1.73 | +9% | $828.3K | $171.7K | +21% | 1W |
| 8 | `...32f2` | CONFIRMED | 10 | 50% | 0.2 | +1.86 | +19% | $146.1K | $127.3K | +87% | 1W |
| 9 | `...0c2e` | FLAT | 7 | 71% | 0.4 | +2.58 | +37% | $551.6K | $116.0K | +21% | 1W |
| 10 | `...02c3` | CONFIRMED | 6 | 33% | 0.9 | +0.75 | +13% | $681.1K | $104.0K | +15% | 3L |
| 11 | `...c991` | CONFIRMED | 2 | 100% | 0.1 | +1.95 | +97% | $100.5K | $103.1K | +103% | 2W |
| 12 | `...b814` | CONFIRMED | 3 | 100% | 0.4 | +0.56 | +19% | $431.9K | $81.3K | +19% | 3W |
| 13 | `...1a56` | CONFIRMED | 6 | 83% | 0.2 | +5.44 | +91% | $53.7K | $74.4K | +139% | 1L |
| 14 | `...23c4` | CONFIRMED | 23 | 61% | 0.6 | +4.81 | +21% | $784.6K | $70.7K | +9% | 3W |
| 15 | `...5143` | FLAT | 13 | 62% | 0.4 | +3.27 | +25% | $798.4K | $57.5K | +7% | 1L |

**NHL** — 13 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...66f5` | FLAT | 2 | 100% | 0.7 | +2.30 | +115% | $78.8K | $107.6K | +137% | 2W |
| 2 | `...3532` | FLAT | 21 | 67% | 0.4 | +8.85 | +42% | $365.8K | $89.1K | +24% | 8W |
| 3 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +1.88 | +94% | $88.2K | $46.9K | +53% | 2W |
| 4 | `...2125` | CONFIRMED | 15 | 60% | 0.8 | +2.51 | +17% | $136.5K | $39.3K | +29% | 1W |
| 5 | `...cea1` | CONFIRMED | 3 | 67% | 0.4 | +0.62 | +21% | $27.7K | $22.1K | +80% | 1W |
| 6 | `...a240` | CONFIRMED | 28 | 64% | 0.5 | +6.46 | +23% | $92.1K | $19.0K | +21% | 1W |
| 7 | `...c67e` | CONFIRMED | 4 | 75% | 0.2 | +2.82 | +71% | $20.7K | $12.5K | +60% | 1W |
| 8 | `...9d74` | CONFIRMED | 5 | 60% | 0.1 | +0.84 | +17% | $15.0K | $5.2K | +35% | 1L |
| 9 | `...935c` | CONFIRMED | 4 | 75% | 1.0 | +2.11 | +53% | $1.3K | $953 | +74% | 3W |
| 10 | `...df91` | FLAT | 13 | 54% | 0.3 | +0.78 | +6% | $18.7K | -$5.0K | -27% | 1L |
| 11 | `...0853` | CONFIRMED | 9 | 67% | 0.3 | +2.66 | +30% | $250.0K | -$11.1K | -4% | 1W |
| 12 | `...1187` | FLAT | 8 | 75% | 0.2 | +3.52 | +44% | $153.0K | -$25.2K | -16% | 2L |
| 13 | `...c12b` | CONFIRMED | 11 | 73% | 0.3 | +4.45 | +40% | $504.9K | -$27.5K | -5% | 2W |

### §6c. Active streaks (≥3 in a row, last bet within 3 days)

Proven `(wallet × sport)` pairs currently riding a 3-or-more-bet run with their most recent bet inside the last 3 calendar days. Hot-hand monitor — and the same surface for cold streaks worth fading.

| Wallet | Sport | Tier | Streak | Last bet | All-time bets | WR% | $ PnL | $ ROI |
|---|---|---|---|---|---|---|---|---|
| `...3532` | NHL | FLAT | **8W** | 2026-06-11 | 21 | 67% | $89.1K | +24% |
| `...5213` | MLB | CONFIRMED | **7W** | 2026-06-09 | 9 | 89% | $294.4K | +76% |
| `...abaf` | MLB | CONFIRMED | **4W** | 2026-06-11 | 48 | 56% | $940.2K | +83% |
| `...9c38` | NBA | CONFIRMED | **3L** | 2026-06-10 | 16 | 75% | $9.4K | +4% |
| `...23c4` | MLB | FLAT | **3W** | 2026-06-11 | 65 | 55% | -$178.4K | -12% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-05-29 | 23 · $244.1K · $3.6K | 21 · $236.0K · $805 | — | 2 · $8.0K · $2.8K |
| 2026-05-30 | 30 · $904.1K · -$34.7K | 12 · $155.6K · $66.3K | 18 · $748.5K · -$101.0K | — |
| 2026-05-31 | 11 · $278.3K · $5.7K | 11 · $278.3K · $5.7K | — | — |
| 2026-06-01 | 23 · $575.7K · $86.5K | 23 · $575.7K · $86.5K | — | — |
| 2026-06-02 | 28 · $586.6K · $262.2K | 20 · $495.6K · $149.9K | — | 8 · $91.1K · $112.3K |
| 2026-06-03 | 57 · $1.22M · -$228.0K | 29 · $584.3K · $123.7K | 28 · $636.1K · -$351.8K | — |
| 2026-06-04 | 22 · $552.0K · $9.1K | 19 · $512.8K · -$15.0K | — | 3 · $39.2K · $24.1K |
| 2026-06-05 | 44 · $1.78M · -$725.9K | 22 · $613.2K · $168.5K | 22 · $1.16M · -$894.4K | — |
| 2026-06-06 | 28 · $728.5K · $33.8K | 24 · $720.3K · $32.2K | — | 4 · $8.2K · $1.6K |
| 2026-06-07 | 37 · $808.5K · $274.4K | 37 · $808.5K · $274.4K | — | — |
| 2026-06-08 | 34 · $1.11M · $419.4K | 18 · $380.8K · $142.2K | 16 · $731.3K · $277.2K | — |
| 2026-06-09 | 30 · $652.6K · $9.8K | 24 · $600.5K · -$25.2K | — | 6 · $52.1K · $35.0K |
| 2026-06-10 | 49 · $1.46M · $182.8K | 29 · $391.2K · -$16.4K | 20 · $1.07M · $199.3K | — |
| 2026-06-11 | 16 · $299.4K · -$115.2K | 12 · $240.7K · -$108.5K | — | 4 · $58.8K · -$6.7K |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-06-11_
