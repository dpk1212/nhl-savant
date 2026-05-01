# SHARP_INTEL_V7_2_PLAYBOOK
## HC-margin tiered locks + Σ=2 promotion

**Status.** Live 2026-05-01.
**Replaces.** `SHARP_INTEL_V7_1_PLAYBOOK.md` (binary HC_DOM gate).
**Backtest.** `WALLET_HC_MARGIN_ANALYSIS.md` (N=89 picks, 12 days, Apr 18–Apr 29).

---

## Why we changed v7.1

v7.1 promoted Σ ∈ {3,4} picks from LEAN to LOCK using a binary gate:
**HC dominance** = `HC_for ≥ 1 ∧ HC_ag = 0`.

The follow-up analysis (`WALLET_HC_MARGIN_ANALYSIS.md`) tested whether
**HC margin** (`HC_for − HC_ag`) is a continuous quality dial — i.e.
does HC `2-0` outperform HC `1-0`? Two findings forced v7.2:

| Cohort | N | W-L | WR | flat ROI | net |
|---|---|---|---|---|---|
| HC_for=1 ∧ HC_ag=0 (v7.1 standard) | 16 | 11-5 | 68.8% | +27.0% | +4.32u |
| **HC_for=2 ∧ HC_ag=0 (SUPER)** | **10** | **9-1** | **90.0%** | **+76.5%** | **+7.65u** |

1. **HC_margin ≥ +2 is a 90% WR cohort.** v7.1 sized it identically to
   the +1 cohort. v7.2 graduates it to a ×1.75 multiplier.
2. **HC_margin ≥ +1 lifts every Σ tier** (6/6 buckets, +38 pp pooled WR,
   +64.6% pooled flat ROI). v7.2 promotes Σ=2 picks (currently SHADOW)
   to LEAN at HC_m=+1 and LOCK at HC_m≥+2 — a brand-new tier.

---

## v7.2 lock matrix

The lock floor is now driven by HC margin as a continuous dial:

|        | HC_m ≤ 0           | HC_m = +1                    | HC_m ≥ +2                                    |
|---     |---                 |---                           |---                                           |
| **Σ=2**| SHADOW (not shipped)| **LEAN** (0u, tracked) NEW  | **LOCK 0.5u** NEW                            |
| **Σ=3**| LEAN (0u, tracked) | **LOCK** base × 1.5         | **LOCK** base × **1.75** (SUPER)             |
| **Σ=4**| LEAN (0u, tracked) | **LOCK** base × 1.5         | **LOCK** base × **1.75** (SUPER)             |
| **Σ=5**| LOCK base          | LOCK base × 1.5             | LOCK base × **1.75** (SUPER)                 |
| **Σ=6**| LOCK base          | LOCK base × 1.5             | LOCK base × **1.75** (SUPER)                 |
| **Σ≥7**| LOCK ELITE base    | LOCK ELITE × 1.5            | LOCK ELITE × **1.75** (SUPER, capped 4.5u ML)|

Bold cells = HC margin promotes / upsizes. Caps: ML 4.5u (ELITE) / 3.5u
(non-ELITE). Spreads & totals: 3.5u (ELITE) / 2.0u (non-ELITE).

---

## Definitions

| Term | Definition |
|---|---|
| **HC** | wallet with `whitelistTier === 'CONFIRMED'` AND `sizeRatio ≥ 1.5×` |
| **HC_for** (`v8_hcConfFor`) | count of HC wallets backing the pick side |
| **HC_ag** (`v8_hcConfAg`) | count of HC wallets backing the opposite side |
| **HC_margin** (`v8_hcMargin`) | `HC_for − HC_ag` (continuous quality dial) |
| **HC_DOM** | `HC_for ≥ 1 ∧ HC_ag = 0` (v7.1 binary gate, deprecated) |
| **Σ** | `Δw + Δq` — winner margin plus quality margin |
| **STANDARD HC** | HC_margin = +1 → ×1.5 multiplier (was v7.1 default) |
| **SUPER HC** | HC_margin ≥ +2 → ×1.75 multiplier (new in v7.2) |

---

## Promotion sources (`promotedBy`)

| Tag | What it means |
|---|---|
| `two-factor-floor` | Σ ≥ +5 — unchanged across v7.0/v7.1/v7.2 |
| `hc-dominance` | v7.1 HC_DOM promotion (Σ ∈ {3,4}). Legacy — only fires for picks dated 2026-04-30 ≤ d < 2026-05-01 |
| `v72-hc-margin` | v7.2 HC margin ≥ +1 promotion (Σ ∈ {3,4}) — supersedes `hc-dominance` |
| `v72-sigma2-lock` | v7.2 NEW Σ=2 ∧ HC_m ≥ +2 lock — **brand-new lock floor** |
| `v72-sigma2-lean` | v7.2 NEW Σ=2 ∧ HC_m = +1 lean — **brand-new lean floor** |

---

## TOP PICK / SUPER TOP PICK badges

v7.2 redefines the SUPER TOP PICK criterion:

| Badge | v7.1 rule | v7.2 rule |
|---|---|---|
| TOP PICK (gold outline) | shipped + Σ ≥ +5 | any shipped lock |
| SUPER TOP PICK (gold filled, glow) | shipped + HC_DOM | **shipped + HC_margin ≥ +2** |

The SUPER badge now tracks the proven 9-1 / +76.5% ROI cohort exactly.
Picks shipping with the HC ×1.75 chip will also carry the SUPER ribbon.

---

## UI surface area

| Element | Trigger | Display |
|---|---|---|
| **HC ×1.5** chip (gold dim) | post-v7.1, HC_DOM (legacy) OR HC_margin = +1 | next to unit chip |
| **HC ×1.75** chip (gold filled, glow) | post-v7.2, HC_margin ≥ +2 (SUPER) | next to unit chip |
| **DOWNSIZED** chip (amber) | live units < peak units | next to unit chip |
| **0u · TRACK** chip (blue) | lockTier === 'LEAN' | replaces unit chip |
| **TOP PICK** ribbon (gold outline) | `v8_topPick === true` (any locked side) | top of card |
| **SUPER TOP PICK** ribbon (gold filled) | `v8_superTopPick === true` (HC_m ≥ +2) | top of card |
| Narrative line | `promotedBy === 'v72-sigma2-lock/lean'` | "LEAN-floor lock: Σ=2 promoted by HC margin +N (..)" |
| Narrative line | `promotedBy === 'v72-hc-margin'` | "Promoted out of LEAN by HC margin +N (..)" |

---

## Cutover & rollback

| Date | What changes |
|---|---|
| **2026-05-01 ET (cutover)** | All picks dated ≥ 2026-05-01 run v7.2 logic. Older picks keep v7.1/v7.0. |
| Per-pick gate | `isV72Eligible(pickDate)` requires both date ≥ cutover AND `V7_2_HC_MARGIN_TIERED_ENABLED === true` |
| Kill switch | Flip `V7_2_HC_MARGIN_TIERED_ENABLED = false` in `SharpFlow.jsx` to revert without redeploy |
| Stamp version | `v8_walletConsensusVersion = 8` (was 7). `restampDriftedSides` will refresh active docs once after deploy. |
| Historic picks | Untouched. v8_systemVersion stamps preserve the version each doc was decided under. |

---

## Monitoring

`scripts/dailyV6Report.js §10` partitions v7.2 picks by:
- HC margin tier × Σ bucket (§10a)
- Promotion source (§10b)
- SUPER vs STANDARD vs no-HC head-to-head (§10c)

`WALLET_HC_MARGIN_ANALYSIS.md` should re-run weekly until each Σ × HC_margin
cell has N ≥ 10 to confirm the v7.2 cohorts hold up.

---

## Related docs
- `WALLET_HC_MARGIN_ANALYSIS.md` — backtest that produced v7.2
- `WALLET_GATE_SCALE_TEST.md` — original v7.1 HC_DOM validation
- `SHARP_INTEL_V7_1_PLAYBOOK.md` — predecessor (deprecated)
- `SHARP_INTEL_V7_2_IMPLEMENTATION.md` — code-level work order
