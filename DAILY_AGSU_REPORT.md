# AGS-Unified — Daily Monitoring Report

**Generated:** Wednesday, June 3, 2026 at 7:09 AM ET
**Active model:** `ags-unified-v12` · **AGS-U cutover:** 2026-05-14 · **Days live:** 20

> **Scope.** Every row in this report comes from picks AGS-U actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0a — Active Model

The composite scoring model — what every lock/mute/sizing decision is built on. Pulled at runtime from `src/lib/ags.js` so this report never drifts.

**Schema version:** `ags-unified-v12` — wallet-quality model with absolute-units ladder
**Calibration source:** `cron` · sample N = 744 · range 2026-04-18 → 2026-06-01

### Scoring formula (single feature, wallet-quality mean ratio)

```
per-wallet quality Q = tierWeight × min(roi,30) × clamp(sizeRatio,0.5,2.5) × min(1, sqrt(priorN/20))
  tierWeight: CONFIRMED=3, FLAT=2, otherwise 0 (HC_BASE gate)

per-side score (mean ratio):
  fMean = mean(Q for wallets on FOR side)
  aMean = mean(Q for wallets on AGAINST side)
  score = (fMean − aMean) / (fMean + aMean + 0.5)    ∈ ~[−1, +1]
```

**Why the mean (not sum)?** Sum rewards crowd size and re-introduces the v11 "more sharps = worse outcome" inversion. Mean isolates wallet QUALITY per side, leaving the count effect to the size-ratio term inside Q.

### Mute rule + tier ladder (ABSOLUTE units — no per-market base)

| Tier     | Band                 | Units | Source                          |
|----------|----------------------|-------|---------------------------------|
| ELITE    | > q80 (positives)    |  5.00 | `agsV12SizeMultiplier`         |
| PREMIUM  | q60–q80              |  3.00 | `agsV12SizeMultiplier`         |
| LOCK     | q40–q60              |  1.00 | `agsV12SizeMultiplier`         |
| LEAN     | q20–q40              |  0.50 | `agsV12SizeMultiplier`         |
| WEAK     | (0, q20]             |  0.25 | `agsV12SizeMultiplier`         |
| FADE     | ≤ 0 (MUTE)           |  0.00 | `agsV12SizeMultiplier`         |

> **Mute rule:** score ≤ 0 → **FADE** (0 units, pick is cancelled / hidden from locked list). No separate calibrated mute floor — the rule IS the gate. The positive-only distribution is then split into 5 quintiles for tier assignment.

> **Why 0.25/0.50/1.00/3.00/5.00?** Backtest (282 picks, 2026-05-14→05-31) showed per-tier ROI: ELITE +33%, PREMIUM +9%, LOCK −8%, LEAN +14%, WEAK −20%. The top-heavy ladder concentrates capital where edge actually lives while preserving volume above q20 so the lower tiers can still rotate. Net swing vs v11 production: **+70u PnL / +23pp ROI** on the same window.

### Legacy v11 logistic surface (still computed in parallel for §13 head-to-head)

| feature           | β        | direction       |
|-------------------|----------|-----------------|
| intercept         |  +0.0887 | —               |
| `dCount`           |  +0.5371 | PRO-CONSENSUS   |
| `dHcSizeRatio`     |  +0.2787 | PRO-CONSENSUS   |
| `dSumRankNorm`     |  -0.2740 | CONTRARIAN      |
| `dWinnerCtPreA`    |  -0.1916 | CONTRARIAN      |

> v11 stamps (`v8_ags`, `v8_agsTier`, `v8_agsComponents`) remain on every pick for back-test continuity and so §13 can compare the two models head-to-head. v11 is **not used for any live decision** in v12 mode.

## § 0b — AGS-U Model Version Comparison

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged by the calibration that scored them — v11 by feature-signature (`dSumRankNorm` / `dWinnerCtPreA` present in components), earlier versions by pick date against the calibration-history cutover schedule below.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    112 |  22 | 61-51  |  54.5% |      2.7% |      +6.51 |    +0.06 | 0.446 |        0.2643 | ⚪ retired |
| v12     | 06-01 → present      |    3 |      0 |  14 | 0-0    |      — |         — |      +0.00 |        — | 0.306 |             — | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           |   -60 |         — |          — |               — |   -0.243 |          — | 🚨 worse |
| v12 − v10          |   -62 |         — |          — |               — |   -0.088 |          — | 🚨 worse |
| v12 − v11          |  -112 |         — |          — |               — |   -0.140 |          — | 🚨 worse |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | All           |
|---------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | 62n 48.4% -19% |
| v11     | 97n 55.7% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | 112n 54.5% +3% |
| v12     | —              | —              | —              | —             |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 34n -19%      | 8n +53%       | 3n +4%        | 1n -250%      | —             | 🟡 partial (-1) |
| v10     | 9n -22%       | 7n -77%       | 14n -13%      | 21n +31%      | 7n -16%       | 🟡 partial (0) |
| v11     | 21n +0%       | 21n +4%       | 31n +1%       | 24n +13%      | 15n +3%       | 🟡 partial (0) |
| v12     | —             | —             | —             | —             | —             | —             |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **22 picks shipped at 0u despite AGS-U ≥ +0.10 and tier ∉ {FADE, WEAK}.** Sizing pipeline regression — see §10 for doc IDs. `v8_agsUnitsMult` should be > 0 for these.

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |      0 | 0-0 |      — |         — |      +0.00 |    -0.75% |         — |           — | 10 (5-5) |
| Last 3 days |     11 | 5-6 |  45.5% |      3.0% |      +0.72 |    -0.46% |     2.19u |       -0.87 | 18 (10-8) |
| Last 7 days |     75 | 38-37 |  50.7% |     -5.0% |      -7.42 |    -0.44% |     1.97u |       -0.67 | 29 (16-13) |
| All-time   |    235 | 124-111 |  52.8% |     -4.7% |     -21.58 |    +0.00% |     1.96u |       -0.46 | 62 (31-31) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   65 | 32-33  |  49.2% |    -11.0% |     -22.14 |     +1.97 |     3.11u |
| PREMIUM  | q80–q90     | 1.50×   |   36 | 19-17  |  52.8% |     -6.0% |      -5.35 |     +0.41 |     2.46u |
| LOCK     | q60–q80     | 1.10×   |   48 | 23-25  |  47.9% |     -2.7% |      -2.57 |     +0.22 |     2.01u |
| LEAN     | q40–q60     | 0.50×   |   46 | 28-18  |  60.9% |     17.4% |      +7.55 |     +0.07 |     0.94u |
| WEAK     | q20–q40     | 0.20×   |   22 | 11-11  |  50.0% |     -0.4% |      -0.09 |     -0.07 |     0.93u |
| FADE     | < q20       | 0.00×   |   18 | 11-7   |  61.1% |      9.4% |      +1.02 |     -1.37 |     0.60u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `1` 🚨 inverted — higher tiers winning LESS than lower
- ROI across tiers:   `3` 🚨 inverted — sizing ladder is destroying value

## § 1b — V12 Tier Calibration (wallet-quality model)

Same monotonicity test as §1, but on the **v12 wallet-quality model**. Tiers are derived from `v8_agsV12Tier` (cron-stamped). The v12 ladder is **ABSOLUTE units** (no per-market base), so per-tier "Avg Stake" should equal the ladder value exactly when sizing is healthy.

### All-time tier breakdown (v12-scored picks only)

| Tier     | Band                 | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-v12 | Avg Stake |
|----------|----------------------|--------|------|--------|--------|-----------|------------|-------------|-----------|
| ELITE    | > q80 (positives)    |  5.00u |    0 | 0-0    |      — |         — |      +0.00 |           — |         — |
| PREMIUM  | q60–q80              |  3.00u |    0 | 0-0    |      — |         — |      +0.00 |           — |         — |
| LOCK     | q40–q60              |  1.00u |    0 | 0-0    |      — |         — |      +0.00 |           — |         — |
| LEAN     | q20–q40              |  0.50u |    0 | 0-0    |      — |         — |      +0.00 |           — |         — |
| WEAK     | (0, q20]             |  0.25u |    0 | 0-0    |      — |         — |      +0.00 |           — |         — |
| FADE     | ≤ 0 (MUTE)           |  0.00u |    0 | 0-0    |      — |         — |      +0.00 |      -0.216 |         — |

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) | Calibrated P(WIN) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|-------------------|
| Q1       |   18 | 11-7   |  61.1% |      9.4% |      +1.02 |     -1.37 |               49.6% |             20.3% |
| Q2       |   22 | 11-11  |  50.0% |     -0.4% |      -0.09 |     -0.07 |               51.8% |             48.3% |
| Q3       |   46 | 28-18  |  60.9% |     17.4% |      +7.55 |     +0.07 |               53.9% |             51.7% |
| Q4       |   48 | 23-25  |  47.9% |     -2.7% |      -2.57 |     +0.22 |               53.9% |             55.5% |
| Q5       |  101 | 51-50  |  50.5% |     -9.5% |     -27.49 |     +1.36 |               53.7% |             79.6% |

**Spearman ρ (quintile vs realized win%):** -0.500  ·  monotonicity `0/4`

> **Calibrated P(WIN)** = sigmoid(avg AGS-U) — what the model would predict from each quintile's average score. Compare to **Win %** column: if model probability ≈ realized win rate, the score is well-calibrated as a probability and not just a discriminative ranker.

## § 2b — V12 Quintile Calibration

_(no graded v12 picks in the positive-score region yet)_

## § 2a — Model Ranking Quality

How well does AGS-U rank winners above losers, overall and per sport? **AUC ≥ 0.55** is meaningful at our sample sizes; **AUC > 0.60** is strong; **AUC ≈ 0.50** is chance. **Brier** measures probability calibration (lower = better, 0.25 = coin-flip prior, sub-0.24 = beats market).

### Overall (since cutover)

| N | AUC   | Spearman ρ | Pt-biserial r | Brier (model) | Brier (market) | Δ vs market |
|---|-------|------------|---------------|---------------|----------------|-------------|
| 296 | 0.466 | -0.077 | 0.043 | 0.2869 | 0.2428 | -0.0441 |

### Per sport

| Sport | N    | AUC   | Spearman ρ | Top Q (Q5) WR | Bot Q (Q1) WR | Q5−Q1 gap |
|-------|------|-------|------------|---------------|---------------|-----------|
| MLB   |  233 | 0.453 |     -0.112 |         52.2% |         63.6% | -11.5pp |
| NBA   |   41 | 0.564 |      0.215 |         42.1% |         50.0% | -7.9pp |
| NHL   |   22 | 0.581 |      0.075 |         53.8% |        100.0% | -46.2pp |

> **Reading this table:** the largest Q5−Q1 gap = the sport where AGS-U is doing the most work. Negative AUC (< 0.5) on a sport = the model is anti-predictive there and may need a per-sport coefficient set (see `scripts/_agsu_final_fit.mjs`).

## § 3 — Univariate Feature Analysis (active features)

Each active AGS-U feature scored on its own against W/L. **Corr(WIN)** should match the model's sign — positive features should correlate +, contrarian features should correlate −. **Lift** = top-decile ROI − bottom-decile ROI, in percentage points; positive lift means the feature is earning its slot.

| Feature           | Family         | Sign | β       | N    | Mean   | SD     | Corr(WIN) | Sign OK? | Top-dec ROI | Bot-dec ROI | Lift   |
|-------------------|----------------|------|---------|------|--------|--------|-----------|----------|-------------|-------------|--------|
| Δcount            | COUNT          | +    |  +0.537 |  296 |   0.15 |   1.11 |    -0.076 | 🚨 flipped |      -26.7% |       19.7% | -46.4pp |
| ΔHCsizeRatio      | INTENSITY_HC   | +    |  +0.279 |  296 |   0.15 |   1.16 |    -0.081 | 🚨 flipped |      -46.6% |        6.4% | -53.0pp |
| ΔΣrankNorm        | QUALITY_RANK   | −    |  -0.274 |  148 |   0.06 |   1.12 |    -0.242 | 🟢       |      -21.4% |       47.7% | -69.2pp |
| Δwinners          | QUALITY_TRACK  | −    |  -0.192 |  148 |  -0.09 |   0.86 |    -0.033 | 🟢       |       -4.3% |        4.5% | -8.8pp |

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
| Δcount            |  +0.5371 |            +0.160 |             +0.241 |         -0.081 | 🚨 hurting |
| ΔHCsizeRatio      |  +0.2787 |            +0.033 |             +0.075 |         -0.042 | 🚨 hurting |
| ΔΣrankNorm        |  -0.2740 |            +0.012 |             -0.045 |         +0.057 | 🟢 helping |
| Δwinners          |  -0.1916 |            +0.006 |             +0.001 |         +0.005 | 🟡 neutral |

> Contribution = β · z(feature). The sum across all features (plus intercept) is the AGS-U score. A feature is "helping" if its average contribution is higher on winners than losers — i.e. the feature is correctly orienting the score.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier?

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 25n 56.0% -4% | 24n 58.3% +13% | 16n 25.0% -54% | 65n 49.2% -11% |
| PREMIUM  | 18n 66.7% +38% | 16n 37.5% -44% | 2n 50.0% -24% | 36n 52.8% -6% |
| LOCK     | 35n 40.0% -21% | 13n 69.2% +36% | —            | 48n 47.9% -3% |
| LEAN     | 35n 65.7% +22% | 10n 40.0% -25% | 1n 100.0% +149% | 46n 60.9% +17% |
| WEAK     | 14n 42.9% +10% | 8n 62.5% -26% | —            | 22n 50.0% -0% |
| FADE     | 7n 71.4% +60% | 11n 54.5% -24% | —            | 18n 61.1% +9% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 40n 52.5% -4%  | 17n 41.2% -23% | 8n 50.0% -21%  | 65n 49.2% -11% |
| PREMIUM  | 29n 51.7% -5%  | 2n 50.0% -16%  | 5n 60.0% -10%  | 36n 52.8% -6%  |
| LOCK     | 43n 53.5% +9%  | 1n 0.0% -100%  | 4n 0.0% -100%  | 48n 47.9% -3%  |
| LEAN     | 44n 59.1% +15% | 1n 100.0% +97% | 1n 100.0% +97% | 46n 60.9% +17% |
| WEAK     | 20n 50.0% -13% | 1n 100.0% +65% | 1n 0.0% -100%  | 22n 50.0% -0%  |
| FADE     | 11n 63.6% -23% | 6n 50.0% +58%  | 1n 100.0% +63% | 18n 61.1% +9%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 7n 85.7% +24% | 13n 38.5% -51% | 34n 55.9% +13% | 10n 20.0% -66% | 1n 0.0% -100% |
| PREMIUM  | 5n 80.0% +34% | 9n 66.7% +29% | 13n 46.2% -30% | 8n 37.5% -30% | 1n 0.0% -100% |
| LOCK     | 2n 50.0% -38% | 14n 57.1% -6% | 25n 36.0% -21% | 3n 100.0% +118% | 4n 50.0% +45% |
| LEAN     | 4n 75.0% +40% | 13n 53.8% -15% | 21n 71.4% +42% | 8n 37.5% -2%  | —             |
| WEAK     | —             | 6n 66.7% +20% | 11n 36.4% -23% | 5n 60.0% +35% | —             |
| FADE     | —             | 1n 100.0% +63% | 12n 58.3% +26% | 4n 50.0% -42% | 1n 100.0% +160% |

## § 5 — Calibration Reliability (band × realized)

Slice AGS-U into bands derived from the LIVE calibration and compare average implied probability (from market odds) to realized win rate. **Realized > Implied** = AGS-U finds edge the market doesn't price; **Realized ≈ Implied** = AGS-U is just re-stating favorite-ness; **Realized < Implied** = anti-edge.

| AGS-U Band       | N    | Realized Win | Model P(WIN) | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|--------------|-------------|-------------|-----------|
| ≥ q90 (≥ +0.46)  |   72 |        52.8% |        75.4% |       53.5% |      -0.8pp |     -7.7% |
| q80–q90          |   37 |        40.5% |        59.3% |       53.7% |     -13.2pp |    -20.9% |
| q60–q80          |   41 |        53.7% |        55.0% |       54.5% |      -0.8pp |      8.2% |
| q40–q60          |   50 |        56.0% |        51.5% |       53.7% |      +2.3pp |     10.2% |
| q20–q40          |   17 |        58.8% |        47.8% |       51.0% |      +7.8pp |     13.8% |
| < q20 (< -0.16)  |   18 |        61.1% |        27.8% |       49.6% |     +11.5pp |      9.4% |

**Brier — model:** 0.2869  ·  **Brier — market-implied:** 0.2428 (lower = better; 0.25 = coin-flip prior). Δ = -0.0441 (positive = model beats market).
**Edge correlation (realized vs implied):** Spearman ρ = -0.543.

## § 5b — V12 Calibration Reliability (band × realized)

Slice v12 score into bands derived from the LIVE v12 calibration (`v12Quintiles`). **Realized > Implied** = v12 finds edge the market doesn't price.

| v12 Band         | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| > q80 (> 0.983)  |    0 |            — |           — |           — |         — |
| q60–q80          |    0 |            — |           — |           — |         — |
| q40–q60          |    0 |            — |           — |           — |         — |
| q20–q40          |    0 |            — |           — |           — |         — |
| (0, q20]         |    0 |            — |           — |           — |         — |
| ≤ 0 (MUTE)       |   14 |        50.0% |       49.8% |      +0.2pp |         — |

> The MUTE row (≤ 0) shows what would have happened if the v12 mute rule didn't fire. If that band wins at > 52%, the mute rule is too aggressive.

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. v11 and v12 scores are shown side-by-side; **Δ** flags rows where the two models disagree on tier (a high-value debugging signal during the v11→v12 transition).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | v11 AGS | v11 Tier | v12 AGS | v12 Tier | Δ | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|---------|----------|---------|----------|---|---------|------------|--------|
| 2026-06-02 | MLB   | TOTAL  | Under 9                 |  -108 |  0.00u |   +0.17 | LOCK     |  -0.269 | FADE     | ▼ | TRACKED |      0.00u |  +1.1% |
| 2026-06-02 | MLB   | TOTAL  | Under 8.5               |  -114 |  0.00u |   -0.01 | WEAK     |  +0.000 | FADE     | ▼ | TRACKED |      0.00u |  -4.0% |
| 2026-06-02 | MLB   | SPREAD | Milwaukee Brewers       |  -111 |  0.00u |   +0.60 | ELITE    |  +0.000 | FADE     | ▼ | TRACKED |      0.00u |  +0.7% |
| 2026-06-02 | MLB   | SPREAD | Detroit Tigers          |  -160 |  0.00u |   +0.11 | LEAN     |  +0.000 | FADE     | ▼ | TRACKED |      0.00u |  +0.6% |
| 2026-06-02 | MLB   | SPREAD | New York Yankees        |  -105 |  0.00u |   +0.15 | LOCK     |  +0.000 | FADE     | ▼ | TRACKED |      0.00u |  -1.2% |
| 2026-06-02 | MLB   | ML     | San Francisco Giants    |  +214 |  0.00u |   +0.43 | PREMIUM  |  +0.000 | FADE     | ▼ | TRACKED |      0.00u |  -0.4% |
| 2026-06-02 | MLB   | ML     | San Diego Padres        |  +128 |  0.00u |   +0.44 | PREMIUM  |  +0.000 | FADE     | ▼ | TRACKED |      0.00u |  -3.8% |
| 2026-06-02 | MLB   | ML     | Cincinnati Reds         |  -122 |  0.00u |   +0.73 | ELITE    |  -0.835 | FADE     | ▼ | TRACKED |      0.00u |  +0.0% |
| 2026-06-02 | MLB   | ML     | Minnesota Twins         |  +110 |  0.00u |   +0.31 | LOCK     |  +0.000 | FADE     | ▼ | TRACKED |      0.00u |  +1.6% |
| 2026-06-02 | MLB   | ML     | Colorado Rockies        |  +135 |  0.00u |   -0.39 | FADE     |  -0.939 | FADE     |   | TRACKED |      0.00u |  -2.0% |
| 2026-06-01 | MLB   | SPREAD | San Francisco Giants    |  -174 |  0.00u |   +0.46 | PREMIUM  |  +0.000 | FADE     | ▼ | TRACKED |      0.00u |  -0.7% |
| 2026-06-01 | MLB   | SPREAD | Colorado Rockies        |  -118 |  0.00u |   -0.09 | WEAK     |  +0.000 | FADE     | ▼ | TRACKED |      0.00u |  +0.6% |
| 2026-06-01 | MLB   | ML     | San Francisco Giants    |  +125 |  0.00u |   +0.77 | ELITE    |  +0.000 | FADE     | ▼ | TRACKED |      0.00u |  -2.6% |
| 2026-06-01 | MLB   | ML     | Arizona Diamondbacks    |  +145 |  0.00u |   -0.23 | FADE     |  -0.984 | FADE     |   | TRACKED |      0.00u |  -0.3% |
| 2026-06-01 | MLB   | ML     | Los Angeles Angels      |  -198 |  0.25u |   +0.11 | LEAN     |       — | —        |   | LOSS    |     -0.25u |  +0.4% |
| 2026-05-31 | MLB   | TOTAL  | Over 9.5                |  +101 |  1.65u |   +0.24 | LOCK     |       — | —        |   | LOSS    |     -1.65u |  +0.2% |
| 2026-05-31 | MLB   | TOTAL  | Under 9                 |  -114 |  1.65u |   +0.21 | LOCK     |       — | —        |   | LOSS    |     -1.65u |  +1.1% |
| 2026-05-31 | MLB   | SPREAD | Los Angeles Angels      |  -117 |  0.00u |   +0.26 | LOCK     |       — | —        |   | TRACKED |      0.00u |  -0.4% |
| 2026-05-31 | MLB   | ML     | Toronto Blue Jays       |  +110 |  1.25u |   +0.07 | LEAN     |       — | —        |   | LOSS    |     -1.25u |  -1.5% |
| 2026-05-31 | MLB   | ML     | San Francisco Giants    |  -112 |  0.00u |   -0.57 | FADE     |       — | —        |   | TRACKED |      0.00u |  +0.0% |

> Δ column: `▲` v12 tier > v11 tier (v12 likes the pick more) · `▼` v12 tier < v11 tier · `≠` non-comparable disagreement (one side FADE) · blank = agree or only one model stamped. Pick rows where Δ is set and the OUTCOME contradicts v12 are the highest-priority debugging targets.

## § 7 — Sizing Audit

Does the AGS-U sizing ladder actually capture more edge per unit at the top? If **Per-unit Return** is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one. **Expected stake** is the ladder's target for that tier; **Avg stake actual** is the realized average. Drift between the two is a sizing-pipeline regression.

### v11 ladder (legacy — multipliers × per-market base)

| Tier     | N    | Total Stake | Avg stake | Expected | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|-----------|----------|------------|-----------|------------|-----------------|
| ELITE    |   65 |      202.00 |     3.11u | 2.00× base |     -22.14 |    -11.0% |      -0.34 |          -0.110 |
| PREMIUM  |   36 |       88.65 |     2.46u | 1.50× base |      -5.35 |     -6.0% |      -0.15 |          -0.060 |
| LOCK     |   48 |       96.40 |     2.01u | 1.10× base |      -2.57 |     -2.7% |      -0.05 |          -0.027 |
| LEAN     |   46 |       43.35 |     0.94u | 0.50× base |      +7.55 |     17.4% |      +0.16 |          +0.174 |
| WEAK     |   22 |       20.35 |     0.93u | 0.20× base |      -0.09 |     -0.4% |      -0.00 |          -0.004 |
| FADE     |   18 |       10.80 |     0.60u | 0.00× base |      +1.02 |      9.4% |      +0.06 |          +0.094 |

### v12 ladder (active — absolute units, mute-by-rule below zero)

| Tier     | N    | Total Stake | Avg stake | Expected | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|-----------|----------|------------|-----------|------------|-----------------|

> 🚨 in **Avg stake** column = realized average differs from expected ladder value by > 0.05u. Causes: odds-cap on heavy underdogs (legitimate), per-market override (legitimate for futures), `unitsFromAgsV12` bug (debug `syncPickStateAuthoritative.js`).

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

### v11 mute floor (calibration-based, q20 = -0.158)

Below-q20 v11 AGS-U values are SHADOWed (never shipped under v11). We validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **154** · Win rate: **55.8%** · Flat-1u PnL: **+18.71u** · ROI: **12.2%**
- Verdict: 🚨 Mute floor may be too aggressive — SHADOWed picks win at ≥52%.

### v12 mute rule (score ≤ 0 → FADE → 0 units)

v12 has no calibrated mute floor — the rule IS the gate. A pick with v12 score ≤ 0 is FADE and gets 0 units regardless of v11 tier. We validate the rule by grading what muted picks WOULD have returned at a flat 1u.

| Population             | N    | Win %  | Flat-1u PnL | Flat ROI  |
|------------------------|------|--------|-------------|-----------|
| v12 muted (score ≤ 0) |   22 |  50.0% |       -0.36 |     -1.6% |
| v12 live  (score > 0) |   22 |  50.0% |       +0.94 |      4.3% |

- Verdict: 🟡 v12 mute rule is **break-even** — live and muted populations win at similar rates. Wallet-quality features may need re-tuning.

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
| 2026-06-01 |    1 | 0-1   |   0.0% |      -0.25 |     -21.58 |     52.8% |   4 |      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-06-02 |    0 | 0-0   |      — |      +0.00 |     -21.58 |     52.8% |  10 |      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.
> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

### v11 / cross-cutting checks

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    75 | 🟡 informational only — true tracked plays |
| LOCK+ v11 tier picks with `finalUnits == 0` (v11 sizing reg)  |    22 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     0 | 🟡 no live shipped picks pending |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     1 | 🟡 some picks missing v11 tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    48 | 🟡 informational — AGS-U calibration controls sample adequacy |

### v12 health checks (17 picks stamped under v12)

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| v12 FADE-tier but `lockStage=LOCKED` (UI contradiction)      |     0 | 🟢 no v12 FADE picks stuck in LOCKED state |
| `v8_agsV12UnitsApplied` ≠ `finalUnits` (ladder→ship drift)   |     0 | 🟢 v12 ladder matches finalUnits exactly |
| v12-scored picks missing `v8_agsV12Tier`                      |     0 | 🟢 every v12 pick has a tier |
| `v8_agsTier` ≠ `v8_agsV12Tier` (cron stamp drift)            |     0 | 🟢 v8_agsTier mirrors v12 tier exactly |
| v11 vs v12 tier disagreement on LIVE-shipped picks            |     0 | 🟢 models agree on every shipped pick |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

**Sizing-regression detail (LOCK+ tier shipped at 0u — money left on the table):**

| Doc ID                              | Sport | Tier    | AGS-U  | Outcome | "Lost" PnL (1u) |
|-------------------------------------|-------|---------|--------|---------|-----------------|
| 2026-05-18_MLB_bal_tbr              | MLB   | ELITE   |  +1.13 | LOSS    |           -1.00u |
| 2026-05-20_MLB_lad_sdp              | MLB   | PREMIUM |  +0.42 | WIN     |           +0.51u |
| 2026-05-24_MLB_nym_mia_total        | MLB   | PREMIUM |  +0.33 | WIN     |           +0.99u |
| 2026-05-26_MLB_col_lad_spread       | MLB   | LOCK    |  +0.28 | LOSS    |           -1.00u |
| 2026-05-26_NBA_sas_okc_spread       | NBA   | PREMIUM |  +0.32 | WIN     |           +0.98u |
| 2026-05-27_NHL_car_mtl_spread       | NHL   | ELITE   |  +0.59 | LOSS    |           -1.00u |
| 2026-05-27_MLB_chc_pit_total        | MLB   | LOCK    |  +0.15 | LOSS    |           -1.00u |
| 2026-05-27_MLB_mia_tor_total        | MLB   | PREMIUM |  +0.46 | WIN     |           +0.89u |
| 2026-05-28_NBA_okc_sas_spread       | NBA   | PREMIUM |  +0.51 | LOSS    |           -1.00u |
| 2026-05-28_MLB_laa_det_total        | MLB   | LOCK    |  +0.22 | WIN     |           +0.93u |
| 2026-05-30_NBA_sas_okc              | NBA   | PREMIUM |  +0.45 | LOSS    |           -1.00u |
| 2026-05-31_MLB_laa_tbr_spread       | MLB   | LOCK    |  +0.26 | LOSS    |           -1.00u |
| 2026-06-01_MLB_sfg_mil              | MLB   | ELITE   |  +0.77 | LOSS    |           -1.00u |
| 2026-06-01_MLB_sfg_mil_spread       | MLB   | PREMIUM |  +0.46 | LOSS    |           -1.00u |
| 2026-06-02_MLB_cws_min              | MLB   | LOCK    |  +0.31 | WIN     |           +1.10u |
| 2026-06-02_MLB_kcr_cin              | MLB   | ELITE   |  +0.73 | WIN     |           +0.82u |
| 2026-06-02_MLB_sdp_phi              | MLB   | PREMIUM |  +0.44 | LOSS    |           -1.00u |
| 2026-06-02_MLB_sfg_mil              | MLB   | PREMIUM |  +0.43 | LOSS    |           -1.00u |
| 2026-06-02_MLB_cle_nyy_spread       | MLB   | LOCK    |  +0.15 | LOSS    |           -1.00u |
| 2026-06-02_MLB_det_tbr_spread       | MLB   | LEAN    |  +0.11 | WIN     |           +0.63u |
| 2026-06-02_MLB_sfg_mil_spread       | MLB   | ELITE   |  +0.60 | WIN     |           +0.90u |
| 2026-06-02_MLB_mia_wsh_total        | MLB   | LOCK    |  +0.17 | LOSS    |           -1.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-06-02T17:07:50.892Z
- **Schema version:** `ags-unified-v12`
- **Source:** cron
- **Sample size:** 744
- **Date range:** 2026-04-18 → 2026-06-01
- **v11 absolute mute floor:** -1.00 (safety bound below q20)
- **v12 mute rule:** `score ≤ 0 → FADE → 0u` (rule-based, no calibrated floor)

**v11 AGS-U quintile boundaries (logit-score space):**

| Boundary | Value      | Action                |
|----------|------------|-----------------------|
| q20      |    -0.1584 | HARD MUTE floor       |
| q40      |    -0.0067 | LEAN floor (0.5×)     |
| q50      |    +0.0724 | 50th pctile           |
| q60      |    +0.1315 | LOCK floor (1.10×)    |
| q80      |    +0.3093 | PREMIUM floor (1.50×) |
| q90      |    +0.5087 | ELITE floor (2.00×)   |

**v12 quintile boundaries (positive-score distribution, source: firestore (live)):**

| Boundary | Value      | Tier promoted | Units |
|----------|------------|---------------|-------|
| ≤ 0      | (rule)     | FADE          | 0.00  |
| q20      |     0.6982 | WEAK→LEAN     | 0.25→0.50 |
| q40      |     0.9387 | LEAN→LOCK     | 0.50→1.00 |
| q60      |     0.9684 | LOCK→PREMIUM  | 1.00→3.00 |
| q80      |     0.9831 | PREMIUM→ELITE | 3.00→5.00 |

**v11 feature normalizers (mean / sd) — z-scoring inputs to legacy logistic model:**

| Feature           | β        | Mean   | SD     |
|-------------------|----------|--------|--------|
| Δcount            |  +0.5371 |   1.13 |   1.47 |
| ΔHCsizeRatio      |  +0.2787 |   1.24 |   5.15 |
| ΔΣrankNorm        |  -0.2740 |  60.71 |  91.23 |
| Δwinners          |  -0.1916 |   0.53 |   1.14 |

> ✅ v11 calibration weights match `src/lib/ags.js` — no drift.

## § 12 — Wallet Pool Health

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            119 |        29 |    8 |    7 |   75 |                     44 |
| NBA   |            193 |        54 |   22 |   20 |   97 |                     96 |
| NHL   |             96 |        20 |    6 |   13 |   57 |                     39 |

> ⚠ **MLB pool is < 50% of NBA pool** (44 vs 96). MLB AUC will be inherently capped by sample size. To meaningfully improve MLB further: broaden leaderboard ingestion or relax Source B threshold (`exportWalletProfiles.js`).

## § 13 — V11 vs V12 Head-to-Head

The most actionable comparison: every pick that was scored under BOTH v11 and v12. Same realized outcome, same odds, two different model decisions. Tells us which model would have made more money on the same opportunity set.

**Comparison pool:** 14 graded picks with both v11 + v12 stamps.

### Ranking quality on the shared pool

| Model | AUC   | Pt-biserial r | Verdict |
|-------|-------|---------------|---------|
| v11   | 0.327 |        -0.275 | 🟢 better ranker than v12 |
| v12   | 0.306 |        -0.457 | ⚪ worse ranker than v11 |

> Brier is omitted here because the v11 score is a logit (→ probability via sigmoid) and the v12 score is a mean-ratio in [−1, +1] that isn't a probability. AUC + pt-biserial r are rank-based and apples-to-apples. Per-version Brier vs the market is in §0b for each model on its own calibration.

### Counterfactual PnL — each model ships its OWN ladder on the shared pool

| Model | Total Stake | PnL (u)    | ROI %     | Avg stake/pick | Edge vs v11    |
|-------|-------------|------------|-----------|----------------|----------------|
| v11   |       14.70 |      -3.77 |    -25.6% |           1.05u | — (baseline) |
| v12   |        0.00 |      +0.00 |         — |           0.00u | +3.77u PnL |

> Each model is judged on its OWN sizing decisions for the same opportunity set. v11 uses tier multipliers (treating base = 1u for fairness). v12 uses absolute-units ladder. Positive Δ = v12 generates more total value on identical picks.

### Tier-agreement confusion matrix

| v11 ↓ \\ v12 → | ELITE    | PREMIUM  | LOCK     | LEAN     | WEAK     | FADE     | Total |
|----------------|----------|----------|----------|----------|----------|----------|-------|
| ELITE          |        0 |        0 |        0 |        0 |        0 |        3 |     3 |
| PREMIUM        |        0 |        0 |        0 |        0 |        0 |        3 |     3 |
| LOCK           |        0 |        0 |        0 |        0 |        0 |        3 |     3 |
| LEAN           |        0 |        0 |        0 |        0 |        0 |        1 |     1 |
| WEAK           |        0 |        0 |        0 |        0 |        0 |        2 |     2 |
| FADE           |        0 |        0 |        0 |        0 |        0 |        2 |     2 |
| **Total**      |        0 |        0 |        0 |        0 |        0 |       14 |    14 |

> **14.3%** of picks land in the same tier under both models. **0.0%** were upgraded by v12 (v12 likes them more) · **85.7%** were downgraded by v12. Off-diagonal cells are where the two models materially disagree.

### Performance by direction of disagreement (flat-1u counterfactual)

| Bucket                     | N    | Win %  | Flat-1u ROI | Verdict |
|----------------------------|------|--------|-------------|---------|
| Agreement (same tier)      |    2 | 100.0% |      140.0% | (baseline) |
| v12 UPgraded (v12 > v11)   |    0 |      — |           — | _(no upgrades yet)_ |
| v12 DOWNgraded (v12 < v11) |   12 |  41.7% |      -22.6% | 🟢 v12 correctly downgrades losers |

> If **v12 upgrades** beat the baseline AND **v12 downgrades** underperform the baseline, v12 is materially improving the ranking. If both are noise around the baseline, the two models agree on what matters and the v12 win comes from sizing (top-heavy ladder).

## § 14 — V12 Wallet Quality Audit

The v12 model is a **single feature** — per-side mean of `Q = tierWeight × cappedROI × boundedSizeRatio × nReliab`. Visibility into this distribution is essential because there's no second feature to compensate when wallet quality misfires.

### v12 score distribution (n = 14)

| Range            | Count | %      | Bar                                   |
|------------------|-------|--------|---------------------------------------|
| [-1.00, -0.50)   |     3 |  21.4% | █████████                             |
| [-0.50, -0.25)   |     1 |   7.1% | ███                                   |
| [-0.25, -0.10)   |     0 |   0.0% |                                       |
| [-0.10,  0.00)   |     0 |   0.0% |                                       |
| [ 0.00,  0.10)   |    10 |  71.4% | █████████████████████████████         |
| [ 0.10,  0.25)   |     0 |   0.0% |                                       |
| [ 0.25,  0.50)   |     0 |   0.0% |                                       |
| [ 0.50,  0.75)   |     0 |   0.0% |                                       |
| [ 0.75,  0.90)   |     0 |   0.0% |                                       |
| [ 0.90,  0.95)   |     0 |   0.0% |                                       |
| [ 0.95,  1.00)   |     0 |   0.0% |                                       |

### Per-side wallet-quality averages

| Side    | Avg Q (mean)       | Avg # contributing wallets |
|---------|--------------------|----------------------------|
| FOR     |              0.734 |                        1.9 |
| AGAINST |              6.293 |                        1.0 |

> 🟡 **3 picks (21.4%)** had wallets on ONLY ONE side. With no opposition, the v12 score is purely a function of FOR-side quality and can run extreme — flag candidates for manual review.

### Win-rate by FOR-side quality tercile

| Bucket                 | N    | Win %  | Avg FOR mean Q | Avg AG mean Q  |
|------------------------|------|--------|----------------|----------------|
| Bottom 1/3 FOR-mean    |    4 |  50.0% |          0.000 |          7.567 |
| Middle 1/3 FOR-mean    |    4 |  50.0% |          0.000 |          1.912 |
| Top 1/3 FOR-mean       |    6 |  50.0% |          1.714 |          8.363 |

> If top-FOR-mean picks don't win at materially higher rates than bottom-FOR-mean picks, the wallet-quality feature isn't doing its job. The asymmetry vs AGAINST mean Q is the lever the (fMean − aMean) numerator exploits.

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified monitoring. Imports active model surface from `src/lib/ags.js` at runtime so it auto-tracks model bumps. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*