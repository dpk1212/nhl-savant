# AGS-Unified — V12 Daily Monitor

**Generated:** Saturday, August 29, 2026 at 12:50 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (90 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (90 days ago), V12 has evaluated **2762** picks, shipped **894** for real money (32.4% ship rate), and muted the other **1868**. On the shipped picks V12 has gone **488-406** (54.6% win), staked **2446.00u**, and returned **+92.72u** at **+3.8% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             90 |
| Picks V12 has evaluated             |                           2762 |
| Picks SHIPPED (units > 0)           |                            894 |
| Picks MUTED (score ≤ 0, FADE)       |                           1868 |
| Ship rate                           |                          32.4% |
| Live W-L                            |                        488-406 |
| Live Win %                          |                          54.6% |
| Live PnL (units)                    |                         +92.72 |
| Live ROI                            |                          +3.8% |
| Avg PnL / day                       |                         +1.03u |
| Most recent action (2026-08-30)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **3.8% ROI** across 894 live picks (+92.72u real PnL).
- Mute rule is **saving money** — the 1233 muted picks would have lost -70.33u at flat 1u (-5.7% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.03u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **252-213** · +3.6% ROI · +46.11u on 465 graded — see § 5.

### What to watch

- 🟡 Weakest sport: **NFL** — 14 live, 7-7, -19.3% ROI, -10.08u.

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

**Full book:** 90d · 894 live · 488-406 · **+92.72u** · +3.8% ROI · +1.03u/day.

_Prior to table (2026-06-01 → 2026-08-09): 617 live · 342-275 · +77.62u · cum through prior = +77.62u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
| 2026-08-10 |        17 |    6 |     8 | 2-4        |  33.3% |     14.00 |      -3.58 |    -25.6% |     +74.04 |
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
| 2026-08-28 |        70 |   23 |    35 | 9-14       |  39.1% |     64.00 |     -35.70 |    -55.8% |     +88.69 |
| 2026-08-29 |        68 |    4 |     8 | 3-1        |  75.0% |     17.20 |      +4.03 |     23.4% |     +92.72 |
| 2026-08-30 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |     +92.72 |

> **Trajectory.** 🟡 Last 3 days (-39.0% ROI) **-44.3pp** vs prior (5.3%).

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
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 114 | 71-43 | +9.3% | +50.02u | sized UP after path |
| 2 | Tape HOLD (mid) | 307 | 161-146 | +1.8% | +12.06u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 8 | 4-4 | -8.0% | -0.64u | 🟢 saving $ |
| 2 | Score FADE (≤0 → 0u) | 696 | 352-344 | +1.1% | +7.84u | 🟡 flat |
| 3 | Tape MUTE (tape<0 → 0u) | 84 | 44-40 | +2.3% | +1.94u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 18 | 14-4 | 77.8% | 76.5u | +35.36u | +46.2% | +1.96u | 4 | +49.6% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 106 | 63-43 | 59.4% | 389.7u | +18.38u | +4.7% | +0.17u | 13 | -0.1% | +0.81u | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 96 | 55-41 | 57.3% | 353.0u | +42.56u | +12.1% | +0.44u | 11 | +24.7% | — | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 78 | 38-40 | 48.7% | 267.4u | -14.11u | -5.3% | -0.18u | 11 | +3.5% | +4.22u | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 106 | 54-52 | 50.9% | 299.2u | -10.01u | -3.3% | -0.09u | 19 | -30.6% | — | 🔻 cooling |
| MINI (gate-pass) | `MINI` | A | 3u | 92 | 53-39 | 57.6% | 235.2u | +7.50u | +3.2% | +0.08u | 17 | -14.3% | — | 🟡 flat |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 1 | +85.0% | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 23 | 12-11 | 52.2% | 23.4u | +0.89u | +3.8% | +0.04u | 1 | -100.0% | — | 🟡 flat |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 114 | 71-43 | 62.3% | 537.7u | +50.02u | +9.3% | 30 | -1.6% | +5.03u |
| Tape HOLD (mid) | TAPE | staked | 307 | 161-146 | 52.4% | 654.1u | +12.06u | +1.8% | 80 | +4.0% | -1.00u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 0 | — | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 84 | 44-40 | 52.4% | 84.0u | +1.94u | +2.3% | 28 | +1.2% | — |
| fadeTop≥60 MUTE | E | CF 1u | 8 | 4-4 | 50.0% | 8.0u | -0.64u | -8.0% | 2 | -24.2% | +0.52u |
| Score FADE (≤0 → 0u) | score | CF 1u | 696 | 352-344 | 50.6% | 696.0u | +7.84u | +1.1% | 90 | +32.3% | +2.98u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 5 / +50% | — | — |
| TOP | 38 / -2% | 24 / +4% | 4 / -16% |
| RANK | 48 / +8% | 9 / +24% | — |
| SHARP | 15 / -9% | 37 / +0% | 1 / -100% |
| SHARP-LEAN | 77 / -2% | 26 / -4% | 3 / -30% |
| MINI | 42 / -1% | 9 / +38% | 4 / +1% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 14 / +10% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-08-29)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| SHARP EDGE/net BOTH | 2 | 2-0 | +4.22u | +39.1% |
| HC-1 TOP | 1 | 1-0 | +0.81u | +15.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  20 | 14-4   |  77.8% |       76.50 |     +35.36 |     46.2% |
| TOP PICK (TOP+/TOP)       |  4-5u | 186 | 78-57  |  57.8% |      522.20 |      +6.44 |      1.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 516 | 153-141 |  52.0% |      968.55 |     +11.83 |      1.2% |
| STRONG (MINI)             |    3u | 113 | 53-39  |  57.6% |      235.15 |      +7.50 |      3.2% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  90 | 26-22  |  54.2% |       54.85 |      +1.99 |      3.6% |
| **STAKED TOTAL** |     — | 587 | 324-263 |  55.2% |     1857.25 |     +63.12 |     +3.4% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  20 | 14-4   |  77.8% |       76.50 |     +35.36 |     46.2% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 157 | 63-43  |  59.4% |      389.70 |     +18.38 |      4.7% |
| B · 2-for-0 rescue    | RANK        |    4u | 137 | 55-41  |  57.3% |      352.95 |     +42.56 |     12.1% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 260 | 54-52  |  50.9% |      299.24 |     -10.01 |     -3.3% |
| C · proven-$ consensus | SHARP       |    3u | 105 | 38-40  |  48.7% |      267.36 |     -14.11 |     -5.3% |
| A · mini-HC (gate-pass) | MINI        |    3u | 113 | 53-39  |  57.6% |      235.15 |      +7.50 |      3.2% |
| C · mini gate-cut     | MINI-       |    1u |  26 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  58 | 12-11  |  52.2% |       23.35 |      +0.89 |      3.8% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 579 picks tracked at 0u (would-be 283-296, 48.9% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (15-5, +35.36u)  ·  🟢 TOP PICK (101-85, +6.44u)  ·  🟠 SHARP PLAY (253-263, +11.83u)  ·  🔴 STRONG (67-46, +7.50u)  ·  🟣 LEAN (49-41, +1.99u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29"]
    y-axis "PnL (u)" -14 --> 44
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 7.61, 11.83]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7.5]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 75]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 49]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 59]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 1450 | 1441 | 1380 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 84 | 44-40 | 52.4% | 13.00u | -2.08u | -16.0% |
| HOLD      | 427 | 204-223 | 47.8% | 657.07u | +9.06u | +1.4% |
| BOOST     | 150 | 90-60 | 60.0% | 541.18u | +52.10u | +9.6% |
| FAIL_OPEN | 41 | 22-19 | 53.7% | 54.50u | -15.17u | -27.8% |
| PASS      | 678 | 353-325 | 52.1% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 439 | 234-205 | 53.3% | +0.09u |
| hold (0–2.89) | path u | 602 | 289-313 | 48.0% | +11.27u |
| boost (≥2.89) | ×1.35 | 174 | 101-73 | 58.0% | +46.45u |

_Score coverage: **1215/1380** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 84 | +11.62u | -11.62u | +47.75u | +59.37u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 116 | +35.00u | +52.10u | +17.10u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-29 | MLB | Baltimore Orioles | CONFIRMED-UNOPP | -3.20 | MUTE | 4.00u | 0.00u | — |
| 2026-08-29 | MLB | New York Yankees | CONFIRMED-UNOPP | -3.20 | MUTE | 4.00u | 0.00u | — |
| 2026-08-29 | MLB | Atlanta Braves | CONFIRMED-UNOPP | -3.79 | MUTE | 1.00u | 0.00u | — |
| 2026-08-29 | MLB | Minnesota Twins | HC-1 | 3.90 | BOOST | 1.00u | 0.00u | — |
| 2026-08-29 | MLB | Houston Astros | MINI | 3.46 | BOOST | 1.00u | 0.00u | — |
| 2026-08-29 | MLB | Los Angeles Dodgers | CONFIRMED-UNOPP | -3.79 | MUTE | 1.00u | 0.50u | — |
| 2026-08-29 | MLB | Miami Marlins | CONFIRMED-UNOPP | -2.25 | MUTE | 4.00u | 0.00u | — |
| 2026-08-29 | MLB | St. Louis Cardinals | CONFIRMED-UNOPP | -0.61 | MUTE | 1.00u | 0.00u | — |
| 2026-08-29 | MLB | Tampa Bay Rays | CONFIRMED-UNOPP | -2.08 | MUTE | 1.00u | 0.00u | — |
| 2026-08-29 | SOC | Draw | CONFIRMED-UNOPP | -1.64 | MUTE | 1.00u | 1.00u | — |
| 2026-08-29 | SOC | Tottenham Hotspur FC | HC-1 | 3.44 | BOOST | 4.00u | 0.00u | — |
| 2026-08-29 | UFC | Bilal Hasan | SHARP | 7.52 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-29 | UFC | Liu Ce | SHARP | 7.32 | BOOST | 4.00u | 5.40u | WIN |
| 2026-08-29 | UFC | Andre Lima | MINI- | 8.78 | BOOST | 4.00u | 0.00u | WIN |
| 2026-08-29 | UFC | Rei Tsuruya | HC-1 | 8.78 | BOOST | 4.00u | 5.40u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-1.20** · nPriors=561 · source=expanding_q1 · asOf=2026-08-29 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 1004 | 919 | 865 | 189 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 71 | 28-43 | 39.4% | 11.00u | -3.29u | -29.9% |
| HOLD      | 220 | 114-106 | 51.8% | 265.10u | +12.59u | +4.7% |
| FAIL_OPEN | 27 | 12-15 | 44.4% | 48.30u | -8.48u | -17.6% |
| EXEMPT    | 316 | 162-154 | 51.3% | 424.20u | +15.69u | +3.7% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -48.5 … -0.8 | 34 | 9-25 | 26.5% | 0.0u | +0.00u | — |
| Q2 | -0.6 … 1.8 | 34 | 15-19 | 44.1% | 45.9u | +12.81u | +27.9% |
| Q3 | 1.8 … 5.7 | 35 | 13-22 | 37.1% | 39.1u | -10.30u | -26.3% |
| Q4 | 6.0 … 14.9 | 34 | 18-16 | 52.9% | 66.1u | -5.46u | -8.3% |
| Q5 | 16.4 … 1802.6 | 35 | 21-14 | 60.0% | 75.5u | +11.54u | +15.3% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 71 | 28-43 | -17.33u | +17.33u | +47.50u | +30.17u |

> 🟢 **Mute is saving money** (Δ +17.33u · muted WR 39.4%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 4 | 3-1 | 75.0% | 6.0u | +2.60u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 26 | 6-20 | 23.1% | 28.5u | -14.96u |
| MLB | 46 | 17-29 | 37.0% | 51.5u | -13.26u |
| NFL | 3 | 2-1 | 66.7% | 3.0u | +1.10u |
| SOC | 1 | 0-1 | 0.0% | 1.0u | -1.00u |
| WNBA | 21 | 9-12 | 42.9% | 23.0u | -4.17u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-08-29 | MLB | Kansas City Royals | MINI | -10.8 | -1.2 | 1.00u | pending |
| 2026-08-29 | MLB | Toronto Blue Jays | CONFIRMED-UNOPP | -3.3 | -1.2 | 2.00u | pending |
| 2026-08-29 | NFL | Colts | SHARP~ | -9.8 | -1.2 | 1.00u | pending |
| 2026-08-29 | SOC | Newcastle United FC | — | -134.8 | -1.2 | 1.00u | pending |
| 2026-08-29 | WNBA | Chicago Sky | SHARP~ | -13.0 | -1.2 | 1.00u | pending |
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
| 2026-08-26 | WNBA | Toronto Tempo | SHARP~ | -1.1 | -1.0 | 1.00u | LOSS |
| 2026-08-26 | MLB | Under 8.5 | CONFIRMED-UNOPP | -1.3 | -1.0 | 1.00u | LOSS |
| 2026-08-26 | MLB | Under 8.5 | CONFIRMED-UNOPP | -14.1 | -1.0 | 1.00u | WIN |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 74 | 39-35 | 52.7% | 226.6u | +8.59u | +3.8% |
| Muted (Q1 → 0u) | 71 | 28-43 | 39.4% | 11.0u | -3.29u | -29.9% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 138–79 · 63.6% · +13.7%); **5–10 is the hole** (66–65 · 50.4% · -6.5%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 676 tickets · cov 649/676 (stamp 447 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 301 | 154–147 | 51.2% | -3.4% |
| 5–10 | 131 | 66–65 | 50.4% | -6.5% |
| ≥10 | 217 | 138–79 | 63.6% | +13.7% |
| All | 676 | 370–306 | 54.7% | +3.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 51.4% (109) | 55.4% (65) | 71.3% (87) |
| B | 54.5% (66) | 55.6% (9) | 66.7% (21) |
| C | 38.5% (39) | 46% (50) | 55.9% (102) |

##### Jul 15+ · 465 tickets · cov 444/465 (stamp 442 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 195 | 101–94 | 51.8% | +1.1% |
| 5–10 | 92 | 43–49 | 46.7% | -13.5% |
| ≥10 | 157 | 99–58 | 63.1% | +10.7% |
| All | 465 | 252–213 | 54.2% | +3.6% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50% (50) | 52.8% (36) | 73.9% (46) |
| B | 55% (40) | 25% (4) | 64.3% (14) |
| C | 38.9% (18) | 46.7% (45) | 56.5% (92) |

##### Yesterday (Aug 28) · 23 tickets · cov 23/23 (stamp 23 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 11 | 6–5 | 54.5% | -3.5% |
| 5–10 | 3 | 0–3 | 0.0% | -100.0% |
| ≥10 | 9 | 3–6 | 33.3% | -60.7% |
| All | 23 | 9–14 | 39.1% | -55.8% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 66.7% (3) | 0% (2) | 100% (1) |
| B | — | — | 0% (1) |
| C | 0% (2) | 0% (1) | 28.6% (7) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 676 tickets · cov 670/676 (stamp 459 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 429 | 235–194 | 54.8% | +2.0% |
| 5–10 | 123 | 66–57 | 53.7% | +9.3% |
| ≥10 | 118 | 67–51 | 56.8% | +4.9% |
| All | 676 | 370–306 | 54.7% | +3.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.9% (164) | 50% (52) | 71.7% (53) |
| B | 59.4% (69) | 50% (14) | 53.8% (13) |
| C | 48.7% (115) | 61% (41) | 40.5% (42) |

##### Jul 15+ · 465 tickets · cov 460/465 (stamp 459 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 279 | 157–122 | 56.3% | +6.1% |
| 5–10 | 100 | 53–47 | 53.0% | +9.7% |
| ≥10 | 81 | 40–41 | 49.4% | -8.8% |
| All | 465 | 252–213 | 54.2% | +3.6% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 64.3% (70) | 47.2% (36) | 62.5% (32) |
| B | 56.1% (41) | 50% (10) | 57.1% (7) |
| C | 52.3% (88) | 60.5% (38) | 36.4% (33) |

##### Yesterday (Aug 28) · 23 tickets · cov 23/23 (stamp 23 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 13 | 6–7 | 46.2% | -46.9% |
| 5–10 | 6 | 2–4 | 33.3% | -79.1% |
| ≥10 | 4 | 1–3 | 25.0% | -54.7% |
| All | 23 | 9–14 | 39.1% | -55.8% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50% (2) | 33.3% (3) | 100% (1) |
| B | — | — | 0% (1) |
| C | 28.6% (7) | 0% (2) | 0% (1) |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 676 tickets · cov 649/676 (stamp 441 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 118 | 55–63 | 46.6% | -20.3% |
| 0–2.89 | 368 | 197–171 | 53.5% | +5.8% |
| ≥2.89 | 163 | 106–57 | 65.0% | +13.9% |
| All | 676 | 370–306 | 54.7% | +3.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 58% (150) | 75% (68) |
| B | 61.5% (26) | 53.7% (54) | 62.5% (16) |
| C | 18.2% (11) | 50.5% (111) | 53.6% (69) |

##### Jul 15+ · 465 tickets · cov 444/465 (stamp 441 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 49 | 27–22 | 55.1% | +0.1% |
| 0–2.89 | 277 | 143–134 | 51.6% | +1.4% |
| ≥2.89 | 118 | 73–45 | 61.9% | +8.7% |
| All | 465 | 252–213 | 54.2% | +3.6% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 53.8% (93) | 73.7% (38) |
| B | 60% (10) | 53.8% (39) | 55.6% (9) |
| C | — | 51.1% (92) | 52.4% (63) |

##### Yesterday (Aug 28) · 23 tickets · cov 23/23 (stamp 23 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 3 | 2–1 | 66.7% | +18.3% |
| 0–2.89 | 14 | 6–8 | 42.9% | -33.3% |
| ≥2.89 | 6 | 1–5 | 16.7% | -81.6% |
| All | 23 | 9–14 | 39.1% | -55.8% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 40% (5) | 100% (1) |
| B | — | — | 0% (1) |
| C | — | 33.3% (6) | 0% (4) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 465 | 252-213 | 54.2% | 1269.75u | +46.11u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 465/465 | 2.62 | 2.32 | +0.30 | 2.00 | 2.00 |
| depth   | #A sharps        | 465/465 | 1.34 | 1.36 | -0.02 | 1.00 | 1.00 |
| depth   | #F − #A          | 465/465 | 1.28 | 0.97 | +0.31 | 1.00 | 1.00 |
| depth   | proven F         | 465/465 | 1.74 | 1.67 | +0.07 | 1.00 | 1.00 |
| depth   | proven A         | 465/465 | 0.52 | 0.51 | +0.00 | 0.00 | 0.00 |
| depth   | proven F−A       | 465/465 | 1.23 | 1.16 | +0.07 | 1.00 | 1.00 |
| depth   | v12 F count      | 465/465 | 2.60 | 2.38 | +0.22 | 2.00 | 2.00 |
| depth   | v12 A count      | 465/465 | 1.46 | 1.48 | -0.02 | 1.00 | 1.00 |
| depth   | WA ForN          | 465/465 | 2.00 | 1.90 | +0.09 | 1.00 | 2.00 |
| depth   | WA AgN           | 465/465 | 1.11 | 1.19 | -0.08 | 1.00 | 1.00 |
| depth   | CLV ForN         | 464/465 | 2.43 | 2.21 | +0.23 | 2.00 | 2.00 |
| depth   | CLV AgN          | 464/465 | 1.37 | 1.39 | -0.02 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 465/465 | 0.38 | 0.36 | +0.02 | 0.00 | 0.00 |
| quality | ForWR            | 442/465 | 56.59 | 54.88 | +1.72 | 54.15 | 53.50 |
| quality | AgWR             | 283/465 | 44.67 | 45.72 | -1.04 | 45.60 | 46.84 |
| quality | TopFor WR        | 442/465 | 60.26 | 58.79 | +1.47 | 56.01 | 55.60 |
| quality | TopAg WR         | 283/465 | 47.62 | 48.62 | -1.00 | 48.90 | 49.12 |
| quality | EDGE             | 442/465 | 9.83 | 7.50 | +2.33 | 7.61 | 5.26 |
| quality | ForCLV           | 459/465 | 66.18 | 65.88 | +0.30 | 65.63 | 65.98 |
| quality | AgCLV            | 310/465 | 62.83 | 61.65 | +1.18 | 63.51 | 63.42 |
| quality | netCLV           | 459/465 | 3.63 | 4.12 | -0.49 | 3.41 | 3.66 |
| quality | Tape             | 441/465 | 2.51 | 2.12 | +0.39 | 1.76 | 1.68 |
| quality | V12 score        | 465/465 | 0.84 | 0.81 | +0.03 | 0.96 | 0.95 |
| quality | V12 forMean      | 465/465 | 27.14 | 22.46 | +4.68 | 18.14 | 15.55 |
| quality | V12 agMean       | 465/465 | 2.15 | 2.24 | -0.09 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 442/465 | 0.555 | -0.007 | +0.109 | +2.33 | 🟡 mild OK |
|    2 | V12 score        | quality | 465/465 | 0.546 | +0.017 | +0.065 | +0.03 | 🟡 mild OK |
|    3 | AgWR             | quality | 283/465 | 0.455 | +0.056 | -0.083 | -1.04 | 🟡 mild OK |
|    4 | V12 forMean      | quality | 465/465 | 0.544 | +0.142 | +0.087 | +4.68 | 🟡 mild OK |
|    5 | Tape             | quality | 441/465 | 0.537 | -0.028 | +0.068 | +0.39 | flat |
|    6 | V12 agMean       | quality | 465/465 | 0.463 | +0.331 | -0.008 | -0.09 | flat |
|    7 | AgCLV            | quality | 310/465 | 0.533 | -0.048 | +0.077 | +1.18 | flat |
|    8 | CLV ForN         | depth   | 464/465 | 0.532 | +0.282 | +0.069 | +0.23 | flat |
|    9 | TopFor WR        | quality | 442/465 | 0.532 | +0.083 | +0.072 | +1.47 | flat |
|   10 | #F sharps        | depth   | 465/465 | 0.529 | +0.284 | +0.079 | +0.30 | flat |
|   11 | ForWR            | quality | 442/465 | 0.529 | -0.028 | +0.092 | +1.72 | flat |
|   12 | unopposed (A=0)  | depth   | 465/465 | 0.521 | +0.236 | +0.021 | +0.02 | flat |
|   13 | v12 F count      | depth   | 465/465 | 0.520 | +0.289 | +0.062 | +0.22 | flat |
|   14 | #F − #A          | depth   | 465/465 | 0.517 | +0.206 | +0.071 | +0.31 | flat |
|   15 | proven F−A       | depth   | 465/465 | 0.513 | +0.260 | +0.029 | +0.07 | flat |
|   16 | TopAg WR         | quality | 283/465 | 0.488 | +0.028 | -0.066 | -1.00 | flat |
|   17 | WA AgN           | depth   | 465/465 | 0.490 | +0.175 | -0.030 | -0.08 | flat |
|   18 | netCLV           | quality | 459/465 | 0.490 | -0.018 | -0.022 | -0.49 | flat |
|   19 | CLV AgN          | depth   | 464/465 | 0.508 | +0.172 | -0.007 | -0.02 | flat |
|   20 | #A sharps        | depth   | 465/465 | 0.507 | +0.158 | -0.005 | -0.02 | flat |
|   21 | v12 A count      | depth   | 465/465 | 0.506 | +0.175 | -0.006 | -0.02 | flat |
|   22 | proven F         | depth   | 465/465 | 0.505 | +0.336 | +0.032 | +0.07 | flat |
|   23 | proven A         | depth   | 465/465 | 0.498 | +0.305 | +0.003 | +0.00 | flat |
|   24 | WA ForN          | depth   | 465/465 | 0.502 | +0.268 | +0.032 | +0.09 | flat |
|   25 | ForCLV           | quality | 459/465 | 0.500 | -0.048 | +0.017 | +0.30 | flat |

### (C) Working read

_N=465 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.555 · Δ +2.33 · higher on WINs (cov 442/465)
- **V12 score** — AUC 0.546 · Δ +0.03 · higher on WINs (cov 465/465)
- **AgWR** — AUC 0.455 · Δ -1.04 · higher on LOSSes (cov 283/465)
- **V12 forMean** — AUC 0.544 · Δ +4.68 · higher on WINs (cov 465/465)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. See `docs/SKILL_FEATURES.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 962 | 167 | 167 | 160 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 21 | 11-10 | 52.4% | 54.20u | +1.39u | +2.6% | -0.7 |
| on→off | 9 | 3-6 | 33.3% | 26.80u | -12.69u | -47.4% | -3.0 |
| off→on | 23 | 16-7 | 69.6% | 57.20u | +16.76u | +29.3% | +3.0 |
| off→off | 107 | 55-52 | 51.4% | 277.80u | -17.11u | -6.2% | -0.5 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 98 | 47-51 | 48.0% | 300.00u | -24.18u | -8.1% |
| 0–2 | 40 | 23-17 | 57.5% | 83.00u | +10.07u | +12.1% |
| 2–4 | 9 | 7-2 | 77.8% | 17.00u | +3.76u | +22.1% |
| 4+ | 13 | 8-5 | 61.5% | 16.00u | -1.30u | -8.1% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 374n · 52.9% · +4.0%   | 92n · 55.4% · -0.2%    | 260n · 51.2% · +1.5%   | 726n · 52.6% · +2.5%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 10n · 50.0% · -14.1%   | 2n · 50.0% · -71.1%    | 2n · 50.0% · -5.4%     | 14n · 50.0% · -19.3%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 45n · 71.1% · +23.1%   | —                      | —                      | 45n · 71.1% · +23.1%   |
| UFC   | 33n · 75.8% · +15.3%   | —                      | —                      | 33n · 75.8% · +15.3%   |
| WNBA  | 26n · 73.1% · -0.1%    | 19n · 42.1% · +1.0%    | 15n · 46.7% · -10.3%   | 60n · 56.7% · -2.1%    |
| **All** | **495n · 56.8% · +6.2%** | **117n · 53.8% · +0.7%** | **282n · 51.1% · +1.2%** | **894n · 54.6% · +3.8%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1233** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1233 |
| Muted W-L                           |              602-631 |
| Muted Win %                         |                48.8% |
| Counterfactual PnL at flat 1u       |               -70.33 |
| Counterfactual ROI at flat 1u       |                -5.7% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-70.33u** at a flat 1u stake — a counterfactual ROI of **-5.7%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-29 | SOC   | ML     | AFC Bournemouth         |  +115 | +0.973 | CONFIRMED-UNOPP |   4/0 |   4/0 |  45.8 |   59.6 |   -4.2 | -1.20 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-29 | UFC   | ML     | Bilal Hasan             |  -640 | +0.971 | SHARP    |   3/0 |   1/0 |  76.5 |   76.8 |  +26.5 |  7.52 | BOOST    | 5.40u | WIN     |      +0.84 |
| 2026-08-29 | UFC   | ML     | Liu Ce                  |  -160 | +0.102 | SHARP    |  11/4 |   1/2 |  76.5 |   74.4 |  +26.5 |  7.32 | BOOST    | 5.40u | WIN     |      +3.38 |
| 2026-08-29 | UFC   | ML     | Rei Tsuruya             |  -669 | +0.997 | HC-1     |   1/0 |   1/0 |  75.6 |   86.4 |  +25.6 |  8.78 | BOOST    | 5.40u | WIN     |      +0.81 |
| 2026-08-28 | MLB   | ML     | San Francisco Giants    |  +108 | +0.407 | SHARP~   |   3/5 |   3/2 |  58.8 |   60.1 |   +9.6 |  1.85 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-08-28 | MLB   | ML     | Baltimore Orioles       |  -108 | +0.619 | CONFIRMED-UNOPP |  12/1 |   7/2 |  54.9 |   64.0 |   +2.6 |  2.01 | HOLD     | 1.00u | WIN     |      +0.93 |
| 2026-08-28 | MLB   | ML     | Chicago Cubs            |  -177 | +0.950 | MINI     |   4/1 |   2/0 |  50.9 |   62.7 |   +2.3 |  0.38 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-28 | MLB   | ML     | Miami Marlins           |  -134 | +0.259 | SHARP~   |   4/1 |   4/1 |  52.8 |   68.9 |   +4.9 |  2.32 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-28 | MLB   | ML     | Philadelphia Phillies   |  -114 | +0.967 | MINI     |   6/1 |   3/0 |  51.1 |   62.3 |   +2.6 |  0.36 | HOLD     | 1.00u | WIN     |      +0.88 |
| 2026-08-28 | MLB   | ML     | Pittsburgh Pirates      |  -108 | +0.596 | SHARP~   |   1/1 |   1/1 |  51.6 |   71.3 |   +3.7 |  2.44 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-28 | NFL   | ML     | Falcons                 |  -187 | +0.948 | SHARP~   |   3/3 |   2/0 |  65.0 |   41.7 |  +24.1 |  1.18 | HOLD     | 4.00u | WIN     |      +2.14 |
| 2026-08-28 | NFL   | ML     | Seahawks                |  -108 | +0.946 | SHARP~   |   3/0 |   2/0 |  80.0 |   58.6 |  +30.0 |  5.49 | BOOST    | 5.40u | LOSS    |      -5.40 |
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
| 2026-08-28 | MLB   | TOTAL  | Under 8.5               |  -120 | +0.556 | CONFIRMED-UNOPP |   3/1 |   3/1 |  53.3 |   62.7 |   +3.9 |  0.32 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-28 | MLB   | TOTAL  | Over 6.5                |  -170 | +0.358 | SHARP~   |   1/2 |   1/1 |  64.7 |   58.8 |  +12.4 |  1.82 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-08-28 | MLB   | TOTAL  | Over 7.5                |  -109 | +0.955 | CONFIRMED-UNOPP |   2/1 |   2/1 |  48.0 |   63.7 |   -0.6 | -0.05 | HOLD     | 1.00u | WIN     |      +0.92 |
| 2026-08-28 | MLB   | TOTAL  | Over 8.5                |  +101 | +0.956 | MINI     |   7/3 |   5/2 |  55.5 |   67.5 |   +7.7 |  2.32 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-28 | WNBA  | TOTAL  | Under 179.5             |  +108 | +0.981 | 2-for-0  |   2/0 |   2/0 |  59.0 |   77.0 |  +20.0 |  6.32 | BOOST    | 6.00u | LOSS    |      -6.00 |
| 2026-08-27 | MLB   | ML     | Washington Nationals    |  -138 | +0.903 | CONFIRMED-Q1 |   6/4 |   6/2 |  60.7 |   66.1 |  +12.8 |  3.09 | BOOST    | 5.00u | WIN     |      +3.62 |
| 2026-08-27 | MLB   | ML     | New York Yankees        |  -150 | +0.966 | CONFIRMED-UNOPP |   3/1 |   2/0 |  48.8 |   63.1 |   +3.8 | -0.15 | MUTE     | 1.00u | LOSS    |      -1.00 |
| 2026-08-27 | MLB   | ML     | Atlanta Braves          |  -114 | +0.579 | CONFIRMED-Q1 |  12/3 |  12/3 |  53.2 |   61.8 |   +4.7 |  1.84 | HOLD     | 3.00u | WIN     |      +2.63 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.535 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.064 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.004 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.009 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.045 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  889 |    +0.1086 |    -0.0852 | 0.0007 |  +0.027 |   0.947 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  889 |    +0.0967 |    +0.4636 | 0.0021 |  +0.045 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  889 |    -0.1698 |    +0.2450 | 0.0002 |  -0.014 |   2.844 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 889 |          +0.073 |           +0.032 |                   +0.039 |                   +0.008 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 889 |          -0.013 |           +0.305 |                   -0.001 |                   +0.107 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 889 |          +0.033 |           +0.196 |                   +0.012 |                   +0.049 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 889 |          -0.015 |           +0.172 |                   +0.015 |                   +0.101 | count of contributing AGAINST-side wallets                     |
| provenFor         | 889 |          +0.025 |           +0.173 |                   +0.016 |                   +0.072 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 889 |          +0.004 |           +0.126 |                   +0.021 |                   +0.063 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.633         | 297 | 160-137 |   53.9% |     +0.6% |
| MID (p33–p67)     | 19.950 … 16.530        | 296 | 157-139 |   53.0% |     -0.7% |
| HIGH (> p67)      | 48.906 … 143.250       | 296 | 168-128 |   56.8% |     +0.8% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       889 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8475 | average score across live picks                                 |
| SD                |    0.2345 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.003 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +2.971 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.454 / +0.959 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  722 | 380-342 |   52.6% |     +2.4% |  0.515 |        -0.061 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   14 | 7-7    |   50.0% |    -19.3% |  0.633 |        -0.121 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   44 | 31-13  |   70.5% |    +22.8% |  0.578 |        +0.078 | real                                      |
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
    line [0.546, 0.564, 0.545, 0.577, 0.543, 0.537, 0.521, 0.537, 0.536, 0.539, 0.515, 0.538, 0.598, 0.604]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29"]
    y-axis "edge (pp)" -4 --> 4
    line [-1.3, -0.2, 1.1, 1.6, -2.5, -2.5, -1.8, -1.2, -0.9, -2.3, -0.6, 3, -1.7, -1.4]
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
| 2026-08-28 |    7 |  116 | 64-52  |   55.2% |     -0.7% |  0.598 |      -1.7pp |
| 2026-08-29 |    7 |  100 | 55-45  |   55.0% |     -2.1% |  0.604 |      -1.4pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.524 avg in first half → 0.529 avg in second half · Δ = +0.005)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +3.8% | [-3.0%, +10.6%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.6% | [51.3%, 57.8%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.535 | [0.500, 0.577]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             82 | [23, 139]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       894 |
| Unique wallets ever on a FOR side            |                                                       255 |
| Avg FOR-side wallets per pick                |                                                      2.78 |
| Top-5 wallets' share of all FOR appearances  |                                                     23.1% |
| Top-10 wallets' share of all FOR appearances |                                                     39.9% |
| Top-20 wallets' share of all FOR appearances |                                                     56.2% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  148 |   20 | 80-68  |   54.1% |    +11.4% |    +47.72 |     1.62× | CONFIRMED   |     -0.3% |     339 | 2026-08-28 |
|    2 | 4b912c  | MLB,NFL,SOC,WNBA |  140 |   44 | 74-66  |   52.9% |     +6.6% |    +21.46 |     1.55× | CONFIRMED   |     -8.4% |     384 | 2026-08-28 |
|    3 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    4 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    5 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     334 | 2026-08-05 |
|    6 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   88 |   57 | 41-47  |   46.6% |     -5.2% |    -12.99 |     1.26× | CONFIRMED   |     +2.4% |     396 | 2026-08-28 |
|    7 | cd2f63  | MLB,NBA,NFL,SOC,WNBA |   88 |   44 | 47-41  |   53.4% |    +13.0% |    +32.24 |     1.11× | CONFIRMED   |     +8.3% |     509 | 2026-08-28 |
|    8 | 0f9d74  | MLB,NBA,NFL,SOC,UFC |   84 |   58 | 47-37  |   56.0% |    +13.9% |    +29.24 |     0.48× | CONFIRMED   |    +16.2% |     356 | 2026-08-28 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   81 |   32 | 44-37  |   54.3% |     -4.1% |     -9.05 |     2.04× | CONFIRMED   |     -7.2% |     287 | 2026-08-27 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   54 |   16 | 33-21  |   61.1% |    +28.3% |    +38.34 |     0.83× | CONFIRMED   |    +10.4% |     221 | 2026-08-27 |
|   12 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   48 |   59 | 22-26  |   45.8% |    -13.8% |    -19.55 |     4.11× | CONFIRMED   |     -6.9% |     270 | 2026-08-28 |
|   13 | 705ba1  | MLB        |   47 |   25 | 21-26  |   44.7% |     -8.5% |    -11.26 |     1.13× | FLAT        |     +5.2% |     208 | 2026-08-28 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   44 |   24 | 22-22  |   50.0% |     +4.8% |     +5.95 |     1.17× | CONFIRMED   |     -4.4% |     185 | 2026-08-29 |
|   15 | 621848  | MLB,SOC,UFC,WNBA |   43 |   11 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +9.5% |     109 | 2026-08-28 |
|   16 | 3bdd7e  | MLB,NFL,SOC,WNBA |   42 |   13 | 25-17  |   59.5% |    +11.4% |     +9.11 |     2.97× | CONFIRMED   |     -0.5% |     132 | 2026-08-28 |
|   17 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   36 |   23 | 20-16  |   55.6% |     +1.0% |     +1.12 |     1.35× | CONFIRMED   |    +12.7% |     147 | 2026-08-28 |
|   18 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   19 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   20 | 7dd2e5  | UFC        |   28 |    1 | 22-6   |   78.6% |    +18.5% |    +23.61 |     1.47× | CONFIRMED   |    +19.0% |      36 | 2026-08-29 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | d66e28  | MLB,WNBA   |   13 | 10-3   |   76.9% |     +62.9% |    +21.25 |     0.74× | 2026-08-28 |
|    2 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    3 | 2cbcf8  | MLB,UFC    |   11 | 8-3    |   72.7% |     +45.1% |    +19.74 |     1.12× | 2026-08-28 |
|    4 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    5 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|    6 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|    7 | e8e2cc  | MLB,NFL,WNBA |   11 | 8-3    |   72.7% |     +31.2% |    +10.24 |     0.78× | 2026-08-28 |
|    8 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|    9 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   10 | a0cff6  | MLB,NBA,SOC,UFC,WNBA |   17 | 12-5   |   70.6% |     +28.6% |    +11.97 |     4.60× | 2026-08-29 |
|   11 | 7923c4  | MLB,NBA,UFC |   54 | 33-21  |   61.1% |     +28.3% |    +38.34 |     0.83× | 2026-08-27 |
|   12 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|   13 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|   14 | 4c8ed9  | MLB,SOC,UFC,WNBA |   16 | 9-7    |   56.3% |     +21.7% |     +5.07 |     2.86× | 2026-08-26 |
|   15 | 07152f  | MLB,SOC    |   13 | 8-5    |   61.5% |     +20.6% |     +7.98 |     1.94× | 2026-08-29 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 2a8409  | MLB,WNBA   |   11 | 3-8    |   27.3% |     -48.5% |     -8.49 |     1.21× | 2026-08-25 |
|    2 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    3 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    4 | c9bba3  | MLB,NFL,SOC |   16 | 9-7    |   56.3% |     -22.0% |     -7.65 |     0.80× | 2026-08-28 |
|    5 | 7d395d  | MLB,NFL,UFC,WNBA |   15 | 7-8    |   46.7% |     -20.5% |     -7.23 |     1.70× | 2026-08-28 |
|    6 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    7 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   48 | 22-26  |   45.8% |     -13.8% |    -19.55 |     4.11× | 2026-08-28 |
|    8 | ac9705  | MLB,WNBA   |   21 | 9-12   |   42.9% |     -12.2% |     -9.27 |     2.26× | 2026-08-22 |
|    9 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|   10 | 705ba1  | MLB        |   47 | 21-26  |   44.7% |      -8.5% |    -11.26 |     1.13× | 2026-08-28 |
|   11 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   88 | 41-47  |   46.6% |      -5.2% |    -12.99 |     1.26× | 2026-08-28 |
|   12 | 2f2a9e  | MLB,SOC,WNBA |   81 | 44-37  |   54.3% |      -4.1% |     -9.05 |     2.04× | 2026-08-27 |
|   13 | ad88a3  | MLB,SOC    |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-08-21 |
|   14 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   36 | 20-16  |   55.6% |      +1.0% |     +1.12 |     1.35× | 2026-08-28 |
|   15 | 621848  | MLB,SOC,UFC,WNBA |   43 | 26-17  |   60.5% |      +1.0% |     +1.27 |     0.58× | 2026-08-28 |

> 🔴 **4 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `7da3d5` (FOR# 48, ROI -13.8%), `1e8f33` (FOR# 94, ROI -10.7%), `705ba1` (FOR# 47, ROI -8.5%), `eeabaf` (FOR# 88, ROI -5.2%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1808 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   454 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     8 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    73 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     8 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   364 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            281 |        66 |   26 |   19 |  170 |                    111 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            261 |        68 |   41 |    9 |  143 |                    118 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   90 |    894 | 1233 | 488-406 |  54.6% |      3.8% |     +92.72 |    +0.10 | 0.511 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  834 |    +1.3pp |    +12.7pp |          +0.277 |   -0.038 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  832 |    +6.2pp |    +22.5pp |          +0.417 |   +0.117 |    +0.0306 | 🟢 better |
| v12 − v11          | +  783 |    -0.4pp |     +1.0pp |          +0.043 |   +0.067 |    +0.0144 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 726n 52.6% +2% | 10n 30.0% +29% | 14n 50.0% -19% | 6n 83.3% +38%  | 45n 71.1% +23% | 33n 75.8% +15% | 60n 56.7% -2%  | 894n 54.6% +4% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 175n +2%      | 249n +2%      | 200n +5%      | 123n +2%      | 142n +10%     | 🟡 partial (2) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2409 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1128 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 889 / 1128 (79%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 889 / 1128 (79%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 889 / 1128 (79%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 889 / 1128 (79%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 889 / 1128 (79%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 889 / 1128 (79%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 889 / 1128 (79%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1128 / 1128 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1128 / 1128 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1128 / 1128 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1128 / 1128 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1128 / 1128 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1128 / 1128 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1121 / 1128 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1119 / 1128 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1128 / 1128 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1127 / 1128 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 696 / 1128 (62%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1127 / 1128 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 696 / 1128 (62%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 695 / 1128 (62%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1128 / 1128 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1128 / 1128 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1128 / 1128 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1127 / 1128 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1128 / 1128 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 696 |      |    +0.024 |    +0.254 |      +0.053 |      +0.126 |  0.525 |
|    2 | qMargin              | 889 |  🟢  |    +0.079 |    +0.017 |      +0.040 |      -0.001 |  0.531 |
|    3 | V12 forMean          | 889 |  🟢  |    +0.073 |    +0.032 |      +0.039 |      +0.008 |  0.530 |
|    4 | wd contribMargin     | 1128 |      |    -0.014 |    -0.114 |      -0.039 |      -0.094 |  0.479 |
|    5 | wd sizeMargin        | 695 |      |    -0.009 |    -0.006 |      -0.038 |      -0.057 |  0.499 |
|    6 | wd agAvgSize         | 696 |      |    +0.013 |    +0.005 |      +0.035 |      +0.033 |  0.502 |
|    7 | wd maxForContrib     | 1127 |      |    -0.043 |    -0.105 |      -0.035 |      -0.046 |  0.489 |
|    8 | clv                  | 1119 |      |    -0.032 |    +0.056 |      -0.031 |      +0.016 |  0.515 |
|    9 | lockPinnProb         | 1121 |      |    +0.192 |    +0.176 |      +0.028 |      -0.120 |  0.603 |
|   10 | agsV12               | 889 |  🟢  |    +0.045 |    -0.004 |      +0.027 |      -0.009 |  0.535 |
|   11 | wd contribFor        | 1128 |      |    -0.015 |    -0.069 |      -0.022 |      -0.052 |  0.485 |
|   12 | wd contribAg         | 1128 |      |    -0.003 |    +0.127 |      +0.019 |      +0.058 |  0.499 |
|   13 | hcMargin             | 1128 |      |    +0.006 |    +0.215 |      -0.019 |      +0.057 |  0.516 |
|   14 | V12 agCount          | 889 |  🟢  |    -0.015 |    +0.172 |      +0.015 |      +0.101 |  0.508 |
|   15 | ags (v11)            | 1128 |      |    +0.008 |    +0.070 |      -0.013 |      -0.011 |  0.516 |
|   16 | provenMargin         | 1128 |      |    +0.005 |    +0.090 |      -0.013 |      +0.001 |  0.502 |
|   17 | V12 forCount         | 889 |  🟢  |    +0.033 |    +0.196 |      +0.012 |      +0.049 |  0.518 |
|   18 | wd forAvgSize        | 1127 |      |    +0.007 |    +0.056 |      -0.012 |      -0.001 |  0.516 |
|   19 | provenFor            | 1128 |      |    -0.005 |    +0.065 |      -0.010 |      -0.006 |  0.500 |
|   20 | wd maxShare          | 1128 |      |    +0.013 |    -0.056 |      +0.009 |      -0.012 |  0.507 |
|   21 | provenTotal          | 1128 |      |    -0.009 |    +0.020 |      -0.007 |      -0.005 |  0.498 |
|   22 | peakStars            | 1128 |      |    +0.019 |    +0.069 |      -0.005 |      -0.014 |  0.509 |
|   23 | countMargin          | 889 |      |    +0.043 |    +0.112 |      +0.002 |      -0.009 |  0.511 |
|   24 | wd forCount          | 1127 |      |    +0.015 |    +0.125 |      +0.001 |      +0.006 |  0.499 |
|   25 | provenAg             | 1128 |      |    -0.014 |    +0.145 |      +0.001 |      +0.062 |  0.499 |
|   26 | V12 agMean           | 889 |  🟢  |    -0.013 |    +0.305 |      -0.001 |      +0.107 |  0.476 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.053), `qMargin` (r = +0.040), `V12 forMean` (r = +0.039).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd agCount` — r(unit-ret) = +0.053, AUC = 0.525. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.053 · AUC = 0.525

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 337 | 177-160 |   52.5% |     -1.4% |
| MID (p33–p67)     | 2.000 … 2.000            | 167 | 86-81   |   51.5% |     -1.9% |
| HIGH (> p67)      | 3.000 … 4.000            | 192 | 111-81  |   57.8% |     +3.7% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.040 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 9.902            | 297 | 159-138 |   53.5% |     +0.2% |
| MID (p33–p67)     | 19.950 … 16.530          | 296 | 161-135 |   54.4% |     +0.7% |
| HIGH (> p67)      | 46.556 … 143.250         | 296 | 165-131 |   55.7% |     -0.0% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forMean` · r(unit-ret) = +0.039 · AUC = 0.530

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.633           | 297 | 160-137 |   53.9% |     +0.6% |
| MID (p33–p67)     | 19.950 … 16.530          | 296 | 157-139 |   53.0% |     -0.7% |
| HIGH (> p67)      | 48.906 … 143.250         | 296 | 168-128 |   56.8% |     +0.8% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribMargin` · r(unit-ret) = -0.039 · AUC = 0.479

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -31.755        | 376 | 212-164 |   56.4% |     +1.9% |
| MID (p33–p67)     | 57.800 … 47.800          | 376 | 207-169 |   55.1% |     +0.8% |
| HIGH (> p67)      | 174.100 … 215.050        | 376 | 193-183 |   51.3% |     -2.5% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd sizeMargin` · r(unit-ret) = -0.038 · AUC = 0.499

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.169          | 233 | 129-104 |   55.4% |     +1.8% |
| MID (p33–p67)     | 0.078 … 0.038            | 230 | 119-111 |   51.7% |     -0.3% |
| HIGH (> p67)      | 3.728 … 2.240            | 232 | 126-106 |   54.3% |     -1.8% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | qMargin        | V12 forMean    | wd contribMargin | wd sizeMargin  | wd agAvgSize   | wd maxForContrib | clv            |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         +0.027 |         +0.133 |         -0.152 |         +0.024 |         +0.109 |         +0.303 |         +0.011 |
| qMargin     |         +0.027 |  1.000         |         +0.959 |         +0.070 |         +0.198 |         -0.037 |         +0.157 |         +0.006 |
| V12 forMean |         +0.133 |         +0.959 |  1.000         |         +0.088 |         +0.214 |         -0.018 |         +0.205 |         -0.004 |
| wd contribMargin |         -0.152 |         +0.070 |         +0.088 |  1.000         |         +0.272 |         -0.145 |         +0.507 |         -0.051 |
| wd sizeMargin |         +0.024 |         +0.198 |         +0.214 |         +0.272 |  1.000         |         -0.749 |         +0.265 |         -0.055 |
| wd agAvgSize |         +0.109 |         -0.037 |         -0.018 |         -0.145 |         -0.749 |  1.000         |         +0.054 |         +0.046 |
| wd maxForContrib |         +0.303 |         +0.157 |         +0.205 |         +0.507 |         +0.265 |         +0.054 |  1.000         |         -0.050 |
| clv         |         +0.011 |         +0.006 |         -0.004 |         -0.051 |         -0.055 |         +0.046 |         -0.050 |  1.000         |

> 🔴 **Strong collinearity detected:** `qMargin` and `V12 forMean` have r = +0.959. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 574 picks · features = 8 (+ intercept) · multiple R² = **0.0122** · adjusted R² = **-0.0036** · residual sd = 0.952

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | qMargin              |  🟢 |    +0.1348 |   0.1514 | +0.89        |        1 |
|    2 | V12 forMean          |  🟢 |    -0.0821 |   0.1540 | -0.53        |        2 |
|    3 | wd agCount           |     |    +0.0605 |   0.0481 | +1.26        |        3 |
|    4 | wd agAvgSize         |     |    +0.0397 |   0.0670 | +0.59        |        4 |
|    5 | wd contribMargin     |     |    -0.0302 |   0.0509 | -0.59        |        5 |
|    6 | clv                  |     |    -0.0217 |   0.0399 | -0.54        |        6 |
|    7 | wd sizeMargin        |     |    -0.0129 |   0.0699 | -0.19        |        7 |
|    8 | wd maxForContrib     |     |    -0.0003 |   0.0558 | -0.01        |        8 |
| —    | (intercept)          |     |    +0.0148 |   0.0397 |    +0.37 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.135), `V12 forMean` (β = -0.082)
- V12 IGNORES: `wd agCount` (β = +0.061, t = +1.26), `wd agAvgSize` (β = +0.040, t = +0.59), `wd contribMargin` (β = -0.030, t = -0.59), `clv` (β = -0.022, t = -0.54), `wd sizeMargin` (β = -0.013, t = -0.19), `wd maxForContrib` (β = -0.000, t = -0.01)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.543 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.555 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap ≈ 0** — V12 is capturing essentially all the linear signal available in the panel. The remaining features are noise.

### 17G — Actionable recommendations

- Adjusted R² of -0.0036 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*