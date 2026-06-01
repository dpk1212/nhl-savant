# AGS-Unified — Daily Monitoring Report

**Generated:** Monday, June 1, 2026 at 8:36 AM ET
**Active model:** `ags-unified-v11` · **AGS-U cutover:** 2026-05-14 · **Days live:** 18

> **Scope.** Every row in this report comes from picks AGS-U actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0a — Active Model

The composite scoring model — what every lock/mute/sizing decision is built on. Pulled at runtime from `src/lib/ags.js` so this report never drifts.

**Schema version:** `ags-unified-v11`
**Calibration source:** `cron` · sample N = 705 · range 2026-04-18 → 2026-05-30

### Features & coefficients (logistic-regression β on z-scored features)

| feature           | family         | direction       | β        | meaning |
|-------------------|----------------|-----------------|----------|---------|
| intercept         | —              | —               | +0.0887 | baseline log-odds |
| `dCount`           | COUNT          | PRO-CONSENSUS   | +0.5371 | count(proven wallets FOR) − count(AGAINST) |
| `dHcSizeRatio`     | INTENSITY_HC   | PRO-CONSENSUS   | +0.2787 | Σ sizeRatio of HC wallets FOR − AGAINST |
| `dSumRankNorm`     | QUALITY_RANK   | CONTRARIAN      | -0.2740 | Σ leaderboard rankNorm FOR − AGAINST (more rank quality FOR ⇒ contrarian flag) |
| `dWinnerCtPreA`    | QUALITY_TRACK  | CONTRARIAN      | -0.1916 | count of pre-D winning wallets FOR − AGAINST (more known winners FOR ⇒ contrarian flag) |

**Score range:** sigmoid(score) ≈ P(WIN | features). Score is summed weight·z(feature) plus intercept. **Tier ladder** uses calibration quintiles: ELITE ≥ q90 (2×), PREMIUM ≥ q80 (1.5×), LOCK ≥ q60 (1.1×), LEAN ≥ q40 (0.5×), WEAK ≥ q20 (0.2×), FADE < q20 (HARD MUTE 0×).

> **2 PRO-CONSENSUS · 2 CONTRARIAN features.** Negative-β features fade-the-obvious-sharps: when known-winning wallets pile heavily on one side, that side WINS LESS often (the line has already moved). The model balances both effects.

## § 0b — AGS-U Model Version Comparison

How does the latest model (**ags-unified-v11**) compare against prior versions? Picks are tagged by the calibration that scored them — v11 by feature-signature (`dSumRankNorm` / `dWinnerCtPreA` present in components), earlier versions by pick date against the calibration-history cutover schedule below.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → present      |    8 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | 🟢 LIVE  |

### v11 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v11 − v9           | +   51 |    +1.6pp |    +11.8pp |          +0.234 |   -0.105 |    +0.0758 | 🟡 mixed |
| v11 − v10          | +   49 |    +6.6pp |    +21.6pp |          +0.374 |   +0.050 |    +0.0162 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **12 picks shipped at 0u despite AGS-U ≥ +0.10 and tier ∉ {FADE, WEAK}.** Sizing pipeline regression — see §10 for doc IDs. `v8_agsUnitsMult` should be > 0 for these.

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     10 | 5-5 |  50.0% |      4.1% |      +0.97 |    -0.23% |     2.38u |       -0.55 | 4 (3-1) |
| Last 3 days |     52 | 27-25 |  51.9% |     -1.2% |      -1.24 |    -0.56% |     2.02u |       -0.24 | 7 (4-3) |
| Last 7 days |    111 | 61-50 |  55.0% |      2.8% |      +6.76 |    -0.42% |     2.15u |       -0.02 | 22 (12-10) |
| All-time   |    234 | 124-110 |  53.0% |     -4.6% |     -21.33 |    +0.04% |     1.97u |       -0.39 | 48 (24-24) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   40 | 20-20  |  50.0% |     -6.5% |      -9.36 |     +2.26 |     3.62u |
| PREMIUM  | q80–q90     | 1.50×   |   37 | 18-19  |  48.6% |    -11.0% |     -11.17 |     +0.77 |     2.76u |
| LOCK     | q60–q80     | 1.10×   |   51 | 25-26  |  49.0% |    -10.8% |     -11.77 |     +0.55 |     2.14u |
| LEAN     | q40–q60     | 0.50×   |   68 | 40-28  |  58.8% |     12.4% |      +9.52 |     +0.17 |     1.13u |
| WEAK     | q20–q40     | 0.20×   |   35 | 20-15  |  57.1% |      9.7% |      +2.53 |     -0.66 |     0.75u |
| FADE     | < q20       | 0.00×   |    3 | 1-2    |  33.3% |    -47.0% |      -1.08 |     -1.44 |     0.77u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `-1` 🟡 partial — ladder mostly works but has noise
- ROI across tiers:   `-1` 🟡 partial

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) | Calibrated P(WIN) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|-------------------|
| Q1       |    3 | 1-2    |  33.3% |    -47.0% |      -1.08 |     -1.44 |               50.3% |             19.2% |
| Q2       |   46 | 28-18  |  60.9% |     18.2% |      +6.55 |     -0.50 |               51.1% |             37.7% |
| Q3       |   57 | 32-25  |  56.1% |      8.2% |      +5.50 |     +0.19 |               53.7% |             54.8% |
| Q4       |   52 | 26-26  |  50.0% |     -9.5% |     -10.55 |     +0.55 |               53.7% |             63.3% |
| Q5       |   76 | 37-39  |  48.7% |     -8.9% |     -21.75 |     +1.53 |               54.3% |             82.2% |

**Spearman ρ (quintile vs realized win%):** 0.000  ·  monotonicity `-2/4`

> **Calibrated P(WIN)** = sigmoid(avg AGS-U) — what the model would predict from each quintile's average score. Compare to **Win %** column: if model probability ≈ realized win rate, the score is well-calibrated as a probability and not just a discriminative ranker.

## § 2a — Model Ranking Quality

How well does AGS-U rank winners above losers, overall and per sport? **AUC ≥ 0.55** is meaningful at our sample sizes; **AUC > 0.60** is strong; **AUC ≈ 0.50** is chance. **Brier** measures probability calibration (lower = better, 0.25 = coin-flip prior, sub-0.24 = beats market).

### Overall (since cutover)

| N | AUC   | Spearman ρ | Pt-biserial r | Brier (model) | Brier (market) | Δ vs market |
|---|-------|------------|---------------|---------------|----------------|-------------|
| 281 | 0.471 | -0.072 | 0.046 | 0.2870 | 0.2418 | -0.0452 |

### Per sport

| Sport | N    | AUC   | Spearman ρ | Top Q (Q5) WR | Bot Q (Q1) WR | Q5−Q1 gap |
|-------|------|-------|------------|---------------|---------------|-----------|
| MLB   |  218 | 0.461 |     -0.110 |         50.0% |          0.0% | +50.0pp |
| NBA   |   41 | 0.564 |      0.215 |         46.7% |          0.0% | +46.7pp |
| NHL   |   22 | 0.581 |      0.075 |         45.5% |        100.0% | -54.5pp |

> **Reading this table:** the largest Q5−Q1 gap = the sport where AGS-U is doing the most work. Negative AUC (< 0.5) on a sport = the model is anti-predictive there and may need a per-sport coefficient set (see `scripts/_agsu_final_fit.mjs`).

## § 3 — Univariate Feature Analysis (active features)

Each active AGS-U feature scored on its own against W/L. **Corr(WIN)** should match the model's sign — positive features should correlate +, contrarian features should correlate −. **Lift** = top-decile ROI − bottom-decile ROI, in percentage points; positive lift means the feature is earning its slot.

| Feature           | Family         | Sign | β       | N    | Mean   | SD     | Corr(WIN) | Sign OK? | Top-dec ROI | Bot-dec ROI | Lift   |
|-------------------|----------------|------|---------|------|--------|--------|-----------|----------|-------------|-------------|--------|
| Δcount            | COUNT          | +    |  +0.537 |  281 |   0.17 |   1.12 |    -0.074 | 🚨 flipped |      -26.7% |       19.7% | -46.4pp |
| ΔHCsizeRatio      | INTENSITY_HC   | +    |  +0.279 |  281 |   0.16 |   1.18 |    -0.084 | 🚨 flipped |      -46.6% |       11.5% | -58.1pp |
| ΔΣrankNorm        | QUALITY_RANK   | −    |  -0.274 |  133 |   0.11 |   1.14 |    -0.274 | 🟢       |      -12.5% |       49.8% | -62.4pp |
| Δwinners          | QUALITY_TRACK  | −    |  -0.192 |  133 |  -0.03 |   0.88 |    -0.045 | 🟢       |      -33.8% |        1.3% | -35.1pp |

> **Sign OK?** column flags features where the empirical correlation disagrees with the model's coefficient sign — a model-vs-data mismatch worth investigating. Weak (|corr| < 0.03) is shown but rarely actionable.

### Legacy features (no longer weighted in score — present on older picks for back-compat)

| Feature           | N (historical) | Mean   | Corr(WIN) | Top-dec ROI | Bot-dec ROI | Lift   |
|-------------------|----------------|--------|-----------|-------------|-------------|--------|
| ΔHCcount          |            186 |   0.11 |    -0.078 |      -65.0% |        4.6% | -69.7pp |
| ΔavgConv          |            186 |  -0.05 |    +0.073 |        7.0% |      -32.5% | +39.4pp |
| forShare          |            186 |   0.05 |    +0.134 |        9.4% |      -86.1% | +95.5pp |

## § 3a — Feature Contribution Attribution

Decomposes the average WINNER vs LOSER along each active feature's contribution to the score (β · z). **Winner > Loser** is what we want — the feature is pushing wins up and losses down. If Winner ≤ Loser on a feature, that feature is fighting the model on real data.

| Feature           | β        | Avg contrib (WIN) | Avg contrib (LOSS) | Δ (WIN − LOSS) | Verdict |
|-------------------|----------|-------------------|--------------------|----------------|---------|
| Δcount            |  +0.5371 |            +0.160 |             +0.244 |         -0.084 | 🚨 hurting |
| ΔHCsizeRatio      |  +0.2787 |            +0.033 |             +0.075 |         -0.042 | 🚨 hurting |
| ΔΣrankNorm        |  -0.2740 |            +0.012 |             -0.045 |         +0.057 | 🟢 helping |
| Δwinners          |  -0.1916 |            +0.006 |             +0.001 |         +0.006 | 🟡 neutral |

> Contribution = β · z(feature). The sum across all features (plus intercept) is the AGS-U score. A feature is "helping" if its average contribution is higher on winners than losers — i.e. the feature is correctly orienting the score.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier?

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 16n 62.5% +2% | 14n 50.0% +11% | 10n 30.0% -44% | 40n 50.0% -6% |
| PREMIUM  | 18n 50.0% +5% | 15n 46.7% -22% | 4n 50.0% -21% | 37n 48.6% -11% |
| LOCK     | 32n 46.9% -8% | 16n 62.5% +11% | 3n 0.0% -100% | 51n 49.0% -11% |
| LEAN     | 50n 60.0% +11% | 16n 56.3% +13% | 2n 50.0% +56% | 68n 58.8% +12% |
| WEAK     | 15n 60.0% +53% | 20n 55.0% -34% | —            | 35n 57.1% +10% |
| FADE     | 3n 33.3% -47% | —            | —            | 3n 33.3% -47% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 23n 52.2% -2%  | 13n 46.2% -15% | 4n 50.0% -4%   | 40n 50.0% -6%  |
| PREMIUM  | 28n 50.0% -5%  | 2n 50.0% -24%  | 7n 42.9% -33%  | 37n 48.6% -11% |
| LOCK     | 45n 51.1% -3%  | 4n 25.0% -63%  | 2n 50.0% -42%  | 51n 49.0% -11% |
| LEAN     | 61n 60.7% +23% | 2n 50.0% -1%   | 5n 40.0% -74%  | 68n 58.8% +12% |
| WEAK     | 28n 57.1% -10% | 6n 66.7% +69%  | 1n 0.0% -100%  | 35n 57.1% +10% |
| FADE     | 1n 0.0% -100%  | 1n 0.0% -100%  | 1n 100.0% +63% | 3n 33.3% -47%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 6n 100.0% +40% | 7n 28.6% -57% | 21n 57.1% +19% | 6n 0.0% -100% | —             |
| PREMIUM  | 6n 66.7% +5%  | 9n 66.7% +18% | 13n 46.2% -25% | 7n 28.6% -31% | 2n 0.0% -100% |
| LOCK     | 1n 100.0% +24% | 13n 61.5% -12% | 29n 37.9% -27% | 5n 60.0% +31% | 3n 66.7% +77% |
| LEAN     | 4n 75.0% -14% | 22n 45.5% -26% | 31n 67.7% +39% | 10n 60.0% +49% | 1n 0.0% -100% |
| WEAK     | —             | 4n 100.0% +66% | 20n 50.0% +3% | 10n 50.0% -29% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | 2n 0.0% -100% | —             | —             |

## § 5 — Calibration Reliability (band × realized)

Slice AGS-U into bands derived from the LIVE calibration and compare average implied probability (from market odds) to realized win rate. **Realized > Implied** = AGS-U finds edge the market doesn't price; **Realized ≈ Implied** = AGS-U is just re-stating favorite-ness; **Realized < Implied** = anti-edge.

| AGS-U Band       | N    | Realized Win | Model P(WIN) | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|--------------|-------------|-------------|-----------|
| ≥ q90 (≥ +0.46)  |   72 |        52.8% |        75.8% |       53.7% |      -0.9pp |     -7.7% |
| q80–q90          |   37 |        40.5% |        59.2% |       54.3% |     -13.8pp |    -20.9% |
| q60–q80          |   41 |        53.7% |        55.1% |       54.6% |      -0.9pp |      8.2% |
| q40–q60          |   49 |        57.1% |        51.5% |       53.4% |      +3.8pp |     10.8% |
| q20–q40          |   17 |        58.8% |        47.8% |       50.9% |      +8.0pp |     13.8% |
| < q20 (< -0.16)  |   18 |        61.1% |        27.3% |       49.9% |     +11.2pp |      9.4% |

**Brier — model:** 0.2870  ·  **Brier — market-implied:** 0.2418 (lower = better; 0.25 = coin-flip prior). Δ = -0.0452 (positive = model beats market).
**Edge correlation (realized vs implied):** Spearman ρ = -0.829.

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Top Driver           | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|----------------------|---------|------------|--------|
| 2026-05-31 | MLB   | TOTAL  | Over 9.5                |  +101 |  1.65u |  +0.24 | LOCK    | Q4   |   +1 | Δcount +0.31         | LOSS    |     -1.65u |  +0.2% |
| 2026-05-31 | MLB   | TOTAL  | Under 9                 |  -114 |  1.65u |  +0.21 | LOCK    | Q4   |   +0 | Δcount +0.67         | LOSS    |     -1.65u |  +1.1% |
| 2026-05-31 | MLB   | SPREAD | Los Angeles Angels      |  -117 |  0.00u |  +0.26 | LOCK    | Q4   |   +1 | Δcount +0.67         | TRACKED |      0.00u |  -0.4% |
| 2026-05-31 | MLB   | ML     | Toronto Blue Jays       |  +110 |  1.25u |  +0.07 | LEAN    | Q3   |   +0 | Δcount -0.43         | LOSS    |     -1.25u |  -1.5% |
| 2026-05-31 | MLB   | ML     | San Francisco Giants    |  -112 |  0.00u |  -0.57 | FADE    | Q1   |   -1 | Δcount -1.16         | TRACKED |      0.00u |  +0.0% |
| 2026-05-31 | MLB   | ML     | Washington Nationals    |  -102 |  5.00u |  +0.80 | ELITE   | Q5   |   +1 | Δcount +0.31         | WIN     |     +4.90u |  +0.0% |
| 2026-05-31 | MLB   | ML     | Los Angeles Dodgers     |  -235 |  1.25u |  +0.11 | LEAN    | Q3   |   +0 | Δwinners +0.08       | WIN     |     +0.53u |  +0.5% |
| 2026-05-31 | MLB   | ML     | New York Yankees        |  -184 |  1.25u |  +0.05 | LEAN    | Q3   |   +0 | Δcount -0.43         | WIN     |     +0.68u |  +0.0% |
| 2026-05-31 | MLB   | ML     | Milwaukee Brewers       |  -193 |  0.00u |  +0.07 | LEAN    | Q3   |   +2 | ΔHCsizeRatio +0.14   | TRACKED |      0.00u |  -0.6% |
| 2026-05-31 | MLB   | ML     | New York Mets           |  -164 |  3.75u |  +0.37 | PREMIUM | Q5   |   +1 | Δcount +0.31         | WIN     |     +2.29u |  -2.1% |
| 2026-05-31 | MLB   | ML     | Detroit Tigers          |  +115 |  2.50u |  +0.43 | PREMIUM | Q5   |   +0 | Δcount +0.31         | LOSS    |     -2.50u |  -0.2% |
| 2026-05-31 | MLB   | ML     | St. Louis Cardinals     |  -116 |  2.75u |  +0.24 | LOCK    | Q4   |   +1 | ΔΣrankNorm +0.15     | WIN     |     +2.37u |  +0.0% |
| 2026-05-31 | MLB   | ML     | Boston Red Sox          |  -102 |  0.00u |  -0.36 | FADE    | Q1   |   +0 | Δcount -0.79         | TRACKED |      0.00u |  +0.2% |
| 2026-05-31 | MLB   | ML     | Atlanta Braves          |  -126 |  2.75u |  +0.20 | LOCK    | Q4   |   +0 | ΔHCsizeRatio +0.12   | LOSS    |     -2.75u |  -0.4% |
| 2026-05-30 | NBA   | TOTAL  | Under 213               |  +102 |  2.50u |  +1.41 | ELITE   | Q5   |   +0 | Δcount +1.78         | LOSS    |     -2.50u |  -1.4% |
| 2026-05-30 | MLB   | TOTAL  | Under 7.5               |  -108 |  0.75u |  +0.09 | LEAN    | Q3   |   +0 | Δwinners +0.09       | LOSS    |     -0.75u |  +0.0% |
| 2026-05-30 | MLB   | TOTAL  | Under 8.5               |  -107 |  1.65u |  +0.23 | LOCK    | Q4   |   +0 | ΔΣrankNorm +0.17     | LOSS    |     -1.65u |  +0.0% |
| 2026-05-30 | MLB   | TOTAL  | Over 8.5                |  -116 |  2.25u |  +0.43 | PREMIUM | Q5   |   +0 | Δcount +0.31         | WIN     |     +1.94u |  +0.0% |
| 2026-05-30 | MLB   | TOTAL  | Over 8                  |  +100 |  0.75u |  +0.06 | LEAN    | Q3   |   +1 | Δwinners -0.07       | WIN     |     +0.75u |  -0.2% |
| 2026-05-30 | NBA   | SPREAD | Spurs                   |  -110 |  0.00u |  -0.56 | FADE    | Q1   |   -1 | Δcount -1.53         | TRACKED |      0.00u |  +1.6% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   40 |      144.75 |      -9.36 |     -6.5% |      -0.23 |          -0.065 |
| PREMIUM  |   37 |      102.00 |     -11.17 |    -11.0% |      -0.30 |          -0.110 |
| LOCK     |   51 |      109.30 |     -11.77 |    -10.8% |      -0.23 |          -0.108 |
| LEAN     |   68 |       76.80 |      +9.52 |     12.4% |      +0.14 |          +0.124 |
| WEAK     |   35 |       26.15 |      +2.53 |      9.7% |      +0.07 |          +0.097 |
| FADE     |    3 |        2.30 |      -1.08 |    -47.0% |      -0.36 |          -0.470 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). Live q20 = **-0.146**. We validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **59** · Win rate: **55.9%** · Flat-1u PnL: **+2.39u** · ROI: **4.1%**
- Verdict: 🚨 Mute floor may be too aggressive — SHADOWed picks win at ≥52%.

## § 9 — Daily Trend (cumulative PnL)

| Date       | Live | W-L   | Win %  | Daily PnL  | Cum PnL    | Cum Win % | Trk | Bar                  |
|------------|------|-------|--------|------------|------------|-----------|-----|----------------------|
| 2026-05-14 |    1 | 1-0   | 100.0% |      +1.71 |      +1.71 |    100.0% |   0 | █                    |
| 2026-05-15 |    7 | 4-3   |  57.1% |      -0.36 |      +1.35 |     62.5% |   2 | █                    |
| 2026-05-16 |    6 | 4-2   |  66.7% |      +1.41 |      +2.76 |     64.3% |   3 | ██                   |
| 2026-05-17 |    9 | 5-4   |  55.6% |      -0.09 |      +2.67 |     60.9% |   2 | ██                   |
| 2026-05-18 |    8 | 4-4   |  50.0% |      -2.71 |      -0.04 |     58.1% |   2 |                      |
| 2026-05-19 |    8 | 3-5   |  37.5% |      -6.20 |      -6.24 |     53.8% |   0 |                 ▓▓▓▓ |
| 2026-05-20 |   10 | 6-4   |  60.0% |      +2.63 |      -3.61 |     55.1% |   1 |                  ▓▓▓ |
| 2026-05-21 |   12 | 6-6   |  50.0% |      -5.06 |      -8.67 |     54.1% |   2 |               ▓▓▓▓▓▓ |
| 2026-05-22 |   20 | 8-12  |  40.0% |     -17.17 |     -25.84 |     50.6% |   3 |   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-23 |   23 | 15-8  |  65.2% |      +7.70 |     -18.14 |     53.8% |   4 |        ▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-24 |   19 | 7-12  |  36.8% |      -9.95 |     -28.09 |     51.2% |   7 | ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-25 |   19 | 11-8  |  57.9% |      +0.05 |     -28.04 |     52.1% |   3 | ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-26 |   18 | 12-6  |  66.7% |     +13.88 |     -14.16 |     53.8% |   4 |           ▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-27 |   16 | 8-8   |  50.0% |      -7.70 |     -21.86 |     53.4% |   6 |     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-28 |    6 | 3-3   |  50.0% |      +1.77 |     -20.09 |     53.3% |   2 |       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-29 |   23 | 11-12 |  47.8% |      -0.53 |     -20.62 |     52.7% |   0 |      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-30 |   19 | 11-8  |  57.9% |      -1.68 |     -22.30 |     53.1% |   3 |     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-31 |   10 | 5-5   |  50.0% |      +0.97 |     -21.33 |     53.0% |   4 |      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.
> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    58 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     0 | 🟡 no live shipped picks pending |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    48 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-31T14:22:18.065Z
- **Schema version:** `ags-unified-v11`
- **Source:** cron
- **Sample size:** 705
- **Date range:** 2026-04-18 → 2026-05-30
- **Absolute mute floor:** -1.00 (safety bound below q20)

**AGS-U quintile boundaries (logit-score space):**

| Boundary | Value      | Action                |
|----------|------------|-----------------------|
| q20      |    -0.1462 | HARD MUTE floor       |
| q40      |    -0.0031 | LEAN floor (0.5×)     |
| q50      |    +0.0638 | 50th pctile           |
| q60      |    +0.1245 | LOCK floor (1.10×)    |
| q80      |    +0.3056 | PREMIUM floor (1.50×) |
| q90      |    +0.5388 | ELITE floor (2.00×)   |

**Feature normalizers (mean / sd) — z-scoring inputs to the model:**

| Feature           | β        | Mean   | SD     |
|-------------------|----------|--------|--------|
| Δcount            |  +0.5371 |   1.16 |   1.47 |
| ΔHCsizeRatio      |  +0.2787 |   1.30 |   5.24 |
| ΔΣrankNorm        |  -0.2740 |  62.72 |  90.90 |
| Δwinners          |  -0.1916 |   0.50 |   1.14 |

> ✅ Calibration weights match `src/lib/ags.js` — no drift.

## § 12 — Wallet Pool Health

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            114 |        26 |    9 |    6 |   73 |                     41 |
| NBA   |            193 |        54 |   22 |   20 |   97 |                     96 |
| NHL   |             95 |        19 |    6 |   14 |   56 |                     39 |

> ⚠ **MLB pool is < 50% of NBA pool** (41 vs 96). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified monitoring. Imports active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*