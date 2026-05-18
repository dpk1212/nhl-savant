# Sharp Intel v6 — Daily Master Report

_Auto-generated **5/18/2026, 12:13:02 PM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (181 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-05-17** · 9 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 9 | 5-4-0 | 55.6% | -1.34u | +1.02u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Arizona Diamondbacks @ Colorado Rockies | Arizona Diamondbacks | 4.0★ · 2.75u | +0 | +1 | +1 | +2 | -148 | **W** | +1.94u |
| MLB | ML | Miami Marlins @ Tampa Bay Rays | Miami Marlins | 2.5★ · 0.50u | +1 | +0 | +2 | +2 | +139 | L | -0.50u |
| MLB | ML | Milwaukee Brewers @ Minnesota Twins | Milwaukee Brewers | 5.0★ · 5.00u | +1 | +3 | +2 | +5 | -129 | L | -5.00u |
| MLB | ML | New York Yankees @ New York Mets | New York Mets | 4.0★ · 2.75u | +1 | +3 | +2 | +5 | -114 | **W** | +2.41u |
| MLB | TOTAL | New York Yankees @ New York Mets | Over 8.5 | 4.5★ · 2.25u | +1 | +2 | +3 | +5 | -110 | **W** | +1.99u |
| MLB | TOTAL | Philadelphia Phillies @ Pittsburgh Pirates | Over 7.5 | 5.0★ · 2.50u | +2 | +2 | +1 | +3 | +107 | L | -2.50u |
| MLB | TOTAL | San Francisco Giants @ Athletics | Under 11.5 | 2.5★ · 0.30u | +1 | +0 | +0 | +0 | -110 | **W** | +0.27u |
| NBA | ML | Cavaliers @ Pistons | Cavaliers | 3.0★ · 1.25u | +1 | +3 | +4 | +7 | +165 | **W** | +0.80u |
| NBA | TOTAL | Cavaliers @ Pistons | Under 205.5 | 5.0★ · 0.75u | +3 | +2 | -2 | +0 | -110 | L | -0.75u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **23** shipped · 13-10-0 · WR 56.5% · PnL -1.29u (peak) / +2.70u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 23)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 1 | 0-1-0 | 0.0% | -0.75u | -1.00u |
| HC = +2 | 2 | 1-1-0 | 50.0% | +0.25u | +0.15u |
| HC = +1 | 13 | 8-5-0 | 61.5% | -0.88u | +3.42u |
| HC = 0 | 7 | 4-3-0 | 57.1% | +0.09u | +0.14u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 6 | 5-1-0 | 83.3% | +3.09u | +5.37u |
| +2 | 7 | 3-4-0 | 42.9% | -3.22u | -2.05u |
| +1 | 5 | 4-1-0 | 80.0% | +3.57u | +2.47u |
| 0 | 5 | 1-4-0 | 20.0% | -4.73u | -3.09u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 6 | 5-1-0 | 83.3% | +5.81u | +5.07u |
| +2 | 5 | 2-3-0 | 40.0% | -5.10u | -1.14u |
| +1 | 7 | 5-2-0 | 71.4% | +3.88u | +1.87u |
| 0 | 3 | 1-2-0 | 33.3% | -2.63u | -1.09u |
| ≤ −2 | 2 | 0-2-0 | 0.0% | -3.25u | -2.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 23)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| LOCK   (+5 .. +7) | 1 | 0-1-0 | 0.0% | -2.50u | -1.00u |
| STRONG (+3 .. +5) | 2 | 2-0-0 | 100.0% | +3.24u | +1.38u |
| NEUT   (0 .. +3) | 11 | 5-6-0 | 45.5% | -4.23u | -1.49u |
| WEAK   (−1 .. 0) | 4 | 3-1-0 | 75.0% | +1.32u | +3.01u |
| FADE   (< −1) | 5 | 3-2-0 | 60.0% | +0.88u | +0.80u |

### §2b. 7-day

Total: **43** shipped · 20-23-0 · WR 46.5% · PnL -22.22u (peak) / -4.07u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 43)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 0-2-0 | 0.0% | -4.25u | -2.00u |
| HC = +2 | 5 | 2-3-0 | 40.0% | -1.82u | -0.86u |
| HC = +1 | 23 | 14-9-0 | 60.9% | +1.28u | +4.65u |
| HC = 0 | 13 | 4-9-0 | 30.8% | -17.43u | -5.86u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 15 | 6-9-0 | 40.0% | -23.48u | -1.64u |
| +2 | 10 | 3-7-0 | 30.0% | -6.38u | -5.05u |
| +1 | 12 | 9-3-0 | 75.0% | +10.66u | +4.83u |
| 0 | 6 | 2-4-0 | 33.3% | -3.02u | -2.21u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 16 | 8-8-0 | 50.0% | -9.44u | +0.72u |
| +2 | 7 | 2-5-0 | 28.6% | -13.10u | -3.14u |
| +1 | 11 | 6-5-0 | 54.5% | +0.87u | -0.14u |
| 0 | 4 | 1-3-0 | 25.0% | -4.63u | -2.09u |
| −1 | 3 | 3-0-0 | 100.0% | +7.33u | +2.58u |
| ≤ −2 | 2 | 0-2-0 | 0.0% | -3.25u | -2.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 43)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| LOCK   (+5 .. +7) | 2 | 0-2-0 | 0.0% | -6.00u | -2.00u |
| STRONG (+3 .. +5) | 9 | 6-3-0 | 66.7% | -1.55u | +1.83u |
| NEUT   (0 .. +3) | 22 | 8-14-0 | 36.4% | -14.87u | -6.71u |
| WEAK   (−1 .. 0) | 5 | 3-2-0 | 60.0% | -0.68u | +2.01u |
| FADE   (< −1) | 5 | 3-2-0 | 60.0% | +0.88u | +0.80u |

### §2c. All-time

Total: **204** shipped · 98-104-2 · WR 48.5% · PnL -27.59u (peak) / -7.25u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 93)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 0-2-0 | 0.0% | -4.25u | -2.00u |
| HC = +2 | 9 | 5-4-0 | 55.6% | +3.68u | +0.97u |
| HC = +1 | 55 | 32-23-0 | 58.2% | +2.19u | +8.89u |
| HC = 0 | 24 | 10-13-1 | 43.5% | -15.11u | -4.32u |
| HC ≤ −1 | 2 | 0-2-0 | 0.0% | -3.50u | -2.00u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 43 | 26-17-0 | 60.5% | +1.63u | +13.24u |
| +2 | 47 | 18-29-0 | 38.3% | -21.98u | -11.01u |
| +1 | 66 | 38-27-1 | 58.5% | +11.33u | +7.58u |
| 0 | 34 | 11-22-1 | 33.3% | -16.46u | -11.96u |
| −1 | 7 | 1-6-0 | 14.3% | -5.60u | -4.94u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 74 | 36-36-2 | 50.0% | -14.99u | +1.80u |
| +2 | 49 | 22-27-0 | 44.9% | -18.85u | -4.42u |
| +1 | 49 | 25-24-0 | 51.0% | +2.84u | -1.76u |
| 0 | 18 | 6-12-0 | 33.3% | -5.22u | -5.14u |
| −1 | 4 | 4-0-0 | 100.0% | +8.96u | +3.55u |
| ≤ −2 | 4 | 1-3-0 | 25.0% | -3.57u | -2.04u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 68)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 1 | 1-0-0 | 100.0% | +3.18u | +0.95u |
| LOCK   (+5 .. +7) | 7 | 4-3-0 | 57.1% | -1.82u | +0.14u |
| STRONG (+3 .. +5) | 16 | 12-4-0 | 75.0% | +6.83u | +6.86u |
| NEUT   (0 .. +3) | 31 | 11-20-0 | 35.5% | -21.44u | -9.32u |
| WEAK   (−1 .. 0) | 5 | 3-2-0 | 60.0% | -0.68u | +2.01u |
| FADE   (< −1) | 7 | 4-3-0 | 57.1% | +1.89u | +1.14u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36]
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

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 51 | 32 | 11 | 34% | 18 | 4 | 1 |
| NBA | 120 | 88 | 40 | 45% | 50 | 27 | 13 |
| NHL | 46 | 30 | 14 | 47% | 21 | 11 | 7 |
| **ALL (any sport)** | **141** | **105** | **46** | **44%** | **59** | **28** | **13** |

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

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | c289a0 | 3 | 3 | 0 | 100.0% | +2.87 | +95.6% | $1.5K |
| 2 | c668b3 | 3 | 2 | 1 | 66.7% | +1.16 | +38.7% | $4.0K |
| 3 | eeabaf | 3 | 2 | 1 | 66.7% | +0.92 | +30.6% | $14.1K |
| 4 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 5 | 972768 | 9 | 5 | 4 | 55.6% | +1.21 | +13.5% | $12.4K |
| 6 | 8ec926 | 4 | 2 | 2 | 50.0% | +0.29 | +7.2% | $6.0K |
| 7 | 4c64aa | 61 | 35 | 26 | 57.4% | +4.41 | +7.2% | $157 |
| 8 | 70135d | 8 | 4 | 4 | 50.0% | +0.55 | +6.9% | $21.9K |
| 9 | a10ff5 | 11 | 6 | 5 | 54.5% | +0.66 | +6.0% | -$7.5K |
| 10 | 0f9d74 | 15 | 8 | 7 | 53.3% | +0.66 | +4.4% | $4.0K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | b51a56 | 5 | 5 | 0 | 100.0% | +6.44 | +128.9% | $74.8K |
| 3 | 4a9953 | 2 | 2 | 0 | 100.0% | +2.16 | +108.2% | $3.7K |
| 4 | 2e8da5 | 9 | 8 | 1 | 88.9% | +9.06 | +100.7% | $144.0K |
| 5 | 8ec926 | 5 | 5 | 0 | 100.0% | +4.60 | +92.0% | $8.5K |
| 6 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 7 | 11b032 | 7 | 6 | 1 | 85.7% | +5.40 | +77.1% | $249.9K |
| 8 | 769c38 | 9 | 8 | 1 | 88.9% | +6.20 | +68.9% | $59.2K |
| 9 | 7f00bc | 15 | 10 | 5 | 66.7% | +8.67 | +57.8% | $11.2K |
| 10 | 7703d4 | 13 | 11 | 2 | 84.6% | +7.19 | +55.3% | $30.9K |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | fec67e | 2 | 2 | 0 | 100.0% | +2.84 | +142.0% | $13.1K |
| 2 | 8366f5 | 2 | 2 | 0 | 100.0% | +2.30 | +114.9% | $107.6K |
| 3 | 981187 | 5 | 5 | 0 | 100.0% | +5.03 | +100.6% | $30.3K |
| 4 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 5 | 30935c | 4 | 3 | 1 | 75.0% | +2.11 | +52.7% | $953 |
| 6 | e70853 | 7 | 5 | 2 | 71.4% | +3.17 | +45.2% | $2.2K |
| 7 | fcc12b | 8 | 6 | 2 | 75.0% | +2.91 | +36.4% | -$4.6K |
| 8 | c5cea1 | 3 | 2 | 1 | 66.7% | +0.62 | +20.7% | $22.1K |
| 9 | dcafd2 | 2 | 1 | 1 | 50.0% | +0.40 | +20.0% | $4.9K |
| 10 | 92df91 | 8 | 5 | 3 | 62.5% | +1.55 | +19.4% | -$1.5K |

---
## §5. Proven-wallet roster growth & HC tracking

"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).

### §5a. Current proven-winner roster (snapshot)

Roster as of **2026-05-17** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 89 | 32 | 6 | 5 | **11** | 7 | 12.4% |
| NBA | 169 | 88 | 25 | 15 | **40** | 17 | 23.7% |
| NHL | 78 | 30 | 10 | 4 | **14** | 7 | 17.9% |
| **ALL** | **—** | **—** | **—** | **—** | **65** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 15 · 6 | 7 · 5 | 2 · 7 | +11 live |
| NBA | 41 · 25 | 16 · 15 | 19 · 17 | +17 live |
| NHL | 14 · 10 | 4 · 4 | 6 · 7 | +4 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-05-17.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +0 from 11 | +3 from 8 | +11 from 0 | +11 from 0 |
| NBA | +3 from 37 | +5 from 35 | +40 from 0 | +40 from 0 |
| NHL | +2 from 12 | +3 from 11 | +14 from 0 | +14 from 0 |

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
| MLB | 89 | 32 (36%) | 11 (34%) | 6 (55%) | **11** | edge (Eligible→Flat-OK) 66% |
| NBA | 169 | 88 (52%) | 40 (45%) | 25 (63%) | **40** | edge (Eligible→Flat-OK) 55% |
| NHL | 78 | 30 (38%) | 14 (47%) | 10 (71%) | **14** | sample (Seen→Eligible) 62% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 17 | 12 (70.6%) | 12 (70.6%) | 2 (11.8%) |
| MLB | 7-day | 30 | 21 (70.0%) | 21 (70.0%) | 3 (10.0%) |
| MLB | All-time | 82 | 43 (52.4%) | 42 (51.2%) | 5 (6.1%) |
| NBA | 3-day | 6 | 4 (66.7%) | 4 (66.7%) | 1 (16.7%) |
| NBA | 7-day | 10 | 8 (80.0%) | 7 (70.0%) | 4 (40.0%) |
| NBA | All-time | 92 | 53 (57.6%) | 46 (50.0%) | 18 (19.6%) |
| NHL | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NHL | 7-day | 3 | 2 (66.7%) | 2 (66.7%) | 0 (0.0%) |
| NHL | All-time | 24 | 9 (37.5%) | 8 (33.3%) | 1 (4.2%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 23 | 16 (69.6%) | 16 (69.6%) | 3 (13.0%) |
| 7-day | 43 | 31 (72.1%) | 30 (69.8%) | 7 (16.3%) |
| All-time | 198 | 105 (53.0%) | 96 (48.5%) | 24 (12.1%) |

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
| `...9a27` | 59 | 51% | -1.2% | 234 | 5% |
| `...fc82` | 14 | 50% | -1.7% | 48 | -24% |
| `...2f63` | 72 | 50% | -1.9% | 337 | -6% |
| `...afd2` | 20 | 50% | -2.4% | 39 | 0% |
| `...23c4` | 6 | 50% | -2.5% | 74 | -31% |
| `...c12b` | 32 | 50% | -2.5% | 67 | -19% |

#### NBA

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...bf5d` | 1 | +3.15 | 3 | 42% |
| `...ed41` | 1 | +3.15 | 3 | 3% |
| `...6b87` | 1 | +2.05 | 8 | -27% |
| `...9d74` | 1 | +0.93 | 18 | -67% |
| `...c556` | 1 | +0.93 | 3 | 42% |
| `...5c69` | 1 | +0.91 | 2 | 28% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...d814` | 8 | 50% | -0.5% | 45 | -19% |
| `...f5b0` | 20 | 50% | -3.7% | 57 | -28% |
| `...1fc6` | 4 | 50% | -3.7% | 9 | 17% |
| `...1f17` | 2 | 50% | -4.5% | 3 | -5% |
| `...4582` | 2 | 50% | -6.5% | 2 | -2% |
| `...935c` | 9 | 44% | -9.0% | 50 | -21% |

#### NHL

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...2e78` | 1 | +1.46 | 0 | — |
| `...017f` | 1 | +1.45 | 3 | 106% |
| `...5ad0` | 1 | +1.42 | 6 | 13% |
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

- `sharp_action_positions` GRADED rows: **6353**
- `sharp_action_positions` PENDING rows: **183** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 5/12/2026, 5:34:36 AM ET — **9038 min · STALE** — check grade-sharp-actions workflow

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

Slate: **2026-05-17** · 44 bets · 19 distinct proven wallets · WR 57% · $ vol $803.4K · $ PnL -$24.5K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...9a27` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Pistons | $65.5K | **W** | $64.3K |
| `...abaf` (CONFIRMED) | NBA | ML | Cavaliers @ Pistons | $37.0K | **W** | $59.2K |
| `...abaf` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Pistons | $60.4K | **W** | $59.2K |
| `...2f63` (FLAT) | NBA | ML | Cavaliers @ Pistons | $22.0K | **W** | $35.2K |
| `...3532` (FLAT) | NBA | ML | Cavaliers @ Pistons | $21.6K | **W** | $34.6K |
| `...64aa` (CONFIRMED) | MLB | ML | Kansas City Royals @ St. Louis Cardinals | $38.9K | **W** | $32.4K |
| `...abaf` (CONFIRMED) | MLB | ML | New York Yankees @ New York Mets | $26.5K | **W** | $24.1K |
| `...64aa` (CONFIRMED) | MLB | ML | Miami Marlins @ Tampa Bay Rays | $12.4K | **W** | $16.7K |
| `...abaf` (CONFIRMED) | MLB | TOTAL | Los Angeles Dodgers @ Los Angeles Angels | $13.0K | **W** | $13.2K |
| `...64aa` (CONFIRMED) | MLB | ML | Texas Rangers @ Houston Astros | $15.6K | **W** | $12.6K |
| `...64aa` (CONFIRMED) | MLB | ML | Arizona Diamondbacks @ Colorado Rockies | $17.4K | **W** | $12.3K |
| `...9ef0` (FLAT) | NBA | SPREAD | Cavaliers @ Pistons | $7.6K | **W** | $7.4K |
| `...3532` (FLAT) | NBA | TOTAL | Cavaliers @ Pistons | $7.4K | **W** | $6.9K |
| `...2768` (CONFIRMED) | MLB | ML | New York Yankees @ New York Mets | $6.7K | **W** | $6.1K |
| `...0ff5` (FLAT) | MLB | ML | New York Yankees @ New York Mets | $4.7K | **W** | $4.3K |
| `...64aa` (CONFIRMED) | MLB | ML | San Diego Padres @ Seattle Mariners | $2.7K | **W** | $3.4K |
| `...03d4` (FLAT) | NBA | SPREAD | Cavaliers @ Pistons | $3.2K | **W** | $3.2K |
| `...9d74` (FLAT) | MLB | ML | Los Angeles Dodgers @ Los Angeles Angels | $2.0K | **W** | $2.5K |
| `...e8f1` (FLAT) | NBA | ML | Cavaliers @ Pistons | $1.4K | **W** | $2.3K |
| `...64aa` (CONFIRMED) | MLB | ML | Baltimore Orioles @ Washington Nationals | $1.7K | **W** | $1.4K |
| `...9d74` (FLAT) | MLB | ML | Boston Red Sox @ Atlanta Braves | $2.0K | **W** | $1.4K |
| `...64aa` (CONFIRMED) | MLB | ML | Toronto Blue Jays @ Detroit Tigers | $1.3K | **W** | $1.3K |
| `...853d` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Pistons | $870 | **W** | $853 |
| `...2f63` (FLAT) | NBA | TOTAL | Cavaliers @ Pistons | $883 | **W** | $818 |
| `...df91` (FLAT) | NBA | ML | Cavaliers @ Pistons | $246 | **W** | $394 |
| `...9d74` (FLAT) | MLB | ML | Texas Rangers @ Houston Astros | $233 | L | -$233 |
| `...853d` (CONFIRMED) | NBA | TOTAL | Cavaliers @ Pistons | $580 | L | -$580 |
| `...9d74` (FLAT) | MLB | ML | New York Yankees @ New York Mets | $2.0K | L | -$2.0K |
| `...9d74` (FLAT) | MLB | ML | San Diego Padres @ Seattle Mariners | $2.0K | L | -$2.0K |
| `...64aa` (CONFIRMED) | MLB | ML | Los Angeles Dodgers @ Los Angeles Angels | $2.1K | L | -$2.1K |
| `...135d` (CONFIRMED) | MLB | TOTAL | San Francisco Giants @ Athletics | $2.4K | L | -$2.4K |
| `...64aa` (CONFIRMED) | MLB | ML | Philadelphia Phillies @ Pittsburgh Pirates | $2.8K | L | -$2.8K |
| `...2f63` (FLAT) | NBA | SPREAD | Cavaliers @ Pistons | $3.1K | L | -$3.1K |
| `...9c38` (CONFIRMED) | NBA | ML | Cavaliers @ Pistons | $3.7K | L | -$3.7K |
| `...00bc` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Pistons | $4.5K | L | -$4.5K |
| `...03d4` (FLAT) | NBA | TOTAL | Cavaliers @ Pistons | $5.0K | L | -$5.0K |
| `...0ff5` (FLAT) | MLB | SPREAD | Boston Red Sox @ Atlanta Braves | $5.1K | L | -$5.1K |
| `...2768` (CONFIRMED) | MLB | ML | Toronto Blue Jays @ Detroit Tigers | $7.1K | L | -$7.1K |
| `...2768` (CONFIRMED) | MLB | ML | Los Angeles Dodgers @ Los Angeles Angels | $11.2K | L | -$11.2K |
| `...23c4` (CONFIRMED) | NBA | TOTAL | Cavaliers @ Pistons | $12.0K | L | -$12.0K |
| `...66f5` (FLAT) | NBA | ML | Cavaliers @ Pistons | $36.5K | L | -$36.5K |
| `...9a27` (CONFIRMED) | NBA | TOTAL | Cavaliers @ Pistons | $38.5K | L | -$38.5K |
| `...64aa` (CONFIRMED) | MLB | ML | San Francisco Giants @ Athletics | $43.5K | L | -$43.5K |
| `...d96a` (FLAT) | NBA | SPREAD | Cavaliers @ Pistons | $247.9K | L | -$247.9K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 7 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...64aa` | CONFIRMED | 15 | 67% | 5.0 | +4.14 | +28% | $253.2K | $48.7K | +19% | 2W |
| 2 | `...0ff5` | FLAT | 5 | 80% | 2.5 | +2.68 | +54% | $25.6K | $14.9K | +58% | 1W |
| 3 | `...abaf` | CONFIRMED | 3 | 67% | 1.5 | +0.92 | +31% | $62.7K | $14.1K | +22% | 2W |
| 4 | `...2768` | CONFIRMED | 8 | 50% | 2.7 | +0.22 | +3% | $77.1K | $2.5K | +3% | 1L |
| 5 | `...9d74` | FLAT | 8 | 50% | 4.0 | +0.18 | +2% | $14.2K | $2.1K | +15% | 3L |
| 6 | `...135d` | CONFIRMED | 5 | 40% | 1.7 | -0.74 | -15% | $6.7K | -$27 | -0% | 1L |
| 7 | `...c926` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $2.9K | -$2.9K | -100% | 1L |

**NBA** — 20 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 2 | 100% | 2.0 | +1.94 | +97% | $196.0K | $258.7K | +132% | 2W |
| 2 | `...abaf` | CONFIRMED | 2 | 100% | 2.0 | +2.58 | +129% | $97.4K | $118.4K | +122% | 2W |
| 3 | `...e8f1` | FLAT | 2 | 100% | 0.7 | +2.04 | +102% | $97.8K | $45.1K | +46% | 2W |
| 4 | `...66f5` | FLAT | 3 | 67% | 1.0 | +0.94 | +31% | $85.0K | $23.6K | +28% | 1L |
| 5 | `...9ef0` | FLAT | 5 | 80% | 1.7 | +2.91 | +58% | $23.0K | $20.5K | +89% | 1W |
| 6 | `...03d4` | FLAT | 4 | 75% | 1.3 | +1.92 | +48% | $18.1K | $7.8K | +43% | 1L |
| 7 | `...65dd` | CONFIRMED | 3 | 67% | 3.0 | +0.87 | +29% | $5.0K | $2.3K | +45% | 1W |
| 8 | `...df91` | FLAT | 3 | 100% | 1.0 | +3.54 | +118% | $909 | $951 | +105% | 3W |
| 9 | `...853d` | CONFIRMED | 2 | 50% | 2.0 | -0.02 | -1% | $1.4K | $273 | +19% | 1L |
| 10 | `...00bc` | CONFIRMED | 2 | 50% | 0.7 | +0.50 | +25% | $7.5K | $60 | +1% | 1L |
| 11 | `...0329` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $826 | -$826 | -100% | 1L |
| 12 | `...b33b` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $2.4K | -$2.4K | -100% | 1L |
| 13 | `...aeeb` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $3.2K | -$3.2K | -100% | 1L |
| 14 | `...9c38` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $3.7K | -$3.7K | -100% | 1L |
| 15 | `...d49f` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $6.0K | -$6.0K | -100% | 1L |

**NHL** — 6 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...66f5` | FLAT | 1 | 100% | 1.0 | +1.42 | +142% | $70.9K | $100.6K | +142% | 1W |
| 2 | `...df91` | FLAT | 1 | 100% | 1.0 | +1.42 | +142% | $3.3K | $4.6K | +142% | 1W |
| 3 | `...c67e` | CONFIRMED | 1 | 100% | 1.0 | +1.42 | +142% | $3.2K | $4.6K | +142% | 1W |
| 4 | `...a240` | CONFIRMED | 1 | 100% | 1.0 | +1.42 | +142% | $2.3K | $3.2K | +142% | 1W |
| 5 | `...3532` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $2.0K | -$2.0K | -100% | 1L |
| 6 | `...c12b` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $74.8K | -$74.8K | -100% | 1L |

#### §6b-2. 7-day

**MLB** — 9 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...5143` | CONFIRMED | 1 | 100% | 1.0 | +1.04 | +104% | $63.3K | $65.9K | +104% | 1W |
| 2 | `...135d` | CONFIRMED | 8 | 50% | 1.6 | +0.55 | +7% | $27.1K | $21.9K | +81% | 1L |
| 3 | `...64aa` | CONFIRMED | 21 | 57% | 3.5 | +1.81 | +9% | $359.8K | $17.8K | +5% | 2W |
| 4 | `...abaf` | CONFIRMED | 3 | 67% | 1.5 | +0.92 | +31% | $62.7K | $14.1K | +22% | 2W |
| 5 | `...2768` | CONFIRMED | 9 | 56% | 1.3 | +1.21 | +13% | $87.1K | $12.4K | +14% | 1L |
| 6 | `...c926` | FLAT | 3 | 67% | 1.0 | +1.29 | +43% | $12.7K | $7.3K | +58% | 1L |
| 7 | `...68b3` | CONFIRMED | 1 | 100% | 1.0 | +1.04 | +104% | $3.8K | $4.0K | +104% | 1W |
| 8 | `...9d74` | FLAT | 15 | 53% | 2.5 | +0.66 | +4% | $23.3K | $4.0K | +17% | 3L |
| 9 | `...0ff5` | FLAT | 11 | 55% | 1.8 | +0.66 | +6% | $82.5K | -$7.5K | -9% | 1W |

**NBA** — 25 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 3 | 100% | 1.0 | +2.53 | +84% | $263.3K | $298.3K | +113% | 3W |
| 2 | `...abaf` | CONFIRMED | 6 | 67% | 0.9 | +2.05 | +34% | $155.8K | $119.8K | +77% | 3W |
| 3 | `...e8f1` | FLAT | 2 | 100% | 0.7 | +2.04 | +102% | $97.8K | $45.1K | +46% | 2W |
| 4 | `...b814` | CONFIRMED | 1 | 100% | 1.0 | +0.18 | +18% | $144.0K | $25.7K | +18% | 1W |
| 5 | `...9ef0` | FLAT | 7 | 71% | 1.0 | +2.81 | +40% | $36.5K | $12.9K | +35% | 1W |
| 6 | `...0853` | CONFIRMED | 1 | 100% | 1.0 | +0.87 | +87% | $13.0K | $11.3K | +87% | 1W |
| 7 | `...d49f` | FLAT | 3 | 67% | 0.6 | +0.87 | +29% | $20.1K | $7.4K | +37% | 1L |
| 8 | `...03d4` | FLAT | 7 | 71% | 1.2 | +2.06 | +29% | $26.8K | $5.2K | +20% | 1L |
| 9 | `...853d` | CONFIRMED | 4 | 50% | 0.7 | -0.76 | -19% | $20.2K | $2.3K | +11% | 1L |
| 10 | `...65dd` | CONFIRMED | 5 | 60% | 1.7 | +0.85 | +17% | $12.1K | $2.2K | +18% | 1W |
| 11 | `...0f9a` | CONFIRMED | 2 | 50% | 2.0 | -0.09 | -5% | $3.0K | $1.6K | +52% | 1W |
| 12 | `...df91` | FLAT | 5 | 100% | 0.8 | +4.40 | +88% | $1.6K | $1.2K | +77% | 5W |
| 13 | `...9953` | CONFIRMED | 1 | 100% | 1.0 | +0.26 | +26% | $3.8K | $1.0K | +26% | 1W |
| 14 | `...00bc` | CONFIRMED | 2 | 50% | 0.7 | +0.50 | +25% | $7.5K | $60 | +1% | 1L |
| 15 | `...0329` | CONFIRMED | 2 | 0% | 0.5 | -2.00 | -100% | $1.7K | -$1.7K | -100% | 2L |

**NHL** — 6 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...66f5` | FLAT | 2 | 100% | 0.7 | +2.30 | +115% | $78.8K | $107.6K | +137% | 2W |
| 2 | `...df91` | FLAT | 3 | 100% | 0.6 | +2.92 | +97% | $3.8K | $5.0K | +132% | 3W |
| 3 | `...c67e` | CONFIRMED | 1 | 100% | 1.0 | +1.42 | +142% | $3.2K | $4.6K | +142% | 1W |
| 4 | `...a240` | CONFIRMED | 4 | 50% | 0.7 | +0.30 | +7% | $16.1K | $662 | +4% | 2W |
| 5 | `...c12b` | CONFIRMED | 2 | 50% | 0.4 | -0.38 | -19% | $164.8K | -$18.5K | -11% | 1L |
| 6 | `...3532` | FLAT | 3 | 0% | 0.5 | -3.00 | -100% | $30.9K | -$30.9K | -100% | 3L |

#### §6b-3. All-time

**MLB** — 11 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 2 | `...135d` | CONFIRMED | 8 | 50% | 1.6 | +0.55 | +7% | $27.1K | $21.9K | +81% | 1L |
| 3 | `...abaf` | CONFIRMED | 3 | 67% | 1.5 | +0.92 | +31% | $62.7K | $14.1K | +22% | 2W |
| 4 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 5 | `...2768` | CONFIRMED | 9 | 56% | 1.3 | +1.21 | +13% | $87.1K | $12.4K | +14% | 1L |
| 6 | `...c926` | FLAT | 4 | 50% | 0.3 | +0.29 | +7% | $14.1K | $6.0K | +42% | 1L |
| 7 | `...68b3` | CONFIRMED | 3 | 67% | 0.2 | +1.16 | +39% | $3.9K | $4.0K | +104% | 1W |
| 8 | `...9d74` | FLAT | 15 | 53% | 2.5 | +0.66 | +4% | $23.3K | $4.0K | +17% | 3L |
| 9 | `...89a0` | FLAT | 3 | 100% | 0.4 | +2.87 | +96% | $1.6K | $1.5K | +95% | 3W |
| 10 | `...64aa` | CONFIRMED | 61 | 57% | 2.1 | +4.41 | +7% | $1.05M | $157 | +0% | 2W |
| 11 | `...0ff5` | FLAT | 11 | 55% | 1.8 | +0.66 | +6% | $82.5K | -$7.5K | -9% | 1W |

**NBA** — 40 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...9a27` | CONFIRMED | 66 | 67% | 2.8 | +13.79 | +21% | $1.92M | $536.2K | +28% | 1L |
| 2 | `...2ca8` | CONFIRMED | 17 | 65% | 0.6 | +6.52 | +38% | $728.0K | $401.4K | +55% | 3W |
| 3 | `...23c4` | CONFIRMED | 14 | 71% | 0.6 | +5.37 | +38% | $502.9K | $251.0K | +50% | 1L |
| 4 | `...b032` | CONFIRMED | 7 | 86% | 0.7 | +5.40 | +77% | $244.0K | $249.9K | +102% | 3W |
| 5 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +5.66 | +283% | $141.8K | $241.7K | +170% | 2W |
| 6 | `...aeeb` | CONFIRMED | 47 | 60% | 1.7 | +8.29 | +18% | $862.5K | $177.9K | +21% | 1L |
| 7 | `...8da5` | CONFIRMED | 9 | 89% | 0.8 | +9.06 | +101% | $182.2K | $144.0K | +79% | 7W |
| 8 | `...32f2` | CONFIRMED | 7 | 43% | 0.4 | +0.99 | +14% | $126.8K | $134.2K | +106% | 1L |
| 9 | `...e8f1` | FLAT | 16 | 44% | 0.6 | +2.53 | +16% | $564.8K | $128.7K | +23% | 2W |
| 10 | `...abaf` | CONFIRMED | 6 | 67% | 0.9 | +2.05 | +34% | $155.8K | $119.8K | +77% | 3W |
| 11 | `...02c3` | CONFIRMED | 6 | 33% | 0.9 | +0.75 | +13% | $681.1K | $104.0K | +15% | 3L |
| 12 | `...5143` | FLAT | 12 | 67% | 0.6 | +4.27 | +36% | $754.5K | $101.3K | +13% | 1W |
| 13 | `...b814` | CONFIRMED | 3 | 100% | 0.4 | +0.56 | +19% | $431.9K | $81.3K | +19% | 3W |
| 14 | `...1a56` | CONFIRMED | 5 | 100% | 0.4 | +6.44 | +129% | $53.3K | $74.8K | +140% | 5W |
| 15 | `...3532` | FLAT | 56 | 54% | 2.1 | +6.32 | +11% | $821.2K | $63.2K | +8% | 3W |

**NHL** — 14 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...192c` | FLAT | 6 | 50% | 0.5 | +0.80 | +13% | $166.9K | $136.2K | +82% | 2L |
| 2 | `...66f5` | FLAT | 2 | 100% | 0.7 | +2.30 | +115% | $78.8K | $107.6K | +137% | 2W |
| 3 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +1.88 | +94% | $88.2K | $46.9K | +53% | 2W |
| 4 | `...1187` | CONFIRMED | 5 | 100% | 2.5 | +5.03 | +101% | $38.0K | $30.3K | +80% | 5W |
| 5 | `...cea1` | CONFIRMED | 3 | 67% | 0.4 | +0.62 | +21% | $27.7K | $22.1K | +80% | 1W |
| 6 | `...c67e` | CONFIRMED | 2 | 100% | 0.1 | +2.84 | +142% | $9.2K | $13.1K | +142% | 2W |
| 7 | `...a240` | CONFIRMED | 20 | 60% | 0.7 | +2.99 | +15% | $68.2K | $9.3K | +14% | 2W |
| 8 | `...853d` | CONFIRMED | 6 | 67% | 0.4 | +1.13 | +19% | $29.1K | $7.7K | +26% | 1L |
| 9 | `...afd2` | CONFIRMED | 2 | 50% | 1.0 | +0.40 | +20% | $18.2K | $4.9K | +27% | 1W |
| 10 | `...0853` | CONFIRMED | 7 | 71% | 0.8 | +3.17 | +45% | $132.6K | $2.2K | +2% | 2W |
| 11 | `...935c` | CONFIRMED | 4 | 75% | 1.0 | +2.11 | +53% | $1.3K | $953 | +74% | 3W |
| 12 | `...df91` | FLAT | 8 | 63% | 0.4 | +1.55 | +19% | $12.7K | -$1.5K | -12% | 3W |
| 13 | `...c12b` | CONFIRMED | 8 | 75% | 0.3 | +2.91 | +36% | $360.3K | -$4.6K | -1% | 1L |
| 14 | `...3532` | FLAT | 12 | 50% | 0.5 | +1.68 | +14% | $172.8K | -$36.0K | -21% | 3L |

### §6c. Active streaks (≥3 in a row, last bet within 3 days)

Proven `(wallet × sport)` pairs currently riding a 3-or-more-bet run with their most recent bet inside the last 3 calendar days. Hot-hand monitor — and the same surface for cold streaks worth fading.

| Wallet | Sport | Tier | Streak | Last bet | All-time bets | WR% | $ PnL | $ ROI |
|---|---|---|---|---|---|---|---|---|
| `...df91` | NBA | FLAT | **7W** | 2026-05-17 | 18 | 67% | -$2.4K | -16% |
| `...0329` | NBA | CONFIRMED | **5L** | 2026-05-15 | 9 | 44% | $15.3K | +76% |
| `...2ca8` | NBA | CONFIRMED | **3W** | 2026-05-15 | 17 | 65% | $401.4K | +55% |
| `...abaf` | NBA | CONFIRMED | **3W** | 2026-05-17 | 6 | 67% | $119.8K | +77% |
| `...3532` | NBA | FLAT | **3W** | 2026-05-17 | 56 | 54% | $63.2K | +8% |
| `...9d74` | MLB | FLAT | **3L** | 2026-05-17 | 15 | 53% | $4.0K | +17% |
| `...df91` | NHL | FLAT | **3W** | 2026-05-16 | 8 | 63% | -$1.5K | -12% |
| `...3532` | NHL | FLAT | **3L** | 2026-05-16 | 12 | 50% | -$36.0K | -21% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-05-04 | 30 · $608.3K · -$187.6K | 1 · $452 · $393 | 28 · $602.1K · -$191.5K | 1 · $5.7K · $3.5K |
| 2026-05-05 | 24 · $1.05M · -$397.3K | 3 · $54.3K · -$23.6K | 21 · $992.0K · -$373.7K | — |
| 2026-05-06 | 17 · $275.9K · $70.7K | 1 · $33.0K · $31.7K | 15 · $224.5K · $12.9K | 1 · $18.4K · $26.0K |
| 2026-05-07 | 5 · $77.3K · $29.5K | — | 5 · $77.3K · $29.5K | — |
| 2026-05-08 | 21 · $314.4K · $6.6K | — | 18 · $291.7K · $27.4K | 3 · $22.7K · -$20.8K |
| 2026-05-09 | 17 · $544.9K · -$7.8K | — | 17 · $544.9K · -$7.8K | — |
| 2026-05-10 | 24 · $741.5K · $578.8K | — | 21 · $677.2K · $605.8K | 3 · $64.3K · -$27.1K |
| 2026-05-11 | 25 · $433.4K · -$63.4K | 1 · $10.0K · $9.9K | 22 · $408.6K · -$58.5K | 2 · $14.8K · -$14.8K |
| 2026-05-12 | 32 · $403.6K · -$8.7K | 9 · $120.4K · $22.3K | 20 · $174.4K · -$69.0K | 3 · $108.7K · $38.0K |
| 2026-05-13 | 28 · $559.0K · -$107.9K | 10 · $89.2K · $12.5K | 18 · $469.8K · -$120.4K | — |
| 2026-05-14 | 11 · $78.0K · $24.8K | 7 · $60.3K · $15.8K | — | 4 · $17.6K · $9.0K |
| 2026-05-15 | 48 · $826.4K · $195.5K | 8 · $106.1K · $27.0K | 40 · $720.3K · $168.5K | — |
| 2026-05-16 | 20 · $269.5K · $35.4K | 14 · $113.1K · -$827 | — | 6 · $156.4K · $36.3K |
| 2026-05-17 | 44 · $803.4K · -$24.5K | 23 · $223.4K · $53.1K | 21 · $580.0K · -$77.6K | — |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-05-17_
