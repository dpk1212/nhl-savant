# AGS-Unified v9 — Daily Monitoring Report

**Generated:** Monday, May 25, 2026 at 11:38 AM ET
**AGS-U cutover:** 2026-05-14 · **Days live:** 11

> **Scope.** Every row in this report comes from picks AGS-U v9 actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are intentionally excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of two things:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **All-time ROI -12.6% / 7-day -16.7%** — both negative ≥ 5%. AGS-U may be miscalibrated. Drill into §3 (tier ladder) and §10 (mute validation).

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     19 | 7-12 |  36.8% |    -32.9% |      -9.95 |    +1.43% |     1.59u |       -1.26 | 7 (7-0) |
| Last 3 days |     62 | 30-32 |  48.4% |    -18.8% |     -19.42 |    +0.79% |     1.67u |       -0.51 | 14 (10-4) |
| Last 7 days |    100 | 49-51 |  49.0% |    -16.7% |     -30.76 |    +0.54% |     1.84u |       -0.71 | 19 (11-8) |
| All-time   |    123 | 63-60 |  51.2% |    -12.6% |     -28.09 |    +0.44% |     1.81u |       -0.50 | 26 (12-14) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U v9 is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   18 | 8-10   |  44.4% |    -18.7% |     -12.01 |     +4.12 |     3.57u |
| PREMIUM  | q80–q90     | 1.50×   |   11 | 5-6    |  45.5% |    -23.1% |      -6.86 |     +1.83 |     2.70u |
| LOCK     | q60–q80     | 1.10×   |   27 | 12-15  |  44.4% |    -24.6% |     -15.70 |     +0.88 |     2.36u |
| LEAN     | q40–q60     | 0.50×   |   43 | 25-18  |  58.1% |     13.4% |      +6.85 |     +0.23 |     1.19u |
| WEAK     | q20–q40     | 0.20×   |   22 | 12-10  |  54.5% |     -4.4% |      -0.54 |     -0.97 |     0.56u |
| FADE     | < q20       | 0.00×   |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -2.03 |     0.53u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `-1` 🟡 partial — ladder mostly works but has noise
- ROI across tiers:   `-1` 🟡 partial

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|
| Q1       |    2 | 1-1    |  50.0% |     16.2% |      +0.17 |     -2.03 |               49.8% |
| Q2       |   33 | 20-13  |  60.6% |     15.7% |      +3.48 |     -0.66 |               51.0% |
| Q3       |   32 | 17-15  |  53.1% |      6.9% |      +2.83 |     +0.29 |               53.0% |
| Q4       |   27 | 12-15  |  44.4% |    -24.6% |     -15.70 |     +0.88 |               53.4% |
| Q5       |   29 | 13-16  |  44.8% |    -20.1% |     -18.87 |     +3.25 |               54.8% |

**Spearman ρ (quintile vs realized win%):** -0.600  ·  monotonicity `0/4`

## § 3 — Univariate Feature Analysis

The five L1-pruned features that compose AGS-U. For each feature we report the average value across all picks, the point-biserial correlation with WIN (closer to ±1 = more predictive), and ROI sorted by feature decile so you can see whether the feature is earning its slot.

| Feature           | Family         | N    | Mean   | SD     | Corr(WIN) | Top-decile ROI | Bot-decile ROI | Lift   |
|-------------------|----------------|------|--------|--------|-----------|----------------|----------------|--------|
| Δcount            | COUNT          |  148 |   0.05 |   1.18 |    +0.018 |         -25.7% |           6.0% | -31.7pp |
| ΔHCcount          | COUNT_HC       |  148 |   0.13 |   1.06 |    -0.094 |         -71.7% |         -23.4% | -48.4pp |
| ΔavgConviction    | INTENSITY      |  148 |  -0.06 |   0.85 |    +0.078 |           5.2% |         -26.4% | +31.6pp |
| ΔHCsizeRatio      | INTENSITY_HC   |  148 |   0.24 |   1.49 |    -0.072 |         -52.5% |           1.7% | -54.2pp |
| forShare          | DOMINANCE      |  148 |   0.07 |   0.79 |    +0.139 |          33.5% |         -80.5% | +114.0pp |

> **Corr(WIN)** = point-biserial correlation between feature value and binary WIN outcome.
> **Top/Bot-decile ROI** = ROI for the top/bottom 10% of picks by this feature value alone.
> **Lift** = top-decile ROI − bottom-decile ROI in percentage points. Positive lift = feature is earning its keep in the composite.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier? If HC adds value across the board, it's a candidate for re-promotion; if not, the composite is already capturing it.

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | 3n 33.3% -43% | 9n 55.6% +11% | 6n 33.3% -40% | 18n 44.4% -19% |
| PREMIUM  | 3n 33.3% -22% | 5n 60.0% -7% | 3n 33.3% -48% | 11n 45.5% -23% |
| LOCK     | 14n 50.0% -4% | 10n 50.0% -16% | 3n 0.0% -100% | 27n 44.4% -25% |
| LEAN     | 29n 58.6% +8% | 12n 58.3% +19% | 2n 50.0% +56% | 43n 58.1% +13% |
| WEAK     | 8n 62.5% +49% | 14n 50.0% -33% | —            | 22n 54.5% -4% |
| FADE     | 2n 50.0% +16% | —            | —            | 2n 50.0% +16% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 8n 37.5% -25%  | 8n 37.5% -34%  | 2n 100.0% +66% | 18n 44.4% -19% |
| PREMIUM  | 8n 50.0% -7%   | 1n 0.0% -100%  | 2n 50.0% -29%  | 11n 45.5% -23% |
| LOCK     | 21n 47.6% -15% | 4n 25.0% -63%  | 2n 50.0% -42%  | 27n 44.4% -25% |
| LEAN     | 36n 61.1% +30% | 2n 50.0% -1%   | 5n 40.0% -74%  | 43n 58.1% +13% |
| WEAK     | 17n 52.9% -32% | 5n 60.0% +73%  | —              | 22n 54.5% -4%  |
| FADE     | —              | 1n 0.0% -100%  | 1n 100.0% +63% | 2n 50.0% +16%  |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 4n 100.0% +41% | 2n 0.0% -100% | 10n 40.0% -15% | 2n 0.0% -100% | —             |
| PREMIUM  | 2n 0.0% -100% | 3n 33.3% -60% | 4n 75.0% +25% | 1n 100.0% +110% | 1n 0.0% -100% |
| LOCK     | —             | 8n 62.5% -12% | 14n 28.6% -51% | 4n 50.0% +9%  | 1n 100.0% +168% |
| LEAN     | 2n 50.0% -52% | 13n 46.2% -25% | 20n 65.0% +36% | 7n 71.4% +76% | 1n 0.0% -100% |
| WEAK     | —             | 1n 100.0% +56% | 13n 53.8% +19% | 7n 42.9% -50% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | 1n 0.0% -100% | —             | —             |

## § 5 — Calibration Reliability

Slice AGS-U into 6 bands and compare the AVERAGE IMPLIED PROBABILITY (from market odds at lock time) to the REALIZED win rate in each band. A well-calibrated system has realized ≈ implied + a constant edge. If realized > implied at the high end and ≤ implied at the low end, the ladder is genuinely sorting by edge (not just by favorite-status).

| AGS-U Band       | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| ≥ +3.5           |   10 |        40.0% |       55.0% |     -15.0pp |    -24.5% |
| +2.5 to 3.5      |    8 |        62.5% |       54.9% |      +7.6pp |      1.1% |
| +1.5 to 2.5      |    4 |        50.0% |       52.5% |      -2.5pp |    -34.7% |
| +0.5 to 1.5      |   22 |        45.5% |       53.0% |      -7.6pp |    -17.9% |
| −0.5 to 0.5      |   68 |        50.0% |       52.8% |      -2.8pp |    -10.0% |
| < −0.5           |   11 |        72.7% |       49.5% |     +23.2pp |     58.5% |

**Brier score (market-implied):** 0.2539 (lower = better; 0.25 = coin-flip prior).
**Edge correlation (realized vs implied):** Spearman ρ = -0.600 (positive = bands aligned with market expectation; high positive = AGS-U is largely re-stating the favorite signal).

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|---------|------------|--------|
| 2026-05-24 | NBA   | TOTAL  | Over 219                |  -107 |  3.00u |  +0.37 | LOCK    | Q4   |   +1 | LOSS    |     -3.00u |  -0.5% |
| 2026-05-24 | MLB   | TOTAL  | Under 8.5               |  -110 |  0.75u |  +0.04 | LEAN    | Q2   |   +0 | WIN     |     +0.68u |  -1.6% |
| 2026-05-24 | MLB   | TOTAL  | Over 10.5               |  -110 |  0.75u |  +0.17 | LEAN    | Q3   |   +0 | LOSS    |     -0.75u |  -1.2% |
| 2026-05-24 | MLB   | TOTAL  | Under 8                 |  +100 |  0.30u |  -0.20 | WEAK    | Q2   |   +0 | WIN     |     +0.30u |  +0.9% |
| 2026-05-24 | MLB   | TOTAL  | Under 7.5               |  -101 |  0.00u |  +0.33 | LOCK    | Q4   |   +1 | TRACKED |      0.00u |  +0.0% |
| 2026-05-24 | MLB   | TOTAL  | Under 10.5              |  -107 |  0.00u |  -0.39 | FADE    | Q1   |   -1 | TRACKED |      0.00u |  -1.9% |
| 2026-05-24 | MLB   | TOTAL  | Under 8.5               |  -110 |  1.65u |  +0.30 | LOCK    | Q4   |   +0 | LOSS    |     -1.65u |  -0.7% |
| 2026-05-24 | MLB   | TOTAL  | Under 8.5               |  -110 |  0.75u |  +0.04 | LEAN    | Q2   |   +0 | WIN     |     +0.68u |  +1.1% |
| 2026-05-24 | MLB   | TOTAL  | Under 5.5               |  -110 |  1.65u |  +0.26 | LOCK    | Q4   |   +1 | LOSS    |     -1.65u |  -0.9% |
| 2026-05-24 | MLB   | TOTAL  | Under 6.5               |  -112 |  0.30u |  +0.00 | WEAK    | Q2   |   +0 | LOSS    |     -0.30u |  -2.4% |
| 2026-05-24 | NBA   | SPREAD | Thunder                 |  -102 |  1.65u |  +0.26 | LOCK    | Q4   |   +0 | LOSS    |     -1.65u |  +1.0% |
| 2026-05-24 | MLB   | SPREAD | Atlanta Braves          |  +134 |  0.75u |  +0.07 | LEAN    | Q3   |   +0 | LOSS    |     -0.75u |  +0.7% |
| 2026-05-24 | MLB   | SPREAD | Milwaukee Brewers       |  -120 |  1.65u |  +0.36 | LOCK    | Q4   |   +1 | LOSS    |     -1.65u |  +2.2% |
| 2026-05-24 | NHL   | ML     | Avalanche               |  -142 |  2.75u |  +0.14 | LEAN    | Q3   |   +0 | LOSS    |     -2.75u |  +2.2% |
| 2026-05-24 | NBA   | ML     | Spurs                   |  -146 |  0.00u |  -1.57 | FADE    | Q1   |   -1 | TRACKED |      0.00u |  +3.3% |
| 2026-05-24 | MLB   | ML     | Los Angeles Angels      |  -124 |  0.00u |  -0.56 | FADE    | Q1   |   +1 | TRACKED |      0.00u |  +1.3% |
| 2026-05-24 | MLB   | ML     | Seattle Mariners        |  -120 |  1.25u |  +0.08 | LEAN    | Q3   |   +1 | LOSS    |     -1.25u |  -1.3% |
| 2026-05-24 | MLB   | ML     | Pittsburgh Pirates      |  +149 |  1.25u |  +0.09 | LEAN    | Q3   |   +2 | WIN     |     +1.86u |  -0.6% |
| 2026-05-24 | MLB   | ML     | Athletics               |  +695 |  0.00u |  -0.62 | FADE    | Q1   |   +1 | TRACKED |      0.00u | +27.1% |
| 2026-05-24 | MLB   | ML     | Miami Marlins           |  -107 |  1.25u |  +0.04 | LEAN    | Q2   |   +0 | WIN     |     +1.17u |  +4.3% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   18 |       64.25 |     -12.01 |    -18.7% |      -0.67 |          -0.187 |
| PREMIUM  |   11 |       29.75 |      -6.86 |    -23.1% |      -0.62 |          -0.231 |
| LOCK     |   27 |       63.75 |     -15.70 |    -24.6% |      -0.58 |          -0.246 |
| LEAN     |   43 |       51.05 |      +6.85 |     13.4% |      +0.16 |          +0.134 |
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

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.

> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    30 | 🟡 informational only — true tracked plays |
| Live picks (not graded yet) with `finalUnits > 0`             |    18 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     1 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    39 | 🟡 informational — AGS-U calibration controls sample adequacy |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-25T15:06:09.811Z
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