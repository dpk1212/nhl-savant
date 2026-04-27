# Sharp Intel v6 — Daily Master Report

_Auto-generated **4/27/2026, 4:22:43 PM ET** by `scripts/dailyV6Report.js`. Do not edit by hand._

**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = `lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5`. PnL is in **peak units** (the size shipped to users). Cohort tags (1/1, 2/2, …) come from frozen `v8_walletConsensus*` stamps written at last sync before the T-15 freeze. Nothing is recomputed against today's whitelist.

v6 cutover: **2026-04-18** · whitelist source: live `sharpWalletProfiles` (114 profiles — display only) · quality cut: contribution ≥ 30.

---
## §1. Sample summary

| Metric | Value |
|---|---|
| Graded sides scanned | 162 |
| Graded sides w/ outcome | 148 |
| **SHIPPED (matches dashboard)** | **88** |
| · of which lockStage = LOCKED | 86 |
| · of which lockStage = null/other | 2 |
| · with frozen Δw stamp | 83 |
| · with frozen Δq stamp | 23 |
| · Δq recomputed from walletDetails (contribution-only) | 59 |
| · uncategorized (no Δw stamp) | 5 |
| Sharp Vault hidden-star positions | 895 |
| Unique wallets observed | 91 |
| Graded date range | 2026-04-18 … 2026-04-26 |
| Sports represented | MLB, NBA, NHL |
| Markets represented | ML, SPREAD, TOTAL |

| Cohort | N | W-L-P | WR% | PnL (peak units) | PnL (flat 1u) |
|---|---|---|---|---|---|
| All graded sides | 148 | 70-76-2 | 47.9% | -14.45u | -8.02u |
| **SHIPPED (dashboard-equivalent)** | **88** | **40-47-1** | **46.0%** | **-10.95u** | **-5.21u** |
| · of shipped, frozen Δw≥+1 ∧ Δq≥+1 | 53 | 29-24-0 | 54.7% | +5.04u | +8.89u |

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

### Cohort cumulative roll-up — shipped picks only

| Cohort | N | W-L-P | WR% | PnL (peak units) | PnL (flat 1u) |
|---|---|---|---|---|---|
| **SUPER TOP (Δw≥+2 ∧ Δq≥+2)** | 21 | 12-9-0 | 57.1% | +5.28u | +8.29u |
| **TOP (Δw≥+2 ∧ Δq≤+1)** | 7 | 4-3-0 | 57.1% | +2.19u | +1.23u |
| **FLOOR-B (Δw=+1 ∧ Δq≥+2)** | 17 | 10-7-0 | 58.8% | +0.54u | +2.18u |
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
| 5.0★ (ELITE) | 15 | 7-8-0 | 46.7% | -8.29u | -2.97u | -106 |
| 4.5★ | 8 | 5-3-0 | 62.5% | +5.40u | +3.13u | -68 |
| 4.0★ | 10 | 5-5-0 | 50.0% | -1.10u | -0.30u | -131 |
| 3.5★ (LOCK FLR) | 17 | 7-10-0 | 41.2% | +0.12u | +0.97u | +50 |
| 3.0★ | 17 | 6-10-1 | 37.5% | -4.55u | -3.69u | -94 |
| 2.5★ | 21 | 10-11-0 | 47.6% | -2.53u | -2.36u | -59 |
| ≤2.0★ | 0 | — | — | — | — | — |

### Elite (≥4.5★) by sport

| Sport | N | W-L-P | WR% | PnL (peak u) | PnL (flat 1u) |
|---|---|---|---|---|---|
| MLB | 3 | 2-1-0 | 66.7% | +1.61u | +0.31u |
| NBA | 18 | 9-9-0 | 50.0% | -4.44u | -0.17u |
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

---
## §4. Sharp Vault hidden-star performance (`sharp_action_positions.v8_stars`)

This is the Sharp Vault-only check from the hidden `v8_stars` field on individual `sharp_action_positions`. It excludes `vaultQualified=false` shadow rows and includes only graded WIN/LOSS positions since the v6 cutover.

### §4a. Hidden-star win rates

| Hidden star band | N | W-L | WR% | Total invested | Total PnL | $ ROI |
|---|---|---|---|---|---|---|
| 5★ | 42 | 22-20 | 52.4% | $2.98M | -$436.0K | -14.6% |
| 4★ | 175 | 86-89 | 49.1% | $16.40M | $400.5K | +2.4% |
| 3★ | 274 | 153-121 | 55.8% | $23.11M | $1.68M | +7.3% |
| 2★ | 324 | 155-169 | 47.8% | $23.12M | -$974.4K | -4.2% |
| <2★ | 80 | 33-47 | 41.3% | $4.16M | -$175.6K | -4.2% |
| **4★+ combined** | **217** | **108-109** | **49.8%** | **$19.39M** | **-$35.5K** | **-0.2%** |
| **<4★ combined** | **678** | **341-337** | **50.3%** | **$50.38M** | **$529.2K** | **+1.1%** |

### §4b. 5★ / 4★ hidden-star performance by sport

| Sport | 5★ N · WR · $ROI · PnL | 4★ N · WR · $ROI · PnL | 4★+ combined |
|---|---|---|---|
| MLB | — | 1 · 100% · +49% · $4.7K | **1 · 100% · +49% · $4.7K** |
| NBA | 42 · 52% · -15% · -$436.0K | 170 · 49% · +2% · $384.8K | **212 · 50% · -0% · -$51.2K** |
| NHL | — | 4 · 25% · +3% · $11.0K | **4 · 25% · +3% · $11.0K** |

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

---
## §5. Frozen Δw × Δq win matrix — shipped picks

Shipped picks only. Frozen `v8_walletConsensusDelta` (rows) × frozen `v8_walletConsensusQualityMargin` (columns). Cell format: `N · W-L-P · WR% · ROI%` (peak-units ROI). Extreme axes (±3) clamped. ROI hidden when N < 3. **Lock floor: Δw ≥ +1 ∧ Δq ≥ +1.**

### All markets (N = 83)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | N=1 · 0-1 · 0% | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | N=1 · 0-1 · 0% | — | — | N=1 · 0-1 · 0% | N=3 · 1-2 · 33% `-57%` | N=1 · 0-1 · 0% | — |
| **Δw+0** | — | — | — | N=4 · 1-3 · 25% `-47%` | N=4 · 0-4 · 0% `-81%` | N=8 · 5-3 · 63% `-21%` | N=7 · 1-5-1 · 17% `-94%` |
| **Δw+1** | — | — | — | — | N=8 · 3-5 · 38% `-37%` | N=6 · 3-3 · 50% `-3%` | N=11 · 7-4 · 64% `+6%` |
| **Δw+2** | — | — | — | — | N=5 · 2-3 · 40% `-41%` | N=6 · 1-5 · 17% `-96%` | N=4 · 2-2 · 50% `-36%` |
| **Δw+3** | — | — | — | — | N=2 · 2-0 · 100% | N=2 · 2-0 · 100% | N=9 · 7-2 · 78% `+103%` |

### Sport — MLB (N = 29)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | — | N=2 · 1-1 · 50% | — | — |
| **Δw+0** | — | — | — | N=1 · 0-1 · 0% | N=2 · 0-2 · 0% | — | N=1 · 0-1 · 0% |
| **Δw+1** | — | — | — | — | N=4 · 0-4 · 0% `-84%` | N=3 · 2-1 · 67% `+24%` | N=3 · 1-2 · 33% `-67%` |
| **Δw+2** | — | — | — | — | N=3 · 1-2 · 33% `-66%` | N=5 · 1-4 · 20% `-75%` | — |
| **Δw+3** | — | — | — | — | — | N=1 · 1-0 · 100% | N=4 · 4-0 · 100% `+156%` |

### Sport — NBA (N = 41)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | N=1 · 0-1 · 0% | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | N=1 · 0-1 · 0% | — | — | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | — |
| **Δw+0** | — | — | — | N=2 · 0-2 · 0% | N=2 · 0-2 · 0% | N=8 · 5-3 · 63% `-21%` | N=4 · 0-3-1 · 0% `-131%` |
| **Δw+1** | — | — | — | — | N=1 · 1-0 · 100% | — | N=7 · 5-2 · 71% `+31%` |
| **Δw+2** | — | — | — | — | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | N=3 · 2-1 · 67% `+52%` |
| **Δw+3** | — | — | — | — | N=2 · 2-0 · 100% | — | N=5 · 3-2 · 60% `+61%` |

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

### Market — ML (N = 47)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | N=1 · 0-1 · 0% | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | N=1 · 0-1 · 0% | — | — | — | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | — |
| **Δw+0** | — | — | — | N=1 · 0-1 · 0% | N=2 · 0-2 · 0% | N=2 · 1-1 · 50% | N=3 · 1-2 · 33% `-43%` |
| **Δw+1** | — | — | — | — | N=7 · 2-5 · 29% `-49%` | N=3 · 1-2 · 33% `-19%` | N=5 · 3-2 · 60% `+11%` |
| **Δw+2** | — | — | — | — | N=3 · 1-2 · 33% `-69%` | N=4 · 1-3 · 25% `-75%` | N=1 · 0-1 · 0% |
| **Δw+3** | — | — | — | — | N=1 · 1-0 · 100% | N=2 · 2-0 · 100% | N=9 · 7-2 · 78% `+103%` |

### Market — SPREAD (N = 13)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | N=1 · 0-1 · 0% | N=1 · 0-1 · 0% | — | — |
| **Δw+0** | — | — | — | N=2 · 0-2 · 0% | — | N=2 · 1-1 · 50% | N=2 · 0-1-1 · 0% |
| **Δw+1** | — | — | — | — | — | — | N=2 · 1-1 · 50% |
| **Δw+2** | — | — | — | — | — | — | N=3 · 2-1 · 67% `+52%` |
| **Δw+3** | — | — | — | — | — | — | — |

### Market — TOTAL (N = 23)

| | **Δq-3** | **Δq-2** | **Δq-1** | **Δq+0** | **Δq+1** | **Δq+2** | **Δq+3** |
|---|---|---|---|---|---|---|---|
| **Δw-3** | — | — | — | — | — | — | — |
| **Δw-2** | — | — | — | — | — | — | — |
| **Δw-1** | — | — | — | — | N=1 · 1-0 · 100% | — | — |
| **Δw+0** | — | — | — | N=1 · 1-0 · 100% | N=2 · 0-2 · 0% | N=4 · 3-1 · 75% `+15%` | N=2 · 0-2 · 0% |
| **Δw+1** | — | — | — | — | N=1 · 1-0 · 100% | N=3 · 2-1 · 67% `+13%` | N=4 · 3-1 · 75% `+37%` |
| **Δw+2** | — | — | — | — | N=2 · 1-1 · 50% | N=2 · 0-2 · 0% | — |
| **Δw+3** | — | — | — | — | N=1 · 1-0 · 100% | — | — |

---
## §6. Reconciliation & anomalies — engine self-check

Where the live engine's **shipped state** disagrees with what the **frozen v6 stamps** say it should have shipped. Read these as bug indicators: each row is a side where the system either left a stale lock on the board or muted a pick that the v6 floor said was lockable. PnL is in peak units (the actual cost / benefit to users).

### §6a. Anomaly counts

| Anomaly | N | W-L-P | WR% | PnL (peak u) | Read as |
|---|---|---|---|---|---|
| **Stale lock** — shipped LOCKED/ACTIVE, frozen Δw/Δq below floor | 29 | 7-21-1 | 25.0% | -19.23u | engine left a sub-floor pick on the board |
| **Over-mute** — muted/cancelled by engine, frozen Δw≥+1 ∧ Δq≥+1 | 13 | 7-6-0 | 53.8% | -0.26u | engine killed a play that satisfied the floor |
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
| MLB | 25 | 18 | 5 | 28% | 7 | 3 | 2 |
| NBA | 77 | 56 | 25 | 45% | 36 | 13 | 9 |
| NHL | 30 | 17 | 9 | 53% | 11 | 7 | 3 |
| **ALL (any sport)** | **91** | **67** | **31** | **46%** | **39** | **18** | **9** |

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

### §7c. Top 10 profitable wallets by sport

#### MLB

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 63fc82 | 5 | 4 | 1 | 80.0% | +2.65 | +53.1% | $47.3K |
| 2 | dcafd2 | 10 | 7 | 3 | 70.0% | +3.32 | +33.2% | $28.6K |
| 3 | 981187 | 8 | 5 | 3 | 62.5% | +1.65 | +20.7% | $13.5K |
| 4 | cd2f63 | 16 | 9 | 7 | 56.3% | +3.01 | +18.8% | $5.7K |
| 5 | fcc12b | 12 | 7 | 5 | 58.3% | +2.11 | +17.6% | $114.7K |
| 6 | 12192c | 10 | 5 | 5 | 50.0% | -0.14 | -1.4% | -$86.5K |
| 7 | 8c1eae | 2 | 1 | 1 | 50.0% | -0.09 | -4.5% | -$687 |
| 8 | b19a27 | 13 | 6 | 7 | 46.2% | -1.09 | -8.4% | -$26.7K |
| 9 | b05143 | 7 | 3 | 4 | 42.9% | -0.65 | -9.3% | $25.8K |
| 10 | bc3532 | 7 | 3 | 4 | 42.9% | -1.10 | -15.7% | -$12.7K |

#### NBA

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 799fad | 2 | 2 | 0 | 100.0% | +5.66 | +283.0% | $241.7K |
| 2 | 6bd96a | 2 | 1 | 1 | 50.0% | +3.75 | +187.5% | $18.7K |
| 3 | 78e8f1 | 3 | 2 | 1 | 66.7% | +3.35 | +111.7% | $210.1K |
| 4 | 7f00bc | 2 | 2 | 0 | 100.0% | +2.20 | +110.1% | $4.1K |
| 5 | 5c32f2 | 2 | 1 | 1 | 50.0% | +2.15 | +107.5% | $54.6K |
| 6 | cdb33b | 4 | 2 | 2 | 50.0% | +4.00 | +100.0% | $28.9K |
| 7 | 7923c4 | 2 | 2 | 0 | 100.0% | +1.88 | +93.9% | $110.0K |
| 8 | 12ad50 | 3 | 3 | 0 | 100.0% | +2.74 | +91.3% | $45.5K |
| 9 | 769c38 | 5 | 5 | 0 | 100.0% | +4.48 | +89.6% | $19.9K |
| 10 | a1684d | 4 | 4 | 0 | 100.0% | +2.86 | +71.5% | $7.1K |

#### NHL

| # | Wallet | N | W | L | WR% | Flat PnL (u) | Flat ROI | $ PnL |
|---|---|---|---|---|---|---|---|---|
| 1 | 981187 | 5 | 5 | 0 | 100.0% | +5.03 | +100.6% | $30.3K |
| 2 | 799fad | 2 | 2 | 0 | 100.0% | +1.88 | +94.1% | $46.9K |
| 3 | 12192c | 4 | 3 | 1 | 75.0% | +2.80 | +70.0% | $154.0K |
| 4 | bc3532 | 3 | 2 | 1 | 66.7% | +1.38 | +46.0% | -$735 |
| 5 | dfa240 | 9 | 6 | 3 | 66.7% | +2.62 | +29.1% | $5.6K |
| 6 | dcafd2 | 2 | 1 | 1 | 50.0% | +0.40 | +20.0% | $4.9K |
| 7 | 6b853d | 3 | 2 | 1 | 66.7% | +0.57 | +19.1% | $5.7K |
| 8 | fcc12b | 3 | 2 | 1 | 66.7% | +0.50 | +16.6% | -$64.0K |
| 9 | b19a27 | 2 | 1 | 1 | 50.0% | +0.20 | +10.0% | -$32.9K |
| 10 | e70853 | 2 | 1 | 1 | 50.0% | -0.13 | -6.5% | -$9.4K |

---
## §8. Wallet winners — descriptive stats

Every (wallet × sport) row where the wallet has ≥ 2 bets in the sport AND flat PnL > 0. A wallet can appear in multiple sports.

### §8a. Winner cohort summary by sport

| Sport | Winners | Σ bets | Σ invested | Σ $PnL | Mean WR% | Mean N | Mean avg $ | Mean bets/day | Mean flat ROI |
|---|---|---|---|---|---|---|---|---|---|
| MLB | 5 | 51 | $761.4K | $209.7K | 65.4% | 10.2 | $14.3K | 3.00 | +28.7% |
| NBA | 25 | 174 | $3.49M | $1.60M | 69.1% | 7.0 | $22.5K | 1.83 | +66.5% |
| NHL | 9 | 33 | $509.6K | $149.7K | 71.3% | 3.7 | $18.8K | 1.09 | +45.1% |
| **ALL** | **39** | **258** | **$4.76M** | **$1.96M** | **69.2%** | **6.6** | **$20.6K** | **1.81** | **+56.7%** |

### §8b. Winner cohort — quartile distribution

Spread across every winning (wallet × sport) row.

| Metric | Min | Q25 | Median | Q75 | Max | Mean |
|---|---|---|---|---|---|---|
| N (bets) | 2.0 | 3.0 | 5.0 | 9.0 | 19.0 | 6.6 |
| WR % | 40.0% | 54.1% | 66.7% | 81.7% | 100.0% | 69.2% |
| Flat ROI % | +2.5% | +18.2% | +44.7% | +90.4% | +283.0% | +56.7% |
| $ ROI % | -97.8% | +20.4% | +53.0% | +86.0% | +280.1% | +52.0% |
| Avg bet ($) | $468 | $5.1K | $13.0K | $34.4K | $70.9K | $20.6K |
| Median bet ($) | $25 | $3.0K | $9.7K | $22.4K | $70.9K | $16.0K |
| Max bet ($) | $2.1K | $12.4K | $31.2K | $82.5K | $274.5K | $54.4K |
| Σ invested | $3.3K | $30.8K | $64.8K | $137.2K | $557.0K | $122.0K |
| $ PnL | -$118.2K | $4.5K | $19.9K | $61.5K | $315.4K | $50.2K |
| Days active | 1.0 | 2.0 | 3.0 | 4.0 | 8.0 | 3.3 |
| Span (days) | 1.0 | 2.0 | 4.0 | 6.0 | 9.0 | 4.5 |
| Bets / day | 0.40 | 0.82 | 1.13 | 2.13 | 9.50 | 1.81 |

### §8c. Winner cadence archetypes

Where do our winners cluster? Snipers fire rarely but big; volume bettors grind everything.

| Archetype | Winners | Σ bets | Mean WR% | Mean flat ROI | Mean avg $ | Mean bets/day | Σ $ PnL |
|---|---|---|---|---|---|---|---|
| Sniper (≤3 bets) | 14 | 33 | 76.2% | +89.2% | $24.7K | 0.90 | $646.5K |
| Sharp (4–6 bets) | 10 | 47 | 75.8% | +65.6% | $21.3K | 1.28 | $627.1K |
| Grinder (7–10 bets) | 8 | 66 | 59.8% | +23.7% | $14.5K | 1.66 | -$146.1K |
| Volume (>10 bets) | 7 | 112 | 56.3% | +16.8% | $18.4K | 4.56 | $830.6K |

---

_Driven by `scripts/dailyV6Report.js` · regenerates daily via `.github/workflows/daily-v6-report.yml` · WHITELIST_CONSENSUS_VERSION = 6 · QUALITY_CONTRIB_CUT = 30 · inclusion mirrors live Pick Performance dashboard · cohort tags from frozen v6 stamps_
