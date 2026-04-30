# SHARP INTEL v7.1 — FULL SYSTEM EXPLANATION + HC-DOMINANCE OVERHAUL

_Last updated: 2026-04-30 · Author: Sharp Intel research · Status: **proposed — pre-implementation**_

This is the canonical, end-to-end explanation of the Sharp Intel scoring system as it exists today (v7.0) and the v7.1 upgrade we're shipping. It supersedes scattered notes in `WALLET_PREDICTIVENESS_PLAYBOOK.md`, `WALLET_GATE_SCALE_TEST.md`, `V6_FULL_ANALYSIS.md`, and `FLOOR_LOWERING_ANALYSIS.md`. Anyone touching `src/pages/SharpFlow.jsx` should read this first.

The v7.1 changes are driven by one finding from `WALLET_GATE_SCALE_TEST.md`: only one wallet-quality gate produces consistent, scaling lift across every Σ bucket — **HC DOMINANCE**. Every other tier-count gate (any-CONFIRMED, net-CONFIRMED, no-FLAT) is either noise or weak. v7.1 promotes HC dominance to a first-class system input that drives badges (TOP PICK / SUPER TOP PICK), lock-tier promotion, and unit sizing.

---

## §0. TL;DR

**The system today (v7.0).** Two wallet-derived metrics decide everything:

- **Δw** (winner margin) = `forW − agW`, counted only over `whitelistTier ∈ {CONFIRMED, FLAT}` wallets.
- **Δq** (quality margin) = `qFor − qAg`, counted only over wallets whose `contribution ≥ 30`.
- **Σ** = Δw + Δq.

Σ — gated by `Δw ≥ +1 ∧ Δq ≥ +1` — drives a star ladder, a lock-tier ladder (ELITE/LOCKED/LEAN/MUTED), a unit ladder, the health engine (mute/cancel), and the TOP PICK / SUPER TOP PICK badges. The full pipeline is described in §1–§7.

**What's wrong with v7.0.** Three production gaps:

1. **Σ ∈ {3,4} (LEAN) ships at 0u correctly only if the sync layer doesn't override** — currently `Math.max(units, 0.5)` clamps every locked side to ≥0.5u, defeating the LEAN-is-display-only rule. Σ=3 picks shipped at 0.5u; Σ=4 picks sometimes promoted to 1.0u via `peak.units` monotonic max (LEAN sizing fix, §9).
2. **Wallet-tier counting is too crude.** The v7.0 floor counts CONFIRMED wallets equally regardless of conviction. The data shows CONFIRMED-at-routine-size is mediocre (54% WR); only CONFIRMED-at-≥1.5×-conviction (HC) is great (70% WR). Net-CONFIRMED counting fails 3 of 5 Σ buckets in `WALLET_GATE_SCALE_TEST.md`.
3. **TOP PICK / SUPER TOP PICK badges are decoupled from the lock decision.** They re-test Δw against a different threshold (Δw ≥ +2) than the lock floor (Σ ≥ +5). Users see "SUPER TOP PICK" on a Σ=4 LEAN that isn't even being shipped at units. The badges should reflect *committed* picks, not a parallel scoring lane.

**What v7.1 changes.** One new primitive — `HC_DOMINANCE` — and three downstream re-bindings:

```
HC_DOMINANCE := (HC_for ≥ 1) ∧ (HC_ag = 0)
  where HC = whitelistTier=CONFIRMED ∧ sizeRatio ≥ 1.5×

LOCK floor:           Σ ≥ +5  OR  (Σ ∈ {3,4} ∧ HC_DOMINANCE)
UNIT MULTIPLIER:      ×1.5 if HC_DOMINANCE, ×1.0 otherwise
TOP PICK badge:       LOCKED ∧ Σ ≥ +5
SUPER TOP PICK badge: LOCKED ∧ HC_DOMINANCE
```

This is the entire v7.1 spec. Everything else in this doc — the LEAN sizing fix, the badge-rebind, the deprecation of `evaluateTopPickTier`, the firestore field additions, the rollback plan — flows from those four lines.

**Why we're confident.** From `WALLET_GATE_SCALE_TEST.md`:

| Σ bucket | non-HC WR | HC WR | Lift |
|---|---|---|---|
| Σ=3 | 53.8% | 100.0% | **+46.2 pp** |
| Σ=4 | 30.8% | 50.0% | **+19.2 pp** |
| Σ=5 | 62.5% | 100.0% | **+37.5 pp** |
| Σ=6 | 16.7% | 100.0% | **+83.3 pp** (p=0.018) |
| Σ≥7 | 54.5% | 80.0% | **+25.5 pp** |

5 of 5 buckets positive. Pooled lift +34.7pp WR / +60.9pp flat ROI. The signal scales; the rule scales with it.

---

## §1. The current system (v7.0) end-to-end

This section is the inventory. If you already know how v7.0 works, skip to §2.

### §1.1 Pipeline overview

```
┌─ Source A: walletDetails on each side ─────────────────────────────┐
│   Built by computeV8WalletScoring(positions, sport).               │
│   For every wallet on either side of the market it stamps:         │
│     wallet, side, invested, contribution, walletBase,              │
│     sizeRatio (= invested / wallet's avgSportBet),                 │
│     convictionMult, sportROI, leaderboardRank.                     │
└────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─ Source B: WALLET_PROFILES_CACHE ──────────────────────────────────┐
│   Module-level Map keyed by walletShort (last 6 chars).            │
│   Built by exportWalletProfiles.js → sharpWalletProfiles coll.     │
│   Each profile carries `whitelistTier ∈ {CONFIRMED, FLAT, WR50,    │
│   NULL}` per sport. CONFIRMED + FLAT = "whitelisted". WR50 / NULL  │
│   are excluded from Δw counting.                                   │
└────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─ computeWalletConsensus(walletDetails, sport, sideKey) ───────────┐
│   Returns { forW, agW, delta=Δw, qualityForT30, qualityAgT30,      │
│             qualityMargin=Δq, lockAction, promotionEligible }.     │
│   forW/agW count only `isWhitelistedForSport`-true wallets.        │
│   qFor/qAg count only `contribution ≥ 30` wallets (independent     │
│   of whitelist tier).                                              │
└────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─ decideLockStage(regime, v8Scoring, side, sport, baseStars) ──────┐
│   wc.promotionEligible = (Δw ≥ +1 ∧ Δq ≥ +1 ∧ Σ ≥ +3) →            │
│   stage = 'LOCKED'. Otherwise 'SHADOW'.                            │
└────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─ lockTierFromDeltas(Δw, Δq) — UI/sizing tier ─────────────────────┐
│   Σ ≥ 7  → ELITE  (full ladder + ELITE bonus)                      │
│   Σ ∈ 5,6 → LOCKED (full ladder)                                   │
│   Σ ∈ 3,4 → LEAN   (tracked, 0u — but see §9 sizing-clamp bug)     │
│   else    → MUTED                                                  │
└────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─ evaluatePickHealth ───────────────────────────────────────────────┐
│   Re-runs every render off CURRENT Δw/Δq. Below-floor on either    │
│   axis → MUTED. Δw ≤ −2 → CANCELLED. Δw ≤ 0 → MUTED.               │
│   Δw ≥ +1 ∧ Δq ≤ 0 → MUTED. Δw=Δq=+1 → MUTED ('sum_below_floor').  │
└────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─ TOP PICK / SUPER TOP PICK (today, decoupled) ─────────────────────┐
│   evaluateTopPickTier(peak, lock, side, regime, Δw, agW, Δq):      │
│     SUPER TOP PICK = Δw ≥ +2 AND Δq ≥ +2                           │
│     TOP PICK       = Δw ≥ +2 AND not SUPER                         │
│     NO BADGE       = Δw ≤ +1                                       │
│   Note: this re-tests Δw, IGNORES the lock-floor decision, and is  │
│   stale relative to live Δ's.                                      │
└────────────────────────────────────────────────────────────────────┘
```

### §1.2 The numbers (live, not theory)

These are the constants currently driving production:

| Layer | Constant | Value | Source |
|---|---|---|---|
| Quality cutoff | `QUALITY_CONTRIB_CUT` | `30` | SharpFlow.jsx:986 |
| Whitelist tiers counted in Δw | `{CONFIRMED, FLAT}` | — | SharpFlow.jsx:1000–1002 |
| Lock floor | `Δw ≥ +1 ∧ Δq ≥ +1 ∧ Σ ≥ +3` | promotion path | SharpFlow.jsx:1107–1113 |
| LEAN window | `Σ ∈ {3,4}` | tracked, 0u | SharpFlow.jsx:612–620 |
| LOCKED window | `Σ ∈ {5,6}` | full ladder | — |
| ELITE window | `Σ ≥ +7` | ladder + bonus | — |
| HEALTH MUTE: Δw=0 | always | regardless of Δq | SharpFlow.jsx:1182–1191 |
| HEALTH MUTE: Δq≤0 with Δw≥+1 | always | quality below floor | SharpFlow.jsx:1192–1200 |
| HEALTH MUTE: Σ < +3 | always | sum below floor | SharpFlow.jsx:1201–1210 |
| HEALTH CANCEL | `Δw ≤ −2` | strong dissent | SharpFlow.jsx:1166–1173 |

### §1.3 Star ladder (`vaultStarFromDeltas`)

```
Δw ≥ +1 ∧ Δq ≥ +1:
  Σ ≥ +6 → 5.0★
  Σ = +5 → 4.5★
  Σ = +4 → 4.0★   (LEAN — 0u)
  Σ = +3 → 3.5★   (LEAN — 0u)
  Σ = +2 → 2.5★   (1/1 cell — health engine MUTEs it)

Below v6.6 base (Δw ≤ 0 OR Δq ≤ 0):
  Δw ≤ −2 → 1.0★
  Δw = −1 → 1.5★
  Δw =  0 → 2.5★ (then ±0.5 from Δq)
  Δw ≥ +1 ∧ Δq ≤ 0 → 3.0★ + Δq adj
```

### §1.4 Unit ladder

ML (`calculateUnits`):

| stars / lockTier | Units | Notes |
|---|---|---|
| `lockTier='LEAN'` | **0.00u** | hard guard at top of fn |
| `lockTier='ELITE'` (Σ≥+7) | **4.00u** | replaces ladder |
| stars ≥ 5.0 (Σ=+6) | 3.00u | |
| stars ≥ 4.5 (Σ=+5) | 2.00u | |
| stars ≥ 4.0 | 1.25u | only fires when lockTier override absent |
| stars ≥ 3.5 | 0.75u | "" |
| else | 0 | |

Heavy-favorite/dog clamps then apply (odds ≥ +200/+151/+100). Spread/total `calculateSpreadTotalUnits` mirrors the same shape with reduced numbers.

### §1.5 The TOP PICK badges today

`evaluateTopPickTier` is the only place where Δw is independently re-thresholded:

- **SUPER TOP PICK** (filled gold) — Δw ≥ +2 ∧ Δq ≥ +2
- **TOP PICK** (outlined gold) — Δw ≥ +2 ∧ not SUPER
- **NO BADGE** — Δw ≤ +1

These thresholds came from a Δw-only backtest in early v8 (N=74). They were never re-fitted after the v7.0 Σ-floor change, so today the badges fire on picks that didn't lock (Σ=3,4 with Δw=2, Δq=1 = TOP PICK + LEAN) and miss picks that did (Σ=5 with Δw=1, Δq=4 = LOCKED + no badge). This is the inconsistency v7.1 fixes.

### §1.6 Where the data lives in Firestore

Every pick side stores (under `sides[sideKey]`):

| Field | Set by | Used by |
|---|---|---|
| `lockStage` ∈ {SHADOW, LOCKED} | sync layer | UI list filtering |
| `lock.lockOdds`, `lock.regime`, `lock.stars`, `lock.units` | sync layer | UI badge rendering |
| `peak.peakOdds`, `peak.stars`, `peak.units`, `peak.regime`, `peak.v8Scoring` | sync layer (monotonic max) | UI primary, grading |
| `health.status` ∈ {ACTIVE, MUTED, CANCELLED} | render-time `evaluatePickHealth` | UI dim/strike |
| `v8_walletConsensusForW / AgW / Delta / Verdict` | `stampWalletConsensus` | reports, analytics |
| `v8_walletConsensusQualityForT30 / AgT30 / Margin` | `stampWalletConsensus` | reports, analytics |
| `v8_lockTier` ∈ {ELITE, LOCKED, LEAN, MUTED} | `stampWalletConsensus` | report bucketing |
| `v8_vaultStar` (frozen) | `stampWalletConsensus` | analytics |
| `v8_walletConsensusVersion` | `stampWalletConsensus` | re-stamp gate |

v7.1 adds five fields (§4.4).

---

## §2. v7.1 spec — the four lines that change everything

### §2.1 New primitive

```
HC_DOMINANCE := (HC_FOR ≥ 1) ∧ (HC_AG = 0)

  HC_FOR := count of walletDetails entries where:
              side === sideKey
              AND profile.whitelistTier === 'CONFIRMED'
              AND sizeRatio >= 1.5

  HC_AG  := same, but side !== sideKey
```

**Why this primitive and not another.** From `WALLET_GATE_SCALE_TEST.md` (90 picks, 13 days, 5 Σ buckets):

| Gate | Buckets w/ positive lift | Avg lift_WR | Verdict |
|---|---|---|---|
| `G_CONF` (any CONFIRMED) | 2/3 | −3.7 pp | NOISE |
| `G_NETCONF` (net CONFIRMED ≥ +1) | 2/5 | +3.6 pp | NOISE |
| `G_NOFLAT` (no FLAT contamination) | 3/3 | +9.6 pp | weak |
| **`G_HC` (HC dominance)** | **5/5** | **+34.7 pp** | **SCALES** |
| `G_PURITY` (HC OR pure-CONFIRMED) | 5/5 | +27.1 pp | scales but weaker |
| `G_NETCONF_OR_HC` | 2/5 | +8.7 pp | NOISE |

HC dominance is the single primitive whose lift survives the per-Σ scale test. It is *also* directionally consistent across MLB and NBA in §4 of that doc (N too small for NHL).

### §2.2 The four rebindings

```
1. LOCK FLOOR (replaces lockTierFromDeltas Σ ≥ 5 cutoff)
   ELITE  : Σ ≥ +7
   LOCKED : Σ ≥ +5  OR  (Σ ∈ {3,4} ∧ HC_DOMINANCE)
   LEAN   : Σ ∈ {3,4} ∧ ¬HC_DOMINANCE       (tracked, 0u)
   MUTED  : Σ < +3 OR Δw ≤ 0 OR Δq ≤ 0

2. UNIT MULTIPLIER (applied at end of calculateUnits + calculateSpreadTotalUnits)
   ×1.5 if HC_DOMINANCE
   ×1.0 otherwise
   (clamped to existing odds-based caps; never exceed 4.5u ML / 3.0u S+T)

3. TOP PICK BADGE
   LOCKED (any path) ∧ Σ ≥ +5

4. SUPER TOP PICK BADGE
   LOCKED (any path) ∧ HC_DOMINANCE
```

The badge rules deliberately overlap with the lock-tier rules — that's the point. A user looking at a SUPER TOP PICK now knows it's HC-dominant; a user looking at a TOP PICK without SUPER knows it's a clean Σ≥+5 lock without HC. There is no third "Δw≥+2 but not locked" badge, because that pick is either MUTED by the health engine or is a LEAN.

### §2.3 What about the legacy `Δw ≥ +2` badge threshold?

Deprecated. The v7.1 badges are derived from the lock decision and HC dominance only. Δw ≥ +2 ∧ Δq=+1 picks that used to earn a TOP PICK badge under v7.0 will:

- still LOCK (they're Σ ≥ +3 with both axes ≥ +1 — promotionEligible is true);
- NOT earn TOP PICK unless Σ ≥ +5;
- earn SUPER TOP PICK if HC-dominant regardless of Σ.

This is intentional. Δw≥+2 ∧ Δq=+1 was never the cell that drove the badge edge — the actual edge in that 2026-04-22 backtest came from the high-conviction sub-cohort, which we now isolate explicitly.

### §2.4 What about ELITE (Σ ≥ +7)?

Untouched. Σ ≥ +7 still earns the ELITE bonus in `calculateUnits` (4.0u ML / 2.5u S+T). HC dominance multiplier still applies on top (so an HC-dominant Σ≥+7 pick lands at 4.5u ML, the existing ladder cap). The ELITE label and the SUPER TOP PICK badge can co-exist on the same card.

---

## §3. State machine — every pick has exactly one of these states

| State | Δw / Δq | HC | Lock floor | Stars | Units | Health | Badges |
|---|---|---|---|---|---|---|---|
| MUTED-low | Δw ≤ 0 OR Δq ≤ 0 | any | fail | per ladder | 0 | MUTED | none |
| MUTED-bleeder | Δw=+1 ∧ Δq=+1 | any | fail | 2.5★ | 0 | MUTED ('sum_below_floor') | none |
| LEAN | Σ ∈ {3,4} ∧ Δw≥+1 ∧ Δq≥+1 | no | LEAN tier | 3.5–4.0★ | 0 | ACTIVE (display only) | none |
| LOCKED-by-HC | Σ ∈ {3,4} ∧ Δw≥+1 ∧ Δq≥+1 | yes | promote via HC | 3.5–4.0★ | ladder × 1.5 | ACTIVE | TOP=no, SUPER=yes |
| LOCKED-standard | Σ ∈ {5,6} | no | LOCK | 4.5–5.0★ | ladder × 1.0 | ACTIVE | TOP=yes, SUPER=no |
| LOCKED-Σ-and-HC | Σ ∈ {5,6} | yes | LOCK | 4.5–5.0★ | ladder × 1.5 | ACTIVE | TOP=yes, SUPER=yes |
| ELITE | Σ ≥ +7 | no | LOCK + ELITE | 5.0★ | ELITE bonus × 1.0 | ACTIVE | TOP=yes, SUPER=no |
| ELITE+HC | Σ ≥ +7 | yes | LOCK + ELITE | 5.0★ | ELITE bonus × 1.5 (capped) | ACTIVE | TOP=yes, SUPER=yes |
| CANCELLED | Δw ≤ −2 | any | fail | per ladder | 0 | CANCELLED | none |

There are no other states. Anything not in this table is a bug.

### §3.1 Concrete examples (drawn from the 13-day sample)

| Real pick | Δw / Δq | Σ | HC_for / HC_ag | v7.0 outcome | v7.1 outcome |
|---|---|---|---|---|---|
| Σ=3 with two HC CONFIRMED for, no HC against | 2 / 1 | 3 | 2 / 0 | LEAN, 0u, no badge | LOCKED via HC, 1.13u (0.75 × 1.5), SUPER |
| Σ=4 standard | 2 / 2 | 4 | 0 / 0 | LEAN, 0u | LEAN, 0u (unchanged) |
| Σ=5 standard | 2 / 3 | 5 | 0 / 0 | LOCKED, 2.0u, SUPER (Δw≥+2, Δq≥+2 in v7.0 → super) | LOCKED, 2.0u, TOP only |
| Σ=5 HC | 1 / 4 | 5 | 1 / 0 | LOCKED, 2.0u, no badge (Δw=1 in v7.0) | LOCKED, 3.0u, TOP + SUPER |
| Σ=6 with HC against | 3 / 3 | 6 | 1 / 1 | LOCKED, 3.0u, SUPER | LOCKED, 3.0u, TOP only (HC dominance fails — HC_ag=1) |
| Σ=8 HC | 4 / 4 | 8 | 2 / 0 | ELITE, 4.0u, SUPER | ELITE, 4.5u (capped), TOP + SUPER |

The big behavioral shifts are: (1) Σ=3 picks with HC dominance start shipping at units, (2) Σ=5 picks with HC against the side lose their SUPER tag even though Δw≥+2, (3) ladder values rescale ×1.5 anywhere HC dominance is present.

---

## §4. Implementation plan

This is the order of operations. Every step is small and individually shippable behind a feature flag.

### §4.1 Step 0 — fix the v7.0 LEAN sizing leak (already drafted)

Independent of the v7.1 work, the v7.0 LEAN tier is broken in production. `Math.max(units, 0.5)` and the monotonic `peak.units` rule together force LEAN picks to ≥0.5u in three places:

- `syncPickToFirebase` (ML), SharpFlow.jsx:~1629
- `syncSpreadPickToFirebase`, ~1888
- `syncTotalPickToFirebase`, ~2022

**Fix.** Replace the unconditional clamp with a LEAN-aware one and bypass `peak.units` monotonic max when `lockTier === 'LEAN'`:

```js
const liveTier = lockTierFromDeltasV71(dw, dq, hcDominant);
const bumpedUnits = liveTier === 'LEAN' ? 0 : Math.min(Math.max(units, 0.5), 3);

// Allow peak.units to DECREASE only when transitioning into LEAN.
const writePeak = isReflip
  || liveTier === 'LEAN'                              // collapse to 0u
  || bumpedUnits > currentPeak
  || stars > currentPeakStars;
```

Backfill existing LEAN picks (`scripts/fixLeanTierSizing.js` already exists).

This step is independent of v7.1 and should land first.

### §4.2 Step 1 — introduce HC dominance in `computeWalletConsensus`

Edit the loop that computes forW/agW to also tally HC counts. New return fields:

```js
result.hcConfFor = 0;   // CONFIRMED ∧ sizeRatio ≥ 1.5 ∧ side=for
result.hcConfAg  = 0;   // CONFIRMED ∧ sizeRatio ≥ 1.5 ∧ side=against
result.hcDominant = false;
```

Population:

```js
for (const d of walletDetails) {
  if (!d?.wallet) continue;
  const tier = profileTier(d.wallet, sport);   // 'CONFIRMED' | 'FLAT' | ...
  const isFor = d.side === sideKey;
  if (tier === 'CONFIRMED' || tier === 'FLAT') {
    if (isFor) forW++; else agW++;
  }
  if (tier === 'CONFIRMED' && (d.sizeRatio ?? 0) >= 1.5) {
    if (isFor) result.hcConfFor++;
    else result.hcConfAg++;
  }
}
result.hcDominant = result.hcConfFor >= 1 && result.hcConfAg === 0;
```

`sizeRatio` is already on each walletDetails entry (SharpFlow.jsx:788), so no upstream changes.

**Constant.** Define at module-level:

```js
const HC_RATIO = 1.5;   // matches WALLET_GATE_SCALE_TEST.md and the original predictiveness study
```

### §4.3 Step 2 — rewrite `lockTierFromDeltas` → `lockTierFromDeltasV71`

```js
function lockTierFromDeltasV71(dw, dq, hcDominant) {
  if (!Number.isFinite(dw) || !Number.isFinite(dq)) return 'MUTED';
  if (dw < 1 || dq < 1) return 'MUTED';
  const sum = dw + dq;
  if (sum >= 7) return 'ELITE';
  if (sum >= 5) return 'LOCKED';
  if (sum >= 3) return hcDominant ? 'LOCKED' : 'LEAN';
  return 'MUTED';
}
```

Every existing caller site (`computeLiveSizing`, `decideLockStage`, `stampWalletConsensus`) takes a third arg threaded from the same `computeWalletConsensus` result. Health engine `evaluatePickHealth` is *unchanged*: a Σ ∈ {3,4} HC-dominant lock that decays past `Δq ≤ 0` still mutes correctly under the existing rules.

### §4.4 Step 3 — extend `stampWalletConsensus` with new persisted fields

```js
target.v8_hcConfFor    = wc.hcConfFor;
target.v8_hcConfAg     = wc.hcConfAg;
target.v8_hcDominant   = wc.hcDominant;
target.v8_lockTier     = lockTierFromDeltasV71(wc.delta, wc.qualityMargin, wc.hcDominant);
target.v8_topPick      = (target.v8_lockTier === 'LOCKED' || target.v8_lockTier === 'ELITE')
                            && (wc.delta + wc.qualityMargin) >= 5;
target.v8_superTopPick = (target.v8_lockTier === 'LOCKED' || target.v8_lockTier === 'ELITE')
                            && wc.hcDominant;
```

Bump `WHITELIST_CONSENSUS_VERSION` from `6` to `7` — every existing pick will be re-stamped on next sync via `needsConsensusRestamp`.

### §4.5 Step 4 — extend `calculateUnits` and `calculateSpreadTotalUnits`

Add `hcDominant` arg, fold it in *after* the tier override and odds clamp:

```js
function calculateUnits(stars, _cp, odds, _rb, lockTier, hcDominant = false) {
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

  if (hcDominant) units = Math.min(units * 1.5, lockTier === 'ELITE' ? 4.5 : 3.0);
  return Math.round(units * 100) / 100;
}
```

Same shape for spread/total with caps `1.75 / 3.0`.

The post-clamp HC multiplier is intentional — heavy favorites with HC dominance still respect the favorite cap, just at the upper bound.

### §4.6 Step 5 — replace `evaluateTopPickTier` with a derived view

```js
function evaluateTopPickTierV71(side) {
  return {
    isTopPick:       side?.v8_topPick === true,
    isSuperTopPick:  side?.v8_superTopPick === true,
  };
}
```

The function is now a pure lookup against the persisted stamps from §4.4, with no Δw threshold logic in the UI. Delete the old `evaluateTopPickTier` after one full sync cycle confirms every active pick has the new fields.

### §4.7 Step 6 — UI surface changes

1. **Star meter** — unchanged math; the live ladder already tracks Δw/Δq through `vaultStarFromDeltas`. HC dominance does *not* shift the star count (per "stars track skill consensus, units track conviction").
2. **Unit chip** — shows `1.5×` modifier badge inline when HC-dominant (`v8_hcDominant=true`). LEAN chips remain "LEAN — TRACKING" with 0u.
3. **Hero chips** (`renderHeroChips`) — extend tooltip to surface `(HC: 2 for · 0 against)` when `hcConfFor > 0 || hcConfAg > 0`.
4. **Badges** — TOP PICK reads `v8_topPick`; SUPER TOP PICK reads `v8_superTopPick`. Filled gold for SUPER, outlined gold for TOP.
5. **Promotion narration** — when a pick is HC-promoted out of LEAN at Σ ∈ {3,4}, surface a one-line tooltip: "Promoted to LOCKED via HC dominance (sharp confirmed wallets backing at high conviction)."
6. **Daily report bucketing** — `v8_lockTier` now distinguishes HC-promoted-LEANs from standard LOCKEDs. Update `dailyV6Report.js` to add a new `LOCKED_BY_HC` bucket so we can monitor it as a distinct cohort.

### §4.8 Step 7 — feature flag and rollout

```js
const V7_1_HC_DOMINANCE_ENABLED = true;
```

When `false`, `lockTierFromDeltasV71` falls back to the v7.0 tier (Σ≥+5), `hcDominant` is forced to false in unit calc, badges fall back to the legacy `Δw ≥ +2` rules, and only the new firestore fields keep being written (so analytics persist regardless). This gives us a one-line revert without a deploy roll-back.

**Rollout sequence:**

1. Day 0 — ship the LEAN sizing fix (§4.1) + HC dominance plumbing (§4.2 / §4.3 / §4.4) with `V7_1_HC_DOMINANCE_ENABLED = false`. Stamps go to firestore but no UI/sizing changes user-visible.
2. Day 1 — verify stamps look right against `WALLET_GATE_SCALE_TEST.md` numbers for live picks; spot-check 5 picks per sport.
3. Day 2 — flip to `true` for staging / a single user account; live-watch one slate.
4. Day 3 — flip to `true` everywhere. Daily report's new `LOCKED_BY_HC` cohort goes live.
5. Day 14 — re-run `walletGateScaleTest.js` on the post-v7.1 sample and confirm the HC dominance lift still sits at +25pp+ per bucket. If it has degraded to <+10pp, we revert per §6.

---

## §5. What we expect to see in production

Based on the 13-day sample (90 picks, 5/5 buckets show positive lift), here's the deployment forecast:

### §5.1 Volume

```
v7.0 (today)         baseline:  ~6.9 LOCKED + ~2.7 LEAN per day = 9.6 picks/day
                                   39% of LOCKED were Σ ∈ {5,6}, 28% ELITE, 33% other
v7.1 forecast:                ~8.7 LOCKED (incl. HC-promoted LEANs) + ~0.9 LEAN per day
                                   24/90 picks would HC-promote out of LEAN (~1.8 picks/day)

Daily volume change:    +1.8 picks/day shipped (was LEAN, now LOCKED via HC)
Volume reduction:       0  (no picks lost to v7.1)
```

### §5.2 Bankroll exposure

24 of 90 picks (27%) are HC-dominant in the historical sample. Their distribution by Σ:

| Σ | HC count | Avg ladder unit | v7.0 units (sum) | v7.1 units (sum) | Δ |
|---|---|---|---|---|---|
| Σ=3 | 3 | 0.75u | 0u (LEAN) | 1.13u × 3 = 3.39u | +3.39u |
| Σ=4 | 6 | 0.75u | 0u (LEAN) | 1.13u × 6 = 6.78u | +6.78u |
| Σ=5 | 2 | 2.00u | 4.00u | 3.00u × 2 = 6.00u | +2.00u |
| Σ=6 | 3 | 3.00u | 9.00u | 4.50u × 3 = 13.50u | +4.50u |
| Σ≥7 | 10 | 4.00u | 40.00u | 4.50u × 10 = 45.00u | +5.00u |

Total bankroll bump in the 13-day sample: **+21.7u of new exposure**, of which +10.2u is on Σ ∈ {3,4} HC-promoted picks and +11.5u is multiplier on existing LOCKEDs/ELITEs.

### §5.3 Expected PnL impact (replay on the 13-day sample)

Applied counterfactually to the 90-pick sample:

| Cohort | N | v7.0 flat PnL | v7.1 flat PnL | Δ |
|---|---|---|---|---|
| Σ ∈ {3,4} HC-promoted | 9 | 0u (was LEAN) | +5.69u | **+5.69u** |
| Σ ∈ {5,6} HC | 5 | +12.06u | +18.09u (×1.5) | +6.03u |
| Σ ≥ 7 HC | 10 | +25.27u | +37.91u (×1.5 capped) | +12.64u |
| Non-HC LOCKEDs | 24 | +5.16u | +5.16u | 0 |
| Non-HC ELITEs | 11 | +12.71u | +12.71u | 0 |
| LEAN (non-HC) | 31 | 0u | 0u | 0 |
| **Total** | **90** | **+55.20u** | **+79.56u** | **+24.36u peak** |

That's a **+44% lift on peak PnL** with no volume reduction. The lift is concentrated in three places: HC-promoted Σ ∈ {3,4} (free pickup), HC LOCKEDs, and HC ELITEs.

### §5.4 Risk

- **Concentration risk.** Daily exposure of 4.5u (max ML) per ELITE+HC pick. With ~0.8 ELITE+HC picks/day historical, daily peak exposure rises by ≈3.5u vs v7.0. This is below half-Kelly for a 2% bankroll user.
- **HC drought risk.** If a slate has no HC dominance (rare in MLB/NBA, common-ish in NHL), v7.1 reverts to v7.0 behavior on that slate — no downsize.
- **Sample size.** 13 days is short. The 5/5-bucket consistency is what gives us confidence the rule scales; the magnitude (+34.7pp) could compress to +15–20pp at production scale. v7.1 still books a positive expected lift even at +10pp.

---

## §6. Monitoring and revert

Two explicit tripwires that automatically kick to a revert decision:

### §6.1 Tripwire A — gate-scale degradation

Re-run `scripts/walletGateScaleTest.js` weekly. Fail conditions, in any order:

1. HC dominance positive lift drops below 4 of 5 Σ buckets, **AND**
2. pooled lift_WR drops below +10pp, **AND**
3. the trailing 14-day flat ROI on `LOCKED_BY_HC` cohort < flat ROI on standard LOCKEDs.

If 2 of 3 fire, set `V7_1_HC_DOMINANCE_ENABLED = false` and post-mortem.

### §6.2 Tripwire B — cell-level PnL

`LOCKED_BY_HC` cohort drops below −10u flat across a 14-day rolling window with N ≥ 12. Same revert action.

### §6.3 What we'll see in the daily report

`dailyV6Report.js` gains a §7c table:

```
§7c. v7.1 HC dominance cohort
  cohort                  N     W-L     WR     flat ROI    peak PnL
  LOCKED (Σ≥+5, no HC)    —     —       —      —           —
  LOCKED (Σ≥+5, HC)       —     —       —      —           —
  LOCKED_BY_HC (Σ∈3,4)    —     —       —      —           —
  ELITE (no HC)           —     —       —      —           —
  ELITE+HC                —     —       —      —           —
```

Filterable by sport. The `LOCKED_BY_HC` row is the canary — if HC promotion is real signal, it should track or exceed the standard LOCKED row.

---

## §7. Code-change checklist

Concrete edits, by file:

### `nhl-savant/src/pages/SharpFlow.jsx`

- [ ] Line 612 — replace `lockTierFromDeltas(dw, dq)` with `lockTierFromDeltasV71(dw, dq, hcDominant)`. Keep a thin compat wrapper that defaults `hcDominant=false` for any legacy caller during one rev.
- [ ] Lines 985–986 — bump `WHITELIST_CONSENSUS_VERSION = 7`. Add `const HC_RATIO = 1.5;` directly underneath.
- [ ] Lines 1027–1117 — extend `computeWalletConsensus` to populate `hcConfFor`, `hcConfAg`, `hcDominant` (§4.2).
- [ ] Lines 1107–1113 — keep `wc.promotionEligible = true` when `Σ ≥ +3 ∧ both axes ≥ +1`. Promotion path is unchanged; what HC dominance changes is the *tier* (LOCKED vs LEAN), not the *write*.
- [ ] Line 331 — extend `calculateUnits` signature with `hcDominant` and apply ×1.5 multiplier (§4.5).
- [ ] Line 1227 — extend `calculateSpreadTotalUnits` similarly.
- [ ] Line 1253 — `computeLiveSizing` threads `hcDominant` from a fresh `computeWalletConsensus` (since live recomputes against current Δ's anyway).
- [ ] Line 1416 — replace `evaluateTopPickTier` body with the simple field lookup (§4.6).
- [ ] Lines 1459–1485 — extend `stampWalletConsensus` to write `v8_hcConfFor`, `v8_hcConfAg`, `v8_hcDominant`, `v8_topPick`, `v8_superTopPick` (§4.4).
- [ ] Lines 1629 / 1888 / 2022 — apply LEAN sizing fix from §4.1.
- [ ] Search-and-replace every UI reference to `evaluateTopPickTier(...)` to use the new field reads instead of recomputing.

### `nhl-savant/scripts/`

- [ ] `dailyV6Report.js` — add §7c table per §6.3.
- [ ] `walletGateScaleTest.js` — add a `--monitor` flag that pulls only the trailing 14 days for tripwire-A automation.
- [ ] `fixLeanTierSizing.js` — re-run after the §4.1 fix lands to backfill any picks the live UI hasn't re-synced.
- [ ] `backfillHcDominance.js` (new) — one-shot script that walks every doc with `v8_walletConsensusVersion < 7` and re-stamps `v8_hcConfFor / v8_hcConfAg / v8_hcDominant / v8_topPick / v8_superTopPick`. Mirrors the existing restamp paths.

### `nhl-savant/SHARP_INTEL_V7_1_PLAYBOOK.md`

- [ ] (this file) — keep updated as we ship steps. Add a "deployed" status header when each step lands.

---

## §8. What this does NOT change

To prevent scope creep, the things v7.1 explicitly leaves alone:

- The Δw/Δq math (`computeWalletConsensus` for the legacy fields) — unchanged.
- The whitelist-tier classifier (`exportWalletProfiles.js`) — unchanged.
- The `QUALITY_CONTRIB_CUT = 30` cutoff — unchanged.
- The `evaluatePickHealth` mute/cancel rules — unchanged. HC promotion does NOT add a new mute condition; if a HC-promoted Σ=3 pick decays to Δq=0 it mutes via the existing `quality_below_floor` rule.
- The Sharp Vault — explicitly out of scope. v7.1 is a Sharp Intel patch only. Any Sharp Vault sizing rework should be tracked separately.
- The base star ladder (`vaultStarFromDeltas`) — unchanged. HC dominance is a *unit* multiplier, not a *star* boost.
- The daily report's existing §7a/§7b sections — unchanged additive.

---

## §9. Open questions / followups

These are deliberately deferred:

1. **Should `HC_RATIO` be tuned per sport?** The current 1.5× threshold came from MLB/NBA aggregate. NHL has tiny sample (no NHL HC-dominant picks in the 13-day window). Re-evaluate after 30 days.
2. **Should HC dominance also trigger an extra star (4.5★ → 5.0★)?** Today HC only multiplies units. The argument for promoting stars too is that the badge already promotes (TOP → SUPER), so the star meter visibly catches up. The argument against is that stars track lock-tier, not conviction; re-binding stars to conviction breaks an invariant. Park.
3. **Should we add a HC-against-the-side fade rule?** I.e., a pick with `HC_ag ≥ 2 ∧ HC_for = 0` automatically MUTEs even if Δw ≥ +1. The data would support it (those picks went 0-2 in our sample) but N is too small. Revisit at 30 days.
4. **Hidden winners (Source-B-only wallets).** From `hiddenWinners.js` we identified 12 wallets profitable in `sharp_action_positions` but not yet visible to the v7 Δw because they're not whitelisted. This is independent of v7.1 and tracked separately.

---

## §10. References

- `WALLET_GATE_SCALE_TEST.md` — the per-Σ scale test that motivates v7.1.
- `WALLET_PREDICTIVENESS_PLAYBOOK.md` — the original tier-predictiveness analysis.
- `WALLET_FEATURE_PREDICTIVENESS.md` — raw feature predictiveness output.
- `WALLET_PREDICTIVENESS_BACKTEST.md` — first counterfactual replay (TIGHTEN/LOOSEN/REPLACE).
- `V6_FULL_ANALYSIS.md` — v7.0 cohort edge analysis (the source for the Σ ≥ +5 floor).
- `FLOOR_LOWERING_TIER_GATES.md` — explored tier-gated floor lowering, found HC dominance.
- `WALLET_PREDICTIVENESS_SIZING.md` — explored purity-class sizing tilt; superseded by the simpler HC-dominance multiplier here.

---

## Appendix A — quick-reference flowchart

```
┌── computeV8WalletScoring(positions, sport) ─────────┐
│   stamps walletDetails[].sizeRatio                  │
└────────────────────┬────────────────────────────────┘
                     ▼
┌── computeWalletConsensus(walletDetails, sport, side) ┐
│   forW, agW, Δw                                       │
│   qFor, qAg, Δq                                       │
│   hcConfFor, hcConfAg, hcDominant   ← NEW             │
│   promotionEligible (unchanged)                       │
└────────────────────┬──────────────────────────────────┘
                     ▼
┌── lockTierFromDeltasV71(Δw, Δq, hcDominant) ─────────┐
│   ELITE  : Σ ≥ +7                                     │
│   LOCKED : Σ ≥ +5  OR  (Σ ∈ {3,4} ∧ hcDominant)       │
│   LEAN   : Σ ∈ {3,4} ∧ ¬hcDominant                    │
│   MUTED  : everything else                            │
└────────────────────┬──────────────────────────────────┘
                     ▼
┌── calculateUnits(stars, ..., lockTier, hcDominant) ──┐
│   tier-driven base (LEAN→0, ELITE→4.0, ladder)        │
│   odds clamp                                          │
│   × 1.5 if hcDominant (capped 4.5 ML / 3.0 S+T)       │
└────────────────────┬──────────────────────────────────┘
                     ▼
┌── stampWalletConsensus(target, ...) ──────────────────┐
│   writes v8_hcConfFor, v8_hcConfAg, v8_hcDominant     │
│   writes v8_lockTier                                  │
│   writes v8_topPick, v8_superTopPick   ← NEW          │
└────────────────────┬──────────────────────────────────┘
                     ▼
┌── UI ─────────────────────────────────────────────────┐
│   star meter:  vaultStarFromDeltas (unchanged)        │
│   unit chip:   live sizing (HC bump visible)          │
│   badges:      v8_topPick / v8_superTopPick           │
│   health:      evaluatePickHealth (unchanged)         │
└───────────────────────────────────────────────────────┘
```

---

## Appendix B — single-pass implementation diff (high-level)

If we ship the whole thing at once instead of behind a flag, the diff is approximately:

```
SharpFlow.jsx
  + const HC_RATIO = 1.5;                                              [+1 line]
  + const V7_1_HC_DOMINANCE_ENABLED = true;                            [+1 line]
    WHITELIST_CONSENSUS_VERSION: 6 → 7                                 [edit]
  ~ computeWalletConsensus: +3 fields, +1 loop branch                  [~10 lines]
  ~ lockTierFromDeltas → lockTierFromDeltasV71                         [~4 lines]
  ~ calculateUnits + calculateSpreadTotalUnits: +arg, +mult            [~6 lines each]
  ~ computeLiveSizing: threads hcDominant                              [~2 lines]
  - evaluateTopPickTier (legacy)                                       [-12 lines]
  + evaluateTopPickTierV71 (lookup)                                    [+5 lines]
  ~ stampWalletConsensus: +5 stamped fields                            [~6 lines]
  ~ syncPickToFirebase × 3 (LEAN sizing fix)                           [~4 lines each]
  ~ renderHeroChips: tooltip line                                      [~2 lines]

dailyV6Report.js
  + §7c HC cohort table                                                [~40 lines]

scripts/backfillHcDominance.js (new)                                   [~80 lines]
```

Total: ~180 lines net add across one source file + one report + one new script. No new dependencies. No schema migrations beyond Firestore additive fields.
