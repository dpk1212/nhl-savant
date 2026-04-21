# Sharp Flow — Whale Intel & Sharp Tracker System

## Part 1: How It Works (For Bettors)

### What is Sharp Flow?

Sharp Flow is a real-time intelligence system that tracks what the **sharpest sports bettors on the planet** are actually betting on — then cross-references that with sportsbook pricing to find **positive expected value (+EV) opportunities** you can act on.

Unlike tout services that sell picks based on opinions, Sharp Flow is built on **blockchain-verified betting data**. Every bet placed on Polymarket is publicly recorded on-chain. We identify the wallets with the best lifetime track records, monitor their positions, and surface the plays they're making on today's games.

### The Data Pipeline — Where Signals Come From

**1. Finding the Sharps**

We scan the top 1,500 entries on the Polymarket sports leaderboard, profile every wallet's positions, and **rank them purely by sport P&L** — the sum of profit/loss across all sports markets (NHL, CBB, NBA, NFL, MLB). We take the **top 250 wallets with $5K+ sport P&L**. These are the most profitable *sports* bettors on the platform, not just high-volume generalists. Sharp Flow currently tracks **four sports**: NHL, CBB, MLB, and NBA.

This list is rebuilt twice a day by a dedicated `seedSportsSharps.js` pipeline and stored in `sports_sharps.json`. Because qualification is based solely on verified sport profit, there is no need for market-maker scoring or tier-based filtering — every wallet in the file is pre-qualified.

**Legacy tiers** (still used as a fallback if `sports_sharps.json` is unavailable):

| Tier | Criteria | What It Means |
|------|----------|---------------|
| **ELITE** | $100K+ lifetime profit, 50+ markets | Best of the best — consistently profitable across hundreds of bets |
| **PROVEN** | $25K+ lifetime profit, 20+ markets | Strong track record with meaningful sample size |
| **ACTIVE** | $5K+ lifetime profit, 10+ markets | Profitable but smaller sample |
| **DEGEN** | -$50K or worse lifetime | Large losing wallet — we fade (bet against) these |
| **LOSING** | -$10K or worse lifetime | Losing wallet — also faded |

**2. Tracking Their Bets**

Every 15 minutes, we scan what positions these sharp wallets hold on today's games. We're not just looking at new trades — we see **all open positions**, including bets placed days ago. This gives us a complete picture of where the smart money sits.

**3. Cross-Referencing with Sportsbook Odds**

Simultaneously, we pull real-time odds from 5 books:
- **Pinnacle** — the sharpest book in the world (our "fair value" benchmark)
- **DraftKings, FanDuel, BetMGM, Caesars** — retail books where you actually bet

When the best retail price beats Pinnacle's implied probability, that's a **+EV edge**. When sharps are also positioned on that side, the signal strengthens.

**4. Prediction Market Price Movement**

We track the Polymarket moneyline price over 24 hours. If the price is moving in the same direction as the sharp consensus, that's additional confirmation. If it's moving against, it's a caution flag.

### How Plays Get Rated & Locked In

Every game with sharp positions is scored using the **V8 wallet-contribution star rating system** — a wallet-first model that scores each bettor's quality (ROI, rank, P&L), scales it by bet-size conviction, and computes a side-vs-side WalletPlayScore. See `STAR_RATING_SYSTEM.md` for the full specification.

**Core architecture:**
- **Per-wallet scoring**: WalletBase (60% ROI + 25% Rank + 15% PnL) × ConvictionMultiplier (log bet-size ratio)
- **Side netting**: ForSide − 0.85 × AgainstSide, divided by 100 for scale parity
- **Breadth + Concentration**: 2×ln(1+count) bonus, concentration penalty (4×TopShare for ≤2 wallets, 5× for 3+)
- **During pregame updates**: Progressively replaces the quality proxy with actual Pinnacle line movement (`liveCLV`) as market evidence becomes available

The raw score is mapped to a **0.5–5.0 star rating** using fixed percentile thresholds. A play becomes visible (SHADOW) when it meets the star + invested gates, and is **LOCKED IN** when either the market regime confirms OR a **STRONG contribution tier** fires (see "Contribution-Tier Promotion" below).

**SHADOW gate (minimum to write to Firebase at all):**

| Market | Star Threshold | Min Invested (baseline) | Min Invested (STRONG/STANDARD contribTier) | Min Wallets |
|--------|---------------|--------------------------|---------------------------------------------|-------------|
| **Moneyline** | >= 2.5 stars | **$5,000** | **$2,500** | — |
| **Spread** | >= 2.5 stars | **$5,000** | **$2,500** | **2 wallets** |
| **Total (O/U)** | >= 2.5 stars | **$5,000** | **$2,500** | **2 wallets** |

The $2,500 relaxed floor is enabled by `minInvestedFloor(contribTier)` so picks with a strong qualified-sharp signal aren't rejected for modest aggregate dollars. **No bet is EVER written to Firebase unless these minimums are met.** This is enforced at the lock-decision level in `SharpFlow.jsx`.

**LOCKED promotion (two paths, additive):**

1. **Regime path (unchanged):** `regime ∈ {CLEAR_MOVE, NEAR_START}` — Pinnacle has moved in our direction.
2. **Contribution path (new, 2026-04-20):** `contribTier === 'STRONG'` — enough wallets with contribution ≥ 50 agree that the qualified-sharp signal itself justifies a lock.

If either path fires, `lockStage = 'LOCKED'` and `promotedBy` is recorded on the side document as `'regime'` or `'contribution'`. Otherwise the pick remains `SHADOW`.

### V8 Key Changes (2026-04-16)

1. **Wallet-contribution architecture** — Replaces V7 z-score model. Each wallet is scored individually (WalletBase × ConvictionMultiplier), then sides are netted.
2. **ROI-driven skill scoring** — WalletBase weights: 60% ROI, 25% Rank, 15% PnL (with rank) or 65% ROI, 35% PnL (fallback). Reduces PnL/Rank overlap (93% Spearman correlation).
3. **Multiplicative conviction** — Bet size vs average is a multiplier (log transform, clipped 0.70–1.60), not an additive feature. A great bettor betting big amplifies the signal.
4. **Side-vs-side scoring** — WalletPlayScore = NetEdge/100 + 2×ln(1+count) − concCoeff×TopShare (4 for ≤2 wallets, 5 for 3+). All components on comparable scales.
5. **Regime decoupled** — Regime detection still gates lock/shadow but no longer affects star numbers. No dampening, no caps based on market movement.
6. **Single-wallet cap** — Hard cap at 2.5 stars for single-wallet plays (requires WPS ≥ p78). Whale override (invested ≥ $25K AND sportPnl ≥ $500K) raises cap to 3.5.
7. **Forward-only rollout** — All existing Firebase picks retain V7 ratings. V8 applies only to new picks.

See `STAR_RATING_SYSTEM.md` for the full mathematical specification.

### V8.1 Contribution-Tier Promotion (2026-04-20)

Quant analysis of the V8-era picks (`scripts/qualifiedSharpDeepDive.js` → `V8_GOLDILOCKS_REPORT.md`, and `scripts/contributionEdgeMap.js` → `V8_CONTRIBUTION_EDGE.md`) surfaced a single composite metric with the strongest small-sample edge:

```
contribution_i = walletBase_i × convictionMult_i
```

(i.e. wallet quality × bet-size conviction — exactly what goes into WPS per wallet, just exposed as a per-wallet scalar.)

Rather than hand-tuning a new threshold, each pick is classified into a **contribTier** based on how many `for`-side and `against`-side wallets clear `contribution ≥ 50`:

| contribTier | Rule (with `qFor = #{wallets for, contrib≥50}`, `qAg = #{against, contrib≥50}`, `margin = qFor − qAg`) | Action |
|-------------|--------------------------------------------------------------------------------------------------------|--------|
| **STRONG** | `(qFor ≥ 3 AND qAg = 0)` **OR** `(qFor ≥ 2 AND margin ≥ +1)` | Relax min-invested to $2.5K; **promote to LOCKED** (if not already locked by regime) |
| **STANDARD** | `qFor ≥ 1 AND margin ≥ +1 AND maxContrib_for ≥ 50` | Relax min-invested to $2.5K; stays SHADOW (unless regime promotes it) |
| **LEAN** | Anything else that survives the SHADOW gate | Baseline $5K floor; SHADOW |
| **MUTE** | `margin < 0` (qualified counter-sharps outnumber qualified backers) | Recorded for future use; **no automatic suppression yet** (too small a sample) |

Implementation lives in three helpers at the top of `SharpFlow.jsx`:

- `classifyContributionTier(v8Scoring, sideKey)` — returns the tier label.
- `decideLockStage(regime, v8Scoring, sideKey)` — single source of truth; returns `{ stage: 'LOCKED' | 'SHADOW', contribTier, promotedBy: 'regime' | 'contribution' | null }`.
- `minInvestedFloor(contribTier)` — returns `2500` for STRONG/STANDARD, else `5000`.

Every pick written to Firebase now carries `contribTier` and `promotedBy` at the side-document level so we can monitor whether contribution-promoted picks hold their edge on a larger live sample before tightening the rules further. MUTE is deliberately data-only for now — we record it, we do not act on it.

Daily report automation: the `.github/workflows/daily-contribution-edge.yml` workflow re-runs both deep-dive scripts every morning at 08:30 ET and commits `V8_CONTRIBUTION_EDGE.md` + `V8_GOLDILOCKS_REPORT.md` to the repo so the thresholds can be retuned as the sample grows.

### Unit Sizing

Units are derived directly from the star rating using a compressed scale:

**ML Unit Sizing (1–3u):**

| Star Rating | Base Units | Tier |
|-------------|-----------|------|
| 5.0 | 3.0u | MAX |
| 4.5 | 2.5u | MAX |
| 4.0 | 2.0u | STRONG |
| 3.5 | 1.5u | STRONG |
| 3.0 / 2.5 | 1.0u | STANDARD |

Dog caps (ML): +200 -> max 0.5u, +151 -> max 1.0u, +100 -> max 2.0u. Maximum: **3.0u**.

**Spread/Total Unit Sizing (0.5–2u):**

| Star Rating | Base Units |
|-------------|-----------|
| 5.0 | 2.0u |
| 4.5 | 1.5u |
| 4.0 | 1.25u |
| 3.5 | 1.0u |
| 3.0 | 0.75u |
| 2.5 | 0.5u |

Dog caps (Spread/Total): +200 -> max 0.5u, +151 -> max 0.75u, +100 -> max 1.0u. Maximum: **2.0u**.

A consensus penalty (up to -1.0u for CONTESTED) is applied after the base.

**V8.2 + V8.3 Sizing Modifiers (2026-04-21):** Three independent signals are summed in `computeRegimeBonus(regime, v8Scoring, sideKey)` and added to the base star units *before* the odds caps:

| Signal | Rule | Applies to |
|---|---|---|
| `clearMoveSizeBonus` (V8.2) | `regime === 'CLEAR_MOVE'` → **+0.5u** | all picks |
| `qualityBonus` (V8.3) | `meanBase_F ≥ 55` → **+0.25u** · `< 50` → **−0.25u** · 50–55 neutral | all picks (regime-agnostic) |
| `nearStartMaxRoiBonus` (V8.3) | `regime === 'NEAR_START'` AND `maxRoiN_F ≥ 70` → **+0.25u** · `50–70` → **−0.25u** | NEAR_START only |

Max positive stack = **+0.75u** (CLEAR_MOVE + high-quality wallets). Max negative stack = **−0.50u** (weak wallets + NEAR_START toxic band). Long-shot odds caps (+200 / +151 / +100) and the hard `[0.5u, 3u]` (ML) / `[0.5u, 2u]` (Spread/Total) clamp still win after the stack.

**Evidence summary (N=42 V8 graded):**

| Signal | Best bucket | Worst bucket | Regime-specific? |
|---|---|---|---|
| CLEAR_MOVE | N=11, 72.7% WR, +29.5% ROI (whole regime) | — (every sub-partition profitable) | yes, market |
| meanBase_F | N=14, 71.4% WR, +33.9% ROI (≥55) | N=20, 30.0% WR, −35.6% ROI (<50) | **no — monotonic in every regime** |
| maxRoiN_F (NEAR_START only) | N=11, 63.6% WR, +42.6% ROI (≥70) | N=10, 20.0% WR, **−60.2% ROI** (50–70) | yes, signal weak outside NEAR_START |

`meanBase_F` is the strongest standalone separator in the V8 dataset, which is why it applies regardless of regime. `maxRoiN_F` is elite-wallet ROI percentile — it only lights up inside NEAR_START, so we gate it.

**Deprecated — starDelta Top Pick Bonus:** The old `+0.25 / +0.5u` bump triggered by `starDelta ≥ 1.0` during pregame promotion has been **removed**. In production it rarely fired (large mid-cycle star jumps are uncommon), so regime was effectively absent from sizing. V8.2/V8.3 replace it with signals that actually show up every day.

**V8.4 — TOP PICK UI badge (replaces legacy starDelta rule):** The gold ⚡ TOP PICK ribbon on `LockedPickCard` (Locked Picks list) is no longer driven by `starDelta ≥ 1.0`. It now requires the **stacked-edge** combination:

```
isTopPick ⇔ regime === 'CLEAR_MOVE' AND meanBase_F ≥ 55
```

Rationale — each piece is independently profitable in V8 data, but the intersection is where the strongest, most repeatable edge lives:

| Requirement | Evidence |
|---|---|
| `regime === 'CLEAR_MOVE'` | N=11, 72.7% WR, +29.5% flatROI (every sub-partition profitable) |
| `meanBase_F ≥ 55` | N=14, 71.4% WR, +33.9% flatROI (works in every regime) |

The old rule selected picks whose stars grew, but ignored whether the growth was **market-confirmed** (regime) or backed by **high-caliber wallets** (meanBase_F). Those are the two signals that actually correlate with winning. A pick can grow in stars through wallet churn on mid-tier sharps and still lose — the old badge celebrated that, the new one does not.

The sort comparator on the Locked Picks list uses the same predicate (`isClearMoveTopPick`), so cards wearing the TOP PICK ribbon always float to the top of the list (after health ordering).

Pre-V8 picks (no `regime` or `v8Scoring` on the lock/peak snapshot) fall through to `false` and never display the badge — expected behavior since we can't evaluate the new criteria on them.

**Implementation:** `src/pages/SharpFlow.jsx` → `isClearMoveTopPick({ regime, meanBaseF })` helper, consumed by both `LockedPickCard` (badge) and the locked-list sort comparator. `meanBase_F` is computed per-pick from `v8Scoring.walletDetails` filtered to `side === consensusSide` at the time the snapshot was written.

### Pick Health Evaluation (Mute / Cancel System)

Once a pick is locked, the **V8-native health system** continuously re-evaluates
whether it should remain active. Evaluation runs on every React render of the
pick's `SharpPositionCard` (~every position-refresh cycle) and uses the continuous
**WalletPlayScore (WPS)** — the same score that drives star ratings — instead of
comparing discrete star buckets (which is how V7 did it, and which rarely
triggered in practice).

The output is a `health` object with one of three statuses: **ACTIVE** (normal
locked pick), **MUTED** (visible but dimmed, advisory only), or **CANCELLED**
(dimmed + reason shown, effectively retired). The status is mirrored into
Firebase so downstream consumers (Sharp Vault, Scan, reports) see the same view.

---

**Design principles**

1. **No mute while in lock range.** If `currentWPS >= 0.0` (the 2.5-star / lock
   threshold = `LOCK_RANGE_WPS`), the pick stays ACTIVE regardless of how far it
   dropped from its peak WPS. We deliberately do not downgrade on peak-retrace
   alone — the pick was locked on its own merit, and we'd rather leave it alone
   than chase noise.
2. **Mute only when below lock range.** If WPS drops below 0.0 and no side flip
   has occurred, the pick is MUTED. It stays visible so the user can see the
   degradation; it's advisory, not automatic exit.
3. **Side flip requires beating a ratcheting threshold.** A flip is only
   accepted if the new side's WPS exceeds `flipBeatThreshold`. Each accepted
   flip ratchets the threshold higher, preventing back-and-forth flip-flop when
   both sides hover around the same WPS.
4. **Stars remain the UI display.** Health logic uses WPS internally; users see
   stars / labels.
5. **Do not act inside the 20-minute game window.** Near the close, market
   noise and late-hammer action are normal; overriding a lock at that point
   usually makes things worse.

---

**Inputs consumed (per evaluation)**

`evaluatePickHealth({ currentWPS, lockWPS, sideFlipped, newSideWPS, flipBeatThreshold, timeToGame, currentStars })`

| Input | Source | Meaning |
|---|---|---|
| `currentWPS` | `rateStarsV8({ positions, consensusSide })` at render time | Live score for the **currently-picked side** |
| `lockWPS` | `lockWPSRef.current` (set on first lock) | WPS that was present when the pick first locked |
| `sideFlipped` | `lockedSideRef.current != null && consensusSide !== lockedSideRef.current` | True **only** if our computed `consensusSide` now disagrees with the stored locked side |
| `newSideWPS` | `rateStarsV8({ positions, consensusSide: oppSide })` | Score for the side that's now leading the consensus calc |
| `flipBeatThreshold` | `flipBeatThresholdRef.current` (ratcheted each accept) | The bar the opposing side must clear for a flip |
| `timeToGame` | `(commenceTime − Date.now()) / 60000` | Minutes to first pitch / puck drop |
| `currentStars` | `sr.stars` | Star count at current WPS — forwarded so Firebase keeps a readable snapshot |

`consensusSide` itself is computed from the game's aggregated sharp positions
(wallet-weighted, side that the majority of wallet-weighted invested-$ is on) —
so a "flip" means the majority wallet-weighted money has actually switched
sides, not simply that dollar totals tilted.

---

**Decision table (in order, V8.4+)**

`currentWPS` below is always the **locked side's** current WPS, not the
current-consensus-side WPS — the call site resolves this before invoking
`evaluatePickHealth`. `oppSideWPS` is the opposite-of-locked side's WPS.

| # | Condition | Status | Reason code |
|---|---|---|---|
| A | `currentWPS == null` | `ACTIVE` | (no score yet) |
| B | `timeToGame > 20` AND `oppSideWPS > flipBeatThreshold` AND `oppSideWPS − currentWPS ≥ 0.5` | **`CANCELLED`** | `side_flipped` (if wallet-count consensus also flipped) OR `opp_side_dominates` |
| C | `timeToGame > 20` AND `oppSideWPS > 0.0` AND `oppSideWPS − currentWPS ≥ 1.0` (but B not met) | **`MUTED`** | `opp_side_stronger` (advisory — ratchet not beaten yet) |
| D | `sideFlipped` AND `timeToGame > 20` AND `currentWPS < 0.0` (B & C not met) | **`MUTED`** | `flip_rejected`, `below_lock_range` |
| E | `sideFlipped` AND `timeToGame > 20` AND `currentWPS ≥ 0.0` (B & C not met) | `ACTIVE` | `flip_rejected` |
| F | `currentWPS ≥ 0.0` (no dominance, no flip concern) | `ACTIVE` | — |
| G | `currentWPS < 0.0` | **`MUTED`** | `below_lock_range` |

Constants: `LOCK_RANGE_WPS = 0.0`, `OPP_CANCEL_GAP = 0.5`, `OPP_MUTE_GAP = 1.0`.

Note: checks B and C run whether or not the wallet-count `consensusSide` has
flipped. This is the V8.4 fix — we no longer gate opposing-wave detection
behind a naive wallet-count majority (which under-reacts to late
high-conviction waves from fewer but larger-base sharps).

The 20-minute `tooCloseForFlip` guard skips all flip/dominance checks —
inside that window, only the terminal `currentWPS < 0.0 → MUTED` still fires.

---

**Ratcheting flip mechanism**

The flip threshold starts at the WPS the pick locked at and never retreats,
preventing flip-flop near the threshold.

| Step | Event | `flipBeatThreshold` | `lockedSideRef` | Result |
|---|---|---|---|---|
| 1 | Side A locks at WPS = 2.5 | 2.5 | A | ACTIVE on A |
| 2 | Side B's WPS climbs to 2.7 | 2.5 | A | flip attempted → 2.7 > 2.5 → **CANCELLED (flip to B)**; threshold ratchets to 2.7; new lock created on B |
| 3 | Side A's WPS returns to 2.8 | 2.7 → 2.8 | B (then A) | flip attempted → 2.8 > 2.7 → CANCELLED on B, new lock on A; threshold → 2.8 |
| 4 | Side B nudges back to 2.9 | 2.8 → 2.9 | A → B | flip accepted again; threshold → 2.9 |
| 5 | Side A tries 2.85 | 2.9 | B | 2.85 < 2.9 → rejected; A stays `ACTIVE` under `flip_rejected` |

The ratchet is per-document — each game/market pair has its own threshold —
and persists to Firebase so reloads don't lose history.

---

**What does and does NOT trigger a cancel/mute**

**Does trigger (V8.4+):**

- A late opposing-side wave that lifts the opposite side's WPS above the
  ratcheting `flipBeatThreshold` AND at least 0.5 WPS above the locked side
  → **CANCELLED** (reason `opp_side_dominates`, or `side_flipped` when wallet
  count also tipped). Example: a pick locks on Side A at WPS = 2.5
  (threshold = 2.5); Side B accumulates heavy-conviction sharps and reaches
  WPS = 3.3 while Side A drifts to 2.6 → opp beats threshold (3.3 > 2.5) AND
  is 0.7 above locked (≥ 0.5 gap) → CANCELLED.
- An opposing-side wave that is materially stronger (≥ 1.0 WPS gap) and
  above the 0.0 lock threshold, but **hasn't** beaten the ratchet yet →
  **MUTED** (reason `opp_side_stronger`). Advisory, not a cancel.
- The locked side's own WPS dropping below 0.0 while outside the 20-min
  window → **MUTED** (`below_lock_range`).

**Does NOT trigger:**

- **Pinnacle moving away from the pick** (RLM, counter-move). Health reads
  WPS, not line movement directly. Line movement only matters where it was
  already priced into WPS via regime / CLV.
- **Public money or ticket % flipping.** Health is a sharp-wallet signal.
- **A drop from peak WPS** while still in lock range. We explicitly do not
  react to peak retraces.
- **Opposing wave that is loud in $invested but doesn't move opp-side WPS**
  (e.g. a single wallet with low historical base pumping big $). WPS weights
  size by a wallet's *own* historical average, so raw volume without quality
  won't clear the ratchet.

If a card you expect to be CANCELLED is still ACTIVE, check the console for
the opposing-side WPS — the gap may be under 0.5 or the opp side may not have
cleared the ratchet yet.

---

**State & persistence**

React refs (per `SharpPositionCard` instance):

| Ref | Set by | Purpose |
|---|---|---|
| `lockedSideRef` | `syncPickToFirebase` action = `locked` / `side_added` | The side the pick was last locked on (survives consensus wobble) |
| `lockWPSRef` | First lock + each accepted flip | Baseline WPS for `wpsDelta` reporting |
| `flipBeatThresholdRef` | First lock + each accepted flip | The ratcheting flip bar |
| `lockStarsRef`, `lockOddsRef`, `lockRawScoreRef` | First lock | UI display snapshots |

Firebase (per side doc inside `sides[<side>]`):

```js
{
  health: {
    status: 'ACTIVE' | 'MUTED' | 'CANCELLED',
    reasons: ['flip_rejected', 'below_lock_range'], // etc.
    currentStars, wpsDelta, newSideWPS, flipBeatThreshold,
    evaluatedAt: <ms>,
  },
  superseded: false,      // true once a later lock on a different side replaces this one
  lockStage: 'LOCKED',    // 'SHADOW' | 'LOCKED' | 'UNPROMOTED'
  ...
}
```

`flipBeatThreshold` is also stored at the document root so late reads don't lose
the ratchet history.

The writer is `syncPickHealth()`: it locates the correct side (falls back to
the originally-locked, non-superseded side if the passed `side` has no lock
record), merges the new `health` object, and stamps `evaluatedAt` / `lastWriteAt`.
Writes are gated by:

- `status === 'COMPLETED'` → no-op (bet already graded)
- `Date.now() >= commenceTime − 5min` → no-op (too late to help)
- `lastHealthRef.current === mlHealth.status` → no-op (no state change to persist)

---

**UI behaviour**

- `isMuted = healthStatus === 'MUTED' && !isGraded` — dimmed card, "MUTED"
  chip with reason codes appended ("Flip rejected — threshold not met",
  "Below lock range", etc.)
- `isCancelled = healthStatus === 'CANCELLED' && !isGraded` — stronger dim,
  "CANCELLED" chip, reasons list rendered under the header
- The Locked feed sorts ACTIVE → MUTED → CANCELLED via `healthOrder`, and the
  "Show cancelled" toggle controls whether cancelled cards collapse out of view
- Graded picks ignore health entirely (the outcome is now authoritative)

Health only affects visual state and downstream report filtering — it does not
retract the original Firebase `lock` snapshot, so historical analysis keeps
the pick exactly as it was called.

---

**Known gaps & roadmap**

| Scenario | Current behaviour | Under consideration |
|---|---|---|
| Opposing wave that swamps $invested but not wallet count | **Fixed V8.4** — opp-side WPS check runs regardless of wallet-count flip. Large-base / high-conviction sharps can drive opp WPS above ratchet even when they're outnumbered. | Tune `OPP_CANCEL_GAP` / `OPP_MUTE_GAP` on a few weeks of data — current values (0.5 / 1.0) are conservative. |
| Pinnacle moves hard against a locked pick (≥ 8¢) after lock | `ACTIVE` — line move not an input | "Adverse move" MUTE check gated on `pinnCurrentProb − lockPinnProb` |
| Sharp wallet that backed the locked side later *closes* their position | `ACTIVE` — we don't track exits | Exit-aware WPS once position-close data is in `sharp_action_positions` |
| `currentWPS < 0` but inside the 20-min window | `ACTIVE` (guard) | Leave as-is — late WPS noise is too high to act on |
| Spread / Total opposing-side check | Not yet wired — spreads & totals pass `sideFlipped: false` / `oppSideWPS: null` | Extend to compute `oppSr` for these markets and pipe through |

---

**Where it lives in code**

- `evaluatePickHealth()` — pure function, `SharpFlow.jsx` ~line 740
- `syncPickHealth()` — Firebase writer, `SharpFlow.jsx` ~line 1083
- ML call site: `SharpFlow.jsx` ~line 4142 (search `ML Pick Health Evaluation`)
- Spread/Total call sites: `SharpFlow.jsx` ~line 4282 / ~4416 (both pass
  `sideFlipped: false` — spreads & totals don't flip, they MUTE/UNMUTE on
  WPS crossing `LOCK_RANGE_WPS` only)
- Constants: `LOCK_RANGE_WPS = 0.0`, `tooCloseForFlip = timeToGame ≤ 20`
- UI rendering: `isMuted` / `isCancelled` flags in `SharpPositionCard`, list
  ordering in the Locked feed (`healthOrder`)

### Performance Tracking

Every locked play is recorded with its odds, book, unit size, star rating, regime, qualityProxy, wallet profile, and **V8 scoring breakdown** (`v8Scoring`) at time of lock. After games finish, results are automatically graded and profit/loss tracked. Performance is broken down by star tier to validate whether higher-conviction plays outperform.

---

## Part 2: Technical Reference (For Developers)

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    DATA COLLECTION                            │
│                                                              │
│  Polymarket API ──→ polymarket_data.json  (every 15 min)    │
│  Kalshi API ──────→ kalshi_data.json      (every 15 min)    │
│  Odds API ────────→ pinnacle_history.json (every 15 min)    │
│  Polymarket ──────→ sports_sharps.json    (2x daily)        │
│  Polymarket ──────→ whale_profiles.json   (legacy, 4x/day) │
│  Scan step  ──────→ sharp_positions.json  (every 15 min)    │
│                                                              │
│  Sports: NHL, CBB, MLB, NBA                                 │
│                                                              │
│  scanSharpPositions merges whale_profiles.json (base)        │
│  + sports_sharps.json (supplementary sport-profitable).     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                    UI (SharpFlow.jsx)                         │
│                                                              │
│  Reads all 5 JSON files from public/                        │
│  V8 wallet-contribution scoring: WalletBase × Conviction    │
│  Side-vs-side: NetEdge/100 + breadth − concentration        │
│  Regime detection: NO_MOVE / SMALL / CLEAR / NEAR_START     │
│  Writes locked picks to Firebase (3 collections)            │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                    GRADING (Firebase Functions)               │
│                                                              │
│  updateBetResults ──→ Grades bets + sharpFlowPicks          │
│  Runs every 10 min, uses live_scores/current                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### GitHub Actions Workflows

| Workflow | Schedule | Script(s) | Data Written | Deploys UI? |
|----------|----------|-----------|--------------|-------------|
| **fetch-polymarket.yml** | Every 15 min | `fetchPolymarketData.js`, `fetchKalshiData.js`, `snapshotPinnacle.js`, `scanSharpPositions.js`, `auditMarketData.js` | `polymarket_data.json`, `kalshi_data.json`, `pinnacle_history.json`, `sharp_positions.json` | **YES** — builds & deploys to gh-pages |
| **fetch-mlb-picks.yml** | 11 AM ET daily | `fetchMLBPicks.js` | MLB picks to Firebase | No |
| **seed-sports-sharps.yml** | 10 AM & 10 PM ET | `seedSportsSharps.js` | `sports_sharps.json` | No |
| **build-whale-profiles.yml** | 8 AM, 12 PM, 4 PM, 8 PM ET | `buildWhaleProfiles.js` | `whale_profiles.json` | No |
| **seed-whale-leaderboard.yml** | Every 3 hrs (:30) | `buildWhaleProfiles.js --seed` | `whale_profiles.json` | No |
| **scan-sharp-positions.yml** | Every 2 hrs (:15) | `scanSharpPositions.js` | `sharp_positions.json` | No |
| **daily-contribution-edge.yml** | 08:30 ET daily | `contributionEdgeMap.js`, `qualifiedSharpDeepDive.js` | `V8_CONTRIBUTION_EDGE.md`, `V8_GOLDILOCKS_REPORT.md` (committed to repo) | No |

**Critical Note**: The `fetch-polymarket.yml` workflow is the **only workflow that deploys the UI**. Any code changes to `src/` MUST be pushed to `main` before this workflow runs, or the deployment will overwrite local deploys with stale code.

### Scripts Reference

#### `scripts/fetchPolymarketData.js`
- **APIs**: Gamma API (events), Data API (trades, volume, positions), CLOB (price history), Odds API (CBB + MLB + NBA schedule)
- **Sports**: NHL (from `odds_money.md`), CBB (from Odds API `basketball_ncaab`), MLB (from Odds API `baseball_mlb`), NBA (from Odds API `basketball_nba`)
- **ML Market Selection**: Filters out markets where `groupItemTitle` contains "o/u"/"spread" or outcomes include "Over"/"Under". First remaining market = moneyline.
- **Price History**: Fetches 24h candles from CLOB for token[0] of the ML market, samples ~12 points for sparkline. Flips if token[0] is not the away team.
- **Series collision guard**: Each Polymarket event has an `endDate` field that is the game start time. When multiple Polymarket events share the same game key (e.g., back-to-back MLB series), the script compares each event's `endDate` (ET calendar day) against the Odds API `commence_time` for that game key. Only the event whose date matches today's game is accepted. If a wrong-day event was already enriched and a correct-day event appears later, it replaces it.
- **Output**: `public/polymarket_data.json` keyed by sport -> game_key (e.g., `NHL.bos_njd`, `MLB.nyy_bos`). Each entry includes `commence` (Odds API time, falling back to Polymarket `endDate`) and `polyGameTime` (Polymarket's native game start time).

#### `scripts/seedSportsSharps.js`
- **Purpose**: Builds the definitive list of top 250 most profitable sports bettors
- **Sources**: Polymarket leaderboard API (`/v1/leaderboard?category=SPORTS`), depth 1,500 entries
- **Per wallet**: Fetches `/positions` (P&L by sport) and `/traded` (market count)
- **Ranking**: Sorts all wallets by `sportPnlTotal` (sum of all sport P&L), takes top 250 above $5K
- **No MM scoring**: Wallets are qualified purely by sport profit — no tier/mmScore logic
- **Incremental**: Only re-profiles wallets whose `builtAt` is older than 48 hours
- **Ready flag**: Output includes `_meta.ready` — `scanSharpPositions.js` only uses the file when `ready: true` and `walletCount >= 50`
- **Output**: `public/sports_sharps.json` — `{ _meta: {...}, [walletAddress]: { totalPnl, sportPnl, sportPnlTotal, sportMarkets, marketsTraded, ... } }`

#### `scripts/buildWhaleProfiles.js` (legacy, unchanged)
- **Sources**: Polymarket leaderboard API (`/v1/leaderboard?category=SPORTS`) + whale trades from `polymarket_data.json`
- **Per wallet**: Fetches `/positions` (P&L) and `/traded` (market count)
- **Tier assignment**: `tierFromStats(totalPnl, marketsTraded)` — see Part 1 table
- **Rate limiting**: 1.5s delay between API calls (1s in seed mode), max 40 wallets/run (50 in seed)
- **Output**: `public/whale_profiles.json` — `{ [walletAddress]: { totalPnl, sportPnl, marketsTraded, tier, lastSeen, pnlHistory } }`
- **Note**: This pipeline is kept running as a fallback. `scanSharpPositions.js` uses `whale_profiles.json` only if `sports_sharps.json` is missing or not ready.

#### `scripts/scanSharpPositions.js`
- **Additive merge**: Loads `whale_profiles.json` as the base (tier/mmScore filtering), then merges in any additional wallets from `sports_sharps.json` that aren't already in the base list
- **Base wallets**: ELITE + PROVEN + ACTIVE wallets from `whale_profiles.json`, excluding mmScore > 40 and sport PnL < -$100K
- **Supplementary wallets**: All wallets from `sports_sharps.json` not already in the base list — pre-qualified by sport PnL, no tier/mmScore filtering needed
- **API**: Polymarket `/positions?user={wallet}` for each wallet
- **Filters out**: Resolved positions (curPrice <= 0.01 or >= 0.99), totals (Over/Under outcomes)
- **Matches**: Position titles to today's games using team name mapping
- **Output**: `public/sharp_positions.json` — per-game breakdown with `summary` (consensus, invested per side) and `positions` array

#### `scripts/snapshotPinnacle.js`
- **API**: The Odds API — `icehockey_nhl`, `basketball_ncaab`, `baseball_mlb`, and `basketball_nba` with bookmakers `pinnacle,draftkings,fanduel,betmgm,caesars`
- **Tracks**: Opener, current, history (timestamped array), movement direction, best retail price per side, EV calculation
- **Series collision guard**: Stores the Odds API unique `game.id` as `apiId` per game key. When a new game arrives for an existing key but with a different `apiId` (different game in a series), compares `commence_time` distances to `Date.now()`. Keeps whichever game is closer; if swapping, resets `opener`/`history`/`movement` so the new game starts fresh.
- **Output**: `public/pinnacle_history.json` keyed by sport -> game_key. Each entry includes `commence` (ISO game time) and `apiId` (Odds API UUID).

#### `extract_v7_stats.cjs` (legacy)
- **Purpose**: Was used to extract frozen population statistics for V7. Retained for historical reference.
- **V8 uses**: `V8_STAR_THRESHOLDS` hardcoded in `SharpFlow.jsx`, calibrated from live position data

### Firebase Collections

| Collection | Purpose | Written By | Read By |
|-----------|---------|-----------|---------|
| **sharpFlowPicks** | Locked ML plays with unit size, odds, criteria | SharpFlow.jsx (client) | SharpFlow.jsx (client), updateBetResults (function) |
| **sharpFlowSpreads** | Locked spread plays | SharpFlow.jsx (client) | SharpFlow.jsx (client), updateBetResults (function) |
| **sharpFlowTotals** | Locked total (O/U) plays | SharpFlow.jsx (client) | SharpFlow.jsx (client), updateBetResults (function) |
| **mlb_bets** | MLB model picks (separate from Sharp Flow) | fetchMLBPicks.js | MLB.jsx (client), updateBetResults (function) |
| **bets** | NHL model bets | betTracker.js (client) | updateBetResults (function) |
| **live_scores** | NHL game scores | liveScores function | updateBetResults (function) |

**CRITICAL: SHADOW-gate thresholds are enforced BEFORE any Firebase write:**
- ML (`sharpFlowPicks`): stars >= 2.5 AND consensusInvested >= `minInvestedFloor(contribTier)` ($5,000 baseline, $2,500 if STRONG/STANDARD)
- Spread (`sharpFlowSpreads`): stars >= 2.5 AND conWalletCount >= 2 AND conTotalInvested >= `minInvestedFloor(contribTier)`
- Total (`sharpFlowTotals`): stars >= 2.5 AND conWalletCount >= 2 AND conTotalInvested >= `minInvestedFloor(contribTier)`

`lockStage` is then set by `decideLockStage(regime, v8Scoring, side)`:
- `LOCKED` if `regime ∈ {CLEAR_MOVE, NEAR_START}` OR `contribTier === 'STRONG'`
- `SHADOW` otherwise

Each side document stores `lockStage`, `contribTier`, and `promotedBy` ∈ `{regime, contribution, null}` for audit/analysis.

#### `sharpFlowPicks` Document Schema (v3 — lock + peak + pregame snapshots)

Each document represents one game. Up to two sides can independently lock if both reach 2.5+ stars. Each side tracks three snapshots: **lock** (first trigger), **peak** (highest stars), and **pregame** (~30 min before game). Grading uses peak units/odds.

**Three Snapshots Per Side:**
- **`lock`** — frozen at first trigger (stars >= 2.5). Never updated.
- **`peak`** — high-water mark. Updated when stars or units climb higher.
- **`pregame`** — final state captured 30-35 min before game start. Includes full opposition data. Written once.

This enables **lock -> peak -> pregame** transformation analysis: did sharps pile on? Did opposition appear? Did EV evaporate?

```javascript
{
  date: "2026-04-06",           // ET date (derived from commence time)
  sport: "NHL",                  // NHL | CBB | MLB | NBA
  gameKey: "tor_bos",
  away: "Maple Leafs",
  home: "Bruins",
  commenceTime: 1711300000000,  // epoch ms
  lockType: "PREGAME",          // always PREGAME (live games are skipped)
  status: "PENDING",            // PENDING → COMPLETED (when all sides graded)
  flipBeatThreshold: 2.5,      // V8: WPS the opposing side must exceed to flip (ratchets up)

  sides: {
    home: {                     // one entry per side that reached 2.5+ stars
      team: "Bruins",
      lockStage: "LOCKED",        // V8.1: LOCKED | SHADOW (source of truth for promotion state)
      contribTier: "STRONG",      // V8.1: STRONG | STANDARD | LEAN | MUTE | null
      promotedBy: "contribution", // V8.1: 'regime' | 'contribution' | null (null = SHADOW)
      lock: {                   // original lock snapshot (never changes)
        odds: -190,
        book: "BetMGM",
        pinnacleOdds: -194,
        evEdge: 5.0,
        criteriaMet: 6,
        criteria: { sharps3Plus: true, plusEV: true, ... },
        sharpCount: 6,
        totalInvested: 9824,
        units: 3.0,
        unitTier: "MAX",
        stars: 4.5,
        lockedAt: 1711300000000,
        regime: "NO_MOVE",       // V7: market regime at lock time
        qualityProxy: 3.5,       // V7: quality score at lock time
        opposition: {            // opposition at lock time
          sharpCount: 2,
          totalInvested: 3500,
          avgBet: 1750,
          stars: 1.5,
          counterSharpScore: 1,
          consensusTier: "LEAN",
        },
        consensusStrength: { moneyPct: 82, walletPct: 75, grade: "DOMINANT" },
        walletProfile: {         // wallet-level metrics
          breadth: 0.45,
          conviction: 0.72,
          concentration: 0.31,
          dominantTier: "ELITE",
          sportSharpCount: 2,
          conWalletCount: 6,
          oppWalletCount: 2,
          consensusTier: "DOMINANT",
        },
        v8Scoring: {             // V8: full scoring breakdown for analysis
          walletPlayScore: 2.5,  // WPS used for health evaluation
          forSide: 180.5,
          againstSide: 42.3,
          netEdge: 1.44,
          breadthBonus: 3.58,
          topShare: 0.28,
          concPenalty: 2.24,
          walletCountFor: 6,
          walletCountAgainst: 2,
          walletDetails: [/* per-wallet contribution breakdown */],
        },
      },
      peak: {                   // high-water mark (updated pregame when units grow)
        odds: -210,
        book: "BetMGM",
        criteriaMet: 6,
        sharpCount: 9,
        totalInvested: 15200,
        units: 3.0,
        unitTier: "MAX",
        stars: 5.0,
        regime: "CLEAR_MOVE",    // V7: regime at peak
        qualityProxy: 3.5,
        updatedAt: 1711305000000,
        opposition: { ... },
        walletProfile: { ... },
      },
      pregame: {                // final snapshot ~30 min before game
        odds: -215,
        book: "BetMGM",
        pinnacleOdds: -210,
        evEdge: 2.1,
        criteriaMet: 6,
        criteria: { ... },
        sharpCount: 11,
        totalInvested: 22000,
        units: 3.0,
        stars: 5.0,
        regime: "NEAR_START",
        qualityProxy: 3.5,
        consensusStrength: { moneyPct: 78, walletPct: 85, grade: "DOMINANT" },
        opposition: { ... },
        walletProfile: { ... },
        minutesBeforeGame: 32,
        capturedAt: 1711310000000,
      },
      health: {                  // V8: pick health evaluation (written by syncPickHealth)
        status: "ACTIVE",       // ACTIVE / MUTED / CANCELLED
        reasons: [],            // e.g. ['below_lock_range'], ['side_flipped'], ['flip_rejected']
        currentStars: 4.5,
        wpsDelta: -1.2,         // current WPS minus lock WPS
        evaluatedAt: 1711310000000,
      },
      status: "PENDING",        // PENDING → COMPLETED
      result: {
        outcome: null,          // WIN / LOSS / PUSH
        profit: null,           // graded at peak.units and peak.odds
        gradedAt: null,
      },
    },
    away: {                     // only present if away side also hit 2.5+ stars
      team: "Maple Leafs",
      lock: { ... },
      peak: { ... },
      pregame: { ... },
      status: "PENDING",
      result: { ... },
    },
  },

  result: {                     // game-level scores (shared)
    awayScore: null,
    homeScore: null,
    winner: null,               // "away" or "home"
  },
}
```

**Legacy format** (pre-v2 docs): Flat structure with `consensusSide`, `units`, `odds` at top level. The grading function and P&L loader handle both formats — if `doc.sides` exists, use v2 logic; otherwise fall back to flat format.

### Grading (Firebase Function: `updateBetResults`)

Located in `functions/src/betTracking.js`. Runs every 10 minutes.

1. Reads `live_scores/current` for FINAL games
2. Grades regular `bets` collection (existing system)
3. **Then grades `sharpFlowPicks`**:
   - Queries `status == "PENDING"` for all sports (NHL, CBB, MLB, NBA)
   - Maps `gameKey` (e.g., `uta_dal`) to NHL abbreviations (`UTA`, `DAL`) via `ABBREV_MAP`
   - Matches against final games by `awayTeam`/`homeTeam`
   - **v2 format** (`doc.sides` exists): iterates each side, grades using `side.peak.units` and `side.peak.odds`, marks each side's `status: "COMPLETED"`. Top-level `status` becomes `"COMPLETED"` when all sides are graded.
   - **Legacy format** (flat `consensusSide`): grades as before with top-level `units` and `odds`
   - Uses same `calculateOutcome` and `calculateProfit` functions as the main bet tracker

### UI Component: `SharpFlow.jsx`

**Key Functions**:
- `useMarketData()` — loads all 5 JSON files
- `buildV8Normalization()` — precomputes percentile arrays, internal rank map from `sportsSharps`
- `rateStarsV8()` — V8 wallet-contribution scoring (per-wallet WalletBase × ConvictionMultiplier, side netting, regime detection)
- `computeSharpFeatures()` — legacy feature decomposition (still used for some display elements)
- `calculateUnits()` — maps ML star rating to 1–3u scale with consensus penalty + dog caps
- `calculateSpreadTotalUnits()` — maps spread/total star rating to 0.5–2u scale with dog caps
- `unitTier()` — MAX (>= 2.5u), STRONG (>= 1.5u), STANDARD (< 1.5u)
- `SharpPositionCard` — main card component (React.memo) with both-sides battle, sparklines, criteria checklist, unit sizing. Handles ML, Spread, and Total tabs.
- `evaluatePickHealth()` — V8-native health evaluation using WalletPlayScore (lock range check, ratcheting flip threshold)
- `syncPickHealth()` — writes health status (ACTIVE/MUTED/CANCELLED) with reason and wpsDelta to Firebase
- `syncPickToFirebase()` / `syncSpreadPickToFirebase()` / `syncTotalPickToFirebase()` — writes qualifying picks to Firebase with lock/peak/pregame snapshots, CLV-gated top pick bonus, `flipBeatThreshold` at document level
- `syncPregameSnapshot()` — captures final state ~30 min before game
- `buildSideData()` / `buildSpreadTotalSideData()` — constructs lock snapshot objects with regime, qualityProxy, walletProfile, v8Scoring
- `estimateStarsFromSnap()` — approximates V7 scoring for historical picks (before STARS_LIVE_DATE)
- `loadAllTimePnL()` — queries completed picks from all three collections for running record

**Lock Decision Flow** (no bet is written without meeting ALL requirements):
1. `sharp_positions.json` -> per-side wallet counts, invested amounts
2. `pinnacle_history.json` -> book prices, line movement, EV edge
3. `rateStarsV8()` -> star rating from wallet contributions (WalletBase × ConvictionMultiplier per wallet, side netting, percentile-based star conversion)
5. **Threshold check**: stars >= 2.5 AND invested >= minimum ($10K for ML, spread, and total)
6. Only if ALL conditions met -> Firebase write -> unit sizing -> locked card display

### Firestore Indexes Required

```json
[
  { "collection": "sharpFlowPicks", "fields": ["date ASC", "lockedAt DESC"] },
  { "collection": "sharpFlowPicks", "fields": ["status ASC", "lockedAt DESC"] }
]
```

Defined in `firestore.indexes.json`.

### Deployment Rules

**The only workflow that deploys the UI is `fetch-polymarket.yml`** (every 15 min). It runs `npm run build` from whatever is on `main`, then pushes to `gh-pages`. If your local changes aren't on `main`, they WILL be overwritten within 15 minutes.

#### Step-by-Step Deploy Procedure (ALWAYS follow this exact sequence)

```bash
# 1. Stage ONLY the files you changed (never git add . blindly)
git add src/pages/SharpFlow.jsx SHARP_FLOW_SYSTEM.md STAR_RATING_SYSTEM.md

# 2. Verify staged files are correct
git diff --cached --stat

# 3. Commit with a descriptive message
git commit -m "V8: Description of changes"

# 4. Push to main — this WILL fail if workflows pushed data since your last pull
git push origin main

# 5. If push is rejected (workflows pushed while you were working):
#    Stash any unstaged changes (deleted files, local experiments, etc.)
git stash --include-untracked
#    Rebase your commit on top of the latest workflow data commits
git pull --rebase origin main
#    Push again (should succeed now)
git push origin main
#    Restore your stashed changes
git stash pop
#    If stash pop has conflicts (e.g. workflow updated a file you deleted):
#      git reset HEAD <conflicted-file>
#      git checkout -- <conflicted-file>    # or just delete it again
#      git restore --staged .               # unstage everything from the stash

# 6. Deploy immediately so changes are live NOW (don't wait 15 min for workflow)
npm run deploy

# 7. Verify: the next workflow run will build from main (which has your code)
#    and deploy the same result. No conflict, no overwrite.
```

#### Why Each Step Matters

| Step | What happens if you skip it |
|------|----------------------------|
| Push to main FIRST | Workflow builds old code from main, deploys to gh-pages, **overwrites your local deploy** within 15 minutes |
| `npm run deploy` after push | Changes don't go live until the next workflow run (~15 min). Not catastrophic but unnecessary delay |
| Stash before rebase | `git pull --rebase` fails with "You have unstaged changes" if there are local deletions or modifications |
| Rebase (not merge) | Keeps commit history clean; your commit sits on top of the auto-update data commits |

#### Common Gotchas

- **Unstaged deletions block rebase**: If you've deleted local temp files, `git pull --rebase` will refuse. Always stash first.
- **Stash pop conflicts**: Workflows may have updated a file you deleted locally. Resolve by resetting the conflicted file, then re-delete if needed.
- **Never force push**: The workflows push every 15 min. Force pushing will lose data commits. Always rebase.
- **Build warnings are normal**: The Vite build will show warnings about chunk size, PostCSS gradients, and externalized modules. These do not affect the deploy.

### Merge Conflict Handling

Multiple workflows write to `public/` JSON files. To prevent failures from concurrent writes, all commit steps use:

```bash
git pull --rebase -X theirs || (git add -A && git rebase --continue)
```

This accepts the remote version on conflict (safe because each workflow regenerates its own data fresh).

---

## Part 3: Known Risks & Future Work

### Data Retention — Current Safeguards

| Data Source | Retention Mechanism | Growth Risk |
|------------|---------------------|-------------|
| `pinnacle_history.json` | 24 snapshots/game max, 36-hour stale purge | **None** — self-cleaning |
| `polymarket_data.json` | Rewritten from scratch each run (today's games only) | **None** — self-cleaning |
| `sharp_positions.json` | Rewritten from scratch each run (today's games only) | **None** — self-cleaning |
| `sports_sharps.json` | 250 wallet cap, 48-hour incremental refresh | **None** — bounded |
| `whale_profiles.json` | 1000 profile cap, 30-day stale pruning, 30-entry pnlHistory cap | **None** — bounded |
| Firebase `sharpFlowPicks` | No cleanup — documents accumulate indefinitely | **Low** — ~500 docs/season |
| Git commit history | ~96 auto-commits/day from data file updates across workflows | **Medium** — repo clone size grows over months |

### V8 Threshold Recalibration

The `V8_STAR_THRESHOLDS` should be recalibrated periodically as the dataset grows. Compute WalletPlayScore across accumulated picks and extract new percentile breakpoints. The current thresholds were bootstrapped from 58 live plays (2026-04-16).

### TODO: Long-Term Git Repository Size Plan

The automated workflows commit updated JSON data files to `main` approximately every 15 minutes. While git handles this without performance issues short-term, the `.git` directory will grow significantly over weeks and months.

**Options to evaluate:**

1. **Periodic history squashing** — Squash auto-commit history for data files on a schedule (e.g., monthly).
2. **Move data files out of git** — Store JSON data files in external storage and fetch at build time.
3. **Git LFS for data files** — Track the JSON data files with Git Large File Storage.
4. **Shallow clone in workflows** — Use `fetch-depth: 1` in all GitHub Actions checkouts.
5. **Firebase cleanup function** — Archive or delete `sharpFlowPicks` documents older than 90 days.

**Priority**: Medium. Not urgent for the first few weeks of operation, but should be addressed before the end of a full season.
