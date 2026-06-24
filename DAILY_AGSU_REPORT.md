# AGS-Unified — V12 Performance Monitor

**Generated:** Wednesday, June 24, 2026 at 11:19 AM ET

**Active model:** `ags-unified-v12` · **V12 went live:** 2026-06-01 · **Days live:** 24

> This report is a **CEO-grade monitor of V12 in production**. The only non-V12 section is § 2 (model version comparison), kept so you can see V12's results in the context of every prior model bump. Everything else — daily trajectory, tier scoreboard, score reliability, mute-rule audit, wallet-quality inputs, operational health — is **strictly V12-scoped** (pick date ≥ 2026-06-01) so cron back-fill of V12 stamps onto older picks can't contaminate the production numbers.

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (24 days ago), V12 has evaluated **667** picks, shipped **256** for real money (38.4% ship rate), and muted the other **411**. On the shipped picks V12 has gone **141-115** (55.1% win), staked **578.75u**, and returned **+32.21u** at **+5.6% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             24 |
| Picks V12 has evaluated             |                            667 |
| Picks SHIPPED (units > 0)           |                            256 |
| Picks MUTED (score ≤ 0, FADE)       |                            411 |
| Ship rate                           |                          38.4% |
| Live W-L                            |                        141-115 |
| Live Win %                          |                          55.1% |
| Live PnL (units)                    |                         +32.21 |
| Live ROI                            |                          +5.6% |
| Avg PnL / day                       |                         +1.34u |
| Most recent action (2026-06-26)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **5.6% ROI** across 256 live picks (+32.21u real PnL).
- Mute rule is **saving money** — the 241 muted picks would have lost -31.98u at flat 1u (-13.3% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.34u/day** on average since launch.
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
| v12     | 06-01 → present      |   24 |    256 | 241 | 141-115 |  55.1% |      5.6% |     +32.21 |    +0.13 | 0.539 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  196 |    +1.7pp |    +14.5pp |          +0.299 |   -0.010 |          — | 🟡 mixed |
| v12 − v10          | +  194 |    +6.7pp |    +24.3pp |          +0.439 |   +0.145 |          — | 🟢 better |
| v12 − v11          | +  145 |    +0.1pp |     +2.7pp |          +0.065 |   +0.095 |          — | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 240n 55.4% +4% | 10n 30.0% +29% | 6n 83.3% +38%  | 256n 55.1% +6% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 59n +5%       | 75n +9%       | 58n -9%       | 32n +15%      | 28n -6%       | 🟡 partial (0) |

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
| 2026-06-19 |        36 |    5 |    19 | 3-2        |  60.0% |     17.00 |      +2.00 |     11.8% |     +31.95 |
| 2026-06-20 |        20 |    4 |    13 | 3-1        |  75.0% |     13.00 |      +2.03 |     15.6% |     +33.98 |
| 2026-06-21 |        38 |    4 |    19 | 2-2        |  50.0% |     11.50 |      -1.87 |    -16.3% |     +32.11 |
| 2026-06-22 |        32 |    5 |    17 | 4-1        |  80.0% |     16.00 |      +8.60 |     53.8% |     +40.71 |
| 2026-06-23 |        36 |    3 |    27 | 0-3        |   0.0% |      8.50 |      -8.50 |   -100.0% |     +32.21 |
| 2026-06-24 |        18 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +32.21 |
| 2026-06-25 |         5 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +32.21 |
| 2026-06-26 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +32.21 |

> **Bottom line.** 24 days live, 256 live picks shipped, **+32.21u total PnL** at **+5.6% ROI**, averaging **+1.34u per day**.

## § 5 — V12 By Tier (Where The Money Comes From)

V12 buckets every shipped pick into a tier (ELITE → WEAK) based on the score band, then stakes an absolute number of units per the ladder. **If the model is working, ELITE picks should out-earn PREMIUM, which should out-earn LOCK, and so on** — the ladder is V12's bet that higher scores deserve more capital.

**Expected** is the ladder target before any odds-cap. **Avg stake actual** is what was actually staked (lower on positive odds because `oddsCap` clamps long underdogs). **Drift** = actual − expected. If Drift is materially negative on negative-odds picks, that's a sizing pipeline bug.

| Tier     | Ladder | N   | W-L    | Win %  | Avg V12 score | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|---------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |  83 | 34-25  |  57.6% |        +0.989 |    5.00u |            4.23u | -0.77u |      249.50 |     +12.72 |      5.1% |
| PREMIUM  |  3.00u | 103 | 44-31  |  58.7% |        +0.969 |    3.00u |            2.95u | -0.05u |      221.50 |     +19.76 |      8.9% |
| LOCK     |  1.00u |  78 | 26-32  |  44.8% |        +0.940 |    1.00u |            1.20u | +0.20u |       69.50 |      -5.93 |     -8.5% |
| LEAN     |  0.50u |  50 | 21-11  |  65.6% |        +0.861 |    0.50u |            0.80u | +0.30u |       25.50 |      +3.82 |     15.0% |
| WEAK     |  0.25u |  47 | 14-14  |  50.0% |        +0.464 |    0.25u |            0.25u | +0.00u |        7.00 |      -0.41 |     -5.9% |
| FADE     |  0.00u | 131 | 0-0    |      — |        -0.182 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Ladder monotonicity** (positive tiers ELITE → WEAK only). ROI score `0` 🟡 partial · Win-rate score `0` 🟡 partial. **Partial — the ladder is in the right direction overall but has rough spots. Watch a few more days before reacting.**

### v12.1 — By Stake Tier (HC margin)

Post-cutover picks size off the **HC margin**, not the score quintile. SUPER (margin 2 · 6u), TOP (margin 1 · 4u), MINI (mini-HC 1.0–1.5× · 3u), CONFIRMED (margin 3+ · 1u) are staked; **MONITORING** (non-HC or WEAK-tier HC) is tracked at **0u** and excluded from the staked record/ROI below.

| Stake Tier | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|------------|-------|-----|--------|--------|-------------|------------|-----------|
| SUPER      | 6.00u |   1 | 1-0    | 100.0% |        6.00 |      +4.48 |     74.7% |
| TOP        | 4.00u |  11 | 8-3    |  72.7% |       41.00 |      +9.10 |     22.2% |
| MINI       | 3.00u |  25 | 13-12  |  52.0% |       74.00 |      -2.87 |     -3.9% |

> **MONITORING volume:** 109 picks tracked at 0u (would-be 51-58, 46.8% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Sizing pipeline integrity

🚨 **133 picks deviate from the V12 ladder by > ±0.05u** even after accounting for the production odds-cap. Investigate `unitsFromAgsV12` in `syncPickStateAuthoritative.js`.

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
| _… and 108 more_ |

## § 5a — RANK-RESCUE Slice (2-for-0 wallet path · v12ab book)

> **What this is.** `v12ab` = the v12a book (HC-margin sizing) **plus** the RANK-RESCUE staking path that went live **2026-06-21**. The rule: a v12-shipped pick (score > 0) that the HC sizer mutes to 0u is staked at **4u** when its FOR side is **2-for-0** — ≥2 eligible whitelist wallets backing (CONFIRMED/FLAT/WR50 with ≥8 settled in-sport picks) and 0 against. It **only rescues muted picks**; it never up-sizes a pick the HC ladder already staked.

### (B) Reconstruction over the V12 era (2026-06-01 → today)

> Re-derived from frozen `walletDetails` + **current** wallet profiles. Eligibility uses today's settled-pick counts, so this is a **mildly optimistic projection** (a wallet at ≥8 picks now may have had fewer at pick time). Live-stamped numbers in (A) are the ground truth.

| Bucket | Picks | W-L | Win % | Stake | PnL | ROI | Per day |
|--------|------:|:---:|:-----:|------:|----:|----:|--------:|
| RANK-RESCUE (HC-muted → 4u) | 35 | 21-14 | 60.0% | 140u | +19.72u | +14.1% | 1.46 |

**2-for-0 picks the HC ladder ALREADY staked (NOT rescued — no hammer): 17** (12-5). These are left at their HC size — the slice adds no edge inside the HC book.

#### RANK-RESCUE by sport (reconstructed)

| Sport | Picks | W-L | Win % | PnL @4u | ROI |
|-------|------:|:---:|:-----:|------:|----:|
| MLB | 32 | 20-12 | 62.5% | +19.12u | +14.9% |
| NBA | 1 | 0-1 | 0.0% | -4.00u | -100.0% |
| NHL | 2 | 1-1 | 50.0% | +4.60u | +57.5% |

### (A) Live stamped RANK picks (ground truth — populates going forward)

| Picks | W-L | Win % | Stake | PnL | ROI |
|------:|:---:|:-----:|------:|----:|----:|
| 1 | 1-0 | 100.0% | 2u | +1.82u | +91.0% |

| Date | Sport | Matchup | Side | Odds | Result | PnL |
|------|-------|---------|------|-----:|:------:|----:|
| 2026-06-20 | MLB | Milwaukee Brewers@Atlanta Braves | Under 7.5 | -110 | WIN | +1.82u |

### Incremental impact

> RANK-RESCUE sits **on top of the v12a HC book** — it stakes 4u on picks the HC ladder would mute (0u), so every rescue is net-new volume, never an up-size. Reconstruction: **+1.46 picks/day** (35 over 24 days) at **+14.1% ROI** / **+19.72u**, pulled from the muted pool — so no existing HC pick's size or grade changes. (The § 1 / § 4–5 headline book still reflects historical score-ladder sizing for picks shipped before v12a; only NEW picks size under v12a + RANK.)

## § 6 — V12 By Sport & Market (Where The Edge Is)

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 139n · 55.4% · +4.7%   | 19n · 63.2% · +9.4%    | 82n · 53.7% · +2.7%    | 240n · 55.4% · +4.3%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| **All** | **146n · 54.1% · +4.4%** | **23n · 65.2% · +21.9%** | **87n · 54.0% · +3.8%** | **256n · 55.1% · +5.6%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Does V12 Actually Predict Outcomes? (Score Reliability)

If V12's score is real signal — not just a number — then **higher scores should win more often than the market is pricing**. This table buckets every graded V12 pick by score band and compares the realized win rate (what actually happened) against the market-implied win rate (what the closing odds said would happen). The gap, **Edge**, is V12's claimed alpha. Positive Edge in the high bands means V12 is finding mispricings the market hasn't.

| V12 score band     | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|--------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strongest)  | 268 |    201 | 110-91 |    53.0% |   52.9% |     +0.1pp |      5.2% |
| 0.7 – 0.9          |  55 |     27 | 18-9   |    54.5% |   54.1% |     +0.5pp |     11.0% |
| 0.5 – 0.7          |  15 |      5 | 3-2    |    40.0% |   52.0% |    -12.0pp |      8.8% |
| 0.25 – 0.5         |  12 |     10 | 5-5    |    58.3% |   53.7% |     +4.7pp |     -6.8% |
| (0, 0.25]          |  11 |      9 | 3-6    |    45.5% |   55.0% |     -9.5pp |    -33.8% |
| ≤ 0 (MUTED)        | 121 |      0 | 0-0    |    46.3% |   53.2% |     -6.9pp |         — |

> 🟡 **Strong-score band (> 0.9) edge is +0.1pp** — borderline. Larger sample needed before declaring V12's top tier as real alpha.

> 🟢 **Mute band (≤ 0) actually wins only 46.3%** — V12 correctly identifies these as losers. The mute rule is justified.

## § 8 — V12 Mute Rule: Saving Money or Throwing Away Edge?

V12 muted **241** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  241 |
| Muted W-L                           |              110-131 |
| Muted Win %                         |                45.6% |
| Counterfactual PnL at flat 1u       |               -31.98 |
| Counterfactual ROI at flat 1u       |               -13.3% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-31.98u** at a flat 1u stake — a counterfactual ROI of **-13.3%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 9 — How Different is V12 from V11? (Pick Selection)

The cron continues to compute the v11 score (`v8_ags`) on every pick during the transition, even though V12 is now the authoritative model. That lets us answer a critical question: **is V12 just a re-skin of V11 with new sizes, or is it picking fundamentally different bets?**

The cleanest test is **Spearman rank correlation** between v11 score and V12 score on the same picks. ρ ≈ +1.0 means the two models agree on which picks are strongest (so V12 is basically a sizing change). ρ ≈ 0 means they're orthogonal (V12 is picking completely different bets). ρ < 0 means they actively *disagree* — what V11 ranks high, V12 ranks low.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Shared graded picks                 |                  470 |
| Spearman ρ (v11 vs V12 score)       |               -0.248 |

> 🟢 **V12 actively disagrees with V11** — ρ = -0.248. The two models are ranking picks in nearly-opposite order. V12 is a fundamentally different bet-selection model, NOT a v11 tweak. If V12's results in § 2 are good, that disagreement is V12's whole edge.

> **Why this is the only honest V11-vs-V12 comparison here.** The Firestore `v8_agsTier` stamp is overwritten by V12 in production, so any tier-confusion-matrix comparison would be artificially 100% diagonal. The raw scores (`v8_ags` and `v8_agsV12`) are still distinct, so Spearman ρ on those is the cleanest signal.

## § 10 — V12 Wallet-Quality Inputs (What V12 Is "Seeing")

V12's score is the bounded difference of two averages: the mean wallet quality FOR the pick minus the mean wallet quality AGAINST it. Surfacing those raw inputs lets you see whether V12 is "looking at" the right things: does V12 ship picks because the FOR-side wallets are genuinely sharper, or because the AGAINST-side has no wallets at all (which can artificially inflate the score)?

### Average per-side wallet quality (across 483 V12-era picks)

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +19.116 |                        1.9 |
| AGAINST |             +3.209 |                        1.0 |

### One-sided wallet support (high-variance picks)

- **32** picks had ≥ 3 FOR-side wallets but **zero** AGAINST-side wallets. V12 score is high here because the AGAINST mean defaults to 0, not because of genuine quality contrast.
- **0** picks had ≥ 3 AGAINST-side wallets but **zero** FOR-side wallets. Mirror case.

> One-sided FOR picks have gone **12-9** (57.1% win) at **+7.3% ROI**. If this materially underperforms the all-picks average, the one-sided trigger should be tightened (e.g. require ≥ N AGAINST wallets before scoring).

### Wallet count distribution per pick

| Side    | min | p25 | p50 | p75 | max |
|---------|-----|-----|-----|-----|-----|
| FOR     |   0 |   1 |   1 |   2 |   8 |
| AGAINST |   0 |   0 |   1 |   2 |   6 |

## § 11 — Recent V12 Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). This is the audit trail — every row is a real bet that risked real money, with the V12 score that drove the decision and the realised outcome.

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Tier     | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|
| 2026-06-23 | MLB   | ML     | Atlanta Braves          |  -110 | +0.976 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-23 | MLB   | ML     | Baltimore Orioles       |  -142 | +0.973 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-23 | MLB   | TOTAL  | Over 9.5                |  +103 | +0.906 | LOCK     | 2.50u | LOSS    |      -2.50 |
| 2026-06-22 | MLB   | ML     | Toronto Blue Jays       |  -131 | +0.991 | ELITE    | 3.00u | WIN     |      +2.29 |
| 2026-06-22 | MLB   | TOTAL  | Over 8.5                |  -102 | +0.962 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-22 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.959 | PREMIUM  | 3.00u | WIN     |      +2.73 |
| 2026-06-22 | MLB   | TOTAL  | Under 6.5               |  -110 | +0.986 | ELITE    | 3.00u | WIN     |      +2.73 |
| 2026-06-22 | MLB   | TOTAL  | Under 8.5               |  -104 | +0.922 | LOCK     | 4.00u | WIN     |      +3.85 |
| 2026-06-21 | MLB   | ML     | Los Angeles Dodgers     |  -225 | +0.939 | LOCK     | 3.00u | LOSS    |      -3.00 |
| 2026-06-21 | MLB   | ML     | Philadelphia Phillies   |  -186 | +0.964 | PREMIUM  | 3.00u | WIN     |      +1.61 |
| 2026-06-21 | MLB   | TOTAL  | Under 6.5               |  +101 | +0.964 | PREMIUM  | 2.50u | WIN     |      +2.52 |
| 2026-06-21 | MLB   | TOTAL  | Under 8.5               |  -105 | +0.960 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-20 | MLB   | ML     | New York Yankees        |  -201 | +0.965 | PREMIUM  | 4.00u | LOSS    |      -4.00 |
| 2026-06-20 | MLB   | ML     | Philadelphia Phillies   |  -198 | +0.943 | LOCK     | 4.00u | WIN     |      +2.02 |
| 2026-06-20 | MLB   | ML     | Miami Marlins           |  -137 | +0.978 | ELITE    | 3.00u | WIN     |      +2.19 |
| 2026-06-20 | MLB   | TOTAL  | Under 7.5               |  -110 | +0.954 | PREMIUM  | 2.00u | WIN     |      +1.82 |
| 2026-06-19 | MLB   | ML     | Arizona Diamondbacks    |  -168 | +0.976 | PREMIUM  | 4.00u | WIN     |      +2.38 |
| 2026-06-19 | MLB   | SPREAD | New York Yankees        |  -130 | +0.959 | PREMIUM  | 4.00u | WIN     |      +3.08 |
| 2026-06-19 | MLB   | SPREAD | Chicago White Sox       |  -118 | +0.949 | LOCK     | 3.00u | WIN     |      +2.54 |
| 2026-06-19 | MLB   | TOTAL  | Over 11.5               |  -110 | +0.982 | ELITE    | 3.00u | LOSS    |      -3.00 |
| 2026-06-19 | MLB   | TOTAL  | Under 7.5               |  -110 | +0.952 | PREMIUM  | 3.00u | LOSS    |      -3.00 |
| 2026-06-18 | MLB   | ML     | Milwaukee Brewers       |  -148 | +0.974 | PREMIUM  | 4.00u | LOSS    |      -4.00 |
| 2026-06-18 | MLB   | ML     | New York Mets           |  +103 | +0.960 | PREMIUM  | 2.50u | WIN     |      +2.58 |
| 2026-06-18 | MLB   | TOTAL  | Over 9.5                |  -110 | +0.954 | PREMIUM  | 3.00u | WIN     |      +2.73 |
| 2026-06-18 | MLB   | TOTAL  | Under 8.5               |  -108 | +0.960 | PREMIUM  | 3.00u | WIN     |      +2.78 |
| 2026-06-17 | MLB   | ML     | Miami Marlins           |  +100 | +0.983 | ELITE    | 2.50u | WIN     |      +2.50 |
| 2026-06-17 | MLB   | ML     | Boston Red Sox          |  -123 | +0.985 | ELITE    | 3.00u | LOSS    |      -3.00 |
| 2026-06-17 | MLB   | TOTAL  | Over 7.5                |  -110 | +0.983 | ELITE    | 3.00u | WIN     |      +2.73 |
| 2026-06-17 | MLB   | TOTAL  | Under 9.5               |  -110 | +0.985 | ELITE    | 3.00u | WIN     |      +2.73 |
| 2026-06-17 | MLB   | TOTAL  | Over 10.5               |  -110 | +0.980 | ELITE    | 3.00u | LOSS    |      -3.00 |

## § 12 — V12 Statistical Monitor (Predictive-Power Diagnostics)

> **Why this section matters.** Win-rate and ROI tell you whether V12 made money. The numbers below tell you whether V12 deserves the credit — i.e. whether the score itself is genuinely separating winners from losers, or whether the realised PnL is just variance on a near-random gate. Track these week-over-week: if AUC drifts below 0.50, the score has lost its signal and the ROI line is about to follow.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five different statistical lenses on the same question. Each one is computed only over **live shipped picks** (units > 0, tracked = false) that have a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.518 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.092 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   +0.013 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   +0.056 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.063 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟠 **Random** — score is not predicting outcomes; PnL is variance, not edge

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  252 |    +0.3210 |    -0.2451 | 0.0043 |  +0.065 |   0.953 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  252 |    +0.1611 |    +0.4077 | 0.0040 |  +0.063 |   0.496 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  252 |    +0.3556 |    -0.1986 | 0.0007 |  +0.027 |   2.562 | positive (higher score ⇒ better outcome)                 |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

V12's score is built from four inputs per pick: the mean quality of FOR-side wallets, the mean quality of AGAINST-side wallets, the count of wallets on each side, and the count of `proven` (HC_BASE) wallets among them. We test each one independently — does it correlate with the outcome on its own? If a feature has near-zero correlation, V12 is paying for noise in that channel.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 252 |          +0.045 |           -0.064 |                   +0.047 |                   -0.021 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 252 |          -0.082 |           +0.310 |                   -0.085 |                   +0.065 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 252 |          -0.077 |           +0.172 |                   -0.090 |                   +0.010 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 252 |          -0.014 |           +0.126 |                   -0.004 |                   +0.085 | count of contributing AGAINST-side wallets                     |
| provenFor         | 252 |          -0.049 |           +0.198 |                   -0.066 |                   +0.018 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 252 |          -0.054 |           +0.103 |                   -0.052 |                   +0.041 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 4.800          |  84 | 51-33   |   60.7% |    +13.0% |
| MID (p33–p67)     | 19.950 … 20.100        |  85 | 42-43   |   49.4% |     -3.4% |
| HIGH (> p67)      | 48.906 … 39.740        |  83 | 46-37   |   55.4% |     +1.8% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       252 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8930 | average score across live picks                                 |
| SD                |    0.1952 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.852 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +7.371 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.724 / +0.964 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.997 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  236 | 131-105 |   55.5% |     +3.9% |  0.497 |        -0.029 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |

### 12F — Stability: rolling 7-day AUC across the V12 window

Recompute AUC on a moving 7-day window. If recent windows are degrading (e.g. dropping from 0.58 → 0.50 → 0.45), V12's edge is decaying in real time. Each row anchors on the END date of its window.

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    |
|------------|------|------|--------|---------|-----------|--------|
| 2026-06-10 |    7 |  123 | 67-56  |   54.5% |     +8.2% |  0.555 |
| 2026-06-11 |    7 |  117 | 64-53  |   54.7% |     +9.3% |  0.559 |
| 2026-06-12 |    7 |  116 | 62-54  |   53.4% |     +7.8% |  0.550 |
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

> 🔴 **AUC is trending DOWN** — V12 is degrading; investigate quintile cutoffs and wallet pool drift (0.549 avg in first half → 0.440 avg in second half · Δ = -0.109)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.6% | [-8.5%, +19.0%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          55.1% | [49.2%, 61.1%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.518 | [0.451, 0.585]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             26 | [-4, 56]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 13 — V12 Wallet Influence & Performance

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       256 |
| Unique wallets ever on a FOR side            |                                                        68 |
| Avg FOR-side wallets per pick                |                                                      2.20 |
| Top-5 wallets' share of all FOR appearances  |                                                     44.5% |
| Top-10 wallets' share of all FOR appearances |                                                     65.6% |
| Top-20 wallets' share of all FOR appearances |                                                     81.2% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4c64aa  | MLB        |   79 |    8 | 43-36  |   54.4% |     +0.5% |     +0.70 |     0.87× | CONFIRMED   |     +1.4% |     263 | 2026-06-21 |
|    2 | 1e8f33  | MLB        |   69 |    6 | 41-28  |   59.4% |     -1.1% |     -1.90 |     0.92× | CONFIRMED   |     +3.9% |     133 | 2026-06-23 |
|    3 | 70135d  | MLB,NBA    |   46 |   64 | 25-21  |   54.3% |     +5.3% |     +3.75 |     1.39× | CONFIRMED   |     -3.6% |     405 | 2026-06-22 |
|    4 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|    5 | eeabaf  | MLB,NBA    |   27 |    2 | 14-13  |   51.9% |     -6.4% |     -5.12 |     1.00× | CONFIRMED   |    +14.1% |      87 | 2026-06-22 |
|    6 | cd2f63  | MLB,NBA    |   27 |   17 | 13-14  |   48.1% |    +11.8% |     +7.55 |     0.76× | FLAT        |     +0.8% |     261 | 2026-06-21 |
|    7 | 7923c4  | MLB,NBA    |   26 |    6 | 16-10  |   61.5% |    +53.4% |    +24.15 |     0.74× | CONFIRMED   |    +12.7% |     114 | 2026-06-22 |
|    8 | 2f2a9e  | MLB        |   26 |   19 | 13-13  |   50.0% |    -17.6% |     -7.54 |     1.27× | FLAT        | +Infinity% |     106 | 2026-06-23 |
|    9 | 491f30  | MLB        |   24 |    3 | 16-8   |   66.7% |    +42.3% |    +33.39 |     0.96× | CONFIRMED   |     -0.3% |      49 | 2026-06-23 |
|   10 | 9a69c2  | MLB        |   16 |   39 | 9-7    |   56.3% |    +37.3% |     +7.83 |     2.78× | CONFIRMED   |    -16.5% |     148 | 2026-06-21 |
|   11 | 5b1e50  | MLB,NBA,NHL |   14 |   30 | 9-5    |   64.3% |    +20.6% |     +7.97 |     1.25× | CONFIRMED   |     -9.7% |     103 | 2026-06-23 |
|   12 | 10c684  | MLB,NBA    |   13 |    4 | 4-9    |   30.8% |    -31.6% |     -4.74 |     1.74× | FLAT        |    -26.6% |      31 | 2026-06-11 |
|   13 | bc3532  | MLB,NBA,NHL |   11 |   14 | 6-5    |   54.5% |    +30.7% |     +4.07 |     2.17× | CONFIRMED   |     +3.0% |     151 | 2026-06-18 |
|   14 | 972768  | MLB        |    9 |    3 | 5-4    |   55.6% |    -26.1% |     -6.33 |     1.01× | CONFIRMED   | +Infinity% |      56 | 2026-06-21 |
|   15 | bc44b0  | MLB,NBA,NHL |    8 |    5 | 3-5    |   37.5% |    -52.2% |     -6.52 |     2.01× | FLAT        |    -19.0% |      41 | 2026-06-21 |
|   16 | 8c1eae  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |    +53.8% |     +4.71 |     1.79× | FLAT        |     -8.0% |      96 | 2026-06-08 |
|   17 | e05213  | MLB        |    7 |    2 | 5-2    |   71.4% |    +34.7% |     +6.85 |     1.25× | CONFIRMED   |    +40.5% |      15 | 2026-06-22 |
|   18 | b839b3  | MLB,NBA    |    7 |    3 | 4-3    |   57.1% |     +7.7% |     +1.76 |     1.71× | CONFIRMED   |     +6.1% |      15 | 2026-06-20 |
|   19 | b19a27  | MLB,NBA    |    6 |    4 | 3-3    |   50.0% |    -15.9% |     -2.35 |     1.34× | CONFIRMED   |     -5.0% |     278 | 2026-06-07 |
|   20 | 4d2125  | NHL        |    6 |    0 | 5-1    |   83.3% |    +38.2% |     +6.30 |     0.73× | CONFIRMED   |    +25.1% |      17 | 2026-06-14 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 7923c4  | MLB,NBA    |   26 | 16-10  |   61.5% |     +53.4% |    +24.15 |     0.74× | 2026-06-22 |
|    2 | 491f30  | MLB        |   24 | 16-8   |   66.7% |     +42.3% |    +33.39 |     0.96× | 2026-06-23 |
|    3 | 9a69c2  | MLB        |   16 | 9-7    |   56.3% |     +37.3% |     +7.83 |     2.78× | 2026-06-21 |
|    4 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    5 | 5b1e50  | MLB,NBA,NHL |   14 | 9-5    |   64.3% |     +20.6% |     +7.97 |     1.25× | 2026-06-23 |
|    6 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    7 | cd2f63  | MLB,NBA    |   27 | 13-14  |   48.1% |     +11.8% |     +7.55 |     0.76× | 2026-06-21 |
|    8 | 70135d  | MLB,NBA    |   46 | 25-21  |   54.3% |      +5.3% |     +3.75 |     1.39× | 2026-06-22 |
|    9 | 4c64aa  | MLB        |   79 | 43-36  |   54.4% |      +0.5% |     +0.70 |     0.87× | 2026-06-21 |
|   10 | 1e8f33  | MLB        |   69 | 41-28  |   59.4% |      -1.1% |     -1.90 |     0.92× | 2026-06-23 |
|   11 | eeabaf  | MLB,NBA    |   27 | 14-13  |   51.9% |      -6.4% |     -5.12 |     1.00× | 2026-06-22 |
|   12 | 2f2a9e  | MLB        |   26 | 13-13  |   50.0% |     -17.6% |     -7.54 |     1.27× | 2026-06-23 |
|   13 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   13 | 4-9    |   30.8% |     -31.6% |     -4.74 |     1.74× | 2026-06-11 |
|    2 | 2f2a9e  | MLB        |   26 | 13-13  |   50.0% |     -17.6% |     -7.54 |     1.27× | 2026-06-23 |
|    3 | eeabaf  | MLB,NBA    |   27 | 14-13  |   51.9% |      -6.4% |     -5.12 |     1.00× | 2026-06-22 |
|    4 | 1e8f33  | MLB        |   69 | 41-28  |   59.4% |      -1.1% |     -1.90 |     0.92× | 2026-06-23 |
|    5 | 4c64aa  | MLB        |   79 | 43-36  |   54.4% |      +0.5% |     +0.70 |     0.87× | 2026-06-21 |
|    6 | 70135d  | MLB,NBA    |   46 | 25-21  |   54.3% |      +5.3% |     +3.75 |     1.39× | 2026-06-22 |
|    7 | cd2f63  | MLB,NBA    |   27 | 13-14  |   48.1% |     +11.8% |     +7.55 |     0.76× | 2026-06-21 |
|    8 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|    9 | 5b1e50  | MLB,NBA,NHL |   14 | 9-5    |   64.3% |     +20.6% |     +7.97 |     1.25× | 2026-06-23 |
|   10 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   11 | 9a69c2  | MLB        |   16 | 9-7    |   56.3% |     +37.3% |     +7.83 |     2.78× | 2026-06-21 |
|   12 | 491f30  | MLB        |   24 | 16-8   |   66.7% |     +42.3% |    +33.39 |     0.96× | 2026-06-23 |
|   13 | 7923c4  | MLB,NBA    |   26 | 16-10  |   61.5% |     +53.4% |    +24.15 |     0.74× | 2026-06-22 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `10c684` (FOR# 13, ROI -31.6%), `2f2a9e` (FOR# 26, ROI -17.6%), `eeabaf` (FOR# 27, ROI -6.4%).

## § 14 — Operational Health (V12 pipeline sanity)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   354 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    49 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     6 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    18 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |    12 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   131 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| 2026-06-19_MLB_bal_lad              | MLB   | PREMIUM |  +0.12 | WIN     |           +0.51u |
| 2026-06-19_MLB_cin_nyy              | MLB   | PREMIUM |  +0.30 | LOSS    |           -1.00u |
| 2026-06-19_MLB_cle_hou              | MLB   | LOCK    |  +0.40 | LOSS    |           -1.00u |

## § 15 — Live Calibration Snapshot (V12 thresholds in use)

The live `agsCalibration/current` document — what the cron and UI both read at runtime to score & size every pick. **This is the actual thresholds V12 is using right now.**

- **Computed at:** 2026-06-23T15:38:58.769Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 1301
- **Date range:** 2026-04-18 → 2026-06-22

### V12 wallet-quality score thresholds (live)

These are the cuts on the V12 score (in [-1, +1]) that decide which tier each pick lands in, and therefore how many units it ships at.

| Boundary | V12 score cut | Tier band start | Stake (absolute units) |
|----------|---------------|-----------------|------------------------|
| q80      |        +0.984 | ELITE           | 5.00u                  |
| q60      |        +0.956 | PREMIUM         | 3.00u                  |
| q40      |        +0.877 | LOCK            | 1.00u                  |
| q20      |        +0.736 | LEAN            | 0.50u                  |
| —        |        +0.000 | WEAK            | 0.25u  (any score in (0, q20]) |
| mute     |             — | FADE            | 0.00u  (any score ≤ 0) |

> **Odds cap.** Regardless of tier, stake is clamped by american odds: ≤2.5u at +100, ≤1.5u at +151, ≤1.0u at +200. Keeps a long-underdog ELITE from blowing up the bankroll.

## § 16 — Wallet Pool Health (V12 input supply)

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            137 |        36 |   17 |    6 |   78 |                     59 |
| NBA   |            211 |        58 |   25 |   23 |  105 |                    106 |
| NHL   |            105 |        23 |    6 |   16 |   60 |                     45 |
| SOC   |            125 |        15 |    3 |   10 |   97 |                     28 |

## § 17 — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~779 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 490 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 252 / 490 (51%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 252 / 490 (51%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 252 / 490 (51%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 252 / 490 (51%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 252 / 490 (51%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 252 / 490 (51%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 252 / 490 (51%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 490 / 490 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 490 / 490 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 490 / 490 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 490 / 490 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 490 / 490 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 490 / 490 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 486 / 490 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 485 / 490 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 490 / 490 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 490 / 490 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 286 / 490 (58%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 490 / 490 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 286 / 490 (58%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 286 / 490 (58%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 490 / 490 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 490 / 490 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 490 / 490 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 490 / 490 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 490 / 490 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd forCount          | 490 |      |    -0.104 |    -0.017 |      -0.103 |      -0.080 |  0.459 |
|    2 | wd contribFor        | 490 |      |    -0.109 |    -0.135 |      -0.103 |      -0.112 |  0.473 |
|    3 | provenFor            | 490 |      |    -0.089 |    -0.031 |      -0.095 |      -0.102 |  0.468 |
|    4 | countMargin          | 252 |      |    -0.069 |    +0.081 |      -0.092 |      -0.048 |  0.470 |
|    5 | provenTotal          | 490 |      |    -0.090 |    -0.011 |      -0.092 |      -0.074 |  0.467 |
|    6 | V12 forCount         | 252 |  🟢  |    -0.077 |    +0.172 |      -0.090 |      +0.010 |  0.503 |
|    7 | V12 agMean           | 252 |  🟢  |    -0.082 |    +0.310 |      -0.085 |      +0.065 |  0.486 |
|    8 | wd contribMargin     | 490 |      |    -0.070 |    -0.205 |      -0.071 |      -0.141 |  0.466 |
|    9 | qMargin              | 252 |  🟢  |    +0.067 |    -0.025 |      +0.069 |      +0.014 |  0.511 |
|   10 | agsV12               | 252 |  🟢  |    +0.063 |    +0.013 |      +0.065 |      +0.056 |  0.518 |
|   11 | wd contribAg         | 490 |      |    -0.073 |    +0.123 |      -0.063 |      +0.058 |  0.483 |
|   12 | wd maxShare          | 490 |      |    +0.065 |    +0.031 |      +0.062 |      +0.053 |  0.547 |
|   13 | provenAg             | 490 |      |    -0.066 |    +0.175 |      -0.061 |      +0.069 |  0.476 |
|   14 | provenMargin         | 490 |      |    -0.048 |    -0.050 |      -0.059 |      -0.090 |  0.482 |
|   15 | wd forAvgSize        | 490 |      |    -0.034 |    -0.057 |      -0.056 |      -0.070 |  0.516 |
|   16 | hcMargin             | 490 |      |    -0.032 |    +0.095 |      -0.053 |      +0.000 |  0.505 |
|   17 | wd sizeMargin        | 286 |      |    -0.024 |    -0.120 |      -0.052 |      -0.100 |  0.484 |
|   18 | V12 forMean          | 252 |  🟢  |    +0.045 |    -0.064 |      +0.047 |      -0.021 |  0.496 |
|   19 | ags (v11)            | 490 |      |    -0.010 |    -0.161 |      -0.033 |      -0.156 |  0.488 |
|   20 | wd agCount           | 286 |      |    -0.037 |    +0.270 |      -0.030 |      +0.117 |  0.505 |
|   21 | peakStars            | 490 |      |    -0.015 |    +0.113 |      -0.023 |      +0.011 |  0.483 |
|   22 | wd maxForContrib     | 490 |      |    -0.017 |    -0.102 |      -0.014 |      -0.053 |  0.512 |
|   23 | wd agAvgSize         | 286 |      |    -0.029 |    -0.013 |      -0.011 |      -0.023 |  0.496 |
|   24 | V12 agCount          | 252 |  🟢  |    -0.014 |    +0.126 |      -0.004 |      +0.085 |  0.518 |
|   25 | clv                  | 485 |      |    +0.038 |    +0.022 |      +0.003 |      +0.038 |  0.539 |
|   26 | lockPinnProb         | 486 |      |    +0.103 |    +0.147 |      -0.000 |      -0.134 |  0.559 |

> **Top 3 univariate features by PnL correlation:** `wd forCount` (r = -0.103), `wd contribFor` (r = -0.103), `provenFor` (r = -0.095).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd forCount` — r(unit-ret) = -0.103, AUC = 0.459. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd forCount` · r(unit-ret) = -0.103 · AUC = 0.459

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 172 | 98-74   |   57.0% |     +4.1% |
| MID (p33–p67)     | 3.000 … 3.000            | 240 | 131-109 |   54.6% |     +0.4% |
| HIGH (> p67)      | 4.000 … 6.000            |  78 | 36-42   |   46.2% |     -7.6% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd contribFor` · r(unit-ret) = -0.103 · AUC = 0.473

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 49.800 … 42.900          | 164 | 85-79   |   51.8% |     -0.6% |
| MID (p33–p67)     | 89.000 … 84.800          | 163 | 105-58  |   64.4% |     +8.6% |
| HIGH (> p67)      | 212.200 … 221.400        | 163 | 75-88   |   46.0% |     -6.5% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `provenFor` · r(unit-ret) = -0.095 · AUC = 0.468

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 196 | 109-87  |   55.6% |     +2.8% |
| MID (p33–p67)     | 2.000 … 2.000            | 147 | 86-61   |   58.5% |     +4.5% |
| HIGH (> p67)      | 10.000 … 3.000           | 147 | 70-77   |   47.6% |     -5.9% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `countMargin` · r(unit-ret) = -0.092 · AUC = 0.470

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -1.000 … 0.000           | 106 | 61-45   |   57.5% |     +4.7% |
| MID (p33–p67)     | 1.000 … 1.000            |  70 | 34-36   |   48.6% |     -3.7% |
| HIGH (> p67)      | 3.000 … 6.000            |  76 | 44-32   |   57.9% |     +3.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `provenTotal` · r(unit-ret) = -0.092 · AUC = 0.467

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 2.000 … 1.000            | 245 | 137-108 |   55.9% |     +2.3% |
| MID (p33–p67)     | 3.000 … 3.000            | 102 | 56-46   |   54.9% |     +1.0% |
| HIGH (> p67)      | 13.000 … 5.000           | 143 | 72-71   |   50.3% |     -3.0% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd forCount    | wd contribFor  | provenFor      | countMargin    | provenTotal    | V12 forCount   | V12 agMean     | wd contribMargin |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd forCount |  1.000         |         +0.917 |         +0.916 |         +0.632 |         +0.823 |         +0.971 |         +0.485 |         +0.631 |
| wd contribFor |         +0.917 |  1.000         |         +0.878 |         +0.499 |         +0.832 |         +0.903 |         +0.590 |         +0.677 |
| provenFor   |         +0.916 |         +0.878 |  1.000         |         +0.548 |         +0.909 |         +0.890 |         +0.518 |         +0.614 |
| countMargin |         +0.632 |         +0.499 |         +0.548 |  1.000         |         +0.263 |         +0.664 |         -0.016 |         +0.776 |
| provenTotal |         +0.823 |         +0.832 |         +0.909 |         +0.263 |  1.000         |         +0.802 |         +0.652 |         +0.362 |
| V12 forCount |         +0.971 |         +0.903 |         +0.890 |         +0.664 |         +0.802 |  1.000         |         +0.488 |         +0.620 |
| V12 agMean  |         +0.485 |         +0.590 |         +0.518 |         -0.016 |         +0.652 |         +0.488 |  1.000         |         +0.068 |
| wd contribMargin |         +0.631 |         +0.677 |         +0.614 |         +0.776 |         +0.362 |         +0.620 |         +0.068 |  1.000         |

> 🔴 **Strong collinearity detected:** `wd forCount` and `V12 forCount` have r = +0.971. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 252 picks · features = 8 (+ intercept) · multiple R² = **0.0270** · adjusted R² = **-0.0092** · residual sd = 0.959

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | countMargin          |     |    -0.3021 |   0.1584 | -1.91 (~sig) |        1 |
|    2 | wd contribFor        |     |    -0.2938 |   0.2643 | -1.11        |        2 |
|    3 | wd contribMargin     |     |    +0.1817 |   0.1652 | +1.10        |        3 |
|    4 | provenFor            |     |    +0.1739 |   0.2624 | +0.66        |        4 |
|    5 | V12 forCount         |  🟢 |    +0.1541 |   0.3008 | +0.51        |        5 |
|    6 | provenTotal          |     |    -0.1305 |   0.2336 | -0.56        |        6 |
|    7 | wd forCount          |     |    +0.0881 |   0.3096 | +0.28        |        7 |
|    8 | V12 agMean           |  🟢 |    -0.0475 |   0.0943 | -0.50        |        8 |
| —    | (intercept)          |     |    +0.0415 |   0.0604 |    +0.69 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forCount` (β = +0.154), `V12 agMean` (β = -0.048)
- V12 IGNORES: `countMargin` (β = -0.302, t = -1.91), `wd contribFor` (β = -0.294, t = -1.11), `wd contribMargin` (β = +0.182, t = +1.10), `provenFor` (β = +0.174, t = +0.66), `provenTotal` (β = -0.130, t = -0.56), `wd forCount` (β = +0.088, t = +0.28)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.518 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.545 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.027.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `countMargin` (β = -0.302, t = -1.91). They have a real multivariate effect after controlling for V12's existing inputs.
- Sample size is currently 490 live picks — statistically meaningful but tight. Treat single-feature recommendations as provisional until N ≥ 500. The rankings will firm up as the daily cron accumulates more graded picks.
- Adjusted R² of -0.0092 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for V12 monitoring. Imports the active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*