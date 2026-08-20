# AGS-Unified — V12 Daily Monitor

**Generated:** Thursday, August 20, 2026 at 9:28 AM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (81 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (81 days ago), V12 has evaluated **2262** picks, shipped **744** for real money (32.9% ship rate), and muted the other **1518**. On the shipped picks V12 has gone **407-337** (54.7% win), staked **2044.00u**, and returned **+101.79u** at **+5.0% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             81 |
| Picks V12 has evaluated             |                           2262 |
| Picks SHIPPED (units > 0)           |                            744 |
| Picks MUTED (score ≤ 0, FADE)       |                           1518 |
| Ship rate                           |                          32.9% |
| Live W-L                            |                        407-337 |
| Live Win %                          |                          54.7% |
| Live PnL (units)                    |                        +101.79 |
| Live ROI                            |                          +5.0% |
| Avg PnL / day                       |                         +1.26u |
| Most recent action (2026-08-20)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **5.0% ROI** across 744 live picks (+101.79u real PnL).
- Mute rule is **saving money** — the 1004 muted picks would have lost -60.24u at flat 1u (-6.0% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.26u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **171-144** · +6.4% ROI · +55.18u on 315 graded — see § 5.

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

**Full book:** 81d · 744 live · 407-337 · **+101.79u** · +5.0% ROI · +1.26u/day.

_Prior to table (2026-06-01 → 2026-07-30): 549 live · 306-243 · +66.81u · cum through prior = +66.81u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-08-19 |        41 |   13 |    18 | 6-7        |  46.2% |     18.50 |      +1.20 |      6.5% |    +101.79 |
| 2026-08-20 |        21 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +101.79 |

> **Trajectory.** Last 3 days (6.6% ROI) ≈ prior book (4.9%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-19**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 13 | 10-3 | +45.3% | +27.88u | +2.14u | — |
| 🟢 2 | RANK 2-for-0 rescue | B | 80 | 45-35 | +11.4% | +33.30u | +0.42u | -26.5% |
| 🟢 3 | MINI- (gate-cut) | C | 19 | 11-8 | +8.9% | +2.27u | +0.12u | -69.2% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 77 | 49-28 | +17.8% | +60.01u | sized UP after path |
| 2 | Tape HOLD (mid) | 206 | 107-99 | +1.6% | +7.50u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 4 | 1-3 | -50.0% | -2.00u | 🟢 saving $ |
| 2 | Score FADE (≤0 → 0u) | 594 | 293-301 | -3.0% | -17.83u | 🟢 saving $ |
| 3 | Tape MUTE (tape<0 → 0u) | 50 | 26-24 | +4.8% | +2.39u | 🔴 costing $ |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 13 | 10-3 | 76.9% | 61.5u | +27.88u | +45.3% | +2.14u | 0 | — | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 89 | 54-35 | 60.7% | 321.7u | +25.40u | +7.9% | +0.29u | 18 | +0.3% | +3.55u | 🟢 OK |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 80 | 45-35 | 56.3% | 291.0u | +33.30u | +11.4% | +0.42u | 11 | -26.5% | -3.00u | 🔻 cooling |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 65 | 30-35 | 46.2% | 201.6u | -15.79u | -7.8% | -0.24u | 7 | -3.5% | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 82 | 43-39 | 52.4% | 222.8u | +6.08u | +2.7% | +0.07u | 23 | +35.7% | +0.70u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 71 | 42-29 | 59.2% | 194.4u | +15.09u | +7.8% | +0.21u | 19 | +49.1% | +5.95u | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 19 | 11-8 | 57.9% | 25.5u | +2.27u | +8.9% | +0.12u | 5 | -69.2% | — | 🔻 cooling |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 22 | 12-10 | 54.5% | 22.4u | +1.89u | +8.5% | +0.09u | 7 | -9.9% | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 77 | 49-28 | 63.6% | 337.7u | +60.01u | +17.8% | 24 | +25.6% | — |
| Tape HOLD (mid) | TAPE | staked | 206 | 107-99 | 51.9% | 464.1u | +7.50u | +1.6% | 82 | +9.9% | +2.20u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 11 | -47.5% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 50 | 26-24 | 52.0% | 50.0u | +2.39u | +4.8% | 19 | +11.0% | -0.04u |
| fadeTop≥60 MUTE | E | CF 1u | 4 | 1-3 | 25.0% | 4.0u | -2.00u | -50.0% | 3 | -33.3% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 594 | 293-301 | 49.3% | 594.0u | -17.83u | -3.0% | 65 | +1.3% | +3.21u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| TOP | 31 / -1% | 14 / +17% | 4 / -16% |
| RANK | 36 / +3% | 5 / +46% | — |
| SHARP | 14 / -13% | 25 / -1% | 1 / -100% |
| SHARP-LEAN | 59 / -1% | 20 / +9% | 3 / -30% |
| MINI | 23 / +15% | 7 / +51% | 4 / +1% |
| MINI- | 5 / -34% | 1 / +45% | 3 / -5% |
| DISSENT | 13 / +19% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-08-19)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| MINI (gate-pass) | 3 | 3-0 | +5.95u | +132.2% |
| HC-1 TOP | 2 | 2-0 | +3.55u | +88.8% |
| SHARP-LEAN EDGE/net ONE | 1 | 1-0 | +0.70u | +70.0% |
| RANK 2-for-0 rescue | 1 | 0-1 | -3.00u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| TOP PICK (TOP+/TOP)       |  4-5u | 156 | 69-49  |  58.5% |      454.20 |     +13.46 |      3.0% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 379 | 124-117 |  51.5% |      764.35 |     +16.98 |      2.2% |
| STRONG (MINI)             |    3u |  85 | 42-29  |  59.2% |      194.35 |     +15.09 |      7.8% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  73 | 25-21  |  54.3% |       52.85 |      +2.14 |      4.0% |
| **STAKED TOTAL** |     — | 489 | 270-219 |  55.2% |     1527.25 |     +75.55 |     +4.9% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  13 | 10-3   |  76.9% |       61.50 |     +27.88 |     45.3% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 127 | 54-35  |  60.7% |      321.70 |     +25.40 |      7.9% |
| B · 2-for-0 rescue    | RANK        |    4u | 103 | 45-35  |  56.3% |      290.95 |     +33.30 |     11.4% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 181 | 43-39  |  52.4% |      222.84 |      +6.08 |      2.7% |
| C · proven-$ consensus | SHARP       |    3u |  81 | 30-35  |  46.2% |      201.56 |     -15.79 |     -7.8% |
| A · mini-HC (gate-pass) | MINI        |    3u |  85 | 42-29  |  59.2% |      194.35 |     +15.09 |      7.8% |
| C · mini gate-cut     | MINI-       |    1u |  23 | 11-8   |  57.9% |       25.50 |      +2.27 |      8.9% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  44 | 12-10  |  54.5% |       22.35 |      +1.89 |      8.5% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 506 picks tracked at 0u (would-be 241-265, 47.6% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (10-3, +27.88u)  ·  🟢 TOP PICK (87-69, +13.46u)  ·  🟠 SHARP PLAY (191-188, +16.98u)  ·  🔴 STRONG (52-33, +15.09u)  ·  🟣 LEAN (37-36, +2.14u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19"]
    y-axis "PnL (u)" -14 --> 31
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 950 | 944 | 910 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 50 | 26-24 | 52.0% | 1.00u | +1.56u | +156.0% |
| HOLD      | 250 | 126-124 | 50.4% | 467.07u | +4.50u | +1.0% |
| BOOST     | 87 | 55-32 | 63.2% | 341.18u | +62.09u | +18.2% |
| FAIL_OPEN | 29 | 13-16 | 44.8% | 54.50u | -15.17u | -27.8% |
| PASS      | 494 | 251-243 | 50.8% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 267 | 138-129 | 51.7% | -2.31u |
| hold (0–2.89) | path u | 417 | 207-210 | 49.6% | +12.75u |
| boost (≥2.89) | ×1.35 | 105 | 64-41 | 61.0% | +56.44u |

_Score coverage: **789/910** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 50 | +13.37u | -13.37u | +27.75u | +41.12u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 79 | +43.70u | +62.09u | +18.39u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-20 | MLB | Cincinnati Reds | SHARP~ | 4.25 | BOOST | 1.00u | 0.00u | — |
| 2026-08-20 | WNBA | Indiana Fever | SHARP~ | -0.11 | MUTE | 2.00u | 0.00u | — |
| 2026-08-20 | MLB | San Francisco Giants | MINI | 5.17 | BOOST | 4.00u | 5.40u | — |
| 2026-08-20 | MLB | Under 8.5 | SHARP~ | -5.64 | MUTE | 4.00u | 0.00u | — |
| 2026-08-20 | MLB | Under 9.5 | SHARP~ | -4.40 | MUTE | 4.00u | 0.00u | — |
| 2026-08-20 | MLB | Over 7.5 | CONFIRMED-UNOPP | -4.40 | MUTE | 4.00u | 0.00u | — |
| 2026-08-20 | MLB | Under 8.5 | SHARP~ | -5.64 | MUTE | 4.00u | 0.00u | — |
| 2026-08-20 | MLB | Over 7.5 | CONFIRMED-UNOPP | -0.70 | MUTE | 1.00u | 1.00u | — |
| 2026-08-20 | MLB | Over 7.5 | CONFIRMED-UNOPP | -4.40 | MUTE | 4.00u | 0.00u | — |
| 2026-08-19 | MLB | New York Yankees | PATH-D | -2.14 | MUTE | 1.00u | 0.00u | WIN |
| 2026-08-19 | WNBA | Golden State Valkyries | SHARP~ | 4.08 | BOOST | 4.00u | 0.00u | LOSS |
| 2026-08-19 | MLB | Under 9.5 | MINI | -0.62 | MUTE | 1.00u | 0.00u | WIN |
| 2026-08-19 | MLB | Under 7.5 | SHARP~ | -0.23 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-19 | MLB | Under 7.5 | MINI- | -0.68 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-08-18 | MLB | Minnesota Twins | CONFIRMED-UNOPP | 4.87 | BOOST | 1.00u | 1.00u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.75** · nPriors=468 · source=expanding_q1 · asOf=2026-08-20 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 504 | 433 | 410 | 88 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 33 | 13-20 | 39.4% | 5.00u | -2.80u | -56.0% |
| HOLD      | 131 | 71-60 | 54.2% | 155.30u | +24.55u | +15.8% |
| FAIL_OPEN | 10 | 5-5 | 50.0% | 14.90u | -5.03u | -33.8% |
| EXEMPT    | 112 | 55-57 | 49.1% | 173.40u | +8.35u | +4.8% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -47.9 … -0.2 | 17 | 5-12 | 29.4% | 2.5u | +0.65u | +26.0% |
| Q2 | 0.0 … 1.8 | 17 | 11-6 | 64.7% | 23.4u | +16.93u | +72.4% |
| Q3 | 2.3 … 6.5 | 17 | 7-10 | 41.2% | 30.1u | -0.54u | -1.8% |
| Q4 | 7.3 … 13.0 | 17 | 9-8 | 52.9% | 33.0u | +4.88u | +14.8% |
| Q5 | 13.9 … 1802.6 | 18 | 8-10 | 44.4% | 27.8u | -1.37u | -4.9% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 33 | 13-20 | -7.60u | +7.60u | +22.50u | +14.90u |

> 🟢 **Mute is saving money** (Δ +7.60u · muted WR 39.4%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 4 | 3-1 | 75.0% | 6.0u | +2.60u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 10 | 2-8 | 20.0% | 10.5u | -6.59u |
| MLB | 23 | 9-14 | 39.1% | 27.5u | -6.11u |
| WNBA | 10 | 4-6 | 40.0% | 10.0u | -1.49u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-08-20 | MLB | Cincinnati Reds | SHARP~ | -37.8 | -0.7 | 1.00u | pending |
| 2026-08-19 | MLB | Los Angeles Dodgers | SHARP~ | -1.8 | -0.2 | 1.00u | WIN |
| 2026-08-19 | MLB | Athletics | CONFIRMED-UNOPP | -47.6 | -0.2 | 1.00u | LOSS |
| 2026-08-19 | MLB | St. Louis Cardinals | CONFIRMED-UNOPP | -0.4 | -0.2 | 1.00u | LOSS |
| 2026-08-19 | MLB | Under 8.5 | SHARP~ | -6.4 | -0.2 | 1.00u | LOSS |
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

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 43 | 23-20 | 53.5% | 116.8u | +20.55u | +17.6% |
| Muted (Q1 → 0u) | 33 | 13-20 | 39.4% | 5.0u | -2.80u | -56.0% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 109–60 · 64.5% · +19.7%); **5–10 is the hole** (57–55 · 50.9% · -6.1%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 526 tickets · cov 499/526 (stamp 297 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 218 | 111–107 | 50.9% | -4.3% |
| 5–10 | 112 | 57–55 | 50.9% | -6.1% |
| ≥10 | 169 | 109–60 | 64.5% | +19.7% |
| All | 526 | 289–237 | 54.9% | +5.2% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (91) | 56.4% (55) | 73.2% (71) |
| B | 52.7% (55) | 55.6% (9) | 68.8% (16) |
| C | 39.4% (33) | 45.5% (44) | 55.8% (77) |

##### Jul 15+ · 315 tickets · cov 294/315 (stamp 292 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 112 | 58–54 | 51.8% | +1.1% |
| 5–10 | 73 | 34–39 | 46.6% | -14.4% |
| ≥10 | 109 | 70–39 | 64.2% | +17.7% |
| All | 315 | 171–144 | 54.3% | +6.4% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 46.9% (32) | 53.8% (26) | 80% (30) |
| B | 51.7% (29) | 25% (4) | 66.7% (9) |
| C | 41.7% (12) | 46.2% (39) | 56.7% (67) |

##### Yesterday (Aug 19) · 13 tickets · cov 12/13 (stamp 12 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 10 | 4–6 | 40.0% | -33.4% |
| 5–10 | 2 | 2–0 | 100.0% | +112.9% |
| All | 13 | 6–7 | 46.2% | +6.5% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 100% (3) | 100% (2) | — |
| B | 0% (1) | — | — |
| C | 100% (1) | — | — |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 526 tickets · cov 520/526 (stamp 309 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 336 | 184–152 | 54.8% | +2.8% |
| 5–10 | 93 | 51–42 | 54.8% | +13.3% |
| ≥10 | 91 | 52–39 | 57.1% | +7.3% |
| All | 526 | 289–237 | 54.9% | +5.2% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.7% (142) | 52.5% (40) | 72.1% (43) |
| B | 56.9% (58) | 58.3% (12) | 50% (10) |
| C | 48.5% (97) | 59.4% (32) | 40.6% (32) |

##### Jul 15+ · 315 tickets · cov 310/315 (stamp 309 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 186 | 106–80 | 57.0% | +9.5% |
| 5–10 | 70 | 38–32 | 54.3% | +15.5% |
| ≥10 | 54 | 25–29 | 46.3% | -13.4% |
| All | 315 | 171–144 | 54.3% | +6.4% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 66.7% (48) | 50% (24) | 59.1% (22) |
| B | 50% (30) | 62.5% (8) | 50% (4) |
| C | 52.9% (70) | 58.6% (29) | 34.8% (23) |

##### Yesterday (Aug 19) · 13 tickets · cov 12/13 (stamp 12 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 6 | 3–3 | 50.0% | +46.1% |
| 5–10 | 3 | 1–2 | 33.3% | -66.0% |
| ≥10 | 3 | 2–1 | 66.7% | +37.3% |
| All | 13 | 6–7 | 46.2% | +6.5% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 100% (3) | — | 100% (2) |
| B | — | 0% (1) | — |
| C | — | 100% (1) | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 526 tickets · cov 499/526 (stamp 291 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 84 | 36–48 | 42.9% | -24.2% |
| 0–2.89 | 289 | 157–132 | 54.3% | +7.2% |
| ≥2.89 | 126 | 84–42 | 66.7% | +21.3% |
| All | 526 | 289–237 | 54.9% | +5.2% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 59.3% (118) | 76.8% (56) |
| B | 56.5% (23) | 53.3% (45) | 66.7% (12) |
| C | 18.2% (11) | 50% (92) | 54.9% (51) |

##### Jul 15+ · 315 tickets · cov 294/315 (stamp 291 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 15 | 8–7 | 53.3% | -6.2% |
| 0–2.89 | 198 | 103–95 | 52.0% | +2.3% |
| ≥2.89 | 81 | 51–30 | 63.0% | +16.5% |
| All | 315 | 171–144 | 54.3% | +6.4% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 54.1% (61) | 76.9% (26) |
| B | 42.9% (7) | 53.3% (30) | 60% (5) |
| C | — | 50.7% (73) | 53.3% (45) |

##### Yesterday (Aug 19) · 13 tickets · cov 12/13 (stamp 12 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 2 | 0–2 | 0.0% | -100.0% |
| 0–2.89 | 10 | 6–4 | 60.0% | +27.1% |
| All | 13 | 6–7 | 46.2% | +6.5% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 100% (5) | — |
| B | — | 0% (1) | — |
| C | — | 100% (1) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 315 | 171-144 | 54.3% | 867.75u | +55.18u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 315/315 | 2.08 | 2.16 | -0.08 | 2.00 | 2.00 |
| depth   | #A sharps        | 315/315 | 1.37 | 1.38 | -0.01 | 1.00 | 1.00 |
| depth   | #F − #A          | 315/315 | 0.71 | 0.78 | -0.08 | 1.00 | 1.00 |
| depth   | proven F         | 315/315 | 1.41 | 1.51 | -0.10 | 1.00 | 1.00 |
| depth   | proven A         | 315/315 | 0.44 | 0.44 | +0.00 | 0.00 | 0.00 |
| depth   | proven F−A       | 315/315 | 0.96 | 1.06 | -0.10 | 1.00 | 1.00 |
| depth   | v12 F count      | 315/315 | 2.06 | 2.16 | -0.10 | 2.00 | 2.00 |
| depth   | v12 A count      | 315/315 | 1.43 | 1.48 | -0.05 | 1.00 | 1.00 |
| depth   | WA ForN          | 315/315 | 1.59 | 1.72 | -0.13 | 1.00 | 1.00 |
| depth   | WA AgN           | 315/315 | 1.09 | 1.17 | -0.08 | 1.00 | 1.00 |
| depth   | CLV ForN         | 314/315 | 1.94 | 2.03 | -0.09 | 2.00 | 2.00 |
| depth   | CLV AgN          | 314/315 | 1.36 | 1.36 | -0.00 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 315/315 | 0.39 | 0.38 | +0.00 | 0.00 | 0.00 |
| quality | ForWR            | 292/315 | 57.23 | 54.74 | +2.49 | 54.40 | 54.20 |
| quality | AgWR             | 183/315 | 44.25 | 44.69 | -0.44 | 45.00 | 45.90 |
| quality | TopFor WR        | 292/315 | 59.64 | 58.22 | +1.42 | 55.75 | 55.60 |
| quality | TopAg WR         | 183/315 | 47.33 | 48.05 | -0.72 | 48.69 | 48.90 |
| quality | EDGE             | 292/315 | 10.67 | 7.81 | +2.86 | 8.57 | 5.88 |
| quality | ForCLV           | 309/315 | 66.86 | 66.23 | +0.63 | 66.03 | 66.09 |
| quality | AgCLV            | 202/315 | 63.00 | 61.43 | +1.57 | 64.00 | 63.98 |
| quality | netCLV           | 309/315 | 4.20 | 4.60 | -0.40 | 3.65 | 3.87 |
| quality | Tape             | 291/315 | 2.77 | 2.27 | +0.51 | 2.09 | 1.81 |
| quality | V12 score        | 315/315 | 0.85 | 0.83 | +0.02 | 0.96 | 0.95 |
| quality | V12 forMean      | 315/315 | 23.32 | 18.28 | +5.04 | 16.18 | 14.06 |
| quality | V12 agMean       | 315/315 | 1.56 | 1.49 | +0.07 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 292/315 | 0.572 | +0.004 | +0.141 | +2.86 | 🟡 mild OK |
|    2 | V12 forMean      | quality | 315/315 | 0.562 | +0.052 | +0.114 | +5.04 | 🟡 mild OK |
|    3 | Tape             | quality | 291/315 | 0.543 | -0.000 | +0.097 | +0.51 | 🟡 mild OK |
|    4 | V12 score        | quality | 315/315 | 0.542 | -0.047 | +0.041 | +0.02 | 🟡 mild OK |
|    5 | AgCLV            | quality | 202/315 | 0.539 | -0.046 | +0.093 | +1.57 | flat |
|    6 | ForWR            | quality | 292/315 | 0.539 | -0.047 | +0.133 | +2.49 | flat |
|    7 | WA ForN          | depth   | 315/315 | 0.476 | +0.176 | -0.058 | -0.13 | flat |
|    8 | proven F−A       | depth   | 315/315 | 0.477 | +0.187 | -0.050 | -0.10 | flat |
|    9 | unopposed (A=0)  | depth   | 315/315 | 0.523 | +0.218 | +0.004 | +0.00 | flat |
|   10 | proven F         | depth   | 315/315 | 0.481 | +0.274 | -0.066 | -0.10 | flat |
|   11 | proven A         | depth   | 315/315 | 0.518 | +0.293 | +0.000 | +0.00 | flat |
|   12 | #F − #A          | depth   | 315/315 | 0.482 | +0.073 | -0.020 | -0.08 | flat |
|   13 | #A sharps        | depth   | 315/315 | 0.517 | +0.166 | -0.002 | -0.01 | flat |
|   14 | CLV AgN          | depth   | 314/315 | 0.516 | +0.185 | -0.001 | -0.00 | flat |
|   15 | AgWR             | quality | 183/315 | 0.485 | +0.098 | -0.036 | -0.44 | flat |
|   16 | TopFor WR        | quality | 292/315 | 0.514 | -0.018 | +0.070 | +1.42 | flat |
|   17 | netCLV           | quality | 309/315 | 0.488 | +0.029 | -0.018 | -0.40 | flat |
|   18 | CLV ForN         | depth   | 314/315 | 0.494 | +0.170 | -0.037 | -0.09 | flat |
|   19 | v12 F count      | depth   | 315/315 | 0.495 | +0.209 | -0.038 | -0.10 | flat |
|   20 | V12 agMean       | quality | 315/315 | 0.505 | +0.345 | +0.009 | +0.07 | flat |
|   21 | TopAg WR         | quality | 183/315 | 0.504 | +0.061 | -0.046 | -0.72 | flat |
|   22 | v12 A count      | depth   | 315/315 | 0.503 | +0.188 | -0.017 | -0.05 | flat |
|   23 | #F sharps        | depth   | 315/315 | 0.497 | +0.197 | -0.030 | -0.08 | flat |
|   24 | WA AgN           | depth   | 315/315 | 0.501 | +0.185 | -0.029 | -0.08 | flat |
|   25 | ForCLV           | quality | 309/315 | 0.500 | +0.012 | +0.037 | +0.63 | flat |

### (C) Working read

_N=315 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.572 · Δ +2.86 · higher on WINs (cov 292/315)
- **V12 forMean** — AUC 0.562 · Δ +5.04 · higher on WINs (cov 315/315)
- **Tape** — AUC 0.543 · Δ +0.51 · higher on WINs (cov 291/315)
- **V12 score** — AUC 0.542 · Δ +0.02 · higher on WINs (cov 315/315)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. See `docs/SKILL_FEATURES.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 813 | 18 | 18 | 10 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 2 | 0-2 | 0.0% | 2.00u | -2.00u | -100.0% | -0.8 |
| on→off | 1 | 1-0 | 100.0% | 1.00u | +1.09u | +109.0% | +0.0 |
| off→on | 1 | 0-1 | 0.0% | 1.00u | -1.00u | -100.0% | +7.9 |
| off→off | 6 | 3-3 | 50.0% | 10.00u | -0.67u | -6.7% | -1.0 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 8 | 3-5 | 37.5% | 12.00u | -2.67u | -22.3% |
| 0–2 | 1 | 1-0 | 100.0% | 1.00u | +1.09u | +109.0% |
| 4+ | 1 | 0-1 | 0.0% | 1.00u | -1.00u | -100.0% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 336n · 52.7% · +3.1%   | 79n · 57.0% · +3.5%    | 223n · 52.0% · +1.8%   | 638n · 53.0% · +2.6%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 35n · 68.6% · +22.9%   | —                      | —                      | 35n · 68.6% · +22.9%   |
| UFC   | 24n · 75.0% · +16.0%   | —                      | —                      | 24n · 75.0% · +16.0%   |
| WNBA  | 14n · 71.4% · +6.8%    | 10n · 40.0% · -17.5%   | 7n · 71.4% · +52.2%    | 31n · 61.3% · +8.3%    |
| **All** | **416n · 55.5% · +6.3%** | **93n · 55.9% · +3.8%** | **235n · 52.8% · +3.4%** | **744n · 54.7% · +5.0%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1004** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1004 |
| Muted W-L                           |              491-513 |
| Muted Win %                         |                48.9% |
| Counterfactual PnL at flat 1u       |               -60.24 |
| Counterfactual ROI at flat 1u       |                -6.0% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-60.24u** at a flat 1u stake — a counterfactual ROI of **-6.0%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-19 | MLB   | ML     | Arizona Diamondbacks    |  +150 | +0.956 | MINI     |   5/4 |   3/0 |  50.8 |   62.3 |   +9.1 |  2.39 | HOLD     | 2.50u | WIN     |      +3.75 |
| 2026-08-19 | MLB   | ML     | Minnesota Twins         |  +103 | +0.967 | MINI     |   4/0 |   1/0 |  42.3 |   73.6 |   -7.7 |  0.21 | HOLD     | 1.00u | WIN     |      +1.03 |
| 2026-08-19 | MLB   | ML     | Athletics               |  +168 | +0.405 | CONFIRMED-UNOPP |   4/2 |   4/2 |  48.4 |   70.1 |   +3.0 |  2.58 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-19 | MLB   | ML     | St. Louis Cardinals     |  +126 | +0.461 | CONFIRMED-UNOPP |   2/1 |   2/1 |  50.4 |   66.1 |   +3.9 |  1.78 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-19 | MLB   | SPREAD | Los Angeles Dodgers     |  -122 | +0.966 | HC-1     |   2/1 |   1/0 |  49.6 |   58.2 |   +9.7 |  1.51 | HOLD     | 3.00u | WIN     |      +2.46 |
| 2026-08-19 | MLB   | SPREAD | San Francisco Giants    |  -143 | +0.606 | SHARP~   |   1/0 |   1/0 |  51.7 |   67.5 |   +1.7 |  1.17 | HOLD     | 1.00u | WIN     |      +0.70 |
| 2026-08-19 | MLB   | TOTAL  | Over 7.5                |  -117 | +0.451 | CONFIRMED-UNOPP |   2/1 |   2/1 |  51.4 |   52.9 |   +1.3 | -0.85 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-19 | MLB   | TOTAL  | Over 8.5                |  +103 | +0.753 | CONFIRMED-UNOPP |   4/3 |   2/0 |  48.7 |   67.1 |   -0.2 |  0.40 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-19 | MLB   | TOTAL  | Over 7.5                |  +105 | +0.920 | CONFIRMED-UNOPP |   4/0 |   4/0 |  47.7 |   63.8 |   -1.2 | -0.31 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-19 | MLB   | TOTAL  | Over 7.5                |  +117 | +0.946 | MINI     |   6/2 |   3/0 |  44.2 |   63.3 |   -2.6 |  0.04 | HOLD     | 1.00u | WIN     |      +1.17 |
| 2026-08-19 | MLB   | TOTAL  | Over 7.5                |  -108 | +0.860 | CONFIRMED-UNOPP |   1/0 |   1/0 |     — |      — |      — |     — | PASS     | 1.00u | LOSS    |      -1.00 |
| 2026-08-19 | WNBA  | TOTAL  | Over 163.5              |  -103 | +0.234 | 2-for-0  |   2/2 |   2/2 |  54.8 |   67.5 |   +4.8 |  2.09 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-19 | WNBA  | TOTAL  | Over 169.5              |  +109 | +0.990 | HC-1     |   4/3 |   1/0 |  45.9 |   77.9 |   +0.2 |  2.68 | HOLD     | 1.00u | WIN     |      +1.09 |
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

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.531 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.074 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.025 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.007 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.030 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  739 |    +0.0679 |    -0.0401 | 0.0003 |  +0.016 |   0.953 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  739 |    +0.0654 |    +0.4909 | 0.0009 |  +0.030 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  739 |    -0.4026 |    +0.4778 | 0.0010 |  -0.032 |   2.851 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 739 |          +0.078 |           -0.021 |                   +0.057 |                   -0.003 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 739 |          -0.009 |           +0.304 |                   +0.007 |                   +0.113 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 739 |          +0.003 |           +0.141 |                   -0.015 |                   +0.024 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 739 |          -0.021 |           +0.165 |                   +0.005 |                   +0.093 | count of contributing AGAINST-side wallets                     |
| provenFor         | 739 |          +0.008 |           +0.127 |                   -0.001 |                   +0.054 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 739 |          +0.003 |           +0.099 |                   +0.017 |                   +0.055 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.820         | 247 | 135-112 |   54.7% |     +1.4% |
| MID (p33–p67)     | 19.950 … 14.100        | 246 | 125-121 |   50.8% |     -1.9% |
| HIGH (> p67)      | 48.906 … 50.312        | 246 | 144-102 |   58.5% |     +2.3% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       739 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8542 | average score across live picks                                 |
| SD                |    0.2279 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -2.090 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +3.324 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.462 / +0.960 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  634 | 336-298 |   53.0% |     +2.5% |  0.511 |        -0.080 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   34 | 23-11  |   67.6% |    +22.6% |  0.522 |        -0.183 | noise                                     |
| UFC   |   24 | 18-6   |   75.0% |    +16.0% |  0.648 |        +0.175 | strong                                    |
| WNBA  |   31 | 19-12  |   61.3% |     +8.3% |  0.575 |        -0.018 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.449, 0.451, 0.406, 0.461, 0.496, 0.575, 0.628, 0.604, 0.619, 0.582, 0.546, 0.564, 0.545, 0.577]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19"]
    y-axis "edge (pp)" -17 --> 5
    line [3.1, -1.3, -6.3, -5.7, -11.7, -11.9, -15.7, -7, -1.3, -3, -1.3, -0.2, 1.1, 1.6]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
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
| 2026-08-19 |    7 |  114 | 61-53  |   53.5% |    +14.1% |  0.577 |      +1.6pp |

> 🟢 **AUC is trending UP** — V12 is sharpening (0.506 avg in first half → 0.542 avg in second half · Δ = +0.035)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +5.0% | [-2.5%, +12.3%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.7% | [51.1%, 58.3%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.531 | [0.489, 0.571]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             70 | [17, 123]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       744 |
| Unique wallets ever on a FOR side            |                                                       193 |
| Avg FOR-side wallets per pick                |                                                      2.68 |
| Top-5 wallets' share of all FOR appearances  |                                                     24.5% |
| Top-10 wallets' share of all FOR appearances |                                                     43.4% |
| Top-20 wallets' share of all FOR appearances |                                                     60.8% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  120 |   13 | 64-56  |   53.3% |     +9.6% |    +33.53 |     1.54× | CONFIRMED   |     -1.9% |     271 | 2026-08-19 |
|    2 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    3 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    4 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     334 | 2026-08-05 |
|    5 | 4b912c  | MLB,SOC,WNBA |   81 |   26 | 48-33  |   59.3% |    +12.3% |    +24.36 |     1.26× | CONFIRMED   |     -1.7% |     217 | 2026-08-19 |
|    6 | cd2f63  | MLB,NBA,SOC,WNBA |   80 |   42 | 43-37  |   53.8% |    +14.7% |    +35.02 |     1.19× | CONFIRMED   |     +8.4% |     491 | 2026-08-19 |
|    7 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|    8 | 0f9d74  | MLB,NBA,SOC,UFC |   76 |   50 | 42-34  |   55.3% |    +12.6% |    +25.30 |     0.45× | CONFIRMED   |    +16.4% |     315 | 2026-08-19 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   73 |   32 | 39-34  |   53.4% |     -5.9% |    -11.92 |     2.07× | CONFIRMED   |     -7.3% |     270 | 2026-08-19 |
|   10 | eeabaf  | MLB,NBA,SOC |   72 |   33 | 36-36  |   50.0% |     +1.3% |     +2.63 |     1.24× | CONFIRMED   |     +5.6% |     294 | 2026-08-19 |
|   11 | 7923c4  | MLB,NBA,UFC |   52 |   16 | 31-21  |   59.6% |    +25.2% |    +32.09 |     0.73× | CONFIRMED   |     +9.8% |     219 | 2026-08-18 |
|   12 | 7da3d5  | MLB,SOC,UFC,WNBA |   42 |   57 | 19-23  |   45.2% |    -13.0% |    -15.47 |     4.63× | CONFIRMED   |     -8.2% |     250 | 2026-08-17 |
|   13 | 705ba1  | MLB        |   40 |   17 | 18-22  |   45.0% |     -7.8% |     -9.31 |     1.11× | FLAT        |     +6.9% |     177 | 2026-08-19 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   36 |   19 | 16-20  |   44.4% |     -6.8% |     -7.01 |     1.20× | CONFIRMED   |     -6.4% |     162 | 2026-08-19 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 |   22 | 19-15  |   55.9% |     +0.8% |     +0.85 |     1.36× | CONFIRMED   |    +13.8% |     143 | 2026-07-30 |
|   16 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   17 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   18 | 621848  | MLB,UFC,WNBA |   28 |   10 | 14-14  |   50.0% |    -10.6% |     -9.03 |     0.36× | FLAT        |     -0.1% |      73 | 2026-08-18 |
|   19 | 9a69c2  | MLB,SOC    |   26 |   45 | 14-12  |   53.8% |    +14.8% |     +9.18 |     2.30× | FLAT        |    -17.8% |     184 | 2026-07-10 |
|   20 | f2f960  | MLB        |   26 |   16 | 12-14  |   46.2% |    -15.0% |    -13.64 |     2.90× | —           |     -6.2% |      91 | 2026-08-04 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    2 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    3 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|    4 | 9a4d38  | MLB,UFC,WNBA |   17 | 11-6   |   64.7% |     +34.5% |    +14.61 |     0.15× | 2026-08-19 |
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
|   15 | cd2f63  | MLB,NBA,SOC,WNBA |   80 | 43-37  |   53.8% |     +14.7% |    +35.02 |     1.19× | 2026-08-19 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-06-28 |
|    2 | 8ec926  | MLB,UFC,WNBA |   14 | 5-9    |   35.7% |     -36.6% |    -15.75 |     5.48× | 2026-08-15 |
|    3 | c9bba3  | MLB,SOC    |   14 | 7-7    |   50.0% |     -28.6% |     -9.38 |     0.81× | 2026-08-18 |
|    4 | 3bdd7e  | MLB,WNBA   |   11 | 6-5    |   54.5% |     -15.1% |     -4.13 |     2.38× | 2026-08-19 |
|    5 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    6 | 7da3d5  | MLB,SOC,UFC,WNBA |   42 | 19-23  |   45.2% |     -13.0% |    -15.47 |     4.63× | 2026-08-17 |
|    7 | ac9705  | MLB,WNBA   |   20 | 9-11   |   45.0% |     -11.0% |     -8.27 |     2.26× | 2026-08-19 |
|    8 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    9 | 621848  | MLB,UFC,WNBA |   28 | 14-14  |   50.0% |     -10.6% |     -9.03 |     0.36× | 2026-08-18 |
|   10 | 705ba1  | MLB        |   40 | 18-22  |   45.0% |      -7.8% |     -9.31 |     1.11× | 2026-08-19 |
|   11 | bc35e3  | MLB,SOC,UFC,WNBA |   36 | 16-20  |   44.4% |      -6.8% |     -7.01 |     1.20× | 2026-08-19 |
|   12 | 2f2a9e  | MLB,SOC,WNBA |   73 | 39-34  |   53.4% |      -5.9% |    -11.92 |     2.07× | 2026-08-19 |
|   13 | ad88a3  | MLB,SOC    |   20 | 10-10  |   50.0% |      -5.7% |     -4.05 |     0.28× | 2026-08-13 |
|   14 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   34 | 19-15  |   55.9% |      +0.8% |     +0.85 |     1.36× | 2026-07-30 |
|   15 | 4c64aa  | MLB        |   92 | 50-42  |   54.3% |      +1.1% |     +1.94 |     0.84× | 2026-08-05 |

> 🔴 **7 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `f2f960` (FOR# 26, ROI -15.0%), `7da3d5` (FOR# 42, ROI -13.0%), `1e8f33` (FOR# 94, ROI -10.7%), `621848` (FOR# 28, ROI -10.6%), `705ba1` (FOR# 40, ROI -7.8%), `bc35e3` (FOR# 36, ROI -6.8%), `2f2a9e` (FOR# 73, ROI -5.9%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1485 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   338 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     9 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |    59 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   334 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            241 |        56 |   26 |   13 |  146 |                     95 |
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
| v12     | 06-01 → present      |   81 |    744 | 1004 | 407-337 |  54.7% |      5.0% |    +101.79 |    +0.14 | 0.507 |        0.2497 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  684 |    +1.4pp |    +13.9pp |          +0.310 |   -0.042 |    +0.0903 | 🟡 mixed |
| v12 − v10          | +  682 |    +6.3pp |    +23.7pp |          +0.450 |   +0.113 |    +0.0307 | 🟢 better |
| v12 − v11          | +  633 |    -0.3pp |     +2.2pp |          +0.076 |   +0.063 |    +0.0145 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 638n 53.0% +3% | 10n 30.0% +29% | 6n 83.3% +38%  | 35n 68.6% +23% | 24n 75.0% +16% | 31n 61.3% +8%  | 744n 54.7% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 140n +3%      | 213n +1%      | 172n +12%     | 104n -6%      | 110n +18%     | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2030 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 978 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 739 / 978 (76%)   | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 739 / 978 (76%)   | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 739 / 978 (76%)   | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 739 / 978 (76%)   | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 739 / 978 (76%)   | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 739 / 978 (76%)   | Count of proven AGAINST-side wallets                                 |
| countMargin          | 739 / 978 (76%)   | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 978 / 978 (100%)  | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 978 / 978 (100%)  | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 978 / 978 (100%)  | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 978 / 978 (100%)  | Total HC_BASE wallets touching the game                              |
| provenMargin         | 978 / 978 (100%)  | provenFor − provenAg                                                 |
| hcMargin             | 978 / 978 (100%)  | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 971 / 978 (99%)   | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 969 / 978 (99%)   | Closing line value — how far line moved in our favour                |
| peakStars            | 978 / 978 (100%)  | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 977 / 978 (100%)  | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 595 / 978 (61%)   | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 977 / 978 (100%)  | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 595 / 978 (61%)   | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 594 / 978 (61%)   | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 978 / 978 (100%)  | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 978 / 978 (100%)  | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 978 / 978 (100%)  | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 977 / 978 (100%)  | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 978 / 978 (100%)  | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | qMargin              | 739 |  🟢  |    +0.082 |    -0.034 |      +0.058 |      -0.012 |  0.533 |
|    2 | V12 forMean          | 739 |  🟢  |    +0.078 |    -0.021 |      +0.057 |      -0.003 |  0.533 |
|    3 | wd contribMargin     | 978 |      |    -0.036 |    -0.164 |      -0.057 |      -0.111 |  0.466 |
|    4 | wd agCount           | 595 |      |    +0.022 |    +0.271 |      +0.050 |      +0.127 |  0.517 |
|    5 | wd maxForContrib     | 977 |      |    -0.051 |    -0.104 |      -0.043 |      -0.046 |  0.485 |
|    6 | wd contribFor        | 978 |      |    -0.033 |    -0.100 |      -0.038 |      -0.069 |  0.477 |
|    7 | wd agAvgSize         | 595 |      |    +0.017 |    +0.049 |      +0.038 |      +0.047 |  0.508 |
|    8 | wd sizeMargin        | 594 |      |    -0.012 |    -0.044 |      -0.037 |      -0.067 |  0.498 |
|    9 | clv                  | 969 |      |    -0.022 |    +0.038 |      -0.031 |      +0.010 |  0.509 |
|   10 | provenMargin         | 978 |      |    -0.012 |    +0.044 |      -0.029 |      -0.021 |  0.490 |
|   11 | lockPinnProb         | 971 |      |    +0.180 |    +0.139 |      +0.029 |      -0.137 |  0.597 |
|   12 | provenFor            | 978 |      |    -0.021 |    +0.014 |      -0.027 |      -0.032 |  0.490 |
|   13 | wd forCount          | 977 |      |    -0.018 |    +0.070 |      -0.027 |      -0.021 |  0.484 |
|   14 | hcMargin             | 978 |      |    -0.003 |    +0.198 |      -0.022 |      +0.059 |  0.516 |
|   15 | provenTotal          | 978 |      |    -0.021 |    -0.024 |      -0.020 |      -0.027 |  0.494 |
|   16 | wd contribAg         | 978 |      |    -0.001 |    +0.150 |      +0.019 |      +0.064 |  0.501 |
|   17 | countMargin          | 739 |      |    +0.017 |    +0.059 |      -0.018 |      -0.031 |  0.497 |
|   18 | ags (v11)            | 978 |      |    +0.004 |    +0.015 |      -0.018 |      -0.041 |  0.512 |
|   19 | agsV12               | 739 |  🟢  |    +0.030 |    -0.025 |      +0.016 |      -0.007 |  0.531 |
|   20 | V12 forCount         | 739 |  🟢  |    +0.003 |    +0.141 |      -0.015 |      +0.024 |  0.506 |
|   21 | wd maxShare          | 978 |      |    +0.016 |    -0.047 |      +0.013 |      -0.002 |  0.511 |
|   22 | wd forAvgSize        | 977 |      |    +0.005 |    +0.023 |      -0.011 |      -0.010 |  0.520 |
|   23 | peakStars            | 978 |      |    +0.011 |    +0.057 |      -0.008 |      -0.013 |  0.504 |
|   24 | V12 agMean           | 739 |  🟢  |    -0.009 |    +0.304 |      +0.007 |      +0.113 |  0.496 |
|   25 | V12 agCount          | 739 |  🟢  |    -0.021 |    +0.165 |      +0.005 |      +0.093 |  0.506 |
|   26 | provenAg             | 978 |      |    -0.016 |    +0.133 |      -0.004 |      +0.060 |  0.502 |

> **Top 3 univariate features by PnL correlation:** `qMargin` (r = +0.058), `V12 forMean` (r = +0.057), `wd contribMargin` (r = -0.057).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd contribMargin` — r(unit-ret) = -0.057, AUC = 0.466. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `qMargin` · r(unit-ret) = +0.058 · AUC = 0.533

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 4.202            | 247 | 132-115 |   53.4% |     +0.2% |
| MID (p33–p67)     | 19.950 … 14.100          | 246 | 132-114 |   53.7% |     +0.7% |
| HIGH (> p67)      | 46.556 … 50.312          | 246 | 140-106 |   56.9% |     +0.9% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `V12 forMean` · r(unit-ret) = +0.057 · AUC = 0.533

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 10.820           | 247 | 135-112 |   54.7% |     +1.4% |
| MID (p33–p67)     | 19.950 … 14.100          | 246 | 125-121 |   50.8% |     -1.9% |
| HIGH (> p67)      | 48.906 … 50.312          | 246 | 144-102 |   58.5% |     +2.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribMargin` · r(unit-ret) = -0.057 · AUC = 0.466

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -43.624        | 327 | 187-140 |   57.2% |     +2.7% |
| MID (p33–p67)     | 57.800 … 27.500          | 325 | 180-145 |   55.4% |     +1.1% |
| HIGH (> p67)      | 174.100 … 154.600        | 326 | 164-162 |   50.3% |     -2.6% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd agCount` · r(unit-ret) = +0.050 · AUC = 0.517

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 287 | 153-134 |   53.3% |     -0.4% |
| MID (p33–p67)     | 2.000 … 2.000            | 145 | 75-70   |   51.7% |     -1.8% |
| HIGH (> p67)      | 3.000 … 5.000            | 163 | 93-70   |   57.1% |     +3.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd maxForContrib` · r(unit-ret) = -0.043 · AUC = 0.485

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 27.500          | 326 | 184-142 |   56.4% |     +2.1% |
| MID (p33–p67)     | 52.400 … 58.800          | 325 | 176-149 |   54.2% |     +0.2% |
| HIGH (> p67)      | 100.000 … 61.600         | 326 | 171-155 |   52.5% |     -0.9% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | qMargin        | V12 forMean    | wd contribMargin | wd agCount     | wd maxForContrib | wd contribFor  | wd agAvgSize   | wd sizeMargin  |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| qMargin     |  1.000         |         +0.963 |         +0.074 |         +0.050 |         +0.206 |         +0.100 |         -0.033 |         +0.196 |
| V12 forMean |         +0.963 |  1.000         |         +0.095 |         +0.166 |         +0.269 |         +0.200 |         -0.012 |         +0.216 |
| wd contribMargin |         +0.074 |         +0.095 |  1.000         |         -0.144 |         +0.517 |         +0.772 |         -0.152 |         +0.279 |
| wd agCount  |         +0.050 |         +0.166 |         -0.144 |  1.000         |         +0.309 |         +0.472 |         +0.100 |         +0.036 |
| wd maxForContrib |         +0.206 |         +0.269 |         +0.517 |         +0.309 |  1.000         |         +0.661 |         +0.028 |         +0.297 |
| wd contribFor |         +0.100 |         +0.200 |         +0.772 |         +0.472 |         +0.661 |  1.000         |         -0.009 |         +0.237 |
| wd agAvgSize |         -0.033 |         -0.012 |         -0.152 |         +0.100 |         +0.028 |         -0.009 |  1.000         |         -0.746 |
| wd sizeMargin |         +0.196 |         +0.216 |         +0.279 |         +0.036 |         +0.297 |         +0.237 |         -0.746 |  1.000         |

> 🔴 **Strong collinearity detected:** `qMargin` and `V12 forMean` have r = +0.963. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 477 picks · features = 8 (+ intercept) · multiple R² = **0.0193** · adjusted R² = **0.0004** · residual sd = 0.953

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribFor        |     |    -0.2877 |   0.1986 | -1.45        |        1 |
|    2 | wd agCount           |     |    +0.2063 |   0.1213 | +1.70 (~sig) |        2 |
|    3 | wd contribMargin     |     |    +0.1867 |   0.1743 | +1.07        |        3 |
|    4 | wd agAvgSize         |     |    +0.0750 |   0.0747 | +1.00        |        4 |
|    5 | qMargin              |  🟢 |    +0.0444 |   0.1864 | +0.24        |        5 |
|    6 | V12 forMean          |  🟢 |    +0.0257 |   0.1912 | +0.13        |        6 |
|    7 | wd sizeMargin        |     |    +0.0148 |   0.0770 | +0.19        |        7 |
|    8 | wd maxForContrib     |     |    +0.0034 |   0.0628 | +0.05        |        8 |
| —    | (intercept)          |     |    +0.0246 |   0.0436 |    +0.56 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.044), `V12 forMean` (β = +0.026)
- V12 IGNORES: `wd contribFor` (β = -0.288, t = -1.45), `wd agCount` (β = +0.206, t = +1.70), `wd contribMargin` (β = +0.187, t = +1.07), `wd agAvgSize` (β = +0.075, t = +1.00), `wd sizeMargin` (β = +0.015, t = +0.19), `wd maxForContrib` (β = +0.003, t = +0.05)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.533 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.564 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.031.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Consider adding one or more of these features to V12: `wd agCount` (β = +0.206, t = +1.70). They have a real multivariate effect after controlling for V12's existing inputs.
- Adjusted R² of 0.0004 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*