# Sharp Intel v6 — Daily Master Report

_Auto-generated **6/26/2026, 11:16:27 AM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**2026-04-30**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (299 profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ 30 · HC = CONFIRMED tier ∧ sizeRatio ≥ 1.5.

---
## §1. Yesterday's picks

Slate: **2026-06-25** · 14 shipped sides.

| N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|
| 14 | 6-8-0 | 42.9% | -5.58u | -3.28u |

| Sport | Market | Matchup | Pick | Stars · Units | HC | Δw | Δq | Σ | Odds | Result | PnL (peak u) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MLB | ML | New York Yankees @ Boston Red Sox | New York Yankees | 2.5★ · 0.25u | +0 | +3 | +1 | +4 | -136 | L | -0.25u |
| MLB | ML | Athletics @ San Francisco Giants | San Francisco Giants | 4.5★ · 1.00u | +0 | +1 | +1 | +2 | +443 | L | -1.00u |
| MLB | SPREAD | Houston Astros @ Detroit Tigers | Houston Astros | 4.5★ · 1.00u | +1 | +1 | +1 | +2 | +164 | **W** | +0.00u |
| MLB | SPREAD | New York Yankees @ Boston Red Sox | New York Yankees | 5.0★ · 2.50u | +0 | +2 | +1 | +3 | +114 | L | -2.50u |
| MLB | SPREAD | Philadelphia Phillies @ Washington Nationals | Philadelphia Phillies | 4.5★ · 3.00u | +0 | +1 | -1 | +0 | -105 | **W** | +0.00u |
| MLB | TOTAL | Chicago Cubs @ New York Mets | Under 8.5 | 4.5★ · 3.00u | +0 | +1 | +1 | +2 | -110 | **W** | +0.00u |
| MLB | TOTAL | Houston Astros @ Detroit Tigers | Under 9.5 | 4.5★ · 3.00u | +0 | +2 | +0 | +2 | -110 | **W** | +3.64u |
| MLB | TOTAL | New York Yankees @ Boston Red Sox | Under 8 | 4.5★ · 3.00u | +0 | +0 | -1 | -1 | -116 | L | -3.00u |
| MLB | TOTAL | Texas Rangers @ Toronto Blue Jays | Under 8.5 | 2.5★ · 0.25u | +1 | +0 | +0 | +0 | -110 | L | -0.25u |
| SOC | ML | Australia @ Paraguay | Paraguay | 4.5★ · 1.50u | +0 | -1 | +1 | +0 | +163 | L | -1.50u |
| SOC | ML | Côte d'Ivoire @ Curaçao | Côte d'Ivoire | 2.5★ · 0.25u | +1 | +4 | +2 | +6 | -600 | **W** | +0.00u |
| SOC | ML | Germany @ Ecuador | Germany | 4.0★ · 1.00u | +7 | +12 | +10 | +22 | -110 | L | -1.00u |
| SOC | ML | Netherlands @ Tunisia | Netherlands | 5.0★ · 5.00u | +1 | +5 | +1 | +6 | -700 | **W** | +0.53u |
| SOC | ML | United States @ Türkiye | United States | 2.5★ · 0.25u | +4 | +4 | +4 | +8 | -105 | L | -0.25u |

---
## §2. 3-day / 7-day / all-time cohort rollups

Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine's frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).

**HC margin sub-tables** are scoped to picks dated ≥ 2026-04-30 (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ 2026-04-18). Empty buckets are dropped.

### §2a. 3-day

Total: **69** shipped · 33-36-0 · WR 47.8% · PnL -50.00u (peak) / -7.19u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 69)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 0-2-0 | 0.0% | -1.25u | -2.00u |
| HC = +2 | 1 | 0-1-0 | 0.0% | -1.00u | -1.00u |
| HC = +1 | 5 | 4-1-0 | 80.0% | +1.42u | +1.14u |
| HC = 0 | 60 | 28-32-0 | 46.7% | -52.81u | -6.24u |
| HC ≤ −1 | 1 | 1-0-0 | 100.0% | +3.64u | +0.91u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 7 | 4-3-0 | 57.1% | +0.17u | -0.97u |
| +2 | 8 | 5-3-0 | 62.5% | +2.94u | +1.34u |
| +1 | 36 | 17-19-0 | 47.2% | -23.86u | -2.60u |
| 0 | 15 | 5-10-0 | 33.3% | -27.75u | -5.90u |
| −1 | 3 | 2-1-0 | 66.7% | -1.50u | +0.94u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 4 | 0-4-0 | 0.0% | -4.75u | -4.00u |
| +2 | 6 | 4-2-0 | 66.7% | +2.94u | +1.05u |
| +1 | 29 | 16-13-0 | 55.2% | -14.83u | +0.35u |
| 0 | 21 | 10-11-0 | 47.6% | -19.86u | -1.48u |
| −1 | 8 | 3-5-0 | 37.5% | -12.50u | -2.11u |
| ≤ −2 | 1 | 0-1-0 | 0.0% | -1.00u | -1.00u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 69)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 47 | 25-22-0 | 53.2% | -17.50u | +0.23u |
| WEAK   (−1 .. 0) | 22 | 8-14-0 | 36.4% | -32.50u | -7.41u |

### §2b. 7-day

Total: **147** shipped · 70-77-0 · WR 47.6% · PnL -90.99u (peak) / -15.66u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 147)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 2 | 0-2-0 | 0.0% | -1.25u | -2.00u |
| HC = +2 | 1 | 0-1-0 | 0.0% | -1.00u | -1.00u |
| HC = +1 | 11 | 10-1-0 | 90.9% | +12.89u | +6.32u |
| HC = 0 | 129 | 57-72-0 | 44.2% | -105.15u | -21.08u |
| HC ≤ −1 | 4 | 3-1-0 | 75.0% | +3.52u | +2.10u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 9 | 6-3-0 | 66.7% | +4.51u | +0.50u |
| +2 | 17 | 8-9-0 | 47.1% | +1.10u | -2.30u |
| +1 | 71 | 37-34-0 | 52.1% | -38.05u | -0.36u |
| 0 | 39 | 14-25-0 | 35.9% | -53.18u | -12.54u |
| −1 | 9 | 5-4-0 | 55.6% | -2.12u | +1.04u |
| ≤ −2 | 2 | 0-2-0 | 0.0% | -3.25u | -2.00u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 8 | 2-6-0 | 25.0% | -9.75u | -4.50u |
| +2 | 12 | 7-5-0 | 58.3% | +1.21u | +0.45u |
| +1 | 57 | 29-28-0 | 50.9% | -27.95u | -4.42u |
| 0 | 52 | 26-26-0 | 50.0% | -36.57u | -0.99u |
| −1 | 12 | 5-7-0 | 41.7% | -12.18u | -2.29u |
| ≤ −2 | 6 | 1-5-0 | 16.7% | -5.75u | -3.90u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 147)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| NEUT   (0 .. +3) | 94 | 49-45-0 | 52.1% | -34.69u | -2.68u |
| WEAK   (−1 .. 0) | 53 | 21-32-0 | 39.6% | -56.30u | -12.98u |

### §2c. All-time

Total: **853** shipped · 426-419-8 · WR 50.4% · PnL -180.24u (peak) / -33.42u (flat).

**By HC margin** _(picks dated ≥ 2026-04-30, N = 742)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| HC ≥ +3 | 15 | 4-11-0 | 26.7% | -8.20u | -9.05u |
| HC = +2 | 33 | 17-16-0 | 51.5% | -1.13u | -0.38u |
| HC = +1 | 175 | 102-73-0 | 58.3% | +23.95u | +18.68u |
| HC = 0 | 487 | 234-246-7 | 48.8% | -195.48u | -39.16u |
| HC ≤ −1 | 31 | 18-13-0 | 58.1% | +11.22u | +5.30u |

**By Δw (winner margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 122 | 61-61-0 | 50.0% | -15.81u | -2.91u |
| +2 | 155 | 76-78-1 | 49.4% | -33.07u | -7.63u |
| +1 | 340 | 180-157-3 | 53.4% | -70.98u | +4.25u |
| 0 | 183 | 88-92-3 | 48.9% | -43.61u | -14.76u |
| −1 | 38 | 14-23-1 | 37.8% | -14.22u | -9.96u |
| ≤ −2 | 9 | 3-6-0 | 33.3% | -6.54u | -3.25u |
| missing | 6 | 4-2-0 | 66.7% | +3.99u | +0.85u |

**By Δq (quality margin)**

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ≥ +3 | 143 | 71-69-3 | 50.7% | -32.01u | -3.34u |
| +2 | 136 | 63-73-0 | 46.3% | -37.79u | -15.30u |
| +1 | 272 | 147-122-3 | 54.6% | -7.16u | +6.25u |
| 0 | 204 | 100-103-1 | 49.3% | -80.92u | -10.03u |
| −1 | 65 | 34-30-1 | 53.1% | -1.60u | +1.97u |
| ≤ −2 | 27 | 7-20-0 | 25.9% | -24.00u | -13.74u |
| missing | 6 | 4-2-0 | 66.7% | +3.24u | +0.77u |

**By AGS tier** _(picks dated ≥ 2026-05-05, N = 717)_

| Bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| ELITE  (≥ +7) | 3 | 3-0-0 | 100.0% | +8.01u | +2.34u |
| LOCK   (+5 .. +7) | 9 | 5-4-0 | 55.6% | -2.93u | -0.47u |
| STRONG (+3 .. +5) | 23 | 13-10-0 | 56.5% | -6.91u | +1.77u |
| NEUT   (0 .. +3) | 448 | 231-215-2 | 51.8% | -91.44u | -12.04u |
| WEAK   (−1 .. 0) | 219 | 102-113-4 | 47.4% | -76.10u | -21.03u |
| FADE   (< −1) | 14 | 9-5-0 | 64.3% | +4.68u | +5.05u |
| missing | 1 | 1-0-0 | 100.0% | +1.63u | +0.96u |

---
## §3. Edge over time — is HC margin creating winners?

Daily cumulative peak-unit PnL since the HC margin launch (**2026-04-30**). The `HC ≥ +1` line is the golden-standard cohort. The `HC = 0` line is the no-HC-signal control. The `All shipped (HC era)` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.

```mermaid
xychart-beta
    title "Cumulative peak-unit PnL — HC era (2026-04-30+)"
    x-axis ["04-30", "05-01", "05-02", "05-03", "05-04", "05-05", "05-06", "05-07", "05-08", "05-09", "05-10", "05-11", "05-12", "05-13", "05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20", "05-21", "05-22", "05-23", "05-24", "05-25", "05-26", "05-27", "05-28", "05-29", "05-30", "05-31", "06-01", "06-02", "06-03", "06-04", "06-05", "06-06", "06-07", "06-08", "06-09", "06-10", "06-11", "06-12", "06-13", "06-14", "06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25"]
    y-axis "PnL (peak u)"
    line "HC ≥ +1" [-0.48, -2.48, -4.41, -3.94, -0.95, -5.45, -3.86, -3.18, 0.54, 4.41, 6.41, 6.25, 2.11, 9.78, 3.00, 3.27, 4.90, 1.62, -2.98, -10.18, -8.90, -14.92, -23.44, -23.30, -28.89, -32.63, -26.98, -29.77, -33.27, -44.12, -48.21, -40.65, -34.49, -30.14, -28.48, -25.53, -22.94, -25.33, -24.75, -21.34, -10.19, -14.95, -13.13, -10.30, -6.20, -6.21, -4.25, 4.40, 4.40, 3.98, 7.06, 9.08, 11.60, 15.45, 14.45, 15.59, 14.62]
    line "HC = 0"  [0.00, -0.50, -0.50, -0.50, -0.50, -0.34, 2.84, 2.84, 3.60, 3.60, 2.32, 1.05, -9.45, -13.95, -15.20, -16.83, -17.05, -15.11, -17.67, -16.17, -15.07, -14.58, -23.93, -16.53, -21.34, -20.03, -10.27, -14.68, -17.58, -11.51, -11.10, -17.79, -24.29, -24.19, -27.68, -32.54, -32.20, -29.06, -23.09, -21.30, -23.13, -30.43, -35.94, -35.44, -37.73, -54.41, -65.05, -83.05, -92.84, -90.33, -106.79, -110.78, -132.42, -142.67, -168.67, -190.87, -195.48]
    line "All (HC era)" [-0.48, -5.98, -7.91, -7.44, -4.95, -9.29, -4.52, -3.84, 0.64, 6.14, 6.86, 5.43, -9.21, -6.04, -14.07, -15.43, -14.02, -15.36, -22.52, -28.22, -25.84, -31.37, -49.24, -44.70, -55.10, -55.65, -40.24, -49.69, -53.57, -58.35, -62.03, -61.16, -58.77, -56.82, -56.00, -58.91, -48.76, -50.51, -46.96, -36.94, -22.86, -34.92, -38.09, -32.03, -30.22, -46.29, -54.97, -66.82, -79.11, -77.02, -90.52, -92.49, -111.61, -118.01, -145.01, -162.43, -168.01]
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
| 2026-06-15 | -4.25u | -65.05u | -54.97u |
| 2026-06-16 | +4.40u | -83.05u | -66.82u |
| 2026-06-17 | +4.40u | -92.84u | -79.11u |
| 2026-06-18 | +3.98u | -90.33u | -77.02u |
| 2026-06-19 | +7.06u | -106.79u | -90.52u |
| 2026-06-20 | +9.08u | -110.78u | -92.49u |
| 2026-06-21 | +11.60u | -132.42u | -111.61u |
| 2026-06-22 | +15.45u | -142.67u | -118.01u |
| 2026-06-23 | +14.45u | -168.67u | -145.01u |
| 2026-06-24 | +15.59u | -190.87u | -162.43u |
| 2026-06-25 | +14.62u | -195.48u | -168.01u |

---
## §4. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §4a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 87 | 67 | 24 | 36% | 31 | 12 | 4 |
| NBA | 138 | 108 | 44 | 41% | 60 | 29 | 11 |
| NHL | 60 | 43 | 12 | 28% | 24 | 12 | 6 |
| SOC | 89 | 55 | 44 | 80% | 43 | 36 | 28 |
| **ALL (any sport)** | **213** | **160** | **82** | **51%** | **93** | **42** | **23** |

### §4b. Daily roster growth (cumulative through each date)

Format: `tracked (profitable)`. For each date D, recompute the roster using every bet up to and including D.

| Date | ALL | MLB | NBA | NHL | SOC |
|---|---|---|---|---|---|
| 2026-04-18 | 5 (2) | 2 (2) | 3 (0) | 0 (0) | 0 (0) |
| 2026-04-19 | 19 (8) | 5 (3) | 9 (3) | 3 (1) | 0 (0) |
| 2026-04-20 | 29 (12) | 7 (6) | 23 (8) | 5 (2) | 0 (0) |
| 2026-04-21 | 44 (21) | 10 (6) | 31 (10) | 7 (5) | 0 (0) |
| 2026-04-22 | 52 (28) | 12 (6) | 39 (15) | 11 (10) | 0 (0) |
| 2026-04-23 | 56 (29) | 13 (6) | 46 (21) | 13 (10) | 0 (0) |
| 2026-04-24 | 61 (30) | 14 (6) | 51 (23) | 14 (9) | 0 (0) |
| 2026-04-25 | 65 (29) | 16 (8) | 54 (22) | 16 (9) | 0 (0) |
| 2026-04-26 | 67 (31) | 18 (5) | 56 (25) | 17 (9) | 0 (0) |
| 2026-04-27 | 72 (32) | 20 (7) | 60 (24) | 17 (9) | 0 (0) |
| 2026-04-28 | 76 (33) | 21 (7) | 63 (26) | 23 (10) | 0 (0) |
| 2026-04-29 | 77 (33) | 21 (7) | 64 (25) | 23 (10) | 0 (0) |
| 2026-04-30 | 81 (34) | 21 (7) | 70 (27) | 23 (10) | 0 (0) |
| 2026-05-01 | 85 (38) | 22 (5) | 74 (30) | 26 (13) | 0 (0) |
| 2026-05-02 | 86 (37) | 23 (7) | 75 (32) | 26 (12) | 0 (0) |
| 2026-05-03 | 86 (38) | 24 (8) | 75 (33) | 26 (12) | 0 (0) |
| 2026-05-04 | 90 (38) | 24 (9) | 76 (32) | 26 (12) | 0 (0) |
| 2026-05-05 | 91 (40) | 24 (9) | 79 (33) | 26 (12) | 0 (0) |
| 2026-05-06 | 92 (40) | 24 (9) | 80 (33) | 26 (12) | 0 (0) |
| 2026-05-07 | 92 (41) | 24 (9) | 80 (33) | 26 (12) | 0 (0) |
| 2026-05-08 | 92 (40) | 24 (8) | 80 (32) | 26 (11) | 0 (0) |
| 2026-05-09 | 94 (42) | 24 (8) | 82 (35) | 26 (11) | 0 (0) |
| 2026-05-10 | 94 (42) | 24 (8) | 82 (35) | 26 (11) | 0 (0) |
| 2026-05-11 | 96 (42) | 24 (8) | 84 (36) | 26 (11) | 0 (0) |
| 2026-05-12 | 100 (41) | 27 (9) | 86 (37) | 26 (11) | 0 (0) |
| 2026-05-13 | 102 (45) | 29 (11) | 88 (37) | 26 (11) | 0 (0) |
| 2026-05-14 | 102 (41) | 29 (11) | 88 (37) | 28 (12) | 0 (0) |
| 2026-05-15 | 103 (41) | 30 (10) | 88 (39) | 28 (12) | 0 (0) |
| 2026-05-16 | 105 (43) | 31 (12) | 88 (39) | 30 (14) | 0 (0) |
| 2026-05-17 | 105 (46) | 32 (11) | 88 (40) | 30 (14) | 0 (0) |
| 2026-05-18 | 105 (46) | 32 (10) | 88 (38) | 31 (15) | 0 (0) |
| 2026-05-19 | 105 (46) | 32 (12) | 88 (38) | 31 (15) | 0 (0) |
| 2026-05-20 | 106 (48) | 33 (12) | 88 (38) | 31 (16) | 0 (0) |
| 2026-05-21 | 106 (45) | 34 (12) | 88 (37) | 31 (14) | 0 (0) |
| 2026-05-22 | 106 (44) | 34 (10) | 88 (39) | 33 (16) | 0 (0) |
| 2026-05-23 | 111 (49) | 36 (10) | 90 (40) | 36 (19) | 0 (0) |
| 2026-05-24 | 117 (52) | 37 (12) | 94 (39) | 37 (16) | 0 (0) |
| 2026-05-25 | 120 (53) | 38 (13) | 95 (40) | 38 (16) | 0 (0) |
| 2026-05-26 | 122 (55) | 39 (14) | 97 (42) | 38 (16) | 0 (0) |
| 2026-05-27 | 123 (51) | 40 (12) | 97 (42) | 40 (14) | 0 (0) |
| 2026-05-28 | 124 (51) | 40 (12) | 99 (42) | 40 (14) | 0 (0) |
| 2026-05-29 | 125 (50) | 41 (12) | 99 (42) | 41 (12) | 0 (0) |
| 2026-05-30 | 126 (49) | 41 (12) | 101 (43) | 41 (12) | 0 (0) |
| 2026-05-31 | 126 (48) | 41 (11) | 101 (43) | 41 (12) | 0 (0) |
| 2026-06-01 | 129 (52) | 44 (14) | 101 (43) | 41 (12) | 0 (0) |
| 2026-06-02 | 130 (56) | 45 (16) | 101 (43) | 41 (13) | 0 (0) |
| 2026-06-03 | 132 (56) | 45 (14) | 102 (43) | 41 (13) | 0 (0) |
| 2026-06-04 | 132 (57) | 46 (14) | 102 (43) | 41 (14) | 0 (0) |
| 2026-06-05 | 132 (57) | 48 (15) | 102 (43) | 41 (14) | 0 (0) |
| 2026-06-06 | 132 (57) | 49 (15) | 102 (43) | 41 (14) | 0 (0) |
| 2026-06-07 | 133 (56) | 52 (16) | 102 (43) | 41 (14) | 0 (0) |
| 2026-06-08 | 135 (55) | 53 (16) | 103 (44) | 41 (14) | 0 (0) |
| 2026-06-09 | 135 (55) | 53 (15) | 103 (44) | 41 (14) | 0 (0) |
| 2026-06-10 | 135 (56) | 53 (15) | 105 (45) | 41 (14) | 0 (0) |
| 2026-06-11 | 135 (54) | 54 (16) | 105 (45) | 42 (13) | 0 (0) |
| 2026-06-12 | 135 (56) | 55 (17) | 105 (45) | 42 (13) | 0 (0) |
| 2026-06-13 | 136 (56) | 57 (17) | 108 (44) | 42 (13) | 0 (0) |
| 2026-06-14 | 136 (55) | 57 (18) | 108 (44) | 43 (12) | 2 (0) |
| 2026-06-15 | 136 (56) | 57 (19) | 108 (44) | 43 (12) | 2 (0) |
| 2026-06-16 | 141 (60) | 58 (20) | 108 (44) | 43 (12) | 13 (5) |
| 2026-06-17 | 143 (64) | 58 (19) | 108 (44) | 43 (12) | 18 (10) |
| 2026-06-18 | 145 (66) | 58 (20) | 108 (44) | 43 (12) | 24 (14) |
| 2026-06-19 | 145 (66) | 58 (20) | 108 (44) | 43 (12) | 29 (21) |
| 2026-06-20 | 147 (75) | 60 (19) | 108 (44) | 43 (12) | 33 (27) |
| 2026-06-21 | 147 (74) | 60 (19) | 108 (44) | 43 (12) | 35 (29) |
| 2026-06-22 | 153 (77) | 61 (20) | 108 (44) | 43 (12) | 42 (34) |
| 2026-06-23 | 156 (80) | 64 (20) | 108 (44) | 43 (12) | 44 (34) |
| 2026-06-24 | 160 (84) | 65 (22) | 108 (44) | 43 (12) | 52 (40) |
| 2026-06-25 | 160 (82) | 67 (24) | 108 (44) | 43 (12) | 55 (44) |

### §4c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 57be17 | 2 | 1 | 1 | 50.0% | +5.95 | +297.5% | $52.6K |
| 2 | f2f960 | 2 | 2 | 0 | 100.0% | +1.93 | +96.5% | $61.1K |
| 3 | daf4de | 2 | 2 | 0 | 100.0% | +1.74 | +87.2% | $4.0K |
| 4 | ad88a3 | 17 | 13 | 4 | 76.5% | +7.37 | +43.4% | $12.2K |
| 5 | e05213 | 15 | 11 | 4 | 73.3% | +6.08 | +40.5% | $278.1K |
| 6 | 913987 | 44 | 30 | 14 | 68.2% | +14.19 | +32.2% | $666.8K |
| 7 | dfa240 | 3 | 2 | 1 | 66.7% | +0.85 | +28.3% | $2.5K |
| 8 | ab39ae | 3 | 2 | 1 | 66.7% | +0.70 | +23.5% | -$606.8K |
| 9 | c9bba3 | 6 | 4 | 2 | 66.7% | +1.37 | +22.8% | -$17.7K |
| 10 | c668b3 | 19 | 12 | 7 | 63.2% | +4.14 | +21.8% | $1.0K |

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

#### SOC

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | daf4de | 2 | 2 | 0 | 100.0% | +25.11 | +1255.3% | $1.78M |
| 2 | 12c933 | 3 | 3 | 0 | 100.0% | +31.89 | +1063.0% | $134.6K |
| 3 | 59266e | 2 | 2 | 0 | 100.0% | +18.11 | +905.3% | $2.98M |
| 4 | 8da2ca | 3 | 3 | 0 | 100.0% | +19.59 | +653.0% | $910.6K |
| 5 | 7b4652 | 6 | 6 | 0 | 100.0% | +33.22 | +553.7% | $20.5K |
| 6 | cf627b | 2 | 2 | 0 | 100.0% | +10.69 | +534.5% | $427.6K |
| 7 | c9bba3 | 10 | 8 | 2 | 80.0% | +38.34 | +383.4% | $2.49M |
| 8 | 99059d | 2 | 2 | 0 | 100.0% | +6.96 | +348.1% | $668.4K |
| 9 | c668b3 | 5 | 3 | 2 | 60.0% | +16.38 | +327.6% | $39.9K |
| 10 | 2d2ca8 | 9 | 6 | 3 | 66.7% | +27.51 | +305.7% | $7.82M |

---
## §5. Proven-wallet roster growth & HC tracking

"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).

### §5a. Current proven-winner roster (snapshot)

Roster as of **2026-06-25** — wallets with ≥2 bets in the sport.

| Sport | Wallets seen | Eligible (≥2) | CONFIRMED | FLAT | Proven (C+F) | WR50 only | Conv % |
|---|---|---|---|---|---|---|---|
| MLB | 135 | 67 | 15 | 9 | **24** | 8 | 17.8% |
| NBA | 210 | 108 | 29 | 15 | **44** | 21 | 21.0% |
| NHL | 105 | 43 | 9 | 3 | **12** | 12 | 11.4% |
| SOC | 140 | 55 | 20 | 24 | **44** | 2 | 31.4% |
| **ALL** | **—** | **—** | **—** | **—** | **124** | **—** | **—** |

### §5b. Live whitelist drift check

Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.

| Sport | CONFIRMED (live · script) | FLAT (live · script) | WR50 (live · script) | Drift |
|---|---|---|---|---|
| MLB | 37 · 15 | 20 · 9 | 4 · 8 | +33 live |
| NBA | 58 · 29 | 25 · 15 | 23 · 21 | +39 live |
| NHL | 23 · 9 | 6 · 3 | 16 · 12 | +17 live |
| SOC | 23 · 20 | 27 · 24 | 4 · 2 | +6 live |

### §5c. Roster growth — 3d / 7d / 30d / all-time deltas

Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (`+Δ from N`). Negative = wallets demoted. Window endpoint = 2026-06-25.

| Sport | 3-day | 7-day | 30-day | All-time (since cutover) |
|---|---|---|---|---|
| MLB | +4 from 20 | +4 from 20 | +10 from 14 | +24 from 0 |
| NBA | +0 from 44 | +0 from 44 | +2 from 42 | +44 from 0 |
| NHL | +0 from 12 | +0 from 12 | -4 from 16 | +12 from 0 |
| SOC | +10 from 34 | +30 from 14 | +44 from 0 | +44 from 0 |

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
| MLB | 135 | 67 (50%) | 24 (36%) | 15 (63%) | **24** | edge (Eligible→Flat-OK) 64% |
| NBA | 210 | 108 (51%) | 44 (41%) | 29 (66%) | **44** | edge (Eligible→Flat-OK) 59% |
| NHL | 105 | 43 (41%) | 12 (28%) | 9 (75%) | **12** | edge (Eligible→Flat-OK) 72% |
| SOC | 140 | 55 (39%) | 44 (80%) | 20 (45%) | **44** | sample (Seen→Eligible) 61% |

### §5e. HC backing density (the fuel for v7.3 HC margin)

Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.

| Sport | Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|---|
| MLB | 3-day | 58 | 3 (5.2%) | 3 (5.2%) | 1 (1.7%) |
| MLB | 7-day | 126 | 11 (8.7%) | 9 (7.1%) | 1 (0.8%) |
| MLB | All-time | 645 | 173 (26.8%) | 158 (24.5%) | 19 (2.9%) |
| NBA | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NBA | 7-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NBA | All-time | 126 | 83 (65.9%) | 69 (54.8%) | 34 (27.0%) |
| NHL | 3-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NHL | 7-day | 0 | 0 (—) | 0 (—) | 0 (—) |
| NHL | All-time | 49 | 21 (42.9%) | 20 (40.8%) | 5 (10.2%) |
| SOC | 3-day | 11 | 5 (45.5%) | 5 (45.5%) | 2 (18.2%) |
| SOC | 7-day | 21 | 6 (28.6%) | 5 (23.8%) | 2 (9.5%) |
| SOC | All-time | 27 | 7 (25.9%) | 6 (22.2%) | 3 (11.1%) |

Pooled across sports:

| Window | Picks (with HC stamp) | Any HC for-side | HC_m ≥ +1 | HC_m ≥ +2 |
|---|---|---|---|---|
| 3-day | 69 | 8 (11.6%) | 8 (11.6%) | 3 (4.3%) |
| 7-day | 147 | 17 (11.6%) | 14 (9.5%) | 3 (2.0%) |
| All-time | 847 | 284 (33.5%) | 253 (29.9%) | 61 (7.2%) |

### §5f. Bubble wallets — next-up graduations

Wallets currently NOT promoted but close. Two flavors:

- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥2.
- **Just-under** — has ≥2 bets but flat ROI is between −10% and 0% (one win flips them).

#### MLB

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...020b` | 1 | +1.25 | 13 | -42% |
| `...be00` | 1 | +0.87 | 15 | 10% |
| `...9373` | 1 | +0.87 | 0 | — |
| `...9b3c` | 1 | +0.77 | 8 | 52% |
| `...8d26` | 1 | +0.72 | 5 | -22% |
| `...0f9a` | 1 | +0.54 | 5 | -13% |

**Just-under** (6)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...135d` | 360 | 52% | -0.3% | 375 | 7% |
| `...afd2` | 41 | 51% | -0.5% | 177 | -20% |
| `...2f63` | 145 | 50% | -2.0% | 1130 | -5% |
| `...1e50` | 114 | 51% | -3.2% | 359 | -0% |
| `...8c33` | 6 | 50% | -3.9% | 12 | -8% |
| `...1f30` | 51 | 47% | -4.2% | 78 | 12% |

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

#### SOC

**One-bet-away** (6)

| wallet | picksN | flat PnL | pos N | pos $ROI |
|---|---|---|---|---|
| `...d739` | 1 | +4.74 | 8 | -84% |
| `...821d` | 1 | +4.30 | 7 | -31% |
| `...1220` | 1 | +1.50 | 1 | 156% |
| `...aeeb` | 1 | +1.39 | 2 | 144% |
| `...2036` | 1 | +1.39 | 2 | 138% |
| `...1f30` | 1 | +1.25 | 1 | -100% |

**Just-under** (1)

| wallet | picksN | WR | flat ROI | pos N | pos $ROI |
|---|---|---|---|---|---|
| `...c991` | 2 | 50% | -8.3% | 7 | -100% |

### §5g. v2 wallet-promotion pipeline (Source-A / Source-B mix)

Live snapshot of the v2 promotion gate (shipped 2026-05-10, re-eval **2026-05-24**). Each FLAT-or-better wallet × sport pair is attributed to one of three paths via `sharpWalletProfiles[wallet].bySport[sport].whitelistSource`:

- **A** — flat-positive on featured picks (Source A) only — the v1 gate
- **A+B** — flat-positive in both sources (most reliable signal)
- **B** — flat-positive on-chain only (NEW in v2 — the trial lift)

Re-classified every 2h via `grade-sharp-actions` cron. Roll-back: set `B_ONLY_MIN_BETS = Infinity` in `scripts/exportWalletProfiles.js`.

#### Source mix per sport (live Firestore)

| Sport | A | A+B | B (new) | FLAT-or-better total | % from B-only |
|---|---|---|---|---|---|
| MLB | 12 | 16 | **29** | 57 | 50.9% |
| NBA | 10 | 34 | **39** | 83 | 47.0% |
| NHL | 4 | 8 | **17** | 29 | 58.6% |
| SOC | 26 | 18 | **6** | 50 | 12.0% |
| **ALL** | **52** | **76** | **91** | **219** | **41.6%** |

#### Pipeline freshness

- `sharp_action_positions` GRADED rows: **17377**
- `sharp_action_positions` PENDING rows: **241** (queued for next Grade Sharp Actions run)
- Latest `sharpWalletProfiles` rebuild: 6/26/2026, 6:21:55 AM ET — **295 min · STALE** — check grade-sharp-actions workflow

**Alarms**: pending > 200 OR rebuild lag > 4h → cron is lagging or failing — check `gh run list --workflow="Grade Sharp Actions"`.

#### B-only roster — wallets currently promoted via Source B path only

Wallets here would have been EXCLUDED under v1 (Source-A-only). Top by Source-B bet count per sport. The 2-week re-eval (2026-05-24) will compare these wallets' realized lift against A-only and A+B cohorts.

**MLB** — 29 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...9a27` | CONFIRMED | 467 | +12.3% | +4.4% |
| `...135d` | CONFIRMED | 375 | +2.1% | +6.8% |
| `...1e50` | FLAT | 359 | +1.7% | -0.4% |
| `...3532` | CONFIRMED | 324 | +1.6% | +6% |
| `...1eae` | FLAT | 147 | +3.1% | -1.4% |
| `...c684` | FLAT | 85 | +6.6% | -2.2% |
| `...1f30` | CONFIRMED | 78 | +2.3% | +11.5% |
| `...69c2` | CONFIRMED | 66 | +17.4% | +1% |
| `...ad50` | CONFIRMED | 56 | +19.2% | +14.4% |
| `...fc26` | CONFIRMED | 42 | +5.2% | +16.2% |
| … | 19 more | | | |

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

**SOC** — 6 wallets promoted via B

| wallet | tier | B_n | B_flat ROI | B_$ ROI |
|---|---|---|---|---|
| `...e8f1` | CONFIRMED | 21 | +55.1% | +18.5% |
| `...d2f7` | FLAT | 16 | +74.9% | -4.5% |
| `...00f2` | FLAT | 8 | +14.6% | -30.5% |
| `...1057` | CONFIRMED | 7 | +59.4% | +73.3% |
| `...1ebf` | FLAT | 5 | +34.5% | -13.5% |
| `...0ff5` | CONFIRMED | 5 | +156.4% | +97.3% |

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

Slate: **2026-06-25** · 71 bets · 30 distinct proven wallets · WR 54% · $ vol $4.14M · $ PnL -$2.29M.

| Wallet | Sport | Market | Game | $ size | Result | $ PnL |
|---|---|---|---|---|---|---|
| `...2d54` (FLAT) | SOC | ML | Sweden @ Japan | $166.4K | **W** | $208.0K |
| `...3f67` (CONFIRMED) | SOC | ML | Sweden @ Japan | $160.0K | **W** | $200.1K |
| `...2d54` (FLAT) | SOC | ML | Germany @ Ecuador | $110.5K | **W** | $71.3K |
| `...be17` (FLAT) | SOC | ML | Sweden @ Japan | $57.0K | **W** | $71.2K |
| `...a2ca` (FLAT) | SOC | ML | Sweden @ Japan | $43.9K | **W** | $54.9K |
| `...2f63` (CONFIRMED) | SOC | ML | Sweden @ Japan | $41.5K | **W** | $51.9K |
| `...23c4` (FLAT) | MLB | TOTAL | Texas Rangers @ Toronto Blue Jays | $50.6K | **W** | $46.0K |
| `...abaf` (CONFIRMED) | MLB | ML | Chicago Cubs @ New York Mets | $39.7K | **W** | $38.9K |
| `...abaf` (FLAT) | SOC | ML | Australia @ Paraguay | $16.4K | **W** | $26.8K |
| `...64aa` (CONFIRMED) | MLB | ML | Philadelphia Phillies @ Washington Nationals | $37.8K | **W** | $21.1K |
| `...8f33` (CONFIRMED) | MLB | ML | Philadelphia Phillies @ Washington Nationals | $32.9K | **W** | $18.4K |
| `...64aa` (CONFIRMED) | MLB | ML | Houston Astros @ Detroit Tigers | $17.3K | **W** | $18.1K |
| `...35e3` (FLAT) | SOC | ML | Sweden @ Japan | $11.3K | **W** | $14.2K |
| `...64aa` (CONFIRMED) | MLB | ML | Chicago Cubs @ New York Mets | $12.9K | **W** | $12.6K |
| `...8f33` (FLAT) | SOC | ML | Sweden @ Japan | $8.8K | **W** | $11.1K |
| `...4cdf` (FLAT) | SOC | ML | United States @ Türkiye | $10.0K | **W** | $10.5K |
| `...aeea` (FLAT) | SOC | ML | Sweden @ Japan | $7.7K | **W** | $9.6K |
| `...35e3` (FLAT) | MLB | ML | New York Yankees @ Boston Red Sox | $7.6K | **W** | $9.6K |
| `...35e3` (FLAT) | MLB | SPREAD | New York Yankees @ Boston Red Sox | $8.2K | **W** | $9.4K |
| `...35e3` (FLAT) | MLB | ML | Athletics @ San Francisco Giants | $1.7K | **W** | $7.7K |
| `...2a9e` (CONFIRMED) | SOC | ML | Netherlands @ Tunisia | $30.3K | **W** | $4.0K |
| `...11a4` (CONFIRMED) | SOC | ML | Sweden @ Japan | $2.0K | **W** | $2.5K |
| `...f4de` (CONFIRMED) | MLB | ML | Houston Astros @ Detroit Tigers | $2.4K | **W** | $2.5K |
| `...bba3` (CONFIRMED) | SOC | ML | Netherlands @ Tunisia | $18.0K | **W** | $2.4K |
| `...9d74` (FLAT) | SOC | ML | Sweden @ Japan | $1.8K | **W** | $2.2K |
| `...6418` (CONFIRMED) | SOC | ML | Sweden @ Japan | $1.1K | **W** | $1.3K |
| `...88a3` (CONFIRMED) | MLB | ML | Chicago Cubs @ New York Mets | $1.1K | **W** | $1.1K |
| `...11a4` (CONFIRMED) | SOC | ML | Côte d'Ivoire @ Curaçao | $4.4K | **W** | $840 |
| `...1e50` (CONFIRMED) | SOC | ML | Côte d'Ivoire @ Curaçao | $3.4K | **W** | $657 |
| `...35e3` (FLAT) | SOC | ML | Germany @ Ecuador | $900 | **W** | $581 |
| `...44b0` (FLAT) | SOC | ML | Côte d'Ivoire @ Curaçao | $2.7K | **W** | $513 |
| `...6418` (CONFIRMED) | SOC | ML | Côte d'Ivoire @ Curaçao | $1.7K | **W** | $319 |
| `...4652` (FLAT) | SOC | ML | Sweden @ Japan | $253 | **W** | $316 |
| `...8f33` (CONFIRMED) | MLB | SPREAD | Philadelphia Phillies @ Washington Nationals | $314 | **W** | $299 |
| `...6418` (CONFIRMED) | SOC | ML | Netherlands @ Tunisia | $1.8K | **W** | $237 |
| `...9d74` (FLAT) | SOC | ML | Netherlands @ Tunisia | $1.7K | **W** | $233 |
| `...381f` (CONFIRMED) | SOC | ML | Netherlands @ Tunisia | $1.5K | **W** | $197 |
| `...4652` (FLAT) | SOC | ML | Côte d'Ivoire @ Curaçao | $420 | **W** | $80 |
| `...1e50` (CONFIRMED) | SOC | ML | Australia @ Paraguay | $187 | L | -$187 |
| `...68b3` (FLAT) | MLB | ML | Philadelphia Phillies @ Washington Nationals | $279 | L | -$279 |
| `...1e50` (CONFIRMED) | SOC | ML | Sweden @ Japan | $290 | L | -$290 |
| `...6418` (CONFIRMED) | SOC | ML | Germany @ Ecuador | $1.3K | L | -$1.3K |
| `...eb4c` (CONFIRMED) | SOC | ML | Côte d'Ivoire @ Curaçao | $1.4K | L | -$1.4K |
| `...68b3` (FLAT) | SOC | ML | Germany @ Ecuador | $1.4K | L | -$1.4K |
| `...44b0` (FLAT) | SOC | ML | United States @ Türkiye | $2.2K | L | -$2.2K |
| `...1e50` (CONFIRMED) | SOC | ML | United States @ Türkiye | $2.4K | L | -$2.4K |
| `...9d74` (FLAT) | SOC | ML | Germany @ Ecuador | $2.5K | L | -$2.5K |
| `...68b3` (FLAT) | SOC | ML | Sweden @ Japan | $3.0K | L | -$3.0K |
| `...1e50` (CONFIRMED) | SOC | ML | Germany @ Ecuador | $3.2K | L | -$3.2K |
| `...35e3` (FLAT) | MLB | ML | Philadelphia Phillies @ Washington Nationals | $6.0K | L | -$6.0K |
| `...a6f5` (CONFIRMED) | SOC | ML | Germany @ Ecuador | $7.3K | L | -$7.3K |
| `...4d7d` (CONFIRMED) | SOC | ML | Germany @ Ecuador | $8.3K | L | -$8.3K |
| `...2a9e` (CONFIRMED) | SOC | ML | Australia @ Paraguay | $9.4K | L | -$9.4K |
| `...eb4c` (CONFIRMED) | SOC | ML | Germany @ Ecuador | $12.7K | L | -$12.7K |
| `...be17` (FLAT) | MLB | ML | Athletics @ San Francisco Giants | $20.0K | L | -$20.0K |
| `...eb4c` (CONFIRMED) | SOC | ML | United States @ Türkiye | $21.6K | L | -$21.6K |
| `...2a9e` (CONFIRMED) | SOC | ML | Sweden @ Japan | $22.1K | L | -$22.1K |
| `...64aa` (CONFIRMED) | MLB | ML | New York Yankees @ Boston Red Sox | $29.9K | L | -$29.9K |
| `...11a4` (CONFIRMED) | SOC | ML | Germany @ Ecuador | $37.2K | L | -$37.2K |
| `...23c4` (FLAT) | MLB | ML | Philadelphia Phillies @ Washington Nationals | $40.0K | L | -$40.0K |
| `...aeea` (FLAT) | SOC | ML | Germany @ Ecuador | $56.9K | L | -$56.9K |
| `...be17` (FLAT) | SOC | ML | United States @ Türkiye | $65.0K | L | -$65.0K |
| `...2f63` (CONFIRMED) | SOC | ML | Germany @ Ecuador | $115.6K | L | -$115.6K |
| `...2a9e` (CONFIRMED) | SOC | ML | Germany @ Ecuador | $123.6K | L | -$123.6K |
| `...2a9e` (CONFIRMED) | SOC | ML | United States @ Türkiye | $127.6K | L | -$127.6K |
| `...aeea` (FLAT) | SOC | ML | United States @ Türkiye | $131.9K | L | -$131.9K |
| `...020b` (FLAT) | SOC | ML | Germany @ Ecuador | $197.4K | L | -$197.4K |
| `...2ca8` (FLAT) | SOC | ML | Sweden @ Japan | $295.4K | L | -$295.4K |
| `...020b` (FLAT) | SOC | ML | United States @ Türkiye | $397.3K | L | -$397.3K |
| `...b2f4` (FLAT) | SOC | ML | Germany @ Ecuador | $605.8K | L | -$605.8K |
| `...2ca8` (FLAT) | SOC | ML | Germany @ Ecuador | $875.3K | L | -$875.3K |

### §6b. Proven-wallet leaderboard

Top 15 proven `(wallet × sport)` pairs per sport per horizon, ranked by **$ PnL** (the dollar-ROI lens). The 3-day board is the "who's on form right now" lens; the 7-day filters single-day variance; all-time is the proven-roster reference.

#### §6b-1. 3-day

**MLB** — 14 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...23c4` | FLAT | 10 | 70% | 3.3 | +3.56 | +36% | $339.2K | $129.2K | +38% | 1W |
| 2 | `...39ae` | CONFIRMED | 2 | 100% | 1.0 | +1.70 | +85% | $98.8K | $84.1K | +85% | 2W |
| 3 | `...f960` | CONFIRMED | 2 | 100% | 2.0 | +1.93 | +96% | $61.1K | $61.1K | +100% | 2W |
| 4 | `...35e3` | FLAT | 9 | 56% | 3.0 | +4.59 | +51% | $52.2K | $12.2K | +23% | 1L |
| 5 | `...0ff5` | FLAT | 1 | 100% | 1.0 | +1.20 | +120% | $4.1K | $4.9K | +120% | 1W |
| 6 | `...f4de` | CONFIRMED | 2 | 100% | 1.0 | +1.74 | +87% | $4.6K | $4.0K | +88% | 2W |
| 7 | `...d227` | CONFIRMED | 4 | 50% | 2.0 | -0.94 | -23% | $31.3K | $3.1K | +10% | 1L |
| 8 | `...abaf` | CONFIRMED | 5 | 60% | 1.7 | +1.10 | +22% | $185.0K | $2.8K | +2% | 2W |
| 9 | `...88a3` | CONFIRMED | 2 | 100% | 1.0 | +2.43 | +122% | $2.1K | $2.6K | +120% | 2W |
| 10 | `...618e` | CONFIRMED | 1 | 100% | 1.0 | +0.95 | +95% | $711 | $677 | +95% | 1W |
| 11 | `...68b3` | FLAT | 2 | 50% | 1.0 | +0.02 | +1% | $939 | $394 | +42% | 1L |
| 12 | `...8f33` | CONFIRMED | 23 | 52% | 7.7 | -0.47 | -2% | $116.5K | -$10.7K | -9% | 2W |
| 13 | `...64aa` | CONFIRMED | 12 | 42% | 4.0 | -1.97 | -16% | $227.9K | -$12.8K | -6% | 1W |
| 14 | `...be17` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $20.0K | -$20.0K | -100% | 1L |

**SOC** — 30 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...266e` | CONFIRMED | 1 | 100% | 1.0 | +18.00 | +1800% | $164.9K | $2.97M | +1800% | 1W |
| 2 | `...2ca8` | FLAT | 5 | 40% | 1.7 | +15.95 | +319% | $1.75M | $969.8K | +55% | 2L |
| 3 | `...a2ca` | FLAT | 3 | 100% | 1.0 | +19.59 | +653% | $286.0K | $910.6K | +318% | 3W |
| 4 | `...2d54` | FLAT | 2 | 100% | 2.0 | +1.90 | +95% | $276.9K | $279.3K | +101% | 2W |
| 5 | `...3f67` | CONFIRMED | 1 | 100% | 1.0 | +1.25 | +125% | $160.0K | $200.1K | +125% | 1W |
| 6 | `...44b0` | FLAT | 3 | 67% | 1.0 | +17.19 | +573% | $13.2K | $149.3K | +1127% | 1L |
| 7 | `...024e` | FLAT | 2 | 50% | 2.0 | +3.30 | +165% | $25.1K | $65.0K | +260% | 1W |
| 8 | `...abaf` | FLAT | 1 | 100% | 1.0 | +1.63 | +163% | $16.4K | $26.8K | +163% | 1W |
| 9 | `...bba3` | CONFIRMED | 3 | 100% | 1.5 | +0.76 | +25% | $68.0K | $17.8K | +26% | 3W |
| 10 | `...11a4` | CONFIRMED | 9 | 67% | 3.0 | +1.52 | +17% | $199.9K | $15.9K | +8% | 1W |
| 11 | `...0288` | CONFIRMED | 1 | 100% | 1.0 | +0.41 | +41% | $37.6K | $15.4K | +41% | 1W |
| 12 | `...35e3` | FLAT | 2 | 100% | 2.0 | +1.90 | +95% | $12.2K | $14.8K | +121% | 2W |
| 13 | `...4cdf` | FLAT | 1 | 100% | 1.0 | +1.05 | +105% | $10.0K | $10.5K | +105% | 1W |
| 14 | `...8f33` | FLAT | 2 | 50% | 1.0 | +0.25 | +13% | $11.3K | $8.6K | +75% | 1W |
| 15 | `...be17` | FLAT | 2 | 50% | 2.0 | +0.25 | +13% | $122.0K | $6.3K | +5% | 1L |

#### §6b-2. 7-day

**MLB** — 17 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 15 | 80% | 2.1 | +7.29 | +49% | $671.4K | $393.4K | +59% | 2W |
| 2 | `...23c4` | FLAT | 17 | 82% | 2.4 | +10.20 | +60% | $442.4K | $231.1K | +52% | 1W |
| 3 | `...f960` | CONFIRMED | 2 | 100% | 2.0 | +1.93 | +96% | $61.1K | $61.1K | +100% | 2W |
| 4 | `...64aa` | CONFIRMED | 29 | 55% | 4.1 | +0.80 | +3% | $540.3K | $59.3K | +11% | 1W |
| 5 | `...5213` | CONFIRMED | 1 | 100% | 1.0 | +0.91 | +91% | $58.2K | $52.9K | +91% | 1W |
| 6 | `...d227` | CONFIRMED | 13 | 69% | 2.2 | +2.85 | +22% | $94.0K | $40.8K | +43% | 1L |
| 7 | `...35e3` | FLAT | 11 | 55% | 1.8 | +4.48 | +41% | $62.7K | $16.7K | +27% | 1L |
| 8 | `...618e` | CONFIRMED | 3 | 67% | 0.8 | +0.61 | +20% | $9.6K | $5.8K | +61% | 1W |
| 9 | `...88a3` | CONFIRMED | 6 | 83% | 0.9 | +3.44 | +57% | $8.6K | $4.9K | +57% | 3W |
| 10 | `...f4de` | CONFIRMED | 2 | 100% | 1.0 | +1.74 | +87% | $4.6K | $4.0K | +88% | 2W |
| 11 | `...68b3` | FLAT | 3 | 67% | 0.8 | +0.98 | +33% | $1.3K | $746 | +57% | 1L |
| 12 | `...381f` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $1.1K | -$1.1K | -100% | 1L |
| 13 | `...aeea` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $1.6K | -$1.6K | -100% | 1L |
| 14 | `...0ff5` | FLAT | 6 | 33% | 1.2 | -1.32 | -22% | $45.5K | -$11.9K | -26% | 1W |
| 15 | `...be17` | FLAT | 1 | 0% | 1.0 | -1.00 | -100% | $20.0K | -$20.0K | -100% | 1L |

**SOC** — 41 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | FLAT | 8 | 63% | 1.3 | +27.19 | +340% | $3.22M | $7.80M | +242% | 2L |
| 2 | `...266e` | CONFIRMED | 2 | 100% | 1.0 | +18.11 | +905% | $315.4K | $2.98M | +946% | 2W |
| 3 | `...bba3` | CONFIRMED | 6 | 83% | 0.9 | +24.86 | +414% | $218.6K | $1.90M | +869% | 4W |
| 4 | `...f4de` | CONFIRMED | 2 | 100% | 0.5 | +25.11 | +1255% | $106.1K | $1.78M | +1681% | 2W |
| 5 | `...2f63` | CONFIRMED | 10 | 70% | 1.4 | +18.84 | +188% | $829.3K | $1.58M | +191% | 1W |
| 6 | `...aeea` | FLAT | 12 | 67% | 1.7 | +22.99 | +192% | $714.1K | $1.58M | +221% | 1L |
| 7 | `...020b` | FLAT | 9 | 33% | 1.3 | +6.08 | +68% | $975.4K | $1.33M | +136% | 2L |
| 8 | `...11a4` | CONFIRMED | 19 | 68% | 2.7 | +19.63 | +103% | $472.4K | $1.24M | +262% | 1W |
| 9 | `...abaf` | FLAT | 5 | 80% | 0.7 | +12.47 | +249% | $554.3K | $1.20M | +217% | 1W |
| 10 | `...2a9e` | CONFIRMED | 18 | 50% | 2.6 | +11.46 | +64% | $768.8K | $1.10M | +143% | 2L |
| 11 | `...a2ca` | FLAT | 3 | 100% | 1.0 | +19.59 | +653% | $286.0K | $910.6K | +318% | 3W |
| 12 | `...e279` | CONFIRMED | 2 | 100% | 1.0 | +5.45 | +273% | $250.0K | $782.3K | +313% | 2W |
| 13 | `...059d` | CONFIRMED | 2 | 100% | 1.0 | +6.96 | +348% | $171.5K | $668.4K | +390% | 2W |
| 14 | `...627b` | CONFIRMED | 2 | 100% | 0.5 | +10.69 | +535% | $80.0K | $427.6K | +534% | 2W |
| 15 | `...3f67` | CONFIRMED | 2 | 100% | 0.5 | +2.64 | +132% | $281.5K | $368.9K | +131% | 2W |

#### §6b-3. All-time

**MLB** — 24 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...abaf` | CONFIRMED | 73 | 58% | 1.8 | +14.37 | +20% | $2.06M | $1.27M | +62% | 2W |
| 2 | `...3987` | CONFIRMED | 44 | 68% | 4.0 | +14.19 | +32% | $2.29M | $666.8K | +29% | 1L |
| 3 | `...64aa` | CONFIRMED | 271 | 55% | 4.0 | +3.69 | +1% | $4.84M | $278.4K | +6% | 1W |
| 4 | `...5213` | CONFIRMED | 15 | 73% | 0.7 | +6.08 | +41% | $599.4K | $278.1K | +46% | 1W |
| 5 | `...fc82` | FLAT | 27 | 52% | 0.5 | +0.41 | +2% | $556.2K | $139.9K | +25% | 1L |
| 6 | `...d227` | CONFIRMED | 35 | 63% | 0.7 | +7.23 | +21% | $305.7K | $78.3K | +26% | 1L |
| 7 | `...f960` | CONFIRMED | 2 | 100% | 2.0 | +1.93 | +96% | $61.1K | $61.1K | +100% | 2W |
| 8 | `...8f33` | CONFIRMED | 145 | 54% | 4.4 | +2.38 | +2% | $784.0K | $60.3K | +8% | 2W |
| 9 | `...be17` | FLAT | 2 | 50% | 0.1 | +5.95 | +298% | $30.4K | $52.6K | +173% | 1L |
| 10 | `...5143` | CONFIRMED | 10 | 50% | 0.4 | +0.27 | +3% | $317.6K | $26.2K | +8% | 1W |
| 11 | `...1187` | FLAT | 8 | 63% | 2.7 | +1.65 | +21% | $30.5K | $13.5K | +44% | 1W |
| 12 | `...88a3` | CONFIRMED | 17 | 76% | 0.7 | +7.37 | +43% | $34.7K | $12.2K | +35% | 3W |
| 13 | `...aeea` | FLAT | 18 | 56% | 0.3 | +0.91 | +5% | $46.9K | $11.7K | +25% | 1L |
| 14 | `...618e` | CONFIRMED | 3 | 67% | 0.8 | +0.61 | +20% | $9.6K | $5.8K | +61% | 1W |
| 15 | `...f4de` | CONFIRMED | 2 | 100% | 1.0 | +1.74 | +87% | $4.6K | $4.0K | +88% | 2W |

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

**SOC** — 44 active proven wallets

| # | Wallet | Tier | Bets | WR% | Bets/day | Flat PnL (u) | Flat ROI | $ vol | $ PnL | $ ROI | Streak |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `...2ca8` | FLAT | 9 | 67% | 1.1 | +27.51 | +306% | $3.30M | $7.82M | +237% | 2L |
| 2 | `...266e` | CONFIRMED | 2 | 100% | 1.0 | +18.11 | +905% | $315.4K | $2.98M | +946% | 2W |
| 3 | `...bba3` | CONFIRMED | 10 | 80% | 1.0 | +38.34 | +383% | $380.6K | $2.49M | +653% | 4W |
| 4 | `...11a4` | CONFIRMED | 29 | 69% | 2.9 | +33.25 | +115% | $698.4K | $1.98M | +284% | 1W |
| 5 | `...f4de` | CONFIRMED | 2 | 100% | 0.5 | +25.11 | +1255% | $106.1K | $1.78M | +1681% | 2W |
| 6 | `...2f63` | CONFIRMED | 20 | 55% | 2.0 | +27.73 | +139% | $1.46M | $1.61M | +110% | 1W |
| 7 | `...aeea` | FLAT | 18 | 61% | 1.8 | +22.45 | +125% | $772.7K | $1.60M | +207% | 1L |
| 8 | `...020b` | FLAT | 12 | 33% | 1.2 | +5.21 | +43% | $997.5K | $1.31M | +131% | 2L |
| 9 | `...abaf` | FLAT | 7 | 71% | 0.9 | +12.31 | +176% | $600.3K | $1.23M | +205% | 1W |
| 10 | `...2a9e` | CONFIRMED | 24 | 50% | 2.2 | +10.26 | +43% | $789.6K | $1.10M | +139% | 2L |
| 11 | `...a2ca` | FLAT | 3 | 100% | 1.0 | +19.59 | +653% | $286.0K | $910.6K | +318% | 3W |
| 12 | `...e279` | CONFIRMED | 2 | 100% | 1.0 | +5.45 | +273% | $250.0K | $782.3K | +313% | 2W |
| 13 | `...059d` | CONFIRMED | 2 | 100% | 1.0 | +6.96 | +348% | $171.5K | $668.4K | +390% | 2W |
| 14 | `...2d54` | FLAT | 4 | 75% | 0.5 | +1.73 | +43% | $646.2K | $467.8K | +72% | 2W |
| 15 | `...627b` | CONFIRMED | 2 | 100% | 0.5 | +10.69 | +535% | $80.0K | $427.6K | +534% | 2W |

### §6c. Active streaks (≥3 in a row, last bet within 3 days)

Proven `(wallet × sport)` pairs currently riding a 3-or-more-bet run with their most recent bet inside the last 3 calendar days. Hot-hand monitor — and the same surface for cold streaks worth fading.

| Wallet | Sport | Tier | Streak | Last bet | All-time bets | WR% | $ PnL | $ ROI |
|---|---|---|---|---|---|---|---|---|
| `...4cdf` | SOC | FLAT | **8W** | 2026-06-25 | 8 | 100% | $166.4K | +175% |
| `...4652` | SOC | FLAT | **6W** | 2026-06-25 | 6 | 100% | $20.5K | +450% |
| `...bba3` | SOC | CONFIRMED | **4W** | 2026-06-25 | 10 | 80% | $2.49M | +653% |
| `...eb4c` | SOC | CONFIRMED | **4L** | 2026-06-25 | 13 | 46% | $118.2K | +109% |
| `...a2ca` | SOC | FLAT | **3W** | 2026-06-25 | 3 | 100% | $910.6K | +318% |
| `...c933` | SOC | CONFIRMED | **3W** | 2026-06-22 | 3 | 100% | $134.6K | +1172% |
| `...88a3` | MLB | CONFIRMED | **3W** | 2026-06-25 | 17 | 76% | $12.2K | +35% |
| `...1e50` | SOC | CONFIRMED | **3L** | 2026-06-25 | 32 | 47% | $6.4K | +10% |

### §6d. Daily proven-wallet volume (trailing 14 graded days)

Per-day bet count, $ volume, and $ PnL from proven wallets only. Helps spot slate-density swings — a spike in one sport's volume = the proven cohort sees something on that night's board.

| Date | TOTAL N · $vol · $PnL | MLB N · $vol · $PnL | NBA N · $vol · $PnL | NHL N · $vol · $PnL | SOC N · $vol · $PnL |
|---|---|---|---|---|---|
| 2026-06-12 | 22 · $260.6K · -$10.5K | 22 · $260.6K · -$10.5K | — | — | — |
| 2026-06-13 | 44 · $1.22M · -$760.2K | 26 · $270.2K · $56.6K | 18 · $954.4K · -$816.8K | — | — |
| 2026-06-14 | 26 · $210.2K · -$20.1K | 19 · $130.7K · -$39.1K | — | 3 · $65.7K · $22.2K | 4 · $13.7K · -$3.2K |
| 2026-06-15 | 31 · $353.1K · -$61.1K | 27 · $336.5K · -$46.5K | — | — | 4 · $16.6K · -$14.5K |
| 2026-06-16 | 56 · $1.45M · $1.48M | 29 · $502.0K · -$155.7K | — | — | 27 · $944.8K · $1.63M |
| 2026-06-17 | 43 · $940.0K · $188.3K | 19 · $177.0K · -$65.2K | — | — | 24 · $763.0K · $253.5K |
| 2026-06-18 | 46 · $1.17M · $510.9K | 12 · $183.6K · $34.2K | — | — | 34 · $983.6K · $476.7K |
| 2026-06-19 | 60 · $1.48M · $5.24M | 27 · $268.9K · $101.7K | — | — | 33 · $1.21M · $5.13M |
| 2026-06-20 | 34 · $2.47M · $7.15M | 14 · $802.3K · -$643.0K | — | — | 20 · $1.67M · $7.79M |
| 2026-06-21 | 43 · $765.4K · $759.1K | 25 · $594.9K · $329.9K | — | — | 18 · $170.5K · $429.2K |
| 2026-06-22 | 61 · $2.92M · $10.35M | 22 · $259.4K · $144.5K | — | — | 39 · $2.66M · $10.21M |
| 2026-06-23 | 32 · $658.8K · $5.57M | 26 · $342.4K · -$76.5K | — | — | 6 · $316.4K · $5.65M |
| 2026-06-24 | 72 · $1.90M · $1.19M | 33 · $493.2K · $248.4K | — | — | 39 · $1.40M · $945.4K |
| 2026-06-25 | 71 · $4.14M · -$2.29M | 17 · $308.8K · $89.6K | — | — | 54 · $3.83M · -$2.38M |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · QUALITY_CONTRIB_CUT = 30 · HC = CONFIRMED ∧ sizeRatio ≥ 1.5 · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror `exportWalletProfiles.js` · §6 daily proven-wallet board uses today's roster (CONFIRMED ∪ FLAT) as-of 2026-06-25_
