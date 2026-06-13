# AGS-Unified — V12 Performance Monitor

**Generated:** Saturday, June 13, 2026 at 8:32 AM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 13

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (13 days ago), V12 has evaluated **299** picks, shipped **186** for real money (62.2% ship rate), and muted the other **113**. On the shipped picks V12 has gone **101-85** (54.3% win), staked **382.00u**, and returned **+33.94u** at **+8.9% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             13 |
| Picks V12 has evaluated             |                            299 |
| Picks SHIPPED (units > 0)           |                            186 |
| Picks MUTED (score ≤ 0, FADE)       |                            113 |
| Ship rate                           |                          62.2% |
| Live W-L                            |                         101-85 |
| Live Win %                          |                          54.3% |
| Live PnL (units)                    |                         +33.94 |
| Live ROI                            |                          +8.9% |
| Avg PnL / day                       |                         +2.61u |
| Most recent action (2026-06-14)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **8.9% ROI** across 186 live picks (+33.94u real PnL).
- Mute rule is **saving money** — the 65 muted picks would have lost -4.24u at flat 1u (-6.5% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+2.61u/day** on average since launch.
- **NBA** is V12's strongest sport: 9 live, 3-6, 33.3% ROI, +2.58u.
- **SPREAD** is V12's strongest market: 13 live, 9-4, +40.3% ROI.

## § 2 — Model Version Comparison (V9 → V10 → V11 → V12)

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   13 |    186 |  65 | 101-85 |  54.3% |      8.9% |     +33.94 |    +0.18 | 0.534 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  126 |    +1.0pp |    +17.8pp |          +0.355 |   -0.014 |          — | 🟡 mixed |
| v12 − v10          | +  124 |    +5.9pp |    +27.6pp |          +0.496 |   +0.141 |          — | 🟢 better |
| v12 − v11          | +   75 |    -0.7pp |     +6.1pp |          +0.122 |   +0.091 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 173n 54.9% +8% | 9n 33.3% +33%  | 4n 75.0% +15%  | 186n 54.3% +9% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 41n +7%       | 46n +21%      | 44n -24%      | 28n +20%      | 23n -17%      | 🟡 partial (0) |

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
| 2026-06-12 |        26 |   16 |     7 | 9-7        |  56.3% |     26.50 |      +6.06 |     22.9% |     +33.94 |
| 2026-06-13 |         4 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +33.94 |
| 2026-06-14 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +33.94 |

> **Trajectory.** 🟢 Last 3 days (22.9% ROI) is **+15.0pp better** than the prior window (7.8%). V12 is accelerating.

> **Bottom line.** 13 days live, 186 live picks shipped, **+33.94u total PnL** at **+8.9% ROI**, averaging **+2.61u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  41 | 24-17  |  58.5% |        +0.991 |    5.00u |            4.45u | -0.55u |      182.50 |     +12.88 |      7.1% |
| PREMIUM  |  3.00u |  46 | 30-16  |  65.2% |        +0.975 |    3.00u |            2.83u | -0.17u |      130.00 |     +27.64 |     21.3% |
| LOCK     |  1.00u |  44 | 17-27  |  38.6% |        +0.952 |    1.00u |            1.00u | +0.00u |       44.00 |     -10.68 |    -24.3% |
| LEAN     |  0.50u |  28 | 18-10  |  64.3% |        +0.874 |    0.50u |            0.50u | +0.00u |       14.00 |      +2.84 |     20.3% |
| WEAK     |  0.25u |  23 | 10-13  |  43.5% |        +0.391 |    0.25u |            0.25u | +0.00u |        5.75 |      -0.99 |    -17.2% |
| FADE     |  0.00u |  65 | 0-0    |      — |        -0.260 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### Sizing pipeline integrity

🟢 **No sizing drift detected.** Every shipped V12 pick's actual stake matches the ladder target (after odds-cap) within ±0.05u. The sizing pipeline is healthy.

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 105n · 55.2% · +12.0%  | 9n · 66.7% · +17.9%    | 59n · 52.5% · +2.7%    | 173n · 54.9% · +8.2%   |
| NBA   | 4n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 9n · 33.3% · +33.3%    |
| NHL   | 1n · 100.0% · +64.0%   | 1n · 100.0% · +215.0%  | 2n · 50.0% · -6.5%     | 4n · 75.0% · +14.8%    |
| **All** | **110n · 53.6% · +11.4%** | **13n · 69.2% · +40.3%** | **63n · 52.4% · +1.7%** | **186n · 54.3% · +8.9%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  | 140 |    140 | 77-63  |    55.0% |   52.4% |     +2.6pp |      8.8% |
| 0.7 – 0.9          |  22 |     22 | 14-8   |    63.6% |   55.6% |     +8.0pp |     11.9% |
| 0.5 – 0.7          |   5 |      5 | 3-2    |    60.0% |   56.2% |     +3.8pp |      8.8% |
| 0.25 – 0.5         |   7 |      7 | 3-4    |    42.9% |   53.0% |    -10.1pp |    -18.3% |
| (0, 0.25]          |   8 |      8 | 2-6    |    25.0% |   56.4% |    -31.4pp |    -49.0% |
| ≤ 0 (MUTED)        |  60 |      0 | 0-0    |    51.7% |   52.8% |     -1.1pp |         — |

> 🟡 **Strong-score band (> 0.9) edge is +2.6pp** — borderline. Larger sample needed before declaring V12's top tier as real alpha.

> 🟡 **Mute band wins 51.7%** — roughly coin-flip. The mute rule isn't obviously wrong, but it's not capturing strong rejection either. §8 quantifies the dollar impact.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **65** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                   65 |
| Muted W-L                           |                32-33 |
| Muted Win %                         |                49.2% |
| Counterfactual PnL at flat 1u       |                -4.24 |
| Counterfactual ROI at flat 1u       |                -6.5% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-4.24u** at a flat 1u stake — a counterfactual ROI of **-6.5%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  242 |
| Spearman ρ (v11 vs V12 score)       |               -0.362 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.362. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 242 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +23.506 |                        2.1 |
| AGAINST |             +4.941 |                        1.2 |

### One-sided wallet support (high-variance picks)

- **18** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **0** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **9-7** (56.3% win) at **+11.8% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   1 |   1 |   2 |   3 |   9 |
| AGAINST |   0 |   0 |   1 |   2 |   6 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|
| 2026-06-12 | MLB   | ML     | New York Mets           |  -114 | +0.992 | ELITE    | 5.00u | WIN     |      +4.39 |
| 2026-06-12 | MLB   | ML     | San Francisco Giants    |  -110 | +0.978 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-12 | MLB   | ML     | Athletics               |  -210 | +0.808 | LEAN     | 0.50u | WIN     |      +0.24 |
| 2026-06-12 | MLB   | ML     | Detroit Tigers          |  +105 | +0.765 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-12 | MLB   | ML     | Houston Astros          |  -110 | +0.952 | LOCK     | 1.00u | WIN     |      +0.91 |
| 2026-06-12 | MLB   | ML     | Chicago White Sox       |  +123 | +0.996 | ELITE    | 2.50u | WIN     |      +3.08 |
| 2026-06-12 | MLB   | ML     | Pittsburgh Pirates      |  -144 | +0.961 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-12 | MLB   | ML     | San Diego Padres        |  +112 | +0.568 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-12 | MLB   | ML     | Seattle Mariners        |  -148 | +0.916 | LOCK     | 1.00u | WIN     |      +0.68 |
| 2026-06-12 | MLB   | ML     | Minnesota Twins         |  -136 | +0.852 | LEAN     | 0.50u | WIN     |      +0.37 |
| 2026-06-12 | MLB   | SPREAD | Los Angeles Dodgers     |  +112 | +0.920 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-12 | MLB   | SPREAD | Milwaukee Brewers       |  -115 | +0.880 | LEAN     | 0.50u | WIN     |      +0.43 |
| 2026-06-12 | MLB   | SPREAD | Tampa Bay Rays          |  -102 | +0.948 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-12 | MLB   | TOTAL  | Over 8.5                |  -102 | +0.938 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-12 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.956 | PREMIUM  | 3.00u | WIN     |      +2.73 |
| 2026-06-12 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.972 | PREMIUM  | 3.00u | WIN     |      +2.73 |
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

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.550 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.158 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.064 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.081 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.109 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  182 |    +0.5093 |    -0.4132 | 0.0120 |  +0.110 |   0.962 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  182 |    +0.2614 |    +0.3129 | 0.0119 |  +0.109 |   0.495 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  182 |    +0.4943 |    -0.2627 | 0.0018 |  +0.042 |   2.442 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 182 |          +0.092 |           +0.015 |                   +0.085 |                   +0.008 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 182 |          -0.101 |           +0.280 |                   -0.106 |                   +0.052 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 182 |          -0.096 |           +0.126 |                   -0.108 |                   +0.010 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 182 |          -0.021 |           +0.115 |                   -0.005 |                   +0.094 | count of contributing AGAINST-side wallets                     |
| provenFor         | 182 |          -0.095 |           +0.132 |                   -0.104 |                   +0.016 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 182 |          -0.051 |           +0.113 |                   -0.044 |                   +0.063 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.944         |  63 | 31-32   |   49.2% |     -5.3% |
| MID (p33–p67)     | 19.950 … 17.175        |  58 | 35-23   |   60.3% |     +6.5% |
| HIGH (> p67)      | 48.906 … 47.180        |  61 | 33-28   |   54.1% |     +0.5% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       182 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8837 | average score across live picks                                 |
| SD                |    0.2088 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.660 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +6.240 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.617 / +0.965 / +0.991 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  169 | 93-76  |   55.0% |     +7.7% |  0.530 |        +0.024 | real                                      |
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
| 2026-06-12 |    7 |  116 | 62-54  |   53.4% |     +7.8% |  0.550 |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.553 avg in first half → 0.554 avg in second half · Δ = +0.001)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +8.9% | [-9.4%, +24.8%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.3% | [47.3%, 61.5%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.550 | [0.462, 0.631]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             16 | [-10, 42]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       186 |
| Unique wallets ever on a FOR side            |                                                        58 |
| Avg FOR-side wallets per pick                |                                                      2.12 |
| Top-5 wallets' share of all FOR appearances  |                                                     45.6% |
| Top-10 wallets' share of all FOR appearances |                                                     66.6% |
| Top-20 wallets' share of all FOR appearances |                                                     82.3% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   68 |    5 | 36-32  |   52.9% |     +6.2% |     +6.44 |     0.84× | CONFIRMED   |     +1.7% |     216 | 2026-06-12 |
|    2 | 70135d  | MLB,NBA    |   33 |   54 | 16-17  |   48.5% |     -0.0% |     -0.01 |     1.59× | CONFIRMED   |     -7.9% |     333 | 2026-06-12 |
|    3 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|    4 | 1e8f33  | MLB        |   27 |    6 | 16-11  |   59.3% |    -11.8% |     -7.04 |     0.99× | CONFIRMED   |     +4.5% |      51 | 2026-06-12 |
|    5 | 7923c4  | MLB,NBA    |   22 |    4 | 12-10  |   54.5% |    +40.9% |    +13.41 |     0.82× | CONFIRMED   |     +9.5% |      91 | 2026-06-12 |
|    6 | 491f30  | MLB        |   19 |    1 | 13-6   |   68.4% |    +52.6% |    +31.31 |     0.89× | CONFIRMED   |    +18.6% |      26 | 2026-06-12 |
|    7 | cd2f63  | MLB,NBA    |   19 |   14 | 10-9   |   52.6% |    +29.0% |    +12.20 |     0.94× | FLAT        |     +0.2% |     220 | 2026-06-12 |
|    8 | eeabaf  | MLB,NBA    |   17 |    1 | 8-9    |   47.1% |    -12.0% |     -5.40 |     0.81× | CONFIRMED   |    +18.2% |      66 | 2026-06-12 |
|    9 | 2f2a9e  | MLB        |   15 |   14 | 7-8    |   46.7% |    -13.7% |     -2.60 |     0.52× | CONFIRMED   |    -15.1% |      49 | 2026-06-12 |
|   10 | 10c684  | MLB,NBA    |   13 |    4 | 4-9    |   30.8% |    -31.6% |     -4.74 |     1.74× | FLAT        |    -26.6% |      31 | 2026-06-11 |
|   11 | 9a69c2  | MLB        |   11 |   33 | 5-6    |   45.5% |    +27.9% |     +3.28 |     2.51× | CONFIRMED   |    -22.3% |     124 | 2026-06-12 |
|   12 | bc3532  | MLB,NBA,NHL |    9 |   10 | 4-5    |   44.4% |    -18.9% |     -1.18 |     2.26× | FLAT        |     +2.4% |     134 | 2026-06-12 |
|   13 | 8c1eae  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |    +53.8% |     +4.71 |     1.79× | CONFIRMED   |     -7.1% |      95 | 2026-06-08 |
|   14 | 972768  | MLB        |    7 |    2 | 3-4    |   42.9% |    -62.3% |    -11.69 |     1.15× | CONFIRMED   | +Infinity% |      41 | 2026-06-12 |
|   15 | b19a27  | MLB,NBA    |    6 |    4 | 3-3    |   50.0% |    -15.9% |     -2.35 |     1.34× | CONFIRMED   |     -5.0% |     278 | 2026-06-07 |
|   16 | f2d227  | MLB,NBA    |    5 |    0 | 2-3    |   40.0% |    -76.3% |     -4.39 |     0.75× | CONFIRMED   |    -24.5% |      31 | 2026-06-10 |
|   17 | 5b1e50  | MLB,NBA    |    5 |   18 | 3-2    |   60.0% |    +12.0% |     +1.23 |     0.64× | CONFIRMED   |    -26.2% |      26 | 2026-06-12 |
|   18 | e05213  | MLB        |    4 |    2 | 4-0    |  100.0% |    +94.1% |    +10.12 |     1.35× | CONFIRMED   |    +69.6% |       9 | 2026-06-09 |
|   19 | 4d2125  | NHL        |    4 |    0 | 3-1    |   75.0% |    +14.8% |     +1.66 |     0.31× | CONFIRMED   |    +16.7% |      15 | 2026-06-09 |
|   20 | 2e8da5  | NBA        |    4 |    0 | 1-3    |   25.0% |    -51.0% |     -0.51 |     2.76× | CONFIRMED   |    +33.5% |      15 | 2026-06-10 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 491f30  | MLB        |   19 | 13-6   |   68.4% |     +52.6% |    +31.31 |     0.89× | 2026-06-12 |
|    2 | 7923c4  | MLB,NBA    |   22 | 12-10  |   54.5% |     +40.9% |    +13.41 |     0.82× | 2026-06-12 |
|    3 | cd2f63  | MLB,NBA    |   19 | 10-9   |   52.6% |     +29.0% |    +12.20 |     0.94× | 2026-06-12 |
|    4 | 9a69c2  | MLB        |   11 | 5-6    |   45.5% |     +27.9% |     +3.28 |     2.51× | 2026-06-12 |
|    5 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    6 | 4c64aa  | MLB        |   68 | 36-32  |   52.9% |      +6.2% |     +6.44 |     0.84× | 2026-06-12 |
|    7 | 70135d  | MLB,NBA    |   33 | 16-17  |   48.5% |      -0.0% |     -0.01 |     1.59× | 2026-06-12 |
|    8 | 1e8f33  | MLB        |   27 | 16-11  |   59.3% |     -11.8% |     -7.04 |     0.99× | 2026-06-12 |
|    9 | eeabaf  | MLB,NBA    |   17 | 8-9    |   47.1% |     -12.0% |     -5.40 |     0.81× | 2026-06-12 |
|   10 | 2f2a9e  | MLB        |   15 | 7-8    |   46.7% |     -13.7% |     -2.60 |     0.52× | 2026-06-12 |
|   11 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |
|    2 | 2f2a9e  | MLB        |   15 | 7-8    |   46.7% |     -13.7% |     -2.60 |     0.52× | 2026-06-12 |
|    3 | eeabaf  | MLB,NBA    |   17 | 8-9    |   47.1% |     -12.0% |     -5.40 |     0.81× | 2026-06-12 |
|    4 | 1e8f33  | MLB        |   27 | 16-11  |   59.3% |     -11.8% |     -7.04 |     0.99× | 2026-06-12 |
|    5 | 70135d  | MLB,NBA    |   33 | 16-17  |   48.5% |      -0.0% |     -0.01 |     1.59× | 2026-06-12 |
|    6 | 4c64aa  | MLB        |   68 | 36-32  |   52.9% |      +6.2% |     +6.44 |     0.84× | 2026-06-12 |
|    7 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    8 | 9a69c2  | MLB        |   11 | 5-6    |   45.5% |     +27.9% |     +3.28 |     2.51× | 2026-06-12 |
|    9 | cd2f63  | MLB,NBA    |   19 | 10-9   |   52.6% |     +29.0% |    +12.20 |     0.94× | 2026-06-12 |
|   10 | 7923c4  | MLB,NBA    |   22 | 12-10  |   54.5% |     +40.9% |    +13.41 |     0.82× | 2026-06-12 |
|   11 | 491f30  | MLB        |   19 | 13-6   |   68.4% |     +52.6% |    +31.31 |     0.89× | 2026-06-12 |

> 🔴 **4 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `10c684` (FOR# 13, ROI -31.6%), `2f2a9e` (FOR# 15, ROI -13.7%), `eeabaf` (FOR# 17, ROI -12.0%), `1e8f33` (FOR# 27, ROI -11.8%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   133 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     4 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     5 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   104 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

- **Computed at:** 2026-06-12T15:55:37.439Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 1004
- **Date range:** 2026-04-18 → 2026-06-11

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.982 | ELITE           | 5.00u                  |
| q60      |        +0.955 | PREMIUM         | 3.00u                  |
| q40      |        +0.902 | LOCK            | 1.00u                  |
| q20      |        +0.782 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            126 |        32 |   13 |    6 |   75 |                     51 |
| NBA   |            206 |        55 |   25 |   22 |  104 |                    102 |
| NHL   |            105 |        22 |    8 |   12 |   63 |                     42 |
| SOC   |             20 |         0 |    0 |    0 |   20 |                      0 |

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~533 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 420 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 182 / 420 (43%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 182 / 420 (43%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 182 / 420 (43%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 182 / 420 (43%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 182 / 420 (43%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 182 / 420 (43%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 182 / 420 (43%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 420 / 420 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 420 / 420 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 420 / 420 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 420 / 420 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 420 / 420 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 420 / 420 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 416 / 420 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 415 / 420 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 420 / 420 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 420 / 420 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 242 / 420 (58%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 420 / 420 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 242 / 420 (58%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 242 / 420 (58%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 420 / 420 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 420 / 420 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 420 / 420 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 420 / 420 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 420 / 420 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd forCount          | 420 |      |    -0.122 |    -0.066 |      -0.117 |      -0.091 |  0.448 |
|    2 | provenFor            | 420 |      |    -0.113 |    -0.078 |      -0.114 |      -0.115 |  0.444 |
|    3 | qMargin              | 182 |  🟢  |    +0.119 |    +0.053 |      +0.112 |      +0.043 |  0.553 |
|    4 | agsV12               | 182 |  🟢  |    +0.109 |    +0.064 |      +0.110 |      +0.081 |  0.550 |
|    5 | V12 forCount         | 182 |  🟢  |    -0.096 |    +0.126 |      -0.108 |      +0.010 |  0.499 |
|    6 | countMargin          | 182 |      |    -0.081 |    +0.017 |      -0.107 |      -0.074 |  0.467 |
|    7 | V12 agMean           | 182 |  🟢  |    -0.101 |    +0.280 |      -0.106 |      +0.052 |  0.498 |
|    8 | wd contribFor        | 420 |      |    -0.114 |    -0.169 |      -0.104 |      -0.121 |  0.468 |
|    9 | provenTotal          | 420 |      |    -0.107 |    -0.038 |      -0.103 |      -0.076 |  0.447 |
|   10 | V12 forMean          | 182 |  🟢  |    +0.092 |    +0.015 |      +0.085 |      +0.008 |  0.533 |
|   11 | provenMargin         | 420 |      |    -0.074 |    -0.109 |      -0.082 |      -0.111 |  0.461 |
|   12 | wd maxShare          | 420 |      |    +0.082 |    +0.059 |      +0.072 |      +0.055 |  0.560 |
|   13 | wd contribMargin     | 420 |      |    -0.071 |    -0.230 |      -0.070 |      -0.151 |  0.464 |
|   14 | wd contribAg         | 420 |      |    -0.079 |    +0.111 |      -0.066 |      +0.058 |  0.480 |
|   15 | hcMargin             | 420 |      |    -0.039 |    +0.049 |      -0.062 |      -0.022 |  0.499 |
|   16 | provenAg             | 420 |      |    -0.067 |    +0.175 |      -0.059 |      +0.078 |  0.474 |
|   17 | wd forAvgSize        | 420 |      |    -0.022 |    -0.081 |      -0.046 |      -0.090 |  0.521 |
|   18 | wd agAvgSize         | 242 |      |    -0.064 |    -0.035 |      -0.038 |      -0.023 |  0.479 |
|   19 | ags (v11)            | 420 |      |    -0.012 |    -0.228 |      -0.037 |      -0.192 |  0.471 |
|   20 | wd agCount           | 242 |      |    -0.046 |    +0.250 |      -0.035 |      +0.118 |  0.503 |
|   21 | wd sizeMargin        | 242 |      |    +0.006 |    -0.108 |      -0.030 |      -0.107 |  0.511 |
|   22 | lockPinnProb         | 416 |      |    +0.123 |    +0.128 |      +0.015 |      -0.136 |  0.562 |
|   23 | wd maxForContrib     | 420 |      |    -0.017 |    -0.102 |      -0.013 |      -0.058 |  0.514 |
|   24 | peakStars            | 420 |      |    -0.001 |    +0.104 |      -0.013 |      -0.003 |  0.491 |
|   25 | V12 agCount          | 182 |  🟢  |    -0.021 |    +0.115 |      -0.005 |      +0.094 |  0.512 |
|   26 | clv                  | 415 |      |    +0.033 |    +0.027 |      -0.004 |      +0.053 |  0.543 |

> **Top 3 univariate features by PnL correlation:** `wd forCount` (r = -0.117), `provenFor` (r = -0.114), `qMargin` (r = +0.112).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd forCount` — r(unit-ret) = -0.117, AUC = 0.448. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd forCount` · r(unit-ret) = -0.117 · AUC = 0.448

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 144 | 82-62   |   56.9% |     +4.3% |
| MID (p33–p67)     | 2.000 … 2.000            | 136 | 77-59   |   56.6% |     +2.7% |
| HIGH (> p67)      | 4.000 … 3.000            | 140 | 66-74   |   47.1% |     -6.2% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `provenFor` · r(unit-ret) = -0.114 · AUC = 0.444

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 161 | 91-70   |   56.5% |     +3.9% |
| MID (p33–p67)     | 2.000 … 2.000            | 131 | 79-52   |   60.3% |     +6.3% |
| HIGH (> p67)      | 10.000 … 3.000           | 128 | 55-73   |   43.0% |     -9.5% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.112 · AUC = 0.553

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.944           |  61 | 32-29   |   52.5% |     +2.7% |
| MID (p33–p67)     | 19.950 … 17.175          |  60 | 32-28   |   53.3% |     +0.1% |
| HIGH (> p67)      | 46.556 … 34.368          |  61 | 35-26   |   57.4% |     +2.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `agsV12` · r(unit-ret) = +0.110 · AUC = 0.550

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.944 … 0.938            |  61 | 34-27   |   55.7% |    +15.1% |
| MID (p33–p67)     | 0.974 … 0.972            |  60 | 28-32   |   46.7% |     -6.8% |
| HIGH (> p67)      | 0.976 … 0.996            |  61 | 37-24   |   60.7% |     +3.9% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forCount` · r(unit-ret) = -0.108 · AUC = 0.499

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            |  87 | 44-43   |   50.6% |     -0.3% |
| MID (p33–p67)     | 2.000 … 2.000            |  47 | 33-14   |   70.2% |    +14.2% |
| HIGH (> p67)      | 3.000 … 3.000            |  48 | 22-26   |   45.8% |    -13.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd forCount    | provenFor      | qMargin        | agsV12         | V12 forCount   | countMargin    | V12 agMean     | wd contribFor  |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd forCount |  1.000         |         +0.932 |         -0.179 |         -0.447 |         +0.989 |         +0.626 |         +0.534 |         +0.922 |
| provenFor   |         +0.932 |  1.000         |         -0.116 |         -0.430 |         +0.918 |         +0.574 |         +0.531 |         +0.874 |
| qMargin     |         -0.179 |         -0.116 |  1.000         |         +0.189 |         -0.180 |         -0.314 |         +0.048 |         -0.022 |
| agsV12      |         -0.447 |         -0.430 |         +0.189 |  1.000         |         -0.436 |         -0.002 |         -0.782 |         -0.450 |
| V12 forCount |         +0.989 |         +0.918 |         -0.180 |         -0.436 |  1.000         |         +0.647 |         +0.517 |         +0.904 |
| countMargin |         +0.626 |         +0.574 |         -0.314 |         -0.002 |         +0.647 |  1.000         |         -0.033 |         +0.488 |
| V12 agMean  |         +0.534 |         +0.531 |         +0.048 |         -0.782 |         +0.517 |         -0.033 |  1.000         |         +0.623 |
| wd contribFor |         +0.922 |         +0.874 |         -0.022 |         -0.450 |         +0.904 |         +0.488 |         +0.623 |  1.000         |

> 🔴 **Strong collinearity detected:** `wd forCount` and `V12 forCount` have r = +0.989. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 182 picks · features = 8 (+ intercept) · multiple R² = **0.0333** · adjusted R² = **-0.0173** · residual sd = 0.976

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd forCount          |     |    +0.1666 |   0.5826 | +0.29        |        1 |
|    2 | V12 agMean           |  🟢 |    -0.1423 |   0.1508 | -0.94        |        2 |
|    3 | countMargin          |     |    -0.1208 |   0.1183 | -1.02        |        3 |
|    4 | qMargin              |  🟢 |    +0.0871 |   0.0859 | +1.01        |        4 |
|    5 | V12 forCount         |  🟢 |    -0.0745 |   0.5021 | -0.15        |        5 |
|    6 | provenFor            |     |    -0.0491 |   0.2031 | -0.24        |        6 |
|    7 | wd contribFor        |     |    +0.0235 |   0.2217 | +0.11        |        7 |
|    8 | agsV12               |  🟢 |    +0.0097 |   0.1275 | +0.08        |        8 |
| —    | (intercept)          |     |    +0.0369 |   0.0723 |    +0.51 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **4 / 8** top multivariate features are inputs to V12 (50%).
- V12 consumes: `V12 agMean` (β = -0.142), `qMargin` (β = +0.087), `V12 forCount` (β = -0.074), `agsV12` (β = +0.010)
- V12 IGNORES: `wd forCount` (β = +0.167, t = +0.29), `countMargin` (β = -0.121, t = -1.02), `provenFor` (β = -0.049, t = -0.24), `wd contribFor` (β = +0.024, t = +0.11)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.550 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.571 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.022.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Inputs V12 currently uses but that show weak multivariate signal: `agsV12`. They may be contributing noise rather than information.
- Sample size is currently 420 live picks — statistically meaningful but tight. Treat single-feature recommendations as provisional until N ≥ 500. The rankings will firm up as the daily cron accumulates more graded picks.
- Adjusted R² of -0.0173 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*