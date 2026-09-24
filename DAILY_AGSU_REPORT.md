# AGS-Unified — V12 Daily Monitor

**Generated:** Thursday, September 24, 2026 at 1:29 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (116 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (116 days ago), V12 has evaluated **4442** picks, shipped **1123** for real money (25.3% ship rate), and muted the other **3319**. On the shipped picks V12 has gone **615-508** (54.8% win), staked **3135.45u**, and returned **+158.38u** at **+5.1% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                            116 |
| Picks V12 has evaluated             |                           4442 |
| Picks SHIPPED (units > 0)           |                           1123 |
| Picks MUTED (score ≤ 0, FADE)       |                           3319 |
| Ship rate                           |                          25.3% |
| Live W-L                            |                        615-508 |
| Live Win %                          |                          54.8% |
| Live PnL (units)                    |                        +158.38 |
| Live ROI                            |                          +5.1% |
| Avg PnL / day                       |                         +1.37u |
| Most recent action (2026-09-27)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **5.1% ROI** across 1123 live picks (+158.38u real PnL).
- Mute rule is **saving money** — the 2279 muted picks would have lost -105.69u at flat 1u (-4.6% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.37u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **379-315** · +5.7% ROI · +111.77u on 694 graded — see § 5.

### What to watch

- 🟡 Weakest sport: **CFB** — 17 live, 8-9, -14.1% ROI, -7.11u.

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

**Full book:** 116d · 1123 live · 615-508 · **+158.38u** · +5.1% ROI · +1.37u/day.

_Prior to table (2026-06-01 → 2026-09-04): 948 live · 525-423 · +154.33u · cum through prior = +154.33u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-09-05 |       109 |    9 |    80 | 6-3        |  66.7% |     23.90 |      +7.72 |     32.3% |    +162.05 |
| 2026-09-06 |        54 |    7 |    37 | 5-2        |  71.4% |     20.50 |      +7.23 |     35.3% |    +169.28 |
| 2026-09-07 |        48 |    7 |    28 | 5-2        |  71.4% |     21.00 |      +7.22 |     34.4% |    +176.50 |
| 2026-09-08 |        46 |    9 |    25 | 4-5        |  44.4% |     26.00 |      -1.59 |     -6.1% |    +174.91 |
| 2026-09-09 |        52 |    5 |    33 | 2-3        |  40.0% |     13.00 |      -2.44 |    -18.8% |    +172.47 |
| 2026-09-10 |        19 |    5 |     8 | 0-5        |   0.0% |     13.50 |     -13.50 |   -100.0% |    +158.97 |
| 2026-09-11 |        58 |   10 |    32 | 5-5        |  50.0% |     37.00 |      -6.08 |    -16.4% |    +152.89 |
| 2026-09-12 |       155 |   18 |   113 | 12-6       |  66.7% |     55.90 |     +25.91 |     46.4% |    +178.80 |
| 2026-09-13 |        85 |   16 |    50 | 9-7        |  56.3% |     55.90 |      +7.01 |     12.5% |    +185.81 |
| 2026-09-14 |        41 |    7 |    23 | 4-3        |  57.1% |     23.75 |      +0.91 |      3.8% |    +186.72 |
| 2026-09-15 |        53 |   11 |    29 | 4-7        |  36.4% |     34.50 |     -11.29 |    -32.7% |    +175.43 |
| 2026-09-16 |        56 |   16 |    24 | 4-12       |  25.0% |     54.90 |     -29.91 |    -54.5% |    +145.52 |
| 2026-09-17 |        46 |    5 |    24 | 1-4        |  20.0% |     14.00 |      -8.27 |    -59.1% |    +137.25 |
| 2026-09-18 |        67 |    3 |    46 | 2-1        |  66.7% |      8.50 |      +3.32 |     39.1% |    +140.57 |
| 2026-09-19 |       189 |   14 |   127 | 8-6        |  57.1% |     42.40 |      +4.55 |     10.7% |    +145.12 |
| 2026-09-20 |       114 |   16 |    70 | 9-7        |  56.3% |     49.50 |      +7.86 |     15.9% |    +152.98 |
| 2026-09-21 |        19 |    4 |     9 | 4-0        | 100.0% |     11.00 |      +8.76 |     79.6% |    +161.74 |
| 2026-09-22 |        66 |    4 |    45 | 2-2        |  50.0% |     11.50 |      -1.55 |    -13.5% |    +160.19 |
| 2026-09-23 |        66 |    9 |    35 | 4-5        |  44.4% |     24.50 |      -1.81 |     -7.4% |    +158.38 |
| 2026-09-24 |        47 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +158.38 |
| 2026-09-27 |         2 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +158.38 |

> **Trajectory.** 🟡 Last 3 days (-7.4% ROI) **-12.5pp** vs prior (5.1%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-09-23**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 24 | 17-7 | +40.0% | +39.61u | +1.65u | -2.4% |
| 🟢 2 | MINI- (gate-cut) | C | 23 | 14-9 | +24.8% | +9.41u | +0.41u | +55.2% |
| 🟢 3 | RANK 2-for-0 rescue | B | 115 | 67-48 | +12.3% | +51.11u | +0.44u | -62.4% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 137 | 84-53 | +9.8% | +62.47u | sized UP after path |
| 2 | Tape HOLD (mid) | 489 | 265-224 | +6.4% | +75.84u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 31 | 14-17 | -31.1% | -20.68u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 81 | 36-45 | -5.5% | -4.49u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 240 | 126-114 | -1.6% | -3.83u | 🟡 flat |
| 3 | Score FADE (≤0 → 0u) | 1146 | 581-565 | +0.3% | +3.78u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 24 | 17-7 | 70.8% | 99.0u | +39.61u | +40.0% | +1.65u | 2 | -2.4% | -2.50u | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 107 | 64-43 | 59.8% | 393.7u | +20.17u | +5.1% | +0.19u | 1 | +44.8% | — | 🟢 OK |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 115 | 67-48 | 58.3% | 415.0u | +51.11u | +12.3% | +0.44u | 4 | -62.4% | +2.26u | 🔻 cooling |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 94 | 44-50 | 46.8% | 326.8u | -24.88u | -7.6% | -0.26u | 3 | -100.0% | — | 🔻 cooling |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 116 | 59-57 | 50.9% | 324.3u | -5.84u | -1.8% | -0.05u | 3 | -51.9% | -2.00u | 🔻 cooling |
| MINI (gate-pass) | `MINI` | A | 3u | 111 | 63-48 | 56.8% | 299.5u | +17.23u | +5.8% | +0.16u | 4 | -34.0% | — | 🔻 cooling |
| MINI- (gate-cut) | `MINI-` | C | 1u | 23 | 14-9 | 60.9% | 37.9u | +9.41u | +24.8% | +0.41u | 3 | +55.2% | — | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 24 | 13-11 | 54.2% | 25.4u | +3.05u | +12.0% | +0.13u | 0 | — | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 137 | 84-53 | 61.3% | 635.4u | +62.47u | +9.8% | 5 | -30.9% | -2.50u |
| Tape HOLD (mid) | TAPE | staked | 489 | 265-224 | 54.2% | 1186.8u | +75.84u | +6.4% | 60 | -1.5% | +0.69u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 31 | 14-17 | 45.2% | 66.5u | -20.68u | -31.1% | 1 | +44.5% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 240 | 126-114 | 52.5% | 240.0u | -3.83u | -1.6% | 43 | -21.7% | -2.15u |
| fadeTop≥60 MUTE | E | CF 1u | 81 | 36-45 | 44.4% | 81.0u | -4.49u | -5.5% | 21 | +0.1% | -0.51u |
| Score FADE (≤0 → 0u) | score | CF 1u | 1146 | 581-565 | 50.7% | 1146.0u | +3.78u | +0.3% | 169 | +2.7% | +1.38u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 8 / +52% | 3 / -21% | — |
| TOP | 39 / -1% | 24 / +4% | 4 / -16% |
| RANK | 66 / +8% | 10 / +27% | — |
| SHARP | 22 / -25% | 46 / -1% | 1 / -100% |
| SHARP-LEAN | 86 / -2% | 26 / +2% | 4 / -63% |
| MINI | 57 / -1% | 12 / +51% | 5 / -25% |
| MINI- | 8 / +10% | 2 / +52% | 3 / -5% |
| DISSENT | 15 / +22% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-09-23)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| RANK 2-for-0 rescue | 1 | 1-0 | +2.26u | +75.3% |
| SHARP-LEAN EDGE/net ONE | 1 | 0-1 | -2.00u | -100.0% |
| HC-2 SUPER | 1 | 0-1 | -2.50u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  39 | 17-7   |  70.8% |       99.00 |     +39.61 |     40.0% |
| TOP PICK (TOP+/TOP)       |  4-5u | 248 | 79-57  |  58.1% |      526.20 |      +8.23 |      1.6% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 931 | 176-163 |  51.9% |     1115.05 |     +13.78 |      1.2% |
| STRONG (MINI)             |    3u | 200 | 63-48  |  56.8% |      299.45 |     +17.23 |      5.8% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 173 | 29-23  |  55.8% |       68.25 |     +10.44 |     15.3% |
| **STAKED TOTAL** |     — | 662 | 364-298 |  55.0% |     2107.95 |     +89.29 |     +4.2% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  39 | 17-7   |  70.8% |       99.00 |     +39.61 |     40.0% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 219 | 64-43  |  59.8% |      393.70 |     +20.17 |      5.1% |
| B · 2-for-0 rescue    | RANK        |    4u | 215 | 67-48  |  58.3% |      414.95 |     +51.11 |     12.3% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 531 | 59-57  |  50.9% |      324.34 |      -5.84 |     -1.8% |
| C · proven-$ consensus | SHARP       |    3u | 171 | 44-50  |  46.8% |      326.76 |     -24.88 |     -7.6% |
| A · mini-HC (gate-pass) | MINI        |    3u | 200 | 63-48  |  56.8% |      299.45 |     +17.23 |      5.8% |
| C · mini gate-cut     | MINI-       |    1u |  47 | 14-9   |  60.9% |       37.90 |      +9.41 |     24.8% |
| A · margin 3+         | CONFIRMED   |    1u |  16 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u | 110 | 13-11  |  54.2% |       25.35 |      +3.05 |     12.0% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 756 picks tracked at 0u (would-be 361-395, 47.8% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (27-12, +39.61u)  ·  🟢 TOP PICK (133-115, +8.23u)  ·  🟠 SHARP PLAY (462-469, +13.78u)  ·  🔴 STRONG (109-91, +17.23u)  ·  🟣 LEAN (94-79, +10.44u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23"]
    y-axis "PnL (u)" -14 --> 50
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54, 44.81, 44.81, 44.81, 44.81, 44.81, 41.81, 41.81, 39.81, 39.81, 39.81, 39.81, 39.81, 39.81, 42.11, 42.11, 42.11, 42.11, 42.11, 42.11, 42.11, 39.61]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 8.23, 8.23, 8.23, 8.23]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85, 38.85, 38.79, 38.82, 41.18, 43.74, 44.86, 43.97, 43.97, 42.76, 37.04, 38.07, 38.07, 38.07, 21.67, 21.67, 21.67, 15.67, 15.67, 17.52, 13.52, 13.78]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37, 18.31, 18.31, 18.31, 18.31, 18.31, 21.88, 21.88, 11.88, 7.88, 14.28, 22.4, 22.4, 21.31, 21.31, 21.31, 21.31, 22.23, 17.23, 17.23, 17.23, 17.23]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 10.44, 10.44, 10.44, 10.44, 10.44]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71, 72, 71, 72, 72, 72, 70, 70, 68, 66, 66, 66, 66, 66, 67, 69, 69, 70, 70, 70, 71, 69]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 54, 54, 54, 54, 53, 54, 54, 54, 54]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50, 50, 50, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 49, 49, 49, 49, 50, 50, 50, 50, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57, 57, 57, 56, 55, 55, 56, 55, 54, 54, 55, 56, 56, 56, 56, 56, 56, 56, 55, 55, 54, 55]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 56, 57, 57, 57, 57, 57, 57, 58, 57, 58, 58, 58, 57, 57, 58, 56, 56, 55, 54]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 3130 | 3119 | 3052 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 240 | 126-114 | 52.5% | 54.50u | -7.74u | -14.2% |
| HOLD      | 1047 | 542-505 | 51.8% | 1189.82u | +72.84u | +6.1% |
| BOOST     | 305 | 167-138 | 54.8% | 638.88u | +64.55u | +10.1% |
| FAIL_OPEN | 78 | 40-38 | 51.3% | 68.50u | -19.79u | -28.9% |
| PASS      | 1382 | 693-689 | 50.1% | 13.50u | -1.52u | -11.3% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 1133 | 594-539 | 52.4% | +22.84u |
| hold (0–2.89) | path u | 1256 | 625-631 | 49.8% | +43.64u |
| boost (≥2.89) | ×1.35 | 373 | 199-174 | 53.4% | +62.50u |

_Score coverage: **2762/3052** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 240 | +6.44u | -6.44u | +149.75u | +156.19u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 139 | +44.25u | +64.55u | +20.30u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-09-24 | MLB | Kansas City Royals | PATH-D | -1.36 | MUTE | 1.00u | 0.00u | — |
| 2026-09-24 | MLB | New York Mets | SHARP | 7.04 | BOOST | 2.50u | 0.00u | — |
| 2026-09-24 | MLB | San Diego Padres | SHARP~ | 3.33 | BOOST | 1.00u | 0.00u | — |
| 2026-09-24 | WNBA | Las Vegas Aces | SHARP~ | 5.64 | BOOST | 4.00u | 0.00u | — |
| 2026-09-24 | MLB | Chicago White Sox | MINI | 4.07 | BOOST | 2.50u | 0.00u | — |
| 2026-09-24 | CFB | Over 49.5 | MINI- | 3.70 | BOOST | 4.00u | 0.00u | — |
| 2026-09-24 | MLB | Under 7.5 | CONFIRMED-Q1 | 3.10 | BOOST | 1.00u | 0.00u | — |
| 2026-09-24 | MLB | Over 7.5 | CONFIRMED-UNOPP | -0.62 | MUTE | 1.00u | 0.00u | — |
| 2026-09-24 | MLB | Over 8.5 | CONFIRMED-UNOPP | 5.33 | BOOST | 1.00u | 0.00u | — |
| 2026-09-24 | MLB | Over 7.5 | SHARP~ | 3.46 | BOOST | 1.00u | 0.00u | — |
| 2026-09-23 | MLB | Cleveland Guardians | PATH-D | -1.31 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-23 | MLB | Chicago Cubs | SHARP~ | -0.34 | MUTE | 2.00u | 0.00u | LOSS |
| 2026-09-23 | MLB | New York Mets | MINI- | 6.35 | BOOST | 2.00u | 0.00u | WIN |
| 2026-09-23 | MLB | Los Angeles Dodgers | CONFIRMED-UNOPP | -1.20 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-23 | MLB | St. Louis Cardinals | MINI | 8.22 | BOOST | 1.00u | 0.00u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.72** · nPriors=640 · source=expanding_q1 · asOf=2026-09-24 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 2684 | 2569 | 2509 | 526 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 208 | 94-114 | 45.2% | 13.00u | -5.29u | -40.7% |
| HOLD      | 535 | 279-256 | 52.1% | 354.50u | +1.09u | +0.3% |
| FAIL_OPEN | 63 | 26-37 | 41.3% | 44.90u | -5.08u | -11.3% |
| EXEMPT    | 1109 | 595-514 | 53.7% | 1026.65u | +93.34u | +9.1% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -249.7 … -3.8 | 98 | 37-61 | 37.8% | 0.0u | +0.00u | — |
| Q2 | -3.5 … 1.1 | 98 | 47-51 | 48.0% | 37.9u | +15.57u | +41.1% |
| Q3 | 1.1 … 6.2 | 99 | 53-46 | 53.5% | 62.5u | -3.28u | -5.2% |
| Q4 | 6.3 … 19.3 | 98 | 51-47 | 52.0% | 102.0u | -23.35u | -22.9% |
| Q5 | 19.5 … 1802.6 | 99 | 54-45 | 54.5% | 112.1u | +9.65u | +8.6% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 208 | 94-114 | -16.69u | +16.69u | +141.40u | +124.71u |

> 🟢 **Mute is saving money** (Δ +16.69u · muted WR 45.2%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 92 | 36-56 | 39.1% | 113.4u | -21.22u |
| CFB | 21 | 9-12 | 42.9% | 34.4u | +3.64u |
| MLB | 128 | 61-67 | 47.7% | 147.5u | -4.01u |
| NFL | 23 | 8-15 | 34.8% | 30.9u | -14.24u |
| SOC | 9 | 4-5 | 44.4% | 12.5u | +2.90u |
| WNBA | 27 | 12-15 | 44.4% | 29.0u | -4.98u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-09-24 | MLB | Atlanta Braves | SHARP~ | -80.5 | -0.7 | 1.00u | pending |
| 2026-09-24 | MLB | Boston Red Sox | SHARP~ | -4.6 | -0.7 | 1.00u | pending |
| 2026-09-24 | MLB | San Diego Padres | SHARP~ | -3.5 | -0.7 | 1.00u | pending |
| 2026-09-24 | MLB | Tampa Bay Rays | SHARP~ | -4.7 | -0.7 | 1.00u | pending |
| 2026-09-24 | MLB | Pittsburgh Pirates | CONFIRMED-UNOPP | -1.7 | -0.7 | 1.00u | pending |
| 2026-09-24 | NFL | Packers | — | -25.5 | -0.7 | 2.00u | pending |
| 2026-09-24 | MLB | Over 7.5 | CONFIRMED-UNOPP | -1.6 | -0.7 | 1.00u | pending |
| 2026-09-24 | MLB | Over 8.5 | CONFIRMED-UNOPP | -1.7 | -0.7 | 1.00u | pending |
| 2026-09-23 | MLB | Colorado Rockies | SHARP~ | -8.6 | -0.8 | 1.00u | LOSS |
| 2026-09-23 | MLB | Kansas City Royals | SHARP~ | -3.2 | -0.8 | 1.00u | WIN |
| 2026-09-23 | MLB | Seattle Mariners | — | -21.3 | -0.8 | 1.00u | WIN |
| 2026-09-23 | MLB | Miami Marlins | — | -65.6 | -0.8 | 1.00u | WIN |
| 2026-09-23 | MLB | Toronto Blue Jays | SHARP~ | -16.8 | -0.8 | 1.00u | LOSS |
| 2026-09-23 | WNBA | Seattle Storm | SHARP | -105.6 | -0.8 | 1.00u | LOSS |
| 2026-09-23 | MLB | Los Angeles Dodgers | — | -8.5 | -0.8 | 1.00u | LOSS |
| 2026-09-23 | MLB | Over 9.5 | CONFIRMED-UNOPP | -13.7 | -0.8 | 1.00u | WIN |
| 2026-09-22 | MLB | Cleveland Guardians | — | -96.6 | -0.8 | 1.00u | WIN |
| 2026-09-22 | MLB | Houston Astros | CONFIRMED-UNOPP | -8.0 | -0.8 | 1.00u | WIN |
| 2026-09-22 | MLB | Tampa Bay Rays | CONFIRMED-UNOPP | -1.0 | -0.8 | 1.00u | LOSS |
| 2026-09-22 | WNBA | Golden State Valkyries | CONFIRMED-UNOPP | -7.0 | -0.8 | 1.00u | LOSS |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 100 | 50-50 | 50.0% | 314.5u | -1.41u | -0.4% |
| Muted (Q1 → 0u) | 208 | 94-114 | 45.2% | 13.0u | -5.29u | -40.7% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 168–97 · 63.4% · +14.7%); **5–10 is the hole** (105–96 · 52.2% · +1.2%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 905 tickets · cov 876/905 (stamp 674 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 410 | 210–200 | 51.2% | -2.5% |
| 5–10 | 201 | 105–96 | 52.2% | +1.2% |
| ≥10 | 265 | 168–97 | 63.4% | +14.7% |
| All | 905 | 497–408 | 54.9% | +5.2% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (111) | 56.6% (76) | 68.9% (103) |
| B | 54.4% (79) | 61.5% (13) | 69.6% (23) |
| C | 37.5% (40) | 43.5% (62) | 55.7% (115) |

##### Jul 15+ · 694 tickets · cov 671/694 (stamp 669 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 304 | 157–147 | 51.6% | +0.4% |
| 5–10 | 162 | 82–80 | 50.6% | +0.5% |
| ≥10 | 205 | 129–76 | 62.9% | +12.5% |
| All | 694 | 379–315 | 54.6% | +5.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.1% (52) | 55.3% (47) | 69.4% (62) |
| B | 54.7% (53) | 50% (8) | 68.8% (16) |
| C | 36.8% (19) | 43.9% (57) | 56.2% (105) |

##### Yesterday (Sep 23) · 9 tickets · cov 9/9 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 7 | 4–3 | 57.1% | +13.4% |
| 5–10 | 1 | 0–1 | 0.0% | -100.0% |
| ≥10 | 1 | 0–1 | 0.0% | -100.0% |
| All | 9 | 4–5 | 44.4% | -7.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | — | 0% (1) |
| B | 100% (1) | — | — |
| C | — | 0% (1) | — |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 905 tickets · cov 896/905 (stamp 685 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 603 | 337–266 | 55.9% | +6.0% |
| 5–10 | 153 | 78–75 | 51.0% | +2.5% |
| ≥10 | 140 | 79–61 | 56.4% | +6.7% |
| All | 905 | 497–408 | 54.9% | +5.2% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 58% (188) | 49.1% (53) | 71.4% (56) |
| B | 60.2% (88) | 50% (14) | 53.8% (13) |
| C | 49.6% (123) | 54.9% (51) | 40.8% (49) |

##### Jul 15+ · 694 tickets · cov 686/694 (stamp 685 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 453 | 259–194 | 57.2% | +10.1% |
| 5–10 | 130 | 65–65 | 50.0% | +1.4% |
| ≥10 | 103 | 52–51 | 50.5% | -3.3% |
| All | 694 | 379–315 | 54.6% | +5.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 62.8% (94) | 45.9% (37) | 62.9% (35) |
| B | 58.3% (60) | 50% (10) | 57.1% (7) |
| C | 53.1% (96) | 54.2% (48) | 37.5% (40) |

##### Yesterday (Sep 23) · 9 tickets · cov 9/9 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 6 | 2–4 | 33.3% | -32.5% |
| 5–10 | 1 | 0–1 | 0.0% | -100.0% |
| ≥10 | 2 | 2–0 | 100.0% | +110.0% |
| All | 9 | 4–5 | 44.4% | -7.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | 0% (1) | — |
| B | 100% (1) | — | — |
| C | 0% (1) | — | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 905 tickets · cov 874/905 (stamp 666 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 196 | 100–96 | 51.0% | -8.2% |
| 0–2.89 | 491 | 263–228 | 53.6% | +6.6% |
| ≥2.89 | 187 | 120–67 | 64.2% | +14.1% |
| All | 905 | 497–408 | 54.9% | +5.2% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 57.3% (171) | 74.7% (75) |
| B | 61.1% (36) | 54.8% (62) | 64.7% (17) |
| C | 18.2% (11) | 48.8% (127) | 53.8% (78) |

##### Jul 15+ · 694 tickets · cov 669/694 (stamp 666 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 127 | 72–55 | 56.7% | +8.1% |
| 0–2.89 | 400 | 209–191 | 52.3% | +4.2% |
| ≥2.89 | 142 | 87–55 | 61.3% | +9.8% |
| All | 694 | 379–315 | 54.6% | +5.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 53.5% (114) | 73.3% (45) |
| B | 60% (20) | 55.3% (47) | 60% (10) |
| C | — | 49.1% (108) | 52.8% (72) |

##### Yesterday (Sep 23) · 9 tickets · cov 9/9 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 1 | 0–1 | 0.0% | -100.0% |
| 0–2.89 | 7 | 4–3 | 57.1% | +19.4% |
| ≥2.89 | 1 | 0–1 | 0.0% | -100.0% |
| All | 9 | 4–5 | 44.4% | -7.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | — | 0% (1) |
| B | — | 100% (1) | — |
| C | — | 0% (1) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 694 | 379-315 | 54.6% | 1959.20u | +111.77u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 694/694 | 3.12 | 2.97 | +0.15 | 2.00 | 2.00 |
| depth   | #A sharps        | 694/694 | 1.73 | 1.70 | +0.03 | 1.00 | 1.00 |
| depth   | #F − #A          | 694/694 | 1.39 | 1.27 | +0.11 | 1.00 | 1.00 |
| depth   | proven F         | 694/694 | 2.21 | 2.17 | +0.04 | 2.00 | 2.00 |
| depth   | proven A         | 694/694 | 0.88 | 0.88 | +0.00 | 0.00 | 0.00 |
| depth   | proven F−A       | 694/694 | 1.33 | 1.29 | +0.04 | 1.00 | 1.00 |
| depth   | v12 F count      | 694/694 | 3.12 | 2.95 | +0.17 | 2.00 | 2.00 |
| depth   | v12 A count      | 694/694 | 1.80 | 1.75 | +0.05 | 1.00 | 1.00 |
| depth   | WA ForN          | 694/694 | 2.44 | 2.42 | +0.02 | 2.00 | 2.00 |
| depth   | WA AgN           | 694/694 | 1.41 | 1.47 | -0.06 | 1.00 | 1.00 |
| depth   | CLV ForN         | 693/694 | 2.81 | 2.66 | +0.15 | 2.00 | 2.00 |
| depth   | CLV AgN          | 693/694 | 1.66 | 1.65 | +0.01 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 694/694 | 0.32 | 0.30 | +0.02 | 0.00 | 0.00 |
| quality | ForWR            | 669/694 | 56.63 | 55.35 | +1.28 | 54.61 | 54.41 |
| quality | AgWR             | 455/694 | 46.72 | 47.93 | -1.21 | 48.08 | 48.67 |
| quality | TopFor WR        | 669/694 | 62.11 | 60.85 | +1.26 | 58.60 | 58.20 |
| quality | TopAg WR         | 455/694 | 50.24 | 51.11 | -0.87 | 51.06 | 51.20 |
| quality | EDGE             | 669/694 | 8.75 | 6.63 | +2.12 | 6.48 | 5.09 |
| quality | ForCLV           | 685/694 | 63.54 | 63.73 | -0.20 | 63.88 | 64.22 |
| quality | AgCLV            | 482/694 | 62.15 | 61.11 | +1.04 | 63.09 | 62.40 |
| quality | netCLV           | 685/694 | 1.43 | 2.36 | -0.93 | 1.52 | 2.34 |
| quality | Tape             | 666/694 | 1.96 | 1.65 | +0.31 | 1.46 | 1.27 |
| quality | V12 score        | 694/694 | 0.77 | 0.76 | +0.01 | 0.95 | 0.92 |
| quality | V12 forMean      | 694/694 | 30.59 | 26.78 | +3.81 | 25.20 | 19.41 |
| quality | V12 agMean       | 694/694 | 4.60 | 4.33 | +0.27 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 669/694 | 0.550 | -0.015 | +0.103 | +2.12 | 🟡 mild OK |
|    2 | AgWR             | quality | 455/694 | 0.460 | +0.190 | -0.089 | -1.21 | flat |
|    3 | AgCLV            | quality | 482/694 | 0.539 | -0.031 | +0.069 | +1.04 | flat |
|    4 | V12 score        | quality | 694/694 | 0.536 | -0.077 | +0.020 | +0.01 | flat |
|    5 | V12 forMean      | quality | 694/694 | 0.532 | +0.211 | +0.069 | +3.81 | flat |
|    6 | TopFor WR        | quality | 669/694 | 0.532 | +0.209 | +0.060 | +1.26 | flat |
|    7 | netCLV           | quality | 685/694 | 0.470 | -0.140 | -0.041 | -0.93 | flat |
|    8 | V12 agMean       | quality | 694/694 | 0.471 | +0.346 | +0.016 | +0.27 | flat |
|    9 | Tape             | quality | 666/694 | 0.525 | -0.111 | +0.055 | +0.31 | flat |
|   10 | ForWR            | quality | 669/694 | 0.523 | +0.063 | +0.073 | +1.28 | flat |
|   11 | ForCLV           | quality | 685/694 | 0.479 | -0.211 | -0.010 | -0.20 | flat |
|   12 | TopAg WR         | quality | 455/694 | 0.480 | +0.162 | -0.049 | -0.87 | flat |
|   13 | proven A         | depth   | 694/694 | 0.480 | +0.328 | +0.001 | +0.00 | flat |
|   14 | CLV ForN         | depth   | 693/694 | 0.518 | +0.296 | +0.037 | +0.15 | flat |
|   15 | unopposed (A=0)  | depth   | 694/694 | 0.517 | +0.219 | +0.025 | +0.02 | flat |
|   16 | #F sharps        | depth   | 694/694 | 0.510 | +0.301 | +0.030 | +0.15 | flat |
|   17 | WA AgN           | depth   | 694/694 | 0.491 | +0.218 | -0.019 | -0.06 | flat |
|   18 | proven F−A       | depth   | 694/694 | 0.509 | +0.197 | +0.011 | +0.04 | flat |
|   19 | v12 F count      | depth   | 694/694 | 0.508 | +0.297 | +0.034 | +0.17 | flat |
|   20 | WA ForN          | depth   | 694/694 | 0.494 | +0.304 | +0.006 | +0.02 | flat |
|   21 | #F − #A          | depth   | 694/694 | 0.503 | +0.170 | +0.022 | +0.11 | flat |
|   22 | proven F         | depth   | 694/694 | 0.502 | +0.356 | +0.011 | +0.04 | flat |
|   23 | CLV AgN          | depth   | 693/694 | 0.502 | +0.200 | +0.004 | +0.01 | flat |
|   24 | #A sharps        | depth   | 694/694 | 0.499 | +0.214 | +0.008 | +0.03 | flat |
|   25 | v12 A count      | depth   | 694/694 | 0.501 | +0.207 | +0.013 | +0.05 | flat |

### (C) Working read

_N=694 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.550 · Δ +2.12 · higher on WINs (cov 669/694)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1190 | 395 | 395 | 390 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 77 | 42-35 | 54.5% | 238.85u | +15.57u | +6.5% | -0.5 |
| on→off | 14 | 6-8 | 42.9% | 41.70u | -6.40u | -15.3% | -5.0 |
| off→on | 75 | 43-32 | 57.3% | 233.10u | +25.07u | +10.8% | +1.6 |
| off→off | 224 | 122-102 | 54.5% | 593.80u | +20.66u | +3.5% | -0.5 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 239 | 127-112 | 53.1% | 713.70u | +9.44u | +1.3% |
| 0–2 | 109 | 64-45 | 58.7% | 293.35u | +60.63u | +20.7% |
| 2–4 | 23 | 14-9 | 60.9% | 63.90u | +6.63u | +10.4% |
| 4+ | 19 | 8-11 | 42.1% | 36.50u | -21.80u | -59.7% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 6 | 5-1 | 83.3% | 18.00u | +11.45u | +63.6% |
| gold, limits flat | 8 | 5-3 | 62.5% | 24.30u | +10.59u | +43.6% |
| steam, not gold | 138 | 75-63 | 54.3% | 429.65u | +18.60u | +4.3% |
| limits↑, no steam | 12 | 5-7 | 41.7% | 31.40u | -0.90u | -2.9% |
| neither | 226 | 123-103 | 54.4% | 604.10u | +15.16u | +2.5% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 141 | 81-60 | 57.4% | 449.55u | +43.48u | +9.7% |
| A/B + no steam | 213 | 116-97 | 54.5% | 543.50u | +35.52u | +6.5% |
| A/B + steam arriving | 72 | 42-30 | 58.3% | 228.10u | +27.18u | +11.9% |
| A/B + gold | 12 | 8-4 | 66.7% | 33.90u | +16.29u | +48.1% |
| steam at lock, no A/B | 11 | 4-7 | 36.4% | 22.40u | -2.84u | -12.7% |
| Source B + steam arriving | 68 | 39-29 | 57.4% | 214.70u | +23.39u | +10.9% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| CFB   | 5n · 60.0% · -5.5%     | 7n · 57.1% · +6.3%     | 5n · 20.0% · -65.3%    | 17n · 47.1% · -14.1%   |
| MLB   | 444n · 54.5% · +7.6%   | 104n · 53.8% · -1.8%   | 354n · 51.1% · +1.8%   | 902n · 53.1% · +4.1%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 15n · 53.3% · -6.4%    | 8n · 62.5% · -3.1%     | 6n · 66.7% · +32.1%    | 29n · 58.6% · +4.8%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 56n · 66.1% · +13.5%   | —                      | —                      | 56n · 66.1% · +13.5%   |
| UFC   | 39n · 74.4% · +17.3%   | —                      | —                      | 39n · 74.4% · +17.3%   |
| WNBA  | 29n · 75.9% · +9.6%    | 20n · 40.0% · -2.3%    | 15n · 46.7% · -10.3%   | 64n · 57.8% · +1.8%    |
| **All** | **595n · 57.6% · +8.7%** | **143n · 53.1% · +0.3%** | **385n · 50.9% · +1.5%** | **1123n · 54.8% · +5.1%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **2279** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 2279 |
| Muted W-L                           |            1128-1151 |
| Muted Win %                         |                49.5% |
| Counterfactual PnL at flat 1u       |              -105.69 |
| Counterfactual ROI at flat 1u       |                -4.6% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-105.69u** at a flat 1u stake — a counterfactual ROI of **-4.6%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-09-23 | MLB   | ML     | Tampa Bay Rays          |  +122 | +0.912 | HC-2     |  10/1 |  10/1 |  60.3 |   62.8 |  +15.6 |  4.57 | BOOST    | 2.50u | LOSS    |      -2.50 |
| 2026-09-23 | MLB   | ML     | Baltimore Orioles       |  -124 | +0.445 | CONFIRMED-Q1 |   5/2 |   5/2 |  50.9 |   56.6 |   -1.9 |  1.65 | HOLD     | 3.00u | WIN     |      +2.42 |
| 2026-09-23 | MLB   | ML     | Washington Nationals    |  +145 | +0.697 | CONFIRMED-Q1 |   6/3 |   6/3 |  51.6 |   62.6 |   -0.4 |  1.62 | HOLD     | 2.50u | WIN     |      +3.63 |
| 2026-09-23 | MLB   | SPREAD | Washington Nationals    |  -133 | +0.981 | 2-for-0  |   3/0 |   2/0 |  54.6 |   65.5 |   +4.6 |  1.46 | HOLD     | 3.00u | WIN     |      +2.26 |
| 2026-09-23 | MLB   | TOTAL  | Under 8.5               |  -100 | +0.965 | CONFIRMED-Q1 |   3/1 |   1/1 |  54.5 |   53.8 |   +2.3 |  0.28 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-23 | MLB   | TOTAL  | Over 7.5                |  +122 | +0.991 | CONFIRMED-Q1 |   2/0 |   1/0 |  52.5 |   62.8 |   +2.5 |  0.61 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-09-23 | MLB   | TOTAL  | Over 7.5                |  -115 | +0.352 | SHARP~   |   1/2 |   1/2 |  59.1 |   70.7 |   +6.6 |  1.26 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-23 | MLB   | TOTAL  | Over 6.5                |  -104 | +0.830 | CONFIRMED-Q1 |   3/4 |   3/4 |  53.4 |   62.5 |   +1.4 |  0.28 | HOLD     | 3.00u | WIN     |      +2.88 |
| 2026-09-23 | MLB   | TOTAL  | Over 8.5                |  -106 | +0.466 | CONFIRMED-Q1 |   3/3 |   3/3 |  56.8 |   61.9 |   -7.7 | -2.13 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-22 | MLB   | ML     | Los Angeles Angels      |  -108 | +0.956 | CONFIRMED-Q1 |   3/2 |   2/2 |  56.4 |   51.7 |   +6.8 |  0.02 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-22 | MLB   | SPREAD | Tampa Bay Rays          |  -194 | +0.238 | SHARP~   |   4/1 |   4/1 |  54.8 |   53.7 |  +12.7 |  1.30 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-22 | MLB   | TOTAL  | Under 9.5               |  +149 | +0.472 | CONFIRMED-Q1 |   4/3 |   4/3 |  54.3 |   58.3 |   -0.5 |  0.60 | HOLD     | 2.50u | WIN     |      +3.73 |
| 2026-09-22 | MLB   | TOTAL  | Under 7.5               |  -116 | +0.540 | CONFIRMED-Q1 |   4/5 |   3/3 |  56.4 |   59.4 |   +7.2 |  0.68 | HOLD     | 2.00u | WIN     |      +1.72 |
| 2026-09-21 | NFL   | ML     | Rams                    |  -295 | +0.555 | CONFIRMED-Q1 |   5/1 |   5/1 |  42.9 |   64.4 |  -13.2 | -1.91 | HOLD     | 3.00u | WIN     |      +1.02 |
| 2026-09-21 | WNBA  | ML     | Atlanta Dream           |  -107 | +0.985 | CONFIRMED-Q1 |   8/2 |   4/0 |  52.2 |   60.3 |   +6.0 |  2.01 | HOLD     | 3.00u | WIN     |      +2.80 |
| 2026-09-21 | NFL   | SPREAD | Rams                    |  -108 | +0.293 | SHARP~   |  12/3 |  12/3 |  52.9 |   62.1 |   +9.8 |  1.88 | HOLD     | 2.00u | WIN     |      +1.85 |
| 2026-09-21 | MLB   | TOTAL  | Under 7.5               |  +103 | +0.045 | CONFIRMED-Q1 |   5/1 |   5/1 |  58.3 |   56.3 |   +7.6 | -0.37 | HOLD     | 3.00u | WIN     |      +3.09 |
| 2026-09-20 | MLB   | ML     | Arizona Diamondbacks    |  -122 | +0.623 | CONFIRMED-Q1 |   3/1 |   3/1 |  59.6 |   65.0 |  +10.3 |  2.74 | HOLD     | 4.00u | WIN     |      +3.28 |
| 2026-09-20 | MLB   | ML     | Cleveland Guardians     |  -223 | +0.991 | HC-1     |   4/0 |   4/0 |  62.0 |   50.0 |  +12.0 |  0.60 | HOLD     | 4.00u | WIN     |      +1.79 |
| 2026-09-20 | NFL   | ML     | Colts                   |  +249 | +0.972 | MINI     |   8/7 |   6/0 |  60.2 |   62.1 |  +10.2 |  2.25 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-09-20 | NFL   | ML     | Steelers                |  +194 | +0.792 | CONFIRMED-Q1 |   5/5 |   2/1 |  47.8 |   60.1 |   +4.6 |  0.11 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-20 | SOC   | ML     | Real Madrid CF          |  +105 | +0.609 | CONFIRMED-Q1 |   9/1 |   6/2 |  48.8 |   57.0 |  -10.1 | -2.77 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-20 | WNBA  | ML     | Los Angeles Sparks      |  -105 | +0.972 | CONFIRMED-Q1 |   4/3 |   1/0 |  54.9 |   59.0 |  +10.9 |  1.49 | HOLD     | 4.00u | WIN     |      +3.81 |
| 2026-09-20 | MLB   | SPREAD | New York Mets           |  -117 | +0.990 | CONFIRMED-Q1 |   3/1 |   3/0 |  56.4 |   67.0 |   +5.5 |  0.85 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-20 | NFL   | SPREAD | Jets                    |  -113 | +0.332 | CONFIRMED-Q1 |  9/19 |   5/4 |  43.6 |   62.5 |  -10.0 | -1.76 | HOLD     | 2.00u | WIN     |      +1.77 |
| 2026-09-20 | WNBA  | SPREAD | Seattle Storm           |  +117 | +0.000 | CONFIRMED-UNOPP |   5/1 |   1/1 |  43.2 |   63.5 |   -6.8 | -1.14 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-20 | MLB   | TOTAL  | Over 8.5                |  +108 | +0.986 | CONFIRMED-Q1 |   4/0 |   3/0 |  52.7 |   58.5 |   +2.7 |  0.02 | HOLD     | 3.00u | WIN     |      +3.24 |
| 2026-09-20 | MLB   | TOTAL  | Over 6.5                |  +133 | +0.979 | CONFIRMED-Q1 |   5/0 |   5/0 |  52.6 |   57.2 |   +2.6 | -0.19 | MUTE     | 2.50u | LOSS    |      -2.50 |
| 2026-09-20 | MLB   | TOTAL  | Under 8.5               |  -122 | +0.821 | MINI     |   1/3 |   1/3 |  64.7 |   59.4 |  +11.6 |  2.24 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-20 | MLB   | TOTAL  | Under 10.5              |  +115 | +0.121 | CONFIRMED-Q1 |   2/3 |   1/3 |  51.8 |   62.9 |   -6.6 | -0.48 | HOLD     | 3.00u | WIN     |      +3.45 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.533 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.069 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.072 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.030 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.020 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return | 1118 |    +0.0108 |    +0.0071 | 0.0000 |  +0.003 |   0.951 | positive (higher score ⇒ better outcome)                 |
| won (binary)        | 1118 |    +0.0374 |    +0.5173 | 0.0004 |  +0.020 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    | 1118 |    -0.2303 |    +0.3244 | 0.0005 |  -0.022 |   2.874 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 1118 |          +0.065 |           +0.109 |                   +0.037 |                   +0.059 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 1118 |          +0.004 |           +0.331 |                   +0.019 |                   +0.136 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 1118 |          +0.026 |           +0.238 |                   +0.007 |                   +0.078 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 1118 |          -0.000 |           +0.205 |                   +0.024 |                   +0.116 | count of contributing AGAINST-side wallets                     |
| provenFor         | 1118 |          +0.017 |           +0.231 |                   +0.009 |                   +0.102 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 1118 |          +0.001 |           +0.191 |                   +0.022 |                   +0.098 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.334         | 373 | 197-176 |   52.8% |     -0.5% |
| MID (p33–p67)     | 19.950 … 25.745        | 372 | 202-170 |   54.3% |     +0.3% |
| HIGH (> p67)      | 48.906 … 129.533       | 373 | 213-160 |   57.1% |     +1.5% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |      1118 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8045 | average score across live picks                                 |
| SD                |    0.2710 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.525 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +1.045 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.321 / +0.953 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.000 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| CFB   |   17 | 8-9    |   47.1% |    -14.1% |  0.625 |        +0.275 | strong (N<20)                             |
| MLB   |  898 | 477-421 |   53.1% |     +4.0% |  0.521 |        -0.125 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   29 | 17-12  |   58.6% |     +4.8% |  0.480 |        -0.313 | noise                                     |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   55 | 36-19  |   65.5% |    +13.3% |  0.573 |        +0.062 | real                                      |
| UFC   |   39 | 29-10  |   74.4% |    +17.3% |  0.562 |        -0.040 | real                                      |
| WNBA  |   64 | 37-27  |   57.8% |     +1.8% |  0.580 |        +0.108 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.613, 0.53, 0.494, 0.453, 0.435, 0.417, 0.431, 0.442, 0.479, 0.44, 0.461, 0.486, 0.48, 0.429]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23"]
    y-axis "edge (pp)" -10 --> 4
    line [2.8, 0, 1.5, 0.5, -1, -2, -6.4, -5.5, -4.7, -8.3, -8.1, -6.1, -5.1, 1.7]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-09-10 |    7 |   49 | 27-22  |   55.1% |     +7.5% |  0.613 |      +2.8pp |
| 2026-09-11 |    7 |   52 | 27-25  |   51.9% |     -0.9% |  0.530 |      +0.0pp |
| 2026-09-12 |    7 |   61 | 33-28  |   54.1% |     +9.0% |  0.494 |      +1.5pp |
| 2026-09-13 |    7 |   70 | 37-33  |   52.9% |     +7.4% |  0.453 |      +0.5pp |
| 2026-09-14 |    7 |   70 | 36-34  |   51.4% |     +4.5% |  0.435 |      -1.0pp |
| 2026-09-15 |    7 |   72 | 36-36  |   50.0% |     +0.2% |  0.417 |      -2.0pp |
| 2026-09-16 |    7 |   83 | 38-45  |   45.8% |     -9.8% |  0.431 |      -6.4pp |
| 2026-09-17 |    7 |   83 | 39-44  |   47.0% |     -7.9% |  0.442 |      -5.5pp |
| 2026-09-18 |    7 |   76 | 36-40  |   47.4% |     -5.0% |  0.479 |      -4.7pp |
| 2026-09-19 |    7 |   72 | 32-40  |   44.4% |    -14.4% |  0.440 |      -8.3pp |
| 2026-09-20 |    7 |   72 | 32-40  |   44.4% |    -14.4% |  0.461 |      -8.1pp |
| 2026-09-21 |    7 |   69 | 32-37  |   46.4% |    -11.6% |  0.486 |      -6.1pp |
| 2026-09-22 |    7 |   62 | 30-32  |   48.4% |     -7.9% |  0.480 |      -5.1pp |
| 2026-09-23 |    7 |   55 | 30-25  |   54.5% |     +8.0% |  0.429 |      +1.7pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.526 avg in first half → 0.526 avg in second half · Δ = +0.000)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.1% | [-0.8%, +11.0%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.8% | [51.8%, 57.8%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.533 | [0.499, 0.567]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |            107 | [40, 174]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                      1123 |
| Unique wallets ever on a FOR side            |                                                       345 |
| Avg FOR-side wallets per pick                |                                                      3.09 |
| Top-5 wallets' share of all FOR appearances  |                                                     19.9% |
| Top-10 wallets' share of all FOR appearances |                                                     32.7% |
| Top-20 wallets' share of all FOR appearances |                                                     48.5% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4b912c  | CFB,MLB,NFL,SOC,WNBA |  211 |  110 | 108-103 |   51.2% |     +2.2% |    +11.44 |     1.45× | CONFIRMED   |     -5.8% |     925 | 2026-09-23 |
|    2 | 0cd77e  | MLB,SOC,UFC,WNBA |  159 |   26 | 88-71  |   55.3% |    +14.8% |    +65.86 |     1.58× | CONFIRMED   |     -4.2% |     433 | 2026-09-23 |
|    3 | cd2f63  | CFB,MLB,NBA,NFL,SOC,WNBA |  113 |   68 | 63-50  |   55.8% |    +15.1% |    +48.98 |     1.16× | CONFIRMED   |     +5.4% |     804 | 2026-09-23 |
|    4 | eeabaf  | CFB,MLB,NBA,NFL,SOC,UFC |  107 |   73 | 52-55  |   48.6% |     +0.3% |     +0.94 |     1.19× | CONFIRMED   |     +1.1% |     573 | 2026-09-20 |
|    5 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  103 |   65 | 66-37  |   64.1% |    +17.3% |    +59.67 |     1.54× | CONFIRMED   |     +7.9% |     350 | 2026-09-11 |
|    6 | 0f9d74  | CFB,MLB,NBA,NFL,SOC,UFC |   96 |   73 | 53-43  |   55.2% |    +11.2% |    +27.22 |     0.54× | CONFIRMED   |     +7.2% |     517 | 2026-09-20 |
|    7 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | FLAT        |     +5.5% |     201 | 2026-07-05 |
|    8 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | CONFIRMED   |     -1.4% |     336 | 2026-08-05 |
|    9 | 2f2a9e  | MLB,NFL,SOC,WNBA |   85 |   32 | 45-40  |   52.9% |     -5.3% |    -12.05 |     1.97× | CONFIRMED   |     -8.3% |     306 | 2026-09-20 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   70 |   71 | 34-36  |   48.6% |     -2.6% |     -4.99 |     3.25× | CONFIRMED   |     -2.2% |     451 | 2026-09-23 |
|   12 | 7923c4  | MLB,NBA,UFC |   64 |   17 | 39-25  |   60.9% |    +27.6% |    +44.92 |     0.95× | CONFIRMED   |     +8.1% |     253 | 2026-09-23 |
|   13 | 705ba1  | MLB        |   63 |   45 | 31-32  |   49.2% |     -1.2% |     -2.12 |     1.10× | FLAT        |     +2.9% |     340 | 2026-09-23 |
|   14 | 9214c2  | MLB        |   63 |   12 | 29-34  |   46.0% |     -3.3% |     -5.93 |     1.21× | CONFIRMED   |     +6.1% |     214 | 2026-09-23 |
|   15 | 69f882  | MLB,NFL,SOC,UFC,WNBA |   59 |   34 | 36-23  |   61.0% |     +9.2% |    +15.53 |     2.21× | CONFIRMED   |     +3.1% |     270 | 2026-09-23 |
|   16 | bc35e3  | CFB,MLB,NFL,SOC,UFC,WNBA |   52 |   28 | 24-28  |   46.2% |     -1.7% |     -2.52 |     1.13× | CONFIRMED   |     -5.2% |     252 | 2026-09-20 |
|   17 | 3bdd7e  | CFB,MLB,NFL,SOC,WNBA |   50 |   21 | 31-19  |   62.0% |    +17.0% |    +17.13 |     2.74× | CONFIRMED   |    -10.0% |     208 | 2026-09-09 |
|   18 | 51176e  | MLB,NFL    |   49 |    5 | 30-19  |   61.2% |    +12.6% |    +21.85 |     0.99× | CONFIRMED   |    +10.9% |     124 | 2026-09-23 |
|   19 | 621848  | MLB,SOC,UFC,WNBA |   43 |   14 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +7.3% |     134 | 2026-09-19 |
|   20 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 |   23 | 20-17  |   54.1% |     -1.6% |     -1.88 |     1.36× | CONFIRMED   |    +11.5% |     150 | 2026-09-02 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 36b57a  | MLB        |   10 | 8-2    |   80.0% |     +88.0% |    +19.79 |     0.61× | 2026-09-23 |
|    2 | 06c80c  | MLB,NFL,SOC |   11 | 10-1   |   90.9% |     +74.7% |    +29.51 |     1.65× | 2026-09-21 |
|    3 | d66e28  | CFB,MLB,NFL,WNBA |   21 | 17-4   |   81.0% |     +66.5% |    +35.09 |     0.67× | 2026-09-23 |
|    4 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    5 | 2dc4f6  | CFB,MLB,NFL,WNBA |   16 | 11-5   |   68.8% |     +52.6% |    +19.92 |     0.58× | 2026-09-23 |
|    6 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    7 | 199296  | MLB        |   10 | 7-3    |   70.0% |     +43.0% |    +16.71 |     2.76× | 2026-09-15 |
|    8 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|    9 | 62941a  | CFB,MLB,NFL,WNBA |   21 | 14-7   |   66.7% |     +34.8% |    +22.24 |     0.88× | 2026-09-23 |
|   10 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|   11 | ba8492  | CFB,MLB,NFL |   25 | 16-9   |   64.0% |     +33.8% |    +25.66 |     1.94× | 2026-09-23 |
|   12 | 4c8ed9  | CFB,MLB,NFL,SOC,UFC,WNBA |   27 | 16-11  |   59.3% |     +33.4% |    +18.44 |     3.27× | 2026-09-22 |
|   13 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   14 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   15 | 7923c4  | MLB,NBA,UFC |   64 | 39-25  |   60.9% |     +27.6% |    +44.92 |     0.95× | 2026-09-23 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    2 | 7cc9a7  | CFB,MLB,NFL |   10 | 3-7    |   30.0% |     -33.3% |     -8.67 |     1.90× | 2026-09-21 |
|    3 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    4 | 2a8409  | MLB,NFL,WNBA |   27 | 9-18   |   33.3% |     -27.6% |    -17.78 |     1.47× | 2026-09-20 |
|    5 | 120215  | MLB,SOC    |   13 | 6-7    |   46.2% |     -22.1% |     -8.08 |     1.39× | 2026-09-20 |
|    6 | df8add  | MLB,NFL,SOC |   21 | 10-11  |   47.6% |     -16.1% |     -7.97 |     1.57× | 2026-09-20 |
|    7 | e55973  | MLB,NFL,SOC,UFC |   15 | 6-9    |   40.0% |     -15.3% |     -6.66 |     0.63× | 2026-09-19 |
|    8 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    9 | c9bba3  | CFB,MLB,NFL,SOC |   22 | 12-10  |   54.5% |     -14.7% |     -7.11 |     1.12× | 2026-09-17 |
|   10 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|   11 | 2f2a9e  | MLB,NFL,SOC,WNBA |   85 | 45-40  |   52.9% |      -5.3% |    -12.05 |     1.97× | 2026-09-20 |
|   12 | fb3150  | MLB,NFL,SOC |   16 | 9-7    |   56.3% |      -3.8% |     -1.15 |     1.12× | 2026-09-15 |
|   13 | 9214c2  | MLB        |   63 | 29-34  |   46.0% |      -3.3% |     -5.93 |     1.21× | 2026-09-23 |
|   14 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   70 | 34-36  |   48.6% |      -2.6% |     -4.99 |     3.25× | 2026-09-23 |
|   15 | bc35e3  | CFB,MLB,NFL,SOC,UFC,WNBA |   52 | 24-28  |   46.2% |      -1.7% |     -2.52 |     1.13× | 2026-09-20 |

> 🔴 **2 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 85, ROI -5.3%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  3254 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   891 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     3 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |   127 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     9 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   390 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            364 |        95 |   42 |   27 |  200 |                    164 |
| NBA   |            211 |        54 |   25 |   24 |  108 |                    103 |
| NHL   |            105 |        22 |   13 |   15 |   55 |                     50 |
| SOC   |            376 |       101 |   49 |   24 |  202 |                    174 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |  116 |   1123 | 2279 | 615-508 |  54.8% |      5.1% |    +158.38 |    +0.14 | 0.516 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | + 1063 |    +1.4pp |    +14.0pp |          +0.314 |   -0.033 |    +0.0902 | 🟡 mixed |
| v12 − v10          | + 1061 |    +6.4pp |    +23.8pp |          +0.454 |   +0.122 |    +0.0305 | 🟢 better |
| v12 − v11          | + 1012 |    -0.2pp |     +2.2pp |          +0.080 |   +0.072 |    +0.0144 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | CFB            | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | —              | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | —              | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | —              | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 17n 47.1% -14% | 902n 53.1% +4% | 10n 30.0% +29% | 29n 58.6% +5%  | 6n 83.3% +38%  | 56n 66.1% +14% | 39n 74.4% +17% | 64n 57.8% +2%  | 1123n 54.8% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 209n +8%      | 279n +2%      | 228n +6%      | 151n -4%      | 250n +10%     | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~3684 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1357 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 1118 / 1357 (82%) | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 1118 / 1357 (82%) | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 1118 / 1357 (82%) | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 1118 / 1357 (82%) | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 1118 / 1357 (82%) | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 1118 / 1357 (82%) | Count of proven AGAINST-side wallets                                 |
| countMargin          | 1118 / 1357 (82%) | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1357 / 1357 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1357 / 1357 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1357 / 1357 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1357 / 1357 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1357 / 1357 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1357 / 1357 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1350 / 1357 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1345 / 1357 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1357 / 1357 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1356 / 1357 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 882 / 1357 (65%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1356 / 1357 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 882 / 1357 (65%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 881 / 1357 (65%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1357 / 1357 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1357 / 1357 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1357 / 1357 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1356 / 1357 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1357 / 1357 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 882 |      |    +0.030 |    +0.271 |      +0.052 |      +0.140 |  0.516 |
|    2 | wd sizeMargin        | 881 |      |    -0.023 |    -0.021 |      -0.044 |      -0.059 |  0.487 |
|    3 | wd agAvgSize         | 882 |      |    +0.022 |    +0.026 |      +0.040 |      +0.043 |  0.513 |
|    4 | V12 forMean          | 1118 |  🟢  |    +0.065 |    +0.109 |      +0.037 |      +0.059 |  0.526 |
|    5 | wd contribMargin     | 1357 |      |    -0.009 |    -0.070 |      -0.035 |      -0.070 |  0.482 |
|    6 | qMargin              | 1118 |  🟢  |    +0.066 |    +0.031 |      +0.032 |      +0.016 |  0.518 |
|    7 | hcMargin             | 1357 |      |    -0.002 |    +0.204 |      -0.029 |      +0.061 |  0.509 |
|    8 | lockPinnProb         | 1350 |      |    +0.193 |    +0.158 |      +0.028 |      -0.124 |  0.599 |
|    9 | wd maxForContrib     | 1356 |      |    -0.033 |    -0.058 |      -0.027 |      -0.028 |  0.493 |
|   10 | clv                  | 1345 |      |    -0.026 |    +0.081 |      -0.026 |      +0.028 |  0.515 |
|   11 | V12 agCount          | 1118 |  🟢  |    -0.000 |    +0.205 |      +0.024 |      +0.116 |  0.503 |
|   12 | ags (v11)            | 1357 |      |    +0.004 |    +0.039 |      -0.020 |      -0.026 |  0.511 |
|   13 | wd contribAg         | 1357 |      |    -0.001 |    +0.138 |      +0.020 |      +0.066 |  0.491 |
|   14 | V12 agMean           | 1118 |  🟢  |    +0.004 |    +0.331 |      +0.019 |      +0.136 |  0.475 |
|   15 | provenMargin         | 1357 |      |    +0.002 |    +0.097 |      -0.018 |      +0.011 |  0.502 |
|   16 | wd contribFor        | 1357 |      |    -0.009 |    +0.007 |      -0.017 |      -0.015 |  0.487 |
|   17 | wd maxShare          | 1357 |      |    +0.022 |    -0.095 |      +0.016 |      -0.033 |  0.510 |
|   18 | provenFor            | 1357 |      |    -0.005 |    +0.139 |      -0.011 |      +0.036 |  0.498 |
|   19 | wd forAvgSize        | 1356 |      |    +0.005 |    +0.059 |      -0.011 |      +0.007 |  0.516 |
|   20 | countMargin          | 1118 |      |    +0.027 |    +0.121 |      -0.010 |      +0.008 |  0.504 |
|   21 | provenAg             | 1357 |      |    -0.011 |    +0.194 |      +0.007 |      +0.091 |  0.489 |
|   22 | V12 forCount         | 1118 |  🟢  |    +0.026 |    +0.238 |      +0.007 |      +0.078 |  0.510 |
|   23 | wd forCount          | 1356 |      |    +0.007 |    +0.183 |      -0.007 |      +0.043 |  0.494 |
|   24 | peakStars            | 1357 |      |    +0.025 |    +0.015 |      +0.005 |      -0.021 |  0.513 |
|   25 | provenTotal          | 1357 |      |    -0.009 |    +0.111 |      -0.004 |      +0.042 |  0.493 |
|   26 | agsV12               | 1118 |  🟢  |    +0.020 |    -0.072 |      +0.003 |      -0.030 |  0.533 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.052), `wd sizeMargin` (r = -0.044), `wd agAvgSize` (r = +0.040).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd agCount` — r(unit-ret) = +0.052, AUC = 0.516. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.052 · AUC = 0.516

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 388 | 205-183 |   52.8% |     -0.9% |
| MID (p33–p67)     | 2.000 … 2.000            | 211 | 111-100 |   52.6% |     -0.6% |
| HIGH (> p67)      | 3.000 … 3.000            | 283 | 159-124 |   56.2% |     +2.3% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd sizeMargin` · r(unit-ret) = -0.044 · AUC = 0.487

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -1.616          | 294 | 165-129 |   56.1% |     +2.3% |
| MID (p33–p67)     | 0.078 … 0.552            | 293 | 154-139 |   52.6% |     +0.6% |
| HIGH (> p67)      | 3.728 … 1.157            | 294 | 156-138 |   53.1% |     -2.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd agAvgSize` · r(unit-ret) = +0.040 · AUC = 0.513

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.110 … 0.177            | 295 | 152-143 |   51.5% |     -2.6% |
| MID (p33–p67)     | 0.699 … 0.647            | 293 | 158-135 |   53.9% |     +0.2% |
| HIGH (> p67)      | 6.557 … 2.310            | 294 | 165-129 |   56.1% |     +2.9% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `V12 forMean` · r(unit-ret) = +0.037 · AUC = 0.526

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.334           | 373 | 197-176 |   52.8% |     -0.5% |
| MID (p33–p67)     | 19.950 … 25.745          | 372 | 202-170 |   54.3% |     +0.3% |
| HIGH (> p67)      | 48.906 … 129.533         | 373 | 213-160 |   57.1% |     +1.5% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd contribMargin` · r(unit-ret) = -0.035 · AUC = 0.482

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … 22.000         | 453 | 257-196 |   56.7% |     +2.3% |
| MID (p33–p67)     | 57.800 … 59.650          | 453 | 247-206 |   54.5% |     +0.5% |
| HIGH (> p67)      | 174.100 … 76.600         | 451 | 235-216 |   52.1% |     -1.8% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | wd sizeMargin  | wd agAvgSize   | V12 forMean    | wd contribMargin | qMargin        | hcMargin       | lockPinnProb   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         +0.034 |         +0.084 |         +0.093 |         -0.167 |         -0.028 |         +0.068 |         -0.079 |
| wd sizeMargin |         +0.034 |  1.000         |         -0.683 |         +0.172 |         +0.236 |         +0.163 |         +0.270 |         +0.122 |
| wd agAvgSize |         +0.084 |         -0.683 |  1.000         |         -0.034 |         -0.142 |         -0.051 |         -0.093 |         -0.083 |
| V12 forMean |         +0.093 |         +0.172 |         -0.034 |  1.000         |         +0.060 |         +0.936 |         +0.218 |         +0.084 |
| wd contribMargin |         -0.167 |         +0.236 |         -0.142 |         +0.060 |  1.000         |         +0.050 |         +0.580 |         +0.185 |
| qMargin     |         -0.028 |         +0.163 |         -0.051 |         +0.936 |         +0.050 |  1.000         |         +0.205 |         +0.094 |
| hcMargin    |         +0.068 |         +0.270 |         -0.093 |         +0.218 |         +0.580 |         +0.205 |  1.000         |         +0.213 |
| lockPinnProb |         -0.079 |         +0.122 |         -0.083 |         +0.084 |         +0.185 |         +0.094 |         +0.213 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.936. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 761 picks · features = 8 (+ intercept) · multiple R² = **0.0103** · adjusted R² = **-0.0015** · residual sd = 0.958

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd agCount           |     |    +0.0570 |   0.0388 | +1.47        |        1 |
|    2 | hcMargin             |     |    -0.0423 |   0.0456 | -0.93        |        2 |
|    3 | wd agAvgSize         |     |    +0.0350 |   0.0486 | +0.72        |        3 |
|    4 | V12 forMean          |  🟢 |    +0.0295 |   0.1055 | +0.28        |        4 |
|    5 | lockPinnProb         |     |    +0.0244 |   0.0359 | +0.68        |        5 |
|    6 | wd sizeMargin        |     |    -0.0217 |   0.0506 | -0.43        |        6 |
|    7 | qMargin              |  🟢 |    +0.0185 |   0.1052 | +0.18        |        7 |
|    8 | wd contribMargin     |     |    -0.0001 |   0.0449 | -0.00        |        8 |
| —    | (intercept)          |     |    +0.0190 |   0.0347 |    +0.55 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.030), `qMargin` (β = +0.019)
- V12 IGNORES: `wd agCount` (β = +0.057, t = +1.47), `hcMargin` (β = -0.042, t = -0.93), `wd agAvgSize` (β = +0.035, t = +0.72), `lockPinnProb` (β = +0.024, t = +0.68), `wd sizeMargin` (β = -0.022, t = -0.43), `wd contribMargin` (β = -0.000, t = -0.00)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.530 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.572 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.042.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~4.2pp.

### 17G — Actionable recommendations

- Adjusted R² of -0.0015 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*