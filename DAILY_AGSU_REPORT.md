# AGS-Unified — V12 Daily Monitor

**Generated:** Wednesday, August 19, 2026 at 9:25 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (80 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (80 days ago), V12 has evaluated **2221** picks, shipped **731** for real money (32.9% ship rate), and muted the other **1490**. On the shipped picks V12 has gone **401-330** (54.9% win), staked **2025.50u**, and returned **+100.59u** at **+5.0% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             80 |
| Picks V12 has evaluated             |                           2221 |
| Picks SHIPPED (units > 0)           |                            731 |
| Picks MUTED (score ≤ 0, FADE)       |                           1490 |
| Ship rate                           |                          32.9% |
| Live W-L                            |                        401-330 |
| Live Win %                          |                          54.9% |
| Live PnL (units)                    |                        +100.59 |
| Live ROI                            |                          +5.0% |
| Avg PnL / day                       |                         +1.26u |
| Most recent action (2026-08-19)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **5.0% ROI** across 731 live picks (+100.59u real PnL).
- Mute rule is **saving money** — the 986 muted picks would have lost -60.53u at flat 1u (-6.1% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.26u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **165-137** · +6.4% ROI · +53.98u on 302 graded — see § 5.

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

**Full book:** 80d · 731 live · 401-330 · **+100.59u** · +5.0% ROI · +1.26u/day.

_Prior to table (2026-06-01 → 2026-07-29): 544 live · 303-241 · +66.71u · cum through prior = +66.71u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-08-18 |        51 |   24 |    12 | 13-11      |  54.2% |     45.90 |      +3.07 |      6.7% |    +100.59 |
| 2026-08-19 |        21 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +100.59 |

> **Trajectory.** 🟢 Last 3 days (14.7% ROI) **+10.2pp** vs prior (4.6%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-18**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 13 | 10-3 | +45.3% | +27.88u | +2.14u | — |
| 🟢 2 | RANK 2-for-0 rescue | B | 79 | 45-34 | +12.6% | +36.30u | +0.46u | -18.8% |
| 🟢 3 | MINI- (gate-cut) | C | 19 | 11-8 | +8.9% | +2.27u | +0.12u | -69.2% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 77 | 49-28 | +17.8% | +60.01u | sized UP after path |
| 2 | Tape HOLD (mid) | 194 | 101-93 | +1.2% | +5.30u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 4 | 1-3 | -50.0% | -2.00u | 🟢 saving $ |
| 2 | Score FADE (≤0 → 0u) | 584 | 286-298 | -3.6% | -21.04u | 🟢 saving $ |
| 3 | Tape MUTE (tape<0 → 0u) | 46 | 24-22 | +5.3% | +2.44u | 🔴 costing $ |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 13 | 10-3 | 76.9% | 61.5u | +27.88u | +45.3% | +2.14u | 0 | — | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 87 | 52-35 | 59.8% | 317.7u | +21.85u | +6.9% | +0.25u | 16 | -6.8% | +1.14u | 🟢 OK |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 79 | 45-34 | 57.0% | 288.0u | +36.30u | +12.6% | +0.46u | 10 | -18.8% | +0.67u | 🔻 cooling |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 65 | 30-35 | 46.2% | 201.6u | -15.79u | -7.8% | -0.24u | 7 | -3.5% | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 81 | 42-39 | 51.9% | 221.8u | +5.38u | +2.4% | +0.07u | 22 | +35.0% | -0.43u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 68 | 39-29 | 57.4% | 189.9u | +9.14u | +4.8% | +0.13u | 16 | +35.1% | +0.64u | 🟡 flat |
| MINI- (gate-cut) | `MINI-` | C | 1u | 19 | 11-8 | 57.9% | 25.5u | +2.27u | +8.9% | +0.12u | 5 | -69.2% | -2.00u | 🔻 cooling |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 22 | 12-10 | 54.5% | 22.4u | +1.89u | +8.5% | +0.09u | 8 | -21.1% | +0.09u | 🔻 cooling |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 77 | 49-28 | 63.6% | 337.7u | +60.01u | +17.8% | 24 | +25.6% | -5.20u |
| Tape HOLD (mid) | TAPE | staked | 194 | 101-93 | 52.1% | 446.6u | +5.30u | +1.2% | 70 | +9.5% | +7.62u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 12 | -51.1% | -0.91u |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 46 | 24-22 | 52.2% | 46.0u | +2.44u | +5.3% | 18 | -4.8% | +0.03u |
| fadeTop≥60 MUTE | E | CF 1u | 4 | 1-3 | 25.0% | 4.0u | -2.00u | -50.0% | 3 | -33.3% | -1.00u |
| Score FADE (≤0 → 0u) | score | CF 1u | 584 | 286-298 | 49.0% | 584.0u | -21.04u | -3.6% | 56 | -2.7% | -1.57u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| TOP | 29 / -5% | 14 / +17% | 4 / -16% |
| RANK | 35 / +6% | 5 / +46% | — |
| SHARP | 14 / -13% | 25 / -1% | 1 / -100% |
| SHARP-LEAN | 58 / -1% | 20 / +9% | 3 / -30% |
| MINI | 20 / +0% | 7 / +51% | 4 / +1% |
| MINI- | 5 / -34% | 1 / +45% | 3 / -5% |
| DISSENT | 13 / +19% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-08-18)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| HC-1 TOP | 2 | 1-1 | +1.14u | +17.5% |
| RANK 2-for-0 rescue | 4 | 2-2 | +0.67u | +6.4% |
| MINI (gate-pass) | 1 | 1-0 | +0.64u | +64.0% |
| DISSENT rescue | 2 | 1-1 | +0.09u | +4.5% |
| SHARP-LEAN EDGE/net ONE | 6 | 3-3 | -0.43u | -3.1% |
| MINI- (gate-cut) | 1 | 0-1 | -2.00u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| TOP PICK (TOP+/TOP)       |  4-5u | 153 | 67-49  |  57.8% |      450.20 |      +9.91 |      2.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 371 | 123-116 |  51.5% |      760.35 |     +19.28 |      2.5% |
| STRONG (MINI)             |    3u |  81 | 39-29  |  57.4% |      189.85 |      +9.14 |      4.8% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  71 | 25-21  |  54.3% |       52.85 |      +2.14 |      4.0% |
| **STAKED TOTAL** |     — | 482 | 264-218 |  54.8% |     1514.75 |     +68.35 |     +4.5% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 124 | 52-35  |  59.8% |      317.70 |     +21.85 |      6.9% |
| B · 2-for-0 rescue    | RANK        |    4u | 100 | 45-34  |  57.0% |      287.95 |     +36.30 |     12.6% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 176 | 42-39  |  51.9% |      221.84 |      +5.38 |      2.4% |
| C · proven-$ consensus | SHARP       |    3u |  81 | 30-35  |  46.2% |      201.56 |     -15.79 |     -7.8% |
| A · mini-HC (gate-pass) | MINI        |    3u |  81 | 39-29  |  57.4% |      189.85 |      +9.14 |      4.8% |
| C · mini gate-cut     | MINI-       |    1u |  22 | 11-8   |  57.9% |       25.50 |      +2.27 |      8.9% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  43 | 12-10  |  54.5% |       22.35 |      +1.89 |      8.5% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 499 picks tracked at 0u (would-be 237-262, 47.5% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (10-3, +27.88u)  ·  🟢 TOP PICK (85-68, +9.91u)  ·  🟠 SHARP PLAY (188-183, +19.28u)  ·  🔴 STRONG (48-33, +9.14u)  ·  🟣 LEAN (36-35, +2.14u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18"]
    y-axis "PnL (u)" -14 --> 31
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 909 | 903 | 869 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 46 | 24-22 | 52.2% | 1.00u | +1.56u | +156.0% |
| HOLD      | 233 | 118-115 | 50.6% | 449.57u | +2.30u | +0.5% |
| BOOST     | 86 | 55-31 | 64.0% | 341.18u | +62.09u | +18.2% |
| FAIL_OPEN | 28 | 12-16 | 42.9% | 54.50u | -15.17u | -27.8% |
| PASS      | 476 | 240-236 | 50.4% | 7.00u | -1.12u | -16.0% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 251 | 129-122 | 51.4% | -0.31u |
| hold (0–2.89) | path u | 396 | 196-200 | 49.5% | +8.55u |
| boost (≥2.89) | ×1.35 | 104 | 64-40 | 61.5% | +56.44u |

_Score coverage: **751/869** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 46 | +13.41u | -13.41u | +25.75u | +39.16u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 79 | +43.70u | +62.09u | +18.39u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-18 | MLB | Minnesota Twins | CONFIRMED-UNOPP | 4.87 | BOOST | 1.00u | 1.00u | WIN |
| 2026-08-18 | MLB | Los Angeles Angels | CONFIRMED-UNOPP | -0.18 | MUTE | 1.00u | 1.00u | WIN |
| 2026-08-18 | MLB | Philadelphia Phillies | PATH-D | -4.25 | MUTE | 1.00u | 0.00u | WIN |
| 2026-08-18 | MLB | Seattle Mariners | PATH-D | -1.41 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-18 | WNBA | Los Angeles Sparks | SHARP~ | 3.91 | BOOST | 4.00u | 5.40u | LOSS |
| 2026-08-18 | MLB | Under 11.5 | SHARP~ | -0.07 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-18 | MLB | Over 7.5 | SHARP~ | 2.94 | BOOST | 1.00u | 1.00u | LOSS |
| 2026-08-17 | MLB | Arizona Diamondbacks | SHARP | 7.25 | BOOST | 2.50u | 2.50u | LOSS |
| 2026-08-17 | MLB | Minnesota Twins | CONFIRMED-Q1 | 6.74 | BOOST | 2.00u | 4.00u | WIN |
| 2026-08-17 | MLB | Miami Marlins | SHARP | 5.37 | BOOST | 1.00u | 1.00u | LOSS |
| 2026-08-17 | MLB | Athletics | CONFIRMED-Q1 | 4.56 | BOOST | 1.00u | 1.50u | LOSS |
| 2026-08-17 | MLB | San Diego Padres | SHARP | 5.36 | BOOST | 4.00u | 0.00u | LOSS |
| 2026-08-17 | WNBA | Dallas Wings | 2-for-0 | 10.28 | BOOST | 1.00u | 1.00u | LOSS |
| 2026-08-17 | MLB | Over 8.5 | SHARP~ | 3.01 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-17 | MLB | Over 8.5 | MINI | 4.04 | BOOST | 4.00u | 5.40u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.23** · nPriors=461 · source=expanding_q1 · asOf=2026-08-19 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 463 | 389 | 369 | 83 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 29 | 12-17 | 41.4% | 3.00u | -0.80u | -26.7% |
| HOLD      | 125 | 68-57 | 54.4% | 154.30u | +23.85u | +15.5% |
| FAIL_OPEN | 10 | 5-5 | 50.0% | 14.90u | -5.03u | -33.8% |
| EXEMPT    | 94 | 46-48 | 48.9% | 157.90u | +5.85u | +3.7% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -47.9 … 0.0 | 16 | 5-11 | 31.3% | 3.5u | -0.35u | -10.0% |
| Q2 | 0.0 … 2.3 | 16 | 9-7 | 56.3% | 27.8u | +10.83u | +39.0% |
| Q3 | 2.5 … 7.4 | 16 | 9-7 | 56.3% | 23.7u | +5.86u | +24.7% |
| Q4 | 7.5 … 13.9 | 16 | 7-9 | 43.8% | 35.5u | +2.38u | +6.7% |
| Q5 | 14.4 … 1802.6 | 17 | 8-9 | 47.1% | 25.3u | +1.13u | +4.5% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 29 | 12-17 | -5.13u | +5.13u | +19.50u | +14.37u |

> 🟢 **Mute is saving money** (Δ +5.13u · muted WR 41.4%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 4 | 3-1 | 75.0% | 6.0u | +2.60u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 8 | 1-7 | 12.5% | 8.5u | -6.12u |
| MLB | 19 | 8-11 | 42.1% | 23.5u | -3.64u |
| WNBA | 10 | 4-6 | 40.0% | 10.0u | -1.49u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-08-18 | MLB | Minnesota Twins | CONFIRMED-UNOPP | -80.4 | -0.5 | 1.00u | WIN |
| 2026-08-18 | MLB | Colorado Rockies | CONFIRMED-UNOPP | -2.2 | -0.5 | 1.00u | LOSS |
| 2026-08-18 | MLB | Over 9.5 | — | -1.3 | -0.5 | 1.00u | LOSS |
| 2026-08-18 | WNBA | Over 178.5 | — | -3.4 | -0.5 | 1.00u | LOSS |
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

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 42 | 22-20 | 52.4% | 115.8u | +19.85u | +17.1% |
| Muted (Q1 → 0u) | 29 | 12-17 | 41.4% | 3.0u | -0.80u | -26.7% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 109–60 · 64.5% · +19.7%); **5–10 is the hole** (55–55 · 50% · -8.5%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 513 tickets · cov 487/513 (stamp 285 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 208 | 107–101 | 51.4% | -3.7% |
| 5–10 | 110 | 55–55 | 50.0% | -8.5% |
| ≥10 | 169 | 109–60 | 64.5% | +19.7% |
| All | 513 | 283–230 | 55.2% | +5.2% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.9% (88) | 54.7% (53) | 73.2% (71) |
| B | 53.7% (54) | 55.6% (9) | 68.8% (16) |
| C | 37.5% (32) | 45.5% (44) | 55.8% (77) |

##### Jul 15+ · 302 tickets · cov 282/302 (stamp 280 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 102 | 54–48 | 52.9% | +3.2% |
| 5–10 | 71 | 32–39 | 45.1% | -19.3% |
| ≥10 | 109 | 70–39 | 64.2% | +17.7% |
| All | 302 | 165–137 | 54.6% | +6.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 41.4% (29) | 50% (24) | 80% (30) |
| B | 53.6% (28) | 25% (4) | 66.7% (9) |
| C | 36.4% (11) | 46.2% (39) | 56.7% (67) |

##### Yesterday (Aug 18) · 24 tickets · cov 21/24 (stamp 21 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 13 | 8–5 | 61.5% | +27.7% |
| 5–10 | 5 | 2–3 | 40.0% | -23.2% |
| ≥10 | 3 | 2–1 | 66.7% | +14.3% |
| All | 24 | 13–11 | 54.2% | +6.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 100% (1) | 0% (2) | 100% (1) |
| B | 50% (2) | 50% (2) | — |
| C | 33.3% (3) | 100% (1) | 50% (2) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 513 tickets · cov 508/513 (stamp 297 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 330 | 181–149 | 54.8% | +2.4% |
| 5–10 | 90 | 50–40 | 55.6% | +14.8% |
| ≥10 | 88 | 50–38 | 56.8% | +7.0% |
| All | 513 | 283–230 | 55.2% | +5.2% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 56.8% (139) | 52.5% (40) | 70.7% (41) |
| B | 56.9% (58) | 63.6% (11) | 50% (10) |
| C | 48.5% (97) | 58.1% (31) | 40.6% (32) |

##### Jul 15+ · 302 tickets · cov 298/302 (stamp 297 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 180 | 103–77 | 57.2% | +8.9% |
| 5–10 | 67 | 37–30 | 55.2% | +17.7% |
| ≥10 | 51 | 23–28 | 45.1% | -14.4% |
| All | 302 | 165–137 | 54.6% | +6.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 64.4% (45) | 50% (24) | 55% (20) |
| B | 50% (30) | 71.4% (7) | 50% (4) |
| C | 52.9% (70) | 57.1% (28) | 34.8% (23) |

##### Yesterday (Aug 18) · 24 tickets · cov 21/24 (stamp 21 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 13 | 8–5 | 61.5% | +12.6% |
| 5–10 | 6 | 3–3 | 50.0% | -8.5% |
| ≥10 | 2 | 1–1 | 50.0% | +10.0% |
| All | 24 | 13–11 | 54.2% | +6.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 33.3% (3) | 100% (1) | — |
| B | 66.7% (3) | 0% (1) | — |
| C | 66.7% (3) | 50% (2) | 0% (1) |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 513 tickets · cov 487/513 (stamp 279 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 82 | 36–46 | 43.9% | -23.7% |
| 0–2.89 | 279 | 151–128 | 54.1% | +6.8% |
| ≥2.89 | 126 | 84–42 | 66.7% | +21.3% |
| All | 513 | 283–230 | 55.2% | +5.2% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 57.5% (113) | 76.8% (56) |
| B | 56.5% (23) | 54.5% (44) | 66.7% (12) |
| C | 18.2% (11) | 49.5% (91) | 54.9% (51) |

##### Jul 15+ · 302 tickets · cov 282/302 (stamp 279 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 13 | 8–5 | 61.5% | -0.9% |
| 0–2.89 | 188 | 97–91 | 51.6% | +1.4% |
| ≥2.89 | 81 | 51–30 | 63.0% | +16.5% |
| All | 302 | 165–137 | 54.6% | +6.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 50% (56) | 76.9% (26) |
| B | 42.9% (7) | 55.2% (29) | 60% (5) |
| C | — | 50% (72) | 53.3% (45) |

##### Yesterday (Aug 18) · 24 tickets · cov 21/24 (stamp 21 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 2 | 2–0 | 100.0% | +114.0% |
| 0–2.89 | 16 | 9–7 | 56.3% | +14.7% |
| ≥2.89 | 3 | 1–2 | 33.3% | -70.3% |
| All | 24 | 13–11 | 54.2% | +6.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 50% (4) | — |
| B | 100% (1) | 33.3% (3) | — |
| C | — | 75% (4) | 0% (2) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 302 | 165-137 | 54.6% | 849.25u | +53.98u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 302/302 | 2.02 | 2.13 | -0.11 | 2.00 | 2.00 |
| depth   | #A sharps        | 302/302 | 1.36 | 1.38 | -0.02 | 1.00 | 1.00 |
| depth   | #F − #A          | 302/302 | 0.66 | 0.75 | -0.09 | 1.00 | 1.00 |
| depth   | proven F         | 302/302 | 1.40 | 1.46 | -0.06 | 1.00 | 1.00 |
| depth   | proven A         | 302/302 | 0.46 | 0.42 | +0.04 | 0.00 | 0.00 |
| depth   | proven F−A       | 302/302 | 0.94 | 1.04 | -0.10 | 1.00 | 1.00 |
| depth   | v12 F count      | 302/302 | 2.01 | 2.10 | -0.09 | 2.00 | 2.00 |
| depth   | v12 A count      | 302/302 | 1.42 | 1.45 | -0.03 | 1.00 | 1.00 |
| depth   | WA ForN          | 302/302 | 1.55 | 1.69 | -0.13 | 1.00 | 1.00 |
| depth   | WA AgN           | 302/302 | 1.08 | 1.18 | -0.09 | 1.00 | 1.00 |
| depth   | CLV ForN         | 301/302 | 1.90 | 1.98 | -0.08 | 2.00 | 2.00 |
| depth   | CLV AgN          | 301/302 | 1.36 | 1.36 | -0.01 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 302/302 | 0.39 | 0.39 | +0.00 | 0.00 | 0.00 |
| quality | ForWR            | 280/302 | 57.61 | 54.95 | +2.65 | 54.42 | 54.40 |
| quality | AgWR             | 174/302 | 44.28 | 44.49 | -0.21 | 45.00 | 45.61 |
| quality | TopFor WR        | 280/302 | 59.98 | 58.40 | +1.59 | 55.90 | 55.60 |
| quality | TopAg WR         | 174/302 | 47.31 | 47.99 | -0.68 | 48.69 | 48.84 |
| quality | EDGE             | 280/302 | 11.01 | 8.10 | +2.91 | 8.70 | 6.44 |
| quality | ForCLV           | 297/302 | 66.85 | 66.30 | +0.55 | 66.03 | 66.08 |
| quality | AgCLV            | 192/302 | 63.12 | 61.47 | +1.65 | 64.42 | 64.12 |
| quality | netCLV           | 297/302 | 4.12 | 4.64 | -0.52 | 3.55 | 3.87 |
| quality | Tape             | 279/302 | 2.83 | 2.33 | +0.50 | 2.10 | 1.86 |
| quality | V12 score        | 302/302 | 0.84 | 0.84 | +0.01 | 0.96 | 0.95 |
| quality | V12 forMean      | 302/302 | 23.57 | 18.52 | +5.04 | 16.35 | 14.23 |
| quality | V12 agMean       | 302/302 | 1.61 | 1.31 | +0.30 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 280/302 | 0.571 | +0.030 | +0.143 | +2.91 | 🟡 mild OK |
|    2 | V12 forMean      | quality | 302/302 | 0.559 | +0.061 | +0.113 | +5.04 | 🟡 mild OK |
|    3 | ForWR            | quality | 280/302 | 0.542 | -0.006 | +0.141 | +2.65 | 🟡 mild OK |
|    4 | Tape             | quality | 279/302 | 0.542 | +0.014 | +0.095 | +0.50 | 🟡 mild OK |
|    5 | AgCLV            | quality | 192/302 | 0.538 | -0.025 | +0.095 | +1.65 | flat |
|    6 | proven A         | depth   | 302/302 | 0.535 | +0.308 | +0.023 | +0.04 | flat |
|    7 | V12 score        | quality | 302/302 | 0.527 | -0.062 | +0.011 | +0.01 | flat |
|    8 | proven F−A       | depth   | 302/302 | 0.475 | +0.174 | -0.051 | -0.10 | flat |
|    9 | V12 agMean       | quality | 302/302 | 0.524 | +0.357 | +0.038 | +0.30 | flat |
|   10 | WA ForN          | depth   | 302/302 | 0.476 | +0.166 | -0.061 | -0.13 | flat |
|   11 | #F − #A          | depth   | 302/302 | 0.478 | +0.054 | -0.024 | -0.09 | flat |
|   12 | unopposed (A=0)  | depth   | 302/302 | 0.519 | +0.222 | +0.001 | +0.00 | flat |
|   13 | TopFor WR        | quality | 280/302 | 0.519 | +0.022 | +0.078 | +1.59 | flat |
|   14 | CLV AgN          | depth   | 301/302 | 0.516 | +0.190 | -0.002 | -0.01 | flat |
|   15 | #A sharps        | depth   | 302/302 | 0.515 | +0.165 | -0.007 | -0.02 | flat |
|   16 | netCLV           | quality | 297/302 | 0.485 | +0.020 | -0.024 | -0.52 | flat |
|   17 | v12 A count      | depth   | 302/302 | 0.508 | +0.194 | -0.009 | -0.03 | flat |
|   18 | #F sharps        | depth   | 302/302 | 0.494 | +0.185 | -0.041 | -0.11 | flat |
|   19 | TopAg WR         | quality | 174/302 | 0.505 | +0.069 | -0.043 | -0.68 | flat |
|   20 | CLV ForN         | depth   | 301/302 | 0.495 | +0.156 | -0.033 | -0.08 | flat |
|   21 | proven F         | depth   | 302/302 | 0.496 | +0.282 | -0.042 | -0.06 | flat |
|   22 | v12 F count      | depth   | 302/302 | 0.498 | +0.202 | -0.035 | -0.09 | flat |
|   23 | WA AgN           | depth   | 302/302 | 0.498 | +0.186 | -0.032 | -0.09 | flat |
|   24 | ForCLV           | quality | 297/302 | 0.498 | +0.010 | +0.032 | +0.55 | flat |
|   25 | AgWR             | quality | 174/302 | 0.501 | +0.127 | -0.017 | -0.21 | flat |

### (C) Working read

_N=302 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.571 · Δ +2.91 · higher on WINs (cov 280/302)
- **V12 forMean** — AUC 0.559 · Δ +5.04 · higher on WINs (cov 302/302)
- **ForWR** — AUC 0.542 · Δ +2.65 · higher on WINs (cov 280/302)
- **Tape** — AUC 0.542 · Δ +0.50 · higher on WINs (cov 279/302)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 332n · 52.7% · +2.8%   | 77n · 55.8% · +2.0%    | 218n · 52.8% · +2.2%   | 627n · 53.1% · +2.5%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 35n · 68.6% · +22.9%   | —                      | —                      | 35n · 68.6% · +22.9%   |
| UFC   | 24n · 75.0% · +16.0%   | —                      | —                      | 24n · 75.0% · +16.0%   |
| WNBA  | 14n · 71.4% · +6.8%    | 10n · 40.0% · -17.5%   | 5n · 80.0% · +82.0%    | 29n · 62.1% · +10.8%   |
| **All** | **412n · 55.6% · +6.1%** | **91n · 54.9% · +2.5%** | **228n · 53.5% · +4.1%** | **731n · 54.9% · +5.0%** |

> **V12's strongest sub-market:** WNBA TOTAL — 5 live, 4-1, +82.0% ROI, +10.99u PnL.
> **V12's weakest sub-market:** NBA ML — 5 live, 0-5, -100.0% ROI, -1.25u PnL. Consider tightening V12's threshold here.

## § 7 — Mute Audit

V12 muted **986** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                  986 |
| Muted W-L                           |              482-504 |
| Muted Win %                         |                48.9% |
| Counterfactual PnL at flat 1u       |               -60.53 |
| Counterfactual ROI at flat 1u       |                -6.1% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-60.53u** at a flat 1u stake — a counterfactual ROI of **-6.1%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-18 | MLB   | ML     | Boston Red Sox          |  -150 | +0.300 | CONFIRMED-Q1 |   6/4 |   5/3 |  52.3 |   62.1 |   +2.7 |  0.17 | HOLD     | 3.00u | WIN     |      +2.00 |
| 2026-08-18 | MLB   | ML     | Minnesota Twins         |  +120 | +0.961 | CONFIRMED-UNOPP |   2/4 |   2/1 |  41.1 |  100.0 |   -6.2 |  4.87 | BOOST    | 1.00u | WIN     |      +1.20 |
| 2026-08-18 | MLB   | ML     | Chicago White Sox       |  +163 | +0.782 | 2-for-0  |   3/2 |   2/0 |  48.6 |   69.0 |   +4.8 |  2.15 | HOLD     | 1.50u | LOSS    |      -1.50 |
| 2026-08-18 | MLB   | ML     | Los Angeles Angels      |  +156 | +0.946 | CONFIRMED-UNOPP |   3/1 |   2/0 |  42.8 |   71.2 |   -5.9 | -0.18 | MUTE     | 1.00u | WIN     |      +1.56 |
| 2026-08-18 | MLB   | ML     | Colorado Rockies        |  +178 | +0.076 | CONFIRMED-UNOPP |   2/3 |   2/3 |  51.8 |   67.2 |   -1.6 |  0.69 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-18 | MLB   | ML     | Athletics               |  +150 | +0.579 | PATH-D   |   1/3 |   1/2 |     — |      — |      — |     — | FAIL_OPEN | 1.00u | LOSS    |      -1.00 |
| 2026-08-18 | MLB   | ML     | San Francisco Giants    |  +186 | +0.980 | CONFIRMED-UNOPP |   1/2 |   1/0 |     — |      — |      — |     — | FAIL_OPEN | 1.00u | LOSS    |      -1.00 |
| 2026-08-18 | MLB   | ML     | Washington Nationals    |  +127 | +0.835 | HC-1     |   4/1 |   2/0 |  48.6 |   60.1 |   +9.6 |  2.27 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-08-18 | WNBA  | ML     | Las Vegas Aces          |  -151 | +0.949 | CONFIRMED-UNOPP |   2/0 |   1/0 |  55.0 |   57.5 |   +5.0 |  0.32 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-18 | WNBA  | ML     | Indiana Fever           |  -500 | +0.938 | CONFIRMED-UNOPP |   2/0 |   2/0 |  53.9 |   63.1 |   +3.9 |  0.95 | HOLD     | 1.00u | WIN     |      +0.20 |
| 2026-08-18 | WNBA  | ML     | Los Angeles Sparks      |  -130 | +0.944 | SHARP~   |   3/0 |   3/0 |  69.7 |   61.8 |  +19.7 |  3.91 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-08-18 | MLB   | SPREAD | Pittsburgh Pirates      |  +170 | +0.542 | SHARP~   |   1/1 |   1/1 |  57.0 |   66.7 |   +7.0 |  2.10 | HOLD     | 1.50u | WIN     |      +2.55 |
| 2026-08-18 | MLB   | SPREAD | Los Angeles Angels      |  -138 | +0.954 | 2-for-0  |   3/0 |   3/0 |  54.3 |   63.1 |   +5.6 |  0.92 | HOLD     | 3.00u | WIN     |      +2.17 |
| 2026-08-18 | MLB   | SPREAD | Toronto Blue Jays       |  -156 | +0.646 | MINI     |   1/0 |   1/0 |  51.8 |   67.2 |   +1.8 |  1.14 | HOLD     | 1.00u | WIN     |      +0.64 |
| 2026-08-18 | WNBA  | SPREAD | Las Vegas Aces          |  +101 | +0.957 | MINI-    |   3/2 |   1/0 |  55.0 |   57.5 |   +9.6 |  0.47 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-08-18 | WNBA  | SPREAD | Toronto Tempo           |  -110 | +0.674 | HC-1     |   1/1 |   1/1 |  62.5 |   59.0 |  +12.5 |  2.69 | HOLD     | 4.00u | WIN     |      +3.64 |
| 2026-08-18 | MLB   | TOTAL  | Over 8.5                |  +109 | +0.738 | PATH-D   |   1/3 |   1/1 |     — |      — |      — |     — | FAIL_OPEN | 1.00u | WIN     |      +1.09 |
| 2026-08-18 | MLB   | TOTAL  | Over 8.5                |  -127 | +0.454 | SHARP~   |   2/3 |   1/1 |  49.8 |   62.3 |   +2.0 |  1.25 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-18 | MLB   | TOTAL  | Under 8.5               |  +100 | +0.949 | 2-for-0  |   4/0 |   4/0 |  50.2 |   56.3 |   +1.5 | -0.93 | HOLD     | 3.00u | WIN     |      +3.00 |
| 2026-08-18 | MLB   | TOTAL  | Over 9.5                |  -108 | +0.970 | 2-for-0  |   3/0 |   3/0 |  54.4 |   66.9 |   +5.7 |  1.51 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-18 | MLB   | TOTAL  | Under 9.5               |  -133 | +0.630 | SHARP~   |   1/0 |   1/0 |  51.8 |   67.2 |   +1.8 |  1.14 | HOLD     | 1.00u | WIN     |      +0.75 |
| 2026-08-18 | MLB   | TOTAL  | Over 7.5                |  -114 | +0.660 | SHARP~   |   3/1 |   3/1 |  46.3 |   68.6 |   +2.3 |  2.94 | BOOST    | 1.00u | LOSS    |      -1.00 |
| 2026-08-18 | WNBA  | TOTAL  | Over 190.5              |  -100 | +0.992 | CONFIRMED-UNOPP |   2/1 |   1/0 |  51.4 |   60.4 |   +1.4 |  0.05 | HOLD     | 1.00u | WIN     |      +1.00 |
| 2026-08-18 | WNBA  | TOTAL  | Under 169.5             |  -109 | +0.112 | SHARP~   |   2/3 |   2/3 |  62.5 |   48.7 |  +17.2 |  1.37 | HOLD     | 4.00u | WIN     |      +3.67 |
| 2026-08-17 | MLB   | ML     | Arizona Diamondbacks    |  +133 | +0.982 | SHARP    |   1/1 |   1/0 |  55.6 |   80.0 |  +13.8 |  7.25 | BOOST    | 2.50u | LOSS    |      -2.50 |
| 2026-08-17 | MLB   | ML     | Minnesota Twins         |  +119 | +0.264 | CONFIRMED-Q1 |   3/6 |   1/2 |  44.4 |  100.0 |   +1.5 |  6.74 | BOOST    | 4.00u | WIN     |      +4.76 |
| 2026-08-17 | MLB   | ML     | Baltimore Orioles       |  +150 | +0.973 | MINI     |   4/3 |   2/1 |  49.8 |   59.6 |   +4.3 |  2.00 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-17 | MLB   | ML     | Chicago Cubs            |  -154 | +0.239 | CONFIRMED-Q1 |   4/3 |   4/3 |  54.1 |   65.8 |   +3.3 | -0.46 | HOLD     | 3.00u | WIN     |      +1.95 |
| 2026-08-17 | MLB   | ML     | Pittsburgh Pirates      |  -102 | +0.174 | PATH-D   |  4/14 |   3/5 |  53.0 |   65.8 |   +2.7 |  1.03 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-17 | MLB   | ML     | Miami Marlins           |  +225 | +0.855 | SHARP    |   2/1 |   2/1 |  63.6 |   71.3 |  +17.2 |  5.37 | BOOST    | 1.00u | LOSS    |      -1.00 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.524 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.072 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.029 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.011 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.016 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  726 |    +0.0063 |    +0.0137 | 0.0000 |  +0.001 |   0.951 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  726 |    +0.0356 |    +0.5177 | 0.0003 |  +0.016 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  726 |    -0.5265 |    +0.5856 | 0.0017 |  -0.042 |   2.866 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 726 |          +0.077 |           -0.018 |                   +0.056 |                   -0.003 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 726 |          -0.002 |           +0.309 |                   +0.015 |                   +0.113 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 726 |          +0.004 |           +0.138 |                   -0.016 |                   +0.017 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 726 |          -0.017 |           +0.166 |                   +0.007 |                   +0.090 | count of contributing AGAINST-side wallets                     |
| provenFor         | 726 |          +0.012 |           +0.129 |                   +0.001 |                   +0.052 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 726 |          +0.007 |           +0.105 |                   +0.023 |                   +0.058 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 6.172          | 242 | 134-108 |   55.4% |     +1.8% |
| MID (p33–p67)     | 19.950 … 16.106        | 243 | 124-119 |   51.0% |     -1.6% |
| HIGH (> p67)      | 48.906 … 61.632        | 241 | 140-101 |   58.1% |     +1.9% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       726 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8563 | average score across live picks                                 |
| SD                |    0.2268 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.133 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +3.521 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.469 / +0.961 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  623 | 331-292 |   53.1% |     +2.3% |  0.505 |        -0.080 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   34 | 23-11  |   67.6% |    +22.6% |  0.522 |        -0.183 | noise                                     |
| UFC   |   24 | 18-6   |   75.0% |    +16.0% |  0.648 |        +0.175 | strong                                    |
| WNBA  |   29 | 18-11  |   62.1% |    +10.8% |  0.515 |        -0.142 | noise                                     |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.474, 0.449, 0.451, 0.406, 0.461, 0.496, 0.575, 0.628, 0.604, 0.619, 0.582, 0.546, 0.564, 0.545]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18"]
    y-axis "edge (pp)" -17 --> 9
    line [8, 3.1, -1.3, -6.3, -5.7, -11.7, -11.9, -15.7, -7, -1.3, -3, -1.3, -0.2, 1.1]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
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
| 2026-08-18 |    7 |  107 | 57-50  |   53.3% |    +11.7% |  0.545 |      +1.1pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.505 avg in first half → 0.541 avg in second half · Δ = +0.035)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.0% | [-2.7%, +12.9%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.9% | [51.1%, 58.4%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.524 | [0.484, 0.564]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             71 | [16, 122]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       731 |
| Unique wallets ever on a FOR side            |                                                       190 |
| Avg FOR-side wallets per pick                |                                                      2.67 |
| Top-5 wallets' share of all FOR appearances  |                                                     24.8% |
| Top-10 wallets' share of all FOR appearances |                                                     43.8% |
| Top-20 wallets' share of all FOR appearances |                                                     61.4% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  117 |   13 | 64-53  |   54.7% |    +10.6% |    +36.53 |     1.52× | CONFIRMED   |     -0.7% |     266 | 2026-08-18 |
|    2 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    3 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    4 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     334 | 2026-08-05 |
|    5 | cd2f63  | MLB,NBA,SOC,WNBA |   80 |   41 | 43-37  |   53.8% |    +14.7% |    +35.02 |     1.19× | CONFIRMED   |     +8.3% |     483 | 2026-08-18 |
|    6 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|    7 | 0f9d74  | MLB,NBA,SOC,UFC |   75 |   50 | 41-34  |   54.7% |    +10.9% |    +21.55 |     0.46× | CONFIRMED   |    +16.9% |     310 | 2026-08-18 |
|    8 | 4b912c  | MLB,SOC,WNBA |   75 |   25 | 44-31  |   58.7% |    +10.3% |    +19.65 |     1.27× | CONFIRMED   |     -2.2% |     203 | 2026-08-18 |
|    9 | eeabaf  | MLB,NBA,SOC |   72 |   30 | 36-36  |   50.0% |     +1.3% |     +2.63 |     1.24× | CONFIRMED   |     +6.1% |     285 | 2026-08-18 |
|   10 | 2f2a9e  | MLB,SOC,WNBA |   72 |   32 | 38-34  |   52.8% |     -6.5% |    -13.09 |     2.07× | CONFIRMED   |     -7.8% |     267 | 2026-08-15 |
|   11 | 7923c4  | MLB,NBA,UFC |   52 |   16 | 31-21  |   59.6% |    +25.2% |    +32.09 |     0.73× | CONFIRMED   |     +9.8% |     219 | 2026-08-18 |
|   12 | 7da3d5  | MLB,SOC,UFC,WNBA |   42 |   57 | 19-23  |   45.2% |    -13.0% |    -15.47 |     4.63× | CONFIRMED   |     -8.2% |     250 | 2026-08-17 |
|   13 | 705ba1  | MLB        |   38 |   17 | 18-20  |   47.4% |     -6.3% |     -7.31 |     1.16× | FLAT        |     +7.0% |     170 | 2026-08-17 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   35 |   18 | 16-19  |   45.7% |     -5.9% |     -6.01 |     1.21× | CONFIRMED   |     -6.3% |     157 | 2026-08-18 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 |   22 | 19-15  |   55.9% |     +0.8% |     +0.85 |     1.36× | CONFIRMED   |    +13.8% |     143 | 2026-07-30 |
|   16 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   17 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   18 | 621848  | MLB,UFC,WNBA |   28 |   10 | 14-14  |   50.0% |    -10.6% |     -9.03 |     0.36× | FLAT        |     +0.3% |      71 | 2026-08-18 |
|   19 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |
|   20 | f2f960  | MLB        |   26 |   16 | 12-14  |   46.2% |    -15.0% |    -13.64 |     2.90× | —           |     -6.2% |      91 | 2026-08-04 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-18 |
|    2 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    3 | 9a4d38  | MLB,UFC,WNBA |   13 | 9-4    |   69.2% |     +37.7% |    +12.40 |     0.15× | 2026-08-18 |
|    4 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|    5 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    6 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|    7 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|    8 | 7923c4  | MLB,NBA,UFC |   52 | 31-21  |   59.6% |     +25.2% |    +32.09 |     0.73× | 2026-08-18 |
|    9 | f9e3d0  | MLB,NBA    |   10 | 5-5    |   50.0% |     +23.2% |     +7.23 |     1.43× | 2026-08-01 |
|   10 | 7dd2e5  | UFC        |   19 | 15-4   |   78.9% |     +21.0% |    +17.56 |     1.13× | 2026-08-15 |
|   11 | c911a4  | MLB,NBA,SOC |   21 | 11-10  |   52.4% |     +17.0% |    +10.19 |     4.63× | 2026-08-01 |
|   12 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 | 64-37  |   63.4% |     +15.8% |    +53.36 |     1.54× | 2026-07-19 |
|   13 | b839b3  | MLB,NBA,SOC,UFC |   25 | 16-9   |   64.0% |     +15.5% |    +13.19 |     1.34× | 2026-08-18 |
|   14 | 9a69c2  | MLB,SOC    |   26 | 14-12  |   53.8% |     +14.8% |     +9.18 |     2.30× | 2026-07-10 |
|   15 | cd2f63  | MLB,NBA,SOC,WNBA |   80 | 43-37  |   53.8% |     +14.7% |    +35.02 |     1.19× | 2026-08-18 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 8ec926  | MLB,UFC,WNBA |   14 | 5-9    |   35.7% |     -36.6% |    -15.75 |     5.48× | 2026-08-15 |
|    3 | c9bba3  | MLB,SOC    |   14 | 7-7    |   50.0% |     -28.6% |     -9.38 |     0.81× | 2026-08-18 |
|    4 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    5 | 7da3d5  | MLB,SOC,UFC,WNBA |   42 | 19-23  |   45.2% |     -13.0% |    -15.47 |     4.63× | 2026-08-17 |
|    6 | ac9705  | MLB        |   18 | 8-10   |   44.4% |     -11.5% |     -8.36 |     2.24× | 2026-08-02 |
|    7 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    8 | 621848  | MLB,UFC,WNBA |   28 | 14-14  |   50.0% |     -10.6% |     -9.03 |     0.36× | 2026-08-18 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   72 | 38-34  |   52.8% |      -6.5% |    -13.09 |     2.07× | 2026-08-15 |
|   10 | 705ba1  | MLB        |   38 | 18-20  |   47.4% |      -6.3% |     -7.31 |     1.16× | 2026-08-17 |
|   11 | bc35e3  | MLB,SOC,UFC,WNBA |   35 | 16-19  |   45.7% |      -5.9% |     -6.01 |     1.21× | 2026-08-18 |
|   12 | ad88a3  | MLB,SOC    |   20 | 10-10  |   50.0% |      -5.7% |     -4.05 |     0.28× | 2026-08-13 |
|   13 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 | 19-15  |   55.9% |      +0.8% |     +0.85 |     1.36× | 2026-07-30 |
|   14 | 4c64aa  | MLB        |   92 | 50-42  |   54.3% |      +1.1% |     +1.94 |     0.84× | 2026-08-05 |
|   15 | eeabaf  | MLB,NBA,SOC |   72 | 36-36  |   50.0% |      +1.3% |     +2.63 |     1.24× | 2026-08-18 |

> 🔴 **7 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `f2f960` (FOR# 26, ROI -15.0%), `7da3d5` (FOR# 42, ROI -13.0%), `1e8f33` (FOR# 94, ROI -10.7%), `621848` (FOR# 28, ROI -10.6%), `2f2a9e` (FOR# 72, ROI -6.5%), `705ba1` (FOR# 38, ROI -6.3%), `bc35e3` (FOR# 35, ROI -5.9%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1457 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   330 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    10 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    58 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   329 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            236 |        51 |   29 |   15 |  141 |                     95 |
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
| v12     | 06-01 → present      |   80 |    731 | 986 | 401-330 |  54.9% |      5.0% |    +100.59 |    +0.14 | 0.505 |        0.2497 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  671 |    +1.5pp |    +13.9pp |          +0.311 |   -0.044 |    +0.0903 | 🟡 mixed |
| v12 − v10          | +  669 |    +6.5pp |    +23.7pp |          +0.451 |   +0.111 |    +0.0307 | 🟢 better |
| v12 − v11          | +  620 |    -0.1pp |     +2.1pp |          +0.077 |   +0.061 |    +0.0145 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 627n 53.1% +2% | 10n 30.0% +29% | 6n 83.3% +38%  | 35n 68.6% +23% | 24n 75.0% +16% | 29n 62.1% +11% | 731n 54.9% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 139n +3%      | 211n +0%      | 169n +11%     | 102n -5%      | 105n +21%     | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~1999 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 965 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 726 / 965 (75%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 726 / 965 (75%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 726 / 965 (75%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 726 / 965 (75%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 726 / 965 (75%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 726 / 965 (75%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 726 / 965 (75%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 965 / 965 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 965 / 965 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 965 / 965 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 965 / 965 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 965 / 965 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 965 / 965 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 958 / 965 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 956 / 965 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 965 / 965 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 964 / 965 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 586 / 965 (61%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 964 / 965 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 586 / 965 (61%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 585 / 965 (61%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 965 / 965 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 965 / 965 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 965 / 965 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 964 / 965 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 965 / 965 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd contribMargin     | 965 |      |    -0.036 |    -0.168 |      -0.058 |      -0.114 |  0.466 |
|    2 | V12 forMean          | 726 |  🟢  |    +0.077 |    -0.018 |      +0.056 |      -0.003 |  0.531 |
|    3 | qMargin              | 726 |  🟢  |    +0.079 |    -0.033 |      +0.055 |      -0.014 |  0.529 |
|    4 | wd agCount           | 586 |      |    +0.018 |    +0.270 |      +0.045 |      +0.121 |  0.513 |
|    5 | wd maxForContrib     | 964 |      |    -0.051 |    -0.107 |      -0.043 |      -0.049 |  0.486 |
|    6 | wd contribFor        | 965 |      |    -0.034 |    -0.107 |      -0.040 |      -0.077 |  0.476 |
|    7 | wd agAvgSize         | 586 |      |    +0.015 |    +0.049 |      +0.036 |      +0.045 |  0.508 |
|    8 | wd sizeMargin        | 585 |      |    -0.011 |    -0.042 |      -0.036 |      -0.064 |  0.499 |
|    9 | wd forCount          | 964 |      |    -0.020 |    +0.065 |      -0.031 |      -0.028 |  0.482 |
|   10 | provenMargin         | 965 |      |    -0.013 |    +0.040 |      -0.031 |      -0.026 |  0.489 |
|   11 | lockPinnProb         | 958 |      |    +0.181 |    +0.146 |      +0.029 |      -0.136 |  0.596 |
|   12 | clv                  | 956 |      |    -0.019 |    +0.041 |      -0.029 |      +0.011 |  0.512 |
|   13 | provenFor            | 965 |      |    -0.019 |    +0.015 |      -0.026 |      -0.034 |  0.492 |
|   14 | hcMargin             | 965 |      |    -0.004 |    +0.197 |      -0.023 |      +0.057 |  0.514 |
|   15 | countMargin          | 726 |      |    +0.016 |    +0.054 |      -0.021 |      -0.037 |  0.495 |
|   16 | peakStars            | 965 |      |    +0.001 |    +0.054 |      -0.019 |      -0.017 |  0.499 |
|   17 | ags (v11)            | 965 |      |    +0.004 |    +0.011 |      -0.019 |      -0.045 |  0.513 |
|   18 | provenTotal          | 965 |      |    -0.018 |    -0.021 |      -0.017 |      -0.026 |  0.498 |
|   19 | wd contribAg         | 965 |      |    -0.003 |    +0.150 |      +0.017 |      +0.061 |  0.501 |
|   20 | V12 forCount         | 726 |  🟢  |    +0.004 |    +0.138 |      -0.016 |      +0.017 |  0.507 |
|   21 | wd maxShare          | 965 |      |    +0.017 |    -0.045 |      +0.016 |      +0.003 |  0.511 |
|   22 | V12 agMean           | 726 |  🟢  |    -0.002 |    +0.309 |      +0.015 |      +0.113 |  0.503 |
|   23 | wd forAvgSize        | 964 |      |    +0.004 |    +0.021 |      -0.011 |      -0.012 |  0.518 |
|   24 | V12 agCount          | 726 |  🟢  |    -0.017 |    +0.166 |      +0.007 |      +0.090 |  0.508 |
|   25 | agsV12               | 726 |  🟢  |    +0.016 |    -0.029 |      +0.001 |      -0.011 |  0.524 |
|   26 | provenAg             | 965 |      |    -0.013 |    +0.139 |      +0.001 |      +0.062 |  0.506 |

> **Top 3 univariate features by PnL correlation:** `wd contribMargin` (r = -0.058), `V12 forMean` (r = +0.056), `qMargin` (r = +0.055).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd contribMargin` — r(unit-ret) = -0.058, AUC = 0.466. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd contribMargin` · r(unit-ret) = -0.058 · AUC = 0.466

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -93.400        | 323 | 185-138 |   57.3% |     +2.6% |
| MID (p33–p67)     | 57.800 … 51.800          | 321 | 178-143 |   55.5% |     +1.2% |
| HIGH (> p67)      | 174.100 … 111.900        | 321 | 162-159 |   50.5% |     -2.5% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.056 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 6.172            | 242 | 134-108 |   55.4% |     +1.8% |
| MID (p33–p67)     | 19.950 … 16.106          | 243 | 124-119 |   51.0% |     -1.6% |
| HIGH (> p67)      | 48.906 … 61.632          | 241 | 140-101 |   58.1% |     +1.9% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.055 · AUC = 0.529

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 1.297            | 242 | 132-110 |   54.5% |     +1.1% |
| MID (p33–p67)     | 19.950 … 16.106          | 242 | 127-115 |   52.5% |     -0.2% |
| HIGH (> p67)      | 46.556 … 61.632          | 242 | 139-103 |   57.4% |     +1.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd agCount` · r(unit-ret) = +0.045 · AUC = 0.513

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 284 | 152-132 |   53.5% |     -0.3% |
| MID (p33–p67)     | 2.000 … 2.000            | 142 | 74-68   |   52.1% |     -1.6% |
| HIGH (> p67)      | 3.000 … 3.000            | 160 | 91-69   |   56.9% |     +3.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd maxForContrib` · r(unit-ret) = -0.043 · AUC = 0.486

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 19.700          | 322 | 182-140 |   56.5% |     +2.1% |
| MID (p33–p67)     | 52.400 … 46.000          | 321 | 175-146 |   54.5% |     +0.4% |
| HIGH (> p67)      | 100.000 … 101.700        | 321 | 168-153 |   52.3% |     -1.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd contribMargin | V12 forMean    | qMargin        | wd agCount     | wd maxForContrib | wd contribFor  | wd agAvgSize   | wd sizeMargin  |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd contribMargin |  1.000         |         +0.096 |         +0.077 |         -0.142 |         +0.517 |         +0.773 |         -0.153 |         +0.279 |
| V12 forMean |         +0.096 |  1.000         |         +0.963 |         +0.166 |         +0.268 |         +0.200 |         -0.014 |         +0.216 |
| qMargin     |         +0.077 |         +0.963 |  1.000         |         +0.047 |         +0.206 |         +0.100 |         -0.035 |         +0.196 |
| wd agCount  |         -0.142 |         +0.166 |         +0.047 |  1.000         |         +0.314 |         +0.473 |         +0.100 |         +0.037 |
| wd maxForContrib |         +0.517 |         +0.268 |         +0.206 |         +0.314 |  1.000         |         +0.662 |         +0.024 |         +0.299 |
| wd contribFor |         +0.773 |         +0.200 |         +0.100 |         +0.473 |         +0.662 |  1.000         |         -0.011 |         +0.239 |
| wd agAvgSize |         -0.153 |         -0.014 |         -0.035 |         +0.100 |         +0.024 |         -0.011 |  1.000         |         -0.747 |
| wd sizeMargin |         +0.279 |         +0.216 |         +0.196 |         +0.037 |         +0.299 |         +0.239 |         -0.747 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.963. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 468 picks · features = 8 (+ intercept) · multiple R² = **0.0182** · adjusted R² = **-0.0011** · residual sd = 0.951

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.2897 |   0.2011 | -1.44        |        1 |
|    2 | wd agCount           |     |    +0.1913 |   0.1227 | +1.56 (~sig) |        2 |
|    3 | wd contribMargin     |     |    +0.1805 |   0.1764 | +1.02        |        3 |
|    4 | V12 forMean          |  🟢 |    +0.0860 |   0.1937 | +0.44        |        4 |
|    5 | wd agAvgSize         |     |    +0.0712 |   0.0752 | +0.95        |        5 |
|    6 | qMargin              |  🟢 |    -0.0173 |   0.1890 | -0.09        |        6 |
|    7 | wd sizeMargin        |     |    +0.0130 |   0.0776 | +0.17        |        7 |
|    8 | wd maxForContrib     |     |    +0.0119 |   0.0635 | +0.19        |        8 |
| —    | (intercept)          |     |    +0.0260 |   0.0440 |    +0.59 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `V12 forMean` (β = +0.086), `qMargin` (β = -0.017)
- V12 IGNORES: `wd contribFor` (β = -0.290, t = -1.44), `wd agCount` (β = +0.191, t = +1.56), `wd contribMargin` (β = +0.180, t = +1.02), `wd agAvgSize` (β = +0.071, t = +0.95), `wd sizeMargin` (β = +0.013, t = +0.17), `wd maxForContrib` (β = +0.012, t = +0.19)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.524 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.561 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.038.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd agCount` (β = +0.191, t = +1.56). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of -0.0011 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*