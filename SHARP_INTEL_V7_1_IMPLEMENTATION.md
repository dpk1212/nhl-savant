# SHARP INTEL v7.1 — IMPLEMENTATION WORK ORDER

_Last updated: 2026-04-30 · Status: **ready to ship** · Companion to `SHARP_INTEL_V7_1_PLAYBOOK.md`_

This is the executable plan. The playbook explains the *why*; this doc is the *what, where, and how*. Every change has a file path, a line-number anchor, and an exact code block. Follow steps in order. Anything labelled **CUTOVER-CRITICAL** must be in place before the user wipes today's Firestore docs and we go live.

---

## §0. The cutover contract — what changes, what doesn't

**HARD GUARANTEE: historic picks are not touched.** v7.1 is a forward-only upgrade. We protect this with three layers:

1. **`status='COMPLETED'` short-circuit** — already in every sync path (SharpFlow.jsx:1612, 1616, 1879, 1883, 2013, 2017). Any graded pick is read-only from now on.
2. **`V7_1_CUTOVER_DATE` constant** — every code path that produces v7.1 behavior checks `pickDoc.date >= V7_1_CUTOVER_DATE` first. Picks created before the cutover keep v7.0 ladder, v7.0 lock floor, v7.0 badges, even if they're un-graded stragglers that get touched by a late sync.
3. **`v8_systemVersion` stamp** — every NEW sync writes `v8_systemVersion='7.1'`. Existing docs lacking this field are treated as v7.0. This belt-and-suspenders the date gate against any clock drift or data-correction edits that backdate a doc.

**The cutover sequence on go-live day (today):**

```
T-30 min   Push v7.1 code with V7_1_CUTOVER_DATE = today (ET).
T-15 min   User deletes today's docs in sharpFlowPicks/Spreads/Totals
           (filter by date == today).
T-0        First post-deploy sync writes today's first lock under v7.1.
T+0..T+24h Watch the daily V6 report for §7c HC cohort table; spot-check
           5 picks per sport.
```

There is no backfill on graded picks. There is no data migration. Historic Firestore documents are immutable from v7.1's perspective.

---

## §1. Constants and config

### §1.1 Add to `nhl-savant/src/pages/SharpFlow.jsx` near the top of the consensus block (~line 985)

```js
// ─── v7.1 HC Dominance constants ─────────────────────────────────────
// Source: WALLET_GATE_SCALE_TEST.md — only gate that produced positive
// WR lift in 5/5 Σ buckets (avg +34.7pp WR / +60.9pp flat ROI).
const HC_RATIO = 1.5;                 // CONFIRMED ∧ sizeRatio ≥ HC_RATIO = "high conviction"
const V7_1_CUTOVER_DATE = '2026-04-30';   // YYYY-MM-DD — picks dated < this stay on v7.0 logic
const V7_1_HC_DOMINANCE_ENABLED = true;   // master kill-switch (revert without redeploy)

// Bump from 6 → 7. Every active doc will re-stamp on next sync via
// needsConsensusRestamp().
const WHITELIST_CONSENSUS_VERSION = 7;
const QUALITY_CONTRIB_CUT = 30;       // unchanged

// HC unit multiplier and per-tier caps (post-clamp).
const V7_1_HC_MULT = 1.5;
const V7_1_HC_CAP_ML_ELITE = 4.5;     // never exceed 4.5u even with HC bump
const V7_1_HC_CAP_ML_NON   = 3.0;
const V7_1_HC_CAP_ST_ELITE = 3.0;     // spreads/totals
const V7_1_HC_CAP_ST_NON   = 1.75;
```

### §1.2 Add a single source-of-truth helper (~line 990)

```js
// True if this pick should run v7.1 logic. Both the date gate AND the
// kill-switch must be true. Used by every v7.1-aware function.
function isV71Eligible(pickDate) {
  if (!V7_1_HC_DOMINANCE_ENABLED) return false;
  if (typeof pickDate !== 'string') return false;
  return pickDate >= V7_1_CUTOVER_DATE;
}
```

The `pickDate` argument is the `date` field on every Firestore doc (`YYYY-MM-DD` string in ET). Lex sort is correct for this format. Every caller below threads it.

---

## §2. Wallet consensus — emit HC counts (CUTOVER-CRITICAL)

### §2.1 Patch `computeWalletConsensus` (SharpFlow.jsx:1027–1117)

Add three result fields and one loop branch.

```js
function computeWalletConsensus(walletDetails, sport, sideKey) {
  const result = {
    forW: 0, agW: 0, delta: 0, verdict: 'NEUTRAL',
    qualityForT30: 0, qualityAgT30: 0, qualityMargin: 0,
    // v7.1 — HC dominance fields
    hcConfFor: 0, hcConfAg: 0, hcDominant: false,
    unitBonus: 0, lockAction: null, promotionEligible: false,
    sportConfig: WHITELIST_INTERVENTION[sport] || { bonus: false, mute: false, cancel: false, promote: false },
    enabled: !!WHITELIST_INTERVENTION[sport],
    sport: sport || null,
  };
  if (!Array.isArray(walletDetails) || !sport || !sideKey) return result;

  // ── Quality margin (unchanged) ──────────────────────────────────────
  let qFor = 0, qAg = 0;
  for (const d of walletDetails) {
    if ((d?.contribution ?? 0) < QUALITY_CONTRIB_CUT) continue;
    if (d.side === sideKey) qFor++;
    else if (d.side) qAg++;
  }
  result.qualityForT30 = qFor;
  result.qualityAgT30  = qAg;
  result.qualityMargin = qFor - qAg;

  if (!WALLET_PROFILES_CACHE) return result;

  // ── Winner margin + HC dominance (single pass) ──────────────────────
  let forW = 0, agW = 0, hcF = 0, hcA = 0;
  for (const d of walletDetails) {
    if (!d?.wallet) continue;
    if (!isWhitelistedForSport(d.wallet, sport)) continue;
    const isFor = d.side === sideKey;
    if (isFor) forW++; else if (d.side) agW++;

    // v7.1 — HC dominance: CONFIRMED tier + sizeRatio ≥ HC_RATIO.
    // We look up tier from the profile cache directly so FLAT wallets
    // (also returned by isWhitelistedForSport) don't slip in.
    const profile = getWalletProfile(d.wallet);
    const tier = profile?.tiers?.[sport] ?? profile?.whitelistTier ?? null;
    if (tier === 'CONFIRMED' && (d.sizeRatio ?? 0) >= HC_RATIO) {
      if (isFor) hcF++; else if (d.side) hcA++;
    }
  }
  const { delta, verdict } = classifyDelta(forW, agW);
  result.forW = forW; result.agW = agW; result.delta = delta; result.verdict = verdict;
  result.hcConfFor = hcF; result.hcConfAg = hcA;
  result.hcDominant = hcF >= 1 && hcA === 0;

  const cfg = result.sportConfig;

  // ── existing mute/cancel/promote ladder (unchanged) ────────────────
  const dw = delta;
  const dq = result.qualityMargin;
  if (dw <= -2) {
    if (cfg.cancel) result.lockAction = 'CANCEL';
    else if (cfg.mute) result.lockAction = 'MUTE';
    return result;
  }
  if (dw <= 0) { if (cfg.mute) result.lockAction = 'MUTE'; return result; }
  if (dq <= 0) { if (cfg.mute) result.lockAction = 'MUTE'; return result; }
  if (dw + dq < 3) { if (cfg.mute) result.lockAction = 'MUTE'; return result; }

  if (dw >= 1 && dq >= 1 && (dw + dq) >= 3 && cfg.promote) {
    result.promotionEligible = true;
  }
  result.unitBonus = 0;
  return result;
}
```

**What's identical to v7.0:** every existing field, the mute/cancel ladder, the promotion-eligible rule. v7.1 adds three fields and one loop branch — nothing else changes here.

**What you may need to verify before shipping:** that `getWalletProfile(walletShort)` exposes per-sport tiers. If profiles only carry a single `whitelistTier` (current shape), the lookup falls through to that — but make sure FLAT wallets are then rejected. The `tier === 'CONFIRMED'` guard handles this regardless.

### §2.2 If profiles only have a flat `whitelistTier` (no per-sport map)

If `getWalletProfile(...).whitelistTier` is the only thing available, we need to confirm CONFIRMED-in-this-sport. Easiest: rely on `isWhitelistedForSport` to confirm the wallet is sport-eligible (CONFIRMED *or* FLAT), then check `profile.whitelistTier === 'CONFIRMED'` to filter out FLAT. The block above already does this correctly.

---

## §3. Lock-tier classifier — accept HC dominance

### §3.1 Replace `lockTierFromDeltas` (SharpFlow.jsx:612)

```js
// v7.1 lock-tier classifier. Signature changes from (dw, dq) to
// (dw, dq, hcDominant, opts). Backwards-compatible: callers that
// don't pass hcDominant get the v7.0 ladder for that pick.
//
//   ELITE  : Δw ≥ +1 ∧ Δq ≥ +1 ∧ Σ ≥ +7
//   LOCKED : Σ ≥ +5  OR  (Σ ∈ {3,4} ∧ hcDominant)
//   LEAN   : Σ ∈ {3,4} ∧ ¬hcDominant
//   MUTED  : everything else
//
// `opts.pickDate` gates the HC-promotion branch by V7_1_CUTOVER_DATE.
// Picks dated before cutover never see the LEAN→LOCKED promotion even
// if they happen to have HC dominance — they ride the v7.0 ladder.
function lockTierFromDeltas(dw, dq, hcDominant = false, opts = {}) {
  if (!Number.isFinite(dw) || !Number.isFinite(dq)) return 'MUTED';
  if (dw < 1 || dq < 1) return 'MUTED';
  const sum = dw + dq;
  if (sum >= 7) return 'ELITE';
  if (sum >= 5) return 'LOCKED';
  if (sum >= 3) {
    const v71 = isV71Eligible(opts.pickDate);
    return (v71 && hcDominant) ? 'LOCKED' : 'LEAN';
  }
  return 'MUTED';
}
```

Every existing call site stays valid because `hcDominant` defaults to `false`. The HC-promotion is only reachable when callers explicitly thread the new args. This means we can update call sites incrementally without breaking anything that hasn't been updated yet.

### §3.2 Star ladder (`vaultStarFromDeltas`) — UNCHANGED

`vaultStarFromDeltas` keeps its current logic. Stars track Δw/Δq through the existing rungs (Σ=3 → 3.5★, Σ=4 → 4.0★, Σ=5 → 4.5★, Σ=6 → 5.0★). HC dominance does NOT promote stars — that's a units-side modifier only. Rationale in playbook §9.2.

---

## §4. Unit ladders — apply HC multiplier (CUTOVER-CRITICAL)

### §4.1 Patch `calculateUnits` (SharpFlow.jsx:331)

```js
// v7.1 — adds (hcDominant, opts) at the end of the signature. Default-false
// preserves v7.0 callers. The HC bump runs AFTER the odds clamp so heavy
// favorites still respect their cap, just at the upper bound.
function calculateUnits(stars, consensusPenalty = 0, odds = null, regimeBonus = 0,
                       lockTier = null, hcDominant = false, opts = {}) {
  if (lockTier === 'LEAN') return 0;
  let units;
  if (lockTier === 'ELITE') units = 4.00;
  else if (stars >= 5.0)   units = 3.00;
  else if (stars >= 4.5)   units = 2.00;
  else if (stars >= 4.0)   units = 1.25;
  else if (stars >= 3.5)   units = 0.75;
  else units = 0;
  if (units === 0) return 0;

  if (odds != null && odds >= 200) units = Math.min(units, lockTier === 'ELITE' ? 1.0 : 0.5);
  else if (odds != null && odds >= 151) units = Math.min(units, lockTier === 'ELITE' ? 2.0 : 1.0);
  else if (odds != null && odds >= 100) units = Math.min(units, lockTier === 'ELITE' ? 3.0 : 2.0);

  // v7.1 HC multiplier — gated by cutover date + kill-switch + HC dominance.
  if (hcDominant && isV71Eligible(opts.pickDate)) {
    const cap = lockTier === 'ELITE' ? V7_1_HC_CAP_ML_ELITE : V7_1_HC_CAP_ML_NON;
    units = Math.min(units * V7_1_HC_MULT, cap);
  }
  return Math.round(units * 100) / 100;
}
```

### §4.2 Patch `calculateSpreadTotalUnits` (SharpFlow.jsx:1227)

```js
function calculateSpreadTotalUnits(stars, consensusPenalty = 0, odds = null, regimeBonus = 0,
                                   lockTier = null, hcDominant = false, opts = {}) {
  if (lockTier === 'LEAN') return 0;
  let units;
  if (lockTier === 'ELITE') units = 2.50;
  else if (stars >= 5.0)   units = 2.00;
  else if (stars >= 4.5)   units = 1.50;
  else if (stars >= 4.0)   units = 0.75;
  else if (stars >= 3.5)   units = 0.50;
  else units = 0;
  if (units === 0) return 0;

  if (odds != null && odds >= 200) units = Math.min(units, lockTier === 'ELITE' ? 0.75 : 0.5);
  else if (odds != null && odds >= 151) units = Math.min(units, lockTier === 'ELITE' ? 1.25 : 0.75);
  else if (odds != null && odds >= 100) units = Math.min(units, lockTier === 'ELITE' ? 1.75 : 1.0);

  if (hcDominant && isV71Eligible(opts.pickDate)) {
    const cap = lockTier === 'ELITE' ? V7_1_HC_CAP_ST_ELITE : V7_1_HC_CAP_ST_NON;
    units = Math.min(units * V7_1_HC_MULT, cap);
  }
  return Math.round(units * 100) / 100;
}
```

---

## §5. Live sizing helper — thread HC dominance

### §5.1 Patch `computeLiveSizing` (SharpFlow.jsx:1253)

```js
function computeLiveSizing({ peakStars, peakUnits, marketType, oddsForLadder,
                              liveDw, liveDq, liveHcDominant = false, pickDate = null }) {
  if (liveDw == null || liveDq == null || peakStars == null) {
    return { liveStars: peakStars, liveUnits: peakUnits || 0, isDownsized: false, liveTier: null };
  }
  const liveStars = vaultStarFromDeltas(liveDw, liveDq);
  const liveTier  = lockTierFromDeltas(liveDw, liveDq, liveHcDominant, { pickDate });
  const ladder = (marketType === 'spread' || marketType === 'total')
    ? calculateSpreadTotalUnits
    : calculateUnits;
  const liveUnitsRaw = ladder(liveStars, 0, oddsForLadder, 0, liveTier, liveHcDominant, { pickDate });
  const liveUnits = Math.round(liveUnitsRaw * 100) / 100;
  return {
    liveStars,
    liveUnits,
    liveTier,
    isDownsized: liveStars < peakStars || liveUnits < (peakUnits || 0),
  };
}
```

### §5.2 Update every call site of `computeLiveSizing`

Search for `computeLiveSizing(` in SharpFlow.jsx. Each call site has access to `walletConsensus` (or can recompute it). Add:

```js
const liveWc = computeWalletConsensus(side?.peak?.v8Scoring?.walletDetails, sport, sideKey);
const live = computeLiveSizing({
  peakStars: side.peak?.stars,
  peakUnits: side.peak?.units,
  marketType,                                      // already in scope
  oddsForLadder: side.peak?.peakOdds ?? side.lock?.lockOdds,
  liveDw: liveWc.delta,
  liveDq: liveWc.qualityMargin,
  liveHcDominant: liveWc.hcDominant,
  pickDate: doc.date,                              // top-level Firestore field
});
```

If a call site doesn't have `doc.date` in scope, walk it up — the parent component has it. The doc.date threading is the only mechanical refactor in this work order.

---

## §6. Lock-stage decision — pass HC dominance

### §6.1 Patch `decideLockStage` (SharpFlow.jsx:1323)

```js
function decideLockStage(regime, v8Scoring, sideKey, sport = null, baseStars = 0, pickDate = null) {
  const contribTier = classifyContributionTier(v8Scoring, sideKey);
  if (!sport) {
    return { stage: 'SHADOW', contribTier, promotedBy: null, dw: 0, dq: 0,
             lockTier: 'MUTED', hcDominant: false };
  }
  const wc = computeWalletConsensus(v8Scoring?.walletDetails, sport, sideKey);
  const dw = wc.delta || 0;
  const dq = wc.qualityMargin || 0;
  const hcDominant = !!wc.hcDominant;
  const lockTier = lockTierFromDeltas(dw, dq, hcDominant, { pickDate });

  // v7.1 — HC dominance can promote a Σ ∈ {3,4} pick out of LEAN.
  // promotionEligible covers Σ ≥ +3 already; we promote when EITHER the
  // legacy Σ ≥ +5 path OR the new HC path has cleared.
  if (wc.promotionEligible && (lockTier === 'LOCKED' || lockTier === 'ELITE')) {
    const promotedBy = (lockTier === 'LOCKED' && (dw + dq) <= 4)
      ? 'hc-dominance'
      : 'two-factor-floor';
    return { stage: 'LOCKED', contribTier, promotedBy, dw, dq, lockTier, hcDominant };
  }
  return { stage: 'SHADOW', contribTier, promotedBy: null, dw, dq, lockTier, hcDominant };
}
```

The `promotedBy` field gets a new value `'hc-dominance'` for v7.1 promotions, distinguishing them from `'two-factor-floor'` for analytics. This lets the daily report partition the cohort cleanly (§10).

---

## §7. Stamping — persist HC fields and version (CUTOVER-CRITICAL)

### §7.1 Patch `stampWalletConsensus` (SharpFlow.jsx:1459)

```js
function stampWalletConsensus(target, v8Scoring, sideKey, sport, baseStars, promotedBy, pickDate = null) {
  if (!WALLET_PROFILES_CACHE) return;
  const wc = computeWalletConsensus(v8Scoring?.walletDetails, sport, sideKey);

  target.v8_walletConsensusVersion = WHITELIST_CONSENSUS_VERSION;
  target.v8_walletConsensusSport = sport || null;
  target.v8_walletConsensusEnabled = !!WHITELIST_INTERVENTION[sport];
  target.v8_walletConsensusForW = wc.forW;
  target.v8_walletConsensusAgW = wc.agW;
  target.v8_walletConsensusDelta = wc.delta;
  target.v8_walletConsensusVerdict = wc.verdict;
  target.v8_walletConsensusStarBonus = wc.unitBonus;
  target.v8_walletConsensusMuteTriggered = wc.lockAction === 'MUTE';
  target.v8_walletConsensusCancelTriggered = wc.lockAction === 'CANCEL';
  target.v8_walletConsensusPromotionTriggered =
    promotedBy === 'two-factor-floor' || promotedBy === 'whitelist' || promotedBy === 'hc-dominance';
  target.v8_walletConsensusBaseStars = baseStars || 0;
  target.v8_walletConsensusQualityForT30 = wc.qualityForT30;
  target.v8_walletConsensusQualityAgT30  = wc.qualityAgT30;
  target.v8_walletConsensusQualityMargin = wc.qualityMargin;

  // v7.1 — HC dominance + cohort labels + system version stamp.
  target.v8_hcConfFor    = wc.hcConfFor;
  target.v8_hcConfAg     = wc.hcConfAg;
  target.v8_hcDominant   = wc.hcDominant;
  target.v8_systemVersion = isV71Eligible(pickDate) ? '7.1' : '7.0';

  const liveTier = lockTierFromDeltas(wc.delta, wc.qualityMargin, wc.hcDominant, { pickDate });
  target.v8_lockTier = liveTier;

  target.v8_vaultStar = (wc.forW || wc.agW || wc.qualityMargin !== 0)
    ? vaultStarFromDeltas(wc.delta, wc.qualityMargin)
    : null;

  // Badges — derived strictly from the lock decision + HC dominance.
  // No independent Δw threshold (replaces the old evaluateTopPickTier path).
  const isShipped = liveTier === 'LOCKED' || liveTier === 'ELITE';
  target.v8_topPick      = isShipped && (wc.delta + wc.qualityMargin) >= 5;
  target.v8_superTopPick = isShipped && wc.hcDominant && isV71Eligible(pickDate);
}
```

### §7.2 Update every call site of `stampWalletConsensus` to pass `pickDate`

Every call site already has the parent `data.date` in scope. Pass it through. There are ~7 call sites in SharpFlow.jsx (search `stampWalletConsensus(`).

Example (SharpFlow.jsx:1651):

```js
// before
stampWalletConsensus(mergeData.sides[side], v8Scoring, side, sport, stars || 0, decision.promotedBy);

// after
stampWalletConsensus(mergeData.sides[side], v8Scoring, side, sport, stars || 0, decision.promotedBy, data.date);
```

For the new-doc branch where `data.date` is the local `date` argument:

```js
stampWalletConsensus(base, v8Scoring, side, sport, stars || 0, promotedBy, date);
```

For `restampDriftedSides`, thread `data.date` from the existing doc.

### §7.3 Bump `WHITELIST_CONSENSUS_VERSION` 6 → 7

Already done in §1.1. Confirms `needsConsensusRestamp` returns true on next sync for any active doc, so today's first sync re-stamps every active pick with the new HC fields.

---

## §8. Sync layer — LEAN sizing fix + HC-aware peak gating (CUTOVER-CRITICAL)

The single most production-critical bug in v7.0 lives here: `Math.max(units, 0.5)` clamps every locked side to ≥0.5u, defeating LEAN's 0u rule. Three sync functions need the same fix.

### §8.1 `syncPickToFirebase` (ML) — SharpFlow.jsx:1629

```js
// before (line 1629)
const bumpedUnits = Math.min(Math.max(units, 0.5), 3);
if (isReflip || bumpedUnits > currentPeak || stars > currentPeakStars) { ... }

// after
const decision = decideLockStage(regime, v8Scoring, side, sport, stars || 0, data.date);
const liveTier = decision.lockTier;
const isLean = liveTier === 'LEAN';

// LEAN never carries units; ELITE/LOCKED clamp to ladder.
const bumpedUnits = isLean ? 0 : Math.min(Math.max(units, 0.5), 3);

// Allow peak to DECREASE when transitioning into LEAN (otherwise the
// monotonic max-rule would freeze peak.units at the previous non-LEAN value).
const peakShouldWrite =
  isReflip
  || isLean                                       // collapse to 0u and rewrite peak
  || bumpedUnits > currentPeak
  || stars > currentPeakStars;

if (peakShouldWrite) { /* …existing peak write block, unchanged… */ }
```

Note: `decision` is computed once and reused for both the gating logic and the existing `mergeData.sides[side].contribTier = decision.contribTier` line.

### §8.2 `syncSpreadPickToFirebase` — SharpFlow.jsx:1888

Identical change with the spread/total clamp `Math.min(..., 2)`:

```js
const decision = decideLockStage(regime, v8Scoring, side, sport, stars || 0, data.date);
const isLean = decision.lockTier === 'LEAN';
const bumpedUnits = isLean ? 0 : Math.min(Math.max(units, 0.5), 2);
const peakShouldWrite = isLean || bumpedUnits > currentPeak || stars > currentPeakStars;
if (peakShouldWrite) { /* …existing block… */ }
```

### §8.3 `syncTotalPickToFirebase` — SharpFlow.jsx:2022

Identical to §8.2.

### §8.4 What this means for the unit value persisted to Firestore

After this fix, when the UI passes in a `units` argument that already comes from `calculateUnits(stars, ..., lockTier, hcDominant, { pickDate })`, the HC ×1.5 multiplier is *already applied at the UI layer*. The sync layer just clamps to `[0.5, 3]` (or `[0.5, 2]`). Two separate guarantees:

- LEAN picks land at **0u** (sync override).
- HC-dominant LOCKED picks land at the multiplied value, capped at 3u ML / 2u S+T (the existing clamp ceiling). The HC cap from §4.1 (4.5u ML / 3.0u S+T) is for ELITE+HC; the sync ceiling here is the lower of the two.

Effectively, post-cutover, the only way to ship at >3u/>2u is an ELITE+HC pick — and we want exactly that.

### §8.5 BUT — relax sync clamp ceiling for ELITE+HC

The current ceilings (3 / 2) were calibrated to v7.0 ELITE max units (3.0u ML, 2.0u S+T). v7.1 ELITE+HC ceilings are 4.5u ML / 3.0u S+T. So we need to raise the sync clamp ceiling, but only when v7.1 is active and the pick is ELITE+HC.

```js
// in syncPickToFirebase
const clampCeiling = (decision.lockTier === 'ELITE' && decision.hcDominant && isV71Eligible(data.date))
  ? V7_1_HC_CAP_ML_ELITE     // 4.5
  : 3.0;                      // legacy ML ceiling
const bumpedUnits = isLean ? 0 : Math.min(Math.max(units, 0.5), clampCeiling);

// in syncSpreadPickToFirebase / syncTotalPickToFirebase
const clampCeiling = (decision.lockTier === 'ELITE' && decision.hcDominant && isV71Eligible(data.date))
  ? V7_1_HC_CAP_ST_ELITE     // 3.0
  : 2.0;
```

Pre-cutover picks keep their legacy 3.0/2.0 ceilings.

---

## §9. Health engine — UNCHANGED (verify)

`evaluatePickHealth` (SharpFlow.jsx:1139) does not need any v7.1 edits. The reasoning:

- Δw ≤ −2 → CANCELLED. v7.1 doesn't change this.
- Δw ≤ 0 → MUTED. v7.1 doesn't add or remove this rule.
- Δw ≥ +1 ∧ Δq ≤ 0 → MUTED. Same.
- Δw=Δq=+1 (Σ=2) → MUTED. Same.

A v7.1 HC-promoted Σ=3 pick that decays to Δq=0 mutes via the existing `quality_below_floor` rule. A v7.1 HC-promoted Σ=4 that decays to Σ=2 mutes via `sum_below_floor`. **Health behaves correctly without modification.**

What does change at the health-display layer (not at the rule layer): a HC-dominant Σ=3 pick is now ACTIVE with units, where pre-v7.1 it was ACTIVE with 0 units. The health engine still returns `ACTIVE` — the difference is purely the units chip on the card.

---

## §10. TOP PICK / SUPER TOP PICK — read from stamps only

### §10.1 Replace `evaluateTopPickTier` body (SharpFlow.jsx:1416)

```js
// v7.1 — badges are stamped values, not derived in the UI. The legacy
// Δw ≥ +2 threshold is gone. Picks dated before V7_1_CUTOVER_DATE fall
// back to the legacy rule so historic UI views are unchanged.
function evaluateTopPickTier(peak, lock, sideKey, promotedRegime = null,
                              walletDelta = null, walletAgW = null, qualityMargin = null,
                              side = null, pickDate = null) {
  // v7.1 path — read from stamped fields when available.
  if (side && isV71Eligible(pickDate)
      && (side.v8_topPick !== undefined || side.v8_superTopPick !== undefined)) {
    return {
      isTopPick:      !!side.v8_topPick,
      isSuperTopPick: !!side.v8_superTopPick,
      regime:         peak?.regime ?? lock?.regime ?? promotedRegime ?? null,
      meanBaseF:      computeMeanBaseF(peak?.v8Scoring ?? lock?.v8Scoring, sideKey),
      qualityMargin,
    };
  }
  // Legacy v7.0 path — preserved for historic picks. UNCHANGED from v7.0.
  const regime = peak?.regime ?? lock?.regime ?? promotedRegime ?? null;
  const v8 = peak?.v8Scoring ?? lock?.v8Scoring ?? null;
  const meanBaseF = computeMeanBaseF(v8, sideKey);
  const dw = typeof walletDelta === 'number' ? walletDelta : null;
  const dq = typeof qualityMargin === 'number' ? qualityMargin : null;
  const isSuperTopPick = dw != null && dq != null && dw >= 2 && dq >= 2;
  const isTopPick = isSuperTopPick || (dw != null && dw >= 2);
  return { isTopPick, isSuperTopPick, regime, meanBaseF, qualityMargin };
}
```

### §10.2 Update every UI call site of `evaluateTopPickTier`

Search `evaluateTopPickTier(` and add `side` and `pickDate` as the new last two args. Most call sites already have the side data in scope as `sideData` or `peak`.

Example refactor:

```js
// before
const { isTopPick, isSuperTopPick } = evaluateTopPickTier(
  peak, lock, sideKey, regime, walletDelta, walletAgW, qualityMargin
);

// after
const { isTopPick, isSuperTopPick } = evaluateTopPickTier(
  peak, lock, sideKey, regime, walletDelta, walletAgW, qualityMargin,
  sideData, doc.date
);
```

---

## §11. UI surface — visible v7.1 changes

### §11.1 Star meter (SharpFlow.jsx ~lines 9890–9940)

UNCHANGED. The star ladder doesn't shift. HC dominance is a units modifier, not a star modifier.

### §11.2 Unit chip — show HC bump inline

Find `unitTier(...)` rendering near the locked-pick card. Add an "HC ×1.5" badge inline when `sideData.v8_hcDominant === true`:

```jsx
{sideData.v8_hcDominant && isV71Eligible(doc.date) && (
  <span style={{ ...chipBase, color: B.gold, background: B.goldDim, border: `1px solid ${B.goldBorder}` }}
        title="High-conviction CONFIRMED wallets backing with no HC dissent. Units sized at ×1.5 ladder.">
    HC ×1.5
  </span>
)}
```

LEAN chip stays "LEAN — TRACKING" with 0u — this is the correct display once the §8 sizing fix lands.

### §11.3 TOP PICK / SUPER TOP PICK ribbons

Wherever the gold ribbon is rendered, switch the predicate from the old `Δw ≥ +2` checks to the stamped fields:

```jsx
const { isTopPick, isSuperTopPick } = evaluateTopPickTier(
  peak, lock, sideKey, regime, walletDelta, walletAgW, qualityMargin,
  sideData, doc.date
);
{isSuperTopPick ? <SuperTopPickRibbon /> : isTopPick ? <TopPickRibbon /> : null}
```

The ribbons themselves don't change visually. What changes is which picks get them: SUPER is now a HC-dominance signal, TOP is now a Σ ≥ +5 signal, neither is now coupled to Δw ≥ +2.

### §11.4 Hero chips (`renderHeroChips`, SharpFlow.jsx:626)

Extend the tooltip to mention HC dominance when present. Keep the visible chips minimal — the gold "HC ×1.5" badge in §11.2 already surfaces HC visually.

```js
const hcLine = (sideData?.v8_hcConfFor || sideData?.v8_hcConfAg)
  ? ` · HC: ${sideData.v8_hcConfFor || 0} for · ${sideData.v8_hcConfAg || 0} against`
  : '';
const tooltip =
  `Winners margin Δw=${dwNum >= 0 ? '+' : ''}${dwNum} (${forNum} for · ${agNum} against)${hcLine} · ` +
  `Quality margin Δq=${dqNum >= 0 ? '+' : ''}${dqNum} at T30 contribution (${qForNum} for · ${qAgNum} against). ` +
  `Lock floor (v7.1): Σ ≥ +5 OR (Σ ∈ {3,4} ∧ HC dominance). Σ ∈ {3,4} without HC renders as LEAN (tracked, 0u).`;
```

The `hcLine` won't render for v7.0 historic picks (they have no `v8_hcConfFor` field) so historic tooltips are unchanged.

### §11.5 Promotion narration

When a pick is HC-promoted out of the LEAN window, render a one-line tooltip near the lock badge:

```jsx
{sideData.promotedBy === 'hc-dominance' && (
  <span style={{ ...chipBase, color: B.gold, background: B.goldDim }}
        title="Promoted to LOCKED via high-conviction CONFIRMED dominance — sharp confirmed wallets backing this side at high conviction with no high-conviction dissent.">
    PROMOTED · HC
  </span>
)}
```

### §11.6 Locked Picks list filtering

Today's UI filters by `lockStage === 'LOCKED'`. That's already correct — both the legacy Σ ≥ +5 path and the new HC path produce `LOCKED`. No filter change needed.

LEAN picks already render in the Locked list with a "LEAN" badge replacing the unit chip. After the §8 sizing fix they'll show 0u correctly.

---

## §12. Daily V6 report — add §7c HC cohort table

### §12.1 Patch `nhl-savant/scripts/dailyV6Report.js`

Add a new section §7c after the existing §7b. Read every shipped pick and partition by:

- `v7.0_LEAN` (Σ ∈ {3,4}, ¬HC)
- `v7.1_LEAN` (Σ ∈ {3,4}, ¬HC, post-cutover)
- `LOCKED_BY_HC` (Σ ∈ {3,4} ∧ HC, post-cutover)
- `LOCKED_STD` (Σ ∈ {5,6}, ¬HC)
- `LOCKED_STD_HC` (Σ ∈ {5,6} ∧ HC)
- `ELITE_STD` (Σ ≥ 7, ¬HC)
- `ELITE_HC` (Σ ≥ 7 ∧ HC)

Each row: N, W-L, WR, flat ROI, peak PnL.

Discriminator logic:

```js
function v71Cohort(side) {
  const hc = !!side.v8_hcDominant;
  const sum = (side.v8_walletConsensusDelta || 0) + (side.v8_walletConsensusQualityMargin || 0);
  const tier = side.v8_lockTier;
  const isV71 = side.v8_systemVersion === '7.1';
  if (tier === 'LEAN' && !isV71) return 'v7.0_LEAN';
  if (tier === 'LEAN' &&  isV71) return 'v7.1_LEAN';
  if (tier === 'LOCKED' && sum <= 4 && hc && isV71) return 'LOCKED_BY_HC';
  if (tier === 'LOCKED' && hc) return 'LOCKED_STD_HC';
  if (tier === 'LOCKED')       return 'LOCKED_STD';
  if (tier === 'ELITE'  && hc) return 'ELITE_HC';
  if (tier === 'ELITE')        return 'ELITE_STD';
  return 'OTHER';
}
```

Render as a markdown table, filterable by sport. The `LOCKED_BY_HC` row is the canary for v7.1's biggest behavioral change — if it underperforms `LOCKED_STD` over a 14-day window, we revert (§14).

### §12.2 Patch `nhl-savant/scripts/walletGateScaleTest.js`

Already produces the per-Σ × per-gate matrix. Add a `--monitor` flag that:

- Pulls the trailing 14 days only (`since` arg defaulting to `today - 14`).
- Outputs a single-line PASS/FAIL summary against the §14 tripwires.
- Exits 0 on PASS, 1 on FAIL — so a CI/cron job can consume it.

---

## §13. Grading layer — UNCHANGED (verify)

`nhl-savant/functions/src/betTracking.js` reads `peak.units` and `peak.odds` at grade time (line 423). Three guarantees:

1. **Historic graded picks already have peak.units stamped at v7.0 values** and are read-only (`status='COMPLETED'`). They grade with v7.0 values forever.
2. **Today's wiped docs will land with peak.units stamped at v7.1 values** post-cutover. They grade with v7.1 values.
3. **The grading function itself doesn't need a code change.** It's a pass-through: whatever `peak.units` is at the moment of grading is what gets multiplied by the result outcome.

This is the cleanest part of the cutover. Grading is forward-compatible by virtue of being version-blind — it just reads the stamped values.

---

## §14. Monitoring & rollback

### §14.1 Tripwires (re-run weekly)

A. **Gate scale degradation** — `node scripts/walletGateScaleTest.js --monitor`. Fail if 2+ of:

- HC dominance positive in <4 of 5 Σ buckets.
- Pooled lift_WR < +10pp.
- 14-day flat ROI of `LOCKED_BY_HC` cohort < flat ROI of `LOCKED_STD`.

B. **Cell-level PnL collapse** — `LOCKED_BY_HC` 14-day rolling PnL < −10u with N ≥ 12.

### §14.2 Revert procedure

```js
// One-line revert. No redeploy required if we ship the kill-switch live.
const V7_1_HC_DOMINANCE_ENABLED = false;
```

When `false`:
- `isV71Eligible(...)` returns false for every pick.
- `lockTierFromDeltas` reverts to v7.0 ladder (Σ ≥ +5 floor, never promotes via HC).
- `calculateUnits` / `calculateSpreadTotalUnits` skip the HC multiplier.
- `evaluateTopPickTier` falls back to the legacy Δw ≥ +2 path.
- Stamps continue to be written (so analytics still flow), but UI/sizing reverts to v7.0.

In-flight HC-promoted picks created before the flip stay in their LOCKED state — we don't yank them mid-game. New writes from the flip-time forward use v7.0 logic.

### §14.3 What the daily V6 report tells us by day 14

Expected, given the 13-day historical sample:

```
LOCKED_BY_HC      WR ≥ 70%, flat ROI ≥ +35%   ← canary, the new cohort
LOCKED_STD_HC     WR ≥ 70%, flat ROI ≥ +50%
LOCKED_STD        WR  60%,  flat ROI  +15%
ELITE_HC          WR ≥ 75%, flat ROI ≥ +60%
ELITE_STD         WR  65%,  flat ROI  +30%
v7.1_LEAN         (low N, near break-even)
```

If `LOCKED_BY_HC` lands inside ±10pp of `LOCKED_STD`, ship is healthy. If it crashes below `LOCKED_STD` by 10pp, revert.

---

## §15. Acceptance tests (run before declaring v7.1 live)

These are pre-flight checks. None automated yet — manual verification, ~15 min total.

### §15.1 Unit-level

For each function, supply specific inputs and confirm outputs:

| Function | Input | Expected output |
|---|---|---|
| `lockTierFromDeltas(2, 1, false, {pickDate:'2026-04-30'})` | Σ=3, no HC | `'LEAN'` |
| `lockTierFromDeltas(2, 1, true,  {pickDate:'2026-04-30'})` | Σ=3, HC | `'LOCKED'` |
| `lockTierFromDeltas(2, 1, true,  {pickDate:'2026-04-29'})` | Σ=3, HC, pre-cutover | `'LEAN'` (gated) |
| `lockTierFromDeltas(3, 2, false, {pickDate:'2026-04-30'})` | Σ=5 | `'LOCKED'` |
| `lockTierFromDeltas(4, 4, true,  {pickDate:'2026-04-30'})` | Σ=8, HC | `'ELITE'` |
| `calculateUnits(4.5, 0, -150, 0, 'LOCKED', true,  {pickDate:'2026-04-30'})` | Σ=5 + HC | `2.0 × 1.5 = 3.0u` |
| `calculateUnits(4.5, 0, -150, 0, 'LOCKED', false, {pickDate:'2026-04-30'})` | Σ=5, no HC | `2.0u` |
| `calculateUnits(5.0, 0, -150, 0, 'ELITE',  true,  {pickDate:'2026-04-30'})` | ELITE + HC | `4.0 × 1.5 = 6.0 → capped 4.5u` |
| `calculateUnits(3.5, 0, -150, 0, 'LEAN',   true,  {pickDate:'2026-04-30'})` | LEAN | `0u` (LEAN beats HC) |
| `calculateSpreadTotalUnits(4.5, 0, -110, 0, 'LOCKED', true,  {pickDate:'2026-04-30'})` | Σ=5 + HC spread | `1.5 × 1.5 = 2.25 → capped 1.75u` |

### §15.2 Pipeline-level (with a real v8Scoring object)

Build a fixture `walletDetails` with:

```js
const fixture = [
  { wallet: 'AAA-CONF-HC',  side: 'home', contribution: 50, sizeRatio: 1.8 },
  { wallet: 'BBB-CONF-LO',  side: 'home', contribution: 35, sizeRatio: 0.8 },
  { wallet: 'CCC-FLAT',     side: 'home', contribution: 20, sizeRatio: 1.0 },
  { wallet: 'DDD-CONF-HC',  side: 'away', contribution: 0,  sizeRatio: 0.0 },  // not on the side
];
```

Stub the profile cache so AAA/DDD = CONFIRMED, BBB = CONFIRMED, CCC = FLAT. Then:

- `computeWalletConsensus(fixture, 'MLB', 'home')` should return `{ forW: 3, agW: 0, hcConfFor: 1, hcConfAg: 0, hcDominant: true, qualityForT30: 1, qualityMargin: 1 }`.
- `decideLockStage` for that side at Σ=4 (Δw=3, Δq=1) returns `{ stage: 'LOCKED', promotedBy: 'hc-dominance', lockTier: 'LOCKED', hcDominant: true }`.
- `stampWalletConsensus` writes `v8_topPick=false, v8_superTopPick=true, v8_hcDominant=true, v8_systemVersion='7.1'`.

### §15.3 End-to-end smoke test

After deploy + Firestore wipe, watch the first slate's first sync:

1. The first new doc gets `v8_systemVersion: '7.1'` stamped in Firestore.
2. The Locked Picks UI renders any HC-promoted Σ ∈ {3,4} pick with the gold "HC ×1.5" chip and a non-zero unit value.
3. Σ ∈ {3,4} picks WITHOUT HC dominance render as LEAN with 0u.
4. No console error mentioning `lockTierFromDeltas is not a function` or `Cannot read properties of undefined (reading 'v8_hcDominant')`.

---

## §16. Cutover sequence — exact steps for go-live day

### §16.1 Pre-deploy (T-30 min)

1. Confirm `V7_1_CUTOVER_DATE` matches today's ET date string (`new Date().toLocaleDateString('en-CA', {timeZone:'America/New_York'})`).
2. Confirm `V7_1_HC_DOMINANCE_ENABLED = true`.
3. Confirm `WHITELIST_CONSENSUS_VERSION = 7`.
4. Run §15.1 + §15.2 fixtures locally.
5. `git diff` the SharpFlow.jsx changes — should touch only the functions enumerated in §1–§11 and the three sync paths in §8. Anything outside that surface is a stray edit.

### §16.2 Deploy (T-15 min)

6. Push to production hosting.
7. Hard-refresh the SharpFlow tab in browser, confirm no console errors at boot.
8. Confirm `WALLET_PROFILES_CACHE` populates (the §2.1 HC code path requires it).

### §16.3 Cutover (T-5 min)

9. **User wipes today's docs in Firestore:**
   - `sharpFlowPicks` where `date == today`
   - `sharpFlowSpreads` where `date == today`
   - `sharpFlowTotals` where `date == today`
10. Confirm the Locked Picks UI shows 0 picks.

### §16.4 Live (T+0)

11. The next UI tick syncs today's new picks. Watch for:
    - First created doc has `v8_systemVersion: '7.1'` and `v8_hcDominant` set (true or false).
    - Promotion narration appears on any HC-promoted Σ ∈ {3,4} pick.
12. Spot-check 5 picks/sport in Firestore over the first hour to confirm fields are stamping correctly.

### §16.5 Day +1

13. Run the daily V6 report. Confirm the new §7c HC cohort table renders with non-zero rows.
14. Sanity-check `LOCKED_BY_HC` rows look reasonable (1.5–2 picks/day, mixed outcomes).

### §16.6 Day +14

15. Run `node scripts/walletGateScaleTest.js --monitor`. PASS = stay live; FAIL = flip kill-switch and post-mortem.

---

## §17. File-touch summary

| File | Lines touched | Why |
|---|---|---|
| `src/pages/SharpFlow.jsx` | ~250 net (across ~15 functions) | Core v7.1 logic |
| `scripts/dailyV6Report.js` | +60 | New §7c HC cohort table |
| `scripts/walletGateScaleTest.js` | +30 | `--monitor` flag |
| `scripts/fixLeanTierSizing.js` | run once | Already exists; backfill any LEAN sizing leftovers |
| `SHARP_INTEL_V7_1_PLAYBOOK.md` | +status header on each §4 step | Mark steps as deployed |

**Files NOT touched:**

- `nhl-savant/functions/src/betTracking.js` — grading is version-blind.
- `nhl-savant/scripts/exportWalletProfiles.js` — whitelist tier classifier unchanged.
- Any `dailyV6Report.js` section other than §7c.
- Any historic markdown report.

**No new dependencies. No schema migrations beyond Firestore additive fields.**

---

## §18. Worked example — a full pick lifecycle on day 1

Walk through one HC-promoted Σ=3 pick from creation to grade to confirm every layer behaves.

**Setup.** MLB game ATL @ NYY. Sharp Intel detects:

- Δw = +2 (CONFIRMED Wallet A on ATL backing, CONFIRMED Wallet B on ATL backing, no whitelisted wallets against)
- Δq = +1 (one quality wallet on ATL at contribution=45)
- Σ = +3
- Wallet A: `sizeRatio = 1.7` (HC), `whitelistTier = CONFIRMED`
- Wallet B: `sizeRatio = 0.9` (not HC), `whitelistTier = CONFIRMED`
- HC_for = 1, HC_ag = 0 → **HC dominance true**

**T+0 — first sync writes the doc:**

- `computeWalletConsensus` returns `{ delta: 2, qualityMargin: 1, hcDominant: true, hcConfFor: 1, hcConfAg: 0 }`.
- `decideLockStage` returns `{ stage: 'LOCKED', promotedBy: 'hc-dominance', lockTier: 'LOCKED', hcDominant: true }`.
- `vaultStarFromDeltas(2, 1)` = 3.5★ (unchanged).
- UI passes `units = calculateUnits(3.5, 0, -150, 0, 'LOCKED', true, {pickDate: '2026-04-30'}) = 0.75 × 1.5 = 1.13u`.
- `syncPickToFirebase` clamps to `Math.min(Math.max(1.13, 0.5), 3) = 1.13u`. peak.units = 1.13.
- Doc written with `v8_systemVersion: '7.1'`, `v8_hcDominant: true`, `v8_topPick: false`, `v8_superTopPick: true`, `v8_lockTier: 'LOCKED'`, `lockStage: 'LOCKED'`, `promotedBy: 'hc-dominance'`.

**T+30 min — UI render:**

- Card shows 3.5★, 1.13u with the gold "HC ×1.5" chip.
- "PROMOTED · HC" tooltip on hover.
- SUPER TOP PICK ribbon (filled gold) — because `v8_superTopPick=true`.
- No TOP PICK ribbon — because `v8_topPick=false` (Σ=3 < 5).

**T+60 min — Δq decays to 0** (a quality wallet added on the other side):

- `evaluatePickHealth` reads live Δw=2, Δq=0. Returns `{ status: 'MUTED', reasons: ['quality_below_floor'] }`.
- UI dims the card. health.status='MUTED'. Sized at 0u in live view via `computeLiveSizing`.

**Game ends — grading:**

- Cloud Function fetches MLB final score. ATL wins.
- Reads `peak.units = 1.13`, `peak.odds = -150`.
- Writes `result.outcome = 'WIN'`, `result.profit = 1.13 × (100/150) = 0.75u`, `result.units = 1.13`, `status = 'COMPLETED'`.
- The doc is now read-only.

**Day +1 — daily V6 report:**

- `v71Cohort` discriminator returns `'LOCKED_BY_HC'`.
- §7c table shows this pick under that row. WR contribution: 1 win. Flat ROI contribution: +0.75u against -150 entry → +50% flat. Peak PnL: +0.75u.

That's the complete lifecycle. Every layer participates as designed; nothing about historic picks moved.

---

## §19. Quick-reference — invariants we must preserve

If any of these break post-cutover, there's a regression:

1. **Historic doc writes never trigger.** Pull a graded pick from yesterday in Firestore. After cutover deploy, no `lastWriteAt` updates on it.
2. **LEAN picks in production show 0u.** Hard requirement post-§8 fix.
3. **No double-promotion narration.** A HC-promoted pick should show "PROMOTED · HC" but not also "PROMOTED · two-factor-floor".
4. **Σ ≥ +5 picks without HC still LOCK and earn TOP PICK.** v7.1 doesn't take TOP PICK *away* from picks that earned it the v7.0 way; it changes which picks earn it.
5. **Health engine still mutes Δq → 0.** A v7.1-promoted Σ=3 that decays to Δq=0 must MUTE. (Tested by §13.)
6. **Bumping `WHITELIST_CONSENSUS_VERSION` triggers re-stamp.** First sync of any active doc post-deploy should re-stamp consensus fields (verify by checking `v8_walletConsensusVersion: 7` on a previously-active doc).
7. **`peak.units` on graded historic picks does not change.** Sample one before deploy, sample after, confirm bytewise equal.

---

## §20. Done criteria

v7.1 is officially live when:

- [ ] All §15 acceptance tests pass.
- [ ] User has wiped today's `sharpFlowPicks/Spreads/Totals` docs.
- [ ] Code is deployed with `V7_1_HC_DOMINANCE_ENABLED = true`.
- [ ] First post-cutover sync produces a doc with `v8_systemVersion: '7.1'`.
- [ ] First HC-promoted Σ ∈ {3,4} pick of the slate shows the "HC ×1.5" chip in UI.
- [ ] Daily V6 report on Day +1 renders the §7c HC cohort table.

After Day +14 with the §14.1 tripwires green, v7.1 is durable and v7.0 logic can be deleted from `lockTierFromDeltas` and the badge/units fallbacks.

---

## §21. References

- `SHARP_INTEL_V7_1_PLAYBOOK.md` — the design rationale + per-Σ scale data.
- `WALLET_GATE_SCALE_TEST.md` — the 5/5 Σ-bucket lift table that motivates HC dominance.
- `WALLET_PREDICTIVENESS_PLAYBOOK.md` — the underlying CONFIRMED-tier study.
- `V6_FULL_ANALYSIS.md` — the v7.0 Σ ≥ +5 floor calibration.
- `nhl-savant/src/pages/SharpFlow.jsx` — the system.
- `nhl-savant/functions/src/betTracking.js` — grader (UNCHANGED).
- `nhl-savant/scripts/dailyV6Report.js` — daily report; gets §7c added.
- `nhl-savant/scripts/walletGateScaleTest.js` — gate-scale monitor.
