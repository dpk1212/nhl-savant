# AGS-Unified — V12 Daily Monitor

**Generated:** Tuesday, August 18, 2026 at 5:43 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (79 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (79 days ago), V12 has evaluated **2159** picks, shipped **707** for real money (32.7% ship rate), and muted the other **1452**. On the shipped picks V12 has gone **388-319** (54.9% win), staked **1979.60u**, and returned **+97.52u** at **+4.9% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             79 |
| Picks V12 has evaluated             |                           2159 |
| Picks SHIPPED (units > 0)           |                            707 |
| Picks MUTED (score ≤ 0, FADE)       |                           1452 |
| Ship rate                           |                          32.7% |
| Live W-L                            |                        388-319 |
| Live Win %                          |                          54.9% |
| Live PnL (units)                    |                         +97.52 |
| Live ROI                            |                          +4.9% |
| Avg PnL / day                       |                         +1.23u |
| Most recent action (2026-08-18)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.9% ROI** across 707 live picks (+97.52u real PnL).
- Mute rule is **saving money** — the 974 muted picks would have lost -60.28u at flat 1u (-6.2% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.23u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **152-126** · +6.3% ROI · +50.91u on 278 graded — see § 5.

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

**Full book:** 79d · 707 live · 388-319 · **+97.52u** · +4.9% ROI · +1.23u/day.

_Prior to table (2026-06-01 → 2026-07-28): 537 live · 297-240 · +57.39u · cum through prior = +57.39u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-07-29 |        18 |    7 |    10 | 6-1        |  85.7% |     17.08 |      +9.32 |     54.6% |     +66.71 |
| 2026-07-30 |        16 |    5 |    10 | 3-2        |  60.0% |     17.50 |      +0.10 |      0.6% |     +66.81 |
| 2026-07-31 |        16 |    0 |    15 | 0-0        |      — |      0.00 |      +0.00 |         — |     +66.81 |
| 2026-08-01 |        39 |   18 |    18 | 13-5       |  72.2% |     69.10 |     +18.21 |     26.4% |     +85.02 |
| 2026-08-02 |        31 |    7 |    20 | 2-5        |  28.6% |     25.63 |     -10.18 |    -39.7% |     +74.84 |
| 2026-08-03 |        21 |    4 |    11 | 4-0        | 100.0% |     13.06 |     +13.45 |    103.0% |     +88.29 |
| 2026-08-04 |        32 |   10 |    16 | 4-6        |  40.0% |     36.81 |     -11.57 |    -31.4% |     +76.72 |
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
| 2026-08-18 |        10 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +97.52 |

> **Trajectory.** 🟢 Last 3 days (15.1% ROI) **+10.5pp** vs prior (4.6%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-17**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 13 | 10-3 | +45.3% | +27.88u | +2.14u | — |
| 🟢 2 | MINI- (gate-cut) | C | 18 | 11-7 | +18.2% | +4.27u | +0.24u | -9.7% |
| 🟢 3 | RANK 2-for-0 rescue | B | 75 | 43-32 | +12.8% | +35.63u | +0.48u | -33.4% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 74 | 48-26 | +19.7% | +65.21u | sized UP after path |
| 2 | Tape HOLD (mid) | 177 | 91-86 | -0.6% | -2.32u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 24 | 11-13 | -27.7% | -14.26u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 3 | 1-2 | -33.3% | -1.00u | 🟢 saving $ |
| 2 | Score FADE (≤0 → 0u) | 569 | 279-290 | -3.4% | -19.47u | 🟢 saving $ |
| 3 | Tape MUTE (tape<0 → 0u) | 42 | 22-20 | +5.7% | +2.40u | 🔴 costing $ |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 13 | 10-3 | 76.9% | 61.5u | +27.88u | +45.3% | +2.14u | 0 | — | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 85 | 51-34 | 60.0% | 311.2u | +20.71u | +6.7% | +0.24u | 15 | -4.4% | — | 🟢 OK |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 75 | 43-32 | 57.3% | 277.5u | +35.63u | +12.8% | +0.48u | 6 | -33.4% | -6.00u | 🔻 cooling |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 65 | 30-35 | 46.2% | 201.6u | -15.79u | -7.8% | -0.24u | 7 | -3.5% | -3.50u | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 75 | 39-36 | 52.0% | 207.9u | +5.81u | +2.8% | +0.08u | 17 | +41.5% | +6.32u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 67 | 38-29 | 56.7% | 188.9u | +8.50u | +4.5% | +0.13u | 15 | +34.0% | +4.29u | 🟡 flat |
| MINI- (gate-cut) | `MINI-` | C | 1u | 18 | 11-7 | 61.1% | 23.5u | +4.27u | +18.2% | +0.24u | 6 | -9.7% | — | 🔻 cooling |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 20 | 11-9 | 55.0% | 20.4u | +1.80u | +8.8% | +0.09u | 6 | -29.7% | -1.00u | 🔻 cooling |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 74 | 48-26 | 64.9% | 330.3u | +65.21u | +19.7% | 21 | +33.5% | +10.37u |
| Tape HOLD (mid) | TAPE | staked | 177 | 91-86 | 51.4% | 412.1u | -2.32u | -0.6% | 57 | +6.0% | -1.55u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 24 | 11-13 | 45.8% | 51.5u | -14.26u | -27.7% | 11 | -70.6% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 42 | 22-20 | 52.4% | 42.0u | +2.40u | +5.7% | 14 | -6.4% | — |
| fadeTop≥60 MUTE | E | CF 1u | 3 | 1-2 | 33.3% | 3.0u | -1.00u | -33.3% | 2 | +0.0% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 569 | 279-290 | 49.0% | 569.0u | -19.47u | -3.4% | 47 | +4.6% | +1.61u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| TOP | 27 / -7% | 14 / +17% | 4 / -16% |
| RANK | 31 / +6% | 5 / +46% | — |
| SHARP | 14 / -13% | 25 / -1% | 1 / -100% |
| SHARP-LEAN | 54 / -6% | 18 / +18% | 3 / -30% |
| MINI | 19 / -2% | 7 / +51% | 4 / +1% |
| MINI- | 4 / -11% | 1 / +45% | 3 / -5% |
| DISSENT | 13 / +19% | 1 / +91% | 5 / -17% |

### (D) Last graded day movers (2026-08-17)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| SHARP-LEAN EDGE/net ONE | 1 | 1-0 | +6.32u | +117.0% |
| MINI (gate-pass) | 2 | 1-1 | +4.29u | +67.0% |
| DISSENT rescue | 1 | 0-1 | -1.00u | -100.0% |
| SHARP EDGE/net BOTH | 2 | 0-2 | -3.50u | -100.0% |
| RANK 2-for-0 rescue | 2 | 0-2 | -6.00u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| TOP PICK (TOP+/TOP)       |  4-5u | 151 | 66-48  |  57.9% |      443.70 |      +8.77 |      2.0% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 357 | 118-111 |  51.5% |      735.95 |     +19.04 |      2.6% |
| STRONG (MINI)             |    3u |  80 | 38-29  |  56.7% |      188.85 |      +8.50 |      4.5% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  66 | 24-19  |  55.8% |       48.85 |      +4.05 |      8.3% |
| **STAKED TOTAL** |     — | 466 | 256-210 |  54.9% |     1478.85 |     +68.24 |     +4.6% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 122 | 51-34  |  60.0% |      311.20 |     +20.71 |      6.7% |
| B · 2-for-0 rescue    | RANK        |    4u |  94 | 43-32  |  57.3% |      277.45 |     +35.63 |     12.8% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 168 | 39-36  |  52.0% |      207.94 |      +5.81 |      2.8% |
| C · proven-$ consensus | SHARP       |    3u |  81 | 30-35  |  46.2% |      201.56 |     -15.79 |     -7.8% |
| A · mini-HC (gate-pass) | MINI        |    3u |  80 | 38-29  |  56.7% |      188.85 |      +8.50 |      4.5% |
| C · mini gate-cut     | MINI-       |    1u |  21 | 11-7   |  61.1% |       23.50 |      +4.27 |     18.2% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  39 | 11-9   |  55.0% |       20.35 |      +1.80 |      8.8% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 493 picks tracked at 0u (would-be 234-259, 47.5% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (10-3, +27.88u)  ·  🟢 TOP PICK (84-67, +8.77u)  ·  🟠 SHARP PLAY (181-176, +19.04u)  ·  🔴 STRONG (47-33, +8.50u)  ·  🟣 LEAN (34-32, +4.05u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17"]
    y-axis "PnL (u)" -14 --> 31
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 847 | 841 | 818 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 42 | 22-20 | 52.4% | 0.00u | +0.00u | — |
| HOLD      | 215 | 107-108 | 49.8% | 415.07u | -5.32u | -1.3% |
| BOOST     | 83 | 54-29 | 65.1% | 333.78u | +67.29u | +20.2% |
| FAIL_OPEN | 25 | 11-14 | 44.0% | 51.50u | -14.26u | -27.7% |
| PASS      | 453 | 229-224 | 50.6% | 7.00u | -1.12u | -16.0% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 235 | 119-116 | 50.6% | -4.87u |
| hold (0–2.89) | path u | 371 | 183-188 | 49.3% | +3.93u |
| boost (≥2.89) | ×1.35 | 101 | 63-38 | 62.4% | +61.64u |

_Score coverage: **707/818** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 42 | +13.38u | -13.38u | +23.75u | +37.13u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 76 | +47.50u | +67.29u | +19.79u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-18 | MLB | Boston Red Sox | SHARP~ | -1.66 | MUTE | 1.00u | 0.00u | — |
| 2026-08-18 | MLB | Los Angeles Angels | SHARP~ | 3.20 | BOOST | 1.00u | 1.00u | — |
| 2026-08-18 | MLB | New York Yankees | HC-1 | 4.64 | BOOST | 1.00u | 1.00u | — |
| 2026-08-18 | MLB | Milwaukee Brewers | SHARP~ | 3.20 | BOOST | 1.00u | 1.00u | — |
| 2026-08-18 | WNBA | Los Angeles Sparks | SHARP~ | 5.77 | BOOST | 4.00u | 5.40u | — |
| 2026-08-17 | MLB | Arizona Diamondbacks | SHARP | 7.25 | BOOST | 2.50u | 2.50u | LOSS |
| 2026-08-17 | MLB | Minnesota Twins | CONFIRMED-Q1 | 6.74 | BOOST | 2.00u | 4.00u | WIN |
| 2026-08-17 | MLB | Miami Marlins | SHARP | 5.37 | BOOST | 1.00u | 1.00u | LOSS |
| 2026-08-17 | MLB | Athletics | CONFIRMED-Q1 | 4.56 | BOOST | 1.00u | 1.50u | LOSS |
| 2026-08-17 | MLB | San Diego Padres | SHARP | 5.36 | BOOST | 4.00u | 0.00u | LOSS |
| 2026-08-17 | WNBA | Dallas Wings | 2-for-0 | 10.28 | BOOST | 1.00u | 1.00u | LOSS |
| 2026-08-17 | MLB | Over 8.5 | SHARP~ | 3.01 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-17 | MLB | Over 8.5 | MINI | 4.04 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-16 | MLB | Tampa Bay Rays | MINI | -0.20 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-16 | MLB | Boston Red Sox | PATH-D | -1.13 | MUTE | 1.00u | 0.00u | LOSS |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.46** · nPriors=447 · source=expanding_q1 · asOf=2026-08-18 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 401 | 331 | 319 | 75 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 25 | 11-14 | 44.0% | 1.00u | -1.00u | -100.0% |
| HOLD      | 111 | 59-52 | 53.2% | 139.40u | +22.72u | +16.3% |
| FAIL_OPEN | 10 | 5-5 | 50.0% | 14.90u | -5.03u | -33.8% |
| EXEMPT    | 72 | 35-37 | 48.6% | 128.90u | +4.11u | +3.2% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -25.0 … 0.0 | 14 | 5-9 | 35.7% | 3.5u | -0.35u | -10.0% |
| Q2 | 0.3 … 3.2 | 15 | 7-8 | 46.7% | 22.3u | +12.65u | +56.7% |
| Q3 | 3.2 … 7.5 | 14 | 9-5 | 64.3% | 22.7u | +4.47u | +19.7% |
| Q4 | 8.6 … 14.4 | 15 | 6-9 | 40.0% | 33.1u | -2.62u | -7.9% |
| Q5 | 14.9 … 1802.6 | 15 | 8-7 | 53.3% | 20.3u | +6.13u | +30.2% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 25 | 11-14 | -3.33u | +3.33u | +16.50u | +13.17u |

> 🟡 **Mute roughly break-even** (Δ +3.33u · muted WR 44.0%). Keep monitoring as N grows.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 4 | 3-1 | 75.0% | 6.0u | +2.60u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 8 | 1-7 | 12.5% | 8.5u | -6.12u |
| MLB | 16 | 7-9 | 43.8% | 20.5u | -2.84u |
| WNBA | 9 | 4-5 | 44.4% | 9.0u | -0.49u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-08-17 | MLB | Colorado Rockies | SHARP | -4.0 | -0.3 | 1.00u | LOSS |
| 2026-08-17 | MLB | Under 7.5 | SHARP~ | -9.9 | -0.3 | 1.00u | LOSS |
| 2026-08-16 | MLB | Detroit Tigers | CONFIRMED-UNOPP | -17.6 | -0.3 | 1.00u | LOSS |
| 2026-08-16 | MLB | Over 7.5 | WATCH | -5.4 | -0.3 | 1.00u | WIN |
| 2026-08-16 | MLB | Under 8.5 | SHARP~ | -9.9 | -0.3 | 1.50u | LOSS |
| 2026-08-15 | MLB | Chicago Cubs | SHARP | -0.6 | -0.6 | 1.00u | LOSS |
| 2026-08-15 | WNBA | Connecticut Sun | MINI | -13.0 | -0.6 | 1.00u | LOSS |
| 2026-08-15 | WNBA | Minnesota Lynx | CONFIRMED-UNOPP | -9.7 | -0.6 | 1.00u | WIN |
| 2026-08-15 | WNBA | New York Liberty | CONFIRMED-UNOPP | -23.3 | -0.6 | 1.00u | LOSS |
| 2026-08-15 | WNBA | Over 173.5 | — | 9.7 | -0.6 | 1.00u | LOSS |
| 2026-08-15 | WNBA | Under 169.5 | CONFIRMED-UNOPP | -9.7 | -0.6 | 1.00u | WIN |
| 2026-08-14 | WNBA | Portland Fire | MINI | -6.9 | -1.5 | 1.00u | WIN |
| 2026-08-14 | MLB | Under 8.5 | SHARP~ | -12.6 | -1.5 | 1.00u | LOSS |
| 2026-08-14 | WNBA | Over 187.5 | CONFIRMED-UNOPP | -3.0 | -1.5 | 1.00u | LOSS |
| 2026-08-14 | WNBA | Under 186.5 | — | 3.0 | -1.5 | 1.00u | WIN |
| 2026-08-14 | WNBA | Over 180.5 | PASS | -4.4 | -1.5 | 1.00u | LOSS |
| 2026-08-13 | MLB | Detroit Tigers | CONFIRMED-UNOPP | -13.3 | -1.8 | 1.00u | WIN |
| 2026-08-12 | MLB | Cleveland Guardians | — | -4.3 | -1.2 | 1.00u | WIN |
| 2026-08-11 | MLB | Tampa Bay Rays | HC-1 | -27.2 | -2.2 | 1.00u | WIN |
| 2026-08-08 | MLB | Kansas City Royals | SHARP~ | -9.3 | -1.4 | 1.00u | WIN |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 36 | 19-17 | 52.8% | 101.9u | +20.28u | +19.9% |
| Muted (Q1 → 0u) | 25 | 11-14 | 44.0% | 1.0u | -1.00u | -100.0% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 107–59 · 64.5% · +19.8%); **5–10 is the hole** (53–52 · 50.5% · -7.8%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 489 tickets · cov 466/489 (stamp 264 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 195 | 99–96 | 50.8% | -4.7% |
| 5–10 | 105 | 53–52 | 50.5% | -7.8% |
| ≥10 | 166 | 107–59 | 64.5% | +19.8% |
| All | 489 | 270–219 | 55.2% | +5.1% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.3% (87) | 56.9% (51) | 72.9% (70) |
| B | 53.8% (52) | 57.1% (7) | 68.8% (16) |
| C | 37.9% (29) | 44.2% (43) | 56% (75) |

##### Jul 15+ · 278 tickets · cov 261/278 (stamp 259 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 89 | 46–43 | 51.7% | +0.8% |
| 5–10 | 66 | 30–36 | 45.5% | -19.0% |
| ≥10 | 106 | 68–38 | 64.2% | +17.8% |
| All | 278 | 152–126 | 54.7% | +6.3% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 39.3% (28) | 54.5% (22) | 79.3% (29) |
| B | 53.8% (26) | 0% (2) | 66.7% (9) |
| C | 37.5% (8) | 44.7% (38) | 56.9% (65) |

##### Yesterday (Aug 17) · 13 tickets · cov 13/13 (stamp 13 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 7 | 4–3 | 57.1% | +46.3% |
| ≥10 | 6 | 2–4 | 33.3% | +10.4% |
| All | 13 | 6–7 | 46.2% | +25.3% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 0% (1) | — | 100% (1) |
| B | — | — | 0% (2) |
| C | — | — | 33.3% (3) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 489 tickets · cov 487/489 (stamp 276 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 317 | 173–144 | 54.6% | +2.1% |
| 5–10 | 84 | 47–37 | 56.0% | +15.4% |
| ≥10 | 86 | 49–37 | 57.0% | +7.0% |
| All | 489 | 270–219 | 55.2% | +5.1% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.4% (136) | 51.3% (39) | 70.7% (41) |
| B | 56.4% (55) | 70% (10) | 50% (10) |
| C | 47.9% (94) | 58.6% (29) | 41.9% (31) |

##### Jul 15+ · 278 tickets · cov 277/278 (stamp 276 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 167 | 95–72 | 56.9% | +8.6% |
| 5–10 | 61 | 34–27 | 55.7% | +18.6% |
| ≥10 | 49 | 22–27 | 44.9% | -14.7% |
| All | 278 | 152–126 | 54.7% | +6.3% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 66.7% (42) | 47.8% (23) | 55% (20) |
| B | 48.1% (27) | 83.3% (6) | 50% (4) |
| C | 52.2% (67) | 57.7% (26) | 36.4% (22) |

##### Yesterday (Aug 17) · 13 tickets · cov 13/13 (stamp 13 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 5 | 3–2 | 60.0% | +19.6% |
| 5–10 | 3 | 2–1 | 66.7% | +74.9% |
| ≥10 | 5 | 1–4 | 20.0% | -12.4% |
| All | 13 | 6–7 | 46.2% | +25.3% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | 50% (2) | — |
| B | 0% (1) | — | 0% (1) |
| C | 100% (1) | — | 0% (2) |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 489 tickets · cov 466/489 (stamp 258 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 80 | 34–46 | 42.5% | -25.6% |
| 0–2.89 | 263 | 142–121 | 54.0% | +6.4% |
| ≥2.89 | 123 | 83–40 | 67.5% | +22.6% |
| All | 489 | 270–219 | 55.2% | +5.1% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 57.8% (109) | 76.8% (56) |
| B | 54.5% (22) | 56.1% (41) | 66.7% (12) |
| C | 18.2% (11) | 48.3% (87) | 57.1% (49) |

##### Jul 15+ · 278 tickets · cov 261/278 (stamp 258 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 11 | 6–5 | 54.5% | -15.7% |
| 0–2.89 | 172 | 88–84 | 51.2% | +0.4% |
| ≥2.89 | 78 | 50–28 | 64.1% | +18.4% |
| All | 278 | 152–126 | 54.7% | +6.3% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 50% (52) | 76.9% (26) |
| B | 33.3% (6) | 57.7% (26) | 60% (5) |
| C | — | 48.5% (68) | 55.8% (43) |

##### Yesterday (Aug 17) · 13 tickets · cov 13/13 (stamp 13 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 2 | 2–0 | 100.0% | +67.5% |
| 0–2.89 | 4 | 1–3 | 25.0% | -42.5% |
| ≥2.89 | 7 | 3–4 | 42.9% | +49.9% |
| All | 13 | 6–7 | 46.2% | +25.3% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 0% (1) | 100% (1) |
| B | — | 0% (1) | 0% (1) |
| C | — | — | 33.3% (3) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 278 | 152-126 | 54.7% | 803.35u | +50.91u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 278/278 | 2.00 | 2.10 | -0.10 | 2.00 | 2.00 |
| depth   | #A sharps        | 278/278 | 1.36 | 1.37 | -0.01 | 1.00 | 1.00 |
| depth   | #F − #A          | 278/278 | 0.64 | 0.74 | -0.09 | 1.00 | 1.00 |
| depth   | proven F         | 278/278 | 1.35 | 1.43 | -0.08 | 1.00 | 1.00 |
| depth   | proven A         | 278/278 | 0.43 | 0.40 | +0.03 | 0.00 | 0.00 |
| depth   | proven F−A       | 278/278 | 0.91 | 1.02 | -0.11 | 1.00 | 1.00 |
| depth   | v12 F count      | 278/278 | 1.97 | 2.07 | -0.10 | 2.00 | 2.00 |
| depth   | v12 A count      | 278/278 | 1.43 | 1.40 | +0.03 | 1.00 | 1.00 |
| depth   | WA ForN          | 278/278 | 1.52 | 1.66 | -0.14 | 1.00 | 1.00 |
| depth   | WA AgN           | 278/278 | 1.09 | 1.13 | -0.05 | 1.00 | 1.00 |
| depth   | CLV ForN         | 277/278 | 1.90 | 1.98 | -0.08 | 2.00 | 2.00 |
| depth   | CLV AgN          | 277/278 | 1.37 | 1.34 | +0.03 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 278/278 | 0.39 | 0.40 | -0.01 | 0.00 | 0.00 |
| quality | ForWR            | 259/278 | 58.02 | 55.09 | +2.93 | 54.70 | 54.40 |
| quality | AgWR             | 158/278 | 44.00 | 44.32 | -0.32 | 44.45 | 45.70 |
| quality | TopFor WR        | 259/278 | 60.25 | 58.40 | +1.85 | 55.90 | 55.60 |
| quality | TopAg WR         | 158/278 | 47.12 | 47.88 | -0.76 | 48.49 | 49.00 |
| quality | EDGE             | 259/278 | 11.63 | 8.24 | +3.39 | 9.51 | 6.60 |
| quality | ForCLV           | 276/278 | 66.96 | 66.51 | +0.46 | 66.06 | 66.13 |
| quality | AgCLV            | 178/278 | 63.16 | 61.60 | +1.56 | 64.41 | 64.39 |
| quality | netCLV           | 276/278 | 4.20 | 4.75 | -0.56 | 3.62 | 3.87 |
| quality | Tape             | 258/278 | 2.96 | 2.38 | +0.59 | 2.16 | 1.88 |
| quality | V12 score        | 278/278 | 0.85 | 0.85 | +0.01 | 0.96 | 0.96 |
| quality | V12 forMean      | 278/278 | 24.13 | 19.33 | +4.80 | 16.95 | 14.78 |
| quality | V12 agMean       | 278/278 | 1.54 | 1.33 | +0.21 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 259/278 | 0.587 | +0.085 | +0.164 | +3.39 | 🟢 sep OK |
|    2 | Tape             | quality | 258/278 | 0.555 | +0.066 | +0.110 | +0.59 | 🟡 mild OK |
|    3 | V12 forMean      | quality | 278/278 | 0.553 | +0.085 | +0.105 | +4.80 | 🟡 mild OK |
|    4 | ForWR            | quality | 259/278 | 0.544 | +0.017 | +0.154 | +2.93 | 🟡 mild OK |
|    5 | proven A         | depth   | 278/278 | 0.535 | +0.300 | +0.019 | +0.03 | flat |
|    6 | AgCLV            | quality | 178/278 | 0.534 | -0.012 | +0.087 | +1.56 | flat |
|    7 | V12 score        | quality | 278/278 | 0.531 | -0.023 | +0.016 | +0.01 | flat |
|    8 | CLV AgN          | depth   | 277/278 | 0.529 | +0.205 | +0.010 | +0.03 | flat |
|    9 | #A sharps        | depth   | 278/278 | 0.524 | +0.168 | -0.003 | -0.01 | flat |
|   10 | V12 agMean       | quality | 278/278 | 0.524 | +0.351 | +0.026 | +0.21 | flat |
|   11 | proven F−A       | depth   | 278/278 | 0.476 | +0.182 | -0.060 | -0.11 | flat |
|   12 | v12 A count      | depth   | 278/278 | 0.523 | +0.208 | +0.009 | +0.03 | flat |
|   13 | #F − #A          | depth   | 278/278 | 0.479 | +0.049 | -0.024 | -0.09 | flat |
|   14 | TopFor WR        | quality | 259/278 | 0.517 | +0.021 | +0.089 | +1.85 | flat |
|   15 | unopposed (A=0)  | depth   | 278/278 | 0.516 | +0.214 | -0.009 | -0.01 | flat |
|   16 | WA AgN           | depth   | 278/278 | 0.515 | +0.200 | -0.018 | -0.05 | flat |
|   17 | WA ForN          | depth   | 278/278 | 0.486 | +0.160 | -0.065 | -0.14 | flat |
|   18 | netCLV           | quality | 276/278 | 0.489 | +0.045 | -0.025 | -0.56 | flat |
|   19 | AgWR             | quality | 158/278 | 0.490 | +0.101 | -0.025 | -0.32 | flat |
|   20 | #F sharps        | depth   | 278/278 | 0.507 | +0.185 | -0.037 | -0.10 | flat |
|   21 | TopAg WR         | quality | 158/278 | 0.507 | +0.070 | -0.046 | -0.76 | flat |
|   22 | CLV ForN         | depth   | 277/278 | 0.506 | +0.163 | -0.031 | -0.08 | flat |
|   23 | v12 F count      | depth   | 278/278 | 0.504 | +0.197 | -0.041 | -0.10 | flat |
|   24 | proven F         | depth   | 278/278 | 0.497 | +0.268 | -0.061 | -0.08 | flat |
|   25 | ForCLV           | quality | 276/278 | 0.497 | +0.039 | +0.027 | +0.46 | flat |

### (C) Working read

_N=278 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.587 · Δ +3.39 · higher on WINs (cov 259/278)
- **Tape** — AUC 0.555 · Δ +0.59 · higher on WINs (cov 258/278)
- **V12 forMean** — AUC 0.553 · Δ +4.80 · higher on WINs (cov 278/278)
- **ForWR** — AUC 0.544 · Δ +2.93 · higher on WINs (cov 259/278)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 324n · 53.1% · +3.1%   | 74n · 54.1% · -0.7%    | 212n · 52.8% · +2.3%   | 610n · 53.1% · +2.3%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 35n · 68.6% · +22.9%   | —                      | —                      | 35n · 68.6% · +22.9%   |
| UFC   | 24n · 75.0% · +16.0%   | —                      | —                      | 24n · 75.0% · +16.0%   |
| WNBA  | 11n · 81.8% · +22.1%   | 8n · 37.5% · -30.6%    | 3n · 66.7% · +75.2%    | 22n · 63.6% · +13.4%   |
| **All** | **401n · 56.1% · +7.0%** | **86n · 53.5% · -0.5%** | **220n · 53.2% · +3.5%** | **707n · 54.9% · +4.9%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **974** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  974 |
| Muted W-L                           |              476-498 |
| Muted Win %                         |                48.9% |
| Counterfactual PnL at flat 1u       |               -60.28 |
| Counterfactual ROI at flat 1u       |                -6.2% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-60.28u** at a flat 1u stake — a counterfactual ROI of **-6.2%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-17 | MLB   | ML     | Arizona Diamondbacks    |  +133 | +0.982 | SHARP    |   1/1 |   1/0 |  55.6 |   80.0 |  +13.8 |  7.25 | BOOST    | 2.50u | LOSS    |      -2.50 |
| 2026-08-17 | MLB   | ML     | Minnesota Twins         |  +119 | +0.264 | CONFIRMED-Q1 |   3/6 |   1/2 |  44.4 |  100.0 |   +1.5 |  6.74 | BOOST    | 4.00u | WIN     |      +4.76 |
| 2026-08-17 | MLB   | ML     | Baltimore Orioles       |  +150 | +0.973 | MINI     |   4/3 |   2/1 |  49.8 |   59.6 |   +4.3 |  2.00 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-17 | MLB   | ML     | Chicago Cubs            |  -154 | +0.239 | CONFIRMED-Q1 |   4/3 |   4/3 |  54.1 |   65.8 |   +3.3 | -0.46 | HOLD     | 3.00u | WIN     |      +1.95 |
| 2026-08-17 | MLB   | ML     | Pittsburgh Pirates      |  -102 | +0.174 | PATH-D   |  4/14 |   3/5 |  53.0 |   65.8 |   +2.7 |  1.03 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-17 | MLB   | ML     | Miami Marlins           |  +225 | +0.855 | SHARP    |   2/1 |   2/1 |  63.6 |   71.3 |  +17.2 |  5.37 | BOOST    | 1.00u | LOSS    |      -1.00 |
| 2026-08-17 | MLB   | ML     | Athletics               |  +170 | +0.719 | CONFIRMED-Q1 |   2/4 |   1/1 |  44.4 |  100.0 |   -4.1 |  4.56 | BOOST    | 1.50u | LOSS    |      -1.50 |
| 2026-08-17 | MLB   | ML     | St. Louis Cardinals     |  -109 | +0.840 | CONFIRMED-Q1 |   1/3 |   1/3 |  50.1 |   62.1 |   -1.0 |  0.79 | HOLD     | 3.00u | WIN     |      +2.75 |
| 2026-08-17 | WNBA  | ML     | Dallas Wings            |  +205 | +0.948 | 2-for-0  |   2/0 |   2/0 |  77.9 |   70.8 |  +27.9 | 10.28 | BOOST    | 1.00u | LOSS    |      -1.00 |
| 2026-08-17 | MLB   | TOTAL  | Over 8.5                |  +117 | +0.985 | SHARP~   |   1/0 |   1/0 |  64.7 |   62.5 |  +14.7 |  3.01 | BOOST    | 5.40u | WIN     |      +6.32 |
| 2026-08-17 | MLB   | TOTAL  | Over 10.5               |  -133 | +0.958 | CONFIRMED-UNOPP |   2/0 |   2/0 |  43.7 |   60.2 |   -0.7 | -1.25 | HOLD     | 1.00u | WIN     |      +0.75 |
| 2026-08-17 | MLB   | TOTAL  | Over 8.5                |  -102 | +0.981 | MINI     |   3/0 |   3/0 |  52.7 |   68.9 |  +13.1 |  4.04 | BOOST    | 5.40u | WIN     |      +5.29 |
| 2026-08-17 | MLB   | TOTAL  | Over 9.5                |  +102 | +0.208 | 2-for-0  |   5/1 |   5/1 |  56.0 |   57.3 |  +15.6 |  1.06 | HOLD     | 5.00u | LOSS    |      -5.00 |
| 2026-08-16 | MLB   | ML     | Arizona Diamondbacks    |  +113 | +0.963 | SHARP~   |   1/1 |   1/0 |     — |   80.0 |      — |     — | FAIL_OPEN | 1.50u | LOSS    |      -1.50 |
| 2026-08-16 | MLB   | ML     | Colorado Rockies        |  +122 | +0.976 | MINI     |   4/0 |   2/0 |  49.1 |   66.7 |   -0.9 |  0.53 | HOLD     | 1.00u | WIN     |      +1.22 |
| 2026-08-16 | MLB   | ML     | Detroit Tigers          |  -104 | +0.175 | CONFIRMED-UNOPP |   5/2 |   3/1 |  49.1 |   72.2 |   -0.5 |  1.84 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-16 | MLB   | ML     | New York Yankees        |  +110 | +0.177 | SHARP~   |   1/4 |   1/3 |     — |   80.0 |      — |     — | FAIL_OPEN | 1.50u | WIN     |      +1.65 |
| 2026-08-16 | WNBA  | ML     | Phoenix Mercury         |  -203 | +0.934 | SHARP    |   1/0 |   1/0 |  90.9 |   69.0 |  +40.9 |  9.22 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-08-16 | MLB   | SPREAD | Chicago Cubs            |  +120 | +0.946 | 2-for-0  |   2/0 |   2/0 |  52.4 |   68.6 |   +2.4 |  1.48 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-16 | MLB   | TOTAL  | Under 9.5               |  -117 | +0.733 | MINI-    |   4/2 |   2/1 |     — |   78.6 |      — |     — | FAIL_OPEN | 1.00u | WIN     |      +0.85 |
| 2026-08-16 | MLB   | TOTAL  | Over 8.5                |  +113 | +0.980 | MINI     |   2/0 |   1/0 |  49.9 |   65.7 |   -0.1 |  0.53 | HOLD     | 1.00u | WIN     |      +1.13 |
| 2026-08-16 | MLB   | TOTAL  | Under 9.5               |  -133 | +0.128 | SHARP~   |   3/5 |   3/3 |  74.8 |   70.6 |  +26.9 |  5.75 | BOOST    | 5.40u | WIN     |      +4.06 |
| 2026-08-16 | MLB   | TOTAL  | Under 8.5               |  -100 | +0.994 | CONFIRMED-Q1 |   1/1 |   1/0 |  74.8 |   70.6 |  +34.1 |  6.66 | BOOST    | 5.00u | WIN     |      +5.00 |
| 2026-08-16 | MLB   | TOTAL  | Under 7.5               |  +106 | +0.968 | MINI-    |   2/0 |   1/0 |  47.7 |   79.3 |   -2.3 |  2.14 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-16 | MLB   | TOTAL  | Over 7.5                |  -109 | +0.608 | PATH-D   |   2/5 |   1/2 |  49.9 |   65.7 |   +0.4 |  0.61 | HOLD     | 1.00u | WIN     |      +0.92 |
| 2026-08-16 | MLB   | TOTAL  | Under 9.5               |  -108 | +0.984 | MINI-    |   1/0 |   1/0 |     — |  100.0 |      — |     — | FAIL_OPEN | 1.00u | LOSS    |      -1.00 |
| 2026-08-16 | MLB   | TOTAL  | Over 10.5               |  +104 | +0.973 | HC-1     |   5/1 |   3/1 |  49.4 |   71.2 |   +1.4 |  1.37 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-15 | MLB   | ML     | Atlanta Braves          |  -125 | +0.840 | MINI     |   2/4 |   1/0 |  51.8 |   66.8 |   +7.8 |  2.55 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-15 | MLB   | ML     | Tampa Bay Rays          |  -141 | +0.234 | SHARP~   |   1/3 |   1/1 |  55.2 |   66.3 |   +5.2 |  1.69 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-15 | MLB   | ML     | San Francisco Giants    |  -160 | +0.966 | SHARP~   |   1/2 |   2/1 |  55.6 |   69.2 |   +6.5 |  1.80 | HOLD     | 1.00u | WIN     |      +0.63 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.526 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.072 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.011 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.004 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.018 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  702 |    +0.0159 |    +0.0042 | 0.0000 |  +0.004 |   0.949 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  702 |    +0.0411 |    +0.5131 | 0.0003 |  +0.018 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  702 |    -0.4489 |    +0.5212 | 0.0012 |  -0.035 |   2.887 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 702 |          +0.074 |           -0.008 |                   +0.052 |                   -0.005 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 702 |          -0.005 |           +0.307 |                   +0.010 |                   +0.107 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 702 |          +0.004 |           +0.137 |                   -0.017 |                   +0.015 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 702 |          -0.011 |           +0.167 |                   +0.013 |                   +0.086 | count of contributing AGAINST-side wallets                     |
| provenFor         | 702 |          +0.010 |           +0.124 |                   +0.001 |                   +0.049 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 702 |          +0.006 |           +0.099 |                   +0.022 |                   +0.052 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.374         | 234 | 131-103 |   56.0% |     +2.4% |
| MID (p33–p67)     | 19.950 … 15.626        | 234 | 120-114 |   51.3% |     -1.5% |
| HIGH (> p67)      | 48.906 … 31.820        | 234 | 134-100 |   57.3% |     +1.3% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       702 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8606 | average score across live picks                                 |
| SD                |    0.2240 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.195 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +3.788 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.507 / +0.961 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  606 | 322-284 |   53.1% |     +2.2% |  0.506 |        -0.063 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   34 | 23-11  |   67.6% |    +22.6% |  0.522 |        -0.183 | noise                                     |
| UFC   |   24 | 18-6   |   75.0% |    +16.0% |  0.648 |        +0.175 | strong                                    |
| WNBA  |   22 | 14-8   |   63.6% |    +13.4% |  0.571 |        -0.058 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.416, 0.474, 0.449, 0.451, 0.406, 0.461, 0.496, 0.575, 0.628, 0.604, 0.619, 0.582, 0.546, 0.564]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17"]
    y-axis "edge (pp)" -17 --> 9
    line [4.5, 8, 3.1, -1.3, -6.3, -5.7, -11.7, -11.9, -15.7, -7, -1.3, -3, -1.3, -0.2]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-08-04 |    7 |   62 | 37-25  |   59.7% |     +6.0% |  0.416 |      +4.5pp |
| 2026-08-05 |    7 |   55 | 35-20  |   63.6% |    +13.3% |  0.474 |      +8.0pp |
| 2026-08-06 |    7 |   51 | 30-21  |   58.8% |     +8.5% |  0.449 |      +3.1pp |
| 2026-08-07 |    7 |   56 | 30-26  |   53.6% |     +6.7% |  0.451 |      -1.3pp |
| 2026-08-08 |    7 |   44 | 21-23  |   47.7% |     -1.1% |  0.406 |      -6.3pp |
| 2026-08-09 |    7 |   43 | 21-22  |   48.8% |     +2.1% |  0.461 |      -5.7pp |
| 2026-08-10 |    7 |   45 | 19-26  |   42.2% |    -10.9% |  0.496 |     -11.7pp |
| 2026-08-11 |    7 |   36 | 15-21  |   41.7% |     -3.9% |  0.575 |     -11.9pp |
| 2026-08-12 |    7 |   38 | 14-24  |   36.8% |    -18.6% |  0.628 |     -15.7pp |
| 2026-08-13 |    7 |   50 | 23-27  |   46.0% |     -0.9% |  0.604 |      -7.0pp |
| 2026-08-14 |    7 |   50 | 26-24  |   52.0% |     +8.5% |  0.619 |      -1.3pp |
| 2026-08-15 |    7 |   69 | 35-34  |   50.7% |     +2.9% |  0.582 |      -3.0pp |
| 2026-08-16 |    7 |   77 | 40-37  |   51.9% |     +6.5% |  0.546 |      -1.3pp |
| 2026-08-17 |    7 |   84 | 44-40  |   52.4% |    +12.3% |  0.564 |      -0.2pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.505 avg in first half → 0.541 avg in second half · Δ = +0.035)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.9% | [-3.0%, +11.8%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.9% | [50.9%, 58.4%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.526 | [0.483, 0.568]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             69 | [12, 118]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       707 |
| Unique wallets ever on a FOR side            |                                                       187 |
| Avg FOR-side wallets per pick                |                                                      2.68 |
| Top-5 wallets' share of all FOR appearances  |                                                     25.2% |
| Top-10 wallets' share of all FOR appearances |                                                     44.1% |
| Top-20 wallets' share of all FOR appearances |                                                     62.0% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  113 |   13 | 64-49  |   56.6% |    +12.5% |    +42.53 |     1.53× | CONFIRMED   |     +0.2% |     261 | 2026-08-17 |
|    2 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    3 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    4 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     334 | 2026-08-05 |
|    5 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|    6 | cd2f63  | MLB,NBA,SOC,WNBA |   76 |   39 | 41-35  |   53.9% |    +14.5% |    +33.02 |     1.24× | CONFIRMED   |     +8.3% |     474 | 2026-08-17 |
|    7 | eeabaf  | MLB,NBA,SOC |   72 |   26 | 36-36  |   50.0% |     +1.3% |     +2.63 |     1.24× | CONFIRMED   |     +6.0% |     281 | 2026-08-17 |
|    8 | 2f2a9e  | MLB,SOC,WNBA |   72 |   32 | 38-34  |   52.8% |     -6.5% |    -13.09 |     2.07× | CONFIRMED   |     -8.2% |     266 | 2026-08-15 |
|    9 | 0f9d74  | MLB,NBA,SOC,UFC |   71 |   49 | 39-32  |   54.9% |    +11.8% |    +22.35 |     0.47× | CONFIRMED   |    +18.2% |     302 | 2026-08-17 |
|   10 | 4b912c  | MLB,SOC,WNBA |   69 |   23 | 40-29  |   58.0% |    +10.6% |    +19.09 |     1.28× | CONFIRMED   |     -1.3% |     190 | 2026-08-17 |
|   11 | 7923c4  | MLB,NBA,UFC |   50 |   16 | 31-19  |   62.0% |    +29.2% |    +36.09 |     0.74× | CONFIRMED   |    +10.7% |     217 | 2026-08-17 |
|   12 | 7da3d5  | MLB,SOC,UFC,WNBA |   42 |   57 | 19-23  |   45.2% |    -13.0% |    -15.47 |     4.63× | CONFIRMED   |     -8.2% |     250 | 2026-08-17 |
|   13 | 705ba1  | MLB        |   38 |   17 | 18-20  |   47.4% |     -6.3% |     -7.31 |     1.16× | FLAT        |     +6.1% |     168 | 2026-08-17 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   34 |   18 | 16-18  |   47.1% |     -4.5% |     -4.51 |     1.22× | CONFIRMED   |     -5.1% |     155 | 2026-08-17 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 |   22 | 19-15  |   55.9% |     +0.8% |     +0.85 |     1.36× | CONFIRMED   |    +13.8% |     143 | 2026-07-30 |
|   16 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   17 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   18 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |
|   19 | f2f960  | MLB        |   26 |   16 | 12-14  |   46.2% |    -15.0% |    -13.64 |     2.90× | —           |     -6.2% |      91 | 2026-08-04 |
|   20 | 621848  | MLB,UFC,WNBA |   26 |    8 | 13-13  |   50.0% |     -7.3% |     -5.63 |     0.37× | CONFIRMED   |     -3.3% |      65 | 2026-08-17 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-07-21 |
|    2 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    3 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|    4 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    5 | 7923c4  | MLB,NBA,UFC |   50 | 31-19  |   62.0% |     +29.2% |    +36.09 |     0.74× | 2026-08-17 |
|    6 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|    7 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|    8 | f9e3d0  | MLB,NBA    |   10 | 5-5    |   50.0% |     +23.2% |     +7.23 |     1.43× | 2026-08-01 |
|    9 | 7dd2e5  | UFC        |   19 | 15-4   |   78.9% |     +21.0% |    +17.56 |     1.13× | 2026-08-15 |
|   10 | c911a4  | MLB,NBA,SOC |   21 | 11-10  |   52.4% |     +17.0% |    +10.19 |     4.63× | 2026-08-01 |
|   11 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 | 64-37  |   63.4% |     +15.8% |    +53.36 |     1.54× | 2026-07-19 |
|   12 | b839b3  | MLB,NBA,SOC,UFC |   25 | 16-9   |   64.0% |     +15.5% |    +13.19 |     1.34× | 2026-08-17 |
|   13 | 9a69c2  | MLB,SOC    |   26 | 14-12  |   53.8% |     +14.8% |     +9.18 |     2.30× | 2026-07-10 |
|   14 | cd2f63  | MLB,NBA,SOC,WNBA |   76 | 41-35  |   53.9% |     +14.5% |    +33.02 |     1.24× | 2026-08-17 |
|   15 | 913987  | MLB        |   30 | 20-10  |   66.7% |     +12.8% |    +10.20 |     0.97× | 2026-06-11 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 8ec926  | MLB,UFC,WNBA |   14 | 5-9    |   35.7% |     -36.6% |    -15.75 |     5.48× | 2026-08-15 |
|    3 | c9bba3  | MLB,SOC    |   14 | 7-7    |   50.0% |     -28.6% |     -9.38 |     0.81× | 2026-08-17 |
|    4 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    5 | 7da3d5  | MLB,SOC,UFC,WNBA |   42 | 19-23  |   45.2% |     -13.0% |    -15.47 |     4.63× | 2026-08-17 |
|    6 | ac9705  | MLB        |   18 | 8-10   |   44.4% |     -11.5% |     -8.36 |     2.24× | 2026-08-02 |
|    7 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    8 | 621848  | MLB,UFC,WNBA |   26 | 13-13  |   50.0% |      -7.3% |     -5.63 |     0.37× | 2026-08-17 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   72 | 38-34  |   52.8% |      -6.5% |    -13.09 |     2.07× | 2026-08-15 |
|   10 | 705ba1  | MLB        |   38 | 18-20  |   47.4% |      -6.3% |     -7.31 |     1.16× | 2026-08-17 |
|   11 | ad88a3  | MLB,SOC    |   20 | 10-10  |   50.0% |      -5.7% |     -4.05 |     0.28× | 2026-08-13 |
|   12 | bc35e3  | MLB,SOC,UFC,WNBA |   34 | 16-18  |   47.1% |      -4.5% |     -4.51 |     1.22× | 2026-08-17 |
|   13 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 | 19-15  |   55.9% |      +0.8% |     +0.85 |     1.36× | 2026-07-30 |
|   14 | 4c64aa  | MLB        |   92 | 50-42  |   54.3% |      +1.1% |     +1.94 |     0.84× | 2026-08-05 |
|   15 | eeabaf  | MLB,NBA,SOC |   72 | 36-36  |   50.0% |      +1.3% |     +2.63 |     1.24× | 2026-08-17 |

> 🔴 **6 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `f2f960` (FOR# 26, ROI -15.0%), `7da3d5` (FOR# 42, ROI -13.0%), `1e8f33` (FOR# 94, ROI -10.7%), `621848` (FOR# 26, ROI -7.3%), `2f2a9e` (FOR# 72, ROI -6.5%), `705ba1` (FOR# 38, ROI -6.3%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1430 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   322 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     8 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    58 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   323 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            235 |        50 |   30 |   13 |  142 |                     93 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            220 |        60 |   38 |    8 |  114 |                    106 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   79 |    707 | 974 | 388-319 |  54.9% |      4.9% |     +97.52 |    +0.14 | 0.505 |        0.2497 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  647 |    +1.5pp |    +13.9pp |          +0.311 |   -0.044 |    +0.0903 | 🟡 mixed |
| v12 − v10          | +  645 |    +6.5pp |    +23.7pp |          +0.451 |   +0.111 |    +0.0307 | 🟢 better |
| v12 − v11          | +  596 |    -0.1pp |     +2.1pp |          +0.077 |   +0.061 |    +0.0145 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 610n 53.1% +2% | 10n 30.0% +29% | 6n 83.3% +38%  | 35n 68.6% +23% | 24n 75.0% +16% | 22n 63.6% +13% | 707n 54.9% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 138n +3%      | 209n +1%      | 161n +12%     | 96n -5%       | 98n +19%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~1963 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 941 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 702 / 941 (75%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 702 / 941 (75%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 702 / 941 (75%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 702 / 941 (75%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 702 / 941 (75%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 702 / 941 (75%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 702 / 941 (75%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 941 / 941 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 941 / 941 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 941 / 941 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 941 / 941 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 941 / 941 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 941 / 941 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 934 / 941 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 932 / 941 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 941 / 941 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 940 / 941 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 570 / 941 (61%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 940 / 941 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 570 / 941 (61%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 569 / 941 (60%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 941 / 941 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 941 / 941 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 941 / 941 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 940 / 941 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 941 / 941 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd contribMargin     | 941 |      |    -0.036 |    -0.168 |      -0.057 |      -0.112 |  0.466 |
|    2 | wd sizeMargin        | 569 |      |    -0.029 |    -0.053 |      -0.057 |      -0.072 |  0.493 |
|    3 | V12 forMean          | 702 |  🟢  |    +0.074 |    -0.008 |      +0.052 |      -0.005 |  0.528 |
|    4 | qMargin              | 702 |  🟢  |    +0.077 |    -0.022 |      +0.052 |      -0.015 |  0.526 |
|    5 | wd agCount           | 570 |      |    +0.017 |    +0.274 |      +0.047 |      +0.120 |  0.515 |
|    6 | wd maxForContrib     | 940 |      |    -0.052 |    -0.100 |      -0.043 |      -0.046 |  0.486 |
|    7 | wd contribFor        | 941 |      |    -0.035 |    -0.103 |      -0.040 |      -0.075 |  0.478 |
|    8 | wd agAvgSize         | 570 |      |    +0.017 |    +0.057 |      +0.039 |      +0.049 |  0.509 |
|    9 | wd forAvgSize        | 940 |      |    -0.017 |    +0.011 |      -0.034 |      -0.018 |  0.511 |
|   10 | provenMargin         | 941 |      |    -0.013 |    +0.040 |      -0.031 |      -0.025 |  0.489 |
|   11 | wd forCount          | 940 |      |    -0.019 |    +0.065 |      -0.030 |      -0.030 |  0.484 |
|   12 | clv                  | 932 |      |    -0.019 |    +0.037 |      -0.030 |      +0.009 |  0.510 |
|   13 | lockPinnProb         | 934 |      |    +0.178 |    +0.153 |      +0.029 |      -0.132 |  0.597 |
|   14 | provenFor            | 941 |      |    -0.020 |    +0.009 |      -0.026 |      -0.037 |  0.492 |
|   15 | countMargin          | 702 |      |    +0.011 |    +0.047 |      -0.025 |      -0.039 |  0.491 |
|   16 | hcMargin             | 941 |      |    -0.006 |    +0.197 |      -0.024 |      +0.055 |  0.514 |
|   17 | ags (v11)            | 941 |      |    +0.001 |    -0.000 |      -0.021 |      -0.050 |  0.509 |
|   18 | provenTotal          | 941 |      |    -0.020 |    -0.027 |      -0.018 |      -0.031 |  0.498 |
|   19 | peakStars            | 941 |      |    +0.001 |    +0.068 |      -0.018 |      -0.013 |  0.499 |
|   20 | V12 forCount         | 702 |  🟢  |    +0.004 |    +0.137 |      -0.017 |      +0.015 |  0.509 |
|   21 | wd contribAg         | 941 |      |    -0.002 |    +0.153 |      +0.016 |      +0.060 |  0.503 |
|   22 | wd maxShare          | 941 |      |    +0.013 |    -0.045 |      +0.015 |      +0.009 |  0.510 |
|   23 | V12 agCount          | 702 |  🟢  |    -0.011 |    +0.167 |      +0.013 |      +0.086 |  0.514 |
|   24 | V12 agMean           | 702 |  🟢  |    -0.005 |    +0.307 |      +0.010 |      +0.107 |  0.502 |
|   25 | agsV12               | 702 |  🟢  |    +0.018 |    -0.011 |      +0.004 |      -0.004 |  0.526 |
|   26 | provenAg             | 941 |      |    -0.014 |    +0.136 |      -0.001 |      +0.058 |  0.505 |

> **Top 3 univariate features by PnL correlation:** `wd contribMargin` (r = -0.057), `wd sizeMargin` (r = -0.057), `V12 forMean` (r = +0.052).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd contribMargin` — r(unit-ret) = -0.057, AUC = 0.466. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd contribMargin` · r(unit-ret) = -0.057 · AUC = 0.466

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … 17.000         | 314 | 180-134 |   57.3% |     +2.4% |
| MID (p33–p67)     | 57.800 … 28.100          | 313 | 173-140 |   55.3% |     +1.0% |
| HIGH (> p67)      | 174.100 … 144.700        | 314 | 159-155 |   50.6% |     -2.3% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd sizeMargin` · r(unit-ret) = -0.057 · AUC = 0.493

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.457          | 190 | 108-82  |   56.8% |     +2.6% |
| MID (p33–p67)     | 0.078 … -0.132           | 189 | 99-90   |   52.4% |     -0.2% |
| HIGH (> p67)      | 3.728 … 2.373            | 190 | 102-88  |   53.7% |     -1.7% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.052 · AUC = 0.528

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.374           | 234 | 131-103 |   56.0% |     +2.4% |
| MID (p33–p67)     | 19.950 … 15.626          | 234 | 120-114 |   51.3% |     -1.5% |
| HIGH (> p67)      | 48.906 … 31.820          | 234 | 134-100 |   57.3% |     +1.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.052 · AUC = 0.526

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 5.473            | 234 | 129-105 |   55.1% |     +1.6% |
| MID (p33–p67)     | 19.950 … 11.374          | 234 | 123-111 |   52.6% |     -0.5% |
| HIGH (> p67)      | 46.556 … 25.838          | 234 | 133-101 |   56.8% |     +0.9% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd agCount` · r(unit-ret) = +0.047 · AUC = 0.515

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 278 | 148-130 |   53.2% |     -0.7% |
| MID (p33–p67)     | 2.000 … 2.000            | 139 | 74-65   |   53.2% |     -0.9% |
| HIGH (> p67)      | 3.000 … 3.000            | 153 | 87-66   |   56.9% |     +2.8% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd contribMargin | wd sizeMargin  | V12 forMean    | qMargin        | wd agCount     | wd maxForContrib | wd contribFor  | wd agAvgSize   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd contribMargin |  1.000         |         +0.294 |         +0.093 |         +0.072 |         -0.140 |         +0.515 |         +0.773 |         -0.156 |
| wd sizeMargin |         +0.294 |  1.000         |         +0.210 |         +0.184 |         +0.051 |         +0.299 |         +0.260 |         -0.797 |
| V12 forMean |         +0.093 |         +0.210 |  1.000         |         +0.963 |         +0.170 |         +0.263 |         +0.199 |         -0.017 |
| qMargin     |         +0.072 |         +0.184 |         +0.963 |  1.000         |         +0.051 |         +0.196 |         +0.096 |         -0.038 |
| wd agCount  |         -0.140 |         +0.051 |         +0.170 |         +0.051 |  1.000         |         +0.322 |         +0.476 |         +0.101 |
| wd maxForContrib |         +0.515 |         +0.299 |         +0.263 |         +0.196 |         +0.322 |  1.000         |         +0.663 |         +0.019 |
| wd contribFor |         +0.773 |         +0.260 |         +0.199 |         +0.096 |         +0.476 |         +0.663 |  1.000         |         -0.015 |
| wd agAvgSize |         -0.156 |         -0.797 |         -0.017 |         -0.038 |         +0.101 |         +0.019 |         -0.015 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.963. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 452 picks · features = 8 (+ intercept) · multiple R² = **0.0191** · adjusted R² = **-0.0009** · residual sd = 0.946

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.2933 |   0.2051 | -1.43        |        1 |
|    2 | wd agCount           |     |    +0.1985 |   0.1253 | +1.58 (~sig) |        2 |
|    3 | wd contribMargin     |     |    +0.1866 |   0.1798 | +1.04        |        3 |
|    4 | V12 forMean          |  🟢 |    +0.0810 |   0.1963 | +0.41        |        4 |
|    5 | wd sizeMargin        |     |    -0.0557 |   0.0901 | -0.62        |        5 |
|    6 | wd maxForContrib     |     |    +0.0316 |   0.0645 | +0.49        |        6 |
|    7 | wd agAvgSize         |     |    +0.0197 |   0.0872 | +0.23        |        7 |
|    8 | qMargin              |  🟢 |    -0.0138 |   0.1910 | -0.07        |        8 |
| —    | (intercept)          |     |    +0.0246 |   0.0445 |    +0.55 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.081), `qMargin` (β = -0.014)
- V12 IGNORES: `wd contribFor` (β = -0.293, t = -1.43), `wd agCount` (β = +0.199, t = +1.58), `wd contribMargin` (β = +0.187, t = +1.04), `wd sizeMargin` (β = -0.056, t = -0.62), `wd maxForContrib` (β = +0.032, t = +0.49), `wd agAvgSize` (β = +0.020, t = +0.23)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.522 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.559 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.037.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd agCount` (β = +0.199, t = +1.58). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of -0.0009 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*