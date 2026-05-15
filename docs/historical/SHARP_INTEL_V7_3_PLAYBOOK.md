# SHARP INTEL v7.3 — HC-MARGIN FLOOR + MUTE OVERRIDE

_Last updated: 2026-04-30 · Author: Sharp Intel research · Status: **shipped — live as of 2026-04-30**_

This is the canonical playbook for v7.3. It builds directly on `SHARP_INTEL_V7_2_PLAYBOOK.md`. Read v7.2 first if you haven't.

The v7.3 changes are driven by `WALLET_HC_MARGIN_ANALYSIS_FULL.md`, a full-universe analysis on N=141 graded sides since the v7 cutover. **HC margin (HC_for − HC_ag, where HC = CONFIRMED ∧ sizeRatio ≥ 1.5) is the single most reliable wallet-quality dial we've found.** It produces statistically significant lift in cohorts the v6.6 health engine actively rejects:

- **MUTED ∧ HC_m ≥ +1**: 11-2 (84.6% WR, +85% flat ROI, +8.51u net), p = 0.006
- **Σ=2 ∧ HC_m ≥ +1**: 8-3 (63% WR, +37% flat ROI, +2.96u net)
- **Σ=1 ∧ HC_m ≥ +1**: 1-1 (50% WR, −3% flat ROI, n=2 — small but consistent)

v7.3 acts on those findings.

---

## §0. TL;DR

**v7.3 introduces two changes.**

### Change 1 — Floor lowering

Picks below the v6.6 hybrid floor (Σ ≥ +3 ∧ Δw ≥ +1 ∧ Δq ≥ +1) now ship as LOCK when HC margin ≥ +1 backs them.

```
Σ=1 ∧ HC_m ≥ +1 → LOCK 0.5u  (NEW — was MUTED)
Σ=2 ∧ HC_m ≥ +1 → LOCK 0.5u  (NEW — was LEAN under v7.2)
Σ ≥ +3 ∧ HC_m ≥ +1 → LOCK    (already shipped under v7.2)
```

### Change 2 — MUTE override

The v6.6 health engine has three rules that mute a locked pick on decay:

```
dw = 0  (winners_below_floor)  → MUTE
dq ≤ 0  (quality_below_floor)  → MUTE
sum < 3 (sum_below_floor)      → MUTE
```

v7.3 suppresses all three when `HC_m ≥ +1`. Pick stays ACTIVE (with a `RESCUED` chip in the UI).

**What does NOT change:**

- `dw ≤ −2` still CANCELs the pick (CANCELLED ∧ HC_m ≥ +1 cohort is N=2 — too small to override).
- `dw = −1` (winners_faded) still mutes — proven winners actively flipping off is a strong negative signal.
- The TOP PICK / SUPER TOP PICK badge logic is unchanged from v7.2.
- The HC ×1.5 / ×1.75 unit multipliers are unchanged from v7.2.

---

## §1. Lock matrix

```
       HC_m ≤ 0          HC_m = +1            HC_m ≥ +2
  Σ=1  SHADOW            LOCK 0.5u (NEW)      LOCK 0.5u (NEW)
  Σ=2  SHADOW            LOCK 0.5u (NEW)      LOCK 0.5u
  Σ=3  LEAN              LOCK base ×1.5       LOCK base ×1.75
  Σ=4  LEAN              LOCK base ×1.5       LOCK base ×1.75
  Σ=5  LOCK base         LOCK base ×1.5       LOCK base ×1.75
  Σ=6  LOCK base         LOCK base ×1.5       LOCK base ×1.75
  Σ≥7  LOCK ELITE        LOCK ELITE ×1.5      LOCK ELITE ×1.75
```

**Cells marked NEW are the v7.3 additions.** All other cells are inherited from v7.2.

The Σ=1 / Σ=2 lock floor is set at 0.5u so the sync-layer `Math.max(units, 0.5)` clamp doesn't override anything. The HC multiplier stacks on top:

```
Σ=1 ∧ HC_m = +1 → 0.5u × 1.5 = 0.75u
Σ=1 ∧ HC_m ≥ +2 → 0.5u × 1.75 = 0.88u
Σ=2 ∧ HC_m = +1 → 0.5u × 1.5 = 0.75u
Σ=2 ∧ HC_m ≥ +2 → 0.5u × 1.75 = 0.88u
```

The ML and Spread/Total ladders use the same 0.5u floor (`V7_3_SIGMA1_LOCK_UNITS_*` and `V7_3_SIGMA2_LOCK_UNITS_*` constants).

---

## §2. MUTE override matrix

```
Engine reason          v6.6 / v7.2          v7.3 (HC_m ≥ +1)
─────────────────────────────────────────────────────────────
winners_killed         CANCELLED            CANCELLED  (unchanged)
winners_faded          MUTED                MUTED      (unchanged)
winners_below_floor    MUTED                ACTIVE     (RESCUED)
quality_below_floor    MUTED                ACTIVE     (RESCUED)
sum_below_floor        MUTED                ACTIVE     (RESCUED)
```

The override is implemented in two places (both must be in sync):

1. `computeWalletConsensus()` — controls whether `lockAction` reads `'MUTE'` and whether `promotionEligible` is true at the initial lock decision.
2. `evaluatePickHealth()` — controls live MUTED transitions after the pick has locked.

Both functions now accept a `pickDate` argument and consult `isV73Eligible(pickDate)` before applying the override.

When the override fires, the health engine appends `'v73_hc_rescue'` to `health.reasons` (diagnostic only) and the stamping layer sets `target.v8_v73HcRescue = true` so the UI can render the green `RESCUED` chip on the locked pick card.

---

## §3. New `promotedBy` tags

`decideLockStage()` writes one of these tags to `target.promotedBy` when a side ships:

| Tag | Meaning | Source |
|---|---|---|
| `v73-sigma1-hc` | Σ=1 ∧ HC_m ≥ +1, both axes ≥ 0 | NEW v7.3 floor |
| `v73-sigma2-hc` | Σ=2 ∧ HC_m ≥ +1, both axes ≥ 0 | NEW v7.3 floor (was v7.2 LEAN) |
| `v73-hc-rescue` | Σ ≥ +3 ∧ HC_m ≥ +1 ∧ (dw=0 ∨ dq=0) | NEW v7.3 rescue from MUTE |
| `v72-sigma2-lock` | Σ=2 ∧ HC_m ≥ +2, both axes ≥ +1 | v7.2, only when v7.3 is off |
| `v72-sigma2-lean` | Σ=2 ∧ HC_m = +1, both axes ≥ +1 | v7.2, only when v7.3 is off |
| `v72-hc-margin` | Σ ∈ {3, 4} ∧ HC_m ≥ +1 ∧ Δw ≥ +1 ∧ Δq ≥ +1 | v7.2 |
| `hc-dominance` | Σ ∈ {3, 4} ∧ HC_DOM | v7.1 |
| `two-factor-floor` | Σ ≥ +5 ∧ Δw ≥ +1 ∧ Δq ≥ +1 | legacy (all versions) |

Daily report §11 partitions live performance by these tags.

---

## §4. UI surface area

The locked pick card now renders three new visual elements:

1. **RESCUED chip** (green) — fired when `v8_v73HcRescue === true` OR `promotedBy === 'v73-hc-rescue'`. Indicates HC margin overrode a v6.6 mute. Tooltip cites the 11-2 / +85% ROI / p=0.006 evidence.
2. **Σ=1 FLOOR / Σ=2 FLOOR chip** (light-blue) — fired when `promotedBy ∈ {v73-sigma1-hc, v73-sigma2-hc}`. Indicates the pick ships below the v6.6 hybrid floor at the 0.5u v7.3 floor.
3. **Updated narrative line** — explicitly mentions "RESCUED from MUTE by HC margin +N" or "v7.3 Σ=N lock" when the appropriate promotion source fires.

The HC ×1.5 / ×1.75 chip (gold) and TOP PICK / SUPER TOP PICK badges are inherited from v7.2 and continue to work identically.

---

## §5. Constants (in `SharpFlow.jsx`)

```js
const V7_3_CUTOVER_DATE = '2026-04-30';      // YYYY-MM-DD ET — same day as v7.2 cutover
const V7_3_HC_OVERRIDES_ENABLED = true;       // master kill-switch
const V7_3_SIGMA1_LOCK_UNITS_ML = 0.5;        // Σ=1 ∧ HC_m ≥ +1 lock floor (ML)
const V7_3_SIGMA1_LOCK_UNITS_ST = 0.5;        // Σ=1 ∧ HC_m ≥ +1 lock floor (S+T)
const V7_3_SIGMA2_LOCK_UNITS_ML = 0.5;        // Σ=2 ∧ HC_m  = +1 lock floor (ML)
const V7_3_SIGMA2_LOCK_UNITS_ST = 0.5;        // Σ=2 ∧ HC_m  = +1 lock floor (S+T)

const WHITELIST_CONSENSUS_VERSION = 9;        // bumped 8 → 9 for v7.3
```

`isV73Eligible(pickDate)` returns true when `V7_3_HC_OVERRIDES_ENABLED && pickDate >= V7_3_CUTOVER_DATE`.

---

## §6. Cutover

**Cutover date: 2026-04-30 (today's slate).** Both v7.2 and v7.3 share the same cutover date — flipping v7.3 simultaneously avoids a confusing window where Σ=2 ∧ HC_m=+1 is briefly LEAN (v7.2) and then becomes LOCK (v7.3). All picks dated `2026-04-30+` ship under v7.3.

**Historic picks are unchanged.** The cutover is enforced in:
- `lockTierFromDeltas()` via `isV73Eligible(opts.pickDate)`
- `decideLockStage()` via `isV73Eligible(pickDate)`
- `computeWalletConsensus()` via `isV73Eligible(pickDate)` argument
- `evaluatePickHealth()` via `isV73Eligible(pickDate)` argument
- `stampWalletConsensus()` via `isV73Eligible(pickDate)` for `v8_systemVersion`
- `calculateUnits()` / `calculateSpreadTotalUnits()` via `isV73Eligible(opts.pickDate)`

Picks dated < `2026-04-30` route to v7.2 (or v7.1 / v7.0) logic and stamps. Their stored `v8_systemVersion`, `v8_lockTier`, `v8_v73HcRescue`, and `promotedBy` fields stay unchanged.

---

## §7. Rollback

To roll v7.3 back without redeploying source:

1. Edit `SharpFlow.jsx`, set `V7_3_HC_OVERRIDES_ENABLED = false`.
2. Build + deploy.

`isV73Eligible()` will return false for every pick date, every v7.3 promotion path will short-circuit, and every MUTE override will revert to v6.6 / v7.2 behavior. v7.3-stamped picks already in Firestore keep their stamps but the UI will recompute live tiers using v7.2 logic.

To roll back a single date, set `V7_3_CUTOVER_DATE` to a future date. v7.3 logic stays off until then.

---

## §8. Monitoring

Daily report §11 (`scripts/dailyV6Report.js`) writes a v7.3 cohort table:

- §11a: Performance by `promotedBy` (sigma1-hc, sigma2-hc, hc-rescue, established v7.x sources)
- §11b: NEW v7.3 promotions vs ESTABLISHED head-to-head

Both populate as v7.3 picks accumulate. Initial ship is "no v7.3 picks yet" until the first slate clears 2026-04-30.

The trigger for revisiting v7.3:

1. **v73-sigma1-hc** WR ≥ 50% on N ≥ 8 → keep. WR < 40% on N ≥ 8 → consider raising the floor back to Σ=2.
2. **v73-sigma2-hc** WR ≥ 60% on N ≥ 12 → keep. WR < 50% → consider reverting to v7.2 LEAN.
3. **v73-hc-rescue** WR ≥ 75% on N ≥ 10 → keep. WR < 60% → tighten HC override to HC_m ≥ +2.

Sample size reaches actionable density after ~3 weeks of NHL/MLB slates (~30 v7.3-stamped picks).

---

## §9. Pre-flight checklist (already passed)

- [x] `npm run build` succeeds (8.57s, no compile errors)
- [x] `ReadLints` returns no errors on `SharpFlow.jsx` and `dailyV6Report.js`
- [x] `WHITELIST_CONSENSUS_VERSION` bumped 8 → 9 so re-stamps fire on existing v7.2 docs
- [x] `PROMOTED_BY_FLOORS` set updated with three new v7.3 tags
- [x] `isPromotedBy()` is the single source of truth in all sync paths (no hardcoded `promotedBy === ...` checks remain)
- [x] `pickDate` threaded through all `computeWalletConsensus()` and `evaluatePickHealth()` call sites in `SharpFlow.jsx`
- [x] Daily report §11 ships with kill-switch UI for empty cohorts

---

## §10. References

- `WALLET_HC_MARGIN_ANALYSIS_FULL.md` — full-universe analysis (N=141) that drove v7.3
- `WALLET_HC_MARGIN_ANALYSIS.md` — v7.2 HC-margin analysis (N=88, shipped picks only)
- `SHARP_INTEL_V7_2_PLAYBOOK.md` — v7.2 reference (HC-margin tiered ladder)
- `SHARP_INTEL_V7_1_PLAYBOOK.md` — v7.1 reference (HC dominance)
- `WALLET_GATE_SCALE_TEST.md` — the original tier-purity test that found HC dominance
