# AGS-Unified — V12 Daily Monitor

**Generated:** Monday, August 24, 2026 at 9:31 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (85 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (85 days ago), V12 has evaluated **2463** picks, shipped **815** for real money (33.1% ship rate), and muted the other **1648**. On the shipped picks V12 has gone **445-370** (54.6% win), staked **2219.00u**, and returned **+110.16u** at **+5.0% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             85 |
| Picks V12 has evaluated             |                           2463 |
| Picks SHIPPED (units > 0)           |                            815 |
| Picks MUTED (score ≤ 0, FADE)       |                           1648 |
| Ship rate                           |                          33.1% |
| Live W-L                            |                        445-370 |
| Live Win %                          |                          54.6% |
| Live PnL (units)                    |                        +110.16 |
| Live ROI                            |                          +5.0% |
| Avg PnL / day                       |                         +1.30u |
| Most recent action (2026-08-26)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **5.0% ROI** across 815 live picks (+110.16u real PnL).
- Mute rule is **saving money** — the 1103 muted picks would have lost -66.38u at flat 1u (-6.0% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.30u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **209-177** · +6.1% ROI · +63.55u on 386 graded — see § 5.

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
| qConv | From **2026-08-03**: mute qConv &lt; expanding Q1 thr (Path C SHARP*; Path A + RANK + UNOPP/Q1 exempt) | → 0u |

**Stamps we keep for analysis (every shipped side):** depth (`#F/#A`, proven, V12 counts) + quality (ForWR, ForCLV, EDGE, Tape, qConv). Unopposed sides still get FOR numbers (EDGE uses AG prior 50). Compare WIN vs LOSS in § 5 / § 5q.

Odds cap clamps long dogs only (+121 / +151 / +200 → max 2.5 / 1.5 / 1.0u). **+120 or shorter is uncapped by odds** (still ≤6u global). Legacy ELITE→WEAK score-ladder units are **not** the live sizer — ignore them if you see them in old notes.

## § 3 — Daily Scoreboard

**Full book:** 85d · 815 live · 445-370 · **+110.16u** · +5.0% ROI · +1.30u/day.

_Prior to table (2026-06-01 → 2026-08-04): 588 live · 329-259 · +76.72u · cum through prior = +76.72u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-08-05 |        24 |    4 |    18 | 3-1        |  75.0% |     17.80 |      +6.95 |     39.0% |     +83.67 |
| 2026-08-06 |        19 |    3 |    15 | 1-2        |  33.3% |      7.00 |      -1.12 |    -16.0% |     +82.55 |
| 2026-08-07 |        37 |   10 |    22 | 3-7        |  30.0% |     22.50 |      -2.80 |    -12.4% |     +79.75 |
| 2026-08-08 |        29 |    6 |    18 | 4-2        |  66.7% |     22.70 |      +3.65 |     16.1% |     +83.40 |
| 2026-08-09 |        15 |    6 |     6 | 2-4        |  33.3% |     10.00 |      -5.78 |    -57.8% |     +77.62 |
| 2026-08-10 |        17 |    6 |     8 | 2-4        |  33.3% |     14.00 |      -3.58 |    -25.6% |     +74.04 |
| 2026-08-11 |        14 |    1 |    12 | 0-1        |   0.0% |      1.00 |      -1.00 |   -100.0% |     +73.04 |
| 2026-08-12 |        24 |    6 |    16 | 2-4        |  33.3% |     10.00 |      -5.58 |    -55.8% |     +67.46 |
| 2026-08-13 |        27 |   15 |     6 | 10-5       |  66.7% |     38.20 |     +14.06 |     36.8% |     +81.52 |
| 2026-08-14 |        19 |   10 |     8 | 6-4        |  60.0% |     19.90 |      +8.04 |     40.4% |     +89.56 |
| 2026-08-15 |        49 |   25 |    14 | 13-12      |  52.0% |     56.50 |      -1.79 |     -3.2% |     +87.77 |
| 2026-08-16 |        38 |   14 |    14 | 7-7        |  50.0% |     29.80 |      +0.93 |      3.1% |     +88.70 |
| 2026-08-17 |        26 |   13 |     6 | 6-7        |  46.2% |     34.80 |      +8.82 |     25.3% |     +97.52 |
| 2026-08-18 |        51 |   24 |    12 | 13-11      |  54.2% |     45.90 |      +3.07 |      6.7% |    +100.59 |
| 2026-08-19 |        41 |   13 |    18 | 6-7        |  46.2% |     18.50 |      +1.20 |      6.5% |    +101.79 |
| 2026-08-20 |        35 |   12 |    17 | 4-8        |  33.3% |     37.60 |      -5.27 |    -14.0% |     +96.52 |
| 2026-08-21 |        47 |   18 |    23 | 10-8       |  55.6% |     42.20 |      -5.56 |    -13.2% |     +90.96 |
| 2026-08-22 |        69 |   20 |    36 | 12-8       |  60.0% |     58.80 |      +7.20 |     12.2% |     +98.16 |
| 2026-08-23 |        58 |   21 |    23 | 12-9       |  57.1% |     36.40 |     +12.00 |     33.0% |    +110.16 |
| 2026-08-24 |        12 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +110.16 |
| 2026-08-26 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +110.16 |

> **Trajectory.** 🟢 Last 3 days (33.0% ROI) **+28.5pp** vs prior (4.5%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-23**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 15 | 11-4 | +43.2% | +27.41u | +1.83u | -23.5% |
| 🟢 2 | RANK 2-for-0 rescue | B | 88 | 50-38 | +13.3% | +42.71u | +0.49u | -3.7% |
| 🟢 3 | MINI- (gate-cut) | C | 20 | 12-8 | +11.8% | +3.12u | +0.16u | -38.3% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 93 | 60-33 | +17.7% | +75.32u | sized UP after path |
| 2 | Tape HOLD (mid) | 254 | 131-123 | +0.6% | +3.17u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Tape MUTE (tape<0 → 0u) | 66 | 32-34 | -6.1% | -4.01u | 🟢 saving $ |
| 2 | fadeTop≥60 MUTE | 6 | 3-3 | -2.6% | -0.15u | 🟡 flat |
| 3 | Score FADE (≤0 → 0u) | 634 | 314-320 | -2.1% | -13.42u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 15 | 11-4 | 73.3% | 63.5u | +27.41u | +43.2% | +1.83u | 2 | -23.5% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 99 | 59-40 | 59.6% | 367.5u | +15.33u | +4.2% | +0.15u | 15 | -11.1% | — | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 88 | 50-38 | 56.8% | 320.0u | +42.71u | +13.3% | +0.49u | 16 | -3.7% | +11.27u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 69 | 33-36 | 47.8% | 223.2u | -7.05u | -3.2% | -0.10u | 7 | -0.5% | +6.10u | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 91 | 49-42 | 53.8% | 248.0u | +10.62u | +4.3% | +0.12u | 20 | +28.5% | — | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 79 | 47-32 | 59.5% | 211.8u | +19.37u | +9.1% | +0.25u | 16 | +55.9% | +0.00u | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 5 | -38.3% | +0.85u | 🔻 cooling |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 22 | 12-10 | 54.5% | 22.4u | +1.89u | +8.5% | +0.09u | 4 | +0.3% | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 93 | 60-33 | 64.5% | 424.7u | +75.32u | +17.7% | 29 | +18.4% | +13.42u |
| Tape HOLD (mid) | TAPE | staked | 254 | 131-123 | 51.6% | 545.1u | +3.17u | +0.6% | 90 | +0.8% | -1.81u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 7 | -11.4% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 66 | 32-34 | 48.5% | 66.0u | -4.01u | -6.1% | 27 | -24.9% | -1.61u |
| fadeTop≥60 MUTE | E | CF 1u | 6 | 3-3 | 50.0% | 6.0u | -0.15u | -2.6% | 4 | -3.8% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 634 | 314-320 | 49.5% | 634.0u | -13.42u | -2.1% | 85 | +10.8% | +1.75u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 2 / -24% | — | — |
| TOP | 34 / -3% | 21 / +2% | 4 / -16% |
| RANK | 43 / +4% | 6 / +62% | — |
| SHARP | 14 / -13% | 29 / +6% | 1 / -100% |
| SHARP-LEAN | 65 / +0% | 23 / +11% | 3 / -30% |
| MINI | 30 / +11% | 8 / +56% | 4 / +1% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 13 / +19% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-08-23)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| RANK 2-for-0 rescue | 3 | 3-0 | +11.27u | +93.9% |
| SHARP EDGE/net BOTH | 1 | 1-0 | +6.10u | +113.0% |
| MINI- (gate-cut) | 1 | 1-0 | +0.85u | +85.0% |
| MINI (gate-pass) | 2 | 1-1 | +0.00u | +0.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  16 | 11-4   |  73.3% |       63.50 |     +27.41 |     43.2% |
| TOP PICK (TOP+/TOP)       |  4-5u | 171 | 74-54  |  57.8% |      500.00 |      +3.39 |      0.7% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 439 | 138-124 |  52.7% |      840.15 |     +39.67 |      4.7% |
| STRONG (MINI)             |    3u |  96 | 47-32  |  59.5% |      211.75 |     +19.37 |      9.1% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  80 | 26-21  |  55.3% |       53.85 |      +2.99 |      5.6% |
| **STAKED TOTAL** |     — | 531 | 296-235 |  55.7% |     1669.25 |     +92.83 |     +5.6% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  16 | 11-4   |  73.3% |       63.50 |     +27.41 |     43.2% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 142 | 59-40  |  59.6% |      367.50 |     +15.33 |      4.2% |
| B · 2-for-0 rescue    | RANK        |    4u | 118 | 50-38  |  56.8% |      319.95 |     +42.71 |     13.3% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 216 | 49-42  |  53.8% |      248.04 |     +10.62 |      4.3% |
| C · proven-$ consensus | SHARP       |    3u |  91 | 33-36  |  47.8% |      223.16 |      -7.05 |     -3.2% |
| A · mini-HC (gate-pass) | MINI        |    3u |  96 | 47-32  |  59.5% |      211.75 |     +19.37 |      9.1% |
| C · mini gate-cut     | MINI-       |    1u |  24 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  50 | 12-10  |  54.5% |       22.35 |      +1.89 |      8.5% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 532 picks tracked at 0u (would-be 258-274, 48.5% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (11-5, +27.41u)  ·  🟢 TOP PICK (95-76, +3.39u)  ·  🟠 SHARP PLAY (222-217, +39.67u)  ·  🔴 STRONG (59-37, +19.37u)  ·  🟣 LEAN (41-39, +2.99u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23"]
    y-axis "PnL (u)" -14 --> 44
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 51, 50, 51]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 1151 | 1143 | 1117 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 66 | 32-34 | 48.5% | 8.00u | -1.05u | -13.1% |
| HOLD      | 336 | 162-174 | 48.2% | 548.07u | +0.17u | +0.0% |
| BOOST     | 117 | 73-44 | 62.4% | 428.18u | +77.40u | +18.1% |
| FAIL_OPEN | 35 | 18-17 | 51.4% | 54.50u | -15.17u | -27.8% |
| PASS      | 563 | 290-273 | 51.5% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 349 | 183-166 | 52.4% | -2.83u |
| hold (0–2.89) | path u | 496 | 240-256 | 48.4% | +6.33u |
| boost (≥2.89) | ×1.35 | 137 | 82-55 | 59.9% | +71.75u |

_Score coverage: **982/1117** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 66 | +5.96u | -5.96u | +38.75u | +44.71u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 95 | +55.71u | +77.40u | +21.69u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-24 | MLB | Seattle Mariners | CONFIRMED-UNOPP | -0.46 | MUTE | 1.00u | 1.00u | — |
| 2026-08-24 | MLB | Under 7.5 | SHARP | 4.75 | BOOST | 4.00u | 5.40u | — |
| 2026-08-23 | MLB | Cincinnati Reds | CONFIRMED-UNOPP | -0.62 | MUTE | 1.00u | 1.00u | LOSS |
| 2026-08-23 | MLB | Los Angeles Angels | PATH-D | -1.16 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-23 | MLB | Minnesota Twins | MINI | -0.20 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-23 | SOC | FC Barcelona | CONFIRMED-UNOPP | -2.96 | MUTE | 1.00u | 1.00u | WIN |
| 2026-08-23 | SOC | Manchester City FC | CONFIRMED-UNOPP | -1.52 | MUTE | 1.00u | 1.00u | WIN |
| 2026-08-23 | SOC | Liverpool FC | CONFIRMED-UNOPP | 3.21 | BOOST | 1.00u | 0.00u | LOSS |
| 2026-08-23 | WNBA | Indiana Fever | MINI | 3.30 | BOOST | 3.00u | 0.00u | WIN |
| 2026-08-23 | WNBA | Toronto Tempo | SHARP | 6.24 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-23 | WNBA | Washington Mystics | 2-for-0 | 5.04 | BOOST | 5.00u | 6.00u | WIN |
| 2026-08-23 | MLB | Under 10.5 | CONFIRMED-UNOPP | -1.04 | MUTE | 1.00u | 1.00u | WIN |
| 2026-08-22 | MLB | Houston Astros | PATH-D | -0.81 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-22 | NFL | Bills | SHARP | 3.21 | BOOST | 2.50u | 0.00u | WIN |
| 2026-08-22 | NFL | Bengals | SHARP~ | 6.41 | BOOST | 2.50u | 0.00u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.84** · nPriors=510 · source=expanding_q1 · asOf=2026-08-24 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 705 | 629 | 613 | 133 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 51 | 18-33 | 35.3% | 8.00u | -4.21u | -52.6% |
| HOLD      | 159 | 86-73 | 54.1% | 175.10u | +34.88u | +19.9% |
| FAIL_OPEN | 25 | 12-13 | 48.0% | 41.90u | -2.08u | -5.0% |
| EXEMPT    | 208 | 103-105 | 49.5% | 298.60u | +4.85u | +1.6% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -48.5 … -1.4 | 23 | 6-17 | 26.1% | 0.0u | +0.00u | — |
| Q2 | -0.6 … 1.3 | 23 | 11-12 | 47.8% | 24.9u | +18.63u | +74.8% |
| Q3 | 1.3 … 6.3 | 24 | 12-12 | 50.0% | 35.1u | +0.47u | +1.3% |
| Q4 | 6.5 … 13.0 | 23 | 13-10 | 56.5% | 39.4u | +6.78u | +17.2% |
| Q5 | 13.9 … 1802.6 | 24 | 12-12 | 50.0% | 37.2u | +5.00u | +13.4% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 51 | 18-33 | -17.30u | +17.30u | +37.50u | +20.20u |

> 🟢 **Mute is saving money** (Δ +17.30u · muted WR 35.3%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 4 | 3-1 | 75.0% | 6.0u | +2.60u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 17 | 4-13 | 23.5% | 19.5u | -9.86u |
| MLB | 34 | 12-22 | 35.3% | 39.5u | -10.79u |
| SOC | 1 | 0-1 | 0.0% | 1.0u | -1.00u |
| WNBA | 16 | 6-10 | 37.5% | 18.0u | -5.51u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-08-23 | SOC | Liverpool FC | CONFIRMED-UNOPP | -121.0 | -1.2 | 1.00u | LOSS |
| 2026-08-23 | WNBA | Portland Fire | — | 1.6 | -1.2 | 1.00u | LOSS |
| 2026-08-23 | WNBA | Portland Fire | — | -2.2 | -1.2 | 1.00u | WIN |
| 2026-08-23 | MLB | Under 8.5 | CONFIRMED-UNOPP | -1.5 | -1.2 | 1.00u | LOSS |
| 2026-08-23 | MLB | Under 7.5 | SHARP~ | -10.6 | -1.2 | 1.00u | LOSS |
| 2026-08-23 | MLB | Over 7.5 | SHARP~ | -2.9 | -1.2 | 2.00u | WIN |
| 2026-08-23 | WNBA | Under 163.5 | CONFIRMED-UNOPP | -18.5 | -1.2 | 1.00u | LOSS |
| 2026-08-22 | MLB | Atlanta Braves | CONFIRMED-UNOPP | -32.4 | -0.8 | 1.00u | LOSS |
| 2026-08-22 | WNBA | Indiana Fever | — | -35.6 | -0.8 | 2.00u | LOSS |
| 2026-08-22 | MLB | Seattle Mariners | CONFIRMED-UNOPP | -4.6 | -0.8 | 1.00u | WIN |
| 2026-08-22 | WNBA | Atlanta Dream | — | 20.5 | -0.8 | 1.00u | WIN |
| 2026-08-22 | WNBA | Indiana Fever | SHARP~ | -29.4 | -0.8 | 2.00u | LOSS |
| 2026-08-21 | MLB | New York Mets | — | -7.6 | -0.8 | 1.00u | LOSS |
| 2026-08-21 | MLB | Pittsburgh Pirates | SHARP~ | -1.4 | -0.8 | 1.00u | LOSS |
| 2026-08-21 | MLB | Tampa Bay Rays | CONFIRMED-UNOPP | -12.9 | -0.8 | 1.00u | LOSS |
| 2026-08-21 | MLB | Over 7.5 | SHARP~ | -28.1 | -0.8 | 1.00u | LOSS |
| 2026-08-20 | MLB | New York Yankees | SHARP~ | -19.1 | -0.7 | 1.00u | WIN |
| 2026-08-20 | MLB | Cincinnati Reds | SHARP~ | -48.5 | -0.7 | 1.00u | LOSS |
| 2026-08-19 | MLB | Los Angeles Dodgers | SHARP~ | -1.8 | -0.2 | 1.00u | WIN |
| 2026-08-19 | MLB | Athletics | CONFIRMED-UNOPP | -47.6 | -0.2 | 1.00u | LOSS |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 51 | 29-22 | 56.9% | 136.6u | +30.88u | +22.6% |
| Muted (Q1 → 0u) | 51 | 18-33 | 35.3% | 8.0u | -4.21u | -52.6% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 121–67 · 64.4% · +18.8%); **5–10 is the hole** (63–58 · 52.1% · -3.7%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 597 tickets · cov 570/597 (stamp 368 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 261 | 131–130 | 50.2% | -5.4% |
| 5–10 | 121 | 63–58 | 52.1% | -3.7% |
| ≥10 | 188 | 121–67 | 64.4% | +18.8% |
| All | 597 | 327–270 | 54.8% | +5.1% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (99) | 58.6% (58) | 70.4% (81) |
| B | 52.5% (61) | 55.6% (9) | 72.2% (18) |
| C | 41.7% (36) | 46.8% (47) | 57.1% (84) |

##### Jul 15+ · 386 tickets · cov 365/386 (stamp 363 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 155 | 78–77 | 50.3% | -2.7% |
| 5–10 | 82 | 40–42 | 48.8% | -9.3% |
| ≥10 | 128 | 82–46 | 64.1% | +16.7% |
| All | 386 | 209–177 | 54.1% | +6.1% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 47.5% (40) | 58.6% (29) | 72.5% (40) |
| B | 51.4% (35) | 25% (4) | 72.7% (11) |
| C | 46.7% (15) | 47.6% (42) | 58.1% (74) |

##### Yesterday (Aug 23) · 21 tickets · cov 21/21 (stamp 21 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 17 | 8–9 | 47.1% | -12.9% |
| 5–10 | 2 | 2–0 | 100.0% | +77.0% |
| ≥10 | 2 | 2–0 | 100.0% | +117.7% |
| All | 21 | 12–9 | 57.1% | +33.0% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50% (2) | 100% (1) | — |
| B | 100% (2) | — | 100% (1) |
| C | — | — | 100% (1) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 597 tickets · cov 591/597 (stamp 380 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 384 | 208–176 | 54.2% | +1.9% |
| 5–10 | 106 | 57–49 | 53.8% | +12.1% |
| ≥10 | 101 | 60–41 | 59.4% | +11.1% |
| All | 597 | 327–270 | 54.8% | +5.1% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.5% (153) | 50% (44) | 73.5% (49) |
| B | 56.9% (65) | 58.3% (12) | 54.5% (11) |
| C | 49.5% (103) | 61.1% (36) | 42.9% (35) |

##### Jul 15+ · 386 tickets · cov 381/386 (stamp 380 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 234 | 130–104 | 55.6% | +6.7% |
| 5–10 | 83 | 44–39 | 53.0% | +13.6% |
| ≥10 | 64 | 33–31 | 51.6% | -3.2% |
| All | 386 | 209–177 | 54.1% | +6.1% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 64.4% (59) | 46.4% (28) | 64.3% (28) |
| B | 51.4% (37) | 62.5% (8) | 60% (5) |
| C | 53.9% (76) | 60.6% (33) | 38.5% (26) |

##### Yesterday (Aug 23) · 21 tickets · cov 21/21 (stamp 21 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 15 | 9–6 | 60.0% | +13.6% |
| 5–10 | 5 | 2–3 | 40.0% | +18.4% |
| ≥10 | 1 | 1–0 | 100.0% | +122.0% |
| All | 21 | 12–9 | 57.1% | +33.0% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 100% (1) | 50% (2) | — |
| B | 100% (2) | — | 100% (1) |
| C | — | 100% (1) | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 597 tickets · cov 570/597 (stamp 362 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 105 | 47–58 | 44.8% | -22.5% |
| 0–2.89 | 323 | 173–150 | 53.6% | +5.9% |
| ≥2.89 | 142 | 95–47 | 66.9% | +20.7% |
| All | 597 | 327–270 | 54.8% | +5.1% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 58.8% (131) | 75% (64) |
| B | 58.3% (24) | 52.9% (51) | 69.2% (13) |
| C | 18.2% (11) | 51% (98) | 56.9% (58) |

##### Jul 15+ · 386 tickets · cov 365/386 (stamp 362 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 36 | 19–17 | 52.8% | -4.7% |
| 0–2.89 | 232 | 119–113 | 51.3% | +0.7% |
| ≥2.89 | 97 | 62–35 | 63.9% | +16.7% |
| All | 386 | 209–177 | 54.1% | +6.1% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 54.1% (74) | 73.5% (34) |
| B | 50% (8) | 52.8% (36) | 66.7% (6) |
| C | — | 51.9% (79) | 55.8% (52) |

##### Yesterday (Aug 23) · 21 tickets · cov 21/21 (stamp 21 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 9 | 6–3 | 66.7% | +8.7% |
| 0–2.89 | 10 | 4–6 | 40.0% | -13.7% |
| ≥2.89 | 2 | 2–0 | 100.0% | +117.7% |
| All | 21 | 12–9 | 57.1% | +33.0% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 66.7% (3) | — |
| B | — | 100% (2) | 100% (1) |
| C | — | — | 100% (1) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 386 | 209-177 | 54.1% | 1042.75u | +63.55u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 386/386 | 2.24 | 2.26 | -0.02 | 2.00 | 2.00 |
| depth   | #A sharps        | 386/386 | 1.31 | 1.34 | -0.03 | 1.00 | 1.00 |
| depth   | #F − #A          | 386/386 | 0.93 | 0.92 | +0.02 | 1.00 | 1.00 |
| depth   | proven F         | 386/386 | 1.51 | 1.59 | -0.08 | 1.00 | 1.00 |
| depth   | proven A         | 386/386 | 0.46 | 0.45 | +0.01 | 0.00 | 0.00 |
| depth   | proven F−A       | 386/386 | 1.05 | 1.14 | -0.09 | 1.00 | 1.00 |
| depth   | v12 F count      | 386/386 | 2.22 | 2.30 | -0.08 | 2.00 | 2.00 |
| depth   | v12 A count      | 386/386 | 1.41 | 1.45 | -0.04 | 1.00 | 1.00 |
| depth   | WA ForN          | 386/386 | 1.66 | 1.84 | -0.19 | 1.00 | 2.00 |
| depth   | WA AgN           | 386/386 | 1.06 | 1.14 | -0.08 | 1.00 | 1.00 |
| depth   | CLV ForN         | 385/386 | 2.14 | 2.19 | -0.05 | 2.00 | 2.00 |
| depth   | CLV AgN          | 385/386 | 1.34 | 1.37 | -0.03 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 386/386 | 0.40 | 0.38 | +0.02 | 0.00 | 0.00 |
| quality | ForWR            | 363/386 | 56.96 | 54.57 | +2.39 | 54.31 | 53.41 |
| quality | AgWR             | 221/386 | 44.46 | 45.31 | -0.85 | 45.25 | 46.61 |
| quality | TopFor WR        | 363/386 | 59.51 | 58.28 | +1.23 | 55.60 | 55.60 |
| quality | TopAg WR         | 221/386 | 47.77 | 48.27 | -0.50 | 48.90 | 49.11 |
| quality | EDGE             | 363/386 | 10.11 | 7.30 | +2.81 | 7.70 | 5.21 |
| quality | ForCLV           | 380/386 | 66.89 | 65.62 | +1.28 | 65.89 | 66.00 |
| quality | AgCLV            | 246/386 | 63.26 | 61.88 | +1.39 | 63.75 | 63.89 |
| quality | netCLV           | 380/386 | 4.09 | 3.70 | +0.40 | 3.48 | 3.46 |
| quality | Tape             | 362/386 | 2.64 | 2.01 | +0.62 | 1.77 | 1.67 |
| quality | V12 score        | 386/386 | 0.85 | 0.84 | +0.01 | 0.96 | 0.95 |
| quality | V12 forMean      | 386/386 | 26.69 | 21.17 | +5.52 | 17.39 | 15.09 |
| quality | V12 agMean       | 386/386 | 1.59 | 1.48 | +0.11 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 363/386 | 0.568 | -0.026 | +0.131 | +2.81 | 🟡 mild OK |
|    2 | Tape             | quality | 362/386 | 0.557 | -0.023 | +0.111 | +0.62 | 🟡 mild OK |
|    3 | V12 forMean      | quality | 386/386 | 0.551 | +0.128 | +0.101 | +5.52 | 🟡 mild OK |
|    4 | ForWR            | quality | 363/386 | 0.543 | -0.046 | +0.124 | +2.39 | 🟡 mild OK |
|    5 | AgWR             | quality | 221/386 | 0.457 | +0.063 | -0.072 | -0.85 | 🟡 mild OK |
|    6 | WA ForN          | depth   | 386/386 | 0.462 | +0.199 | -0.080 | -0.19 | flat |
|    7 | AgCLV            | quality | 246/386 | 0.532 | -0.022 | +0.086 | +1.39 | flat |
|    8 | V12 score        | quality | 386/386 | 0.530 | +0.019 | +0.025 | +0.01 | flat |
|    9 | unopposed (A=0)  | depth   | 386/386 | 0.524 | +0.251 | +0.018 | +0.02 | flat |
|   10 | ForCLV           | quality | 380/386 | 0.523 | +0.010 | +0.074 | +1.28 | flat |
|   11 | TopFor WR        | quality | 363/386 | 0.523 | -0.008 | +0.060 | +1.23 | flat |
|   12 | proven F−A       | depth   | 386/386 | 0.485 | +0.197 | -0.045 | -0.09 | flat |
|   13 | proven F         | depth   | 386/386 | 0.486 | +0.300 | -0.050 | -0.08 | flat |
|   14 | #F − #A          | depth   | 386/386 | 0.487 | +0.130 | +0.005 | +0.02 | flat |
|   15 | proven A         | depth   | 386/386 | 0.511 | +0.297 | +0.008 | +0.01 | flat |
|   16 | #A sharps        | depth   | 386/386 | 0.510 | +0.141 | -0.010 | -0.03 | flat |
|   17 | CLV AgN          | depth   | 385/386 | 0.509 | +0.157 | -0.009 | -0.03 | flat |
|   18 | netCLV           | quality | 380/386 | 0.509 | +0.013 | +0.018 | +0.40 | flat |
|   19 | TopAg WR         | quality | 221/386 | 0.508 | +0.069 | -0.034 | -0.50 | flat |
|   20 | WA AgN           | depth   | 386/386 | 0.492 | +0.152 | -0.029 | -0.08 | flat |
|   21 | v12 F count      | depth   | 386/386 | 0.494 | +0.240 | -0.027 | -0.08 | flat |
|   22 | #F sharps        | depth   | 386/386 | 0.505 | +0.233 | -0.005 | -0.02 | flat |
|   23 | CLV ForN         | depth   | 385/386 | 0.497 | +0.227 | -0.017 | -0.05 | flat |
|   24 | v12 A count      | depth   | 386/386 | 0.503 | +0.154 | -0.013 | -0.04 | flat |
|   25 | V12 agMean       | quality | 386/386 | 0.499 | +0.341 | +0.014 | +0.11 | flat |

### (C) Working read

_N=386 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.568 · Δ +2.81 · higher on WINs (cov 363/386)
- **Tape** — AUC 0.557 · Δ +0.62 · higher on WINs (cov 362/386)
- **V12 forMean** — AUC 0.551 · Δ +5.52 · higher on WINs (cov 386/386)
- **ForWR** — AUC 0.543 · Δ +2.39 · higher on WINs (cov 363/386)
- **AgWR** — AUC 0.457 · Δ -0.85 · higher on LOSSes (cov 221/386)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. See `docs/SKILL_FEATURES.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 881 | 86 | 86 | 81 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 13 | 6-7 | 46.2% | 20.40u | -0.76u | -3.7% | -0.5 |
| on→off | 4 | 2-2 | 50.0% | 6.00u | +2.48u | +41.3% | +0.9 |
| off→on | 9 | 6-3 | 66.7% | 20.40u | +13.84u | +67.8% | +0.3 |
| off→off | 55 | 28-27 | 50.9% | 142.20u | -9.77u | -6.9% | -0.9 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 52 | 25-27 | 48.1% | 143.60u | +2.78u | +1.9% |
| 0–2 | 21 | 13-8 | 61.9% | 34.40u | +7.61u | +22.1% |
| 2–4 | 2 | 0-2 | 0.0% | 5.00u | -5.00u | -100.0% |
| 4+ | 6 | 4-2 | 66.7% | 6.00u | +0.40u | +6.7% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 348n · 52.6% · +3.0%   | 86n · 53.5% · -3.0%    | 239n · 51.0% · +0.8%   | 673n · 52.2% · +1.4%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 7n · 57.1% · -2.8%     | 1n · 100.0% · +85.0%   | 2n · 50.0% · -5.4%     | 10n · 60.0% · -1.2%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 40n · 70.0% · +23.1%   | —                      | —                      | 40n · 70.0% · +23.1%   |
| UFC   | 30n · 73.3% · +13.2%   | —                      | —                      | 30n · 73.3% · +13.2%   |
| WNBA  | 20n · 75.0% · +12.7%   | 15n · 53.3% · +30.9%   | 11n · 63.6% · +51.1%   | 46n · 65.2% · +26.5%   |
| **All** | **452n · 56.2% · +6.3%** | **106n · 54.7% · +5.4%** | **257n · 51.8% · +2.7%** | **815n · 54.6% · +5.0%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1103** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1103 |
| Muted W-L                           |              539-564 |
| Muted Win %                         |                48.9% |
| Counterfactual PnL at flat 1u       |               -66.38 |
| Counterfactual ROI at flat 1u       |                -6.0% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-66.38u** at a flat 1u stake — a counterfactual ROI of **-6.0%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-23 | MLB   | ML     | Milwaukee Brewers       |  -107 | +0.968 | CONFIRMED-UNOPP |   5/2 |   4/0 |  51.0 |   55.8 |   +1.7 | -0.20 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-23 | MLB   | ML     | Cincinnati Reds         |  +126 | +0.978 | CONFIRMED-UNOPP |   4/1 |   3/0 |  48.3 |   60.2 |   +0.6 | -0.62 | MUTE     | 1.00u | LOSS    |      -1.00 |
| 2026-08-23 | MLB   | ML     | Detroit Tigers          |  -104 | +0.985 | CONFIRMED-UNOPP |   2/1 |   2/1 |  52.1 |   68.0 |   +3.0 |  1.27 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-23 | MLB   | ML     | Houston Astros          |  -174 | +0.863 | CONFIRMED-UNOPP |   1/1 |   1/1 |  53.2 |   66.3 |   +4.1 |  1.25 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-23 | MLB   | ML     | Boston Red Sox          |  -194 | +0.992 | 2-for-0  |   2/0 |   2/0 |  53.0 |   64.8 |   +3.0 |  1.01 | HOLD     | 3.00u | WIN     |      +1.55 |
| 2026-08-23 | NFL   | ML     | Seahawks                |  +128 | +0.936 | CONFIRMED-UNOPP |   7/7 |   2/2 |  44.8 |   55.2 |   -2.0 | -2.36 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-23 | SOC   | ML     | FC Barcelona            |  -276 | +0.985 | CONFIRMED-UNOPP |   6/1 |   3/0 |  41.3 |   58.2 |   -8.7 | -2.96 | MUTE     | 1.00u | WIN     |      +0.36 |
| 2026-08-23 | SOC   | ML     | Manchester City FC      |  -205 | +0.978 | CONFIRMED-UNOPP |   7/0 |   4/0 |  43.6 |   60.4 |   -6.4 | -1.52 | MUTE     | 1.00u | WIN     |      +0.49 |
| 2026-08-23 | WNBA  | ML     | Indiana Fever           |  -125 | +0.869 | 2-for-0  |   7/0 |   2/0 |  54.2 |   57.9 |   +4.2 |  0.21 | HOLD     | 3.00u | WIN     |      +2.40 |
| 2026-08-23 | WNBA  | ML     | Las Vegas Aces          |  -674 | +0.895 | CONFIRMED-UNOPP |   5/0 |   1/1 |  43.3 |   52.5 |   -6.7 | -2.77 | HOLD     | 1.00u | WIN     |      +0.15 |
| 2026-08-23 | MLB   | SPREAD | Pittsburgh Pirates      |  +122 | +0.991 | MINI     |   1/0 |   1/0 |  51.0 |   69.5 |   +1.0 |  1.33 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-23 | MLB   | SPREAD | St. Louis Cardinals     |  -114 | +0.746 | CONFIRMED-Q1 |   2/1 |   2/1 |  49.1 |   76.2 |   -4.1 |  0.65 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-23 | NFL   | SPREAD | Seahawks                |  -117 | +0.890 | MINI-    |   3/3 |   1/1 |  49.0 |   64.5 |   +2.2 |  0.61 | HOLD     | 1.00u | WIN     |      +0.85 |
| 2026-08-23 | WNBA  | SPREAD | Toronto Tempo           |  +113 | +0.761 | SHARP    |   3/5 |   2/2 |  73.4 |   70.0 |  +26.3 |  6.24 | BOOST    | 5.40u | WIN     |      +6.10 |
| 2026-08-23 | WNBA  | SPREAD | Dallas Wings            |  +107 | +0.899 | CONFIRMED-UNOPP |   3/1 |   2/0 |  48.3 |   64.1 |   -1.7 | -0.02 | HOLD     | 1.00u | WIN     |      +1.07 |
| 2026-08-23 | WNBA  | SPREAD | Washington Mystics      |  +122 | +0.551 | 2-for-0  |   3/2 |   3/1 |  53.0 |   69.4 |  +13.1 |  5.04 | BOOST    | 6.00u | WIN     |      +7.32 |
| 2026-08-23 | MLB   | TOTAL  | Under 10.5              |  -186 | +0.993 | CONFIRMED-UNOPP |   1/0 |   1/0 |  55.3 |   48.0 |   +5.3 | -1.04 | MUTE     | 1.00u | WIN     |      +0.54 |
| 2026-08-23 | MLB   | TOTAL  | Under 8.5               |  +100 | +0.928 | CONFIRMED-UNOPP |   4/1 |   4/1 |  50.4 |   64.8 |   +1.3 |  0.46 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-23 | MLB   | TOTAL  | Under 8.5               |  +117 | +0.988 | CONFIRMED-UNOPP |   2/0 |   1/0 |  49.3 |   62.0 |   -0.7 | -0.15 | HOLD     | 1.00u | WIN     |      +1.17 |
| 2026-08-23 | WNBA  | TOTAL  | Under 173.5             |  -100 | +0.984 | MINI     |   2/1 |   2/0 |  56.4 |   71.9 |   +6.4 |  2.76 | HOLD     | 1.00u | WIN     |      +1.00 |
| 2026-08-23 | WNBA  | TOTAL  | Under 163.5             |  +117 | +0.974 | CONFIRMED-UNOPP |   1/0 |   1/0 |  48.5 |   69.5 |   -1.5 |  0.84 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-22 | MLB   | ML     | Atlanta Braves          |  +158 | +0.305 | CONFIRMED-UNOPP |   4/7 |   1/2 |  48.2 |   63.6 |   -0.6 |  0.64 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-22 | MLB   | ML     | Tampa Bay Rays          |  -122 | +0.990 | HC-1     |   1/3 |   1/0 |  59.8 |   56.8 |  +15.3 |  2.05 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-08-22 | NFL   | ML     | Ravens                  |  +126 | +0.529 | CONFIRMED-UNOPP |   4/3 |   3/1 |  27.3 |   62.4 |  -25.6 | -7.37 | HOLD     | 1.00u | WIN     |      +1.26 |
| 2026-08-22 | NFL   | ML     | Cowboys                 |  -125 | +0.643 | SHARP~   |   2/2 |   2/2 |  61.5 |   64.0 |  +21.4 |  3.29 | BOOST    | 5.40u | WIN     |      +4.32 |
| 2026-08-22 | SOC   | ML     | Manchester United FC    |  -255 | +0.976 | CONFIRMED-UNOPP |   5/0 |   1/0 |  41.9 |   56.3 |   -8.1 | -2.47 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-22 | SOC   | ML     | Real Madrid CF          |  -235 | +0.957 | CONFIRMED-UNOPP |   8/0 |   3/0 |  41.8 |   59.9 |   -8.2 | -1.95 | HOLD     | 1.00u | WIN     |      +0.43 |
| 2026-08-22 | UFC   | ML     | Carli Judice            |  -590 | +0.895 | HC-1     |   1/1 |   1/1 |  80.6 |   93.3 |  +38.4 | 12.58 | BOOST    | 5.40u | WIN     |      +0.92 |
| 2026-08-22 | UFC   | ML     | Shamil Gaziev           |  -120 | +0.994 | MINI     |   3/0 |   3/0 |  80.6 |   75.6 |  +30.6 |  8.23 | BOOST    | 5.40u | WIN     |      +4.50 |
| 2026-08-22 | UFC   | ML     | Lerryan Douglas         |  -380 | +0.993 | HC-1     |   1/1 |   1/1 |  67.6 |   81.1 |  +17.6 |  6.45 | BOOST    | 5.40u | LOSS    |      -5.40 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.526 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.069 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.002 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.002 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.023 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  810 |    +0.0282 |    -0.0128 | 0.0000 |  +0.007 |   0.950 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  810 |    +0.0509 |    +0.5020 | 0.0005 |  +0.023 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  810 |    -0.5585 |    +0.6112 | 0.0019 |  -0.044 |   2.838 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 810 |          +0.079 |           +0.016 |                   +0.046 |                   +0.008 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 810 |          -0.006 |           +0.304 |                   +0.008 |                   +0.109 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 810 |          +0.003 |           +0.160 |                   -0.015 |                   +0.031 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 810 |          -0.019 |           +0.156 |                   +0.009 |                   +0.091 | count of contributing AGAINST-side wallets                     |
| provenFor         | 810 |          +0.008 |           +0.142 |                   +0.000 |                   +0.059 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 810 |          +0.005 |           +0.108 |                   +0.021 |                   +0.056 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.584         | 270 | 147-123 |   54.4% |     +1.0% |
| MID (p33–p67)     | 19.950 … 18.750        | 270 | 141-129 |   52.2% |     -0.9% |
| HIGH (> p67)      | 48.906 … 31.475        | 270 | 154-116 |   57.0% |     +1.1% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       810 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8572 | average score across live picks                                 |
| SD                |    0.2237 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.110 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +3.461 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.481 / +0.961 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  669 | 349-320 |   52.2% |     +1.3% |  0.510 |        -0.048 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   10 | 6-4    |   60.0% |     -1.2% |  0.417 |        -0.515 | anti-signal (N<20)                        |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   39 | 27-12  |   69.2% |    +22.8% |  0.562 |        -0.002 | real                                      |
| UFC   |   30 | 22-8   |   73.3% |    +13.2% |  0.619 |        +0.163 | strong                                    |
| WNBA  |   46 | 30-16  |   65.2% |    +26.5% |  0.487 |        -0.147 | noise                                     |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.496, 0.575, 0.628, 0.604, 0.619, 0.582, 0.546, 0.564, 0.545, 0.577, 0.543, 0.537, 0.521, 0.537]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23"]
    y-axis "edge (pp)" -17 --> 3
    line [-11.7, -11.9, -15.7, -7, -1.3, -3, -1.3, -0.2, 1.1, 1.6, -2.5, -2.5, -1.8, -1.2]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-08-10 |    7 |   45 | 19-26  |   42.2% |    -10.9% |  0.496 |     -11.7pp |
| 2026-08-11 |    7 |   36 | 15-21  |   41.7% |     -3.9% |  0.575 |     -11.9pp |
| 2026-08-12 |    7 |   38 | 14-24  |   36.8% |    -18.6% |  0.628 |     -15.7pp |
| 2026-08-13 |    7 |   50 | 23-27  |   46.0% |     -0.9% |  0.604 |      -7.0pp |
| 2026-08-14 |    7 |   50 | 26-24  |   52.0% |     +8.5% |  0.619 |      -1.3pp |
| 2026-08-15 |    7 |   69 | 35-34  |   50.7% |     +2.9% |  0.582 |      -3.0pp |
| 2026-08-16 |    7 |   77 | 40-37  |   51.9% |     +6.5% |  0.546 |      -1.3pp |
| 2026-08-17 |    7 |   84 | 44-40  |   52.4% |    +12.3% |  0.564 |      -0.2pp |
| 2026-08-18 |    7 |  107 | 57-50  |   53.3% |    +11.7% |  0.545 |      +1.1pp |
| 2026-08-19 |    7 |  114 | 61-53  |   53.5% |    +14.1% |  0.577 |      +1.6pp |
| 2026-08-20 |    7 |  111 | 55-56  |   49.5% |     +6.2% |  0.543 |      -2.5pp |
| 2026-08-21 |    7 |  119 | 59-60  |   49.6% |     +0.5% |  0.537 |      -2.5pp |
| 2026-08-22 |    7 |  114 | 58-56  |   50.9% |     +3.9% |  0.521 |      -1.8pp |
| 2026-08-23 |    7 |  121 | 63-58  |   52.1% |     +7.8% |  0.537 |      -1.2pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.510 avg in first half → 0.539 avg in second half · Δ = +0.029)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.0% | [-2.0%, +11.9%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.6% | [51.5%, 58.1%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.526 | [0.486, 0.565]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             75 | [24, 132]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       815 |
| Unique wallets ever on a FOR side            |                                                       212 |
| Avg FOR-side wallets per pick                |                                                      2.70 |
| Top-5 wallets' share of all FOR appearances  |                                                     24.2% |
| Top-10 wallets' share of all FOR appearances |                                                     42.7% |
| Top-20 wallets' share of all FOR appearances |                                                     59.2% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  133 |   16 | 69-64  |   51.9% |     +9.3% |    +35.66 |     1.58× | CONFIRMED   |     +0.1% |     306 | 2026-08-23 |
|    2 | 4b912c  | MLB,NFL,SOC,WNBA |  113 |   35 | 62-51  |   54.9% |    +10.3% |    +26.72 |     1.47× | CONFIRMED   |     -5.8% |     294 | 2026-08-23 |
|    3 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    4 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    5 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     334 | 2026-08-05 |
|    6 | cd2f63  | MLB,NBA,NFL,SOC,WNBA |   87 |   44 | 47-40  |   54.0% |    +13.5% |    +33.24 |     1.12× | CONFIRMED   |     +8.6% |     506 | 2026-08-22 |
|    7 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   85 |   41 | 40-45  |   47.1% |     -4.3% |    -10.29 |     1.26× | CONFIRMED   |     +5.7% |     344 | 2026-08-23 |
|    8 | 0f9d74  | MLB,NBA,NFL,SOC,UFC |   78 |   55 | 43-35  |   55.1% |    +12.7% |    +25.56 |     0.46× | CONFIRMED   |    +16.1% |     331 | 2026-08-23 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   78 |   32 | 42-36  |   53.8% |     -5.0% |    -10.45 |     2.05× | CONFIRMED   |     -6.8% |     281 | 2026-08-23 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   52 |   16 | 31-21  |   59.6% |    +25.2% |    +32.09 |     0.73× | CONFIRMED   |     +9.8% |     219 | 2026-08-18 |
|   12 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   45 |   58 | 21-24  |   46.7% |     -8.6% |    -10.89 |     4.37× | CONFIRMED   |     -7.0% |     261 | 2026-08-22 |
|   13 | 705ba1  | MLB        |   43 |   17 | 19-24  |   44.2% |     -9.1% |    -11.37 |     1.11× | CONFIRMED   |     +8.1% |     187 | 2026-08-21 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   40 |   20 | 19-21  |   47.5% |     -1.2% |     -1.36 |     1.19× | CONFIRMED   |     -4.8% |     171 | 2026-08-23 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 |   22 | 19-15  |   55.9% |     +0.8% |     +0.85 |     1.36× | CONFIRMED   |    +13.8% |     143 | 2026-07-30 |
|   16 | 621848  | MLB,SOC,UFC,WNBA |   34 |   11 | 18-16  |   52.9% |    -10.7% |    -10.31 |     0.62× | CONFIRMED   |     +2.5% |      94 | 2026-08-23 |
|   17 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   18 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   19 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |
|   20 | f2f960  | MLB        |   26 |   16 | 12-14  |   46.2% |    -15.0% |    -13.64 |     2.90× | —           |     -6.2% |      91 | 2026-08-04 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    2 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    3 | 9a4d38  | MLB,UFC,WNBA |   19 | 13-6   |   68.4% |     +41.1% |    +20.90 |     0.14× | 2026-08-22 |
|    4 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|    5 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    6 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|    7 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|    8 | 7923c4  | MLB,NBA,UFC |   52 | 31-21  |   59.6% |     +25.2% |    +32.09 |     0.73× | 2026-08-18 |
|    9 | a0cff6  | MLB,NBA,SOC,UFC,WNBA |   14 | 9-5    |   64.3% |     +24.4% |     +8.52 |     5.42× | 2026-08-23 |
|   10 | f9e3d0  | MLB,NBA    |   10 | 5-5    |   50.0% |     +23.2% |     +7.23 |     1.43× | 2026-08-01 |
|   11 | c911a4  | MLB,NBA,SOC |   21 | 11-10  |   52.4% |     +17.0% |    +10.19 |     4.63× | 2026-08-01 |
|   12 | 7dd2e5  | UFC        |   25 | 19-6   |   76.0% |     +16.6% |    +18.58 |     1.43× | 2026-08-22 |
|   13 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 | 64-37  |   63.4% |     +15.8% |    +53.36 |     1.54× | 2026-07-19 |
|   14 | b839b3  | MLB,NBA,SOC,UFC |   25 | 16-9   |   64.0% |     +15.5% |    +13.19 |     1.34× | 2026-08-18 |
|   15 | 9a69c2  | MLB,SOC    |   26 | 14-12  |   53.8% |     +14.8% |     +9.18 |     2.30× | 2026-07-10 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 8ec926  | MLB,UFC,WNBA |   14 | 5-9    |   35.7% |     -36.6% |    -15.75 |     5.48× | 2026-08-15 |
|    3 | 209728  | MLB        |   10 | 4-6    |   40.0% |     -29.7% |     -5.80 |     0.68× | 2026-08-23 |
|    4 | c9bba3  | MLB,NFL,SOC |   15 | 8-7    |   53.3% |     -24.1% |     -8.14 |     0.83× | 2026-08-23 |
|    5 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    6 | ac9705  | MLB,WNBA   |   21 | 9-12   |   42.9% |     -12.2% |     -9.27 |     2.26× | 2026-08-22 |
|    7 | 3bdd7e  | MLB,NFL,SOC,WNBA |   22 | 12-10  |   54.5% |     -12.2% |     -4.67 |     4.38× | 2026-08-23 |
|    8 | 621848  | MLB,SOC,UFC,WNBA |   34 | 18-16  |   52.9% |     -10.7% |    -10.31 |     0.62× | 2026-08-23 |
|    9 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|   10 | 705ba1  | MLB        |   43 | 19-24  |   44.2% |      -9.1% |    -11.37 |     1.11× | 2026-08-21 |
|   11 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   45 | 21-24  |   46.7% |      -8.6% |    -10.89 |     4.37× | 2026-08-22 |
|   12 | 2f2a9e  | MLB,SOC,WNBA |   78 | 42-36  |   53.8% |      -5.0% |    -10.45 |     2.05× | 2026-08-23 |
|   13 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   85 | 40-45  |   47.1% |      -4.3% |    -10.29 |     1.26× | 2026-08-23 |
|   14 | ad88a3  | MLB,SOC    |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-08-21 |
|   15 | bc35e3  | MLB,SOC,UFC,WNBA |   40 | 19-21  |   47.5% |      -1.2% |     -1.36 |     1.19× | 2026-08-23 |

> 🔴 **6 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `f2f960` (FOR# 26, ROI -15.0%), `621848` (FOR# 34, ROI -10.7%), `1e8f33` (FOR# 94, ROI -10.7%), `705ba1` (FOR# 43, ROI -9.1%), `7da3d5` (FOR# 45, ROI -8.6%), `2f2a9e` (FOR# 78, ROI -5.0%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1623 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   391 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     6 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    60 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     8 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   351 | 🟡 informational — AGS-U calibration controls sample adequacy |

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

> **Odds cap** (still live): uncapped at ≤+120 · ≤2.5u at +121 · ≤1.5u at +151 · ≤1.0u at +200.

### Wallet pool

The size of the qualifying-wallet pool per sport is the upstream cap on AGS-U signal. Each sharp wallet is one data point per side; smaller pool ⇒ less signal. This section is the standing report on that pool.

| sport | wallet records | CONFIRMED | FLAT | WR50 | NULL | qualifying (C+F+WR50) |
|-------|----------------|-----------|------|------|------|------------------------|
| MLB   |            252 |        60 |   26 |   16 |  150 |                    102 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            235 |        62 |   38 |   11 |  124 |                    111 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   85 |    815 | 1103 | 445-370 |  54.6% |      5.0% |    +110.16 |    +0.14 | 0.506 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  755 |    +1.3pp |    +13.9pp |          +0.308 |   -0.043 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  753 |    +6.2pp |    +23.7pp |          +0.448 |   +0.112 |    +0.0306 | 🟢 better |
| v12 − v11          | +  704 |    -0.4pp |     +2.1pp |          +0.074 |   +0.062 |    +0.0144 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 673n 52.2% +1% | 10n 30.0% +29% | 10n 60.0% -1%  | 6n 83.3% +38%  | 40n 70.0% +23% | 30n 73.3% +13% | 46n 65.2% +26% | 815n 54.6% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 164n +1%      | 232n +2%      | 184n +8%      | 112n -1%      | 118n +22%     | 🟡 partial (2) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2200 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1049 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 810 / 1049 (77%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 810 / 1049 (77%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 810 / 1049 (77%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 810 / 1049 (77%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 810 / 1049 (77%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 810 / 1049 (77%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 810 / 1049 (77%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1049 / 1049 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1049 / 1049 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1049 / 1049 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1049 / 1049 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1049 / 1049 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1049 / 1049 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1042 / 1049 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1040 / 1049 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1049 / 1049 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1048 / 1049 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 636 / 1049 (61%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1048 / 1049 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 636 / 1049 (61%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 635 / 1049 (61%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1049 / 1049 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1049 / 1049 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1049 / 1049 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1048 / 1049 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1049 / 1049 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd contribMargin     | 1049 |      |    -0.030 |    -0.143 |      -0.054 |      -0.110 |  0.468 |
|    2 | wd agCount           | 636 |      |    +0.022 |    +0.265 |      +0.051 |      +0.129 |  0.525 |
|    3 | V12 forMean          | 810 |  🟢  |    +0.079 |    +0.016 |      +0.046 |      +0.008 |  0.531 |
|    4 | qMargin              | 810 |  🟢  |    +0.082 |    +0.006 |      +0.046 |      -0.001 |  0.530 |
|    5 | wd maxForContrib     | 1048 |      |    -0.052 |    -0.105 |      -0.045 |      -0.050 |  0.484 |
|    6 | wd sizeMargin        | 635 |      |    -0.015 |    -0.023 |      -0.044 |      -0.067 |  0.493 |
|    7 | wd contribFor        | 1049 |      |    -0.031 |    -0.087 |      -0.038 |      -0.064 |  0.477 |
|    8 | wd agAvgSize         | 636 |      |    +0.014 |    +0.026 |      +0.036 |      +0.044 |  0.504 |
|    9 | hcMargin             | 1049 |      |    -0.011 |    +0.201 |      -0.034 |      +0.050 |  0.507 |
|   10 | clv                  | 1040 |      |    -0.026 |    +0.039 |      -0.032 |      +0.006 |  0.508 |
|   11 | lockPinnProb         | 1042 |      |    +0.186 |    +0.155 |      +0.029 |      -0.131 |  0.601 |
|   12 | provenMargin         | 1049 |      |    -0.013 |    +0.055 |      -0.029 |      -0.015 |  0.491 |
|   13 | provenFor            | 1049 |      |    -0.020 |    +0.032 |      -0.025 |      -0.022 |  0.491 |
|   14 | wd forCount          | 1048 |      |    -0.012 |    +0.090 |      -0.024 |      -0.011 |  0.488 |
|   15 | countMargin          | 810 |      |    +0.016 |    +0.074 |      -0.021 |      -0.025 |  0.495 |
|   16 | wd forAvgSize        | 1048 |      |    +0.000 |    +0.043 |      -0.021 |      -0.011 |  0.510 |
|   17 | ags (v11)            | 1049 |      |    +0.004 |    +0.042 |      -0.018 |      -0.027 |  0.509 |
|   18 | provenTotal          | 1049 |      |    -0.020 |    -0.010 |      -0.017 |      -0.020 |  0.495 |
|   19 | wd contribAg         | 1049 |      |    -0.006 |    +0.134 |      +0.015 |      +0.061 |  0.498 |
|   20 | V12 forCount         | 810 |  🟢  |    +0.003 |    +0.160 |      -0.015 |      +0.031 |  0.506 |
|   21 | peakStars            | 1049 |      |    +0.005 |    +0.073 |      -0.015 |      -0.008 |  0.502 |
|   22 | wd maxShare          | 1049 |      |    +0.014 |    -0.050 |      +0.012 |      -0.006 |  0.509 |
|   23 | V12 agCount          | 810 |  🟢  |    -0.019 |    +0.156 |      +0.009 |      +0.091 |  0.506 |
|   24 | V12 agMean           | 810 |  🟢  |    -0.006 |    +0.304 |      +0.008 |      +0.109 |  0.495 |
|   25 | agsV12               | 810 |  🟢  |    +0.023 |    -0.002 |      +0.007 |      -0.002 |  0.526 |
|   26 | provenAg             | 1049 |      |    -0.013 |    +0.135 |      -0.000 |      +0.058 |  0.503 |

> **Top 3 univariate features by PnL correlation:** `wd contribMargin` (r = -0.054), `wd agCount` (r = +0.051), `V12 forMean` (r = +0.046).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd contribMargin` — r(unit-ret) = -0.054, AUC = 0.468. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd contribMargin` · r(unit-ret) = -0.054 · AUC = 0.468

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … 8.800          | 350 | 202-148 |   57.7% |     +3.0% |
| MID (p33–p67)     | 57.800 … 36.300          | 349 | 191-158 |   54.7% |     +0.7% |
| HIGH (> p67)      | 174.100 … 90.100         | 350 | 176-174 |   50.3% |     -3.0% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd agCount` · r(unit-ret) = +0.051 · AUC = 0.525

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 307 | 161-146 |   52.4% |     -1.2% |
| MID (p33–p67)     | 2.000 … 2.000            | 155 | 81-74   |   52.3% |     -1.6% |
| HIGH (> p67)      | 3.000 … 3.000            | 174 | 100-74  |   57.5% |     +3.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forMean` · r(unit-ret) = +0.046 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.584           | 270 | 147-123 |   54.4% |     +1.0% |
| MID (p33–p67)     | 19.950 … 18.750          | 270 | 141-129 |   52.2% |     -0.9% |
| HIGH (> p67)      | 48.906 … 31.475          | 270 | 154-116 |   57.0% |     +1.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.046 · AUC = 0.530

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.432           | 270 | 144-126 |   53.3% |     -0.0% |
| MID (p33–p67)     | 19.950 … 18.750          | 270 | 146-124 |   54.1% |     +0.7% |
| HIGH (> p67)      | 46.556 … 31.475          | 270 | 152-118 |   56.3% |     +0.5% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd maxForContrib` · r(unit-ret) = -0.045 · AUC = 0.484

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 36.300          | 350 | 199-151 |   56.9% |     +2.2% |
| MID (p33–p67)     | 52.400 … 57.900          | 349 | 188-161 |   53.9% |     -0.2% |
| HIGH (> p67)      | 100.000 … 63.100         | 349 | 182-167 |   52.1% |     -1.3% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd contribMargin | wd agCount     | V12 forMean    | qMargin        | wd maxForContrib | wd sizeMargin  | wd contribFor  | wd agAvgSize   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd contribMargin |  1.000         |         -0.152 |         +0.080 |         +0.063 |         +0.516 |         +0.273 |         +0.768 |         -0.152 |
| wd agCount  |         -0.152 |  1.000         |         +0.140 |         +0.031 |         +0.302 |         +0.032 |         +0.468 |         +0.102 |
| V12 forMean |         +0.080 |         +0.140 |  1.000         |         +0.967 |         +0.208 |         +0.216 |         +0.172 |         -0.021 |
| qMargin     |         +0.063 |         +0.031 |         +0.967 |  1.000         |         +0.152 |         +0.199 |         +0.079 |         -0.041 |
| wd maxForContrib |         +0.516 |         +0.302 |         +0.208 |         +0.152 |  1.000         |         +0.281 |         +0.659 |         +0.035 |
| wd sizeMargin |         +0.273 |         +0.032 |         +0.216 |         +0.199 |         +0.281 |  1.000         |         +0.228 |         -0.748 |
| wd contribFor |         +0.768 |         +0.468 |         +0.172 |         +0.079 |         +0.659 |         +0.228 |  1.000         |         -0.005 |
| wd agAvgSize |         -0.152 |         +0.102 |         -0.021 |         -0.041 |         +0.035 |         -0.748 |         -0.005 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.967. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 518 picks · features = 8 (+ intercept) · multiple R² = **0.0193** · adjusted R² = **0.0019** · residual sd = 0.951

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.3338 |   0.1854 | -1.80 (~sig) |        1 |
|    2 | wd agCount           |     |    +0.2363 |   0.1142 | +2.07 (sig.) |        2 |
|    3 | wd contribMargin     |     |    +0.2328 |   0.1632 | +1.43        |        3 |
|    4 | wd agAvgSize         |     |    +0.0569 |   0.0716 | +0.80        |        4 |
|    5 | V12 forMean          |  🟢 |    +0.0504 |   0.1910 | +0.26        |        5 |
|    6 | qMargin              |  🟢 |    +0.0138 |   0.1871 | +0.07        |        6 |
|    7 | wd sizeMargin        |     |    -0.0119 |   0.0735 | -0.16        |        7 |
|    8 | wd maxForContrib     |     |    +0.0082 |   0.0595 | +0.14        |        8 |
| —    | (intercept)          |     |    +0.0160 |   0.0418 |    +0.38 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.050), `qMargin` (β = +0.014)
- V12 IGNORES: `wd contribFor` (β = -0.334, t = -1.80), `wd agCount` (β = +0.236, t = +2.07), `wd contribMargin` (β = +0.233, t = +1.43), `wd agAvgSize` (β = +0.057, t = +0.80), `wd sizeMargin` (β = -0.012, t = -0.16), `wd maxForContrib` (β = +0.008, t = +0.14)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.525 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.565 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.040.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~4.0pp.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd contribFor` (β = -0.334, t = -1.80), `wd agCount` (β = +0.236, t = +2.07). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of 0.0019 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*