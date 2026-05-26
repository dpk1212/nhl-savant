# AGS-Unified v9 — Daily Monitoring Report

**Generated:** Tuesday, May 26, 2026 at 11:21 AM ET
**AGS-U cutover:** 2026-05-14 · **Days live:** 12

> **Scope.** Every row in this report comes from picks AGS-U v9 actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are intentionally excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of two things:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **All-time ROI -10.3% / 7-day -13.2%** — both negative ≥ 5%. AGS-U may be miscalibrated. Drill into §3 (tier ladder) and §10 (mute validation).

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     19 | 11-8 |  57.9% |      0.1% |      +0.05 |    -0.45% |     2.63u |        0.08 | 3 (2-1) |
| Last 3 days |     61 | 33-28 |  54.1% |     -1.9% |      -2.20 |    +0.38% |     1.92u |        0.18 | 14 (10-4) |
| Last 7 days |    111 | 56-55 |  50.5% |    -13.2% |     -28.00 |    +0.42% |     1.91u |       -0.65 | 20 (13-7) |
| All-time   |    142 | 74-68 |  52.1% |    -10.3% |     -28.04 |    +0.33% |     1.92u |       -0.45 | 29 (14-15) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U v9 is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   25 | 12-13  |  48.0% |    -13.2% |     -12.25 |     +3.24 |     3.71u |
| PREMIUM  | q80–q90     | 1.50×   |   15 | 7-8    |  46.7% |    -18.7% |      -7.63 |     +1.44 |     2.72u |
| LOCK     | q60–q80     | 1.10×   |   31 | 14-17  |  45.2% |    -22.3% |     -15.64 |     +0.80 |     2.26u |
| LEAN     | q40–q60     | 0.50×   |   47 | 28-19  |  59.6% |     14.3% |      +7.85 |     +0.21 |     1.17u |
| WEAK     | q20–q40     | 0.20×   |   22 | 12-10  |  54.5% |     -4.4% |      -0.54 |     -0.97 |     0.56u |
| FADE     | < q20       | 0.00×   |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -1.84 |     0.53u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `-3` 🟡 partial — ladder mostly works but has noise
- ROI across tiers:   `-1` 🟡 partial

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|
| Q1       |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -1.84 |               49.8% |
| Q2       |   33 | 20-13  |  60.6% |     15.7% |      +3.48 |     -0.66 |               51.0% |
| Q3       |   36 | 20-16  |  55.6% |      8.5% |      +3.83 |     +0.27 |               53.0% |
| Q4       |   31 | 14-17  |  45.2% |    -22.3% |     -15.64 |     +0.80 |               53.9% |
| Q5       |   40 | 19-21  |  47.5% |    -14.9% |     -19.88 |     +2.56 |               55.9% |

**Spearman ρ (quintile vs realized win%):** -0.600  ·  monotonicity `0/4`

## § 3 — Univariate Feature Analysis

The five L1-pruned features that compose AGS-U. For each feature we report the average value across all picks, the point-biserial correlation with WIN (closer to ±1 = more predictive), and ROI sorted by feature decile so you can see whether the feature is earning its slot.

| Feature           | Family         | N    | Mean   | SD     | Corr(WIN) | Top-decile ROI | Bot-decile ROI | Lift   |
|-------------------|----------------|------|--------|--------|-----------|----------------|----------------|--------|
| Δcount            | COUNT          |  170 |   0.14 |   1.20 |    -0.009 |         -21.3% |          39.0% | -60.3pp |
| ΔHCcount          | COUNT_HC       |  163 |   0.12 |   1.01 |    -0.087 |         -73.4% |         -23.4% | -50.0pp |
| ΔavgConviction    | INTENSITY      |  163 |  -0.06 |   0.81 |    +0.079 |           7.8% |         -26.4% | +34.2pp |
| ΔHCsizeRatio      | INTENSITY_HC   |  170 |   0.23 |   1.42 |    -0.087 |         -60.0% |         -28.1% | -31.9pp |
| forShare          | DOMINANCE      |  163 |   0.06 |   0.76 |    +0.148 |           9.8% |         -86.1% | +95.8pp |

> **Corr(WIN)** = point-biserial correlation between feature value and binary WIN outcome.
> **Top/Bot-decile ROI** = ROI for the top/bottom 10% of picks by this feature value alone.
> **Lift** = top-decile ROI − bottom-decile ROI in percentage points. Positive lift = feature is earning its keep in the composite.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier? If HC adds value across the board, it's a candidate for re-promotion; if not, the composite is already capturing it.

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 8n 62.5% -1% | 9n 55.6% +11% | 8n 25.0% -52% | 25n 48.0% -13% |
| PREMIUM  | 6n 33.3% -22% | 6n 66.7% +1% | 3n 33.3% -48% | 15n 46.7% -19% |
| LOCK     | 18n 50.0% -3% | 10n 50.0% -16% | 3n 0.0% -100% | 31n 45.2% -22% |
| LEAN     | 32n 59.4% +8% | 13n 61.5% +21% | 2n 50.0% +56% | 47n 59.6% +14% |
| WEAK     | 8n 62.5% +49% | 14n 50.0% -33% | —            | 22n 54.5% -4% |
| FADE     | 2n 50.0% +16% | —            | —            | 2n 50.0% +16% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 12n 50.0% -12% | 10n 40.0% -25% | 3n 66.7% +24%  | 25n 48.0% -13% |
| PREMIUM  | 11n 45.5% -11% | 1n 0.0% -100%  | 3n 66.7% -8%   | 15n 46.7% -19% |
| LOCK     | 25n 48.0% -13% | 4n 25.0% -63%  | 2n 50.0% -42%  | 31n 45.2% -22% |
| LEAN     | 40n 62.5% +30% | 2n 50.0% -1%   | 5n 40.0% -74%  | 47n 59.6% +14% |
| WEAK     | 17n 52.9% -32% | 5n 60.0% +73%  | —              | 22n 54.5% -4%  |
| FADE     | —              | 1n 0.0% -100%  | 1n 100.0% +63% | 2n 50.0% +16%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 6n 100.0% +40% | 4n 25.0% -55% | 12n 41.7% -14% | 3n 0.0% -100% | —             |
| PREMIUM  | 3n 33.3% -54% | 4n 25.0% -65% | 6n 66.7% +12% | 1n 100.0% +110% | 1n 0.0% -100% |
| LOCK     | —             | 9n 66.7% -7%  | 16n 25.0% -56% | 4n 50.0% +9%  | 2n 100.0% +165% |
| LEAN     | 2n 50.0% -52% | 15n 46.7% -26% | 22n 68.2% +40% | 7n 71.4% +76% | 1n 0.0% -100% |
| WEAK     | —             | 1n 100.0% +56% | 13n 53.8% +19% | 7n 42.9% -50% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | 1n 0.0% -100% | —             | —             |

## § 5 — Calibration Reliability

Slice AGS-U into 6 bands and compare the AVERAGE IMPLIED PROBABILITY (from market odds at lock time) to the REALIZED win rate in each band. A well-calibrated system has realized ≈ implied + a constant edge. If realized > implied at the high end and ≤ implied at the low end, the ladder is genuinely sorting by edge (not just by favorite-status).

| AGS-U Band       | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| ≥ +3.5           |   10 |        40.0% |       55.0% |     -15.0pp |    -24.5% |
| +2.5 to 3.5      |    8 |        62.5% |       54.9% |      +7.6pp |      1.1% |
| +1.5 to 2.5      |    5 |        40.0% |       51.1% |     -11.1pp |    -46.2% |
| +0.5 to 1.5      |   27 |        48.1% |       54.7% |      -6.5pp |    -13.1% |
| −0.5 to 0.5      |   81 |        51.9% |       53.3% |      -1.4pp |     -5.6% |
| < −0.5           |   11 |        72.7% |       49.6% |     +23.1pp |     58.5% |

**Brier score (market-implied):** 0.2500 (lower = better; 0.25 = coin-flip prior).
**Edge correlation (realized vs implied):** Spearman ρ = -0.486 (positive = bands aligned with market expectation; high positive = AGS-U is largely re-stating the favorite signal).

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|---------|------------|--------|
| 2026-05-25 | NBA   | TOTAL  | Under 216.5             |  -111 |  3.00u |  +0.65 | ELITE   | Q5   |   +2 | LOSS    |     -3.00u |  -1.4% |
| 2026-05-25 | MLB   | TOTAL  | Under 7.5               |  -114 |  0.75u |  +0.13 | LEAN    | Q3   |   +1 | WIN     |     +0.66u |  +3.5% |
| 2026-05-25 | MLB   | TOTAL  | Over 4.5                |  -122 |  3.00u |  +0.49 | ELITE   | Q5   |   +0 | WIN     |     +2.46u |  -2.9% |
| 2026-05-25 | MLB   | TOTAL  | Under 8                 |  -112 |  1.65u |  +0.27 | LOCK    | Q4   |   +0 | LOSS    |     -1.65u |  -0.4% |
| 2026-05-25 | MLB   | TOTAL  | Over 9                  |  +103 |  1.65u |  +0.19 | LOCK    | Q4   |   +0 | LOSS    |     -1.65u |  +0.5% |
| 2026-05-25 | NHL   | SPREAD | Canadiens               |  -205 |  2.25u |  +0.37 | PREMIUM | Q5   |   +1 | WIN     |     +1.10u |  -3.1% |
| 2026-05-25 | NBA   | SPREAD | Cavaliers               |  -105 |  0.00u |  -0.87 | FADE    | Q1   |   +2 | TRACKED |      0.00u |  -1.7% |
| 2026-05-25 | MLB   | SPREAD | Baltimore Orioles       |  -179 |  1.65u |  +0.14 | LOCK    | Q4   |   +0 | WIN     |     +0.92u |  +0.7% |
| 2026-05-25 | MLB   | SPREAD | Kansas City Royals      |  -149 |  0.75u |  +0.06 | LEAN    | Q3   |   +0 | WIN     |     +0.50u |  +3.5% |
| 2026-05-25 | MLB   | SPREAD | Houston Astros          |  +163 |  1.50u |  +0.18 | LOCK    | Q4   |   +0 | WIN     |     +2.44u |  +1.2% |
| 2026-05-25 | NHL   | ML     | Canadiens               |  +120 |  2.50u |  +2.40 | ELITE   | Q5   |   +4 | LOSS    |     -2.50u |  -2.4% |
| 2026-05-25 | NBA   | ML     | Knicks                  |  -126 |  5.00u |  +1.13 | ELITE   | Q5   |   +0 | WIN     |     +3.97u |  -2.4% |
| 2026-05-25 | MLB   | ML     | Baltimore Orioles       |  -105 |  0.00u |  -0.23 | FADE    | Q1   |   +1 | TRACKED |      0.00u |  +2.2% |
| 2026-05-25 | MLB   | ML     | Milwaukee Brewers       |  -220 |  5.00u |  +0.69 | ELITE   | Q5   |   +0 | WIN     |     +2.27u |  +0.5% |
| 2026-05-25 | MLB   | ML     | Seattle Mariners        |  -115 |  1.25u |  +0.07 | LEAN    | Q3   |   +0 | WIN     |     +1.09u |  -1.1% |
| 2026-05-25 | MLB   | ML     | Philadelphia Phillies   |  -120 |  3.75u |  +0.42 | PREMIUM | Q5   |   -1 | WIN     |     +3.13u |  -1.3% |
| 2026-05-25 | MLB   | ML     | Minnesota Twins         |  -108 |  3.75u |  +0.31 | PREMIUM | Q5   |   +0 | LOSS    |     -3.75u |  -0.2% |
| 2026-05-25 | MLB   | ML     | Toronto Blue Jays       |  -160 |  1.25u |  +0.30 | PREMIUM | Q5   |   +0 | LOSS    |     -1.25u |  -1.3% |
| 2026-05-25 | MLB   | ML     | Texas Rangers           |  -125 |  1.25u |  -0.01 | LEAN    | Q3   |   -1 | LOSS    |     -1.25u |  +0.4% |
| 2026-05-25 | MLB   | ML     | Los Angeles Dodgers     |  -320 |  5.00u |  +0.64 | ELITE   | Q5   |   +0 | WIN     |     +1.56u |  -1.3% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   25 |       92.75 |     -12.25 |    -13.2% |      -0.49 |          -0.132 |
| PREMIUM  |   15 |       40.75 |      -7.63 |    -18.7% |      -0.51 |          -0.187 |
| LOCK     |   31 |       70.20 |     -15.64 |    -22.3% |      -0.50 |          -0.223 |
| LEAN     |   47 |       55.05 |      +7.85 |     14.3% |      +0.17 |          +0.143 |
| WEAK     |   22 |       12.35 |      -0.54 |     -4.4% |      -0.02 |          -0.044 |
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

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.

> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    34 | 🟡 informational only — true tracked plays |
| Live picks (not graded yet) with `finalUnits > 0`             |     6 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    38 | 🟡 informational — AGS-U calibration controls sample adequacy |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-25T15:41:33.029Z
- **Source / version:** cron
- **Sample size:** 565
- **Date range:** 2026-04-18 → 2026-05-24

**AGS-U quintile boundaries (summed-z space):**

| Boundary | Value      |
|----------|------------|
| q20      |      -0.16 |
| q40      |      -0.02 |
| q50      |      +0.06 |
| q60      |      +0.13 |
| q80      |      +0.29 |
| q90      |      +0.46 |

**Feature normalizers (mean / sd):**

| Feature           | Mean   | SD     |
|-------------------|--------|--------|
| Δcount            |   1.12 |   1.49 |
| ΔHCcount          |      — |      — |
| ΔavgConviction    |      — |      — |
| ΔHCsizeRatio      |   1.05 |   5.44 |
| forShare          |      — |      — |

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified v9 monitoring. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*