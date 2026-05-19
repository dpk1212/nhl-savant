# Sharp Intel v6 — Daily Master Report

_Auto-generated **5/19/2026, 12:03:35 PM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (181 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-05-18** · 9 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 9 | 4-5-0 | 44.4% | -7.16u | -1.02u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Atlanta Braves @ Miami Marlins | Miami Marlins | 4.5★ · 5.00u | +1 | +2 | +0 | +2 | -111 | **W** | +4.39u |
| MLB | ML | Baltimore Orioles @ Tampa Bay Rays | Baltimore Orioles | 4.0★ · 2.50u | +0 | +2 | +1 | +3 | +120 | L | -2.50u |
| MLB | ML | Cincinnati Reds @ Philadelphia Phillies | Philadelphia Phillies | 3.0★ · 1.25u | +0 | +2 | +1 | +3 | -118 | **W** | +1.06u |
| MLB | ML | Cleveland Guardians @ Detroit Tigers | Detroit Tigers | 4.0★ · 2.75u | +0 | +2 | +1 | +3 | -150 | L | -2.75u |
| MLB | ML | Los Angeles Dodgers @ San Diego Padres | San Diego Padres | 3.0★ · 1.25u | +0 | +2 | +2 | +4 | +132 | **W** | +1.63u |
| NBA | ML | Spurs @ Thunder | Thunder | 5.0★ · 5.00u | +2 | +3 | +8 | +11 | -240 | L | -5.00u |
| NBA | SPREAD | Spurs @ Thunder | Thunder | 2.5★ · 1.00u | +1 | +1 | +1 | +2 | -110 | L | -1.00u |
| NHL | ML | Canadiens @ NHL Playoffs: Who Will Win Series? - Sabres | NHL Playoffs: Who Will Win Series? - Sabres | 5.0★ · 5.00u | +2 | +2 | +2 | +4 | -112 | L | -5.00u |
| NHL | TOTAL | Canadiens @ Sabres | Under 5.5 | 4.5★ · 2.25u | +1 | +3 | +2 | +5 | -110 | **W** | +2.01u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **24** shipped · 13-11-0 · WR 54.2% · PnL -7.09u (peak) / +1.94u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 24)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 1 | 0-1-0 | 0.0% | -0.75u | -1.00u |
| HC = +2 | 4 | 1-3-0 | 25.0% | -9.75u | -1.85u |
| HC = +1 | 11 | 7-4-0 | 63.6% | +4.25u | +3.40u |
| HC = 0 | 8 | 5-3-0 | 62.5% | -0.84u | +1.39u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 7 | 5-2-0 | 71.4% | -0.65u | +3.83u |
| +2 | 12 | 5-7-0 | 41.7% | -7.64u | -2.45u |
| +1 | 3 | 2-1-0 | 66.7% | +1.43u | +0.66u |
| 0 | 2 | 1-1-0 | 50.0% | -0.23u | -0.09u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 4 | 3-1-0 | 75.0% | +0.54u | +2.71u |
| +2 | 8 | 4-4-0 | 50.0% | -6.46u | +0.09u |
| +1 | 8 | 4-4-0 | 50.0% | -3.43u | -0.67u |
| 0 | 3 | 2-1-0 | 66.7% | +3.01u | +0.81u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.75u | -1.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 24)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| LOCK   (+5 .. +7) | 1 | 0-1-0 | 0.0% | -2.50u | -1.00u |
| STRONG (+3 .. +5) | 3 | 2-1-0 | 66.7% | -1.00u | +0.82u |
| NEUT   (0 .. +3) | 15 | 8-7-0 | 53.3% | -3.65u | +0.58u |
| WEAK   (−1 .. 0) | 3 | 2-1-0 | 66.7% | +0.57u | +1.56u |
| FADE   (< −1) | 2 | 1-1-0 | 50.0% | -0.51u | -0.02u |

### §2b. 7-day

Total: **48** shipped · 22-26-0 · WR 45.8% · PnL -27.95u (peak) / -4.73u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 48)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 0-2-0 | 0.0% | -4.25u | -2.00u |
| HC = +2 | 6 | 2-4-0 | 33.3% | -9.82u | -1.86u |
| HC = +1 | 24 | 14-10-0 | 58.3% | +4.84u | +3.83u |
| HC = 0 | 16 | 6-10-0 | 37.5% | -18.72u | -4.70u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 17 | 7-10-0 | 41.2% | -26.47u | -1.73u |
| +2 | 15 | 6-9-0 | 40.0% | -8.28u | -3.98u |
| +1 | 10 | 7-3-0 | 70.0% | +9.82u | +3.20u |
| 0 | 6 | 2-4-0 | 33.3% | -3.02u | -2.21u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 16 | 8-8-0 | 50.0% | -13.17u | +0.72u |
| +2 | 10 | 4-6-0 | 40.0% | -14.46u | -1.91u |
| +1 | 14 | 6-8-0 | 42.9% | -5.44u | -3.28u |
| 0 | 4 | 2-2-0 | 50.0% | +1.76u | -0.19u |
| −1 | 2 | 2-0-0 | 100.0% | +6.61u | +1.94u |
| ≤ −2 | 2 | 0-2-0 | 0.0% | -3.25u | -2.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 48)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| LOCK   (+5 .. +7) | 2 | 0-2-0 | 0.0% | -6.00u | -2.00u |
| STRONG (+3 .. +5) | 9 | 5-4-0 | 55.6% | -6.38u | +0.11u |
| NEUT   (0 .. +3) | 27 | 11-16-0 | 40.7% | -16.77u | -5.64u |
| WEAK   (−1 .. 0) | 4 | 3-1-0 | 75.0% | +1.32u | +3.01u |
| FADE   (< −1) | 6 | 3-3-0 | 50.0% | -0.12u | -0.20u |

### §2c. All-time

Total: **213** shipped · 102-109-2 · WR 48.3% · PnL -34.75u (peak) / -8.27u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 102)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 0-2-0 | 0.0% | -4.25u | -2.00u |
| HC = +2 | 11 | 5-6-0 | 45.5% | -6.32u | -1.03u |
| HC = +1 | 58 | 34-24-0 | 58.6% | +7.59u | +9.70u |
| HC = 0 | 28 | 12-15-1 | 44.4% | -17.67u | -4.15u |
| HC ≤ −1 | 2 | 0-2-0 | 0.0% | -3.50u | -2.00u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 45 | 27-18-0 | 60.0% | -1.36u | +13.15u |
| +2 | 53 | 21-32-0 | 39.6% | -25.15u | -10.94u |
| +1 | 67 | 38-28-1 | 57.6% | +10.33u | +6.58u |
| 0 | 34 | 11-22-1 | 33.3% | -16.46u | -11.96u |
| −1 | 7 | 1-6-0 | 14.3% | -5.60u | -4.94u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 75 | 36-37-2 | 49.3% | -19.99u | +0.80u |
| +2 | 52 | 24-28-0 | 46.2% | -20.21u | -3.19u |
| +1 | 53 | 26-27-0 | 49.1% | -2.35u | -3.92u |
| 0 | 19 | 7-12-0 | 36.8% | -0.83u | -4.24u |
| −1 | 4 | 4-0-0 | 100.0% | +8.96u | +3.55u |
| ≤ −2 | 4 | 1-3-0 | 25.0% | -3.57u | -2.04u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 77)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 1 | 1-0-0 | 100.0% | +3.18u | +0.95u |
| LOCK   (+5 .. +7) | 7 | 4-3-0 | 57.1% | -1.82u | +0.14u |
| STRONG (+3 .. +5) | 18 | 13-5-0 | 72.2% | +3.84u | +6.77u |
| NEUT   (0 .. +3) | 37 | 14-23-0 | 37.8% | -24.61u | -9.25u |
| WEAK   (−1 .. 0) | 5 | 3-2-0 | 60.0% | -0.68u | +2.01u |
| FADE   (< −1) | 8 | 4-4-0 | 50.0% | +0.89u | +0.14u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52]
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

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 52 | 32 | 10 | 31% | 18 | 5 | 1 |
| NBA | 120 | 88 | 38 | 43% | 51 | 25 | 12 |
| NHL | 46 | 31 | 15 | 48% | 22 | 11 | 7 |
| **ALL (any sport)** | **141** | **105** | **46** | **44%** | **59** | **29** | **12** |

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

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | c289a0 | 3 | 3 | 0 | 100.0% | +2.87 | +95.6% | $1.5K |
| 2 | c668b3 | 3 | 2 | 1 | 66.7% | +1.16 | +38.7% | $4.0K |
| 3 | eeabaf | 3 | 2 | 1 | 66.7% | +0.92 | +30.6% | $14.1K |
| 4 | 972768 | 10 | 6 | 4 | 60.0% | +2.51 | +25.1% | $21.4K |
| 5 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 6 | 8ec926 | 4 | 2 | 2 | 50.0% | +0.29 | +7.2% | $6.0K |
| 7 | 70135d | 8 | 4 | 4 | 50.0% | +0.55 | +6.9% | $21.9K |
| 8 | a10ff5 | 11 | 6 | 5 | 54.5% | +0.66 | +6.0% | -$7.5K |
| 9 | 4c64aa | 65 | 37 | 28 | 56.9% | +3.86 | +5.9% | $28.9K |
| 10 | b05143 | 10 | 5 | 5 | 50.0% | +0.27 | +2.7% | $26.2K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | b51a56 | 5 | 5 | 0 | 100.0% | +6.44 | +128.9% | $74.8K |
| 3 | 4a9953 | 2 | 2 | 0 | 100.0% | +2.16 | +108.2% | $3.7K |
| 4 | 8ec926 | 5 | 5 | 0 | 100.0% | +4.60 | +92.0% | $8.5K |
| 5 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 6 | 2e8da5 | 10 | 8 | 2 | 80.0% | +8.06 | +80.6% | $120.4K |
| 7 | 11b032 | 7 | 6 | 1 | 85.7% | +5.40 | +77.1% | $249.9K |
| 8 | 769c38 | 9 | 8 | 1 | 88.9% | +6.20 | +68.9% | $59.2K |
| 9 | 7f00bc | 15 | 10 | 5 | 66.7% | +8.67 | +57.8% | $11.2K |
| 10 | 92df91 | 18 | 12 | 6 | 66.7% | +8.57 | +47.6% | -$2.4K |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | fec67e | 2 | 2 | 0 | 100.0% | +2.84 | +142.0% | $13.1K |
| 2 | 8366f5 | 2 | 2 | 0 | 100.0% | +2.30 | +114.9% | $107.6K |
| 3 | 981187 | 5 | 5 | 0 | 100.0% | +5.03 | +100.6% | $30.3K |
| 4 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 5 | 30935c | 4 | 3 | 1 | 75.0% | +2.11 | +52.7% | $953 |
| 6 | e70853 | 7 | 5 | 2 | 71.4% | +3.17 | +45.2% | $2.2K |
| 7 | 6b853d | 7 | 5 | 2 | 71.4% | +2.02 | +28.9% | $8.4K |
| 8 | 7923c4 | 3 | 2 | 1 | 66.7% | +0.76 | +25.4% | $12.3K |
| 9 | fcc12b | 9 | 6 | 3 | 66.7% | +1.91 | +21.3% | -$95.8K |
| 10 | c5cea1 | 3 | 2 | 1 | 66.7% | +0.62 | +20.7% | $22.1K |

---
## §5. Proven-wallet roster growth & HC tracking

"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).

### §5a. Current proven-winner roster (snapshot)

Roster as of **2026-05-18** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 90 | 32 | 6 | 4 | **10** | 8 | 11.1% |
| NBA | 175 | 88 | 24 | 14 | **38** | 18 | 21.7% |
| NHL | 82 | 31 | 11 | 4 | **15** | 7 | 18.3% |
| **ALL** | **—** | **—** | **—** | **—** | **63** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 15 · 6 | 7 · 4 | 2 · 8 | +12 live |
| NBA | 41 · 24 | 16 · 14 | 19 · 18 | +19 live |
| NHL | 14 · 11 | 4 · 4 | 6 · 7 | +3 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-05-18.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +0 from 10 | +2 from 8 | +8 from 2 | +10 from 0 |
| NBA | -1 from 39 | +2 from 36 | +38 from 0 | +38 from 0 |
| NHL | +3 from 12 | +4 from 11 | +15 from 0 | +15 from 0 |

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
| MLB | 90 | 32 (36%) | 10 (31%) | 6 (60%) | **10** | edge (Eligible→Flat-OK) 69% |
| NBA | 175 | 88 (50%) | 38 (43%) | 24 (63%) | **38** | edge (Eligible→Flat-OK) 57% |
| NHL | 82 | 31 (38%) | 15 (48%) | 11 (73%) | **15** | sample (Seen→Eligible) 62% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 18 | 10 (55.6%) | 10 (55.6%) | 2 (11.1%) |
| MLB | 7-day | 33 | 20 (60.6%) | 20 (60.6%) | 3 (9.1%) |
| MLB | All-time | 87 | 44 (50.6%) | 43 (49.4%) | 5 (5.7%) |
| NBA | 3-day | 4 | 4 (100.0%) | 4 (100.0%) | 2 (50.0%) |
| NBA | 7-day | 11 | 9 (81.8%) | 8 (72.7%) | 4 (36.4%) |
| NBA | All-time | 94 | 55 (58.5%) | 48 (51.1%) | 19 (20.2%) |
| NHL | 3-day | 2 | 2 (100.0%) | 2 (100.0%) | 1 (50.0%) |
| NHL | 7-day | 4 | 4 (100.0%) | 4 (100.0%) | 1 (25.0%) |
| NHL | All-time | 26 | 11 (42.3%) | 10 (38.5%) | 2 (7.7%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 24 | 16 (66.7%) | 16 (66.7%) | 5 (20.8%) |
| 7-day | 48 | 33 (68.8%) | 32 (66.7%) | 8 (16.7%) |
| All-time | 207 | 110 (53.1%) | 101 (48.8%) | 26 (12.6%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...1fc6` | 1 | +1.30 | 7 | 105% |
| `...0232` | 1 | +0.91 | 7 | 93% |
| `...be00` | 1 | +0.87 | 11 | -8% |
| `...a240` | 1 | +0.87 | 7 | 83% |
| `...9373` | 1 | +0.87 | 0 | — |
| `...8d26` | 1 | +0.72 | 5 | -22% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...9a27` | 65 | 51% | -1.6% | 242 | 4% |
| `...fc82` | 14 | 50% | -1.7% | 48 | -24% |
| `...2f63` | 72 | 50% | -1.9% | 374 | -13% |
| `...9d74` | 16 | 50% | -2.1% | 39 | -10% |
| `...23c4` | 6 | 50% | -2.5% | 78 | -32% |
| `...afd2` | 22 | 50% | -2.7% | 41 | -1% |

#### NBA

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...bf5d` | 1 | +3.15 | 3 | 42% |
| `...ed41` | 1 | +3.15 | 3 | 3% |
| `...6b87` | 1 | +2.05 | 8 | -27% |
| `...9d74` | 1 | +0.93 | 20 | -48% |
| `...c556` | 1 | +0.93 | 3 | 42% |
| `...5c69` | 1 | +0.91 | 2 | 28% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...d814` | 8 | 50% | -0.5% | 45 | -19% |
| `...b33b` | 10 | 30% | -0.9% | 28 | -10% |
| `...65dd` | 6 | 50% | -2.4% | 17 | 27% |
| `...f5b0` | 20 | 50% | -3.7% | 57 | -28% |
| `...1fc6` | 4 | 50% | -3.7% | 9 | 17% |
| `...1eae` | 17 | 53% | -4.2% | 65 | 13% |

#### NHL

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...2e78` | 1 | +1.46 | 0 | — |
| `...017f` | 1 | +1.45 | 3 | 106% |
| `...5ad0` | 1 | +1.42 | 7 | 28% |
| `...32f2` | 1 | +1.40 | 0 | — |
| `...e0fd` | 1 | +1.20 | 3 | 124% |
| `...266e` | 1 | +1.05 | 0 | — |

**Just-under** (5)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...33ee` | 4 | 50% | -0.3% | 8 | -23% |
| `...618e` | 2 | 50% | -6.1% | 28 | 24% |
| `...68b3` | 4 | 50% | -8.5% | 11 | 57% |
| `...3782` | 2 | 50% | -9.0% | 20 | 27% |
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
| MLB | 4 | 4 | **14** | 22 | 63.6% |
| NBA | 17 | 19 | **21** | 57 | 36.8% |
| NHL | 5 | 6 | **7** | 18 | 38.9% |
| **ALL** | **26** | **29** | **42** | **97** | **43.3%** |

#### Pipeline freshness

- `sharp_action_positions` GRADED rows: **6732**
- `sharp_action_positions` PENDING rows: **123** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 5/12/2026, 5:34:36 AM ET — **10469 min · STALE** — check grade-sharp-actions workflow

**Alarms**: pending > 200 OR rebuild lag > 4h → cron is lagging or failing — check `gh run list --workflow="Grade Sharp Actions"`.

#### B-only roster — wallets currently promoted via Source B path only

Wallets here would have been EXCLUDED under v1 (Source-A-only). Top by Source-B bet count per sport. The 2-week re-eval (2026-05-24) will compare these wallets' realized lift against A-only and A+B cohorts.

**MLB** — 14 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...9a27` | CONFIRMED | 171 | +17.8% | +7.9% |
| `...1eae` | CONFIRMED | 32 | +4.3% | +0.1% |
| `...5143` | CONFIRMED | 31 | +17.9% | +19.7% |
| `...d6d2` | FLAT | 16 | +9.2% | -1.6% |
| `...0ff5` | FLAT | 13 | +1.8% | -23.5% |
| `...a9cc` | CONFIRMED | 8 | +6.3% | +0.3% |
| `...9d74` | CONFIRMED | 7 | +24.2% | +43.8% |
| `...aeeb` | CONFIRMED | 7 | +35.4% | +37.5% |
| `...2768` | CONFIRMED | 7 | +97.4% | +105.9% |
| `...35e3` | CONFIRMED | 6 | +29.9% | +35.5% |
| … | 4 more | | | |

**NBA** — 21 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...2f63` | CONFIRMED | 162 | +1.4% | +2.3% |
| `...1eae` | CONFIRMED | 59 | +5.3% | +14.3% |
| `...3782` | CONFIRMED | 47 | +18.5% | +13.3% |
| `...11a4` | CONFIRMED | 31 | +44.9% | +36.7% |
| `...935c` | FLAT | 29 | +62.5% | -22.6% |
| `...68b3` | CONFIRMED | 16 | +28.5% | +18.4% |
| `...1697` | CONFIRMED | 15 | +14.1% | +29.5% |
| `...abaf` | CONFIRMED | 15 | +38.8% | +14.6% |
| `...2db4` | CONFIRMED | 13 | +4.9% | +3.3% |
| `...89a0` | FLAT | 13 | +38.5% | -14.4% |
| … | 11 more | | | |

**NHL** — 7 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...3782` | CONFIRMED | 18 | +17.5% | +26.7% |
| `...df91` | FLAT | 17 | +9.2% | -15% |
| `...b33b` | CONFIRMED | 12 | +12% | +1.6% |
| `...23c4` | CONFIRMED | 10 | +19.9% | +27.4% |
| `...9ef0` | FLAT | 9 | +0.7% | -4.2% |
| `...68b3` | CONFIRMED | 9 | +20.6% | +63.3% |
| `...a9cc` | CONFIRMED | 7 | +49.5% | +46.9% |

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

Slate: **2026-05-18** · 27 bets · 16 distinct proven wallets · WR 44% · $ vol $776.2K · $ PnL $119.5K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...2f63` (CONFIRMED) | NBA | ML | Spurs @ Thunder | $101.2K | **W** | $202.4K |
| `...d96a` (FLAT) | NBA | ML | Spurs @ Thunder | $96.0K | **W** | $192.0K |
| `...23c4` (CONFIRMED) | NHL | TOTAL | Canadiens @ Sabres | $51.0K | **W** | $45.5K |
| `...64aa` (CONFIRMED) | MLB | ML | Toronto Blue Jays @ New York Yankees | $74.1K | **W** | $42.3K |
| `...2f63` (CONFIRMED) | NBA | TOTAL | Spurs @ Thunder | $12.6K | **W** | $12.4K |
| `...64aa` (CONFIRMED) | MLB | ML | Atlanta Braves @ Miami Marlins | $13.1K | **W** | $11.5K |
| `...2768` (CONFIRMED) | MLB | ML | Los Angeles Dodgers @ San Diego Padres | $6.9K | **W** | $9.0K |
| `...a240` (CONFIRMED) | NHL | TOTAL | Canadiens @ Sabres | $3.6K | **W** | $3.2K |
| `...9ef0` (FLAT) | NBA | TOTAL | Spurs @ Thunder | $3.1K | **W** | $3.1K |
| `...2f63` (CONFIRMED) | NBA | SPREAD | Spurs @ Thunder | $3.3K | **W** | $3.0K |
| `...3532` (FLAT) | NBA | SPREAD | Spurs @ Thunder | $2.5K | **W** | $2.3K |
| `...853d` (CONFIRMED) | NHL | TOTAL | Canadiens @ Sabres | $886 | **W** | $791 |
| `...9a27` (CONFIRMED) | NBA | TOTAL | Spurs @ Thunder | $734 | L | -$734 |
| `...03d4` (FLAT) | NBA | TOTAL | Spurs @ Thunder | $1.0K | L | -$1.0K |
| `...df91` (FLAT) | NHL | ML | Canadiens @ NHL Playoffs: Who Will Win Series? - Sabres | $3.3K | L | -$3.3K |
| `...9a27` (CONFIRMED) | NBA | SPREAD | Spurs @ Thunder | $6.2K | L | -$6.2K |
| `...aeeb` (CONFIRMED) | NBA | ML | Spurs @ Thunder | $6.5K | L | -$6.5K |
| `...64aa` (CONFIRMED) | MLB | ML | Cleveland Guardians @ Detroit Tigers | $8.5K | L | -$8.5K |
| `...9a27` (CONFIRMED) | NBA | ML | Spurs @ Thunder | $10.2K | L | -$10.2K |
| `...64aa` (CONFIRMED) | MLB | ML | Athletics @ Los Angeles Angels | $16.5K | L | -$16.5K |
| `...9ef0` (FLAT) | NBA | ML | Spurs @ Thunder | $23.1K | L | -$23.1K |
| `...8da5` (CONFIRMED) | NBA | TOTAL | Spurs @ Thunder | $23.6K | L | -$23.6K |
| `...23c4` (CONFIRMED) | NBA | SPREAD | Spurs @ Thunder | $28.1K | L | -$28.1K |
| `...abaf` (CONFIRMED) | NBA | SPREAD | Spurs @ Thunder | $37.5K | L | -$37.5K |
| `...23c4` (CONFIRMED) | NHL | ML | Canadiens @ NHL Playoffs: Who Will Win Series? - Sabres | $51.0K | L | -$51.0K |
| `...c12b` (CONFIRMED) | NHL | ML | Canadiens @ NHL Playoffs: Who Will Win Series? - Sabres | $91.1K | L | -$91.1K |
| `...3532` (FLAT) | NBA | ML | Spurs @ Thunder | $100.5K | L | -$100.5K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 5 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2768` | CONFIRMED | 7 | 71% | 2.3 | +3.52 | +50% | $64.0K | $31.5K | +49% | 1W |
| 2 | `...64aa` | CONFIRMED | 16 | 56% | 5.3 | +1.32 | +8% | $283.2K | $27.8K | +10% | 1W |
| 3 | `...0ff5` | FLAT | 5 | 80% | 2.5 | +2.68 | +54% | $25.6K | $14.9K | +58% | 1W |
| 4 | `...abaf` | CONFIRMED | 3 | 67% | 1.5 | +0.92 | +31% | $62.7K | $14.1K | +22% | 2W |
| 5 | `...135d` | CONFIRMED | 3 | 33% | 1.5 | -1.02 | -34% | $5.8K | -$282 | -5% | 1L |

**NBA** — 16 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2f63` | CONFIRMED | 6 | 83% | 3.0 | +5.42 | +90% | $143.2K | $250.7K | +175% | 4W |
| 2 | `...abaf` | CONFIRMED | 3 | 67% | 1.5 | +1.58 | +53% | $134.9K | $80.9K | +60% | 1L |
| 3 | `...9a27` | CONFIRMED | 5 | 20% | 2.5 | -3.02 | -60% | $121.2K | $8.6K | +7% | 4L |
| 4 | `...e8f1` | FLAT | 1 | 100% | 1.0 | +1.60 | +160% | $1.4K | $2.3K | +160% | 1W |
| 5 | `...df91` | FLAT | 1 | 100% | 1.0 | +1.60 | +160% | $246 | $394 | +160% | 1W |
| 6 | `...853d` | CONFIRMED | 2 | 50% | 2.0 | -0.02 | -1% | $1.4K | $273 | +19% | 1L |
| 7 | `...03d4` | FLAT | 3 | 33% | 1.5 | -1.02 | -34% | $9.2K | -$2.9K | -31% | 2L |
| 8 | `...9c38` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $3.7K | -$3.7K | -100% | 1L |
| 9 | `...00bc` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $4.5K | -$4.5K | -100% | 1L |
| 10 | `...aeeb` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $6.5K | -$6.5K | -100% | 1L |
| 11 | `...9ef0` | FLAT | 3 | 67% | 1.5 | +0.96 | +32% | $33.9K | -$12.6K | -37% | 1W |
| 12 | `...8da5` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $23.6K | -$23.6K | -100% | 1L |
| 13 | `...66f5` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $36.5K | -$36.5K | -100% | 1L |
| 14 | `...23c4` | CONFIRMED | 2 | 0% | 1.0 | -2.00 | -100% | $40.1K | -$40.1K | -100% | 2L |
| 15 | `...d96a` | FLAT | 2 | 50% | 1.0 | +1.00 | +50% | $343.9K | -$56.0K | -16% | 1W |

**NHL** — 8 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...66f5` | FLAT | 1 | 100% | 1.0 | +1.42 | +142% | $70.9K | $100.6K | +142% | 1W |
| 2 | `...a240` | CONFIRMED | 2 | 100% | 0.7 | +2.31 | +116% | $5.8K | $6.4K | +110% | 2W |
| 3 | `...c67e` | CONFIRMED | 1 | 100% | 1.0 | +1.42 | +142% | $3.2K | $4.6K | +142% | 1W |
| 4 | `...df91` | FLAT | 2 | 50% | 0.7 | +0.42 | +21% | $6.5K | $1.4K | +21% | 1L |
| 5 | `...853d` | CONFIRMED | 1 | 100% | 1.0 | +0.89 | +89% | $886 | $791 | +89% | 1W |
| 6 | `...3532` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $2.0K | -$2.0K | -100% | 1L |
| 7 | `...23c4` | CONFIRMED | 2 | 50% | 2.0 | -0.11 | -5% | $102.0K | -$5.5K | -5% | 1W |
| 8 | `...c12b` | CONFIRMED | 2 | 0% | 0.7 | -2.00 | -100% | $165.9K | -$165.9K | -100% | 2L |

#### §6b-2. 7-day

**MLB** — 8 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...5143` | CONFIRMED | 1 | 100% | 1.0 | +1.04 | +104% | $63.3K | $65.9K | +104% | 1W |
| 2 | `...64aa` | CONFIRMED | 25 | 56% | 3.6 | +1.25 | +5% | $472.1K | $46.6K | +10% | 1W |
| 3 | `...135d` | CONFIRMED | 8 | 50% | 1.6 | +0.55 | +7% | $27.1K | $21.9K | +81% | 1L |
| 4 | `...abaf` | CONFIRMED | 3 | 67% | 1.5 | +0.92 | +31% | $62.7K | $14.1K | +22% | 2W |
| 5 | `...2768` | CONFIRMED | 9 | 56% | 2.3 | +1.52 | +17% | $84.0K | $11.5K | +14% | 1W |
| 6 | `...c926` | FLAT | 3 | 67% | 1.0 | +1.29 | +43% | $12.7K | $7.3K | +58% | 1L |
| 7 | `...68b3` | CONFIRMED | 1 | 100% | 1.0 | +1.04 | +104% | $3.8K | $4.0K | +104% | 1W |
| 8 | `...0ff5` | FLAT | 11 | 55% | 1.8 | +0.66 | +6% | $82.5K | -$7.5K | -9% | 1W |

**NBA** — 22 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 3 | 100% | 1.0 | +2.53 | +84% | $263.3K | $298.3K | +113% | 3W |
| 2 | `...2f63` | CONFIRMED | 17 | 76% | 2.4 | +9.42 | +55% | $269.8K | $201.7K | +75% | 4W |
| 3 | `...abaf` | CONFIRMED | 4 | 75% | 0.7 | +2.45 | +61% | $146.3K | $90.8K | +62% | 1L |
| 4 | `...e8f1` | FLAT | 2 | 100% | 0.7 | +2.04 | +102% | $97.8K | $45.1K | +46% | 2W |
| 5 | `...0853` | CONFIRMED | 1 | 100% | 1.0 | +0.87 | +87% | $13.0K | $11.3K | +87% | 1W |
| 6 | `...03d4` | FLAT | 8 | 63% | 1.1 | +1.06 | +13% | $27.8K | $4.2K | +15% | 2L |
| 7 | `...853d` | CONFIRMED | 4 | 50% | 0.7 | -0.76 | -19% | $20.2K | $2.3K | +11% | 1L |
| 8 | `...df91` | FLAT | 5 | 100% | 0.8 | +4.40 | +88% | $1.6K | $1.2K | +77% | 5W |
| 9 | `...9953` | CONFIRMED | 1 | 100% | 1.0 | +0.26 | +26% | $3.8K | $1.0K | +26% | 1W |
| 10 | `...00bc` | CONFIRMED | 2 | 50% | 0.7 | +0.50 | +25% | $7.5K | $60 | +1% | 1L |
| 11 | `...0329` | CONFIRMED | 2 | 0% | 0.5 | -2.00 | -100% | $1.7K | -$1.7K | -100% | 2L |
| 12 | `...9c38` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $3.7K | -$3.7K | -100% | 1L |
| 13 | `...d49f` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $6.0K | -$6.0K | -100% | 1L |
| 14 | `...9ef0` | FLAT | 8 | 63% | 1.1 | +1.89 | +24% | $59.6K | -$10.0K | -17% | 1W |
| 15 | `...66f5` | FLAT | 5 | 40% | 0.8 | -1.06 | -21% | $121.0K | -$12.4K | -10% | 1L |

**NHL** — 8 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...66f5` | FLAT | 2 | 100% | 0.7 | +2.30 | +115% | $78.8K | $107.6K | +137% | 2W |
| 2 | `...a240` | CONFIRMED | 4 | 75% | 0.8 | +2.19 | +55% | $15.3K | $8.3K | +54% | 3W |
| 3 | `...c67e` | CONFIRMED | 1 | 100% | 1.0 | +1.42 | +142% | $3.2K | $4.6K | +142% | 1W |
| 4 | `...df91` | FLAT | 4 | 75% | 0.6 | +1.92 | +48% | $7.1K | $1.8K | +25% | 1L |
| 5 | `...853d` | CONFIRMED | 1 | 100% | 1.0 | +0.89 | +89% | $886 | $791 | +89% | 1W |
| 6 | `...23c4` | CONFIRMED | 2 | 50% | 2.0 | -0.11 | -5% | $102.0K | -$5.5K | -5% | 1W |
| 7 | `...3532` | FLAT | 2 | 0% | 0.4 | -2.00 | -100% | $20.5K | -$20.5K | -100% | 2L |
| 8 | `...c12b` | CONFIRMED | 3 | 33% | 0.4 | -1.38 | -46% | $255.9K | -$109.7K | -43% | 2L |

#### §6b-3. All-time

**MLB** — 10 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...64aa` | CONFIRMED | 65 | 57% | 2.2 | +3.86 | +6% | $1.16M | $28.9K | +2% | 1W |
| 2 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 3 | `...135d` | CONFIRMED | 8 | 50% | 1.6 | +0.55 | +7% | $27.1K | $21.9K | +81% | 1L |
| 4 | `...2768` | CONFIRMED | 10 | 60% | 1.3 | +2.51 | +25% | $94.0K | $21.4K | +23% | 1W |
| 5 | `...abaf` | CONFIRMED | 3 | 67% | 1.5 | +0.92 | +31% | $62.7K | $14.1K | +22% | 2W |
| 6 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 7 | `...c926` | FLAT | 4 | 50% | 0.3 | +0.29 | +7% | $14.1K | $6.0K | +42% | 1L |
| 8 | `...68b3` | CONFIRMED | 3 | 67% | 0.2 | +1.16 | +39% | $3.9K | $4.0K | +104% | 1W |
| 9 | `...89a0` | FLAT | 3 | 100% | 0.4 | +2.87 | +96% | $1.6K | $1.5K | +95% | 3W |
| 10 | `...0ff5` | FLAT | 11 | 55% | 1.8 | +0.66 | +6% | $82.5K | -$7.5K | -9% | 1W |

**NBA** — 38 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...9a27` | CONFIRMED | 69 | 64% | 2.8 | +10.79 | +16% | $1.93M | $519.1K | +27% | 4L |
| 2 | `...2ca8` | CONFIRMED | 17 | 65% | 0.6 | +6.52 | +38% | $728.0K | $401.4K | +55% | 3W |
| 3 | `...b032` | CONFIRMED | 7 | 86% | 0.7 | +5.40 | +77% | $244.0K | $249.9K | +102% | 3W |
| 4 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +5.66 | +283% | $141.8K | $241.7K | +170% | 2W |
| 5 | `...23c4` | CONFIRMED | 15 | 67% | 0.6 | +4.37 | +29% | $530.9K | $222.9K | +42% | 2L |
| 6 | `...aeeb` | CONFIRMED | 48 | 58% | 1.6 | +7.29 | +15% | $869.0K | $171.4K | +20% | 2L |
| 7 | `...32f2` | CONFIRMED | 7 | 43% | 0.4 | +0.99 | +14% | $126.8K | $134.2K | +106% | 1L |
| 8 | `...e8f1` | FLAT | 16 | 44% | 0.6 | +2.53 | +16% | $564.8K | $128.7K | +23% | 2W |
| 9 | `...8da5` | CONFIRMED | 10 | 80% | 0.4 | +8.06 | +81% | $205.7K | $120.4K | +59% | 1L |
| 10 | `...02c3` | CONFIRMED | 6 | 33% | 0.9 | +0.75 | +13% | $681.1K | $104.0K | +15% | 3L |
| 11 | `...5143` | FLAT | 12 | 67% | 0.6 | +4.27 | +36% | $754.5K | $101.3K | +13% | 1W |
| 12 | `...abaf` | CONFIRMED | 7 | 57% | 0.9 | +1.05 | +15% | $193.3K | $82.3K | +43% | 1L |
| 13 | `...b814` | CONFIRMED | 3 | 100% | 0.4 | +0.56 | +19% | $431.9K | $81.3K | +19% | 3W |
| 14 | `...2f63` | CONFIRMED | 74 | 51% | 3.1 | +4.42 | +6% | $923.9K | $75.1K | +8% | 4W |
| 15 | `...1a56` | CONFIRMED | 5 | 100% | 0.4 | +6.44 | +129% | $53.3K | $74.8K | +140% | 5W |

**NHL** — 15 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...192c` | FLAT | 6 | 50% | 0.5 | +0.80 | +13% | $166.9K | $136.2K | +82% | 2L |
| 2 | `...66f5` | FLAT | 2 | 100% | 0.7 | +2.30 | +115% | $78.8K | $107.6K | +137% | 2W |
| 3 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +1.88 | +94% | $88.2K | $46.9K | +53% | 2W |
| 4 | `...1187` | CONFIRMED | 5 | 100% | 2.5 | +5.03 | +101% | $38.0K | $30.3K | +80% | 5W |
| 5 | `...cea1` | CONFIRMED | 3 | 67% | 0.4 | +0.62 | +21% | $27.7K | $22.1K | +80% | 1W |
| 6 | `...c67e` | CONFIRMED | 2 | 100% | 0.1 | +2.84 | +142% | $9.2K | $13.1K | +142% | 2W |
| 7 | `...a240` | CONFIRMED | 21 | 62% | 0.7 | +3.88 | +18% | $71.8K | $12.4K | +17% | 3W |
| 8 | `...23c4` | CONFIRMED | 3 | 67% | 0.1 | +0.76 | +25% | $122.5K | $12.3K | +10% | 1W |
| 9 | `...853d` | CONFIRMED | 7 | 71% | 0.2 | +2.02 | +29% | $30.0K | $8.4K | +28% | 1W |
| 10 | `...afd2` | CONFIRMED | 2 | 50% | 1.0 | +0.40 | +20% | $18.2K | $4.9K | +27% | 1W |
| 11 | `...0853` | CONFIRMED | 7 | 71% | 0.8 | +3.17 | +45% | $132.6K | $2.2K | +2% | 2W |
| 12 | `...935c` | CONFIRMED | 4 | 75% | 1.0 | +2.11 | +53% | $1.3K | $953 | +74% | 3W |
| 13 | `...df91` | FLAT | 9 | 56% | 0.4 | +0.55 | +6% | $16.0K | -$4.8K | -30% | 1L |
| 14 | `...3532` | FLAT | 12 | 50% | 0.5 | +1.68 | +14% | $172.8K | -$36.0K | -21% | 3L |
| 15 | `...c12b` | CONFIRMED | 9 | 67% | 0.3 | +1.91 | +21% | $451.4K | -$95.8K | -21% | 2L |

### §6c. Active streaks (≥3 in a row, last bet within 3 days)

Proven `(wallet × sport)` pairs currently riding a 3-or-more-bet run with their most recent bet inside the last 3 calendar days. Hot-hand monitor — and the same surface for cold streaks worth fading.

| Wallet | Sport | Tier | Streak | Last bet | All-time bets | WR% | $ PnL | $ ROI |
|---|---|---|---|---|---|---|---|---|
| `...df91` | NBA | FLAT | **7W** | 2026-05-17 | 18 | 67% | -$2.4K | -16% |
| `...0329` | NBA | CONFIRMED | **5L** | 2026-05-15 | 9 | 44% | $15.3K | +76% |
| `...9a27` | NBA | CONFIRMED | **4L** | 2026-05-18 | 69 | 64% | $519.1K | +27% |
| `...2f63` | NBA | CONFIRMED | **4W** | 2026-05-18 | 74 | 51% | $75.1K | +8% |
| `...2ca8` | NBA | CONFIRMED | **3W** | 2026-05-15 | 17 | 65% | $401.4K | +55% |
| `...a240` | NHL | CONFIRMED | **3W** | 2026-05-18 | 21 | 62% | $12.4K | +17% |
| `...3532` | NHL | FLAT | **3L** | 2026-05-16 | 12 | 50% | -$36.0K | -21% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-05-05 | 24 · $1.05M · -$397.3K | 3 · $54.3K · -$23.6K | 21 · $992.0K · -$373.7K | — |
| 2026-05-06 | 17 · $275.9K · $70.7K | 1 · $33.0K · $31.7K | 15 · $224.5K · $12.9K | 1 · $18.4K · $26.0K |
| 2026-05-07 | 5 · $77.3K · $29.5K | — | 5 · $77.3K · $29.5K | — |
| 2026-05-08 | 21 · $314.4K · $6.6K | — | 18 · $291.7K · $27.4K | 3 · $22.7K · -$20.8K |
| 2026-05-09 | 17 · $544.9K · -$7.8K | — | 17 · $544.9K · -$7.8K | — |
| 2026-05-10 | 24 · $741.5K · $578.8K | — | 21 · $677.2K · $605.8K | 3 · $64.3K · -$27.1K |
| 2026-05-11 | 24 · $429.5K · -$67.0K | 1 · $10.0K · $9.9K | 21 · $404.7K · -$62.1K | 2 · $14.8K · -$14.8K |
| 2026-05-12 | 29 · $396.3K · -$1.4K | 7 · $118.2K · $24.5K | 19 · $169.4K · -$63.9K | 3 · $108.7K · $38.0K |
| 2026-05-13 | 23 · $546.9K · -$112.1K | 7 · $84.1K · $8.2K | 16 · $462.7K · -$120.3K | — |
| 2026-05-14 | 9 · $76.2K · $25.1K | 5 · $58.6K · $16.1K | — | 4 · $17.6K · $9.0K |
| 2026-05-15 | 44 · $819.0K · $195.6K | 8 · $106.1K · $27.0K | 36 · $712.9K · $168.6K | — |
| 2026-05-16 | 17 · $263.5K · $32.9K | 11 · $107.1K · -$3.3K | — | 6 · $156.4K · $36.3K |
| 2026-05-17 | 39 · $795.2K · -$24.1K | 18 · $215.2K · $53.5K | 21 · $580.0K · -$77.6K | — |
| 2026-05-18 | 27 · $776.2K · $119.5K | 5 · $119.1K · $37.7K | 16 · $456.2K · $177.7K | 6 · $200.9K · -$95.9K |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-05-18_
