# Sharp Intel v6 — Daily Master Report

_Auto-generated **5/8/2026, 8:37:45 AM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (166 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-05-07** · 1 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 1 | 1-0-0 | 100.0% | +0.68u | +0.91u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | TOTAL | Tampa Bay Rays @ Boston Red Sox | OVER | 3.5★ · 0.75u | +1 | +1 | +1 | +2 | -110 | **W** | +0.68u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **6** shipped · 4-2-0 · WR 66.7% · PnL +1.11u (peak) / +2.16u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 6)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC = +1 | 3 | 2-1-0 | 66.7% | -2.23u | +1.32u |
| HC = 0 | 3 | 2-1-0 | 66.7% | +3.34u | +0.84u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 2 | 1-1-0 | 50.0% | -1.32u | -0.05u |
| +1 | 4 | 3-1-0 | 75.0% | +2.43u | +2.20u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 2 | 1-1-0 | 50.0% | -1.32u | -0.05u |
| +1 | 3 | 2-1-0 | 66.7% | +0.84u | +0.79u |
| 0 | 1 | 1-0-0 | 100.0% | +1.59u | +1.41u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 6)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 1 | 1-0-0 | 100.0% | +3.18u | +0.95u |
| STRONG (+3 .. +5) | 1 | 1-0-0 | 100.0% | +1.59u | +1.41u |
| NEUT   (0 .. +3) | 3 | 2-1-0 | 66.7% | -3.16u | +0.79u |
| FADE   (< −1) | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |

### §2b. 7-day

Total: **26** shipped · 14-12-0 · WR 53.8% · PnL -3.36u (peak) / +0.99u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 26)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC = +1 | 17 | 9-8-0 | 52.9% | -2.70u | +0.46u |
| HC = 0 | 7 | 5-2-0 | 71.4% | +2.84u | +2.53u |
| HC ≤ −1 | 2 | 0-2-0 | 0.0% | -3.50u | -2.00u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 6 | 3-3-0 | 50.0% | +1.75u | -0.11u |
| +2 | 4 | 1-3-0 | 25.0% | -5.13u | -2.12u |
| +1 | 13 | 9-4-0 | 69.2% | +1.22u | +4.27u |
| 0 | 2 | 1-1-0 | 50.0% | -0.07u | -0.04u |
| −1 | 1 | 0-1-0 | 0.0% | -1.13u | -1.00u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 10 | 3-7-0 | 30.0% | -5.75u | -4.11u |
| +2 | 3 | 2-1-0 | 66.7% | -1.13u | +0.82u |
| +1 | 8 | 6-2-0 | 75.0% | +2.55u | +3.15u |
| 0 | 4 | 2-2-0 | 50.0% | +0.29u | +0.18u |
| ≤ −2 | 1 | 1-0-0 | 100.0% | +0.68u | +0.96u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 6)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 1 | 1-0-0 | 100.0% | +3.18u | +0.95u |
| STRONG (+3 .. +5) | 1 | 1-0-0 | 100.0% | +1.59u | +1.41u |
| NEUT   (0 .. +3) | 3 | 2-1-0 | 66.7% | -3.16u | +0.79u |
| FADE   (< −1) | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |

### §2c. All-time

Total: **142** shipped · 66-74-2 · WR 47.1% · PnL -16.07u (peak) / -7.84u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 31)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC = +1 | 21 | 11-10-0 | 52.4% | -3.18u | +1.38u |
| HC = 0 | 8 | 5-2-1 | 71.4% | +2.84u | +2.53u |
| HC ≤ −1 | 2 | 0-2-0 | 0.0% | -3.50u | -2.00u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 24 | 16-8-0 | 66.7% | +13.87u | +11.77u |
| +2 | 30 | 13-17-0 | 43.3% | -8.92u | -2.94u |
| +1 | 48 | 25-22-1 | 53.2% | -2.33u | +0.46u |
| 0 | 27 | 8-18-1 | 30.8% | -14.95u | -11.09u |
| −1 | 7 | 1-6-0 | 14.3% | -5.60u | -4.94u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |
| missing | 5 | 3-2-0 | 60.0% | +2.36u | -0.12u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 53 | 25-26-2 | 49.0% | -5.84u | +0.90u |
| +2 | 39 | 18-21-0 | 46.2% | -7.90u | -2.20u |
| +1 | 34 | 16-18-0 | 47.1% | -2.04u | -3.45u |
| 0 | 8 | 2-6-0 | 25.0% | -3.21u | -3.82u |
| ≤ −2 | 2 | 1-1-0 | 50.0% | -0.32u | -0.04u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 6)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 1 | 1-0-0 | 100.0% | +3.18u | +0.95u |
| STRONG (+3 .. +5) | 1 | 1-0-0 | 100.0% | +1.59u | +1.41u |
| NEUT   (0 .. +3) | 3 | 2-1-0 | 66.7% | -3.16u | +0.79u |
| FADE   (< −1) | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84]
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

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 41 | 24 | 9 | 38% | 11 | 5 | 2 |
| NBA | 114 | 80 | 33 | 41% | 44 | 21 | 11 |
| NHL | 42 | 26 | 12 | 46% | 19 | 10 | 6 |
| **ALL (any sport)** | **129** | **92** | **41** | **45%** | **50** | **24** | **10** |

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

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | c289a0 | 3 | 3 | 0 | 100.0% | +2.87 | +95.6% | $1.5K |
| 2 | dcafd2 | 10 | 7 | 3 | 70.0% | +3.32 | +33.2% | $28.6K |
| 3 | 63fc82 | 11 | 7 | 4 | 63.6% | +2.76 | +25.1% | $33.8K |
| 4 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 5 | d5017f | 8 | 5 | 3 | 62.5% | +1.63 | +20.3% | $42.8K |
| 6 | 8c1eae | 7 | 4 | 3 | 57.1% | +0.98 | +14.0% | $3.8K |
| 7 | fcc12b | 21 | 12 | 9 | 57.1% | +2.54 | +12.1% | $158.6K |
| 8 | 4c64aa | 40 | 23 | 17 | 57.5% | +2.60 | +6.5% | -$17.7K |
| 9 | c668b3 | 2 | 1 | 1 | 50.0% | +0.12 | +6.0% | $18 |
| 10 | 7923c4 | 6 | 3 | 3 | 50.0% | -0.15 | -2.5% | $50.0K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | b51a56 | 4 | 4 | 0 | 100.0% | +4.79 | +119.9% | $71.1K |
| 3 | 2e8da5 | 9 | 8 | 1 | 88.9% | +9.06 | +100.7% | $144.0K |
| 4 | 7703d4 | 3 | 3 | 0 | 100.0% | +2.75 | +91.6% | $15.9K |
| 5 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 6 | 769c38 | 8 | 8 | 0 | 100.0% | +7.20 | +90.0% | $62.9K |
| 7 | 7f00bc | 13 | 9 | 4 | 69.2% | +8.17 | +62.9% | $11.1K |
| 8 | cdb33b | 5 | 2 | 3 | 40.0% | +3.00 | +60.0% | $15.8K |
| 9 | 0b0329 | 7 | 4 | 3 | 57.1% | +4.13 | +59.0% | $16.9K |
| 10 | 6bd96a | 6 | 3 | 3 | 50.0% | +3.33 | +55.4% | $36.6K |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 981187 | 5 | 5 | 0 | 100.0% | +5.03 | +100.6% | $30.3K |
| 2 | bc3532 | 6 | 5 | 1 | 83.3% | +5.66 | +94.3% | $37.1K |
| 3 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 4 | fcc12b | 6 | 5 | 1 | 83.3% | +3.29 | +54.8% | $13.9K |
| 5 | 30935c | 4 | 3 | 1 | 75.0% | +2.11 | +52.7% | $953 |
| 6 | e70853 | 7 | 5 | 2 | 71.4% | +3.17 | +45.2% | $2.2K |
| 7 | 92df91 | 3 | 2 | 1 | 66.7% | +0.63 | +20.9% | -$58 |
| 8 | c5cea1 | 3 | 2 | 1 | 66.7% | +0.62 | +20.7% | $22.1K |
| 9 | dcafd2 | 2 | 1 | 1 | 50.0% | +0.40 | +20.0% | $4.9K |
| 10 | 6b853d | 6 | 4 | 2 | 66.7% | +1.13 | +18.8% | $7.7K |

---
## §5. Proven-wallet roster growth & HC tracking

"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).

### §5a. Current proven-winner roster (snapshot)

Roster as of **2026-05-07** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 62 | 24 | 3 | 6 | **9** | 2 | 14.5% |
| NBA | 140 | 80 | 24 | 9 | **33** | 16 | 23.6% |
| NHL | 64 | 26 | 10 | 2 | **12** | 7 | 18.8% |
| **ALL** | **—** | **—** | **—** | **—** | **54** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 3 · 3 | 6 · 6 | 2 · 2 | in sync |
| NBA | 24 · 24 | 9 · 9 | 16 · 16 | in sync |
| NHL | 10 · 10 | 2 · 2 | 7 · 7 | in sync |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-05-07.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +0 from 9 | +2 from 7 | +9 from 0 | +9 from 0 |
| NBA | +1 from 32 | +6 from 27 | +33 from 0 | +33 from 0 |
| NHL | +0 from 12 | +2 from 10 | +12 from 0 | +12 from 0 |

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
| MLB | 62 | 24 (39%) | 9 (38%) | 3 (33%) | **9** | edge (Eligible→Flat-OK) 63% |
| NBA | 140 | 80 (57%) | 33 (41%) | 24 (73%) | **33** | edge (Eligible→Flat-OK) 59% |
| NHL | 64 | 26 (41%) | 12 (46%) | 10 (83%) | **12** | sample (Seen→Eligible) 59% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 1 | 1 (100.0%) | 1 (100.0%) | 0 (0.0%) |
| MLB | 7-day | 5 | 4 (80.0%) | 4 (80.0%) | 0 (0.0%) |
| MLB | All-time | 45 | 17 (37.8%) | 16 (35.6%) | 2 (4.4%) |
| NBA | 3-day | 4 | 2 (50.0%) | 1 (25.0%) | 0 (0.0%) |
| NBA | 7-day | 18 | 13 (72.2%) | 11 (61.1%) | 0 (0.0%) |
| NBA | All-time | 73 | 37 (50.7%) | 31 (42.5%) | 10 (13.7%) |
| NHL | 3-day | 1 | 1 (100.0%) | 1 (100.0%) | 0 (0.0%) |
| NHL | 7-day | 3 | 2 (66.7%) | 2 (66.7%) | 0 (0.0%) |
| NHL | All-time | 18 | 4 (22.2%) | 3 (16.7%) | 0 (0.0%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 6 | 4 (66.7%) | 3 (50.0%) | 0 (0.0%) |
| 7-day | 26 | 19 (73.1%) | 17 (65.4%) | 0 (0.0%) |
| All-time | 136 | 58 (42.6%) | 50 (36.8%) | 12 (8.8%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (4)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `a1be00…` | 1 | +0.87 | 5 | 47% |
| `dfa240…` | 1 | +0.87 | 5 | 98% |
| `009373…` | 1 | +0.87 | 0 | — |
| `b28d26…` | 1 | +0.72 | 5 | -22% |

**Just-under** (4)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `7923c4…` | 6 | 50% | -2.5% | 39 | 4% |
| `12192c…` | 14 | 50% | -5.9% | 53 | 2% |
| `cd2f63…` | 69 | 48% | -6.7% | 177 | 15% |
| `b05143…` | 9 | 44% | -8.6% | 26 | 23% |

#### NBA

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `11bf5d…` | 1 | +3.15 | 3 | 42% |
| `dded41…` | 1 | +3.15 | 1 | 376% |
| `e96b87…` | 1 | +2.05 | 6 | -39% |
| `4a9953…` | 1 | +1.90 | 7 | 46% |
| `0f9d74…` | 1 | +0.93 | 3 | -28% |
| `88c556…` | 1 | +0.93 | 3 | 42% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `779ef0…` | 11 | 45% | -1.1% | 34 | -37% |
| `73f5b0…` | 20 | 50% | -3.7% | 44 | -26% |
| `40d814…` | 7 | 43% | -4.5% | 28 | -11% |
| `161f17…` | 2 | 50% | -4.5% | 2 | -10% |
| `bbd49f…` | 4 | 50% | -4.9% | 13 | -81% |
| `fc4582…` | 2 | 50% | -6.5% | 2 | -2% |

#### NHL

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `4b2e78…` | 1 | +1.46 | 0 | — |
| `d5017f…` | 1 | +1.45 | 1 | 150% |
| `fec67e…` | 1 | +1.42 | 5 | -78% |
| `5c32f2…` | 1 | +1.40 | 0 | — |
| `cce0fd…` | 1 | +1.20 | 3 | 124% |
| `59266e…` | 1 | +1.05 | 0 | — |

**Just-under** (5)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `3033ee…` | 4 | 50% | -0.3% | 8 | -23% |
| `779ef0…` | 2 | 50% | -1.0% | 7 | 10% |
| `c668b3…` | 4 | 50% | -8.5% | 9 | 63% |
| `8a3782…` | 2 | 50% | -9.0% | 18 | 27% |
| `f2d227…` | 2 | 50% | -9.0% | 8 | 32% |

### §5 — How to read

- **Roster growth flat in 7-day** + **funnel bottleneck = `data`** → re-run `exportWalletProfiles.js`. The flat-positive wallets are stuck at FLAT because Source-B coverage hasn't caught up. CONFIRMED gate is data-bound, not skill-bound.
- **Roster growth flat in 7-day** + **funnel bottleneck = `sample`** → wallets aren't reaching `≥2` reps fast enough. This is a slate-density problem; consider a soft `MIN_BETS = 1` shadow lane to surface bubble wallets earlier.
- **Roster shrank** (negative delta) → a previously CONFIRMED wallet just dropped flat-positive (lost a recent bet). Variance, not failure — but worth noting if a sport loses ≥3 in a week.
- **HC density on a sport drops below ~30%** → v7.3 promotions there will starve. Either the proven roster needs more CONFIRMED-tier wallets sizing aggressively, or the HC_RATIO (1.5) needs a sport-specific tune.

---
## §6. Daily proven-wallet performance

Who on the proven roster is actually printing — yesterday's bets, the rolling leaderboard (`$ PnL`-ranked), current streaks, and per-sport volume. **Proven** = `CONFIRMED` ∪ `FLAT` per sport (the same gate that drives Δ_winner). A wallet only counts in a sport where it's on that sport's proven list.

### §6a. Yesterday's proven-wallet bets

Slate: **2026-05-07** · 6 bets · 6 distinct proven wallets · WR 83% · $ vol $80.3K · $ PnL $32.2K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `6bd96a…` (FLAT) | NBA | SPREAD | Cavaliers @ Pistons | $33.6K | **W** | $31.1K |
| `52aeeb…` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Pistons | $9.3K | **W** | $8.6K |
| `6b853d…` (CONFIRMED) | NBA | SPREAD | Cavaliers @ Pistons | $7.5K | **W** | $6.9K |
| `7703d4…` (FLAT) | NBA | SPREAD | Cavaliers @ Pistons | $5.0K | **W** | $4.6K |
| `8c1eae…` (CONFIRMED) | MLB | TOTAL | Tampa Bay Rays @ Boston Red Sox | $3.0K | **W** | $2.7K |
| `bc3532…` (FLAT) | NBA | SPREAD | Cavaliers @ Pistons | $21.8K | L | -$21.8K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 2 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `4c64aa…` | FLAT | 4 | 75% | 2.0 | +1.29 | +32% | $87.3K | $8.1K | +9% | 3W |
| 2 | `8c1eae…` | CONFIRMED | 1 | 100% | 1.0 | +0.90 | +90% | $3.0K | $2.7K | +90% | 1W |

**NBA** — 17 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `6bd96a…` | FLAT | 2 | 100% | 0.7 | +1.58 | +79% | $121.5K | $88.2K | +73% | 2W |
| 2 | `52aeeb…` | CONFIRMED | 4 | 75% | 2.0 | +1.07 | +27% | $92.5K | $45.3K | +49% | 2W |
| 3 | `b19a27…` | CONFIRMED | 6 | 67% | 3.0 | +1.03 | +17% | $51.9K | $17.4K | +34% | 4W |
| 4 | `7923c4…` | CONFIRMED | 2 | 100% | 2.0 | +1.75 | +88% | $19.5K | $17.0K | +87% | 2W |
| 5 | `e70853…` | CONFIRMED | 1 | 100% | 1.0 | +0.11 | +11% | $139.2K | $15.5K | +11% | 1W |
| 6 | `6b853d…` | CONFIRMED | 3 | 67% | 1.5 | +0.84 | +28% | $7.5K | $6.9K | +92% | 2W |
| 7 | `8366f5…` | CONFIRMED | 1 | 100% | 1.0 | +0.11 | +11% | $59.0K | $6.6K | +11% | 1W |
| 8 | `7703d4…` | FLAT | 1 | 100% | 1.0 | +0.93 | +93% | $5.0K | $4.6K | +93% | 1W |
| 9 | `8ec926…` | FLAT | 1 | 100% | 1.0 | +0.11 | +11% | $2.6K | $287 | +11% | 1W |
| 10 | `7f00bc…` | CONFIRMED | 1 | 100% | 1.0 | +0.91 | +91% | $22 | $20 | +91% | 1W |
| 11 | `bc3532…` | FLAT | 4 | 50% | 2.0 | -0.85 | -21% | $59.9K | -$2.8K | -5% | 1L |
| 12 | `0b0329…` | CONFIRMED | 3 | 0% | 1.5 | -3.00 | -100% | $4.5K | -$4.5K | -100% | 3L |
| 13 | `11b032…` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $15.0K | -$15.0K | -100% | 1L |
| 14 | `2d2ca8…` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $59.5K | -$59.5K | -100% | 1L |
| 15 | `78e8f1…` | FLAT | 2 | 0% | 2.0 | -2.00 | -100% | $81.3K | -$81.3K | -100% | 2L |

**NHL** — 1 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `bc3532…` | CONFIRMED | 1 | 100% | 1.0 | +1.41 | +141% | $18.4K | $26.0K | +141% | 1W |

#### §6b-2. 7-day

**MLB** — 7 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `4c64aa…` | FLAT | 20 | 70% | 3.3 | +5.35 | +27% | $322.7K | $45.5K | +14% | 3W |
| 2 | `fcc12b…` | FLAT | 4 | 75% | 2.0 | +1.29 | +32% | $47.6K | $32.2K | +68% | 1W |
| 3 | `d5017f…` | CONFIRMED | 6 | 50% | 2.0 | -0.45 | -8% | $54.0K | $14.3K | +26% | 1W |
| 4 | `8c1eae…` | CONFIRMED | 3 | 67% | 0.4 | +0.77 | +26% | $7.9K | $1.3K | +16% | 2W |
| 5 | `c289a0…` | FLAT | 2 | 100% | 1.0 | +1.49 | +74% | $1.1K | $763 | +73% | 2W |
| 6 | `c668b3…` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $2 | -$2 | -100% | 1L |
| 7 | `63fc82…` | FLAT | 2 | 0% | 0.7 | -2.00 | -100% | $66.7K | -$66.7K | -100% | 2L |

**NBA** — 26 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `2d2ca8…` | CONFIRMED | 4 | 75% | 0.8 | +4.76 | +119% | $193.4K | $187.3K | +97% | 1L |
| 2 | `11b032…` | CONFIRMED | 4 | 75% | 0.8 | +1.77 | +44% | $104.4K | $68.9K | +66% | 1L |
| 3 | `52aeeb…` | CONFIRMED | 11 | 64% | 1.6 | +1.90 | +17% | $246.4K | $54.4K | +22% | 2W |
| 4 | `769c38…` | CONFIRMED | 2 | 100% | 1.0 | +2.51 | +125% | $35.7K | $42.4K | +119% | 2W |
| 5 | `2e8da5…` | CONFIRMED | 2 | 100% | 2.0 | +4.20 | +210% | $18.5K | $25.8K | +139% | 2W |
| 6 | `6bd96a…` | FLAT | 4 | 50% | 1.0 | -0.42 | -11% | $191.8K | $18.0K | +9% | 2W |
| 7 | `e70853…` | CONFIRMED | 1 | 100% | 1.0 | +0.11 | +11% | $139.2K | $15.5K | +11% | 1W |
| 8 | `8366f5…` | CONFIRMED | 5 | 60% | 1.0 | +2.46 | +49% | $60.2K | $8.4K | +14% | 1W |
| 9 | `6b853d…` | CONFIRMED | 3 | 67% | 1.5 | +0.84 | +28% | $7.5K | $6.9K | +92% | 2W |
| 10 | `d5017f…` | CONFIRMED | 1 | 100% | 1.0 | +0.93 | +93% | $7.1K | $6.6K | +93% | 1W |
| 11 | `7703d4…` | FLAT | 1 | 100% | 1.0 | +0.93 | +93% | $5.0K | $4.6K | +93% | 1W |
| 12 | `92df91…` | FLAT | 2 | 50% | 0.7 | +1.75 | +88% | $1.0K | $723 | +71% | 1W |
| 13 | `8ec926…` | FLAT | 2 | 100% | 1.0 | +1.04 | +52% | $3.0K | $712 | +23% | 2W |
| 14 | `c5cea1…` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $83 | -$83 | -100% | 1L |
| 15 | `a1684d…` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $118 | -$118 | -100% | 1L |

**NHL** — 9 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `fcc12b…` | FLAT | 2 | 100% | 1.0 | +1.99 | +99% | $58.4K | $53.0K | +91% | 2W |
| 2 | `bc3532…` | CONFIRMED | 1 | 100% | 1.0 | +1.41 | +141% | $18.4K | $26.0K | +141% | 1W |
| 3 | `e70853…` | CONFIRMED | 2 | 100% | 0.7 | +2.29 | +114% | $15.7K | $17.9K | +114% | 2W |
| 4 | `30935c…` | CONFIRMED | 3 | 100% | 1.0 | +3.11 | +104% | $1.1K | $1.2K | +114% | 3W |
| 5 | `dfa240…` | CONFIRMED | 2 | 50% | 0.7 | -0.40 | -20% | $8.0K | $1.2K | +14% | 1W |
| 6 | `c5cea1…` | CONFIRMED | 1 | 100% | 1.0 | +0.82 | +82% | $6 | $5 | +82% | 1W |
| 7 | `12192c…` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $1 | -$1 | -100% | 1L |
| 8 | `92df91…` | CONFIRMED | 2 | 50% | 0.7 | -0.13 | -7% | $1.8K | -$555 | -32% | 1L |
| 9 | `6b853d…` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $7.5K | -$7.5K | -100% | 1L |

#### §6b-3. All-time

**MLB** — 9 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `fcc12b…` | FLAT | 21 | 57% | 1.4 | +2.54 | +12% | $618.9K | $158.6K | +26% | 1W |
| 2 | `d5017f…` | CONFIRMED | 8 | 63% | 0.5 | +1.63 | +20% | $81.0K | $42.8K | +53% | 1W |
| 3 | `63fc82…` | FLAT | 11 | 64% | 0.8 | +2.76 | +25% | $218.8K | $33.8K | +15% | 2L |
| 4 | `dcafd2…` | CONFIRMED | 10 | 70% | 2.0 | +3.32 | +33% | $47.0K | $28.6K | +61% | 1W |
| 5 | `981187…` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 6 | `8c1eae…` | CONFIRMED | 7 | 57% | 0.4 | +0.98 | +14% | $19.2K | $3.8K | +20% | 2W |
| 7 | `c289a0…` | FLAT | 3 | 100% | 0.4 | +2.87 | +96% | $1.6K | $1.5K | +95% | 3W |
| 8 | `c668b3…` | FLAT | 2 | 50% | 0.4 | +0.12 | +6% | $20 | $18 | +91% | 1L |
| 9 | `4c64aa…` | FLAT | 40 | 57% | 2.2 | +2.60 | +7% | $685.5K | -$17.7K | -3% | 3W |

**NBA** — 33 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `b19a27…` | CONFIRMED | 42 | 64% | 3.2 | +7.59 | +18% | $1.33M | $463.8K | +35% | 4W |
| 2 | `799fad…` | CONFIRMED | 2 | 100% | 1.0 | +5.66 | +283% | $141.8K | $241.7K | +170% | 2W |
| 3 | `52aeeb…` | CONFIRMED | 36 | 61% | 1.9 | +9.26 | +26% | $645.1K | $209.0K | +32% | 2W |
| 4 | `2e8da5…` | CONFIRMED | 9 | 89% | 0.8 | +9.06 | +101% | $182.2K | $144.0K | +79% | 7W |
| 5 | `5c32f2…` | CONFIRMED | 7 | 43% | 0.4 | +0.99 | +14% | $126.8K | $134.2K | +106% | 1L |
| 6 | `78e8f1…` | FLAT | 13 | 38% | 0.8 | +1.49 | +11% | $417.0K | $133.7K | +32% | 4L |
| 7 | `3102c3…` | FLAT | 6 | 33% | 0.9 | +0.75 | +13% | $681.1K | $104.0K | +15% | 3L |
| 8 | `2d2ca8…` | CONFIRMED | 14 | 57% | 0.8 | +3.99 | +28% | $464.7K | $103.1K | +22% | 1L |
| 9 | `bc3532…` | FLAT | 33 | 48% | 1.9 | +4.07 | +12% | $573.5K | $79.7K | +14% | 1L |
| 10 | `b51a56…` | CONFIRMED | 4 | 100% | 0.8 | +4.79 | +120% | $51.1K | $71.1K | +139% | 4W |
| 11 | `11b032…` | CONFIRMED | 4 | 75% | 0.8 | +1.77 | +44% | $104.4K | $68.9K | +66% | 1L |
| 12 | `769c38…` | CONFIRMED | 8 | 100% | 0.6 | +7.20 | +90% | $103.5K | $62.9K | +61% | 8W |
| 13 | `4edc5b…` | CONFIRMED | 4 | 50% | 2.0 | +1.79 | +45% | $187.7K | $55.6K | +30% | 1W |
| 14 | `b05143…` | CONFIRMED | 11 | 64% | 0.7 | +3.81 | +35% | $653.1K | $54.8K | +8% | 2L |
| 15 | `7923c4…` | CONFIRMED | 8 | 75% | 0.7 | +3.49 | +44% | $271.6K | $53.8K | +20% | 2W |

**NHL** — 12 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `12192c…` | FLAT | 6 | 50% | 0.5 | +0.80 | +13% | $166.9K | $136.2K | +82% | 2L |
| 2 | `799fad…` | CONFIRMED | 2 | 100% | 1.0 | +1.88 | +94% | $88.2K | $46.9K | +53% | 2W |
| 3 | `bc3532…` | CONFIRMED | 6 | 83% | 0.4 | +5.66 | +94% | $62.4K | $37.1K | +59% | 5W |
| 4 | `981187…` | CONFIRMED | 5 | 100% | 2.5 | +5.03 | +101% | $38.0K | $30.3K | +80% | 5W |
| 5 | `c5cea1…` | CONFIRMED | 3 | 67% | 0.4 | +0.62 | +21% | $27.7K | $22.1K | +80% | 1W |
| 6 | `fcc12b…` | FLAT | 6 | 83% | 0.5 | +3.29 | +55% | $195.5K | $13.9K | +7% | 3W |
| 7 | `dfa240…` | CONFIRMED | 15 | 60% | 0.9 | +1.76 | +12% | $51.1K | $7.7K | +15% | 1W |
| 8 | `6b853d…` | CONFIRMED | 6 | 67% | 0.4 | +1.13 | +19% | $29.1K | $7.7K | +26% | 1L |
| 9 | `dcafd2…` | CONFIRMED | 2 | 50% | 1.0 | +0.40 | +20% | $18.2K | $4.9K | +27% | 1W |
| 10 | `e70853…` | CONFIRMED | 7 | 71% | 0.8 | +3.17 | +45% | $132.6K | $2.2K | +2% | 2W |
| 11 | `30935c…` | CONFIRMED | 4 | 75% | 1.0 | +2.11 | +53% | $1.3K | $953 | +74% | 3W |
| 12 | `92df91…` | CONFIRMED | 3 | 67% | 0.4 | +0.63 | +21% | $2.4K | -$58 | -2% | 1L |

### §6c. Active streaks (≥3 in a row, last bet within 3 days)

Proven `(wallet × sport)` pairs currently riding a 3-or-more-bet run with their most recent bet inside the last 3 calendar days. Hot-hand monitor — and the same surface for cold streaks worth fading.

| Wallet | Sport | Tier | Streak | Last bet | All-time bets | WR% | $ PnL | $ ROI |
|---|---|---|---|---|---|---|---|---|
| `2e8da5…` | NBA | CONFIRMED | **7W** | 2026-05-04 | 9 | 89% | $144.0K | +79% |
| `bc3532…` | NHL | CONFIRMED | **5W** | 2026-05-06 | 6 | 83% | $37.1K | +59% |
| `b19a27…` | NBA | CONFIRMED | **4W** | 2026-05-06 | 42 | 64% | $463.8K | +35% |
| `78e8f1…` | NBA | FLAT | **4L** | 2026-05-05 | 13 | 38% | $133.7K | +32% |
| `de3f67…` | NBA | CONFIRMED | **4L** | 2026-05-06 | 9 | 56% | -$5.5K | -2% |
| `3102c3…` | NBA | FLAT | **3L** | 2026-05-05 | 6 | 33% | $104.0K | +15% |
| `0b0329…` | NBA | CONFIRMED | **3L** | 2026-05-06 | 7 | 57% | $16.9K | +92% |
| `7703d4…` | NBA | FLAT | **3W** | 2026-05-07 | 3 | 100% | $15.9K | +93% |
| `c289a0…` | MLB | FLAT | **3W** | 2026-05-04 | 3 | 100% | $1.5K | +95% |
| `4c64aa…` | MLB | FLAT | **3W** | 2026-05-06 | 40 | 57% | -$17.7K | -3% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-04-24 | 30 · $473.3K · $9.0K | 4 · $122.3K · -$36.0K | 23 · $320.5K · $9.2K | 3 · $30.5K · $35.8K |
| 2026-04-25 | 21 · $872.5K · $202.4K | 1 · $8.8K · -$8.8K | 16 · $812.4K · $199.1K | 4 · $51.3K · $12.0K |
| 2026-04-26 | 29 · $611.8K · $87.7K | 6 · $144.2K · $69.9K | 22 · $459.8K · $10.9K | 1 · $7.8K · $6.8K |
| 2026-04-27 | 36 · $758.0K · $269.8K | 6 · $71.3K · $11.1K | 25 · $641.8K · $224.9K | 5 · $45.0K · $33.9K |
| 2026-04-28 | 34 · $280.1K · $141.5K | 7 · $73.8K · $26.0K | 21 · $131.4K · $98.4K | 6 · $74.9K · $17.0K |
| 2026-04-29 | 31 · $768.2K · $529.9K | 10 · $154.6K · $104.1K | 19 · $605.0K · $413.5K | 2 · $8.7K · $12.3K |
| 2026-04-30 | 20 · $312.2K · $181.6K | — | 17 · $265.8K · $221.6K | 3 · $46.4K · -$39.9K |
| 2026-05-01 | 31 · $572.4K · -$126.9K | 7 · $79.8K · -$39.8K | 18 · $434.1K · -$137.9K | 6 · $58.4K · $50.8K |
| 2026-05-02 | 23 · $537.3K · $303.7K | 12 · $171.1K · $8.7K | 8 · $354.9K · $287.2K | 3 · $11.3K · $7.8K |
| 2026-05-03 | 24 · $403.7K · -$11.7K | 8 · $97.1K · $67.7K | 12 · $289.6K · -$82.6K | 4 · $17.0K · $3.3K |
| 2026-05-04 | 35 · $669.5K · -$208.1K | 6 · $61.6K · -$20.1K | 28 · $602.1K · -$191.5K | 1 · $5.7K · $3.5K |
| 2026-05-05 | 21 · $860.9K · -$416.7K | 3 · $54.3K · -$23.6K | 18 · $806.6K · -$393.1K | — |
| 2026-05-06 | 17 · $275.9K · $70.7K | 1 · $33.0K · $31.7K | 15 · $224.5K · $12.9K | 1 · $18.4K · $26.0K |
| 2026-05-07 | 6 · $80.3K · $32.2K | 1 · $3.0K · $2.7K | 5 · $77.3K · $29.5K | — |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-05-07_
