# AGS-Unified — V12 Performance Monitor

**Generated:** Thursday, June 11, 2026 at 12:37 PM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 11

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (11 days ago), V12 has evaluated **260** picks, shipped **163** for real money (62.7% ship rate), and muted the other **97**. On the shipped picks V12 has gone **88-75** (54.0% win), staked **342.25u**, and returned **+29.05u** at **+8.5% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             11 |
| Picks V12 has evaluated             |                            260 |
| Picks SHIPPED (units > 0)           |                            163 |
| Picks MUTED (score ≤ 0, FADE)       |                             97 |
| Ship rate                           |                          62.7% |
| Live W-L                            |                          88-75 |
| Live Win %                          |                          54.0% |
| Live PnL (units)                    |                         +29.05 |
| Live ROI                            |                          +8.5% |
| Avg PnL / day                       |                         +2.64u |
| Most recent action (2026-06-13)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **8.5% ROI** across 163 live picks (+29.05u real PnL).
- Mute rule is **saving money** — the 54 muted picks would have lost -3.83u at flat 1u (-7.1% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+2.64u/day** on average since launch.
- **NBA** is V12's strongest sport: 9 live, 3-6, 33.3% ROI, +2.58u.
- **SPREAD** is V12's strongest market: 10 live, 8-2, +52.4% ROI.

## § 2 — Model Version Comparison (V9 → V10 → V11 → V12)

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   11 |    163 |  54 | 88-75  |  54.0% |      8.5% |     +29.05 |    +0.18 | 0.542 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  103 |    +0.7pp |    +17.4pp |          +0.351 |   -0.007 |          — | 🟡 mixed |
| v12 − v10          | +  101 |    +5.6pp |    +27.2pp |          +0.491 |   +0.148 |          — | 🟢 better |
| v12 − v11          | +   52 |    -1.0pp |     +5.7pp |          +0.117 |   +0.098 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 150n 54.7% +8% | 9n 33.3% +33%  | 4n 75.0% +15%  | 163n 54.0% +8% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 37n +4%       | 42n +24%      | 37n -25%      | 23n +17%      | 20n -14%      | 🟡 partial (0) |

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
| 2026-06-09 |        25 |   21 |     4 | 10-11      |  47.6% |     45.00 |     +14.08 |     31.3% |     +39.11 |
| 2026-06-10 |        31 |   23 |     5 | 11-12      |  47.8% |     55.75 |     -10.06 |    -18.0% |     +29.05 |
| 2026-06-11 |         8 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +29.05 |
| 2026-06-13 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +29.05 |

> **Trajectory.** 🟡 Last 3 days (-18.0% ROI) is **-31.7pp worse** than the prior window (13.7%). Watch for further regression.

> **Bottom line.** 11 days live, 163 live picks shipped, **+29.05u total PnL** at **+8.5% ROI**, averaging **+2.64u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  37 | 21-16  |  56.8% |        +0.990 |    5.00u |            4.46u | -0.54u |      165.00 |      +6.59 |      4.0% |
| PREMIUM  |  3.00u |  42 | 28-14  |  66.7% |        +0.976 |    3.00u |            2.81u | -0.19u |      118.00 |     +28.18 |     23.9% |
| LOCK     |  1.00u |  37 | 14-23  |  37.8% |        +0.956 |    1.00u |            1.00u | +0.00u |       37.00 |      -9.26 |    -25.0% |
| LEAN     |  0.50u |  23 | 14-9   |  60.9% |        +0.877 |    0.50u |            0.50u | +0.00u |       11.50 |      +2.01 |     17.5% |
| WEAK     |  0.25u |  20 | 9-11   |  45.0% |        +0.369 |    0.25u |            0.25u | +0.00u |        5.00 |      -0.72 |    -14.4% |
| FADE     |  0.00u |  54 | 0-0    |      — |        -0.271 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### Sizing pipeline integrity

🟢 **No sizing drift detected.** Every shipped V12 pick's actual stake matches the ladder target (after odds-cap) within ±0.05u. The sizing pipeline is healthy.

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 89n · 55.1% · +13.1%   | 6n · 83.3% · +31.5%    | 55n · 50.9% · -0.2%    | 150n · 54.7% · +7.7%   |
| NBA   | 4n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 9n · 33.3% · +33.3%    |
| NHL   | 1n · 100.0% · +64.0%   | 1n · 100.0% · +215.0%  | 2n · 50.0% · -6.5%     | 4n · 75.0% · +14.8%    |
| **All** | **94n · 53.2% · +12.5%** | **10n · 80.0% · +52.4%** | **59n · 50.8% · -1.1%** | **163n · 54.0% · +8.5%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  | 124 |    124 | 69-55  |    55.6% |   52.5% |     +3.1pp |      8.6% |
| 0.7 – 0.9          |  17 |     17 | 10-7   |    58.8% |   55.1% |     +3.7pp |      1.7% |
| 0.5 – 0.7          |   4 |      4 | 3-1    |    75.0% |   58.8% |    +16.2pp |     36.0% |
| 0.25 – 0.5         |   6 |      6 | 2-4    |    33.3% |   53.1% |    -19.7pp |    -36.7% |
| (0, 0.25]          |   8 |      8 | 2-6    |    25.0% |   56.4% |    -31.4pp |    -49.0% |
| ≤ 0 (MUTED)        |  52 |      0 | 0-0    |    50.0% |   52.2% |     -2.2pp |         — |

> 🟢 **Strong-score band (> 0.9) wins 3.1pp more often than the market expects** — V12's high-confidence picks are real signal.

> 🟡 **Mute band wins 50.0%** — roughly coin-flip. The mute rule isn't obviously wrong, but it's not capturing strong rejection either. §8 quantifies the dollar impact.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **54** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                   54 |
| Muted W-L                           |                26-28 |
| Muted Win %                         |                48.1% |
| Counterfactual PnL at flat 1u       |                -3.83 |
| Counterfactual ROI at flat 1u       |                -7.1% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-3.83u** at a flat 1u stake — a counterfactual ROI of **-7.1%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  211 |
| Spearman ρ (v11 vs V12 score)       |               -0.388 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.388. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 211 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +23.957 |                        2.2 |
| AGAINST |             +5.076 |                        1.2 |

### One-sided wallet support (high-variance picks)

- **15** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **0** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **7-6** (53.8% win) at **+9.8% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   1 |   1 |   2 |   3 |   9 |
| AGAINST |   0 |   0 |   1 |   2 |   6 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|
| 2026-06-10 | MLB   | ML     | Atlanta Braves          |  -148 | +0.984 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-10 | MLB   | ML     | Boston Red Sox          |  +136 | +0.947 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-10 | MLB   | ML     | Chicago Cubs            |  -172 | +0.959 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-10 | MLB   | ML     | Cincinnati Reds         |  +136 | +0.918 | LEAN     | 0.50u | LOSS    |      -0.50 |
| 2026-06-10 | MLB   | ML     | Los Angeles Angels      |  -117 | +0.720 | WEAK     | 0.25u | WIN     |      +0.21 |
| 2026-06-10 | MLB   | ML     | Pittsburgh Pirates      |  +166 | +0.926 | LOCK     | 1.00u | WIN     |      +1.66 |
| 2026-06-10 | MLB   | ML     | Milwaukee Brewers       |  -104 | +0.992 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-10 | MLB   | ML     | Minnesota Twins         |  +146 | +0.932 | LOCK     | 1.00u | WIN     |      +1.46 |
| 2026-06-10 | MLB   | ML     | Baltimore Orioles       |  +103 | +0.984 | PREMIUM  | 2.50u | WIN     |      +2.58 |
| 2026-06-10 | MLB   | ML     | New York Mets           |  -127 | +0.932 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-10 | MLB   | ML     | Texas Rangers           |  -120 | +0.952 | LOCK     | 1.00u | WIN     |      +0.83 |
| 2026-06-10 | MLB   | ML     | Washington Nationals    |  -106 | +0.993 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-10 | NBA   | ML     | Spurs                   |  +115 | +0.352 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-10 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.969 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-10 | MLB   | TOTAL  | Over 7.5                |  -110 | +0.930 | LOCK     | 1.00u | WIN     |      +0.91 |
| 2026-06-10 | MLB   | TOTAL  | Under 12.5              |  -110 | +0.994 | ELITE    | 5.00u | WIN     |      +4.55 |
| 2026-06-10 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.987 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-10 | MLB   | TOTAL  | Over 7.5                |  -110 | +0.989 | ELITE    | 5.00u | WIN     |      +4.55 |
| 2026-06-10 | MLB   | TOTAL  | Over 7.5                |  -110 | +0.968 | PREMIUM  | 3.00u | WIN     |      +2.73 |
| 2026-06-10 | MLB   | TOTAL  | Over 8.5                |  -101 | +0.981 | PREMIUM  | 3.00u | WIN     |      +2.97 |
| 2026-06-10 | MLB   | TOTAL  | Under 9.5               |  -110 | +0.984 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-10 | MLB   | TOTAL  | Under 8.5               |  -104 | +0.995 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-10 | NBA   | TOTAL  | Under 216.5             |  -104 | +0.769 | WEAK     | 0.25u | WIN     |      +0.24 |
| 2026-06-09 | MLB   | ML     | Arizona Diamondbacks    |  +118 | +0.365 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-09 | MLB   | ML     | Atlanta Braves          |  -152 | +0.895 | LEAN     | 0.50u | LOSS    |      -0.50 |
| 2026-06-09 | MLB   | ML     | Boston Red Sox          |  -116 | +0.969 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-09 | MLB   | ML     | Chicago Cubs            |  -143 | +0.962 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-09 | MLB   | ML     | Cincinnati Reds         |  -122 | +0.991 | ELITE    | 5.00u | WIN     |      +4.10 |
| 2026-06-09 | MLB   | ML     | Houston Astros          |  -120 | +0.018 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-09 | MLB   | ML     | Pittsburgh Pirates      |  -118 | +0.962 | LOCK     | 1.00u | LOSS    |      -1.00 |

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.554 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.167 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.119 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.087 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.126 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟢 **Modest but real** — score has measurable edge

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  159 |    +0.5618 |    -0.4597 | 0.0153 |  +0.124 |   0.967 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  159 |    +0.2929 |    +0.2820 | 0.0159 |  +0.126 |   0.494 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  159 |    +0.4657 |    -0.2430 | 0.0016 |  +0.040 |   2.480 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 159 |          +0.087 |           +0.100 |                   +0.068 |                   +0.007 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 159 |          -0.104 |           +0.262 |                   -0.110 |                   +0.049 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 159 |          -0.116 |           +0.101 |                   -0.128 |                   +0.014 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 159 |          -0.022 |           +0.144 |                   -0.008 |                   +0.099 | count of contributing AGAINST-side wallets                     |
| provenFor         | 159 |          -0.121 |           +0.091 |                   -0.129 |                   +0.013 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 159 |          -0.058 |           +0.120 |                   -0.054 |                   +0.055 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 6.630          |  53 | 25-28   |   47.2% |     -8.0% |
| MID (p33–p67)     | 19.950 … 30.750        |  54 | 32-22   |   59.3% |     +5.3% |
| HIGH (> p67)      | 48.906 … 37.888        |  52 | 29-23   |   55.8% |     +1.3% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       159 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8839 | average score across live picks                                 |
| SD                |    0.2151 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.639 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +6.011 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.608 / +0.968 / +0.991 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  146 | 80-66  |   54.8% |     +7.1% |  0.532 |        +0.088 | real                                      |
| NBA   |    9 | 3-6    |   33.3% |    +33.3% |  0.833 |        +0.533 | strong (N<20)                             |
| NHL   |    4 | 3-1    |   75.0% |    +14.8% |  0.000 |        -0.800 | anti-signal (N<20)                        |

### 12F — Stability: rolling 7-day AUC across the V12 window

Recompute AUC on a moving 7-day window. If recent windows are degrading (e.g. dropping from 0.58 → 0.50 → 0.45), V12's edge is decaying in real time. Each row anchors on the END date of its window.

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    |
|------------|------|------|--------|---------|-----------|--------|
| 2026-06-07 |    7 |  103 | 58-45  |   56.3% |     +6.2% |  0.523 |
| 2026-06-08 |    7 |  108 | 61-47  |   56.5% |     +9.3% |  0.552 |
| 2026-06-09 |    7 |  119 | 67-52  |   56.3% |    +13.3% |  0.584 |
| 2026-06-10 |    7 |  123 | 67-56  |   54.5% |     +8.2% |  0.555 |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.537 avg in first half → 0.569 avg in second half · Δ = +0.032)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +8.5% | [-10.1%, +26.8%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.0% | [45.9%, 61.6%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.554 | [0.460, 0.648]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             13 | [-13, 37]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       163 |
| Unique wallets ever on a FOR side            |                                                        56 |
| Avg FOR-side wallets per pick                |                                                      2.15 |
| Top-5 wallets' share of all FOR appearances  |                                                     46.4% |
| Top-10 wallets' share of all FOR appearances |                                                     65.5% |
| Top-20 wallets' share of all FOR appearances |                                                     81.8% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   61 |    5 | 32-29  |   52.5% |     +8.8% |     +8.61 |     0.85× | CONFIRMED   |     +3.5% |     206 | 2026-06-10 |
|    2 | 70135d  | MLB,NBA    |   30 |   50 | 15-15  |   50.0% |     +1.9% |     +0.87 |     1.69× | CONFIRMED   |     -9.0% |     314 | 2026-06-10 |
|    3 | 913987  | MLB        |   30 |    4 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +35.3% |      43 | 2026-06-10 |
|    4 | 1e8f33  | MLB        |   22 |    5 | 13-9   |   59.1% |    -13.3% |     -7.37 |     1.04× | CONFIRMED   |     +6.5% |      43 | 2026-06-10 |
|    5 | 7923c4  | MLB,NBA    |   20 |    4 | 11-9   |   55.0% |    +40.6% |    +11.68 |     0.86× | CONFIRMED   |    +10.2% |      87 | 2026-06-10 |
|    6 | cd2f63  | MLB,NBA    |   18 |   12 | 9-9    |   50.0% |    +24.3% |     +9.47 |     0.98× | FLAT        |     +0.7% |     217 | 2026-06-10 |
|    7 | eeabaf  | MLB,NBA    |   15 |    1 | 7-8    |   46.7% |    -12.1% |     -5.38 |     0.80× | CONFIRMED   |    +17.0% |      63 | 2026-06-09 |
|    8 | 491f30  | MLB        |   14 |    1 | 10-4   |   71.4% |    +54.6% |    +23.62 |     0.93× | CONFIRMED   |    +26.4% |      20 | 2026-06-10 |
|    9 | 10c684  | MLB,NBA    |   11 |    4 | 2-9    |   18.2% |    -43.3% |     -5.96 |     1.69× | FLAT        |    -32.7% |      28 | 2026-06-10 |
|   10 | 9a69c2  | MLB        |    9 |   32 | 4-5    |   44.4% |    +24.2% |     +2.54 |     2.18× | CONFIRMED   |    -20.0% |     118 | 2026-06-10 |
|   11 | bc3532  | MLB,NBA,NHL |    9 |    9 | 4-5    |   44.4% |    -18.9% |     -1.18 |     2.26× | CONFIRMED   |     +2.7% |     132 | 2026-06-10 |
|   12 | 2f2a9e  | MLB        |    9 |   11 | 2-7    |   22.2% |    -17.8% |     -2.23 |     0.29× | CONFIRMED   |    -20.4% |      33 | 2026-06-10 |
|   13 | 8c1eae  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |    +53.8% |     +4.71 |     1.79× | CONFIRMED   |     -7.1% |      95 | 2026-06-08 |
|   14 | b19a27  | MLB,NBA    |    6 |    4 | 3-3    |   50.0% |    -15.9% |     -2.35 |     1.34× | CONFIRMED   |     -5.0% |     278 | 2026-06-07 |
|   15 | f2d227  | MLB,NBA    |    5 |    0 | 2-3    |   40.0% |    -76.3% |     -4.39 |     0.75× | CONFIRMED   |    -27.6% |      28 | 2026-06-10 |
|   16 | 972768  | MLB        |    5 |    2 | 2-3    |   40.0% |    -86.8% |     -9.77 |     1.12× | CONFIRMED   | +Infinity% |      39 | 2026-06-10 |
|   17 | e05213  | MLB        |    4 |    2 | 4-0    |  100.0% |    +94.1% |    +10.12 |     1.35× | CONFIRMED   |    +69.6% |       9 | 2026-06-09 |
|   18 | 4d2125  | NHL        |    4 |    0 | 3-1    |   75.0% |    +14.8% |     +1.66 |     0.31× | CONFIRMED   |    +19.5% |      13 | 2026-06-09 |
|   19 | 2e8da5  | NBA        |    4 |    0 | 1-3    |   25.0% |    -51.0% |     -0.51 |     2.76× | CONFIRMED   |    +33.5% |      15 | 2026-06-10 |
|   20 | bc44b0  | MLB,NBA,NHL |    4 |    1 | 2-2    |   50.0% |    -76.0% |     -2.85 |     2.06× | CONFIRMED   |     -3.8% |      11 | 2026-06-10 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 491f30  | MLB        |   14 | 10-4   |   71.4% |     +54.6% |    +23.62 |     0.93× | 2026-06-10 |
|    2 | 7923c4  | MLB,NBA    |   20 | 11-9   |   55.0% |     +40.6% |    +11.68 |     0.86× | 2026-06-10 |
|    3 | cd2f63  | MLB,NBA    |   18 | 9-9    |   50.0% |     +24.3% |     +9.47 |     0.98× | 2026-06-10 |
|    4 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-10 |
|    5 | 4c64aa  | MLB        |   61 | 32-29  |   52.5% |      +8.8% |     +8.61 |     0.85× | 2026-06-10 |
|    6 | 70135d  | MLB,NBA    |   30 | 15-15  |   50.0% |      +1.9% |     +0.87 |     1.69× | 2026-06-10 |
|    7 | eeabaf  | MLB,NBA    |   15 | 7-8    |   46.7% |     -12.1% |     -5.38 |     0.80× | 2026-06-09 |
|    8 | 1e8f33  | MLB        |   22 | 13-9   |   59.1% |     -13.3% |     -7.37 |     1.04× | 2026-06-10 |
|    9 | 10c684  | MLB,NBA    |   11 | 2-9    |   18.2% |     -43.3% |     -5.96 |     1.69× | 2026-06-10 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   11 | 2-9    |   18.2% |     -43.3% |     -5.96 |     1.69× | 2026-06-10 |
|    2 | 1e8f33  | MLB        |   22 | 13-9   |   59.1% |     -13.3% |     -7.37 |     1.04× | 2026-06-10 |
|    3 | eeabaf  | MLB,NBA    |   15 | 7-8    |   46.7% |     -12.1% |     -5.38 |     0.80× | 2026-06-09 |
|    4 | 70135d  | MLB,NBA    |   30 | 15-15  |   50.0% |      +1.9% |     +0.87 |     1.69× | 2026-06-10 |
|    5 | 4c64aa  | MLB        |   61 | 32-29  |   52.5% |      +8.8% |     +8.61 |     0.85× | 2026-06-10 |
|    6 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-10 |
|    7 | cd2f63  | MLB,NBA    |   18 | 9-9    |   50.0% |     +24.3% |     +9.47 |     0.98× | 2026-06-10 |
|    8 | 7923c4  | MLB,NBA    |   20 | 11-9   |   55.0% |     +40.6% |    +11.68 |     0.86× | 2026-06-10 |
|    9 | 491f30  | MLB        |   14 | 10-4   |   71.4% |     +54.6% |    +23.62 |     0.93× | 2026-06-10 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `10c684` (FOR# 11, ROI -43.3%), `1e8f33` (FOR# 22, ROI -13.3%), `eeabaf` (FOR# 15, ROI -12.1%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   121 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     7 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     5 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    99 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

- **Computed at:** 2026-06-10T16:26:14.807Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 948
- **Date range:** 2026-04-18 → 2026-06-09

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.986 | ELITE           | 5.00u                  |
| q60      |        +0.966 | PREMIUM         | 3.00u                  |
| q40      |        +0.921 | LOCK            | 1.00u                  |
| q20      |        +0.789 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            124 |        31 |   12 |    7 |   74 |                     50 |
| NBA   |            206 |        55 |   25 |   22 |  104 |                    102 |
| NHL   |            104 |        21 |    6 |   12 |   65 |                     39 |

> ⚠ **MLB pool is < 50% of NBA pool** (50 vs 102). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~499 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 397 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 159 / 397 (40%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 159 / 397 (40%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 159 / 397 (40%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 159 / 397 (40%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 159 / 397 (40%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 159 / 397 (40%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 159 / 397 (40%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 397 / 397 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 397 / 397 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 397 / 397 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 397 / 397 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 397 / 397 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 397 / 397 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 394 / 397 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 393 / 397 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 397 / 397 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 397 / 397 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 227 / 397 (57%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 397 / 397 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 227 / 397 (57%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 227 / 397 (57%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 397 / 397 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 397 / 397 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 397 / 397 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 397 / 397 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 397 / 397 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | countMargin          | 159 |      |    -0.105 |    -0.017 |      -0.129 |      -0.073 |  0.449 |
|    2 | V12 forCount         | 159 |  🟢  |    -0.116 |    +0.101 |      -0.128 |      +0.014 |  0.483 |
|    3 | wd forCount          | 397 |      |    -0.132 |    -0.083 |      -0.126 |      -0.097 |  0.440 |
|    4 | provenFor            | 397 |      |    -0.124 |    -0.100 |      -0.124 |      -0.122 |  0.431 |
|    5 | agsV12               | 159 |  🟢  |    +0.126 |    +0.119 |      +0.124 |      +0.087 |  0.554 |
|    6 | wd contribFor        | 397 |      |    -0.130 |    -0.200 |      -0.119 |      -0.137 |  0.454 |
|    7 | provenTotal          | 397 |      |    -0.116 |    -0.051 |      -0.112 |      -0.083 |  0.438 |
|    8 | V12 agMean           | 159 |  🟢  |    -0.104 |    +0.262 |      -0.110 |      +0.049 |  0.509 |
|    9 | qMargin              | 159 |  🟢  |    +0.118 |    +0.147 |      +0.099 |      +0.050 |  0.566 |
|   10 | provenMargin         | 397 |      |    -0.085 |    -0.127 |      -0.092 |      -0.113 |  0.455 |
|   11 | wd contribMargin     | 397 |      |    -0.087 |    -0.252 |      -0.084 |      -0.155 |  0.452 |
|   12 | wd maxShare          | 397 |      |    +0.092 |    +0.074 |      +0.082 |      +0.064 |  0.562 |
|   13 | wd contribAg         | 397 |      |    -0.088 |    +0.109 |      -0.075 |      +0.054 |  0.484 |
|   14 | V12 forMean          | 159 |  🟢  |    +0.087 |    +0.100 |      +0.068 |      +0.007 |  0.540 |
|   15 | provenAg             | 397 |      |    -0.071 |    +0.176 |      -0.063 |      +0.076 |  0.474 |
|   16 | hcMargin             | 397 |      |    -0.033 |    +0.060 |      -0.059 |      -0.019 |  0.501 |
|   17 | wd forAvgSize        | 397 |      |    -0.031 |    -0.097 |      -0.057 |      -0.110 |  0.511 |
|   18 | wd agCount           | 227 |      |    -0.061 |    +0.250 |      -0.049 |      +0.115 |  0.496 |
|   19 | wd agAvgSize         | 227 |      |    -0.075 |    -0.044 |      -0.045 |      -0.027 |  0.467 |
|   20 | wd sizeMargin        | 227 |      |    -0.004 |    -0.131 |      -0.043 |      -0.129 |  0.501 |
|   21 | ags (v11)            | 397 |      |    -0.017 |    -0.264 |      -0.042 |      -0.211 |  0.459 |
|   22 | wd maxForContrib     | 397 |      |    -0.035 |    -0.126 |      -0.031 |      -0.074 |  0.501 |
|   23 | peakStars            | 397 |      |    -0.003 |    +0.111 |      -0.018 |      -0.008 |  0.489 |
|   24 | V12 agCount          | 159 |  🟢  |    -0.022 |    +0.144 |      -0.008 |      +0.099 |  0.527 |
|   25 | lockPinnProb         | 394 |      |    +0.111 |    +0.120 |      +0.004 |      -0.137 |  0.555 |
|   26 | clv                  | 393 |      |    +0.038 |    +0.029 |      +0.001 |      +0.062 |  0.548 |

> **Top 3 univariate features by PnL correlation:** `countMargin` (r = -0.129), `V12 forCount` (r = -0.128), `wd forCount` (r = -0.126).

> 🟡 **Highest-ranked feature NOT used by V12:** `countMargin` — r(unit-ret) = -0.129, AUC = 0.449. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `countMargin` · r(unit-ret) = -0.129 · AUC = 0.449

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -1.000 … -1.000          |  75 | 44-31   |   58.7% |     +6.4% |
| MID (p33–p67)     | 1.000 … 1.000            |  35 | 15-20   |   42.9% |     -7.3% |
| HIGH (> p67)      | 3.000 … 3.000            |  49 | 27-22   |   55.1% |     +1.2% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forCount` · r(unit-ret) = -0.128 · AUC = 0.483

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            |  78 | 40-38   |   51.3% |     +0.3% |
| MID (p33–p67)     | 2.000 … 2.000            |  38 | 27-11   |   71.1% |    +14.3% |
| HIGH (> p67)      | 3.000 … 7.000            |  43 | 19-24   |   44.2% |    -15.2% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd forCount` · r(unit-ret) = -0.126 · AUC = 0.440

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 135 | 78-57   |   57.8% |     +5.2% |
| MID (p33–p67)     | 3.000 … 2.000            | 196 | 106-90  |   54.1% |     +0.3% |
| HIGH (> p67)      | 4.000 … 7.000            |  66 | 28-38   |   42.4% |    -11.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `provenFor` · r(unit-ret) = -0.124 · AUC = 0.431

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 152 | 88-64   |   57.9% |     +5.3% |
| MID (p33–p67)     | 2.000 … 2.000            | 121 | 72-49   |   59.5% |     +5.8% |
| HIGH (> p67)      | 10.000 … 7.000           | 124 | 52-72   |   41.9% |    -10.2% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `agsV12` · r(unit-ret) = +0.124 · AUC = 0.554

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.944 … 0.769            |  53 | 28-25   |   52.8% |     +8.4% |
| MID (p33–p67)     | 0.976 … 0.968            |  53 | 26-27   |   49.1% |     -4.3% |
| HIGH (> p67)      | 0.986 … 0.995            |  53 | 32-21   |   60.4% |     +3.8% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | countMargin    | V12 forCount   | wd forCount    | provenFor      | agsV12         | wd contribFor  | provenTotal    | V12 agMean     |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| countMargin |  1.000         |         +0.674 |         +0.649 |         +0.583 |         -0.027 |         +0.511 |         +0.285 |         -0.008 |
| V12 forCount |         +0.674 |  1.000         |         +0.989 |         +0.927 |         -0.427 |         +0.907 |         +0.837 |         +0.520 |
| wd forCount |         +0.649 |         +0.989 |  1.000         |         +0.940 |         -0.440 |         +0.925 |         +0.851 |         +0.539 |
| provenFor   |         +0.583 |         +0.927 |         +0.940 |  1.000         |         -0.439 |         +0.882 |         +0.913 |         +0.541 |
| agsV12      |         -0.027 |         -0.427 |         -0.440 |         -0.439 |  1.000         |         -0.447 |         -0.529 |         -0.785 |
| wd contribFor |         +0.511 |         +0.907 |         +0.925 |         +0.882 |         -0.447 |  1.000         |         +0.840 |         +0.630 |
| provenTotal |         +0.285 |         +0.837 |         +0.851 |         +0.913 |         -0.529 |         +0.840 |  1.000         |         +0.674 |
| V12 agMean  |         -0.008 |         +0.520 |         +0.539 |         +0.541 |         -0.785 |         +0.630 |         +0.674 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forCount` and `wd forCount` have r = +0.989. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 159 picks · features = 8 (+ intercept) · multiple R² = **0.0352** · adjusted R² = **-0.0231** · residual sd = 0.985

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | countMargin          |     |    -0.2307 |   0.1866 | -1.24        |        1 |
|    2 | V12 forCount         |  🟢 |    +0.1777 |   0.5817 | +0.31        |        2 |
|    3 | provenTotal          |     |    -0.1469 |   0.3274 | -0.45        |        3 |
|    4 | agsV12               |  🟢 |    +0.0954 |   0.1323 | +0.72        |        4 |
|    5 | wd contribFor        |     |    -0.0616 |   0.2378 | -0.26        |        5 |
|    6 | provenFor            |     |    +0.0577 |   0.3649 | +0.16        |        6 |
|    7 | V12 agMean           |  🟢 |    -0.0430 |   0.1671 | -0.26        |        7 |
|    8 | wd forCount          |     |    +0.0419 |   0.6408 | +0.07        |        8 |
| —    | (intercept)          |     |    +0.0369 |   0.0781 |    +0.47 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **3 / 8** top multivariate features are inputs to V12 (38%).
- V12 consumes: `V12 forCount` (β = +0.178), `agsV12` (β = +0.095), `V12 agMean` (β = -0.043)
- V12 IGNORES: `countMargin` (β = -0.231, t = -1.24), `provenTotal` (β = -0.147, t = -0.45), `wd contribFor` (β = -0.062, t = -0.26), `provenFor` (β = +0.058, t = +0.16), `wd forCount` (β = +0.042, t = +0.07)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.554 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.557 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap ≈ 0** — V12 is capturing essentially all the linear signal available in the panel. The remaining features are noise.

### 17G — Actionable recommendations

- Sample size is currently 397 live picks — statistically meaningful but tight. Treat single-feature recommendations as provisional until N ≥ 500. The rankings will firm up as the daily cron accumulates more graded picks.
- Adjusted R² of -0.0231 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*