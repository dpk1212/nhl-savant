# WALLET PREDICTIVENESS — RESIZING SCENARIOS

Generated: 4/30/2026, 5:04:28 PM ET · sample 111 shipped sides · 2026-04-18 → 2026-04-30 (13 days)

**Question.** Hard-dropping FLAT from Δw cuts shipped volume from ~9 picks/day to ~2 picks/day. Can we KEEP the v7 LOCK floor and just RESIZE picks based on tier composition? Volume stays high; bankroll exposure to bleeders is reduced; HC-CONFIRMED dominance picks get upsized.

Lens: point-in-time tiers (the L2 lens validated in `WALLET_PREDICTIVENESS_BACKTEST.md`).

---
## §1. v7 status quo by tier-purity class

Every shipped pick falls into one of five purity classes based on its wallet contributors:

| Class | Definition | N | WR | Flat ROI | Peak PnL @ 1.0× | % of slate |
|---|---|---|---|---|---|---|
| **HC_DOMINANCE** | HC_for ≥ 1 ∧ HC_ag = 0 | 28 | 71.4% | +35.6% | +16.42u | 25.2% |
| **PURE_CONFIRMED** | CONF_for ≥ 1 ∧ FLAT_for = 0 (no HC dominance) | 18 | 44.4% | -13.8% | -3.10u | 16.2% |
| **MIXED** | CONF_for ≥ 1 ∧ FLAT_for ≥ 1 | 28 | 32.1% | -21.9% | -12.47u | 25.2% |
| **FLAT_ONLY** | CONF_for = 0 ∧ FLAT_for ≥ 1 | 23 | 34.8% | -30.9% | -10.36u | 20.7% |
| **NONE** | no whitelist contributors | 14 | 35.7% | -37.0% | -3.22u | 12.6% |

Reading: each row tells us how a different class of wallet-composition has performed under v7 (full ladder size). The class breakdown is what drives the resizing recommendation.

---
## §2. Daily volume per class

| Class | Picks | Picks/day |
|---|---|---|
| HC_DOMINANCE | 28 | 2.2 |
| PURE_CONFIRMED | 18 | 1.4 |
| MIXED | 28 | 2.2 |
| FLAT_ONLY | 23 | 1.8 |
| NONE | 14 | 1.1 |
| **TOTAL** | **111** | **8.5** |

v7 currently ships **~8.5 picks/day**. The "drop FLAT" hard rule would have shipped only 3.5384615384615383 picks/day across HC + PURE_CONFIRMED. Resizing keeps all ~8.5/day visible but with appropriately scaled stakes.

---
## §3. Resizing config comparison

Each config keeps the v7 LOCK floor intact and applies a tier-aware multiplier to peak.units. "Effective stake" is the sum of (peak.units × multiplier) across all picks. Peak PnL is the actual cash result if we'd sized that way.

| Config | Multipliers (HC / PURE / MIXED / FLAT_ONLY) | Picks shipped (stake>0) | Picks/day | WR on shipped | Flat ROI on shipped | Total stake | **Peak-unit PnL** | vs v7 |
|---|---|---|---|---|---|---|---|---|
| `v7_status_quo` | 1.00× / 1.00× / 1.00× / 1.00× | 111 | 8.5 | 45.0% | -9.8% | 153.9u | **-12.74u** | +0.00u |
| `M1_purity_tilt` | 1.50× / 1.00× / 0.50× / 0.25× | 111 | 8.5 | 45.0% | -9.8% | 127.7u | **+11.89u** | +24.63u |
| `M5_moderate` | 1.50× / 1.00× / 0.66× / 0.33× | 111 | 8.5 | 45.0% | -9.8% | 137.2u | **+8.81u** | +21.55u |
| `M2_purity_tilt_aggressive` | 2.00× / 1.00× / 0.33× / 0.10× | 111 | 8.5 | 45.0% | -9.8% | 139.4u | **+24.26u** | +37.00u |
| `M3_keep_size_drop_flat_only` | 1.00× / 1.00× / 1.00× / 0.00× | 74 | 5.7 | 50.0% | +1.8% | 111.8u | **+0.84u** | +13.58u |
| `M4_three_tier` | 1.50× / 1.00× / 1.00× / 0.00× | 74 | 5.7 | 50.0% | +1.8% | 136.4u | **+9.05u** | +21.79u |

---
## §4. Per-sport breakdown — most promising configs

### `M1_purity_tilt`

| Sport | Picks shipped | Picks/day | WR | Flat ROI | Peak PnL |
|---|---|---|---|---|---|
| MLB | 42 | 3.2 | 38.1% | -25.2% | -0.50u |
| NBA | 55 | 4.2 | 45.5% | -7.8% | +8.14u |
| NHL | 14 | 1.1 | 64.3% | +28.3% | +4.26u |

### `M5_moderate`

| Sport | Picks shipped | Picks/day | WR | Flat ROI | Peak PnL |
|---|---|---|---|---|---|
| MLB | 42 | 3.2 | 38.1% | -25.2% | -2.11u |
| NBA | 55 | 4.2 | 45.5% | -7.8% | +6.57u |
| NHL | 14 | 1.1 | 64.3% | +28.3% | +4.35u |

### `M4_three_tier`

| Sport | Picks shipped | Picks/day | WR | Flat ROI | Peak PnL |
|---|---|---|---|---|---|
| MLB | 34 | 2.6 | 38.2% | -25.2% | -4.87u |
| NBA | 34 | 2.6 | 55.9% | +17.1% | +8.82u |
| NHL | 6 | 0.5 | 83.3% | +68.3% | +5.10u |

---
## §5. What changes day-to-day under M1_purity_tilt?

Slate-by-slate volume + size shift. "Stake" column = peak.units × M1 multiplier. Picks remain visible to the user; bankroll exposure tracks tier purity.

| Date | Sport | Pick | Class | v7 size | M1 size | Outcome | v7 PnL | M1 PnL |
|---|---|---|---|---|---|---|---|---|
| 2026-04-19 | NBA | `2026-04-19_NBA_orl_det` away | HC_DOMINANCE | 1.00u | 1.50u | WIN | +3.15u | +4.73u |
| 2026-04-25 | NBA | `2026-04-25_NBA_den_min` away | MIXED | 3.00u | 1.50u | LOSS | -3.00u | -1.50u |
| 2026-04-25 | NHL | `2026-04-25_NHL_pit_phi` home | MIXED | 3.00u | 1.50u | LOSS | -3.00u | -1.50u |
| 2026-04-26 | NBA | `2026-04-26_NBA_cle_tor` away | HC_DOMINANCE | 3.00u | 4.50u | LOSS | -3.00u | -4.50u |
| 2026-04-19 | NBA | `2026-04-19_NBA_orl_det_spread` home | NONE | 2.00u | 0.50u | LOSS | -2.00u | -0.50u |
| 2026-04-20 | NBA | `2026-04-20_NBA_atl_nyk_spread` home | FLAT_ONLY | 2.00u | 0.50u | LOSS | -2.00u | -0.50u |
| 2026-04-24 | NHL | `2026-04-24_NHL_tbl_mtl` home | MIXED | 3.00u | 1.50u | WIN | +2.94u | +1.47u |
| 2026-04-18 | NBA | `2026-04-18_NBA_min_den_total` under | NONE | 2.00u | 0.50u | WIN | +1.92u | +0.48u |
| 2026-04-21 | NBA | `2026-04-21_NBA_por_sas_spread` away | FLAT_ONLY | 2.00u | 0.50u | WIN | +1.75u | +0.44u |
| 2026-04-21 | NBA | `2026-04-21_NBA_hou_lal_spread` away | FLAT_ONLY | 1.75u | 0.44u | LOSS | -1.75u | -0.44u |
| 2026-04-21 | NBA | `2026-04-21_NBA_por_sas_total` over | FLAT_ONLY | 1.75u | 0.44u | LOSS | -1.75u | -0.44u |
| 2026-04-18 | MLB | `2026-04-18_MLB_det_bos` away | NONE | 2.50u | 0.63u | WIN | +1.61u | +0.40u |
| 2026-04-21 | NBA | `2026-04-21_NBA_por_sas` away | MIXED | 0.50u | 0.25u | WIN | +2.38u | +1.19u |
| 2026-04-20 | NHL | `2026-04-20_NHL_ana_edm` away | NONE | 1.50u | 0.38u | LOSS | -1.50u | -0.38u |
| 2026-04-21 | MLB | `2026-04-21_MLB_pit_tex` away | FLAT_ONLY | 1.50u | 0.38u | LOSS | -1.50u | -0.38u |
| 2026-04-21 | NBA | `2026-04-21_NBA_phi_bos_spread` home | FLAT_ONLY | 1.50u | 0.38u | LOSS | -1.50u | -0.38u |
| 2026-04-18 | NBA | `2026-04-18_NBA_tor_cle_total` under | NONE | 1.50u | 0.38u | LOSS | -1.50u | -0.38u |
| 2026-04-21 | NBA | `2026-04-21_NBA_phi_bos_total` over | FLAT_ONLY | 1.50u | 0.38u | LOSS | -1.50u | -0.38u |
| 2026-04-28 | MLB | `2026-04-28_MLB_tbr_cle` away | HC_DOMINANCE | 2.00u | 3.00u | WIN | +2.24u | +3.36u |
| 2026-04-21 | MLB | `2026-04-21_MLB_min_nym` away | MIXED | 1.50u | 0.75u | WIN | +2.10u | +1.05u |
| 2026-04-23 | NHL | `2026-04-23_NHL_col_lak` home | FLAT_ONLY | 1.35u | 0.34u | LOSS | -1.35u | -0.34u |
| 2026-04-23 | NBA | `2026-04-23_NBA_cle_tor` home | HC_DOMINANCE | 1.60u | 2.40u | WIN | +2.00u | +3.00u |
| 2026-04-24 | NBA | `2026-04-24_NBA_sas_por` home | MIXED | 2.00u | 1.00u | LOSS | -2.00u | -1.00u |
| 2026-04-26 | MLB | `2026-04-26_MLB_laa_kcr` away | HC_DOMINANCE | 2.00u | 3.00u | LOSS | -2.00u | -3.00u |
| 2026-04-27 | MLB | `2026-04-27_MLB_nyy_tex` home | MIXED | 2.00u | 1.00u | LOSS | -2.00u | -1.00u |

Top 25 picks by absolute size-difference impact. The pattern: M1 keeps full size on PURE/HC picks (the winners), and shrinks stakes on MIXED/FLAT_ONLY picks (the bleeders).

---
## §6. Recommendation

**The volume-preserving fix is the resizing approach, not the lock-rule change.**

Top three candidates:

- **`M1_purity_tilt`** (1.5× HC / 1.0× PURE / 0.5× MIXED / 0.25× FLAT_ONLY): ships **8.5 picks/day** at 45.0% WR, -9.8% flat ROI, **+11.89u** peak — a **+24.63u swing** vs v7.
- **`M5_moderate`** (1.5× HC / 1.0× PURE / 0.66× MIXED / 0.33× FLAT_ONLY): ships **8.5 picks/day** at 45.0% WR, -9.8% flat ROI, **+8.81u** peak.
- **`M4_three_tier`** (1.5× HC / 1.0× PURE / 1.0× MIXED / 0u FLAT_ONLY): ships **5.7 picks/day** (FLAT_ONLY tracked at 0u) at 50.0% WR, +1.8% flat ROI, **+9.05u** peak.

All three preserve the bulk of daily content. M1 is the simplest to communicate (a clean four-tier ladder). M4 is the most aggressive defense (FLAT_ONLY → 0u, otherwise full size). M5 is the gentlest (every pick still ships at non-trivial size).

**Per-sport sanity check** (see §4): all three configs preserve NHL volume reasonably (NHL picks tend toward PURE/HC classes), so no sport-specific carve-out is required if we go the resizing route.

---
## §7. Implementation surface

Single-function change in `SharpFlow.jsx`:

```js
// New helper inside computeWalletConsensus → return purity class
function purityClass(forW, agW, hcConfFor, hcConfAg, confFor, flatFor) {
  if (hcConfFor >= 1 && hcConfAg === 0) return 'HC_DOMINANCE';
  if (confFor >= 1 && flatFor === 0)   return 'PURE_CONFIRMED';
  if (confFor >= 1 && flatFor >= 1)    return 'MIXED';
  if (confFor === 0 && flatFor >= 1)   return 'FLAT_ONLY';
  return 'NONE';
}

// In calculateUnits:
const PURITY_MULT = { HC_DOMINANCE: 1.5, PURE_CONFIRMED: 1.0, MIXED: 0.5, FLAT_ONLY: 0.25, NONE: 0.25 };
const baseUnits = ladderUnitsFromStars(stars);
const finalUnits = baseUnits * (PURITY_MULT[v8_purityClass] ?? 1.0);
```

Stamp `v8_purityClass` on each side at write time so the resize is auditable.

---
## §8. Caveats

- N is small (12 days, 112 shipped picks). HC_DOMINANCE has very few picks; the WR there is high but high-variance.
- Multipliers (1.5× / 1.0× / 0.5× / 0.25×) are calibrated to vault-finding effect sizes but should be re-tuned after 30 days of live data.
- Resizing means peak-unit PnL can drift from the legacy ladder targets. Monitor weekly; if total stake drifts > 30% from the target weekly bankroll budget, retune multipliers.
- Edge case: if ALL picks one day fall into FLAT_ONLY, the user sees a thin slate at 0.25× units. Consider a per-day floor of "at least 1 PURE_CONFIRMED-equivalent stake" to avoid starvation.
