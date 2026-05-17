# AGS-Unified v9 — Daily Monitoring Report

**Generated:** Sunday, May 17, 2026 at 8:21 AM ET
**AGS-U Cutover:** 2026-05-14  ·  **Days Live:** 3  ·  **Report Window:** cutover → 2026-05-17

> Single source of truth for AGS-Unified v9 — replaces v6/v7/v8 dailies. Reads the FINAL state every graded side shipped at; never re-bets the past against today's calibration.

## § 0 — Executive Summary & Alerts

### Alerts
- 🟢 **No automated alerts firing.** Headline numbers are in the expected envelope.

### Headline Numbers

| Window     | N    | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like |
|------------|------|-------|--------|-----------|------------|-----------|-----------|-------------|
| Yesterday  |    9 | 4-5 |  44.4% |     -0.9% |      -0.09 |    +1.05% |     1.12u |        0.70 |
| Last 3 days |   19 | 10-9 |  52.6% |      5.7% |      +1.26 |    +0.19% |     1.17u |        0.05 |
| Last 7 days |   19 | 10-9 |  52.6% |      5.7% |      +1.26 |    +0.19% |     1.17u |        0.05 |
| All-time   |   19 | 10-9 |  52.6% |      5.7% |      +1.26 |    +0.19% |     1.17u |        0.05 |

> **ROI** = profit / total stake. **Sharpe-like** = per-pick mean unit return ÷ sd × √N — higher = more consistent edge.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U v9 is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |    1 | 1-0    | 100.0% |     33.3% |      +1.25 |     +4.44 |     3.75u |
| PREMIUM  | q80–q90     | 1.50×   |    1 | 1-0    | 100.0% |    110.0% |      +2.75 |     +2.80 |     2.50u |
| LOCK     | q60–q80     | 1.10×   |    5 | 2-3    |  40.0% |    -36.2% |      -4.00 |     +1.54 |     2.21u |
| LEAN     | q40–q60     | 0.50×   |    1 | 1-0    | 100.0% |    110.4% |      +1.38 |     +0.50 |     1.25u |
| WEAK     | q20–q40     | 0.20×   |    7 | 4-3    |  57.1% |     36.8% |      +1.38 |     -1.27 |     0.54u |
| FADE     | < q20       | 0.00×   |    4 | 1-3    |  25.0% |         — |      -1.50 |     -3.69 |         — |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `-2` 🟡 partial — ladder mostly works but has noise
- ROI across tiers:   `-1` 🟡 partial

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|
| Q1       |    4 | 1-3    |  25.0% |         — |      -1.50 |     -3.69 |               56.5% |
| Q2       |    7 | 4-3    |  57.1% |     36.8% |      +1.38 |     -1.27 |               49.4% |
| Q3       |    1 | 1-0    | 100.0% |    110.4% |      +1.38 |     +0.50 |               44.6% |
| Q4       |    5 | 2-3    |  40.0% |    -36.2% |      -4.00 |     +1.54 |               51.8% |
| Q5       |    2 | 2-0    | 100.0% |     64.0% |      +4.00 |     +3.62 |               57.2% |

**Spearman ρ (quintile vs realized win%):** 0.700  ·  monotonicity `2/4`

## § 3 — Univariate Feature Analysis

The five L1-pruned features that compose AGS-U. For each feature we report the average value across all picks, the point-biserial correlation with WIN (closer to ±1 = more predictive), and ROI sorted by feature decile so you can see whether the feature is earning its slot.

| Feature           | Family         | N    | Mean   | SD     | Corr(WIN) | Top-decile ROI | Bot-decile ROI | Lift   |
|-------------------|----------------|------|--------|--------|-----------|----------------|----------------|--------|
| Δcount            | COUNT          |   19 |   0.06 |   1.14 |    +0.364 |         150.0% |              — |      — |
| ΔHCcount          | COUNT_HC       |   19 |  -0.01 |   0.60 |    +0.055 |              — |              — |      — |
| ΔavgConviction    | INTENSITY      |   19 |  -0.23 |   0.90 |    +0.027 |          33.3% |         150.0% | -116.7pp |
| ΔHCsizeRatio      | INTENSITY_HC   |   19 |  -0.21 |   0.59 |    -0.155 |          33.3% |         150.0% | -116.7pp |
| forShare          | DOMINANCE      |   19 |  -0.03 |   0.98 |    +0.268 |          33.3% |              — |      — |

> **Corr(WIN)** = point-biserial correlation between feature value and binary WIN outcome.
> **Top/Bot-decile ROI** = ROI for the top/bottom 10% of picks by this feature value alone.
> **Lift** = top-decile ROI − bottom-decile ROI in percentage points. Positive lift = feature is earning its keep in the composite.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier? If HC adds value across the board, it's a candidate for re-promotion; if not, the composite is already capturing it.

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | —            | 1n 100.0% +33% | —            | 1n 100.0% +33% |
| PREMIUM  | —            | —            | 1n 100.0% +110% | 1n 100.0% +110% |
| LOCK     | 3n 33.3% -55% | 2n 50.0% -15% | —            | 5n 40.0% -36% |
| LEAN     | —            | 1n 100.0% +110% | —            | 1n 100.0% +110% |
| WEAK     | 3n 66.7% +110% | 4n 50.0% -61% | —            | 7n 57.1% +37% |
| FADE     | 3n 33.3% —   | 1n 0.0% —    | —            | 4n 25.0% —   |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 1n 100.0% +33% | —              | —              | 1n 100.0% +33% |
| PREMIUM  | 1n 100.0% +110% | —              | —              | 1n 100.0% +110% |
| LOCK     | 4n 25.0% -69%  | —              | 1n 100.0% +62% | 5n 40.0% -36%  |
| LEAN     | 1n 100.0% +110% | —              | —              | 1n 100.0% +110% |
| WEAK     | 3n 66.7% -38%  | 4n 50.0% +76%  | —              | 7n 57.1% +37%  |
| FADE     | 2n 0.0% —      | 1n 100.0% —    | 1n 0.0% —      | 4n 25.0% —     |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 1n 100.0% +33% | —             | —             | —             | —             |
| PREMIUM  | —             | —             | —             | 1n 100.0% +110% | —             |
| LOCK     | —             | 1n 100.0% +57% | 2n 50.0% +1%  | 2n 0.0% -100% | —             |
| LEAN     | —             | —             | —             | 1n 100.0% +110% | —             |
| WEAK     | —             | —             | 5n 60.0% +68% | 2n 50.0% -50% | —             |
| FADE     | —             | 2n 0.0% —     | 2n 50.0% —    | —             | —             |

## § 5 — Calibration Reliability

Slice AGS-U into 6 bands and compare the AVERAGE IMPLIED PROBABILITY (from market odds at lock time) to the REALIZED win rate in each band. A well-calibrated system has realized ≈ implied + a constant edge. If realized > implied at the high end and ≤ implied at the low end, the ladder is genuinely sorting by edge (not just by favorite-status).

| AGS-U Band       | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| ≥ +3.5           |    1 |       100.0% |       67.8% |     +32.2pp |     33.3% |
| +2.5 to 3.5      |    2 |        50.0% |       46.1% |      +3.9pp |      5.0% |
| +1.5 to 2.5      |    1 |       100.0% |       53.3% |     +46.7pp |     62.2% |
| +0.5 to 1.5      |    3 |        33.3% |       53.3% |     -20.0pp |    -55.3% |
| −0.5 to 0.5      |    3 |        66.7% |       44.0% |     +22.7pp |     39.1% |
| < −0.5           |    9 |        44.4% |       53.9% |      -9.4pp |     13.8% |

**Brier score (market-implied):** 0.2496 (lower = better; 0.25 = coin-flip prior).
**Edge correlation (realized vs implied):** Spearman ρ = -0.086 (positive = bands aligned with market expectation; high positive = AGS-U is largely re-stating the favorite signal).

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|---------|------------|--------|
| 2026-05-16 | MLB   | TOTAL  | Over 8.5                |  -110 |  1.65u |  +0.81 | LOCK    | Q4   |   +0 | LOSS    |     -1.65u |  -2.6% |
| 2026-05-16 | MLB   | SPREAD | Boston Red Sox          |  -175 |  1.65u |  +0.84 | LOCK    | Q4   |   +0 | WIN     |     +0.94u |  +3.8% |
| 2026-05-16 | NHL   | ML     | Canadiens               |  -178 |  0.00u |  -3.09 | FADE    | Q1   |   +0 | TRACKED |      0.00u |  +1.4% |
| 2026-05-16 | MLB   | ML     | Toronto Blue Jays       |  -102 |  0.50u |  -1.64 | WEAK    | Q2   |   +0 | WIN     |     +0.49u |  -0.2% |
| 2026-05-16 | MLB   | ML     | Texas Rangers           |  -146 |  0.00u |  -3.96 | FADE    | Q1   |   +1 | TRACKED |      0.00u |  +0.0% |
| 2026-05-16 | MLB   | ML     | New York Mets           |  +110 |  2.50u |  +2.80 | PREMIUM | Q5   |   +2 | WIN     |     +2.75u |  +2.0% |
| 2026-05-16 | MLB   | ML     | Minnesota Twins         |  +110 |  2.50u |  +2.58 | LOCK    | Q4   |   +1 | LOSS    |     -2.50u |  +0.2% |
| 2026-05-16 | MLB   | ML     | Chicago Cubs            |  -105 |  0.00u |  -3.35 | FADE    | Q1   |   +0 | TRACKED |      0.00u |  +0.5% |
| 2026-05-16 | MLB   | ML     | Boston Red Sox          |  +110 |  1.25u |  +0.50 | LEAN    | Q3   |   +1 | WIN     |     +1.38u |  +4.4% |
| 2026-05-15 | NBA   | TOTAL  | Over 218.5              |  -107 |  1.65u |  -1.04 | WEAK    | Q2   |   +0 | WIN     |     +1.87u |  -0.5% |
| 2026-05-15 | NBA   | TOTAL  | Over 210.5              |  -105 |  0.30u |  -2.49 | WEAK    | Q2   |   +1 | LOSS    |     -0.75u |  +0.0% |
| 2026-05-15 | MLB   | TOTAL  | Under 10.5              |  -110 |  0.30u |  -1.69 | WEAK    | Q2   |   +1 | WIN     |     +0.27u |  +0.2% |
| 2026-05-15 | NBA   | SPREAD | Timberwolves            |  -102 |  0.00u |  -1.65 | WEAK    | Q2   |   +0 | TRACKED |      0.00u |  -0.5% |
| 2026-05-15 | NBA   | SPREAD | Pistons                 |  -102 |  0.00u |  -4.37 | FADE    | Q1   |   -1 | TRACKED |      0.00u |  -0.2% |
| 2026-05-15 | NBA   | ML     | Pistons                 |  +150 |  0.50u |  -0.48 | WEAK    | Q2   |   +1 | WIN     |     +0.75u |  +0.3% |
| 2026-05-15 | MLB   | ML     | San Francisco Giants    |  +110 |  0.50u |  +0.13 | WEAK    | Q2   |   +1 | LOSS    |     -1.25u |  +0.0% |
| 2026-05-15 | MLB   | ML     | Los Angeles Dodgers     |  -220 |  3.75u |  +4.44 | ELITE   | Q5   |   +1 | WIN     |     +1.25u |  -3.2% |
| 2026-05-15 | MLB   | ML     | Chicago White Sox       |  +128 |  2.50u |  +1.04 | LOCK    | Q4   |   +0 | LOSS    |     -2.50u |  +3.8% |
| 2026-05-14 | NHL   | ML     | Golden Knights          |  -114 |  2.75u |  +2.46 | LOCK    | Q4   |   +1 | WIN     |     +1.71u |  -5.9% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |    1 |        3.75 |      +1.25 |     33.3% |      +1.25 |          +0.333 |
| PREMIUM  |    1 |        2.50 |      +2.75 |    110.0% |      +2.75 |          +1.100 |
| LOCK     |    5 |       11.05 |      -4.00 |    -36.2% |      -0.80 |          -0.362 |
| LEAN     |    1 |        1.25 |      +1.38 |    110.4% |      +1.38 |          +1.104 |
| WEAK     |    7 |        3.75 |      +1.38 |     36.8% |      +0.20 |          +0.368 |
| FADE     |    4 |        0.00 |      -1.50 |         — |      -0.38 |               — |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). We can validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working; if they win frequently, q20 is too aggressive.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **27** · Win rate: **59.3%** · Flat-1u PnL: **+0.44u** · ROI: **1.6%**
- Verdict: 🚨 Mute floor may be too aggressive — SHADOWed picks win at ≥52%.

## § 9 — Daily Trend (cumulative PnL)

| Date       | N   | W-L   | Win %  | Daily PnL  | Cum PnL    | Cum Win % | Bar                  |
|------------|-----|-------|--------|------------|------------|-----------|----------------------|
| 2026-05-14 |   1 | 1-0   | 100.0% |      +1.71 |      +1.71 |    100.0% | ████████████████████ |
| 2026-05-15 |   9 | 5-4   |  55.6% |      -0.36 |      +1.35 |     60.0% | ████████████████     |
| 2026-05-16 |   9 | 4-5   |  44.4% |      -0.09 |      +1.26 |     52.6% | ███████████████      |

> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |     3 | 🟡 informational only — true tracked plays |
| Live picks (not graded yet) with `finalUnits > 0`             |     1 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     0 | 🟢 every pick has an AGS-U |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Shipped picks with `provenWalletCount < 2`                    |     0 | 🟢 floor holding |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-16T14:09:20.257Z
- **Source / version:** cron
- **Sample size:** 359
- **Date range:** 2026-04-18 → 2026-05-15

**AGS-U quintile boundaries (summed-z space):**

| Boundary | Value      |
|----------|------------|
| q20      |      -2.66 |
| q40      |      -0.08 |
| q50      |      +0.47 |
| q60      |      +0.76 |
| q80      |      +2.64 |
| q90      |      +3.60 |

**Feature normalizers (mean / sd):**

| Feature           | Mean   | SD     |
|-------------------|--------|--------|
| Δcount            |   1.48 |   1.60 |
| ΔHCcount          |   0.47 |   0.83 |
| ΔavgConviction    |   0.54 |   0.56 |
| ΔHCsizeRatio      |   1.58 |   5.43 |
| forShare          |   0.81 |   0.25 |

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified v9 monitoring. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*