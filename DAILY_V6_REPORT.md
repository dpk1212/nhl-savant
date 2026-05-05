# Sharp Intel v6 — Daily Master Report

_Auto-generated **5/5/2026, 9:06:40 AM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (152 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-05-04** · 7 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 7 | 3-4-0 | 42.9% | +2.49u | -1.46u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | Boston Red Sox @ Detroit Tigers | Detroit Tigers | 3.5★ · 1.13u | +1 | -1 | +0 | -1 | -199 | L | -1.13u |
| NBA | ML | 76ers @ Knicks | 76ers | 5.0★ · 0.50u | -1 | +3 | +3 | +6 | +245 | L | -0.50u |
| NBA | SPREAD | Timberwolves @ Spurs | Timberwolves | 5.0★ · 3.50u | +1 | +5 | +5 | +10 | -105 | **W** | +3.33u |
| NBA | SPREAD | 76ers @ Knicks | 76ers | 4.0★ · 1.13u | +1 | +2 | +2 | +4 | -110 | L | -1.13u |
| NBA | TOTAL | Timberwolves @ Spurs | Under 219.5 | 5.0★ · 3.50u | +1 | +3 | +3 | +6 | -102 | **W** | +3.24u |
| NBA | TOTAL | 76ers @ Knicks | Under 213 | 5.0★ · 2.00u | +1 | +2 | +3 | +5 | -102 | L | -2.00u |
| NHL | ML | Ducks @ Golden Knights | Golden Knights | 3.5★ · 1.13u | +1 | +1 | +1 | +2 | -165 | **W** | +0.68u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **14** shipped · 7-7-0 · WR 50.0% · PnL +1.03u (peak) / -0.86u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 14)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC = +1 | 13 | 7-6-0 | 53.8% | +1.53u | +0.14u |
| HC ≤ −1 | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 3 | 2-1-0 | 66.7% | +6.07u | +0.93u |
| +2 | 2 | 0-2-0 | 0.0% | -3.13u | -2.00u |
| +1 | 6 | 4-2-0 | 66.7% | -0.71u | +1.25u |
| 0 | 2 | 1-1-0 | 50.0% | -0.07u | -0.04u |
| −1 | 1 | 0-1-0 | 0.0% | -1.13u | -1.00u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 5 | 2-3-0 | 40.0% | +1.07u | -1.07u |
| +2 | 1 | 0-1-0 | 0.0% | -1.13u | -1.00u |
| +1 | 4 | 3-1-0 | 75.0% | +1.71u | +1.48u |
| 0 | 3 | 1-2-0 | 33.3% | -1.30u | -1.23u |
| ≤ −2 | 1 | 1-0-0 | 100.0% | +0.68u | +0.96u |

### §2b. 7-day

Total: **42** shipped · 19-22-1 · WR 46.3% · PnL -4.60u (peak) / -3.89u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 25)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC = +1 | 18 | 9-9-0 | 50.0% | -0.95u | +0.06u |
| HC = 0 | 5 | 3-1-1 | 75.0% | -0.50u | +1.70u |
| HC ≤ −1 | 2 | 0-2-0 | 0.0% | -3.50u | -2.00u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 7 | 3-4-0 | 42.9% | -0.08u | -1.79u |
| +2 | 13 | 7-6-0 | 53.8% | +0.54u | +2.08u |
| +1 | 17 | 8-8-1 | 50.0% | -2.36u | -1.15u |
| 0 | 4 | 1-3-0 | 25.0% | -1.57u | -2.04u |
| −1 | 1 | 0-1-0 | 0.0% | -1.13u | -1.00u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 17 | 6-10-1 | 37.5% | -4.39u | -5.00u |
| +2 | 13 | 5-8-0 | 38.5% | -2.96u | -1.90u |
| +1 | 8 | 6-2-0 | 75.0% | +3.37u | +3.28u |
| 0 | 3 | 1-2-0 | 33.3% | -1.30u | -1.23u |
| ≤ −2 | 1 | 1-0-0 | 100.0% | +0.68u | +0.96u |

### §2c. All-time

Total: **136** shipped · 62-72-2 · WR 46.3% · PnL -17.18u (peak) / -9.99u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 25)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC = +1 | 18 | 9-9-0 | 50.0% | -0.95u | +0.06u |
| HC = 0 | 5 | 3-1-1 | 75.0% | -0.50u | +1.70u |
| HC ≤ −1 | 2 | 0-2-0 | 0.0% | -3.50u | -2.00u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 22 | 15-7-0 | 68.2% | +15.19u | +11.82u |
| +2 | 30 | 13-17-0 | 43.3% | -8.92u | -2.94u |
| +1 | 44 | 22-21-1 | 51.2% | -4.76u | -1.74u |
| 0 | 27 | 8-18-1 | 30.8% | -14.95u | -11.09u |
| −1 | 7 | 1-6-0 | 14.3% | -5.60u | -4.94u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -0.50u | -1.00u |
| missing | 5 | 3-2-0 | 60.0% | +2.36u | -0.12u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 51 | 24-25-2 | 49.0% | -4.52u | +0.95u |
| +2 | 39 | 18-21-0 | 46.2% | -7.90u | -2.20u |
| +1 | 31 | 14-17-0 | 45.2% | -2.88u | -4.24u |
| 0 | 7 | 1-6-0 | 14.3% | -4.80u | -5.23u |
| ≤ −2 | 2 | 1-1-0 | 50.0% | -0.32u | -0.04u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95]
```

Daily cumulative table (peak units, HC era only):

| Date | HC ≥ +1 (cum) | HC = 0 (cum) | All shipped (cum) |
|---|---|---|---|
| 2026-04-30 | -0.48u | +0.00u | -0.48u |
| 2026-05-01 | -2.48u | -0.50u | -5.98u |
| 2026-05-02 | -4.41u | -0.50u | -7.91u |
| 2026-05-03 | -3.94u | -0.50u | -7.44u |
| 2026-05-04 | -0.95u | -0.50u | -4.95u |

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 41 | 24 | 9 | 38% | 11 | 5 | 2 |
| NBA | 108 | 76 | 32 | 42% | 39 | 20 | 10 |
| NHL | 41 | 26 | 12 | 46% | 19 | 10 | 6 |
| **ALL (any sport)** | **123** | **90** | **38** | **42%** | **50** | **24** | **12** |

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

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | c289a0 | 3 | 3 | 0 | 100.0% | +2.87 | +95.6% | $1.5K |
| 2 | dcafd2 | 10 | 7 | 3 | 70.0% | +3.32 | +33.2% | $28.6K |
| 3 | 63fc82 | 11 | 7 | 4 | 63.6% | +2.76 | +25.1% | $33.8K |
| 4 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 5 | d5017f | 8 | 5 | 3 | 62.5% | +1.63 | +20.3% | $42.8K |
| 6 | fcc12b | 21 | 12 | 9 | 57.1% | +2.54 | +12.1% | $158.6K |
| 7 | c668b3 | 2 | 1 | 1 | 50.0% | +0.12 | +6.0% | $18 |
| 8 | 4c64aa | 36 | 20 | 16 | 55.6% | +1.31 | +3.6% | -$25.7K |
| 9 | 8c1eae | 6 | 3 | 3 | 50.0% | +0.08 | +1.3% | $1.1K |
| 10 | 7923c4 | 6 | 3 | 3 | 50.0% | -0.15 | -2.5% | $50.0K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | 0b0329 | 4 | 4 | 0 | 100.0% | +7.13 | +178.3% | $21.4K |
| 3 | b51a56 | 4 | 4 | 0 | 100.0% | +4.79 | +119.9% | $71.1K |
| 4 | 2e8da5 | 9 | 8 | 1 | 88.9% | +9.06 | +100.7% | $144.0K |
| 5 | de3f67 | 6 | 5 | 1 | 83.3% | +5.66 | +94.3% | $145.1K |
| 6 | 11b032 | 3 | 3 | 0 | 100.0% | +2.77 | +92.4% | $83.9K |
| 7 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 8 | 7703d4 | 2 | 2 | 0 | 100.0% | +1.82 | +91.1% | $11.3K |
| 9 | 769c38 | 8 | 8 | 0 | 100.0% | +7.20 | +90.0% | $62.9K |
| 10 | 3102c3 | 4 | 2 | 2 | 50.0% | +2.75 | +68.8% | $342.9K |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 981187 | 5 | 5 | 0 | 100.0% | +5.03 | +100.6% | $30.3K |
| 2 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 3 | bc3532 | 5 | 4 | 1 | 80.0% | +4.25 | +85.0% | $11.1K |
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

Roster as of **2026-05-04** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 57 | 24 | 3 | 6 | **9** | 2 | 15.8% |
| NBA | 128 | 76 | 22 | 10 | **32** | 13 | 25.0% |
| NHL | 59 | 26 | 10 | 2 | **12** | 7 | 20.3% |
| **ALL** | **—** | **—** | **—** | **—** | **53** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 3 · 3 | 6 · 6 | 2 · 2 | in sync |
| NBA | 22 · 22 | 10 · 10 | 13 · 13 | in sync |
| NHL | 10 · 10 | 2 · 2 | 7 · 7 | in sync |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-05-04.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +4 from 5 | +2 from 7 | +9 from 0 | +9 from 0 |
| NBA | +2 from 30 | +8 from 24 | +32 from 0 | +32 from 0 |
| NHL | -1 from 13 | +3 from 9 | +12 from 0 | +12 from 0 |

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
| MLB | 57 | 24 (42%) | 9 (38%) | 3 (33%) | **9** | edge (Eligible→Flat-OK) 63% |
| NBA | 128 | 76 (59%) | 32 (42%) | 22 (69%) | **32** | edge (Eligible→Flat-OK) 58% |
| NHL | 59 | 26 (44%) | 12 (46%) | 10 (83%) | **12** | sample (Seen→Eligible) 56% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 3 | 3 (100.0%) | 3 (100.0%) | 0 (0.0%) |
| MLB | 7-day | 13 | 5 (38.5%) | 5 (38.5%) | 0 (0.0%) |
| MLB | All-time | 44 | 16 (36.4%) | 15 (34.1%) | 2 (4.5%) |
| NBA | 3-day | 10 | 9 (90.0%) | 9 (90.0%) | 0 (0.0%) |
| NBA | 7-day | 24 | 19 (79.2%) | 17 (70.8%) | 2 (8.3%) |
| NBA | All-time | 69 | 35 (50.7%) | 30 (43.5%) | 10 (14.5%) |
| NHL | 3-day | 1 | 1 (100.0%) | 1 (100.0%) | 0 (0.0%) |
| NHL | 7-day | 5 | 2 (40.0%) | 2 (40.0%) | 0 (0.0%) |
| NHL | All-time | 17 | 3 (17.6%) | 2 (11.8%) | 0 (0.0%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 14 | 13 (92.9%) | 13 (92.9%) | 0 (0.0%) |
| 7-day | 42 | 26 (61.9%) | 24 (57.1%) | 2 (4.8%) |
| All-time | 130 | 54 (41.5%) | 47 (36.2%) | 12 (9.2%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (4)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `a1be00…` | 1 | +0.87 | 2 | 104% |
| `dfa240…` | 1 | +0.87 | 3 | 117% |
| `009373…` | 1 | +0.87 | 0 | — |
| `b28d26…` | 1 | +0.72 | 5 | -22% |

**Just-under** (4)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `7923c4…` | 6 | 50% | -2.5% | 24 | -3% |
| `12192c…` | 14 | 50% | -5.9% | 40 | -8% |
| `cd2f63…` | 69 | 48% | -6.7% | 177 | 15% |
| `b05143…` | 9 | 44% | -8.6% | 21 | 26% |

#### NBA

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `11bf5d…` | 1 | +3.15 | 2 | 217% |
| `dded41…` | 1 | +3.15 | 1 | 376% |
| `e96b87…` | 1 | +2.05 | 6 | -39% |
| `4a9953…` | 1 | +1.90 | 7 | 46% |
| `0f9d74…` | 1 | +0.93 | 3 | -28% |
| `88c556…` | 1 | +0.93 | 3 | 42% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `73f5b0…` | 20 | 50% | -3.7% | 44 | -26% |
| `161f17…` | 2 | 50% | -4.5% | 2 | -10% |
| `bbd49f…` | 4 | 50% | -4.9% | 9 | -76% |
| `fc4582…` | 2 | 50% | -6.5% | 2 | -2% |
| `40d814…` | 6 | 33% | -7.1% | 20 | -3% |
| `cd2f63…` | 57 | 44% | -8.8% | 158 | 3% |

#### NHL

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `4b2e78…` | 1 | +1.46 | 0 | — |
| `d5017f…` | 1 | +1.45 | 1 | 150% |
| `fec67e…` | 1 | +1.42 | 3 | 18% |
| `5c32f2…` | 1 | +1.40 | 0 | — |
| `cce0fd…` | 1 | +1.20 | 3 | 124% |
| `59266e…` | 1 | +1.05 | 0 | — |

**Just-under** (5)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `3033ee…` | 4 | 50% | -0.3% | 8 | -23% |
| `779ef0…` | 2 | 50% | -1.0% | 5 | 127% |
| `c668b3…` | 4 | 50% | -8.5% | 9 | 63% |
| `8a3782…` | 2 | 50% | -9.0% | 18 | 27% |
| `f2d227…` | 2 | 50% | -9.0% | 7 | 33% |

### §5 — How to read

- **Roster growth flat in 7-day** + **funnel bottleneck = `data`** → re-run `exportWalletProfiles.js`. The flat-positive wallets are stuck at FLAT because Source-B coverage hasn't caught up. CONFIRMED gate is data-bound, not skill-bound.
- **Roster growth flat in 7-day** + **funnel bottleneck = `sample`** → wallets aren't reaching `≥2` reps fast enough. This is a slate-density problem; consider a soft `MIN_BETS = 1` shadow lane to surface bubble wallets earlier.
- **Roster shrank** (negative delta) → a previously CONFIRMED wallet just dropped flat-positive (lost a recent bet). Variance, not failure — but worth noting if a sport loses ≥3 in a week.
- **HC density on a sport drops below ~30%** → v7.3 promotions there will starve. Either the proven roster needs more CONFIRMED-tier wallets sizing aggressively, or the HC_RATIO (1.5) needs a sport-specific tune.

---
## §6. Daily proven-wallet performance

Who on the proven roster is actually printing — yesterday's bets, the rolling leaderboard (`$ PnL`-ranked), current streaks, and per-sport volume. **Proven** = `CONFIRMED` ∪ `FLAT` per sport (the same gate that drives Δ_winner). A wallet only counts in a sport where it's on that sport's proven list.

### §6a. Yesterday's proven-wallet bets

Slate: **2026-05-04** · 34 bets · 18 distinct proven wallets · WR 62% · $ vol $669.1K · $ PnL -$208.5K.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `de3f67…` (CONFIRMED) | NBA | SPREAD | Timberwolves @ Spurs | $60.0K | **W** | $57.1K |
| `3102c3…` (FLAT) | NBA | ML | Timberwolves @ Spurs | $8.8K | **W** | $28.7K |
| `de3f67…` (CONFIRMED) | NBA | ML | Timberwolves @ Spurs | $7.7K | **W** | $25.0K |
| `11b032…` (CONFIRMED) | NBA | TOTAL | Timberwolves @ Spurs | $24.0K | **W** | $22.2K |
| `52aeeb…` (CONFIRMED) | NBA | ML | 76ers @ Knicks | $55.6K | **W** | $20.2K |
| `2e8da5…` (CONFIRMED) | NBA | SPREAD | Timberwolves @ Spurs | $15.0K | **W** | $14.3K |
| `2d2ca8…` (CONFIRMED) | NBA | ML | Timberwolves @ Spurs | $4.4K | **W** | $14.3K |
| `d5017f…` (CONFIRMED) | MLB | ML | Philadelphia Phillies @ Miami Marlins | $14.0K | **W** | $12.8K |
| `2e8da5…` (CONFIRMED) | NBA | ML | Timberwolves @ Spurs | $3.6K | **W** | $11.6K |
| `b19a27…` (CONFIRMED) | NBA | SPREAD | 76ers @ Knicks | $9.2K | **W** | $8.5K |
| `d5017f…` (CONFIRMED) | MLB | ML | Boston Red Sox @ Detroit Tigers | $5.6K | **W** | $4.8K |
| `7f00bc…` (CONFIRMED) | NBA | ML | Timberwolves @ Spurs | $1.4K | **W** | $4.5K |
| `dfa240…` (CONFIRMED) | NHL | ML | Ducks @ Golden Knights | $5.7K | **W** | $3.5K |
| `7f00bc…` (CONFIRMED) | NBA | SPREAD | Timberwolves @ Spurs | $2.9K | **W** | $2.7K |
| `0b0329…` (CONFIRMED) | NBA | ML | Timberwolves @ Spurs | $826 | **W** | $2.7K |
| `8c1eae…` (CONFIRMED) | MLB | ML | Boston Red Sox @ Detroit Tigers | $1.9K | **W** | $1.6K |
| `5c32f2…` (CONFIRMED) | NBA | TOTAL | Timberwolves @ Spurs | $1.5K | **W** | $1.4K |
| `c289a0…` (FLAT) | MLB | ML | Boston Red Sox @ Detroit Tigers | $452 | **W** | $393 |
| `52aeeb…` (CONFIRMED) | NBA | SPREAD | Timberwolves @ Spurs | $412 | **W** | $392 |
| `b19a27…` (CONFIRMED) | NBA | SPREAD | Timberwolves @ Spurs | $301 | **W** | $287 |
| `7923c4…` (CONFIRMED) | NBA | TOTAL | Timberwolves @ Spurs | $226 | **W** | $209 |
| `8366f5…` (CONFIRMED) | NBA | ML | Timberwolves @ Spurs | $199 | L | -$199 |
| `5c32f2…` (CONFIRMED) | NBA | TOTAL | 76ers @ Knicks | $1.4K | L | -$1.4K |
| `7f00bc…` (CONFIRMED) | NBA | ML | 76ers @ Knicks | $1.7K | L | -$1.7K |
| `7f00bc…` (CONFIRMED) | NBA | SPREAD | 76ers @ Knicks | $3.0K | L | -$3.0K |
| `d5017f…` (CONFIRMED) | MLB | ML | New York Mets @ Colorado Rockies | $4.2K | L | -$4.2K |
| `6bd96a…` (FLAT) | NBA | ML | 76ers @ Knicks | $20.0K | L | -$20.0K |
| `de3f67…` (CONFIRMED) | NBA | ML | 76ers @ Knicks | $29.0K | L | -$29.0K |
| `63fc82…` (CONFIRMED) | MLB | ML | Boston Red Sox @ Detroit Tigers | $35.6K | L | -$35.6K |
| `52aeeb…` (CONFIRMED) | NBA | ML | Timberwolves @ Spurs | $39.6K | L | -$39.6K |
| `b19a27…` (CONFIRMED) | NBA | ML | Timberwolves @ Spurs | $42.7K | L | -$42.7K |
| `6bd96a…` (FLAT) | NBA | SPREAD | 76ers @ Knicks | $50.2K | L | -$50.2K |
| `7923c4…` (CONFIRMED) | NBA | TOTAL | 76ers @ Knicks | $102.0K | L | -$102.0K |
| `3102c3…` (FLAT) | NBA | ML | 76ers @ Knicks | $116.1K | L | -$116.1K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 7 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `4c64aa…` | FLAT | 13 | 69% | 6.5 | +3.33 | +26% | $168.8K | $77.5K | +46% | 1W |
| 2 | `fcc12b…` | FLAT | 1 | 100% | 1.0 | +0.77 | +77% | $37.4K | $28.8K | +77% | 1W |
| 3 | `d5017f…` | CONFIRMED | 6 | 50% | 2.0 | -0.45 | -8% | $54.0K | $14.3K | +26% | 1W |
| 4 | `8c1eae…` | CONFIRMED | 1 | 100% | 1.0 | +0.87 | +87% | $1.9K | $1.6K | +87% | 1W |
| 5 | `c289a0…` | FLAT | 2 | 100% | 1.0 | +1.49 | +74% | $1.1K | $763 | +73% | 2W |
| 6 | `c668b3…` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $2 | -$2 | -100% | 1L |
| 7 | `63fc82…` | CONFIRMED | 2 | 0% | 0.7 | -2.00 | -100% | $66.7K | -$66.7K | -100% | 2L |

**NBA** — 19 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `2d2ca8…` | CONFIRMED | 2 | 100% | 0.7 | +5.15 | +258% | $123.4K | $240.4K | +195% | 2W |
| 2 | `de3f67…` | CONFIRMED | 4 | 75% | 1.3 | +4.15 | +104% | $140.9K | $94.9K | +67% | 1L |
| 3 | `b19a27…` | CONFIRMED | 7 | 86% | 2.3 | +4.62 | +66% | $146.9K | $53.0K | +36% | 2W |
| 4 | `769c38…` | CONFIRMED | 1 | 100% | 1.0 | +1.90 | +190% | $16.0K | $30.3K | +190% | 1W |
| 5 | `2e8da5…` | CONFIRMED | 2 | 100% | 2.0 | +4.20 | +210% | $18.5K | $25.8K | +139% | 2W |
| 6 | `11b032…` | CONFIRMED | 1 | 100% | 1.0 | +0.93 | +93% | $24.0K | $22.2K | +93% | 1W |
| 7 | `0b0329…` | CONFIRMED | 1 | 100% | 1.0 | +3.25 | +325% | $826 | $2.7K | +325% | 1W |
| 8 | `8366f5…` | CONFIRMED | 3 | 67% | 1.0 | +3.35 | +112% | $1.1K | $1.9K | +164% | 1L |
| 9 | `92df91…` | FLAT | 1 | 100% | 1.0 | +2.75 | +275% | $463 | $1.3K | +275% | 1W |
| 10 | `7f00bc…` | CONFIRMED | 5 | 40% | 2.5 | +1.20 | +24% | $11.5K | -$32 | -0% | 2L |
| 11 | `5c32f2…` | CONFIRMED | 2 | 50% | 2.0 | -0.07 | -4% | $2.9K | -$79 | -3% | 1L |
| 12 | `779ef0…` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $3.4K | -$3.4K | -100% | 1L |
| 13 | `52aeeb…` | CONFIRMED | 6 | 50% | 2.0 | +0.22 | +4% | $125.6K | -$8.2K | -7% | 2W |
| 14 | `78e8f1…` | FLAT | 3 | 33% | 1.5 | -0.10 | -3% | $154.7K | -$38.7K | -25% | 2L |
| 15 | `b05143…` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $56.4K | -$56.4K | -100% | 1L |

**NHL** — 7 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `e70853…` | CONFIRMED | 1 | 100% | 1.0 | +1.42 | +142% | $7.8K | $11.1K | +142% | 1W |
| 2 | `fcc12b…` | FLAT | 1 | 100% | 1.0 | +1.12 | +112% | $9.0K | $10.1K | +112% | 1W |
| 3 | `dfa240…` | CONFIRMED | 2 | 50% | 0.7 | -0.40 | -20% | $8.0K | $1.2K | +14% | 1W |
| 4 | `30935c…` | CONFIRMED | 1 | 100% | 1.0 | +1.42 | +142% | $518 | $736 | +142% | 1W |
| 5 | `12192c…` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $1 | -$1 | -100% | 1L |
| 6 | `92df91…` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $1.1K | -$1.1K | -100% | 1L |
| 7 | `6b853d…` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $7.5K | -$7.5K | -100% | 1L |

#### §6b-2. 7-day

**MLB** — 7 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `4c64aa…` | FLAT | 22 | 59% | 4.4 | +1.69 | +8% | $334.1K | $87.8K | +26% | 1W |
| 2 | `fcc12b…` | FLAT | 7 | 57% | 1.4 | +0.43 | +6% | $108.8K | $71.9K | +66% | 1W |
| 3 | `d5017f…` | CONFIRMED | 7 | 57% | 1.0 | +0.57 | +8% | $54.2K | $14.4K | +27% | 1W |
| 4 | `8c1eae…` | CONFIRMED | 4 | 50% | 0.7 | +0.17 | +4% | $10.4K | $1.8K | +17% | 1W |
| 5 | `c289a0…` | FLAT | 3 | 100% | 0.4 | +2.87 | +96% | $1.6K | $1.5K | +95% | 3W |
| 6 | `c668b3…` | FLAT | 2 | 50% | 0.4 | +0.12 | +6% | $20 | $18 | +91% | 1L |
| 7 | `63fc82…` | CONFIRMED | 5 | 40% | 0.7 | -1.07 | -21% | $129.0K | -$30.8K | -24% | 2L |

**NBA** — 27 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `3102c3…` | FLAT | 4 | 50% | 0.7 | +2.75 | +69% | $442.2K | $342.9K | +78% | 1L |
| 2 | `2d2ca8…` | CONFIRMED | 4 | 75% | 0.6 | +4.76 | +119% | $136.8K | $243.9K | +178% | 3W |
| 3 | `de3f67…` | CONFIRMED | 6 | 83% | 1.2 | +5.66 | +94% | $208.9K | $145.1K | +69% | 1L |
| 4 | `11b032…` | CONFIRMED | 3 | 100% | 0.8 | +2.77 | +92% | $89.4K | $83.9K | +94% | 3W |
| 5 | `5c32f2…` | CONFIRMED | 5 | 40% | 1.0 | -1.16 | -23% | $107.3K | $79.6K | +74% | 1L |
| 6 | `2e8da5…` | CONFIRMED | 4 | 100% | 0.7 | +6.58 | +164% | $54.8K | $76.5K | +140% | 4W |
| 7 | `b51a56…` | CONFIRMED | 3 | 100% | 1.0 | +3.88 | +129% | $47.3K | $67.6K | +143% | 3W |
| 8 | `769c38…` | CONFIRMED | 2 | 100% | 1.0 | +2.51 | +125% | $35.7K | $42.4K | +119% | 2W |
| 9 | `0b0329…` | CONFIRMED | 4 | 100% | 0.7 | +7.13 | +178% | $13.9K | $21.4K | +154% | 4W |
| 10 | `b31fc6…` | CONFIRMED | 2 | 50% | 2.0 | -0.06 | -3% | $25.6K | $17.7K | +69% | 1L |
| 11 | `d5017f…` | CONFIRMED | 3 | 67% | 0.8 | +0.84 | +28% | $14.9K | $8.5K | +57% | 2W |
| 12 | `7f00bc…` | CONFIRMED | 10 | 60% | 1.7 | +5.06 | +51% | $23.1K | $7.0K | +30% | 2L |
| 13 | `6b853d…` | CONFIRMED | 3 | 33% | 3.0 | -1.09 | -36% | $7.1K | $5.1K | +72% | 1L |
| 14 | `8366f5…` | CONFIRMED | 4 | 50% | 1.0 | +2.35 | +59% | $1.2K | $1.8K | +156% | 1L |
| 15 | `a1684d…` | CONFIRMED | 2 | 50% | 0.7 | -0.72 | -36% | $1.6K | $310 | +19% | 1L |

**NHL** — 9 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `fcc12b…` | FLAT | 2 | 100% | 1.0 | +1.99 | +99% | $58.4K | $53.0K | +91% | 2W |
| 2 | `bc3532…` | CONFIRMED | 2 | 100% | 1.0 | +2.87 | +144% | $8.2K | $11.9K | +145% | 2W |
| 3 | `e70853…` | CONFIRMED | 5 | 80% | 0.8 | +3.30 | +66% | $108.5K | $11.6K | +11% | 2W |
| 4 | `dfa240…` | CONFIRMED | 5 | 60% | 0.7 | +0.14 | +3% | $19.0K | $3.1K | +16% | 1W |
| 5 | `30935c…` | CONFIRMED | 4 | 75% | 1.0 | +2.11 | +53% | $1.3K | $953 | +74% | 3W |
| 6 | `c5cea1…` | CONFIRMED | 2 | 50% | 0.5 | -0.18 | -9% | $12 | -$1 | -9% | 1W |
| 7 | `92df91…` | CONFIRMED | 2 | 50% | 0.7 | -0.13 | -7% | $1.8K | -$555 | -32% | 1L |
| 8 | `6b853d…` | CONFIRMED | 1 | 0% | 1.0 | -1.00 | -100% | $7.5K | -$7.5K | -100% | 1L |
| 9 | `12192c…` | FLAT | 2 | 0% | 0.4 | -2.00 | -100% | $17.7K | -$17.7K | -100% | 2L |

#### §6b-3. All-time

**MLB** — 9 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `fcc12b…` | FLAT | 21 | 57% | 1.4 | +2.54 | +12% | $618.9K | $158.6K | +26% | 1W |
| 2 | `d5017f…` | CONFIRMED | 8 | 63% | 0.5 | +1.63 | +20% | $81.0K | $42.8K | +53% | 1W |
| 3 | `63fc82…` | CONFIRMED | 11 | 64% | 0.8 | +2.76 | +25% | $218.8K | $33.8K | +15% | 2L |
| 4 | `dcafd2…` | CONFIRMED | 10 | 70% | 2.0 | +3.32 | +33% | $47.0K | $28.6K | +61% | 1W |
| 5 | `981187…` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 6 | `c289a0…` | FLAT | 3 | 100% | 0.4 | +2.87 | +96% | $1.6K | $1.5K | +95% | 3W |
| 7 | `8c1eae…` | CONFIRMED | 6 | 50% | 0.4 | +0.08 | +1% | $16.2K | $1.1K | +7% | 1W |
| 8 | `c668b3…` | FLAT | 2 | 50% | 0.4 | +0.12 | +6% | $20 | $18 | +91% | 1L |
| 9 | `4c64aa…` | FLAT | 36 | 56% | 2.4 | +1.31 | +4% | $598.2K | -$25.7K | -4% | 1W |

**NBA** — 32 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `b19a27…` | CONFIRMED | 36 | 64% | 3.3 | +6.57 | +18% | $1.28M | $446.4K | +35% | 2W |
| 2 | `3102c3…` | FLAT | 4 | 50% | 0.7 | +2.75 | +69% | $442.2K | $342.9K | +78% | 1L |
| 3 | `799fad…` | CONFIRMED | 2 | 100% | 1.0 | +5.66 | +283% | $141.8K | $241.7K | +170% | 2W |
| 4 | `78e8f1…` | FLAT | 11 | 45% | 0.7 | +3.49 | +32% | $335.7K | $215.0K | +64% | 2L |
| 5 | `52aeeb…` | CONFIRMED | 32 | 59% | 2.0 | +8.19 | +26% | $552.6K | $163.6K | +30% | 2W |
| 6 | `2d2ca8…` | CONFIRMED | 13 | 62% | 0.8 | +4.99 | +38% | $405.2K | $162.6K | +40% | 3W |
| 7 | `de3f67…` | CONFIRMED | 6 | 83% | 1.2 | +5.66 | +94% | $208.9K | $145.1K | +69% | 1L |
| 8 | `2e8da5…` | CONFIRMED | 9 | 89% | 0.8 | +9.06 | +101% | $182.2K | $144.0K | +79% | 7W |
| 9 | `5c32f2…` | CONFIRMED | 7 | 43% | 0.4 | +0.99 | +14% | $126.8K | $134.2K | +106% | 1L |
| 10 | `11b032…` | CONFIRMED | 3 | 100% | 0.8 | +2.77 | +92% | $89.4K | $83.9K | +94% | 3W |
| 11 | `bc3532…` | FLAT | 29 | 48% | 2.2 | +4.92 | +17% | $513.5K | $82.5K | +16% | 1W |
| 12 | `b51a56…` | CONFIRMED | 4 | 100% | 0.8 | +4.79 | +120% | $51.1K | $71.1K | +139% | 4W |
| 13 | `769c38…` | CONFIRMED | 8 | 100% | 0.6 | +7.20 | +90% | $103.5K | $62.9K | +61% | 8W |
| 14 | `4edc5b…` | CONFIRMED | 4 | 50% | 2.0 | +1.79 | +45% | $187.7K | $55.6K | +30% | 1W |
| 15 | `b05143…` | CONFIRMED | 11 | 64% | 0.7 | +3.81 | +35% | $653.1K | $54.8K | +8% | 2L |

**NHL** — 12 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `12192c…` | FLAT | 6 | 50% | 0.5 | +0.80 | +13% | $166.9K | $136.2K | +82% | 2L |
| 2 | `799fad…` | CONFIRMED | 2 | 100% | 1.0 | +1.88 | +94% | $88.2K | $46.9K | +53% | 2W |
| 3 | `981187…` | CONFIRMED | 5 | 100% | 2.5 | +5.03 | +101% | $38.0K | $30.3K | +80% | 5W |
| 4 | `c5cea1…` | CONFIRMED | 3 | 67% | 0.4 | +0.62 | +21% | $27.7K | $22.1K | +80% | 1W |
| 5 | `fcc12b…` | FLAT | 6 | 83% | 0.5 | +3.29 | +55% | $195.5K | $13.9K | +7% | 3W |
| 6 | `bc3532…` | CONFIRMED | 5 | 80% | 0.6 | +4.25 | +85% | $44.0K | $11.1K | +25% | 4W |
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
| `769c38…` | NBA | CONFIRMED | **8W** | 2026-05-02 | 8 | 100% | $62.9K | +61% |
| `2e8da5…` | NBA | CONFIRMED | **7W** | 2026-05-04 | 9 | 89% | $144.0K | +79% |
| `0b0329…` | NBA | CONFIRMED | **4W** | 2026-05-04 | 4 | 100% | $21.4K | +154% |
| `2d2ca8…` | NBA | CONFIRMED | **3W** | 2026-05-04 | 13 | 62% | $162.6K | +40% |
| `11b032…` | NBA | CONFIRMED | **3W** | 2026-05-04 | 3 | 100% | $83.9K | +94% |
| `fcc12b…` | NHL | FLAT | **3W** | 2026-05-02 | 6 | 83% | $13.9K | +7% |
| `c289a0…` | MLB | FLAT | **3W** | 2026-05-04 | 3 | 100% | $1.5K | +95% |
| `30935c…` | NHL | CONFIRMED | **3W** | 2026-05-03 | 4 | 75% | $953 | +74% |
| `779ef0…` | NBA | FLAT | **3L** | 2026-05-03 | 9 | 44% | -$1.6K | -2% |
| `6bd96a…` | NBA | FLAT | **3L** | 2026-05-04 | 4 | 25% | -$51.6K | -42% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL |
|---|---|---|---|---|
| 2026-04-21 | 24 · $375.6K · $699.7K | — | 19 · $339.2K · $707.1K | 5 · $36.4K · -$7.5K |
| 2026-04-22 | 22 · $709.7K · $120.9K | 7 · $179.1K · -$98.4K | 10 · $251.9K · $126.7K | 5 · $278.7K · $92.6K |
| 2026-04-23 | 27 · $583.4K · $269.1K | 2 · $38.9K · -$33.3K | 22 · $518.6K · $268.6K | 3 · $26.0K · $33.8K |
| 2026-04-24 | 31 · $489.4K · $24.2K | 4 · $122.3K · -$36.0K | 24 · $336.6K · $24.4K | 3 · $30.5K · $35.8K |
| 2026-04-25 | 22 · $875.7K · $199.2K | 1 · $8.8K · -$8.8K | 17 · $815.6K · $195.9K | 4 · $51.3K · $12.0K |
| 2026-04-26 | 29 · $611.8K · $87.7K | 6 · $144.2K · $69.9K | 22 · $459.8K · $10.9K | 1 · $7.8K · $6.8K |
| 2026-04-27 | 37 · $764.1K · $263.7K | 6 · $71.3K · $11.1K | 26 · $647.9K · $218.7K | 5 · $45.0K · $33.9K |
| 2026-04-28 | 34 · $280.1K · $141.5K | 7 · $73.8K · $26.0K | 21 · $131.4K · $98.4K | 6 · $74.9K · $17.0K |
| 2026-04-29 | 31 · $768.2K · $529.9K | 10 · $154.6K · $104.1K | 19 · $605.0K · $413.5K | 2 · $8.7K · $12.3K |
| 2026-04-30 | 20 · $312.2K · $181.6K | — | 17 · $265.8K · $221.6K | 3 · $46.4K · -$39.9K |
| 2026-05-01 | 31 · $572.4K · -$126.9K | 7 · $79.8K · -$39.8K | 18 · $434.1K · -$137.9K | 6 · $58.4K · $50.8K |
| 2026-05-02 | 23 · $537.3K · $303.7K | 12 · $171.1K · $8.7K | 8 · $354.9K · $287.2K | 3 · $11.3K · $7.8K |
| 2026-05-03 | 25 · $407.1K · -$15.1K | 8 · $97.1K · $67.7K | 13 · $293.0K · -$86.0K | 4 · $17.0K · $3.3K |
| 2026-05-04 | 34 · $669.1K · -$208.5K | 6 · $61.6K · -$20.1K | 27 · $601.7K · -$191.9K | 1 · $5.7K · $3.5K |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-05-04_
