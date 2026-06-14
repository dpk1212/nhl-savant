# AGS-Unified — V12 Performance Monitor

**Generated:** Sunday, June 14, 2026 at 10:43 AM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 14

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (14 days ago), V12 has evaluated **344** picks, shipped **205** for real money (59.6% ship rate), and muted the other **139**. On the shipped picks V12 has gone **112-93** (54.6% win), staked **425.50u**, and returned **+35.75u** at **+8.4% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             14 |
| Picks V12 has evaluated             |                            344 |
| Picks SHIPPED (units > 0)           |                            205 |
| Picks MUTED (score ≤ 0, FADE)       |                            139 |
| Ship rate                           |                          59.6% |
| Live W-L                            |                         112-93 |
| Live Win %                          |                          54.6% |
| Live PnL (units)                    |                         +35.75 |
| Live ROI                            |                          +8.4% |
| Avg PnL / day                       |                         +2.55u |
| Most recent action (2026-06-16)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **8.4% ROI** across 205 live picks (+35.75u real PnL).
- Mute rule is **saving money** — the 72 muted picks would have lost -6.94u at flat 1u (-9.6% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+2.55u/day** on average since launch.
- **NBA** is V12's strongest sport: 10 live, 3-7, 29.1% ROI, +2.33u.
- **SPREAD** is V12's strongest market: 17 live, 11-6, +33.0% ROI.

## § 2 — Model Version Comparison (V9 → V10 → V11 → V12)

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   14 |    205 |  72 | 112-93 |  54.6% |      8.4% |     +35.75 |    +0.17 | 0.541 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  145 |    +1.3pp |    +17.4pp |          +0.347 |   -0.007 |          — | 🟡 mixed |
| v12 − v10          | +  143 |    +6.2pp |    +27.2pp |          +0.488 |   +0.147 |          — | 🟢 better |
| v12 − v11          | +   94 |    -0.3pp |     +5.6pp |          +0.113 |   +0.097 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 191n 55.5% +8% | 10n 30.0% +29% | 4n 75.0% +15%  | 205n 54.6% +8% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 46n +7%       | 51n +18%      | 50n -18%      | 29n +23%      | 25n -16%      | 🟡 partial (0) |

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
| 2026-06-14 |        18 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +35.75 |
| 2026-06-15 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +35.75 |
| 2026-06-16 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +35.75 |

> **Bottom line.** 14 days live, 205 live picks shipped, **+35.75u total PnL** at **+8.4% ROI**, averaging **+2.55u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  46 | 27-19  |  58.7% |        +0.990 |    5.00u |            4.46u | -0.54u |      205.00 |     +15.13 |      7.4% |
| PREMIUM  |  3.00u |  51 | 32-19  |  62.7% |        +0.974 |    3.00u |            2.82u | -0.18u |      144.00 |     +25.31 |     17.6% |
| LOCK     |  1.00u |  50 | 21-29  |  42.0% |        +0.950 |    1.00u |            1.00u | +0.00u |       50.00 |      -9.23 |    -18.5% |
| LEAN     |  0.50u |  29 | 19-10  |  65.5% |        +0.874 |    0.50u |            0.50u | +0.00u |       14.50 |      +3.32 |     22.9% |
| WEAK     |  0.25u |  25 | 11-14  |  44.0% |        +0.390 |    0.25u |            0.25u | +0.00u |        6.25 |      -1.03 |    -16.5% |
| FADE     |  0.00u |  72 | 0-0    |      — |        -0.271 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### Sizing pipeline integrity

🟢 **No sizing drift detected.** Every shipped V12 pick's actual stake matches the ladder target (after odds-cap) within ±0.05u. The sizing pipeline is healthy.

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 114n · 55.3% · +10.0%  | 13n · 61.5% · +12.6%   | 64n · 54.7% · +4.7%    | 191n · 55.5% · +7.8%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 1n · 100.0% · +64.0%   | 1n · 100.0% · +215.0%  | 2n · 50.0% · -6.5%     | 4n · 75.0% · +14.8%    |
| **All** | **120n · 53.3% · +9.4%** | **17n · 64.7% · +33.0%** | **68n · 54.4% · +3.6%** | **205n · 54.6% · +8.4%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  | 156 |    156 | 86-70  |    55.1% |   52.3% |     +2.8pp |      8.2% |
| 0.7 – 0.9          |  23 |     23 | 15-8   |    65.2% |   55.5% |     +9.7pp |     15.8% |
| 0.5 – 0.7          |   5 |      5 | 3-2    |    60.0% |   56.2% |     +3.8pp |      8.8% |
| 0.25 – 0.5         |   9 |      9 | 4-5    |    44.4% |   54.7% |    -10.2pp |    -16.0% |
| (0, 0.25]          |   8 |      8 | 2-6    |    25.0% |   56.4% |    -31.4pp |    -49.0% |
| ≤ 0 (MUTED)        |  67 |      0 | 0-0    |    49.3% |   52.4% |     -3.1pp |         — |

> 🟡 **Strong-score band (> 0.9) edge is +2.8pp** — borderline. Larger sample needed before declaring V12's top tier as real alpha.

> 🟢 **Mute band (≤ 0) actually wins only 49.3%** — V12 correctly identifies these as losers. The mute rule is justified.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **72** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                   72 |
| Muted W-L                           |                34-38 |
| Muted Win %                         |                47.2% |
| Counterfactual PnL at flat 1u       |                -6.94 |
| Counterfactual ROI at flat 1u       |                -9.6% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-6.94u** at a flat 1u stake — a counterfactual ROI of **-9.6%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  268 |
| Spearman ρ (v11 vs V12 score)       |               -0.373 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.373. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 268 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +23.186 |                        2.1 |
| AGAINST |             +4.855 |                        1.2 |

### One-sided wallet support (high-variance picks)

- **19** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **0** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **9-7** (56.3% win) at **+11.8% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   1 |   1 |   2 |   3 |  10 |
| AGAINST |   0 |   0 |   1 |   2 |   6 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|
| 2026-06-13 | MLB   | ML     | Arizona Diamondbacks    |  -144 | +0.982 | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-06-13 | MLB   | ML     | Atlanta Braves          |  -102 | +0.962 | PREMIUM  | 3.00u | WIN     |      +2.94 |
| 2026-06-13 | MLB   | ML     | Chicago Cubs            |  -118 | +0.449 | WEAK     | 0.25u | WIN     |      +0.21 |
| 2026-06-13 | MLB   | ML     | Colorado Rockies        |  +140 | +0.964 | PREMIUM  | 2.50u | LOSS    |      -2.50 |
| 2026-06-13 | MLB   | ML     | Cleveland Guardians     |  +134 | +0.988 | ELITE    | 2.50u | WIN     |      +3.35 |
| 2026-06-13 | MLB   | ML     | Miami Marlins           |  +102 | +0.964 | PREMIUM  | 2.50u | LOSS    |      -2.50 |
| 2026-06-13 | MLB   | ML     | Milwaukee Brewers       |  -157 | +0.967 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-13 | MLB   | ML     | Washington Nationals    |  -115 | +0.994 | ELITE    | 5.00u | WIN     |      +4.35 |
| 2026-06-13 | MLB   | ML     | Boston Red Sox          |  -118 | +0.936 | LOCK     | 1.00u | WIN     |      +0.85 |
| 2026-06-13 | NBA   | ML     | Spurs                   |  -192 | +0.302 | WEAK     | 0.25u | LOSS    |      -0.25 |
| 2026-06-13 | MLB   | SPREAD | Arizona Diamondbacks    |  +123 | +0.931 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-13 | MLB   | SPREAD | Cleveland Guardians     |  -130 | +0.931 | LOCK     | 1.00u | WIN     |      +0.77 |
| 2026-06-13 | MLB   | SPREAD | Los Angeles Dodgers     |  -122 | +0.928 | LOCK     | 1.00u | WIN     |      +0.82 |
| 2026-06-13 | MLB   | SPREAD | Tampa Bay Rays          |  -106 | +0.939 | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-13 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.988 | ELITE    | 5.00u | WIN     |      +4.55 |
| 2026-06-13 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.961 | PREMIUM  | 3.00u | WIN     |      +2.73 |
| 2026-06-13 | MLB   | TOTAL  | Under 7.5               |  +101 | +0.918 | LOCK     | 1.00u | WIN     |      +1.01 |
| 2026-06-13 | MLB   | TOTAL  | Over 8.5                |  -105 | +0.871 | LEAN     | 0.50u | WIN     |      +0.48 |
| 2026-06-13 | MLB   | TOTAL  | Under 7.5               |  -110 | +0.986 | ELITE    | 5.00u | LOSS    |      -5.00 |
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

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.541 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.143 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.039 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.072 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.105 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  201 |    +0.5045 |    -0.4016 | 0.0115 |  +0.107 |   0.962 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  201 |    +0.2553 |    +0.3214 | 0.0111 |  +0.106 |   0.495 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  201 |    +0.4766 |    -0.2549 | 0.0016 |  +0.040 |   2.473 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 201 |          +0.061 |           -0.038 |                   +0.056 |                   -0.016 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 201 |          -0.118 |           +0.290 |                   -0.122 |                   +0.067 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 201 |          -0.125 |           +0.105 |                   -0.136 |                   -0.001 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 201 |          -0.055 |           +0.104 |                   -0.039 |                   +0.091 | count of contributing AGAINST-side wallets                     |
| provenFor         | 201 |          -0.117 |           +0.120 |                   -0.126 |                   +0.009 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 201 |          -0.076 |           +0.098 |                   -0.071 |                   +0.053 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 3.375          |  67 | 38-29   |   56.7% |    +10.7% |
| MID (p33–p67)     | 19.950 … 14.694        |  67 | 36-31   |   53.7% |     +1.0% |
| HIGH (> p67)      | 48.906 … 36.000        |  67 | 36-31   |   53.7% |     +0.5% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       201 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8846 | average score across live picks                                 |
| SD                |    0.2064 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.658 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +6.211 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.611 / +0.964 / +0.991 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  187 | 104-83 |   55.6% |     +7.4% |  0.517 |        -0.005 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
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
| 2026-06-13 |    7 |  121 | 66-55  |   54.5% |     +9.0% |  0.547 |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.553 avg in first half → 0.552 avg in second half · Δ = -0.000)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +8.4% | [-8.4%, +24.5%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.6% | [47.8%, 61.2%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.541 | [0.457, 0.627]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             19 | [-9, 45]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       205 |
| Unique wallets ever on a FOR side            |                                                        61 |
| Avg FOR-side wallets per pick                |                                                      2.11 |
| Top-5 wallets' share of all FOR appearances  |                                                     45.1% |
| Top-10 wallets' share of all FOR appearances |                                                     66.7% |
| Top-20 wallets' share of all FOR appearances |                                                     81.7% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   70 |    6 | 37-33  |   52.9% |     +1.5% |     +1.65 |     0.84× | CONFIRMED   |     +2.6% |     222 | 2026-06-13 |
|    2 | 1e8f33  | MLB        |   37 |    6 | 22-15  |   59.5% |    -10.1% |     -7.95 |     0.91× | CONFIRMED   |     +9.0% |      61 | 2026-06-13 |
|    3 | 70135d  | MLB,NBA    |   35 |   60 | 17-18  |   48.6% |     +0.5% |     +0.22 |     1.57× | CONFIRMED   |     -8.0% |     349 | 2026-06-13 |
|    4 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|    5 | 491f30  | MLB        |   23 |    1 | 15-8   |   65.2% |    +41.3% |    +31.01 |     0.92× | CONFIRMED   |    +13.0% |      31 | 2026-06-13 |
|    6 | 7923c4  | MLB,NBA    |   23 |    4 | 13-10  |   56.5% |    +42.7% |    +14.42 |     0.79× | CONFIRMED   |    +10.5% |      92 | 2026-06-13 |
|    7 | eeabaf  | MLB,NBA    |   20 |    1 | 9-11   |   45.0% |    -14.5% |     -8.35 |     0.82× | CONFIRMED   |    +14.0% |      68 | 2026-06-13 |
|    8 | cd2f63  | MLB,NBA    |   20 |   14 | 10-10  |   50.0% |    +28.3% |    +11.95 |     0.94× | FLAT        |     -0.2% |     223 | 2026-06-13 |
|    9 | 2f2a9e  | MLB        |   17 |   16 | 9-8    |   52.9% |     -4.4% |     -0.93 |     0.49× | CONFIRMED   |     -4.0% |      59 | 2026-06-13 |
|   10 | 10c684  | MLB,NBA    |   13 |    4 | 4-9    |   30.8% |    -31.6% |     -4.74 |     1.74× | FLAT        |    -26.6% |      31 | 2026-06-11 |
|   11 | 9a69c2  | MLB        |   11 |   36 | 5-6    |   45.5% |    +27.9% |     +3.28 |     2.51× | CONFIRMED   |    -21.1% |     129 | 2026-06-13 |
|   12 | bc3532  | MLB,NBA,NHL |    9 |   11 | 4-5    |   44.4% |    -18.9% |     -1.18 |     2.26× | CONFIRMED   |     +3.8% |     136 | 2026-06-13 |
|   13 | 8c1eae  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |    +53.8% |     +4.71 |     1.79× | FLAT        |     -8.0% |      96 | 2026-06-08 |
|   14 | 972768  | MLB        |    7 |    2 | 3-4    |   42.9% |    -62.3% |    -11.69 |     1.15× | CONFIRMED   | +Infinity% |      41 | 2026-06-12 |
|   15 | b19a27  | MLB,NBA    |    6 |    4 | 3-3    |   50.0% |    -15.9% |     -2.35 |     1.34× | CONFIRMED   |     -5.0% |     278 | 2026-06-07 |
|   16 | bc44b0  | MLB,NBA,NHL |    6 |    1 | 2-4    |   33.3% |    -87.1% |     -6.10 |     2.18× | FLAT        |    -18.5% |      15 | 2026-06-13 |
|   17 | 2e8da5  | NBA        |    5 |    0 | 1-4    |   20.0% |    -60.8% |     -0.76 |     3.06× | FLAT        |    +25.1% |      16 | 2026-06-13 |
|   18 | f2d227  | MLB,NBA    |    5 |    0 | 2-3    |   40.0% |    -76.3% |     -4.39 |     0.75× | CONFIRMED   |    -21.7% |      33 | 2026-06-10 |
|   19 | 5b1e50  | MLB,NBA    |    5 |   20 | 3-2    |   60.0% |    +12.0% |     +1.23 |     0.64× | CONFIRMED   |    -23.9% |      30 | 2026-06-13 |
|   20 | e05213  | MLB        |    4 |    2 | 4-0    |  100.0% |    +94.1% |    +10.12 |     1.35× | CONFIRMED   |    +69.6% |       9 | 2026-06-09 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 7923c4  | MLB,NBA    |   23 | 13-10  |   56.5% |     +42.7% |    +14.42 |     0.79× | 2026-06-13 |
|    2 | 491f30  | MLB        |   23 | 15-8   |   65.2% |     +41.3% |    +31.01 |     0.92× | 2026-06-13 |
|    3 | cd2f63  | MLB,NBA    |   20 | 10-10  |   50.0% |     +28.3% |    +11.95 |     0.94× | 2026-06-13 |
|    4 | 9a69c2  | MLB        |   11 | 5-6    |   45.5% |     +27.9% |     +3.28 |     2.51× | 2026-06-13 |
|    5 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    6 | 4c64aa  | MLB        |   70 | 37-33  |   52.9% |      +1.5% |     +1.65 |     0.84× | 2026-06-13 |
|    7 | 70135d  | MLB,NBA    |   35 | 17-18  |   48.6% |      +0.5% |     +0.22 |     1.57× | 2026-06-13 |
|    8 | 2f2a9e  | MLB        |   17 | 9-8    |   52.9% |      -4.4% |     -0.93 |     0.49× | 2026-06-13 |
|    9 | 1e8f33  | MLB        |   37 | 22-15  |   59.5% |     -10.1% |     -7.95 |     0.91× | 2026-06-13 |
|   10 | eeabaf  | MLB,NBA    |   20 | 9-11   |   45.0% |     -14.5% |     -8.35 |     0.82× | 2026-06-13 |
|   11 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |
|    2 | eeabaf  | MLB,NBA    |   20 | 9-11   |   45.0% |     -14.5% |     -8.35 |     0.82× | 2026-06-13 |
|    3 | 1e8f33  | MLB        |   37 | 22-15  |   59.5% |     -10.1% |     -7.95 |     0.91× | 2026-06-13 |
|    4 | 2f2a9e  | MLB        |   17 | 9-8    |   52.9% |      -4.4% |     -0.93 |     0.49× | 2026-06-13 |
|    5 | 70135d  | MLB,NBA    |   35 | 17-18  |   48.6% |      +0.5% |     +0.22 |     1.57× | 2026-06-13 |
|    6 | 4c64aa  | MLB        |   70 | 37-33  |   52.9% |      +1.5% |     +1.65 |     0.84× | 2026-06-13 |
|    7 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    8 | 9a69c2  | MLB        |   11 | 5-6    |   45.5% |     +27.9% |     +3.28 |     2.51× | 2026-06-13 |
|    9 | cd2f63  | MLB,NBA    |   20 | 10-10  |   50.0% |     +28.3% |    +11.95 |     0.94× | 2026-06-13 |
|   10 | 491f30  | MLB        |   23 | 15-8   |   65.2% |     +41.3% |    +31.01 |     0.92× | 2026-06-13 |
|   11 | 7923c4  | MLB,NBA    |   23 | 13-10  |   56.5% |     +42.7% |    +14.42 |     0.79× | 2026-06-13 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `10c684` (FOR# 13, ROI -31.6%), `eeabaf` (FOR# 20, ROI -14.5%), `1e8f33` (FOR# 37, ROI -10.1%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   141 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     7 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     6 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   116 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

- **Computed at:** 2026-06-13T14:53:33.425Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 1031
- **Date range:** 2026-04-18 → 2026-06-12

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.981 | ELITE           | 5.00u                  |
| q60      |        +0.948 | PREMIUM         | 3.00u                  |
| q40      |        +0.883 | LOCK            | 1.00u                  |
| q20      |        +0.744 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            126 |        33 |   14 |    6 |   73 |                     53 |
| NBA   |            211 |        58 |   25 |   23 |  105 |                    106 |
| NHL   |            105 |        22 |    8 |   12 |   63 |                     42 |
| SOC   |             37 |         3 |    0 |    0 |   34 |                      3 |

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~559 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 439 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 201 / 439 (46%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 201 / 439 (46%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 201 / 439 (46%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 201 / 439 (46%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 201 / 439 (46%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 201 / 439 (46%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 201 / 439 (46%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 439 / 439 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 439 / 439 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 439 / 439 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 439 / 439 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 439 / 439 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 439 / 439 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 435 / 439 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 434 / 439 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 439 / 439 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 439 / 439 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 254 / 439 (58%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 439 / 439 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 254 / 439 (58%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 254 / 439 (58%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 439 / 439 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 439 / 439 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 439 / 439 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 439 / 439 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 439 / 439 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | V12 forCount         | 201 |  🟢  |    -0.125 |    +0.105 |      -0.136 |      -0.001 |  0.480 |
|    2 | wd forCount          | 439 |      |    -0.135 |    -0.080 |      -0.130 |      -0.099 |  0.442 |
|    3 | provenFor            | 439 |      |    -0.123 |    -0.087 |      -0.124 |      -0.118 |  0.441 |
|    4 | V12 agMean           | 201 |  🟢  |    -0.118 |    +0.290 |      -0.122 |      +0.067 |  0.480 |
|    5 | wd contribFor        | 439 |      |    -0.126 |    -0.179 |      -0.117 |      -0.127 |  0.464 |
|    6 | provenTotal          | 439 |      |    -0.118 |    -0.048 |      -0.115 |      -0.082 |  0.443 |
|    7 | countMargin          | 201 |      |    -0.089 |    +0.006 |      -0.115 |      -0.080 |  0.464 |
|    8 | agsV12               | 201 |  🟢  |    +0.106 |    +0.039 |      +0.107 |      +0.072 |  0.541 |
|    9 | provenMargin         | 439 |      |    -0.078 |    -0.112 |      -0.086 |      -0.112 |  0.461 |
|   10 | qMargin              | 201 |  🟢  |    +0.090 |    +0.003 |      +0.086 |      +0.021 |  0.530 |
|   11 | wd contribAg         | 439 |      |    -0.093 |    +0.109 |      -0.080 |      +0.059 |  0.473 |
|   12 | wd maxShare          | 439 |      |    +0.085 |    +0.066 |      +0.076 |      +0.059 |  0.562 |
|   13 | wd contribMargin     | 439 |      |    -0.074 |    -0.234 |      -0.074 |      -0.156 |  0.462 |
|   14 | hcMargin             | 439 |      |    -0.053 |    +0.059 |      -0.074 |      -0.015 |  0.493 |
|   15 | provenAg             | 439 |      |    -0.078 |    +0.172 |      -0.070 |      +0.076 |  0.468 |
|   16 | V12 forMean          | 201 |  🟢  |    +0.061 |    -0.038 |      +0.056 |      -0.016 |  0.510 |
|   17 | wd forAvgSize        | 439 |      |    -0.030 |    -0.091 |      -0.054 |      -0.094 |  0.514 |
|   18 | wd agAvgSize         | 254 |      |    -0.073 |    -0.035 |      -0.049 |      -0.031 |  0.471 |
|   19 | wd agCount           | 254 |      |    -0.060 |    +0.251 |      -0.049 |      +0.119 |  0.498 |
|   20 | ags (v11)            | 439 |      |    -0.017 |    -0.228 |      -0.041 |      -0.191 |  0.473 |
|   21 | V12 agCount          | 201 |  🟢  |    -0.055 |    +0.104 |      -0.039 |      +0.091 |  0.492 |
|   22 | wd sizeMargin        | 254 |      |    +0.005 |    -0.112 |      -0.030 |      -0.105 |  0.508 |
|   23 | wd maxForContrib     | 439 |      |    -0.025 |    -0.107 |      -0.022 |      -0.061 |  0.508 |
|   24 | peakStars            | 439 |      |    -0.003 |    +0.107 |      -0.013 |      +0.004 |  0.489 |
|   25 | lockPinnProb         | 435 |      |    +0.114 |    +0.121 |      +0.009 |      -0.140 |  0.559 |
|   26 | clv                  | 434 |      |    +0.036 |    +0.037 |      +0.001 |      +0.059 |  0.540 |

> **Top 3 univariate features by PnL correlation:** `V12 forCount` (r = -0.136), `wd forCount` (r = -0.130), `provenFor` (r = -0.124).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd forCount` — r(unit-ret) = -0.130, AUC = 0.442. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `V12 forCount` · r(unit-ret) = -0.136 · AUC = 0.480

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 100 | 52-48   |   52.0% |     +0.8% |
| MID (p33–p67)     | 2.000 … 2.000            |  50 | 36-14   |   72.0% |    +16.3% |
| HIGH (> p67)      | 3.000 … 12.000           |  51 | 22-29   |   43.1% |    -16.5% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd forCount` · r(unit-ret) = -0.130 · AUC = 0.442

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 157 | 90-67   |   57.3% |     +4.7% |
| MID (p33–p67)     | 2.000 … 2.000            | 139 | 80-59   |   57.6% |     +3.6% |
| HIGH (> p67)      | 4.000 … 12.000           | 143 | 66-77   |   46.2% |     -7.0% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `provenFor` · r(unit-ret) = -0.124 · AUC = 0.441

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 175 | 99-76   |   56.6% |     +4.0% |
| MID (p33–p67)     | 2.000 … 2.000            | 134 | 82-52   |   61.2% |     +7.3% |
| HIGH (> p67)      | 10.000 … 12.000          | 130 | 55-75   |   42.3% |    -10.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 agMean` · r(unit-ret) = -0.122 · AUC = 0.480

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.000 … 0.000            | 169 | 95-74   |   56.2% |     +3.2% |
| MID (p33–p67)     | —                        |   0 | 0-0     |       — |         — |
| HIGH (> p67)      | 2.350 … 29.647           |  32 | 15-17   |   46.9% |    -32.3% |

#### `wd contribFor` · r(unit-ret) = -0.117 · AUC = 0.464

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 49.800 … 37.500          | 147 | 77-70   |   52.4% |     -0.1% |
| MID (p33–p67)     | 89.000 … 69.100          | 146 | 95-51   |   65.1% |     +9.3% |
| HIGH (> p67)      | 212.200 … 617.900        | 146 | 64-82   |   43.8% |     -8.5% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | V12 forCount   | wd forCount    | provenFor      | V12 agMean     | wd contribFor  | provenTotal    | countMargin    | agsV12         |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| V12 forCount |  1.000         |         +0.991 |         +0.930 |         +0.570 |         +0.918 |         +0.847 |         +0.651 |         -0.463 |
| wd forCount |         +0.991 |  1.000         |         +0.941 |         +0.585 |         +0.933 |         +0.860 |         +0.634 |         -0.472 |
| provenFor   |         +0.930 |         +0.941 |  1.000         |         +0.584 |         +0.891 |         +0.916 |         +0.591 |         -0.460 |
| V12 agMean  |         +0.570 |         +0.585 |         +0.584 |  1.000         |         +0.660 |         +0.706 |         +0.029 |         -0.785 |
| wd contribFor |         +0.918 |         +0.933 |         +0.891 |         +0.660 |  1.000         |         +0.849 |         +0.511 |         -0.474 |
| provenTotal |         +0.847 |         +0.860 |         +0.916 |         +0.706 |         +0.849 |  1.000         |         +0.295 |         -0.552 |
| countMargin |         +0.651 |         +0.634 |         +0.591 |         +0.029 |         +0.511 |         +0.295 |  1.000         |         -0.033 |
| agsV12      |         -0.463 |         -0.472 |         -0.460 |         -0.785 |         -0.474 |         -0.552 |         -0.033 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forCount` and `wd forCount` have r = +0.991. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 201 picks · features = 8 (+ intercept) · multiple R² = **0.0302** · adjusted R² = **-0.0155** · residual sd = 0.974

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | countMargin          |     |    -0.1625 |   0.1570 | -1.04        |        1 |
|    2 | provenFor            |     |    +0.1415 |   0.3349 | +0.42        |        2 |
|    3 | provenTotal          |     |    -0.1296 |   0.2922 | -0.44        |        3 |
|    4 | V12 agMean           |  🟢 |    -0.1263 |   0.1470 | -0.86        |        4 |
|    5 | wd contribFor        |     |    +0.1047 |   0.2182 | +0.48        |        5 |
|    6 | V12 forCount         |  🟢 |    -0.0478 |   0.5316 | -0.09        |        6 |
|    7 | wd forCount          |     |    -0.0195 |   0.5975 | -0.03        |        7 |
|    8 | agsV12               |  🟢 |    +0.0114 |   0.1158 | +0.10        |        8 |
| —    | (intercept)          |     |    +0.0446 |   0.0687 |    +0.65 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **3 / 8** top multivariate features are inputs to V12 (38%).
- V12 consumes: `V12 agMean` (β = -0.126), `V12 forCount` (β = -0.048), `agsV12` (β = +0.011)
- V12 IGNORES: `countMargin` (β = -0.163, t = -1.04), `provenFor` (β = +0.142, t = +0.42), `provenTotal` (β = -0.130, t = -0.44), `wd contribFor` (β = +0.105, t = +0.48), `wd forCount` (β = -0.019, t = -0.03)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.541 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.553 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap ≈ 0** — V12 is capturing essentially all the linear signal available in the panel. The remaining features are noise.

### 17G — Actionable recommendations

- Sample size is currently 439 live picks — statistically meaningful but tight. Treat single-feature recommendations as provisional until N ≥ 500. The rankings will firm up as the daily cron accumulates more graded picks.
- Adjusted R² of -0.0155 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*