# AGS-Unified — V12 Daily Monitor

**Generated:** Wednesday, September 9, 2026 at 12:51 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (101 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (101 days ago), V12 has evaluated **3351** picks, shipped **980** for real money (29.2% ship rate), and muted the other **2371**. On the shipped picks V12 has gone **545-435** (55.6% win), staked **2685.60u**, and returned **+174.91u** at **+6.5% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                            101 |
| Picks V12 has evaluated             |                           3351 |
| Picks SHIPPED (units > 0)           |                            980 |
| Picks MUTED (score ≤ 0, FADE)       |                           2371 |
| Ship rate                           |                          29.2% |
| Live W-L                            |                        545-435 |
| Live Win %                          |                          55.6% |
| Live PnL (units)                    |                        +174.91 |
| Live ROI                            |                          +6.5% |
| Avg PnL / day                       |                         +1.73u |
| Most recent action (2026-09-09)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **6.5% ROI** across 980 live picks (+174.91u real PnL).
- Mute rule is **saving money** — the 1611 muted picks would have lost -100.95u at flat 1u (-6.3% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.73u/day** on average since launch.
- Best sport: **NHL** — 6 live, 5-1, 38.2% ROI, +6.30u.
- Tape era (2026-07-15+): **309-242** · +8.5% ROI · +128.30u on 551 graded — see § 5.

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

**Full book:** 101d · 980 live · 545-435 · **+174.91u** · +6.5% ROI · +1.73u/day.

_Prior to table (2026-06-01 → 2026-08-19): 744 live · 407-337 · +101.79u · cum through prior = +101.79u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-08-31 |        39 |    5 |    22 | 4-1        |  80.0% |     12.50 |      +3.74 |     29.9% |    +117.35 |
| 2026-09-01 |        44 |    4 |    31 | 4-0        | 100.0% |     16.90 |     +16.82 |     99.5% |    +134.17 |
| 2026-09-02 |        49 |    5 |    33 | 3-2        |  60.0% |     17.40 |      +4.88 |     28.0% |    +139.05 |
| 2026-09-03 |        34 |    6 |    16 | 5-1        |  83.3% |     17.00 |      +9.23 |     54.3% |    +148.28 |
| 2026-09-04 |        68 |    7 |    44 | 5-2        |  71.4% |     24.40 |      +6.05 |     24.8% |    +154.33 |
| 2026-09-05 |       109 |    9 |    80 | 6-3        |  66.7% |     23.90 |      +7.72 |     32.3% |    +162.05 |
| 2026-09-06 |        54 |    7 |    37 | 5-2        |  71.4% |     20.50 |      +7.23 |     35.3% |    +169.28 |
| 2026-09-07 |        48 |    7 |    28 | 5-2        |  71.4% |     21.00 |      +7.22 |     34.4% |    +176.50 |
| 2026-09-08 |        46 |    9 |    25 | 4-5        |  44.4% |     26.00 |      -1.59 |     -6.1% |    +174.91 |
| 2026-09-09 |        44 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +174.91 |

> **Trajectory.** 🟢 Last 3 days (12.0% ROI) **+5.6pp** vs prior (6.4%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-09-08**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 21 | 16-5 | +47.2% | +41.81u | +1.99u | +53.8% |
| 🟢 2 | RANK 2-for-0 rescue | B | 103 | 62-41 | +16.8% | +63.32u | +0.61u | +97.1% |
| 🟢 3 | DISSENT rescue | D | 24 | 13-11 | +12.0% | +3.05u | +0.13u | +108.0% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 121 | 78-43 | +13.2% | +75.24u | sized UP after path |
| 2 | Tape HOLD (mid) | 375 | 205-170 | +7.3% | +61.35u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 27 | 12-15 | -27.8% | -15.17u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | Tape MUTE (tape<0 → 0u) | 159 | 83-76 | -0.4% | -0.67u | 🟡 flat |
| 2 | Score FADE (≤0 → 0u) | 860 | 434-426 | +0.3% | +2.42u | 🟡 flat |
| 3 | fadeTop≥60 MUTE | 45 | 22-23 | +0.8% | +0.37u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 21 | 16-5 | 76.2% | 88.5u | +41.81u | +47.2% | +1.99u | 3 | +53.8% | -3.00u | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 106 | 63-43 | 59.4% | 389.7u | +18.38u | +4.7% | +0.17u | 0 | — | — | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 103 | 62-41 | 60.2% | 377.5u | +63.32u | +16.8% | +0.61u | 5 | +97.1% | +3.12u | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 87 | 43-44 | 49.4% | 303.0u | -10.51u | -3.5% | -0.12u | 9 | +10.1% | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 109 | 56-53 | 51.4% | 302.3u | -1.34u | -0.4% | -0.01u | 1 | -100.0% | -2.00u | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 97 | 57-40 | 58.8% | 250.1u | +21.88u | +8.8% | +0.23u | 2 | +108.5% | +3.57u | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 20 | 12-8 | 60.0% | 26.5u | +3.12u | +11.8% | +0.16u | 0 | — | — | 🟢 OK |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 24 | 13-11 | 54.2% | 25.4u | +3.05u | +12.0% | +0.13u | 1 | +108.0% | — | 🟢 OK |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 121 | 78-43 | 64.5% | 569.3u | +75.24u | +13.2% | 4 | +30.9% | — |
| Tape HOLD (mid) | TAPE | staked | 375 | 205-170 | 54.7% | 838.1u | +61.35u | +7.3% | 44 | +34.4% | -4.45u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 27 | 12-15 | 44.4% | 54.5u | -15.17u | -27.8% | 0 | — | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 159 | 83-76 | 52.2% | 159.0u | -0.67u | -0.4% | 50 | +10.0% | +0.97u |
| fadeTop≥60 MUTE | E | CF 1u | 45 | 22-23 | 48.9% | 45.0u | +0.37u | +0.8% | 15 | +55.3% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 860 | 434-426 | 50.5% | 860.0u | +2.42u | +0.3% | 129 | -7.4% | -3.86u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 8 / +52% | — | — |
| TOP | 38 / -2% | 24 / +4% | 4 / -16% |
| RANK | 54 / +17% | 10 / +27% | — |
| SHARP | 20 / -14% | 41 / +3% | 1 / -100% |
| SHARP-LEAN | 80 / -1% | 26 / +2% | 3 / -30% |
| MINI | 46 / +10% | 10 / +45% | 4 / +1% |
| MINI- | 6 / -20% | 1 / +45% | 3 / -5% |
| DISSENT | 15 / +22% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-09-08)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| MINI (gate-pass) | 1 | 1-0 | +3.57u | +119.0% |
| RANK 2-for-0 rescue | 1 | 1-0 | +3.12u | +104.0% |
| SHARP-LEAN EDGE/net ONE | 1 | 0-1 | -2.00u | -100.0% |
| HC-2 SUPER | 1 | 0-1 | -3.00u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  30 | 16-5   |  76.2% |       88.50 |     +41.81 |     47.2% |
| TOP PICK (TOP+/TOP)       |  4-5u | 212 | 78-57  |  57.8% |      522.20 |      +6.44 |      1.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER) | 1.5-6u | 658 | 167-146 |  53.4% |     1031.75 |     +44.86 |      4.3% |
| STRONG (MINI)             |    3u | 159 | 57-40  |  58.8% |      250.05 |     +21.88 |      8.8% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 124 | 27-22  |  55.1% |       56.85 |      +4.15 |      7.3% |
| **STAKED TOTAL** |     — | 615 | 345-270 |  56.1% |     1949.35 |    +119.14 |     +6.1% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  30 | 16-5   |  76.2% |       88.50 |     +41.81 |     47.2% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 183 | 63-43  |  59.4% |      389.70 |     +18.38 |      4.7% |
| B · 2-for-0 rescue    | RANK        |    4u | 157 | 62-41  |  60.2% |      377.45 |     +63.32 |     16.8% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 365 | 56-53  |  51.4% |      302.34 |      -1.34 |     -0.4% |
| C · proven-$ consensus | SHARP       |    3u | 122 | 43-44  |  49.4% |      302.96 |     -10.51 |     -3.5% |
| A · mini-HC (gate-pass) | MINI        |    3u | 159 | 57-40  |  58.8% |      250.05 |     +21.88 |      8.8% |
| C · mini gate-cut     | MINI-       |    1u |  32 | 12-8   |  60.0% |       26.50 |      +3.12 |     11.8% |
| A · margin 3+         | CONFIRMED   |    1u |  11 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u |  81 | 13-11  |  54.2% |       25.35 |      +3.05 |     12.0% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 636 picks tracked at 0u (would-be 299-337, 47.0% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (21-9, +41.81u)  ·  🟢 TOP PICK (111-101, +6.44u)  ·  🟠 SHARP PLAY (328-330, +44.86u)  ·  🔴 STRONG (89-70, +21.88u)  ·  🟣 LEAN (71-53, +4.15u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08"]
    y-axis "PnL (u)" -14 --> 50
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54, 44.81, 44.81, 44.81, 44.81, 44.81, 41.81]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85, 38.85, 38.79, 38.82, 41.18, 43.74, 44.86]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37, 18.31, 18.31, 18.31, 18.31, 18.31, 21.88]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71, 72, 71, 72, 72, 72, 70]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52, 52, 52, 52, 52, 52, 52]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50, 50, 50, 49, 49, 50, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57, 57, 57, 56, 55, 55, 56]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 56, 57, 57, 57]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 2039 | 2030 | 1975 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 159 | 83-76 | 52.2% | 37.00u | +5.60u | +15.1% |
| HOLD      | 650 | 331-319 | 50.9% | 841.07u | +58.35u | +6.9% |
| BOOST     | 182 | 109-73 | 59.9% | 572.78u | +77.32u | +13.5% |
| FAIL_OPEN | 49 | 27-22 | 55.1% | 54.50u | -15.17u | -27.8% |
| PASS      | 935 | 468-467 | 50.1% | 8.00u | -2.12u | -26.5% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 699 | 363-336 | 51.9% | +17.61u |
| hold (0–2.89) | path u | 837 | 412-425 | 49.2% | +50.72u |
| boost (≥2.89) | ×1.35 | 225 | 128-97 | 56.9% | +71.67u |

_Score coverage: **1761/1975** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 159 | +3.67u | -3.67u | +102.75u | +106.42u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 123 | +57.25u | +77.32u | +20.07u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-09-09 | MLB | Milwaukee Brewers | SHARP~ | -4.29 | MUTE | 2.00u | 0.00u | — |
| 2026-09-09 | MLB | Los Angeles Dodgers | CONFIRMED-UNOPP | -4.29 | MUTE | 3.00u | 0.00u | — |
| 2026-09-09 | MLB | Under 8.5 | PATH-D | -5.76 | MUTE | 1.00u | 0.00u | — |
| 2026-09-09 | MLB | Under 8.5 | PATH-D | -1.42 | MUTE | 1.00u | 0.00u | — |
| 2026-09-09 | MLB | Under 9.5 | PATH-D | -1.71 | MUTE | 1.00u | 0.00u | — |
| 2026-09-09 | NFL | Over 44.5 | CONFIRMED-Q1 | -0.07 | MUTE | 3.00u | 2.00u | — |
| 2026-09-08 | MLB | Arizona Diamondbacks | CONFIRMED-Q1 | -1.42 | MUTE | 1.00u | 3.00u | WIN |
| 2026-09-08 | MLB | Milwaukee Brewers | SHARP~ | -0.30 | MUTE | 4.00u | 0.00u | WIN |
| 2026-09-08 | MLB | Baltimore Orioles | PATH-D | -3.02 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-08 | MLB | New York Yankees | SHARP~ | -0.08 | MUTE | 2.00u | 0.00u | WIN |
| 2026-09-08 | MLB | Houston Astros | PATH-D | -2.37 | MUTE | 1.00u | 0.00u | WIN |
| 2026-09-08 | MLB | Colorado Rockies | MINI | 4.79 | BOOST | 1.00u | 0.00u | WIN |
| 2026-09-08 | MLB | Under 7.5 | CONFIRMED-UNOPP | -0.20 | MUTE | 1.00u | 0.00u | LOSS |
| 2026-09-07 | MLB | Boston Red Sox | CONFIRMED-UNOPP | -2.52 | MUTE | 3.00u | 0.00u | WIN |
| 2026-09-07 | MLB | Washington Nationals | SHARP~ | -4.04 | MUTE | 1.50u | 0.00u | LOSS |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-1.20** · nPriors=592 · source=expanding_q1 · asOf=2026-09-09 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 1593 | 1494 | 1445 | 309 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 111 | 48-63 | 43.2% | 11.00u | -3.29u | -29.9% |
| HOLD      | 319 | 162-157 | 50.8% | 307.20u | +21.46u | +7.0% |
| FAIL_OPEN | 47 | 20-27 | 42.6% | 44.90u | -5.08u | -11.3% |
| EXEMPT    | 620 | 336-284 | 54.2% | 624.10u | +86.61u | +13.9% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -69.5 … -2.9 | 57 | 19-38 | 33.3% | 0.0u | +0.00u | — |
| Q2 | -2.7 … 1.0 | 57 | 25-32 | 43.9% | 36.9u | +14.66u | +39.7% |
| Q3 | 1.1 … 5.6 | 57 | 28-29 | 49.1% | 59.5u | +1.63u | +2.7% |
| Q4 | 5.6 … 18.2 | 57 | 29-28 | 50.9% | 73.6u | -10.44u | -14.2% |
| Q5 | 18.8 … 1802.6 | 57 | 33-24 | 57.9% | 98.7u | +11.61u | +11.8% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 111 | 48-63 | -9.47u | +9.47u | +69.50u | +60.03u |

> 🟢 **Mute is saving money** (Δ +9.47u · muted WR 43.2%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 48 | 18-30 | 37.5% | 51.0u | -10.07u |
| CFB | 5 | 1-4 | 20.0% | 6.5u | -4.33u |
| MLB | 76 | 35-41 | 46.1% | 85.5u | +0.80u |
| NFL | 4 | 2-2 | 50.0% | 4.0u | +0.10u |
| SOC | 4 | 1-3 | 25.0% | 4.0u | -0.87u |
| WNBA | 22 | 9-13 | 40.9% | 24.0u | -5.17u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-09-09 | MLB | Kansas City Royals | SHARP~ | -24.4 | -1.2 | 1.00u | pending |
| 2026-09-09 | MLB | Under 8.5 | SHARP~ | -13.2 | -1.2 | 1.00u | pending |
| 2026-09-09 | MLB | Under 8.5 | SHARP~ | -19.5 | -1.2 | 1.00u | pending |
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
| 2026-09-05 | SOC | Tottenham Hotspur FC | — | -2.2 | -1.3 | 1.00u | LOSS |
| 2026-09-03 | MLB | Boston Red Sox | — | 16.5 | -1.3 | 3.00u | WIN |
| 2026-09-03 | MLB | Pittsburgh Pirates | SHARP~ | -8.2 | -1.3 | 1.00u | WIN |
| 2026-09-03 | MLB | Cleveland Guardians | SHARP~ | -9.8 | -1.3 | 1.00u | LOSS |
| 2026-09-03 | MLB | Under 9.5 | SHARP~ | -32.4 | -1.3 | 1.00u | LOSS |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 86 | 46-40 | 53.5% | 268.7u | +17.46u | +6.5% |
| Muted (Q1 → 0u) | 111 | 48-63 | 43.2% | 11.0u | -3.29u | -29.9% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 150–81 · 64.9% · +16.7%); **5–10 is the hole** (84–79 · 51.5% · -0.9%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 762 tickets · cov 735/762 (stamp 533 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 341 | 181–160 | 53.1% | +0.4% |
| 5–10 | 163 | 84–79 | 51.5% | -0.9% |
| ≥10 | 231 | 150–81 | 64.9% | +16.7% |
| All | 762 | 427–335 | 56.0% | +7.0% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.9% (110) | 57.1% (70) | 71.9% (89) |
| B | 57.1% (70) | 60% (10) | 69.6% (23) |
| C | 38.5% (39) | 43.9% (57) | 57.9% (107) |

##### Jul 15+ · 551 tickets · cov 530/551 (stamp 528 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 235 | 128–107 | 54.5% | +7.2% |
| 5–10 | 124 | 61–63 | 49.2% | -2.9% |
| ≥10 | 171 | 111–60 | 64.9% | +14.7% |
| All | 551 | 309–242 | 56.1% | +8.5% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 49% (51) | 56.1% (41) | 75% (48) |
| B | 59.1% (44) | 40% (5) | 68.8% (16) |
| C | 38.9% (18) | 44.2% (52) | 58.8% (97) |

##### Yesterday (Sep 8) · 9 tickets · cov 9/9 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 4 | 2–2 | 50.0% | -0.2% |
| 5–10 | 5 | 2–3 | 40.0% | -11.2% |
| All | 9 | 4–5 | 44.4% | -6.1% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | 50% (2) | — |
| B | 100% (1) | — | — |
| C | — | 0% (1) | — |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 762 tickets · cov 756/762 (stamp 545 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 496 | 281–215 | 56.7% | +7.1% |
| 5–10 | 136 | 73–63 | 53.7% | +8.5% |
| ≥10 | 124 | 71–53 | 57.3% | +6.1% |
| All | 762 | 427–335 | 56.0% | +7.0% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 58.7% (172) | 50% (52) | 71.7% (53) |
| B | 63.2% (76) | 50% (14) | 53.8% (13) |
| C | 49.2% (118) | 59.6% (47) | 42.2% (45) |

##### Jul 15+ · 551 tickets · cov 546/551 (stamp 545 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 346 | 203–143 | 58.7% | +13.3% |
| 5–10 | 113 | 60–53 | 53.1% | +8.6% |
| ≥10 | 87 | 44–43 | 50.6% | -6.0% |
| All | 551 | 309–242 | 56.1% | +8.5% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 65.4% (78) | 47.2% (36) | 62.5% (32) |
| B | 62.5% (48) | 50% (10) | 57.1% (7) |
| C | 52.7% (91) | 59.1% (44) | 38.9% (36) |

##### Yesterday (Sep 8) · 9 tickets · cov 9/9 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 8 | 4–4 | 50.0% | +6.1% |
| 5–10 | 1 | 0–1 | 0.0% | -100.0% |
| All | 9 | 4–5 | 44.4% | -6.1% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50% (2) | — | — |
| B | 100% (1) | — | — |
| C | 0% (1) | — | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 762 tickets · cov 735/762 (stamp 527 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 152 | 77–75 | 50.7% | -12.1% |
| 0–2.89 | 413 | 225–188 | 54.5% | +8.9% |
| ≥2.89 | 170 | 113–57 | 66.5% | +16.7% |
| All | 762 | 427–335 | 56.0% | +7.0% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 58.6% (157) | 75.4% (69) |
| B | 65.5% (29) | 56.1% (57) | 64.7% (17) |
| C | 18.2% (11) | 49.6% (119) | 56.2% (73) |

##### Jul 15+ · 551 tickets · cov 530/551 (stamp 527 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 83 | 49–34 | 59.0% | +11.2% |
| 0–2.89 | 322 | 171–151 | 53.1% | +6.5% |
| ≥2.89 | 125 | 80–45 | 64.0% | +12.6% |
| All | 551 | 309–242 | 56.1% | +8.5% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 55% (100) | 74.4% (39) |
| B | 69.2% (13) | 57.1% (42) | 60% (10) |
| C | — | 50% (100) | 55.2% (67) |

##### Yesterday (Sep 8) · 9 tickets · cov 9/9 (stamp 9 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 1 | 1–0 | 100.0% | +95.3% |
| 0–2.89 | 8 | 3–5 | 37.5% | -19.3% |
| All | 9 | 4–5 | 44.4% | -6.1% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 50% (2) | — |
| B | — | 100% (1) | — |
| C | — | 0% (1) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 551 | 309-242 | 56.1% | 1509.35u | +128.30u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 551/551 | 2.92 | 2.57 | +0.34 | 2.00 | 2.00 |
| depth   | #A sharps        | 551/551 | 1.48 | 1.48 | -0.01 | 1.00 | 1.00 |
| depth   | #F − #A          | 551/551 | 1.44 | 1.09 | +0.35 | 1.00 | 1.00 |
| depth   | proven F         | 551/551 | 2.05 | 1.88 | +0.17 | 1.00 | 1.00 |
| depth   | proven A         | 551/551 | 0.70 | 0.64 | +0.05 | 0.00 | 0.00 |
| depth   | proven F−A       | 551/551 | 1.35 | 1.23 | +0.12 | 1.00 | 1.00 |
| depth   | v12 F count      | 551/551 | 2.89 | 2.60 | +0.29 | 2.00 | 2.00 |
| depth   | v12 A count      | 551/551 | 1.56 | 1.58 | -0.02 | 1.00 | 1.00 |
| depth   | WA ForN          | 551/551 | 2.26 | 2.11 | +0.15 | 2.00 | 2.00 |
| depth   | WA AgN           | 551/551 | 1.24 | 1.32 | -0.08 | 1.00 | 1.00 |
| depth   | CLV ForN         | 550/551 | 2.63 | 2.38 | +0.25 | 2.00 | 2.00 |
| depth   | CLV AgN          | 550/551 | 1.45 | 1.50 | -0.05 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 551/551 | 0.37 | 0.33 | +0.03 | 0.00 | 0.00 |
| quality | ForWR            | 528/551 | 56.69 | 54.86 | +1.83 | 54.40 | 53.96 |
| quality | AgWR             | 342/551 | 45.77 | 46.52 | -0.75 | 46.82 | 47.75 |
| quality | TopFor WR        | 528/551 | 61.26 | 59.62 | +1.64 | 58.07 | 56.01 |
| quality | TopAg WR         | 342/551 | 49.19 | 49.50 | -0.31 | 49.11 | 50.00 |
| quality | EDGE             | 528/551 | 9.29 | 7.01 | +2.28 | 7.00 | 5.23 |
| quality | ForCLV           | 545/551 | 64.59 | 64.54 | +0.05 | 64.72 | 65.08 |
| quality | AgCLV            | 369/551 | 62.53 | 61.16 | +1.37 | 63.29 | 62.83 |
| quality | netCLV           | 545/551 | 2.24 | 3.12 | -0.88 | 2.76 | 3.22 |
| quality | Tape             | 527/551 | 2.19 | 1.87 | +0.32 | 1.60 | 1.46 |
| quality | V12 score        | 551/551 | 0.82 | 0.79 | +0.02 | 0.96 | 0.94 |
| quality | V12 forMean      | 551/551 | 29.24 | 23.46 | +5.78 | 21.93 | 16.78 |
| quality | V12 agMean       | 551/551 | 3.25 | 2.90 | +0.35 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | V12 forMean      | quality | 551/551 | 0.553 | +0.208 | +0.104 | +5.78 | 🟡 mild OK |
|    2 | V12 agMean       | quality | 551/551 | 0.449 | +0.368 | +0.025 | +0.35 | 🟡 mild OK |
|    3 | EDGE             | quality | 528/551 | 0.551 | -0.025 | +0.106 | +2.28 | 🟡 mild OK |
|    4 | V12 score        | quality | 551/551 | 0.550 | -0.004 | +0.045 | +0.02 | 🟡 mild OK |
|    5 | AgCLV            | quality | 369/551 | 0.544 | -0.052 | +0.090 | +1.37 | 🟡 mild inv |
|    6 | TopFor WR        | quality | 528/551 | 0.544 | +0.166 | +0.077 | +1.64 | 🟡 mild OK |
|    7 | ForWR            | quality | 528/551 | 0.537 | +0.039 | +0.100 | +1.83 | flat |
|    8 | Tape             | quality | 527/551 | 0.528 | -0.089 | +0.055 | +0.32 | flat |
|    9 | WA AgN           | depth   | 551/551 | 0.475 | +0.197 | -0.024 | -0.08 | flat |
|   10 | AgWR             | quality | 342/551 | 0.475 | +0.169 | -0.056 | -0.75 | flat |
|   11 | netCLV           | quality | 545/551 | 0.476 | -0.101 | -0.038 | -0.88 | flat |
|   12 | proven A         | depth   | 551/551 | 0.476 | +0.340 | +0.022 | +0.05 | flat |
|   13 | CLV ForN         | depth   | 550/551 | 0.521 | +0.309 | +0.067 | +0.25 | flat |
|   14 | #F sharps        | depth   | 551/551 | 0.520 | +0.318 | +0.074 | +0.34 | flat |
|   15 | #F − #A          | depth   | 551/551 | 0.515 | +0.239 | +0.072 | +0.35 | flat |
|   16 | v12 F count      | depth   | 551/551 | 0.515 | +0.321 | +0.065 | +0.29 | flat |
|   17 | v12 A count      | depth   | 551/551 | 0.488 | +0.175 | -0.007 | -0.02 | flat |
|   18 | CLV AgN          | depth   | 550/551 | 0.488 | +0.173 | -0.016 | -0.05 | flat |
|   19 | ForCLV           | quality | 545/551 | 0.488 | -0.164 | +0.003 | +0.05 | flat |
|   20 | #A sharps        | depth   | 551/551 | 0.489 | +0.185 | -0.002 | -0.01 | flat |
|   21 | proven F−A       | depth   | 551/551 | 0.511 | +0.293 | +0.042 | +0.12 | flat |
|   22 | proven F         | depth   | 551/551 | 0.508 | +0.387 | +0.055 | +0.17 | flat |
|   23 | unopposed (A=0)  | depth   | 551/551 | 0.508 | +0.267 | +0.032 | +0.03 | flat |
|   24 | WA ForN          | depth   | 551/551 | 0.496 | +0.318 | +0.042 | +0.15 | flat |
|   25 | TopAg WR         | quality | 342/551 | 0.498 | +0.124 | -0.018 | -0.31 | flat |

### (C) Working read

_N=551 is still early — treat ranks as hypotheses, not gates._

- **V12 forMean** — AUC 0.553 · Δ +5.78 · higher on WINs (cov 551/551)
- **V12 agMean** — AUC 0.449 · Δ +0.35 · higher on LOSSes (cov 551/551)
- **EDGE** — AUC 0.551 · Δ +2.28 · higher on WINs (cov 528/551)
- **V12 score** — AUC 0.550 · Δ +0.02 · higher on WINs (cov 551/551)
- **TopFor WR** — AUC 0.544 · Δ +1.64 · higher on WINs (cov 528/551)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1046 | 251 | 251 | 246 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 35 | 20-15 | 57.1% | 102.40u | +12.98u | +12.7% | -0.6 |
| on→off | 10 | 4-6 | 40.0% | 32.20u | -6.86u | -21.3% | -2.7 |
| off→on | 35 | 26-9 | 74.3% | 90.20u | +44.74u | +49.6% | +2.3 |
| off→off | 166 | 92-74 | 55.4% | 430.80u | +19.68u | +4.6% | -0.7 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 158 | 85-73 | 53.8% | 464.60u | +12.61u | +2.7% |
| 0–2 | 62 | 40-22 | 64.5% | 146.10u | +51.45u | +35.2% |
| 2–4 | 11 | 9-2 | 81.8% | 25.40u | +11.28u | +44.4% |
| 4+ | 15 | 8-7 | 53.3% | 19.50u | -4.80u | -24.6% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 3 | 2-1 | 66.7% | 6.00u | +0.41u | +6.8% |
| gold, limits flat | 7 | 5-2 | 71.4% | 20.30u | +14.59u | +71.9% |
| steam, not gold | 60 | 39-21 | 65.0% | 166.30u | +42.72u | +25.7% |
| limits↑, no steam | 6 | 3-3 | 50.0% | 15.40u | +3.23u | +21.0% |
| neither | 170 | 93-77 | 54.7% | 447.60u | +9.59u | +2.1% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 65 | 44-21 | 67.7% | 184.60u | +58.77u | +31.8% |
| A/B + no steam | 161 | 91-70 | 56.5% | 414.20u | +33.44u | +8.1% |
| A/B + steam arriving | 34 | 26-8 | 76.5% | 89.20u | +45.74u | +51.3% |
| A/B + gold | 9 | 6-3 | 66.7% | 23.30u | +13.57u | +58.2% |
| steam at lock, no A/B | 5 | 2-3 | 40.0% | 8.00u | -1.05u | -13.1% |
| Source B + steam arriving | 33 | 26-7 | 78.8% | 87.20u | +47.74u | +54.7% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| CFB   | 3n · 66.7% · -14.7%    | —                      | —                      | 3n · 66.7% · -14.7%    |
| MLB   | 403n · 54.1% · +6.1%   | 95n · 55.8% · +2.5%    | 300n · 52.7% · +6.2%   | 798n · 53.8% · +5.7%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 10n · 60.0% · +7.9%    | 3n · 66.7% · -28.0%    | 2n · 50.0% · -5.4%     | 15n · 60.0% · -0.8%    |
| NHL   | 2n · 100.0% · +76.0%   | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 6n · 83.3% · +38.2%    |
| SOC   | 53n · 67.9% · +15.9%   | —                      | —                      | 53n · 67.9% · +15.9%   |
| UFC   | 34n · 76.5% · +16.6%   | —                      | —                      | 34n · 76.5% · +16.6%   |
| WNBA  | 27n · 74.1% · +3.2%    | 19n · 42.1% · +1.0%    | 15n · 46.7% · -10.3%   | 61n · 57.4% · -0.5%    |
| **All** | **537n · 57.7% · +7.9%** | **121n · 54.5% · +3.4%** | **322n · 52.5% · +5.5%** | **980n · 55.6% · +6.5%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **1611** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 1611 |
| Muted W-L                           |              784-827 |
| Muted Win %                         |                48.7% |
| Counterfactual PnL at flat 1u       |              -100.95 |
| Counterfactual ROI at flat 1u       |                -6.3% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-100.95u** at a flat 1u stake — a counterfactual ROI of **-6.3%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
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
| 2026-09-07 | MLB   | ML     | Philadelphia Phillies   |  -184 | +0.532 | CONFIRMED-Q1 |   7/4 |   6/4 |  56.4 |   61.0 |   +2.6 |  1.48 | HOLD     | 3.00u | WIN     |      +1.63 |
| 2026-09-07 | MLB   | ML     | Toronto Blue Jays       |  -205 | +0.541 | CONFIRMED-Q1 |   8/2 |   8/2 |  57.9 |   58.3 |   +6.8 |  1.94 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-07 | MLB   | TOTAL  | Under 9.5               |  -117 | +0.982 | SHARP    |   1/0 |   1/0 |  59.3 |   67.6 |   +9.3 |  2.69 | HOLD     | 3.00u | WIN     |      +2.56 |
| 2026-09-07 | MLB   | TOTAL  | Over 9.5                |  +105 | +0.192 | CONFIRMED-Q1 |  15/6 |  11/5 |  55.7 |   63.3 |   +2.7 |  1.76 | HOLD     | 3.00u | WIN     |      +3.15 |
| 2026-09-07 | MLB   | TOTAL  | Under 9.5               |  -100 | +0.221 | CONFIRMED-Q1 |  10/7 |   9/5 |  55.0 |   63.1 |   +4.6 |  1.65 | HOLD     | 3.00u | WIN     |      +3.00 |
| 2026-09-07 | MLB   | TOTAL  | Under 8.5               |  +113 | +0.477 | CONFIRMED-Q1 |   2/3 |   1/2 |  59.6 |   60.4 |   +7.1 |  1.93 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-06 | MLB   | ML     | Boston Red Sox          |  -134 | +0.474 | CONFIRMED-Q1 |   7/3 |   6/1 |  54.7 |   59.4 |   +5.9 |  0.85 | HOLD     | 3.00u | WIN     |      +2.24 |
| 2026-09-06 | MLB   | ML     | Detroit Tigers          |  +141 | +0.113 | CONFIRMED-Q1 |  10/8 |   7/7 |  54.3 |   62.1 |   -1.3 |  0.87 | HOLD     | 2.50u | LOSS    |      -2.50 |
| 2026-09-06 | MLB   | ML     | Milwaukee Brewers       |  -146 | +0.739 | CONFIRMED-Q1 |   8/6 |   7/4 |  57.5 |   47.8 |   +7.8 | -0.76 | MUTE     | 3.00u | LOSS    |      -3.00 |
| 2026-09-06 | MLB   | TOTAL  | Under 7.5               |  -117 | +0.957 | CONFIRMED-Q1 |   5/2 |   5/1 |  52.3 |   57.6 |   -1.6 | -2.06 | MUTE     | 3.00u | WIN     |      +2.56 |
| 2026-09-06 | MLB   | TOTAL  | Over 7.5                |  -127 | +0.044 | SHARP    |   1/2 |   1/1 |  58.2 |   66.7 |   +8.5 |  2.83 | HOLD     | 3.00u | WIN     |      +2.36 |
| 2026-09-06 | MLB   | TOTAL  | Over 7.5                |  -127 | +0.990 | CONFIRMED-Q1 |   2/0 |   2/1 |  55.4 |   68.6 |   +5.4 |  2.07 | HOLD     | 3.00u | WIN     |      +2.36 |
| 2026-09-06 | MLB   | TOTAL  | Over 8.5                |  +107 | +0.910 | CONFIRMED-Q1 |   5/1 |   3/0 |  52.1 |   56.7 |   +6.4 | -0.14 | MUTE     | 3.00u | WIN     |      +3.21 |
| 2026-09-05 | CFB   | ML     | James Madison           |  -203 | +0.996 | CONFIRMED-Q1 |   1/0 |   1/0 |  48.5 |   62.8 |   -1.5 | -0.17 | HOLD     | 2.00u | WIN     |      +0.99 |
| 2026-09-05 | CFB   | ML     | California              |  +129 | +0.202 | SHARP    |   2/3 |   1/3 |  66.7 |   64.7 |   +7.7 |  2.84 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-05 | MLB   | ML     | Boston Red Sox          |  -132 | +0.985 | 2-for-0  |   5/0 |   5/0 |  53.5 |   51.5 |   +3.5 | -0.86 | HOLD     | 3.00u | WIN     |      +2.27 |
| 2026-09-05 | MLB   | ML     | Cincinnati Reds         |  +138 | +0.993 | CONFIRMED-UNOPP |   1/1 |   1/0 |  49.1 |   60.0 |   -0.9 | -0.48 | MUTE     | 2.00u | WIN     |      +2.76 |
| 2026-09-05 | MLB   | ML     | San Francisco Giants    |  +142 | +0.515 | CONFIRMED-Q1 |   5/4 |   5/4 |  56.7 |   64.5 |   +3.0 |  2.73 | HOLD     | 2.00u | WIN     |      +2.84 |
| 2026-09-05 | SOC   | ML     | Hull City AFC           |  +338 | +0.990 | CONFIRMED-UNOPP |   2/2 |   2/0 |  49.0 |   58.4 |   -1.0 | -0.74 | MUTE     | 2.00u | LOSS    |      -2.00 |
| 2026-09-05 | UFC   | ML     | Felipe Lima             |  -196 | +0.054 | SHARP    |   3/1 |   1/1 |  77.5 |   83.5 |  +15.0 |  6.93 | BOOST    | 5.40u | WIN     |      +2.76 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.538 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.072 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.019 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.008 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.034 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return |  975 |    +0.0694 |    -0.0305 | 0.0003 |  +0.018 |   0.947 | positive (higher score ⇒ better outcome)                 |
| won (binary)        |  975 |    +0.0670 |    +0.5002 | 0.0011 |  +0.034 |   0.497 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    |  975 |    -0.1614 |    +0.3108 | 0.0002 |  -0.014 |   2.833 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 975 |          +0.083 |           +0.080 |                   +0.046 |                   +0.034 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 975 |          +0.006 |           +0.334 |                   +0.016 |                   +0.127 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 975 |          +0.038 |           +0.228 |                   +0.017 |                   +0.069 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 975 |          -0.013 |           +0.179 |                   +0.016 |                   +0.106 | count of contributing AGAINST-side wallets                     |
| provenFor         | 975 |          +0.033 |           +0.218 |                   +0.026 |                   +0.098 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 975 |          +0.009 |           +0.161 |                   +0.026 |                   +0.081 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 5.050          | 325 | 174-151 |   53.5% |     +0.3% |
| MID (p33–p67)     | 19.950 … 15.620        | 325 | 180-145 |   55.4% |     +0.9% |
| HIGH (> p67)      | 48.906 … 45.696        | 325 | 188-137 |   57.8% |     +1.5% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |       975 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8322 | average score across live picks                                 |
| SD                |    0.2500 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.813 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +2.122 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.395 / +0.958 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.018 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| CFB   |    3 | 2-1    |   66.7% |    -14.7% |  1.000 |        +0.500 | strong (N<20)                             |
| MLB   |  794 | 427-367 |   53.8% |     +5.6% |  0.518 |        -0.078 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   15 | 9-6    |   60.0% |     -0.8% |  0.630 |        -0.104 | strong (N<20)                             |
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
    x-axis ["08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08"]
    y-axis "AUC" 0.4 --> 0.7
    line [0.515, 0.538, 0.599, 0.596, 0.581, 0.594, 0.619, 0.586, 0.558, 0.538, 0.587, 0.659, 0.591, 0.588]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08"]
    y-axis "edge (pp)" -3 --> 22
    line [-0.6, 3, -1.2, -0.5, -0.2, 0.3, 3.3, 2.4, 2.9, 12.4, 15.5, 20.9, 20.6, 13.5]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-08-26 |    7 |  114 | 62-52  |   54.4% |     +3.8% |  0.515 |      -0.6pp |
| 2026-08-27 |    7 |  111 | 65-46  |   58.6% |     +9.8% |  0.538 |      +3.0pp |
| 2026-08-28 |    7 |  115 | 64-51  |   55.7% |     +1.0% |  0.599 |      -1.2pp |
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

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.529 avg in first half → 0.538 avg in second half · Δ = +0.010)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +6.5% | [-0.4%, +12.7%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          55.6% | [52.2%, 58.7%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.538 | [0.501, 0.576]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |            110 | [43, 169]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                       980 |
| Unique wallets ever on a FOR side            |                                                       288 |
| Avg FOR-side wallets per pick                |                                                      2.92 |
| Top-5 wallets' share of all FOR appearances  |                                                     21.6% |
| Top-10 wallets' share of all FOR appearances |                                                     36.7% |
| Top-20 wallets' share of all FOR appearances |                                                     52.1% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4b912c  | MLB,NFL,SOC,WNBA |  171 |   56 | 94-77  |   55.0% |    +13.4% |    +54.95 |     1.52× | CONFIRMED   |     -4.0% |     569 | 2026-09-08 |
|    2 | 0cd77e  | MLB,SOC,UFC,WNBA |  155 |   25 | 85-70  |   54.8% |    +13.6% |    +58.90 |     1.59× | CONFIRMED   |     -3.2% |     373 | 2026-09-08 |
|    3 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  102 |   63 | 65-37  |   63.7% |    +16.6% |    +56.36 |     1.54× | CONFIRMED   |     +7.4% |     344 | 2026-09-07 |
|    4 | cd2f63  | MLB,NBA,NFL,SOC,WNBA |   97 |   52 | 54-43  |   55.7% |    +16.7% |    +46.02 |     1.04× | CONFIRMED   |     +7.7% |     573 | 2026-09-08 |
|    5 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | CONFIRMED   |     +5.5% |     201 | 2026-07-05 |
|    6 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   93 |   70 | 45-48  |   48.4% |     -1.6% |     -4.08 |     1.23× | CONFIRMED   |     +1.5% |     486 | 2026-09-07 |
|    7 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     336 | 2026-08-05 |
|    8 | 0f9d74  | CFB,MLB,NBA,NFL,SOC,UFC |   87 |   62 | 48-39  |   55.2% |    +12.4% |    +26.90 |     0.48× | CONFIRMED   |    +10.4% |     400 | 2026-09-06 |
|    9 | 2f2a9e  | MLB,SOC,WNBA |   84 |   32 | 44-40  |   52.4% |     -6.7% |    -15.05 |     1.99× | CONFIRMED   |     -9.0% |     299 | 2026-09-07 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | CONFIRMED   |     -4.3% |     502 | 2026-07-10 |
|   11 | 7923c4  | MLB,NBA,UFC |   59 |   16 | 36-23  |   61.0% |    +28.8% |    +42.47 |     0.93× | CONFIRMED   |    +10.7% |     238 | 2026-09-06 |
|   12 | 705ba1  | MLB        |   55 |   36 | 27-28  |   49.1% |     -0.1% |     -0.13 |     1.13× | CONFIRMED   |     +7.0% |     271 | 2026-09-08 |
|   13 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   54 |   66 | 26-28  |   48.1% |     -5.7% |     -8.76 |     3.77× | CONFIRMED   |     -7.4% |     314 | 2026-09-08 |
|   14 | 3bdd7e  | CFB,MLB,NFL,SOC,WNBA |   48 |   21 | 31-17  |   64.6% |    +23.1% |    +22.13 |     2.79× | CONFIRMED   |     -8.1% |     196 | 2026-09-08 |
|   15 | bc35e3  | MLB,SOC,UFC,WNBA |   46 |   26 | 22-24  |   47.8% |     +1.5% |     +1.95 |     1.16× | CONFIRMED   |     -6.2% |     206 | 2026-09-04 |
|   16 | 621848  | MLB,SOC,UFC,WNBA |   43 |   12 | 26-17  |   60.5% |     +1.0% |     +1.27 |     0.58× | CONFIRMED   |     +7.4% |     117 | 2026-09-03 |
|   17 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 |   23 | 20-17  |   54.1% |     -1.6% |     -1.88 |     1.36× | CONFIRMED   |    +11.8% |     148 | 2026-09-02 |
|   18 | 69f882  | MLB,SOC,UFC,WNBA |   36 |   23 | 26-10  |   72.2% |    +21.0% |    +21.49 |     3.24× | CONFIRMED   |    +11.1% |     147 | 2026-09-08 |
|   19 | a82a75  | MLB,SOC,UFC |   33 |   23 | 17-16  |   51.5% |     +2.6% |     +2.74 |     0.92× | CONFIRMED   |    -12.1% |     124 | 2026-08-15 |
|   20 | 9214c2  | MLB        |   31 |    1 | 15-16  |   48.4% |    +12.3% |     +9.65 |     1.12× | CONFIRMED   |     +4.7% |      98 | 2026-09-08 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 62941a  | MLB,NFL    |   12 | 9-3    |   75.0% |     +65.8% |    +20.67 |     0.74× | 2026-09-07 |
|    2 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    3 | d66e28  | MLB,WNBA   |   17 | 13-4   |   76.5% |     +57.1% |    +24.73 |     0.75× | 2026-09-07 |
|    4 | 579e12  | MLB        |   13 | 9-4    |   69.2% |     +53.2% |    +19.09 |     0.65× | 2026-09-07 |
|    5 | aa894c  | MLB        |   16 | 11-5   |   68.8% |     +45.5% |    +17.47 |     0.78× | 2026-09-08 |
|    6 | ba8492  | MLB        |   10 | 7-3    |   70.0% |     +44.3% |    +12.80 |     1.86× | 2026-09-08 |
|    7 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    8 | 2cbcf8  | MLB,UFC    |   14 | 10-4   |   71.4% |     +43.5% |    +22.77 |     1.13× | 2026-09-02 |
|    9 | 4c8ed9  | MLB,SOC,UFC,WNBA |   19 | 12-7   |   63.2% |     +43.5% |    +14.08 |     2.86× | 2026-09-08 |
|   10 | e8e2cc  | MLB,NFL,WNBA |   16 | 12-4   |   75.0% |     +39.9% |    +19.08 |     1.07× | 2026-09-08 |
|   11 | 2dc4f6  | MLB,WNBA   |   10 | 6-4    |   60.0% |     +38.5% |     +9.40 |     0.69× | 2026-09-07 |
|   12 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|   13 | f2d227  | MLB,NBA    |   11 | 8-3    |   72.7% |     +34.5% |     +9.20 |     0.78× | 2026-08-17 |
|   14 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   15 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    2 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    3 | 2a8409  | MLB,WNBA   |   17 | 6-11   |   35.3% |     -21.6% |     -6.91 |     1.60× | 2026-09-08 |
|    4 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|    5 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|    6 | c9bba3  | MLB,NFL,SOC |   18 | 11-7   |   61.1% |      -8.7% |     -3.39 |     0.77× | 2026-09-08 |
|    7 | ac9705  | MLB,WNBA   |   22 | 10-12  |   45.5% |      -7.6% |     -6.00 |     2.16× | 2026-09-03 |
|    8 | 2f2a9e  | MLB,SOC,WNBA |   84 | 44-40  |   52.4% |      -6.7% |    -15.05 |     1.99× | 2026-09-07 |
|    9 | 7da3d5  | MLB,NFL,SOC,UFC,WNBA |   54 | 26-28  |   48.1% |      -5.7% |     -8.76 |     3.77× | 2026-09-08 |
|   10 | ad88a3  | MLB,SOC    |   21 | 11-10  |   52.4% |      -2.9% |     -2.11 |     0.29× | 2026-08-21 |
|   11 | bc44b0  | MLB,NBA,NHL,SOC,WNBA |   37 | 20-17  |   54.1% |      -1.6% |     -1.88 |     1.36× | 2026-09-02 |
|   12 | eeabaf  | MLB,NBA,NFL,SOC,UFC |   93 | 45-48  |   48.4% |      -1.6% |     -4.08 |     1.23× | 2026-09-07 |
|   13 | 705ba1  | MLB        |   55 | 27-28  |   49.1% |      -0.1% |     -0.13 |     1.13× | 2026-09-08 |
|   14 | 621848  | MLB,SOC,UFC,WNBA |   43 | 26-17  |   60.5% |      +1.0% |     +1.27 |     0.58× | 2026-09-03 |
|   15 | 4c64aa  | MLB        |   92 | 50-42  |   54.3% |      +1.1% |     +1.94 |     0.84× | 2026-08-05 |

> 🔴 **3 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 84, ROI -6.7%), `7da3d5` (FOR# 54, ROI -5.7%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  2320 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   638 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |     4 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |   104 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   379 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            319 |        83 |   32 |   20 |  184 |                    135 |
| NBA   |            211 |        59 |   25 |   23 |  104 |                    107 |
| NHL   |            105 |        27 |    6 |   17 |   55 |                     50 |
| SOC   |            298 |        81 |   46 |   20 |  151 |                    147 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |  101 |    980 | 1611 | 545-435 |  55.6% |      6.5% |    +174.91 |    +0.18 | 0.518 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | +  920 |    +2.3pp |    +15.5pp |          +0.351 |   -0.031 |    +0.0902 | 🟡 mixed |
| v12 − v10          | +  918 |    +7.2pp |    +25.3pp |          +0.492 |   +0.124 |    +0.0306 | 🟢 better |
| v12 − v11          | +  869 |    +0.7pp |     +3.7pp |          +0.118 |   +0.074 |    +0.0144 | 🟢 better |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | CFB            | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | —              | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | —              | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | —              | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 3n 66.7% -15%  | 798n 53.8% +6% | 10n 30.0% +29% | 15n 60.0% -1%  | 6n 83.3% +38%  | 53n 67.9% +16% | 34n 76.5% +17% | 61n 57.4% -0%  | 980n 55.6% +7% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 191n +7%      | 262n +4%      | 214n +9%      | 129n -1%      | 179n +12%     | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~2873 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1214 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 975 / 1214 (80%)  | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 975 / 1214 (80%)  | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 975 / 1214 (80%)  | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 975 / 1214 (80%)  | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 975 / 1214 (80%)  | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 975 / 1214 (80%)  | Count of proven AGAINST-side wallets                                 |
| countMargin          | 975 / 1214 (80%)  | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1214 / 1214 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1214 / 1214 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1214 / 1214 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1214 / 1214 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1214 / 1214 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1214 / 1214 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1207 / 1214 (99%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1205 / 1214 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1214 / 1214 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1213 / 1214 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 760 / 1214 (63%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1213 / 1214 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 760 / 1214 (63%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 759 / 1214 (63%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1214 / 1214 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1214 / 1214 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1214 / 1214 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1213 / 1214 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1214 / 1214 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 760 |      |    +0.032 |    +0.271 |      +0.057 |      +0.135 |  0.520 |
|    2 | V12 forMean          | 975 |  🟢  |    +0.083 |    +0.080 |      +0.046 |      +0.034 |  0.536 |
|    3 | qMargin              | 975 |  🟢  |    +0.084 |    +0.031 |      +0.043 |      +0.009 |  0.531 |
|    4 | wd maxForContrib     | 1213 |      |    -0.045 |    -0.100 |      -0.039 |      -0.046 |  0.488 |
|    5 | wd sizeMargin        | 759 |      |    -0.008 |    -0.005 |      -0.036 |      -0.057 |  0.499 |
|    6 | wd contribMargin     | 1214 |      |    -0.005 |    -0.085 |      -0.032 |      -0.081 |  0.484 |
|    7 | wd agAvgSize         | 760 |      |    +0.011 |    +0.007 |      +0.032 |      +0.034 |  0.503 |
|    8 | lockPinnProb         | 1207 |      |    +0.195 |    +0.167 |      +0.028 |      -0.128 |  0.603 |
|    9 | clv                  | 1205 |      |    -0.021 |    +0.072 |      -0.021 |      +0.024 |  0.520 |
|   10 | agsV12               | 975 |  🟢  |    +0.034 |    -0.019 |      +0.018 |      -0.008 |  0.538 |
|   11 | V12 forCount         | 975 |  🟢  |    +0.038 |    +0.228 |      +0.017 |      +0.069 |  0.515 |
|   12 | wd contribFor        | 1214 |      |    -0.008 |    -0.040 |      -0.017 |      -0.037 |  0.488 |
|   13 | wd contribAg         | 1214 |      |    -0.005 |    +0.130 |      +0.017 |      +0.061 |  0.492 |
|   14 | V12 agMean           | 975 |  🟢  |    +0.006 |    +0.334 |      +0.016 |      +0.127 |  0.466 |
|   15 | V12 agCount          | 975 |  🟢  |    -0.013 |    +0.179 |      +0.016 |      +0.106 |  0.497 |
|   16 | hcMargin             | 1214 |      |    +0.012 |    +0.238 |      -0.015 |      +0.072 |  0.510 |
|   17 | ags (v11)            | 1214 |      |    +0.010 |    +0.085 |      -0.014 |      -0.004 |  0.521 |
|   18 | wd maxShare          | 1214 |      |    +0.015 |    -0.068 |      +0.011 |      -0.019 |  0.506 |
|   19 | provenAg             | 1214 |      |    -0.006 |    +0.170 |      +0.008 |      +0.076 |  0.488 |
|   20 | wd forCount          | 1213 |      |    +0.022 |    +0.159 |      +0.008 |      +0.028 |  0.498 |
|   21 | countMargin          | 975 |      |    +0.048 |    +0.147 |      +0.007 |      +0.010 |  0.511 |
|   22 | wd forAvgSize        | 1213 |      |    +0.012 |    +0.063 |      -0.007 |      +0.003 |  0.519 |
|   23 | provenMargin         | 1214 |      |    +0.011 |    +0.118 |      -0.007 |      +0.020 |  0.502 |
|   24 | peakStars            | 1214 |      |    +0.026 |    +0.063 |      +0.005 |      -0.006 |  0.510 |
|   25 | provenTotal          | 1214 |      |    +0.000 |    +0.063 |      +0.004 |      +0.019 |  0.496 |
|   26 | provenFor            | 1214 |      |    +0.005 |    +0.111 |      -0.000 |      +0.022 |  0.500 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.057), `V12 forMean` (r = +0.046), `qMargin` (r = +0.043).

> 🟡 **Highest-ranked feature NOT used by V12:** `wd agCount` — r(unit-ret) = +0.057, AUC = 0.520. If this stays at the top of the table after another month of picks, V12 should be revised to incorporate it.

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.057 · AUC = 0.520

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 356 | 190-166 |   53.4% |     -0.6% |
| MID (p33–p67)     | 2.000 … 2.000            | 182 | 95-87   |   52.2% |     -1.2% |
| HIGH (> p67)      | 3.000 … 9.000            | 222 | 129-93  |   58.1% |     +3.6% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `V12 forMean` · r(unit-ret) = +0.046 · AUC = 0.536

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 5.050            | 325 | 174-151 |   53.5% |     +0.3% |
| MID (p33–p67)     | 19.950 … 15.620          | 325 | 180-145 |   55.4% |     +0.9% |
| HIGH (> p67)      | 48.906 … 45.696          | 325 | 188-137 |   57.8% |     +1.5% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `qMargin` · r(unit-ret) = +0.043 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 8.995            | 325 | 178-147 |   54.8% |     +1.2% |
| MID (p33–p67)     | 19.950 … 13.137          | 325 | 175-150 |   53.8% |     +0.3% |
| HIGH (> p67)      | 46.556 … 45.696          | 325 | 189-136 |   58.2% |     +1.4% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd maxForContrib` · r(unit-ret) = -0.039 · AUC = 0.488

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 33.700 … 31.000          | 406 | 228-178 |   56.2% |     +1.6% |
| MID (p33–p67)     | 52.400 … 41.400          | 404 | 223-181 |   55.2% |     +0.6% |
| HIGH (> p67)      | 100.000 … 74.000         | 403 | 218-185 |   54.1% |     -0.0% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd sizeMargin` · r(unit-ret) = -0.036 · AUC = 0.499

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -3.393          | 253 | 141-112 |   55.7% |     +1.9% |
| MID (p33–p67)     | 0.078 … 0.439            | 253 | 133-120 |   52.6% |     +0.6% |
| HIGH (> p67)      | 3.728 … 1.431            | 253 | 140-113 |   55.3% |     -1.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | V12 forMean    | qMargin        | wd maxForContrib | wd sizeMargin  | wd contribMargin | wd agAvgSize   | lockPinnProb   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         +0.137 |         +0.004 |         +0.286 |         +0.027 |         -0.137 |         +0.095 |         -0.063 |
| V12 forMean |         +0.137 |  1.000         |         +0.948 |         +0.194 |         +0.221 |         +0.085 |         -0.033 |         +0.111 |
| qMargin     |         +0.004 |         +0.948 |  1.000         |         +0.147 |         +0.204 |         +0.066 |         -0.049 |         +0.118 |
| wd maxForContrib |         +0.286 |         +0.194 |         +0.147 |  1.000         |         +0.261 |         +0.510 |         +0.052 |         +0.047 |
| wd sizeMargin |         +0.027 |         +0.221 |         +0.204 |         +0.261 |  1.000         |         +0.271 |         -0.756 |         +0.152 |
| wd contribMargin |         -0.137 |         +0.085 |         +0.066 |         +0.510 |         +0.271 |  1.000         |         -0.147 |         +0.194 |
| wd agAvgSize |         +0.095 |         -0.033 |         -0.049 |         +0.052 |         -0.756 |         -0.147 |  1.000         |         -0.089 |
| lockPinnProb |         -0.063 |         +0.111 |         +0.118 |         +0.047 |         +0.152 |         +0.194 |         -0.089 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.948. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 639 picks · features = 8 (+ intercept) · multiple R² = **0.0109** · adjusted R² = **-0.0033** · residual sd = 0.952

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd agCount           |     |    +0.0656 |   0.0460 | +1.43        |        1 |
|    2 | qMargin              |  🟢 |    +0.0549 |   0.1305 | +0.42        |        2 |
|    3 | wd agAvgSize         |     |    +0.0315 |   0.0643 | +0.49        |        3 |
|    4 | wd maxForContrib     |     |    -0.0224 |   0.0527 | -0.42        |        4 |
|    5 | wd sizeMargin        |     |    -0.0167 |   0.0674 | -0.25        |        5 |
|    6 | wd contribMargin     |     |    -0.0109 |   0.0487 | -0.22        |        6 |
|    7 | lockPinnProb         |     |    +0.0074 |   0.0390 | +0.19        |        7 |
|    8 | V12 forMean          |  🟢 |    +0.0053 |   0.1326 | +0.04        |        8 |
| —    | (intercept)          |     |    +0.0295 |   0.0377 |    +0.78 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.055), `V12 forMean` (β = +0.005)
- V12 IGNORES: `wd agCount` (β = +0.066, t = +1.43), `wd agAvgSize` (β = +0.032, t = +0.49), `wd maxForContrib` (β = -0.022, t = -0.42), `wd sizeMargin` (β = -0.017, t = -0.25), `wd contribMargin` (β = -0.011, t = -0.22), `lockPinnProb` (β = +0.007, t = +0.19)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.540 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.558 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.018.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Inputs V12 currently uses but that show weak multivariate signal: `V12 forMean`. They may be contributing noise rather than information.
- Adjusted R² of -0.0033 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*