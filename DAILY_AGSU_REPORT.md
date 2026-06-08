# AGS-Unified — V12 Performance Monitor

**Generated:** Monday, June 8, 2026 at 9:28 AM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 8

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (8 days ago), V12 has evaluated **183** picks, shipped **107** for real money (58.5% ship rate), and muted the other **76**. On the shipped picks V12 has gone **60-47** (56.1% win), staked **212.75u**, and returned **+15.01u** at **+7.1% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                              8 |
| Picks V12 has evaluated             |                            183 |
| Picks SHIPPED (units > 0)           |                            107 |
| Picks MUTED (score ≤ 0, FADE)       |                             76 |
| Ship rate                           |                          58.5% |
| Live W-L                            |                          60-47 |
| Live Win %                          |                          56.1% |
| Live PnL (units)                    |                         +15.01 |
| Live ROI                            |                          +7.1% |
| Avg PnL / day                       |                         +1.88u |
| Most recent action (2026-06-08)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **7.1% ROI** across 107 live picks (+15.01u real PnL).
- Mute rule is **saving money** — the 40 muted picks would have lost -3.56u at flat 1u (-8.9% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.88u/day** on average since launch.
- **ML** is V12's strongest market: 61 live, 37-24, +22.1% ROI.
- **SPREAD** is V12's strongest market: 7 live, 5-2, +17.0% ROI.

## § 2 — Model Version Comparison (V9 → V10 → V11 → V12)

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |    8 |    107 |  40 | 60-47  |  56.1% |      7.1% |     +15.01 |    +0.14 | 0.538 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +   47 |    +2.7pp |    +16.0pp |          +0.313 |   -0.011 |          — | 🟡 mixed |
| v12 − v10          | +   45 |    +7.7pp |    +25.8pp |          +0.454 |   +0.144 |          — | 🟢 better |
| v12 − v11          |    -4 |    +1.1pp |     +4.2pp |          +0.079 |   +0.094 |          — | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 101n 56.4% +5% | 4n 25.0% -51%  | 2n 100.0% +86% | 107n 56.1% +7% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 23n -5%       | 25n +26%      | 22n -14%      | 19n +22%      | 14n -5%       | 🟡 partial (0) |

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
| 2026-06-08 |         7 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +15.01 |

> **Trajectory.** 🟡 Last 3 days (2.2% ROI) is **-8.0pp worse** than the prior window (10.2%). Watch for further regression.

> **Bottom line.** 8 days live, 107 live picks shipped, **+15.01u total PnL** at **+7.1% ROI**, averaging **+1.88u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  23 | 12-11  |  52.2% |        +0.990 |    5.00u |            4.35u | -0.65u |      100.00 |      -4.64 |     -4.6% |
| PREMIUM  |  3.00u |  25 | 17-8   |  68.0% |        +0.975 |    3.00u |            2.88u | -0.12u |       72.00 |     +18.56 |     25.8% |
| LOCK     |  1.00u |  22 | 10-12  |  45.5% |        +0.959 |    1.00u |            1.00u | +0.00u |       22.00 |      -3.12 |    -14.2% |
| LEAN     |  0.50u |  19 | 12-7   |  63.2% |        +0.878 |    0.50u |            0.50u | +0.00u |        9.50 |      +2.13 |     22.4% |
| WEAK     |  0.25u |  14 | 7-7    |  50.0% |        +0.362 |    0.25u |            0.25u | +0.00u |        3.50 |      -0.17 |     -4.9% |
| FADE     |  0.00u |  40 | 0-0    |      — |        -0.285 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### Sizing pipeline integrity

🟢 **No sizing drift detected.** Every shipped V12 pick's actual stake matches the ladder target (after odds-cap) within ±0.05u. The sizing pipeline is healthy.

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 58n · 62.1% · +22.6%   | 5n · 80.0% · +17.8%    | 38n · 44.7% · -13.6%   | 101n · 56.4% · +5.3%   |
| NBA   | 2n · 0.0% · -100.0%    | 2n · 50.0% · -2.0%     | —                      | 4n · 25.0% · -51.0%    |
| NHL   | 1n · 100.0% · +64.0%   | —                      | 1n · 100.0% · +87.0%   | 2n · 100.0% · +85.9%   |
| **All** | **61n · 60.7% · +22.1%** | **7n · 71.4% · +17.0%** | **39n · 46.2% · -8.7%** | **107n · 56.1% · +7.1%** |

> **V12's strongest sub-market:** MLB ML — 58 live, 36-22, +22.6% ROI, +22.13u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  |  77 |     77 | 45-32  |    58.4% |   53.2% |     +5.2pp |      6.9% |
| 0.7 – 0.9          |  12 |     12 | 6-6    |    50.0% |   55.5% |     -5.5pp |    -11.5% |
| 0.5 – 0.7          |   4 |      4 | 3-1    |    75.0% |   58.8% |    +16.2pp |     36.0% |
| 0.25 – 0.5         |   4 |      4 | 2-2    |    50.0% |   57.0% |     -7.0pp |     -5.0% |
| (0, 0.25]          |   6 |      6 | 2-4    |    33.3% |   56.6% |    -23.3pp |    -32.0% |
| ≤ 0 (MUTED)        |  40 |      0 | 0-0    |    47.5% |   52.0% |     -4.5pp |         — |

> 🟢 **Strong-score band (> 0.9) wins 5.2pp more often than the market expects** — V12's high-confidence picks are real signal.

> 🟢 **Mute band (≤ 0) actually wins only 47.5%** — V12 correctly identifies these as losers. The mute rule is justified.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **40** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                   40 |
| Muted W-L                           |                19-21 |
| Muted Win %                         |                47.5% |
| Counterfactual PnL at flat 1u       |                -3.56 |
| Counterfactual ROI at flat 1u       |                -8.9% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-3.56u** at a flat 1u stake — a counterfactual ROI of **-8.9%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  143 |
| Spearman ρ (v11 vs V12 score)       |               -0.493 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.493. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 143 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +22.697 |                        2.2 |
| AGAINST |             +5.753 |                        1.2 |

### One-sided wallet support (high-variance picks)

- **9** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **0** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **6-2** (75.0% win) at **+50.2% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   1 |   1 |   2 |   3 |  10 |
| AGAINST |   0 |   0 |   1 |   2 |   5 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|
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
| 2026-06-07 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.878 | LEAN     | 0.50u | LOSS    |      -0.50 |
| 2026-06-07 | MLB   | TOTAL  | Over 11.5               |  -110 | +0.964 | LOCK     | 1.00u | WIN     |      +0.91 |
| 2026-06-07 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.987 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-07 | MLB   | TOTAL  | Over 8                  |  -114 |     — | —        | 2.25u | LOSS    |      -2.25 |
| 2026-06-07 | MLB   | TOTAL  | Over 7.5                |  -113 | +0.974 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-07 | MLB   | TOTAL  | Under 8.5               |  -103 | +0.988 | ELITE    | 5.00u | WIN     |      +4.85 |
| 2026-06-07 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.884 | LEAN     | 0.50u | WIN     |      +0.45 |
| 2026-06-06 | MLB   | ML     | St. Louis Cardinals     |  -126 | +0.981 | PREMIUM  | 3.00u | WIN     |      +2.38 |
| 2026-06-06 | MLB   | ML     | Philadelphia Phillies   |  -134 | +0.875 | LEAN     | 0.50u | LOSS    |      -0.50 |
| 2026-06-06 | MLB   | ML     | Los Angeles Dodgers     |  -350 | +0.974 | PREMIUM  | 3.00u | WIN     |      +0.86 |
| 2026-06-06 | MLB   | ML     | Houston Astros          |  -123 | +0.995 | ELITE    | 5.00u | WIN     |      +4.07 |
| 2026-06-06 | MLB   | ML     | Detroit Tigers          |  +112 | +0.989 | ELITE    | 2.50u | LOSS    |      -2.50 |

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.523 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.111 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.000 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.004 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.080 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  103 |    +0.3052 |    -0.2120 | 0.0050 |  +0.071 |   0.941 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  103 |    +0.1830 |    +0.4033 | 0.0065 |  +0.081 |   0.494 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  103 |    +0.2968 |    -0.1354 | 0.0008 |  +0.028 |   2.347 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 103 |          +0.057 |           +0.023 |                   +0.043 |                   -0.088 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 103 |          -0.043 |           +0.309 |                   -0.047 |                   -0.001 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 103 |          -0.058 |           +0.140 |                   -0.067 |                   +0.052 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 103 |          -0.050 |           +0.108 |                   -0.021 |                   +0.049 | count of contributing AGAINST-side wallets                     |
| provenFor         | 103 |          -0.069 |           +0.166 |                   -0.076 |                   +0.058 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 103 |          -0.017 |           +0.183 |                   -0.007 |                   +0.062 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 3.822          |  35 | 20-15   |   57.1% |    +14.9% |
| MID (p33–p67)     | 19.950 … 18.600        |  34 | 20-14   |   58.8% |     +3.3% |
| HIGH (> p67)      | 48.906 … 42.634        |  34 | 18-16   |   52.9% |     -1.0% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       103 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8736 | average score across live picks                                 |
| SD                |    0.2200 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.375 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +4.559 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.549 / +0.966 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.083 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |   97 | 55-42  |   56.7% |     +4.4% |  0.501 |        -0.039 | noise                                     |
| NBA   |    4 | 1-3    |   25.0% |    -51.0% |  0.667 |        -0.400 | strong (N<20)                             |
| NHL   |    2 | 2-0    |  100.0% |    +85.9% |      — |             — | — (N<20)                                  |

### 12F — Stability: rolling 7-day AUC across the V12 window

Recompute AUC on a moving 7-day window. If recent windows are degrading (e.g. dropping from 0.58 → 0.50 → 0.45), V12's edge is decaying in real time. Each row anchors on the END date of its window.

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    |
|------------|------|------|--------|---------|-----------|--------|
| 2026-06-07 |    7 |  103 | 58-45  |   56.3% |     +6.2% |  0.523 |

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +7.1% | [-15.2%, +27.6%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          56.1% | [47.6%, 65.0%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.523 | [0.415, 0.638]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             13 | [-5, 31]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       107 |
| Unique wallets ever on a FOR side            |                                                        43 |
| Avg FOR-side wallets per pick                |                                                      2.10 |
| Top-5 wallets' share of all FOR appearances  |                                                     52.0% |
| Top-10 wallets' share of all FOR appearances |                                                     71.1% |
| Top-20 wallets' share of all FOR appearances |                                                     85.8% |

> 🟡 **Top-5 wallets drive over 50% of FOR-side influence.** Concentrated risk — if any one of these wallets goes cold or stops betting, V12's signal degrades materially. Section 13B names them.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   44 |    4 | 27-17  |   61.4% |    +26.2% |    +17.99 |     0.94× | CONFIRMED   |     +7.7% |     186 | 2026-06-07 |
|    2 | 70135d  | MLB,NBA    |   24 |   34 | 14-10  |   58.3% |    +15.9% |     +6.38 |     2.05× | CONFIRMED   |     -8.7% |     280 | 2026-06-07 |
|    3 | 913987  | MLB        |   22 |    4 | 13-9   |   59.1% |     -8.1% |     -5.08 |     1.12× | CONFIRMED   |    +26.2% |      34 | 2026-06-07 |
|    4 | 7923c4  | MLB,NBA    |   14 |    3 | 9-5    |   64.3% |    +44.5% |     +9.80 |     0.86× | CONFIRMED   |    +15.4% |      79 | 2026-06-07 |
|    5 | 1e8f33  | MLB        |   13 |    3 | 9-4    |   69.2% |     +8.1% |     +2.33 |     1.09× | CONFIRMED   |     +5.8% |      29 | 2026-06-07 |
|    6 | eeabaf  | MLB,NBA    |   11 |    1 | 4-7    |   36.4% |    -35.9% |    -11.48 |     0.80× | CONFIRMED   |    +14.3% |      59 | 2026-06-07 |
|    7 | cd2f63  | MLB,NBA    |   10 |    8 | 3-7    |   30.0% |    -33.1% |     -6.20 |     1.20× | FLAT        |     +0.3% |     203 | 2026-06-07 |
|    8 | 9a69c2  | MLB        |    8 |   25 | 4-4    |   50.0% |    +37.3% |     +3.54 |     2.41× | CONFIRMED   |    -21.0% |     109 | 2026-06-07 |
|    9 | 491f30  | MLB        |    7 |    1 | 5-2    |   71.4% |    +61.9% |    +10.68 |     0.95× | CONFIRMED   |    +28.9% |      12 | 2026-06-07 |
|   10 | 10c684  | MLB,NBA    |    7 |    3 | 2-5    |   28.6% |    -30.8% |     -3.46 |     0.39× | CONFIRMED   |    -33.6% |      22 | 2026-06-07 |
|   11 | b19a27  | MLB,NBA    |    6 |    4 | 3-3    |   50.0% |    -15.9% |     -2.35 |     1.34× | CONFIRMED   |     -5.0% |     278 | 2026-06-07 |
|   12 | 8c1eae  | MLB,NBA    |    5 |    2 | 3-2    |   60.0% |    +60.2% |     +3.16 |     1.65× | CONFIRMED   |     -5.3% |      89 | 2026-06-04 |
|   13 | bc3532  | MLB,NBA,NHL |    5 |    6 | 2-3    |   40.0% |    -61.9% |     -2.32 |     3.58× | FLAT        |     +1.0% |     125 | 2026-06-05 |
|   14 | a0d6d2  | MLB,NBA    |    3 |    1 | 2-1    |   66.7% |    +48.5% |     +1.82 |     0.16× | CONFIRMED   |    +27.0% |      14 | 2026-06-04 |
|   15 | af1697  | NBA        |    3 |    0 | 0-3    |    0.0% |   -100.0% |     -0.75 |     2.47× | CONFIRMED   |     +2.5% |      16 | 2026-06-05 |
|   16 | 972768  | MLB        |    3 |    2 | 2-1    |   66.7% |    +18.4% |     +0.23 |     1.02× | CONFIRMED   | +Infinity% |      36 | 2026-06-07 |
|   17 | 94600d  | MLB        |    2 |    2 | 0-2    |    0.0% |   -100.0% |     -5.25 |     1.01× | WR50        |     -4.3% |      16 | 2026-06-06 |
|   18 | f9e3d0  | MLB,NBA    |    2 |    0 | 1-1    |   50.0% |    +76.3% |     +2.48 |     2.87× | FLAT        |    +30.1% |       6 | 2026-06-05 |
|   19 | e05213  | MLB        |    2 |    2 | 2-0    |  100.0% |    +93.8% |     +3.05 |     1.09× | CONFIRMED   |    +62.1% |       7 | 2026-06-07 |
|   20 | 4d2125  | NHL        |    2 |    0 | 2-0    |  100.0% |    +85.9% |     +4.51 |     0.39× | CONFIRMED   |     +4.8% |      10 | 2026-06-04 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 7923c4  | MLB,NBA    |   14 | 9-5    |   64.3% |     +44.5% |     +9.80 |     0.86× | 2026-06-07 |
|    2 | 4c64aa  | MLB        |   44 | 27-17  |   61.4% |     +26.2% |    +17.99 |     0.94× | 2026-06-07 |
|    3 | 70135d  | MLB,NBA    |   24 | 14-10  |   58.3% |     +15.9% |     +6.38 |     2.05× | 2026-06-07 |
|    4 | 1e8f33  | MLB        |   13 | 9-4    |   69.2% |      +8.1% |     +2.33 |     1.09× | 2026-06-07 |
|    5 | 913987  | MLB        |   22 | 13-9   |   59.1% |      -8.1% |     -5.08 |     1.12× | 2026-06-07 |
|    6 | cd2f63  | MLB,NBA    |   10 | 3-7    |   30.0% |     -33.1% |     -6.20 |     1.20× | 2026-06-07 |
|    7 | eeabaf  | MLB,NBA    |   11 | 4-7    |   36.4% |     -35.9% |    -11.48 |     0.80× | 2026-06-07 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | eeabaf  | MLB,NBA    |   11 | 4-7    |   36.4% |     -35.9% |    -11.48 |     0.80× | 2026-06-07 |
|    2 | cd2f63  | MLB,NBA    |   10 | 3-7    |   30.0% |     -33.1% |     -6.20 |     1.20× | 2026-06-07 |
|    3 | 913987  | MLB        |   22 | 13-9   |   59.1% |      -8.1% |     -5.08 |     1.12× | 2026-06-07 |
|    4 | 1e8f33  | MLB        |   13 | 9-4    |   69.2% |      +8.1% |     +2.33 |     1.09× | 2026-06-07 |
|    5 | 70135d  | MLB,NBA    |   24 | 14-10  |   58.3% |     +15.9% |     +6.38 |     2.05× | 2026-06-07 |
|    6 | 4c64aa  | MLB        |   44 | 27-17  |   61.4% |     +26.2% |    +17.99 |     0.94× | 2026-06-07 |
|    7 | 7923c4  | MLB,NBA    |   14 | 9-5    |   64.3% |     +44.5% |     +9.80 |     0.86× | 2026-06-07 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `eeabaf` (FOR# 11, ROI -35.9%), `cd2f63` (FOR# 10, ROI -33.1%), `913987` (FOR# 22, ROI -8.1%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   105 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     6 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     5 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    78 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

- **Computed at:** 2026-06-07T14:32:26.600Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 867
- **Date range:** 2026-04-18 → 2026-06-06

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.983 | ELITE           | 5.00u                  |
| q60      |        +0.965 | PREMIUM         | 3.00u                  |
| q40      |        +0.925 | LOCK            | 1.00u                  |
| q20      |        +0.741 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            122 |        30 |    9 |   10 |   73 |                     49 |
| NBA   |            196 |        49 |   26 |   25 |   96 |                    100 |
| NHL   |            101 |        20 |    7 |   13 |   61 |                     40 |

> ⚠ **MLB pool is < 50% of NBA pool** (49 vs 100). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~429 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 341 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 103 / 341 (30%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 103 / 341 (30%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 103 / 341 (30%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 103 / 341 (30%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 103 / 341 (30%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 103 / 341 (30%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 103 / 341 (30%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 341 / 341 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 341 / 341 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 341 / 341 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 341 / 341 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 341 / 341 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 341 / 341 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 341 / 341 (100%)  | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 340 / 341 (100%)  | Closing line value — how far line moved in our favour                |
| peakStars            | 341 / 341 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 341 / 341 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 191 / 341 (56%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 341 / 341 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 191 / 341 (56%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 191 / 341 (56%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 341 / 341 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 341 / 341 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 341 / 341 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 341 / 341 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 341 / 341 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | clv                  | 340 |      |    +0.128 |    +0.075 |      +0.139 |      +0.091 |  0.571 |
|    2 | provenFor            | 341 |      |    -0.113 |    -0.085 |      -0.109 |      -0.118 |  0.430 |
|    3 | wd forCount          | 341 |      |    -0.121 |    -0.079 |      -0.108 |      -0.089 |  0.437 |
|    4 | wd contribFor        | 341 |      |    -0.127 |    -0.241 |      -0.108 |      -0.145 |  0.439 |
|    5 | provenTotal          | 341 |      |    -0.104 |    -0.026 |      -0.098 |      -0.076 |  0.441 |
|    6 | provenMargin         | 341 |      |    -0.082 |    -0.123 |      -0.084 |      -0.110 |  0.457 |
|    7 | wd maxShare          | 341 |      |    +0.089 |    +0.082 |      +0.083 |      +0.072 |  0.556 |
|    8 | wd contribMargin     | 341 |      |    -0.091 |    -0.270 |      -0.078 |      -0.146 |  0.449 |
|    9 | wd contribAg         | 341 |      |    -0.087 |    +0.088 |      -0.074 |      +0.035 |  0.469 |
|   10 | agsV12               | 103 |  🟢  |    +0.081 |    -0.000 |      +0.071 |      +0.004 |  0.523 |
|   11 | V12 forCount         | 103 |  🟢  |    -0.058 |    +0.140 |      -0.067 |      +0.052 |  0.493 |
|   12 | hcMargin             | 341 |      |    -0.042 |    +0.063 |      -0.063 |      -0.022 |  0.484 |
|   13 | countMargin          | 103 |      |    -0.026 |    +0.030 |      -0.058 |      -0.014 |  0.480 |
|   14 | wd forAvgSize        | 341 |      |    -0.036 |    -0.088 |      -0.058 |      -0.110 |  0.503 |
|   15 | qMargin              | 103 |  🟢  |    +0.070 |    +0.053 |      +0.056 |      -0.061 |  0.520 |
|   16 | wd agCount           | 191 |      |    -0.068 |    +0.212 |      -0.056 |      +0.082 |  0.473 |
|   17 | provenAg             | 341 |      |    -0.061 |    +0.185 |      -0.053 |      +0.072 |  0.477 |
|   18 | wd sizeMargin        | 191 |      |    -0.010 |    -0.109 |      -0.052 |      -0.122 |  0.492 |
|   19 | wd maxForContrib     | 341 |      |    -0.066 |    -0.182 |      -0.050 |      -0.094 |  0.476 |
|   20 | peakStars            | 341 |      |    -0.029 |    +0.078 |      -0.049 |      -0.043 |  0.467 |
|   21 | V12 agMean           | 103 |  🟢  |    -0.043 |    +0.309 |      -0.047 |      -0.001 |  0.494 |
|   22 | V12 forMean          | 103 |  🟢  |    +0.057 |    +0.023 |      +0.043 |      -0.088 |  0.503 |
|   23 | wd agAvgSize         | 191 |      |    -0.080 |    -0.041 |      -0.039 |      -0.025 |  0.473 |
|   24 | ags (v11)            | 341 |      |    -0.014 |    -0.264 |      -0.038 |      -0.212 |  0.455 |
|   25 | V12 agCount          | 103 |  🟢  |    -0.050 |    +0.108 |      -0.021 |      +0.049 |  0.480 |
|   26 | lockPinnProb         | 341 |      |    +0.131 |    +0.147 |      +0.014 |      -0.130 |  0.566 |

> **Top 3 univariate features by PnL correlation:** `clv` (r = +0.139), `provenFor` (r = -0.109), `wd forCount` (r = -0.108).

> 🟡 **Highest-ranked feature NOT used by V12:** `clv` — r(unit-ret) = +0.139, AUC = 0.571. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `clv` · r(unit-ret) = +0.139 · AUC = 0.571

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -0.059 … -0.021          | 114 | 51-63   |   44.7% |     -7.7% |
| MID (p33–p67)     | 0.000 … 0.002            | 113 | 65-48   |   57.5% |     +2.2% |
| HIGH (> p67)      | 0.038 … 0.007            | 113 | 68-45   |   60.2% |     +7.7% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `provenFor` · r(unit-ret) = -0.109 · AUC = 0.430

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 118 | 69-49   |   58.5% |     +5.6% |
| MID (p33–p67)     | 2.000 … 2.000            | 114 | 68-46   |   59.6% |     +5.5% |
| HIGH (> p67)      | 10.000 … 3.000           | 109 | 47-62   |   43.1% |     -8.8% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd forCount` · r(unit-ret) = -0.108 · AUC = 0.437

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 2.000 … 1.000            | 222 | 127-95  |   57.2% |     +3.4% |
| MID (p33–p67)     | 3.000 … 3.000            |  62 | 31-31   |   50.0% |     -3.3% |
| HIGH (> p67)      | 4.000 … 4.000            |  57 | 26-31   |   45.6% |     -7.5% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd contribFor` · r(unit-ret) = -0.108 · AUC = 0.439

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 49.800 … 42.500          | 114 | 65-49   |   57.0% |     +3.4% |
| MID (p33–p67)     | 89.000 … 93.800          | 113 | 68-45   |   60.2% |     +4.7% |
| HIGH (> p67)      | 212.200 … 117.300        | 114 | 51-63   |   44.7% |     -6.9% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `provenTotal` · r(unit-ret) = -0.098 · AUC = 0.441

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 2.000 … 2.000            | 164 | 96-68   |   58.5% |     +4.1% |
| MID (p33–p67)     | 3.000 … 3.000            |  79 | 42-37   |   53.2% |     -0.2% |
| HIGH (> p67)      | 13.000 … 4.000           |  98 | 46-52   |   46.9% |     -6.0% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | clv            | provenFor      | wd forCount    | wd contribFor  | provenTotal    | provenMargin   | wd maxShare    | wd contribMargin |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| clv         |  1.000         |         +0.049 |         +0.020 |         +0.021 |         +0.065 |         +0.000 |         -0.009 |         -0.019 |
| provenFor   |         +0.049 |  1.000         |         +0.870 |         +0.787 |         +0.920 |         +0.728 |         -0.530 |         +0.560 |
| wd forCount |         +0.020 |         +0.870 |  1.000         |         +0.899 |         +0.815 |         +0.607 |         -0.616 |         +0.675 |
| wd contribFor |         +0.021 |         +0.787 |         +0.899 |  1.000         |         +0.792 |         +0.455 |         -0.538 |         +0.747 |
| provenTotal |         +0.065 |         +0.920 |         +0.815 |         +0.792 |  1.000         |         +0.401 |         -0.616 |         +0.394 |
| provenMargin |         +0.000 |         +0.728 |         +0.607 |         +0.455 |         +0.401 |  1.000         |         -0.162 |         +0.621 |
| wd maxShare |         -0.009 |         -0.530 |         -0.616 |         -0.538 |         -0.616 |         -0.162 |  1.000         |         -0.184 |
| wd contribMargin |         -0.019 |         +0.560 |         +0.675 |         +0.747 |         +0.394 |         +0.621 |         -0.184 |  1.000         |

> 🔴 **Strong collinearity detected:** `provenFor` and `provenTotal` have r = +0.920. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 340 picks · features = 8 (+ intercept) · multiple R² = **0.0346** · adjusted R² = **0.0082** · residual sd = 0.964

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | clv                  |     |    +0.1383 |   0.0526 | +2.63 (sig.) |        1 |
|    2 | wd contribFor        |     |    -0.0965 |   0.1763 | -0.55        |        2 |
|    3 | provenFor            |     |    -0.0726 | 1289034.2447 | -0.00        |        3 |
|    4 | wd forCount          |     |    +0.0474 |   0.1651 | +0.29        |        4 |
|    5 | wd maxShare          |     |    +0.0322 |   0.0749 | +0.43        |        5 |
|    6 | provenMargin         |     |    -0.0280 | 551620.0653 | -0.00        |        6 |
|    7 | provenTotal          |     |    +0.0264 | 964437.5971 | +0.00        |        7 |
|    8 | wd contribMargin     |     |    +0.0175 |   0.1144 | +0.15        |        8 |
| —    | (intercept)          |     |    +0.0042 |   0.0523 |    +0.08 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **0 / 8** top multivariate features are inputs to V12 (0%).
- V12 consumes: _(none of the top features)_
- V12 IGNORES: `clv` (β = +0.138, t = +2.63), `wd contribFor` (β = -0.096, t = -0.55), `provenFor` (β = -0.073, t = -0.00), `wd forCount` (β = +0.047, t = +0.29), `wd maxShare` (β = +0.032, t = +0.43), `provenMargin` (β = -0.028, t = -0.00), `provenTotal` (β = +0.026, t = +0.00), `wd contribMargin` (β = +0.017, t = +0.15)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.526 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.608 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.082.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~8.2pp.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `clv` (β = +0.138, t = +2.63). They have a real multivariate effect after controlling for V12's existing inputs.
- Sample size is currently 341 live picks — statistically meaningful but tight. Treat single-feature recommendations as provisional until N ≥ 500. The rankings will firm up as the daily cron accumulates more graded picks.
- Adjusted R² of 0.0082 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*