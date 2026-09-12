# AGS-Unified — V12 Daily Monitor

**Generated:** Saturday, September 12, 2026 at 11:45 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (104 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (104 days ago), V12 has evaluated **3550** picks, shipped **1000** for real money (28.2% ship rate), and muted the other **2550**. On the shipped picks V12 has gone **552-448** (55.2% win), staked **2749.10u**, and returned **+152.89u** at **+5.6% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                            104 |
| Picks V12 has evaluated             |                           3550 |
| Picks SHIPPED (units > 0)           |                           1000 |
| Picks MUTED (score ≤ 0, FADE)       |                           2550 |
| Ship rate                           |                          28.2% |
| Live W-L                            |                        552-448 |
| Live Win %                          |                          55.2% |
| Live PnL (units)                    |                        +152.89 |
| Live ROI                            |                          +5.6% |
| Avg PnL / day                       |                         +1.47u |
| Most recent action (2026-09-13)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **5.6% ROI** across 1000 live picks (+152.89u real PnL).
- Mute rule is **saving money** — the 1685 muted picks would have lost -97.49u at flat 1u (-5.8% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.47u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **316-255** · +6.8% ROI · +106.28u on 571 graded — see § 5.

### What to watch

- 🟡 Weakest sport: **CFB** — 5 live, 2-3, -63.4% ROI, -8.88u.

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

**Full book:** 104d · 1000 live · 552-448 · **+152.89u** · +5.6% ROI · +1.47u/day.

_Prior to table (2026-06-01 → 2026-08-23): 815 live · 445-370 · +110.16u · cum through prior = +110.16u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-08-24 |        45 |   12 |    22 | 7-5        |  58.3% |     28.40 |      -2.12 |     -7.5% |    +108.04 |
| 2026-08-25 |        56 |   15 |    30 | 7-8        |  46.7% |     51.60 |      -7.95 |    -15.4% |    +100.09 |
| 2026-08-26 |        46 |   16 |    19 | 10-6       |  62.5% |     36.40 |     +12.91 |     35.5% |    +113.00 |
| 2026-08-27 |        26 |    9 |    12 | 7-2        |  77.8% |     29.40 |     +11.39 |     38.7% |    +124.39 |
| 2026-08-28 |        70 |   22 |    35 | 9-13       |  40.9% |     58.60 |     -30.30 |    -51.7% |     +94.09 |
| 2026-08-29 |        74 |   13 |    42 | 8-5        |  61.5% |     29.70 |     +11.58 |     39.0% |    +105.67 |
| 2026-08-30 |        49 |   19 |    26 | 11-8       |  57.9% |     52.90 |      +7.94 |     15.0% |    +113.61 |
| 2026-08-31 |        39 |    5 |    22 | 4-1        |  80.0% |     12.50 |      +3.74 |     29.9% |    +117.35 |
| 2026-09-01 |        44 |    4 |    31 | 4-0        | 100.0% |     16.90 |     +16.82 |     99.5% |    +134.17 |
| 2026-09-02 |        49 |    5 |    33 | 3-2        |  60.0% |     17.40 |      +4.88 |     28.0% |    +139.05 |
| 2026-09-03 |        34 |    6 |    16 | 5-1        |  83.3% |     17.00 |      +9.23 |     54.3% |    +148.28 |
| 2026-09-04 |        68 |    7 |    44 | 5-2        |  71.4% |     24.40 |      +6.05 |     24.8% |    +154.33 |
| 2026-09-05 |       109 |    9 |    80 | 6-3        |  66.7% |     23.90 |      +7.72 |     32.3% |    +162.05 |
| 2026-09-06 |        54 |    7 |    37 | 5-2        |  71.4% |     20.50 |      +7.23 |     35.3% |    +169.28 |
| 2026-09-07 |        48 |    7 |    28 | 5-2        |  71.4% |     21.00 |      +7.22 |     34.4% |    +176.50 |
| 2026-09-08 |        46 |    9 |    25 | 4-5        |  44.4% |     26.00 |      -1.59 |     -6.1% |    +174.91 |
| 2026-09-09 |        52 |    5 |    33 | 2-3        |  40.0% |     13.00 |      -2.44 |    -18.8% |    +172.47 |
| 2026-09-10 |        19 |    5 |     8 | 0-5        |   0.0% |     13.50 |     -13.50 |   -100.0% |    +158.97 |
| 2026-09-11 |        58 |   10 |    32 | 5-5        |  50.0% |     37.00 |      -6.08 |    -16.4% |    +152.89 |
| 2026-09-12 |       112 |    0 |     1 | 0-0        |      — |      0.00 |      +0.00 |         — |    +152.89 |
| 2026-09-13 |         2 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +152.89 |

> **Trajectory.** 🟡 Last 3 days (-16.4% ROI) **-22.3pp** vs prior (5.9%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-09-11**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 22 | 16-6 | +44.0% | +39.81u | +1.81u | -100.0% |
| 🟢 2 | RANK 2-for-0 rescue | B | 108 | 65-43 | +15.6% | +61.57u | +0.57u | +39.9% |
| 🟢 3 | DISSENT rescue | D | 24 | 13-11 | +12.0% | +3.05u | +0.13u | — |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 122 | 78-44 | +12.8% | +73.24u | sized UP after path |
| 2 | Tape HOLD (mid) | 392 | 212-180 | +5.5% | +49.33u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 29 | 12-17 | -37.1% | -23.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Score FADE (≤0 → 0u) | 897 | 450-447 | -0.3% | -3.12u | 🟡 flat |
| 2 | fadeTop≥60 MUTE | 47 | 23-24 | +0.9% | +0.43u | 🟡 flat |
| 3 | Tape MUTE (tape<0 → 0u) | 170 | 92-78 | +2.8% | +4.80u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 22 | 16-6 | 72.7% | 90.5u | +39.81u | +44.0% | +1.81u | 2 | -100.0% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 106 | 63-43 | 59.4% | 389.7u | +18.38u | +4.7% | +0.17u | 0 | — | — | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 108 | 65-43 | 60.2% | 393.5u | +61.57u | +15.6% | +0.57u | 9 | +39.9% | -2.86u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 87 | 43-44 | 49.4% | 303.0u | -10.51u | -3.5% | -0.12u | 7 | -23.1% | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 113 | 58-55 | 51.3% | 316.3u | -1.69u | -0.5% | -0.01u | 5 | -14.7% | +1.65u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 101 | 57-44 | 56.4% | 264.1u | +7.88u | +3.0% | +0.08u | 5 | -61.4% | -4.00u | 🔻 cooling |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 0 | — | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 24 | 13-11 | 54.2% | 25.4u | +3.05u | +12.0% | +0.13u | 0 | — | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 122 | 78-44 | 63.9% | 571.3u | +73.24u | +12.8% | 3 | -36.3% | — |
| Tape HOLD (mid) | TAPE | staked | 392 | 212-180 | 54.1% | 891.6u | +49.33u | +5.5% | 48 | +7.6% | -2.08u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 29 | 12-17 | 41.4% | 62.5u | -23.17u | -37.1% | 2 | -100.0% | -4.00u |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 170 | 92-78 | 54.1% | 170.0u | +4.80u | +2.8% | 48 | +24.2% | +2.93u |
| fadeTop≥60 MUTE | E | CF 1u | 47 | 23-24 | 48.9% | 47.0u | +0.43u | +0.9% | 8 | +40.3% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 897 | 450-447 | 50.2% | 897.0u | -3.12u | -0.3% | 133 | -9.5% | -5.89u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 8 / +52% | 1 / -100% | — |
| TOP | 38 / -2% | 24 / +4% | 4 / -16% |
| RANK | 59 / +15% | 10 / +27% | — |
| SHARP | 20 / -14% | 41 / +3% | 1 / -100% |
| SHARP-LEAN | 83 / +0% | 26 / +2% | 4 / -63% |
| MINI | 49 / -2% | 10 / +45% | 5 / -25% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 15 / +22% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-09-11)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| SHARP-LEAN EDGE/net ONE | 3 | 2-1 | +1.65u | +13.8% |
| RANK 2-for-0 rescue | 4 | 2-2 | -2.86u | -22.0% |
| MINI (gate-pass) | 1 | 0-1 | -4.00u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  32 | 16-6   |  72.7% |       90.50 |     +39.81 |     44.0% |
| TOP PICK (TOP+/TOP)       |  4-5u | 218 | 78-57  |  57.8% |      522.20 |      +6.44 |      1.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 693 | 172-150 |  53.4% |     1061.75 |     +42.76 |      4.0% |
| STRONG (MINI)             |    3u | 171 | 57-44  |  56.4% |      264.05 |      +7.88 |      3.0% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 129 | 27-22  |  55.1% |       56.85 |      +4.15 |      7.3% |
| **STAKED TOTAL** |     — | 629 | 350-279 |  55.6% |     1995.35 |    +101.04 |     +5.1% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  32 | 16-6   |  72.7% |       90.50 |     +39.81 |     44.0% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 189 | 63-43  |  59.4% |      389.70 |     +18.38 |      4.7% |
| B · 2-for-0 rescue    | RANK        |    4u | 167 | 65-43  |  60.2% |      393.45 |     +61.57 |     15.6% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 386 | 58-55  |  51.3% |      316.34 |      -1.69 |     -0.5% |
| C · proven-$ consensus | SHARP       |    3u | 126 | 43-44  |  49.4% |      302.96 |     -10.51 |     -3.5% |
| A · mini-HC (gate-pass) | MINI        |    3u | 171 | 57-44  |  56.4% |      264.05 |      +7.88 |      3.0% |
| C · mini gate-cut     | MINI-       |    1u |  32 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |  12 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  85 | 13-11  |  54.2% |       25.35 |      +3.05 |     12.0% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 652 picks tracked at 0u (would-be 305-347, 46.8% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (21-11, +39.81u)  ·  🟢 TOP PICK (116-102, +6.44u)  ·  🟠 SHARP PLAY (346-347, +42.76u)  ·  🔴 STRONG (93-78, +7.88u)  ·  🟣 LEAN (74-55, +4.15u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12"]
    y-axis "PnL (u)" -14 --> 50
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54, 44.81, 44.81, 44.81, 44.81, 44.81, 41.81, 41.81, 39.81, 39.81, 39.81]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85, 38.85, 38.79, 38.82, 41.18, 43.74, 44.86, 43.97, 43.97, 42.76, 42.76]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37, 18.31, 18.31, 18.31, 18.31, 18.31, 21.88, 21.88, 11.88, 7.88, 7.88]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71, 72, 71, 72, 72, 72, 70, 70, 68, 66, 66]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50, 50, 50, 49, 49, 50, 50, 50, 50, 50, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57, 57, 57, 56, 55, 55, 56, 55, 54, 54, 54]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 56, 57, 57, 57, 57, 57, 57, 57]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 2238 | 2227 | 2106 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 170 | 92-78 | 54.1% | 37.00u | +5.60u | +15.1% |
| HOLD      | 703 | 356-347 | 50.6% | 894.57u | +46.33u | +5.2% |
| BOOST     | 191 | 114-77 | 59.7% | 574.78u | +75.32u | +13.1% |
| FAIL_OPEN | 52 | 28-24 | 53.8% | 62.50u | -23.17u | -37.1% |
| PASS      | 990 | 491-499 | 49.6% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 756 | 394-362 | 52.1% | +14.49u |
| hold (0–2.89) | path u | 892 | 435-457 | 48.8% | +41.82u |
| boost (≥2.89) | ×1.35 | 238 | 135-103 | 56.7% | +69.67u |

_Score coverage: **1886/2106** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 170 | +11.65u | -11.65u | +104.75u | +116.40u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 124 | +54.25u | +75.32u | +21.07u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-09-12 | CFB | Virginia Tech | SHARP~ | -1.52 | MUTE | 1.00u | 0.00u | — |
| 2026-09-12 | MLB | St. Louis Cardinals | SHARP~ | -0.21 | MUTE | 2.00u | 0.00u | — |
| 2026-09-12 | MLB | Washington Nationals | MINI | 3.70 | BOOST | 4.00u | 5.40u | — |
| 2026-09-12 | MLB | New York Mets | SHARP | 4.80 | BOOST | 2.50u | 4.00u | — |
| 2026-09-12 | MLB | San Diego Padres | MINI | 3.63 | BOOST | 4.00u | 0.00u | — |
| 2026-09-12 | MLB | Texas Rangers | CONFIRMED-Q1 | -0.79 | MUTE | 1.00u | 4.00u | — |
| 2026-09-12 | SOC | Arsenal FC | SHARP~ | 3.15 | BOOST | 4.00u | 0.00u | — |
| 2026-09-12 | SOC | Liverpool FC | SHARP~ | 4.23 | BOOST | 4.00u | 0.00u | — |
| 2026-09-12 | SOC | Chelsea FC | CONFIRMED-UNOPP | -0.28 | MUTE | 1.00u | 0.00u | — |
| 2026-09-12 | UFC | Waldo Cortes Acosta | SHARP | 4.09 | BOOST | 3.00u | 0.00u | — |
| 2026-09-12 | UFC | Édgar Cháirez | 2-for-0 | 6.06 | BOOST | 5.00u | 0.00u | — |
| 2026-09-12 | UFC | Sean King | CONFIRMED-UNOPP | -0.31 | MUTE | 1.00u | 0.00u | — |
| 2026-09-12 | UFC | Regina Tarin | SHARP | 6.52 | BOOST | 4.00u | 0.00u | — |
| 2026-09-12 | UFC | Jean Silva | SHARP~ | 4.43 | BOOST | 4.00u | 0.00u | — |
| 2026-09-12 | UFC | Joseph Morales | 2-for-0 | 5.36 | BOOST | 5.00u | 0.00u | — |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.98** · nPriors=607 · source=expanding_q1 · asOf=2026-09-12 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 1792 | 1687 | 1576 | 334 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 119 | 50-69 | 42.0% | 11.00u | -3.29u | -29.9% |
| HOLD      | 345 | 177-168 | 51.3% | 321.20u | +21.11u | +6.6% |
| FAIL_OPEN | 47 | 20-27 | 42.6% | 44.90u | -5.08u | -11.3% |
| EXEMPT    | 682 | 371-311 | 54.4% | 673.60u | +64.94u | +9.6% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -69.5 … -3.4 | 62 | 21-41 | 33.9% | 0.0u | +0.00u | — |
| Q2 | -3.2 … 0.9 | 62 | 28-34 | 45.2% | 36.9u | +14.66u | +39.7% |
| Q3 | 0.9 … 5.5 | 62 | 30-32 | 48.4% | 58.5u | +2.63u | +4.5% |
| Q4 | 5.6 … 16.8 | 62 | 34-28 | 54.8% | 80.6u | -10.13u | -12.6% |
| Q5 | 18.2 … 1802.6 | 62 | 35-27 | 56.5% | 106.7u | +9.95u | +9.3% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 119 | 50-69 | -15.79u | +15.79u | +82.50u | +66.71u |

> 🟢 **Mute is saving money** (Δ +15.79u · muted WR 42.0%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 53 | 19-34 | 35.8% | 61.0u | -18.01u |
| CFB | 6 | 2-4 | 33.3% | 11.9u | +1.29u |
| MLB | 83 | 36-47 | 43.4% | 99.5u | -11.14u |
| NFL | 4 | 2-2 | 50.0% | 4.0u | +0.10u |
| SOC | 4 | 1-3 | 25.0% | 4.0u | -0.87u |
| WNBA | 22 | 9-13 | 40.9% | 24.0u | -5.17u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-09-11 | MLB | Pittsburgh Pirates | CONFIRMED-UNOPP | -3.3 | -1.0 | 3.00u | LOSS |
| 2026-09-11 | CFB | Over 51.5 | CONFIRMED-Q1 | -3.3 | -1.0 | 5.40u | WIN |
| 2026-09-11 | MLB | Under 8.5 | SHARP~ | -4.2 | -1.0 | 4.00u | LOSS |
| 2026-09-11 | MLB | Over 7.5 | SHARP~ | -6.5 | -1.0 | 1.00u | LOSS |
| 2026-09-10 | MLB | Colorado Rockies | — | -10.8 | -1.1 | 1.00u | LOSS |
| 2026-09-09 | MLB | Kansas City Royals | SHARP~ | -33.5 | -1.2 | 1.00u | WIN |
| 2026-09-09 | MLB | Colorado Rockies | SHARP~ | -11.1 | -1.2 | 1.00u | LOSS |
| 2026-09-09 | MLB | St. Louis Cardinals | SHARP | -7.7 | -1.2 | 3.00u | LOSS |
| 2026-09-07 | CFB | Florida State | — | -124.3 | -1.2 | 1.00u | LOSS |
| 2026-09-07 | MLB | Cleveland Guardians | SHARP~ | -8.1 | -1.2 | 1.00u | LOSS |
| 2026-09-07 | SOC | Elche CF | — | -49.3 | -1.2 | 1.00u | LOSS |
| 2026-09-07 | MLB | Baltimore Orioles | — | -1.7 | -1.2 | 1.00u | WIN |
| 2026-09-06 | CFB | Wisconsin | SHARP~ | -16.2 | -1.2 | 1.00u | LOSS |
| 2026-09-06 | CFB | Over 46.5 | SHARP~ | -4.4 | -1.2 | 1.00u | WIN |
| 2026-09-06 | CFB | Over 51.5 | SHARP | -5.2 | -1.2 | 1.00u | LOSS |
| 2026-09-06 | MLB | Over 7.5 | SHARP~ | -22.7 | -1.2 | 1.00u | LOSS |
| 2026-09-06 | MLB | Under 7.5 | SHARP~ | -17.4 | -1.2 | 1.00u | WIN |
| 2026-09-05 | CFB | Hawai'i | CONFIRMED-UNOPP | -2.0 | -1.3 | 2.50u | LOSS |
| 2026-09-05 | MLB | Minnesota Twins | SHARP~ | -2.1 | -1.3 | 1.00u | WIN |
| 2026-09-05 | MLB | Seattle Mariners | SHARP~ | -4.4 | -1.3 | 1.00u | LOSS |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 90 | 48-42 | 53.3% | 282.7u | +17.11u | +6.1% |
| Muted (Q1 → 0u) | 119 | 50-69 | 42.0% | 11.0u | -3.29u | -29.9% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 151–86 · 63.7% · +14.9%); **5–10 is the hole** (87–82 · 51.5% · -1.4%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 782 tickets · cov 755/782 (stamp 553 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 349 | 184–165 | 52.7% | -0.2% |
| 5–10 | 169 | 87–82 | 51.5% | -1.4% |
| ≥10 | 237 | 151–86 | 63.7% | +14.9% |
| All | 782 | 434–348 | 55.5% | +5.8% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (111) | 57.1% (70) | 68.8% (93) |
| B | 57.5% (73) | 58.3% (12) | 69.6% (23) |
| C | 37.5% (40) | 44.8% (58) | 57.8% (109) |

##### Jul 15+ · 571 tickets · cov 550/571 (stamp 548 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 243 | 131–112 | 53.9% | +5.8% |
| 5–10 | 130 | 64–66 | 49.2% | -3.5% |
| ≥10 | 177 | 112–65 | 63.3% | +12.5% |
| All | 571 | 316–255 | 55.3% | +6.8% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.1% (52) | 56.1% (41) | 69.2% (52) |
| B | 59.6% (47) | 42.9% (7) | 68.8% (16) |
| C | 36.8% (19) | 45.3% (53) | 58.6% (99) |

##### Yesterday (Sep 11) · 10 tickets · cov 10/10 (stamp 10 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 3 | 2–1 | 66.7% | +24.9% |
| 5–10 | 4 | 2–2 | 50.0% | -25.9% |
| ≥10 | 3 | 1–2 | 33.3% | -39.1% |
| All | 10 | 5–5 | 50.0% | -16.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | — | 0% (1) |
| B | 50% (2) | 50% (2) | — |
| C | — | 100% (1) | 50% (2) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 782 tickets · cov 774/782 (stamp 563 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 512 | 288–224 | 56.3% | +6.2% |
| 5–10 | 137 | 73–64 | 53.3% | +7.9% |
| ≥10 | 125 | 71–54 | 56.8% | +5.6% |
| All | 782 | 434–348 | 55.5% | +5.8% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.7% (175) | 50% (52) | 70.4% (54) |
| B | 63% (81) | 50% (14) | 53.8% (13) |
| C | 50% (120) | 58.3% (48) | 42.2% (45) |

##### Jul 15+ · 571 tickets · cov 564/571 (stamp 563 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 362 | 210–152 | 58.0% | +11.5% |
| 5–10 | 114 | 60–54 | 52.6% | +7.9% |
| ≥10 | 88 | 44–44 | 50.0% | -6.7% |
| All | 571 | 316–255 | 55.3% | +6.8% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 63% (81) | 47.2% (36) | 60.6% (33) |
| B | 62.3% (53) | 50% (10) | 57.1% (7) |
| C | 53.8% (93) | 57.8% (45) | 38.9% (36) |

##### Yesterday (Sep 11) · 10 tickets · cov 9/10 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 9 | 5–4 | 55.6% | -6.3% |
| All | 10 | 5–5 | 50.0% | -16.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 0% (1) | — | — |
| B | 50% (4) | — | — |
| C | 100% (2) | — | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 782 tickets · cov 753/782 (stamp 545 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 160 | 81–79 | 50.6% | -12.1% |
| 0–2.89 | 422 | 228–194 | 54.0% | +7.8% |
| ≥2.89 | 171 | 113–58 | 66.1% | +16.4% |
| All | 782 | 434–348 | 55.5% | +5.8% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 57.5% (160) | 74.3% (70) |
| B | 64.7% (34) | 56.1% (57) | 64.7% (17) |
| C | 18.2% (11) | 50% (122) | 56.2% (73) |

##### Jul 15+ · 571 tickets · cov 548/571 (stamp 545 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 91 | 53–38 | 58.2% | +8.0% |
| 0–2.89 | 331 | 174–157 | 52.6% | +5.1% |
| ≥2.89 | 126 | 80–46 | 63.5% | +12.2% |
| All | 571 | 316–255 | 55.3% | +6.8% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 53.4% (103) | 72.5% (40) |
| B | 66.7% (18) | 57.1% (42) | 60% (10) |
| C | — | 50.5% (103) | 55.2% (67) |

##### Yesterday (Sep 11) · 10 tickets · cov 9/10 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 5 | 3–2 | 60.0% | +1.6% |
| 0–2.89 | 4 | 2–2 | 50.0% | -14.7% |
| All | 10 | 5–5 | 50.0% | -16.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 0% (1) | — |
| B | 50% (4) | — | — |
| C | — | 100% (2) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 571 | 316-255 | 55.3% | 1572.85u | +106.28u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 571/571 | 2.93 | 2.70 | +0.23 | 2.00 | 2.00 |
| depth   | #A sharps        | 571/571 | 1.49 | 1.55 | -0.06 | 1.00 | 1.00 |
| depth   | #F − #A          | 571/571 | 1.44 | 1.15 | +0.29 | 1.00 | 1.00 |
| depth   | proven F         | 571/571 | 2.07 | 1.95 | +0.12 | 1.50 | 2.00 |
| depth   | proven A         | 571/571 | 0.71 | 0.70 | +0.01 | 0.00 | 0.00 |
| depth   | proven F−A       | 571/571 | 1.35 | 1.25 | +0.10 | 1.00 | 1.00 |
| depth   | v12 F count      | 571/571 | 2.91 | 2.71 | +0.20 | 2.00 | 2.00 |
| depth   | v12 A count      | 571/571 | 1.57 | 1.63 | -0.06 | 1.00 | 1.00 |
| depth   | WA ForN          | 571/571 | 2.29 | 2.18 | +0.10 | 2.00 | 2.00 |
| depth   | WA AgN           | 571/571 | 1.26 | 1.35 | -0.09 | 1.00 | 1.00 |
| depth   | CLV ForN         | 570/571 | 2.64 | 2.47 | +0.18 | 2.00 | 2.00 |
| depth   | CLV AgN          | 570/571 | 1.46 | 1.55 | -0.09 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 571/571 | 0.36 | 0.33 | +0.04 | 0.00 | 0.00 |
| quality | ForWR            | 548/571 | 56.65 | 55.09 | +1.56 | 54.40 | 54.23 |
| quality | AgWR             | 356/571 | 45.87 | 46.81 | -0.94 | 47.11 | 47.87 |
| quality | TopFor WR        | 548/571 | 61.33 | 60.06 | +1.27 | 58.16 | 56.60 |
| quality | TopAg WR         | 356/571 | 49.32 | 49.85 | -0.53 | 49.41 | 50.00 |
| quality | EDGE             | 548/571 | 9.19 | 7.08 | +2.11 | 7.00 | 5.26 |
| quality | ForCLV           | 563/571 | 64.35 | 64.33 | +0.03 | 64.51 | 65.06 |
| quality | AgCLV            | 382/571 | 62.55 | 61.20 | +1.35 | 63.31 | 62.80 |
| quality | netCLV           | 563/571 | 1.99 | 2.88 | -0.90 | 2.40 | 2.82 |
| quality | Tape             | 545/571 | 2.13 | 1.82 | +0.31 | 1.51 | 1.44 |
| quality | V12 score        | 571/571 | 0.81 | 0.79 | +0.02 | 0.96 | 0.94 |
| quality | V12 forMean      | 571/571 | 29.01 | 24.05 | +4.95 | 21.82 | 16.93 |
| quality | V12 agMean       | 571/571 | 3.30 | 3.10 | +0.20 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | V12 agMean       | quality | 571/571 | 0.449 | +0.350 | +0.014 | +0.20 | 🟡 mild OK |
|    2 | V12 score        | quality | 571/571 | 0.551 | -0.015 | +0.042 | +0.02 | 🟡 mild OK |
|    3 | EDGE             | quality | 548/571 | 0.546 | -0.024 | +0.100 | +2.11 | 🟡 mild OK |
|    4 | AgCLV            | quality | 382/571 | 0.545 | -0.040 | +0.089 | +1.35 | 🟡 mild inv |
|    5 | V12 forMean      | quality | 571/571 | 0.543 | +0.187 | +0.090 | +4.95 | 🟡 mild OK |
|    6 | TopFor WR        | quality | 548/571 | 0.536 | +0.167 | +0.060 | +1.27 | flat |
|    7 | AgWR             | quality | 356/571 | 0.467 | +0.166 | -0.070 | -0.94 | flat |
|    8 | proven A         | depth   | 571/571 | 0.470 | +0.324 | +0.006 | +0.01 | flat |
|    9 | ForWR            | quality | 548/571 | 0.528 | +0.040 | +0.086 | +1.56 | flat |
|   10 | WA AgN           | depth   | 571/571 | 0.473 | +0.186 | -0.030 | -0.09 | flat |
|   11 | netCLV           | quality | 563/571 | 0.475 | -0.118 | -0.038 | -0.90 | flat |
|   12 | Tape             | quality | 545/571 | 0.525 | -0.101 | +0.053 | +0.31 | flat |
|   13 | unopposed (A=0)  | depth   | 571/571 | 0.521 | +0.255 | +0.040 | +0.04 | flat |
|   14 | CLV ForN         | depth   | 570/571 | 0.520 | +0.299 | +0.046 | +0.18 | flat |
|   15 | CLV AgN          | depth   | 570/571 | 0.483 | +0.162 | -0.027 | -0.09 | flat |
|   16 | #A sharps        | depth   | 571/571 | 0.484 | +0.177 | -0.016 | -0.06 | flat |
|   17 | v12 A count      | depth   | 571/571 | 0.484 | +0.166 | -0.018 | -0.06 | flat |
|   18 | #F sharps        | depth   | 571/571 | 0.515 | +0.308 | +0.049 | +0.23 | flat |
|   19 | ForCLV           | quality | 563/571 | 0.486 | -0.176 | +0.001 | +0.03 | flat |
|   20 | #F − #A          | depth   | 571/571 | 0.514 | +0.231 | +0.060 | +0.29 | flat |
|   21 | proven F−A       | depth   | 571/571 | 0.513 | +0.284 | +0.037 | +0.10 | flat |
|   22 | TopAg WR         | quality | 356/571 | 0.489 | +0.127 | -0.031 | -0.53 | flat |
|   23 | v12 F count      | depth   | 571/571 | 0.509 | +0.311 | +0.046 | +0.20 | flat |
|   24 | WA ForN          | depth   | 571/571 | 0.496 | +0.312 | +0.029 | +0.10 | flat |
|   25 | proven F         | depth   | 571/571 | 0.502 | +0.374 | +0.038 | +0.12 | flat |

### (C) Working read

_N=571 is still early — treat ranks as hypotheses, not gates._

- **V12 agMean** — AUC 0.449 · Δ +0.20 · higher on LOSSes (cov 571/571)
- **V12 score** — AUC 0.551 · Δ +0.02 · higher on WINs (cov 571/571)
- **EDGE** — AUC 0.546 · Δ +2.11 · higher on WINs (cov 548/571)
- **V12 forMean** — AUC 0.543 · Δ +4.95 · higher on WINs (cov 571/571)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1075 | 280 | 280 | 266 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 39 | 22-17 | 56.4% | 117.40u | +11.56u | +9.8% | -0.4 |
| on→off | 11 | 4-7 | 36.4% | 35.20u | -9.86u | -28.0% | -5.6 |
| off→on | 43 | 27-16 | 62.8% | 116.20u | +26.05u | +22.4% | +2.0 |
| off→off | 173 | 96-77 | 55.5% | 450.30u | +20.77u | +4.6% | -0.6 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 169 | 89-80 | 52.7% | 496.60u | +1.31u | +0.3% |
| 0–2 | 67 | 43-24 | 64.2% | 166.10u | +52.23u | +31.4% |
| 2–4 | 15 | 9-6 | 60.0% | 36.90u | -0.22u | -0.6% |
| 4+ | 15 | 8-7 | 53.3% | 19.50u | -4.80u | -24.6% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 4 | 3-1 | 75.0% | 10.00u | +3.72u | +37.2% |
| gold, limits flat | 7 | 5-2 | 71.4% | 20.30u | +14.59u | +71.9% |
| steam, not gold | 71 | 41-30 | 57.7% | 203.30u | +19.30u | +9.5% |
| limits↑, no steam | 8 | 4-4 | 50.0% | 19.90u | +4.09u | +20.6% |
| neither | 176 | 96-80 | 54.5% | 465.60u | +6.82u | +1.5% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 77 | 47-30 | 61.0% | 225.60u | +38.66u | +17.1% |
| A/B + no steam | 166 | 94-72 | 56.6% | 433.70u | +32.26u | +7.4% |
| A/B + steam arriving | 42 | 27-15 | 64.3% | 115.20u | +27.05u | +23.5% |
| A/B + gold | 10 | 7-3 | 70.0% | 27.30u | +16.88u | +61.8% |
| steam at lock, no A/B | 5 | 2-3 | 40.0% | 8.00u | -1.05u | -13.1% |
| Source B + steam arriving | 41 | 27-14 | 65.9% | 113.20u | +29.05u | +25.7% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| CFB   | 3n · 66.7% · -14.7%    | 2n · 0.0% · -100.0%    | —                      | 5n · 40.0% · -63.4%    |
| MLB   | 411n · 54.3% · +6.3%   | 96n · 55.2% · +0.8%    | 307n · 52.1% · +4.9%   | 814n · 53.6% · +5.1%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 10n · 60.0% · +7.9%    | 4n · 50.0% · -41.8%    | 3n · 33.3% · -20.2%    | 17n · 52.9% · -8.1%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 53n · 67.9% · +15.9%   | —                      | —                      | 53n · 67.9% · +15.9%   |
| UFC   | 34n · 76.5% · +16.6%   | —                      | —                      | 34n · 76.5% · +16.6%   |
| WNBA  | 27n · 74.1% · +3.2%    | 19n · 42.1% · +1.0%    | 15n · 46.7% · -10.3%   | 61n · 57.4% · -0.5%    |
| **All** | **545n · 57.8% · +8.0%** | **125n · 52.8% · -1.0%** | **330n · 51.8% · +4.1%** | **1000n · 55.2% · +5.6%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1685** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1685 |
| Muted W-L                           |              824-861 |
| Muted Win %                         |                48.9% |
| Counterfactual PnL at flat 1u       |               -97.49 |
| Counterfactual ROI at flat 1u       |                -5.8% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-97.49u** at a flat 1u stake — a counterfactual ROI of **-5.8%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-09-11 | MLB   | ML     | Detroit Tigers          |  -169 | +0.577 | 2-for-0  |   5/1 |   3/0 |  55.9 |   43.5 |   +5.9 | -1.61 | HOLD     | 3.00u | WIN     |      +1.78 |
| 2026-09-11 | MLB   | ML     | Chicago White Sox       |  +102 | +0.935 | 2-for-0  |   2/0 |   2/0 |  51.6 |   55.6 |   +1.6 | -0.64 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-11 | MLB   | ML     | Chicago Cubs            |  -171 | +0.384 | SHARP~   |   8/6 |   7/4 |  57.7 |   54.6 |   +9.8 |  1.76 | HOLD     | 4.00u | WIN     |      +2.34 |
| 2026-09-11 | MLB   | ML     | Arizona Diamondbacks    |  -121 | +0.237 | SHARP~   |   3/2 |   3/1 |  59.2 |   56.9 |  +10.7 |  1.13 | HOLD     | 4.00u | WIN     |      +3.31 |
| 2026-09-11 | CFB   | SPREAD | Kansas                  |  -104 | +0.597 | SHARP~   |   2/4 |   2/2 |  67.7 |      — |  +25.1 |     — | FAIL_OPEN | 4.00u | LOSS    |      -4.00 |
| 2026-09-11 | CFB   | SPREAD | Rutgers                 |  -134 | +0.974 | 2-for-0  |   4/0 |   3/0 |  58.7 |   32.8 |   +8.7 | -2.64 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-11 | MLB   | TOTAL  | Under 8.5               |  -128 | +0.815 | CONFIRMED-Q1 |   3/1 |   2/1 |  47.3 |   65.1 |   -5.1 | -1.86 | HOLD     | 4.00u | WIN     |      +3.13 |
| 2026-09-11 | MLB   | TOTAL  | Over 7.5                |  -127 | +0.895 | 2-for-0  |   3/0 |   3/0 |  51.1 |   56.1 |   +1.1 | -0.67 | HOLD     | 3.00u | WIN     |      +2.36 |
| 2026-09-11 | MLB   | TOTAL  | Under 7.5               |  +127 | +0.486 | CONFIRMED-Q1 |   5/5 |   5/5 |  62.3 |   65.4 |   +9.4 |  1.88 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-11 | MLB   | TOTAL  | Under 7.5               |  +108 | +0.906 | MINI     |   3/1 |   3/0 |  54.3 |   67.2 |  +11.1 |  2.45 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-10 | MLB   | ML     | Chicago White Sox       |  -112 | +0.814 | MINI     |   7/3 |   5/2 |  50.9 |   62.0 |   +2.8 |  1.30 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-10 | MLB   | SPREAD | Colorado Rockies        |  +127 | +0.886 | MINI     |   1/2 |   1/2 |  70.3 |      — |  +15.3 |     — | FAIL_OPEN | 4.00u | LOSS    |      -4.00 |
| 2026-09-10 | NFL   | SPREAD | Rams                    |  -104 | +0.844 | HC-2     |  11/9 |   3/2 |  62.7 |   64.8 |  +10.3 |  4.14 | BOOST    | 2.00u | LOSS    |      -2.00 |
| 2026-09-10 | MLB   | TOTAL  | Under 8.5               |  +105 | +0.965 | MINI     |   4/1 |   3/1 |  66.0 |   67.7 |  +13.4 |  2.22 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-10 | MLB   | TOTAL  | Over 6.5                |  +162 | +0.407 | CONFIRMED-Q1 |   1/2 |   1/2 |  56.8 |   65.3 |   +1.4 | -1.05 | HOLD     | 1.50u | LOSS    |      -1.50 |
| 2026-09-09 | MLB   | ML     | Los Angeles Dodgers     |  -270 | +0.989 | 2-for-0  |   2/0 |   2/0 |  54.5 |   39.3 |   +4.5 | -2.50 | HOLD     | 3.00u | WIN     |      +1.11 |
| 2026-09-09 | MLB   | ML     | Pittsburgh Pirates      |  +115 | +0.391 | CONFIRMED-Q1 |   2/5 |   1/4 |  60.9 |   62.8 |   +8.0 |  1.29 | HOLD     | 3.00u | WIN     |      +3.45 |
| 2026-09-09 | MLB   | ML     | Toronto Blue Jays       |  -160 | +0.481 | CONFIRMED-Q1 |   3/2 |   3/2 |  61.8 |   50.8 |   +3.4 | -0.55 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-09 | MLB   | TOTAL  | Under 8.5               |  -102 | +0.289 | SHARP~   |   9/5 |   7/3 |  52.0 |   66.1 |   +0.4 |  1.49 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-09 | NFL   | TOTAL  | Over 44.5               |  +105 | +0.985 | CONFIRMED-Q1 |  14/2 |   5/1 |  55.0 |   60.1 |   +5.0 |  1.21 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-08 | MLB   | ML     | Arizona Diamondbacks    |  -105 | +0.838 | CONFIRMED-Q1 |   9/4 |   9/7 |  55.1 |   55.7 |   -0.9 | -1.42 | MUTE     | 3.00u | WIN     |      +2.86 |
| 2026-09-08 | MLB   | ML     | Boston Red Sox          |  -134 | +0.891 | CONFIRMED-Q1 |   4/1 |   2/1 |  58.5 |   50.7 |   +5.0 |  0.66 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-08 | MLB   | ML     | Detroit Tigers          |  -130 | +0.386 | SHARP~   |   6/1 |   6/1 |  59.5 |   52.0 |   +9.9 |  0.96 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-08 | MLB   | ML     | Texas Rangers           |  +119 | +0.987 | MINI     |   5/0 |   4/0 |  58.8 |   58.6 |   +8.8 |  1.25 | HOLD     | 3.00u | WIN     |      +3.57 |
| 2026-09-08 | MLB   | SPREAD | Chicago Cubs            |  -105 | +0.025 | CONFIRMED-Q1 |   7/2 |   6/2 |  56.4 |   62.1 |   +9.9 |  1.84 | HOLD     | 3.00u | WIN     |      +2.86 |
| 2026-09-08 | MLB   | TOTAL  | Over 7.5                |  +106 | +0.755 | HC-2     |   5/2 |   3/2 |  60.2 |   60.2 |   +8.6 |  1.87 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-08 | MLB   | TOTAL  | Over 8.5                |  +118 | +0.744 | CONFIRMED-Q1 |   2/1 |   2/1 |  55.8 |   69.0 |   +4.0 |  1.72 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-08 | MLB   | TOTAL  | Under 8.5               |  +107 | +0.395 | CONFIRMED-Q1 |   2/2 |   1/2 |  53.4 |   57.0 |   +1.8 |  0.02 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-08 | MLB   | TOTAL  | Under 9.5               |  +104 | +0.989 | 2-for-0  |   2/0 |   2/0 |  51.7 |   64.4 |   +1.7 |  0.69 | HOLD     | 3.00u | WIN     |      +3.12 |
| 2026-09-07 | MLB   | ML     | Arizona Diamondbacks    |  -104 | +0.229 | CONFIRMED-Q1 |   5/5 |   3/5 |  65.1 |   60.9 |   +8.0 |  1.51 | HOLD     | 3.00u | WIN     |      +2.88 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.539 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.075 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.026 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.009 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.033 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  995 |    +0.0673 |    -0.0370 | 0.0003 |  +0.018 |   0.946 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  995 |    +0.0651 |    +0.4977 | 0.0011 |  +0.033 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  995 |    -0.1796 |    +0.2998 | 0.0003 |  -0.016 |   2.838 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 995 |          +0.076 |           +0.073 |                   +0.040 |                   +0.033 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 995 |          +0.001 |           +0.325 |                   +0.011 |                   +0.121 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 995 |          +0.030 |           +0.226 |                   +0.009 |                   +0.066 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 995 |          -0.020 |           +0.174 |                   +0.009 |                   +0.102 | count of contributing AGAINST-side wallets                     |
| provenFor         | 995 |          +0.028 |           +0.216 |                   +0.020 |                   +0.093 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 995 |          +0.003 |           +0.159 |                   +0.021 |                   +0.078 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 4.825          | 332 | 178-154 |   53.6% |     +0.4% |
| MID (p33–p67)     | 19.950 … 18.396        | 331 | 182-149 |   55.0% |     +0.6% |
| HIGH (> p67)      | 48.906 … 48.927        | 332 | 189-143 |   56.9% |     +1.0% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       995 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8294 | average score across live picks                                 |
| SD                |    0.2509 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.770 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +1.960 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.391 / +0.957 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| CFB   |    5 | 2-3    |   40.0% |    -63.4% |  1.000 |        +0.900 | strong (N<20)                             |
| MLB   |  810 | 434-376 |   53.6% |     +5.0% |  0.520 |        -0.086 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   17 | 9-8    |   52.9% |     -8.1% |  0.569 |        -0.096 | real (N<20)                               |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   52 | 35-17  |   67.3% |    +15.6% |  0.580 |        +0.083 | real                                      |
| UFC   |   34 | 26-8   |   76.5% |    +16.6% |  0.596 |        +0.046 | strong                                    |
| WNBA  |   61 | 35-26  |   57.4% |     -0.5% |  0.548 |        +0.051 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11"]
    y-axis "AUC" 0.4 --> 0.7
    line [0.596, 0.581, 0.594, 0.619, 0.586, 0.558, 0.538, 0.587, 0.659, 0.591, 0.588, 0.597, 0.613, 0.53]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11"]
    y-axis "edge (pp)" -2 --> 22
    line [-0.5, -0.2, 0.3, 3.3, 2.4, 2.9, 12.4, 15.5, 20.9, 20.6, 13.5, 10.9, 2.8, 0]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-08-29 |    7 |  108 | 60-48  |   55.6% |     +2.8% |  0.596 |      -0.5pp |
| 2026-08-30 |    7 |  106 | 59-47  |   55.7% |     +1.2% |  0.581 |      -0.2pp |
| 2026-08-31 |    7 |   99 | 56-43  |   56.6% |     +3.4% |  0.594 |      +0.3pp |
| 2026-09-01 |    7 |   88 | 53-35  |   60.2% |    +14.4% |  0.619 |      +3.3pp |
| 2026-09-02 |    7 |   77 | 46-31  |   59.7% |    +12.0% |  0.586 |      +2.4pp |
| 2026-09-03 |    7 |   74 | 44-30  |   59.5% |    +11.7% |  0.558 |      +2.9pp |
| 2026-09-04 |    7 |   59 | 40-19  |   67.8% |    +35.3% |  0.538 |     +12.4pp |
| 2026-09-05 |    7 |   55 | 38-17  |   69.1% |    +34.2% |  0.587 |     +15.5pp |
| 2026-09-06 |    7 |   43 | 32-11  |   74.4% |    +42.0% |  0.659 |     +20.9pp |
| 2026-09-07 |    7 |   45 | 33-12  |   73.3% |    +41.9% |  0.591 |     +20.6pp |
| 2026-09-08 |    7 |   50 | 33-17  |   66.0% |    +27.1% |  0.588 |     +13.5pp |
| 2026-09-09 |    7 |   50 | 32-18  |   64.0% |    +22.9% |  0.597 |     +10.9pp |
| 2026-09-10 |    7 |   49 | 27-22  |   55.1% |     +7.5% |  0.613 |      +2.8pp |
| 2026-09-11 |    7 |   52 | 27-25  |   51.9% |     -0.9% |  0.530 |      +0.0pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.529 avg in first half → 0.541 avg in second half · Δ = +0.012)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.6% | [-1.0%, +11.8%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          55.2% | [51.9%, 58.3%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.539 | [0.505, 0.574]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |            104 | [37, 165]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                      1000 |
| Unique wallets ever on a FOR side            |                                                       293 |
| Avg FOR-side wallets per pick                |                                                      2.96 |
| Top-5 wallets' share of all FOR appearances  |                                                     21.4% |
| Top-10 wallets' share of all FOR appearances |                                                     36.1% |
| Top-20 wallets' share of all FOR appearances |                                                     51.6% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4b912c  | CFB,MLB,NFL,SOC,WNBA |  178 |   63 | 96-82  |   53.9% |    +11.0% |    +47.09 |     1.50× | CONFIRMED   |     -4.2% |     643 | 2026-09-11 |
|    2 | 0cd77e  | MLB,SOC,UFC,WNBA |  156 |   25 | 86-70  |   55.1% |    +14.0% |    +61.24 |     1.58× | CONFIRMED   |     -2.9% |     382 | 2026-09-11 |
|    3 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  103 |   65 | 66-37  |   64.1% |    +17.3% |    +59.67 |     1.54× | CONFIRMED   |     +7.9% |     350 | 2026-09-11 |
|    4 | cd2f63  | CFB,MLB,NBA,NFL,SOC,WNBA |  101 |   54 | 55-46  |   54.5% |    +12.9% |    +37.13 |     1.17× | CONFIRMED   |     +5.7% |     609 | 2026-09-11 |
|    5 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   96 |   70 | 46-50  |   47.9% |     -1.7% |     -4.63 |     1.21× | CONFIRMED   |     +0.2% |     498 | 2026-09-10 |
|    6 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    7 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     336 | 2026-08-05 |
|    8 | 0f9d74  | CFB,MLB,NBA,NFL,SOC,UFC |   90 |   64 | 49-41  |   54.4% |    +11.2% |    +25.24 |     0.49× | CONFIRMED   |     +9.9% |     412 | 2026-09-11 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   84 |   32 | 44-40  |   52.4% |     -6.7% |    -15.05 |     1.99× | CONFIRMED   |     -9.6% |     301 | 2026-09-07 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   59 |   16 | 36-23  |   61.0% |    +28.8% |    +42.47 |     0.93× | CONFIRMED   |    +10.7% |     238 | 2026-09-06 |
|   12 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   57 |   68 | 26-31  |   45.6% |     -9.2% |    -14.76 |     3.73× | CONFIRMED   |     -4.5% |     334 | 2026-09-11 |
|   13 | 705ba1  | MLB        |   55 |   38 | 27-28  |   49.1% |     -0.1% |     -0.13 |     1.13× | CONFIRMED   |     +5.8% |     283 | 2026-09-11 |
|   14 | 3bdd7e  | CFB,MLB,NFL,SOC,WNBA |   50 |   21 | 31-19  |   62.0% |    +17.0% |    +17.13 |     2.74× | CONFIRMED   |    -10.0% |     208 | 2026-09-09 |
|   15 | bc35e3  | MLB,NFL,SOC,UFC,WNBA |   49 |   26 | 23-26  |   46.9% |     +0.2% |     +0.29 |     1.15× | CONFIRMED   |     -4.4% |     215 | 2026-09-11 |
|   16 | 621848  | MLB,SOC,UFC,WNBA |   43 |   12 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +7.4% |     117 | 2026-09-03 |
|   17 | 69f882  | MLB,SOC,UFC,WNBA |   40 |   25 | 29-11  |   72.5% |    +23.5% |    +26.94 |     2.98× | CONFIRMED   |    +11.3% |     161 | 2026-09-11 |
|   18 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 |   23 | 20-17  |   54.1% |     -1.6% |     -1.88 |     1.36× | CONFIRMED   |    +11.8% |     148 | 2026-09-02 |
|   19 | 9214c2  | MLB        |   36 |    2 | 16-20  |   44.4% |     -0.8% |     -0.72 |     1.04× | CONFIRMED   |     +5.5% |     116 | 2026-09-11 |
|   20 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    2 | d66e28  | MLB,WNBA   |   17 | 13-4   |   76.5% |     +57.1% |    +24.73 |     0.75× | 2026-09-07 |
|    3 | 62941a  | MLB,NFL    |   13 | 9-4    |   69.2% |     +47.1% |    +16.67 |     0.80× | 2026-09-10 |
|    4 | ba8492  | MLB        |   10 | 7-3    |   70.0% |     +44.3% |    +12.80 |     1.86× | 2026-09-08 |
|    5 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    6 | 4c8ed9  | MLB,SOC,UFC,WNBA |   19 | 12-7   |   63.2% |     +43.5% |    +14.08 |     2.86× | 2026-09-08 |
|    7 | 718cd6  | MLB,NFL,SOC,UFC |   10 | 7-3    |   70.0% |     +40.0% |     +9.61 |     1.29× | 2026-09-09 |
|    8 | aa894c  | MLB        |   17 | 11-6   |   64.7% |     +38.3% |    +15.47 |     0.81× | 2026-09-10 |
|    9 | e8e2cc  | MLB,NFL,WNBA |   18 | 13-5   |   72.2% |     +36.1% |    +19.42 |     1.13× | 2026-09-11 |
|   10 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|   11 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|   12 | 579e12  | MLB        |   15 | 9-6    |   60.0% |     +31.2% |    +13.09 |     0.70× | 2026-09-11 |
|   13 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   14 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   15 | 7923c4  | MLB,NBA,UFC |   59 | 36-23  |   61.0% |     +28.8% |    +42.47 |     0.93× | 2026-09-06 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    2 | 2a8409  | MLB,NFL,WNBA |   20 | 6-14   |   30.0% |     -37.3% |    -14.91 |     1.66× | 2026-09-11 |
|    3 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    4 | 120215  | MLB,SOC    |   10 | 5-5    |   50.0% |     -21.1% |     -6.13 |     1.47× | 2026-09-11 |
|    5 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    6 | c9bba3  | CFB,MLB,NFL,SOC |   19 | 11-8   |   57.9% |     -13.2% |     -5.39 |     1.20× | 2026-09-11 |
|    7 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    8 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   57 | 26-31  |   45.6% |      -9.2% |    -14.76 |     3.73× | 2026-09-11 |
|    9 | ac9705  | MLB,WNBA   |   22 | 10-12  |   45.5% |      -7.6% |     -6.00 |     2.16× | 2026-09-03 |
|   10 | 2f2a9e  | MLB,SOC,WNBA |   84 | 44-40  |   52.4% |      -6.7% |    -15.05 |     1.99× | 2026-09-07 |
|   11 | ad88a3  | MLB,NFL,SOC |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-09-10 |
|   12 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   96 | 46-50  |   47.9% |      -1.7% |     -4.63 |     1.21× | 2026-09-10 |
|   13 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 | 20-17  |   54.1% |      -1.6% |     -1.88 |     1.36× | 2026-09-02 |
|   14 | 9214c2  | MLB        |   36 | 16-20  |   44.4% |      -0.8% |     -0.72 |     1.04× | 2026-09-11 |
|   15 | 705ba1  | MLB        |   55 | 27-28  |   49.1% |      -0.1% |     -0.13 |     1.13× | 2026-09-11 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `7da3d5` (FOR# 57, ROI -9.2%), `2f2a9e` (FOR# 84, ROI -6.7%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  2431 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   668 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    13 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |   127 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     9 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   378 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            329 |        86 |   31 |   21 |  191 |                    138 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            304 |        81 |   45 |   20 |  158 |                    146 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |  104 |   1000 | 1685 | 552-448 |  55.2% |      5.6% |    +152.89 |    +0.15 | 0.514 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  940 |    +1.9pp |    +14.5pp |          +0.326 |   -0.035 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  938 |    +6.8pp |    +24.3pp |          +0.466 |   +0.120 |    +0.0305 | 🟢 better |
| v12 − v11          | +  889 |    +0.2pp |     +2.7pp |          +0.092 |   +0.070 |    +0.0144 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | CFB            | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | —              | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | —              | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | —              | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 5n 40.0% -63%  | 814n 53.6% +5% | 10n 30.0% +29% | 17n 52.9% -8%  | 6n 83.3% +38%  | 53n 67.9% +16% | 34n 76.5% +17% | 61n 57.4% -0%  | 1000n 55.2% +6% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 193n +7%      | 264n +3%      | 218n +7%      | 132n -1%      | 188n +10%     | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2967 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1234 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 995 / 1234 (81%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 995 / 1234 (81%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 995 / 1234 (81%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 995 / 1234 (81%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 995 / 1234 (81%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 995 / 1234 (81%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 995 / 1234 (81%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1234 / 1234 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1234 / 1234 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1234 / 1234 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1234 / 1234 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1234 / 1234 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1234 / 1234 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1227 / 1234 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1225 / 1234 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1234 / 1234 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1233 / 1234 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 776 / 1234 (63%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1233 / 1234 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 776 / 1234 (63%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 775 / 1234 (63%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1234 / 1234 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1234 / 1234 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1234 / 1234 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1233 / 1234 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1234 / 1234 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 776 |      |    +0.022 |    +0.263 |      +0.048 |      +0.131 |  0.515 |
|    2 | wd sizeMargin        | 775 |      |    -0.013 |    -0.011 |      -0.040 |      -0.058 |  0.496 |
|    3 | V12 forMean          | 995 |  🟢  |    +0.076 |    +0.073 |      +0.040 |      +0.033 |  0.531 |
|    4 | wd maxForContrib     | 1233 |      |    -0.044 |    -0.099 |      -0.039 |      -0.046 |  0.488 |
|    5 | qMargin              | 995 |  🟢  |    +0.078 |    +0.023 |      +0.038 |      +0.008 |  0.525 |
|    6 | wd contribMargin     | 1234 |      |    -0.006 |    -0.084 |      -0.033 |      -0.081 |  0.484 |
|    7 | lockPinnProb         | 1227 |      |    +0.199 |    +0.171 |      +0.032 |      -0.123 |  0.605 |
|    8 | wd agAvgSize         | 776 |      |    +0.012 |    +0.009 |      +0.032 |      +0.034 |  0.503 |
|    9 | wd contribFor        | 1234 |      |    -0.013 |    -0.037 |      -0.022 |      -0.038 |  0.485 |
|   10 | clv                  | 1225 |      |    -0.018 |    +0.078 |      -0.018 |      +0.027 |  0.522 |
|   11 | agsV12               | 995 |  🟢  |    +0.033 |    -0.026 |      +0.018 |      -0.009 |  0.539 |
|   12 | wd maxShare          | 1234 |      |    +0.021 |    -0.068 |      +0.017 |      -0.019 |  0.510 |
|   13 | ags (v11)            | 1234 |      |    +0.009 |    +0.083 |      -0.014 |      -0.006 |  0.520 |
|   14 | hcMargin             | 1234 |      |    +0.013 |    +0.232 |      -0.013 |      +0.067 |  0.514 |
|   15 | V12 agMean           | 995 |  🟢  |    +0.001 |    +0.325 |      +0.011 |      +0.121 |  0.465 |
|   16 | wd contribAg         | 1234 |      |    -0.011 |    +0.126 |      +0.010 |      +0.059 |  0.488 |
|   17 | wd forAvgSize        | 1233 |      |    +0.009 |    +0.061 |      -0.010 |      +0.002 |  0.516 |
|   18 | V12 agCount          | 995 |  🟢  |    -0.020 |    +0.174 |      +0.009 |      +0.102 |  0.495 |
|   19 | V12 forCount         | 995 |  🟢  |    +0.030 |    +0.226 |      +0.009 |      +0.066 |  0.512 |
|   20 | provenMargin         | 1234 |      |    +0.010 |    +0.119 |      -0.008 |      +0.017 |  0.503 |
|   21 | peakStars            | 1234 |      |    +0.028 |    +0.056 |      +0.007 |      -0.009 |  0.512 |
|   22 | provenFor            | 1234 |      |    +0.001 |    +0.113 |      -0.005 |      +0.019 |  0.498 |
|   23 | provenAg             | 1234 |      |    -0.011 |    +0.168 |      +0.004 |      +0.073 |  0.486 |
|   24 | countMargin          | 995 |      |    +0.044 |    +0.148 |      +0.003 |      +0.007 |  0.511 |
|   25 | wd forCount          | 1233 |      |    +0.013 |    +0.160 |      -0.002 |      +0.026 |  0.496 |
|   26 | provenTotal          | 1234 |      |    -0.005 |    +0.067 |      -0.001 |      +0.018 |  0.493 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.048), `wd sizeMargin` (r = -0.040), `V12 forMean` (r = +0.040).

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.048 · AUC = 0.515

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 360 | 192-168 |   53.3% |     -0.7% |
| MID (p33–p67)     | 2.000 … 2.000            | 186 | 96-90   |   51.6% |     -1.6% |
| HIGH (> p67)      | 3.000 … 5.000            | 230 | 131-99  |   57.0% |     +2.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd sizeMargin` · r(unit-ret) = -0.040 · AUC = 0.496

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.896          | 259 | 144-115 |   55.6% |     +1.8% |
| MID (p33–p67)     | 0.078 … 0.268            | 258 | 134-124 |   51.9% |     +0.0% |
| HIGH (> p67)      | 3.728 … 5.267            | 258 | 141-117 |   54.7% |     -1.4% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.040 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 4.825            | 332 | 178-154 |   53.6% |     +0.4% |
| MID (p33–p67)     | 19.950 … 18.396          | 331 | 182-149 |   55.0% |     +0.6% |
| HIGH (> p67)      | 48.906 … 48.927          | 332 | 189-143 |   56.9% |     +1.0% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd maxForContrib` · r(unit-ret) = -0.039 · AUC = 0.488

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 31.900          | 411 | 230-181 |   56.0% |     +1.5% |
| MID (p33–p67)     | 52.400 … 46.600          | 412 | 225-187 |   54.6% |     +0.2% |
| HIGH (> p67)      | 100.000 … 80.000         | 410 | 221-189 |   53.9% |     -0.2% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `qMargin` · r(unit-ret) = +0.038 · AUC = 0.525

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 4.825            | 332 | 182-150 |   54.8% |     +1.1% |
| MID (p33–p67)     | 19.950 … 18.396          | 331 | 177-154 |   53.5% |     +0.1% |
| HIGH (> p67)      | 46.556 … 32.169          | 332 | 190-142 |   57.2% |     +0.9% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | wd sizeMargin  | V12 forMean    | wd maxForContrib | qMargin        | wd contribMargin | lockPinnProb   | wd agAvgSize   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         +0.031 |         +0.134 |         +0.283 |         +0.003 |         -0.134 |         -0.064 |         +0.095 |
| wd sizeMargin |         +0.031 |  1.000         |         +0.217 |         +0.263 |         +0.201 |         +0.270 |         +0.151 |         -0.753 |
| V12 forMean |         +0.134 |         +0.217 |  1.000         |         +0.183 |         +0.947 |         +0.081 |         +0.107 |         -0.033 |
| wd maxForContrib |         +0.283 |         +0.263 |         +0.183 |  1.000         |         +0.140 |         +0.508 |         +0.044 |         +0.051 |
| qMargin     |         +0.003 |         +0.201 |         +0.947 |         +0.140 |  1.000         |         +0.065 |         +0.113 |         -0.049 |
| wd contribMargin |         -0.134 |         +0.270 |         +0.081 |         +0.508 |         +0.065 |  1.000         |         +0.192 |         -0.148 |
| lockPinnProb |         -0.064 |         +0.151 |         +0.107 |         +0.044 |         +0.113 |         +0.192 |  1.000         |         -0.088 |
| wd agAvgSize |         +0.095 |         -0.753 |         -0.033 |         +0.051 |         -0.049 |         -0.148 |         -0.088 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.947. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 655 picks · features = 8 (+ intercept) · multiple R² = **0.0090** · adjusted R² = **-0.0049** · residual sd = 0.953

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd agCount           |     |    +0.0522 |   0.0451 | +1.16        |        1 |
|    2 | qMargin              |  🟢 |    +0.0446 |   0.1279 | +0.35        |        2 |
|    3 | wd sizeMargin        |     |    -0.0278 |   0.0662 | -0.42        |        3 |
|    4 | wd agAvgSize         |     |    +0.0233 |   0.0632 | +0.37        |        4 |
|    5 | wd contribMargin     |     |    -0.0206 |   0.0479 | -0.43        |        5 |
|    6 | lockPinnProb         |     |    +0.0159 |   0.0385 | +0.41        |        6 |
|    7 | wd maxForContrib     |     |    -0.0100 |   0.0518 | -0.19        |        7 |
|    8 | V12 forMean          |  🟢 |    +0.0060 |   0.1298 | +0.05        |        8 |
| —    | (intercept)          |     |    +0.0180 |   0.0373 |    +0.48 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.045), `V12 forMean` (β = +0.006)
- V12 IGNORES: `wd agCount` (β = +0.052, t = +1.16), `wd sizeMargin` (β = -0.028, t = -0.42), `wd agAvgSize` (β = +0.023, t = +0.37), `wd contribMargin` (β = -0.021, t = -0.43), `lockPinnProb` (β = +0.016, t = +0.41), `wd maxForContrib` (β = -0.010, t = -0.19)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.539 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.562 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.023.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Inputs V12 currently uses but that show weak multivariate signal: `V12 forMean`. They may be contributing noise rather than information.
- Adjusted R² of -0.0049 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*