# AGS-Unified — Daily Monitoring Report

**Generated:** Wednesday, June 3, 2026 at 7:29 AM ET
**Active model:** `ags-unified-v12` · **AGS-U cutover:** 2026-05-14 · **Days live:** 20

> **Scope.** Every row in this report comes from picks AGS-U actually promoted (any `promotedBy` value matching `ags-unified-v*` — covers every v9 → v12 bump). Picks promoted by legacy v7/v8 routes are excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0a — Active Model

The composite scoring model — what every lock/mute/sizing decision is built on. Pulled at runtime from `src/lib/ags.js` so this report never drifts.

**Schema version:** `ags-unified-v12`
**Calibration source:** `cron` · sample N = 744 · range 2026-04-18 → 2026-06-01

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
| v12     | 06-01 → present      |    3 |     18 |  14 | 8-10   |  44.4% |     11.4% |      +4.09 |    +0.23 | 0.487 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           |   -42 |    -8.9pp |    +20.3pp |          +0.400 |   -0.061 |          — | 🟡 mixed |
| v12 − v10          |   -44 |    -3.9pp |    +30.1pp |          +0.540 |   +0.094 |          — | 🟡 mixed |
| v12 − v11          |   -93 |   -10.5pp |     +8.5pp |          +0.166 |   +0.044 |          — | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 111n 55.0% +3% |
| v12     | 17n 41.2% -1%  | —              | 1n 100.0% +87% | 18n 44.4% +11% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 4n -0%        | 5n +50%       | 5n -53%       | 2n -1%        | 1n -100%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **12 picks shipped at 0u despite AGS-U ≥ +0.10 and tier ∉ {FADE, WEAK}.** Sizing pipeline regression — see §10 for doc IDs. `v8_agsUnitsMult` should be > 0 for these.

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     10 | 4-6 |  40.0% |      9.9% |      +1.95 |    -0.46% |     1.98u |       -0.61 | 10 (5-5) |
| Last 3 days |     28 | 13-15 |  46.4% |      8.5% |      +5.06 |    -0.28% |     2.14u |       -0.68 | 18 (10-8) |
| Last 7 days |     92 | 46-46 |  50.0% |     -1.7% |      -3.08 |    -0.37% |     2.00u |       -0.70 | 29 (16-13) |
| All-time   |    252 | 132-120 |  52.4% |     -3.5% |     -17.24 |    +0.00% |     1.97u |       -0.50 | 62 (31-31) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   44 | 22-22  |  50.0% |     -5.9% |      -9.38 |     +2.04 |     3.63u |
| PREMIUM  | q80–q90     | 1.50×   |   42 | 22-20  |  52.4% |     -3.3% |      -3.90 |     +0.71 |     2.77u |
| LOCK     | q60–q80     | 1.10×   |   56 | 26-30  |  46.4% |    -12.6% |     -14.42 |     +0.50 |     2.04u |
| LEAN     | q40–q60     | 0.50×   |   70 | 41-29  |  58.6% |     12.2% |      +9.51 |     +0.16 |     1.11u |
| WEAK     | q20–q40     | 0.20×   |   36 | 20-16  |  55.6% |      8.6% |      +2.28 |     -0.60 |     0.73u |
| FADE     | < q20       | 0.00×   |    3 | 1-2    |  33.3% |    -47.0% |      -1.08 |     -0.95 |     0.77u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `-1` 🟡 partial — ladder mostly works but has noise
- ROI across tiers:   `-1` 🟡 partial

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) | Calibrated P(WIN) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|-------------------|
| Q1       |    7 | 2-5    |  28.6% |    -22.2% |      -1.95 |     -1.29 |               50.0% |             21.6% |
| Q2       |   52 | 30-22  |  57.7% |     12.5% |      +6.01 |     -0.44 |               51.3% |             39.2% |
| Q3       |   60 | 33-27  |  55.0% |      1.0% |      +0.74 |     +0.19 |               54.0% |             54.6% |
| Q4       |   53 | 27-26  |  50.9% |     -5.3% |      -6.20 |     +0.53 |               53.5% |             62.8% |
| Q5       |   80 | 40-40  |  50.0% |     -6.3% |     -15.84 |     +1.44 |               53.8% |             80.8% |

**Spearman ρ (quintile vs realized win%):** 0.000  ·  monotonicity `-2/4`

> **Calibrated P(WIN)** = sigmoid(avg AGS-U) — what the model would predict from each quintile's average score. Compare to **Win %** column: if model probability ≈ realized win rate, the score is well-calibrated as a probability and not just a discriminative ranker.

## § 2a — Model Ranking Quality

How well does AGS-U rank winners above losers, overall and per sport? **AUC ≥ 0.55** is meaningful at our sample sizes; **AUC > 0.60** is strong; **AUC ≈ 0.50** is chance. **Brier** measures probability calibration (lower = better, 0.25 = coin-flip prior, sub-0.24 = beats market).

### Overall (since cutover)

| N | AUC   | Spearman ρ | Pt-biserial r | Brier (model) | Brier (market) | Δ vs market |
|---|-------|------------|---------------|---------------|----------------|-------------|
| 313 | 0.479 | -0.072 | 0.046 | 0.2841 | 0.2451 | -0.0391 |

### Per sport

| Sport | N    | AUC   | Spearman ρ | Top Q (Q5) WR | Bot Q (Q1) WR | Q5−Q1 gap |
|-------|------|-------|------------|---------------|---------------|-----------|
| MLB   |  249 | 0.473 |     -0.101 |         51.9% |         20.0% | +31.9pp |
| NBA   |   41 | 0.564 |      0.215 |         46.7% |          0.0% | +46.7pp |
| NHL   |   23 | 0.554 |      0.023 |         45.5% |        100.0% | -54.5pp |

> **Reading this table:** the largest Q5−Q1 gap = the sport where AGS-U is doing the most work. Negative AUC (< 0.5) on a sport = the model is anti-predictive there and may need a per-sport coefficient set (see `scripts/_agsu_final_fit.mjs`).

## § 3 — Univariate Feature Analysis (active features)

Each active AGS-U feature scored on its own against W/L. **Corr(WIN)** should match the model's sign — positive features should correlate +, contrarian features should correlate −. **Lift** = top-decile ROI − bottom-decile ROI, in percentage points; positive lift means the feature is earning its slot.

| Feature           | Family         | Sign | β       | N    | Mean   | SD     | Corr(WIN) | Sign OK? | Top-dec ROI | Bot-dec ROI | Lift   |
|-------------------|----------------|------|---------|------|--------|--------|-----------|----------|-------------|-------------|--------|
| Δcount            | COUNT          | +    |  +0.537 |  313 |   0.15 |   1.10 |    -0.052 | 🚨 flipped |      -20.8% |       14.2% | -35.0pp |
| ΔHCsizeRatio      | INTENSITY_HC   | +    |  +0.279 |  313 |   0.15 |   1.18 |    -0.085 | 🚨 flipped |      -46.8% |        6.0% | -52.8pp |
| ΔΣrankNorm        | QUALITY_RANK   | −    |  -0.274 |  165 |   0.05 |   1.08 |    -0.213 | 🟢       |       -7.4% |       56.4% | -63.8pp |
| Δwinners          | QUALITY_TRACK  | −    |  -0.192 |  165 |  -0.04 |   0.84 |    -0.019 | 🟢       |        2.5% |        1.3% | +1.2pp |

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
| Δcount            |  +0.5371 |            +0.163 |             +0.207 |         -0.043 | 🚨 hurting |
| ΔHCsizeRatio      |  +0.2787 |            +0.029 |             +0.075 |         -0.046 | 🚨 hurting |
| ΔΣrankNorm        |  -0.2740 |            +0.011 |             -0.038 |         +0.049 | 🟢 helping |
| Δwinners          |  -0.1916 |            -0.001 |             -0.002 |         +0.002 | 🟡 neutral |

> Contribution = β · z(feature). The sum across all features (plus intercept) is the AGS-U score. A feature is "helping" if its average contribution is higher on winners than losers — i.e. the feature is correctly orienting the score.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier?

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 19n 57.9% -5% | 14n 50.0% +11% | 11n 36.4% -28% | 44n 50.0% -6% |
| PREMIUM  | 21n 52.4% +9% | 16n 50.0% -16% | 5n 60.0% -4% | 42n 52.4% -3% |
| LOCK     | 36n 41.7% -13% | 16n 62.5% +11% | 4n 25.0% -80% | 56n 46.4% -13% |
| LEAN     | 52n 59.6% +10% | 16n 56.3% +13% | 2n 50.0% +56% | 70n 58.6% +12% |
| WEAK     | 16n 56.3% +50% | 20n 55.0% -34% | —            | 36n 55.6% +9% |
| FADE     | 3n 33.3% -47% | —            | —            | 3n 33.3% -47% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 26n 50.0% -6%  | 13n 46.2% -15% | 5n 60.0% +21%  | 44n 50.0% -6%  |
| PREMIUM  | 33n 54.5% +3%  | 2n 50.0% -24%  | 7n 42.9% -33%  | 42n 52.4% -3%  |
| LOCK     | 50n 48.0% -6%  | 4n 25.0% -63%  | 2n 50.0% -42%  | 56n 46.4% -13% |
| LEAN     | 63n 60.3% +22% | 2n 50.0% -1%   | 5n 40.0% -74%  | 70n 58.6% +12% |
| WEAK     | 29n 55.2% -11% | 6n 66.7% +69%  | 1n 0.0% -100%  | 36n 55.6% +9%  |
| FADE     | 1n 0.0% -100%  | 1n 0.0% -100%  | 1n 100.0% +63% | 3n 33.3% -47%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 6n 100.0% +40% | 7n 28.6% -57% | 24n 54.2% +12% | 7n 14.3% -68% | —             |
| PREMIUM  | 6n 66.7% +5%  | 10n 70.0% +23% | 16n 50.0% -15% | 8n 37.5% -12% | 2n 0.0% -100% |
| LOCK     | 1n 100.0% +24% | 13n 61.5% -12% | 33n 33.3% -31% | 6n 66.7% +39% | 3n 66.7% +77% |
| LEAN     | 4n 75.0% -14% | 23n 43.5% -28% | 32n 68.8% +39% | 10n 60.0% +49% | 1n 0.0% -100% |
| WEAK     | 1n 0.0% -100% | 4n 100.0% +66% | 20n 50.0% +3% | 10n 50.0% -29% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | 2n 0.0% -100% | —             | —             |

## § 5 — Calibration Reliability (band × realized)

Slice AGS-U into bands derived from the LIVE calibration and compare average implied probability (from market odds) to realized win rate. **Realized > Implied** = AGS-U finds edge the market doesn't price; **Realized ≈ Implied** = AGS-U is just re-stating favorite-ness; **Realized < Implied** = anti-edge.

| AGS-U Band       | N    | Realized Win | Model P(WIN) | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|--------------|-------------|-------------|-----------|
| ≥ q90 (≥ +0.46)  |   74 |        52.7% |        75.4% |       53.8% |      -1.1pp |     -6.8% |
| q80–q90          |   39 |        43.6% |        59.3% |       53.2% |      -9.6pp |    -15.9% |
| q60–q80          |   42 |        54.8% |        55.1% |       54.4% |      +0.3pp |     12.9% |
| q40–q60          |   52 |        55.8% |        51.5% |       53.7% |      +2.1pp |      0.4% |
| q20–q40          |   23 |        52.2% |        47.8% |       51.4% |      +0.8pp |      6.1% |
| < q20 (< -0.16)  |   22 |        54.5% |        28.5% |       49.8% |      +4.8pp |      0.9% |

**Brier — model:** 0.2841  ·  **Brier — market-implied:** 0.2451 (lower = better; 0.25 = coin-flip prior). Δ = -0.0391 (positive = model beats market).
**Edge correlation (realized vs implied):** Spearman ρ = 0.371.

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Top Driver           | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|----------------------|---------|------------|--------|
| 2026-06-02 | NHL   | TOTAL  | Over 5.5                |  -115 |  5.00u |  +0.24 | ELITE   | Q4   |   +2 | Δcount +0.32         | WIN     |     +4.35u |  +1.7% |
| 2026-06-02 | MLB   | TOTAL  | Over 7.5                |  -110 |  3.00u |  -0.07 | PREMIUM | Q2   |   +0 | Δwinners -0.08       | LOSS    |     -3.00u |  -3.6% |
| 2026-06-02 | MLB   | TOTAL  | Over 7.5                |  -110 |  3.00u |  -0.07 | PREMIUM | Q2   |   +0 | Δwinners -0.08       | WIN     |     +2.73u |  -0.9% |
| 2026-06-02 | MLB   | TOTAL  | Under 9                 |  -108 |  0.00u |  +0.17 | FADE    | Q4   |   +0 | Δcount -0.41         | TRACKED |      0.00u |  +1.1% |
| 2026-06-02 | MLB   | TOTAL  | Under 8.5               |  -114 |  0.00u |  -0.01 | FADE    | Q2   |   +0 | Δcount -0.41         | TRACKED |      0.00u |  -4.0% |
| 2026-06-02 | MLB   | TOTAL  | Under 7.5               |  -119 |  1.00u |  -0.29 | LOCK    | Q1   |   +0 | Δcount -0.41         | LOSS    |     -1.00u |  +0.6% |
| 2026-06-02 | MLB   | SPREAD | Milwaukee Brewers       |  -111 |  0.00u |  +0.60 | FADE    | Q5   |   +1 | ΔΣrankNorm +0.25     | TRACKED |      0.00u |  +0.7% |
| 2026-06-02 | MLB   | SPREAD | Detroit Tigers          |  -160 |  0.00u |  +0.11 | FADE    | Q3   |   +1 | Δcount +0.32         | TRACKED |      0.00u |  +0.6% |
| 2026-06-02 | MLB   | SPREAD | New York Yankees        |  -105 |  0.00u |  +0.15 | FADE    | Q4   |   +0 | Δcount -0.41         | TRACKED |      0.00u |  -1.2% |
| 2026-06-02 | MLB   | ML     | Toronto Blue Jays       |  +102 |  2.50u |  -0.91 | ELITE   | Q1   |   -1 | ΔHCsizeRatio -0.41   | LOSS    |     -2.50u |  +0.0% |
| 2026-06-02 | MLB   | ML     | St. Louis Cardinals     |  -106 |  1.00u |  -0.11 | LOCK    | Q2   |   +0 | Δwinners -0.08       | LOSS    |     -1.00u |  -0.5% |
| 2026-06-02 | MLB   | ML     | San Francisco Giants    |  +214 |  0.00u |  +0.43 | FADE    | Q5   |   +0 | Δcount +0.32         | TRACKED |      0.00u |  -0.4% |
| 2026-06-02 | MLB   | ML     | San Diego Padres        |  +128 |  0.00u |  +0.44 | FADE    | Q5   |   +0 | Δcount +0.32         | TRACKED |      0.00u |  -3.8% |
| 2026-06-02 | MLB   | ML     | Houston Astros          |  -112 |  1.00u |  -0.11 | LOCK    | Q2   |   +0 | Δwinners -0.08       | LOSS    |     -1.00u |  +1.6% |
| 2026-06-02 | MLB   | ML     | Miami Marlins           |  -102 |  0.50u |  +0.06 | LEAN    | Q3   |   +0 | Δcount +0.32         | WIN     |     +0.49u |  +0.2% |
| 2026-06-02 | MLB   | ML     | Cincinnati Reds         |  -122 |  0.00u |  +0.73 | FADE    | Q5   |   +0 | ΔHCsizeRatio +0.38   | TRACKED |      0.00u |  +0.0% |
| 2026-06-02 | MLB   | ML     | Detroit Tigers          |  +125 |  2.50u |  -0.38 | ELITE   | Q1   |   +0 | Δcount -0.41         | WIN     |     +3.13u |  +2.1% |
| 2026-06-02 | MLB   | ML     | Minnesota Twins         |  +110 |  0.00u |  +0.31 | FADE    | Q4   |   +0 | Δcount +0.32         | TRACKED |      0.00u |  +1.6% |
| 2026-06-02 | MLB   | ML     | Colorado Rockies        |  +135 |  0.00u |  -0.39 | FADE    | Q1   |   +0 | Δcount -0.78         | TRACKED |      0.00u |  -2.0% |
| 2026-06-02 | MLB   | ML     | New York Yankees        |  -219 |  0.25u |  +1.56 | WEAK    | Q5   |   +0 | ΔHCsizeRatio +1.57   | LOSS    |     -0.25u |  -3.1% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   44 |      159.75 |      -9.38 |     -5.9% |      -0.21 |          -0.059 |
| PREMIUM  |   42 |      116.50 |      -3.90 |     -3.3% |      -0.09 |          -0.033 |
| LOCK     |   56 |      114.30 |     -14.42 |    -12.6% |      -0.26 |          -0.126 |
| LEAN     |   70 |       77.80 |      +9.51 |     12.2% |      +0.14 |          +0.122 |
| WEAK     |   36 |       26.40 |      +2.28 |      8.6% |      +0.06 |          +0.086 |
| FADE     |    3 |        2.30 |      -1.08 |    -47.0% |      -0.36 |          -0.470 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). Live q20 = **-0.158**. We validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **62** · Win rate: **54.8%** · Flat-1u PnL: **+2.68u** · ROI: **4.3%**
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

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.
> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    75 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    12 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     4 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     1 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    54 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

- **Computed at:** 2026-06-02T17:07:50.892Z
- **Schema version:** `ags-unified-v12`
- **Source:** cron
- **Sample size:** 744
- **Date range:** 2026-04-18 → 2026-06-01
- **Absolute mute floor:** -1.00 (safety bound below q20)

**AGS-U quintile boundaries (logit-score space):**

| Boundary | Value      | Action                |
|----------|------------|-----------------------|
| q20      |    -0.1584 | HARD MUTE floor       |
| q40      |    -0.0067 | LEAN floor (0.5×)     |
| q50      |    +0.0724 | 50th pctile           |
| q60      |    +0.1315 | LOCK floor (1.10×)    |
| q80      |    +0.3093 | PREMIUM floor (1.50×) |
| q90      |    +0.5087 | ELITE floor (2.00×)   |

**Feature normalizers (mean / sd) — z-scoring inputs to the model:**

| Feature           | β        | Mean   | SD     |
|-------------------|----------|--------|--------|
| Δcount            |  +0.5371 |   1.13 |   1.47 |
| ΔHCsizeRatio      |  +0.2787 |   1.24 |   5.15 |
| ΔΣrankNorm        |  -0.2740 |  60.71 |  91.23 |
| Δwinners          |  -0.1916 |   0.53 |   1.14 |

> ✅ Calibration weights match `src/lib/ags.js` — no drift.

## § 12 — Wallet Pool Health

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            119 |        29 |    8 |    7 |   75 |                     44 |
| NBA   |            193 |        54 |   22 |   20 |   97 |                     96 |
| NHL   |             96 |        20 |    6 |   13 |   57 |                     39 |

> ⚠ **MLB pool is < 50% of NBA pool** (44 vs 96). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified monitoring. Imports active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*