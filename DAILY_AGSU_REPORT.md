# AGS-Unified — V12 Daily Monitor

**Generated:** Tuesday, August 25, 2026 at 9:29 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (86 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (86 days ago), V12 has evaluated **2525** picks, shipped **827** for real money (32.8% ship rate), and muted the other **1698**. On the shipped picks V12 has gone **452-375** (54.7% win), staked **2247.40u**, and returned **+108.04u** at **+4.8% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             86 |
| Picks V12 has evaluated             |                           2525 |
| Picks SHIPPED (units > 0)           |                            827 |
| Picks MUTED (score ≤ 0, FADE)       |                           1698 |
| Ship rate                           |                          32.8% |
| Live W-L                            |                        452-375 |
| Live Win %                          |                          54.7% |
| Live PnL (units)                    |                        +108.04 |
| Live ROI                            |                          +4.8% |
| Avg PnL / day                       |                         +1.26u |
| Most recent action (2026-08-26)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.8% ROI** across 827 live picks (+108.04u real PnL).
- Mute rule is **saving money** — the 1125 muted picks would have lost -64.17u at flat 1u (-5.7% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.26u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **216-182** · +5.7% ROI · +61.43u on 398 graded — see § 5.

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

**Full book:** 86d · 827 live · 452-375 · **+108.04u** · +4.8% ROI · +1.26u/day.

_Prior to table (2026-06-01 → 2026-08-05): 592 live · 332-260 · +83.67u · cum through prior = +83.67u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-08-24 |        45 |   12 |    22 | 7-5        |  58.3% |     28.40 |      -2.12 |     -7.5% |    +108.04 |
| 2026-08-25 |        29 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +108.04 |
| 2026-08-26 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +108.04 |

> **Trajectory.** 🟡 Last 3 days (-7.5% ROI) **-12.4pp** vs prior (5.0%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-24**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 17 | 13-4 | +41.6% | +29.30u | +1.72u | +15.8% |
| 🟢 2 | RANK 2-for-0 rescue | B | 89 | 50-39 | +12.3% | +39.71u | +0.45u | -3.7% |
| 🟢 3 | MINI- (gate-cut) | C | 20 | 12-8 | +11.8% | +3.12u | +0.16u | -38.3% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 94 | 60-34 | +16.3% | +69.92u | sized UP after path |
| 2 | Tape HOLD (mid) | 265 | 138-127 | +1.1% | +6.45u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Tape MUTE (tape<0 → 0u) | 67 | 32-35 | -7.5% | -5.01u | 🟢 saving $ |
| 2 | fadeTop≥60 MUTE | 6 | 3-3 | -2.6% | -0.15u | 🟡 flat |
| 3 | Score FADE (≤0 → 0u) | 645 | 321-324 | -1.4% | -9.28u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 17 | 13-4 | 76.5% | 70.5u | +29.30u | +41.6% | +1.72u | 4 | +15.8% | +1.89u | 🔻 cooling |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 100 | 60-40 | 60.0% | 370.5u | +18.63u | +5.0% | +0.19u | 15 | -3.5% | +3.30u | 🟢 OK |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 89 | 50-39 | 56.2% | 323.0u | +39.71u | +12.3% | +0.45u | 16 | -3.7% | -3.00u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 71 | 34-37 | 47.9% | 229.6u | -11.61u | -5.1% | -0.16u | 8 | +2.2% | -4.56u | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 92 | 50-42 | 54.3% | 252.0u | +11.62u | +4.6% | +0.13u | 18 | +24.5% | +1.00u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 80 | 47-33 | 58.8% | 212.8u | +18.37u | +8.6% | +0.23u | 15 | +46.7% | -1.00u | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 2 | -38.3% | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 23 | 12-11 | 52.2% | 23.4u | +0.89u | +3.8% | +0.04u | 4 | -47.8% | -1.00u | 🔻 cooling |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 94 | 60-34 | 63.8% | 430.1u | +69.92u | +16.3% | 27 | +12.5% | -5.40u |
| Tape HOLD (mid) | TAPE | staked | 265 | 138-127 | 52.1% | 568.1u | +6.45u | +1.1% | 94 | +4.2% | +3.28u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 3 | -30.3% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 67 | 32-35 | 47.8% | 67.0u | -5.01u | -7.5% | 25 | -29.7% | -1.00u |
| fadeTop≥60 MUTE | E | CF 1u | 6 | 3-3 | 50.0% | 6.0u | -0.15u | -2.6% | 3 | +28.2% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 645 | 321-324 | 49.8% | 645.0u | -9.28u | -1.4% | 83 | +14.2% | +4.13u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 4 / +16% | — | — |
| TOP | 35 / +0% | 21 / +2% | 4 / -16% |
| RANK | 44 / +2% | 6 / +62% | — |
| SHARP | 15 / -9% | 30 / +2% | 1 / -100% |
| SHARP-LEAN | 66 / +1% | 23 / +11% | 3 / -30% |
| MINI | 31 / +9% | 8 / +56% | 4 / +1% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 14 / +10% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-08-24)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| HC-1 TOP | 1 | 1-0 | +3.30u | +110.0% |
| HC-2 SUPER | 2 | 2-0 | +1.89u | +27.0% |
| SHARP-LEAN EDGE/net ONE | 1 | 1-0 | +1.00u | +25.0% |
| MINI (gate-pass) | 1 | 0-1 | -1.00u | -100.0% |
| DISSENT rescue | 1 | 0-1 | -1.00u | -100.0% |
| RANK 2-for-0 rescue | 1 | 0-1 | -3.00u | -100.0% |
| SHARP EDGE/net BOTH | 2 | 1-1 | -4.56u | -71.3% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  18 | 13-4   |  76.5% |       70.50 |     +29.30 |     41.6% |
| TOP PICK (TOP+/TOP)       |  4-5u | 172 | 75-54  |  58.1% |      503.00 |      +6.69 |      1.3% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 451 | 140-126 |  52.6% |      853.55 |     +33.11 |      3.9% |
| STRONG (MINI)             |    3u |  97 | 47-33  |  58.8% |      212.75 |     +18.37 |      8.6% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  83 | 26-22  |  54.2% |       54.85 |      +1.99 |      3.6% |
| **STAKED TOTAL** |     — | 540 | 301-239 |  55.7% |     1694.65 |     +89.46 |     +5.3% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  18 | 13-4   |  76.5% |       70.50 |     +29.30 |     41.6% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 143 | 60-40  |  60.0% |      370.50 |     +18.63 |      5.0% |
| B · 2-for-0 rescue    | RANK        |    4u | 123 | 50-39  |  56.2% |      322.95 |     +39.71 |     12.3% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 220 | 50-42  |  54.3% |      252.04 |     +11.62 |      4.6% |
| C · proven-$ consensus | SHARP       |    3u |  94 | 34-37  |  47.9% |      229.56 |     -11.61 |     -5.1% |
| A · mini-HC (gate-pass) | MINI        |    3u |  97 | 47-33  |  58.8% |      212.75 |     +18.37 |      8.6% |
| C · mini gate-cut     | MINI-       |    1u |  24 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  53 | 12-11  |  52.2% |       23.35 |      +0.89 |      3.8% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 541 picks tracked at 0u (would-be 264-277, 48.8% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (13-5, +29.30u)  ·  🟢 TOP PICK (96-76, +6.69u)  ·  🟠 SHARP PLAY (227-224, +33.11u)  ·  🔴 STRONG (59-38, +18.37u)  ·  🟣 LEAN (43-40, +1.99u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24"]
    y-axis "PnL (u)" -14 --> 44
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 51, 50, 51, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 1213 | 1205 | 1162 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 67 | 32-35 | 47.8% | 8.00u | -1.05u | -13.1% |
| HOLD      | 354 | 173-181 | 48.9% | 571.07u | +3.45u | +0.6% |
| BOOST     | 120 | 73-47 | 60.8% | 433.58u | +72.00u | +16.6% |
| FAIL_OPEN | 37 | 20-17 | 54.1% | 54.50u | -15.17u | -27.8% |
| PASS      | 584 | 303-281 | 51.9% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 368 | 195-173 | 53.0% | -1.78u |
| hold (0–2.89) | path u | 515 | 250-265 | 48.5% | +8.56u |
| boost (≥2.89) | ×1.35 | 140 | 82-58 | 58.6% | +66.35u |

_Score coverage: **1023/1162** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 67 | +4.96u | -4.96u | +39.75u | +44.71u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 96 | +51.71u | +72.00u | +20.29u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-25 | MLB | Boston Red Sox | SHARP | 5.90 | BOOST | 4.00u | 5.40u | — |
| 2026-08-25 | MLB | Cleveland Guardians | PATH-D | -1.64 | MUTE | 1.00u | 0.00u | — |
| 2026-08-25 | MLB | Under 7.5 | SHARP | 7.17 | BOOST | 4.00u | 5.40u | — |
| 2026-08-24 | MLB | Athletics | CONFIRMED-UNOPP | -3.40 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-24 | WNBA | Minnesota Lynx | SHARP | 6.63 | BOOST | 4.00u | 5.40u | LOSS |
| 2026-08-24 | MLB | Under 8.5 | SHARP | 4.09 | BOOST | 1.00u | 0.00u | LOSS |
| 2026-08-24 | MLB | Under 6.5 | SHARP~ | 3.09 | BOOST | 1.00u | 0.00u | LOSS |
| 2026-08-23 | MLB | Cincinnati Reds | CONFIRMED-UNOPP | -0.62 | MUTE | 1.00u | 1.00u | LOSS |
| 2026-08-23 | MLB | Los Angeles Angels | PATH-D | -1.16 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-23 | MLB | Minnesota Twins | MINI | -0.20 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-23 | SOC | FC Barcelona | CONFIRMED-UNOPP | -2.96 | MUTE | 1.00u | 1.00u | WIN |
| 2026-08-23 | SOC | Manchester City FC | CONFIRMED-UNOPP | -1.52 | MUTE | 1.00u | 1.00u | WIN |
| 2026-08-23 | SOC | Liverpool FC | CONFIRMED-UNOPP | 3.21 | BOOST | 1.00u | 0.00u | LOSS |
| 2026-08-23 | WNBA | Indiana Fever | MINI | 3.30 | BOOST | 3.00u | 0.00u | WIN |
| 2026-08-23 | WNBA | Toronto Tempo | SHARP | 6.24 | BOOST | 4.00u | 5.40u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-1.00** · nPriors=518 · source=expanding_q1 · asOf=2026-08-25 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 767 | 688 | 658 | 140 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 52 | 18-34 | 34.6% | 8.00u | -4.21u | -52.6% |
| HOLD      | 167 | 91-76 | 54.5% | 185.50u | +31.32u | +16.9% |
| FAIL_OPEN | 25 | 12-13 | 48.0% | 41.90u | -2.08u | -5.0% |
| EXEMPT    | 230 | 114-116 | 49.6% | 316.60u | +6.29u | +2.0% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -48.5 … -1.4 | 24 | 6-18 | 25.0% | 0.0u | +0.00u | — |
| Q2 | -0.6 … 1.5 | 25 | 13-12 | 52.0% | 26.9u | +20.08u | +74.6% |
| Q3 | 1.6 … 6.5 | 25 | 10-15 | 40.0% | 34.1u | -1.98u | -5.8% |
| Q4 | 6.5 … 13.9 | 25 | 15-10 | 60.0% | 44.9u | +6.28u | +14.0% |
| Q5 | 14.4 … 1802.6 | 25 | 13-12 | 52.0% | 41.1u | +2.94u | +7.2% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 52 | 18-34 | -18.30u | +18.30u | +38.50u | +20.20u |

> 🟢 **Mute is saving money** (Δ +18.30u · muted WR 34.6%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 4 | 3-1 | 75.0% | 6.0u | +2.60u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 18 | 4-14 | 22.2% | 20.5u | -10.86u |
| MLB | 35 | 12-23 | 34.3% | 40.5u | -11.79u |
| SOC | 1 | 0-1 | 0.0% | 1.0u | -1.00u |
| WNBA | 16 | 6-10 | 37.5% | 18.0u | -5.51u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-08-25 | MLB | Over 8.5 | CONFIRMED-UNOPP | -2.3 | -1.0 | 1.00u | pending |
| 2026-08-24 | MLB | Detroit Tigers | SHARP~ | -7.7 | -0.8 | 1.00u | LOSS |
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

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 54 | 31-23 | 57.4% | 147.0u | +27.32u | +18.6% |
| Muted (Q1 → 0u) | 52 | 18-34 | 34.6% | 8.0u | -4.21u | -52.6% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 123–68 · 64.4% · +18.0%); **5–10 is the hole** (65–59 · 52.4% · -2.6%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 609 tickets · cov 582/609 (stamp 380 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 267 | 134–133 | 50.2% | -5.6% |
| 5–10 | 124 | 65–59 | 52.4% | -2.6% |
| ≥10 | 191 | 123–68 | 64.4% | +18.0% |
| All | 609 | 334–275 | 54.8% | +4.9% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 51% (100) | 58.3% (60) | 70.7% (82) |
| B | 51.6% (62) | 55.6% (9) | 72.2% (18) |
| C | 41.7% (36) | 47.9% (48) | 57% (86) |

##### Jul 15+ · 398 tickets · cov 377/398 (stamp 375 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 161 | 81–80 | 50.3% | -3.3% |
| 5–10 | 85 | 42–43 | 49.4% | -7.2% |
| ≥10 | 131 | 84–47 | 64.1% | +15.7% |
| All | 398 | 216–182 | 54.3% | +5.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.8% (41) | 58.1% (31) | 73.2% (41) |
| B | 50% (36) | 25% (4) | 72.7% (11) |
| C | 46.7% (15) | 48.8% (43) | 57.9% (76) |

##### Yesterday (Aug 24) · 12 tickets · cov 12/12 (stamp 12 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 6 | 3–3 | 50.0% | -21.5% |
| 5–10 | 3 | 2–1 | 66.7% | +62.8% |
| ≥10 | 3 | 2–1 | 66.7% | -23.0% |
| All | 12 | 7–5 | 58.3% | -7.5% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 100% (1) | 50% (2) | 100% (1) |
| B | 0% (1) | — | — |
| C | — | 100% (1) | 50% (2) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 609 tickets · cov 603/609 (stamp 392 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 391 | 212–179 | 54.2% | +2.0% |
| 5–10 | 110 | 60–50 | 54.5% | +12.5% |
| ≥10 | 102 | 60–42 | 58.8% | +9.3% |
| All | 609 | 334–275 | 54.8% | +4.9% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.4% (155) | 52.2% (46) | 73.5% (49) |
| B | 56.9% (65) | 53.8% (13) | 54.5% (11) |
| C | 50% (104) | 62.2% (37) | 41.7% (36) |

##### Jul 15+ · 398 tickets · cov 393/398 (stamp 392 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 241 | 134–107 | 55.6% | +6.7% |
| 5–10 | 87 | 47–40 | 54.0% | +14.1% |
| ≥10 | 65 | 33–32 | 50.8% | -5.6% |
| All | 398 | 216–182 | 54.3% | +5.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 63.9% (61) | 50% (30) | 64.3% (28) |
| B | 51.4% (37) | 55.6% (9) | 60% (5) |
| C | 54.5% (77) | 61.8% (34) | 37% (27) |

##### Yesterday (Aug 24) · 12 tickets · cov 12/12 (stamp 12 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 7 | 4–3 | 57.1% | +7.4% |
| 5–10 | 4 | 3–1 | 75.0% | +27.1% |
| ≥10 | 1 | 0–1 | 0.0% | -100.0% |
| All | 12 | 7–5 | 58.3% | -7.5% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50% (2) | 100% (2) | — |
| B | — | 0% (1) | — |
| C | 100% (1) | 100% (1) | 0% (1) |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 609 tickets · cov 582/609 (stamp 374 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 106 | 48–58 | 45.3% | -22.1% |
| 0–2.89 | 333 | 179–154 | 53.8% | +6.0% |
| ≥2.89 | 143 | 95–48 | 66.4% | +19.7% |
| All | 609 | 334–275 | 54.8% | +4.9% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 59.3% (135) | 75% (64) |
| B | 58.3% (24) | 51.9% (52) | 69.2% (13) |
| C | 18.2% (11) | 52% (100) | 55.9% (59) |

##### Jul 15+ · 398 tickets · cov 377/398 (stamp 374 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 37 | 20–17 | 54.1% | -2.9% |
| 0–2.89 | 242 | 125–117 | 51.7% | +1.1% |
| ≥2.89 | 98 | 62–36 | 63.3% | +15.3% |
| All | 398 | 216–182 | 54.3% | +5.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 55.1% (78) | 73.5% (34) |
| B | 50% (8) | 51.4% (37) | 66.7% (6) |
| C | — | 53.1% (81) | 54.7% (53) |

##### Yesterday (Aug 24) · 12 tickets · cov 12/12 (stamp 12 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 1 | 1–0 | 100.0% | +105.0% |
| 0–2.89 | 10 | 6–4 | 60.0% | +10.1% |
| ≥2.89 | 1 | 0–1 | 0.0% | -100.0% |
| All | 12 | 7–5 | 58.3% | -7.5% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 75% (4) | — |
| B | — | 0% (1) | — |
| C | — | 100% (2) | 0% (1) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 398 | 216-182 | 54.3% | 1071.15u | +61.43u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 398/398 | 2.31 | 2.27 | +0.03 | 2.00 | 2.00 |
| depth   | #A sharps        | 398/398 | 1.31 | 1.35 | -0.04 | 1.00 | 1.00 |
| depth   | #F − #A          | 398/398 | 1.00 | 0.93 | +0.07 | 1.00 | 1.00 |
| depth   | proven F         | 398/398 | 1.53 | 1.60 | -0.07 | 1.00 | 1.00 |
| depth   | proven A         | 398/398 | 0.48 | 0.46 | +0.02 | 0.00 | 0.00 |
| depth   | proven F−A       | 398/398 | 1.05 | 1.14 | -0.09 | 1.00 | 1.00 |
| depth   | v12 F count      | 398/398 | 2.27 | 2.32 | -0.05 | 2.00 | 2.00 |
| depth   | v12 A count      | 398/398 | 1.42 | 1.44 | -0.02 | 1.00 | 1.00 |
| depth   | WA ForN          | 398/398 | 1.70 | 1.86 | -0.15 | 1.00 | 2.00 |
| depth   | WA AgN           | 398/398 | 1.07 | 1.15 | -0.08 | 1.00 | 1.00 |
| depth   | CLV ForN         | 397/398 | 2.19 | 2.19 | -0.00 | 2.00 | 2.00 |
| depth   | CLV AgN          | 397/398 | 1.35 | 1.38 | -0.03 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 398/398 | 0.40 | 0.38 | +0.02 | 0.00 | 0.00 |
| quality | ForWR            | 375/398 | 56.83 | 54.53 | +2.30 | 54.29 | 53.32 |
| quality | AgWR             | 231/398 | 44.59 | 45.41 | -0.82 | 45.35 | 46.61 |
| quality | TopFor WR        | 375/398 | 59.54 | 58.30 | +1.24 | 55.90 | 55.60 |
| quality | TopAg WR         | 231/398 | 47.82 | 48.37 | -0.55 | 48.90 | 49.12 |
| quality | EDGE             | 375/398 | 9.96 | 7.23 | +2.73 | 7.70 | 5.21 |
| quality | ForCLV           | 392/398 | 66.68 | 65.63 | +1.05 | 65.71 | 65.99 |
| quality | AgCLV            | 256/398 | 63.16 | 61.85 | +1.31 | 63.71 | 63.71 |
| quality | netCLV           | 392/398 | 3.94 | 3.73 | +0.21 | 3.45 | 3.47 |
| quality | Tape             | 374/398 | 2.59 | 2.01 | +0.58 | 1.77 | 1.50 |
| quality | V12 score        | 398/398 | 0.85 | 0.83 | +0.02 | 0.96 | 0.95 |
| quality | V12 forMean      | 398/398 | 26.76 | 21.30 | +5.46 | 17.52 | 15.08 |
| quality | V12 agMean       | 398/398 | 1.75 | 1.55 | +0.20 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 375/398 | 0.567 | -0.028 | +0.128 | +2.73 | 🟡 mild OK |
|    2 | Tape             | quality | 374/398 | 0.554 | -0.035 | +0.104 | +0.58 | 🟡 mild OK |
|    3 | V12 forMean      | quality | 398/398 | 0.550 | +0.124 | +0.100 | +5.46 | 🟡 mild OK |
|    4 | ForWR            | quality | 375/398 | 0.544 | -0.045 | +0.120 | +2.30 | 🟡 mild OK |
|    5 | AgWR             | quality | 231/398 | 0.459 | +0.069 | -0.070 | -0.82 | 🟡 mild OK |
|    6 | WA ForN          | depth   | 398/398 | 0.464 | +0.213 | -0.065 | -0.15 | flat |
|    7 | V12 score        | quality | 398/398 | 0.531 | +0.008 | +0.033 | +0.02 | flat |
|    8 | AgCLV            | quality | 256/398 | 0.528 | -0.041 | +0.082 | +1.31 | flat |
|    9 | TopFor WR        | quality | 375/398 | 0.526 | +0.005 | +0.061 | +1.24 | flat |
|   10 | unopposed (A=0)  | depth   | 398/398 | 0.523 | +0.250 | +0.019 | +0.02 | flat |
|   11 | ForCLV           | quality | 392/398 | 0.516 | -0.014 | +0.061 | +1.05 | flat |
|   12 | proven F−A       | depth   | 398/398 | 0.486 | +0.194 | -0.045 | -0.09 | flat |
|   13 | #F − #A          | depth   | 398/398 | 0.486 | +0.129 | +0.017 | +0.07 | flat |
|   14 | proven F         | depth   | 398/398 | 0.486 | +0.308 | -0.044 | -0.07 | flat |
|   15 | V12 agMean       | quality | 398/398 | 0.490 | +0.343 | +0.022 | +0.20 | flat |
|   16 | proven A         | depth   | 398/398 | 0.508 | +0.304 | +0.012 | +0.02 | flat |
|   17 | CLV AgN          | depth   | 397/398 | 0.508 | +0.164 | -0.009 | -0.03 | flat |
|   18 | WA AgN           | depth   | 398/398 | 0.492 | +0.163 | -0.030 | -0.08 | flat |
|   19 | #A sharps        | depth   | 398/398 | 0.507 | +0.142 | -0.013 | -0.04 | flat |
|   20 | v12 F count      | depth   | 398/398 | 0.494 | +0.243 | -0.017 | -0.05 | flat |
|   21 | netCLV           | quality | 392/398 | 0.504 | +0.002 | +0.010 | +0.21 | flat |
|   22 | v12 A count      | depth   | 398/398 | 0.504 | +0.159 | -0.006 | -0.02 | flat |
|   23 | TopAg WR         | quality | 231/398 | 0.504 | +0.065 | -0.038 | -0.55 | flat |
|   24 | #F sharps        | depth   | 398/398 | 0.501 | +0.234 | +0.010 | +0.03 | flat |
|   25 | CLV ForN         | depth   | 397/398 | 0.500 | +0.237 | -0.001 | -0.00 | flat |

### (C) Working read

_N=398 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.567 · Δ +2.73 · higher on WINs (cov 375/398)
- **Tape** — AUC 0.554 · Δ +0.58 · higher on WINs (cov 374/398)
- **V12 forMean** — AUC 0.550 · Δ +5.46 · higher on WINs (cov 398/398)
- **ForWR** — AUC 0.544 · Δ +2.30 · higher on WINs (cov 375/398)
- **AgWR** — AUC 0.459 · Δ -0.82 · higher on LOSSes (cov 231/398)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. See `docs/SKILL_FEATURES.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 895 | 100 | 99 | 93 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 13 | 6-7 | 46.2% | 20.40u | -0.76u | -3.7% | -0.5 |
| on→off | 5 | 2-3 | 40.0% | 11.40u | -2.92u | -25.6% | -1.3 |
| off→on | 14 | 9-5 | 64.3% | 30.40u | +14.93u | +49.1% | +3.0 |
| off→off | 61 | 32-29 | 52.5% | 155.20u | -7.58u | -4.9% | -1.0 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 57 | 28-29 | 49.1% | 162.00u | -0.62u | -0.4% |
| 0–2 | 23 | 14-9 | 60.9% | 39.40u | +7.61u | +19.3% |
| 2–4 | 3 | 1-2 | 33.3% | 6.00u | -3.97u | -66.2% |
| 4+ | 10 | 6-4 | 60.0% | 10.00u | +0.65u | +6.5% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 352n · 52.8% · +3.2%   | 88n · 54.5% · -1.1%    | 241n · 50.6% · +0.5%   | 681n · 52.3% · +1.6%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 7n · 57.1% · -2.8%     | 1n · 100.0% · +85.0%   | 2n · 50.0% · -5.4%     | 10n · 60.0% · -1.2%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 41n · 70.7% · +23.8%   | —                      | —                      | 41n · 70.7% · +23.8%   |
| UFC   | 30n · 73.3% · +13.2%   | —                      | —                      | 30n · 73.3% · +13.2%   |
| WNBA  | 21n · 76.2% · +12.9%   | 16n · 50.0% · +16.9%   | 12n · 58.3% · +35.1%   | 49n · 63.3% · +18.6%   |
| **All** | **458n · 56.6% · +6.6%** | **109n · 55.0% · +4.8%** | **260n · 51.2% · +2.1%** | **827n · 54.7% · +4.8%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1125** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1125 |
| Muted W-L                           |              551-574 |
| Muted Win %                         |                49.0% |
| Counterfactual PnL at flat 1u       |               -64.17 |
| Counterfactual ROI at flat 1u       |                -5.7% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-64.17u** at a flat 1u stake — a counterfactual ROI of **-5.7%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-24 | MLB   | ML     | Boston Red Sox          |  -119 | +0.398 | SHARP    |   2/3 |   2/3 |  55.2 |   65.3 |   +5.9 |  2.27 | HOLD     | 1.00u | WIN     |      +0.84 |
| 2026-08-24 | MLB   | ML     | Seattle Mariners        |  +103 | +0.824 | HC-2     |   3/1 |   3/1 |  48.5 |   62.8 |   -4.4 |  0.02 | HOLD     | 1.00u | WIN     |      +1.03 |
| 2026-08-24 | MLB   | ML     | San Diego Padres        |  -107 | +0.662 | PATH-D   |   3/3 |   1/1 |  49.1 |   60.6 |   +3.3 |  0.28 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-24 | MLB   | ML     | Texas Rangers           |  +120 | +0.589 | CONFIRMED-UNOPP |   2/2 |   2/2 |  53.6 |   62.5 |   +4.1 |  0.97 | HOLD     | 1.00u | WIN     |      +1.20 |
| 2026-08-24 | SOC   | ML     | Chelsea FC              |  +105 | +0.791 | CONFIRMED-UNOPP |  16/0 |   2/0 |  47.0 |   59.0 |   -3.0 | -1.05 | HOLD     | 1.00u | WIN     |      +1.05 |
| 2026-08-24 | WNBA  | ML     | Atlanta Dream           |  -700 | +0.987 | HC-2     |   4/1 |   4/1 |  57.4 |   57.1 |  +17.4 |  2.35 | HOLD     | 6.00u | WIN     |      +0.86 |
| 2026-08-24 | MLB   | SPREAD | Chicago Cubs            |  -400 | +0.980 | SHARP~   |   1/1 |   1/0 |  56.7 |   50.0 |  +11.8 |  0.30 | HOLD     | 4.00u | WIN     |      +1.00 |
| 2026-08-24 | MLB   | SPREAD | Washington Nationals    |  +110 | +0.923 | HC-1     |   1/0 |   1/0 |  53.6 |   66.5 |   +7.8 |  2.47 | HOLD     | 3.00u | WIN     |      +3.30 |
| 2026-08-24 | WNBA  | SPREAD | Minnesota Lynx          |  -108 | +0.105 | SHARP    |   3/1 |   3/1 |  62.9 |   81.3 |  +17.1 |  6.63 | BOOST    | 5.40u | LOSS    |      -5.40 |
| 2026-08-24 | MLB   | TOTAL  | Over 7.5                |  +115 | +0.386 | CONFIRMED-UNOPP |   4/1 |   2/1 |  49.4 |   61.7 |   -2.9 |  0.04 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-24 | MLB   | TOTAL  | Under 10.5              |  +117 | +0.974 | MINI     |   2/2 |   2/1 |  53.6 |   60.1 |   +5.4 |  0.52 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-24 | WNBA  | TOTAL  | Over 183.5              |  -116 | +0.957 | 2-for-0  |   2/0 |   2/0 |  52.0 |   67.2 |   +2.0 |  1.19 | HOLD     | 3.00u | LOSS    |      -3.00 |
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

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.527 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.068 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.007 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.008 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.027 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  822 |    +0.0402 |    -0.0225 | 0.0001 |  +0.010 |   0.950 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  822 |    +0.0597 |    +0.4952 | 0.0007 |  +0.027 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  822 |    -0.4426 |    +0.5065 | 0.0012 |  -0.035 |   2.831 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 822 |          +0.078 |           +0.016 |                   +0.045 |                   +0.004 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 822 |          -0.002 |           +0.306 |                   +0.012 |                   +0.111 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 822 |          +0.006 |           +0.163 |                   -0.013 |                   +0.034 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 822 |          -0.015 |           +0.159 |                   +0.013 |                   +0.092 | count of contributing AGAINST-side wallets                     |
| provenFor         | 822 |          +0.009 |           +0.146 |                   +0.000 |                   +0.062 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 822 |          +0.006 |           +0.114 |                   +0.022 |                   +0.059 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.022         | 274 | 150-124 |   54.7% |     +1.4% |
| MID (p33–p67)     | 19.950 … 20.625        | 274 | 142-132 |   51.8% |     -1.2% |
| HIGH (> p67)      | 48.906 … 78.576        | 274 | 157-117 |   57.3% |     +1.2% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       822 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8551 | average score across live picks                                 |
| SD                |    0.2252 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.077 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +3.316 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.468 / +0.961 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  677 | 354-323 |   52.3% |     +1.5% |  0.509 |        -0.056 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   10 | 6-4    |   60.0% |     -1.2% |  0.417 |        -0.515 | anti-signal (N<20)                        |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   40 | 28-12  |   70.0% |    +23.5% |  0.560 |        -0.010 | real                                      |
| UFC   |   30 | 22-8   |   73.3% |    +13.2% |  0.619 |        +0.163 | strong                                    |
| WNBA  |   49 | 31-18  |   63.3% |    +18.6% |  0.527 |        -0.060 | noise                                     |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.575, 0.628, 0.604, 0.619, 0.582, 0.546, 0.564, 0.545, 0.577, 0.543, 0.537, 0.521, 0.537, 0.536]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24"]
    y-axis "edge (pp)" -17 --> 3
    line [-11.9, -15.7, -7, -1.3, -3, -1.3, -0.2, 1.1, 1.6, -2.5, -2.5, -1.8, -1.2, -0.9]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
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
| 2026-08-24 |    7 |  120 | 64-56  |   53.3% |     +3.9% |  0.536 |      -0.9pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.510 avg in first half → 0.539 avg in second half · Δ = +0.028)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.8% | [-2.1%, +11.7%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.7% | [51.2%, 57.9%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.527 | [0.487, 0.565]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             77 | [20, 130]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       827 |
| Unique wallets ever on a FOR side            |                                                       218 |
| Avg FOR-side wallets per pick                |                                                      2.71 |
| Top-5 wallets' share of all FOR appearances  |                                                     24.1% |
| Top-10 wallets' share of all FOR appearances |                                                     42.2% |
| Top-20 wallets' share of all FOR appearances |                                                     58.7% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  137 |   16 | 72-65  |   52.6% |    +10.2% |    +40.02 |     1.61× | CONFIRMED   |     -0.4% |     313 | 2026-08-24 |
|    2 | 4b912c  | MLB,NFL,SOC,WNBA |  117 |   37 | 63-54  |   53.8% |     +6.8% |    +18.35 |     1.48× | CONFIRMED   |     -5.6% |     303 | 2026-08-24 |
|    3 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    4 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    5 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     334 | 2026-08-05 |
|    6 | cd2f63  | MLB,NBA,NFL,SOC,WNBA |   87 |   44 | 47-40  |   54.0% |    +13.5% |    +33.24 |     1.12× | CONFIRMED   |     +8.6% |     506 | 2026-08-22 |
|    7 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   85 |   45 | 40-45  |   47.1% |     -4.3% |    -10.29 |     1.26× | CONFIRMED   |     +4.5% |     356 | 2026-08-24 |
|    8 | 2f2a9e  | MLB,SOC,WNBA |   79 |   32 | 42-37  |   53.2% |     -5.5% |    -11.45 |     2.03× | CONFIRMED   |     -6.7% |     283 | 2026-08-24 |
|    9 | 0f9d74  | MLB,NBA,NFL,SOC,UFC |   78 |   55 | 43-35  |   55.1% |    +12.7% |    +25.56 |     0.46× | CONFIRMED   |    +15.7% |     332 | 2026-08-23 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   52 |   16 | 31-21  |   59.6% |    +25.2% |    +32.09 |     0.73× | CONFIRMED   |     +9.8% |     219 | 2026-08-18 |
|   12 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   45 |   58 | 21-24  |   46.7% |     -8.6% |    -10.89 |     4.37× | CONFIRMED   |     -7.0% |     261 | 2026-08-22 |
|   13 | 705ba1  | MLB        |   43 |   17 | 19-24  |   44.2% |     -9.1% |    -11.37 |     1.11× | CONFIRMED   |     +8.1% |     187 | 2026-08-21 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   40 |   20 | 19-21  |   47.5% |     -1.2% |     -1.36 |     1.19× | CONFIRMED   |     -5.4% |     172 | 2026-08-23 |
|   15 | 621848  | MLB,SOC,UFC,WNBA |   36 |   11 | 20-16  |   55.6% |     -8.2% |     -8.06 |     0.60× | CONFIRMED   |     +5.6% |      97 | 2026-08-24 |
|   16 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 |   22 | 19-15  |   55.9% |     +0.8% |     +0.85 |     1.36× | CONFIRMED   |    +13.8% |     143 | 2026-07-30 |
|   17 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   18 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   19 | 3bdd7e  | MLB,NFL,SOC,WNBA |   29 |   11 | 15-14  |   51.7% |    -14.8% |     -7.73 |     3.92× | CONFIRMED   |     -7.4% |     103 | 2026-08-24 |
|   20 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |

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
|    8 | a0cff6  | MLB,NBA,SOC,UFC,WNBA |   15 | 10-5   |   66.7% |     +26.7% |     +9.57 |     5.07× | 2026-08-24 |
|    9 | 7923c4  | MLB,NBA,UFC |   52 | 31-21  |   59.6% |     +25.2% |    +32.09 |     0.73× | 2026-08-18 |
|   10 | f9e3d0  | MLB,NBA    |   10 | 5-5    |   50.0% |     +23.2% |     +7.23 |     1.43× | 2026-08-01 |
|   11 | c911a4  | MLB,NBA,SOC |   21 | 11-10  |   52.4% |     +17.0% |    +10.19 |     4.63× | 2026-08-01 |
|   12 | 7dd2e5  | UFC        |   25 | 19-6   |   76.0% |     +16.6% |    +18.58 |     1.43× | 2026-08-22 |
|   13 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 | 64-37  |   63.4% |     +15.8% |    +53.36 |     1.54× | 2026-07-19 |
|   14 | b839b3  | MLB,NBA,SOC,UFC |   25 | 16-9   |   64.0% |     +15.5% |    +13.19 |     1.34× | 2026-08-18 |
|   15 | 69f882  | MLB,SOC,UFC,WNBA |   20 | 14-6   |   70.0% |     +15.1% |     +7.67 |     4.15× | 2026-08-24 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 2a8409  | MLB,WNBA   |   10 | 3-7    |   30.0% |     -45.4% |     -7.49 |     1.10× | 2026-08-24 |
|    3 | 8ec926  | MLB,UFC,WNBA |   14 | 5-9    |   35.7% |     -36.6% |    -15.75 |     5.48× | 2026-08-15 |
|    4 | 209728  | MLB        |   11 | 4-7    |   36.4% |     -33.2% |     -6.80 |     0.69× | 2026-08-24 |
|    5 | c9bba3  | MLB,NFL,SOC |   15 | 8-7    |   53.3% |     -24.1% |     -8.14 |     0.83× | 2026-08-23 |
|    6 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    7 | 3bdd7e  | MLB,NFL,SOC,WNBA |   29 | 15-14  |   51.7% |     -14.8% |     -7.73 |     3.92× | 2026-08-24 |
|    8 | ac9705  | MLB,WNBA   |   21 | 9-12   |   42.9% |     -12.2% |     -9.27 |     2.26× | 2026-08-22 |
|    9 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|   10 | 705ba1  | MLB        |   43 | 19-24  |   44.2% |      -9.1% |    -11.37 |     1.11× | 2026-08-21 |
|   11 | 4c8ed9  | MLB,SOC,UFC,WNBA |   14 | 7-7    |   50.0% |      -9.1% |     -1.54 |     2.75× | 2026-08-24 |
|   12 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   45 | 21-24  |   46.7% |      -8.6% |    -10.89 |     4.37× | 2026-08-22 |
|   13 | 621848  | MLB,SOC,UFC,WNBA |   36 | 20-16  |   55.6% |      -8.2% |     -8.06 |     0.60× | 2026-08-24 |
|   14 | 2f2a9e  | MLB,SOC,WNBA |   79 | 42-37  |   53.2% |      -5.5% |    -11.45 |     2.03× | 2026-08-24 |
|   15 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   85 | 40-45  |   47.1% |      -4.3% |    -10.29 |     1.26× | 2026-08-24 |

> 🔴 **6 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `3bdd7e` (FOR# 29, ROI -14.8%), `1e8f33` (FOR# 94, ROI -10.7%), `705ba1` (FOR# 43, ROI -9.1%), `7da3d5` (FOR# 45, ROI -8.6%), `621848` (FOR# 36, ROI -8.2%), `2f2a9e` (FOR# 79, ROI -5.5%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1656 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   400 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     8 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    62 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     8 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   355 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            257 |        60 |   24 |   16 |  157 |                    100 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            242 |        64 |   39 |    9 |  130 |                    112 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   86 |    827 | 1125 | 452-375 |  54.7% |      4.8% |    +108.04 |    +0.13 | 0.506 |        0.2497 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  767 |    +1.3pp |    +13.8pp |          +0.304 |   -0.042 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  765 |    +6.3pp |    +23.6pp |          +0.444 |   +0.113 |    +0.0306 | 🟢 better |
| v12 − v11          | +  716 |    -0.3pp |     +2.0pp |          +0.070 |   +0.063 |    +0.0144 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 681n 52.3% +2% | 10n 30.0% +29% | 10n 60.0% -1%  | 6n 83.3% +38%  | 41n 70.7% +24% | 30n 73.3% +13% | 49n 63.3% +19% | 827n 54.7% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 165n +1%      | 234n +2%      | 186n +8%      | 115n -1%      | 122n +19%     | 🟡 partial (2) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2234 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1061 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 822 / 1061 (77%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 822 / 1061 (77%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 822 / 1061 (77%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 822 / 1061 (77%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 822 / 1061 (77%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 822 / 1061 (77%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 822 / 1061 (77%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1061 / 1061 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1061 / 1061 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1061 / 1061 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1061 / 1061 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1061 / 1061 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1061 / 1061 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1054 / 1061 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1052 / 1061 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1061 / 1061 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1060 / 1061 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 645 / 1061 (61%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1060 / 1061 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 645 / 1061 (61%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 644 / 1061 (61%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1061 / 1061 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1061 / 1061 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1061 / 1061 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1060 / 1061 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1061 / 1061 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 645 |      |    +0.021 |    +0.261 |      +0.051 |      +0.128 |  0.523 |
|    2 | wd contribMargin     | 1061 |      |    -0.026 |    -0.140 |      -0.049 |      -0.106 |  0.468 |
|    3 | V12 forMean          | 822 |  🟢  |    +0.078 |    +0.016 |      +0.045 |      +0.004 |  0.531 |
|    4 | wd maxForContrib     | 1060 |      |    -0.052 |    -0.102 |      -0.045 |      -0.048 |  0.484 |
|    5 | qMargin              | 822 |  🟢  |    +0.081 |    +0.006 |      +0.044 |      -0.005 |  0.531 |
|    6 | wd sizeMargin        | 644 |      |    -0.014 |    -0.017 |      -0.044 |      -0.066 |  0.493 |
|    7 | clv                  | 1052 |      |    -0.038 |    +0.039 |      -0.036 |      +0.008 |  0.506 |
|    8 | wd agAvgSize         | 645 |      |    +0.013 |    +0.021 |      +0.036 |      +0.045 |  0.504 |
|    9 | hcMargin             | 1061 |      |    -0.012 |    +0.201 |      -0.035 |      +0.051 |  0.506 |
|   10 | wd contribFor        | 1061 |      |    -0.030 |    -0.087 |      -0.035 |      -0.063 |  0.476 |
|   11 | provenMargin         | 1061 |      |    -0.013 |    +0.055 |      -0.030 |      -0.015 |  0.491 |
|   12 | lockPinnProb         | 1054 |      |    +0.188 |    +0.156 |      +0.029 |      -0.130 |  0.601 |
|   13 | provenFor            | 1061 |      |    -0.019 |    +0.036 |      -0.025 |      -0.020 |  0.491 |
|   14 | countMargin          | 822 |      |    +0.016 |    +0.071 |      -0.021 |      -0.026 |  0.495 |
|   15 | wd forCount          | 1060 |      |    -0.009 |    +0.092 |      -0.019 |      -0.009 |  0.487 |
|   16 | ags (v11)            | 1061 |      |    +0.003 |    +0.041 |      -0.019 |      -0.027 |  0.507 |
|   17 | wd forAvgSize        | 1060 |      |    +0.001 |    +0.049 |      -0.019 |      -0.008 |  0.511 |
|   18 | provenTotal          | 1061 |      |    -0.019 |    -0.005 |      -0.017 |      -0.017 |  0.495 |
|   19 | peakStars            | 1061 |      |    +0.006 |    +0.069 |      -0.016 |      -0.013 |  0.502 |
|   20 | wd contribAg         | 1061 |      |    -0.008 |    +0.128 |      +0.014 |      +0.058 |  0.496 |
|   21 | wd maxShare          | 1061 |      |    +0.016 |    -0.044 |      +0.013 |      -0.004 |  0.510 |
|   22 | V12 forCount         | 822 |  🟢  |    +0.006 |    +0.163 |      -0.013 |      +0.034 |  0.505 |
|   23 | V12 agCount          | 822 |  🟢  |    -0.015 |    +0.159 |      +0.013 |      +0.092 |  0.506 |
|   24 | V12 agMean           | 822 |  🟢  |    -0.002 |    +0.306 |      +0.012 |      +0.111 |  0.491 |
|   25 | agsV12               | 822 |  🟢  |    +0.027 |    -0.007 |      +0.010 |      -0.008 |  0.527 |
|   26 | provenAg             | 1061 |      |    -0.012 |    +0.138 |      +0.001 |      +0.060 |  0.502 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.051), `wd contribMargin` (r = -0.049), `V12 forMean` (r = +0.045).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd agCount` — r(unit-ret) = +0.051, AUC = 0.523. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.051 · AUC = 0.523

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 312 | 164-148 |   52.6% |     -1.3% |
| MID (p33–p67)     | 2.000 … 2.000            | 157 | 82-75   |   52.2% |     -1.6% |
| HIGH (> p67)      | 3.000 … 3.000            | 176 | 101-75  |   57.4% |     +3.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribMargin` · r(unit-ret) = -0.049 · AUC = 0.468

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … 17.300         | 354 | 204-150 |   57.6% |     +2.8% |
| MID (p33–p67)     | 57.800 … 33.100          | 353 | 194-159 |   55.0% |     +0.8% |
| HIGH (> p67)      | 174.100 … 193.650        | 354 | 178-176 |   50.3% |     -3.0% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.045 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 11.022           | 274 | 150-124 |   54.7% |     +1.4% |
| MID (p33–p67)     | 19.950 … 20.625          | 274 | 142-132 |   51.8% |     -1.2% |
| HIGH (> p67)      | 48.906 … 78.576          | 274 | 157-117 |   57.3% |     +1.2% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd maxForContrib` · r(unit-ret) = -0.045 · AUC = 0.484

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 33.100          | 354 | 199-155 |   56.2% |     +1.7% |
| MID (p33–p67)     | 52.400 … 59.900          | 353 | 193-160 |   54.7% |     +0.4% |
| HIGH (> p67)      | 100.000 … 69.000         | 353 | 184-169 |   52.1% |     -1.3% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `qMargin` · r(unit-ret) = +0.044 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 2.224            | 274 | 146-128 |   53.3% |     +0.2% |
| MID (p33–p67)     | 19.950 … 11.022          | 274 | 148-126 |   54.0% |     +0.5% |
| HIGH (> p67)      | 46.556 … 77.776          | 274 | 155-119 |   56.6% |     +0.6% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | wd contribMargin | V12 forMean    | wd maxForContrib | qMargin        | wd sizeMargin  | clv            | wd agAvgSize   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         -0.153 |         +0.139 |         +0.302 |         +0.030 |         +0.030 |         +0.015 |         +0.103 |
| wd contribMargin |         -0.153 |  1.000         |         +0.083 |         +0.515 |         +0.065 |         +0.274 |         -0.054 |         -0.149 |
| V12 forMean |         +0.139 |         +0.083 |  1.000         |         +0.209 |         +0.966 |         +0.217 |         -0.012 |         -0.019 |
| wd maxForContrib |         +0.302 |         +0.515 |         +0.209 |  1.000         |         +0.154 |         +0.279 |         -0.042 |         +0.037 |
| qMargin     |         +0.030 |         +0.065 |         +0.966 |         +0.154 |  1.000         |         +0.200 |         -0.006 |         -0.040 |
| wd sizeMargin |         +0.030 |         +0.274 |         +0.217 |         +0.279 |         +0.200 |  1.000         |         -0.057 |         -0.746 |
| clv         |         +0.015 |         -0.054 |         -0.012 |         -0.042 |         -0.006 |         -0.057 |  1.000         |         +0.047 |
| wd agAvgSize |         +0.103 |         -0.149 |         -0.019 |         +0.037 |         -0.040 |         -0.746 |         +0.047 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.966. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 523 picks · features = 8 (+ intercept) · multiple R² = **0.0151** · adjusted R² = **-0.0022** · residual sd = 0.952

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | qMargin              |  🟢 |    +0.0778 |   0.1781 | +0.44        |        1 |
|    2 | wd agCount           |     |    +0.0545 |   0.0513 | +1.06        |        2 |
|    3 | wd contribMargin     |     |    -0.0430 |   0.0537 | -0.80        |        3 |
|    4 | wd agAvgSize         |     |    +0.0335 |   0.0698 | +0.48        |        4 |
|    5 | clv                  |     |    -0.0329 |   0.0418 | -0.79        |        5 |
|    6 | wd sizeMargin        |     |    -0.0231 |   0.0730 | -0.32        |        6 |
|    7 | V12 forMean          |  🟢 |    -0.0128 |   0.1815 | -0.07        |        7 |
|    8 | wd maxForContrib     |     |    -0.0113 |   0.0587 | -0.19        |        8 |
| —    | (intercept)          |     |    +0.0194 |   0.0416 |    +0.47 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.078), `V12 forMean` (β = -0.013)
- V12 IGNORES: `wd agCount` (β = +0.054, t = +1.06), `wd contribMargin` (β = -0.043, t = -0.80), `wd agAvgSize` (β = +0.033, t = +0.48), `clv` (β = -0.033, t = -0.79), `wd sizeMargin` (β = -0.023, t = -0.32), `wd maxForContrib` (β = -0.011, t = -0.19)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.530 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.565 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.036.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Adjusted R² of -0.0022 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*