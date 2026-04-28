# Sharp Intel v6 — Daily Master Report

_Auto-generated **4/28/2026, 7:13:12 AM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). Cohort tags (1/1, 2/2, …) come from frozen `v8_walletConsensus*` stamps written at last sync before the T-15 freeze. Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (117 profiles — display only) · quality cut: contribution ≥ 30.

---
## §1. Sample summary

| Metric | Value |
|---|---|
| Graded sides scanned | 177 |
| Graded sides w/ outcome | 169 |
| **SHIPPED (matches dashboard)** | **94** |
| · of which lockStage = LOCKED | 92 |
| · of which lockStage = null/other | 2 |
| · with frozen Δw stamp | 89 |
| · with frozen Δq stamp | 29 |
| · Δq recomputed from walletDetails (contribution-only) | 59 |
| · uncategorized (no Δw stamp) | 5 |
| Sharp Vault hidden-star positions | 1024 |
| Unique wallets observed | 96 |
| Graded date range | 2026-04-18 … 2026-04-27 |
| Sports represented | MLB, NBA, NHL |
| Markets represented | ML, SPREAD, TOTAL |

| Cohort | N | W-L-P | WR% | PnL (peak units) | PnL (flat 1u) |
|---|---|---|---|---|---|
| All graded sides | 169 | 82-85-2 | 49.1% | -10.93u | -6.89u |
| **SHIPPED (dashboard-equivalent)** | **94** | **43-50-1** | **46.2%** | **-12.58u** | **-6.10u** |
| · of shipped, frozen Δw≥+1 ∧ Δq≥+1 | 59 | 32-27-0 | 54.2% | +3.41u | +8.00u |

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

### Cohort cumulative roll-up — shipped picks only

| Cohort | N | W-L-P | WR% | PnL (peak units) | PnL (flat 1u) |
|---|---|---|---|---|---|
| **SUPER TOP (Δw≥+2 ∧ Δq≥+2)** | 25 | 14-11-0 | 56.0% | +3.62u | +7.36u |
| **TOP (Δw≥+2 ∧ Δq≤+1)** | 7 | 4-3-0 | 57.1% | +2.19u | +1.23u |
| **FLOOR-B (Δw=+1 ∧ Δq≥+2)** | 19 | 11-8-0 | 57.9% | +0.57u | +2.22u |
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
| 5.0★ (ELITE) | 19 | 9-10-0 | 47.4% | -9.95u | -3.90u | -114 |
| 4.5★ | 8 | 5-3-0 | 62.5% | +5.40u | +3.13u | -68 |
| 4.0★ | 11 | 5-6-0 | 45.5% | -1.85u | -1.30u | -130 |
| 3.5★ (LOCK FLR) | 18 | 8-10-0 | 44.4% | +0.90u | +2.01u | +53 |
| 3.0★ | 17 | 6-10-1 | 37.5% | -4.55u | -3.69u | -94 |
| 2.5★ | 21 | 10-11-0 | 47.6% | -2.53u | -2.36u | -59 |
| ≤2.0★ | 0 | — | — | — | — | — |

### Elite (≥4.5★) by sport

| Sport | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| MLB | 4 | 2-2-0 | 50.0% | -0.39u | -0.69u |
| NBA | 21 | 11-10-0 | 52.4% | -4.10u | -0.10u |
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

---
## §4. Sharp Vault hidden-star performance (`sharp_action_positions.v8_stars`)

This is the Sharp Vault-only check from the hidden `v8_stars` field on individual `sharp_action_positions`. It excludes `vaultQualified=false` shadow rows and includes only graded WIN/LOSS positions since the v6 cutover.

### §4a. Hidden-star win rates

| Hidden star band | N | W-L | WR% | Total invested | Total PnL | $ ROI |
|---|---|---|---|---|---|---|
| 5★ | 57 | 32-25 | 56.1% | $5.82M | -$324.8K | -5.6% |
| 4★ | 205 | 101-104 | 49.3% | $19.60M | $252.8K | +1.3% |
| 3★ | 331 | 182-149 | 55.0% | $28.94M | $2.38M | +8.2% |
| 2★ | 346 | 165-181 | 47.7% | $23.70M | -$1.06M | -4.5% |
| <2★ | 85 | 36-49 | 42.4% | $4.29M | -$164.8K | -3.8% |
| **4★+ combined** | **262** | **133-129** | **50.8%** | **$25.42M** | **-$72.0K** | **-0.3%** |
| **<4★ combined** | **762** | **383-379** | **50.3%** | **$56.93M** | **$1.16M** | **+2.0%** |

### §4b. 5★ / 4★ hidden-star performance by sport

| Sport | 5★ N · WR · $ROI · PnL | 4★ N · WR · $ROI · PnL | 4★+ combined |
|---|---|---|---|
| MLB | — | 1 · 100% · +49% · $4.7K | **1 · 100% · +49% · $4.7K** |
| NBA | 57 · 56% · -6% · -$324.8K | 190 · 48% · +1% · $159.9K | **247 · 50% · -1% · -$164.9K** |
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
| 2026-04-28 | 30 | 18-12 | 60.0% | +4.6% | $214.3K |

---
## §5. Frozen Δw × Δq win matrix — shipped picks

Shipped picks only. Frozen `v8_walletConsensusDelta` (rows) × frozen `v8_walletConsensusQualityMargin` (columns). Cell format: `N · W-L-P · WR% · ROI%` (peak-units ROI). Extreme axes (±3) clamped. ROI hidden when N < 3. **Lock floor: Δw ≥ +1 ∧ Δq ≥ +1.**

### All markets (N = 89)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | N=1 · 0-1 · 0% | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | N=1 · 0-1 · 0% | — | — | N=1 · 0-1 · 0% | N=3 · 1-2 · 33% `-57%` | N=1 · 0-1 · 0% | — |
| **Δw+0** | — | — | — | N=4 · 1-3 · 25% `-47%` | N=4 · 0-4 · 0% `-81%` | N=8 · 5-3 · 63% `-21%` | N=7 · 1-5-1 · 17% `-94%` |
| **Δw+1** | — | — | — | — | N=8 · 3-5 · 38% `-37%` | N=7 · 4-3 · 57% `+9%` | N=12 · 7-5 · 58% `-0%` |
| **Δw+2** | — | — | — | — | N=5 · 2-3 · 40% `-41%` | N=7 · 2-5 · 29% `-57%` | N=5 · 2-3 · 40% `-69%` |
| **Δw+3** | — | — | — | — | N=2 · 2-0 · 100% | N=3 · 2-1 · 67% `+38%` | N=10 · 8-2 · 80% `+99%` |

### Sport — MLB (N = 31)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | — | N=2 · 1-1 · 50% | — | — |
| **Δw+0** | — | — | — | N=1 · 0-1 · 0% | N=2 · 0-2 · 0% | — | N=1 · 0-1 · 0% |
| **Δw+1** | — | — | — | — | N=4 · 0-4 · 0% `-84%` | N=4 · 3-1 · 75% `+37%` | N=3 · 1-2 · 33% `-67%` |
| **Δw+2** | — | — | — | — | N=3 · 1-2 · 33% `-66%` | N=5 · 1-4 · 20% `-75%` | N=1 · 0-1 · 0% |
| **Δw+3** | — | — | — | — | — | N=1 · 1-0 · 100% | N=4 · 4-0 · 100% `+156%` |

### Sport — NBA (N = 45)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | N=1 · 0-1 · 0% | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | N=1 · 0-1 · 0% | — | — | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | — |
| **Δw+0** | — | — | — | N=2 · 0-2 · 0% | N=2 · 0-2 · 0% | N=8 · 5-3 · 63% `-21%` | N=4 · 0-3-1 · 0% `-131%` |
| **Δw+1** | — | — | — | — | N=1 · 1-0 · 100% | — | N=8 · 5-3 · 63% `+18%` |
| **Δw+2** | — | — | — | — | N=1 · 0-1 · 0% | N=2 · 1-1 · 50% | N=3 · 2-1 · 67% `+52%` |
| **Δw+3** | — | — | — | — | N=2 · 2-0 · 100% | N=1 · 0-1 · 0% | N=6 · 4-2 · 67% `+61%` |

### Sport — NHL (N = 13)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | — | — | — | — |
| **Δw+0** | — | — | — | N=1 · 1-0 · 100% | — | — | N=2 · 1-1 · 50% |
| **Δw+1** | — | — | — | — | N=3 · 2-1 · 67% `-2%` | N=3 · 1-2 · 33% `-29%` | N=1 · 1-0 · 100% |
| **Δw+2** | — | — | — | — | N=1 · 1-0 · 100% | — | N=1 · 0-1 · 0% |
| **Δw+3** | — | — | — | — | — | N=1 · 1-0 · 100% | — |

### Market — ML (N = 50)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | N=1 · 0-1 · 0% | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | N=1 · 0-1 · 0% | — | — | — | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | — |
| **Δw+0** | — | — | — | N=1 · 0-1 · 0% | N=2 · 0-2 · 0% | N=2 · 1-1 · 50% | N=3 · 1-2 · 33% `-43%` |
| **Δw+1** | — | — | — | — | N=7 · 2-5 · 29% `-49%` | N=4 · 2-2 · 50% `+5%` | N=5 · 3-2 · 60% `+11%` |
| **Δw+2** | — | — | — | — | N=3 · 1-2 · 33% `-69%` | N=4 · 1-3 · 25% `-75%` | N=2 · 0-2 · 0% |
| **Δw+3** | — | — | — | — | N=1 · 1-0 · 100% | N=2 · 2-0 · 100% | N=10 · 8-2 · 80% `+99%` |

### Market — SPREAD (N = 14)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | — | — |
| **Δw+0** | — | — | — | N=2 · 0-2 · 0% | — | N=2 · 1-1 · 50% | N=2 · 0-1-1 · 0% |
| **Δw+1** | — | — | — | — | — | — | N=3 · 1-2 · 33% `-69%` |
| **Δw+2** | — | — | — | — | — | — | N=3 · 2-1 · 67% `+52%` |
| **Δw+3** | — | — | — | — | — | — | — |

### Market — TOTAL (N = 25)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | — | N=1 · 1-0 · 100% | — | — |
| **Δw+0** | — | — | — | N=1 · 1-0 · 100% | N=2 · 0-2 · 0% | N=4 · 3-1 · 75% `+15%` | N=2 · 0-2 · 0% |
| **Δw+1** | — | — | — | — | N=1 · 1-0 · 100% | N=3 · 2-1 · 67% `+13%` | N=4 · 3-1 · 75% `+37%` |
| **Δw+2** | — | — | — | — | N=2 · 1-1 · 50% | N=3 · 1-2 · 33% `-34%` | — |
| **Δw+3** | — | — | — | — | N=1 · 1-0 · 100% | N=1 · 0-1 · 0% | — |

---
## §6. Reconciliation & anomalies — engine self-check

Where the live engine's **shipped state** disagrees with what the **frozen v6 stamps** say it should have shipped. Read these as bug indicators: each row is a side where the system either left a stale lock on the board or muted a pick that the v6 floor said was lockable. PnL is in peak units (the actual cost / benefit to users).

### §6a. Anomaly counts

| Anomaly | N | W-L-P | WR% | PnL (peak u) | Read as |
|---|---|---|---|---|---|
| **Stale lock** — shipped LOCKED/ACTIVE, frozen Δw/Δq below floor | 29 | 7-21-1 | 25.0% | -19.23u | engine left a sub-floor pick on the board |
| **Over-mute** — muted/cancelled by engine, frozen Δw≥+1 ∧ Δq≥+1 | 17 | 8-9-0 | 47.1% | +0.39u | engine killed a play that satisfied the floor |
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
| MLB | 27 | 20 | 7 | 35% | 9 | 3 | 2 |
| NBA | 81 | 60 | 24 | 40% | 39 | 15 | 11 |
| NHL | 34 | 17 | 9 | 53% | 11 | 7 | 5 |
| **ALL (any sport)** | **96** | **72** | **32** | **44%** | **40** | **21** | **11** |

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

### §7c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 63fc82 | 6 | 5 | 1 | 83.3% | +3.83 | +63.9% | $64.6K |
| 2 | dcafd2 | 10 | 7 | 3 | 70.0% | +3.32 | +33.2% | $28.6K |
| 3 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 4 | fcc12b | 14 | 8 | 6 | 57.1% | +2.11 | +15.1% | $86.7K |
| 5 | b19a27 | 16 | 9 | 7 | 56.3% | +1.72 | +10.7% | -$3.9K |
| 6 | 7f00bc | 2 | 1 | 1 | 50.0% | +0.18 | +9.0% | $2.4K |
| 7 | cd2f63 | 21 | 10 | 11 | 47.6% | +0.05 | +0.2% | $11.3K |
| 8 | 12192c | 10 | 5 | 5 | 50.0% | -0.14 | -1.4% | -$86.5K |
| 9 | 4c64aa | 14 | 7 | 7 | 50.0% | -0.39 | -2.8% | -$113.6K |
| 10 | 8c1eae | 2 | 1 | 1 | 50.0% | -0.09 | -4.5% | -$687 |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | 6bd96a | 2 | 1 | 1 | 50.0% | +3.75 | +187.5% | $18.7K |
| 3 | 7f00bc | 2 | 2 | 0 | 100.0% | +2.20 | +110.1% | $4.1K |
| 4 | 5c32f2 | 2 | 1 | 1 | 50.0% | +2.15 | +107.5% | $54.6K |
| 5 | cdb33b | 4 | 2 | 2 | 50.0% | +4.00 | +100.0% | $28.9K |
| 6 | 7923c4 | 2 | 2 | 0 | 100.0% | +1.88 | +93.9% | $110.0K |
| 7 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 8 | 7703d4 | 2 | 2 | 0 | 100.0% | +1.82 | +91.1% | $11.3K |
| 9 | 769c38 | 6 | 6 | 0 | 100.0% | +4.69 | +78.1% | $20.5K |
| 10 | 78e8f1 | 5 | 3 | 2 | 60.0% | +3.61 | +72.2% | $238.8K |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 981187 | 5 | 5 | 0 | 100.0% | +5.03 | +100.6% | $30.3K |
| 2 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 3 | 12192c | 4 | 3 | 1 | 75.0% | +2.80 | +70.0% | $154.0K |
| 4 | bc3532 | 3 | 2 | 1 | 66.7% | +1.38 | +46.0% | -$735 |
| 5 | 6b853d | 5 | 4 | 1 | 80.0% | +2.13 | +42.6% | $15.2K |
| 6 | fcc12b | 4 | 3 | 1 | 75.0% | +1.30 | +32.5% | -$39.2K |
| 7 | dcafd2 | 2 | 1 | 1 | 50.0% | +0.40 | +20.0% | $4.9K |
| 8 | dfa240 | 10 | 6 | 4 | 60.0% | +1.62 | +16.2% | $4.6K |
| 9 | b19a27 | 2 | 1 | 1 | 50.0% | +0.20 | +10.0% | -$32.9K |
| 10 | af1697 | 20 | 9 | 11 | 45.0% | -1.29 | -6.4% | -$73.1K |

---
## §8. Wallet winners — descriptive stats

Every (wallet × sport) row where the wallet has ≥ 2 bets in the sport AND flat PnL > 0. A wallet can appear in multiple sports.

### §8a. Winner cohort summary by sport

| Sport | Winners | Σ bets | Σ invested | Σ $PnL | Mean WR% | Mean N | Mean avg $ | Mean bets/day | Mean flat ROI |
|---|---|---|---|---|---|---|---|---|---|
| MLB | 7 | 77 | $980.8K | $203.2K | 61.0% | 11.0 | $11.1K | 2.87 | +21.8% |
| NBA | 24 | 155 | $3.62M | $1.71M | 73.9% | 6.5 | $22.6K | 1.41 | +70.0% |
| NHL | 9 | 37 | $553.9K | $183.1K | 73.0% | 4.1 | $18.7K | 1.03 | +48.0% |
| **ALL** | **40** | **269** | **$5.15M** | **$2.10M** | **71.4%** | **6.7** | **$19.7K** | **1.58** | **+56.6%** |

### §8b. Winner cohort — quartile distribution

Spread across every winning (wallet × sport) row.

| Metric | Min | Q25 | Median | Q75 | Max | Mean |
|---|---|---|---|---|---|---|
| N (bets) | 2.0 | 2.0 | 5.0 | 8.3 | 24.0 | 6.7 |
| WR % | 40.0% | 50.0% | 66.7% | 100.0% | 100.0% | 71.4% |
| Flat ROI % | +0.2% | +18.6% | +45.3% | +81.4% | +283.0% | +56.6% |
| $ ROI % | -97.8% | +16.3% | +51.2% | +90.7% | +280.1% | +54.7% |
| Avg bet ($) | $709 | $5.0K | $10.5K | $32.8K | $70.9K | $19.7K |
| Median bet ($) | $25 | $3.2K | $9.4K | $22.9K | $70.9K | $15.7K |
| Max bet ($) | $1.7K | $9.2K | $26.7K | $76.9K | $324.7K | $52.1K |
| Σ invested | $2.4K | $24.3K | $60.4K | $143.6K | $1.00M | $128.8K |
| $ PnL | -$118.2K | $2.3K | $16.9K | $57.8K | $496.9K | $52.4K |
| Days active | 1.0 | 2.0 | 3.0 | 4.0 | 9.0 | 3.5 |
| Span (days) | 1.0 | 2.0 | 4.0 | 8.0 | 10.0 | 5.0 |
| Bets / day | 0.22 | 0.73 | 1.06 | 2.00 | 7.00 | 1.58 |

### §8c. Winner cadence archetypes

Where do our winners cluster? Snipers fire rarely but big; volume bettors grind everything.

| Archetype | Winners | Σ bets | Mean WR% | Mean flat ROI | Mean avg $ | Mean bets/day | Σ $ PnL |
|---|---|---|---|---|---|---|---|
| Sniper (≤3 bets) | 14 | 30 | 79.8% | +87.2% | $19.9K | 1.06 | $509.1K |
| Sharp (4–6 bets) | 13 | 64 | 75.1% | +60.9% | $21.7K | 1.12 | $860.5K |
| Grinder (7–10 bets) | 7 | 62 | 59.2% | +21.5% | $16.1K | 1.60 | -$148.8K |
| Volume (>10 bets) | 6 | 113 | 58.3% | +16.7% | $19.1K | 3.77 | $875.6K |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · WHITELIST_CONSENSUS_VERSION = 6 · QUALITY_CONTRIB_CUT = 30 · inclusion mirrors live Pick Performance dashboard · cohort tags from frozen v6 stamps_
