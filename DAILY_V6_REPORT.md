# Sharp Intel v6 — Daily Master Report

_Auto-generated **4/30/2026, 10:52:57 AM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). Cohort tags (1/1, 2/2, …) come from frozen `v8_walletConsensus*` stamps written at last sync before the T-15 freeze. Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (124 profiles — display only) · quality cut: contribution ≥ 30.

---
## §1. Sample summary

| Metric | Value |
|---|---|
| Graded sides scanned | 241 |
| Graded sides w/ outcome | 225 |
| **SHIPPED (matches dashboard)** | **111** |
| · of which lockStage = LOCKED | 109 |
| · of which lockStage = null/other | 2 |
| · with frozen Δw stamp | 106 |
| · with frozen Δq stamp | 46 |
| · Δq recomputed from walletDetails (contribution-only) | 59 |
| · uncategorized (no Δw stamp) | 5 |
| Sharp Vault hidden-star positions | 1214 |
| Unique wallets observed | 103 |
| Graded date range | 2026-04-18 … 2026-04-29 |
| Sports represented | MLB, NBA, NHL |
| Markets represented | ML, SPREAD, TOTAL |

| Cohort | N | W-L-P | WR% | PnL (peak units) | PnL (flat 1u) |
|---|---|---|---|---|---|
| All graded sides | 225 | 107-114-4 | 48.4% | -9.14u | -12.76u |
| **SHIPPED (dashboard-equivalent)** | **111** | **50-60-1** | **45.5%** | **-12.23u** | **-9.75u** |
| · of shipped, frozen Δw≥+1 ∧ Δq≥+1 | 76 | 39-37-0 | 51.3% | +3.76u | +4.35u |

---
## §2. Daily PnL by (frozen Δw × Δq) cohort

Every column counts only **shipped** picks (the dashboard set). Cohort tag is the **frozen** Δw / Δq at last write before the T-15 freeze. Picks lacking a Δw stamp are lumped into `Uncat`. PnL in peak units. Cumulative running PnL is on the rightmost column.

| Date | TOTAL N · WR · PnL | LOCK (1/1+) PnL | SUPER TOP | TOP | FLOOR-A (1/1) | FLOOR-B (1/≥2) | SUB-FLOOR | STALE Δw=0 | STALE Δw≤−1 | Uncat | Cum Total PnL |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-18 | 12 · 50% · +2.67u | **4 · 75% · +2.56u** | 1 · 100% · +2.00u | 2 · 50% · +0.03u | — | 1 · 100% · +0.53u | — | 3 · 0% · -2.25u | — | 5 · 60% · +2.36u | +2.67u |
| 2026-04-19 | 6 · 67% · +4.39u | **4 · 100% · +7.39u** | 4 · 100% · +7.39u | — | — | — | — | 2 · 0% · -3.00u | — | — | +7.06u |
| 2026-04-20 | 16 · 50% · -3.21u | **7 · 57% · -0.59u** | 3 · 33% · -0.24u | — | 1 · 100% · +0.75u | 3 · 67% · -1.10u | — | 5 · 60% · -0.40u | 4 · 25% · -2.22u | — | +3.85u |
| 2026-04-21 | 16 · 31% · -7.44u | **8 · 63% · +4.06u** | 6 · 67% · +5.03u | — | 1 · 100% · +0.53u | 1 · 0% · -1.50u | — | 5 · 0% · -8.75u | 3 · 0% · -2.75u | — | -3.59u |
| 2026-04-22 | 8 · 50% · +1.13u | **4 · 50% · +0.99u** | 1 · 100% · +1.82u | — | 1 · 0% · -1.10u | 2 · 50% · +0.27u | — | 4 · 50% · +0.14u | — | — | -2.46u |
| 2026-04-23 | 7 · 43% · -1.18u | **5 · 40% · -1.06u** | 1 · 0% · -1.75u | — | 1 · 0% · -1.35u | 3 · 67% · +2.04u | — | 2 · 50% · -0.12u | — | — | -3.64u |
| 2026-04-24 | 6 · 80% · +3.08u | **4 · 75% · +2.08u** | 1 · 0% · -2.00u | 1 · 100% · +2.94u | 1 · 100% · +0.45u | 1 · 100% · +0.69u | — | 2 · 100% · +1.00u | — | — | -0.56u |
| 2026-04-25 | 7 · 14% · -8.35u | **7 · 14% · -8.35u** | 3 · 0% · -8.00u | 1 · 100% · +2.40u | 1 · 0% · -0.75u | 2 · 0% · -2.00u | — | — | — | — | -8.91u |
| 2026-04-26 | 10 · 50% · -2.04u | **10 · 50% · -2.04u** | 1 · 100% · +1.03u | 3 · 33% · -3.18u | 2 · 0% · -1.50u | 4 · 75% · +1.61u | — | — | — | — | -10.95u |
| 2026-04-27 | 6 · 50% · -1.63u | **6 · 50% · -1.63u** | 4 · 50% · -1.66u | — | — | 2 · 50% · +0.03u | — | — | — | — | -12.58u |
| 2026-04-28 | 10 · 40% · -3.19u | **10 · 40% · -3.19u** | 5 · 20% · -4.68u | 3 · 67% · +1.66u | — | 2 · 50% · -0.17u | — | — | — | — | -15.77u |
| 2026-04-29 | 7 · 43% · +3.54u | **7 · 43% · +3.54u** | 3 · 100% · +5.54u | — | — | 4 · 0% · -2.00u | — | — | — | — | -12.23u |

### Cohort cumulative roll-up — shipped picks only

| Cohort | N | W-L-P | WR% | PnL (peak units) | PnL (flat 1u) |
|---|---|---|---|---|---|
| **SUPER TOP (Δw≥+2 ∧ Δq≥+2)** | 33 | 18-15-0 | 54.5% | +4.48u | +6.94u |
| **TOP (Δw≥+2 ∧ Δq≤+1)** | 10 | 6-4-0 | 60.0% | +3.85u | +2.16u |
| **FLOOR-B (Δw=+1 ∧ Δq≥+2)** | 25 | 12-13-0 | 48.0% | -1.60u | -1.94u |
| **FLOOR-A (Δw=+1 ∧ Δq=+1)** | 8 | 3-5-0 | 37.5% | -2.97u | -2.81u |
| SUB-FLOOR (Δw=+1 ∧ Δq≤0) | 0 | — | — | — | — |
| STALE Δw=0 (winners flat) | 23 | 7-15-1 | 31.8% | -13.38u | -9.05u |
| STALE Δw≤−1 (winners fading/killed) | 7 | 1-6-0 | 14.3% | -4.97u | -4.94u |
| Uncategorized (no Δw stamp) | 5 | 3-2-0 | 60.0% | +2.36u | -0.12u |

---
## §3. Frozen Vault-Star bucket performance

Shipped picks bucketed by their frozen `v8_vaultStar` value (or by `peak.stars` when v8_vaultStar wasn't stamped). PnL in peak units.

| Vault-Star bucket | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) | Avg odds |
|---|---|---|---|---|---|---|
| 5.0★ (ELITE) | 29 | 14-15-0 | 48.3% | -10.27u | -4.85u | -86 |
| 4.5★ | 8 | 5-3-0 | 62.5% | +5.40u | +3.13u | -68 |
| 4.0★ | 12 | 6-6-0 | 50.0% | +0.99u | +0.15u | -107 |
| 3.5★ (LOCK FLR) | 24 | 9-15-0 | 37.5% | -1.27u | -2.14u | +21 |
| 3.0★ | 17 | 6-10-1 | 37.5% | -4.55u | -3.69u | -94 |
| 2.5★ | 21 | 10-11-0 | 47.6% | -2.53u | -2.36u | -59 |
| ≤2.0★ | 0 | — | — | — | — | — |

### Elite (≥4.5★) by sport

| Sport | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| MLB | 9 | 4-5-0 | 44.4% | -2.73u | -1.76u |
| NBA | 26 | 14-12-0 | 53.8% | -2.08u | +0.03u |
| NHL | 2 | 1-1-0 | 50.0% | -0.06u | +0.02u |

### Daily Vault-Star PnL band

Per-day peak-unit PnL split into three star bands.

| Date | 5★ N · PnL | 4.5–4.0★ N · PnL | ≤3.5★ N · PnL | TOTAL PnL |
|---|---|---|---|---|
| 2026-04-18 | 2 · +2.75u | 3 · +2.11u | 7 · -2.19u | +2.67u |
| 2026-04-19 | 1 · -2.00u | 2 · +4.97u | 3 · +1.42u | +4.39u |
| 2026-04-20 | — | 2 · -3.50u | 14 · +0.29u | -3.21u |
| 2026-04-21 | 1 · -3.00u | 4 · -2.00u | 11 · -2.44u | -7.44u |
| 2026-04-22 | 1 · +0.77u | 1 · +1.82u | 6 · -1.46u | +1.13u |
| 2026-04-23 | — | 2 · +0.04u | 5 · -1.22u | -1.18u |
| 2026-04-24 | 2 · +0.94u | — | 4 · +2.14u | +3.08u |
| 2026-04-25 | 4 · -5.60u | 1 · -1.25u | 2 · -1.50u | -8.35u |
| 2026-04-26 | 4 · -2.15u | 3 · +2.11u | 3 · -2.00u | -2.04u |
| 2026-04-27 | 4 · -1.66u | 1 · -0.75u | 1 · +0.78u | -1.63u |
| 2026-04-28 | 8 · -3.02u | — | 2 · -0.17u | -3.19u |
| 2026-04-29 | 2 · +2.70u | 1 · +2.84u | 4 · -2.00u | +3.54u |

---
## §4. Sharp Vault hidden-star performance (`sharp_action_positions.v8_stars`)

This is the Sharp Vault-only check from the hidden `v8_stars` field on individual `sharp_action_positions`. It excludes `vaultQualified=false` shadow rows and includes only graded WIN/LOSS positions since the v6 cutover.

### §4a. Hidden-star win rates

| Hidden star band | N | W-L | WR% | Total invested | Total PnL | $ ROI |
|---|---|---|---|---|---|---|
| 5★ | 69 | 39-30 | 56.5% | $6.81M | -$115.1K | -1.7% |
| 4★ | 218 | 112-106 | 51.4% | $19.94M | $331.7K | +1.7% |
| 3★ | 411 | 222-189 | 54.0% | $35.13M | $1.43M | +4.1% |
| 2★ | 414 | 201-213 | 48.6% | $28.29M | -$1.10M | -3.9% |
| <2★ | 102 | 45-57 | 44.1% | $5.54M | $47.5K | +0.9% |
| **4★+ combined** | **287** | **151-136** | **52.6%** | **$26.75M** | **$216.5K** | **+0.8%** |
| **<4★ combined** | **927** | **468-459** | **50.5%** | **$68.97M** | **$368.8K** | **+0.5%** |

### §4b. 5★ / 4★ hidden-star performance by sport

| Sport | 5★ N · WR · $ROI · PnL | 4★ N · WR · $ROI · PnL | 4★+ combined |
|---|---|---|---|
| MLB | — | 1 · 100% · +49% · $4.7K | **1 · 100% · +49% · $4.7K** |
| NBA | 69 · 57% · -2% · -$115.1K | 203 · 51% · +1% · $238.7K | **272 · 52% · +0% · $123.6K** |
| NHL | — | 14 · 57% · +5% · $88.2K | **14 · 57% · +5% · $88.2K** |

### §4c. Daily 4★+ Sharp Vault timeline

| Date | 4★+ N | W-L | WR% | $ ROI | PnL |
|---|---|---|---|---|---|
| 2026-04-18 | 11 | 3-8 | 27.3% | -20.6% | -$441.2K |
| 2026-04-19 | 25 | 15-10 | 60.0% | -3.7% | -$71.4K |
| 2026-04-20 | 9 | 5-4 | 55.6% | +37.1% | $265.5K |
| 2026-04-21 | 37 | 15-22 | 40.5% | +3.5% | $133.9K |
| 2026-04-22 | 30 | 16-14 | 53.3% | +1.2% | $35.5K |
| 2026-04-23 | 14 | 9-5 | 64.3% | +35.0% | $449.0K |
| 2026-04-24 | 30 | 12-18 | 40.0% | -19.3% | -$366.8K |
| 2026-04-25 | 11 | 6-5 | 54.5% | -7.9% | -$84.6K |
| 2026-04-26 | 50 | 27-23 | 54.0% | +1.2% | $44.6K |
| 2026-04-27 | 15 | 7-8 | 46.7% | -17.9% | -$250.8K |
| 2026-04-28 | 38 | 24-14 | 63.2% | +9.0% | $473.5K |
| 2026-04-29 | 17 | 12-5 | 70.6% | +4.0% | $29.3K |

---
## §5. Frozen Δw × Δq win matrix — shipped picks

Shipped picks only. Frozen `v8_walletConsensusDelta` (rows) × frozen `v8_walletConsensusQualityMargin` (columns). Cell format: `N · W-L-P · WR% · ROI%` (peak-units ROI). Extreme axes (±3) clamped. ROI hidden when N < 3. **Lock floor: Δw ≥ +1 ∧ Δq ≥ +1.**

### All markets (N = 106)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | N=1 · 0-1 · 0% | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | N=1 · 0-1 · 0% | — | — | N=1 · 0-1 · 0% | N=3 · 1-2 · 33% `-57%` | N=1 · 0-1 · 0% | — |
| **Δw+0** | — | — | — | N=4 · 1-3 · 25% `-47%` | N=4 · 0-4 · 0% `-81%` | N=8 · 5-3 · 63% `-21%` | N=7 · 1-5-1 · 17% `-94%` |
| **Δw+1** | — | — | — | — | N=8 · 3-5 · 38% `-37%` | N=13 · 5-8 · 38% `-12%` | N=12 · 7-5 · 58% `-0%` |
| **Δw+2** | — | — | — | — | N=8 · 4-4 · 50% `-5%` | N=9 · 3-6 · 33% `-18%` | N=8 · 4-4 · 50% `-22%` |
| **Δw+3** | — | — | — | — | N=2 · 2-0 · 100% | N=4 · 2-2 · 50% `-21%` | N=12 · 9-3 · 75% `+73%` |

### Sport — MLB (N = 40)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | — | N=2 · 1-1 · 50% | — | — |
| **Δw+0** | — | — | — | N=1 · 0-1 · 0% | N=2 · 0-2 · 0% | — | N=1 · 0-1 · 0% |
| **Δw+1** | — | — | — | — | N=4 · 0-4 · 0% `-84%` | N=8 · 4-4 · 50% `+4%` | N=3 · 1-2 · 33% `-67%` |
| **Δw+2** | — | — | — | — | N=6 · 3-3 · 50% `-5%` | N=5 · 1-4 · 20% `-75%` | N=2 · 0-2 · 0% |
| **Δw+3** | — | — | — | — | — | N=2 · 1-1 · 50% | N=4 · 4-0 · 100% `+156%` |

### Sport — NBA (N = 52)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | N=1 · 0-1 · 0% | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | N=1 · 0-1 · 0% | — | — | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | — |
| **Δw+0** | — | — | — | N=2 · 0-2 · 0% | N=2 · 0-2 · 0% | N=8 · 5-3 · 63% `-21%` | N=4 · 0-3-1 · 0% `-131%` |
| **Δw+1** | — | — | — | — | N=1 · 1-0 · 100% | N=2 · 0-2 · 0% | N=8 · 5-3 · 63% `+18%` |
| **Δw+2** | — | — | — | — | N=1 · 0-1 · 0% | N=3 · 1-2 · 33% `-25%` | N=5 · 4-1 · 80% `+105%` |
| **Δw+3** | — | — | — | — | N=2 · 2-0 · 100% | N=1 · 0-1 · 0% | N=8 · 5-3 · 63% `+31%` |

### Sport — NHL (N = 14)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | — | — | — | — |
| **Δw+0** | — | — | — | N=1 · 1-0 · 100% | — | — | N=2 · 1-1 · 50% |
| **Δw+1** | — | — | — | — | N=3 · 2-1 · 67% `-2%` | N=3 · 1-2 · 33% `-29%` | N=1 · 1-0 · 100% |
| **Δw+2** | — | — | — | — | N=1 · 1-0 · 100% | N=1 · 1-0 · 100% | N=1 · 0-1 · 0% |
| **Δw+3** | — | — | — | — | — | N=1 · 1-0 · 100% | — |

### Market — ML (N = 61)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | N=1 · 0-1 · 0% | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | N=1 · 0-1 · 0% | — | — | — | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | — |
| **Δw+0** | — | — | — | N=1 · 0-1 · 0% | N=2 · 0-2 · 0% | N=2 · 1-1 · 50% | N=3 · 1-2 · 33% `-43%` |
| **Δw+1** | — | — | — | — | N=7 · 2-5 · 29% `-49%` | N=7 · 3-4 · 43% `-6%` | N=5 · 3-2 · 60% `+11%` |
| **Δw+2** | — | — | — | — | N=6 · 3-3 · 50% `-7%` | N=6 · 2-4 · 33% `-11%` | N=3 · 0-3 · 0% `-233%` |
| **Δw+3** | — | — | — | — | N=1 · 1-0 · 100% | N=3 · 2-1 · 67% `+38%` | N=11 · 9-2 · 82% `+98%` |

### Market — SPREAD (N = 17)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | — | — |
| **Δw+0** | — | — | — | N=2 · 0-2 · 0% | — | N=2 · 1-1 · 50% | N=2 · 0-1-1 · 0% |
| **Δw+1** | — | — | — | — | — | N=1 · 0-1 · 0% | N=3 · 1-2 · 33% `-69%` |
| **Δw+2** | — | — | — | — | — | — | N=4 · 3-1 · 75% `+85%` |
| **Δw+3** | — | — | — | — | — | — | N=1 · 0-1 · 0% |

### Market — TOTAL (N = 28)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | — | N=1 · 1-0 · 100% | — | — |
| **Δw+0** | — | — | — | N=1 · 1-0 · 100% | N=2 · 0-2 · 0% | N=4 · 3-1 · 75% `+15%` | N=2 · 0-2 · 0% |
| **Δw+1** | — | — | — | — | N=1 · 1-0 · 100% | N=5 · 2-3 · 40% `-12%` | N=4 · 3-1 · 75% `+37%` |
| **Δw+2** | — | — | — | — | N=2 · 1-1 · 50% | N=3 · 1-2 · 33% `-34%` | N=1 · 1-0 · 100% |
| **Δw+3** | — | — | — | — | N=1 · 1-0 · 100% | N=1 · 0-1 · 0% | — |

---
## §6. Reconciliation & anomalies — engine self-check

Where the live engine's **shipped state** disagrees with what the **frozen v6 stamps** say it should have shipped. Read these as bug indicators: each row is a side where the system either left a stale lock on the board or muted a pick that the v6 floor said was lockable. PnL is in peak units (the actual cost / benefit to users).

### §6a. Anomaly counts

| Anomaly | N | W-L-P | WR% | PnL (peak u) | Read as |
|---|---|---|---|---|---|
| **Stale lock** — shipped LOCKED/ACTIVE, frozen Δw/Δq below floor | 29 | 7-21-1 | 25.0% | -19.23u | engine left a sub-floor pick on the board |
| **Over-mute** — muted/cancelled by engine, frozen Δw≥+1 ∧ Δq≥+1 | 25 | 10-14-1 | 41.7% | +0.22u | engine killed a play that satisfied the floor |
| **Shadow-strong** — stayed SHADOW even though frozen Δw≥+2 ∧ Δq≥+2 | 0 | 0-0-0 | — | +0.00u | engine never promoted a SUPER TOP-eligible pick |
| **Stars without margin** — peak stars ≥ 4.0★, frozen Δw ≤ 0 | 7 | 1-6-0 | 14.3% | -9.25u | star math diverged from delta math |

### §6b. Stale-lock cohort breakdown

Of every shipped pick whose frozen deltas fall **below** the v6 lock floor, which cohort did it land in?

| Cohort (frozen) | N | W-L-P | WR% | PnL (peak u) |
|---|---|---|---|---|
| STALE Δw=0 (winners flat) | 22 | 6-15-1 | 28.6% | -14.26u |
| STALE Δw≤−1 (winners fading/killed) | 7 | 1-6-0 | 14.3% | -4.97u |

### §6c. Daily stale-lock PnL drag

Per-day cost of stale locks (the picks the engine left on the board even though their frozen Δw / Δq dropped below the lock floor). Compare to the day's shipped PnL.

| Date | Shipped N · PnL | Stale-lock N · PnL | Stale share of shipped PnL |
|---|---|---|---|
| 2026-04-18 | 12 · +2.67u | 3 · -2.25u | -84% |
| 2026-04-19 | 6 · +4.39u | 2 · -3.00u | -68% |
| 2026-04-20 | 16 · -3.21u | 9 · -2.62u | 82% |
| 2026-04-21 | 16 · -7.44u | 8 · -11.50u | 155% |
| 2026-04-22 | 8 · +1.13u | 4 · +0.14u | 12% |
| 2026-04-23 | 7 · -1.18u | 1 · -1.00u | 85% |
| 2026-04-24 | 6 · +3.08u | 2 · +1.00u | 32% |
| 2026-04-25 | 7 · -8.35u | 0 · +0.00u | 0% |
| 2026-04-26 | 10 · -2.04u | 0 · +0.00u | 0% |
| 2026-04-27 | 6 · -1.63u | 0 · +0.00u | 0% |
| 2026-04-28 | 10 · -3.19u | 0 · +0.00u | 0% |
| 2026-04-29 | 7 · +3.54u | 0 · +0.00u | 0% |

### §6d. Top stale-lock examples (worst peak-unit losses)

Last 20 graded sides where engine state and frozen deltas disagree most painfully. Useful for pulling individual docs and walking the audit.

| Date | Doc | Side | Stage / Health | Stars · Units | Δw / Δq (frozen) | Outcome | PnL |
|---|---|---|---|---|---|---|---|
| 2026-04-21 | `2026-04-21_NBA_hou_lal` | away | LOCKED / ACTIVE | 5.0★ · 3u | +0 / +2 | LOSS | -3.00u |
| 2026-04-19 | `2026-04-19_NBA_orl_det_spread` | home | LOCKED / ACTIVE | 5.0★ · 2u | +0 / +7 | LOSS | -2.00u |
| 2026-04-21 | `2026-04-21_NBA_hou_lal_spread` | away | LOCKED / ACTIVE | 3.5★ · 1.75u | +0 / +0 | LOSS | -1.75u |
| 2026-04-21 | `2026-04-21_NBA_por_sas_total` | over | LOCKED / ACTIVE | 4.0★ · 1.75u | +0 / +4 | LOSS | -1.75u |
| 2026-04-20 | `2026-04-20_NHL_ana_edm` | away | LOCKED / ACTIVE | 4.0★ · 1.5u | +0 / +3 | LOSS | -1.50u |
| 2026-04-21 | `2026-04-21_NBA_phi_bos_spread` | home | LOCKED / ACTIVE | 4.5★ · 1.5u | -1 / +1 | LOSS | -1.50u |
| 2026-04-21 | `2026-04-21_NBA_phi_bos_total` | over | LOCKED / ACTIVE | 3.5★ · 1.5u | +0 / +4 | LOSS | -1.50u |
| 2026-04-19 | `2026-04-19_MLB_tbr_pit` | away | LOCKED / ACTIVE | 2.5★ · 1u | +0 / +1 | LOSS | -1.00u |
| 2026-04-20 | `2026-04-20_NBA_atl_nyk` | home | LOCKED / ACTIVE | 3.0★ · 1u | -1 / -4 | LOSS | -1.00u |
| 2026-04-20 | `2026-04-20_NBA_min_den` | home | LOCKED / ACTIVE | 3.0★ · 1u | -1 / +2 | LOSS | -1.00u |
| 2026-04-22 | `2026-04-22_MLB_lad_sfg` | away | LOCKED / ACTIVE | 2.5★ · 1u | +0 / +1 | LOSS | -1.00u |
| 2026-04-23 | `2026-04-23_MLB_cws_ari` | home | LOCKED / ACTIVE | 3.0★ · 1u | +0 / +3 | LOSS | -1.00u |
| 2026-04-18 | `2026-04-18_NBA_hou_lal_spread` | away | LOCKED / ACTIVE | 3.5★ · 1u | +0 / +2 | LOSS | -1.00u |
| 2026-04-21 | `2026-04-21_MLB_oak_sea` | home | LOCKED / — | 2.5★ · 0.75u | -1 / +1 | LOSS | -0.75u |
| 2026-04-20 | `2026-04-20_NBA_min_den_spread` | home | LOCKED / ACTIVE | 3.0★ · 0.75u | -1 / +0 | LOSS | -0.75u |
| 2026-04-18 | `2026-04-18_NBA_hou_lal_total` | over | LOCKED / ACTIVE | 3.0★ · 0.75u | +0 / +2 | LOSS | -0.75u |
| 2026-04-21 | `2026-04-21_NBA_hou_lal_total` | over | LOCKED / ACTIVE | 2.5★ · 0.75u | +0 / +1 | LOSS | -0.75u |
| 2026-04-21 | `2026-04-21_NBA_phi_bos` | home | LOCKED / ACTIVE | 4.0★ · 0.5u | -3 / +1 | LOSS | -0.50u |
| 2026-04-22 | `2026-04-22_MLB_hou_cle` | home | LOCKED / ACTIVE | 2.5★ · 0.5u | +0 / +0 | LOSS | -0.50u |
| 2026-04-18 | `2026-04-18_NBA_atl_nyk_spread` | away | LOCKED / ACTIVE | 2.5★ · 0.5u | +0 / +0 | LOSS | -0.50u |

---
## §7. Wallet roster growth & profitability

"Tracked in sport X" = a wallet has placed **≥ 2 bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: `v8Scoring.walletDetails` on every graded v6-era game (every side, not just the shipped set).

### §7a. Per-sport wallet snapshot

| Sport | Total wallets seen | Tracked (≥2) | Profitable | % prof | WR ≥ 50% | WR ≥ 60% | WR ≥ 70% |
|---|---|---|---|---|---|---|---|
| MLB | 31 | 21 | 7 | 33% | 8 | 4 | 3 |
| NBA | 90 | 64 | 25 | 39% | 38 | 15 | 11 |
| NHL | 37 | 23 | 10 | 43% | 17 | 7 | 6 |
| **ALL (any sport)** | **103** | **77** | **33** | **43%** | **43** | **21** | **13** |

### §7b. Daily roster growth (cumulative through each date)

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

### §7c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | d5017f | 2 | 2 | 0 | 100.0% | +2.08 | +104.0% | $28.6K |
| 2 | 63fc82 | 9 | 7 | 2 | 77.8% | +4.76 | +52.9% | $100.4K |
| 3 | dcafd2 | 10 | 7 | 3 | 70.0% | +3.32 | +33.2% | $28.6K |
| 4 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 5 | b19a27 | 16 | 9 | 7 | 56.3% | +1.72 | +10.7% | -$3.9K |
| 6 | fcc12b | 17 | 9 | 8 | 52.9% | +1.25 | +7.4% | $126.4K |
| 7 | 8c1eae | 4 | 2 | 2 | 50.0% | +0.21 | +5.2% | $2.5K |
| 8 | 12192c | 12 | 6 | 6 | 50.0% | -0.29 | -2.4% | -$26.4K |
| 9 | cd2f63 | 44 | 21 | 23 | 47.7% | -1.91 | -4.3% | $17.5K |
| 10 | b05143 | 9 | 4 | 5 | 44.4% | -0.77 | -8.6% | -$39.6K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | 6bd96a | 2 | 1 | 1 | 50.0% | +3.75 | +187.5% | $18.7K |
| 3 | b51a56 | 3 | 3 | 0 | 100.0% | +3.89 | +129.8% | $56.4K |
| 4 | 7f00bc | 4 | 4 | 0 | 100.0% | +4.68 | +117.1% | $8.1K |
| 5 | 5c32f2 | 2 | 1 | 1 | 50.0% | +2.15 | +107.5% | $54.6K |
| 6 | cdb33b | 4 | 2 | 2 | 50.0% | +4.00 | +100.0% | $28.9K |
| 7 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 8 | 7703d4 | 2 | 2 | 0 | 100.0% | +1.82 | +91.1% | $11.3K |
| 9 | 769c38 | 6 | 6 | 0 | 100.0% | +4.69 | +78.1% | $20.5K |
| 10 | 2e8da5 | 7 | 6 | 1 | 85.7% | +4.86 | +69.4% | $118.2K |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 981187 | 5 | 5 | 0 | 100.0% | +5.03 | +100.6% | $30.3K |
| 2 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 3 | bc3532 | 5 | 4 | 1 | 80.0% | +4.25 | +85.0% | $11.1K |
| 4 | e70853 | 4 | 3 | 1 | 75.0% | +1.88 | +46.9% | $26.7K |
| 5 | 6b853d | 5 | 4 | 1 | 80.0% | +2.13 | +42.6% | $15.2K |
| 6 | 12192c | 5 | 3 | 2 | 60.0% | +1.80 | +36.0% | $136.2K |
| 7 | fcc12b | 4 | 3 | 1 | 75.0% | +1.30 | +32.5% | -$39.2K |
| 8 | dcafd2 | 2 | 1 | 1 | 50.0% | +0.40 | +20.0% | $4.9K |
| 9 | dfa240 | 12 | 7 | 5 | 58.3% | +1.39 | +11.6% | $3.7K |
| 10 | b19a27 | 2 | 1 | 1 | 50.0% | +0.20 | +10.0% | -$32.9K |

---
## §8. Wallet winners — descriptive stats

Every (wallet × sport) row where the wallet has ≥ 2 bets in the sport AND flat PnL > 0. A wallet can appear in multiple sports.

### §8a. Winner cohort summary by sport

| Sport | Winners | Σ bets | Σ invested | Σ $PnL | Mean WR% | Mean N | Mean avg $ | Mean bets/day | Mean flat ROI |
|---|---|---|---|---|---|---|---|---|---|
| MLB | 7 | 66 | $972.7K | $296.1K | 67.1% | 9.4 | $12.0K | 1.71 | +33.4% |
| NBA | 25 | 199 | $4.14M | $2.02M | 70.4% | 8.0 | $21.0K | 1.32 | +67.0% |
| NHL | 10 | 46 | $661.5K | $203.0K | 72.8% | 4.6 | $18.0K | 0.97 | +47.9% |
| **ALL** | **42** | **311** | **$5.77M** | **$2.51M** | **70.4%** | **7.4** | **$18.8K** | **1.30** | **+56.9%** |

### §8b. Winner cohort — quartile distribution

Spread across every winning (wallet × sport) row.

| Metric | Min | Q25 | Median | Q75 | Max | Mean |
|---|---|---|---|---|---|---|
| N (bets) | 2.0 | 3.3 | 5.0 | 8.8 | 27.0 | 7.4 |
| WR % | 40.0% | 50.7% | 66.7% | 84.3% | 100.0% | 70.4% |
| Flat ROI % | +2.3% | +20.2% | +39.3% | +89.6% | +283.0% | +56.9% |
| $ ROI % | -97.8% | +26.9% | +47.8% | +85.3% | +280.1% | +58.8% |
| Avg bet ($) | $687 | $5.3K | $12.5K | $25.9K | $70.9K | $18.8K |
| Median bet ($) | $25 | $5.2K | $9.5K | $17.7K | $70.9K | $14.8K |
| Max bet ($) | $1.7K | $11.2K | $27.2K | $80.3K | $324.7K | $52.7K |
| Σ invested | $6.2K | $27.9K | $53.1K | $151.5K | $1.00M | $137.4K |
| $ PnL | -$118.2K | $8.1K | $28.6K | $89.4K | $496.2K | $59.9K |
| Days active | 1.0 | 2.0 | 3.5 | 5.0 | 11.0 | 4.1 |
| Span (days) | 1.0 | 3.3 | 6.5 | 9.0 | 12.0 | 6.4 |
| Bets / day | 0.22 | 0.63 | 1.00 | 1.88 | 4.17 | 1.30 |

### §8c. Winner cadence archetypes

Where do our winners cluster? Snipers fire rarely but big; volume bettors grind everything.

| Archetype | Winners | Σ bets | Mean WR% | Mean flat ROI | Mean avg $ | Mean bets/day | Σ $ PnL |
|---|---|---|---|---|---|---|---|
| Sniper (≤3 bets) | 11 | 25 | 78.8% | +104.2% | $22.1K | 0.99 | $518.4K |
| Sharp (4–6 bets) | 15 | 70 | 74.3% | +55.6% | $15.0K | 0.88 | $475.7K |
| Grinder (7–10 bets) | 9 | 75 | 65.1% | +36.0% | $22.1K | 1.39 | $530.4K |
| Volume (>10 bets) | 7 | 141 | 55.6% | +12.0% | $17.4K | 2.57 | $990.1K |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · WHITELIST_CONSENSUS_VERSION = 6 · QUALITY_CONTRIB_CUT = 30 · inclusion mirrors live Pick Performance dashboard · cohort tags from frozen v6 stamps_
