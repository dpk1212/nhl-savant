# AGS-Unified — V12 Daily Monitor

**Generated:** Sunday, August 23, 2026 at 9:11 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (84 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (84 days ago), V12 has evaluated **2420** picks, shipped **794** for real money (32.8% ship rate), and muted the other **1626**. On the shipped picks V12 has gone **433-361** (54.5% win), staked **2182.60u**, and returned **+98.16u** at **+4.5% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             84 |
| Picks V12 has evaluated             |                           2420 |
| Picks SHIPPED (units > 0)           |                            794 |
| Picks MUTED (score ≤ 0, FADE)       |                           1626 |
| Ship rate                           |                          32.8% |
| Live W-L                            |                        433-361 |
| Live Win %                          |                          54.5% |
| Live PnL (units)                    |                         +98.16 |
| Live ROI                            |                          +4.5% |
| Avg PnL / day                       |                         +1.17u |
| Most recent action (2026-08-23)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.5% ROI** across 794 live picks (+98.16u real PnL).
- Mute rule is **saving money** — the 1080 muted picks would have lost -62.99u at flat 1u (-5.8% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.17u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **197-168** · +5.1% ROI · +51.55u on 365 graded — see § 5.

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

**Full book:** 84d · 794 live · 433-361 · **+98.16u** · +4.5% ROI · +1.17u/day.

_Prior to table (2026-06-01 → 2026-08-02): 574 live · 321-253 · +74.84u · cum through prior = +74.84u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-08-19 |        41 |   13 |    18 | 6-7        |  46.2% |     18.50 |      +1.20 |      6.5% |    +101.79 |
| 2026-08-20 |        35 |   12 |    17 | 4-8        |  33.3% |     37.60 |      -5.27 |    -14.0% |     +96.52 |
| 2026-08-21 |        47 |   18 |    23 | 10-8       |  55.6% |     42.20 |      -5.56 |    -13.2% |     +90.96 |
| 2026-08-22 |        69 |   20 |    36 | 12-8       |  60.0% |     58.80 |      +7.20 |     12.2% |     +98.16 |
| 2026-08-23 |        28 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +98.16 |

> **Trajectory.** 🟡 Last 3 days (1.6% ROI) **-3.0pp** vs prior (4.6%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-22**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 15 | 11-4 | +43.2% | +27.41u | +1.83u | -23.5% |
| 🟢 2 | RANK 2-for-0 rescue | B | 85 | 47-38 | +10.2% | +31.44u | +0.37u | -30.0% |
| 🟢 3 | MINI (gate-pass) | A | 77 | 46-31 | +9.2% | +19.37u | +0.25u | +36.5% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 91 | 58-33 | +15.0% | +61.90u | sized UP after path |
| 2 | Tape HOLD (mid) | 239 | 124-115 | +1.0% | +4.98u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Tape MUTE (tape<0 → 0u) | 60 | 29-31 | -4.0% | -2.40u | 🟢 saving $ |
| 2 | fadeTop≥60 MUTE | 6 | 3-3 | -2.6% | -0.15u | 🟡 flat |
| 3 | Score FADE (≤0 → 0u) | 620 | 306-314 | -2.4% | -15.17u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 15 | 11-4 | 73.3% | 63.5u | +27.41u | +43.2% | +1.83u | 2 | -23.5% | -1.00u | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 99 | 59-40 | 59.6% | 367.5u | +15.33u | +4.2% | +0.15u | 20 | -9.8% | -3.09u | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 85 | 47-38 | 55.3% | 308.0u | +31.44u | +10.2% | +0.37u | 15 | -30.0% | — | 🔻 cooling |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 68 | 32-36 | 47.1% | 217.8u | -13.15u | -6.0% | -0.19u | 7 | -4.4% | +2.90u | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 91 | 49-42 | 53.8% | 248.0u | +10.62u | +4.3% | +0.12u | 29 | +21.7% | +2.07u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 77 | 46-31 | 59.7% | 209.8u | +19.37u | +9.2% | +0.25u | 18 | +36.5% | +7.04u | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 19 | 11-8 | 57.9% | 25.5u | +2.27u | +8.9% | +0.12u | 4 | -63.0% | — | 🔻 cooling |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 22 | 12-10 | 54.5% | 22.4u | +1.89u | +8.5% | +0.09u | 4 | +0.3% | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 91 | 58-33 | 63.7% | 413.3u | +61.90u | +15.0% | 32 | +10.4% | +9.24u |
| Tape HOLD (mid) | TAPE | staked | 239 | 124-115 | 51.9% | 524.1u | +4.98u | +1.0% | 94 | -1.1% | -1.04u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 8 | -25.4% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 60 | 29-31 | 48.3% | 60.0u | -2.40u | -4.0% | 25 | -11.2% | -4.00u |
| fadeTop≥60 MUTE | E | CF 1u | 6 | 3-3 | 50.0% | 6.0u | -0.15u | -2.6% | 4 | -3.8% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 620 | 306-314 | 49.4% | 620.0u | -15.17u | -2.4% | 79 | +9.9% | +6.09u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 2 / -24% | — | — |
| TOP | 34 / -3% | 21 / +2% | 4 / -16% |
| RANK | 41 / +1% | 5 / +46% | — |
| SHARP | 14 / -13% | 28 / +1% | 1 / -100% |
| SHARP-LEAN | 65 / +0% | 23 / +11% | 3 / -30% |
| MINI | 28 / +12% | 8 / +56% | 4 / +1% |
| MINI- | 5 / -34% | 1 / +45% | 3 / -5% |
| DISSENT | 13 / +19% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-08-22)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| MINI (gate-pass) | 2 | 2-0 | +7.04u | +83.8% |
| SHARP EDGE/net BOTH | 1 | 1-0 | +2.90u | +53.7% |
| SHARP-LEAN EDGE/net ONE | 4 | 2-2 | +2.07u | +22.0% |
| HC-2 SUPER | 1 | 0-1 | -1.00u | -100.0% |
| HC-1 TOP | 6 | 4-2 | -3.09u | -10.8% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  16 | 11-4   |  73.3% |       63.50 |     +27.41 |     43.2% |
| TOP PICK (TOP+/TOP)       |  4-5u | 171 | 74-54  |  57.8% |      500.00 |      +3.39 |      0.7% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 431 | 134-124 |  51.9% |      822.75 |     +22.30 |      2.7% |
| STRONG (MINI)             |    3u |  92 | 46-31  |  59.7% |      209.75 |     +19.37 |      9.2% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  76 | 25-21  |  54.3% |       52.85 |      +2.14 |      4.0% |
| **STAKED TOTAL** |     — | 524 | 290-234 |  55.3% |     1648.85 |     +74.61 |     +4.5% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  16 | 11-4   |  73.3% |       63.50 |     +27.41 |     43.2% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 142 | 59-40  |  59.6% |      367.50 |     +15.33 |      4.2% |
| B · 2-for-0 rescue    | RANK        |    4u | 114 | 47-38  |  55.3% |      307.95 |     +31.44 |     10.2% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 213 | 49-42  |  53.8% |      248.04 |     +10.62 |      4.3% |
| C · proven-$ consensus | SHARP       |    3u |  90 | 32-36  |  47.1% |      217.76 |     -13.15 |     -6.0% |
| A · mini-HC (gate-pass) | MINI        |    3u |  92 | 46-31  |  59.7% |      209.75 |     +19.37 |      9.2% |
| C · mini gate-cut     | MINI-       |    1u |  23 | 11-8   |  57.9% |       25.50 |      +2.27 |      8.9% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  47 | 12-10  |  54.5% |       22.35 |      +1.89 |      8.5% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 522 picks tracked at 0u (would-be 252-270, 48.3% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (11-5, +27.41u)  ·  🟢 TOP PICK (95-76, +3.39u)  ·  🟠 SHARP PLAY (216-215, +22.30u)  ·  🔴 STRONG (57-35, +19.37u)  ·  🟣 LEAN (39-37, +2.14u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22"]
    y-axis "PnL (u)" -14 --> 32
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 51, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 1108 | 1102 | 1060 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 60 | 29-31 | 48.3% | 4.00u | -1.44u | -36.0% |
| HOLD      | 313 | 152-161 | 48.6% | 527.07u | +1.98u | +0.4% |
| BOOST     | 113 | 70-43 | 61.9% | 416.78u | +63.98u | +15.4% |
| FAIL_OPEN | 35 | 18-17 | 51.4% | 54.50u | -15.17u | -27.8% |
| PASS      | 539 | 277-262 | 51.4% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 323 | 168-155 | 52.0% | -3.61u |
| hold (0–2.89) | path u | 473 | 230-243 | 48.6% | +8.53u |
| boost (≥2.89) | ×1.35 | 133 | 79-54 | 59.4% | +58.33u |

_Score coverage: **929/1060** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 60 | +7.58u | -7.58u | +35.75u | +43.33u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 93 | +45.09u | +63.98u | +18.89u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-23 | SOC | Manchester City FC | CONFIRMED-UNOPP | -1.52 | MUTE | 1.00u | 1.00u | — |
| 2026-08-23 | SOC | Liverpool FC | HC-2 | 4.81 | BOOST | 6.00u | 6.00u | — |
| 2026-08-23 | WNBA | Under 173.5 | MINI- | 4.69 | BOOST | 4.00u | 5.40u | — |
| 2026-08-22 | MLB | Houston Astros | PATH-D | -0.81 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-22 | NFL | Bills | SHARP | 3.21 | BOOST | 2.50u | 0.00u | WIN |
| 2026-08-22 | NFL | Bengals | SHARP~ | 6.41 | BOOST | 2.50u | 0.00u | WIN |
| 2026-08-22 | NFL | Cowboys | SHARP~ | 3.29 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-22 | NFL | Eagles | SHARP~ | 7.23 | BOOST | 4.00u | 0.00u | LOSS |
| 2026-08-22 | SOC | Brentford FC | SHARP | 6.96 | BOOST | 2.50u | 0.00u | WIN |
| 2026-08-22 | UFC | Anthony Hernandez | SHARP | 3.86 | BOOST | 3.00u | 0.00u | LOSS |
| 2026-08-22 | UFC | Carli Judice | HC-1 | 12.58 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-22 | UFC | Shamil Gaziev | MINI | 8.23 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-22 | UFC | Lerryan Douglas | HC-1 | 6.45 | BOOST | 4.00u | 5.40u | LOSS |
| 2026-08-22 | UFC | Reinier de Ridder | HC-1 | 8.66 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-22 | UFC | Marcio Barbosa | HC-1 | 10.83 | BOOST | 4.00u | 5.40u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-1.19** · nPriors=502 · source=expanding_q1 · asOf=2026-08-23 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 662 | 586 | 556 | 129 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 44 | 16-28 | 36.4% | 7.00u | -3.21u | -45.9% |
| HOLD      | 156 | 84-72 | 53.8% | 169.70u | +28.78u | +17.0% |
| FAIL_OPEN | 25 | 12-13 | 48.0% | 41.90u | -2.08u | -5.0% |
| EXEMPT    | 174 | 84-90 | 48.3% | 268.60u | -2.05u | -0.8% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -48.5 … -0.6 | 22 | 5-17 | 22.7% | 0.0u | +0.00u | — |
| Q2 | -0.4 … 1.5 | 23 | 13-10 | 56.5% | 26.9u | +20.08u | +74.6% |
| Q3 | 1.6 … 6.3 | 22 | 10-12 | 45.5% | 33.1u | -0.98u | -3.0% |
| Q4 | 6.5 … 13.0 | 23 | 13-10 | 56.5% | 39.4u | +6.78u | +17.2% |
| Q5 | 13.9 … 1802.6 | 23 | 11-12 | 47.8% | 31.8u | -1.10u | -3.5% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 44 | 16-28 | -15.07u | +15.07u | +32.50u | +17.43u |

> 🟢 **Mute is saving money** (Δ +15.07u · muted WR 36.4%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 4 | 3-1 | 75.0% | 6.0u | +2.60u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 15 | 3-12 | 20.0% | 16.5u | -10.63u |
| MLB | 31 | 11-20 | 35.5% | 35.5u | -10.56u |
| WNBA | 13 | 5-8 | 38.5% | 15.0u | -4.51u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-08-23 | WNBA | Portland Fire | SHARP~ | -2.3 | -1.2 | 1.00u | pending |
| 2026-08-23 | WNBA | Indiana Fever | 2-for-0 | -14.6 | -1.2 | 1.00u | pending |
| 2026-08-23 | WNBA | Toronto Tempo | SHARP~ | -3.3 | -1.2 | 1.00u | pending |
| 2026-08-23 | WNBA | Portland Fire | CONFIRMED-UNOPP | -15.5 | -1.2 | 1.00u | pending |
| 2026-08-23 | MLB | Under 8.5 | CONFIRMED-UNOPP | -1.5 | -1.2 | 1.00u | pending |
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
| 2026-08-19 | MLB | St. Louis Cardinals | CONFIRMED-UNOPP | -0.4 | -0.2 | 1.00u | LOSS |
| 2026-08-19 | MLB | Under 8.5 | SHARP~ | -6.4 | -0.2 | 1.00u | LOSS |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 50 | 28-22 | 56.0% | 131.2u | +24.78u | +18.9% |
| Muted (Q1 → 0u) | 44 | 16-28 | 36.4% | 7.0u | -3.21u | -45.9% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 119–67 · 64% · +17.3%); **5–10 is the hole** (61–58 · 51.3% · -4.3%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 576 tickets · cov 549/576 (stamp 347 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 244 | 123–121 | 50.4% | -5.1% |
| 5–10 | 119 | 61–58 | 51.3% | -4.3% |
| ≥10 | 186 | 119–67 | 64.0% | +17.3% |
| All | 576 | 315–261 | 54.7% | +4.5% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (97) | 57.9% (57) | 70.4% (81) |
| B | 50.8% (59) | 55.6% (9) | 70.6% (17) |
| C | 41.7% (36) | 46.8% (47) | 56.6% (83) |

##### Jul 15+ · 365 tickets · cov 344/365 (stamp 342 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 138 | 70–68 | 50.7% | -1.8% |
| 5–10 | 80 | 38–42 | 47.5% | -10.4% |
| ≥10 | 126 | 80–46 | 63.5% | +14.7% |
| All | 365 | 197–168 | 54.0% | +5.1% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 47.4% (38) | 57.1% (28) | 72.5% (40) |
| B | 48.5% (33) | 25% (4) | 70% (10) |
| C | 46.7% (15) | 47.6% (42) | 57.5% (73) |

##### Yesterday (Aug 22) · 20 tickets · cov 20/20 (stamp 20 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 8 | 4–4 | 50.0% | -12.1% |
| 5–10 | 4 | 2–2 | 50.0% | +32.6% |
| ≥10 | 8 | 6–2 | 75.0% | +12.5% |
| All | 20 | 12–8 | 60.0% | +12.2% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 0% (1) | 100% (2) | 66.7% (6) |
| C | 50% (2) | 0% (1) | 100% (2) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 576 tickets · cov 570/576 (stamp 359 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 369 | 199–170 | 53.9% | +1.7% |
| 5–10 | 101 | 55–46 | 54.5% | +11.8% |
| ≥10 | 100 | 59–41 | 59.0% | +9.0% |
| All | 576 | 315–261 | 54.7% | +4.5% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.2% (152) | 50% (42) | 73.5% (49) |
| B | 55.6% (63) | 58.3% (12) | 50% (10) |
| C | 49.5% (103) | 60% (35) | 42.9% (35) |

##### Jul 15+ · 365 tickets · cov 360/365 (stamp 359 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 219 | 121–98 | 55.3% | +6.5% |
| 5–10 | 78 | 42–36 | 53.8% | +13.3% |
| ≥10 | 63 | 32–31 | 50.8% | -6.9% |
| All | 365 | 197–168 | 54.0% | +5.1% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 63.8% (58) | 46.2% (26) | 64.3% (28) |
| B | 48.6% (35) | 62.5% (8) | 50% (4) |
| C | 53.9% (76) | 59.4% (32) | 38.5% (26) |

##### Yesterday (Aug 22) · 20 tickets · cov 20/20 (stamp 20 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 10 | 5–5 | 50.0% | +13.1% |
| 5–10 | 3 | 2–1 | 66.7% | +33.6% |
| ≥10 | 7 | 5–2 | 71.4% | +6.1% |
| All | 20 | 12–8 | 60.0% | +12.2% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50% (4) | — | 80% (5) |
| C | 50% (2) | 100% (1) | 50% (2) |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 576 tickets · cov 549/576 (stamp 341 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 96 | 41–55 | 42.7% | -23.5% |
| 0–2.89 | 313 | 169–144 | 54.0% | +6.2% |
| ≥2.89 | 140 | 93–47 | 66.4% | +18.9% |
| All | 576 | 315–261 | 54.7% | +4.5% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 58.6% (128) | 75% (64) |
| B | 58.3% (24) | 51% (49) | 66.7% (12) |
| C | 18.2% (11) | 51% (98) | 56.1% (57) |

##### Jul 15+ · 365 tickets · cov 344/365 (stamp 341 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 27 | 13–14 | 48.1% | -7.1% |
| 0–2.89 | 222 | 115–107 | 51.8% | +1.2% |
| ≥2.89 | 95 | 60–35 | 63.2% | +14.0% |
| All | 365 | 197–168 | 54.0% | +5.1% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 53.5% (71) | 73.5% (34) |
| B | 50% (8) | 50% (34) | 60% (5) |
| C | — | 51.9% (79) | 54.9% (51) |

##### Yesterday (Aug 22) · 20 tickets · cov 20/20 (stamp 20 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 4 | 2–2 | 50.0% | -7.8% |
| 0–2.89 | 9 | 4–5 | 44.4% | -10.2% |
| ≥2.89 | 7 | 6–1 | 85.7% | +24.4% |
| All | 20 | 12–8 | 60.0% | +12.2% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 50% (4) | 80% (5) |
| C | — | 33.3% (3) | 100% (2) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 365 | 197-168 | 54.0% | 1006.35u | +51.55u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 365/365 | 2.16 | 2.22 | -0.06 | 2.00 | 2.00 |
| depth   | #A sharps        | 365/365 | 1.32 | 1.33 | -0.01 | 1.00 | 1.00 |
| depth   | #F − #A          | 365/365 | 0.83 | 0.89 | -0.05 | 1.00 | 1.00 |
| depth   | proven F         | 365/365 | 1.48 | 1.56 | -0.08 | 1.00 | 1.00 |
| depth   | proven A         | 365/365 | 0.47 | 0.44 | +0.03 | 0.00 | 0.00 |
| depth   | proven F−A       | 365/365 | 1.02 | 1.12 | -0.10 | 1.00 | 1.00 |
| depth   | v12 F count      | 365/365 | 2.16 | 2.27 | -0.11 | 2.00 | 2.00 |
| depth   | v12 A count      | 365/365 | 1.43 | 1.46 | -0.03 | 1.00 | 1.00 |
| depth   | WA ForN          | 365/365 | 1.62 | 1.82 | -0.20 | 1.00 | 1.50 |
| depth   | WA AgN           | 365/365 | 1.09 | 1.15 | -0.06 | 1.00 | 1.00 |
| depth   | CLV ForN         | 364/365 | 2.07 | 2.17 | -0.10 | 2.00 | 2.00 |
| depth   | CLV AgN          | 364/365 | 1.37 | 1.38 | -0.00 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 365/365 | 0.40 | 0.39 | +0.00 | 0.00 | 0.00 |
| quality | ForWR            | 342/365 | 57.29 | 54.84 | +2.45 | 54.40 | 54.05 |
| quality | AgWR             | 211/365 | 44.46 | 45.04 | -0.58 | 45.23 | 46.25 |
| quality | TopFor WR        | 342/365 | 59.74 | 58.59 | +1.15 | 55.90 | 55.60 |
| quality | TopAg WR         | 211/365 | 47.77 | 48.18 | -0.42 | 48.94 | 49.12 |
| quality | EDGE             | 342/365 | 10.56 | 7.70 | +2.86 | 8.35 | 5.76 |
| quality | ForCLV           | 359/365 | 67.20 | 65.65 | +1.55 | 66.03 | 65.99 |
| quality | AgCLV            | 235/365 | 63.32 | 61.73 | +1.59 | 63.76 | 63.98 |
| quality | netCLV           | 359/365 | 4.34 | 3.82 | +0.51 | 3.62 | 3.47 |
| quality | Tape             | 341/365 | 2.77 | 2.12 | +0.65 | 1.98 | 1.76 |
| quality | V12 score        | 365/365 | 0.85 | 0.83 | +0.01 | 0.96 | 0.95 |
| quality | V12 forMean      | 365/365 | 26.58 | 21.01 | +5.57 | 16.95 | 15.04 |
| quality | V12 agMean       | 365/365 | 1.64 | 1.53 | +0.11 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 342/365 | 0.569 | +0.006 | +0.133 | +2.86 | 🟡 mild OK |
|    2 | Tape             | quality | 341/365 | 0.560 | +0.015 | +0.116 | +0.65 | 🟡 mild OK |
|    3 | V12 forMean      | quality | 365/365 | 0.552 | +0.124 | +0.100 | +5.57 | 🟡 mild OK |
|    4 | WA ForN          | depth   | 365/365 | 0.455 | +0.179 | -0.087 | -0.20 | 🟡 mild inv |
|    5 | ForWR            | quality | 342/365 | 0.541 | -0.022 | +0.126 | +2.45 | 🟡 mild OK |
|    6 | AgCLV            | quality | 235/365 | 0.538 | -0.017 | +0.097 | +1.59 | flat |
|    7 | ForCLV           | quality | 359/365 | 0.533 | +0.039 | +0.089 | +1.55 | flat |
|    8 | V12 score        | quality | 365/365 | 0.531 | +0.007 | +0.029 | +0.01 | flat |
|    9 | AgWR             | quality | 211/365 | 0.473 | +0.079 | -0.048 | -0.58 | flat |
|   10 | proven A         | depth   | 365/365 | 0.523 | +0.296 | +0.017 | +0.03 | flat |
|   11 | proven F−A       | depth   | 365/365 | 0.479 | +0.190 | -0.052 | -0.10 | flat |
|   12 | #F − #A          | depth   | 365/365 | 0.479 | +0.105 | -0.014 | -0.05 | flat |
|   13 | CLV AgN          | depth   | 364/365 | 0.520 | +0.183 | -0.001 | -0.00 | flat |
|   14 | unopposed (A=0)  | depth   | 365/365 | 0.519 | +0.236 | +0.003 | +0.00 | flat |
|   15 | #A sharps        | depth   | 365/365 | 0.519 | +0.149 | -0.003 | -0.01 | flat |
|   16 | TopFor WR        | quality | 342/365 | 0.517 | +0.008 | +0.055 | +1.15 | flat |
|   17 | V12 agMean       | quality | 365/365 | 0.514 | +0.341 | +0.013 | +0.11 | flat |
|   18 | netCLV           | quality | 359/365 | 0.514 | +0.036 | +0.023 | +0.51 | flat |
|   19 | TopAg WR         | quality | 211/365 | 0.512 | +0.080 | -0.028 | -0.42 | flat |
|   20 | proven F         | depth   | 365/365 | 0.488 | +0.289 | -0.049 | -0.08 | flat |
|   21 | CLV ForN         | depth   | 364/365 | 0.489 | +0.207 | -0.035 | -0.10 | flat |
|   22 | v12 F count      | depth   | 365/365 | 0.490 | +0.224 | -0.039 | -0.11 | flat |
|   23 | v12 A count      | depth   | 365/365 | 0.508 | +0.170 | -0.010 | -0.03 | flat |
|   24 | WA AgN           | depth   | 365/365 | 0.505 | +0.175 | -0.021 | -0.06 | flat |
|   25 | #F sharps        | depth   | 365/365 | 0.496 | +0.210 | -0.022 | -0.06 | flat |

### (C) Working read

_N=365 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.569 · Δ +2.86 · higher on WINs (cov 342/365)
- **Tape** — AUC 0.560 · Δ +0.65 · higher on WINs (cov 341/365)
- **V12 forMean** — AUC 0.552 · Δ +5.57 · higher on WINs (cov 365/365)
- **ForWR** — AUC 0.541 · Δ +2.45 · higher on WINs (cov 342/365)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. See `docs/SKILL_FEATURES.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 870 | 75 | 74 | 60 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 11 | 6-5 | 54.5% | 18.40u | +1.24u | +6.7% | -0.8 |
| on→off | 3 | 2-1 | 66.7% | 5.00u | +3.48u | +69.6% | +1.1 |
| off→on | 5 | 2-3 | 40.0% | 7.00u | -0.80u | -11.4% | +2.0 |
| off→off | 41 | 20-21 | 48.8% | 122.20u | -10.13u | -8.3% | -1.2 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 43 | 21-22 | 48.8% | 121.20u | -5.34u | -4.4% |
| 0–2 | 11 | 7-4 | 63.6% | 22.40u | +4.58u | +20.4% |
| 2–4 | 2 | 0-2 | 0.0% | 5.00u | -5.00u | -100.0% |
| 4+ | 4 | 2-2 | 50.0% | 4.00u | -0.45u | -11.2% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 343n · 53.1% · +3.3%   | 84n · 54.8% · -1.2%    | 236n · 50.8% · +0.7%   | 663n · 52.5% · +1.7%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 6n · 66.7% · +1.3%     | —                      | 2n · 50.0% · -5.4%     | 8n · 62.5% · -0.8%     |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 38n · 68.4% · +22.8%   | —                      | —                      | 38n · 68.4% · +22.8%   |
| UFC   | 30n · 73.3% · +13.2%   | —                      | —                      | 30n · 73.3% · +13.2%   |
| WNBA  | 18n · 72.2% · +9.1%    | 12n · 41.7% · -1.5%    | 9n · 66.7% · +55.5%    | 39n · 61.5% · +15.6%   |
| **All** | **442n · 56.3% · +6.4%** | **100n · 54.0% · +1.3%** | **252n · 51.6% · +2.7%** | **794n · 54.5% · +4.5%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1080** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1080 |
| Muted W-L                           |              528-552 |
| Muted Win %                         |                48.9% |
| Counterfactual PnL at flat 1u       |               -62.99 |
| Counterfactual ROI at flat 1u       |                -5.8% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-62.99u** at a flat 1u stake — a counterfactual ROI of **-5.8%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-22 | MLB   | ML     | Atlanta Braves          |  +158 | +0.305 | CONFIRMED-UNOPP |   4/7 |   1/2 |  48.2 |   63.6 |   -0.6 |  0.64 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-22 | MLB   | ML     | Tampa Bay Rays          |  -122 | +0.990 | HC-1     |   1/3 |   1/0 |  59.8 |   56.8 |  +15.3 |  2.05 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-08-22 | NFL   | ML     | Ravens                  |  +126 | +0.529 | CONFIRMED-UNOPP |   4/3 |   3/1 |  27.3 |   62.4 |  -25.6 | -7.37 | HOLD     | 1.00u | WIN     |      +1.26 |
| 2026-08-22 | NFL   | ML     | Cowboys                 |  -125 | +0.643 | SHARP~   |   2/2 |   2/2 |  61.5 |   64.0 |  +21.4 |  3.29 | BOOST    | 5.40u | WIN     |      +4.32 |
| 2026-08-22 | SOC   | ML     | Manchester United FC    |  -255 | +0.976 | CONFIRMED-UNOPP |   5/0 |   1/0 |  41.9 |   56.3 |   -8.1 | -2.47 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-22 | SOC   | ML     | Real Madrid CF          |  -235 | +0.957 | CONFIRMED-UNOPP |   8/0 |   3/0 |  41.8 |   59.9 |   -8.2 | -1.95 | HOLD     | 1.00u | WIN     |      +0.43 |
| 2026-08-22 | UFC   | ML     | Carli Judice            |  -590 | +0.895 | HC-1     |   1/1 |   1/1 |  80.6 |   93.3 |  +38.4 | 12.58 | BOOST    | 5.40u | WIN     |      +0.92 |
| 2026-08-22 | UFC   | ML     | Shamil Gaziev           |  -120 | +0.994 | MINI     |   3/0 |   3/0 |  80.6 |   75.6 |  +30.6 |  8.23 | BOOST    | 5.40u | WIN     |      +4.50 |
| 2026-08-22 | UFC   | ML     | Lerryan Douglas         |  -380 | +0.993 | HC-1     |   1/1 |   1/1 |  67.6 |   81.1 |  +17.6 |  6.45 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-08-22 | UFC   | ML     | Mason Jones             |  -340 | +0.483 | SHARP~   |   3/2 |   3/2 |  57.2 |   73.5 |   +3.4 |  2.57 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-22 | UFC   | ML     | Reinier de Ridder       |  -398 | +0.804 | HC-1     |   4/3 |   2/1 |  80.6 |   79.3 |  +35.2 |  8.66 | BOOST    | 5.40u | WIN     |      +1.36 |
| 2026-08-22 | UFC   | ML     | Marcio Barbosa          |  -850 | +0.998 | HC-1     |   2/0 |   1/0 |  80.6 |   93.3 |  +30.6 | 10.83 | BOOST    | 5.40u | WIN     |      +0.64 |
| 2026-08-22 | WNBA  | ML     | New York Liberty        |  -134 | +0.490 | SHARP~   |   1/2 |   1/2 |  56.4 |   72.2 |   -0.6 |  1.59 | HOLD     | 1.00u | WIN     |      +0.75 |
| 2026-08-22 | MLB   | SPREAD | Seattle Mariners        |  -170 | +0.995 | CONFIRMED-UNOPP |   1/0 |   1/0 |  50.7 |   68.7 |   +0.7 |  1.13 | HOLD     | 1.00u | WIN     |      +0.59 |
| 2026-08-22 | WNBA  | SPREAD | Phoenix Mercury         |  +112 | +0.874 | CONFIRMED-UNOPP |   5/2 |   3/1 |  55.1 |   59.8 |   +5.1 | -0.22 | MUTE     | 1.00u | LOSS    |      -1.00 |
| 2026-08-22 | MLB   | TOTAL  | Under 8.5               |  +113 | +0.988 | HC-1     |   3/2 |   2/0 |  52.8 |   61.0 |   +7.6 |  1.26 | HOLD     | 3.00u | WIN     |      +3.39 |
| 2026-08-22 | MLB   | TOTAL  | Over 8.5                |  -118 | +0.967 | MINI     |   2/2 |   2/2 |  52.0 |   67.7 |   +7.8 |  1.60 | HOLD     | 3.00u | WIN     |      +2.54 |
| 2026-08-22 | MLB   | TOTAL  | Over 10.5               |  -117 | +0.978 | SHARP~   |   2/1 |   1/0 |  49.8 |   66.3 |   +8.4 |  2.39 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-08-22 | MLB   | TOTAL  | Under 9.5               |  -186 | +0.979 | SHARP    |   1/1 |   1/0 |  55.0 |   70.0 |  +13.5 |  3.98 | BOOST    | 5.40u | WIN     |      +2.90 |
| 2026-08-22 | MLB   | TOTAL  | Under 6.5               |  +106 | +0.965 | HC-2     |   4/0 |   4/0 |  49.8 |   63.7 |   -0.2 |  0.21 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-21 | MLB   | ML     | Milwaukee Brewers       |  -133 | +0.987 | CONFIRMED-Q1 |   3/2 |   1/0 |  50.8 |   67.1 |   +0.4 |  1.25 | HOLD     | 3.00u | WIN     |      +2.26 |
| 2026-08-21 | MLB   | ML     | Kansas City Royals      |  -103 | +0.337 | SHARP~   |   4/3 |   3/2 |  54.6 |   54.8 |   +7.4 |  0.87 | HOLD     | 2.00u | WIN     |      +1.94 |
| 2026-08-21 | MLB   | ML     | Texas Rangers           |  -134 | +0.981 | 2-for-0  |   4/0 |   4/0 |  49.4 |   61.3 |   +0.3 | -0.36 | HOLD     | 3.00u | WIN     |      +2.24 |
| 2026-08-21 | MLB   | ML     | Philadelphia Phillies   |  -246 | +0.975 | CONFIRMED-UNOPP |   4/1 |   4/1 |  49.0 |   63.1 |   -1.0 | -0.04 | HOLD     | 1.00u | WIN     |      +0.41 |
| 2026-08-21 | MLB   | ML     | New York Yankees        |  -190 | +0.760 | HC-2     |   2/1 |   2/1 |  48.3 |   65.5 |   +1.1 |  0.92 | HOLD     | 1.00u | WIN     |      +0.53 |
| 2026-08-21 | NFL   | ML     | Jaguars                 |  +116 | +0.937 | SHARP    |   1/0 |   1/0 |  72.7 |   66.8 |  +22.7 |  6.01 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-08-21 | NFL   | ML     | Jets                    |  +124 | +0.963 | MINI     |   2/0 |   2/0 |  50.0 |   71.4 |   +0.0 |  2.74 | HOLD     | 1.00u | WIN     |      +1.24 |
| 2026-08-21 | SOC   | ML     | Real Betis Balompié     |  +112 | +0.989 | SHARP~   |   2/0 |   1/0 |  46.1 |   71.0 |   -3.9 |  0.57 | HOLD     | 1.00u | WIN     |      +1.12 |
| 2026-08-21 | WNBA  | ML     | Toronto Tempo           |  +136 | +0.967 | CONFIRMED-UNOPP |   3/1 |   2/0 |  43.9 |   60.3 |   -6.1 | -5.03 | HOLD     | 1.00u | WIN     |      +1.36 |
| 2026-08-21 | MLB   | SPREAD | Milwaukee Brewers       |  +178 | +0.878 | CONFIRMED-UNOPP |   2/1 |   1/0 |  48.0 |   59.8 |   -1.2 | -0.88 | HOLD     | 1.00u | LOSS    |      -1.00 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.526 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.067 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.006 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.000 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.025 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  789 |    +0.0417 |    -0.0244 | 0.0001 |  +0.010 |   0.951 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  789 |    +0.0545 |    +0.4983 | 0.0006 |  +0.025 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  789 |    -0.4974 |    +0.5465 | 0.0015 |  -0.039 |   2.850 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 789 |          +0.078 |           +0.012 |                   +0.046 |                   +0.005 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 789 |          -0.007 |           +0.303 |                   +0.007 |                   +0.108 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 789 |          +0.001 |           +0.152 |                   -0.016 |                   +0.029 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 789 |          -0.018 |           +0.162 |                   +0.008 |                   +0.090 | count of contributing AGAINST-side wallets                     |
| provenFor         | 789 |          +0.010 |           +0.136 |                   +0.002 |                   +0.057 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 789 |          +0.008 |           +0.107 |                   +0.022 |                   +0.055 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.160         | 263 | 143-120 |   54.4% |     +1.1% |
| MID (p33–p67)     | 19.950 … 13.898        | 263 | 138-125 |   52.5% |     -0.7% |
| HIGH (> p67)      | 48.906 … 41.700        | 263 | 149-114 |   56.7% |     +0.9% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       789 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8557 | average score across live picks                                 |
| SD                |    0.2258 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.086 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +3.331 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.467 / +0.961 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  659 | 346-313 |   52.5% |     +1.6% |  0.507 |        -0.062 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |    8 | 5-3    |   62.5% |     -0.8% |  0.400 |        -0.595 | anti-signal (N<20)                        |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   37 | 25-12  |   67.6% |    +22.5% |  0.540 |        -0.071 | real                                      |
| UFC   |   30 | 22-8   |   73.3% |    +13.2% |  0.619 |        +0.163 | strong                                    |
| WNBA  |   39 | 24-15  |   61.5% |    +15.6% |  0.553 |        -0.007 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.461, 0.496, 0.575, 0.628, 0.604, 0.619, 0.582, 0.546, 0.564, 0.545, 0.577, 0.543, 0.537, 0.521]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22"]
    y-axis "edge (pp)" -17 --> 3
    line [-5.7, -11.7, -11.9, -15.7, -7, -1.3, -3, -1.3, -0.2, 1.1, 1.6, -2.5, -2.5, -1.8]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
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
| 2026-08-19 |    7 |  114 | 61-53  |   53.5% |    +14.1% |  0.577 |      +1.6pp |
| 2026-08-20 |    7 |  111 | 55-56  |   49.5% |     +6.2% |  0.543 |      -2.5pp |
| 2026-08-21 |    7 |  119 | 59-60  |   49.6% |     +0.5% |  0.537 |      -2.5pp |
| 2026-08-22 |    7 |  114 | 58-56  |   50.9% |     +3.9% |  0.521 |      -1.8pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.508 avg in first half → 0.541 avg in second half · Δ = +0.033)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.5% | [-3.0%, +12.1%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.5% | [50.9%, 57.9%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.526 | [0.488, 0.566]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             72 | [15, 125]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       794 |
| Unique wallets ever on a FOR side            |                                                       203 |
| Avg FOR-side wallets per pick                |                                                      2.68 |
| Top-5 wallets' share of all FOR appearances  |                                                     24.3% |
| Top-10 wallets' share of all FOR appearances |                                                     43.1% |
| Top-20 wallets' share of all FOR appearances |                                                     60.0% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  129 |   14 | 68-61  |   52.7% |     +8.4% |    +31.34 |     1.55× | CONFIRMED   |     +0.1% |     293 | 2026-08-22 |
|    2 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    3 | 4b912c  | MLB,NFL,SOC,WNBA |  101 |   30 | 54-47  |   53.5% |     +4.2% |     +9.96 |     1.45× | CONFIRMED   |     -5.7% |     270 | 2026-08-22 |
|    4 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    5 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     334 | 2026-08-05 |
|    6 | cd2f63  | MLB,NBA,NFL,SOC,WNBA |   87 |   44 | 47-40  |   54.0% |    +13.5% |    +33.24 |     1.12× | CONFIRMED   |     +8.6% |     506 | 2026-08-22 |
|    7 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   82 |   38 | 39-43  |   47.6% |     -3.0% |     -7.14 |     1.20× | CONFIRMED   |     +5.3% |     334 | 2026-08-22 |
|    8 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|    9 | 0f9d74  | MLB,NBA,NFL,SOC,UFC |   77 |   52 | 43-34  |   55.8% |    +13.2% |    +26.56 |     0.46× | CONFIRMED   |    +16.3% |     325 | 2026-08-22 |
|   10 | 2f2a9e  | MLB,SOC,WNBA |   76 |   32 | 40-36  |   52.6% |     -5.8% |    -11.98 |     2.06× | CONFIRMED   |     -7.5% |     276 | 2026-08-22 |
|   11 | 7923c4  | MLB,NBA,UFC |   52 |   16 | 31-21  |   59.6% |    +25.2% |    +32.09 |     0.73× | CONFIRMED   |     +9.8% |     219 | 2026-08-18 |
|   12 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   45 |   58 | 21-24  |   46.7% |     -8.6% |    -10.89 |     4.37× | CONFIRMED   |     -7.0% |     261 | 2026-08-22 |
|   13 | 705ba1  | MLB        |   43 |   17 | 19-24  |   44.2% |     -9.1% |    -11.37 |     1.11× | CONFIRMED   |     +8.2% |     185 | 2026-08-21 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   39 |   20 | 18-21  |   46.2% |     -2.1% |     -2.36 |     1.19× | CONFIRMED   |     -4.9% |     167 | 2026-08-22 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 |   22 | 19-15  |   55.9% |     +0.8% |     +0.85 |     1.36× | CONFIRMED   |    +13.8% |     143 | 2026-07-30 |
|   16 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   17 | 621848  | MLB,SOC,UFC,WNBA |   32 |   11 | 16-16  |   50.0% |    -14.2% |    -13.07 |     0.63× | CONFIRMED   |     +0.4% |      89 | 2026-08-22 |
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
|    5 | a0cff6  | MLB,NBA,SOC,UFC,WNBA |   11 | 8-3    |   72.7% |     +31.9% |    +10.16 |     6.34× | 2026-08-22 |
|    6 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    7 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|    8 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|    9 | 7923c4  | MLB,NBA,UFC |   52 | 31-21  |   59.6% |     +25.2% |    +32.09 |     0.73× | 2026-08-18 |
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
|    3 | c9bba3  | MLB,NFL,SOC |   15 | 8-7    |   53.3% |     -24.1% |     -8.14 |     0.83× | 2026-08-21 |
|    4 | 3bdd7e  | MLB,NFL,SOC,WNBA |   17 | 8-9    |   47.1% |     -19.3% |     -6.44 |     2.74× | 2026-08-22 |
|    5 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    6 | 621848  | MLB,SOC,UFC,WNBA |   32 | 16-16  |   50.0% |     -14.2% |    -13.07 |     0.63× | 2026-08-22 |
|    7 | ac9705  | MLB,WNBA   |   21 | 9-12   |   42.9% |     -12.2% |     -9.27 |     2.26× | 2026-08-22 |
|    8 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    9 | 705ba1  | MLB        |   43 | 19-24  |   44.2% |      -9.1% |    -11.37 |     1.11× | 2026-08-21 |
|   10 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   45 | 21-24  |   46.7% |      -8.6% |    -10.89 |     4.37× | 2026-08-22 |
|   11 | 2f2a9e  | MLB,SOC,WNBA |   76 | 40-36  |   52.6% |      -5.8% |    -11.98 |     2.06× | 2026-08-22 |
|   12 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   82 | 39-43  |   47.6% |      -3.0% |     -7.14 |     1.20× | 2026-08-22 |
|   13 | ad88a3  | MLB,SOC    |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-08-21 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   39 | 18-21  |   46.2% |      -2.1% |     -2.36 |     1.19× | 2026-08-22 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 | 19-15  |   55.9% |      +0.8% |     +0.85 |     1.36× | 2026-07-30 |

> 🔴 **6 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `f2f960` (FOR# 26, ROI -15.0%), `621848` (FOR# 32, ROI -14.2%), `1e8f33` (FOR# 94, ROI -10.7%), `705ba1` (FOR# 43, ROI -9.1%), `7da3d5` (FOR# 45, ROI -8.6%), `2f2a9e` (FOR# 76, ROI -5.8%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1586 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   379 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    16 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    61 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   352 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            251 |        58 |   28 |   14 |  151 |                    100 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            229 |        62 |   38 |   11 |  118 |                    111 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   84 |    794 | 1080 | 433-361 |  54.5% |      4.5% |     +98.16 |    +0.12 | 0.506 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  734 |    +1.2pp |    +13.5pp |          +0.297 |   -0.043 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  732 |    +6.1pp |    +23.3pp |          +0.437 |   +0.112 |    +0.0306 | 🟢 better |
| v12 − v11          | +  683 |    -0.4pp |     +1.7pp |          +0.063 |   +0.062 |    +0.0144 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 663n 52.5% +2% | 10n 30.0% +29% | 8n 62.5% -1%   | 6n 83.3% +38%  | 38n 68.4% +23% | 30n 73.3% +13% | 39n 61.5% +16% | 794n 54.5% +4% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 158n +1%      | 227n +2%      | 179n +9%      | 108n -3%      | 117n +19%     | 🟡 partial (2) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2156 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1028 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 789 / 1028 (77%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 789 / 1028 (77%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 789 / 1028 (77%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 789 / 1028 (77%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 789 / 1028 (77%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 789 / 1028 (77%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 789 / 1028 (77%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1028 / 1028 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1028 / 1028 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1028 / 1028 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1028 / 1028 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1028 / 1028 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1028 / 1028 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1021 / 1028 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1019 / 1028 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1028 / 1028 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1027 / 1028 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 622 / 1028 (61%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1027 / 1028 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 622 / 1028 (61%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 621 / 1028 (60%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1028 / 1028 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1028 / 1028 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1028 / 1028 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1027 / 1028 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1028 / 1028 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd contribMargin     | 1028 |      |    -0.033 |    -0.152 |      -0.055 |      -0.108 |  0.467 |
|    2 | wd agCount           | 622 |      |    +0.020 |    +0.266 |      +0.050 |      +0.127 |  0.520 |
|    3 | V12 forMean          | 789 |  🟢  |    +0.078 |    +0.012 |      +0.046 |      +0.005 |  0.531 |
|    4 | qMargin              | 789 |  🟢  |    +0.082 |    +0.001 |      +0.045 |      -0.003 |  0.531 |
|    5 | wd maxForContrib     | 1027 |      |    -0.052 |    -0.113 |      -0.044 |      -0.050 |  0.484 |
|    6 | wd contribFor        | 1028 |      |    -0.033 |    -0.099 |      -0.038 |      -0.067 |  0.476 |
|    7 | wd sizeMargin        | 621 |      |    -0.010 |    -0.021 |      -0.037 |      -0.059 |  0.498 |
|    8 | clv                  | 1019 |      |    -0.029 |    +0.029 |      -0.035 |      +0.004 |  0.504 |
|    9 | wd agAvgSize         | 622 |      |    +0.012 |    +0.020 |      +0.033 |      +0.037 |  0.502 |
|   10 | hcMargin             | 1028 |      |    -0.010 |    +0.203 |      -0.030 |      +0.056 |  0.508 |
|   11 | provenMargin         | 1028 |      |    -0.013 |    +0.049 |      -0.029 |      -0.017 |  0.490 |
|   12 | wd forCount          | 1027 |      |    -0.016 |    +0.078 |      -0.026 |      -0.016 |  0.485 |
|   13 | lockPinnProb         | 1021 |      |    +0.180 |    +0.151 |      +0.025 |      -0.132 |  0.597 |
|   14 | provenFor            | 1028 |      |    -0.019 |    +0.025 |      -0.024 |      -0.025 |  0.492 |
|   15 | countMargin          | 789 |      |    +0.013 |    +0.066 |      -0.021 |      -0.023 |  0.494 |
|   16 | ags (v11)            | 1028 |      |    +0.003 |    +0.035 |      -0.019 |      -0.030 |  0.509 |
|   17 | wd forAvgSize        | 1027 |      |    -0.001 |    +0.035 |      -0.018 |      -0.009 |  0.513 |
|   18 | wd maxShare          | 1028 |      |    +0.020 |    -0.044 |      +0.017 |      -0.001 |  0.512 |
|   19 | wd contribAg         | 1028 |      |    -0.004 |    +0.134 |      +0.017 |      +0.059 |  0.499 |
|   20 | provenTotal          | 1028 |      |    -0.018 |    -0.014 |      -0.016 |      -0.022 |  0.497 |
|   21 | V12 forCount         | 789 |  🟢  |    +0.001 |    +0.152 |      -0.016 |      +0.029 |  0.504 |
|   22 | peakStars            | 1028 |      |    +0.006 |    +0.069 |      -0.013 |      -0.007 |  0.502 |
|   23 | agsV12               | 789 |  🟢  |    +0.025 |    -0.006 |      +0.010 |      -0.000 |  0.526 |
|   24 | V12 agCount          | 789 |  🟢  |    -0.018 |    +0.162 |      +0.008 |      +0.090 |  0.508 |
|   25 | V12 agMean           | 789 |  🟢  |    -0.007 |    +0.303 |      +0.007 |      +0.108 |  0.501 |
|   26 | provenAg             | 1028 |      |    -0.011 |    +0.135 |      +0.001 |      +0.058 |  0.506 |

> **Top 3 univariate features by PnL correlation:** `wd contribMargin` (r = -0.055), `wd agCount` (r = +0.050), `V12 forMean` (r = +0.046).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd contribMargin` — r(unit-ret) = -0.055, AUC = 0.467. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd contribMargin` · r(unit-ret) = -0.055 · AUC = 0.467

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -11.200        | 343 | 196-147 |   57.1% |     +2.5% |
| MID (p33–p67)     | 57.800 … 30.600          | 342 | 190-152 |   55.6% |     +1.3% |
| HIGH (> p67)      | 174.100 … 138.400        | 343 | 171-172 |   49.9% |     -3.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd agCount` · r(unit-ret) = +0.050 · AUC = 0.520

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 299 | 158-141 |   52.8% |     -0.9% |
| MID (p33–p67)     | 2.000 … 2.000            | 153 | 80-73   |   52.3% |     -1.4% |
| HIGH (> p67)      | 3.000 … 3.000            | 170 | 97-73   |   57.1% |     +3.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forMean` · r(unit-ret) = +0.046 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.160           | 263 | 143-120 |   54.4% |     +1.1% |
| MID (p33–p67)     | 19.950 … 13.898          | 263 | 138-125 |   52.5% |     -0.7% |
| HIGH (> p67)      | 48.906 … 41.700          | 263 | 149-114 |   56.7% |     +0.9% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.045 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 9.258            | 263 | 139-124 |   52.9% |     -0.2% |
| MID (p33–p67)     | 19.950 … 13.898          | 263 | 144-119 |   54.8% |     +1.0% |
| HIGH (> p67)      | 46.556 … 41.700          | 263 | 147-116 |   55.9% |     +0.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd maxForContrib` · r(unit-ret) = -0.044 · AUC = 0.484

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 18.500          | 343 | 194-149 |   56.6% |     +2.0% |
| MID (p33–p67)     | 52.400 … 52.300          | 342 | 183-159 |   53.5% |     -0.6% |
| HIGH (> p67)      | 100.000 … 64.700         | 342 | 180-162 |   52.6% |     -0.7% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd contribMargin | wd agCount     | V12 forMean    | qMargin        | wd maxForContrib | wd contribFor  | wd sizeMargin  | clv            |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd contribMargin |  1.000         |         -0.146 |         +0.084 |         +0.066 |         +0.516 |         +0.770 |         +0.275 |         -0.068 |
| wd agCount  |         -0.146 |  1.000         |         +0.143 |         +0.032 |         +0.309 |         +0.472 |         +0.029 |         -0.001 |
| V12 forMean |         +0.084 |         +0.143 |  1.000         |         +0.967 |         +0.215 |         +0.177 |         +0.222 |         -0.033 |
| qMargin     |         +0.066 |         +0.032 |         +0.967 |  1.000         |         +0.158 |         +0.083 |         +0.204 |         -0.023 |
| wd maxForContrib |         +0.516 |         +0.309 |         +0.215 |         +0.158 |  1.000         |         +0.661 |         +0.279 |         -0.063 |
| wd contribFor |         +0.770 |         +0.472 |         +0.177 |         +0.083 |         +0.661 |  1.000         |         +0.229 |         -0.063 |
| wd sizeMargin |         +0.275 |         +0.029 |         +0.222 |         +0.204 |         +0.279 |         +0.229 |  1.000         |         -0.067 |
| clv         |         -0.068 |         -0.001 |         -0.033 |         -0.023 |         -0.063 |         -0.063 |         -0.067 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.967. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 500 picks · features = 8 (+ intercept) · multiple R² = **0.0175** · adjusted R² = **-0.0005** · residual sd = 0.952

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.2741 |   0.1867 | -1.47        |        1 |
|    2 | wd agCount           |     |    +0.2013 |   0.1149 | +1.75 (~sig) |        2 |
|    3 | wd contribMargin     |     |    +0.1748 |   0.1631 | +1.07        |        3 |
|    4 | wd sizeMargin        |     |    -0.0544 |   0.0463 | -1.17        |        4 |
|    5 | qMargin              |  🟢 |    +0.0469 |   0.1900 | +0.25        |        5 |
|    6 | wd maxForContrib     |     |    +0.0301 |   0.0580 | +0.52        |        6 |
|    7 | clv                  |     |    -0.0272 |   0.0428 | -0.63        |        7 |
|    8 | V12 forMean          |  🟢 |    +0.0221 |   0.1935 | +0.11        |        8 |
| —    | (intercept)          |     |    +0.0238 |   0.0426 |    +0.56 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.047), `V12 forMean` (β = +0.022)
- V12 IGNORES: `wd contribFor` (β = -0.274, t = -1.47), `wd agCount` (β = +0.201, t = +1.75), `wd contribMargin` (β = +0.175, t = +1.07), `wd sizeMargin` (β = -0.054, t = -1.17), `wd maxForContrib` (β = +0.030, t = +0.52), `clv` (β = -0.027, t = -0.63)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.530 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.564 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.035.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd agCount` (β = +0.201, t = +1.75). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of -0.0005 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*