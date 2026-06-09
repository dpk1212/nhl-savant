# AGS-Unified — V12 Performance Monitor

**Generated:** Tuesday, June 9, 2026 at 5:42 AM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 9

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (9 days ago), V12 has evaluated **201** picks, shipped **119** for real money (59.2% ship rate), and muted the other **82**. On the shipped picks V12 has gone **67-52** (56.3% win), staked **241.50u**, and returned **+25.03u** at **+10.4% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                              9 |
| Picks V12 has evaluated             |                            201 |
| Picks SHIPPED (units > 0)           |                            119 |
| Picks MUTED (score ≤ 0, FADE)       |                             82 |
| Ship rate                           |                          59.2% |
| Live W-L                            |                          67-52 |
| Live Win %                          |                          56.3% |
| Live PnL (units)                    |                         +25.03 |
| Live ROI                            |                         +10.4% |
| Avg PnL / day                       |                         +2.78u |
| Most recent action (2026-06-09)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **10.4% ROI** across 119 live picks (+25.03u real PnL).
- Mute rule is **saving money** — the 45 muted picks would have lost -3.39u at flat 1u (-7.5% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+2.78u/day** on average since launch.
- **NBA** is V12's strongest sport: 7 live, 2-5, 35.7% ROI, +2.59u.
- **ML** is V12's strongest market: 68 live, 41-27, +23.3% ROI.

## § 2 — Model Version Comparison (V9 → V10 → V11 → V12)

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |    9 |    119 |  45 | 67-52  |  56.3% |     10.4% |     +25.03 |    +0.21 | 0.550 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +   59 |    +3.0pp |    +19.3pp |          +0.383 |   +0.001 |          — | 🟢 better |
| v12 − v10          | +   57 |    +7.9pp |    +29.1pp |          +0.524 |   +0.156 |          — | 🟢 better |
| v12 − v11          | +    8 |    +1.3pp |     +7.5pp |          +0.149 |   +0.106 |          — | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 110n 57.3% +8% | 7n 28.6% +36%  | 2n 100.0% +86% | 119n 56.3% +10% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 25n +2%       | 32n +26%      | 24n -21%      | 19n +22%      | 15n -11%      | 🟡 partial (0) |

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
| 2026-06-07 |        38 |   25 |     6 | 15-10      |  60.0% |     45.50 |      +3.55 |      7.8% |     +15.01 |
| 2026-06-08 |        19 |   12 |     5 | 7-5        |  58.3% |     28.75 |     +10.02 |     34.9% |     +25.03 |
| 2026-06-09 |         6 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +25.03 |

> **Trajectory.** 🟢 Last 3 days (18.3% ROI) is **+11.4pp better** than the prior window (6.9%). V12 is accelerating.

> **Bottom line.** 9 days live, 119 live picks shipped, **+25.03u total PnL** at **+10.4% ROI**, averaging **+2.78u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  25 | 14-11  |  56.0% |        +0.990 |    5.00u |            4.30u | -0.70u |      107.50 |      +2.23 |      2.1% |
| PREMIUM  |  3.00u |  32 | 22-10  |  68.8% |        +0.975 |    3.00u |            2.84u | -0.16u |       91.00 |     +23.96 |     26.3% |
| LOCK     |  1.00u |  24 | 10-14  |  41.7% |        +0.959 |    1.00u |            1.00u | +0.00u |       24.00 |      -5.12 |    -21.3% |
| LEAN     |  0.50u |  19 | 12-7   |  63.2% |        +0.878 |    0.50u |            0.50u | +0.00u |        9.50 |      +2.13 |     22.4% |
| WEAK     |  0.25u |  15 | 7-8    |  46.7% |        +0.344 |    0.25u |            0.25u | +0.00u |        3.75 |      -0.42 |    -11.2% |
| FADE     |  0.00u |  45 | 0-0    |      — |        -0.270 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### Sizing pipeline integrity

🟢 **No sizing drift detected.** Every shipped V12 pick's actual stake matches the ladder target (after odds-cap) within ±0.05u. The sizing pipeline is healthy.

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 64n · 62.5% · +24.0%   | 5n · 80.0% · +17.8%    | 41n · 46.3% · -10.6%   | 110n · 57.3% · +7.8%   |
| NBA   | 3n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 1n · 0.0% · -100.0%    | 7n · 28.6% · +35.7%    |
| NHL   | 1n · 100.0% · +64.0%   | —                      | 1n · 100.0% · +87.0%   | 2n · 100.0% · +85.9%   |
| **All** | **68n · 60.3% · +23.3%** | **8n · 75.0% · +37.3%** | **43n · 46.5% · -7.0%** | **119n · 56.3% · +10.4%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  |  88 |     88 | 52-36  |    59.1% |   53.1% |     +6.0pp |     10.6% |
| 0.7 – 0.9          |  12 |     12 | 6-6    |    50.0% |   55.5% |     -5.5pp |    -11.5% |
| 0.5 – 0.7          |   4 |      4 | 3-1    |    75.0% |   58.8% |    +16.2pp |     36.0% |
| 0.25 – 0.5         |   4 |      4 | 2-2    |    50.0% |   57.0% |     -7.0pp |     -5.0% |
| (0, 0.25]          |   7 |      7 | 2-5    |    28.6% |   56.7% |    -28.1pp |    -41.7% |
| ≤ 0 (MUTED)        |  45 |      0 | 0-0    |    48.9% |   52.4% |     -3.6pp |         — |

> 🟢 **Strong-score band (> 0.9) wins 6.0pp more often than the market expects** — V12's high-confidence picks are real signal.

> 🟢 **Mute band (≤ 0) actually wins only 48.9%** — V12 correctly identifies these as losers. The mute rule is justified.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **45** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                   45 |
| Muted W-L                           |                22-23 |
| Muted Win %                         |                48.9% |
| Counterfactual PnL at flat 1u       |                -3.39 |
| Counterfactual ROI at flat 1u       |                -7.5% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-3.39u** at a flat 1u stake — a counterfactual ROI of **-7.5%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  160 |
| Spearman ρ (v11 vs V12 score)       |               -0.478 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.478. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 160 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +22.505 |                        2.3 |
| AGAINST |             +5.914 |                        1.3 |

### One-sided wallet support (high-variance picks)

- **11** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **0** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **6-4** (60.0% win) at **+16.8% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   1 |   1 |   2 |   3 |  10 |
| AGAINST |   0 |   0 |   1 |   2 |   6 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|
| 2026-06-08 | MLB   | ML     | Boston Red Sox          |  -109 | +0.974 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-08 | MLB   | ML     | San Diego Padres        |  -132 | +0.978 | PREMIUM  | 3.00u | WIN     |      +2.27 |
| 2026-06-08 | MLB   | ML     | Houston Astros          |  -130 | +0.977 | PREMIUM  | 3.00u | WIN     |      +2.31 |
| 2026-06-08 | MLB   | ML     | Milwaukee Brewers       |  -150 | +0.968 | PREMIUM  | 3.00u | WIN     |      +2.00 |
| 2026-06-08 | MLB   | ML     | Cleveland Guardians     |  -124 | +0.953 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-08 | MLB   | ML     | Washington Nationals    |  +151 | +0.983 | PREMIUM  | 1.50u | WIN     |      +2.27 |
| 2026-06-08 | NBA   | ML     | Knicks                  |  -124 | +0.086 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-08 | NBA   | SPREAD | Spurs                   |  -115 | +0.989 | ELITE    | 5.00u | WIN     |      +4.35 |
| 2026-06-08 | MLB   | TOTAL  | Under 7.5               |  -101 | +0.983 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-08 | MLB   | TOTAL  | Over 7.5                |  +102 | +0.975 | PREMIUM  | 2.50u | WIN     |      +2.55 |
| 2026-06-08 | MLB   | TOTAL  | Under 8                 |  +101 | +0.991 | ELITE    | 2.50u | WIN     |      +2.52 |
| 2026-06-08 | NBA   | TOTAL  | Under 216               |  -108 | +0.948 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-07 | MLB   | ML     | Toronto Blue Jays       |  -136 | +0.975 | PREMIUM  | 3.00u | WIN     |      +2.21 |
| 2026-06-07 | MLB   | ML     | St. Louis Cardinals     |  -143 | +0.986 | ELITE    | 5.00u | WIN     |      +3.50 |
| 2026-06-07 | MLB   | ML     | Texas Rangers           |  -138 | +0.964 | LOCK     | 1.00u | WIN     |      +0.72 |
| 2026-06-07 | MLB   | ML     | Philadelphia Phillies   |  -170 | +0.970 | PREMIUM  | 3.00u | WIN     |      +1.76 |
| 2026-06-07 | MLB   | ML     | Kansas City Royals      |  -120 | +0.438 | WEAK     | 0.25u | WIN     |      +0.21 |
| 2026-06-07 | MLB   | ML     | Los Angeles Dodgers     |  -200 | +0.667 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-07 | MLB   | ML     | Colorado Rockies        |  +154 | +0.867 | LEAN     | 0.50u | LOSS    |      -0.50 |
| 2026-06-07 | MLB   | ML     | Houston Astros          |  -105 | +0.951 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-07 | MLB   | ML     | Detroit Tigers          |  -112 | +0.902 | LEAN     | 0.50u | WIN     |      +0.45 |
| 2026-06-07 | MLB   | ML     | San Francisco Giants    |  +113 | +0.236 | WEAK     | 0.25u | WIN     |      +0.28 |
| 2026-06-07 | MLB   | ML     | Miami Marlins           |  -102 | +0.961 | LOCK     | 1.00u | WIN     |      +0.98 |
| 2026-06-07 | MLB   | ML     | Arizona Diamondbacks    |  -132 | +0.743 | LEAN     | 0.50u | WIN     |      +0.38 |
| 2026-06-07 | MLB   | SPREAD | Pittsburgh Pirates      |  -155 | +0.973 | PREMIUM  | 3.00u | WIN     |      +1.94 |
| 2026-06-07 | MLB   | SPREAD | Seattle Mariners        |  +164 |     — | —        | 2.25u | WIN     |      +3.69 |
| 2026-06-07 | MLB   | TOTAL  | Over 8                  |  -111 | +0.866 | LEAN     | 0.50u | LOSS    |      -0.50 |
| 2026-06-07 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.973 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-07 | MLB   | TOTAL  | Under 9.5               |  -110 | +0.971 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-07 | MLB   | TOTAL  | Over 8.5                |  -115 | +0.611 | WEAK     | 0.25u | WIN     |      +0.22 |

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.554 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.148 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.089 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.057 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.115 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟢 **Modest but real** — score has measurable edge

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  115 |    +0.4621 |    -0.3421 | 0.0117 |  +0.108 |   0.942 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  115 |    +0.2588 |    +0.3384 | 0.0134 |  +0.116 |   0.492 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  115 |    +0.4912 |    -0.2324 | 0.0021 |  +0.046 |   2.350 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 115 |          +0.067 |           +0.066 |                   +0.055 |                   -0.043 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 115 |          -0.088 |           +0.305 |                   -0.092 |                   +0.017 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 115 |          -0.123 |           +0.149 |                   -0.135 |                   +0.033 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 115 |          -0.038 |           +0.168 |                   -0.016 |                   +0.083 | count of contributing AGAINST-side wallets                     |
| provenFor         | 115 |          -0.119 |           +0.189 |                   -0.129 |                   +0.047 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 115 |          -0.021 |           +0.240 |                   -0.018 |                   +0.081 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 9.073          |  39 | 21-18   |   53.8% |     +4.6% |
| MID (p33–p67)     | 19.950 … 19.650        |  38 | 23-15   |   60.5% |     +5.3% |
| HIGH (> p67)      | 48.906 … 52.180        |  38 | 21-17   |   55.3% |     +0.7% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       115 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8764 | average score across live picks                                 |
| SD                |    0.2230 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.457 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +4.929 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.561 / +0.968 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.083 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  106 | 61-45  |   57.5% |     +7.0% |  0.517 |        +0.033 | noise                                     |
| NBA   |    7 | 2-5    |   28.6% |    +35.7% |  0.800 |        +0.464 | strong (N<20)                             |
| NHL   |    2 | 2-0    |  100.0% |    +85.9% |      — |             — | — (N<20)                                  |

### 12F — Stability: rolling 7-day AUC across the V12 window

Recompute AUC on a moving 7-day window. If recent windows are degrading (e.g. dropping from 0.58 → 0.50 → 0.45), V12's edge is decaying in real time. Each row anchors on the END date of its window.

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    |
|------------|------|------|--------|---------|-----------|--------|
| 2026-06-07 |    7 |  103 | 58-45  |   56.3% |     +6.2% |  0.523 |
| 2026-06-08 |    7 |  108 | 61-47  |   56.5% |     +9.3% |  0.552 |

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |         +10.4% | [-9.9%, +30.5%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          56.3% | [47.0%, 65.2%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.554 | [0.444, 0.662]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             15 | [-7, 35]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       119 |
| Unique wallets ever on a FOR side            |                                                        52 |
| Avg FOR-side wallets per pick                |                                                      2.23 |
| Top-5 wallets' share of all FOR appearances  |                                                     48.3% |
| Top-10 wallets' share of all FOR appearances |                                                     67.5% |
| Top-20 wallets' share of all FOR appearances |                                                     83.0% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   48 |    4 | 30-18  |   62.5% |    +26.7% |    +21.57 |     0.91× | CONFIRMED   |     +8.5% |     191 | 2026-06-08 |
|    2 | 70135d  | MLB,NBA    |   26 |   41 | 14-12  |   53.8% |     +5.4% |     +2.38 |     1.93× | CONFIRMED   |    -10.3% |     293 | 2026-06-08 |
|    3 | 913987  | MLB        |   24 |    4 | 15-9   |   62.5% |     -0.4% |     -0.26 |     1.07× | CONFIRMED   |    +31.5% |      37 | 2026-06-08 |
|    4 | 1e8f33  | MLB        |   16 |    3 | 11-5   |   68.8% |     +9.6% |     +3.64 |     1.22× | CONFIRMED   |     +8.2% |      33 | 2026-06-08 |
|    5 | 7923c4  | MLB,NBA    |   14 |    3 | 9-5    |   64.3% |    +44.5% |     +9.80 |     0.86× | CONFIRMED   |    +13.9% |      80 | 2026-06-07 |
|    6 | eeabaf  | MLB,NBA    |   13 |    1 | 5-8    |   38.5% |    -33.5% |    -12.21 |     0.71× | CONFIRMED   |    +14.7% |      61 | 2026-06-08 |
|    7 | cd2f63  | MLB,NBA    |   13 |    8 | 4-9    |   30.8% |    -12.4% |     -3.10 |     1.11× | FLAT        |     -0.3% |     206 | 2026-06-08 |
|    8 | 9a69c2  | MLB        |    9 |   27 | 4-5    |   44.4% |    +24.2% |     +2.54 |     2.18× | CONFIRMED   |    -23.1% |     112 | 2026-06-08 |
|    9 | 491f30  | MLB        |    8 |    1 | 5-3    |   62.5% |    +53.0% |     +9.68 |     0.93× | CONFIRMED   |    +19.0% |      13 | 2026-06-08 |
|   10 | 10c684  | MLB,NBA    |    8 |    3 | 2-6    |   25.0% |    -32.3% |     -3.71 |     2.11× | FLAT        |    -36.5% |      23 | 2026-06-08 |
|   11 | 8c1eae  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |    +53.8% |     +4.71 |     1.79× | CONFIRMED   |     -6.0% |      94 | 2026-06-08 |
|   12 | b19a27  | MLB,NBA    |    6 |    4 | 3-3    |   50.0% |    -15.9% |     -2.35 |     1.34× | CONFIRMED   |     -5.0% |     278 | 2026-06-07 |
|   13 | bc3532  | MLB,NBA,NHL |    6 |    8 | 2-4    |   33.3% |    -69.9% |     -3.32 |     3.04× | FLAT        |     +0.1% |     128 | 2026-06-08 |
|   14 | 2f2a9e  | MLB        |    5 |    4 | 2-3    |   40.0% |     +5.3% |     +0.52 |     0.31× | CONFIRMED   |    -12.4% |      17 | 2026-06-08 |
|   15 | a0d6d2  | MLB,NBA    |    3 |    1 | 2-1    |   66.7% |    +48.5% |     +1.82 |     0.16× | CONFIRMED   |    +27.0% |      14 | 2026-06-04 |
|   16 | e05213  | MLB        |    3 |    2 | 3-0    |  100.0% |    +96.9% |     +5.57 |     1.05× | CONFIRMED   |    +67.0% |       8 | 2026-06-08 |
|   17 | af1697  | NBA        |    3 |    0 | 0-3    |    0.0% |   -100.0% |     -0.75 |     2.47× | CONFIRMED   |     +2.5% |      16 | 2026-06-05 |
|   18 | f2d227  | MLB,NBA    |    3 |    0 | 2-1    |   66.7% |    -63.7% |     -2.39 |     0.64× | CONFIRMED   |    -29.1% |      23 | 2026-06-08 |
|   19 | 972768  | MLB        |    3 |    2 | 2-1    |   66.7% |    +18.4% |     +0.23 |     1.02× | CONFIRMED   | +Infinity% |      37 | 2026-06-07 |
|   20 | 94600d  | MLB        |    2 |    2 | 0-2    |    0.0% |   -100.0% |     -5.25 |     1.01× | WR50        |     -4.3% |      16 | 2026-06-06 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 7923c4  | MLB,NBA    |   14 | 9-5    |   64.3% |     +44.5% |     +9.80 |     0.86× | 2026-06-07 |
|    2 | 4c64aa  | MLB        |   48 | 30-18  |   62.5% |     +26.7% |    +21.57 |     0.91× | 2026-06-08 |
|    3 | 1e8f33  | MLB        |   16 | 11-5   |   68.8% |      +9.6% |     +3.64 |     1.22× | 2026-06-08 |
|    4 | 70135d  | MLB,NBA    |   26 | 14-12  |   53.8% |      +5.4% |     +2.38 |     1.93× | 2026-06-08 |
|    5 | 913987  | MLB        |   24 | 15-9   |   62.5% |      -0.4% |     -0.26 |     1.07× | 2026-06-08 |
|    6 | cd2f63  | MLB,NBA    |   13 | 4-9    |   30.8% |     -12.4% |     -3.10 |     1.11× | 2026-06-08 |
|    7 | eeabaf  | MLB,NBA    |   13 | 5-8    |   38.5% |     -33.5% |    -12.21 |     0.71× | 2026-06-08 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | eeabaf  | MLB,NBA    |   13 | 5-8    |   38.5% |     -33.5% |    -12.21 |     0.71× | 2026-06-08 |
|    2 | cd2f63  | MLB,NBA    |   13 | 4-9    |   30.8% |     -12.4% |     -3.10 |     1.11× | 2026-06-08 |
|    3 | 913987  | MLB        |   24 | 15-9   |   62.5% |      -0.4% |     -0.26 |     1.07× | 2026-06-08 |
|    4 | 70135d  | MLB,NBA    |   26 | 14-12  |   53.8% |      +5.4% |     +2.38 |     1.93× | 2026-06-08 |
|    5 | 1e8f33  | MLB        |   16 | 11-5   |   68.8% |      +9.6% |     +3.64 |     1.22× | 2026-06-08 |
|    6 | 4c64aa  | MLB        |   48 | 30-18  |   62.5% |     +26.7% |    +21.57 |     0.91× | 2026-06-08 |
|    7 | 7923c4  | MLB,NBA    |   14 | 9-5    |   64.3% |     +44.5% |     +9.80 |     0.86× | 2026-06-07 |

> 🔴 **2 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `eeabaf` (FOR# 13, ROI -33.5%), `cd2f63` (FOR# 13, ROI -12.4%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   110 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     5 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     5 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    80 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

- **Computed at:** 2026-06-08T16:39:21.274Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 905
- **Date range:** 2026-04-18 → 2026-06-07

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.984 | ELITE           | 5.00u                  |
| q60      |        +0.967 | PREMIUM         | 3.00u                  |
| q40      |        +0.931 | LOCK            | 1.00u                  |
| q20      |        +0.743 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            122 |        31 |    9 |    9 |   73 |                     49 |
| NBA   |            203 |        52 |   27 |   24 |  100 |                    103 |
| NHL   |            101 |        20 |    7 |   13 |   61 |                     40 |

> ⚠ **MLB pool is < 50% of NBA pool** (49 vs 103). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~446 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 353 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 115 / 353 (33%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 115 / 353 (33%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 115 / 353 (33%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 115 / 353 (33%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 115 / 353 (33%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 115 / 353 (33%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 115 / 353 (33%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 353 / 353 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 353 / 353 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 353 / 353 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 353 / 353 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 353 / 353 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 353 / 353 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 353 / 353 (100%)  | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 352 / 353 (100%)  | Closing line value — how far line moved in our favour                |
| peakStars            | 353 / 353 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 353 / 353 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 200 / 353 (57%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 353 / 353 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 200 / 353 (57%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 200 / 353 (57%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 353 / 353 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 353 / 353 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 353 / 353 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 353 / 353 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 353 / 353 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | clv                  | 352 |      |    +0.128 |    +0.079 |      +0.140 |      +0.096 |  0.574 |
|    2 | countMargin          | 115 |      |    -0.108 |    -0.005 |      -0.139 |      -0.057 |  0.437 |
|    3 | V12 forCount         | 115 |  🟢  |    -0.123 |    +0.149 |      -0.135 |      +0.033 |  0.466 |
|    4 | wd forCount          | 353 |      |    -0.139 |    -0.069 |      -0.129 |      -0.090 |  0.429 |
|    5 | wd contribFor        | 353 |      |    -0.141 |    -0.220 |      -0.124 |      -0.143 |  0.437 |
|    6 | provenFor            | 353 |      |    -0.126 |    -0.068 |      -0.124 |      -0.115 |  0.425 |
|    7 | agsV12               | 115 |  🟢  |    +0.116 |    +0.089 |      +0.108 |      +0.057 |  0.554 |
|    8 | provenTotal          | 353 |      |    -0.111 |    -0.001 |      -0.106 |      -0.069 |  0.439 |
|    9 | provenMargin         | 353 |      |    -0.101 |    -0.133 |      -0.104 |      -0.117 |  0.448 |
|   10 | wd contribMargin     | 353 |      |    -0.114 |    -0.268 |      -0.104 |      -0.155 |  0.439 |
|   11 | V12 agMean           | 115 |  🟢  |    -0.088 |    +0.305 |      -0.092 |      +0.017 |  0.473 |
|   12 | wd maxShare          | 353 |      |    +0.091 |    +0.068 |      +0.086 |      +0.067 |  0.559 |
|   13 | qMargin              | 115 |  🟢  |    +0.093 |    +0.105 |      +0.082 |      -0.009 |  0.550 |
|   14 | hcMargin             | 353 |      |    -0.053 |    +0.054 |      -0.076 |      -0.034 |  0.480 |
|   15 | wd contribAg         | 353 |      |    -0.086 |    +0.105 |      -0.073 |      +0.045 |  0.478 |
|   16 | wd forAvgSize        | 353 |      |    -0.042 |    -0.090 |      -0.064 |      -0.111 |  0.500 |
|   17 | wd agCount           | 200 |      |    -0.070 |    +0.239 |      -0.059 |      +0.094 |  0.473 |
|   18 | V12 forMean          | 115 |  🟢  |    +0.067 |    +0.066 |      +0.055 |      -0.043 |  0.522 |
|   19 | wd agAvgSize         | 200 |      |    -0.095 |    -0.022 |      -0.054 |      -0.011 |  0.475 |
|   20 | wd sizeMargin        | 200 |      |    -0.010 |    -0.134 |      -0.052 |      -0.137 |  0.485 |
|   21 | provenAg             | 353 |      |    -0.057 |    +0.206 |      -0.051 |      +0.080 |  0.480 |
|   22 | wd maxForContrib     | 353 |      |    -0.063 |    -0.159 |      -0.049 |      -0.088 |  0.478 |
|   23 | ags (v11)            | 353 |      |    -0.022 |    -0.271 |      -0.046 |      -0.215 |  0.448 |
|   24 | peakStars            | 353 |      |    -0.015 |    +0.096 |      -0.034 |      -0.031 |  0.475 |
|   25 | V12 agCount          | 115 |  🟢  |    -0.038 |    +0.168 |      -0.016 |      +0.083 |  0.502 |
|   26 | lockPinnProb         | 353 |      |    +0.124 |    +0.138 |      +0.006 |      -0.137 |  0.562 |

> **Top 3 univariate features by PnL correlation:** `clv` (r = +0.140), `countMargin` (r = -0.139), `V12 forCount` (r = -0.135).

> 🟡 **Highest-ranked feature NOT used by V12:** `clv` — r(unit-ret) = +0.140, AUC = 0.574. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `clv` · r(unit-ret) = +0.140 · AUC = 0.574

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -0.059 … -0.014          | 118 | 53-65   |   44.9% |     -7.4% |
| MID (p33–p67)     | 0.000 … -0.002           | 117 | 68-49   |   58.1% |     +2.6% |
| HIGH (> p67)      | 0.038 … 0.005            | 117 | 70-47   |   59.8% |     +7.7% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `countMargin` · r(unit-ret) = -0.139 · AUC = 0.437

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -1.000 … -1.000          |  54 | 33-21   |   61.1% |     +7.9% |
| MID (p33–p67)     | 1.000 … 1.000            |  25 | 11-14   |   44.0% |     -6.9% |
| HIGH (> p67)      | 3.000 … 3.000            |  36 | 21-15   |   58.3% |     +2.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forCount` · r(unit-ret) = -0.135 · AUC = 0.466

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            |  53 | 28-25   |   52.8% |     +1.2% |
| MID (p33–p67)     | 2.000 … 2.000            |  28 | 21-7    |   75.0% |    +16.3% |
| HIGH (> p67)      | 3.000 … 3.000            |  34 | 16-18   |   47.1% |    -11.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd forCount` · r(unit-ret) = -0.129 · AUC = 0.429

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 2.000 … 1.000            | 228 | 132-96  |   57.9% |     +4.3% |
| MID (p33–p67)     | 3.000 … 3.000            |  64 | 32-32   |   50.0% |     -3.4% |
| HIGH (> p67)      | 4.000 … 11.000           |  61 | 27-34   |   44.3% |     -8.9% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd contribFor` · r(unit-ret) = -0.124 · AUC = 0.437

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 49.800 … 55.100          | 118 | 68-50   |   57.6% |     +4.6% |
| MID (p33–p67)     | 89.000 … 106.100         | 117 | 71-46   |   60.7% |     +4.9% |
| HIGH (> p67)      | 212.200 … 125.600        | 118 | 52-66   |   44.1% |     -7.5% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | clv            | countMargin    | V12 forCount   | wd forCount    | wd contribFor  | provenFor      | agsV12         | provenTotal    |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| clv         |  1.000         |         +0.039 |         +0.071 |         +0.076 |         +0.022 |         +0.085 |         -0.035 |         +0.123 |
| countMargin |         +0.039 |  1.000         |         +0.736 |         +0.706 |         +0.564 |         +0.670 |         -0.075 |         +0.390 |
| V12 forCount |         +0.071 |         +0.736 |  1.000         |         +0.988 |         +0.911 |         +0.943 |         -0.455 |         +0.851 |
| wd forCount |         +0.076 |         +0.706 |         +0.988 |  1.000         |         +0.928 |         +0.958 |         -0.467 |         +0.871 |
| wd contribFor |         +0.022 |         +0.564 |         +0.911 |         +0.928 |  1.000         |         +0.898 |         -0.459 |         +0.867 |
| provenFor   |         +0.085 |         +0.670 |         +0.943 |         +0.958 |         +0.898 |  1.000         |         -0.475 |         +0.921 |
| agsV12      |         -0.035 |         -0.075 |         -0.455 |         -0.467 |         -0.459 |         -0.475 |  1.000         |         -0.560 |
| provenTotal |         +0.123 |         +0.390 |         +0.851 |         +0.871 |         +0.867 |         +0.921 |         -0.560 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forCount` and `wd forCount` have r = +0.988. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 114 picks · features = 8 (+ intercept) · multiple R² = **0.1392** · adjusted R² = **0.0647** · residual sd = 0.915

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | V12 forCount         |  🟢 |    +0.5065 |   0.6275 | +0.81        |        1 |
|    2 | wd forCount          |     |    -0.4226 |   0.7001 | -0.60        |        2 |
|    3 | clv                  |     |    +0.3112 |   0.0892 | +3.49 (sig.) |        3 |
|    4 | countMargin          |     |    -0.2051 |   0.2355 | -0.87        |        4 |
|    5 | provenFor            |     |    +0.1284 |   0.5082 | +0.25        |        5 |
|    6 | agsV12               |  🟢 |    +0.1072 |   0.1085 | +0.99        |        6 |
|    7 | provenTotal          |     |    -0.1007 |   0.4002 | -0.25        |        7 |
|    8 | wd contribFor        |     |    -0.0736 |   0.2531 | -0.29        |        8 |
| —    | (intercept)          |     |    +0.0721 |   0.0857 |    +0.84 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forCount` (β = +0.507), `agsV12` (β = +0.107)
- V12 IGNORES: `wd forCount` (β = -0.423, t = -0.60), `clv` (β = +0.311, t = +3.49), `countMargin` (β = -0.205, t = -0.87), `provenFor` (β = +0.128, t = +0.25), `provenTotal` (β = -0.101, t = -0.25), `wd contribFor` (β = -0.074, t = -0.29)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.556 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.696 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.140.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~14.0pp.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `clv` (β = +0.311, t = +3.49). They have a real multivariate effect after controlling for V12's existing inputs.
- Sample size is currently 353 live picks — statistically meaningful but tight. Treat single-feature recommendations as provisional until N ≥ 500. The rankings will firm up as the daily cron accumulates more graded picks.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*