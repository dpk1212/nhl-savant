# WALLET PREDICTIVENESS PLAYBOOK

_Last updated: 2026-04-30 · Author: Sharp Intel research · Status: **Findings finalized — backtest pending**_

This is the consolidated record of the wallet-feature predictiveness study. It captures **(a)** the question we set out to answer, **(b)** the methodology and how to re-run it, **(c)** the headline findings, and **(d)** the proposed changes broken out by surface (Sharp Intel vs Sharp Vault).

The companion artifact `WALLET_FEATURE_PREDICTIVENESS.md` holds the raw output (tables, regression coefficients, cross-cuts). This playbook is the higher-level synthesis and the launch pad for the backtest.

---

## §0. TL;DR

> Outside the game-level Δw / Δq margins, the wallet-level feature that carries the most additive signal is `whitelistTier`. **CONFIRMED** wallets win at 59.3% (+9.7pp lift over Pinnacle); **FLAT** wallets win at 43.6% (−5.1pp lift). Today both tiers count equally toward Δw — the data says they should not. Conviction sizing (`betMultiplier`) is an **amplifier** of the underlying tier, not an independent skill signal.

The two highest-leverage Sharp Intel changes:

1. **Drop `FLAT` from Δw counting** — only `CONFIRMED` is counted as a "proven winner."
2. **Add a `HIGH-CONVICTION CONFIRMED` weight** — `CONFIRMED` wallets at ≥ 1.5× betMultiplier count double (or are weighted by `log(betMultiplier)`).

These two changes are the **explicit subject of the next-session backtest** (see §6).

---

## §1. The question

> Outside of our game-level Δw / Δq margins, can we use what we know about each individual wallet — their lifetime record, leaderboard standing, our custom whitelist tier, our `walletBase` score, their conviction sizing — to predict which positions hit?

In other words: today Sharp Intel's lock decisions and unit sizing are driven by **counts** of CONFIRMED + FLAT wallets on each side. Are some of those wallets predictably better or worse than others, and if so, what dimension separates them?

---

## §2. What we analyzed

### Data

| Field | Value |
|---|---|
| Source collection | `sharp_action_positions` (`status == 'GRADED'`) |
| Sample window | All graded positions in the collection as of 2026-04-30 |
| Rows | **1,913** wallet × side outcomes |
| Distinct wallets | **118** |
| Distinct games | **93** |
| Sports | MLB · NBA · NHL |
| Markets | ML · SPREAD · TOTAL |
| Outcome | `settledPnl > 0` → win (1), else loss (0) |

Each row is one wallet's bet on one side of one market. The outcome is realized cash PnL on the position (so it accounts for actual entry price, not a hypothetical replay price). Where we report **Flat ROI**, we replay every bet at 1u against the wallet's `avgPrice` to neutralize odds level.

### Features evaluated (16 total)

| Bucket | Features |
|---|---|
| **Skill credentials** (Sharp Intel-derived) | `whitelistTier` (CONFIRMED / FLAT / WR50 / NULL), `qualificationTier` (VAULT / SHADOW) |
| **Lifetime record** (Polymarket-public) | `sportROI`, `sportPnlTotal`, `sportVol`, `totalPnl`, `leaderboardRank` |
| **v8 composite scores** | `v8_walletBase`, `v8_walletRoiNorm`, `v8_walletContribution`, `v8_contribTier` |
| **Conviction sizing** | `betMultiplier`, `v8_convictionMult`, `v8_sizeRatio` |
| **Game-level Δ signals** (broadcast to every wallet on the game) | `vault_winnerMargin` (Δw), `vault_qualityMargin` (Δq), `v8_walletPlayScore` |

### The skill metric

For every feature × bucket we compute three numbers:

| Metric | Formula | What it measures |
|---|---|---|
| Win rate | `wins / n` | Raw success rate |
| Flat ROI | `Σ (replay PnL @ 1u vs avgPrice) / n` | Profitability after neutralising odds level |
| **Lift over Pinnacle implied** | `WR − mean(pinnacleImplied)` | The residual we are trying to attribute to skill |

> Lift > 0 means the bucket beats the market's implied probability. That's the truest skill measure — it asks "did wallets in this bucket beat the line?" rather than "did they win more often?" (which can be an artifact of taking favourites).

### Logistic regression spec

```
P(win) = σ(b + β1·marketImpliedZ + β2·feature_z)
```

- `marketImpliedZ`: standardised market-implied probability per row. We use the wallet's `avgPrice` as the entry-time market estimate (Pinnacle was missing on most rows; `avgPrice` is the price the wallet actually got).
- L2-regularised gradient descent. Each feature is fit on top of the market-implied baseline so we read off the **additive** contribution.
- Reported as **McFadden pseudo-R²**, with `Δ vs baseline` showing the marginal lift.

---

## §3. How to re-run the analysis

### Generate the report

```bash
cd nhl-savant
node scripts/walletFeaturePredictiveness.js                # full run, writes WALLET_FEATURE_PREDICTIVENESS.md
node scripts/walletFeaturePredictiveness.js --vault-only   # restrict to qualificationTier == VAULT
node scripts/walletFeaturePredictiveness.js --console-only # console preview, no file write
```

The script reads from `sharp_action_positions` (Source B) joined to `sharpWalletProfiles` (whitelistTier source) and writes `nhl-savant/WALLET_FEATURE_PREDICTIVENESS.md`.

### When to re-run

- After every fresh batch of graded positions (weekly is sufficient).
- After any change to `exportWalletProfiles.js` (which assigns `whitelistTier`).
- After any change to v8 wallet scoring (`v8_walletBase`, `v8_convictionMult`, etc.).

### Sanity-check checklist after a re-run

1. `whitelistTier == CONFIRMED` lift should remain **strongly positive** (≥ +5pp). If it collapses, our profile-export logic is mis-tagging.
2. `whitelistTier == FLAT` lift should remain **non-positive** (≤ +0pp). If FLAT starts winning, the cohort has shifted and we should reconsider §5 changes.
3. Combined-model pseudo-R² should remain ≥ 0.025 (currently 0.0311). If it drops, our wallet features are losing edge — investigate before backtests.
4. Sample size in `CONFIRMED ≥ 1.5×` cells (§3a in the raw report) should be ≥ 100. Below that, the +13–14pp cells are no longer credibly distinct from variance.

---

## §4. Headline findings

| # | Finding | Evidence |
|---|---|---|
| 1 | **`whitelistTier` is the single most predictive wallet feature.** CONFIRMED hits 59.3% WR / +9.7pp lift; NULL hits 45.1% / −7.0pp lift — a 14pp WR spread, the largest of any feature tested. | §2a |
| 2 | **`FLAT` is a bleeder.** 43.6% WR, −9.7% flat ROI, −5.1pp lift. The dollar-PnL gate that separates CONFIRMED from FLAT does real work — FLAT wallets are picks-side profitable but their actual stakes lose money. | §2a |
| 3 | **Conviction × tier is the highest-edge interaction.** CONFIRMED at ≥ 1.5× → 63%–70% WR, +13–14pp lift. FLAT at the same conviction → 26% WR, −23pp lift. Conviction **amplifies** signal; it does not create it. | §3a |
| 4 | **Lifetime sport ROI does not predict the next bet.** Q1 (≤ 2%) and Q5 (> 8.4%) are statistically indistinguishable (~49% WR, ~−2pp lift each). | §2b |
| 5 | **`v8_walletBase` is INVERSELY correlated with WR.** Top quintile (> 71): 47% WR / −3.7pp lift. Bottom quintile (≤ 41): 51% WR / +0.3pp lift. Our composite is overweighting features (lifetime ROI, LB rank) that don't predict. | §2f |
| 6 | **LB rank TOP-50 underperforms** (46.4% WR, −3.8pp lift). The on-chain leaderboard reflects all-time cross-sport results; it does not capture current sport-specific sharpness. | §2e |
| 7 | **Game-level `vault_winnerMargin` (Δw) is the strongest individual numeric predictor in the regression** (Δ pseudo-R² = +0.0079). Combined with `v8_convictionMult` and `v8_walletPlayScore`, the model lifts pseudo-R² from 0.0201 → 0.0311 — a **55%** improvement in explanatory power. | §4 |

The data in one sentence: **whitelistTier and conviction are the only wallet-level signals worth their seat at the table; everything else (lifetime ROI, LB rank, walletBase, sport volume) is noise or worse.**

---

## §5. Proposed changes

The findings have implications for two surfaces. The recommendations are split accordingly.

### §5.A. Sharp Intel (the picks pipeline)

Sharp Intel today aggregates wallets per game-side into Δw / Δq, which drive `lockTier`, star rating, and unit sizing. The two highest-leverage changes:

| # | Change | Mechanism | Expected effect | Risk |
|---|---|---|---|---|
| **1** | **Drop `FLAT` from Δw counting** | In `computeWalletConsensus` (and any backfill), count only `whitelistTier == CONFIRMED` toward `Δw`. `FLAT` is demoted to neutral (does not contribute either way). | Removes the −5pp drag from FLAT. Cleaner signal-to-noise. Cohort sizes: MLB whitelist 7→4, NBA 25→19, NHL 10→7. | Lower volume of `Δw`-eligible signal. May shrink LOCK count short-term. **This is the primary subject of §6 backtest.** |
| **2** | **`HIGH-CONVICTION CONFIRMED` weighting** | When a CONFIRMED wallet has `betMultiplier ≥ 1.5×`, its contribution to Δw counts as 2 (or as `1 + log2(betMultiplier)` capped at 3). | Captures the +13–14pp cells in §3a — the highest-edge sub-population in the data. | Conviction sizing is volatile session-to-session; need ≥ 1.5× threshold to filter noise. **Also part of §6 backtest.** |
| 3 | Stop using `walletBase` / `v8_walletContribution` as a positive promotion signal | Today they inform star scaling and feed Δq via the T30 contribution cut. The data says high `walletBase` is anti-correlated with WR (finding #5). | Cleaner star scaling. Modest Δq accuracy gain. | Star ladders need re-validation. |
| 4 | Demote raw LB rank to tiebreaker only | Sharp Intel uses `rankNorm` inside `walletBase`; that pathway should be deprecated. | Removes a false-precision signal. | Cosmetic-mostly. |
| 5 | Surface conviction on Sharp Intel cards | When a CONFIRMED wallet sized a position ≥ 1.5×, surface that fact ("CONFIRMED wallet placing 3× bet") in the card UI. | Lets the user distinguish 54% WR routine from 70% WR conviction-amplified. | UI work only. |

### §5.B. Sharp Vault (the wallet-positions UI)

The Sharp Vault product surfaces individual `sharp_action_positions` cards with credibility badges (TOP 50 / TOP 500 / ELITE PLAY / HIGH CONVICTION). The data says some of those badges are aspirational. The Sharp Vault changes:

| # | Change | Mechanism | Why |
|---|---|---|---|
| V1 | **Add `whitelistTier` as the headline credential** on each Vault card | Replace (or co-anchor) the existing "ELITE PLAY" / TOP-50 badge with `CONFIRMED` / `FLAT` / `WR50` / `UNRANKED`. | CONFIRMED is +9.7pp lift; TOP-50 is −3.8pp lift. The current headline is the wrong credential. |
| V2 | **Tier-gate the `HIGH CONVICTION` label** | Only show "HIGH CONVICTION" when wallet is CONFIRMED **and** `betMultiplier ≥ 1.5×`. | A FLAT-tier wallet at 3× is a 26% WR trap — labelling it HIGH CONVICTION is misleading. |
| V3 | **Demote (or recolor) the TOP-50 / TOP-500 badge** | Treat as neutral information, not a positive credential. | The badge currently signals credibility it does not earn (finding #6). |
| V4 | **De-emphasize lifetime sport ROI / PnL** in the card layout | Move the "+9.4% ROI / $484K lifetime" stat below the fold; replace headline with `whitelistTier` + trailing-N WR. | Lifetime ROI is non-predictive (finding #4). |
| V5 | **Sort/rank Vault cards by `whitelistTier` × `betMultiplier`** | "Today's best Vault picks" surfaces CONFIRMED-at-3× before SHADOW-at-large-stake. | Aligns presentation order with the data's predictive ordering. |

These Sharp Vault changes are independent of the Sharp Intel changes and can ship in parallel.

### §5.C. Cross-cutting

- The whitelist gating logic in `exportWalletProfiles.js` is **validated**. The CONFIRMED ↔ FLAT ↔ WR50 ↔ NULL split tracks predictive power (each tier is monotone in lift). No change required to the bar itself; only to how downstream consumers treat the tiers.
- All references to "proven winner" in code/UI should be migrated to mean **CONFIRMED only**, not CONFIRMED + FLAT.

---

## §6. Backtest plan

### Three arms

The backtest answers three distinct questions, not one:

| Arm | Question | What changes | Configs |
|---|---|---|---|
| **TIGHTEN** | Among current LOCKED picks, can we predict losers and demote them? | Same v7 matrix; Δw drops FLAT (and/or HC-weights CONFIRMED). | A, B, AB |
| **LOOSEN** | Among current LEAN/MUTED picks, can we identify hidden winners we missed? | Same v7 matrix; HC-CONFIRMED weighting promotes Σ=3,4 picks into Σ≥5. | B, AB |
| **REPLACE** | Can we drop the Δq / Σ matrix and lock on tier-weighted CONFIRMED counts alone? | New rule; ignore Δq entirely. | R1, R2, R3 |

### Configs

| Config | Δw rule | Δq used? | Lock floor |
|---|---|---|---|
| `v7_status_quo` | `(CONF+FLAT)_for − (CONF+FLAT)_ag` | Yes | `Δw ≥ 1 ∧ Δq ≥ 1 ∧ Σ ≥ 5` |
| `A_drop_flat` | `CONF_for − CONF_ag` | Yes | same matrix, Δw_A |
| `B_hc_weight` | `(CONF + HC_CONF)_for − (CONF + HC_CONF)_ag` (HC = `sizeRatio ≥ 1.5×`) | Yes | same matrix, Δw_B |
| `AB_combined` | drop FLAT + HC-weight CONFIRMED | Yes | same matrix, Δw_AB |
| `R1_pure_count` | n/a | **No** | `(CONF_for − CONF_ag) ≥ 2` |
| `R2_pure_hc` | n/a | **No** | `HC_CONF_for ≥ 1 ∧ HC_CONF_ag = 0` |
| `R3_replace` | n/a | **No** | `R1 OR R2` |

### Two lenses to handle lookahead bias

Today's `whitelistTier` is a current-state snapshot, not a time-series. A wallet that's CONFIRMED today wasn't necessarily CONFIRMED on April 18. Using today's tier on a past pick is **lookahead bias**. We address it without a separate profile rebuild by replaying tier qualification dates inline:

For each wallet × sport, walk Source A (`walletDetails` from graded picks, chronologically) and Source B (`sharp_action_positions`, chronologically) and record the first date the wallet would have qualified for each tier:

| Tier | First-qualified date condition |
|---|---|
| `WR50` | first date where `picks.n ≥ 2` AND `picks.wr ≥ 50%` |
| `FLAT` | first date where `picks.n ≥ 2` AND `picks.flatRoi > 0` |
| `CONFIRMED` | first date where `picks.n ≥ 2` AND `picks.flatRoi > 0` AND `positions.n ≥ 2` AND `positions.dollarRoi > 0` |

Then in the backtest, when scoring a pick on date `D`, a wallet only counts as CONFIRMED if `wallet.firstConfirmedDate[sport] ≤ D`. Wallets count as their **point-in-time tier**, not their current tier.

The backtest reports under three lenses:

| Lens | Definition | Use |
|---|---|---|
| **L1: Today's tiers** | Use `profiles[wallet].bySport[sport].whitelistTier` directly | Upper bound — "best case if we had perfect knowledge" |
| **L2: Point-in-time tiers** | Use the date-appropriate tier per the qualification timeline above | The number we trust for shipping |
| **L3: Bias diagnostic** | For each pick, count contributors whose tier on pickDate differed from today | Tells us how much L1 and L2 should diverge |

### Pre-registered decision rule (calibrated to vault findings)

Ship a config if **all** conditions for its arm are met. Calibration tied to the Wallet Feature Predictiveness analysis effect sizes (CONFIRMED +9.7pp lift, FLAT −5.1pp lift, HC-CONFIRMED +13–14pp lift):

| Arm | Ship if all of: |
|---|---|
| **TIGHTEN** (drop FLAT) | `AVOIDED` bucket WR ≤ 45% (we dodged real losers, calibrated to FLAT's raw 43.6% WR), AND L2 net WR delta ≥ +2pp on combined LOCKED set, AND volume drop ≤ 30% |
| **LOOSEN** (HC-CONFIRMED weight) | `PROMOTED` bucket WR ≥ 56% (calibrated to halfway between baseline 50% and HC ceiling), AND L2 net WR delta ≥ +1.5pp on combined LOCKED set |
| **REPLACE** (R1/R2/R3) | LOCKED WR ≥ 55%, AND flat ROI ≥ +5%, AND volume within ±50% of status quo, AND holds in ≥ 2 of 3 sports |

If a config fails its arm's rule but the L1 lens shows a much larger improvement than L2 (i.e. lookahead-bias-driven optimism), kill the change — it's likely an artifact.

### Source code surface

- Backtest reads from `sharpFlowPicks` / `sharpFlowSpreads` / `sharpFlowTotals` (graded sides), `sharpWalletProfiles` (current tiers), and `sharp_action_positions` (for Source B chronological reconstruction).
- Each graded side already has `peak.v8Scoring.walletDetails[]` with every contributor's `wallet`, `side`, and `sizeRatio` (= betMultiplier). No re-fetch needed.

### Deliverable

`WALLET_PREDICTIVENESS_BACKTEST.md`:

- §1. Sample inventory + status-quo baseline (matches dailyV6Report).
- §2. Per-config aggregate metrics under L1 and L2 (WR / flat ROI / peak-unit ROI / volume / per-sport).
- §3. Confusion matrices (PRESERVED / AVOIDED / PROMOTED) per config.
- §4. Pick-level diff table for the most consequential transitions.
- §5. REPLACE-arm threshold sweep (`Δw_CONF ≥ k` for k = 1..3, etc.).
- §6. Bias diagnostic: tier-mismatch distribution.
- §7. Pre-registered decision applied → ship/kill verdict per config.

---

## §7. Open questions / future work

1. **Sample-size question**: the `CONFIRMED ≥ 1.5×` cells have N=111 and N=113. Is +13–14pp lift stable to `±10` swing in N? Worth re-running monthly until N ≥ 250 in each cell.
2. **Adversarial selection**: do CONFIRMED wallets get "punished" by the market on the next bet? I.e. does the line move against them by default? We have entry price, line at lock, and grading price for every position — could quantify line shading on CONFIRMED bets.
3. **Drift detection**: a CONFIRMED wallet today might decay tomorrow. Should we add a rolling-window WR check (e.g. last 30 picks) inside the CONFIRMED tier and demote stale winners?
4. **`v8_walletContribution > 75` cohort hits 53% WR / −0.8pp lift** (§2g) — modestly positive. There may be a non-linear sweet spot in the contribution score that's getting lost when we treat it as a quintile-monotone signal. Worth a follow-up cut.
5. **`vault_winnerMargin` is the strongest single numeric predictor.** Today it's already the headline lock driver. The §6 backtest will tell us how much of that strength is being diluted by FLAT contamination.

### Sharp Vault follow-ups (deferred per user)

The user explicitly wants to revisit Sharp Vault product changes (§5.B) in a separate conversation after the backtest is complete. Things to come back to:

- Mockups of the new Vault card layout with `whitelistTier`-headline.
- The tier-gate logic for `HIGH CONVICTION`.
- Sort-order changes for the Vault feed.
- Whether to add a `B_CONFIRMED` tier (from the earlier "hidden winners" analysis) that would surface Source-B-only profitable wallets in the Vault — separate from Sharp Intel's `Δw` universe.

---

## Appendix A. Companion artifacts

| File | Contents |
|---|---|
| `WALLET_FEATURE_PREDICTIVENESS.md` | Raw analytic output — all tables, regression coefficients, cross-cuts. Generated by the script. |
| `scripts/walletFeaturePredictiveness.js` | The analysis script. See §3 of this playbook for invocations. |
| `WALLET_PIPELINE_AUDIT.md` | End-to-end wallet tracking pipeline audit (Source A + Source B + profile collection). |
| `PROVEN_WINNERS_ROSTER.md` | Current CONFIRMED + FLAT roster per sport, with the explicit qualification bar. |
| `HIDDEN_WINNERS.md` | Source-B-only wallets that look profitable but aren't in `walletDetails` on graded picks. |
| `MLB_WALLET_DIAGNOSTICS.md` | Diagnostic on the MLB-specific roster-growth plateau. |

## Appendix B. Glossary

| Term | Meaning |
|---|---|
| Δw / `vault_winnerMargin` | (count of CONFIRMED + FLAT wallets on consensus side) − (count on opposing side). Today's primary lock driver. |
| Δq / `vault_qualityMargin` | (Σ contribution scores above T30 cut on consensus side) − (same on opposing side). |
| Σ | Δw + Δq. ≥ 5 → LOCKED, ∈ {3,4} → LEAN, ≤ 2 → MUTED (at the v7.0 floor). |
| `whitelistTier` | CONFIRMED (Source A flat-ROI > 0 **and** Source B dollar-ROI > 0, both N ≥ 2) · FLAT (only Source A passes) · WR50 (Source A WR ≥ 50% but flat ROI ≤ 0) · NULL (in profile but below bar). Defined in `exportWalletProfiles.js`. |
| `betMultiplier` | `invested / avgSportBet` for the wallet on this position. ≥ 1.5× = above-average conviction. |
| `qualificationTier` | VAULT (wallet meets minimum Polymarket sample size + activity bar) vs SHADOW. Sharp Intel currently emits both into walletDetails; Sharp Vault filters to VAULT only. |
| `v8_walletBase` | Composite quality score 0–100 = weighted blend of `roiNorm`, `pnlNorm`, `rankNorm`. Anti-correlated with WR per finding #5. |
| `v8_convictionMult` | Multiplier applied to `walletBase` based on `betMultiplier`. Caps at 3.0. |
| `v8_walletContribution` | `v8_walletBase × v8_convictionMult`. T30 cut feeds Δq. |
| Lift over Pinnacle | `actual WR − market-implied WR`. The skill residual we are trying to attribute. |
| Pseudo-R² | McFadden pseudo-R² from logistic regression. Δ vs baseline = additive explanatory power of a feature on top of market-implied probability. |
