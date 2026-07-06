# AGS-Unified — V12 Performance Monitor

**Generated:** Monday, July 6, 2026 at 12:01 PM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 36

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, stake calibration, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (36 days ago), V12 has evaluated **1112** picks, shipped **378** for real money (34.0% ship rate), and muted the other **734**. On the shipped picks V12 has gone **211-167** (55.8% win), staked **1009.25u**, and returned **+54.21u** at **+5.4% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             36 |
| Picks V12 has evaluated             |                           1112 |
| Picks SHIPPED (units > 0)           |                            378 |
| Picks MUTED (score ≤ 0, FADE)       |                            734 |
| Ship rate                           |                          34.0% |
| Live W-L                            |                        211-167 |
| Live Win %                          |                          55.8% |
| Live PnL (units)                    |                         +54.21 |
| Live ROI                            |                          +5.4% |
| Avg PnL / day                       |                         +1.51u |
| Most recent action (2026-07-09)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **5.4% ROI** across 378 live picks (+54.21u real PnL).
- Mute rule is **saving money** — the 455 muted picks would have lost -53.05u at flat 1u (-11.7% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.51u/day** on average since launch.
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
| v12     | 06-01 → present      |   36 |    378 | 455 | 211-167 |  55.8% |      5.4% |     +54.21 |    +0.14 | 0.515 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  318 |    +2.5pp |    +14.3pp |          +0.316 |   -0.034 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  316 |    +7.4pp |    +24.1pp |          +0.457 |   +0.121 |    +0.0306 | 🟢 better |
| v12 − v11          | +  267 |    +0.9pp |     +2.5pp |          +0.083 |   +0.071 |    +0.0144 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | All           |
|---------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | 111n 55.0% +3% |
| v12     | 333n 54.7% +2% | 10n 30.0% +29% | 6n 83.3% +38%  | 29n 72.4% +26% | 378n 55.8% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 85n -1%       | 114n +4%      | 73n +22%      | 49n +7%       | 52n +6%       | 🟡 partial (0) |

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
| 2026-06-29 |        36 |    5 |    16 | 4-1        |  80.0% |     20.00 |      +7.40 |     37.0% |     +32.67 |
| 2026-06-30 |        48 |   17 |    14 | 12-5       |  70.6% |     56.00 |     +17.10 |     30.5% |     +49.77 |
| 2026-07-01 |        41 |   12 |    15 | 5-7        |  41.7% |     40.50 |     -11.56 |    -28.5% |     +38.21 |
| 2026-07-02 |        40 |   11 |    13 | 5-6        |  45.5% |     38.50 |      -6.89 |    -17.9% |     +31.32 |
| 2026-07-03 |        31 |   12 |    11 | 8-4        |  66.7% |     46.50 |     +16.11 |     34.6% |     +47.43 |
| 2026-07-04 |        36 |   12 |    12 | 8-4        |  66.7% |     49.50 |      +6.34 |     12.8% |     +53.77 |
| 2026-07-05 |        26 |   12 |     9 | 6-6        |  50.0% |     37.00 |      +0.44 |      1.2% |     +54.21 |
| 2026-07-06 |        14 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +54.21 |
| 2026-07-07 |         3 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +54.21 |
| 2026-07-09 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +54.21 |

> **Bottom line.** 36 days live, 378 live picks shipped, **+54.21u total PnL** at **+5.4% ROI**, averaging **+1.51u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u | 124 | 49-36  |  57.6% |        +0.989 |    5.00u |            4.08u | -0.92u |      346.50 |      -2.35 |     -0.7% |
| PREMIUM  |  3.00u | 185 | 64-50  |  56.1% |        +0.971 |    3.00u |            3.22u | +0.22u |      367.00 |     +15.09 |      4.1% |
| LOCK     |  1.00u | 125 | 38-35  |  52.1% |        +0.940 |    1.00u |            1.70u | +0.70u |      124.00 |     +27.26 |     22.0% |
| LEAN     |  0.50u |  92 | 30-19  |  61.2% |        +0.837 |    0.50u |            1.68u | +1.18u |       82.50 |      +6.04 |      7.3% |
| WEAK     |  0.25u | 110 | 27-25  |  51.9% |        +0.421 |    0.25u |            1.59u | +1.34u |       82.50 |      +5.35 |      6.5% |
| FADE     |  0.00u | 191 | 0-0    |      — |        -0.182 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `-2` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### v12abc — By Stake Tier (HC margin + 2-for-0 rescue + proven-$ overlay)

Post-cutover picks size off the **HC margin** — SUPER (margin 2 · 6u), TOP (margin 1 · 4u), MINI (mini-HC 1.0–1.5× · 3u), CONFIRMED (margin 3+ · 1u) — **plus** the **RANK (2-for-0)** wallet-rescue path at **4u**. From **2026-06-26** the **v12abc proven-$ overlay** (internal stats: backer `positions.dollarRoi` + featured `picks.wr`) adds: **SHARP / SHARP-PRIME** ($-rescue of HC-muted picks at 3u / 4u when ≥2 sharps back it incl. a proven-money winner and mean win-rate ≥ 50 / 55), **TOP+** (HC-1 boosted 4u → 5u when a proven-$ backer is present), and **MINI-** (MINI cut 3u → 1u when no proven-$ backer is on it). Together these paths ARE the v12abc staked book. **MONITORING** (non-HC or WEAK-tier HC, no proven-$ rescue) is tracked at **0u** and excluded from the staked record/ROI below.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |   9 | 7-2    |  77.8% |       46.00 |     +16.87 |     36.7% |
| TOP PICK (TOP+/TOP)       |  4-5u |  50 | 31-19  |  62.0% |      208.50 |      +6.87 |      3.3% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP) |  3-4u |  54 | 31-23  |  57.4% |      189.00 |     +19.58 |     10.4% |
| STRONG (MINI)             |    3u |  33 | 16-17  |  48.5% |       96.00 |      -8.43 |     -8.8% |
| LEAN (CONFIRMED/MINI-)    |    1u |  13 | 7-6    |  53.8% |       13.00 |      -0.93 |     -7.2% |
| **STAKED TOTAL** |     — | 159 | 92-67  |  57.9% |      552.50 |     +33.96 |     +6.1% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| HC-2 (model max)      | SUPER       |    6u |   9 | 7-2    |  77.8% |       46.00 |     +16.87 |     36.7% |
| HC-1 + $-boost        | TOP+        |    5u |  22 | 11-11  |  50.0% |      102.50 |     -12.31 |    -12.0% |
| HC-1 (model)          | TOP         |    4u |  28 | 20-8   |  71.4% |      106.00 |     +19.18 |     18.1% |
| 2-for-0 rescue        | RANK        |    4u |  32 | 20-12  |  62.5% |      126.00 |     +18.90 |     15.0% |
| proven-$ prime        | SHARP-PRIME |    4u |   7 | 4-3    |  57.1% |       24.00 |      +5.67 |     23.6% |
| proven-$ consensus    | SHARP       |    3u |  15 | 7-8    |  46.7% |       39.00 |      -4.99 |    -12.8% |
| mini-HC (gate-pass)   | MINI        |    3u |  33 | 16-17  |  48.5% |       96.00 |      -8.43 |     -8.8% |
| mini gate-cut         | MINI-       |    1u |   8 | 5-3    |  62.5% |        8.00 |      +1.09 |     13.6% |
| margin 3+             | CONFIRMED   |    1u |   5 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |

> **MONITORING volume:** 263 picks tracked at 0u (would-be 122-141, 46.4% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### § 5b — Path Trajectory & Stake-Size Monitor (win% & PnL over time)

**This is the over-time stake-size monitor.** Two charts, one line per staking tier: **cumulative PnL (units)** and **cumulative win rate (%)** across the live timeline. Read the PnL chart for "is this path making money at its current size, and is the slope still up?" — a line sloping *down* is over-staked for what it's returning. Read the win-rate chart for "is its hit-rate holding or decaying?" Pair this with the point-in-time over/under verdicts in § 7. Only tiers with graded action on ≥2 distinct days are charted.

**Lines:** 🔵 MAX PLAY (7-2, +16.87u)  ·  🟢 TOP PICK (31-19, +6.87u)  ·  🟠 SHARP PLAY (31-23, +19.58u)  ·  🔴 STRONG (16-17, -8.43u)  ·  🟣 LEAN (7-6, -0.93u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05"]
    y-axis "PnL (u)" -14 --> 26
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54]
```

### Sizing pipeline integrity

🟡 **393 shipped picks differ from the legacy score-ladder target by > ±0.05u.** Expected once the HC-margin/v12abc ladder diverges from the old score-band ladder — this is informational, not a bug. Watch for a sudden spike (would indicate a real `unitsFromAgsV12` regression in `syncPickStateAuthoritative.js`).

## § 5a — RANK-RESCUE Slice (2-for-0 wallet path · v12ab book)

> **What this is.** `v12ab` = the v12a book (HC-margin sizing) **plus** the RANK-RESCUE staking path that went live **2026-06-21**. The rule: a v12-shipped pick (score > 0) that the HC sizer mutes to 0u is staked at **4u** when its FOR side is **2-for-0** — ≥2 eligible whitelist wallets backing (CONFIRMED/FLAT/WR50 with ≥8 settled in-sport picks) and 0 against. It **only rescues muted picks**; it never up-sizes a pick the HC ladder already staked.

### (B) Reconstruction over the V12 era (2026-06-01 → today)

> Re-derived from frozen `walletDetails` + **current** wallet profiles. Eligibility uses today's settled-pick counts, so this is a **mildly optimistic projection** (a wallet at ≥8 picks now may have had fewer at pick time). Live-stamped numbers in (A) are the ground truth.

| Bucket | Picks | W-L | Win % | Stake | PnL | ROI | Per day |
|--------|------:|:---:|:-----:|------:|----:|----:|--------:|
| RANK-RESCUE (HC-muted → 4u) | 60 | 37-23 | 61.7% | 240u | +39.54u | +16.5% | 1.67 |

**2-for-0 picks the HC ladder ALREADY staked (NOT rescued — no hammer): 59** (38-21). These are left at their HC size — the slice adds no edge inside the HC book.

#### RANK-RESCUE by sport (reconstructed)

| Sport | Picks | W-L | Win % | PnL @4u | ROI |
|-------|------:|:---:|:-----:|------:|----:|
| MLB | 56 | 36-20 | 64.3% | +42.94u | +19.2% |
| NBA | 1 | 0-1 | 0.0% | -4.00u | -100.0% |
| NHL | 2 | 1-1 | 50.0% | +4.60u | +57.5% |
| SOC | 1 | 0-1 | 0.0% | -4.00u | -100.0% |

### (A) Live stamped RANK picks (ground truth — populates going forward)

| Picks | W-L | Win % | Stake | PnL | ROI |
|------:|:---:|:-----:|------:|----:|----:|
| 32 | 20-12 | 62.5% | 126u | +18.90u | +15.0% |

| Date | Sport | Matchup | Side | Odds | Result | PnL |
|------|-------|---------|------|-----:|:------:|----:|
| 2026-07-04 | MLB | Pittsburgh Pirates@Washington Nationals | Under 10.5 | -110 | WIN | +3.64u |
| 2026-07-04 | MLB | Miami Marlins@Athletics | Miami Marlins | -136 | WIN | +2.94u |
| 2026-07-03 | MLB | Tampa Bay Rays@Houston Astros | Under 9 | -109 | WIN | +3.67u |
| 2026-07-03 | MLB | Milwaukee Brewers@Arizona Diamondbacks | Over 9.5 | -111 | WIN | +3.60u |
| 2026-07-02 | MLB | Pittsburgh Pirates@Philadelphia Phillies | Over 9.5 | -110 | LOSS | -4.00u |
| 2026-07-02 | MLB | Cincinnati Reds@Milwaukee Brewers | Under 6.5 | -103 | LOSS | -4.00u |
| 2026-07-02 | MLB | Miami Marlins@Colorado Rockies | Miami Marlins | -135 | LOSS | -4.00u |
| 2026-07-01 | MLB | Washington Nationals@Boston Red Sox | Under 9.5 | -103 | LOSS | -4.00u |
| 2026-07-01 | MLB | Minnesota Twins@Houston Astros | Minnesota Twins | 122 | WIN | +4.88u |
| 2026-06-30 | MLB | St. Louis Cardinals@Atlanta Braves | St. Louis Cardinals | -163 | WIN | +2.45u |
| 2026-06-30 | SOC | Norway@Côte d'Ivoire | Norway | 115 | WIN | +4.60u |
| 2026-06-30 | MLB | Texas Rangers@Cleveland Guardians | Cleveland Guardians | 110 | LOSS | -4.00u |
| 2026-06-30 | MLB | Chicago White Sox@Baltimore Orioles | Chicago White Sox | 125 | WIN | +5.00u |
| 2026-06-29 | MLB | San Francisco Giants@Arizona Diamondbacks | Arizona Diamondbacks | -131 | WIN | +3.05u |
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

### Incremental impact

> RANK-RESCUE sits **on top of the v12a HC book** — it stakes 4u on picks the HC ladder would mute (0u), so every rescue is net-new volume, never an up-size. Reconstruction: **+1.67 picks/day** (60 over 36 days) at **+16.5% ROI** / **+39.54u**, pulled from the muted pool — so no existing HC pick's size or grade changes. (The § 1 / § 4–5 headline book still reflects historical score-ladder sizing for picks shipped before v12a; only NEW picks size under v12a + RANK.)

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 179n · 54.7% · +4.9%   | 32n · 56.3% · -3.6%    | 122n · 54.1% · +1.1%   | 333n · 54.7% · +2.4%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 29n · 72.4% · +26.4%   | —                      | —                      | 29n · 72.4% · +26.4%   |
| **All** | **215n · 56.3% · +8.5%** | **36n · 58.3% · +3.4%** | **127n · 54.3% · +1.8%** | **378n · 55.8% · +5.4%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Stake Calibration (are any paths over- or under-sized?)

Each path ships at a **fixed unit size**. This section asks the sizing question directly: **for the units we're risking on each path, is the realized PnL justifying that size?** A path staked at 6u that loses money is far more dangerous than a 1u path with the same win-rate, because every loss costs 6× as much. The read is simple:

- **Avg PnL / pick** is the single most important column — it's the average units won or lost *every time that path fires*, already accounting for both win-rate and stake size. Negative = that path is bleeding at its current size.
- **Recent vs all-time ROI** (last 7 days) is the over-time monitor: a path whose recent ROI is collapsing below its all-time ROI is degrading *now*, before the cumulative line in § 5b bends.
- **Verdict** flags paths to cut (over-sized + losing) or paths with room to grow (small size + strongly earning).

| Path                  | Units | N   | W-L    | Win %  | ROI       | PnL (u)    | Avg PnL/pick | Recent ROI (7d) | Verdict                 |
|-----------------------|-------|-----|--------|--------|-----------|------------|--------------|-----------------|-------------------------|
| HC-2 (model max)      |    6u |   9 | 7-2    |  77.8% |    +36.7% |     +16.87 |       +1.87u |          +30.0% | 🟢 earning — size OK    |
| HC-1 + $-boost        |    5u |  22 | 11-11  |  50.0% |    -12.0% |     -12.31 |       -0.56u |          -15.5% | 🟠 bleeding — watch     |
| HC-1 (model)          |    4u |  28 | 20-8   |  71.4% |    +18.1% |     +19.18 |       +0.68u |          +23.8% | 🟢 earning — size OK    |
| 2-for-0 rescue        |    4u |  32 | 20-12  |  62.5% |    +15.0% |     +18.90 |       +0.59u |          +17.1% | 🟢 earning — size OK    |
| proven-$ prime        |    4u |   7 | 4-3    |  57.1% |    +23.6% |      +5.67 |       +0.81u |          +54.6% | 🟢 earning — size OK    |
| proven-$ consensus    |    3u |  15 | 7-8    |  46.7% |    -12.8% |      -4.99 |       -0.33u |          -13.6% | 🟠 bleeding — watch     |
| mini-HC (gate-pass)   |    3u |  33 | 16-17  |  48.5% |     -8.8% |      -8.43 |       -0.26u |           +2.7% | 🟠 bleeding — watch     |
| mini gate-cut         |    1u |   8 | 5-3    |  62.5% |    +13.6% |      +1.09 |       +0.14u |          +29.9% | 🟢 earning — size OK    |
| margin 3+             |    1u |   5 | 2-3    |  40.0% |    -40.4% |      -2.02 |       -0.40u |          -25.5% | ⚪ thin — hold           |

Avg PnL per pick by path — bars below 0 are paths losing money at their current stake:

```mermaid
xychart-beta
    title "Avg PnL per pick by path (u, ≥3 graded)"
    x-axis ["SUPER", "TOP+", "TOP", "RANK", "SHARP-PRIME", "SHARP", "MINI", "MINI-", "CONFIRMED"]
    y-axis "u / pick" -2 --> 3
    bar [1.87, -0.56, 0.68, 0.59, 0.81, -0.33, -0.26, 0.14, -0.4]
```

> **Over-time view:** § 5b charts each tier's cumulative PnL and win% across the full timeline — use it to confirm whether a "bleeding" verdict here is a genuine downtrend or just a rough patch. A path that's over-sized **and** trending down in § 5b is the one to resize first.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **455** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  455 |
| Muted W-L                           |              213-242 |
| Muted Win %                         |                46.8% |
| Counterfactual PnL at flat 1u       |               -53.05 |
| Counterfactual ROI at flat 1u       |               -11.7% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-53.05u** at a flat 1u stake — a counterfactual ROI of **-11.7%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — v12abc AUC / Brier (by staking book)

The score that drives every pick is the same V12 number; the **a / ab / abc** books differ only in *which picks they choose to stake*. This panel asks, for the picks each book actually ships: does the V12 score still **discriminate** winners from losers (AUC), and is it **calibrated** (Brier)? If a newer overlay (ab adds RANK; abc adds the proven-$ rescues) drags AUC/Brier down, it's buying volume at the cost of signal quality.

- **AUC** — P(score of a winner > score of a loser). 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong.
- **Brier (cal)** — mean squared error of a win probability obtained by an **in-sample** logistic calibration of the score. Lower = better; 0.25 = the coin-flip prior.
- **Brier (market)** — same metric on the closing-odds implied probability, as a benchmark. **Δ = market − model**; positive means V12 is better-calibrated than the market.

| Book                         | Graded N | W-L    | Win %  | AUC    | Brier (cal) | Brier (market) | Δ vs market |
|------------------------------|----------|--------|--------|--------|-------------|----------------|-------------|
| v12a (HC margin core)        |      105 | 61-44  |  58.1% |  0.504 |      0.2428 |         0.2363 |     -0.0066 |
| v12ab (+ RANK 2-for-0)       |      137 | 81-56  |  59.1% |  0.459 |      0.2414 |         0.2363 |     -0.0050 |
| v12abc (+ proven-$ rescue)   |      159 | 92-67  |  57.9% |  0.484 |      0.2438 |         0.2395 |     -0.0043 |

> 🟢 **The overlays are signal-neutral** — AUC 0.504 (v12a) → 0.484 (v12abc), Δ = -0.020. They add volume without degrading how well the score separates winners from losers.

> ⚠ **In-sample caveat.** Brier (cal) uses a logistic fit on the same picks it scores, so it's a mildly optimistic floor on true calibration error. AUC is rank-based and needs no fit. Track both week-over-week — a rising Brier or an AUC drifting toward 0.50 is the early warning that the score is decaying before ROI follows.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 808 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +21.104 |                        2.2 |
| AGAINST |             +3.533 |                        1.2 |

### One-sided wallet support (high-variance picks)

- **56** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **2** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **24-19** (55.8% win) at **-4.7% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   0 |   1 |   2 |   3 |  12 |
| AGAINST |   0 |   0 |   1 |   2 |   8 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | Score    | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|----------|-------|---------|------------|
| 2026-07-05 | MLB   | ML     | Boston Red Sox          |  -154 | +0.933 | MINI-    | LOCK     | 1.00u | WIN     |      +0.65 |
| 2026-07-05 | MLB   | ML     | New York Yankees        |  -131 | +0.984 | HC-1     | PREMIUM  | 4.00u | LOSS    |      -4.00 |
| 2026-07-05 | MLB   | ML     | Atlanta Braves          |  -105 | +0.800 | HC-1+$   | LEAN     | 5.00u | LOSS    |      -5.00 |
| 2026-07-05 | MLB   | ML     | Chicago Cubs            |  -142 | +0.978 | HC-1     | PREMIUM  | 4.00u | WIN     |      +2.82 |
| 2026-07-05 | MLB   | ML     | Tampa Bay Rays          |  +103 | +0.978 | SHARP+   | PREMIUM  | 2.50u | LOSS    |      -2.50 |
| 2026-07-05 | SOC   | ML     | England                 |  +155 | +0.120 | SHARP    | WEAK     | 1.50u | WIN     |      +2.33 |
| 2026-07-05 | SOC   | ML     | Brazil                  |  -130 | +0.692 | CONF     | LEAN     | 1.00u | LOSS    |      -1.00 |
| 2026-07-05 | MLB   | SPREAD | San Diego Padres        |  -105 | +0.989 | HC-2     | ELITE    | 6.00u | WIN     |      +5.71 |
| 2026-07-05 | MLB   | TOTAL  | Over 9.5                |  -111 | +0.981 | MINI-    | PREMIUM  | 1.00u | LOSS    |      -1.00 |
| 2026-07-05 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.986 | MINI     | ELITE    | 3.00u | WIN     |      +2.73 |
| 2026-07-05 | MLB   | TOTAL  | Over 10.5               |  -106 | +0.967 | HC-1     | PREMIUM  | 4.00u | LOSS    |      -4.00 |
| 2026-07-05 | MLB   | TOTAL  | Under 8.5               |  -108 | +0.978 | SHARP+   | PREMIUM  | 4.00u | WIN     |      +3.70 |
| 2026-07-04 | MLB   | ML     | Baltimore Orioles       |  +109 | +0.975 | HC-1+$   | PREMIUM  | 2.50u | WIN     |      +2.73 |
| 2026-07-04 | MLB   | ML     | Miami Marlins           |  -136 | +0.357 | 2-for-0  | WEAK     | 4.00u | WIN     |      +2.94 |
| 2026-07-04 | MLB   | ML     | Milwaukee Brewers       |  -149 | +0.989 | HC-1+$   | ELITE    | 5.00u | LOSS    |      -5.00 |
| 2026-07-04 | SOC   | ML     | France                  |  -525 | +0.991 | HC-2     | ELITE    | 6.00u | WIN     |      +1.14 |
| 2026-07-04 | SOC   | ML     | Morocco                 |  -120 | +0.263 | SHARP    | WEAK     | 3.00u | WIN     |      +2.50 |
| 2026-07-04 | MLB   | SPREAD | Baltimore Orioles       |  -192 | +0.984 | HC-1     | ELITE    | 4.00u | WIN     |      +2.08 |
| 2026-07-04 | MLB   | SPREAD | New York Mets           |  -143 | +0.983 | HC-1     | PREMIUM  | 4.00u | LOSS    |      -4.00 |
| 2026-07-04 | MLB   | TOTAL  | Under 8.5               |  -107 | +0.716 | HC-1+$   | LEAN     | 5.00u | WIN     |      +4.67 |
| 2026-07-04 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.990 | HC-1     | ELITE    | 4.00u | WIN     |      +3.64 |
| 2026-07-04 | MLB   | TOTAL  | Under 10.5              |  -110 | +0.964 | 2-for-0  | PREMIUM  | 4.00u | WIN     |      +3.64 |
| 2026-07-04 | MLB   | TOTAL  | Over 12.5               |  +101 | +0.983 | HC-1+$   | PREMIUM  | 5.00u | LOSS    |      -5.00 |
| 2026-07-04 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.128 | SHARP    | WEAK     | 3.00u | LOSS    |      -3.00 |
| 2026-07-03 | MLB   | ML     | Milwaukee Brewers       |  -146 | +0.991 | MINI-    | ELITE    | 1.00u | WIN     |      +0.68 |
| 2026-07-03 | MLB   | ML     | Washington Nationals    |  -148 | +0.963 | HC-1+$   | PREMIUM  | 5.00u | WIN     |      +3.38 |
| 2026-07-03 | MLB   | ML     | Tampa Bay Rays          |  -108 | +0.973 | HC-1+$   | PREMIUM  | 5.00u | WIN     |      +4.63 |
| 2026-07-03 | SOC   | ML     | Argentina               |  -650 | +0.992 | CONF     | ELITE    | 1.00u | LOSS    |      -1.00 |
| 2026-07-03 | SOC   | ML     | Egypt                   |  +140 | +0.510 | SHARP    | WEAK     | 2.50u | LOSS    |      -2.50 |
| 2026-07-03 | SOC   | ML     | Colombia                |  -235 | +0.989 | HC-2     | ELITE    | 6.00u | WIN     |      +2.55 |

## § 12 — Trust the Process: Predictive Edge Over Time

> **What this whole section is for.** Win-rate and ROI (everything above) tell you whether V12 *made money*. This section tells you whether it made money because the score is **real signal** or because we got **lucky**. That distinction is the entire game: real signal repeats, luck doesn't. Everything below answers three questions, in order.

1. **Does the score separate winners from losers?** (12A–12C, plus 12E per sport) — If we line up every pick by its V12 score, do the higher-scored picks actually win more? We measure this several independent ways so no single metric can fool us. 12D is a population sanity check (is the score spread normal, or are a few outliers doing all the work?).
2. **Is that edge stable, or is it decaying?** (12F) — A score can be predictive overall but quietly losing its edge. We track the same separation on a moving window so we see decay *as it happens*.
3. **Is the edge real or just small-sample luck?** (12G) — We resample the picks thousands of times to get an honest confidence band. If the band straddles "break-even," we don't have proof yet — we have a hopeful trend.

> **The one number to watch:** **AUC**. Read it as "*pick a random winner and a random loser — what's the chance V12 scored the winner higher?*" 0.50 = coin-flip (no signal). 0.55 = a real, usable edge. 0.60+ = strong. If rolling AUC (12F) drifts under 0.50, the score has stopped working and the ROI line is about to follow it down.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.509 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.071 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.008 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.002 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.036 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟠 **Random** — score is not predicting outcomes; PnL is variance, not edge

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  373 |    +0.1000 |    -0.0443 | 0.0005 |  +0.022 |   0.951 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  373 |    +0.0848 |    +0.4835 | 0.0013 |  +0.036 |   0.496 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  373 |    -0.0626 |    +0.1924 | 0.0000 |  -0.005 |   2.858 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 373 |          +0.001 |           -0.003 |                   -0.012 |                   -0.018 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 373 |          -0.031 |           +0.337 |                   -0.012 |                   +0.095 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 373 |          +0.046 |           +0.305 |                   +0.016 |                   +0.063 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 373 |          -0.009 |           +0.142 |                   +0.029 |                   +0.088 | count of contributing AGAINST-side wallets                     |
| provenFor         | 373 |          +0.047 |           +0.309 |                   +0.021 |                   +0.079 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 373 |          -0.003 |           +0.147 |                   +0.021 |                   +0.060 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 6.991          | 128 | 74-54   |   57.8% |     +4.9% |
| MID (p33–p67)     | 19.950 … 22.500        | 121 | 67-54   |   55.4% |     +1.8% |
| HIGH (> p67)      | 48.906 … 34.161        | 124 | 67-57   |   54.0% |     -0.4% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       373 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8739 | average score across live picks                                 |
| SD                |    0.2130 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.362 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +4.689 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.530 / +0.964 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  329 | 180-149 |   54.7% |     +2.2% |  0.485 |        -0.040 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   28 | 20-8   |   71.4% |    +26.1% |  0.525 |        -0.199 | noise                                     |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05"]
    y-axis "AUC" 0.4 --> 0.7
    line [0.484, 0.514, 0.56, 0.655, 0.621, 0.597, 0.576, 0.487, 0.481, 0.475, 0.435, 0.465, 0.439, 0.453]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05"]
    y-axis "edge (pp)" -8 --> 9
    line [8, 5, 2.4, -3.2, -5.2, -6.2, -3.6, -4.2, 4.4, 2.9, 2.6, 4.7, 6.4, 5.1]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-06-22 |    7 |   33 | 21-12  |   63.6% |    +14.7% |  0.484 |      +8.0pp |
| 2026-06-23 |    7 |   30 | 18-12  |   60.0% |     +8.9% |  0.514 |      +5.0pp |
| 2026-06-24 |    7 |   31 | 18-13  |   58.1% |     +6.9% |  0.560 |      +2.4pp |
| 2026-06-25 |    7 |   32 | 17-15  |   53.1% |     -1.9% |  0.655 |      -3.2pp |
| 2026-06-26 |    7 |   35 | 18-17  |   51.4% |     -3.1% |  0.621 |      -5.2pp |
| 2026-06-27 |    7 |   43 | 22-21  |   51.2% |     -3.4% |  0.597 |      -6.2pp |
| 2026-06-28 |    7 |   48 | 25-23  |   52.1% |     -4.5% |  0.576 |      -3.6pp |
| 2026-06-29 |    7 |   48 | 25-23  |   52.1% |     -5.1% |  0.487 |      -4.2pp |
| 2026-06-30 |    7 |   62 | 37-25  |   59.7% |     +7.8% |  0.481 |      +4.4pp |
| 2026-07-01 |    7 |   68 | 39-29  |   57.4% |     +2.1% |  0.475 |      +2.9pp |
| 2026-07-02 |    7 |   74 | 42-32  |   56.8% |     +1.1% |  0.435 |      +2.6pp |
| 2026-07-03 |    7 |   78 | 46-32  |   59.0% |     +6.7% |  0.465 |      +4.7pp |
| 2026-07-04 |    7 |   78 | 47-31  |   60.3% |     +8.6% |  0.439 |      +6.4pp |
| 2026-07-05 |    7 |   81 | 48-33  |   59.3% |    +10.0% |  0.453 |      +5.1pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.494 avg in first half → 0.512 avg in second half · Δ = +0.019)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.4% | [-5.4%, +15.7%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          55.8% | [50.4%, 60.9%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.509 | [0.453, 0.567]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             44 | [3, 81]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       378 |
| Unique wallets ever on a FOR side            |                                                       128 |
| Avg FOR-side wallets per pick                |                                                      2.95 |
| Top-5 wallets' share of all FOR appearances  |                                                     35.7% |
| Top-10 wallets' share of all FOR appearances |                                                     51.2% |
| Top-20 wallets' share of all FOR appearances |                                                     67.0% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.8% |     197 | 2026-07-05 |
|    2 | 5b1e50  | MLB,NBA,NHL,SOC |   88 |   57 | 59-29  |   67.0% |    +19.5% |    +58.94 |     1.52× | CONFIRMED   |     +8.7% |     300 | 2026-07-05 |
|    3 | 4c64aa  | MLB        |   84 |    9 | 46-38  |   54.8% |     +3.3% |     +5.21 |     0.87× | WR50        |     -1.2% |     292 | 2026-07-05 |
|    4 | 70135d  | MLB,NBA    |   68 |   67 | 39-29  |   57.4% |    +11.2% |    +17.50 |     1.35× | CONFIRMED   |     -3.3% |     466 | 2026-07-05 |
|    5 | 2f2a9e  | MLB,SOC    |   64 |   25 | 34-30  |   53.1% |     -8.9% |    -15.99 |     2.21× | CONFIRMED   | +Infinity% |     209 | 2026-07-05 |
|    6 | cd2f63  | MLB,NBA,SOC |   47 |   23 | 24-23  |   51.1% |     +9.1% |    +11.95 |     1.66× | CONFIRMED   |    +13.8% |     329 | 2026-07-05 |
|    7 | eeabaf  | MLB,NBA,SOC |   42 |    6 | 23-19  |   54.8% |     +5.5% |     +6.85 |     1.17× | CONFIRMED   |    +20.6% |     143 | 2026-07-04 |
|    8 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|    9 | 7923c4  | MLB,NBA    |   29 |   11 | 18-11  |   62.1% |    +46.6% |    +25.51 |     0.75× | CONFIRMED   |     +8.1% |     148 | 2026-07-04 |
|   10 | 491f30  | MLB,SOC    |   25 |    4 | 17-8   |   68.0% |    +43.8% |    +35.89 |     0.95× | CONFIRMED   |     -5.5% |      58 | 2026-07-01 |
|   11 | 0f9d74  | MLB,NBA,SOC |   25 |   13 | 15-10  |   60.0% |    +16.8% |    +11.86 |     0.62× | CONFIRMED   |    +31.6% |     134 | 2026-07-05 |
|   12 | 4b912c  | MLB,SOC    |   25 |    8 | 15-10  |   60.0% |    +11.9% |    +10.14 |     1.51× | WR50        |    -14.1% |      67 | 2026-07-05 |
|   13 | 9a69c2  | MLB,SOC    |   24 |   42 | 13-11  |   54.2% |    +12.3% |     +6.60 |     2.39× | FLAT        |    -20.4% |     172 | 2026-07-05 |
|   14 | bc44b0  | MLB,NBA,NHL,SOC |   20 |   13 | 11-9   |   55.0% |     +0.3% |     +0.17 |     1.35× | CONFIRMED   |    +17.7% |      90 | 2026-07-05 |
|   15 | c911a4  | MLB,NBA,SOC |   15 |    7 | 8-7    |   53.3% |    +22.0% |     +8.89 |     5.83× | CONFIRMED   |    +51.9% |      65 | 2026-07-05 |
|   16 | ac9705  | MLB        |   15 |    1 | 7-8    |   46.7% |    -10.0% |     -5.94 |     2.26× | CONFIRMED   |    +11.2% |      24 | 2026-07-04 |
|   17 | bc35e3  | MLB,SOC    |   14 |    7 | 9-5    |   64.3% |    +17.3% |     +8.57 |     1.48× | CONFIRMED   |    +12.2% |      73 | 2026-07-04 |
|   18 | 10c684  | MLB,NBA    |   14 |    4 | 4-10   |   28.6% |    -46.0% |     -8.74 |     1.66× | FLAT        |    -15.3% |      36 | 2026-06-28 |
|   19 | ad88a3  | MLB        |   13 |    3 | 7-6    |   53.8% |     -1.1% |     -0.55 |     0.27× | CONFIRMED   |    +13.4% |      37 | 2026-07-04 |
|   20 | c668b3  | MLB,NBA,SOC |   12 |    1 | 9-3    |   75.0% |    +43.1% |    +13.47 |     0.40× | CONFIRMED   |    +40.6% |      51 | 2026-06-30 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   11 | 10-1   |   90.9% |     +77.0% |    +28.48 |     1.28× | 2026-07-05 |
|    2 | a82a75  | MLB,SOC    |   11 | 8-3    |   72.7% |     +51.9% |    +21.29 |     0.47× | 2026-07-05 |
|    3 | 7923c4  | MLB,NBA    |   29 | 18-11  |   62.1% |     +46.6% |    +25.51 |     0.75× | 2026-07-04 |
|    4 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    5 | c668b3  | MLB,NBA,SOC |   12 | 9-3    |   75.0% |     +43.1% |    +13.47 |     0.40× | 2026-06-30 |
|    6 | b839b3  | MLB,NBA,SOC |   11 | 8-3    |   72.7% |     +35.4% |    +13.19 |     1.57× | 2026-07-04 |
|    7 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    8 | c911a4  | MLB,NBA,SOC |   15 | 8-7    |   53.3% |     +22.0% |     +8.89 |     5.83× | 2026-07-05 |
|    9 | 5b1e50  | MLB,NBA,NHL,SOC |   88 | 59-29  |   67.0% |     +19.5% |    +58.94 |     1.52× | 2026-07-05 |
|   10 | bc35e3  | MLB,SOC    |   14 | 9-5    |   64.3% |     +17.3% |     +8.57 |     1.48× | 2026-07-04 |
|   11 | 0f9d74  | MLB,NBA,SOC |   25 | 15-10  |   60.0% |     +16.8% |    +11.86 |     0.62× | 2026-07-05 |
|   12 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|   13 | 9a69c2  | MLB,SOC    |   24 | 13-11  |   54.2% |     +12.3% |     +6.60 |     2.39× | 2026-07-05 |
|   14 | 4b912c  | MLB,SOC    |   25 | 15-10  |   60.0% |     +11.9% |    +10.14 |     1.51× | 2026-07-05 |
|   15 | 70135d  | MLB,NBA    |   68 | 39-29  |   57.4% |     +11.2% |    +17.50 |     1.35× | 2026-07-05 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    3 | ac9705  | MLB        |   15 | 7-8    |   46.7% |     -10.0% |     -5.94 |     2.26× | 2026-07-04 |
|    4 | 2f2a9e  | MLB,SOC    |   64 | 34-30  |   53.1% |      -8.9% |    -15.99 |     2.21× | 2026-07-05 |
|    5 | ad88a3  | MLB        |   13 | 7-6    |   53.8% |      -1.1% |     -0.55 |     0.27× | 2026-07-04 |
|    6 | bc44b0  | MLB,NBA,NHL,SOC |   20 | 11-9   |   55.0% |      +0.3% |     +0.17 |     1.35× | 2026-07-05 |
|    7 | 4c64aa  | MLB        |   84 | 46-38  |   54.8% |      +3.3% |     +5.21 |     0.87× | 2026-07-05 |
|    8 | eeabaf  | MLB,NBA,SOC |   42 | 23-19  |   54.8% |      +5.5% |     +6.85 |     1.17× | 2026-07-04 |
|    9 | cd2f63  | MLB,NBA,SOC |   47 | 24-23  |   51.1% |      +9.1% |    +11.95 |     1.66× | 2026-07-05 |
|   10 | 70135d  | MLB,NBA    |   68 | 39-29  |   57.4% |     +11.2% |    +17.50 |     1.35× | 2026-07-05 |
|   11 | 4b912c  | MLB,SOC    |   25 | 15-10  |   60.0% |     +11.9% |    +10.14 |     1.51× | 2026-07-05 |
|   12 | 9a69c2  | MLB,SOC    |   24 | 13-11  |   54.2% |     +12.3% |     +6.60 |     2.39× | 2026-07-05 |
|   13 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|   14 | 0f9d74  | MLB,NBA,SOC |   25 | 15-10  |   60.0% |     +16.8% |    +11.86 |     0.62× | 2026-07-05 |
|   15 | bc35e3  | MLB,SOC    |   14 | 9-5    |   64.3% |     +17.3% |     +8.57 |     1.48× | 2026-07-04 |

> 🔴 **4 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `10c684` (FOR# 14, ROI -46.0%), `1e8f33` (FOR# 94, ROI -10.7%), `ac9705` (FOR# 15, ROI -10.0%), `2f2a9e` (FOR# 64, ROI -8.9%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   720 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   110 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     6 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    29 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |    10 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   152 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

- **Computed at:** 2026-07-05T14:20:32.763Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 1751
- **Date range:** 2026-04-18 → 2026-07-04

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.984 | ELITE           | 5.00u                  |
| q60      |        +0.961 | PREMIUM         | 3.00u                  |
| q40      |        +0.882 | LOCK            | 1.00u                  |
| q20      |        +0.650 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            152 |        35 |   20 |    7 |   90 |                     62 |
| NBA   |            211 |        58 |   25 |   23 |  105 |                    106 |
| NHL   |            105 |        23 |    6 |   16 |   60 |                     45 |
| SOC   |            185 |        50 |   27 |    9 |   99 |                     86 |

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~1115 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 612 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 373 / 612 (61%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 373 / 612 (61%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 373 / 612 (61%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 373 / 612 (61%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 373 / 612 (61%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 373 / 612 (61%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 373 / 612 (61%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 612 / 612 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 612 / 612 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 612 / 612 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 612 / 612 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 612 / 612 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 612 / 612 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 607 / 612 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 605 / 612 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 612 / 612 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 612 / 612 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 366 / 612 (60%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 612 / 612 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 366 / 612 (60%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 366 / 612 (60%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 612 / 612 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 612 / 612 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 612 / 612 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 612 / 612 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 612 / 612 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd sizeMargin        | 366 |      |    -0.035 |    -0.036 |      -0.070 |      -0.084 |  0.478 |
|    2 | wd forAvgSize        | 612 |      |    -0.047 |    +0.012 |      -0.070 |      -0.046 |  0.501 |
|    3 | wd agCount           | 366 |      |    +0.018 |    +0.294 |      +0.056 |      +0.114 |  0.493 |
|    4 | wd contribMargin     | 612 |      |    -0.019 |    -0.101 |      -0.052 |      -0.102 |  0.469 |
|    5 | hcMargin             | 612 |      |    -0.023 |    +0.202 |      -0.050 |      +0.035 |  0.503 |
|    6 | peakStars            | 612 |      |    -0.015 |    +0.084 |      -0.032 |      -0.014 |  0.482 |
|    7 | wd contribFor        | 612 |      |    -0.019 |    -0.021 |      -0.029 |      -0.065 |  0.480 |
|    8 | V12 agCount          | 373 |  🟢  |    -0.009 |    +0.142 |      +0.029 |      +0.088 |  0.510 |
|    9 | wd maxForContrib     | 612 |      |    -0.026 |    -0.038 |      -0.029 |      -0.035 |  0.499 |
|   10 | wd contribAg         | 612 |      |    -0.004 |    +0.152 |      +0.024 |      +0.058 |  0.500 |
|   11 | ags (v11)            | 612 |      |    +0.004 |    -0.006 |      -0.024 |      -0.083 |  0.509 |
|   12 | provenFor            | 612 |      |    -0.007 |    +0.106 |      -0.022 |      -0.034 |  0.496 |
|   13 | agsV12               | 373 |  🟢  |    +0.036 |    -0.008 |      +0.022 |      +0.002 |  0.509 |
|   14 | provenTotal          | 612 |      |    -0.017 |    +0.095 |      -0.020 |      -0.018 |  0.494 |
|   15 | provenMargin         | 612 |      |    +0.012 |    +0.092 |      -0.019 |      -0.028 |  0.501 |
|   16 | wd maxShare          | 612 |      |    +0.011 |    -0.074 |      +0.016 |      +0.012 |  0.515 |
|   17 | V12 forCount         | 373 |  🟢  |    +0.046 |    +0.305 |      +0.016 |      +0.063 |  0.537 |
|   18 | V12 agMean           | 373 |  🟢  |    -0.031 |    +0.337 |      -0.012 |      +0.095 |  0.471 |
|   19 | V12 forMean          | 373 |  🟢  |    +0.001 |    -0.003 |      -0.012 |      -0.018 |  0.482 |
|   20 | wd forCount          | 612 |      |    +0.006 |    +0.142 |      -0.010 |      -0.009 |  0.487 |
|   21 | provenAg             | 612 |      |    -0.027 |    +0.196 |      -0.010 |      +0.075 |  0.492 |
|   22 | qMargin              | 373 |  🟢  |    +0.009 |    -0.002 |      -0.009 |      -0.014 |  0.488 |
|   23 | clv                  | 605 |      |    +0.013 |    -0.031 |      +0.004 |      +0.015 |  0.524 |
|   24 | lockPinnProb         | 607 |      |    +0.128 |    +0.169 |      -0.002 |      -0.133 |  0.570 |
|   25 | wd agAvgSize         | 366 |      |    -0.022 |    -0.009 |      +0.001 |      -0.011 |  0.498 |
|   26 | countMargin          | 373 |      |    +0.052 |    +0.253 |      -0.000 |      +0.022 |  0.517 |

> **Top 3 univariate features by PnL correlation:** `wd sizeMargin` (r = -0.070), `wd forAvgSize` (r = -0.070), `wd agCount` (r = +0.056).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd sizeMargin` — r(unit-ret) = -0.070, AUC = 0.478. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd sizeMargin` · r(unit-ret) = -0.070 · AUC = 0.478

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.179          | 122 | 71-51   |   58.2% |     +4.8% |
| MID (p33–p67)     | 0.078 … 0.386            | 122 | 64-58   |   52.5% |     +0.2% |
| HIGH (> p67)      | 3.728 … 1.768            | 122 | 65-57   |   53.3% |     -2.4% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd forAvgSize` · r(unit-ret) = -0.070 · AUC = 0.501

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.675 … 0.420            | 204 | 107-97  |   52.5% |     -0.2% |
| MID (p33–p67)     | 0.777 … 1.010            | 206 | 121-85  |   58.7% |     +4.5% |
| HIGH (> p67)      | 3.837 … 1.360            | 202 | 107-95  |   53.0% |     -2.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd agCount` · r(unit-ret) = +0.056 · AUC = 0.493

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 193 | 105-88  |   54.4% |     +0.5% |
| MID (p33–p67)     | 2.000 … 2.000            |  88 | 47-41   |   53.4% |     -0.2% |
| HIGH (> p67)      | 3.000 … 6.000            |  85 | 48-37   |   56.5% |     +2.2% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribMargin` · r(unit-ret) = -0.052 · AUC = 0.469

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … 9.500          | 204 | 117-87  |   57.4% |     +3.8% |
| MID (p33–p67)     | 57.800 … 66.400          | 204 | 113-91  |   55.4% |     +0.6% |
| HIGH (> p67)      | 174.100 … 190.900        | 204 | 105-99  |   51.5% |     -1.5% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `hcMargin` · r(unit-ret) = -0.050 · AUC = 0.503

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.000 … 0.000            | 387 | 208-179 |   53.7% |     +0.9% |
| MID (p33–p67)     | 1.000 … 1.000            | 161 | 94-67   |   58.4% |     +2.3% |
| HIGH (> p67)      | 2.000 … 3.000            |  64 | 33-31   |   51.6% |     -2.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd sizeMargin  | wd forAvgSize  | wd agCount     | wd contribMargin | hcMargin       | peakStars      | wd contribFor  | V12 agCount    |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd sizeMargin |  1.000         |         +0.704 |         +0.069 |         +0.302 |         +0.408 |         -0.093 |         +0.298 |         +0.010 |
| wd forAvgSize |         +0.704 |  1.000         |         +0.251 |         +0.272 |         +0.463 |         -0.162 |         +0.426 |         +0.246 |
| wd agCount  |         +0.069 |         +0.251 |  1.000         |         -0.149 |         +0.214 |         -0.359 |         +0.468 |         +0.818 |
| wd contribMargin |         +0.302 |         +0.272 |         -0.149 |  1.000         |         +0.676 |         -0.056 |         +0.785 |         -0.161 |
| hcMargin    |         +0.408 |         +0.463 |         +0.214 |         +0.676 |  1.000         |         -0.221 |         +0.730 |         +0.209 |
| peakStars   |         -0.093 |         -0.162 |         -0.359 |         -0.056 |         -0.221 |  1.000         |         -0.269 |         -0.417 |
| wd contribFor |         +0.298 |         +0.426 |         +0.468 |         +0.785 |         +0.730 |         -0.269 |  1.000         |         +0.357 |
| V12 agCount |         +0.010 |         +0.246 |         +0.818 |         -0.161 |         +0.209 |         -0.417 |         +0.357 |  1.000         |

> 🟡 **Moderate collinearity:** `wd agCount` ↔ `V12 agCount` r = +0.818. Multivariate β are still informative but the two features carry overlapping information.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 249 picks · features = 8 (+ intercept) · multiple R² = **0.0311** · adjusted R² = **-0.0054** · residual sd = 0.953

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd agCount           |     |    +0.3850 |   0.2306 | +1.67 (~sig) |        1 |
|    2 | wd contribFor        |     |    -0.2833 |   0.3552 | -0.80        |        2 |
|    3 | wd contribMargin     |     |    +0.2302 |   0.3179 | +0.72        |        3 |
|    4 | V12 agCount          |  🟢 |    -0.1648 |   0.1122 | -1.47        |        4 |
|    5 | wd sizeMargin        |     |    -0.0775 |   0.0928 | -0.83        |        5 |
|    6 | hcMargin             |     |    -0.0275 |   0.0975 | -0.28        |        6 |
|    7 | peakStars            |     |    -0.0159 |   0.0676 | -0.24        |        7 |
|    8 | wd forAvgSize        |     |    -0.0116 |   0.0983 | -0.12        |        8 |
| —    | (intercept)          |     |    +0.0578 |   0.0604 |    +0.96 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **1 / 8** top multivariate features are inputs to V12 (13%).
- V12 consumes: `V12 agCount` (β = -0.165)
- V12 IGNORES: `wd agCount` (β = +0.385, t = +1.67), `wd contribFor` (β = -0.283, t = -0.80), `wd contribMargin` (β = +0.230, t = +0.72), `wd sizeMargin` (β = -0.077, t = -0.83), `hcMargin` (β = -0.027, t = -0.28), `peakStars` (β = -0.016, t = -0.24), `wd forAvgSize` (β = -0.012, t = -0.12)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.522 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.564 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.042.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~4.2pp.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd agCount` (β = +0.385, t = +1.67). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of -0.0054 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*