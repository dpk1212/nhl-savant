# AGS-Unified v9 — Daily Monitoring Report

**Generated:** Thursday, May 21, 2026 at 7:47 AM ET
**AGS-U cutover:** 2026-05-14 · **Days live:** 7

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
| Yesterday  |     10 | 6-4 |  60.0% |     12.4% |      +2.63 |    +0.76% |     2.11u |        0.25 | 1 (1-0) |
| Last 3 days |     26 | 13-13 |  50.0% |    -10.2% |      -6.28 |    -0.08% |     2.36u |       -0.44 | 3 (1-2) |
| Last 7 days |     49 | 27-22 |  55.1% |     -3.6% |      -3.61 |    -0.01% |     2.03u |       -0.12 | 10 (2-8) |
| All-time   |     49 | 27-22 |  55.1% |     -3.6% |      -3.61 |    -0.01% |     2.03u |       -0.12 | 10 (2-8) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U v9 is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |    8 | 4-4    |  50.0% |     -9.3% |      -2.53 |     +7.37 |     3.41u |
| PREMIUM  | q80–q90     | 1.50×   |    5 | 3-2    |  60.0% |     -5.2% |      -0.75 |     +3.05 |     2.90u |
| LOCK     | q60–q80     | 1.10×   |   13 | 6-7    |  46.2% |    -28.6% |      -9.24 |     +1.37 |     2.49u |
| LEAN     | q40–q60     | 0.50×   |   10 | 7-3    |  70.0% |     57.9% |      +9.70 |     +0.52 |     1.68u |
| WEAK     | q20–q40     | 0.20×   |   13 | 7-6    |  53.8% |     -8.9% |      -0.79 |     -1.36 |     0.68u |
| FADE     | < q20       | 0.00×   |    0 | 0-0    |      — |         — |      +0.00 |     -4.26 |         — |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -4, fully inverted = 4):
- Win % across tiers: `0` 🟡 random — calibration unclear
- ROI across tiers:   `0` 🟡 sizing not amplifying edge

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|
| Q1       |    0 | 0-0    |      — |         — |      +0.00 |     -4.26 |               53.9% |
| Q2       |   13 | 7-6    |  53.8% |     -8.9% |      -0.79 |     -1.36 |               48.4% |
| Q3       |   10 | 7-3    |  70.0% |     57.9% |      +9.70 |     +0.52 |               54.3% |
| Q4       |   13 | 6-7    |  46.2% |    -28.6% |      -9.24 |     +1.37 |               52.5% |
| Q5       |   13 | 7-6    |  53.8% |     -7.9% |      -3.28 |     +5.71 |               56.3% |

**Spearman ρ (quintile vs realized win%):** 0.000  ·  monotonicity `1/3`

## § 3 — Univariate Feature Analysis

The five L1-pruned features that compose AGS-U. For each feature we report the average value across all picks, the point-biserial correlation with WIN (closer to ±1 = more predictive), and ROI sorted by feature decile so you can see whether the feature is earning its slot.

| Feature           | Family         | N    | Mean   | SD     | Corr(WIN) | Top-decile ROI | Bot-decile ROI | Lift   |
|-------------------|----------------|------|--------|--------|-----------|----------------|----------------|--------|
| Δcount            | COUNT          |   59 |   0.25 |   1.16 |    +0.255 |          36.2% |              — |      — |
| ΔHCcount          | COUNT_HC       |   59 |   0.42 |   1.13 |    -0.022 |         -27.3% |         -15.2% | -12.1pp |
| ΔavgConviction    | INTENSITY      |   59 |  -0.17 |   0.83 |    +0.148 |           5.5% |          -8.7% | +14.2pp |
| ΔHCsizeRatio      | INTENSITY_HC   |   59 |   0.39 |   1.84 |    +0.071 |         -25.6% |           2.6% | -28.2pp |
| forShare          | DOMINANCE      |   59 |   0.01 |   0.77 |    +0.279 |          44.5% |              — |      — |

> **Corr(WIN)** = point-biserial correlation between feature value and binary WIN outcome.
> **Top/Bot-decile ROI** = ROI for the top/bottom 10% of picks by this feature value alone.
> **Lift** = top-decile ROI − bottom-decile ROI in percentage points. Positive lift = feature is earning its keep in the composite.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier? If HC adds value across the board, it's a candidate for re-promotion; if not, the composite is already capturing it.

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | —            | 4n 50.0% -9% | 4n 50.0% -10% | 8n 50.0% -9% |
| PREMIUM  | —            | 3n 66.7% +3% | 2n 50.0% -16% | 5n 60.0% -5% |
| LOCK     | 6n 50.0% -20% | 5n 60.0% +5% | 2n 0.0% -100% | 13n 46.2% -29% |
| LEAN     | 4n 75.0% +65% | 5n 80.0% +66% | 1n 0.0% -100% | 10n 70.0% +58% |
| WEAK     | 3n 66.7% +70% | 10n 50.0% -43% | —            | 13n 53.8% -9% |
| FADE     | —            | —            | —            | —            |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 4n 25.0% -56%  | 4n 75.0% +23%  | —              | 8n 50.0% -9%   |
| PREMIUM  | 3n 66.7% +12%  | 1n 0.0% -100%  | 1n 100.0% +89% | 5n 60.0% -5%   |
| LOCK     | 9n 44.4% -25%  | 2n 50.0% -19%  | 2n 50.0% -42%  | 13n 46.2% -29% |
| LEAN     | 8n 87.5% +79%  | 1n 0.0% -100%  | 1n 0.0% -100%  | 10n 70.0% +58% |
| WEAK     | 8n 50.0% -56%  | 5n 60.0% +73%  | —              | 13n 53.8% -9%  |
| FADE     | —              | —              | —              | 0n — —         |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 3n 100.0% +38% | —             | 4n 25.0% -48% | 1n 0.0% -100% | —             |
| PREMIUM  | 1n 0.0% -100% | 1n 0.0% -100% | 2n 100.0% +89% | 1n 100.0% +110% | —             |
| LOCK     | —             | 3n 66.7% +1%  | 8n 50.0% -21% | 2n 0.0% -100% | —             |
| LEAN     | —             | 3n 66.7% +30% | 5n 60.0% +57% | 2n 100.0% +120% | —             |
| WEAK     | —             | —             | 7n 57.1% +35% | 5n 40.0% -65% | 1n 100.0% +160% |
| FADE     | —             | —             | —             | —             | —             |

## § 5 — Calibration Reliability

Slice AGS-U into 6 bands and compare the AVERAGE IMPLIED PROBABILITY (from market odds at lock time) to the REALIZED win rate in each band. A well-calibrated system has realized ≈ implied + a constant edge. If realized > implied at the high end and ≤ implied at the low end, the ladder is genuinely sorting by edge (not just by favorite-status).

| AGS-U Band       | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| ≥ +3.5           |    8 |        50.0% |       56.7% |      -6.7pp |     -9.3% |
| +2.5 to 3.5      |    6 |        50.0% |       54.0% |      -4.0pp |    -19.1% |
| +1.5 to 2.5      |    4 |        50.0% |       52.5% |      -2.5pp |    -34.7% |
| +0.5 to 1.5      |   12 |        50.0% |       52.4% |      -2.4pp |     -6.8% |
| −0.5 to 0.5      |   10 |        60.0% |       52.1% |      +7.9pp |     29.9% |
| < −0.5           |    9 |        66.7% |       51.3% |     +15.4pp |     55.9% |

**Brier score (market-implied):** 0.2459 (lower = better; 0.25 = coin-flip prior).
**Edge correlation (realized vs implied):** Spearman ρ = -1.000 (positive = bands aligned with market expectation; high positive = AGS-U is largely re-stating the favorite signal).

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|---------|------------|--------|
| 2026-05-20 | NBA   | TOTAL  | Over 215.5              |  -110 |  1.65u |  +1.77 | LOCK    | Q4   |   +1 | WIN     |     +1.50u |  -2.3% |
| 2026-05-20 | MLB   | TOTAL  | Under 4.5               |  -121 |  0.75u |  +0.59 | LEAN    | Q3   |   +0 | LOSS    |     -0.75u |  +2.2% |
| 2026-05-20 | NBA   | SPREAD | Thunder                 |  -110 |  3.00u |  +7.21 | ELITE   | Q5   |   +1 | WIN     |     +2.73u |  +0.9% |
| 2026-05-20 | NHL   | ML     | Avalanche               |  -176 |  1.25u |  +0.44 | LEAN    | Q3   |   +1 | LOSS    |     -1.25u |  -2.6% |
| 2026-05-20 | NBA   | ML     | Thunder                 |  -238 |  5.00u | +22.20 | ELITE   | Q5   |   +5 | WIN     |     +2.10u |  +1.4% |
| 2026-05-20 | MLB   | ML     | San Francisco Giants    |  +100 |  2.50u |  +1.02 | LOCK    | Q4   |   +1 | LOSS    |     -2.50u |  +4.6% |
| 2026-05-20 | MLB   | ML     | Washington Nationals    |  +111 |  0.50u |  -1.68 | WEAK    | Q2   |   +1 | WIN     |     +0.56u |  +0.2% |
| 2026-05-20 | MLB   | ML     | Los Angeles Dodgers     |  -196 |  0.00u |  +0.42 | LEAN    | Q3   |   +0 | TRACKED |      0.00u |  +2.7% |
| 2026-05-20 | MLB   | ML     | Minnesota Twins         |  -140 |  1.25u |  +0.43 | LEAN    | Q3   |   +1 | WIN     |     +0.89u |  -0.2% |
| 2026-05-20 | MLB   | ML     | Seattle Mariners        |  -149 |  2.75u |  +0.93 | LOCK    | Q4   |   +0 | WIN     |     +1.85u |  -1.9% |
| 2026-05-20 | MLB   | ML     | Baltimore Orioles       |  +100 |  2.50u |  +3.83 | ELITE   | Q5   |   +1 | LOSS    |     -2.50u |  +3.3% |
| 2026-05-19 | NBA   | TOTAL  | Under 217.5             |  -113 |  3.00u |  +5.97 | ELITE   | Q5   |   +3 | LOSS    |     -3.00u |  -1.5% |
| 2026-05-19 | MLB   | TOTAL  | Under 10.5              |  -110 |  1.65u |  +1.01 | LOCK    | Q4   |   +0 | WIN     |     +1.50u |  +0.9% |
| 2026-05-19 | NBA   | SPREAD | Cavaliers               |  -108 |  2.25u |  +1.57 | LOCK    | Q4   |   +2 | LOSS    |     -2.25u |  +0.0% |
| 2026-05-19 | NBA   | ML     | Knicks                  |  -265 |  5.00u |  +5.38 | ELITE   | Q5   |   +3 | WIN     |     +1.89u |  -3.8% |
| 2026-05-19 | MLB   | ML     | Texas Rangers           |  -108 |  1.25u |  +0.47 | LEAN    | Q3   |   +1 | WIN     |     +1.16u |  -0.5% |
| 2026-05-19 | MLB   | ML     | Detroit Tigers          |  +138 |  2.50u |  -0.36 | WEAK    | Q2   |   +1 | LOSS    |     -2.50u |  -7.5% |
| 2026-05-19 | MLB   | ML     | Baltimore Orioles       |  -105 |  0.50u |  -2.51 | WEAK    | Q2   |   +0 | LOSS    |     -0.50u |  +3.1% |
| 2026-05-19 | MLB   | ML     | Miami Marlins           |  +115 |  2.50u |  +4.39 | ELITE   | Q5   |   +1 | LOSS    |     -2.50u |  -0.4% |
| 2026-05-18 | NHL   | TOTAL  | Under 5.5               |  -112 |  2.25u |  +3.08 | PREMIUM | Q5   |   +1 | WIN     |     +2.01u |  -3.1% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |    8 |       27.25 |      -2.53 |     -9.3% |      -0.32 |          -0.093 |
| PREMIUM  |    5 |       14.50 |      -0.75 |     -5.2% |      -0.15 |          -0.052 |
| LOCK     |   13 |       32.35 |      -9.24 |    -28.6% |      -0.71 |          -0.286 |
| LEAN     |   10 |       16.75 |      +9.70 |     57.9% |      +0.97 |          +0.579 |
| WEAK     |   13 |        8.85 |      -0.79 |     -8.9% |      -0.06 |          -0.089 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). We can validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working; if they win frequently, q20 is too aggressive.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **24** · Win rate: **54.2%** · Flat-1u PnL: **-1.70u** · ROI: **-7.1%**
- Verdict: 🚨 Mute floor may be too aggressive — SHADOWed picks win at ≥52%.

## § 9 — Daily Trend (cumulative PnL)

| Date       | Live | W-L   | Win %  | Daily PnL  | Cum PnL    | Cum Win % | Trk | Bar                  |
|------------|------|-------|--------|------------|------------|-----------|-----|----------------------|
| 2026-05-14 |    1 | 1-0   | 100.0% |      +1.71 |      +1.71 |    100.0% |   0 | █████                |
| 2026-05-15 |    7 | 4-3   |  57.1% |      -0.36 |      +1.35 |     62.5% |   2 | ████                 |
| 2026-05-16 |    6 | 4-2   |  66.7% |      +1.41 |      +2.76 |     64.3% |   3 | █████████            |
| 2026-05-17 |    9 | 5-4   |  55.6% |      -0.09 |      +2.67 |     60.9% |   2 | █████████            |
| 2026-05-18 |    8 | 4-4   |  50.0% |      -2.71 |      -0.04 |     58.1% |   2 |                      |
| 2026-05-19 |    8 | 3-5   |  37.5% |      -6.20 |      -6.24 |     53.8% |   0 | ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ |
| 2026-05-20 |   10 | 6-4   |  60.0% |      +2.63 |      -3.61 |     55.1% |   1 |         ▓▓▓▓▓▓▓▓▓▓▓▓ |

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.

> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |    10 | 🟡 informational only — true tracked plays |
| Live picks (not graded yet) with `finalUnits > 0`             |     3 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     0 | 🟢 every pick has an AGS-U |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Shipped picks with `provenWalletCount < 2`                    |     1 | 🚨 picks bypassed AGS_MIN_PROVEN_WALLETS gate |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-20T16:18:15.943Z
- **Source / version:** cron
- **Sample size:** 429
- **Date range:** 2026-04-18 → 2026-05-19

**AGS-U quintile boundaries (summed-z space):**

| Boundary | Value      |
|----------|------------|
| q20      |      -2.80 |
| q40      |      -0.05 |
| q50      |      +0.48 |
| q60      |      +0.81 |
| q80      |      +2.74 |
| q90      |      +3.70 |

**Feature normalizers (mean / sd):**

| Feature           | Mean   | SD     |
|-------------------|--------|--------|
| Δcount            |   1.43 |   1.57 |
| ΔHCcount          |   0.45 |   0.83 |
| ΔavgConviction    |   0.54 |   0.55 |
| ΔHCsizeRatio      |   1.52 |   5.19 |
| forShare          |   0.81 |   0.25 |

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified v9 monitoring. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*