# Sharp Intel v6 — Daily Master Report

_Auto-generated **5/20/2026, 12:18:35 PM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (181 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-05-19** · 7 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 7 | 3-4-0 | 42.9% | -5.70u | -1.74u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Atlanta Braves @ Miami Marlins | Miami Marlins | 5.0★ · 2.50u | +1 | +1 | -1 | +0 | +118 | L | -2.50u |
| MLB | ML | Cleveland Guardians @ Detroit Tigers | Detroit Tigers | 2.5★ · 2.50u | +1 | +1 | +2 | +3 | +105 | L | -2.50u |
| MLB | ML | Texas Rangers @ Colorado Rockies | Texas Rangers | 2.5★ · 1.25u | +1 | +1 | +2 | +3 | -104 | **W** | +1.16u |
| MLB | TOTAL | Boston Red Sox @ Kansas City Royals | Under 10.5 | 4.0★ · 1.65u | +0 | +2 | +1 | +3 | -110 | **W** | +1.50u |
| NBA | ML | Cavaliers @ Knicks | Knicks | 5.0★ · 5.00u | +3 | +0 | +6 | +6 | -260 | **W** | +1.89u |
| NBA | SPREAD | Cavaliers @ Knicks | Cavaliers | 5.0★ · 2.25u | +2 | +3 | +1 | +4 | -105 | L | -2.25u |
| NBA | TOTAL | Cavaliers @ Knicks | Under 217.5 | 5.0★ · 3.00u | +3 | +2 | +1 | +3 | -106 | L | -3.00u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **25** shipped · 12-13-0 · WR 48.0% · PnL -14.20u (peak) / -1.75u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 25)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 3 | 1-2-0 | 33.3% | -1.86u | -1.62u |
| HC = +2 | 4 | 0-4-0 | 0.0% | -14.75u | -4.00u |
| HC = +1 | 12 | 7-5-0 | 58.3% | +1.53u | +2.12u |
| HC = 0 | 6 | 4-2-0 | 66.7% | +0.88u | +1.75u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 6 | 3-3-0 | 50.0% | -7.03u | +0.44u |
| +2 | 11 | 5-6-0 | 45.5% | -5.93u | -1.11u |
| +1 | 5 | 2-3-0 | 40.0% | -2.90u | -1.36u |
| 0 | 3 | 2-1-0 | 66.7% | +1.66u | +0.29u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 4 | 3-1-0 | 75.0% | -0.32u | +1.94u |
| +2 | 8 | 4-4-0 | 50.0% | -5.79u | +0.07u |
| +1 | 9 | 3-6-0 | 33.3% | -9.50u | -3.57u |
| 0 | 2 | 2-0-0 | 100.0% | +4.66u | +1.81u |
| −1 | 1 | 0-1-0 | 0.0% | -2.50u | -1.00u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.75u | -1.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 25)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| LOCK   (+5 .. +7) | 3 | 1-2-0 | 33.3% | -3.61u | -1.62u |
| STRONG (+3 .. +5) | 4 | 2-2-0 | 50.0% | -3.50u | -0.18u |
| NEUT   (0 .. +3) | 13 | 7-6-0 | 53.8% | -4.16u | +0.49u |
| WEAK   (−1 .. 0) | 4 | 2-2-0 | 50.0% | -1.93u | +0.56u |
| FADE   (< −1) | 1 | 0-1-0 | 0.0% | -1.00u | -1.00u |

### §2b. 7-day

Total: **50** shipped · 25-25-0 · WR 50.0% · PnL -19.01u (peak) / -1.47u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 50)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 3 | 1-2-0 | 33.3% | -1.86u | -1.62u |
| HC = +2 | 7 | 2-5-0 | 28.6% | -12.07u | -2.86u |
| HC = +1 | 26 | 15-11-0 | 57.7% | +1.64u | +3.79u |
| HC = 0 | 14 | 7-7-0 | 50.0% | -6.72u | -0.79u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 14 | 7-7-0 | 50.0% | -14.72u | +1.27u |
| +2 | 16 | 7-9-0 | 43.8% | -9.14u | -3.07u |
| +1 | 13 | 8-5-0 | 61.5% | +5.98u | +2.16u |
| 0 | 7 | 3-4-0 | 42.9% | -1.13u | -1.83u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 14 | 9-5-0 | 64.3% | -0.28u | +4.10u |
| +2 | 12 | 5-7-0 | 41.7% | -15.80u | -1.95u |
| +1 | 15 | 7-8-0 | 46.7% | -5.55u | -2.37u |
| 0 | 4 | 2-2-0 | 50.0% | +1.76u | -0.19u |
| −1 | 3 | 2-1-0 | 66.7% | +4.11u | +0.94u |
| ≤ −2 | 2 | 0-2-0 | 0.0% | -3.25u | -2.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 50)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| LOCK   (+5 .. +7) | 4 | 1-3-0 | 25.0% | -7.11u | -2.62u |
| STRONG (+3 .. +5) | 9 | 5-4-0 | 55.6% | -4.38u | +0.11u |
| NEUT   (0 .. +3) | 26 | 13-13-0 | 50.0% | -6.22u | -0.77u |
| WEAK   (−1 .. 0) | 5 | 3-2-0 | 60.0% | -1.18u | +2.01u |
| FADE   (< −1) | 6 | 3-3-0 | 50.0% | -0.12u | -0.20u |

### §2c. All-time

Total: **220** shipped · 105-113-2 · WR 48.2% · PnL -40.45u (peak) / -10.01u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 109)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 4 | 1-3-0 | 25.0% | -5.36u | -2.62u |
| HC = +2 | 12 | 5-7-0 | 41.7% | -8.57u | -2.03u |
| HC = +1 | 61 | 35-26-0 | 57.4% | +3.75u | +8.67u |
| HC = 0 | 29 | 13-15-1 | 46.4% | -16.17u | -3.24u |
| HC ≤ −1 | 2 | 0-2-0 | 0.0% | -3.50u | -2.00u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 46 | 27-19-0 | 58.7% | -3.61u | +12.15u |
| +2 | 55 | 22-33-0 | 40.0% | -26.65u | -11.03u |
| +1 | 70 | 39-30-1 | 56.5% | +6.49u | +5.54u |
| 0 | 35 | 12-22-1 | 35.3% | -14.57u | -11.58u |
| −1 | 7 | 1-6-0 | 14.3% | -5.60u | -4.94u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 76 | 37-37-2 | 50.0% | -18.10u | +1.19u |
| +2 | 54 | 25-29-0 | 46.3% | -21.55u | -3.23u |
| +1 | 56 | 27-29-0 | 48.2% | -6.10u | -5.01u |
| 0 | 19 | 7-12-0 | 36.8% | -0.83u | -4.24u |
| −1 | 5 | 4-1-0 | 80.0% | +6.46u | +2.55u |
| ≤ −2 | 4 | 1-3-0 | 25.0% | -3.57u | -2.04u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 84)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 1 | 1-0-0 | 100.0% | +3.18u | +0.95u |
| LOCK   (+5 .. +7) | 9 | 5-4-0 | 55.6% | -2.93u | -0.47u |
| STRONG (+3 .. +5) | 19 | 13-6-0 | 68.4% | +1.34u | +5.77u |
| NEUT   (0 .. +3) | 40 | 16-24-0 | 40.0% | -24.20u | -8.38u |
| WEAK   (−1 .. 0) | 6 | 3-3-0 | 50.0% | -3.18u | +1.01u |
| FADE   (< −1) | 8 | 4-4-0 | 50.0% | +0.89u | +0.14u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98, -10.18]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67, -16.17]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52, -28.22]
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

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 52 | 32 | 12 | 38% | 15 | 4 | 1 |
| NBA | 120 | 88 | 38 | 43% | 51 | 25 | 11 |
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
| 2026-05-19 | 105 (46) | 32 (12) | 88 (38) | 31 (15) |

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | c289a0 | 3 | 3 | 0 | 100.0% | +2.87 | +95.6% | $1.5K |
| 2 | c668b3 | 3 | 2 | 1 | 66.7% | +1.16 | +38.7% | $4.0K |
| 3 | eeabaf | 3 | 2 | 1 | 66.7% | +0.92 | +30.6% | $14.1K |
| 4 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 5 | a10ff5 | 12 | 7 | 5 | 58.3% | +1.57 | +13.1% | $1.8K |
| 6 | 8ec926 | 4 | 2 | 2 | 50.0% | +0.29 | +7.2% | $6.0K |
| 7 | 70135d | 8 | 4 | 4 | 50.0% | +0.55 | +6.9% | $21.9K |
| 8 | 63fc82 | 15 | 8 | 7 | 53.3% | +0.91 | +6.1% | $104.4K |
| 9 | 4c64aa | 70 | 39 | 31 | 55.7% | +3.05 | +4.4% | $20.5K |
| 10 | 972768 | 12 | 6 | 6 | 50.0% | +0.51 | +4.3% | $6.4K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | b51a56 | 5 | 5 | 0 | 100.0% | +6.44 | +128.9% | $74.8K |
| 3 | 4a9953 | 2 | 2 | 0 | 100.0% | +2.16 | +108.2% | $3.7K |
| 4 | 8ec926 | 6 | 6 | 0 | 100.0% | +5.53 | +92.1% | $12.8K |
| 5 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 6 | 2e8da5 | 10 | 8 | 2 | 80.0% | +8.06 | +80.6% | $120.4K |
| 7 | 11b032 | 7 | 6 | 1 | 85.7% | +5.40 | +77.1% | $249.9K |
| 8 | 769c38 | 10 | 9 | 1 | 90.0% | +6.58 | +65.8% | $67.0K |
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

Roster as of **2026-05-19** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 91 | 32 | 8 | 4 | **12** | 3 | 13.2% |
| NBA | 178 | 88 | 25 | 13 | **38** | 17 | 21.3% |
| NHL | 82 | 31 | 11 | 4 | **15** | 7 | 18.3% |
| **ALL** | **—** | **—** | **—** | **—** | **65** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 15 · 8 | 7 · 4 | 2 · 3 | +10 live |
| NBA | 41 · 25 | 16 · 13 | 19 · 17 | +19 live |
| NHL | 14 · 11 | 4 · 4 | 6 · 7 | +3 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-05-19.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +0 from 12 | +3 from 9 | +9 from 3 | +12 from 0 |
| NBA | -1 from 39 | +1 from 37 | +35 from 3 | +38 from 0 |
| NHL | +1 from 14 | +4 from 11 | +14 from 1 | +15 from 0 |

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
| MLB | 91 | 32 (35%) | 12 (38%) | 8 (67%) | **12** | sample (Seen→Eligible) 65% |
| NBA | 178 | 88 (49%) | 38 (43%) | 25 (66%) | **38** | edge (Eligible→Flat-OK) 57% |
| NHL | 82 | 31 (38%) | 15 (48%) | 11 (73%) | **15** | sample (Seen→Eligible) 62% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 16 | 10 (62.5%) | 10 (62.5%) | 1 (6.3%) |
| MLB | 7-day | 33 | 22 (66.7%) | 22 (66.7%) | 3 (9.1%) |
| MLB | All-time | 91 | 47 (51.6%) | 46 (50.5%) | 5 (5.5%) |
| NBA | 3-day | 7 | 7 (100.0%) | 7 (100.0%) | 5 (71.4%) |
| NBA | 7-day | 13 | 11 (84.6%) | 10 (76.9%) | 6 (46.2%) |
| NBA | All-time | 97 | 58 (59.8%) | 51 (52.6%) | 22 (22.7%) |
| NHL | 3-day | 2 | 2 (100.0%) | 2 (100.0%) | 1 (50.0%) |
| NHL | 7-day | 4 | 4 (100.0%) | 4 (100.0%) | 1 (25.0%) |
| NHL | All-time | 26 | 11 (42.3%) | 10 (38.5%) | 2 (7.7%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 25 | 19 (76.0%) | 19 (76.0%) | 7 (28.0%) |
| 7-day | 50 | 37 (74.0%) | 36 (72.0%) | 10 (20.0%) |
| All-time | 214 | 116 (54.2%) | 107 (50.0%) | 29 (13.6%) |

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
| `...2f63` | 73 | 51% | -0.6% | 395 | -12% |
| `...23c4` | 6 | 50% | -2.5% | 80 | -29% |
| `...afd2` | 25 | 48% | -4.9% | 44 | -1% |
| `...c12b` | 35 | 49% | -5.6% | 67 | -19% |
| `...35e3` | 14 | 50% | -5.7% | 41 | -21% |
| `...9a27` | 70 | 49% | -5.9% | 247 | 5% |

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
| `...b33b` | 10 | 30% | -0.9% | 30 | 3% |
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

- `sharp_action_positions` GRADED rows: **6938**
- `sharp_action_positions` PENDING rows: **175** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 5/12/2026, 5:34:36 AM ET — **11924 min · STALE** — check grade-sharp-actions workflow

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

Slate: **2026-05-19** · 31 bets · 18 distinct proven wallets · WR 52% · $ vol $539.5K · $ PnL -$43.6K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...fc82` (FLAT) | MLB | ML | Atlanta Braves @ Miami Marlins | $76.6K | **W** | $88.1K |
| `...be3d` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Knicks | $68.8K | **W** | $63.7K |
| `...64aa` (CONFIRMED) | MLB | ML | Houston Astros @ Minnesota Twins | $13.2K | **W** | $16.9K |
| `...017f` (CONFIRMED) | NBA | TOTAL | Cavaliers @ Knicks | $14.9K | **W** | $13.3K |
| `...64aa` (CONFIRMED) | MLB | ML | Pittsburgh Pirates @ St. Louis Cardinals | $12.1K | **W** | $11.0K |
| `...0ff5` (FLAT) | MLB | TOTAL | Boston Red Sox @ Kansas City Royals | $10.2K | **W** | $9.3K |
| `...9c38` (CONFIRMED) | NBA | ML | Cavaliers @ Knicks | $20.7K | **W** | $7.8K |
| `...9d74` (CONFIRMED) | MLB | ML | Texas Rangers @ Colorado Rockies | $6.5K | **W** | $6.0K |
| `...2f63` (CONFIRMED) | NBA | ML | Cavaliers @ Knicks | $11.6K | **W** | $4.4K |
| `...c926` (FLAT) | NBA | SPREAD | Cavaliers @ Knicks | $4.6K | **W** | $4.3K |
| `...32f2` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Knicks | $3.9K | **W** | $3.6K |
| `...2f63` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Knicks | $3.6K | **W** | $3.4K |
| `...9ef0` (FLAT) | NBA | SPREAD | Cavaliers @ Knicks | $3.5K | **W** | $3.2K |
| `...9d74` (CONFIRMED) | MLB | ML | Baltimore Orioles @ Tampa Bay Rays | $2.1K | **W** | $2.0K |
| `...2f63` (CONFIRMED) | NBA | TOTAL | Cavaliers @ Knicks | $2.2K | **W** | $1.9K |
| `...d49f` (FLAT) | NBA | TOTAL | Cavaliers @ Knicks | $1.4K | **W** | $1.2K |
| `...853d` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Knicks | $606 | L | -$606 |
| `...9d74` (CONFIRMED) | MLB | ML | Cleveland Guardians @ Detroit Tigers | $1.4K | L | -$1.4K |
| `...853d` (CONFIRMED) | NBA | TOTAL | Cavaliers @ Knicks | $2.4K | L | -$2.4K |
| `...64aa` (CONFIRMED) | MLB | ML | Athletics @ Los Angeles Angels | $3.0K | L | -$3.0K |
| `...3532` (FLAT) | NBA | SPREAD | Cavaliers @ Knicks | $4.4K | L | -$4.4K |
| `...03d4` (FLAT) | NBA | SPREAD | Cavaliers @ Knicks | $5.0K | L | -$5.0K |
| `...03d4` (FLAT) | NBA | TOTAL | Cavaliers @ Knicks | $5.0K | L | -$5.0K |
| `...2768` (CONFIRMED) | MLB | ML | Atlanta Braves @ Miami Marlins | $7.5K | L | -$7.5K |
| `...2768` (CONFIRMED) | MLB | ML | Cleveland Guardians @ Detroit Tigers | $7.5K | L | -$7.5K |
| `...64aa` (CONFIRMED) | MLB | ML | Baltimore Orioles @ Tampa Bay Rays | $12.7K | L | -$12.7K |
| `...017f` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Knicks | $19.7K | L | -$19.7K |
| `...9a27` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Knicks | $19.7K | L | -$19.7K |
| `...64aa` (CONFIRMED) | MLB | ML | Cincinnati Reds @ Philadelphia Phillies | $20.5K | L | -$20.5K |
| `...9a27` (CONFIRMED) | NBA | TOTAL | Cavaliers @ Knicks | $74.2K | L | -$74.2K |
| `...23c4` (CONFIRMED) | NBA | TOTAL | Cavaliers @ Knicks | $100.0K | L | -$100.0K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 7 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...fc82` | FLAT | 1 | 100% | 1.0 | +1.15 | +115% | $76.6K | $88.1K | +115% | 1W |
| 2 | `...64aa` | CONFIRMED | 19 | 58% | 6.3 | +2.51 | +13% | $312.1K | $52.0K | +17% | 1W |
| 3 | `...abaf` | CONFIRMED | 2 | 100% | 2.0 | +1.92 | +96% | $39.5K | $37.3K | +94% | 2W |
| 4 | `...0ff5` | FLAT | 3 | 67% | 1.0 | +0.82 | +27% | $20.0K | $8.5K | +42% | 2W |
| 5 | `...9d74` | CONFIRMED | 9 | 44% | 3.0 | -1.19 | -13% | $20.2K | $4.3K | +21% | 1W |
| 6 | `...135d` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $2.4K | -$2.4K | -100% | 1L |
| 7 | `...2768` | CONFIRMED | 6 | 33% | 2.0 | -1.79 | -30% | $46.9K | -$18.2K | -39% | 2L |

**NBA** — 20 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2f63` | CONFIRMED | 9 | 89% | 3.0 | +7.61 | +85% | $160.5K | $260.4K | +162% | 7W |
| 2 | `...be3d` | CONFIRMED | 1 | 100% | 1.0 | +0.93 | +93% | $68.8K | $63.7K | +93% | 1W |
| 3 | `...c926` | FLAT | 1 | 100% | 1.0 | +0.93 | +93% | $4.6K | $4.3K | +93% | 1W |
| 4 | `...9c38` | CONFIRMED | 2 | 50% | 0.7 | -0.62 | -31% | $24.4K | $4.1K | +17% | 1W |
| 5 | `...32f2` | CONFIRMED | 1 | 100% | 1.0 | +0.93 | +93% | $3.9K | $3.6K | +93% | 1W |
| 6 | `...e8f1` | FLAT | 1 | 100% | 1.0 | +1.60 | +160% | $1.4K | $2.3K | +160% | 1W |
| 7 | `...d49f` | FLAT | 1 | 100% | 1.0 | +0.89 | +89% | $1.4K | $1.2K | +89% | 1W |
| 8 | `...df91` | FLAT | 1 | 100% | 1.0 | +1.60 | +160% | $246 | $394 | +160% | 1W |
| 9 | `...853d` | CONFIRMED | 4 | 25% | 1.3 | -2.02 | -50% | $4.5K | -$2.7K | -61% | 3L |
| 10 | `...00bc` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $4.5K | -$4.5K | -100% | 1L |
| 11 | `...017f` | CONFIRMED | 2 | 50% | 2.0 | -0.11 | -5% | $34.6K | -$6.3K | -18% | 1W |
| 12 | `...aeeb` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $6.5K | -$6.5K | -100% | 1L |
| 13 | `...9ef0` | FLAT | 4 | 75% | 1.3 | +1.89 | +47% | $37.3K | -$9.4K | -25% | 2W |
| 14 | `...03d4` | FLAT | 5 | 20% | 1.7 | -3.02 | -60% | $19.2K | -$12.9K | -67% | 4L |
| 15 | `...8da5` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $23.6K | -$23.6K | -100% | 1L |

**NHL** — 5 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...a240` | CONFIRMED | 1 | 100% | 1.0 | +0.89 | +89% | $3.6K | $3.2K | +89% | 1W |
| 2 | `...853d` | CONFIRMED | 1 | 100% | 1.0 | +0.89 | +89% | $886 | $791 | +89% | 1W |
| 3 | `...df91` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $3.3K | -$3.3K | -100% | 1L |
| 4 | `...23c4` | CONFIRMED | 2 | 50% | 2.0 | -0.11 | -5% | $102.0K | -$5.5K | -5% | 1W |
| 5 | `...c12b` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $91.1K | -$91.1K | -100% | 1L |

#### §6b-2. 7-day

**MLB** — 8 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...64aa` | CONFIRMED | 28 | 57% | 4.0 | +2.44 | +9% | $499.0K | $72.7K | +15% | 1W |
| 2 | `...fc82` | FLAT | 4 | 25% | 0.6 | -1.85 | -46% | $94.2K | $70.6K | +75% | 1W |
| 3 | `...135d` | CONFIRMED | 8 | 50% | 1.6 | +0.55 | +7% | $27.1K | $21.9K | +81% | 1L |
| 4 | `...abaf` | CONFIRMED | 3 | 67% | 1.5 | +0.92 | +31% | $62.7K | $14.1K | +22% | 2W |
| 5 | `...0ff5` | FLAT | 9 | 67% | 1.3 | +3.00 | +33% | $76.2K | $12.6K | +17% | 2W |
| 6 | `...9d74` | CONFIRMED | 17 | 59% | 2.4 | +2.53 | +15% | $33.0K | $10.8K | +33% | 1W |
| 7 | `...c926` | CONFIRMED | 3 | 67% | 1.0 | +1.29 | +43% | $12.7K | $7.3K | +58% | 1L |
| 8 | `...2768` | CONFIRMED | 11 | 45% | 2.2 | -0.48 | -4% | $99.0K | -$3.5K | -4% | 2L |

**NBA** — 23 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | CONFIRMED | 3 | 100% | 1.0 | +2.53 | +84% | $263.3K | $298.3K | +113% | 3W |
| 2 | `...2f63` | CONFIRMED | 18 | 83% | 2.6 | +12.36 | +69% | $271.8K | $207.5K | +76% | 7W |
| 3 | `...e8f1` | FLAT | 2 | 100% | 0.7 | +2.04 | +102% | $97.8K | $45.1K | +46% | 2W |
| 4 | `...0853` | CONFIRMED | 1 | 100% | 1.0 | +0.87 | +87% | $13.0K | $11.3K | +87% | 1W |
| 5 | `...c926` | FLAT | 1 | 100% | 1.0 | +0.93 | +93% | $4.6K | $4.3K | +93% | 1W |
| 6 | `...9c38` | CONFIRMED | 2 | 50% | 0.7 | -0.62 | -31% | $24.4K | $4.1K | +17% | 1W |
| 7 | `...9ef0` | FLAT | 8 | 75% | 1.6 | +3.81 | +48% | $52.7K | $3.6K | +7% | 2W |
| 8 | `...32f2` | CONFIRMED | 1 | 100% | 1.0 | +0.93 | +93% | $3.9K | $3.6K | +93% | 1W |
| 9 | `...df91` | FLAT | 4 | 100% | 0.8 | +4.13 | +103% | $1.2K | $1.1K | +95% | 4W |
| 10 | `...00bc` | CONFIRMED | 2 | 50% | 0.7 | +0.50 | +25% | $7.5K | $60 | +1% | 1L |
| 11 | `...0329` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $826 | -$826 | -100% | 1L |
| 12 | `...03d4` | FLAT | 8 | 50% | 1.1 | -0.21 | -3% | $31.5K | -$1.1K | -3% | 4L |
| 13 | `...853d` | CONFIRMED | 4 | 25% | 1.3 | -2.02 | -50% | $4.5K | -$2.7K | -61% | 3L |
| 14 | `...d49f` | FLAT | 2 | 50% | 0.4 | -0.11 | -5% | $7.3K | -$4.7K | -65% | 1W |
| 15 | `...017f` | CONFIRMED | 2 | 50% | 2.0 | -0.11 | -5% | $34.6K | -$6.3K | -18% | 1W |

**NHL** — 8 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...66f5` | FLAT | 2 | 100% | 0.7 | +2.30 | +115% | $78.8K | $107.6K | +137% | 2W |
| 2 | `...a240` | CONFIRMED | 4 | 75% | 0.8 | +2.19 | +55% | $15.3K | $8.3K | +54% | 3W |
| 3 | `...c67e` | CONFIRMED | 1 | 100% | 1.0 | +1.42 | +142% | $3.2K | $4.6K | +142% | 1W |
| 4 | `...df91` | FLAT | 3 | 67% | 0.6 | +1.30 | +43% | $6.8K | $1.6K | +24% | 1L |
| 5 | `...853d` | CONFIRMED | 1 | 100% | 1.0 | +0.89 | +89% | $886 | $791 | +89% | 1W |
| 6 | `...3532` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $2.0K | -$2.0K | -100% | 1L |
| 7 | `...23c4` | CONFIRMED | 2 | 50% | 2.0 | -0.11 | -5% | $102.0K | -$5.5K | -5% | 1W |
| 8 | `...c12b` | CONFIRMED | 2 | 0% | 0.7 | -2.00 | -100% | $165.9K | -$165.9K | -100% | 2L |

#### §6b-3. All-time

**MLB** — 12 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...fc82` | FLAT | 15 | 53% | 0.5 | +0.91 | +6% | $312.9K | $104.4K | +33% | 1W |
| 2 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 3 | `...135d` | CONFIRMED | 8 | 50% | 1.6 | +0.55 | +7% | $27.1K | $21.9K | +81% | 1L |
| 4 | `...64aa` | CONFIRMED | 70 | 56% | 2.3 | +3.05 | +4% | $1.22M | $20.5K | +2% | 1W |
| 5 | `...abaf` | CONFIRMED | 3 | 67% | 1.5 | +0.92 | +31% | $62.7K | $14.1K | +22% | 2W |
| 6 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 7 | `...9d74` | CONFIRMED | 19 | 53% | 2.4 | +0.53 | +3% | $35.2K | $8.6K | +24% | 1W |
| 8 | `...2768` | CONFIRMED | 12 | 50% | 1.3 | +0.51 | +4% | $109.0K | $6.4K | +6% | 2L |
| 9 | `...c926` | CONFIRMED | 4 | 50% | 0.3 | +0.29 | +7% | $14.1K | $6.0K | +42% | 1L |
| 10 | `...68b3` | CONFIRMED | 3 | 67% | 0.2 | +1.16 | +39% | $3.9K | $4.0K | +104% | 1W |
| 11 | `...0ff5` | FLAT | 12 | 58% | 1.5 | +1.57 | +13% | $92.7K | $1.8K | +2% | 2W |
| 12 | `...89a0` | FLAT | 3 | 100% | 0.4 | +2.87 | +96% | $1.6K | $1.5K | +95% | 3W |

**NBA** — 38 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...9a27` | CONFIRMED | 71 | 62% | 2.7 | +8.79 | +12% | $2.03M | $425.1K | +21% | 6L |
| 2 | `...2ca8` | CONFIRMED | 17 | 65% | 0.6 | +6.52 | +38% | $728.0K | $401.4K | +55% | 3W |
| 3 | `...b032` | CONFIRMED | 7 | 86% | 0.7 | +5.40 | +77% | $244.0K | $249.9K | +102% | 3W |
| 4 | `...9fad` | CONFIRMED | 2 | 100% | 1.0 | +5.66 | +283% | $141.8K | $241.7K | +170% | 2W |
| 5 | `...be3d` | CONFIRMED | 3 | 67% | 0.3 | +0.53 | +18% | $541.0K | $192.7K | +36% | 1W |
| 6 | `...aeeb` | CONFIRMED | 48 | 58% | 1.6 | +7.29 | +15% | $869.0K | $171.4K | +20% | 2L |
| 7 | `...32f2` | CONFIRMED | 8 | 50% | 0.3 | +1.91 | +24% | $130.7K | $137.8K | +105% | 1W |
| 8 | `...e8f1` | FLAT | 16 | 44% | 0.6 | +2.53 | +16% | $564.8K | $128.7K | +23% | 2W |
| 9 | `...23c4` | CONFIRMED | 16 | 63% | 0.6 | +3.37 | +21% | $630.9K | $122.9K | +19% | 3L |
| 10 | `...8da5` | CONFIRMED | 10 | 80% | 0.4 | +8.06 | +81% | $205.7K | $120.4K | +59% | 1L |
| 11 | `...02c3` | CONFIRMED | 6 | 33% | 0.9 | +0.75 | +13% | $681.1K | $104.0K | +15% | 3L |
| 12 | `...5143` | FLAT | 12 | 67% | 0.6 | +4.27 | +36% | $754.5K | $101.3K | +13% | 1W |
| 13 | `...2f63` | CONFIRMED | 77 | 53% | 3.1 | +6.61 | +9% | $941.3K | $84.8K | +9% | 7W |
| 14 | `...b814` | CONFIRMED | 3 | 100% | 0.4 | +0.56 | +19% | $431.9K | $81.3K | +19% | 3W |
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
| `...2f63` | NBA | CONFIRMED | **7W** | 2026-05-19 | 77 | 53% | $84.8K | +9% |
| `...df91` | NBA | FLAT | **7W** | 2026-05-17 | 18 | 67% | -$2.4K | -16% |
| `...9a27` | NBA | CONFIRMED | **6L** | 2026-05-19 | 71 | 62% | $425.1K | +21% |
| `...c926` | NBA | FLAT | **6W** | 2026-05-19 | 6 | 100% | $12.8K | +88% |
| `...03d4` | NBA | FLAT | **4L** | 2026-05-19 | 16 | 69% | $19.9K | +31% |
| `...23c4` | NBA | CONFIRMED | **3L** | 2026-05-19 | 16 | 63% | $122.9K | +19% |
| `...853d` | NBA | CONFIRMED | **3L** | 2026-05-19 | 37 | 57% | $18.2K | +11% |
| `...a240` | NHL | CONFIRMED | **3W** | 2026-05-18 | 21 | 62% | $12.4K | +17% |
| `...3532` | NHL | FLAT | **3L** | 2026-05-16 | 12 | 50% | -$36.0K | -21% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-05-06 | 17 · $275.9K · $70.7K | 1 · $33.0K · $31.7K | 15 · $224.5K · $12.9K | 1 · $18.4K · $26.0K |
| 2026-05-07 | 5 · $77.3K · $29.5K | — | 5 · $77.3K · $29.5K | — |
| 2026-05-08 | 21 · $314.4K · $6.6K | — | 18 · $291.7K · $27.4K | 3 · $22.7K · -$20.8K |
| 2026-05-09 | 17 · $544.9K · -$7.8K | — | 17 · $544.9K · -$7.8K | — |
| 2026-05-10 | 24 · $741.5K · $578.8K | — | 21 · $677.2K · $605.8K | 3 · $64.3K · -$27.1K |
| 2026-05-11 | 22 · $757.7K · $167.6K | 1 · $10.0K · $9.9K | 19 · $732.8K · $172.5K | 2 · $14.8K · -$14.8K |
| 2026-05-12 | 31 · $398.5K · -$3.6K | 9 · $120.4K · $22.3K | 19 · $169.4K · -$63.9K | 3 · $108.7K · $38.0K |
| 2026-05-13 | 27 · $649.8K · -$227.0K | 11 · $101.5K · $247 | 16 · $548.3K · -$227.3K | — |
| 2026-05-14 | 13 · $83.2K · $19.6K | 9 · $65.6K · $10.6K | — | 4 · $17.6K · $9.0K |
| 2026-05-15 | 44 · $819.0K · $195.6K | 8 · $106.1K · $27.0K | 36 · $712.9K · $168.6K | — |
| 2026-05-16 | 20 · $269.5K · $35.4K | 14 · $113.1K · -$827 | — | 6 · $156.4K · $36.3K |
| 2026-05-17 | 42 · $706.0K · -$142.9K | 23 · $223.4K · $53.1K | 19 · $482.6K · -$196.0K | — |
| 2026-05-18 | 27 · $740.7K · $155.0K | 6 · $121.1K · $35.7K | 15 · $418.7K · $215.2K | 6 · $200.9K · -$95.9K |
| 2026-05-19 | 31 · $539.5K · -$43.6K | 12 · $173.3K · $80.7K | 19 · $366.2K · -$124.3K | — |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-05-19_
