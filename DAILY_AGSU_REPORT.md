# AGS-Unified — V12 Daily Monitor

**Generated:** Tuesday, September 22, 2026 at 1:12 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (114 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (114 days ago), V12 has evaluated **4300** picks, shipped **1110** for real money (25.8% ship rate), and muted the other **3190**. On the shipped picks V12 has gone **609-501** (54.9% win), staked **3099.45u**, and returned **+161.74u** at **+5.2% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                            114 |
| Picks V12 has evaluated             |                           4300 |
| Picks SHIPPED (units > 0)           |                           1110 |
| Picks MUTED (score ≤ 0, FADE)       |                           3190 |
| Ship rate                           |                          25.8% |
| Live W-L                            |                        609-501 |
| Live Win %                          |                          54.9% |
| Live PnL (units)                    |                        +161.74 |
| Live ROI                            |                          +5.2% |
| Avg PnL / day                       |                         +1.42u |
| Most recent action (2026-09-22)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **5.2% ROI** across 1110 live picks (+161.74u real PnL).
- Mute rule is **saving money** — the 2199 muted picks would have lost -102.28u at flat 1u (-4.7% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.42u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **373-308** · +6.0% ROI · +115.13u on 681 graded — see § 5.

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

**Full book:** 114d · 1110 live · 609-501 · **+161.74u** · +5.2% ROI · +1.42u/day.

_Prior to table (2026-06-01 → 2026-09-01): 930 live · 512-418 · +134.17u · cum through prior = +134.17u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-09-22 |        39 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +161.74 |

> **Trajectory.** 🟢 Last 3 days (27.5% ROI) **+22.7pp** vs prior (4.8%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-09-21**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 23 | 17-6 | +43.6% | +42.11u | +1.83u | +38.3% |
| 🟢 2 | MINI- (gate-cut) | C | 23 | 14-9 | +24.8% | +9.41u | +0.41u | +55.2% |
| 🟢 3 | DISSENT rescue | D | 24 | 13-11 | +12.0% | +3.05u | +0.13u | — |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 136 | 84-52 | +10.3% | +64.97u | sized UP after path |
| 2 | Tape HOLD (mid) | 477 | 259-218 | +6.7% | +76.70u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 31 | 14-17 | -31.1% | -20.68u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 76 | 34-42 | -4.9% | -3.71u | 🟢 saving $ |
| 2 | Score FADE (≤0 → 0u) | 1109 | 562-547 | +0.2% | +1.74u | 🟡 flat |
| 3 | Tape MUTE (tape<0 → 0u) | 231 | 124-107 | +0.5% | +1.14u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 23 | 17-6 | 73.9% | 96.5u | +42.11u | +43.6% | +1.83u | 1 | +38.3% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 107 | 64-43 | 59.8% | 393.7u | +20.17u | +5.1% | +0.19u | 1 | +44.8% | — | 🟢 OK |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 114 | 66-48 | 57.9% | 412.0u | +48.85u | +11.9% | +0.43u | 3 | -100.0% | — | 🔻 cooling |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 94 | 44-50 | 46.8% | 326.8u | -24.88u | -7.6% | -0.26u | 3 | -100.0% | — | 🔻 cooling |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 114 | 59-55 | 51.8% | 318.3u | +0.16u | +0.1% | +0.00u | 1 | +92.5% | +1.85u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 111 | 63-48 | 56.8% | 299.5u | +17.23u | +5.8% | +0.16u | 6 | -27.2% | — | 🔻 cooling |
| MINI- (gate-cut) | `MINI-` | C | 1u | 23 | 14-9 | 60.9% | 37.9u | +9.41u | +24.8% | +0.41u | 3 | +55.2% | — | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 24 | 13-11 | 54.2% | 25.4u | +3.05u | +12.0% | +0.13u | 0 | — | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 136 | 84-52 | 61.8% | 632.9u | +64.97u | +10.3% | 4 | -23.0% | — |
| Tape HOLD (mid) | TAPE | staked | 477 | 259-218 | 54.3% | 1153.3u | +76.70u | +6.7% | 63 | -1.9% | +8.76u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 31 | 14-17 | 45.2% | 66.5u | -20.68u | -31.1% | 1 | +44.5% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 231 | 124-107 | 53.7% | 231.0u | +1.14u | +0.5% | 46 | -11.9% | — |
| fadeTop≥60 MUTE | E | CF 1u | 76 | 34-42 | 44.7% | 76.0u | -3.71u | -4.9% | 20 | +2.0% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 1109 | 562-547 | 50.7% | 1109.0u | +1.74u | +0.2% | 156 | +4.7% | +1.57u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 8 / +52% | 2 / +4% | — |
| TOP | 39 / -1% | 24 / +4% | 4 / -16% |
| RANK | 65 / +7% | 10 / +27% | — |
| SHARP | 22 / -25% | 46 / -1% | 1 / -100% |
| SHARP-LEAN | 84 / +1% | 26 / +2% | 4 / -63% |
| MINI | 57 / -1% | 12 / +51% | 5 / -25% |
| MINI- | 8 / +10% | 2 / +52% | 3 / -5% |
| DISSENT | 15 / +22% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-09-21)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| SHARP-LEAN EDGE/net ONE | 1 | 1-0 | +1.85u | +92.5% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  37 | 17-6   |  73.9% |       96.50 |     +42.11 |     43.6% |
| TOP PICK (TOP+/TOP)       |  4-5u | 244 | 79-57  |  58.1% |      526.20 |      +8.23 |      1.6% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 901 | 175-161 |  52.1% |     1106.05 |     +17.52 |      1.6% |
| STRONG (MINI)             |    3u | 196 | 63-48  |  56.8% |      299.45 |     +17.23 |      5.8% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 164 | 29-23  |  55.8% |       68.25 |     +10.44 |     15.3% |
| **STAKED TOTAL** |     — | 658 | 363-295 |  55.2% |     2096.45 |     +95.53 |     +4.6% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  37 | 17-6   |  73.9% |       96.50 |     +42.11 |     43.6% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 215 | 64-43  |  59.8% |      393.70 |     +20.17 |      5.1% |
| B · 2-for-0 rescue    | RANK        |    4u | 212 | 66-48  |  57.9% |      411.95 |     +48.85 |     11.9% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 511 | 59-55  |  51.8% |      318.34 |      +0.16 |      0.1% |
| C · proven-$ consensus | SHARP       |    3u | 164 | 44-50  |  46.8% |      326.76 |     -24.88 |     -7.6% |
| A · mini-HC (gate-pass) | MINI        |    3u | 196 | 63-48  |  56.8% |      299.45 |     +17.23 |      5.8% |
| C · mini gate-cut     | MINI-       |    1u |  43 | 14-9   |  60.9% |       37.90 |      +9.41 |     24.8% |
| A · margin 3+         | CONFIRMED   |    1u |  16 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u | 105 | 13-11  |  54.2% |       25.35 |      +3.05 |     12.0% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 751 picks tracked at 0u (would-be 360-391, 47.9% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (26-11, +42.11u)  ·  🟢 TOP PICK (131-113, +8.23u)  ·  🟠 SHARP PLAY (446-455, +17.52u)  ·  🔴 STRONG (107-89, +17.23u)  ·  🟣 LEAN (92-72, +10.44u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21"]
    y-axis "PnL (u)" -14 --> 50
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54, 44.81, 44.81, 44.81, 44.81, 44.81, 41.81, 41.81, 39.81, 39.81, 39.81, 39.81, 39.81, 39.81, 42.11, 42.11, 42.11, 42.11, 42.11, 42.11]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 8.23, 8.23]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85, 38.85, 38.79, 38.82, 41.18, 43.74, 44.86, 43.97, 43.97, 42.76, 37.04, 38.07, 38.07, 38.07, 21.67, 21.67, 21.67, 15.67, 15.67, 17.52]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37, 18.31, 18.31, 18.31, 18.31, 18.31, 21.88, 21.88, 11.88, 7.88, 14.28, 22.4, 22.4, 21.31, 21.31, 21.31, 21.31, 22.23, 17.23, 17.23]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 10.44, 10.44, 10.44]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71, 72, 71, 72, 72, 72, 70, 70, 68, 66, 66, 66, 66, 66, 67, 69, 69, 70, 70, 70]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 54, 54, 54, 54, 53, 54, 54]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50, 50, 50, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 49, 49, 49, 49, 50, 50, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57, 57, 57, 56, 55, 55, 56, 55, 54, 54, 55, 56, 56, 56, 56, 56, 56, 56, 55, 55]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 56, 57, 57, 57, 57, 57, 57, 58, 57, 58, 58, 58, 57, 57, 58, 56, 56]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 2988 | 2979 | 2922 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 231 | 124-107 | 53.7% | 54.50u | -7.74u | -14.2% |
| HOLD      | 991 | 509-482 | 51.4% | 1156.32u | +73.70u | +6.4% |
| BOOST     | 292 | 159-133 | 54.5% | 636.38u | +67.05u | +10.5% |
| FAIL_OPEN | 73 | 39-34 | 53.4% | 68.50u | -19.79u | -28.9% |
| PASS      | 1335 | 671-664 | 50.3% | 13.50u | -1.52u | -11.3% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 1086 | 577-509 | 53.1% | +25.84u |
| hold (0–2.89) | path u | 1196 | 587-609 | 49.1% | +41.50u |
| boost (≥2.89) | ×1.35 | 355 | 189-166 | 53.2% | +65.00u |

_Score coverage: **2637/2922** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 231 | +16.42u | -16.42u | +137.75u | +154.17u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 138 | +46.75u | +67.05u | +20.30u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-09-22 | MLB | Cincinnati Reds | SHARP | 3.35 | BOOST | 1.50u | 0.00u | — |
| 2026-09-22 | MLB | Los Angeles Dodgers | PATH-D | -3.36 | MUTE | 1.00u | 0.00u | — |
| 2026-09-22 | MLB | Pittsburgh Pirates | SHARP | 4.68 | BOOST | 4.00u | 0.00u | — |
| 2026-09-22 | MLB | Tampa Bay Rays | SHARP~ | -0.56 | MUTE | 1.00u | 0.00u | — |
| 2026-09-22 | MLB | Tampa Bay Rays | SHARP | 5.15 | BOOST | 4.00u | 0.00u | — |
| 2026-09-22 | WNBA | Golden State Valkyries | SHARP~ | 6.09 | BOOST | 4.00u | 0.00u | — |
| 2026-09-22 | MLB | Athletics | CONFIRMED-UNOPP | -1.51 | MUTE | 2.00u | 0.00u | — |
| 2026-09-22 | MLB | Over 7.5 | CONFIRMED-Q1 | 6.77 | BOOST | 1.00u | 0.00u | — |
| 2026-09-21 | MLB | Washington Nationals | MINI | 7.54 | BOOST | 4.00u | 0.00u | LOSS |
| 2026-09-21 | WNBA | New York Liberty | 2-for-0 | 3.80 | BOOST | 5.00u | 0.00u | LOSS |
| 2026-09-20 | MLB | Detroit Tigers | SHARP~ | -0.05 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-20 | MLB | San Diego Padres | CONFIRMED-Q1 | 4.20 | BOOST | 3.00u | 0.00u | WIN |
| 2026-09-20 | MLB | Milwaukee Brewers | SHARP~ | -0.91 | MUTE | 1.00u | 0.00u | WIN |
| 2026-09-20 | MLB | New York Mets | SHARP | 5.63 | BOOST | 2.50u | 0.00u | LOSS |
| 2026-09-20 | NFL | Ravens | CONFIRMED-UNOPP | -1.09 | MUTE | 1.00u | 0.00u | LOSS |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.85** · nPriors=636 · source=expanding_q1 · asOf=2026-09-22 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 2542 | 2429 | 2379 | 499 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 194 | 86-108 | 44.3% | 13.00u | -5.29u | -40.7% |
| HOLD      | 508 | 262-246 | 51.6% | 348.50u | +7.09u | +2.0% |
| FAIL_OPEN | 62 | 25-37 | 40.3% | 44.90u | -5.08u | -11.3% |
| EXEMPT    | 1042 | 561-481 | 53.8% | 996.65u | +90.70u | +9.1% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -249.7 … -3.5 | 93 | 37-56 | 39.8% | 0.0u | +0.00u | — |
| Q2 | -3.4 … 0.9 | 93 | 43-50 | 46.2% | 36.9u | +14.66u | +39.7% |
| Q3 | 1.0 … 5.7 | 93 | 49-44 | 52.7% | 63.5u | -2.37u | -3.7% |
| Q4 | 5.9 … 19.2 | 93 | 49-44 | 52.7% | 96.0u | -17.35u | -18.1% |
| Q5 | 19.3 … 1802.6 | 94 | 52-42 | 55.3% | 112.1u | +9.65u | +8.6% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 194 | 86-108 | -19.00u | +19.00u | +135.40u | +116.40u |

> 🟢 **Mute is saving money** (Δ +19.00u · muted WR 44.3%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 88 | 35-53 | 39.8% | 109.4u | -19.22u |
| CFB | 21 | 9-12 | 42.9% | 34.4u | +3.64u |
| MLB | 117 | 54-63 | 46.2% | 136.5u | -7.37u |
| NFL | 23 | 8-15 | 34.8% | 30.9u | -14.24u |
| SOC | 9 | 4-5 | 44.4% | 12.5u | +2.90u |
| WNBA | 24 | 11-13 | 45.8% | 26.0u | -3.93u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-09-22 | MLB | Tampa Bay Rays | CONFIRMED-UNOPP | -1.0 | -0.8 | 1.00u | pending |
| 2026-09-22 | MLB | Over 7.5 | — | -38.7 | -0.8 | 1.00u | pending |
| 2026-09-20 | MLB | Detroit Tigers | SHARP~ | -35.0 | -0.9 | 1.00u | LOSS |
| 2026-09-20 | MLB | Baltimore Orioles | — | -2.4 | -0.9 | 1.00u | LOSS |
| 2026-09-20 | NFL | Jets | — | -492.7 | -0.9 | 1.50u | LOSS |
| 2026-09-20 | SOC | Manchester United FC | — | -21.5 | -0.9 | 4.00u | LOSS |
| 2026-09-20 | MLB | Baltimore Orioles | CONFIRMED-UNOPP | -1.3 | -0.9 | 1.00u | LOSS |
| 2026-09-20 | MLB | St. Louis Cardinals | CONFIRMED-UNOPP | -1.4 | -0.9 | 1.00u | WIN |
| 2026-09-20 | NFL | Falcons | SHARP~ | -2.7 | -0.9 | 1.00u | LOSS |
| 2026-09-20 | NFL | Jaguars | — | -15.2 | -0.9 | 1.00u | LOSS |
| 2026-09-20 | NFL | Raiders | — | -112.8 | -0.9 | 1.00u | WIN |
| 2026-09-20 | MLB | Under 7.5 | — | -3.8 | -0.9 | 1.00u | WIN |
| 2026-09-20 | MLB | Under 7.5 | — | -1.9 | -0.9 | 1.00u | WIN |
| 2026-09-20 | NFL | Over 45.5 | SHARP | -14.6 | -0.9 | 3.00u | LOSS |
| 2026-09-20 | NFL | Over 45.5 | SHARP~ | -97.8 | -0.9 | 1.00u | LOSS |
| 2026-09-20 | NFL | Under 43.5 | SHARP~ | -9.1 | -0.9 | 1.00u | WIN |
| 2026-09-20 | NFL | Over 39.5 | SHARP | -11.1 | -0.9 | 1.00u | WIN |
| 2026-09-20 | NFL | Under 41.5 | — | 11.1 | -0.9 | 1.00u | LOSS |
| 2026-09-20 | NFL | Under 41.5 | SHARP~ | -12.0 | -0.9 | 1.00u | WIN |
| 2026-09-19 | CFB | Ole Miss | — | -36.5 | -1.0 | 1.00u | WIN |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 98 | 50-48 | 51.0% | 308.5u | +4.59u | +1.5% |
| Muted (Q1 → 0u) | 194 | 86-108 | 44.3% | 13.0u | -5.29u | -40.7% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 168–95 · 63.9% · +15.4%); **5–10 is the hole** (104–94 · 52.5% · +1.8%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 892 tickets · cov 863/892 (stamp 661 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 402 | 205–197 | 51.0% | -3.3% |
| 5–10 | 198 | 104–94 | 52.5% | +1.8% |
| ≥10 | 263 | 168–95 | 63.9% | +15.4% |
| All | 892 | 491–401 | 55.0% | +5.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (111) | 56.6% (76) | 69.6% (102) |
| B | 53.8% (78) | 61.5% (13) | 69.6% (23) |
| C | 37.5% (40) | 44.3% (61) | 56.1% (114) |

##### Jul 15+ · 681 tickets · cov 658/681 (stamp 656 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 296 | 152–144 | 51.4% | -0.7% |
| 5–10 | 159 | 81–78 | 50.9% | +1.3% |
| ≥10 | 203 | 129–74 | 63.5% | +13.3% |
| All | 681 | 373–308 | 54.8% | +6.0% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.1% (52) | 55.3% (47) | 70.5% (61) |
| B | 53.8% (52) | 50% (8) | 68.8% (16) |
| C | 36.8% (19) | 44.6% (56) | 56.7% (104) |

##### Yesterday (Sep 21) · 4 tickets · cov 4/4 (stamp 4 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 1 | 1–0 | 100.0% | +34.0% |
| 5–10 | 3 | 3–0 | 100.0% | +96.8% |
| All | 4 | 4–0 | 100.0% | +79.6% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| C | — | 100% (1) | — |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 892 tickets · cov 883/892 (stamp 672 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 593 | 333–260 | 56.2% | +6.5% |
| 5–10 | 152 | 78–74 | 51.3% | +3.1% |
| ≥10 | 138 | 77–61 | 55.8% | +5.5% |
| All | 892 | 491–401 | 55.0% | +5.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 58% (188) | 50% (52) | 71.4% (56) |
| B | 59.8% (87) | 50% (14) | 53.8% (13) |
| C | 50.4% (121) | 54.9% (51) | 40.8% (49) |

##### Jul 15+ · 681 tickets · cov 673/681 (stamp 672 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 443 | 255–188 | 57.6% | +10.9% |
| 5–10 | 129 | 65–64 | 50.4% | +2.1% |
| ≥10 | 101 | 50–51 | 49.5% | -5.1% |
| All | 681 | 373–308 | 54.8% | +6.0% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 62.8% (94) | 47.2% (36) | 62.9% (35) |
| B | 57.6% (59) | 50% (10) | 57.1% (7) |
| C | 54.3% (94) | 54.2% (48) | 37.5% (40) |

##### Yesterday (Sep 21) · 4 tickets · cov 4/4 (stamp 4 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 3 | 3–0 | 100.0% | +74.5% |
| 5–10 | 1 | 1–0 | 100.0% | +93.3% |
| All | 4 | 4–0 | 100.0% | +79.6% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| C | 100% (1) | — | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 892 tickets · cov 861/892 (stamp 653 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 195 | 100–95 | 51.3% | -7.7% |
| 0–2.89 | 480 | 257–223 | 53.5% | +6.6% |
| ≥2.89 | 186 | 120–66 | 64.5% | +14.5% |
| All | 892 | 491–401 | 55.0% | +5.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 57.3% (171) | 75.7% (74) |
| B | 61.1% (36) | 54.1% (61) | 64.7% (17) |
| C | 18.2% (11) | 49.6% (125) | 53.8% (78) |

##### Jul 15+ · 681 tickets · cov 656/681 (stamp 653 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 126 | 72–54 | 57.1% | +9.2% |
| 0–2.89 | 389 | 203–186 | 52.2% | +4.1% |
| ≥2.89 | 141 | 87–54 | 61.7% | +10.2% |
| All | 681 | 373–308 | 54.8% | +6.0% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 53.5% (114) | 75% (44) |
| B | 60% (20) | 54.3% (46) | 60% (10) |
| C | — | 50% (106) | 52.8% (72) |

##### Yesterday (Sep 21) · 4 tickets · cov 4/4 (stamp 4 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 2 | 2–0 | 100.0% | +68.5% |
| 0–2.89 | 2 | 2–0 | 100.0% | +93.0% |
| All | 4 | 4–0 | 100.0% | +79.6% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| C | — | 100% (1) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 681 | 373-308 | 54.8% | 1923.20u | +115.13u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 681/681 | 3.10 | 2.95 | +0.15 | 2.00 | 2.00 |
| depth   | #A sharps        | 681/681 | 1.71 | 1.70 | +0.01 | 1.00 | 1.00 |
| depth   | #F − #A          | 681/681 | 1.39 | 1.25 | +0.14 | 1.00 | 1.00 |
| depth   | proven F         | 681/681 | 2.18 | 2.15 | +0.03 | 2.00 | 2.00 |
| depth   | proven A         | 681/681 | 0.86 | 0.87 | -0.01 | 0.00 | 0.00 |
| depth   | proven F−A       | 681/681 | 1.33 | 1.28 | +0.04 | 1.00 | 1.00 |
| depth   | v12 F count      | 681/681 | 3.09 | 2.94 | +0.14 | 2.00 | 2.00 |
| depth   | v12 A count      | 681/681 | 1.78 | 1.75 | +0.03 | 1.00 | 1.00 |
| depth   | WA ForN          | 681/681 | 2.40 | 2.41 | -0.01 | 2.00 | 2.00 |
| depth   | WA AgN           | 681/681 | 1.39 | 1.46 | -0.07 | 1.00 | 1.00 |
| depth   | CLV ForN         | 680/681 | 2.78 | 2.66 | +0.12 | 2.00 | 2.00 |
| depth   | CLV AgN          | 680/681 | 1.64 | 1.65 | -0.00 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 681/681 | 0.32 | 0.30 | +0.02 | 0.00 | 0.00 |
| quality | ForWR            | 656/681 | 56.68 | 55.33 | +1.35 | 54.68 | 54.40 |
| quality | AgWR             | 444/681 | 46.61 | 47.84 | -1.24 | 47.97 | 48.67 |
| quality | TopFor WR        | 656/681 | 62.12 | 60.86 | +1.25 | 58.50 | 57.95 |
| quality | TopAg WR         | 444/681 | 50.10 | 51.00 | -0.90 | 50.99 | 51.06 |
| quality | EDGE             | 656/681 | 8.87 | 6.66 | +2.21 | 6.62 | 5.07 |
| quality | ForCLV           | 672/681 | 63.58 | 63.83 | -0.25 | 63.98 | 64.44 |
| quality | AgCLV            | 472/681 | 62.29 | 61.11 | +1.18 | 63.15 | 62.40 |
| quality | netCLV           | 672/681 | 1.38 | 2.45 | -1.08 | 1.50 | 2.46 |
| quality | Tape             | 653/681 | 1.98 | 1.67 | +0.31 | 1.47 | 1.31 |
| quality | V12 score        | 681/681 | 0.77 | 0.76 | +0.01 | 0.95 | 0.93 |
| quality | V12 forMean      | 681/681 | 30.27 | 26.01 | +4.27 | 24.80 | 19.05 |
| quality | V12 agMean       | 681/681 | 4.51 | 4.08 | +0.43 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 656/681 | 0.554 | -0.005 | +0.107 | +2.21 | 🟡 mild OK |
|    2 | AgWR             | quality | 444/681 | 0.456 | +0.182 | -0.091 | -1.24 | 🟡 mild OK |
|    3 | AgCLV            | quality | 472/681 | 0.543 | -0.019 | +0.079 | +1.18 | 🟡 mild inv |
|    4 | V12 score        | quality | 681/681 | 0.538 | -0.072 | +0.021 | +0.01 | flat |
|    5 | V12 forMean      | quality | 681/681 | 0.537 | +0.206 | +0.078 | +4.27 | flat |
|    6 | netCLV           | quality | 672/681 | 0.465 | -0.150 | -0.047 | -1.08 | flat |
|    7 | TopFor WR        | quality | 656/681 | 0.532 | +0.209 | +0.059 | +1.25 | flat |
|    8 | V12 agMean       | quality | 681/681 | 0.471 | +0.347 | +0.026 | +0.43 | flat |
|    9 | ForWR            | quality | 656/681 | 0.528 | +0.069 | +0.076 | +1.35 | flat |
|   10 | Tape             | quality | 653/681 | 0.524 | -0.111 | +0.054 | +0.31 | flat |
|   11 | TopAg WR         | quality | 444/681 | 0.476 | +0.149 | -0.051 | -0.90 | flat |
|   12 | ForCLV           | quality | 672/681 | 0.477 | -0.211 | -0.013 | -0.25 | flat |
|   13 | proven A         | depth   | 681/681 | 0.478 | +0.326 | -0.004 | -0.01 | flat |
|   14 | unopposed (A=0)  | depth   | 681/681 | 0.515 | +0.221 | +0.024 | +0.02 | flat |
|   15 | WA ForN          | depth   | 681/681 | 0.487 | +0.298 | -0.002 | -0.01 | flat |
|   16 | WA AgN           | depth   | 681/681 | 0.488 | +0.214 | -0.021 | -0.07 | flat |
|   17 | CLV ForN         | depth   | 680/681 | 0.511 | +0.290 | +0.030 | +0.12 | flat |
|   18 | #F sharps        | depth   | 681/681 | 0.508 | +0.299 | +0.030 | +0.15 | flat |
|   19 | proven F−A       | depth   | 681/681 | 0.506 | +0.202 | +0.014 | +0.04 | flat |
|   20 | #A sharps        | depth   | 681/681 | 0.494 | +0.210 | +0.002 | +0.01 | flat |
|   21 | proven F         | depth   | 681/681 | 0.496 | +0.353 | +0.010 | +0.03 | flat |
|   22 | #F − #A          | depth   | 681/681 | 0.503 | +0.174 | +0.027 | +0.14 | flat |
|   23 | v12 F count      | depth   | 681/681 | 0.503 | +0.294 | +0.030 | +0.14 | flat |
|   24 | CLV AgN          | depth   | 680/681 | 0.497 | +0.195 | -0.001 | -0.00 | flat |
|   25 | v12 A count      | depth   | 681/681 | 0.497 | +0.203 | +0.009 | +0.03 | flat |

### (C) Working read

_N=681 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.554 · Δ +2.21 · higher on WINs (cov 656/681)
- **AgWR** — AUC 0.456 · Δ -1.24 · higher on LOSSes (cov 444/681)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1176 | 381 | 381 | 377 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 76 | 41-35 | 53.9% | 236.85u | +13.85u | +5.8% | -0.4 |
| on→off | 14 | 6-8 | 42.9% | 41.70u | -6.40u | -15.3% | -5.0 |
| off→on | 73 | 43-30 | 58.9% | 228.60u | +29.57u | +12.9% | +1.6 |
| off→off | 214 | 117-97 | 54.7% | 564.30u | +21.24u | +3.8% | -0.5 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 229 | 124-105 | 54.1% | 685.20u | +20.51u | +3.0% |
| 0–2 | 106 | 61-45 | 57.5% | 285.85u | +52.92u | +18.5% |
| 2–4 | 23 | 14-9 | 60.9% | 63.90u | +6.63u | +10.4% |
| 4+ | 19 | 8-11 | 42.1% | 36.50u | -21.80u | -59.7% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 6 | 5-1 | 83.3% | 18.00u | +11.45u | +63.6% |
| gold, limits flat | 8 | 5-3 | 62.5% | 24.30u | +10.59u | +43.6% |
| steam, not gold | 135 | 74-61 | 54.8% | 423.15u | +21.38u | +5.1% |
| limits↑, no steam | 11 | 5-6 | 45.5% | 28.90u | +1.60u | +5.5% |
| neither | 217 | 118-99 | 54.4% | 577.10u | +13.24u | +2.3% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 139 | 80-59 | 57.6% | 445.05u | +44.26u | +9.9% |
| A/B + no steam | 202 | 109-93 | 54.0% | 510.00u | +33.56u | +6.6% |
| A/B + steam arriving | 71 | 42-29 | 59.2% | 225.60u | +29.68u | +13.2% |
| A/B + gold | 12 | 8-4 | 66.7% | 33.90u | +16.29u | +48.1% |
| steam at lock, no A/B | 10 | 4-6 | 40.0% | 20.40u | -0.84u | -4.1% |
| Source B + steam arriving | 67 | 39-28 | 58.2% | 212.20u | +25.89u | +12.2% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| CFB   | 5n · 60.0% · -5.5%     | 7n · 57.1% · +6.3%     | 5n · 20.0% · -65.3%    | 17n · 47.1% · -14.1%   |
| MLB   | 440n · 54.5% · +7.6%   | 102n · 53.9% · -1.2%   | 347n · 51.3% · +2.1%   | 889n · 53.2% · +4.3%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 15n · 53.3% · -6.4%    | 8n · 62.5% · -3.1%     | 6n · 66.7% · +32.1%    | 29n · 58.6% · +4.8%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 56n · 66.1% · +13.5%   | —                      | —                      | 56n · 66.1% · +13.5%   |
| UFC   | 39n · 74.4% · +17.3%   | —                      | —                      | 39n · 74.4% · +17.3%   |
| WNBA  | 29n · 75.9% · +9.6%    | 20n · 40.0% · -2.3%    | 15n · 46.7% · -10.3%   | 64n · 57.8% · +1.8%    |
| **All** | **591n · 57.7% · +8.7%** | **141n · 53.2% · +0.7%** | **378n · 51.1% · +1.8%** | **1110n · 54.9% · +5.2%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **2199** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 2199 |
| Muted W-L                           |            1087-1112 |
| Muted Win %                         |                49.4% |
| Counterfactual PnL at flat 1u       |              -102.28 |
| Counterfactual ROI at flat 1u       |                -4.7% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-102.28u** at a flat 1u stake — a counterfactual ROI of **-4.7%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
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
| 2026-09-20 | MLB   | TOTAL  | Over 7.5                |  +117 | +0.802 | CONFIRMED-Q1 |   3/1 |   1/1 |  50.9 |   57.6 |   -0.1 | -0.11 | HOLD     | 3.00u | WIN     |      +3.51 |
| 2026-09-20 | NFL   | TOTAL  | Over 46.5               |  -100 | +0.579 | CONFIRMED-Q1 |  13/7 |   4/4 |  55.2 |   58.9 |   +6.6 | -0.23 | HOLD     | 3.00u | WIN     |      +3.00 |
| 2026-09-20 | NFL   | TOTAL  | Under 47.5              |  -111 | +0.172 | CONFIRMED-Q1 |  8/16 |   2/3 |  60.1 |   58.9 |  +12.2 |  1.60 | HOLD     | 4.00u | WIN     |      +3.51 |
| 2026-09-19 | CFB   | ML     | Northwestern            |  -175 | +0.934 | MINI-    |   3/5 |   2/1 |  70.2 |   44.4 |  +29.2 |  3.32 | BOOST    | 5.40u | WIN     |      +3.09 |
| 2026-09-19 | CFB   | ML     | University at Albany    |  +113 | +0.996 | CONFIRMED-Q1 |   1/1 |   1/0 |  43.4 |   59.5 |   -6.6 |  0.11 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-19 | MLB   | ML     | Baltimore Orioles       |  -108 | +0.574 | SHARP    |   1/2 |   1/1 |  56.8 |   71.1 |   +8.6 |  2.54 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-19 | MLB   | ML     | Colorado Rockies        |  +130 | +0.983 | MINI-    |   4/2 |   3/0 |  54.0 |   64.4 |   +6.4 |  1.09 | HOLD     | 4.00u | WIN     |      +5.20 |
| 2026-09-19 | MLB   | ML     | Washington Nationals    |  -104 | +0.517 | CONFIRMED-Q1 |   3/2 |   2/1 |  55.4 |   55.1 |   +7.2 | -0.14 | HOLD     | 2.00u | WIN     |      +1.92 |
| 2026-09-19 | UFC   | ML     | Dooho Choi              |  -242 | +0.957 | MINI     |   7/0 |   5/0 |  57.4 |   55.0 |   +7.4 |  0.42 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-19 | UFC   | ML     | Casey O'Neill           |  -225 | +0.858 | CONFIRMED-UNOPP |   1/1 |   1/0 |     — |      — |      — |     — | FAIL_OPEN | 2.00u | WIN     |      +0.89 |
| 2026-09-19 | UFC   | ML     | Arman Tsarukyan         |  -265 | +0.034 | CONFIRMED-Q1 |  10/5 |   3/4 |  52.4 |   58.6 |   +3.6 |  1.78 | HOLD     | 3.00u | WIN     |      +1.13 |
| 2026-09-19 | UFC   | ML     | JooSang Yoo             |  -170 | +0.982 | MINI-    |   6/0 |   6/0 |  59.3 |   56.4 |   +9.3 |  0.03 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-19 | CFB   | SPREAD | Mississippi State       |  -102 | +0.991 | MINI     |   2/0 |   2/0 |  67.4 |   41.5 |  +17.4 |  0.40 | HOLD     | 4.00u | WIN     |      +3.92 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.534 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.069 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.067 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.027 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.020 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return | 1105 |    +0.0138 |    +0.0054 | 0.0000 |  +0.004 |   0.950 | positive (higher score ⇒ better outcome)                 |
| won (binary)        | 1105 |    +0.0376 |    +0.5181 | 0.0004 |  +0.020 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    | 1105 |    -0.2366 |    +0.3345 | 0.0005 |  -0.022 |   2.874 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 1105 |          +0.070 |           +0.103 |                   +0.041 |                   +0.055 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 1105 |          +0.011 |           +0.331 |                   +0.025 |                   +0.134 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 1105 |          +0.023 |           +0.235 |                   +0.002 |                   +0.074 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 1105 |          -0.003 |           +0.202 |                   +0.021 |                   +0.113 | count of contributing AGAINST-side wallets                     |
| provenFor         | 1105 |          +0.016 |           +0.227 |                   +0.007 |                   +0.099 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 1105 |          -0.002 |           +0.187 |                   +0.017 |                   +0.094 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.334         | 369 | 195-174 |   52.8% |     -0.5% |
| MID (p33–p67)     | 19.950 … 16.235        | 368 | 199-169 |   54.1% |     +0.2% |
| HIGH (> p67)      | 48.906 … 43.563        | 368 | 212-156 |   57.6% |     +1.6% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |      1105 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8059 | average score across live picks                                 |
| SD                |    0.2707 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.545 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +1.107 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.319 / +0.953 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.000 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| CFB   |   17 | 8-9    |   47.1% |    -14.1% |  0.625 |        +0.275 | strong (N<20)                             |
| MLB   |  885 | 471-414 |   53.2% |     +4.2% |  0.523 |        -0.120 | noise                                     |
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
    x-axis ["09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.588, 0.597, 0.613, 0.53, 0.494, 0.453, 0.435, 0.417, 0.431, 0.442, 0.479, 0.44, 0.461, 0.486]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21"]
    y-axis "edge (pp)" -10 --> 15
    line [13.5, 10.9, 2.8, 0, 1.5, 0.5, -1, -2, -6.4, -5.5, -4.7, -8.3, -8.1, -6.1]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-09-08 |    7 |   50 | 33-17  |   66.0% |    +27.1% |  0.588 |     +13.5pp |
| 2026-09-09 |    7 |   50 | 32-18  |   64.0% |    +22.9% |  0.597 |     +10.9pp |
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

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.527 avg in first half → 0.527 avg in second half · Δ = +0.000)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.2% | [-1.1%, +11.2%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.9% | [51.9%, 57.8%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.534 | [0.501, 0.566]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |            108 | [43, 173]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                      1110 |
| Unique wallets ever on a FOR side            |                                                       343 |
| Avg FOR-side wallets per pick                |                                                      3.08 |
| Top-5 wallets' share of all FOR appearances  |                                                     20.1% |
| Top-10 wallets' share of all FOR appearances |                                                     33.1% |
| Top-20 wallets' share of all FOR appearances |                                                     48.7% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4b912c  | CFB,MLB,NFL,SOC,WNBA |  208 |  106 | 107-101 |   51.4% |     +3.1% |    +16.02 |     1.46× | CONFIRMED   |     -5.8% |     875 | 2026-09-21 |
|    2 | 0cd77e  | MLB,SOC,UFC,WNBA |  158 |   26 | 87-71  |   55.1% |    +14.3% |    +63.44 |     1.59× | CONFIRMED   |     -4.8% |     420 | 2026-09-19 |
|    3 | cd2f63  | CFB,MLB,NBA,NFL,SOC,WNBA |  113 |   66 | 63-50  |   55.8% |    +15.1% |    +48.98 |     1.16× | CONFIRMED   |     +5.2% |     775 | 2026-09-21 |
|    4 | eeabaf  | CFB,MLB,NBA,NFL,SOC,UFC |  107 |   73 | 52-55  |   48.6% |     +0.3% |     +0.94 |     1.19× | CONFIRMED   |     +0.7% |     569 | 2026-09-20 |
|    5 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  103 |   65 | 66-37  |   64.1% |    +17.3% |    +59.67 |     1.54× | CONFIRMED   |     +7.9% |     350 | 2026-09-11 |
|    6 | 0f9d74  | CFB,MLB,NBA,NFL,SOC,UFC |   96 |   73 | 53-43  |   55.2% |    +11.2% |    +27.22 |     0.54× | CONFIRMED   |     +7.5% |     513 | 2026-09-20 |
|    7 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    8 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     336 | 2026-08-05 |
|    9 | 2f2a9e  | MLB,NFL,SOC,WNBA |   85 |   32 | 45-40  |   52.9% |     -5.3% |    -12.05 |     1.97× | CONFIRMED   |     -8.4% |     305 | 2026-09-20 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   69 |   71 | 33-36  |   47.8% |     -3.8% |     -7.25 |     3.27× | CONFIRMED   |     -2.6% |     445 | 2026-09-20 |
|   12 | 7923c4  | MLB,NBA,UFC |   63 |   17 | 39-24  |   61.9% |    +29.6% |    +47.42 |     0.93× | CONFIRMED   |     +8.5% |     252 | 2026-09-20 |
|   13 | 705ba1  | MLB        |   62 |   45 | 30-32  |   48.4% |     -2.9% |     -5.00 |     1.10× | FLAT        |     +2.2% |     333 | 2026-09-20 |
|   14 | 9214c2  | MLB        |   58 |   12 | 27-31  |   46.6% |     -2.5% |     -4.04 |     1.15× | CONFIRMED   |     +6.1% |     197 | 2026-09-21 |
|   15 | 69f882  | MLB,NFL,SOC,UFC,WNBA |   56 |   33 | 35-21  |   62.5% |    +10.7% |    +17.30 |     2.31× | CONFIRMED   |     +6.9% |     247 | 2026-09-20 |
|   16 | bc35e3  | CFB,MLB,NFL,SOC,UFC,WNBA |   52 |   28 | 24-28  |   46.2% |     -1.7% |     -2.52 |     1.13× | CONFIRMED   |     -6.7% |     249 | 2026-09-20 |
|   17 | 3bdd7e  | CFB,MLB,NFL,SOC,WNBA |   50 |   21 | 31-19  |   62.0% |    +17.0% |    +17.13 |     2.74× | CONFIRMED   |    -10.0% |     208 | 2026-09-09 |
|   18 | 621848  | MLB,SOC,UFC,WNBA |   43 |   14 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +6.6% |     132 | 2026-09-19 |
|   19 | 51176e  | MLB,NFL    |   43 |    5 | 26-17  |   60.5% |    +11.0% |    +17.32 |     0.99× | CONFIRMED   |     +9.5% |     101 | 2026-09-21 |
|   20 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 |   23 | 20-17  |   54.1% |     -1.6% |     -1.88 |     1.36× | CONFIRMED   |    +11.8% |     148 | 2026-09-02 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 06c80c  | MLB,NFL,SOC |   11 | 10-1   |   90.9% |     +74.7% |    +29.51 |     1.65× | 2026-09-21 |
|    2 | d66e28  | CFB,MLB,NFL,WNBA |   20 | 16-4   |   80.0% |     +62.5% |    +31.46 |     0.70× | 2026-09-21 |
|    3 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    4 | 2dc4f6  | CFB,MLB,NFL,WNBA |   15 | 10-5   |   66.7% |     +46.0% |    +16.29 |     0.61× | 2026-09-21 |
|    5 | ba8492  | CFB,MLB,NFL |   19 | 13-6   |   68.4% |     +44.1% |    +26.39 |     1.62× | 2026-09-20 |
|    6 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    7 | 199296  | MLB        |   10 | 7-3    |   70.0% |     +43.0% |    +16.71 |     2.76× | 2026-09-15 |
|    8 | 718cd6  | MLB,NFL,SOC,UFC |   10 | 7-3    |   70.0% |     +40.0% |     +9.61 |     1.29× | 2026-09-09 |
|    9 | 62941a  | CFB,MLB,NFL,WNBA |   19 | 13-6   |   68.4% |     +38.8% |    +23.02 |     0.93× | 2026-09-21 |
|   10 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|   11 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|   12 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   13 | 7923c4  | MLB,NBA,UFC |   63 | 39-24  |   61.9% |     +29.6% |    +47.42 |     0.93× | 2026-09-20 |
|   14 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   15 | 4c8ed9  | CFB,MLB,NFL,SOC,UFC,WNBA |   26 | 15-11  |   57.7% |     +27.9% |    +14.71 |     2.92× | 2026-09-21 |

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
|   10 | 8e6753  | CFB,MLB,NFL |   21 | 9-12   |   42.9% |     -11.0% |     -5.26 |     0.88× | 2026-09-21 |
|   11 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|   12 | 2f2a9e  | MLB,NFL,SOC,WNBA |   85 | 45-40  |   52.9% |      -5.3% |    -12.05 |     1.97× | 2026-09-20 |
|   13 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   69 | 33-36  |   47.8% |      -3.8% |     -7.25 |     3.27× | 2026-09-20 |
|   14 | fb3150  | MLB,NFL,SOC |   16 | 9-7    |   56.3% |      -3.8% |     -1.15 |     1.12× | 2026-09-15 |
|   15 | 705ba1  | MLB        |   62 | 30-32  |   48.4% |      -2.9% |     -5.00 |     1.10× | 2026-09-20 |

> 🔴 **2 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 85, ROI -5.3%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  3136 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   864 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     3 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |   126 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   388 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            355 |        96 |   36 |   29 |  194 |                    161 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            376 |       102 |   53 |   25 |  196 |                    180 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |  114 |   1110 | 2199 | 609-501 |  54.9% |      5.2% |    +161.74 |    +0.15 | 0.514 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | + 1050 |    +1.5pp |    +14.2pp |          +0.319 |   -0.035 |    +0.0902 | 🟡 mixed |
| v12 − v10          | + 1048 |    +6.5pp |    +24.0pp |          +0.459 |   +0.120 |    +0.0305 | 🟢 better |
| v12 − v11          | +  999 |    -0.1pp |     +2.4pp |          +0.085 |   +0.070 |    +0.0144 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | CFB            | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | —              | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | —              | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | —              | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 17n 47.1% -14% | 889n 53.2% +4% | 10n 30.0% +29% | 29n 58.6% +5%  | 6n 83.3% +38%  | 56n 66.1% +14% | 39n 74.4% +17% | 64n 57.8% +2%  | 1110n 54.9% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 208n +9%      | 277n +2%      | 226n +7%      | 149n -6%      | 244n +10%     | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~3591 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1344 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 1105 / 1344 (82%) | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 1105 / 1344 (82%) | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 1105 / 1344 (82%) | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 1105 / 1344 (82%) | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 1105 / 1344 (82%) | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 1105 / 1344 (82%) | Count of proven AGAINST-side wallets                                 |
| countMargin          | 1105 / 1344 (82%) | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1344 / 1344 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1344 / 1344 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1344 / 1344 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1344 / 1344 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1344 / 1344 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1344 / 1344 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1337 / 1344 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1332 / 1344 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1344 / 1344 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1343 / 1344 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 871 / 1344 (65%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1343 / 1344 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 871 / 1344 (65%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 870 / 1344 (65%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1344 / 1344 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1344 / 1344 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1344 / 1344 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1343 / 1344 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1344 / 1344 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 871 |      |    +0.025 |    +0.268 |      +0.048 |      +0.136 |  0.511 |
|    2 | wd sizeMargin        | 870 |      |    -0.023 |    -0.027 |      -0.047 |      -0.065 |  0.489 |
|    3 | V12 forMean          | 1105 |  🟢  |    +0.070 |    +0.103 |      +0.041 |      +0.055 |  0.528 |
|    4 | wd agAvgSize         | 871 |      |    +0.020 |    +0.028 |      +0.039 |      +0.046 |  0.510 |
|    5 | wd contribMargin     | 1344 |      |    -0.009 |    -0.074 |      -0.035 |      -0.073 |  0.483 |
|    6 | qMargin              | 1105 |  🟢  |    +0.070 |    +0.024 |      +0.035 |      +0.012 |  0.519 |
|    7 | wd maxForContrib     | 1343 |      |    -0.034 |    -0.062 |      -0.030 |      -0.032 |  0.492 |
|    8 | lockPinnProb         | 1337 |      |    +0.194 |    +0.159 |      +0.029 |      -0.125 |  0.599 |
|    9 | hcMargin             | 1344 |      |    +0.001 |    +0.206 |      -0.027 |      +0.060 |  0.510 |
|   10 | V12 agMean           | 1105 |  🟢  |    +0.011 |    +0.331 |      +0.025 |      +0.134 |  0.475 |
|   11 | clv                  | 1332 |      |    -0.025 |    +0.080 |      -0.025 |      +0.027 |  0.515 |
|   12 | V12 agCount          | 1105 |  🟢  |    -0.003 |    +0.202 |      +0.021 |      +0.113 |  0.501 |
|   13 | ags (v11)            | 1344 |      |    +0.003 |    +0.043 |      -0.021 |      -0.024 |  0.510 |
|   14 | wd contribFor        | 1344 |      |    -0.010 |    +0.002 |      -0.019 |      -0.018 |  0.487 |
|   15 | wd contribAg         | 1344 |      |    -0.002 |    +0.139 |      +0.018 |      +0.065 |  0.490 |
|   16 | wd maxShare          | 1344 |      |    +0.023 |    -0.093 |      +0.017 |      -0.031 |  0.511 |
|   17 | provenMargin         | 1344 |      |    +0.003 |    +0.098 |      -0.017 |      +0.011 |  0.500 |
|   18 | wd forAvgSize        | 1343 |      |    +0.003 |    +0.057 |      -0.014 |      +0.003 |  0.515 |
|   19 | provenFor            | 1344 |      |    -0.006 |    +0.134 |      -0.013 |      +0.032 |  0.495 |
|   20 | countMargin          | 1105 |      |    +0.026 |    +0.122 |      -0.012 |      +0.007 |  0.503 |
|   21 | wd forCount          | 1343 |      |    +0.007 |    +0.179 |      -0.008 |      +0.040 |  0.493 |
|   22 | peakStars            | 1344 |      |    +0.028 |    +0.021 |      +0.008 |      -0.018 |  0.513 |
|   23 | provenTotal          | 1344 |      |    -0.011 |    +0.105 |      -0.008 |      +0.038 |  0.491 |
|   24 | agsV12               | 1105 |  🟢  |    +0.020 |    -0.067 |      +0.004 |      -0.027 |  0.534 |
|   25 | provenAg             | 1344 |      |    -0.014 |    +0.190 |      +0.003 |      +0.087 |  0.487 |
|   26 | V12 forCount         | 1105 |  🟢  |    +0.023 |    +0.235 |      +0.002 |      +0.074 |  0.507 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.048), `wd sizeMargin` (r = -0.047), `V12 forMean` (r = +0.041).

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.048 · AUC = 0.511

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 385 | 205-180 |   53.2% |     -0.6% |
| MID (p33–p67)     | 2.000 … 2.000            | 208 | 110-98  |   52.9% |     -0.4% |
| HIGH (> p67)      | 3.000 … 3.000            | 278 | 155-123 |   55.8% |     +1.8% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd sizeMargin` · r(unit-ret) = -0.047 · AUC = 0.489

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -1.616          | 290 | 163-127 |   56.2% |     +2.4% |
| MID (p33–p67)     | 0.078 … 0.140            | 290 | 152-138 |   52.4% |     +0.6% |
| HIGH (> p67)      | 3.728 … 0.838            | 290 | 155-135 |   53.4% |     -2.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.041 · AUC = 0.528

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.334           | 369 | 195-174 |   52.8% |     -0.5% |
| MID (p33–p67)     | 19.950 … 16.235          | 368 | 199-169 |   54.1% |     +0.2% |
| HIGH (> p67)      | 48.906 … 43.563          | 368 | 212-156 |   57.6% |     +1.6% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd agAvgSize` · r(unit-ret) = +0.039 · AUC = 0.510

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.110 … 0.450            | 291 | 152-139 |   52.2% |     -2.3% |
| MID (p33–p67)     | 0.699 … 0.617            | 290 | 157-133 |   54.1% |     +0.3% |
| HIGH (> p67)      | 6.557 … 2.310            | 290 | 161-129 |   55.5% |     +2.5% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `wd contribMargin` · r(unit-ret) = -0.035 · AUC = 0.483

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -123.050       | 448 | 254-194 |   56.7% |     +2.3% |
| MID (p33–p67)     | 57.800 … 52.588          | 448 | 245-203 |   54.7% |     +0.7% |
| HIGH (> p67)      | 174.100 … 122.500        | 448 | 234-214 |   52.2% |     -1.8% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | wd sizeMargin  | V12 forMean    | wd agAvgSize   | wd contribMargin | qMargin        | wd maxForContrib | lockPinnProb   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         +0.034 |         +0.093 |         +0.083 |         -0.166 |         -0.030 |         +0.261 |         -0.079 |
| wd sizeMargin |         +0.034 |  1.000         |         +0.170 |         -0.683 |         +0.234 |         +0.162 |         +0.226 |         +0.126 |
| V12 forMean |         +0.093 |         +0.170 |  1.000         |         -0.026 |         +0.058 |         +0.937 |         +0.176 |         +0.088 |
| wd agAvgSize |         +0.083 |         -0.683 |         -0.026 |  1.000         |         -0.139 |         -0.045 |         +0.058 |         -0.086 |
| wd contribMargin |         -0.166 |         +0.234 |         +0.058 |         -0.139 |  1.000         |         +0.048 |         +0.496 |         +0.191 |
| qMargin     |         -0.030 |         +0.162 |         +0.937 |         -0.045 |         +0.048 |  1.000         |         +0.132 |         +0.099 |
| wd maxForContrib |         +0.261 |         +0.226 |         +0.176 |         +0.058 |         +0.496 |         +0.132 |  1.000         |         +0.049 |
| lockPinnProb |         -0.079 |         +0.126 |         +0.088 |         -0.086 |         +0.191 |         +0.099 |         +0.049 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.937. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 750 picks · features = 8 (+ intercept) · multiple R² = **0.0094** · adjusted R² = **-0.0026** · residual sd = 0.956

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | V12 forMean          |  🟢 |    +0.0616 |   0.1076 | +0.57        |        1 |
|    2 | wd agCount           |     |    +0.0394 |   0.0411 | +0.96        |        2 |
|    3 | wd sizeMargin        |     |    -0.0391 |   0.0521 | -0.75        |        3 |
|    4 | wd contribMargin     |     |    -0.0302 |   0.0445 | -0.68        |        4 |
|    5 | lockPinnProb         |     |    +0.0232 |   0.0360 | +0.65        |        5 |
|    6 | wd agAvgSize         |     |    +0.0216 |   0.0508 | +0.43        |        6 |
|    7 | qMargin              |  🟢 |    -0.0165 |   0.1070 | -0.15        |        7 |
|    8 | wd maxForContrib     |     |    +0.0082 |   0.0465 | +0.18        |        8 |
| —    | (intercept)          |     |    +0.0199 |   0.0349 |    +0.57 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.062), `qMargin` (β = -0.016)
- V12 IGNORES: `wd agCount` (β = +0.039, t = +0.96), `wd sizeMargin` (β = -0.039, t = -0.75), `wd contribMargin` (β = -0.030, t = -0.68), `lockPinnProb` (β = +0.023, t = +0.65), `wd agAvgSize` (β = +0.022, t = +0.43), `wd maxForContrib` (β = +0.008, t = +0.18)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.531 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.574 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟡 **AUC gap = +0.043.** The multivariate combination of currently-stamped features achieves materially better discrimination than V12's single score. Adding the top non-V12 features into the model could lift AUC by ~4.3pp.

### 17G — Actionable recommendations

- Adjusted R² of -0.0026 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*