# AGS-Unified — V12 Daily Monitor

**Generated:** Monday, August 31, 2026 at 3:12 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (92 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (92 days ago), V12 has evaluated **2848** picks, shipped **921** for real money (32.3% ship rate), and muted the other **1927**. On the shipped picks V12 has gone **504-417** (54.7% win), staked **2506.00u**, and returned **+113.61u** at **+4.5% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                             92 |
| Picks V12 has evaluated             |                           2848 |
| Picks SHIPPED (units > 0)           |                            921 |
| Picks MUTED (score ≤ 0, FADE)       |                           1927 |
| Ship rate                           |                          32.3% |
| Live W-L                            |                        504-417 |
| Live Win %                          |                          54.7% |
| Live PnL (units)                    |                        +113.61 |
| Live ROI                            |                          +4.5% |
| Avg PnL / day                       |                         +1.23u |
| Most recent action (2026-09-04)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.5% ROI** across 921 live picks (+113.61u real PnL).
- Mute rule is **saving money** — the 1293 muted picks would have lost -83.59u at flat 1u (-6.5% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.23u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **268-224** · +5.0% ROI · +67.00u on 492 graded — see § 5.

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

**Full book:** 92d · 921 live · 504-417 · **+113.61u** · +4.5% ROI · +1.23u/day.

_Prior to table (2026-06-01 → 2026-08-11): 624 live · 344-280 · +73.04u · cum through prior = +73.04u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-08-30 |        49 |   19 |    26 | 11-8       |  57.9% |     52.90 |      +7.94 |     15.0% |    +113.61 |
| 2026-08-31 |        31 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +113.61 |
| 2026-09-04 |         1 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +113.61 |

> **Trajectory.** 🟢 Last 3 days (15.0% ROI) **+10.7pp** vs prior (4.3%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-08-30**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 18 | 14-4 | +46.2% | +35.36u | +1.96u | +61.2% |
| 🟢 2 | RANK 2-for-0 rescue | B | 97 | 56-41 | +12.7% | +45.61u | +0.47u | +27.8% |
| 🟢 3 | MINI- (gate-cut) | C | 20 | 12-8 | +11.8% | +3.12u | +0.16u | +85.0% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 117 | 75-42 | +12.5% | +68.56u | sized UP after path |
| 2 | Tape HOLD (mid) | 327 | 172-155 | +2.1% | +14.72u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 26 | 11-15 | -15.1% | -3.93u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 99 | 49-50 | -4.6% | -4.57u | 🟢 saving $ |
| 3 | Score FADE (≤0 → 0u) | 718 | 366-352 | +1.8% | +12.65u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 18 | 14-4 | 77.8% | 76.5u | +35.36u | +46.2% | +1.96u | 3 | +61.2% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 106 | 63-43 | 59.4% | 389.7u | +18.38u | +4.7% | +0.17u | 7 | +13.7% | — | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 97 | 56-41 | 57.7% | 359.0u | +45.61u | +12.7% | +0.47u | 12 | +27.8% | +3.05u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 78 | 38-40 | 48.7% | 267.4u | -14.11u | -5.3% | -0.18u | 10 | -1.9% | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 108 | 56-52 | 51.9% | 300.3u | +0.66u | +0.2% | +0.01u | 17 | -19.0% | — | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 94 | 54-40 | 57.4% | 241.1u | +12.83u | +5.3% | +0.14u | 17 | -20.9% | +5.83u | 🔻 cooling |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 1 | +85.0% | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 23 | 12-11 | 52.2% | 23.4u | +0.89u | +3.8% | +0.04u | 1 | -100.0% | — | 🟡 flat |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 117 | 75-42 | 64.1% | 547.7u | +68.56u | +12.5% | 26 | +5.0% | +8.88u |
| Tape HOLD (mid) | TAPE | staked | 327 | 172-155 | 52.6% | 699.1u | +14.72u | +2.1% | 88 | +5.6% | -1.63u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 0 | — | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 99 | 49-50 | 49.5% | 99.0u | -4.57u | -4.6% | 39 | -5.6% | -3.31u |
| fadeTop≥60 MUTE | E | CF 1u | 26 | 11-15 | 42.3% | 26.0u | -3.93u | -15.1% | 20 | -18.9% | +1.34u |
| Score FADE (≤0 → 0u) | score | CF 1u | 718 | 366-352 | 51.0% | 718.0u | +12.65u | +1.8% | 98 | +28.4% | +0.20u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 5 / +50% | — | — |
| TOP | 38 / -2% | 24 / +4% | 4 / -16% |
| RANK | 48 / +8% | 10 / +27% | — |
| SHARP | 15 / -9% | 37 / +0% | 1 / -100% |
| SHARP-LEAN | 79 / -0% | 26 / +2% | 3 / -30% |
| MINI | 43 / -2% | 10 / +45% | 4 / +1% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 14 / +10% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-08-30)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| MINI (gate-pass) | 1 | 1-0 | +5.83u | +108.0% |
| RANK 2-for-0 rescue | 1 | 1-0 | +3.05u | +50.8% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  21 | 14-4   |  77.8% |       76.50 |     +35.36 |     46.2% |
| TOP PICK (TOP+/TOP)       |  4-5u | 192 | 78-57  |  57.8% |      522.20 |      +6.44 |      1.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 544 | 156-141 |  52.5% |      975.65 |     +25.55 |      2.6% |
| STRONG (MINI)             |    3u | 119 | 54-40  |  57.4% |      241.05 |     +12.83 |      5.3% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u |  95 | 26-22  |  54.2% |       54.85 |      +1.99 |      3.6% |
| **STAKED TOTAL** |     — | 592 | 328-264 |  55.4% |     1870.25 |     +82.17 |     +4.4% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  21 | 14-4   |  77.8% |       76.50 |     +35.36 |     46.2% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 163 | 63-43  |  59.4% |      389.70 |     +18.38 |      4.7% |
| B · 2-for-0 rescue    | RANK        |    4u | 142 | 56-41  |  57.7% |      358.95 |     +45.61 |     12.7% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 282 | 56-52  |  51.9% |      300.34 |      +0.66 |      0.2% |
| C · proven-$ consensus | SHARP       |    3u | 106 | 38-40  |  48.7% |      267.36 |     -14.11 |     -5.3% |
| A · mini-HC (gate-pass) | MINI        |    3u | 119 | 54-40  |  57.4% |      241.05 |     +12.83 |      5.3% |
| C · mini gate-cut     | MINI-       |    1u |  30 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |   6 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  59 | 12-11  |  52.2% |       23.35 |      +0.89 |      3.8% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 585 picks tracked at 0u (would-be 285-300, 48.7% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (15-6, +35.36u)  ·  🟢 TOP PICK (102-90, +6.44u)  ·  🟠 SHARP PLAY (266-278, +25.55u)  ·  🔴 STRONG (69-50, +12.83u)  ·  🟣 LEAN (51-44, +1.99u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30"]
    y-axis "PnL (u)" -14 --> 44
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 1536 | 1526 | 1484 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 99 | 49-50 | 49.5% | 18.00u | -2.39u | -13.3% |
| HOLD      | 461 | 222-239 | 48.2% | 702.07u | +11.72u | +1.7% |
| BOOST     | 158 | 95-63 | 60.1% | 551.18u | +70.64u | +12.8% |
| FAIL_OPEN | 43 | 22-21 | 51.2% | 54.50u | -15.17u | -27.8% |
| PASS      | 723 | 375-348 | 51.9% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 495 | 263-232 | 53.1% | +2.87u |
| hold (0–2.89) | path u | 629 | 301-328 | 47.9% | +10.84u |
| boost (≥2.89) | ×1.35 | 190 | 108-82 | 56.8% | +64.99u |

_Score coverage: **1314/1484** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 99 | -1.11u | +1.11u | +68.25u | +67.14u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 119 | +52.32u | +70.64u | +18.32u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-08-31 | MLB | Baltimore Orioles | CONFIRMED-UNOPP | -4.21 | MUTE | 4.00u | 0.00u | — |
| 2026-08-31 | MLB | Houston Astros | CONFIRMED-UNOPP | -4.21 | MUTE | 4.00u | 0.00u | — |
| 2026-08-31 | MLB | Minnesota Twins | CONFIRMED-UNOPP | -1.93 | MUTE | 4.00u | 0.00u | — |
| 2026-08-31 | MLB | Tampa Bay Rays | CONFIRMED-UNOPP | -2.13 | MUTE | 3.00u | 0.00u | — |
| 2026-08-31 | MLB | Boston Red Sox | HC-1 | -0.43 | MUTE | 3.00u | 0.00u | — |
| 2026-08-31 | MLB | Atlanta Braves | SHARP~ | -1.40 | MUTE | 2.00u | 0.00u | — |
| 2026-08-31 | SOC | Arsenal FC | CONFIRMED-Q1 | -2.00 | MUTE | 1.00u | 3.00u | — |
| 2026-08-31 | MLB | Los Angeles Angels | SHARP~ | -0.02 | MUTE | 1.00u | 0.00u | — |
| 2026-08-31 | MLB | Under 8.5 | CONFIRMED-UNOPP | -1.36 | MUTE | 2.00u | 0.00u | — |
| 2026-08-31 | MLB | Over 9.5 | SHARP~ | 5.87 | BOOST | 1.00u | 0.00u | — |
| 2026-08-31 | MLB | Over 7.5 | CONFIRMED-UNOPP | -4.12 | MUTE | 1.00u | 0.00u | — |
| 2026-08-30 | MLB | Atlanta Braves | SHARP | 5.76 | BOOST | 4.00u | 0.00u | WIN |
| 2026-08-30 | MLB | Cleveland Guardians | CONFIRMED-Q1 | -1.26 | MUTE | 3.00u | 3.00u | WIN |
| 2026-08-30 | MLB | Milwaukee Brewers | CONFIRMED-Q1 | -0.75 | MUTE | 4.00u | 0.00u | LOSS |
| 2026-08-30 | WNBA | Golden State Valkyries | 2-for-0 | 6.04 | BOOST | 5.00u | 6.00u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-1.41** · nPriors=570 · source=expanding_q1 · asOf=2026-08-31 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 1090 | 1005 | 969 | 212 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 79 | 33-46 | 41.8% | 11.00u | -3.29u | -29.9% |
| HOLD      | 235 | 121-114 | 51.5% | 271.60u | +17.86u | +6.6% |
| FAIL_OPEN | 26 | 12-14 | 46.2% | 42.90u | -3.08u | -7.2% |
| EXEMPT    | 382 | 195-187 | 51.0% | 482.10u | +26.91u | +5.6% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -50.9 … -1.4 | 39 | 10-29 | 25.6% | 0.0u | +0.00u | — |
| Q2 | -1.3 … 1.6 | 39 | 17-22 | 43.6% | 41.9u | +16.81u | +40.1% |
| Q3 | 1.7 … 6.0 | 39 | 16-23 | 41.0% | 45.1u | -12.10u | -26.8% |
| Q4 | 6.2 … 14.9 | 39 | 19-20 | 48.7% | 66.6u | -5.96u | -8.9% |
| Q5 | 16.4 … 1802.6 | 40 | 24-16 | 60.0% | 79.5u | +15.11u | +19.0% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 79 | 33-46 | -13.75u | +13.75u | +51.00u | +37.25u |

> 🟢 **Mute is saving money** (Δ +13.75u · muted WR 41.8%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 5 | 4-1 | 80.0% | 7.0u | +4.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 30 | 8-22 | 26.7% | 32.5u | -15.27u |
| MLB | 51 | 21-30 | 41.2% | 58.0u | -9.81u |
| NFL | 4 | 2-2 | 50.0% | 4.0u | +0.10u |
| SOC | 2 | 1-1 | 50.0% | 2.0u | +1.13u |
| WNBA | 22 | 9-13 | 40.9% | 24.0u | -5.17u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-08-31 | MLB | Seattle Mariners | — | -2.3 | -1.4 | 1.00u | pending |
| 2026-08-30 | MLB | Detroit Tigers | — | -55.8 | -1.4 | 1.50u | LOSS |
| 2026-08-30 | MLB | Miami Marlins | SHARP~ | -29.9 | -1.4 | 1.00u | WIN |
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

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 77 | 41-36 | 53.2% | 233.1u | +13.86u | +5.9% |
| Muted (Q1 → 0u) | 79 | 33-46 | 41.8% | 11.0u | -3.29u | -29.9% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 145–80 · 64.4% · +15.4%); **5–10 is the hole** (68–69 · 49.6% · -6.8%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 703 tickets · cov 676/703 (stamp 474 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 314 | 161–153 | 51.3% | -2.9% |
| 5–10 | 137 | 68–69 | 49.6% | -6.8% |
| ≥10 | 225 | 145–80 | 64.4% | +15.4% |
| All | 703 | 386–317 | 54.9% | +4.6% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.9% (110) | 55.4% (65) | 71.6% (88) |
| B | 54.5% (66) | 55.6% (9) | 68.2% (22) |
| C | 38.5% (39) | 45.1% (51) | 57.3% (103) |

##### Jul 15+ · 492 tickets · cov 471/492 (stamp 469 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 208 | 108–100 | 51.9% | +1.8% |
| 5–10 | 98 | 45–53 | 45.9% | -13.7% |
| ≥10 | 165 | 106–59 | 64.2% | +12.9% |
| All | 492 | 268–224 | 54.5% | +5.0% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 49% (51) | 52.8% (36) | 74.5% (47) |
| B | 55% (40) | 25% (4) | 66.7% (15) |
| C | 38.9% (18) | 45.7% (46) | 58.1% (93) |

##### Yesterday (Aug 30) · 19 tickets · cov 19/19 (stamp 19 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 11 | 6–5 | 54.5% | +15.0% |
| 5–10 | 2 | 1–1 | 50.0% | -21.8% |
| ≥10 | 6 | 4–2 | 66.7% | +23.1% |
| All | 19 | 11–8 | 57.9% | +15.0% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | — | 100% (1) |
| B | — | — | 100% (1) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 703 tickets · cov 697/703 (stamp 486 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 456 | 251–205 | 55.0% | +3.5% |
| 5–10 | 123 | 66–57 | 53.7% | +9.3% |
| ≥10 | 118 | 67–51 | 56.8% | +4.9% |
| All | 703 | 386–317 | 54.9% | +4.6% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.8% (166) | 50% (52) | 71.7% (53) |
| B | 60% (70) | 50% (14) | 53.8% (13) |
| C | 49.6% (117) | 61% (41) | 40.5% (42) |

##### Jul 15+ · 492 tickets · cov 487/492 (stamp 486 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 306 | 173–133 | 56.5% | +8.3% |
| 5–10 | 100 | 53–47 | 53.0% | +9.7% |
| ≥10 | 81 | 40–41 | 49.4% | -8.8% |
| All | 492 | 268–224 | 54.5% | +5.0% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 63.9% (72) | 47.2% (36) | 62.5% (32) |
| B | 57.1% (42) | 50% (10) | 57.1% (7) |
| C | 53.3% (90) | 60.5% (38) | 36.4% (33) |

##### Yesterday (Aug 30) · 19 tickets · cov 19/19 (stamp 19 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 19 | 11–8 | 57.9% | +15.0% |
| All | 19 | 11–8 | 57.9% | +15.0% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 100% (1) | — | — |
| B | 100% (1) | — | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 703 tickets · cov 676/703 (stamp 468 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 138 | 66–72 | 47.8% | -17.3% |
| 0–2.89 | 372 | 198–174 | 53.2% | +5.7% |
| ≥2.89 | 166 | 110–56 | 66.3% | +16.2% |
| All | 703 | 386–317 | 54.9% | +4.6% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 57.6% (151) | 75.4% (69) |
| B | 61.5% (26) | 53.7% (54) | 64.7% (17) |
| C | 18.2% (11) | 50.4% (113) | 55.1% (69) |

##### Jul 15+ · 492 tickets · cov 471/492 (stamp 468 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 69 | 38–31 | 55.1% | +2.4% |
| 0–2.89 | 281 | 144–137 | 51.2% | +1.4% |
| ≥2.89 | 121 | 77–44 | 63.6% | +11.8% |
| All | 492 | 268–224 | 54.5% | +5.0% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 53.2% (94) | 74.4% (39) |
| B | 60% (10) | 53.8% (39) | 60% (10) |
| C | — | 51.1% (94) | 54% (63) |

##### Yesterday (Aug 30) · 19 tickets · cov 19/19 (stamp 19 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 16 | 9–7 | 56.3% | +5.4% |
| 0–2.89 | 1 | 0–1 | 0.0% | -100.0% |
| ≥2.89 | 2 | 2–0 | 100.0% | +77.9% |
| All | 19 | 11–8 | 57.9% | +15.0% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | — | 100% (1) |
| B | — | — | 100% (1) |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 492 | 268-224 | 54.5% | 1329.75u | +67.00u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 492/492 | 2.62 | 2.36 | +0.26 | 2.00 | 2.00 |
| depth   | #A sharps        | 492/492 | 1.33 | 1.36 | -0.03 | 1.00 | 1.00 |
| depth   | #F − #A          | 492/492 | 1.29 | 1.00 | +0.29 | 1.00 | 1.00 |
| depth   | proven F         | 492/492 | 1.74 | 1.70 | +0.05 | 1.00 | 1.00 |
| depth   | proven A         | 492/492 | 0.51 | 0.52 | -0.01 | 0.00 | 0.00 |
| depth   | proven F−A       | 492/492 | 1.23 | 1.17 | +0.05 | 1.00 | 1.00 |
| depth   | v12 F count      | 492/492 | 2.60 | 2.42 | +0.18 | 2.00 | 2.00 |
| depth   | v12 A count      | 492/492 | 1.44 | 1.49 | -0.05 | 1.00 | 1.00 |
| depth   | WA ForN          | 492/492 | 1.99 | 1.94 | +0.05 | 1.00 | 2.00 |
| depth   | WA AgN           | 492/492 | 1.09 | 1.21 | -0.12 | 1.00 | 1.00 |
| depth   | CLV ForN         | 491/492 | 2.41 | 2.22 | +0.19 | 2.00 | 2.00 |
| depth   | CLV AgN          | 491/492 | 1.34 | 1.41 | -0.06 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 492/492 | 0.38 | 0.36 | +0.02 | 0.00 | 0.00 |
| quality | ForWR            | 469/492 | 56.76 | 54.68 | +2.08 | 54.16 | 53.46 |
| quality | AgWR             | 299/492 | 44.83 | 45.88 | -1.05 | 45.73 | 47.31 |
| quality | TopFor WR        | 469/492 | 60.63 | 58.80 | +1.83 | 56.51 | 55.70 |
| quality | TopAg WR         | 299/492 | 47.76 | 48.87 | -1.11 | 48.90 | 49.16 |
| quality | EDGE             | 469/492 | 9.91 | 7.18 | +2.73 | 7.61 | 5.23 |
| quality | ForCLV           | 486/492 | 65.12 | 64.94 | +0.18 | 65.37 | 65.71 |
| quality | AgCLV            | 326/492 | 63.00 | 61.61 | +1.39 | 63.51 | 63.29 |
| quality | netCLV           | 486/492 | 2.45 | 3.20 | -0.75 | 3.21 | 2.90 |
| quality | Tape             | 468/492 | 2.35 | 1.91 | +0.43 | 1.72 | 1.43 |
| quality | V12 score        | 492/492 | 0.84 | 0.81 | +0.03 | 0.96 | 0.95 |
| quality | V12 forMean      | 492/492 | 26.92 | 22.41 | +4.51 | 18.14 | 15.54 |
| quality | V12 agMean       | 492/492 | 2.34 | 2.27 | +0.08 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 469/492 | 0.561 | +0.002 | +0.125 | +2.73 | 🟡 mild OK |
|    2 | AgWR             | quality | 299/492 | 0.456 | +0.071 | -0.081 | -1.05 | 🟡 mild OK |
|    3 | AgCLV            | quality | 326/492 | 0.543 | -0.020 | +0.091 | +1.39 | 🟡 mild inv |
|    4 | V12 forMean      | quality | 492/492 | 0.542 | +0.134 | +0.085 | +4.51 | 🟡 mild OK |
|    5 | Tape             | quality | 468/492 | 0.542 | -0.063 | +0.073 | +0.43 | 🟡 mild OK |
|    6 | V12 score        | quality | 492/492 | 0.540 | +0.003 | +0.053 | +0.03 | 🟡 mild OK |
|    7 | TopFor WR        | quality | 469/492 | 0.540 | +0.112 | +0.089 | +1.83 | flat |
|    8 | ForWR            | quality | 469/492 | 0.538 | -0.004 | +0.110 | +2.08 | flat |
|    9 | V12 agMean       | quality | 492/492 | 0.467 | +0.335 | +0.006 | +0.08 | flat |
|   10 | CLV ForN         | depth   | 491/492 | 0.521 | +0.264 | +0.059 | +0.19 | flat |
|   11 | #F sharps        | depth   | 492/492 | 0.521 | +0.279 | +0.071 | +0.26 | flat |
|   12 | TopAg WR         | quality | 299/492 | 0.481 | +0.025 | -0.069 | -1.11 | flat |
|   13 | unopposed (A=0)  | depth   | 492/492 | 0.517 | +0.246 | +0.020 | +0.02 | flat |
|   14 | netCLV           | quality | 486/492 | 0.484 | -0.090 | -0.031 | -0.75 | flat |
|   15 | WA AgN           | depth   | 492/492 | 0.485 | +0.166 | -0.044 | -0.12 | flat |
|   16 | #F − #A          | depth   | 492/492 | 0.513 | +0.210 | +0.068 | +0.29 | flat |
|   17 | WA ForN          | depth   | 492/492 | 0.488 | +0.262 | +0.017 | +0.05 | flat |
|   18 | v12 F count      | depth   | 492/492 | 0.511 | +0.280 | +0.051 | +0.18 | flat |
|   19 | proven A         | depth   | 492/492 | 0.494 | +0.303 | -0.004 | -0.01 | flat |
|   20 | ForCLV           | quality | 486/492 | 0.494 | -0.117 | +0.009 | +0.18 | flat |
|   21 | proven F         | depth   | 492/492 | 0.496 | +0.332 | +0.021 | +0.05 | flat |
|   22 | proven F−A       | depth   | 492/492 | 0.503 | +0.266 | +0.023 | +0.05 | flat |
|   23 | #A sharps        | depth   | 492/492 | 0.503 | +0.154 | -0.009 | -0.03 | flat |
|   24 | v12 A count      | depth   | 492/492 | 0.503 | +0.165 | -0.015 | -0.05 | flat |
|   25 | CLV AgN          | depth   | 491/492 | 0.502 | +0.157 | -0.021 | -0.06 | flat |

### (C) Working read

_N=492 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.561 · Δ +2.73 · higher on WINs (cov 469/492)
- **AgWR** — AUC 0.456 · Δ -1.05 · higher on LOSSes (cov 299/492)
- **V12 forMean** — AUC 0.542 · Δ +4.51 · higher on WINs (cov 492/492)
- **Tape** — AUC 0.542 · Δ +0.43 · higher on WINs (cov 468/492)
- **V12 score** — AUC 0.540 · Δ +0.03 · higher on WINs (cov 492/492)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 988 | 193 | 193 | 187 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 25 | 13-12 | 52.0% | 63.20u | +0.54u | +0.9% | -0.6 |
| on→off | 10 | 4-6 | 40.0% | 32.20u | -6.86u | -21.3% | -2.7 |
| off→on | 25 | 18-7 | 72.0% | 61.30u | +28.01u | +45.7% | +2.8 |
| off→off | 127 | 66-61 | 52.0% | 319.30u | -12.45u | -3.9% | -0.6 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 120 | 60-60 | 50.0% | 347.90u | -11.11u | -3.2% |
| 0–2 | 44 | 26-18 | 59.1% | 94.60u | +18.39u | +19.4% |
| 2–4 | 9 | 7-2 | 77.8% | 17.00u | +3.76u | +22.1% |
| 4+ | 14 | 8-6 | 57.1% | 16.50u | -1.80u | -10.9% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 2 | 2-0 | 100.0% | 4.00u | +2.41u | +60.3% |
| gold, limits flat | 6 | 4-2 | 66.7% | 17.30u | +12.32u | +71.2% |
| steam, not gold | 42 | 25-17 | 59.5% | 103.20u | +13.82u | +13.4% |
| limits↑, no steam | 5 | 2-3 | 40.0% | 12.40u | +0.37u | +3.0% |
| neither | 132 | 68-64 | 51.5% | 339.10u | -19.68u | -5.8% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 45 | 29-16 | 64.4% | 116.50u | +29.60u | +25.4% |
| A/B + no steam | 124 | 66-58 | 53.2% | 307.70u | +1.65u | +0.5% |
| A/B + steam arriving | 24 | 18-6 | 75.0% | 60.30u | +29.01u | +48.1% |
| A/B + gold | 7 | 5-2 | 71.4% | 18.30u | +13.30u | +72.7% |
| steam at lock, no A/B | 5 | 2-3 | 40.0% | 8.00u | -1.05u | -13.1% |
| Source B + steam arriving | 24 | 18-6 | 75.0% | 60.30u | +29.01u | +48.1% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| MLB   | 383n · 53.3% · +4.3%   | 93n · 54.8% · -0.6%    | 272n · 50.7% · +1.7%   | 748n · 52.5% · +2.7%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 10n · 60.0% · +7.9%    | 3n · 66.7% · -28.0%    | 2n · 50.0% · -5.4%     | 15n · 60.0% · -0.8%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 48n · 70.8% · +24.0%   | —                      | —                      | 48n · 70.8% · +24.0%   |
| UFC   | 33n · 75.8% · +15.3%   | —                      | —                      | 33n · 75.8% · +15.3%   |
| WNBA  | 27n · 74.1% · +3.2%    | 19n · 42.1% · +1.0%    | 15n · 46.7% · -10.3%   | 61n · 57.4% · -0.5%    |
| **All** | **508n · 57.3% · +7.4%** | **119n · 53.8% · +1.0%** | **294n · 50.7% · +1.3%** | **921n · 54.7% · +4.5%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1293** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1293 |
| Muted W-L                           |              627-666 |
| Muted Win %                         |                48.5% |
| Counterfactual PnL at flat 1u       |               -83.59 |
| Counterfactual ROI at flat 1u       |                -6.5% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-83.59u** at a flat 1u stake — a counterfactual ROI of **-6.5%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-08-30 | MLB   | ML     | Baltimore Orioles       |  -144 | +0.961 | CONFIRMED-Q1 |   1/0 |   1/0 |  68.6 |   20.0 |  +18.6 | -2.58 | HOLD     | 4.00u | WIN     |      +2.78 |
| 2026-08-30 | MLB   | ML     | Chicago Cubs            |  -150 | +0.517 | CONFIRMED-Q1 |   3/4 |   3/4 |  56.1 |   58.9 |   +6.6 |  1.50 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-08-30 | MLB   | ML     | New York Mets           |  -117 | +0.952 | CONFIRMED-Q1 |   2/1 |   2/0 |  62.6 |   42.0 |  +14.3 | -0.62 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-08-30 | MLB   | ML     | Cleveland Guardians     |  -178 | +0.933 | CONFIRMED-Q1 |   2/0 |   2/0 |  59.2 |   41.3 |   +9.2 | -1.26 | MUTE     | 3.00u | WIN     |      +1.69 |
| 2026-08-30 | MLB   | ML     | Los Angeles Dodgers     |  -163 | +0.497 | CONFIRMED-Q1 |   3/2 |   2/1 |  56.2 |   51.3 |   -7.7 | -4.77 | HOLD     | 3.00u | WIN     |      +1.84 |
| 2026-08-30 | MLB   | ML     | Philadelphia Phillies   |  -158 | +0.615 | CONFIRMED-Q1 |   5/1 |   2/1 |  53.4 |   51.8 |   +0.3 | -0.89 | HOLD     | 3.00u | WIN     |      +1.90 |
| 2026-08-30 | MLB   | ML     | Tampa Bay Rays          |  -150 | +0.950 | CONFIRMED-Q1 |   1/0 |   1/0 |  68.6 |   20.0 |  +18.6 | -2.58 | HOLD     | 4.00u | WIN     |      +2.67 |
| 2026-08-30 | SOC   | ML     | RC Celta de Vigo        |  +167 | +0.980 | CONFIRMED-Q1 |   3/1 |   1/0 |  44.4 |   52.6 |   -5.6 | -2.52 | HOLD     | 1.50u | LOSS    |      -1.50 |
| 2026-08-30 | SOC   | ML     | Manchester United FC    |  -275 | +0.591 | CONFIRMED-Q1 |   7/3 |   3/1 |  49.5 |   47.7 |   -0.5 | -4.94 | HOLD     | 3.00u | WIN     |      +1.09 |
| 2026-08-30 | WNBA  | ML     | Golden State Valkyries  |  -197 | +0.971 | 2-for-0  |   2/1 |   1/0 |  67.9 |   58.3 |  +32.8 |  6.04 | BOOST    | 6.00u | WIN     |      +3.05 |
| 2026-08-30 | MLB   | SPREAD | Chicago Cubs            |  +142 | +0.963 | CONFIRMED-UNOPP |   4/2 |   1/0 |  48.2 |   65.1 |   -1.3 | -0.02 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-30 | MLB   | TOTAL  | Over 10.5               |  +115 | +0.967 | CONFIRMED-UNOPP |   3/0 |   2/0 |  41.4 |   49.3 |   -8.6 | -3.63 | HOLD     | 1.00u | WIN     |      +1.15 |
| 2026-08-30 | MLB   | TOTAL  | Under 8.5               |  +133 | +0.401 | CONFIRMED-Q1 |   5/4 |   3/2 |  47.6 |   41.4 |   -2.4 | -3.37 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-08-30 | MLB   | TOTAL  | Over 8.5                |  +104 | +0.982 | CONFIRMED-UNOPP |   4/0 |   2/0 |  43.8 |   57.4 |   -6.2 | -1.94 | MUTE     | 1.00u | LOSS    |      -1.00 |
| 2026-08-30 | MLB   | TOTAL  | Under 8.5               |  +117 | +0.958 | CONFIRMED-UNOPP |   2/0 |   2/0 |  49.2 |   48.0 |   -0.8 | -2.25 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-08-30 | MLB   | TOTAL  | Under 7.5               |  -108 | +0.931 | CONFIRMED-Q1 |   1/0 |   1/0 |  68.6 |   20.0 |  +18.6 | -2.58 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-08-30 | MLB   | TOTAL  | Under 8.5               |  +127 | +0.039 | CONFIRMED-Q1 |   2/1 |   2/1 |  47.3 |   45.5 |   -9.3 | -2.97 | HOLD     | 2.00u | WIN     |      +2.54 |
| 2026-08-30 | MLB   | TOTAL  | Over 7.5                |  -111 | +0.936 | CONFIRMED-UNOPP |   3/1 |   1/0 |  36.7 |   55.1 |  -12.2 | -3.60 | HOLD     | 1.00u | WIN     |      +0.90 |
| 2026-08-30 | MLB   | TOTAL  | Under 7.5               |  +108 | +0.986 | MINI     |   1/1 |   1/0 |  53.2 |   65.2 |  +31.0 |  6.69 | BOOST    | 5.40u | WIN     |      +5.83 |
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

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.532 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.059 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.013 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.010 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.039 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  916 |    +0.0861 |    -0.0638 | 0.0005 |  +0.022 |   0.946 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  916 |    +0.0825 |    +0.4773 | 0.0015 |  +0.039 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  916 |    -0.1782 |    +0.2715 | 0.0002 |  -0.015 |   2.825 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 916 |          +0.072 |           +0.031 |                   +0.039 |                   +0.008 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 916 |          -0.006 |           +0.309 |                   +0.005 |                   +0.108 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 916 |          +0.029 |           +0.196 |                   +0.008 |                   +0.048 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 916 |          -0.019 |           +0.169 |                   +0.010 |                   +0.099 | count of contributing AGAINST-side wallets                     |
| provenFor         | 916 |          +0.021 |           +0.174 |                   +0.013 |                   +0.071 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 916 |          +0.001 |           +0.128 |                   +0.017 |                   +0.063 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 7.310          | 306 | 166-140 |   54.2% |     +0.9% |
| MID (p33–p67)     | 19.950 … 26.017        | 305 | 160-145 |   52.5% |     -1.0% |
| HIGH (> p67)      | 48.906 … 35.667        | 305 | 175-130 |   57.4% |     +1.1% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       916 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8448 | average score across live picks                                 |
| SD                |    0.2372 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.969 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +2.828 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.445 / +0.959 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| MLB   |  744 | 391-353 |   52.6% |     +2.6% |  0.513 |        -0.071 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   15 | 9-6    |   60.0% |     -0.8% |  0.630 |        -0.104 | strong (N<20)                             |
| NHL   |    6 | 5-1    |   83.3% |    +38.2% |  0.000 |        -0.371 | anti-signal (N<20)                        |
| SOC   |   47 | 33-14  |   70.2% |    +23.7% |  0.569 |        +0.089 | real                                      |
| UFC   |   33 | 25-8   |   75.8% |    +15.3% |  0.615 |        +0.134 | strong                                    |
| WNBA  |   61 | 35-26  |   57.4% |     -0.5% |  0.548 |        +0.051 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.564, 0.545, 0.577, 0.543, 0.537, 0.521, 0.537, 0.536, 0.539, 0.515, 0.538, 0.599, 0.596, 0.581]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30"]
    y-axis "edge (pp)" -4 --> 4
    line [-0.2, 1.1, 1.6, -2.5, -2.5, -1.8, -1.2, -0.9, -2.3, -0.6, 3, -1.2, -0.5, -0.2]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
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
| 2026-08-30 |    7 |  106 | 59-47  |   55.7% |     +1.2% |  0.581 |      -0.2pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.524 avg in first half → 0.530 avg in second half · Δ = +0.006)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.5% | [-2.1%, +10.4%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.7% | [51.5%, 57.9%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.532 | [0.493, 0.572]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |             87 | [28, 144]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       921 |
| Unique wallets ever on a FOR side            |                                                       262 |
| Avg FOR-side wallets per pick                |                                                      2.78 |
| Top-5 wallets' share of all FOR appearances  |                                                     22.9% |
| Top-10 wallets' share of all FOR appearances |                                                     39.3% |
| Top-20 wallets' share of all FOR appearances |                                                     55.3% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 0cd77e  | MLB,SOC,UFC,WNBA |  153 |   21 | 83-70  |   54.2% |    +12.6% |    +53.70 |     1.60× | CONFIRMED   |     -2.1% |     357 | 2026-08-30 |
|    2 | 4b912c  | MLB,NFL,SOC,WNBA |  146 |   48 | 77-69  |   52.7% |     +7.4% |    +24.74 |     1.55× | CONFIRMED   |     -9.2% |     414 | 2026-08-30 |
|    3 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  101 |   62 | 64-37  |   63.4% |    +15.8% |    +53.36 |     1.54× | CONFIRMED   |     +6.9% |     338 | 2026-07-19 |
|    4 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    5 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     334 | 2026-08-05 |
|    6 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   90 |   59 | 42-48  |   46.7% |     -4.8% |    -12.15 |     1.25× | CONFIRMED   |     +2.9% |     426 | 2026-08-30 |
|    7 | cd2f63  | MLB,NBA,NFL,SOC,WNBA |   89 |   44 | 48-41  |   53.9% |    +13.8% |    +34.44 |     1.10× | CONFIRMED   |     +8.2% |     511 | 2026-08-29 |
|    8 | 0f9d74  | MLB,NBA,NFL,SOC,UFC |   84 |   60 | 47-37  |   56.0% |    +13.9% |    +29.24 |     0.48× | CONFIRMED   |    +14.9% |     365 | 2026-08-30 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   82 |   32 | 44-38  |   53.7% |     -4.6% |    -10.05 |     2.03× | CONFIRMED   |     -7.5% |     288 | 2026-08-30 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   55 |   16 | 33-22  |   60.0% |    +27.8% |    +37.84 |     0.83× | CONFIRMED   |     +9.4% |     223 | 2026-08-29 |
|   12 | 705ba1  | MLB        |   49 |   26 | 22-27  |   44.9% |     -8.1% |    -10.86 |     1.16× | FLAT        |     +3.0% |     218 | 2026-08-30 |
|   13 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   48 |   60 | 22-26  |   45.8% |    -11.1% |    -15.15 |     4.13× | CONFIRMED   |     -6.9% |     274 | 2026-08-30 |
|   14 | bc35e3  | MLB,SOC,UFC,WNBA |   45 |   24 | 22-23  |   48.9% |     +3.9% |     +4.95 |     1.16× | CONFIRMED   |     -4.4% |     190 | 2026-08-30 |
|   15 | 621848  | MLB,SOC,UFC,WNBA |   43 |   11 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +9.2% |     112 | 2026-08-28 |
|   16 | 3bdd7e  | MLB,NFL,SOC,WNBA |   42 |   13 | 25-17  |   59.5% |    +11.4% |     +9.11 |     2.97× | CONFIRMED   |     -1.2% |     133 | 2026-08-28 |
|   17 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   36 |   23 | 20-16  |   55.6% |     +1.0% |     +1.12 |     1.35× | CONFIRMED   |    +12.7% |     147 | 2026-08-28 |
|   18 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   19 | 913987  | MLB        |   30 |    5 | 20-10  |   66.7% |    +12.8% |    +10.20 |     0.97× | CONFIRMED   |    +32.2% |      44 | 2026-06-11 |
|   20 | 69f882  | MLB,SOC,UFC,WNBA |   29 |   13 | 20-9   |   69.0% |    +10.4% |     +8.31 |     3.35× | CONFIRMED   |    +13.9% |      96 | 2026-08-30 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | d66e28  | MLB,WNBA   |   14 | 11-3   |   78.6% |     +63.4% |    +21.75 |     0.69× | 2026-08-29 |
|    2 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    3 | 2cbcf8  | MLB,UFC    |   11 | 8-3    |   72.7% |     +45.1% |    +19.74 |     1.12× | 2026-08-28 |
|    4 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    5 | 487b8b  | MLB,NFL,SOC,UFC,WNBA |   11 | 9-2    |   81.8% |     +41.0% |    +16.08 |     1.22× | 2026-08-30 |
|    6 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|    7 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|    8 | e8e2cc  | MLB,NFL,WNBA |   11 | 8-3    |   72.7% |     +31.2% |    +10.24 |     0.78× | 2026-08-28 |
|    9 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   10 | a0cff6  | MLB,NBA,SOC,UFC,WNBA |   18 | 13-5   |   72.2% |     +29.1% |    +13.06 |     4.41× | 2026-08-30 |
|   11 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   12 | 7a4cdf  | SOC        |   10 | 7-3    |   70.0% |     +28.0% |     +8.53 |     1.08× | 2026-07-14 |
|   13 | 7923c4  | MLB,NBA,UFC |   55 | 33-22  |   60.0% |     +27.8% |    +37.84 |     0.83× | 2026-08-29 |
|   14 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|   15 | 4c8ed9  | MLB,SOC,UFC,WNBA |   16 | 9-7    |   56.3% |     +21.7% |     +5.07 |     2.86× | 2026-08-26 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 9214c2  | MLB        |   11 | 2-9    |   18.2% |     -71.2% |    -10.68 |     0.40× | 2026-08-30 |
|    2 | 2a8409  | MLB,WNBA   |   11 | 3-8    |   27.3% |     -48.5% |     -8.49 |     1.21× | 2026-08-30 |
|    3 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    4 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    5 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    6 | ac9705  | MLB,WNBA   |   21 | 9-12   |   42.9% |     -12.2% |     -9.27 |     2.26× | 2026-08-22 |
|    7 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   48 | 22-26  |   45.8% |     -11.1% |    -15.15 |     4.13× | 2026-08-30 |
|    8 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    9 | c9bba3  | MLB,NFL,SOC |   18 | 11-7   |   61.1% |      -8.7% |     -3.39 |     0.77× | 2026-08-29 |
|   10 | 705ba1  | MLB        |   49 | 22-27  |   44.9% |      -8.1% |    -10.86 |     1.16× | 2026-08-30 |
|   11 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   90 | 42-48  |   46.7% |      -4.8% |    -12.15 |     1.25× | 2026-08-30 |
|   12 | 2f2a9e  | MLB,SOC,WNBA |   82 | 44-38  |   53.7% |      -4.6% |    -10.05 |     2.03× | 2026-08-30 |
|   13 | 7d395d  | MLB,UFC,WNBA |   16 | 8-8    |   50.0% |      -3.4% |     -1.14 |     1.71× | 2026-08-30 |
|   14 | ad88a3  | MLB,SOC    |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-08-21 |
|   15 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   36 | 20-16  |   55.6% |      +1.0% |     +1.12 |     1.35× | 2026-08-28 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `7da3d5` (FOR# 48, ROI -11.1%), `1e8f33` (FOR# 94, ROI -10.7%), `705ba1` (FOR# 49, ROI -8.1%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  1886 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   484 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     6 | 🟢 picks queued for grading |
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
| MLB   |            288 |        72 |   30 |   14 |  172 |                    116 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            277 |        76 |   40 |   12 |  149 |                    128 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |   92 |    921 | 1293 | 504-417 |  54.7% |      4.5% |    +113.61 |    +0.12 | 0.509 |        0.2499 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  861 |    +1.4pp |    +13.5pp |          +0.296 |   -0.040 |    +0.0901 | 🟡 mixed |
| v12 − v10          | +  859 |    +6.3pp |    +23.3pp |          +0.437 |   +0.115 |    +0.0305 | 🟢 better |
| v12 − v11          | +  810 |    -0.2pp |     +1.7pp |          +0.062 |   +0.065 |    +0.0143 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 748n 52.5% +3% | 10n 30.0% +29% | 15n 60.0% -1%  | 6n 83.3% +38%  | 48n 70.8% +24% | 33n 75.8% +15% | 61n 57.4% -0%  | 921n 54.7% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 178n +3%      | 255n +3%      | 208n +6%      | 124n +2%      | 151n +11%     | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2496 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1155 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 916 / 1155 (79%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 916 / 1155 (79%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 916 / 1155 (79%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 916 / 1155 (79%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 916 / 1155 (79%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 916 / 1155 (79%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 916 / 1155 (79%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1155 / 1155 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1155 / 1155 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1155 / 1155 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1155 / 1155 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1155 / 1155 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1155 / 1155 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1148 / 1155 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1146 / 1155 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1155 / 1155 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1154 / 1155 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 713 / 1155 (62%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1154 / 1155 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 713 / 1155 (62%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 712 / 1155 (62%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1155 / 1155 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1155 / 1155 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1155 / 1155 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1154 / 1155 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1155 / 1155 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 713 |      |    +0.021 |    +0.250 |      +0.049 |      +0.122 |  0.521 |
|    2 | wd sizeMargin        | 712 |      |    -0.013 |    -0.012 |      -0.040 |      -0.059 |  0.497 |
|    3 | V12 forMean          | 916 |  🟢  |    +0.072 |    +0.031 |      +0.039 |      +0.008 |  0.529 |
|    4 | qMargin              | 916 |  🟢  |    +0.076 |    +0.009 |      +0.039 |      -0.005 |  0.528 |
|    5 | wd contribMargin     | 1155 |      |    -0.013 |    -0.110 |      -0.038 |      -0.092 |  0.480 |
|    6 | wd agAvgSize         | 713 |      |    +0.017 |    +0.007 |      +0.037 |      +0.032 |  0.503 |
|    7 | wd maxForContrib     | 1154 |      |    -0.042 |    -0.111 |      -0.034 |      -0.049 |  0.490 |
|    8 | lockPinnProb         | 1148 |      |    +0.197 |    +0.180 |      +0.032 |      -0.118 |  0.606 |
|    9 | clv                  | 1146 |      |    -0.028 |    +0.061 |      -0.026 |      +0.020 |  0.516 |
|   10 | wd contribFor        | 1155 |      |    -0.015 |    -0.072 |      -0.023 |      -0.054 |  0.485 |
|   11 | agsV12               | 916 |  🟢  |    +0.039 |    -0.013 |      +0.022 |      -0.010 |  0.532 |
|   12 | hcMargin             | 1155 |      |    +0.005 |    +0.219 |      -0.020 |      +0.058 |  0.513 |
|   13 | wd contribAg         | 1155 |      |    -0.006 |    +0.118 |      +0.016 |      +0.053 |  0.496 |
|   14 | wd maxShare          | 1155 |      |    +0.017 |    -0.047 |      +0.014 |      -0.006 |  0.509 |
|   15 | provenMargin         | 1155 |      |    +0.004 |    +0.093 |      -0.014 |      +0.004 |  0.499 |
|   16 | wd forAvgSize        | 1154 |      |    +0.006 |    +0.048 |      -0.013 |      -0.005 |  0.515 |
|   17 | ags (v11)            | 1155 |      |    +0.008 |    +0.075 |      -0.013 |      -0.008 |  0.516 |
|   18 | provenFor            | 1155 |      |    -0.007 |    +0.067 |      -0.013 |      -0.006 |  0.496 |
|   19 | V12 agCount          | 916 |  🟢  |    -0.019 |    +0.169 |      +0.010 |      +0.099 |  0.506 |
|   20 | provenTotal          | 1155 |      |    -0.012 |    +0.019 |      -0.010 |      -0.006 |  0.495 |
|   21 | V12 forCount         | 916 |  🟢  |    +0.029 |    +0.196 |      +0.008 |      +0.048 |  0.513 |
|   22 | peakStars            | 1155 |      |    +0.017 |    +0.063 |      -0.006 |      -0.013 |  0.508 |
|   23 | V12 agMean           | 916 |  🟢  |    -0.006 |    +0.309 |      +0.005 |      +0.108 |  0.477 |
|   24 | provenAg             | 1155 |      |    -0.016 |    +0.145 |      -0.002 |      +0.061 |  0.497 |
|   25 | wd forCount          | 1154 |      |    +0.013 |    +0.128 |      -0.001 |      +0.006 |  0.496 |
|   26 | countMargin          | 916 |      |    +0.041 |    +0.119 |      +0.001 |      -0.006 |  0.509 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.049), `wd sizeMargin` (r = -0.040), `V12 forMean` (r = +0.039).

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.049 · AUC = 0.521

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 345 | 182-163 |   52.8% |     -1.2% |
| MID (p33–p67)     | 2.000 … 2.000            | 172 | 89-83   |   51.7% |     -1.7% |
| HIGH (> p67)      | 3.000 … 4.000            | 196 | 113-83  |   57.7% |     +3.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd sizeMargin` · r(unit-ret) = -0.040 · AUC = 0.497

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -2.595          | 238 | 132-106 |   55.5% |     +1.8% |
| MID (p33–p67)     | 0.078 … 0.052            | 237 | 122-115 |   51.5% |     -0.5% |
| HIGH (> p67)      | 3.728 … 1.365            | 237 | 130-107 |   54.9% |     -1.5% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.039 · AUC = 0.529

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 7.310            | 306 | 166-140 |   54.2% |     +0.9% |
| MID (p33–p67)     | 19.950 … 26.017          | 305 | 160-145 |   52.5% |     -1.0% |
| HIGH (> p67)      | 48.906 … 35.667          | 305 | 175-130 |   57.4% |     +1.1% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `qMargin` · r(unit-ret) = +0.039 · AUC = 0.528

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 7.310            | 306 | 165-141 |   53.9% |     +0.4% |
| MID (p33–p67)     | 19.950 … 11.445          | 305 | 165-140 |   54.1% |     +0.4% |
| HIGH (> p67)      | 46.556 … 35.667          | 305 | 171-134 |   56.1% |     +0.2% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd contribMargin` · r(unit-ret) = -0.038 · AUC = 0.480

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … 3.400          | 386 | 219-167 |   56.7% |     +2.0% |
| MID (p33–p67)     | 57.800 … 46.900          | 384 | 210-174 |   54.7% |     +0.7% |
| HIGH (> p67)      | 174.100 … 223.800        | 385 | 199-186 |   51.7% |     -2.4% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | wd sizeMargin  | V12 forMean    | qMargin        | wd contribMargin | wd agAvgSize   | wd maxForContrib | lockPinnProb   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         +0.029 |         +0.135 |         +0.028 |         -0.153 |         +0.102 |         +0.300 |         -0.070 |
| wd sizeMargin |         +0.029 |  1.000         |         +0.217 |         +0.200 |         +0.272 |         -0.753 |         +0.265 |         +0.149 |
| V12 forMean |         +0.135 |         +0.217 |  1.000         |         +0.957 |         +0.087 |         -0.022 |         +0.204 |         +0.124 |
| qMargin     |         +0.028 |         +0.200 |         +0.957 |  1.000         |         +0.070 |         -0.039 |         +0.161 |         +0.136 |
| wd contribMargin |         -0.153 |         +0.272 |         +0.087 |         +0.070 |  1.000         |         -0.146 |         +0.506 |         +0.181 |
| wd agAvgSize |         +0.102 |         -0.753 |         -0.022 |         -0.039 |         -0.146 |  1.000         |         +0.052 |         -0.094 |
| wd maxForContrib |         +0.300 |         +0.265 |         +0.204 |         +0.161 |         +0.506 |         +0.052 |  1.000         |         +0.031 |
| lockPinnProb |         -0.070 |         +0.149 |         +0.124 |         +0.136 |         +0.181 |         -0.094 |         +0.031 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.957. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 592 picks · features = 8 (+ intercept) · multiple R² = **0.0106** · adjusted R² = **-0.0047** · residual sd = 0.952

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | qMargin              |  🟢 |    +0.0837 |   0.1462 | +0.57        |        1 |
|    2 | wd agCount           |     |    +0.0509 |   0.0474 | +1.08        |        2 |
|    3 | wd agAvgSize         |     |    +0.0347 |   0.0666 | +0.52        |        3 |
|    4 | wd contribMargin     |     |    -0.0319 |   0.0508 | -0.63        |        4 |
|    5 | V12 forMean          |  🟢 |    -0.0311 |   0.1486 | -0.21        |        5 |
|    6 | wd sizeMargin        |     |    -0.0182 |   0.0698 | -0.26        |        6 |
|    7 | lockPinnProb         |     |    +0.0112 |   0.0405 | +0.28        |        7 |
|    8 | wd maxForContrib     |     |    +0.0028 |   0.0551 | +0.05        |        8 |
| —    | (intercept)          |     |    +0.0146 |   0.0391 |    +0.37 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.084), `V12 forMean` (β = -0.031)
- V12 IGNORES: `wd agCount` (β = +0.051, t = +1.08), `wd agAvgSize` (β = +0.035, t = +0.52), `wd contribMargin` (β = -0.032, t = -0.63), `wd sizeMargin` (β = -0.018, t = -0.26), `lockPinnProb` (β = +0.011, t = +0.28), `wd maxForContrib` (β = +0.003, t = +0.05)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.539 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.566 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.026.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Adjusted R² of -0.0047 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*