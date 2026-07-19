# AGS-Unified — V12 Daily Monitor

**Generated:** Sunday, July 19, 2026 at 10:02 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (49 days) · **Tape / side-profile era:** 2026-07-15+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (49 days ago), V12 has evaluated **1406** picks, shipped **454** for real money (32.3% ship rate), and muted the other **952**. On the shipped picks V12 has gone **249-205** (54.8% win), staked **1265.75u**, and returned **+43.67u** at **+3.5% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             49 |
| Picks V12 has evaluated             |                           1406 |
| Picks SHIPPED (units > 0)           |                            454 |
| Picks MUTED (score ≤ 0, FADE)       |                            952 |
| Ship rate                           |                          32.3% |
| Live W-L                            |                        249-205 |
| Live Win %                          |                          54.8% |
| Live PnL (units)                    |                         +43.67 |
| Live ROI                            |                          +3.5% |
| Avg PnL / day                       |                         +0.89u |
| Most recent action (2026-07-19)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **3.5% ROI** across 454 live picks (+43.67u real PnL).
- Mute rule is **saving money** — the 584 muted picks would have lost -52.09u at flat 1u (-8.9% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+0.89u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **13-12** · -3.3% ROI · -2.94u on 25 graded — see § 5.

## § 2 — Live Stack (how picks size today)

V12 still **scores** a side as a wallet-quality differential (`forMean` vs `agMean` → score in [-1, +1]). Score ≤ 0 → FADE (0u). What changed is **how positive-score sides get sized**:

| Step | What runs | Units |
|------|-----------|-------|
| A | HC-margin path | SUPER 6u · TOP 4u · MINI 3u · CONFIRMED 1u |
| B | RANK rescue (muted + 2-for-0 whitelist) | 4u |
| C | SHARP / SHARP-PRIME proven-$ rescue (+ MINI- cut) | 3–4u |
| D | DISSENT mute rescue (MLB contribMargin≤0) | 1u |
| E | fadeTop≥60 mute only (EDGE size/rescue **frozen**) | — |
| TAPE | From **2026-07-15**: mute tape&lt;0 · hold mid · boost ≥2.89 ×1.35 | path units |

**Stamps we keep for analysis (every shipped side):** depth (`#F/#A`, proven, V12 counts) + quality (ForWR, ForCLV, EDGE, Tape). Unopposed sides still get FOR numbers (EDGE uses AG prior 50). Compare WIN vs LOSS in § 5.

Odds cap still clamps long dogs (+100 / +151 / +200 → max 2.5 / 1.5 / 1.0u). Legacy ELITE→WEAK score-ladder units are **not** the live sizer — ignore them if you see them in old notes.

## § 3 — Daily Scoreboard

**Full book:** 49d · 454 live · 249-205 · **+43.67u** · +3.5% ROI · +0.89u/day.

_Prior to table (2026-06-01 → 2026-06-27): 288 live · 158-130 · +29.47u · cum through prior = +29.47u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-06-28 |        41 |    9 |    18 | 5-4        |  55.6% |     30.00 |      -4.20 |    -14.0% |     +25.27 |
| 2026-06-29 |        36 |    5 |    16 | 4-1        |  80.0% |     20.00 |      +7.40 |     37.0% |     +32.67 |
| 2026-06-30 |        48 |   17 |    14 | 12-5       |  70.6% |     56.00 |     +17.10 |     30.5% |     +49.77 |
| 2026-07-01 |        41 |   12 |    15 | 5-7        |  41.7% |     40.50 |     -11.56 |    -28.5% |     +38.21 |
| 2026-07-02 |        40 |   11 |    13 | 5-6        |  45.5% |     38.50 |      -6.89 |    -17.9% |     +31.32 |
| 2026-07-03 |        31 |   12 |    11 | 8-4        |  66.7% |     46.50 |     +16.11 |     34.6% |     +47.43 |
| 2026-07-04 |        36 |   12 |    12 | 8-4        |  66.7% |     49.50 |      +6.34 |     12.8% |     +53.77 |
| 2026-07-05 |        26 |   12 |     9 | 6-6        |  50.0% |     37.00 |      +0.44 |      1.2% |     +54.21 |
| 2026-07-06 |        26 |    7 |     9 | 4-3        |  57.1% |     20.50 |      +5.67 |     27.7% |     +59.88 |
| 2026-07-07 |        38 |   10 |    18 | 4-6        |  40.0% |     30.50 |     -11.21 |    -36.8% |     +48.67 |
| 2026-07-08 |        37 |    8 |    11 | 6-2        |  75.0% |     24.50 |     +12.97 |     52.9% |     +61.64 |
| 2026-07-09 |        25 |    7 |    11 | 5-2        |  71.4% |     25.00 |      +7.44 |     29.8% |     +69.08 |
| 2026-07-10 |        37 |    8 |    16 | 5-3        |  62.5% |     34.00 |      +4.96 |     14.6% |     +74.04 |
| 2026-07-11 |        23 |    5 |    10 | 0-5        |   0.0% |     18.00 |     -18.00 |   -100.0% |     +56.04 |
| 2026-07-12 |        29 |    5 |    16 | 1-4        |  20.0% |     13.50 |      -8.43 |    -62.4% |     +47.61 |
| 2026-07-14 |         3 |    1 |     0 | 0-1        |   0.0% |      1.00 |      -1.00 |   -100.0% |     +46.61 |
| 2026-07-15 |         5 |    1 |     1 | 1-0        | 100.0% |      2.50 |      +3.40 |    136.0% |     +50.01 |
| 2026-07-16 |         8 |    1 |     4 | 0-1        |   0.0% |      5.40 |      -5.40 |   -100.0% |     +44.61 |
| 2026-07-17 |        26 |   10 |    13 | 5-5        |  50.0% |     35.90 |      -4.93 |    -13.7% |     +39.68 |
| 2026-07-18 |        41 |   13 |    20 | 7-6        |  53.8% |     45.70 |      +3.99 |      8.7% |     +43.67 |
| 2026-07-19 |        14 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +43.67 |

> **Trajectory.** 🟡 Last 3 days (-1.2% ROI) **-4.9pp** vs prior (3.8%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-07-18**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 13 | 10-3 | +45.3% | +27.88u | +2.14u | +68.6% |
| 🟢 2 | MINI- (gate-cut) | C | 10 | 7-3 | +27.3% | +2.73u | +0.27u | — |
| 🟢 3 | RANK 2-for-0 rescue | B | 39 | 24-15 | +13.7% | +21.30u | +0.55u | -24.9% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP rescue | C | 28 | 11-17 | -22.4% | -16.15u | -0.58u | -100.0% |
| 🔴 3 | SHARP-PRIME rescue | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | -100.0% |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 6 | 4-2 | +21.7% | +6.40u | sized UP after path |
| 2 | Tape FAIL_OPEN (missing) | 9 | 5-4 | -17.5% | -5.33u | no tape score → path size |
| 🔴 worst | Tape HOLD (mid) | 9 | 3-6 | -27.4% | -7.41u | kept path units |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Score FADE (≤0 → 0u) | 424 | 205-219 | -4.3% | -18.12u | 🟢 saving $ |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 13 | 10-3 | 76.9% | 61.5u | +27.88u | +45.3% | +2.14u | 2 | +68.6% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 53 | 33-20 | 62.3% | 199.6u | +16.76u | +8.4% | +0.32u | 16 | -18.6% | +3.10u | 🔻 cooling |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 39 | 24-15 | 61.5% | 155.4u | +21.30u | +13.7% | +0.55u | 3 | -24.9% | +4.66u | 🔻 cooling |
| SHARP-PRIME rescue | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 1 | -100.0% | — | 🟠 watch |
| SHARP rescue | `SHARP` | C | 3u | 28 | 11-17 | 39.3% | 72.0u | -16.15u | -22.4% | -0.58u | 5 | -100.0% | -7.50u | 🔻 cooling |
| MINI (gate-pass) | `MINI` | A | 3u | 42 | 22-20 | 52.4% | 122.0u | -6.53u | -5.4% | -0.16u | 7 | +10.5% | +4.73u | 🟡 flat |
| MINI- (gate-cut) | `MINI-` | C | 1u | 10 | 7-3 | 70.0% | 10.0u | +2.73u | +27.3% | +0.27u | 0 | — | — | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 2 | 0-2 | 0.0% | 2.0u | -2.00u | -100.0% | -1.00u | 2 | -100.0% | -1.00u | thin |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 6 | 4-2 | 66.7% | 29.5u | +6.40u | +21.7% | 6 | +21.7% | +13.65u |
| Tape HOLD (mid) | TAPE | staked | 9 | 3-6 | 33.3% | 27.0u | -7.41u | -27.4% | 9 | -27.4% | -8.48u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 9 | 5-4 | 55.6% | 30.5u | -5.33u | -17.5% | 9 | -17.5% | -1.18u |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 2 | 2-0 | 100.0% | 2.0u | +1.36u | +68.1% | 2 | +68.1% | +1.36u |
| fadeTop≥60 MUTE | E | CF 1u | 1 | 0-1 | 0.0% | 1.0u | -1.00u | -100.0% | 1 | -100.0% | -1.00u |
| Score FADE (≤0 → 0u) | score | CF 1u | 424 | 205-219 | 48.3% | 424.0u | -18.12u | -4.3% | 36 | +27.2% | +3.66u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| TOP | 5 / -26% | 5 / +7% | 4 / -16% |
| RANK | — | 1 / +86% | — |
| SHARP | 2 / -100% | — | 1 / -100% |
| MINI | 1 / +97% | — | 4 / +1% |
| DISSENT | 1 / -100% | — | — |

### (D) Last graded day movers (2026-07-18)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| MINI (gate-pass) | 3 | 3-0 | +4.73u | +52.6% |
| RANK 2-for-0 rescue | 1 | 1-0 | +4.66u | +86.3% |
| HC-1 TOP | 5 | 3-2 | +3.10u | +13.6% |
| DISSENT rescue | 1 | 0-1 | -1.00u | -100.0% |
| SHARP rescue | 3 | 0-3 | -7.50u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| TOP PICK (TOP+/TOP)       |  4-5u |  83 | 48-34  |  58.5% |      332.10 |      +4.82 |      1.5% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/WINNER) |  3-6u |  81 | 41-40  |  50.6% |      276.40 |      -1.46 |     -0.5% |
| STRONG (MINI)             |    3u |  43 | 22-20  |  52.4% |      122.00 |      -6.53 |     -5.4% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  18 | 9-8    |  52.9% |       17.00 |      -1.29 |     -7.6% |
| **STAKED TOTAL** |     — | 235 | 130-105 |  55.3% |      809.00 |     +23.42 |     +2.9% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u |  54 | 33-20  |  62.3% |      199.60 |     +16.76 |      8.4% |
| B · 2-for-0 rescue    | RANK        |    4u |  39 | 24-15  |  61.5% |      155.40 |     +21.30 |     13.7% |
| C · proven-$ prime    | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · proven-$ consensus | SHARP       |    3u |  28 | 11-17  |  39.3% |       72.00 |     -16.15 |    -22.4% |
| A · mini-HC (gate-pass) | MINI        |    3u |  43 | 22-20  |  52.4% |      122.00 |      -6.53 |     -5.4% |
| C · mini gate-cut     | MINI-       |    1u |  10 | 7-3    |  70.0% |       10.00 |      +2.73 |     27.3% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |   2 | 0-2    |   0.0% |        2.00 |      -2.00 |   -100.0% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 348 picks tracked at 0u (would-be 162-186, 46.6% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (10-3, +27.88u)  ·  🟢 TOP PICK (49-34, +4.82u)  ·  🟠 SHARP PLAY (41-40, -1.46u)  ·  🔴 STRONG (23-20, -6.53u)  ·  🟣 LEAN (9-9, -1.29u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18"]
    y-axis "PnL (u)" -14 --> 31
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -1.29]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 50]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `1.5·(EDGE/10) + 2·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 94 | 89 | 71 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 2 | 2-0 | 100.0% | 0.00u | +0.00u | — |
| HOLD      | 10 | 3-7 | 30.0% | 30.00u | -10.41u | -34.7% |
| BOOST     | 6 | 4-2 | 66.7% | 29.50u | +6.40u | +21.7% |
| FAIL_OPEN | 9 | 5-4 | 55.6% | 30.50u | -5.33u | -17.5% |
| PASS      | 44 | 23-21 | 52.3% | 0.00u | +0.00u | — |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 16 | 10-6 | 62.5% | -4.00u |
| hold (0–2.89) | path u | 26 | 11-15 | 42.3% | -4.91u |
| boost (≥2.89) | ×1.35 | 12 | 6-6 | 50.0% | +0.75u |

_Score coverage: **54/71** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 2 | +4.75u | -4.75u | +0.00u | +4.75u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 6 | +5.66u | +6.40u | +0.74u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-07-19 | MLB | Pittsburgh Pirates | MINI- | 3.21 | BOOST | 1.00u | 1.35u | — |
| 2026-07-18 | MLB | Milwaukee Brewers | HC-1 | 4.60 | BOOST | 4.00u | 5.40u | WIN |
| 2026-07-18 | MLB | Chicago Cubs | MINI | -1.35 | MUTE | 3.00u | 0.00u | WIN |
| 2026-07-18 | MLB | Seattle Mariners | HC-1 | -0.11 | MUTE | 4.00u | 0.00u | WIN |
| 2026-07-18 | MLB | Arizona Diamondbacks | 2-for-0 | 3.88 | BOOST | 4.00u | 5.40u | WIN |
| 2026-07-18 | MLB | Under 9.5 | HC-1 | 3.82 | BOOST | 4.00u | 5.40u | WIN |
| 2026-07-17 | MLB | San Diego Padres | HC-1 | 3.55 | BOOST | 4.00u | 5.40u | LOSS |
| 2026-07-17 | MLB | Washington Nationals | HC-1 | 3.55 | BOOST | 2.50u | 2.50u | WIN |
| 2026-07-16 | MLB | Philadelphia Phillies | HC-1 | 4.06 | BOOST | 4.00u | 5.40u | LOSS |

### 5b — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 25 | 13-12 | 52.0% | 89.50u | -2.94u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 25/25 | 1.92 | 2.75 | -0.83 | 2.00 | 2.00 |
| depth   | #A sharps        | 25/25 | 1.23 | 2.17 | -0.94 | 1.00 | 1.50 |
| depth   | #F − #A          | 25/25 | 0.69 | 0.58 | +0.11 | 1.00 | 1.00 |
| depth   | proven F         | 25/25 | 1.38 | 1.42 | -0.03 | 1.00 | 1.00 |
| depth   | proven A         | 25/25 | 0.15 | 0.67 | -0.51 | 0.00 | 0.00 |
| depth   | proven F−A       | 25/25 | 1.23 | 0.75 | +0.48 | 1.00 | 1.00 |
| depth   | v12 F count      | 25/25 | 1.69 | 2.67 | -0.97 | 2.00 | 2.00 |
| depth   | v12 A count      | 25/25 | 1.08 | 1.83 | -0.76 | 1.00 | 1.00 |
| depth   | WA ForN          | 25/25 | 1.15 | 2.08 | -0.93 | 1.00 | 1.00 |
| depth   | WA AgN           | 25/25 | 0.69 | 1.58 | -0.89 | 0.00 | 0.50 |
| depth   | CLV ForN         | 24/25 | 1.75 | 2.83 | -1.08 | 2.00 | 2.00 |
| depth   | CLV AgN          | 24/25 | 1.00 | 1.92 | -0.92 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 25/25 | 0.31 | 0.25 | +0.06 | 0.00 | 0.00 |
| quality | ForWR            | 22/25 | 53.37 | 50.71 | +2.66 | 52.80 | 52.70 |
| quality | AgWR             | 12/25 | 35.52 | 43.29 | -7.77 | 33.90 | 46.01 |
| quality | TopFor WR        | 22/25 | 53.65 | 54.03 | -0.38 | 52.90 | 53.50 |
| quality | TopAg WR         | 12/25 | 39.02 | 47.88 | -8.87 | 33.90 | 50.10 |
| quality | EDGE             | 22/25 | 11.27 | 4.37 | +6.89 | 10.30 | 3.80 |
| quality | ForCLV           | 24/25 | 68.25 | 68.38 | -0.13 | 68.85 | 68.93 |
| quality | AgCLV            | 17/25 | 58.11 | 56.72 | +1.38 | 63.69 | 62.78 |
| quality | netCLV           | 24/25 | 8.84 | 10.34 | -1.49 | 4.62 | 5.17 |
| quality | Tape             | 21/25 | 3.64 | 2.84 | +0.80 | 2.82 | 1.77 |
| quality | V12 score        | 25/25 | 0.92 | 0.75 | +0.17 | 0.95 | 0.88 |
| quality | V12 forMean      | 25/25 | 14.74 | 9.06 | +5.69 | 11.25 | 8.78 |
| quality | V12 agMean       | 25/25 | 0.22 | 0.22 | -0.01 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | AgWR             | quality | 12/25 | 0.139 | -0.497 | -0.590 | -7.77 | 🟢 sep OK |
|    2 | TopAg WR         | quality | 12/25 | 0.250 | -0.336 | -0.446 | -8.87 | 🟢 sep OK |
|    3 | EDGE             | quality | 22/25 | 0.711 | +0.371 | +0.401 | +6.89 | 🟢 sep OK |
|    4 | CLV ForN         | depth   | 24/25 | 0.313 | +0.030 | -0.364 | -1.08 | 🔴 inverted |
|    5 | V12 score        | quality | 25/25 | 0.679 | +0.208 | +0.372 | +0.17 | 🟢 sep OK |
|    6 | V12 forMean      | quality | 25/25 | 0.660 | +0.058 | +0.301 | +5.69 | 🟢 sep OK |
|    7 | proven A         | depth   | 25/25 | 0.346 | +0.088 | -0.281 | -0.51 | 🟢 sep OK |
|    8 | ForWR            | quality | 22/25 | 0.653 | +0.080 | +0.391 | +2.66 | 🟢 sep OK |
|    9 | #A sharps        | depth   | 25/25 | 0.365 | -0.148 | -0.232 | -0.94 | 🟢 sep OK |
|   10 | v12 F count      | depth   | 25/25 | 0.365 | +0.115 | -0.347 | -0.97 | 🔴 inverted |
|   11 | WA ForN          | depth   | 25/25 | 0.365 | -0.081 | -0.343 | -0.93 | 🔴 inverted |
|   12 | v12 A count      | depth   | 25/25 | 0.378 | -0.039 | -0.218 | -0.76 | 🟢 sep OK |
|   13 | CLV AgN          | depth   | 24/25 | 0.382 | -0.131 | -0.249 | -0.92 | 🟢 sep OK |
|   14 | #F sharps        | depth   | 25/25 | 0.385 | +0.052 | -0.272 | -0.83 | 🔴 inverted |
|   15 | TopFor WR        | quality | 22/25 | 0.413 | -0.371 | -0.124 | -0.38 | 🔴 inverted |
|   16 | #F − #A          | depth   | 25/25 | 0.417 | +0.111 | +0.023 | +0.11 | 🔴 inverted |
|   17 | V12 agMean       | quality | 25/25 | 0.417 | +0.136 | -0.005 | -0.01 | 🟢 sep OK |
|   18 | Tape             | quality | 21/25 | 0.582 | +0.079 | +0.131 | +0.80 | 🟢 sep OK |
|   19 | proven F−A       | depth   | 25/25 | 0.558 | +0.459 | +0.263 | +0.48 | 🟡 mild OK |
|   20 | WA AgN           | depth   | 25/25 | 0.442 | +0.044 | -0.237 | -0.89 | 🟡 mild OK |
|   21 | AgCLV            | quality | 17/25 | 0.556 | +0.174 | +0.042 | +1.38 | 🟡 mild inv |
|   22 | ForCLV           | quality | 24/25 | 0.465 | +0.111 | -0.017 | -0.13 | flat |
|   23 | proven F         | depth   | 25/25 | 0.468 | +0.115 | -0.032 | -0.03 | flat |
|   24 | netCLV           | quality | 24/25 | 0.479 | +0.010 | -0.051 | -1.49 | flat |
|   25 | unopposed (A=0)  | depth   | 25/25 | 0.513 | +0.443 | +0.063 | +0.06 | flat |

### (C) Working read

_N=25 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.711 · Δ +6.89 · higher on WINs (cov 22/25)
- **V12 score** — AUC 0.679 · Δ +0.17 · higher on WINs (cov 25/25)
- **V12 forMean** — AUC 0.660 · Δ +5.69 · higher on WINs (cov 25/25)
- **proven A** — AUC 0.346 · Δ -0.51 · higher on LOSSes (cov 25/25)
- **ForWR** — AUC 0.653 · Δ +2.66 · higher on WINs (cov 22/25)
- **#A sharps** — AUC 0.365 · Δ -0.94 · higher on LOSSes (cov 25/25)
- **v12 A count** — AUC 0.378 · Δ -0.76 · higher on LOSSes (cov 25/25)
- **CLV AgN** — AUC 0.382 · Δ -0.92 · higher on LOSSes (cov 24/25)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 216n · 52.8% · +0.5%   | 43n · 58.1% · +4.9%    | 138n · 53.6% · +0.5%   | 397n · 53.7% · +1.0%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 35n · 68.6% · +22.9%   | —                      | —                      | 35n · 68.6% · +22.9%   |
| UFC   | 3n · 66.7% · -13.1%    | —                      | —                      | 3n · 66.7% · -13.1%    |
| WNBA  | 2n · 100.0% · +77.3%   | 1n · 0.0% · -100.0%    | —                      | 3n · 66.7% · +2.6%     |
| **All** | **263n · 54.8% · +4.4%** | **48n · 58.3% · +6.4%** | **143n · 53.8% · +1.2%** | **454n · 54.8% · +3.5%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **584** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  584 |
| Muted W-L                           |              280-304 |
| Muted Win %                         |                47.9% |
| Counterfactual PnL at flat 1u       |               -52.09 |
| Counterfactual ROI at flat 1u       |                -8.9% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-52.09u** at a flat 1u stake — a counterfactual ROI of **-8.9%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-07-18 | MLB   | ML     | Chicago White Sox       |  -112 | +0.843 | HC-1     |   4/1 |   2/0 |  49.6 |   61.6 |   +2.2 |  1.68 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-07-18 | MLB   | ML     | Detroit Tigers          |  -190 | +0.901 | HC-1     |   2/1 |   2/0 |  51.4 |   61.1 |  +17.5 |  2.09 | HOLD     | 4.00u | WIN     |      +2.11 |
| 2026-07-18 | MLB   | ML     | Milwaukee Brewers       |  -144 | +0.900 | HC-1     |   2/1 |   2/0 |  52.8 |   68.9 |  +21.5 |  4.60 | BOOST    | 5.40u | WIN     |      +3.75 |
| 2026-07-18 | MLB   | ML     | New York Mets           |  +155 | +0.394 | SHARP    |   4/0 |   1/0 |  45.8 |   66.0 |   -4.3 |  0.16 | HOLD     | 1.50u | LOSS    |      -1.50 |
| 2026-07-18 | MLB   | ML     | Kansas City Royals      |  -103 | +0.917 | MINI     |   1/0 |   1/0 |  52.7 |   68.8 |   +2.7 |  1.77 | HOLD     | 3.00u | WIN     |      +2.91 |
| 2026-07-18 | MLB   | ML     | Arizona Diamondbacks    |  -116 | +0.812 | 2-for-0  |   2/1 |   2/0 |  52.8 |   68.9 |  +18.9 |  3.88 | BOOST    | 5.40u | WIN     |      +4.66 |
| 2026-07-18 | MLB   | ML     | Tampa Bay Rays          |  -106 | +0.375 | SHARP    |   5/2 |   2/1 |  47.1 |   69.1 |   +6.4 |  2.22 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-07-18 | MLB   | ML     | Washington Nationals    |  -112 | +0.046 | PATH-D   |   1/8 |   1/3 |  52.9 |   69.0 |   +7.6 |  1.67 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-07-18 | UFC   | ML     | Tommy McMillen          |  -193 | +0.969 | MINI     |   3/1 |   1/0 |     — |   72.5 |      — |     — | FAIL_OPEN | 3.00u | WIN     |      +1.55 |
| 2026-07-18 | UFC   | ML     | Austin Bashi            |  -139 | +0.918 | SHARP    |   6/3 |   1/0 |     — |   69.6 |      — |     — | FAIL_OPEN | 3.00u | LOSS    |      -3.00 |
| 2026-07-18 | UFC   | ML     | Alden Coria             | -1100 | +0.981 | MINI     |   2/0 |   1/0 |     — |   75.4 |      — |     — | FAIL_OPEN | 3.00u | WIN     |      +0.27 |
| 2026-07-18 | MLB   | TOTAL  | Under 9.5               |  -103 | +0.957 | HC-1     |   1/3 |   1/0 |  52.7 |   68.8 |  +14.5 |  3.82 | BOOST    | 5.40u | WIN     |      +5.24 |
| 2026-07-18 | MLB   | TOTAL  | Over 8.5                |  -110 | +0.957 | HC-1     |   1/0 |   1/0 |  52.7 |   68.8 |   +2.7 |  1.77 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-07-17 | MLB   | ML     | Los Angeles Dodgers     |  -112 | +0.784 | HC-1     |   2/2 |   2/2 |  54.1 |   65.1 |  +10.3 |  0.81 | HOLD     | 4.00u | WIN     |      +3.57 |
| 2026-07-17 | MLB   | ML     | Miami Marlins           |  +136 | +0.969 | MINI     |   1/2 |   1/0 |  55.6 |   66.0 |   +5.6 |  7.93 | FAIL_OPEN | 2.50u | LOSS    |      -2.50 |
| 2026-07-17 | MLB   | ML     | San Diego Padres        |  -120 | +0.978 | HC-1     |   1/1 |   1/0 |  55.6 |   66.0 |  +23.6 |  3.55 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-07-17 | MLB   | ML     | Atlanta Braves          |  -215 | +0.984 | HC-1     |   1/0 |   1/0 |  55.6 |   66.0 |   +5.6 |  1.64 | FAIL_OPEN | 4.00u | WIN     |      +1.86 |
| 2026-07-17 | MLB   | ML     | Athletics               |  +116 | +0.770 | HC-1     |   5/2 |   2/1 |  47.5 |   70.3 |   -0.1 |  0.34 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-07-17 | WNBA  | ML     | Indiana Fever           |  -355 | +0.908 | MINI     |   3/1 |   1/0 |  53.8 |   71.4 |   +3.8 | 12.63 | FAIL_OPEN | 3.00u | WIN     |      +0.85 |
| 2026-07-17 | MLB   | SPREAD | Washington Nationals    |  +142 | +0.982 | HC-1     |   1/1 |   1/0 |  55.6 |   66.0 |  +23.6 |  3.55 | BOOST    | 2.50u | WIN     |      +3.55 |
| 2026-07-17 | WNBA  | SPREAD | Indiana Fever           |  -108 | +0.968 | HC-1     |   2/1 |   2/0 |  53.8 |   70.5 |   +3.8 |  8.00 | FAIL_OPEN | 4.00u | LOSS    |      -4.00 |
| 2026-07-17 | MLB   | TOTAL  | Over 8.5                |  -111 | +0.967 | HC-1     |   1/0 |   1/0 |  43.8 |   66.0 |   -6.2 | -0.14 | FAIL_OPEN | 4.00u | LOSS    |      -4.00 |
| 2026-07-17 | MLB   | TOTAL  | Under 10.5              |  -110 | +0.982 | HC-1     |   1/0 |   1/0 |  55.6 |   66.0 |   +5.6 |  1.64 | FAIL_OPEN | 4.00u | WIN     |      +3.64 |
| 2026-07-16 | MLB   | ML     | Philadelphia Phillies   |  -120 | +0.846 | HC-1     |   2/6 |   2/3 |  53.5 |   77.6 |   +6.8 |  4.06 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-07-15 | WNBA  | ML     | Golden State Valkyries  |  +136 | +0.946 | HC-2     |   4/5 |   2/0 |  50.0 |      — |   +0.0 |     — | —        | 2.50u | WIN     |      +3.40 |
| 2026-07-14 | SOC   | ML     | France                  |  +155 | +0.697 | HC-2     |  19/4 |  19/4 |  68.1 |      — |  +21.2 |     — | —        | 1.00u | LOSS    |      -1.00 |
| 2026-07-12 | MLB   | ML     | St. Louis Cardinals     |  -128 | +0.993 | MINI     |   1/0 |   1/0 |  63.6 |      — |  +13.6 |     — | —        | 3.00u | LOSS    |      -3.00 |
| 2026-07-12 | MLB   | ML     | San Francisco Giants    |  -145 | +0.993 | MINI     |   1/0 |   1/0 |  63.6 |      — |  +13.6 |     — | —        | 3.00u | WIN     |      +2.07 |
| 2026-07-12 | MLB   | ML     | Milwaukee Brewers       |  +106 | +0.792 | HC-1     |   0/2 |   0/2 |     — |      — |      — |     — | —        | 2.50u | LOSS    |      -2.50 |
| 2026-07-12 | MLB   | SPREAD | St. Louis Cardinals     |  +168 | +0.758 | PATH-D   |   1/3 |   1/1 |  63.6 |      — |  +20.3 |     — | —        | 1.00u | LOSS    |      -1.00 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.529 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.083 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.015 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.004 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.042 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  449 |    +0.1131 |    -0.0734 | 0.0007 |  +0.026 |   0.954 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  449 |    +0.0960 |    +0.4648 | 0.0017 |  +0.042 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  449 |    -0.1434 |    +0.2152 | 0.0001 |  -0.011 |   2.932 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 449 |          +0.064 |           +0.016 |                   +0.049 |                   -0.010 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 449 |          -0.016 |           +0.314 |                   +0.000 |                   +0.092 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 449 |          +0.007 |           +0.229 |                   -0.019 |                   +0.040 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 449 |          -0.034 |           +0.136 |                   -0.009 |                   +0.069 | count of contributing AGAINST-side wallets                     |
| provenFor         | 449 |          +0.023 |           +0.243 |                   +0.004 |                   +0.067 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 449 |          -0.006 |           +0.117 |                   +0.008 |                   +0.040 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.250         | 151 | 82-69   |   54.3% |     +1.8% |
| MID (p33–p67)     | 19.950 … 25.200        | 148 | 79-69   |   53.4% |     +0.0% |
| HIGH (> p67)      | 48.906 … 49.481        | 150 | 85-65   |   56.7% |     +1.1% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       449 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8659 | average score across live picks                                 |
| SD                |    0.2158 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.285 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +4.430 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.528 / +0.962 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  393 | 211-182 |   53.7% |     +0.8% |  0.513 |        -0.047 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   34 | 23-11  |   67.6% |    +22.6% |  0.522 |        -0.183 | noise                                     |
| UFC   |    3 | 2-1    |   66.7% |    -13.1% |  1.000 |        +1.000 | strong (N<20)                             |
| WNBA  |    3 | 2-1    |   66.7% |     +2.6% |  0.000 |        -1.000 | anti-signal (N<20)                        |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18"]
    y-axis "AUC" 0.4 --> 0.8
    line [0.439, 0.453, 0.492, 0.502, 0.469, 0.54, 0.539, 0.551, 0.542, 0.553, 0.611, 0.76, 0.719, 0.666]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18"]
    y-axis "edge (pp)" -16 --> 8
    line [6.4, 5.1, 4.2, -1.7, 2.3, 5.8, 5.3, -0.4, -3, -5.3, -0.6, -8.9, -13.8, -15]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-07-04 |    7 |   78 | 47-31  |   60.3% |     +8.6% |  0.439 |      +6.4pp |
| 2026-07-05 |    7 |   81 | 48-33  |   59.3% |    +10.0% |  0.453 |      +5.1pp |
| 2026-07-06 |    7 |   83 | 48-35  |   57.8% |     +9.4% |  0.492 |      +4.2pp |
| 2026-07-07 |    7 |   76 | 40-36  |   52.6% |     -0.4% |  0.502 |      -1.7pp |
| 2026-07-08 |    7 |   72 | 41-31  |   56.9% |     +9.5% |  0.469 |      +2.3pp |
| 2026-07-09 |    7 |   68 | 41-27  |   60.3% |    +16.2% |  0.540 |      +5.8pp |
| 2026-07-10 |    7 |   64 | 38-26  |   59.4% |    +12.0% |  0.539 |      +5.3pp |
| 2026-07-11 |    7 |   57 | 30-27  |   52.6% |     +1.2% |  0.551 |      -0.4pp |
| 2026-07-12 |    7 |   50 | 25-25  |   50.0% |     -4.0% |  0.542 |      -3.0pp |
| 2026-07-14 |    7 |   44 | 21-23  |   47.7% |     -9.1% |  0.553 |      -5.3pp |
| 2026-07-15 |    7 |   35 | 18-17  |   51.4% |     +1.1% |  0.611 |      -0.6pp |
| 2026-07-16 |    7 |   28 | 12-16  |   42.9% |    -17.1% |  0.760 |      -8.9pp |
| 2026-07-17 |    7 |   31 | 12-19  |   38.7% |    -26.7% |  0.719 |     -13.8pp |
| 2026-07-18 |    7 |   36 | 14-22  |   38.9% |    -24.9% |  0.666 |     -15.0pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.509 avg in first half → 0.541 avg in second half · Δ = +0.031)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +3.5% | [-5.8%, +13.4%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.8% | [50.1%, 59.7%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.529 | [0.477, 0.581]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             44 | [1, 87]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       454 |
| Unique wallets ever on a FOR side            |                                                       144 |
| Avg FOR-side wallets per pick                |                                                      3.02 |
| Top-5 wallets' share of all FOR appearances  |                                                     31.1% |
| Top-10 wallets' share of all FOR appearances |                                                     46.2% |
| Top-20 wallets' share of all FOR appearances |                                                     64.0% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 5b1e50  | MLB,NBA,NHL,SOC |   99 |   61 | 64-35  |   64.6% |    +18.1% |    +59.86 |     1.54× | CONFIRMED   |     +8.0% |     331 | 2026-07-14 |
|    2 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    3 | 4c64aa  | MLB        |   89 |    9 | 47-42  |   52.8% |     -2.0% |     -3.48 |     0.84× | WR50        |     -2.1% |     306 | 2026-07-11 |
|    4 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     501 | 2026-07-10 |
|    5 | 2f2a9e  | MLB,SOC    |   67 |   27 | 35-32  |   52.2% |     -9.6% |    -18.11 |     2.15× | CONFIRMED   |     -9.1% |     228 | 2026-07-07 |
|    6 | cd2f63  | MLB,NBA,SOC,WNBA |   53 |   32 | 27-26  |   50.9% |     +8.6% |    +12.91 |     1.64× | CONFIRMED   |    +12.4% |     375 | 2026-07-15 |
|    7 | eeabaf  | MLB,NBA,SOC |   48 |    8 | 27-21  |   56.3% |     +8.6% |    +12.20 |     1.30× | CONFIRMED   |    +17.3% |     179 | 2026-07-08 |
|    8 | 0f9d74  | MLB,NBA,SOC,UFC |   40 |   21 | 19-21  |   47.5% |     -3.6% |     -4.20 |     0.57× | CONFIRMED   |    +27.7% |     183 | 2026-07-18 |
|    9 | 4b912c  | MLB,SOC    |   34 |   12 | 19-15  |   55.9% |     +6.9% |     +8.00 |     1.33× | CONFIRMED   |     -9.4% |     111 | 2026-07-10 |
|   10 | 0cd77e  | MLB,SOC,UFC |   33 |    3 | 20-13  |   60.6% |    +14.7% |    +18.55 |     1.66× | CONFIRMED   |     +9.2% |      69 | 2026-07-18 |
|   11 | 7923c4  | MLB,NBA,UFC |   31 |   13 | 19-12  |   61.3% |    +39.6% |    +24.06 |     0.71× | CONFIRMED   |     +8.3% |     164 | 2026-07-18 |
|   12 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   13 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |
|   14 | 491f30  | MLB,SOC    |   25 |    4 | 17-8   |   68.0% |    +43.8% |    +35.89 |     0.95× | CONFIRMED   |     -8.8% |      64 | 2026-07-01 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   25 |   20 | 12-13  |   48.0% |    -11.8% |     -8.43 |     1.41× | CONFIRMED   |    +13.5% |     118 | 2026-07-18 |
|   16 | bc35e3  | MLB,SOC,WNBA |   23 |   12 | 13-10  |   56.5% |     +6.4% |     +4.70 |     1.31× | CONFIRMED   |     +6.0% |     103 | 2026-07-18 |
|   17 | 7da3d5  | MLB,SOC,UFC,WNBA |   22 |   21 | 8-14   |   36.4% |    -31.5% |    -22.31 |     5.29× | CONFIRMED   |    -11.9% |     102 | 2026-07-18 |
|   18 | c911a4  | MLB,NBA,SOC |   21 |   12 | 11-10  |   52.4% |    +17.0% |    +10.19 |     4.63× | CONFIRMED   |    +56.4% |      76 | 2026-07-14 |
|   19 | a82a75  | MLB,SOC,UFC |   21 |    6 | 11-10  |   52.4% |     +2.6% |     +1.89 |     0.75× | CONFIRMED   |     +3.5% |      60 | 2026-07-18 |
|   20 | f2f960  | MLB        |   20 |    8 | 10-10  |   50.0% |     -7.9% |     -5.50 |     2.03× | —           |    -10.8% |      47 | 2026-07-18 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   14 | 11-3   |   78.6% |     +57.0% |    +26.49 |     1.13× | 2026-07-11 |
|    2 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    3 | 7923c4  | MLB,NBA,UFC |   31 | 19-12  |   61.3% |     +39.6% |    +24.06 |     0.71× | 2026-07-18 |
|    4 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    5 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|    6 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|    7 | 5b1e50  | MLB,NBA,NHL,SOC |   99 | 64-35  |   64.6% |     +18.1% |    +59.86 |     1.54× | 2026-07-14 |
|    8 | c911a4  | MLB,NBA,SOC |   21 | 11-10  |   52.4% |     +17.0% |    +10.19 |     4.63× | 2026-07-14 |
|    9 | 9a69c2  | MLB,SOC    |   26 | 14-12  |   53.8% |     +14.8% |     +9.18 |     2.30× | 2026-07-10 |
|   10 | 0cd77e  | MLB,SOC,UFC |   33 | 20-13  |   60.6% |     +14.7% |    +18.55 |     1.66× | 2026-07-18 |
|   11 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|   12 | b839b3  | MLB,NBA,SOC,UFC |   15 | 9-6    |   60.0% |     +12.2% |     +6.13 |     1.43× | 2026-07-18 |
|   13 | eeabaf  | MLB,NBA,SOC |   48 | 27-21  |   56.3% |      +8.6% |    +12.20 |     1.30× | 2026-07-08 |
|   14 | cd2f63  | MLB,NBA,SOC,WNBA |   53 | 27-26  |   50.9% |      +8.6% |    +12.91 |     1.64× | 2026-07-15 |
|   15 | 4b912c  | MLB,SOC    |   34 | 19-15  |   55.9% |      +6.9% |     +8.00 |     1.33× | 2026-07-10 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 8ec926  | MLB        |   11 | 4-7    |   36.4% |     -37.5% |    -12.75 |     6.30× | 2026-07-18 |
|    3 | 7da3d5  | MLB,SOC,UFC,WNBA |   22 | 8-14   |   36.4% |     -31.5% |    -22.31 |     5.29× | 2026-07-18 |
|    4 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   25 | 12-13  |   48.0% |     -11.8% |     -8.43 |     1.41× | 2026-07-18 |
|    5 | ac9705  | MLB        |   18 | 8-10   |   44.4% |     -11.5% |     -8.36 |     2.24× | 2026-07-10 |
|    6 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    7 | c9bba3  | MLB,SOC    |   10 | 6-4    |   60.0% |      -9.9% |     -2.36 |     0.82× | 2026-07-18 |
|    8 | 2f2a9e  | MLB,SOC    |   67 | 35-32  |   52.2% |      -9.6% |    -18.11 |     2.15× | 2026-07-07 |
|    9 | f2f960  | MLB        |   20 | 10-10  |   50.0% |      -7.9% |     -5.50 |     2.03× | 2026-07-18 |
|   10 | 0f9d74  | MLB,NBA,SOC,UFC |   40 | 19-21  |   47.5% |      -3.6% |     -4.20 |     0.57× | 2026-07-18 |
|   11 | 4c64aa  | MLB        |   89 | 47-42  |   52.8% |      -2.0% |     -3.48 |     0.84× | 2026-07-11 |
|   12 | ad88a3  | MLB,SOC    |   17 | 9-8    |   52.9% |      -1.2% |     -0.73 |     0.27× | 2026-07-07 |
|   13 | a82a75  | MLB,SOC,UFC |   21 | 11-10  |   52.4% |      +2.6% |     +1.89 |     0.75× | 2026-07-18 |
|   14 | 70135d  | MLB,NBA    |   77 | 42-35  |   54.5% |      +4.7% |     +8.93 |     1.30× | 2026-07-10 |
|   15 | bc35e3  | MLB,SOC,WNBA |   23 | 13-10  |   56.5% |      +6.4% |     +4.70 |     1.31× | 2026-07-18 |

> 🔴 **5 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `7da3d5` (FOR# 22, ROI -31.5%), `bc44b0` (FOR# 25, ROI -11.8%), `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 67, ROI -9.6%), `f2f960` (FOR# 20, ROI -7.9%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   930 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   154 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     7 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    42 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   188 | 🟡 informational — AGS-U calibration controls sample adequacy |

**Tracked-shipped detail (these are the picks the grader wrongly marked 0u):**

| Doc ID                              | Sport | Tier    | Units  | Outcome | Stamped Profit |
|-------------------------------------|-------|---------|--------|---------|----------------|
| 2026-05-16_MLB_tex_hou              | MLB   | LEAN    |  1.25u | WIN     |          +0.00u |

**Sizing-regression detail (LOCK+ tier shipped at 0u — money left on the table):**

| Doc ID                              | Sport | Tier    | AGS-U  | Outcome | "Lost" PnL (1u) |
|-------------------------------------|-------|---------|--------|---------|-----------------|
| 2026-05-18_MLB_bal_tbr              | MLB   | LOCK    |  +1.13 | LOSS    |           -1.00u |
| 2026-05-20_MLB_lad_sdp              | MLB   | LEAN    |  +0.42 | WIN     |           +0.51u |
| 2026-05-24_MLB_nym_mia_total        | MLB   | LOCK    |  +0.33 | WIN     |           +0.99u |
| 2026-05-26_MLB_col_lad_spread       | MLB   | LOCK    |  +0.28 | LOSS    |           -1.00u |
| 2026-05-26_NBA_sas_okc_spread       | NBA   | PREMIUM |  +0.32 | WIN     |           +0.98u |
| 2026-05-27_NHL_car_mtl_spread       | NHL   | ELITE   |  +0.59 | LOSS    |           -1.00u |
| 2026-05-27_MLB_chc_pit_total        | MLB   | LOCK    |  +0.15 | LOSS    |           -1.00u |
| 2026-05-27_MLB_mia_tor_total        | MLB   | PREMIUM |  +0.46 | WIN     |           +0.89u |
| 2026-05-28_NBA_okc_sas_spread       | NBA   | PREMIUM |  +0.51 | LOSS    |           -1.00u |
| 2026-05-28_MLB_laa_det_total        | MLB   | LOCK    |  +0.22 | WIN     |           +0.93u |
| 2026-05-30_NBA_sas_okc              | NBA   | PREMIUM |  +0.45 | LOSS    |           -1.00u |
| 2026-05-31_MLB_laa_tbr_spread       | MLB   | LOCK    |  +0.26 | LOSS    |           -1.00u |
| 2026-06-15_MLB_laa_ari              | MLB   | LEAN    |  +0.47 | LOSS    |           -1.00u |
| 2026-06-15_MLB_mia_phi              | MLB   | LEAN    |  +0.30 | LOSS    |           -1.00u |
| 2026-06-15_MLB_sdp_stl              | MLB   | LEAN    |  +0.10 | WIN     |           +0.66u |
| 2026-06-15_MLB_kcr_wsh_spread       | MLB   | LOCK    |  +0.10 | WIN     |           +1.53u |
| 2026-06-15_MLB_mia_phi_total        | MLB   | PREMIUM |  +0.30 | LOSS    |           -1.00u |
| 2026-06-15_MLB_pit_oak_total        | MLB   | LOCK    |  +0.12 | LOSS    |           -1.00u |
| 2026-06-16_SOC_nor_irq              | SOC   | LOCK    |  +0.30 | LOSS    |           -1.00u |
| 2026-06-16_MLB_cle_mil_spread       | MLB   | PREMIUM |  +0.11 | WIN     |           +0.62u |
| 2026-06-16_MLB_sdp_stl_spread       | MLB   | LOCK    |  +0.19 | WIN     |           +1.68u |
| 2026-06-16_MLB_cle_mil_total        | MLB   | ELITE   |  +0.13 | WIN     |           +0.99u |
| 2026-06-16_MLB_kcr_wsh_total        | MLB   | PREMIUM |  +0.13 | WIN     |           +0.91u |
| 2026-06-16_MLB_tbr_lad_total        | MLB   | LOCK    |  +0.62 | LOSS    |           -1.00u |
| 2026-06-17_MLB_cws_nyy              | MLB   | ELITE   |  +0.30 | WIN     |           +0.58u |
| 2026-06-17_SOC_cod_por              | SOC   | ELITE   |  +0.30 | LOSS    |           -1.00u |
| 2026-06-17_SOC_pan_gha              | SOC   | LOCK    |  +0.30 | WIN     |           +1.42u |
| 2026-06-18_MLB_bal_sea              | MLB   | LOCK    |  +0.30 | WIN     |           +0.72u |
| 2026-06-18_MLB_laa_oak              | MLB   | PREMIUM |  +0.28 | WIN     |           +0.57u |
| 2026-06-18_SOC_kor_mex              | SOC   | ELITE   |  +0.34 | WIN     |           +1.13u |

### Live calibration thresholds

The live `agsCalibration/current` document — what the cron and UI both read at runtime to score & size every pick. **This is the actual thresholds V12 is using right now.**

- **Computed at:** 2026-07-06T16:05:24.346Z
- **Schema version:** `ags-unified-v12` 🟢 (V12 active)
- **Source:** cron
- **Sample size:** 1775
- **Date range:** 2026-04-18 → 2026-07-05

### V12 score bands (diagnostic — not the live unit sizer)

Score ≤ 0 still mutes (FADE). Positive bands below are **labels only** — live units come from Paths A–D + TAPE (§ 2 / § 4), not this ladder.

| Boundary | V12 score cut | Band label |
|----------|---------------|------------|
| q80      |        +0.984 | ELITE |
| q60      |        +0.962 | PREMIUM |
| q40      |        +0.871 | LOCK |
| q20      |        +0.643 | LEAN |
| —        |        +0.000 | WEAK (score > 0) |
| mute     |             — | FADE (score ≤ 0 → 0u) |

> **Odds cap** (still live): ≤2.5u at +100 · ≤1.5u at +151 · ≤1.0u at +200.

### Wallet pool

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            166 |        40 |   16 |    8 |  102 |                     64 |
| NBA   |            211 |        58 |   25 |   23 |  105 |                    106 |
| NHL   |            105 |        23 |    6 |   16 |   60 |                     45 |
| SOC   |            217 |        53 |   35 |    9 |  120 |                     97 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   49 |    454 | 584 | 249-205 |  54.8% |      3.5% |     +43.67 |    +0.10 | 0.503 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  394 |    +1.5pp |    +12.4pp |          +0.269 |   -0.045 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  392 |    +6.5pp |    +22.2pp |          +0.409 |   +0.110 |    +0.0305 | 🟢 better |
| v12 − v11          | +  343 |    -0.1pp |     +0.6pp |          +0.035 |   +0.060 |    +0.0144 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 397n 53.7% +1% | 10n 30.0% +29% | 6n 83.3% +38%  | 35n 68.6% +23% | 3n 66.7% -13%  | 3n 66.7% +3%   | 454n 54.8% +3% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 95n +4%       | 130n -0%      | 93n +14%      | 69n -6%       | 62n +9%       | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~1320 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 688 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 449 / 688 (65%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 449 / 688 (65%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 449 / 688 (65%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 449 / 688 (65%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 449 / 688 (65%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 449 / 688 (65%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 449 / 688 (65%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 688 / 688 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 688 / 688 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 688 / 688 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 688 / 688 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 688 / 688 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 688 / 688 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 682 / 688 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 680 / 688 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 688 / 688 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 687 / 688 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 417 / 688 (61%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 687 / 688 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 417 / 688 (61%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 416 / 688 (60%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 688 / 688 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 688 / 688 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 688 / 688 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 687 / 688 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 688 / 688 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd contribMargin     | 688 |      |    -0.035 |    -0.109 |      -0.064 |      -0.103 |  0.463 |
|    2 | wd maxForContrib     | 687 |      |    -0.057 |    -0.044 |      -0.059 |      -0.038 |  0.486 |
|    3 | wd forAvgSize        | 687 |      |    -0.030 |    +0.058 |      -0.051 |      -0.014 |  0.510 |
|    4 | qMargin              | 449 |  🟢  |    +0.071 |    +0.013 |      +0.051 |      -0.012 |  0.523 |
|    5 | V12 forMean          | 449 |  🟢  |    +0.064 |    +0.016 |      +0.049 |      -0.010 |  0.521 |
|    6 | wd contribFor        | 688 |      |    -0.038 |    -0.041 |      -0.049 |      -0.073 |  0.468 |
|    7 | wd agCount           | 417 |      |    +0.015 |    +0.275 |      +0.045 |      +0.106 |  0.497 |
|    8 | wd sizeMargin        | 416 |      |    -0.006 |    +0.004 |      -0.040 |      -0.056 |  0.494 |
|    9 | wd forCount          | 687 |      |    -0.022 |    +0.118 |      -0.035 |      -0.016 |  0.472 |
|   10 | hcMargin             | 688 |      |    -0.011 |    +0.219 |      -0.033 |      +0.051 |  0.516 |
|   11 | wd maxShare          | 688 |      |    +0.025 |    -0.061 |      +0.030 |      +0.018 |  0.520 |
|   12 | provenFor            | 688 |      |    -0.016 |    +0.084 |      -0.028 |      -0.033 |  0.496 |
|   13 | provenTotal          | 688 |      |    -0.023 |    +0.062 |      -0.026 |      -0.024 |  0.495 |
|   14 | agsV12               | 449 |  🟢  |    +0.042 |    -0.015 |      +0.026 |      -0.004 |  0.529 |
|   15 | provenMargin         | 688 |      |    +0.001 |    +0.084 |      -0.023 |      -0.019 |  0.501 |
|   16 | ags (v11)            | 688 |      |    +0.002 |    +0.020 |      -0.023 |      -0.056 |  0.511 |
|   17 | V12 forCount         | 449 |  🟢  |    +0.007 |    +0.229 |      -0.019 |      +0.040 |  0.511 |
|   18 | peakStars            | 688 |      |    +0.004 |    +0.076 |      -0.015 |      -0.014 |  0.497 |
|   19 | countMargin          | 449 |      |    +0.028 |    +0.173 |      -0.015 |      +0.011 |  0.496 |
|   20 | wd agAvgSize         | 417 |      |    -0.040 |    -0.001 |      -0.014 |      +0.003 |  0.494 |
|   21 | provenAg             | 688 |      |    -0.026 |    +0.172 |      -0.014 |      +0.060 |  0.494 |
|   22 | lockPinnProb         | 682 |      |    +0.145 |    +0.157 |      +0.011 |      -0.132 |  0.576 |
|   23 | wd contribAg         | 688 |      |    -0.012 |    +0.153 |      +0.010 |      +0.054 |  0.495 |
|   24 | V12 agCount          | 449 |  🟢  |    -0.034 |    +0.136 |      -0.009 |      +0.069 |  0.504 |
|   25 | clv                  | 680 |      |    +0.011 |    -0.029 |      +0.000 |      +0.003 |  0.519 |
|   26 | V12 agMean           | 449 |  🟢  |    -0.016 |    +0.314 |      +0.000 |      +0.092 |  0.489 |

> **Top 3 univariate features by PnL correlation:** `wd contribMargin` (r = -0.064), `wd maxForContrib` (r = -0.059), `wd forAvgSize` (r = -0.051).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd contribMargin` — r(unit-ret) = -0.064, AUC = 0.463. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd contribMargin` · r(unit-ret) = -0.064 · AUC = 0.463

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -170.800       | 231 | 134-97  |   58.0% |     +4.0% |
| MID (p33–p67)     | 57.800 … 45.100          | 228 | 126-102 |   55.3% |     +0.8% |
| HIGH (> p67)      | 174.100 … 334.600        | 229 | 113-116 |   49.3% |     -3.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd maxForContrib` · r(unit-ret) = -0.059 · AUC = 0.486

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 32.800          | 230 | 124-106 |   53.9% |     +0.3% |
| MID (p33–p67)     | 64.600 … 45.100          | 229 | 132-97  |   57.6% |     +3.0% |
| HIGH (> p67)      | 100.000 … 149.000        | 228 | 117-111 |   51.3% |     -1.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd forAvgSize` · r(unit-ret) = -0.051 · AUC = 0.510

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.675 … 0.503            | 233 | 122-111 |   52.4% |     -0.1% |
| MID (p33–p67)     | 0.777 … 1.030            | 225 | 125-100 |   55.6% |     +1.5% |
| HIGH (> p67)      | 3.837 … 3.230            | 229 | 126-103 |   55.0% |     -0.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.051 · AUC = 0.523

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.250           | 150 | 84-66   |   56.0% |     +3.5% |
| MID (p33–p67)     | 19.950 … 25.200          | 149 | 77-72   |   51.7% |     -1.1% |
| HIGH (> p67)      | 46.556 … 29.808          | 150 | 85-65   |   56.7% |     +1.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forMean` · r(unit-ret) = +0.049 · AUC = 0.521

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.250           | 151 | 82-69   |   54.3% |     +1.8% |
| MID (p33–p67)     | 19.950 … 25.200          | 148 | 79-69   |   53.4% |     +0.0% |
| HIGH (> p67)      | 48.906 … 49.481          | 150 | 85-65   |   56.7% |     +1.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd contribMargin | wd maxForContrib | wd forAvgSize  | qMargin        | V12 forMean    | wd contribFor  | wd agCount     | wd sizeMargin  |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd contribMargin |  1.000         |         +0.509 |         +0.274 |         +0.058 |         +0.090 |         +0.781 |         -0.090 |         +0.315 |
| wd maxForContrib |         +0.509 |  1.000         |         +0.471 |         +0.229 |         +0.313 |         +0.669 |         +0.370 |         +0.277 |
| wd forAvgSize |         +0.274 |         +0.471 |  1.000         |         +0.242 |         +0.321 |         +0.415 |         +0.253 |         +0.694 |
| qMargin     |         +0.058 |         +0.229 |         +0.242 |  1.000         |         +0.963 |         +0.092 |         +0.077 |         +0.189 |
| V12 forMean |         +0.090 |         +0.313 |         +0.321 |         +0.963 |  1.000         |         +0.206 |         +0.202 |         +0.226 |
| wd contribFor |         +0.781 |         +0.669 |         +0.415 |         +0.092 |         +0.206 |  1.000         |         +0.520 |         +0.287 |
| wd agCount  |         -0.090 |         +0.370 |         +0.253 |         +0.077 |         +0.202 |         +0.520 |  1.000         |         +0.077 |
| wd sizeMargin |         +0.315 |         +0.277 |         +0.694 |         +0.189 |         +0.226 |         +0.287 |         +0.077 |  1.000         |

> 🔴 **Strong collinearity detected:** `qMargin` and `V12 forMean` have r = +0.963. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 299 picks · features = 8 (+ intercept) · multiple R² = **0.0225** · adjusted R² = **-0.0079** · residual sd = 0.955

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.4103 |   0.3167 | -1.30        |        1 |
|    2 | wd agCount           |     |    +0.2967 |   0.1872 | +1.59 (~sig) |        2 |
|    3 | wd contribMargin     |     |    +0.2882 |   0.2693 | +1.07        |        3 |
|    4 | V12 forMean          |  🟢 |    +0.1134 |   0.2523 | +0.45        |        4 |
|    5 | qMargin              |  🟢 |    -0.0455 |   0.2442 | -0.19        |        5 |
|    6 | wd maxForContrib     |     |    -0.0365 |   0.0797 | -0.46        |        6 |
|    7 | wd sizeMargin        |     |    -0.0363 |   0.0843 | -0.43        |        7 |
|    8 | wd forAvgSize        |     |    -0.0096 |   0.0913 | -0.11        |        8 |
| —    | (intercept)          |     |    +0.0280 |   0.0552 |    +0.51 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.113), `qMargin` (β = -0.045)
- V12 IGNORES: `wd contribFor` (β = -0.410, t = -1.30), `wd agCount` (β = +0.297, t = +1.59), `wd contribMargin` (β = +0.288, t = +1.07), `wd maxForContrib` (β = -0.037, t = -0.46), `wd sizeMargin` (β = -0.036, t = -0.43), `wd forAvgSize` (β = -0.010, t = -0.11)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.530 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.569 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.040.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd agCount` (β = +0.297, t = +1.59). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of -0.0079 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*