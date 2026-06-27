# AGS-Unified — V12 Performance Monitor

**Generated:** Saturday, June 27, 2026 at 10:14 AM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 27

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (27 days ago), V12 has evaluated **774** picks, shipped **276** for real money (35.7% ship rate), and muted the other **498**. On the shipped picks V12 has gone **151-125** (54.7% win), staked **646.25u**, and returned **+28.90u** at **+4.5% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             27 |
| Picks V12 has evaluated             |                            774 |
| Picks SHIPPED (units > 0)           |                            276 |
| Picks MUTED (score ≤ 0, FADE)       |                            498 |
| Ship rate                           |                          35.7% |
| Live W-L                            |                        151-125 |
| Live Win %                          |                          54.7% |
| Live PnL (units)                    |                         +28.90 |
| Live ROI                            |                          +4.5% |
| Avg PnL / day                       |                         +1.07u |
| Most recent action (2026-06-28)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.5% ROI** across 276 live picks (+28.90u real PnL).
- Mute rule is **saving money** — the 331 muted picks would have lost -40.35u at flat 1u (-12.2% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.07u/day** on average since launch.
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
| v12     | 06-01 → present      |   27 |    276 | 331 | 151-125 |  54.7% |      4.5% |     +28.90 |    +0.10 | 0.537 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  216 |    +1.4pp |    +13.4pp |          +0.278 |   -0.012 |          — | 🟡 mixed |
| v12 − v10          | +  214 |    +6.3pp |    +23.2pp |          +0.418 |   +0.143 |          — | 🟢 better |
| v12 − v11          | +  165 |    -0.2pp |     +1.6pp |          +0.044 |   +0.093 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | All           |
|---------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | 111n 55.0% +3% |
| v12     | 250n 54.8% +3% | 10n 30.0% +29% | 6n 83.3% +38%  | 10n 60.0% +3%  | 276n 54.7% +4% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 63n +2%       | 83n +12%      | 59n -10%      | 35n +7%       | 31n -26%      | 🟡 partial (0) |

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
| 2026-06-27 |        13 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +28.90 |
| 2026-06-28 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +28.90 |

> **Trajectory.** 🟡 Last 3 days (1.3% ROI) is **-3.3pp worse** than the prior window (4.6%). Watch for further regression.

> **Bottom line.** 27 days live, 276 live picks shipped, **+28.90u total PnL** at **+4.5% ROI**, averaging **+1.07u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  94 | 36-27  |  57.1% |        +0.988 |    5.00u |            4.21u | -0.79u |      265.50 |      +6.05 |      2.3% |
| PREMIUM  |  3.00u | 130 | 49-34  |  59.0% |        +0.970 |    3.00u |            3.01u | +0.01u |      250.00 |     +28.81 |     11.5% |
| LOCK     |  1.00u |  92 | 26-33  |  44.1% |        +0.939 |    1.00u |            1.19u | +0.19u |       70.50 |      -6.93 |     -9.8% |
| LEAN     |  0.50u |  59 | 22-13  |  62.9% |        +0.855 |    0.50u |            1.06u | +0.56u |       37.00 |      +2.46 |      6.6% |
| WEAK     |  0.25u |  66 | 15-16  |  48.4% |        +0.461 |    0.25u |            0.53u | +0.28u |       16.50 |      -4.31 |    -26.1% |
| FADE     |  0.00u | 160 | 0-0    |      — |        -0.177 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### v12abc — By Stake Tier (HC margin + 2-for-0 rescue + proven-$ overlay)

Post-cutover picks size off the **HC margin** — SUPER (margin 2 · 6u), TOP (margin 1 · 4u), MINI (mini-HC 1.0–1.5× · 3u), CONFIRMED (margin 3+ · 1u) — **plus** the **RANK (2-for-0)** wallet-rescue path at **4u**. From **2026-06-26** the **v12abc proven-$ overlay** (internal stats: backer `positions.dollarRoi` + featured `picks.wr`) adds: **SHARP / SHARP-PRIME** ($-rescue of HC-muted picks at 3u / 4u when ≥2 sharps back it incl. a proven-money winner and mean win-rate ≥ 50 / 55), **TOP+** (HC-1 boosted 4u → 5u when a proven-$ backer is present), and **MINI-** (MINI cut 3u → 1u when no proven-$ backer is on it). Together these paths ARE the v12abc staked book. **MONITORING** (non-HC or WEAK-tier HC, no proven-$ rescue) is tracked at **0u** and excluded from the staked record/ROI below.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |   3 | 2-1    |  66.7% |       13.50 |      +7.12 |     52.7% |
| TOP PICK (TOP+/TOP)       |  4-5u |  15 | 10-5   |  66.7% |       55.50 |      +4.27 |      7.7% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP) |  3-4u |  11 | 7-4    |  63.6% |       39.50 |      +7.13 |     18.1% |
| STRONG (MINI)             |    3u |  27 | 13-14  |  48.1% |       80.00 |      -8.87 |    -11.1% |
| LEAN (CONFIRMED/MINI-)    |    1u |   1 | 0-1    |   0.0% |        1.00 |      -1.00 |   -100.0% |
| **STAKED TOTAL** |     — |  57 | 32-25  |  56.1% |      189.50 |      +8.65 |     +4.6% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| HC-2 (model max)      | SUPER       |    6u |   3 | 2-1    |  66.7% |       13.50 |      +7.12 |     52.7% |
| HC-1 + $-boost        | TOP+        |    5u |   1 | 0-1    |   0.0% |        2.50 |      -2.50 |   -100.0% |
| HC-1 (model)          | TOP         |    4u |  14 | 10-4   |  71.4% |       53.00 |      +6.77 |     12.8% |
| 2-for-0 rescue        | RANK        |    4u |  10 | 7-3    |  70.0% |       38.00 |      +8.63 |     22.7% |
| proven-$ prime        | SHARP-PRIME |    4u |   1 | 0-1    |   0.0% |        1.50 |      -1.50 |   -100.0% |
| proven-$ consensus    | SHARP       |    3u |   0 | pending |      — |        0.00 |      +0.00 |         — |
| mini-HC (gate-pass)   | MINI        |    3u |  27 | 13-14  |  48.1% |       80.00 |      -8.87 |    -11.1% |
| mini gate-cut         | MINI-       |    1u |   0 | pending |      — |        0.00 |      +0.00 |         — |
| margin 3+             | CONFIRMED   |    1u |   1 | 0-1    |   0.0% |        1.00 |      -1.00 |   -100.0% |

> **MONITORING volume:** 170 picks tracked at 0u (would-be 82-88, 48.2% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Sizing pipeline integrity

🚨 **209 picks deviate from the V12 ladder by > ±0.05u** even after accounting for the production odds-cap. Investigate `unitsFromAgsV12` in `syncPickStateAuthoritative.js`.

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
| _… and 184 more_ |

## § 5a — RANK-RESCUE Slice (2-for-0 wallet path · v12ab book)

> **What this is.** `v12ab` = the v12a book (HC-margin sizing) **plus** the RANK-RESCUE staking path that went live **2026-06-21**. The rule: a v12-shipped pick (score > 0) that the HC sizer mutes to 0u is staked at **4u** when its FOR side is **2-for-0** — ≥2 eligible whitelist wallets backing (CONFIRMED/FLAT/WR50 with ≥8 settled in-sport picks) and 0 against. It **only rescues muted picks**; it never up-sizes a pick the HC ladder already staked.

### (B) Reconstruction over the V12 era (2026-06-01 → today)

> Re-derived from frozen `walletDetails` + **current** wallet profiles. Eligibility uses today's settled-pick counts, so this is a **mildly optimistic projection** (a wallet at ≥8 picks now may have had fewer at pick time). Live-stamped numbers in (A) are the ground truth.

| Bucket | Picks | W-L | Win % | Stake | PnL | ROI | Per day |
|--------|------:|:---:|:-----:|------:|----:|----:|--------:|
| RANK-RESCUE (HC-muted → 4u) | 42 | 27-15 | 64.3% | 168u | +39.40u | +23.4% | 1.56 |

**2-for-0 picks the HC ladder ALREADY staked (NOT rescued — no hammer): 22** (14-8). These are left at their HC size — the slice adds no edge inside the HC book.

#### RANK-RESCUE by sport (reconstructed)

| Sport | Picks | W-L | Win % | PnL @4u | ROI |
|-------|------:|:---:|:-----:|------:|----:|
| MLB | 38 | 26-12 | 68.4% | +42.80u | +28.2% |
| NBA | 1 | 0-1 | 0.0% | -4.00u | -100.0% |
| NHL | 2 | 1-1 | 50.0% | +4.60u | +57.5% |
| SOC | 1 | 0-1 | 0.0% | -4.00u | -100.0% |

### (A) Live stamped RANK picks (ground truth — populates going forward)

| Picks | W-L | Win % | Stake | PnL | ROI |
|------:|:---:|:-----:|------:|----:|----:|
| 10 | 7-3 | 70.0% | 38u | +8.63u | +22.7% |

| Date | Sport | Matchup | Side | Odds | Result | PnL |
|------|-------|---------|------|-----:|:------:|----:|
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

> RANK-RESCUE sits **on top of the v12a HC book** — it stakes 4u on picks the HC ladder would mute (0u), so every rescue is net-new volume, never an up-size. Reconstruction: **+1.56 picks/day** (42 over 27 days) at **+23.4% ROI** / **+39.40u**, pulled from the muted pool — so no existing HC pick's size or grade changes. (The § 1 / § 4–5 headline book still reflects historical score-ladder sizing for picks shipped before v12a; only NEW picks size under v12a + RANK.)

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 142n · 55.6% · +6.6%   | 21n · 57.1% · -5.8%    | 87n · 52.9% · +1.0%    | 250n · 54.8% · +3.3%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 10n · 60.0% · +2.5%    | —                      | —                      | 10n · 60.0% · +2.5%    |
| **All** | **159n · 54.7% · +5.9%** | **25n · 60.0% · +7.1%** | **92n · 53.3% · +2.1%** | **276n · 54.7% · +4.5%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  | 320 |    214 | 117-97 |    52.8% |   52.3% |     +0.5pp |      5.0% |
| 0.7 – 0.9          |  65 |     30 | 19-11  |    50.8% |   52.2% |     -1.4pp |      3.1% |
| 0.5 – 0.7          |  22 |      8 | 4-4    |    45.5% |   55.6% |    -10.1pp |    -35.3% |
| 0.25 – 0.5         |  21 |     10 | 5-5    |    57.1% |   51.2% |     +5.9pp |     -6.8% |
| (0, 0.25]          |  13 |      9 | 3-6    |    46.2% |   57.5% |    -11.3pp |    -33.8% |
| ≤ 0 (MUTED)        | 144 |      0 | 0-0    |    45.8% |   53.7% |     -7.9pp |         — |

> 🟡 **Strong-score band (> 0.9) edge is +0.5pp** — borderline. Larger sample needed before declaring V12's top tier as real alpha.

> 🟢 **Mute band (≤ 0) actually wins only 45.8%** — V12 correctly identifies these as losers. The mute rule is justified.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **331** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  331 |
| Muted W-L                           |              155-176 |
| Muted Win %                         |                46.8% |
| Counterfactual PnL at flat 1u       |               -40.35 |
| Counterfactual ROI at flat 1u       |               -12.2% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-40.35u** at a flat 1u stake — a counterfactual ROI of **-12.2%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  571 |
| Spearman ρ (v11 vs V12 score)       |               -0.228 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.228. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 586 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +19.966 |                        2.1 |
| AGAINST |             +3.415 |                        1.2 |

### One-sided wallet support (high-variance picks)

- **34** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **1** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **12-10** (54.5% win) at **-3.8% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   0 |   1 |   1 |   3 |  11 |
| AGAINST |   0 |   0 |   1 |   2 |   8 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | Score    | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|----------|-------|---------|------------|
| 2026-06-26 | MLB   | ML     | Atlanta Braves          |  -120 | +0.971 | 2-for-0  | PREMIUM  | 4.00u | WIN     |      +3.33 |
| 2026-06-26 | SOC   | ML     | Belgium                 |  -500 | +0.988 | 2-for-0  | ELITE    | 4.00u | WIN     |      +0.80 |
| 2026-06-26 | SOC   | ML     | Spain                   |  -145 | +0.811 | HC-2     | LEAN     | 6.00u | WIN     |      +4.14 |
| 2026-06-26 | SOC   | ML     | France                  |  -250 | +0.560 | 2-for-0  | WEAK     | 4.00u | WIN     |      +1.60 |
| 2026-06-26 | SOC   | ML     | Egypt                   |  +170 | +0.807 | HC-2     | LEAN     | 1.50u | LOSS    |      -1.50 |
| 2026-06-26 | SOC   | ML     | Cabo Verde              |  +175 | +0.694 | SHARP+   | WEAK     | 1.50u | LOSS    |      -1.50 |
| 2026-06-26 | MLB   | SPREAD | Philadelphia Phillies   |  +110 | +0.983 | HC-1+$   | PREMIUM  | 2.50u | LOSS    |      -2.50 |
| 2026-06-26 | MLB   | TOTAL  | Under 7.5               |  -110 | +0.997 | HC-1     | ELITE    | 4.00u | LOSS    |      -4.00 |
| 2026-06-25 | SOC   | ML     | Germany                 |  -155 | +0.939 | CONF     | LOCK     | 1.00u | LOSS    |      -1.00 |
| 2026-06-25 | SOC   | ML     | Netherlands             |  -750 | +0.993 | HC-1     | ELITE    | 4.00u | WIN     |      +0.53 |
| 2026-06-25 | SOC   | ML     | United States           |  +105 | +0.631 | 2-for-0  | WEAK     | 4.00u | LOSS    |      -4.00 |
| 2026-06-25 | MLB   | SPREAD | New York Yankees        |  +114 | +0.988 | 2-for-0  | ELITE    | 4.00u | LOSS    |      -4.00 |
| 2026-06-25 | MLB   | TOTAL  | Under 9.5               |  -110 | +0.968 | 2-for-0  | PREMIUM  | 4.00u | WIN     |      +3.64 |
| 2026-06-24 | MLB   | ML     | Atlanta Braves          |  -118 | +0.964 | MINI     | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-24 | MLB   | ML     | Colorado Rockies        |  +145 | +0.977 | 2-for-0  | PREMIUM  | 4.00u | WIN     |      +5.80 |
| 2026-06-24 | SOC   | ML     | Morocco                 |  -350 | +0.981 | HC-1     | PREMIUM  | 4.00u | WIN     |      +1.14 |
| 2026-06-24 | MLB   | TOTAL  | Over 10.5               |  -110 | +0.969 | 2-for-0  | PREMIUM  | 4.00u | WIN     |      +3.64 |
| 2026-06-24 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.961 | MINI     | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-24 | MLB   | TOTAL  | Under 7.5               |  -109 | +0.778 | 2-for-0  | LEAN     | 4.00u | LOSS    |      -4.00 |
| 2026-06-23 | MLB   | ML     | Atlanta Braves          |  -110 | +0.976 | MINI     | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-23 | MLB   | ML     | Baltimore Orioles       |  -142 | +0.973 | MINI     | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-23 | MLB   | TOTAL  | Over 9.5                |  +103 | +0.906 | MINI     | LOCK     | 2.50u | LOSS    |      -2.50 |
| 2026-06-22 | MLB   | ML     | Toronto Blue Jays       |  -131 | +0.991 | MINI     | ELITE    | 3.00u | WIN     |      +2.29 |
| 2026-06-22 | MLB   | TOTAL  | Over 8.5                |  -102 | +0.962 | MINI     | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-22 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.959 | MINI     | PREMIUM  | 3.00u | WIN     |      +2.73 |
| 2026-06-22 | MLB   | TOTAL  | Under 6.5               |  -110 | +0.986 | MINI     | ELITE    | 3.00u | WIN     |      +2.73 |
| 2026-06-22 | MLB   | TOTAL  | Under 8.5               |  -104 | +0.922 | HC-1     | LOCK     | 4.00u | WIN     |      +3.85 |
| 2026-06-21 | MLB   | ML     | Los Angeles Dodgers     |  -225 | +0.939 | MINI     | LOCK     | 3.00u | LOSS    |      -3.00 |
| 2026-06-21 | MLB   | ML     | Philadelphia Phillies   |  -186 | +0.964 | MINI     | PREMIUM  | 3.00u | WIN     |      +1.61 |
| 2026-06-21 | SOC   | ML     | Egypt                   |  -175 |     — | —        | —        | 1.00u | WIN     |      +0.57 |

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.527 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.096 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.030 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.059 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.067 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  271 |    +0.3483 |    -0.2879 | 0.0049 |  +0.070 |   0.949 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  271 |    +0.1743 |    +0.3905 | 0.0045 |  +0.067 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  271 |    +0.4549 |    -0.3100 | 0.0011 |  +0.033 |   2.607 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 271 |          -0.000 |           -0.025 |                   -0.007 |                   -0.023 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 271 |          -0.094 |           +0.301 |                   -0.100 |                   +0.049 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 271 |          -0.045 |           +0.198 |                   -0.077 |                   +0.008 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 271 |          -0.020 |           +0.128 |                   -0.021 |                   +0.063 | count of contributing AGAINST-side wallets                     |
| provenFor         | 271 |          -0.034 |           +0.224 |                   -0.066 |                   +0.016 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 271 |          -0.059 |           +0.104 |                   -0.061 |                   +0.026 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 1.755          |  94 | 52-42   |   55.3% |     +4.1% |
| MID (p33–p67)     | 19.950 … 16.701        |  87 | 49-38   |   56.3% |     +2.0% |
| HIGH (> p67)      | 48.906 … 147.750       |  90 | 47-43   |   52.2% |     -1.2% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       271 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8930 | average score across live picks                                 |
| SD                |    0.1915 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.837 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +7.448 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.720 / +0.964 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  246 | 135-111 |   54.9% |     +2.9% |  0.495 |        -0.019 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |    9 | 5-4    |   55.6% |     +0.7% |  0.750 |        +0.050 | strong (N<20)                             |

### 12F — Stability: rolling 7-day AUC across the V12 window

Recompute AUC on a moving 7-day window. If recent windows are degrading (e.g. dropping from 0.58 → 0.50 → 0.45), V12's edge is decaying in real time. Each row anchors on the END date of its window.

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    |
|------------|------|------|--------|---------|-----------|--------|
| 2026-06-13 |    7 |  121 | 66-55  |   54.5% |     +9.0% |  0.547 |
| 2026-06-14 |    7 |  111 | 58-53  |   52.3% |     +1.9% |  0.520 |
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

> 🔴 **AUC is trending DOWN** — V12 is degrading; investigate quintile cutoffs and wallet pool drift (0.528 avg in first half → 0.490 avg in second half · Δ = -0.038)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.5% | [-8.7%, +15.7%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.7% | [48.3%, 60.5%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.527 | [0.457, 0.595]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             26 | [-9, 57]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       276 |
| Unique wallets ever on a FOR side            |                                                        91 |
| Avg FOR-side wallets per pick                |                                                      2.41 |
| Top-5 wallets' share of all FOR appearances  |                                                     40.2% |
| Top-10 wallets' share of all FOR appearances |                                                     60.1% |
| Top-20 wallets' share of all FOR appearances |                                                     75.2% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   81 |    8 | 45-36  |   55.6% |     +6.7% |     +9.83 |     0.87× | CONFIRMED   |     +0.6% |     275 | 2026-06-26 |
|    2 | 1e8f33  | MLB        |   73 |    6 | 41-32  |   56.2% |     -8.0% |    -14.40 |     0.93× | CONFIRMED   |     +2.5% |     149 | 2026-06-26 |
|    3 | 70135d  | MLB,NBA    |   46 |   64 | 25-21  |   54.3% |     +5.3% |     +3.75 |     1.39× | CONFIRMED   |     -3.4% |     415 | 2026-06-22 |
|    4 | 2f2a9e  | MLB,SOC    |   37 |   21 | 19-18  |   51.4% |     -3.3% |     -2.66 |     2.26× | CONFIRMED   | +Infinity% |     150 | 2026-06-26 |
|    5 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|    6 | eeabaf  | MLB,NBA,SOC |   29 |    3 | 14-15  |   48.3% |    -13.5% |    -11.62 |     1.13× | CONFIRMED   |    +27.4% |     100 | 2026-06-26 |
|    7 | cd2f63  | MLB,NBA,SOC |   28 |   17 | 13-15  |   46.4% |    +10.1% |     +6.55 |     1.04× | CONFIRMED   |    +10.6% |     281 | 2026-06-25 |
|    8 | 7923c4  | MLB,NBA    |   26 |    6 | 16-10  |   61.5% |    +53.4% |    +24.15 |     0.74× | CONFIRMED   |    +12.7% |     126 | 2026-06-22 |
|    9 | 5b1e50  | MLB,NBA,NHL,SOC |   25 |   37 | 16-9   |   64.0% |    +17.0% |    +13.00 |     1.53× | CONFIRMED   |     +7.1% |     163 | 2026-06-26 |
|   10 | 491f30  | MLB        |   24 |    3 | 16-8   |   66.7% |    +42.3% |    +33.39 |     0.96× | CONFIRMED   |     -4.2% |      51 | 2026-06-23 |
|   11 | 9a69c2  | MLB        |   16 |   39 | 9-7    |   56.3% |    +37.3% |     +7.83 |     2.78× | CONFIRMED   |    -16.9% |     151 | 2026-06-21 |
|   12 | 10c684  | MLB,NBA    |   13 |    4 | 4-9    |   30.8% |    -31.6% |     -4.74 |     1.74× | FLAT        |    -23.1% |      32 | 2026-06-11 |
|   13 | bc44b0  | MLB,NBA,NHL,SOC |   12 |    6 | 6-6    |   50.0% |    -13.0% |     -3.98 |     1.72× | FLAT        |    +32.1% |      58 | 2026-06-26 |
|   14 | bc3532  | MLB,NBA,NHL |   11 |   14 | 6-5    |   54.5% |    +30.7% |     +4.07 |     2.17× | CONFIRMED   |     +3.0% |     151 | 2026-06-18 |
|   15 | 0f9d74  | MLB,NBA,SOC |   11 |    9 | 6-5    |   54.5% |    +13.2% |     +3.67 |     0.68× | FLAT        |    +38.1% |      91 | 2026-06-26 |
|   16 | 972768  | MLB        |    9 |    3 | 5-4    |   55.6% |    -26.1% |     -6.33 |     1.01× | CONFIRMED   | +Infinity% |      58 | 2026-06-21 |
|   17 | 8c1eae  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |    +53.8% |     +4.71 |     1.79× | FLAT        |     -8.0% |      96 | 2026-06-08 |
|   18 | e05213  | MLB        |    7 |    2 | 5-2    |   71.4% |    +34.7% |     +6.85 |     1.25× | CONFIRMED   |    +40.5% |      15 | 2026-06-22 |
|   19 | 4d2125  | NHL,SOC    |    7 |    1 | 5-2    |   71.4% |    +26.7% |     +4.80 |     1.05× | CONFIRMED   |     +4.6% |      24 | 2026-06-26 |
|   20 | b839b3  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |     +7.7% |     +1.76 |     1.71× | CONFIRMED   |     -6.4% |      17 | 2026-06-20 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 7923c4  | MLB,NBA    |   26 | 16-10  |   61.5% |     +53.4% |    +24.15 |     0.74× | 2026-06-22 |
|    2 | 491f30  | MLB        |   24 | 16-8   |   66.7% |     +42.3% |    +33.39 |     0.96× | 2026-06-23 |
|    3 | 9a69c2  | MLB        |   16 | 9-7    |   56.3% |     +37.3% |     +7.83 |     2.78× | 2026-06-21 |
|    4 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    5 | 5b1e50  | MLB,NBA,NHL,SOC |   25 | 16-9   |   64.0% |     +17.0% |    +13.00 |     1.53× | 2026-06-26 |
|    6 | 0f9d74  | MLB,NBA,SOC |   11 | 6-5    |   54.5% |     +13.2% |     +3.67 |     0.68× | 2026-06-26 |
|    7 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    8 | cd2f63  | MLB,NBA,SOC |   28 | 13-15  |   46.4% |     +10.1% |     +6.55 |     1.04× | 2026-06-25 |
|    9 | 4c64aa  | MLB        |   81 | 45-36  |   55.6% |      +6.7% |     +9.83 |     0.87× | 2026-06-26 |
|   10 | 70135d  | MLB,NBA    |   46 | 25-21  |   54.3% |      +5.3% |     +3.75 |     1.39× | 2026-06-22 |
|   11 | 2f2a9e  | MLB,SOC    |   37 | 19-18  |   51.4% |      -3.3% |     -2.66 |     2.26× | 2026-06-26 |
|   12 | 1e8f33  | MLB        |   73 | 41-32  |   56.2% |      -8.0% |    -14.40 |     0.93× | 2026-06-26 |
|   13 | bc44b0  | MLB,NBA,NHL,SOC |   12 | 6-6    |   50.0% |     -13.0% |     -3.98 |     1.72× | 2026-06-26 |
|   14 | eeabaf  | MLB,NBA,SOC |   29 | 14-15  |   48.3% |     -13.5% |    -11.62 |     1.13× | 2026-06-26 |
|   15 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |
|    2 | eeabaf  | MLB,NBA,SOC |   29 | 14-15  |   48.3% |     -13.5% |    -11.62 |     1.13× | 2026-06-26 |
|    3 | bc44b0  | MLB,NBA,NHL,SOC |   12 | 6-6    |   50.0% |     -13.0% |     -3.98 |     1.72× | 2026-06-26 |
|    4 | 1e8f33  | MLB        |   73 | 41-32  |   56.2% |      -8.0% |    -14.40 |     0.93× | 2026-06-26 |
|    5 | 2f2a9e  | MLB,SOC    |   37 | 19-18  |   51.4% |      -3.3% |     -2.66 |     2.26× | 2026-06-26 |
|    6 | 70135d  | MLB,NBA    |   46 | 25-21  |   54.3% |      +5.3% |     +3.75 |     1.39× | 2026-06-22 |
|    7 | 4c64aa  | MLB        |   81 | 45-36  |   55.6% |      +6.7% |     +9.83 |     0.87× | 2026-06-26 |
|    8 | cd2f63  | MLB,NBA,SOC |   28 | 13-15  |   46.4% |     +10.1% |     +6.55 |     1.04× | 2026-06-25 |
|    9 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|   10 | 0f9d74  | MLB,NBA,SOC |   11 | 6-5    |   54.5% |     +13.2% |     +3.67 |     0.68× | 2026-06-26 |
|   11 | 5b1e50  | MLB,NBA,NHL,SOC |   25 | 16-9   |   64.0% |     +17.0% |    +13.00 |     1.53× | 2026-06-26 |
|   12 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   13 | 9a69c2  | MLB        |   16 | 9-7    |   56.3% |     +37.3% |     +7.83 |     2.78× | 2026-06-21 |
|   14 | 491f30  | MLB        |   24 | 16-8   |   66.7% |     +42.3% |    +33.39 |     0.96× | 2026-06-23 |
|   15 | 7923c4  | MLB,NBA    |   26 | 16-10  |   61.5% |     +53.4% |    +24.15 |     0.74× | 2026-06-22 |

> 🔴 **4 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `10c684` (FOR# 13, ROI -31.6%), `eeabaf` (FOR# 29, ROI -13.5%), `bc44b0` (FOR# 12, ROI -13.0%), `1e8f33` (FOR# 73, ROI -8.0%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   498 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    67 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     6 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    20 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   136 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

- **Computed at:** 2026-06-26T15:16:16.580Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 1472
- **Date range:** 2026-04-18 → 2026-06-25

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.984 | ELITE           | 5.00u                  |
| q60      |        +0.955 | PREMIUM         | 3.00u                  |
| q40      |        +0.858 | LOCK            | 1.00u                  |
| q20      |        +0.724 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            140 |        37 |   18 |    4 |   81 |                     59 |
| NBA   |            211 |        58 |   25 |   23 |  105 |                    106 |
| NHL   |            105 |        23 |    6 |   16 |   60 |                     45 |
| SOC   |            148 |        27 |   31 |    4 |   86 |                     62 |

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~889 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 510 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 271 / 510 (53%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 271 / 510 (53%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 271 / 510 (53%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 271 / 510 (53%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 271 / 510 (53%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 271 / 510 (53%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 271 / 510 (53%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 510 / 510 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 510 / 510 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 510 / 510 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 510 / 510 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 510 / 510 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 510 / 510 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 505 / 510 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 503 / 510 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 510 / 510 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 510 / 510 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 300 / 510 (59%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 510 / 510 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 300 / 510 (59%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 300 / 510 (59%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 510 / 510 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 510 / 510 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 510 / 510 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 510 / 510 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 510 / 510 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | V12 agMean           | 271 |  🟢  |    -0.094 |    +0.301 |      -0.100 |      +0.049 |  0.480 |
|    2 | wd contribFor        | 510 |      |    -0.090 |    -0.113 |      -0.096 |      -0.110 |  0.472 |
|    3 | provenTotal          | 510 |      |    -0.083 |    +0.011 |      -0.091 |      -0.073 |  0.472 |
|    4 | provenFor            | 510 |      |    -0.076 |    -0.002 |      -0.090 |      -0.098 |  0.475 |
|    5 | wd forCount          | 510 |      |    -0.074 |    +0.014 |      -0.088 |      -0.075 |  0.465 |
|    6 | hcMargin             | 510 |      |    -0.055 |    +0.106 |      -0.078 |      -0.008 |  0.500 |
|    7 | V12 forCount         | 271 |  🟢  |    -0.045 |    +0.198 |      -0.077 |      +0.008 |  0.511 |
|    8 | wd forAvgSize        | 510 |      |    -0.051 |    -0.045 |      -0.072 |      -0.070 |  0.508 |
|    9 | agsV12               | 271 |  🟢  |    +0.067 |    +0.030 |      +0.070 |      +0.059 |  0.527 |
|   10 | countMargin          | 271 |      |    -0.036 |    +0.131 |      -0.070 |      -0.034 |  0.489 |
|   11 | provenAg             | 510 |      |    -0.068 |    +0.175 |      -0.066 |      +0.059 |  0.476 |
|   12 | wd contribAg         | 510 |      |    -0.058 |    +0.139 |      -0.064 |      +0.049 |  0.488 |
|   13 | wd contribMargin     | 510 |      |    -0.059 |    -0.192 |      -0.062 |      -0.133 |  0.466 |
|   14 | wd sizeMargin        | 300 |      |    -0.033 |    -0.087 |      -0.060 |      -0.090 |  0.488 |
|   15 | wd maxShare          | 510 |      |    +0.054 |    +0.003 |      +0.060 |      +0.054 |  0.542 |
|   16 | provenMargin         | 510 |      |    -0.035 |    -0.015 |      -0.053 |      -0.081 |  0.493 |
|   17 | wd agCount           | 300 |      |    -0.031 |    +0.281 |      -0.041 |      +0.101 |  0.507 |
|   18 | ags (v11)            | 510 |      |    -0.009 |    -0.117 |      -0.035 |      -0.142 |  0.495 |
|   19 | wd maxForContrib     | 510 |      |    -0.022 |    -0.094 |      -0.026 |      -0.058 |  0.506 |
|   20 | V12 agCount          | 271 |  🟢  |    -0.020 |    +0.128 |      -0.021 |      +0.063 |  0.514 |
|   21 | peakStars            | 510 |      |    -0.013 |    +0.108 |      -0.020 |      +0.009 |  0.487 |
|   22 | clv                  | 503 |      |    +0.049 |    +0.018 |      +0.017 |      +0.046 |  0.546 |
|   23 | qMargin              | 271 |  🟢  |    +0.022 |    +0.012 |      +0.016 |      +0.010 |  0.506 |
|   24 | lockPinnProb         | 505 |      |    +0.133 |    +0.167 |      +0.015 |      -0.126 |  0.572 |
|   25 | wd agAvgSize         | 300 |      |    -0.031 |    -0.007 |      -0.014 |      -0.020 |  0.490 |
|   26 | V12 forMean          | 271 |  🟢  |    -0.000 |    -0.025 |      -0.007 |      -0.023 |  0.492 |

> **Top 3 univariate features by PnL correlation:** `V12 agMean` (r = -0.100), `wd contribFor` (r = -0.096), `provenTotal` (r = -0.091).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd contribFor` — r(unit-ret) = -0.096, AUC = 0.472. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `V12 agMean` · r(unit-ret) = -0.100 · AUC = 0.480

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.000 … 0.000            | 225 | 126-99  |   56.0% |     +2.0% |
| MID (p33–p67)     | —                        |   0 | 0-0     |       — |         — |
| HIGH (> p67)      | 2.350 … 14.121           |  46 | 22-24   |   47.8% |    -11.2% |

#### `wd contribFor` · r(unit-ret) = -0.096 · AUC = 0.472

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 49.800 … 53.800          | 170 | 88-82   |   51.8% |     -0.8% |
| MID (p33–p67)     | 89.000 … 77.800          | 171 | 112-59  |   65.5% |     +9.2% |
| HIGH (> p67)      | 212.200 … 144.100        | 169 | 75-94   |   44.4% |     -8.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `provenTotal` · r(unit-ret) = -0.091 · AUC = 0.472

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 2.000 … 1.000            | 253 | 140-113 |   55.3% |     +1.8% |
| MID (p33–p67)     | 3.000 … 3.000            | 105 | 59-46   |   56.2% |     +1.7% |
| HIGH (> p67)      | 13.000 … 5.000           | 152 | 76-76   |   50.0% |     -3.8% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `provenFor` · r(unit-ret) = -0.090 · AUC = 0.475

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 200 | 109-91  |   54.5% |     +1.7% |
| MID (p33–p67)     | 2.000 … 2.000            | 154 | 92-62   |   59.7% |     +5.4% |
| HIGH (> p67)      | 10.000 … 3.000           | 156 | 74-82   |   47.4% |     -6.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd forCount` · r(unit-ret) = -0.088 · AUC = 0.465

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 175 | 98-77   |   56.0% |     +3.1% |
| MID (p33–p67)     | 3.000 … 3.000            | 248 | 136-112 |   54.8% |     +0.6% |
| HIGH (> p67)      | 4.000 … 6.000            |  87 | 41-46   |   47.1% |     -7.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | V12 agMean     | wd contribFor  | provenTotal    | provenFor      | wd forCount    | hcMargin       | V12 forCount   | wd forAvgSize  |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| V12 agMean  |  1.000         |         +0.537 |         +0.623 |         +0.485 |         +0.450 |         +0.342 |         +0.433 |         +0.405 |
| wd contribFor |         +0.537 |  1.000         |         +0.857 |         +0.900 |         +0.945 |         +0.624 |         +0.933 |         +0.442 |
| provenTotal |         +0.623 |         +0.857 |  1.000         |         +0.920 |         +0.846 |         +0.532 |         +0.831 |         +0.380 |
| provenFor   |         +0.485 |         +0.900 |         +0.920 |  1.000         |         +0.924 |         +0.639 |         +0.915 |         +0.371 |
| wd forCount |         +0.450 |         +0.945 |         +0.846 |         +0.924 |  1.000         |         +0.579 |         +0.977 |         +0.394 |
| hcMargin    |         +0.342 |         +0.624 |         +0.532 |         +0.639 |         +0.579 |  1.000         |         +0.592 |         +0.439 |
| V12 forCount |         +0.433 |         +0.933 |         +0.831 |         +0.915 |         +0.977 |         +0.592 |  1.000         |         +0.383 |
| wd forAvgSize |         +0.405 |         +0.442 |         +0.380 |         +0.371 |         +0.394 |         +0.439 |         +0.383 |  1.000         |

> 🔴 **Strong collinearity detected:** `wd forCount` and `V12 forCount` have r = +0.977. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 271 picks · features = 8 (+ intercept) · multiple R² = **0.0165** · adjusted R² = **-0.0175** · residual sd = 0.959

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | V12 forCount         |  🟢 |    -0.2462 |   0.2829 | -0.87        |        1 |
|    2 | wd forCount          |     |    +0.2454 |   0.3246 | +0.76        |        2 |
|    3 | V12 agMean           |  🟢 |    -0.0737 |   0.0831 | -0.89        |        3 |
|    4 | wd contribFor        |     |    -0.0729 |   0.2061 | -0.35        |        4 |
|    5 | provenFor            |     |    +0.0506 |   0.2354 | +0.22        |        5 |
|    6 | wd forAvgSize        |     |    -0.0273 |   0.0695 | -0.39        |        6 |
|    7 | hcMargin             |     |    -0.0231 |   0.0846 | -0.27        |        7 |
|    8 | provenTotal          |     |    +0.0126 |   0.1826 | +0.07        |        8 |
| —    | (intercept)          |     |    +0.0232 |   0.0583 |    +0.40 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forCount` (β = -0.246), `V12 agMean` (β = -0.074)
- V12 IGNORES: `wd forCount` (β = +0.245, t = +0.76), `wd contribFor` (β = -0.073, t = -0.35), `provenFor` (β = +0.051, t = +0.22), `wd forAvgSize` (β = -0.027, t = -0.39), `hcMargin` (β = -0.023, t = -0.27), `provenTotal` (β = +0.013, t = +0.07)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.527 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.492 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> ⚠ **AUC gap = -0.035** (multivariate WORSE than V12 alone). Likely overfitting noise — V12's simpler form is genuinely better. Don't add features.

### 17G — Actionable recommendations

- Adjusted R² of -0.0175 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*