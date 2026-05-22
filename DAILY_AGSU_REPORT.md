# AGS-Unified v9 — Daily Monitoring Report

**Generated:** Friday, May 22, 2026 at 11:36 AM ET
**AGS-U cutover:** 2026-05-14 · **Days live:** 8

> **Scope.** Every row in this report comes from picks AGS-U v9 actually promoted (`promotedBy = ags-unified-v9`). Picks promoted by legacy v7/v8 routes are intentionally excluded — they'd contaminate the calibration story. Within the AGS-U pool, each pick is classified as one of two things:

> - **🟢 LIVE SHIPPED** — `finalUnits > 0` (ELITE/PREMIUM/LOCK/LEAN/WEAK). Real money risked, real W-L-PnL.
> - **⚪ TRACKED** — FADE tier, hard-muted to 0 units. Outcome graded for back-testing only; **excluded from W-L-PnL totals** (matches the dashboard's `loadAllTimePnL` math).

> Headline tables show **LIVE** numbers. Tracked counts are surfaced in §11 and the per-pick table flags every TRACKED row.

## § 0 — Executive Summary & Alerts

### Alerts
- 🚨 **All-time ROI -7.3% / 7-day -9.0%** — both negative ≥ 5%. AGS-U may be miscalibrated. Drill into §3 (tier ladder) and §10 (mute validation).

### Headline Numbers — LIVE shipped picks only

| Window     | Live N | W-L   | Win %  | ROI       | PnL (u)    | CLV       | Avg Stake | Sharpe-like | Tracked |
|------------|--------|-------|--------|-----------|------------|-----------|-----------|-------------|---------|
| Yesterday  |     12 | 6-6 |  50.0% |    -26.7% |      -5.06 |    +0.45% |     1.58u |       -0.25 | 2 (0-2) |
| Last 3 days |     30 | 15-15 |  50.0% |    -14.7% |      -8.63 |    +0.15% |     1.96u |       -0.56 | 3 (1-2) |
| Last 7 days |     60 | 32-28 |  53.3% |     -9.0% |     -10.38 |    +0.16% |     1.93u |       -0.29 | 12 (2-10) |
| All-time   |     61 | 33-28 |  54.1% |     -7.3% |      -8.67 |    +0.08% |     1.95u |       -0.21 | 12 (2-10) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U v9 is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |   10 | 4-6    |  40.0% |    -24.5% |      -8.03 |     +6.82 |     3.27u |
| PREMIUM  | q80–q90     | 1.50×   |    6 | 4-2    |  66.7% |     10.1% |      +1.75 |     +2.99 |     2.88u |
| LOCK     | q60–q80     | 1.10×   |   14 | 7-7    |  50.0% |    -24.3% |      -8.26 |     +1.45 |     2.43u |
| LEAN     | q40–q60     | 0.50×   |   16 | 9-7    |  56.3% |     23.9% |      +5.92 |     +0.48 |     1.55u |
| WEAK     | q20–q40     | 0.20×   |   14 | 8-6    |  57.1% |     -5.7% |      -0.52 |     -1.40 |     0.65u |
| FADE     | < q20       | 0.00×   |    1 | 1-0    | 100.0% |     62.7% |      +0.47 |     -4.07 |     0.75u |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -5, fully inverted = 5):
- Win % across tiers: `3` 🚨 inverted — higher tiers winning LESS than lower
- ROI across tiers:   `1` 🚨 inverted — sizing ladder is destroying value

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|
| Q1       |    1 | 1-0    | 100.0% |     62.7% |      +0.47 |     -4.07 |               52.3% |
| Q2       |   14 | 8-6    |  57.1% |     -5.7% |      -0.52 |     -1.40 |               48.7% |
| Q3       |   16 | 9-7    |  56.3% |     23.9% |      +5.92 |     +0.48 |               53.4% |
| Q4       |   14 | 7-7    |  50.0% |    -24.3% |      -8.26 |     +1.45 |               53.2% |
| Q5       |   16 | 8-8    |  50.0% |    -12.6% |      -6.28 |     +5.38 |               55.0% |

**Spearman ρ (quintile vs realized win%):** -0.900  ·  monotonicity `-3/4`

## § 3 — Univariate Feature Analysis

The five L1-pruned features that compose AGS-U. For each feature we report the average value across all picks, the point-biserial correlation with WIN (closer to ±1 = more predictive), and ROI sorted by feature decile so you can see whether the feature is earning its slot.

| Feature           | Family         | N    | Mean   | SD     | Corr(WIN) | Top-decile ROI | Bot-decile ROI | Lift   |
|-------------------|----------------|------|--------|--------|-----------|----------------|----------------|--------|
| Δcount            | COUNT          |   73 |   0.21 |   1.18 |    +0.191 |          -6.1% |              — |      — |
| ΔHCcount          | COUNT_HC       |   73 |   0.38 |   1.11 |    -0.042 |         -43.5% |          -8.1% | -35.4pp |
| ΔavgConviction    | INTENSITY      |   73 |  -0.17 |   0.86 |    +0.159 |          -3.1% |         -41.9% | +38.8pp |
| ΔHCsizeRatio      | INTENSITY_HC   |   73 |   0.37 |   1.70 |    +0.026 |         -36.6% |           7.9% | -44.5pp |
| forShare          | DOMINANCE      |   73 |  -0.01 |   0.80 |    +0.261 |          20.3% |          62.7% | -42.4pp |

> **Corr(WIN)** = point-biserial correlation between feature value and binary WIN outcome.
> **Top/Bot-decile ROI** = ROI for the top/bottom 10% of picks by this feature value alone.
> **Lift** = top-decile ROI − bottom-decile ROI in percentage points. Positive lift = feature is earning its keep in the composite.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier? If HC adds value across the board, it's a candidate for re-promotion; if not, the composite is already capturing it.

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | —            | 5n 40.0% -25% | 5n 40.0% -24% | 10n 40.0% -25% |
| PREMIUM  | —            | 4n 75.0% +25% | 2n 50.0% -16% | 6n 66.7% +10% |
| LOCK     | 6n 50.0% -20% | 6n 66.7% +12% | 2n 0.0% -100% | 14n 50.0% -24% |
| LEAN     | 8n 62.5% +41% | 7n 57.1% +18% | 1n 0.0% -100% | 16n 56.3% +24% |
| WEAK     | 4n 75.0% +72% | 10n 50.0% -43% | —            | 14n 57.1% -6% |
| FADE     | 1n 100.0% +63% | —            | —            | 1n 100.0% +63% |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 5n 20.0% -64%  | 5n 60.0% +4%   | —              | 10n 40.0% -25% |
| PREMIUM  | 4n 75.0% +31%  | 1n 0.0% -100%  | 1n 100.0% +89% | 6n 66.7% +10%  |
| LOCK     | 10n 50.0% -19% | 2n 50.0% -19%  | 2n 50.0% -42%  | 14n 50.0% -24% |
| LEAN     | 12n 66.7% +52% | 1n 0.0% -100%  | 3n 33.3% -71%  | 16n 56.3% +24% |
| WEAK     | 9n 55.6% -49%  | 5n 60.0% +73%  | —              | 14n 57.1% -6%  |
| FADE     | —              | —              | 1n 100.0% +63% | 1n 100.0% +63% |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 3n 100.0% +38% | —             | 5n 20.0% -59% | 2n 0.0% -100% | —             |
| PREMIUM  | 1n 0.0% -100% | 1n 0.0% -100% | 3n 100.0% +90% | 1n 100.0% +110% | —             |
| LOCK     | —             | 4n 75.0% +12% | 8n 50.0% -21% | 2n 0.0% -100% | —             |
| LEAN     | 1n 0.0% -100% | 4n 50.0% +14% | 7n 57.1% +41% | 3n 100.0% +122% | 1n 0.0% -100% |
| WEAK     | —             | —             | 8n 62.5% +39% | 5n 40.0% -65% | 1n 100.0% +160% |
| FADE     | —             | 1n 100.0% +63% | —             | —             | —             |

## § 5 — Calibration Reliability

Slice AGS-U into 6 bands and compare the AVERAGE IMPLIED PROBABILITY (from market odds at lock time) to the REALIZED win rate in each band. A well-calibrated system has realized ≈ implied + a constant edge. If realized > implied at the high end and ≤ implied at the low end, the ladder is genuinely sorting by edge (not just by favorite-status).

| AGS-U Band       | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| ≥ +3.5           |   10 |        40.0% |       55.0% |     -15.0pp |    -24.5% |
| +2.5 to 3.5      |    8 |        62.5% |       54.9% |      +7.6pp |      1.1% |
| +1.5 to 2.5      |    4 |        50.0% |       52.5% |      -2.5pp |    -34.7% |
| +0.5 to 1.5      |   13 |        46.2% |       51.2% |      -5.1pp |    -11.8% |
| −0.5 to 0.5      |   15 |        53.3% |       52.9% |      +0.4pp |     10.6% |
| < −0.5           |   11 |        72.7% |       51.0% |     +21.7pp |     58.5% |

**Brier score (market-implied):** 0.2452 (lower = better; 0.25 = coin-flip prior).
**Edge correlation (realized vs implied):** Spearman ρ = -0.429 (positive = bands aligned with market expectation; high positive = AGS-U is largely re-stating the favorite signal).

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|---------|------------|--------|
| 2026-05-21 | NHL   | TOTAL  | Over 6                  |  -115 |  0.75u |  +0.46 | LEAN    | Q3   |   +0 | WIN     |     +0.65u |  +5.1% |
| 2026-05-21 | NBA   | TOTAL  | Over 215.5              |  -110 |  0.00u |  -3.77 | FADE    | Q1   |   +1 | TRACKED |      0.00u |  -2.1% |
| 2026-05-21 | MLB   | TOTAL  | Under 7.5               |  -110 |  0.30u |  -1.96 | WEAK    | Q2   |   +0 | WIN     |     +0.27u |  +0.4% |
| 2026-05-21 | NHL   | SPREAD | Canadiens               |  -160 |  0.75u |  -4.16 | FADE    | Q1   |   +0 | WIN     |     +0.47u |  -3.6% |
| 2026-05-21 | NBA   | SPREAD | Cavaliers               |  -105 |  3.00u |  +4.25 | ELITE   | Q5   |   +2 | LOSS    |     -3.00u |  -0.5% |
| 2026-05-21 | MLB   | SPREAD | Toronto Blue Jays       |  -169 |  1.65u |  +2.53 | LOCK    | Q4   |   +1 | WIN     |     +0.98u |  +1.3% |
| 2026-05-21 | MLB   | SPREAD | Miami Marlins           |  -150 |  0.75u |  +0.32 | LEAN    | Q3   |   +0 | LOSS    |     -0.75u |  -0.4% |
| 2026-05-21 | NHL   | ML     | Hurricanes              |  -200 |  2.75u |  +0.18 | LEAN    | Q3   |   +1 | LOSS    |     -2.75u |  +1.3% |
| 2026-05-21 | NBA   | ML     | Cavaliers               |  +170 |  0.00u |  -3.10 | FADE    | Q1   |   -1 | TRACKED |      0.00u |  +3.4% |
| 2026-05-21 | MLB   | ML     | Toronto Blue Jays       |  +126 |  1.25u |  +0.47 | LEAN    | Q3   |   +0 | WIN     |     +1.57u |  +1.0% |
| 2026-05-21 | MLB   | ML     | Los Angeles Angels      |  -116 |  1.25u |  +0.24 | LEAN    | Q3   |   +1 | LOSS    |     -1.25u |  +0.6% |
| 2026-05-21 | MLB   | ML     | New York Mets           |  -110 |  2.75u |  +2.72 | PREMIUM | Q5   |   +1 | WIN     |     +2.50u |  +0.5% |
| 2026-05-21 | MLB   | ML     | Colorado Rockies        |  +172 |  1.25u |  +0.72 | LEAN    | Q3   |   +0 | LOSS    |     -1.25u |  -0.5% |
| 2026-05-21 | MLB   | ML     | Miami Marlins           |  +120 |  2.50u |  +4.96 | ELITE   | Q5   |   +1 | LOSS    |     -2.50u |  -0.2% |
| 2026-05-20 | NBA   | TOTAL  | Over 215.5              |  -110 |  1.65u |  +1.77 | LOCK    | Q4   |   +1 | WIN     |     +1.50u |  -2.3% |
| 2026-05-20 | MLB   | TOTAL  | Under 4.5               |  -121 |  0.75u |  +0.59 | LEAN    | Q3   |   +0 | LOSS    |     -0.75u |  +2.2% |
| 2026-05-20 | NBA   | SPREAD | Thunder                 |  -110 |  3.00u |  +7.21 | ELITE   | Q5   |   +1 | WIN     |     +2.73u |  +0.9% |
| 2026-05-20 | NHL   | ML     | Avalanche               |  -176 |  1.25u |  +0.44 | LEAN    | Q3   |   +1 | LOSS    |     -1.25u |  -2.6% |
| 2026-05-20 | NBA   | ML     | Thunder                 |  -238 |  5.00u | +22.20 | ELITE   | Q5   |   +5 | WIN     |     +2.10u |  +1.4% |
| 2026-05-20 | MLB   | ML     | San Francisco Giants    |  +100 |  2.50u |  +1.02 | LOCK    | Q4   |   +1 | LOSS    |     -2.50u |  +4.6% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |   10 |       32.75 |      -8.03 |    -24.5% |      -0.80 |          -0.245 |
| PREMIUM  |    6 |       17.25 |      +1.75 |     10.1% |      +0.29 |          +0.101 |
| LOCK     |   14 |       34.00 |      -8.26 |    -24.3% |      -0.59 |          -0.243 |
| LEAN     |   16 |       24.75 |      +5.92 |     23.9% |      +0.37 |          +0.239 |
| WEAK     |   14 |        9.15 |      -0.52 |     -5.7% |      -0.04 |          -0.057 |
| FADE     |    1 |        0.75 |      +0.47 |     62.7% |      +0.47 |          +0.627 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). We can validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working; if they win frequently, q20 is too aggressive.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **25** · Win rate: **56.0%** · Flat-1u PnL: **-1.08u** · ROI: **-4.3%**
- Verdict: 🚨 Mute floor may be too aggressive — SHADOWed picks win at ≥52%.

## § 9 — Daily Trend (cumulative PnL)

| Date       | Live | W-L   | Win %  | Daily PnL  | Cum PnL    | Cum Win % | Trk | Bar                  |
|------------|------|-------|--------|------------|------------|-----------|-----|----------------------|
| 2026-05-14 |    1 | 1-0   | 100.0% |      +1.71 |      +1.71 |    100.0% |   0 | ████                 |
| 2026-05-15 |    7 | 4-3   |  57.1% |      -0.36 |      +1.35 |     62.5% |   2 | ███                  |
| 2026-05-16 |    6 | 4-2   |  66.7% |      +1.41 |      +2.76 |     64.3% |   3 | ██████               |
| 2026-05-17 |    9 | 5-4   |  55.6% |      -0.09 |      +2.67 |     60.9% |   2 | ██████               |
| 2026-05-18 |    8 | 4-4   |  50.0% |      -2.71 |      -0.04 |     58.1% |   2 |                      |
| 2026-05-19 |    8 | 3-5   |  37.5% |      -6.20 |      -6.24 |     53.8% |   0 |       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-20 |   10 | 6-4   |  60.0% |      +2.63 |      -3.61 |     55.1% |   1 |             ▓▓▓▓▓▓▓▓ |
| 2026-05-21 |   12 | 6-6   |  50.0% |      -5.06 |      -8.67 |     54.1% |   2 | ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.

> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    13 | 🟡 informational only — true tracked plays |
| Live picks (not graded yet) with `finalUnits > 0`             |    13 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     0 | 🟢 every pick has an AGS-U |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |    13 | 🟡 informational — AGS-U calibration controls sample adequacy |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-21T16:02:12.324Z
- **Source / version:** cron
- **Sample size:** 457
- **Date range:** 2026-04-18 → 2026-05-20

**AGS-U quintile boundaries (summed-z space):**

| Boundary | Value      |
|----------|------------|
| q20      |      -2.67 |
| q40      |      -0.05 |
| q50      |      +0.39 |
| q60      |      +0.78 |
| q80      |      +2.61 |
| q90      |      +3.62 |

**Feature normalizers (mean / sd):**

| Feature           | Mean   | SD     |
|-------------------|--------|--------|
| Δcount            |   1.41 |   1.54 |
| ΔHCcount          |   0.44 |   0.82 |
| ΔavgConviction    |   0.55 |   0.54 |
| ΔHCsizeRatio      |   1.66 |   5.88 |
| forShare          |   0.81 |   0.25 |

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified v9 monitoring. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*