# AGS-Unified — V12 Performance Monitor

**Generated:** Friday, June 12, 2026 at 11:48 AM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 12

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (12 days ago), V12 has evaluated **283** picks, shipped **170** for real money (60.1% ship rate), and muted the other **113**. On the shipped picks V12 has gone **92-78** (54.1% win), staked **355.50u**, and returned **+27.88u** at **+7.8% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             12 |
| Picks V12 has evaluated             |                            283 |
| Picks SHIPPED (units > 0)           |                            170 |
| Picks MUTED (score ≤ 0, FADE)       |                            113 |
| Ship rate                           |                          60.1% |
| Live W-L                            |                          92-78 |
| Live Win %                          |                          54.1% |
| Live PnL (units)                    |                         +27.88 |
| Live ROI                            |                          +7.8% |
| Avg PnL / day                       |                         +2.32u |
| Most recent action (2026-06-14)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **7.8% ROI** across 170 live picks (+27.88u real PnL).
- Mute rule is **saving money** — the 58 muted picks would have lost -4.61u at flat 1u (-8.0% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+2.32u/day** on average since launch.
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
| v12     | 06-01 → present      |   12 |    170 |  58 | 92-78  |  54.1% |      7.8% |     +27.88 |    +0.16 | 0.531 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  110 |    +0.8pp |    +16.8pp |          +0.337 |   -0.018 |          — | 🟡 mixed |
| v12 − v10          | +  108 |    +5.7pp |    +26.6pp |          +0.477 |   +0.137 |          — | 🟢 better |
| v12 − v11          | +   59 |    -0.8pp |     +5.0pp |          +0.103 |   +0.087 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 157n 54.8% +7% | 9n 33.3% +33%  | 4n 75.0% +15%  | 170n 54.1% +8% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 39n +3%       | 42n +24%      | 39n -24%      | 25n +14%      | 21n -9%       | 🟡 partial (0) |

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
| 2026-06-11 |        17 |    7 |     4 | 4-3        |  57.1% |     13.25 |      -1.17 |     -8.8% |     +27.88 |
| 2026-06-12 |        13 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +27.88 |
| 2026-06-13 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +27.88 |
| 2026-06-14 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +27.88 |

> **Bottom line.** 12 days live, 170 live picks shipped, **+27.88u total PnL** at **+7.8% ROI**, averaging **+2.32u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  39 | 22-17  |  56.4% |        +0.991 |    5.00u |            4.49u | -0.51u |      175.00 |      +5.41 |      3.1% |
| PREMIUM  |  3.00u |  42 | 28-14  |  66.7% |        +0.976 |    3.00u |            2.81u | -0.19u |      118.00 |     +28.18 |     23.9% |
| LOCK     |  1.00u |  39 | 15-24  |  38.5% |        +0.955 |    1.00u |            1.00u | +0.00u |       39.00 |      -9.27 |    -23.8% |
| LEAN     |  0.50u |  25 | 15-10  |  60.0% |        +0.877 |    0.50u |            0.50u | +0.00u |       12.50 |      +1.80 |     14.4% |
| WEAK     |  0.25u |  21 | 10-11  |  47.6% |        +0.365 |    0.25u |            0.25u | +0.00u |        5.25 |      -0.49 |     -9.3% |
| FADE     |  0.00u |  58 | 0-0    |      — |        -0.272 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### Sizing pipeline integrity

🟢 **No sizing drift detected.** Every shipped V12 pick's actual stake matches the ladder target (after odds-cap) within ±0.05u. The sizing pipeline is healthy.

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 95n · 54.7% · +11.3%   | 6n · 83.3% · +31.5%    | 56n · 51.8% · -0.1%    | 157n · 54.8% · +7.0%   |
| NBA   | 4n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 9n · 33.3% · +33.3%    |
| NHL   | 1n · 100.0% · +64.0%   | 1n · 100.0% · +215.0%  | 2n · 50.0% · -6.5%     | 4n · 75.0% · +14.8%    |
| **All** | **100n · 53.0% · +10.7%** | **10n · 80.0% · +52.4%** | **60n · 51.7% · -0.9%** | **170n · 54.1% · +7.8%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  | 129 |    129 | 71-58  |    55.0% |   52.5% |     +2.6pp |      7.8% |
| 0.7 – 0.9          |  18 |     18 | 11-7   |    61.1% |   55.6% |     +5.6pp |      5.1% |
| 0.5 – 0.7          |   4 |      4 | 3-1    |    75.0% |   58.8% |    +16.2pp |     36.0% |
| 0.25 – 0.5         |   7 |      7 | 3-4    |    42.9% |   53.0% |    -10.1pp |    -18.3% |
| (0, 0.25]          |   8 |      8 | 2-6    |    25.0% |   56.4% |    -31.4pp |    -49.0% |
| ≤ 0 (MUTED)        |  54 |      0 | 0-0    |    51.9% |   52.5% |     -0.7pp |         — |

> 🟡 **Strong-score band (> 0.9) edge is +2.6pp** — borderline. Larger sample needed before declaring V12's top tier as real alpha.

> 🟡 **Mute band wins 51.9%** — roughly coin-flip. The mute rule isn't obviously wrong, but it's not capturing strong rejection either. §8 quantifies the dollar impact.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **58** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                   58 |
| Muted W-L                           |                28-30 |
| Muted Win %                         |                48.3% |
| Counterfactual PnL at flat 1u       |                -4.61 |
| Counterfactual ROI at flat 1u       |                -8.0% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-4.61u** at a flat 1u stake — a counterfactual ROI of **-8.0%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  220 |
| Spearman ρ (v11 vs V12 score)       |               -0.366 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.366. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 220 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +24.274 |                        2.2 |
| AGAINST |             +5.350 |                        1.2 |

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
| 2026-06-11 | MLB   | ML     | Arizona Diamondbacks    |  +112 | +0.921 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-11 | MLB   | ML     | Colorado Rockies        |     0 | +0.995 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-11 | MLB   | ML     | Los Angeles Dodgers     |  -175 | +0.840 | LEAN     | 0.50u | WIN     |      +0.29 |
| 2026-06-11 | MLB   | ML     | Seattle Mariners        |  -111 | +0.913 | LEAN     | 0.50u | LOSS    |      -0.50 |
| 2026-06-11 | MLB   | ML     | New York Mets           |  -131 | +0.996 | ELITE    | 5.00u | WIN     |      +3.82 |
| 2026-06-11 | MLB   | ML     | Texas Rangers           |  -101 | +0.951 | LOCK     | 1.00u | WIN     |      +0.99 |
| 2026-06-11 | MLB   | TOTAL  | Under 10.5              |  -110 | +0.287 | WEAK     | 0.25u | WIN     |      +0.23 |
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

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.546 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.156 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.092 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.073 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.103 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  166 |    +0.4569 |    -0.3662 | 0.0103 |  +0.101 |   0.966 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  166 |    +0.2382 |    +0.3320 | 0.0106 |  +0.103 |   0.496 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  166 |    +0.4139 |    -0.2108 | 0.0013 |  +0.036 |   2.480 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 166 |          +0.084 |           +0.078 |                   +0.065 |                   +0.002 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 166 |          -0.094 |           +0.272 |                   -0.100 |                   +0.051 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 166 |          -0.105 |           +0.115 |                   -0.117 |                   +0.019 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 166 |          -0.001 |           +0.156 |                   +0.011 |                   +0.100 | count of contributing AGAINST-side wallets                     |
| provenFor         | 166 |          -0.107 |           +0.106 |                   -0.115 |                   +0.019 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 166 |          -0.039 |           +0.137 |                   -0.034 |                   +0.068 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 9.652          |  56 | 27-29   |   48.2% |     -6.3% |
| MID (p33–p67)     | 19.950 … 17.706        |  56 | 33-23   |   58.9% |     +5.2% |
| HIGH (> p67)      | 48.906 … 125.928       |  54 | 30-24   |   55.6% |     +1.1% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       166 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8821 | average score across live picks                                 |
| SD                |    0.2161 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.597 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +5.750 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.603 / +0.968 / +0.991 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  153 | 84-69  |   54.9% |     +6.5% |  0.524 |        +0.057 | noise                                     |
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
| 2026-06-11 |    7 |  117 | 64-53  |   54.7% |     +9.3% |  0.559 |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.537 avg in first half → 0.566 avg in second half · Δ = +0.028)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +7.8% | [-11.6%, +24.6%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.1% | [47.0%, 61.4%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.546 | [0.459, 0.633]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             14 | [-10, 38]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       170 |
| Unique wallets ever on a FOR side            |                                                        58 |
| Avg FOR-side wallets per pick                |                                                      2.15 |
| Top-5 wallets' share of all FOR appearances  |                                                     45.4% |
| Top-10 wallets' share of all FOR appearances |                                                     65.0% |
| Top-20 wallets' share of all FOR appearances |                                                     81.1% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   63 |    5 | 33-30  |   52.4% |     +8.5% |     +8.40 |     0.83× | CONFIRMED   |     +2.8% |     209 | 2026-06-11 |
|    2 | 70135d  | MLB,NBA    |   30 |   51 | 15-15  |   50.0% |     +1.9% |     +0.87 |     1.69× | CONFIRMED   |     -9.5% |     320 | 2026-06-11 |
|    3 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|    4 | 1e8f33  | MLB        |   23 |    5 | 14-9   |   60.9% |    -11.3% |     -6.38 |     1.04× | CONFIRMED   |     +6.1% |      45 | 2026-06-11 |
|    5 | 7923c4  | MLB,NBA    |   20 |    4 | 11-9   |   55.0% |    +40.6% |    +11.68 |     0.86× | CONFIRMED   |    +11.1% |      88 | 2026-06-10 |
|    6 | cd2f63  | MLB,NBA    |   18 |   13 | 9-9    |   50.0% |    +24.3% |     +9.47 |     0.98× | FLAT        |     +0.3% |     218 | 2026-06-11 |
|    7 | eeabaf  | MLB,NBA    |   16 |    1 | 8-8    |   50.0% |    -11.5% |     -5.15 |     0.81× | CONFIRMED   |    +18.1% |      64 | 2026-06-11 |
|    8 | 491f30  | MLB        |   15 |    1 | 11-4   |   73.3% |    +56.9% |    +27.44 |     0.97× | CONFIRMED   |    +22.9% |      22 | 2026-06-11 |
|    9 | 10c684  | MLB,NBA    |   13 |    4 | 4-9    |   30.8% |    -31.6% |     -4.74 |     1.74× | FLAT        |    -26.6% |      31 | 2026-06-11 |
|   10 | 9a69c2  | MLB        |   10 |   33 | 5-5    |   50.0% |    +30.7% |     +3.53 |     2.45× | CONFIRMED   |    -21.0% |     122 | 2026-06-11 |
|   11 | bc3532  | MLB,NBA,NHL |    9 |    9 | 4-5    |   44.4% |    -18.9% |     -1.18 |     2.26× | FLAT        |     +3.2% |     133 | 2026-06-10 |
|   12 | 2f2a9e  | MLB        |    9 |   12 | 2-7    |   22.2% |    -17.8% |     -2.23 |     0.29× | FLAT        |    -30.4% |      40 | 2026-06-11 |
|   13 | 8c1eae  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |    +53.8% |     +4.71 |     1.79× | CONFIRMED   |     -7.1% |      95 | 2026-06-08 |
|   14 | b19a27  | MLB,NBA    |    6 |    4 | 3-3    |   50.0% |    -15.9% |     -2.35 |     1.34× | CONFIRMED   |     -5.0% |     278 | 2026-06-07 |
|   15 | 972768  | MLB        |    6 |    2 | 2-4    |   33.3% |    -90.9% |    -14.77 |     1.11× | CONFIRMED   | +Infinity% |      40 | 2026-06-11 |
|   16 | f2d227  | MLB,NBA    |    5 |    0 | 2-3    |   40.0% |    -76.3% |     -4.39 |     0.75× | CONFIRMED   |    -24.7% |      29 | 2026-06-10 |
|   17 | 5b1e50  | MLB,NBA    |    5 |   16 | 3-2    |   60.0% |    +12.0% |     +1.23 |     0.64× | CONFIRMED   |    -28.0% |      24 | 2026-06-11 |
|   18 | e05213  | MLB        |    4 |    2 | 4-0    |  100.0% |    +94.1% |    +10.12 |     1.35× | CONFIRMED   |    +69.6% |       9 | 2026-06-09 |
|   19 | 4d2125  | NHL        |    4 |    0 | 3-1    |   75.0% |    +14.8% |     +1.66 |     0.31× | CONFIRMED   |    +16.7% |      15 | 2026-06-09 |
|   20 | 2e8da5  | NBA        |    4 |    0 | 1-3    |   25.0% |    -51.0% |     -0.51 |     2.76× | CONFIRMED   |    +33.5% |      15 | 2026-06-10 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 491f30  | MLB        |   15 | 11-4   |   73.3% |     +56.9% |    +27.44 |     0.97× | 2026-06-11 |
|    2 | 7923c4  | MLB,NBA    |   20 | 11-9   |   55.0% |     +40.6% |    +11.68 |     0.86× | 2026-06-10 |
|    3 | 9a69c2  | MLB        |   10 | 5-5    |   50.0% |     +30.7% |     +3.53 |     2.45× | 2026-06-11 |
|    4 | cd2f63  | MLB,NBA    |   18 | 9-9    |   50.0% |     +24.3% |     +9.47 |     0.98× | 2026-06-11 |
|    5 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    6 | 4c64aa  | MLB        |   63 | 33-30  |   52.4% |      +8.5% |     +8.40 |     0.83× | 2026-06-11 |
|    7 | 70135d  | MLB,NBA    |   30 | 15-15  |   50.0% |      +1.9% |     +0.87 |     1.69× | 2026-06-11 |
|    8 | 1e8f33  | MLB        |   23 | 14-9   |   60.9% |     -11.3% |     -6.38 |     1.04× | 2026-06-11 |
|    9 | eeabaf  | MLB,NBA    |   16 | 8-8    |   50.0% |     -11.5% |     -5.15 |     0.81× | 2026-06-11 |
|   10 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |
|    2 | eeabaf  | MLB,NBA    |   16 | 8-8    |   50.0% |     -11.5% |     -5.15 |     0.81× | 2026-06-11 |
|    3 | 1e8f33  | MLB        |   23 | 14-9   |   60.9% |     -11.3% |     -6.38 |     1.04× | 2026-06-11 |
|    4 | 70135d  | MLB,NBA    |   30 | 15-15  |   50.0% |      +1.9% |     +0.87 |     1.69× | 2026-06-11 |
|    5 | 4c64aa  | MLB        |   63 | 33-30  |   52.4% |      +8.5% |     +8.40 |     0.83× | 2026-06-11 |
|    6 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    7 | cd2f63  | MLB,NBA    |   18 | 9-9    |   50.0% |     +24.3% |     +9.47 |     0.98× | 2026-06-11 |
|    8 | 9a69c2  | MLB        |   10 | 5-5    |   50.0% |     +30.7% |     +3.53 |     2.45× | 2026-06-11 |
|    9 | 7923c4  | MLB,NBA    |   20 | 11-9   |   55.0% |     +40.6% |    +11.68 |     0.86× | 2026-06-10 |
|   10 | 491f30  | MLB        |   15 | 11-4   |   73.3% |     +56.9% |    +27.44 |     0.97× | 2026-06-11 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `10c684` (FOR# 13, ROI -31.6%), `eeabaf` (FOR# 16, ROI -11.5%), `1e8f33` (FOR# 23, ROI -11.3%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   125 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    11 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     6 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   106 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

- **Computed at:** 2026-06-11T16:41:21.473Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 985
- **Date range:** 2026-04-18 → 2026-06-10

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.983 | ELITE           | 5.00u                  |
| q60      |        +0.958 | PREMIUM         | 3.00u                  |
| q40      |        +0.913 | LOCK            | 1.00u                  |
| q20      |        +0.778 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            124 |        30 |   14 |    6 |   74 |                     50 |
| NBA   |            206 |        55 |   25 |   22 |  104 |                    102 |
| NHL   |            105 |        22 |    8 |   12 |   63 |                     42 |

> ⚠ **MLB pool is < 50% of NBA pool** (50 vs 102). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~510 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 404 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 166 / 404 (41%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 166 / 404 (41%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 166 / 404 (41%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 166 / 404 (41%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 166 / 404 (41%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 166 / 404 (41%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 166 / 404 (41%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 404 / 404 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 404 / 404 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 404 / 404 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 404 / 404 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 404 / 404 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 404 / 404 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 400 / 404 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 399 / 404 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 404 / 404 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 404 / 404 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 232 / 404 (57%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 404 / 404 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 232 / 404 (57%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 232 / 404 (57%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 404 / 404 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 404 / 404 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 404 / 404 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 404 / 404 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 404 / 404 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | countMargin          | 166 |      |    -0.110 |    -0.030 |      -0.132 |      -0.080 |  0.448 |
|    2 | wd forCount          | 404 |      |    -0.127 |    -0.073 |      -0.120 |      -0.090 |  0.445 |
|    3 | provenFor            | 404 |      |    -0.119 |    -0.093 |      -0.118 |      -0.117 |  0.438 |
|    4 | V12 forCount         | 166 |  🟢  |    -0.105 |    +0.115 |      -0.117 |      +0.019 |  0.492 |
|    5 | wd contribFor        | 404 |      |    -0.123 |    -0.185 |      -0.111 |      -0.126 |  0.461 |
|    6 | provenTotal          | 404 |      |    -0.108 |    -0.043 |      -0.104 |      -0.077 |  0.446 |
|    7 | agsV12               | 166 |  🟢  |    +0.103 |    +0.092 |      +0.101 |      +0.073 |  0.546 |
|    8 | V12 agMean           | 166 |  🟢  |    -0.094 |    +0.272 |      -0.100 |      +0.051 |  0.515 |
|    9 | provenMargin         | 404 |      |    -0.086 |    -0.129 |      -0.092 |      -0.116 |  0.455 |
|   10 | qMargin              | 166 |  🟢  |    +0.110 |    +0.113 |      +0.091 |      +0.038 |  0.559 |
|   11 | wd contribMargin     | 404 |      |    -0.090 |    -0.261 |      -0.087 |      -0.160 |  0.451 |
|   12 | wd maxShare          | 404 |      |    +0.076 |    +0.057 |      +0.066 |      +0.054 |  0.555 |
|   13 | V12 forMean          | 166 |  🟢  |    +0.084 |    +0.078 |      +0.065 |      +0.002 |  0.538 |
|   14 | hcMargin             | 404 |      |    -0.036 |    +0.049 |      -0.061 |      -0.023 |  0.502 |
|   15 | wd contribAg         | 404 |      |    -0.071 |    +0.120 |      -0.058 |      +0.060 |  0.492 |
|   16 | provenAg             | 404 |      |    -0.062 |    +0.183 |      -0.055 |      +0.080 |  0.481 |
|   17 | wd forAvgSize        | 404 |      |    -0.025 |    -0.084 |      -0.050 |      -0.099 |  0.517 |
|   18 | wd sizeMargin        | 232 |      |    -0.011 |    -0.131 |      -0.048 |      -0.124 |  0.500 |
|   19 | ags (v11)            | 404 |      |    -0.017 |    -0.261 |      -0.042 |      -0.207 |  0.460 |
|   20 | wd agCount           | 232 |      |    -0.050 |    +0.265 |      -0.038 |      +0.123 |  0.494 |
|   21 | wd agAvgSize         | 232 |      |    -0.058 |    -0.022 |      -0.031 |      -0.018 |  0.474 |
|   22 | wd maxForContrib     | 404 |      |    -0.028 |    -0.117 |      -0.023 |      -0.067 |  0.506 |
|   23 | peakStars            | 404 |      |    -0.006 |    +0.105 |      -0.021 |      -0.011 |  0.487 |
|   24 | V12 agCount          | 166 |  🟢  |    -0.001 |    +0.156 |      +0.011 |      +0.100 |  0.532 |
|   25 | lockPinnProb         | 400 |      |    +0.115 |    +0.124 |      +0.008 |      -0.137 |  0.556 |
|   26 | clv                  | 399 |      |    +0.041 |    +0.040 |      +0.004 |      +0.065 |  0.552 |

> **Top 3 univariate features by PnL correlation:** `countMargin` (r = -0.132), `wd forCount` (r = -0.120), `provenFor` (r = -0.118).

> 🟡 **Highest-ranked feature NOT used by V12:** `countMargin` — r(unit-ret) = -0.132, AUC = 0.448. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `countMargin` · r(unit-ret) = -0.132 · AUC = 0.448

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -1.000 … -2.000          |  78 | 46-32   |   59.0% |     +6.6% |
| MID (p33–p67)     | 1.000 … 1.000            |  38 | 16-22   |   42.1% |     -8.4% |
| HIGH (> p67)      | 3.000 … 2.000            |  50 | 28-22   |   56.0% |     +2.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd forCount` · r(unit-ret) = -0.120 · AUC = 0.445

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 138 | 79-59   |   57.2% |     +4.5% |
| MID (p33–p67)     | 3.000 … 3.000            | 199 | 108-91  |   54.3% |     +0.5% |
| HIGH (> p67)      | 4.000 … 4.000            |  67 | 29-38   |   43.3% |    -10.4% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `provenFor` · r(unit-ret) = -0.118 · AUC = 0.438

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 156 | 89-67   |   57.1% |     +4.3% |
| MID (p33–p67)     | 2.000 … 2.000            | 123 | 74-49   |   60.2% |     +6.4% |
| HIGH (> p67)      | 10.000 … 3.000           | 125 | 53-72   |   42.4% |     -9.8% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forCount` · r(unit-ret) = -0.117 · AUC = 0.492

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            |  81 | 41-40   |   50.6% |     -0.3% |
| MID (p33–p67)     | 2.000 … 2.000            |  40 | 29-11   |   72.5% |    +15.6% |
| HIGH (> p67)      | 3.000 … 4.000            |  45 | 20-25   |   44.4% |    -15.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribFor` · r(unit-ret) = -0.111 · AUC = 0.461

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 49.800 … 26.300          | 135 | 70-65   |   51.9% |     -0.9% |
| MID (p33–p67)     | 89.000 … 72.300          | 134 | 88-46   |   65.7% |     +9.7% |
| HIGH (> p67)      | 212.200 … 218.500        | 135 | 58-77   |   43.0% |     -9.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | countMargin    | wd forCount    | provenFor      | V12 forCount   | wd contribFor  | provenTotal    | agsV12         | V12 agMean     |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| countMargin |  1.000         |         +0.627 |         +0.579 |         +0.648 |         +0.489 |         +0.280 |         +0.001 |         -0.018 |
| wd forCount |         +0.627 |  1.000         |         +0.934 |         +0.988 |         +0.924 |         +0.851 |         -0.446 |         +0.541 |
| provenFor   |         +0.579 |         +0.934 |  1.000         |         +0.920 |         +0.877 |         +0.912 |         -0.429 |         +0.539 |
| V12 forCount |         +0.648 |         +0.988 |         +0.920 |  1.000         |         +0.906 |         +0.835 |         -0.435 |         +0.523 |
| wd contribFor |         +0.489 |         +0.924 |         +0.877 |         +0.906 |  1.000         |         +0.840 |         -0.454 |         +0.632 |
| provenTotal |         +0.280 |         +0.851 |         +0.912 |         +0.835 |         +0.840 |  1.000         |         -0.526 |         +0.673 |
| agsV12      |         +0.001 |         -0.446 |         -0.429 |         -0.435 |         -0.454 |         -0.526 |  1.000         |         -0.782 |
| V12 agMean  |         -0.018 |         +0.541 |         +0.539 |         +0.523 |         +0.632 |         +0.673 |         -0.782 |  1.000         |

> 🔴 **Strong collinearity detected:** `wd forCount` and `V12 forCount` have r = +0.988. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 166 picks · features = 8 (+ intercept) · multiple R² = **0.0321** · adjusted R² = **-0.0237** · residual sd = 0.983

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | countMargin          |     |    -0.2158 |   0.1698 | -1.27        |        1 |
|    2 | wd forCount          |     |    +0.1390 |   0.6040 | +0.23        |        2 |
|    3 | provenTotal          |     |    -0.0868 |   0.3090 | -0.28        |        3 |
|    4 | V12 agMean           |  🟢 |    -0.0868 |   0.1596 | -0.54        |        4 |
|    5 | agsV12               |  🟢 |    +0.0624 |   0.1282 | +0.49        |        5 |
|    6 | provenFor            |     |    +0.0373 |   0.3494 | +0.11        |        6 |
|    7 | wd contribFor        |     |    -0.0119 |   0.2309 | -0.05        |        7 |
|    8 | V12 forCount         |  🟢 |    +0.0103 |   0.5341 | +0.02        |        8 |
| —    | (intercept)          |     |    +0.0368 |   0.0763 |    +0.48 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **3 / 8** top multivariate features are inputs to V12 (38%).
- V12 consumes: `V12 agMean` (β = -0.087), `agsV12` (β = +0.062), `V12 forCount` (β = +0.010)
- V12 IGNORES: `countMargin` (β = -0.216, t = -1.27), `wd forCount` (β = +0.139, t = +0.23), `provenTotal` (β = -0.087, t = -0.28), `provenFor` (β = +0.037, t = +0.11), `wd contribFor` (β = -0.012, t = -0.05)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.546 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.566 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.021.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Sample size is currently 404 live picks — statistically meaningful but tight. Treat single-feature recommendations as provisional until N ≥ 500. The rankings will firm up as the daily cron accumulates more graded picks.
- Adjusted R² of -0.0237 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*