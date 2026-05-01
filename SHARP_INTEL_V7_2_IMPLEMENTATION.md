# SHARP_INTEL_V7_2_IMPLEMENTATION
## Code-level work order — what changed, where, and why

**Cutover.** 2026-05-01 ET (`V7_2_CUTOVER_DATE`).
**Status.** Live. All edits in `nhl-savant/src/pages/SharpFlow.jsx` and `nhl-savant/scripts/dailyV6Report.js`.
**Backtest.** `WALLET_HC_MARGIN_ANALYSIS.md`.
**Replaces.** v7.1 (`SHARP_INTEL_V7_1_IMPLEMENTATION.md`).

---

## Summary of changes

| File | What changed |
|---|---|
| `src/pages/SharpFlow.jsx` | New v7.2 constants block; `lockTierFromDeltas`, `calculateUnits`, `calculateSpreadTotalUnits`, `computeLiveSizing`, `decideLockStage`, `stampWalletConsensus` patched for HC-margin tiered logic; LockedPickCard renders new `HC ×1.75` chip and v7.2 narrative; `WHITELIST_CONSENSUS_VERSION` bumped 7 → 8; `PROMOTED_BY_FLOORS` helper added |
| `scripts/dailyV6Report.js` | Captures `v8_hcMargin`; new §10 v7.2 cohort table (margin × Σ, promotion source, SUPER vs STANDARD); footer reflects version 8 |
| `SHARP_INTEL_V7_2_PLAYBOOK.md` | New canonical doc (matrix, definitions, UI guide) |

No data deletion. Historic Firestore docs are untouched — `v8_systemVersion` stamps record which version each pick was decided under.

---

## New constants (`SharpFlow.jsx`)

```js
const V7_2_CUTOVER_DATE              = '2026-05-01';
const V7_2_HC_MARGIN_TIERED_ENABLED  = true;       // master kill-switch
const V7_2_HC_M1_MULT                = 1.5;        // HC_margin = +1
const V7_2_HC_M2_MULT                = 1.75;      // HC_margin ≥ +2 SUPER
const V7_2_HC_CAP_ML_ELITE           = 4.5;
const V7_2_HC_CAP_ML_NON             = 3.5;       // bumped from 3.0 to fit ×1.75 of 2.0u
const V7_2_HC_CAP_ST_ELITE           = 3.5;
const V7_2_HC_CAP_ST_NON             = 2.0;       // bumped from 1.75
const V7_2_SIGMA2_LOCK_UNITS_ML      = 0.5;       // Σ=2 ∧ HC_m ≥ +2 lock floor (ML)
const V7_2_SIGMA2_LOCK_UNITS_ST      = 0.5;       // Σ=2 ∧ HC_m ≥ +2 lock floor (S+T)
```

`isV72Eligible(pickDate)` returns `true` only when the pick date is ≥ cutover AND the kill-switch is true.

`PROMOTED_BY_FLOORS` (Set) collects every legitimate `promotedBy` so sync flows can check via `isPromotedBy(p)`:

```
'two-factor-floor', 'contribution', 'whitelist',
'hc-dominance',                          // v7.1 legacy
'v72-hc-margin',                         // v7.2 Σ ∈ {3,4} HC_m ≥ +1
'v72-sigma2-lock', 'v72-sigma2-lean',    // v7.2 Σ=2 NEW
```

---

## `lockTierFromDeltas(dw, dq, hcDominant, opts)` — new branches

`opts.hcMargin` is the v7.2 continuous dial. Falls back to `hcDominant ? 1 : 0` when absent (legacy callers).

```text
sum = dw + dq
hcMargin = opts.hcMargin (or hcDominant ? 1 : 0)

NEW v7.2 paths (only when isV72Eligible(opts.pickDate)):
  sum === 2 ∧ hcMargin ≥ 2  → 'LOCKED'   (Σ=2 lock floor — was MUTED)
  sum === 2 ∧ hcMargin ≥ 1  → 'LEAN'     (Σ=2 lean floor — was MUTED)
  sum ∈ {3,4} ∧ hcMargin ≥ 1 → 'LOCKED'   (replaces v7.1 HC_DOM gate)

Existing paths unchanged:
  sum ≥ 7 → 'ELITE'
  sum ≥ 5 → 'LOCKED'
  v7.1 fallback: sum ∈ {3,4} ∧ isV71Eligible ∧ hcDominant → 'LOCKED'
```

---

## `calculateUnits` / `calculateSpreadTotalUnits` — multiplier logic

```text
Compute base units from stars (or Σ=2 lock floor for the v7.2 NEW cohort).
Apply favorite/dog odds clamps.
Then multiply by HC tier:

  v72 ∧ hcMargin ≥ 2  → units × V7_2_HC_M2_MULT (1.75) capped at V7_2_HC_CAP_*
  v72 ∧ hcMargin ≥ 1  → units × V7_2_HC_M1_MULT (1.50) capped at V7_2_HC_CAP_*
  v71 ∧ hcDominant    → units × V7_1_HC_MULT     (1.50) capped at V7_1_HC_CAP_*
  else                 → no upsize
```

The Σ=2 ∧ HC_m ≥ +2 case bypasses the stars≥3.5 floor (else units would zero out) and seeds at `V7_2_SIGMA2_LOCK_UNITS_ML/ST` before the multiplier applies. The sync layer's `Math.max(units, 0.5)` floor keeps it ≥ 0.5u after the multiplier.

---

## `decideLockStage` — Σ=2 bypass

```text
v72Sigma2Lock  := v72 ∧ cfg.promote ∧ dw≥1 ∧ dq≥1 ∧ sum===2 ∧ hcMargin ≥ 2
v72Sigma2Lean  := v72 ∧ cfg.promote ∧ dw≥1 ∧ dq≥1 ∧ sum===2 ∧ hcMargin === 1

if (wc.promotionEligible OR v72Sigma2Lock OR v72Sigma2Lean) → ship LOCKED

promotedBy resolution (priority order):
  1. v72-sigma2-lock      (Σ=2 lock NEW)
  2. v72-sigma2-lean      (Σ=2 lean NEW)
  3. v72-hc-margin        (Σ ∈ {3,4} ∧ v72 ∧ hcMargin ≥ 1)
  4. hc-dominance         (Σ ∈ {3,4} ∧ v71 ∧ hcDominant)
  5. two-factor-floor     (Σ ≥ 5)
```

The decision object now exposes `hcMargin` alongside `hcDominant`.

---

## `stampWalletConsensus` — new fields

| Field | Meaning |
|---|---|
| `v8_hcMargin` | `hcConfFor − hcConfAg` (NEW for v7.2) |
| `v8_systemVersion` | `'7.2'` if isV72Eligible, else `'7.1'`/`'7.0'` |
| `v8_walletConsensusVersion` | bumped to **8** (was 7) — triggers one-time restamp on existing docs |
| `v8_topPick` | `true` for ANY shipped lock under v7.2 (was `Σ ≥ 5` under v7.1) |
| `v8_superTopPick` | `true` when shipped AND `hcMargin ≥ 2` (was `hcDominant` under v7.1) |
| `v8_walletConsensusPromotionTriggered` | extended to recognise the 3 new v7.2 promotedBy tags |

Pre-cutover stamps preserve their version-correct values via the `if (v72Active)` branch — historic picks remain on v7.0/v7.1 logic.

---

## `computeLiveSizing` (UI live-recompute)

Now accepts `liveHcMargin` and threads it through `lockTierFromDeltas` + the unit ladder. The `LockedPickCard` callsite reads `sd.v8_hcMargin` (with fallback to `(hcConfFor − hcConfAg)` for older docs).

```js
liveHcMargin: Number.isFinite(sd.v8_hcMargin)
  ? sd.v8_hcMargin
  : ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0)),
```

---

## `LockedPickCard` UI changes

| Behaviour | Before (v7.1) | After (v7.2) |
|---|---|---|
| HC chip text | always `HC ×1.5` | `HC ×1.5` for `HC_m = +1` (or v7.1 HC_DOM); **`HC ×1.75`** with glow for `HC_m ≥ +2` (SUPER) |
| Chip background | flat gold-dim | gold-dim (standard) OR `rgba(212,175,55,0.30)` + box-shadow glow (SUPER) |
| Tooltip | "HC dominance: N for, 0 against" | Tier-aware. SUPER tier cites the 9-1 / +76.5% ROI backtest. |
| Narrative | "Promoted out of LEAN by N HC winners" | Σ=2 cases: "LEAN-floor lock: Σ=2 promoted by HC margin +N..." |
| `pick.hcMargin` | not present | sourced from `sd.v8_hcMargin` (computed fallback) |

---

## `dailyV6Report.js` §10 (NEW)

| Sub-section | What it shows |
|---|---|
| §10a | HC margin tier × Σ bucket (3 × 6 grid of WR / flat ROI) |
| §10b | Promotion-source cohorts: `v72-hc-margin`, `v72-sigma2-lock`, `v72-sigma2-lean`, `two-factor-floor` |
| §10c | SUPER (HC_m ≥ +2) vs STANDARD (HC_m = +1) vs no-HC head-to-head |

§10 prints an empty-state message when `v72Rows.length === 0` (i.e. before any post-cutover pick has graded). §9 (v7.1 HC dominance cohort) is preserved for the legacy 1-day window.

---

## Sync flow callsites — updated

The 5 places that previously hard-coded `promotedBy === 'two-factor-floor' || ... || 'hc-dominance'` now route through `isPromotedBy(...)` so future v7.x promotion sources don't require touching every callsite.

The 3 `clampCeiling` blocks (ML / spread / total in `syncPickToFirebase`, `syncSpreadPickToFirebase`, `syncTotalPickToFirebase`) now consume `decision.hcMargin` and pick the v7.2 cap when `isV72Eligible ∧ hcM ≥ 1`, falling back to v7.1 caps for the 1-day window and the v7.0 default 3.0u/2.0u ceiling otherwise.

---

## Pre-flight tests run

| Test | Result |
|---|---|
| `npm run build` | ✅ Built in 7.99s, no compile errors |
| `node scripts/dailyV6Report.js` | ✅ Generated §10 with empty-cohort message (correct, pre-cutover) |
| `ReadLints` on edited files | ✅ No new linter errors |

---

## Rollback procedure

1. **Quickest** — flip `V7_2_HC_MARGIN_TIERED_ENABLED = false` in `SharpFlow.jsx` and redeploy. All v7.2-eligible picks immediately fall back to v7.1 logic. No Firestore changes.
2. **Full revert** — `git revert` the v7.2 commit. The `WHITELIST_CONSENSUS_VERSION = 8` bump means v7.1 docs that already restamped to version 8 will get re-stamped back to version 7 on the next sync — non-destructive.

---

## Monitoring playbook

1. After cutover, watch the first 5 days of v7.2 picks via `scripts/v71LockAudit.js` (still works — partitions by version).
2. Re-run `scripts/walletHcMarginAnalysis.js` weekly to monitor cohort drift.
3. `scripts/dailyV6Report.js §10c` is the headline split. Decision rule:
   - SUPER ≥ +20 pp WR over STANDARD on N ≥ 20 → keep ×1.75
   - SUPER < STANDARD by ≥ 5 pp on N ≥ 30 → revert to v7.1 (kill-switch)
4. The Σ=2 ∧ HC_m ≥ +2 cohort starts at N=0 — should accumulate ~2-3/week. Once N ≥ 15 we'll have data on whether the new lock floor holds up.
