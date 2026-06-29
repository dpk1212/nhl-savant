# AGS-Unified — V12 Performance Monitor

**Generated:** Monday, June 29, 2026 at 5:22 AM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 29

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (29 days ago), V12 has evaluated **842** picks, shipped **297** for real money (35.3% ship rate), and muted the other **545**. On the shipped picks V12 has gone **163-134** (54.9% win), staked **721.25u**, and returned **+25.27u** at **+3.5% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             29 |
| Picks V12 has evaluated             |                            842 |
| Picks SHIPPED (units > 0)           |                            297 |
| Picks MUTED (score ≤ 0, FADE)       |                            545 |
| Ship rate                           |                          35.3% |
| Live W-L                            |                        163-134 |
| Live Win %                          |                          54.9% |
| Live PnL (units)                    |                         +25.27 |
| Live ROI                            |                          +3.5% |
| Avg PnL / day                       |                         +0.87u |
| Most recent action (2026-06-30)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **3.5% ROI** across 297 live picks (+25.27u real PnL).
- Mute rule is **saving money** — the 365 muted picks would have lost -52.71u at flat 1u (-14.4% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+0.87u/day** on average since launch.
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
| v12     | 06-01 → present      |   29 |    297 | 365 | 163-134 |  54.9% |      3.5% |     +25.27 |    +0.09 | 0.530 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  237 |    +1.5pp |    +12.5pp |          +0.258 |   -0.019 |          — | 🟡 mixed |
| v12 − v10          | +  235 |    +6.5pp |    +22.3pp |          +0.398 |   +0.136 |          — | 🟢 better |
| v12 − v11          | +  186 |    -0.1pp |     +0.7pp |          +0.024 |   +0.086 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | All           |
|---------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | 111n 55.0% +3% |
| v12     | 266n 54.1% +1% | 10n 30.0% +29% | 6n 83.3% +38%  | 15n 73.3% +18% | 297n 54.9% +4% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 67n +3%       | 88n +5%       | 64n +3%       | 38n +8%       | 35n -17%      | 🟡 partial (0) |

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
| 2026-06-14 |        32 |   13 |    15 | 6-7        |  46.2% |     30.25 |     -16.07 |    -53.1% |     +19.68 |
| 2026-06-15 |        29 |    2 |    17 | 2-0        | 100.0% |      6.00 |      +5.07 |     84.5% |     +24.75 |
| 2026-06-16 |        36 |    6 |    22 | 3-3        |  50.0% |     24.00 |      -0.85 |     -3.5% |     +23.90 |
| 2026-06-17 |        37 |    5 |    24 | 3-2        |  60.0% |     14.50 |      +1.96 |     13.5% |     +25.86 |
| 2026-06-18 |        21 |    4 |    11 | 3-1        |  75.0% |     12.50 |      +4.09 |     32.7% |     +29.95 |
| 2026-06-19 |        36 |    5 |    23 | 3-2        |  60.0% |     17.00 |      +2.00 |     11.8% |     +31.95 |
| 2026-06-20 |        20 |    4 |    15 | 3-1        |  75.0% |     13.00 |      +2.03 |     15.6% |     +33.98 |
| 2026-06-21 |        38 |    5 |    23 | 3-2        |  60.0% |     12.50 |      -1.30 |    -10.4% |     +32.68 |
| 2026-06-22 |        32 |    5 |    21 | 4-1        |  80.0% |     16.00 |      +8.60 |     53.8% |     +41.28 |
| 2026-06-23 |        36 |    3 |    29 | 0-3        |   0.0% |      8.50 |      -8.50 |   -100.0% |     +32.78 |
| 2026-06-24 |        46 |    6 |    26 | 3-3        |  50.0% |     22.00 |      +0.58 |      2.6% |     +33.36 |
| 2026-06-25 |        37 |    5 |    15 | 2-3        |  40.0% |     17.00 |      -4.83 |    -28.4% |     +28.53 |
| 2026-06-26 |        36 |    8 |    18 | 4-4        |  50.0% |     27.50 |      +0.37 |      1.3% |     +28.90 |
| 2026-06-27 |        35 |   12 |    16 | 7-5        |  58.3% |     45.00 |      +0.57 |      1.3% |     +29.47 |
| 2026-06-28 |        41 |    9 |    18 | 5-4        |  55.6% |     30.00 |      -4.20 |    -14.0% |     +25.27 |
| 2026-06-29 |         3 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +25.27 |
| 2026-06-30 |         3 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +25.27 |

> **Trajectory.** 🟡 Last 3 days (-14.0% ROI) is **-18.3pp worse** than the prior window (4.3%). Watch for further regression.

> **Bottom line.** 29 days live, 297 live picks shipped, **+25.27u total PnL** at **+3.5% ROI**, averaging **+0.87u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  99 | 39-28  |  58.2% |        +0.989 |    5.00u |            4.13u | -0.87u |      276.50 |      +7.30 |      2.6% |
| PREMIUM  |  3.00u | 150 | 50-38  |  56.8% |        +0.971 |    3.00u |            3.08u | +0.08u |      271.00 |     +14.10 |      5.2% |
| LOCK     |  1.00u |  99 | 30-34  |  46.9% |        +0.939 |    1.00u |            1.41u | +0.41u |       90.50 |      +2.47 |      2.7% |
| LEAN     |  0.50u |  68 | 24-14  |  63.2% |        +0.860 |    0.50u |            1.21u | +0.71u |       46.00 |      +3.75 |      8.2% |
| WEAK     |  0.25u |  73 | 17-18  |  48.6% |        +0.459 |    0.25u |            0.87u | +0.62u |       30.50 |      -5.17 |    -17.0% |
| FADE     |  0.00u | 167 | 0-0    |      — |        -0.175 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `-2` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### v12abc — By Stake Tier (HC margin + 2-for-0 rescue + proven-$ overlay)

Post-cutover picks size off the **HC margin** — SUPER (margin 2 · 6u), TOP (margin 1 · 4u), MINI (mini-HC 1.0–1.5× · 3u), CONFIRMED (margin 3+ · 1u) — **plus** the **RANK (2-for-0)** wallet-rescue path at **4u**. From **2026-06-26** the **v12abc proven-$ overlay** (internal stats: backer `positions.dollarRoi` + featured `picks.wr`) adds: **SHARP / SHARP-PRIME** ($-rescue of HC-muted picks at 3u / 4u when ≥2 sharps back it incl. a proven-money winner and mean win-rate ≥ 50 / 55), **TOP+** (HC-1 boosted 4u → 5u when a proven-$ backer is present), and **MINI-** (MINI cut 3u → 1u when no proven-$ backer is on it). Together these paths ARE the v12abc staked book. **MONITORING** (non-HC or WEAK-tier HC, no proven-$ rescue) is tracked at **0u** and excluded from the staked record/ROI below.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |   3 | 2-1    |  66.7% |       13.50 |      +7.12 |     52.7% |
| TOP PICK (TOP+/TOP)       |  4-5u |  20 | 14-6   |  70.0% |       78.50 |      +7.80 |      9.9% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP) |  3-4u |  23 | 13-10  |  56.5% |       85.50 |      +2.32 |      2.7% |
| STRONG (MINI)             |    3u |  28 | 13-15  |  46.4% |       83.00 |     -11.87 |    -14.3% |
| LEAN (CONFIRMED/MINI-)    |    1u |   4 | 2-2    |  50.0% |        4.00 |      -0.35 |     -8.8% |
| **STAKED TOTAL** |     — |  78 | 44-34  |  56.4% |      264.50 |      +5.02 |     +1.9% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| HC-2 (model max)      | SUPER       |    6u |   3 | 2-1    |  66.7% |       13.50 |      +7.12 |     52.7% |
| HC-1 + $-boost        | TOP+        |    5u |   4 | 2-2    |  50.0% |       17.50 |      -3.37 |    -19.3% |
| HC-1 (model)          | TOP         |    4u |  16 | 12-4   |  75.0% |       61.00 |     +11.17 |     18.3% |
| 2-for-0 rescue        | RANK        |    4u |  18 | 11-7   |  61.1% |       70.00 |      +5.07 |      7.2% |
| proven-$ prime        | SHARP-PRIME |    4u |   3 | 1-2    |  33.3% |        9.50 |      -2.25 |    -23.7% |
| proven-$ consensus    | SHARP       |    3u |   2 | 1-1    |  50.0% |        6.00 |      -0.50 |     -8.3% |
| mini-HC (gate-pass)   | MINI        |    3u |  28 | 13-15  |  46.4% |       83.00 |     -11.87 |    -14.3% |
| mini gate-cut         | MINI-       |    1u |   2 | 1-1    |  50.0% |        2.00 |      -0.04 |     -2.0% |
| margin 3+             | CONFIRMED   |    1u |   2 | 1-1    |  50.0% |        2.00 |      -0.31 |    -15.5% |

> **MONITORING volume:** 197 picks tracked at 0u (would-be 90-107, 45.7% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Sizing pipeline integrity

🚨 **256 picks deviate from the V12 ladder by > ±0.05u** even after accounting for the production odds-cap. Investigate `unitsFromAgsV12` in `syncPickStateAuthoritative.js`.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Expected (capped) | Actual | Drift  |
|------------|-------|--------|-------------------------|-------|-------|----------|-------------------|--------|--------|
| 2026-06-15 | MLB   | ML     | Chicago Cubs            |  -210 | +0.923 | LOCK     |             1.00u |  0.00u |  -1.00 |
| 2026-06-15 | MLB   | ML     | Los Angeles Angels      |  +122 | +0.868 | LEAN     |             0.50u |  0.00u |  -0.50 |
| 2026-06-15 | MLB   | ML     | Miami Marlins           |  +165 | +0.875 | LEAN     |             0.50u |  0.00u |  -0.50 |
| 2026-06-15 | MLB   | ML     | Texas Rangers           |  -150 | +0.765 | WEAK     |             0.25u |  0.00u |  -0.25 |
| 2026-06-15 | MLB   | ML     | Cincinnati Reds         |  -136 | +0.895 | LEAN     |             0.50u |  3.00u |  +2.50 |
| 2026-06-15 | MLB   | ML     | St. Louis Cardinals     |  -151 | +0.831 | LEAN     |             0.50u |  0.00u |  -0.50 |
| 2026-06-15 | MLB   | ML     | Los Angeles Dodgers     |  -186 | +0.512 | WEAK     |             0.25u |  0.00u |  -0.25 |
| 2026-06-15 | SOC   | ML     | IR Iran                 |  -120 | +0.682 | WEAK     |             0.25u |  0.00u |  -0.25 |
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
| _… and 231 more_ |

## § 5a — RANK-RESCUE Slice (2-for-0 wallet path · v12ab book)

> **What this is.** `v12ab` = the v12a book (HC-margin sizing) **plus** the RANK-RESCUE staking path that went live **2026-06-21**. The rule: a v12-shipped pick (score > 0) that the HC sizer mutes to 0u is staked at **4u** when its FOR side is **2-for-0** — ≥2 eligible whitelist wallets backing (CONFIRMED/FLAT/WR50 with ≥8 settled in-sport picks) and 0 against. It **only rescues muted picks**; it never up-sizes a pick the HC ladder already staked.

### (B) Reconstruction over the V12 era (2026-06-01 → today)

> Re-derived from frozen `walletDetails` + **current** wallet profiles. Eligibility uses today's settled-pick counts, so this is a **mildly optimistic projection** (a wallet at ≥8 picks now may have had fewer at pick time). Live-stamped numbers in (A) are the ground truth.

| Bucket | Picks | W-L | Win % | Stake | PnL | ROI | Per day |
|--------|------:|:---:|:-----:|------:|----:|----:|--------:|
| RANK-RESCUE (HC-muted → 4u) | 48 | 31-17 | 64.6% | 192u | +42.05u | +21.9% | 1.66 |

**2-for-0 picks the HC ladder ALREADY staked (NOT rescued — no hammer): 33** (20-13). These are left at their HC size — the slice adds no edge inside the HC book.

#### RANK-RESCUE by sport (reconstructed)

| Sport | Picks | W-L | Win % | PnL @4u | ROI |
|-------|------:|:---:|:-----:|------:|----:|
| MLB | 44 | 30-14 | 68.2% | +45.45u | +25.8% |
| NBA | 1 | 0-1 | 0.0% | -4.00u | -100.0% |
| NHL | 2 | 1-1 | 50.0% | +4.60u | +57.5% |
| SOC | 1 | 0-1 | 0.0% | -4.00u | -100.0% |

### (A) Live stamped RANK picks (ground truth — populates going forward)

| Picks | W-L | Win % | Stake | PnL | ROI |
|------:|:---:|:-----:|------:|----:|----:|
| 18 | 11-7 | 61.1% | 70u | +5.07u | +7.2% |

| Date | Sport | Matchup | Side | Odds | Result | PnL |
|------|-------|---------|------|-----:|:------:|----:|
| 2026-06-28 | MLB | New York Yankees@Boston Red Sox | Under 8 | -108 | LOSS | -4.00u |
| 2026-06-28 | MLB | Cincinnati Reds@Pittsburgh Pirates | Under 9.5 | 100 | LOSS | -4.00u |
| 2026-06-28 | MLB | Miami Marlins@St. Louis Cardinals | Miami Marlins | -190 | WIN | +2.11u |
| 2026-06-28 | MLB | Texas Rangers@Toronto Blue Jays | Texas Rangers | 110 | WIN | +4.40u |
| 2026-06-27 | MLB | Houston Astros@Detroit Tigers | Under 8.5 | -107 | LOSS | -4.00u |
| 2026-06-27 | MLB | Miami Marlins@St. Louis Cardinals | Miami Marlins | -175 | WIN | +2.29u |
| 2026-06-27 | MLB | Texas Rangers@Toronto Blue Jays | Toronto Blue Jays | -184 | LOSS | -4.00u |
| 2026-06-27 | MLB | Cincinnati Reds@Pittsburgh Pirates | Cincinnati Reds | -110 | WIN | +3.64u |
| 2026-06-26 | SOC | France@Norway | France | -250 | WIN | +1.60u |
| 2026-06-26 | SOC | Belgium@New Zealand | Belgium | -500 | WIN | +0.80u |
| 2026-06-26 | MLB | Atlanta Braves@San Francisco Giants | Atlanta Braves | -120 | WIN | +3.33u |
| 2026-06-25 | MLB | Houston Astros@Detroit Tigers | Under 9.5 | -110 | WIN | +3.64u |
| 2026-06-25 | MLB | New York Yankees@Boston Red Sox | New York Yankees | 114 | LOSS | -4.00u |
| 2026-06-25 | SOC | United States@Türkiye | United States | 105 | LOSS | -4.00u |
| 2026-06-24 | MLB | Seattle Mariners@Pittsburgh Pirates | Under 7.5 | -109 | LOSS | -4.00u |
| 2026-06-24 | MLB | Boston Red Sox@Colorado Rockies | Over 10.5 | -110 | WIN | +3.64u |
| 2026-06-24 | MLB | Boston Red Sox@Colorado Rockies | Colorado Rockies | 145 | WIN | +5.80u |
| 2026-06-20 | MLB | Milwaukee Brewers@Atlanta Braves | Under 7.5 | -110 | WIN | +1.82u |

### Incremental impact

> RANK-RESCUE sits **on top of the v12a HC book** — it stakes 4u on picks the HC ladder would mute (0u), so every rescue is net-new volume, never an up-size. Reconstruction: **+1.66 picks/day** (48 over 29 days) at **+21.9% ROI** / **+42.05u**, pulled from the muted pool — so no existing HC pick's size or grade changes. (The § 1 / § 4–5 headline book still reflects historical score-ladder sizing for picks shipped before v12a; only NEW picks size under v12a + RANK.)

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 150n · 54.7% · +4.3%   | 24n · 58.3% · -2.3%    | 92n · 52.2% · -1.9%    | 266n · 54.1% · +1.2%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 15n · 73.3% · +18.1%   | —                      | —                      | 15n · 73.3% · +18.1%   |
| **All** | **172n · 55.2% · +5.8%** | **28n · 60.7% · +8.0%** | **97n · 52.6% · -0.7%** | **297n · 54.9% · +3.5%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  | 358 |    229 | 125-104 |    51.4% |   52.4% |     -1.0pp |      3.5% |
| 0.7 – 0.9          |  68 |     32 | 21-11  |    51.5% |   52.2% |     -0.8pp |     13.5% |
| 0.5 – 0.7          |  26 |     10 | 5-5    |    46.2% |   55.2% |     -9.1pp |    -17.7% |
| 0.25 – 0.5         |  23 |     12 | 6-6    |    56.5% |   51.4% |     +5.2pp |    -17.6% |
| (0, 0.25]          |  14 |      9 | 3-6    |    42.9% |   57.0% |    -14.1pp |    -33.8% |
| ≤ 0 (MUTED)        | 151 |      0 | 0-0    |    45.7% |   53.8% |     -8.2pp |         — |

> 🟡 **Strong-score band (> 0.9) edge is +-1.0pp** — borderline. Larger sample needed before declaring V12's top tier as real alpha.

> 🟢 **Mute band (≤ 0) actually wins only 45.7%** — V12 correctly identifies these as losers. The mute rule is justified.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **365** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  365 |
| Muted W-L                           |              166-199 |
| Muted Win %                         |                45.5% |
| Counterfactual PnL at flat 1u       |               -52.71 |
| Counterfactual ROI at flat 1u       |               -14.4% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-52.71u** at a flat 1u stake — a counterfactual ROI of **-14.4%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  624 |
| Spearman ρ (v11 vs V12 score)       |               -0.193 |

> 🟢 **V12 is essentially independent of V11** — ρ = -0.193. The two models are picking fundamentally different bets. Whether V12 outperforms V11 in this window (see § 2) tells you whether the wallet-quality redesign is paying off.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 641 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +20.069 |                        2.1 |
| AGAINST |             +3.280 |                        1.2 |

### One-sided wallet support (high-variance picks)

- **39** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **1** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **15-11** (57.7% win) at **+1.2% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   0 |   1 |   1 |   3 |  11 |
| AGAINST |   0 |   0 |   1 |   2 |   7 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | Score    | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|----------|-------|---------|------------|
| 2026-06-28 | MLB   | ML     | Athletics               |  -108 | +0.980 | HC-1+$   | PREMIUM  | 5.00u | LOSS    |      -5.00 |
| 2026-06-28 | MLB   | ML     | Texas Rangers           |  +110 | +0.971 | 2-for-0  | LOCK     | 4.00u | WIN     |      +4.40 |
| 2026-06-28 | SOC   | ML     | Canada                  |  -145 | +0.989 | CONF     | ELITE    | 1.00u | WIN     |      +0.69 |
| 2026-06-28 | MLB   | SPREAD | San Diego Padres        |  -142 | +0.915 | MINI     | LEAN     | 3.00u | LOSS    |      -3.00 |
| 2026-06-28 | MLB   | SPREAD | Miami Marlins           |  -190 | +0.971 | 2-for-0  | LOCK     | 4.00u | WIN     |      +2.11 |
| 2026-06-28 | MLB   | TOTAL  | Under 7.5               |  -104 | +0.896 | MINI-    | LEAN     | 1.00u | WIN     |      +0.96 |
| 2026-06-28 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.968 | HC-1     | LOCK     | 4.00u | WIN     |      +3.64 |
| 2026-06-28 | MLB   | TOTAL  | Under 9.5               |  +100 | +0.977 | 2-for-0  | PREMIUM  | 4.00u | LOSS    |      -4.00 |
| 2026-06-28 | MLB   | TOTAL  | Under 8                 |  -108 | +0.976 | 2-for-0  | PREMIUM  | 4.00u | LOSS    |      -4.00 |
| 2026-06-27 | MLB   | ML     | Milwaukee Brewers       |  -150 | +0.528 | SHARP    | WEAK     | 3.00u | LOSS    |      -3.00 |
| 2026-06-27 | MLB   | ML     | Cincinnati Reds         |  -110 | +0.527 | 2-for-0  | WEAK     | 4.00u | WIN     |      +3.64 |
| 2026-06-27 | MLB   | ML     | Kansas City Royals      |  +114 | +0.985 | MINI-    | ELITE    | 1.00u | LOSS    |      -1.00 |
| 2026-06-27 | MLB   | ML     | Athletics               |  -104 | +0.927 | SHARP+   | LOCK     | 4.00u | LOSS    |      -4.00 |
| 2026-06-27 | MLB   | ML     | New York Mets           |  -123 | +0.905 | SHARP+   | LOCK     | 4.00u | WIN     |      +3.25 |
| 2026-06-27 | MLB   | ML     | Toronto Blue Jays       |  -184 | +0.969 | 2-for-0  | PREMIUM  | 4.00u | LOSS    |      -4.00 |
| 2026-06-27 | SOC   | ML     | Argentina               |  -525 | +0.996 | HC-1     | ELITE    | 4.00u | WIN     |      +0.76 |
| 2026-06-27 | SOC   | ML     | England                 |  -625 | +0.992 | HC-1+$   | ELITE    | 5.00u | WIN     |      +0.80 |
| 2026-06-27 | SOC   | ML     | Croatia                 |  -120 | +0.467 | SHARP    | WEAK     | 3.00u | WIN     |      +2.50 |
| 2026-06-27 | SOC   | ML     | DR Congo                |  -150 | +0.839 | HC-1+$   | LEAN     | 5.00u | WIN     |      +3.33 |
| 2026-06-27 | MLB   | SPREAD | Miami Marlins           |  -175 | +0.970 | 2-for-0  | PREMIUM  | 4.00u | WIN     |      +2.29 |
| 2026-06-27 | MLB   | TOTAL  | Under 8.5               |  -107 | +0.381 | 2-for-0  | WEAK     | 4.00u | LOSS    |      -4.00 |
| 2026-06-26 | MLB   | ML     | Atlanta Braves          |  -120 | +0.971 | 2-for-0  | PREMIUM  | 4.00u | WIN     |      +3.33 |
| 2026-06-26 | SOC   | ML     | Belgium                 |  -500 | +0.988 | 2-for-0  | ELITE    | 4.00u | WIN     |      +0.80 |
| 2026-06-26 | SOC   | ML     | Spain                   |  -145 | +0.811 | HC-2     | LEAN     | 6.00u | WIN     |      +4.14 |
| 2026-06-26 | SOC   | ML     | France                  |  -250 | +0.560 | 2-for-0  | WEAK     | 4.00u | WIN     |      +1.60 |
| 2026-06-26 | SOC   | ML     | Egypt                   |  +170 | +0.807 | HC-2     | LEAN     | 1.50u | LOSS    |      -1.50 |
| 2026-06-26 | SOC   | ML     | Cabo Verde              |  +175 | +0.694 | SHARP+   | WEAK     | 1.50u | LOSS    |      -1.50 |
| 2026-06-26 | MLB   | SPREAD | Philadelphia Phillies   |  +110 | +0.983 | HC-1+$   | PREMIUM  | 2.50u | LOSS    |      -2.50 |
| 2026-06-26 | MLB   | TOTAL  | Under 7.5               |  -110 | +0.997 | HC-1     | ELITE    | 4.00u | LOSS    |      -4.00 |
| 2026-06-25 | SOC   | ML     | Germany                 |  -155 | +0.939 | CONF     | LOCK     | 1.00u | LOSS    |      -1.00 |

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.528 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.091 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.027 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.045 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.066 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  292 |    +0.3259 |    -0.2711 | 0.0044 |  +0.066 |   0.943 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  292 |    +0.1721 |    +0.3947 | 0.0044 |  +0.066 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  292 |    +0.4334 |    -0.3092 | 0.0010 |  +0.031 |   2.651 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 292 |          +0.024 |           -0.006 |                   +0.006 |                   -0.025 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 292 |          -0.082 |           +0.309 |                   -0.086 |                   +0.045 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 292 |          +0.008 |           +0.233 |                   -0.028 |                   +0.013 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 292 |          -0.018 |           +0.111 |                   -0.018 |                   +0.053 | count of contributing AGAINST-side wallets                     |
| provenFor         | 292 |          -0.000 |           +0.253 |                   -0.037 |                   +0.019 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 292 |          -0.034 |           +0.117 |                   -0.036 |                   +0.026 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 4.289          | 100 | 54-46   |   54.0% |     +2.0% |
| MID (p33–p67)     | 19.950 … 20.349        |  96 | 54-42   |   56.3% |     +1.7% |
| HIGH (> p67)      | 48.906 … 43.115        |  96 | 52-44   |   54.2% |     -0.5% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       292 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8908 | average score across live picks                                 |
| SD                |    0.1918 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.733 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +6.852 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.670 / +0.964 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  262 | 142-120 |   54.2% |     +0.9% |  0.495 |        -0.033 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   14 | 10-4   |   71.4% |    +17.3% |  0.750 |        +0.200 | strong (N<20)                             |

### 12F — Stability: rolling 7-day AUC across the V12 window

Recompute AUC on a moving 7-day window. If recent windows are degrading (e.g. dropping from 0.58 → 0.50 → 0.45), V12's edge is decaying in real time. Each row anchors on the END date of its window.

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    |
|------------|------|------|--------|---------|-----------|--------|
| 2026-06-15 |    7 |  101 | 53-48  |   52.5% |     -0.1% |  0.476 |
| 2026-06-16 |    7 |   86 | 46-40  |   53.5% |     -7.6% |  0.417 |
| 2026-06-17 |    7 |   68 | 38-30  |   55.9% |     -2.0% |  0.446 |
| 2026-06-18 |    7 |   65 | 37-28  |   56.9% |     +1.3% |  0.441 |
| 2026-06-19 |    7 |   54 | 31-23  |   57.4% |     -1.3% |  0.388 |
| 2026-06-20 |    7 |   39 | 23-16  |   59.0% |     -1.5% |  0.351 |
| 2026-06-21 |    7 |   30 | 19-11  |   63.3% |    +12.6% |  0.440 |
| 2026-06-22 |    7 |   33 | 21-12  |   63.6% |    +14.7% |  0.484 |
| 2026-06-23 |    7 |   30 | 18-12  |   60.0% |     +8.9% |  0.514 |
| 2026-06-24 |    7 |   31 | 18-13  |   58.1% |     +6.9% |  0.560 |
| 2026-06-25 |    7 |   32 | 17-15  |   53.1% |     -1.9% |  0.655 |
| 2026-06-26 |    7 |   35 | 18-17  |   51.4% |     -3.1% |  0.621 |
| 2026-06-27 |    7 |   43 | 22-21  |   51.2% |     -3.4% |  0.597 |
| 2026-06-28 |    7 |   48 | 25-23  |   52.1% |     -4.5% |  0.576 |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.521 avg in first half → 0.512 avg in second half · Δ = -0.009)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +3.5% | [-9.0%, +15.7%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.9% | [49.3%, 60.6%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.528 | [0.462, 0.591]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             29 | [-4, 62]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       297 |
| Unique wallets ever on a FOR side            |                                                       104 |
| Avg FOR-side wallets per pick                |                                                      2.54 |
| Top-5 wallets' share of all FOR appearances  |                                                     38.6% |
| Top-10 wallets' share of all FOR appearances |                                                     57.7% |
| Top-20 wallets' share of all FOR appearances |                                                     72.5% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   83 |    8 | 45-38  |   54.2% |     +1.2% |     +1.83 |     0.87× | WR50        |     -0.5% |     280 | 2026-06-27 |
|    2 | 1e8f33  | MLB        |   76 |    6 | 42-34  |   55.3% |     -8.8% |    -16.76 |     0.98× | CONFIRMED   |     +1.3% |     160 | 2026-06-28 |
|    3 | 70135d  | MLB,NBA    |   50 |   66 | 28-22  |   56.0% |     +8.9% |     +7.79 |     1.39× | CONFIRMED   |     -3.3% |     426 | 2026-06-28 |
|    4 | 2f2a9e  | MLB,SOC    |   44 |   24 | 24-20  |   54.5% |     -0.6% |     -0.63 |     2.24× | CONFIRMED   | +Infinity% |     166 | 2026-06-28 |
|    5 | 5b1e50  | MLB,NBA,NHL,SOC |   38 |   42 | 23-15  |   60.5% |     +4.8% |     +5.75 |     1.45× | CONFIRMED   |     +5.2% |     196 | 2026-06-28 |
|    6 | eeabaf  | MLB,NBA,SOC |   34 |    3 | 18-16  |   52.9% |     -1.4% |     -1.39 |     1.12× | CONFIRMED   |    +20.9% |     115 | 2026-06-28 |
|    7 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|    8 | cd2f63  | MLB,NBA,SOC |   28 |   17 | 13-15  |   46.4% |    +10.1% |     +6.55 |     1.04× | CONFIRMED   |    +10.8% |     282 | 2026-06-25 |
|    9 | 7923c4  | MLB,NBA    |   27 |    7 | 16-11  |   59.3% |    +40.9% |    +20.15 |     0.78× | CONFIRMED   |    +10.6% |     134 | 2026-06-28 |
|   10 | 491f30  | MLB,SOC    |   25 |    3 | 17-8   |   68.0% |    +43.8% |    +35.89 |     0.95× | CONFIRMED   |     -0.1% |      53 | 2026-06-27 |
|   11 | 9a69c2  | MLB        |   17 |   39 | 9-8    |   52.9% |    +15.3% |     +3.83 |     2.70× | CONFIRMED   |    -18.6% |     154 | 2026-06-27 |
|   12 | bc44b0  | MLB,NBA,NHL,SOC |   16 |    8 | 9-7    |   56.3% |     +5.5% |     +2.29 |     1.47× | FLAT        |    +27.3% |      69 | 2026-06-28 |
|   13 | 10c684  | MLB,NBA    |   14 |    4 | 4-10   |   28.6% |    -46.0% |     -8.74 |     1.66× | FLAT        |    -15.3% |      36 | 2026-06-28 |
|   14 | 0f9d74  | MLB,NBA,SOC |   13 |   11 | 8-5    |   61.5% |    +23.2% |     +7.61 |     0.65× | FLAT        |    +38.2% |     102 | 2026-06-28 |
|   15 | bc3532  | MLB,NBA,NHL |   11 |   14 | 6-5    |   54.5% |    +30.7% |     +4.07 |     2.17× | CONFIRMED   |     +3.0% |     151 | 2026-06-18 |
|   16 | c668b3  | MLB,NBA,SOC |    9 |    1 | 6-3    |   66.7% |    +31.7% |     +7.52 |     0.43× | CONFIRMED   |    +47.3% |      44 | 2026-06-28 |
|   17 | 972768  | MLB        |    9 |    3 | 5-4    |   55.6% |    -26.1% |     -6.33 |     1.01× | CONFIRMED   | +Infinity% |      60 | 2026-06-21 |
|   18 | ad88a3  | MLB        |    8 |    3 | 4-4    |   50.0% |    -12.2% |     -3.24 |     0.31× | CONFIRMED   |    +27.6% |      23 | 2026-06-28 |
|   19 | f2d227  | MLB,NBA    |    8 |    0 | 5-3    |   62.5% |    +17.4% |     +3.09 |     0.60× | CONFIRMED   |     +4.9% |      57 | 2026-06-28 |
|   20 | 8c1eae  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |    +53.8% |     +4.71 |     1.79× | FLAT        |     -8.0% |      96 | 2026-06-08 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-06-27 |
|    2 | 7923c4  | MLB,NBA    |   27 | 16-11  |   59.3% |     +40.9% |    +20.15 |     0.78× | 2026-06-28 |
|    3 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    4 | 0f9d74  | MLB,NBA,SOC |   13 | 8-5    |   61.5% |     +23.2% |     +7.61 |     0.65× | 2026-06-28 |
|    5 | 9a69c2  | MLB        |   17 | 9-8    |   52.9% |     +15.3% |     +3.83 |     2.70× | 2026-06-27 |
|    6 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    7 | cd2f63  | MLB,NBA,SOC |   28 | 13-15  |   46.4% |     +10.1% |     +6.55 |     1.04× | 2026-06-25 |
|    8 | 70135d  | MLB,NBA    |   50 | 28-22  |   56.0% |      +8.9% |     +7.79 |     1.39× | 2026-06-28 |
|    9 | bc44b0  | MLB,NBA,NHL,SOC |   16 | 9-7    |   56.3% |      +5.5% |     +2.29 |     1.47× | 2026-06-28 |
|   10 | 5b1e50  | MLB,NBA,NHL,SOC |   38 | 23-15  |   60.5% |      +4.8% |     +5.75 |     1.45× | 2026-06-28 |
|   11 | 4c64aa  | MLB        |   83 | 45-38  |   54.2% |      +1.2% |     +1.83 |     0.87× | 2026-06-27 |
|   12 | 2f2a9e  | MLB,SOC    |   44 | 24-20  |   54.5% |      -0.6% |     -0.63 |     2.24× | 2026-06-28 |
|   13 | eeabaf  | MLB,NBA,SOC |   34 | 18-16  |   52.9% |      -1.4% |     -1.39 |     1.12× | 2026-06-28 |
|   14 | 1e8f33  | MLB        |   76 | 42-34  |   55.3% |      -8.8% |    -16.76 |     0.98× | 2026-06-28 |
|   15 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 1e8f33  | MLB        |   76 | 42-34  |   55.3% |      -8.8% |    -16.76 |     0.98× | 2026-06-28 |
|    3 | eeabaf  | MLB,NBA,SOC |   34 | 18-16  |   52.9% |      -1.4% |     -1.39 |     1.12× | 2026-06-28 |
|    4 | 2f2a9e  | MLB,SOC    |   44 | 24-20  |   54.5% |      -0.6% |     -0.63 |     2.24× | 2026-06-28 |
|    5 | 4c64aa  | MLB        |   83 | 45-38  |   54.2% |      +1.2% |     +1.83 |     0.87× | 2026-06-27 |
|    6 | 5b1e50  | MLB,NBA,NHL,SOC |   38 | 23-15  |   60.5% |      +4.8% |     +5.75 |     1.45× | 2026-06-28 |
|    7 | bc44b0  | MLB,NBA,NHL,SOC |   16 | 9-7    |   56.3% |      +5.5% |     +2.29 |     1.47× | 2026-06-28 |
|    8 | 70135d  | MLB,NBA    |   50 | 28-22  |   56.0% |      +8.9% |     +7.79 |     1.39× | 2026-06-28 |
|    9 | cd2f63  | MLB,NBA,SOC |   28 | 13-15  |   46.4% |     +10.1% |     +6.55 |     1.04× | 2026-06-25 |
|   10 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|   11 | 9a69c2  | MLB        |   17 | 9-8    |   52.9% |     +15.3% |     +3.83 |     2.70× | 2026-06-27 |
|   12 | 0f9d74  | MLB,NBA,SOC |   13 | 8-5    |   61.5% |     +23.2% |     +7.61 |     0.65× | 2026-06-28 |
|   13 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   14 | 7923c4  | MLB,NBA    |   27 | 16-11  |   59.3% |     +40.9% |    +20.15 |     0.78× | 2026-06-28 |
|   15 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-06-27 |

> 🔴 **2 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `10c684` (FOR# 14, ROI -46.0%), `1e8f33` (FOR# 76, ROI -8.8%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   552 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    84 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     3 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    22 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     9 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   135 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| 2026-06-16_SOC_nor_irq              | SOC   | LOCK    |  +0.30 | LOSS    |           -1.00u |
| 2026-06-16_MLB_cle_mil_spread       | MLB   | PREMIUM |  +0.11 | WIN     |           +0.62u |
| 2026-06-16_MLB_sdp_stl_spread       | MLB   | LOCK    |  +0.19 | WIN     |           +1.68u |
| 2026-06-16_MLB_cle_mil_total        | MLB   | ELITE   |  +0.13 | WIN     |           +0.99u |
| 2026-06-16_MLB_kcr_wsh_total        | MLB   | PREMIUM |  +0.13 | WIN     |           +0.91u |
| 2026-06-16_MLB_tbr_lad_total        | MLB   | LOCK    |  +0.62 | LOSS    |           -1.00u |
| 2026-06-17_MLB_cws_nyy              | MLB   | ELITE   |  +0.30 | WIN     |           +0.58u |
| 2026-06-17_SOC_cod_por              | SOC   | ELITE   |  +0.30 | LOSS    |           -1.00u |
| 2026-06-17_SOC_pan_gha              | SOC   | LOCK    |  +0.30 | WIN     |           +1.42u |
| 2026-06-18_MLB_bal_sea              | MLB   | LOCK    |  +0.30 | WIN     |           +0.72u |
| 2026-06-18_MLB_laa_oak              | MLB   | PREMIUM |  +0.28 | WIN     |           +0.57u |
| 2026-06-18_SOC_kor_mex              | SOC   | ELITE   |  +0.34 | WIN     |           +1.13u |

## § 15 — Live Calibration Snapshot (V12 thresholds in use)

The live `agsCalibration/current` document — what the cron and UI both read at runtime to score & size every pick. **This is the actual thresholds V12 is using right now.**

- **Computed at:** 2026-06-28T14:26:50.785Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 1440
- **Date range:** 2026-04-18 → 2026-06-27

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.987 | ELITE           | 5.00u                  |
| q60      |        +0.972 | PREMIUM         | 3.00u                  |
| q40      |        +0.919 | LOCK            | 1.00u                  |
| q20      |        +0.729 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            145 |        35 |   18 |    7 |   85 |                     60 |
| NBA   |            211 |        58 |   25 |   23 |  105 |                    106 |
| NHL   |            105 |        23 |    6 |   16 |   60 |                     45 |
| SOC   |            155 |        36 |   30 |    5 |   84 |                     71 |

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~944 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 531 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 292 / 531 (55%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 292 / 531 (55%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 292 / 531 (55%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 292 / 531 (55%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 292 / 531 (55%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 292 / 531 (55%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 292 / 531 (55%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 531 / 531 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 531 / 531 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 531 / 531 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 531 / 531 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 531 / 531 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 531 / 531 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 526 / 531 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 524 / 531 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 531 / 531 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 531 / 531 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 313 / 531 (59%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 531 / 531 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 313 / 531 (59%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 313 / 531 (59%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 531 / 531 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 531 / 531 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 531 / 531 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 531 / 531 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 531 / 531 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | V12 agMean           | 292 |  🟢  |    -0.082 |    +0.309 |      -0.086 |      +0.045 |  0.489 |
|    2 | provenTotal          | 531 |      |    -0.060 |    +0.032 |      -0.072 |      -0.067 |  0.477 |
|    3 | provenFor            | 531 |      |    -0.053 |    +0.026 |      -0.071 |      -0.090 |  0.480 |
|    4 | wd forAvgSize        | 531 |      |    -0.048 |    -0.035 |      -0.071 |      -0.069 |  0.510 |
|    5 | hcMargin             | 531 |      |    -0.042 |    +0.130 |      -0.067 |      -0.003 |  0.505 |
|    6 | agsV12               | 292 |  🟢  |    +0.066 |    +0.027 |      +0.066 |      +0.045 |  0.528 |
|    7 | wd sizeMargin        | 313 |      |    -0.031 |    -0.061 |      -0.060 |      -0.084 |  0.491 |
|    8 | wd contribFor        | 531 |      |    -0.048 |    -0.095 |      -0.059 |      -0.105 |  0.478 |
|    9 | wd forCount          | 531 |      |    -0.037 |    +0.046 |      -0.056 |      -0.066 |  0.471 |
|   10 | wd maxShare          | 531 |      |    +0.044 |    -0.013 |      +0.054 |      +0.053 |  0.537 |
|   11 | wd contribAg         | 531 |      |    -0.045 |    +0.138 |      -0.052 |      +0.045 |  0.493 |
|   12 | provenAg             | 531 |      |    -0.053 |    +0.182 |      -0.052 |      +0.057 |  0.484 |
|   13 | provenMargin         | 531 |      |    -0.021 |    +0.014 |      -0.043 |      -0.073 |  0.496 |
|   14 | ags (v11)            | 531 |      |    -0.005 |    -0.081 |      -0.032 |      -0.130 |  0.501 |
|   15 | wd contribMargin     | 531 |      |    -0.023 |    -0.161 |      -0.031 |      -0.122 |  0.475 |
|   16 | lockPinnProb         | 526 |      |    +0.150 |    +0.185 |      +0.029 |      -0.118 |  0.579 |
|   17 | V12 forCount         | 292 |  🟢  |    +0.008 |    +0.233 |      -0.028 |      +0.013 |  0.522 |
|   18 | wd agCount           | 313 |      |    -0.017 |    +0.280 |      -0.027 |      +0.095 |  0.504 |
|   19 | qMargin              | 292 |  🟢  |    +0.043 |    +0.025 |      +0.025 |      +0.003 |  0.518 |
|   20 | peakStars            | 531 |      |    -0.013 |    +0.100 |      -0.023 |      -0.002 |  0.486 |
|   21 | countMargin          | 292 |      |    +0.019 |    +0.183 |      -0.019 |      -0.020 |  0.504 |
|   22 | wd maxForContrib     | 531 |      |    -0.015 |    -0.093 |      -0.018 |      -0.053 |  0.509 |
|   23 | V12 agCount          | 292 |  🟢  |    -0.018 |    +0.111 |      -0.018 |      +0.053 |  0.512 |
|   24 | wd agAvgSize         | 313 |      |    -0.031 |    -0.024 |      -0.015 |      -0.030 |  0.491 |
|   25 | clv                  | 524 |      |    +0.014 |    +0.020 |      -0.011 |      +0.045 |  0.541 |
|   26 | V12 forMean          | 292 |  🟢  |    +0.024 |    -0.006 |      +0.006 |      -0.025 |  0.506 |

> **Top 3 univariate features by PnL correlation:** `V12 agMean` (r = -0.086), `provenTotal` (r = -0.072), `provenFor` (r = -0.071).

> 🟡 **Highest-ranked feature NOT used by V12:** `provenTotal` — r(unit-ret) = -0.072, AUC = 0.477. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `V12 agMean` · r(unit-ret) = -0.086 · AUC = 0.489

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.000 … 0.000            | 242 | 135-107 |   55.8% |     +1.5% |
| MID (p33–p67)     | —                        |   0 | 0-0     |       — |         — |
| HIGH (> p67)      | 2.350 … 5.880            |  50 | 25-25   |   50.0% |     -6.5% |

#### `provenTotal` · r(unit-ret) = -0.072 · AUC = 0.477

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 2.000 … 2.000            | 261 | 145-116 |   55.6% |     +1.9% |
| MID (p33–p67)     | 3.000 … 3.000            | 109 | 60-49   |   55.0% |     +0.8% |
| HIGH (> p67)      | 13.000 … 5.000           | 161 | 82-79   |   50.9% |     -3.3% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `provenFor` · r(unit-ret) = -0.071 · AUC = 0.480

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 202 | 110-92  |   54.5% |     +1.7% |
| MID (p33–p67)     | 2.000 … 2.000            | 163 | 97-66   |   59.5% |     +5.0% |
| HIGH (> p67)      | 10.000 … 3.000           | 166 | 80-86   |   48.2% |     -5.9% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd forAvgSize` · r(unit-ret) = -0.071 · AUC = 0.510

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.473 … 0.590            | 179 | 91-88   |   50.8% |     -1.9% |
| MID (p33–p67)     | 0.777 … 0.940            | 175 | 98-77   |   56.0% |     +2.2% |
| HIGH (> p67)      | 3.837 … 1.775            | 177 | 98-79   |   55.4% |     -0.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `hcMargin` · r(unit-ret) = -0.067 · AUC = 0.505

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.000 … 0.000            | 355 | 189-166 |   53.2% |     +0.2% |
| MID (p33–p67)     | —                        |   0 | 0-0     |       — |         — |
| HIGH (> p67)      | 1.000 … 1.000            | 176 | 98-78   |   55.7% |     -0.1% |

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | V12 agMean     | provenTotal    | provenFor      | wd forAvgSize  | hcMargin       | agsV12         | wd sizeMargin  | wd contribFor  |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| V12 agMean  |  1.000         |         +0.575 |         +0.445 |         +0.419 |         +0.355 |         -0.777 |         +0.190 |         +0.435 |
| provenTotal |         +0.575 |  1.000         |         +0.937 |         +0.396 |         +0.592 |         -0.442 |         +0.213 |         +0.871 |
| provenFor   |         +0.445 |         +0.937 |  1.000         |         +0.388 |         +0.673 |         -0.332 |         +0.248 |         +0.915 |
| wd forAvgSize |         +0.419 |         +0.396 |         +0.388 |  1.000         |         +0.464 |         -0.284 |         +0.670 |         +0.411 |
| hcMargin    |         +0.355 |         +0.592 |         +0.673 |         +0.464 |  1.000         |         -0.216 |         +0.388 |         +0.650 |
| agsV12      |         -0.777 |         -0.442 |         -0.332 |         -0.284 |         -0.216 |  1.000         |         -0.140 |         -0.302 |
| wd sizeMargin |         +0.190 |         +0.213 |         +0.248 |         +0.670 |         +0.388 |         -0.140 |  1.000         |         +0.244 |
| wd contribFor |         +0.435 |         +0.871 |         +0.915 |         +0.411 |         +0.650 |         -0.302 |         +0.244 |  1.000         |

> 🔴 **Strong collinearity detected:** `provenTotal` and `provenFor` have r = +0.937. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 196 picks · features = 8 (+ intercept) · multiple R² = **0.0217** · adjusted R² = **-0.0256** · residual sd = 0.956

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | provenFor            |     |    -0.1417 |   0.2666 | -0.53        |        1 |
|    2 | wd contribFor        |     |    +0.1266 |   0.1742 | +0.73        |        2 |
|    3 | V12 agMean           |  🟢 |    -0.1206 |   0.1284 | -0.94        |        3 |
|    4 | hcMargin             |     |    -0.0647 |   0.1013 | -0.64        |        4 |
|    5 | provenTotal          |     |    +0.0628 |   0.2347 | +0.27        |        5 |
|    6 | wd sizeMargin        |     |    -0.0327 |   0.0950 | -0.34        |        6 |
|    7 | agsV12               |  🟢 |    -0.0285 |   0.1102 | -0.26        |        7 |
|    8 | wd forAvgSize        |     |    -0.0103 |   0.1041 | -0.10        |        8 |
| —    | (intercept)          |     |    +0.0231 |   0.0683 |    +0.34 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 agMean` (β = -0.121), `agsV12` (β = -0.029)
- V12 IGNORES: `provenFor` (β = -0.142, t = -0.53), `wd contribFor` (β = +0.127, t = +0.73), `hcMargin` (β = -0.065, t = -0.64), `provenTotal` (β = +0.063, t = +0.27), `wd sizeMargin` (β = -0.033, t = -0.34), `wd forAvgSize` (β = -0.010, t = -0.10)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.532 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.546 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap ≈ 0** — V12 is capturing essentially all the linear signal available in the panel. The remaining features are noise.

### 17G — Actionable recommendations

- Adjusted R² of -0.0256 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*