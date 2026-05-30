# AGS-Unified — Daily Monitoring Report

**Generated:** Saturday, May 30, 2026 at 10:15 AM ET
**Active model:** `ags-unified-v11` · **AGS-U cutover:** 2026-05-14 · **Days live:** 16

> **Scope.** Every row in this report comes from picks AGS-U actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0a — Active Model

The composite scoring model — what every lock/mute/sizing decision is built on. Pulled at runtime from `src/lib/ags.js` so this report never drifts.

**Schema version:** `ags-unified-v11`
**Calibration source:** `cron` · sample N = 646 · range 2026-04-18 → 2026-05-28

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
| v11     | 05-25 → present      |    6 |     82 |  15 | 45-37  |  54.9% |      4.3% |      +7.47 |    +0.09 | 0.492 |        0.2578 | 🟢 LIVE  |

### v11 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v11 − v9           | +   22 |    +1.5pp |    +13.3pp |          +0.264 |   -0.056 |    +0.0822 | 🟡 mixed |
| v11 − v10          | +   20 |    +6.5pp |    +23.1pp |          +0.404 |   +0.098 |    +0.0226 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 68n 55.9% +5%  | 6n 83.3% +49%  | 8n 25.0% -59%  | 82n 54.9% +4% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 17n -2%       | 19n +2%       | 18n +24%      | 18n +12%      | 9n -12%       | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **10 picks shipped at 0u despite AGS-U ≥ +0.10 and tier ∉ {FADE, WEAK}.** Sizing pipeline regression — see §10 for doc IDs. `v8_agsUnitsMult` should be > 0 for these.

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     23 | 11-12 |  47.8% |     -1.3% |      -0.53 |    -1.06% |     1.71u |       -0.53 |       — |
| Last 3 days |     45 | 22-23 |  48.9% |     -7.9% |      -6.46 |    -0.51% |     1.82u |       -0.84 | 8 (5-3) |
| Last 7 days |    124 | 67-57 |  54.0% |      2.2% |      +5.22 |    -0.05% |     1.94u |        0.01 | 26 (16-10) |
| All-time   |    205 | 108-97 |  52.7% |     -5.2% |     -20.62 |    +0.08% |     1.93u |       -0.48 | 41 (20-21) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   35 | 17-18  |  48.6% |    -10.7% |     -13.29 |     +2.47 |     3.56u |
| PREMIUM  | q80–q90     | 1.50×   |   30 | 15-15  |  50.0% |     -7.2% |      -5.76 |     +0.87 |     2.66u |
| LOCK     | q60–q80     | 1.10×   |   45 | 23-22  |  51.1% |     -8.0% |      -7.82 |     +0.60 |     2.16u |
| LEAN     | q40–q60     | 0.50×   |   61 | 36-25  |  59.0% |     13.1% |      +9.08 |     +0.18 |     1.14u |
| WEAK     | q20–q40     | 0.20×   |   31 | 16-15  |  51.6% |     -7.9% |      -1.75 |     -0.73 |     0.71u |
| FADE     | < q20       | 0.00×   |    3 | 1-2    |  33.3% |    -47.0% |      -1.08 |     -1.53 |     0.77u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `1` 🚨 inverted — higher tiers winning LESS than lower
- ROI across tiers:   `-1` 🟡 partial

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) | Calibrated P(WIN) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|-------------------|
| Q1       |    3 | 1-2    |  33.3% |    -47.0% |      -1.08 |     -1.53 |               50.1% |             17.8% |
| Q2       |   42 | 24-18  |  57.1% |      7.1% |      +2.27 |     -0.54 |               51.3% |             36.8% |
| Q3       |   50 | 28-22  |  56.0% |      8.5% |      +5.06 |     +0.21 |               53.4% |             55.3% |
| Q4       |   46 | 24-22  |  52.2% |     -6.6% |      -6.60 |     +0.59 |               53.8% |             64.3% |
| Q5       |   64 | 31-33  |  48.4% |    -10.0% |     -20.27 |     +1.72 |               54.3% |             84.9% |

**Spearman ρ (quintile vs realized win%):** 0.000  ·  monotonicity `-2/4`

> **Calibrated P(WIN)** = sigmoid(avg AGS-U) — what the model would predict from each quintile's average score. Compare to **Win %** column: if model probability ≈ realized win rate, the score is well-calibrated as a probability and not just a discriminative ranker.

## § 2a — Model Ranking Quality

How well does AGS-U rank winners above losers, overall and per sport? **AUC ≥ 0.55** is meaningful at our sample sizes; **AUC > 0.60** is strong; **AUC ≈ 0.50** is chance. **Brier** measures probability calibration (lower = better, 0.25 = coin-flip prior, sub-0.24 = beats market).

### Overall (since cutover)

| N | AUC   | Spearman ρ | Pt-biserial r | Brier (model) | Brier (market) | Δ vs market |
|---|-------|------------|---------------|---------------|----------------|-------------|
| 245 | 0.490 | -0.043 | 0.059 | 0.2878 | 0.2425 | -0.0453 |

### Per sport

| Sport | N    | AUC   | Spearman ρ | Top Q (Q5) WR | Bot Q (Q1) WR | Q5−Q1 gap |
|-------|------|-------|------------|---------------|---------------|-----------|
| MLB   |  185 | 0.477 |     -0.098 |         48.7% |          0.0% | +48.7pp |
| NBA   |   38 | 0.594 |      0.258 |         50.0% |          0.0% | +50.0pp |
| NHL   |   22 | 0.581 |      0.075 |         45.5% |        100.0% | -54.5pp |

> **Reading this table:** the largest Q5−Q1 gap = the sport where AGS-U is doing the most work. Negative AUC (< 0.5) on a sport = the model is anti-predictive there and may need a per-sport coefficient set (see `scripts/_agsu_final_fit.mjs`).

## § 3 — Univariate Feature Analysis (active features)

Each active AGS-U feature scored on its own against W/L. **Corr(WIN)** should match the model's sign — positive features should correlate +, contrarian features should correlate −. **Lift** = top-decile ROI − bottom-decile ROI, in percentage points; positive lift means the feature is earning its slot.

| Feature           | Family         | Sign | β       | N    | Mean   | SD     | Corr(WIN) | Sign OK? | Top-dec ROI | Bot-dec ROI | Lift   |
|-------------------|----------------|------|---------|------|--------|--------|-----------|----------|-------------|-------------|--------|
| Δcount            | COUNT          | +    |  +0.537 |  245 |   0.18 |   1.14 |    -0.036 | 🚨 flipped |      -26.4% |       19.7% | -46.1pp |
| ΔHCsizeRatio      | INTENSITY_HC   | +    |  +0.279 |  245 |   0.16 |   1.22 |    -0.071 | 🚨 flipped |      -50.1% |        3.2% | -53.3pp |
| ΔΣrankNorm        | QUALITY_RANK   | −    |  -0.274 |   97 |   0.13 |   1.10 |    -0.246 | 🟢       |        7.8% |       47.7% | -40.0pp |
| Δwinners          | QUALITY_TRACK  | −    |  -0.192 |   97 |   0.04 |   0.90 |    -0.028 | 🟢       |      -41.0% |       -5.1% | -35.9pp |

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
| Δcount            |  +0.5371 |            +0.175 |             +0.246 |         -0.071 | 🚨 hurting |
| ΔHCsizeRatio      |  +0.2787 |            +0.032 |             +0.081 |         -0.049 | 🚨 hurting |
| ΔΣrankNorm        |  -0.2740 |            +0.017 |             -0.042 |         +0.059 | 🟢 helping |
| Δwinners          |  -0.1916 |            -0.000 |             -0.010 |         +0.010 | 🟡 neutral |

> Contribution = β · z(feature). The sum across all features (plus intercept) is the AGS-U score. A feature is "helping" if its average contribution is higher on winners than losers — i.e. the feature is correctly orienting the score.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier?

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 13n 69.2% +8% | 13n 46.2% -0% | 9n 22.2% -56% | 35n 48.6% -11% |
| PREMIUM  | 16n 50.0% +7% | 10n 50.0% -19% | 4n 50.0% -21% | 30n 50.0% -7% |
| LOCK     | 29n 51.7% +2% | 13n 61.5% +7% | 3n 0.0% -100% | 45n 51.1% -8% |
| LEAN     | 45n 60.0% +11% | 14n 57.1% +14% | 2n 50.0% +56% | 61n 59.0% +13% |
| WEAK     | 12n 50.0% +32% | 19n 52.6% -38% | —            | 31n 51.6% -8% |
| FADE     | 3n 33.3% -47% | —            | —            | 3n 33.3% -47% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 19n 47.4% -12% | 12n 50.0% -10% | 4n 50.0% -4%   | 35n 48.6% -11% |
| PREMIUM  | 21n 52.4% +2%  | 2n 50.0% -24%  | 7n 42.9% -33%  | 30n 50.0% -7%  |
| LOCK     | 39n 53.8% +1%  | 4n 25.0% -63%  | 2n 50.0% -42%  | 45n 51.1% -8%  |
| LEAN     | 54n 61.1% +25% | 2n 50.0% -1%   | 5n 40.0% -74%  | 61n 59.0% +13% |
| WEAK     | 24n 50.0% -41% | 6n 66.7% +69%  | 1n 0.0% -100%  | 31n 51.6% -8%  |
| FADE     | 1n 0.0% -100%  | 1n 0.0% -100%  | 1n 100.0% +63% | 3n 33.3% -47%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 6n 100.0% +40% | 6n 33.3% -49% | 17n 52.9% +8% | 6n 0.0% -100% | —             |
| PREMIUM  | 6n 66.7% +5%  | 7n 57.1% -1%  | 10n 50.0% -14% | 5n 40.0% +1%  | 2n 0.0% -100% |
| LOCK     | 1n 100.0% +24% | 12n 66.7% -3% | 24n 37.5% -29% | 5n 60.0% +31% | 3n 66.7% +77% |
| LEAN     | 3n 66.7% -27% | 20n 45.0% -28% | 28n 67.9% +38% | 9n 66.7% +68% | 1n 0.0% -100% |
| WEAK     | —             | 3n 100.0% +65% | 19n 47.4% -22% | 8n 37.5% -54% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | 2n 0.0% -100% | —             | —             |

## § 5 — Calibration Reliability (band × realized)

Slice AGS-U into bands derived from the LIVE calibration and compare average implied probability (from market odds) to realized win rate. **Realized > Implied** = AGS-U finds edge the market doesn't price; **Realized ≈ Implied** = AGS-U is just re-stating favorite-ness; **Realized < Implied** = anti-edge.

| AGS-U Band       | N    | Realized Win | Model P(WIN) | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|--------------|-------------|-------------|-----------|
| ≥ q90 (≥ +0.46)  |   67 |        52.2% |        76.3% |       53.6% |      -1.4pp |    -10.5% |
| q80–q90          |   30 |        40.0% |        59.2% |       54.4% |     -14.4pp |    -19.9% |
| q60–q80          |   35 |        57.1% |        54.9% |       54.9% |      +2.3pp |     15.7% |
| q40–q60          |   42 |        57.1% |        51.4% |       52.9% |      +4.3pp |     11.6% |
| q20–q40          |   13 |        46.2% |        47.6% |       51.4% |      -5.3pp |    -15.9% |
| < q20 (< -0.16)  |   18 |        61.1% |        26.6% |       49.8% |     +11.3pp |      9.4% |

**Brier — model:** 0.2878  ·  **Brier — market-implied:** 0.2425 (lower = better; 0.25 = coin-flip prior). Δ = -0.0453 (positive = model beats market).
**Edge correlation (realized vs implied):** Spearman ρ = -0.429.

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Top Driver           | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|----------------------|---------|------------|--------|
| 2026-05-29 | NHL   | TOTAL  | Under 5.5               |  -106 |  2.25u |  +0.40 | PREMIUM | Q5   |   +0 | Δcount +0.31         | LOSS    |     -2.25u |  -2.2% |
| 2026-05-29 | MLB   | TOTAL  | Over 9                  |  -108 |  1.65u |  +0.21 | LOCK    | Q4   |   +0 | Δwinners +0.09       | WIN     |     +1.53u |  +1.6% |
| 2026-05-29 | MLB   | TOTAL  | Over 9.5                |  +105 |  0.30u |  -0.12 | WEAK    | Q2   |   +1 | Δwinners -0.24       | WIN     |     +0.32u |  +1.2% |
| 2026-05-29 | MLB   | TOTAL  | Over 8                  |  -101 |  0.75u |  +0.09 | LEAN    | Q3   |   +0 | Δcount +0.31         | WIN     |     +0.74u |  -2.4% |
| 2026-05-29 | MLB   | TOTAL  | Over 7.5                |  -103 |  1.65u |  +0.17 | LOCK    | Q4   |   +0 | Δcount +0.31         | WIN     |     +1.60u |  +0.0% |
| 2026-05-29 | MLB   | TOTAL  | Over 7.5                |  -112 |  2.25u |  +0.42 | PREMIUM | Q5   |   +0 | Δcount +0.67         | WIN     |     +2.01u |  +0.0% |
| 2026-05-29 | MLB   | TOTAL  | Over 8                  |  -107 |  1.65u |  +0.28 | LOCK    | Q4   |   +0 | Δcount +0.67         | LOSS    |     -1.65u |  +0.0% |
| 2026-05-29 | NHL   | SPREAD | Canadiens               |  -114 |  3.00u |  +0.84 | ELITE   | Q5   |   +1 | Δcount +0.67         | LOSS    |     -3.00u |  +0.4% |
| 2026-05-29 | MLB   | SPREAD | Washington Nationals    |  -175 |  1.65u |  +0.17 | LOCK    | Q4   |   +0 | Δcount +0.31         | LOSS    |     -1.65u | -26.2% |
| 2026-05-29 | MLB   | SPREAD | Minnesota Twins         |  -184 |  2.25u |  +0.30 | PREMIUM | Q4   |   +0 | Δcount +0.31         | WIN     |     +1.22u |  +0.4% |
| 2026-05-29 | MLB   | SPREAD | Houston Astros          |  -135 |  1.65u |  +0.17 | LOCK    | Q4   |   +0 | Δcount +0.31         | WIN     |     +1.22u |  -0.2% |
| 2026-05-29 | MLB   | SPREAD | Detroit Tigers          |  +150 |  0.75u |  +0.11 | LEAN    | Q3   |   +0 | Δwinners +0.09       | LOSS    |     -0.75u |  -0.5% |
| 2026-05-29 | MLB   | SPREAD | Cincinnati Reds         |  -125 |  0.75u |  +0.09 | LEAN    | Q3   |   +0 | Δwinners +0.09       | LOSS    |     -0.75u |  -0.2% |
| 2026-05-29 | NHL   | ML     | Canadiens               |  +205 |  1.00u |  +0.30 | PREMIUM | Q5   |   +0 | Δcount +0.67         | LOSS    |     -1.00u |  -0.3% |
| 2026-05-29 | MLB   | ML     | Baltimore Orioles       |  -122 |  1.25u |  +0.06 | LEAN    | Q3   |   +1 | ΔΣrankNorm -0.12     | LOSS    |     -1.25u |  +0.2% |
| 2026-05-29 | MLB   | ML     | Washington Nationals    |  -110 |  0.50u |  -0.08 | WEAK    | Q2   |   +1 | Δwinners -0.41       | LOSS    |     -0.50u |  +2.5% |
| 2026-05-29 | MLB   | ML     | Pittsburgh Pirates      |  -134 |  3.75u |  +0.36 | PREMIUM | Q5   |   +0 | ΔΣrankNorm +0.49     | WIN     |     +2.80u |  -0.2% |
| 2026-05-29 | MLB   | ML     | Milwaukee Brewers       |  -142 |  0.50u |  -0.14 | WEAK    | Q2   |   +1 | Δcount -0.77         | WIN     |     +0.35u |  +0.0% |
| 2026-05-29 | MLB   | ML     | Los Angeles Angels      |  +143 |  2.50u |  +0.35 | PREMIUM | Q5   |   +1 | ΔHCsizeRatio +0.19   | LOSS    |     -2.50u |  +1.5% |
| 2026-05-29 | MLB   | ML     | Kansas City Royals      |  +114 |  0.50u |  -0.15 | WEAK    | Q2   |   +0 | Δcount -0.41         | LOSS    |     -0.50u |  -0.9% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   35 |      124.50 |     -13.29 |    -10.7% |      -0.38 |          -0.107 |
| PREMIUM  |   30 |       79.75 |      -5.76 |     -7.2% |      -0.19 |          -0.072 |
| LOCK     |   45 |       97.20 |      -7.82 |     -8.0% |      -0.17 |          -0.080 |
| LEAN     |   61 |       69.55 |      +9.08 |     13.1% |      +0.15 |          +0.131 |
| WEAK     |   31 |       22.15 |      -1.75 |     -7.9% |      -0.06 |          -0.079 |
| FADE     |    3 |        2.30 |      -1.08 |    -47.0% |      -0.36 |          -0.470 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). Live q20 = **-0.151**. We validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **55** · Win rate: **56.4%** · Flat-1u PnL: **+2.84u** · ROI: **5.2%**
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

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.
> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    49 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    10 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     4 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    44 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-29T16:29:55.280Z
- **Schema version:** `ags-unified-v11`
- **Source:** cron
- **Sample size:** 646
- **Date range:** 2026-04-18 → 2026-05-28
- **Absolute mute floor:** -1.00 (safety bound below q20)

**AGS-U quintile boundaries (logit-score space):**

| Boundary | Value      | Action                |
|----------|------------|-----------------------|
| q20      |    -0.1507 | HARD MUTE floor       |
| q40      |    -0.0212 | LEAN floor (0.5×)     |
| q50      |    +0.0722 | 50th pctile           |
| q60      |    +0.1164 | LOCK floor (1.10×)    |
| q80      |    +0.3008 | PREMIUM floor (1.50×) |
| q90      |    +0.5255 | ELITE floor (2.00×)   |

**Feature normalizers (mean / sd) — z-scoring inputs to the model:**

| Feature           | β        | Mean   | SD     |
|-------------------|----------|--------|--------|
| Δcount            |  +0.5371 |   1.14 |   1.49 |
| ΔHCsizeRatio      |  +0.2787 |   1.29 |   5.45 |
| ΔΣrankNorm        |  -0.2740 |  60.73 |  91.00 |
| Δwinners          |  -0.1916 |   0.55 |   1.16 |

> ✅ Calibration weights match `src/lib/ags.js` — no drift.

## § 12 — Wallet Pool Health

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            110 |        23 |    9 |    4 |   74 |                     36 |
| NBA   |            191 |        55 |   21 |   21 |   94 |                     97 |
| NHL   |             95 |        19 |    6 |   14 |   56 |                     39 |

> ⚠ **MLB pool is < 50% of NBA pool** (36 vs 97). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified monitoring. Imports active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*