# Phase 2 — Wallet-Consensus V8 Integration

**Status:** Planned (not yet implemented). Drafted after Phase 1 (sharpWalletProfiles) and Shadow Vault shipped.

**Thesis:** For each sport, a wallet's historical per-sport profitability ("whitelist tier" in `sharpWalletProfiles.bySport[sport].whitelistTier`) is a real, independent signal of pick quality. We integrate it into V8 as a **laddered bonus / penalty / promotion on Δ = forW − agW**, where `forW` / `agW` count whitelisted wallets on our side vs. the opposing side.

**Anchor evidence:** [WALLET_WHITELIST_BACKTEST.md](./WALLET_WHITELIST_BACKTEST.md) §B (LODO, honest, FLAT whitelist flavor, N=59):

| Δ bucket | N | WR% | Flat ROI | Action |
| --- | --- | --- | --- | --- |
| Δ ≥ +2 | 9  | 44.4% | +16.4% | big bonus + promotion eligible |
| Δ = +1 | 15 | 33.3% | −35.4% | small bonus |
| Δ = 0  | 27 | 59.3% | +24.0% | no action |
| Δ = −1 | 6  | 16.7% | −65.7% | MUTE |
| Δ ≤ −2 | 2  | 50.0% | −40.7% | CANCEL |

Baseline V8: 45.8% WR, −3.6% ROI.

Per-sport L3 re-side (FLAT, LODO): NBA +40.6% lift, NHL +16.3% lift, MLB ~0 lift (N=0 re-side picks in LODO — untestable, not falsified).

---

## 1. The Δ ladder (single source of truth)

Computed once per pick at lock time, stamped on the pick doc, re-evaluated live by `evaluatePickHealth`.

```
forW = count of wallets w in walletDetails where:
         w.side === pick.consensusSide  AND
         profiles[w.walletShort]?.bySport[pick.sport]?.whitelistTier ∈ {CONFIRMED, FLAT}

agW  = same, for opposing side

Δ    = forW − agW
```

Missing profile, `null` tier, or `WR50` tier → wallet does **not** count toward either total. (`WR50` is noise per LODO — kept in the ledger for research, never actioned.)

**Minimum floor:** if `forW + agW === 0`, verdict is `NEUTRAL` regardless. No wallets classified on either side → V8-alone gate.

### Ladder

| Δ | Verdict | Action |
| --- | --- | --- |
| Δ ≥ +2 | `STRONG_FOR`  | **+0.25 stars** and **PROMOTION eligible** (guardrails below) |
| Δ = +1 | `LEAN_FOR`    | **+0.10 stars** |
| Δ = 0  | `NEUTRAL`     | no action |
| Δ = −1 | `FADE_WEAK`   | **MUTE** |
| Δ ≤ −2 | `FADE_STRONG` | **CANCEL** (where enabled) or **MUTE** fallback |

Magnitudes are anchored to existing peers: `qualityBonus(meanBase_F)` is ±0.25 on a 70-point ROI spread; our STRONG_FOR is +0.25 on a 20-point LODO ROI spread — intentionally conservative relative to in-sample, conservative-generous relative to LODO. LEAN_FOR at +0.10 is ~2.5× smaller, preserving ladder hierarchy.

---

## 2. Policy rules

### 2a. Option A — Negative actions override positive

If Δ ≤ −1, any positive star bonus is **suppressed** and promotion is blocked. A muted pick cannot carry `+0.10` / `+0.25` or be newly promoted. Logic flow:

```
verdict = classifyDelta(forW, agW)

if verdict === 'FADE_WEAK' or 'FADE_STRONG':
    starBonus     = 0
    promote       = false
    lockAction    = (verdict === 'FADE_STRONG' && sportConfig.cancel) ? 'CANCEL' : 'MUTE'
else if verdict === 'STRONG_FOR':
    starBonus     = +0.25
    promote       = meetsPromotionGuardrails(pick) && sportConfig.promote
    lockAction    = null
else if verdict === 'LEAN_FOR':
    starBonus     = +0.10
    promote       = false
    lockAction    = null
else:
    starBonus     = 0
    promote       = false
    lockAction    = null
```

### 2b. Stand-alone trigger

MUTE / CANCEL / PROMOTE all fire **regardless of opposing WPS**. No stacking requirement. Rationale: if we trust the whitelist, we let it fire on its own evidence. Existing opposing-WPS triggers in `evaluatePickHealth` remain unchanged — they coexist as independent triggers.

### 2c. No CLEAR_MOVE / STRONG override

Unlike the earlier proposal, MUTE / CANCEL is **not** softened by `regime === 'CLEAR_MOVE'` or `contribTier === 'STRONG'`. The existing opposing-WPS MUTE / CANCEL system doesn't have such an override, and adding one here would make the whitelist mechanism strictly weaker than the signal it's meant to complement. If CLEAR_MOVE was right, the opposing wallet fade eventually clears and the mute auto-lifts.

### 2d. Recoverability

- **MUTED** picks auto-recover if Δ improves back to ≥ 0 before game time (mirrors existing mute behavior).
- **CANCELLED** picks are final.
- **PROMOTED** picks remain LOCKED; if Δ subsequently drops to MUTE/CANCEL territory, the standard health-evaluation path handles it (MUTE first, CANCEL if worse).

---

## 3. Promotion path (new in this revision)

### 3a. Trigger

A pick is promoted to `LOCKED` by wallet consensus if **all** of the following hold:

1. `verdict === 'STRONG_FOR'` (Δ ≥ +2)
2. **`agW === 0`** — no profitable-wallet dissent (pure positive consensus)
3. **`basePickStars >= 2`** — V8 stars before any consensus bonus must already clear 2 stars
4. **`qualificationTier === 'VAULT'`** — SHADOW positions are never promoted; the 0.75× avg-bet Vault floor still governs what can be surfaced
5. The pick would not otherwise lock this cycle (`lockStage !== 'LOCKED'` pre-consensus check) — avoids double-attribution
6. Per-sport config `WHITELIST_INTERVENTION[sport].promote === true`
7. No MUTE / CANCEL condition present (subsumed by Option A above, but enforced explicitly)

### 3b. Attribution when promotion fires

- `lockStage = 'LOCKED'`
- `lockReason = 'WHITELIST_PROMOTION'` (new lockReason value)
- Star bonus `+0.25` applied on top of base stars
- All v8_walletConsensus* attribution fields stamped
- `v8_walletConsensusPromotionTriggered = true`

### 3c. Why `agW === 0` instead of just Δ≥+2

Δ=+2 can arise from `(forW=2, agW=0)` (clean) or `(forW=3, agW=1)` (mixed). The mixed case has documented dissent from a profitable wallet — weaker promotion case. We keep both in the STRONG_FOR bonus bucket (the LODO data doesn't split them), but gate promotion on the clean case only. Mixed-consensus STRONG_FOR picks still get the +0.25 bonus; they just don't jump lock status.

### 3d. Promotion is rare by design

Guardrail #5 (pick wouldn't otherwise lock) means promotion only fires on the margin — picks that V8 already liked enough to Vault-qualify but didn't clear the regime / WPS lock bar. Expected volume: a handful per week, not per day.

---

## 4. Sport gating — all-sports v1

Per-sport config in `scripts/writeSharpActions.js`:

```js
const WHITELIST_INTERVENTION = {
  NBA: { bonus: true, mute: true, cancel: true,  promote: true },
  MLB: { bonus: true, mute: true, cancel: false, promote: true },
  NHL: { bonus: true, mute: true, cancel: false, promote: true },
  CBB: { bonus: true, mute: true, cancel: false, promote: false },  // no whitelist sample yet
};
```

### Why all sports

The Δ mechanism is sport-agnostic: a profitable-in-sport wallet opposing our pick is evidence regardless of sport. Per-sport LODO:

- **NBA** — biggest whitelist (13 FLAT), biggest documented lift, full ladder justified.
- **NHL** — positive lift in LODO (+16pp), smaller whitelist (6 FLAT). Full ladder minus CANCEL.
- **MLB** — LODO lift near zero but because there were ~no re-side picks in the window, not because re-sides failed. Mechanism has no sport-specific reason to fail. Full ladder minus CANCEL.
- **CBB** — whitelist will populate as Shadow Vault accumulates data. Inert today; config flips `promote: true` once ≥ 5 FLAT wallets classified.

### Why CANCEL is NBA-only

CANCEL is permanent. It requires `Δ ≤ −2` → `agW ≥ 2`. For MLB/NHL with 6-wallet FLAT whitelists, that means 33% of the sport's profitable wallets actively opposing — a strong signal in relative terms but built on a 6-wallet base. The whitelist classification is less stable at that sample size (a single W/L flips a wallet's tier). MUTE is reversible if classification shifts on the next `exportWalletProfiles` rebuild; CANCEL is not. Hold CANCEL until 4-week live data confirms the trigger for MLB/NHL.

Kill switch: flip any tier to `false`, redeploy. No schema changes.

---

## 5. Attribution fields

Stamped on every pick at lock time, on every sport, regardless of whether an action fired. Enables `V8_DAILY_PNL.md` to grow a new slice with zero report-infra changes.

```js
v8_walletConsensusVersion:           2,   // bumped for all-sports + promotion
v8_walletConsensusSport:             'NBA',
v8_walletConsensusEnabled:           true,           // sport-config state at lock time

v8_walletConsensusForW:              2,
v8_walletConsensusAgW:               0,
v8_walletConsensusDelta:             2,
v8_walletConsensusVerdict:           'STRONG_FOR',   // STRONG_FOR | LEAN_FOR | NEUTRAL | FADE_WEAK | FADE_STRONG

v8_walletConsensusStarBonus:         0.25,           // 0 if verdict suppressed by Option A
v8_walletConsensusMuteTriggered:     false,
v8_walletConsensusCancelTriggered:   false,
v8_walletConsensusPromotionTriggered:false,

v8_walletConsensusBaseStars:         2.5,            // pre-bonus stars — enables promotion guardrail audit
v8_walletConsensusQualificationTier: 'VAULT',        // echo of pick's own tier for slice filtering
```

Bump `v8_walletConsensusVersion` whenever the ladder, guardrails, or thresholds change so reports can split by version.

---

## 6. Integration points

### 6a. Backend — `scripts/writeSharpActions.js`

- Load `sharpWalletProfiles` once at the start of each run; build a `Map<walletShort, profile>`.
- Add `computeWalletConsensus(walletDetails, sport, profilesMap)` helper → returns `{ forW, agW, delta, verdict, starBonus, lockAction, promotionEligible }`.
- **Pipeline order matters:**
  1. Compute base V8 stars and regime decisions.
  2. Compute wallet consensus verdict.
  3. Apply Option A: if FADE_* → zero bonus, set lockAction.
  4. Apply star bonus to final stars.
  5. Evaluate promotion guardrails (§3a). Note: `basePickStars` is from step 1, not step 4.
  6. If promotion fires, override lockStage → LOCKED with `lockReason = 'WHITELIST_PROMOTION'`.
  7. Stamp all attribution fields.
- Wire `lockAction === 'MUTE'` / `'CANCEL'` into the existing health path mirroring opposing-WPS semantics.

### 6b. Live health — `src/pages/SharpFlow.jsx` `evaluatePickHealth`

- Load `sharpWalletProfiles` on mount; cache; key by `walletShort`.
- In `evaluatePickHealth`, add a new trigger that runs **after** the existing opposing-WPS logic:
  ```js
  const { delta, verdict } = computeWalletConsensus(peak.v8Scoring?.walletDetails, sport, profilesMap);
  const sportConfig = WHITELIST_INTERVENTION[sport] ?? { mute: false, cancel: false };
  if (sportConfig.cancel && delta <= -2)  return { health: 'CANCELLED', reason: 'whitelist_fade_strong' };
  if (sportConfig.mute   && delta <= -1)  return { health: 'MUTED',     reason: 'whitelist_fade_weak'   };
  ```
- Note: live-side does not re-evaluate promotion — promotion is a lock-time decision only. Once promoted, the pick participates in the normal health lifecycle.

### 6c. UI surfaces (no new components)

1. **`{SPORT} WINNER` chip** in the Sharp Intel wallet row, next to the existing `ELITE` / `SHARP` tier chip. Rendered via the existing `Badge` component in gold. Label is sport-parameterized: `NBA WINNER` / `MLB WINNER` / `NHL WINNER`. Shows when `profile.bySport[currentGameSport].whitelistTier ∈ {CONFIRMED, FLAT}`. WR50 / null → no chip.
2. **Sharp Intel header count** extended: existing `N sharps backing home` becomes `N sharps backing home · M {SPORT} WINNERS` when winners > 0, and `· M {SPORT} WINNER fading` when opposing-side winners exist.
3. **MUTED / CANCELLED tooltip** extended: if `health.reason === 'whitelist_fade_weak'` / `'whitelist_fade_strong'`, tooltip reads e.g. `"Muted — profitable MLB wallets are fading this pick (Δ = −1)"`.
4. **PROMOTED pick lockReason** — any UI surface that renders `lockReason` (e.g., debug tooltips, ops reports) shows `"Whitelist promotion"` for `WHITELIST_PROMOTION` picks.

No new ribbons, no new TOP PICK tier, no Δ strip. No user-facing promotion badge in v1 — the promoted pick just appears in the LOCKED list like any other locked pick.

---

## 7. Measurement

Once shipped, `V8_DAILY_PNL.md` gains a slice grouped by `v8_walletConsensusVerdict` and a separate slice for `lockReason === 'WHITELIST_PROMOTION'`:

```
| Verdict       | Sport | N  | WR%  | Flat PnL | Flat ROI | vs. Baseline |
|---------------|-------|----|------|----------|----------|--------------|
| STRONG_FOR    | NBA   | …  | …    | …        | …        | …            |
| STRONG_FOR    | MLB   | …  | …    | …        | …        | …            |
| STRONG_FOR    | NHL   | …  | …    | …        | …        | …            |
| LEAN_FOR      | NBA   | …  | …    | …        | …        | …            |
| ...
| FADE_WEAK     | NBA   | …  | …    | (suppressed) | …    | (reference)  |
| FADE_STRONG   | NBA   | …  | …    | (suppressed) | …    | (reference)  |
```

Plus a promotion-only table tracking how promoted picks performed vs. the rest of the LOCKED universe.

After 4 weeks of live data, re-run `walletWhitelistBacktest.js` against live attribution to validate / adjust magnitudes per sport.

---

## 8. Rollout sequence

| Week | Milestone |
| --- | --- |
| 0 | Ship spec as described: all 3 sports with bonus + MUTE + promotion; NBA adds CANCEL; UI chip + header count + V8_DAILY_PNL slice. |
| 1–2 | Monitor per-sport: STRONG_FOR bonus bucket, promotion bucket, FADE_WEAK MUTE firing rate. |
| 3 | Decision gate 1: if MLB / NHL MUTE is firing cleanly (no obviously bad cancellations-that-weren't), consider enabling CANCEL tier for MLB and/or NHL. |
| 4 | Decision gate 2: is promotion bucket outperforming unpromoted LOCKED picks? If yes, hold magnitudes. If no, raise guardrail (e.g., basePickStars ≥ 2.5). |
| 6–8 | Full re-backtest against live data; recalibrate magnitudes (+0.10, +0.25, MUTE trigger, promotion guardrails) per sport if warranted. |

---

## 9. Explicit non-goals for v1

- **Active re-siding (L3 flip to opposing side).** High ROI in LODO but publishing the opposite side of our own engine is a user-trust bomb. MUTE / CANCEL captures ~80% of the benefit without flipping.
- **L4 whitelist-only picks (ignore V8 entirely).** Sample too thin; promotion with guardrails captures the marginal-picks case without going full L4.
- **Per-market whitelists (ML vs SPREAD vs TOTAL).** Would 3× sparsity.
- **Weighted Δ** (CONFIRMED=1.0, FLAT=0.6). Untested; binary counts match the backtest exactly.
- **Auto-recalibration of thresholds.** Thresholds are static v1; revisit manually with data.
- **Dynamic kill-switch.** Manual config-redeploy only.
- **Promotion from SHADOW.** Vault floor still governs surfacing.

---

## 10. Open questions deferred to post-v1

1. Does `LEAN_FOR` (+0.10) actually earn its keep, or does LODO's −35% ROI in that bucket reassert itself in live data? If bucket underperforms, drop to +0 (bonus removed).
2. Is the MUTE trigger at Δ=−1 correct cross-sport, or does thin LODO N=6 mislead us? If MLB/NHL live data shows ambiguity, tighten to Δ≤−2 only per sport.
3. Does the `agW === 0` purity guard on promotion matter, or does the mixed-STRONG_FOR case (forW=3, agW=1) also promote well? Test with live attribution; relax if supported.
4. Should `shadowSignal` (SHADOW-only wallet bets, from Shadow Vault) feed into a future tier classifier? Currently tracked but not used for whitelist decisions.
5. When does CBB get enabled? Define the threshold — suggest `≥ 5 FLAT wallets AND ≥ 100 graded CBB bets` in `sharpWalletProfiles`.

---

*Drafted: 2026-04-22 (ET). Revised: 2026-04-20 to extend from NBA-only to all sports and add wallet-consensus promotion path. Anchored in WALLET_WHITELIST_BACKTEST.md §B (LODO, leave-one-date-out). All magnitudes are placeholders subject to 4-week live re-validation.*
