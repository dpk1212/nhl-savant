# AGS-Unified — Daily Monitoring Report

**Generated:** Wednesday, May 27, 2026 at 12:24 PM ET
**Active model:** `ags-unified-v11` · **AGS-U cutover:** 2026-05-14 · **Days live:** 13

> **Scope.** Every row in this report comes from picks AGS-U actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0a — Active Model

The composite scoring model — what every lock/mute/sizing decision is built on. Pulled at runtime from `src/lib/ags.js` so this report never drifts.

**Schema version:** `ags-unified-v11`
**Calibration source:** `cron` · sample N = 592 · range 2026-04-18 → 2026-05-25

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
| v11     | 05-25 → present      |    3 |     37 |   7 | 23-14  |  62.2% |     15.2% |     +13.93 |    +0.38 | 0.590 |        0.2416 | 🟢 LIVE  |

### v11 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v11 − v9           |   -23 |    +8.8pp |    +24.2pp |          +0.549 |   +0.041 |    +0.0984 | 🟢 better |
| v11 − v10          |   -25 |   +13.8pp |    +34.0pp |          +0.690 |   +0.196 |    +0.0388 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 29n 62.1% +14% | 4n 75.0% +37%  | 4n 50.0% -13%  | 37n 62.2% +15% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 9n +20%       | 9n +11%       | 8n +13%       | 9n +50%       | 2n -100%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **5 picks shipped at 0u despite AGS-U ≥ +0.10 and tier ∉ {FADE, WEAK}.** Sizing pipeline regression — see §10 for doc IDs. `v8_agsUnitsMult` should be > 0 for these.

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     18 | 12-6 |  66.7% |     33.4% |     +13.88 |    -0.49% |     2.31u |        1.03 | 4 (1-3) |
| Last 3 days |     56 | 30-26 |  53.6% |      3.3% |      +3.98 |    +0.25% |     2.17u |       -0.16 | 14 (10-4) |
| Last 7 days |    121 | 65-56 |  53.7% |     -3.4% |      -7.92 |    +0.38% |     1.94u |        0.02 | 24 (14-10) |
| All-time   |    160 | 86-74 |  53.8% |     -4.5% |     -14.16 |    +0.24% |     1.96u |       -0.12 | 33 (15-18) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   27 | 14-13  |  51.9% |     -4.7% |      -4.74 |     +3.05 |     3.73u |
| PREMIUM  | q80–q90     | 1.50×   |   20 | 11-9   |  55.0% |     -6.6% |      -3.77 |     +1.15 |     2.84u |
| LOCK     | q60–q80     | 1.10×   |   35 | 16-19  |  45.7% |    -17.4% |     -13.72 |     +0.72 |     2.25u |
| LEAN     | q40–q60     | 0.50×   |   52 | 32-20  |  61.5% |     19.2% |     +11.69 |     +0.20 |     1.17u |
| WEAK     | q20–q40     | 0.20×   |   24 | 12-12  |  50.0% |    -24.3% |      -3.79 |     -0.90 |     0.65u |
| FADE     | < q20       | 0.00×   |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -1.72 |     0.53u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `0` 🟡 random — calibration unclear
- ROI across tiers:   `-1` 🟡 partial

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) | Calibrated P(WIN) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|-------------------|
| Q1       |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -1.72 |               49.4% |             15.2% |
| Q2       |   35 | 20-15  |  57.1% |      0.9% |      +0.23 |     -0.62 |               51.1% |             34.9% |
| Q3       |   41 | 24-17  |  58.5% |     15.0% |      +7.67 |     +0.24 |               53.0% |             56.1% |
| Q4       |   35 | 16-19  |  45.7% |    -17.4% |     -13.72 |     +0.72 |               53.0% |             67.3% |
| Q5       |   47 | 25-22  |  53.2% |     -5.4% |      -8.51 |     +2.22 |               56.1% |             90.2% |

**Spearman ρ (quintile vs realized win%):** -0.100  ·  monotonicity `2/4`

> **Calibrated P(WIN)** = sigmoid(avg AGS-U) — what the model would predict from each quintile's average score. Compare to **Win %** column: if model probability ≈ realized win rate, the score is well-calibrated as a probability and not just a discriminative ranker.

## § 2a — Model Ranking Quality

How well does AGS-U rank winners above losers, overall and per sport? **AUC ≥ 0.55** is meaningful at our sample sizes; **AUC > 0.60** is strong; **AUC ≈ 0.50** is chance. **Brier** measures probability calibration (lower = better, 0.25 = coin-flip prior, sub-0.24 = beats market).

### Overall (since cutover)

| N | AUC   | Spearman ρ | Pt-biserial r | Brier (model) | Brier (market) | Δ vs market |
|---|-------|------------|---------------|---------------|----------------|-------------|
| 192 | 0.509 | -0.031 | 0.073 | 0.2924 | 0.2459 | -0.0465 |

### Per sport

| Sport | N    | AUC   | Spearman ρ | Top Q (Q5) WR | Bot Q (Q1) WR | Q5−Q1 gap |
|-------|------|-------|------------|---------------|---------------|-----------|
| MLB   |  140 | 0.480 |     -0.132 |         51.9% |             — |         — |
| NBA   |   35 | 0.602 |      0.276 |         46.2% |          0.0% | +46.2pp |
| NHL   |   17 | —     | —          | —             | —             | —         |

> **Reading this table:** the largest Q5−Q1 gap = the sport where AGS-U is doing the most work. Negative AUC (< 0.5) on a sport = the model is anti-predictive there and may need a per-sport coefficient set (see `scripts/_agsu_final_fit.mjs`).

## § 3 — Univariate Feature Analysis (active features)

Each active AGS-U feature scored on its own against W/L. **Corr(WIN)** should match the model's sign — positive features should correlate +, contrarian features should correlate −. **Lift** = top-decile ROI − bottom-decile ROI, in percentage points; positive lift means the feature is earning its slot.

| Feature           | Family         | Sign | β       | N    | Mean   | SD     | Corr(WIN) | Sign OK? | Top-dec ROI | Bot-dec ROI | Lift   |
|-------------------|----------------|------|---------|------|--------|--------|-----------|----------|-------------|-------------|--------|
| Δcount            | COUNT          | +    |  +0.537 |  192 |   0.13 |   1.18 |    +0.015 | 🟢       |      -22.4% |      -12.6% | -9.8pp |
| ΔHCsizeRatio      | INTENSITY_HC   | +    |  +0.279 |  192 |   0.22 |   1.36 |    -0.070 | 🚨 flipped |      -51.5% |      -16.7% | -34.8pp |
| ΔΣrankNorm        | QUALITY_RANK   | −    |  -0.274 |   44 |   0.17 |   1.18 |    -0.168 | 🟢       |     -100.0% |       20.1% | -120.1pp |
| Δwinners          | QUALITY_TRACK  | −    |  -0.192 |   44 |  -0.03 |   0.90 |    -0.053 | 🟢       |        5.2% |      -48.6% | +53.8pp |

> **Sign OK?** column flags features where the empirical correlation disagrees with the model's coefficient sign — a model-vs-data mismatch worth investigating. Weak (|corr| < 0.03) is shown but rarely actionable.

### Legacy features (no longer weighted in score — present on older picks for back-compat)

| Feature           | N (historical) | Mean   | Corr(WIN) | Top-dec ROI | Bot-dec ROI | Lift   |
|-------------------|----------------|--------|-----------|-------------|-------------|--------|
| ΔHCcount          |            181 |   0.11 |    -0.080 |      -65.0% |        4.6% | -69.7pp |
| ΔavgConv          |            181 |  -0.05 |    +0.074 |        7.0% |      -32.5% | +39.4pp |
| forShare          |            181 |   0.05 |    +0.135 |        9.4% |      -86.1% | +95.5pp |

## § 3a — Feature Contribution Attribution

Decomposes the average WINNER vs LOSER along each active feature's contribution to the score (β · z). **Winner > Loser** is what we want — the feature is pushing wins up and losses down. If Winner ≤ Loser on a feature, that feature is fighting the model on real data.

| Feature           | β        | Avg contrib (WIN) | Avg contrib (LOSS) | Δ (WIN − LOSS) | Verdict |
|-------------------|----------|-------------------|--------------------|----------------|---------|
| Δcount            |  +0.5371 |            +0.177 |             +0.216 |         -0.038 | 🚨 hurting |
| ΔHCsizeRatio      |  +0.2787 |            +0.049 |             +0.106 |         -0.058 | 🚨 hurting |
| ΔΣrankNorm        |  -0.2740 |            +0.012 |             -0.015 |         +0.027 | 🟢 helping |
| Δwinners          |  -0.1916 |            +0.008 |             -0.004 |         +0.012 | 🟢 helping |

> Contribution = β · z(feature). The sum across all features (plus intercept) is the AGS-U score. A feature is "helping" if its average contribution is higher on winners than losers — i.e. the feature is correctly orienting the score.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier?

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 9n 66.7% +6% | 10n 60.0% +24% | 8n 25.0% -52% | 27n 51.9% -5% |
| PREMIUM  | 9n 55.6% +12% | 7n 57.1% -18% | 4n 50.0% -21% | 20n 55.0% -7% |
| LOCK     | 21n 47.6% -7% | 11n 54.5% +1% | 3n 0.0% -100% | 35n 45.7% -17% |
| LEAN     | 37n 62.2% +16% | 13n 61.5% +21% | 2n 50.0% +56% | 52n 61.5% +19% |
| WEAK     | 9n 55.6% +33% | 15n 46.7% -50% | —            | 24n 50.0% -24% |
| FADE     | 2n 50.0% +16% | —            | —            | 2n 50.0% +16% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 13n 53.8% -1%  | 11n 45.5% -16% | 3n 66.7% +24%  | 27n 51.9% -5%  |
| PREMIUM  | 14n 50.0% -6%  | 2n 50.0% -24%  | 4n 75.0% +2%   | 20n 55.0% -7%  |
| LOCK     | 29n 48.3% -8%  | 4n 25.0% -63%  | 2n 50.0% -42%  | 35n 45.7% -17% |
| LEAN     | 45n 64.4% +34% | 2n 50.0% -1%   | 5n 40.0% -74%  | 52n 61.5% +19% |
| WEAK     | 18n 50.0% -48% | 5n 60.0% +73%  | 1n 0.0% -100%  | 24n 50.0% -24% |
| FADE     | —              | 1n 0.0% -100%  | 1n 100.0% +63% | 2n 50.0% +16%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 6n 100.0% +40% | 4n 25.0% -55% | 14n 50.0% +5% | 3n 0.0% -100% | —             |
| PREMIUM  | 6n 66.7% +5%  | 4n 25.0% -65% | 7n 57.1% -7%  | 2n 100.0% +113% | 1n 0.0% -100% |
| LOCK     | —             | 9n 66.7% -7%  | 19n 31.6% -38% | 4n 50.0% +9%  | 3n 66.7% +77% |
| LEAN     | 2n 50.0% -52% | 16n 50.0% -20% | 25n 68.0% +41% | 8n 75.0% +81% | 1n 0.0% -100% |
| WEAK     | —             | 1n 100.0% +56% | 15n 46.7% -23% | 7n 42.9% -50% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | 1n 0.0% -100% | —             | —             |

## § 5 — Calibration Reliability (band × realized)

Slice AGS-U into bands derived from the LIVE calibration and compare average implied probability (from market odds) to realized win rate. **Realized > Implied** = AGS-U finds edge the market doesn't price; **Realized ≈ Implied** = AGS-U is just re-stating favorite-ness; **Realized < Implied** = anti-edge.

| AGS-U Band       | N    | Realized Win | Model P(WIN) | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|--------------|-------------|-------------|-----------|
| ≥ q90 (≥ +0.46)  |   59 |        54.2% |        78.2% |       54.0% |      +0.3pp |     -7.0% |
| q80–q90          |   20 |        40.0% |        59.4% |       56.5% |     -16.5pp |    -25.3% |
| q60–q80          |   25 |        52.0% |        55.0% |       54.7% |      -2.7pp |      9.4% |
| q40–q60          |   33 |        60.6% |        51.2% |       52.2% |      +8.4pp |     23.7% |
| q20–q40          |    5 |        40.0% |        48.1% |       49.9% |      -9.9pp |    -58.7% |
| < q20 (< -0.16)  |   18 |        61.1% |        25.5% |       49.4% |     +11.7pp |      9.4% |

**Brier — model:** 0.2924  ·  **Brier — market-implied:** 0.2459 (lower = better; 0.25 = coin-flip prior). Δ = -0.0465 (positive = model beats market).
**Edge correlation (realized vs implied):** Spearman ρ = -0.657.

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Top Driver           | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|----------------------|---------|------------|--------|
| 2026-05-26 | NBA   | TOTAL  | Over 216                |  -115 |  3.00u |  +0.82 | ELITE   | Q5   |   +0 | Δcount +0.67         | WIN     |     +2.61u |  -1.7% |
| 2026-05-26 | MLB   | TOTAL  | Over 8                  |  -104 |  0.75u |  +0.09 | LEAN    | Q3   |   +0 | Δcount -0.42         | LOSS    |     -0.75u |  +0.0% |
| 2026-05-26 | MLB   | TOTAL  | Over 8                  |  -110 |  1.65u |  +0.18 | LOCK    | Q4   |   +0 | Δcount +0.31         | WIN     |     +1.50u |  +0.0% |
| 2026-05-26 | NHL   | SPREAD | Golden Knights          |  -250 |  2.25u |  +0.41 | PREMIUM | Q5   |   +0 | Δcount +0.31         | WIN     |     +0.90u |  -0.5% |
| 2026-05-26 | NBA   | SPREAD | Thunder                 |  -102 |  0.00u |  +0.32 | PREMIUM | Q5   |   +2 | ΔHCsizeRatio +0.86   | TRACKED |      0.00u |  +0.2% |
| 2026-05-26 | MLB   | SPREAD | Kansas City Royals      |  +105 |  1.65u |  +0.15 | LOCK    | Q4   |   +0 | Δcount +0.31         | LOSS    |     -1.65u |  +0.0% |
| 2026-05-26 | MLB   | SPREAD | Colorado Rockies        |  -101 |  0.00u |  +0.28 | LOCK    | Q4   |   +1 | Δcount +0.31         | TRACKED |      0.00u |      — |
| 2026-05-26 | NHL   | ML     | Avalanche               |  -114 |  0.50u |  -0.08 | WEAK    | Q2   |   +0 | Δcount -0.42         | LOSS    |     -0.50u |  -0.2% |
| 2026-05-26 | NBA   | ML     | Thunder                 |  -194 |  3.75u |  +0.47 | PREMIUM | Q5   |   +4 | ΔHCcount +0.91       | WIN     |     +1.93u |  -4.4% |
| 2026-05-26 | MLB   | ML     | Washington Nationals    |  +116 |  2.50u |  +0.46 | PREMIUM | Q5   |   +0 | Δcount +0.31         | WIN     |     +2.90u |  +0.8% |
| 2026-05-26 | MLB   | ML     | Baltimore Orioles       |  -105 |  3.75u |  +0.24 | LOCK    | Q4   |   +1 | Δcount +0.31         | WIN     |     +3.57u |  +0.5% |
| 2026-05-26 | MLB   | ML     | St. Louis Cardinals     |  +180 |  0.00u |  -0.24 | FADE    | Q1   |   +1 | Δcount -0.78         | TRACKED |      0.00u |  -3.5% |
| 2026-05-26 | MLB   | ML     | Athletics               |  -112 |  3.75u |  +0.50 | PREMIUM | Q5   |   +1 | Δcount +0.67         | LOSS    |     -3.75u |  +1.2% |
| 2026-05-26 | MLB   | ML     | Philadelphia Phillies   |  -102 |  5.00u |  +0.56 | ELITE   | Q5   |   +1 | Δcount +0.67         | WIN     |     +4.90u |  +0.2% |
| 2026-05-26 | MLB   | ML     | New York Yankees        |  -200 |  3.75u |  +0.46 | PREMIUM | Q5   |   +0 | Δcount +0.31         | WIN     |     +1.88u |  -0.8% |
| 2026-05-26 | MLB   | ML     | Toronto Blue Jays       |  -122 |  1.25u |  +0.03 | LEAN    | Q3   |   +0 | Δcount -0.42         | WIN     |     +1.02u |  -1.0% |
| 2026-05-26 | MLB   | ML     | Los Angeles Angels      |  +116 |  1.25u |  +0.03 | LEAN    | Q3   |   +0 | Δcount -0.42         | WIN     |     +1.45u |  -0.8% |
| 2026-05-26 | MLB   | ML     | Colorado Rockies        |  +194 |  1.50u |  +0.14 | LOCK    | Q4   |   +0 | Δcount +0.31         | LOSS    |     -1.50u |  -1.8% |
| 2026-05-26 | MLB   | ML     | New York Mets           |  +105 |  2.75u |  -0.03 | WEAK    | Q2   |   +1 | Δcount -0.78         | LOSS    |     -2.75u |  +1.0% |
| 2026-05-26 | MLB   | ML     | Pittsburgh Pirates      |  -134 |  1.25u |  +0.09 | LEAN    | Q3   |   +0 | Δwinners +0.09       | WIN     |     +0.93u |  -0.4% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   27 |      100.75 |      -4.74 |     -4.7% |      -0.18 |          -0.047 |
| PREMIUM  |   20 |       56.75 |      -3.77 |     -6.6% |      -0.19 |          -0.066 |
| LOCK     |   35 |       78.75 |     -13.72 |    -17.4% |      -0.39 |          -0.174 |
| LEAN     |   52 |       60.80 |     +11.69 |     19.2% |      +0.22 |          +0.192 |
| WEAK     |   24 |       15.60 |      -3.79 |    -24.3% |      -0.16 |          -0.243 |
| FADE     |    2 |        1.05 |      +0.17 |     16.2% |      +0.08 |          +0.162 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). Live q20 = **-0.150**. We validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working.

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

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.
> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    38 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |     5 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    10 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    40 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-26T16:34:47.866Z
- **Schema version:** `ags-unified-v11`
- **Source:** cron
- **Sample size:** 592
- **Date range:** 2026-04-18 → 2026-05-25
- **Absolute mute floor:** -1.00 (safety bound below q20)

**AGS-U quintile boundaries (logit-score space):**

| Boundary | Value      | Action                |
|----------|------------|-----------------------|
| q20      |    -0.1500 | HARD MUTE floor       |
| q40      |    -0.0167 | LEAN floor (0.5×)     |
| q50      |    +0.0693 | 50th pctile           |
| q60      |    +0.1341 | LOCK floor (1.10×)    |
| q80      |    +0.3058 | PREMIUM floor (1.50×) |
| q90      |    +0.4987 | ELITE floor (2.00×)   |

**Feature normalizers (mean / sd) — z-scoring inputs to the model:**

| Feature           | β        | Mean   | SD     |
|-------------------|----------|--------|--------|
| Δcount            |  +0.5371 |   1.15 |   1.48 |
| ΔHCsizeRatio      |  +0.2787 |   1.36 |   5.54 |
| ΔΣrankNorm        |  -0.2740 |  62.36 |  90.41 |
| Δwinners          |  -0.1916 |   0.55 |   1.19 |

> ✅ Calibration weights match `src/lib/ags.js` — no drift.

## § 12 — Wallet Pool Health

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            107 |        24 |    7 |    4 |   72 |                     35 |
| NBA   |            191 |        50 |   24 |   23 |   94 |                     97 |
| NHL   |             93 |        19 |    7 |   11 |   56 |                     37 |

> ⚠ **MLB pool is < 50% of NBA pool** (35 vs 97). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified monitoring. Imports active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*