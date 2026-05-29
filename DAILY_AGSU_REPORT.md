# AGS-Unified — Daily Monitoring Report

**Generated:** Friday, May 29, 2026 at 12:24 PM ET
**Active model:** `ags-unified-v11` · **AGS-U cutover:** 2026-05-14 · **Days live:** 15

> **Scope.** Every row in this report comes from picks AGS-U actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0a — Active Model

The composite scoring model — what every lock/mute/sizing decision is built on. Pulled at runtime from `src/lib/ags.js` so this report never drifts.

**Schema version:** `ags-unified-v11`
**Calibration source:** `cron` · sample N = 636 · range 2026-04-18 → 2026-05-27

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
| v11     | 05-25 → present      |    5 |     59 |  15 | 34-25  |  57.6% |      6.0% |      +8.00 |    +0.14 | 0.494 |        0.2549 | 🟢 LIVE  |

### v11 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v11 − v9           |    -1 |    +4.3pp |    +14.9pp |          +0.309 |   -0.055 |    +0.0851 | 🟡 mixed |
| v11 − v10          |    -3 |    +9.2pp |    +24.7pp |          +0.449 |   +0.100 |    +0.0255 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 48n 56.3% +1%  | 6n 83.3% +49%  | 5n 40.0% -33%  | 59n 57.6% +6% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 15n +8%       | 12n -7%       | 12n +17%      | 14n +28%      | 5n -11%       | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **10 picks shipped at 0u despite AGS-U ≥ +0.10 and tier ∉ {FADE, WEAK}.** Sizing pipeline regression — see §10 for doc IDs. `v8_agsUnitsMult` should be > 0 for these.

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |      6 | 3-3 |  50.0% |     12.3% |      +1.77 |    +0.88% |     2.40u |       -0.21 | 2 (1-1) |
| Last 3 days |     40 | 23-17 |  57.5% |      9.5% |      +7.95 |    -0.24% |     2.10u |        0.20 | 12 (6-6) |
| Last 7 days |    121 | 64-57 |  52.9% |     -4.8% |     -11.42 |    +0.26% |     1.96u |       -0.24 | 29 (18-11) |
| All-time   |    182 | 97-85 |  53.3% |     -5.6% |     -20.09 |    +0.20% |     1.96u |       -0.32 | 41 (20-21) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   33 | 17-16  |  51.5% |     -6.5% |      -7.79 |     +2.56 |     3.61u |
| PREMIUM  | q80–q90     | 1.50×   |   23 | 11-12  |  47.8% |    -14.5% |      -9.02 |     +1.00 |     2.70u |
| LOCK     | q60–q80     | 1.10×   |   39 | 19-20  |  48.7% |    -13.7% |     -11.87 |     +0.65 |     2.22u |
| LEAN     | q40–q60     | 0.50×   |   57 | 35-22  |  61.4% |     16.8% |     +11.09 |     +0.19 |     1.16u |
| WEAK     | q20–q40     | 0.20×   |   27 | 14-13  |  51.9% |     -7.0% |      -1.42 |     -0.81 |     0.75u |
| FADE     | < q20       | 0.00×   |    3 | 1-2    |  33.3% |    -47.0% |      -1.08 |     -1.53 |     0.77u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `-1` 🟡 partial — ladder mostly works but has noise
- ROI across tiers:   `-1` 🟡 partial

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) | Calibrated P(WIN) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|-------------------|
| Q1       |    3 | 1-2    |  33.3% |    -47.0% |      -1.08 |     -1.53 |               50.1% |             17.8% |
| Q2       |   38 | 22-16  |  57.9% |      8.6% |      +2.60 |     -0.58 |               51.3% |             35.8% |
| Q3       |   46 | 27-19  |  58.7% |     12.6% |      +7.07 |     +0.23 |               53.6% |             55.6% |
| Q4       |   39 | 19-20  |  48.7% |    -13.7% |     -11.87 |     +0.65 |               53.5% |             65.6% |
| Q5       |   56 | 28-28  |  50.0% |     -9.3% |     -16.81 |     +1.89 |               55.1% |             86.8% |

**Spearman ρ (quintile vs realized win%):** 0.200  ·  monotonicity `2/4`

> **Calibrated P(WIN)** = sigmoid(avg AGS-U) — what the model would predict from each quintile's average score. Compare to **Win %** column: if model probability ≈ realized win rate, the score is well-calibrated as a probability and not just a discriminative ranker.

## § 2a — Model Ranking Quality

How well does AGS-U rank winners above losers, overall and per sport? **AUC ≥ 0.55** is meaningful at our sample sizes; **AUC > 0.60** is strong; **AUC ≈ 0.50** is chance. **Brier** measures probability calibration (lower = better, 0.25 = coin-flip prior, sub-0.24 = beats market).

### Overall (since cutover)

| N | AUC   | Spearman ρ | Pt-biserial r | Brier (model) | Brier (market) | Δ vs market |
|---|-------|------------|---------------|---------------|----------------|-------------|
| 222 | 0.492 | -0.044 | 0.063 | 0.2900 | 0.2436 | -0.0464 |

### Per sport

| Sport | N    | AUC   | Spearman ρ | Top Q (Q5) WR | Bot Q (Q1) WR | Q5−Q1 gap |
|-------|------|-------|------------|---------------|---------------|-----------|
| MLB   |  165 | 0.468 |     -0.124 |         47.1% |          0.0% | +47.1pp |
| NBA   |   38 | 0.594 |      0.258 |         50.0% |          0.0% | +50.0pp |
| NHL   |   19 | —     | —          | —             | —             | —         |

> **Reading this table:** the largest Q5−Q1 gap = the sport where AGS-U is doing the most work. Negative AUC (< 0.5) on a sport = the model is anti-predictive there and may need a per-sport coefficient set (see `scripts/_agsu_final_fit.mjs`).

## § 3 — Univariate Feature Analysis (active features)

Each active AGS-U feature scored on its own against W/L. **Corr(WIN)** should match the model's sign — positive features should correlate +, contrarian features should correlate −. **Lift** = top-decile ROI − bottom-decile ROI, in percentage points; positive lift means the feature is earning its slot.

| Feature           | Family         | Sign | β       | N    | Mean   | SD     | Corr(WIN) | Sign OK? | Top-dec ROI | Bot-dec ROI | Lift   |
|-------------------|----------------|------|---------|------|--------|--------|-----------|----------|-------------|-------------|--------|
| Δcount            | COUNT          | +    |  +0.537 |  222 |   0.16 |   1.16 |    -0.021 | 🟡 weak  |      -28.9% |       17.1% | -46.1pp |
| ΔHCsizeRatio      | INTENSITY_HC   | +    |  +0.279 |  222 |   0.18 |   1.27 |    -0.075 | 🚨 flipped |      -52.4% |        3.2% | -55.6pp |
| ΔΣrankNorm        | QUALITY_RANK   | −    |  -0.274 |   74 |   0.14 |   1.16 |    -0.260 | 🟢       |      -45.4% |       40.0% | -85.4pp |
| Δwinners          | QUALITY_TRACK  | −    |  -0.192 |   74 |   0.00 |   0.90 |    +0.000 | 🟡 weak  |      -34.9% |      -25.0% | -9.9pp |

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
| Δcount            |  +0.5371 |            +0.182 |             +0.237 |         -0.055 | 🚨 hurting |
| ΔHCsizeRatio      |  +0.2787 |            +0.038 |             +0.095 |         -0.056 | 🚨 hurting |
| ΔΣrankNorm        |  -0.2740 |            +0.014 |             -0.038 |         +0.053 | 🟢 helping |
| Δwinners          |  -0.1916 |            +0.001 |             -0.004 |         +0.006 | 🟡 neutral |

> Contribution = β · z(feature). The sum across all features (plus intercept) is the AGS-U score. A feature is "helping" if its average contribution is higher on winners than losers — i.e. the feature is correctly orienting the score.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier?

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 13n 69.2% +8% | 11n 54.5% +15% | 9n 22.2% -56% | 33n 51.5% -7% |
| PREMIUM  | 11n 45.5% -0% | 8n 50.0% -26% | 4n 50.0% -21% | 23n 47.8% -15% |
| LOCK     | 23n 47.8% -6% | 13n 61.5% +7% | 3n 0.0% -100% | 39n 48.7% -14% |
| LEAN     | 42n 61.9% +13% | 13n 61.5% +21% | 2n 50.0% +56% | 57n 61.4% +17% |
| WEAK     | 11n 54.5% +39% | 16n 50.0% -44% | —            | 27n 51.9% -7% |
| FADE     | 3n 33.3% -47% | —            | —            | 3n 33.3% -47% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 18n 50.0% -9%  | 12n 50.0% -10% | 3n 66.7% +24%  | 33n 51.5% -7%  |
| PREMIUM  | 16n 43.8% -12% | 2n 50.0% -24%  | 5n 60.0% -16%  | 23n 47.8% -15% |
| LOCK     | 33n 51.5% -5%  | 4n 25.0% -63%  | 2n 50.0% -42%  | 39n 48.7% -14% |
| LEAN     | 50n 64.0% +30% | 2n 50.0% -1%   | 5n 40.0% -74%  | 57n 61.4% +17% |
| WEAK     | 20n 50.0% -45% | 6n 66.7% +69%  | 1n 0.0% -100%  | 27n 51.9% -7%  |
| FADE     | 1n 0.0% -100%  | 1n 0.0% -100%  | 1n 100.0% +63% | 3n 33.3% -47%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 6n 100.0% +40% | 6n 33.3% -49% | 16n 56.3% +14% | 5n 0.0% -100% | —             |
| PREMIUM  | 6n 66.7% +5%  | 4n 25.0% -65% | 8n 50.0% -16% | 4n 50.0% +33% | 1n 0.0% -100% |
| LOCK     | 1n 100.0% +24% | 10n 70.0% -2% | 21n 33.3% -36% | 4n 50.0% +9%  | 3n 66.7% +77% |
| LEAN     | 3n 66.7% -27% | 19n 47.4% -26% | 26n 69.2% +43% | 8n 75.0% +81% | 1n 0.0% -100% |
| WEAK     | —             | 2n 100.0% +64% | 17n 47.1% -22% | 7n 42.9% -50% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | 2n 0.0% -100% | —             | —             |

## § 5 — Calibration Reliability (band × realized)

Slice AGS-U into bands derived from the LIVE calibration and compare average implied probability (from market odds) to realized win rate. **Realized > Implied** = AGS-U finds edge the market doesn't price; **Realized ≈ Implied** = AGS-U is just re-stating favorite-ness; **Realized < Implied** = anti-edge.

| AGS-U Band       | N    | Realized Win | Model P(WIN) | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|--------------|-------------|-------------|-----------|
| ≥ q90 (≥ +0.46)  |   65 |        53.8% |        76.5% |       53.7% |      +0.1pp |     -7.9% |
| q80–q90          |   23 |        34.8% |        59.2% |       55.4% |     -20.6pp |    -32.8% |
| q60–q80          |   29 |        55.2% |        54.9% |       55.1% |      +0.0pp |     11.4% |
| q40–q60          |   38 |        60.5% |        51.3% |       53.1% |      +7.5pp |     18.5% |
| q20–q40          |    9 |        44.4% |        47.9% |       51.4% |      -7.0pp |    -15.5% |
| < q20 (< -0.16)  |   18 |        61.1% |        26.6% |       49.8% |     +11.3pp |      9.4% |

**Brier — model:** 0.2900  ·  **Brier — market-implied:** 0.2436 (lower = better; 0.25 = coin-flip prior). Δ = -0.0464 (positive = model beats market).
**Edge correlation (realized vs implied):** Spearman ρ = -0.600.

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Top Driver           | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|----------------------|---------|------------|--------|
| 2026-05-28 | NBA   | TOTAL  | Under 219.5             |  -102 |  2.25u |  +0.84 | ELITE   | Q5   |   +0 | Δcount +1.03         | WIN     |     +2.21u |  +1.2% |
| 2026-05-28 | MLB   | TOTAL  | Over 8.5                |  -108 |  1.65u |  +0.15 | LOCK    | Q4   |   +0 | Δcount +0.32         | LOSS    |     -1.65u |  -1.2% |
| 2026-05-28 | MLB   | TOTAL  | Under 8.5               |  -107 |  0.00u |  +0.22 | LOCK    | Q4   |   +0 | ΔΣrankNorm +0.31     | TRACKED |      0.00u |      — |
| 2026-05-28 | MLB   | TOTAL  | Over 7                  |  -119 |  3.00u |  +0.55 | ELITE   | Q5   |   -1 | Δcount +0.68         | WIN     |     +2.52u |  +4.6% |
| 2026-05-28 | NBA   | SPREAD | Thunder                 |  -110 |  0.00u |  +0.51 | PREMIUM | Q5   |   +2 | ΔΣrankNorm +0.24     | TRACKED |      0.00u |      — |
| 2026-05-28 | NBA   | ML     | Spurs                   |  -154 |  3.75u |  -0.08 | WEAK    | Q2   |   -1 | Δcount -1.12         | WIN     |     +2.44u |  +0.2% |
| 2026-05-28 | MLB   | ML     | Minnesota Twins         |  +128 |  2.50u |  +0.34 | PREMIUM | Q5   |   +1 | Δcount +0.32         | LOSS    |     -2.50u |  -1.1% |
| 2026-05-28 | MLB   | ML     | Texas Rangers           |  -142 |  1.25u |  +0.04 | LEAN    | Q3   |   +0 | ΔΣrankNorm -0.39     | LOSS    |     -1.25u |  +1.7% |
| 2026-05-27 | NHL   | TOTAL  | Over 5.5                |  -112 |  2.25u |  +0.31 | PREMIUM | Q5   |   +0 | Δcount +0.68         | LOSS    |     -2.25u |  -4.8% |
| 2026-05-27 | MLB   | TOTAL  | Under 7                 |  +103 |  0.75u |  +0.10 | LEAN    | Q3   |   +0 | Δcount +0.32         | WIN     |     +0.77u |  +3.8% |
| 2026-05-27 | MLB   | TOTAL  | Under 8.5               |  +104 |  1.65u |  +0.14 | LOCK    | Q4   |   +0 | Δcount +0.32         | WIN     |     +1.72u |  +0.0% |
| 2026-05-27 | MLB   | TOTAL  | Under 7.5               |  -112 |  0.00u |  +0.46 | PREMIUM | Q5   |   +1 | Δcount +0.68         | TRACKED |      0.00u |  +0.0% |
| 2026-05-27 | MLB   | TOTAL  | Under 8.5               |  +105 |  0.00u |  +0.15 | LOCK    | Q4   |   +0 | Δcount +0.32         | TRACKED |      0.00u |  +0.0% |
| 2026-05-27 | NHL   | SPREAD | Canadiens               |  -194 |  0.00u |  +0.59 | ELITE   | Q5   |   +0 | Δcount +0.68         | TRACKED |      0.00u |  +0.5% |
| 2026-05-27 | MLB   | SPREAD | Washington Nationals    |  -135 |  3.00u |  +0.66 | ELITE   | Q5   |   +0 | Δcount +0.68         | WIN     |     +2.22u |  +1.5% |
| 2026-05-27 | MLB   | SPREAD | St. Louis Cardinals     |  -146 |  1.65u |  +0.18 | LOCK    | Q4   |   +1 | Δwinners +0.10       | WIN     |     +1.13u |  +0.3% |
| 2026-05-27 | MLB   | SPREAD | Miami Marlins           |  -160 |  0.75u |  +0.09 | LEAN    | Q3   |   +0 | Δwinners +0.10       | WIN     |     +0.47u |  +1.0% |
| 2026-05-27 | MLB   | SPREAD | Atlanta Braves          |  +150 |  2.50u |  +0.74 | ELITE   | Q5   |   +1 | Δcount +1.05         | LOSS    |     -2.50u |  -1.9% |
| 2026-05-27 | MLB   | ML     | Cleveland Guardians     |  -190 |  1.25u |  +0.10 | LEAN    | Q3   |   +0 | ΔΣrankNorm +0.25     | WIN     |     +0.66u |  -1.8% |
| 2026-05-27 | MLB   | ML     | Tampa Bay Rays          |  -126 |  5.00u |  +0.77 | ELITE   | Q5   |   +0 | Δcount +0.32         | LOSS    |     -5.00u |  +2.4% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   33 |      119.00 |      -7.79 |     -6.5% |      -0.24 |          -0.065 |
| PREMIUM  |   23 |       62.00 |      -9.02 |    -14.5% |      -0.39 |          -0.145 |
| LOCK     |   39 |       86.45 |     -11.87 |    -13.7% |      -0.30 |          -0.137 |
| LEAN     |   57 |       66.05 |     +11.09 |     16.8% |      +0.19 |          +0.168 |
| WEAK     |   27 |       20.35 |      -1.42 |     -7.0% |      -0.05 |          -0.070 |
| FADE     |    3 |        2.30 |      -1.08 |    -47.0% |      -0.36 |          -0.470 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). Live q20 = **-0.141**. We validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **58** · Win rate: **56.9%** · Flat-1u PnL: **+3.39u** · ROI: **5.8%**
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

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.
> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    48 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |    10 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     5 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    42 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

- **Computed at:** 2026-05-28T16:43:05.742Z
- **Schema version:** `ags-unified-v11`
- **Source:** cron
- **Sample size:** 636
- **Date range:** 2026-04-18 → 2026-05-27
- **Absolute mute floor:** -1.00 (safety bound below q20)

**AGS-U quintile boundaries (logit-score space):**

| Boundary | Value      | Action                |
|----------|------------|-----------------------|
| q20      |    -0.1412 | HARD MUTE floor       |
| q40      |    -0.0141 | LEAN floor (0.5×)     |
| q50      |    +0.0739 | 50th pctile           |
| q60      |    +0.1241 | LOCK floor (1.10×)    |
| q80      |    +0.3027 | PREMIUM floor (1.50×) |
| q90      |    +0.5117 | ELITE floor (2.00×)   |

**Feature normalizers (mean / sd) — z-scoring inputs to the model:**

| Feature           | β        | Mean   | SD     |
|-------------------|----------|--------|--------|
| Δcount            |  +0.5371 |   1.12 |   1.50 |
| ΔHCsizeRatio      |  +0.2787 |   1.31 |   5.48 |
| ΔΣrankNorm        |  -0.2740 |  60.55 |  90.56 |
| Δwinners          |  -0.1916 |   0.55 |   1.15 |

> ✅ Calibration weights match `src/lib/ags.js` — no drift.

## § 12 — Wallet Pool Health

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            107 |        21 |   10 |    4 |   72 |                     35 |
| NBA   |            191 |        55 |   21 |   21 |   94 |                     97 |
| NHL   |             94 |        19 |    7 |   13 |   55 |                     39 |

> ⚠ **MLB pool is < 50% of NBA pool** (35 vs 97). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified monitoring. Imports active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*