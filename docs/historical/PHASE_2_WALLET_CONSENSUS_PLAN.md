# Phase 2 — Wallet-Consensus V8 Integration

**Status:** LIVE. v1 shipped (per-sport action gating). v4 shipped 2026-04-22 (universal + 0.50u STRONG_FOR + PROVEN CONSENSUS badge). **v5 shipped same day** — LEAN_FOR (Δ=+1) now promotion-eligible with `agW=0`, star gate lowered 1.5→1.0, new SHARP CONSENSUS UI badge. See §11 and §12 below for the consolidated deltas.

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

*Drafted: 2026-04-22 (ET). Revised: 2026-04-20 to extend from NBA-only to all sports and add wallet-consensus promotion path. Anchored in WALLET_WHITELIST_BACKTEST.md §B (LODO, leave-one-date-out).*

---

## 11. v4 amendment (2026-04-22) — universal, all-in on Δ ≥ +2

**Trigger:** `scripts/walletConsensusBacktest.js` re-ran on the full v8 ledger and reported:

| Δ bucket | N | WR% | Flat ROI | Verdict |
| --- | --- | --- | --- | --- |
| Δ ≥ +2 | 16 | **68.8%** | **+76.2%** | best bucket in the system |
| Δ = +1 | 10 | 70.0% | +31.0% | good but small sample |
| Δ = 0  | 19 | 21.0% | −61.0% | catastrophic |
| Δ = −1 | 7  | 28.6% | −54.0% | MUTE justified |
| Δ ≤ −2 | 1  | 0%    | −100%   | CANCEL justified |

`Δ ≥ +2` also rescued contribTier / star buckets that otherwise failed catastrophically when Δ ≤ 0. A MUTED pick with Δ=+3 (Trail Blazers ML) still won +2.38u — wallet consensus overrode the WPS-based mute correctly. Conclusion: this is the dominant signal in v8; other buckets should be considered in the context of Δ, not above it.

### Changes shipped (v3 → v4)

1. **Universal `WHITELIST_INTERVENTION`.** Every sport gets `{ bonus, mute, cancel, promote }` all `true`. Removed CBB/NFL "whitelist too thin" carve-outs. The whitelist is *already* per-sport (a wallet only becomes CONFIRMED/FLAT in sports it's been profitable in) — so there is no extra risk from enabling actions universally. If a sport has no whitelisted wallets, `forW + agW === 0` and verdict stays `NEUTRAL` automatically.

2. **STRONG_FOR bonus 0.25u → 0.50u.** Doubled to match the magnitude of the observed edge (+76% flat ROI, N=16). LEAN_FOR stays at +0.10u.

3. **Promotion star gate 2.0 → 1.5.** The SHADOW→LOCKED whitelist-promotion precondition now clears at `basePickStars >= 1.5` instead of `>= 2`. Rationale: the whitelist itself is the primary signal, not the star floor. We want to *find and promote* every clean Δ ≥ +2 play, not gate it behind an additional V8 merit bar. `agW === 0` purity guard preserved.

4. **PROVEN CONSENSUS UI badge.** New premium violet-gradient pill (`ShieldCheck` + `PROVEN CONSENSUS +Δ`) on every pick card where `v8_walletConsensusDelta >= 2`. Renders alongside (or instead of, visually) the gold TOP PICK ribbon. Tooltip shows `forW/agW`.

5. **Attribution version bump v3 → v4.** `WHITELIST_CONSENSUS_VERSION = 4` in both `src/pages/SharpFlow.jsx` and `scripts/backfillWalletConsensus.js`. `needsConsensusRestamp()` treats any `v < 4` stamp as stale, so live writes + the admin backfill both re-stamp old docs with the new 0.50u unit bonus.

### Operational effect

- Every STRONG_FOR pick is now **+0.50u** instead of +0.25u and wears the **PROVEN CONSENSUS** badge.
- Every FADE_WEAK pick in CBB/NFL now **MUTES** (was: inert).
- Every FADE_STRONG pick in MLB/NHL/CBB/NFL now **CANCELS** (was: MUTE only).
- SHADOW → LOCKED whitelist-promotion now fires for 1.5-star base picks that were previously blocked.

### Monitoring

Weekly watch items on the Δ ≥ +2 cohort from `WALLET_CONSENSUS_BACKTEST.md`:

- Rolling 4-week WR / flat ROI on `v8_walletConsensusVerdict == 'STRONG_FOR'` — expect ≥ 55% WR, ≥ +20% flat ROI. If it drops below V8 baseline, revisit the 0.50u bump.
- FADE_STRONG CANCEL firings outside NBA — first month is data-gathering; confirm no systematic false-cancels (pick won despite CANCEL) before permanence.
- Whitelist-promotion (`v8_walletConsensusPromotionTriggered == true`) pick WR — small sample, but expect net positive. If negative after N ≥ 15, re-raise star gate or add `baseStars + 0.5 * STRONG_FOR` total floor.

---

## 12. v5 amendment (2026-04-22) — hunt Δ ≥ +1 plays, kill the losers

**Trigger:** `scripts/predictorShootout.js` head-to-head comparison of the three live money predictors across every graded v8 pick (N=53, LOCKED + SHADOW):

| Predictor | Pos N / ROI | Neg N / ROI | **Spread** |
|---|---|---|---|
| **Δ ≥ +2 vs Δ ≤ 0** | 16 / +76.2% | 27 / −60.4% | **+136.6%** |
| **Δ ≥ +1 vs Δ ≤ 0** | 26 / +58.9% | 27 / −60.4% | **+119.3%** |
| fmean ≥ 55 vs < 50 | 23 / +6.7% | 17 / −5.3% | +12.0% |
| fROI ≥ 70 vs < 50 | 27 / −6.7% | 2 / +17.5% | −24.2% |

The Δ = +1 bucket alone: **10 picks, 70% WR, +31% flat ROI**. Near-identical WR to Δ ≥ +2 (69%), just with a tighter ROI per pick. Per-regime spread: Δ +127% (CLEAR_MOVE), Δ **+133.9%** (NEAR_START, N=33 — the biggest regime, where fmean has −2.9% spread). Δ is the dominant signal in every regime that has sample, including the fat NEAR_START middle where our other levers are weak.

### Changes shipped (v4 → v5)

1. **LEAN_FOR (Δ=+1) now promotion-eligible.** `computeWalletConsensus` sets `promotionEligible = true` for `LEAN_FOR` when `agW === 0` (same purity guard as STRONG_FOR). Unit bonus stays at **+0.10u** to reflect the narrower per-pick ROI edge, but these picks now actually LOCK and get played instead of sitting in SHADOW.

2. **Star gate 1.5 → 1.0.** `decideLockStage` whitelist-promotion path now clears at `basePickStars >= 1.0`. The whitelist IS the primary merit signal; we only keep a floor to filter truly-noise picks, not to double-gate the signal that's carrying the system.

3. **SHARP CONSENSUS UI badge.** New secondary violet-outlined badge (`ShieldCheck` + `SHARP CONSENSUS +1`) for picks with `walletConsensusDelta === 1 && walletConsensusAgW === 0`. Subordinate to the filled PROVEN CONSENSUS badge (Δ ≥ +2) in visual weight. Both tiers require zero profitable-wallet dissent — both are cards where the sharp whitelist unanimously agrees.

4. **MUTE / CANCEL losers — universal and confirmed.** No code change required (already shipped in v4), but explicitly reconfirmed as part of v5. The ladder now kills:
   - Δ = −1 → **MUTE** (7 historical picks, 29% WR, −54% ROI — correct call)
   - Δ ≤ −2 → **CANCEL** (1 historical pick, 0% WR, −100% ROI — correct call)
   Both fire stand-alone (before WPS checks) in `evaluatePickHealth`, time-gated at `timeToGame > 5`.

5. **Attribution version v4 → v5.** `WHITELIST_CONSENSUS_VERSION = 5` in both `src/pages/SharpFlow.jsx` and `scripts/backfillWalletConsensus.js`. Backfill re-ran across 2026-04-18 → 2026-04-22: 53 sides re-stamped.

### Operational effect

- Every Δ=+1 pick with `agW=0` now promotes from SHADOW to LOCKED (if not already locked by regime/contribution).
- Every Δ=+1 locked pick carries the new SHARP CONSENSUS badge.
- Pre-existing PROVEN CONSENSUS (Δ≥+2) + universal MUTE (Δ=−1) + CANCEL (Δ≤−2) behavior preserved.
- Any V8 pick with ≥ 1.0 base star AND a whitelisted sharp consensus is now tradeable.

### Monitoring (in addition to v4 watchlist)

- Rolling 4-week WR / flat ROI on `v8_walletConsensusVerdict == 'LEAN_FOR'` — expect ≥ 55% WR, ≥ +15% flat ROI. If LEAN_FOR drops below V8 baseline while STRONG_FOR stays elevated, tighten LEAN_FOR promotion to require `forW >= 2` (eliminates the `forW=1, agW=0` edge case).
- Volume of whitelist promotions per week — expect 3-8× increase over v4 (LEAN_FOR is more common than STRONG_FOR). If volume explodes > 15/week, raise the star gate back to 1.5.
- Δ = 0 bucket behavior — not actioned yet (treated as absence of signal). Open question: should Δ=0 with `forW+agW >= 2` (profitable-wallet split) also MUTE? Current backtest shows Δ=0 at 21% WR, −61% ROI but subset isn't broken out by split-vs-absent. Revisit with more data.
