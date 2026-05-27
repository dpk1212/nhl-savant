# AGS-Unified v9 — Daily Monitoring Report

**Generated:** Wednesday, May 27, 2026 at 5:50 AM ET
**AGS-U cutover:** 2026-05-14 · **Days live:** 13

> **Scope.** Every row in this report comes from picks AGS-U v9 actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are intentionally excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of two things:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0 — Executive Summary & Alerts

### Alerts
- 🟢 **No automated alerts firing.** Headline numbers are in the expected envelope.

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     18 | 12-6 |  66.7% |     33.4% |     +13.88 |    -0.49% |     2.31u |        1.03 | 4 (1-3) |
| Last 3 days |     56 | 30-26 |  53.6% |      3.3% |      +3.98 |    +0.25% |     2.17u |       -0.16 | 14 (10-4) |
| Last 7 days |    121 | 65-56 |  53.7% |     -3.4% |      -7.92 |    +0.38% |     1.94u |        0.02 | 24 (14-10) |
| All-time   |    160 | 86-74 |  53.8% |     -4.5% |     -14.16 |    +0.24% |     1.96u |       -0.12 | 33 (15-18) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U v9 is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

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

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|
| Q1       |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -1.72 |               49.4% |
| Q2       |   35 | 20-15  |  57.1% |      0.9% |      +0.23 |     -0.62 |               51.1% |
| Q3       |   41 | 24-17  |  58.5% |     15.0% |      +7.67 |     +0.24 |               53.0% |
| Q4       |   35 | 16-19  |  45.7% |    -17.4% |     -13.72 |     +0.72 |               53.0% |
| Q5       |   47 | 25-22  |  53.2% |     -5.4% |      -8.51 |     +2.22 |               56.1% |

**Spearman ρ (quintile vs realized win%):** -0.100  ·  monotonicity `2/4`

## § 3 — Univariate Feature Analysis

The five L1-pruned features that compose AGS-U. For each feature we report the average value across all picks, the point-biserial correlation with WIN (closer to ±1 = more predictive), and ROI sorted by feature decile so you can see whether the feature is earning its slot.

| Feature           | Family         | N    | Mean   | SD     | Corr(WIN) | Top-decile ROI | Bot-decile ROI | Lift   |
|-------------------|----------------|------|--------|--------|-----------|----------------|----------------|--------|
| Δcount            | COUNT          |  192 |   0.13 |   1.18 |    +0.015 |         -22.4% |         -12.6% | -9.8pp |
| ΔHCcount          | COUNT_HC       |  181 |   0.11 |   0.96 |    -0.080 |         -65.0% |           4.6% | -69.7pp |
| ΔavgConviction    | INTENSITY      |  181 |  -0.05 |   0.77 |    +0.074 |           7.0% |         -32.5% | +39.4pp |
| ΔHCsizeRatio      | INTENSITY_HC   |  192 |   0.22 |   1.36 |    -0.070 |         -51.5% |         -16.7% | -34.8pp |
| forShare          | DOMINANCE      |  181 |   0.05 |   0.72 |    +0.135 |           9.4% |         -86.1% | +95.5pp |

> **Corr(WIN)** = point-biserial correlation between feature value and binary WIN outcome.
> **Top/Bot-decile ROI** = ROI for the top/bottom 10% of picks by this feature value alone.
> **Lift** = top-decile ROI − bottom-decile ROI in percentage points. Positive lift = feature is earning its keep in the composite.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier? If HC adds value across the board, it's a candidate for re-promotion; if not, the composite is already capturing it.

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

## § 5 — Calibration Reliability

Slice AGS-U into 6 bands and compare the AVERAGE IMPLIED PROBABILITY (from market odds at lock time) to the REALIZED win rate in each band. A well-calibrated system has realized ≈ implied + a constant edge. If realized > implied at the high end and ≤ implied at the low end, the ladder is genuinely sorting by edge (not just by favorite-status).

| AGS-U Band       | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| ≥ +3.5           |   10 |        40.0% |       55.0% |     -15.0pp |    -24.5% |
| +2.5 to 3.5      |    8 |        62.5% |       54.9% |      +7.6pp |      1.1% |
| +1.5 to 2.5      |    5 |        40.0% |       51.1% |     -11.1pp |    -46.2% |
| +0.5 to 1.5      |   29 |        51.7% |       54.5% |      -2.7pp |     -3.5% |
| −0.5 to 0.5      |   97 |        53.6% |       53.1% |      +0.5pp |     -0.1% |
| < −0.5           |   11 |        72.7% |       49.6% |     +23.1pp |     58.5% |

**Brier score (market-implied):** 0.2459 (lower = better; 0.25 = coin-flip prior).
**Edge correlation (realized vs implied):** Spearman ρ = -0.486 (positive = bands aligned with market expectation; high positive = AGS-U is largely re-stating the favorite signal).

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|---------|------------|--------|
| 2026-05-26 | NBA   | TOTAL  | Over 216                |  -115 |  3.00u |  +0.82 | ELITE   | Q5   |   +0 | WIN     |     +2.61u |  -1.7% |
| 2026-05-26 | MLB   | TOTAL  | Over 8                  |  -104 |  0.75u |  +0.09 | LEAN    | Q3   |   +0 | LOSS    |     -0.75u |  +0.0% |
| 2026-05-26 | MLB   | TOTAL  | Over 8                  |  -110 |  1.65u |  +0.18 | LOCK    | Q4   |   +0 | WIN     |     +1.50u |  +0.0% |
| 2026-05-26 | NHL   | SPREAD | Golden Knights          |  -250 |  2.25u |  +0.41 | PREMIUM | Q5   |   +0 | WIN     |     +0.90u |  -0.5% |
| 2026-05-26 | NBA   | SPREAD | Thunder                 |  -102 |  0.00u |  +0.32 | PREMIUM | Q5   |   +2 | TRACKED |      0.00u |  +0.2% |
| 2026-05-26 | MLB   | SPREAD | Kansas City Royals      |  +105 |  1.65u |  +0.15 | LOCK    | Q4   |   +0 | LOSS    |     -1.65u |  +0.0% |
| 2026-05-26 | MLB   | SPREAD | Colorado Rockies        |  -101 |  0.00u |  +0.28 | LOCK    | Q4   |   +1 | TRACKED |      0.00u |      — |
| 2026-05-26 | NHL   | ML     | Avalanche               |  -114 |  0.50u |  -0.08 | WEAK    | Q2   |   +0 | LOSS    |     -0.50u |  -0.2% |
| 2026-05-26 | NBA   | ML     | Thunder                 |  -194 |  3.75u |  +0.47 | PREMIUM | Q5   |   +4 | WIN     |     +1.93u |  -4.4% |
| 2026-05-26 | MLB   | ML     | Washington Nationals    |  +116 |  2.50u |  +0.46 | PREMIUM | Q5   |   +0 | WIN     |     +2.90u |  +0.8% |
| 2026-05-26 | MLB   | ML     | Baltimore Orioles       |  -105 |  3.75u |  +0.24 | LOCK    | Q4   |   +1 | WIN     |     +3.57u |  +0.5% |
| 2026-05-26 | MLB   | ML     | St. Louis Cardinals     |  +180 |  0.00u |  -0.24 | FADE    | Q1   |   +1 | TRACKED |      0.00u |  -3.5% |
| 2026-05-26 | MLB   | ML     | Athletics               |  -112 |  3.75u |  +0.50 | PREMIUM | Q5   |   +1 | LOSS    |     -3.75u |  +1.2% |
| 2026-05-26 | MLB   | ML     | Philadelphia Phillies   |  -102 |  5.00u |  +0.56 | ELITE   | Q5   |   +1 | WIN     |     +4.90u |  +0.2% |
| 2026-05-26 | MLB   | ML     | New York Yankees        |  -200 |  3.75u |  +0.46 | PREMIUM | Q5   |   +0 | WIN     |     +1.88u |  -0.8% |
| 2026-05-26 | MLB   | ML     | Toronto Blue Jays       |  -122 |  1.25u |  +0.03 | LEAN    | Q3   |   +0 | WIN     |     +1.02u |  -1.0% |
| 2026-05-26 | MLB   | ML     | Los Angeles Angels      |  +116 |  1.25u |  +0.03 | LEAN    | Q3   |   +0 | WIN     |     +1.45u |  -0.8% |
| 2026-05-26 | MLB   | ML     | Colorado Rockies        |  +194 |  1.50u |  +0.14 | LOCK    | Q4   |   +0 | LOSS    |     -1.50u |  -1.8% |
| 2026-05-26 | MLB   | ML     | New York Mets           |  +105 |  2.75u |  -0.03 | WEAK    | Q2   |   +1 | LOSS    |     -2.75u |  +1.0% |
| 2026-05-26 | MLB   | ML     | Pittsburgh Pirates      |  -134 |  1.25u |  +0.09 | LEAN    | Q3   |   +0 | WIN     |     +0.93u |  -0.4% |

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
| Live picks (not graded yet) with `finalUnits > 0`             |     0 | 🟡 no live shipped picks pending |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    38 | 🟡 informational — AGS-U calibration controls sample adequacy |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-26T16:34:47.866Z
- **Source / version:** cron
- **Sample size:** 592
- **Date range:** 2026-04-18 → 2026-05-25

**AGS-U quintile boundaries (summed-z space):**

| Boundary | Value      |
|----------|------------|
| q20      |      -0.15 |
| q40      |      -0.02 |
| q50      |      +0.07 |
| q60      |      +0.13 |
| q80      |      +0.31 |
| q90      |      +0.50 |

**Feature normalizers (mean / sd):**

| Feature           | Mean   | SD     |
|-------------------|--------|--------|
| Δcount            |   1.15 |   1.48 |
| ΔHCcount          |      — |      — |
| ΔavgConviction    |      — |      — |
| ΔHCsizeRatio      |   1.36 |   5.54 |
| forShare          |      — |      — |

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified v9 monitoring. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*