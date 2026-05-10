# WALLET PIPELINE AUDIT

Generated: **2026-04-30T10:31:51.966Z** · today=2026-04-30 · v6 cutover=2026-04-18
Window for §5 utilization: last 7 days (since 2026-04-23).

---
## §1. Source A — walletDetails coverage on graded v6-era picks

| Metric | Count | Coverage |
|---|---|---|
| Total v6-era sides scanned | 235 | — |
| Sides with walletDetails stamped | 225 | 95.7% |
| Graded sides | 225 | — |
| Graded sides with walletDetails | 215 | 95.6% |

### §1a. Per-sport graded coverage

| Sport | Graded sides | With walletDetails | Coverage |
|---|---|---|---|
| MLB | 83 | 79 | 95.2% |
| NBA | 105 | 101 | 96.2% |
| NHL | 37 | 35 | 94.6% |

### §1b. Per-date graded coverage (graded sides only, gaps highlighted)

| Date | Graded | Stamped | Coverage |
|---|---|---|---|
| 2026-04-18 | 14 | 7 | 50.0% ⚠️ |
| 2026-04-19 | 11 | 11 | 100.0% |
| 2026-04-20 | 17 | 17 | 100.0% |
| 2026-04-21 | 18 | 18 | 100.0% |
| 2026-04-22 | 13 | 12 | 92.3% ⚠️ |
| 2026-04-23 | 14 | 12 | 85.7% ⚠️ |
| 2026-04-24 | 13 | 13 | 100.0% |
| 2026-04-25 | 18 | 18 | 100.0% |
| 2026-04-26 | 30 | 30 | 100.0% |
| 2026-04-27 | 21 | 21 | 100.0% |
| 2026-04-28 | 29 | 29 | 100.0% |
| 2026-04-29 | 27 | 27 | 100.0% |

**Distinct wallets observed in Source A:** 103

---
## §2. Source B — sharp_action_positions coverage

| Metric | Count |
|---|---|
| Total positions | 1996 |
| GRADED | 1913 |
| · VAULT-qualified | 1300 |
| · SHADOW | 613 |
| PENDING | 83 |
| OPEN | 0 |
| Distinct walletShort (any status) | 122 |
| Distinct walletShort (GRADED only) | 118 |

### §2a. Per-sport GRADED position coverage

| Sport | GRADED | Distinct wallets | First date | Last date |
|---|---|---|---|---|
| MLB | 542 | 49 | 2026-04-17 | 2026-04-30 |
| NBA | 1083 | 105 | 2026-04-17 | 2026-04-30 |
| NHL | 288 | 41 | 2026-04-17 | 2026-04-30 |

### §2b. Recent activity (last 7 days)

Positions GRADED on/after 2026-04-23: **1340** (distinct wallets: **90**).

---
## §3. Profile collection — sharpWalletProfiles

Profiles in collection: **124**

### §3a. Whitelist tier breakdown (across all wallet × sport entries)

| Tier | Count | Share |
|---|---|---|
| CONFIRMED | 30 | 14.4% |
| FLAT | 12 | 5.7% |
| WR50 | 24 | 11.5% |
| NULL | 143 | 68.4% |
| **TOTAL** | **209** | 100% |

### §3b. Per-sport tier breakdown

| Sport | CONFIRMED | FLAT | WR50 | NULL | Total |
|---|---|---|---|---|---|
| MLB | 4 | 3 | 1 | 45 | 53 |
| NBA | 19 | 6 | 16 | 68 | 109 |
| NHL | 7 | 3 | 7 | 30 | 47 |

### §3c. Profile freshness (lastBetDate)

| Bucket | # Profiles |
|---|---|
| lastBetDate = today (2026-04-30) | 17 |
| lastBetDate = yesterday | 27 |
| lastBetDate within last 7d | 93 |
| lastBetDate older than 7d | 31 |

---
## §4. Cross-source reconciliation

### §4a. Wallet set diff (Source A vs sharpWalletProfiles)

| Direction | Count |
|---|---|
| Wallets in Source A (graded picks) AND in profiles | 103 |
| Wallets in Source A but **MISSING from profiles** | 0 ⚠️ |
| Wallets in profiles but never seen in Source A | 21 |

### §4b. Whitelist tier rebuilt LIVE vs stored in `sharpWalletProfiles`

Stored (per §3a) | Live-rebuild (right now from current Source A + B)

| Tier | Stored | Live-rebuild | Δ |
|---|---|---|---|
| CONFIRMED | 30 | 30 | +0 |
| FLAT | 12 | 12 | +0 |
| WR50 | 24 | 24 | +0 |
| NULL | 143 | 143 | +0 |

Big positive deltas in CONFIRMED/FLAT mean the stored cache is missing wallets that should be promoted — re-run `node scripts/exportWalletProfiles.js --write-firebase`.

---
## §5. Live utilization — last 7 days of LOCKED sides

| Metric | Count | Share |
|---|---|---|
| Locked sides (last 7d) | 93 | — |
| · Δw > 0 (whitelist fired) | 68 | 73.1% |
| · Δw ≤ 0 (locked despite no whitelist support) | 25 | 26.9% ⚠️ |
| · Δw > 0 ∧ Δq ≤ 0 (whitelist for, quality against) | 2 | 2.2% |
| · Δq > 0 ∧ Δw ≤ 0 (quality only — whitelist gap) | 20 | 21.5% |

Sample sides where the live engine had Δq > 0 but Δw = 0 (potential whitelist gap):

| Date | Sport | Market | Side | docId | Δw | Δq | tier |
|---|---|---|---|---|---|---|---|
| 2026-04-24 | MLB | ML | home | `2026-04-24_MLB_chc_lad` | 0 | 2 | — |
| 2026-04-24 | NBA | ML | away | `2026-04-24_NBA_bos_phi` | 0 | 2 | — |
| 2026-04-24 | NHL | ML | away | `2026-04-24_NHL_vgk_uta` | 0 | 1 | — |
| 2026-04-25 | NBA | ML | away | `2026-04-25_NBA_nyk_atl` | -1 | 1 | — |
| 2026-04-26 | NBA | ML | away | `2026-04-26_NBA_lal_hou` | 0 | 1 | — |
| 2026-04-26 | NHL | ML | home | `2026-04-26_NHL_buf_bos` | -2 | 2 | — |
| 2026-04-27 | MLB | ML | away | `2026-04-27_MLB_tbr_cle` | 0 | 1 | — |
| 2026-04-27 | NBA | ML | home | `2026-04-27_NBA_det_orl` | -1 | 3 | — |
| 2026-04-27 | NBA | ML | away | `2026-04-27_NBA_okc_phx` | 0 | 1 | — |
| 2026-04-27 | NHL | ML | home | `2026-04-27_NHL_phi_pit` | 0 | 4 | — |
| 2026-04-28 | MLB | ML | away | `2026-04-28_MLB_chc_sdp` | 0 | 1 | — |
| 2026-04-28 | MLB | ML | home | `2026-04-28_MLB_stl_pit` | 0 | 2 | — |
| 2026-04-28 | NBA | ML | home | `2026-04-28_NBA_por_sas` | 0 | 3 | — |
| 2026-04-30 | NBA | ML | away | `2026-04-30_NBA_den_min` | 0 | 3 | MUTED |
| 2026-04-24 | NBA | SPREAD | home | `2026-04-24_NBA_bos_phi_spread` | 0 | 3 | — |

---
## §6. Verdict & action items

### What's working

- ✓ Source A coverage is **95.6%** — walletDetails is being stamped reliably.
- ✓ Source B has **1913** graded positions across **118** distinct wallets.
- ✓ 73% of last-7d LOCKED sides had Δw > 0 — whitelist is firing on the majority of locks.

### No issues detected.
