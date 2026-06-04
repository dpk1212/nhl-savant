# AGS-Unified — V12 Performance Monitor

**Generated:** Thursday, June 4, 2026 at 5:37 PM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 4

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (4 days ago), V12 has evaluated **91** picks, shipped **42** for real money (46.2% ship rate), and muted the other **49**. On the shipped picks V12 has gone **22-20** (52.4% win), staked **78.75u**, and returned **+6.63u** at **+8.4% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                              4 |
| Picks V12 has evaluated             |                             91 |
| Picks SHIPPED (units > 0)           |                             42 |
| Picks MUTED (score ≤ 0, FADE)       |                             49 |
| Ship rate                           |                          46.2% |
| Live W-L                            |                          22-20 |
| Live Win %                          |                          52.4% |
| Live PnL (units)                    |                          +6.63 |
| Live ROI                            |                          +8.4% |
| Avg PnL / day                       |                         +1.66u |
| Most recent action (2026-06-05)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **8.4% ROI** across 42 live picks (+6.63u real PnL).
- Mute rule is **saving money** — the 22 muted picks would have lost -2.52u at flat 1u (-11.5% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.66u/day** on average since launch.
- **ML** is V12's strongest market: 25 live, 14-11, +22.5% ROI.

## § 2 — Model Version Comparison (V9 → V10 → V11 → V12)

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |    4 |     42 |  22 | 22-20  |  52.4% |      8.4% |      +6.63 |    +0.16 | 0.540 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           |   -18 |    -1.0pp |    +17.4pp |          +0.331 |   -0.008 |          — | 🟡 mixed |
| v12 − v10          |   -20 |    +4.0pp |    +27.2pp |          +0.471 |   +0.146 |          — | 🟢 better |
| v12 − v11          |   -69 |    -2.6pp |     +5.6pp |          +0.097 |   +0.096 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 39n 51.3% +3%  | 2n 50.0% -2%   | 1n 100.0% +87% | 42n 52.4% +8% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 7n +6%        | 12n +16%      | 11n -9%       | 7n +36%       | 4n -51%       | 🟡 partial (0) |

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
| 2026-06-04 |        19 |    5 |     3 | 3-2        |  60.0% |      6.50 |      +1.72 |     26.5% |      +6.63 |
| 2026-06-05 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |      +6.63 |

> **Trajectory.** 🟡 Last 3 days (5.9% ROI) is **-5.4pp worse** than the prior window (11.4%). Watch for further regression.

> **Bottom line.** 4 days live, 42 live picks shipped, **+6.63u total PnL** at **+8.4% ROI**, averaging **+1.66u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |   7 | 4-3    |  57.1% |        +0.987 |    5.00u |            4.29u | -0.71u |       30.00 |      +1.86 |      6.2% |
| PREMIUM  |  3.00u |  12 | 7-5    |  58.3% |        +0.975 |    3.00u |            2.75u | -0.25u |       33.00 |      +5.20 |     15.8% |
| LOCK     |  1.00u |  11 | 5-6    |  45.5% |        +0.959 |    1.00u |            1.00u | +0.00u |       11.00 |      -0.94 |     -8.5% |
| LEAN     |  0.50u |   7 | 5-2    |  71.4% |        +0.890 |    0.50u |            0.50u | +0.00u |        3.50 |      +1.27 |     36.3% |
| WEAK     |  0.25u |   4 | 1-3    |  25.0% |        +0.305 |    0.25u |            0.25u | +0.00u |        1.00 |      -0.51 |    -51.0% |
| FADE     |  0.00u |  22 | 0-0    |      — |        -0.208 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### Sizing pipeline integrity

🟢 **No sizing drift detected.** Every shipped V12 pick's actual stake matches the ladder target (after odds-cap) within ±0.05u. The sizing pipeline is healthy.

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 24n · 58.3% · +23.4%   | 1n · 100.0% · +83.0%   | 14n · 35.7% · -17.0%   | 39n · 51.3% · +3.1%    |
| NBA   | 1n · 0.0% · -100.0%    | 1n · 100.0% · +96.0%   | —                      | 2n · 50.0% · -2.0%     |
| NHL   | —                      | —                      | 1n · 100.0% · +87.0%   | 1n · 100.0% · +87.0%   |
| **All** | **25n · 56.0% · +22.5%** | **2n · 100.0% · +85.6%** | **15n · 40.0% · -4.9%** | **42n · 52.4% · +8.4%** |

> **V12's strongest sub-market:** MLB ML — 24 live, 14-10, +23.4% ROI, +7.95u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  |  34 |     34 | 19-15  |    55.9% |   51.8% |     +4.1pp |      9.5% |
| 0.7 – 0.9          |   3 |      3 | 2-1    |    66.7% |   58.9% |     +7.7pp |     11.3% |
| 0.25 – 0.5         |   2 |      2 | 1-1    |    50.0% |   58.7% |     -8.7pp |     -2.0% |
| (0, 0.25]          |   2 |      2 | 0-2    |     0.0% |   60.3% |    -60.3pp |   -100.0% |
| ≤ 0 (MUTED)        |  22 |      0 | 0-0    |    45.5% |   51.6% |     -6.1pp |         — |

> 🟢 **Strong-score band (> 0.9) wins 4.1pp more often than the market expects** — V12's high-confidence picks are real signal.

> 🟢 **Mute band (≤ 0) actually wins only 45.5%** — V12 correctly identifies these as losers. The mute rule is justified.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **22** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                   22 |
| Muted W-L                           |                10-12 |
| Muted Win %                         |                45.5% |
| Counterfactual PnL at flat 1u       |                -2.52 |
| Counterfactual ROI at flat 1u       |               -11.5% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-2.52u** at a flat 1u stake — a counterfactual ROI of **-11.5%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                   63 |
| Spearman ρ (v11 vs V12 score)       |               -0.452 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.452. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 63 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +14.895 |                        2.3 |
| AGAINST |             +3.647 |                        1.3 |

### One-sided wallet support (high-variance picks)

- **3** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **0** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **2-1** (66.7% win) at **+47.8% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   1 |   1 |   2 |   3 |  11 |
| AGAINST |   0 |   0 |   1 |   2 |   5 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|
| 2026-06-04 | MLB   | ML     | Baltimore Orioles       |  +104 | +0.923 | LEAN     | 0.50u | WIN     |      +0.52 |
| 2026-06-04 | MLB   | ML     | Philadelphia Phillies   |  -215 | +0.952 | LOCK     | 1.00u | WIN     |      +0.47 |
| 2026-06-04 | MLB   | ML     | Milwaukee Brewers       |  -188 | +0.969 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-04 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.962 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-04 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.974 | PREMIUM  | 3.00u | WIN     |      +2.73 |
| 2026-06-03 | MLB   | ML     | Boston Red Sox          |  -152 | +0.881 | LEAN     | 0.50u | WIN     |      +0.33 |
| 2026-06-03 | MLB   | ML     | Cleveland Guardians     |  +116 | +0.960 | LOCK     | 1.00u | WIN     |      +1.16 |
| 2026-06-03 | MLB   | ML     | Detroit Tigers          |  +125 | +0.959 | LOCK     | 1.00u | WIN     |      +1.25 |
| 2026-06-03 | MLB   | ML     | Arizona Diamondbacks    |  +180 | +0.975 | PREMIUM  | 1.50u | LOSS    |      -1.50 |
| 2026-06-03 | MLB   | ML     | Washington Nationals    |  -108 | +0.934 | LEAN     | 0.50u | LOSS    |      -0.50 |
| 2026-06-03 | MLB   | ML     | Athletics               |  +119 | +0.920 | LEAN     | 0.50u | WIN     |      +0.59 |
| 2026-06-03 | MLB   | ML     | Pittsburgh Pirates      |  -146 | +0.976 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-03 | MLB   | ML     | Philadelphia Phillies   |  -215 | +0.991 | ELITE    | 5.00u | WIN     |      +2.33 |
| 2026-06-03 | MLB   | ML     | St. Louis Cardinals     |  -112 | +0.978 | PREMIUM  | 3.00u | WIN     |      +2.68 |
| 2026-06-03 | MLB   | ML     | Atlanta Braves          |  -148 | +0.736 | LEAN     | 0.50u | WIN     |      +0.34 |
| 2026-06-03 | NBA   | ML     | Spurs                   |  -190 | +0.462 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-03 | MLB   | SPREAD | Los Angeles Dodgers     |  -120 | +0.961 | LOCK     | 1.00u | WIN     |      +0.83 |
| 2026-06-03 | NBA   | SPREAD | Knicks                  |  -105 | +0.391 | WEAK     | 0.25u | WIN     |      +0.24 |
| 2026-06-03 | MLB   | TOTAL  | Over 7.5                |  -102 | +0.968 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-03 | MLB   | TOTAL  | Over 8.5                |  -105 | +0.984 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-03 | MLB   | TOTAL  | Over 7.5                |  -110 | +0.227 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-03 | MLB   | TOTAL  | Under 8.5               |  +101 | +0.972 | PREMIUM  | 2.50u | WIN     |      +2.52 |
| 2026-06-03 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.983 | ELITE    | 5.00u | WIN     |      +4.55 |
| 2026-06-03 | MLB   | TOTAL  | Under 8.5               |  +100 | +0.972 | PREMIUM  | 2.50u | LOSS    |      -2.50 |
| 2026-06-02 | MLB   | ML     | New York Yankees        |  -219 | +0.139 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-02 | MLB   | ML     | Detroit Tigers          |  +125 | +0.990 | ELITE    | 2.50u | WIN     |      +3.13 |
| 2026-06-02 | MLB   | ML     | Miami Marlins           |  -102 | +0.939 | LEAN     | 0.50u | WIN     |      +0.49 |
| 2026-06-02 | MLB   | ML     | Houston Astros          |  -112 | +0.968 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-02 | MLB   | ML     | St. Louis Cardinals     |  -106 | +0.968 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-02 | MLB   | ML     | Toronto Blue Jays       |  +102 | +0.988 | ELITE    | 2.50u | LOSS    |      -2.50 |

## § 12 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    85 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     8 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     3 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    63 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

## § 13 — Live Calibration Snapshot (V12 thresholds in use)

The live `agsCalibration/current` document — what the cron and UI both read at runtime to score & size every pick. **This is the actual thresholds V12 is using right now.**

- **Computed at:** 2026-06-04T16:05:14.179Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 799
- **Date range:** 2026-04-18 → 2026-06-03

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.984 | ELITE           | 5.00u                  |
| q60      |        +0.970 | PREMIUM         | 3.00u                  |
| q40      |        +0.937 | LOCK            | 1.00u                  |
| q20      |        +0.737 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 14 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            119 |        28 |    9 |    8 |   74 |                     45 |
| NBA   |            194 |        50 |   23 |   22 |   99 |                     95 |
| NHL   |             96 |        20 |    6 |   13 |   57 |                     39 |

> ⚠ **MLB pool is < 50% of NBA pool** (45 vs 95). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*