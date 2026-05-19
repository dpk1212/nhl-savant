# AGS-Unified v9 — Daily Monitoring Report

**Generated:** Tuesday, May 19, 2026 at 11:58 AM ET
**AGS-U cutover:** 2026-05-14 · **Days live:** 5

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
| Yesterday  |      8 | 4-4 |  50.0% |    -12.6% |      -2.71 |    -0.12% |     2.69u |       -0.03 | 2 (0-2) |
| Last 3 days |     23 | 13-10 |  56.5% |     -2.9% |      -1.39 |    +0.22% |     2.07u |        0.54 | 7 (0-7) |
| Last 7 days |     31 | 18-13 |  58.1% |     -0.1% |      -0.04 |    +0.01% |     1.93u |        0.17 | 9 (1-8) |
| All-time   |     31 | 18-13 |  58.1% |     -0.1% |      -0.04 |    +0.01% |     1.93u |        0.17 | 9 (1-8) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U v9 is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |    2 | 1-1    |  50.0% |    -20.0% |      -1.25 |     +4.98 |     3.13u |
| PREMIUM  | q80–q90     | 1.50×   |    5 | 3-2    |  60.0% |     -5.2% |      -0.75 |     +3.05 |     2.90u |
| LOCK     | q60–q80     | 1.10×   |    8 | 3-5    |  37.5% |    -43.3% |      -9.34 |     +1.44 |     2.69u |
| LEAN     | q40–q60     | 0.50×   |    6 | 5-1    |  83.3% |     78.8% |      +9.65 |     +0.56 |     2.04u |
| WEAK     | q20–q40     | 0.20×   |   10 | 6-4    |  60.0% |     30.8% |      +1.65 |     -1.32 |     0.53u |
| FADE     | < q20       | 0.00×   |    0 | 0-0    |      — |         — |      +0.00 |     -4.26 |         — |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -4, fully inverted = 4):
- Win % across tiers: `0` 🟡 random — calibration unclear
- ROI across tiers:   `0` 🟡 sizing not amplifying edge

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|
| Q1       |    0 | 0-0    |      — |         — |      +0.00 |     -4.26 |               53.9% |
| Q2       |   10 | 6-4    |  60.0% |     30.8% |      +1.65 |     -1.32 |               48.6% |
| Q3       |    6 | 5-1    |  83.3% |     78.8% |      +9.65 |     +0.56 |               51.1% |
| Q4       |    8 | 3-5    |  37.5% |    -43.3% |      -9.34 |     +1.44 |               52.3% |
| Q5       |    7 | 4-3    |  57.1% |     -9.6% |      -2.00 |     +3.60 |               56.3% |

**Spearman ρ (quintile vs realized win%):** -0.600  ·  monotonicity `1/3`

## § 3 — Univariate Feature Analysis

The five L1-pruned features that compose AGS-U. For each feature we report the average value across all picks, the point-biserial correlation with WIN (closer to ±1 = more predictive), and ROI sorted by feature decile so you can see whether the feature is earning its slot.

| Feature           | Family         | N    | Mean   | SD     | Corr(WIN) | Top-decile ROI | Bot-decile ROI | Lift   |
|-------------------|----------------|------|--------|--------|-----------|----------------|----------------|--------|
| Δcount            | COUNT          |   40 |   0.08 |   0.96 |    +0.317 |          11.4% |              — |      — |
| ΔHCcount          | COUNT_HC       |   40 |   0.15 |   0.81 |    -0.032 |        -100.0% |         -15.2% | -84.8pp |
| ΔavgConviction    | INTENSITY      |   40 |  -0.15 |   0.84 |    +0.074 |          17.1% |         121.7% | -104.6pp |
| ΔHCsizeRatio      | INTENSITY_HC   |   40 |  -0.05 |   0.70 |    -0.114 |         -53.5% |         121.9% | -175.3pp |
| forShare          | DOMINANCE      |   40 |  -0.03 |   0.86 |    +0.271 |          72.4% |              — |      — |

> **Corr(WIN)** = point-biserial correlation between feature value and binary WIN outcome.
> **Top/Bot-decile ROI** = ROI for the top/bottom 10% of picks by this feature value alone.
> **Lift** = top-decile ROI − bottom-decile ROI in percentage points. Positive lift = feature is earning its keep in the composite.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier? If HC adds value across the board, it's a candidate for re-promotion; if not, the composite is already capturing it.

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | —            | 1n 100.0% +33% | 1n 0.0% -100% | 2n 50.0% -20% |
| PREMIUM  | —            | 3n 66.7% +3% | 2n 50.0% -16% | 5n 60.0% -5% |
| LOCK     | 4n 25.0% -70% | 3n 66.7% +20% | 1n 0.0% -100% | 8n 37.5% -43% |
| LEAN     | 3n 100.0% +88% | 2n 100.0% +92% | 1n 0.0% -100% | 6n 83.3% +79% |
| WEAK     | 2n 100.0% +110% | 8n 50.0% -22% | —            | 10n 60.0% +31% |
| FADE     | —            | —            | —            | —            |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 2n 50.0% -20%  | —              | —              | 2n 50.0% -20%  |
| PREMIUM  | 3n 66.7% +12%  | 1n 0.0% -100%  | 1n 100.0% +89% | 5n 60.0% -5%   |
| LOCK     | 6n 33.3% -44%  | —              | 2n 50.0% -42%  | 8n 37.5% -43%  |
| LEAN     | 5n 100.0% +90% | 1n 0.0% -100%  | —              | 6n 83.3% +79%  |
| WEAK     | 5n 60.0% -34%  | 5n 60.0% +73%  | —              | 10n 60.0% +31% |
| FADE     | —              | —              | —              | 0n — —         |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 1n 100.0% +33% | —             | 1n 0.0% -100% | —             | —             |
| PREMIUM  | 1n 0.0% -100% | 1n 0.0% -100% | 2n 100.0% +89% | 1n 100.0% +110% | —             |
| LOCK     | —             | 2n 50.0% -41% | 4n 50.0% -21% | 2n 0.0% -100% | —             |
| LEAN     | —             | 1n 100.0% +71% | 3n 66.7% +67% | 2n 100.0% +120% | —             |
| WEAK     | —             | —             | 6n 66.7% +55% | 3n 33.3% -67% | 1n 100.0% +160% |
| FADE     | —             | —             | —             | —             | —             |

## § 5 — Calibration Reliability

Slice AGS-U into 6 bands and compare the AVERAGE IMPLIED PROBABILITY (from market odds at lock time) to the REALIZED win rate in each band. A well-calibrated system has realized ≈ implied + a constant edge. If realized > implied at the high end and ≤ implied at the low end, the ladder is genuinely sorting by edge (not just by favorite-status).

| AGS-U Band       | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| ≥ +3.5           |    2 |        50.0% |       58.1% |      -8.1pp |    -20.0% |
| +2.5 to 3.5      |    6 |        50.0% |       54.0% |      -4.0pp |    -19.1% |
| +1.5 to 2.5      |    2 |        50.0% |       53.1% |      -3.1pp |    -42.5% |
| +0.5 to 1.5      |    8 |        50.0% |       52.0% |      -2.0pp |    -11.1% |
| −0.5 to 0.5      |    6 |        66.7% |       47.7% |     +19.0pp |     63.9% |
| < −0.5           |    7 |        71.4% |       51.8% |     +19.6pp |     68.8% |

**Brier score (market-implied):** 0.2581 (lower = better; 0.25 = coin-flip prior).
**Edge correlation (realized vs implied):** Spearman ρ = -0.943 (positive = bands aligned with market expectation; high positive = AGS-U is largely re-stating the favorite signal).

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|---------|------------|--------|
| 2026-05-18 | NHL   | TOTAL  | Under 5.5               |  -112 |  2.25u |  +3.08 | PREMIUM | Q5   |   +1 | WIN     |     +2.01u |  -3.1% |
| 2026-05-18 | NBA   | TOTAL  | Under 220.5             |  -110 |  0.00u |  -2.64 | WEAK    | Q2   |   +1 | TRACKED |      0.00u |  -2.3% |
| 2026-05-18 | NBA   | SPREAD | Thunder                 |  -110 |  0.30u |  -2.67 | WEAK    | Q2   |   +1 | LOSS    |     -0.30u |  +0.9% |
| 2026-05-18 | NHL   | ML     | NHL Playoffs: Who Will  |  -118 |  5.00u |  +1.96 | LOCK    | Q4   |   +2 | LOSS    |     -5.00u |  -0.2% |
| 2026-05-18 | NBA   | ML     | Thunder                 |  -235 |  3.75u |  +3.33 | PREMIUM | Q5   |   +2 | LOSS    |     -3.75u |  +1.9% |
| 2026-05-18 | MLB   | ML     | San Diego Padres        |  +130 |  1.25u |  +0.75 | LEAN    | Q3   |   +0 | WIN     |     +1.63u |  +2.3% |
| 2026-05-18 | MLB   | ML     | Detroit Tigers          |  -150 |  2.75u |  +0.90 | LOCK    | Q4   |   +0 | LOSS    |     -2.75u |  -1.5% |
| 2026-05-18 | MLB   | ML     | Philadelphia Phillies   |  -118 |  1.25u |  +0.71 | LEAN    | Q3   |   +0 | WIN     |     +1.06u |  -1.2% |
| 2026-05-18 | MLB   | ML     | Baltimore Orioles       |  +115 |  0.00u |  +1.13 | LOCK    | Q4   |   +0 | TRACKED |      0.00u |  +1.2% |
| 2026-05-18 | MLB   | ML     | Miami Marlins           |  -114 |  5.00u |  +0.24 | LEAN    | Q3   |   +1 | WIN     |     +4.39u |  +0.9% |
| 2026-05-17 | NBA   | TOTAL  | Under 205.5             |  -108 |  0.75u |  +0.71 | LEAN    | Q3   |   +3 | LOSS    |     -0.75u |  -2.4% |
| 2026-05-17 | MLB   | TOTAL  | Under 11.5              |  -110 |  0.30u |  -0.94 | WEAK    | Q2   |   +1 | WIN     |     +0.27u |  -3.8% |
| 2026-05-17 | MLB   | TOTAL  | Over 7.5                |  +103 |  2.50u |  +5.53 | ELITE   | Q5   |   +2 | LOSS    |     -2.50u |  +0.5% |
| 2026-05-17 | MLB   | TOTAL  | Over 8.5                |  -113 |  2.25u |  +3.06 | PREMIUM | Q5   |   +1 | WIN     |     +1.99u |  +1.5% |
| 2026-05-17 | NBA   | SPREAD | Pistons                 |  -102 |  0.00u |  -7.82 | FADE    | Q1   |   -1 | TRACKED |      0.00u |  -0.2% |
| 2026-05-17 | NBA   | ML     | Cavaliers               |  +160 |  0.50u |  -0.53 | WEAK    | Q2   |   +1 | WIN     |     +0.80u |  +0.0% |
| 2026-05-17 | MLB   | ML     | New York Mets           |  -110 |  2.75u |  +1.24 | LOCK    | Q4   |   +1 | WIN     |     +2.41u |  +2.8% |
| 2026-05-17 | MLB   | ML     | Milwaukee Brewers       |  -129 |  3.75u |  +2.99 | PREMIUM | Q5   |   +1 | LOSS    |     -3.75u |  +0.2% |
| 2026-05-17 | MLB   | ML     | Miami Marlins           |  +135 |  0.50u |  -0.21 | WEAK    | Q2   |   +1 | LOSS    |     -0.50u |  +2.4% |
| 2026-05-17 | MLB   | ML     | Los Angeles Angels      |  +125 |  0.00u |  -2.98 | FADE    | Q1   |   +0 | TRACKED |      0.00u |  -1.6% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |    2 |        6.25 |      -1.25 |    -20.0% |      -0.63 |          -0.200 |
| PREMIUM  |    5 |       14.50 |      -0.75 |     -5.2% |      -0.15 |          -0.052 |
| LOCK     |    8 |       21.55 |      -9.34 |    -43.3% |      -1.17 |          -0.433 |
| LEAN     |    6 |       12.25 |      +9.65 |     78.8% |      +1.61 |          +0.788 |
| WEAK     |   10 |        5.35 |      +1.65 |     30.8% |      +0.17 |          +0.308 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). We can validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working; if they win frequently, q20 is too aggressive.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **24** · Win rate: **54.2%** · Flat-1u PnL: **-1.70u** · ROI: **-7.1%**
- Verdict: 🚨 Mute floor may be too aggressive — SHADOWed picks win at ≥52%.

## § 9 — Daily Trend (cumulative PnL)

| Date       | Live | W-L   | Win %  | Daily PnL  | Cum PnL    | Cum Win % | Trk | Bar                  |
|------------|------|-------|--------|------------|------------|-----------|-----|----------------------|
| 2026-05-14 |    1 | 1-0   | 100.0% |      +1.71 |      +1.71 |    100.0% |   0 | ████████████         |
| 2026-05-15 |    7 | 4-3   |  57.1% |      -0.36 |      +1.35 |     62.5% |   2 | ██████████           |
| 2026-05-16 |    6 | 4-2   |  66.7% |      +1.41 |      +2.76 |     64.3% |   3 | ████████████████████ |
| 2026-05-17 |    9 | 5-4   |  55.6% |      -0.09 |      +2.67 |     60.9% |   2 | ███████████████████  |
| 2026-05-18 |    8 | 4-4   |  50.0% |      -2.71 |      -0.04 |     58.1% |   2 |                      |

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.

> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |     9 | 🟡 informational only — true tracked plays |
| Live picks (not graded yet) with `finalUnits > 0`             |     6 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     0 | 🟢 every pick has an AGS-U |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Shipped picks with `provenWalletCount < 2`                    |     1 | 🚨 picks bypassed AGS_MIN_PROVEN_WALLETS gate |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-18T16:12:58.503Z
- **Source / version:** cron
- **Sample size:** 395
- **Date range:** 2026-04-18 → 2026-05-17

**AGS-U quintile boundaries (summed-z space):**

| Boundary | Value      |
|----------|------------|
| q20      |      -2.94 |
| q40      |      -0.05 |
| q50      |      +0.47 |
| q60      |      +0.82 |
| q80      |      +2.75 |
| q90      |      +3.61 |

**Feature normalizers (mean / sd):**

| Feature           | Mean   | SD     |
|-------------------|--------|--------|
| Δcount            |   1.43 |   1.58 |
| ΔHCcount          |   0.45 |   0.82 |
| ΔavgConviction    |   0.53 |   0.55 |
| ΔHCsizeRatio      |   1.50 |   5.25 |
| forShare          |   0.81 |   0.25 |

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified v9 monitoring. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*