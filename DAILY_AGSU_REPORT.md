# AGS-Unified v9 — Daily Monitoring Report

**Generated:** Monday, May 18, 2026 at 12:04 PM ET
**AGS-U cutover:** 2026-05-14 · **Days live:** 4

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
| Yesterday  |      9 | 5-4 |  55.6% |     -0.6% |      -0.09 |    -0.16% |     1.78u |        0.30 | 2 (0-2) |
| Last 3 days |     22 | 13-9 |  59.1% |      2.7% |      +0.96 |    +0.26% |     1.62u |        0.10 | 7 (1-6) |
| Last 7 days |     23 | 14-9 |  60.9% |      7.0% |      +2.67 |    +0.06% |     1.67u |        0.20 | 7 (1-6) |
| All-time   |     23 | 14-9 |  60.9% |      7.0% |      +2.67 |    +0.06% |     1.67u |        0.20 | 7 (1-6) |

> **Live N / W-L / ROI / PnL** match the dashboard exactly — tracked (FADE, 0u) picks are excluded. **Tracked** column = FADE-tier picks graded for back-testing only. **Sharpe-like** = per-pick mean unit return ÷ sd × √N.

## § 1 — AGS-U Tier Calibration

The whole point of AGS-U v9 is that higher tiers should win at higher rates AND earn higher ROI. If ELITE → PREMIUM → LOCK → LEAN → WEAK is **monotonically decreasing** in both win% and ROI, the ladder is working. If not, the calibration is broken and the sizing multipliers are amplifying noise.

### All-time tier breakdown

| Tier     | Band        | Ladder | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Avg Stake |
|----------|-------------|--------|------|--------|--------|-----------|------------|-----------|-----------|
| ELITE    | ≥ q90       | 2.00×   |    2 | 1-1    |  50.0% |    -20.0% |      -1.25 |     +4.98 |     3.13u |
| PREMIUM  | q80–q90     | 1.50×   |    3 | 2-1    |  66.7% |     11.6% |      +0.99 |     +2.95 |     2.83u |
| LOCK     | q60–q80     | 1.10×   |    6 | 3-3    |  50.0% |    -11.5% |      -1.59 |     +1.49 |     2.30u |
| LEAN     | q40–q60     | 0.50×   |    3 | 2-1    |  66.7% |     54.1% |      +2.57 |     +0.55 |     1.58u |
| WEAK     | q20–q40     | 0.20×   |    9 | 6-3    |  66.7% |     38.6% |      +1.95 |     -1.05 |     0.56u |
| FADE     | < q20       | 0.00×   |    0 | 0-0    |      — |         — |      +0.00 |     -4.26 |         — |

**Monotonicity score** (n−1 max, fully ordered ELITE→FADE = -4, fully inverted = 4):
- Win % across tiers: `1` 🚨 inverted — higher tiers winning LESS than lower
- ROI across tiers:   `0` 🟡 sizing not amplifying edge

## § 2 — AGS-U Quintile Calibration

Quintile bucketing of raw AGS-U values (Q5 = highest AGS-U). Independent check on §1 — quintile assignment is the upstream lever, tier mapping is downstream. If quintiles look monotonic but tiers don't, the tier→multiplier mapping is the bug.

| Quintile | N    | W-L    | Win %  | ROI       | PnL (u)    | Avg AGS-U | Implied (from odds) |
|----------|------|--------|--------|-----------|------------|-----------|---------------------|
| Q1       |    0 | 0-0    |      — |         — |      +0.00 |     -4.26 |               53.9% |
| Q2       |    9 | 6-3    |  66.7% |     38.6% |      +1.95 |     -1.05 |               47.8% |
| Q3       |    3 | 2-1    |  66.7% |     54.1% |      +2.57 |     +0.55 |               52.2% |
| Q4       |    6 | 3-3    |  50.0% |    -11.5% |      -1.59 |     +1.49 |               52.0% |
| Q5       |    5 | 3-2    |  60.0% |     -1.8% |      -0.26 |     +3.76 |               54.3% |

**Spearman ρ (quintile vs realized win%):** -0.600  ·  monotonicity `0/3`

## § 3 — Univariate Feature Analysis

The five L1-pruned features that compose AGS-U. For each feature we report the average value across all picks, the point-biserial correlation with WIN (closer to ±1 = more predictive), and ROI sorted by feature decile so you can see whether the feature is earning its slot.

| Feature           | Family         | N    | Mean   | SD     | Corr(WIN) | Top-decile ROI | Bot-decile ROI | Lift   |
|-------------------|----------------|------|--------|--------|-----------|----------------|----------------|--------|
| Δcount            | COUNT          |   30 |   0.05 |   1.02 |    +0.311 |          93.6% |              — |      — |
| ΔHCcount          | COUNT_HC       |   30 |   0.11 |   0.75 |    +0.053 |         -83.9% |         113.3% | -197.3pp |
| ΔavgConviction    | INTENSITY      |   30 |  -0.20 |   0.89 |    +0.043 |          17.1% |         150.0% | -132.9pp |
| ΔHCsizeRatio      | INTENSITY_HC   |   30 |  -0.12 |   0.70 |    -0.050 |         -28.6% |         150.0% | -178.6pp |
| forShare          | DOMINANCE      |   30 |  -0.06 |   0.89 |    +0.227 |           8.7% |              — |      — |

> **Corr(WIN)** = point-biserial correlation between feature value and binary WIN outcome.
> **Top/Bot-decile ROI** = ROI for the top/bottom 10% of picks by this feature value alone.
> **Lift** = top-decile ROI − bottom-decile ROI in percentage points. Positive lift = feature is earning its keep in the composite.

## § 4 — Multivariate Cross-Tabs

AGS-U is the composite, but HC margin is a single-feature signal we still track independently. Does HC margin add or subtract value WITHIN each tier? If HC adds value across the board, it's a candidate for re-promotion; if not, the composite is already capturing it.

### Tier × HC margin

| Tier     | HC ≤ 0       | HC = +1      | HC ≥ +2      | All          |
|----------|--------------|--------------|--------------|--------------|
| ELITE    | —            | 1n 100.0% +33% | 1n 0.0% -100% | 2n 50.0% -20% |
| PREMIUM  | —            | 2n 50.0% -29% | 1n 100.0% +110% | 3n 66.7% +12% |
| LOCK     | 3n 33.3% -55% | 3n 66.7% +20% | —            | 6n 50.0% -12% |
| LEAN     | 1n 100.0% +71% | 1n 100.0% +110% | 1n 0.0% -100% | 3n 66.7% +54% |
| WEAK     | 2n 100.0% +110% | 7n 57.1% -14% | —            | 9n 66.7% +39% |
| FADE     | —            | —            | —            | —            |

### Tier × Sport (all-time)

| Tier     | MLB            | NBA            | NHL            | All          |
|----------|----------------|----------------|----------------|--------------|
| ELITE    | 2n 50.0% -20%  | —              | —              | 2n 50.0% -20%  |
| PREMIUM  | 3n 66.7% +12%  | —              | —              | 3n 66.7% +12%  |
| LOCK     | 5n 40.0% -30%  | —              | 1n 100.0% +62% | 6n 50.0% -12%  |
| LEAN     | 2n 100.0% +83% | 1n 0.0% -100%  | —              | 3n 66.7% +54%  |
| WEAK     | 5n 60.0% -34%  | 4n 75.0% +91%  | —              | 9n 66.7% +39%  |
| FADE     | —              | —              | —              | 0n — —         |

### Tier × Odds Band (all-time)

| Tier     | HEAVY_FAV     | MOD_FAV       | PICK_EM       | MOD_DOG       | LONG_DOG      |
|----------|---------------|---------------|---------------|---------------|---------------|
| ELITE    | 1n 100.0% +33% | —             | 1n 0.0% -100% | —             | —             |
| PREMIUM  | —             | 1n 0.0% -100% | 1n 100.0% +88% | 1n 100.0% +110% | —             |
| LOCK     | —             | 1n 100.0% +57% | 3n 66.7% +35% | 2n 0.0% -100% | —             |
| LEAN     | —             | 1n 100.0% +71% | 1n 0.0% -100% | 1n 100.0% +110% | —             |
| WEAK     | —             | —             | 5n 80.0% +70% | 3n 33.3% -67% | 1n 100.0% +160% |
| FADE     | —             | —             | —             | —             | —             |

## § 5 — Calibration Reliability

Slice AGS-U into 6 bands and compare the AVERAGE IMPLIED PROBABILITY (from market odds at lock time) to the REALIZED win rate in each band. A well-calibrated system has realized ≈ implied + a constant edge. If realized > implied at the high end and ≤ implied at the low end, the ladder is genuinely sorting by edge (not just by favorite-status).

| AGS-U Band       | N    | Realized Win | Implied Win | Edge (R−I)  | ROI       |
|------------------|------|--------------|-------------|-------------|-----------|
| ≥ +3.5           |    2 |        50.0% |       58.1% |      -8.1pp |    -20.0% |
| +2.5 to 3.5      |    4 |        50.0% |       50.2% |      -0.2pp |    -13.7% |
| +1.5 to 2.5      |    1 |       100.0% |       53.3% |     +46.7pp |     62.2% |
| +0.5 to 1.5      |    5 |        40.0% |       53.1% |     -13.1pp |    -16.7% |
| −0.5 to 0.5      |    5 |        60.0% |       46.7% |     +13.3pp |     42.2% |
| < −0.5           |    6 |        83.3% |       51.7% |     +31.6pp |     83.1% |

**Brier score (market-implied):** 0.2480 (lower = better; 0.25 = coin-flip prior).
**Edge correlation (realized vs implied):** Spearman ρ = -0.143 (positive = bands aligned with market expectation; high positive = AGS-U is largely re-stating the favorite signal).

## § 6 — Recent Picks (Last 20)

Most-recent graded AGS-U picks. Use this to spot anomalies (high-AGS losers, low-AGS winners, sizing surprises).

| Date       | Sport | Mkt    | Team / Side             | Odds  | Stake  | AGS-U  | Tier    | Quint | HCm  | Outcome | PnL (u)    | CLV    |
|------------|-------|--------|-------------------------|-------|--------|--------|---------|-------|------|---------|------------|--------|
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
| 2026-05-17 | MLB   | ML     | Arizona Diamondbacks    |  -142 |  2.75u |  +0.45 | LEAN    | Q3   |   +0 | WIN     |     +1.94u |  -1.2% |
| 2026-05-16 | MLB   | TOTAL  | Over 8.5                |  -110 |  1.65u |  +0.81 | LOCK    | Q4   |   +0 | LOSS    |     -1.65u |  -2.6% |
| 2026-05-16 | MLB   | SPREAD | Boston Red Sox          |  -175 |  1.65u |  +0.84 | LOCK    | Q4   |   +0 | WIN     |     +0.94u |  +3.8% |
| 2026-05-16 | NHL   | ML     | Canadiens               |  -178 |  0.00u |  -3.09 | FADE    | Q1   |   +0 | TRACKED |      0.00u |  +1.4% |
| 2026-05-16 | MLB   | ML     | Toronto Blue Jays       |  -102 |  0.50u |  -1.64 | WEAK    | Q2   |   +0 | WIN     |     +0.49u |  -0.2% |
| 2026-05-16 | MLB   | ML     | Texas Rangers           |  -146 |  0.00u |  -3.96 | FADE    | Q1   |   +1 | TRACKED |      0.00u |  +0.0% |
| 2026-05-16 | MLB   | ML     | New York Mets           |  +110 |  2.50u |  +2.80 | PREMIUM | Q5   |   +2 | WIN     |     +2.75u |  +2.0% |
| 2026-05-16 | MLB   | ML     | Minnesota Twins         |  +110 |  2.50u |  +2.58 | LOCK    | Q4   |   +1 | LOSS    |     -2.50u |  +0.2% |
| 2026-05-16 | MLB   | ML     | Chicago Cubs            |  -105 |  0.00u |  -3.35 | FADE    | Q1   |   +0 | TRACKED |      0.00u |  +0.5% |
| 2026-05-16 | MLB   | ML     | Boston Red Sox          |  +110 |  1.25u |  +0.50 | LEAN    | Q3   |   +1 | WIN     |     +1.38u |  +4.4% |

## § 7 — Sizing Audit

Does the AGS-U sizing ladder (ELITE 2× → WEAK 0.2×) actually capture more edge per unit at the top? If the per-stake ROI is FLAT across tiers, we're just risking more on the same edge — and a flat-stake strategy would beat the laddered one.

| Tier     | N    | Total Stake | PnL (u)    | ROI %     | PnL / pick | Per-unit Return |
|----------|------|-------------|------------|-----------|------------|-----------------|
| ELITE    |    2 |        6.25 |      -1.25 |    -20.0% |      -0.63 |          -0.200 |
| PREMIUM  |    3 |        8.50 |      +0.99 |     11.6% |      +0.33 |          +0.116 |
| LOCK     |    6 |       13.80 |      -1.59 |    -11.5% |      -0.26 |          -0.115 |
| LEAN     |    3 |        4.75 |      +2.57 |     54.1% |      +0.86 |          +0.541 |
| WEAK     |    9 |        5.05 |      +1.95 |     38.6% |      +0.22 |          +0.386 |

> If **Per-unit Return** is materially higher for ELITE than for WEAK/LEAN, the ladder is justified. If they're within ~5%, the ladder is risking more capital for the same return per dollar.

## § 8 — SHADOW / Hard-Mute Validation

Below-q20 AGS-U values are SHADOWed (never shipped). We can validate the floor by looking at sides that WOULD HAVE GRADED if shipped — if they lose at >50%, the mute is working; if they win frequently, q20 is too aggressive.

**Below-q20 SHADOWed picks that would have graded at a flat 1u stake:**

- N: **23** · Win rate: **56.5%** · Flat-1u PnL: **-0.70u** · ROI: **-3.0%**
- Verdict: 🚨 Mute floor may be too aggressive — SHADOWed picks win at ≥52%.

## § 9 — Daily Trend (cumulative PnL)

| Date       | Live | W-L   | Win %  | Daily PnL  | Cum PnL    | Cum Win % | Trk | Bar                  |
|------------|------|-------|--------|------------|------------|-----------|-----|----------------------|
| 2026-05-14 |    1 | 1-0   | 100.0% |      +1.71 |      +1.71 |    100.0% |   0 | ████████████         |
| 2026-05-15 |    7 | 4-3   |  57.1% |      -0.36 |      +1.35 |     62.5% |   2 | ██████████           |
| 2026-05-16 |    6 | 4-2   |  66.7% |      +1.41 |      +2.76 |     64.3% |   3 | ████████████████████ |
| 2026-05-17 |    9 | 5-4   |  55.6% |      -0.09 |      +2.67 |     60.9% |   2 | ███████████████████  |

> **Live** = picks AGS-U shipped with units > 0 (matches dashboard). **Trk** = same-day FADE picks (0u, back-test only). Daily PnL and Win % cover Live picks only.

> Bar length is proportional to absolute cumulative PnL. `█` = positive, `▓` = negative.

## § 10 — Operational Health

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |     6 | 🟡 informational only — true tracked plays |
| Live picks (not graded yet) with `finalUnits > 0`             |     8 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |     0 | 🟢 every pick has an AGS-U |
| AGS-U promoted picks missing `agsTier`                        |     0 | 🟢 every pick has a tier |
| Shipped picks with `provenWalletCount < 2`                    |     1 | 🚨 picks bypassed AGS_MIN_PROVEN_WALLETS gate |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

## § 11 — Calibration Snapshot

Live calibration document used by both the cron and the UI:

- **Computed at:** 2026-05-17T14:11:01.426Z
- **Source / version:** cron
- **Sample size:** 370
- **Date range:** 2026-04-18 → 2026-05-16

**AGS-U quintile boundaries (summed-z space):**

| Boundary | Value      |
|----------|------------|
| q20      |      -2.77 |
| q40      |      -0.10 |
| q50      |      +0.48 |
| q60      |      +0.77 |
| q80      |      +2.67 |
| q90      |      +3.62 |

**Feature normalizers (mean / sd):**

| Feature           | Mean   | SD     |
|-------------------|--------|--------|
| Δcount            |   1.46 |   1.60 |
| ΔHCcount          |   0.46 |   0.82 |
| ΔavgConviction    |   0.54 |   0.56 |
| ΔHCsizeRatio      |   1.56 |   5.35 |
| forShare          |   0.81 |   0.25 |

---

*Report generated by `scripts/dailyAgsUReport.js` — single source of truth for AGS-Unified v9 monitoring. Triggered daily by `.github/workflows/daily-agsu-report.yml` at 8:30am ET; can also be run manually via the Actions tab "Run workflow" button.*