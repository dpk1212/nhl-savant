# AGS-Unified — V12 Daily Monitor

**Generated:** Sunday, October 4, 2026 at 12:57 PM ET

**Model:** `ags-unified-v12` · **Live since:** 2026-06-01 (126 days) · **Tape / side-profile era:** 2026-07-15+ · **qConv mute:** 2026-08-03+

Production book = **Paths A–D** (HC / RANK / SHARP / DISSENT) → fadeTop mute → **TAPE** mute/boost → **qConv Q1 mute**. Numbers below are V12-scoped (pick date ≥ 2026-06-01) unless marked Appendix.

## Contents

1. Executive Summary · 2. Live Stack · 3. Daily Scoreboard · **4. Path & Modifier Board** · 5. Tape Era (2026-07-15+) · **5q. qConv Q1 Mute** · 6. Sport/Market · 7. Mute · 8. Recent Picks · 9. Predictive Health · 10. Wallets · 11. Ops

Appendix A — Model Versions · Appendix B — Feature Lab

## § 1 — Executive Summary

> 🟢 **V12 is currently WINNING.** Since going live on **2026-06-01** (126 days ago), V12 has evaluated **4980** picks, shipped **1215** for real money (24.4% ship rate), and muted the other **3765**. On the shipped picks V12 has gone **661-554** (54.4% win), staked **3425.95u**, and returned **+129.65u** at **+3.8% ROI**.

### Snapshot

| Metric                              | Value                          |
|-------------------------------------|--------------------------------|
| Days V12 has been authoritative     |                            126 |
| Picks V12 has evaluated             |                           4980 |
| Picks SHIPPED (units > 0)           |                           1215 |
| Picks MUTED (score ≤ 0, FADE)       |                           3765 |
| Ship rate                           |                          24.4% |
| Live W-L                            |                        661-554 |
| Live Win %                          |                          54.4% |
| Live PnL (units)                    |                        +129.65 |
| Live ROI                            |                          +3.8% |
| Avg PnL / day                       |                         +1.03u |
| Most recent action (2026-10-04)  |            1 live, 0-1, -3.00u |

### What's working

- V12 is profitable at **3.8% ROI** across 1215 live picks (+129.65u real PnL).
- Mute rule is **saving money** — the 2611 muted picks would have lost -80.97u at flat 1u (-3.1% counterfactual ROI). V12 correctly rejected losers.
- V12 is generating **+1.03u/day** on average since launch.
- Best sport: **NBA** — 10 live, 3-7, 29.1% ROI, +2.33u.
- Tape era (2026-07-15+): **425-361** · +3.7% ROI · +83.04u on 786 graded — see § 5.

### What to watch

- 🟡 Weakest sport: **NHL** — 12 live, 6-6, -12.8% ROI, -4.54u.

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

**Full book:** 126d · 1215 live · 661-554 · **+129.65u** · +3.8% ROI · +1.03u/day.

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
| 2026-10-03 |       113 |   25 |    68 | 10-15      |  40.0% |     74.90 |     -24.48 |    -32.7% |    +132.65 |
| 2026-10-04 |        35 |    1 |     2 | 0-1        |   0.0% |      3.00 |      -3.00 |   -100.0% |    +129.65 |

> **Trajectory.** 🟡 Last 3 days (-27.7% ROI) **-32.4pp** vs prior (4.7%).

## § 4 — Path & Modifier Board

> **Daily read.** Every lever that can put units on a ticket or change size after stacking. Paths A–D stamp the base; fadeTop / TAPE mute·hold·boost after. Ranked best → worst. Thin N stays listed so nothing hides.

### At a glance — BEST / WORST

_As of last graded day **2026-10-04**. Paths ≥5 graded · modifiers ≥3. Staked ROI: higher better. Mute CF: **more negative = better** (avoided losers)._

#### Paths

| | Path | Layer | N | W-L | ROI | PnL | u/pick | 7d ROI |
|-:|------|-------|--:|:---:|----:|----:|-------:|-------:|
| 🟢 1 | HC-2 SUPER | A | 25 | 18-7 | +41.4% | +43.46u | +1.74u | — |
| 🟢 2 | MINI- (gate-cut) | C | 24 | 15-9 | +28.1% | +11.21u | +0.47u | +90.0% |
| 🟢 3 | DISSENT rescue | D | 26 | 15-11 | +20.4% | +5.77u | +0.22u | +90.7% |
| 🔴 1 | CONFIRMED margin3+ | A | 5 | 2-3 | -40.4% | -2.02u | -0.40u | — |
| 🔴 2 | SHARP-PRIME rescue (legacy) | C | 14 | 6-8 | -13.5% | -6.61u | -0.47u | — |
| 🔴 3 | HC-1 TOP+ ($ boost) | A/C | 29 | 15-14 | -9.0% | -11.94u | -0.41u | — |

#### Modifiers — staked (HOLD / BOOST / FAIL_OPEN)

| | Modifier | N | W-L | ROI | PnL | Note |
|-:|----------|--:|:---:|----:|----:|------|
| 🟢 best | Tape BOOST (≥2.89 ×1.35) | 149 | 91-58 | +9.0% | +62.88u | sized UP after path |
| 2 | Tape HOLD (mid) | 558 | 296-262 | +3.0% | +41.88u | kept path units |
| 🔴 worst | Tape FAIL_OPEN (missing) | 34 | 15-19 | -35.0% | -26.05u | no tape score → path size |

#### Modifiers — mutes (CF: did we dodge losers?)

| | Modifier | N | W-L | CF ROI | CF PnL | Read |
|-:|----------|--:|:---:|-------:|-------:|------|
| 1 | fadeTop≥60 MUTE | 96 | 42-54 | -8.7% | -8.34u | 🟢 saving $ |
| 2 | Tape MUTE (tape<0 → 0u) | 276 | 144-132 | -2.2% | -6.09u | 🟡 flat |
| 3 | Score FADE (≤0 → 0u) | 1268 | 637-631 | -0.4% | -5.24u | 🟡 flat |

### (A) Every staking path

| Path | Key | Layer | u | N | W-L | Win% | Stake | PnL | ROI | u/pick | 7d N | 7d ROI | Last day PnL | Verdict |
|------|-----|-------|--:|--:|:---:|-----:|------:|----:|----:|-------:|-----:|-------:|-------------:|---------|
| HC-2 SUPER | `SUPER` | A | 6u | 25 | 18-7 | 72.0% | 105.0u | +43.46u | +41.4% | +1.74u | 0 | — | — | 🟢 OK |
| HC-1 TOP+ ($ boost) | `TOP+` | A/C | 5u | 29 | 15-14 | 51.7% | 132.5u | -11.94u | -9.0% | -0.41u | 0 | — | — | 🟠 watch |
| HC-1 TOP | `TOP` | A | 4u | 120 | 69-51 | 57.5% | 438.0u | +12.29u | +2.8% | +0.10u | 10 | -31.7% | — | 🔻 cooling |
| RANK 2-for-0 rescue | `RANK` | B | 4u | 132 | 74-58 | 56.1% | 472.5u | +34.90u | +7.4% | +0.26u | 12 | +2.9% | — | 🟢 OK |
| SHARP-PRIME rescue (legacy) | `SHARP-PRIME` | C | 4u | 14 | 6-8 | 42.9% | 49.0u | -6.61u | -13.5% | -0.47u | 0 | — | — | 🟠 watch |
| SHARP EDGE/net BOTH | `SHARP` | C | 3u | 94 | 44-50 | 46.8% | 326.8u | -24.88u | -7.6% | -0.26u | 0 | — | — | 🟡 flat |
| SHARP-LEAN EDGE/net ONE | `SHARP-LEAN` | C | 1.5u | 130 | 68-62 | 52.3% | 358.8u | +1.28u | +0.4% | +0.01u | 8 | +16.2% | — | 🟡 flat |
| MINI (gate-pass) | `MINI` | A | 3u | 123 | 69-54 | 56.1% | 345.6u | +14.78u | +4.3% | +0.12u | 8 | -8.3% | — | 🟡 flat |
| MINI- (gate-cut) | `MINI-` | C | 1u | 24 | 15-9 | 62.5% | 39.9u | +11.21u | +28.1% | +0.47u | 1 | +90.0% | — | 🟢 room |
| CONFIRMED margin3+ | `CONFIRMED` | A | 1u | 5 | 2-3 | 40.0% | 5.0u | -2.02u | -40.4% | -0.40u | 0 | — | — | 🟠 watch |
| DISSENT rescue | `DISSENT` | D | 1u | 26 | 15-11 | 57.7% | 28.4u | +5.77u | +20.4% | +0.22u | 2 | +90.7% | — | 🟢 room |
| WINNER (legacy EDGE) | `WINNER` | E | 3-6u | 0 | — | — | 0.0u | +0.00u | — | — | 0 | — | — | pending |

### (B) Every post-stack modifier

Mutes use **flat 1u CF** (what if we had shipped). Tape HOLD/BOOST/FAIL_OPEN use **real staked PnL**.

| Modifier | Layer | Mode | N | W-L | Win% | Stake/CF | PnL | ROI | 7d N | 7d ROI | Last day |
|----------|-------|------|--:|:---:|-----:|---------:|----:|----:|-----:|-------:|---------:|
| Tape BOOST (≥2.89 ×1.35) | TAPE | staked | 149 | 91-58 | 61.1% | 695.4u | +62.88u | +9.0% | 7 | +4.1% | — |
| Tape HOLD (mid) | TAPE | staked | 558 | 296-262 | 53.0% | 1391.3u | +41.88u | +3.0% | 41 | -18.1% | -3.00u |
| Tape FAIL_OPEN (missing) | TAPE | staked | 34 | 15-19 | 44.1% | 74.5u | -26.05u | -35.0% | 3 | -67.1% | — |
| Tape MUTE (tape<0 → 0u) | TAPE | CF 1u | 276 | 144-132 | 52.2% | 276.0u | -6.09u | -2.2% | 17 | -7.6% | — |
| fadeTop≥60 MUTE | E | CF 1u | 96 | 42-54 | 43.8% | 96.0u | -8.34u | -8.7% | 7 | -47.6% | — |
| Score FADE (≤0 → 0u) | score | CF 1u | 1268 | 637-631 | 50.2% | 1268.0u | -5.24u | -0.4% | 55 | -2.2% | +0.05u |

### (C) Path × Tape (staked · 2026-07-15+)

| Path | HOLD n/ROI | BOOST n/ROI | FAIL_OPEN n/ROI |
|------|------------|-------------|-----------------|
| SUPER | 8 / +52% | 4 / +10% | — |
| TOP | 49 / -8% | 26 / +9% | 5 / -33% |
| RANK | 81 / +5% | 12 / +4% | — |
| SHARP | 22 / -25% | 46 / -1% | 1 / -100% |
| SHARP-LEAN | 97 / +1% | 26 / +2% | 4 / -63% |
| MINI | 65 / -6% | 16 / +46% | 5 / -25% |
| MINI- | 9 / +20% | 2 / +52% | 3 / -5% |
| DISSENT | 15 / +22% | 1 / +91% | 7 / -11% |

### (D) Last graded day movers (2026-10-04)

_No graded staked picks on 2026-10-04._

_Rollups + trajectory charts below. Tape deep-dive: § 5._

### Path rollups & trajectory

Display tiers (UI buckets) — detail lives in **§ 4 Path & Modifier Board** above.

| Tier (paths)              | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|---------------------------|-------|-----|--------|--------|-------------|------------|-----------|
| MAX PLAY (SUPER)          |    6u |  44 | 18-7   |  72.0% |      105.00 |     +43.46 |     41.4% |
| TOP PICK (TOP+/TOP)       |  4-5u | 279 | 84-65  |  56.4% |      570.50 |      +0.35 |      0.1% |
| SHARP PLAY (RANK/SHARP-PRIME/SHARP/SHARP-LEAN/WINNER/HARD-UNOPP) | 1.5-6u | 1094 | 192-178 |  51.9% |     1207.05 |      +4.69 |      0.4% |
| STRONG (MINI)             |    3u | 234 | 69-54  |  56.1% |      345.65 |     +14.78 |      4.3% |
| LEAN (CONFIRMED/MINI-/DISSENT) |    1u | 194 | 32-23  |  58.2% |       73.25 |     +14.96 |     20.4% |
| **STAKED TOTAL** |     — | 722 | 395-327 |  54.7% |     2301.45 |     +78.24 |     +3.4% |

#### Granular — by individual staking path

| Path                  | Key         | Units | N   | W-L    | Win %  | Total Stake | PnL (u)    | ROI       |
|-----------------------|-------------|-------|-----|--------|--------|-------------|------------|-----------|
| A · HC-2 (model max)  | SUPER       |    6u |  44 | 18-7   |  72.0% |      105.00 |     +43.46 |     41.4% |
| A/C · HC-1 + $-boost  | TOP+        |    5u |  29 | 15-14  |  51.7% |      132.50 |     -11.94 |     -9.0% |
| A · HC-1 (model)      | TOP         |    4u | 250 | 69-51  |  57.5% |      438.00 |     +12.29 |      2.8% |
| B · 2-for-0 rescue    | RANK        |    4u | 253 | 74-58  |  56.1% |      472.45 |     +34.90 |      7.4% |
| C · proven-$ prime (legacy) | SHARP-PRIME |    4u |  14 | 6-8    |  42.9% |       49.00 |      -6.61 |    -13.5% |
| C · EDGE/net ONE      | SHARP-LEAN  |  1.5u | 636 | 68-62  |  52.3% |      358.84 |      +1.28 |      0.4% |
| C · proven-$ consensus | SHARP       |    3u | 191 | 44-50  |  46.8% |      326.76 |     -24.88 |     -7.6% |
| A · mini-HC (gate-pass) | MINI        |    3u | 234 | 69-54  |  56.1% |      345.65 |     +14.78 |      4.3% |
| C · mini gate-cut     | MINI-       |    1u |  58 | 15-9   |  62.5% |       39.90 |     +11.21 |     28.1% |
| A · margin 3+         | CONFIRMED   |    1u |  16 | 2-3    |  40.0% |        5.00 |      -2.02 |    -40.4% |
| D · CM≤0 dissent      | DISSENT     |    1u | 120 | 15-11  |  57.7% |       28.35 |      +5.77 |     20.4% |
| E · winner-align EDGE | WINNER      |  3-6u |   0 | pending |      — |        0.00 |      +0.00 |         — |

> **MONITORING volume:** 809 picks tracked at 0u (would-be 396-413, 48.9% win). Shown to users for context; **not** part of the staked record, units, or ROI.

### Path trajectory (cum PnL & win%)

One line per display tier. Down-sloping PnL = path over-staked for what it returns. Pair with § 4 board.

**Lines:** 🔵 MAX PLAY (30-14, +43.46u)  ·  🟢 TOP PICK (150-129, +0.35u)  ·  🟠 SHARP PLAY (548-546, +4.69u)  ·  🔴 STRONG (124-110, +14.78u)  ·  🟣 LEAN (106-88, +14.96u)

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative PnL by path (u)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26", "09-27", "09-28", "09-29", "09-30", "10-01", "10-02", "10-03", "10-04"]
    y-axis "PnL (u)" -14 --> 50
    line [0, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 7.12, 7.12, 7.12, 7.12, 7.12, 13.47, 7.47, 10.02, 11.16, 16.87, 16.87, 16.87, 16.87, 20.4, 25.48, 25.48, 25.48, 24.48, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 27.88, 28.41, 27.41, 27.41, 29.3, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 35.36, 41.54, 41.54, 44.81, 44.81, 44.81, 44.81, 44.81, 41.81, 41.81, 39.81, 39.81, 39.81, 39.81, 39.81, 39.81, 42.11, 42.11, 42.11, 42.11, 42.11, 42.11, 42.11, 39.61, 39.61, 39.61, 43.46, 43.46, 43.46, 43.46, 43.46, 43.46, 43.46, 43.46, 43.46]
    line [0, 0.67, 0.67, -0.75, 4.71, 2.73, 5.25, 9.1, 9.1, 10.24, 10.77, 4.27, 9.16, 7.8, 2.8, 9.91, -4.09, 5.82, 17.93, 17.05, 6.87, 13.21, 16.41, 16.12, 17.02, 16.9, 16.9, 10.4, 10.4, 10.4, 5, 1.72, 4.82, 0, 0, 3.88, 4.88, 7.04, 9.46, 9.46, 15.34, 24.32, 21.32, 21.32, 21.32, 21.32, 21.32, 16.32, 16.32, 18.32, 18.32, 17.32, 14.82, 14.82, 10.82, 13.32, 13.32, 9.32, 9.31, 11.2, 9.77, 8.77, 8.77, 9.91, 13.46, 7.48, 6.48, 3.39, 3.39, 6.69, 3.69, 3.69, 4.96, 5.63, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 6.44, 8.23, 8.23, 8.23, 8.23, 8.23, 12.11, 10.91, 16.19, 16.19, 16.19, 16.19, 14.85, 6.85, 0.35, 0.35]
    line [0, 0, 0, 0, 0, 1.82, 1.82, 1.82, 1.82, 7.26, 2.9, 7.13, 3.81, 2.32, 12.09, 22.82, 18, 8.2, 9.97, 16.05, 19.58, 18.91, 6.62, 19.88, 19.38, 19.38, 1.38, 1.38, 1.38, 1.38, 1.38, 1.38, -1.46, -4.98, -1.33, -1.85, 11.28, 9.88, 5.47, 2.62, 5.24, -3.46, -7, 2.32, 0.15, 0.15, 4.51, 3.33, 15.56, 1.99, 8.94, 8.82, 8.52, 10.23, 9.23, 7.23, 7.23, 7.23, 16.24, 23.51, 26.41, 22.22, 19.04, 19.28, 16.98, 26.69, 17.33, 22.3, 39.67, 33.11, 21.88, 32.21, 39.59, 13.01, 22.5, 25.55, 26.75, 34.19, 38.85, 38.85, 38.79, 38.82, 41.18, 43.74, 44.86, 43.97, 43.97, 42.76, 37.04, 38.07, 38.07, 38.07, 21.67, 21.67, 21.67, 15.67, 15.67, 17.52, 13.52, 13.78, 13.56, 7.55, 0.75, -2.19, -2.19, -2.19, -2.19, -3.69, 0.08, 4.69, 4.69]
    line [5.07, -0.93, 1.03, 6.54, 3.08, 5.27, 0.88, 5.63, -2.87, -8.87, -8.87, -8.87, -8.87, -11.87, -9.24, -11.16, -11.16, -11.16, -11.16, -11.16, -8.43, -8.43, -11.43, -11.43, -8.68, -8.68, -8.68, -9.61, -9.61, -9.61, -9.61, -11.26, -6.53, -6.42, -6.42, -6.42, -6.42, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, -8.67, 3.72, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, -0.28, 2.14, 8.47, 6.47, 1.86, 4.21, 8.5, 9.14, 15.09, 10.09, 12.33, 19.37, 19.37, 18.37, 15.34, 13.54, 13.54, 7.5, 7, 12.83, 15.37, 15.37, 15.37, 18.31, 18.31, 18.31, 18.31, 18.31, 21.88, 21.88, 11.88, 7.88, 14.28, 22.4, 22.4, 21.31, 21.31, 21.31, 21.31, 22.23, 17.23, 17.23, 17.23, 17.23, 17.23, 15.23, 17.42, 14.42, 14.42, 14.42, 14.42, 20.83, 22.94, 14.78, 14.78]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -0.35, -0.35, 0.83, 1.74, 0.74, 0.42, 0.42, -0.93, -0.93, -0.05, -0.05, 0.71, 0.71, 0.71, -0.29, -0.29, -0.29, -0.29, -0.29, -0.37, 0.86, 0.86, 0.86, 1.87, 2.81, 2.81, 3.61, 3.61, 3.61, 3.61, 3.61, 5.88, 5.88, 7.34, 7.34, 8.56, 8.56, 8.56, 8.56, 8.56, 7.56, 6.56, 7.98, 6.98, 4.98, 5.28, 5.28, 5.28, 5.05, 4.05, 2.14, 2.14, 2.14, 2.14, 2.14, 2.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 1.99, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 4.15, 10.44, 10.44, 10.44, 10.44, 10.44, 10.44, 10.44, 10.44, 11.52, 11.52, 11.52, 13.16, 14.96, 14.96, 14.96, 14.96]
```

```mermaid
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#3b82f6,#22c55e,#f97316,#ef4444,#a855f7"}}}}%%
xychart-beta
    title "Cumulative win rate by path (%)"
    x-axis ["06-15", "06-16", "06-17", "06-18", "06-19", "06-20", "06-21", "06-22", "06-23", "06-24", "06-25", "06-26", "06-27", "06-28", "06-29", "06-30", "07-01", "07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08", "07-09", "07-10", "07-11", "07-12", "07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27", "07-28", "07-29", "07-30", "07-31", "08-01", "08-02", "08-03", "08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17", "08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24", "08-25", "08-26", "08-27", "08-28", "08-29", "08-30", "08-31", "09-01", "09-02", "09-03", "09-04", "09-05", "09-06", "09-07", "09-08", "09-09", "09-10", "09-11", "09-12", "09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26", "09-27", "09-28", "09-29", "09-30", "10-01", "10-02", "10-03", "10-04"]
    y-axis "Win %" 0 --> 100
    line [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 67, 67, 67, 67, 67, 80, 67, 71, 75, 78, 78, 78, 78, 80, 82, 82, 82, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 73, 69, 69, 72, 74, 74, 74, 75, 71, 71, 68, 71, 71, 72, 71, 72, 72, 72, 70, 70, 68, 66, 66, 66, 66, 66, 67, 69, 69, 70, 70, 70, 71, 69, 69, 70, 71, 70, 70, 70, 70, 70, 70, 68, 68]
    line [0, 67, 67, 60, 71, 67, 70, 73, 73, 75, 77, 67, 72, 70, 67, 68, 61, 65, 67, 65, 62, 63, 64, 63, 63, 62, 62, 60, 60, 60, 59, 58, 59, 58, 58, 59, 57, 57, 56, 57, 58, 58, 57, 58, 59, 59, 58, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 54, 54, 53, 53, 53, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 54, 54, 54, 54, 53, 54, 54, 54, 54, 54, 54, 54, 55, 55, 55, 55, 55, 54, 54, 54]
    line [0, 0, 0, 0, 0, 100, 100, 100, 100, 75, 57, 64, 58, 57, 62, 65, 59, 56, 55, 57, 57, 56, 53, 56, 56, 56, 52, 52, 52, 52, 52, 52, 51, 51, 51, 50, 53, 53, 53, 52, 52, 51, 51, 52, 52, 52, 52, 51, 52, 52, 53, 52, 52, 52, 52, 52, 51, 52, 52, 52, 52, 52, 51, 51, 50, 51, 50, 50, 50, 50, 50, 50, 50, 49, 48, 49, 49, 49, 50, 50, 50, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 49, 49, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
    line [100, 50, 56, 64, 57, 60, 56, 59, 52, 48, 48, 48, 48, 46, 48, 47, 47, 47, 47, 47, 48, 48, 47, 47, 49, 49, 49, 49, 49, 49, 49, 49, 53, 53, 53, 53, 54, 53, 53, 56, 56, 56, 55, 56, 56, 56, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 63, 61, 59, 59, 59, 59, 61, 60, 61, 62, 61, 61, 61, 61, 61, 59, 58, 58, 58, 57, 57, 57, 57, 56, 55, 55, 56, 55, 54, 54, 55, 56, 56, 56, 56, 56, 56, 56, 55, 55, 54, 55, 55, 55, 52, 52, 52, 52, 52, 52, 53, 53, 53]
    line [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 67, 71, 63, 60, 60, 54, 54, 57, 57, 60, 60, 60, 56, 56, 56, 56, 56, 53, 57, 52, 52, 54, 54, 54, 57, 55, 55, 53, 53, 55, 55, 57, 58, 59, 56, 56, 56, 57, 55, 55, 55, 54, 52, 52, 51, 53, 52, 52, 51, 51, 51, 52, 51, 51, 52, 52, 53, 53, 54, 54, 54, 54, 54, 54, 54, 55, 56, 57, 57, 57, 57, 57, 57, 58, 57, 58, 58, 58, 57, 57, 58, 56, 56, 55, 54, 55, 55, 55, 54, 54, 54, 54, 54, 54, 55, 55]
```

## § 5 — Tape Era (sizing + side profile · 2026-07-15+)

### 5a — TAPE sizing impact

From **2026-07-15**, path units are resized by **TAPE** = `2·(EDGE/10) + 1.5·(netCLV/10)`: mute if tape &lt; 0 · hold mid · boost if ≥ 2.89 (×1.35, 6u cap). Missing tape = fail-open. See `docs/TAPE_SIZING.md`.

### Coverage

| Window | Sides | With tape stamp | Graded w/ stamp |
|--------|------:|----------------:|----------------:|
| ≥ 2026-07-15 | 3668 | 3659 | 3578 |

### (A) By tape action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 276 | 144-132 | 52.2% | 70.50u | +4.45u | +6.3% |
| HOLD      | 1261 | 647-614 | 51.3% | 1394.32u | +38.88u | +2.8% |
| BOOST     | 375 | 209-166 | 55.7% | 698.88u | +64.96u | +9.3% |
| FAIL_OPEN | 90 | 48-42 | 53.3% | 76.50u | -25.16u | -32.9% |
| PASS      | 1576 | 792-784 | 50.3% | 15.50u | -3.52u | -22.7% |

### (B) Tape score ladder (graded, score present)

| Tape bucket | Rule | N | W-L | Win % | Staked PnL |
|-------------|------|--:|:---:|------:|-----------:|
| mute (<0) | → 0u | 1311 | 686-625 | 52.3% | +17.90u |
| hold (0–2.89) | path u | 1488 | 737-751 | 49.5% | +24.81u |
| boost (≥2.89) | ×1.35 | 455 | 248-207 | 54.5% | +62.91u |

_Score coverage: **3254/3578** graded stamped rows have `v8_tapeScore`._

### (C) Counterfactual impact vs path units

> **Mute CF:** path units that tape zeroed — if those had shipped, what PnL? Positive Δ = tape saved money (avoided losses). **Boost CF:** actual PnL − PnL at path size (pre-boost). Positive Δ = boost added value.

| Mute CF | N | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|------------------------:|-----------------:|---------------:|------------:|
| tape-weak → 0u | 276 | +1.27u | -1.27u | +179.75u | +181.02u |

| Boost CF | N | PnL @ path u | PnL @ boosted | Δ (boost value) |
|----------|--:|-------------:|--------------:|----------------:|
| tape ≥ 2.89 ×1.35 | 151 | +43.60u | +64.96u | +21.36u |

> Path units for CF prefer stamped `v8_unitsPreTape`; else ladder default for `v8_hcStakeTier`. Early tape-era picks may lack `unitsPreTape` until the next cron cycle backfills.

### (D) Recent mute / boost events

| Date | Sport | Pick | Path | Tape | Act | Pre-u | Final | Outcome |
|------|-------|------|------|-----:|-----|------:|------:|---------|
| 2026-10-04 | NFL | Giants | MINI | 3.55 | BOOST | 2.50u | 0.00u | — |
| 2026-10-04 | NFL | 49ers | HC-1 | 4.36 | BOOST | 4.00u | 4.00u | — |
| 2026-10-04 | NFL | Chiefs | CONFIRMED-Q1 | -0.44 | MUTE | 3.00u | 3.00u | — |
| 2026-10-04 | NFL | Seahawks | 2-for-0 | 3.31 | BOOST | 5.00u | 0.00u | — |
| 2026-10-04 | NFL | Cardinals | CONFIRMED-UNOPP | -0.15 | MUTE | 1.00u | 0.00u | — |
| 2026-10-04 | NFL | Under 51.5 | 2-for-0 | 4.67 | BOOST | 5.00u | 0.00u | — |
| 2026-10-03 | CFB | Central Michigan | SHARP~ | 3.74 | BOOST | 4.00u | 0.00u | WIN |
| 2026-10-03 | CFB | Alabama | MINI | 5.89 | BOOST | 4.00u | 5.40u | WIN |
| 2026-10-03 | CFB | UNLV | SHARP~ | -1.36 | MUTE | 1.00u | 1.00u | WIN |
| 2026-10-03 | MLB | Tampa Bay Rays | SHARP | 4.06 | BOOST | 3.00u | 0.00u | WIN |
| 2026-10-03 | NHL | Penguins | SHARP~ | 4.03 | BOOST | 4.00u | 0.00u | WIN |
| 2026-10-03 | NHL | Lightning | HC-1 | 4.42 | BOOST | 4.00u | 0.00u | WIN |
| 2026-10-03 | UFC | Alden Coria | SHARP~ | 3.81 | BOOST | 2.50u | 0.00u | LOSS |
| 2026-10-03 | UFC | Anthony Wint | 2-for-0 | 3.23 | BOOST | 5.00u | 0.00u | WIN |
| 2026-10-03 | UFC | Jacobe Smith | 2-for-0 | 4.90 | BOOST | 5.00u | 0.00u | WIN |

## § 5q — qConv Q1 Mute (2026-08-03+)

Final dial after tape / EDGE abs. **qConv** = `Σ sizeRatio×(WR−50) FOR − Σ sizeRatio×(WR−50) AG` (same featured WR source as EDGE, n≥8). Mute Path C SHARP* when `qConv < expanding Q1 thr` of prior staked A/B/C since 2026-06-15. **Path A + RANK + CONFIRMED-UNOPP/Q1 exempt**. Fail-open if qConv/thr missing. DISSENT + manual stake exempt. See `docs/SKILL_FEATURES.md`.

**Live thr cache** (`qConvMuteState/current`): **-0.64** · nPriors=699 · source=expanding_q1 · asOf=2026-10-04 · fallback=0

### Coverage

| Window | Sides | With qConv stamp | Graded w/ stamp | Mute-eligible tiers graded |
|--------|------:|-----------------:|----------------:|------------------:|
| ≥ 2026-08-03 | 3222 | 3103 | 3030 | 651 |

### (A) By qConv action (stamped + graded)

| Action | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| MUTE      | 248 | 110-138 | 44.4% | 15.00u | -7.29u | -48.6% |
| HOLD      | 656 | 337-319 | 51.4% | 382.00u | +6.40u | +1.7% |
| FAIL_OPEN | 77 | 36-41 | 46.8% | 48.90u | -2.73u | -5.6% |
| EXEMPT    | 1365 | 727-638 | 53.3% | 1279.65u | +55.29u | +4.3% |

### (B) qConv quintiles (Path A/B/C · graded · score present)

| Quintile | qConv range | N | W-L | Win % | Stake | PnL | ROI |
|----------|-------------|--:|:---:|------:|------:|----:|----:|
| Q1 (mute) | -249.7 … -3.2 | 121 | 53-68 | 43.8% | 3.0u | -1.06u | -35.3% |
| Q2 | -3.2 … 1.4 | 122 | 54-68 | 44.3% | 39.9u | +17.11u | +42.9% |
| Q3 | 1.4 … 7.2 | 122 | 67-55 | 54.9% | 80.3u | -7.17u | -8.9% |
| Q4 | 7.2 … 21.0 | 122 | 60-62 | 49.2% | 111.1u | -25.83u | -23.2% |
| Q5 | 21.1 … 1802.6 | 122 | 70-52 | 57.4% | 110.7u | +20.31u | +18.3% |

_Q1 is the toxic pile the mute targets. Q5 should be the strongest — if Q1 WR/ROI is not the worst, the policy may be drifting._

### (C) Mute counterfactual (would-have-shipped PnL)

> If qConv-muted tickets had kept `v8_unitsPreQConv` (else pre-tape / path ladder), what PnL? **Positive Δ** = mute saved money.

| Mute CF | N | W-L | PnL if path had shipped | Δ vs actual (0u) | Avoided losses | Missed wins |
|---------|--:|:---:|------------------------:|-----------------:|---------------:|------------:|
| qconv-q1 → 0u | 248 | 110-138 | -17.81u | +17.81u | +169.40u | +151.59u |

> 🟢 **Mute is saving money** (Δ +17.81u · muted WR 44.4%). Keep the Q1 cut.

### (D) Muted pile mix (graded MUTE)

| Slice | N | W-L | Win % | Pre-u stake (CF) | CF PnL |
|-------|--:|:---:|------:|-----------------:|-------:|
| Path A | 6 | 4-2 | 66.7% | 8.0u | +3.09u |
| Path B | 1 | 0-1 | 0.0% | 3.0u | -3.00u |
| Path C | 111 | 44-67 | 39.6% | 137.9u | -23.31u |
| CFB | 31 | 14-17 | 45.2% | 54.9u | +11.62u |
| MLB | 148 | 68-80 | 45.9% | 167.5u | -11.17u |
| NFL | 29 | 10-19 | 34.5% | 39.4u | -14.72u |
| SOC | 9 | 4-5 | 44.4% | 12.5u | +2.90u |
| UFC | 2 | 1-1 | 50.0% | 4.0u | +0.59u |
| WNBA | 29 | 13-16 | 44.8% | 33.0u | -7.02u |

### (E) Recent qConv mutes

| Date | Sport | Pick | Path | qConv | Thr | Pre-u | Outcome |
|------|-------|------|------|------:|----:|------:|---------|
| 2026-10-03 | CFB | Auburn | SHARP~ | -6.7 | -0.4 | 1.00u | LOSS |
| 2026-10-03 | MLB | Atlanta Braves | SHARP~ | -1.1 | -0.4 | 1.00u | LOSS |
| 2026-10-03 | UFC | Esteban Ribovics | — | -3.1 | -0.4 | 3.00u | WIN |
| 2026-10-03 | CFB | USC | CONFIRMED-UNOPP | -10.9 | -0.4 | 1.00u | LOSS |
| 2026-10-03 | CFB | Under 45.5 | SHARP~ | -30.1 | -0.4 | 1.00u | WIN |
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

### (F) Book impact summary

| Book | N | W-L | Win % | Stake | PnL | ROI |
|------|--:|:---:|------:|------:|----:|----:|
| Kept (HOLD, units&gt;0) | 110 | 56-54 | 50.9% | 340.0u | +2.57u | +0.8% |
| Muted (Q1 → 0u) | 248 | 110-138 | 44.4% | 15.0u | -7.29u | -48.6% |

> Early window will be thin until 2026-08-03+ tickets grade. The policy is validated on Jun15+/Jul15+ staked history — this section tracks whether live continues to match.

### 5b — Skill bands (EDGE · NetCLV · Tape)

Staked graded (`finalUnits > 0`, WIN/LOSS). Metric = **stamp if present, else as-of** (featured sport WR n≥8 / causal CLV ledger / `computeTapeScore`). Windows: **Jun 15+** · **Jul 15+** · **yesterday**.

- **EDGE** bands: `<5` / `5–10` / `≥10` · mean FOR WR − (mean AG ?? 50)
- **NetCLV** bands: same · mean FOR %+CLV − (mean AG ?? 62)
- **Tape** bands: policy `<0` / mid / `≥2.89` · `2·(EDGE/10) + 1.5·(netCLV/10)`

> **Watch:** EDGE ≥10 is the separator (Jun15+ 186–112 · 62.4% · +12.2%); **5–10 is the hole** (119–116 · 50.6% · -1.6%). Net ≥10 can flip cold in the Jul15+ window — read across metrics.

#### EDGE

_mean FOR sport WR − (mean AG ?? 50)_

##### Jun 15+ · 997 tickets · cov 965/997 (stamp 763 / as-of 202)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 432 | 223–209 | 51.6% | -2.1% |
| 5–10 | 235 | 119–116 | 50.6% | -1.6% |
| ≥10 | 298 | 186–112 | 62.4% | +12.2% |
| All | 997 | 543–454 | 54.5% | +3.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 50.5% (111) | 53.4% (88) | 68.4% (117) |
| B | 54.1% (85) | 52.6% (19) | 64.3% (28) |
| C | 40.5% (42) | 44.3% (70) | 56.3% (119) |

##### Jul 15+ · 786 tickets · cov 760/786 (stamp 758 / as-of 2)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 326 | 170–156 | 52.1% | +0.8% |
| 5–10 | 196 | 96–100 | 49.0% | -3.0% |
| ≥10 | 238 | 147–91 | 61.8% | +9.8% |
| All | 786 | 425–361 | 54.1% | +3.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 48.1% (52) | 50.8% (59) | 68.4% (76) |
| B | 54.2% (59) | 42.9% (14) | 61.9% (21) |
| C | 42.9% (21) | 44.6% (65) | 56.9% (109) |

##### Yesterday (Oct 3) · 25 tickets · cov 24/25 (stamp 24 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 7 | 5–2 | 71.4% | +31.3% |
| 5–10 | 8 | 1–7 | 12.5% | -80.2% |
| ≥10 | 9 | 3–6 | 33.3% | -40.7% |
| All | 25 | 10–15 | 40.0% | -32.7% |

| Path | E<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | — | 0% (4) | 33.3% (3) |
| B | 66.7% (3) | 0% (1) | — |
| C | 100% (2) | 50% (2) | 66.7% (3) |

#### NetCLV

_mean FOR causal %+CLV − (mean AG ?? 62) · bands mirror EDGE_

##### Jun 15+ · 997 tickets · cov 988/997 (stamp 777 / as-of 211)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 680 | 376–304 | 55.3% | +4.1% |
| 5–10 | 161 | 82–79 | 50.9% | +2.6% |
| ≥10 | 147 | 82–65 | 55.8% | +5.3% |
| All | 997 | 543–454 | 54.5% | +3.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 56.9% (209) | 50% (56) | 69.5% (59) |
| B | 57.3% (103) | 50% (16) | 53.8% (13) |
| C | 50.4% (135) | 54.9% (51) | 43.1% (51) |

##### Jul 15+ · 786 tickets · cov 778/786 (stamp 777 / as-of 1)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 530 | 298–232 | 56.2% | +6.9% |
| 5–10 | 138 | 69–69 | 50.0% | +1.5% |
| ≥10 | 110 | 55–55 | 50.0% | -4.7% |
| All | 786 | 425–361 | 54.1% | +3.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 60% (115) | 47.5% (40) | 60.5% (38) |
| B | 54.7% (75) | 50% (12) | 57.1% (7) |
| C | 53.7% (108) | 54.2% (48) | 40.5% (42) |

##### Yesterday (Oct 3) · 25 tickets · cov 25/25 (stamp 25 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <5 | 20 | 8–12 | 40.0% | -27.8% |
| 5–10 | 1 | 0–1 | 0.0% | -100.0% |
| ≥10 | 4 | 2–2 | 50.0% | -46.8% |
| All | 25 | 10–15 | 40.0% | -32.7% |

| Path | N<5 WR | 5–10 WR | ≥10 WR |
|------|---:|---:|---:|
| A | 20% (5) | 0% (1) | 0% (1) |
| B | 50% (4) | — | — |
| C | 60% (5) | — | 100% (2) |

#### Tape

_2·(EDGE/10) + 1.5·(netCLV/10) · mute <0 · boost ≥2.89_

##### Jun 15+ · 997 tickets · cov 963/997 (stamp 755 / as-of 208)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 217 | 111–106 | 51.2% | -8.4% |
| 0–2.89 | 547 | 290–257 | 53.0% | +4.6% |
| ≥2.89 | 199 | 127–72 | 63.8% | +13.2% |
| All | 997 | 543–454 | 54.5% | +3.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 37.2% (43) | 55.3% (190) | 75.6% (82) |
| B | 57.1% (42) | 54.9% (71) | 57.9% (19) |
| C | 30.8% (13) | 49.6% (139) | 53.8% (78) |

##### Jul 15+ · 786 tickets · cov 758/786 (stamp 755 / as-of 3)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 148 | 83–65 | 56.1% | +5.3% |
| 0–2.89 | 456 | 236–220 | 51.8% | +1.9% |
| ≥2.89 | 154 | 94–60 | 61.0% | +9.0% |
| All | 786 | 425–361 | 54.1% | +3.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | 0% (1) | 51.1% (133) | 75% (52) |
| B | 53.8% (26) | 55.4% (56) | 50% (12) |
| C | 100% (2) | 50% (120) | 52.8% (72) |

##### Yesterday (Oct 3) · 25 tickets · cov 24/25 (stamp 24 / as-of 0)

| Band | n | Record | WR | ROI |
|------|--:|:------:|---:|----:|
| <0 | 5 | 3–2 | 60.0% | +6.8% |
| 0–2.89 | 15 | 5–10 | 33.3% | -42.3% |
| ≥2.89 | 4 | 1–3 | 25.0% | -46.5% |
| All | 25 | 10–15 | 40.0% | -32.7% |

| Path | <0 WR | 0–2.89 WR | ≥2.89 WR |
|------|---:|---:|---:|
| A | — | 0% (5) | 50% (2) |
| B | 33.3% (3) | 100% (1) | — |
| C | 100% (1) | 66.7% (6) | — |

### 5c — Side profile (WIN vs LOSS)

From **2026-07-15** we stamp depth + quality on every shipped side. Compare means on **WIN vs LOSS**. Separators are gate/sizing candidates; flat metrics are noise. N is still early — treat ranks as hypotheses.

### Coverage

| Window | Graded live | W-L | Win % | Stake | PnL |
|--------|------------:|:---:|------:|------:|----:|
| ≥ 2026-07-15 | 786 | 425-361 | 54.1% | 2249.70u | +83.04u |

### (A) Metric means — WIN side vs LOSS side

Δ = mean(WIN) − mean(LOSS). Positive Δ on a “higher helps” metric = winners look stronger on that axis.

| Family | Metric | Cov | mean WIN | mean LOSS | Δ (W−L) | med WIN | med LOSS |
|--------|--------|----:|---------:|----------:|--------:|--------:|---------:|
| depth   | #F sharps        | 786/786 | 3.21 | 3.21 | +0.00 | 3.00 | 2.00 |
| depth   | #A sharps        | 786/786 | 1.79 | 1.81 | -0.02 | 1.00 | 1.00 |
| depth   | #F − #A          | 786/786 | 1.42 | 1.40 | +0.02 | 1.00 | 1.00 |
| depth   | proven F         | 786/786 | 2.18 | 2.14 | +0.05 | 2.00 | 2.00 |
| depth   | proven A         | 786/786 | 0.82 | 0.84 | -0.02 | 0.00 | 0.00 |
| depth   | proven F−A       | 786/786 | 1.36 | 1.30 | +0.07 | 1.00 | 1.00 |
| depth   | v12 F count      | 786/786 | 3.21 | 3.15 | +0.07 | 2.00 | 2.00 |
| depth   | v12 A count      | 786/786 | 1.84 | 1.83 | +0.00 | 1.00 | 1.00 |
| depth   | WA ForN          | 786/786 | 2.49 | 2.55 | -0.06 | 2.00 | 2.00 |
| depth   | WA AgN           | 786/786 | 1.43 | 1.50 | -0.07 | 1.00 | 1.00 |
| depth   | CLV ForN         | 785/786 | 2.88 | 2.84 | +0.04 | 2.00 | 2.00 |
| depth   | CLV AgN          | 785/786 | 1.69 | 1.71 | -0.02 | 1.00 | 1.00 |
| depth   | unopposed (A=0)  | 786/786 | 0.31 | 0.28 | +0.03 | 0.00 | 0.00 |
| quality | ForWR            | 758/786 | 56.65 | 55.60 | +1.05 | 54.80 | 54.70 |
| quality | AgWR             | 522/786 | 46.60 | 47.79 | -1.19 | 47.94 | 48.67 |
| quality | TopFor WR        | 758/786 | 62.57 | 61.68 | +0.89 | 58.90 | 58.90 |
| quality | TopAg WR         | 522/786 | 50.01 | 51.14 | -1.13 | 50.78 | 51.14 |
| quality | EDGE             | 758/786 | 8.89 | 6.97 | +1.93 | 7.00 | 5.54 |
| quality | ForCLV           | 777/786 | 62.93 | 63.19 | -0.26 | 63.33 | 63.76 |
| quality | AgCLV            | 556/786 | 62.26 | 61.68 | +0.57 | 63.22 | 62.83 |
| quality | netCLV           | 777/786 | 0.75 | 1.42 | -0.67 | 1.04 | 1.46 |
| quality | Tape             | 755/786 | 1.90 | 1.57 | +0.32 | 1.45 | 1.26 |
| quality | V12 score        | 786/786 | 0.78 | 0.76 | +0.02 | 0.95 | 0.93 |
| quality | V12 forMean      | 786/786 | 31.84 | 28.40 | +3.44 | 25.95 | 20.45 |
| quality | V12 agMean       | 786/786 | 4.60 | 4.66 | -0.06 | 0.00 | 0.00 |

### (B) Separation rank — which metrics tell W from L

AUC: chance a random WIN scores higher than a random LOSS on that metric (0.50 = coin flip). Sorted by |AUC−0.5|. ρ / r_pb = Spearman / point-biserial vs won.

| Rank | Metric | Family | Cov | AUC | ρ | r_pb | Δ (W−L) | Read |
|-----:|--------|--------|----:|----:|--:|-----:|--------:|------|
|    1 | EDGE             | quality | 758/786 | 0.544 | +0.020 | +0.093 | +1.93 | 🟡 mild OK |
|    2 | AgWR             | quality | 522/786 | 0.458 | +0.110 | -0.087 | -1.19 | 🟡 mild OK |
|    3 | V12 score        | quality | 786/786 | 0.541 | -0.005 | +0.034 | +0.02 | 🟡 mild OK |
|    4 | TopAg WR         | quality | 522/786 | 0.468 | +0.085 | -0.064 | -1.13 | flat |
|    5 | V12 forMean      | quality | 786/786 | 0.531 | +0.208 | +0.060 | +3.44 | flat |
|    6 | V12 agMean       | quality | 786/786 | 0.474 | +0.300 | -0.003 | -0.06 | flat |
|    7 | Tape             | quality | 755/786 | 0.526 | -0.090 | +0.058 | +0.32 | flat |
|    8 | proven F−A       | depth   | 786/786 | 0.524 | +0.217 | +0.021 | +0.07 | flat |
|    9 | unopposed (A=0)  | depth   | 786/786 | 0.523 | +0.214 | +0.028 | +0.03 | flat |
|   10 | AgCLV            | quality | 556/786 | 0.523 | -0.001 | +0.038 | +0.57 | flat |
|   11 | netCLV           | quality | 777/786 | 0.477 | -0.160 | -0.029 | -0.67 | flat |
|   12 | TopFor WR        | quality | 758/786 | 0.521 | +0.212 | +0.042 | +0.89 | flat |
|   13 | proven A         | depth   | 786/786 | 0.480 | +0.270 | -0.008 | -0.02 | flat |
|   14 | ForCLV           | quality | 777/786 | 0.480 | -0.219 | -0.014 | -0.26 | flat |
|   15 | ForWR            | quality | 758/786 | 0.517 | +0.073 | +0.061 | +1.05 | flat |
|   16 | proven F         | depth   | 786/786 | 0.513 | +0.315 | +0.014 | +0.05 | flat |
|   17 | CLV ForN         | depth   | 785/786 | 0.511 | +0.277 | +0.009 | +0.04 | flat |
|   18 | #A sharps        | depth   | 786/786 | 0.489 | +0.198 | -0.004 | -0.02 | flat |
|   19 | WA ForN          | depth   | 786/786 | 0.491 | +0.280 | -0.015 | -0.06 | flat |
|   20 | WA AgN           | depth   | 786/786 | 0.493 | +0.201 | -0.022 | -0.07 | flat |
|   21 | v12 A count      | depth   | 786/786 | 0.494 | +0.191 | +0.001 | +0.00 | flat |
|   22 | v12 F count      | depth   | 786/786 | 0.505 | +0.282 | +0.013 | +0.07 | flat |
|   23 | CLV AgN          | depth   | 785/786 | 0.496 | +0.185 | -0.006 | -0.02 | flat |
|   24 | #F sharps        | depth   | 786/786 | 0.502 | +0.281 | +0.000 | +0.00 | flat |
|   25 | #F − #A          | depth   | 786/786 | 0.500 | +0.160 | +0.004 | +0.02 | flat |

### (C) Working read

_N=786 is still early — treat ranks as hypotheses, not gates._

- **EDGE** — AUC 0.544 · Δ +1.93 · higher on WINs (cov 758/786)
- **AgWR** — AUC 0.458 · Δ -1.19 · higher on LOSSes (cov 522/786)
- **V12 score** — AUC 0.541 · Δ +0.02 · higher on WINs (cov 786/786)

_Stamped / derived only — no wallet profile replay. Unopposed sides keep FOR quality (EDGE uses AG prior 50). Audit trail rows: § 11._

### 5d — Ticket EV / steam lifecycle (tracking only)

`v8_ticketTapeLog` keeps **first / hourly / T-60 / T-15 / grade** samples of card EV and Pinnacle steam. Scalars still freeze at T-15; the log is the path. Does **not** size units. Gold + rising limits (Closing Dime combo) uses log flags when present, else freeze `v8_steam`. See `docs/SKILL_FEATURES.md` and `docs/CLOSING_DIME_STEAM_EDGE.md`.

| Window | Staked sides | With log | First+lock | Graded w/ log |
|--------|-------------:|---------:|-----------:|--------------:|
| v16+ lifecycle | 1294 | 499 | 499 | 482 |

#### Steam on at first vs lock

| Path | N | W-L | Win % | Stake | PnL (u) | ROI | mean ΔEV |
|------|--:|:---:|------:|------:|--------:|----:|---------:|
| on→on | 96 | 53-43 | 55.2% | 303.30u | +15.12u | +5.0% | -0.8 |
| on→off | 15 | 7-8 | 46.7% | 46.70u | -3.56u | -7.6% | -4.7 |
| off→on | 108 | 58-50 | 53.7% | 333.35u | +15.60u | +4.7% | +1.4 |
| off→off | 263 | 141-122 | 53.6% | 714.60u | -0.99u | -0.1% | -0.5 |

#### EV at lock

| EV@t15 | N | W-L | Win % | Stake | PnL (u) | ROI |
|--------|--:|:---:|------:|------:|--------:|----:|
| <0 | 291 | 155-136 | 53.3% | 885.80u | +5.28u | +0.6% |
| 0–2 | 143 | 80-63 | 55.9% | 392.75u | +41.86u | +10.7% |
| 2–4 | 28 | 16-12 | 57.1% | 80.90u | +2.83u | +3.5% |
| 4+ | 20 | 8-12 | 40.0% | 38.50u | -23.80u | -61.8% |

#### Gold steam + rising limits (Closing Dime combo)

Gold = last-hour (else since-open) drop ≥ 4.5%. Limits rising = Pinnacle max +$2,000 or ×1.45 vs open. **gold+limits** is the gold card. Tracking only — do not size from this table until N is honest.

| Signal at lock | N | W-L | Win % | Stake | PnL (u) | ROI |
|----------------|--:|:---:|------:|------:|--------:|----:|
| gold+limits | 9 | 6-3 | 66.7% | 29.00u | +4.09u | +14.1% |
| gold, limits flat | 9 | 5-4 | 55.6% | 25.80u | +9.09u | +35.2% |
| steam, not gold | 186 | 100-86 | 53.8% | 581.85u | +17.54u | +3.0% |
| limits↑, no steam | 14 | 7-7 | 50.0% | 39.80u | +4.64u | +11.7% |
| neither | 264 | 141-123 | 53.4% | 721.50u | -9.19u | -1.3% |

#### Steam × Source A/B CONFIRMED on the same side

CONFIRMED wallet on FOR with `whitelistSource` A (featured) and/or B (on-chain). Uses current profiles (same mild look-ahead as § 5a RANK). Tracking only.

| Cell | N | W-L | Win % | Stake | PnL (u) | ROI |
|------|--:|:---:|------:|------:|--------:|----:|
| A/B + steam at lock | 164 | 91-73 | 55.5% | 536.05u | +22.09u | +4.1% |
| A/B + no steam | 204 | 111-93 | 54.4% | 550.20u | +20.94u | +3.8% |
| A/B + steam arriving | 81 | 44-37 | 54.3% | 263.55u | +8.42u | +3.2% |
| A/B + gold | 12 | 7-5 | 58.3% | 36.40u | +9.31u | +25.6% |
| steam at lock, no A/B | 40 | 20-20 | 50.0% | 100.60u | +8.63u | +8.6% |
| Source B + steam arriving | 81 | 44-37 | 54.3% | 263.55u | +8.42u | +3.2% |

## § 6 — Sport & Market

V12 finds different amounts of edge in different sports and bet types. This grid shows live performance per sport × market cell. Each cell: `N · Win% · ROI` over LIVE shipped picks (units > 0).

| Sport | ML                     | SPREAD                 | TOTAL                  | All                    |
|-------|------------------------|------------------------|------------------------|------------------------|
| CFB   | 23n · 65.2% · +4.1%    | 28n · 53.6% · +1.4%    | 9n · 33.3% · -26.6%    | 60n · 55.0% · -1.3%    |
| MLB   | 457n · 55.1% · +8.3%   | 107n · 53.3% · -3.2%   | 364n · 50.8% · +0.8%   | 928n · 53.2% · +3.8%   |
| NBA   | 5n · 0.0% · -100.0%    | 3n · 66.7% · +78.9%    | 2n · 50.0% · -60.8%    | 10n · 30.0% · +29.1%   |
| NFL   | 20n · 50.0% · -10.9%   | 12n · 58.3% · +6.4%    | 8n · 50.0% · +5.5%     | 40n · 52.5% · -2.8%    |
| NHL   | 8n · 37.5% · -53.9%    | 1n · 100.0% · +215.0%  | 3n · 66.7% · +25.1%    | 12n · 50.0% · -12.8%   |
| SOC   | 56n · 66.1% · +13.5%   | —                      | —                      | 56n · 66.1% · +13.5%   |
| UFC   | 41n · 70.7% · +14.8%   | —                      | —                      | 41n · 70.7% · +14.8%   |
| WNBA  | 30n · 73.3% · +3.4%    | 21n · 42.9% · +0.1%    | 17n · 41.2% · -16.2%   | 68n · 55.9% · -1.8%    |
| **All** | **640n · 57.5% · +7.4%** | **172n · 52.9% · +0.1%** | **403n · 50.1% · -0.1%** | **1215n · 54.4% · +3.8%** |

> **V12's strongest sub-market:** NBA SPREAD — 3 live, 2-1, +78.9% ROI, +4.34u PnL.

## § 7 — Mute Audit

V12 muted **2611** graded picks (any pick with score ≤ 0). This sub-section asks the most important question about V12: **were those rejections correct?**

The audit is a counterfactual — if every muted pick had been shipped at a flat 1-unit stake (same risk per pick), what would the bottom line look like? If muting saved money, V12's rule is justified. If muting cost money, V12 is throwing away edge and the wallet-quality threshold should be loosened.

| Metric                              | Value                |
|-------------------------------------|----------------------|
| Muted picks (graded)                |                 2611 |
| Muted W-L                           |            1311-1300 |
| Muted Win %                         |                50.2% |
| Counterfactual PnL at flat 1u       |               -80.97 |
| Counterfactual ROI at flat 1u       |                -3.1% |

### Verdict

🟢 **THE MUTE RULE IS SAVING MONEY.** The picks V12 rejected would have lost **-80.97u** at a flat 1u stake — a counterfactual ROI of **-3.1%**. V12 is correctly identifying losers and refusing to ship them. **Keep the mute rule as-is.**

## § 8 — Recent Live Picks (Audit Trail)

The last 30 picks V12 actually shipped (units > 0). Audit trail keeps **quality + depth** on every row (unopposed included) so WIN vs LOSS sides can be profiled.

> **Depth:** `#F/#A` = unique sharps FOR/AGAINST from frozen `walletDetails` · `pF/pA` = proven (HC_BASE) counts. **Quality:** ForWR / ForCLV / EDGE / Tape (AG blanks use priors; live `TapeAct` stays what the sizer did).

| Date       | Sport | Mkt    | Pick                    | Odds  | V12   | Path     | #F/#A | pF/pA | ForWR | ForCLV | EDGE   | Tape  | TapeAct  | Stake | Outcome | PnL (u)    |
|------------|-------|--------|-------------------------|-------|-------|----------|------:|------:|------:|-------:|--------|------:|----------|------:|---------|------------|
| 2026-10-04 | NFL   | SPREAD | Commanders              |  +100 | +0.390 | CONFIRMED-Q1 | 14/12 |   5/1 |  46.6 |   66.3 |   +1.2 |  1.12 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-10-03 | CFB   | ML     | Alabama                 |  -205 | +0.965 | MINI     |   3/3 |   1/0 |  59.7 |   67.3 |  +29.2 |  5.89 | BOOST    | 5.40u | WIN     |      +2.84 |
| 2026-10-03 | CFB   | ML     | UNLV                    |  -111 | +0.851 | SHARP~   |   4/4 |   1/0 |  38.2 |   74.7 |  -14.5 | -1.36 | MUTE     | 1.00u | WIN     |      +0.94 |
| 2026-10-03 | CFB   | ML     | Florida                 |  -218 | +0.877 | MINI     |   1/4 |   1/1 |  61.6 |   50.0 |  +13.4 |  0.62 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-10-03 | CFB   | ML     | Michigan                |  -218 | +0.988 | MINI     |   1/0 |   1/0 |  61.6 |   50.0 |  +11.6 |  0.53 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-10-03 | CFB   | ML     | Wisconsin               |  -335 | +0.995 | CONFIRMED-UNOPP |   2/0 |   2/0 |     — |   46.7 |      — |     — | FAIL_OPEN | 2.00u | WIN     |      +0.63 |
| 2026-10-03 | MLB   | ML     | Chicago White Sox       |  +138 | +0.905 | SHARP~   |   3/3 |   1/0 |  48.4 |   57.3 |   +5.0 |  2.60 | HOLD     | 1.00u | WIN     |      +1.32 |
| 2026-10-03 | NHL   | ML     | Kings                   |  -104 | +0.426 | CONFIRMED-Q1 |   6/5 |   2/1 |  60.4 |   60.9 |  +17.6 |  2.15 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-10-03 | UFC   | ML     | Marvin Vettori          |  +125 | +0.982 | HC-1     |   5/5 |   1/0 |  56.8 |   64.0 |   +5.1 |  0.82 | HOLD     | 2.00u | LOSS    |      -2.00 |
| 2026-10-03 | UFC   | ML     | Wang Cong               |  +180 | +0.982 | HC-1     |  12/6 |   3/0 |  53.6 |   54.7 |   +8.8 |  1.87 | HOLD     | 1.50u | LOSS    |      -1.50 |
| 2026-10-03 | CFB   | SPREAD | Central Michigan        |  -105 | +0.990 | SHARP~   |   2/3 |   2/0 |  58.0 |   67.0 |  +11.8 |  1.44 | HOLD     | 4.00u | WIN     |      +3.96 |
| 2026-10-03 | CFB   | SPREAD | Louisiana Tech          |  -112 | +0.996 | SHARP~   |   1/0 |   1/0 |  60.1 |   60.0 |  +10.1 |  1.73 | HOLD     | 3.00u | WIN     |      +2.40 |
| 2026-10-03 | CFB   | SPREAD | Louisiana               |  -109 | +0.475 | CONFIRMED-Q1 |   7/5 |   3/1 |  61.0 |   61.9 |  +15.4 |  3.29 | BOOST    | 4.00u | LOSS    |      -4.00 |
| 2026-10-03 | CFB   | SPREAD | Auburn                  |  -108 | +0.959 | CONFIRMED-Q1 |   8/2 |   2/0 |  53.8 |   56.9 |  +13.5 |  0.99 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-10-03 | CFB   | SPREAD | Arizona State           |  +108 | +0.998 | HC-1     |   1/0 |   1/0 |  59.0 |   67.5 |   +9.0 |  2.62 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-10-03 | CFB   | SPREAD | TCU                     |  -101 | +0.296 | SHARP~   |   2/2 |   2/2 |  61.1 |   68.7 |   +5.2 |  0.83 | PASS     | 2.00u | LOSS    |      -2.00 |
| 2026-10-03 | CFB   | SPREAD | Cincinnati              |  -113 | +0.964 | CONFIRMED-Q1 |   5/3 |   1/0 |  57.2 |   66.5 |   +6.2 |  3.03 | BOOST    | 3.00u | LOSS    |      -3.00 |
| 2026-10-03 | CFB   | SPREAD | Rutgers                 |  -108 | +0.996 | MINI     |   1/1 |   1/0 |  59.0 |   67.5 |   +8.0 |  3.50 | BOOST    | 3.00u | LOSS    |      -3.00 |
| 2026-10-03 | CFB   | SPREAD | NC State                |  -108 | +0.958 | 2-for-0  |   7/2 |   3/0 |  49.5 |   64.2 |   +4.2 | -1.01 | HOLD     | 3.00u | WIN     |      +3.00 |
| 2026-10-03 | CFB   | SPREAD | James Madison           |  -105 | +0.986 | SHARP~   |   3/1 |   2/0 |  55.9 |   63.7 |   +8.8 |  1.36 | HOLD     | 2.00u | WIN     |      +1.87 |
| 2026-10-03 | CFB   | SPREAD | Wake Forest             |  -104 | +0.207 | CONFIRMED-Q1 |   3/1 |   2/1 |  58.4 |   61.2 |   -8.7 | -1.16 | HOLD     | 3.00u | WIN     |      +2.94 |
| 2026-10-03 | CFB   | SPREAD | Syracuse                |  -108 | +0.972 | 2-for-0  |   4/1 |   2/0 |  56.9 |   58.0 |   +6.9 | -4.92 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-10-03 | CFB   | SPREAD | South Alabama           |  -103 | +0.943 | 2-for-0  |   3/0 |   1/0 |  52.2 |   63.8 |   +2.2 |  0.71 | HOLD     | 3.00u | WIN     |      +3.12 |
| 2026-10-03 | MLB   | SPREAD | Milwaukee Brewers       |  +117 | +0.993 | CONFIRMED-Q1 |   2/2 |   1/0 |  54.3 |   63.9 |   +3.0 |  0.93 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-10-03 | CFB   | TOTAL  | Over 49.5               |  +112 | +0.975 | 2-for-0  |   2/0 |   1/0 |  51.1 |   54.9 |   +1.1 | -0.85 | HOLD     | 3.00u | LOSS    |      -3.00 |
| 2026-10-03 | CFB   | TOTAL  | Under 51.5              |  -144 | +0.990 | SHARP~   |   1/0 |   1/0 |  65.9 |   57.9 |  +15.9 |  2.57 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-10-02 | CFB   | ML     | Liberty                 |  -254 | +0.990 | MINI     |   2/3 |   1/0 |  84.2 |   66.4 |  +37.5 |  7.42 | BOOST    | 5.40u | WIN     |      +2.11 |
| 2026-10-02 | CFB   | ML     | Penn State              |  -135 | +0.989 | HC-1     |   6/2 |   4/0 |  65.7 |   50.1 |  +19.0 |  1.36 | HOLD     | 4.00u | LOSS    |      -4.00 |
| 2026-10-02 | NHL   | ML     | Golden Knights          |  -189 | +0.977 | CONFIRMED-UNOPP |   4/3 |   1/0 |     — |   53.9 |      — |     — | FAIL_OPEN | 2.00u | LOSS    |      -2.00 |
| 2026-10-02 | NHL   | ML     | Red Wings               |  -122 | +0.996 | HC-1     |   2/2 |   1/0 |     — |   66.7 |      — |     — | FAIL_OPEN | 4.00u | LOSS    |      -4.00 |

> Full WIN vs LOSS means + separation ranks: **§ 5b**.

## § 9 — Predictive Health

Does the V12 score separate winners from losers (not just make money by luck)? Watch **AUC**: 0.50 = coin flip · 0.55 = usable · 0.60+ = strong. Rolling AUC below 0.50 = score is dying before ROI does.

### 12A — Discrimination: does V12 actually separate winners from losers?

Five lenses on **one** question: *do higher scores go with wins?* They're independent on purpose — AUC and KS look at the **ranking** (do winners sit higher than losers regardless of scale), while the correlations (Spearman / point-biserial) look at the **strength and consistency** of that relationship. When they all agree, the signal is trustworthy; when they disagree, the edge is fragile. All computed over **live shipped picks** (units > 0) with a graded outcome.

| Metric                                | Value    | Plain-English read                                                                 |
|---------------------------------------|----------|------------------------------------------------------------------------------------|
| AUC (ROC)                             |    0.537 | 0.50 = coin flip · 0.55 = real edge · 0.60+ = strong · _interpret as P(score(win) > score(loss))_ |
| KS statistic                          |    0.070 | Max gap between win-score CDF and loss-score CDF. 0.15+ ⇒ meaningful separation     |
| Spearman ρ(score, won)                |   -0.031 | Rank-correlation of score and binary outcome. Above 0.10 = useful signal           |
| Spearman ρ(score, unit-return)        |   -0.017 | Higher score should mean higher per-unit return. Above 0.10 = useful signal        |
| Point-biserial r(score, won)          |   +0.031 | Parametric cousin of Spearman ρ. Above 0.10 = useful signal                        |

> **AUC verdict:** 🟡 **Weak** — barely separating; close to a coin flip

### 12B — Predictive R² (regression of outcome on V12 score)

How much of the variance in actual outcomes does the V12 score actually explain? R² is the canonical "% of variance explained" — but with binary/sparse outcomes, R² is structurally small. The slope and direction matter at least as much as the magnitude.

| Target              | N    | slope (β)  | intercept  | R²     | r       | RMSE    | reads as                                                |
|---------------------|------|------------|------------|--------|---------|---------|---------------------------------------------------------|
| per-pick unit-return | 1210 |    +0.0459 |    -0.0301 | 0.0002 |  +0.013 |   0.949 | positive (higher score ⇒ better outcome)                 |
| won (binary)        | 1210 |    +0.0565 |    +0.4983 | 0.0010 |  +0.031 |   0.498 | positive (higher score ⇒ better outcome)                 |
| per-pick PnL (u)    | 1210 |    -0.0670 |    +0.1587 | 0.0000 |  -0.006 |   2.883 | negative (higher score ⇒ WORSE outcome)                  |

> Even a "small" R² of 0.02–0.05 is meaningful for sports picks — outcomes are 50%+ noise floor. The signs of the slopes and the direction of r are the primary check: if **slope < 0** on per-pick PnL, V12 is **anti-predictive** for sizing decisions and the ladder needs revisiting.

### 12C — Per-feature correlation (V12's actual inputs vs outcome)

The score above is a *blend* of inputs. Here we crack it open and test each ingredient **on its own**: FOR-side wallet quality, AGAINST-side wallet quality, how many wallets are on each side, and how many are `proven` (HC_BASE). For each one we ask "does this ingredient, by itself, line up with winning?" Two columns answer it: **r** (Pearson — strength of a straight-line relationship) and **ρ** (Spearman — same idea but rank-based, so one weird pick can't distort it). Numbers near **0** mean that ingredient is contributing noise, not signal; we'd want to down-weight it. A sign that's *backwards* (e.g. AGAINST-side quality showing a positive correlation with our wins) means the input is wired against us. The most important sanity check: `agsV12ForMean` should be **positive**, `agsV12AgMean` should be **negative**.

| Feature           | N   | r(feature, won) | ρ(feature, won) | r(feature, unit-return) | ρ(feature, unit-return) | reads as                                                       |
|-------------------|-----|-----------------|------------------|--------------------------|--------------------------|----------------------------------------------------------------|
| agsV12ForMean     | 1210 |          +0.059 |           +0.122 |                   +0.032 |                   +0.059 | mean Q of FOR-side wallets — higher should help                |
| agsV12AgMean      | 1210 |          -0.008 |           +0.312 |                   +0.007 |                   +0.124 | mean Q of AGAINST-side wallets — higher should HURT (negative correlation expected) |
| agsV12ForCount    | 1210 |          +0.013 |           +0.240 |                   -0.004 |                   +0.077 | count of contributing FOR-side wallets                         |
| agsV12AgCount     | 1210 |          -0.008 |           +0.200 |                   +0.017 |                   +0.111 | count of contributing AGAINST-side wallets                     |
| provenFor         | 1210 |          +0.018 |           +0.218 |                   +0.011 |                   +0.096 | count of proven (HC_BASE) FOR wallets                          |
| provenAg          | 1210 |          -0.003 |           +0.166 |                   +0.018 |                   +0.086 | count of proven (HC_BASE) AGAINST wallets                      |

#### Tercile breakdown — forMean vs realised ROI

If `agsV12ForMean` is doing real work, the high-tercile bucket should out-perform the low-tercile bucket on ROI. If they're flat or inverted, the FOR-side mean is not the driver of edge.

| Bucket            | range                  | N   | W-L     | Win %   | ROI       |
|-------------------|------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 8.285          | 405 | 210-195 |   51.9% |     -0.9% |
| MID (p33–p67)     | 19.950 … 16.527        | 402 | 222-180 |   55.2% |     +0.8% |
| HIGH (> p67)      | 48.906 … 49.311        | 403 | 226-177 |   56.1% |     +0.6% |

### 12D — Score distribution shape

Distribution-level diagnostics on the V12 score itself. Big shifts in mean/sd day-over-day mean V12 is shipping a meaningfully different population of picks. Heavy skew or fat tails (high kurtosis) are warnings that a small number of extreme scores are doing all the work.

| Stat              | Value     | reads as                                                       |
|-------------------|-----------|----------------------------------------------------------------|
| N (live picks)    |      1210 | live shipped & graded V12 picks                                 |
| Mean              |   +0.8042 | average score across live picks                                 |
| SD                |    0.2723 | dispersion — higher SD ⇒ V12 ships a wider spread of conviction |
| Skewness          |    -1.502 | + = right tail (rare super-strong picks) · − = left tail        |
| Excess kurtosis   |    +0.948 | 0 = normal · > 3 = fat tails (small N driving the ROI signal)    |
| p10 / p50 / p90   | +0.312 / +0.953 / +0.989 | bottom-decile / median / top-decile V12 score                   |
| min / max         | +0.000 / +0.998 | extreme scores observed on live picks                            |

### 12E — Discrimination by sport

AUC computed separately per sport — V12 may be sharp in one market and noise in another. Small-N sports are flagged with `(N<20)` so you don't over-react to early outcomes.

| Sport | N    | W-L    | Win %   | ROI       | AUC    | ρ(score, won) | reads as                                  |
|-------|------|--------|---------|-----------|--------|---------------|-------------------------------------------|
| CFB   |   60 | 33-27  |   55.0% |     -1.3% |  0.621 |        +0.180 | strong                                    |
| MLB   |  924 | 492-432 |   53.2% |     +3.7% |  0.520 |        -0.123 | noise                                     |
| NBA   |   10 | 3-7    |   30.0% |    +29.1% |  0.857 |        +0.515 | strong (N<20)                             |
| NFL   |   40 | 21-19  |   52.5% |     -2.8% |  0.529 |        -0.031 | noise                                     |
| NHL   |   12 | 6-6    |   50.0% |    -12.8% |  0.333 |        -0.350 | anti-signal (N<20)                        |
| SOC   |   55 | 36-19  |   65.5% |    +13.3% |  0.573 |        +0.062 | real                                      |
| UFC   |   41 | 29-12  |   70.7% |    +14.8% |  0.532 |        -0.041 | real                                      |
| WNBA  |   68 | 38-30  |   55.9% |     -1.8% |  0.562 |        +0.086 | real                                      |

### 12F — Stability: predictive edge over time (rolling 7-day window)

This is the **decay alarm**. We recompute the same two signals on a moving 7-day window and chart them so you can *see* the trend rather than read it off a wall of numbers:

- **Rolling AUC** — is the score still separating winners from losers *recently*? A line drifting toward 0.50 = the edge is fading.
- **Rolling edge (pp)** — realized win% minus the market-implied win% baked into the closing odds. This is the part that actually pays: a positive line means V12 is still beating the price the market set, *right now*.

**Rolling AUC** (0.50 = coin-flip line; above is signal, below is anti-signal):

```mermaid
xychart-beta
    title "Rolling 7-day AUC (window end date)"
    x-axis ["09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26", "09-27", "09-29", "09-30", "10-01", "10-02", "10-03", "10-04"]
    y-axis "AUC" 0.4 --> 0.65
    line [0.461, 0.486, 0.48, 0.429, 0.413, 0.402, 0.531, 0.575, 0.612, 0.609, 0.642, 0.636, 0.592, 0.57]
```

**Rolling edge vs market** (pp; 0 = exactly market price, above 0 = beating the close):

```mermaid
xychart-beta
    title "Rolling 7-day edge: realized − implied win% (pp)"
    x-axis ["09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26", "09-27", "09-29", "09-30", "10-01", "10-02", "10-03", "10-04"]
    y-axis "edge (pp)" -10 --> 4
    line [-8.1, -6.1, -5.1, 1.7, 2.3, -0.9, 0.1, -2.9, -4.2, -3.3, -1.3, -0.2, -2.6, -5.7]
```

Underlying windows (each anchored on its END date):

| Window end | Days | N    | W-L    | Win %   | ROI       | AUC    | Edge vs mkt |
|------------|------|------|--------|---------|-----------|--------|-------------|
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
| 2026-10-03 |    7 |   73 | 38-35  |   52.1% |     -6.3% |  0.592 |      -2.6pp |
| 2026-10-04 |    7 |   56 | 27-29  |   48.2% |    -12.1% |  0.570 |      -5.7pp |

> 🟡 **AUC is roughly flat** — no meaningful drift, V12 holding steady (0.521 avg in first half → 0.536 avg in second half · Δ = +0.015)

### 12G — Bootstrap 95% confidence intervals (1000 resamples)

Resample the live V12 picks (with replacement, 1000 iterations) and recompute key stats on each resample. The 2.5th–97.5th percentiles give a 95% confidence band — anything narrower means we can be confident the metric isn't just luck; anything wider means current N is too low to claim a trend.

| Metric                       | Point estimate | 95% CI               | Reads as                                                  |
|------------------------------|----------------|----------------------|-----------------------------------------------------------|
| ROI (%)                      |          +3.8% | [-2.0%, +9.1%]  | If CI crosses 0%, ROI is statistically indistinguishable from break-even |
| Win %                        |          54.4% | [51.5%, 57.1%]  | Range you'd expect the long-run win rate to fall in            |
| AUC                          |          0.537 | [0.505, 0.568]    | If CI lo ≤ 0.50, edge is not statistically established yet      |
| Wins − Losses                |            107 | [36, 172]      | Flat-bet hit count range                                       |

> 🟡 **ROI CI crosses zero** — current sample size cannot distinguish edge from break-even. Keep shipping picks and re-check

## § 10 — Wallet Influence

> **Why this section matters.** V12 is built entirely on what the qualifying wallets do — the score is literally a difference of their mean qualities on each side of the pick. If 80% of our shipped picks are driven by the same 5 wallets, V12 is concentrated risk on those wallets' continued performance. This section names who they are and how they're doing.

### 13A — Influence overview

| Metric                                       | Value                                                     |
|----------------------------------------------|-----------------------------------------------------------|
| Live V12 picks analysed                      |                                                      1215 |
| Unique wallets ever on a FOR side            |                                                       396 |
| Avg FOR-side wallets per pick                |                                                      3.20 |
| Top-5 wallets' share of all FOR appearances  |                                                     18.7% |
| Top-10 wallets' share of all FOR appearances |                                                     30.3% |
| Top-20 wallets' share of all FOR appearances |                                                     45.6% |

> 🟢 **Influence is well-distributed** — no single wallet (or small cluster) dominates V12's picks.

### 13B — Top 20 most-influential wallets (by # FOR-side appearances on V12 live picks)

These are the wallets V12 is "listening to" the most. Each row also shows how the picks they were FOR have actually performed since V12 went live, plus their current whitelist tier / prior ROI from the wallet-profile snapshot.

| Rank | Wallet  | Sports     | FOR# | AG#  | W-L    | Win %   | ROI       | PnL (u)   | Avg sizeR | Tier        | Prior ROI | Prior N | Last seen  |
|------|---------|------------|------|------|--------|---------|-----------|-----------|-----------|-------------|-----------|---------|------------|
|    1 | 4b912c  | CFB,MLB,NFL,NHL,SOC,WNBA |  217 |  130 | 108-109 |   49.8% |     -0.4% |     -2.06 |     1.44× | WR50        |     -5.7% |    1052 | 2026-10-04 |
|    2 | 0cd77e  | CFB,MLB,NFL,NHL,SOC,UFC,WNBA |  163 |   28 | 89-74  |   54.6% |    +12.7% |    +58.52 |     1.58× | WR50        |     -4.8% |     467 | 2026-10-04 |
|    3 | cd2f63  | CFB,MLB,NBA,NFL,SOC,WNBA |  120 |   72 | 66-54  |   55.0% |    +13.6% |    +47.03 |     1.17× | CONFIRMED   |     +5.2% |     836 | 2026-10-03 |
|    4 | 0f9d74  | CFB,MLB,NBA,NFL,SOC,UFC |  113 |   85 | 63-50  |   55.8% |    +13.8% |    +40.53 |     0.59× | CONFIRMED   |     +6.6% |     612 | 2026-10-04 |
|    5 | eeabaf  | CFB,MLB,NBA,NFL,SOC,UFC |  112 |   77 | 55-57  |   49.1% |     +1.4% |     +4.53 |     1.21× | CONFIRMED   |     +0.6% |     618 | 2026-10-02 |
|    6 | 5b1e50  | MLB,NBA,NHL,SOC,WNBA |  103 |   65 | 66-37  |   64.1% |    +17.3% |    +59.67 |     1.54× | CONFIRMED   |     +7.9% |     350 | 2026-09-11 |
|    7 | 1e8f33  | MLB,SOC    |   94 |    9 | 50-44  |   53.2% |    -10.7% |    -28.21 |     1.05× | WR50        |     +5.5% |     201 | 2026-07-05 |
|    8 | 4c64aa  | MLB        |   92 |   13 | 50-42  |   54.3% |     +1.1% |     +1.94 |     0.84× | WR50        |     -1.4% |     336 | 2026-08-05 |
|    9 | 2f2a9e  | CFB,MLB,NFL,SOC,WNBA |   86 |   33 | 45-41  |   52.3% |     -7.7% |    -18.05 |     1.97× | WR50        |     -7.9% |     313 | 2026-09-26 |
|   10 | 70135d  | MLB,NBA    |   77 |   68 | 42-35  |   54.5% |     +4.7% |     +8.93 |     1.30× | WR50        |     -4.3% |     502 | 2026-07-10 |
|   11 | 7da3d5  | CFB,MLB,NFL,SOC,UFC,WNBA |   71 |   71 | 35-36  |   49.3% |     -0.8% |     -1.51 |     3.20× | CONFIRMED   |     -2.4% |     458 | 2026-09-29 |
|   12 | 69f882  | CFB,MLB,NFL,SOC,UFC,WNBA |   68 |   36 | 39-29  |   57.4% |     +3.8% |     +7.41 |     1.99× | CONFIRMED   |     +3.1% |     303 | 2026-10-03 |
|   13 | 7923c4  | MLB,NBA,NHL,UFC |   67 |   21 | 39-28  |   58.2% |    +20.2% |    +34.92 |     0.93× | CONFIRMED   |     +6.6% |     284 | 2026-10-03 |
|   14 | 51176e  | CFB,MLB,NFL |   67 |    7 | 39-28  |   58.2% |     +5.1% |    +11.54 |     0.99× | CONFIRMED   |     +2.7% |     197 | 2026-10-04 |
|   15 | 9214c2  | MLB        |   65 |   17 | 30-35  |   46.2% |     -3.0% |     -5.45 |     1.23× | CONFIRMED   |     +6.7% |     250 | 2026-09-30 |
|   16 | 705ba1  | MLB        |   63 |   45 | 31-32  |   49.2% |     -1.2% |     -2.12 |     1.10× | WR50        |     +3.2% |     341 | 2026-09-23 |
|   17 | bc35e3  | CFB,MLB,NFL,NHL,SOC,UFC,WNBA |   58 |   29 | 27-31  |   46.6% |     +0.5% |     +0.81 |     1.11× | CONFIRMED   |     -4.1% |     296 | 2026-10-04 |
|   18 | 3bdd7e  | CFB,MLB,NFL,SOC,WNBA |   50 |   21 | 31-19  |   62.0% |    +17.0% |    +17.13 |     2.74× | CONFIRMED   |    -10.0% |     208 | 2026-09-09 |
|   19 | 621848  | MLB,NHL,SOC,UFC,WNBA |   45 |   15 | 27-18  |   60.0% |     -1.1% |     -1.40 |     0.57× | CONFIRMED   |     +5.8% |     146 | 2026-10-03 |
|   20 | a0cff6  | MLB,NBA,NFL,NHL,SOC,UFC,WNBA |   43 |   33 | 27-16  |   62.8% |    +15.3% |    +17.89 |     2.06× | CONFIRMED   |     -7.6% |     300 | 2026-10-03 |

### 13C — Best-performing wallets (ROI when on the FOR side; min 10 appearances)

Among wallets with at least **10 FOR-side appearances** on live V12 picks, ranked by realised ROI. These are the wallets whose presence on a pick should give the most confidence going forward.

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | 36b57a  | MLB        |   10 | 8-2    |   80.0% |     +88.0% |    +19.79 |     0.61× | 2026-09-24 |
|    2 | 06c80c  | MLB,NFL,SOC |   11 | 10-1   |   90.9% |     +74.7% |    +29.51 |     1.65× | 2026-09-21 |
|    3 | d66e28  | CFB,MLB,NFL,WNBA |   23 | 18-5   |   78.3% |     +59.9% |    +35.21 |     0.65× | 2026-10-03 |
|    4 | a10ff5  | MLB,SOC    |   15 | 12-3   |   80.0% |     +59.7% |    +30.13 |     1.13× | 2026-08-19 |
|    5 | 491f30  | MLB,SOC    |   25 | 17-8   |   68.0% |     +43.8% |    +35.89 |     0.95× | 2026-07-01 |
|    6 | 199296  | MLB        |   10 | 7-3    |   70.0% |     +43.0% |    +16.71 |     2.76× | 2026-09-15 |
|    7 | 2dc4f6  | CFB,MLB,NFL,WNBA |   17 | 11-6   |   64.7% |     +41.4% |    +16.92 |     0.58× | 2026-09-26 |
|    8 | f9e3d0  | MLB,NBA    |   11 | 6-5    |   54.5% |     +35.2% |    +12.85 |     1.33× | 2026-08-26 |
|    9 | bc3532  | MLB,NBA,NHL |   11 | 6-5    |   54.5% |     +30.7% |     +4.07 |     2.17× | 2026-06-18 |
|   10 | 9a4d38  | MLB,UFC,WNBA |   28 | 18-10  |   64.3% |     +28.9% |    +23.72 |     0.11× | 2026-08-28 |
|   11 | c668b3  | MLB,NBA,SOC |   13 | 9-4    |   69.2% |     +26.9% |     +9.47 |     0.52× | 2026-07-07 |
|   12 | f2d227  | MLB,NBA,NFL |   12 | 8-4    |   66.7% |     +20.9% |     +6.20 |     0.94× | 2026-09-27 |
|   13 | 7923c4  | MLB,NBA,NHL,UFC |   67 | 39-28  |   58.2% |     +20.2% |    +34.92 |     0.93× | 2026-10-03 |
|   14 | de3f67  | NBA,SOC    |   10 | 5-5    |   50.0% |     +19.9% |     +5.37 |     1.97× | 2026-09-20 |
|   15 | 4c8ed9  | CFB,MLB,NFL,NHL,SOC,UFC,WNBA |   34 | 19-15  |   55.9% |     +19.9% |    +15.13 |     3.10× | 2026-10-03 |

### 13D — Worst-performing wallets (potential anti-signals; min 10 appearances)

Same filter, sorted ROI ascending. Wallets that consistently lose when they're on V12's FOR side. If any of these are appearing in §13B's top influencers, V12 is being dragged down by chronic losers — those wallets may need to be downgraded from the qualifying pool (see `exportWalletProfiles.js`).

| Rank | Wallet  | Sports     | FOR# | W-L    | Win %   | ROI        | PnL (u)   | Avg sizeR | Last seen  |
|------|---------|------------|------|--------|---------|------------|-----------|-----------|------------|
|    1 | dfa240  | CFB,MLB,NFL,NHL |   14 | 3-11   |   21.4% |     -49.8% |    -19.19 |     1.30× | 2026-10-04 |
|    2 | 10c684  | MLB,NBA    |   14 | 4-10   |   28.6% |     -46.0% |     -8.74 |     1.66× | 2026-08-29 |
|    3 | 8ec926  | MLB,UFC,WNBA |   15 | 6-9    |   40.0% |     -33.0% |    -14.53 |     5.31× | 2026-08-26 |
|    4 | 120215  | MLB,NFL,SOC |   15 | 6-9    |   40.0% |     -29.8% |    -12.08 |     1.27× | 2026-10-04 |
|    5 | 2a8409  | MLB,NFL,WNBA |   27 | 9-18   |   33.3% |     -27.6% |    -17.78 |     1.47× | 2026-09-20 |
|    6 | 767ff5  | CFB,MLB,NFL,SOC |   16 | 6-10   |   37.5% |     -26.0% |    -12.33 |     1.22× | 2026-10-02 |
|    7 | df8add  | MLB,NFL,SOC |   22 | 10-12  |   45.5% |     -20.9% |    -10.97 |     1.53× | 2026-10-04 |
|    8 | cc63b8  | CFB,MLB,NFL,NHL,WNBA |   19 | 9-10   |   47.4% |     -17.1% |    -11.37 |     1.15× | 2026-10-03 |
|    9 | e55973  | MLB,NFL,SOC,UFC |   15 | 6-9    |   40.0% |     -15.3% |     -6.66 |     0.63× | 2026-09-19 |
|   10 | f2f960  | MLB        |   26 | 12-14  |   46.2% |     -15.0% |    -13.64 |     2.90× | 2026-08-04 |
|   11 | e41fbe  | CFB,MLB,NFL,NHL |   17 | 8-9    |   47.1% |     -14.9% |     -9.98 |     1.59× | 2026-10-03 |
|   12 | 1e8f33  | MLB,SOC    |   94 | 50-44  |   53.2% |     -10.7% |    -28.21 |     1.05× | 2026-07-05 |
|   13 | 2f2a9e  | CFB,MLB,NFL,SOC,WNBA |   86 | 45-41  |   52.3% |      -7.7% |    -18.05 |     1.97× | 2026-09-26 |
|   14 | 7cc9a7  | CFB,MLB,NFL |   24 | 11-13  |   45.8% |      -7.1% |     -5.10 |     1.58× | 2026-10-04 |
|   15 | c9bba3  | CFB,MLB,NFL,SOC |   23 | 13-10  |   56.5% |      -5.9% |     -3.14 |     1.08× | 2026-09-25 |

> 🔴 **2 wallet(s) appear in BOTH the top-20 most-influential list AND the worst-performers list with ROI < −5%.** They are actively dragging V12's results down while having heavy say in pick generation. Candidates: `1e8f33` (FOR# 94, ROI -10.7%), `2f2a9e` (FOR# 86, ROI -7.7%).

## § 11 — Ops & Calibration

### Pipeline sanity

| Check                                                          | Count | Verdict                                            |
|----------------------------------------------------------------|-------|----------------------------------------------------|
| Graded picks with `tracked=true` AND `finalUnits > 0`         |     1 | 🚨 grader regression — see betTracking.js |
| Graded picks with `tracked=true` AND `finalUnits == 0`        |  3693 | 🟡 informational only — true tracked plays |
| LOCK+ tier picks with `finalUnits == 0` (sizing regression)   |   997 | 🚨 sizing regression — agsSizeMultiplier returning 0 for strong AGS-U |
| Live picks (not graded yet) with `finalUnits > 0`             |    13 | 🟢 picks queued for grading |
| AGS-U promoted picks missing `v8_ags` value                   |   156 | 🟡 some picks missing AGS-U — cron lag or stale doc |
| AGS-U promoted picks missing `agsTier`                        |     7 | 🟡 some picks missing tier classification |
| Single-wallet shipped picks (`provenWalletCount == 1`)       |   431 | 🟡 informational — AGS-U calibration controls sample adequacy |

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
| MLB   |            402 |        53 |    0 |  114 |  235 |                    167 |
| NBA   |            211 |        24 |    0 |   71 |  116 |                     95 |
| NHL   |            165 |        16 |    0 |   46 |  103 |                     62 |
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
| v12     | 06-01 → present      |  126 |   1215 | 2611 | 661-554 |  54.4% |      3.8% |    +129.65 |    +0.11 | 0.512 |        0.2498 | 🟢 LIVE  |

### v12 vs prior versions

| Comparison         | ΔN     | ΔWin %    | ΔROI       | Δ per-pick (u)  | ΔAUC     | ΔBrier     | Verdict |
|--------------------|--------|-----------|------------|-----------------|----------|------------|---------|
| v12 − v9           | + 1155 |    +1.1pp |    +12.7pp |          +0.280 |   -0.037 |    +0.0902 | 🟡 mixed |
| v12 − v10          | + 1153 |    +6.0pp |    +22.5pp |          +0.420 |   +0.118 |    +0.0306 | 🟢 better |
| v12 − v11          | + 1104 |    -0.6pp |     +1.0pp |          +0.046 |   +0.068 |    +0.0144 | 🟡 mixed |

> **ΔBrier > 0** means the newer model's Brier is LOWER (better probability calibration). All other Δ columns: positive = newer model is better. Verdict requires the newer model to dominate on 3 of 4 metrics (ROI / Win% / AUC / Brier).

> **On v12's Brier.** The v12 score is a bounded `[-1, +1]` wallet-quality differential, not a probability. To make Brier comparable to the older logit models, the score is mapped to a win probability via an **in-sample 1-D logistic calibration** (`p = sigmoid(a + b·score)`). Because it's fit on the same picks it scores, treat it as a mildly optimistic floor on true calibration error — the per-staking-book breakdown in § 9 is the more actionable read.

### Per-sport win rate × version

| Version | CFB            | MLB            | NBA            | NFL            | NHL            | SOC            | UFC            | WNBA           | All           |
|---------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|---------------|
| v9      | —              | 40n 55.0% -3%  | 14n 50.0% -7%  | —              | 6n 50.0% -46%  | —              | —              | —              | 60n 53.3% -9% |
| v10     | —              | 50n 52.0% -4%  | 7n 14.3% -91%  | —              | 5n 60.0% -9%   | —              | —              | —              | 62n 48.4% -19% |
| v11     | —              | 96n 56.3% +4%  | 7n 71.4% +33%  | —              | 8n 25.0% -59%  | —              | —              | —              | 111n 55.0% +3% |
| v12     | 60n 55.0% -1%  | 928n 53.2% +4% | 10n 30.0% +29% | 40n 52.5% -3%  | 12n 50.0% -13% | 56n 66.1% +14% | 41n 70.7% +15% | 68n 55.9% -2%  | 1215n 54.4% +4% |

### Per-tier ROI × version (monotonicity check across model history)

| Version | ELITE         | PREMIUM       | LOCK          | LEAN          | WEAK          | Monotonic?    |
|---------|---------------|---------------|---------------|---------------|---------------|---------------|
| v9      | 10n -25%      | 6n +10%       | 13n -32%      | 16n +24%      | 14n -6%       | 🟡 partial (0) |
| v10     | 8n -13%       | 5n -69%       | 13n -25%      | 27n +4%       | 8n -1%        | 🟡 partial (0) |
| v11     | 22n +3%       | 26n -6%       | 24n +9%       | 25n +10%      | 13n +22%      | 🟡 partial (2) |
| v12     | 241n +7%      | 296n +2%      | 245n +4%      | 152n -4%      | 275n +5%      | 🟡 partial (0) |

> Monotonicity score on tier-ROI vector (ELITE → WEAK). Fully sorted (each tier earns LESS than the one above) = -3 for 4-tier samples / -4 for full ladder. Fully inverted = +3/+4. A NEW model that flips the ladder from inverted → monotonic is the strongest evidence the redesign worked.

## Appendix B — AGS-U Full-History Feature Lab

> **Why this section matters.** V12 makes a deliberate bet that **wallet-quality mean ratio** is the single best predictor of pick outcomes. This section tests that assumption against ~4108 graded AGS-U picks since cutover. For every plausible feature we have stamped on a pick, we measure how strongly it correlates with **winning** and with **per-unit PnL** — first individually, then in concert via multivariate regression. The closing sub-section (§17F) cross-references the data-driven top features against the ones V12 actually uses, so any signal V12 is leaving on the table is named explicitly.

### 17A — Candidate feature panel & coverage

We test 26 candidate features across 1449 live graded picks. "Coverage %" = share of picks where the feature is non-null (some features are only stamped on V12-era picks, some on lock time, etc.). Features below ~40% coverage are still tested univariately but **excluded from the multivariate regression** in §17E because OLS requires complete rows.

| Feature              | Coverage          | Meaning                                                              |
|----------------------|-------------------|----------------------------------------------------------------------|
| agsV12 🟢            | 1210 / 1449 (84%) | V12 score itself — bounded wallet-quality differential               |
| V12 forMean 🟢       | 1210 / 1449 (84%) | Mean wallet quality (Q) of FOR-side proven wallets                   |
| V12 agMean 🟢        | 1210 / 1449 (84%) | Mean wallet quality (Q) of AGAINST-side proven wallets               |
| qMargin 🟢           | 1210 / 1449 (84%) | forMean − agMean (raw difference, pre-bounding)                      |
| V12 forCount 🟢      | 1210 / 1449 (84%) | Count of proven FOR-side wallets contributing to V12                 |
| V12 agCount 🟢       | 1210 / 1449 (84%) | Count of proven AGAINST-side wallets                                 |
| countMargin          | 1210 / 1449 (84%) | forCount − agCount (signed wallet-count advantage)                   |
| ags (v11)            | 1449 / 1449 (100%) | V11 logistic composite score — predecessor of V12                    |
| provenFor            | 1449 / 1449 (100%) | Count of HC_BASE (CONFIRMED/FLAT) wallets FOR the pick               |
| provenAg             | 1449 / 1449 (100%) | Count of HC_BASE wallets AGAINST the pick                            |
| provenTotal          | 1449 / 1449 (100%) | Total HC_BASE wallets touching the game                              |
| provenMargin         | 1449 / 1449 (100%) | provenFor − provenAg                                                 |
| hcMargin             | 1449 / 1449 (100%) | High-conviction margin from v11 — signed conviction differential     |
| lockPinnProb         | 1442 / 1449 (100%) | Pinnacle implied probability at lock time (the line itself)          |
| clv                  | 1435 / 1449 (99%) | Closing line value — how far line moved in our favour                |
| peakStars            | 1449 / 1449 (100%) | Star rating at peak (heuristic conviction grade)                     |
| wd forCount          | 1448 / 1449 (100%) | Wallet-detail-derived FOR side count (any wallet, not just HC_BASE)  |
| wd agCount           | 957 / 1449 (66%)  | Wallet-detail-derived AGAINST side count                             |
| wd forAvgSize        | 1448 / 1449 (100%) | Avg sizeRatio of FOR-side wallets (size vs their own avg)            |
| wd agAvgSize         | 957 / 1449 (66%)  | Avg sizeRatio of AGAINST-side wallets                                |
| wd sizeMargin        | 956 / 1449 (66%)  | forAvgSize − agAvgSize (signed sizing advantage)                     |
| wd contribFor        | 1449 / 1449 (100%) | Σ contribution (walletBase × convictionMult) on FOR side             |
| wd contribAg         | 1449 / 1449 (100%) | Σ contribution on AGAINST side                                       |
| wd contribMargin     | 1449 / 1449 (100%) | forContrib − agContrib (total weighted-money advantage)              |
| wd maxForContrib     | 1448 / 1449 (100%) | Max single-wallet contribution on FOR side                           |
| wd maxShare          | 1449 / 1449 (100%) | Largest single contribution / total (concentration risk)             |

> 🟢 = feature is currently consumed by V12. All others are observed but unused.

### 17B — Univariate impact (each feature on its own)

Each row tests one feature in isolation. Sorted by **|r(feature, unit-return)|** descending — i.e. the strongest correlations with per-unit profit are at the top. Use the **AUC** column for a clean "does this one feature beat a coin flip at separating winners from losers" read.

| Rank | Feature              | N   | V12? | r(won)    | ρ(won)    | r(unit-ret) | ρ(unit-ret) | AUC    |
|------|----------------------|-----|------|-----------|-----------|-------------|-------------|--------|
|    1 | wd contribMargin     | 1449 |      |    -0.017 |    -0.072 |      -0.041 |      -0.071 |  0.481 |
|    2 | wd sizeMargin        | 956 |      |    -0.018 |    -0.023 |      -0.040 |      -0.062 |  0.489 |
|    3 | wd agCount           | 957 |      |    +0.014 |    +0.251 |      +0.036 |      +0.129 |  0.503 |
|    4 | wd agAvgSize         | 957 |      |    +0.018 |    +0.027 |      +0.035 |      +0.042 |  0.510 |
|    5 | V12 forMean          | 1210 |  🟢  |    +0.059 |    +0.122 |      +0.032 |      +0.059 |  0.526 |
|    6 | qMargin              | 1210 |  🟢  |    +0.064 |    +0.057 |      +0.031 |      +0.022 |  0.522 |
|    7 | wd maxForContrib     | 1448 |      |    -0.037 |    -0.068 |      -0.030 |      -0.031 |  0.490 |
|    8 | lockPinnProb         | 1442 |      |    +0.190 |    +0.170 |      +0.027 |      -0.117 |  0.599 |
|    9 | wd contribFor        | 1449 |      |    -0.018 |    -0.004 |      -0.026 |      -0.018 |  0.482 |
|   10 | hcMargin             | 1449 |      |    +0.001 |    +0.211 |      -0.026 |      +0.061 |  0.511 |
|   11 | clv                  | 1435 |      |    -0.026 |    +0.081 |      -0.025 |      +0.030 |  0.516 |
|   12 | wd forCount          | 1448 |      |    -0.007 |    +0.189 |      -0.020 |      +0.045 |  0.491 |
|   13 | wd maxShare          | 1449 |      |    +0.026 |    -0.098 |      +0.020 |      -0.033 |  0.513 |
|   14 | V12 agCount          | 1210 |  🟢  |    -0.008 |    +0.200 |      +0.017 |      +0.111 |  0.498 |
|   15 | ags (v11)            | 1449 |      |    +0.007 |    +0.041 |      -0.017 |      -0.022 |  0.516 |
|   16 | countMargin          | 1210 |      |    +0.020 |    +0.129 |      -0.016 |      +0.010 |  0.503 |
|   17 | wd contribAg         | 1449 |      |    -0.005 |    +0.131 |      +0.014 |      +0.062 |  0.487 |
|   18 | agsV12               | 1210 |  🟢  |    +0.031 |    -0.031 |      +0.013 |      -0.017 |  0.537 |
|   19 | provenMargin         | 1449 |      |    +0.008 |    +0.112 |      -0.012 |      +0.017 |  0.510 |
|   20 | wd forAvgSize        | 1448 |      |    +0.006 |    +0.055 |      -0.010 |      +0.002 |  0.514 |
|   21 | peakStars            | 1449 |      |    +0.032 |    +0.045 |      +0.010 |      -0.011 |  0.519 |
|   22 | provenFor            | 1449 |      |    -0.003 |    +0.134 |      -0.008 |      +0.034 |  0.504 |
|   23 | V12 agMean           | 1210 |  🟢  |    -0.008 |    +0.312 |      +0.007 |      +0.124 |  0.476 |
|   24 | provenAg             | 1449 |      |    -0.014 |    +0.173 |      +0.004 |      +0.081 |  0.488 |
|   25 | V12 forCount         | 1210 |  🟢  |    +0.013 |    +0.240 |      -0.004 |      +0.077 |  0.509 |
|   26 | provenTotal          | 1449 |      |    -0.009 |    +0.093 |      -0.004 |      +0.036 |  0.495 |

> **Top 3 univariate features by PnL correlation:** `wd contribMargin` (r = -0.041), `wd sizeMargin` (r = -0.040), `wd agCount` (r = +0.036).

### 17C — Tercile-bucket ROI for the top 5 features

Splits each feature into thirds (low / mid / high) and shows realised ROI in each bucket. If the feature is genuinely impactful, you should see a **monotonic ROI gradient** (high bucket > mid > low, or vice-versa). Flat or inverted bucket ROIs mean the correlation is noise.

#### `wd contribMargin` · r(unit-ret) = -0.041 · AUC = 0.481

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -19.300 … 8.856          | 483 | 271-212 |   56.1% |     +1.8% |
| MID (p33–p67)     | 57.800 … 45.900          | 483 | 264-219 |   54.7% |     +0.5% |
| HIGH (> p67)      | 174.100 … 81.300         | 483 | 250-233 |   51.8% |     -2.1% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd sizeMargin` · r(unit-ret) = -0.040 · AUC = 0.489

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | -5.631 … -0.726          | 319 | 179-140 |   56.1% |     +2.2% |
| MID (p33–p67)     | 0.078 … -0.034           | 318 | 165-153 |   51.9% |     +0.0% |
| HIGH (> p67)      | 3.728 … 1.303            | 319 | 168-151 |   52.7% |     -2.5% |

> 🔴 strictly monotone DOWN (higher feature ⇒ lower ROI — feature is INVERSE)

#### `wd agCount` · r(unit-ret) = +0.036 · AUC = 0.503

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 1.000 … 1.000            | 413 | 221-192 |   53.5% |     -0.6% |
| MID (p33–p67)     | 2.000 … 2.000            | 228 | 119-109 |   52.2% |     -0.9% |
| HIGH (> p67)      | 3.000 … 12.000           | 316 | 172-144 |   54.4% |     +0.9% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

#### `wd agAvgSize` · r(unit-ret) = +0.035 · AUC = 0.510

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 0.110 … 0.489            | 319 | 162-157 |   50.8% |     -3.2% |
| MID (p33–p67)     | 0.699 … 0.971            | 319 | 173-146 |   54.2% |     +0.4% |
| HIGH (> p67)      | 6.557 … 1.222            | 319 | 177-142 |   55.5% |     +2.3% |

> 🟢 strictly monotone UP (higher feature ⇒ higher ROI)

#### `V12 forMean` · r(unit-ret) = +0.032 · AUC = 0.526

| Bucket            | range                    | N   | W-L     | Win %   | ROI       |
|-------------------|--------------------------|-----|---------|---------|-----------|
| LOW (≤ p33)       | 8.379 … 8.285            | 405 | 210-195 |   51.9% |     -0.9% |
| MID (p33–p67)     | 19.950 … 16.527          | 402 | 222-180 |   55.2% |     +0.8% |
| HIGH (> p67)      | 48.906 … 49.311          | 403 | 226-177 |   56.1% |     +0.6% |

> 🟡 non-monotonic across buckets — correlation may be partially noise

### 17D — Multicollinearity check (pairwise correlation among top 8 features)

Before running multivariate OLS, check whether the top features are measuring redundant things. **|r| > 0.85** is a red flag — the regression will inflate standard errors and β estimates become unstable. In that case, drop one of the pair before interpreting §17E.

| feat \ feat | wd contribMargin | wd sizeMargin  | wd agCount     | wd agAvgSize   | V12 forMean    | qMargin        | wd maxForContrib | lockPinnProb   |
|-------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|----------------|
| wd contribMargin |  1.000         |         +0.229 |         -0.126 |         -0.133 |         +0.037 |         +0.034 |         +0.506 |         +0.174 |
| wd sizeMargin |         +0.229 |  1.000         |         +0.030 |         -0.680 |         +0.174 |         +0.170 |         +0.215 |         +0.122 |
| wd agCount  |         -0.126 |         +0.030 |  1.000         |         +0.083 |         +0.047 |         -0.057 |         +0.273 |         -0.074 |
| wd agAvgSize |         -0.133 |         -0.680 |         +0.083 |  1.000         |         -0.030 |         -0.048 |         +0.071 |         -0.083 |
| V12 forMean |         +0.037 |         +0.174 |         +0.047 |         -0.030 |  1.000         |         +0.932 |         +0.138 |         +0.083 |
| qMargin     |         +0.034 |         +0.170 |         -0.057 |         -0.048 |         +0.932 |  1.000         |         +0.107 |         +0.097 |
| wd maxForContrib |         +0.506 |         +0.215 |         +0.273 |         +0.071 |         +0.138 |         +0.107 |  1.000         |         +0.022 |
| lockPinnProb |         +0.174 |         +0.122 |         -0.074 |         -0.083 |         +0.083 |         +0.097 |         +0.022 |  1.000         |

> 🔴 **Strong collinearity detected:** `V12 forMean` and `qMargin` have r = +0.932. They're measuring nearly the same thing. The multivariate β estimates below will split credit between them unreliably; treat the looser of the two as a noise channel.

### 17E — Multivariate OLS: standardized β for top 8 features

Regress **per-pick unit-return** on the z-scored top features simultaneously. The standardized **β** tells you "how much does a 1-σ change in this feature shift per-unit PnL, holding the others constant." Compare |β| across features to rank impact when controlling for the others — this is the multivariate sibling of the univariate r column above.

**Model fit:** N = 836 picks · features = 8 (+ intercept) · multiple R² = **0.0079** · adjusted R² = **-0.0029** · residual sd = 0.956

| Rank | Feature              | V12? | β (std)    | SE       | t-stat   | |β| rank |
|------|----------------------|------|------------|----------|----------|----------|
|    1 | wd contribMargin     |     |    -0.0457 |   0.0419 | -1.09        |        1 |
|    2 | wd agCount           |     |    +0.0307 |   0.0378 | +0.81        |        2 |
|    3 | qMargin              |  🟢 |    +0.0297 |   0.0952 | +0.31        |        3 |
|    4 | wd agAvgSize         |     |    +0.0259 |   0.0480 | +0.54        |        4 |
|    5 | wd sizeMargin        |     |    -0.0246 |   0.0492 | -0.50        |        5 |
|    6 | lockPinnProb         |     |    +0.0218 |   0.0340 | +0.64        |        6 |
|    7 | wd maxForContrib     |     |    +0.0116 |   0.0443 | +0.26        |        7 |
|    8 | V12 forMean          |  🟢 |    +0.0105 |   0.0951 | +0.11        |        8 |
| —    | (intercept)          |     |    +0.0074 |   0.0330 |    +0.23 | —        |

> **|t-stat| ≥ 2** ≈ p < 0.05 (roughly significant). `(~sig)` flags |t| ≥ 1.5 — suggestive but not conclusive at our sample size. A feature with a large univariate r but small multivariate β is being **explained away** by other features in the panel.

### 17F — V12 vs the data-driven best

Cross-reference: of the top 8 features by multivariate |β|, which does V12 actually use, and which does it ignore?

- **2 / 8** top multivariate features are inputs to V12 (25%).
- V12 consumes: `qMargin` (β = +0.030), `V12 forMean` (β = +0.010)
- V12 IGNORES: `wd contribMargin` (β = -0.046, t = -1.09), `wd agCount` (β = +0.031, t = +0.81), `wd agAvgSize` (β = +0.026, t = +0.54), `wd sizeMargin` (β = -0.025, t = -0.50), `lockPinnProb` (β = +0.022, t = +0.64), `wd maxForContrib` (β = +0.012, t = +0.26)

| Model                              | AUC    | reads as                                                         |
|------------------------------------|--------|------------------------------------------------------------------|
| V12 score alone                    |  0.536 | how well V12's single number sorts winners from losers           |
| Multivariate OLS on top 8 features |  0.568 | best AUC achievable by linearly combining the top features         |

> ⚠ **Honesty caveat.** The multivariate AUC is **in-sample** — the model was fit on the same picks it's being scored against. Expect the true out-of-sample AUC to be lower by ~0.03–0.08, depending on how much of the gap is overfit. The point of this row is not to declare V12 "worse" but to flag the **maximum upside** still on the table; if even a haircutted out-of-sample version of the multivariate beats V12 by a clear margin, the feature set should be reconsidered.

> 🟢 **AUC gap = +0.031.** Modest but real — extra features marginally improve discrimination. Worth tracking; revisit when sample doubles.

### 17G — Actionable recommendations

- Adjusted R² of -0.0029 confirms that **sports picks are dominated by variance** — no realistic linear combination of stamped features will explain more than a few percent of outcome variance. The value of V12 (or any future model) lies in capturing the small, persistent signal at the top of the score distribution, not in high R² explanation.

---

*Generated by `scripts/dailyAgsUReport.js` · workflow `daily-agsu-report.yml` · V12-scoped unless Appendix.*