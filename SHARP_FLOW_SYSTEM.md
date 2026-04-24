# Sharp Flow — Whale Intel & Sharp Tracker System

> **ACTIVE SYSTEM — V6 Two-Factor Overhaul (2026-04-20).**
>
> Sharp Intel game cards and Locked Picks are driven by **Δ_winner** and
> **Δ_quality**. All other signals (WPS, regime, contribTier, breadth,
> concentration, meanBase_F) are **diagnostic-only** and do not influence
> stars, units, locks, mutes, or cancels.
>
> See [STAR_RATING_SYSTEM.md](STAR_RATING_SYSTEM.md) for the full V6 spec
> and [V8_TWO_FACTOR_BACKTEST.md](V8_TWO_FACTOR_BACKTEST.md) for the
> pre-ship validation (74 graded V8 picks, +43 ROI-point lift vs V8).

## V6 cheat sheet

| Layer | Rule |
|---|---|
| **Lock** | Δ_winner ≥ +1 AND Δ_quality ≥ +1 → LOCKED; else SHADOW |
| **Cancel** | Δ_winner ≤ −2 → CANCELLED (`winners_killed`) |
| **Mute** | Δ_winner = −1 → MUTED (`winners_faded`); or Δ_quality ≤ −3 AND Δ_winner ≤ 0 → MUTED (`quality_faded`) |
| **Star** | two-factor Vault Star (see STAR_RATING_SYSTEM.md) |
| **Units (ML)** | 5.0→3.00u · 4.5→2.00u · 4.0→1.25u · 3.5→0.75u · else 0 |
| **Units (SPR/TOT)** | 5.0→2.00u · 4.5→1.25u · 4.0→0.75u · 3.5→0.50u · else 0 |
| **TOP PICK** | Δ_winner ≥ +1 (outlined gold) |
| **SUPER TOP PICK** | Δ_winner ≥ +2 (filled gold) |
| **Firestore fields** | `v8_walletConsensus{Delta,QualityMargin,QualityForT30,QualityAgT30,Verdict,MuteTriggered,CancelTriggered,PromotionTriggered}`, `v8_vaultStar`, `v8_walletConsensusVersion = 6` |

---

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

**SHADOW / LOCKED renderer gate (minimum to even call `syncPickToFirebase`):**

| Market | Legacy gate | Whitelist-margin gate (v5.5, 2026-04-22) | Min Invested floor (back-end) |
|--------|-------------|-------------------------------------------|-------------------------------|
| **Moneyline** | `stars >= 2.5 && consensusInvested >= $10K` | `stars >= 1.0 && consensusInvested >= $10K && decideLockStage(...).promotedBy === 'whitelist'` | $5K (baseline), $2.5K (STRONG/STANDARD contribTier) |
| **Spread**    | `stars >= 2.5 && (≥2 wallets OR whaleOverride) && conInvested >= $10K` | `stars >= 1.0 && conInvested >= $10K && whitelist promo` | $5K / $2.5K |
| **Total (O/U)** | `stars >= 2.5 && (≥2 wallets OR whaleOverride) && conInvested >= $10K` | `stars >= 1.0 && conInvested >= $10K && whitelist promo` | $5K / $2.5K |

A side passes the renderer gate if **either** the legacy or the whitelist-margin column is satisfied. The `$2,500` relaxed floor inside the back-end is enabled by `minInvestedFloor(contribTier)` so picks with a strong qualified-sharp signal aren't rejected for modest aggregate dollars. **No bet is EVER written to Firebase unless both the renderer gate AND the invested floor are met.** Both are enforced in `SharpFlow.jsx` (`SharpPositionCard` and `syncPickToFirebase` respectively).

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

### V8.2 Wallet-Consensus Layer (2026-04-20)

The `sharpWalletProfiles` collection (built nightly by `scripts/exportWalletProfiles.js` from every graded V8 pick and sharp-action position) assigns each wallet a per-sport **whitelist tier** — `CONFIRMED` (flat & dollar profitable), `FLAT` (flat profitable only), `WR50` (≥50% win rate, unprofitable), or null. Backtesting across the V8 era (`WALLET_WHITELIST_BACKTEST.md`) showed that picks where **whitelisted profitable wallets** (CONFIRMED + FLAT) stack on one side dramatically outperform, and picks where they stack on the *opposite* side dramatically underperform. That insight is wired directly into the locking/sizing logic as a new layer that sits **on top of** V8 + V8.1.

**The Δ ladder** — for every pick we compute:

```
forW = # of unique whitelisted wallets on the pick side
agW  = # of unique whitelisted wallets on the opposing side
Δ    = forW − agW
```

| Δ | Verdict | Action |
|---|---------|--------|
| Δ ≥ +2 | `STRONG_FOR`  | **+0.50 units** and **PROMOTION eligible** (LOCKED with `promotedBy = 'whitelist'` when `basePickStars ≥ 1.0` and `agW = 0`) — renders the **gold filled TOP PICK** badge (`isSuperTopPick`) |
| Δ = +1 | `LEAN_FOR`    | **+0.10 units** and **PROMOTION eligible** (same guard: `basePickStars ≥ 1.0` and `agW = 0`) — renders the **gold outlined TOP PICK** badge |
| Δ = 0  | `NEUTRAL`     | no action (absence of profitable-wallet signal) |
| Δ = −1 | `FADE_WEAK`   | **MUTE** the locked pick (`healthReason = whitelist_fade_weak`) |
| Δ ≤ −2 | `FADE_STRONG` | **CANCEL** the locked pick (`healthReason = whitelist_fade_strong`) |

Negative Δ actions always take precedence over positive ones inside `computeWalletConsensus` so a pick is never simultaneously bonused and muted.

**Per-sport gating (v4, universal).** The `WHITELIST_INTERVENTION` config in `SharpFlow.jsx` now enables all four actions (`bonus`, `mute`, `cancel`, `promote`) for every sport. The whitelist is *already* per-sport — a wallet only reaches `CONFIRMED`/`FLAT` in sports where its ledger proves it — so layering an extra per-sport action gate was redundant. Sports with no whitelisted wallets simply produce `forW + agW === 0` → `NEUTRAL` and no action fires.

| Sport | bonus | mute | cancel | promote |
|-------|-------|------|--------|---------|
| NBA   | ✓ | ✓ | ✓ | ✓ |
| MLB   | ✓ | ✓ | ✓ | ✓ |
| NHL   | ✓ | ✓ | ✓ | ✓ |
| CBB   | ✓ | ✓ | ✓ | ✓ |
| NFL   | ✓ | ✓ | ✓ | ✓ |

Config is still the single kill-switch — flip any flag to `false` and redeploy to retire that lever for a sport.

**Promotion guardrails** (all must be true for `promotedBy = 'whitelist'`):

1. `verdict ∈ { 'STRONG_FOR' (Δ ≥ +2), 'LEAN_FOR' (Δ = +1) }` — v5 opened the path to LEAN_FOR after the 2026-04-22 predictor shootout showed Δ=+1 at 70% WR / +31% flat ROI (N=10)
2. `agW === 0` (no profitable-wallet dissent — pure positive consensus)
3. `basePickStars >= 1.0` (minimal V8 merit floor; lowered from 1.5 in v5 — the whitelist IS the primary merit signal, we only gate outright noise)
4. `sportConfig.promote === true`
5. Pick is not already LOCKED by regime or contribution path (avoids double-counting)

**Attribution fields stamped on every `sharpFlowPicks`/`sharpFlowSpreads`/`sharpFlowTotals` side doc:**

- `v8_walletConsensusVersion` — schema version (currently **5**)
- `v8_walletConsensusSport`, `v8_walletConsensusEnabled`
- `v8_walletConsensusForW`, `v8_walletConsensusAgW`, `v8_walletConsensusDelta`
- `v8_walletConsensusVerdict` — one of the five ladder verdicts above
- `v8_walletConsensusStarBonus` — the unit bonus applied (0.50 / 0.10 / 0 / suppressed)
- `v8_walletConsensusMuteTriggered`, `v8_walletConsensusCancelTriggered`, `v8_walletConsensusPromotionTriggered`
- `v8_walletConsensusBaseStars` — the base V8 stars before any whitelist adjustment

These stamp on create, on peak update, and on any SHADOW → LOCKED transition so every health change has a full audit trail. `scripts/backfillWalletConsensus.js` mirrors the same logic for re-stamping historical picks on version bumps.

**UI surfaces.**

- **TOP PICK badge (two tiers, v5.1)** — single gold ribbon family now driven by wallet-consensus Δ (replaces the earlier regime/fmean composite and the short-lived PROVEN/SHARP CONSENSUS violet pills).
  - **Super TOP PICK** (filled gold gradient + glow + `Zap` icon) — `v8_walletConsensusDelta ≥ 2`. Tooltip: `forW/agW`.
  - **Regular TOP PICK** (outlined gold + `TrendingUp` icon) — `v8_walletConsensusDelta === 1 && v8_walletConsensusAgW === 0`. Tooltip: `forW/agW`.
  - Both computed by `evaluateTopPickTier()` and surfaced in the locked-list card header, with the sort comparator using the same flags.
- Each wallet row in the Sharp Intel game card carries a gold **`{SPORT} WINNER`** chip when that wallet's whitelist tier for the current sport is `CONFIRMED` or `FLAT`.
- The "Verified Sharps" header for ML, Spread, and Total counts append `· N {SPORT} WINNERS` (gold) and `· N {SPORT} FADING` (red) so the Δ ladder is visible at a glance.
- Locked picks muted/cancelled by Δ render with health reasons `whitelist_fade_weak` / `whitelist_fade_strong` in the existing tooltip system.

**Anchor data (v5 predictor shootout, 2026-04-22 — `scripts/predictorShootout.js`):**

| Predictor | Pos vs Neg spread | Notes |
|---|---:|---|
| **Δ ≥ +2 vs Δ ≤ 0** | **+136.6%** | 16 picks @ 69%/+76% vs 27 picks @ 22%/−60% |
| **Δ ≥ +1 vs Δ ≤ 0** | **+119.3%** | 26 picks @ 70%/+59% vs 27 picks @ 22%/−60% |
| meanBase_F ≥ 55 vs < 50 | +12.0% | secondary signal; holds in CLEAR_MOVE/SMALL_MOVE only |
| maxRoiN_F ≥ 70 vs < 50 | −24.2% | no current separation in graded sample |

Δ is the dominant v8 predictor across every regime with sample (CLEAR_MOVE **+127.5%** spread, NEAR_START **+133.9%** spread where fmean goes negative). Δ ≥ +1 buckets all earn their promotion; Δ ≤ −1 buckets all justify the MUTE/CANCEL kill.

**Monitoring.** `scripts/v8DailyPnL.js` now slices all graded V8 picks by `walletVerdict` and `walletDelta` in both the single-factor section and the 2-way cross sections (`Wallet verdict × regime`, `Wallet verdict × sport`, `Wallet verdict × stars`), and the new verdict is included in the 3-way cluster pool. The nightly `sharpWalletProfiles` rebuild (`exportWalletProfiles.js`) churns whitelist membership in and out as each new graded day lands, so the layer self-corrects as wallets rise and fade.

### v5.2 — Stale-Health Self-Heal (2026-04-22)

When the v5 promotion path went live, several picks already in Firebase carried a `health.status === 'MUTED'` with reasons of `whitelist_fade_weak` / `whitelist_fade_strong` from earlier evaluations whose Δ stamps were since corrected. The UI was reading those stale `health` blocks directly, so picks that *currently* show a positive Δ were still rendered as muted.

Two-prong fix shipped:

1. **UI-side reconciliation** — the locked-list builder in `SharpFlow.jsx` now reads `health` through a guard that resets `status` back to `'ACTIVE'` when (a) the stored reasons are *only* `whitelist_fade_*`, (b) the pick's *current* `v8_walletConsensusVerdict` is `LEAN_FOR` / `STRONG_FOR` / `NEUTRAL`, and (c) `v8_walletConsensusMuteTriggered === false && v8_walletConsensusCancelTriggered === false`. Non-whitelist health reasons (`opp_side_stronger`, `wps_dropped`, `side_flipped`, …) are preserved untouched.
2. **Backfill-side write reconciliation** — `scripts/backfillWalletConsensus.js` now actively resets `health` to `{ status: 'ACTIVE', reasons: [] }` whenever it detects the same stale-only-whitelist-reason pattern, even when the pick's `v8_walletConsensusVersion` is already at the current version. This means re-running the script idempotently cleans up legacy state without requiring a version bump.

### v5.3 — Live-vs-Stored Δ Drift Restamp (2026-04-22)

`syncPickToFirebase` (and the spread/total variants) only re-stamped wallet-consensus fields when *stars rose* (peak update path), *EV broke a new max*, or **WHITELIST_CONSENSUS_VERSION** was bumped. Neither caught the most common live-pick mutation: a new whitelisted sharp arrives (or an existing one flips sides) **after peak**, which leaves Δ frozen at the peak-time wallet set.

Fix: every sync function now performs a final "live vs stored" Δ drift check before returning `no_change`. If `liveWc.delta`, `liveWc.verdict`, or the mute/cancel flags differ from what Firebase has, the side is restamped and `lastAction = 'consensus_drift_restamp'`. Cost is one extra `setDoc` per drifted side, only on actual mismatches; the page-load and 15-min fetch sync pipelines now propagate fade/promote signals as they happen.

### v5.4 — All-Sides Drift + Whitelist Side-Creation + FADING Badge (2026-04-22)

v5.3 only restamped the side passed *into* the sync (the live consensus side). When consensus *flipped* to a brand-new side (Oilers becomes today's consensus while the Firebase doc still has only a Ducks side from yesterday's peak), `syncPickToFirebase` was called with `side="home"`, the new-side branch returned `no_change`, and the orphaned Ducks side was *never touched* — its Δ stayed frozen and the late-arriving NHL WINNER fading the pick never propagated to mute it.

Three fixes shipped:

1. **`restampDriftedSides()` helper** — every sync now refreshes Δ on **every non-superseded side**, not just the consensus side. Pulls from the same `v8Scoring.walletDetails` (which contains both sides' wallets each tagged with the wallet's actual bet side), runs `computeWalletConsensus` per side, and patches any drift in a single `setDoc`. Ran from both the existing-side branch *and* the new-side branch (before the side-creation gate).
2. **Whitelist side-creation override** — the new-side gate previously required `stars > existingBestStars` to add a side. That blocked a NHL/MLB WINNER on the OTHER side from ever creating a fresh pick if its raw V8 score was below the existing peak (Oilers 2★ vs Ducks 2.5★ peak). The gate now also allows side creation when `decideLockStage` returns `promotedBy === 'whitelist'` for the new side, and supersedes any existing locked sides (which are then rendered as `CANCELLED` with reason `side_flipped`). Action recorded as `side_added_whitelist`.
3. **FADING header badge** — the verified-sharps card header showed `· N {SPORT} FADING` only when `agCount > forCount`. That hid the fade signal in the common 1-for / 1-against case (e.g. Stars/Wild with af1697 on Stars and fcc12b on Wild) where the header read `1 NBA WINNER` while the list rendered two winner badges total. Now shows `FADING` whenever any winner is on the opposite side, so the header total matches what's visible in the list.

### v5.5 — Renderer-Side Whitelist Margin Override (2026-04-22)

The shadow/lock decision tree had two layers that needed the v5 baseStars≥1.0 lowering: (a) `decideLockStage` (fixed in v5) and (b) the renderer-side `meetsThreshold` gate at the top of `SharpPositionCard` that decides whether to even *call* `syncPickToFirebase`. The v5 work missed (b), so a 1-2★ margin play with a sport WINNER on its side never made it to Firebase at all — the doc was never created and the whitelist promotion path inside the sync function literally never got a chance to fire. The Dodgers ML 4/22 case (1 sharp, $48.6K, 1 MLB WINNER, 2★ LEAN) was invisible to the system for that reason.

Fix: `meetsThreshold` for ML, Spread, and Total now accepts EITHER:

1. **Legacy gate** — `stars >= 2.5 && consensusInvested >= $10K` (and the existing 2-wallet/whale rule for spread/total).
2. **Whitelist-margin gate** — `stars >= 1.0 && consensusInvested >= $10K && decideLockStage(...).promotedBy === 'whitelist'` for the same side.

If only the whitelist gate fires, `isLocked` is set true (regardless of regime) so the sync `useEffect` actually runs. `syncPickToFirebase`'s whitelist promotion path then keeps `lockStage` in sync, and the locked-list card renders the side as a normal LOCKED play with `promotedBy = 'whitelist'`. This finally aligns the renderer with the back-end promotion rules and is the change that lets pure margin plays surface.

### v5.6 — Muted Plays Excluded From Performance + Persistent Mute Styling Post-Grade (2026-04-22)

A muted side (`health.status === 'MUTED'`) had two bugs after grading:

1. **It counted toward record / win-rate / ROI / Profit-Over-Time.** A play we explicitly told the user to stand down on (e.g. Red Sox 2026-04-22 ML, muted with `below_lock_range`) was still tallied as a -1u loss in the Pick Performance card and dragged the equity curve down. The system was effectively grading itself on plays it had already disqualified.
2. **It rendered as a normal locked LOSS card.** `isMuted` and `isCancelled` in `LockedPickCard` were both gated by `&& !isGraded`, so the moment the result landed the amber/orange WEAKENING styling vanished and the card was indistinguishable from a real loss.

Fix touches three places, all in `src/pages/SharpFlow.jsx`:

- **`tallySides()`** and **`loadAllTimePnL().processSide()`** now treat `health.status === 'MUTED'` exactly like `CANCELLED` / `superseded` / `SHADOW` for the purposes of `pnl.pregame` totals, the by-conviction-tier `byStars` buckets, and the `cancelled` flag stamped on each pushed `pick`.
- **`SharpFlowProfitChart`** filters out `pick.cancelled` picks before walking the cumulative profit curve.
- **`LockedPickCard`** drops the `&& !isGraded` gate on `isMuted` / `isCancelled`. A muted graded card now keeps the orange accent, opacity 0.6, "WEAKENING" badge, struck-through `1u`, an amber `MUTED · LOSS` (or `· WIN`) outcome chip, and `0.00u` profit text. The sync side stamp and stored `health` are unchanged — this is purely a render + aggregation fix.

Cache key bumped from `sharpFlow_pnl_v12` → `sharpFlow_pnl_v13` so existing browser sessions force a refresh of the totals.

### Promotion Path Summary (post-v5.5)

For a side to LOCK and appear in `Locked Picks — Today`, it now passes through:

1. **Renderer gate (`meetsThreshold`)** — Legacy 2.5★/$10K **OR** Whitelist 1.0★/$10K (Δ≥+1, agW=0).
2. **`syncPickToFirebase` invested floor** — `totalInvested ≥ minInvestedFloor(contribTier)` (`$2.5K` STRONG/STANDARD, else `$5K`).
3. **`decideLockStage`** — LOCKED via regime (`CLEAR_MOVE`/`NEAR_START`) **OR** contribution (STRONG tier) **OR** whitelist (Δ≥+1 + agW=0 + baseStars≥1.0).
4. **Drift restamp** — every page-load + 15-min fetch reconciles every non-superseded side's Δ against live `walletDetails`. Late-arriving sport WINNERs fade an existing locked side (MUTE/CANCEL via Δ ≤ −1) or create+supersede a new side (whitelist promotion of the OTHER side).

If the side fails (1) or (2) it is invisible to Firebase. If it fails (3) it stays `SHADOW`. If (4) reverses the picture, the existing pick is muted/cancelled or superseded by a new whitelist-promoted side without waiting for a peak update.

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

**V8.4 — TOP PICK UI badge (replaces legacy starDelta rule):** The TOP PICK ribbon on `LockedPickCard` (Locked Picks list) is no longer driven by `starDelta ≥ 1.0`. It now uses a **two-tier** system mirroring V8's two strongest signals:

| Tier | Predicate | Visual | Evidence |
|---|---|---|---|
| **Regular TOP PICK** | `regime === 'CLEAR_MOVE'` | Gold-outlined ribbon, `TrendingUp` icon, subtle gold glow | N=11, 72.7% WR, +29.5% flatROI (every sub-partition profitable) |
| **Super TOP PICK** | `regime === 'CLEAR_MOVE' AND meanBase_F ≥ 55` | Solid filled-gold ribbon, `Zap` icon, strong gold glow | Stacked edge — CLEAR_MOVE intersected with high-caliber for-side wallet crew (meanBase_F ≥ 55 alone: N=14, 71.4% WR, +33.9% flatROI) |

Rationale — the tiers correspond to V8's two independently profitable signals. CLEAR_MOVE alone is already a real edge (the regular badge), so we show it. When high-caliber wallets stack on top, it becomes the strongest repeatable combination in the dataset — that's the super (filled-gold) badge.

The old rule selected picks whose stars grew, but ignored whether the growth was **market-confirmed** (regime) or backed by **high-caliber wallets** (meanBase_F). A pick could grow in stars through wallet churn on mid-tier sharps and still lose — the old badge celebrated that, the new tiers do not.

**Resolution policy (analysis-faithful):** The badge resolves the same fields the V8 analysis scripts use, in the same order, so the displayed tier is always a literal advertisement of the proven edge:

```
regime    = peak.regime    ?? lock.regime    ?? sd.promotedRegime
v8Scoring = peak.v8Scoring ?? lock.v8Scoring        // for meanBase_F
```

This precedence mirrors `scripts/regimePerformance.js`, `clearMoveSubset.js`, `v8DailyPnL.js`, `nonLockedEdgeAudit.js`, `signalAcrossFullSample.js`, etc. — every script that produced the historical CLEAR_MOVE = 72.7% WR / +29.5% ROI finding read regime in this exact order. **No snapshot OR-ing**, no cross-pollination — the badge tier always reflects the resolved field used in the study.

**Practical consequence:** A pick that locked under CLEAR_MOVE but whose most recent peak snapshot reads `NEAR_START` / `NO_MOVE` (because the move has since settled) will *not* wear the badge. That's intentional — the study counted those as `NEAR_START` / `NO_MOVE` picks, not CLEAR_MOVE picks. Inverse: if the lock-time regime was `SMALL_MOVE` but Pinnacle has since moved enough that peak now reads `CLEAR_MOVE`, the pick *will* wear the badge.

**Sort order on the Locked Picks list** (after health ordering): Super TOP PICK > Regular TOP PICK > everything else. Badge tier always matches list position.

**Pre-V8 picks** (no `regime` or `v8Scoring` on the lock/peak snapshot) fall through to `false` on both tiers and never display either badge — expected behavior since we can't evaluate the new criteria on them.

**Implementation:** `src/pages/SharpFlow.jsx` →
- `isClearMoveRegime({ regime })` → tier 1 predicate
- `isClearMoveTopPick({ regime, meanBaseF })` → tier 2 predicate
- `computeMeanBaseF(v8Scoring, sideKey)` → averages `walletBase` across for-side wallets (`side === consensusSide`) in the snapshot's `v8Scoring.walletDetails`
- `evaluateTopPickTier(peak, lock, sideKey, promotedRegime)` → resolves regime + meanBase_F using the analysis-faithful precedence and returns `{ isTopPick, isSuperTopPick, regime, meanBaseF }`
- `LockedPickCard` consumes the precomputed flags; sort comparator ranks `tier2 > tier1 > 0`
- `scripts/probeTodayLockRegime.js` → diagnostic to inspect today's resolved regime / tier per pick

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
| **Wa** | **Δ ≤ −2 AND `sportConfig.cancel === true` AND `timeToGame > 20`** (V8.2 wallet consensus) | **`CANCELLED`** | `whitelist_fade_strong` |
| **Wb** | **Δ ≤ −2 AND `sportConfig.cancel === false`** OR **Δ = −1**, with `sportConfig.mute === true` AND `timeToGame > 20` | **`MUTED`** | `whitelist_fade_strong` / `whitelist_fade_weak` |
| B | `timeToGame > 20` AND `oppSideWPS > flipBeatThreshold` AND `oppSideWPS − currentWPS ≥ 0.5` | **`CANCELLED`** | `side_flipped` (if wallet-count consensus also flipped) OR `opp_side_dominates` |
| C | `timeToGame > 20` AND `oppSideWPS > 0.0` AND `oppSideWPS − currentWPS ≥ 1.0` (but B not met) | **`MUTED`** | `opp_side_stronger` (advisory — ratchet not beaten yet) |
| D | `sideFlipped` AND `timeToGame > 20` AND `currentWPS < 0.0` (B & C not met) | **`MUTED`** | `flip_rejected`, `below_lock_range` |
| E | `sideFlipped` AND `timeToGame > 20` AND `currentWPS ≥ 0.0` (B & C not met) | `ACTIVE` | `flip_rejected` |
| F | `currentWPS ≥ 0.0` (no dominance, no flip concern) | `ACTIVE` | — |
| G | `currentWPS < 0.0` | **`MUTED`** | `below_lock_range` |

Rows **Wa** / **Wb** are the V8.2 wallet-consensus overrides and run **before** the WPS checks — profitable-wallet Δ trumps the WPS ladder when the whitelisted sharps are actively on the other side. See the V8.2 section above for the full Δ → verdict mapping and per-sport gating.

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

### Vault Quant Score v1 (shadow-mode, no UI)

As of 2026-04-20 every `sharp_action_positions` doc also carries a hidden
1.0–5.0 per-position score under the `vault_*` field prefix. Two validated
axes:

1. **Winners margin (`vault_winnerMargin`)** — unique CONFIRMED/FLAT
   sport-winner wallets on this position's side minus opposing. Monotonic in
   live data: Δ≥+2 → 75% WR, Δ≤−2 → 0% WR.
2. **Quality margin T=30 (`vault_qualityMargin`)** — unique wallets with
   `v8_walletContribution ≥ 30` on my side minus opposing. Strongest single
   correlation in V8_CONTRIBUTION_EDGE (ρ=0.365 with flat ROI).

The composite `vault_quantScore` ∈ {1.0, 1.5, …, 5.0} and `vault_quantLabel`
∈ {ELITE, STRONG, SOLID, DEVELOPING, MUTED} are written but not read by any
UI component. Backfill on 679 positions shows a clean 60.0% / 41.8% WR gap
between the top (4-5★) and bottom (1-1.5★) tier buckets. Full report:
[`VAULT_QUANT_VALIDATION.md`](./VAULT_QUANT_VALIDATION.md).

Refresh cadence:
- Live positions rescored on the existing 2h `writeSharpActions` cron.
- Historical positions rescored daily via `backfill-vault-quant.yml` (the
  whitelist shifts as wallets enter/exit CONFIRMED/FLAT).

Formula definitions live in two synced helpers — any edit must touch both:
- `scripts/writeSharpActions.js` → `computeVaultQuantSignals` + `computeVaultQuantScore`
- `scripts/backfillVaultQuant.js` → same helpers (re-implementation reads
  the grouped position set from Firestore rather than `walletDetails`)

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
| **grade-sharp-actions.yml** | Every 4 hrs (03/05/07/09 UTC) | `gradeSharpActions.js` → `syncWalletBets.js` → `exportWalletProfiles.js --write-firebase` | Firestore `sharp_action_positions` (graded), `walletBets`, `sharpWalletProfiles`; repo `data/wallet-profiles.json`, `WALLET_ROSTER.md`, `WALLET_PROFILES_SUMMARY.md` | No |

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
| **sharp_action_positions** | Individual sharp-wallet bets seen via `scanSharpPositions` (graded in place). Tagged `qualificationTier ∈ {VAULT, SHADOW}` — see [Shadow Vault](#shadow-vault-vault--shadow-position-tracking) below. | writeSharpActions.js, gradeSharpActions.js | Sharp Vault UI (VAULT-only), walletBets pipeline (both), wallet analytics (both) |
| **walletBets** | Long-term history of every observed wallet bet (one doc per `{date, gameKey, market, side, walletShort}`), merged from Source A (`v8Scoring.walletDetails` on sharpFlow picks) + Source B (`sharp_action_positions`) | syncWalletBets.js | exportWalletProfiles.js, future wallet analytics |
| **sharpWalletProfiles** | Per-wallet rollup profile (overall + bySport + byMarket + whitelistTier) keyed by `walletShort` | exportWalletProfiles.js `--write-firebase` | Phase 2 UI badge + walletConsensus scoring |

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

### Shadow Vault — VAULT + SHADOW Position Tracking

**Problem it solves:** the Sharp Vault UI and its reports should only show bets where a sharp wallet *sized up* (invested ≥ 0.75× their recent sport-average bet). That "conviction gate" is correct for the UI — but it throws away every smaller bet before it ever reaches Firebase. For wallet-level analytics this is a problem: NHL and other thin-volume sports end up with too few positions per wallet to classify them, and we can't see when a sharp *chases* vs. *sizes up*. Shadow Vault keeps the strict vault gate for the UI while storing the rest of each qualified wallet's real-money activity for analytics.

**Write-side gate** (see `scripts/writeSharpActions.js`):

```
invested / avgSportBet >= 0.75   → qualificationTier = 'VAULT'   (vaultQualified = true)
invested / avgSportBet >= 0.10   → qualificationTier = 'SHADOW'  (vaultQualified = false)
invested / avgSportBet <  0.10   → skipped (too small to be signal, garbage-in guard)
```

Upstream sharp-wallet qualification (leaderboard tier, min sport volume, etc. from `scanSharpPositions`) is unchanged — Shadow Vault does **not** lower the bar for *who* counts as a sharp. It only lowers the bar for *which of that sharp's bets* we persist.

The shadow floor of **0.10×** is deliberately conservative: it filters out one-click dust bets and wallets with junk avgSportBet while preserving essentially every intentional position. Roughly 3–4× more docs are expected in `sharp_action_positions` once shadow writes are live; about half will be shadow.

Per-doc schema additions:

| Field | Type | Notes |
| --- | --- | --- |
| `qualificationTier` | `'VAULT' \| 'SHADOW'` | Set on insert and also refreshed on every update (a position's tier can change if `invested` grows). |
| `vaultQualified` | `boolean` | Convenience: `qualificationTier === 'VAULT'`. Vault-only readers filter on `data.vaultQualified === false` (excludes shadow; treats *missing* field as VAULT so pre-shadow docs pass through unchanged). |
| `label` | string | Shadow rows are written as `SHADOW_TRACKING` (vault rows continue to use `EV_OPPORTUNITY` / `HIGH_CONVICTION` / `SHARP_POSITION`). |

**Read-side contract:**

| Consumer | VAULT only | Includes SHADOW | Rationale |
| --- | :---: | :---: | --- |
| Sharp Vault UI (`public/sharp_positions.json` → `SharpFlow.jsx`) | ✓ | — | UI reads the scanner's raw JSON, not Firestore. Vault semantics unchanged. |
| `sharpVaultV8Analysis.js` → `SHARP_VAULT_V8_REPORT.md` | ✓ | — | Designed around vault conviction rows; shadow would dilute the WPS-vs-outcome signal. |
| `dailySharpActionReport.js` → `DAILY_SHARP_ACTION_REPORT.md` | ✓ | — | Same: tracks the vault as a betting product. |
| `goldilocksConsensusBuckets.js` | ✓ | — | Vault-conviction sizing edge explicitly. |
| `syncWalletBets.js` → `walletBets` | — | ✓ | Long-term wallet history — every real bet counts. Tier copied into `position.qualificationTier`. |
| `exportWalletProfiles.js` → `sharpWalletProfiles` | — | ✓ | Tier-aware (see below). |
| `gradeSharpActions.js` | — | ✓ | Grade everything; tier is metadata. |
| `walletWhitelistBacktest.js`, `walletBySportReport.js`, `walletPerformanceReport.js`, `walletDistributionReport.js` | — | ✓ | Wallet-level analytics benefit directly from the denser feed. |

**`sharpWalletProfiles` — tier-aware fields.** `exportWalletProfiles.js` splits the positions data across three rollups so the "did this wallet WIN when they SIZED UP?" semantic is preserved while dollar-ROI / WR get the benefit of the richer dataset:

| Field | Population | Purpose |
| --- | --- | --- |
| `positions` (overall) + `bySport[sport].positions` + `byMarket[market].positions` | **VAULT + SHADOW** (all graded) | Dollar ROI, WR, N. Drives whitelist tier classification (`CONFIRMED` / `FLAT` / `WR50`). Shadow rows densify the sample — especially for NHL. |
| `sizeSignal` (own-median buckets: routine / above / wayAbove) | **VAULT-only** | Conviction sizing edge. Shadow rows are structurally small so including them would skew the own-median bucketing downward and break the semantic. |
| `shadowSignal` (flat rollup + medianInvested) | **SHADOW-only** | Visibility into a wallet's "chasing" activity. A wallet with positive `sizeSignal.wayAbove` + negative `shadowSignal.dollarRoi` is exactly the pattern we expect from a true sharp. |

**Backward compatibility.** Every pre-shadow historical doc in `sharp_action_positions` is treated as `VAULT` (they all passed the 0.75× gate under the old code). The next `writeSharpActions.js` run backfills `qualificationTier: 'VAULT'` / `vaultQualified: true` onto existing PENDING docs via its update path, and the grader's v8Patch backfills them onto GRADED docs. No separate backfill job is needed. Readers that filter with `if (data.vaultQualified === false) continue;` (NOT `=== true`) handle the transition window cleanly.

### Wallet Intelligence Pipeline

The wallet-intelligence layer answers a single question: **for each unique sharp wallet we've ever seen, how has it performed per sport, and does it qualify for our profitability whitelist?** Phase 2 of the system (per-wallet badges on the Verified Sharps list, and a walletConsensus Δ score that feeds sizing / mute / cancel decisions) reads exclusively from the `sharpWalletProfiles` collection produced here.

The pipeline is refreshed every 4 hours by `grade-sharp-actions.yml` (cron `0 3,5,7,9 * * *` UTC):

1. **`gradeSharpActions.js`** — grades any `sharp_action_positions` docs whose games have settled.
2. **`syncWalletBets.js --write`** — upserts every observed wallet bet into `walletBets`.
3. **`exportWalletProfiles.js --write-firebase`** — rebuilds `sharpWalletProfiles` from scratch + writes `data/wallet-profiles.json`, `WALLET_ROSTER.md`, `WALLET_PROFILES_SUMMARY.md` and commits them back to `main`.

Full rebuild (not incremental merge) is intentional — at the current ~90-wallet scale the whole collection fits in a single batch, and any rule change to `classifyWhitelistTier` takes effect on the very next run.

#### `walletBets` collection

One document per distinct `{date, gameKey, market, side, walletShort}` tuple. Doc id follows the same pattern, e.g. `2026-04-20_2026-04-20_nba_por_sas_ml_home_bc3532`. Sources are merged via `merge: true` so a Source A (pick `walletDetails`) insert can be augmented by a later Source B (`sharp_action_positions`) insert — the `sources: []` array records which feeds contributed.

```javascript
{
  walletShort: "bc3532",
  walletAddress: "0x…",              // from Source B only; may be null if never seen in positions
  date: "2026-04-20",
  sport: "NBA",
  market: "ML",                       // ML | SPREAD | TOTAL
  side: "home",                       // home | away | over | under
  gameKey: "2026-04-20_nba_por_sas",
  homeTeam: "Spurs", awayTeam: "Trail Blazers",
  outcome: "WIN",                     // WIN | LOSS | PENDING (derived from graded picks/positions)
  invested: 45000,                    // real $ from Source B when available
  pinnacleOdds: -150,                 // American odds at pick-peak time
  flatPnl: 0.67,                      // 1u flat PnL using pinnacleOdds + outcome
  settledPnl: 67500,                  // real $ settled PnL from Source B
  avgPrice: 0.62,                     // Polymarket entry price (Source B)
  pickSnapshot: {                     // Source A quality context at pick-generation time
    walletBase: 77.8, roiNorm: 67.8, rankNorm: 82, pnlNorm: 55,
    rank: 34, lifetimeRoi: 6.3, lifetimePnl: 412000,
    contribution: 58, sizeRatio: 1.9, convictionMult: 1.2,
    isConsensusSide: true, capturedAt: "2026-04-20",
  },
  position: {                         // Source B metadata
    size: 45000, tier: "ELITE", leaderboardRank: 34,
    sportROI: 6.3, sportPnlTotal: 412000, sportVol: 14000000,
    sportsLbPercentileTop: 3, betMultiplier: 1.9,
    label: "SHARP_POSITION", firstSeen: 1711305000000,
    qualificationTier: "VAULT",       // 'VAULT' | 'SHADOW' — see Shadow Vault section
    vaultQualified: true,
  },
  sources: ["positions", "walletDetails"],
  sourceDocs: {
    positionsDocId: "2026-04-20_NBA_por_sas_...",
    walletDetailsDocId_sharpFlowPicks: "2026-04-20_NBA_por_sas",
  },
  updatedAt: <serverTimestamp>,
}
```

#### `sharpWalletProfiles` collection

One document per wallet, keyed by `walletShort`. Phase 2 reads this collection live on SharpFlow mount, caches the result, and uses `bySport[<sport>].whitelistTier` + the top-level `flatSports`/`confirmedSports` arrays for badge rendering and Δ consensus math.

```javascript
{
  walletShort: "bc3532",
  walletAddress: "0x…",
  tier: "ELITE",                      // Polymarket leaderboard tier (latest snapshot)
  latestLbRank: 34,

  latest: {                           // latest Source-A quality snapshot
    date: "2026-04-21", walletBase: 77.8, roiNorm: 67.8, rankNorm: 82,
    pnlNorm: 55, rank: 34, lifetimeRoi: 6.3, lifetimePnl: 412000,
  },
  positionsContext: {                 // latest Source-B leaderboard context
    sportROI: 6.3, sportPnlTotal: 412000, sportVol: 14000000,
    sportsLbPercentileTop: 3,
  },

  picks:     { n: 13, wins: 8, wr: 61.5, flatPnl: 1.28, flatRoi: 9.8 },
  positions: { n: 22, wins: 12, wr: 54.5, invested: 960279, settledPnl: 45427, dollarRoi: 4.7 },
                                      // ↑ VAULT + SHADOW — see Shadow Vault section
  sizeSignal: {                       // VAULT-only — own-median bucketing
    medianInvested: 42000,
    routine:  { n: 7, wr: 42.8, invested: 180000, settledPnl: -12000, dollarRoi: -6.7 },
    above:    { n: 5, wr: 60.0, invested: 340000, settledPnl: 18000,  dollarRoi: 5.3 },
    wayAbove: { n: 3, wr: 66.7, invested: 424079, settledPnl: 42627,  dollarRoi: 10.1 },
  },
  shadowSignal: {                     // SHADOW-only (may be null if N < 1)
    n: 7, wins: 4, wr: 57.1,
    invested: 16200, settledPnl: -3200, dollarRoi: -19.7,
    medianInvested: 2100,
  },

  bySport: {
    NBA: {
      picks:     { n: 8, wins: 5, wr: 62.5, flatPnl: 1.80, flatRoi: 22.5 },
      positions: { n: 9, wins: 6, wr: 66.7, invested: 540000, settledPnl: 40000, dollarRoi: 7.4 },
      isFlatProfitable:   true,
      isDollarProfitable: true,
      isWR50:             true,
      whitelistTier:      "CONFIRMED",  // CONFIRMED | FLAT | WR50 | null
    },
    NHL: { ... },
    MLB: { ... },
  },
  byMarket: { ML: {...}, SPREAD: {...}, TOTAL: {...} },

  // Phase 1 convenience arrays (O(1) reads for Phase 2):
  flatSports:      ["NBA", "NHL"],    // FLAT or CONFIRMED
  confirmedSports: ["NBA"],           // CONFIRMED only
  wr50Sports:      ["MLB"],           // WR50-only (not FLAT-profitable)
  topSport:        "NBA",             // best flat ROI among sports with ≥ 2 bets
  whitelistVersion: 1,                // bumped when classifyWhitelistTier rules change

  verdict: "CONFIRMED_WINNER",        // legacy ≥3-bet global label (superseded by whitelist)
  firstBetDate: "2026-04-17",
  lastBetDate:  "2026-04-21",
  updatedAt: <serverTimestamp>,
}
```

#### Whitelist tier classification

`classifyWhitelistTier(picksInSport, positionsInSport)` in `exportWalletProfiles.js` assigns one of four tiers per `(wallet, sport)` pair:

| Tier | Requires | Interpretation |
|---|---|---|
| **CONFIRMED** | `picks.n ≥ 2 AND picks.flatRoi > 0` **AND** `positions.n ≥ 2 AND positions.dollarRoi > 0` | Profitable in BOTH sources — highest-confidence badge. |
| **FLAT** | `picks.n ≥ 2 AND picks.flatRoi > 0` (Source B inconclusive / negative) | Flat-profitable on our graded pick-cards only. Default Phase 2 badge color. |
| **WR50** | `picks.n ≥ 2 AND picks.wr ≥ 50` (but flat ROI ≤ 0, i.e. winning often at bad prices) | Noisy signal, tracked but not badged. |
| **null** | Everything else or `< 2 bets` in the sport | No badge, excluded from Δ consensus math. |

Precedence: CONFIRMED > FLAT > WR50 > null. The ≥ 2-bet minimum matches the methodology used in [WALLET_WHITELIST_BACKTEST.md](./WALLET_WHITELIST_BACKTEST.md); as the sample grows past ~30 bets per wallet we expect to raise it to ≥ 3.

`WHITELIST_VERSION` is an integer stored on every profile and on the root `data/wallet-profiles.json`. Bump it whenever the classification rule changes so the UI can invalidate any cached reads that reference a stale rule set.

#### Monitoring artifacts

- `data/wallet-profiles.json` — full JSON mirror of what was upserted. Checked in so Git history itself becomes a low-frequency audit log.
- `WALLET_ROSTER.md` — human-readable roster of every wallet (sorted by verdict).
- `WALLET_PROFILES_SUMMARY.md` — **daily sanity-check artifact**. Shows population counts by verdict, per-sport whitelist-tier counts, top-10 FLAT-or-better wallets per sport, and a churn diff (wallet-sport tiers that changed vs. the prior run). Watch for excessive churn — if > 30% of wallet-sport tiers flip between runs the min-bet threshold is too loose.

#### Read contract for Phase 2 consumers

Phase 2 (UI badges + walletConsensus Δ) **must** read from `sharpWalletProfiles` and **must not** re-derive whitelist tiers from raw picks/positions at request time. Client code should:

1. Subscribe to `sharpWalletProfiles` once on mount and keep a `Map<walletShort, profile>` in memory.
2. For a badge lookup on wallet `w` for sport `s`: check `profile.bySport[s].whitelistTier` (may be `null`).
3. For walletConsensus Δ on a pick in sport `s`: for each wallet in the pick's `walletDetails`, count it as FOR-side if `w.side === pickedSide` AND its profile has `bySport[s].whitelistTier ∈ {CONFIRMED, FLAT}`; count AGAINST if on the other side with the same tier filter. WR50 does not participate.

This hard boundary keeps Phase 2 fast (no per-request aggregation) and means any whitelist-rule change propagates through a single code path — `classifyWhitelistTier`.

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
