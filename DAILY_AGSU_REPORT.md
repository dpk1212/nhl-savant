# AGS-Unified v9 — Daily Monitoring Report

**Generated:** Saturday, May 23, 2026 at 10:10 AM ET
**AGS-U cutover:** 2026-05-14 · **Days live:** 9

> **Scope.** Every row in this report comes from picks AGS-U v9 actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are intentionally excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of two things:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **All-time ROI -16.7% / 7-day -19.1%** — both negative ≥ 5%. AGS-U may be miscalibrated. Drill into §3 (tier ladder) and §10 (mute validation).

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     20 | 8-12 |  40.0% |    -47.4% |     -17.17 |    +0.93% |     1.81u |       -1.17 | 3 (2-1) |
| Last 3 days |     42 | 20-22 |  47.6% |    -25.7% |     -19.60 |    +0.75% |     1.82u |       -0.83 | 6 (3-3) |
| Last 7 days |     73 | 36-37 |  49.3% |    -19.1% |     -27.19 |    +0.38% |     1.95u |       -0.64 | 13 (3-10) |
| All-time   |     81 | 41-40 |  50.6% |    -16.7% |     -25.84 |    +0.28% |     1.91u |       -0.73 | 15 (4-11) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U v9 is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   13 | 5-8    |  38.5% |    -34.3% |     -15.53 |     +5.45 |     3.48u |
| PREMIUM  | q80–q90     | 1.50×   |    9 | 4-5    |  44.4% |    -20.0% |      -4.75 |     +2.15 |     2.64u |
| LOCK     | q60–q80     | 1.10×   |   17 | 9-8    |  52.9% |    -21.3% |      -8.97 |     +1.25 |     2.48u |
| LEAN     | q40–q60     | 0.50×   |   25 | 13-12  |  52.0% |      9.3% |      +3.08 |     +0.33 |     1.32u |
| WEAK     | q20–q40     | 0.20×   |   15 | 9-6    |  60.0% |      1.7% |      +0.16 |     -1.32 |     0.64u |
| FADE     | < q20       | 0.00×   |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -2.94 |     0.53u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `1` 🚨 inverted — higher tiers winning LESS than lower
- ROI across tiers:   `1` 🚨 inverted — sizing ladder is destroying value

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|
| Q1       |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -2.94 |               51.4% |
| Q2       |   18 | 10-8   |  55.6% |     -5.5% |      -0.66 |     -1.12 |               49.2% |
| Q3       |   22 | 12-10  |  54.5% |     12.7% |      +3.90 |     +0.38 |               53.8% |
| Q4       |   17 | 9-8    |  52.9% |    -21.3% |      -8.97 |     +1.25 |               54.0% |
| Q5       |   22 | 9-13   |  40.9% |    -29.4% |     -20.28 |     +4.10 |               55.0% |

**Spearman ρ (quintile vs realized win%):** -0.400  ·  monotonicity `-2/4`

## § 3 — Univariate Feature Analysis

The five L1-pruned features that compose AGS-U. For each feature we report the average value across all picks, the point-biserial correlation with WIN (closer to ±1 = more predictive), and ROI sorted by feature decile so you can see whether the feature is earning its slot.

| Feature           | Family         | N    | Mean   | SD     | Corr(WIN) | Top-decile ROI | Bot-decile ROI | Lift   |
|-------------------|----------------|------|--------|--------|-----------|----------------|----------------|--------|
| Δcount            | COUNT          |   96 |   0.19 |   1.09 |    +0.113 |         -31.9% |         103.8% | -135.6pp |
| ΔHCcount          | COUNT_HC       |   96 |   0.28 |   1.13 |    -0.045 |         -59.7% |          -8.1% | -51.7pp |
| ΔavgConviction    | INTENSITY      |   96 |  -0.12 |   0.87 |    +0.129 |          -1.2% |         -62.9% | +61.7pp |
| ΔHCsizeRatio      | INTENSITY_HC   |   96 |   0.36 |   1.78 |    -0.032 |         -55.8% |          -3.6% | -52.1pp |
| forShare          | DOMINANCE      |   96 |   0.05 |   0.79 |    +0.200 |          37.7% |         -78.8% | +116.5pp |

> **Corr(WIN)** = point-biserial correlation between feature value and binary WIN outcome.
> **Top/Bot-decile ROI** = ROI for the top/bottom 10% of picks by this feature value alone.
> **Lift** = top-decile ROI − bottom-decile ROI in percentage points. Positive lift = feature is earning its keep in the composite.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier? If HC adds value across the board, it's a candidate for re-promotion; if not, the composite is already capturing it.

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 1n 0.0% -100% | 6n 50.0% -6% | 6n 33.3% -40% | 13n 38.5% -34% |
| PREMIUM  | 2n 0.0% -100% | 4n 75.0% +25% | 3n 33.3% -48% | 9n 44.4% -20% |
| LOCK     | 7n 57.1% -6% | 7n 71.4% +19% | 3n 0.0% -100% | 17n 52.9% -21% |
| LEAN     | 16n 50.0% +3% | 8n 62.5% +22% | 1n 0.0% -100% | 25n 52.0% +9% |
| WEAK     | 4n 75.0% +72% | 11n 54.5% -29% | —            | 15n 60.0% +2% |
| FADE     | 2n 50.0% +16% | —            | —            | 2n 50.0% +16% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 6n 16.7% -73%  | 6n 50.0% -18%  | 1n 100.0% +100% | 13n 38.5% -34% |
| PREMIUM  | 6n 50.0% +5%   | 1n 0.0% -100%  | 2n 50.0% -29%  | 9n 44.4% -20%  |
| LOCK     | 13n 53.8% -16% | 2n 50.0% -19%  | 2n 50.0% -42%  | 17n 52.9% -21% |
| LEAN     | 20n 55.0% +24% | 2n 50.0% -1%   | 3n 33.3% -71%  | 25n 52.0% +9%  |
| WEAK     | 10n 60.0% -35% | 5n 60.0% +73%  | —              | 15n 60.0% +2%  |
| FADE     | —              | 1n 0.0% -100%  | 1n 100.0% +63% | 2n 50.0% +16%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 3n 100.0% +38% | 2n 0.0% -100% | 6n 33.3% -35% | 2n 0.0% -100% | —             |
| PREMIUM  | 2n 0.0% -100% | 2n 0.0% -100% | 3n 100.0% +90% | 1n 100.0% +110% | 1n 0.0% -100% |
| LOCK     | —             | 7n 71.4% +2%  | 8n 50.0% -21% | 2n 0.0% -100% | —             |
| LEAN     | 1n 0.0% -100% | 9n 44.4% -13% | 10n 60.0% +39% | 4n 75.0% +67% | 1n 0.0% -100% |
| WEAK     | —             | —             | 8n 62.5% +39% | 6n 50.0% -45% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | 1n 0.0% -100% | —             | —             |

## § 5 — Calibration Reliability

Slice AGS-U into 6 bands and compare the AVERAGE IMPLIED PROBABILITY (from market odds at lock time) to the REALIZED win rate in each band. A well-calibrated system has realized ≈ implied + a constant edge. If realized > implied at the high end and ≤ implied at the low end, the ladder is genuinely sorting by edge (not just by favorite-status).

| AGS-U Band       | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| ≥ +3.5           |   10 |        40.0% |       55.0% |     -15.0pp |    -24.5% |
| +2.5 to 3.5      |    8 |        62.5% |       54.9% |      +7.6pp |      1.1% |
| +1.5 to 2.5      |    4 |        50.0% |       52.5% |      -2.5pp |    -34.7% |
| +0.5 to 1.5      |   17 |        41.2% |       52.5% |     -11.4pp |    -35.3% |
| −0.5 to 0.5      |   31 |        48.4% |       53.1% |      -4.8pp |     -7.9% |
| < −0.5           |   11 |        72.7% |       50.9% |     +21.8pp |     58.5% |

**Brier score (market-implied):** 0.2518 (lower = better; 0.25 = coin-flip prior).
**Edge correlation (realized vs implied):** Spearman ρ = -0.600 (positive = bands aligned with market expectation; high positive = AGS-U is largely re-stating the favorite signal).

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|---------|------------|--------|
| 2026-05-22 | NHL   | TOTAL  | Under 4.5               |  +100 |  2.50u |  +0.58 | ELITE   | Q5   |   +1 | WIN     |     +2.50u |  -2.6% |
| 2026-05-22 | NBA   | TOTAL  | Over 218.5              |  -103 |  0.75u |  +0.07 | LEAN    | Q3   |   +1 | WIN     |     +0.73u |  +2.4% |
| 2026-05-22 | MLB   | TOTAL  | Over 7.5                |  -110 |  0.75u |  -0.01 | LEAN    | Q2   |   +0 | LOSS    |     -0.75u |  -3.6% |
| 2026-05-22 | MLB   | TOTAL  | Over 8.5                |  -110 |  0.75u |  -0.01 | LEAN    | Q2   |   +0 | WIN     |     +0.68u |  +0.0% |
| 2026-05-22 | NBA   | SPREAD | Spurs                   |  -110 |  0.30u |  -0.30 | FADE    | Q1   |   +0 | LOSS    |     -0.30u |  +1.2% |
| 2026-05-22 | MLB   | SPREAD | Washington Nationals    |  -128 |  0.75u |  +0.13 | LEAN    | Q3   |   +0 | WIN     |     +0.59u |  +1.9% |
| 2026-05-22 | MLB   | SPREAD | Los Angeles Angels      |  -125 |  1.65u |  +0.23 | LOCK    | Q4   |   +1 | WIN     |     +1.32u |  +0.0% |
| 2026-05-22 | MLB   | SPREAD | Kansas City Royals      |  -171 |  0.75u |  -0.01 | LEAN    | Q2   |   +0 | LOSS    |     -0.75u |  +3.2% |
| 2026-05-22 | MLB   | SPREAD | Miami Marlins           |  -181 |  0.75u |  +0.17 | LEAN    | Q3   |   +0 | WIN     |     +0.41u |  +3.8% |
| 2026-05-22 | NHL   | ML     | Avalanche               |  -167 |  3.75u |  +0.54 | PREMIUM | Q5   |   +3 | LOSS    |     -3.75u |  +0.6% |
| 2026-05-22 | NBA   | ML     | Spurs                   |  -136 |  5.00u |  +1.30 | ELITE   | Q5   |   +0 | LOSS    |     -5.00u |  +1.1% |
| 2026-05-22 | MLB   | ML     | Washington Nationals    |  +180 |  1.50u |  +0.39 | PREMIUM | Q5   |   +0 | LOSS    |     -1.50u |  +2.2% |
| 2026-05-22 | MLB   | ML     | Los Angeles Angels      |  +136 |  0.50u |  -0.08 | WEAK    | Q2   |   +1 | WIN     |     +0.68u |  +1.0% |
| 2026-05-22 | MLB   | ML     | New York Yankees        |  -149 |  3.75u |  +0.31 | LOCK    | Q4   |   +2 | LOSS    |     -3.75u |  -1.2% |
| 2026-05-22 | MLB   | ML     | Kansas City Royals      |  +100 |  0.00u |  -0.41 | FADE    | Q1   |   -1 | TRACKED |      0.00u |  +3.7% |
| 2026-05-22 | MLB   | ML     | Toronto Blue Jays       |  -160 |  2.75u |  +0.18 | LOCK    | Q4   |   +0 | WIN     |     +1.72u |  -0.3% |
| 2026-05-22 | MLB   | ML     | Miami Marlins           |  -112 |  0.00u |  -0.51 | FADE    | Q1   |   -1 | TRACKED |      0.00u |  +3.8% |
| 2026-05-22 | MLB   | ML     | Boston Red Sox          |  -154 |  5.00u |  +0.87 | ELITE   | Q5   |   +2 | LOSS    |     -5.00u |  +0.3% |
| 2026-05-22 | MLB   | ML     | Milwaukee Brewers       |  -110 |  0.00u |  -0.46 | FADE    | Q1   |   +0 | TRACKED |      0.00u |  +1.2% |
| 2026-05-22 | MLB   | ML     | Chicago Cubs            |  -137 |  1.25u |  +0.12 | LEAN    | Q3   |   +0 | LOSS    |     -1.25u |  +0.7% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   13 |       45.25 |     -15.53 |    -34.3% |      -1.19 |          -0.343 |
| PREMIUM  |    9 |       23.75 |      -4.75 |    -20.0% |      -0.53 |          -0.200 |
| LOCK     |   17 |       42.15 |      -8.97 |    -21.3% |      -0.53 |          -0.213 |
| LEAN     |   25 |       33.00 |      +3.08 |      9.3% |      +0.12 |          +0.093 |
| WEAK     |   15 |        9.65 |      +0.16 |      1.7% |      +0.01 |          +0.017 |
| FADE     |    2 |        1.05 |      +0.17 |     16.2% |      +0.08 |          +0.162 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). We can validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working; if they win frequently, q20 is too aggressive.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **25** · Win rate: **56.0%** · Flat-1u PnL: **-1.08u** · ROI: **-4.3%**
- Verdict: 🚨 Mute floor may be too aggressive — SHADOWed picks win at ≥52%.

## § 9 — Daily Trend (cumulative PnL)

| Date       | Live | W-L   | Win %  | Daily PnL  | Cum PnL    | Cum Win % | Trk | Bar                  |
|------------|------|-------|--------|------------|------------|-----------|-----|----------------------|
| 2026-05-14 |    1 | 1-0   | 100.0% |      +1.71 |      +1.71 |    100.0% |   0 | █                    |
| 2026-05-15 |    7 | 4-3   |  57.1% |      -0.36 |      +1.35 |     62.5% |   2 | █                    |
| 2026-05-16 |    6 | 4-2   |  66.7% |      +1.41 |      +2.76 |     64.3% |   3 | ██                   |
| 2026-05-17 |    9 | 5-4   |  55.6% |      -0.09 |      +2.67 |     60.9% |   2 | ██                   |
| 2026-05-18 |    8 | 4-4   |  50.0% |      -2.71 |      -0.04 |     58.1% |   2 |                      |
| 2026-05-19 |    8 | 3-5   |  37.5% |      -6.20 |      -6.24 |     53.8% |   0 |                ▓▓▓▓▓ |
| 2026-05-20 |   10 | 6-4   |  60.0% |      +2.63 |      -3.61 |     55.1% |   1 |                  ▓▓▓ |
| 2026-05-21 |   12 | 6-6   |  50.0% |      -5.06 |      -8.67 |     54.1% |   2 |              ▓▓▓▓▓▓▓ |
| 2026-05-22 |   20 | 8-12  |  40.0% |     -17.17 |     -25.84 |     50.6% |   3 | ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.

> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    18 | 🟡 informational only — true tracked plays |
| Live picks (not graded yet) with `finalUnits > 0`             |     8 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    19 | 🟡 informational — AGS-U calibration controls sample adequacy |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-22T15:49:57.130Z
- **Source / version:** cron
- **Sample size:** 475
- **Date range:** 2026-04-18 → 2026-05-21

**AGS-U quintile boundaries (summed-z space):**

| Boundary | Value      |
|----------|------------|
| q20      |      -0.27 |
| q40      |      -0.01 |
| q50      |      +0.09 |
| q60      |      +0.17 |
| q80      |      +0.38 |
| q90      |      +0.58 |

**Feature normalizers (mean / sd):**

| Feature           | Mean   | SD     |
|-------------------|--------|--------|
| Δcount            |   1.40 |   1.53 |
| ΔHCcount          |   0.44 |   0.82 |
| ΔavgConviction    |   0.54 |   0.54 |
| ΔHCsizeRatio      |   1.64 |   5.91 |
| forShare          |   0.81 |   0.25 |

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified v9 monitoring. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*