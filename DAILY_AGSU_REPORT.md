# AGS-Unified — Daily Monitoring Report

**Generated:** Thursday, June 4, 2026 at 5:15 PM ET
**Active model:** `ags-unified-v12` · **AGS-U cutover:** 2026-05-14 · **Days live:** 21

> **Scope.** Every row in this report comes from picks AGS-U actually promoted (any `promotedBy` value matching `ags-unified-v*` — covers every v9 → v12 bump). Picks promoted by legacy v7/v8 routes are excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0a — Active Model

The composite scoring model — what every lock/mute/sizing decision is built on. Pulled at runtime from `src/lib/ags.js` so this report never drifts.

**Schema version:** `ags-unified-v12`
**Calibration source:** `cron` · sample N = 799 · range 2026-04-18 → 2026-06-03

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

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |    4 |     40 |  21 | 21-19  |  52.5% |      6.6% |      +4.90 |    +0.12 | 0.551 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           |   -20 |    -0.8pp |    +15.5pp |          +0.295 |   +0.002 |          — | 🟡 mixed |
| v12 − v10          |   -22 |    +4.1pp |    +25.3pp |          +0.436 |   +0.157 |          — | 🟢 better |
| v12 − v11          |   -71 |    -2.5pp |     +3.7pp |          +0.062 |   +0.107 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 37n 51.4% +1%  | 2n 50.0% -2%   | 1n 100.0% +87% | 40n 52.5% +7% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 7n +6%        | 11n +8%       | 10n +1%       | 7n +36%       | 4n -51%       | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **12 picks shipped at 0u despite AGS-U ≥ +0.10 and tier ∉ {FADE, WEAK}.** Sizing pipeline regression — see §10 for doc IDs. `v8_agsUnitsMult` should be > 0 for these.

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     19 | 11-8 |  57.9% |      2.3% |      +0.82 |    -0.32% |     1.91u |        0.47 | 5 (1-4) |
| Last 3 days |     40 | 21-19 |  52.5% |      6.6% |      +4.90 |    -0.32% |     1.87u |        0.09 | 21 (9-12) |
| Last 7 days |     98 | 51-47 |  52.0% |      2.8% |      +5.43 |    -0.38% |     1.98u |       -0.17 | 30 (14-16) |
| All-time   |    274 | 145-129 |  52.9% |     -3.1% |     -16.43 |    -0.03% |     1.96u |       -0.33 | 69 (33-36) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   47 | 24-23  |  51.1% |     -4.3% |      -7.50 |     +1.90 |     3.72u |
| PREMIUM  | q80–q90     | 1.50×   |   48 | 24-24  |  50.0% |     -6.6% |      -8.70 |     +0.59 |     2.75u |
| LOCK     | q60–q80     | 1.10×   |   61 | 30-31  |  49.2% |     -9.8% |     -11.71 |     +0.43 |     1.96u |
| LEAN     | q40–q60     | 0.50×   |   75 | 45-30  |  60.0% |     13.4% |     +10.79 |     +0.16 |     1.07u |
| WEAK     | q20–q40     | 0.20×   |   39 | 21-18  |  53.8% |      7.4% |      +2.02 |     -0.51 |     0.70u |
| FADE     | < q20       | 0.00×   |    3 | 1-2    |  33.3% |    -47.0% |      -1.08 |     -0.78 |     0.77u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `-3` 🟡 partial — ladder mostly works but has noise
- ROI across tiers:   `-3` 🟡 partial

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) | Calibrated P(WIN) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|-------------------|
| Q1       |   20 | 9-11   |  45.0% |    -24.6% |      -9.05 |     -1.06 |               50.7% |             25.7% |
| Q2       |   55 | 33-22  |  60.0% |     18.9% |      +9.80 |     -0.42 |               51.2% |             39.6% |
| Q3       |   61 | 34-27  |  55.7% |      6.8% |      +5.29 |     +0.18 |               54.0% |             54.6% |
| Q4       |   54 | 28-26  |  51.9% |     -5.1% |      -5.96 |     +0.52 |               53.5% |             62.6% |
| Q5       |   84 | 41-43  |  48.8% |     -6.5% |     -16.51 |     +1.36 |               54.1% |             79.6% |

**Spearman ρ (quintile vs realized win%):** 0.000  ·  monotonicity `-2/4`

> **Calibrated P(WIN)** = sigmoid(avg AGS-U) — what the model would predict from each quintile's average score. Compare to **Win %** column: if model probability ≈ realized win rate, the score is well-calibrated as a probability and not just a discriminative ranker.

## § 2a — Model Ranking Quality

How well does AGS-U rank winners above losers, overall and per sport? **AUC ≥ 0.55** is meaningful at our sample sizes; **AUC > 0.60** is strong; **AUC ≈ 0.50** is chance. **Brier** measures probability calibration (lower = better, 0.25 = coin-flip prior, sub-0.24 = beats market).

### Overall (since cutover)

| N | AUC   | Spearman ρ | Pt-biserial r | Brier (model) | Brier (market) | Δ vs market |
|---|-------|------------|---------------|---------------|----------------|-------------|
| 342 | 0.465 | -0.112 | 0.037 | 0.2854 | 0.2456 | -0.0398 |

### Per sport

| Sport | N    | AUC   | Spearman ρ | Top Q (Q5) WR | Bot Q (Q1) WR | Q5−Q1 gap |
|-------|------|-------|------------|---------------|---------------|-----------|
| MLB   |  275 | 0.461 |     -0.151 |         50.9% |         44.4% | +6.4pp |
| NBA   |   44 | 0.536 |      0.180 |         43.8% |          0.0% | +43.8pp |
| NHL   |   23 | 0.554 |      0.023 |         45.5% |        100.0% | -54.5pp |

> **Reading this table:** the largest Q5−Q1 gap = the sport where AGS-U is doing the most work. Negative AUC (< 0.5) on a sport = the model is anti-predictive there and may need a per-sport coefficient set (see `scripts/_agsu_final_fit.mjs`).

## § 3 — Univariate Feature Analysis (active features)

Each active AGS-U feature scored on its own against W/L. **Corr(WIN)** should match the model's sign — positive features should correlate +, contrarian features should correlate −. **Lift** = top-decile ROI − bottom-decile ROI, in percentage points; positive lift means the feature is earning its slot.

| Feature           | Family         | Sign | β       | N    | Mean   | SD     | Corr(WIN) | Sign OK? | Top-dec ROI | Bot-dec ROI | Lift   |
|-------------------|----------------|------|---------|------|--------|--------|-----------|----------|-------------|-------------|--------|
| Δcount            | COUNT          | +    |  +0.537 |  342 |   0.13 |   1.10 |    -0.055 | 🚨 flipped |      -19.4% |       -8.8% | -10.6pp |
| ΔHCsizeRatio      | INTENSITY_HC   | +    |  +0.279 |  342 |   0.13 |   1.15 |    -0.093 | 🚨 flipped |      -41.4% |       -1.6% | -39.8pp |
| ΔΣrankNorm        | QUALITY_RANK   | −    |  -0.274 |  194 |   0.05 |   1.11 |    -0.187 | 🟢       |       -5.3% |       40.3% | -45.6pp |
| Δwinners          | QUALITY_TRACK  | −    |  -0.192 |  194 |  -0.00 |   0.88 |    +0.040 | 🚨 flipped |       13.2% |      -15.7% | +28.8pp |

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
| Δcount            |  +0.5371 |            +0.143 |             +0.195 |         -0.053 | 🚨 hurting |
| ΔHCsizeRatio      |  +0.2787 |            +0.019 |             +0.070 |         -0.051 | 🚨 hurting |
| ΔΣrankNorm        |  -0.2740 |            +0.011 |             -0.040 |         +0.051 | 🟢 helping |
| Δwinners          |  -0.1916 |            -0.012 |             -0.007 |         -0.005 | 🟡 neutral |

> Contribution = β · z(feature). The sum across all features (plus intercept) is the AGS-U score. A feature is "helping" if its average contribution is higher on winners than losers — i.e. the feature is correctly orienting the score.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier?

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 21n 57.1% -5% | 15n 53.3% +14% | 11n 36.4% -28% | 47n 51.1% -4% |
| PREMIUM  | 27n 48.1% -0% | 16n 50.0% -16% | 5n 60.0% -4% | 48n 50.0% -7% |
| LOCK     | 41n 46.3% -9% | 16n 62.5% +11% | 4n 25.0% -80% | 61n 49.2% -10% |
| LEAN     | 55n 61.8% +13% | 18n 55.6% +12% | 2n 50.0% +56% | 75n 60.0% +13% |
| WEAK     | 17n 58.8% +51% | 21n 52.4% -35% | 1n 0.0% -100% | 39n 53.8% +7% |
| FADE     | 3n 33.3% -47% | —            | —            | 3n 33.3% -47% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 29n 51.7% -4%  | 13n 46.2% -15% | 5n 60.0% +21%  | 47n 51.1% -4%  |
| PREMIUM  | 39n 51.3% -2%  | 2n 50.0% -24%  | 7n 42.9% -33%  | 48n 50.0% -7%  |
| LOCK     | 55n 50.9% -3%  | 4n 25.0% -63%  | 2n 50.0% -42%  | 61n 49.2% -10% |
| LEAN     | 68n 61.8% +23% | 2n 50.0% -1%   | 5n 40.0% -74%  | 75n 60.0% +13% |
| WEAK     | 30n 53.3% -12% | 8n 62.5% +64%  | 1n 0.0% -100%  | 39n 53.8% +7%  |
| FADE     | 1n 0.0% -100%  | 1n 0.0% -100%  | 1n 100.0% +63% | 3n 33.3% -47%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 7n 100.0% +41% | 7n 28.6% -57% | 26n 53.8% +10% | 7n 14.3% -68% | —             |
| PREMIUM  | 6n 66.7% +5%  | 11n 63.6% +12% | 20n 50.0% -13% | 8n 37.5% -12% | 3n 0.0% -100% |
| LOCK     | 2n 100.0% +30% | 13n 61.5% -12% | 35n 34.3% -31% | 8n 75.0% +49% | 3n 66.7% +77% |
| LEAN     | 4n 75.0% -14% | 25n 48.0% -24% | 34n 67.6% +38% | 11n 63.6% +52% | 1n 0.0% -100% |
| WEAK     | 2n 0.0% -100% | 4n 100.0% +66% | 22n 50.0% +2% | 10n 50.0% -29% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | 2n 0.0% -100% | —             | —             |

## § 5 — Calibration Reliability (band × realized)

Slice AGS-U into bands derived from the LIVE calibration and compare average implied probability (from market odds) to realized win rate. **Realized > Implied** = AGS-U finds edge the market doesn't price; **Realized ≈ Implied** = AGS-U is just re-stating favorite-ness; **Realized < Implied** = anti-edge.

| AGS-U Band       | N    | Realized Win | Model P(WIN) | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|--------------|-------------|-------------|-----------|
| ≥ q90 (≥ +0.46)  |   77 |        51.9% |        74.7% |       54.0% |      -2.0pp |     -6.9% |
| q80–q90          |   40 |        42.5% |        59.4% |       53.3% |     -10.8pp |    -16.1% |
| q60–q80          |   43 |        55.8% |        55.1% |       54.4% |      +1.4pp |     13.2% |
| q40–q60          |   53 |        56.6% |        51.5% |       53.6% |      +3.0pp |      8.4% |
| q20–q40          |   27 |        59.3% |        47.7% |       51.2% |      +8.0pp |     19.0% |
| < q20 (< -0.16)  |   34 |        52.9% |        30.5% |       50.3% |      +2.6pp |    -17.6% |

**Brier — model:** 0.2854  ·  **Brier — market-implied:** 0.2456 (lower = better; 0.25 = coin-flip prior). Δ = -0.0398 (positive = model beats market).
**Edge correlation (realized vs implied):** Spearman ρ = -0.086.

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Top Driver           | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|----------------------|---------|------------|--------|
| 2026-06-04 | MLB   | TOTAL  | Over 8.5                |  -108 |  0.00u |  -0.20 | FADE    | Q1   |   +0 | Δcount -0.38         | TRACKED |      0.00u |  +0.0% |
| 2026-06-04 | MLB   | TOTAL  | Over 8.5                |  -110 |  1.00u |  -0.41 | LOCK    | Q1   |   -1 | ΔHCsizeRatio -0.23   | LOSS    |     -1.00u |  -1.4% |
| 2026-06-04 | MLB   | SPREAD | San Diego Padres        |  -110 |  0.00u |  +0.46 | FADE    | Q5   |   +0 | Δcount +0.32         | TRACKED |      0.00u |  +0.0% |
| 2026-06-04 | MLB   | ML     | Philadelphia Phillies   |  -215 |  1.00u |  -0.41 | LOCK    | Q1   |   +0 | ΔΣrankNorm -0.38     | WIN     |     +0.47u |  -0.4% |
| 2026-06-04 | MLB   | ML     | Baltimore Orioles       |  +104 |  0.50u |  -0.09 | LEAN    | Q2   |   +0 | Δwinners -0.08       | WIN     |     +0.52u |  -0.7% |
| 2026-06-03 | NBA   | TOTAL  | Over 217                |  -103 |  0.00u |  +0.53 | FADE    | Q5   |   +1 | Δwinners +0.75       | TRACKED |      0.00u |  +1.4% |
| 2026-06-03 | MLB   | TOTAL  | Under 8.5               |  +100 |  2.50u |  -0.31 | PREMIUM | Q1   |   +0 | Δcount -0.40         | LOSS    |     -2.50u |  -2.6% |
| 2026-06-03 | MLB   | TOTAL  | Under 8.5               |  -110 |  5.00u |  +0.08 | ELITE   | Q3   |   +0 | ΔΣrankNorm +0.18     | WIN     |     +4.55u |  -2.6% |
| 2026-06-03 | MLB   | TOTAL  | Under 8.5               |  +101 |  2.50u |  -0.31 | PREMIUM | Q1   |   +0 | Δcount -0.40         | WIN     |     +2.52u |  -2.6% |
| 2026-06-03 | MLB   | TOTAL  | Over 7.5                |  -110 |  0.25u |  +0.37 | WEAK    | Q5   |   +1 | ΔΣrankNorm +0.30     | LOSS    |     -0.25u |  -2.4% |
| 2026-06-03 | MLB   | TOTAL  | Over 8.5                |  -105 |  5.00u |  -0.25 | ELITE   | Q1   |   +0 | ΔΣrankNorm -0.14     | LOSS    |     -5.00u |  -1.4% |
| 2026-06-03 | MLB   | TOTAL  | Over 7.5                |  -102 |  3.00u |  -0.31 | PREMIUM | Q1   |   +0 | ΔHCsizeRatio -0.15   | LOSS    |     -3.00u |  -0.7% |
| 2026-06-03 | MLB   | TOTAL  | Under 8.5               |  -105 |  0.00u |  +0.49 | FADE    | Q5   |   +0 | ΔΣrankNorm +0.49     | TRACKED |      0.00u |  -1.2% |
| 2026-06-03 | NBA   | SPREAD | Knicks                  |  -105 |  0.25u |  +0.20 | WEAK    | Q4   |   -1 | Δcount +0.68         | WIN     |     +0.24u |  +0.5% |
| 2026-06-03 | MLB   | SPREAD | Los Angeles Dodgers     |  -120 |  1.00u |  -0.16 | LOCK    | Q1   |   +0 | Δcount -0.40         | WIN     |     +0.83u |  +2.1% |
| 2026-06-03 | MLB   | SPREAD | Detroit Tigers          |  -166 |  0.00u |  +0.43 | FADE    | Q5   |   +0 | Δcount +0.32         | TRACKED |      0.00u |  +1.0% |
| 2026-06-03 | NBA   | ML     | Spurs                   |  -190 |  0.25u |  +1.30 | WEAK    | Q5   |   +4 | Δcount +1.76         | LOSS    |     -0.25u |  -1.4% |
| 2026-06-03 | MLB   | ML     | Atlanta Braves          |  -148 |  0.50u |  -0.75 | LEAN    | Q1   |   +0 | Δcount -0.76         | WIN     |     +0.34u |  +0.3% |
| 2026-06-03 | MLB   | ML     | St. Louis Cardinals     |  -112 |  3.00u |  -0.07 | PREMIUM | Q2   |   +0 | Δwinners -0.08       | WIN     |     +2.68u |  +0.0% |
| 2026-06-03 | MLB   | ML     | Milwaukee Brewers       |  -132 |  0.00u |  +0.25 | FADE    | Q4   |   +0 | Δcount +0.32         | TRACKED |      0.00u |  +0.2% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   47 |      174.75 |      -7.50 |     -4.3% |      -0.16 |          -0.043 |
| PREMIUM  |   48 |      132.00 |      -8.70 |     -6.6% |      -0.18 |          -0.066 |
| LOCK     |   61 |      119.30 |     -11.71 |     -9.8% |      -0.19 |          -0.098 |
| LEAN     |   75 |       80.30 |     +10.79 |     13.4% |      +0.14 |          +0.134 |
| WEAK     |   39 |       27.15 |      +2.02 |      7.4% |      +0.05 |          +0.074 |
| FADE     |    3 |        2.30 |      -1.08 |    -47.0% |      -0.36 |          -0.470 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). Live q20 = **-0.148**. We validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **80** · Win rate: **56.3%** · Flat-1u PnL: **+5.32u** · ROI: **6.7%**
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
| 2026-06-01 |    8 | 4-4   |  50.0% |      +2.14 |     -19.19 |     52.9% |   4 |       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-06-02 |   10 | 4-6   |  40.0% |      +1.95 |     -17.24 |     52.4% |  10 |         ▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-06-03 |   19 | 11-8  |  57.9% |      +0.82 |     -16.42 |     52.8% |   5 |         ▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-06-04 |    3 | 2-1   |  66.7% |      -0.01 |     -16.43 |     52.9% |   2 |         ▓▓▓▓▓▓▓▓▓▓▓▓ |

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.
> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    84 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     9 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     2 | 🟡 some picks missing tier classification |
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

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-06-04T16:05:14.179Z
- **Schema version:** `ags-unified-v12`
- **Source:** cron
- **Sample size:** 799
- **Date range:** 2026-04-18 → 2026-06-03
- **Absolute mute floor:** -1.00 (safety bound below q20)

**AGS-U quintile boundaries (logit-score space):**

| Boundary | Value      | Action                |
|----------|------------|-----------------------|
| q20      |    -0.1478 | HARD MUTE floor       |
| q40      |    -0.0029 | LEAN floor (0.5×)     |
| q50      |    +0.0830 | 50th pctile           |
| q60      |    +0.1295 | LOCK floor (1.10×)    |
| q80      |    +0.3092 | PREMIUM floor (1.50×) |
| q90      |    +0.5106 | ELITE floor (2.00×)   |

**Feature normalizers (mean / sd) — z-scoring inputs to the model:**

| Feature           | β        | Mean   | SD     |
|-------------------|----------|--------|--------|
| Δcount            |  +0.5371 |   1.08 |   1.53 |
| ΔHCsizeRatio      |  +0.2787 |   1.16 |   4.80 |
| ΔΣrankNorm        |  -0.2740 |  57.74 |  89.63 |
| Δwinners          |  -0.1916 |   0.52 |   1.21 |

> ✅ Calibration weights match `src/lib/ags.js` — no drift.

## § 12 — Wallet Pool Health

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            119 |        28 |    9 |    8 |   74 |                     45 |
| NBA   |            194 |        50 |   23 |   22 |   99 |                     95 |
| NHL   |             96 |        20 |    6 |   13 |   57 |                     39 |

> ⚠ **MLB pool is < 50% of NBA pool** (45 vs 95). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

## § 13 — V12 Deep Performance Monitor

V12 went authoritative on **2026-06-01** (4 days live). This section monitors v12 IN PRODUCTION — every metric is scoped to AGSU-promoted picks dated ≥ 2026-06-01, so cron back-fill of v12 stamps onto historical v11-era picks cannot contaminate the numbers. Pool size: **61** graded picks · **89** sides total (graded + pending).

### A. V12 daily trajectory

Day-by-day production. **Evaluated** = AGSU picks made that day (graded + pending). **Live** = units > 0 and not tracked. **Muted** = FADE / 0u / tracked. **Cumulative PnL** is the running total of live PnL across v12's life.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-06-01 |        16 |    8 |     4 | 4-4        |  50.0% |     16.25 |      +2.14 |     13.2% |      +2.14 |
| 2026-06-02 |        24 |   10 |    10 | 4-6        |  40.0% |     19.75 |      +1.95 |      9.9% |      +4.09 |
| 2026-06-03 |        31 |   19 |     5 | 11-8       |  57.9% |     36.25 |      +0.82 |      2.3% |      +4.91 |
| 2026-06-04 |        17 |    3 |     2 | 2-1        |  66.7% |      2.50 |      -0.01 |     -0.4% |      +4.90 |
| 2026-06-05 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |      +4.90 |

### B. V12 production tier scoreboard

Performance broken down by the v12 tier the cron stamped at lock. **Expected** is the absolute-ladder target before odds-cap; **Avg stake actual** is the realised average (lower is fine on positive odds because `oddsCap` clamps long underdogs). **Drift** = Avg stake − Expected. Drift > 0 or drift < –1.0u on negative odds is a sizing-pipeline regression.

| Tier     | Ladder | N   | W-L    | Win %  | Avg AGS-v12 | Expected | Avg stake actual | Drift  | Total Stake | PnL (u)    | ROI       |
|----------|--------|-----|--------|--------|-------------|----------|------------------|--------|-------------|------------|-----------|
| ELITE    |  5.00u |   7 | 4-3    |  57.1% |      +0.987 |    5.00u |            4.29u | -0.71u |       30.00 |      +1.86 |      6.2% |
| PREMIUM  |  3.00u |  11 | 6-5    |  54.5% |      +0.975 |    3.00u |            2.73u | -0.27u |       30.00 |      +2.47 |      8.2% |
| LOCK     |  1.00u |  10 | 5-5    |  50.0% |      +0.958 |    1.00u |            1.00u | +0.00u |       10.00 |      +0.06 |      0.6% |
| LEAN     |  0.50u |   7 | 5-2    |  71.4% |      +0.890 |    0.50u |            0.50u | +0.00u |        3.50 |      +1.27 |     36.3% |
| WEAK     |  0.25u |   4 | 1-3    |  25.0% |      +0.305 |    0.25u |            0.25u | +0.00u |        1.00 |      -0.51 |    -51.0% |
| FADE     |  0.00u |  21 | 0-0    |      — |      -0.218 |    0.00u |                — |      — |        0.00 |      +0.00 |         — |

> **Monotonicity (positive tiers ELITE → WEAK).** ROI score `0` 🟡 partial · Win-rate score `-2` 🟡 partial. ELITE should out-earn PREMIUM should out-earn LOCK… If inverted, the v12 score is upside-down on this sample (sizing the wrong picks the most).

### C. V12 sizing drift (per-pick)

🟢 **No sizing drift detected.** Every v12 pick's stamped `finalUnits` matches the ladder target after odds-cap, within ±0.05u tolerance.

### D. V12 performance by sport × market

Where is v12 finding edge? Each cell shows `N · Win% · ROI` over LIVE picks (units > 0).

| Sport | ML                   | SPREAD               | TOTAL                | All                  |
|-------|----------------------|----------------------|----------------------|----------------------|
| MLB   | 23n · 60.9% · +27.1% | 1n · 100.0% · +83.0% | 13n · 30.8% · -26.2% | 37n · 51.4% · +0.8%  |
| NBA   | 1n · 0.0% · -100.0%  | 1n · 100.0% · +96.0% | —                    | 2n · 50.0% · -2.0%   |
| NHL   | —                    | —                    | 1n · 100.0% · +87.0% | 1n · 100.0% · +87.0% |
| **All** | **24n · 58.3% · +26.2%** | **2n · 100.0% · +85.6%** | **14n · 35.7% · -12.1%** | **40n · 52.5% · +6.6%** |

### E. V12 score-band reliability

Does v12 score actually predict outcomes? Picks bucketed by v12 score. **Realized** = win rate among graded picks in the band; **Implied** = average market implied probability. **Edge** = Realized − Implied (positive = v12 is finding mispricings the market doesn't).

| v12 band         | N   | Live N | W-L    | Realized | Implied | Edge       | ROI (live)|
|------------------|-----|--------|--------|----------|---------|------------|-----------|
| > 0.9 (strong)   |  32 |     32 | 18-14  |    56.3% |   51.3% |     +4.9pp |      7.6% |
| 0.7 – 0.9        |   3 |      3 | 2-1    |    66.7% |   58.9% |     +7.7pp |     11.3% |
| 0.25 – 0.5       |   2 |      2 | 1-1    |    50.0% |   58.7% |     -8.7pp |     -2.0% |
| (0, 0.25]        |   2 |      2 | 0-2    |     0.0% |   60.3% |    -60.3pp |   -100.0% |
| ≤ 0 (MUTE rule)  |  21 |      0 | 0-0    |    42.9% |   51.5% |     -8.6pp |         — |

> The **MUTE band (≤ 0)** is what v12 chose NOT to ship. If those picks win at > ~52%, the mute rule is too aggressive and is throwing away edge. The mute audit in §F quantifies the dollar impact.

### F. V12 mute-rule effectiveness (counterfactual on FADE picks)

v12 muted **21** graded picks (score ≤ 0). If those had each been shipped at a flat 1u stake, this is what would have happened. The verdict tells you whether the mute rule is **saving money** (good) or **throwing away edge** (bad).

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                   21 |
| Muted W-L                           |                 9-12 |
| Muted Win %                         |                42.9% |
| Flat-1u counterfactual PnL          |                -3.38 |
| Flat-1u counterfactual ROI          |               -16.1% |

**Verdict:** 🟢 **MUTE IS SAVING MONEY.** Muted picks would have lost -3.38u at flat 1u — v12 correctly identified losers.

### G. V12 vs V11 tier comparison (shared picks)

> 🟡 **Comparison degraded.** `syncPickStateAuthoritative.js` overwrites the Firestore `v8_agsTier` stamp with the v12 tier whenever v12 is authoritative. So on every v12-era pick the stamped v11 tier *equals* the v12 tier by construction — a true v11-vs-v12 confusion matrix would require re-deriving the v11 tier from the still-stamped v11 SCORE (`v8_ags`) against the v11 quintile calibration. Until the v11 quintile cal is plumbed into `liveCal`, this sub-section is intentionally suppressed to avoid showing a misleading 100% agreement.

> **Spearman ρ (v11 score vs v12 score):** `-0.444` on **60** shared picks. ρ ≈ +1 = the two models rank the same picks the same way (so v12 isn't adding new sorting signal, just a new sizing rule). ρ < +0.5 = v12 is sorting picks materially differently from v11 — that's where the v12 wallet-quality formula actually changes which bets get the most stake.

### H. V12 wallet-quality audit (per-side means)

v12's score is the per-side mean of `Q = tierWeight × cappedROI × boundedSizeRatio × nReliab` minus the AGAINST-side mean. This table shows how concentrated wallet quality is on each side.

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |            +15.062 |                        2.3 |
| AGAINST |             +3.830 |                        1.3 |

> 🟡 **One-sided wallet support.** 3 picks had FOR-side wallets but zero AGAINST-side wallets · 0 picks had AGAINST-side wallets but zero FOR-side. v12 is comfortable scoring these because the AGAINST mean defaults to 0, but they're high-variance bets — track separately.

### I. V12 recent live picks (last 20)

| Date       | Sport | Mkt    | Pick                    | Odds  | v12   | Tier     | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|-------|---------|------------|
| 2026-06-04 | MLB   | ML     | Baltimore Orioles       |  +104 | +0.923 | LEAN     | 0.50u | WIN     |      +0.52 |
| 2026-06-04 | MLB   | ML     | Philadelphia Phillies   |  -215 | +0.952 | LOCK     | 1.00u | WIN     |      +0.47 |
| 2026-06-04 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.962 | LOCK     | 1.00u | LOSS    |      -1.00 |
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

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified monitoring. Imports active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*