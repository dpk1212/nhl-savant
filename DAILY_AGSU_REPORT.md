# AGS-Unified v9 — Daily Monitoring Report

**Generated:** Sunday, May 24, 2026 at 10:09 AM ET
**AGS-U cutover:** 2026-05-14 · **Days live:** 10

> **Scope.** Every row in this report comes from picks AGS-U v9 actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are intentionally excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of two things:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **All-time ROI -9.4% / 7-day -12.3%** — both negative ≥ 5%. AGS-U may be miscalibrated. Drill into §3 (tier ladder) and §10 (mute validation).

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     23 | 15-8 |  65.2% |     20.7% |      +7.70 |    +0.06% |     1.62u |        1.35 | 4 (1-3) |
| Last 3 days |     55 | 29-26 |  52.7% |    -15.7% |     -14.53 |    +0.46% |     1.68u |        0.08 | 9 (3-6) |
| Last 7 days |     90 | 47-43 |  52.2% |    -12.3% |     -20.90 |    +0.24% |     1.89u |       -0.06 | 14 (4-10) |
| All-time   |    104 | 56-48 |  53.8% |     -9.4% |     -18.14 |    +0.23% |     1.85u |       -0.03 | 19 (5-14) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U v9 is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   17 | 7-10   |  41.2% |    -27.6% |     -16.36 |     +4.33 |     3.49u |
| PREMIUM  | q80–q90     | 1.50×   |   10 | 5-5    |  50.0% |    -12.0% |      -3.11 |     +1.97 |     2.60u |
| LOCK     | q60–q80     | 1.10×   |   22 | 12-10  |  54.5% |    -11.3% |      -6.10 |     +1.03 |     2.46u |
| LEAN     | q40–q60     | 0.50×   |   34 | 20-14  |  58.8% |     18.1% |      +7.30 |     +0.27 |     1.19u |
| WEAK     | q20–q40     | 0.20×   |   19 | 11-8   |  57.9% |     -0.4% |      -0.04 |     -1.09 |     0.59u |
| FADE     | < q20       | 0.00×   |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -2.51 |     0.53u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `1` 🚨 inverted — higher tiers winning LESS than lower
- ROI across tiers:   `3` 🚨 inverted — sizing ladder is destroying value

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|
| Q1       |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -2.51 |               51.8% |
| Q2       |   26 | 15-11  |  57.7% |      4.6% |      +0.79 |     -0.82 |               50.7% |
| Q3       |   27 | 16-11  |  59.3% |     18.7% |      +6.47 |     +0.33 |               53.6% |
| Q4       |   22 | 12-10  |  54.5% |    -11.3% |      -6.10 |     +1.03 |               53.8% |
| Q5       |   27 | 12-15  |  44.4% |    -22.8% |     -19.47 |     +3.46 |               55.1% |

**Spearman ρ (quintile vs realized win%):** -0.300  ·  monotonicity `0/4`

## § 3 — Univariate Feature Analysis

The five L1-pruned features that compose AGS-U. For each feature we report the average value across all picks, the point-biserial correlation with WIN (closer to ±1 = more predictive), and ROI sorted by feature decile so you can see whether the feature is earning its slot.

| Feature           | Family         | N    | Mean   | SD     | Corr(WIN) | Top-decile ROI | Bot-decile ROI | Lift   |
|-------------------|----------------|------|--------|--------|-----------|----------------|----------------|--------|
| Δcount            | COUNT          |  122 |   0.14 |   1.15 |    +0.133 |         -17.3% |          25.4% | -42.7pp |
| ΔHCcount          | COUNT_HC       |  122 |   0.21 |   1.05 |    -0.021 |         -66.7% |         -23.4% | -43.3pp |
| ΔavgConviction    | INTENSITY      |  122 |  -0.05 |   0.83 |    +0.126 |           6.7% |         -12.9% | +19.6pp |
| ΔHCsizeRatio      | INTENSITY_HC   |  122 |   0.29 |   1.60 |    -0.039 |         -46.5% |         -11.9% | -34.6pp |
| forShare          | DOMINANCE      |  122 |   0.09 |   0.78 |    +0.217 |          31.2% |         -80.5% | +111.7pp |

> **Corr(WIN)** = point-biserial correlation between feature value and binary WIN outcome.
> **Top/Bot-decile ROI** = ROI for the top/bottom 10% of picks by this feature value alone.
> **Lift** = top-decile ROI − bottom-decile ROI in percentage points. Positive lift = feature is earning its keep in the composite.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier? If HC adds value across the board, it's a candidate for re-promotion; if not, the composite is already capturing it.

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 3n 33.3% -43% | 8n 50.0% -6% | 6n 33.3% -40% | 17n 41.2% -28% |
| PREMIUM  | 3n 33.3% -22% | 4n 75.0% +25% | 3n 33.3% -48% | 10n 50.0% -12% |
| LOCK     | 12n 58.3% +7% | 7n 71.4% +19% | 3n 0.0% -100% | 22n 54.5% -11% |
| LEAN     | 22n 59.1% +15% | 11n 63.6% +27% | 1n 0.0% -100% | 34n 58.8% +18% |
| WEAK     | 6n 66.7% +56% | 13n 53.8% -29% | —            | 19n 57.9% -0% |
| FADE     | 2n 50.0% +16% | —            | —            | 2n 50.0% +16% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 7n 28.6% -51%  | 8n 37.5% -34%  | 2n 100.0% +66% | 17n 41.2% -28% |
| PREMIUM  | 7n 57.1% +15%  | 1n 0.0% -100%  | 2n 50.0% -29%  | 10n 50.0% -12% |
| LOCK     | 18n 55.6% -5%  | 2n 50.0% -19%  | 2n 50.0% -42%  | 22n 54.5% -11% |
| LEAN     | 28n 60.7% +31% | 2n 50.0% -1%   | 4n 50.0% -61%  | 34n 58.8% +18% |
| WEAK     | 14n 57.1% -30% | 5n 60.0% +73%  | —              | 19n 57.9% -0%  |
| FADE     | —              | 1n 0.0% -100%  | 1n 100.0% +63% | 2n 50.0% +16%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 4n 100.0% +41% | 2n 0.0% -100% | 9n 33.3% -35% | 2n 0.0% -100% | —             |
| PREMIUM  | 2n 0.0% -100% | 3n 33.3% -60% | 3n 100.0% +90% | 1n 100.0% +110% | 1n 0.0% -100% |
| LOCK     | —             | 8n 62.5% -12% | 9n 44.4% -31% | 4n 50.0% +9%  | 1n 100.0% +168% |
| LEAN     | 1n 0.0% -100% | 12n 50.0% -9% | 15n 66.7% +43% | 5n 80.0% +82% | 1n 0.0% -100% |
| WEAK     | —             | 1n 100.0% +56% | 11n 54.5% +22% | 6n 50.0% -45% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | 1n 0.0% -100% | —             | —             |

## § 5 — Calibration Reliability

Slice AGS-U into 6 bands and compare the AVERAGE IMPLIED PROBABILITY (from market odds at lock time) to the REALIZED win rate in each band. A well-calibrated system has realized ≈ implied + a constant edge. If realized > implied at the high end and ≤ implied at the low end, the ladder is genuinely sorting by edge (not just by favorite-status).

| AGS-U Band       | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| ≥ +3.5           |   10 |        40.0% |       55.0% |     -15.0pp |    -24.5% |
| +2.5 to 3.5      |    8 |        62.5% |       54.9% |      +7.6pp |      1.1% |
| +1.5 to 2.5      |    4 |        50.0% |       52.5% |      -2.5pp |    -34.7% |
| +0.5 to 1.5      |   21 |        42.9% |       53.0% |     -10.2pp |    -27.6% |
| −0.5 to 0.5      |   50 |        56.0% |       53.4% |      +2.6pp |      7.6% |
| < −0.5           |   11 |        72.7% |       51.1% |     +21.7pp |     58.5% |

**Brier score (market-implied):** 0.2507 (lower = better; 0.25 = coin-flip prior).
**Edge correlation (realized vs implied):** Spearman ρ = -0.486 (positive = bands aligned with market expectation; high positive = AGS-U is largely re-stating the favorite signal).

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|---------|------------|--------|
| 2026-05-23 | NHL   | TOTAL  | Under 4.5               |  -102 |  0.30u |  +0.04 | LEAN    | Q3   |   +1 | WIN     |     +0.29u |  -1.9% |
| 2026-05-23 | NBA   | TOTAL  | Under 215               |  -102 |  3.00u |  +1.01 | ELITE   | Q5   |   -1 | LOSS    |     -3.00u |  +1.7% |
| 2026-05-23 | MLB   | TOTAL  | Over 8.5                |  -111 |  0.30u |  -0.01 | WEAK    | Q2   |   +0 | LOSS    |     -0.30u |  +0.0% |
| 2026-05-23 | MLB   | TOTAL  | Under 7.5               |  -110 |  0.75u |  +0.03 | LEAN    | Q2   |   +0 | WIN     |     +0.68u |  -0.2% |
| 2026-05-23 | MLB   | TOTAL  | Under 7.5               |  +102 |  0.75u |  +0.10 | LEAN    | Q3   |   +0 | WIN     |     +0.77u |  +0.0% |
| 2026-05-23 | MLB   | TOTAL  | Under 9.5               |  -110 |  0.75u |  +0.03 | LEAN    | Q2   |   +1 | LOSS    |     -0.75u |  -2.9% |
| 2026-05-23 | MLB   | TOTAL  | Under 7.5               |  -110 |  3.00u |  +0.59 | ELITE   | Q5   |   +1 | WIN     |     +2.73u |  -1.4% |
| 2026-05-23 | MLB   | TOTAL  | Under 8.5               |  -110 |  0.00u |      — | UNKNOWN | Q?   |   +0 | TRACKED |      0.00u |  +0.0% |
| 2026-05-23 | MLB   | TOTAL  | Over 8.5                |  +106 |  0.30u |  -0.18 | WEAK    | Q2   |   +1 | WIN     |     +0.32u |  -3.6% |
| 2026-05-23 | NBA   | SPREAD | Cavaliers               |  -108 |  3.00u |  +0.59 | ELITE   | Q5   |   +1 | LOSS    |     -3.00u |  -0.7% |
| 2026-05-23 | MLB   | SPREAD | Washington Nationals    |  -137 |  2.25u |  +0.41 | PREMIUM | Q5   |   +0 | WIN     |     +1.64u |  +3.3% |
| 2026-05-23 | MLB   | SPREAD | Toronto Blue Jays       |  -135 |  0.75u |  +0.03 | LEAN    | Q2   |   +0 | WIN     |     +0.56u |  +0.4% |
| 2026-05-23 | MLB   | SPREAD | Minnesota Twins         |  +168 |  1.50u |  +0.26 | LOCK    | Q4   |   +0 | WIN     |     +2.52u |  -2.1% |
| 2026-05-23 | MLB   | SPREAD | Milwaukee Brewers       |  -163 |  0.75u |  +0.09 | LEAN    | Q3   |   +0 | LOSS    |     -0.75u |  +0.6% |
| 2026-05-23 | MLB   | SPREAD | Houston Astros          |  -163 |  0.75u |  +0.13 | LEAN    | Q3   |   +0 | WIN     |     +0.46u |  +1.1% |
| 2026-05-23 | NHL   | ML     | Hurricanes              |  -205 |  5.00u |  +0.60 | ELITE   | Q5   |   +0 | WIN     |     +2.44u |  -2.2% |
| 2026-05-23 | NBA   | ML     | Cavaliers               |  -144 |  0.00u |  -0.98 | FADE    | Q1   |   -2 | TRACKED |      0.00u |  +0.9% |
| 2026-05-23 | MLB   | ML     | Washington Nationals    |  +144 |  1.25u |  +0.12 | LEAN    | Q3   |   +1 | WIN     |     +1.80u |  +3.6% |
| 2026-05-23 | MLB   | ML     | Los Angeles Angels      |  +120 |  2.50u |  +0.27 | LOCK    | Q4   |   +0 | WIN     |     +3.00u |  -0.6% |
| 2026-05-23 | MLB   | ML     | St. Louis Cardinals     |  -108 |  1.25u |  +0.03 | LEAN    | Q2   |   +0 | WIN     |     +1.16u |  -1.2% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   17 |       59.25 |     -16.36 |    -27.6% |      -0.96 |          -0.276 |
| PREMIUM  |   10 |       26.00 |      -3.11 |    -12.0% |      -0.31 |          -0.120 |
| LOCK     |   22 |       54.15 |      -6.10 |    -11.3% |      -0.28 |          -0.113 |
| LEAN     |   34 |       40.30 |      +7.30 |     18.1% |      +0.21 |          +0.181 |
| WEAK     |   19 |       11.25 |      -0.04 |     -0.4% |      -0.00 |          -0.004 |
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
| 2026-05-23 |   23 | 15-8  |  65.2% |      +7.70 |     -18.14 |     53.8% |   4 |       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.

> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    23 | 🟡 informational only — true tracked plays |
| Live picks (not graded yet) with `finalUnits > 0`             |    10 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    28 | 🟡 informational — AGS-U calibration controls sample adequacy |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-23T14:15:37.132Z
- **Source / version:** cron
- **Sample size:** 494
- **Date range:** 2026-04-18 → 2026-05-22

**AGS-U quintile boundaries (summed-z space):**

| Boundary | Value      |
|----------|------------|
| q20      |      -0.23 |
| q40      |      +0.03 |
| q50      |      +0.10 |
| q60      |      +0.17 |
| q80      |      +0.38 |
| q90      |      +0.53 |

**Feature normalizers (mean / sd):**

| Feature           | Mean   | SD     |
|-------------------|--------|--------|
| Δcount            |   1.22 |   1.44 |
| ΔHCcount          |   0.34 |   0.76 |
| ΔavgConviction    |   0.52 |   0.60 |
| ΔHCsizeRatio      |   1.21 |   5.13 |
| forShare          |   0.80 |   0.28 |

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified v9 monitoring. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*