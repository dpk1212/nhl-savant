# AGS-Unified — V12 Performance Monitor

**Generated:** Sunday, June 7, 2026 at 10:29 AM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 7

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (7 days ago), V12 has evaluated **160** picks, shipped **82** for real money (51.2% ship rate), and muted the other **78**. On the shipped picks V12 has gone **45-37** (54.9% win), staked **167.25u**, and returned **+11.46u** at **+6.9% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                              7 |
| Picks V12 has evaluated             |                            160 |
| Picks SHIPPED (units > 0)           |                             82 |
| Picks MUTED (score ≤ 0, FADE)       |                             78 |
| Ship rate                           |                          51.2% |
| Live W-L                            |                          45-37 |
| Live Win %                          |                          54.9% |
| Live PnL (units)                    |                         +11.46 |
| Live ROI                            |                          +6.9% |
| Avg PnL / day                       |                         +1.64u |
| Most recent action (2026-06-08)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **6.9% ROI** across 82 live picks (+11.46u real PnL).
- Mute rule is **saving money** — the 34 muted picks would have lost -5.14u at flat 1u (-15.1% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.64u/day** on average since launch.
- **ML** is V12's strongest market: 49 live, 28-21, +15.9% ROI.

### What to watch

- 🟡 **SPREAD** market is bleeding under V12: 5 live, 3-2, -50.7% ROI, -3.55u.

## § 2 — Model Version Comparison (V9 → V10 → V11 → V12)

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |    7 |     82 |  34 | 45-37  |  54.9% |      6.9% |     +11.46 |    +0.14 | 0.553 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +   22 |    +1.5pp |    +15.8pp |          +0.313 |   +0.004 |          — | 🟢 better |
| v12 − v10          | +   20 |    +6.5pp |    +25.6pp |          +0.453 |   +0.159 |          — | 🟢 better |
| v12 − v11          |   -29 |    -0.1pp |     +4.0pp |          +0.079 |   +0.109 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 76n 55.3% +5%  | 4n 25.0% -51%  | 2n 100.0% +86% | 82n 54.9% +7% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 20n -9%       | 19n +40%      | 18n -26%      | 13n +36%      | 10n -25%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## § 3 — What V12 Actually Is (Plain English)

Every prior AGS-Unified model (v9 → v11) was a **logistic regression** on a handful of hand-crafted features (count of sharp wallets FOR vs AGAINST, sum of sharp-wallet sizing ratios, leaderboard rank deltas, etc.). The score was a log-odds; ladder tiers were calibrated quintiles of that score; sizing was the v11 base × tier multiplier (2× / 1.5× / 1.1× / 0.5× / 0.2× / 0×).

**V12 is fundamentally different.** It's a **single feature** that summarises the *quality difference* between the sharp money on the FOR side and the sharp money on the AGAINST side, then maps that difference to an absolute stake.

Per pick:

1. **Score every wallet on each side** with a quality formula `Q = tierWeight × cappedROI × boundedSizeRatio × nReliab`. Sharper wallets (better historical ROI, higher leaderboard tier, larger reliable sample) get bigger Qs.
2. **Take the mean Q on each side.** `forMean` = average wallet quality FOR the pick; `againstMean` = average AGAINST.
3. **The V12 score is the bounded ratio of the difference:** `score = (forMean − againstMean) / max(|forMean|, |againstMean|, ε)`. Bounded to [-1, +1]. Positive = sharp money is meaningfully better-quality on the FOR side. Negative or zero = it isn't.

Three hard rules built on that score:

- **Mute rule:** if score ≤ 0, the pick is FADE — **zero stake, no exception**. This replaces v11's calibrated-quintile q20 floor.
- **Absolute ladder (no multiplier):** score band → fixed units. **ELITE 5.00u · PREMIUM 3.00u · LOCK 1.00u · LEAN 0.50u · WEAK 0.25u · FADE 0.00u.** The stake is the answer, not a multiplier on a per-market base.
- **Odds cap:** long underdogs at +100 / +151 / +200 thresholds are capped down to 2.5 / 1.5 / 1.0u respectively, regardless of tier. Prevents one bad +200 ELITE from blowing up the bankroll.

**Why this matters for monitoring.** V12 has no multi-feature attribution to audit — there's just **one** number, and either the wallet-quality formula is identifying sharper sides than the market is or it isn't. The sections below tell you exactly that, broken down by tier, sport, market, score band, and time.

## § 4 — V12 Daily Production Scoreboard

Day-by-day production since V12 went live. **Evaluated** = picks V12 scored that day. **Live** = picks shipped at units > 0 (real money). **Muted** = picks V12 rejected (score ≤ 0, FADE tier). **Cumulative PnL** is the running total of live unit profit/loss since launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-06-01 |        16 |    8 |     4 | 4-4        |  50.0% |     16.25 |      +2.14 |     13.2% |      +2.14 |
| 2026-06-02 |        24 |   10 |    10 | 4-6        |  40.0% |     19.75 |      +1.95 |      9.9% |      +4.09 |
| 2026-06-03 |        31 |   19 |     5 | 11-8       |  57.9% |     36.25 |      +0.82 |      2.3% |      +4.91 |
| 2026-06-04 |        19 |   13 |     5 | 7-6        |  53.8% |     26.00 |      -2.91 |    -11.2% |      +2.00 |
| 2026-06-05 |        23 |   18 |     1 | 12-6       |  66.7% |     31.25 |     +11.21 |     35.9% |     +13.21 |
| 2026-06-06 |        25 |   14 |     9 | 7-7        |  50.0% |     37.75 |      -1.75 |     -4.6% |     +11.46 |
| 2026-06-07 |        21 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +11.46 |
| 2026-06-08 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +11.46 |

> **Trajectory.** 🟡 Last 3 days (-4.6% ROI) is **-14.8pp worse** than the prior window (10.2%). Watch for further regression.

> **Bottom line.** 7 days live, 82 live picks shipped, **+11.46u total PnL** at **+6.9% ROI**, averaging **+1.64u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  20 | 10-10  |  50.0% |        +0.990 |    5.00u |            4.25u | -0.75u |       85.00 |      -7.99 |     -9.4% |
| PREMIUM  |  3.00u |  19 | 14-5   |  73.7% |        +0.975 |    3.00u |            2.84u | -0.16u |       54.00 |     +21.65 |     40.1% |
| LOCK     |  1.00u |  18 | 7-11   |  38.9% |        +0.959 |    1.00u |            1.00u | +0.00u |       18.00 |      -4.73 |    -26.3% |
| LEAN     |  0.50u |  13 | 9-4    |  69.2% |        +0.887 |    0.50u |            0.50u | +0.00u |        6.50 |      +2.35 |     36.2% |
| WEAK     |  0.25u |  10 | 4-6    |  40.0% |        +0.312 |    0.25u |            0.25u | +0.00u |        2.50 |      -0.63 |    -25.2% |
| FADE     |  0.00u |  34 | 0-0    |      — |        -0.251 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### Sizing pipeline integrity

🟢 **No sizing drift detected.** Every shipped V12 pick's actual stake matches the ladder target (after odds-cap) within ±0.05u. The sizing pipeline is healthy.

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 46n · 58.7% · +16.4%   | 3n · 66.7% · -54.5%    | 27n · 48.1% · -3.3%    | 76n · 55.3% · +4.6%    |
| NBA   | 2n · 0.0% · -100.0%    | 2n · 50.0% · -2.0%     | —                      | 4n · 25.0% · -51.0%    |
| NHL   | 1n · 100.0% · +64.0%   | —                      | 1n · 100.0% · +87.0%   | 2n · 100.0% · +85.9%   |
| **All** | **49n · 57.1% · +15.9%** | **5n · 60.0% · -50.7%** | **28n · 50.0% · +2.5%** | **82n · 54.9% · +6.9%** |

> **V12's strongest sub-market:** MLB ML — 46 live, 27-19, +16.4% ROI, +13.39u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  |  63 |     63 | 36-27  |    57.1% |   53.0% |     +4.2pp |      7.1% |
| 0.7 – 0.9          |   7 |      7 | 4-3    |    57.1% |   59.1% |     -1.9pp |     -0.6% |
| 0.5 – 0.7          |   2 |      2 | 2-0    |   100.0% |   57.0% |    +43.0pp |     78.0% |
| 0.25 – 0.5         |   3 |      3 | 1-2    |    33.3% |   58.8% |    -25.5pp |    -34.7% |
| (0, 0.25]          |   5 |      5 | 1-4    |    20.0% |   58.1% |    -38.1pp |    -60.8% |
| ≤ 0 (MUTED)        |  34 |      0 | 0-0    |    44.1% |   52.2% |     -8.1pp |         — |

> 🟢 **Strong-score band (> 0.9) wins 4.2pp more often than the market expects** — V12's high-confidence picks are real signal.

> 🟢 **Mute band (≤ 0) actually wins only 44.1%** — V12 correctly identifies these as losers. The mute rule is justified.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **34** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                   34 |
| Muted W-L                           |                15-19 |
| Muted Win %                         |                44.1% |
| Counterfactual PnL at flat 1u       |                -5.14 |
| Counterfactual ROI at flat 1u       |               -15.1% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-5.14u** at a flat 1u stake — a counterfactual ROI of **-15.1%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  114 |
| Spearman ρ (v11 vs V12 score)       |               -0.505 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.505. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 114 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +22.864 |                        2.2 |
| AGAINST |             +5.474 |                        1.2 |

### One-sided wallet support (high-variance picks)

- **7** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **0** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **5-1** (83.3% win) at **+55.0% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   1 |   1 |   2 |   3 |  10 |
| AGAINST |   0 |   0 |   1 |   2 |   5 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|
| 2026-06-06 | MLB   | ML     | St. Louis Cardinals     |  -126 | +0.981 | PREMIUM  | 3.00u | WIN     |      +2.38 |
| 2026-06-06 | MLB   | ML     | Philadelphia Phillies   |  -134 | +0.875 | LEAN     | 0.50u | LOSS    |      -0.50 |
| 2026-06-06 | MLB   | ML     | Los Angeles Dodgers     |  -350 | +0.974 | PREMIUM  | 3.00u | WIN     |      +0.86 |
| 2026-06-06 | MLB   | ML     | Houston Astros          |  -123 | +0.995 | ELITE    | 5.00u | WIN     |      +4.07 |
| 2026-06-06 | MLB   | ML     | Detroit Tigers          |  +112 | +0.989 | ELITE    | 2.50u | LOSS    |      -2.50 |
| 2026-06-06 | MLB   | ML     | Arizona Diamondbacks    |  -152 | +0.994 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-06 | MLB   | TOTAL  | Over 8.5                |  -109 | +0.595 | WEAK     | 0.25u | WIN     |      +0.23 |
| 2026-06-06 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.975 | PREMIUM  | 3.00u | WIN     |      +2.73 |
| 2026-06-06 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.969 | PREMIUM  | 3.00u | WIN     |      +2.73 |
| 2026-06-06 | MLB   | TOTAL  | Over 7.5                |  -107 | +0.966 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-06 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.989 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-06 | MLB   | TOTAL  | Under 8.5               |  +102 | +0.989 | ELITE    | 2.50u | LOSS    |      -2.50 |
| 2026-06-06 | MLB   | TOTAL  | Under 7.5               |  -109 | +0.978 | PREMIUM  | 3.00u | WIN     |      +2.75 |
| 2026-06-06 | MLB   | TOTAL  | Under 9.5               |  -110 | +0.960 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-05 | MLB   | ML     | Toronto Blue Jays       |  -145 | +0.308 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-05 | MLB   | ML     | Boston Red Sox          |  +128 | +0.931 | LEAN     | 0.50u | WIN     |      +0.64 |
| 2026-06-05 | MLB   | ML     | St. Louis Cardinals     |  -136 | +0.886 | LEAN     | 0.50u | WIN     |      +0.37 |
| 2026-06-05 | MLB   | ML     | Cleveland Guardians     |  -126 | +0.995 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-05 | MLB   | ML     | Philadelphia Phillies   |  -184 | +0.995 | ELITE    | 5.00u | WIN     |      +2.72 |
| 2026-06-05 | MLB   | ML     | Los Angeles Dodgers     |  -196 | +0.958 | LOCK     | 1.00u | WIN     |      +0.51 |
| 2026-06-05 | MLB   | ML     | Athletics               |  -105 | +0.959 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-05 | MLB   | ML     | Atlanta Braves          |  -142 | +0.946 | LOCK     | 1.00u | WIN     |      +0.70 |
| 2026-06-05 | MLB   | ML     | Detroit Tigers          |  +106 |     — | —        | 1.00u | WIN     |      +1.06 |
| 2026-06-05 | MLB   | ML     | Chicago Cubs            |  -172 | +0.959 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-05 | MLB   | ML     | Tampa Bay Rays          |  -138 | +0.972 | PREMIUM  | 3.00u | WIN     |      +2.17 |
| 2026-06-05 | NBA   | ML     | Spurs                   |  -230 | +0.190 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-05 | MLB   | SPREAD | Tampa Bay Rays          |  +126 | +0.906 | LEAN     | 0.50u | WIN     |      +0.63 |
| 2026-06-05 | NBA   | SPREAD | Spurs                   |  -105 | +0.083 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-05 | MLB   | TOTAL  | Over 8.5                |  -106 | +0.976 | PREMIUM  | 3.00u | WIN     |      +2.83 |
| 2026-06-05 | MLB   | TOTAL  | Over 9.5                |  -113 | +0.898 | LEAN     | 0.50u | WIN     |      +0.44 |

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.527 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.162 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.087 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.032 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.148 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |   80 |    +0.6173 |    -0.5050 | 0.0214 |  +0.146 |   0.944 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |   80 |    +0.3277 |    +0.2622 | 0.0221 |  +0.149 |   0.492 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |   80 |    +0.3636 |    -0.1862 | 0.0012 |  +0.034 |   2.406 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     |  80 |          -0.022 |           -0.014 |                   -0.036 |                   -0.127 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      |  80 |          -0.141 |           +0.269 |                   -0.144 |                   -0.027 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    |  80 |          -0.015 |           +0.165 |                   -0.025 |                   +0.092 | count of contributing FOR-side wallets                         |
| agsV12AgCount     |  80 |          -0.169 |           +0.014 |                   -0.141 |                   -0.015 | count of contributing AGAINST-side wallets                     |
| provenFor         |  80 |          -0.038 |           +0.196 |                   -0.047 |                   +0.106 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          |  80 |          -0.138 |           +0.077 |                   -0.131 |                   +0.000 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 12.075         |  27 | 15-12   |   55.6% |    +10.0% |
| MID (p33–p67)     | 19.950 … 22.500        |  26 | 17-9    |   65.4% |     +9.6% |
| HIGH (> p67)      | 48.906 … 45.000        |  27 | 12-15   |   44.4% |     -6.1% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |        80 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8781 | average score across live picks                                 |
| SD                |    0.2273 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.461 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +4.832 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.530 / +0.968 / +0.991 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.083 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |   74 | 41-33  |   55.4% |     +4.2% |  0.500 |        +0.073 | noise                                     |
| NBA   |    4 | 1-3    |   25.0% |    -51.0% |  0.667 |        -0.400 | strong (N<20)                             |
| NHL   |    2 | 2-0    |  100.0% |    +85.9% |      — |             — | — (N<20)                                  |

### 12F — Stability: rolling 7-day AUC across the V12 window

Recompute AUC on a moving 7-day window. If recent windows are degrading (e.g. dropping from 0.58 → 0.50 → 0.45), V12's edge is decaying in real time. Each row anchors on the END date of its window.

_(need at least 7 calendar days of V12 picks for a rolling window; currently have 6.)_

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +6.9% | [-18.5%, +31.8%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.9% | [43.8%, 66.3%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.527 | [0.388, 0.658]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |              8 | [-10, 26]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                        82 |
| Unique wallets ever on a FOR side            |                                                        38 |
| Avg FOR-side wallets per pick                |                                                      2.21 |
| Top-5 wallets' share of all FOR appearances  |                                                     51.4% |
| Top-10 wallets' share of all FOR appearances |                                                     70.7% |
| Top-20 wallets' share of all FOR appearances |                                                     87.3% |

> 🟡 **Top-5 wallets drive over 50% of FOR-side influence.** Concentrated risk — if any one of these wallets goes cold or stops betting, V12's signal degrades materially. Section 13B names them.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   35 |    3 | 21-14  |   60.0% |    +23.1% |    +13.48 |     0.93× | CONFIRMED   |     +6.5% |     173 | 2026-06-06 |
|    2 | 913987  | MLB        |   20 |    3 | 11-9   |   55.0% |     -9.2% |     -5.67 |     1.07× | CONFIRMED   |    +28.6% |      29 | 2026-06-06 |
|    3 | 70135d  | MLB,NBA    |   18 |   26 | 11-7   |   61.1% |     +6.9% |     +1.99 |     2.48× | CONFIRMED   |     -6.8% |     260 | 2026-06-06 |
|    4 | 7923c4  | MLB,NBA    |   11 |    2 | 7-4    |   63.6% |    +29.3% |     +4.54 |     0.94× | CONFIRMED   |    +15.4% |      74 | 2026-06-06 |
|    5 | eeabaf  | MLB,NBA    |    9 |    1 | 4-5    |   44.4% |    -14.5% |     -3.48 |     0.88× | CONFIRMED   |    +18.3% |      57 | 2026-06-06 |
|    6 | cd2f63  | MLB,NBA    |    9 |    7 | 3-6    |   33.3% |    -20.3% |     -3.20 |     1.32× | FLAT        |     -0.1% |     198 | 2026-06-05 |
|    7 | 1e8f33  | MLB        |    9 |    1 | 7-2    |   77.8% |    +19.6% |     +2.89 |     1.43× | CONFIRMED   |    +24.2% |      22 | 2026-06-06 |
|    8 | 9a69c2  | MLB        |    7 |   19 | 3-4    |   42.9% |    +27.4% |     +1.78 |     2.18× | CONFIRMED   |    -20.2% |      99 | 2026-06-06 |
|    9 | b19a27  | MLB,NBA    |    5 |    4 | 3-2    |   60.0% |     +5.5% |     +0.65 |     1.39× | CONFIRMED   |     -4.6% |     277 | 2026-06-06 |
|   10 | 8c1eae  | MLB,NBA    |    5 |    2 | 3-2    |   60.0% |    +60.2% |     +3.16 |     1.65× | CONFIRMED   |     -5.3% |      87 | 2026-06-04 |
|   11 | bc3532  | MLB,NBA,NHL |    5 |    6 | 2-3    |   40.0% |    -61.9% |     -2.32 |     3.58× | FLAT        |     +0.3% |     124 | 2026-06-05 |
|   12 | 10c684  | MLB,NBA    |    5 |    2 | 2-3    |   40.0% |     +0.5% |     +0.04 |     0.48× | CONFIRMED   |    -32.7% |      16 | 2026-06-06 |
|   13 | 491f30  | MLB        |    4 |    1 | 3-1    |   75.0% |    +95.8% |     +8.38 |     0.91× | CONFIRMED   |    +29.0% |       9 | 2026-06-03 |
|   14 | a0d6d2  | MLB,NBA    |    3 |    1 | 2-1    |   66.7% |    +48.5% |     +1.82 |     0.16× | CONFIRMED   |    +27.0% |      14 | 2026-06-04 |
|   15 | af1697  | NBA        |    3 |    0 | 0-3    |    0.0% |   -100.0% |     -0.75 |     2.47× | CONFIRMED   |     +2.5% |      16 | 2026-06-05 |
|   16 | 94600d  | MLB        |    2 |    2 | 0-2    |    0.0% |   -100.0% |     -5.25 |     1.01× | —           |    -11.0% |      15 | 2026-06-06 |
|   17 | f9e3d0  | MLB,NBA    |    2 |    0 | 1-1    |   50.0% |    +76.3% |     +2.48 |     2.87× | FLAT        |    +30.1% |       6 | 2026-06-05 |
|   18 | 4d2125  | NHL        |    2 |    0 | 2-0    |  100.0% |    +85.9% |     +4.51 |     0.39× | CONFIRMED   |     +4.8% |      10 | 2026-06-04 |
|   19 | dfa240  | MLB,NHL    |    2 |    0 | 1-1    |   50.0% |    +55.8% |     +3.35 |     0.88× | CONFIRMED   |    +22.7% |      28 | 2026-06-06 |
|   20 | 2e8da5  | NBA        |    2 |    0 | 0-2    |    0.0% |   -100.0% |     -0.50 |     2.60× | CONFIRMED   |    +38.9% |      13 | 2026-06-05 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 7923c4  | MLB,NBA    |   11 | 7-4    |   63.6% |     +29.3% |     +4.54 |     0.94× | 2026-06-06 |
|    2 | 4c64aa  | MLB        |   35 | 21-14  |   60.0% |     +23.1% |    +13.48 |     0.93× | 2026-06-06 |
|    3 | 70135d  | MLB,NBA    |   18 | 11-7   |   61.1% |      +6.9% |     +1.99 |     2.48× | 2026-06-06 |
|    4 | 913987  | MLB        |   20 | 11-9   |   55.0% |      -9.2% |     -5.67 |     1.07× | 2026-06-06 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 913987  | MLB        |   20 | 11-9   |   55.0% |      -9.2% |     -5.67 |     1.07× | 2026-06-06 |
|    2 | 70135d  | MLB,NBA    |   18 | 11-7   |   61.1% |      +6.9% |     +1.99 |     2.48× | 2026-06-06 |
|    3 | 4c64aa  | MLB        |   35 | 21-14  |   60.0% |     +23.1% |    +13.48 |     0.93× | 2026-06-06 |
|    4 | 7923c4  | MLB,NBA    |   11 | 7-4    |   63.6% |     +29.3% |     +4.54 |     0.94× | 2026-06-06 |

> 🔴 **1 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `913987` (FOR# 20, ROI -9.2%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    98 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    18 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     8 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    77 | 🟡 informational — AGS-U calibration controls sample adequacy |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

**Sizing-regression detail (LOCK+ tier shipped at 0u — money left on the table):**

| Doc ID                              | Sport | Tier    | AGS-U  | Outcome | "Lost" PnL (1u) |
|-------------------------------------|-------|---------|--------|---------|-----------------|
| 2026-05-18_MLB_bal_tbr              | MLB   | LOCK    |  +1.13 | LOSS    |           -1.00u |
| 2026-05-20_MLB_lad_sdp              | MLB   | LEAN    |  +0.42 | WIN     |           +0.51u |
| 2026-05-24_MLB_nym_mia_total        | MLB   | LOCK    |  +0.33 | WIN     |           +0.99u |
| 2026-05-26_MLB_col_lad_spread       | MLB   | LOCK    |  +0.28 | LOSS    |           -1.00u |
| 2026-05-26_NBA_sas_okc_spread       | NBA   | PREMIUM |  +0.32 | WIN     |           +0.98u |
| 2026-05-27_NHL_car_mtl_spread       | NHL   | ELITE   |  +0.59 | LOSS    |           -1.00u |
| 2026-05-27_MLB_chc_pit_total        | MLB   | LOCK    |  +0.15 | LOSS    |           -1.00u |
| 2026-05-27_MLB_mia_tor_total        | MLB   | PREMIUM |  +0.46 | WIN     |           +0.89u |
| 2026-05-28_NBA_okc_sas_spread       | NBA   | PREMIUM |  +0.51 | LOSS    |           -1.00u |
| 2026-05-28_MLB_laa_det_total        | MLB   | LOCK    |  +0.22 | WIN     |           +0.93u |
| 2026-05-30_NBA_sas_okc              | NBA   | PREMIUM |  +0.45 | LOSS    |           -1.00u |
| 2026-05-31_MLB_laa_tbr_spread       | MLB   | LOCK    |  +0.26 | LOSS    |           -1.00u |

## § 15 — Live Calibration Snapshot (V12 thresholds in use)

The live `agsCalibration/current` document — what the cron and UI both read at runtime to score & size every pick. **This is the actual thresholds V12 is using right now.**

- **Computed at:** 2026-06-06T14:20:30.777Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 842
- **Date range:** 2026-04-18 → 2026-06-05

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.983 | ELITE           | 5.00u                  |
| q60      |        +0.967 | PREMIUM         | 3.00u                  |
| q40      |        +0.932 | LOCK            | 1.00u                  |
| q20      |        +0.753 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            121 |        29 |    9 |    7 |   76 |                     45 |
| NBA   |            196 |        49 |   26 |   25 |   96 |                    100 |
| NHL   |            101 |        20 |    7 |   13 |   61 |                     40 |

> ⚠ **MLB pool is < 50% of NBA pool** (45 vs 100). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~398 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 316 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 80 / 316 (25%)    | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 80 / 316 (25%)    | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 80 / 316 (25%)    | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 80 / 316 (25%)    | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 80 / 316 (25%)    | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 80 / 316 (25%)    | Count of proven AGAINST-side wallets                                 |
| countMargin          | 80 / 316 (25%)    | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 316 / 316 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 316 / 316 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 316 / 316 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 316 / 316 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 316 / 316 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 316 / 316 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 316 / 316 (100%)  | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 316 / 316 (100%)  | Closing line value — how far line moved in our favour                |
| peakStars            | 316 / 316 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 316 / 316 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 174 / 316 (55%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 316 / 316 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 174 / 316 (55%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 174 / 316 (55%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 316 / 316 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 316 / 316 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 316 / 316 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 316 / 316 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 316 / 316 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | agsV12               |  80 |  🟢  |    +0.149 |    +0.087 |      +0.146 |      +0.032 |  0.527 |
|    2 | V12 agMean           |  80 |  🟢  |    -0.141 |    +0.269 |      -0.144 |      -0.027 |  0.433 |
|    3 | clv                  | 316 |      |    +0.129 |    +0.068 |      +0.142 |      +0.091 |  0.569 |
|    4 | V12 agCount          |  80 |  🟢  |    -0.169 |    +0.014 |      -0.141 |      -0.015 |  0.391 |
|    5 | provenTotal          | 316 |      |    -0.112 |    -0.040 |      -0.105 |      -0.082 |  0.432 |
|    6 | wd contribFor        | 316 |      |    -0.124 |    -0.237 |      -0.103 |      -0.141 |  0.444 |
|    7 | provenFor            | 316 |      |    -0.104 |    -0.070 |      -0.098 |      -0.109 |  0.439 |
|    8 | wd forCount          | 316 |      |    -0.110 |    -0.060 |      -0.095 |      -0.076 |  0.448 |
|    9 | wd agCount           | 174 |      |    -0.102 |    +0.172 |      -0.088 |      +0.061 |  0.449 |
|   10 | wd contribAg         | 316 |      |    -0.101 |    +0.061 |      -0.087 |      +0.022 |  0.456 |
|   11 | provenAg             | 316 |      |    -0.094 |    +0.152 |      -0.085 |      +0.057 |  0.454 |
|   12 | countMargin          |  80 |      |    +0.118 |    +0.152 |      +0.083 |      +0.083 |  0.569 |
|   13 | wd forAvgSize        | 316 |      |    -0.058 |    -0.113 |      -0.081 |      -0.135 |  0.485 |
|   14 | wd sizeMargin        | 174 |      |    -0.031 |    -0.126 |      -0.077 |      -0.148 |  0.479 |
|   15 | wd maxShare          | 316 |      |    +0.083 |    +0.085 |      +0.074 |      +0.073 |  0.555 |
|   16 | hcMargin             | 316 |      |    -0.049 |    +0.045 |      -0.071 |      -0.033 |  0.486 |
|   17 | wd maxForContrib     | 316 |      |    -0.081 |    -0.200 |      -0.063 |      -0.107 |  0.467 |
|   18 | wd contribMargin     | 316 |      |    -0.077 |    -0.238 |      -0.062 |      -0.128 |  0.462 |
|   19 | provenMargin         | 316 |      |    -0.047 |    -0.064 |      -0.048 |      -0.078 |  0.475 |
|   20 | peakStars            | 316 |      |    -0.024 |    +0.104 |      -0.045 |      -0.032 |  0.469 |
|   21 | V12 forMean          |  80 |  🟢  |    -0.022 |    -0.014 |      -0.036 |      -0.127 |  0.438 |
|   22 | ags (v11)            | 316 |      |    -0.005 |    -0.230 |      -0.030 |      -0.202 |  0.472 |
|   23 | wd agAvgSize         | 174 |      |    -0.074 |    -0.034 |      -0.028 |      -0.011 |  0.478 |
|   24 | V12 forCount         |  80 |  🟢  |    -0.015 |    +0.165 |      -0.025 |      +0.092 |  0.550 |
|   25 | qMargin              |  80 |  🟢  |    +0.010 |    +0.020 |      -0.003 |      -0.092 |  0.463 |
|   26 | lockPinnProb         | 316 |      |    +0.123 |    +0.134 |      -0.002 |      -0.139 |  0.561 |

> **Top 3 univariate features by PnL correlation:** `agsV12` (r = +0.146), `V12 agMean` (r = -0.144), `clv` (r = +0.142).

> 🟡 **Highest-ranked feature NOT used by V12:** `clv` — r(unit-ret) = +0.142, AUC = 0.569. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `agsV12` · r(unit-ret) = +0.146 · AUC = 0.527

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.944 … 0.595            |  27 | 16-11   |   59.3% |    +28.5% |
| MID (p33–p67)     | 0.976 … 0.960            |  26 | 13-13   |   50.0% |     -3.8% |
| HIGH (> p67)      | 0.986 … 0.978            |  27 | 15-12   |   55.6% |     +1.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 agMean` · r(unit-ret) = -0.144 · AUC = 0.433

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.000 … 0.000            |  66 | 39-27   |   59.1% |     +4.8% |
| MID (p33–p67)     | —                        |   0 | 0-0     |       — |         — |
| HIGH (> p67)      | 2.350 … 23.622           |  14 | 5-9     |   35.7% |   -107.6% |

#### `clv` · r(unit-ret) = +0.142 · AUC = 0.569

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -0.059 … -0.029          | 106 | 48-58   |   45.3% |     -7.4% |
| MID (p33–p67)     | 0.000 … 0.000            | 105 | 58-47   |   55.2% |     -0.2% |
| HIGH (> p67)      | 0.038 … 0.009            | 105 | 63-42   |   60.0% |     +7.4% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `V12 agCount` · r(unit-ret) = -0.141 · AUC = 0.391

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.000 … 0.000            |  53 | 33-20   |   62.3% |     +6.5% |
| MID (p33–p67)     | —                        |   0 | 0-0     |       — |         — |
| HIGH (> p67)      | 2.000 … 2.000            |  27 | 11-16   |   40.7% |    -12.6% |

#### `provenTotal` · r(unit-ret) = -0.105 · AUC = 0.432

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 2.000 … 1.000            | 152 | 89-63   |   58.6% |     +4.0% |
| MID (p33–p67)     | 3.000 … 3.000            |  73 | 39-34   |   53.4% |     +0.3% |
| HIGH (> p67)      | 13.000 … 4.000           |  91 | 41-50   |   45.1% |     -7.7% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | agsV12         | V12 agMean     | clv            | V12 agCount    | provenTotal    | wd contribFor  | provenFor      | wd forCount    |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| agsV12      |  1.000         |         -0.783 |         -0.010 |         -0.523 |         -0.551 |         -0.421 |         -0.486 |         -0.484 |
| V12 agMean  |         -0.783 |  1.000         |         +0.059 |         +0.628 |         +0.689 |         +0.633 |         +0.606 |         +0.588 |
| clv         |         -0.010 |         +0.059 |  1.000         |         +0.017 |         +0.187 |         +0.073 |         +0.158 |         +0.162 |
| V12 agCount |         -0.523 |         +0.628 |         +0.017 |  1.000         |         +0.751 |         +0.606 |         +0.562 |         +0.580 |
| provenTotal |         -0.551 |         +0.689 |         +0.187 |         +0.751 |  1.000         |         +0.855 |         +0.928 |         +0.891 |
| wd contribFor |         -0.421 |         +0.633 |         +0.073 |         +0.606 |         +0.855 |  1.000         |         +0.888 |         +0.915 |
| provenFor   |         -0.486 |         +0.606 |         +0.158 |         +0.562 |         +0.928 |         +0.888 |  1.000         |         +0.967 |
| wd forCount |         -0.484 |         +0.588 |         +0.162 |         +0.580 |         +0.891 |         +0.915 |         +0.967 |  1.000         |

> 🔴 **Strong collinearity detected:** `provenFor` and `wd forCount` have r = +0.967. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 80 picks · features = 8 (+ intercept) · multiple R² = **0.1991** · adjusted R² = **0.0961** · residual sd = 0.906

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | provenTotal          |     |    -0.5038 |   0.4626 | -1.09        |        1 |
|    2 | clv                  |     |    +0.4028 |   0.1127 | +3.58 (sig.) |        2 |
|    3 | provenFor            |     |    +0.3148 |   0.6146 | +0.51        |        3 |
|    4 | wd forCount          |     |    +0.1207 |   0.5179 | +0.23        |        4 |
|    5 | V12 agCount          |  🟢 |    +0.0944 |   0.2092 | +0.45        |        5 |
|    6 | wd contribFor        |     |    -0.0830 |   0.3014 | -0.28        |        6 |
|    7 | agsV12               |  🟢 |    +0.0696 |   0.1820 | +0.38        |        7 |
|    8 | V12 agMean           |  🟢 |    -0.0292 |   0.2111 | -0.14        |        8 |
| —    | (intercept)          |     |    +0.0371 |   0.1013 |    +0.37 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **3 / 8** top multivariate features are inputs to V12 (38%).
- V12 consumes: `V12 agCount` (β = +0.094), `agsV12` (β = +0.070), `V12 agMean` (β = -0.029)
- V12 IGNORES: `provenTotal` (β = -0.504, t = -1.09), `clv` (β = +0.403, t = +3.58), `provenFor` (β = +0.315, t = +0.51), `wd forCount` (β = +0.121, t = +0.23), `wd contribFor` (β = -0.083, t = -0.28)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.527 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.761 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.234.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~23.4pp.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `clv` (β = +0.403, t = +3.58). They have a real multivariate effect after controlling for V12's existing inputs.
- Sample size is currently 316 live picks — statistically meaningful but tight. Treat single-feature recommendations as provisional until N ≥ 500. The rankings will firm up as the daily cron accumulates more graded picks.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*