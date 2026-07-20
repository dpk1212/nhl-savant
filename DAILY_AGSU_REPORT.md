# AGS-Unified — V12 Daily Monitor

**Generated:** Monday, July 20, 2026 at 10:40 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (50 days) · **Tape / side-profile era:** 2026-07-15+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟡 **V12 is currently BREAK-EVEN.** Since going live on **2026-06-01** (50 days ago), V12 has evaluated **1427** picks, shipped **468** for real money (32.8% ship rate), and muted the other **959**. On the shipped picks V12 has gone **257-211** (54.9% win), staked **1300.85u**, and returned **+37.59u** at **+2.9% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             50 |
| Picks V12 has evaluated             |                           1427 |
| Picks SHIPPED (units > 0)           |                            468 |
| Picks MUTED (score ≤ 0, FADE)       |                            959 |
| Ship rate                           |                          32.8% |
| Live W-L                            |                        257-211 |
| Live Win %                          |                          54.9% |
| Live PnL (units)                    |                         +37.59 |
| Live ROI                            |                          +2.9% |
| Avg PnL / day                       |                         +0.75u |
| Most recent action (2026-07-20)  |            0 live, 0-0, +0.00u |

### What's working

- Mute rule is **saving money** — the 592 muted picks would have lost -49.35u at flat 1u (-8.3% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+0.75u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **21-18** · -7.2% ROI · -9.02u on 39 graded — see § 5.

## § 2 — Live Stack (how picks size today)

V12 still **scores** a side as a wallet-quality differential (`forMean` vs `agMean` → score in [-1, +1]). Score ≤ 0 → FADE (0u). What changed is **how positive-score sides get sized**:

| Step | What runs | Units |
|------|-----------|-------|
| A | HC-margin path | SUPER 6u · TOP 4u · MINI 3u · CONFIRMED 1u |
| B | RANK rescue (muted + 2-for-0 whitelist) | 4u |
| C | SHARP / SHARP-LEAN EDGE/net rescue (+ MINI- cut) | 1.5–3u |
| D | DISSENT mute rescue (MLB contribMargin≤0) | 1u |
| E | fadeTop≥60 mute only (EDGE size/rescue **frozen**) | — |
| TAPE | From **2026-07-15**: mute tape&lt;0 · hold mid · boost ≥2.89 ×1.35 | path units |

**Stamps we keep for analysis (every shipped side):** depth (`#F/#A`, proven, V12 counts) + quality (ForWR, ForCLV, EDGE, Tape). Unopposed sides still get FOR numbers (EDGE uses AG prior 50). Compare WIN vs LOSS in § 5.

Odds cap still clamps long dogs (+100 / +151 / +200 → max 2.5 / 1.5 / 1.0u). Legacy ELITE→WEAK score-ladder units are **not** the live sizer — ignore them if you see them in old notes.

## § 3 — Daily Scoreboard

**Full book:** 50d · 468 live · 257-211 · **+37.59u** · +2.9% ROI · +0.75u/day.

_Prior to table (2026-06-01 → 2026-06-28): 297 live · 163-134 · +25.27u · cum through prior = +25.27u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-07-18 |        41 |   14 |    21 | 8-6        |  57.1% |     46.70 |      +4.91 |     10.5% |     +44.59 |
| 2026-07-19 |        24 |   13 |     7 | 7-6        |  53.8% |     34.10 |      -7.00 |    -20.5% |     +37.59 |
| 2026-07-20 |        11 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +37.59 |

> **Trajectory.** 🟡 Last 3 days (-2.6% ROI) **-5.8pp** vs prior (3.3%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-07-19**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 13 | 10-3 | +45.3% | +27.88u | +2.14u | +68.6% |
| 🟢 2 | MINI- (gate-cut) | C | 11 | 8-3 | +24.8% | +2.73u | +0.25u | +0.0% |
| 🟢 3 | RANK 2-for-0 rescue | B | 41 | 25-16 | +12.7% | +20.72u | +0.51u | +30.4% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP EDGE/net BOTH | C | 29 | 11-18 | -26.3% | -19.90u | -0.69u | -100.0% |
| 🔴 3 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 7 | 5-2 | +24.7% | +7.63u | sized UP after path |
| 2 | Tape FAIL_OPEN (missing) | 10 | 6-4 | -16.9% | -5.33u | no tape score → path size |
| 🔴 worst | Tape HOLD (mid) | 21 | 9-12 | -24.6% | -14.72u | kept path units |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Score FADE (≤0 → 0u) | 428 | 206-222 | -4.5% | -19.12u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 4 | 4-0 | +83.1% | +3.32u | 🔴 costing $ |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 13 | 10-3 | 76.9% | 61.5u | +27.88u | +45.3% | +2.14u | 2 | +68.6% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 56 | 34-22 | 60.7% | 209.6u | +11.94u | +5.7% | +0.21u | 19 | -22.5% | -4.82u | 🔻 cooling |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 41 | 25-16 | 61.0% | 163.4u | +20.72u | +12.7% | +0.51u | 3 | +30.4% | -0.58u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 29 | 11-18 | 37.9% | 75.8u | -19.90u | -26.3% | -0.69u | 4 | -100.0% | -3.75u | 🔻 cooling |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 3 | 2-1 | 66.7% | 4.5u | +0.81u | +18.0% | +0.27u | 3 | +18.0% | +0.81u | thin |
| MINI (gate-pass) | `MINI` | A | 3u | 44 | 23-21 | 52.3% | 127.5u | -6.42u | -5.0% | -0.15u | 9 | +8.7% | +0.11u | 🟡 flat |
| MINI- (gate-cut) | `MINI-` | C | 1u | 11 | 8-3 | 72.7% | 11.0u | +2.73u | +24.8% | +0.25u | 1 | +0.0% | +0.00u | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 4 | 2-2 | 50.0% | 4.3u | +0.15u | +3.4% | +0.04u | 4 | +3.4% | +1.23u | thin |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 7 | 5-2 | 71.4% | 30.9u | +7.63u | +24.7% | 7 | +24.7% | +1.23u |
| Tape HOLD (mid) | TAPE | staked | 21 | 9-12 | 42.9% | 59.8u | -14.72u | -24.6% | 21 | -24.6% | -8.23u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 10 | 6-4 | 60.0% | 31.5u | -5.33u | -16.9% | 10 | -16.9% | +0.00u |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 4 | 4-0 | 100.0% | 4.0u | +3.32u | +83.1% | 4 | +83.1% | +1.96u |
| fadeTop≥60 MUTE | E | CF 1u | 1 | 0-1 | 0.0% | 1.0u | -1.00u | -100.0% | 1 | -100.0% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 428 | 206-222 | 48.1% | 428.0u | -19.12u | -4.5% | 30 | +19.2% | -1.00u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| TOP | 8 / -34% | 5 / +7% | 4 / -16% |
| RANK | 2 / -7% | 1 / +86% | — |
| SHARP | 3 / -100% | — | 1 / -100% |
| SHARP-LEAN | 3 / +18% | — | — |
| MINI | 3 / +36% | — | 4 / +1% |
| MINI- | — | — | 1 / +0% |
| DISSENT | 2 / -4% | 1 / +91% | — |

### (D) Last graded day movers (2026-07-19)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| DISSENT rescue | 1 | 1-0 | +1.23u | +91.1% |
| SHARP-LEAN EDGE/net ONE | 3 | 2-1 | +0.81u | +18.0% |
| MINI (gate-pass) | 2 | 1-1 | +0.11u | +2.0% |
| MINI- (gate-cut) | 1 | 1-0 | +0.00u | +0.0% |
| RANK 2-for-0 rescue | 2 | 1-1 | -0.58u | -7.3% |
| SHARP EDGE/net BOTH | 1 | 0-1 | -3.75u | -100.0% |
| HC-1 TOP | 3 | 1-2 | -4.82u | -48.2% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| TOP PICK (TOP+/TOP)       |  4-5u |  89 | 49-36  |  57.6% |      342.10 |      +0.00 |      0.0% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u |  88 | 44-43  |  50.6% |      292.65 |      -4.98 |     -1.7% |
| STRONG (MINI)             |    3u |  45 | 23-21  |  52.3% |      127.50 |      -6.42 |     -5.0% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  21 | 12-8   |  60.0% |       20.35 |      +0.86 |      4.2% |
| **STAKED TOTAL** |     — | 249 | 138-111 |  55.4% |      844.10 |     +17.34 |     +2.1% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u |  60 | 34-22  |  60.7% |      209.60 |     +11.94 |      5.7% |
| B · 2-for-0 rescue    | RANK        |    4u |  41 | 25-16  |  61.0% |      163.40 |     +20.72 |     12.7% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u |   4 | 2-1    |  66.7% |        4.50 |      +0.81 |     18.0% |
| C · proven-$ consensus | SHARP       |    3u |  29 | 11-18  |  37.9% |       75.75 |     -19.90 |    -26.3% |
| A · mini-HC (gate-pass) | MINI        |    3u |  45 | 23-21  |  52.3% |      127.50 |      -6.42 |     -5.0% |
| C · mini gate-cut     | MINI-       |    1u |  11 | 8-3    |  72.7% |       11.00 |      +2.73 |     24.8% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |   4 | 2-2    |  50.0% |        4.35 |      +0.15 |      3.4% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 352 picks tracked at 0u (would-be 165-187, 46.9% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (10-3, +27.88u)  ·  🟢 TOP PICK (52-37, +0.00u)  ·  🟠 SHARP PLAY (45-43, -4.98u)  ·  🔴 STRONG (24-21, -6.42u)  ·  🟣 LEAN (12-9, +0.86u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19"]
    y-axis "PnL (u)" -14 --> 31
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `1.5·(EDGE/10) + 2·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 115 | 110 | 97 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 4 | 4-0 | 100.0% | 0.00u | +0.00u | — |
| HOLD      | 22 | 9-13 | 40.9% | 62.75u | -17.72u | -28.2% |
| BOOST     | 7 | 5-2 | 71.4% | 30.85u | +7.63u | +24.7% |
| FAIL_OPEN | 10 | 6-4 | 60.0% | 31.50u | -5.33u | -16.9% |
| PASS      | 54 | 28-26 | 51.9% | 0.00u | +0.00u | — |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 26 | 17-9 | 65.4% | -8.00u |
| hold (0–2.89) | path u | 38 | 17-21 | 44.7% | -8.22u |
| boost (≥2.89) | ×1.35 | 14 | 7-7 | 50.0% | +1.98u |

_Score coverage: **78/97** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 4 | +10.10u | -10.10u | +0.00u | +10.10u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 7 | +6.57u | +7.63u | +1.06u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-07-20 | MLB | Chicago Cubs | SHARP~ | -0.29 | MUTE | 0.75u | 0.00u | — |
| 2026-07-20 | MLB | Milwaukee Brewers | SHARP~ | -0.29 | MUTE | 0.75u | 0.00u | — |
| 2026-07-19 | MLB | Los Angeles Dodgers | SHARP~ | -1.73 | MUTE | 1.50u | 0.00u | WIN |
| 2026-07-19 | MLB | Pittsburgh Pirates | HC-1 | -1.35 | MUTE | 4.00u | 0.00u | WIN |
| 2026-07-19 | MLB | Under 8.5 | PATH-D | 4.53 | BOOST | 1.00u | 1.35u | WIN |
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
| ≥ 2026-07-15 | 39 | 21-18 | 53.8% | 124.60u | -9.02u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 39/39 | 2.00 | 2.72 | -0.72 | 2.00 | 2.00 |
| depth   | #A sharps        | 39/39 | 1.14 | 1.44 | -0.30 | 1.00 | 0.50 |
| depth   | #F − #A          | 39/39 | 0.86 | 1.28 | -0.42 | 1.00 | 1.50 |
| depth   | proven F         | 39/39 | 1.33 | 1.39 | -0.06 | 1.00 | 1.00 |
| depth   | proven A         | 39/39 | 0.24 | 0.44 | -0.21 | 0.00 | 0.00 |
| depth   | proven F−A       | 39/39 | 1.10 | 0.94 | +0.15 | 1.00 | 1.00 |
| depth   | v12 F count      | 39/39 | 1.81 | 2.67 | -0.86 | 2.00 | 2.00 |
| depth   | v12 A count      | 39/39 | 1.05 | 1.22 | -0.17 | 1.00 | 0.50 |
| depth   | WA ForN          | 39/39 | 1.38 | 2.28 | -0.90 | 1.00 | 1.50 |
| depth   | WA AgN           | 39/39 | 0.67 | 1.06 | -0.39 | 0.00 | 0.00 |
| depth   | CLV ForN         | 38/39 | 1.85 | 2.78 | -0.93 | 2.00 | 2.00 |
| depth   | CLV AgN          | 38/39 | 1.00 | 1.28 | -0.28 | 1.00 | 0.50 |
| depth   | unopposed (A=0)  | 39/39 | 0.33 | 0.50 | -0.17 | 0.00 | 0.50 |
| quality | ForWR            | 35/39 | 52.97 | 51.31 | +1.66 | 52.80 | 52.70 |
| quality | AgWR             | 15/39 | 37.11 | 43.29 | -6.17 | 36.30 | 46.01 |
| quality | TopFor WR        | 35/39 | 54.34 | 55.30 | -0.96 | 54.50 | 55.60 |
| quality | TopAg WR         | 15/39 | 40.18 | 47.88 | -7.71 | 37.30 | 50.10 |
| quality | EDGE             | 35/39 | 9.42 | 3.68 | +5.73 | 5.60 | 3.80 |
| quality | ForCLV           | 38/39 | 66.94 | 68.22 | -1.28 | 68.85 | 69.06 |
| quality | AgCLV            | 22/39 | 60.28 | 56.72 | +3.55 | 63.69 | 62.78 |
| quality | netCLV           | 38/39 | 6.06 | 8.86 | -2.80 | 5.50 | 6.55 |
| quality | Tape             | 34/39 | 2.98 | 2.38 | +0.60 | 2.09 | 1.92 |
| quality | V12 score        | 39/39 | 0.91 | 0.82 | +0.09 | 0.95 | 0.96 |
| quality | V12 forMean      | 39/39 | 14.75 | 13.85 | +0.90 | 10.37 | 12.38 |
| quality | V12 agMean       | 39/39 | 0.16 | 0.15 | +0.02 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | AgWR             | quality | 15/39 | 0.204 | -0.389 | -0.481 | -6.17 | 🟢 sep OK |
|    2 | TopAg WR         | quality | 15/39 | 0.278 | -0.311 | -0.399 | -7.71 | 🟢 sep OK |
|    3 | EDGE             | quality | 35/39 | 0.676 | +0.238 | +0.361 | +5.73 | 🟢 sep OK |
|    4 | CLV ForN         | depth   | 38/39 | 0.358 | +0.034 | -0.312 | -0.93 | 🔴 inverted |
|    5 | WA ForN          | depth   | 39/39 | 0.368 | +0.018 | -0.304 | -0.90 | 🔴 inverted |
|    6 | TopFor WR        | quality | 35/39 | 0.369 | -0.044 | -0.203 | -0.96 | 🔴 inverted |
|    7 | #F − #A          | depth   | 39/39 | 0.378 | +0.013 | -0.092 | -0.42 | 🔴 inverted |
|    8 | unopposed (A=0)  | depth   | 39/39 | 0.378 | +0.316 | -0.167 | -0.17 | LOSS higher |
|    9 | v12 F count      | depth   | 39/39 | 0.397 | +0.093 | -0.298 | -0.86 | 🔴 inverted |
|   10 | #F sharps        | depth   | 39/39 | 0.413 | +0.060 | -0.231 | -0.72 | 🔴 inverted |
|   11 | ForWR            | quality | 35/39 | 0.585 | +0.098 | +0.229 | +1.66 | 🟢 sep OK |
|   12 | netCLV           | quality | 38/39 | 0.431 | -0.032 | -0.109 | -2.80 | 🟡 mild inv |
|   13 | AgCLV            | quality | 22/39 | 0.564 | +0.097 | +0.120 | +3.55 | 🟡 mild inv |
|   14 | ForCLV           | quality | 38/39 | 0.444 | +0.005 | -0.110 | -1.28 | 🟡 mild inv |
|   15 | Tape             | quality | 34/39 | 0.554 | +0.019 | +0.114 | +0.60 | 🟡 mild OK |
|   16 | V12 score        | quality | 39/39 | 0.548 | +0.163 | +0.214 | +0.09 | 🟡 mild OK |
|   17 | V12 agMean       | quality | 39/39 | 0.452 | +0.242 | +0.016 | +0.02 | 🟡 mild OK |
|   18 | v12 A count      | depth   | 39/39 | 0.542 | +0.078 | -0.057 | -0.17 | 🟡 mild inv |
|   19 | proven A         | depth   | 39/39 | 0.460 | +0.191 | -0.128 | -0.21 | flat |
|   20 | CLV AgN          | depth   | 38/39 | 0.539 | +0.048 | -0.087 | -0.28 | flat |
|   21 | V12 forMean      | quality | 39/39 | 0.537 | +0.056 | +0.034 | +0.90 | flat |
|   22 | #A sharps        | depth   | 39/39 | 0.526 | +0.014 | -0.085 | -0.30 | flat |
|   23 | WA AgN           | depth   | 39/39 | 0.524 | +0.134 | -0.121 | -0.39 | flat |
|   24 | proven F         | depth   | 39/39 | 0.481 | +0.161 | -0.052 | -0.06 | flat |
|   25 | proven F−A       | depth   | 39/39 | 0.492 | +0.388 | +0.086 | +0.15 | flat |

### (C) Working read

_N=39 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.676 · Δ +5.73 · higher on WINs (cov 35/39)
- **unopposed (A=0)** — AUC 0.378 · Δ -0.17 · higher on LOSSes (cov 39/39)
- **ForWR** — AUC 0.585 · Δ +1.66 · higher on WINs (cov 35/39)
- **Tape** — AUC 0.554 · Δ +0.60 · higher on WINs (cov 34/39)
- **V12 score** — AUC 0.548 · Δ +0.09 · higher on WINs (cov 39/39)
- **V12 agMean** — AUC 0.452 · Δ +0.02 · higher on LOSSes (cov 39/39)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 223n · 52.5% · -0.1%   | 46n · 58.7% · +1.5%    | 141n · 53.9% · +0.5%   | 410n · 53.7% · +0.3%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 35n · 68.6% · +22.9%   | —                      | —                      | 35n · 68.6% · +22.9%   |
| UFC   | 3n · 66.7% · -13.1%    | —                      | —                      | 3n · 66.7% · -13.1%    |
| WNBA  | 2n · 100.0% · +77.3%   | 2n · 50.0% · -48.2%    | —                      | 4n · 75.0% · +14.5%    |
| **All** | **270n · 54.4% · +3.8%** | **52n · 59.6% · +4.0%** | **146n · 54.1% · +1.2%** | **468n · 54.9% · +2.9%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **592** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  592 |
| Muted W-L                           |              286-306 |
| Muted Win %                         |                48.3% |
| Counterfactual PnL at flat 1u       |               -49.35 |
| Counterfactual ROI at flat 1u       |                -8.3% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-49.35u** at a flat 1u stake — a counterfactual ROI of **-8.3%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-07-19 | MLB   | ML     | Colorado Rockies        |  +141 | +0.974 | HC-1     |   5/0 |   3/0 |  50.8 |   71.0 |   +0.8 |  1.92 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-07-19 | MLB   | ML     | Philadelphia Phillies   |  +116 | +0.976 | MINI     |   2/0 |   1/0 |  54.8 |   69.8 |   +4.8 |  2.29 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-07-19 | MLB   | ML     | Arizona Diamondbacks    |  -117 | +0.954 | 2-for-0  |   2/0 |   1/0 |  54.8 |   69.8 |   +4.8 |  2.29 | HOLD     | 4.00u | WIN     |      +3.42 |
| 2026-07-19 | MLB   | ML     | Tampa Bay Rays          |  +111 | +0.954 | 2-for-0  |   5/0 |   1/0 |  44.7 |   59.0 |   -5.3 | -1.39 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-07-19 | MLB   | ML     | Atlanta Braves          |  +107 | +0.983 | HC-1     |   2/0 |   1/0 |  54.8 |   69.8 |   +4.8 |  2.29 | HOLD     | 2.50u | WIN     |      +2.68 |
| 2026-07-19 | MLB   | ML     | Athletics               |  +134 | +0.942 | SHARP~   |   2/0 |   1/0 |  47.8 |   67.3 |   -2.3 |  0.72 | HOLD     | 1.50u | LOSS    |      -1.50 |
| 2026-07-19 | MLB   | SPREAD | Los Angeles Dodgers     |     0 | +0.989 | MINI-    |   1/0 |   1/0 |     — |   40.0 |      — |     — | FAIL_OPEN | 1.00u | WIN     |      +0.00 |
| 2026-07-19 | MLB   | SPREAD | Philadelphia Phillies   |  -148 | +0.993 | HC-1     |   1/0 |   1/0 |  58.2 |   70.1 |   +8.2 |  2.86 | HOLD     | 5.00u | LOSS    |      -5.00 |
| 2026-07-19 | MLB   | SPREAD | Atlanta Braves          |  -156 | +0.885 | SHARP~   |   2/1 |   1/0 |  49.4 |   62.4 |  +12.1 |  1.42 | HOLD     | 1.50u | WIN     |      +0.96 |
| 2026-07-19 | WNBA  | SPREAD | Los Angeles Sparks      |  -111 | +0.946 | SHARP~   |   2/2 |   2/0 |  50.0 |   67.2 |   +0.0 |  1.45 | HOLD     | 1.50u | WIN     |      +1.35 |
| 2026-07-19 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.943 | PATH-D   |   1/2 |   1/0 |  55.5 |   72.7 |  +19.2 |  4.53 | BOOST    | 1.35u | WIN     |      +1.23 |
| 2026-07-19 | MLB   | TOTAL  | Under 8.5               |  -110 | +0.970 | SHARP    |   1/0 |   1/0 |  58.2 |   70.1 |   +8.2 |  2.86 | HOLD     | 3.75u | LOSS    |      -3.75 |
| 2026-07-19 | MLB   | TOTAL  | Under 8.5               |  -115 | +0.956 | MINI     |   6/1 |   2/1 |  49.2 |   68.8 |   -0.8 |  1.03 | HOLD     | 3.00u | WIN     |      +2.61 |
| 2026-07-18 | MLB   | ML     | Chicago White Sox       |  -112 | +0.843 | HC-1     |   4/1 |   2/0 |  49.6 |   61.6 |   +2.2 |  1.68 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-07-18 | MLB   | ML     | Detroit Tigers          |  -190 | +0.901 | HC-1     |   2/1 |   2/0 |  51.4 |   61.1 |  +17.5 |  2.09 | HOLD     | 4.00u | WIN     |      +2.11 |
| 2026-07-18 | MLB   | ML     | Los Angeles Dodgers     |  -109 | +0.471 | PATH-D   |   1/2 |   1/2 |  52.7 |   68.8 |   +5.4 |  1.21 | HOLD     | 1.00u | WIN     |      +0.92 |
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

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.524 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.079 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.019 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.007 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.036 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  463 |    +0.0849 |    -0.0496 | 0.0004 |  +0.019 |   0.953 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  463 |    +0.0831 |    +0.4765 | 0.0013 |  +0.036 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  463 |    -0.2074 |    +0.2551 | 0.0002 |  -0.015 |   2.925 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 463 |          +0.058 |           -0.004 |                   +0.042 |                   -0.019 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 463 |          -0.016 |           +0.313 |                   +0.000 |                   +0.092 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 463 |          +0.003 |           +0.218 |                   -0.021 |                   +0.036 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 463 |          -0.025 |           +0.137 |                   +0.000 |                   +0.072 | count of contributing AGAINST-side wallets                     |
| provenFor         | 463 |          +0.022 |           +0.228 |                   +0.003 |                   +0.063 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 463 |          -0.003 |           +0.111 |                   +0.012 |                   +0.040 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.800         | 155 | 88-67   |   56.8% |     +3.9% |
| MID (p33–p67)     | 19.950 … 16.200        | 154 | 80-74   |   51.9% |     -0.8% |
| HIGH (> p67)      | 48.906 … 66.744        | 154 | 86-68   |   55.8% |     +0.5% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       463 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8676 | average score across live picks                                 |
| SD                |    0.2139 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.311 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +4.564 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.530 / +0.962 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  406 | 218-188 |   53.7% |     +0.1% |  0.508 |        -0.050 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   34 | 23-11  |   67.6% |    +22.6% |  0.522 |        -0.183 | noise                                     |
| UFC   |    3 | 2-1    |   66.7% |    -13.1% |  1.000 |        +1.000 | strong (N<20)                             |
| WNBA  |    4 | 3-1    |   75.0% |    +14.5% |  0.000 |        -0.800 | anti-signal (N<20)                        |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19"]
    y-axis "AUC" 0.4 --> 0.8
    line [0.453, 0.492, 0.502, 0.469, 0.54, 0.539, 0.551, 0.542, 0.553, 0.611, 0.76, 0.719, 0.63, 0.581]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19"]
    y-axis "edge (pp)" -15 --> 7
    line [5.1, 4.2, -1.7, 2.3, 5.8, 5.3, -0.4, -3, -5.3, -0.6, -8.9, -13.8, -13.3, -4.4]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
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
| 2026-07-18 |    7 |   37 | 15-22  |   40.5% |    -23.9% |  0.630 |     -13.3pp |
| 2026-07-19 |    7 |   45 | 22-23  |   48.9% |    -13.3% |  0.581 |      -4.4pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.513 avg in first half → 0.538 avg in second half · Δ = +0.025)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +2.9% | [-6.3%, +11.8%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.9% | [50.3%, 59.4%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.524 | [0.470, 0.578]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             46 | [3, 87]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       468 |
| Unique wallets ever on a FOR side            |                                                       146 |
| Avg FOR-side wallets per pick                |                                                      3.00 |
| Top-5 wallets' share of all FOR appearances  |                                                     30.5% |
| Top-10 wallets' share of all FOR appearances |                                                     46.3% |
| Top-20 wallets' share of all FOR appearances |                                                     64.6% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    2 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    3 | 4c64aa  | MLB        |   89 |    9 | 47-42  |   52.8% |     -2.0% |     -3.48 |     0.84× | WR50        |     -2.1% |     306 | 2026-07-11 |
|    4 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     501 | 2026-07-10 |
|    5 | 2f2a9e  | MLB,SOC,WNBA |   67 |   28 | 35-32  |   52.2% |     -9.6% |    -18.11 |     2.15× | CONFIRMED   |    -10.7% |     232 | 2026-07-19 |
|    6 | cd2f63  | MLB,NBA,SOC,WNBA |   54 |   32 | 28-26  |   51.9% |     +9.2% |    +13.87 |     1.62× | CONFIRMED   |    +12.3% |     377 | 2026-07-19 |
|    7 | eeabaf  | MLB,NBA,SOC |   48 |    8 | 27-21  |   56.3% |     +8.6% |    +12.20 |     1.30× | CONFIRMED   |    +17.3% |     179 | 2026-07-08 |
|    8 | 0f9d74  | MLB,NBA,SOC,UFC |   44 |   22 | 21-23  |   47.7% |     -3.6% |     -4.60 |     0.55× | CONFIRMED   |    +25.9% |     190 | 2026-07-19 |
|    9 | 0cd77e  | MLB,SOC,UFC |   42 |    3 | 24-18  |   57.1% |     +8.5% |    +12.93 |     1.51× | CONFIRMED   |     +9.8% |      82 | 2026-07-19 |
|   10 | 4b912c  | MLB,SOC    |   34 |   12 | 19-15  |   55.9% |     +6.9% |     +8.00 |     1.33× | CONFIRMED   |     -9.4% |     111 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   32 |   13 | 20-12  |   62.5% |    +40.7% |    +25.29 |     0.70× | CONFIRMED   |     +8.8% |     165 | 2026-07-19 |
|   12 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   13 | 7da3d5  | MLB,SOC,UFC,WNBA |   27 |   23 | 10-17  |   37.0% |    -31.6% |    -26.35 |     4.92× | CONFIRMED   |    -15.3% |     115 | 2026-07-19 |
|   14 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   26 |   20 | 13-13  |   50.0% |    -10.2% |     -7.47 |     1.36× | CONFIRMED   |    +14.6% |     120 | 2026-07-19 |
|   16 | 491f30  | MLB,SOC    |   25 |    4 | 17-8   |   68.0% |    +43.8% |    +35.89 |     0.95× | CONFIRMED   |     -8.8% |      64 | 2026-07-01 |
|   17 | bc35e3  | MLB,SOC,WNBA |   25 |   12 | 14-11  |   56.0% |     +6.1% |     +4.81 |     1.26× | CONFIRMED   |     +4.8% |     106 | 2026-07-19 |
|   18 | a82a75  | MLB,SOC,UFC |   23 |    6 | 12-11  |   52.2% |     +2.5% |     +2.00 |     0.85× | CONFIRMED   |     -0.2% |      64 | 2026-07-19 |
|   19 | f2f960  | MLB        |   22 |    8 | 11-11  |   50.0% |     -9.0% |     -6.89 |     2.41× | WR50        |     -4.4% |      54 | 2026-07-19 |
|   20 | c911a4  | MLB,NBA,SOC |   21 |   12 | 11-10  |   52.4% |    +17.0% |    +10.19 |     4.63× | CONFIRMED   |    +54.3% |      77 | 2026-07-14 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   14 | 11-3   |   78.6% |     +57.0% |    +26.49 |     1.13× | 2026-07-11 |
|    2 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    3 | 7923c4  | MLB,NBA,UFC |   32 | 20-12  |   62.5% |     +40.7% |    +25.29 |     0.70× | 2026-07-19 |
|    4 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    5 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|    6 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|    7 | c911a4  | MLB,NBA,SOC |   21 | 11-10  |   52.4% |     +17.0% |    +10.19 |     4.63× | 2026-07-14 |
|    8 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 | 64-37  |   63.4% |     +15.8% |    +53.36 |     1.54× | 2026-07-19 |
|    9 | 9a69c2  | MLB,SOC    |   26 | 14-12  |   53.8% |     +14.8% |     +9.18 |     2.30× | 2026-07-10 |
|   10 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |
|   11 | b839b3  | MLB,NBA,SOC,UFC |   15 | 9-6    |   60.0% |     +12.2% |     +6.13 |     1.43× | 2026-07-18 |
|   12 | cd2f63  | MLB,NBA,SOC,WNBA |   54 | 28-26  |   51.9% |      +9.2% |    +13.87 |     1.62× | 2026-07-19 |
|   13 | eeabaf  | MLB,NBA,SOC |   48 | 27-21  |   56.3% |      +8.6% |    +12.20 |     1.30× | 2026-07-08 |
|   14 | 0cd77e  | MLB,SOC,UFC |   42 | 24-18  |   57.1% |      +8.5% |    +12.93 |     1.51× | 2026-07-19 |
|   15 | 4b912c  | MLB,SOC    |   34 | 19-15  |   55.9% |      +6.9% |     +8.00 |     1.33× | 2026-07-10 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 8ec926  | MLB        |   11 | 4-7    |   36.4% |     -37.5% |    -12.75 |     6.30× | 2026-07-19 |
|    3 | 7da3d5  | MLB,SOC,UFC,WNBA |   27 | 10-17  |   37.0% |     -31.6% |    -26.35 |     4.92× | 2026-07-19 |
|    4 | ac9705  | MLB        |   18 | 8-10   |   44.4% |     -11.5% |     -8.36 |     2.24× | 2026-07-10 |
|    5 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    6 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   26 | 13-13  |   50.0% |     -10.2% |     -7.47 |     1.36× | 2026-07-19 |
|    7 | c9bba3  | MLB,SOC    |   10 | 6-4    |   60.0% |      -9.9% |     -2.36 |     0.82× | 2026-07-18 |
|    8 | 2f2a9e  | MLB,SOC,WNBA |   67 | 35-32  |   52.2% |      -9.6% |    -18.11 |     2.15× | 2026-07-19 |
|    9 | f2f960  | MLB        |   22 | 11-11  |   50.0% |      -9.0% |     -6.89 |     2.41× | 2026-07-19 |
|   10 | 0f9d74  | MLB,NBA,SOC,UFC |   44 | 21-23  |   47.7% |      -3.6% |     -4.60 |     0.55× | 2026-07-19 |
|   11 | 4c64aa  | MLB        |   89 | 47-42  |   52.8% |      -2.0% |     -3.48 |     0.84× | 2026-07-11 |
|   12 | ad88a3  | MLB,SOC    |   17 | 9-8    |   52.9% |      -1.2% |     -0.73 |     0.27× | 2026-07-07 |
|   13 | a82a75  | MLB,SOC,UFC |   23 | 12-11  |   52.2% |      +2.5% |     +2.00 |     0.85× | 2026-07-19 |
|   14 | 70135d  | MLB,NBA    |   77 | 42-35  |   54.5% |      +4.7% |     +8.93 |     1.30× | 2026-07-10 |
|   15 | bc35e3  | MLB,SOC,WNBA |   25 | 14-11  |   56.0% |      +6.1% |     +4.81 |     1.26× | 2026-07-19 |

> 🔴 **5 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `7da3d5` (FOR# 27, ROI -31.6%), `1e8f33` (FOR# 94, ROI -10.7%), `bc44b0` (FOR# 26, ROI -10.2%), `2f2a9e` (FOR# 67, ROI -9.6%), `f2f960` (FOR# 22, ROI -9.0%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |   942 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   160 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     5 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    42 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   198 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            169 |        40 |   17 |    9 |  103 |                     66 |
| NBA   |            211 |        58 |   25 |   23 |  105 |                    106 |
| NHL   |            105 |        23 |    6 |   16 |   60 |                     45 |
| SOC   |            220 |        53 |   37 |    7 |  123 |                     97 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   50 |    468 | 592 | 257-211 |  54.9% |      2.9% |     +37.59 |    +0.08 | 0.502 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  408 |    +1.6pp |    +11.8pp |          +0.253 |   -0.047 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  406 |    +6.5pp |    +21.6pp |          +0.394 |   +0.108 |    +0.0306 | 🟢 better |
| v12 − v11          | +  357 |    -0.0pp |     +0.1pp |          +0.019 |   +0.058 |    +0.0144 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 410n 53.7% +0% | 10n 30.0% +29% | 6n 83.3% +38%  | 35n 68.6% +23% | 3n 66.7% -13%  | 4n 75.0% +15%  | 468n 54.9% +3% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 97n +3%       | 134n -2%      | 100n +15%     | 69n -6%       | 63n +10%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~1342 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 702 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 463 / 702 (66%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 463 / 702 (66%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 463 / 702 (66%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 463 / 702 (66%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 463 / 702 (66%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 463 / 702 (66%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 463 / 702 (66%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 702 / 702 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 702 / 702 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 702 / 702 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 702 / 702 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 702 / 702 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 702 / 702 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 695 / 702 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 693 / 702 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 702 / 702 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 701 / 702 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 422 / 702 (60%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 701 / 702 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 422 / 702 (60%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 421 / 702 (60%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 702 / 702 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 702 / 702 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 702 / 702 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 701 / 702 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 702 / 702 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd contribMargin     | 702 |      |    -0.041 |    -0.114 |      -0.070 |      -0.105 |  0.458 |
|    2 | wd maxForContrib     | 701 |      |    -0.065 |    -0.050 |      -0.066 |      -0.043 |  0.482 |
|    3 | wd forAvgSize        | 701 |      |    -0.035 |    +0.042 |      -0.055 |      -0.020 |  0.503 |
|    4 | wd contribFor        | 702 |      |    -0.041 |    -0.049 |      -0.050 |      -0.076 |  0.466 |
|    5 | qMargin              | 463 |  🟢  |    +0.064 |    -0.004 |      +0.044 |      -0.020 |  0.517 |
|    6 | wd agCount           | 422 |      |    +0.012 |    +0.278 |      +0.042 |      +0.109 |  0.492 |
|    7 | wd sizeMargin        | 421 |      |    -0.009 |    -0.005 |      -0.042 |      -0.061 |  0.492 |
|    8 | V12 forMean          | 463 |  🟢  |    +0.058 |    -0.004 |      +0.042 |      -0.019 |  0.515 |
|    9 | hcMargin             | 702 |      |    -0.015 |    +0.217 |      -0.036 |      +0.052 |  0.510 |
|   10 | wd forCount          | 701 |      |    -0.023 |    +0.112 |      -0.036 |      -0.018 |  0.470 |
|   11 | provenFor            | 702 |      |    -0.017 |    +0.075 |      -0.028 |      -0.035 |  0.495 |
|   12 | provenMargin         | 702 |      |    -0.002 |    +0.080 |      -0.025 |      -0.021 |  0.499 |
|   13 | provenTotal          | 702 |      |    -0.022 |    +0.050 |      -0.024 |      -0.027 |  0.496 |
|   14 | ags (v11)            | 702 |      |    +0.001 |    +0.015 |      -0.024 |      -0.057 |  0.508 |
|   15 | countMargin          | 463 |      |    +0.018 |    +0.162 |      -0.023 |      +0.005 |  0.489 |
|   16 | V12 forCount         | 463 |  🟢  |    +0.003 |    +0.218 |      -0.021 |      +0.036 |  0.507 |
|   17 | peakStars            | 702 |      |    -0.000 |    +0.073 |      -0.020 |      -0.017 |  0.495 |
|   18 | agsV12               | 463 |  🟢  |    +0.036 |    -0.019 |      +0.019 |      -0.007 |  0.524 |
|   19 | wd maxShare          | 702 |      |    +0.015 |    -0.064 |      +0.017 |      +0.012 |  0.514 |
|   20 | lockPinnProb         | 695 |      |    +0.148 |    +0.156 |      +0.016 |      -0.131 |  0.579 |
|   21 | wd agAvgSize         | 422 |      |    -0.041 |    -0.008 |      -0.016 |      +0.002 |  0.492 |
|   22 | wd contribAg         | 702 |      |    -0.008 |    +0.153 |      +0.014 |      +0.056 |  0.504 |
|   23 | provenAg             | 702 |      |    -0.024 |    +0.167 |      -0.011 |      +0.060 |  0.497 |
|   24 | V12 agMean           | 463 |  🟢  |    -0.016 |    +0.313 |      +0.000 |      +0.092 |  0.491 |
|   25 | V12 agCount          | 463 |  🟢  |    -0.025 |    +0.137 |      +0.000 |      +0.072 |  0.513 |
|   26 | clv                  | 693 |      |    +0.011 |    -0.024 |      +0.000 |      +0.004 |  0.519 |

> **Top 3 univariate features by PnL correlation:** `wd contribMargin` (r = -0.070), `wd maxForContrib` (r = -0.066), `wd forAvgSize` (r = -0.055).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd contribMargin` — r(unit-ret) = -0.070, AUC = 0.458. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd contribMargin` · r(unit-ret) = -0.070 · AUC = 0.458

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … 20.800         | 234 | 136-98  |   58.1% |     +4.1% |
| MID (p33–p67)     | 57.800 … 39.900          | 234 | 130-104 |   55.6% |     +0.8% |
| HIGH (> p67)      | 174.100 … 380.800        | 234 | 115-119 |   49.1% |     -3.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd maxForContrib` · r(unit-ret) = -0.066 · AUC = 0.482

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 20.800          | 234 | 127-107 |   54.3% |     +0.7% |
| MID (p33–p67)     | 64.600 … 65.100          | 233 | 135-98  |   57.9% |     +3.0% |
| HIGH (> p67)      | 100.000 … 132.400        | 234 | 119-115 |   50.9% |     -2.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd forAvgSize` · r(unit-ret) = -0.055 · AUC = 0.503

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.675 … 0.180            | 234 | 123-111 |   52.6% |     -0.1% |
| MID (p33–p67)     | 0.777 … 1.000            | 233 | 131-102 |   56.2% |     +2.0% |
| HIGH (> p67)      | 3.837 … 2.833            | 234 | 127-107 |   54.3% |     -0.6% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribFor` · r(unit-ret) = -0.050 · AUC = 0.466

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 59.900 … 20.800          | 234 | 130-104 |   55.6% |     +2.3% |
| MID (p33–p67)     | 89.000 … 99.700          | 234 | 143-91  |   61.1% |     +4.7% |
| HIGH (> p67)      | 212.200 … 392.600        | 234 | 108-126 |   46.2% |     -5.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.044 · AUC = 0.517

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.800           | 155 | 88-67   |   56.8% |     +4.2% |
| MID (p33–p67)     | 19.950 … 16.200          | 155 | 79-76   |   51.0% |     -1.6% |
| HIGH (> p67)      | 46.556 … 66.744          | 153 | 87-66   |   56.9% |     +1.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd contribMargin | wd maxForContrib | wd forAvgSize  | wd contribFor  | qMargin        | wd agCount     | wd sizeMargin  | V12 forMean    |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd contribMargin |  1.000         |         +0.519 |         +0.284 |         +0.783 |         +0.060 |         -0.091 |         +0.325 |         +0.091 |
| wd maxForContrib |         +0.519 |  1.000         |         +0.478 |         +0.671 |         +0.228 |         +0.362 |         +0.290 |         +0.309 |
| wd forAvgSize |         +0.284 |         +0.478 |  1.000         |         +0.421 |         +0.246 |         +0.251 |         +0.696 |         +0.324 |
| wd contribFor |         +0.783 |         +0.671 |         +0.421 |  1.000         |         +0.094 |         +0.517 |         +0.294 |         +0.207 |
| qMargin     |         +0.060 |         +0.228 |         +0.246 |         +0.094 |  1.000         |         +0.081 |         +0.190 |         +0.963 |
| wd agCount  |         -0.091 |         +0.362 |         +0.251 |         +0.517 |         +0.081 |  1.000         |         +0.075 |         +0.205 |
| wd sizeMargin |         +0.325 |         +0.290 |         +0.696 |         +0.294 |         +0.190 |         +0.075 |  1.000         |         +0.226 |
| V12 forMean |         +0.091 |         +0.309 |         +0.324 |         +0.207 |         +0.963 |         +0.205 |         +0.226 |  1.000         |

> 🔴 **Strong collinearity detected:** `qMargin` and `V12 forMean` have r = +0.963. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 304 picks · features = 8 (+ intercept) · multiple R² = **0.0197** · adjusted R² = **-0.0103** · residual sd = 0.954

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.3695 |   0.3136 | -1.18        |        1 |
|    2 | wd agCount           |     |    +0.2683 |   0.1847 | +1.45        |        2 |
|    3 | wd contribMargin     |     |    +0.2520 |   0.2675 | +0.94        |        3 |
|    4 | V12 forMean          |  🟢 |    +0.0863 |   0.2511 | +0.34        |        4 |
|    5 | qMargin              |  🟢 |    -0.0318 |   0.2431 | -0.13        |        5 |
|    6 | wd sizeMargin        |     |    -0.0278 |   0.0838 | -0.33        |        6 |
|    7 | wd maxForContrib     |     |    -0.0249 |   0.0792 | -0.31        |        7 |
|    8 | wd forAvgSize        |     |    -0.0206 |   0.0908 | -0.23        |        8 |
| —    | (intercept)          |     |    +0.0414 |   0.0547 |    +0.76 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.086), `qMargin` (β = -0.032)
- V12 IGNORES: `wd contribFor` (β = -0.370, t = -1.18), `wd agCount` (β = +0.268, t = +1.45), `wd contribMargin` (β = +0.252, t = +0.94), `wd sizeMargin` (β = -0.028, t = -0.33), `wd maxForContrib` (β = -0.025, t = -0.31), `wd forAvgSize` (β = -0.021, t = -0.23)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.525 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.564 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.039.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Adjusted R² of -0.0103 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*