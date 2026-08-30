# AGS-Unified — V12 Daily Monitor

**Generated:** Sunday, August 30, 2026 at 12:55 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (91 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (91 days ago), V12 has evaluated **2814** picks, shipped **902** for real money (32.1% ship rate), and muted the other **1912**. On the shipped picks V12 has gone **493-409** (54.7% win), staked **2453.10u**, and returned **+105.67u** at **+4.3% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             91 |
| Picks V12 has evaluated             |                           2814 |
| Picks SHIPPED (units > 0)           |                            902 |
| Picks MUTED (score ≤ 0, FADE)       |                           1912 |
| Ship rate                           |                          32.1% |
| Live W-L                            |                        493-409 |
| Live Win %                          |                          54.7% |
| Live PnL (units)                    |                        +105.67 |
| Live ROI                            |                          +4.3% |
| Avg PnL / day                       |                         +1.16u |
| Most recent action (2026-08-31)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.3% ROI** across 902 live picks (+105.67u real PnL).
- Mute rule is **saving money** — the 1267 muted picks would have lost -80.25u at flat 1u (-6.3% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.16u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **257-216** · +4.6% ROI · +59.06u on 473 graded — see § 5.

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

**Full book:** 91d · 902 live · 493-409 · **+105.67u** · +4.3% ROI · +1.16u/day.

_Prior to table (2026-06-01 → 2026-08-10): 623 live · 344-279 · +74.04u · cum through prior = +74.04u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-08-11 |        14 |    1 |    12 | 0-1        |   0.0% |      1.00 |      -1.00 |   -100.0% |     +73.04 |
| 2026-08-12 |        24 |    6 |    16 | 2-4        |  33.3% |     10.00 |      -5.58 |    -55.8% |     +67.46 |
| 2026-08-13 |        27 |   15 |     6 | 10-5       |  66.7% |     38.20 |     +14.06 |     36.8% |     +81.52 |
| 2026-08-14 |        19 |   10 |     8 | 6-4        |  60.0% |     19.90 |      +8.04 |     40.4% |     +89.56 |
| 2026-08-15 |        49 |   25 |    18 | 13-12      |  52.0% |     56.50 |      -1.79 |     -3.2% |     +87.77 |
| 2026-08-16 |        38 |   14 |    14 | 7-7        |  50.0% |     29.80 |      +0.93 |      3.1% |     +88.70 |
| 2026-08-17 |        26 |   13 |     6 | 6-7        |  46.2% |     34.80 |      +8.82 |     25.3% |     +97.52 |
| 2026-08-18 |        51 |   24 |    12 | 13-11      |  54.2% |     45.90 |      +3.07 |      6.7% |    +100.59 |
| 2026-08-19 |        41 |   13 |    18 | 6-7        |  46.2% |     18.50 |      +1.20 |      6.5% |    +101.79 |
| 2026-08-20 |        35 |   12 |    17 | 4-8        |  33.3% |     37.60 |      -5.27 |    -14.0% |     +96.52 |
| 2026-08-21 |        47 |   18 |    23 | 10-8       |  55.6% |     42.20 |      -5.56 |    -13.2% |     +90.96 |
| 2026-08-22 |        69 |   20 |    36 | 12-8       |  60.0% |     58.80 |      +7.20 |     12.2% |     +98.16 |
| 2026-08-23 |        58 |   21 |    23 | 12-9       |  57.1% |     36.40 |     +12.00 |     33.0% |    +110.16 |
| 2026-08-24 |        45 |   12 |    22 | 7-5        |  58.3% |     28.40 |      -2.12 |     -7.5% |    +108.04 |
| 2026-08-25 |        56 |   15 |    30 | 7-8        |  46.7% |     51.60 |      -7.95 |    -15.4% |    +100.09 |
| 2026-08-26 |        46 |   16 |    19 | 10-6       |  62.5% |     36.40 |     +12.91 |     35.5% |    +113.00 |
| 2026-08-27 |        26 |    9 |    12 | 7-2        |  77.8% |     29.40 |     +11.39 |     38.7% |    +124.39 |
| 2026-08-28 |        70 |   22 |    35 | 9-13       |  40.9% |     58.60 |     -30.30 |    -51.7% |     +94.09 |
| 2026-08-29 |        74 |   13 |    42 | 8-5        |  61.5% |     29.70 |     +11.58 |     39.0% |    +105.67 |
| 2026-08-30 |        46 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +105.67 |
| 2026-08-31 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +105.67 |

> **Trajectory.** 🟢 Last 3 days (39.0% ROI) **+35.1pp** vs prior (3.9%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-29**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 18 | 14-4 | +46.2% | +35.36u | +1.96u | +49.6% |
| 🟢 2 | RANK 2-for-0 rescue | B | 96 | 55-41 | +12.1% | +42.56u | +0.44u | +24.7% |
| 🟢 3 | MINI- (gate-cut) | C | 20 | 12-8 | +11.8% | +3.12u | +0.16u | +85.0% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 115 | 73-42 | +11.1% | +59.68u | sized UP after path |
| 2 | Tape HOLD (mid) | 312 | 164-148 | +2.5% | +16.35u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 19 | 7-12 | -27.7% | -5.27u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 92 | 47-45 | -1.4% | -1.26u | 🟡 flat |
| 3 | Score FADE (≤0 → 0u) | 713 | 363-350 | +1.7% | +12.45u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 18 | 14-4 | 77.8% | 76.5u | +35.36u | +46.2% | +1.96u | 4 | +49.6% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 106 | 63-43 | 59.4% | 389.7u | +18.38u | +4.7% | +0.17u | 13 | -0.1% | +0.81u | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 96 | 55-41 | 57.3% | 353.0u | +42.56u | +12.1% | +0.44u | 11 | +24.7% | — | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 78 | 38-40 | 48.7% | 267.4u | -14.11u | -5.3% | -0.18u | 11 | +3.5% | +4.22u | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 108 | 56-52 | 51.9% | 300.3u | +0.66u | +0.2% | +0.01u | 21 | -12.8% | +5.27u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 93 | 53-40 | 57.0% | 235.7u | +7.00u | +3.0% | +0.08u | 18 | -15.5% | -0.50u | 🟡 flat |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 1 | +85.0% | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 23 | 12-11 | 52.2% | 23.4u | +0.89u | +3.8% | +0.04u | 1 | -100.0% | — | 🟡 flat |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 115 | 73-42 | 63.5% | 536.3u | +59.68u | +11.1% | 31 | +4.4% | +9.29u |
| Tape HOLD (mid) | TAPE | staked | 312 | 164-148 | 52.6% | 661.6u | +16.35u | +2.5% | 85 | +6.6% | +3.29u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 0 | — | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 92 | 47-45 | 51.1% | 92.0u | -1.26u | -1.4% | 36 | -7.9% | -3.20u |
| fadeTop≥60 MUTE | E | CF 1u | 19 | 7-12 | 36.8% | 19.0u | -5.27u | -27.7% | 13 | -39.3% | -4.12u |
| Score FADE (≤0 → 0u) | score | CF 1u | 713 | 363-350 | 50.9% | 713.0u | +12.45u | +1.7% | 107 | +31.5% | +7.60u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 5 / +50% | — | — |
| TOP | 38 / -2% | 24 / +4% | 4 / -16% |
| RANK | 48 / +8% | 9 / +24% | — |
| SHARP | 15 / -9% | 37 / +0% | 1 / -100% |
| SHARP-LEAN | 79 / -0% | 26 / +2% | 3 / -30% |
| MINI | 43 / -2% | 9 / +38% | 4 / +1% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 14 / +10% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-08-29)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| SHARP-LEAN EDGE/net ONE | 3 | 2-1 | +5.27u | +81.1% |
| SHARP EDGE/net BOTH | 2 | 2-0 | +4.22u | +39.1% |
| HC-1 TOP | 1 | 1-0 | +0.81u | +15.0% |
| MINI (gate-pass) | 1 | 0-1 | -0.50u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  21 | 14-4   |  77.8% |       76.50 |     +35.36 |     46.2% |
| TOP PICK (TOP+/TOP)       |  4-5u | 188 | 78-57  |  57.8% |      522.20 |      +6.44 |      1.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 532 | 155-141 |  52.4% |      969.65 |     +22.50 |      2.3% |
| STRONG (MINI)             |    3u | 118 | 53-40  |  57.0% |      235.65 |      +7.00 |      3.0% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  93 | 26-22  |  54.2% |       54.85 |      +1.99 |      3.6% |
| **STAKED TOTAL** |     — | 590 | 326-264 |  55.3% |     1858.85 |     +73.29 |     +3.9% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  21 | 14-4   |  77.8% |       76.50 |     +35.36 |     46.2% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 159 | 63-43  |  59.4% |      389.70 |     +18.38 |      4.7% |
| B · 2-for-0 rescue    | RANK        |    4u | 139 | 55-41  |  57.3% |      352.95 |     +42.56 |     12.1% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 274 | 56-52  |  51.9% |      300.34 |      +0.66 |      0.2% |
| C · proven-$ consensus | SHARP       |    3u | 105 | 38-40  |  48.7% |      267.36 |     -14.11 |     -5.3% |
| A · mini-HC (gate-pass) | MINI        |    3u | 118 | 53-40  |  57.0% |      235.65 |      +7.00 |      3.0% |
| C · mini gate-cut     | MINI-       |    1u |  28 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  59 | 12-11  |  52.2% |       23.35 |      +0.89 |      3.8% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 581 picks tracked at 0u (would-be 284-297, 48.9% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (15-6, +35.36u)  ·  🟢 TOP PICK (101-87, +6.44u)  ·  🟠 SHARP PLAY (258-274, +22.50u)  ·  🔴 STRONG (68-50, +7.00u)  ·  🟣 LEAN (50-43, +1.99u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29"]
    y-axis "PnL (u)" -14 --> 44
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 1502 | 1492 | 1436 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 92 | 47-45 | 51.1% | 14.00u | -3.08u | -22.0% |
| HOLD      | 440 | 210-230 | 47.7% | 664.57u | +13.35u | +2.0% |
| BOOST     | 154 | 92-62 | 59.7% | 539.78u | +61.76u | +11.4% |
| FAIL_OPEN | 42 | 22-20 | 52.4% | 54.50u | -15.17u | -27.8% |
| PASS      | 708 | 368-340 | 52.0% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 467 | 249-218 | 53.3% | +0.81u |
| hold (0–2.89) | path u | 618 | 296-322 | 47.9% | +13.84u |
| boost (≥2.89) | ×1.35 | 183 | 104-79 | 56.8% | +56.11u |

_Score coverage: **1268/1436** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 92 | +5.94u | -5.94u | +57.25u | +63.19u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 117 | +45.46u | +61.76u | +16.30u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-30 | MLB | Atlanta Braves | SHARP | 4.98 | BOOST | 4.00u | 0.00u | — |
| 2026-08-30 | MLB | Cleveland Guardians | CONFIRMED-Q1 | -1.26 | MUTE | 3.00u | 3.00u | — |
| 2026-08-30 | MLB | Philadelphia Phillies | CONFIRMED-Q1 | -0.51 | MUTE | 3.00u | 3.00u | — |
| 2026-08-30 | MLB | Milwaukee Brewers | CONFIRMED-Q1 | -0.45 | MUTE | 3.00u | 0.00u | — |
| 2026-08-30 | WNBA | Golden State Valkyries | SHARP~ | 3.06 | BOOST | 4.00u | 2.70u | — |
| 2026-08-30 | MLB | Boston Red Sox | CONFIRMED-UNOPP | -0.40 | MUTE | 1.00u | 0.00u | — |
| 2026-08-30 | MLB | Atlanta Braves | CONFIRMED-Q1 | -2.49 | MUTE | 4.00u | 0.00u | — |
| 2026-08-30 | WNBA | Minnesota Lynx | HC-1 | 8.52 | BOOST | 4.00u | 0.00u | — |
| 2026-08-30 | MLB | Over 7.5 | PATH-D | -3.23 | MUTE | 1.00u | 0.00u | — |
| 2026-08-30 | MLB | Under 7.5 | MINI | 6.69 | BOOST | 4.00u | 5.40u | — |
| 2026-08-30 | WNBA | Over 176.5 | SHARP~ | -0.06 | MUTE | 1.00u | 0.00u | — |
| 2026-08-29 | MLB | Minnesota Twins | HC-1 | 3.90 | BOOST | 1.00u | 0.00u | LOSS |
| 2026-08-29 | MLB | Houston Astros | MINI | 4.66 | BOOST | 1.00u | 0.00u | LOSS |
| 2026-08-29 | MLB | Los Angeles Dodgers | CONFIRMED-UNOPP | -3.79 | MUTE | 1.00u | 0.50u | LOSS |
| 2026-08-29 | MLB | Philadelphia Phillies | SHARP~ | -2.29 | MUTE | 2.00u | 0.00u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-1.43** · nPriors=569 · source=expanding_q1 · asOf=2026-08-30 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 1056 | 969 | 921 | 203 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 77 | 32-45 | 41.6% | 11.00u | -3.29u | -29.9% |
| HOLD      | 230 | 119-111 | 51.7% | 271.60u | +17.86u | +6.6% |
| FAIL_OPEN | 26 | 12-14 | 46.2% | 42.90u | -3.08u | -7.2% |
| EXEMPT    | 348 | 176-172 | 50.6% | 430.20u | +17.97u | +4.2% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -50.9 … -1.3 | 37 | 9-28 | 24.3% | 0.0u | +0.00u | — |
| Q2 | -1.1 … 1.6 | 37 | 16-21 | 43.2% | 41.9u | +16.81u | +40.1% |
| Q3 | 1.6 … 5.7 | 38 | 14-24 | 36.8% | 45.1u | -12.10u | -26.8% |
| Q4 | 6.0 … 14.9 | 37 | 19-18 | 51.4% | 66.6u | -5.96u | -8.9% |
| Q5 | 16.4 … 1802.6 | 38 | 23-15 | 60.5% | 79.5u | +15.11u | +19.0% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 77 | 32-45 | -13.23u | +13.23u | +49.50u | +36.27u |

> 🟢 **Mute is saving money** (Δ +13.23u · muted WR 41.6%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 5 | 4-1 | 80.0% | 7.0u | +4.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 29 | 7-22 | 24.1% | 31.5u | -16.25u |
| MLB | 49 | 20-29 | 40.8% | 55.5u | -9.29u |
| NFL | 4 | 2-2 | 50.0% | 4.0u | +0.10u |
| SOC | 2 | 1-1 | 50.0% | 2.0u | +1.13u |
| WNBA | 22 | 9-13 | 40.9% | 24.0u | -5.17u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-08-30 | MLB | Detroit Tigers | — | -55.1 | -1.4 | 1.50u | pending |
| 2026-08-30 | MLB | Miami Marlins | SHARP~ | -29.9 | -1.4 | 1.00u | pending |
| 2026-08-29 | MLB | Kansas City Royals | MINI | -10.8 | -1.2 | 1.00u | WIN |
| 2026-08-29 | MLB | Washington Nationals | SHARP~ | -10.4 | -1.2 | 1.00u | WIN |
| 2026-08-29 | MLB | Toronto Blue Jays | CONFIRMED-UNOPP | -3.3 | -1.2 | 2.00u | WIN |
| 2026-08-29 | NFL | Colts | SHARP~ | -9.8 | -1.2 | 1.00u | LOSS |
| 2026-08-29 | SOC | Newcastle United FC | — | -134.8 | -1.2 | 1.00u | WIN |
| 2026-08-29 | WNBA | Chicago Sky | SHARP~ | -13.0 | -1.2 | 1.00u | LOSS |
| 2026-08-28 | MLB | Baltimore Orioles | CONFIRMED-UNOPP | -6.9 | -1.3 | 1.00u | WIN |
| 2026-08-28 | MLB | Toronto Blue Jays | — | -13.3 | -1.3 | 1.00u | WIN |
| 2026-08-28 | MLB | Texas Rangers | SHARP~ | -30.3 | -1.3 | 1.00u | LOSS |
| 2026-08-28 | MLB | Cincinnati Reds | SHARP~ | -2.7 | -1.3 | 1.00u | WIN |
| 2026-08-28 | NFL | Jaguars | — | -1.6 | -1.3 | 1.00u | WIN |
| 2026-08-27 | WNBA | Golden State Valkyries | — | -97.4 | -1.3 | 1.00u | WIN |
| 2026-08-27 | NFL | Bills | SHARP~ | -1.5 | -1.3 | 1.00u | LOSS |
| 2026-08-27 | WNBA | Golden State Valkyries | — | -6.0 | -1.3 | 1.00u | WIN |
| 2026-08-27 | MLB | Over 9.5 | SHARP | -6.5 | -1.3 | 1.00u | LOSS |
| 2026-08-27 | MLB | Over 7.5 | — | -47.5 | -1.3 | 1.00u | LOSS |
| 2026-08-27 | NFL | Over 35.5 | PASS | -2.4 | -1.3 | 1.00u | WIN |
| 2026-08-26 | MLB | Chicago Cubs | SHARP~ | -10.9 | -1.0 | 1.00u | LOSS |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 77 | 41-36 | 53.2% | 233.1u | +13.86u | +5.9% |
| Muted (Q1 → 0u) | 77 | 32-45 | 41.6% | 11.0u | -3.29u | -29.9% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 141–78 · 64.4% · +15.1%); **5–10 is the hole** (67–68 · 49.6% · -6.5%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 684 tickets · cov 657/684 (stamp 455 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 303 | 155–148 | 51.2% | -3.4% |
| 5–10 | 135 | 67–68 | 49.6% | -6.5% |
| ≥10 | 219 | 141–78 | 64.4% | +15.1% |
| All | 684 | 375–309 | 54.8% | +4.3% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.9% (110) | 55.4% (65) | 71.3% (87) |
| B | 54.5% (66) | 55.6% (9) | 66.7% (21) |
| C | 38.5% (39) | 45.1% (51) | 57.3% (103) |

##### Jul 15+ · 473 tickets · cov 452/473 (stamp 450 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 197 | 102–95 | 51.8% | +1.1% |
| 5–10 | 96 | 44–52 | 45.8% | -13.4% |
| ≥10 | 159 | 102–57 | 64.2% | +12.5% |
| All | 473 | 257–216 | 54.3% | +4.6% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 49% (51) | 52.8% (36) | 73.9% (46) |
| B | 55% (40) | 25% (4) | 64.3% (14) |
| C | 38.9% (18) | 45.7% (46) | 58.1% (93) |

##### Yesterday (Aug 29) · 13 tickets · cov 13/13 (stamp 13 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 3 | 1–2 | 33.3% | -50.0% |
| 5–10 | 4 | 1–3 | 25.0% | -8.0% |
| ≥10 | 6 | 6–0 | 100.0% | +53.1% |
| All | 13 | 8–5 | 61.5% | +39.0% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 0% (1) | — | 100% (1) |
| C | — | 0% (1) | 100% (4) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 684 tickets · cov 678/684 (stamp 467 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 437 | 240–197 | 54.9% | +3.1% |
| 5–10 | 123 | 66–57 | 53.7% | +9.3% |
| ≥10 | 118 | 67–51 | 56.8% | +4.9% |
| All | 684 | 375–309 | 54.8% | +4.3% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.6% (165) | 50% (52) | 71.7% (53) |
| B | 59.4% (69) | 50% (14) | 53.8% (13) |
| C | 49.6% (117) | 61% (41) | 40.5% (42) |

##### Jul 15+ · 473 tickets · cov 468/473 (stamp 467 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 287 | 162–125 | 56.4% | +7.8% |
| 5–10 | 100 | 53–47 | 53.0% | +9.7% |
| ≥10 | 81 | 40–41 | 49.4% | -8.8% |
| All | 473 | 257–216 | 54.3% | +4.6% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 63.4% (71) | 47.2% (36) | 62.5% (32) |
| B | 56.1% (41) | 50% (10) | 57.1% (7) |
| C | 53.3% (90) | 60.5% (38) | 36.4% (33) |

##### Yesterday (Aug 29) · 13 tickets · cov 13/13 (stamp 13 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 10 | 5–5 | 50.0% | +48.5% |
| ≥10 | 3 | 3–0 | 100.0% | +31.0% |
| All | 13 | 8–5 | 61.5% | +39.0% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 0% (1) | — | 100% (1) |
| C | 66.7% (3) | — | 100% (2) |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 684 tickets · cov 657/684 (stamp 449 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 122 | 57–65 | 46.7% | -19.9% |
| 0–2.89 | 371 | 198–173 | 53.4% | +6.0% |
| ≥2.89 | 164 | 108–56 | 65.9% | +15.3% |
| All | 684 | 375–309 | 54.8% | +4.3% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 57.6% (151) | 75% (68) |
| B | 61.5% (26) | 53.7% (54) | 62.5% (16) |
| C | 18.2% (11) | 50.4% (113) | 55.1% (69) |

##### Jul 15+ · 473 tickets · cov 452/473 (stamp 449 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 53 | 29–24 | 54.7% | +1.0% |
| 0–2.89 | 280 | 144–136 | 51.4% | +1.8% |
| ≥2.89 | 119 | 75–44 | 63.0% | +10.5% |
| All | 473 | 257–216 | 54.3% | +4.6% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 53.2% (94) | 73.7% (38) |
| B | 60% (10) | 53.8% (39) | 55.6% (9) |
| C | — | 51.1% (94) | 54% (63) |

##### Yesterday (Aug 29) · 13 tickets · cov 13/13 (stamp 13 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 5 | 2–3 | 40.0% | -6.2% |
| 0–2.89 | 3 | 1–2 | 33.3% | +51.4% |
| ≥2.89 | 5 | 5–0 | 100.0% | +46.0% |
| All | 13 | 8–5 | 61.5% | +39.0% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 0% (1) | 100% (1) |
| C | — | 50% (2) | 100% (3) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 473 | 257-216 | 54.3% | 1276.85u | +59.06u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 473/473 | 2.62 | 2.34 | +0.28 | 2.00 | 2.00 |
| depth   | #A sharps        | 473/473 | 1.35 | 1.35 | -0.01 | 1.00 | 1.00 |
| depth   | #F − #A          | 473/473 | 1.27 | 0.99 | +0.29 | 1.00 | 1.00 |
| depth   | proven F         | 473/473 | 1.75 | 1.69 | +0.06 | 1.00 | 1.00 |
| depth   | proven A         | 473/473 | 0.52 | 0.51 | +0.01 | 0.00 | 0.00 |
| depth   | proven F−A       | 473/473 | 1.23 | 1.18 | +0.05 | 1.00 | 1.00 |
| depth   | v12 F count      | 473/473 | 2.60 | 2.39 | +0.21 | 2.00 | 2.00 |
| depth   | v12 A count      | 473/473 | 1.47 | 1.48 | -0.01 | 1.00 | 1.00 |
| depth   | WA ForN          | 473/473 | 1.99 | 1.92 | +0.07 | 1.00 | 2.00 |
| depth   | WA AgN           | 473/473 | 1.11 | 1.19 | -0.08 | 1.00 | 1.00 |
| depth   | CLV ForN         | 472/473 | 2.43 | 2.21 | +0.22 | 2.00 | 2.00 |
| depth   | CLV AgN          | 472/473 | 1.38 | 1.39 | -0.01 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 473/473 | 0.38 | 0.36 | +0.02 | 0.00 | 0.00 |
| quality | ForWR            | 450/473 | 56.85 | 54.76 | +2.09 | 54.18 | 53.52 |
| quality | AgWR             | 289/473 | 44.76 | 45.78 | -1.02 | 45.71 | 46.90 |
| quality | TopFor WR        | 450/473 | 60.49 | 58.75 | +1.74 | 56.45 | 55.65 |
| quality | TopAg WR         | 289/473 | 47.65 | 48.66 | -1.01 | 48.83 | 49.14 |
| quality | EDGE             | 450/473 | 10.06 | 7.35 | +2.71 | 7.62 | 5.31 |
| quality | ForCLV           | 467/473 | 65.95 | 65.57 | +0.38 | 65.53 | 65.93 |
| quality | AgCLV            | 316/473 | 62.94 | 61.60 | +1.33 | 63.51 | 63.29 |
| quality | netCLV           | 467/473 | 3.32 | 3.84 | -0.52 | 3.33 | 3.47 |
| quality | Tape             | 449/473 | 2.51 | 2.05 | +0.46 | 1.75 | 1.50 |
| quality | V12 score        | 473/473 | 0.84 | 0.81 | +0.03 | 0.96 | 0.95 |
| quality | V12 forMean      | 473/473 | 27.18 | 22.56 | +4.62 | 18.29 | 15.56 |
| quality | V12 agMean       | 473/473 | 2.24 | 2.27 | -0.03 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 450/473 | 0.562 | +0.010 | +0.125 | +2.71 | 🟡 mild OK |
|    2 | V12 score        | quality | 473/473 | 0.545 | +0.014 | +0.061 | +0.03 | 🟡 mild OK |
|    3 | Tape             | quality | 449/473 | 0.544 | -0.026 | +0.080 | +0.46 | 🟡 mild OK |
|    4 | AgWR             | quality | 289/473 | 0.456 | +0.064 | -0.082 | -1.02 | 🟡 mild OK |
|    5 | V12 forMean      | quality | 473/473 | 0.542 | +0.141 | +0.086 | +4.62 | 🟡 mild OK |
|    6 | AgCLV            | quality | 316/473 | 0.542 | -0.024 | +0.087 | +1.33 | 🟡 mild inv |
|    7 | V12 agMean       | quality | 473/473 | 0.461 | +0.333 | -0.003 | -0.03 | flat |
|    8 | TopFor WR        | quality | 450/473 | 0.536 | +0.097 | +0.084 | +1.74 | flat |
|    9 | ForWR            | quality | 450/473 | 0.535 | -0.006 | +0.110 | +2.09 | flat |
|   10 | CLV ForN         | depth   | 472/473 | 0.528 | +0.275 | +0.067 | +0.22 | flat |
|   11 | #F sharps        | depth   | 473/473 | 0.526 | +0.284 | +0.076 | +0.28 | flat |
|   12 | unopposed (A=0)  | depth   | 473/473 | 0.520 | +0.241 | +0.022 | +0.02 | flat |
|   13 | v12 F count      | depth   | 473/473 | 0.516 | +0.285 | +0.057 | +0.21 | flat |
|   14 | TopAg WR         | quality | 289/473 | 0.485 | +0.024 | -0.068 | -1.01 | flat |
|   15 | netCLV           | quality | 467/473 | 0.486 | -0.045 | -0.023 | -0.52 | flat |
|   16 | #F − #A          | depth   | 473/473 | 0.512 | +0.201 | +0.066 | +0.29 | flat |
|   17 | WA AgN           | depth   | 473/473 | 0.490 | +0.177 | -0.029 | -0.08 | flat |
|   18 | CLV AgN          | depth   | 472/473 | 0.509 | +0.174 | -0.005 | -0.01 | flat |
|   19 | #A sharps        | depth   | 473/473 | 0.508 | +0.160 | -0.002 | -0.01 | flat |
|   20 | v12 A count      | depth   | 473/473 | 0.508 | +0.179 | -0.002 | -0.01 | flat |
|   21 | WA ForN          | depth   | 473/473 | 0.492 | +0.261 | +0.024 | +0.07 | flat |
|   22 | proven F−A       | depth   | 473/473 | 0.506 | +0.258 | +0.021 | +0.05 | flat |
|   23 | proven A         | depth   | 473/473 | 0.495 | +0.306 | +0.005 | +0.01 | flat |
|   24 | ForCLV           | quality | 467/473 | 0.497 | -0.071 | +0.021 | +0.38 | flat |
|   25 | proven F         | depth   | 473/473 | 0.501 | +0.337 | +0.026 | +0.06 | flat |

### (C) Working read

_N=473 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.562 · Δ +2.71 · higher on WINs (cov 450/473)
- **V12 score** — AUC 0.545 · Δ +0.03 · higher on WINs (cov 473/473)
- **Tape** — AUC 0.544 · Δ +0.46 · higher on WINs (cov 449/473)
- **AgWR** — AUC 0.456 · Δ -1.02 · higher on LOSSes (cov 289/473)
- **V12 forMean** — AUC 0.542 · Δ +4.62 · higher on WINs (cov 473/473)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. See `docs/SKILL_FEATURES.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 981 | 186 | 183 | 168 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 22 | 12-10 | 54.5% | 56.20u | +3.45u | +6.1% | -0.7 |
| on→off | 9 | 3-6 | 33.3% | 26.80u | -12.69u | -47.4% | -3.0 |
| off→on | 23 | 16-7 | 69.6% | 52.30u | +21.66u | +41.4% | +3.2 |
| off→off | 114 | 59-55 | 51.8% | 287.80u | -11.12u | -3.9% | -0.7 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 105 | 51-54 | 48.6% | 310.00u | -18.33u | -5.9% |
| 0–2 | 40 | 24-16 | 60.0% | 79.60u | +17.67u | +22.2% |
| 2–4 | 9 | 7-2 | 77.8% | 17.00u | +3.76u | +22.1% |
| 4+ | 14 | 8-6 | 57.1% | 16.50u | -1.80u | -10.9% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 376n · 52.9% · +4.0%   | 92n · 55.4% · -0.2%    | 264n · 50.8% · +1.4%   | 732n · 52.5% · +2.4%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 10n · 60.0% · +7.9%    | 3n · 66.7% · -28.0%    | 2n · 50.0% · -5.4%     | 15n · 60.0% · -0.8%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 46n · 71.7% · +25.1%   | —                      | —                      | 46n · 71.7% · +25.1%   |
| UFC   | 33n · 75.8% · +15.3%   | —                      | —                      | 33n · 75.8% · +15.3%   |
| WNBA  | 26n · 73.1% · -0.1%    | 19n · 42.1% · +1.0%    | 15n · 46.7% · -10.3%   | 60n · 56.7% · -2.1%    |
| **All** | **498n · 57.0% · +7.1%** | **118n · 54.2% · +1.4%** | **286n · 50.7% · +1.0%** | **902n · 54.7% · +4.3%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1267** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1267 |
| Muted W-L                           |              615-652 |
| Muted Win %                         |                48.5% |
| Counterfactual PnL at flat 1u       |               -80.25 |
| Counterfactual ROI at flat 1u       |                -6.3% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-80.25u** at a flat 1u stake — a counterfactual ROI of **-6.3%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-29 | MLB   | ML     | Los Angeles Dodgers     |  -170 | +0.948 | CONFIRMED-UNOPP |   3/0 |   2/0 |  56.1 |   28.6 |   +6.1 | -3.79 | MUTE     | 0.50u | LOSS    |      -0.50 |
| 2026-08-29 | MLB   | ML     | Milwaukee Brewers       |  -164 | +0.018 | CONFIRMED-Q1 |   4/4 |   3/3 |  57.7 |   50.5 |   +6.7 | -1.21 | HOLD     | 2.00u | WIN     |      +1.22 |
| 2026-08-29 | NFL   | ML     | Bears                   |  +103 | +0.980 | CONFIRMED-Q1 |   2/2 |   1/0 |  87.5 |   54.3 |  +41.6 |  6.35 | BOOST    | 2.00u | WIN     |      +2.06 |
| 2026-08-29 | SOC   | ML     | Real Sociedad de Fútbol |  -112 | +0.993 | SHARP~   |   1/0 |   1/0 |  62.2 |   52.6 |  +12.2 |  1.03 | HOLD     | 4.00u | WIN     |      +3.57 |
| 2026-08-29 | SOC   | ML     | AFC Bournemouth         |  +115 | +0.973 | CONFIRMED-UNOPP |   4/0 |   4/0 |  45.8 |   59.6 |   -4.2 | -1.20 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-29 | UFC   | ML     | Bilal Hasan             |  -640 | +0.971 | SHARP    |   3/0 |   1/0 |  76.5 |   76.8 |  +26.5 |  7.52 | BOOST    | 5.40u | WIN     |      +0.84 |
| 2026-08-29 | UFC   | ML     | Liu Ce                  |  -160 | +0.102 | SHARP    |  11/4 |   1/2 |  76.5 |   74.4 |  +26.5 |  7.32 | BOOST    | 5.40u | WIN     |      +3.38 |
| 2026-08-29 | UFC   | ML     | Rei Tsuruya             |  -669 | +0.997 | HC-1     |   1/0 |   1/0 |  75.6 |   86.4 |  +25.6 |  8.78 | BOOST    | 5.40u | WIN     |      +0.81 |
| 2026-08-29 | NFL   | SPREAD | Bears                   |  +110 | +0.372 | SHARP~   |   3/2 |   2/1 |  87.5 |   61.1 |  +41.6 |  6.79 | BOOST    | 2.00u | WIN     |      +2.20 |
| 2026-08-29 | MLB   | TOTAL  | Over 8.5                |  -107 | +0.687 | MINI     |   4/2 |   3/1 |  49.7 |   63.6 |   +1.2 |  0.46 | HOLD     | 0.50u | LOSS    |      -0.50 |
| 2026-08-29 | MLB   | TOTAL  | Under 7.5               |  +117 | +0.318 | SHARP~   |   4/1 |   4/1 |  57.8 |   52.1 |   +6.1 |  0.90 | HOLD     | 0.50u | LOSS    |      -0.50 |
| 2026-08-29 | MLB   | TOTAL  | Under 7.5               |  +108 | +0.989 | CONFIRMED-UNOPP |   2/0 |   2/0 |  58.5 |   45.6 |   +8.5 | -0.76 | MUTE     | 0.50u | LOSS    |      -0.50 |
| 2026-08-29 | MLB   | TOTAL  | Over 7.5                |  -101 | +0.931 | CONFIRMED-UNOPP |   3/0 |   3/0 |  52.3 |   52.6 |   +3.6 | -0.86 | HOLD     | 0.50u | WIN     |      +0.50 |
| 2026-08-28 | MLB   | ML     | San Francisco Giants    |  +108 | +0.407 | SHARP~   |   3/5 |   3/2 |  58.8 |   60.1 |   +9.6 |  1.85 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-08-28 | MLB   | ML     | Baltimore Orioles       |  -108 | +0.619 | CONFIRMED-UNOPP |  12/1 |   7/2 |  54.9 |   64.0 |   +2.6 |  2.01 | HOLD     | 1.00u | WIN     |      +0.93 |
| 2026-08-28 | MLB   | ML     | Chicago Cubs            |  -177 | +0.950 | MINI     |   4/1 |   2/0 |  50.9 |   62.7 |   +2.3 |  0.38 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-28 | MLB   | ML     | Miami Marlins           |  -134 | +0.259 | SHARP~   |   4/1 |   4/1 |  52.8 |   68.9 |   +4.9 |  2.32 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-28 | MLB   | ML     | Philadelphia Phillies   |  -114 | +0.967 | MINI     |   6/1 |   3/0 |  51.1 |   62.3 |   +2.6 |  0.36 | HOLD     | 1.00u | WIN     |      +0.88 |
| 2026-08-28 | MLB   | ML     | Pittsburgh Pirates      |  -108 | +0.596 | SHARP~   |   1/1 |   1/1 |  51.6 |   71.3 |   +3.7 |  2.44 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-28 | NFL   | ML     | Falcons                 |  -187 | +0.948 | SHARP~   |   3/3 |   2/0 |  65.0 |   41.7 |  +24.1 |  1.18 | HOLD     | 4.00u | WIN     |      +2.14 |
| 2026-08-28 | NFL   | ML     | Commanders              |  +165 | +0.024 | CONFIRMED-UNOPP |   4/4 |   1/1 |  40.9 |   68.6 |  -17.8 | -1.65 | MUTE     | 1.00u | LOSS    |      -1.00 |
| 2026-08-28 | SOC   | ML     | Manchester City FC      |  -160 | +0.948 | CONFIRMED-UNOPP |   4/0 |   4/0 |  40.6 |   42.1 |   -9.4 | -4.88 | HOLD     | 1.00u | WIN     |      +0.63 |
| 2026-08-28 | WNBA  | ML     | Indiana Fever           | -1291 | +0.943 | MINI     |   3/0 |   1/0 |  50.9 |   68.6 |   +0.9 |  1.17 | HOLD     | 1.00u | WIN     |      +0.08 |
| 2026-08-28 | WNBA  | ML     | Atlanta Dream           |  -800 | +0.959 | SHARP~   |   1/0 |   1/0 |  62.5 |   66.7 |  +12.5 |  3.20 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-08-28 | WNBA  | ML     | Las Vegas Aces          |  -801 | +0.975 | HC-1     |   5/1 |   2/0 |  57.0 |   71.8 |  +18.0 |  5.13 | BOOST    | 5.40u | WIN     |      +0.67 |
| 2026-08-28 | WNBA  | ML     | Washington Mystics      |  -208 | +0.221 | SHARP    |   3/2 |   1/1 |  62.5 |   62.8 |  +12.9 |  3.74 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-08-28 | MLB   | SPREAD | Chicago White Sox       |  -270 | +0.981 | SHARP~   |   1/0 |   1/0 |  64.7 |   58.8 |  +14.7 |  2.47 | HOLD     | 4.00u | WIN     |      +1.48 |
| 2026-08-28 | MLB   | SPREAD | Detroit Tigers          |  +117 | +0.857 | CONFIRMED-UNOPP |   1/0 |   1/0 |  53.4 |   66.5 |   +4.9 |  1.46 | HOLD     | 1.00u | WIN     |      +1.17 |
| 2026-08-28 | NFL   | SPREAD | Eagles                  |  -112 | +0.077 | SHARP~   |   2/2 |   2/1 |  69.3 |   65.0 |  +24.6 |  5.26 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-08-28 | MLB   | TOTAL  | Under 7.5               |  -122 | +0.991 | MINI     |   4/1 |   2/0 |  57.0 |   71.3 |   +7.0 |  2.81 | HOLD     | 3.00u | LOSS    |      -3.00 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.535 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.064 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.006 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.009 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.043 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  897 |    +0.1035 |    -0.0789 | 0.0007 |  +0.026 |   0.947 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  897 |    +0.0916 |    +0.4688 | 0.0019 |  +0.043 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  897 |    -0.1713 |    +0.2596 | 0.0002 |  -0.014 |   2.830 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 897 |          +0.073 |           +0.032 |                   +0.038 |                   +0.007 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 897 |          -0.010 |           +0.307 |                   +0.000 |                   +0.109 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 897 |          +0.031 |           +0.196 |                   +0.011 |                   +0.049 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 897 |          -0.013 |           +0.175 |                   +0.017 |                   +0.103 | count of contributing AGAINST-side wallets                     |
| provenFor         | 897 |          +0.023 |           +0.174 |                   +0.014 |                   +0.073 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 897 |          +0.004 |           +0.128 |                   +0.021 |                   +0.064 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 6.708          | 299 | 162-137 |   54.2% |     +0.9% |
| MID (p33–p67)     | 19.950 … 14.298        | 299 | 158-141 |   52.8% |     -0.8% |
| HIGH (> p67)      | 48.906 … 46.501        | 299 | 170-129 |   56.9% |     +0.9% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       897 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8458 | average score across live picks                                 |
| SD                |    0.2365 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.984 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +2.880 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.446 / +0.959 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  728 | 382-346 |   52.5% |     +2.3% |  0.515 |        -0.065 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   15 | 9-6    |   60.0% |     -0.8% |  0.630 |        -0.104 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   45 | 32-13  |   71.1% |    +24.9% |  0.591 |        +0.134 | strong                                    |
| UFC   |   33 | 25-8   |   75.8% |    +15.3% |  0.615 |        +0.134 | strong                                    |
| WNBA  |   60 | 34-26  |   56.7% |     -2.1% |  0.542 |        +0.029 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.546, 0.564, 0.545, 0.577, 0.543, 0.537, 0.521, 0.537, 0.536, 0.539, 0.515, 0.538, 0.599, 0.596]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29"]
    y-axis "edge (pp)" -4 --> 4
    line [-1.3, -0.2, 1.1, 1.6, -2.5, -2.5, -1.8, -1.2, -0.9, -2.3, -0.6, 3, -1.2, -0.5]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-08-16 |    7 |   77 | 40-37  |   51.9% |     +6.5% |  0.546 |      -1.3pp |
| 2026-08-17 |    7 |   84 | 44-40  |   52.4% |    +12.3% |  0.564 |      -0.2pp |
| 2026-08-18 |    7 |  107 | 57-50  |   53.3% |    +11.7% |  0.545 |      +1.1pp |
| 2026-08-19 |    7 |  114 | 61-53  |   53.5% |    +14.1% |  0.577 |      +1.6pp |
| 2026-08-20 |    7 |  111 | 55-56  |   49.5% |     +6.2% |  0.543 |      -2.5pp |
| 2026-08-21 |    7 |  119 | 59-60  |   49.6% |     +0.5% |  0.537 |      -2.5pp |
| 2026-08-22 |    7 |  114 | 58-56  |   50.9% |     +3.9% |  0.521 |      -1.8pp |
| 2026-08-23 |    7 |  121 | 63-58  |   52.1% |     +7.8% |  0.537 |      -1.2pp |
| 2026-08-24 |    7 |  120 | 64-56  |   53.3% |     +3.9% |  0.536 |      -0.9pp |
| 2026-08-25 |    7 |  111 | 58-53  |   52.3% |     -0.2% |  0.539 |      -2.3pp |
| 2026-08-26 |    7 |  114 | 62-52  |   54.4% |     +3.8% |  0.515 |      -0.6pp |
| 2026-08-27 |    7 |  111 | 65-46  |   58.6% |     +9.8% |  0.538 |      +3.0pp |
| 2026-08-28 |    7 |  115 | 64-51  |   55.7% |     +1.0% |  0.599 |      -1.2pp |
| 2026-08-29 |    7 |  108 | 60-48  |   55.6% |     +2.8% |  0.596 |      -0.5pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.524 avg in first half → 0.529 avg in second half · Δ = +0.005)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.3% | [-2.5%, +11.0%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.7% | [51.3%, 57.5%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.535 | [0.497, 0.572]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             84 | [23, 135]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       902 |
| Unique wallets ever on a FOR side            |                                                       256 |
| Avg FOR-side wallets per pick                |                                                      2.78 |
| Top-5 wallets' share of all FOR appearances  |                                                     23.1% |
| Top-10 wallets' share of all FOR appearances |                                                     39.8% |
| Top-20 wallets' share of all FOR appearances |                                                     55.9% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  150 |   21 | 81-69  |   54.0% |    +11.4% |    +47.72 |     1.61× | CONFIRMED   |     -2.1% |     347 | 2026-08-29 |
|    2 | 4b912c  | MLB,NFL,SOC,WNBA |  142 |   47 | 74-68  |   52.1% |     +6.3% |    +20.46 |     1.55× | CONFIRMED   |    -10.6% |     403 | 2026-08-29 |
|    3 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    4 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    5 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     334 | 2026-08-05 |
|    6 | cd2f63  | MLB,NBA,NFL,SOC,WNBA |   89 |   44 | 48-41  |   53.9% |    +13.8% |    +34.44 |     1.10× | CONFIRMED   |     +8.2% |     511 | 2026-08-29 |
|    7 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   88 |   57 | 41-47  |   46.6% |     -5.2% |    -12.99 |     1.26× | CONFIRMED   |     +3.1% |     410 | 2026-08-28 |
|    8 | 0f9d74  | MLB,NBA,NFL,SOC,UFC |   84 |   59 | 47-37  |   56.0% |    +13.9% |    +29.24 |     0.48× | CONFIRMED   |    +14.5% |     361 | 2026-08-29 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   81 |   32 | 44-37  |   54.3% |     -4.1% |     -9.05 |     2.04× | CONFIRMED   |     -7.2% |     287 | 2026-08-27 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   55 |   16 | 33-22  |   60.0% |    +27.8% |    +37.84 |     0.83× | CONFIRMED   |     +9.9% |     222 | 2026-08-29 |
|   12 | 705ba1  | MLB        |   48 |   26 | 21-27  |   43.8% |     -8.8% |    -11.76 |     1.15× | CONFIRMED   |     +4.1% |     214 | 2026-08-29 |
|   13 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   47 |   60 | 22-25  |   46.8% |    -10.4% |    -14.15 |     4.19× | CONFIRMED   |     -6.6% |     273 | 2026-08-29 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   44 |   24 | 22-22  |   50.0% |     +4.8% |     +5.95 |     1.17× | CONFIRMED   |     -5.5% |     187 | 2026-08-29 |
|   15 | 621848  | MLB,SOC,UFC,WNBA |   43 |   11 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +9.5% |     109 | 2026-08-28 |
|   16 | 3bdd7e  | MLB,NFL,SOC,WNBA |   42 |   13 | 25-17  |   59.5% |    +11.4% |     +9.11 |     2.97× | CONFIRMED   |     -1.2% |     133 | 2026-08-28 |
|   17 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   36 |   23 | 20-16  |   55.6% |     +1.0% |     +1.12 |     1.35× | CONFIRMED   |    +12.7% |     147 | 2026-08-28 |
|   18 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   19 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   20 | 7dd2e5  | UFC        |   28 |    1 | 22-6   |   78.6% |    +18.5% |    +23.61 |     1.47× | CONFIRMED   |    +19.5% |      42 | 2026-08-29 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | d66e28  | MLB,WNBA   |   14 | 11-3   |   78.6% |     +63.4% |    +21.75 |     0.69× | 2026-08-29 |
|    2 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    3 | 2cbcf8  | MLB,UFC    |   11 | 8-3    |   72.7% |     +45.1% |    +19.74 |     1.12× | 2026-08-28 |
|    4 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    5 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|    6 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|    7 | e8e2cc  | MLB,NFL,WNBA |   11 | 8-3    |   72.7% |     +31.2% |    +10.24 |     0.78× | 2026-08-28 |
|    8 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    9 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   10 | a0cff6  | MLB,NBA,SOC,UFC,WNBA |   17 | 12-5   |   70.6% |     +28.6% |    +11.97 |     4.60× | 2026-08-29 |
|   11 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|   12 | 7923c4  | MLB,NBA,UFC |   55 | 33-22  |   60.0% |     +27.8% |    +37.84 |     0.83× | 2026-08-29 |
|   13 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|   14 | 07152f  | MLB,SOC    |   14 | 9-5    |   64.3% |     +22.6% |     +9.20 |     1.89× | 2026-08-29 |
|   15 | 4c8ed9  | MLB,SOC,UFC,WNBA |   16 | 9-7    |   56.3% |     +21.7% |     +5.07 |     2.86× | 2026-08-26 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 2a8409  | MLB,WNBA   |   11 | 3-8    |   27.3% |     -48.5% |     -8.49 |     1.21× | 2026-08-25 |
|    2 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    3 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    4 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    5 | ac9705  | MLB,WNBA   |   21 | 9-12   |   42.9% |     -12.2% |     -9.27 |     2.26× | 2026-08-22 |
|    6 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    7 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   47 | 22-25  |   46.8% |     -10.4% |    -14.15 |     4.19× | 2026-08-29 |
|    8 | 705ba1  | MLB        |   48 | 21-27  |   43.8% |      -8.8% |    -11.76 |     1.15× | 2026-08-29 |
|    9 | c9bba3  | MLB,NFL,SOC |   18 | 11-7   |   61.1% |      -8.7% |     -3.39 |     0.77× | 2026-08-29 |
|   10 | 7d395d  | MLB,UFC,WNBA |   14 | 7-7    |   50.0% |      -6.1% |     -1.83 |     1.78× | 2026-08-28 |
|   11 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   88 | 41-47  |   46.6% |      -5.2% |    -12.99 |     1.26× | 2026-08-28 |
|   12 | 2f2a9e  | MLB,SOC,WNBA |   81 | 44-37  |   54.3% |      -4.1% |     -9.05 |     2.04× | 2026-08-27 |
|   13 | ad88a3  | MLB,SOC    |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-08-21 |
|   14 | 4417bc  | MLB,SOC    |   13 | 5-8    |   38.5% |      -1.0% |     -0.16 |     0.36× | 2026-08-29 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   36 | 20-16  |   55.6% |      +1.0% |     +1.12 |     1.35× | 2026-08-28 |

> 🔴 **4 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `7da3d5` (FOR# 47, ROI -10.4%), `705ba1` (FOR# 48, ROI -8.8%), `eeabaf` (FOR# 88, ROI -5.2%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1856 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   471 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    18 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    74 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     8 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   372 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            286 |        66 |   26 |   18 |  176 |                    110 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            270 |        73 |   41 |   12 |  144 |                    126 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   91 |    902 | 1267 | 493-409 |  54.7% |      4.3% |    +105.67 |    +0.12 | 0.510 |        0.2499 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  842 |    +1.3pp |    +13.3pp |          +0.290 |   -0.039 |    +0.0901 | 🟡 mixed |
| v12 − v10          | +  840 |    +6.3pp |    +23.1pp |          +0.430 |   +0.116 |    +0.0305 | 🟢 better |
| v12 − v11          | +  791 |    -0.3pp |     +1.5pp |          +0.056 |   +0.066 |    +0.0143 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 732n 52.5% +2% | 10n 30.0% +29% | 15n 60.0% -1%  | 6n 83.3% +38%  | 46n 71.7% +25% | 33n 75.8% +15% | 60n 56.7% -2%  | 902n 54.7% +4% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 177n +2%      | 250n +3%      | 201n +7%      | 124n +2%      | 145n +11%     | 🟡 partial (2) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2451 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1136 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 897 / 1136 (79%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 897 / 1136 (79%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 897 / 1136 (79%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 897 / 1136 (79%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 897 / 1136 (79%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 897 / 1136 (79%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 897 / 1136 (79%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1136 / 1136 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1136 / 1136 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1136 / 1136 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1136 / 1136 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1136 / 1136 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1136 / 1136 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1129 / 1136 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1127 / 1136 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1136 / 1136 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1135 / 1136 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 701 / 1136 (62%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1135 / 1136 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 701 / 1136 (62%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 700 / 1136 (62%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1136 / 1136 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1136 / 1136 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1136 / 1136 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1135 / 1136 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1136 / 1136 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 701 |      |    +0.026 |    +0.257 |      +0.054 |      +0.127 |  0.527 |
|    2 | qMargin              | 897 |  🟢  |    +0.077 |    +0.013 |      +0.039 |      -0.002 |  0.529 |
|    3 | wd contribMargin     | 1136 |      |    -0.015 |    -0.114 |      -0.039 |      -0.093 |  0.478 |
|    4 | V12 forMean          | 897 |  🟢  |    +0.073 |    +0.032 |      +0.038 |      +0.007 |  0.529 |
|    5 | wd sizeMargin        | 700 |      |    -0.009 |    -0.008 |      -0.037 |      -0.057 |  0.499 |
|    6 | wd maxForContrib     | 1135 |      |    -0.045 |    -0.108 |      -0.036 |      -0.048 |  0.488 |
|    7 | wd agAvgSize         | 701 |      |    +0.011 |    -0.000 |      +0.033 |      +0.029 |  0.500 |
|    8 | lockPinnProb         | 1129 |      |    +0.191 |    +0.175 |      +0.027 |      -0.120 |  0.603 |
|    9 | clv                  | 1127 |      |    -0.029 |    +0.061 |      -0.027 |      +0.021 |  0.516 |
|   10 | agsV12               | 897 |  🟢  |    +0.043 |    -0.006 |      +0.026 |      -0.009 |  0.535 |
|   11 | wd contribFor        | 1136 |      |    -0.016 |    -0.070 |      -0.023 |      -0.052 |  0.484 |
|   12 | hcMargin             | 1136 |      |    +0.003 |    +0.216 |      -0.022 |      +0.058 |  0.513 |
|   13 | wd contribAg         | 1136 |      |    -0.004 |    +0.125 |      +0.018 |      +0.057 |  0.498 |
|   14 | V12 agCount          | 897 |  🟢  |    -0.013 |    +0.175 |      +0.017 |      +0.103 |  0.509 |
|   15 | provenMargin         | 1136 |      |    +0.003 |    +0.089 |      -0.014 |      +0.002 |  0.500 |
|   16 | wd forAvgSize        | 1135 |      |    +0.006 |    +0.049 |      -0.014 |      -0.005 |  0.514 |
|   17 | ags (v11)            | 1136 |      |    +0.008 |    +0.070 |      -0.014 |      -0.010 |  0.515 |
|   18 | provenFor            | 1136 |      |    -0.006 |    +0.067 |      -0.012 |      -0.005 |  0.497 |
|   19 | V12 forCount         | 897 |  🟢  |    +0.031 |    +0.196 |      +0.011 |      +0.049 |  0.516 |
|   20 | wd maxShare          | 1136 |      |    +0.014 |    -0.056 |      +0.010 |      -0.011 |  0.506 |
|   21 | provenTotal          | 1136 |      |    -0.010 |    +0.021 |      -0.008 |      -0.005 |  0.496 |
|   22 | peakStars            | 1136 |      |    +0.019 |    +0.068 |      -0.005 |      -0.014 |  0.509 |
|   23 | provenAg             | 1136 |      |    -0.013 |    +0.146 |      +0.001 |      +0.062 |  0.498 |
|   24 | V12 agMean           | 897 |  🟢  |    -0.010 |    +0.307 |      +0.000 |      +0.109 |  0.475 |
|   25 | countMargin          | 897 |      |    +0.039 |    +0.110 |      -0.000 |      -0.009 |  0.508 |
|   26 | wd forCount          | 1135 |      |    +0.014 |    +0.127 |      +0.000 |      +0.007 |  0.498 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.054), `qMargin` (r = +0.039), `wd contribMargin` (r = -0.039).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd agCount` — r(unit-ret) = +0.054, AUC = 0.527. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.054 · AUC = 0.527

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 338 | 177-161 |   52.4% |     -1.5% |
| MID (p33–p67)     | 2.000 … 2.000            | 170 | 88-82   |   51.8% |     -1.6% |
| HIGH (> p67)      | 3.000 … 4.000            | 193 | 112-81  |   58.0% |     +3.8% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.039 · AUC = 0.529

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 6.708            | 299 | 161-138 |   53.8% |     +0.4% |
| MID (p33–p67)     | 19.950 … 22.773          | 299 | 162-137 |   54.2% |     +0.6% |
| HIGH (> p67)      | 46.556 … 46.501          | 299 | 167-132 |   55.9% |     +0.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribMargin` · r(unit-ret) = -0.039 · AUC = 0.478

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -72.600        | 379 | 214-165 |   56.5% |     +1.9% |
| MID (p33–p67)     | 57.800 … 72.300          | 378 | 207-171 |   54.8% |     +0.7% |
| HIGH (> p67)      | 174.100 … 112.850        | 379 | 196-183 |   51.7% |     -2.3% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.038 · AUC = 0.529

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 6.708            | 299 | 162-137 |   54.2% |     +0.9% |
| MID (p33–p67)     | 19.950 … 14.298          | 299 | 158-141 |   52.8% |     -0.8% |
| HIGH (> p67)      | 48.906 … 46.501          | 299 | 170-129 |   56.9% |     +0.9% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd sizeMargin` · r(unit-ret) = -0.037 · AUC = 0.499

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.648          | 235 | 130-105 |   55.3% |     +1.7% |
| MID (p33–p67)     | 0.078 … 0.350            | 232 | 120-112 |   51.7% |     -0.3% |
| HIGH (> p67)      | 3.728 … 2.240            | 233 | 127-106 |   54.5% |     -1.6% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | qMargin        | wd contribMargin | V12 forMean    | wd sizeMargin  | wd maxForContrib | wd agAvgSize   | lockPinnProb   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         +0.027 |         -0.153 |         +0.134 |         +0.024 |         +0.300 |         +0.108 |         -0.073 |
| qMargin     |         +0.027 |  1.000         |         +0.071 |         +0.958 |         +0.199 |         +0.160 |         -0.036 |         +0.136 |
| wd contribMargin |         -0.153 |         +0.071 |  1.000         |         +0.087 |         +0.273 |         +0.507 |         -0.145 |         +0.179 |
| V12 forMean |         +0.134 |         +0.958 |         +0.087 |  1.000         |         +0.214 |         +0.205 |         -0.018 |         +0.123 |
| wd sizeMargin |         +0.024 |         +0.199 |         +0.273 |         +0.214 |  1.000         |         +0.265 |         -0.749 |         +0.157 |
| wd maxForContrib |         +0.300 |         +0.160 |         +0.507 |         +0.205 |         +0.265 |  1.000         |         +0.055 |         +0.029 |
| wd agAvgSize |         +0.108 |         -0.036 |         -0.145 |         -0.018 |         -0.749 |         +0.055 |  1.000         |         -0.103 |
| lockPinnProb |         -0.073 |         +0.136 |         +0.179 |         +0.123 |         +0.157 |         +0.029 |         -0.103 |  1.000         |

> 🔴 **Strong collinearity detected:** `qMargin` and `V12 forMean` have r = +0.958. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 580 picks · features = 8 (+ intercept) · multiple R² = **0.0112** · adjusted R² = **-0.0044** · residual sd = 0.953

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | qMargin              |  🟢 |    +0.1195 |   0.1494 | +0.80        |        1 |
|    2 | V12 forMean          |  🟢 |    -0.0675 |   0.1517 | -0.45        |        2 |
|    3 | wd agCount           |     |    +0.0629 |   0.0479 | +1.31        |        3 |
|    4 | wd agAvgSize         |     |    +0.0325 |   0.0668 | +0.49        |        4 |
|    5 | wd contribMargin     |     |    -0.0292 |   0.0514 | -0.57        |        5 |
|    6 | wd sizeMargin        |     |    -0.0141 |   0.0700 | -0.20        |        6 |
|    7 | lockPinnProb         |     |    +0.0050 |   0.0410 | +0.12        |        7 |
|    8 | wd maxForContrib     |     |    -0.0040 |   0.0558 | -0.07        |        8 |
| —    | (intercept)          |     |    +0.0142 |   0.0396 |    +0.36 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.119), `V12 forMean` (β = -0.068)
- V12 IGNORES: `wd agCount` (β = +0.063, t = +1.31), `wd agAvgSize` (β = +0.032, t = +0.49), `wd contribMargin` (β = -0.029, t = -0.57), `wd sizeMargin` (β = -0.014, t = -0.20), `lockPinnProb` (β = +0.005, t = +0.12), `wd maxForContrib` (β = -0.004, t = -0.07)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.542 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.559 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.017.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Adjusted R² of -0.0044 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*