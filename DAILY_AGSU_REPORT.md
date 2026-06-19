# AGS-Unified — V12 Performance Monitor

**Generated:** Friday, June 19, 2026 at 5:22 AM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 19

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (19 days ago), V12 has evaluated **490** picks, shipped **235** for real money (48.0% ship rate), and muted the other **255**. On the shipped picks V12 has gone **129-106** (54.9% win), staked **512.75u**, and returned **+29.95u** at **+5.8% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             19 |
| Picks V12 has evaluated             |                            490 |
| Picks SHIPPED (units > 0)           |                            235 |
| Picks MUTED (score ≤ 0, FADE)       |                            255 |
| Ship rate                           |                          48.0% |
| Live W-L                            |                        129-106 |
| Live Win %                          |                          54.9% |
| Live PnL (units)                    |                         +29.95 |
| Live ROI                            |                          +5.8% |
| Avg PnL / day                       |                         +1.58u |
| Most recent action (2026-06-19)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **5.8% ROI** across 235 live picks (+29.95u real PnL).
- Mute rule is **saving money** — the 146 muted picks would have lost -16.58u at flat 1u (-11.4% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.58u/day** on average since launch.
- **NHL** is V12's strongest sport: 6 live, 5-1, 38.2% ROI, +6.30u.
- **NBA** is V12's strongest sport: 10 live, 3-7, 29.1% ROI, +2.33u.

## § 2 — Model Version Comparison (V9 → V10 → V11 → V12)

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   19 |    235 | 146 | 129-106 |  54.9% |      5.8% |     +29.95 |    +0.13 | 0.529 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  175 |    +1.6pp |    +14.8pp |          +0.300 |   -0.020 |          — | 🟡 mixed |
| v12 − v10          | +  173 |    +6.5pp |    +24.6pp |          +0.441 |   +0.135 |          — | 🟢 better |
| v12 − v11          | +  124 |    -0.1pp |     +3.0pp |          +0.067 |   +0.085 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 219n 55.3% +4% | 10n 30.0% +29% | 6n 83.3% +38%  | 235n 54.9% +6% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 55n +4%       | 63n +13%      | 53n -17%      | 32n +15%      | 28n -6%       | 🟡 partial (0) |

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
| 2026-06-13 |        30 |   19 |     7 | 11-8       |  57.9% |     43.50 |      +1.81 |      4.2% |     +35.75 |
| 2026-06-14 |        32 |   13 |    11 | 6-7        |  46.2% |     30.25 |     -16.07 |    -53.1% |     +19.68 |
| 2026-06-15 |        31 |    2 |    15 | 2-0        | 100.0% |      6.00 |      +5.07 |     84.5% |     +24.75 |
| 2026-06-16 |        36 |    6 |    21 | 3-3        |  50.0% |     24.00 |      -0.85 |     -3.5% |     +23.90 |
| 2026-06-17 |        37 |    5 |    20 | 3-2        |  60.0% |     14.50 |      +1.96 |     13.5% |     +25.86 |
| 2026-06-18 |        21 |    4 |     7 | 3-1        |  75.0% |     12.50 |      +4.09 |     32.7% |     +29.95 |
| 2026-06-19 |         9 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +29.95 |

> **Trajectory.** 🟢 Last 3 days (22.4% ROI) is **+17.5pp better** than the prior window (4.9%). V12 is accelerating.

> **Bottom line.** 19 days live, 235 live picks shipped, **+29.95u total PnL** at **+5.8% ROI**, averaging **+1.58u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  60 | 31-24  |  56.4% |        +0.989 |    5.00u |            4.32u | -0.68u |      237.50 |      +8.51 |      3.6% |
| PREMIUM  |  3.00u |  74 | 38-25  |  60.3% |        +0.971 |    3.00u |            2.92u | -0.08u |      184.00 |     +24.62 |     13.4% |
| LOCK     |  1.00u |  67 | 23-30  |  43.4% |        +0.944 |    1.00u |            1.00u | +0.00u |       53.00 |      -8.84 |    -16.7% |
| LEAN     |  0.50u |  37 | 21-11  |  65.6% |        +0.870 |    0.50u |            0.80u | +0.30u |       25.50 |      +3.82 |     15.0% |
| WEAK     |  0.25u |  36 | 14-14  |  50.0% |        +0.429 |    0.25u |            0.25u | +0.00u |        7.00 |      -0.41 |     -5.9% |
| FADE     |  0.00u | 103 | 0-0    |      — |        -0.197 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### v12.1 — By Stake Tier (HC margin)

Post-cutover picks size off the **HC margin**, not the score quintile. SUPER (margin 2 · 6u), TOP (margin 1 · 4u), MINI (mini-HC 1.0–1.5× · 3u), CONFIRMED (margin 3+ · 1u) are staked; **MONITORING** (non-HC or WEAK-tier HC) is tracked at **0u** and excluded from the staked record/ROI below.

| Stake Tier | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|------------|-------|-----|--------|--------|-------------|------------|-----------|
| SUPER      | 6.00u |   1 | 1-0    | 100.0% |        6.00 |      +4.48 |     74.7% |
| TOP        | 4.00u |   5 | 3-2    |  60.0% |       18.50 |      -0.75 |     -4.1% |
| MINI       | 3.00u |  11 | 7-4    |  63.6% |       32.50 |      +6.54 |     20.1% |

> **MONITORING volume:** 43 picks tracked at 0u (would-be 20-23, 46.5% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Sizing pipeline integrity

🚨 **54 picks deviate from the V12 ladder by > ±0.05u** even after accounting for the production odds-cap. Investigate `unitsFromAgsV12` in `syncPickStateAuthoritative.js`.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Expected (capped) | Actual | Drift  |
|------------|-------|--------|-------------------------|-------|-------|----------|-------------------|--------|--------|
| 2026-06-15 | MLB   | ML     | Chicago Cubs            |  -210 | +0.923 | LOCK     |             1.00u |  0.00u |  -1.00 |
| 2026-06-15 | MLB   | ML     | Los Angeles Angels      |  +122 | +0.868 | LEAN     |             0.50u |  0.00u |  -0.50 |
| 2026-06-15 | MLB   | ML     | Miami Marlins           |  +165 | +0.875 | LEAN     |             0.50u |  0.00u |  -0.50 |
| 2026-06-15 | MLB   | ML     | Texas Rangers           |  -150 | +0.765 | WEAK     |             0.25u |  0.00u |  -0.25 |
| 2026-06-15 | MLB   | ML     | Cincinnati Reds         |  -136 | +0.895 | LEAN     |             0.50u |  3.00u |  +2.50 |
| 2026-06-15 | MLB   | ML     | St. Louis Cardinals     |  -151 | +0.831 | LEAN     |             0.50u |  0.00u |  -0.50 |
| 2026-06-15 | MLB   | ML     | Los Angeles Dodgers     |  -186 | +0.512 | WEAK     |             0.25u |  0.00u |  -0.25 |
| 2026-06-15 | MLB   | SPREAD | Washington Nationals    |  +153 | +0.932 | LOCK     |             1.00u |  0.00u |  -1.00 |
| 2026-06-15 | MLB   | SPREAD | Miami Marlins           |  -120 | +0.681 | WEAK     |             0.25u |  0.00u |  -0.25 |
| 2026-06-15 | MLB   | SPREAD | San Diego Padres        |  -150 | +0.979 | ELITE    |             5.00u |  0.00u |  -5.00 |
| 2026-06-15 | MLB   | TOTAL  | Over 9.5                |  +100 | +0.938 | LOCK     |             1.00u |  0.00u |  -1.00 |
| 2026-06-15 | MLB   | TOTAL  | Over 9.5                |  +100 | +0.977 | PREMIUM  |             2.50u |  0.00u |  -2.50 |
| 2026-06-15 | MLB   | TOTAL  | Over 7.5                |  -110 | +0.963 | PREMIUM  |             3.00u |  0.00u |  -3.00 |
| 2026-06-15 | MLB   | TOTAL  | Over 8.5                |  +102 | +0.933 | LOCK     |             1.00u |  0.00u |  -1.00 |
| 2026-06-15 | MLB   | TOTAL  | Under 10.5              |  -110 | +0.950 | LOCK     |             1.00u |  0.00u |  -1.00 |
| 2026-06-15 | MLB   | TOTAL  | Over 9.5                |  -103 | +0.934 | LOCK     |             1.00u |  0.00u |  -1.00 |
| 2026-06-16 | MLB   | ML     | Seattle Mariners        |  -146 | +0.905 | LOCK     |             1.00u |  0.00u |  -1.00 |
| 2026-06-16 | MLB   | ML     | Chicago Cubs            |  -205 | +0.958 | PREMIUM  |             3.00u |  0.00u |  -3.00 |
| 2026-06-16 | MLB   | ML     | Houston Astros          |  -168 | +0.977 | PREMIUM  |             3.00u |  4.00u |  +1.00 |
| 2026-06-16 | MLB   | ML     | Washington Nationals    |  -134 | +0.975 | PREMIUM  |             3.00u |  6.00u |  +3.00 |
| 2026-06-16 | MLB   | ML     | Los Angeles Angels      |  -106 | +0.706 | WEAK     |             0.25u |  0.00u |  -0.25 |
| 2026-06-16 | MLB   | ML     | Philadelphia Phillies   |  -175 | +0.839 | LEAN     |             0.50u |  4.00u |  +3.50 |
| 2026-06-16 | MLB   | ML     | New York Mets           |  -120 | +0.896 | LOCK     |             1.00u |  0.00u |  -1.00 |
| 2026-06-16 | MLB   | ML     | Athletics               |  -138 | +0.878 | LEAN     |             0.50u |  0.00u |  -0.50 |
| 2026-06-16 | MLB   | ML     | San Diego Padres        |  +100 | +0.878 | LEAN     |             0.50u |  0.00u |  -0.50 |
| _… and 29 more_ |

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 130n · 55.4% · +6.3%   | 17n · 58.8% · -5.6%    | 72n · 54.2% · +3.6%    | 219n · 55.3% · +4.4%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| **All** | **137n · 54.0% · +5.9%** | **21n · 61.9% · +11.7%** | **77n · 54.5% · +4.7%** | **235n · 54.9% · +5.8%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  | 208 |    180 | 98-82  |    53.4% |   52.8% |     +0.6pp |      5.5% |
| 0.7 – 0.9          |  36 |     27 | 18-9   |    58.3% |   55.4% |     +2.9pp |     11.0% |
| 0.5 – 0.7          |   9 |      5 | 3-2    |    55.6% |   54.9% |     +0.6pp |      8.8% |
| 0.25 – 0.5         |  11 |     10 | 5-5    |    54.5% |   53.8% |     +0.8pp |     -6.8% |
| (0, 0.25]          |  10 |      9 | 3-6    |    40.0% |   56.6% |    -16.6pp |    -33.8% |
| ≤ 0 (MUTED)        |  97 |      0 | 0-0    |    48.5% |   52.9% |     -4.4pp |         — |

> 🟡 **Strong-score band (> 0.9) edge is +0.6pp** — borderline. Larger sample needed before declaring V12's top tier as real alpha.

> 🟢 **Mute band (≤ 0) actually wins only 48.5%** — V12 correctly identifies these as losers. The mute rule is justified.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **146** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  146 |
| Muted W-L                           |                68-78 |
| Muted Win %                         |                46.6% |
| Counterfactual PnL at flat 1u       |               -16.58 |
| Counterfactual ROI at flat 1u       |               -11.4% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-16.58u** at a flat 1u stake — a counterfactual ROI of **-11.4%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  363 |
| Spearman ρ (v11 vs V12 score)       |               -0.314 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.314. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 372 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +19.918 |                        2.0 |
| AGAINST |             +3.777 |                        1.1 |

### One-sided wallet support (high-variance picks)

- **25** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **0** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **10-8** (55.6% win) at **-1.1% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   0 |   1 |   2 |   3 |   9 |
| AGAINST |   0 |   0 |   1 |   2 |   6 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|
| 2026-06-18 | MLB   | ML     | Milwaukee Brewers       |  -148 | +0.974 | PREMIUM  | 4.00u | LOSS    |      -4.00 |
| 2026-06-18 | MLB   | ML     | New York Mets           |  +103 | +0.960 | PREMIUM  | 2.50u | WIN     |      +2.58 |
| 2026-06-18 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.954 | PREMIUM  | 3.00u | WIN     |      +2.73 |
| 2026-06-18 | MLB   | TOTAL  | Under 8.5               |  -108 | +0.960 | PREMIUM  | 3.00u | WIN     |      +2.78 |
| 2026-06-17 | MLB   | ML     | Miami Marlins           |  +100 | +0.983 | ELITE    | 2.50u | WIN     |      +2.50 |
| 2026-06-17 | MLB   | ML     | Boston Red Sox          |  -123 | +0.985 | ELITE    | 3.00u | LOSS    |      -3.00 |
| 2026-06-17 | MLB   | TOTAL  | Over 7.5                |  -110 | +0.983 | ELITE    | 3.00u | WIN     |      +2.73 |
| 2026-06-17 | MLB   | TOTAL  | Under 9.5               |  -110 | +0.985 | ELITE    | 3.00u | WIN     |      +2.73 |
| 2026-06-17 | MLB   | TOTAL  | Over 10.5               |  -110 | +0.980 | ELITE    | 3.00u | LOSS    |      -3.00 |
| 2026-06-16 | MLB   | ML     | Houston Astros          |  -168 | +0.977 | PREMIUM  | 4.00u | WIN     |      +2.38 |
| 2026-06-16 | MLB   | ML     | Washington Nationals    |  -134 | +0.975 | PREMIUM  | 6.00u | WIN     |      +4.48 |
| 2026-06-16 | MLB   | ML     | Philadelphia Phillies   |  -175 | +0.839 | LEAN     | 4.00u | WIN     |      +2.29 |
| 2026-06-16 | MLB   | ML     | Atlanta Braves          |  -172 | +0.778 | LEAN     | 4.00u | LOSS    |      -4.00 |
| 2026-06-16 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.973 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-16 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.986 | ELITE    | 3.00u | LOSS    |      -3.00 |
| 2026-06-15 | MLB   | ML     | Cincinnati Reds         |  -136 | +0.895 | LEAN     | 3.00u | WIN     |      +2.21 |
| 2026-06-15 | MLB   | SPREAD | Colorado Rockies        |  -105 | +0.968 | PREMIUM  | 3.00u | WIN     |      +2.86 |
| 2026-06-14 | MLB   | ML     | Atlanta Braves          |  +110 | +0.931 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-14 | MLB   | ML     | San Francisco Giants    |  -134 | +0.345 | WEAK     | 0.25u | WIN     |      +0.19 |
| 2026-06-14 | MLB   | ML     | Athletics               |  -192 | +0.985 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-14 | MLB   | ML     | Houston Astros          |  +106 | +0.964 | PREMIUM  | 2.50u | LOSS    |      -2.50 |
| 2026-06-14 | MLB   | ML     | New York Yankees        |  -130 | +0.935 | LOCK     | 1.00u | WIN     |      +0.77 |
| 2026-06-14 | MLB   | ML     | St. Louis Cardinals     |  -101 | +0.964 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-14 | MLB   | ML     | Tampa Bay Rays          |  -118 | +0.722 | WEAK     | 0.25u | WIN     |      +0.21 |
| 2026-06-14 | NHL   | ML     | Hurricanes              |  -115 | +0.230 | WEAK     | 0.25u | WIN     |      +0.22 |
| 2026-06-14 | MLB   | SPREAD | Chicago Cubs            |  -180 | +0.982 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-14 | MLB   | SPREAD | Los Angeles Dodgers     |  -116 | +0.965 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-14 | MLB   | SPREAD | Miami Marlins           |  -161 | +0.946 | LOCK     | 1.00u | WIN     |      +0.62 |
| 2026-06-14 | MLB   | TOTAL  | Under 13.5              |  -110 | +0.964 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-14 | NHL   | TOTAL  | Under 5.5               |  -113 | +0.985 | ELITE    | 5.00u | WIN     |      +4.42 |

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.517 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.101 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.009 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.064 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.064 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟠 **Random** — score is not predicting outcomes; PnL is variance, not edge

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  231 |    +0.3237 |    -0.2437 | 0.0047 |  +0.068 |   0.958 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  231 |    +0.1570 |    +0.4105 | 0.0041 |  +0.064 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  231 |    +0.3554 |    -0.1953 | 0.0008 |  +0.028 |   2.541 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 231 |          +0.049 |           -0.065 |                   +0.048 |                   -0.019 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 231 |          -0.085 |           +0.306 |                   -0.089 |                   +0.069 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 231 |          -0.080 |           +0.154 |                   -0.095 |                   +0.001 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 231 |          -0.021 |           +0.129 |                   -0.010 |                   +0.086 | count of contributing AGAINST-side wallets                     |
| provenFor         | 231 |          -0.064 |           +0.174 |                   -0.078 |                   +0.015 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 231 |          -0.048 |           +0.099 |                   -0.043 |                   +0.049 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 12.090         |  77 | 46-31   |   59.7% |    +14.6% |
| MID (p33–p67)     | 19.950 … 18.915        |  77 | 39-38   |   50.6% |     -2.1% |
| HIGH (> p67)      | 48.906 … 32.400        |  77 | 42-35   |   54.5% |     +1.3% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       231 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8869 | average score across live picks                                 |
| SD                |    0.2027 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.694 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +6.407 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.667 / +0.964 / +0.990 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  215 | 119-96 |   55.3% |     +4.0% |  0.496 |        -0.033 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |

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
| 2026-06-13 |    7 |  121 | 66-55  |   54.5% |     +9.0% |  0.547 |
| 2026-06-14 |    7 |  111 | 58-53  |   52.3% |     +1.9% |  0.520 |
| 2026-06-15 |    7 |  101 | 53-48  |   52.5% |     -0.1% |  0.476 |
| 2026-06-16 |    7 |   86 | 46-40  |   53.5% |     -7.6% |  0.417 |
| 2026-06-17 |    7 |   68 | 38-30  |   55.9% |     -2.0% |  0.446 |
| 2026-06-18 |    7 |   65 | 37-28  |   56.9% |     +1.3% |  0.441 |

> 🔴 **AUC is trending DOWN** — V12 is degrading; investigate quintile cutoffs and wallet pool drift (0.554 avg in first half → 0.475 avg in second half · Δ = -0.079)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.8% | [-10.0%, +20.0%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.9% | [48.9%, 61.0%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.517 | [0.438, 0.593]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             23 | [-5, 51]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       235 |
| Unique wallets ever on a FOR side            |                                                        62 |
| Avg FOR-side wallets per pick                |                                                      2.17 |
| Top-5 wallets' share of all FOR appearances  |                                                     45.2% |
| Top-10 wallets' share of all FOR appearances |                                                     66.8% |
| Top-20 wallets' share of all FOR appearances |                                                     82.1% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   76 |    7 | 41-35  |   53.9% |     -0.6% |     -0.70 |     0.85× | CONFIRMED   |     +1.2% |     242 | 2026-06-18 |
|    2 | 1e8f33  | MLB        |   56 |    6 | 34-22  |   60.7% |     -1.3% |     -1.66 |     0.91× | CONFIRMED   |     +8.3% |      95 | 2026-06-18 |
|    3 | 70135d  | MLB,NBA    |   42 |   61 | 23-19  |   54.8% |     +9.5% |     +5.60 |     1.46× | CONFIRMED   |     -5.2% |     378 | 2026-06-18 |
|    4 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|    5 | cd2f63  | MLB,NBA    |   26 |   16 | 13-13  |   50.0% |    +17.4% |    +10.55 |     0.78× | FLAT        |     +1.2% |     243 | 2026-06-18 |
|    6 | 491f30  | MLB        |   24 |    1 | 16-8   |   66.7% |    +42.3% |    +33.39 |     0.96× | CONFIRMED   |     +3.8% |      39 | 2026-06-16 |
|    7 | 7923c4  | MLB,NBA    |   24 |    6 | 14-10  |   58.3% |    +47.5% |    +18.90 |     0.76× | CONFIRMED   |     +6.5% |     106 | 2026-06-16 |
|    8 | eeabaf  | MLB,NBA    |   23 |    1 | 10-13  |   43.5% |    -20.3% |    -13.77 |     0.78× | CONFIRMED   |     +9.6% |      74 | 2026-06-18 |
|    9 | 2f2a9e  | MLB        |   23 |   18 | 12-11  |   52.2% |     -9.7% |     -3.36 |     1.31× | CONFIRMED   |     -5.6% |      85 | 2026-06-18 |
|   10 | 9a69c2  | MLB        |   16 |   36 | 9-7    |   56.3% |    +37.3% |     +7.83 |     2.78× | CONFIRMED   |    -17.4% |     139 | 2026-06-16 |
|   11 | 10c684  | MLB,NBA    |   13 |    4 | 4-9    |   30.8% |    -31.6% |     -4.74 |     1.74× | FLAT        |    -26.6% |      31 | 2026-06-11 |
|   12 | bc3532  | MLB,NBA,NHL |   11 |   14 | 6-5    |   54.5% |    +30.7% |     +4.07 |     2.17× | CONFIRMED   |     +3.0% |     151 | 2026-06-18 |
|   13 | 972768  | MLB        |    9 |    2 | 5-4    |   55.6% |    -26.1% |     -6.33 |     1.01× | CONFIRMED   | +Infinity% |      46 | 2026-06-18 |
|   14 | 5b1e50  | MLB,NBA,NHL |    8 |   24 | 6-2    |   75.0% |    +45.4% |     +8.97 |     1.54× | CONFIRMED   |    -11.3% |      58 | 2026-06-18 |
|   15 | 8c1eae  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |    +53.8% |     +4.71 |     1.79× | FLAT        |     -8.0% |      96 | 2026-06-08 |
|   16 | bc44b0  | MLB,NBA,NHL |    7 |    4 | 3-4    |   42.9% |    -37.1% |     -3.52 |     1.98× | FLAT        |    -13.5% |      25 | 2026-06-18 |
|   17 | b19a27  | MLB,NBA    |    6 |    4 | 3-3    |   50.0% |    -15.9% |     -2.35 |     1.34× | CONFIRMED   |     -5.0% |     278 | 2026-06-07 |
|   18 | e05213  | MLB        |    6 |    2 | 4-2    |   66.7% |    +24.6% |     +4.12 |     1.26× | CONFIRMED   |    +36.9% |      14 | 2026-06-17 |
|   19 | 4d2125  | NHL        |    6 |    0 | 5-1    |   83.3% |    +38.2% |     +6.30 |     0.73× | CONFIRMED   |    +25.1% |      17 | 2026-06-14 |
|   20 | 2e8da5  | NBA        |    5 |    0 | 1-4    |   20.0% |    -60.8% |     -0.76 |     3.06× | FLAT        |    +25.1% |      16 | 2026-06-13 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 7923c4  | MLB,NBA    |   24 | 14-10  |   58.3% |     +47.5% |    +18.90 |     0.76× | 2026-06-16 |
|    2 | 491f30  | MLB        |   24 | 16-8   |   66.7% |     +42.3% |    +33.39 |     0.96× | 2026-06-16 |
|    3 | 9a69c2  | MLB        |   16 | 9-7    |   56.3% |     +37.3% |     +7.83 |     2.78× | 2026-06-16 |
|    4 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    5 | cd2f63  | MLB,NBA    |   26 | 13-13  |   50.0% |     +17.4% |    +10.55 |     0.78× | 2026-06-18 |
|    6 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    7 | 70135d  | MLB,NBA    |   42 | 23-19  |   54.8% |      +9.5% |     +5.60 |     1.46× | 2026-06-18 |
|    8 | 4c64aa  | MLB        |   76 | 41-35  |   53.9% |      -0.6% |     -0.70 |     0.85× | 2026-06-18 |
|    9 | 1e8f33  | MLB        |   56 | 34-22  |   60.7% |      -1.3% |     -1.66 |     0.91× | 2026-06-18 |
|   10 | 2f2a9e  | MLB        |   23 | 12-11  |   52.2% |      -9.7% |     -3.36 |     1.31× | 2026-06-18 |
|   11 | eeabaf  | MLB,NBA    |   23 | 10-13  |   43.5% |     -20.3% |    -13.77 |     0.78× | 2026-06-18 |
|   12 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |
|    2 | eeabaf  | MLB,NBA    |   23 | 10-13  |   43.5% |     -20.3% |    -13.77 |     0.78× | 2026-06-18 |
|    3 | 2f2a9e  | MLB        |   23 | 12-11  |   52.2% |      -9.7% |     -3.36 |     1.31× | 2026-06-18 |
|    4 | 1e8f33  | MLB        |   56 | 34-22  |   60.7% |      -1.3% |     -1.66 |     0.91× | 2026-06-18 |
|    5 | 4c64aa  | MLB        |   76 | 41-35  |   53.9% |      -0.6% |     -0.70 |     0.85× | 2026-06-18 |
|    6 | 70135d  | MLB,NBA    |   42 | 23-19  |   54.8% |      +9.5% |     +5.60 |     1.46× | 2026-06-18 |
|    7 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    8 | cd2f63  | MLB,NBA    |   26 | 13-13  |   50.0% |     +17.4% |    +10.55 |     0.78× | 2026-06-18 |
|    9 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   10 | 9a69c2  | MLB        |   16 | 9-7    |   56.3% |     +37.3% |     +7.83 |     2.78× | 2026-06-16 |
|   11 | 491f30  | MLB        |   24 | 16-8   |   66.7% |     +42.3% |    +33.39 |     0.96× | 2026-06-16 |
|   12 | 7923c4  | MLB,NBA    |   24 | 14-10  |   58.3% |     +47.5% |    +18.90 |     0.76× | 2026-06-16 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `10c684` (FOR# 13, ROI -31.6%), `eeabaf` (FOR# 23, ROI -20.3%), `2f2a9e` (FOR# 23, ROI -9.7%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   238 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    27 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     3 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    13 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     4 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   124 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| 2026-06-15_MLB_laa_ari              | MLB   | LEAN    |  +0.47 | LOSS    |           -1.00u |
| 2026-06-15_MLB_mia_phi              | MLB   | LEAN    |  +0.30 | LOSS    |           -1.00u |
| 2026-06-15_MLB_sdp_stl              | MLB   | LEAN    |  +0.10 | WIN     |           +0.66u |
| 2026-06-15_MLB_kcr_wsh_spread       | MLB   | LOCK    |  +0.10 | WIN     |           +1.53u |
| 2026-06-15_MLB_mia_phi_total        | MLB   | PREMIUM |  +0.30 | LOSS    |           -1.00u |
| 2026-06-15_MLB_pit_oak_total        | MLB   | LOCK    |  +0.12 | LOSS    |           -1.00u |
| 2026-06-16_MLB_cle_mil_spread       | MLB   | PREMIUM |  +0.11 | WIN     |           +0.62u |
| 2026-06-16_MLB_sdp_stl_spread       | MLB   | LOCK    |  +0.19 | WIN     |           +1.68u |
| 2026-06-16_MLB_cle_mil_total        | MLB   | ELITE   |  +0.13 | WIN     |           +0.99u |
| 2026-06-16_MLB_kcr_wsh_total        | MLB   | PREMIUM |  +0.13 | WIN     |           +0.91u |
| 2026-06-16_MLB_tbr_lad_total        | MLB   | LOCK    |  +0.62 | LOSS    |           -1.00u |
| 2026-06-17_MLB_cws_nyy              | MLB   | ELITE   |  +0.30 | WIN     |           +0.58u |
| 2026-06-18_MLB_bal_sea              | MLB   | LOCK    |  +0.30 | WIN     |           +0.72u |
| 2026-06-18_MLB_laa_oak              | MLB   | PREMIUM |  +0.28 | WIN     |           +0.57u |
| 2026-06-18_MLB_stl_kcr_spread       | MLB   | PREMIUM |  +0.31 | LOSS    |           -1.00u |

## § 15 — Live Calibration Snapshot (V12 thresholds in use)

The live `agsCalibration/current` document — what the cron and UI both read at runtime to score & size every pick. **This is the actual thresholds V12 is using right now.**

- **Computed at:** 2026-06-18T16:16:17.458Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 1195
- **Date range:** 2026-04-18 → 2026-06-17

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.978 | ELITE           | 5.00u                  |
| q60      |        +0.944 | PREMIUM         | 3.00u                  |
| q40      |        +0.873 | LOCK            | 1.00u                  |
| q20      |        +0.728 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            130 |        35 |   16 |    5 |   74 |                     56 |
| NBA   |            211 |        58 |   25 |   23 |  105 |                    106 |
| NHL   |            105 |        23 |    6 |   16 |   60 |                     45 |
| SOC   |             98 |        11 |    2 |    5 |   80 |                     18 |

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~663 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 469 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 231 / 469 (49%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 231 / 469 (49%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 231 / 469 (49%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 231 / 469 (49%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 231 / 469 (49%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 231 / 469 (49%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 231 / 469 (49%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 469 / 469 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 469 / 469 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 469 / 469 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 469 / 469 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 469 / 469 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 469 / 469 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 465 / 469 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 464 / 469 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 469 / 469 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 469 / 469 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 272 / 469 (58%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 469 / 469 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 272 / 469 (58%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 272 / 469 (58%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 469 / 469 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 469 / 469 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 469 / 469 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 469 / 469 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 469 / 469 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd forCount          | 469 |      |    -0.107 |    -0.042 |      -0.105 |      -0.089 |  0.455 |
|    2 | wd contribFor        | 469 |      |    -0.111 |    -0.149 |      -0.104 |      -0.119 |  0.473 |
|    3 | provenFor            | 469 |      |    -0.097 |    -0.050 |      -0.102 |      -0.108 |  0.462 |
|    4 | V12 forCount         | 231 |  🟢  |    -0.080 |    +0.154 |      -0.095 |      +0.001 |  0.500 |
|    5 | provenTotal          | 469 |      |    -0.095 |    -0.022 |      -0.094 |      -0.077 |  0.465 |
|    6 | countMargin          | 231 |      |    -0.068 |    +0.057 |      -0.093 |      -0.062 |  0.470 |
|    7 | V12 agMean           | 231 |  🟢  |    -0.085 |    +0.306 |      -0.089 |      +0.069 |  0.490 |
|    8 | provenMargin         | 469 |      |    -0.060 |    -0.067 |      -0.071 |      -0.098 |  0.474 |
|    9 | qMargin              | 231 |  🟢  |    +0.071 |    -0.029 |      +0.071 |      +0.016 |  0.511 |
|   10 | wd contribMargin     | 469 |      |    -0.068 |    -0.213 |      -0.070 |      -0.148 |  0.465 |
|   11 | agsV12               | 231 |  🟢  |    +0.064 |    +0.009 |      +0.068 |      +0.064 |  0.517 |
|   12 | wd contribAg         | 469 |      |    -0.078 |    +0.115 |      -0.066 |      +0.058 |  0.482 |
|   13 | hcMargin             | 469 |      |    -0.038 |    +0.085 |      -0.061 |      -0.005 |  0.499 |
|   14 | wd maxShare          | 469 |      |    +0.066 |    +0.040 |      +0.061 |      +0.056 |  0.548 |
|   15 | provenAg             | 469 |      |    -0.064 |    +0.173 |      -0.057 |      +0.073 |  0.479 |
|   16 | wd forAvgSize        | 469 |      |    -0.030 |    -0.066 |      -0.053 |      -0.077 |  0.521 |
|   17 | V12 forMean          | 231 |  🟢  |    +0.049 |    -0.065 |      +0.048 |      -0.019 |  0.495 |
|   18 | wd sizeMargin        | 272 |      |    -0.007 |    -0.101 |      -0.038 |      -0.096 |  0.504 |
|   19 | ags (v11)            | 469 |      |    -0.012 |    -0.182 |      -0.036 |      -0.170 |  0.479 |
|   20 | wd agCount           | 272 |      |    -0.042 |    +0.262 |      -0.032 |      +0.119 |  0.504 |
|   21 | wd agAvgSize         | 272 |      |    -0.048 |    -0.033 |      -0.029 |      -0.031 |  0.482 |
|   22 | peakStars            | 469 |      |    -0.018 |    +0.101 |      -0.026 |      +0.009 |  0.481 |
|   23 | wd maxForContrib     | 469 |      |    -0.021 |    -0.110 |      -0.018 |      -0.061 |  0.510 |
|   24 | V12 agCount          | 231 |  🟢  |    -0.021 |    +0.129 |      -0.010 |      +0.086 |  0.514 |
|   25 | lockPinnProb         | 465 |      |    +0.108 |    +0.137 |      +0.004 |      -0.135 |  0.559 |
|   26 | clv                  | 464 |      |    +0.036 |    +0.031 |      +0.002 |      +0.049 |  0.539 |

> **Top 3 univariate features by PnL correlation:** `wd forCount` (r = -0.105), `wd contribFor` (r = -0.104), `provenFor` (r = -0.102).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd forCount` — r(unit-ret) = -0.105, AUC = 0.455. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd forCount` · r(unit-ret) = -0.105 · AUC = 0.455

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 167 | 95-72   |   56.9% |     +4.1% |
| MID (p33–p67)     | 2.000 … 2.000            | 146 | 83-63   |   56.8% |     +2.9% |
| HIGH (> p67)      | 4.000 … 4.000            | 156 | 75-81   |   48.1% |     -5.4% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd contribFor` · r(unit-ret) = -0.104 · AUC = 0.473

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 49.800 … 38.900          | 157 | 82-75   |   52.2% |     -0.2% |
| MID (p33–p67)     | 89.000 … 106.600         | 157 | 101-56  |   64.3% |     +8.6% |
| HIGH (> p67)      | 212.200 … 249.200        | 155 | 70-85   |   45.2% |     -7.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `provenFor` · r(unit-ret) = -0.102 · AUC = 0.462

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 189 | 105-84  |   55.6% |     +2.8% |
| MID (p33–p67)     | 2.000 … 2.000            | 140 | 84-56   |   60.0% |     +6.0% |
| HIGH (> p67)      | 10.000 … 4.000           | 140 | 64-76   |   45.7% |     -7.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forCount` · r(unit-ret) = -0.095 · AUC = 0.500

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 111 | 57-54   |   51.4% |     +0.2% |
| MID (p33–p67)     | 2.000 … 2.000            |  57 | 40-17   |   70.2% |    +14.3% |
| HIGH (> p67)      | 3.000 … 8.000            |  63 | 30-33   |   47.6% |     -9.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `provenTotal` · r(unit-ret) = -0.094 · AUC = 0.465

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 2.000 … 1.000            | 236 | 132-104 |   55.9% |     +2.4% |
| MID (p33–p67)     | 3.000 … 3.000            |  99 | 54-45   |   54.5% |     +0.6% |
| HIGH (> p67)      | 13.000 … 5.000           | 134 | 67-67   |   50.0% |     -3.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd forCount    | wd contribFor  | provenFor      | V12 forCount   | provenTotal    | countMargin    | V12 agMean     | provenMargin   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd forCount |  1.000         |         +0.922 |         +0.931 |         +0.981 |         +0.844 |         +0.639 |         +0.506 |         +0.650 |
| wd contribFor |         +0.922 |  1.000         |         +0.889 |         +0.908 |         +0.846 |         +0.509 |         +0.601 |         +0.549 |
| provenFor   |         +0.931 |         +0.889 |  1.000         |         +0.914 |         +0.913 |         +0.576 |         +0.526 |         +0.687 |
| V12 forCount |         +0.981 |         +0.908 |         +0.914 |  1.000         |         +0.830 |         +0.665 |         +0.505 |         +0.635 |
| provenTotal |         +0.844 |         +0.846 |         +0.913 |         +0.830 |  1.000         |         +0.290 |         +0.667 |         +0.331 |
| countMargin |         +0.639 |         +0.509 |         +0.576 |         +0.665 |         +0.290 |  1.000         |         -0.008 |         +0.816 |
| V12 agMean  |         +0.506 |         +0.601 |         +0.526 |         +0.505 |         +0.667 |         -0.008 |  1.000         |         +0.027 |
| provenMargin |         +0.650 |         +0.549 |         +0.687 |         +0.635 |         +0.331 |         +0.816 |         +0.027 |  1.000         |

> 🔴 **Strong collinearity detected:** `wd forCount` and `V12 forCount` have r = +0.981. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 231 picks · features = 8 (+ intercept) · multiple R² = **0.0201** · adjusted R² = **-0.0198** · residual sd = 0.969

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd forCount          |     |    +0.1863 |   0.3904 | +0.48        |        1 |
|    2 | countMargin          |     |    -0.1536 |   0.1394 | -1.10        |        2 |
|    3 | V12 forCount         |  🟢 |    -0.1082 |   0.3684 | -0.29        |        3 |
|    4 | V12 agMean           |  🟢 |    -0.0930 |   0.0955 | -0.97        |        4 |
|    5 | provenFor            |     |    +0.0752 |   0.0000 | —        |        5 |
|    6 | wd contribFor        |     |    -0.0613 |   0.1836 | -0.33        |        6 |
|    7 | provenTotal          |     |    -0.0527 |   0.0000 | —        |        7 |
|    8 | provenMargin         |     |    +0.0244 |   0.0000 | —        |        8 |
| —    | (intercept)          |     |    +0.0434 |   0.0638 |    +0.68 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forCount` (β = -0.108), `V12 agMean` (β = -0.093)
- V12 IGNORES: `wd forCount` (β = +0.186, t = +0.48), `countMargin` (β = -0.154, t = -1.10), `provenFor` (β = +0.075, t = —), `wd contribFor` (β = -0.061, t = -0.33), `provenTotal` (β = -0.053, t = —), `provenMargin` (β = +0.024, t = —)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.517 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.522 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap ≈ 0** — V12 is capturing essentially all the linear signal available in the panel. The remaining features are noise.

### 17G — Actionable recommendations

- Sample size is currently 469 live picks — statistically meaningful but tight. Treat single-feature recommendations as provisional until N ≥ 500. The rankings will firm up as the daily cron accumulates more graded picks.
- Adjusted R² of -0.0198 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*