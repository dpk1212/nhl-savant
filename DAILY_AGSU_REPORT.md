# AGS-Unified — V12 Daily Monitor

**Generated:** Saturday, October 3, 2026 at 12:37 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (125 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (125 days ago), V12 has evaluated **4914** picks, shipped **1189** for real money (24.2% ship rate), and muted the other **3725**. On the shipped picks V12 has gone **651-538** (54.8% win), staked **3348.05u**, and returned **+157.13u** at **+4.7% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                            125 |
| Picks V12 has evaluated             |                           4914 |
| Picks SHIPPED (units > 0)           |                           1189 |
| Picks MUTED (score ≤ 0, FADE)       |                           3725 |
| Ship rate                           |                          24.2% |
| Live W-L                            |                        651-538 |
| Live Win %                          |                          54.8% |
| Live PnL (units)                    |                        +157.13 |
| Live ROI                            |                          +4.7% |
| Avg PnL / day                       |                         +1.26u |
| Most recent action (2026-10-04)  |            0 live, 0-0, +0.00u |

### What's working

- V12 is profitable at **4.7% ROI** across 1189 live picks (+157.13u real PnL).
- Mute rule is **saving money** — the 2541 muted picks would have lost -79.83u at flat 1u (-3.1% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.26u/day** on average since launch.
- Best sport: **NBA** — 10 live, 3-7, 29.1% ROI, +2.33u.
- Tape era (2026-07-15+): **415-345** · +5.1% ROI · +110.52u on 760 graded — see § 5.

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

**Full book:** 125d · 1189 live · 651-538 · **+157.13u** · +4.7% ROI · +1.26u/day.

_Prior to table (2026-06-01 → 2026-09-13): 1034 live · 573-461 · +185.81u · cum through prior = +185.81u._

Last **21** calendar days with activity. **Live** = units > 0 · **Muted** = graded FADE / 0u · **Cum PnL** = running total since V12 launch.

| Date       | Evaluated | Live | Muted | W-L (live) | Win %  | Stake (u) | PnL (u)    | ROI       | Cum PnL    |
|------------|-----------|------|-------|------------|--------|-----------|------------|-----------|------------|
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
| 2026-09-24 |        58 |    9 |    29 | 4-5        |  44.4% |     33.00 |      -6.37 |    -19.3% |    +152.01 |
| 2026-09-25 |        60 |    9 |    41 | 4-5        |  44.4% |     31.00 |      -5.35 |    -17.3% |    +146.66 |
| 2026-09-26 |       180 |   18 |   116 | 11-7       |  61.1% |     60.40 |      +3.02 |      5.0% |    +149.68 |
| 2026-09-27 |        74 |   15 |    39 | 7-8        |  46.7% |     38.90 |      -3.24 |     -8.3% |    +146.44 |
| 2026-09-28 |         6 |    0 |     3 | 0-0        |      — |      0.00 |      +0.00 |         — |    +146.44 |
| 2026-09-29 |        16 |    2 |    10 | 2-0        | 100.0% |      4.00 |      +4.26 |    106.5% |    +150.70 |
| 2026-09-30 |        13 |    1 |     8 | 1-0        | 100.0% |      2.00 |      +1.64 |     82.0% |    +152.34 |
| 2026-10-01 |        18 |    6 |    10 | 4-2        |  66.7% |     19.90 |      +5.37 |     27.0% |    +157.71 |
| 2026-10-02 |        14 |    6 |     6 | 3-3        |  50.0% |     23.40 |      -0.58 |     -2.5% |    +157.13 |
| 2026-10-03 |        79 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +157.13 |
| 2026-10-04 |         3 |    0 |     0 | 0-0        |      — |      0.00 |      +0.00 |         — |    +157.13 |

> **Trajectory.** 🟡 Last 3 days (-2.5% ROI) **-7.2pp** vs prior (4.7%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-10-02**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 25 | 18-7 | +41.4% | +43.46u | +1.74u | +64.2% |
| 🟢 2 | MINI- (gate-cut) | C | 24 | 15-9 | +28.1% | +11.21u | +0.47u | +90.0% |
| 🟢 3 | DISSENT rescue | D | 26 | 15-11 | +20.4% | +5.77u | +0.22u | +90.7% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 145 | 90-55 | +10.3% | +70.04u | sized UP after path |
| 2 | Tape HOLD (mid) | 539 | 289-250 | +4.6% | +61.77u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 33 | 14-19 | -36.8% | -26.68u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 93 | 41-52 | -8.0% | -7.42u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 272 | 141-131 | -2.9% | -7.87u | 🟡 flat |
| 3 | Score FADE (≤0 → 0u) | 1245 | 627-618 | -0.0% | -0.50u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 25 | 18-7 | 72.0% | 105.0u | +43.46u | +41.4% | +1.74u | 1 | +64.2% | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 117 | 69-48 | 59.0% | 431.5u | +18.79u | +4.4% | +0.16u | 10 | -3.7% | -8.00u | 🟡 flat |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 128 | 72-56 | 56.3% | 460.5u | +34.78u | +7.6% | +0.27u | 11 | -38.2% | +3.77u | 🔻 cooling |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 94 | 44-50 | 46.8% | 326.8u | -24.88u | -7.6% | -0.26u | 0 | — | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 123 | 63-60 | 51.2% | 341.8u | -3.21u | -0.9% | -0.03u | 6 | -2.3% | — | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 119 | 68-51 | 57.1% | 329.3u | +22.94u | +7.0% | +0.19u | 8 | +19.2% | +2.11u | 🟢 OK |
| MINI- (gate-cut) | `MINI-` | C | 1u | 24 | 15-9 | 62.5% | 39.9u | +11.21u | +28.1% | +0.47u | 1 | +90.0% | — | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 26 | 15-11 | 57.7% | 28.4u | +5.77u | +20.4% | +0.22u | 2 | +90.7% | — | 🟢 room |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 145 | 90-55 | 62.1% | 680.0u | +70.04u | +10.3% | 7 | +35.2% | +2.11u |
| Tape HOLD (mid) | TAPE | staked | 539 | 289-250 | 53.6% | 1333.8u | +61.77u | +4.6% | 42 | -11.4% | -0.23u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 33 | 14-19 | 42.4% | 72.5u | -26.68u | -36.8% | 2 | -100.0% | -6.00u |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 272 | 141-131 | 51.8% | 272.0u | -7.87u | -2.9% | 32 | -12.6% | +0.96u |
| fadeTop≥60 MUTE | E | CF 1u | 93 | 41-52 | 44.1% | 93.0u | -7.42u | -8.0% | 11 | -35.6% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 1245 | 627-618 | 50.4% | 1245.0u | -0.50u | -0.0% | 80 | -6.0% | +1.88u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 8 / +52% | 4 / +10% | — |
| TOP | 46 / -3% | 26 / +9% | 5 / -33% |
| RANK | 77 / +5% | 12 / +4% | — |
| SHARP | 22 / -25% | 46 / -1% | 1 / -100% |
| SHARP-LEAN | 92 / -1% | 26 / +2% | 4 / -63% |
| MINI | 63 / -0% | 14 / +51% | 5 / -25% |
| MINI- | 9 / +20% | 2 / +52% | 3 / -5% |
| DISSENT | 15 / +22% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-10-02)

| Path | N | W-L | PnL | ROI |
|------|--:|:---:|----:|----:|
| RANK 2-for-0 rescue | 1 | 1-0 | +3.77u | +94.3% |
| MINI (gate-pass) | 1 | 1-0 | +2.11u | +39.1% |
| HC-1 TOP | 2 | 0-2 | -8.00u | -100.0% |

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  43 | 18-7   |  72.0% |      105.00 |     +43.46 |     41.4% |
| TOP PICK (TOP+/TOP)       |  4-5u | 274 | 84-62  |  57.5% |      564.00 |      +6.85 |      1.2% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER/HARD-UNOPP) | 1.5-6u | 1056 | 185-174 |  51.5% |     1178.05 |      +0.08 |      0.0% |
| STRONG (MINI)             |    3u | 227 | 68-51  |  57.1% |      329.25 |     +22.94 |      7.0% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 193 | 32-23  |  58.2% |       73.25 |     +14.96 |     20.4% |
| **STAKED TOTAL** |     — | 704 | 387-317 |  55.0% |     2249.55 |     +88.29 |     +3.9% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  43 | 18-7   |  72.0% |      105.00 |     +43.46 |     41.4% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 245 | 69-48  |  59.0% |      431.50 |     +18.79 |      4.4% |
| B · 2-for-0 rescue    | RANK        |    4u | 245 | 72-56  |  56.3% |      460.45 |     +34.78 |      7.6% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 610 | 63-60  |  51.2% |      341.84 |      -3.21 |     -0.9% |
| C · proven-$ consensus | SHARP       |    3u | 187 | 44-50  |  46.8% |      326.76 |     -24.88 |     -7.6% |
| A · mini-HC (gate-pass) | MINI        |    3u | 227 | 68-51  |  57.1% |      329.25 |     +22.94 |      7.0% |
| C · mini gate-cut     | MINI-       |    1u |  57 | 15-9   |  62.5% |       39.90 |     +11.21 |     28.1% |
| A · margin 3+         | CONFIRMED   |    1u |  16 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u | 120 | 15-11  |  57.7% |       28.35 |      +5.77 |     20.4% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 791 picks tracked at 0u (would-be 383-408, 48.4% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (30-13, +43.46u)  ·  🟢 TOP PICK (149-125, +6.85u)  ·  🟠 SHARP PLAY (529-527, +0.08u)  ·  🔴 STRONG (120-107, +22.94u)  ·  🟣 LEAN (105-88, +14.96u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26", "09-27", "09-28", "09-29", "09-30", "10-01", "10-02"]
    y-axis "PnL (u)" -14 --> 50
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54, 44.81, 44.81, 44.81, 44.81, 44.81, 41.81, 41.81, 39.81, 39.81, 39.81, 39.81, 39.81, 39.81, 42.11, 42.11, 42.11, 42.11, 42.11, 42.11, 42.11, 39.61, 39.61, 39.61, 43.46, 43.46, 43.46, 43.46, 43.46, 43.46, 43.46]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 8.23, 8.23, 8.23, 8.23, 8.23, 12.11, 10.91, 16.19, 16.19, 16.19, 16.19, 14.85, 6.85]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85, 38.85, 38.79, 38.82, 41.18, 43.74, 44.86, 43.97, 43.97, 42.76, 37.04, 38.07, 38.07, 38.07, 21.67, 21.67, 21.67, 15.67, 15.67, 17.52, 13.52, 13.78, 13.56, 7.55, 0.75, -2.19, -2.19, -2.19, -2.19, -3.69, 0.08]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37, 18.31, 18.31, 18.31, 18.31, 18.31, 21.88, 21.88, 11.88, 7.88, 14.28, 22.4, 22.4, 21.31, 21.31, 21.31, 21.31, 22.23, 17.23, 17.23, 17.23, 17.23, 17.23, 15.23, 17.42, 14.42, 14.42, 14.42, 14.42, 20.83, 22.94]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 10.44, 10.44, 10.44, 10.44, 10.44, 10.44, 10.44, 10.44, 11.52, 11.52, 11.52, 13.16, 14.96, 14.96]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26", "09-27", "09-28", "09-29", "09-30", "10-01", "10-02"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71, 72, 71, 72, 72, 72, 70, 70, 68, 66, 66, 66, 66, 66, 67, 69, 69, 70, 70, 70, 71, 69, 69, 70, 71, 70, 70, 70, 70, 70, 70]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 54, 54, 54, 54, 53, 54, 54, 54, 54, 54, 54, 54, 55, 55, 55, 55, 55, 54]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50, 50, 50, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 49, 49, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57, 57, 57, 56, 55, 55, 56, 55, 54, 54, 55, 56, 56, 56, 56, 56, 56, 56, 55, 55, 54, 55, 55, 55, 52, 52, 52, 52, 52, 52, 53]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 56, 57, 57, 57, 57, 57, 57, 58, 57, 58, 58, 58, 57, 57, 58, 56, 56, 55, 54, 55, 55, 55, 54, 54, 54, 54, 54, 54]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 3602 | 3590 | 3466 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 272 | 141-131 | 51.8% | 69.50u | +3.51u | +5.1% |
| HOLD      | 1220 | 633-587 | 51.9% | 1336.82u | +58.77u | +4.4% |
| BOOST     | 355 | 199-156 | 56.1% | 683.48u | +72.12u | +10.6% |
| FAIL_OPEN | 87 | 45-42 | 51.7% | 74.50u | -25.79u | -34.6% |
| PASS      | 1532 | 768-764 | 50.1% | 13.50u | -1.52u | -11.3% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 1276 | 664-612 | 52.0% | +17.02u |
| hold (0–2.89) | path u | 1446 | 723-723 | 50.0% | +46.64u |
| boost (≥2.89) | ×1.35 | 432 | 237-195 | 54.9% | +70.07u |

_Score coverage: **3154/3466** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 272 | +2.50u | -2.50u | +175.75u | +178.25u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 147 | +48.65u | +72.12u | +23.47u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-10-03 | CFB | Alabama | MINI | 5.89 | BOOST | 4.00u | 5.40u | — |
| 2026-10-03 | CFB | Louisiana Tech | SHARP~ | -4.37 | MUTE | 1.00u | 0.00u | — |
| 2026-10-03 | CFB | UNLV | SHARP~ | -1.52 | MUTE | 1.00u | 1.00u | — |
| 2026-10-03 | CFB | Fresno State | SHARP~ | -0.22 | MUTE | 4.00u | 4.00u | — |
| 2026-10-03 | CFB | Louisville | SHARP | 4.00 | BOOST | 4.00u | 0.00u | — |
| 2026-10-03 | CFB | South Carolina | HC-2 | 5.47 | BOOST | 6.00u | 0.00u | — |
| 2026-10-03 | CFB | Florida State | SHARP~ | -3.64 | MUTE | 4.00u | 4.00u | — |
| 2026-10-03 | MLB | Tampa Bay Rays | SHARP | 5.01 | BOOST | 3.00u | 0.00u | — |
| 2026-10-03 | NHL | Lightning | HC-1 | 4.88 | BOOST | 4.00u | 0.00u | — |
| 2026-10-03 | UFC | Anthony Wint | SHARP | 4.68 | BOOST | 4.00u | 0.00u | — |
| 2026-10-03 | UFC | Jacobe Smith | 2-for-0 | 4.90 | BOOST | 5.00u | 0.00u | — |
| 2026-10-03 | UFC | Esteban Ribovics | SHARP | 4.48 | BOOST | 3.00u | 0.00u | — |
| 2026-10-03 | CFB | Louisiana | HC-1 | 9.51 | BOOST | 4.00u | 4.00u | — |
| 2026-10-03 | CFB | Cincinnati | SHARP | 9.45 | BOOST | 4.00u | 0.00u | — |
| 2026-10-03 | CFB | New Hampshire | SHARP~ | 5.70 | BOOST | 4.00u | 0.00u | — |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.37** · nPriors=680 · source=expanding_q1 · asOf=2026-10-03 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 3156 | 3029 | 2920 | 621 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 243 | 108-135 | 44.4% | 15.00u | -7.29u | -48.6% |
| HOLD      | 624 | 325-299 | 52.1% | 368.00u | +0.85u | +0.2% |
| FAIL_OPEN | 72 | 32-40 | 44.4% | 48.90u | -2.73u | -5.6% |
| EXEMPT    | 1318 | 705-613 | 53.5% | 1216.75u | +89.26u | +7.3% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -249.7 … -3.2 | 116 | 50-66 | 43.1% | 0.0u | +0.00u | — |
| Q2 | -3.2 … 1.3 | 116 | 50-66 | 43.1% | 39.9u | +17.11u | +42.9% |
| Q3 | 1.3 … 6.6 | 116 | 65-51 | 56.0% | 76.3u | -8.17u | -10.7% |
| Q4 | 6.6 … 19.9 | 116 | 58-58 | 50.0% | 102.1u | -29.06u | -28.5% |
| Q5 | 20.2 … 1802.6 | 116 | 68-48 | 58.6% | 109.7u | +18.99u | +17.3% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 243 | 108-135 | -17.48u | +17.48u | +166.40u | +148.92u |

> 🟢 **Mute is saving money** (Δ +17.48u · muted WR 44.4%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 108 | 43-65 | 39.8% | 134.9u | -22.39u |
| CFB | 28 | 13-15 | 46.4% | 51.9u | +12.54u |
| MLB | 147 | 68-79 | 46.3% | 166.5u | -10.17u |
| NFL | 29 | 10-19 | 34.5% | 39.4u | -14.72u |
| SOC | 9 | 4-5 | 44.4% | 12.5u | +2.90u |
| UFC | 1 | 0-1 | 0.0% | 1.0u | -1.00u |
| WNBA | 29 | 13-16 | 44.8% | 33.0u | -7.02u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-10-03 | UFC | Esteban Ribovics | SHARP | -3.9 | -0.4 | 3.00u | pending |
| 2026-10-03 | CFB | Under 45.5 | SHARP~ | -30.1 | -0.4 | 1.00u | pending |
| 2026-09-30 | MLB | Under 6.5 | — | 3.5 | -0.4 | 1.00u | LOSS |
| 2026-09-30 | WNBA | Under 164.5 | SHARP~ | -1.9 | -0.4 | 3.00u | LOSS |
| 2026-09-29 | MLB | Under 8.5 | SHARP~ | -7.7 | -0.4 | 1.00u | LOSS |
| 2026-09-28 | NFL | Eagles | — | -237.8 | -0.4 | 1.00u | LOSS |
| 2026-09-28 | NFL | Under 41.5 | — | -15.9 | -0.4 | 2.00u | WIN |
| 2026-09-27 | NFL | Rams | — | -143.6 | -0.6 | 1.00u | LOSS |
| 2026-09-27 | NFL | Raiders | — | -58.9 | -0.6 | 1.50u | WIN |
| 2026-09-27 | NFL | Rams | WATCH | -227.5 | -0.6 | 1.00u | LOSS |
| 2026-09-27 | MLB | Over 8.5 | WATCH | -1.9 | -0.6 | 1.00u | LOSS |
| 2026-09-26 | CFB | Hawai'i | SHARP~ | -7.8 | -0.7 | 1.00u | LOSS |
| 2026-09-26 | CFB | USC | SHARP~ | -53.6 | -0.7 | 1.00u | LOSS |
| 2026-09-26 | UFC | Sedriques Dumas | CONFIRMED-Q1 | -27.5 | -0.7 | 1.00u | LOSS |
| 2026-09-26 | CFB | Ole Miss | — | 0.0 | -0.7 | 2.00u | LOSS |
| 2026-09-26 | CFB | Missouri State | SHARP | -11.3 | -0.7 | 3.00u | WIN |
| 2026-09-26 | CFB | Nebraska | — | 8.7 | -0.7 | 4.00u | WIN |
| 2026-09-26 | CFB | Boston College | SHARP | -5.3 | -0.7 | 2.50u | WIN |
| 2026-09-26 | MLB | Colorado Rockies | — | 16.5 | -0.7 | 1.00u | WIN |
| 2026-09-26 | MLB | San Francisco Giants | CONFIRMED-UNOPP | -8.8 | -0.7 | 1.00u | WIN |

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 105 | 52-53 | 49.5% | 326.0u | -2.98u | -0.9% |
| Muted (Q1 → 0u) | 243 | 108-135 | 44.4% | 15.0u | -7.29u | -48.6% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 183–106 · 63.3% · +13.8%); **5–10 is the hole** (118–109 · 52% · +1.0%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 971 tickets · cov 940/971 (stamp 738 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 424 | 218–206 | 51.4% | -2.4% |
| 5–10 | 227 | 118–109 | 52.0% | +1.0% |
| ≥10 | 289 | 183–106 | 63.3% | +13.8% |
| All | 971 | 533–438 | 54.9% | +4.8% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (111) | 56% (84) | 69.3% (114) |
| B | 53.7% (82) | 55.6% (18) | 64.3% (28) |
| C | 37.5% (40) | 44.1% (68) | 56% (116) |

##### Jul 15+ · 760 tickets · cov 735/760 (stamp 733 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 318 | 165–153 | 51.9% | +0.4% |
| 5–10 | 188 | 95–93 | 50.5% | +0.4% |
| ≥10 | 229 | 144–85 | 62.9% | +11.6% |
| All | 760 | 415–345 | 54.6% | +5.1% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.1% (52) | 54.5% (55) | 69.9% (73) |
| B | 53.6% (56) | 46.2% (13) | 61.9% (21) |
| C | 36.8% (19) | 44.4% (63) | 56.6% (106) |

##### Yesterday (Oct 2) · 6 tickets · cov 4/6 (stamp 4 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| 5–10 | 1 | 1–0 | 100.0% | +94.3% |
| ≥10 | 3 | 2–1 | 66.7% | +12.3% |
| All | 6 | 3–3 | 50.0% | -2.5% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | — | 50% (2) |
| B | — | 100% (1) | — |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 971 tickets · cov 962/971 (stamp 751 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 660 | 368–292 | 55.8% | +5.2% |
| 5–10 | 159 | 82–77 | 51.6% | +4.0% |
| ≥10 | 143 | 80–63 | 55.9% | +6.1% |
| All | 971 | 533–438 | 54.9% | +4.8% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 57.8% (204) | 50.9% (55) | 70.7% (58) |
| B | 57.6% (99) | 50% (16) | 53.8% (13) |
| C | 50% (130) | 54.9% (51) | 40.8% (49) |

##### Jul 15+ · 760 tickets · cov 752/760 (stamp 751 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 510 | 290–220 | 56.9% | +8.4% |
| 5–10 | 136 | 69–67 | 50.7% | +3.2% |
| ≥10 | 106 | 53–53 | 50.0% | -3.8% |
| All | 760 | 415–345 | 54.6% | +5.1% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 61.8% (110) | 48.7% (39) | 62.2% (37) |
| B | 54.9% (71) | 50% (12) | 57.1% (7) |
| C | 53.4% (103) | 54.2% (48) | 37.5% (40) |

##### Yesterday (Oct 2) · 6 tickets · cov 6/6 (stamp 6 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 5 | 3–2 | 60.0% | +17.6% |
| ≥10 | 1 | 0–1 | 0.0% | -100.0% |
| All | 6 | 3–3 | 50.0% | -2.5% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50% (2) | — | 0% (1) |
| B | 100% (1) | — | — |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 971 tickets · cov 938/971 (stamp 730 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 212 | 108–104 | 50.9% | -8.7% |
| 0–2.89 | 531 | 285–246 | 53.7% | +6.3% |
| ≥2.89 | 195 | 126–69 | 64.6% | +14.3% |
| All | 971 | 533–438 | 54.9% | +4.8% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 56.8% (185) | 76.3% (80) |
| B | 59% (39) | 54.3% (70) | 57.9% (19) |
| C | 25% (12) | 48.9% (133) | 53.8% (78) |

##### Jul 15+ · 760 tickets · cov 733/760 (stamp 730 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 143 | 80–63 | 55.9% | +5.3% |
| 0–2.89 | 440 | 231–209 | 52.5% | +4.0% |
| ≥2.89 | 150 | 93–57 | 62.0% | +10.3% |
| All | 760 | 415–345 | 54.6% | +5.1% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 53.1% (128) | 76% (50) |
| B | 56.5% (23) | 54.5% (55) | 50% (12) |
| C | 100% (1) | 49.1% (114) | 52.8% (72) |

##### Yesterday (Oct 2) · 6 tickets · cov 4/6 (stamp 4 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 1 | 1–0 | 100.0% | +88.5% |
| 0–2.89 | 2 | 1–1 | 50.0% | -2.9% |
| ≥2.89 | 1 | 1–0 | 100.0% | +39.1% |
| All | 6 | 3–3 | 50.0% | -2.5% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 0% (1) | 100% (1) |
| B | — | 100% (1) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 760 | 415-345 | 54.6% | 2171.80u | +110.52u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 760/760 | 3.21 | 3.15 | +0.06 | 3.00 | 2.00 |
| depth   | #A sharps        | 760/760 | 1.79 | 1.75 | +0.04 | 1.00 | 1.00 |
| depth   | #F − #A          | 760/760 | 1.42 | 1.39 | +0.03 | 1.00 | 1.00 |
| depth   | proven F         | 760/760 | 2.20 | 2.15 | +0.04 | 2.00 | 2.00 |
| depth   | proven A         | 760/760 | 0.84 | 0.86 | -0.02 | 0.00 | 0.00 |
| depth   | proven F−A       | 760/760 | 1.36 | 1.29 | +0.07 | 1.00 | 1.00 |
| depth   | v12 F count      | 760/760 | 3.22 | 3.10 | +0.12 | 2.00 | 2.00 |
| depth   | v12 A count      | 760/760 | 1.85 | 1.79 | +0.05 | 1.00 | 1.00 |
| depth   | WA ForN          | 760/760 | 2.49 | 2.50 | -0.01 | 2.00 | 2.00 |
| depth   | WA AgN           | 760/760 | 1.43 | 1.46 | -0.03 | 1.00 | 1.00 |
| depth   | CLV ForN         | 759/760 | 2.88 | 2.79 | +0.09 | 2.00 | 2.00 |
| depth   | CLV AgN          | 759/760 | 1.70 | 1.67 | +0.03 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 760/760 | 0.31 | 0.28 | +0.02 | 0.00 | 0.00 |
| quality | ForWR            | 733/760 | 56.73 | 55.51 | +1.22 | 54.80 | 54.57 |
| quality | AgWR             | 504/760 | 46.58 | 47.78 | -1.20 | 47.97 | 48.67 |
| quality | TopFor WR        | 733/760 | 62.63 | 61.42 | +1.20 | 58.83 | 58.50 |
| quality | TopAg WR         | 504/760 | 50.01 | 50.83 | -0.82 | 50.89 | 50.96 |
| quality | EDGE             | 733/760 | 8.97 | 6.88 | +2.10 | 7.00 | 5.26 |
| quality | ForCLV           | 751/760 | 62.94 | 63.31 | -0.37 | 63.31 | 63.78 |
| quality | AgCLV            | 537/760 | 62.20 | 61.51 | +0.70 | 63.13 | 62.83 |
| quality | netCLV           | 751/760 | 0.80 | 1.67 | -0.87 | 1.05 | 1.58 |
| quality | Tape             | 730/760 | 1.91 | 1.59 | +0.32 | 1.46 | 1.27 |
| quality | V12 score        | 760/760 | 0.78 | 0.76 | +0.02 | 0.95 | 0.92 |
| quality | V12 forMean      | 760/760 | 31.61 | 27.42 | +4.19 | 25.95 | 19.80 |
| quality | V12 agMean       | 760/760 | 4.59 | 4.68 | -0.09 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 733/760 | 0.550 | +0.023 | +0.101 | +2.10 | 🟡 mild OK |
|    2 | V12 score        | quality | 760/760 | 0.545 | -0.018 | +0.035 | +0.02 | 🟡 mild OK |
|    3 | AgWR             | quality | 504/760 | 0.459 | +0.125 | -0.088 | -1.20 | 🟡 mild OK |
|    4 | V12 forMean      | quality | 760/760 | 0.539 | +0.221 | +0.075 | +4.19 | flat |
|    5 | TopFor WR        | quality | 733/760 | 0.530 | +0.226 | +0.057 | +1.20 | flat |
|    6 | V12 agMean       | quality | 760/760 | 0.471 | +0.318 | -0.005 | -0.09 | flat |
|    7 | Tape             | quality | 730/760 | 0.528 | -0.093 | +0.057 | +0.32 | flat |
|    8 | netCLV           | quality | 751/760 | 0.473 | -0.166 | -0.038 | -0.87 | flat |
|    9 | proven A         | depth   | 760/760 | 0.475 | +0.291 | -0.010 | -0.02 | flat |
|   10 | ForWR            | quality | 733/760 | 0.525 | +0.080 | +0.070 | +1.22 | flat |
|   11 | ForCLV           | quality | 751/760 | 0.475 | -0.233 | -0.020 | -0.37 | flat |
|   12 | AgCLV            | quality | 537/760 | 0.523 | -0.013 | +0.047 | +0.70 | flat |
|   13 | TopAg WR         | quality | 504/760 | 0.480 | +0.102 | -0.047 | -0.82 | flat |
|   14 | proven F−A       | depth   | 760/760 | 0.520 | +0.216 | +0.021 | +0.07 | flat |
|   15 | unopposed (A=0)  | depth   | 760/760 | 0.516 | +0.219 | +0.027 | +0.02 | flat |
|   16 | CLV ForN         | depth   | 759/760 | 0.513 | +0.290 | +0.021 | +0.09 | flat |
|   17 | proven F         | depth   | 760/760 | 0.508 | +0.332 | +0.013 | +0.04 | flat |
|   18 | #A sharps        | depth   | 760/760 | 0.492 | +0.208 | +0.009 | +0.04 | flat |
|   19 | WA ForN          | depth   | 760/760 | 0.492 | +0.296 | -0.003 | -0.01 | flat |
|   20 | v12 F count      | depth   | 760/760 | 0.506 | +0.294 | +0.024 | +0.12 | flat |
|   21 | WA AgN           | depth   | 760/760 | 0.496 | +0.212 | -0.008 | -0.03 | flat |
|   22 | #F sharps        | depth   | 760/760 | 0.502 | +0.293 | +0.012 | +0.06 | flat |
|   23 | #F − #A          | depth   | 760/760 | 0.498 | +0.168 | +0.005 | +0.03 | flat |
|   24 | v12 A count      | depth   | 760/760 | 0.498 | +0.203 | +0.014 | +0.05 | flat |
|   25 | CLV AgN          | depth   | 759/760 | 0.499 | +0.196 | +0.008 | +0.03 | flat |

### (C) Working read

_N=760 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.550 · Δ +2.10 · higher on WINs (cov 733/760)
- **V12 score** — AUC 0.545 · Δ +0.02 · higher on WINs (cov 760/760)
- **AgWR** — AUC 0.459 · Δ -1.20 · higher on LOSSes (cov 504/760)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1273 | 478 | 478 | 456 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 88 | 48-40 | 54.5% | 276.90u | +14.00u | +5.1% | -0.7 |
| on→off | 15 | 7-8 | 46.7% | 46.70u | -3.56u | -7.6% | -4.7 |
| off→on | 101 | 56-45 | 55.4% | 312.85u | +24.27u | +7.8% | +1.5 |
| off→off | 252 | 138-114 | 54.8% | 683.60u | +18.94u | +2.8% | -0.5 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 273 | 147-126 | 53.8% | 829.90u | +18.48u | +2.2% |
| 0–2 | 136 | 78-58 | 57.4% | 373.75u | +53.14u | +14.2% |
| 2–4 | 27 | 16-11 | 59.3% | 77.90u | +5.83u | +7.5% |
| 4+ | 20 | 8-12 | 40.0% | 38.50u | -23.80u | -61.8% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 9 | 6-3 | 66.7% | 29.00u | +4.09u | +14.1% |
| gold, limits flat | 8 | 5-3 | 62.5% | 24.30u | +10.59u | +43.6% |
| steam, not gold | 172 | 93-79 | 54.1% | 536.45u | +23.59u | +4.4% |
| limits↑, no steam | 14 | 7-7 | 50.0% | 39.80u | +4.64u | +11.7% |
| neither | 253 | 138-115 | 54.5% | 690.50u | +10.74u | +1.6% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 152 | 88-64 | 57.9% | 502.55u | +41.62u | +8.3% |
| A/B + no steam | 196 | 107-89 | 54.6% | 533.60u | +28.71u | +5.4% |
| A/B + steam arriving | 74 | 43-31 | 58.1% | 247.05u | +22.89u | +9.3% |
| A/B + gold | 11 | 7-4 | 63.6% | 34.90u | +10.81u | +31.0% |
| steam at lock, no A/B | 37 | 16-21 | 43.2% | 87.20u | -3.35u | -3.8% |
| Source B + steam arriving | 74 | 43-31 | 58.1% | 247.05u | +22.89u | +9.3% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| CFB   | 18n · 66.7% · +10.3%   | 15n · 60.0% · +12.1%   | 7n · 42.9% · -0.9%     | 40n · 60.0% · +9.3%    |
| MLB   | 456n · 55.0% · +8.2%   | 106n · 53.8% · -2.1%   | 364n · 50.8% · +0.8%   | 926n · 53.2% · +3.9%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 20n · 50.0% · -10.9%   | 11n · 63.6% · +19.0%   | 8n · 50.0% · +5.5%     | 39n · 53.8% · -0.3%    |
| NHL   | 7n · 42.9% · -41.9%    | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 11n · 54.5% · -1.7%    |
| SOC   | 56n · 66.1% · +13.5%   | —                      | —                      | 56n · 66.1% · +13.5%   |
| UFC   | 39n · 74.4% · +17.3%   | —                      | —                      | 39n · 74.4% · +17.3%   |
| WNBA  | 30n · 73.3% · +3.4%    | 21n · 42.9% · +0.1%    | 17n · 41.2% · -16.2%   | 68n · 55.9% · -1.8%    |
| **All** | **631n · 57.7% · +8.1%** | **157n · 54.1% · +2.6%** | **401n · 50.4% · +0.5%** | **1189n · 54.8% · +4.7%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **2541** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 2541 |
| Muted W-L                           |            1273-1268 |
| Muted Win %                         |                50.1% |
| Counterfactual PnL at flat 1u       |               -79.83 |
| Counterfactual ROI at flat 1u       |                -3.1% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-79.83u** at a flat 1u stake — a counterfactual ROI of **-3.1%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-10-02 | CFB   | ML     | Liberty                 |  -254 | +0.990 | MINI     |   2/3 |   1/0 |  84.2 |   66.4 |  +37.5 |  7.42 | BOOST    | 5.40u | WIN     |      +2.11 |
| 2026-10-02 | CFB   | ML     | Penn State              |  -135 | +0.989 | HC-1     |   6/2 |   4/0 |  65.7 |   50.1 |  +19.0 |  1.36 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-10-02 | NHL   | ML     | Golden Knights          |  -189 | +0.977 | CONFIRMED-UNOPP |   4/3 |   1/0 |     — |   53.9 |      — |     — | FAIL_OPEN | 2.00u | LOSS    |      -2.00 |
| 2026-10-02 | NHL   | ML     | Red Wings               |  -122 | +0.996 | HC-1     |   2/2 |   1/0 |     — |   66.7 |      — |     — | FAIL_OPEN | 4.00u | LOSS    |      -4.00 |
| 2026-10-02 | CFB   | SPREAD | Pittsburgh              |  -104 | +0.994 | CONFIRMED-UNOPP |   6/2 |   4/0 |  61.2 |   52.7 |  +11.9 | -0.06 | MUTE     | 4.00u | WIN     |      +3.54 |
| 2026-10-02 | CFB   | TOTAL  | Over 45.5               |  -112 | +0.996 | 2-for-0  |   2/0 |   2/0 |  57.0 |   56.1 |   +7.0 |  0.52 | HOLD     | 4.00u | WIN     |      +3.77 |
| 2026-10-01 | CFB   | ML     | North Texas             |  -131 | +0.985 | MINI     |   4/3 |   3/0 |  65.9 |   50.2 |  +26.6 |  1.39 | HOLD     | 4.00u | WIN     |      +2.96 |
| 2026-10-01 | CFB   | ML     | New Mexico State        |  -119 | +0.987 | MINI-    |   3/1 |   2/0 |  58.4 |   60.5 |   +8.4 |  1.45 | HOLD     | 2.00u | WIN     |      +1.80 |
| 2026-10-01 | NFL   | ML     | Steelers                |  -148 | +0.937 | HC-1     |   4/0 |   4/0 |  56.2 |   60.5 |  +15.5 |  2.63 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-10-01 | NHL   | ML     | Oilers                  |  -192 | +0.984 | HC-1     |   6/1 |   1/0 |  77.8 |   47.2 |  +44.5 |  6.67 | BOOST    | 5.40u | WIN     |      +2.66 |
| 2026-10-01 | NHL   | ML     | Flyers                  |  +163 | +0.924 | SHARP~   |   5/2 |   1/0 |  58.5 |   60.5 |   +8.5 |  0.48 | HOLD     | 1.50u | LOSS    |      -1.50 |
| 2026-10-01 | NFL   | SPREAD | Browns                  |  +112 | +0.947 | MINI     |   2/1 |   2/1 |  53.8 |   63.3 |   +8.0 |  2.45 | HOLD     | 3.00u | WIN     |      +3.45 |
| 2026-09-30 | MLB   | TOTAL  | Under 7.5               |  -119 | +0.445 | PATH-D   |   3/1 |   3/1 |  57.0 |   50.5 |   +4.6 | -0.55 | MUTE     | 2.00u | WIN     |      +1.64 |
| 2026-09-29 | MLB   | TOTAL  | Over 6.5                |  +116 | +0.985 | CONFIRMED-UNOPP |   7/7 |   3/0 |  53.8 |   59.7 |   +2.0 |  1.07 | HOLD     | 3.00u | WIN     |      +3.48 |
| 2026-09-29 | MLB   | TOTAL  | Over 7.5                |  -128 | +0.986 | CONFIRMED-UNOPP |   4/2 |   2/0 |  45.9 |   51.4 |   -5.8 | -2.93 | HOLD     | 1.00u | WIN     |      +0.78 |
| 2026-09-27 | MLB   | ML     | Miami Marlins           |  -116 | +0.995 | HC-1     |   2/1 |   2/0 |  57.9 |   59.4 |   +7.2 |  0.07 | HOLD     | 3.00u | WIN     |      +2.61 |
| 2026-09-27 | MLB   | ML     | Houston Astros          |  -166 | +0.982 | 2-for-0  |   3/0 |   2/0 |  55.1 |   39.2 |   +5.1 | -2.40 | HOLD     | 3.00u | WIN     |      +1.65 |
| 2026-09-27 | MLB   | ML     | Minnesota Twins         |  +110 | +0.420 | PATH-D   |   3/2 |   2/1 |  53.3 |   46.2 |   -1.3 | -2.48 | MUTE     | 1.00u | WIN     |      +1.08 |
| 2026-09-27 | NFL   | ML     | Jaguars                 |  -155 | +0.905 | HC-1     | 16/19 |   1/0 |  65.6 |   63.6 |  +28.5 |  6.51 | BOOST    | 5.40u | WIN     |      +3.67 |
| 2026-09-27 | NFL   | ML     | Seahawks                |  -332 | +0.239 | 2-for-0  |   8/3 |   1/0 |  49.5 |   62.4 |   +8.3 |  1.46 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-27 | NFL   | ML     | Giants                  |  -130 | +0.976 | CONFIRMED-Q1 |   2/0 |   2/0 |  46.2 |   62.4 |   +6.4 |  1.81 | HOLD     | 3.00u | WIN     |      +2.34 |
| 2026-09-27 | NFL   | SPREAD | Chargers                |  -110 | +0.933 | HC-1     |  27/8 |   1/1 |  44.5 |   62.8 |   +6.3 |  1.41 | HOLD     | 1.00u | LOSS    |      -1.00 |
| 2026-09-27 | NFL   | SPREAD | Giants                  |  -101 | +0.965 | 2-for-0  |   6/9 |   2/0 |  55.8 |   58.7 |  +13.1 |  1.91 | HOLD     | 3.00u | WIN     |      +2.94 |
| 2026-09-27 | WNBA  | SPREAD | Golden State Valkyries  |  -109 | +0.912 | 2-for-0  |   4/1 |   1/0 |  51.2 |   71.6 |   +1.2 |  1.69 | HOLD     | 1.50u | WIN     |      +1.47 |
| 2026-09-27 | MLB   | TOTAL  | Over 9.5                |  -100 | +0.285 | CONFIRMED-Q1 |   2/3 |   2/2 |  61.8 |   53.6 |   +7.7 | -0.67 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-09-27 | MLB   | TOTAL  | Over 7.5                |  -108 | +0.992 | CONFIRMED-Q1 |   2/0 |   2/0 |  61.8 |   53.6 |  +11.8 |  1.09 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-09-27 | NFL   | TOTAL  | Under 48.5              |  -100 | +0.880 | 2-for-0  |  11/3 |   1/0 |  49.6 |   60.8 |   +3.3 |  0.73 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-27 | NFL   | TOTAL  | Under 42.5              |  -122 | +0.966 | MINI     |   5/5 |   1/0 |  51.6 |   63.4 |   +7.7 |  1.98 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-09-27 | WNBA  | TOTAL  | Under 153.5             |  +104 | +0.912 | 2-for-0  |   4/1 |   1/0 |  50.1 |   75.3 |   +5.1 |  2.03 | HOLD     | 1.50u | LOSS    |      -1.50 |
| 2026-09-27 | WNBA  | TOTAL  | Under 182.5             |  -109 | +0.981 | 2-for-0  |   7/1 |   2/0 |  54.0 |   61.3 |   +4.0 | -0.92 | HOLD     | 1.50u | LOSS    |      -1.50 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.539 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.076 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.039 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.019 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.031 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return | 1184 |    +0.0452 |    -0.0233 | 0.0002 |  +0.013 |   0.948 | positive (higher score ⇒ better outcome)                 |
| won (binary)        | 1184 |    +0.0562 |    +0.5022 | 0.0009 |  +0.031 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    | 1184 |    -0.0698 |    +0.1864 | 0.0000 |  -0.007 |   2.879 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 1184 |          +0.069 |           +0.126 |                   +0.041 |                   +0.063 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 1184 |          -0.009 |           +0.321 |                   +0.006 |                   +0.128 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 1184 |          +0.020 |           +0.245 |                   +0.002 |                   +0.077 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 1184 |          +0.001 |           +0.207 |                   +0.026 |                   +0.114 | count of contributing AGAINST-side wallets                     |
| provenFor         | 1184 |          +0.017 |           +0.226 |                   +0.010 |                   +0.098 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 1184 |          -0.004 |           +0.177 |                   +0.017 |                   +0.091 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 8.885          | 398 | 205-193 |   51.5% |     -1.3% |
| MID (p33–p67)     | 19.950 … 20.786        | 391 | 218-173 |   55.8% |     +1.1% |
| HIGH (> p67)      | 48.906 … 121.103       | 395 | 225-170 |   57.0% |     +1.2% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |      1184 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8032 | average score across live picks                                 |
| SD                |    0.2728 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.499 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +0.943 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.311 / +0.953 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.000 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| CFB   |   40 | 24-16  |   60.0% |     +9.3% |  0.674 |        +0.329 | strong                                    |
| MLB   |  922 | 491-431 |   53.3% |     +3.8% |  0.522 |        -0.123 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   39 | 21-18  |   53.8% |     -0.3% |  0.519 |        -0.036 | noise                                     |
| NHL   |   11 | 6-5    |   54.5% |     -1.7% |  0.233 |        -0.373 | anti-signal (N<20)                        |
| SOC   |   55 | 36-19  |   65.5% |    +13.3% |  0.573 |        +0.062 | real                                      |
| UFC   |   39 | 29-10  |   74.4% |    +17.3% |  0.562 |        -0.040 | real                                      |
| WNBA  |   68 | 38-30  |   55.9% |     -1.8% |  0.562 |        +0.086 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["09-18", "09-19", "09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26", "09-27", "09-29", "09-30", "10-01", "10-02"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.479, 0.44, 0.461, 0.486, 0.48, 0.429, 0.413, 0.402, 0.531, 0.575, 0.612, 0.609, 0.642, 0.636]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["09-18", "09-19", "09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26", "09-27", "09-29", "09-30", "10-01", "10-02"]
    y-axis "edge (pp)" -10 --> 4
    line [-4.7, -8.3, -8.1, -6.1, -5.1, 1.7, 2.3, -0.9, 0.1, -2.9, -4.2, -3.3, -1.3, -0.2]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
| 2026-09-18 |    7 |   76 | 36-40  |   47.4% |     -5.0% |  0.479 |      -4.7pp |
| 2026-09-19 |    7 |   72 | 32-40  |   44.4% |    -14.4% |  0.440 |      -8.3pp |
| 2026-09-20 |    7 |   72 | 32-40  |   44.4% |    -14.4% |  0.461 |      -8.1pp |
| 2026-09-21 |    7 |   69 | 32-37  |   46.4% |    -11.6% |  0.486 |      -6.1pp |
| 2026-09-22 |    7 |   62 | 30-32  |   48.4% |     -7.9% |  0.480 |      -5.1pp |
| 2026-09-23 |    7 |   55 | 30-25  |   54.5% |     +8.0% |  0.429 |      +1.7pp |
| 2026-09-24 |    7 |   59 | 33-26  |   55.9% |     +8.2% |  0.413 |      +2.3pp |
| 2026-09-25 |    7 |   65 | 35-30  |   53.8% |     +3.0% |  0.402 |      -0.9pp |
| 2026-09-26 |    7 |   69 | 38-31  |   55.1% |     +2.1% |  0.531 |      +0.1pp |
| 2026-09-27 |    7 |   68 | 36-32  |   52.9% |     -3.1% |  0.575 |      -2.9pp |
| 2026-09-29 |    7 |   66 | 34-32  |   51.5% |     -5.4% |  0.612 |      -4.2pp |
| 2026-09-30 |    7 |   63 | 33-30  |   52.4% |     -4.1% |  0.609 |      -3.3pp |
| 2026-10-01 |    7 |   60 | 33-27  |   55.0% |     -0.4% |  0.642 |      -1.3pp |
| 2026-10-02 |    7 |   57 | 32-25  |   56.1% |     +2.9% |  0.636 |      -0.2pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.522 avg in first half → 0.534 avg in second half · Δ = +0.012)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +4.7% | [-1.3%, +10.2%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.8% | [51.9%, 57.3%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.539 | [0.506, 0.573]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |            113 | [44, 172]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                      1189 |
| Unique wallets ever on a FOR side            |                                                       386 |
| Avg FOR-side wallets per pick                |                                                      3.18 |
| Top-5 wallets' share of all FOR appearances  |                                                     18.9% |
| Top-10 wallets' share of all FOR appearances |                                                     30.8% |
| Top-20 wallets' share of all FOR appearances |                                                     46.4% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4b912c  | CFB,MLB,NFL,SOC,WNBA |  216 |  127 | 108-108 |   50.0% |     +0.2% |     +0.94 |     1.45× | WR50        |     -5.5% |    1043 | 2026-09-29 |
|    2 | 0cd77e  | CFB,MLB,NHL,SOC,UFC,WNBA |  161 |   27 | 89-72  |   55.3% |    +14.4% |    +65.52 |     1.57× | CONFIRMED   |     -4.1% |     446 | 2026-10-01 |
|    3 | cd2f63  | CFB,MLB,NBA,NFL,SOC,WNBA |  117 |   69 | 66-51  |   56.4% |    +17.0% |    +57.03 |     1.19× | CONFIRMED   |     +5.3% |     830 | 2026-10-02 |
|    4 | eeabaf  | CFB,MLB,NBA,NFL,SOC,UFC |  112 |   77 | 55-57  |   49.1% |     +1.4% |     +4.53 |     1.21× | CONFIRMED   |     +0.6% |     614 | 2026-10-02 |
|    5 | 0f9d74  | CFB,MLB,NBA,NFL,SOC,UFC |  107 |   80 | 59-48  |   55.1% |    +12.8% |    +35.51 |     0.59× | CONFIRMED   |     +6.3% |     588 | 2026-10-02 |
|    6 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  103 |   65 | 66-37  |   64.1% |    +17.3% |    +59.67 |     1.54× | CONFIRMED   |     +7.9% |     350 | 2026-09-11 |
|    7 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | WR50        |     +5.5% |     201 | 2026-07-05 |
|    8 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     336 | 2026-08-05 |
|    9 | 2f2a9e  | CFB,MLB,NFL,SOC,WNBA |   86 |   33 | 45-41  |   52.3% |     -7.7% |    -18.05 |     1.97× | WR50        |     -8.5% |     311 | 2026-09-26 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | WR50        |     -4.3% |     502 | 2026-07-10 |
|   11 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   71 |   71 | 35-36  |   49.3% |     -0.8% |     -1.51 |     3.20× | CONFIRMED   |     -2.4% |     458 | 2026-09-29 |
|   12 | 69f882  | CFB,MLB,NFL,SOC,UFC,WNBA |   67 |   35 | 39-28  |   58.2% |     +4.6% |     +8.91 |     1.98× | CONFIRMED   |     +2.2% |     298 | 2026-09-27 |
|   13 | 51176e  | CFB,MLB,NFL |   66 |    6 | 38-28  |   57.6% |     +3.9% |     +8.54 |     0.99× | CONFIRMED   |     +2.4% |     188 | 2026-09-30 |
|   14 | 7923c4  | MLB,NBA,NHL,UFC |   65 |   20 | 39-26  |   60.0% |    +24.5% |    +40.92 |     0.93× | CONFIRMED   |     +6.3% |     278 | 2026-10-01 |
|   15 | 9214c2  | MLB        |   65 |   17 | 30-35  |   46.2% |     -3.0% |     -5.45 |     1.23× | CONFIRMED   |     +7.2% |     247 | 2026-09-30 |
|   16 | 705ba1  | MLB        |   63 |   45 | 31-32  |   49.2% |     -1.2% |     -2.12 |     1.10× | WR50        |     +3.2% |     341 | 2026-09-23 |
|   17 | bc35e3  | CFB,MLB,NFL,NHL,SOC,UFC,WNBA |   54 |   28 | 24-30  |   44.4% |     -3.4% |     -5.02 |     1.14× | CONFIRMED   |     -5.0% |     283 | 2026-10-01 |
|   18 | 3bdd7e  | CFB,MLB,NFL,SOC,WNBA |   50 |   21 | 31-19  |   62.0% |    +17.0% |    +17.13 |     2.74× | CONFIRMED   |    -10.0% |     208 | 2026-09-09 |
|   19 | 621848  | MLB,SOC,UFC,WNBA |   44 |   15 | 27-17  |   61.4% |     +2.1% |     +2.60 |     0.57× | CONFIRMED   |     +6.5% |     145 | 2026-09-27 |
|   20 | a0cff6  | MLB,NBA,NFL,NHL,SOC,UFC,WNBA |   42 |   33 | 27-15  |   64.3% |    +16.8% |    +19.39 |     2.11× | CONFIRMED   |     -6.8% |     295 | 2026-10-02 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 36b57a  | MLB        |   10 | 8-2    |   80.0% |     +88.0% |    +19.79 |     0.61× | 2026-09-24 |
|    2 | 06c80c  | MLB,NFL,SOC |   11 | 10-1   |   90.9% |     +74.7% |    +29.51 |     1.65× | 2026-09-21 |
|    3 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    4 | d66e28  | CFB,MLB,NFL,WNBA |   22 | 17-5   |   77.3% |     +57.5% |    +32.09 |     0.68× | 2026-09-26 |
|    5 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    6 | 199296  | MLB        |   10 | 7-3    |   70.0% |     +43.0% |    +16.71 |     2.76× | 2026-09-15 |
|    7 | 2dc4f6  | CFB,MLB,NFL,WNBA |   17 | 11-6   |   64.7% |     +41.4% |    +16.92 |     0.58× | 2026-09-26 |
|    8 | 4c8ed9  | CFB,MLB,NFL,NHL,SOC,UFC,WNBA |   30 | 18-12  |   60.0% |     +38.4% |    +24.26 |     3.45× | 2026-10-02 |
|    9 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|   10 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   11 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   12 | 718cd6  | CFB,MLB,NFL,SOC,UFC |   14 | 9-5    |   64.3% |     +28.5% |    +11.39 |     1.29× | 2026-09-27 |
|   13 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|   14 | 7923c4  | MLB,NBA,NHL,UFC |   65 | 39-26  |   60.0% |     +24.5% |    +40.92 |     0.93× | 2026-10-01 |
|   15 | ba8492  | CFB,MLB,NFL |   37 | 23-14  |   62.2% |     +22.4% |    +24.57 |     1.74× | 2026-09-30 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    2 | dfa240  | CFB,MLB,NFL,NHL |   12 | 3-9    |   25.0% |     -40.6% |    -13.19 |     1.22× | 2026-10-01 |
|    3 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    4 | 2a8409  | MLB,NFL,WNBA |   27 | 9-18   |   33.3% |     -27.6% |    -17.78 |     1.47× | 2026-09-20 |
|    5 | 767ff5  | CFB,MLB,NFL,SOC |   16 | 6-10   |   37.5% |     -26.0% |    -12.33 |     1.22× | 2026-10-02 |
|    6 | 120215  | MLB,NFL,SOC |   14 | 6-8    |   42.9% |     -24.2% |     -9.08 |     1.33× | 2026-09-27 |
|    7 | 7cc9a7  | CFB,MLB,NFL |   17 | 6-11   |   35.3% |     -23.0% |    -11.27 |     1.93× | 2026-10-02 |
|    8 | df8add  | MLB,NFL,SOC |   21 | 10-11  |   47.6% |     -16.1% |     -7.97 |     1.57× | 2026-09-20 |
|    9 | e55973  | MLB,NFL,SOC,UFC |   15 | 6-9    |   40.0% |     -15.3% |     -6.66 |     0.63× | 2026-09-19 |
|   10 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|   11 | cc63b8  | CFB,MLB,NFL,NHL,WNBA |   16 | 8-8    |   50.0% |     -13.4% |     -7.21 |     1.27× | 2026-09-27 |
|   12 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|   13 | e41fbe  | CFB,MLB,NFL,NHL |   14 | 7-7    |   50.0% |      -9.0% |     -4.82 |     1.63× | 2026-10-02 |
|   14 | 2f2a9e  | CFB,MLB,NFL,SOC,WNBA |   86 | 45-41  |   52.3% |      -7.7% |    -18.05 |     1.97× | 2026-09-26 |
|   15 | c9bba3  | CFB,MLB,NFL,SOC |   23 | 13-10  |   56.5% |      -5.9% |     -3.14 |     1.08× | 2026-09-25 |

> 🔴 **2 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 86, ROI -7.7%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  3607 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   967 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    18 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |   152 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |    10 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   422 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            398 |        52 |    0 |  113 |  233 |                    165 |
| NBA   |            211 |        24 |    0 |   71 |  116 |                     95 |
| NHL   |            159 |        13 |    0 |   46 |  100 |                     59 |
| SOC   |            376 |        42 |    0 |  118 |  216 |                    160 |

---

## Appendix A — Model Versions

How does the latest model (**ags-unified-v12**) compare against prior versions? Picks are tagged **strictly by pick date** against the calibration-history cutover schedule below — that's the only signal that's robust to the cron back-filling v11/v12 stamps on historical picks during a transition.

### Headline performance by version

| Version | Era                  | Days | Live N | Trk | W-L    | Win %  | ROI       | PnL (u)    | per-pick | AUC   | Brier (model) | Status   |
|---------|----------------------|------|--------|-----|--------|--------|-----------|------------|----------|-------|---------------|----------|
| v9      | 05-15 → 05-22        |    7 |     60 |  12 | 32-28  |  53.3% |     -9.0% |     -10.38 |    -0.17 | 0.549 |        0.3400 | ⚪ retired |
| v10     | 05-22 → 05-25        |    3 |     62 |  14 | 30-32  |  48.4% |    -18.8% |     -19.42 |    -0.31 | 0.394 |        0.2804 | ⚪ retired |
| v11     | 05-25 → 06-01        |    7 |    111 |  22 | 61-50  |  55.0% |      2.8% |      +6.76 |    +0.06 | 0.444 |        0.2642 | ⚪ retired |
| v12     | 06-01 → present      |  125 |   1189 | 2541 | 651-538 |  54.8% |      4.7% |    +157.13 |    +0.13 | 0.513 |        0.2497 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | + 1129 |    +1.4pp |    +13.6pp |          +0.305 |   -0.036 |    +0.0903 | 🟡 mixed |
| v12 − v10          | + 1127 |    +6.4pp |    +23.4pp |          +0.445 |   +0.119 |    +0.0306 | 🟢 better |
| v12 − v11          | + 1078 |    -0.2pp |     +1.9pp |          +0.071 |   +0.069 |    +0.0145 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | CFB            | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | —              | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | —              | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | —              | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 40n 60.0% +9%  | 926n 53.2% +4% | 10n 30.0% +29% | 39n 53.8% -0%  | 11n 54.5% -2%  | 56n 66.1% +14% | 39n 74.4% +17% | 68n 55.9% -2%  | 1189n 54.8% +5% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 232n +9%      | 290n +3%      | 240n +4%      | 151n -4%      | 270n +7%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~4012 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1423 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 1184 / 1423 (83%) | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 1184 / 1423 (83%) | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 1184 / 1423 (83%) | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 1184 / 1423 (83%) | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 1184 / 1423 (83%) | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 1184 / 1423 (83%) | Count of proven AGAINST-side wallets                                 |
| countMargin          | 1184 / 1423 (83%) | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1423 / 1423 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1423 / 1423 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1423 / 1423 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1423 / 1423 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1423 / 1423 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1423 / 1423 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1416 / 1423 (100%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1409 / 1423 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1423 / 1423 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1422 / 1423 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 938 / 1423 (66%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1422 / 1423 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 938 / 1423 (66%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 937 / 1423 (66%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1423 / 1423 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1423 / 1423 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1423 / 1423 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1422 / 1423 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1423 / 1423 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd agCount           | 938 |      |    +0.026 |    +0.257 |      +0.048 |      +0.132 |  0.507 |
|    2 | wd contribMargin     | 1423 |      |    -0.017 |    -0.072 |      -0.042 |      -0.072 |  0.479 |
|    3 | V12 forMean          | 1184 |  🟢  |    +0.069 |    +0.126 |      +0.041 |      +0.063 |  0.531 |
|    4 | qMargin              | 1184 |  🟢  |    +0.074 |    +0.058 |      +0.041 |      +0.024 |  0.526 |
|    5 | wd sizeMargin        | 937 |      |    -0.017 |    -0.017 |      -0.039 |      -0.058 |  0.492 |
|    6 | wd agAvgSize         | 938 |      |    +0.019 |    +0.026 |      +0.036 |      +0.041 |  0.510 |
|    7 | wd maxForContrib     | 1422 |      |    -0.038 |    -0.066 |      -0.031 |      -0.030 |  0.490 |
|    8 | lockPinnProb         | 1416 |      |    +0.191 |    +0.174 |      +0.027 |      -0.118 |  0.599 |
|    9 | V12 agCount          | 1184 |  🟢  |    +0.001 |    +0.207 |      +0.026 |      +0.114 |  0.501 |
|   10 | hcMargin             | 1423 |      |    +0.002 |    +0.215 |      -0.025 |      +0.062 |  0.511 |
|   11 | clv                  | 1409 |      |    -0.025 |    +0.083 |      -0.024 |      +0.030 |  0.515 |
|   12 | wd contribFor        | 1423 |      |    -0.015 |    -0.001 |      -0.023 |      -0.018 |  0.481 |
|   13 | wd maxShare          | 1423 |      |    +0.026 |    -0.101 |      +0.021 |      -0.033 |  0.512 |
|   14 | wd contribAg         | 1423 |      |    -0.000 |    +0.135 |      +0.019 |      +0.063 |  0.489 |
|   15 | ags (v11)            | 1423 |      |    +0.006 |    +0.038 |      -0.018 |      -0.025 |  0.515 |
|   16 | countMargin          | 1184 |      |    +0.020 |    +0.130 |      -0.016 |      +0.007 |  0.503 |
|   17 | wd forCount          | 1422 |      |    +0.000 |    +0.191 |      -0.014 |      +0.043 |  0.491 |
|   18 | agsV12               | 1184 |  🟢  |    +0.031 |    -0.039 |      +0.013 |      -0.019 |  0.539 |
|   19 | provenMargin         | 1423 |      |    +0.007 |    +0.110 |      -0.013 |      +0.015 |  0.508 |
|   20 | peakStars            | 1423 |      |    +0.033 |    +0.040 |      +0.011 |      -0.013 |  0.518 |
|   21 | provenFor            | 1423 |      |    -0.004 |    +0.139 |      -0.009 |      +0.035 |  0.501 |
|   22 | wd forAvgSize        | 1422 |      |    +0.006 |    +0.058 |      -0.009 |      +0.007 |  0.516 |
|   23 | V12 agMean           | 1184 |  🟢  |    -0.009 |    +0.321 |      +0.006 |      +0.128 |  0.475 |
|   24 | provenTotal          | 1423 |      |    -0.010 |    +0.101 |      -0.005 |      +0.039 |  0.493 |
|   25 | provenAg             | 1423 |      |    -0.016 |    +0.182 |      +0.003 |      +0.085 |  0.485 |
|   26 | V12 forCount         | 1184 |  🟢  |    +0.020 |    +0.245 |      +0.002 |      +0.077 |  0.509 |

> **Top 3 univariate features by PnL correlation:** `wd agCount` (r = +0.048), `wd contribMargin` (r = -0.042), `V12 forMean` (r = +0.041).

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd agCount` · r(unit-ret) = +0.048 · AUC = 0.507

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 409 | 219-190 |   53.5% |     -0.6% |
| MID (p33–p67)     | 2.000 … 2.000            | 225 | 118-107 |   52.4% |     -0.8% |
| HIGH (> p67)      | 3.000 … 3.000            | 304 | 168-136 |   55.3% |     +1.5% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd contribMargin` · r(unit-ret) = -0.042 · AUC = 0.479

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … -52.800        | 476 | 271-205 |   56.9% |     +2.4% |
| MID (p33–p67)     | 57.800 … 63.950          | 473 | 259-214 |   54.8% |     +0.6% |
| HIGH (> p67)      | 174.100 … 93.900         | 474 | 245-229 |   51.7% |     -2.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `V12 forMean` · r(unit-ret) = +0.041 · AUC = 0.531

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 8.885            | 398 | 205-193 |   51.5% |     -1.3% |
| MID (p33–p67)     | 19.950 … 20.786          | 391 | 218-173 |   55.8% |     +1.1% |
| HIGH (> p67)      | 48.906 … 121.103         | 395 | 225-170 |   57.0% |     +1.2% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `qMargin` · r(unit-ret) = +0.041 · AUC = 0.526

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 8.885            | 395 | 214-181 |   54.2% |     +0.6% |
| MID (p33–p67)     | 19.950 … 20.786          | 394 | 207-187 |   52.5% |     -0.7% |
| HIGH (> p67)      | 46.556 … 121.103         | 395 | 227-168 |   57.5% |     +1.3% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd sizeMargin` · r(unit-ret) = -0.039 · AUC = 0.492

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.279          | 313 | 176-137 |   56.2% |     +2.2% |
| MID (p33–p67)     | 0.078 … 0.410            | 312 | 163-149 |   52.2% |     +0.3% |
| HIGH (> p67)      | 3.728 … 0.692            | 312 | 166-146 |   53.2% |     -2.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd agCount     | wd contribMargin | V12 forMean    | qMargin        | wd sizeMargin  | wd agAvgSize   | wd maxForContrib | lockPinnProb   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd agCount  |  1.000         |         -0.127 |         +0.057 |         -0.051 |         +0.032 |         +0.082 |         +0.275 |         -0.070 |
| wd contribMargin |         -0.127 |  1.000         |         +0.039 |         +0.036 |         +0.231 |         -0.136 |         +0.503 |         +0.180 |
| V12 forMean |         +0.057 |         +0.039 |  1.000         |         +0.932 |         +0.174 |         -0.029 |         +0.146 |         +0.085 |
| qMargin     |         -0.051 |         +0.036 |         +0.932 |  1.000         |         +0.168 |         -0.045 |         +0.115 |         +0.099 |
| wd sizeMargin |         +0.032 |         +0.231 |         +0.174 |         +0.168 |  1.000         |         -0.681 |         +0.219 |         +0.121 |
| wd agAvgSize |         +0.082 |         -0.136 |         -0.029 |         -0.045 |         -0.681 |  1.000         |         +0.066 |         -0.083 |
| wd maxForContrib |         +0.275 |         +0.503 |         +0.146 |         +0.115 |         +0.219 |         +0.066 |  1.000         |         +0.026 |
| lockPinnProb |         -0.070 |         +0.180 |         +0.085 |         +0.099 |         +0.121 |         -0.083 |         +0.026 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.932. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 817 picks · features = 8 (+ intercept) · multiple R² = **0.0095** · adjusted R² = **-0.0015** · residual sd = 0.954

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | qMargin              |  🟢 |    +0.0530 |   0.0969 | +0.55        |        1 |
|    2 | wd agCount           |     |    +0.0463 |   0.0383 | +1.21        |        2 |
|    3 | wd contribMargin     |     |    -0.0406 |   0.0423 | -0.96        |        3 |
|    4 | wd agAvgSize         |     |    +0.0272 |   0.0485 | +0.56        |        4 |
|    5 | wd sizeMargin        |     |    -0.0238 |   0.0497 | -0.48        |        5 |
|    6 | lockPinnProb         |     |    +0.0197 |   0.0343 | +0.57        |        6 |
|    7 | wd maxForContrib     |     |    +0.0086 |   0.0447 | +0.19        |        7 |
|    8 | V12 forMean          |  🟢 |    -0.0053 |   0.0969 | -0.05        |        8 |
| —    | (intercept)          |     |    +0.0141 |   0.0334 |    +0.42 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.053), `V12 forMean` (β = -0.005)
- V12 IGNORES: `wd agCount` (β = +0.046, t = +1.21), `wd contribMargin` (β = -0.041, t = -0.96), `wd agAvgSize` (β = +0.027, t = +0.56), `wd sizeMargin` (β = -0.024, t = -0.48), `lockPinnProb` (β = +0.020, t = +0.57), `wd maxForContrib` (β = +0.009, t = +0.19)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.538 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.566 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.028.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Inputs V12 currently uses but that show weak multivariate signal: `V12 forMean`. They may be contributing noise rather than information.
- Adjusted R² of -0.0015 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*